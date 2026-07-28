/* ============================================================================
 *  CAU HOI ON TAP (dot 2) — LAM DAY NHANH TIN HOC UNG DUNG (dinh huong UD).
 *  22 bai U11/U12 x (4 mc + 2 tf) = 132 cau. Push vao QUESTION_BANK.
 *  Nap SAU cac tep cau hoi khac (questions*.js). Gan dung topic+grade cua tung bai.
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var Q = [
 {
  "id": "UD2-mc-001",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Hệ quản trị cơ sở dữ liệu (hệ QTCSDL) là gì?",
  "options": [
   "Một thiết bị phần cứng dùng để lưu trữ dữ liệu",
   "Một bảng tính điện tử chỉ dùng để tính toán số liệu",
   "Phần mềm để tạo, nhập và khai thác cơ sở dữ liệu ngay trên máy tính",
   "Một loại tệp văn bản chứa dữ liệu thô"
  ],
  "answer": 2,
  "explain": "C đúng vì hệ QTCSDL là phần mềm giúp tạo, nhập và khai thác cơ sở dữ liệu ngay trên máy. A sai vì hệ QTCSDL là phần mềm, không phải phần cứng. B sai vì bảng tính không phải hệ QTCSDL. D sai vì tệp văn bản chỉ chứa dữ liệu, không có chức năng quản trị."
 },
 {
  "id": "UD2-mc-002",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Bốn đối tượng chính trong một hệ QTCSDL gồm những gì?",
  "options": [
   "Bảng, biểu mẫu, truy vấn, báo cáo",
   "Bảng, cột, hàng, ô",
   "Tệp, thư mục, ổ đĩa, mạng",
   "Chữ, số, ngày, hình ảnh"
  ],
  "answer": 0,
  "explain": "A đúng: bốn đối tượng chính là bảng (chứa dữ liệu), biểu mẫu (nhập), truy vấn (lọc tìm) và báo cáo (in). B sai vì cột, hàng, ô là thành phần bên trong bảng chứ không phải bốn đối tượng. C sai vì đó là khái niệm về hệ thống tệp. D sai vì đó là các kiểu dữ liệu."
 },
 {
  "id": "UD2-mc-003",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Đối tượng nào thực sự chứa dữ liệu trong hệ QTCSDL?",
  "options": [
   "Biểu mẫu",
   "Truy vấn",
   "Báo cáo",
   "Bảng"
  ],
  "answer": 3,
  "explain": "D đúng vì chỉ có bảng chứa dữ liệu thật. A, B, C sai vì biểu mẫu, truy vấn và báo cáo chỉ là cách nhìn và làm việc với dữ liệu đã có trong bảng, bản thân chúng không lưu dữ liệu."
 },
 {
  "id": "UD2-mc-004",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Quy trình chung khi làm việc với hệ QTCSDL được thực hiện theo thứ tự nào?",
  "options": [
   "Nhập dữ liệu, rồi tạo bảng, rồi tạo tệp CSDL, cuối cùng khai thác",
   "Tạo tệp CSDL rỗng, rồi tạo bảng, nhập dữ liệu, cuối cùng mới khai thác",
   "Khai thác dữ liệu, rồi tạo bảng, nhập dữ liệu, cuối cùng tạo tệp CSDL",
   "Tạo bảng, rồi tạo tệp CSDL rỗng, khai thác, cuối cùng mới nhập dữ liệu"
  ],
  "answer": 1,
  "explain": "B đúng vì phải tạo tệp CSDL rỗng trước, rồi tạo bảng, nhập dữ liệu, cuối cùng mới khai thác. Các phương án A, C, D sai vì đảo lộn thứ tự: không thể nhập dữ liệu hay khai thác khi chưa có tệp CSDL và chưa có bảng."
 },
 {
  "id": "UD2-tf-001",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Hệ QTCSDL là phần mềm giúp tạo, nhập và khai thác cơ sở dữ liệu trên máy.",
    "correct": true
   },
   {
    "text": "Trong bốn đối tượng, báo cáo dùng để in dữ liệu ra.",
    "correct": true
   },
   {
    "text": "Truy vấn và biểu mẫu cũng lưu trữ dữ liệu thật giống như bảng.",
    "correct": false
   },
   {
    "text": "Biểu mẫu là đối tượng dùng để nhập dữ liệu.",
    "correct": true
   }
  ],
  "explain": "(a) đúng vì đó là định nghĩa của hệ QTCSDL. (b) đúng vì báo cáo dùng để in dữ liệu. (c) sai vì chỉ bảng mới chứa dữ liệu thật, truy vấn và biểu mẫu chỉ là cách nhìn và làm việc với dữ liệu trong bảng. (d) đúng vì biểu mẫu dùng để nhập dữ liệu."
 },
 {
  "id": "UD2-tf-002",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Có thể nhập dữ liệu vào bảng ngay cả khi chưa tạo tệp cơ sở dữ liệu.",
    "correct": false
   },
   {
    "text": "Truy vấn dùng để lọc, tìm dữ liệu theo yêu cầu.",
    "correct": true
   },
   {
    "text": "Báo cáo là nơi lưu trữ dữ liệu gốc của cơ sở dữ liệu.",
    "correct": false
   },
   {
    "text": "Khai thác dữ liệu là bước cuối cùng trong quy trình chung.",
    "correct": true
   }
  ],
  "explain": "(a) sai vì phải tạo tệp CSDL rỗng trước rồi mới tạo bảng và nhập dữ liệu. (b) đúng vì truy vấn dùng để lọc, tìm dữ liệu. (c) sai vì chỉ bảng mới chứa dữ liệu thật, báo cáo chỉ dùng để in. (d) đúng vì quy trình kết thúc ở bước khai thác."
 },
 {
  "id": "UD2-mc-005",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Trong một bảng của cơ sở dữ liệu, trường và bản ghi tương ứng với thành phần nào?",
  "options": [
   "Trường là hàng, bản ghi là cột",
   "Trường là cột, bản ghi là hàng",
   "Trường là ô, bản ghi là bảng",
   "Trường là bảng, bản ghi là ô"
  ],
  "answer": 1,
  "explain": "B đúng vì trong bảng, trường chính là cột và bản ghi chính là hàng. A sai vì đảo ngược cột và hàng. C và D sai vì nhầm lẫn trường và bản ghi với ô và bảng."
 },
 {
  "id": "UD2-mc-006",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Vì sao phải thiết kế cấu trúc bảng trước khi nhập dữ liệu?",
  "options": [
   "Vì máy tính không cho phép nhập dữ liệu vào buổi sáng",
   "Vì dữ liệu phải được in ra giấy trước khi nhập",
   "Vì mỗi bảng chỉ được nhập đúng một bản ghi",
   "Vì cần khai báo tên trường và kiểu dữ liệu để bảng có khung chứa dữ liệu"
  ],
  "answer": 3,
  "explain": "D đúng vì phải thiết kế cấu trúc (tên trường, kiểu dữ liệu) trước để bảng có khung chứa dữ liệu rồi mới nhập. A sai vì thời điểm trong ngày không liên quan. B sai vì không cần in trước khi nhập. C sai vì một bảng chứa được nhiều bản ghi."
 },
 {
  "id": "UD2-mc-007",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Việc chọn đúng kiểu dữ liệu cho mỗi trường có tác dụng gì?",
  "options": [
   "Giúp dữ liệu sạch, đúng dạng và có thể tính toán được",
   "Làm cho bảng có nhiều màu sắc hơn",
   "Giúp tăng tốc độ mạng Internet",
   "Làm cho tên trường tự động dài ra"
  ],
  "answer": 0,
  "explain": "A đúng vì chọn đúng kiểu dữ liệu (văn bản, số, ngày/giờ, lôgic) giúp dữ liệu sạch và tính toán được. B, C, D sai vì kiểu dữ liệu không liên quan đến màu sắc, tốc độ mạng hay độ dài tên trường."
 },
 {
  "id": "UD2-mc-008",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Phát biểu nào đúng về khoá chính của một bảng?",
  "options": [
   "Là trường được phép trùng lặp giữa các bản ghi",
   "Bắt buộc phải là trường họ và tên của người",
   "Là trường định danh duy nhất, không được trống ở mỗi bản ghi",
   "Là trường luôn để trống để máy tự điền"
  ],
  "answer": 2,
  "explain": "C đúng vì khoá chính định danh duy nhất từng bản ghi và không được trống. A sai vì khoá chính phải duy nhất, không được trùng. B sai vì nên dùng trường mã riêng thay vì họ tên (họ tên có thể trùng). D sai vì khoá chính không được để trống."
 },
 {
  "id": "UD2-tf-003",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Mỗi trường trong bảng có một tên và một kiểu dữ liệu.",
    "correct": true
   },
   {
    "text": "Nên dùng một trường mã riêng làm khoá chính thay vì dùng họ và tên.",
    "correct": true
   },
   {
    "text": "Có thể nhập dữ liệu vào bảng mà không cần thiết kế cấu trúc trước.",
    "correct": false
   },
   {
    "text": "Khoá chính được phép để trống ở một số bản ghi.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì mỗi trường có một tên và một kiểu dữ liệu. (b) đúng vì nên dùng mã riêng vì họ tên có thể trùng nhau. (c) sai vì phải thiết kế cấu trúc trước rồi mới nhập dữ liệu. (d) sai vì khoá chính không được trống ở bất kỳ bản ghi nào."
 },
 {
  "id": "UD2-tf-004",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Chế độ thiết kế dùng để dựng và sửa cấu trúc (khung) của bảng.",
    "correct": true
   },
   {
    "text": "Chế độ nhập dữ liệu dùng để điền các bản ghi vào bảng.",
    "correct": true
   },
   {
    "text": "Chế độ thiết kế và chế độ nhập dữ liệu là hai cách nhìn của cùng một bảng.",
    "correct": true
   },
   {
    "text": "Muốn tính toán trên dữ liệu số, ta nên khai báo trường đó là kiểu văn bản.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì chế độ thiết kế dùng để dựng và sửa khung bảng. (b) đúng vì chế độ nhập dữ liệu dùng để điền bản ghi. (c) đúng vì hai chế độ là hai cách nhìn của cùng một bảng. (d) sai vì muốn tính toán phải chọn kiểu số, không phải kiểu văn bản."
 },
 {
  "id": "UD2-mc-009",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Thứ tự đúng khi tạo lập cơ sở dữ liệu và bảng là gì?",
  "options": [
   "Nhập bản ghi, rồi tạo bảng, rồi tạo cơ sở dữ liệu",
   "Tạo bảng, rồi nhập bản ghi, rồi mới tạo cơ sở dữ liệu",
   "Tạo cơ sở dữ liệu, rồi nhập bản ghi, rồi mới tạo bảng",
   "Tạo cơ sở dữ liệu, rồi tạo bảng, rồi mới nhập bản ghi"
  ],
  "answer": 3,
  "explain": "D đúng vì phải tạo cơ sở dữ liệu trước, rồi tạo bảng, cuối cùng mới nhập bản ghi. A, B, C sai vì đảo lộn thứ tự: không thể nhập bản ghi khi chưa có bảng, và chưa có cơ sở dữ liệu thì chưa tạo được bảng."
 },
 {
  "id": "UD2-mc-010",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Khi tạo một cơ sở dữ liệu mới, cần chú ý điều gì?",
  "options": [
   "Không cần đặt tên vì máy sẽ tự xoá khi tắt",
   "Đặt tên và chọn nơi lưu rõ ràng, nên lưu sớm",
   "Phải nhập hết dữ liệu rồi mới được đặt tên",
   "Chỉ được lưu sau khi đã in báo cáo"
  ],
  "answer": 1,
  "explain": "B đúng vì tạo cơ sở dữ liệu cần đặt tên, chọn nơi lưu rõ ràng và nên lưu sớm. A sai vì phải đặt tên và cơ sở dữ liệu không tự xoá. C sai vì việc đặt tên và lưu làm trước khi nhập dữ liệu. D sai vì lưu không phụ thuộc vào việc in báo cáo."
 },
 {
  "id": "UD2-mc-011",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Ở chế độ thiết kế, khi tạo một bảng mới ta thực hiện những việc gì?",
  "options": [
   "Chỉ cần gõ ngay các bản ghi mà không khai báo trường",
   "Vẽ biểu đồ và tô màu trang trí cho bảng",
   "Khai báo trường, chọn kiểu dữ liệu, đặt khoá chính, rồi lưu và đặt tên bảng",
   "Kết nối máy in rồi in ra một bảng trắng"
  ],
  "answer": 2,
  "explain": "C đúng vì tạo bảng ở chế độ thiết kế gồm khai báo trường, chọn kiểu dữ liệu, đặt khoá chính, rồi lưu và đặt tên bảng. A sai vì phải khai báo trường trước khi nhập. B, D sai vì không liên quan đến việc thiết kế cấu trúc bảng."
 },
 {
  "id": "UD2-mc-012",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Vì sao nên nhập vài bản ghi mẫu ngay sau khi tạo bảng?",
  "options": [
   "Để kiểm tra cấu trúc, phát hiện sớm lỗi kiểu dữ liệu và khoá chính",
   "Để làm cho tệp cơ sở dữ liệu nặng hơn",
   "Để thay thế cho việc thiết kế cấu trúc bảng",
   "Để tự động tạo thêm nhiều bảng mới"
  ],
  "answer": 0,
  "explain": "A đúng vì nhập vài bản ghi mẫu giúp kiểm tra cấu trúc, phát hiện sớm lỗi kiểu dữ liệu và khoá chính. B sai vì mục đích không phải làm nặng tệp. C sai vì nhập mẫu không thay thế việc thiết kế cấu trúc. D sai vì nhập bản ghi không tạo thêm bảng."
 },
 {
  "id": "UD2-tf-005",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Nên đặt tên và chọn nơi lưu cho cơ sở dữ liệu ngay từ sớm.",
    "correct": true
   },
   {
    "text": "Có thể nhập bản ghi trước khi tạo bảng.",
    "correct": false
   },
   {
    "text": "Đặt khoá chính là một việc làm khi tạo bảng ở chế độ thiết kế.",
    "correct": true
   },
   {
    "text": "Nhập vài bản ghi mẫu giúp phát hiện sớm lỗi kiểu dữ liệu.",
    "correct": true
   }
  ],
  "explain": "(a) đúng vì nên đặt tên, chọn nơi lưu và lưu sớm. (b) sai vì phải tạo bảng trước rồi mới nhập bản ghi. (c) đúng vì đặt khoá chính là một bước khi thiết kế bảng. (d) đúng vì bản ghi mẫu giúp phát hiện sớm lỗi kiểu dữ liệu và khoá chính."
 },
 {
  "id": "UD2-tf-006",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Tạo cơ sở dữ liệu là bước làm trước khi tạo bảng.",
    "correct": true
   },
   {
    "text": "Khi tạo bảng ở chế độ thiết kế, ta khai báo trường và chọn kiểu dữ liệu.",
    "correct": true
   },
   {
    "text": "Sau khi thiết kế xong, bảng không cần được lưu và đặt tên.",
    "correct": false
   },
   {
    "text": "Việc nhập bản ghi mẫu là để thay cho bước đặt khoá chính.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì tạo cơ sở dữ liệu trước rồi mới tạo bảng. (b) đúng vì thiết kế bảng gồm khai báo trường và chọn kiểu dữ liệu. (c) sai vì phải lưu và đặt tên bảng sau khi thiết kế. (d) sai vì nhập bản ghi mẫu để kiểm tra cấu trúc, không thay thế việc đặt khoá chính."
 },
 {
  "id": "UD2-mc-013",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Vì sao nên tách dữ liệu thành nhiều bảng?",
  "options": [
   "Để tránh trùng lặp và giữ nhất quán, mỗi thông tin gốc ghi đúng một chỗ",
   "Để mỗi bảng chỉ chứa được đúng một bản ghi",
   "Để dữ liệu bị lặp lại càng nhiều càng tốt",
   "Để không cần dùng khoá chính nữa"
  ],
  "answer": 0,
  "explain": "A đúng vì tách bảng giúp tránh trùng lặp, giữ nhất quán, mỗi thông tin gốc chỉ ghi đúng một chỗ. B sai vì mỗi bảng chứa được nhiều bản ghi. C sai vì mục đích là giảm trùng lặp chứ không phải tăng. D sai vì tách bảng vẫn cần dùng khoá chính."
 },
 {
  "id": "UD2-mc-014",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Khoá ngoài là gì?",
  "options": [
   "Trường ở bảng cha định danh duy nhất mỗi bản ghi",
   "Một trường luôn để trống trong mọi bảng",
   "Trường ở bảng con tham chiếu tới khoá chính của bảng cha",
   "Tên của tệp cơ sở dữ liệu"
  ],
  "answer": 2,
  "explain": "C đúng vì khoá ngoài là trường ở bảng con trỏ tới khoá chính của bảng cha. A sai vì đó là mô tả khoá chính. B sai vì khoá ngoài chứa giá trị tham chiếu chứ không để trống. D sai vì khoá ngoài là một trường trong bảng, không phải tên tệp."
 },
 {
  "id": "UD2-mc-015",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Giá trị của khoá ngoài ở bảng con phải thoả điều kiện nào?",
  "options": [
   "Phải là giá trị chưa từng xuất hiện ở bất kỳ bảng nào",
   "Phải là giá trị đã tồn tại trong khoá chính của bảng cha",
   "Phải luôn khác kiểu dữ liệu với khoá chính bảng cha",
   "Phải là một số ngẫu nhiên do người dùng tự nghĩ ra"
  ],
  "answer": 1,
  "explain": "B đúng vì giá trị khoá ngoài phải đã tồn tại bên khoá chính của bảng cha để trỏ đúng một bản ghi cha. A sai vì ngược lại, nó phải trùng với một giá trị đã có bên bảng cha. C sai vì khoá ngoài phải cùng kiểu để so khớp được. D sai vì không thể là giá trị tuỳ ý chưa có bên bảng cha."
 },
 {
  "id": "UD2-mc-016",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Trong liên kết một - nhiều giữa hai bảng, phát biểu nào đúng?",
  "options": [
   "Phía một giữ khoá ngoài, phía nhiều giữ khoá chính",
   "Cả khoá chính và khoá ngoài đều không được phép lặp lại",
   "Khoá chính được phép lặp còn khoá ngoài phải duy nhất",
   "Phía một giữ khoá chính, phía nhiều giữ khoá ngoài trỏ về; khoá ngoài được phép lặp lại"
  ],
  "answer": 3,
  "explain": "D đúng vì phía một giữ khoá chính (duy nhất), phía nhiều giữ khoá ngoài trỏ về, và khoá ngoài được phép lặp vì nhiều bản ghi con cùng trỏ về một bản ghi cha. A sai vì đảo ngược vai trò. B sai vì khoá ngoài được phép lặp. C sai vì ngược lại: khoá chính phải duy nhất, khoá ngoài mới được lặp."
 },
 {
  "id": "UD2-tf-007",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Khoá chính phải duy nhất giữa các bản ghi.",
    "correct": true
   },
   {
    "text": "Khoá ngoài được phép lặp lại vì nhiều bản ghi con cùng trỏ về một bản ghi cha.",
    "correct": true
   },
   {
    "text": "Khoá ngoài có thể mang giá trị chưa hề tồn tại ở bảng cha.",
    "correct": false
   },
   {
    "text": "Tách dữ liệu thành nhiều bảng giúp tránh trùng lặp và giữ nhất quán.",
    "correct": true
   }
  ],
  "explain": "(a) đúng vì khoá chính định danh duy nhất từng bản ghi. (b) đúng vì khoá ngoài được phép lặp do nhiều bản ghi con cùng trỏ về một bản ghi cha. (c) sai vì giá trị khoá ngoài phải đã tồn tại ở khoá chính của bảng cha. (d) đúng vì tách bảng để tránh trùng lặp, giữ nhất quán."
 },
 {
  "id": "UD2-tf-008",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Trong liên kết một - nhiều, phía nhiều là nơi giữ khoá ngoài.",
    "correct": true
   },
   {
    "text": "Khoá ngoài nằm ở bảng con và tham chiếu tới khoá chính của bảng cha.",
    "correct": true
   },
   {
    "text": "Mỗi thông tin gốc nên được ghi lặp ở nhiều bảng khác nhau.",
    "correct": false
   },
   {
    "text": "Khoá chính và khoá ngoài đều bắt buộc phải là kiểu số.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì phía nhiều giữ khoá ngoài trỏ về phía một. (b) đúng vì khoá ngoài ở bảng con trỏ tới khoá chính của bảng cha. (c) sai vì mỗi thông tin gốc chỉ nên ghi đúng một chỗ để tránh trùng lặp. (d) sai vì bài không yêu cầu khoá phải là kiểu số; khoá có thể là mã dạng văn bản hoặc số tuỳ thiết kế."
 },
 {
  "id": "UD2-mc-017",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Ba thao tác cập nhật dữ liệu cơ bản thực hiện ngay trên một bảng là gì?",
  "options": [
   "Thêm bản ghi, sửa giá trị ô và xoá bản ghi",
   "Sao chép bảng, đổi tên bảng và xoá bảng",
   "Tạo truy vấn, tạo biểu mẫu và tạo báo cáo",
   "Sắp xếp, lọc và tìm kiếm bản ghi"
  ],
  "answer": 0,
  "explain": "Ba thao tác cập nhật cơ bản là thêm, sửa và xoá bản ghi, làm trực quan ngay trên bảng. Phương án B là thao tác với cả bảng chứ không phải cập nhật dữ liệu bên trong; phương án C là tạo các đối tượng khác của CSDL; phương án D chỉ là các cách xem, khai thác dữ liệu, không làm thay đổi nội dung bản ghi."
 },
 {
  "id": "UD2-mc-018",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Khi thêm một bản ghi mới, hệ QTCSDL tự động kiểm tra điều gì trước khi lưu?",
  "options": [
   "Khoá chính không bị trùng và kiểu dữ liệu khớp với trường",
   "Chính tả của các chữ được nhập vào",
   "Các bản ghi đã được sắp xếp đúng thứ tự hay chưa",
   "Màu sắc và phông chữ hiển thị của ô dữ liệu"
  ],
  "answer": 0,
  "explain": "Khi thêm, phần mềm tự kiểm khoá chính không được trùng và kiểu dữ liệu phải khớp với trường rồi mới lưu. Phần mềm không kiểm chính tả nội dung (B), không đòi bản ghi phải theo thứ tự (C), và định dạng hiển thị như màu, phông (D) không liên quan đến việc kiểm tính hợp lệ của dữ liệu."
 },
 {
  "id": "UD2-mc-019",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Phát biểu nào đúng về biểu mẫu (form) khi nhập liệu?",
  "options": [
   "Hiển thị mỗi lần một bản ghi, nhưng dữ liệu vẫn ghi vào cùng bảng",
   "Là nơi lưu trữ dữ liệu độc lập, không liên quan tới bảng",
   "Chỉ dùng để in dữ liệu ra giấy",
   "Hiển thị đồng thời tất cả bản ghi dưới dạng lưới"
  ],
  "answer": 0,
  "explain": "Biểu mẫu hiển thị mỗi lần một bản ghi giúp nhập gọn, ít nhầm, nhưng dữ liệu vẫn được ghi vào cùng bảng chứ biểu mẫu không tự chứa dữ liệu (B sai). In ra giấy là việc của báo cáo (C sai). Hiển thị tất cả bản ghi dạng lưới là cách nhìn của bảng, không phải đặc trưng của biểu mẫu (D sai)."
 },
 {
  "id": "UD2-mc-020",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Vì sao trước khi xoá bản ghi nên lọc đúng dòng cần xoá và sao lưu dữ liệu?",
  "options": [
   "Vì xoá thường không hoàn tác được, dữ liệu đã mất khó lấy lại",
   "Vì xoá một bản ghi sẽ tự động xoá luôn cả bảng",
   "Vì sau khi xoá, khoá chính của các bản ghi còn lại bị đảo lộn",
   "Vì thao tác xoá làm thay đổi kiểu dữ liệu của trường"
  ],
  "answer": 0,
  "explain": "Xoá là mất và thường không hoàn tác được nên cần lọc đúng dòng và sao lưu trước để phòng xoá nhầm. Xoá một bản ghi không xoá cả bảng (B sai), không làm đảo lộn khoá chính của bản ghi khác (C sai), và không đổi kiểu dữ liệu của trường (D sai)."
 },
 {
  "id": "UD2-tf-009",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Thêm, sửa và xoá bản ghi là ba thao tác cập nhật cơ bản.",
    "correct": true
   },
   {
    "text": "Có thể thực hiện các thao tác cập nhật trực quan ngay trên bảng.",
    "correct": true
   },
   {
    "text": "Sửa giá trị một ô sẽ làm mất toàn bộ bản ghi chứa ô đó.",
    "correct": false
   },
   {
    "text": "Muốn cập nhật dữ liệu bắt buộc phải viết lệnh, không thể thao tác trực tiếp.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì ba thao tác cập nhật cơ bản là thêm, sửa, xoá bản ghi. (b) đúng vì các thao tác này làm trực quan ngay trên bảng. (c) sai vì sửa một ô chỉ thay đổi giá trị ô đó, không xoá cả bản ghi. (d) sai vì có thể cập nhật trực quan ngay trên bảng, không bắt buộc viết lệnh."
 },
 {
  "id": "UD2-tf-010",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Biểu mẫu hiển thị mỗi lần một bản ghi, giúp nhập liệu gọn và ít nhầm.",
    "correct": true
   },
   {
    "text": "Dù nhập qua biểu mẫu, dữ liệu vẫn được ghi vào cùng bảng.",
    "correct": true
   },
   {
    "text": "Khi thêm bản ghi, hệ QTCSDL cho phép khoá chính trùng nhau thoải mái.",
    "correct": false
   },
   {
    "text": "Xoá bản ghi là thao tác luôn có thể hoàn tác lại dễ dàng.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì biểu mẫu hiện một bản ghi mỗi lần nên nhập gọn, ít nhầm. (b) đúng vì biểu mẫu chỉ là cách nhập, dữ liệu vẫn vào cùng bảng. (c) sai vì khi thêm, phần mềm tự kiểm để khoá chính không trùng. (d) sai vì xoá thường không hoàn tác được nên cần sao lưu trước."
 },
 {
  "id": "UD2-mc-021",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Ràng buộc toàn vẹn là gì?",
  "options": [
   "Quy tắc khai báo trong bảng để hệ QTCSDL tự kiểm tra khi thêm, sửa, xoá dữ liệu",
   "Một loại truy vấn dùng để sắp xếp dữ liệu",
   "Bản sao lưu của cơ sở dữ liệu để phục hồi khi hỏng",
   "Công cụ vẽ biểu đồ từ dữ liệu trong bảng"
  ],
  "answer": 0,
  "explain": "Ràng buộc toàn vẹn là các quy tắc khai báo trong bảng để hệ QTCSDL tự kiểm tra mỗi khi thêm, sửa, xoá dữ liệu. Nó không phải truy vấn sắp xếp (B), không phải bản sao lưu (C), cũng không phải công cụ vẽ biểu đồ (D)."
 },
 {
  "id": "UD2-mc-022",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Theo ràng buộc toàn vẹn tham chiếu, một khoá ngoài ở bảng con phải thoả điều gì?",
  "options": [
   "Phải trỏ tới một khoá chính có thật ở bảng cha",
   "Phải là duy nhất, không được lặp lại",
   "Phải để trống trong mọi bản ghi",
   "Phải trùng với tên của bảng cha"
  ],
  "answer": 0,
  "explain": "Toàn vẹn tham chiếu đòi hỏi mọi khoá ngoài ở bảng con phải trỏ tới một khoá chính có thật ở bảng cha, không được có bản ghi mồ côi. Khoá ngoài được phép lặp lại nên B sai; không bắt buộc để trống (C sai); khoá ngoài lưu giá trị khoá chính của bản ghi cha chứ không phải tên bảng (D sai)."
 },
 {
  "id": "UD2-mc-023",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "\"Bản ghi mồ côi\" mà ràng buộc toàn vẹn tham chiếu ngăn cấm là bản ghi như thế nào?",
  "options": [
   "Bản ghi con có khoá ngoài trỏ tới một khoá chính không tồn tại ở bảng cha",
   "Bản ghi cha chưa có bản ghi con nào tham chiếu tới",
   "Bản ghi bị bỏ trống toàn bộ các trường",
   "Bản ghi có khoá chính bị trùng với bản ghi khác"
  ],
  "answer": 0,
  "explain": "Bản ghi mồ côi là bản ghi con mà khoá ngoài của nó trỏ tới một khoá chính không có thật ở bảng cha, điều mà toàn vẹn tham chiếu ngăn cấm. Bản ghi cha chưa được tham chiếu vẫn hợp lệ (B sai); bản ghi trống trường hay khoá chính trùng là vấn đề khác, không phải mồ côi (C, D sai)."
 },
 {
  "id": "UD2-mc-024",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Khi xoá hoặc sửa một bản ghi cha đang được bản ghi con tham chiếu, cách xử lí nào KHÔNG phải là một lựa chọn thường dùng?",
  "options": [
   "Xoá toàn bộ cơ sở dữ liệu để tránh lỗi",
   "Hạn chế: không cho xoá/sửa khi còn bản ghi con tham chiếu",
   "Xoá lan truyền sang các bản ghi con liên quan",
   "Đặt khoá ngoài của bản ghi con về rỗng"
  ],
  "answer": 0,
  "explain": "Ba cách xử lí thường dùng là hạn chế (B), xoá lan truyền (C) và đặt khoá ngoài về rỗng (D). Xoá toàn bộ cơ sở dữ liệu (A) không phải cách xử lí ràng buộc mà là hành động phá huỷ dữ liệu vô lí, nên đây là phương án không đúng."
 },
 {
  "id": "UD2-tf-011",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Ràng buộc toàn vẹn giúp hệ QTCSDL tự kiểm tra dữ liệu khi thêm, sửa, xoá.",
    "correct": true
   },
   {
    "text": "Toàn vẹn tham chiếu không cho phép tồn tại bản ghi con mồ côi.",
    "correct": true
   },
   {
    "text": "Ràng buộc toàn vẹn chỉ hoạt động khi người dùng bấm nút kiểm tra thủ công.",
    "correct": false
   },
   {
    "text": "Khi đã khai báo ràng buộc, dữ liệu sai vẫn được lưu bình thường rồi mới sửa sau.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì ràng buộc để hệ QTCSDL tự kiểm mỗi khi thêm, sửa, xoá. (b) đúng vì toàn vẹn tham chiếu cấm bản ghi mồ côi. (c) sai vì ràng buộc tự động kiểm chứ không cần bấm thủ công. (d) sai vì ràng buộc chặn sai sót ngay lúc nhập, không cho lưu dữ liệu sai."
 },
 {
  "id": "UD2-tf-012",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Ràng buộc chặn sai sót ngay lúc nhập, giúp CSDL không tích tụ dữ liệu rác.",
    "correct": true
   },
   {
    "text": "Nhờ ràng buộc toàn vẹn, các báo cáo lấy từ CSDL đáng tin hơn.",
    "correct": true
   },
   {
    "text": "Khoá ngoài có thể trỏ tới một giá trị chưa hề tồn tại ở bảng cha.",
    "correct": false
   },
   {
    "text": "Ràng buộc toàn vẹn làm cho dữ liệu ở bảng cha và bảng con luôn mâu thuẫn nhau.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì ràng buộc ngăn sai sót ngay khi nhập nên không tích tụ dữ liệu rác. (b) đúng vì dữ liệu sạch giúp báo cáo đáng tin. (c) sai vì toàn vẹn tham chiếu buộc khoá ngoài phải trỏ tới khoá chính có thật. (d) sai vì ràng buộc giữ cho hai bảng nhất quán chứ không mâu thuẫn."
 },
 {
  "id": "UD2-mc-025",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Truy vấn dữ liệu là gì?",
  "options": [
   "Yêu cầu lấy đúng dữ liệu cần từ một hoặc nhiều bảng",
   "Thao tác sao chép dữ liệu sang một bảng mới hoàn toàn",
   "Việc xoá bớt các trường thừa trong bảng",
   "Cách đặt khoá chính cho một bảng"
  ],
  "answer": 0,
  "explain": "Truy vấn là yêu cầu lấy đúng dữ liệu cần từ một hoặc nhiều bảng, nhìn vào dữ liệu gốc chứ không sao chép. Vì vậy nó không tạo bản sao dữ liệu mới (B sai), không phải xoá trường (C sai) hay đặt khoá chính (D sai)."
 },
 {
  "id": "UD2-mc-026",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Khi chạy một truy vấn, dữ liệu kết quả được lấy như thế nào?",
  "options": [
   "Truy vấn nhìn vào dữ liệu gốc trong bảng, không tạo bản sao dữ liệu",
   "Truy vấn tạo một bản sao độc lập, sửa bản gốc cũng không ảnh hưởng",
   "Truy vấn di chuyển dữ liệu ra khỏi bảng gốc",
   "Truy vấn xoá dữ liệu gốc sau khi hiển thị kết quả"
  ],
  "answer": 0,
  "explain": "Truy vấn nhìn vào dữ liệu gốc để lấy đúng phần cần, không sao chép và không làm dữ liệu gốc thay đổi hay mất đi. Do đó nó không tạo bản sao độc lập (B sai), không di chuyển (C sai) hay xoá dữ liệu gốc (D sai)."
 },
 {
  "id": "UD2-mc-027",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Muốn ghép đúng dòng dữ liệu giữa hai bảng, truy vấn nối bảng dựa vào đâu?",
  "options": [
   "Cặp khoá chung: khoá ngoài của bảng này khớp khoá chính của bảng kia",
   "Số thứ tự dòng của hai bảng phải bằng nhau",
   "Màu nền của các ô dữ liệu giống nhau",
   "Tên của hai bảng phải viết giống hệt nhau"
  ],
  "answer": 0,
  "explain": "Nối bảng dựa trên cặp khoá chung, tức khoá ngoài của bảng này khớp với khoá chính của bảng kia để ghép đúng dòng. Việc ghép không dựa vào số thứ tự dòng (B), màu nền ô (C) hay tên bảng (D) vì những thứ đó không phản ánh quan hệ dữ liệu."
 },
 {
  "id": "UD2-mc-028",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Điều gì xảy ra nếu quên tạo đường nối giữa các bảng trong một truy vấn nhiều bảng?",
  "options": [
   "Kết quả bị ghép chéo sai lệch giữa các dòng không liên quan",
   "Truy vấn tự động tìm đúng đường nối thay cho người dùng",
   "Cơ sở dữ liệu sẽ bị xoá toàn bộ",
   "Các bảng tự động gộp thành một bảng duy nhất vĩnh viễn"
  ],
  "answer": 0,
  "explain": "Quên đường nối sẽ khiến các dòng không liên quan bị ghép chéo với nhau, cho kết quả sai lệch, nên phải kiểm tra liên kết trước khi chạy. Truy vấn không tự đoán đúng đường nối (B sai), không làm mất CSDL (C sai) và cũng không gộp vĩnh viễn các bảng (D sai)."
 },
 {
  "id": "UD2-tf-013",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Truy vấn có thể lấy dữ liệu từ một hoặc nhiều bảng.",
    "correct": true
   },
   {
    "text": "Trong công cụ thiết kế trực quan, có thể kéo thả để chọn trường, lọc và sắp xếp.",
    "correct": true
   },
   {
    "text": "Muốn tạo truy vấn thì bắt buộc phải gõ lệnh, không có cách trực quan.",
    "correct": false
   },
   {
    "text": "Truy vấn luôn sao chép toàn bộ dữ liệu ra một tệp mới.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì truy vấn lấy dữ liệu từ một hoặc nhiều bảng. (b) đúng vì công cụ thiết kế trực quan cho kéo thả để chọn trường, lọc, sắp xếp. (c) sai vì có công cụ trực quan, không bắt buộc gõ lệnh. (d) sai vì truy vấn nhìn dữ liệu gốc chứ không sao chép ra tệp mới."
 },
 {
  "id": "UD2-tf-014",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Nối bảng dựa trên cặp khoá chung giúp ghép đúng các dòng liên quan.",
    "correct": true
   },
   {
    "text": "Nên kiểm tra đường nối và ô điều kiện trước khi chạy truy vấn.",
    "correct": true
   },
   {
    "text": "Quên tạo đường nối thì truy vấn vẫn cho kết quả ghép chính xác.",
    "correct": false
   },
   {
    "text": "Truy vấn làm thay đổi và ghi đè lên dữ liệu gốc trong bảng.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì cặp khoá chung dùng để ghép đúng dòng. (b) đúng vì quên hoặc sai liên kết, điều kiện sẽ cho kết quả sai. (c) sai vì quên đường nối gây ghép chéo sai lệch. (d) sai vì truy vấn chỉ nhìn dữ liệu gốc, không ghi đè."
 },
 {
  "id": "UD2-mc-029",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Sao lưu dữ liệu là gì?",
  "options": [
   "Tạo bản sao của tệp CSDL để dùng lại khi bản chính gặp sự cố",
   "Xoá bớt dữ liệu cũ để tệp gọn nhẹ hơn",
   "Nén tệp CSDL thành một định dạng khác",
   "Chia sẻ tệp CSDL cho nhiều người cùng dùng"
  ],
  "answer": 0,
  "explain": "Sao lưu là tạo bản sao của tệp CSDL để dùng lại khi bản chính gặp sự cố, và cần làm định kỳ. Nó không phải xoá dữ liệu (B), không phải nén tệp (C) hay chia sẻ tệp (D)."
 },
 {
  "id": "UD2-mc-030",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cách tạo một bản sao lưu tệp CSDL được nêu trong bài là gì?",
  "options": [
   "Đóng tệp rồi chép ra một vị trí khác, đặt tên theo ngày",
   "Mở tệp lên và xoá hết các bản ghi cũ",
   "Đổi kiểu dữ liệu của mọi trường trong bảng",
   "In toàn bộ dữ liệu ra giấy để lưu"
  ],
  "answer": 0,
  "explain": "Bản sao lưu được tạo bằng cách đóng tệp rồi chép ra một vị trí khác, đặt tên theo ngày để biết bản nào mới nhất. Xoá bản ghi (B), đổi kiểu dữ liệu (C) hay in ra giấy (D) đều không phải cách tạo bản sao lưu tệp."
 },
 {
  "id": "UD2-mc-031",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Việc phục hồi dữ liệu từ bản sao lưu có đặc điểm gì?",
  "options": [
   "Chỉ lấy lại được dữ liệu tới thời điểm của bản sao lưu đó",
   "Lấy lại được toàn bộ dữ liệu mới nhất tính đến lúc gặp sự cố",
   "Tự động sửa mọi lỗi bên trong tệp hỏng mà không mất gì",
   "Chỉ dùng được khi tệp gốc vẫn còn nguyên vẹn"
  ],
  "answer": 0,
  "explain": "Phục hồi là dùng bản sao lưu gần nhất còn tốt thay cho tệp hỏng, nên chỉ lấy lại dữ liệu tới thời điểm của bản sao đó; dữ liệu phát sinh sau đó bị mất (B sai). Nó không tự sửa tệp hỏng (C sai) và chính là để dùng khi tệp gốc đã hỏng (D sai)."
 },
 {
  "id": "UD2-mc-032",
  "type": "mc",
  "topic": "C",
  "grade": 11,
  "level": "hard",
  "question": "Nguyên tắc 3-2-1 trong sao lưu dữ liệu có nghĩa là gì?",
  "options": [
   "3 bản dữ liệu, 2 loại phương tiện, 1 bản để ở nơi khác",
   "3 lần sao lưu mỗi ngày, 2 người quản lí, 1 mật khẩu chung",
   "3 bảng, 2 khoá chính, 1 khoá ngoài cho mỗi CSDL",
   "3 phút sao lưu, 2 phút kiểm tra, 1 phút phục hồi"
  ],
  "answer": 0,
  "explain": "Nguyên tắc 3-2-1 nghĩa là giữ 3 bản dữ liệu, trên 2 loại phương tiện khác nhau, và 1 bản để ở nơi khác nhằm giảm rủi ro mất đồng thời. Các phương án còn lại đều là con số bịa đặt, không đúng nội dung nguyên tắc."
 },
 {
  "id": "UD2-tf-015",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Sao lưu cần làm định kỳ vì sự cố dữ liệu thường không thể hoàn tác.",
    "correct": true
   },
   {
    "text": "Đặt tên bản sao lưu theo ngày giúp biết bản nào mới nhất.",
    "correct": true
   },
   {
    "text": "Chỉ cần sao lưu một lần duy nhất là đủ an toàn mãi mãi.",
    "correct": false
   },
   {
    "text": "Bản sao lưu nên để chung đúng một chỗ với tệp gốc cho tiện.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì sự cố không hoàn tác được nên phải sao lưu định kỳ. (b) đúng vì đặt tên theo ngày giúp nhận biết bản mới. (c) sai vì phải sao lưu định kỳ, một lần là không đủ. (d) sai vì theo nguyên tắc 3-2-1 nên có một bản để ở nơi khác, không dồn tất cả một chỗ."
 },
 {
  "id": "UD2-tf-016",
  "type": "tf",
  "topic": "C",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Phục hồi là dùng bản sao lưu gần nhất còn tốt để thay cho tệp hỏng.",
    "correct": true
   },
   {
    "text": "Theo nguyên tắc 3-2-1, nên lưu dữ liệu trên 2 loại phương tiện khác nhau.",
    "correct": true
   },
   {
    "text": "Sau khi phục hồi, ta luôn lấy lại được cả dữ liệu phát sinh sau thời điểm sao lưu.",
    "correct": false
   },
   {
    "text": "Nên để cả ba bản sao lưu trên cùng một ổ đĩa để dễ quản lí.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì phục hồi dùng bản sao lưu gần nhất còn tốt. (b) đúng vì nguyên tắc 3-2-1 yêu cầu 2 loại phương tiện. (c) sai vì chỉ lấy lại dữ liệu tới thời điểm sao lưu, phần phát sinh sau đó bị mất. (d) sai vì nguyên tắc 3-2-1 khuyên để 1 bản ở nơi khác, không dồn tất cả vào một ổ."
 },
 {
  "id": "UD2-mc-033",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Ảnh số được tạo thành từ gì và yếu tố nào quyết định độ nét?",
  "options": [
   "Các đường nét vector; số đường nét quyết định độ nét",
   "Lưới các điểm ảnh (pixel); số điểm ảnh quyết định độ phân giải và độ nét",
   "Các lớp trong suốt xếp chồng; số lớp quyết định độ nét",
   "Các vùng chọn; số vùng chọn quyết định độ nét"
  ],
  "answer": 1,
  "explain": "Đáp án B đúng: ảnh số là lưới điểm ảnh (pixel), số điểm ảnh quyết định độ phân giải và độ nét. A sai vì đó là ảnh vector, không phải ảnh số dạng điểm ảnh. C sai vì lớp là tầng nội dung, không quyết định độ nét. D sai vì vùng chọn chỉ giới hạn thao tác, không liên quan độ nét."
 },
 {
  "id": "UD2-mc-034",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Lớp (layer) trong phần mềm chỉnh sửa ảnh là gì?",
  "options": [
   "Một vùng chọn giới hạn thao tác vào một phần ảnh",
   "Một điểm ảnh riêng lẻ trên lưới pixel",
   "Một tầng nội dung trong suốt xếp chồng lên nhau, mỗi nội dung đặt trên một lớp riêng",
   "Một bản sao lưu tự động của ảnh gốc"
  ],
  "answer": 2,
  "explain": "Đáp án C đúng: lớp là tầng nội dung trong suốt xếp chồng, mỗi nội dung một lớp giúp sửa riêng từng phần. A sai vì đó là mô tả vùng chọn. B sai vì điểm ảnh (pixel) là đơn vị nhỏ nhất của ảnh, không phải lớp. D sai vì lớp không phải bản sao lưu."
 },
 {
  "id": "UD2-mc-035",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Vì sao làm việc trên lớp được gọi là chỉnh sửa không phá huỷ?",
  "options": [
   "Ảnh gốc luôn được giữ nguyên; có thể ẩn/hiện, sắp xếp hoặc xoá từng lớp mà không làm hỏng phần khác",
   "Vì mỗi thao tác đều ghi đè trực tiếp lên ảnh gốc để tiết kiệm bộ nhớ",
   "Vì phần mềm tự động nén ảnh để giảm dung lượng tệp",
   "Vì mọi lớp bị gộp phẳng ngay khi vừa tạo nên không thể tách ra"
  ],
  "answer": 0,
  "explain": "Đáp án A đúng: làm trên lớp giữ nguyên ảnh gốc, có thể ẩn/hiện, sắp xếp, xoá lớp nên không phá huỷ. B sai vì ghi đè lên ảnh gốc chính là phá huỷ. C sai vì nén ảnh không liên quan tính không phá huỷ. D sai vì các lớp tách riêng, không bị gộp phẳng ngay khi tạo."
 },
 {
  "id": "UD2-mc-036",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Vùng chọn (selection) có tác dụng gì và cần lưu ý điều gì sau khi dùng?",
  "options": [
   "Áp mọi chỉnh sửa lên toàn bộ ảnh; không cần bỏ chọn",
   "Tạo thêm một lớp mới trong suốt cho ảnh",
   "Tăng số điểm ảnh để ảnh trở nên nét hơn",
   "Giới hạn thao tác vào một phần ảnh; nên nhớ bỏ chọn sau khi làm xong"
  ],
  "answer": 3,
  "explain": "Đáp án D đúng: vùng chọn giới hạn thao tác vào một phần ảnh và cần bỏ chọn sau khi làm xong. A sai vì vùng chọn chỉ tác động vào phần được khoanh, không phải toàn bộ ảnh. B sai vì vùng chọn không tạo lớp mới. C sai vì vùng chọn không làm thay đổi số điểm ảnh."
 },
 {
  "id": "UD2-tf-017",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Ảnh số là lưới các điểm ảnh (pixel), số điểm ảnh càng nhiều thì độ phân giải càng cao.",
    "correct": true
   },
   {
    "text": "Khi chỉnh sửa trên các lớp, ảnh gốc bị thay đổi vĩnh viễn và không thể khôi phục.",
    "correct": false
   },
   {
    "text": "Mỗi nội dung đặt trên một lớp riêng giúp sửa riêng từng phần mà không ảnh hưởng phần khác.",
    "correct": true
   },
   {
    "text": "Vùng chọn khiến thao tác tác động lên toàn bộ ảnh chứ không chỉ phần được khoanh.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: số điểm ảnh quyết định độ phân giải và độ nét. (b) sai: làm trên lớp là chỉnh sửa không phá huỷ, ảnh gốc được giữ nguyên. (c) đúng: mỗi nội dung một lớp giúp sửa riêng từng phần. (d) sai: vùng chọn chỉ giới hạn thao tác vào phần ảnh được khoanh chọn."
 },
 {
  "id": "UD2-tf-018",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Lớp (layer) là tầng nội dung trong suốt xếp chồng lên nhau.",
    "correct": true
   },
   {
    "text": "Số điểm ảnh của một bức ảnh số không liên quan gì đến độ phân giải.",
    "correct": false
   },
   {
    "text": "Vùng chọn giúp giới hạn thao tác chỉ vào phần ảnh đã được khoanh chọn.",
    "correct": true
   },
   {
    "text": "Vì lớp là tầng trong suốt nên không thể ẩn, hiện hay xoá bất kỳ lớp nào.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: lớp là các tầng trong suốt xếp chồng. (b) sai: số điểm ảnh quyết định độ phân giải và độ nét. (c) đúng: vùng chọn giới hạn thao tác vào phần được khoanh. (d) sai: có thể ẩn/hiện, sắp xếp và xoá từng lớp."
 },
 {
  "id": "UD2-mc-037",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Điều chỉnh nào làm cho toàn bộ ảnh sáng lên hoặc tối đi một cách đồng loạt?",
  "options": [
   "Độ sáng",
   "Độ tương phản",
   "Độ bão hoà",
   "Cân bằng màu"
  ],
  "answer": 0,
  "explain": "Đáp án A đúng: độ sáng làm cả ảnh sáng/tối đồng loạt. B sai vì độ tương phản nới rộng chênh lệch sáng - tối chứ không làm sáng đều. C sai vì độ bão hoà quyết định màu rực hay nhạt. D sai vì cân bằng màu dùng để khử ám màu, đưa tông về tự nhiên."
 },
 {
  "id": "UD2-mc-038",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Độ bão hoà (saturation) của ảnh quyết định điều gì?",
  "options": [
   "Ảnh sáng lên hay tối đi một cách đồng loạt",
   "Mức chênh lệch giữa vùng sáng và vùng tối",
   "Màu sắc rực rỡ hay nhạt nhoà",
   "Ảnh bị ám vàng hay ám xanh"
  ],
  "answer": 2,
  "explain": "Đáp án C đúng: độ bão hoà quyết định màu rực hay nhạt. A sai vì đó là độ sáng. B sai vì đó là độ tương phản. D sai vì hiện tượng ám màu được xử lí bằng cân bằng màu."
 },
 {
  "id": "UD2-mc-039",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Trên histogram, dữ liệu dồn hết về phía bên phải cho biết ảnh đang bị gì?",
  "options": [
   "Thiếu sáng",
   "Thừa sáng",
   "Thiếu tương phản",
   "Ám màu xanh"
  ],
  "answer": 1,
  "explain": "Đáp án B đúng: trên histogram dồn phải nghĩa là thừa sáng. A sai vì thiếu sáng là khi dồn về bên trái. C sai vì thiếu tương phản là khi cụm dữ liệu hẹp ở giữa. D sai vì histogram thể hiện phân bố sáng - tối, không cho biết ám màu."
 },
 {
  "id": "UD2-mc-040",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Để khử hiện tượng ảnh bị ám vàng hoặc ám xanh, đưa tông màu về tự nhiên, nên làm gì?",
  "options": [
   "Tăng độ sáng cho cả ảnh sáng lên đồng loạt",
   "Tăng độ tương phản để nới rộng chênh lệch sáng - tối",
   "Giảm độ bão hoà cho màu nhạt bớt đi",
   "Dùng cân bằng màu, chỉnh dựa theo một vật vốn có màu trắng hoặc xám trung tính"
  ],
  "answer": 3,
  "explain": "Đáp án D đúng: cân bằng màu khử ám vàng/ám xanh, mẹo là chỉnh theo một vật vốn trắng hoặc xám trung tính. A sai vì tăng độ sáng chỉ làm ảnh sáng hơn, không khử ám màu. B sai vì độ tương phản không xử lí ám màu. C sai vì giảm bão hoà chỉ làm nhạt màu, không đưa tông về tự nhiên."
 },
 {
  "id": "UD2-tf-019",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Độ tương phản nới rộng mức chênh lệch giữa vùng sáng và vùng tối của ảnh.",
    "correct": true
   },
   {
    "text": "Độ sáng chỉ làm thay đổi các vùng tối, không tác động đến vùng sáng.",
    "correct": false
   },
   {
    "text": "Nên chỉnh vừa đủ để tránh cháy sáng và tránh ảnh bị bệt.",
    "correct": true
   },
   {
    "text": "Độ bão hoà càng cao thì màu sắc của ảnh càng nhạt nhoà đi.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: độ tương phản nới rộng chênh lệch sáng - tối. (b) sai: độ sáng làm cả ảnh sáng/tối đồng loạt. (c) đúng: nên chỉnh vừa đủ, tránh cháy sáng và ảnh bệt. (d) sai: bão hoà càng cao màu càng rực, bão hoà thấp mới nhạt."
 },
 {
  "id": "UD2-tf-020",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Histogram là đồ thị thể hiện sự phân bố sáng - tối của ảnh.",
    "correct": true
   },
   {
    "text": "Trên histogram, dữ liệu dồn hết về bên trái cho thấy ảnh đang bị thừa sáng.",
    "correct": false
   },
   {
    "text": "Nên chỉnh trên bản sao và giữ lại ảnh gốc để có thể quay lại khi cần.",
    "correct": true
   },
   {
    "text": "Cụm dữ liệu hẹp ở giữa histogram cho thấy ảnh có độ tương phản rất cao.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: histogram là đồ thị phân bố sáng - tối. (b) sai: dồn trái là thiếu sáng, dồn phải mới là thừa sáng. (c) đúng: nên làm trên bản sao và giữ lại ảnh gốc. (d) sai: cụm hẹp ở giữa là thiếu tương phản, không phải tương phản cao."
 },
 {
  "id": "UD2-mc-041",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Vùng chọn đóng vai trò gì, được xem là chìa khoá để tách chủ thể khỏi nền?",
  "options": [
   "Tự động tô màu mới cho toàn bộ nền ảnh",
   "Làm tăng độ phân giải của chủ thể",
   "Khoanh phần ảnh cần xử lí để thao tác chỉ tác động đúng phần đó",
   "Gộp phẳng mọi lớp thành một lớp duy nhất"
  ],
  "answer": 2,
  "explain": "Đáp án C đúng: vùng chọn khoanh phần ảnh cần xử lí để thao tác chỉ tác động đúng phần đó, là chìa khoá tách chủ thể khỏi nền. A sai vì vùng chọn không tự tô màu. B sai vì vùng chọn không làm tăng độ phân giải. D sai vì gộp phẳng lớp là thao tác khác."
 },
 {
  "id": "UD2-mc-042",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Công cụ chọn theo màu (kèm điều chỉnh dung sai) phù hợp nhất khi nào?",
  "options": [
   "Khi nền chỉ có một màu đồng nhất",
   "Khi chủ thể có viền rất phức tạp, nhiều ngóc ngách",
   "Khi cần chọn một vùng hình chữ nhật vuông vắn",
   "Khi muốn làm mềm mép của vùng chọn"
  ],
  "answer": 0,
  "explain": "Đáp án A đúng: chọn theo màu hợp khi nền một màu đồng nhất, dùng dung sai để chỉnh phạm vi màu. B sai vì viền phức tạp nên dùng chọn tự do. C sai vì hình chữ nhật vuông vắn nên dùng chọn hình học. D sai vì làm mềm mép là xử lí mép chọn, không phải cách chọn theo màu."
 },
 {
  "id": "UD2-mc-043",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Để chọn một chủ thể có đường viền phức tạp, uốn lượn nhiều chi tiết, nên dùng công cụ nào?",
  "options": [
   "Công cụ chọn hình chữ nhật",
   "Công cụ chọn hình ellip",
   "Công cụ chọn theo một màu đồng nhất",
   "Công cụ chọn tự do bám theo viền"
  ],
  "answer": 3,
  "explain": "Đáp án D đúng: chọn tự do bám được viền phức tạp. A và B sai vì chọn hình học chỉ hợp với hình vuông vắn, đơn giản. C sai vì chọn theo màu chỉ hợp khi nền một màu đồng nhất, không bám được viền phức tạp."
 },
 {
  "id": "UD2-mc-044",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Khi tách nền, cách làm nào sau đây được khuyến nghị?",
  "options": [
   "Xoá trực tiếp toàn bộ phần nền ngay trên ảnh gốc cho nhanh",
   "Khoanh vùng chọn rồi tách chủ thể ra, làm mềm mép vừa phải để ghép tự nhiên",
   "Làm mép thật sắc và cứng để chủ thể nổi bật tối đa",
   "Chỉ dùng đúng một công cụ chọn duy nhất, tuyệt đối không phối hợp"
  ],
  "answer": 1,
  "explain": "Đáp án B đúng: nên khoanh chọn rồi tách chứ không xoá trực tiếp, làm mềm mép vừa phải giúp ghép tự nhiên. A sai vì không nên xoá trực tiếp phần nền. C sai vì mép quá sắc cứng khiến ảnh ghép lộ, kém tự nhiên. D sai vì có thể phối hợp nhiều công cụ, cộng/bớt vùng chọn cho khớp."
 },
 {
  "id": "UD2-tf-021",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Công cụ chọn hình học (chữ nhật, ellip) phù hợp với chủ thể có hình vuông vắn, gọn gàng.",
    "correct": true
   },
   {
    "text": "Chọn theo màu chỉ dùng được khi nền có nhiều màu loang lổ khác nhau.",
    "correct": false
   },
   {
    "text": "Có thể cộng thêm hoặc bớt đi khỏi một vùng chọn đã có để chọn cho khớp.",
    "correct": true
   },
   {
    "text": "Chỉ được dùng duy nhất một công cụ chọn, không thể phối hợp nhiều công cụ.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: chọn hình học hợp với hình vuông vắn. (b) sai: chọn theo màu hợp khi nền một màu đồng nhất, không phải nền loang lổ. (c) đúng: có thể cộng thêm hoặc bớt khỏi vùng chọn. (d) sai: có thể phối hợp nhiều công cụ để chọn cho khớp."
 },
 {
  "id": "UD2-tf-022",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Vùng chọn là chìa khoá để tách chủ thể ra khỏi nền.",
    "correct": true
   },
   {
    "text": "Nên làm mềm mép vùng chọn ở mức vừa phải để ảnh ghép trông tự nhiên.",
    "correct": true
   },
   {
    "text": "Cách tốt nhất là xoá trực tiếp phần nền trên ảnh gốc chứ không cần khoanh chọn.",
    "correct": false
   },
   {
    "text": "Khi chọn theo màu, tăng dung sai sẽ thu hẹp phạm vi màu được chọn lại.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: vùng chọn là chìa khoá tách chủ thể khỏi nền. (b) đúng: làm mềm mép vừa phải giúp ghép tự nhiên. (c) sai: nên khoanh chọn rồi tách, không xoá trực tiếp phần nền. (d) sai: tăng dung sai sẽ mở rộng, không phải thu hẹp phạm vi màu được chọn."
 },
 {
  "id": "UD2-mc-045",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Công cụ hút màu (lấy màu có sẵn) trên ảnh dùng để làm gì?",
  "options": [
   "Xoá đi phần nét vẽ bị thừa trên ảnh",
   "Lấy lại đúng một màu đã có sẵn trên ảnh để dùng làm màu vẽ",
   "Tạo một lớp chữ mới trên ảnh",
   "Gộp phẳng các lớp để xuất ảnh"
  ],
  "answer": 1,
  "explain": "Đáp án B đúng: hút màu dùng để lấy lại màu có sẵn trên ảnh. A sai vì xoá nét là việc của gôm tẩy. C sai vì tạo lớp chữ là việc của công cụ văn bản. D sai vì gộp phẳng thuộc thao tác xuất ảnh."
 },
 {
  "id": "UD2-mc-046",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Vì sao nên vẽ trên một lớp mới thay vì vẽ thẳng lên ảnh?",
  "options": [
   "Để tự động tăng độ phân giải cho ảnh",
   "Để bắt buộc gộp phẳng ngay mọi lớp lại với nhau",
   "Để không cần phải chọn màu vẽ trước",
   "Để dễ sửa, chỉnh hoặc xoá nét vẽ mà không làm hỏng ảnh bên dưới"
  ],
  "answer": 3,
  "explain": "Đáp án D đúng: vẽ trên lớp mới giúp dễ sửa, không làm hỏng ảnh gốc bên dưới. A sai vì lớp mới không làm tăng độ phân giải. B sai vì vẽ trên lớp mới là để tách riêng, không phải để gộp phẳng. C sai vì vẫn cần chọn màu vẽ trước khi vẽ."
 },
 {
  "id": "UD2-mc-047",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Công cụ văn bản trong phần mềm chỉnh sửa ảnh có đặc điểm gì?",
  "options": [
   "Tạo một lớp chữ riêng, cho phép chỉnh phông, cỡ, màu và thêm viền để chữ đọc rõ",
   "Chỉ chèn được chữ màu đen, không đổi được phông hay cỡ",
   "Ghi chữ trực tiếp vào lớp ảnh nền, không tách thành lớp riêng",
   "Chỉ dùng để hút màu có sẵn trên ảnh"
  ],
  "answer": 0,
  "explain": "Đáp án A đúng: công cụ văn bản tạo lớp chữ riêng, chỉnh được phông, cỡ, màu và thêm viền để chữ tương phản, đọc rõ. B sai vì có thể đổi phông, cỡ, màu. C sai vì chữ nằm trên lớp riêng, không ghi thẳng vào nền. D sai vì hút màu là công cụ khác."
 },
 {
  "id": "UD2-mc-048",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Về việc lưu và xuất ảnh sau khi chỉnh sửa, phát biểu nào đúng?",
  "options": [
   "Chỉ cần lưu bản PNG/JPG đã gộp phẳng là đủ để sửa lại từng lớp về sau",
   "Bản gốc còn giữ các lớp mới là bản dùng để chia sẻ, in và đăng lên mạng",
   "Nên lưu bản gốc còn giữ các lớp để sửa về sau, và xuất PNG/JPG (đã gộp phẳng) để chia sẻ, in hoặc đăng",
   "Xuất PNG/JPG vẫn giữ nguyên toàn bộ các lớp để chỉnh sửa tiếp"
  ],
  "answer": 2,
  "explain": "Đáp án C đúng: lưu bản gốc có lớp để sửa về sau, xuất PNG/JPG đã gộp phẳng để chia sẻ, in hoặc đăng. A sai vì bản đã gộp phẳng không còn tách được từng lớp để sửa. B sai vì bản để chia sẻ/đăng là bản xuất PNG/JPG, không phải bản gốc có lớp. D sai vì xuất PNG/JPG là gộp phẳng, không giữ các lớp."
 },
 {
  "id": "UD2-tf-023",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Nên chọn màu vẽ trước khi bắt đầu vẽ lên ảnh.",
    "correct": true
   },
   {
    "text": "Có thể dùng mã màu để lấy đúng một màu mong muốn.",
    "correct": true
   },
   {
    "text": "Gôm tẩy là công cụ dùng để tạo ra một lớp chữ mới trên ảnh.",
    "correct": false
   },
   {
    "text": "Cỡ nét và độ mờ của bút vẽ là cố định, không thể điều chỉnh.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: nên chọn màu vẽ trước khi vẽ. (b) đúng: dùng mã màu để lấy đúng màu. (c) sai: tạo lớp chữ là việc của công cụ văn bản, còn gôm tẩy dùng để xoá. (d) sai: có thể chỉnh cỡ nét và độ mờ của bút vẽ."
 },
 {
  "id": "UD2-tf-024",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Công cụ văn bản tạo ra một lớp chữ riêng biệt.",
    "correct": true
   },
   {
    "text": "Thêm viền cho chữ giúp chữ tương phản với nền và dễ đọc hơn.",
    "correct": true
   },
   {
    "text": "Bản PNG/JPG sau khi gộp phẳng vẫn cho phép chỉnh sửa lại từng lớp như cũ.",
    "correct": false
   },
   {
    "text": "Chỉ nên giữ bản đã gộp phẳng và xoá bản gốc có lớp để tiết kiệm dung lượng.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: công cụ văn bản tạo lớp chữ riêng. (b) đúng: thêm viền giúp chữ tương phản, đọc rõ. (c) sai: bản đã gộp phẳng không tách lại được từng lớp. (d) sai: nên giữ bản gốc có lớp để còn sửa về sau."
 },
 {
  "id": "UD2-mc-049",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Ảnh động (animation) được tạo ra như thế nào?",
  "options": [
   "Là một chuỗi khung hình (frame) được chiếu nối tiếp thật nhanh khiến mắt thấy chuyển động",
   "Là một bức ảnh tĩnh duy nhất có độ phân giải rất cao",
   "Là âm thanh được ghép cố định với một bức ảnh nền",
   "Là dòng văn bản chạy ngang qua màn hình"
  ],
  "answer": 0,
  "explain": "Ảnh động là chuỗi các khung hình chiếu nối tiếp thật nhanh, lợi dụng việc mắt thấy chuyển động (A đúng). B sai vì một ảnh tĩnh không thể chuyển động; C sai vì bản chất ảnh động là chuỗi hình, không nhất thiết gắn âm thanh; D sai vì chữ chạy ngang không phải nguyên lí tạo ảnh động."
 },
 {
  "id": "UD2-mc-050",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Trong ảnh động ghép từ nhiều lớp, yếu tố nào quyết định chiều (thứ tự) chuyển động?",
  "options": [
   "Kích thước tệp ảnh",
   "Thứ tự sắp xếp các khung hình",
   "Màu nền của khung hình đầu tiên",
   "Tên đặt cho tệp ảnh động"
  ],
  "answer": 1,
  "explain": "Mỗi khung thường đặt trên một lớp riêng và thứ tự các khung quyết định chiều chuyển động (B đúng). A sai vì kích thước tệp liên quan dung lượng, không định hướng chuyển động; C và D sai vì màu nền và tên tệp không ảnh hưởng đến trình tự chiếu các khung."
 },
 {
  "id": "UD2-mc-051",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Việc điều chỉnh thời gian hiển thị của từng khung hình có tác dụng gì?",
  "options": [
   "Làm thay đổi màu sắc của khung hình",
   "Tăng độ phân giải của ảnh",
   "Điều chỉnh nhịp nhanh hay chậm của cử động",
   "Xoá bớt các lớp không cần thiết"
  ],
  "answer": 2,
  "explain": "Thời gian hiển thị mỗi khung có thể khác nhau, dùng để điều chỉnh nhịp nhanh chậm của cử động (C đúng). A sai vì thời gian hiển thị không làm đổi màu; B sai vì độ phân giải phụ thuộc số điểm ảnh chứ không phải thời gian; D sai vì đây là chỉnh thời gian, không phải thao tác xoá lớp."
 },
 {
  "id": "UD2-mc-052",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Nhận định nào đúng về số khung hình mỗi giây (fps) của ảnh động?",
  "options": [
   "fps càng lớn thì ảnh càng giật và tệp càng nhẹ",
   "fps không ảnh hưởng gì đến độ mượt của chuyển động",
   "fps chỉ quyết định màu sắc, không liên quan dung lượng",
   "fps càng lớn thì ảnh càng mượt nhưng tệp càng nặng"
  ],
  "answer": 3,
  "explain": "fps càng lớn thì chuyển động càng mượt nhưng dung lượng tệp càng nặng, nên chọn vừa đủ tự nhiên (D đúng). A sai vì fps lớn làm mượt hơn chứ không giật; B sai vì fps trực tiếp ảnh hưởng độ mượt; C sai vì fps liên quan cả độ mượt lẫn dung lượng, không phải màu sắc."
 },
 {
  "id": "UD2-tf-025",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Ảnh động là một chuỗi khung hình được chiếu nối tiếp thật nhanh.",
    "correct": true
   },
   {
    "text": "Trong ảnh động, thứ tự các khung hình quyết định chiều chuyển động.",
    "correct": true
   },
   {
    "text": "Mọi khung hình trong một ảnh động bắt buộc phải có cùng thời gian hiển thị.",
    "correct": false
   },
   {
    "text": "Một bức ảnh tĩnh duy nhất cũng được coi là ảnh động.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì bản chất ảnh động là chuỗi khung chiếu nối tiếp thật nhanh; (b) đúng vì thứ tự khung quyết định chiều chuyển động; (c) sai vì thời gian hiển thị của từng khung có thể khác nhau để chỉnh nhịp; (d) sai vì ảnh động cần nhiều khung, một ảnh tĩnh không tạo được chuyển động."
 },
 {
  "id": "UD2-tf-026",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Tăng fps giúp chuyển động mượt hơn nhưng làm tệp nặng hơn.",
    "correct": true
   },
   {
    "text": "Mỗi khung hình thường được đặt trên một lớp riêng.",
    "correct": true
   },
   {
    "text": "fps càng cao thì tệp ảnh động càng nhẹ.",
    "correct": false
   },
   {
    "text": "Luôn phải chọn fps cao tối đa trong mọi trường hợp để ảnh đẹp nhất.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì fps cao làm mượt hơn nhưng tăng dung lượng; (b) đúng vì mỗi khung thường đặt trên một lớp riêng để dễ quản lí; (c) sai vì fps cao khiến tệp nặng hơn chứ không nhẹ đi; (d) sai vì cần chọn fps vừa đủ tự nhiên, fps quá cao chỉ làm tệp nặng không cần thiết."
 },
 {
  "id": "UD2-mc-053",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Phần mềm làm phim dùng để làm gì?",
  "options": [
   "Ghép video, ảnh, âm thanh thành một đoạn phim hoàn chỉnh trên dòng thời gian",
   "Chỉ để chụp ảnh tĩnh có độ phân giải cao",
   "Chỉ để soạn thảo văn bản và bảng tính",
   "Chỉ để phát nhạc mà không xử lí hình ảnh"
  ],
  "answer": 0,
  "explain": "Phần mềm làm phim ghép video, ảnh, âm thanh thành một đoạn phim hoàn chỉnh trên dòng thời gian (A đúng). B, C, D sai vì đó là việc của phần mềm chụp ảnh, soạn thảo hay nghe nhạc; phần mềm làm phim tổng hợp nhiều loại tư liệu thành phim."
 },
 {
  "id": "UD2-mc-054",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Trên dòng thời gian (timeline), 'clip' là gì?",
  "options": [
   "Là tên của phần mềm làm phim",
   "Là mỗi tư liệu (video/ảnh/âm thanh) đặt lên dòng thời gian, có chiều dài là thời lượng",
   "Là nút bấm để xuất phim",
   "Là cửa sổ xem trước kết quả"
  ],
  "answer": 1,
  "explain": "Mỗi tư liệu đặt lên dòng thời gian là một clip, chiều dài clip chính là thời lượng của nó (B đúng). A sai vì clip không phải tên phần mềm; C sai vì clip không phải nút xuất phim; D sai vì cửa sổ xem trước là preview, khác với clip."
 },
 {
  "id": "UD2-mc-055",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Trong phần mềm làm phim, khung hình mỗi giây (fps) và độ phân giải quyết định điều gì?",
  "options": [
   "fps quyết định độ nét, độ phân giải quyết định độ mượt",
   "Cả hai chỉ quyết định màu sắc của phim",
   "fps quyết định độ mượt, độ phân giải quyết định độ nét",
   "Cả hai chỉ quyết định tên tệp xuất ra"
  ],
  "answer": 2,
  "explain": "fps quyết định độ mượt của chuyển động, còn độ phân giải quyết định độ nét của hình ảnh (C đúng). A sai vì đảo ngược vai trò hai đại lượng; B và D sai vì fps và độ phân giải không quyết định màu sắc hay tên tệp."
 },
 {
  "id": "UD2-mc-056",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Thao tác nào là bắt buộc trước khi dựng phim, và điều gì cần lưu ý về tệp gốc?",
  "options": [
   "Phải xuất phim trước, rồi mới nhập tư liệu",
   "Nên xoá hết tệp gốc ngay sau khi kéo vào timeline cho nhẹ máy",
   "Không cần xem trước (preview), cứ xuất phim luôn cho nhanh",
   "Phải nhập (import) tư liệu trước khi dựng, và không được xoá tệp gốc giữa chừng"
  ],
  "answer": 3,
  "explain": "Phải nhập tư liệu trước khi dựng và không được xoá tệp gốc giữa chừng vì phần mềm vẫn cần đến chúng (D đúng). A sai vì xuất phim là bước cuối, không làm trước khi nhập; B sai vì xoá tệp gốc sẽ làm hỏng dự án; C sai vì nên dùng cửa sổ xem trước để kiểm tra trước khi xuất."
 },
 {
  "id": "UD2-tf-027",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Mỗi tư liệu (video, ảnh, âm thanh) đặt lên dòng thời gian được gọi là một clip.",
    "correct": true
   },
   {
    "text": "Chiều dài của một clip trên dòng thời gian thể hiện thời lượng của nó.",
    "correct": true
   },
   {
    "text": "Các clip chỉ có thể nằm trên đúng một rãnh (track) duy nhất.",
    "correct": false
   },
   {
    "text": "Phần mềm làm phim chỉ ghép được ảnh, không ghép được âm thanh.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì mỗi tư liệu trên dòng thời gian là một clip; (b) đúng vì chiều dài clip chính là thời lượng; (c) sai vì các clip có thể nằm trên nhiều rãnh khác nhau; (d) sai vì phần mềm làm phim ghép được cả video, ảnh lẫn âm thanh."
 },
 {
  "id": "UD2-tf-028",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "fps càng cao thì phim càng mượt và độ phân giải càng cao thì phim càng nét.",
    "correct": true
   },
   {
    "text": "Cửa sổ xem trước (preview) dùng để kiểm tra phim trong khi đang dựng.",
    "correct": true
   },
   {
    "text": "Có thể xoá tệp gốc ngay giữa chừng mà không ảnh hưởng đến dự án phim.",
    "correct": false
   },
   {
    "text": "Tăng fps và độ phân giải sẽ làm tệp phim nhẹ đi.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì fps quyết định độ mượt, độ phân giải quyết định độ nét; (b) đúng vì cửa sổ xem trước giúp kiểm tra trong khi dựng; (c) sai vì xoá tệp gốc giữa chừng sẽ làm hỏng dự án, không được xoá; (d) sai vì fps và độ phân giải càng cao thì tệp càng nặng chứ không nhẹ đi."
 },
 {
  "id": "UD2-mc-057",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Trên dòng thời gian, thứ tự các clip (từ trái sang phải) thể hiện điều gì?",
  "options": [
   "Mạch kể chuyện (trình tự diễn ra) của phim",
   "Dung lượng của tệp xuất ra",
   "Màu sắc chủ đạo của phim",
   "Tên của người dựng phim"
  ],
  "answer": 0,
  "explain": "Dòng thời gian xếp các clip từ trái sang phải, thứ tự các khối chính là mạch kể chuyện của phim (A đúng). B sai vì dung lượng phụ thuộc chất lượng và độ dài, không phải thứ tự; C và D sai vì thứ tự clip không quyết định màu sắc hay tên người dựng."
 },
 {
  "id": "UD2-mc-058",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Thao tác cắt (trim) bỏ phần thừa của clip ảnh hưởng thế nào đến tệp quay gốc?",
  "options": [
   "Làm hỏng và xoá vĩnh viễn tệp quay gốc",
   "Chỉ tác động trên clip trong dự án, tệp quay gốc vẫn nguyên vẹn",
   "Làm giảm độ phân giải của tệp quay gốc",
   "Tự động xuất phim ra ngay lập tức"
  ],
  "answer": 1,
  "explain": "Cắt (trim) chỉ tác động trên clip trong dự án dựng phim, còn tệp quay gốc vẫn nguyên vẹn (B đúng). A và C sai vì trim không đụng đến tệp gốc nên không xoá hay giảm chất lượng tệp gốc; D sai vì trim là thao tác biên tập, không phải lệnh xuất phim."
 },
 {
  "id": "UD2-mc-059",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Chuyển cảnh (transition) trong dựng phim có vai trò gì?",
  "options": [
   "Xoá toàn bộ âm thanh của phim",
   "Tăng độ phân giải cho từng clip",
   "Làm mượt mối nối giữa các clip",
   "Đổi tên tệp phim khi xuất"
  ],
  "answer": 2,
  "explain": "Chuyển cảnh làm mượt mối nối giữa các clip, nên dùng có chừng mực (C đúng). A sai vì transition xử lí mối nối hình ảnh, không xoá âm thanh; B sai vì transition không thay đổi độ phân giải; D sai vì transition không liên quan đến việc đặt tên tệp."
 },
 {
  "id": "UD2-mc-060",
  "type": "mc",
  "topic": "E",
  "grade": 11,
  "level": "hard",
  "question": "Việc xuất phim (export/render) thực hiện điều gì?",
  "options": [
   "Tách phim thành nhiều tệp rời cho từng rãnh",
   "Xoá dòng thời gian và mọi clip đang dựng",
   "Chỉ lưu lại phần âm thanh, bỏ hình ảnh",
   "Gộp mọi rãnh (hình ảnh, âm thanh...) thành một tệp video duy nhất"
  ],
  "answer": 3,
  "explain": "Xuất phim gộp mọi rãnh thành một tệp video duy nhất, chất lượng càng cao thì tệp càng nặng (D đúng). A sai vì export gộp lại chứ không tách rời; B sai vì xuất phim không xoá dự án đang dựng; C sai vì tệp xuất ra gồm cả hình ảnh và âm thanh."
 },
 {
  "id": "UD2-tf-029",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Trên dòng thời gian, thứ tự các clip thể hiện mạch kể chuyện của phim.",
    "correct": true
   },
   {
    "text": "Cắt (trim) bỏ phần thừa chỉ tác động trên clip, không làm hỏng tệp quay gốc.",
    "correct": true
   },
   {
    "text": "Xuất phim (export) sẽ tách phim thành nhiều tệp rời rạc.",
    "correct": false
   },
   {
    "text": "Chuyển cảnh (transition) nên được lạm dụng, dùng càng nhiều càng tốt.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì thứ tự các khối clip chính là mạch kể chuyện; (b) đúng vì trim chỉ tác động trên clip, tệp quay gốc vẫn nguyên vẹn; (c) sai vì export gộp mọi rãnh thành một tệp duy nhất chứ không tách rời; (d) sai vì chuyển cảnh chỉ nên dùng có chừng mực, lạm dụng sẽ phản tác dụng."
 },
 {
  "id": "UD2-tf-030",
  "type": "tf",
  "topic": "E",
  "grade": 11,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Nên chỉnh âm lượng để nhạc nền không át lời nói.",
    "correct": true
   },
   {
    "text": "Xuất phim gộp mọi rãnh thành một tệp video duy nhất.",
    "correct": true
   },
   {
    "text": "Chất lượng phim xuất ra càng cao thì tệp càng nhẹ.",
    "correct": false
   },
   {
    "text": "Cắt ghép clip trong dự án sẽ làm thay đổi và hỏng tệp quay gốc.",
    "correct": false
   }
  ],
  "explain": "(a) đúng vì cần chỉnh âm lượng để nhạc nền không át lời nói; (b) đúng vì export gộp mọi rãnh thành một tệp video duy nhất; (c) sai vì chất lượng càng cao thì tệp càng nặng chứ không nhẹ; (d) sai vì cắt ghép chỉ tác động trên clip, tệp quay gốc vẫn nguyên vẹn."
 },
 {
  "id": "UD2-mc-061",
  "type": "mc",
  "topic": "B",
  "grade": 12,
  "level": "easy",
  "question": "Trong ba cách kết nối thiết bị số thường gặp, cách nào phù hợp nhất để gửi một tệp nhỏ ở khoảng cách gần mà không cần dây?",
  "options": [
   "Cáp",
   "Wi-Fi",
   "Bluetooth",
   "Máy in chung"
  ],
  "answer": 2,
  "explain": "Bluetooth phù hợp cho tệp nhỏ, tầm gần và không cần dây nên là đáp án đúng. Cáp cần dây nối, hợp khi chép nhiều dữ liệu ổn định; Wi-Fi dùng khi nhiều máy cùng mạng; máy in chung là thiết bị chia sẻ, không phải cách gửi tệp giữa hai máy."
 },
 {
  "id": "UD2-mc-062",
  "type": "mc",
  "topic": "B",
  "grade": 12,
  "level": "medium",
  "question": "Điều kiện cần để hai máy tính có thể chia sẻ thư mục cho nhau qua mạng là gì?",
  "options": [
   "Hai máy phải dùng chung một USB",
   "Hai máy phải cùng hãng sản xuất",
   "Hai máy phải tắt hết kết nối mạng",
   "Hai máy phải ở cùng một mạng và bật cho phép thấy nhau"
  ],
  "answer": 3,
  "explain": "Muốn chia sẻ qua mạng, các thiết bị phải ở cùng một mạng và bật cho phép thấy nhau, khi đó máy khác mở trực tiếp thư mục mà không cần USB. Dùng chung USB là chép thủ công chứ không phải chia sẻ qua mạng; cùng hãng không bắt buộc; tắt mạng thì không thể chia sẻ qua mạng."
 },
 {
  "id": "UD2-mc-063",
  "type": "mc",
  "topic": "B",
  "grade": 12,
  "level": "medium",
  "question": "Việc chia sẻ máy in trong một nhóm nhằm mục đích gì?",
  "options": [
   "Để cả nhóm cùng in qua một máy in chung",
   "Để mỗi người phải mua một máy in riêng",
   "Để nhiều người cùng xem chung một màn hình",
   "Để tự động sao lưu dữ liệu"
  ],
  "answer": 0,
  "explain": "Chia sẻ máy in giúp cả nhóm cùng in qua một máy in chung, tiết kiệm thiết bị. Phương án mỗi người mua máy riêng ngược với mục đích chia sẻ; xem chung màn hình là chia sẻ màn hình chứ không phải máy in; sao lưu dữ liệu là việc khác, không liên quan."
 },
 {
  "id": "UD2-mc-064",
  "type": "mc",
  "topic": "B",
  "grade": 12,
  "level": "hard",
  "question": "Khi chia sẻ một thư mục cho người khác, cách làm nào giúp giữ an toàn nhất?",
  "options": [
   "Luôn cấp quyền cho sửa cho mọi người và bật chia sẻ mãi mãi",
   "Đặt đúng quyền truy cập (chỉ xem hay cho sửa), chỉ chia sẻ khi cần và tắt khi xong",
   "Chia sẻ cho tất cả máy trong mạng mà không cần đặt quyền",
   "Tắt hết phần mềm bảo vệ rồi mới chia sẻ"
  ],
  "answer": 1,
  "explain": "An toàn khi chia sẻ là đặt đúng quyền truy cập (chỉ xem hay cho sửa), chỉ chia sẻ khi cần và tắt khi xong. Cấp quyền sửa cho mọi người và bật mãi mãi rất rủi ro; chia sẻ cho tất cả mà không đặt quyền là mất kiểm soát; tắt phần mềm bảo vệ càng làm giảm an toàn."
 },
 {
  "id": "UD2-tf-031",
  "type": "tf",
  "topic": "B",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Kết nối bằng cáp thường ổn định và hợp khi cần chép nhiều dữ liệu.",
    "correct": true
   },
   {
    "text": "Bluetooth phù hợp để truyền tệp nhỏ ở khoảng cách gần.",
    "correct": true
   },
   {
    "text": "Muốn chia sẻ thư mục qua mạng, hai máy bắt buộc phải nối chung một sợi cáp.",
    "correct": false
   },
   {
    "text": "Chia sẻ thư mục giúp máy khác mở trực tiếp tệp mà không cần USB.",
    "correct": true
   }
  ],
  "explain": "(a) đúng: cáp ổn định, hợp khi chép nhiều dữ liệu. (b) đúng: Bluetooth dành cho tệp nhỏ, tầm gần. (c) sai: chia sẻ qua mạng chỉ cần cùng một mạng và bật cho phép thấy nhau, không cần nối chung cáp. (d) đúng: chia sẻ thư mục cho phép máy khác mở trực tiếp tệp, khỏi dùng USB."
 },
 {
  "id": "UD2-tf-032",
  "type": "tf",
  "topic": "B",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Chia sẻ màn hình cho phép nhiều người cùng xem một màn hình.",
    "correct": true
   },
   {
    "text": "Khi chia sẻ, chỉ có duy nhất một mức quyền là cho phép sửa.",
    "correct": false
   },
   {
    "text": "Nên tắt chia sẻ sau khi dùng xong để giữ an toàn.",
    "correct": true
   },
   {
    "text": "Chia sẻ máy in nghĩa là mỗi người in bằng một máy in riêng.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: chia sẻ màn hình để nhiều người cùng xem một màn hình. (b) sai: có thể đặt quyền chỉ xem hoặc cho sửa, không phải chỉ một mức. (c) đúng: tắt chia sẻ khi xong để giữ an toàn. (d) sai: chia sẻ máy in là cả nhóm dùng chung một máy in, không phải mỗi người một máy riêng."
 },
 {
  "id": "UD2-mc-065",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Khi bắt đầu lên ý tưởng cho một trang web, ba câu hỏi cần trả lời trước tiên là gì?",
  "options": [
   "Trang để làm gì, ai xem, nội dung chính là gì",
   "Dùng phông chữ nào, màu gì, cỡ chữ bao nhiêu",
   "Đặt tên miền gì, thuê máy chủ ở đâu, giá bao nhiêu",
   "Viết bằng ngôn ngữ lập trình nào, dùng thư viện nào"
  ],
  "answer": 0,
  "explain": "Khởi đầu dự án web nên trả lời ba câu hỏi: trang để làm gì, ai xem, nội dung chính là gì. Phông chữ, màu sắc là chi tiết hình thức tính sau; tên miền và máy chủ thuộc bước đưa lên mạng; ngôn ngữ và thư viện là chi tiết kĩ thuật, không phải bước xác định mục tiêu ban đầu."
 },
 {
  "id": "UD2-mc-066",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Wireframe của một trang web là gì?",
  "options": [
   "Đoạn mã HTML hoàn chỉnh của trang",
   "Ảnh chụp màn hình trang web của người khác",
   "Bản vẽ nháp khung bố cục trang: đầu trang, thân, chân trang, thanh điều hướng",
   "Tên miền và địa chỉ máy chủ của trang"
  ],
  "answer": 2,
  "explain": "Wireframe là bản vẽ nháp khung trang gồm đầu trang, thân, chân trang và thanh điều hướng. Đoạn mã HTML hoàn chỉnh được viết sau; ảnh chụp trang người khác không phải bản phác khung của mình; tên miền và máy chủ thuộc về địa chỉ trang, không phải khung bố cục."
 },
 {
  "id": "UD2-mc-067",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Vì sao khi chuẩn bị tư liệu nên tách riêng một thư mục cho ảnh?",
  "options": [
   "Để ảnh tự động nhỏ lại",
   "Để trang web chạy nhanh gấp đôi",
   "Để không cần viết mã HTML nữa",
   "Để tổ chức thư mục gọn gàng, dễ quản lí và không lạc tệp"
  ],
  "answer": 3,
  "explain": "Tách riêng thư mục ảnh giúp tổ chức thư mục gọn gàng, dễ quản lí và tránh lạc tệp. Việc để ảnh trong một thư mục không làm ảnh nhỏ lại, không tăng gấp đôi tốc độ chạy và cũng không thay được việc viết mã HTML."
 },
 {
  "id": "UD2-mc-068",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "hard",
  "question": "Việc vẽ sơ đồ trang (sơ đồ các trang và liên kết) trước khi dựng web có lợi ích gì?",
  "options": [
   "Thay thế hoàn toàn cho việc viết mã HTML",
   "Giúp thấy trước số trang và cách các trang liên kết với nhau",
   "Tự động tạo ra tên miền cho website",
   "Làm cho ảnh trên trang đẹp hơn"
  ],
  "answer": 1,
  "explain": "Vẽ sơ đồ trang giúp thấy trước có bao nhiêu trang và các liên kết giữa chúng trước khi bắt tay dựng. Sơ đồ chỉ là bản phác nên không thay được việc viết mã; nó cũng không tạo tên miền và không liên quan đến việc làm ảnh đẹp hơn."
 },
 {
  "id": "UD2-tf-033",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Nên xác định mục đích trang và đối tượng người xem ngay từ đầu dự án.",
    "correct": true
   },
   {
    "text": "Wireframe là bản vẽ nháp khung bố cục của trang.",
    "correct": true
   },
   {
    "text": "Chỉ được phép bắt tay viết mã sau khi trang đã được đưa lên mạng.",
    "correct": false
   },
   {
    "text": "Chuẩn bị tư liệu và tổ chức thư mục gọn giúp không bị lạc tệp.",
    "correct": true
   }
  ],
  "explain": "(a) đúng: khởi đầu cần xác định mục đích và người xem. (b) đúng: wireframe là bản vẽ nháp khung trang. (c) sai: chuẩn bị và dựng trang diễn ra trước, đưa lên mạng là bước cuối nên thứ tự bị đảo ngược. (d) đúng: tổ chức thư mục gọn giúp tránh lạc tệp."
 },
 {
  "id": "UD2-tf-034",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Wireframe thường gồm các phần: đầu trang, thân, chân trang và thanh điều hướng.",
    "correct": true
   },
   {
    "text": "Sơ đồ trang cho biết trước số trang và các liên kết giữa các trang.",
    "correct": true
   },
   {
    "text": "Trong wireframe bắt buộc phải tô đầy đủ màu sắc và dùng ảnh thật hoàn chỉnh.",
    "correct": false
   },
   {
    "text": "Ba câu hỏi mở đầu dự án là: trang để làm gì, ai xem và nội dung chính là gì.",
    "correct": true
   }
  ],
  "explain": "(a) đúng: wireframe phác các phần đầu trang, thân, chân trang và thanh điều hướng. (b) đúng: sơ đồ trang thể hiện số trang và các liên kết. (c) sai: wireframe chỉ là bản nháp khung, không cần màu sắc và ảnh thật hoàn chỉnh. (d) đúng: đó chính là ba câu hỏi khởi đầu dự án."
 },
 {
  "id": "UD2-mc-069",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Phần đầu trang của website (gồm logo và tiêu đề chính) thường được gói trong thẻ nào?",
  "options": [
   "<footer>",
   "<header>",
   "<table>",
   "<input>"
  ],
  "answer": 1,
  "explain": "Phần đầu trang được gói trong thẻ <header>, chứa logo và tiêu đề chính, là bộ mặt nhận diện của website. <footer> là chân trang; <table> dùng để tạo bảng; <input> là ô nhập của biểu mẫu."
 },
 {
  "id": "UD2-mc-070",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Khi chèn logo là một ảnh vào phần đầu trang, thuộc tính alt của thẻ ảnh dùng để làm gì?",
  "options": [
   "Đổi màu nền của trang",
   "Tạo liên kết sang trang khác",
   "Ghi mô tả thay cho ảnh khi ảnh không hiển thị được",
   "Phát nhạc nền cho trang"
  ],
  "answer": 2,
  "explain": "Thuộc tính alt ghi mô tả cho ảnh, hiển thị hoặc được đọc thay khi ảnh không hiện, tốt cho trợ năng. Đổi màu nền là việc của CSS (background); tạo liên kết là của thẻ a với href; phát nhạc nền không liên quan đến thẻ ảnh."
 },
 {
  "id": "UD2-mc-071",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Để logo không bị méo khi chỉnh kích thước, nên làm cách nào?",
  "options": [
   "Cố định chiều cao và để chiều rộng tự co theo tỉ lệ",
   "Kéo tự do cả chiều cao lẫn chiều rộng theo ý muốn",
   "Xoá thuộc tính alt của ảnh",
   "Đổi ảnh logo thành một bảng dữ liệu"
  ],
  "answer": 0,
  "explain": "Cố định một cạnh (ví dụ chiều cao) và để cạnh còn lại co theo tỉ lệ giúp ảnh giữ đúng hình, không méo. Kéo tự do cả hai chiều làm sai tỉ lệ nên ảnh méo; xoá alt hay đổi ảnh thành bảng đều không liên quan đến việc giữ tỉ lệ ảnh."
 },
 {
  "id": "UD2-mc-072",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "hard",
  "question": "Vì sao nên giữ phần đầu trang (header) nhất quán trên mọi trang của website?",
  "options": [
   "Để mỗi trang có một logo và bố cục khác nhau cho phong phú",
   "Để không phải dùng CSS nữa",
   "Để trang tự động đổi tên miền",
   "Để website nhận diện thống nhất; nên dùng chung một tệp CSS và đường dẫn logo cố định"
  ],
  "answer": 3,
  "explain": "Giữ header nhất quán giúp website nhận diện thống nhất; cách làm là dùng chung một tệp CSS và một đường dẫn logo cố định cho mọi trang. Mỗi trang một bố cục khác nhau thì mất nhất quán; nhất quán vẫn cần CSS và không liên quan đến việc đổi tên miền."
 },
 {
  "id": "UD2-tf-035",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Thẻ <header> dùng để chứa phần đầu trang như logo và tiêu đề chính.",
    "correct": true
   },
   {
    "text": "Logo trên trang web thường được chèn dưới dạng ảnh.",
    "correct": true
   },
   {
    "text": "Thuộc tính alt của ảnh logo là để phát ra âm thanh khi bấm vào.",
    "correct": false
   },
   {
    "text": "Phần đầu trang là bộ mặt nhận diện của website.",
    "correct": true
   }
  ],
  "explain": "(a) đúng: <header> chứa phần đầu trang. (b) đúng: logo thường được chèn dưới dạng ảnh. (c) sai: alt là mô tả thay cho ảnh khi ảnh không hiện, không phát âm thanh. (d) đúng: header là bộ mặt nhận diện của website."
 },
 {
  "id": "UD2-tf-036",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Cố định chiều cao và để chiều rộng co theo tỉ lệ giúp logo không bị méo.",
    "correct": true
   },
   {
    "text": "Nên chọn màu chữ tương phản với màu nền để dễ đọc.",
    "correct": true
   },
   {
    "text": "Mỗi trang trong cùng website nên có một tệp CSS và đường dẫn logo khác nhau.",
    "correct": false
   },
   {
    "text": "Có thể dùng CSS để tô màu nền và canh giữa logo với tiêu đề.",
    "correct": true
   }
  ],
  "explain": "(a) đúng: giữ tỉ lệ bằng cách cố định một chiều nên ảnh không méo. (b) đúng: màu chữ tương phản với nền giúp dễ đọc. (c) sai: nên dùng chung một tệp CSS và một đường dẫn logo cố định để phần đầu nhất quán. (d) đúng: CSS dùng để tô màu nền và canh giữa logo với tiêu đề."
 },
 {
  "id": "UD2-mc-073",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Nội dung chính của trang web (đoạn văn, hình ảnh, danh sách) thường được đặt trong phần nào?",
  "options": [
   "Thân trang (thẻ main)",
   "Chân trang (thẻ footer)",
   "Ô nhập của biểu mẫu (thẻ input)",
   "Thanh tiêu đề của trình duyệt"
  ],
  "answer": 0,
  "explain": "Nội dung chính được đặt trong thân trang (thẻ main): đoạn văn, hình ảnh, danh sách. footer là chân trang khép lại trang; input là ô nhập của biểu mẫu; thanh tiêu đề trình duyệt không phải nơi chứa nội dung của trang."
 },
 {
  "id": "UD2-mc-074",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Để chia thân trang thành các khu vực theo chủ đề, ta thường dùng thẻ nào?",
  "options": [
   "img hoặc a",
   "section hoặc div",
   "input hoặc button",
   "header hoặc footer"
  ],
  "answer": 1,
  "explain": "Thân trang được chia thành các khu vực bằng section hoặc div, mỗi khu một chủ đề và mở đầu bằng tiêu đề. img/a là ảnh và liên kết; input/button thuộc biểu mẫu; header/footer là đầu và chân trang, không dùng để chia khu vực bên trong thân."
 },
 {
  "id": "UD2-mc-075",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Chân trang (footer) của website thường chứa nội dung gì?",
  "options": [
   "Toàn bộ nội dung chính của trang",
   "Ô nhập mật khẩu đăng nhập",
   "Logo và tiêu đề chính của trang",
   "Thông tin liên hệ và dòng bản quyền"
  ],
  "answer": 3,
  "explain": "Chân trang khép lại trang, chứa thông tin liên hệ và dòng bản quyền, không phải nội dung chính. Nội dung chính thuộc thân trang; ô nhập mật khẩu không phải vai trò của footer; logo và tiêu đề chính thuộc phần đầu trang (header)."
 },
 {
  "id": "UD2-mc-076",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "hard",
  "question": "Nhóm thuộc tính CSS nào dưới đây thường dùng để tạo khoảng cách và căn chỉnh giúp trang thoáng, gọn gàng?",
  "options": [
   "href, src, alt",
   "input, submit, label",
   "padding, margin, text-align",
   "header, main, footer"
  ],
  "answer": 2,
  "explain": "padding, margin tạo khoảng cách trong và ngoài, còn text-align căn chữ (cùng background-color) giúp trang thoáng, gọn. href/src/alt là thuộc tính của thẻ a và img; input/submit/label thuộc biểu mẫu; header/main/footer là các thẻ bố cục HTML, không phải thuộc tính CSS."
 },
 {
  "id": "UD2-tf-037",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Thân trang (main) chứa nội dung chính như đoạn văn, hình ảnh, danh sách.",
    "correct": true
   },
   {
    "text": "Chân trang (footer) là nơi đặt nội dung chính của trang.",
    "correct": false
   },
   {
    "text": "Có thể dùng section hoặc div để chia thân trang thành các khu vực.",
    "correct": true
   },
   {
    "text": "Mỗi khu vực trong thân trang nên mở đầu bằng một tiêu đề.",
    "correct": true
   }
  ],
  "explain": "(a) đúng: main chứa nội dung chính. (b) sai: footer khép lại trang, chứa liên hệ và bản quyền chứ không phải nội dung chính. (c) đúng: section hoặc div dùng để chia thân trang thành các khu vực. (d) đúng: mỗi khu một chủ đề, mở đầu bằng một tiêu đề."
 },
 {
  "id": "UD2-tf-038",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Dòng bản quyền và thông tin liên hệ thường được đặt ở chân trang.",
    "correct": true
   },
   {
    "text": "background-color là thuộc tính CSS dùng để đặt màu nền.",
    "correct": true
   },
   {
    "text": "padding và margin dùng để tạo khoảng cách giúp trang thoáng hơn.",
    "correct": true
   },
   {
    "text": "Chỉ có duy nhất thẻ div mới chia được thân trang, không dùng được section.",
    "correct": false
   }
  ],
  "explain": "(a) đúng: chân trang chứa liên hệ và dòng bản quyền. (b) đúng: background-color đặt màu nền. (c) đúng: padding và margin tạo khoảng cách giúp trang thoáng. (d) sai: có thể dùng section hoặc div để chia khu vực, không chỉ riêng div."
 },
 {
  "id": "UD2-mc-077",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Để tạo một liên kết sang trang khác trong HTML, ta dùng thẻ nào và thuộc tính nào để ghi địa chỉ trang đích?",
  "options": [
   "Thẻ <a> với thuộc tính href",
   "Thẻ <nav> với thuộc tính src",
   "Thẻ <link> với thuộc tính for",
   "Thẻ <img> với thuộc tính alt"
  ],
  "answer": 0,
  "explain": "Thẻ <a> (liên kết) với thuộc tính href tạo liên kết, href ghi tên tệp trang đích. <nav> chỉ dùng để bọc nhóm liên kết chứ không tự tạo liên kết; <link> dùng để nhúng tài nguyên (như tệp CSS) ở phần head, không tạo liên kết bấm được; <img> với alt là để chèn ảnh."
 },
 {
  "id": "UD2-mc-078",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Trong đoạn mã <a href=\"gioithieu.html\">Giới thiệu</a>, phần nào là chữ mà người xem nhìn thấy và bấm vào?",
  "options": [
   "href",
   "gioithieu.html",
   "Giới thiệu",
   "<a>"
  ],
  "answer": 2,
  "explain": "Chữ nằm giữa thẻ mở <a> và thẻ đóng </a>, tức \"Giới thiệu\", là phần hiển thị và bấm được. \"href\" chỉ là tên thuộc tính; \"gioithieu.html\" là giá trị của href (tên tệp trang đích, không hiển thị); \"<a>\" là thẻ mở."
 },
 {
  "id": "UD2-mc-079",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Vì sao khi liên kết các trang trong cùng một dự án web, ta nên dùng liên kết tương đối (chỉ ghi tên tệp)?",
  "options": [
   "Vì liên kết tương đối chạy nhanh hơn hẳn liên kết khác",
   "Vì website vẫn chạy đúng khi chép sang máy khác hoặc tải lên mạng",
   "Vì trình duyệt chỉ hiểu được liên kết tương đối",
   "Vì liên kết tương đối làm trang trông đẹp hơn"
  ],
  "answer": 1,
  "explain": "Liên kết tương đối chỉ ghi tên tệp theo vị trí tương đối, nên khi chép cả thư mục dự án sang chỗ khác hay tải lên máy chủ thì đường dẫn vẫn đúng, website vẫn chạy. Tốc độ không phải lý do; trình duyệt hiểu được cả liên kết tương đối lẫn tuyệt đối; liên kết không quyết định trang đẹp hay xấu."
 },
 {
  "id": "UD2-mc-080",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "hard",
  "question": "Phát biểu nào đúng về thanh điều hướng (menu) của một website có nhiều trang?",
  "options": [
   "Mỗi trang nên có một menu khác nhau để website thêm phong phú",
   "Menu là nhóm thẻ <a> bọc trong <nav>, giữ giống nhau và cùng vị trí trên mọi trang",
   "Menu bắt buộc phải đặt ở chân trang (footer)",
   "Không thể đánh dấu mục trang đang mở trong menu"
  ],
  "answer": 1,
  "explain": "Menu là nhóm thẻ <a> đặt trong <nav>, cần nhất quán (giống nhau, cùng vị trí) trên mọi trang để người xem dễ định hướng. Menu khác nhau mỗi trang sẽ gây rối; menu thường đặt ở đầu trang chứ không bắt buộc ở footer; và có thể đánh dấu mục đang mở bằng một class riêng rồi tô CSS."
 },
 {
  "id": "UD2-tf-039",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Thẻ <a> với thuộc tính href dùng để tạo liên kết sang trang khác.",
    "correct": true
   },
   {
    "text": "Trong <a href=\"lienhe.html\">Liên hệ</a>, \"lienhe.html\" chính là chữ hiển thị cho người xem bấm.",
    "correct": false
   },
   {
    "text": "Liên kết tương đối chỉ ghi tên tệp trang đích trong cùng dự án.",
    "correct": true
   },
   {
    "text": "Muốn tạo một liên kết bấm được, ta bắt buộc phải dùng thẻ <nav>.",
    "correct": false
   }
  ],
  "explain": "(a) Đúng: thẻ <a> cùng thuộc tính href tạo liên kết. (b) Sai: chữ hiển thị bấm được là \"Liên hệ\" nằm giữa hai thẻ, còn \"lienhe.html\" là giá trị href, chỉ tên tệp đích chứ không hiển thị. (c) Đúng: trong cùng dự án dùng liên kết tương đối, chỉ ghi tên tệp. (d) Sai: liên kết được tạo bằng thẻ <a>; <nav> chỉ dùng để nhóm các liên kết thành thanh điều hướng."
 },
 {
  "id": "UD2-tf-040",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Thanh điều hướng thường là nhóm thẻ <a> được bọc trong thẻ <nav>.",
    "correct": true
   },
   {
    "text": "Nên đánh dấu mục trang đang mở (ví dụ bằng class riêng rồi tô CSS) để người xem biết đang ở trang nào.",
    "correct": true
   },
   {
    "text": "Menu ở mỗi trang nên khác nhau để website đỡ nhàm chán.",
    "correct": false
   },
   {
    "text": "Menu chỉ cần đặt trên trang chủ, các trang còn lại không cần menu.",
    "correct": false
   }
  ],
  "explain": "(a) Đúng: menu là nhóm thẻ <a> đặt trong <nav>. (b) Đúng: đánh dấu mục đang mở giúp người xem biết vị trí hiện tại. (c) Sai: menu phải nhất quán, giống nhau trên mọi trang để dễ định hướng, không nên mỗi trang một kiểu. (d) Sai: menu cần xuất hiện và giống nhau trên mọi trang, không chỉ riêng trang chủ."
 },
 {
  "id": "UD2-mc-081",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Biểu mẫu (form) trong trang web dùng để làm gì?",
  "options": [
   "Chỉ để hiển thị nội dung một chiều cho người xem đọc",
   "Để người xem nhập và gửi thông tin về cho chủ trang",
   "Để chèn ảnh động vào trang",
   "Để tạo liên kết sang trang khác"
  ],
  "answer": 1,
  "explain": "Biểu mẫu mở \"luồng ngược\": người xem nhập dữ liệu rồi gửi về cho chủ trang, thay vì chỉ đọc thông tin một chiều. Hiển thị để đọc là chức năng của nội dung thường; chèn ảnh động dùng công cụ ảnh; tạo liên kết dùng thẻ <a>."
 },
 {
  "id": "UD2-mc-082",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Một biểu mẫu tối thiểu cần có những thành phần nào, và được gói chung trong thẻ nào?",
  "options": [
   "Vài thẻ <a>, gói trong thẻ <nav>",
   "Ô nhập (input, textarea...) và nút gửi (submit), gói chung trong thẻ <form>",
   "Một ảnh và dòng chú thích, gói trong thẻ <figure>",
   "Nhiều đoạn văn, gói trong thẻ <main>"
  ],
  "answer": 1,
  "explain": "Biểu mẫu cần ít nhất ô nhập liệu (input, textarea...) và nút gửi (submit), tất cả đặt trong thẻ <form>. Các phương án còn lại mô tả những cấu trúc khác: thanh điều hướng, khối ảnh, thân trang, không phải biểu mẫu."
 },
 {
  "id": "UD2-mc-083",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Muốn cho người dùng chọn NHIỀU mục cùng lúc (ví dụ chọn nhiều sở thích) thì nên dùng loại trường nào?",
  "options": [
   "text (ô nhập chữ tự do)",
   "radio (nút chọn)",
   "checkbox (ô đánh dấu)",
   "select (danh sách thả xuống)"
  ],
  "answer": 2,
  "explain": "checkbox cho phép đánh dấu chọn nhiều mục cùng lúc. text chỉ để nhập chữ tự do; radio chỉ cho chọn một mục trong nhóm; select ở dạng thông thường cũng chỉ cho chọn một mục trong danh sách."
 },
 {
  "id": "UD2-mc-084",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "hard",
  "question": "Nhãn (label) được gắn với ô nhập bằng cách nào và để làm gì?",
  "options": [
   "Dùng thuộc tính for của label khớp với id của ô nhập, giúp dễ dùng và thân thiện với trợ năng",
   "Dùng thuộc tính href của label trỏ tới ô nhập, để tạo liên kết",
   "Dùng thuộc tính src của label, để hiển thị ảnh minh hoạ",
   "Không cần gắn gì, label và ô nhập luôn tự động liên kết với nhau"
  ],
  "answer": 0,
  "explain": "label gắn với ô nhập khi thuộc tính for của label trùng với id của ô nhập; nhờ đó bấm vào nhãn cũng chọn được ô, tăng trải nghiệm và thân thiện với trợ năng. href là của thẻ <a>, src là của ảnh; label và ô nhập không tự liên kết nếu thiếu cặp for–id khớp nhau."
 },
 {
  "id": "UD2-tf-041",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Biểu mẫu mở luồng ngược: người xem nhập rồi gửi thông tin về cho chủ trang.",
    "correct": true
   },
   {
    "text": "Mọi biểu mẫu đều cần có ô nhập và nút gửi, gói chung trong thẻ <form>.",
    "correct": true
   },
   {
    "text": "Biểu mẫu chỉ dùng để hiển thị nội dung một chiều cho người xem đọc.",
    "correct": false
   },
   {
    "text": "Muốn tạo biểu mẫu, ta gói các thành phần trong thẻ <nav>.",
    "correct": false
   }
  ],
  "explain": "(a) Đúng: form tạo luồng ngược để người xem gửi dữ liệu về cho chủ trang. (b) Đúng: form cần ô nhập và nút gửi, đặt trong thẻ <form>. (c) Sai: hiển thị một chiều là nội dung thường; form là để nhập và gửi thông tin. (d) Sai: các thành phần biểu mẫu gói trong thẻ <form>, còn <nav> dùng cho thanh điều hướng."
 },
 {
  "id": "UD2-tf-042",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "radio cho phép chọn một mục trong nhóm, còn checkbox cho phép chọn nhiều mục.",
    "correct": true
   },
   {
    "text": "Nhãn label gắn với ô nhập nhờ thuộc tính for khớp với id, tốt cho trợ năng.",
    "correct": true
   },
   {
    "text": "checkbox chỉ cho phép chọn đúng một mục duy nhất trong nhóm.",
    "correct": false
   },
   {
    "text": "Ô nhập email và ô nhập text là hoàn toàn giống nhau, không khác gì nhau.",
    "correct": false
   }
  ],
  "explain": "(a) Đúng: radio chọn một, checkbox chọn nhiều. (b) Đúng: cặp for–id liên kết nhãn với ô nhập, thân thiện với trợ năng. (c) Sai: chọn đúng một mục là radio hoặc select; checkbox cho phép chọn nhiều mục. (d) Sai: email là loại trường riêng dành cho địa chỉ email (có thể kiểm tra định dạng), khác với text là nhập chữ tự do."
 },
 {
  "id": "UD2-mc-085",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Vì sao khi hoàn thiện trang, ta nên dùng quy tắc CSS chung cho cả website?",
  "options": [
   "Để mỗi trang có phông chữ và bảng màu khác nhau",
   "Để khi đổi một chỗ thì cả website đổi theo, giữ giao diện nhất quán",
   "Để trang tải chậm hơn nhưng an toàn hơn",
   "Để khỏi phải kiểm thử các liên kết nữa"
  ],
  "answer": 1,
  "explain": "Dùng quy tắc CSS chung (chung phông chữ, bảng màu, khoảng cách) giúp giao diện nhất quán và chỉ cần sửa một nơi là cả site cập nhật theo. CSS chung nhằm thống nhất chứ không phải khác nhau mỗi trang; nó không làm chậm trang; và không thay thế cho việc kiểm thử liên kết."
 },
 {
  "id": "UD2-mc-086",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Khi kiểm thử trang web, thấy một ảnh không hiện lên. Nguyên nhân thường gặp và cách sửa là gì?",
  "options": [
   "Do sai thuộc tính href của thẻ <a>, sửa lại href",
   "Do sai đường dẫn src của ảnh, sửa lại src cho đúng",
   "Do màn hình điện thoại quá nhỏ, phải mua màn hình lớn hơn",
   "Do thiếu quy tắc CSS chung, phải xoá hết CSS"
  ],
  "answer": 1,
  "explain": "Ảnh không hiện thường do đường dẫn src sai (sai tên tệp hoặc sai vị trí), sửa lại src cho đúng là ảnh hiện. href là của liên kết (gây liên kết gãy, không phải ảnh mất); kích thước màn hình không làm ảnh biến mất; lỗi ảnh không liên quan đến việc xoá CSS."
 },
 {
  "id": "UD2-mc-087",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Để trang web xem tốt trên màn hình điện thoại (màn hình nhỏ), ta nên làm gì?",
  "options": [
   "Cố định chiều rộng trang thật lớn để người xem kéo ngang mà xem",
   "Để ảnh co giãn và các khối tự xuống hàng, người xem chỉ cần cuộn dọc",
   "Xoá bớt các trang cho website nhẹ hơn",
   "Chỉ dùng liên kết tuyệt đối cho mọi trang"
  ],
  "answer": 1,
  "explain": "Trang thân thiện với điện thoại cần cho ảnh co giãn theo bề rộng và các khối tự xuống hàng, để người xem chỉ cuộn dọc chứ không phải kéo ngang. Cố định bề rộng lớn buộc kéo ngang gây khó dùng; xoá trang không liên quan đến hiển thị; loại liên kết không quyết định khả năng hiển thị trên màn hình nhỏ."
 },
 {
  "id": "UD2-mc-088",
  "type": "mc",
  "topic": "E",
  "grade": 12,
  "level": "hard",
  "question": "Bước đóng gói và đưa website lên mạng để mọi người đều xem được thực hiện như thế nào?",
  "options": [
   "Chỉ gửi riêng tệp trang chủ qua email cho từng người",
   "Gom mọi tệp và thư mục ảnh, dùng đường dẫn tương đối, rồi đưa lên dịch vụ lưu trữ web",
   "Đổi hết đường dẫn ảnh sang đường dẫn tuyệt đối trỏ về máy của mình",
   "In trang web ra giấy rồi phát cho mọi người"
  ],
  "answer": 1,
  "explain": "Cần gom đủ mọi tệp và thư mục ảnh, dùng đường dẫn tương đối để không gãy khi chuyển chỗ, rồi tải lên dịch vụ lưu trữ web (hosting) để có địa chỉ ai cũng truy cập được. Gửi riêng trang chủ sẽ thiếu ảnh và các trang liên kết; đường dẫn tuyệt đối trỏ về máy cá nhân sẽ không chạy trên máy người khác; in ra giấy không phải là đưa web lên mạng."
 },
 {
  "id": "UD2-tf-043",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "easy",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Nên dùng quy tắc CSS chung để cả website nhất quán và sửa một nơi là cả trang đổi theo.",
    "correct": true
   },
   {
    "text": "Kiểm thử gồm việc bấm thử từng liên kết và cuộn xem mọi ảnh có hiện đủ không.",
    "correct": true
   },
   {
    "text": "Trình duyệt sẽ tự động sửa hết liên kết gãy và ảnh sai nên không cần kiểm thử.",
    "correct": false
   },
   {
    "text": "Liên kết gãy và ảnh không hiện là chuyện bình thường, không cần sửa.",
    "correct": false
   }
  ],
  "explain": "(a) Đúng: CSS chung giúp nhất quán, sửa một nơi cả site đổi theo. (b) Đúng: cần bấm thử liên kết và cuộn xem ảnh để phát hiện lỗi. (c) Sai: trình duyệt không tự sửa; người làm phải tự sửa href/src bị sai. (d) Sai: liên kết gãy và ảnh mất là lỗi phải sửa cho hết trước khi phát hành."
 },
 {
  "id": "UD2-tf-044",
  "type": "tf",
  "topic": "E",
  "grade": 12,
  "level": "medium",
  "question": "Cho biết mỗi phát biểu sau đúng hay sai:",
  "statements": [
   {
    "text": "Trên màn hình nhỏ, nên để ảnh co giãn và khối tự xuống hàng để người xem chỉ cần cuộn dọc.",
    "correct": true
   },
   {
    "text": "Trang thân thiện với điện thoại là trang buộc người xem phải kéo ngang mới xem hết.",
    "correct": false
   },
   {
    "text": "Khi đóng gói web nên dùng đường dẫn tương đối và gom đủ mọi tệp, thư mục ảnh.",
    "correct": true
   },
   {
    "text": "Muốn ai cũng xem được, chỉ cần lưu website trong một thư mục trên máy mình là đủ.",
    "correct": false
   }
  ],
  "explain": "(a) Đúng: ảnh co giãn, khối tự xuống hàng giúp chỉ cần cuộn dọc, dễ xem trên điện thoại. (b) Sai: phải kéo ngang là dấu hiệu trang chưa tối ưu cho màn hình nhỏ. (c) Đúng: dùng đường dẫn tương đối và gom đủ tệp/ảnh để web không gãy khi chuyển chỗ. (d) Sai: lưu trên máy mình thì người khác không truy cập được; phải đưa lên dịch vụ lưu trữ web để có địa chỉ công khai."
 }
];
  QUESTION_BANK.push.apply(QUESTION_BANK, Q);
})();
