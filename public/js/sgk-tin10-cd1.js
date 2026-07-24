/* ============================================================================
 *  SGK TIN 10 - Chủ đề 1, Bài 4-7 (soạn song song bởi sub-agent, đã duyệt).
 *  + 3 câu hỏi lôgic cho Bài 5. Nạp sau sgk-lessons.js.
 * ==========================================================================*/
(function () {
  // --- Câu hỏi lôgic (Bài 5) ---
  if (typeof QUESTION_BANK !== "undefined") {
    QUESTION_BANK.push(
      { id: "A-mc-16", type: "mc", topic: "A", grade: 10, level: "medium",
        question: "Phép lôgic p AND q (\"p VÀ q\") cho kết quả ĐÚNG khi nào?",
        options: ["Khi CẢ p và q đều đúng", "Khi ít nhất một cái đúng", "Khi cả hai đều sai", "Luôn luôn đúng"], answer: 0,
        explain: "AND (VÀ) chỉ đúng khi CẢ HAI vế cùng đúng; chỉ cần một vế sai là kết quả sai." },
      { id: "A-mc-17", type: "mc", topic: "A", grade: 10, level: "easy",
        question: "Kết quả của phép NOT (phủ định) với giá trị Đúng (True) là gì?",
        options: ["Đúng (True)", "Sai (False)", "Vừa đúng vừa sai", "Không xác định"], answer: 1,
        explain: "NOT đảo ngược giá trị: NOT Đúng = Sai, NOT Sai = Đúng." },
      { id: "A-tf-3", type: "tf", topic: "A", grade: 10, level: "medium",
        question: "Xét các phát biểu về các phép toán lôgic (AND, OR, XOR, NOT):",
        statements: [
          { text: "p AND q chỉ đúng khi CẢ p và q đều đúng", correct: true },
          { text: "p OR q đúng khi ít nhất một trong p, q đúng", correct: true },
          { text: "NOT đảo ngược giá trị (đúng thành sai, sai thành đúng)", correct: true },
          { text: "p XOR q đúng khi p và q có giá trị GIỐNG nhau", correct: false }],
        explain: "(a)(b)(c) đúng. (d) SAI vì XOR đúng khi hai giá trị KHÁC nhau (một đúng, một sai)." }
    );
  }

  if (typeof LESSONS === "undefined") return;
  var META = {
    "S10-04": { stage: 10, order: 4, topic: "A", grade: 10, minutes: 14,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 4, trang 20–23",
        images: ["sach/pages/tin10/p021.png", "sach/pages/tin10/p022.png", "sach/pages/tin10/p023.png", "sach/pages/tin10/p024.png"] },
      quiz: ["A-mc-2", "A-sa-1", "A-sa-3", "A-mc-8", "A-mc-1"] },
    "S10-05": { stage: 10, order: 5, topic: "A", grade: 10, minutes: 13,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 5, trang 24–27",
        images: ["sach/pages/tin10/p025.png", "sach/pages/tin10/p026.png", "sach/pages/tin10/p027.png", "sach/pages/tin10/p028.png"] },
      quiz: ["A-mc-16", "A-mc-17", "A-tf-3", "F-mc-6"] },
    "S10-06": { stage: 10, order: 6, topic: "A", grade: 10, minutes: 13,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 6, trang 28–32",
        images: ["sach/pages/tin10/p029.png", "sach/pages/tin10/p030.png", "sach/pages/tin10/p031.png", "sach/pages/tin10/p032.png", "sach/pages/tin10/p033.png"] },
      quiz: ["A-mc-10", "A-mc-11", "A-mc-13", "A-sa-4", "A-tf-2"] },
    "S10-07": { stage: 10, order: 7, topic: "A", grade: 10, minutes: 12,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 7, trang 33–37",
        images: ["sach/pages/tin10/p034.png", "sach/pages/tin10/p035.png", "sach/pages/tin10/p036.png", "sach/pages/tin10/p037.png", "sach/pages/tin10/p038.png"] },
      quiz: ["A-mc-15", "A-mc-3", "C-mc-9"] },
  };

  var CONTENT = {
    "S10-04": {
      "title": "Bài 4. Hệ nhị phân và dữ liệu số nguyên",
      "intro": "Máy tính bên trong chỉ biết đúng hai chữ số: `0` và `1`. Bài này chỉ cho em cách viết mọi con số chỉ bằng 0 và 1 (gọi là **hệ nhị phân**), và cách máy tính dùng chúng để cộng, để nhân.",
      "sections": [
        { "t": "story", "text": "Em hãy tưởng tượng mình có nhiều **túi kẹo**, mỗi túi to gấp đôi túi trước: một túi `1` cái, một túi `2` cái, một túi `4` cái, một túi `8` cái, rồi một túi `16` cái...\n\nHôm nay em muốn lấy **đúng 19 cái kẹo**. Em thử nhé: lấy túi `16`, thêm túi `2`, thêm túi `1`. Cộng lại: 16 + 2 + 1 = 19. Đúng rồi!\n\nĐiều thú vị là: với mỗi túi, em chỉ có **hai lựa chọn** thôi — **LẤY** hay **KHÔNG LẤY**. Ta ghi 'LẤY' là `1`, 'KHÔNG LẤY' là `0`. Viết lần lượt các lựa chọn đó ra, em được một dãy toàn số 0 và 1. Dãy đó gọi là **số nhị phân**.\n\nMáy tính cũng nhớ các con số y hệt như vậy: chỉ bằng 0 và 1. Cả bài học này xoay quanh trò 'lấy túi kẹo' đó thôi!" },
        { "t": "h", "text": "1. Số em viết hằng ngày là một phép cộng bí mật" },
        { "t": "text", "text": "Bình thường em đếm bằng **mười** chữ số: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Cách đếm này gọi là **hệ thập phân** ('thập' nghĩa là mười).\n\nMỗi con số em viết thật ra là một phép cộng giấu bên trong. Nhìn số **513**: chữ số 5 đứng ở hàng trăm nên đáng giá 500, chữ số 1 ở hàng chục đáng giá 10, chữ số 3 ở hàng đơn vị đáng giá 3." },
        { "t": "example", "text": "Viết đầy đủ ra, số 513 chính là:", "code": "513 = 5 × 100 + 1 × 10 + 3 × 1", "output": "Mỗi hàng lớn gấp 10 lần hàng bên phải nó: 1 → 10 → 100..." },
        { "t": "h", "text": "2. Đổi sang 'kiểu máy tính': gói theo 2" },
        { "t": "text", "text": "Máy tính không thích gói theo 10. Nó thích **gói theo 2**: 1, 2, 4, 8, 16, 32... (mỗi số gấp đôi số trước — đúng như mấy túi kẹo lúc nãy).\n\nVới cách gói theo 2, mỗi 'túi' chỉ được **lấy 1 lần hoặc không lấy**. Nên con số đứng trước mỗi túi chỉ có thể là `1` (lấy) hoặc `0` (không lấy)." },
        { "t": "example", "text": "Thử với số 19. Ta thấy 19 = túi 16 + túi 2 + túi 1. Viết cho đủ tất cả các túi (16, 8, 4, 2, 1):", "code": "19 = 1×16 + 0×8 + 0×4 + 1×2 + 1×1", "output": "Lấy dãy 'lấy/không lấy' theo thứ tự: 1 0 0 1 1. Vậy số 19 viết trong hệ nhị phân là 10011." },
        { "t": "example", "text": "Thử thêm số 13 nhé: 13 = túi 8 + túi 4 + túi 1.", "code": "13 = 1×8 + 1×4 + 0×2 + 1×1", "output": "Vậy 13 viết trong hệ nhị phân là 1101." },
        { "t": "list", "text": "Hệ nhị phân (còn gọi là hệ đếm cơ số 2) có mấy điểm cần nhớ:", "items": [
          "Chỉ dùng **hai** chữ số: `0` và `1`. Chúng được gọi là các **chữ số nhị phân**.",
          "Mọi con số đều có thể viết thành một **dãy các chữ số 0 và 1**.",
          "Đi từ phải sang trái, mỗi hàng **gấp đôi** hàng bên phải nó: 1, 2, 4, 8, 16... Cho nên chữ số `1` đứng càng xa về bên trái thì càng đáng giá nhiều." ] },
        { "t": "note", "text": "Để khỏi nhầm số nào viết trong hệ nào, người ta ghi **cơ số nhỏ ở phía dưới bên phải**. Ví dụ `19₁₀` nghĩa là 'số 19 trong hệ thập phân (cơ số 10)', còn `10011₂` nghĩa là 'số đó trong hệ nhị phân (cơ số 2)'. Vậy 19₁₀ = 10011₂ — cùng một số, hai cách viết." },
        { "t": "h", "text": "3. Mẹo nhanh để đổi số sang nhị phân: chia 2 lấy dư" },
        { "t": "text", "text": "Tách túi kẹo hơi lâu. Có một mẹo nhanh hơn: cứ **chia cho 2 rồi ghi lại số dư**, chia cho tới khi được 0 thì dừng. Số dư mỗi lần chỉ có thể là 0 hoặc 1." },
        { "t": "example", "text": "Đổi số 19. Ta chia 19 cho 2 liên tục:", "code": "19 : 2 = 9  dư 1\n 9 : 2 = 4  dư 1\n 4 : 2 = 2  dư 0\n 2 : 2 = 1  dư 0\n 1 : 2 = 0  dư 1", "output": "Đọc các số dư theo chiều từ DƯỚI lên trên: 1 - 0 - 0 - 1 - 1. Vậy 19₁₀ = 10011₂." },
        { "t": "h", "text": "Đổi ngược lại: từ nhị phân về số quen thuộc" },
        { "t": "text", "text": "Muốn đọc một dãy 0 và 1 ra số bình thường, em chỉ việc **cộng giá trị các túi có chữ số 1**." },
        { "t": "example", "text": "Đọc 1101 ra số thập phân:", "code": "1101 = 1×8 + 1×4 + 0×2 + 1×1", "output": "= 8 + 4 + 0 + 1 = 13. Vậy 1101₂ = 13₁₀." },
        { "t": "h", "text": "4. Máy tính cất số vào bộ nhớ như thế nào?" },
        { "t": "note", "text": "Máy tính có hai cách biểu diễn số là **dấu phẩy tĩnh** và **dấu phẩy động**. Cách dấu phẩy động dùng cho các số rất lớn, rất nhỏ, hoặc số có phần lẻ (thập phân). Ở bài này ta chỉ học biểu diễn **số nguyên** cho đơn giản." },
        { "t": "text", "text": "Trong máy tính, các số được cất trong những 'ô nhớ'. Mỗi ô nhớ chứa **8 chữ số nhị phân**, gọi là **1 byte** (mỗi chữ số 0 hoặc 1 còn được gọi là **1 bit**, nên 1 byte = 8 bit).\n\nNếu số nhỏ, viết ra chưa đủ 8 chữ số thì ta **thêm số 0 vào bên trái** cho đủ 8. Số càng lớn thì càng cần nhiều byte." },
        { "t": "example", "text": "Số 19 = 10011₂ mới có 5 chữ số. Thêm ba số 0 bên trái cho đủ 8:", "code": "19  →  00010011   (vừa đúng 1 byte)", "output": "Số 620 lớn hơn, viết ra là 1001101100₂ (10 chữ số). Một byte (8 chữ số) không đủ chứa, phải dùng 2 byte." },
        { "t": "text", "text": "Còn số **âm** (số có dấu trừ) thì sao? Máy tính dành **chữ số ngoài cùng bên trái để ghi dấu**: ghi `0` là dấu cộng (+), ghi `1` là dấu trừ (−).\n\nCó ba kiểu ghi số âm: **mã thuận** (mã dấu - lượng), **mã bù 1** (mã đảo) và **mã bù 2**. Với số **dương** thì cả ba kiểu ghi giống hệt nhau; chỉ khi ghi số **âm** ba kiểu mới khác nhau." },
        { "t": "h", "text": "5. Cộng và nhân bằng 0 và 1" },
        { "t": "text", "text": "Máy tính phải tự cộng, tự nhân ngay trên các số 0 và 1. May quá, cách làm **giống hệt** phép cộng, phép nhân em học ở trường — cũng đặt tính thẳng hàng rồi tính từ **phải sang trái**. Chỉ cần nhớ vài quy tắc nhỏ." },
        { "t": "example", "text": "Bảng cộng và nhân hai chữ số nhị phân. Điều đặc biệt duy nhất cần nhớ: **1 + 1 = 10** (chứ không phải 2!).", "code": "0 + 0 = 0        0 × 0 = 0\n0 + 1 = 1        0 × 1 = 0\n1 + 0 = 1        1 × 0 = 0\n1 + 1 = 10       1 × 1 = 1", "output": "Vì sao 1 + 1 = 10? Vì hệ nhị phân không có chữ số '2'. Giống hệ thập phân đếm tới 9 là phải 'nhớ 1' thành 10; ở đây đếm tới 1 là phải nhớ 1 ngay." },
        { "t": "example", "text": "Phép cộng: cộng từ phải sang trái; khi được `10` thì viết 0 nhớ 1. Ví dụ 11011 + 11010:", "code": "   1 1 0 1 1\n + 1 1 0 1 0\n -----------\n 1 1 0 1 0 1", "output": "Kết quả: 11011 + 11010 = 110101." },
        { "t": "example", "text": "Phép nhân: nhân với từng chữ số rồi cộng lại (như ở trường). Ví dụ 1101 × 101:", "code": "     1 1 0 1\n   ×   1 0 1\n   ---------\n     1 1 0 1\n   0 0 0 0\n 1 1 0 1\n -----------\n 1 0 0 0 0 0 1", "output": "Kết quả: 1101 × 101 = 1000001." },
        { "t": "note", "text": "Vậy khi em bấm '125 + 17' trên máy tính, bên trong nó làm **3 bước**: (1) **Mã hoá** — đổi các số sang nhị phân; (2) **Tính** — cộng (hoặc nhân) trên hệ nhị phân; (3) **Giải mã** — đổi kết quả trở lại thập phân để hiện ra. Vì thế: làm toán trong máy tính chính là **một ứng dụng của hệ nhị phân**." }
      ],
      "keypoints": [
        "**Hệ nhị phân** chỉ dùng hai chữ số `0` và `1`; mọi số đều viết được bằng 0 và 1, nhờ vậy máy tính lưu được số.",
        "Đổi **thập phân → nhị phân**: chia liên tiếp cho 2, ghi số dư, rồi đọc các số dư từ dưới lên.",
        "Đổi **nhị phân → thập phân**: cộng giá trị các hàng có chữ số 1 (các hàng là 1, 2, 4, 8, 16...).",
        "Máy tính cất số nguyên theo từng **byte** (1 byte = 8 bit); số âm ghi bằng **mã thuận, mã bù 1, mã bù 2**, chữ số đầu là dấu (0 là +, 1 là −).",
        "Cộng và nhân nhị phân làm **giống hệt** thập phân, chỉ cần nhớ **1 + 1 = 10**.",
        "Máy tính tính toán theo 3 bước **mã hoá → tính trên nhị phân → giải mã**."
      ]
    },
    "S10-05": {
      "title": "Bài 5. Dữ liệu lôgic",
      "intro": "Bài này dạy em về **dữ liệu lôgic** — những thứ chỉ có đúng hai kết quả: **đúng** hoặc **sai**. Em sẽ biết cách máy tính ghi lại chuyện đúng/sai bằng số `1` và `0`, và làm quen với 4 phép toán lôgic là `AND`, `OR`, `XOR`, `NOT`.",
      "sections": [
        { "t": "story", "text": "Em hãy tưởng tượng cô giáo hỏi cả lớp: «Hôm nay trời có mưa không?». Câu trả lời chỉ có thể là «Có» hoặc «Không», chứ không có câu trả lời lưng chừng ở giữa. Cũng giống cái công tắc đèn ở nhà: chỉ có **bật** (đèn sáng) hoặc **tắt** (đèn tối). Những thứ chỉ có đúng hai kết quả ngược nhau như vậy, trong Tin học gọi là **dữ liệu lôgic**. Máy tính rất thích kiểu dữ liệu này, vì nó chỉ phải nhớ một trong hai điều: **đúng** hay **sai**." },
        { "t": "h", "text": "1) Mệnh đề — câu nói đúng hoặc sai" },
        { "t": "text", "text": "**Mệnh đề** là một câu khẳng định mà ta biết chắc nó **đúng** hoặc **sai** (chỉ một trong hai, không thể vừa đúng vừa sai)." },
        { "t": "list", "items": [
          "Câu «Hà Nội là Thủ đô của Việt Nam» là một mệnh đề **đúng**.",
          "Câu «9 là số nguyên tố» là một mệnh đề **sai** (vì 9 = 3 × 3).",
          "Ngay cả phép so sánh cũng là mệnh đề: «3 > 5» là mệnh đề **sai**, «2 × 3 = 6» là mệnh đề **đúng**." ] },
        { "t": "h", "text": "Giá trị chân lí: viết gọn bằng 1 và 0" },
        { "t": "text", "text": "Kết quả **«Đúng»** hay **«Sai»** của một mệnh đề gọi là **giá trị chân lí** (giá trị lôgic). Người ta quy ước: **Đúng** = `1`, **Sai** = `0`. Vậy từ giờ thấy `1` là hiểu «đúng», thấy `0` là «sai»." },
        { "t": "example", "text": "Bạn dẫn thời tiết nói: «Ngày mai trời lạnh **VÀ** có mưa.» Khi nào đúng?", "code": "lạnh (đúng)  và  mưa (đúng)   → ĐÚNG  ✔\nlạnh (đúng)  và  không mưa     → SAI\nkhông lạnh   và  mưa           → SAI\nkhông lạnh   và  không mưa     → SAI", "output": "Chỉ khi CẢ HAI điều đều đúng thì cả câu mới đúng. Chữ «VÀ» chính là một phép toán lôgic!" },
        { "t": "h", "text": "2) Bốn phép toán lôgic quan trọng" },
        { "t": "list", "text": "Có 4 cách ghép mệnh đề (4 phép toán lôgic) quan trọng nhất, kèm ví dụ đời thường:", "items": [
          "`AND` (phép «VÀ»): `p AND q` chỉ **đúng** khi **cả hai** cùng đúng. Ví dụ: «Được đi chơi khi làm xong bài tập VÀ dọn xong phòng» — phải làm **cả hai**.",
          "`OR` (phép «HOẶC»): **đúng** khi **ít nhất một** đúng; chỉ **sai** khi cả hai cùng sai. Ví dụ: «Ăn sáng bằng bánh mì HOẶC phở» — chỉ cần một món.",
          "`XOR` (cộng loại trừ): **đúng** khi hai bên **khác nhau**; **sai** khi giống nhau. Ví dụ: «Chọn bút chì HAY bút mực, chỉ một cái thôi».",
          "`NOT` (phép «KHÔNG», phủ định): **đổi ngược** giá trị. p đúng thì `NOT p` sai, và ngược lại." ] },
        { "t": "text", "text": "Người ta ghi kết quả 4 phép vào một **bảng chân lí**. Cột p, q là hai giá trị đưa vào, các cột sau là kết quả:" },
        { "t": "code", "code": " p  q | p AND q | p OR q | p XOR q | NOT p\n----------------------------------------------\n 1  1 |    1    |   1    |    0    |   0\n 1  0 |    0    |   1    |    1    |   0\n 0  1 |    0    |   1    |    1    |   1\n 0  0 |    0    |   0    |    0    |   1" },
        { "t": "note", "text": "**Cách nhớ nhanh:** `AND` = phải **cả hai** cùng đúng. `OR` = chỉ cần **một cái** đúng. `XOR` = hai bên **khác nhau** thì đúng. `NOT` = **đổi ngược**." },
        { "t": "h", "text": "Biểu thức lôgic và thứ tự thực hiện" },
        { "t": "list", "text": "Nối nhiều đại lượng lôgic bằng các phép toán ta được **biểu thức lôgic**, ví dụ `p AND (q OR r)`. Thứ tự làm:", "items": [
          "Phần trong **dấu ngoặc** `( )` làm **trước tiên**.",
          "Nếu không có ngoặc thì làm `NOT` (phủ định) **trước**.",
          "`AND` và `OR` **ngang hàng**, làm lần lượt **từ trái sang phải**." ] },
        { "t": "h", "text": "3) Biểu diễn dữ liệu lôgic trong máy tính" },
        { "t": "text", "text": "Rất nhiều thứ quanh ta chỉ có **hai trạng thái đối lập**: sáng/tối, bật/tắt, có/không... đều coi là đúng/sai. Máy tính chỉ cần **1 bit** (ô nhớ chứa `0` hoặc `1`) là đủ ghi dữ liệu lôgic: `1` = **Đúng**, `0` = **Sai**." },
        { "t": "list", "text": "Mỗi ngôn ngữ lập trình có cách riêng:", "items": [
          "**Python** coi số `0` là «Sai», còn **bất kì số nào khác 0** đều là «Đúng».",
          "Tiếng Anh gọi đúng là **True**, sai là **False**." ] },
        { "t": "note", "text": "Miễn là tạo ra được **hai trạng thái đối lập** thì cách nào cũng biểu diễn được dữ liệu lôgic." }
      ],
      "keypoints": [
        "**Mệnh đề** là câu chỉ có thể **đúng** hoặc **sai**; kết quả gọi là **giá trị lôgic**, viết gọn `1` (đúng), `0` (sai).",
        "`p AND q` chỉ **đúng** khi **cả** p và q đều đúng.",
        "`p OR q` **đúng** khi **ít nhất một** đúng (chỉ sai khi cả hai cùng sai).",
        "`p XOR q` chỉ **đúng** khi p và q **khác nhau**; `NOT p` **đổi ngược** giá trị.",
        "Thứ tự: **ngoặc** trước → `NOT` → rồi `AND`, `OR` (ngang hàng, trái sang phải).",
        "Máy tính chỉ cần **1 bit** để lưu dữ liệu lôgic (`1` = đúng, `0` = sai)."
      ]
    },
    "S10-06": {
      "title": "Bài 6. Dữ liệu âm thanh và hình ảnh",
      "intro": "Tai em nghe được **tiếng**, mắt em nhìn được **ảnh**. Nhưng máy tính chỉ hiểu **số**. Bài này chỉ cho em cách máy **biến âm thanh và hình ảnh thành các con số** để cất giữ và mở lại khi cần.",
      "sections": [
        { "t": "story", "text": "Em muốn gửi tiếng chim hót cho một người bạn ở xa. Em không thể bỏ con chim vào phong bì được! Cách duy nhất là **ghi lại** tiếng hót thành thứ mà máy hiểu, rồi để máy phát lại. Mà máy tính chỉ biết đọc số `0` và `1`. Cho nên nó phải **đổi tiếng thành số**. Việc đổi âm thanh (hay hình ảnh) thành số gọi là **số hoá**." },
        { "t": "h", "text": "1. Âm thanh là những con sóng" },
        { "t": "story", "text": "Em thả một hòn sỏi xuống mặt hồ. Nước gợn thành những vòng sóng lan ra xa. **Âm thanh cũng đi bằng sóng** giống vậy, gọi là **sóng âm**. Khi em nói, không khí rung thành sóng bay tới tai người khác." },
        { "t": "text", "text": "Nếu vẽ sóng âm ra giấy, ta được một đường **lượn lên lượn xuống** (đường **hình sin**). Chiều ngang là **thời gian**, chiều dọc là **biên độ** (tiếng to hay nhỏ). Đường chạy **liền một mạch** này gọi là **âm thanh tương tự (analog)**." },
        { "t": "text", "text": "Máy tính không hiểu đường vẽ liền đó, chỉ hiểu **số**. Nên ta phải đổi đường sóng thành **một dãy số** — gọi là **số hoá âm thanh**, kết quả là **âm thanh số**." },
        { "t": "h", "text": "Đổi tiếng thành số theo 3 bước (cách PCM)" },
        { "t": "list", "text": "Cách cơ bản nhất tên là **PCM**. Việc làm gồm **3 bước**:", "items": [
          "**Bước 1 — Lấy mẫu.** Cứ sau một khoảng thời gian **bằng nhau**, ta **đo** xem lúc đó sóng cao bao nhiêu (đo biên độ). Khoảng thời gian giữa hai lần đo gọi là **chu kì lấy mẫu**.",
          "**Bước 2 — Chọn thước để chấm điểm.** Dùng một cái **thước có nhiều vạch đều nhau**, ví dụ `256` vạch (số 0 đến 255). Mỗi lần đo, sóng cao tới đâu thì ghi con số ở vạch **gần nhất**. 256 vạch vừa vặn **1 byte**.",
          "**Bước 3 — Ghi lại thành dãy số.** Ghép tất cả con số đo được thành một dãy — đó **chính là âm thanh đã số hoá**." ] },
        { "t": "note", "text": "**Muốn tiếng giống thật hơn?** Đo dày hơn (chu kì nhỏ lại) và dùng thước nhiều vạch hơn. Khi đó tiếng **trung thực** hơn, nhưng dãy số **dài ra**, tốn nhiều chỗ chứa. Càng hay thì càng nặng!" },
        { "t": "list", "text": "Vài từ mới sẽ gặp:", "items": [
          "**ADC**: mạch đổi tiếng thật thành số.",
          "**Tốc độ bit** (bit-rate): số bit dùng để ghi **một giây** âm thanh; càng lớn tiếng càng nét.",
          "**DAC**: mạch làm ngược lại, đổi số thành tiếng để phát ra **loa** hoặc **tai nghe**." ] },
        { "t": "list", "text": "Các kiểu tệp lưu âm thanh (vì tệp PCM rất to nên cần làm nhỏ lại):", "items": [
          "**Nén không mất gì (lossless):** như gấp gọn cái chăn cho vừa tủ — tệp nhỏ mà chất lượng y như cũ.",
          "**Bỏ bớt cho nhẹ:** kiểu **Mp3** nhỏ hơn tệp `wav` khoảng **10 lần** mà nghe vẫn ổn." ] },
        { "t": "h", "text": "2. Ảnh là hàng ngàn ô màu tí hon" },
        { "t": "story", "text": "Em ghé mắt nhìn thật sát vào màn hình ti vi, sẽ thấy ảnh không **liền** một khối mà xếp bằng **rất nhiều chấm nhỏ xíu** — giống bức tranh ghép từ hàng ngàn viên **gạch màu** bé tẹo. Mỗi viên gạch tí hon đó là một **điểm ảnh**." },
        { "t": "text", "text": "Mỗi điểm ảnh **trộn** từ **ba màu gốc**: **Đỏ** (`Red`), **Xanh lá** (`Green`), **Xanh dương** (`Blue`). Trộn ba màu này theo các liều lượng khác nhau ra được **mọi màu**. Bộ ba này gọi là hệ màu **`RGB`**." },
        { "t": "text", "text": "**Điểm ảnh** tiếng Anh là **`pixel`**. Ảnh lưu bằng cách ghi màu **từng điểm ảnh** gọi là **ảnh bitmap**. Số bit dùng cho một điểm ảnh gọi là **độ sâu màu** — **càng lớn thì màu càng phong phú, ảnh càng mịn**." },
        { "t": "list", "text": "Ảnh màu hay dùng độ sâu **24 bit**, chia đều cho ba màu, mỗi màu **8 bit** = **256 mức** (0 đến 255). Ví dụ:", "items": [
          "Màu **trắng**: `(255, 255, 255)` — ba màu bật hết cỡ.",
          "Màu **đỏ**: `(255, 0, 0)`; **xanh lá**: `(0, 255, 0)`; **xanh dương**: `(0, 0, 255)`.",
          "Màu **đen**: `(0, 0, 0)` — tắt cả ba đèn." ] },
        { "t": "note", "text": "256 × 256 × 256 ra khoảng **16,7 triệu** màu — nhiều hơn cả số màu mắt người phân biệt nổi! Ngoài ra còn **ảnh xám** (256 mức, 8 bit) và **ảnh đen trắng** (chỉ cần 1 bit)." },
        { "t": "list", "text": "Vài kiểu tệp ảnh hay gặp:", "items": [
          "**`.bmp`**: ảnh bitmap gốc, rất tốn bộ nhớ.",
          "**`.jpeg`**: nén và bỏ bớt một chút, tệp **khá nhỏ**, gửi qua mạng nhanh.",
          "**`.png`**: nén **không mất** chất lượng, lại có thể để **nền trong suốt**." ] },
        { "t": "note", "text": "Tóm lại: máy biến **tiếng** thành **dãy số** (đo sóng âm nhiều lần), và biến **ảnh** thành **màu của từng điểm ảnh** (ba màu gốc RGB)." }
      ],
      "keypoints": [
        "**Số hoá âm thanh**: sau mỗi **chu kì lấy mẫu**, đo biên độ sóng âm rồi ghi thành số. Chu kì càng nhỏ, thang đo càng chi tiết thì càng **trung thực** nhưng tốn **nhiều chỗ** hơn.",
        "Định dạng âm thanh: **nén không mất mát** hoặc **giảm chất lượng** một chút (ví dụ Mp3).",
        "**Ảnh màu** dùng hệ **RGB**: 24 bit/điểm ảnh, mỗi màu gốc 8 bit (0–255) — khoảng **16,7 triệu màu**.",
        "**Ảnh xám** 8 bit (256 mức); **ảnh đen trắng** chỉ 1 bit.",
        "Nhiều định dạng tệp ảnh (`.bmp`, `.jpeg`, `.png`) khác nhau về nặng nhẹ và hiệu ứng."
      ]
    },
    "S10-07": {
      "title": "Bài 7. Thực hành sử dụng thiết bị số thông dụng",
      "intro": "Bài **thực hành** này dạy em dùng các thiết bị số hay gặp mỗi ngày, như **điện thoại thông minh** và **máy tính bảng**: chúng làm được gì, và cách mở ứng dụng, xem ảnh, xoá ảnh.",
      "sections": [
        { "t": "story", "text": "Em hãy tưởng tượng một chiếc hộp thần kì nhỏ xíu, bỏ vừa túi áo. Trong đó có: một cái **đồng hồ**, một quyển **lịch**, một cuốn **sổ tay**, một cái **máy tính bỏ túi**, một cái **máy ảnh**, và cả một chiếc **điện thoại**! Chiếc hộp thần kì ấy chính là điện thoại thông minh mà bố mẹ em vẫn dùng. Cùng khám phá nhé!" },
        { "t": "h", "text": "1. Trợ thủ số cá nhân là gì?" },
        { "t": "text", "text": "Ngày xưa người ta phải mang nhiều thứ: đồng hồ xem giờ, sổ ghi việc, danh bạ lưu số. Vừa nặng vừa dễ quên. Thế là người ta gộp tất cả vào một thiết bị nhỏ gọn, gọi là **trợ thủ số cá nhân** (tiếng Anh viết tắt **PDA**). Chữ *trợ thủ* nghĩa là **người giúp việc** — một người giúp việc tí hon bằng máy." },
        { "t": "list", "text": "Lúc mới ra đời, nó làm được vài việc đơn giản:", "items": [
          "**Quyển lịch** ghi việc theo ngày; **đồng hồ** xem giờ và báo thức.",
          "**Sổ danh bạ** lưu tên, số điện thoại; **danh sách việc cần làm**.",
          "**Sổ ghi nhớ** và **máy tính bỏ túi**." ] },
        { "t": "list", "text": "Bây giờ nó còn biết làm thêm rất nhiều việc:", "items": [
          "Nghe nhạc, ghi âm, xem phim; gọi điện; chụp ảnh, quay phim.",
          "Tìm đường khi bị lạc; điều khiển thiết bị từ xa.",
          "Cắm **USB**, gắn **thẻ nhớ**, nối **bluetooth**, **wifi** để liên lạc và vào Internet." ] },
        { "t": "text", "text": "Vài loại trợ thủ số cá nhân quen thuộc: **điện thoại thông minh** (smartphone), **máy tính bảng** (tablet), **đồng hồ thông minh** (smartwatch), **máy đọc sách**. Phần lớn chạy một trong hai **hệ điều hành** (giống bộ não điều khiển cả máy): **iOS** (của Apple) và **Android** (của Google)." },
        { "t": "note", "text": "**Trợ thủ số cá nhân** (PDA) là thiết bị số gộp nhiều chức năng và ứng dụng hữu ích; đặc biệt là **nhỏ gọn** và **kết nối được với mạng**." },
        { "t": "h", "text": "2. Thực hành với điện thoại thông minh" },
        { "t": "list", "text": "Việc 1 — Tìm các nút bấm. Nhìn hai bên cạnh máy, em sẽ thấy:", "items": [
          "**Nút khoá:** bấm để bật máy, hoặc tắt màn hình cho đỡ tốn pin.",
          "**Nút tăng/giảm âm lượng:** cho tiếng to lên hay nhỏ đi." ] },
        { "t": "list", "text": "Việc 2 — Làm quen màn hình chính. Trên đó có:", "items": [
          "**Thanh trạng thái** (trên cùng): cho biết có nối mạng không, mấy giờ, pin còn bao nhiêu.",
          "**Biểu tượng ứng dụng:** mỗi hình nhỏ là một **ứng dụng (app)**; bấm vào để mở. Vuốt ngang để xem các trang.",
          "**Thanh truy cập nhanh** (gần dưới): chứa vài app hay dùng nhất.",
          "**Thanh điều hướng** (dưới cùng, máy Android): có nút **Quay lại** và nút **Tổng quan** (xem các app đang mở)." ] },
        { "t": "list", "text": "Việc 3 — Khám phá ứng dụng. Điện thoại nào cũng làm được:", "items": [
          "**Gọi điện, nhắn tin, quản lí danh bạ.**",
          "**Chụp ảnh** và xem kho ảnh; **trình duyệt** vào Internet.",
          "**Email, Lịch, Báo thức, Máy tính**; **chợ phần mềm** để tải thêm app (Zoom, Google Meet để học; Google Drive để lưu đám mây)." ] },
        { "t": "note", "text": "**Lưu trữ đám mây** là cất ảnh, bài vở lên mạng chứ không cất trong máy. Đổi máy khác vẫn lấy lại được — như gửi đồ vào một cái tủ ở trên trời." },
        { "t": "list", "text": "Việc 4 — Tìm, xem và xoá ảnh. Mở ứng dụng **quản lí tệp** (tên có thể là File Manager, My Files, Files...):", "items": [
          "Vào **bộ nhớ trong** → thư mục `DCIM` → `Camera` (nơi chứa ảnh chụp).",
          "**Chạm** vào ảnh để xem.",
          "**Chạm và giữ** trên ảnh để hiện các nút: Di chuyển, Sao chép, Chia sẻ, **Xoá**.",
          "Bấm **Xoá** nếu muốn bỏ ảnh đó đi." ] },
        { "t": "note", "text": "Nhớ nhé: **xoá** là bỏ ảnh đi luôn. Hãy nhìn kĩ trước khi xoá, kẻo lỡ tay mất tấm ảnh mình thích." }
      ],
      "keypoints": [
        "**Trợ thủ số cá nhân** (PDA) là thiết bị số nhỏ gọn, gộp nhiều chức năng, kết nối được với mạng.",
        "Điện thoại thông minh, máy tính bảng, đồng hồ thông minh, máy đọc sách... đều là trợ thủ số cá nhân.",
        "Hai hệ điều hành phổ biến: **iOS** (Apple) và **Android** (Google).",
        "Màn hình chính gồm: thanh trạng thái, biểu tượng ứng dụng, thanh truy cập nhanh, thanh điều hướng.",
        "**Ứng dụng quản lí tệp** giúp mở/xem/sao chép/xoá tệp; ảnh chụp thường ở thư mục `DCIM/Camera`."
      ]
    }
  };

  ["S10-04", "S10-05", "S10-06", "S10-07"].forEach(function (id) {
    LESSONS.push(Object.assign({ id: id }, META[id], CONTENT[id]));
  });
})();
