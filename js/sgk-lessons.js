/* ============================================================================
 *  BÀI HỌC THEO SÁCH GIÁO KHOA (mẫu) - "Sách + Giảng lại".
 *  Mỗi bài bám đúng 1 Bài trong SGK: hiển thị TRANG SÁCH THẬT (ảnh) + phần
 *  DIỄN GIẢI dễ hiểu do tôi viết. Ảnh sách lấy từ thư mục sach/pages/ (tệp
 *  cục bộ của người dùng - không nhúng cứng vào mã, dùng cho học cá nhân).
 * ==========================================================================*/
(function () {
  if (typeof LESSONS === "undefined") return;

  /* CSS cho khung "Trang sách" */
  var css =
    ".sgk-box{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:10px;background:var(--bg-card)}" +
    ".sgk-head{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--warning-soft);cursor:pointer;font-weight:700;font-size:14.5px;flex-wrap:wrap}" +
    ".sgk-head small{color:var(--text-soft);font-weight:500;font-size:12.5px;flex:1;min-width:160px}" +
    ".sgk-chev{color:var(--text-soft)}" +
    ".sgk-pages{display:grid;gap:10px;padding:12px;background:var(--bg-soft)}" +
    ".sgk-pages[hidden]{display:none}" +
    ".sgk-img{width:100%;max-width:720px;margin:0 auto;display:block;border:1px solid var(--border);border-radius:6px;box-shadow:var(--shadow)}" +
    ".sgk-missing{padding:12px 16px;color:var(--text-soft);font-size:13.5px}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* Nhóm hiển thị theo từng cuốn SGK (chuyển đổi dần sang định dạng "Sách + Giảng lại") */
  if (typeof STAGES !== "undefined") {
    STAGES[10] = "SGK Tin học 10 (Kết nối tri thức)";
    STAGES[11] = "SGK Tin học 11 – Khoa học máy tính (KNTT)";
    STAGES[12] = "SGK Tin học 12 – Khoa học máy tính (KNTT)";
  }

  LESSONS.push(
  /* ===== SGK TIN 10 · Bài 1 ===== */
  {
    id: "S10-01", stage: 10, order: 1, topic: "A", grade: 10, minutes: 9,
    title: "Bài 1. Thông tin và xử lí thông tin",
    intro: "Phân biệt thông tin với dữ liệu, hiểu cách máy tính xử lí thông tin qua 3 bước, và các đơn vị lưu trữ dữ liệu.",
    sgk: {
      ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 1, trang 6–10",
      images: ["sach/pages/tin10/p007.png", "sach/pages/tin10/p008.png", "sach/pages/tin10/p009.png", "sach/pages/tin10/p010.png", "sach/pages/tin10/p011.png"],
    },
    sections: [
      { t: "story", text: "Em nhặt được một mảnh giấy, trên đó ghi mỗi con số **8**. Con số 8 đó nằm trơ trọi, chưa cho em biết điều gì cả — người ta gọi nó là `dữ liệu`. Nhưng nếu cô giáo nói: “Em được **8 điểm** môn Toán nhé!”, thì lúc này trong đầu em **hiểu ra**: “A, mình làm bài khá tốt rồi!”. Cái điều em hiểu ra đó mới gọi là `thông tin`. Nói thật ngắn: **dữ liệu là món đồ thô, còn thông tin là điều em hiểu được từ món đồ đó**." },

      { t: "h", text: "1) Dữ liệu và thông tin khác nhau chỗ nào?" },
      { t: "text", text: "Để dễ nhớ, em hãy tưởng tượng chuyện nấu ăn nhé:" },
      { t: "list", items: [
        "`Dữ liệu` giống **nguyên liệu trong tủ lạnh**: trứng, bột, đường. Tự nó thì chưa ăn được.",
        "`Thông tin` giống **cái bánh đã làm xong**: là thứ có ích, dùng được ngay.",
      ] },
      { t: "text", text: "Thêm một ví dụ nữa cho chắc: dãy số **27, 28, 30, 33** chỉ là mấy con số khô khan — đó là `dữ liệu`. Nhưng khi em nhìn ra “**trời mỗi ngày một nóng hơn**” thì cái ý đó đã là `thông tin` rồi. Cùng một thứ, nhưng khi ta **hiểu được ý nghĩa** thì nó thành thông tin." },
      { t: "note", text: "Máy tính rất giỏi việc **cất giữ và biến đổi dữ liệu**. Còn việc **hiểu** dữ liệu thành điều có ích thì cần bộ óc con người. Máy tính chỉ là người trợ giúp đắc lực thôi, nó không tự “hiểu” như em đâu." },

      { t: "h", text: "2) Máy tính làm việc qua 3 bước" },
      { t: "text", text: "Em thử nhớ lại lúc mình làm một phép tính nhẩm xem:" },
      { t: "list", items: [
        "**Bước 1 – Nhận:** cô đọc đề “3 cộng 5”, tai em nghe và **nhận** lấy.",
        "**Bước 2 – Làm:** em **nhẩm** trong đầu.",
        "**Bước 3 – Trả:** em **nói ra** kết quả “8”.",
      ] },
      { t: "text", text: "Máy tính cũng làm y hệt như vậy, chỉ khác là nó làm với `dữ liệu` chứ không nghĩ trong đầu như em:" },
      { t: "example", text: "Ba bước của máy tính (người ta hay gọi tắt là **Vào → Xử lí → Ra**):", code: "① NHẬN dữ liệu vào   (em gõ phím, chạm màn hình, hay cảm biến đo...)\n② XỬ LÍ dữ liệu      (máy tính toán, biến đổi bên trong)\n③ ĐƯA kết quả ra     (hiện lên màn hình, phát ra loa, in ra giấy...)", output: "Vào → Xử lí → Ra" },
      { t: "note", text: "Hãy nhớ thật kĩ **ba bước Vào → Xử lí → Ra** này. Sau này em viết bất kì chương trình nào cũng đều đi theo đúng ba bước đó." },

      { t: "h", text: "3) Máy tính đo “chỗ chứa” bằng gì?" },
      { t: "text", text: "Giống như em đong gạo bằng lon, bằng bao — máy tính đo lượng dữ liệu bằng những **đơn vị** riêng. Đơn vị **nhỏ nhất** tên là `bit`. Một bit chỉ nhận được **một trong hai giá trị: 0 hoặc 1**, y như một bóng đèn chỉ có thể **tắt (số 0)** hoặc **bật (số 1)** vậy." },
      { t: "text", text: "Một bit thì nói được rất ít. Nên người ta **gom nhiều bit lại** thành đơn vị to hơn:" },
      { t: "list", items: [
        "**8 bit = 1 byte** — vừa đủ để ghi một chữ cái (ví dụ chữ 'A').",
        "**1 KB** = 1024 byte (khoảng một nghìn byte).",
        "**1 MB** = 1024 KB · **1 GB** = 1024 MB · **1 TB** = 1024 GB.",
      ] },
      { t: "text", text: "Mỗi bậc to hơn bậc ngay trước nó khoảng **một nghìn lần** (chính xác là 1024 lần). Nhờ vậy mà một chiếc điện thoại nhỏ xíu có thể chứa **mấy chục nghìn** tấm ảnh đấy!" },

      { t: "h", text: "4) Vì sao dùng máy tính, điện thoại lại tiện đến thế?" },
      { t: "list", items: [
        "**Nhớ được rất nhiều:** cả nghìn cuốn sách nhét vừa trong một chiếc điện thoại.",
        "**Làm rất nhanh:** tính hàng triệu phép chỉ trong một giây.",
        "**Gửi đi rất xa:** em bấm một cái, bạn ở tận tỉnh khác nhận được ngay.",
        "**Sao chép dễ và không sai:** chép ra 100 bản thì cả 100 bản giống hệt nhau.",
      ] },
      { t: "note", text: "Bốn điều trên gọi chung là **sự ưu việt của thiết bị số**: nhớ nhiều – làm nhanh – gửi xa – chép dễ." },
    ],
    keypoints: [
      "Dữ liệu là món đồ thô; thông tin là điều mình **hiểu** được từ dữ liệu.",
      "Máy tính làm việc theo 3 bước: **Nhận (Vào) → Xử lí → Trả kết quả (Ra)**.",
      "Nhỏ nhất là bit (0/1); 8 bit = 1 byte; rồi KB, MB, GB, TB (mỗi bậc ~1000 lần).",
      "Thiết bị số ưu việt: nhớ nhiều, làm nhanh, gửi xa, chép dễ.",
    ],
    quiz: ["A-mc-1", "A-mc-6", "A-sa-2", "A-mc-14", "A-mc-3"],
  },
  /* ===== SGK TIN 10 · Bài 2 ===== */
  {
    id: "S10-02", stage: 10, order: 2, topic: "A", grade: 10, minutes: 10,
    title: "Bài 2. Vai trò của thiết bị thông minh và tin học đối với xã hội",
    intro: "Thiết bị thông minh là gì, vì sao gọi là “thông minh”, và tin học đã làm cuộc sống thay đổi ra sao.",
    sgk: {
      ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 2, trang 11–15",
      images: ["sach/pages/tin10/p012.png", "sach/pages/tin10/p013.png", "sach/pages/tin10/p014.png", "sach/pages/tin10/p015.png", "sach/pages/tin10/p016.png"],
    },
    sections: [
      { t: "story", text: "Em có để ý cái điện thoại của bố mẹ không? Nó **tự** nhận ra khuôn mặt để mở khóa, **tự** nhắc giờ, **tự** gợi ý đường đi... — làm được nhiều việc mà không cần ai bảo từng li từng tí. Vì thế người ta gọi nó là thiết bị **thông minh**. Vậy “thông minh” nghĩa là sao? Cùng tìm hiểu nhé." },
      { t: "h", text: "1) Thiết bị thông minh là gì?" },
      { t: "text", text: "Một thiết bị được gọi là **thông minh** khi nó có **hai điều** sau:" },
      { t: "list", items: [
        "**Tự làm việc được một phần** nhờ phần mềm cài sẵn (không cần người điều khiển từng bước).",
        "**Biết kết nối** (qua wifi, bluetooth...) để trao đổi dữ liệu với thiết bị khác.",
      ] },
      { t: "example", text: "Nhận ra thiết bị thông minh:", code: "THÔNG MINH : điện thoại thông minh, đồng hồ thông minh,\n             camera nối Internet (tự quay khi thấy chuyển động)\nKHÔNG      : đồng hồ lịch để bàn, máy ảnh du lịch thường\n             (không tự làm việc, không tự kết nối)", output: "Thông minh = tự làm việc + biết kết nối" },
      { t: "note", text: "Nhớ **2 dấu hiệu**: tự làm việc một phần + biết kết nối trao đổi dữ liệu. Thiếu một trong hai thì chưa gọi là thông minh." },
      { t: "h", text: "2) Cách mạng công nghiệp 4.0 (nói cho dễ)" },
      { t: "text", text: "Đơn giản là: **các máy móc, đồ vật giờ biết “nói chuyện” với nhau qua Internet** và tự làm nhiều việc thay con người. Ví dụ: **nhà thông minh** (đèn tự bật khi có người), **xe tự lái**, **đồng hồ đo sức khỏe** gửi số liệu về điện thoại." },
      { t: "h", text: "3) Tin học làm cuộc sống đổi thay thế nào?" },
      { t: "list", items: [
        "Học **online**, xem bài giảng ở bất cứ đâu.",
        "**Mua hàng, gọi video, nhắn tin** cho người ở xa trong tích tắc.",
        "**Bản đồ chỉ đường**, đặt xe, đặt đồ ăn chỉ bằng một cú chạm.",
      ] },
      { t: "h", text: "4) Những thành tựu lớn của ngành tin học" },
      { t: "list", items: [
        "**Ngôn ngữ lập trình** (như Python) — giúp con người viết chương trình dễ hơn.",
        "**Cơ sở dữ liệu** — quản lí lượng dữ liệu khổng lồ (ngân hàng, trường học...).",
        "**Trí tuệ nhân tạo (AI)** và **dữ liệu lớn** — máy tự học, tự nhận diện, gợi ý...",
      ] },
      { t: "note", text: "Nhờ máy tính, thiết bị số và Internet phát triển mạnh, tin học đã thành thứ **không thể thiếu** trong xã hội ngày nay." },
    ],
    keypoints: [
      "Thiết bị thông minh = tự làm việc một phần + biết kết nối trao đổi dữ liệu.",
      "Cách mạng 4.0: đồ vật nối Internet, tự động hóa nhiều việc (IoT, xe tự lái...).",
      "Tin học đổi thay mọi mặt: học, mua sắm, liên lạc, đi lại.",
      "Thành tựu lớn: ngôn ngữ lập trình, cơ sở dữ liệu, trí tuệ nhân tạo, dữ liệu lớn.",
    ],
    quiz: ["G-mc-2", "G-mc-8", "B-mc-6", "B-mc-7", "G-mc-9"],
  },
  /* ===== SGK TIN 10 · Bài 3 ===== */
  {
    id: "S10-03", stage: 10, order: 3, topic: "A", grade: 10, minutes: 11,
    title: "Bài 3. Một số kiểu dữ liệu và dữ liệu văn bản",
    intro: "Máy tính chia dữ liệu thành các “kiểu” khác nhau, và cách máy biến chữ viết thành số để lưu (bảng mã ASCII, Unicode).",
    sgk: {
      ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 3, trang 16–19",
      images: ["sach/pages/tin10/p017.png", "sach/pages/tin10/p018.png", "sach/pages/tin10/p019.png", "sach/pages/tin10/p020.png"],
    },
    sections: [
      { t: "story", text: "Máy tính lưu MỌI thứ bằng 0 và 1. Nhưng số **15**, chữ **“A”**, và một **bức ảnh** rõ ràng rất khác nhau đúng không? Vì thế máy phải **chia dữ liệu thành từng “kiểu”** để biết cách xử lí cho đúng — số thì đem tính, chữ thì đem ghép..." },
      { t: "h", text: "1) Bốn kiểu dữ liệu thường gặp" },
      { t: "list", items: [
        "**Văn bản** (chữ): tên, câu văn... — dùng để ghép, tách, so sánh.",
        "**Số**: để **tính toán** và so sánh (cộng, trừ, lớn hơn...).",
        "**Lôgic**: chỉ có **Đúng / Sai** (ví dụ “trời có mưa không?”).",
        "**Đa phương tiện**: **âm thanh, hình ảnh**.",
      ] },
      { t: "note", text: "Mẹo phân biệt: đem **cộng trừ** được thì là **số**; chỉ **ghép chữ** thì là **văn bản**. Ví dụ số điện thoại tuy toàn chữ số nhưng ta không cộng nó, nên coi như **văn bản**." },
      { t: "h", text: "2) Máy đổi chữ thành số thế nào? (bảng mã)" },
      { t: "text", text: "Máy không hiểu chữ “A” — nên người ta **quy ước mỗi chữ ứng với một con số**. Bảng quy ước đó gọi là **bảng mã**." },
      { t: "list", items: [
        "**ASCII**: bảng mã cho chữ cái tiếng Anh, chữ số, dấu câu. Ví dụ chữ **“A” có mã 65**.",
        "**Unicode**: bảng mã **lớn hơn nhiều**, ghi được chữ của **mọi ngôn ngữ**, kể cả **tiếng Việt có dấu** (ă, â, ê, ô, ơ...).",
      ] },
      { t: "h", text: "3) Số hóa văn bản = biến chữ thành dãy bit" },
      { t: "text", text: "Khi em gõ một chữ, máy làm 3 việc rất nhanh: **① tra bảng mã** xem chữ đó ứng với số mấy → **② đổi số đó ra nhị phân (dãy 0/1)** → **③ lưu dãy bit** vào bộ nhớ. Cả một trang chữ cũng chỉ là **một dãy 0 và 1 thật dài** thôi!" },
      { t: "note", text: "Vì tiếng Việt có dấu, ta nên dùng **Unicode** để gõ tiếng Việt cho đúng, tránh lỗi font." },
    ],
    keypoints: [
      "4 kiểu dữ liệu: văn bản, số, lôgic (đúng/sai), đa phương tiện (âm thanh/hình ảnh).",
      "Số để tính toán; văn bản để ghép/tách/so sánh.",
      "Bảng mã gán mỗi chữ một số: ASCII (chữ Anh), Unicode (mọi ngôn ngữ, có tiếng Việt).",
      "Số hóa văn bản: tra bảng mã → đổi ra nhị phân → lưu thành dãy bit.",
    ],
    quiz: ["A-mc-9", "A-mc-12", "A-mc-8", "A-tf-2", "A-mc-1"],
  },
  /* ===== SGK TIN 11 · Bài 17 (mẫu) ===== */
  {
    id: "S17", stage: 11, order: 17, topic: "F", grade: 11, minutes: 12,
    title: "Bài 17. Dữ liệu mảng một chiều và hai chiều",
    intro: "Cách gom nhiều dữ liệu CÙNG LOẠI vào một chỗ: mảng một chiều (một dãy) và mảng hai chiều (một bảng). Đây là mở đầu của Chủ đề 6 – Kĩ thuật lập trình.",
    sgk: {
      ref: "SGK Tin học 11 – Khoa học máy tính (Kết nối tri thức) · Bài 17, trang 81–85",
      images: [
        "sach/pages/tin11/p083.png",
        "sach/pages/tin11/p084.png",
        "sach/pages/tin11/p085.png",
        "sach/pages/tin11/p086.png",
        "sach/pages/tin11/p087.png",
      ],
    },
    sections: [
      { t: "story", text: "Muốn lưu điểm của cả lớp 40 bạn, chẳng lẽ tạo 40 biến `diem1, diem2, ...`? Quá cực! Thay vào đó ta xếp tất cả vào MỘT 'dãy tủ có đánh số' — đó là `mảng`. Cần điểm bạn thứ 5 thì mở ngăn số 5. Sách gọi mảng một chiều là 'cấu trúc dữ liệu tuyến tính'; nói đơn giản: một hàng các ô cùng loại, đánh số từ 0." },
      { t: "h", text: "1) Mảng một chiều = danh sách (list)" },
      { t: "text", text: "Mảng một chiều là **một dãy các phần tử CÙNG KIỂU** (toàn số, hoặc toàn chữ...), truy cập qua **chỉ số** bắt đầu từ 0. Trong Python, nó chính là `list`." },
      { t: "code", code: "A = [1, 3, 5, 7, 9, 11]     # mảng số\nB = [\"Hà\", \"Bình\", \"Ngọc\", \"Anh\"]  # mảng chuỗi\nprint(A[0])    # phần tử đầu -> 1\nprint(A[2])    # -> 5\nprint(len(A))  # số phần tử -> 6" },
      { t: "example", text: "Ba mảng ví dụ y như trong SGK (Hoạt động 1):", code: "A = [1, 3, 5, 7, 9, 11]\nB = [\"Hà\", \"Bình\", \"Ngọc\", \"Anh\"]\nC = [9.5, 8.0, 10, 7.2]", output: "3 mảng: số nguyên, chuỗi, số thực" },
      { t: "note", text: "Các phần tử trong một mảng nên CÙNG KIỂU để dễ xử lý (mảng điểm thì toàn số, mảng tên thì toàn chữ)." },
      { t: "h", text: "2) Mảng hai chiều = bảng (list lồng list)" },
      { t: "text", text: "Khi dữ liệu có dạng **bảng** (có hàng và cột) như bảng điểm, ma trận, bàn cờ — ta dùng `mảng hai chiều`: một danh sách mà mỗi phần tử lại là một danh sách (một hàng)." },
      { t: "code", code: "M = [[1, 2, 3],\n     [4, 5, 6]]\nprint(M[0][2])   # hàng 0, cột 2 -> 3\nprint(M[1][0])   # hàng 1, cột 0 -> 4" },
      { t: "example", text: "Ví dụ khảo sát ý kiến trong SGK (mỗi bạn 4 mức: 2/1/0/-1) cũng là một bảng số như vậy.", output: "M[i][j] = giá trị ở hàng i, cột j" },
      { t: "note", text: "Nhớ: mảng 1 chiều dùng MỘT chỉ số `A[i]`; mảng 2 chiều dùng HAI chỉ số `M[i][j]` (hàng trước, cột sau). Tất cả đều đếm từ 0." },
      { t: "h", text: "Vì sao quan trọng?" },
      { t: "text", text: "Gói dữ liệu vào mảng giúp ta **duyệt bằng vòng lặp** để tính tổng, đếm, tìm kiếm, sắp xếp... — đó là nền tảng cho toàn bộ các bài thuật toán phía sau (tìm kiếm, sắp xếp)." },
    ],
    keypoints: [
      "Mảng một chiều = list: dãy phần tử CÙNG KIỂU, chỉ số từ 0, truy cập A[i].",
      "Mảng hai chiều = list lồng list (bảng): truy cập M[i][j] (hàng i, cột j).",
      "len() cho số phần tử; duyệt mảng bằng vòng lặp for.",
      "Mảng là nền tảng cho các thuật toán tìm kiếm, sắp xếp về sau.",
    ],
    quiz: ["F-mc-12", "F-tf-3", "F-mc-56", "F-mc-57", "F-mc-58", "F-mc-59", "F-tf-11"],
  });

  /* Bài thực hành tự code cho Bài 17 (nếu module bài tập đã nạp) */
  if (typeof EXERCISES !== "undefined") {
    EXERCISES.S17 = [
      { type: "code", prompt: "Cho mảng `A = [5, 10, 15, 20]`. In ra phần tử ở **chỉ số 2**.",
        starter: "A = [5, 10, 15, 20]\n# in A[2]\n", expected: "15",
        hint: "Chỉ số đếm từ 0, nên A[2] là phần tử thứ ba.", solution: "A = [5, 10, 15, 20]\nprint(A[2])" },
      { type: "code", prompt: "Cho bảng `M = [[1, 2], [3, 4]]`. In ra phần tử ở **hàng 1, cột 0**.",
        starter: "M = [[1, 2], [3, 4]]\n# in M[1][0]\n", expected: "3",
        hint: "M[1] là hàng thứ hai [3, 4]; lấy cột 0.", solution: "M = [[1, 2], [3, 4]]\nprint(M[1][0])" },
    ];
  }
})();
