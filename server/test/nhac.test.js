/* Test NHẮC HỌC.
 * Hai thứ dễ sai nhất và cùng phá hỏng lòng tin của người dùng:
 *   - nhắc SAI (đã học rồi còn nhắc, nghỉ đúng lịch cũng nhắc, một ngày nhắc
 *     mấy lần) -> người ta tắt thông báo và không bật lại bao giờ;
 *   - ký VAPID sai -> dịch vụ đẩy từ chối, chẳng ai nhận được gì mà máy chủ
 *     vẫn báo "đã gửi".
 * Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const crypto = require("node:crypto");
const session = require("express-session");
const { newDb } = require("pg-mem");

/* Khoá dùng riêng cho test — sinh bằng scripts/vapid.js. */
process.env.VAPID_PUBLIC = "BLfUBd5efzUstC25R_ZnBbiZePmuXuj3jy078y0gSXLLrglkvrsm17AzcK6Yz9uCyYSGqehF1ELYoxOHS1emD_g";
process.env.VAPID_PRIVATE = "2FDHkTYxzUWXKnXGGhZw62jwmNvzUNvajLBoQF3DGjo";
process.env.VAPID_SUB = "mailto:test@vidu.vn";

const { initDb } = require("../db");
const { createApp } = require("../app");
const { quet, taoJwt, derSangRaw, ngayVN, thuVN, loiNhac } = require("../nhac");

let srv, base, pool, cookie = "";

function req(path, opts = {}) {
  return fetch(base + path, {
    method: opts.method || "GET",
    headers: Object.assign({ "Content-Type": "application/json", cookie }, opts.headers || {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (res) => {
    const setC = res.headers.get("set-cookie");
    if (setC && !opts.giuCookie) cookie = setC.split(";")[0];
    return { status: res.status, data: await res.json().catch(() => ({})) };
  });
}

/* Dịch vụ đẩy giả: ghi lại mọi lần gửi và trả mã trạng thái do test đặt. */
function dichVuGia(ma) {
  const daGui = [];
  const fn = async (url, opt) => {
    daGui.push({ url, auth: (opt.headers || {}).Authorization || "" });
    return { status: typeof ma === "function" ? ma(url) : (ma || 201) };
  };
  fn.daGui = daGui;
  return fn;
}

const EP = "https://fcm.googleapis.com/fcm/send/abc123";

before(async () => {
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  pool = await initDb(new Pool());
  const app = createApp({ pool, sessionStore: new session.MemoryStore() });
  srv = app.listen(0);
  base = "http://127.0.0.1:" + srv.address().port;
});
after(() => srv && srv.close());

/* ----------------------------- phần thuần hàm ----------------------------- */

test("JWT ký theo VAPID: dịch vụ đẩy xác minh được bằng khoá công khai", () => {
  const jwt = taoJwt("https://fcm.googleapis.com", {
    pub: process.env.VAPID_PUBLIC, priv: process.env.VAPID_PRIVATE, sub: "mailto:test@vidu.vn",
  });
  const [h, t, s] = jwt.split(".");
  assert.deepEqual(JSON.parse(Buffer.from(h, "base64url")), { typ: "JWT", alg: "ES256" });
  const than = JSON.parse(Buffer.from(t, "base64url"));
  assert.equal(than.aud, "https://fcm.googleapis.com");
  assert.equal(than.sub, "mailto:test@vidu.vn");
  /* Chuẩn VAPID cấm hạn quá 24 tiếng — quá hạn là bị từ chối sạch. */
  const con = than.exp - Math.floor(Date.now() / 1000);
  assert.ok(con > 0 && con <= 24 * 3600, "hạn JWT phải trong 24 tiếng, đang là " + con + "s");

  const p = Buffer.from(process.env.VAPID_PUBLIC, "base64url");
  const khoa = crypto.createPublicKey({
    format: "jwk",
    key: { kty: "EC", crv: "P-256", x: p.subarray(1, 33).toString("base64url"), y: p.subarray(33, 65).toString("base64url") },
  });
  /* ieee-p1363 = R||S thô, đúng thứ JWT ES256 cần (node ký ra DER). */
  assert.ok(crypto.verify("SHA256", Buffer.from(h + "." + t), { key: khoa, dsaEncoding: "ieee-p1363" },
    Buffer.from(s, "base64url")), "chữ ký không xác minh được");
});

test("chữ ký DER đổi sang R||S luôn đủ 64 byte, kể cả khi R hoặc S ngắn", () => {
  /* R chỉ 1 byte, S có byte 0 đệm dấu — hai ca hay làm hỏng phép đổi thủ công. */
  const der = Buffer.concat([
    Buffer.from([0x30, 0x27, 0x02, 0x01, 0x05]),
    Buffer.from([0x02, 0x21, 0x00]), Buffer.alloc(32, 0xab),
  ]);
  const raw = derSangRaw(der);
  assert.equal(raw.length, 64);
  assert.equal(raw[31], 5, "R phải được đệm về cuối 32 byte đầu");
  assert.equal(raw[32], 0xab);
});

test("mốc ngày tính theo giờ Việt Nam, không theo giờ máy chủ", () => {
  /* Railway chạy UTC: 17:30 UTC ngày 29 đã là 00:30 ngày 30 ở Việt Nam. Lấy
     nhầm ngày UTC là nhắc sai ngày và tính sai cả chuỗi. */
  assert.equal(ngayVN(new Date("2026-07-29T17:30:00Z")), "2026-7-30");
  assert.equal(ngayVN(new Date("2026-07-29T16:59:00Z")), "2026-7-29");
  /* Đúng định dạng của js/gamify.js: không đệm số 0. */
  assert.equal(ngayVN(new Date("2026-01-05T03:00:00Z")), "2026-1-5");
  assert.equal(thuVN(new Date("2026-07-29T17:30:00Z")), new Date("2026-07-30T12:00:00Z").getUTCDay());
});

test("lời nhắc nói về chuỗi khi có chuỗi, không doạ khi chưa có", () => {
  assert.match(loiNhac(5, true).title, /5/);
  assert.ok(!/\d/.test(loiNhac(0, true).title), "chưa có chuỗi thì đừng nêu con số");
});

/* ------------------------------- qua HTTP -------------------------------- */

test("cấu hình nhắc học trả khoá công khai cho trình duyệt đăng ký", async () => {
  const r = await req("/api/nhac/config");
  assert.equal(r.status, 200);
  assert.equal(r.data.bat, true);
  assert.equal(r.data.publicKey, process.env.VAPID_PUBLIC);
});

test("chưa đăng nhập thì không đăng ký nhắc được", async () => {
  const r = await req("/api/nhac/dangky", { method: "POST", body: { endpoint: EP } });
  assert.equal(r.status, 401);
});

let profileId = null;

test("đăng nhập rồi bật nhắc: lưu đúng hồ sơ và giờ đã chọn", async () => {
  const dk = await req("/api/auth/register", { method: "POST", body: { email: "hs@vidu.vn", password: "matkhau1", name: "Hà" } });
  assert.equal(dk.status, 200);
  profileId = dk.data.profiles[0].id;

  const r = await req("/api/nhac/dangky", { method: "POST", body: { endpoint: EP, gio: 20, profileId } });
  assert.equal(r.status, 200);
  assert.equal(r.data.gio, 20);
  const f = await pool.query("SELECT * FROM push_subs WHERE endpoint = $1", [EP]);
  assert.equal(f.rows.length, 1);
  assert.equal(f.rows[0].gio, 20);
  assert.equal(f.rows[0].profile_id, profileId);
});

test("bật lại lần nữa chỉ đổi giờ, không sinh thêm dòng", async () => {
  const r = await req("/api/nhac/dangky", { method: "POST", body: { endpoint: EP, gio: 19, profileId } });
  assert.equal(r.status, 200);
  const f = await pool.query("SELECT gio FROM push_subs WHERE endpoint = $1", [EP]);
  assert.equal(f.rows.length, 1, "một thiết bị chỉ được có một đăng ký");
  assert.equal(f.rows[0].gio, 19);
});

test("giờ vô lý hoặc endpoint không phải https đều bị chặn", async () => {
  const xau = await req("/api/nhac/dangky", { method: "POST", body: { endpoint: "http://ke-gian.vn/x", gio: 19 } });
  assert.equal(xau.status, 400);
  const gio = await req("/api/nhac/dangky", { method: "POST", body: { endpoint: EP, gio: 99 } });
  assert.equal(gio.data.gio, 19, "giờ sai thì về mặc định chứ không lưu bừa");
  /* Lần bật lại KHÔNG kèm profileId (client chưa kịp chọn hồ sơ) không được xoá
     hồ sơ đã gắn: mất nó là mất lịch học và chuỗi, lời nhắc sẽ gửi cả vào ngày
     nghỉ lẫn ngày đã học xong. */
  const f = await pool.query("SELECT profile_id FROM push_subs WHERE endpoint = $1", [EP]);
  assert.equal(f.rows[0].profile_id, profileId, "thiếu profileId thì phải giữ hồ sơ cũ, không ghi đè null");
});

test("không gắn được lời nhắc vào hồ sơ của tài khoản khác", async () => {
  /* Đăng ký tài khoản thứ hai dùng LẠI CHÍNH phiên đang mở (express-session
     không tạo phiên mới), nên cất cookie rồi trả lại là vô ích — muốn quay về
     tài khoản cũ thì phải đăng nhập lại thật. */
  await req("/api/auth/register", { method: "POST", body: { email: "nguoila@vidu.vn", password: "matkhau1" } });
  const r = await req("/api/nhac/dangky", { method: "POST", body: { endpoint: "https://fcm.googleapis.com/fcm/send/khac", profileId } });
  assert.equal(r.status, 200);
  const f = await pool.query("SELECT profile_id FROM push_subs WHERE endpoint = $1", ["https://fcm.googleapis.com/fcm/send/khac"]);
  assert.equal(f.rows[0].profile_id, null, "hồ sơ người khác phải bị bỏ, không được lưu");
  await pool.query("DELETE FROM push_subs WHERE endpoint = $1", ["https://fcm.googleapis.com/fcm/send/khac"]);
  const ve = await req("/api/auth/login", { method: "POST", body: { email: "hs@vidu.vn", password: "matkhau1" } });
  assert.equal(ve.status, 200);
});

/* --------------------------- lượt quét gửi nhắc --------------------------- */
/* Mốc thời gian cố định: 12:00 UTC = 19:00 giờ Việt Nam. */
const LUC_19H = new Date("2026-07-29T12:00:00Z");

/* Dựng lại đăng ký sau những test cố tình xoá nó (410, hỏng 10 lượt). */
async function taoDangKyLai() {
  const p = await pool.query("SELECT user_id FROM profiles WHERE id = $1", [profileId]);
  await pool.query(
    "INSERT INTO push_subs (user_id, profile_id, endpoint, gio) VALUES ($1, $2, $3, 19)",
    [p.rows[0].user_id, profileId, EP]);
}

async function datLich(days, gam) {
  await pool.query("UPDATE profiles SET days = $1 WHERE id = $2", [JSON.stringify(days), profileId]);
  await pool.query("DELETE FROM gamify WHERE profile_id = $1", [profileId]);
  if (gam) await pool.query("INSERT INTO gamify (profile_id, data) VALUES ($1, $2)", [profileId, JSON.stringify(gam)]);
  await pool.query("UPDATE push_subs SET lan_cuoi = NULL, loi = 0, gio = 19, bat = true WHERE endpoint = $1", [EP]);
}

test("đúng giờ, đúng ngày có lịch, chưa học hôm nay -> có nhắc", async () => {
  await datLich([thuVN(LUC_19H)], { streak: 4, lastSession: "2026-7-28" });
  const gui = dichVuGia(201);
  const kq = await quet(pool, LUC_19H, gui);
  assert.equal(kq.gui, 1);
  assert.equal(gui.daGui.length, 1);
  assert.equal(gui.daGui[0].url, EP);
  assert.match(gui.daGui[0].auth, /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=/, "thiếu chữ ký VAPID trong lệnh gửi");
});

test("một ngày chỉ nhắc một lần, dù bộ đếm giờ quét lại nhiều lượt", async () => {
  const gui = dichVuGia(201);
  const lai = await quet(pool, new Date(LUC_19H.getTime() + 20 * 60000), gui);
  assert.equal(lai.gui, 0);
  assert.equal(gui.daGui.length, 0);
});

test("hôm nay đã học rồi thì không nhắc nữa", async () => {
  await datLich([thuVN(LUC_19H)], { streak: 4, lastSession: ngayVN(LUC_19H) });
  const gui = dichVuGia(201);
  assert.equal((await quet(pool, LUC_19H, gui)).gui, 0);
  assert.equal(gui.daGui.length, 0);
});

test("hôm nay không có trong lịch học thì để người ta nghỉ", async () => {
  const khac = (thuVN(LUC_19H) + 3) % 7;
  await datLich([khac], { streak: 4, lastSession: "2026-7-28" });
  assert.equal((await quet(pool, LUC_19H, dichVuGia(201))).gui, 0);
});

test("chưa đặt lịch học thì coi như ngày nào cũng học -> vẫn nhắc", async () => {
  await datLich([], { streak: 0 });
  assert.equal((await quet(pool, LUC_19H, dichVuGia(201))).gui, 1);
});

test("chưa tới giờ đã chọn thì chưa nhắc", async () => {
  await datLich([], { streak: 0 });
  const sang = new Date("2026-07-29T02:00:00Z");   // 09:00 giờ Việt Nam
  assert.equal((await quet(pool, sang, dichVuGia(201))).gui, 0);
});

test("trình duyệt báo đăng ký đã chết (410) -> xoá hẳn, không gửi mãi vào hư không", async () => {
  await datLich([], { streak: 0 });
  await quet(pool, LUC_19H, dichVuGia(410));
  const f = await pool.query("SELECT * FROM push_subs WHERE endpoint = $1", [EP]);
  assert.equal(f.rows.length, 0);
});

test("lỗi tạm thời thì giữ lại thử tiếp, hỏng 10 lượt liền mới bỏ", async () => {
  await taoDangKyLai();
  await datLich([], { streak: 0 });

  for (let i = 1; i <= 9; i++) {
    await pool.query("UPDATE push_subs SET lan_cuoi = NULL WHERE endpoint = $1", [EP]);
    await quet(pool, LUC_19H, dichVuGia(500));
    const f = await pool.query("SELECT loi FROM push_subs WHERE endpoint = $1", [EP]);
    assert.equal(f.rows.length, 1, "lỗi 500 là tạm thời, không được xoá ở lượt thứ " + i);
    assert.equal(f.rows[0].loi, i);
  }
  await pool.query("UPDATE push_subs SET lan_cuoi = NULL WHERE endpoint = $1", [EP]);
  await quet(pool, LUC_19H, dichVuGia(500));
  const f = await pool.query("SELECT loi FROM push_subs WHERE endpoint = $1", [EP]);
  assert.equal(f.rows.length, 0, "hỏng 10 lượt liền thì dọn đi");
});

/* ------------------------- nội dung hiện trên máy ------------------------- */

test("service worker hỏi nội dung: đã học hôm nay thì khen, chưa học thì nhắc", async () => {
  await taoDangKyLai();

  await datLich([], { streak: 6, lastSession: "2026-7-1" });
  const chua = await req("/api/nhac/noidung", { method: "POST", body: { endpoint: EP }, giuCookie: true });
  assert.equal(chua.status, 200);
  assert.match(chua.data.title, /6/, "có chuỗi thì phải nhắc đúng con số");
  assert.equal(chua.data.url, "/hoc");

  await pool.query("UPDATE gamify SET data = $1 WHERE profile_id = $2",
    [JSON.stringify({ streak: 6, lastSession: ngayVN() }), profileId]);
  const roi = await req("/api/nhac/noidung", { method: "POST", body: { endpoint: EP }, giuCookie: true });
  assert.ok(!/chưa/i.test(roi.data.title + roi.data.body), "đã học rồi mà vẫn nhắc 'chưa học' là sai");
});

test("endpoint lạ vẫn trả lời được, chỉ là lời nhắc chung", async () => {
  const r = await req("/api/nhac/noidung", { method: "POST", body: { endpoint: "https://la-hoac.vn/x" }, giuCookie: true });
  assert.equal(r.status, 200);
  assert.ok(r.data.title, "phải luôn có chữ để hiện, không thì trình duyệt tự hiện thông báo rác");
});

test("tắt nhắc thì xoá đăng ký của thiết bị đó", async () => {
  const r = await req("/api/nhac/tat", { method: "POST", body: { endpoint: EP } });
  assert.equal(r.status, 200);
  const f = await pool.query("SELECT * FROM push_subs WHERE endpoint = $1", [EP]);
  assert.equal(f.rows.length, 0);
});
