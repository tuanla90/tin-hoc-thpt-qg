/* ============================================================================
 *  BAI TAP SQL (dot 2) cho 3 bai CSDL ban sach chua co thuc hanh:
 *    C11-06  Co so du lieu la gi        -> SELECT nhap mon
 *    C11-11  An toan & toan ven du lieu -> rang buoc toan ven (PK / NOT NULL / FK)
 *    C11-26  Tach bang thanh bang lien ket -> JOIN + tao bang lien ket bang khoa
 *  Cham bang sql.js (SQLite WASM). Dung LAI schema S (CSDL truong hoc 4 bang)
 *  cua sql-run.js de nhat quan. Nap SAU sql-run.js (da export window.SQL_EXERCISES).
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SQL_EXERCISES) return;
  // Lay dung schema S (CSDL mau) tu mot bai da co, de khong chep lai chuoi dai.
  var base = window.SQL_EXERCISES["C11-08"] || window.SQL_EXERCISES["C11-09"] ||
             window.SQL_EXERCISES["U11-01"] || [];
  var S = (base[0] && base[0].schema) || "";

  var ADD = {
    // ---- C11-06: Co so du lieu la gi — lam quen truy van doc du lieu ----
    "C11-06": [
      { prompt: "Một cơ sở dữ liệu gom mọi thông tin vào các **bảng**. Hãy xem **toàn bộ dữ liệu** của bảng HOCSINH (tất cả các cột).", schema: S,
        starter: "SELECT * FROM ...;", solution: "SELECT * FROM HOCSINH;",
        hint: "Dấu * nghĩa là lấy mọi cột; bảng cần xem là HOCSINH." },
      { prompt: "Thay vì lật từng cuốn sổ, chỉ một câu truy vấn là liệt kê được **họ tên tất cả học sinh** (chỉ cột HoTen).", schema: S,
        starter: "SELECT ... FROM HOCSINH;", solution: "SELECT HoTen FROM HOCSINH;",
        hint: "Chọn đúng cột HoTen từ bảng HOCSINH." },
      { prompt: "Một lợi ích của cơ sở dữ liệu là **tìm kiếm nhanh**. Hãy **đếm** xem trường đang quản lí bao nhiêu học sinh.", schema: S,
        starter: "SELECT COUNT(*) FROM ...;", solution: "SELECT COUNT(*) FROM HOCSINH;",
        hint: "Dùng hàm gộp COUNT(*) trên bảng HOCSINH." },
    ],
    // ---- C11-11: An toan & toan ven — dat rang buoc toan ven khi tao bang ----
    "C11-11": [
      { prompt: "**Ràng buộc khoá chính & NOT NULL.** Tạo bảng `NGUOIDUNG` gồm: `Ma` kiểu `TEXT` là **khoá chính**, `TenDangNhap` kiểu `TEXT` **không được để trống** (`NOT NULL`).", schema: S,
        check: "SELECT name, \"notnull\", pk FROM pragma_table_info('NGUOIDUNG') ORDER BY cid;",
        starter: "CREATE TABLE NGUOIDUNG(\n  ...\n);",
        solution: "CREATE TABLE NGUOIDUNG(Ma TEXT PRIMARY KEY, TenDangNhap TEXT NOT NULL);",
        hint: "Ma TEXT PRIMARY KEY, TenDangNhap TEXT NOT NULL." },
      { prompt: "**Ràng buộc toàn vẹn tham chiếu (khoá ngoài).** Tạo bảng `DIEMSO` có `MaHS` kiểu `TEXT` là **khoá ngoài** tham chiếu `HOCSINH(MaHS)`, và `Diem` kiểu số thực `REAL`. Dùng từ khoá `REFERENCES`.", schema: S,
        check: "PRAGMA foreign_key_list(DIEMSO);",
        starter: "CREATE TABLE DIEMSO(\n  MaHS TEXT REFERENCES ...,\n  Diem REAL\n);",
        solution: "CREATE TABLE DIEMSO(MaHS TEXT REFERENCES HOCSINH(MaHS), Diem REAL);",
        hint: "Khai báo khoá ngoài ngay tại cột: MaHS TEXT REFERENCES HOCSINH(MaHS)." },
      { prompt: "**Phân quyền bằng bảng tài khoản.** Tạo bảng `TAIKHOAN` gồm ba cột: `Ma` `TEXT` **khoá chính**, `MatKhau` `TEXT` **NOT NULL**, `VaiTro` `TEXT` (ví dụ 'giaovien' hay 'hocsinh').", schema: S,
        check: "SELECT name, \"notnull\", pk FROM pragma_table_info('TAIKHOAN') ORDER BY cid;",
        starter: "CREATE TABLE TAIKHOAN(\n  ...\n);",
        solution: "CREATE TABLE TAIKHOAN(Ma TEXT PRIMARY KEY, MatKhau TEXT NOT NULL, VaiTro TEXT);",
        hint: "Ba cột: Ma TEXT PRIMARY KEY, MatKhau TEXT NOT NULL, VaiTro TEXT." },
    ],
    // ---- C11-26: Tach bang lien ket — noi bang bang JOIN, tao bang bang khoa ----
    "C11-26": [
      { prompt: "**Nối hai bảng bằng khoá.** Dữ liệu học sinh và lớp được **tách** thành hai bảng nối nhau qua `MaLop`. Hãy **nối** bảng HOCSINH với LOP để lấy **họ tên kèm tên lớp** của mỗi học sinh (cột HoTen và TenLop).", schema: S,
        starter: "SELECT HOCSINH.HoTen, LOP.TenLop\nFROM HOCSINH JOIN LOP ON ...;",
        solution: "SELECT HOCSINH.HoTen, LOP.TenLop FROM HOCSINH JOIN LOP ON HOCSINH.MaLop = LOP.MaLop;",
        hint: "Điều kiện nối là hai khoá khớp nhau: ON HOCSINH.MaLop = LOP.MaLop." },
      { prompt: "**Nối qua bảng trung gian.** Điểm của học sinh nằm ở bảng KETQUA, còn tên môn ở bảng MONHOC. Hãy nối hai bảng để liệt kê **tên môn và điểm** của học sinh có mã `H1` (cột TenMon, Diem).", schema: S,
        starter: "SELECT MONHOC.TenMon, KETQUA.Diem\nFROM KETQUA JOIN MONHOC ON ...\nWHERE ...;",
        solution: "SELECT MONHOC.TenMon, KETQUA.Diem FROM KETQUA JOIN MONHOC ON KETQUA.MaMon = MONHOC.MaMon WHERE KETQUA.MaHS = 'H1';",
        hint: "Nối ON KETQUA.MaMon = MONHOC.MaMon, rồi lọc WHERE KETQUA.MaHS = 'H1'." },
      { prompt: "**Tự thiết kế bảng liên kết.** Tách 'sổ sách' thành hai bảng nối bằng khoá: tạo `TACGIA(MaTG TEXT` khoá chính`, Ten TEXT)` và `SACH(MaSach TEXT` khoá chính`, TenSach TEXT, MaTG TEXT` **khoá ngoài** tham chiếu `TACGIA(MaTG))`. (Viết cả hai câu CREATE.)", schema: S,
        check: "PRAGMA foreign_key_list(SACH);",
        starter: "CREATE TABLE TACGIA(\n  MaTG TEXT PRIMARY KEY,\n  Ten TEXT\n);\nCREATE TABLE SACH(\n  ...\n);",
        solution: "CREATE TABLE TACGIA(MaTG TEXT PRIMARY KEY, Ten TEXT); CREATE TABLE SACH(MaSach TEXT PRIMARY KEY, TenSach TEXT, MaTG TEXT REFERENCES TACGIA(MaTG));",
        hint: "Ở bảng SACH, cột MaTG khai báo: MaTG TEXT REFERENCES TACGIA(MaTG)." },
    ],
  };

  Object.keys(ADD).forEach(function (k) {
    window.SQL_EXERCISES[k] = (window.SQL_EXERCISES[k] || []).concat(ADD[k]);
  });
})();
