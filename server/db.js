/* ============================================================================
 *  KẾT NỐI POSTGRES + SCHEMA
 *  - DATABASE_URL lấy từ biến môi trường (Railway tự inject khi reference
 *    biến của service Postgres). Không có DATABASE_URL -> chạy chế độ "tĩnh":
 *    trang web vẫn phục vụ bình thường, các API tài khoản trả 503.
 *  - Schema tạo kiểu idempotent (CREATE TABLE IF NOT EXISTS) ngay lúc khởi
 *    động — DB mới toanh của Railway tự có đủ bảng, không cần bước migrate.
 * ==========================================================================*/
const { Pool } = require("pg");

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'student',
  profile       JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS attempts (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_ts     BIGINT NOT NULL,
  mode          TEXT,
  lesson_id     TEXT,
  exam_code     TEXT,
  score         NUMERIC,
  correct_count INT,
  total         INT,
  duration_sec  INT,
  detail        JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_ts)
);
CREATE INDEX IF NOT EXISTS attempts_user_idx ON attempts (user_id, client_ts DESC);

CREATE TABLE IF NOT EXISTS learned (
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id  TEXT NOT NULL,
  learned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS gamify (
  user_id    INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

/* Tạo pool từ DATABASE_URL (hoặc nhận pool ngoài — dùng cho test pg-mem). */
async function initDb(externalPool) {
  let pool = externalPool || null;
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.warn("[db] Chưa có DATABASE_URL — chạy chế độ tĩnh, API tài khoản trả 503.");
      return null;
    }
    if (url === "pgmem") {
      // Chế độ DEV không cần cài Postgres: DB giả lập trong RAM (pg-mem,
      // devDependency). MẤT DỮ LIỆU khi restart — chỉ để thử tính năng local.
      const { newDb } = require("pg-mem");
      pool = new (newDb().adapters.createPg().Pool)();
      pool._pgmem = true;
      console.warn("[db] DEV: dùng pg-mem trong RAM — dữ liệu mất khi restart.");
    } else pool = new Pool({
      connectionString: url,
      max: 5,
      // Postgres nội bộ Railway không cần SSL; nếu nối DB ngoài báo lỗi SSL
      // thì đặt biến DATABASE_SSL=1.
      ssl: process.env.DATABASE_SSL === "1" ? { rejectUnauthorized: false } : undefined,
    });
  }
  await pool.query(SCHEMA_SQL);
  console.log("[db] Postgres sẵn sàng (schema đã đảm bảo).");
  return pool;
}

module.exports = { initDb, SCHEMA_SQL };
