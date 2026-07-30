/* ============================================================================
 *  NỘI DUNG "SAI Ở ĐÂU?" — LỚP 11 VÀ LỚP 12
 *
 *  Nạp SAU js/sai-o-dau.js. Xem quy ước định dạng ở đầu js/sai-o-dau-10.js.
 *  Tách khỏi tệp lớp 10 chỉ vì độ dài — hai tệp hoàn toàn độc lập với nhau.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SaiODau) return;
  var K = window.SaiODau.dangKy;

  /* ================================================================ LỚP 11 */

  /* --------------------------------------------- CPU, bộ nhớ, thiết bị */
  K("C11-03", [{
    de: "Bốn phát biểu về phần cứng bên trong máy tính. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**RAM** mất hết dữ liệu khi tắt máy; **ổ cứng** thì giữ được.",
        vi: "Đúng. RAM là bộ nhớ trong tạm thời, ổ cứng là bộ nhớ ngoài lâu dài." },
      { t: "Muốn máy mở được nhiều ứng dụng cùng lúc mà không chậm thì nên tăng **RAM**.",
        vi: "Đúng. Hết RAM là hệ điều hành phải chuyển bớt dữ liệu ra ổ cứng, và đó là lúc máy đứng hình." },
      { t: "**CPU** có tốc độ cao hơn thì mọi việc trên máy đều nhanh hơn, kể cả mở tệp lớn từ ổ cứng.",
        sai: true,
        vi: "Sai. Việc mở tệp lớn bị giới hạn bởi **tốc độ ổ đĩa**, không phải CPU. Đây là lí do đổi ổ HDD sang SSD làm máy “nhanh lên” rõ hơn là đổi CPU." },
      { t: "Tăng dung lượng ổ cứng thì máy chạy nhanh hơn vì có nhiều chỗ để tính toán hơn.",
        sai: true,
        vi: "Sai. Ổ cứng để **lưu**, không phải để tính. Thêm dung lượng chỉ cho chứa nhiều tệp hơn, không làm máy nhanh hơn." },
    ],
    chot: "Ba bộ phận, ba việc khác nhau: **CPU tính**, **RAM là bàn làm việc**, **ổ cứng là tủ lưu**. Máy chậm vì lí do gì thì phải nâng đúng bộ phận đó.",
  }]);

  /* ------------------------------------------------- Tệp và thư mục */
  K("C11-04", [{
    de: "Bốn phát biểu về tổ chức tệp, thư mục. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Phần mở rộng** của tệp (`.docx`, `.png`) cho hệ điều hành biết nên mở tệp bằng ứng dụng nào.",
        vi: "Đúng, đó là công dụng chính của phần mở rộng." },
      { t: "Đổi phần mở rộng của tệp `anh.png` thành `anh.docx` là đã đổi tệp ảnh thành tệp văn bản.",
        sai: true,
        vi: "Sai. **Nội dung bên trong tệp không đổi một byte nào**; chỉ là hệ điều hành gọi sai ứng dụng nên mở ra lỗi. Muốn đổi thật thì phải chuyển đổi (convert) bằng phần mềm." },
      { t: "**Đường dẫn tuyệt đối** tính từ gốc ổ đĩa, còn **đường dẫn tương đối** tính từ thư mục đang làm việc.",
        vi: "Đúng — đây là điểm phân biệt hay ra trong câu Đ/S." },
      { t: "Xoá tệp rồi đổ Thùng rác thì dữ liệu bị xoá sạch khỏi ổ đĩa ngay lập tức.",
        sai: true,
        vi: "Sai. Hệ điều hành chỉ **đánh dấu vùng đó là trống** và bỏ tên tệp khỏi danh mục; dữ liệu còn nằm nguyên tới khi bị ghi đè. Đó là lí do có phần mềm cứu dữ liệu — và cũng là lí do bán lại máy cũ phải xoá kiểu khác." },
    ],
    chot: "Nhớ: **tên tệp là nhãn dán, nội dung là thứ bên trong**. Đổi nhãn không đổi ruột.",
  }]);

  /* ------------------------------------------ Cơ sở dữ liệu là gì */
  K("C11-06", [{
    de: "Bốn phát biểu về lí do cần cơ sở dữ liệu. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Lưu dữ liệu rải rác trong nhiều tệp bảng tính dễ sinh ra **dữ liệu trùng lặp và không nhất quán**.",
        vi: "Đúng — đây chính là vấn đề mà CSDL ra đời để giải quyết." },
      { t: "Cơ sở dữ liệu cho **nhiều người dùng cùng lúc** mà vẫn kiểm soát được ai được xem, ai được sửa.",
        vi: "Đúng, và là ưu điểm mà tệp rời không có." },
      { t: "Cơ sở dữ liệu và bảng tính (Excel) là một, chỉ khác tên gọi.",
        sai: true,
        vi: "Sai. Bảng tính mạnh ở tính toán và trình bày cho **một người**; CSDL mạnh ở lưu lượng lớn, **ràng buộc dữ liệu**, nhiều người truy cập đồng thời và truy vấn phức tạp." },
      { t: "Đã dùng cơ sở dữ liệu thì không cần sao lưu nữa, vì dữ liệu trong đó không bao giờ mất.",
        sai: true,
        vi: "Sai hoàn toàn. CSDL cũng nằm trên ổ đĩa, cũng hỏng được, cũng bị xoá nhầm bằng một câu lệnh. **Sao lưu là bắt buộc** với mọi cách lưu trữ." },
    ],
    chot: "CSDL giải bốn việc mà tệp rời làm kém: **tránh trùng lặp**, **giữ nhất quán**, **nhiều người dùng chung**, **tìm kiếm nhanh trên lượng lớn**.",
  }]);

  /* ------------------------------------------- Mô hình dữ liệu quan hệ */
  K("C11-07", [{
    de: "Bốn phát biểu về bảng, bản ghi, khoá trong mô hình quan hệ. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Mỗi **hàng** của bảng là một bản ghi, mỗi **cột** là một trường.",
        vi: "Đúng, đây là từ vựng gốc của mô hình quan hệ." },
      { t: "**Khoá chính** phải xác định duy nhất từng bản ghi và không được để trống.",
        vi: "Đúng — hai điều kiện này luôn đi cùng nhau." },
      { t: "Có thể dùng **họ và tên** làm khoá chính của bảng học sinh, vì mỗi người một tên.",
        sai: true,
        vi: "Sai. Trong một trường luôn có người trùng tên, mà trùng là mất tính duy nhất. Phải dùng một mã riêng như **mã học sinh**. Nói chung, dữ liệu có thật ngoài đời (tên, số điện thoại) đều là khoá chính tồi vì có thể trùng hoặc thay đổi." },
      { t: "**Khoá ngoài** là khoá chính của bảng này được đặt sang bảng kia để nối hai bảng lại với nhau.",
        vi: "Đúng, đó là cơ chế liên kết bảng." },
      { t: "Một bảng có thể có nhiều khoá chính cùng lúc.",
        sai: true,
        vi: "Sai. Mỗi bảng chỉ có **một** khoá chính (khoá đó có thể gồm nhiều cột ghép lại, nhưng vẫn là một khoá chính). Nhiều **khoá ngoài** thì được." },
    ],
    chot: "Khi đề hỏi chọn khoá chính, hãy tự hỏi: “**có bao giờ hai bản ghi trùng giá trị này không?**”. Có thể trùng thì không dùng được.",
  }]);

  /* -------------------------------------------------------------- DBMS */
  K("C11-08", [{
    de: "Bốn phát biểu về hệ quản trị cơ sở dữ liệu (DBMS). Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "DBMS là **phần mềm** đứng giữa người dùng và dữ liệu, lo việc lưu, tìm và bảo vệ dữ liệu.",
        vi: "Đúng — MySQL, PostgreSQL, SQL Server, Access đều là DBMS." },
      { t: "Cơ sở dữ liệu và hệ quản trị cơ sở dữ liệu là hai thứ khác nhau.",
        vi: "Đúng, và hay bị hỏi. CSDL là **dữ liệu**; DBMS là **phần mềm** quản lí dữ liệu đó." },
      { t: "Muốn lấy dữ liệu ra, người dùng phải tự viết chương trình đọc tệp trên ổ đĩa.",
        sai: true,
        vi: "Sai — đó chính là việc DBMS làm hộ. Người dùng chỉ cần nói **muốn gì** bằng câu lệnh SQL, còn việc đọc tệp ở đâu, theo cách nào là chuyện của DBMS." },
      { t: "DBMS bảo đảm dữ liệu luôn đúng nghiệp vụ, nên không cần đặt ràng buộc gì thêm.",
        sai: true,
        vi: "Sai. DBMS chỉ thực thi những ràng buộc mà **người thiết kế khai báo** (khoá chính, khoá ngoài, `NOT NULL`, kiểu dữ liệu…). Không khai thì nó cho nhập điểm bằng 200 hay ngày sinh năm 3000 bình thường." },
    ],
    chot: "Câu tách bạch để nhớ: **CSDL là kho, DBMS là người quản kho**. Người quản kho chỉ giữ đúng những luật mình được giao.",
  }]);

  /* -------------------------------------------------------- SQL SELECT */
  K("C11-09", [{
    de: "Bạn Nam viết truy vấn lấy tên và điểm của học sinh lớp 12A có điểm từ 8 trở lên, sắp giảm dần. Chỉ ra dòng sai.",
    loai: "ma",
    dong: [
      { t: "SELECT ho_ten, diem",
        vi: "Đúng. Chỉ lấy hai cột cần thiết thay vì `SELECT *` — cách viết tốt." },
      { t: "FROM hoc_sinh",
        vi: "Đúng." },
      { t: "WHERE lop = 12A AND diem >= 8",
        sai: true,
        vi: "Sai: giá trị chữ phải đặt trong **dấu nháy đơn** — `lop = '12A'`. Không có nháy, SQL hiểu `12A` là tên cột hoặc là số viết sai nên báo lỗi. (Phần `diem >= 8` thì đúng, vì số không cần nháy.)" },
      { t: "ORDER BY diem DESC",
        vi: "Đúng. `DESC` là giảm dần; mặc định không ghi gì là tăng dần (`ASC`)." },
    ],
    chot: "Quy tắc gọn: **chữ thì có nháy đơn, số thì không**. Và thứ tự các từ khoá luôn là `SELECT … FROM … WHERE … ORDER BY`.",
  }]);

  /* ---------------------------------------- SQL thêm, sửa, xoá dữ liệu */
  K("C11-10", [{
    de: "Bốn câu lệnh trên bảng `hoc_sinh`. Có **hai** câu gây hậu quả nghiêm trọng.",
    loai: "ma",
    dong: [
      { t: "INSERT INTO hoc_sinh (ma_hs, ho_ten, lop) VALUES ('HS01', 'Lê An', '12A');",
        vi: "Đúng. Ghi rõ danh sách cột rồi mới tới `VALUES` — cách viết an toàn, vì thêm cột mới vào bảng thì câu này vẫn chạy." },
      { t: "UPDATE hoc_sinh SET lop = '12B';",
        sai: true,
        vi: "Thiếu **`WHERE`**! Câu này đổi lớp của **toàn bộ** học sinh trong bảng thành 12B. Phải có điều kiện: `... SET lop = '12B' WHERE ma_hs = 'HS01';`" },
      { t: "DELETE FROM hoc_sinh;",
        sai: true,
        vi: "Cũng thiếu **`WHERE`** — câu này **xoá sạch mọi bản ghi** trong bảng. Đây là tai nạn kinh điển nhất của người mới dùng SQL, và không có nút hoàn tác." },
      { t: "UPDATE hoc_sinh SET diem = diem + 0.5 WHERE lop = '12A';",
        vi: "Đúng và hợp lệ. Có `WHERE` nên chỉ tác động lên học sinh 12A; và dùng được `diem` ở cả hai vế vì SQL lấy giá trị cũ để tính giá trị mới." },
    ],
    chot: "Thói quen sống còn: viết `UPDATE` hay `DELETE` thì **gõ `WHERE` trước, gõ phần còn lại sau**. Và thử bằng `SELECT` cùng điều kiện đó xem đúng mấy dòng rồi mới chạy thật.",
  }]);

  /* ------------------------------------------- An toàn, toàn vẹn dữ liệu */
  K("C11-11", [{
    de: "Bốn phát biểu về an toàn và toàn vẹn dữ liệu. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Ràng buộc toàn vẹn** giúp dữ liệu nhập vào luôn hợp lệ, ví dụ điểm phải từ 0 đến 10.",
        vi: "Đúng. Đây là cách chặn dữ liệu vô nghĩa ngay từ lúc nhập, thay vì phát hiện muộn." },
      { t: "**Phân quyền** nghĩa là mỗi người chỉ xem và sửa được phần dữ liệu thuộc phận sự của mình.",
        vi: "Đúng — nguyên tắc quyền tối thiểu." },
      { t: "Đã đặt mật khẩu cho cơ sở dữ liệu thì dữ liệu an toàn, không cần sao lưu.",
        sai: true,
        vi: "Sai. Mật khẩu chống **người khác vào**, còn sao lưu chống **mất dữ liệu** (ổ hỏng, xoá nhầm, mã độc mã hoá). Hai việc hoàn toàn khác nhau, làm cái này không thay được cái kia." },
      { t: "Bản sao lưu để cùng trên ổ đĩa với cơ sở dữ liệu gốc là được, miễn là có sao lưu.",
        sai: true,
        vi: "Sai. Ổ đĩa hỏng hoặc mã độc quét cả ổ là mất luôn cả hai. Sao lưu phải để ở **thiết bị hoặc nơi khác**, và phải thử phục hồi xem có dùng được thật không." },
    ],
    chot: "Ba lớp phải có đủ: **ràng buộc** giữ dữ liệu đúng, **phân quyền** giữ dữ liệu khỏi người không phận sự, **sao lưu** giữ dữ liệu khỏi mất.",
  }]);

  /* -------------------------------------------------- Mảng một chiều */
  K("C11-12", [{
    de: "Chương trình tìm số lớn nhất trong dãy. Với dãy toàn số âm thì kết quả sai. Chỉ ra chỗ sai.",
    loai: "ma",
    dong: [
      { t: "a = [-7, -3, -12, -5]",
        vi: "Dữ liệu, không có gì sai." },
      { t: "max_val = 0",
        sai: true,
        vi: "Đây là chỗ sai. Khởi tạo bằng **0** thì mọi số âm đều nhỏ hơn nên không số nào thay được, kết quả ra 0 — một số không có trong dãy. Phải khởi tạo bằng **phần tử đầu tiên**: `max_val = a[0]`." },
      { t: "for i in range(len(a)):",
        vi: "Đúng. `range(len(a))` cho các chỉ số 0 → len−1, đúng khoảng hợp lệ." },
      { t: "    if a[i] > max_val:\n        max_val = a[i]",
        vi: "Đúng. Phép so sánh và phép gán đều hợp lí — lỗi chỉ nằm ở giá trị ban đầu." },
    ],
    chot: "Quy tắc chung cho mọi bài tìm max/min: **lấy phần tử đầu tiên làm giá trị khởi tạo**, đừng lấy 0 hay một số tự nghĩ ra.",
  }]);

  /* --------------------------------------------------- Mảng hai chiều */
  K("C11-28", [{
    de: "Chương trình tính tổng các phần tử của bảng 3 hàng × 4 cột. Chạy thì báo lỗi chỉ số. Chỉ ra chỗ sai.",
    loai: "ma",
    dong: [
      { t: "a = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]",
        vi: "Đúng: 3 hàng, mỗi hàng 4 phần tử." },
      { t: "tong = 0",
        vi: "Đúng." },
      { t: "for i in range(4):",
        sai: true,
        vi: "Sai. Vòng ngoài chạy theo **hàng** nên phải là `range(3)` — hoặc chắc chắn hơn là `range(len(a))`. Với `range(4)`, tới `i = 3` thì `a[3]` không tồn tại nên báo `IndexError`. Bạn này đổi chỗ số hàng và số cột." },
      { t: "    for j in range(4):\n        tong = tong + a[i][j]",
        vi: "Đúng: vòng trong chạy theo **cột**, mỗi hàng có 4 cột. Thứ tự `a[i][j]` cũng đúng — hàng trước, cột sau." },
    ],
    chot: "Viết mảng hai chiều thì dùng `range(len(a))` cho hàng và `range(len(a[0]))` cho cột — khỏi phải nhớ con số nào, và đổi kích thước bảng vẫn chạy.",
  }]);

  /* ------------------------------------------------ Tìm kiếm nhị phân */
  K("C11-14", [{
    de: "Bốn phát biểu về tìm kiếm nhị phân. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Tìm kiếm nhị phân chỉ dùng được khi dãy **đã được sắp xếp**.",
        vi: "Đúng, và là điều kiện quan trọng nhất của thuật toán này." },
      { t: "Tìm kiếm nhị phân luôn nhanh hơn tìm kiếm tuần tự trong mọi trường hợp.",
        sai: true,
        vi: "Sai. Nếu phần tử cần tìm nằm ngay **đầu dãy** thì tuần tự thấy sau 1 bước, còn nhị phân phải xét từ giữa. Nhị phân thắng ở **trường hợp xấu nhất và trung bình**, không thắng mọi trường hợp." },
      { t: "Mỗi bước, tìm kiếm nhị phân loại bỏ được khoảng **một nửa** số phần tử còn lại.",
        vi: "Đúng, và đó là lí do số bước chỉ khoảng log₂n." },
      { t: "Dãy chưa sắp xếp thì cứ sắp xếp trước rồi tìm nhị phân, bao giờ cũng nhanh hơn tìm tuần tự luôn.",
        sai: true,
        vi: "Sai nếu chỉ tìm **một lần**: sắp xếp tốn ít nhất khoảng n log n, đắt hơn cả việc quét tuần tự n bước. Sắp xếp trước chỉ đáng khi còn phải **tìm nhiều lần** trên cùng dãy đó." },
    ],
    chot: "Hai câu chốt: **phải sắp xếp trước**, và **chỉ lợi khi tìm nhiều lần**. Đề rất hay gài ở chữ “luôn luôn”, “trong mọi trường hợp”.",
  }]);

  /* ---------------------------------------------------------- Sắp xếp */
  K("C11-15", [{
    de: "Chương trình sắp xếp nổi bọt tăng dần. Chỉ ra dòng sai.",
    loai: "ma",
    dong: [
      { t: "n = len(a)",
        vi: "Đúng." },
      { t: "for i in range(n - 1):",
        vi: "Đúng. Cần n−1 lượt là đủ: mỗi lượt đưa được một phần tử về đúng chỗ, phần tử cuối cùng tự khắc đúng." },
      { t: "    for j in range(n - 1 - i):",
        vi: "Đúng và là chỗ tối ưu: sau lượt `i` thì `i` phần tử cuối đã đúng chỗ, không cần so lại nữa." },
      { t: "        if a[j] > a[j + 1]:\n            a[j] = a[j + 1]\n            a[j + 1] = a[j]",
        sai: true,
        vi: "Sai ở phép **đổi chỗ**. Gán `a[j] = a[j+1]` trước là **mất luôn giá trị cũ** của `a[j]`, nên dòng sau gán lại chính giá trị vừa gán — hai ô thành giống nhau. Phải dùng biến tạm: `t = a[j]; a[j] = a[j+1]; a[j+1] = t`, hoặc cách gọn của Python: `a[j], a[j+1] = a[j+1], a[j]`." },
    ],
    chot: "Đổi chỗ hai giá trị **luôn cần chỗ chứa tạm**. Đây là lỗi kinh điển, và cũng là lí do Python có cú pháp gán đồng thời.",
  }]);

  /* ------------------------------------------------------- Độ phức tạp */
  K("C11-16", [{
    de: "Bốn phát biểu về độ phức tạp thuật toán. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "O(n²) nghĩa là dữ liệu lớn gấp đôi thì chi phí tăng khoảng **gấp bốn**.",
        vi: "Đúng: (2n)² = 4n². Đây là cách hiểu O có ích nhất." },
      { t: "Kí hiệu O cho biết thuật toán chạy mất **bao nhiêu giây** trên máy tính.",
        sai: true,
        vi: "Sai. O **không** nói thời gian tuyệt đối — cùng một thuật toán chạy máy mạnh sẽ nhanh hơn. O nói **dữ liệu lớn lên thì chi phí phình ra theo kiểu nào**." },
      { t: "Với dữ liệu **rất nhỏ**, một thuật toán O(n²) có thể chạy nhanh hơn một thuật toán O(n log n).",
        vi: "Đúng, và hay bị tưởng là sai. O bỏ qua hằng số; thuật toán tốt về O nhưng nhiều phép phụ trợ vẫn có thể chậm hơn ở n nhỏ." },
      { t: "Máy tính ngày càng nhanh nên chọn thuật toán nào cũng được, chờ thêm chút là xong.",
        sai: true,
        vi: "Sai. Với O(n²), n tăng 1000 lần thì chi phí tăng **một triệu** lần — không có tiến bộ phần cứng nào bù nổi. Đó là lí do chọn thuật toán quan trọng hơn nâng cấp máy." },
    ],
    chot: "O đo **cách chi phí lớn lên theo n**, không đo giây. Câu Đ/S hay gài đúng ở chỗ này.",
  }]);

  /* ------------------------------------------------------------ Đệ quy */
  K("C11-19", [{
    de: "Hàm tính n! bằng đệ quy. Gọi `giai_thua(5)` thì chương trình báo lỗi tràn ngăn xếp. Có **hai** dòng bị đổi chỗ cho nhau.",
    loai: "ma",
    dong: [
      { t: "def giai_thua(n):",
        vi: "Đúng." },
      { t: "    if n == 0:",
        vi: "Điều kiện dừng **viết đúng** — 0! = 1 là trường hợp cơ sở hợp lệ." },
      { t: "        return n * giai_thua(n - 1)",
        sai: true,
        vi: "Sai: nhánh **điều kiện dừng lại gọi đệ quy tiếp**, nên nó không bao giờ dừng. Nhánh này phải là `return 1`. Đúng ra hai dòng bị đổi chỗ cho nhau." },
      { t: "    return 1",
        sai: true,
        vi: "Sai — dòng này đang nằm ở nhánh **tính toán**, nên mọi lời gọi với n khác 0 đều trả về 1 mà không nhân gì. Nó phải là `return n * giai_thua(n - 1)`." },
    ],
    chot: "Hàm đệ quy nào cũng phải có đủ hai phần và **đặt đúng chỗ**: nhánh dừng trả về giá trị cụ thể, nhánh còn lại gọi chính nó với **dữ liệu nhỏ hơn**.",
  }]);

  /* ---------------------------------------------- Ngăn xếp và hàng đợi */
  K("C11-32", [{
    de: "Bốn phát biểu về ngăn xếp và hàng đợi. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Ngăn xếp** hoạt động theo nguyên tắc vào sau ra trước (LIFO).",
        vi: "Đúng. Hình dung chồng sách: quyển đặt lên sau cùng là quyển lấy ra đầu tiên." },
      { t: "Nút **Hoàn tác** (Undo) trong phần mềm hoạt động theo kiểu **hàng đợi**.",
        sai: true,
        vi: "Sai — Undo dùng **ngăn xếp**. Việc vừa làm gần nhất phải được hoàn trước, đó đúng là vào sau ra trước." },
      { t: "**Hàng đợi** hoạt động theo nguyên tắc vào trước ra trước (FIFO), như hàng chờ in tài liệu.",
        vi: "Đúng. Ai gửi lệnh in trước thì in trước, mới công bằng." },
      { t: "Đưa dãy `A B C D` vào ngăn xếp rồi lấy hết ra sẽ được `A B C D`.",
        sai: true,
        vi: "Sai — sẽ được **`D C B A`**, tức là **đảo ngược**. Đây chính là công dụng thường dùng nhất của ngăn xếp. Còn hàng đợi thì mới trả ra `A B C D`." },
    ],
    chot: "Nhớ bằng hình: **ngăn xếp là chồng sách** (lấy từ trên), **hàng đợi là hàng người xếp mua vé** (lấy từ đầu hàng).",
  }]);

  /* ================================================================ LỚP 12 */

  /* ----------------------------------------------- Trí tuệ nhân tạo */
  K("C12-01", [{
    de: "Bốn phát biểu về trí tuệ nhân tạo. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "AI là việc làm cho máy tính thực hiện được những việc thường cần trí thông minh của con người.",
        vi: "Đúng — nhận dạng ảnh, hiểu giọng nói, dịch, ra quyết định." },
      { t: "Mọi chương trình máy tính chạy nhanh và phức tạp đều là AI.",
        sai: true,
        vi: "Sai. Một chương trình tính lương cho mười nghìn người rất phức tạp nhưng chỉ **làm theo quy tắc cố định** người viết ra — đó không phải AI. AI khác ở chỗ **rút ra quy tắc từ dữ liệu**." },
      { t: "**Học máy** là một nhánh của AI, không phải thứ nằm ngoài AI.",
        vi: "Đúng: AI là khái niệm rộng, học máy là một cách làm ra AI." },
      { t: "AI đã tự có ý thức và hiểu được ý nghĩa việc mình làm.",
        sai: true,
        vi: "Sai. AI hiện nay **tìm quy luật thống kê trong dữ liệu** rồi dự đoán, chứ không hiểu ý nghĩa. Nó trả lời trôi chảy không có nghĩa là nó hiểu điều nó nói." },
    ],
    chot: "Câu phân biệt gọn: chương trình **làm theo quy tắc người viết ra** thì không phải AI; chương trình **tự tìm quy tắc từ dữ liệu** thì mới là AI.",
  }]);

  /* --------------------------------------------- Giới hạn của AI */
  K("C12-02", [{
    de: "Bốn phát biểu về ứng dụng và giới hạn của AI. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "AI học từ dữ liệu, nên **dữ liệu thiên lệch** sẽ cho ra kết quả thiên lệch.",
        vi: "Đúng, và là giới hạn quan trọng nhất phải nhớ. Đây là lí do AI tuyển dụng từng loại nữ ứng viên." },
      { t: "AI có thể đưa ra câu trả lời **nghe rất thuyết phục nhưng sai**.",
        vi: "Đúng. Nó tối ưu cho việc trả lời trôi chảy, chứ không có cơ chế nào bảo đảm đúng sự thật." },
      { t: "AI chẩn đoán bệnh chính xác hơn bác sĩ nên có thể để AI quyết định thay bác sĩ.",
        sai: true,
        vi: "Sai. AI có thể hỗ trợ rất tốt ở một số việc hẹp, nhưng với quyết định ảnh hưởng tới sức khoẻ con người thì **phải có người chịu trách nhiệm**. AI không chịu trách nhiệm được." },
      { t: "Kết quả AI đưa ra là do máy tính tính toán nên khách quan, không mang định kiến của con người.",
        sai: true,
        vi: "Sai. Định kiến **nằm trong dữ liệu** mà con người thu thập, và AI học lại y nguyên định kiến đó. Vỏ ngoài “máy tính tính” chỉ làm định kiến khó nhìn thấy hơn." },
    ],
    chot: "Ba giới hạn cần nhớ để làm câu Đ/S: **phụ thuộc dữ liệu**, **có thể sai một cách thuyết phục**, **không chịu trách nhiệm được**.",
  }]);

  /* ---------------------------------------------- Giao thức, kiến trúc mạng */
  K("C12-03", [{
    de: "Bốn phát biểu về giao thức truyền thông. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Giao thức** là bộ quy tắc để các thiết bị khác hãng, khác hệ điều hành vẫn hiểu nhau.",
        vi: "Đúng — đó là toàn bộ lí do giao thức tồn tại." },
      { t: "Dữ liệu được chia thành các **gói tin** nhỏ để truyền, rồi ghép lại ở nơi nhận.",
        vi: "Đúng. Gói nhỏ đi được nhiều đường khác nhau và mất gói nào chỉ cần gửi lại gói đó." },
      { t: "**TCP** và **IP** là hai tên gọi khác nhau của cùng một giao thức.",
        sai: true,
        vi: "Sai. **IP** lo việc **đánh địa chỉ và tìm đường** cho gói tin; **TCP** lo việc **gói tin tới đủ và đúng thứ tự**, thiếu thì yêu cầu gửi lại. Hai việc khác nhau, ở hai tầng khác nhau." },
      { t: "Các gói tin của cùng một tệp luôn đi theo cùng một đường và tới theo đúng thứ tự đã gửi.",
        sai: true,
        vi: "Sai. Chúng có thể đi **những đường khác nhau** và tới **lộn thứ tự**. Chính vì vậy mới cần TCP đánh số và sắp lại." },
    ],
    chot: "Chia việc theo tầng là ý cốt lõi: **IP tìm đường, TCP bảo đảm đủ và đúng thứ tự**. Đề rất hay hỏi ai làm việc gì.",
  }]);

  /* -------------------------------------------------------------- DNS */
  K("C12-21", [{
    de: "Bốn phát biểu về tên miền và địa chỉ IP. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**DNS** làm việc dịch tên miền thành địa chỉ IP để máy tính kết nối được.",
        vi: "Đúng. Người nhớ chữ, máy dùng số — DNS là chỗ nối hai bên." },
      { t: "Gõ tên miền vào trình duyệt là kết nối trực tiếp tới máy chủ đó, không qua bước trung gian nào.",
        sai: true,
        vi: "Sai. Trước khi kết nối được, trình duyệt phải **hỏi DNS** để lấy địa chỉ IP. Quá trình đó có thể qua vài chặng, chỉ xong rất nhanh nên ta không nhận ra." },
      { t: "Kết quả tra DNS được **nhớ tạm** (cache) nên lần sau vào cùng trang sẽ nhanh hơn.",
        vi: "Đúng, và đây là lí do lần đầu vào một trang lạ hơi chậm hơn." },
      { t: "Một tên miền chỉ trỏ được tới đúng một địa chỉ IP duy nhất.",
        sai: true,
        vi: "Sai. Một tên miền có thể trỏ tới **nhiều IP** để chia tải và để trang vẫn sống khi một máy chủ hỏng. Ngược lại, một IP cũng có thể phục vụ nhiều tên miền." },
    ],
    chot: "Nếu gõ thẳng **địa chỉ IP** thì khỏi cần tra DNS — đó chính là thứ mà cả quá trình DNS đi tìm.",
  }]);

  /* ------------------------------------------------------ Thiết kế LAN */
  K("C12-05", [{
    de: "Bốn phát biểu về mạng LAN của một phòng máy. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Switch** dùng để nối các máy trong cùng một mạng nội bộ với nhau.",
        vi: "Đúng, đó là việc chính của switch." },
      { t: "**Router** dùng để nối mạng nội bộ ra mạng bên ngoài, ví dụ ra Internet.",
        vi: "Đúng — router định tuyến giữa các mạng khác nhau." },
      { t: "Các máy trong cùng một LAN có thể dùng cùng một địa chỉ IP, miễn là tên máy khác nhau.",
        sai: true,
        vi: "Sai. Trong cùng một mạng, **địa chỉ IP phải khác nhau**; trùng IP là cả hai máy đều mất kết nối. Tên máy chỉ để người dễ gọi, không thay được vai trò của IP." },
      { t: "Kết nối bằng **cáp** thường ổn định và nhanh hơn Wi-Fi ở cùng điều kiện.",
        vi: "Đúng, và là lí do phòng máy hay đi cáp thay vì dùng Wi-Fi." },
      { t: "Mạng LAN muốn hoạt động thì bắt buộc phải có Internet.",
        sai: true,
        vi: "Sai. LAN chạy độc lập được: các máy vẫn chia sẻ tệp, dùng chung máy in, chơi mạng nội bộ dù nhà mạng đứt hoàn toàn. Internet chỉ cần khi muốn ra ngoài." },
    ],
    chot: "Phân vai cho chắc: **switch nối trong mạng, router nối ra ngoài mạng**. Và trong một mạng thì IP phải là duy nhất.",
  }]);

  /* ---------------------------------------------------- HTML văn bản */
  K("C12-08", [{
    de: "Đoạn HTML của một trang giới thiệu. Chỉ ra dòng sai.",
    loai: "ma",
    dong: [
      { t: "<h1>Trường THPT Nguyễn Trãi</h1>",
        vi: "Đúng. `<h1>` là tiêu đề cấp một, mỗi trang thường chỉ nên có một cái." },
      { t: "<p>Trường được thành lập năm 1985.</p>",
        vi: "Đúng — `<p>` cho một đoạn văn." },
      { t: "<ul><li>Cơ sở vật chất<li>Đội ngũ giáo viên</ul>",
        vi: "Trông thiếu thẻ đóng `</li>` nhưng HTML **cho phép** bỏ; trình duyệt tự hiểu `<li>` mới là kết thúc `<li>` cũ. Nên dòng này chạy đúng — chỉ là viết đủ thẻ đóng thì dễ đọc hơn." },
      { t: "<a>https://thpt-nguyentrai.edu.vn</a>",
        sai: true,
        vi: "Sai. Thẻ `<a>` phải có thuộc tính **`href`** mới thành liên kết bấm được: `<a href=\"https://...\">Trang trường</a>`. Viết như trên thì chỉ hiện ra chữ, bấm không đi đâu cả." },
    ],
    chot: "Cấu tạo một liên kết: **`href` là nơi đến, phần giữa hai thẻ là chữ người đọc thấy**. Thiếu `href` thì không còn là liên kết.",
  }]);

  /* --------------------------------------------------- HTML ảnh và bảng */
  K("C12-09", [{
    de: "Đoạn HTML chèn ảnh và tạo bảng. Có **hai** dòng sai.",
    loai: "ma",
    dong: [
      { t: "<img src=\"anh/san-truong.jpg\" alt=\"Sân trường giờ ra chơi\">",
        vi: "Đúng, và viết tốt: có `alt` nên ảnh lỗi vẫn hiểu được nội dung, và người khiếm thị nghe được." },
      { t: "<img>anh/logo.png</img>",
        sai: true,
        vi: "Sai. `<img>` là thẻ **rỗng**: không có thẻ đóng, và đường dẫn ảnh phải nằm trong thuộc tính `src`. Viết đúng là `<img src=\"anh/logo.png\" alt=\"Logo trường\">`." },
      { t: "<table><tr><th>Lớp</th><th>Số HS</th></tr>",
        vi: "Đúng. `<tr>` là một hàng, `<th>` là ô tiêu đề (chữ đậm, căn giữa)." },
      { t: "<table><td>12A</td><td>42</td></table>",
        sai: true,
        vi: "Sai: `<td>` phải nằm **trong một `<tr>`**. Bảng có ba tầng bắt buộc: `<table>` → `<tr>` → `<td>`. Thiếu tầng `<tr>` thì các ô không biết thuộc hàng nào." },
    ],
    chot: "Hai điều hay bị hỏi: **`<img>` không có thẻ đóng**, và **bảng luôn theo thứ tự `table` → `tr` → `td`**.",
  }]);

  /* --------------------------------------------------------- CSS hộp */
  K("C12-11", [{
    de: "Bốn phát biểu về mô hình hộp CSS. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Từ trong ra ngoài, mô hình hộp gồm: nội dung → `padding` → `border` → `margin`.",
        vi: "Đúng, đúng thứ tự này. Đề rất hay hỏi trật tự bốn lớp." },
      { t: "`padding` là khoảng cách **bên trong**, giữa nội dung và đường viền.",
        vi: "Đúng." },
      { t: "`margin` là khoảng cách bên trong, còn `padding` là khoảng cách bên ngoài đường viền.",
        sai: true,
        vi: "Ngược. **`padding` ở trong**, **`margin` ở ngoài**. Cách nhớ: padding là lớp đệm bên trong hộp quà, margin là khoảng trống giữa hộp này với hộp bên cạnh." },
      { t: "Màu nền `background` của một khối phủ lên cả phần `padding`, nhưng không phủ phần `margin`.",
        vi: "Đúng, và là cách kiểm nhanh xem mình đang đặt padding hay margin: thêm nền màu rồi xem chỗ nào được tô." },
      { t: "Đặt `width: 200px` là khối luôn rộng đúng 200px trên màn hình, dù padding bao nhiêu.",
        sai: true,
        vi: "Sai theo mặc định: `width` chỉ tính **phần nội dung**, nên padding và border cộng thêm vào làm khối rộng hơn 200px. Muốn `width` tính cả padding và border thì phải đặt `box-sizing: border-box`." },
    ],
    chot: "Nhớ hai chữ: **padding trong, margin ngoài**. Và mặc định `width` chỉ đo phần nội dung, không đo cả hộp.",
  }]);

  /* --------------------------------------------- Bộ chọn và ưu tiên CSS */
  K("C12-25", [{
    de: "Bốn phát biểu về bộ chọn và luật ưu tiên CSS. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "`#tieu-de` chọn phần tử có `id` bằng `tieu-de`; `.nhan` chọn mọi phần tử có `class` bằng `nhan`.",
        vi: "Đúng: dấu `#` cho id, dấu `.` cho class." },
      { t: "Hai quy tắc cùng độ ưu tiên thì quy tắc **viết sau** thắng.",
        vi: "Đúng. Chỉ khi ưu tiên bằng nhau thì thứ tự mới quyết định." },
      { t: "Bộ chọn theo `class` có độ ưu tiên **cao hơn** bộ chọn theo `id`.",
        sai: true,
        vi: "Ngược. Thứ tự ưu tiên từ thấp lên cao là **tên thẻ → class → id → style viết trực tiếp trong thẻ**. `id` mạnh hơn `class`." },
      { t: "Một phần tử chỉ được mang **một** class duy nhất.",
        sai: true,
        vi: "Sai. Viết `class=\"the nhan lon\"` là mang ba class cùng lúc, và nhận kiểu dáng của cả ba. Đây là cách làm việc bình thường trong CSS." },
    ],
    chot: "Bảng ưu tiên cần nhớ: **thẻ < class < id < style trong thẻ**. Ngang nhau thì cái viết sau thắng.",
  }]);

  /* ---------------------------------------------------------- Học máy */
  K("C12-15", [{
    de: "Bốn phát biểu về học máy. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Học máy là để máy **tự tìm quy luật từ dữ liệu**, thay vì người viết sẵn mọi quy tắc.",
        vi: "Đúng — đây là định nghĩa cốt lõi." },
      { t: "Dữ liệu huấn luyện càng nhiều và càng đại diện cho thực tế thì mô hình càng đáng tin.",
        vi: "Đúng, và chữ **đại diện** quan trọng không kém chữ nhiều." },
      { t: "Mô hình học máy đạt độ chính xác 100% trên dữ liệu huấn luyện thì chắc chắn dự đoán tốt với dữ liệu mới.",
        sai: true,
        vi: "Sai, và đây là cái bẫy tên là **học tủ (overfitting)**: mô hình học thuộc luôn cả những chi tiết vụn của dữ liệu cũ, nên gặp dữ liệu mới thì trật. Phải đánh giá trên **dữ liệu chưa từng thấy**." },
      { t: "Học máy không cần dữ liệu, chỉ cần thuật toán đủ tốt là máy tự học được.",
        sai: true,
        vi: "Sai. **Dữ liệu là nguyên liệu bắt buộc** của học máy — không có dữ liệu thì không có gì để tìm quy luật từ đó." },
    ],
    chot: "Hai chữ phải nhớ khi làm câu Đ/S về học máy: **dữ liệu** (không có thì không học được) và **học tủ** (giỏi bài cũ không có nghĩa là giỏi bài mới).",
  }]);

  /* ------------------------------- Dữ liệu có nhãn, không nhãn, phân cụm */
  K("C12-27", [{
    de: "Bốn phát biểu về dữ liệu có nhãn và bài toán phân cụm. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Dữ liệu có nhãn** là dữ liệu đã kèm câu trả lời đúng, ví dụ ảnh kèm chữ “mèo”.",
        vi: "Đúng. Nhãn chính là đáp án để mô hình đối chiếu khi học." },
      { t: "**Phân loại** cần dữ liệu có nhãn; **phân cụm** làm việc trên dữ liệu **không nhãn**.",
        vi: "Đúng — đây là điểm phân biệt chuẩn giữa hai bài toán." },
      { t: "Phân cụm tự đặt được tên có ý nghĩa cho từng nhóm nó tìm ra.",
        sai: true,
        vi: "Sai. Phân cụm chỉ nói “những mẫu này giống nhau, xếp thành nhóm 1, nhóm 2…”. Nhóm đó **nghĩa là gì thì con người phải đặt tên và giải thích**." },
      { t: "Gán nhãn cho dữ liệu là việc dễ và nhanh, nên dữ liệu có nhãn luôn dồi dào.",
        sai: true,
        vi: "Sai. Gán nhãn thường phải làm **thủ công**, tốn nhiều công và cần người có chuyên môn (ví dụ bác sĩ đọc ảnh X-quang). Đó là lí do dữ liệu không nhãn thì đầy mà dữ liệu có nhãn thì quý." },
    ],
    chot: "Câu hỏi để nhận dạng bài toán: **“dữ liệu đã có đáp án sẵn chưa?”**. Có rồi → phân loại. Chưa có → phân cụm.",
  }]);

  /* ----------------------------------------------------- Trực quan hoá */
  K("C12-18", [{
    de: "Bốn phát biểu về trực quan hoá dữ liệu. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Biểu đồ **cột** phù hợp để so sánh giá trị giữa các nhóm; biểu đồ **đường** phù hợp để xem thay đổi theo thời gian.",
        vi: "Đúng, đây là cặp lựa chọn cơ bản nhất." },
      { t: "Biểu đồ **hình tròn** dùng để thể hiện **tỉ lệ các phần trong một tổng thể**.",
        vi: "Đúng, và chỉ nên dùng khi các phần cộng lại đúng bằng 100%." },
      { t: "Biểu đồ nào nhiều màu và nhiều hiệu ứng ba chiều thì truyền đạt tốt hơn.",
        sai: true,
        vi: "Sai. Hiệu ứng ba chiều **làm sai lệch** cảm nhận về độ lớn (phần phía trước trông to hơn thực tế), và màu vô nghĩa thì gây rối. Biểu đồ tốt là biểu đồ đọc ra kết luận nhanh nhất." },
      { t: "Trục dọc của biểu đồ cột **không bắt đầu từ 0** cũng không sao, vì số liệu vẫn đúng.",
        sai: true,
        vi: "Sai về mặt trung thực. Cắt trục làm chênh lệch nhỏ **trông như rất lớn** — số liệu đúng nhưng người xem hiểu sai. Đây là mẹo gây nhầm lẫn hay bị dùng trong quảng cáo." },
    ],
    chot: "Mục đích của trực quan hoá là **giúp hiểu đúng và nhanh**, không phải làm cho đẹp. Chọn dạng biểu đồ theo câu hỏi mình muốn trả lời.",
  }]);

  /* ------------------------------------------------------- Dữ liệu lớn */
  K("C12-20", [{
    de: "Bốn phát biểu về dữ liệu lớn (Big Data). Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Dữ liệu lớn thường được mô tả bằng mấy chữ V: khối lượng lớn, tốc độ sinh ra nhanh, và **đa dạng về dạng thức**.",
        vi: "Đúng: volume, velocity, variety — và nhiều tài liệu thêm veracity (độ tin cậy), value (giá trị)." },
      { t: "Một tệp nặng vài GB thì đã đủ gọi là dữ liệu lớn.",
        sai: true,
        vi: "Sai. Vài GB thì một máy tính cá nhân xử lí được bình thường. Dữ liệu lớn là khi **cách làm thông thường không còn dùng được nữa**, phải chia việc ra nhiều máy — chứ không phải một cột mốc dung lượng cố định." },
      { t: "Dữ liệu lớn cần **nhiều máy tính xử lí song song**, không chỉ cần một máy mạnh hơn.",
        vi: "Đúng, và là đặc điểm kĩ thuật cốt lõi của lĩnh vực này." },
      { t: "Càng thu thập nhiều dữ liệu về người dùng càng tốt, vì dữ liệu nào rồi cũng có ích.",
        sai: true,
        vi: "Sai, cả về kĩ thuật và về pháp lí. Dữ liệu vô ích chỉ làm tốn chỗ và gây nhiễu; còn thu thập dữ liệu cá nhân thì bị **luật bảo vệ dữ liệu cá nhân** ràng buộc — phải có mục đích rõ và có sự đồng ý." },
    ],
    chot: "Định nghĩa dùng được: dữ liệu lớn là khi dữ liệu **vượt quá khả năng xử lí của cách làm thông thường**, không phải khi nó đạt tới một số GB nào đó.",
  }]);
})();
