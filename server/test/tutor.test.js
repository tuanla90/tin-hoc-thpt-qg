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
const { dungSystem, locLichSu, hopLe, khoaNguCanh } = require("../tutor");
const { layBai, layCau, layBaiTap, noiDungBai } = require("../lessons");

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

test("lịch sử: chỉ giữ 4 lượt gần nhất, role lạ quy về user, cắt lượt quá dài", () => {
  const ls = Array.from({ length: 10 }, (_, i) => ({ role: i % 2 ? "assistant" : "he-thong", content: "c" + i }));
  const r = locLichSu(ls);
  assert.equal(r.length, 4);
  assert.equal(r[0].content, "c6");
  assert.ok(r.every((m) => m.role === "user" || m.role === "assistant"));
  assert.equal(locLichSu([{ role: "user", content: "x".repeat(5000) }])[0].content.length, 800);
  assert.deepEqual(locLichSu("không phải mảng"), []);
});

test("đổi ngữ cảnh thì máy chủ tự bỏ lịch sử của bài/câu cũ", () => {
  const ls = [
    { role: "user", content: "hỏi bài A", ngu: "bai:C10-01" },
    { role: "assistant", content: "đáp bài A", ngu: "bai:C10-01" },
    { role: "user", content: "hỏi bài B", ngu: "bai:C10-02" },
    { role: "assistant", content: "đáp bài B", ngu: "bai:C10-02" },
  ];
  const b = locLichSu(ls, "bai:C10-02");
  assert.equal(b.length, 2, "chỉ còn hội thoại của bài đang mở");
  assert.ok(b.every((m) => /bài B/.test(m.content)));

  // lượt KHÔNG gắn dấu vẫn nhận (bản trình duyệt cũ còn trong bộ nhớ đệm)
  assert.equal(locLichSu([{ role: "user", content: "cũ" }], "bai:C10-02").length, 1);
  // không truyền khoá thì giữ nguyên nếp cũ
  assert.equal(locLichSu(ls).length, 4);
});

test("khoá ngữ cảnh phân biệt bài / câu / bài thực hành", () => {
  assert.equal(khoaNguCanh({ id: "C10-01" }, null, null), "bai:C10-01");
  assert.equal(khoaNguCanh(null, { id: "CA-mc-101" }, null), "cau:CA-mc-101");
  assert.equal(khoaNguCanh({ id: "C10-11" }, null, { loai: "python", i: 0 }), "bt:python:C10-11:0");
  assert.equal(khoaNguCanh({ id: "C10-11" }, null, { loai: "python", i: 1 }), "bt:python:C10-11:1");
  assert.equal(khoaNguCanh(null, null, null), "chung");
});

/* ĐỆM NGỮ CẢNH NGẦM (implicit caching) của nhà cung cấp chỉ ăn khi phần đầu
   prompt GIỐNG HỆT lượt trước. Test này canh đúng điều kiện đó: cùng một bài thì
   dù học sinh hỏi gì, system prompt phải không đổi một ký tự. Vỡ test = mất đệm
   = hoá đơn AI tăng âm thầm mà không ai biết. */
test("prompt của cùng một bài KHÔNG đổi theo câu hỏi (giữ đệm ngữ cảnh)", () => {
  const bai = layBai("C11-33"); // bài dài nhất, nơi dễ lộ khác biệt nhất
  const a = dungSystem(bai, null, null, null, "Thuật toán tham lam là gì?");
  const b = dungSystem(bai, null, null, null, "Cho ví dụ về chia để trị");
  const c = dungSystem(bai, null, null, null, "");
  assert.equal(a, b, "hai câu hỏi khác nhau vẫn phải ra cùng một system prompt");
  assert.equal(a, c, "không có câu hỏi cũng vậy");
  assert.ok(!/\d{1,2}:\d{2}|\d{4}-\d{2}-\d{2}/.test(a), "prompt không được chứa ngày giờ — đệm sẽ trượt mỗi lượt");
});

test("mặc định KHÔNG bài nào bị cắt — gia sư luôn thấy trọn bài", () => {
  const { napKho } = require("../lessons");
  const thieu = [...napKho().baiTheoId.values()]
    .filter((b) => /đã lược/.test(dungSystem(b, null, null, null, "câu hỏi bất kỳ")))
    .map((b) => b.id);
  assert.deepEqual(thieu, [], "bài bị cắt: " + thieu.join(", ") +
    " — nới TOI_DA_BAI trong tutor.js, đừng để gia sư mù nửa bài");
});

test("van an toàn: bài quá khổ thì cắt theo khối, vừa hạn mức nhưng KHÔNG cụt giữa chừng", () => {
  const bai = layBai("C11-33"); // bài dài nhất kho (~13k ký tự)
  const vb = noiDungBai(bai, 4000);
  assert.ok(vb.length <= 4000, "phải vừa hạn mức, thực tế " + vb.length);
  assert.match(vb, /BÀI ĐANG HỌC: /, "luôn giữ tên bài");
  assert.match(vb, /Ý chính cần nhớ/, "luôn giữ phần tóm tắt — đắt giá nhất trên mỗi token");
  bai.keypoints.forEach((k) => assert.ok(vb.includes(k), "giữ đủ ý chính: " + k.slice(0, 30)));
  assert.match(vb, /đã lược .* mục/, "phải nói rõ là đã lược, để gia sư không tưởng mình thấy cả bài");
});

test("cắt nội dung bài: giữ đúng mục liên quan tới câu hỏi của học sinh", () => {
  const bai = layBai("C10-02");
  const muc = "Âm thanh — đo sóng thật nhanh, thật nhiều lần";
  assert.ok(noiDungBai(bai, 999999).includes(muc), "mục này có thật trong bài");
  assert.ok(!noiDungBai(bai, 4000).includes(muc), "cắt suông thì mục này rơi mất");
  assert.ok(noiDungBai(bai, 4000, "Âm thanh được số hoá bằng cách đo sóng thế nào?").includes(muc),
    "hỏi đúng chủ đề thì mục phải được giữ lại");
});

test("bài ngắn hơn hạn mức thì giữ trọn vẹn, không lược gì", () => {
  const bai = layBai("C10-01");
  const day = noiDungBai(bai, 999999);
  assert.ok(!/đã lược/.test(day));
  assert.ok(day.length > 1000);
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

test("prompt hỏi chung: có danh mục bài và rào phạm vi môn học", () => {
  const sys = dungSystem(null, null);
  assert.match(sys, /không mở bài nào/);
  assert.match(sys, /DANH MỤC BÀI HỌC/);
  assert.match(sys, /Lớp 10:/);
  assert.match(sys, /CHỈ trả lời câu hỏi thuộc chương trình Tin học THPT/);
  assert.match(sys, /KHÔNG làm hộ bài tập/);
});

test("bài thực hành: đề và đáp án mẫu tra từ máy chủ, bài làm được đánh dấu là dữ liệu", () => {
  const de = layBaiTap("python", "C10-11", 0);
  assert.ok(de, "phải tra được bài thực hành");
  const sys = dungSystem(layBai("C10-11"), null, null,
    { loai: "python", de, code: "print(1)", ketQua: "1", loi: "" });
  assert.match(sys, /BÀI THỰC HÀNH Python/);
  assert.match(sys, /không chép ra cho học sinh/);      // đáp án mẫu có, kèm lệnh cấm đưa ra
  assert.match(sys, /BÀI LÀM CỦA HỌC SINH .*không phải yêu cầu gửi cho bạn/);
  assert.match(sys, /không đưa đáp án hoàn chỉnh/);
  assert.equal(layBaiTap("python", "C10-11", 99), null);
  assert.equal(layBaiTap("linh-tinh", "C10-11", 0), null);
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

test("gợi ý bài thực hành: chỉ nhận chỉ số hợp lệ, ghi nhật ký kiểu 'exercise'", async () => {
  const bia = await req("/api/tutor", {
    method: "POST",
    body: { lessonId: "C10-11", exLoai: "python", exIndex: 99, code: "x", question: "Sai ở đâu?" },
  });
  assert.equal(bia.status, 400);

  const r = await req("/api/tutor", {
    method: "POST",
    body: {
      lessonId: "C10-11", exLoai: "python", exIndex: 0,
      code: "print('a')", loi: "SyntaxError: bad token", question: "Lỗi này nghĩa là gì?",
    },
  });
  assert.equal(r.status, 200);
  const l = await pool.query("SELECT * FROM tutor_log ORDER BY id DESC LIMIT 1");
  assert.equal(l.rows[0].kieu, "exercise");
  assert.equal(l.rows[0].lesson_id, "C10-11");
});

test("hỏi chung không cần mở bài: vẫn trả lời và ghi nhật ký kiểu 'general'", async () => {
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/register", { method: "POST", body: { email: "hs3@test.vn", password: "123456", name: "Chi" } });
  const r = await req("/api/tutor", { method: "POST", body: { question: "Nên bắt đầu ôn từ phần nào?" } });
  assert.equal(r.status, 200);
  const { chu } = gomLuong(r.raw);
  assert.match(chu, /không mở bài nào/, "mock nhại lại dòng BÀI ĐANG HỌC của chế độ hỏi chung");
  const l = await pool.query("SELECT * FROM tutor_log ORDER BY id DESC LIMIT 1");
  assert.equal(l.rows[0].kieu, "general");
  assert.equal(l.rows[0].lesson_id, null);
  assert.equal(l.rows[0].question_id, null);
  // đăng nhập lại hs2 cho các test phía sau dùng đúng tài khoản như trước
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "hs2@test.vn", password: "123456" } });
});

test("nhà cung cấp nghẽn 429 rồi thông: học sinh vẫn nhận trả lời, CHỈ trừ 1 lượt", async () => {
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/register", { method: "POST", body: { email: "hs4@test.vn", password: "123456", name: "Dũng" } });
  const truoc = await req("/api/tutor/status");
  assert.equal(truoc.data.conLai, 3);

  const mock = require("../ai/mock");
  mock.datLai();
  process.env.AI_MOCK_LOI = "429:1";     // hỏng lượt đầu, lượt sau thông
  process.env.AI_RETRY_MS = "5";         // khỏi chờ lâu trong test
  try {
    const r = await req("/api/tutor", { method: "POST", body: { lessonId: "C10-01", question: "Bit là gì?" } });
    assert.equal(r.status, 200);
    const { chu } = gomLuong(r.raw);
    assert.ok(chu.length > 20, "vẫn phải nhận được câu trả lời sau khi thử lại");
    assert.equal(mock.soLanGoi(), 2, "gọi nhà cung cấp 2 lần");
  } finally {
    delete process.env.AI_MOCK_LOI;
    delete process.env.AI_RETRY_MS;
  }

  const sau = await req("/api/tutor/status");
  assert.equal(sau.data.conLai, 2, "trừ đúng 1 lượt dù gọi nhà cung cấp 2 lần");
});

test("hồ sơ của tài khoản khác không ghi vào nhật ký được", async () => {
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "hs2@test.vn", password: "123456" } });
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
