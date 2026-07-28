/* Test vòng tròn sao lưu -> phục hồi (scripts/backup.js + restore.js) trên
 * pg-mem — script hỏng mà đến lúc mất DB mới biết thì backup vô nghĩa.
 * Chạy: npm test
 */
const { test } = require("node:test");
const assert = require("node:assert");
const { newDb } = require("pg-mem");

const { SCHEMA_SQL } = require("../db");
const { saoLuu, BANG } = require("../../scripts/backup");
const { phucHoi } = require("../../scripts/restore");

function taoPool() { return new (newDb().adapters.createPg().Pool)(); }

/* pg thật trả JSONB thành object, pg-mem có thể trả chuỗi — chuẩn hoá để so. */
function asObj(v) { return typeof v === "string" ? JSON.parse(v) : v; }

async function gieoDuLieu(pool) {
  await pool.query("INSERT INTO users (email, password_hash, name) VALUES ('a@b.vn', 'hash', 'Hà')");
  await pool.query(`INSERT INTO profiles (user_id, name, days) VALUES (1, 'Hà', '[2,4]')`);
  await pool.query(
    `INSERT INTO attempts (user_id, profile_id, client_ts, mode, lesson_id, score, correct_count, total, duration_sec, detail)
     VALUES (1, 1, 1753690000000, 'exam', 'C10-01', 8.25, 22, 28, 1500, '{"timeUp": false}')`);
  await pool.query("INSERT INTO learned (profile_id, lesson_id) VALUES (1, 'C10-01')");
  await pool.query(`INSERT INTO gamify (profile_id, data) VALUES (1, '{"xp": 120}')`);
  await pool.query("INSERT INTO licenses (code, note) VALUES ('TIN-ABCD-2345', 'lô thử')");
  await pool.query("INSERT INTO tutor_usage (user_id, ngay, so_luot) VALUES (1, '2026-07-28', 3)");
  await pool.query("INSERT INTO tutor_log (user_id, cau_hoi, tra_loi) VALUES (1, 'Bit là gì?', 'Là...')");
}

test("sao lưu đủ 8 bảng, đủ dòng", async () => {
  const a = taoPool();
  await a.query(SCHEMA_SQL);
  await gieoDuLieu(a);

  const du = await saoLuu(a);
  assert.equal(du.phienBan, 1);
  for (const t of BANG) assert.ok(Array.isArray(du.bang[t]), "thiếu bảng " + t);
  assert.equal(du.bang.users.length, 1);
  assert.equal(du.bang.attempts.length, 1);
  assert.equal(du.bang.licenses.length, 1);
  assert.equal(du.bang.tutor_usage.length, 1);
});

test("phục hồi vào DB rỗng: giữ nguyên dữ liệu, kể cả JSONB và điểm số", async () => {
  const a = taoPool();
  await a.query(SCHEMA_SQL);
  await gieoDuLieu(a);

  // đi đúng con đường thật: object -> ghi file JSON -> đọc lại
  const du = JSON.parse(JSON.stringify(await saoLuu(a)));

  const b = taoPool();
  const kq = await phucHoi(b, du);
  assert.equal(kq.users, 1);
  assert.equal(kq.attempts, 1);

  const u = await b.query("SELECT * FROM users");
  assert.equal(u.rows[0].email, "a@b.vn");
  const at = await b.query("SELECT * FROM attempts");
  assert.equal(Number(at.rows[0].score), 8.25);
  assert.deepEqual(asObj(at.rows[0].detail), { timeUp: false });
  const g = await b.query("SELECT * FROM gamify");
  assert.deepEqual(asObj(g.rows[0].data), { xp: 120 });
  const lic = await b.query("SELECT * FROM licenses");
  assert.equal(lic.rows[0].code, "TIN-ABCD-2345");
});

test("không phục hồi đè lên DB đã có dữ liệu (trừ khi --force)", async () => {
  const a = taoPool();
  await a.query(SCHEMA_SQL);
  await gieoDuLieu(a);
  const du = JSON.parse(JSON.stringify(await saoLuu(a)));

  const b = taoPool();
  await b.query(SCHEMA_SQL);
  await b.query("INSERT INTO users (email, password_hash, name) VALUES ('dang-dung@b.vn', 'x', 'B')");
  await assert.rejects(() => phucHoi(b, du), /DB đích đã có/);
});

test("file sai định dạng bị từ chối ngay", async () => {
  const b = taoPool();
  await assert.rejects(() => phucHoi(b, { linh: "tinh" }), /không đúng định dạng/);
});
