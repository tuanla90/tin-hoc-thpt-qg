/* ============================================================================
 *  DỰNG EXPRESS APP (tách khỏi index.js để test được)
 *  - Serve trang tĩnh từ public/ (toàn bộ frontend hiện tại, giữ nguyên).
 *  - Session cookie lưu ở Postgres (connect-pg-simple); chưa có DB thì dùng
 *    MemoryStore (chỉ hợp chạy local).
 * ==========================================================================*/
const path = require("path");
const express = require("express");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const { createApi } = require("./api");
const { createTutor } = require("./tutor");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

function createApp({ pool, sessionStore } = {}) {
  const app = express();
  app.set("trust proxy", 1); // Railway đứng sau proxy — cần cho cookie secure
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
  app.use("/api", createApi(pool));

  app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

  /* Đường dẫn lạ (không phải /api, không phải tệp tĩnh) -> về trang chính. */
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(PUBLIC_DIR, "index.html"));
    }
    next();
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
