/* ============================================================================
 *  LẶP GIÃN CÁCH + SỔ CÂU SAI
 *
 *  VÌ SAO CẦN: app đã có luyện tập có phản hồi ngay (retrieval practice) và radar
 *  chỗ yếu, nhưng KHÔNG có lịch ôn lại. Kho có 2052 câu, nên học sinh gặp một câu,
 *  làm xong, rồi gần như không bao giờ gặp lại — kể cả câu vừa làm sai. Sai một
 *  câu hiện chỉ làm tụt radar CHỦ ĐỀ; bản thân câu đó không quay lại bao giờ.
 *
 *  HAI VIỆC, MỘT KHO DỮ LIỆU:
 *    · Ôn hôm nay — mỗi câu có ngày hẹn riêng, tới hẹn thì gom lại thành một lượt.
 *    · Sổ câu sai — câu đã sai chỉ được xoá khỏi sổ khi làm đúng 2 lần vào 2 NGÀY
 *      KHÁC NHAU. Đúng hai lần trong cùng một buổi là trí nhớ ngắn hạn, không phải
 *      đã thuộc — đó chính là điều hiệu ứng giãn cách nói.
 *
 *  VÌ SAO KHÔNG DÙNG State.history: lịch sử bị cắt còn 50 lượt, một học sinh làm
 *  mỗi ngày một lượt là mất dữ liệu sau ~50 ngày, đúng lúc gần thi. Kho ở đây tách
 *  riêng và rất gọn — mỗi câu vài chục byte, 2052 câu cũng chỉ khoảng 60KB.
 *
 *  CHƯA ĐỒNG BỘ LÊN MÁY CHỦ: account.js xử lí đồng bộ theo TỪNG khoá có tên cụ
 *  thể (history / learned / profile), không có nhánh chung. Khoá "srs" vì vậy chỉ
 *  nằm trong máy — đổi máy là mất lịch ôn. Muốn đồng bộ phải thêm endpoint ở
 *  server và một nhánh trong onSaved().
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  var KHOA = "srs";

  /* Bậc giãn cách, tính bằng NGÀY. Làm đúng liên tiếp lần thứ n thì hẹn lại sau
     BUOC[n] ngày; quá bậc cuối thì giữ nguyên bậc cuối. Dãy 1-3-7-16-35 là dãy
     Leitner quen dùng: mỗi bậc gấp khoảng 2,2 lần bậc trước, đủ thưa để không phí
     thời gian mà chưa thưa tới mức quên hẳn. Sai thì rơi về bậc 0 (hẹn ngày mai),
     không rơi nửa bậc — quên rồi thì phải học lại từ đầu. */
  var BUOC = [1, 3, 7, 16, 35];

  /* Số NGÀY KHÁC NHAU phải làm đúng thì câu mới ra khỏi sổ câu sai. */
  var CAN_DE_XOA_SO = 2;

  /* Ngày theo LỊCH ĐỊA PHƯƠNG, không dùng Date.now()/86400000: cách đó cắt ngày
     theo giờ UTC, tức 7 giờ sáng ở Việt Nam mới sang ngày mới — học buổi tối và
     sáng hôm sau sẽ bị tính là cùng một ngày. */
  function soNgay(d) {
    d = d || new Date();
    return Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate())).getTime() / 86400000);
  }

  function doc() {
    try { return (typeof load === "function" && load(KHOA, {})) || {}; }
    catch (e) { return {}; }
  }
  function ghi(o) {
    try { if (typeof save === "function") save(KHOA, o); } catch (e) { /* hết chỗ lưu thì thôi */ }
  }

  /* Trạng thái một câu:
       l  chuỗi làm đúng liên tiếp (0 khi vừa sai)
       h  ngày hẹn ôn lại
       s  1 nếu câu này ĐÃ TỪNG sai (đang hoặc đã ở trong sổ)
       k  số ngày khác nhau đã làm đúng KỂ TỪ lần sai gần nhất
       n  ngày làm đúng gần nhất (để không tính hai lần đúng trong cùng ngày)  */
  /* Cập nhật trạng thái MỘT câu. Cả ghiNhan lẫn ghiNhanLuot đều gọi hàm này —
     trước đây hai chỗ chép lại cùng một đoạn, sửa một chỗ là hai chỗ lệch nhau. */
  function capNhat(t, dung, nay) {
    t = t || { l: 0, h: 0, s: 0, k: 0, n: -1 };
    if (dung) {
      t.l = (t.l || 0) + 1;
      /* Chỉ đếm khi sang NGÀY MỚI: làm đúng hai lần trong cùng một buổi là trí nhớ
         ngắn hạn, không phải đã thuộc. */
      if (t.n !== nay) { t.k = (t.k || 0) + 1; t.n = nay; }
      t.h = nay + BUOC[Math.min(t.l - 1, BUOC.length - 1)];
    } else {
      t.l = 0; t.s = 1; t.k = 0;
      /* PHẢI xoá "ngày đúng gần nhất": không xoá thì lần làm đúng NGAY SAU cú sai
         (cùng ngày) bị bỏ qua vì trùng ngày cũ, và câu phải mất 3 ngày mới ra khỏi
         sổ thay vì 2 như luật đã nói. Đã đo thấy đúng như vậy trước khi sửa. */
      t.n = -1;
      t.h = nay + 1;                 // sai thì mai hỏi lại
    }
    return t;
  }

  function ghiNhan(qid, dung) {
    if (!qid) return;
    var kho = doc();
    kho[qid] = capNhat(kho[qid], dung, soNgay());
    ghi(kho);
  }

  /* Ghi nhận cả một lượt làm bài. Nhận đúng mảng detail mà app.js dựng. */
  function ghiNhanLuot(detail) {
    if (!detail || !detail.length) return;
    var kho = doc(), nay = soNgay();
    detail.forEach(function (d) {
      if (!d || !d.id) return;
      kho[d.id] = capNhat(kho[d.id], d.dung, nay);
    });
    ghi(kho);
  }

  function conTrongSo(t) { return t && t.s && (t.k || 0) < CAN_DE_XOA_SO; }

  /* Câu tới hẹn hôm nay. Ưu tiên: câu đang trong sổ sai trước, rồi tới câu quá hẹn
     lâu nhất — quên lâu nhất thì cần hỏi lại trước. */
  function denHan(toiDa) {
    var kho = doc(), nay = soNgay(), ra = [];
    Object.keys(kho).forEach(function (id) {
      var t = kho[id];
      if (!t || (t.h || 0) > nay) return;
      ra.push({ id: id, treo: nay - (t.h || 0), so: conTrongSo(t) ? 1 : 0 });
    });
    ra.sort(function (a, b) { return b.so - a.so || b.treo - a.treo; });
    return ra.slice(0, toiDa || 999).map(function (x) { return x.id; });
  }

  function dsSoSai() {
    var kho = doc(), ra = [];
    Object.keys(kho).forEach(function (id) {
      if (conTrongSo(kho[id])) ra.push({ id: id, con: CAN_DE_XOA_SO - (kho[id].k || 0) });
    });
    return ra;
  }

  /* Đổi danh sách id thành câu hỏi thật, bỏ id của câu đã bị gỡ khỏi kho. */
  function cauTheoId(ids) {
    if (!window.QUESTION_BANK) return [];
    var can = {}; ids.forEach(function (i) { can[i] = 1; });
    return QUESTION_BANK.filter(function (q) { return can[q.id]; });
  }

  function soLieu() {
    var kho = doc(), nay = soNgay(), han = 0, so = 0, thuoc = 0, tong = 0;
    Object.keys(kho).forEach(function (id) {
      var t = kho[id]; if (!t) return;
      tong++;
      if ((t.h || 0) <= nay) han++;
      if (conTrongSo(t)) so++;
      if ((t.l || 0) >= BUOC.length) thuoc++;
    });
    return { danhGia: tong, denHan: han, trongSo: so, daThuoc: thuoc };
  }

  window.OnTap = {
    ghiNhan: ghiNhan,
    ghiNhanLuot: ghiNhanLuot,
    denHan: denHan,
    dsSoSai: dsSoSai,
    cauTheoId: cauTheoId,
    soLieu: soLieu,
    soNgay: soNgay,
    CAN_DE_XOA_SO: CAN_DE_XOA_SO,
    BUOC: BUOC,
  };
})();
