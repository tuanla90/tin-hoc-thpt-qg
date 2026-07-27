/* ============================================================================
 *  CÂU HỎI VẬN DỤNG CAO (level "hard") — nặng về đọc/truy vết code Python,
 *  tìm lỗi, độ phức tạp, SQL, mạng, web, học máy.
 *  Code đặt ở trường "code" (render trong <pre>); "question"/"explain" là prose
 *  thuần (renderer dùng esc(), KHÔNG parse markdown). Nạp SAU questions*.js và
 *  các tệp bài SGK (cần LESSONS để gắn vào quiz "Luyện tập bài này").
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;

  var Q = [
    /* ---------- F: đọc & truy vết code Python (topic F) ---------- */
    { id: "F-mc-79", type: "mc", topic: "F", grade: 10, level: "hard",
      question: "Đoạn chương trình sau in ra gì?",
      code: "s = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        s += i\n    else:\n        s -= i\nprint(s)",
      options: ["-3", "3", "9", "-9"], answer: 0,
      explain: "i=1: s=-1; i=2: s=1; i=3: s=-2; i=4: s=2; i=5: s=-3. Cộng số chẵn, trừ số lẻ (1,3,5) → -3." },
    { id: "F-mc-80", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Kết quả in ra là gì?",
      code: "a = [3, 1, 4, 1, 5, 9, 2]\na.sort()\nprint(a[2], a[-2])",
      options: ["2 5", "1 5", "4 2", "2 9"], answer: 0,
      explain: "Sau sort: [1, 1, 2, 3, 4, 5, 9]. a[2] = 2 (phần tử thứ ba), a[-2] = 5 (phần tử áp chót). → '2 5'." },
    { id: "F-mc-81", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Hàm đệ quy sau in ra gì?",
      code: "def f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\nprint(f(4))",
      options: ["24", "12", "10", "4"], answer: 0,
      explain: "Đây là giai thừa: f(4) = 4 × 3 × 2 × 1 = 24." },
    { id: "F-mc-82", type: "mc", topic: "F", grade: 10, level: "hard",
      question: "Đoạn sau in ra số mấy?",
      code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
      options: ["4", "3", "1", "Báo lỗi"], answer: 0,
      explain: "Lệnh b = a KHÔNG tạo bản sao — b và a cùng trỏ tới MỘT danh sách. Thêm vào b cũng là thêm vào a → len(a) = 4." },
    { id: "F-mc-83", type: "mc", topic: "F", grade: 10, level: "hard",
      question: "Kết quả in ra là gì?",
      code: "s = \"Python\"\nprint(s[::-1][:3])",
      options: ["noh", "Pyt", "hty", "ohn"], answer: 0,
      explain: "s[::-1] đảo ngược xâu thành 'nohtyP', rồi [:3] lấy 3 kí tự đầu → 'noh'." },
    { id: "F-mc-84", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Danh sách a có giá trị gì?",
      code: "a = [x * x for x in range(5) if x % 2 == 1]\nprint(a)",
      options: ["[1, 9]", "[1, 4, 9]", "[0, 1, 4, 9, 16]", "[1, 9, 25]"], answer: 0,
      explain: "range(5) = 0,1,2,3,4; chỉ giữ số lẻ 1 và 3; bình phương → 1 và 9 → [1, 9]." },
    { id: "F-mc-85", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Sau khi chạy, c bằng bao nhiêu?",
      code: "c = 0\nfor i in range(3):\n    for j in range(i):\n        c += 1\nprint(c)",
      options: ["3", "6", "9", "0"], answer: 0,
      explain: "i=0: range(0) không lặp (0 lần); i=1: 1 lần; i=2: 2 lần. Tổng 0 + 1 + 2 = 3." },
    { id: "F-mc-86", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Kết quả in ra là gì?",
      code: "d = {'a': 1, 'b': 2}\nd['a'] = d.get('a', 0) + 10\nd['c'] = d.get('c', 0) + 5\nprint(d['a'], d['c'])",
      options: ["11 5", "1 5", "11 0", "10 5"], answer: 0,
      explain: "d.get('a',0) = 1 → d['a'] = 11. d.get('c',0) = 0 (chưa có 'c') → d['c'] = 5. In '11 5'." },
    { id: "F-mc-87", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Tìm kiếm nhị phân trên mảng đã sắp xếp có 1000 phần tử. Số lần so sánh TỐI ĐA xấp xỉ bao nhiêu?",
      options: ["Khoảng 10", "Khoảng 1000", "Khoảng 500", "Khoảng 100"], answer: 0,
      explain: "Mỗi bước chia đôi mảng nên số bước xấp xỉ log₂(1000) ≈ 10. Đó là ưu điểm lớn so với tìm kiếm tuần tự (tối đa 1000 lần)." },
    { id: "F-mc-88", type: "mc", topic: "F", grade: 10, level: "hard",
      question: "Người viết MUỐN tính tổng các số từ 1 đến n. Đoạn dưới in ra gì và có đúng ý không?",
      code: "def tong(n):\n    s = 0\n    for i in range(n):\n        s += i\n    return s\nprint(tong(5))",
      options: ["In 10 — SAI ý, vì range(n) bỏ sót số n (chỉ cộng 0..4)", "In 15 — đúng ý", "In 15 — nhưng thừa số 0", "Báo lỗi"], answer: 0,
      explain: "range(5) = 0,1,2,3,4 → tổng 10. Muốn tính 1..5 (=15) phải dùng range(1, n+1). Đây là lỗi 'sai một đơn vị' (off-by-one)." },
    { id: "F-mc-89", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Sau MỘT lượt duyệt (chạy hết vòng for), danh sách a thành gì?",
      code: "a = [5, 2, 8, 1]\nfor i in range(len(a) - 1):\n    if a[i] > a[i + 1]:\n        a[i], a[i + 1] = a[i + 1], a[i]\nprint(a)",
      options: ["[2, 5, 1, 8]", "[1, 2, 5, 8]", "[2, 5, 8, 1]", "[8, 5, 2, 1]"], answer: 0,
      explain: "Một lượt nổi bọt: i=0 đổi 5,2 → [2,5,8,1]; i=1: 5>8 sai; i=2 đổi 8,1 → [2,5,1,8]. Sau 1 lượt, phần tử lớn nhất (8) 'nổi' về cuối." },
    { id: "F-mc-90", type: "mc", topic: "F", grade: 10, level: "hard",
      question: "Kết quả in ra là số mấy?",
      code: "s = \"  Hoc Tin  \"\nprint(len(s.strip()))",
      options: ["7", "11", "6", "8"], answer: 0,
      explain: "strip() bỏ khoảng trắng hai đầu → 'Hoc Tin' (H, o, c, dấu cách, T, i, n = 7 kí tự). len = 7." },

    /* ---------- F: Đúng/Sai vận dụng ---------- */
    { id: "F-tf-18", type: "tf", topic: "F", grade: 11, level: "hard",
      question: "Xét đoạn chương trình sau. Các phát biểu bên dưới đúng hay sai?",
      code: "a = [1, 2, 3]\nb = a[:]\nb.append(4)",
      statements: [
        { text: "a[:] tạo ra một danh sách MỚI (bản sao)", correct: true },
        { text: "Sau đoạn lệnh, a vẫn có đúng 3 phần tử", correct: true },
        { text: "b có 4 phần tử", correct: true },
        { text: "b và a cùng trỏ tới một danh sách", correct: false }],
      explain: "a[:] là bản sao độc lập nên sửa b không ảnh hưởng a (a vẫn 3 phần tử, b có 4). (d) SAI: chúng là hai danh sách khác nhau." },
    { id: "F-tf-19", type: "tf", topic: "F", grade: 11, level: "hard",
      question: "Xét về thuật toán tìm kiếm và sắp xếp. Các phát biểu sau đúng hay sai?",
      statements: [
        { text: "Tìm kiếm nhị phân yêu cầu mảng đã được sắp xếp", correct: true },
        { text: "Tìm kiếm tuần tự chạy được trên mảng chưa sắp xếp", correct: true },
        { text: "Sắp xếp nổi bọt có độ phức tạp O(n²) ở trường hợp xấu nhất", correct: true },
        { text: "Với MỌI mảng, tìm kiếm nhị phân luôn ít bước hơn tuần tự", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: với mảng rất nhỏ, hoặc khi phần tử cần tìm nằm ngay đầu mảng, tìm kiếm tuần tự có thể nhanh hơn; hơn nữa mảng chưa sắp xếp thì không dùng được nhị phân." },

    /* ---------- C: CSDL & SQL vận dụng ---------- */
    { id: "C-mc-31", type: "mc", topic: "C", grade: 11, level: "hard",
      question: "Bảng HOCSINH(HoTen, Lop, Diem). Câu lệnh SQL sau cho kết quả gì?",
      code: "SELECT HoTen FROM HOCSINH\nWHERE Diem >= 8\nORDER BY Diem DESC;",
      options: ["Họ tên các HS có điểm ≥ 8, xếp theo điểm giảm dần", "Tất cả họ tên, xếp theo điểm tăng dần", "Điểm của mọi học sinh", "Số học sinh có điểm ≥ 8"], answer: 0,
      explain: "WHERE Diem >= 8 lọc HS điểm từ 8; SELECT HoTen lấy cột họ tên; ORDER BY Diem DESC xếp giảm dần theo điểm." },
    { id: "C-mc-32", type: "mc", topic: "C", grade: 11, level: "hard",
      question: "Với bảng HOCSINH(HoTen, Lop, Diem), câu lệnh SQL sau cho kết quả gì?",
      code: "SELECT Lop, COUNT(*) FROM HOCSINH\nGROUP BY Lop;",
      options: ["Số học sinh trong mỗi lớp", "Tổng điểm của mỗi lớp", "Danh sách tất cả học sinh", "Lớp có nhiều học sinh nhất"], answer: 0,
      explain: "GROUP BY Lop gom các dòng theo từng lớp; COUNT(*) đếm số dòng (số học sinh) trong mỗi nhóm lớp." },
    { id: "C-tf-4", type: "tf", topic: "C", grade: 11, level: "hard",
      question: "Xét về cơ sở dữ liệu quan hệ và SQL. Các phát biểu sau đúng hay sai?",
      statements: [
        { text: "Khóa chính (primary key) phải duy nhất, không được trùng", correct: true },
        { text: "Khóa ngoài (foreign key) liên kết tới khóa chính của bảng khác", correct: true },
        { text: "Lệnh SELECT dùng để truy vấn (lấy) dữ liệu", correct: true },
        { text: "Lệnh DELETE dùng để tạo bảng mới", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: DELETE dùng để XÓA dữ liệu; muốn tạo bảng mới phải dùng CREATE TABLE." },

    /* ---------- B: mạng vận dụng ---------- */
    { id: "B-mc-27", type: "mc", topic: "B", grade: 12, level: "hard",
      question: "Một mạng LAN có 30 máy nối chung qua một hub nên hay bị nghẽn do xung đột tín hiệu. Để GIẢM xung đột và tăng tốc mà ít tốn kém nhất, nên làm gì?",
      options: ["Thay hub bằng switch", "Thay tất cả máy tính bằng máy mới", "Nối thêm nhiều hub nữa", "Tắt bớt máy tính đi"], answer: 0,
      explain: "Switch nối riêng từng cặp máy nên chia nhỏ miền xung đột, giảm va chạm tín hiệu và tăng tốc — giải pháp đúng và tiết kiệm hơn so với thay toàn bộ máy." },

    /* ---------- E: web vận dụng ---------- */
    { id: "E-mc-43", type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Trang web có đoạn CSS bên dưới. Đoạn <p class=\"note\">Xin chào</p> sẽ hiển thị chữ màu gì?",
      code: "p { color: red; }\np.note { color: blue; }",
      options: ["Xanh (blue)", "Đỏ (red)", "Đen", "Vừa đỏ vừa xanh"], answer: 0,
      explain: "Cả hai quy tắc đều khớp, nhưng p.note có độ ưu tiên (specificity) CAO HƠN p vì có thêm bộ chọn lớp → màu xanh thắng." },
    { id: "E-mc-44", type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Muốn khi bấm vào liên kết thì trang mới mở ra ở MỘT TAB MỚI (không mất trang đang xem), cần dùng thuộc tính và giá trị nào trên thẻ <a>?",
      options: ["target=\"_blank\"", "href=\"new\"", "src=\"_blank\"", "open=\"tab\""], answer: 0,
      explain: "Thuộc tính target=\"_blank\" làm liên kết mở ở tab/cửa sổ mới, giữ nguyên trang cũ đang đọc." },

    /* ---------- G: học máy vận dụng ---------- */
    { id: "G-mc-28", type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Người ta đưa cho máy 1000 tấm ảnh ĐÃ ghi sẵn nhãn 'chó' hoặc 'mèo' để máy học phân biệt, rồi cho máy đoán ảnh mới. Đây là kiểu học máy nào?",
      options: ["Học có giám sát", "Học không giám sát", "Học tăng cường", "Không phải học máy"], answer: 0,
      explain: "Dữ liệu ĐÃ có nhãn (chó/mèo) làm sẵn đáp án → đây là học CÓ giám sát (supervised learning)." },
    { id: "G-mc-29", type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Một cửa hàng dùng máy để tự chia khách hàng thành các nhóm theo thói quen mua sắm, DÙ dữ liệu KHÔNG hề gắn nhãn nhóm sẵn. Đây là kiểu học máy nào?",
      options: ["Học không giám sát", "Học có giám sát", "Lập trình rõ ràng từng bước", "Không dùng dữ liệu"], answer: 0,
      explain: "Dữ liệu KHÔNG có nhãn sẵn, máy tự gom các khách giống nhau thành nhóm → học KHÔNG giám sát (unsupervised learning)." }
  ];

  QUESTION_BANK.push.apply(QUESTION_BANK, Q);

  /* Gắn câu mới vào "Luyện tập bài này" của bài SGK tương ứng (guard nếu bài tồn tại) */
  var LINK = {
    "S10-20": ["F-mc-79", "F-mc-85"],
    "S11-21": ["F-mc-80", "F-mc-89"],
    "S10-26": ["F-mc-81"],
    "S10-22": ["F-mc-82", "F-tf-18"],
    "S10-24": ["F-mc-83"],
    "S10-23": ["F-mc-84", "F-mc-86"],
    "S11-19": ["F-mc-87"],
    "S10-30": ["F-mc-88"],
    "S10-25": ["F-mc-90"],
    "S11-24": ["F-tf-19"],
    "S11-14": ["C-mc-31", "C-mc-32", "C-tf-4"],
    "S12-22": ["B-mc-27"],
    "S12-17": ["E-mc-43"],
    "S12-10": ["E-mc-44"],
    "S12-25": ["G-mc-28", "G-mc-29"]
  };
  if (typeof LESSONS !== "undefined") {
    Object.keys(LINK).forEach(function (id) {
      var L = LESSONS.filter(function (l) { return l.id === id; })[0];
      if (L) L.quiz = (L.quiz || []).concat(LINK[id]);
    });
  }
})();

/* ============================================================================
 *  ĐỢT 2 — Vận dụng cao bù chỗ thiếu (rà soát: D=0, B=2, E=3, C=4 câu hard).
 *  Thêm hard cho D/B/E/C/G + F; gắn vào các bài mỏng quiz.
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var Q = [
    /* ---------- D: Đạo đức, pháp luật, an toàn (tình huống) ---------- */
    { id: "D-mc-16", type: "mc", topic: "D", grade: 10, level: "hard",
      question: "Bạn An tải một bức ảnh có ghi 'Bản quyền © tác giả' trên mạng, rồi dùng làm bìa cho sản phẩm BÁN VÉ THU TIỀN mà không xin phép. Hành vi này:",
      options: ["Vi phạm bản quyền vì dùng cho mục đích thương mại mà không được phép", "Không sao vì ảnh đã đăng công khai trên mạng", "Không sao vì chỉ dùng đúng một ảnh", "Hợp lệ vì đã ghi tên tác giả"], answer: 0,
      explain: "Ảnh có bản quyền, dùng cho mục đích thương mại phải xin phép/được cấp phép — đăng công khai không có nghĩa là được tự do dùng." },
    { id: "D-mc-17", type: "mc", topic: "D", grade: 11, level: "hard",
      question: "Em nhận email 'Ngân hàng ABC' báo tài khoản bị khóa, hối thúc bấm link đăng nhập GẤP để mở lại; địa chỉ gửi là abc-bank@mail-verify.top. Cách xử lí ĐÚNG nhất?",
      options: ["Không bấm link; tự vào app/web chính thức hoặc gọi tổng đài ngân hàng để kiểm tra", "Bấm link và đăng nhập ngay kẻo mất tài khoản", "Trả lời email, cung cấp số tài khoản để họ xác minh", "Chuyển email cho bạn bè nhờ đăng nhập giúp"], answer: 0,
      explain: "Đây là dấu hiệu lừa đảo (phishing): hối thúc gấp + tên miền lạ. Luôn tự truy cập kênh chính thức, không bấm link trong email nghi ngờ." },
    { id: "D-mc-18", type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Thấy một tin 'gây sốc' chưa rõ nguồn lan truyền trên mạng xã hội, ứng xử có trách nhiệm nhất là:",
      options: ["Kiểm chứng từ nguồn/báo chí chính thống trước khi tin hoặc chia sẻ", "Chia sẻ ngay cho thật nhiều người để 'cảnh báo'", "Bình luận công kích người đăng", "Tin ngay vì tin có rất nhiều lượt chia sẻ"], answer: 0,
      explain: "Nhiều lượt chia sẻ không đồng nghĩa với đúng. Chia sẻ tin chưa kiểm chứng có thể lan truyền tin giả — cần xác minh nguồn trước." },
    { id: "D-mc-19", type: "mc", topic: "D", grade: 10, level: "hard",
      question: "Cách đặt và dùng mật khẩu nào AN TOÀN nhất?",
      options: ["Mật khẩu dài, có chữ hoa-thường-số-kí hiệu, và MỖI dịch vụ một mật khẩu khác nhau", "Dùng chung một mật khẩu dễ nhớ (ngày sinh) cho mọi tài khoản", "Ghi hết mật khẩu vào ghi chú điện thoại không khóa", "Đặt '123456' cho nhanh và dễ nhớ"], answer: 0,
      explain: "Mật khẩu mạnh + mỗi dịch vụ một mật khẩu riêng: nếu một nơi lộ, các tài khoản khác vẫn an toàn." },
    { id: "D-tf-5", type: "tf", topic: "D", grade: 11, level: "hard",
      question: "Xét các thói quen an toàn thông tin. Đúng hay sai?",
      statements: [
        { text: "Cập nhật phần mềm/hệ điều hành thường xuyên giúp vá lỗ hổng bảo mật", correct: true },
        { text: "Nên bật xác thực hai bước (2FA) cho các tài khoản quan trọng", correct: true },
        { text: "Phần mềm diệt virus giảm nguy cơ nhưng không thay được thói quen an toàn", correct: true },
        { text: "Wi-Fi công cộng miễn phí luôn an toàn để đăng nhập ngân hàng", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: Wi-Fi công cộng dễ bị nghe lén; tránh đăng nhập dịch vụ nhạy cảm hoặc dùng thêm VPN." },

    /* ---------- B: Mạng (tình huống, tính toán) ---------- */
    { id: "B-mc-28", type: "mc", topic: "B", grade: 12, level: "hard",
      question: "Một lớp có 25 máy cần nối mạng nội bộ và cùng ra Internet qua MỘT đường truyền. Thiết bị nào chia Internet cho cả lớp và định tuyến ra ngoài?",
      options: ["Router (bộ định tuyến)", "Máy in mạng", "Webcam", "Loa Bluetooth"], answer: 0,
      explain: "Router kết nối mạng nội bộ với Internet và định tuyến gói tin ra/vào; thường tích hợp chia mạng cho nhiều máy." },
    { id: "B-mc-29", type: "mc", topic: "B", grade: 12, level: "hard",
      question: "Đường truyền 100 Mb/s, tải một tệp 50 MB (1 byte = 8 bit). Thời gian lý thuyết tối thiểu xấp xỉ bao nhiêu?",
      options: ["Khoảng 4 giây", "Khoảng 0,5 giây", "Khoảng 50 giây", "Khoảng 400 giây"], answer: 0,
      explain: "50 MB = 50 × 8 = 400 Mb (megabit). 400 Mb ÷ 100 Mb/s = 4 giây. Lưu ý đổi MB (byte) sang Mb (bit) trước khi chia." },
    { id: "B-mc-30", type: "mc", topic: "B", grade: 10, level: "hard",
      question: "Khi nhập thông tin đăng nhập trên web, dấu hiệu nào cho biết kết nối được mã hoá an toàn hơn?",
      options: ["Địa chỉ bắt đầu bằng https:// (có ổ khóa)", "Trang có nhiều quảng cáo", "Trang tải rất nhanh", "Địa chỉ bắt đầu bằng http://"], answer: 0,
      explain: "https có mã hoá (TLS) bảo vệ dữ liệu trên đường truyền; http thì không. Biểu tượng ổ khóa là dấu hiệu kèm theo." },
    { id: "B-tf-6", type: "tf", topic: "B", grade: 12, level: "hard",
      question: "Xét vai trò các thiết bị mạng. Đúng hay sai?",
      statements: [
        { text: "Switch chia nhỏ miền xung đột, giảm va chạm so với hub", correct: true },
        { text: "Router kết nối các mạng khác nhau và định tuyến gói tin", correct: true },
        { text: "Access point cho thiết bị vào mạng qua Wi-Fi", correct: true },
        { text: "Hub thông minh hơn switch vì gửi dữ liệu tới đúng một máy đích", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: ngược lại — hub phát dữ liệu ra MỌI cổng; switch mới gửi đúng máy đích." },

    /* ---------- E: Web/HTML/CSS & đồ hoạ ---------- */
    { id: "E-mc-45", type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Trang web có CSS bên dưới. Đoạn <p id=\"gt\">Xin chào</p> hiển thị chữ màu gì?",
      code: "p { color: green; }\n#gt { color: red; }",
      options: ["Đỏ", "Xanh lá", "Đen", "Vừa đỏ vừa xanh"], answer: 0,
      explain: "Bộ chọn id (#gt) có độ ưu tiên CAO HƠN bộ chọn thẻ (p) → màu đỏ thắng." },
    { id: "E-mc-46", type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Một khối có width: 200px; padding: 10px; border: 2px (mỗi bên). Theo box model chuẩn (content-box), tổng bề rộng khối chiếm chỗ trên trang là bao nhiêu?",
      options: ["224px", "200px", "220px", "212px"], answer: 0,
      explain: "content 200 + padding 10×2 + border 2×2 = 200 + 20 + 4 = 224px (padding và border tính cả hai bên)." },
    { id: "E-mc-47", type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Muốn ảnh 'so-do.png' hiện kèm chữ mô tả 'sơ đồ mạng' (khi ảnh lỗi vẫn đọc được chữ đó), viết thẻ nào ĐÚNG?",
      options: ["<img src=\"so-do.png\" alt=\"sơ đồ mạng\">", "<img href=\"so-do.png\" text=\"sơ đồ mạng\">", "<image src=\"so-do.png\">", "<img alt=\"so-do.png\">"], answer: 0,
      explain: "Thẻ ảnh là <img>, đường dẫn ở src, chữ mô tả (hiện khi ảnh lỗi) ở alt. href/text không phải thuộc tính của <img>." },
    { id: "E-mc-48", type: "mc", topic: "E", grade: 10, level: "hard",
      question: "Vì sao ảnh vector (trong phần mềm thiết kế đồ hoạ) phóng to nhiều lần vẫn KHÔNG bị vỡ/răng cưa như ảnh chụp (bitmap)?",
      options: ["Vì lưu bằng công thức toán học của đường/hình nên vẽ lại sắc nét ở mọi kích thước", "Vì ảnh vector luôn có dung lượng nhỏ hơn", "Vì ảnh vector có nhiều điểm ảnh hơn", "Vì ảnh vector luôn là đen trắng"], answer: 0,
      explain: "Ảnh vector mô tả hình bằng toán học (điểm, đường, đa giác) nên khi phóng to máy tính vẽ lại chính xác; bitmap là lưới điểm ảnh nên phóng to sẽ vỡ." },
    { id: "E-tf-8", type: "tf", topic: "E", grade: 12, level: "hard",
      question: "Xét về HTML và CSS. Đúng hay sai?",
      statements: [
        { text: "CSS tách phần trình bày (màu, phông, bố cục) ra khỏi nội dung HTML", correct: true },
        { text: "Bộ chọn id (#) có độ ưu tiên cao hơn bộ chọn thẻ", correct: true },
        { text: "Thuộc tính href của thẻ <a> cho biết liên kết dẫn tới đâu", correct: true },
        { text: "Thẻ <img> bắt buộc phải có thẻ đóng </img> mới hiện được ảnh", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: <img> là thẻ rỗng, không có thẻ đóng </img>." },

    /* ---------- C: CSDL & SQL ---------- */
    { id: "C-mc-33", type: "mc", topic: "C", grade: 11, level: "hard",
      question: "Bảng HOCSINH(HoTen, Lop, Diem). Câu lệnh sau trả về gì?",
      code: "SELECT HoTen FROM HOCSINH\nWHERE Lop = '12A1' AND Diem >= 8;",
      options: ["Họ tên học sinh lớp 12A1 CÓ điểm từ 8 trở lên", "Họ tên mọi học sinh lớp 12A1", "Họ tên mọi học sinh điểm ≥ 8 ở tất cả các lớp", "Số học sinh lớp 12A1"], answer: 0,
      explain: "AND đòi hỏi THỎA CẢ hai điều kiện: đúng lớp 12A1 và điểm ≥ 8." },
    { id: "C-mc-34", type: "mc", topic: "C", grade: 11, level: "hard",
      question: "Trong bảng HOCSINH, cột nào phù hợp làm KHÓA CHÍNH nhất?",
      options: ["Mã học sinh (mỗi em một mã, không trùng)", "Họ tên (có thể trùng nhau)", "Lớp (nhiều em cùng lớp)", "Điểm (nhiều em cùng điểm)"], answer: 0,
      explain: "Khóa chính phải xác định DUY NHẤT mỗi bản ghi và không trùng — chỉ mã học sinh thoả." },
    { id: "C-mc-35", type: "mc", topic: "C", grade: 11, level: "hard",
      question: "Câu lệnh SQL sau làm gì?",
      code: "UPDATE HOCSINH SET Diem = Diem + 1\nWHERE Lop = '11B';",
      options: ["Cộng thêm 1 điểm cho MỌI học sinh thuộc lớp 11B", "Xoá các học sinh lớp 11B", "Đặt điểm mọi học sinh bằng 1", "Thêm một học sinh mới vào lớp 11B"], answer: 0,
      explain: "UPDATE ... SET sửa dữ liệu; WHERE Lop='11B' giới hạn chỉ lớp 11B; Diem = Diem + 1 cộng thêm 1 cho từng em." },
    { id: "C-tf-5", type: "tf", topic: "C", grade: 11, level: "hard",
      question: "Xét về CSDL quan hệ và SQL. Đúng hay sai?",
      statements: [
        { text: "SELECT ... WHERE dùng để lọc bản ghi theo điều kiện", correct: true },
        { text: "ORDER BY dùng để sắp xếp kết quả truy vấn", correct: true },
        { text: "Khóa ngoài giúp liên kết dữ liệu giữa hai bảng", correct: true },
        { text: "Lệnh INSERT dùng để XOÁ một bảng", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: INSERT THÊM bản ghi; xoá dữ liệu là DELETE, xoá cả bảng là DROP TABLE." },

    /* ---------- G: Học máy / AI ---------- */
    { id: "G-mc-30", type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Hệ thống lọc email tự học từ hàng nghìn email đã được đánh dấu sẵn 'rác'/'không rác', rồi phân loại email mới. Đây là kiểu học nào?",
      options: ["Học có giám sát — vì dữ liệu huấn luyện đã có nhãn", "Học không giám sát — vì máy tự gom nhóm không nhãn", "Không phải học máy — chỉ lọc từ khóa", "Học tăng cường — vì có phần thưởng"], answer: 0,
      explain: "Dữ liệu đã dán nhãn sẵn (rác/không rác) → học CÓ giám sát." },
    { id: "G-mc-31", type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Vì sao khi dạy máy học, người ta chia dữ liệu thành phần HUẤN LUYỆN và phần KIỂM THỬ riêng?",
      options: ["Để kiểm tra mô hình trên dữ liệu MỚI chưa từng học, đánh giá khách quan", "Để máy học nhanh hơn", "Để tiết kiệm bộ nhớ", "Vì bắt buộc phải xoá bớt dữ liệu"], answer: 0,
      explain: "Nếu kiểm tra trên chính dữ liệu đã học thì điểm cao 'ảo'. Phần kiểm thử (dữ liệu mới) cho đánh giá khách quan mô hình có thực sự tổng quát." },

    /* ---------- F: đọc & truy vết code Python ---------- */
    { id: "F-mc-91", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Đoạn sau in ra số mấy?",
      code: "t = 0\nfor i in range(1, 5):\n    t += i * i\nprint(t)",
      options: ["30", "10", "20", "16"], answer: 0,
      explain: "range(1,5) = 1,2,3,4; cộng bình phương: 1 + 4 + 9 + 16 = 30." },
    { id: "F-mc-92", type: "mc", topic: "F", grade: 10, level: "hard",
      question: "Kết quả in ra là gì?",
      code: "s = \"abcdef\"\nr = \"\"\ni = len(s) - 1\nwhile i >= 0:\n    r += s[i]\n    i -= 2\nprint(r)",
      options: ["fdb", "fedcba", "ace", "abcdef"], answer: 0,
      explain: "i=5→'f', i=3→'d', i=1→'b', i=-1 dừng. Ghép lại: 'fdb' (lấy lùi mỗi 2 kí tự từ cuối)." },
    { id: "F-mc-93", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Kết quả in ra là gì?",
      code: "s = \"banana\"\nd = {}\nfor c in s:\n    d[c] = d.get(c, 0) + 1\nprint(d['a'], d['n'])",
      options: ["3 2", "2 3", "3 3", "1 1"], answer: 0,
      explain: "'banana' có 'a' xuất hiện 3 lần, 'n' 2 lần → in '3 2'. Mẫu đếm tần suất bằng dict.get." },
    { id: "F-mc-94", type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Kết quả in ra là gì?",
      code: "a = [5, 12, 7, 20, 3]\nb = [x for x in a if x % 2 == 0]\nprint(len(b), sum(b))",
      options: ["2 32", "3 15", "2 27", "5 47"], answer: 0,
      explain: "Lọc số chẵn: 12 và 20 → b có 2 phần tử, tổng 32 → in '2 32'." },
    { id: "F-tf-20", type: "tf", topic: "F", grade: 11, level: "hard",
      question: "Xét về danh sách và vòng lặp trong Python. Đúng hay sai?",
      statements: [
        { text: "range(1, n+1) tạo dãy 1, 2, ..., n", correct: true },
        { text: "a.append(x) thêm x vào cuối danh sách a", correct: true },
        { text: "Truy cập a[i] trong danh sách có chi phí như nhau dù i ở đâu (O(1))", correct: true },
        { text: "Chỉ số hợp lệ của danh sách n phần tử là từ 1 đến n", correct: false }],
      explain: "(a)(b)(c) đúng. (d) SAI: chỉ số Python từ 0 đến n−1; a[n] sẽ báo lỗi vượt phạm vi." }
  ];
  QUESTION_BANK.push.apply(QUESTION_BANK, Q);

  var LINK = {
    "S10-11": ["D-mc-16"], "S11-09": ["D-mc-17", "D-tf-5"], "S12-06": ["D-mc-18"], "S10-09": ["D-mc-19", "B-mc-30"],
    "S12-24": ["B-mc-28"], "S12-23": ["B-mc-29"], "S12-22": ["B-tf-6"],
    "S12-17": ["E-mc-45"], "S12-16": ["E-mc-46"], "S12-11": ["E-mc-47"], "S10-12": ["E-mc-48"], "S12-13": ["E-tf-8"],
    "S11-14": ["C-mc-33", "C-mc-35"], "S11-13": ["C-mc-34"], "S11-15": ["C-tf-5"],
    "S12-25": ["G-mc-30", "G-mc-31"],
    "S10-20": ["F-mc-91"], "S10-24": ["F-mc-92"], "S10-23": ["F-mc-93", "F-mc-94"], "S10-22": ["F-tf-20"]
  };
  if (typeof LESSONS !== "undefined") {
    Object.keys(LINK).forEach(function (id) {
      var L = LESSONS.filter(function (l) { return l.id === id; })[0];
      if (L) L.quiz = (L.quiz || []).concat(LINK[id]);
    });
  }
})();

/* ============================================================================
 *  3 ĐỀ THI THỬ CỐ ĐỊNH (biên soạn tay) — lắp từ ngân hàng câu hỏi có sẵn.
 *  Mỗi đề: 24 trắc nghiệm + 4 Đúng/Sai, ma trận KHMT (F nhiều nhất, trải mức
 *  Nhận biết/Thông hiểu/Vận dụng), 3 đề KHÔNG trùng câu. Có sẵn lời giải theo câu.
 *  Giao diện: bọc window.renderExamCodes (nạp sau) qua DOMContentLoaded để thêm
 *  mục "Đề biên soạn" — KHÔNG sửa index.html / app.js / exam-modes.js.
 * ==========================================================================*/
(function () {
  var EXAMS = [
    { name: "Đề thi thử số 1",
      mc: ["F-mc-1","F-mc-2","F-mc-3","F-mc-5","F-mc-6","F-mc-79","F-mc-80","F-mc-81",
           "E-mc-1","E-mc-2","E-mc-43","C-mc-1","C-mc-2","C-mc-31","B-mc-1","B-mc-2","B-mc-3",
           "A-mc-1","A-mc-2","A-mc-4","G-mc-1","G-mc-4","D-mc-1","D-mc-2"],
      tf: ["F-tf-1","F-tf-4","C-tf-4","B-tf-6"] },
    { name: "Đề thi thử số 2",
      mc: ["F-mc-4","F-mc-7","F-mc-8","F-mc-10","F-mc-11","F-mc-82","F-mc-83","F-mc-84",
           "E-mc-3","E-mc-5","E-mc-45","C-mc-6","C-mc-3","C-mc-33","B-mc-4","B-mc-6","B-mc-7",
           "A-mc-3","A-mc-6","A-mc-8","G-mc-3","G-mc-7","D-mc-5","D-mc-3"],
      tf: ["F-tf-2","F-tf-5","C-tf-5","E-tf-8"] },
    { name: "Đề thi thử số 3",
      mc: ["F-mc-9","F-mc-33","F-mc-12","F-mc-13","F-mc-15","F-mc-85","F-mc-86","F-mc-87",
           "E-mc-4","E-mc-7","E-mc-46","C-mc-7","C-mc-4","C-mc-34","B-mc-8","B-mc-9","B-mc-11",
           "A-mc-5","A-mc-10","A-mc-11","G-mc-5","G-mc-12","D-mc-8","D-mc-4"],
      tf: ["F-tf-3","F-tf-7","C-tf-1","G-tf-2"] }
  ];
  window.MOCK_EXAMS = EXAMS;

  function byId(id) { return (typeof QUESTION_BANK !== "undefined") && QUESTION_BANK.filter(function (q) { return q.id === id; })[0]; }
  function mins() { return (typeof EXAM_CONFIG !== "undefined" && EXAM_CONFIG.minutes) || 50; }

  function startMockExam(i) {
    var e = EXAMS[i]; if (!e || typeof newQuiz !== "function" || typeof State === "undefined") return;
    var qs = e.mc.concat(e.tf).map(byId).filter(Boolean);
    // code "TC1..TC3" để lưu được điểm cao nhất theo đề và bấm "Làm lại đề này"
    State.quiz = newQuiz(qs, "exam", { minutes: mins(), title: e.name, code: "TC" + (i + 1) });
    if (typeof go === "function") go("quiz");
  }
  window.startMockExam = startMockExam;

  function injectMockSection() {
    var app = document.getElementById("app"); if (!app) return;
    if (document.getElementById("mockExamBox")) return;
    // Màn thi thử mới đã hiện sẵn các đề tuyển chọn trong cùng một lưới -> khỏi chèn thêm
    if (document.getElementById("examFixedGrid")) return;
    var ic = (typeof ICON === "function") ? ICON("exam", 18) : "";
    var cards = EXAMS.map(function (e, i) {
      return '<button class="btn btn-ghost mock-btn" data-i="' + i + '" ' +
        'style="display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:14px 16px;height:auto">' +
        '<b>' + e.name + '</b>' +
        '<small style="color:var(--text-soft);font-weight:400">' + e.mc.length + ' trắc nghiệm + ' + e.tf.length + ' Đúng/Sai · ' + mins() + ' phút · có lời giải</small>' +
        '</button>';
    }).join("");
    var box = document.createElement("div");
    box.id = "mockExamBox";
    box.style.cssText = "margin:26px 0 4px";
    box.innerHTML = '<div class="section-title" style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' + ic + 'Đề biên soạn (cố định, có lời giải)</div>' +
      '<p style="color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px">Ba đề tuyển chọn tay, bám ma trận đề thật (Tin học KHMT). Mỗi đề luôn giữ nguyên câu để bạn so tiến bộ.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px">' + cards + '</div>';
    app.appendChild(box);
    box.querySelectorAll(".mock-btn").forEach(function (b) { b.onclick = function () { startMockExam(+b.dataset.i); }; });
  }

  function wrap() {
    if (typeof window.renderExamCodes === "function" && !window.renderExamCodes.__mockWrapped) {
      var orig = window.renderExamCodes;
      var wrapped = function () { var r = orig.apply(this, arguments); try { injectMockSection(); } catch (e) {} return r; };
      wrapped.__mockWrapped = true;
      window.renderExamCodes = wrapped;
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wrap);
  else wrap();
})();

/* ============================================================================
 *  MỞ RỘNG NGÂN HÀNG → ~500 CÂU (câu GỐC do sub-agent soạn, bám CT GDPT 2018).
 *  Dán câu KHÔNG có id — bộ nạp tự gán id nối tiếp theo max hiện tại của
 *  QUESTION_BANK (miễn nhiễm trùng CA-* và mọi thứ khác). Đợt A (A/F/G/B).
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var NEW = [
    /* ---- A · Máy tính, dữ liệu, số hoá (lớp 10) ---- */
    { type: "mc", topic: "A", grade: 10, level: "easy", question: "Phát biểu nào sau đây đúng về mối quan hệ giữa thông tin và dữ liệu?", options: ["Dữ liệu là thông tin đã được con người tiếp nhận và hiểu được", "Thông tin được thể hiện, lưu trữ và xử lí trong máy tính dưới dạng dữ liệu", "Thông tin và dữ liệu là hai khái niệm hoàn toàn giống nhau", "Dữ liệu chỉ tồn tại ở dạng các con số, còn thông tin ở dạng văn bản"], answer: 1, explain: "Thông tin đem lại hiểu biết cho con người; khi đưa vào máy tính, thông tin được biểu diễn thành dữ liệu (dãy bit) để lưu trữ và xử lí." },
    { type: "mc", topic: "A", grade: 10, level: "easy", question: "Theo quy ước thường dùng trong tin học, phát biểu nào sau đây đúng về đơn vị đo lượng dữ liệu?", options: ["1 byte = 8 bit", "1 bit có thể lưu được một trong 256 giá trị khác nhau", "1 KB = 1024 MB", "1 byte = 1024 bit"], answer: 0, explain: "1 byte = 8 bit. 1 bit chỉ nhận 1 trong 2 giá trị (0 hoặc 1); 1 MB = 1024 KB (không phải 1 KB = 1024 MB)." },
    { type: "mc", topic: "A", grade: 10, level: "easy", question: "Thiết bị nào sau đây KHÔNG phải là thiết bị số?", options: ["Điện thoại thông minh (smartphone)", "Máy tính bảng", "Đồng hồ cát", "Máy ảnh kĩ thuật số"], answer: 2, explain: "Đồng hồ cát là thiết bị cơ học, không xử lí dữ liệu số. Ba thiết bị còn lại đều tiếp nhận, lưu trữ và xử lí thông tin dưới dạng dữ liệu số." },
    { type: "mc", topic: "A", grade: 10, level: "medium", question: "Số thập phân 45 được biểu diễn trong hệ nhị phân là:", options: ["101101", "110101", "101011", "100101"], answer: 0, explain: "45 = 32 + 8 + 4 + 1 = 101101₂. (110101₂ = 53, 101011₂ = 43, 100101₂ = 37.)" },
    { type: "mc", topic: "A", grade: 10, level: "medium", question: "Cho hai biến lôgic A và B. Biểu thức A AND B nhận giá trị Đúng (True) khi nào?", options: ["Khi ít nhất một trong hai biến A, B có giá trị Đúng", "Khi cả hai biến A và B đều có giá trị Đúng", "Khi cả hai biến A và B đều có giá trị Sai", "Khi hai biến A và B có giá trị khác nhau"], answer: 1, explain: "Phép AND chỉ cho kết quả Đúng khi tất cả toán hạng đều Đúng. 'Ít nhất một Đúng' là OR; 'khác nhau' là XOR." },
    { type: "mc", topic: "A", grade: 10, level: "medium", question: "Trong số hoá hình ảnh, nếu mỗi điểm ảnh (pixel) được biểu diễn bằng 8 bit thì thể hiện được tối đa bao nhiêu màu?", options: ["8 màu", "16 màu", "256 màu", "512 màu"], answer: 2, explain: "Với n bit, số màu tối đa là 2ⁿ. Với 8 bit: 2⁸ = 256 màu." },
    { type: "mc", topic: "A", grade: 10, level: "medium", question: "Phát biểu nào sau đây đúng khi so sánh bảng mã ASCII và Unicode?", options: ["ASCII dùng nhiều bit hơn Unicode nên mã hoá được nhiều kí tự hơn", "Unicode chỉ mã hoá được các chữ cái tiếng Anh", "Unicode có thể mã hoá kí tự của hầu hết các ngôn ngữ trên thế giới, trong đó có tiếng Việt", "ASCII và Unicode đều chỉ mã hoá được đúng 128 kí tự"], answer: 2, explain: "Unicode dùng nhiều bit hơn (từ 16 bit trở lên) nên mã hoá được rất nhiều kí tự đa ngôn ngữ, kể cả tiếng Việt có dấu. ASCII chuẩn chỉ có 128 kí tự." },
    { type: "mc", topic: "A", grade: 10, level: "hard", question: "Một bức ảnh số có kích thước 640 × 480 điểm ảnh, mỗi điểm ảnh mã hoá bằng 8 bit màu. Bỏ qua thông tin quản lí, dung lượng ảnh xấp xỉ bao nhiêu? (1 KB = 1024 byte)", options: ["150 KB", "300 KB", "600 KB", "2400 KB"], answer: 1, explain: "Dung lượng = (640 × 480 × 8) ÷ 8 = 307 200 byte = 307 200 ÷ 1024 = 300 KB. 2400 KB là do quên chia 8 (đổi bit sang byte)." },
    { type: "mc", topic: "A", grade: 10, level: "hard", question: "Thực hiện phép cộng hai số trong hệ nhị phân: 1011₂ + 1101₂. Kết quả (hệ nhị phân) là:", options: ["10100", "11000", "11100", "10110"], answer: 1, explain: "1011₂ = 11, 1101₂ = 13; 11 + 13 = 24 = 11000₂." },
    { type: "tf", topic: "A", grade: 10, level: "medium", question: "Cho các phát biểu về biểu diễn dữ liệu trong máy tính. Xác định mỗi phát biểu là Đúng hay Sai.", statements: [{ text: "Mọi dữ liệu (văn bản, hình ảnh, âm thanh) khi đưa vào máy tính đều được biểu diễn dưới dạng dãy bit 0 và 1.", correct: true }, { text: "Số nguyên 19 trong hệ thập phân được biểu diễn trong hệ nhị phân là 10011.", correct: true }, { text: "Với 4 bit, có thể biểu diễn được tối đa 15 giá trị khác nhau.", correct: false }, { text: "Trong máy tính, một kí tự thuộc bảng mã ASCII được lưu trữ bằng 2 byte.", correct: false }], explain: "Ý (3) sai: với 4 bit biểu diễn được 2⁴ = 16 giá trị (0000..1111). Ý (4) sai: kí tự ASCII lưu bằng 1 byte; 2 byte là của Unicode (UTF-16). Ý (1), (2) đúng (19 = 10011₂)." },
    { type: "tf", topic: "A", grade: 10, level: "medium", question: "Cho các phát biểu về số hoá âm thanh và hình ảnh. Xác định mỗi phát biểu là Đúng hay Sai.", statements: [{ text: "Điểm ảnh (pixel) là thành phần nhỏ nhất tạo nên một bức ảnh số.", correct: true }, { text: "Tần số lấy mẫu âm thanh càng cao thì chất lượng âm thanh số càng tốt (càng gần âm gốc).", correct: true }, { text: "Số hoá là quá trình chuyển thông tin từ dạng số (dãy bit) sang dạng tín hiệu liên tục (analog).", correct: false }, { text: "Với hai ảnh cùng kích thước, ảnh dùng 24 bit màu cho mỗi điểm ảnh có dung lượng lớn hơn ảnh dùng 8 bit màu.", correct: true }], explain: "Ý (3) sai: số hoá là chuyển từ tín hiệu liên tục (analog) sang dạng số rời rạc, tức chiều ngược lại. Các ý còn lại đúng." },
    { type: "tf", topic: "A", grade: 10, level: "hard", question: "Cho các phát biểu liên quan đến phép toán lôgic và tính toán nhị phân. Xác định Đúng/Sai.", statements: [{ text: "Với A = Đúng, B = Sai thì biểu thức (A OR B) AND (NOT B) có giá trị Đúng.", correct: true }, { text: "Với A = Sai, B = Sai thì biểu thức NOT(A AND B) có giá trị Sai.", correct: false }, { text: "Số nhị phân 11111₂ bằng số thập phân 31.", correct: true }, { text: "Một tệp âm thanh mono tần số lấy mẫu 8000 Hz, mỗi mẫu 8 bit, dài 10 giây thì dung lượng khoảng 80 000 byte (chưa nén).", correct: true }], explain: "Ý (2) sai: A AND B = Sai nên NOT(A AND B) = Đúng. Còn lại đúng: (1) Đúng AND Đúng = Đúng; (3) 11111₂ = 31; (4) 8000 × 8 × 10 ÷ 8 = 80 000 byte." },

    /* ---- F · Python cơ bản (lớp 10) ---- */
    { type: "mc", topic: "F", grade: 10, level: "easy", question: "Trong Python, kết quả của biểu thức 7 / 2 thuộc kiểu dữ liệu nào?", options: ["float", "int", "str", "bool"], answer: 0, explain: "Phép chia / luôn trả về số thực (float); 7 / 2 cho 3.5 kiểu float." },
    { type: "mc", topic: "F", grade: 10, level: "easy", question: "Trong Python, phép toán nào cho kết quả là phần dư của phép chia hai số nguyên?", options: ["//", "%", "/", "**"], answer: 1, explain: "% là phép lấy phần dư (modulo). // lấy phần nguyên, / là chia thực, ** là lũy thừa." },
    { type: "mc", topic: "F", grade: 10, level: "easy", question: "Cho danh sách a = [10, 20, 30]. Lệnh nào dùng để thêm phần tử 40 vào cuối danh sách?", options: ["a.add(40)", "a.push(40)", "a.append(40)", "a.insert(40)"], answer: 2, explain: "append() thêm một phần tử vào cuối danh sách. List trong Python không có add hay push; insert cần thêm chỉ số vị trí." },
    { type: "mc", topic: "F", grade: 10, level: "medium", question: "Đoạn chương trình sau in ra kết quả gì?", code: "x = 5\ny = 2\nprint(x // y, x % y)", options: ["2.5 1", "3 1", "2 2", "2 1"], answer: 3, explain: "// lấy phần nguyên: 5 // 2 = 2; % lấy phần dư: 5 % 2 = 1. print ngăn cách bằng dấu cách nên in '2 1'." },
    { type: "mc", topic: "F", grade: 10, level: "medium", question: "Đoạn chương trình sau in ra gì?", code: "n = 15\nif n % 3 == 0 and n % 5 == 0:\n    print(\"A\")\nelif n % 3 == 0:\n    print(\"B\")\nelse:\n    print(\"C\")", options: ["A", "B", "C", "Chương trình báo lỗi"], answer: 0, explain: "15 chia hết cho cả 3 và 5 nên điều kiện đầu đúng, in 'A'; các nhánh elif, else bị bỏ qua." },
    { type: "mc", topic: "F", grade: 10, level: "medium", question: "Kết quả in ra màn hình của đoạn chương trình sau là gì?", code: "s = 0\nfor i in range(1, 5):\n    s = s + i\nprint(s)", options: ["15", "10", "6", "5"], answer: 1, explain: "range(1, 5) gồm 1, 2, 3, 4. Tổng s = 1 + 2 + 3 + 4 = 10." },
    { type: "mc", topic: "F", grade: 10, level: "medium", question: "Đoạn chương trình sau in ra gì?", code: "s = \"Python\"\nprint(s[1:4])", options: ["ytho", "Pyt", "yth", "yt"], answer: 2, explain: "Cắt lát s[1:4] lấy các kí tự ở chỉ số 1, 2, 3 (không lấy chỉ số 4): 'y', 't', 'h' → 'yth'." },
    { type: "mc", topic: "F", grade: 10, level: "medium", question: "Khi chạy, đoạn chương trình sau gặp vấn đề gì? (giả sử người dùng nhập hai số nguyên)", code: "a = int(input())\nb = int(input())\nprint(\"Tong la: \" + a + b)", options: ["Lỗi cú pháp do thiếu dấu hai chấm", "Không có lỗi; chương trình in ra tổng của a và b", "Lỗi vì biến chưa được khai báo", "Lỗi kiểu dữ liệu (TypeError): không thể dùng dấu + để nối chuỗi với số nguyên"], answer: 3, explain: "a, b là số nguyên nên \"Tong la: \" + a nối chuỗi với int gây TypeError. Cần dùng str(a + b) hoặc dùng dấu phẩy trong print." },
    { type: "mc", topic: "F", grade: 10, level: "hard", question: "Đoạn chương trình sau in ra giá trị nào?", code: "n = 20\ndem = 0\nwhile n > 1:\n    n = n // 2\n    dem = dem + 1\nprint(dem)", options: ["4", "5", "3", "6"], answer: 0, explain: "n giảm 20 → 10 → 5 → 2 → 1, mỗi lần chia đôi thì dem tăng 1. Sau 4 lần n = 1 nên vòng lặp dừng, in 4." },
    { type: "mc", topic: "F", grade: 10, level: "hard", question: "Sau khi chạy, danh sách a được in ra là gì?", code: "a = [1, 2, 3]\na.append(4)\na.insert(1, 9)\na.pop()\nprint(a)", options: ["[1, 9, 2, 3, 4]", "[1, 9, 2, 3]", "[1, 2, 3, 9]", "[9, 1, 2, 3]"], answer: 1, explain: "append(4) → [1, 2, 3, 4]; insert(1, 9) chèn 9 vào chỉ số 1 → [1, 9, 2, 3, 4]; pop() xóa phần tử cuối → [1, 9, 2, 3]." },
    { type: "mc", topic: "F", grade: 10, level: "hard", question: "Đoạn chương trình sau in ra kết quả nào?", code: "def f(a, b):\n    if a > b:\n        return a - b\n    return b - a\n\nprint(f(3, 7) + f(10, 4))", options: ["-2", "2", "10", "4"], answer: 2, explain: "f(3, 7): 3 > 7 sai nên trả 7 - 3 = 4; f(10, 4): 10 > 4 đúng nên trả 10 - 4 = 6; tổng = 4 + 6 = 10." },
    { type: "mc", topic: "F", grade: 10, level: "hard", question: "Kết quả in ra của đoạn chương trình sau là gì?", code: "kq = []\nfor i in range(1, 6):\n    if i % 2 == 0:\n        kq.append(i * i)\nprint(kq)", options: ["[1, 9, 25]", "[4, 16, 36]", "[2, 4]", "[4, 16]"], answer: 3, explain: "range(1, 6) là 1..5; chỉ 2 và 4 thỏa i % 2 == 0 nên thêm bình phương: 4, 16 → [4, 16]." },
    { type: "mc", topic: "F", grade: 10, level: "hard", question: "Điều gì xảy ra khi chạy đoạn chương trình sau?", code: "x = 10\ndef tang():\n    x = x + 5\n    print(x)\n\ntang()", options: ["In ra 15", "In ra 10", "In ra 5", "Báo lỗi (UnboundLocalError) vì x là biến cục bộ nhưng chưa có giá trị khi tính x + 5"], answer: 3, explain: "Do có phép gán x = ... bên trong hàm nên x được coi là biến cục bộ; khi tính x + 5, biến cục bộ x chưa có giá trị → UnboundLocalError. Biến toàn cục x = 10 không được dùng." },

    /* ---- A · Hệ điều hành & phần cứng (lớp 11) ---- */
    { type: "mc", topic: "A", grade: 11, level: "easy", question: "Windows, macOS, Linux và Android là các ví dụ tiêu biểu cho loại phần mềm nào?", options: ["Phần mềm ứng dụng", "Hệ điều hành", "Phần mềm diệt virus", "Ngôn ngữ lập trình"], answer: 1, explain: "Đây đều là hệ điều hành - phần mềm hệ thống quản lí phần cứng, tài nguyên và làm nền để chạy các phần mềm ứng dụng khác." },
    { type: "mc", topic: "A", grade: 11, level: "easy", question: "Theo quy ước thường dùng trong tin học, 1 GB bằng bao nhiêu MB?", options: ["1024 MB", "10 MB", "100 MB", "512 MB"], answer: 0, explain: "Các đơn vị đo quy đổi theo bội số 1024: 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB." },
    { type: "mc", topic: "A", grade: 11, level: "medium", question: "Phát biểu nào sau đây mô tả ĐÚNG về RAM (bộ nhớ truy cập ngẫu nhiên)?", options: ["RAM lưu trữ dữ liệu lâu dài, không bị mất khi tắt máy", "RAM là bộ nhớ chỉ đọc, người dùng không ghi được dữ liệu vào", "RAM là bộ nhớ trong, lưu tạm dữ liệu của chương trình đang chạy và mất dữ liệu khi tắt nguồn", "RAM có tốc độ truy cập chậm hơn ổ cứng"], answer: 2, explain: "RAM là bộ nhớ trong có tính khả biến: tốc độ nhanh, lưu tạm dữ liệu và lệnh của chương trình đang chạy, mất toàn bộ dữ liệu khi tắt nguồn. Lưu trữ lâu dài là của bộ nhớ ngoài; 'chỉ đọc' là ROM." },
    { type: "mc", topic: "A", grade: 11, level: "medium", question: "Đặc điểm cốt lõi để nhận biết một phần mềm nguồn mở là gì?", options: ["Không cho phép sao chép hay phân phối dưới mọi hình thức", "Mã nguồn được công khai, người dùng có thể xem, sửa đổi và phân phối lại theo các điều khoản của giấy phép", "Chỉ cài đặt và chạy được trên hệ điều hành Windows", "Luôn phải mua bản quyền thì mới được cài đặt"], answer: 1, explain: "Phần mềm nguồn mở đặc trưng bởi việc công khai mã nguồn, cho phép người dùng xem, chỉnh sửa và phân phối lại theo giấy phép (ví dụ GPL)." },
    { type: "mc", topic: "A", grade: 11, level: "medium", question: "Khi cắm một chiếc máy in mới vào máy tính, đôi khi hệ thống thông báo cần cài đặt 'driver'. Driver ở đây là gì?", options: ["Một loại cáp chuyên dụng để nối máy in với máy tính", "Phần mềm giúp hệ điều hành nhận biết và điều khiển đúng thiết bị phần cứng", "Bộ nhớ đệm giúp máy in in nhanh hơn", "Tài khoản người dùng bắt buộc để được phép in"], answer: 1, explain: "Driver (trình điều khiển) là phần mềm trung gian giúp hệ điều hành 'hiểu' và điều khiển đúng một thiết bị phần cứng cụ thể." },
    { type: "mc", topic: "A", grade: 11, level: "medium", question: "Bạn muốn kết nối một chiếc tai nghe không dây với điện thoại thông minh. Công nghệ kết nối phù hợp nhất là:", options: ["Cổng HDMI", "Cổng USB", "Bluetooth", "Cổng Ethernet (LAN)"], answer: 2, explain: "Bluetooth là công nghệ kết nối không dây tầm ngắn, phù hợp cho tai nghe, chuột, loa. HDMI/USB là kết nối có dây, Ethernet để nối mạng có dây." },
    { type: "mc", topic: "A", grade: 11, level: "hard", question: "Khi RAM không đủ chỗ cho các chương trình đang chạy, hệ điều hành có thể dùng một phần ổ cứng làm 'bộ nhớ ảo' để tạm lưu dữ liệu. Việc điều phối này thể hiện chức năng nào của hệ điều hành?", options: ["Quản lí tệp và thư mục", "Quản lí bộ nhớ", "Quản lí thiết bị vào/ra", "Quản lí giao diện người dùng"], answer: 1, explain: "Cấp phát, thu hồi và mở rộng không gian nhớ (kể cả dùng bộ nhớ ảo trên ổ cứng khi RAM đầy) cho các tiến trình là nhiệm vụ của chức năng quản lí bộ nhớ." },
    { type: "mc", topic: "A", grade: 11, level: "hard", question: "Một ổ SSD có dung lượng 512 GB. Bỏ qua dung lượng dành cho hệ thống, nếu mỗi tệp ảnh trung bình 4 MB thì ổ chứa khoảng bao nhiêu tệp ảnh? (1 GB = 1024 MB)", options: ["Khoảng 131 072 tệp", "Khoảng 128 000 tệp", "Khoảng 128 tệp", "Khoảng 524 288 tệp"], answer: 0, explain: "512 GB = 512 × 1024 = 524 288 MB. Số tệp ≈ 524 288 ÷ 4 = 131 072. 128 000 là do nhầm 1 GB = 1000 MB; 128 là do quên đổi GB ra MB." },
    { type: "mc", topic: "A", grade: 11, level: "hard", question: "Điểm khác biệt cốt lõi giữa phần mềm nguồn mở (open source) và phần mềm miễn phí (freeware) là gì?", options: ["Phần mềm nguồn mở luôn có phí, còn freeware thì luôn miễn phí", "Phần mềm nguồn mở công khai mã nguồn và cho phép sửa đổi, còn freeware được dùng miễn phí nhưng thường không công khai mã nguồn", "Freeware cho phép chỉnh sửa mã nguồn, còn phần mềm nguồn mở thì không", "Cả hai đều bắt buộc người dùng phải trả phí bản quyền mới được dùng"], answer: 1, explain: "Tiêu chí phân biệt là quyền với mã nguồn chứ không phải giá tiền. Freeware miễn phí dùng nhưng thường đóng mã nguồn; phần mềm nguồn mở công khai mã nguồn, cho xem-sửa-phân phối lại." },
    { type: "tf", topic: "A", grade: 11, level: "medium", question: "Xét các phát biểu về những thành phần bên trong máy tính:", statements: [{ text: "CPU thực hiện các phép tính số học, logic và điều khiển chung hoạt động của máy tính.", correct: true }, { text: "Bo mạch chủ (mainboard) là bảng mạch chính kết nối và cho phép các linh kiện như CPU, RAM trao đổi dữ liệu với nhau.", correct: true }, { text: "RAM vẫn giữ nguyên toàn bộ dữ liệu sau khi máy tính bị tắt nguồn.", correct: false }, { text: "Ổ cứng SSD và HDD đều là bộ nhớ ngoài dùng để lưu trữ dữ liệu lâu dài.", correct: true }], explain: "Ý (3) sai: RAM khả biến nên mất dữ liệu khi tắt nguồn; lưu lâu dài phải dùng HDD/SSD. Các ý (1), (2), (4) đúng." },
    { type: "tf", topic: "A", grade: 11, level: "medium", question: "Xét các phát biểu về phần mềm nguồn mở và phần mềm chạy trên Internet:", statements: [{ text: "Phần mềm nguồn mở cho phép người dùng xem và chỉnh sửa mã nguồn của chương trình.", correct: true }, { text: "Mọi phần mềm nguồn mở đều bắt buộc người dùng phải trả phí bản quyền.", correct: false }, { text: "Phần mềm chạy trên Internet (ứng dụng đám mây) thường dùng ngay qua trình duyệt mà không cần cài đặt.", correct: true }, { text: "Ưu điểm của phần mềm đám mây là vẫn hoạt động tốt ngay cả khi máy không có kết nối Internet.", correct: false }], explain: "Ý (2) sai: nguồn mở thường miễn phí, không bắt buộc trả phí bản quyền. Ý (4) sai: phần mềm đám mây phụ thuộc kết nối mạng, mất mạng thường không dùng được." },
    { type: "tf", topic: "A", grade: 11, level: "hard", question: "Xét các phát biểu về hệ điều hành và việc kết nối thiết bị số:", statements: [{ text: "Giao diện dòng lệnh và giao diện đồ họa (GUI) đều là các dạng giao diện người dùng của hệ điều hành.", correct: true }, { text: "Đa nhiệm cho phép hệ điều hành luân phiên thực hiện nhiều tiến trình, tạo cảm giác chúng cùng chạy đồng thời.", correct: true }, { text: "Cổng USB chỉ có thể truyền dữ liệu, hoàn toàn không thể cấp nguồn điện cho thiết bị.", correct: false }, { text: "Hệ điều hành không cần bất kì trình điều khiển (driver) nào vẫn có thể điều khiển tối ưu mọi thiết bị phần cứng mới.", correct: false }], explain: "Ý (3) sai: USB vừa truyền dữ liệu vừa cấp nguồn (sạc điện thoại, cấp điện chuột/bàn phím). Ý (4) sai: để nhận và điều khiển tối ưu thiết bị, hệ điều hành thường cần driver tương ứng. Ý (1), (2) đúng." },

    /* ---- G · AI / Học máy / KHDL / Mô phỏng (lớp 12) ---- */
    { type: "mc", topic: "G", grade: 12, level: "easy", question: "Ứng dụng nào sau đây là ví dụ điển hình của trợ lí ảo có sử dụng trí tuệ nhân tạo (AI)?", options: ["Máy tính bỏ túi thực hiện phép nhân hai số", "Phần mềm soạn thảo văn bản đếm số từ trong bài", "Trợ lí ảo Google Assistant nghe và trả lời câu hỏi bằng giọng nói", "Đồng hồ báo thức reo đúng giờ đã đặt sẵn"], answer: 2, explain: "Trợ lí ảo như Google Assistant dùng AI để nhận dạng giọng nói và xử lí ngôn ngữ tự nhiên. Ba phương án còn lại chỉ thực hiện thao tác cố định." },
    { type: "mc", topic: "G", grade: 12, level: "easy", question: "Học có giám sát (supervised learning) sử dụng loại dữ liệu nào để huấn luyện mô hình?", options: ["Dữ liệu đã được gán nhãn (biết trước kết quả mong muốn)", "Dữ liệu hoàn toàn không có nhãn", "Dữ liệu chỉ gồm hình ảnh", "Dữ liệu ngẫu nhiên không liên quan đến bài toán"], answer: 0, explain: "Học có giám sát cần dữ liệu đã gán nhãn để mô hình học mối liên hệ giữa đầu vào và đầu ra. Dữ liệu không nhãn là của học không giám sát." },
    { type: "mc", topic: "G", grade: 12, level: "easy", question: "Trong đặc trưng 5V của dữ liệu lớn (Big Data), đặc trưng Volume chỉ điều gì?", options: ["Tốc độ dữ liệu được tạo ra và xử lí", "Độ tin cậy, chính xác của dữ liệu", "Sự đa dạng về kiểu dữ liệu", "Khối lượng (số lượng) dữ liệu rất lớn"], answer: 3, explain: "Volume nghĩa là khối lượng dữ liệu khổng lồ. Tốc độ là Velocity, độ tin cậy là Veracity, đa dạng là Variety." },
    { type: "mc", topic: "G", grade: 12, level: "easy", question: "Thí nghiệm ảo (mô phỏng trên máy tính) mang lại lợi ích nào so với thí nghiệm thật?", options: ["Luôn cho kết quả khác hẳn với thực tế", "Bắt buộc phải có phòng thí nghiệm đắt tiền", "An toàn, tiết kiệm chi phí và có thể làm lại nhiều lần", "Không thể quan sát được hiện tượng đang xảy ra"], answer: 2, explain: "Mô phỏng giúp thí nghiệm an toàn, tiết kiệm chi phí và lặp lại tùy ý, ví dụ trên phần mềm PhET." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Một hệ thống AI sàng lọc hồ sơ tuyển dụng thường xuyên loại hồ sơ của ứng viên nữ, do được huấn luyện chủ yếu trên dữ liệu nhân viên nam trong quá khứ. Hiện tượng này gọi là gì?", options: ["Thiên lệch (bias) bắt nguồn từ dữ liệu huấn luyện", "Lỗi hỏng hóc phần cứng của máy tính", "Tốc độ xử lí của hệ thống quá chậm", "Thiếu dung lượng lưu trữ dữ liệu"], answer: 0, explain: "Khi dữ liệu huấn luyện phản ánh định kiến hoặc mất cân bằng, mô hình AI sẽ học và lặp lại thiên lệch đó (bias) - một vấn đề đạo đức AI quan trọng." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Bài toán nào sau đây phù hợp với học KHÔNG giám sát (unsupervised learning)?", options: ["Dự đoán giá nhà dựa trên tập dữ liệu giá nhà đã biết", "Phân loại email là spam hay không spam dựa trên các email đã gán nhãn", "Nhận dạng chữ số viết tay dựa trên tập ảnh đã biết đáp án", "Phân nhóm khách hàng thành các cụm có hành vi mua sắm tương tự khi chưa có nhãn"], answer: 3, explain: "Học không giám sát làm việc với dữ liệu không nhãn, điển hình là phân cụm (clustering). Các phương án còn lại đều có nhãn nên thuộc học có giám sát." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Trong quy trình học máy, tập dữ liệu kiểm thử (test data) được dùng để làm gì?", options: ["Để mô hình học các quy luật ban đầu từ dữ liệu", "Để đánh giá khả năng hoạt động của mô hình trên dữ liệu mới, chưa từng thấy", "Để tăng thêm dung lượng lưu trữ cho hệ thống", "Để thay thế hoàn toàn cho tập dữ liệu huấn luyện"], answer: 1, explain: "Dữ liệu huấn luyện để mô hình học; dữ liệu kiểm thử (tách riêng, chưa từng thấy) để đánh giá độ chính xác và khả năng khái quát của mô hình." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Thứ tự các bước cơ bản trong quy trình khoa học dữ liệu là gì?", options: ["Phân tích dữ liệu → Thu thập dữ liệu → Làm sạch dữ liệu", "Thu thập dữ liệu → Làm sạch dữ liệu → Phân tích dữ liệu", "Làm sạch dữ liệu → Phân tích dữ liệu → Thu thập dữ liệu", "Phân tích dữ liệu → Làm sạch dữ liệu → Thu thập dữ liệu"], answer: 1, explain: "Quy trình bắt đầu bằng thu thập dữ liệu, sau đó làm sạch (xử lí lỗi, thiếu, trùng lặp), rồi phân tích và trực quan hoá để rút ra tri thức." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Đặc trưng Veracity (tính xác thực) trong 5V của dữ liệu lớn đề cập đến điều gì?", options: ["Tốc độ dữ liệu được sinh ra rất nhanh", "Khối lượng dữ liệu khổng lồ cần lưu trữ", "Giá trị kinh tế mà dữ liệu mang lại", "Độ tin cậy, chính xác và đúng đắn của dữ liệu"], answer: 3, explain: "Veracity chỉ mức độ tin cậy, chính xác của dữ liệu. Tốc độ là Velocity, khối lượng là Volume, giá trị là Value." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Phát biểu nào sau đây mô tả ĐÚNG bản chất của mô phỏng (simulation) trên máy tính?", options: ["Là việc sao chép y hệt toàn bộ mọi chi tiết của thế giới thực", "Là việc dùng mô hình để tái hiện, thử nghiệm một hệ thống hoặc hiện tượng trong môi trường ảo", "Là việc chụp ảnh lại hiện tượng có thật ngoài đời", "Là việc lưu trữ dữ liệu lớn trên nền tảng đám mây"], answer: 1, explain: "Mô phỏng dùng mô hình (đã đơn giản hoá, giữ lại yếu tố quan trọng) để tái hiện và thử nghiệm hệ thống trong môi trường ảo, không sao chép y hệt mọi chi tiết." },
    { type: "mc", topic: "G", grade: 12, level: "hard", question: "Một bệnh viện có tập hồ sơ gồm các chỉ số xét nghiệm của bệnh nhân, mỗi hồ sơ đã ghi rõ mắc bệnh hay không mắc bệnh. Bệnh viện muốn xây mô hình dự đoán bệnh cho bệnh nhân mới. Đây là kiểu học máy nào và vì sao?", options: ["Học không giám sát, vì mỗi hồ sơ có nhiều chỉ số xét nghiệm", "Học không giám sát, vì mục tiêu là phân nhóm các bệnh nhân", "Học có giám sát, vì dữ liệu huấn luyện đã có nhãn (mắc / không mắc bệnh)", "Không phải học máy, vì đây chỉ là thao tác tra cứu dữ liệu"], answer: 2, explain: "Dữ liệu đã có nhãn kết quả (mắc / không mắc) và mục tiêu là dự đoán nhãn cho dữ liệu mới nên đây là bài toán phân loại thuộc học có giám sát." },
    { type: "mc", topic: "G", grade: 12, level: "hard", question: "Một nền tảng xem phim trực tuyến muốn tự động chia hàng triệu người dùng thành các nhóm có sở thích tương tự, nhưng KHÔNG có sẵn danh sách nhóm hay nhãn nào. Thuật toán phù hợp thuộc kiểu học máy nào?", options: ["Học không giám sát, vì dữ liệu không có nhãn và mục tiêu là tự phân cụm", "Học có giám sát, vì số lượng người dùng rất lớn", "Học có giám sát, vì cần dự đoán sở thích của người dùng", "Mô phỏng, vì nội dung có liên quan đến phim ảnh"], answer: 0, explain: "Không có nhãn hay nhóm định sẵn và mục tiêu là tự tìm ra các cụm tương tự nên đây là phân cụm (clustering) của học không giám sát." },
    { type: "tf", topic: "G", grade: 12, level: "medium", question: "Về trí tuệ nhân tạo (AI) và các ứng dụng của nó, xét các phát biểu sau:", statements: [{ text: "Dịch tự động như Google Dịch là một ứng dụng của AI.", correct: true }, { text: "Hệ thống gợi ý sản phẩm trên các trang mua sắm trực tuyến có sử dụng AI.", correct: true }, { text: "AI hiện nay đã có ý thức và cảm xúc thật sự giống hệt con người.", correct: false }, { text: "Nhận dạng khuôn mặt để mở khoá điện thoại là một ứng dụng của AI.", correct: true }], explain: "Ý sai là 'AI đã có ý thức và cảm xúc thật sự giống hệt con người'. AI hiện tại là AI hẹp, chỉ giỏi ở nhiệm vụ cụ thể, không có ý thức, cảm xúc thật. Ba ứng dụng còn lại đều là ví dụ của AI." },
    { type: "tf", topic: "G", grade: 12, level: "medium", question: "Về dữ liệu lớn (Big Data) và đặc trưng 5V, xét các phát biểu sau:", statements: [{ text: "Volume chỉ khối lượng dữ liệu rất lớn cần lưu trữ và xử lí.", correct: true }, { text: "Velocity chỉ tốc độ dữ liệu được sinh ra và xử lí.", correct: true }, { text: "Variety nghĩa là dữ liệu chỉ gồm một kiểu duy nhất là văn bản.", correct: false }, { text: "Value chỉ giá trị hữu ích rút ra được từ dữ liệu.", correct: true }], explain: "Ý sai là 'Variety nghĩa là dữ liệu chỉ gồm một kiểu duy nhất là văn bản'. Variety là tính đa dạng: nhiều kiểu như văn bản, hình ảnh, âm thanh, video. Các ý còn lại đúng." },
    { type: "tf", topic: "G", grade: 12, level: "hard", question: "Một công ty thương mại điện tử triển khai hai dự án học máy. Xét các phát biểu sau:", statements: [{ text: "Dự án lọc email spam dựa trên tập email đã đánh dấu sẵn spam / không spam là học có giám sát.", correct: true }, { text: "Dự án tự động chia khách hàng thành các nhóm dựa trên hành vi mua sắm khi chưa có nhãn nhóm là học không giám sát.", correct: true }, { text: "Trong học có giám sát, dữ liệu huấn luyện không cần phải có nhãn.", correct: false }, { text: "Phân cụm (clustering) là một dạng bài toán tiêu biểu của học không giám sát.", correct: true }], explain: "Ý sai là 'Trong học có giám sát, dữ liệu huấn luyện không cần có nhãn'. Học có giám sát bắt buộc cần dữ liệu đã gán nhãn. Các phát biểu còn lại đều đúng." },
    { type: "tf", topic: "G", grade: 12, level: "hard", question: "Về quy trình khoa học dữ liệu và học máy, xét các phát biểu sau:", statements: [{ text: "Làm sạch dữ liệu bao gồm việc xử lí dữ liệu thiếu, sai và loại bỏ dữ liệu trùng lặp.", correct: true }, { text: "Có thể dùng chính tập dữ liệu huấn luyện làm tập kiểm thử để đánh giá mô hình một cách khách quan.", correct: false }, { text: "Trực quan hoá dữ liệu bằng biểu đồ, đồ thị giúp con người dễ nhận ra quy luật, xu hướng trong dữ liệu.", correct: true }, { text: "Mục tiêu cuối cùng của khoa học dữ liệu là khám phá tri thức có ích từ dữ liệu.", correct: true }], explain: "Ý sai là 'dùng chính dữ liệu huấn luyện làm kiểm thử để đánh giá khách quan'. Kiểm thử trên dữ liệu đã học cho kết quả cao giả tạo nên phải tách riêng tập kiểm thử. Ba phát biểu còn lại đúng." },
    { type: "tf", topic: "G", grade: 12, level: "hard", question: "Về mô phỏng và các vấn đề đạo đức của AI, xét các phát biểu sau:", statements: [{ text: "Mô phỏng ảo cho phép thử nghiệm những tình huống nguy hiểm như phản ứng hoá học độc hại mà không gây rủi ro thực tế.", correct: true }, { text: "Một lợi ích của mô phỏng là có thể lặp lại thí nghiệm nhiều lần với chi phí thấp.", correct: true }, { text: "Việc thu thập và sử dụng dữ liệu cá nhân để huấn luyện AI không đặt ra bất kì vấn đề nào về quyền riêng tư.", correct: false }, { text: "Thiên lệch (bias) trong dữ liệu huấn luyện có thể khiến AI đưa ra quyết định thiếu công bằng.", correct: true }], explain: "Ý sai là 'thu thập và dùng dữ liệu cá nhân không đặt ra vấn đề quyền riêng tư'. Điều này đặt ra nhiều vấn đề về quyền riêng tư và phải tuân thủ quy định bảo vệ dữ liệu. Các phát biểu còn lại đúng." },

    /* ---- B · Mạng máy tính & Internet ---- */
    { type: "mc", topic: "B", grade: 10, level: "easy", question: "Mạng máy tính là gì?", options: ["Một máy tính được gắn thêm nhiều màn hình", "Một phần mềm dùng để duyệt web", "Tập hợp các máy tính và thiết bị được kết nối với nhau để trao đổi dữ liệu và chia sẻ tài nguyên", "Một thiết bị lưu trữ dữ liệu có dung lượng lớn"], answer: 2, explain: "Mạng máy tính là tập hợp các máy tính và thiết bị được kết nối để trao đổi dữ liệu và chia sẻ tài nguyên (máy in, tệp, đường truyền Internet)." },
    { type: "mc", topic: "B", grade: 10, level: "easy", question: "Mạng LAN (Local Area Network) có đặc điểm nào sau đây?", options: ["Kết nối các máy tính trong phạm vi địa lí hẹp như một phòng hoặc một tòa nhà", "Kết nối các máy tính trên phạm vi toàn cầu", "Chỉ kết nối được đúng hai máy tính với nhau", "Bắt buộc phải dùng vệ tinh để kết nối"], answer: 0, explain: "LAN là mạng cục bộ, kết nối các thiết bị trong phạm vi hẹp (phòng, tòa nhà). Kết nối trên phạm vi rộng/toàn cầu là mạng WAN/Internet." },
    { type: "mc", topic: "B", grade: 10, level: "easy", question: "Phát biểu nào sau đây ĐÚNG về Internet?", options: ["Internet là một loại phần mềm soạn thảo văn bản", "Internet là mạng máy tính toàn cầu, kết nối hàng tỉ thiết bị trên khắp thế giới", "Internet chỉ hoạt động trong phạm vi một quốc gia", "Internet chỉ dùng để chơi trò chơi điện tử"], answer: 1, explain: "Internet là mạng máy tính toàn cầu, kết nối hàng tỉ thiết bị dựa trên bộ giao thức TCP/IP." },
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Trong mạng LAN, thiết bị nào nhận và chuyển tiếp khung dữ liệu đến ĐÚNG cổng của thiết bị nhận dựa trên địa chỉ MAC?", options: ["Bộ lặp (repeater)", "Modem", "Máy chiếu", "Bộ chuyển mạch (switch)"], answer: 3, explain: "Switch chuyển tiếp dữ liệu đến đúng cổng của thiết bị nhận dựa trên địa chỉ MAC, khác với hub gửi tràn ra mọi cổng." },
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Chức năng chính của bộ định tuyến (router) là gì?", options: ["Khuếch đại âm thanh cho máy tính", "Kết nối các mạng khác nhau và chọn đường đi cho gói dữ liệu giữa các mạng", "Lưu trữ dữ liệu dự phòng cho toàn mạng", "Chuyển đổi điện áp cho các thiết bị"], answer: 1, explain: "Router kết nối các mạng khác nhau (ví dụ mạng LAN với Internet) và định tuyến, tức chọn đường đi cho gói tin giữa các mạng." },
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Thiết bị nào có nhiệm vụ chuyển đổi tín hiệu số của máy tính thành tín hiệu phù hợp để truyền trên đường truyền của nhà cung cấp dịch vụ Internet và ngược lại?", options: ["Switch", "Hub", "Modem", "Bộ lặp (repeater)"], answer: 2, explain: "Modem thực hiện điều chế/giải điều chế, chuyển đổi tín hiệu số của máy tính sang tín hiệu truyền trên đường truyền (cáp điện thoại, cáp quang) và ngược lại." },
    { type: "mc", topic: "B", grade: 10, level: "medium", question: "Trên Internet, hệ thống DNS (Domain Name System) có vai trò chính là gì?", options: ["Phân giải tên miền (ví dụ example.com) thành địa chỉ IP tương ứng", "Mã hóa toàn bộ dữ liệu để chống virus", "Tăng băng thông cho đường truyền", "Quản lí mật khẩu của người dùng"], answer: 0, explain: "DNS ánh xạ (phân giải) tên miền dễ nhớ thành địa chỉ IP mà máy tính dùng để định vị máy chủ trên mạng." },
    { type: "mc", topic: "B", grade: 10, level: "medium", question: "Việc một trang web dùng giao thức HTTPS thay cho HTTP mang lại lợi ích chủ yếu nào?", options: ["Giúp trang web luôn tải nhanh hơn", "Giúp trang web không bao giờ gặp lỗi", "Giúp trang web hiển thị được nhiều quảng cáo hơn", "Mã hóa dữ liệu trao đổi giữa trình duyệt và máy chủ, tăng tính an toàn"], answer: 3, explain: "HTTPS là HTTP có thêm mã hóa (SSL/TLS), giúp dữ liệu truyền đi được bảo mật, chống nghe lén; nó không đảm bảo trang web nhanh hơn hay không lỗi." },
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Trong mô hình mạng khách - chủ (client - server), phát biểu nào sau đây ĐÚNG?", options: ["Mọi máy trong mạng đều có vai trò hoàn toàn ngang hàng nhau", "Máy chủ cung cấp tài nguyên và dịch vụ; máy khách gửi yêu cầu và sử dụng dịch vụ đó", "Máy khách cung cấp dịch vụ cho máy chủ sử dụng", "Mô hình này hoạt động mà không cần bất kì máy chủ nào"], answer: 1, explain: "Trong mô hình client - server, máy chủ cung cấp tài nguyên/dịch vụ, máy khách gửi yêu cầu và sử dụng. Mọi máy ngang hàng là mạng ngang hàng (peer-to-peer)." },
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Điểm khác biệt cơ bản giữa mạng tổ chức theo mô hình domain và mô hình workgroup là gì?", options: ["Workgroup luôn có tốc độ truyền cao hơn domain", "Domain hoạt động mà không cần bất kì máy chủ nào", "Domain quản lí tập trung tài khoản người dùng qua máy chủ quản trị, còn workgroup thì mỗi máy tự quản lí", "Workgroup chỉ dùng được với cáp quang"], answer: 2, explain: "Domain quản lí tập trung tài khoản qua máy chủ quản trị miền, thuận tiện cho mạng lớn; workgroup mỗi máy tự quản lí tài khoản, phù hợp mạng nhỏ." },
    { type: "mc", topic: "B", grade: 10, level: "medium", question: "Giao thức nào sau đây được dùng để GỬI thư điện tử đi từ máy người gửi tới máy chủ thư?", options: ["SMTP", "POP3", "HTTP", "DNS"], answer: 0, explain: "SMTP (Simple Mail Transfer Protocol) dùng để gửi thư đi. POP3 và IMAP dùng để nhận/tải thư về từ máy chủ thư." },
    { type: "mc", topic: "B", grade: 12, level: "hard", question: "Một tệp có dung lượng 60 MB được tải qua đường truyền băng thông 40 Mb/s. Bỏ qua hao phí, thời gian tải tối thiểu là bao nhiêu? (1 byte = 8 bit)", options: ["1,5 giây", "12 giây", "96 giây", "480 giây"], answer: 1, explain: "60 MB = 60 × 8 = 480 Mb. Thời gian = 480 Mb ÷ 40 Mb/s = 12 giây. Quên đổi MB sang Mb (nhân 8) sẽ nhầm ra 1,5 giây." },
    { type: "mc", topic: "B", grade: 12, level: "hard", question: "Muốn tải xong một tệp 900 MB trong tối đa 60 giây thì băng thông đường truyền tối thiểu phải đạt bao nhiêu? (1 byte = 8 bit)", options: ["15 Mb/s", "54 Mb/s", "120 Mb/s", "7200 Mb/s"], answer: 2, explain: "900 MB = 900 × 8 = 7200 Mb. Băng thông tối thiểu = 7200 Mb ÷ 60 s = 120 Mb/s. Quên đổi ra bit sẽ nhầm ra 15 Mb/s." },
    { type: "mc", topic: "B", grade: 12, level: "hard", question: "Đường truyền A có băng thông 50 Mb/s, đường truyền B có băng thông 8 MB/s. Khi so sánh tốc độ tải dữ liệu lí thuyết, nhận định nào ĐÚNG?", options: ["A nhanh hơn B vì 50 lớn hơn 8", "Hai đường truyền có tốc độ như nhau", "Không thể so sánh được vì khác đơn vị đo", "B nhanh hơn A vì 8 MB/s = 64 Mb/s, lớn hơn 50 Mb/s"], answer: 3, explain: "Phải đổi về cùng đơn vị: 8 MB/s = 8 × 8 = 64 Mb/s > 50 Mb/s nên B nhanh hơn. So sánh trực tiếp 50 với 8 là sai vì 1 byte = 8 bit." },
    { type: "tf", topic: "B", grade: 10, level: "medium", question: "Cho các phát biểu sau về mạng máy tính và Internet, hãy xác định đúng hay sai:", statements: [{ text: "Mạng LAN thường kết nối các máy tính trong phạm vi hẹp như một phòng học hay một tòa nhà.", correct: true }, { text: "Internet sử dụng bộ giao thức TCP/IP để các thiết bị trao đổi dữ liệu với nhau.", correct: true }, { text: "Wi-Fi là một hình thức kết nối mạng không dây (vô tuyến).", correct: true }, { text: "Một thiết bị khi tham gia Internet thì không cần có địa chỉ IP.", correct: false }], explain: "(a)(b)(c) đúng. (d) SAI: mỗi thiết bị khi tham gia Internet đều cần có địa chỉ IP để được nhận diện và trao đổi dữ liệu." },
    { type: "tf", topic: "B", grade: 12, level: "hard", question: "Cho các phát biểu sau về giao thức và dịch vụ trên Internet, hãy xác định đúng hay sai:", statements: [{ text: "Giao thức HTTPS mã hóa dữ liệu nên an toàn hơn HTTP khi truyền thông tin.", correct: true }, { text: "DNS có nhiệm vụ phân giải tên miền thành địa chỉ IP.", correct: true }, { text: "Bộ giao thức TCP/IP là nền tảng cho hoạt động truyền dữ liệu trên Internet.", correct: true }, { text: "Giao thức SMTP được dùng để TẢI thư điện tử từ máy chủ về máy người nhận.", correct: false }], explain: "(a)(b)(c) đúng. (d) SAI: SMTP dùng để GỬI thư đi; nhận/tải thư về máy dùng POP3 hoặc IMAP." },
    { type: "tf", topic: "B", grade: 12, level: "hard", question: "Một đường truyền Internet có băng thông 80 Mb/s. Bỏ qua hao phí và biết 1 byte = 8 bit, hãy xác định các phát biểu sau đúng hay sai:", statements: [{ text: "Băng thông 80 Mb/s tương đương khoảng 10 MB/s.", correct: true }, { text: "Tải một tệp 200 MB qua đường truyền này mất khoảng 20 giây.", correct: true }, { text: "Tải một tệp 50 MB qua đường truyền này chỉ mất khoảng 0,625 giây.", correct: false }, { text: "Trong 1 giây, đường truyền này truyền được tối đa khoảng 10 MB dữ liệu.", correct: true }], explain: "(a)(b)(d) đúng: 80 Mb/s ÷ 8 = 10 MB/s; 200 MB = 1600 Mb, 1600 ÷ 80 = 20 giây. (c) SAI: 50 MB = 400 Mb; thời gian = 400 ÷ 80 = 5 giây (0,625 giây là do quên đổi MB sang Mb)." }
  ];
  var max = {};
  QUESTION_BANK.forEach(function (q) { var m = String(q.id).match(/^([A-G])-(mc|tf|sa)-(\d+)$/); if (m) { var k = m[1] + "-" + m[2]; if (!max[k] || +m[3] > max[k]) max[k] = +m[3]; } });
  NEW.forEach(function (q) { var k = q.topic + "-" + q.type; max[k] = (max[k] || 0) + 1; q.id = k + "-" + max[k]; });
  QUESTION_BANK.push.apply(QUESTION_BANK, NEW);
})();

/* ==== MỞ RỘNG NGÂN HÀNG → ~500 CÂU · Đợt B (C/F/D/E) + nhồi bài mỏng quiz ==== */
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var NEW = [
    /* ---- C · CSDL & SQL (lớp 11) ---- */
    { type: "mc", topic: "C", grade: 11, level: "easy", question: "Cơ sở dữ liệu (Database) được hiểu là gì?", options: ["Tập hợp dữ liệu có liên quan với nhau, được tổ chức và lưu trữ để nhiều người khai thác, dùng chung", "Một phần mềm dùng để soạn thảo văn bản và tính toán bảng biểu", "Một ngôn ngữ lập trình dùng để tạo ra các trang web", "Một thiết bị phần cứng dùng để lưu trữ điện năng cho máy tính"], answer: 0, explain: "Cơ sở dữ liệu là tập hợp dữ liệu có cấu trúc, liên quan với nhau, được lưu trữ trên thiết bị nhớ nhằm đáp ứng nhu cầu khai thác thông tin dùng chung của nhiều người." },
    { type: "mc", topic: "C", grade: 11, level: "easy", question: "Hệ quản trị cơ sở dữ liệu (DBMS) là gì?", options: ["Một bảng dữ liệu nằm trong cơ sở dữ liệu", "Người trực tiếp nhập dữ liệu vào máy tính", "Phần mềm cung cấp môi trường và công cụ để tạo lập, cập nhật và khai thác cơ sở dữ liệu", "Một bản sao lưu dự phòng của cơ sở dữ liệu"], answer: 2, explain: "Hệ quản trị CSDL là phần mềm cung cấp môi trường thuận tiện để tạo lập, cập nhật, tìm kiếm và khai thác dữ liệu, ví dụ MySQL, SQL Server, Access." },
    { type: "mc", topic: "C", grade: 11, level: "easy", question: "Trong SQL, câu lệnh nào dùng để truy vấn (lấy) dữ liệu từ bảng?", options: ["SELECT", "INSERT", "UPDATE", "DELETE"], answer: 0, explain: "SELECT là lệnh truy vấn để lấy dữ liệu từ bảng. INSERT thêm bản ghi, UPDATE sửa dữ liệu, DELETE xóa bản ghi." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Phát biểu nào sau đây ĐÚNG về khóa chính (primary key) của một bảng?", options: ["Khóa chính có thể nhận giá trị trùng lặp giữa các bản ghi", "Mỗi bảng bắt buộc phải có ít nhất hai khóa chính", "Khóa chính luôn phải là một cột có kiểu dữ liệu số", "Giá trị khóa chính dùng để phân biệt các bản ghi, không được trùng và không được để trống"], answer: 3, explain: "Khóa chính xác định duy nhất mỗi bản ghi nên giá trị không được trùng và không được rỗng (NULL). Mỗi bảng chỉ có một khóa chính, kiểu dữ liệu tùy ý." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Cho bảng HOCSINH gồm các bản ghi: (An, 11A, 8.5), (Bình, 11B, 6.0), (Cường, 11A, 9.0), (Dung, 11C, 7.5), (Hoa, 11B, 5.5). Câu lệnh sau trả về danh sách họ tên nào?", code: "SELECT HoTen FROM HOCSINH\nWHERE Diem >= 7.5;", options: ["An, Cường", "An, Cường, Dung", "An, Bình, Cường, Dung", "Cường, Dung"], answer: 1, explain: "Điều kiện Diem >= 7.5 chọn An (8.5), Cường (9.0) và Dung (7.5, thỏa vì có dấu bằng). Bình (6.0) và Hoa (5.5) bị loại." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Cho bảng SANPHAM gồm: (Bút bi, 5000, 100), (Vở, 12000, 50), (Thước, 8000, 30), (Tẩy, 3000, 200), (Bút chì, 6000, 80). Câu lệnh sau trả về những sản phẩm nào?", code: "SELECT Ten FROM SANPHAM\nWHERE Gia >= 6000 AND SoLuong >= 80;", options: ["Vở, Bút chì", "Vở, Thước, Bút chì", "Bút chì", "Không có sản phẩm nào"], answer: 2, explain: "Cần đồng thời Gia >= 6000 VÀ SoLuong >= 80. Chỉ Bút chì (6000, 80) thỏa cả hai. Vở đủ giá nhưng SoLuong 50 < 80; Thước SoLuong 30 < 80." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Cho bảng HOCSINH gồm: (An, 11A, 8.5), (Bình, 11B, 6.0), (Cường, 11A, 9.0), (Dung, 11C, 7.5). Câu lệnh sau cho kết quả theo thứ tự nào?", code: "SELECT HoTen FROM HOCSINH\nORDER BY Diem DESC;", options: ["Cường, An, Dung, Bình", "Bình, Dung, An, Cường", "An, Bình, Cường, Dung", "Cường, Dung, An, Bình"], answer: 0, explain: "ORDER BY Diem DESC sắp xếp theo điểm giảm dần: Cường 9.0, An 8.5, Dung 7.5, Bình 6.0. Phương án B là thứ tự tăng dần." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Cho bảng HOCSINH gồm: (An, 11A), (Bình, 11B), (Cường, 11A), (Dung, 11C), (Hoa, 11B), (Khoa, 11A). Trong kết quả của câu lệnh sau, nhóm lớp 11A cho giá trị COUNT(*) bằng bao nhiêu?", code: "SELECT Lop, COUNT(*)\nFROM HOCSINH\nGROUP BY Lop;", options: ["3", "2", "1", "6"], answer: 0, explain: "GROUP BY Lop gom các bản ghi cùng lớp, COUNT(*) đếm số bản ghi mỗi nhóm. Lớp 11A gồm An, Cường, Khoa nên bằng 3." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Cho bảng HOCSINH có các họ tên: Hà, Hoa, Hùng, Lan, Nam. Câu lệnh sau trả về những tên nào?", code: "SELECT HoTen FROM HOCSINH\nWHERE HoTen LIKE 'H%';", options: ["Chỉ Hà", "Lan, Nam", "Hà, Hoa, Hùng", "Hà, Hoa, Hùng, Lan, Nam"], answer: 2, explain: "Mẫu 'H%' khớp mọi chuỗi bắt đầu bằng chữ H, ký tự % thay cho phần còn lại bất kỳ. Vậy Hà, Hoa, Hùng thỏa; Lan và Nam bị loại." },
    { type: "mc", topic: "C", grade: 11, level: "hard", question: "Cho bảng HOCSINH gồm: (An, 11A, 8.0), (Cường, 11A, 9.0), (Khoa, 11A, 7.0), (Bình, 11B, 6.0), (Hoa, 11B, 8.0). Câu lệnh sau cho kết quả nào?", code: "SELECT Lop, AVG(Diem)\nFROM HOCSINH\nGROUP BY Lop;", options: ["11A → 8.5 ; 11B → 7.0", "11A → 8.0 ; 11B → 7.0", "11A → 24.0 ; 11B → 14.0", "11A → 8.0 ; 11B → 6.0"], answer: 1, explain: "AVG(Diem) tính điểm trung bình mỗi nhóm. 11A: (8.0+9.0+7.0)/3 = 8.0; 11B: (6.0+8.0)/2 = 7.0. Phương án C là tổng SUM." },
    { type: "mc", topic: "C", grade: 11, level: "hard", question: "Cho bảng SANPHAM gồm: (Bút bi, 5000, 100), (Vở, 12000, 50), (Thước, 8000, 30), (Tẩy, 3000, 200). Sau khi thực hiện câu lệnh sau, có bao nhiêu sản phẩm bị thay đổi giá và giá mới của Thước là bao nhiêu?", code: "UPDATE SANPHAM\nSET Gia = Gia * 1.1\nWHERE SoLuong < 60;", options: ["4 sản phẩm; Thước = 8800", "1 sản phẩm; Thước = 8800", "2 sản phẩm; Thước = 8800", "2 sản phẩm; Thước = 8000"], answer: 2, explain: "Điều kiện SoLuong < 60 đúng với Vở (50) và Thước (30) nên 2 bản ghi được cập nhật. Giá mới của Thước = 8000 × 1.1 = 8800." },
    { type: "mc", topic: "C", grade: 11, level: "hard", question: "Cho bảng HOCSINH gồm: (An, 11A, 9.0), (Bình, 11B, 5.0), (Cường, 11A, 6.0), (Dung, 11C, 9.5), (Hoa, 11B, 8.0). Biết trong SQL toán tử AND có độ ưu tiên cao hơn OR. Câu lệnh sau trả về những học sinh nào?", code: "SELECT HoTen FROM HOCSINH\nWHERE Lop = '11A' OR Diem >= 8.0 AND Lop = '11B';", options: ["An, Cường, Dung, Hoa", "An, Cường", "An, Dung", "An, Cường, Hoa"], answer: 3, explain: "Vì AND ưu tiên hơn OR nên điều kiện tương đương Lop='11A' HOẶC (Diem>=8.0 VÀ Lop='11B'). An, Cường thuộc 11A; Hoa thuộc 11B với điểm 8.0. Dung điểm cao (9.5) nhưng lớp 11C nên bị loại (bẫy của phương án A)." },
    { type: "tf", topic: "C", grade: 11, level: "medium", question: "Xét các phát biểu sau về cơ sở dữ liệu quan hệ và hệ quản trị cơ sở dữ liệu.", statements: [{ text: "Trong một bảng, mỗi cột (trường) mô tả một thuộc tính của đối tượng.", correct: true }, { text: "Khóa chính của bảng được phép nhận giá trị trùng nhau ở nhiều bản ghi.", correct: false }, { text: "Hệ quản trị CSDL là phần mềm giúp tạo lập, cập nhật và khai thác cơ sở dữ liệu.", correct: true }, { text: "Khóa ngoài (khóa liên kết) được dùng để tạo liên kết dữ liệu giữa hai bảng.", correct: true }], explain: "Ý (2) sai: khóa chính phải có giá trị duy nhất, không được trùng và không rỗng. Các ý (1), (3), (4) đều đúng." },
    { type: "tf", topic: "C", grade: 11, level: "hard", question: "Cho bảng SANPHAM gồm: (Bút bi, 5000, 100), (Vở, 12000, 50), (Thước, 8000, 30), (Tẩy, 3000, 200), (Bút chì, 6000, 80). Xét kết quả của các truy vấn sau (mỗi ý xét độc lập).", statements: [{ text: "SELECT COUNT(*) FROM SANPHAM WHERE Gia > 5000; trả về giá trị 3.", correct: true }, { text: "SELECT MAX(Gia) FROM SANPHAM; trả về giá trị 8000.", correct: false }, { text: "SELECT SUM(SoLuong) FROM SANPHAM WHERE Gia >= 6000; trả về giá trị 160.", correct: true }, { text: "SELECT MIN(Gia) FROM SANPHAM WHERE SoLuong >= 100; trả về giá trị 5000.", correct: false }], explain: "Ý (2) sai: MAX(Gia) = 12000 (của Vở). Ý (4) sai: các sản phẩm có SoLuong>=100 gồm Bút bi (5000) và Tẩy (3000), giá nhỏ nhất là 3000. Ý (1) đúng (Vở, Thước, Bút chì > 5000 nên bằng 3); ý (3) đúng (50+30+80 = 160)." },
    { type: "tf", topic: "C", grade: 11, level: "hard", question: "Xét các phát biểu về câu lệnh cập nhật dữ liệu và an toàn cơ sở dữ liệu.", statements: [{ text: "Lệnh DELETE FROM HOCSINH; xóa toàn bộ các bản ghi nhưng vẫn giữ lại cấu trúc bảng HOCSINH.", correct: true }, { text: "Lệnh UPDATE HOCSINH SET Diem = 0; (không có WHERE) chỉ đặt điểm 0 cho bản ghi đầu tiên của bảng.", correct: false }, { text: "Việc phân quyền truy cập giúp bảo đảm mỗi người dùng chỉ được thao tác trong phạm vi được cấp phép.", correct: true }, { text: "Sao lưu dữ liệu là không cần thiết nếu máy chủ cơ sở dữ liệu đang hoạt động ổn định.", correct: false }], explain: "Ý (2) sai: UPDATE thiếu WHERE sẽ cập nhật TẤT CẢ bản ghi. Ý (4) sai: luôn phải sao lưu định kỳ phòng sự cố. Ý (1) và (3) đúng." },
    { type: "tf", topic: "C", grade: 11, level: "hard", question: "Cho bảng HOCSINH gồm: (An, 11A, 8.5), (Bình, 11B, 6.0), (Cường, 11A, 9.0), (Dung, 11C, 7.5), (Hoa, 11B, 5.5). Xét các thao tác SQL sau (mỗi ý xét độc lập trên bảng gốc).", statements: [{ text: "SELECT COUNT(*) FROM HOCSINH WHERE Diem >= 7.5; trả về giá trị 3.", correct: true }, { text: "SELECT HoTen FROM HOCSINH WHERE Diem < 6.0; trả về đúng một học sinh là Hoa.", correct: true }, { text: "Sau khi thực hiện INSERT INTO HOCSINH VALUES('Khoa','11A',7.0); bảng HOCSINH có 5 bản ghi.", correct: false }, { text: "SELECT AVG(Diem) FROM HOCSINH WHERE Lop = '11B'; trả về giá trị 5.75.", correct: true }], explain: "Ý (3) sai: bảng ban đầu 5 bản ghi, sau INSERT thêm 'Khoa' thì có 6 bản ghi. Ý (1) đúng (An, Cường, Dung); ý (2) đúng (chỉ Hoa 5.5 < 6.0); ý (4) đúng: (6.0+5.5)/2 = 5.75." },

    /* ---- F · Thuật toán & kĩ thuật lập trình (lớp 11) ---- */
    { type: "mc", topic: "F", grade: 11, level: "easy", question: "Trong mảng một chiều, thao tác truy cập một phần tử theo chỉ số (ví dụ a[i]) có độ phức tạp thời gian là bao nhiêu?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explain: "Truy cập trực tiếp theo chỉ số được thực hiện trong thời gian không đổi, không phụ thuộc số phần tử n, nên độ phức tạp là O(1)." },
    { type: "mc", topic: "F", grade: 11, level: "easy", question: "Điều kiện tiên quyết để có thể áp dụng thuật toán tìm kiếm nhị phân trên một dãy số là gì?", options: ["Dãy chỉ chứa các số nguyên dương", "Dãy đã được sắp xếp theo thứ tự (tăng hoặc giảm)", "Số phần tử của dãy phải là một lũy thừa của 2", "Các phần tử của dãy đôi một khác nhau"], answer: 1, explain: "Tìm kiếm nhị phân dựa vào so sánh với phần tử ở giữa để loại một nửa số phần tử sau mỗi bước; điều này chỉ đúng khi dãy đã được sắp xếp." },
    { type: "mc", topic: "F", grade: 11, level: "medium", question: "Cho đoạn chương trình sau. Kết quả in ra màn hình là gì?", code: "a = [3, 1, 4, 1, 5, 9, 2]\ns = 0\nfor x in a:\n    if x % 2 == 1:\n        s += x\nprint(s)", options: ["25", "19", "16", "6"], answer: 1, explain: "Vòng lặp chỉ cộng dồn các phần tử lẻ: 3 + 1 + 1 + 5 + 9 = 19. (25 là tổng tất cả, 6 là tổng các phần tử chẵn 4 + 2.)" },
    { type: "mc", topic: "F", grade: 11, level: "medium", question: "Đoạn chương trình sau thực hiện đúng MỘT lượt của thuật toán sắp xếp nổi bọt. Mảng a sau khi chạy xong là gì?", code: "a = [5, 2, 8, 1, 3]\nn = len(a)\nfor j in range(n - 1):\n    if a[j] > a[j + 1]:\n        a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)", options: ["[1, 2, 3, 5, 8]", "[2, 5, 1, 3, 8]", "[2, 5, 8, 1, 3]", "[2, 1, 5, 3, 8]"], answer: 1, explain: "Một lượt nổi bọt so sánh và hoán đổi các cặp kề nhau từ trái sang phải, đưa phần tử lớn nhất (8) về cuối: [2, 5, 1, 3, 8]. Chưa sắp xong hoàn toàn." },
    { type: "mc", topic: "F", grade: 11, level: "medium", question: "Áp dụng thuật toán tìm kiếm tuần tự trên một dãy có n phần tử. Trong trường hợp xấu nhất, số phép so sánh giá trị khóa cần thực hiện là bao nhiêu?", options: ["log₂n", "n/2", "n", "n − 1"], answer: 2, explain: "Trường hợp xấu nhất (khóa ở cuối dãy hoặc không có trong dãy) phải so sánh cả n phần tử, tức n phép so sánh (O(n)). n/2 là trung bình, log₂n là của tìm kiếm nhị phân." },
    { type: "mc", topic: "F", grade: 11, level: "medium", question: "Cho hàm đệ quy sau. Giá trị h(4) được in ra là bao nhiêu?", code: "def h(n):\n    if n == 0:\n        return 2\n    return h(n - 1) + 3\nprint(h(4))", options: ["11", "12", "14", "17"], answer: 2, explain: "h(0) = 2; mỗi lần gọi cộng thêm 3: h(1)=5, h(2)=8, h(3)=11, h(4)=14." },
    { type: "mc", topic: "F", grade: 11, level: "hard", question: "Đoạn tìm kiếm nhị phân sau đếm số lần so sánh khóa bằng biến count. Giá trị count được in ra là bao nhiêu?", code: "a = [2, 5, 7, 8, 11, 12, 15, 18, 21]\nx = 12\nlo, hi = 0, len(a) - 1\ncount = 0\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count += 1\n    if a[mid] == x:\n        break\n    elif a[mid] < x:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nprint(count)", options: ["2", "3", "4", "9"], answer: 1, explain: "Dãy 9 phần tử (chỉ số 0–8). mid=4 (a[4]=11<12→phải), mid=6 (a[6]=15>12→trái), mid=5 (a[5]=12=x). Tổng 3 lần so sánh khóa." },
    { type: "mc", topic: "F", grade: 11, level: "hard", question: "Xét hàm sau với n = len(a). Độ phức tạp thời gian của hàm process theo n là gì?", code: "def process(a):\n    n = len(a)\n    total = 0\n    for i in range(n):\n        for j in range(i + 1, n):\n            total += a[i] * a[j]\n    return total", options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], answer: 2, explain: "Hai vòng lặp lồng nhau, thân vòng trong thực hiện n(n−1)/2 lần - biểu thức bậc hai theo n nên độ phức tạp là O(n²), dù vòng trong chỉ chạy phần tam giác." },
    { type: "mc", topic: "F", grade: 11, level: "hard", question: "Cho ma trận m và đoạn chương trình sau. Giá trị s được in ra là bao nhiêu?", code: "m = [[1, 2, 3],\n     [4, 5, 6],\n     [7, 8, 9]]\ns = 0\nfor i in range(3):\n    for j in range(3):\n        if i > j:\n            s += m[i][j]\nprint(s)", options: ["11", "15", "19", "45"], answer: 2, explain: "Điều kiện i > j chọn các phần tử phía dưới đường chéo chính: m[1][0]=4, m[2][0]=7, m[2][1]=8, tổng 19. (15 là đường chéo, 45 là toàn bộ ma trận.)" },
    { type: "mc", topic: "F", grade: 11, level: "hard", question: "Đoạn sắp xếp chọn (selection sort) sau đếm số lần hoán đổi bằng biến swaps. Giá trị swaps được in ra là bao nhiêu?", code: "a = [29, 10, 14, 37, 13]\nn = len(a)\nswaps = 0\nfor i in range(n - 1):\n    m = i\n    for j in range(i + 1, n):\n        if a[j] < a[m]:\n            m = j\n    if m != i:\n        a[i], a[m] = a[m], a[i]\n        swaps += 1\nprint(swaps)", options: ["2", "3", "4", "5"], answer: 1, explain: "Diễn biến: đổi 29↔10, đổi 29↔13, vòng i=2 không đổi (14 đã đúng chỗ), đổi 37↔29. Có 3 lần hoán đổi. (n − 1 = 4 chỉ là số tối đa.)" },
    { type: "tf", topic: "F", grade: 11, level: "medium", question: "Xét các phát biểu về độ phức tạp thời gian của thuật toán. Mỗi phát biểu sau đúng hay sai?", statements: [{ text: "Thao tác truy cập một phần tử của mảng theo chỉ số có độ phức tạp O(1).", correct: true }, { text: "Với dữ liệu đầu vào lớn, thuật toán có độ phức tạp O(log n) thường hiệu quả hơn thuật toán O(n).", correct: true }, { text: "Thuật toán có độ phức tạp O(n²) luôn chạy chậm hơn thuật toán O(n) với mọi kích thước dữ liệu n.", correct: false }, { text: "Độ phức tạp O(1) nghĩa là thuật toán chỉ thực hiện đúng một phép tính duy nhất.", correct: false }], explain: "Ý 3 sai: O là đánh giá tiệm cận (n đủ lớn); với n nhỏ, hằng số có thể khiến O(n²) nhanh hơn O(n). Ý 4 sai: O(1) là số phép tính hằng số, không nhất thiết bằng một. Ý 1, 2 đúng." },
    { type: "tf", topic: "F", grade: 11, level: "hard", question: "Cho hàm sắp xếp nổi bọt có cải tiến bằng biến swapped dưới đây. Mỗi phát biểu sau đúng hay sai?", code: "def bubble(a):\n    n = len(a)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - 1 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                swapped = True\n        if not swapped:\n            break\n    return a", statements: [{ text: "Khi mảng đầu vào đã được sắp xếp tăng dần sẵn, hàm chỉ chạy đúng một lượt của vòng lặp ngoài rồi dừng nhờ biến swapped.", correct: true }, { text: "Nhờ biến swapped, độ phức tạp trong trường hợp tốt nhất của hàm là O(n).", correct: true }, { text: "Trong trường hợp xấu nhất, độ phức tạp thời gian của hàm là O(n log n).", correct: false }, { text: "Sau khi kết thúc lượt đầu tiên (i = 0), phần tử lớn nhất của mảng chắc chắn được đưa về vị trí cuối cùng.", correct: true }], explain: "Ý 3 sai: xấu nhất (mảng giảm dần) vẫn phải chạy đầy đủ hai vòng lồng nhau nên O(n²), không phải O(n log n). Các ý còn lại đúng." },
    { type: "tf", topic: "F", grade: 11, level: "hard", question: "Cho hàm đệ quy T dưới đây (với n là số nguyên không âm). Mỗi phát biểu sau đúng hay sai?", code: "def T(n):\n    if n == 0:\n        return 0\n    return T(n - 1) + n", statements: [{ text: "Lời gọi T(3) trả về giá trị 6.", correct: true }, { text: "Trường hợp cơ sở (điều kiện dừng) của hàm là khi n == 0.", correct: true }, { text: "Khi gọi T(n) với n nguyên dương, có tất cả n + 1 lần hàm T được gọi (kể cả lời gọi ban đầu).", correct: true }, { text: "Hàm T tính tổng 1 + 2 + ... + n và có độ phức tạp thời gian O(log n).", correct: false }], explain: "Ý 4 sai: hàm thực hiện n + 1 lời gọi, mỗi lời gọi O(1), nên độ phức tạp là O(n) chứ không phải O(log n). Ý 1, 2, 3 đúng: T(3) = 0+1+2+3 = 6." },

    /* ---- D · Đạo đức, pháp luật, an toàn ---- */
    { type: "mc", topic: "D", grade: 10, level: "easy", question: "Trong giao tiếp trên mạng (tin nhắn, bình luận), việc gõ TOÀN BỘ nội dung bằng CHỮ IN HOA thường được hiểu là gì?", options: ["Cách thể hiện sự lịch sự, trang trọng", "Giống như đang quát/hét lớn tiếng, gây khó chịu cho người đọc", "Giúp máy tính đọc nội dung nhanh hơn", "Một quy định bắt buộc khi nhắn tin"], answer: 1, explain: "Theo văn hóa ứng xử trên mạng (netiquette), viết toàn chữ in hoa bị coi như đang la hét, thiếu lịch sự." },
    { type: "mc", topic: "D", grade: 10, level: "easy", question: "Mật khẩu nào dưới đây được coi là MẠNH (khó bị dò đoán) nhất?", options: ["123456", "hoangan2008", "12345678a", "M3o#Con!7hLx"], answer: 3, explain: "Mật khẩu mạnh nên dài, kết hợp chữ hoa, chữ thường, số và kí tự đặc biệt, không chứa thông tin dễ đoán (tên, ngày sinh, dãy số liên tiếp)." },
    { type: "mc", topic: "D", grade: 12, level: "easy", question: "Phần mềm độc hại chuyên MÃ HÓA dữ liệu của nạn nhân rồi đòi 'tiền chuộc' mới giải mã được gọi là gì?", options: ["Ransomware (mã độc tống tiền)", "Freeware (phần mềm miễn phí)", "Tường lửa (firewall)", "Trình duyệt web"], answer: 0, explain: "Ransomware khóa/mã hóa dữ liệu rồi đòi tiền chuộc. Phòng chống tốt nhất là sao lưu dữ liệu định kỳ và không mở tệp, đường link lạ." },
    { type: "mc", topic: "D", grade: 10, level: "easy", question: "Khi muốn sử dụng lại một bài viết hoặc bức ảnh của người khác trên mạng, cách ứng xử ĐÚNG và tôn trọng bản quyền là gì?", options: ["Cứ dùng thoải mái vì mọi thứ trên mạng đều miễn phí", "Xin phép tác giả và/hoặc ghi rõ nguồn theo đúng giấy phép sử dụng", "Xóa tên tác giả rồi ghi tên mình vào", "Chỉ cần tải về máy là tác phẩm đã thuộc sở hữu của mình"], answer: 1, explain: "Sản phẩm sáng tạo được bảo vệ bản quyền. Dùng lại cần tuân theo giấy phép: xin phép và/hoặc dẫn nguồn đầy đủ. Đăng công khai không có nghĩa là được tự do dùng." },
    { type: "mc", topic: "D", grade: 12, level: "medium", question: "Một 'phần mềm tăng tốc điện thoại miễn phí' tải từ trang lạ, sau khi cài lại âm thầm đánh cắp dữ liệu và cài thêm mã độc. Đây là loại phần mềm độc hại nào?", options: ["Trojan (phần mềm giả dạng ứng dụng hữu ích)", "Phần mềm nguồn mở", "Tường lửa", "Phần mềm sao lưu"], answer: 0, explain: "Trojan giả dạng ứng dụng hữu ích để lừa người dùng tự cài đặt, rồi thực hiện hành vi độc hại. Chỉ nên tải phần mềm từ nguồn chính thống hoặc cửa hàng ứng dụng uy tín." },
    { type: "mc", topic: "D", grade: 11, level: "medium", question: "Em nhận được tin nhắn: 'Chúc mừng! Số điện thoại của bạn đã trúng thưởng xe máy SH. Bấm vào link kèm theo và nộp phí làm thủ tục 2 triệu để nhận thưởng.' Đây nhiều khả năng là gì?", options: ["Một chương trình khuyến mãi có thật, nên làm theo ngay", "Tin nhắn lừa đảo nhằm chiếm đoạt tiền và thông tin", "Thông báo chính thức của nhà mạng", "Tin nhắn gửi nhầm, nên chuyển tiếp cho bạn bè"], answer: 1, explain: "Dấu hiệu lừa đảo điển hình: 'trúng thưởng' bất ngờ kèm yêu cầu nộp phí trước và bấm link lạ. Không giải thưởng thật nào bắt nộp tiền trước." },
    { type: "mc", topic: "D", grade: 11, level: "medium", question: "Trước một hình ảnh 'giật gân' đang lan truyền trên mạng, cách làm nào giúp KIỂM CHỨNG độ xác thực tốt nhất?", options: ["Đếm số lượt thích và chia sẻ, nhiều thì là thật", "Tìm kiếm ngược hình ảnh và đối chiếu với nguồn báo chí chính thống", "Đọc bình luận, nếu nhiều người tin thì coi là thật", "Chia sẻ ngay để hỏi ý kiến mọi người"], answer: 1, explain: "Lượt thích, chia sẻ hay bình luận không chứng minh tính xác thực. Nên tìm kiếm ngược ảnh, kiểm tra nguồn gốc, thời điểm và đối chiếu với các nguồn tin cậy." },
    { type: "mc", topic: "D", grade: 12, level: "medium", question: "Phát biểu nào ĐÚNG về việc sử dụng lại tác phẩm có bản quyền của người khác?", options: ["Chỉ cần ghi tên tác giả là được toàn quyền dùng cho mọi mục đích", "Phải tuân theo điều khoản của giấy phép; ghi nguồn không đương nhiên cho phép dùng vào mục đích thương mại", "Tác phẩm đã đăng công khai thì thuộc phạm vi công cộng, ai cũng được bán lại", "Chỉ nhạc và phim mới có bản quyền, còn ảnh và bài viết thì không"], answer: 1, explain: "Dẫn nguồn là cần thiết nhưng chưa đủ: phải theo đúng giấy phép. Nhiều giấy phép cấm dùng cho mục đích thương mại hoặc cấm chỉnh sửa. Đăng công khai không đồng nghĩa thuộc phạm vi công cộng." },
    { type: "mc", topic: "D", grade: 11, level: "medium", question: "Việc thường xuyên đăng ảnh check-in kèm vị trí theo thời gian thực (đang ở đâu, đi vắng khi nào) có thể gây rủi ro gì?", options: ["Giúp tài khoản an toàn hơn", "Làm tăng dung lượng điện thoại", "Kẻ xấu biết được lịch trình, nơi ở, thời điểm nhà vắng người để lợi dụng", "Không có rủi ro gì cả"], answer: 2, explain: "Chia sẻ vị trí thời gian thực làm lộ lịch trình và nơi ở, dễ bị theo dõi, trộm cắp hoặc quấy rối. Nên hạn chế, chỉ đăng sau khi đã rời đi và giới hạn người xem." },
    { type: "mc", topic: "D", grade: 12, level: "hard", question: "Em nhận một cuộc gọi video, hình ảnh và giọng nói GIỐNG hệt người thân, nói đang gặp nạn và cần chuyển gấp 20 triệu vào một số tài khoản lạ. Cách xử lí AN TOÀN nhất là gì?", options: ["Chuyển tiền ngay vì đúng mặt và giọng người thân", "Cúp máy rồi gọi lại theo số điện thoại quen của người thân để xác minh trước khi làm bất cứ điều gì", "Nhắn số tài khoản đó cho bạn bè để cùng chuyển giúp", "Chuyển trước một nửa cho chắc rồi tính tiếp"], answer: 1, explain: "Công nghệ giả mạo hình ảnh và giọng nói (deepfake) có thể bắt chước người thân. Dấu hiệu đáng ngờ: hối thúc chuyển tiền gấp vào tài khoản lạ. Luôn xác minh qua kênh quen thuộc trước khi chuyển tiền." },
    { type: "mc", topic: "D", grade: 11, level: "hard", question: "Tài khoản mạng xã hội của một người bạn bất ngờ nhắn: 'Cho mình mượn gấp 500k, tối trả, chuyển vào số tài khoản này nhé' kèm một số tài khoản lạ. Em nên làm gì?", options: ["Chuyển ngay vì đúng là tài khoản của bạn", "Gọi điện hoặc gặp trực tiếp bạn theo số quen để xác minh, vì tài khoản có thể đã bị chiếm đoạt", "Chuyển một nửa để thử xem có thật không", "Hỏi lại mật khẩu tài khoản của bạn để kiểm tra giúp"], answer: 1, explain: "Kẻ gian thường chiếm tài khoản rồi mạo danh nhắn vay tiền. Cần xác minh qua kênh khác (gọi điện, gặp trực tiếp) trước khi chuyển; tuyệt đối không hỏi hay đưa mật khẩu." },
    { type: "mc", topic: "D", grade: 11, level: "hard", question: "Em cần một phần mềm có bản quyền khá đắt. Trên một trang web lạ có bản 'bẻ khóa (crack) miễn phí' để tải về dùng ngay. Lựa chọn hợp lí và an toàn nhất là gì?", options: ["Tải bản crack cho tiết kiệm, không có rủi ro gì", "Dùng phần mềm nguồn mở/miễn phí hợp pháp thay thế, hoặc mua bản quyền; tránh bản crack", "Tải bản crack rồi tắt phần mềm diệt virus cho khỏi báo lỗi", "Tải về rồi chia sẻ lại cho nhiều bạn cùng dùng"], answer: 1, explain: "Phần mềm bẻ khóa vừa vi phạm bản quyền vừa tiềm ẩn mã độc, có thể đánh cắp dữ liệu. Nên chọn phần mềm nguồn mở/miễn phí hợp pháp thay thế hoặc mua bản quyền; tắt diệt virus càng nguy hiểm." },
    { type: "tf", topic: "D", grade: 11, level: "medium", question: "Xét các phát biểu về văn hóa ứng xử và bảo vệ thông tin trên môi trường số:", statements: [{ text: "Nên đọc lại và suy nghĩ trước khi đăng vì nội dung có thể lan truyền rộng và khó thu hồi.", correct: true }, { text: "Dùng từ ngữ tôn trọng, không xúc phạm hay công kích người khác khi bình luận.", correct: true }, { text: "Có thể tự ý đăng ảnh và thông tin cá nhân của người khác dù chưa được họ đồng ý.", correct: false }, { text: "Thông tin đã đưa lên mạng có thể bị người khác sao chép, chụp lại nên rất khó xóa bỏ hoàn toàn.", correct: true }], explain: "(a)(b)(d) đúng. (c) SAI: đăng ảnh và thông tin cá nhân của người khác khi chưa được đồng ý là xâm phạm quyền riêng tư, có thể vi phạm pháp luật." },
    { type: "tf", topic: "D", grade: 12, level: "hard", question: "Xét các phát biểu về phần mềm độc hại và cách phòng chống:", statements: [{ text: "Ransomware mã hóa dữ liệu và đòi tiền chuộc; có bản sao lưu ngoại tuyến (offline) giúp khôi phục mà không phải trả tiền.", correct: true }, { text: "Trả tiền chuộc cho kẻ tấn công luôn đảm bảo chắc chắn lấy lại được toàn bộ dữ liệu.", correct: false }, { text: "Trojan giả dạng phần mềm hữu ích để lừa người dùng tự cài đặt vào máy.", correct: true }, { text: "Mã độc chỉ lây qua USB, không thể lây qua email hay đường link.", correct: false }], explain: "(a)(c) đúng. (b) SAI: trả tiền chuộc không đảm bảo lấy lại dữ liệu và còn tiếp tay cho tội phạm. (d) SAI: mã độc lây qua nhiều con đường như email, đường link, tệp tải về lẫn USB." },
    { type: "tf", topic: "D", grade: 12, level: "hard", question: "Xét các dấu hiệu và cách nhận biết lừa đảo trực tuyến (phishing):", statements: [{ text: "Tin nhắn hay email hối thúc 'làm gấp trong vài phút kẻo mất tài khoản' là một dấu hiệu đáng ngờ.", correct: true }, { text: "Địa chỉ người gửi lạ, sai chính tả so với tên miền chính thức là dấu hiệu giả mạo.", correct: true }, { text: "Trang web có biểu tượng ổ khóa (https) thì chắc chắn là trang thật và an toàn tuyệt đối.", correct: false }, { text: "Ngân hàng và cơ quan chính thống thường KHÔNG yêu cầu cung cấp mật khẩu hay mã OTP qua email hoặc điện thoại.", correct: true }], explain: "(a)(b)(d) đúng. (c) SAI: https chỉ cho biết đường truyền được mã hóa, kẻ lừa đảo cũng có thể tạo trang https giả - vẫn phải kiểm tra kỹ tên miền và nguồn gốc." },
    { type: "tf", topic: "D", grade: 11, level: "hard", question: "Xét các phát biểu về bản quyền, giấy phép và pháp luật trên không gian mạng:", statements: [{ text: "Tác phẩm có giấy phép Creative Commons ghi 'phi thương mại' thì không được dùng để kinh doanh kiếm lời.", correct: true }, { text: "Trích dẫn một đoạn ngắn có ghi rõ nguồn cho mục đích học tập được coi là sử dụng hợp lý.", correct: true }, { text: "Phần mềm miễn phí (freeware) thì đương nhiên được phép xem, chỉnh sửa và bán lại mã nguồn.", correct: false }, { text: "Đăng tin bịa đặt, sai sự thật gây hại cho người khác trên mạng có thể bị xử lý theo pháp luật.", correct: true }], explain: "(a)(b)(d) đúng. (c) SAI: freeware chỉ miễn phí sử dụng, không mở mã nguồn; quyền xem, sửa và phân phối lại mã nguồn là của phần mềm nguồn mở." },

    /* ---- E · Đồ hoạ vector & Web (HTML/CSS) ---- */
    { type: "mc", topic: "E", grade: 10, level: "easy", question: "Ưu điểm nổi bật của ảnh vector so với ảnh điểm (bitmap) là gì?", options: ["Luôn có dung lượng tệp nhỏ hơn mọi ảnh bitmap", "Phóng to hay thu nhỏ tuỳ ý mà hình vẫn sắc nét, không bị vỡ hạt (răng cưa)", "Thể hiện ảnh chụp nhiều sắc độ, chuyển màu mượt mà hơn bitmap", "Được tạo nên từ một lưới các điểm ảnh (pixel)"], answer: 1, explain: "Ảnh vector lưu hình dưới dạng các đối tượng hình học bằng công thức toán học nên khi đổi kích thước phần mềm tính lại và hình luôn mịn. Bitmap là lưới pixel nên phóng to sẽ vỡ hạt." },
    { type: "mc", topic: "E", grade: 12, level: "easy", question: "Trong HTML, muốn tạo một siêu liên kết đến trang khác, em dùng thẻ nào?", options: ["<a>", "<link>", "<href>", "<url>"], answer: 0, explain: "Siêu liên kết được tạo bằng thẻ <a> (anchor) cùng thuộc tính href chỉ địa chỉ đích. <link> chỉ dùng trong <head>; href là thuộc tính chứ không phải thẻ; <url> không phải thẻ HTML." },
    { type: "mc", topic: "E", grade: 12, level: "easy", question: "Cặp thẻ nào tạo danh sách CÓ thứ tự (tự đánh số 1, 2, 3, …) trong HTML?", options: ["<ul> … </ul>", "<ol> … </ol>", "<li> … </li>", "<dl> … </dl>"], answer: 1, explain: "<ol> (ordered list) tạo danh sách có thứ tự, mặc định đánh số 1, 2, 3; <ul> tạo danh sách không thứ tự; mỗi mục dùng <li>; <dl> là danh sách định nghĩa." },
    { type: "mc", topic: "E", grade: 10, level: "medium", question: "Trong phần mềm đồ hoạ vector, một đường (path) được xác định chủ yếu bởi thành phần nào?", options: ["Số lượng điểm ảnh (pixel) nằm trên đường", "Các điểm neo (nút) và đoạn nối giữa chúng, có thể là đoạn thẳng hoặc cung cong", "Độ phân giải (dpi) mà người dùng thiết lập", "Bảng màu được nạp kèm theo tệp ảnh"], answer: 1, explain: "Đường (path) trong đồ hoạ vector gồm các điểm neo (nút) nối với nhau bằng đoạn thẳng hoặc cung cong (Bézier). Vì mô tả bằng toạ độ/công thức nên không phụ thuộc pixel hay dpi." },
    { type: "mc", topic: "E", grade: 10, level: "medium", question: "Khi tô màu cho một đối tượng khép kín trong phần mềm đồ hoạ vector, người ta thường phân biệt hai thành phần màu nào?", options: ["Màu nền trang và màu lưới (grid)", "Màu tô bên trong (fill) và màu nét viền (stroke)", "Màu điểm ảnh chẵn và màu điểm ảnh lẻ", "Màu ở lớp trên và màu ở lớp dưới"], answer: 1, explain: "Mỗi đối tượng vector khép kín có hai thuộc tính màu tách biệt: màu tô bên trong (fill) và màu đường viền (stroke); có thể đặt fill hoặc stroke là 'không màu' độc lập nhau." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Phát biểu nào ĐÚNG về cấu trúc một trang HTML cơ bản?", options: ["Mọi nội dung người dùng nhìn thấy đều đặt trong phần <head>", "Phần <head> chứa thông tin mô tả trang (tiêu đề, bảng mã, liên kết CSS…), còn nội dung hiển thị nằm trong phần <body>", "Thẻ <title> đặt trong <body> và hiển thị như một tiêu đề lớn giữa trang", "Một trang HTML chỉ được có phần <body>, không cần <head>"], answer: 1, explain: "Trang HTML gồm <head> (thông tin mô tả: <title>, bảng mã, liên kết CSS/script) và <body> (nội dung hiển thị). <title> nằm trong <head> và hiện ở thanh tiêu đề/tab trình duyệt." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Trong thẻ <img src=\"hoa.jpg\" alt=\"Bông hoa sen\">, thuộc tính alt có vai trò gì?", options: ["Chỉ đường dẫn đến tệp ảnh cần hiển thị", "Đặt chiều rộng mặc định cho ảnh", "Cung cấp văn bản thay thế khi ảnh không tải được và hỗ trợ trình đọc màn hình", "Tạo liên kết từ ảnh đến một trang khác"], answer: 2, explain: "src chỉ đường dẫn tệp ảnh; alt là văn bản thay thế, hiện khi ảnh lỗi và được trình đọc màn hình đọc cho người khiếm thị. Kích thước dùng width/height." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Cho đoạn HTML tạo bảng dưới đây. Ô chứa chữ 'Tổng' sẽ chiếm mấy cột?", code: "<table border=\"1\">\n  <tr>\n    <td>Toán</td>\n    <td>Văn</td>\n    <td>Anh</td>\n  </tr>\n  <tr>\n    <td colspan=\"3\">Tổng</td>\n  </tr>\n</table>", options: ["1 cột", "2 cột", "3 cột", "Bảng bị lỗi, không hiển thị được"], answer: 2, explain: "Thuộc tính colspan=\"3\" cho biết ô được trải rộng (gộp) trên 3 cột. Hàng trên có 3 ô nên hàng dưới chỉ cần một ô colspan=3 là vừa đủ chiều ngang bảng." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Để tạo một danh sách 'thả xuống' (drop-down) cho người dùng chọn một mục trong biểu mẫu HTML, em dùng thẻ nào?", options: ["<input type=\"text\">", "<select> chứa các <option>", "<button>", "<label>"], answer: 1, explain: "<select> tạo danh sách thả xuống, mỗi mục chọn là một <option>. <input type=\"text\"> là ô nhập văn bản; <button> là nút bấm; <label> là nhãn mô tả cho một điều khiển." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Trong CSS, quy tắc a:hover { color: red; } có tác dụng gì?", options: ["Đổi màu chữ liên kết thành đỏ ngay khi trang vừa tải xong", "Đổi màu chữ liên kết thành đỏ khi con trỏ chuột rê vào (di lên) liên kết đó", "Đổi màu nền toàn trang thành đỏ khi nhấp chuột", "Chỉ có tác dụng với liên kết đã được truy cập trước đó"], answer: 1, explain: ":hover là lớp giả (pseudo-class) mô tả trạng thái khi con trỏ chuột đang rê lên phần tử; a:hover đổi màu chữ liên kết khi trỏ chuột vào và trả lại như cũ khi rời đi. Trạng thái 'đã truy cập' là :visited." },
    { type: "mc", topic: "E", grade: 12, level: "hard", question: "Cho đoạn mã HTML và CSS sau. Chữ 'Xin chào' sẽ hiển thị với màu nào?", code: "<!-- HTML -->\n<p id=\"gt\" class=\"note\">Xin chào</p>\n\n/* CSS */\n#gt { color: red; }\n.note { color: green; }\np { color: blue; }", options: ["Xanh dương (blue) vì quy tắc p đứng cuối cùng", "Xanh lá (green) vì bộ chọn lớp .note", "Đỏ (red) vì bộ chọn #id có độ ưu tiên cao nhất", "Đen vì ba quy tắc mâu thuẫn nên đều bị bỏ qua"], answer: 2, explain: "Khi nhiều quy tắc cùng đặt màu cho một phần tử, CSS chọn quy tắc có độ ưu tiên (specificity) cao nhất, không phụ thuộc thứ tự viết. Thứ tự ưu tiên: #id > .class > thẻ. Phần tử mang #gt nên thắng → màu đỏ." },
    { type: "mc", topic: "E", grade: 12, level: "hard", question: "Cho quy tắc CSS sau áp cho một thẻ <div> (mô hình hộp mặc định content-box). Tổng chiều rộng hộp chiếm chỗ trên trang (không tính margin) là bao nhiêu?", code: ".box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}", options: ["200px", "210px", "240px", "250px"], answer: 3, explain: "Với box model mặc định (content-box), chiều rộng thực chiếm chỗ = width + padding trái + padding phải + border trái + border phải = 200 + 20 + 20 + 5 + 5 = 250px. Margin không thuộc kích thước hộp." },
    { type: "mc", topic: "E", grade: 12, level: "hard", question: "Cho đoạn mã sau. Đoạn chữ 'Cảnh báo!' sẽ hiển thị như thế nào?", code: "<!-- HTML -->\n<p class=\"canhbao\" id=\"loi\">Cảnh báo!</p>\n\n/* CSS */\np { color: black; background-color: white; }\n.canhbao { color: orange; background-color: yellow; }\n#loi { color: red; }", options: ["Chữ màu đen, nền trắng", "Chữ màu cam, nền vàng", "Chữ màu đỏ, nền vàng", "Chữ màu đỏ, nền trắng"], answer: 2, explain: "Xét từng thuộc tính độc lập. color: #loi (id) ưu tiên cao nhất → đỏ. background-color: chỉ p (trắng) và .canhbao (vàng) đặt, .canhbao (lớp) ưu tiên hơn thẻ p → vàng. Kết quả: chữ đỏ trên nền vàng." },
    { type: "tf", topic: "E", grade: 10, level: "medium", question: "Xét các phát biểu về phần mềm thiết kế đồ hoạ vector và các loại ảnh.", statements: [{ text: "Ảnh vector mô tả hình bằng các đối tượng hình học qua công thức toán học nên phóng to tuỳ ý vẫn không bị vỡ hạt.", correct: true }, { text: "Ảnh điểm (bitmap) được tạo từ lưới các điểm ảnh (pixel); khi phóng to quá mức sẽ thấy răng cưa, mờ nhoè.", correct: true }, { text: "Nhóm (group) nhiều đối tượng lại giúp di chuyển, sao chép hay biến đổi chúng cùng lúc như một đối tượng.", correct: true }, { text: "Các lớp (layer) tuy chồng lên nhau nhưng bắt buộc mọi đối tượng phải nằm chung trên một lớp duy nhất.", correct: false }], explain: "Ý cuối SAI: các lớp cho phép đặt đối tượng ở những lớp khác nhau để quản lí, ẩn/hiện, khoá độc lập - không bắt buộc dồn tất cả vào một lớp. Ba ý đầu đúng." },
    { type: "tf", topic: "E", grade: 12, level: "hard", question: "Cho đoạn mã HTML và CSS sau, xét các phát biểu về độ ưu tiên bộ chọn (specificity).", code: "<!-- HTML -->\n<p id=\"tb\" class=\"info\">Thông báo</p>\n\n/* CSS */\np { color: black; }\n.info { color: blue; }\n#tb { color: red; }", statements: [{ text: "Chữ 'Thông báo' hiển thị màu đỏ vì #tb (bộ chọn id) có độ ưu tiên cao nhất.", correct: true }, { text: "Nếu chuyển quy tắc p { color: black; } xuống viết cuối cùng thì chữ sẽ thành màu đen.", correct: false }, { text: "Nếu bỏ quy tắc #tb thì chữ chuyển sang màu xanh dương vì .info ưu tiên hơn thẻ p.", correct: true }, { text: "Hai bộ chọn .info và #tb có độ ưu tiên bằng nhau vì cùng tác động lên một phần tử.", correct: false }], explain: "Ý (2) SAI: độ ưu tiên quyết định trước, không phụ thuộc thứ tự viết; #tb (id) vẫn thắng nên chữ vẫn đỏ. Ý (4) SAI: #id ưu tiên cao hơn .class. Ý (1), (3) đúng theo thứ tự #id > .class > thẻ." },
    { type: "tf", topic: "E", grade: 12, level: "hard", question: "Cho quy tắc CSS áp cho <div class=\"khung\">Tiêu đề</div> (mô hình hộp content-box). Xét các phát biểu.", code: "<!-- HTML -->\n<div class=\"khung\">Tiêu đề</div>\n\n/* CSS */\n.khung {\n  width: 300px;\n  padding: 10px;\n  border: 2px solid navy;\n  background-color: skyblue;\n  color: white;\n  text-align: center;\n}", statements: [{ text: "Tổng chiều rộng hộp chiếm chỗ (không tính margin) là 300 + 10·2 + 2·2 = 324px.", correct: true }, { text: "text-align: center căn giữa chữ 'Tiêu đề' theo chiều ngang bên trong hộp.", correct: true }, { text: "background-color: skyblue tô màu cho chữ, còn color: white tô màu nền của hộp.", correct: false }, { text: "Vùng nội dung (chứa chữ) rộng đúng 300px; padding và border nằm bao thêm phía ngoài vùng nội dung đó.", correct: true }], explain: "Ý (3) SAI (bị đảo): color quy định màu chữ (trắng), background-color quy định màu nền hộp (xanh da trời). Ý (1) đúng: 300+20+4=324px. Ý (2), (4) mô tả đúng." }
  ];
  var max = {};
  QUESTION_BANK.forEach(function (q) { var m = String(q.id).match(/^([A-G])-(mc|tf|sa)-(\d+)$/); if (m) { var k = m[1] + "-" + m[2]; if (!max[k] || +m[3] > max[k]) max[k] = +m[3]; } });
  NEW.forEach(function (q) { var k = q.topic + "-" + q.type; max[k] = (max[k] || 0) + 1; q.id = k + "-" + max[k]; });
  QUESTION_BANK.push.apply(QUESTION_BANK, NEW);

  /* Nhồi câu vào các bài đang mỏng quiz (đưa mỗi bài lên >=4 câu), ưu tiên topic+lớp rồi topic. */
  if (typeof LESSONS !== "undefined") {
    var attached = {};
    LESSONS.forEach(function (l) { (l.quiz || []).forEach(function (id) { attached[id] = 1; }); });
    var byTG = {}, byT = {};
    QUESTION_BANK.forEach(function (q) {
      if (/^CA-/.test(q.id) || attached[q.id]) return;
      (byTG[q.topic + "|" + q.grade] = byTG[q.topic + "|" + q.grade] || []).push(q.id);
      (byT[q.topic] = byT[q.topic] || []).push(q.id);
    });
    var usedT = {};
    var fill = function (l, pool) {
      for (var i = 0; i < pool.length && (l.quiz || []).length < 4; i++) {
        var id = pool[i];
        if (usedT[id] || (l.quiz || []).indexOf(id) >= 0) continue;
        l.quiz = (l.quiz || []).concat(id); usedT[id] = 1;
      }
    };
    LESSONS.forEach(function (l) {
      if ((l.quiz || []).length >= 4) return;
      fill(l, byTG[l.topic + "|" + l.grade] || []);
      if ((l.quiz || []).length < 4) fill(l, byT[l.topic] || []);
    });
  }
})();

/* ==== Đợt C · làm tròn số (A/E→80, B/C/G→60, F→150) — câu gốc, id tự gán ==== */
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var NEW = [
    /* A (+7) */
    { type: "mc", topic: "A", grade: 10, level: "easy", question: "Trong các đơn vị đo lượng dữ liệu sau, đơn vị nào LỚN nhất?", options: ["KB", "MB", "GB", "TB"], answer: 3, explain: "Thứ tự tăng dần: KB < MB < GB < TB (mỗi bậc gấp 1024 lần bậc trước)." },
    { type: "mc", topic: "A", grade: 10, level: "easy", question: "Bit là gì?", options: ["Đơn vị nhỏ nhất biểu diễn dữ liệu, nhận một trong hai giá trị 0 hoặc 1", "Một kí tự trong bảng mã ASCII", "Đơn vị đo tốc độ của CPU", "Một loại tệp hình ảnh"], answer: 0, explain: "Bit (binary digit) là đơn vị nhỏ nhất biểu diễn dữ liệu, chỉ nhận giá trị 0 hoặc 1. 8 bit = 1 byte." },
    { type: "mc", topic: "A", grade: 10, level: "medium", question: "Số nhị phân 1100₂ bằng số thập phân nào?", options: ["10", "12", "14", "24"], answer: 1, explain: "1100₂ = 1×8 + 1×4 + 0×2 + 0×1 = 12." },
    { type: "mc", topic: "A", grade: 10, level: "medium", question: "Với A = Đúng, B = Sai, biểu thức NOT(A OR B) có giá trị gì?", options: ["Đúng", "Sai", "Không xác định", "Bằng A"], answer: 1, explain: "A OR B = Đúng OR Sai = Đúng; NOT(Đúng) = Sai." },
    { type: "mc", topic: "A", grade: 11, level: "medium", question: "Điểm khác biệt cơ bản giữa ROM và RAM là gì?", options: ["ROM có dung lượng luôn lớn hơn RAM", "ROM giữ được dữ liệu khi tắt nguồn (không khả biến), thường chỉ đọc; RAM mất dữ liệu khi tắt nguồn", "ROM có tốc độ truy cập nhanh hơn RAM rất nhiều lần", "ROM là bộ nhớ ngoài, RAM là bộ nhớ trong"], answer: 1, explain: "ROM lưu dữ liệu cố định, không mất khi tắt nguồn và thường chỉ đọc; RAM là bộ nhớ khả biến, mất dữ liệu khi tắt nguồn. Cả hai đều là bộ nhớ trong." },
    { type: "mc", topic: "A", grade: 10, level: "hard", question: "Một đoạn văn bản gồm 500 kí tự, mỗi kí tự mã hoá bằng 1 byte (ASCII). Đoạn văn bản này chiếm bao nhiêu bit?", options: ["500 bit", "1000 bit", "4000 bit", "500 byte"], answer: 2, explain: "500 kí tự × 1 byte = 500 byte; 500 × 8 = 4000 bit." },
    { type: "tf", topic: "A", grade: 11, level: "medium", question: "Xét các phát biểu về hệ điều hành và bộ nhớ máy tính:", statements: [{ text: "Hệ điều hành là phần mềm hệ thống, khởi động cùng máy và quản lí phần cứng, tài nguyên.", correct: true }, { text: "Bộ nhớ ngoài (HDD, SSD, USB) dùng để lưu trữ dữ liệu lâu dài.", correct: true }, { text: "CPU là nơi lưu trữ dữ liệu chính, lâu dài của máy tính.", correct: false }, { text: "Dung lượng 1 TB lớn hơn 1 GB.", correct: true }], explain: "Ý (3) sai: CPU là bộ xử lí (thực hiện phép tính, điều khiển), không phải nơi lưu trữ lâu dài; lưu trữ lâu dài là của bộ nhớ ngoài. Các ý còn lại đúng." },

    /* E (+8) */
    { type: "mc", topic: "E", grade: 12, level: "easy", question: "Trong HTML, thẻ <br> dùng để làm gì?", options: ["Tạo một bảng", "Xuống dòng (ngắt dòng) trong nội dung", "Chèn một hình ảnh", "Tạo tiêu đề lớn"], answer: 1, explain: "<br> là thẻ ngắt dòng (line break), đưa nội dung sau nó xuống dòng mới. Đây là thẻ rỗng, không cần thẻ đóng." },
    { type: "mc", topic: "E", grade: 10, level: "easy", question: "Trong phần mềm đồ hoạ, 'lớp' (layer) có tác dụng gì?", options: ["Tăng độ phân giải của ảnh", "Cho phép đặt các đối tượng ở những tầng riêng để quản lí, ẩn/hiện, sắp xếp trên–dưới độc lập", "Chuyển ảnh vector thành ảnh bitmap", "Nén dung lượng tệp ảnh"], answer: 1, explain: "Lớp (layer) giống các tấm trong suốt chồng lên nhau; mỗi đối tượng đặt ở một lớp giúp quản lí, ẩn/hiện, khoá và sắp thứ tự trên–dưới độc lập." },
    { type: "mc", topic: "E", grade: 10, level: "medium", question: "Định dạng tệp nào sau đây là ảnh VECTOR?", options: ["JPG", "PNG", "SVG", "GIF"], answer: 2, explain: "SVG (Scalable Vector Graphics) là định dạng ảnh vector, phóng to không vỡ. JPG, PNG, GIF đều là ảnh điểm (bitmap)." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Trong CSS, đơn vị 'px' là gì?", options: ["Phần trăm so với phần tử cha", "Điểm ảnh (pixel)", "Đơn vị theo cỡ chữ", "Xăng-ti-mét trên màn hình"], answer: 1, explain: "px là điểm ảnh (pixel) — đơn vị độ dài tuyệt đối thường dùng trong CSS để đặt kích thước, khoảng cách." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Thẻ <input type=\"password\"> trong biểu mẫu HTML có đặc điểm gì?", options: ["Hiển thị nội dung nhập dưới dạng kí tự che (dấu chấm/sao) để bảo mật", "Chỉ cho nhập số", "Tự động gửi biểu mẫu khi nhập xong", "Không cho người dùng nhập gì cả"], answer: 0, explain: "input type=\"password\" là ô nhập mật khẩu, các kí tự gõ vào bị che (hiển thị dấu chấm/sao) để tránh lộ khi có người nhìn màn hình." },
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Trong HTML, muốn mở liên kết ở một tab/cửa sổ MỚI, dùng thuộc tính nào của thẻ <a>?", options: ["target=\"_blank\"", "new=\"tab\"", "open=\"new\"", "href=\"_blank\""], answer: 0, explain: "Thuộc tính target=\"_blank\" của thẻ <a> làm liên kết mở ở tab/cửa sổ mới, giữ nguyên trang hiện tại." },
    { type: "mc", topic: "E", grade: 12, level: "hard", question: "Cho đoạn CSS và HTML sau. Chữ trong thẻ <p class=\"big\"> có cỡ bao nhiêu?", code: "/* CSS */\np { font-size: 20px; }\n.big { font-size: 30px; }\n\n<!-- HTML -->\n<p class=\"big\">Xin chào</p>", options: ["20px vì quy tắc p áp cho mọi thẻ p", "30px vì bộ chọn lớp .big ưu tiên cao hơn bộ chọn thẻ p", "25px (trung bình hai giá trị)", "Không hiển thị vì mâu thuẫn"], answer: 1, explain: "Cả hai quy tắc cùng đặt font-size cho phần tử này; bộ chọn lớp (.big) có độ ưu tiên cao hơn bộ chọn thẻ (p) nên thắng → 30px." },
    { type: "tf", topic: "E", grade: 12, level: "medium", question: "Xét các phát biểu về HTML và CSS:", statements: [{ text: "HTML dùng để tạo cấu trúc, nội dung của trang web.", correct: true }, { text: "CSS dùng để định dạng, trình bày (màu sắc, phông chữ, bố cục) cho trang web.", correct: true }, { text: "Thẻ <img> cần có thuộc tính src để chỉ đường dẫn tới tệp ảnh.", correct: true }, { text: "Muốn ghi chú (comment) trong HTML, ta dùng cú pháp // ghi chú.", correct: false }], explain: "Ý (4) sai: chú thích trong HTML dùng cú pháp <!-- ghi chú -->, còn // là chú thích trong một số ngôn ngữ lập trình (như JavaScript/C). Ba ý còn lại đúng." },

    /* B (+6) */
    { type: "mc", topic: "B", grade: 12, level: "easy", question: "Mạng WAN (Wide Area Network) là gì?", options: ["Mạng cục bộ trong một phòng", "Mạng diện rộng, kết nối các mạng trên phạm vi địa lí lớn (thành phố, quốc gia, toàn cầu)", "Một loại cáp mạng", "Tên của một trình duyệt web"], answer: 1, explain: "WAN là mạng diện rộng, kết nối nhiều mạng/thiết bị trên phạm vi địa lí lớn; Internet là một ví dụ điển hình của WAN." },
    { type: "mc", topic: "B", grade: 10, level: "medium", question: "Địa chỉ IP có vai trò gì trong mạng?", options: ["Tăng tốc độ đường truyền", "Nhận diện và định vị một thiết bị để trao đổi dữ liệu trên mạng", "Mã hoá dữ liệu chống virus", "Lưu trữ trang web"], answer: 1, explain: "Địa chỉ IP là 'địa chỉ' của thiết bị trên mạng, giúp nhận diện và định tuyến dữ liệu đến đúng thiết bị." },
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Cáp quang truyền dữ liệu bằng phương tiện nào?", options: ["Dòng điện trong dây đồng", "Sóng vô tuyến", "Tín hiệu ánh sáng", "Sóng âm"], answer: 2, explain: "Cáp quang truyền dữ liệu bằng các xung ánh sáng trong sợi thuỷ tinh/nhựa trong suốt, cho tốc độ cao và ít nhiễu hơn cáp đồng." },
    { type: "mc", topic: "B", grade: 10, level: "medium", question: "Giao thức HTTP/HTTPS được dùng chủ yếu cho dịch vụ nào?", options: ["Gửi và nhận thư điện tử", "Truy cập, truyền tải các trang web (World Wide Web)", "Gọi điện video", "Sao lưu ổ cứng"], answer: 1, explain: "HTTP/HTTPS là giao thức truyền siêu văn bản, dùng để trình duyệt tải và hiển thị các trang web. Thư điện tử dùng SMTP/POP3/IMAP." },
    { type: "mc", topic: "B", grade: 12, level: "hard", question: "Một tệp 30 MB được tải qua đường truyền băng thông 20 Mb/s. Bỏ qua hao phí, thời gian tải tối thiểu là bao nhiêu? (1 byte = 8 bit)", options: ["1,5 giây", "12 giây", "24 giây", "240 giây"], answer: 1, explain: "30 MB = 30 × 8 = 240 Mb; thời gian = 240 ÷ 20 = 12 giây. Quên đổi MB sang Mb (×8) sẽ nhầm ra 1,5 giây." },
    { type: "tf", topic: "B", grade: 12, level: "hard", question: "Xét các phát biểu về thiết bị và tổ chức mạng:", statements: [{ text: "Switch chuyển dữ liệu đến đúng cổng thiết bị nhận, còn hub phát dữ liệu ra mọi cổng.", correct: true }, { text: "Access point cho phép thiết bị kết nối vào mạng qua Wi-Fi (không dây).", correct: true }, { text: "Mạng theo mô hình domain quản lí tài khoản tập trung qua máy chủ quản trị.", correct: true }, { text: "Băng thông 1 Gb/s nhỏ hơn băng thông 100 Mb/s.", correct: false }], explain: "Ý (4) sai: 1 Gb/s = 1000 Mb/s, lớn hơn 100 Mb/s rất nhiều. Ba ý còn lại đúng." },

    /* C (+4) */
    { type: "mc", topic: "C", grade: 11, level: "easy", question: "Trong một bảng của cơ sở dữ liệu quan hệ, một HÀNG (dòng) còn được gọi là gì?", options: ["Trường (field)", "Bản ghi (record)", "Khóa chính", "Truy vấn"], answer: 1, explain: "Mỗi hàng của bảng là một bản ghi (record), lưu thông tin về một đối tượng; mỗi cột là một trường (field/thuộc tính)." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Câu lệnh SQL 'SELECT * FROM HOCSINH;' trả về gì?", code: "SELECT * FROM HOCSINH;", options: ["Chỉ cột đầu tiên của bảng", "Toàn bộ các cột của mọi bản ghi trong bảng HOCSINH", "Số lượng bản ghi trong bảng", "Chỉ bản ghi đầu tiên"], answer: 1, explain: "Dấu * nghĩa là chọn tất cả các cột; không có WHERE nên lấy mọi bản ghi. Vậy lệnh trả về toàn bộ dữ liệu của bảng HOCSINH." },
    { type: "mc", topic: "C", grade: 11, level: "medium", question: "Trong SQL, câu lệnh nào dùng để XOÁ các bản ghi khỏi bảng (theo điều kiện)?", options: ["DELETE", "DROP", "SELECT", "UPDATE"], answer: 0, explain: "DELETE FROM ... WHERE ... xoá các bản ghi thỏa điều kiện. DROP dùng để xoá cả bảng/đối tượng; SELECT truy vấn; UPDATE sửa dữ liệu." },
    { type: "mc", topic: "C", grade: 11, level: "hard", question: "Cho bảng SANPHAM gồm: (Bút bi, 5000), (Vở, 12000), (Thước, 8000), (Tẩy, 3000). Câu lệnh sau trả về giá trị nào?", code: "SELECT COUNT(*) FROM SANPHAM\nWHERE Gia >= 8000;", options: ["1", "2", "3", "4"], answer: 1, explain: "Điều kiện Gia >= 8000 đúng với Vở (12000) và Thước (8000) → COUNT(*) = 2. Bút bi (5000) và Tẩy (3000) bị loại." },

    /* G (+8) */
    { type: "mc", topic: "G", grade: 12, level: "easy", question: "AI là viết tắt của cụm từ tiếng Anh nào?", options: ["Automatic Internet", "Artificial Intelligence", "Advanced Information", "Applied Interface"], answer: 1, explain: "AI = Artificial Intelligence (Trí tuệ nhân tạo)." },
    { type: "mc", topic: "G", grade: 12, level: "easy", question: "Học máy (Machine Learning) về cơ bản là gì?", options: ["Việc lắp ráp phần cứng máy tính", "Cách để máy tính tự học từ dữ liệu nhằm đưa ra dự đoán/quyết định, thay vì được lập trình từng bước cụ thể", "Một loại virus máy tính", "Cách gõ máy tính bằng mười ngón"], answer: 1, explain: "Học máy là một nhánh của AI, trong đó máy tính học các quy luật từ dữ liệu để dự đoán/quyết định, thay vì con người phải lập trình mọi quy tắc." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Trợ lí ảo (như Siri, Google Assistant) hiểu và trả lời câu nói của người dùng chủ yếu nhờ công nghệ AI nào?", options: ["Xử lí ngôn ngữ tự nhiên (NLP)", "Nén dữ liệu", "Mã hoá bảo mật", "Tăng tốc phần cứng"], answer: 0, explain: "Trợ lí ảo dùng xử lí ngôn ngữ tự nhiên (Natural Language Processing) để nhận dạng giọng nói, hiểu ý và tạo câu trả lời bằng ngôn ngữ người." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Trong đặc trưng 5V của dữ liệu lớn, chữ V nào chỉ TỐC ĐỘ dữ liệu được sinh ra và xử lí?", options: ["Volume", "Velocity", "Variety", "Value"], answer: 1, explain: "Velocity chỉ tốc độ. Volume là khối lượng, Variety là sự đa dạng, Value là giá trị, Veracity là độ tin cậy." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Trực quan hoá dữ liệu (data visualization) là gì?", options: ["Xoá bớt dữ liệu thừa", "Biểu diễn dữ liệu bằng biểu đồ, đồ thị, hình ảnh để con người dễ quan sát, nhận ra quy luật", "Mã hoá dữ liệu để bảo mật", "Sao lưu dữ liệu ra ổ cứng ngoài"], answer: 1, explain: "Trực quan hoá dữ liệu là biểu diễn dữ liệu dưới dạng biểu đồ/đồ thị/hình ảnh, giúp con người dễ nắm bắt xu hướng, quy luật ẩn trong dữ liệu." },
    { type: "mc", topic: "G", grade: 12, level: "medium", question: "Phát biểu nào sau đây ĐÚNG về hạn chế của AI hiện nay?", options: ["AI hoàn toàn không mắc sai lầm", "AI có thể mắc lỗi hoặc thiên lệch nếu dữ liệu huấn luyện kém chất lượng hoặc thiếu cân bằng", "AI đã có cảm xúc và ý thức như con người", "AI không cần dữ liệu để hoạt động"], answer: 1, explain: "AI học từ dữ liệu nên nếu dữ liệu sai lệch/thiếu cân bằng, AI sẽ học theo và mắc lỗi hoặc thiên lệch. AI hiện nay chưa có ý thức, cảm xúc thật." },
    { type: "mc", topic: "G", grade: 12, level: "hard", question: "Một ứng dụng dự báo thời tiết được huấn luyện từ dữ liệu nhiều năm, mỗi ngày đã ghi các chỉ số (nhiệt độ, độ ẩm…) KÈM kết quả thực tế 'có mưa / không mưa', rồi dự đoán cho ngày mới. Đây là kiểu học máy nào?", options: ["Học có giám sát, vì dữ liệu huấn luyện đã có nhãn kết quả (có mưa / không mưa)", "Học không giám sát, vì có nhiều chỉ số đầu vào", "Không phải học máy, vì chỉ tra cứu số liệu cũ", "Mô phỏng, vì liên quan đến thời tiết"], answer: 0, explain: "Dữ liệu huấn luyện đã gắn nhãn kết quả (có mưa / không mưa) và mục tiêu là dự đoán nhãn cho dữ liệu mới → học có giám sát." },
    { type: "tf", topic: "G", grade: 12, level: "medium", question: "Xét các phát biểu về trí tuệ nhân tạo và học máy:", statements: [{ text: "Học máy là một nhánh của trí tuệ nhân tạo.", correct: true }, { text: "Học có giám sát dùng dữ liệu đã được gán nhãn.", correct: true }, { text: "Nhận dạng khuôn mặt, dịch tự động là những ứng dụng của AI.", correct: true }, { text: "Chất lượng dữ liệu huấn luyện không ảnh hưởng gì đến độ chính xác của mô hình học máy.", correct: false }], explain: "Ý (4) sai: chất lượng dữ liệu huấn luyện ảnh hưởng trực tiếp đến độ chính xác — dữ liệu sai/thiếu/thiên lệch làm mô hình kém và thiên lệch. Ba ý còn lại đúng." },

    /* F (+2) */
    { type: "mc", topic: "F", grade: 10, level: "medium", question: "Đoạn chương trình sau in ra gì?", code: "a = [1, 2, 3, 4]\nprint(a[-1], a[-2])", options: ["1 2", "4 3", "3 4", "Báo lỗi"], answer: 1, explain: "Chỉ số âm đếm từ cuối: a[-1] là phần tử cuối = 4; a[-2] = 3. In '4 3'." },
    { type: "mc", topic: "F", grade: 11, level: "hard", question: "Kết quả in ra của đoạn chương trình sau là gì?", code: "s = 0\nfor i in range(2, 10, 3):\n    s += i\nprint(s)", options: ["12", "15", "18", "24"], answer: 1, explain: "range(2, 10, 3) sinh ra 2, 5, 8 (bước nhảy 3, dừng trước 10). Tổng s = 2 + 5 + 8 = 15." }
  ];
  var max = {};
  QUESTION_BANK.forEach(function (q) { var m = String(q.id).match(/^([A-G])-(mc|tf|sa)-(\d+)$/); if (m) { var k = m[1] + "-" + m[2]; if (!max[k] || +m[3] > max[k]) max[k] = +m[3]; } });
  NEW.forEach(function (q) { var k = q.topic + "-" + q.type; max[k] = (max[k] || 0) + 1; q.id = k + "-" + max[k]; });
  QUESTION_BANK.push.apply(QUESTION_BANK, NEW);
})();

/* ==== Đợt D · làm tròn (D→60, B→80, E→100) — câu gốc, id tự gán ==== */
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var NEW = [
    /* D · Đạo đức, pháp luật, an toàn (+8) */
    { type: "mc", topic: "D", grade: 12, level: "easy", question: "Việc cài đặt và sử dụng phần mềm không có bản quyền (phần mềm lậu) là hành vi:", options: ["Hợp pháp vì máy tính là của mình", "Vi phạm quyền sở hữu trí tuệ (bản quyền)", "Được khuyến khích để tiết kiệm chi phí", "Chỉ vi phạm nếu đem bán lại"], answer: 1, explain: "Phần mềm là sản phẩm trí tuệ được pháp luật bảo hộ; dùng bản không có bản quyền là vi phạm quyền sở hữu trí tuệ, dù chỉ dùng cho cá nhân." },
    { type: "mc", topic: "D", grade: 12, level: "easy", question: "Xác thực hai bước (2FA) giúp ích gì cho tài khoản của em?", options: ["Giúp mật khẩu tự động dài hơn", "Tăng bảo mật: ngoài mật khẩu còn cần thêm mã xác thực nên kẻ gian khó chiếm tài khoản", "Giúp đăng nhập nhanh hơn mà không cần mật khẩu", "Giúp tăng dung lượng lưu trữ"], answer: 1, explain: "Xác thực hai bước yêu cầu thêm một yếu tố (mã OTP, ứng dụng xác thực...) ngoài mật khẩu, nên dù lộ mật khẩu, kẻ gian vẫn khó đăng nhập." },
    { type: "mc", topic: "D", grade: 11, level: "medium", question: "Khi chứng kiến một bạn bị bắt nạt, xúc phạm trên mạng (cyberbullying), cách ứng xử ĐÚNG là gì?", options: ["Hùa theo bình luận cho vui", "Chia sẻ lại để nhiều người cùng chỉ trích nạn nhân", "Không hùa theo; động viên bạn, lưu bằng chứng và báo cho thầy cô/người lớn tin cậy", "Lờ đi vì không phải việc của mình"], answer: 2, explain: "Không tiếp tay lan truyền; nên đứng về phía nạn nhân, lưu lại bằng chứng (ảnh chụp màn hình) và báo người lớn/nhà trường để được hỗ trợ xử lí." },
    { type: "mc", topic: "D", grade: 10, level: "medium", question: "Em nhận được email từ địa chỉ lạ, kèm tệp đính kèm tên 'HoaDon.exe'. Em nên làm gì?", options: ["Mở ngay để xem hóa đơn", "Không mở tệp, xóa email vì tệp .exe từ người lạ có nguy cơ chứa mã độc", "Chuyển tiếp cho bạn bè mở giúp", "Trả lời email hỏi nội dung rồi mở"], answer: 1, explain: "Tệp thực thi (.exe) từ nguồn lạ là dấu hiệu điển hình của mã độc. Tuyệt đối không mở, không chuyển tiếp; nên xóa email đáng ngờ." },
    { type: "mc", topic: "D", grade: 11, level: "medium", question: "Việc đăng công khai số căn cước công dân, địa chỉ nhà, số điện thoại lên mạng xã hội có thể dẫn đến rủi ro nào?", options: ["Không có rủi ro gì", "Bị kẻ gian lợi dụng để mạo danh, lừa đảo hoặc đánh cắp danh tính", "Giúp tài khoản được xác minh nhanh hơn", "Tăng số người theo dõi"], answer: 1, explain: "Thông tin định danh cá nhân bị lộ có thể bị dùng để mạo danh, vay tiền, lừa đảo hoặc đánh cắp danh tính. Cần hạn chế chia sẻ và đặt chế độ riêng tư." },
    { type: "mc", topic: "D", grade: 12, level: "hard", question: "Em nhận tin nhắn: 'Tài khoản của bạn có hoạt động bất thường, hãy đăng nhập lại tại đây để xác minh' kèm một liên kết. Trang mở ra GIỐNG hệt trang đăng nhập quen thuộc nhưng địa chỉ (URL) lại lạ. Em nên làm gì?", options: ["Nhập tài khoản, mật khẩu ngay để xác minh cho nhanh", "Không nhập gì; đây là dấu hiệu lừa đảo (phishing) giả mạo trang đăng nhập để đánh cắp mật khẩu", "Nhập mật khẩu cũ đã đổi để thử xem có đúng không", "Nhập tài khoản nhưng để trống mật khẩu"], answer: 1, explain: "Trang giả mạo giao diện thật nhưng URL lạ là chiêu phishing để đánh cắp thông tin đăng nhập. Không nhập gì; hãy tự vào trang chính thức bằng địa chỉ đã biết để kiểm tra." },
    { type: "tf", topic: "D", grade: 11, level: "medium", question: "Xét các phát biểu về an toàn thông tin cá nhân trên mạng:", statements: [{ text: "Nên dùng mật khẩu khác nhau cho các tài khoản quan trọng thay vì dùng chung một mật khẩu.", correct: true }, { text: "Cập nhật phần mềm, hệ điều hành thường xuyên giúp vá các lỗ hổng bảo mật.", correct: true }, { text: "Có thể yên tâm bấm vào mọi đường link bạn bè gửi mà không cần kiểm tra, vì đã là bạn bè.", correct: false }, { text: "Nên đăng xuất tài khoản khi dùng máy tính công cộng.", correct: true }], explain: "Ý (3) sai: tài khoản bạn bè có thể bị chiếm và gửi link độc hại; luôn cần thận trọng với mọi đường link. Các ý còn lại đều là thói quen an toàn đúng đắn." },
    { type: "tf", topic: "D", grade: 12, level: "hard", question: "Xét các phát biểu về bản quyền và ứng xử có đạo đức khi dùng sản phẩm số:", statements: [{ text: "Chép bài viết của người khác rồi ghi tên mình là tác giả là hành vi đạo văn.", correct: true }, { text: "Nhạc, phim, phần mềm chia sẻ trái phép trên mạng thì được tự do tải về vì không phải mình đăng lên.", correct: false }, { text: "Khi dùng hình ảnh có giấy phép yêu cầu ghi nguồn, ta phải ghi rõ tên tác giả/nguồn.", correct: true }, { text: "Sản phẩm do trí tuệ nhân tạo tạo ra theo yêu cầu của em vẫn cần được kiểm chứng tính chính xác trước khi sử dụng.", correct: true }], explain: "Ý (2) sai: tải nội dung vi phạm bản quyền (dù người khác đăng) vẫn là tiếp tay và có thể vi phạm pháp luật. Các ý còn lại đúng." },

    /* B · Mạng máy tính (+2) */
    { type: "mc", topic: "B", grade: 12, level: "medium", question: "Mạng LAN (Local Area Network) có đặc điểm gì?", options: ["Kết nối các thiết bị trong phạm vi hẹp như một phòng, một tòa nhà", "Kết nối các máy tính trên phạm vi toàn cầu", "Chỉ có thể dùng kết nối không dây", "Là tên gọi khác của mạng Internet"], answer: 0, explain: "LAN là mạng cục bộ, kết nối các thiết bị trong phạm vi địa lí hẹp (phòng học, văn phòng, tòa nhà). Phạm vi rộng lớn là của WAN." },
    { type: "mc", topic: "B", grade: 12, level: "hard", question: "Tải một tệp 250 MB qua đường truyền có băng thông 100 Mbps (megabit/giây). Bỏ qua hao phí, thời gian tải tối thiểu là bao nhiêu? (1 byte = 8 bit)", options: ["2,5 giây", "20 giây", "25 giây", "200 giây"], answer: 1, explain: "250 MB = 250 × 8 = 2000 Mb (megabit); thời gian = 2000 ÷ 100 = 20 giây. Nếu quên đổi byte sang bit (×8) sẽ nhầm ra 2,5 giây." },

    /* E · Web & Đồ hoạ (+2) */
    { type: "mc", topic: "E", grade: 12, level: "medium", question: "Trong HTML, nhóm thẻ <h1> đến <h6> dùng để làm gì?", options: ["Tạo các đề mục (tiêu đề) với <h1> quan trọng/lớn nhất, giảm dần đến <h6>", "Chèn 6 hình ảnh khác nhau", "Tạo bảng có 6 cột", "Đánh số trang từ 1 đến 6"], answer: 0, explain: "<h1> đến <h6> là các thẻ đề mục (heading); <h1> có mức quan trọng và cỡ chữ mặc định lớn nhất, giảm dần tới <h6>." },
    { type: "mc", topic: "E", grade: 12, level: "hard", question: "Cho quy tắc CSS sau (chú ý box-sizing). Chiều rộng thực mà hộp chiếm chỗ (không tính margin) là bao nhiêu?", code: ".box {\n  box-sizing: border-box;\n  width: 100px;\n  padding: 10px;\n  border: 5px solid black;\n}", options: ["100px", "120px", "130px", "140px"], answer: 0, explain: "Với box-sizing: border-box, giá trị width (100px) đã BAO GỒM cả padding và border, nên hộp chiếm đúng 100px; vùng nội dung bên trong co lại còn 100 − 20 − 10 = 70px. (Nếu là content-box mặc định mới cộng thêm thành 130px.)" }
  ];
  var max = {};
  QUESTION_BANK.forEach(function (q) { var m = String(q.id).match(/^([A-G])-(mc|tf|sa)-(\d+)$/); if (m) { var k = m[1] + "-" + m[2]; if (!max[k] || +m[3] > max[k]) max[k] = +m[3]; } });
  NEW.forEach(function (q) { var k = q.topic + "-" + q.type; max[k] = (max[k] || 0) + 1; q.id = k + "-" + max[k]; });
  QUESTION_BANK.push.apply(QUESTION_BANK, NEW);
})();
