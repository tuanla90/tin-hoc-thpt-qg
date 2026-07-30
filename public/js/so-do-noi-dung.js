/* ============================================================================
 *  NỘI DUNG SƠ ĐỒ THEO BÀI
 *
 *  Nạp SAU js/so-do.js. Năm kiểu và dạng dữ liệu tương ứng:
 *
 *    { kieu:"luong", ten, mo, ghi, mau, muc:[{t,p}, ...] }
 *    { kieu:"vong",  ... , quayLai }                     — như luong, thêm mũi quay về
 *    { kieu:"tang",  ... , tren, duoi, muc:[{t,p}, ...] } — muc[0] nằm TRÊN CÙNG
 *    { kieu:"cay",   ... , goc:{t,p}, muc:[{t,p}, ...] }
 *    { kieu:"doi",   ... , a:{t,y:[...]}, b:{t,y:[...]}, hoi }
 *
 *  mau nhận: primary (mặc định), info, success, warning, danger.
 *  Chữ hiểu **đậm** và `code`.
 *
 *  CHỌN KIỂU THEO NỘI DUNG, không theo cho đẹp: có thứ tự thời gian thì "luong",
 *  có trên/dưới thì "tang", có phân loại thì "cay", có hai thứ hay bị lẫn thì
 *  "doi". Chọn sai kiểu là sơ đồ nói sai về bản chất nội dung.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SoDo) return;
  var G = window.SoDo.dangKy;

  /* ================================================== LỚP 10 — nền tảng */

  G("C10-01", {
    kieu: "luong", mau: "info",
    ten: "Từ thế giới thật tới quyết định của con người",
    mo: "Bốn chặng này giải thích vì sao **dữ liệu** và **thông tin** không phải một thứ.",
    muc: [
      { t: "Sự vật, sự việc", p: "trời 28 độ" },
      { t: "Dữ liệu", p: "con số 28 được ghi lại" },
      { t: "Xử lí", p: "so với hôm qua, với trung bình" },
      { t: "Thông tin", p: "“hôm nay mát hơn”" },
      { t: "Quyết định", p: "không mang áo mưa" },
    ],
    ghi: "Máy tính rất giỏi chặng **Xử lí**, nhưng chặng **Thông tin** cần người hiểu ngữ cảnh mới có nghĩa.",
  });

  G("C10-02", {
    kieu: "tang", mau: "info",
    ten: "Các đơn vị đo dữ liệu",
    mo: "Mỗi bậc gấp **1024 lần** bậc dưới, vì 1024 = 2¹⁰.",
    tren: "lớn", duoi: "nhỏ",
    muc: [
      { t: "TB — terabyte", p: "1024 GB · một ổ cứng" },
      { t: "GB — gigabyte", p: "1024 MB · một bộ phim" },
      { t: "MB — megabyte", p: "1024 KB · một bài hát" },
      { t: "KB — kilobyte", p: "1024 byte · một trang chữ" },
      { t: "byte", p: "8 bit · một kí tự ASCII" },
      { t: "bit", p: "0 hoặc 1 · nhỏ nhất" },
    ],
    ghi: "Câu hay bị hỏi: **n bit biểu diễn được 2ⁿ giá trị** — mỗi bit thêm vào nhân đôi, không cộng thêm một.",
  });

  G("C10-22", {
    kieu: "doi", mau: "info",
    ten: "ASCII và UTF-8 khác nhau ở đâu",
    mo: "Đây là lí do tệp tiếng Việt nặng hơn tệp tiếng Anh cùng số chữ.",
    a: { t: "ASCII", y: ["Chỉ 128 mã", "1 byte mỗi kí tự", "Đủ chữ Latin không dấu, số, dấu câu", "**Không lưu được** `ă ơ ệ`"] },
    b: { t: "UTF-8 (Unicode)", y: ["Hơn một triệu mã", "1 byte cho chữ không dấu", "**2–3 byte** cho chữ có dấu", "Lưu được mọi ngôn ngữ"] },
    hoi: "Mở tệp bằng sai bảng mã thì chỉ **hiện sai**, các byte trong tệp không đổi — mở lại đúng bảng mã là đọc được.",
  });

  G("C10-23", {
    kieu: "luong",
    ten: "Đổi số thập phân sang nhị phân bằng cách chia liên tiếp",
    mo: "Ví dụ với số **13**. Chia 2 lấy dư, rồi đọc phần dư từ **dưới lên**.",
    muc: [
      { t: "13 : 2", p: "= 6, dư **1**" },
      { t: "6 : 2", p: "= 3, dư **0**" },
      { t: "3 : 2", p: "= 1, dư **1**" },
      { t: "1 : 2", p: "= 0, dư **1**" },
      { t: "Đọc ngược", p: "1101₂" },
    ],
    ghi: "Kiểm lại bằng trọng số: 1101₂ = 8 + 4 + 0 + 1 = 13. **Luôn viết dãy 8 4 2 1 lên trên các bit** thì không bao giờ đổi sai.",
  });

  G("C10-25", {
    kieu: "doi", mau: "warning",
    ten: "Hai kiểu nén tệp",
    mo: "Chọn kiểu nào là chọn giữa **giữ nguyên bản gốc** và **nhẹ hơn nhiều lần**.",
    a: { t: "Không mất mát", y: ["ZIP, RAR, PNG", "Gỡ nén ra **y nguyên** bản gốc", "Chỉ nhỏ được ít", "Dùng cho văn bản, mã nguồn, dữ liệu"] },
    b: { t: "Có mất mát", y: ["JPG, MP3, MP4", "**Không lấy lại được** bản gốc", "Nhỏ đi hàng chục lần", "Dùng cho ảnh, nhạc, phim"] },
    hoi: "Nén hai lần **không** làm tệp nhỏ thêm: nén lần đầu đã dùng hết chỗ lặp lại trong dữ liệu.",
  });

  /* ---------------------------------------------------- Mạng và Internet */

  G("C10-04", {
    kieu: "cay", mau: "info",
    ten: "Phân loại mạng máy tính theo phạm vi",
    mo: "Cùng một nguyên lí, khác nhau ở **bán kính phủ**.",
    goc: { t: "Mạng máy tính", p: "nhiều thiết bị nối nhau để chia sẻ dữ liệu và tài nguyên" },
    muc: [
      { t: "PAN", p: "quanh một người · Bluetooth tai nghe" },
      { t: "LAN", p: "một phòng, một toà nhà · phòng máy trường" },
      { t: "WAN", p: "nhiều vùng, nhiều nước · Internet là WAN lớn nhất" },
    ],
    ghi: "LAN chạy được **không cần Internet**: vẫn chia sẻ tệp, dùng chung máy in trong nội bộ dù nhà mạng đứt.",
  });

  G("C10-05", {
    kieu: "doi", mau: "info",
    ten: "Internet và World Wide Web không phải một",
    mo: "Câu Đúng/Sai rất hay ra ở chỗ này.",
    a: { t: "Internet", y: ["Là **hạ tầng** nối các mạng lại", "Có từ khoảng năm 1969", "Chở mọi loại dịch vụ", "Tắt trình duyệt nó vẫn chạy"] },
    b: { t: "World Wide Web", y: ["Là **một dịch vụ** chạy trên Internet", "Có từ năm 1989–1991", "Gồm các trang web nối nhau bằng liên kết", "Không có Internet thì không dùng được"] },
    hoi: "Câu để nhớ: **Internet là con đường, Web là một loại xe chạy trên đường đó.** Thư điện tử và gọi video là những loại xe khác.",
  });

  G("C10-06", {
    kieu: "luong", mau: "info",
    ten: "Tệp của em đi đâu khi lưu lên đám mây",
    mo: "“Đám mây” không hề mơ hồ — nó là **máy chủ của người khác** cộng với đường truyền.",
    muc: [
      { t: "Máy của em", p: "kéo tệp vào thư mục đồng bộ" },
      { t: "Đường truyền", p: "tải lên qua Internet" },
      { t: "Trung tâm dữ liệu", p: "lưu trên nhiều ổ, có bản dự phòng" },
      { t: "Thiết bị khác", p: "điện thoại tải về, thấy tệp y hệt" },
    ],
    ghi: "Đổi lấy sự tiện lợi này là hai điều phải nhớ: **mất mạng là không truy cập được**, và **dữ liệu nằm trên máy của nhà cung cấp**.",
  });

  G("C10-07", {
    kieu: "tang", mau: "danger",
    ten: "Các lớp bảo vệ tài khoản, từ mạnh nhất xuống",
    mo: "Không có lớp nào là đủ một mình — an toàn là **xếp nhiều lớp lên nhau**.",
    tren: "chặn được nhiều nhất", duoi: "cơ bản nhất",
    muc: [
      { t: "Xác thực hai bước", p: "có mật khẩu vẫn chưa vào được" },
      { t: "Mật khẩu riêng cho từng nơi", p: "lộ một chỗ không mất tất cả" },
      { t: "Mật khẩu dài và khó đoán", p: "chống thử tự động" },
      { t: "Cảnh giác với liên kết lạ", p: "chống bị lừa tự nộp mật khẩu" },
    ],
    ghi: "Lớp cuối là lớp yếu nhất về kĩ thuật nhưng bị đánh nhiều nhất: kẻ tấn công **xin mật khẩu còn dễ hơn đoán**.",
  });

  G("C10-26", {
    kieu: "cay", mau: "danger",
    ten: "Các loại mã độc và cách chúng lan",
    mo: "Phân biệt theo **cách nhân bản**, đó là điểm đề hay hỏi.",
    goc: { t: "Mã độc (malware)", p: "phần mềm được viết ra để gây hại hoặc chiếm quyền" },
    muc: [
      { t: "Virus", p: "phải bám vào tệp hoặc chương trình khác" },
      { t: "Worm", p: "**tự** lan qua mạng, không cần vật chủ" },
      { t: "Trojan", p: "núp bóng phần mềm có ích để được cài" },
      { t: "Ransomware", p: "mã hoá dữ liệu rồi đòi tiền" },
    ],
    ghi: "Cách chống ransomware **không** phải là trả tiền, mà là **sao lưu ở nơi tách biệt** — trả tiền không có gì bảo đảm được mở khoá.",
  });

  /* -------------------------------------------------------- Python lớp 10 */

  G("C10-11", {
    kieu: "luong", mau: "success",
    ten: "Từ dòng lệnh em gõ tới kết quả trên màn hình",
    mo: "Python là ngôn ngữ **thông dịch**: máy đọc và chạy từng câu lệnh một.",
    muc: [
      { t: "Em gõ mã", p: "`print(\"Xin chào\")`" },
      { t: "Trình thông dịch", p: "đọc từng dòng, dịch sang lệnh máy" },
      { t: "CPU thực hiện", p: "chạy lệnh máy vừa dịch" },
      { t: "Kết quả", p: "chữ hiện ra màn hình" },
    ],
    ghi: "Vì dịch từng dòng nên **lỗi cú pháp ở dòng 10 không lộ ra tới khi chạy tới dòng 10** — khác với ngôn ngữ biên dịch, báo hết lỗi trước khi chạy.",
  });

  G("C10-29", {
    kieu: "tang", mau: "success",
    ten: "Các mức ngôn ngữ lập trình",
    mo: "Càng lên cao càng dễ cho người, càng cần **dịch** nhiều cho máy.",
    tren: "gần con người", duoi: "gần phần cứng",
    muc: [
      { t: "Ngôn ngữ bậc cao", p: "Python, C, Java — gần tiếng Anh" },
      { t: "Hợp ngữ (assembly)", p: "`MOV AX, 5` — bậc **thấp**, gần lệnh máy" },
      { t: "Ngôn ngữ máy", p: "dãy nhị phân, CPU chạy trực tiếp" },
      { t: "Phần cứng", p: "mạch điện, chỉ có đóng và mở" },
    ],
    ghi: "Hợp ngữ hay bị tưởng là bậc cao vì đọc được bằng chữ. Thật ra mỗi lệnh hợp ngữ **ứng gần như một lệnh máy** — đó là định nghĩa của bậc thấp.",
  });

  G("C10-30", {
    kieu: "vong", mau: "success",
    ten: "Bốn bước giải một bài toán bằng máy tính",
    mo: "Bước hay bị bỏ nhất là bước **1** — nhiều bạn gõ code ngay khi đọc xong đề.",
    muc: [
      { t: "Xác định bài toán", p: "Đầu vào gì? Đầu ra gì?" },
      { t: "Mô tả thuật toán", p: "liệt kê bước, hoặc vẽ sơ đồ khối" },
      { t: "Viết chương trình", p: "chuyển thuật toán thành mã" },
      { t: "Kiểm thử", p: "thử cả trường hợp đặc biệt" },
    ],
    quayLai: "sai thì quay lại bước 1 hoặc 2 — sửa mã mà thuật toán vẫn sai thì sửa mãi không hết",
    ghi: "Trường hợp đặc biệt phải thử: **dãy rỗng, một phần tử, toàn số âm, số 0, dữ liệu lớn nhất cho phép**.",
  });

  G("C10-13", {
    kieu: "luong", mau: "warning",
    ten: "Vì sao phải bọc `int()` quanh `input()`",
    mo: "`input()` **luôn** trả về xâu, kể cả khi người dùng gõ chữ số.",
    muc: [
      { t: "Người dùng gõ", p: "2 rồi Enter" },
      { t: "`input()` trả về", p: "xâu `\"2\"` — không phải số" },
      { t: "Nếu để nguyên", p: "`\"2\" + \"3\"` = `\"23\"` (nối chuỗi)" },
      { t: "Nếu bọc `int()`", p: "`2 + 3` = `5` (cộng số)" },
    ],
    ghi: "Đây là lỗi số một của người mới học Python, và nó **không báo lỗi** — chỉ cho ra kết quả sai, nên rất khó phát hiện.",
  });

  G("C10-15", {
    kieu: "doi", mau: "success",
    ten: "Khi nào dùng `for`, khi nào dùng `while`",
    mo: "Chọn đúng vòng lặp thì tránh được hẳn lỗi lặp vô hạn.",
    a: { t: "for", y: ["Dùng khi **biết trước số vòng**", "`for i in range(1, n+1):`", "**Tự** tăng biến đếm", "Không lặp vô hạn được"] },
    b: { t: "while", y: ["Dùng khi **chưa biết bao giờ dừng**", "`while chua_dung:`", "Người viết **phải tự** đổi biến điều kiện", "Quên đổi là lặp vô hạn"] },
    hoi: "Nhớ chắc: `range(a, b)` **không lấy b**. Muốn chạy tới n thì viết `range(1, n+1)`.",
  });

  G("C10-17", {
    kieu: "doi", mau: "success",
    ten: "Danh sách sửa được, xâu thì không",
    mo: "Hai kiểu này trông giống nhau khi đọc, khác nhau hẳn khi ghi.",
    a: { t: "Danh sách — list", y: ["`a = [10, 20, 30]`", "Đọc: `a[0]` → `10`", "**Ghi được**: `a[0] = 99`", "Có `append`, `insert`, `remove`"] },
    b: { t: "Xâu — string", y: ["`s = \"minh\"`", "Đọc: `s[0]` → `\"m\"`", "**Ghi lỗi**: `s[0] = \"M\"`", "`upper()` trả về xâu **mới**"] },
    hoi: "Cả hai đều đánh chỉ số **từ 0**, và phần tử cuối luôn ở chỉ số `len(x) - 1` (hoặc viết gọn là `x[-1]`).",
  });

  G("C10-19", {
    kieu: "doi", mau: "warning",
    ten: "`print` và `return` làm hai việc khác nhau",
    mo: "Lẫn hai cái này là lí do hàm “chạy đúng” mà biến vẫn nhận `None`.",
    a: { t: "print", y: ["**Hiện** ra màn hình cho người xem", "Xong là thôi, không ai giữ lại giá trị", "Hàm chỉ `print` thì trả về `None`", "Không dùng được kết quả để tính tiếp"] },
    b: { t: "return", y: ["**Trả giá trị** về cho chương trình", "Gán được vào biến: `s = f(3, 4)`", "Chạy tới `return` là hàm **kết thúc ngay**", "Dùng được kết quả để tính tiếp"] },
    hoi: "Quy tắc: hàm **tính toán** thì `return`; chỉ dùng `print` ở nơi thật sự cần cho người xem.",
  });

  G("C10-20", {
    kieu: "vong", mau: "warning",
    ten: "Vòng tìm lỗi và sửa lỗi",
    mo: "Ba loại lỗi cần phân biệt: **cú pháp**, **khi chạy** và **lôgic** — loại thứ ba khó nhất vì máy không báo gì.",
    muc: [
      { t: "Chạy thử", p: "với dữ liệu đã biết đáp án" },
      { t: "So kết quả", p: "khác đáp án ở chỗ nào?" },
      { t: "Khoanh vùng", p: "thêm `print` để xem biến giữa đường" },
      { t: "Sửa một chỗ", p: "sửa nhiều chỗ cùng lúc thì không biết cái nào có tác dụng" },
    ],
    quayLai: "rồi chạy lại từ đầu, kể cả những trường hợp đã đúng trước đó",
    ghi: "Lỗi **lôgic** là loại chương trình vẫn chạy trơn tru mà cho kết quả sai — chỉ tìm ra bằng cách thử với dữ liệu mình đã biết đáp án.",
  });

  /* ================================================== LỚP 11 */

  G("C11-01", {
    kieu: "tang",
    ten: "Hệ điều hành đứng ở đâu trong máy tính",
    mo: "Nó là **lớp trung gian**: ứng dụng không nói chuyện trực tiếp với phần cứng.",
    tren: "người dùng", duoi: "phần cứng",
    muc: [
      { t: "Người dùng", p: "bấm, gõ, nhìn màn hình" },
      { t: "Phần mềm ứng dụng", p: "Word, trình duyệt, game" },
      { t: "Hệ điều hành", p: "chia CPU, cấp bộ nhớ, quản tệp, quản thiết bị" },
      { t: "Phần cứng", p: "CPU, RAM, ổ đĩa, màn hình" },
    ],
    ghi: "Nhờ lớp giữa này mà một chương trình chạy được trên nhiều máy khác cấu hình: nó xin việc qua hệ điều hành, **không cần biết ổ đĩa hãng nào**.",
  });

  G("C11-03", {
    kieu: "doi",
    ten: "RAM và ổ cứng — hai thứ hay bị lẫn",
    mo: "Máy chậm vì lí do nào thì phải nâng đúng bộ phận đó.",
    a: { t: "RAM — bộ nhớ trong", y: ["**Mất sạch** khi tắt máy", "Rất nhanh, dung lượng nhỏ", "Chứa thứ đang mở", "Thiếu → mở nhiều ứng dụng là đứng máy"] },
    b: { t: "Ổ cứng — bộ nhớ ngoài", y: ["**Giữ được** khi tắt máy", "Chậm hơn nhiều, dung lượng lớn", "Chứa tệp và phần mềm đã cài", "Thiếu → không đủ chỗ lưu"] },
    hoi: "Ví von: **CPU là người làm, RAM là mặt bàn, ổ cứng là tủ hồ sơ.** Bàn nhỏ thì phải chạy ra tủ liên tục — đó là lúc máy đứng hình.",
  });

  G("C11-06", {
    kieu: "doi", mau: "info",
    ten: "Vì sao không lưu bằng mấy tệp bảng tính cho xong",
    mo: "Không phải vì bảng tính tệ, mà vì hai công cụ mạnh ở hai việc khác nhau.",
    a: { t: "Nhiều tệp rời", y: ["Cùng một học sinh ghi ở **ba tệp khác nhau**", "Sửa một chỗ, hai chỗ kia vẫn dữ liệu cũ", "Ai cũng sửa được mọi ô", "Tìm trong trăm nghìn dòng thì rất chậm"] },
    b: { t: "Cơ sở dữ liệu", y: ["Mỗi thông tin lưu **một chỗ duy nhất**", "Ràng buộc chặn dữ liệu vô nghĩa ngay lúc nhập", "Phân quyền: ai xem gì, ai sửa gì", "Truy vấn nhanh trên lượng lớn"] },
    hoi: "**Cơ sở dữ liệu là kho dữ liệu; hệ quản trị (DBMS) là phần mềm quản kho.** Đề rất hay hỏi phân biệt hai thứ này.",
  });

  G("C11-07", {
    kieu: "tang", mau: "info",
    ten: "Từ vựng của mô hình quan hệ",
    mo: "Bốn tầng này là toàn bộ từ vựng cần cho các câu hỏi về CSDL quan hệ.",
    tren: "lớn nhất", duoi: "nhỏ nhất",
    muc: [
      { t: "Cơ sở dữ liệu", p: "gồm nhiều bảng có liên kết" },
      { t: "Bảng (quan hệ)", p: "một loại đối tượng, ví dụ HOC_SINH" },
      { t: "Bản ghi (hàng)", p: "một học sinh cụ thể" },
      { t: "Trường (cột)", p: "một thuộc tính, ví dụ ho_ten" },
    ],
    ghi: "**Khoá chính** xác định duy nhất từng bản ghi và không được trống — nên đừng dùng họ tên làm khoá chính, vì tên có thể trùng. **Khoá ngoài** là khoá chính của bảng khác đặt sang đây để nối hai bảng.",
  });

  G("C11-09", {
    kieu: "luong", mau: "info",
    ten: "Thứ tự các phần của một câu SELECT",
    mo: "Viết đúng thứ tự này thì gần như không sai cú pháp.",
    muc: [
      { t: "SELECT", p: "lấy **cột** nào" },
      { t: "FROM", p: "từ **bảng** nào" },
      { t: "WHERE", p: "lọc **hàng** theo điều kiện" },
      { t: "GROUP BY", p: "gom nhóm để thống kê" },
      { t: "ORDER BY", p: "sắp thứ tự kết quả" },
    ],
    ghi: "Hai lỗi hay gặp: giá trị **chữ phải có dấu nháy đơn** (`lop = '12A'`), còn số thì không; và `ORDER BY ... DESC` mới là giảm dần, mặc định là tăng dần.",
  });

  G("C11-10", {
    kieu: "cay", mau: "danger",
    ten: "Ba câu lệnh làm thay đổi dữ liệu",
    mo: "Hai trong ba câu này **không có nút hoàn tác**.",
    goc: { t: "Lệnh sửa dữ liệu", p: "khác với SELECT — chạy là dữ liệu đổi thật" },
    muc: [
      { t: "INSERT", p: "thêm bản ghi mới · an toàn nhất" },
      { t: "UPDATE … **WHERE**", p: "thiếu WHERE là sửa **cả bảng**" },
      { t: "DELETE … **WHERE**", p: "thiếu WHERE là xoá **sạch bảng**" },
    ],
    ghi: "Thói quen sống còn: **gõ `WHERE` trước, gõ phần còn lại sau**. Và thử bằng `SELECT` cùng điều kiện đó xem đúng mấy dòng rồi mới chạy thật.",
  });

  G("C11-13", {
    kieu: "doi", mau: "success",
    ten: "Hai cách tìm một số trong dãy",
    mo: "Chọn cách nào phụ thuộc **dãy đã sắp xếp chưa** và **tìm mấy lần**.",
    a: { t: "Tìm tuần tự", y: ["Dãy **không cần** sắp xếp", "Dò từng ô từ đầu", "Xấu nhất: **n** bước", "Với 1000 số: tối đa 1000 bước"] },
    b: { t: "Tìm nhị phân", y: ["Dãy **phải** sắp xếp trước", "Mỗi bước bỏ được **một nửa**", "Xấu nhất: **log₂n** bước", "Với 1000 số: tối đa 10 bước"] },
    hoi: "Bẫy trong đề: nhị phân **không** nhanh hơn trong *mọi* trường hợp — số cần tìm nằm ngay đầu dãy thì tuần tự thấy sau 1 bước. Và nếu chỉ tìm **một lần** trên dãy chưa sắp thì sắp xếp trước còn đắt hơn quét tuần tự.",
  });

  G("C11-16", {
    kieu: "tang", mau: "warning",
    ten: "Các mức độ phức tạp, từ tệ xuống tốt",
    mo: "Cột bên phải là số phép tính khi **n = 1000**.",
    tren: "tệ nhất", duoi: "tốt nhất",
    muc: [
      { t: "O(2ⁿ)", p: "lớn hơn số nguyên tử trong vũ trụ" },
      { t: "O(n²)", p: "1.000.000 — sắp xếp nổi bọt" },
      { t: "O(n log n)", p: "≈ 10.000 — sắp xếp tốt" },
      { t: "O(n)", p: "1.000 — quét một lượt" },
      { t: "O(log n)", p: "≈ 10 — tìm nhị phân" },
      { t: "O(1)", p: "1 — truy cập `a[i]`" },
    ],
    ghi: "Kí hiệu O **không** nói thuật toán chạy mất mấy giây. Nó nói **dữ liệu lớn lên thì chi phí phình ra theo kiểu nào** — n gấp đôi thì O(n²) gấp bốn.",
  });

  G("C11-19", {
    kieu: "luong", mau: "warning",
    ten: "Đệ quy đi xuống rồi trả về ngược lên",
    mo: "Ví dụ với `giai_thua(4)`. Chú ý: **không lời gọi nào tính xong trước lời gọi bên trong nó**.",
    muc: [
      { t: "giai_thua(4)", p: "chờ 4 × giai_thua(3)" },
      { t: "giai_thua(3)", p: "chờ 3 × giai_thua(2)" },
      { t: "giai_thua(2)", p: "chờ 2 × giai_thua(1)" },
      { t: "giai_thua(1)", p: "chờ 1 × giai_thua(0)" },
      { t: "giai_thua(0)", p: "**điều kiện dừng** → trả về 1" },
    ],
    ghi: "Tới đây các phép nhân mới lần lượt hoàn thành theo chiều ngược: 1 → 1 → 2 → 6 → **24**. Hàm đệ quy nào cũng phải có đủ **nhánh dừng** (trả về giá trị cụ thể) và **nhánh gọi lại chính nó với dữ liệu nhỏ hơn**.",
  });

  G("C11-32", {
    kieu: "doi",
    ten: "Ngăn xếp và hàng đợi",
    mo: "Đưa **cùng** dãy `A B C D` vào hai bên, lấy hết ra thì được hai kết quả khác nhau.",
    a: { t: "Ngăn xếp — Stack", y: ["Vào sau ra trước (**LIFO**)", "Như chồng sách: lấy từ **trên**", "`A B C D` → lấy ra `D C B A`", "Dùng cho: **Hoàn tác**, lời gọi hàm, nút Quay lại"] },
    b: { t: "Hàng đợi — Queue", y: ["Vào trước ra trước (**FIFO**)", "Như hàng mua vé: lấy từ **đầu hàng**", "`A B C D` → lấy ra `A B C D`", "Dùng cho: hàng chờ in, xử lí yêu cầu theo lượt"] },
    hoi: "Công dụng thường gặp nhất của ngăn xếp chính là **đảo ngược thứ tự**.",
  });

  /* ================================================== LỚP 12 */

  G("C12-01", {
    kieu: "cay", mau: "info",
    ten: "AI, học máy và học sâu lồng trong nhau",
    mo: "Ba tên này **không** ngang hàng — cái sau nằm trong cái trước.",
    goc: { t: "Trí tuệ nhân tạo (AI)", p: "làm cho máy thực hiện việc thường cần trí thông minh của người" },
    muc: [
      { t: "Hệ dựa trên luật", p: "người viết sẵn quy tắc “nếu… thì…”" },
      { t: "Học máy", p: "máy **tự tìm quy luật** từ dữ liệu" },
      { t: "Học sâu", p: "học máy dùng mạng nơ-ron nhiều lớp" },
    ],
    ghi: "Câu phân biệt gọn: chương trình **làm theo quy tắc người viết ra** thì không phải học máy; chương trình **tự tìm quy tắc từ dữ liệu** thì mới là.",
  });

  G("C12-02", {
    kieu: "doi", mau: "danger",
    ten: "AI mạnh ở đâu, yếu ở đâu",
    mo: "Biết được ranh giới này là biết khi nào tin AI, khi nào phải tự kiểm.",
    a: { t: "AI làm tốt", y: ["Việc **hẹp và lặp lại**: nhận dạng ảnh, gợi ý nội dung", "Xử lí lượng dữ liệu khổng lồ", "Làm không nghỉ, không đổi tâm trạng", "Tìm quy luật người khó thấy"] },
    b: { t: "AI còn kém", y: ["Việc cần **hiểu ngữ cảnh** và trách nhiệm", "Trả lời **nghe thuyết phục nhưng sai**", "Học lại **định kiến** có trong dữ liệu", "Giải thích vì sao nó quyết định như vậy"] },
    hoi: "Ba giới hạn để làm câu Đ/S: **phụ thuộc dữ liệu**, **có thể sai một cách thuyết phục**, **không chịu trách nhiệm được**.",
  });

  G("C12-03", {
    kieu: "tang",
    ten: "Bốn tầng của mô hình TCP/IP",
    mo: "Mỗi tầng chỉ làm **một việc** và chỉ nói chuyện với tầng ngay trên, ngay dưới nó.",
    tren: "gần người dùng", duoi: "gần đường truyền",
    muc: [
      { t: "Ứng dụng", p: "HTTP, SMTP, DNS — nội dung người dùng" },
      { t: "Giao vận (**TCP**)", p: "chia gói, đánh số, gửi lại gói thiếu" },
      { t: "Mạng (**IP**)", p: "đánh địa chỉ và tìm đường đi" },
      { t: "Liên kết dữ liệu", p: "cáp, Wi-Fi — truyền tín hiệu thật" },
    ],
    ghi: "Phân vai hay bị hỏi: **IP tìm đường**, **TCP bảo đảm tới đủ và đúng thứ tự**. Các gói của cùng một tệp có thể đi **đường khác nhau** và tới **lộn thứ tự** — chính vì vậy mới cần TCP sắp lại.",
  });

  G("C12-04", {
    kieu: "cay",
    ten: "Thiết bị mạng, mỗi thứ một việc",
    mo: "Đề hay hỏi “thiết bị nào dùng để…”, nên phải nhớ đúng vai.",
    goc: { t: "Thiết bị mạng", p: "phần cứng để nối và điều phối đường truyền" },
    muc: [
      { t: "Switch", p: "nối các máy **trong cùng** một mạng" },
      { t: "Router", p: "nối mạng nội bộ **ra ngoài**, tìm đường giữa các mạng" },
      { t: "Access Point", p: "phát Wi-Fi cho thiết bị không dây" },
      { t: "Modem", p: "chuyển tín hiệu nhà mạng thành tín hiệu máy hiểu" },
    ],
    ghi: "Nhớ gọn: **switch nối trong mạng, router nối ra ngoài mạng**. Thiết bị gia đình thường gộp cả modem, router và access point vào một hộp — nên dễ tưởng chúng là một thứ.",
  });

  G("C12-21", {
    kieu: "luong",
    ten: "Từ tên miền tới địa chỉ IP",
    mo: "Gõ một tên miền là bắt đầu chuỗi hỏi đáp này — xong trong vài phần trăm giây nên ta không thấy.",
    muc: [
      { t: "Trình duyệt", p: "chưa biết địa chỉ số, đi hỏi" },
      { t: "DNS nhà mạng", p: "có trong bộ đệm thì trả lời ngay" },
      { t: "Máy chủ gốc", p: "chỉ đường: hỏi bên quản lí `.vn`" },
      { t: "Máy chủ đuôi", p: "chỉ tiếp: hỏi bên quản lí tên miền đó" },
      { t: "Có IP", p: "giờ mới thật sự kết nối" },
    ],
    ghi: "Gõ thẳng **địa chỉ IP** thì khỏi cần cả quá trình này. Và một tên miền trỏ được tới **nhiều IP** để chia tải, chứ không chỉ một.",
  });

  G("C12-07", {
    kieu: "doi", mau: "success",
    ten: "HTML và CSS chia việc thế nào",
    mo: "Lẫn hai vai này là lí do trang web viết ra rất khó sửa.",
    a: { t: "HTML — nội dung", y: ["Nói **cái gì** có trên trang", "Tiêu đề, đoạn văn, ảnh, bảng, liên kết", "`<h1>`, `<p>`, `<img>`, `<a>`", "Bỏ CSS đi thì trang xấu nhưng **vẫn đọc được**"] },
    b: { t: "CSS — hình thức", y: ["Nói **trông thế nào**", "Màu, phông, khoảng cách, bố cục", "`color`, `font-size`, `margin`, `display`", "Bỏ HTML đi thì **không còn gì** để tô"] },
    hoi: "Đó là lí do nên tách CSS ra tệp riêng: đổi cả giao diện của trăm trang chỉ cần sửa **một** tệp.",
  });

  G("C12-11", {
    kieu: "tang", mau: "success",
    ten: "Mô hình hộp CSS, từ ngoài vào trong",
    mo: "Bốn lớp này bao quanh mọi phần tử trên trang web.",
    tren: "ngoài cùng", duoi: "trong cùng",
    muc: [
      { t: "`margin`", p: "khoảng trống **bên ngoài**, giữa hộp này và hộp bên cạnh" },
      { t: "`border`", p: "đường viền của hộp" },
      { t: "`padding`", p: "khoảng đệm **bên trong**, giữa viền và nội dung" },
      { t: "Nội dung", p: "chữ, ảnh — phần mà `width` đo" },
    ],
    ghi: "Nhớ hai chữ: **padding trong, margin ngoài**. Cách kiểm nhanh: đặt màu nền — nền phủ tới hết `padding` nhưng **không** phủ `margin`. Và mặc định `width` chỉ đo phần nội dung, nên padding cộng thêm vào làm hộp rộng hơn con số đã đặt (trừ khi dùng `box-sizing: border-box`).",
  });

  G("C12-25", {
    kieu: "tang", mau: "warning",
    ten: "Luật ưu tiên khi các quy tắc CSS chồng nhau",
    mo: "Hai quy tắc cùng đặt màu cho một phần tử thì **cái mạnh hơn thắng**.",
    tren: "mạnh nhất", duoi: "yếu nhất",
    muc: [
      { t: "`!important`", p: "đè tất cả — nên tránh dùng" },
      { t: "`style=\"...\"` trong thẻ", p: "viết trực tiếp trên phần tử" },
      { t: "`#id`", p: "chọn theo id, mỗi trang một id duy nhất" },
      { t: "`.class`", p: "chọn theo class, một phần tử mang nhiều class được" },
      { t: "Tên thẻ", p: "`p`, `div`, `h1`" },
    ],
    ghi: "**Chỉ khi ưu tiên bằng nhau** thì quy tắc viết sau mới thắng. Nhiều bạn nhớ ngược thứ tự `#id` và `.class` — id mạnh hơn.",
  });

  G("C12-15", {
    kieu: "vong", mau: "info",
    ten: "Một mô hình học máy được làm ra thế nào",
    mo: "Bước quan trọng nhất là bước **4** — thiếu nó thì không biết mô hình có dùng được không.",
    muc: [
      { t: "Thu thập dữ liệu", p: "càng đại diện thực tế càng tốt" },
      { t: "Chia dữ liệu", p: "phần để **học**, phần để **kiểm tra**" },
      { t: "Huấn luyện", p: "máy thử tham số, giữ cái sai ít nhất" },
      { t: "Đánh giá", p: "đo trên phần **chưa từng thấy**" },
      { t: "Dự đoán", p: "dùng cho dữ liệu mới thật" },
    ],
    quayLai: "kết quả kém thì quay lại: thêm dữ liệu, đổi cách chia, đổi mô hình",
    ghi: "Bẫy tên là **học tủ (overfitting)**: mô hình đúng 100% trên dữ liệu đã học nhưng trật với dữ liệu mới, vì nó học thuộc cả chi tiết vụn. Vì vậy phải đánh giá trên dữ liệu tách riêng ra từ đầu.",
  });

  G("C12-16", {
    kieu: "cay", mau: "info",
    ten: "Ba bài toán thường gặp của học máy",
    mo: "Nhận dạng bằng một câu hỏi: **dữ liệu đã có đáp án sẵn chưa?**",
    goc: { t: "Học máy", p: "tìm quy luật trong dữ liệu để xử lí dữ liệu mới" },
    muc: [
      { t: "Phân loại", p: "có nhãn · đầu ra là **nhóm**: thư rác / không rác" },
      { t: "Dự đoán (hồi quy)", p: "có nhãn · đầu ra là **con số**: giá nhà" },
      { t: "Phân cụm", p: "**không** nhãn · tự gom mẫu giống nhau thành nhóm" },
    ],
    ghi: "Phân cụm chỉ nói “những mẫu này giống nhau”; **nhóm đó nghĩa là gì thì con người phải đặt tên và giải thích**. Và dữ liệu có nhãn thường phải gán thủ công nên rất quý.",
  });

  G("C12-17", {
    kieu: "luong", mau: "info",
    ten: "Quy trình của khoa học dữ liệu",
    mo: "Bước tốn thời gian nhất là bước **2** — thường chiếm phần lớn công việc thật.",
    muc: [
      { t: "Thu thập", p: "từ biểu mẫu, cảm biến, hệ thống có sẵn" },
      { t: "Làm sạch", p: "thiếu, sai, trùng, sai đơn vị" },
      { t: "Phân tích", p: "tính, so sánh, tìm quy luật" },
      { t: "Trực quan hoá", p: "chọn biểu đồ nói đúng điều cần nói" },
      { t: "Ra quyết định", p: "việc của con người, không của máy" },
    ],
    ghi: "Nguyên tắc phải nhớ: **dữ liệu vào rác thì kết quả ra rác**. Phân tích tinh vi trên dữ liệu bẩn chỉ cho ra kết luận sai một cách rất thuyết phục.",
  });

  G("C12-18", {
    kieu: "cay", mau: "warning",
    ten: "Chọn biểu đồ theo câu hỏi cần trả lời",
    mo: "Chọn dạng biểu đồ là chọn theo **câu hỏi**, không theo cái nào trông đẹp hơn.",
    goc: { t: "Muốn nói điều gì?", p: "trả lời được câu này thì dạng biểu đồ tự lộ ra" },
    muc: [
      { t: "So sánh các nhóm", p: "biểu đồ **cột**" },
      { t: "Thay đổi theo thời gian", p: "biểu đồ **đường**" },
      { t: "Tỉ lệ trong một tổng", p: "biểu đồ **hình tròn**" },
      { t: "Quan hệ giữa hai đại lượng", p: "biểu đồ **phân tán**" },
    ],
    ghi: "Hai mẹo gây nhầm lẫn cần nhận ra: **cắt trục dọc không từ 0** làm chênh lệch nhỏ trông rất lớn, và **hiệu ứng ba chiều** làm phần phía trước trông to hơn thực tế. Số liệu đúng mà người xem vẫn hiểu sai.",
  });

  G("C12-19", {
    kieu: "vong", mau: "warning",
    ten: "Mô phỏng trên máy tính hoạt động thế nào",
    mo: "Mô phỏng **không** dự đoán tương lai — nó chạy đúng cái quy tắc con người đặt vào.",
    muc: [
      { t: "Đặt tham số", p: "ví dụ mỗi ca lây cho R người" },
      { t: "Đặt quy tắc", p: "công thức tính trạng thái ngày sau" },
      { t: "Chạy nhiều bước", p: "lặp lại quy tắc qua từng ngày" },
      { t: "Đọc kết quả", p: "so các kịch bản với nhau" },
    ],
    quayLai: "rồi đổi một tham số và chạy lại — đó chính là phép thử “nếu… thì…”",
    ghi: "Sức mạnh: thử được kịch bản **không dám hoặc không thể thử thật** (dịch bệnh, thiên tai, thử xe). Giới hạn: đặt quy tắc sai thì kết quả sai **một cách rất thuyết phục**, vì con số nào máy in ra cũng trông đáng tin.",
  });

  G("C12-20", {
    kieu: "cay", mau: "danger",
    ten: "Dữ liệu lớn — ba chữ V thường được nhắc",
    mo: "Không phải cứ tệp nặng là dữ liệu lớn. Ranh giới nằm ở chỗ **cách làm thông thường không dùng được nữa**.",
    goc: { t: "Big Data", p: "dữ liệu vượt quá khả năng xử lí của một máy và của cách làm thường" },
    muc: [
      { t: "Volume", p: "khối lượng — hàng tỉ bản ghi" },
      { t: "Velocity", p: "tốc độ — sinh ra liên tục từng giây" },
      { t: "Variety", p: "đa dạng — chữ, ảnh, âm thanh, log lẫn nhau" },
    ],
    ghi: "Xử lí được nhờ **chia việc ra nhiều máy chạy song song**, không phải nhờ một máy mạnh hơn. Và thu thập dữ liệu cá nhân thì bị **luật bảo vệ dữ liệu cá nhân** ràng buộc: phải có mục đích rõ và có sự đồng ý.",
  });
})();
