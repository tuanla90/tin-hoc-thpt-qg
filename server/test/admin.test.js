/* Test admin mini: bootstrap admin qua ADMIN_EMAILS, tạo lô mã, xem danh sách,
 * người thường bị chặn 403. Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { newDb } = require("pg-mem");

process.env.ADMIN_EMAILS = "chu@shop.vn";

const { initDb } = require("../db");
const { createApp } = require("../app");
const { chuanHoaMa } = require("../plan");

let srv, base, pool, cookie = "";

function req(path, opts = {}) {
  return fetch(base + path, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", cookie },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (res) => {
    const setC = res.headers.get("set-cookie");
    if (setC) cookie = setC.split(";")[0];
    return { status: res.status, data: await res.json().catch(() => ({})) };
  });
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

test("chuẩn hoá mã: chấp nhận gõ thường/thiếu gạch, loại chuỗi lạ", () => {
  assert.equal(chuanHoaMa("tin-ab2d-9xyz"), "TIN-AB2D-9XYZ");
  assert.equal(chuanHoaMa("  tin ab2d 9xyz "), "TIN-AB2D-9XYZ");
  assert.equal(chuanHoaMa("TINAB2D9XYZ"), "TIN-AB2D-9XYZ");
  assert.equal(chuanHoaMa("AB2D9XYZ"), null);
  assert.equal(chuanHoaMa("TIN-QUA-NGAN"), null);
  assert.equal(chuanHoaMa(""), null);
});

test("chưa đăng nhập -> 401; người thường -> 403", async () => {
  assert.equal((await req("/api/admin/stats")).status, 401);
  await req("/api/auth/register", { method: "POST", body: { email: "hs@test.vn", password: "123456", name: "HS" } });
  assert.equal((await req("/api/admin/stats")).status, 403);
  await req("/api/auth/logout", { method: "POST" });
});

test("email trong ADMIN_EMAILS đăng nhập là thành admin, tạo được lô mã", async () => {
  await req("/api/auth/register", { method: "POST", body: { email: "chu@shop.vn", password: "123456", name: "Chủ" } });
  const tao = await req("/api/admin/licenses", { method: "POST", body: { soLuong: 5, soNgay: 90, ghiChu: "đợt thử" } });
  assert.equal(tao.status, 200);
  assert.equal(tao.data.codes.length, 5);
  tao.data.codes.forEach((c) => assert.match(c, /^TIN-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/));

  // role đã được tự nâng để lần sau không phụ thuộc biến môi trường
  const u = await pool.query("SELECT role FROM users WHERE email = 'chu@shop.vn'");
  assert.equal(u.rows[0].role, "admin");

  const ds = await req("/api/admin/licenses");
  assert.equal(ds.data.licenses.length, 5);
  assert.equal(ds.data.licenses[0].soNgay, 90);
  assert.equal(ds.data.licenses[0].nguoiDung, null);

  const st = await req("/api/admin/stats");
  assert.equal(st.data.maDaTao, 5);
  assert.equal(st.data.maDaKichHoat, 0);
});

test("danh sách người dùng: thấy gói, lọc theo email", async () => {
  // đang đăng nhập admin (test trước để lại phiên chu@shop.vn)
  const ds = await req("/api/admin/users");
  assert.equal(ds.status, 200);
  assert.ok(ds.data.users.length >= 2);
  const chu = ds.data.users.find((u) => u.email === "chu@shop.vn");
  assert.equal(chu.goi.tier, "paid"); // admin coi như paid
  const hs = ds.data.users.find((u) => u.email === "hs@test.vn");
  assert.equal(hs.goi.tier, "free"); // chưa kích hoạt mã ở thời điểm này

  const loc = await req("/api/admin/users?q=hs@test");
  assert.equal(loc.data.users.length, 1);
  assert.equal(loc.data.users[0].email, "hs@test.vn");
});

test("admin đặt lại mật khẩu hộ: mật khẩu mới vào được, cũ hết vào", async () => {
  const ds = await req("/api/admin/users?q=hs@test");
  const id = ds.data.users[0].id;

  const ngan = await req("/api/admin/users/" + id + "/password", { method: "POST", body: { matKhau: "123" } });
  assert.equal(ngan.status, 400); // dưới 6 ký tự bị chặn

  const doi = await req("/api/admin/users/" + id + "/password", { method: "POST", body: { matKhau: "tam-123456" } });
  assert.equal(doi.status, 200);
  assert.equal(doi.data.email, "hs@test.vn");

  await req("/api/auth/logout", { method: "POST" });
  const cu = await req("/api/auth/login", { method: "POST", body: { email: "hs@test.vn", password: "123456" } });
  assert.equal(cu.status, 401);
  const moi = await req("/api/auth/login", { method: "POST", body: { email: "hs@test.vn", password: "tam-123456" } });
  assert.equal(moi.status, 200);
  // trả phiên về admin và trả mật khẩu hs về "123456" cho các test phía sau
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "chu@shop.vn", password: "123456" } });
  await req("/api/admin/users/" + id + "/password", { method: "POST", body: { matKhau: "123456" } });
});

test("học sinh kích hoạt mã vừa tạo -> stats đếm được doanh số", async () => {
  const ds = await req("/api/admin/licenses");
  const code = ds.data.licenses[0].code;
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "hs@test.vn", password: "123456" } });
  const kh = await req("/api/licenses/activate", { method: "POST", body: { code } });
  assert.equal(kh.status, 200);
  assert.equal(kh.data.plan.tier, "paid");

  // admin (tài khoản admin coi như paid, không cần mã)
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "chu@shop.vn", password: "123456" } });
  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "paid");
  const st = await req("/api/admin/stats");
  assert.equal(st.data.maDaKichHoat, 1);
  assert.equal(st.data.premiumConHan, 1);
  const ds2 = await req("/api/admin/licenses");
  const dung = ds2.data.licenses.filter((x) => x.nguoiDung === "hs@test.vn");
  assert.equal(dung.length, 1);
});
