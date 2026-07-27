/* Test gia sư AI với nhà cung cấp GIẢ (AI_PROVIDER=mock) — không gọi mạng,
 * không cần khoá. Kiểm đúng những chỗ dễ hỏng: chặn chưa đăng nhập, hạn mức
 * mỗi ngày, ngữ cảnh dựng ở máy chủ, và có ghi nhật ký câu sai không.
 * Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { newDb } = require("pg-mem");

process.env.AI_PROVIDER = "mock";
process.env.AI_FREE_PER_DAY = "3";

const { initDb } = require("../db");
const { createApp } = require("../app");
const { dungSystem, locLichSu, hopLe } = require("../tutor");
const { layBai, layCau } = require("../lessons");

let srv, base, pool, cookie = "";

function req(path, opts = {}) {
  return fetch(base + path, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", cookie },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (res) => {
    const setC = res.headers.get("set-cookie");
    if (setC) cookie = setC.split(";")[0];
    const raw = await res.text();
    let data = {};
    try { data = JSON.parse(raw); } catch (e) { data = { raw }; }
    return { status: res.status, data, raw };
  });
}

/* Gom luồng NDJSON thành { chu, xong } */
function gomLuong(raw) {
  let chu = "", xong = null, loi = null;
  raw.split("\n").filter(Boolean).forEach((d) => {
    let o; try { o = JSON.parse(d); } catch (e) { return; }
    if (o.t) chu += o.t;
    if (o.loi) loi = o.loi;
    if (o.xong) xong = o;
  });
  return { chu, xong, loi };
}

before(async () => {
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  pool = await initDb(new Pool());
  const app = createApp({ pool, sessionStore: new session.MemoryStore() });
  srv = app.listen(0);
  base = "http://127.0.0.1:" + srv.address().port;
});

after(() => srv && srv.close());

/* ---------------------------- phần thuần hàm ---------------------------- */

test("rào chắn câu hỏi: rỗng / spam bị loại, dài bị cắt", () => {
  assert.equal(hopLe(""), "");
  assert.equal(hopLe("  a "), "");
  assert.equal(hopLe("aaaaaaaaaaaaaaa"), "");        // gõ một ký tự lặp
  assert.equal(hopLe("x".repeat(900)), "");          // dài nhưng vẫn là spam
  assert.equal(hopLe("Bit là gì?"), "Bit là gì?");
  assert.equal(hopLe("Bit là gì? ".repeat(80)).length, 500); // hỏi thật mà dài -> cắt
});

test("lịch sử: chỉ giữ 6 lượt gần nhất, role lạ quy về user", () => {
  const ls = Array.from({ length: 10 }, (_, i) => ({ role: i % 2 ? "assistant" : "he-thong", content: "c" + i }));
  const r = locLichSu(ls);
  assert.equal(r.length, 6);
  assert.equal(r[0].content, "c4");
  assert.ok(r.every((m) => m.role === "user" || m.role === "assistant"));
  assert.deepEqual(locLichSu("không phải mảng"), []);
});

test("prompt dựng từ nội dung bài thật ở máy chủ", () => {
  const bai = layBai("C10-01");
  assert.ok(bai, "phải đọc được bài C10-01");
  const sys = dungSystem(bai, null);
  assert.match(sys, /BÀI ĐANG HỌC: Thông tin, dữ liệu/);
  assert.match(sys, /KHÔNG làm hộ bài tập/);
  assert.ok(sys.length > 1000, "ngữ cảnh phải có nội dung bài");
});

test("prompt câu sai có đáp án đúng và lựa chọn của học sinh", () => {
  const cau = layCau("CA-mc-101");
  const sys = dungSystem(layBai("C10-01"), cau, 0);
  assert.match(sys, /Đáp án đúng: B/);
  assert.match(sys, /Học sinh đã chọn: A/);
});

/* ------------------------------- qua HTTP -------------------------------- */

test("chưa đăng nhập: status báo on nhưng chưa đăng nhập, hỏi thì 401", async () => {
  const s = await req("/api/tutor/status");
  assert.equal(s.status, 200);
  assert.equal(s.data.on, true);
  assert.equal(s.data.dangNhap, false);
  const r = await req("/api/tutor", { method: "POST", body: { lessonId: "C10-01", question: "Bit là gì?" } });
  assert.equal(r.status, 401);
});

test("đăng nhập xong hỏi được, chữ chảy về theo luồng", async () => {
  const dk = await req("/api/auth/register", { method: "POST", body: { email: "hs@test.vn", password: "123456", name: "Hà" } });
  assert.equal(dk.status, 200);
  const pid = dk.data.profiles[0].id;

  const r = await req("/api/tutor", {
    method: "POST",
    body: { profileId: pid, lessonId: "C10-01", question: "Dữ liệu khác thông tin thế nào?" },
  });
  assert.equal(r.status, 200);
  const { chu, xong } = gomLuong(r.raw);
  assert.ok(chu.length > 20, "phải nhận được chữ");
  assert.match(chu, /Thông tin, dữ liệu/, "gia sư phải thấy đúng bài đang học");
  assert.equal(xong.conLai, 2); // hạn mức 3, đã dùng 1
});

test("ngữ cảnh không nhận từ trình duyệt: lessonId bịa -> 400", async () => {
  const r = await req("/api/tutor", { method: "POST", body: { lessonId: "KHONG-CO", question: "Bit là gì?" } });
  assert.equal(r.status, 400);
  const r2 = await req("/api/tutor", { method: "POST", body: { question: "Thủ đô nước Pháp?" } });
  assert.equal(r2.status, 400); // thiếu bài -> không trả lời chuyện ngoài lề
});

test("câu hỏi rỗng bị chặn và KHÔNG trừ lượt", async () => {
  const r = await req("/api/tutor", { method: "POST", body: { lessonId: "C10-01", question: "  " } });
  assert.equal(r.status, 400);
  const s = await req("/api/tutor/status");
  assert.equal(s.data.conLai, 2);
});

test("hết hạn mức trong ngày -> 429 kèm lời mời", async () => {
  for (let i = 0; i < 2; i++) {
    const r = await req("/api/tutor", { method: "POST", body: { lessonId: "C10-01", question: "Hỏi lần " + i } });
    assert.equal(r.status, 200);
  }
  const s = await req("/api/tutor/status");
  assert.equal(s.data.conLai, 0);
  const r = await req("/api/tutor", { method: "POST", body: { lessonId: "C10-01", question: "Hỏi thêm" } });
  assert.equal(r.status, 429);
  assert.equal(r.data.hetLuot, true);
});

test("nhật ký lưu lại hội thoại, câu sai ghi kiểu 'wrong' kèm mã câu", async () => {
  const log = await pool.query("SELECT * FROM tutor_log ORDER BY id");
  assert.equal(log.rows.length, 3);
  assert.equal(log.rows[0].lesson_id, "C10-01");
  assert.ok(log.rows[0].tra_loi.length > 20);

  // hạn mức đếm theo TÀI KHOẢN, nên tài khoản mới lại có lượt mới
  await req("/api/auth/logout", { method: "POST" });
  const dk = await req("/api/auth/register", { method: "POST", body: { email: "hs2@test.vn", password: "123456", name: "Bình" } });
  const r = await req("/api/tutor", {
    method: "POST",
    body: { profileId: dk.data.profiles[0].id, questionId: "CA-mc-101", daChon: 0, question: "Vì sao tôi sai?" },
  });
  assert.equal(r.status, 200);
  const l2 = await pool.query("SELECT * FROM tutor_log ORDER BY id DESC LIMIT 1");
  assert.equal(l2.rows[0].kieu, "wrong");
  assert.equal(l2.rows[0].question_id, "CA-mc-101");
});

test("hồ sơ của tài khoản khác không ghi vào nhật ký được", async () => {
  // hs2 đang đăng nhập; profileId dưới đây là của hs1 -> phải bị bỏ qua (ghi null)
  const cua1 = await pool.query("SELECT id FROM profiles WHERE user_id = 1 ORDER BY id LIMIT 1");
  const r = await req("/api/tutor", {
    method: "POST",
    body: { profileId: cua1.rows[0].id, lessonId: "C10-01", question: "Bit là gì?" },
  });
  assert.equal(r.status, 200);
  const l = await pool.query("SELECT * FROM tutor_log ORDER BY id DESC LIMIT 1");
  assert.equal(l.rows[0].profile_id, null);
});
