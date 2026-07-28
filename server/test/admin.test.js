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

test("thống kê chi phí AI: gộp theo ngày, theo tài khoản, quy ra tiền đúng đơn giá", async () => {
  // gieo nhật ký gia sư: 2 lượt hôm nay của user 1, 1 lượt của user 2, 1 lượt cũ
  const hnay = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
  const cu = new Date(Date.now() + 7 * 3600 * 1000 - 60 * 86400000).toISOString().slice(0, 10);
  const them = (uid, ngay, vao, dem, ra, kieu) => pool.query(
    `INSERT INTO tutor_log (user_id, kieu, cau_hoi, tra_loi, ngay, token_vao, token_dem, token_ra)
     VALUES ($1,$2,'hỏi','đáp',$3,$4,$5,$6)`, [uid, kieu || "lesson", ngay, vao, dem, ra]);
  await them(1, hnay, 3000, 1000, 300);
  await them(1, hnay, 2000, 0, 200, "wrong");
  await them(2, hnay, 1000, 0, 100);
  await them(1, cu, 9999, 0, 999);           // ngoài khoảng 30 ngày

  const r = await req("/api/admin/ai-usage?ngay=30");
  assert.equal(r.status, 200);
  const d = r.data;

  assert.equal(d.khoang.luot, 3, "chỉ đếm lượt trong khoảng");
  assert.equal(d.khoang.vao, 6000);
  assert.equal(d.khoang.dem, 1000);
  assert.equal(d.tuTruocToiNay.luot, 4, "tổng từ trước tới nay tính cả lượt cũ");

  /* Tiền: (vào - đệm) * giá vào + đệm * giá vào * 25% + ra * giá ra, đổi ra VND.
     Mặc định 0.3 / 2.5 USD mỗi triệu token, tỉ giá 26.000. */
  const mong = ((5000 * 0.3 + 1000 * 0.3 * 0.25 + 600 * 2.5) / 1e6) * 26000;
  assert.equal(d.khoang.tien, Math.round(mong), "tiền phải khớp công thức, đệm tính rẻ hơn");

  const ngayNay = d.theoNgay.find((x) => x.ngay === hnay);
  assert.ok(ngayNay && ngayNay.luot === 3, "gộp đúng theo ngày (giờ VN)");

  const tk = d.theoTaiKhoan;
  assert.equal(tk.length, 2);
  assert.equal(tk[0].luot, 2, "sắp theo tiền giảm dần — tài khoản tốn nhất lên đầu");
  assert.ok(tk[0].email.includes("@"));
  assert.deepEqual(d.theoKieu.map((x) => x.kieu).sort(), ["lesson", "wrong"]);
});

test("thống kê AI: người thường không xem được", async () => {
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "hs@test.vn", password: "123456" } });
  assert.equal((await req("/api/admin/ai-usage")).status, 403);
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "chu@shop.vn", password: "123456" } });
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

  // học sinh mua thật -> phải thấy NGÀY HẾT HẠN, không chỉ chữ "Premium"
  const meHs = await req("/api/me");
  assert.equal(meHs.data.plan.tier, "paid");
  assert.equal(meHs.data.plan.nguon, "ma");
  assert.ok(meHs.data.plan.hetHan, "mua bằng mã thì phải có ngày hết hạn để hiển thị");

  // admin (tài khoản admin coi như paid, không cần mã)
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "chu@shop.vn", password: "123456" } });
  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "paid");
  /* Admin CHƯA có mã: quyền đến từ vai trò, giao diện phải nói rõ như vậy. */
  assert.equal(me.data.plan.nguon, "vaiTro");
  assert.equal(me.data.plan.hetHan, null);
  const st = await req("/api/admin/stats");
  assert.equal(st.data.maDaKichHoat, 1);
  assert.equal(st.data.premiumConHan, 1);
  const ds2 = await req("/api/admin/licenses");
  const dung = ds2.data.licenses.filter((x) => x.nguoiDung === "hs@test.vn");
  assert.equal(dung.length, 1);
});

/* Đây chính là chỗ từng gây hiểu nhầm khi thử luồng mua: admin mua thật nhưng
   getPlan thoát sớm ở nhánh vai trò nên KHÔNG trả ngày hết hạn, màn Tài khoản
   hiện "Premium" trơn y như lúc chưa mua — không biết webhook đã chạy chưa. */
test("admin có mã thật thì vẫn phải thấy ngày hết hạn, không chỉ 'Premium' trơn", async () => {
  const tao = await req("/api/admin/licenses", { method: "POST", body: { soLuong: 1, soNgay: 365 } });
  const code = tao.data.codes[0];
  const kh = await req("/api/licenses/activate", { method: "POST", body: { code } });
  assert.equal(kh.status, 200);

  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "paid");
  assert.equal(me.data.plan.nguon, "ma", "có mã còn hạn thì nguồn phải là 'ma', không phải vai trò");
  assert.ok(me.data.plan.hetHan, "admin mua thật vẫn phải có ngày hết hạn");
  const con = Math.round((new Date(me.data.plan.hetHan) - Date.now()) / 86400000);
  assert.ok(con > 360 && con <= 365, "hạn phải khoảng 365 ngày, hiện " + con);
});
