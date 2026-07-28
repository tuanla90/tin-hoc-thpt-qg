/* ============================================================================
 *  GÓI FREE / PREMIUM — nguồn sự thật DUY NHẤT về quyền của một tài khoản.
 *
 *  Quyền premium = có mã kích hoạt (bảng `licenses`) đã kích hoạt và còn hạn.
 *  - Mã do admin tạo theo lô, bán tay (chuyển khoản -> gửi mã qua Zalo).
 *  - `expires_at` chỉ được tính LÚC KÍCH HOẠT (= activated_at + duration_days),
 *    nên mã nằm kho bao lâu cũng không mất hạn dùng.
 *  - `activated_by` cố ý KHÔNG có khoá ngoại: xoá tài khoản thì mã vẫn là mã đã
 *    dùng, không "hồi sinh" để dùng lại được.
 *  So sánh hạn làm ở JS (không dùng now()/interval trong SQL) để chạy được cả
 *  trên pg-mem lúc test/dev.
 * ==========================================================================*/
const crypto = require("crypto");

/* Bảng chữ cái bỏ 0/O/1/I để đọc mã qua điện thoại không nhầm. */
const BANG_MA = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function sinhMa() {
  const b = crypto.randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += BANG_MA[b[i] % BANG_MA.length];
    if (i === 3) s += "-";
  }
  return "TIN-" + s;
}

/* Người dùng gõ mã kiểu gì (thường/hoa, thiếu gạch, thừa cách) cũng nhận ra. */
function chuanHoaMa(raw) {
  const s = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^TIN[A-Z0-9]{8}$/.test(s)) return null;
  return "TIN-" + s.slice(3, 7) + "-" + s.slice(7);
}

/* Gói của một tài khoản: { tier: 'free'|'paid', hetHan: ISO|null, nguon }.
   `nguon` = 'ma' (có mã còn hạn) | 'vaiTro' (admin/giáo viên) | null.

   Giáo viên/admin coi như paid — không bắt thầy cô mua mã. NHƯNG vẫn phải TRA
   MÃ trước rồi mới trả về: trước đây thoát sớm ngay ở dòng đầu nên tài khoản
   admin có mua thật cũng hiện "Premium" trơn, không kèm ngày hết hạn. Hệ quả
   khó chịu nhất không phải thẩm mỹ mà là KHÔNG THỬ ĐƯỢC luồng mua: mua xong
   nhìn màn Tài khoản vẫn y như trước, không biết webhook đã chạy hay chưa. */
async function getPlan(pool, uid, role) {
  const r = await pool.query("SELECT expires_at FROM licenses WHERE activated_by = $1", [uid]);
  let best = 0;
  for (const row of r.rows) {
    const t = row.expires_at ? new Date(row.expires_at).getTime() : 0;
    if (t > best) best = t;
  }
  const coMa = best > Date.now();
  const hetHan = coMa ? new Date(best).toISOString() : null;

  if (role === "admin" || role === "teacher") {
    return { tier: "paid", hetHan, nguon: coMa ? "ma" : "vaiTro" };
  }
  if (coMa) return { tier: "paid", hetHan, nguon: "ma" };
  return { tier: "free", hetHan: null, nguon: null };
}

/* Số hồ sơ học tập tối đa theo gói (admin giữ trần cũ 6 để thử nghiệm). */
function maxProfiles(tier, role) {
  if (role === "admin") return 6;
  return tier === "paid" ? 3 : 1;
}

/* Cấp Premium thẳng cho một tài khoản (dùng cho THANH TOÁN TỰ ĐỘNG — tiền vào
   là mở gói ngay, không qua mã). Vẫn ghi một dòng `licenses` để getPlan chỉ có
   MỘT nguồn sự thật duy nhất, và để đối soát sau này thấy gói này từ đâu ra.
   Cộng dồn từ hạn hiện có, giống hệt lúc nhập mã. */
async function capPremium(pool, uid, soNgay, ghiChu) {
  const hienTai = await getPlan(pool, uid);
  const goc = hienTai.hetHan ? Math.max(Date.now(), new Date(hienTai.hetHan).getTime()) : Date.now();
  const hetHan = new Date(goc + Number(soNgay || 365) * 86400000);
  for (let thu = 0; thu < 5; thu++) {
    const code = sinhMa();
    try {
      await pool.query(
        `INSERT INTO licenses (code, duration_days, note, activated_by, activated_at, expires_at)
         VALUES ($1, $2, $3, $4, now(), $5)`,
        [code, Number(soNgay || 365), String(ghiChu || "").slice(0, 200), uid, hetHan.toISOString()]
      );
      return { ok: true, code, hetHan: hetHan.toISOString() };
    } catch (e) { if (thu === 4) throw e; }   // trùng mã (xác suất ~0) thì sinh lại
  }
}

/* Kích hoạt một mã cho tài khoản. Trả { ok, hetHan } hoặc ném Error có .status. */
async function kichHoat(pool, uid, rawCode) {
  const code = chuanHoaMa(rawCode);
  if (!code) { const e = new Error("Mã không đúng định dạng (mẫu: TIN-XXXX-XXXX)."); e.status = 400; throw e; }
  const f = await pool.query("SELECT * FROM licenses WHERE code = $1", [code]);
  const lic = f.rows[0];
  if (!lic) { const e = new Error("Không tìm thấy mã này — kiểm tra lại từng ký tự nhé."); e.status = 404; throw e; }
  if (lic.activated_by && Number(lic.activated_by) !== Number(uid)) {
    const e = new Error("Mã này đã được tài khoản khác sử dụng."); e.status = 409; throw e;
  }
  if (lic.activated_by) {           // chính mình đã kích hoạt rồi -> báo lại hạn, không lỗi
    return { ok: true, daTung: true, hetHan: lic.expires_at ? new Date(lic.expires_at).toISOString() : null };
  }
  /* Đang còn hạn mà nhập thêm mã -> CỘNG DỒN từ ngày hết hạn hiện tại,
     không bắt người mua sớm chịu thiệt. */
  const hienTai = await getPlan(pool, uid);
  const goc = hienTai.hetHan ? Math.max(Date.now(), new Date(hienTai.hetHan).getTime()) : Date.now();
  const hetHan = new Date(goc + Number(lic.duration_days || 365) * 86400000);
  const u = await pool.query(
    "UPDATE licenses SET activated_by = $1, activated_at = now(), expires_at = $2 WHERE id = $3 AND activated_by IS NULL",
    [uid, hetHan.toISOString(), lic.id]
  );
  if (!u.rowCount) { const e = new Error("Mã vừa được người khác dùng mất — liên hệ người bán nhé."); e.status = 409; throw e; }
  return { ok: true, hetHan: hetHan.toISOString() };
}

module.exports = { getPlan, maxProfiles, kichHoat, capPremium, sinhMa, chuanHoaMa };
