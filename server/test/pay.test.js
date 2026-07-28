/* Test luồng THANH TOÁN TỰ ĐỘNG. Đây là chỗ sai là mất tiền thật hoặc khách trả
 * tiền mà không được gói, nên kiểm kỹ: chống ghi trùng khi SePay bắn lại, thiếu
 * tiền không mở gói, sai khoá bị chặn, giao dịch lạ vẫn ghi lại để đối soát.
 * Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { newDb } = require("pg-mem");

process.env.PAY_PROVIDER = "sepay";      // bản thật -> bắt xác thực khoá
process.env.PAY_API_KEY = "khoa-bi-mat-test";
process.env.PAY_BANK = "vietcombank";
process.env.PAY_STK = "0011002233445";
process.env.PAY_CHU_TK = "NGUYEN VAN A";
process.env.PAY_GIA_NAM = "249000";
process.env.ADMIN_EMAILS = "sep@shop.vn";

const { initDb } = require("../db");
const { createApp } = require("../app");
const { timMaDon, docWebhook, anhQr, payConfig } = require("../pay");

let srv, base, pool, cookie = "";

function req(path, opts = {}) {
  const headers = Object.assign({ "Content-Type": "application/json", cookie }, opts.headers || {});
  return fetch(base + path, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (res) => {
    const setC = res.headers.get("set-cookie");
    if (setC && !opts.giuCookie) cookie = setC.split(";")[0];
    return { status: res.status, data: await res.json().catch(() => ({})) };
  });
}

/* Gói tin y như SePay gửi thật */
function goiTin(o) {
  return Object.assign({
    id: 1001, gateway: "Vietcombank", transactionDate: "2026-07-28 21:05:00",
    accountNumber: "0011002233445", subAccount: null, code: null,
    content: "", transferType: "in", description: "", transferAmount: 249000,
    accumulated: 0, referenceCode: "FT26072800001",
  }, o);
}
const nhuSePay = (body, khoa) => req("/api/pay/webhook", {
  method: "POST", body, giuCookie: true,
  headers: { authorization: "Apikey " + (khoa === undefined ? "khoa-bi-mat-test" : khoa) },
});

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

test("dò mã đơn trong nội dung chuyển khoản kiểu ngân hàng hay viết", () => {
  assert.equal(timMaDon(null, "TINAB23CD"), "TINAB23CD");
  assert.equal(timMaDon(null, "CT DEN:0011 tinab23cd chuyen tien"), "TINAB23CD"); // viết thường
  assert.equal(timMaDon("TINAB23CD", "rác"), "TINAB23CD");                        // lấy từ trường code
  assert.equal(timMaDon(null, "MBVCB.123.CK cho be hoc tin"), null);              // không có mã
  assert.equal(timMaDon(null, "TIN0O1I23"), null);                                // ký tự dễ nhầm -> không phải mã
});

test("đọc gói tin webhook đúng trường của SePay", () => {
  const gd = docWebhook(goiTin({ content: "TINAB23CD", transferAmount: 249000 }));
  assert.equal(gd.txId, "1001");
  assert.equal(gd.vao, true);
  assert.equal(gd.soTien, 249000);
  assert.equal(gd.maDon, "TINAB23CD");
  assert.equal(docWebhook(goiTin({ transferType: "out" })).vao, false);
});

test("ảnh QR nhúng sẵn số tài khoản, số tiền và nội dung", () => {
  const u = anhQr(payConfig(), "TINAB23CD", 249000);
  assert.match(u, /^https:\/\/qr\.sepay\.vn\/img\?/);
  assert.match(u, /acc=0011002233445/);
  assert.match(u, /amount=249000/);
  assert.match(u, /des=TINAB23CD/);
});

/* ------------------------------- qua HTTP -------------------------------- */

let maDon = null;

test("chưa đăng nhập thì không tạo được đơn", async () => {
  assert.equal((await req("/api/pay/order", { method: "POST", body: { goi: "nam" } })).status, 401);
});

test("tạo đơn: có mã đơn, đúng giá, kèm QR", async () => {
  await req("/api/auth/register", { method: "POST", body: { email: "mua@test.vn", password: "123456", name: "Mua" } });
  const r = await req("/api/pay/order", { method: "POST", body: { goi: "nam" } });
  assert.equal(r.status, 200);
  const d = r.data.don;
  assert.match(d.maDon, /^TIN[2-9A-HJKMNP-Z]{6}$/);
  assert.equal(d.soTien, 249000);
  assert.equal(d.soNgay, 365);
  assert.equal(d.trangThai, "cho");
  assert.equal(d.noiDung, d.maDon, "nội dung chuyển khoản chính là mã đơn");
  assert.ok(d.qr.includes(d.maDon));
  maDon = d.maDon;

  // bấm mua lần nữa -> dùng lại đúng đơn đang chờ, không đẻ đơn mới
  const r2 = await req("/api/pay/order", { method: "POST", body: { goi: "nam" } });
  assert.equal(r2.data.don.maDon, maDon);
});

test("webhook sai khoá bị chặn, KHÔNG mở gói", async () => {
  const r = await nhuSePay(goiTin({ content: maDon }), "khoa-bay-ba");
  assert.equal(r.status, 401);
  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "free");
});

test("webhook thiếu tiền: không mở gói nhưng vẫn ghi lại để đối soát", async () => {
  const r = await nhuSePay(goiTin({ id: 2001, content: maDon, transferAmount: 100000 }));
  assert.equal(r.status, 200);
  assert.equal(r.data.success, true);
  assert.equal(r.data.thieuTien, true);
  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "free", "thiếu tiền thì tuyệt đối không lên gói");
  const ev = await pool.query("SELECT * FROM pay_events WHERE tx_id = '2001'");
  assert.equal(ev.rows[0].khop, false);
  assert.match(ev.rows[0].ghi_chu, /Thiếu tiền/);
});

test("tiền vào đủ -> mở Premium ngay, đơn chuyển sang đã trả", async () => {
  const r = await nhuSePay(goiTin({ id: 3001, content: "CT DEN " + maDon + " chuyen tien" }));
  assert.equal(r.status, 200);
  assert.deepEqual({ success: r.data.success, khop: r.data.khop }, { success: true, khop: true });

  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "paid");
  const con = new Date(me.data.plan.hetHan).getTime() - Date.now();
  assert.ok(con > 360 * 86400000 && con < 366 * 86400000, "phải còn khoảng 365 ngày");

  const don = await req("/api/pay/order/" + maDon);
  assert.equal(don.data.trangThai, "da_tra");
});

test("SePay bắn lại cùng giao dịch: KHÔNG cộng gói lần hai", async () => {
  const truoc = (await req("/api/me")).data.plan.hetHan;
  for (let i = 0; i < 3; i++) {
    const r = await nhuSePay(goiTin({ id: 3001, content: maDon }));
    assert.equal(r.status, 200);
    assert.equal(r.data.success, true, "phải trả success để SePay thôi gửi lại");
    assert.equal(r.data.daXuLy, true);
  }
  const sau = (await req("/api/me")).data.plan.hetHan;
  assert.equal(sau, truoc, "hạn không được nhích thêm");
  const lic = await pool.query("SELECT COUNT(*)::int AS n FROM licenses WHERE note LIKE '%" + maDon + "%'");
  assert.equal(lic.rows[0].n, 1, "chỉ được sinh đúng một license cho đơn này");
});

test("chuyển khoản không có mã đơn: ghi vào mục chưa khớp, không nuốt im lặng", async () => {
  const r = await nhuSePay(goiTin({ id: 4001, content: "ck cho con hoc tin hoc", transferAmount: 249000 }));
  assert.equal(r.status, 200);
  assert.equal(r.data.khop, false);
  const ev = await pool.query("SELECT * FROM pay_events WHERE tx_id = '4001'");
  assert.equal(ev.rows[0].khop, false);
  assert.match(ev.rows[0].ghi_chu, /Không tìm thấy mã đơn/);
});

test("tiền RA (chuyển đi) thì bỏ qua, không đụng gì", async () => {
  const r = await nhuSePay(goiTin({ id: 5001, transferType: "out", content: maDon }));
  assert.equal(r.data.success, true);
  assert.equal(r.data.boQua, "giao dịch tiền ra");
});

test("mua tiếp gói nước rút thì CỘNG DỒN vào hạn đang có", async () => {
  const truoc = new Date((await req("/api/me")).data.plan.hetHan).getTime();
  const d = (await req("/api/pay/order", { method: "POST", body: { goi: "nuocrut" } })).data.don;
  assert.equal(d.soNgay, 90);
  await nhuSePay(goiTin({ id: 6001, content: d.maDon, transferAmount: d.soTien }));
  const sau = new Date((await req("/api/me")).data.plan.hetHan).getTime();
  const them = Math.round((sau - truoc) / 86400000);
  assert.ok(them >= 89 && them <= 91, "phải cộng thêm ~90 ngày, thực tế " + them);
});

test("không xem được đơn của người khác", async () => {
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/register", { method: "POST", body: { email: "nguoila@test.vn", password: "123456", name: "Lạ" } });
  assert.equal((await req("/api/pay/order/" + maDon)).status, 404);
});

test("mục đối soát của admin: thấy đơn và giao dịch chưa khớp", async () => {
  await req("/api/auth/logout", { method: "POST" });
  assert.equal((await req("/api/pay/admin/orders")).status, 401);

  await req("/api/auth/register", { method: "POST", body: { email: "sep@shop.vn", password: "123456", name: "Sếp" } });
  const r = await req("/api/pay/admin/orders");
  assert.equal(r.status, 200);
  const don = r.data.orders.find((x) => x.maDon === maDon);
  assert.equal(don.email, "mua@test.vn");
  assert.equal(don.trangThai, "da_tra");
  const le = r.data.chuaKhop.map((x) => x.txId);
  assert.ok(le.includes("4001") && le.includes("2001"), "phải liệt kê giao dịch lạ và giao dịch thiếu tiền");
});
