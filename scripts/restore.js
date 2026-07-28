/* ============================================================================
 *  PHỤC HỒI DỮ LIỆU TỪ FILE SAO LƯU (scripts/backup.js) VÀO MỘT DB MỚI.
 *
 *  Cách dùng (khi mất DB / chuyển nhà cung cấp):
 *    node scripts/restore.js backup/tinhoc-backup-....json "postgresql://URL-DB-MỚI"
 *
 *  - URL đích BẮT BUỘC gõ tay ở tham số thứ 2 (không đọc từ .env) — để không thể
 *    lỡ tay phục hồi đè lên DB đang chạy.
 *  - Chỉ phục hồi vào DB RỖNG (chưa có user nào). DB đã có dữ liệu thì dừng ngay;
 *    thêm --force nếu thật sự muốn chèn tiếp (dễ đụng trùng id — chỉ dành cho
 *    người hiểu mình đang làm gì).
 *  - Schema tự tạo trước (SCHEMA_SQL của server/db.js) nên DB Postgres mới toanh
 *    cũng phục hồi được ngay.
 * ==========================================================================*/
const fs = require("fs");
const { SCHEMA_SQL } = require("../server/db");
const { BANG } = require("./backup");

/* Chèn dữ liệu backup vào pool. Trả về { tenBang: soDong }. */
async function phucHoi(pool, du, opts = {}) {
  if (!du || du.phienBan !== 1 || !du.bang) throw new Error("File sao lưu không đúng định dạng.");
  try { await pool.query(SCHEMA_SQL); }
  catch (e) {
    // pg-mem (test/dev) không chạy lại được CREATE TABLE IF NOT EXISTS khi bảng
    // đã có; Postgres thật luôn qua. Chỉ bỏ qua nếu bảng users thực sự tồn tại.
    try { await pool.query("SELECT 1 FROM users LIMIT 1"); } catch (_) { throw e; }
  }

  const co = await pool.query('SELECT COUNT(*)::int AS n FROM users');
  if (co.rows[0].n > 0 && !opts.force) {
    throw new Error("DB đích đã có " + co.rows[0].n + " tài khoản — chỉ phục hồi vào DB rỗng. (Thêm --force nếu chắc chắn.)");
  }

  // Bảng trong file nhưng ngoài danh sách đã biết -> chèn cuối (sau các bảng nó có thể trỏ vào)
  const thuTu = BANG.concat(Object.keys(du.bang).filter((t) => !BANG.includes(t)));
  const kq = {};
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const t of thuTu) {
      const rows = du.bang[t] || [];
      for (const row of rows) {
        const cot = Object.keys(row);
        const giaTri = cot.map((c) => {
          const v = row[c];
          // JSONB đọc ra là object -> trả về dạng chuỗi JSON cho tham số
          return v !== null && typeof v === "object" ? JSON.stringify(v) : v;
        });
        await client.query(
          `INSERT INTO "${t}" (${cot.map((c) => '"' + c + '"').join(",")})
           VALUES (${cot.map((_, i) => "$" + (i + 1)).join(",")})`,
          giaTri
        );
      }
      kq[t] = rows.length;
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }

  // Đẩy sequence id qua giá trị lớn nhất vừa chèn — thiếu bước này thì tài khoản
  // đăng ký sau phục hồi bị trùng id. Bảng không có id serial thì bỏ qua êm.
  for (const t of thuTu) {
    try {
      await pool.query(
        `SELECT setval(pg_get_serial_sequence('${t}', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "${t}"))`);
    } catch (e) { /* không có cột id / pg-mem không hỗ trợ */ }
  }
  return kq;
}

async function main() {
  const [tep, url] = process.argv.slice(2);
  const force = process.argv.includes("--force");
  if (!tep || !url || !/^postgres/.test(url)) {
    console.error('Cách dùng: node scripts/restore.js <file-backup.json> "postgresql://URL-DB-MỚI" [--force]');
    process.exit(1);
  }
  const du = JSON.parse(fs.readFileSync(tep, "utf8"));
  const { ketNoi } = require("./backup");
  const pool = await ketNoi(url);
  try {
    const kq = await phucHoi(pool, du, { force });
    console.log("Đã phục hồi:");
    for (const [t, n] of Object.entries(kq)) console.log(`  ${t.padEnd(12)} ${n} dòng`);
  } finally {
    await pool.end().catch(() => {});
  }
}

if (require.main === module) main().catch((e) => { console.error("Phục hồi THẤT BẠI:", e.message); process.exit(1); });

module.exports = { phucHoi };
