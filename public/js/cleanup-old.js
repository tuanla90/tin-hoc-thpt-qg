/* ============================================================================
 *  CHUYỂN BÀI TẬP CODE về bài học tương ứng.
 *  exercises.js vẫn gán 35 bài tập tương tác theo ID bài CŨ (L04–L18, L22–L25).
 *  Các bài cũ đã bị gỡ khỏi nguồn, nên ở đây ta CHUYỂN các bài tập đó sang bài
 *  tự soạn cùng chủ đề (gộp mảng, không mất bài tập nào) để chúng vẫn hiển thị.
 *  Nạp SAU exercises.js, TRƯỚC app.js.
 * ==========================================================================*/
(function () {
  if (typeof EXERCISES === "undefined") return;

  /* id bài CŨ (mang bài tập trong exercises.js)  ->  id bài tự soạn cùng chủ đề */
  var REMAP = {
    "L04": "C10-12", // biến & kiểu dữ liệu    -> Biến và kiểu dữ liệu
    "L05": "C10-12", // toán tử & biểu thức    -> Biến và kiểu dữ liệu
    "L06": "C10-14", // if/elif/else           -> Câu lệnh rẽ nhánh if – elif – else
    "L07": "C10-15", // for & while            -> Vòng lặp for
    "L08": "C10-17", // list & string          -> Danh sách (list)
    "L22": "C10-18", // xâu kí tự              -> Xâu kí tự (string)
    "L09": "C10-19", // hàm def/return         -> Hàm (function)
    "L10": "C10-31", // list nâng cao & dict   -> Sửa đổi danh sách: chèn, xoá, sắp xếp và cắt lát
    "L11": "C10-31", // thuật toán với list    -> Sửa đổi danh sách: chèn, xoá, sắp xếp và cắt lát
    "L23": "C11-12", // mảng hai chiều                  -> Mảng một chiều và cách xử lí dãy số
    "L13": "C11-16", // Big-O                  -> Độ phức tạp của thuật toán
    "L14": "C11-13", // tìm kiếm               -> Thuật toán tìm kiếm tuần tự
    "L15": "C11-15", // sắp xếp                -> Thuật toán sắp xếp
    "L16": "C10-19", // đệ quy (hàm tự gọi)    -> Hàm (function)
    "L17": "C10-31", // ngăn xếp & hàng đợi    -> Sửa đổi danh sách: chèn, xoá, sắp xếp và cắt lát
    "L18": "C10-20", // ngoại lệ & tệp         -> Tìm lỗi, sửa lỗi và kiểm thử chương trình
    "L25": "C10-20"  // kiểm thử & gỡ lỗi      -> Tìm lỗi, sửa lỗi và kiểm thử chương trình
  };

  Object.keys(REMAP).forEach(function (oldId) {
    var arr = EXERCISES[oldId];
    if (!arr || !arr.length) return;
    var tgt = REMAP[oldId];
    EXERCISES[tgt] = (EXERCISES[tgt] || []).concat(arr); // gộp, giữ bài tập sẵn có (vd S17)
    delete EXERCISES[oldId];
  });
})();
