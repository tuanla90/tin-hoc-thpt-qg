/* ============================================================================
 *  ĐIỂM KHỞI ĐỘNG — node server/index.js
 *  Railway: cần 2 biến môi trường trên service web:
 *    DATABASE_URL   = ${{Postgres.DATABASE_URL}}   (reference sang service DB)
 *    SESSION_SECRET = chuỗi ngẫu nhiên dài (tự đặt 1 lần)
 *  PORT do Railway tự cấp. Chạy local: npm start (đọc .env nếu có).
 * ==========================================================================*/
const { initDb } = require("./db");
const { createApp } = require("./app");
const { batDauLich } = require("./nhac");

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  let pool = null;
  try {
    pool = await initDb();
  } catch (e) {
    // DB lỗi vẫn phục vụ trang tĩnh để app không chết hẳn; API trả 503.
    console.error("[db] Không nối được Postgres:", e.message);
  }
  if (pool && !process.env.SESSION_SECRET) {
    console.warn("[session] THIẾU SESSION_SECRET — hãy đặt biến này trên Railway (secret dev không an toàn).");
  }
  const app = createApp({ pool });
  /* Bộ đếm giờ gửi nhắc học chỉ chạy ở tiến trình thật, KHÔNG chạy trong test
     (test gọi thẳng quet() với mốc thời gian tự đặt). */
  batDauLich(pool);
  app.listen(PORT, () => console.log(`[web] Đang chạy: http://localhost:${PORT} (db: ${pool ? "OK" : "chưa nối"})`));
})();
