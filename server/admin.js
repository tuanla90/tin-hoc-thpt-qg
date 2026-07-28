/* ============================================================================
 *  ADMIN MINI — /api/admin/*  (tạo lô mã kích hoạt, xem mã, số liệu nhanh)
 *
 *  Ai là admin? users.role = 'admin', HOẶC email nằm trong biến môi trường
 *  ADMIN_EMAILS (phân cách bằng dấu phẩy). Cách thứ hai để bootstrap: đặt biến
 *  trên Railway, đăng nhập bằng đúng email đó là thành admin (role được tự
 *  nâng luôn để lần sau không phụ thuộc biến).
 *  Giao diện: public/admin.html (trang tĩnh gọi các API này bằng session cookie).
 * ==========================================================================*/
const express = require("express");
const { sinhMa } = require("./plan");

function danhSachAdminEmail() {
  return String(process.env.ADMIN_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function createAdmin(pool) {
  const r = express.Router();

  r.use("/admin", async (req, res, next) => {
    try {
      if (!pool) return res.status(503).json({ error: "Máy chủ chưa nối cơ sở dữ liệu." });
      if (!req.session || !req.session.uid) return res.status(401).json({ error: "Bạn chưa đăng nhập." });
      const f = await pool.query("SELECT id, email, role FROM users WHERE id = $1", [req.session.uid]);
      const u = f.rows[0];
      if (!u) return res.status(401).json({ error: "Bạn chưa đăng nhập." });
      let laAdmin = u.role === "admin";
      if (!laAdmin && danhSachAdminEmail().includes(String(u.email).toLowerCase())) {
        await pool.query("UPDATE users SET role = 'admin' WHERE id = $1", [u.id]); // bootstrap
        laAdmin = true;
      }
      if (!laAdmin) return res.status(403).json({ error: "Trang này chỉ dành cho quản trị viên." });
      next();
    } catch (e) { next(e); }
  });

  const q = (text, params) => pool.query(text, params);

  /* Tạo lô mã: { soLuong, soNgay, ghiChu } -> trả danh sách mã vừa tạo. */
  r.post("/admin/licenses", async (req, res, next) => {
    try {
      const b = req.body || {};
      const soLuong = Math.min(100, Math.max(1, Number(b.soLuong) || 1));
      const soNgay = Math.min(1100, Math.max(1, Number(b.soNgay) || 365));
      const ghiChu = String(b.ghiChu || "").slice(0, 200);
      const codes = [];
      for (let i = 0; i < soLuong; i++) {
        // Va trúng mã đã có (xác suất ~0) thì sinh lại — tối đa vài lần thử
        for (let thu = 0; thu < 5; thu++) {
          const code = sinhMa();
          try {
            await q("INSERT INTO licenses (code, duration_days, note) VALUES ($1, $2, $3)", [code, soNgay, ghiChu]);
            codes.push(code);
            break;
          } catch (e) { if (thu === 4) throw e; }
        }
      }
      res.json({ ok: true, codes, soNgay, ghiChu });
    } catch (e) { next(e); }
  });

  /* Danh sách mã gần đây (kèm email người kích hoạt để đối soát bán hàng). */
  r.get("/admin/licenses", async (req, res, next) => {
    try {
      const ds = await q("SELECT * FROM licenses ORDER BY id DESC LIMIT 300");
      const uids = [...new Set(ds.rows.map((x) => x.activated_by).filter(Boolean))];
      const emails = {};
      for (const uid of uids) {
        const u = await q("SELECT email FROM users WHERE id = $1", [uid]);
        if (u.rows[0]) emails[uid] = u.rows[0].email;
      }
      res.json({
        licenses: ds.rows.map((x) => ({
          code: x.code, soNgay: x.duration_days, note: x.note,
          taoLuc: x.created_at, kichHoatLuc: x.activated_at, hetHan: x.expires_at,
          nguoiDung: x.activated_by ? (emails[x.activated_by] || ("user#" + x.activated_by)) : null,
        })),
      });
    } catch (e) { next(e); }
  });

  /* Số liệu nhanh. Đếm đơn giản từng bảng — đủ dùng cho một người vận hành. */
  r.get("/admin/stats", async (req, res, next) => {
    try {
      const [users, attempts, lic] = await Promise.all([
        q("SELECT COUNT(*)::int AS n FROM users"),
        q("SELECT COUNT(*)::int AS n FROM attempts"),
        q("SELECT * FROM licenses"),
      ]);
      const nay = Date.now();
      const daBan = lic.rows.filter((x) => x.activated_by).length;
      const conHan = lic.rows.filter((x) => x.expires_at && new Date(x.expires_at).getTime() > nay).length;
      res.json({
        users: users.rows[0].n,
        attempts: attempts.rows[0].n,
        maDaTao: lic.rows.length,
        maDaKichHoat: daBan,
        premiumConHan: conHan,
      });
    } catch (e) { next(e); }
  });

  return r;
}

module.exports = { createAdmin };
