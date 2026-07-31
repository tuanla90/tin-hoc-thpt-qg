/* ============================================================================
 *  THÀNH TÍCH BỀN — điểm tốt nhất mỗi bài / mỗi ô, và số đề thi thử đã làm
 *
 *  VÌ SAO TÁCH RA KHỎI LỊCH SỬ: sao trên bản đồ trước đây được SUY LẠI từ
 *  State.history mỗi lần vẽ. Mà lịch sử bị cắt còn 50 lượt, nên học xong một bài
 *  được 3 sao, làm thêm 50 lượt nữa là ba sao đó BIẾN MẤT — mất thành tích, không
 *  phải mất nhật ký. Nới giới hạn lịch sử không chữa được: học sinh ôn cả năm thừa
 *  sức vượt mọi con số ta đặt ra. Cách đúng là lưu thẳng kết quả đã chốt.
 *
 *  Kho này rất gọn — mỗi mục một con số, 119 bài cộng vài chục ô phụ chưa tới 3KB,
 *  và KHÔNG BAO GIỜ hết hạn.
 *
 *  Ba thứ được giữ, đều từng phải quét lại toàn bộ lịch sử:
 *    · điểm tốt nhất của từng BÀI  -> sao trên ô bài
 *    · điểm tốt nhất của từng Ô PHỤ ("LT:20:1", "TT:20") -> sao ô Luyện tập/Thi thử
 *    · số đề thi thử trong lộ trình đã làm -> hạn ngạch 1 đề của gói Miễn phí.
 *      Trước đây con số này cũng đếm từ lịch sử, nên lượt thi cũ rơi ra là người
 *      dùng gói Miễn phí được lại một đề — chỗ rò nhỏ, nay hết.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  var KHOA = "thanhTich";

  function doc() {
    try { return (typeof load === "function" && load(KHOA, null)) || null; }
    catch (e) { return null; }
  }
  function ghi(o) {
    try { if (typeof save === "function") save(KHOA, o); } catch (e) { /* hết chỗ lưu thì thôi */ }
  }
  function moi() { return { diem: {}, soTT: 0, tt: {} }; }

  /* Dựng lại từ lịch sử đang có — chạy MỘT LẦN cho người đã dùng app từ trước,
     nếu không thì bật bản mới lên là sao trên bản đồ mất sạch. Lịch sử chỉ còn 50
     lượt nên không dựng lại được hết, nhưng giữ được đúng phần còn nhìn thấy —
     tức là không ai MẤT thêm gì so với trước. */
  function dungLai() {
    var o = moi();
    var ls = (typeof State !== "undefined" && State.history) || [];
    ls.forEach(function (h) {
      if (!h || !h.lessonId || !h.total) return;
      var s = h.correctCount / h.total;
      if (!(h.lessonId in o.diem) || s > o.diem[h.lessonId]) o.diem[h.lessonId] = s;
      /* Đếm đề thi thử theo MỐC THỜI GIAN của lượt làm, không phải cộng dồn: dựng
         lại nhiều lần thì cộng dồn sẽ thổi số đề lên và khoá oan người dùng. */
      if (h.mode === "exam" && String(h.lessonId).indexOf("TT:") === 0) o.tt[h.at] = 1;
    });
    o.soTT = Object.keys(o.tt).length;
    ghi(o);
    return o;
  }

  function kho() { return doc() || dungLai(); }

  /* Ghi nhận một lượt vừa nộp. Nhận đúng cái record mà app.js dựng. */
  function ghiLuot(h) {
    if (!h || !h.lessonId || !h.total) return;
    var o = kho();
    var s = h.correctCount / h.total;
    if (!(h.lessonId in o.diem) || s > o.diem[h.lessonId]) o.diem[h.lessonId] = s;
    if (h.mode === "exam" && String(h.lessonId).indexOf("TT:") === 0 && h.at) {
      o.tt[h.at] = 1;
      o.soTT = Object.keys(o.tt).length;
    }
    ghi(o);
  }

  /* Tỉ lệ đúng tốt nhất của một bài hoặc một ô phụ; null nếu chưa từng làm. */
  function diem(id) {
    var o = kho();
    return id in o.diem ? o.diem[id] : null;
  }
  function soDeThiThu() { return kho().soTT || 0; }

  window.ThanhTich = {
    ghiLuot: ghiLuot,
    diem: diem,
    soDeThiThu: soDeThiThu,
    dungLai: dungLai,
  };
})();
