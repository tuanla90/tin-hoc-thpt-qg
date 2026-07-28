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
const bcrypt = require("bcryptjs");
const { sinhMa } = require("./plan");
const { aiConfig } = require("./ai");

/* Token -> tiền (VND). Token đọc từ đệm ngữ cảnh tính rẻ hơn (cfg.demTl), và
   `vao` của nhà cung cấp ĐÃ BAO GỒM phần đệm nên phải trừ ra kẻo tính hai lần.
   Đơn giá lấy từ biến môi trường AI_GIA_* — đổi model thì sửa biến. */
function tienVND(vao, dem, ra, cfg) {
  const sach = Math.max(0, (vao || 0) - (dem || 0));
  const usd = (sach * cfg.giaVao + (dem || 0) * cfg.giaVao * cfg.demTl + (ra || 0) * cfg.giaRa) / 1e6;
  return usd * cfg.tyGia;
}

/* Cùng cách tính "hôm nay" theo giờ VN như tutor.js — để số lượt AI khớp nhau. */
function ngayVN() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

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
      const [users, attempts, lic, ai] = await Promise.all([
        q("SELECT COUNT(*)::int AS n FROM users"),
        q("SELECT COUNT(*)::int AS n FROM attempts"),
        q("SELECT * FROM licenses"),
        q("SELECT COALESCE(SUM(so_luot), 0)::int AS n FROM tutor_usage WHERE ngay = $1", [ngayVN()]),
      ]);
      const nay = Date.now();
      const truoc30 = nay - 30 * 86400000;
      const daBan = lic.rows.filter((x) => x.activated_by).length;
      const conHan = lic.rows.filter((x) => x.expires_at && new Date(x.expires_at).getTime() > nay).length;
      res.json({
        users: users.rows[0].n,
        attempts: attempts.rows[0].n,
        maDaTao: lic.rows.length,
        maDaKichHoat: daBan,
        premiumConHan: conHan,
        kichHoat30Ngay: lic.rows.filter((x) => x.activated_at && new Date(x.activated_at).getTime() > truoc30).length,
        aiHomNay: ai.rows[0].n,
      });
    } catch (e) { next(e); }
  });

  /* ------------------------------ NGƯỜI DÙNG ------------------------------ */
  /* Danh sách để đối soát/hỗ trợ: gói hiện tại, số hồ sơ, số lượt làm bài.
     ?q= lọc theo email/tên (lọc bằng JS trên 500 tài khoản mới nhất — chưa cần
     phân trang khi số user còn dưới mức đó; vượt thì tìm theo q vẫn ra). */
  r.get("/admin/users", async (req, res, next) => {
    try {
      const [us, hs, at, lic] = await Promise.all([
        q("SELECT id, email, name, role, created_at, last_seen_at FROM users ORDER BY id DESC LIMIT 500"),
        q("SELECT user_id, COUNT(*)::int AS n FROM profiles GROUP BY user_id"),
        q("SELECT user_id, COUNT(*)::int AS n FROM attempts GROUP BY user_id"),
        q("SELECT activated_by, expires_at FROM licenses WHERE activated_by IS NOT NULL"),
      ]);
      const demHs = {}, demAt = {}, hanLic = {};
      hs.rows.forEach((x) => { demHs[x.user_id] = x.n; });
      at.rows.forEach((x) => { demAt[x.user_id] = x.n; });
      lic.rows.forEach((x) => {
        const t = x.expires_at ? new Date(x.expires_at).getTime() : 0;
        if (t > (hanLic[x.activated_by] || 0)) hanLic[x.activated_by] = t;
      });
      const tuKhoa = String(req.query.q || "").trim().toLowerCase();
      const nay = Date.now();
      const ds = us.rows
        .filter((u) => !tuKhoa ||
          String(u.email).toLowerCase().includes(tuKhoa) || String(u.name).toLowerCase().includes(tuKhoa))
        .slice(0, 200)
        .map((u) => {
          // cùng luật với getPlan: admin/giáo viên coi như paid, còn lại xét hạn mã
          const paid = u.role === "admin" || u.role === "teacher" || (hanLic[u.id] || 0) > nay;
          return {
            id: u.id, email: u.email, name: u.name, role: u.role,
            taoLuc: u.created_at, hoatDongCuoi: u.last_seen_at,
            goi: { tier: paid ? "paid" : "free", hetHan: hanLic[u.id] > nay ? new Date(hanLic[u.id]).toISOString() : null },
            soHoSo: demHs[u.id] || 0, soLuotLam: demAt[u.id] || 0,
          };
        });
      res.json({ users: ds });
    } catch (e) { next(e); }
  });

  /* ---------------------- CHI PHÍ GIA SƯ AI ---------------------- */
  /* Tổng lượt / token / tiền, bổ theo NGÀY, theo TÀI KHOẢN và theo LỐI VÀO.
     Nguồn: bảng tutor_log (mỗi lượt hỏi thành công là một dòng, có token thật
     do nhà cung cấp trả về). Lượt hỏng giữa chừng không ghi — cũng không tốn
     tiền đáng kể vì đã được hoàn lượt. */
  r.get("/admin/ai-usage", async (req, res, next) => {
    try {
      const cfg = aiConfig();
      const soNgay = Math.min(180, Math.max(1, Number(req.query.ngay) || 30));
      const tu = new Date(Date.now() + 7 * 3600 * 1000 - (soNgay - 1) * 86400000)
        .toISOString().slice(0, 10);

      const [ngay, taiKhoan, kieu, tong] = await Promise.all([
        q(`SELECT ngay, COUNT(*)::int AS luot,
                  COALESCE(SUM(token_vao),0)::int AS vao,
                  COALESCE(SUM(token_dem),0)::int AS dem,
                  COALESCE(SUM(token_ra),0)::int AS ra
           FROM tutor_log WHERE ngay >= $1 GROUP BY ngay ORDER BY ngay DESC`, [tu]),
        q(`SELECT user_id, COUNT(*)::int AS luot,
                  COALESCE(SUM(token_vao),0)::int AS vao,
                  COALESCE(SUM(token_dem),0)::int AS dem,
                  COALESCE(SUM(token_ra),0)::int AS ra
           FROM tutor_log WHERE ngay >= $1 GROUP BY user_id`, [tu]),
        q(`SELECT kieu, COUNT(*)::int AS luot FROM tutor_log WHERE ngay >= $1 GROUP BY kieu`, [tu]),
        q(`SELECT COUNT(*)::int AS luot,
                  COALESCE(SUM(token_vao),0)::int AS vao,
                  COALESCE(SUM(token_dem),0)::int AS dem,
                  COALESCE(SUM(token_ra),0)::int AS ra
           FROM tutor_log`),
      ]);

      /* Email tra riêng thay vì JOIN — pg-mem (chế độ test/dev) hay vấp JOIN
         kèm GROUP BY, mà số tài khoản ở đây cũng chỉ vài chục. */
      const emails = {};
      for (const x of taiKhoan.rows) {
        const u = await q("SELECT email FROM users WHERE id = $1", [x.user_id]);
        emails[x.user_id] = u.rows[0] ? u.rows[0].email : "user#" + x.user_id;
      }
      const themTien = (x) => Object.assign({}, x, { tien: Math.round(tienVND(x.vao, x.dem, x.ra, cfg)) });

      const dsNgay = ngay.rows.map((x) => themTien({
        ngay: typeof x.ngay === "string" ? x.ngay : new Date(x.ngay).toISOString().slice(0, 10),
        luot: x.luot, vao: x.vao, dem: x.dem, ra: x.ra,
      }));
      const dsTk = taiKhoan.rows
        .map((x) => themTien({ email: emails[x.user_id], luot: x.luot, vao: x.vao, dem: x.dem, ra: x.ra }))
        .sort((a, b) => b.tien - a.tien || b.luot - a.luot)
        .slice(0, 100);

      const t = tong.rows[0];
      res.json({
        soNgay,
        tuNgay: tu,
        khoang: themTien(dsNgay.reduce((n, x) => ({
          luot: n.luot + x.luot, vao: n.vao + x.vao, dem: n.dem + x.dem, ra: n.ra + x.ra,
        }), { luot: 0, vao: 0, dem: 0, ra: 0 })),
        tuTruocToiNay: themTien({ luot: t.luot, vao: t.vao, dem: t.dem, ra: t.ra }),
        theoNgay: dsNgay,
        theoTaiKhoan: dsTk,
        theoKieu: kieu.rows,
        gia: { vao: cfg.giaVao, ra: cfg.giaRa, demTl: cfg.demTl, tyGia: cfg.tyGia, model: cfg.model },
      });
    } catch (e) { next(e); }
  });

  /* Đặt lại mật khẩu hộ — thay cho luồng "quên mật khẩu" chưa có: khách nhắn
     Zalo, mình đặt mật khẩu tạm rồi dặn họ vào Tài khoản tự đổi lại. */
  r.post("/admin/users/:id/password", async (req, res, next) => {
    try {
      const uid = Number(req.params.id);
      const mk = String((req.body || {}).matKhau || "");
      if (!Number.isInteger(uid) || uid <= 0) return res.status(400).json({ error: "Thiếu id người dùng." });
      if (mk.length < 6) return res.status(400).json({ error: "Mật khẩu cần ít nhất 6 ký tự." });
      const hash = await bcrypt.hash(mk, 10);
      const u = await q("UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING email", [hash, uid]);
      if (!u.rows[0]) return res.status(404).json({ error: "Không tìm thấy người dùng này." });
      res.json({ ok: true, email: u.rows[0].email });
    } catch (e) { next(e); }
  });

  return r;
}

module.exports = { createAdmin };
