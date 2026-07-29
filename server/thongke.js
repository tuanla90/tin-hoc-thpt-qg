/* ============================================================================
 *  ĐẾM LƯỢT TRUY CẬP — PHỄU CHUYỂN ĐỔI
 *
 *  VÌ SAO CÓ TỆP NÀY: trước đây web không đo gì cả, nên khi 119 trang SEO bắt
 *  đầu kéo người vào thì không ai biết bao nhiêu người đọc bài, bao nhiêu người
 *  mở trang giá, bao nhiêu người tạo tài khoản — không có số thì không biết nên
 *  sửa chỗ nào.
 *
 *  CÁCH LÀM: đếm ngay ở máy chủ, KHÔNG nhúng Google Analytics / Meta Pixel,
 *  KHÔNG lưu IP, KHÔNG đặt cookie theo dõi. Chỉ cộng 1 vào ô (ngày, loại trang).
 *  Nhờ vậy trang quyền riêng tư vẫn nói đúng: dữ liệu không rời khỏi máy chủ này.
 *
 *  ĐÁNH ĐỔI: đếm lượt xem trang chứ không đếm người, và bot cũng bị tính. Con số
 *  dùng để so sánh xu hướng và tỉ lệ giữa các bước, đừng đọc như số người thật.
 * ==========================================================================*/

/* Gom trong RAM rồi ghi mỗi 30 giây: mỗi lượt xem một câu UPDATE là phí, và
   trang bài phải trả về thật nhanh cho Google. Mất tối đa 30 giây số liệu khi
   máy chủ restart — đổi lấy việc đếm không bao giờ làm chậm người dùng. */
const NHIP_GHI = 30000;

function createThongKe(pool) {
  const dem = new Map(); // "ngay|loai|duong_dan" -> số lượt
  let hen = null;

  const homNay = () => new Date().toISOString().slice(0, 10);

  /* Gộp đường dẫn về dạng có hạn: /bai/<slug> có 119 giá trị, gộp thành "/bai/*"
     để bảng không phình theo từng bài. Muốn xem bài nào hot thì đọc log máy chủ. */
  function gonDuongDan(duong) {
    if (!duong) return "";
    if (duong.startsWith("/bai/")) return "/bai/*";
    return duong.slice(0, 80);
  }

  function ghi(loai, duong) {
    if (!pool || !loai) return;
    const khoa = homNay() + "|" + loai + "|" + gonDuongDan(duong);
    dem.set(khoa, (dem.get(khoa) || 0) + 1);
    if (!hen) {
      hen = setTimeout(dayXuongDb, NHIP_GHI);
      if (hen.unref) hen.unref(); // đừng giữ tiến trình sống lúc chạy test
    }
  }

  async function dayXuongDb() {
    hen = null;
    if (!pool || !dem.size) return;
    const lo = [...dem.entries()];
    dem.clear();
    for (const [khoa, so] of lo) {
      const [ngay, loai, duong] = khoa.split("|");
      try {
        await pool.query(
          `INSERT INTO luot_xem (ngay, loai, duong_dan, so_luot) VALUES ($1,$2,$3,$4)
           ON CONFLICT (ngay, loai, duong_dan) DO UPDATE SET so_luot = luot_xem.so_luot + $4`,
          [ngay, loai, duong, so]
        );
      } catch (e) {
        console.warn("[thongke] Không ghi được:", e.message.slice(0, 80));
      }
    }
  }

  /* Middleware gắn cho từng nhóm trang. Bỏ qua HEAD để bot kiểm tra link không
     thổi phồng số liệu. */
  const doTrang = (loai) => (req, res, next) => {
    if (req.method === "GET") ghi(loai, req.path);
    next();
  };

  /* Số liệu cho trang quản trị: mỗi ngày một dòng, các loại nằm ngang. */
  async function tongHop(soNgay = 30) {
    if (!pool) return { ngay: [], tong: {} };
    await dayXuongDb(); // để số hôm nay không bị thiếu phần đang gom trong RAM
    const { rows } = await pool.query(
      `SELECT ngay, loai, SUM(so_luot)::int AS so FROM luot_xem
       WHERE ngay > CURRENT_DATE - $1::int GROUP BY ngay, loai ORDER BY ngay DESC`,
      [soNgay]
    );
    const theoNgay = new Map();
    const tong = {};
    for (const r of rows) {
      const k = r.ngay instanceof Date ? r.ngay.toISOString().slice(0, 10) : String(r.ngay);
      if (!theoNgay.has(k)) theoNgay.set(k, { ngay: k });
      theoNgay.get(k)[r.loai] = r.so;
      tong[r.loai] = (tong[r.loai] || 0) + r.so;
    }
    return { ngay: [...theoNgay.values()], tong };
  }

  return { ghi, doTrang, tongHop, dayXuongDb };
}

module.exports = { createThongKe };
