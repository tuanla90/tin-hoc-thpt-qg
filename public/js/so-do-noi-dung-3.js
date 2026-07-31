/* ============================================================================
 *  NỘI DUNG SƠ ĐỒ — ĐỢT 3: 18 bài cuối của lớp 10 và lớp 12
 *
 *  Nạp SAU js/so-do.js. Xem quy ước dạng dữ liệu ở đầu js/so-do-noi-dung.js.
 *  Sau đợt này thì cả 119 bài đều có ít nhất một khối trực quan.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SoDo) return;
  var G = window.SoDo.dangKy;

  /* ============================================== LỚP 10 — phần còn thiếu */

  G("C10-03", {
    kieu: "cay", mau: "info",
    ten: "Thiết bị số quanh ta",
    mo: "Tất cả đều có chung ba bộ phận: **bộ xử lí, bộ nhớ, thiết bị vào/ra** — chỉ khác hình dáng và mục đích.",
    goc: { t: "Thiết bị số", p: "thiết bị xử lí thông tin dưới dạng số (dãy 0 và 1)" },
    muc: [
      { t: "Máy tính", p: "để bàn, xách tay — vạn năng, cài gì cũng được" },
      { t: "Điện thoại thông minh", p: "gọn, luôn kết nối, nhiều cảm biến" },
      { t: "Thiết bị đeo", p: "đồng hồ, vòng tay — đo và gửi dữ liệu về" },
      { t: "Thiết bị IoT", p: "camera, đèn, khoá cửa thông minh" },
    ],
    ghi: "Điểm chung khiến chúng đều là “thiết bị số”: dữ liệu bên trong đều được mã hoá thành **dãy bit**. Vì vậy chúng trao đổi được với nhau, dù do các hãng khác nhau làm ra.",
  });

  G("C10-27", {
    kieu: "cay", mau: "warning",
    ten: "Các loại giấy phép phần mềm",
    mo: "**Miễn phí** và **nguồn mở** là hai chuyện khác nhau — đây là chỗ hay bị lẫn nhất.",
    goc: { t: "Giấy phép sử dụng", p: "văn bản nói em được làm gì và không được làm gì với phần mềm" },
    muc: [
      { t: "Thương mại", p: "phải trả tiền; thường mỗi bản quyền cho một máy" },
      { t: "Dùng thử (trial)", p: "miễn phí có thời hạn hoặc giới hạn tính năng" },
      { t: "Miễn phí (freeware)", p: "không mất tiền nhưng **không** cho xem hay sửa mã nguồn" },
      { t: "Nguồn mở", p: "được xem, sửa và chia sẻ lại — **vẫn có giấy phép ràng buộc**" },
    ],
    ghi: "Hai điều hay ra trong đề: **nguồn mở không có nghĩa là không có luật** (nhiều giấy phép buộc giữ tên tác giả hoặc buộc mở nguồn bản sửa lại); và **phần mềm miễn phí không phải là nguồn mở** nếu không cho xem mã.",
  });

  G("C10-09", {
    kieu: "doi", mau: "success",
    ten: "Đồ hoạ vector và đồ hoạ điểm ảnh",
    mo: "Chọn loại nào là chọn theo **có phải phóng to không** và **có phải ảnh chụp không**.",
    a: { t: "Vector", y: ["Lưu **công thức hình học**: điểm, đường, đường cong", "Phóng to bao nhiêu cũng **không vỡ**", "Tệp nhẹ, sửa lại từng hình được", "`.svg`, `.ai`, `.cdr` — dùng cho logo, biểu tượng, bản vẽ"] },
    b: { t: "Điểm ảnh (bitmap)", y: ["Lưu **màu của từng điểm ảnh**", "Phóng to là thấy **răng cưa, vỡ hạt**", "Tệp nặng hơn, sửa lại khó", "`.jpg`, `.png` — dùng cho ảnh chụp"] },
    hoi: "Vì sao logo phải là vector: cùng một tệp dùng được cho danh thiếp 2 cm lẫn biển hiệu 3 m mà đều sắc nét. Ảnh chụp thì ngược lại — không có công thức nào mô tả được từng chi tiết của một khuôn mặt.",
  });

  G("C10-10", {
    kieu: "luong", mau: "success",
    ten: "Trình tự vẽ một hình bằng đồ hoạ vector",
    mo: "Nguyên tắc chung: **ghép từ hình cơ bản**, đừng cố vẽ tay một nét duy nhất.",
    muc: [
      { t: "Chọn hình cơ bản", p: "chữ nhật, elip, đa giác, đường" },
      { t: "Biến đổi", p: "kéo giãn, xoay, lật, sao chép" },
      { t: "Tô và viền", p: "màu nền, độ dày nét, kiểu nét" },
      { t: "Sắp lớp và nhóm", p: "đưa lên/xuống, nhóm để di chuyển cùng nhau" },
      { t: "Lưu", p: "`.svg` để còn sửa, xuất `.png` để gửi" },
    ],
    ghi: "**Nhóm (group)** là công cụ hay bị bỏ quên nhưng tiết kiệm nhất: nhóm rồi thì kéo, xoay, phóng to cả cụm mà các phần bên trong giữ đúng tỉ lệ với nhau.",
  });

  G("C10-28", {
    kieu: "cay", mau: "success",
    ten: "Chọn định dạng nào khi xuất bản vẽ",
    mo: "Câu hỏi quyết định: **người nhận sẽ làm gì với tệp này?**",
    goc: { t: "Xuất bản vẽ", p: "mỗi định dạng đánh đổi giữa sửa được, nét, và nhẹ" },
    muc: [
      { t: "`.svg`", p: "vector — còn **sửa lại được**, hiển thị trên web sắc nét mọi cỡ" },
      { t: "`.png`", p: "điểm ảnh, **nền trong suốt** — dán lên nền nào cũng được" },
      { t: "`.jpg`", p: "điểm ảnh, nhẹ nhất, **không** có nền trong suốt" },
      { t: "`.pdf`", p: "để **in** — giữ đúng khổ giấy và phông chữ" },
    ],
    ghi: "Luôn **giữ lại bản `.svg` gốc**. Xuất ra `.png` hay `.jpg` là chuyển thành điểm ảnh — mở lại không tách được từng hình ra sửa nữa, giống hệt chuyện gộp lớp trong phần mềm chỉnh ảnh.",
  });

  G("C10-32", {
    kieu: "cay", mau: "success",
    ten: "Bốn nhóm thao tác trên xâu kí tự",
    mo: "Điểm chung của tất cả: chúng **trả về xâu mới**, không sửa xâu cũ.",
    goc: { t: "Xử lí xâu trong Python", p: "xâu không sửa được từng kí tự — mọi thao tác đều tạo ra kết quả mới" },
    muc: [
      { t: "Tách", p: "`s.split(\" \")` → danh sách các từ" },
      { t: "Ghép", p: "`\" \".join(ds)` → nối danh sách thành xâu" },
      { t: "Tìm", p: "`\"an\" in s`, `s.find(\"an\")`, `s.count(\"a\")`" },
      { t: "Chỉnh", p: "`s.strip()`, `s.lower()`, `s.replace(a, b)`" },
    ],
    ghi: "Cặp `split` và `join` là **ngược nhau** và hay đi cùng: tách ra để xử lí từng phần, rồi ghép lại. Chú ý `find` trả về **−1** khi không thấy (chứ không báo lỗi), nên phải kiểm trước khi dùng kết quả.",
  });

  G("C10-33", {
    kieu: "luong", mau: "warning",
    ten: "Dữ liệu đi vào và đi ra khỏi một hàm",
    mo: "Năm chặng này giải thích vì sao sửa biến trong hàm thường **không** ảnh hưởng ra ngoài.",
    muc: [
      { t: "Đối số", p: "giá trị em đưa vào lúc gọi: `tinh(3, 4)`" },
      { t: "Tham số", p: "tên biến trong `def tinh(a, b):` nhận giá trị đó" },
      { t: "Thân hàm", p: "tính toán trên **biến cục bộ**" },
      { t: "`return`", p: "gửi kết quả ra ngoài" },
      { t: "Nơi gọi", p: "`s = tinh(3, 4)` nhận được giá trị" },
    ],
    ghi: "Với số và xâu, hàm nhận **bản sao giá trị** nên gán lại bên trong không đụng tới biến ngoài. Nhưng với **danh sách** thì hàm nhận chính danh sách đó — `ds.append(5)` trong hàm **có** làm đổi danh sách bên ngoài. Đây là chỗ khác biệt hay gây lỗi khó tìm nhất.",
  });

  G("C10-21", {
    kieu: "cay",
    ten: "Các nhóm nghề trong lĩnh vực tin học",
    mo: "Không phải nghề tin học nào cũng viết chương trình.",
    goc: { t: "Nghề tin học", p: "chia theo việc chính hằng ngày, không theo bằng cấp" },
    muc: [
      { t: "Phát triển phần mềm", p: "lập trình viên, kiểm thử, phân tích nghiệp vụ" },
      { t: "Dữ liệu và AI", p: "phân tích dữ liệu, kĩ sư học máy" },
      { t: "Hạ tầng và an ninh", p: "quản trị mạng, hệ thống, an toàn thông tin" },
      { t: "Thiết kế và nội dung số", p: "đồ hoạ, giao diện, dựng phim" },
    ],
    ghi: "Hai năng lực mọi nhóm đều cần, và trường phổ thông dạy được: **tư duy giải quyết vấn đề** và **tự học công nghệ mới** — vì công cụ trong ngành này đổi vài năm một lần.",
  });

  /* ============================================== LỚP 12 — phần còn thiếu */

  G("C12-22", {
    kieu: "tang", mau: "danger",
    ten: "Phân quyền khi dùng chung trong mạng nội bộ",
    mo: "Nguyên tắc: **cho quyền thấp nhất mà người ta vẫn làm được việc**.",
    tren: "quyền cao", duoi: "quyền thấp",
    muc: [
      { t: "Toàn quyền", p: "sửa, xoá, và **đổi quyền của người khác**" },
      { t: "Đọc và ghi", p: "thêm, sửa, xoá tệp trong thư mục" },
      { t: "Chỉ đọc", p: "mở và chép về, không sửa được bản gốc" },
      { t: "Không có quyền", p: "không nhìn thấy thư mục" },
    ],
    ghi: "Ba việc phải làm khi chia sẻ trong phòng máy: **đặt quyền đúng mức**, **không chia sẻ ổ đĩa cả ổ** (chỉ chia sẻ thư mục cần), và **tắt chia sẻ khi xong việc**. Máy in dùng chung cũng vậy: nên đặt hàng chờ để in theo lượt.",
  });

  G("C12-06", {
    kieu: "tang", mau: "danger",
    ten: "Bốn lớp quy tắc trong môi trường số",
    mo: "Từ dưới lên: lớp dưới là thói quen, lớp trên có **chế tài** thật.",
    tren: "ràng buộc mạnh nhất", duoi: "tự giác",
    muc: [
      { t: "Pháp luật", p: "Luật An ninh mạng, Luật Sở hữu trí tuệ, bảo vệ dữ liệu cá nhân" },
      { t: "Quy định của tổ chức", p: "nội quy trường, quy chế công ty" },
      { t: "Đạo đức nghề nghiệp", p: "không dùng dữ liệu người khác vào việc họ không đồng ý" },
      { t: "Văn hoá ứng xử", p: "lịch sự, không công kích, kiểm tin trước khi chia sẻ" },
    ],
    ghi: "Ba việc học sinh hay phạm mà không biết: **chép bài trên mạng không ghi nguồn**, **đăng ảnh người khác khi chưa hỏi**, và **chia sẻ lại tin sai**. Cả ba đều không cần kĩ năng gì đặc biệt để tránh — chỉ cần dừng lại vài giây trước khi bấm.",
  });

  G("C12-23", {
    kieu: "cay", mau: "success",
    ten: "Ba thẻ đưa nội dung đa phương tiện lên trang",
    mo: "Cả ba đều nhúng nội dung vào trang, nhưng **nguồn** khác nhau.",
    goc: { t: "Nội dung đa phương tiện", p: "âm thanh, phim, hoặc cả một trang khác nhúng vào" },
    muc: [
      { t: "`<audio controls>`", p: "phát nhạc, có thanh điều khiển" },
      { t: "`<video controls>`", p: "phát phim từ tệp của mình" },
      { t: "`<iframe>`", p: "nhúng **trang khác**: YouTube, bản đồ" },
    ],
    ghi: "Nhớ hai điều: phải có thuộc tính **`controls`** thì người xem mới có nút bấm; và **đừng để `autoplay`** — trình duyệt thường chặn, mà có phát được thì người xem cũng khó chịu. Với `<iframe>` thì nội dung nằm trên máy chủ của người khác, họ gỡ đi là trang mình trống chỗ đó.",
  });

  G("C12-24", {
    kieu: "luong", mau: "info",
    ten: "Dữ liệu đi từ ô nhập tới máy chủ",
    mo: "Chặng cuối là chỗ nhiều người tưởng nhầm — trang **tĩnh** thì dữ liệu **không đi đâu cả**.",
    muc: [
      { t: "Người dùng nhập", p: "gõ vào các ô `<input>`" },
      { t: "Ghép cặp tên–giá trị", p: "thuộc tính `name` thành tên, nội dung ô thành giá trị" },
      { t: "Bấm Gửi", p: "`<input type=\"submit\">`" },
      { t: "Gửi tới `action`", p: "bằng phương thức `GET` hoặc `POST`" },
      { t: "Máy chủ xử lí", p: "cần **chương trình phía máy chủ** mới nhận và lưu được" },
    ],
    ghi: "Ô nào **không có `name`** thì dữ liệu của nó **không được gửi đi** — lỗi âm thầm hay gặp. Và `GET` đưa dữ liệu lên thanh địa chỉ nên **không dùng cho mật khẩu**; dữ liệu nhạy cảm phải dùng `POST`.",
  });

  G("C12-10", {
    kieu: "tang", mau: "success",
    ten: "Ba cách áp dụng CSS, từ ưu tiên cao xuống thấp",
    mo: "Cả ba cùng có thì cách **mạnh hơn** thắng, không phải cách viết sau thắng.",
    tren: "ưu tiên cao nhất", duoi: "thấp nhất",
    muc: [
      { t: "Trong thẻ (inline)", p: "`<p style=\"color:red\">` — chỉ cho **một** phần tử" },
      { t: "Trong trang (internal)", p: "`<style>` ở `<head>` — cho **một** trang" },
      { t: "Tệp riêng (external)", p: "`<link rel=\"stylesheet\">` — cho **cả website**" },
    ],
    ghi: "Cách nên dùng là **tệp riêng**, dù nó ưu tiên thấp nhất: sửa một tệp là cả trăm trang đổi theo. Cách inline tuy mạnh nhất nhưng phải sửa từng thẻ, và trộn hình thức vào giữa nội dung — đúng thứ mà CSS sinh ra để tách khỏi nhau.",
  });

  G("C12-26", {
    kieu: "doi", mau: "warning",
    ten: "`width` đo phần nào của hộp?",
    mo: "Cùng đặt `width: 200px` mà hai khối rộng khác nhau trên màn hình — vì `box-sizing` khác nhau.",
    a: { t: "`content-box` (mặc định)", y: ["`width` chỉ đo **phần nội dung**", "padding và border **cộng thêm** vào", "`200 + 20×2 + 2×2 = 244px` thật", "Đặt hai khối 50% cạnh nhau là **tràn hàng**"] },
    b: { t: "`border-box`", y: ["`width` đo **cả** padding và border", "Thêm padding thì nội dung hẹp lại", "Đặt `200px` là rộng **đúng 200px**", "Hai khối 50% luôn vừa một hàng"] },
    hoi: "Vì vậy hầu hết dự án web đặt ngay từ đầu: `* { box-sizing: border-box; }`. Nó làm con số mình viết **đúng bằng** thứ nhìn thấy trên màn hình.",
  });

  G("C12-13", {
    kieu: "vong", mau: "success",
    ten: "Dựng một trang web nhỏ, theo vòng",
    mo: "Đừng viết hết HTML rồi mới mở xem — **xem sau mỗi phần nhỏ** thì lỗi lộ ra ngay.",
    muc: [
      { t: "Dựng khung HTML", p: "header, nav, main, footer" },
      { t: "Đổ nội dung", p: "chữ, ảnh, liên kết" },
      { t: "Thêm CSS", p: "màu, phông, khoảng cách, bố cục" },
      { t: "Mở xem và sửa", p: "thu hẹp cửa sổ thử khổ điện thoại" },
    ],
    quayLai: "rồi làm tiếp phần sau — mỗi vòng chỉ thêm một phần nhỏ",
    ghi: "Tổ chức thư mục ngay từ đầu: `index.html` ở gốc, ảnh trong `anh/`, kiểu dáng trong `css/`. Và luôn dùng **đường dẫn tương đối** — `file:///D:/...` chạy trên máy mình nhưng chết ngay khi đưa lên mạng.",
  });

  G("C12-14", {
    kieu: "cay", mau: "info",
    ten: "Bốn hướng nghề trong ngành công nghệ thông tin",
    mo: "Chọn hướng nào tuỳ **việc em thích làm hằng ngày**, không tuỳ mức lương lúc mới ra trường.",
    goc: { t: "Ngành công nghệ thông tin", p: "cùng nền tảng, nhưng công việc hằng ngày rất khác nhau" },
    muc: [
      { t: "Làm ra sản phẩm", p: "lập trình, kiểm thử, thiết kế giao diện" },
      { t: "Làm việc với dữ liệu", p: "phân tích dữ liệu, học máy" },
      { t: "Giữ hệ thống chạy", p: "quản trị mạng, hệ thống, an toàn thông tin" },
      { t: "Nối kĩ thuật với người dùng", p: "quản lí dự án, tư vấn, hỗ trợ" },
    ],
    ghi: "Hai thứ chuẩn bị được ngay từ phổ thông và dùng cho mọi hướng: **tư duy giải quyết vấn đề** và **tiếng Anh đọc tài liệu**. Công cụ cụ thể thì đổi vài năm một lần, học sau cũng kịp.",
  });

  G("C12-28", {
    kieu: "luong", mau: "warning",
    ten: "Từ dữ liệu thô tới bảng số liệu dùng được",
    mo: "Bước **2** và **3** thường chiếm phần lớn thời gian của cả công việc.",
    muc: [
      { t: "Dữ liệu thô", p: "phiếu khảo sát, tệp xuất từ hệ thống" },
      { t: "Kiểm tra", p: "thiếu ô, trùng dòng, sai kiểu, sai đơn vị" },
      { t: "Làm sạch", p: "bỏ trùng, xử lí ô trống, thống nhất đơn vị" },
      { t: "Chuẩn hoá", p: "mỗi cột một thuộc tính, mỗi dòng một đối tượng" },
      { t: "Bảng dùng được", p: "phân tích và vẽ biểu đồ được ngay" },
    ],
    ghi: "Ba lỗi hay gặp nhất trong dữ liệu thật: **ô trống** (bỏ dòng hay điền giá trị thay thế?), **cùng một thứ ghi nhiều kiểu** (“12A”, “12 A”, “Lớp 12A”), và **lẫn đơn vị** (kg với gam trong cùng một cột). Nguyên tắc: **dữ liệu vào rác thì kết quả ra rác**.",
  });

  G("C12-29", {
    kieu: "luong", mau: "warning",
    ten: "Từ bảng số liệu đến một kết luận đáng tin",
    mo: "Bước **3** là bước phân biệt đọc số với **hiểu** số.",
    muc: [
      { t: "Đọc bảng", p: "mỗi dòng, mỗi cột nghĩa là gì? đơn vị nào?" },
      { t: "Tính chỉ số", p: "tổng, trung bình, trung vị, lớn nhất, nhỏ nhất" },
      { t: "Soi giá trị lạ", p: "có số nào bất thường kéo lệch kết quả không?" },
      { t: "So sánh", p: "so với kì trước, với nhóm khác, với mục tiêu" },
      { t: "Kết luận", p: "nói rõ **giới hạn** của kết luận đó" },
    ],
    ghi: "Nhớ một cặp: **trung bình** bị một giá trị cực đoan kéo lệch, **trung vị** thì không. Bảng lương có một người thu nhập rất cao thì trung bình vô nghĩa — phải nhìn trung vị. Và tương quan **không phải** nhân quả: hai đại lượng cùng tăng chưa chắc cái này gây ra cái kia.",
  });

  /* Bài này không có cơ chế nào để bấm từng bước — nó là chuẩn mực ứng xử, chứ
     không phải một quy trình máy chạy. Ép làm mô phỏng chỉ ra hình thức, nên
     dùng "cay" để phân loại: cái được phép, cái phải xin phép, cái cấm hẳn. */
  G("C10-08", {
    kieu: "cay", mau: "warning",
    ten: "Dùng lại sản phẩm của người khác: được, phải xin phép, hay cấm?",
    mo: "Câu hỏi cần trả lời trước khi tải, chép hay đăng lại bất cứ thứ gì: **mình có quyền gì với thứ này?**",
    goc: { t: "Một sản phẩm số trên mạng", p: "ảnh, nhạc, phim, phần mềm, bài viết, mã nguồn" },
    muc: [
      { t: "Tự do dùng", p: "hết hạn bảo hộ, hoặc tác giả ghi rõ **miễn phí dùng lại** (giấy phép mở, phạm vi công cộng)" },
      { t: "Dùng được nhưng **có điều kiện**", p: "giấy phép **Creative Commons**: thường buộc **ghi tên tác giả**, có loại cấm dùng để kiếm tiền, có loại cấm sửa đổi" },
      { t: "Phải **xin phép** hoặc **trả tiền**", p: "phần mềm thương mại, nhạc, phim, ảnh có bản quyền — mua giấy phép mới được dùng" },
      { t: "**Cấm** dù có xin phép", p: "bẻ khoá, phát tán bản lậu, đăng lại thông tin riêng tư của người khác" },
    ],
    ghi: "Ba chỗ hay hiểu sai. **(1)** “Tải được về” không có nghĩa là “được phép dùng” — không khoá không phải là cho phép. **(2)** **Ghi nguồn không thay được xin phép**: dẫn nguồn là phép lịch sự và là yêu cầu của một số giấy phép, nhưng với sản phẩm có bản quyền thì vẫn phải xin phép. **(3)** Dùng cho **mục đích học tập** cũng không tự động miễn trừ; nó chỉ được nới ở phạm vi rất hẹp. Ở Việt Nam, quyền tác giả do **Luật Sở hữu trí tuệ** bảo hộ, và hành vi trên mạng còn chịu **Luật An ninh mạng**.",
  });
})();
