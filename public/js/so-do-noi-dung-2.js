/* ============================================================================
 *  NỘI DUNG SƠ ĐỒ — ĐỢT 2: nốt lớp 11 và toàn bộ nhánh TIN HỌC ỨNG DỤNG
 *
 *  Nạp SAU js/so-do.js. Xem quy ước dạng dữ liệu ở đầu js/so-do-noi-dung.js.
 *
 *  Đợt một cố ý chỉ làm nhánh Khoa học máy tính, nên 22 bài U11/U12 trắng trơn
 *  không có gì trực quan. Học sinh chọn nhánh ứng dụng thì vẫn phải thi, mà nhánh
 *  này lại nhiều thao tác trên phần mềm — đúng loại nội dung mà một sơ đồ giúp
 *  được nhiều nhất: nói rõ thứ tự làm và cái gì nằm trong cái gì.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SoDo) return;
  var G = window.SoDo.dangKy;

  /* ============================================ LỚP 11 — phần còn thiếu */

  G("C11-02", {
    kieu: "cay",
    ten: "Phần mềm chia làm hai loại lớn",
    mo: "Phân biệt theo câu hỏi: **phần mềm này phục vụ máy, hay phục vụ người dùng?**",
    goc: { t: "Phần mềm", p: "tập các lệnh cho máy tính thực hiện một công việc" },
    muc: [
      { t: "Phần mềm hệ thống", p: "hệ điều hành, trình điều khiển, tiện ích hệ thống — **phục vụ máy hoạt động**" },
      { t: "Phần mềm ứng dụng", p: "Word, trình duyệt, game, phần mềm chỉnh ảnh — **phục vụ công việc của người**" },
    ],
    ghi: "Trình diệt virus và phần mềm dọn ổ đĩa xếp vào **tiện ích hệ thống**, không phải ứng dụng — chúng chăm cho máy, không làm việc thay người dùng.",
  });

  G("C11-21", {
    kieu: "vong", mau: "success",
    ten: "Bốn việc chăm máy nên làm định kì",
    mo: "Máy chậm dần **không** phải vì “máy cũ” mà thường vì bốn việc này bị bỏ.",
    muc: [
      { t: "Cập nhật", p: "hệ điều hành và phần mềm — vá lỗ hổng" },
      { t: "Dọn dẹp", p: "gỡ phần mềm không dùng, xoá tệp tạm" },
      { t: "Sao lưu", p: "ra thiết bị khác, không cùng ổ" },
      { t: "Kiểm khởi động", p: "tắt phần mềm tự chạy không cần thiết" },
    ],
    quayLai: "rồi lặp lại theo lịch — mỗi tháng một lần là đủ với máy học tập",
    ghi: "Phần mềm **tự chạy khi bật máy** là nguyên nhân số một làm máy khởi động chậm. Cập nhật là việc quan trọng nhất về an toàn: phần lớn vụ nhiễm mã độc lợi dụng lỗ hổng **đã có bản vá**.",
  });

  G("C11-22", {
    kieu: "doi",
    ten: "Kết nối có dây và không dây",
    mo: "Chọn kiểu nào là chọn giữa **ổn định** và **tiện lợi**.",
    a: { t: "Có dây", y: ["USB-A, **USB-C**, HDMI, jack 3.5mm, LAN (RJ45)", "Nhanh và ổn định hơn", "Vừa truyền dữ liệu vừa **cấp điện** (USB-C)", "Phải cắm đúng cổng, đúng chiều"] },
    b: { t: "Không dây", y: ["**Wi-Fi** (mạng), **Bluetooth** (tầm gần), NFC (chạm)", "Tiện, không vướng dây", "Chậm hơn, dễ bị nhiễu", "Phải ghép đôi và cấp quyền"] },
    hoi: "**Trình điều khiển (driver)** là phần mềm giúp hệ điều hành hiểu một thiết bị cụ thể. Cắm thiết bị vào mà máy không nhận thì thường là **thiếu hoặc lỗi driver**, chứ không phải hỏng cổng.",
  });

  G("C11-05", {
    kieu: "luong", mau: "info",
    ten: "Năm bước khai thác một thông tin trên mạng",
    mo: "Bước hay bị bỏ nhất là bước **3** — tìm ra là tin luôn.",
    muc: [
      { t: "Xác định nhu cầu", p: "mình cần biết chính xác điều gì?" },
      { t: "Tìm kiếm", p: "chọn từ khoá, dùng dấu ngoặc kép cho cụm chính xác" },
      { t: "Đánh giá nguồn", p: "ai viết? khi nào? có dẫn nguồn không?" },
      { t: "Đối chiếu", p: "tìm **ít nhất hai** nguồn độc lập nói giống nhau" },
      { t: "Sử dụng", p: "diễn đạt lại bằng lời mình và **ghi nguồn**" },
    ],
    ghi: "Dấu hiệu nguồn đáng ngờ: không có tên tác giả, không có ngày, tiêu đề gây sốc, và **không dẫn được nguồn gốc của số liệu**. Kết quả xếp đầu trang tìm kiếm không có nghĩa là đáng tin nhất.",
  });

  G("C11-23", {
    kieu: "tang", mau: "info",
    ten: "Các phần của một thư điện tử",
    mo: "Ba ô người nhận có ba nghĩa khác nhau — đây là chỗ hay dùng sai nhất.",
    tren: "phần đầu thư", duoi: "phần cuối",
    muc: [
      { t: "To (Đến)", p: "người **phải** đọc và trả lời" },
      { t: "Cc (Đồng kính gửi)", p: "người cần **biết**, mọi người thấy tên nhau" },
      { t: "Bcc (Ẩn)", p: "người cần biết nhưng **các bên không thấy tên nhau**" },
      { t: "Tiêu đề", p: "nói đúng nội dung — quyết định thư có được mở hay không" },
      { t: "Nội dung", p: "chào, việc cần, đề nghị cụ thể, cảm ơn" },
      { t: "Tệp đính kèm", p: "đặt tên tệp rõ ràng, kiểm dung lượng" },
    ],
    ghi: "Gửi thư cho nhiều người **không quen nhau** thì phải dùng **Bcc** — để ở Cc là làm lộ địa chỉ của tất cả cho tất cả. Và luôn kiểm ô người nhận trước khi bấm Gửi, vì phần lớn thư gửi sai là do gõ tên vào ô To mà máy tự điền tên khác.",
  });

  G("C11-24", {
    kieu: "tang", mau: "info",
    ten: "Các mức quyền khi chia sẻ tài liệu trên đám mây",
    mo: "Nguyên tắc: **cho quyền thấp nhất mà người ta vẫn làm được việc**.",
    tren: "quyền cao nhất", duoi: "quyền thấp nhất",
    muc: [
      { t: "Chủ sở hữu", p: "đổi quyền của người khác, xoá được cả tài liệu" },
      { t: "Người chỉnh sửa", p: "sửa nội dung, thường mời thêm được người khác" },
      { t: "Người nhận xét", p: "chỉ ghi bình luận, không sửa được nội dung" },
      { t: "Người xem", p: "chỉ đọc" },
    ],
    ghi: "Chia sẻ bằng liên kết **“bất kì ai có liên kết”** nghĩa là ai nhận được liên kết cũng vào được, kể cả người liên kết bị chuyển tiếp tới. Với tài liệu có thông tin cá nhân thì phải mời **theo từng địa chỉ**.",
  });

  G("C11-25", {
    kieu: "luong", mau: "danger",
    ten: "Một vụ lừa trực tuyến diễn ra theo đúng năm bước này",
    mo: "Nhận ra bước **2** là chặn được cả chuỗi — đó là chỗ duy nhất kẻ lừa cần ở em.",
    muc: [
      { t: "Mồi", p: "“trúng thưởng”, “đơn hàng lỗi”, “tài khoản sắp khoá”" },
      { t: "Gấp gáp", p: "“trong 24 giờ”, “xác minh ngay” — để em không kịp nghĩ" },
      { t: "Liên kết giả", p: "trang giống thật, tên miền lệch một chữ" },
      { t: "Em tự nhập", p: "mật khẩu, mã OTP, số thẻ" },
      { t: "Mất tài khoản", p: "kẻ lừa đổi mật khẩu, dùng để lừa bạn bè em" },
    ],
    ghi: "Không phần mềm nào chặn được chuỗi này, vì **chính người dùng tự nhập** thông tin. Quy tắc cứng: **không bao giờ bấm liên kết trong tin nhắn để đăng nhập** — tự mở ứng dụng hoặc tự gõ địa chỉ. Và **không đọc mã OTP cho ai**, kể cả người nói là nhân viên ngân hàng.",
  });

  G("C11-26", {
    kieu: "luong", mau: "info",
    ten: "Tách một quyển sổ ghi tay thành các bảng liên kết",
    mo: "Dấu hiệu phải tách: **cùng một thông tin bị viết lại nhiều lần**.",
    muc: [
      { t: "Một bảng to", p: "mỗi lần mượn sách lại ghi lại cả tên và lớp" },
      { t: "Tìm phần lặp", p: "tên học sinh, tên sách lặp ở hàng chục dòng" },
      { t: "Tách bảng riêng", p: "HOC_SINH, SACH — mỗi thứ ghi **một lần**" },
      { t: "Nối bằng khoá", p: "bảng MUON giữ mã học sinh và mã sách" },
    ],
    ghi: "Lợi ích thấy ngay: đổi lớp của một bạn thì sửa **một ô**, không phải tìm hết mọi dòng bạn ấy từng mượn. Đó chính là ý nghĩa của chữ **nhất quán** trong cơ sở dữ liệu.",
  });

  G("C11-27", {
    kieu: "luong", mau: "info",
    ten: "Từ bảng trống tới con số thống kê bằng SQL",
    mo: "Bốn nhóm câu lệnh, làm theo đúng thứ tự này.",
    muc: [
      { t: "CREATE TABLE", p: "đặt tên cột và **kiểu dữ liệu**" },
      { t: "Ràng buộc", p: "`PRIMARY KEY`, `NOT NULL`, `CHECK`" },
      { t: "INSERT", p: "nạp dữ liệu vào" },
      { t: "GROUP BY", p: "gom nhóm rồi `COUNT`, `AVG`, `MAX`" },
    ],
    ghi: "Đặt ràng buộc **trước khi nạp dữ liệu**, đừng để sau: dữ liệu đã vào rồi mới thêm `CHECK (diem BETWEEN 0 AND 10)` thì những bản ghi sai đã nằm trong bảng. Và `WHERE` lọc **hàng** trước khi gom nhóm, còn `HAVING` lọc **nhóm** sau khi đã gom.",
  });

  G("C11-29", {
    kieu: "doi", mau: "success",
    ten: "Sắp xếp chọn dần và chèn dần",
    mo: "Cả hai đều là O(n²), nhưng **cách làm việc khác nhau hẳn**.",
    a: { t: "Chọn dần (selection)", y: ["Mỗi lượt **tìm phần tử nhỏ nhất** trong phần còn lại", "Đưa nó về đầu phần chưa sắp", "Số lần **đổi chỗ** rất ít — đúng n−1 lần", "Dãy đã sắp sẵn cũng vẫn quét đủ"] },
    b: { t: "Chèn dần (insertion)", y: ["Lấy từng phần tử, **lùi về** tìm đúng chỗ chèn vào", "Phần bên trái luôn đã sắp xong", "Nhiều phép **dịch chỗ** nhưng ít so sánh nếu dãy gần sắp", "Dãy gần sắp sẵn thì **rất nhanh**"] },
    hoi: "Vì vậy: dữ liệu **gần như đã sắp** thì chèn dần thắng rõ; dữ liệu trên thiết bị mà **ghi rất đắt** thì chọn dần thắng vì đổi chỗ ít nhất.",
  });

  G("C11-17", {
    kieu: "cay", mau: "success",
    ten: "Chia một bài toán lớn thành các hàm",
    mo: "Ví dụ chương trình quản lí điểm. Mỗi hàm làm **một việc** và **kiểm thử riêng được**.",
    goc: { t: "Chương trình chính", p: "chỉ gọi các hàm theo thứ tự, không tự tính gì" },
    muc: [
      { t: "`doc_du_lieu()`", p: "nhập điểm, trả về danh sách" },
      { t: "`tinh_trung_binh(ds)`", p: "chỉ tính, không in gì" },
      { t: "`xep_loai(diem)`", p: "trả về nhãn Giỏi / Khá / …" },
      { t: "`in_bao_cao(ds)`", p: "chỉ lo hiển thị" },
    ],
    ghi: "Dấu hiệu chia đúng: gọi tên hàm lên là **biết ngay nó làm gì**, và sửa cách xếp loại thì chỉ phải sửa **một hàm**. Hàm nào vừa tính vừa in vừa nhập thì nên tách tiếp.",
  });

  G("C11-30", {
    kieu: "cay", mau: "success",
    ten: "Tổ chức chương trình lớn thành mô đun",
    mo: "Mô đun trong Python đơn giản là **một tệp `.py`** chứa các hàm cùng nhóm việc.",
    goc: { t: "`main.py`", p: "tệp chạy chính, `import` các mô đun rồi ghép việc lại" },
    muc: [
      { t: "`nhap_lieu.py`", p: "mọi việc đọc dữ liệu vào" },
      { t: "`xu_ly.py`", p: "mọi phép tính, không dính gì tới màn hình" },
      { t: "`bao_cao.py`", p: "mọi việc hiển thị và xuất tệp" },
    ],
    ghi: "Lợi ích thật: mỗi người trong nhóm sửa **một tệp khác nhau** nên không đè lên nhau, và `xu_ly.py` dùng lại được cho chương trình khác vì nó không dính vào cách nhập hay cách in.",
  });

  G("C11-31", {
    kieu: "cay", mau: "success",
    ten: "Ba nguồn thư viện của một lập trình viên Python",
    mo: "Đều dùng bằng lệnh `import`, nhưng **lấy ở đâu về** thì khác nhau.",
    goc: { t: "`import`", p: "nạp mã người khác (hoặc chính mình) đã viết sẵn để dùng lại" },
    muc: [
      { t: "Có sẵn trong Python", p: "`math`, `random`, `datetime` — cài Python là có" },
      { t: "Cài thêm", p: "`pip install ...` — phải tải về từ Internet" },
      { t: "Tự viết", p: "tệp `.py` của mình đặt cùng thư mục" },
    ],
    ghi: "Hai cách viết khác nhau: `import math` rồi gọi `math.sqrt(9)`, còn `from math import sqrt` thì gọi thẳng `sqrt(9)`. Cách thứ hai gọn hơn nhưng dễ **trùng tên** với hàm mình tự viết.",
  });

  G("C11-18", {
    kieu: "cay", mau: "warning",
    ten: "Ba loại lỗi và cách chúng lộ ra",
    mo: "Loại thứ ba khó nhất **vì máy không báo gì cả**.",
    goc: { t: "Lỗi trong chương trình", p: "nhận đúng loại lỗi thì biết ngay phải tìm ở đâu" },
    muc: [
      { t: "Lỗi cú pháp", p: "chương trình **không chạy được**; máy chỉ đúng dòng — dễ nhất" },
      { t: "Lỗi khi chạy", p: "chạy giữa đường thì **dừng**: chia cho 0, sai chỉ số, sai kiểu" },
      { t: "Lỗi lôgic", p: "chạy trơn tru, **kết quả sai** — máy không báo gì" },
    ],
    ghi: "Cách duy nhất bắt được lỗi lôgic: chạy với dữ liệu **mình đã biết đáp án**, và thử cả trường hợp đặc biệt — **dãy rỗng, một phần tử, toàn số âm, số 0, giá trị lớn nhất cho phép**.",
  });

  G("C11-33", {
    kieu: "cay", mau: "warning",
    ten: "Bốn kĩ thuật thiết kế thuật toán",
    mo: "Nhận ra dạng bài là biết nên thử kĩ thuật nào trước.",
    goc: { t: "Thiết kế thuật toán", p: "chọn cách tiếp cận trước khi viết dòng mã nào" },
    muc: [
      { t: "Chia để trị", p: "chia nhỏ, giải từng phần, ghép lại — tìm nhị phân, sắp xếp trộn" },
      { t: "Vét cạn", p: "thử **mọi** khả năng — chắc chắn đúng nhưng thường rất chậm" },
      { t: "Tham lam", p: "mỗi bước chọn cái tốt nhất **lúc đó** — nhanh, nhưng không luôn tối ưu" },
      { t: "Quay lui", p: "thử một hướng, tắc thì lùi lại thử hướng khác — xếp hậu, giải sudoku" },
    ],
    ghi: "Bẫy hay ra trong đề: **tham lam không phải lúc nào cũng cho kết quả tốt nhất**. Nó chỉ nhìn một bước trước mắt, nên có bài chọn đúng từng bước mà tổng thể lại tệ.",
  });

  G("C11-20", {
    kieu: "cay",
    ten: "Nhóm nghề dịch vụ và quản trị trong tin học",
    mo: "Nhóm này **không viết chương trình** mà làm cho hệ thống chạy được và chạy an toàn.",
    goc: { t: "Nghề tin học", p: "chia thành nhóm phát triển và nhóm dịch vụ, quản trị" },
    muc: [
      { t: "Quản trị mạng", p: "thiết kế, vận hành, giám sát đường truyền" },
      { t: "Quản trị hệ thống", p: "cài đặt, cập nhật, sao lưu máy chủ" },
      { t: "Quản trị CSDL", p: "bảo đảm dữ liệu đúng, nhanh, không mất" },
      { t: "Hỗ trợ kĩ thuật", p: "xử lí sự cố cho người dùng" },
    ],
    ghi: "Điểm chung của cả nhóm: cần **kiến thức hệ thống và mạng** cộng với **kĩ năng giao tiếp**, vì phần lớn thời gian là làm việc với người dùng và với sự cố, không phải với mã nguồn.",
  });

  /* ================================ TIN HỌC ỨNG DỤNG — LỚP 11 */

  G("U11-01", {
    kieu: "cay", mau: "info",
    ten: "Những gì có trong một tệp cơ sở dữ liệu",
    mo: "Mở phần mềm quản trị CSDL ra là thấy bốn nhóm đối tượng này.",
    goc: { t: "Tệp cơ sở dữ liệu", p: "một tệp chứa cả dữ liệu và các công cụ làm việc với nó" },
    muc: [
      { t: "Bảng (Table)", p: "**nơi duy nhất** dữ liệu được lưu thật" },
      { t: "Truy vấn (Query)", p: "câu hỏi đặt ra cho dữ liệu — không lưu dữ liệu" },
      { t: "Biểu mẫu (Form)", p: "màn hình nhập liệu cho người dùng" },
      { t: "Báo cáo (Report)", p: "bản in, trình bày dữ liệu để đọc" },
    ],
    ghi: "Chỉ **bảng** chứa dữ liệu. Xoá một truy vấn hay một báo cáo thì **dữ liệu vẫn còn nguyên** — đây là câu Đúng/Sai rất hay ra. Truy vấn chỉ là câu hỏi được lưu lại, mỗi lần mở là nó hỏi lại bảng.",
  });

  G("U11-02", {
    kieu: "luong", mau: "info",
    ten: "Bốn bước thiết kế cấu trúc một bảng",
    mo: "Làm đủ bốn bước **trước khi nhập dòng dữ liệu nào** — sửa cấu trúc sau khi có dữ liệu thì rất đau.",
    muc: [
      { t: "Xác định đối tượng", p: "bảng này lưu về cái gì? HOC_SINH, SACH…" },
      { t: "Liệt kê thuộc tính", p: "mỗi thuộc tính **một cột riêng**" },
      { t: "Chọn kiểu dữ liệu", p: "văn bản, số, ngày, đúng/sai" },
      { t: "Chọn khoá chính", p: "cột xác định **duy nhất** từng bản ghi" },
    ],
    ghi: "Hai lỗi thiết kế hay gặp: gộp **họ và tên** vào một cột rồi sau không sắp xếp được theo tên; và lưu **số điện thoại kiểu số** — số 0 ở đầu bị mất, nên phải để kiểu **văn bản**. Nguyên tắc: cái nào không đem ra tính toán thì đừng để kiểu số.",
  });

  G("U11-03", {
    kieu: "luong", mau: "info",
    ten: "Trình tự tạo lập một cơ sở dữ liệu",
    mo: "Bước **4** hay bị bỏ, và bỏ nó thì lỗi thiết kế chỉ lộ ra khi đã nhập cả trăm bản ghi.",
    muc: [
      { t: "Tạo tệp CSDL", p: "đặt tên, chọn nơi lưu" },
      { t: "Tạo bảng", p: "khai tên cột và kiểu dữ liệu" },
      { t: "Đặt khoá chính", p: "và các ràng buộc cần thiết" },
      { t: "Nhập thử vài bản ghi", p: "kiểm cấu trúc có chịu được dữ liệu thật không" },
    ],
    ghi: "Nhập thử phải gồm cả **trường hợp khó**: tên có dấu, tên rất dài, ngày sinh 29/02, số điện thoại bắt đầu bằng 0. Đó là lúc phát hiện cột đặt kiểu sai hoặc để độ dài quá ngắn.",
  });

  G("U11-04", {
    kieu: "doi", mau: "info",
    ten: "Khoá chính và khoá ngoài",
    mo: "Hai cái tên na ná nhau nhưng làm hai việc khác hẳn.",
    a: { t: "Khoá chính", y: ["Nằm ở **bảng của chính nó**", "Xác định **duy nhất** từng bản ghi", "**Không được trống**, không được trùng", "Mỗi bảng chỉ có **một** khoá chính"] },
    b: { t: "Khoá ngoài", y: ["Là khoá chính của bảng **khác** đặt sang đây", "Dùng để **nối hai bảng** lại", "**Được** trùng — một học sinh mượn nhiều lần", "Một bảng có **nhiều** khoá ngoài được"] },
    hoi: "Ví dụ: bảng `MUON` có khoá ngoài `ma_hs` trỏ tới bảng `HOC_SINH`. Nhập một `ma_hs` **không tồn tại** trong `HOC_SINH` thì bị chặn — đó là **toàn vẹn tham chiếu**.",
  });

  G("U11-05", {
    kieu: "luong", mau: "danger",
    ten: "Quy trình sửa dữ liệu an toàn",
    mo: "Ba việc thêm / sửa / xoá đều **không có nút hoàn tác** trong cơ sở dữ liệu.",
    muc: [
      { t: "Tìm bản ghi", p: "lọc hoặc tìm theo khoá chính" },
      { t: "Xác nhận đúng người", p: "đọc lại 2–3 trường khác để chắc" },
      { t: "Sửa", p: "sửa **một** bản ghi một lúc" },
      { t: "Lưu và kiểm lại", p: "mở lại xem giá trị đã đúng chưa" },
    ],
    ghi: "Xoá là việc nguy hiểm nhất, và xoá một bản ghi **có bản ghi khác tham chiếu tới** thì hoặc bị chặn, hoặc kéo theo xoá dây chuyền — phải biết bảng của mình đang đặt kiểu nào. Với dữ liệu thật, **sao lưu trước khi xoá hàng loạt**.",
  });

  G("U11-06", {
    kieu: "tang", mau: "info",
    ten: "Các loại ràng buộc toàn vẹn",
    mo: "Ràng buộc là **luật chặn dữ liệu sai ngay lúc nhập**, thay vì phát hiện muộn.",
    tren: "chặt nhất", duoi: "cơ bản",
    muc: [
      { t: "Khoá ngoài", p: "chỉ nhận giá trị **đã có** ở bảng kia — toàn vẹn tham chiếu" },
      { t: "Khoá chính", p: "duy nhất và không trống" },
      { t: "Duy nhất (Unique)", p: "không trùng, nhưng được để trống" },
      { t: "Miền giá trị (Check)", p: "điểm từ 0 đến 10, ngày sinh không ở tương lai" },
      { t: "Không trống (Not Null)", p: "bắt buộc phải nhập" },
      { t: "Kiểu dữ liệu", p: "cột số thì không nhập chữ vào được" },
    ],
    ghi: "Ràng buộc do **người thiết kế khai báo**, không tự có. Không khai thì phần mềm cho nhập điểm 200 hay ngày sinh năm 3000 bình thường — nó chỉ thực thi những luật được giao.",
  });

  G("U11-07", {
    kieu: "luong", mau: "info",
    ten: "Truy vấn lấy dữ liệu từ nhiều bảng",
    mo: "Bước **2** là bước quyết định: nối sai khoá là ra kết quả vô nghĩa mà **vẫn không báo lỗi**.",
    muc: [
      { t: "Chọn các bảng", p: "chỉ lấy bảng thật cần" },
      { t: "Nối theo khoá", p: "khoá ngoài của bảng này = khoá chính của bảng kia" },
      { t: "Chọn trường", p: "chỉ những cột cần xem" },
      { t: "Đặt điều kiện", p: "lọc bớt hàng" },
      { t: "Xem kết quả", p: "đếm số dòng — hợp lí chưa?" },
    ],
    ghi: "Cách kiểm nhanh mình nối đúng chưa: **đếm số dòng kết quả**. Quên nối khoá thì phần mềm ghép **mọi** dòng bảng này với **mọi** dòng bảng kia — 50 học sinh và 200 lượt mượn ra 10.000 dòng. Con số phình lên vô lí chính là dấu hiệu.",
  });

  G("U11-08", {
    kieu: "vong", mau: "danger",
    ten: "Vòng sao lưu và phục hồi",
    mo: "Bước **3** là bước phân biệt “có sao lưu” với “sao lưu dùng được”.",
    muc: [
      { t: "Sao lưu định kì", p: "theo lịch, không phải khi nào nhớ thì làm" },
      { t: "Để ở nơi khác", p: "thiết bị khác, tốt nhất là địa điểm khác" },
      { t: "**Thử phục hồi**", p: "phục hồi ra chỗ trống, xem có mở được không" },
      { t: "Ghi lại", p: "sao lưu ngày nào, gồm những gì" },
    ],
    quayLai: "rồi lặp lại theo lịch — bản sao lưu cũ ba tháng thì cứu được rất ít",
    ghi: "Quy tắc **3-2-1** đáng nhớ: giữ **3** bản, trên **2** loại thiết bị, có **1** bản ở nơi khác. Và bản sao lưu **để cùng ổ với dữ liệu gốc thì không tính là sao lưu** — ổ hỏng hoặc mã độc quét cả ổ là mất luôn cả hai.",
  });

  G("U11-09", {
    kieu: "tang", mau: "success",
    ten: "Lớp trong phần mềm chỉnh sửa ảnh",
    mo: "Ảnh cuối cùng là cái ta thấy khi **nhìn từ trên xuống** qua chồng lớp.",
    tren: "trên cùng — thấy trước", duoi: "dưới cùng — bị che",
    muc: [
      { t: "Lớp chữ", p: "tiêu đề, chú thích" },
      { t: "Lớp hiệu ứng", p: "khung, hình vẽ thêm" },
      { t: "Lớp ảnh chính", p: "ảnh đã tách nền" },
      { t: "Lớp nền", p: "màu hoặc ảnh nền" },
    ],
    ghi: "Lợi ích cốt lõi: sửa hoặc xoá **một lớp** thì các lớp khác không việc gì. Vì vậy khi làm phải **giữ tệp gốc nhiều lớp** (`.xcf`, `.psd`) — xuất ra `.jpg` là **gộp hết lớp lại**, sửa tiếp không được nữa.",
  });

  G("U11-10", {
    kieu: "doi", mau: "success",
    ten: "Độ sáng và độ tương phản",
    mo: "Hai thanh trượt hay bị kéo lẫn nhau — chúng làm hai việc khác nhau.",
    a: { t: "Độ sáng (Brightness)", y: ["Kéo **toàn bộ** ảnh sáng lên hoặc tối đi", "Chỗ tối và chỗ sáng dịch **cùng một lượng**", "Tăng nhiều → ảnh bạc màu, mờ đục", "Chữa ảnh chụp thiếu sáng"] },
    b: { t: "Độ tương phản (Contrast)", y: ["Kéo chỗ **sáng sáng thêm**, chỗ **tối tối thêm**", "Khoảng cách sáng–tối giãn ra", "Tăng nhiều → mất chi tiết ở vùng rất sáng và rất tối", "Chữa ảnh trông “phẳng”, thiếu nét"] },
    hoi: "Hai điều nên nhớ khi thao tác: chỉnh trên **lớp riêng** hoặc bản sao để còn lùi lại được, và **mất chi tiết thì không lấy lại được** — kéo quá tay ở vùng cháy sáng là mất vĩnh viễn.",
  });

  G("U11-11", {
    kieu: "luong", mau: "success",
    ten: "Năm bước tách nền một tấm ảnh",
    mo: "Bước **5** là bước phân biệt ảnh tách sạch với ảnh còn viền — mà chỉ thấy khi đặt lên nền khác.",
    muc: [
      { t: "Chọn thô", p: "công cụ chọn theo màu hoặc chọn nhanh" },
      { t: "Tinh chỉnh biên", p: "thêm bớt vùng chọn, làm mềm biên" },
      { t: "Đảo vùng chọn", p: "chọn nền dễ hơn chọn chủ thể, rồi đảo lại" },
      { t: "Xoá nền", p: "xoá trên **lớp riêng**, đừng xoá lớp gốc" },
      { t: "Thử nền khác", p: "đặt lên nền tối và nền sáng để soi viền sót" },
    ],
    ghi: "Chọn theo màu chỉ dễ khi nền **một màu và khác hẳn** chủ thể. Tóc, lông và vật trong suốt thì phải làm mềm biên, không thì ảnh trông như bị cắt bằng kéo.",
  });

  G("U11-12", {
    kieu: "cay", mau: "success",
    ten: "Bốn nhóm công cụ vẽ và thêm chữ",
    mo: "Mọi phần mềm chỉnh ảnh đều có bốn nhóm này, chỉ khác tên gọi.",
    goc: { t: "Thanh công cụ", p: "chọn công cụ trước, rồi mới đặt thông số cho nó" },
    muc: [
      { t: "Vẽ", p: "bút chì (biên cứng), cọ (biên mềm) — chọn cỡ và độ mờ" },
      { t: "Tô", p: "tô một màu, tô chuyển sắc (gradient)" },
      { t: "Chữ", p: "phông, cỡ, màu — thường tự tạo **lớp riêng**" },
      { t: "Xoá và sửa", p: "cục tẩy, dấu nhân bản, làm mờ" },
    ],
    ghi: "Lớp chữ do phần mềm tạo ra là **lớp chữ thật**, còn sửa lại nội dung được. Nhưng khi ảnh đã **gộp lớp** (hoặc xuất ra `.jpg`) thì chữ thành các điểm ảnh — muốn đổi một chữ cũng phải làm lại.",
  });

  G("U11-13", {
    kieu: "luong", mau: "warning",
    ten: "Làm một ảnh động từ nhiều khung hình",
    mo: "Ảnh động chỉ là **nhiều ảnh tĩnh chiếu lần lượt đủ nhanh**.",
    muc: [
      { t: "Chuẩn bị khung", p: "mỗi khung là **một lớp**, cùng kích thước" },
      { t: "Đặt thứ tự", p: "thứ tự lớp chính là thứ tự chiếu" },
      { t: "Đặt độ trễ", p: "mỗi khung bao nhiêu mili giây" },
      { t: "Xem thử", p: "chạy trước khi xuất" },
      { t: "Xuất GIF", p: "chọn lặp vô hạn hay lặp mấy lần" },
    ],
    ghi: "Độ trễ quyết định độ mượt: **100 ms/khung** ≈ 10 khung mỗi giây, mượt vừa đủ. Càng nhiều khung càng mượt nhưng **tệp càng nặng** — GIF không nén tốt như video, nên ảnh động dài thì nên làm video.",
  });

  G("U11-14", {
    kieu: "tang", mau: "warning",
    ten: "Các rãnh trên dòng thời gian phần mềm làm phim",
    mo: "Cũng là nguyên tắc chồng lớp như chỉnh ảnh, nhưng thêm **trục thời gian** chạy ngang.",
    tren: "rãnh trên — hiện trước", duoi: "rãnh dưới — bị che",
    muc: [
      { t: "Rãnh chữ", p: "tiêu đề, phụ đề" },
      { t: "Rãnh video phụ", p: "logo, hình chèn, ảnh minh hoạ" },
      { t: "Rãnh video chính", p: "các clip nối tiếp nhau" },
      { t: "Rãnh âm thanh", p: "nhạc nền, lời thuyết minh" },
    ],
    ghi: "Hai điều làm người mới hay bối rối: rãnh nằm **trên** thì hiện **đè lên** rãnh dưới; và cắt một clip ở rãnh video **không** tự cắt nhạc ở rãnh âm thanh — mỗi rãnh phải xử lí riêng.",
  });

  G("U11-15", {
    kieu: "luong", mau: "warning",
    ten: "Năm bước biên tập một đoạn phim",
    mo: "Bước **5** không thể lùi lại: xuất xong là ra một tệp phim mới, **tách rời** dự án.",
    muc: [
      { t: "Nhập liệu", p: "đưa clip, ảnh, nhạc vào dự án" },
      { t: "Cắt và sắp", p: "bỏ đoạn thừa, xếp thứ tự trên dòng thời gian" },
      { t: "Chuyển cảnh", p: "mờ dần, trượt — dùng ít thôi" },
      { t: "Âm thanh", p: "nhạc nền nhỏ hơn lời nói, làm mờ đầu cuối" },
      { t: "Xuất phim", p: "chọn định dạng và độ phân giải" },
    ],
    ghi: "Phải phân biệt **tệp dự án** (lưu các lệnh biên tập, còn sửa được, nhưng cần các tệp gốc nằm đúng chỗ) với **tệp phim đã xuất** (chiếu được ở mọi nơi nhưng **không sửa được nữa**). Xoá tệp gốc rồi mở lại dự án là mất clip.",
  });

  /* ================================ TIN HỌC ỨNG DỤNG — LỚP 12 */

  G("U12-01", {
    kieu: "cay",
    ten: "Bốn cách chia sẻ giữa các thiết bị số",
    mo: "Chọn cách nào tuỳ **dung lượng** và **khoảng cách**.",
    goc: { t: "Chia sẻ dữ liệu", p: "đưa tệp từ thiết bị này sang thiết bị khác" },
    muc: [
      { t: "Cáp / USB", p: "nhiều dữ liệu, nhanh và chắc, phải ở cạnh nhau" },
      { t: "Bluetooth", p: "tệp nhỏ, tầm gần, không cần mạng" },
      { t: "Chia sẻ trong LAN", p: "mở thư mục cho máy khác vào, không cần Internet" },
      { t: "Đám mây", p: "ở đâu cũng lấy được, cần Internet" },
    ],
    ghi: "Chia sẻ thư mục trong mạng nội bộ thì phải **đặt quyền**: cho xem hay cho cả sửa. Và nguyên tắc an toàn: **tắt chia sẻ khi xong việc** — thư mục mở suốt trong mạng phòng máy là ai cũng vào được.",
  });

  G("U12-02", {
    kieu: "luong", mau: "success",
    ten: "Chuẩn bị trước khi gõ dòng HTML đầu tiên",
    mo: "Bốn bước này làm trên **giấy** cũng được, và làm rồi thì code nhanh hơn nhiều.",
    muc: [
      { t: "Xác định mục đích", p: "trang này cho ai xem, để làm gì?" },
      { t: "Vẽ sơ đồ trang", p: "có mấy trang, trang nào liên kết tới trang nào" },
      { t: "Chuẩn bị nội dung", p: "chữ, ảnh — thu nhỏ ảnh trước cho nhẹ" },
      { t: "Phác thảo bố cục", p: "header, menu, phần thân, chân trang" },
    ],
    ghi: "Tổ chức thư mục dự án ngay từ đầu: `index.html` ở gốc, ảnh trong thư mục `anh/`, kiểu dáng trong `css/`. Và tên trang chủ **phải là `index.html`** — đó là tên tệp máy chủ tự mở khi có người vào địa chỉ gốc.",
  });

  G("U12-03", {
    kieu: "tang", mau: "success",
    ten: "Bốn khối cấu trúc của một trang web",
    mo: "Gần như mọi trang web đều xếp theo thứ tự này từ trên xuống.",
    tren: "đầu trang", duoi: "chân trang",
    muc: [
      { t: "`<header>`", p: "logo, tên trang, câu giới thiệu ngắn" },
      { t: "`<nav>`", p: "thanh điều hướng — các liên kết tới trang khác" },
      { t: "`<main>`", p: "nội dung riêng của **trang này**" },
      { t: "`<footer>`", p: "liên hệ, bản quyền, liên kết phụ" },
    ],
    ghi: "Dùng đúng các thẻ này thay vì `<div>` khắp nơi có hai lợi ích thật: trình đọc màn hình **nhảy được tới từng khối**, và máy tìm kiếm hiểu đâu là nội dung chính. Nhưng chỉ `<main>` thay đổi giữa các trang — `header`, `nav`, `footer` nên giống nhau ở mọi trang để người xem không bị lạc.",
  });

  G("U12-04", {
    kieu: "cay", mau: "success",
    ten: "Nên đặt gì ở chân trang",
    mo: "Chân trang là nơi người xem tìm khi **không thấy thứ mình cần ở trên**.",
    goc: { t: "`<footer>`", p: "khối cuối cùng, giống nhau ở mọi trang" },
    muc: [
      { t: "Thông tin liên hệ", p: "địa chỉ, điện thoại, thư điện tử" },
      { t: "Bản quyền", p: "© năm và tên chủ trang" },
      { t: "Liên kết phụ", p: "sơ đồ trang, quyền riêng tư" },
      { t: "Mạng xã hội", p: "các kênh chính thức" },
    ],
    ghi: "Phần `<main>` thì chia tiếp bằng `<section>` hoặc `<article>`, mỗi phần mở đầu bằng một tiêu đề `<h2>`. Trật tự tiêu đề phải liền mạch **`h1` → `h2` → `h3`**, đừng nhảy cấp chỉ vì thấy cỡ chữ vừa mắt — muốn đổi cỡ thì dùng CSS.",
  });

  G("U12-05", {
    kieu: "cay", mau: "success",
    ten: "Sơ đồ điều hướng của một trang web nhỏ",
    mo: "Vẽ sơ đồ này ra trước thì viết `href` không bị sai đường dẫn.",
    goc: { t: "`index.html` — trang chủ", p: "mọi trang đều có liên kết quay về đây" },
    muc: [
      { t: "`gioi-thieu.html`", p: "giới thiệu" },
      { t: "`san-pham.html`", p: "nội dung chính" },
      { t: "`lien-he.html`", p: "biểu mẫu liên hệ" },
    ],
    ghi: "Thanh menu phải **giống nhau ở mọi trang**, và trang đang mở nên được làm nổi lên để người xem biết mình đang ở đâu. Dùng **đường dẫn tương đối** (`href=\"lien-he.html\"`) chứ đừng dùng đường dẫn tuyệt đối trên máy mình (`file:///D:/...`) — đưa lên mạng là chết hết liên kết.",
  });

  G("U12-06", {
    kieu: "cay", mau: "info",
    ten: "Các loại ô nhập trong một biểu mẫu",
    mo: "Tất cả đều là thẻ `<input>`, khác nhau ở thuộc tính **`type`**.",
    goc: { t: "`<form>`", p: "khối bọc ngoài, quyết định dữ liệu gửi đi đâu" },
    muc: [
      { t: "`type=\"text\"`", p: "một dòng chữ · và `<textarea>` cho nhiều dòng" },
      { t: "`type=\"radio\"`", p: "chọn **một** trong nhiều — cùng `name`" },
      { t: "`type=\"checkbox\"`", p: "chọn **nhiều** cái cùng lúc" },
      { t: "`type=\"submit\"`", p: "nút gửi biểu mẫu đi" },
    ],
    ghi: "Ba điều hay bị hỏi: các nút radio phải **cùng `name`** mới loại trừ nhau; mỗi ô nên có `<label>` gắn kèm để bấm vào chữ cũng chọn được; và HTML chỉ **thu** dữ liệu — muốn **xử lí** thì cần chương trình phía máy chủ, nên biểu mẫu tĩnh bấm Gửi sẽ chưa đi đâu cả.",
  });

  G("U12-07", {
    kieu: "vong", mau: "warning",
    ten: "Kiểm thử trước khi coi là trang đã xong",
    mo: "Bước **2** làm lộ nhiều lỗi nhất, vì phần lớn người xem dùng điện thoại.",
    muc: [
      { t: "Kiểm liên kết", p: "bấm **từng** liên kết, không để liên kết chết" },
      { t: "Thử trên điện thoại", p: "thu hẹp cửa sổ xem có phải trượt ngang không" },
      { t: "Thử trình duyệt khác", p: "ít nhất hai trình duyệt khác nhau" },
      { t: "Soát nội dung", p: "chính tả, ảnh có `alt`, tiêu đề trang" },
    ],
    quayLai: "sửa xong thì kiểm lại từ đầu — sửa CSS cho điện thoại rất dễ làm hỏng bản trên máy tính",
    ghi: "Dấu hiệu lỗi nặng nhất trên điện thoại: **trang trượt ngang được**. Nguyên nhân thường là một ảnh hoặc một bảng đặt chiều rộng cố định — thêm `max-width: 100%` cho ảnh là chữa được phần lớn.",
  });
})();
