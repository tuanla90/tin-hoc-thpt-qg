/* Test bộ đếm lượt truy cập (server/thongke.js) với pg-mem.
 * Điều quan trọng phải giữ: đếm đúng nhóm trang, gộp /bai/<slug> để bảng không
 * phình theo từng bài, và KHÔNG bao giờ lưu gì có thể lần ra người dùng.
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { newDb } = require("pg-mem");
const { initDb } = require("../db");
const { createApp } = require("../app");

let srv, base, pool, app;

before(async () => {
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  pool = await initDb(new Pool());
  app = createApp({ pool, sessionStore: new session.MemoryStore() });
  srv = app.listen(0);
  base = "http://127.0.0.1:" + srv.address().port;
});

after(() => srv && srv.close());

test("đếm đúng nhóm trang, gộp mọi bài học về một dòng", async () => {
  const tk = app.locals.thongKe;
  await fetch(base + "/");
  await fetch(base + "/landing.html");
  await fetch(base + "/bai");
  await fetch(base + "/nang-cap.html");
  await fetch(base + "/bai/tin-hoc-10-bai-1-thong-tin-du-lieu-va-cach-may-tinh-xu-li");
  await fetch(base + "/bai/tin-hoc-10-bai-2-may-tinh-bieu-dien-du-lieu-the-nao");

  const { tong } = await tk.tongHop(2);
  assert.equal(tong["app"], 1, "trang ứng dụng");
  assert.equal(tong["landing"], 1, "trang giới thiệu");
  assert.equal(tong["trang-gia"], 1, "trang nâng cấp");
  assert.equal(tong["bai"], 3, "1 lần /bai + 2 lần trang bài");

  /* Hai bài khác nhau phải gộp thành đúng một dòng "/bai/*": 119 bài mà mỗi bài
     một dòng mỗi ngày thì bảng phình vô ích. */
  const { rows } = await pool.query("SELECT duong_dan, so_luot FROM luot_xem WHERE loai = 'bai' ORDER BY duong_dan");
  const gop = rows.find((r) => r.duong_dan === "/bai/*");
  assert.ok(gop, "phải có dòng gộp /bai/*");
  assert.equal(gop.so_luot, 2);
});

test("tài nguyên tĩnh và API không tính vào lượt xem", async () => {
  const tk = app.locals.thongKe;
  const truoc = (await tk.tongHop(2)).tong;
  await fetch(base + "/css/styles.css");
  await fetch(base + "/js/app.js");
  await fetch(base + "/api/health");
  const sau = (await tk.tongHop(2)).tong;
  assert.deepEqual(sau, truoc, "không nhóm nào được tăng");
});

test("mốc phễu: tạo tài khoản được ghi lại", async () => {
  const tk = app.locals.thongKe;
  await fetch(base + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "dem@thu.vn", password: "matkhau123", name: "Thử" }),
  });
  const { tong } = await tk.tongHop(2);
  assert.equal(tong["tao-tai-khoan"], 1);
});

test("bảng đếm KHÔNG chứa cột nào lần ra được người dùng", async () => {
  const { rows } = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'luot_xem'"
  );
  const cot = rows.map((r) => r.column_name).sort();
  assert.deepEqual(cot, ["duong_dan", "loai", "ngay", "so_luot"],
    "thêm cột kiểu ip/user_id là phá cam kết ở trang quyền riêng tư");
});
