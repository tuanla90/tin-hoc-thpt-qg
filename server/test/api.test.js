/* Test tích hợp API với pg-mem (Postgres giả lập trong RAM — không cần cài DB).
 * Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { newDb } = require("pg-mem");
const { initDb } = require("../db");
const { createApp } = require("../app");

let srv, base, cookie = "";
let hoSo1 = null, hoSo2 = null;

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
  const pool = await initDb(new Pool());
  const app = createApp({ pool, sessionStore: new session.MemoryStore() });
  srv = app.listen(0);
  base = "http://127.0.0.1:" + srv.address().port;
});

after(() => srv && srv.close());

test("health có db", async () => {
  const r = await req("/api/health");
  assert.equal(r.status, 200);
  assert.equal(r.data.db, true);
});

test("chưa đăng nhập thì không lấy được hồ sơ", async () => {
  assert.equal((await req("/api/profiles")).status, 401);
});

test("đăng ký: email sai / mật khẩu ngắn bị chặn", async () => {
  assert.equal((await req("/api/auth/register", { method: "POST", body: { email: "sai", password: "123456" } })).status, 400);
  assert.equal((await req("/api/auth/register", { method: "POST", body: { email: "a@b.vn", password: "123" } })).status, 400);
});

test("đăng ký xong có sẵn 1 hồ sơ", async () => {
  const r = await req("/api/auth/register", { method: "POST", body: { email: "An.Nguyen@Gmail.com", password: "123456", name: "An" } });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.email, "an.nguyen@gmail.com");
  assert.equal(r.data.profiles.length, 1);
  assert.equal(r.data.profiles[0].name, "An");
  hoSo1 = r.data.profiles[0].id;
});

test("đăng ký trùng email -> 409", async () => {
  assert.equal((await req("/api/auth/register", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "abcdef" } })).status, 409);
});

test("thêm hồ sơ thứ hai và sửa thông tin", async () => {
  const r = await req("/api/profiles", { method: "POST", body: { name: "Bình" } });
  assert.equal(r.status, 200);
  hoSo2 = r.data.profile.id;
  const u = await req("/api/profiles/" + hoSo2, { method: "PATCH", body: { name: "Bình", grade: "12", track: "khmt", mode: "tuantu", days: [1, 3, 5] } });
  assert.equal(u.data.profile.grade, "12");
  assert.deepEqual(u.data.profile.days, [1, 3, 5]);
  const ds = await req("/api/profiles");
  assert.equal(ds.data.profiles.length, 2);
});

test("thiếu profileId thì API dữ liệu báo lỗi", async () => {
  assert.equal((await req("/api/sync")).status, 400);
  assert.equal((await req("/api/attempts", { method: "POST", body: { record: { at: 1 } } })).status, 400);
});

test("tiến độ tách riêng theo từng hồ sơ", async () => {
  const rec = (at, lessonId) => ({ at, mode: "practice", lessonId, score: 8, correctCount: 4, total: 5 });
  await req("/api/attempts", { method: "POST", body: { profileId: hoSo1, record: rec(1000, "C10-01") } });
  await req("/api/learned", { method: "PUT", body: { profileId: hoSo1, ids: ["C10-01", "C10-02"] } });
  await req("/api/gamify", { method: "PUT", body: { profileId: hoSo1, data: { xp: 120 } } });

  await req("/api/attempts", { method: "POST", body: { profileId: hoSo2, record: rec(2000, "C12-01") } });
  await req("/api/learned", { method: "PUT", body: { profileId: hoSo2, ids: ["C12-01"] } });

  const s1 = await req("/api/sync?profileId=" + hoSo1);
  const s2 = await req("/api/sync?profileId=" + hoSo2);
  assert.equal(s1.data.attempts.length, 1);
  assert.equal(s1.data.attempts[0].lessonId, "C10-01");
  assert.deepEqual(s1.data.learned.sort(), ["C10-01", "C10-02"]);
  assert.equal(s1.data.gamify.xp, 120);

  assert.equal(s2.data.attempts.length, 1);
  assert.equal(s2.data.attempts[0].lessonId, "C12-01");
  assert.deepEqual(s2.data.learned, ["C12-01"]);
  assert.equal(s2.data.gamify, null);        // hồ sơ 2 chưa có XP riêng
  assert.equal(s2.data.profile.name, "Bình");
});

test("không truy cập được hồ sơ của tài khoản khác", async () => {
  const cu = cookie;
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/register", { method: "POST", body: { email: "khac@test.vn", password: "123456", name: "Khác" } });
  const r = await req("/api/sync?profileId=" + hoSo1);
  assert.equal(r.status, 400);                      // hồ sơ không thuộc tài khoản này
  const x = await req("/api/profiles/" + hoSo1, { method: "PATCH", body: { name: "Chiếm" } });
  assert.equal(x.status, 404);
  await req("/api/auth/logout", { method: "POST" });
  cookie = cu;
});

test("đăng nhập lại: còn đủ hồ sơ và tiến độ", async () => {
  const r = await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "123456" } });
  assert.equal(r.status, 200);
  assert.equal(r.data.profiles.length, 2);
  const s = await req("/api/sync?profileId=" + hoSo1);
  assert.equal(s.data.attempts.length, 1);
  assert.equal(s.data.learned.length, 2);
});

test("xoá hồ sơ: xoá được cái thứ hai, không xoá được cái cuối cùng", async () => {
  assert.equal((await req("/api/profiles/" + hoSo2, { method: "DELETE" })).status, 200);
  const ds = await req("/api/profiles");
  assert.equal(ds.data.profiles.length, 1);
  const r = await req("/api/profiles/" + hoSo1, { method: "DELETE" });
  assert.equal(r.status, 400);
});

test("mật khẩu sai -> 401", async () => {
  const r = await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "saimatkhau" } });
  assert.equal(r.status, 401);
});

test("xoá tài khoản: sai mật khẩu thì không xoá gì; đúng thì mất sạch", async () => {
  await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "123456" } });
  const sai = await req("/api/auth/account", { method: "DELETE", body: { password: "khong-phai" } });
  assert.equal(sai.status, 401);
  assert.equal((await req("/api/profiles")).data.profiles.length, 1); // vẫn còn nguyên

  const ok = await req("/api/auth/account", { method: "DELETE", body: { password: "123456" } });
  assert.equal(ok.status, 200);
  assert.equal((await req("/api/profiles")).status, 401);             // phiên đã bị huỷ
  const lai = await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "123456" } });
  assert.equal(lai.status, 401);                                      // tài khoản không còn
});
