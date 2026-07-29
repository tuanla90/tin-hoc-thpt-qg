/* ============================================================================
 *  THANH TOÁN TỰ ĐỘNG  —  /api/pay/*
 *
 *  VÌ SAO CÓ TỆP NÀY: bán bằng mã kích hoạt thì mỗi đơn đều phải có NGƯỜI ngồi
 *  đối soát rồi gửi mã qua Zalo. Khách trả tiền lúc 11 giờ đêm phải chờ tới sáng
 *  — mỗi giờ chờ là một lần họ nghĩ mình bị lừa. Ở đây tiền vào tài khoản là máy
 *  chủ tự mở gói trong vài giây, không cần mã, không cần ai thức.
 *
 *  CÁCH CHẠY:
 *    1. Người học bấm mua -> POST /api/pay/order tạo một ĐƠN có MÃ ĐƠN riêng.
 *    2. Mã đơn được nhúng sẵn vào NỘI DUNG CHUYỂN KHOẢN trong ảnh QR, nên khách
 *       quét là app ngân hàng điền hết — không phải gõ, không gõ sai.
 *    3. Tiền vào -> SePay bắn webhook -> khớp mã đơn -> cấp Premium ngay.
 *    4. Trang mua tự dò trạng thái đơn và báo "đã mở gói".
 *
 *  NGUYÊN TẮC KHÔNG ĐƯỢC PHÁ:
 *  - Webhook là cửa NGOÀI INTERNET: phải xác thực khoá, và KHÔNG tin số tiền hay
 *    mã đơn trong đó cho tới khi đối chiếu với bảng `orders` của mình.
 *  - CHỐNG GHI TRÙNG: SePay tự gửi lại tối đa 7 lần khi chưa nhận được xác nhận.
 *    `pay_events.tx_id UNIQUE` là chốt chặn — cùng một giao dịch chỉ cấp gói một
 *    lần, dù bắn lại bao nhiêu bận.
 *  - Giao dịch KHÔNG khớp đơn nào vẫn phải ghi lại (khách gõ tay sai nội dung,
 *    chuyển từ ATM...) để còn đối soát bằng tay, tuyệt đối không nuốt im lặng.
 *  - Phải trả HTTP 200 kèm {"success":true} thì SePay mới coi là xong.
 * ==========================================================================*/
const crypto = require("crypto");
const express = require("express");
const { capPremium, getPlan } = require("./plan");
const { chanAdmin } = require("./admin");

/* Các gói bán. `ngay` là số ngày được cộng vào hạn hiện có. */
const GOI = {
  nam: { ten: "Premium 1 năm học", ngay: 365, tienMacDinh: 249000 },
  nuocrut: { ten: "Premium nước rút 3 tháng", ngay: 90, tienMacDinh: 149000 },
};

const HAN_DON_GIO = 24;   // đơn quá hạn này coi như bỏ, tạo đơn mới

function payConfig() {
  const provider = String(process.env.PAY_PROVIDER || "").toLowerCase().trim();
  const cfg = {
    provider,
    apiKey: process.env.PAY_API_KEY || "",
    bank: process.env.PAY_BANK || "",
    stk: process.env.PAY_STK || "",
    chuTk: process.env.PAY_CHU_TK || "",
    giaNam: Number(process.env.PAY_GIA_NAM || GOI.nam.tienMacDinh),
    giaNuocRut: Number(process.env.PAY_GIA_NUOCRUT || GOI.nuocrut.tienMacDinh),
  };
  /* mock = chạy thử/chạy test, không cần khoá và không cần số tài khoản thật.
     sepay = bản thật: thiếu khoá hoặc thiếu số tài khoản thì coi như CHƯA bật,
     giao diện tự ẩn nút mua thay vì hiện một nút bấm vào là lỗi. */
  cfg.ready = provider === "mock" ? true : !!(provider === "sepay" && cfg.apiKey && cfg.bank && cfg.stk);
  return cfg;
}

function giaCua(cfg, goi) {
  return goi === "nuocrut" ? cfg.giaNuocRut : cfg.giaNam;
}

/* Mã đơn: đủ ngắn để in vừa nội dung chuyển khoản, đủ dài để không đoán bừa.
   Chỉ chữ HOA + số, bỏ ký tự dễ nhìn nhầm — nhiều ngân hàng viết hoa hết nội
   dung nên không được phân biệt hoa/thường. */
const BANG = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function sinhMaDon() {
  const b = crypto.randomBytes(6);
  let s = "";
  for (let i = 0; i < 6; i++) s += BANG[b[i] % BANG.length];
  return "TIN" + s;
}

/* Tìm mã đơn trong nội dung chuyển khoản. SePay có trường `code` (do quy tắc
   cấu hình bên họ tách ra) nhưng KHÔNG chắc có — nên tự dò trong cả `content`. */
function timMaDon(...nguon) {
  for (const s of nguon) {
    const m = String(s || "").toUpperCase().match(/TIN[2-9A-HJKMNP-Z]{6}/);
    if (m) return m[0];
  }
  return null;
}

/* Ảnh QR động: nhúng sẵn số tài khoản + số tiền + nội dung, khách chỉ việc quét.
   Dùng dịch vụ ảnh của SePay/VietQR — chỉ là URL ảnh, không cần khoá. */
function anhQr(cfg, maDon, soTien) {
  const p = new URLSearchParams({
    acc: cfg.stk, bank: cfg.bank, amount: String(soTien), des: maDon, template: "compact",
  });
  return "https://qr.sepay.vn/img?" + p.toString();
}

/* Đọc gói tin webhook về dạng chung. SePay gửi:
   { id, gateway, transactionDate, accountNumber, subAccount, code, content,
     transferType: 'in'|'out', description, transferAmount, accumulated, referenceCode } */
function docWebhook(body) {
  const b = body || {};
  return {
    txId: String(b.id != null ? b.id : (b.referenceCode || "")),
    vao: String(b.transferType || "in").toLowerCase() === "in",
    soTien: Math.round(Number(b.transferAmount) || 0),
    noiDung: String(b.content || b.description || ""),
    maDon: timMaDon(b.code, b.content, b.description),
  };
}

function xacThucKhoa(req, cfg) {
  if (cfg.provider === "mock") return true;          // bản chạy thử: khỏi khoá
  const h = String(req.get("authorization") || "");
  const m = h.match(/^Apikey\s+(.+)$/i);
  if (!m || !cfg.apiKey) return false;
  const a = Buffer.from(m[1].trim());
  const b = Buffer.from(cfg.apiKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function createPay(pool) {
  const r = express.Router();
  const q = (text, params) => pool.query(text, params);

  r.use("/pay", (req, res, next) => {
    if (!pool) return res.status(503).json({ error: "Máy chủ chưa nối cơ sở dữ liệu." });
    next();
  });

  /* Giao diện hỏi trước để biết có hiện nút "Mua ngay" không. */
  r.get("/pay/config", (req, res) => {
    const cfg = payConfig();
    if (!cfg.ready) return res.json({ on: false });
    res.json({
      on: true,
      goi: [
        { ma: "nam", ten: GOI.nam.ten, ngay: GOI.nam.ngay, gia: cfg.giaNam },
        { ma: "nuocrut", ten: GOI.nuocrut.ten, ngay: GOI.nuocrut.ngay, gia: cfg.giaNuocRut },
      ],
    });
  });

  function requireAuth(req, res, next) {
    if (!req.session || !req.session.uid) return res.status(401).json({ error: "Bạn cần đăng nhập trước khi mua." });
    next();
  }

  function raDon(row, cfg) {
    return {
      maDon: row.ma_don, goi: row.goi, soTien: row.so_tien, soNgay: row.so_ngay,
      trangThai: row.trang_thai,
      noiDung: row.ma_don,
      qr: anhQr(cfg, row.ma_don, row.so_tien),
      nganHang: { bank: cfg.bank, stk: cfg.stk, chuTk: cfg.chuTk },
      taoLuc: row.created_at,
    };
  }

  /* Tạo đơn. Dùng lại đơn CHỜ còn hạn của cùng người + cùng gói thay vì đẻ đơn
     mới mỗi lần bấm — tránh rác và tránh cảnh khách quét nhầm QR của đơn cũ. */
  r.post("/pay/order", requireAuth, async (req, res, next) => {
    try {
      const cfg = payConfig();
      if (!cfg.ready) return res.status(503).json({ error: "Chưa bật thanh toán tự động trên máy chủ." });
      const goi = String((req.body || {}).goi || "nam") === "nuocrut" ? "nuocrut" : "nam";
      const soTien = giaCua(cfg, goi);
      const soNgay = GOI[goi].ngay;

      const cu = await q(
        "SELECT * FROM orders WHERE user_id = $1 AND goi = $2 AND trang_thai = 'cho' ORDER BY id DESC LIMIT 1",
        [req.session.uid, goi]
      );
      const con = cu.rows[0];
      if (con && Date.now() - new Date(con.created_at).getTime() < HAN_DON_GIO * 3600 * 1000 &&
          Number(con.so_tien) === soTien) {
        return res.json({ don: raDon(con, cfg) });
      }

      let row = null;
      for (let thu = 0; thu < 5; thu++) {
        const ma = sinhMaDon();
        try {
          const ins = await q(
            `INSERT INTO orders (ma_don, user_id, goi, so_tien, so_ngay) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [ma, req.session.uid, goi, soTien, soNgay]
          );
          row = ins.rows[0];
          break;
        } catch (e) { if (thu === 4) throw e; }
      }
      res.json({ don: raDon(row, cfg) });
    } catch (e) { next(e); }
  });

  /* Trang mua gọi liên tục để biết tiền về chưa. */
  r.get("/pay/order/:ma", requireAuth, async (req, res, next) => {
    try {
      const f = await q("SELECT * FROM orders WHERE ma_don = $1 AND user_id = $2",
        [String(req.params.ma || "").toUpperCase(), req.session.uid]);
      const row = f.rows[0];
      if (!row) return res.status(404).json({ error: "Không tìm thấy đơn này." });
      const plan = await getPlan(pool, req.session.uid);
      res.json({ trangThai: row.trang_thai, plan });
    } catch (e) { next(e); }
  });

  /* ------------------------------- WEBHOOK -------------------------------
     Cửa ngoài internet. Trả 200 + {success:true} khi ĐÃ XỬ LÝ XONG (kể cả khi
     không khớp đơn nào) — nếu trả lỗi thì SePay bắn lại 7 lần cho một giao dịch
     mà mình vốn không định làm gì với nó. Chỉ trả lỗi khi sai khoá hoặc chính
     máy chủ hỏng, tức là những lúc gửi lại mới có ích. */
  r.post("/pay/webhook", async (req, res, next) => {
    try {
      const cfg = payConfig();
      if (!cfg.ready) return res.status(503).json({ success: false, error: "Chưa bật thanh toán." });
      if (!xacThucKhoa(req, cfg)) return res.status(401).json({ success: false, error: "Sai khoá." });

      const gd = docWebhook(req.body);
      if (!gd.txId) return res.status(400).json({ success: false, error: "Thiếu mã giao dịch." });
      if (!gd.vao) return res.json({ success: true, boQua: "giao dịch tiền ra" });

      /* Chốt chặn ghi trùng: cùng tx_id chỉ vào được một lần. Bắn lại lần hai
         rơi vào nhánh này và KHÔNG cấp gói thêm lần nữa. */
      const daCo = await q("SELECT id FROM pay_events WHERE tx_id = $1", [gd.txId]);
      if (daCo.rows[0]) return res.json({ success: true, daXuLy: true });

      const ghiSuKien = async (maDon, khop, ghiChu) => {
        try {
          await q(
            `INSERT INTO pay_events (tx_id, ma_don, so_tien, noi_dung, khop, ghi_chu)
             VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (tx_id) DO NOTHING`,
            [gd.txId, maDon, gd.soTien, gd.noiDung.slice(0, 300), khop, ghiChu]
          );
        } catch (e) { console.error("[pay] Không ghi được nhật ký:", e.message); }
      };

      if (!gd.maDon) {
        await ghiSuKien(null, false, "Không tìm thấy mã đơn trong nội dung chuyển khoản");
        return res.json({ success: true, khop: false });
      }

      const f = await q("SELECT * FROM orders WHERE ma_don = $1", [gd.maDon]);
      const don = f.rows[0];
      if (!don) {
        await ghiSuKien(gd.maDon, false, "Mã đơn không có trong hệ thống");
        return res.json({ success: true, khop: false });
      }
      if (don.trang_thai === "da_tra") {
        await ghiSuKien(gd.maDon, false, "Đơn đã thanh toán trước đó (khách chuyển thừa?)");
        return res.json({ success: true, khop: false, daTra: true });
      }
      /* Thiếu tiền thì KHÔNG mở gói — ghi lại để đối soát tay, vì có thể khách
         chuyển nhầm hoặc bị trừ phí. Chuyển thừa thì vẫn cho qua. */
      if (gd.soTien < Number(don.so_tien)) {
        await ghiSuKien(gd.maDon, false, "Thiếu tiền: nhận " + gd.soTien + " / cần " + don.so_tien);
        return res.json({ success: true, khop: false, thieuTien: true });
      }

      const kq = await capPremium(pool, don.user_id, don.so_ngay, "Thanh toán tự động — đơn " + don.ma_don);
      await q(
        "UPDATE orders SET trang_thai = 'da_tra', tx_id = $1, tx_so_tien = $2, paid_at = now() WHERE id = $3",
        [gd.txId, gd.soTien, don.id]
      );
      await ghiSuKien(gd.maDon, true, "Đã mở Premium tới " + kq.hetHan);
      const tk = req.app.locals.thongKe;
      if (tk) tk.ghi("tra-tien", "");   // mốc cuối của phễu, xem server/thongke.js
      console.log("[pay] Đơn", don.ma_don, "đã thanh toán -> Premium tới", kq.hetHan);
      res.json({ success: true, khop: true });
    } catch (e) {
      console.error("[pay] Lỗi xử lý webhook:", e);
      /* Lỗi của mình -> trả 500 để SePay bắn lại, đừng để mất đơn của khách. */
      res.status(500).json({ success: false });
    }
  });

  /* ---------------------------- ĐỐI SOÁT (admin) ---------------------------- */
  r.get("/pay/admin/orders", chanAdmin(pool), async (req, res, next) => {
    try {
      const ds = await q(
        `SELECT o.*, u.email FROM orders o LEFT JOIN users u ON u.id = o.user_id
         ORDER BY o.id DESC LIMIT 200`
      );
      const le = await q(
        "SELECT * FROM pay_events WHERE khop = false ORDER BY id DESC LIMIT 100"
      );
      res.json({
        orders: ds.rows.map((x) => ({
          maDon: x.ma_don, email: x.email, goi: x.goi, soTien: x.so_tien, soNgay: x.so_ngay,
          trangThai: x.trang_thai, taoLuc: x.created_at, traLuc: x.paid_at,
        })),
        chuaKhop: le.rows.map((x) => ({
          txId: x.tx_id, maDon: x.ma_don, soTien: x.so_tien,
          noiDung: x.noi_dung, ghiChu: x.ghi_chu, luc: x.created_at,
        })),
      });
    } catch (e) { next(e); }
  });

  return r;
}

module.exports = { createPay, payConfig, sinhMaDon, timMaDon, docWebhook, anhQr, GOI };
