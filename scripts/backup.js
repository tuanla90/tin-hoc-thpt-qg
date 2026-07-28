/* ============================================================================
 *  SAO LƯU TAY DỮ LIỆU POSTGRES (RAILWAY) VỀ MÁY — không cần cài pg_dump.
 *
 *  Cách dùng:
 *    1. Railway -> service Postgres -> tab Settings/Networking -> bật TCP Proxy
 *       (nếu chưa) -> tab Connect -> copy chuỗi "Public Network":
 *       postgresql://postgres:MẬT_KHẨU@xxxx.proxy.rlwy.net:CỔNG/railway
 *    2. Dán vào .env:  BACKUP_DATABASE_URL=postgresql://...
 *    3. Chạy:          npm run backup
 *       (hoặc truyền URL trực tiếp: node scripts/backup.js "postgresql://...")
 *
 *  Kết quả: backup/tinhoc-backup-YYYY-MM-DD-HHmm.json — mỗi bảng một mảng dòng.
 *  Phục hồi bằng scripts/restore.js (xem hướng dẫn trong file đó).
 *
 *  ⚠️ CHUỖI URL NÀY = TOÀN QUYỀN ĐỌC/GHI DB, và file backup chứa dữ liệu cá nhân
 *  của học sinh + mã kích hoạt. Cả hai chỉ để trên máy mình: .env và backup/
 *  đều đã nằm trong .gitignore — đừng dán vào chat/commit/ổ đĩa chia sẻ.
 * ==========================================================================*/
const fs = require("fs");
const path = require("path");

/* Thứ tự bảng theo khoá ngoại (users trước, các bảng trỏ vào sau) — restore.js
   chèn lại theo đúng thứ tự này. Thêm bảng mới vào db.js thì thêm vào đây;
   quên cũng không mất dữ liệu: bảng lạ được tự phát hiện và chèn cuối. */
const BANG = ["users", "profiles", "attempts", "learned", "gamify", "licenses", "tutor_usage", "tutor_log"];

/* Kéo toàn bộ dữ liệu về một object JSON-hoá được. */
async function saoLuu(pool) {
  const ra = { phienBan: 1, luc: new Date().toISOString(), bang: {} };
  const ten = BANG.slice();
  try {
    // Bảng có trong DB nhưng chưa có trong danh sách (schema mới hơn script)
    const r = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");
    for (const row of r.rows) {
      const t = row.table_name;
      if (t !== "session" && !ten.includes(t)) ten.push(t); // session là phiên đăng nhập tạm, bỏ qua
    }
  } catch (e) { /* pg-mem không có information_schema -> dùng danh sách tĩnh */ }
  for (const t of ten) {
    const r = await pool.query(`SELECT * FROM "${t}"`);
    ra.bang[t] = r.rows;
  }
  return ra;
}

/* Nối thử không SSL trước (proxy Railway là TCP thô); server đòi SSL thì thử lại. */
async function ketNoi(url) {
  const { Pool } = require("pg");
  let pool = new Pool({ connectionString: url, max: 2, connectionTimeoutMillis: 15000 });
  try { await pool.query("SELECT 1"); return pool; }
  catch (e) {
    await pool.end().catch(() => {});
    if (!/ssl/i.test(String(e.message))) throw e;
    pool = new Pool({ connectionString: url, max: 2, connectionTimeoutMillis: 15000, ssl: { rejectUnauthorized: false } });
    await pool.query("SELECT 1");
    return pool;
  }
}

async function main() {
  const url = process.argv[2] || process.env.BACKUP_DATABASE_URL;
  if (!url || !/^postgres/.test(url)) {
    console.error("Chưa có URL Postgres. Thêm vào .env dòng:\n  BACKUP_DATABASE_URL=postgresql://... (chuỗi Public Network của Railway)\nrồi chạy lại: npm run backup");
    process.exit(1);
  }
  const pool = await ketNoi(url);
  try {
    const du = await saoLuu(pool);
    const d = new Date();
    const p2 = (n) => String(n).padStart(2, "0");
    const tenTep = `tinhoc-backup-${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.json`;
    const thuMuc = path.join(__dirname, "..", "backup");
    fs.mkdirSync(thuMuc, { recursive: true });
    const duongDan = path.join(thuMuc, tenTep);
    fs.writeFileSync(duongDan, JSON.stringify(du));
    console.log("Đã sao lưu:");
    for (const [t, rows] of Object.entries(du.bang)) console.log(`  ${t.padEnd(12)} ${rows.length} dòng`);
    console.log(`-> ${duongDan} (${Math.round(fs.statSync(duongDan).size / 1024)} KB)`);
    console.log("Phục hồi khi cần: node scripts/restore.js backup/" + tenTep + ' "postgresql://URL-DB-MỚI"');
  } finally {
    await pool.end().catch(() => {});
  }
}

if (require.main === module) main().catch((e) => { console.error("Sao lưu THẤT BẠI:", e.message); process.exit(1); });

module.exports = { saoLuu, ketNoi, BANG };
