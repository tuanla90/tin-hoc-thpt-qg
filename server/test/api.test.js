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

test("đăng ký: email sai / mật khẩu ngắn bị chặn", async () => {
  assert.equal((await req("/api/auth/register", { method: "POST", body: { email: "sai", password: "123456" } })).status, 400);
  assert.equal((await req("/api/auth/register", { method: "POST", body: { email: "a@b.vn", password: "123" } })).status, 400);
});

test("đăng ký thành công + /me trả user", async () => {
  const r = await req("/api/auth/register", { method: "POST", body: { email: "An.Nguyen@Gmail.com", password: "123456", name: "An" } });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.email, "an.nguyen@gmail.com");
  const me = await req("/api/me");
  assert.equal(me.data.user.email, "an.nguyen@gmail.com");
});

test("đăng ký trùng email -> 409", async () => {
  const r = await req("/api/auth/register", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "abcdef" } });
  assert.equal(r.status, 409);
});

test("ghi attempts (đơn + bulk, trùng client_ts bị bỏ qua)", async () => {
  const rec = { at: 1000, mode: "exam", code: "101", score: 8.5, correctCount: 24, total: 28, durationSec: 900 };
  const r1 = await req("/api/attempts", { method: "POST", body: { record: rec } });
  assert.equal(r1.status, 200);
  const r2 = await req("/api/attempts", { method: "POST", body: { records: [rec, { at: 2000, mode: "practice", lessonId: "C10-01", score: 0.8, correctCount: 4, total: 5 }] } });
  assert.equal(r2.status, 200);
  const sync = await req("/api/sync");
  assert.equal(sync.data.attempts.length, 2); // rec trùng at=1000 chỉ tính 1
  assert.equal(sync.data.attempts[0].at, 2000); // mới nhất trước
  assert.equal(sync.data.attempts[1].code, "101");
});

test("learned: PUT là phép hợp", async () => {
  const r1 = await req("/api/learned", { method: "PUT", body: { ids: ["C10-01", "C10-02"] } });
  assert.deepEqual(r1.data.learned.sort(), ["C10-01", "C10-02"]);
  const r2 = await req("/api/learned", { method: "PUT", body: { ids: ["C10-02", "C10-03"] } });
  assert.deepEqual(r2.data.learned.sort(), ["C10-01", "C10-02", "C10-03"]);
});

test("gamify: upsert và đọc lại", async () => {
  await req("/api/gamify", { method: "PUT", body: { data: { xp: 120, streak: 3 } } });
  await req("/api/gamify", { method: "PUT", body: { data: { xp: 150, streak: 4 } } });
  const sync = await req("/api/sync");
  assert.equal(sync.data.gamify.xp, 150);
});

test("profile: cập nhật hồ sơ + tên hiển thị", async () => {
  const r = await req("/api/profile", { method: "PUT", body: { profile: { name: "Nguyễn Văn An", grade: "12", track: "khmt" } } });
  assert.equal(r.status, 200);
  const sync = await req("/api/sync");
  assert.equal(sync.data.profile.track, "khmt");
  const me = await req("/api/me");
  assert.equal(me.data.user.name, "Nguyễn Văn An");
});

test("logout -> mất phiên; login lại -> dữ liệu còn nguyên", async () => {
  await req("/api/auth/logout", { method: "POST" });
  assert.equal((await req("/api/me")).data.user, null);
  assert.equal((await req("/api/sync")).status, 401);
  const r = await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "123456" } });
  assert.equal(r.status, 200);
  const sync = await req("/api/sync");
  assert.equal(sync.data.attempts.length, 2);
  assert.equal(sync.data.learned.length, 3);
});

test("mật khẩu sai -> 401", async () => {
  const r = await req("/api/auth/login", { method: "POST", body: { email: "an.nguyen@gmail.com", password: "saimatkhau" } });
  assert.equal(r.status, 401);
});
