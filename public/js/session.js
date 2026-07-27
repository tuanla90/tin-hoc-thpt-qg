/* ============================================================================
 *  KHỞI TẠO PHIÊN — chạy TRƯỚC mọi tệp khác.
 *  Một tài khoản có nhiều hồ sơ học tập, mỗi hồ sơ phải có kho dữ liệu riêng
 *  trên máy. Ở đây quyết định tên khoá localStorage theo hồ sơ đang chọn:
 *      tinhoc_thpt_v1:<id>   (tiến độ, lịch sử, cài đặt)
 *      tinhoc_gam_v1:<id>    (XP, huy hiệu, chuỗi ngày học)
 *  Chưa chọn hồ sơ thì dùng tên cũ không đuôi — dữ liệu của bản trước khi có
 *  nhiều hồ sơ vẫn đọc được, không mất.
 * ==========================================================================*/
(function () {
  var id = 0;
  try { id = Number(localStorage.getItem("tinhoc_profile_id")) || 0; } catch (e) {}
  var duoi = id ? ":" + id : "";
  window.PROFILE_ID = id || null;
  window.STORE_KEY = "tinhoc_thpt_v1" + duoi;
  window.GAM_KEY = "tinhoc_gam_v1" + duoi;
})();
