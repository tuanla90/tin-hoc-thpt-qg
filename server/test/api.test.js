/* Test tích hợp API với pg-mem (Postgres giả lập trong RAM — không cần cài DB).
 * Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { newDb } = require("pg-mem");
const { initDb } = require("../db");
const { createApp } = require("../app");

let srv, base, pool, cookie = "";
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
  pool = await initDb(new Pool());
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

test("gói Miễn phí: 1 hồ sơ, /me báo tier free", async () => {
  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "free");
  assert.equal(me.data.maxProfiles, 1);
  const r = await req("/api/profiles", { method: "POST", body: { name: "Bình" } });
  assert.equal(r.status, 400);                       // free chưa thêm được hồ sơ thứ hai
  assert.match(r.data.error, /Premium/);
});

test("kích hoạt mã: sai mã bị chặn, đúng mã lên Premium, mã dùng rồi không dùng lại được", async () => {
  await pool.query("INSERT INTO licenses (code, duration_days, note) VALUES ('TIN-AAAA-2222', 365, 'test')");

  assert.equal((await req("/api/licenses/activate", { method: "POST", body: { code: "xyz" } })).status, 400);
  assert.equal((await req("/api/licenses/activate", { method: "POST", body: { code: "TIN-AAAA-9999" } })).status, 404);

  // gõ thường, thiếu gạch nối vẫn nhận
  const ok = await req("/api/licenses/activate", { method: "POST", body: { code: "tin aaaa 2222" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.plan.tier, "paid");
  assert.ok(new Date(ok.data.plan.hetHan).getTime() > Date.now() + 300 * 86400000);

  const me = await req("/api/me");
  assert.equal(me.data.plan.tier, "paid");
  assert.equal(me.data.maxProfiles, 3);

  // chính mình nhập lại -> báo đã dùng, không lỗi; người khác nhập -> 409
  assert.equal((await req("/api/licenses/activate", { method: "POST", body: { code: "TIN-AAAA-2222" } })).data.daTung, true);
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/register", { method: "POST", body: { email: "chomo@test.vn", password: "123456", name: "Chờ" } });
  assert.equal((await req("/api/licenses/activate", { method: "POST", body: { code: "TIN-AAAA-2222" } })).status, 409);
  // logout huỷ session phía máy chủ nên phải ĐĂNG NHẬP LẠI, không khôi phục cookie cũ được
  await req("/api/auth/logout", { method: "POST" });
  await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "123456" } });
});

test("thêm hồ sơ thứ hai (đã Premium) và sửa thông tin", async () => {
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

test("kho tiến độ chung: ghi, đọc lại, tách theo hồ sơ, chặn khoá lạ", async () => {
  const srs = { "CC-mc-101": { l: 2, h: 20300, s: 1, k: 1, n: 20295 } };
  const r1 = await req("/api/state/srs", { method: "PUT", body: { profileId: hoSo1, data: { v: srs, _ts: 111 } } });
  assert.equal(r1.status, 200);

  const s1 = await req("/api/sync?profileId=" + hoSo1);
  assert.equal(s1.data.progress.srs.data._ts, 111);
  assert.deepEqual(s1.data.progress.srs.data.v, srs);

  // Hồ sơ khác không thấy dữ liệu của hồ sơ này
  const s2 = await req("/api/sync?profileId=" + hoSo2);
  assert.equal(s2.data.progress.srs, undefined);

  // Ghi đè cùng khoá thì thay hẳn, không nhân bản hàng
  await req("/api/state/srs", { method: "PUT", body: { profileId: hoSo1, data: { v: {}, _ts: 222 } } });
  const s3 = await req("/api/sync?profileId=" + hoSo1);
  assert.equal(s3.data.progress.srs.data._ts, 222);

  /* Danh sách trắng: khoá ngoài danh sách phải bị từ chối, nếu không thì một
     client lỗi có thể nhồi dữ liệu tuỳ ý vào cơ sở dữ liệu. */
  const xau = await req("/api/state/linhtinh", { method: "PUT", body: { profileId: hoSo1, data: { v: 1 } } });
  assert.equal(xau.status, 400);

  // Thiếu dữ liệu cũng phải bị từ chối
  const thieu = await req("/api/state/srs", { method: "PUT", body: { profileId: hoSo1 } });
  assert.equal(thieu.status, 400);
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
