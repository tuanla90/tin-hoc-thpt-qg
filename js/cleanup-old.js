/* ============================================================================
 *  CHUYỂN BÀI TẬP CODE về bài SGK.
 *  exercises.js vẫn gán 35 bài tập tương tác theo ID bài CŨ (L04–L18, L22–L25).
 *  Các bài cũ đã bị gỡ khỏi nguồn, nên ở đây ta CHUYỂN các bài tập đó sang bài
 *  SGK cùng chủ đề (gộp mảng, không mất bài tập nào) để chúng vẫn hiển thị.
 *  Nạp SAU exercises.js + các tệp bài SGK, TRƯỚC app.js.
 * ==========================================================================*/
(function () {
  if (typeof EXERCISES === "undefined") return;

  /* id bài CŨ (mang bài tập trong exercises.js)  ->  id bài SGK cùng chủ đề */
  var REMAP = {
    "L04": "S10-17", // biến & kiểu dữ liệu  -> Bài 17. Biến và lệnh gán
    "L05": "S10-17", // toán tử & biểu thức  -> Bài 17. Biến và lệnh gán
    "L06": "S10-19", // if/elif/else         -> Bài 19. Câu lệnh rẽ nhánh If
    "L07": "S10-20", // for & while          -> Bài 20. Câu lệnh lặp for
    "L08": "S10-22", // list & string        -> Bài 22. Kiểu dữ liệu danh sách
    "L22": "S10-24", // xâu kí tự            -> Bài 24. Xâu kí tự
    "L09": "S10-26", // hàm def/return       -> Bài 26. Hàm trong Python
    "L10": "S10-23", // list nâng cao & dict -> Bài 23. Lệnh làm việc với danh sách
    "L11": "S10-23", // thuật toán với list  -> Bài 23. Lệnh làm việc với danh sách
    "L23": "S17",    // mảng hai chiều       -> Bài 17 (Tin 11). Mảng 1 & 2 chiều
    "L13": "S11-24", // Big-O                -> Bài 24. Đánh giá độ phức tạp thời gian
    "L14": "S11-19", // tìm kiếm             -> Bài 19. Bài toán tìm kiếm
    "L15": "S11-21", // sắp xếp              -> Bài 21. Các thuật toán sắp xếp đơn giản
    "L16": "S10-26", // đệ quy (hàm tự gọi)  -> Bài 26. Hàm trong Python
    "L17": "S10-23", // ngăn xếp & hàng đợi  -> Bài 23. Lệnh làm việc với danh sách
    "L18": "S10-29", // ngoại lệ & tệp       -> Bài 29. Nhận biết lỗi chương trình
    "L25": "S10-30"  // kiểm thử & gỡ lỗi    -> Bài 30. Kiểm thử và gỡ lỗi chương trình
  };

  Object.keys(REMAP).forEach(function (oldId) {
    var arr = EXERCISES[oldId];
    if (!arr || !arr.length) return;
    var tgt = REMAP[oldId];
    EXERCISES[tgt] = (EXERCISES[tgt] || []).concat(arr); // gộp, giữ bài tập sẵn có (vd S17)
    delete EXERCISES[oldId];
  });
})();
