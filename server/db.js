/* ============================================================================
 *  KẾT NỐI POSTGRES + SCHEMA
 *  - DATABASE_URL lấy từ biến môi trường (Railway tự inject khi reference
 *    biến của service Postgres). Không có DATABASE_URL -> chạy chế độ "tĩnh":
 *    trang web vẫn phục vụ bình thường, các API tài khoản trả 503.
 *  - Schema tạo kiểu idempotent (CREATE TABLE IF NOT EXISTS) ngay lúc khởi
 *    động — DB mới toanh của Railway tự có đủ bảng, không cần bước migrate.
 * ==========================================================================*/
const { Pool } = require("pg");

/* Bảng `profiles`: một TÀI KHOẢN có thể có NHIỀU HỒ SƠ học tập (nhà có hai anh
   em, hoặc một giáo viên kèm vài học sinh). Toàn bộ tiến độ — attempts, learned,
   gamify, progress — gắn vào HỒ SƠ chứ không gắn vào tài khoản.

   Bảng `progress` là KHO KHOÁ-GIÁ TRỊ CHUNG cho mọi tiến độ thêm về sau (lịch ôn
   giãn cách, thành tích bền, đã xem mô phỏng…). Ba bảng kia mỗi loại một bảng
   riêng, nên thêm một tính năng là thêm bảng + endpoint + nhánh đồng bộ ở client
   — tốn dần. Với `progress` thì thêm tính năng chỉ cần gọi save() bằng một khoá
   mới, không phải động vào máy chủ nữa.
   ĐÁNH ĐỔI đã biết: gộp theo kiểu "bản mới hơn thắng cả khoá", nên hai máy cùng
   sửa một khoá thì bên ghi sau đè bên ghi trước. Chấp nhận được vì một học sinh
   hiếm khi học song song hai máy; muốn chuẩn hơn phải gộp theo từng mục, đắt hơn
   nhiều.
   LƯU Ý: không đặt chú thích dạng khối bên trong chuỗi SQL dưới đây — pg-mem
   (dùng cho test và chế độ dev) không parse được, tuy Postgres thật chấp nhận. */
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

CREATE TABLE IF NOT EXISTS profiles (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  gender     TEXT NOT NULL DEFAULT '',
  grade      TEXT NOT NULL DEFAULT '',
  track      TEXT NOT NULL DEFAULT '',
  mode       TEXT NOT NULL DEFAULT '',
  days       JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS profiles_user_idx ON profiles (user_id);

CREATE TABLE IF NOT EXISTS attempts (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id    INT REFERENCES profiles(id) ON DELETE CASCADE,
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
  profile_id INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id  TEXT NOT NULL,
  learned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS gamify (
  profile_id INT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress (
  profile_id INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  key        TEXT NOT NULL,
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, key)
);

CREATE TABLE IF NOT EXISTS licenses (
  id            SERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  plan          TEXT NOT NULL DEFAULT 'student',
  duration_days INT NOT NULL DEFAULT 365,
  activated_by  INT,
  activated_at  TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ,
  note          TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS licenses_user_idx ON licenses (activated_by);

CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  ma_don     TEXT UNIQUE NOT NULL,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goi        TEXT NOT NULL DEFAULT 'nam',
  so_tien    INT NOT NULL,
  so_ngay    INT NOT NULL DEFAULT 365,
  trang_thai TEXT NOT NULL DEFAULT 'cho',
  tx_id      TEXT,
  tx_so_tien INT,
  paid_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS pay_events (
  id         SERIAL PRIMARY KEY,
  tx_id      TEXT UNIQUE NOT NULL,
  ma_don     TEXT,
  so_tien    INT,
  noi_dung   TEXT NOT NULL DEFAULT '',
  khop       BOOLEAN NOT NULL DEFAULT false,
  ghi_chu    TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pay_events_khop_idx ON pay_events (khop, created_at DESC);

CREATE TABLE IF NOT EXISTS tutor_usage (
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ngay    DATE NOT NULL,
  so_luot INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, ngay)
);

CREATE TABLE IF NOT EXISTS tutor_log (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id  INT REFERENCES profiles(id) ON DELETE CASCADE,
  kieu        TEXT NOT NULL DEFAULT 'lesson',
  lesson_id   TEXT,
  question_id TEXT,
  cau_hoi     TEXT NOT NULL DEFAULT '',
  tra_loi     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tutor_log_profile_idx ON tutor_log (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS tutor_log_sai_idx ON tutor_log (question_id);

ALTER TABLE tutor_log ADD COLUMN IF NOT EXISTS ngay DATE;
ALTER TABLE tutor_log ADD COLUMN IF NOT EXISTS token_vao INT NOT NULL DEFAULT 0;
ALTER TABLE tutor_log ADD COLUMN IF NOT EXISTS token_dem INT NOT NULL DEFAULT 0;
ALTER TABLE tutor_log ADD COLUMN IF NOT EXISTS token_ra INT NOT NULL DEFAULT 0;
ALTER TABLE tutor_log ADD COLUMN IF NOT EXISTS model TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS tutor_log_ngay_idx ON tutor_log (ngay);

-- Đăng ký nhận nhắc học (Web Push). Mỗi THIẾT BỊ một dòng: một học sinh có thể
-- vừa cài trên điện thoại vừa mở trên máy tính, tắt máy này không tắt máy kia.
-- endpoint là URL do trình duyệt cấp, dài và duy nhất -> dùng luôn làm khoá.
-- gio = giờ muốn được nhắc (0-23, giờ Việt Nam). lan_cuoi = ngày đã gửi gần
-- nhất, để một ngày chỉ nhắc đúng một lần dù bộ đếm giờ chạy 5 phút một lượt.
CREATE TABLE IF NOT EXISTS push_subs (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id INT REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint   TEXT UNIQUE NOT NULL,
  p256dh     TEXT NOT NULL DEFAULT '',
  auth       TEXT NOT NULL DEFAULT '',
  gio        INT NOT NULL DEFAULT 19,
  bat        BOOLEAN NOT NULL DEFAULT true,
  lan_cuoi   DATE,
  loi        INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS push_subs_user_idx ON push_subs (user_id);
CREATE INDEX IF NOT EXISTS push_subs_gio_idx ON push_subs (bat, gio);

-- Đếm lượt truy cập theo NGÀY + LOẠI TRANG: không lưu IP, không đặt cookie theo
-- dõi, không gọi dịch vụ bên thứ ba — đủ để biết phễu chuyển đổi (vào landing ->
-- vào bài -> mở trang giá -> tạo tài khoản -> trả tiền) mà vẫn giữ đúng cam kết
-- ở trang quyền riêng tư. Một dòng cho mỗi (ngày, loại, đường dẫn).
CREATE TABLE IF NOT EXISTS luot_xem (
  ngay      DATE NOT NULL,
  loai      TEXT NOT NULL,
  duong_dan TEXT NOT NULL DEFAULT '',
  so_luot   INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (ngay, loai, duong_dan)
);
CREATE INDEX IF NOT EXISTS luot_xem_ngay_idx ON luot_xem (ngay DESC);
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
