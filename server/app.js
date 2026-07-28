/* ============================================================================
 *  DỰNG EXPRESS APP (tách khỏi index.js để test được)
 *  - Serve trang tĩnh từ public/ (toàn bộ frontend hiện tại, giữ nguyên).
 *  - Session cookie lưu ở Postgres (connect-pg-simple); chưa có DB thì dùng
 *    MemoryStore (chỉ hợp chạy local).
 * ==========================================================================*/
const path = require("path");
const express = require("express");
const compression = require("compression");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const { createApi } = require("./api");
const { createTutor } = require("./tutor");
const { createAdmin } = require("./admin");
const { createSeo } = require("./seo");
const { createPay } = require("./pay");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

function createApp({ pool, sessionStore } = {}) {
  const app = express();
  app.set("trust proxy", 1); // Railway đứng sau proxy — cần cho cookie secure
  /* Nén trước mọi thứ: dữ liệu bài học/câu hỏi là JS text tiếng Việt nên gzip
     ăn rất mạnh (khoảng 5MB -> 1,2MB). Phải đặt trên static mới nén được tệp tĩnh. */
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));

  const store = sessionStore || (pool && !pool._pgmem
    ? new PgSession({ pool, createTableIfMissing: true })
    : undefined); // undefined -> MemoryStore (chỉ dev local / pg-mem)
  if (!pool && !sessionStore) {
    console.warn("[session] Dùng MemoryStore (mất session khi restart) — chỉ nên dùng khi chạy local.");
  }

  app.use(session({
    store,
    name: "tinhoc.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-doi-toi-khi-len-production",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 180 * 24 * 3600 * 1000, // 180 ngày
    },
  }));

  app.use("/api", createTutor(pool)); // đặt trước createApi để /tutor/status trả được cả khi chưa có DB
  app.use("/api", createAdmin(pool));
  app.use("/api", createPay(pool));
  app.use("/api", createApi(pool));

  /* Trang công khai cho Google (/bai, /sitemap.xml, /robots.txt) — không cần DB,
     không cần đăng nhập. Đặt trước static để chắc chắn đứng trước lối "về trang chính". */
  app.use(createSeo());

  /* Cache tệp tĩnh.
     Tên tệp CHƯA có mã băm nên không dám cache lâu thứ gì hay đổi: js/css chỉ
     revalidate (ETag trả 304, rẻ) để deploy xong là người dùng thấy ngay bản mới.
     Ảnh, phông và thư viện trong js/vendor gần như không bao giờ đổi nội dung mà
     lại nặng nhất (skulpt ~948KB, sql-wasm ~692KB) — cache thẳng 30 ngày. */
  const CACHE_LAU = /[\\/](asset|vendor)[\\/]|\.(png|jpe?g|jfif|gif|svg|ico|webp|avif|woff2?|wasm)$/i;
  app.use(express.static(PUBLIC_DIR, {
    extensions: ["html"],
    setHeaders(res, filePath) {
      if (CACHE_LAU.test(filePath)) res.setHeader("Cache-Control", "public, max-age=2592000");
      else if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
      else res.setHeader("Cache-Control", "no-cache"); // js/css: luôn hỏi lại, ETag lo phần còn lại
    },
  }));

  /* Đường dẫn lạ -> 404 THẬT.
     Trước đây trả index.html kèm status 200, nên mọi URL sai đều thành "soft 404":
     Google index URL rác và phí crawl budget. Ứng dụng định tuyến bằng hash (#...)
     nên không có đường dẫn hợp lệ nào rơi xuống đây. */
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
  });

  /* Lỗi -> JSON gọn, log đầy đủ ở server. */
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error("[api] Lỗi:", err);
    res.status(500).json({ error: "Có lỗi phía máy chủ, thử lại sau." });
  });

  return app;
}

module.exports = { createApp };
