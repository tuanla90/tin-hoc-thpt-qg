/* ============================================================================
 *  CÂU HỎI ĐỌC CODE — HTML/CSS và SQL
 *
 *  Vì sao cần tệp này: kho vốn có 128 câu đọc code Python nhưng chỉ ~10 câu web
 *  và ~18 câu SQL có khối code. Đề thi thật năm nào cũng có 2–3 câu Python,
 *  1–2 câu SQL và thường 1 câu đọc đoạn HTML/CSS. Kho web/SQL quá mỏng khiến
 *  học sinh cày vài đề là gặp lại đúng mấy câu quen mặt, mất giá trị luyện tập.
 *
 *  Dạng câu ở đây luôn là: CHO ĐOẠN MÃ -> hỏi kết quả/hành vi, không hỏi định
 *  nghĩa. Phương án nhiễu lấy từ lỗi hiểu sai thật (nhầm độ ưu tiên bộ chọn,
 *  quên padding trong mô hình hộp, tưởng WHERE lọc được sau GROUP BY...).
 *
 *  Nạp SAU questions-tinh-huong.js — ID sinh nối tiếp số hiện có.
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;

  var NEW = [

    /* ------------------------- HTML: cấu trúc & thẻ ------------------------- */
    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Trang web hiển thị nội dung như thế nào?",
      code: "<ul>\n  <li>Toán</li>\n  <li>Văn</li>\n  <li>Tin</li>\n</ul>",
      options: [
        "Một danh sách không đánh số, mỗi môn một dòng có dấu chấm đầu dòng",
        "Một danh sách đánh số 1, 2, 3",
        "Ba môn nằm liền nhau trên một dòng",
        "Một bảng có ba cột",
      ], answer: 0,
      explain: "Thẻ ul (unordered list) tạo danh sách KHÔNG đánh số, mỗi li là một mục xuống dòng kèm dấu chấm. Muốn đánh số 1, 2, 3 thì dùng ol (ordered list)." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Đoạn mã sau hiển thị ra sao trên trình duyệt?",
      code: "<p>Học <b>Tin học</b> rất <i>thú vị</i></p>",
      options: [
        "Học **Tin học** in đậm, *thú vị* in nghiêng, tất cả trên một đoạn văn",
        "Toàn bộ dòng chữ được in đậm",
        "Hiện đúng các dấu <b> và <i> ra màn hình",
        "Mỗi từ nằm trên một dòng riêng",
      ], answer: 0,
      explain: "Thẻ b in đậm phần chữ nằm bên trong, i in nghiêng. Thẻ p gộp tất cả thành một đoạn nên không xuống dòng giữa chừng, và bản thân các thẻ không hiện ra." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Liên kết dưới đây có hành vi gì?",
      code: "<a href=\"https://example.com\" target=\"_blank\">Xem thêm</a>",
      options: [
        "Hiện chữ \"Xem thêm\", bấm vào sẽ mở trang example.com trong tab mới",
        "Hiện chữ \"Xem thêm\", bấm vào mở trang example.com ngay trong tab hiện tại",
        "Hiện địa chỉ https://example.com ra màn hình",
        "Tải tệp từ example.com về máy",
      ], answer: 0,
      explain: "href là địa chỉ đích, phần chữ giữa hai thẻ là cái người dùng nhìn thấy. Thuộc tính target=\"_blank\" yêu cầu mở ở tab mới; không có nó thì mở ngay trong tab đang dùng." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Vì sao ảnh trong đoạn mã sau vẫn nên có thuộc tính alt?",
      code: "<img src=\"logo.png\">",
      options: [
        "Để hiện chữ thay thế khi ảnh lỗi và để trình đọc màn hình đọc cho người khiếm thị",
        "Để ảnh hiển thị nhanh hơn",
        "Để ảnh tự động thu nhỏ vừa màn hình",
        "Vì thiếu alt thì trình duyệt báo lỗi và không hiện trang",
      ], answer: 0,
      explain: "alt là chữ mô tả ảnh: hiện lên khi ảnh không tải được và được trình đọc màn hình đọc lên. Thiếu alt trang vẫn chạy nhưng mất khả năng tiếp cận và bất lợi cho SEO." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Biểu mẫu sau khi bấm nút sẽ gửi dữ liệu đi đâu và bằng phương thức nào?",
      code: "<form action=\"/dangky\" method=\"post\">\n  <input type=\"text\" name=\"hoten\">\n  <button type=\"submit\">Gửi</button>\n</form>",
      options: [
        "Gửi tới địa chỉ /dangky bằng phương thức POST, kèm giá trị ô hoten",
        "Gửi tới /dangky bằng phương thức GET nên dữ liệu hiện trên thanh địa chỉ",
        "Không gửi đi đâu vì thiếu thẻ script",
        "Gửi tới trang chủ vì action không hợp lệ",
      ], answer: 0,
      explain: "action là địa chỉ nhận dữ liệu, method quy định cách gửi. POST đặt dữ liệu trong thân yêu cầu (không hiện trên thanh địa chỉ), còn GET thì nối vào URL. Thuộc tính name của ô nhập chính là tên trường được gửi." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Đoạn mã sau tạo ra bảng có mấy hàng và mấy cột?",
      code: "<table>\n  <tr><td>A</td><td>B</td></tr>\n  <tr><td>C</td><td>D</td></tr>\n  <tr><td>E</td><td>F</td></tr>\n</table>",
      options: ["3 hàng, 2 cột", "2 hàng, 3 cột", "6 hàng, 1 cột", "1 hàng, 6 cột"],
      answer: 0,
      explain: "Mỗi thẻ tr là một hàng (có 3 thẻ tr), mỗi td trong hàng là một ô (mỗi hàng có 2 td) — vậy bảng 3 hàng × 2 cột." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Trình duyệt hiển thị đoạn sau thế nào?",
      code: "<div>Khối 1</div>\n<div>Khối 2</div>\n<span>Chữ A</span>\n<span>Chữ B</span>",
      options: [
        "Khối 1 và Khối 2 mỗi cái một dòng; Chữ A và Chữ B nằm cùng một dòng",
        "Cả bốn phần tử nằm trên bốn dòng riêng",
        "Cả bốn phần tử nằm trên cùng một dòng",
        "Khối 1, Khối 2 cùng dòng; Chữ A, Chữ B mỗi cái một dòng",
      ], answer: 0,
      explain: "div là phần tử khối nên chiếm trọn chiều ngang và tự xuống dòng. span là phần tử nội tuyến nên chỉ chiếm đúng bề rộng nội dung và nằm nối tiếp nhau trên một dòng." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Thẻ nào trong đoạn sau sẽ hiện với cỡ chữ lớn nhất theo mặc định của trình duyệt?",
      code: "<h1>Tiêu đề chính</h1>\n<h3>Mục nhỏ</h3>\n<p>Đoạn văn</p>\n<h2>Mục lớn</h2>",
      options: ["h1", "h2", "h3", "p"],
      answer: 0,
      explain: "Thứ tự cỡ chữ mặc định giảm dần từ h1 tới h6, còn p là chữ thường. Vị trí trong tài liệu không ảnh hưởng — h2 viết cuối vẫn nhỏ hơn h1." },

    /* ------------------------- CSS: bộ chọn & ưu tiên ------------------------- */
    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Đoạn văn trong đoạn mã sau hiện màu gì?",
      code: "<style>\n  p { color: blue; }\n  .noibat { color: green; }\n  #dacbiet { color: red; }\n</style>\n\n<p class=\"noibat\" id=\"dacbiet\">Xin chào</p>",
      options: ["Đỏ", "Xanh lá", "Xanh lam", "Đen"],
      answer: 0,
      explain: "Khi nhiều luật cùng nhắm một phần tử, luật có độ ưu tiên cao hơn thắng: id (#dacbiet) > lớp (.noibat) > tên thẻ (p). Vậy màu đỏ được áp dụng, bất kể thứ tự viết trong tệp." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Chữ trong thẻ p hiện màu gì?",
      code: "<style>\n  p { color: blue; }\n  p { color: orange; }\n</style>\n\n<p>Thử màu</p>",
      options: [
        "Cam, vì hai luật cùng độ ưu tiên thì luật viết SAU thắng",
        "Xanh lam, vì luật viết trước được ưu tiên",
        "Màu pha giữa xanh lam và cam",
        "Đen, vì hai luật xung đột nên bị bỏ qua cả hai",
      ], answer: 0,
      explain: "Hai bộ chọn giống hệt nhau nên độ ưu tiên bằng nhau; lúc đó luật xuất hiện sau trong tệp sẽ ghi đè luật trước. Đây là lí do thứ tự khai báo CSS rất quan trọng." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Với đoạn mã sau, thẻ p bên trong div hiện màu gì?",
      code: "<style>\n  div p { color: purple; }\n  p { color: gray; }\n</style>\n\n<div><p>Nội dung</p></div>",
      options: [
        "Tím, vì bộ chọn hậu duệ \"div p\" có độ ưu tiên cao hơn bộ chọn \"p\"",
        "Xám, vì luật \"p\" viết sau nên thắng",
        "Đen, vì hai luật triệt tiêu nhau",
        "Tím rồi đổi sang xám khi tải xong",
      ], answer: 0,
      explain: "\"div p\" gồm hai bộ chọn thẻ nên độ ưu tiên là 2, còn \"p\" chỉ là 1. Độ ưu tiên cao hơn thắng, thứ tự viết chỉ quyết định khi độ ưu tiên bằng nhau." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Bộ chọn nào trong đoạn CSS sau áp dụng cho TẤT CẢ phần tử có class=\"box\"?",
      code: "<style>\n  #box   { border: 1px solid red; }\n  .box   { border: 1px solid green; }\n  box    { border: 1px solid blue; }\n</style>",
      options: [".box", "#box", "box", "Cả ba đều được"],
      answer: 0,
      explain: "Dấu chấm đứng trước tên là bộ chọn theo lớp (class). Dấu thăng là bộ chọn theo id (chỉ một phần tử duy nhất), còn viết trần \"box\" là bộ chọn theo TÊN THẺ — mà không có thẻ nào tên box." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Ô div dưới đây chiếm tổng bề ngang bao nhiêu pixel trên màn hình (theo mô hình hộp mặc định)?",
      code: "<style>\n  div {\n    width: 200px;\n    padding: 10px;\n    border: 5px solid black;\n  }\n</style>\n\n<div>Nội dung</div>",
      options: ["230px", "200px", "215px", "220px"],
      answer: 0,
      explain: "Mặc định (content-box), width chỉ tính phần nội dung. Tổng bề ngang = 200 + padding trái phải (10 + 10) + viền trái phải (5 + 5) = 230px. Đặt box-sizing: border-box thì tổng mới đúng bằng 200px." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Đoạn CSS sau làm gì với các đoạn văn?",
      code: "<style>\n  p {\n    text-align: center;\n    font-size: 20px;\n  }\n</style>",
      options: [
        "Căn giữa chữ trong đoạn và đặt cỡ chữ 20 pixel",
        "Đưa cả đoạn văn ra giữa màn hình theo chiều dọc",
        "Căn phải chữ và đặt cỡ chữ 20 pixel",
        "Không làm gì vì thiếu dấu chấm trước p",
      ], answer: 0,
      explain: "text-align: center căn giữa nội dung chữ theo chiều ngang trong khung của đoạn, còn font-size đặt cỡ chữ. Muốn căn giữa theo chiều dọc phải dùng cách khác (flexbox chẳng hạn)." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Cách viết CSS nào trong đoạn sau được gọi là CSS nội tuyến (inline)?",
      code: "<!-- (1) --> <link rel=\"stylesheet\" href=\"style.css\">\n<!-- (2) --> <style> p { color: red; } </style>\n<!-- (3) --> <p style=\"color: red\">Chữ</p>",
      options: ["(3)", "(2)", "(1)", "Cả ba đều là nội tuyến"],
      answer: 0,
      explain: "Nội tuyến là viết thẳng vào thuộc tính style của thẻ (3). Cách (2) là CSS nhúng trong trang, cách (1) là CSS ngoài đặt ở tệp riêng — cách (1) được khuyến nghị vì dùng lại được cho nhiều trang." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Với đoạn mã sau, phần tử nào có nền vàng?",
      code: "<style>\n  .a .b { background: yellow; }\n</style>\n\n<div class=\"a\">\n  <p class=\"b\">Một</p>\n</div>\n<p class=\"b\">Hai</p>",
      options: [
        "Chỉ đoạn \"Một\", vì nó nằm bên trong phần tử có class a",
        "Cả hai đoạn \"Một\" và \"Hai\"",
        "Chỉ đoạn \"Hai\"",
        "Không đoạn nào, vì bộ chọn viết sai",
      ], answer: 0,
      explain: "\".a .b\" (có dấu cách) là bộ chọn hậu duệ: chỉ chọn phần tử class b nằm BÊN TRONG phần tử class a. Đoạn \"Hai\" đứng ngoài div nên không bị ảnh hưởng." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Thuộc tính CSS nào trong đoạn sau tạo khoảng cách giữa viền của phần tử và các phần tử xung quanh?",
      code: "<style>\n  .the {\n    margin: 20px;\n    padding: 10px;\n  }\n</style>",
      options: [
        "margin — khoảng cách phía NGOÀI viền",
        "padding — khoảng cách phía ngoài viền",
        "Cả hai đều tạo khoảng cách bên ngoài",
        "Không thuộc tính nào, phải dùng border",
      ], answer: 0,
      explain: "padding là đệm bên TRONG (giữa viền và nội dung), còn margin là lề bên NGOÀI (giữa viền và các phần tử khác). Nhầm hai cái này là lỗi kinh điển khi mới học CSS." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Chữ trong thẻ p hiện màu gì?",
      code: "<style>\n  p { color: blue !important; }\n  #dac { color: red; }\n</style>\n\n<p id=\"dac\">Kiểm tra</p>",
      options: [
        "Xanh lam, vì !important vượt lên trên cả độ ưu tiên của id",
        "Đỏ, vì id luôn thắng trong mọi trường hợp",
        "Đen, vì hai luật xung đột",
        "Tím, do hai màu pha lại",
      ], answer: 0,
      explain: "!important đứng trên mọi tính toán độ ưu tiên thông thường, nên luật của thẻ p thắng cả luật của id. Chính vì phá vỡ trật tự nên !important chỉ nên dùng khi thật cần." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Đoạn mã sau có lỗi gì khiến CSS không có tác dụng?",
      code: "<style>\n  .tieude {\n    color: red\n    font-size: 24px;\n  }\n</style>",
      options: [
        "Thiếu dấu chấm phẩy sau \"color: red\" nên luật bị hỏng",
        "Thiếu dấu chấm trước tieude",
        "Không được đặt hai thuộc tính trong một luật",
        "font-size phải viết là fontSize",
      ], answer: 0,
      explain: "Mỗi khai báo trong CSS phải kết thúc bằng dấu chấm phẩy. Thiếu nó, trình duyệt đọc gộp thành một khai báo sai và bỏ qua cả cụm. Cú pháp fontSize là của JavaScript, không phải CSS." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Với đoạn mã sau, ô div hiển thị bề ngang bao nhiêu?",
      code: "<style>\n  div {\n    box-sizing: border-box;\n    width: 300px;\n    padding: 20px;\n    border: 10px solid gray;\n  }\n</style>\n\n<div>Nội dung</div>",
      options: [
        "300px, vì border-box tính cả padding và viền vào trong width",
        "360px",
        "340px",
        "300px nhưng nội dung bị tràn ra ngoài",
      ], answer: 0,
      explain: "box-sizing: border-box đổi cách hiểu width: con số 300px giờ bao gồm cả viền và padding, phần nội dung tự co lại còn 300 − 40 − 20 = 240px. Đây là lí do nhiều dự án đặt border-box cho toàn trang." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Trang sau hiện tiêu đề màu gì?",
      code: "<head>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1 style=\"color: green\">Tiêu đề</h1>\n</body>\n\n<!-- trong style.css có: h1 { color: blue; } -->",
      options: [
        "Xanh lá, vì CSS nội tuyến có độ ưu tiên cao hơn CSS ở tệp ngoài",
        "Xanh lam, vì tệp CSS ngoài được nạp trước",
        "Đen, vì hai nguồn CSS xung đột",
        "Xanh lam, vì tệp ngoài luôn thắng CSS nội tuyến",
      ], answer: 0,
      explain: "Thứ tự ưu tiên từ thấp lên cao: CSS ngoài và CSS nhúng (theo thứ tự xuất hiện) < CSS nội tuyến < !important. Viết thẳng style vào thẻ nên thắng luật trong tệp ngoài." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Đoạn mã sau hiển thị mấy mục và theo kiểu gì?",
      code: "<ol>\n  <li>Bước một</li>\n  <li>Bước hai</li>\n</ol>",
      options: [
        "Hai mục, đánh số 1 và 2",
        "Hai mục, có dấu chấm đầu dòng",
        "Một mục duy nhất",
        "Hai mục nằm cùng một dòng",
      ], answer: 0,
      explain: "ol là danh sách CÓ thứ tự nên trình duyệt tự đánh số 1, 2, 3… cho từng li. Dấu chấm đầu dòng là của ul." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Nút bấm dưới đây có màu nền gì khi người dùng KHÔNG rê chuột lên?",
      code: "<style>\n  button { background: white; }\n  button:hover { background: yellow; }\n</style>\n\n<button>Bấm tôi</button>",
      options: [
        "Trắng; chỉ khi rê chuột lên mới chuyển sang vàng",
        "Vàng ngay từ đầu",
        "Trắng và không bao giờ đổi màu",
        "Không có màu nền nào",
      ], answer: 0,
      explain: ":hover là lớp giả chỉ có tác dụng trong lúc con trỏ nằm trên phần tử. Bình thường áp luật thường (nền trắng), rê chuột vào mới đổi sang vàng rồi trả lại như cũ khi rời đi." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Muốn đoạn CSS sau áp dụng cho cả thẻ h1 lẫn h2, viết bộ chọn thế nào cho đúng?",
      code: "<style>\n  ___ { color: navy; }\n</style>",
      options: ["h1, h2", "h1 h2", "h1 + h2", "h1.h2"],
      answer: 0,
      explain: "Dấu phẩy nhóm nhiều bộ chọn dùng chung một luật. Dấu cách là bộ chọn hậu duệ (h2 nằm trong h1), dấu + là phần tử liền kề, còn h1.h2 nghĩa là thẻ h1 có class h2." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Đoạn mã sau in ra kích thước nội dung (phần chứa chữ) rộng bao nhiêu?",
      code: "<style>\n  .hop {\n    width: 400px;\n    padding-left: 30px;\n    padding-right: 20px;\n    border: 0;\n  }\n</style>\n\n<div class=\"hop\">Chữ</div>",
      options: [
        "400px, vì mặc định width chính là bề rộng phần nội dung",
        "350px",
        "450px",
        "370px",
      ], answer: 0,
      explain: "Ở chế độ mặc định content-box, width = bề rộng NỘI DUNG, còn padding cộng thêm ra ngoài. Vậy nội dung vẫn 400px, tổng chiếm chỗ mới là 400 + 30 + 20 = 450px." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Vì sao trang sau hiện tiếng Việt bị lỗi phông thành kí tự lạ?",
      code: "<html>\n<head>\n  <title>Trang của tôi</title>\n</head>\n<body>Xin chào</body>\n</html>",
      options: [
        "Thiếu khai báo bảng mã <meta charset=\"UTF-8\"> trong phần head",
        "Thiếu thẻ style nên trình duyệt không hiển thị được",
        "Thẻ title không hỗ trợ tiếng Việt",
        "Phải viết tiếng Việt không dấu trong HTML",
      ], answer: 0,
      explain: "Không khai báo charset thì trình duyệt phải tự đoán bảng mã và rất hay đoán sai với tiếng Việt. Thêm <meta charset=\"UTF-8\"> ngay đầu head là cách chuẩn." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Đoạn mã sau có vấn đề gì?",
      code: "<p>Đoạn văn thứ nhất\n<p>Đoạn văn thứ hai</p>",
      options: [
        "Thẻ p đầu tiên chưa được đóng — nên viết đủ cặp mở và đóng",
        "Không được có hai thẻ p trong cùng một trang",
        "Thẻ p phải nằm trong thẻ div",
        "Không có vấn đề gì, mã hoàn toàn chuẩn",
      ], answer: 0,
      explain: "Mỗi thẻ p cần có thẻ đóng </p>. Trình duyệt hiện đại thường tự sửa nên trang vẫn hiện được, nhưng mã thiếu thẻ đóng dễ gây bố cục sai khi trang phức tạp và bị công cụ kiểm tra báo lỗi." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Ba div sau xếp thế nào trên màn hình?",
      code: "<style>\n  .hang { display: flex; }\n  .hang div { width: 100px; }\n</style>\n\n<div class=\"hang\">\n  <div>Một</div>\n  <div>Hai</div>\n  <div>Ba</div>\n</div>",
      options: [
        "Ba ô nằm ngang cạnh nhau trên cùng một dòng",
        "Ba ô xếp dọc, mỗi ô một dòng",
        "Ba ô chồng lên nhau tại cùng một vị trí",
        "Ba ô bị ẩn đi",
      ], answer: 0,
      explain: "display: flex đặt trên phần tử cha khiến các con xếp theo một trục — mặc định là trục ngang. Không có flex thì div là phần tử khối và sẽ xếp dọc, mỗi cái một dòng." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Trong đoạn sau, phần nào KHÔNG hiển thị ra màn hình cho người xem?",
      code: "<body>\n  <!-- Nhớ đổi ảnh này sau -->\n  <h2>Sản phẩm</h2>\n  <p>Giá tốt</p>\n</body>",
      options: [
        "Dòng chú thích \"Nhớ đổi ảnh này sau\"",
        "Dòng \"Sản phẩm\"",
        "Dòng \"Giá tốt\"",
        "Không phần nào bị ẩn",
      ], answer: 0,
      explain: "Cặp <!-- --> là chú thích trong HTML: trình duyệt bỏ qua khi hiển thị. Lưu ý chú thích VẪN nằm trong mã nguồn nên ai xem mã nguồn trang đều đọc được — đừng viết thông tin nhạy cảm vào đó." },

    { type: "tf", topic: "E", grade: 12, level: "hard",
      question: "Xét đoạn HTML và CSS sau khi làm bài thực hành tạo trang web:",
      code: "<style>\n  p        { color: blue; }\n  .canh    { color: green; }\n  #chinh   { color: red; }\n</style>\n\n<p>Đoạn A</p>\n<p class=\"canh\">Đoạn B</p>\n<p class=\"canh\" id=\"chinh\">Đoạn C</p>",
      statements: [
        { text: "Đoạn A hiện màu xanh lam", correct: true },
        { text: "Đoạn B hiện màu xanh lá", correct: true },
        { text: "Đoạn C hiện màu đỏ vì bộ chọn id có độ ưu tiên cao nhất", correct: true },
        { text: "Đoạn C hiện màu xanh lá vì luật .canh được viết trước luật #chinh", correct: false },
      ],
      explain: "(a)(b)(c) đúng theo thứ tự ưu tiên id > class > tên thẻ. (d) sai: thứ tự viết chỉ quyết định khi độ ưu tiên BẰNG nhau; ở đây id thắng bất kể viết trước hay sau." },

    { type: "tf", topic: "E", grade: 12, level: "medium",
      question: "Xét đoạn mã tạo biểu mẫu đăng kí sau:",
      code: "<form action=\"/luu\" method=\"post\">\n  <input type=\"text\" name=\"ten\">\n  <input type=\"password\" name=\"mk\">\n  <input type=\"submit\" value=\"Đăng kí\">\n</form>",
      statements: [
        { text: "Ô nhập kiểu password sẽ che kí tự người dùng gõ", correct: true },
        { text: "Thuộc tính name quyết định tên trường dữ liệu được gửi lên máy chủ", correct: true },
        { text: "Dữ liệu được gửi bằng phương thức POST nên không hiện trên thanh địa chỉ", correct: true },
        { text: "Vì dùng type=\"password\" nên mật khẩu được mã hoá an toàn khi truyền đi", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai — và đây là hiểu nhầm nguy hiểm: type=\"password\" chỉ che hiển thị trên màn hình. Muốn an toàn khi truyền phải dùng HTTPS." },

    /* =============================== SQL =============================== */
    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Bảng HOCSINH có các dòng: (An, 12A1, 8.5), (Bình, 12A2, 6.0), (Chi, 12A1, 9.0), (Dũng, 12A2, 4.5). Câu truy vấn sau trả về bao nhiêu dòng?",
      code: "SELECT Ten FROM HOCSINH WHERE Diem >= 6;",
      options: ["3", "2", "4", "1"],
      answer: 0,
      explain: "Các bạn có điểm từ 6 trở lên: An (8.5), Bình (6.0) và Chi (9.0) — tổng 3 dòng. Lưu ý Bình đúng 6.0 vẫn thoả điều kiện >= 6; chỉ Dũng (4.5) bị loại." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Vẫn bảng HOCSINH ở trên (4 dòng, hai lớp 12A1 và 12A2). Câu truy vấn sau trả về bao nhiêu dòng kết quả?",
      code: "SELECT Lop, COUNT(*) FROM HOCSINH GROUP BY Lop;",
      options: ["2", "4", "1", "8"],
      answer: 0,
      explain: "GROUP BY gom các dòng cùng giá trị Lop thành một nhóm. Có hai lớp khác nhau nên kết quả gồm 2 dòng: 12A1 với 2 học sinh và 12A2 với 2 học sinh." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Câu truy vấn sau sai ở đâu?",
      code: "SELECT Lop, AVG(Diem)\nFROM HOCSINH\nWHERE AVG(Diem) > 7\nGROUP BY Lop;",
      options: [
        "Không được dùng hàm gộp trong WHERE; điều kiện trên giá trị gộp phải đặt ở HAVING",
        "Thiếu dấu chấm phẩy ở cuối câu",
        "Không được đặt GROUP BY sau WHERE",
        "AVG chỉ dùng được với cột kiểu số nguyên",
      ], answer: 0,
      explain: "WHERE lọc từng DÒNG trước khi gom nhóm, nên lúc đó chưa có giá trị trung bình để so sánh. Điều kiện trên kết quả gộp phải viết trong HAVING: ... GROUP BY Lop HAVING AVG(Diem) > 7." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Câu lệnh sau làm gì với bảng HOCSINH?",
      code: "UPDATE HOCSINH SET Diem = 10 WHERE Ten = 'An';",
      options: [
        "Đổi điểm của bạn tên An thành 10, các dòng khác giữ nguyên",
        "Thêm một dòng mới cho bạn An với điểm 10",
        "Xoá dòng của bạn An",
        "Đổi điểm của TẤT CẢ học sinh thành 10",
      ], answer: 0,
      explain: "UPDATE sửa dữ liệu đã có; mệnh đề WHERE giới hạn chỉ những dòng thoả điều kiện. Nếu quên WHERE thì đúng là toàn bộ bảng bị đổi thành 10 — lỗi tai hại rất hay gặp." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Bảng MUON_TRA có 5 dòng, trong đó 2 dòng có NgayTra là NULL. Câu truy vấn sau trả về bao nhiêu dòng?",
      code: "SELECT * FROM MUON_TRA WHERE NgayTra IS NULL;",
      options: ["2", "3", "5", "0"],
      answer: 0,
      explain: "IS NULL chọn đúng những dòng chưa có giá trị ngày trả — tức 2 phiếu chưa trả sách. Nếu viết WHERE NgayTra = NULL thì kết quả luôn rỗng vì NULL không so sánh bằng dấu = được." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Câu truy vấn sau sắp xếp kết quả thế nào?",
      code: "SELECT Ten, Diem FROM HOCSINH ORDER BY Diem DESC;",
      options: [
        "Theo điểm từ cao xuống thấp",
        "Theo điểm từ thấp lên cao",
        "Theo tên từ A đến Z",
        "Không sắp xếp, giữ nguyên thứ tự nhập",
      ], answer: 0,
      explain: "ORDER BY sắp theo cột chỉ định; DESC là giảm dần (cao xuống thấp), ASC hoặc để trống là tăng dần." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Bảng SACH có 40 dòng. Sau khi chạy câu lệnh sau thì bảng còn bao nhiêu dòng?",
      code: "DELETE FROM SACH;",
      options: [
        "0 dòng — vì thiếu WHERE nên xoá toàn bộ bản ghi",
        "40 dòng — vì thiếu WHERE nên câu lệnh không chạy",
        "39 dòng — xoá dòng đầu tiên",
        "Bảng bị xoá khỏi cơ sở dữ liệu",
      ], answer: 0,
      explain: "DELETE không có WHERE sẽ xoá MỌI bản ghi, nhưng cấu trúc bảng vẫn còn (khác DROP TABLE là xoá luôn cả bảng). Đây là lí do phải hết sức cẩn thận và nên sao lưu trước khi chạy lệnh xoá." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Câu lệnh nào thêm một học sinh mới vào bảng?",
      code: "-- chọn câu đúng",
      options: [
        "INSERT INTO HOCSINH (Ten, Lop, Diem) VALUES ('Hoa', '12A3', 7.5);",
        "ADD INTO HOCSINH VALUES ('Hoa', '12A3', 7.5);",
        "UPDATE HOCSINH ADD ('Hoa', '12A3', 7.5);",
        "CREATE HOCSINH ('Hoa', '12A3', 7.5);",
      ], answer: 0,
      explain: "INSERT INTO ... VALUES ... là câu lệnh thêm bản ghi. ADD INTO không tồn tại; UPDATE để sửa dữ liệu có sẵn; CREATE dùng để tạo BẢNG chứ không thêm dòng." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Bảng HOCSINH có 4 dòng với điểm lần lượt 8.5, 6.0, 9.0, 4.5. Câu truy vấn sau in ra số nào?",
      code: "SELECT COUNT(*) FROM HOCSINH WHERE Diem > 6;",
      options: ["2", "3", "4", "1"],
      answer: 0,
      explain: "Điều kiện là LỚN HƠN 6 (không lấy bằng), nên chỉ 8.5 và 9.0 thoả — kết quả 2. Nếu là >= 6 thì thêm bạn 6.0 nữa thành 3. Đây là chỗ rất dễ nhầm khi đọc đề." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Kí tự * trong câu truy vấn sau có nghĩa gì?",
      code: "SELECT * FROM HOCSINH;",
      options: [
        "Lấy tất cả các cột của bảng",
        "Lấy tất cả các dòng nhưng chỉ cột đầu tiên",
        "Nhân các giá trị trong bảng với nhau",
        "Lọc bỏ các dòng trùng nhau",
      ], answer: 0,
      explain: "Dấu * là cách viết tắt cho \"mọi cột\". Muốn bỏ dòng trùng thì dùng SELECT DISTINCT, còn muốn giới hạn cột thì liệt kê tên cột ra." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Câu truy vấn sau tìm những học sinh nào?",
      code: "SELECT Ten FROM HOCSINH WHERE Ten LIKE 'N%';",
      options: [
        "Những bạn có tên bắt đầu bằng chữ N",
        "Những bạn có tên kết thúc bằng chữ N",
        "Những bạn có tên chứa chữ N ở bất kì đâu",
        "Những bạn có tên đúng bằng một chữ N",
      ], answer: 0,
      explain: "Trong LIKE, kí tự % đại diện cho một chuỗi bất kì (kể cả rỗng). 'N%' nghĩa là bắt đầu bằng N rồi theo sau là gì cũng được; '%N' là kết thúc bằng N; '%N%' là chứa N." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Câu truy vấn sau trả về điều gì?",
      code: "SELECT MAX(Diem) FROM HOCSINH;",
      options: [
        "Một giá trị: điểm cao nhất trong bảng",
        "Danh sách tên các bạn điểm cao nhất",
        "Tổng điểm của cả bảng",
        "Số lượng học sinh có điểm cao",
      ], answer: 0,
      explain: "MAX là hàm gộp trả về một giá trị lớn nhất của cột. Muốn biết AI đạt điểm đó thì phải viết thêm điều kiện, ví dụ WHERE Diem = (SELECT MAX(Diem) FROM HOCSINH)." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Hai bảng: HOCSINH(MaHS, Ten, MaLop) và LOP(MaLop, TenLop). Câu truy vấn sau làm gì?",
      code: "SELECT HOCSINH.Ten, LOP.TenLop\nFROM HOCSINH\nJOIN LOP ON HOCSINH.MaLop = LOP.MaLop;",
      options: [
        "Ghép hai bảng theo mã lớp để hiện tên học sinh kèm tên lớp của bạn đó",
        "Gộp tất cả các dòng của hai bảng nối tiếp nhau",
        "Xoá những học sinh không có lớp",
        "Tạo một bảng mới tên là JOIN",
      ], answer: 0,
      explain: "JOIN ... ON ghép dòng của hai bảng dựa trên điều kiện khớp khoá — ở đây là MaLop. Nhờ vậy mới lấy được tên lớp (nằm ở bảng LOP) cho từng học sinh." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Bảng có các điểm 8.5, 6.0, 9.0, 4.5. Câu truy vấn sau cho kết quả bao nhiêu?",
      code: "SELECT SUM(Diem) FROM HOCSINH;",
      options: ["28", "4", "9.0", "7"],
      answer: 0,
      explain: "SUM cộng toàn bộ giá trị của cột: 8.5 + 6.0 + 9.0 + 4.5 = 28. Nhầm sang COUNT(*) sẽ ra 4 (số dòng), nhầm sang MAX ra 9.0, nhầm sang AVG ra 7." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Câu truy vấn sau trả về mấy dòng nếu bảng có các lớp: 12A1, 12A1, 12A2, 12A2, 12A3?",
      code: "SELECT DISTINCT Lop FROM HOCSINH;",
      options: ["3", "5", "2", "1"],
      answer: 0,
      explain: "DISTINCT loại bỏ các giá trị trùng lặp, chỉ giữ mỗi giá trị một lần. Có ba lớp khác nhau (12A1, 12A2, 12A3) nên kết quả 3 dòng, dù bảng có 5 dòng dữ liệu." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Muốn tạo bảng mới lưu danh sách môn học, dùng câu lệnh nào?",
      code: "-- chọn câu đúng",
      options: [
        "CREATE TABLE MONHOC (MaMon TEXT, TenMon TEXT);",
        "NEW TABLE MONHOC (MaMon TEXT, TenMon TEXT);",
        "INSERT TABLE MONHOC (MaMon TEXT, TenMon TEXT);",
        "MAKE TABLE MONHOC (MaMon TEXT, TenMon TEXT);",
      ], answer: 0,
      explain: "CREATE TABLE định nghĩa bảng mới cùng tên và kiểu của từng cột. NEW TABLE và MAKE TABLE không tồn tại; INSERT dùng để thêm DÒNG vào bảng đã có." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Truy vấn sau lọc ra những học sinh nào?",
      code: "SELECT Ten FROM HOCSINH\nWHERE Diem >= 5 AND Lop = '12A1';",
      options: [
        "Những bạn vừa có điểm từ 5 trở lên vừa học lớp 12A1",
        "Những bạn có điểm từ 5 trở lên, hoặc học lớp 12A1",
        "Tất cả học sinh lớp 12A1",
        "Tất cả học sinh có điểm từ 5 trở lên",
      ], answer: 0,
      explain: "AND yêu cầu CẢ HAI điều kiện cùng đúng. Nếu dùng OR thì mới là \"hoặc\" — chỉ cần một điều kiện đúng là dòng đó được chọn." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Câu truy vấn sau có ý nghĩa gì?",
      code: "SELECT Ten, Diem FROM HOCSINH\nWHERE Diem BETWEEN 5 AND 8;",
      options: [
        "Lấy học sinh có điểm từ 5 đến 8, tính cả 5 và 8",
        "Lấy học sinh có điểm lớn hơn 5 và nhỏ hơn 8, không tính hai đầu",
        "Lấy học sinh có điểm bằng 5 hoặc bằng 8",
        "Lấy học sinh có điểm ngoài khoảng 5 đến 8",
      ], answer: 0,
      explain: "BETWEEN trong SQL bao gồm CẢ HAI giá trị đầu mút, tương đương Diem >= 5 AND Diem <= 8. Muốn loại hai đầu thì phải viết rõ bằng dấu > và <." },

    { type: "tf", topic: "D", grade: 12, level: "hard",
      question: "Bảng HOCSINH gồm 5 dòng dữ liệu như sau: (An, 12A1, 8.5), (Bình, 12A1, 6.0), (Chi, 12A2, 9.0), (Dũng, 12A2, 4.5), (Hoa, 12A2, 7.0). Xét các truy vấn:",
      code: "-- (1)\nSELECT COUNT(*) FROM HOCSINH WHERE Diem >= 6;\n-- (2)\nSELECT Lop, COUNT(*) FROM HOCSINH GROUP BY Lop;\n-- (3)\nSELECT MAX(Diem) FROM HOCSINH;",
      statements: [
        { text: "Truy vấn (1) trả về giá trị 4", correct: true },
        { text: "Truy vấn (2) trả về 2 dòng kết quả", correct: true },
        { text: "Truy vấn (3) trả về giá trị 9.0", correct: true },
        { text: "Truy vấn (2) trả về 5 dòng vì bảng có 5 học sinh", correct: false },
      ],
      explain: "(a) An, Bình, Chi, Hoa đều từ 6 trở lên nên bằng 4. (b) hai lớp nên 2 nhóm. (c) điểm cao nhất là 9.0. (d) sai: GROUP BY gom các dòng cùng lớp lại nên số dòng kết quả bằng số lớp khác nhau, không phải số học sinh." },

    { type: "tf", topic: "D", grade: 12, level: "medium",
      question: "Nhóm bạn thực hành các câu lệnh thao tác dữ liệu trên bảng SACH của thư viện:",
      code: "-- (1)\nDELETE FROM SACH WHERE MaSach = 'S05';\n-- (2)\nDROP TABLE SACH;\n-- (3)\nUPDATE SACH SET SoLuong = 0;",
      statements: [
        { text: "Câu (1) chỉ xoá đúng một bản ghi có mã S05", correct: true },
        { text: "Câu (2) xoá cả bảng SACH khỏi cơ sở dữ liệu, mất luôn cấu trúc", correct: true },
        { text: "Câu (3) đặt SoLuong của MỌI cuốn sách về 0 vì thiếu WHERE", correct: true },
        { text: "Câu (1) và câu (2) cho kết quả giống hệt nhau", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: DELETE xoá dòng nhưng giữ bảng, còn DROP TABLE xoá luôn cả bảng — sau DROP thì mọi truy vấn tới SACH đều báo lỗi không tồn tại bảng." },

    { type: "tf", topic: "D", grade: 12, level: "hard",
      question: "Xét truy vấn thống kê điểm trung bình theo lớp sau:",
      code: "SELECT Lop, AVG(Diem) AS DiemTB\nFROM HOCSINH\nWHERE Diem IS NOT NULL\nGROUP BY Lop\nHAVING AVG(Diem) >= 7\nORDER BY DiemTB DESC;",
      statements: [
        { text: "WHERE lọc từng dòng TRƯỚC khi gom nhóm", correct: true },
        { text: "HAVING lọc trên kết quả đã gom nhóm nên dùng được hàm AVG", correct: true },
        { text: "ORDER BY sắp các lớp theo điểm trung bình giảm dần", correct: true },
        { text: "Có thể thay HAVING bằng WHERE mà kết quả không đổi", correct: false },
      ],
      explain: "(a)(b)(c) đúng và mô tả đúng thứ tự xử lí: WHERE → GROUP BY → HAVING → ORDER BY. (d) sai: WHERE chạy trước khi gom nhóm nên chưa có giá trị AVG để so sánh, viết vậy sẽ báo lỗi." },
  ];

  var max = {};
  QUESTION_BANK.forEach(function (q) {
    var k = q.topic + "-" + q.type;
    var n = Number(String(q.id).split("-").pop());
    if (Number.isFinite(n) && n > (max[k] || 0)) max[k] = n;
  });
  NEW.forEach(function (q) {
    var k = q.topic + "-" + q.type;
    max[k] = (max[k] || 0) + 1;
    q.id = k + "-" + max[k];
  });
  QUESTION_BANK.push.apply(QUESTION_BANK, NEW);
})();
