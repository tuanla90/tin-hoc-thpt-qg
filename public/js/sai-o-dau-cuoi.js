/* ============================================================================
 *  NỘI DUNG "SAI Ở ĐÂU?" — ĐỢT 3: 18 bài cuối của lớp 10 và lớp 12
 *
 *  Nạp SAU js/sai-o-dau.js. Xem quy ước định dạng ở đầu js/sai-o-dau-10.js.
 *  Sau đợt này thì cả 119 bài đều có khối này.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SaiODau) return;
  var K = window.SaiODau.dangKy;

  /* ============================================== LỚP 10 — phần còn thiếu */

  K("C10-03", [{
    de: "Bốn phát biểu về thiết bị số. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Mọi thiết bị số đều lưu và xử lí dữ liệu dưới dạng **dãy bit**.",
        vi: "Đúng, và chính vì cùng một cách mã hoá nên thiết bị của các hãng khác nhau mới trao đổi dữ liệu được với nhau." },
      { t: "Điện thoại thông minh không phải là máy tính vì nó không có bàn phím rời.",
        sai: true,
        vi: "Sai. Nó có đủ **bộ xử lí, bộ nhớ, thiết bị vào/ra** và chạy được nhiều chương trình khác nhau — đúng định nghĩa máy tính. Hình dáng không quyết định." },
      { t: "Thiết bị **IoT** như camera hay khoá cửa thông minh cũng cần được cập nhật phần mềm.",
        vi: "Đúng, và hay bị quên. Camera an ninh không bao giờ cập nhật là một trong những cửa vào phổ biến nhất của kẻ tấn công vào mạng gia đình." },
      { t: "Thiết bị số nào cũng phải nối Internet mới hoạt động được.",
        sai: true,
        vi: "Sai. Máy tính bỏ túi, máy ảnh số, đồng hồ đeo tay số đều là thiết bị số mà không cần mạng. Kết nối làm chúng **hữu ích hơn**, không phải điều kiện để chạy." },
    ],
    chot: "Ba bộ phận chung của mọi thiết bị số: **bộ xử lí · bộ nhớ · thiết bị vào ra**. Cứ có đủ ba thứ đó và xử lí dữ liệu số thì là thiết bị số.",
  }]);

  K("C10-27", [{
    de: "Bốn phát biểu về giấy phép phần mềm. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Phần mềm **miễn phí** (freeware) thì đương nhiên là phần mềm **nguồn mở**.",
        sai: true,
        vi: "Sai, và là chỗ lẫn phổ biến nhất. Miễn phí nói về **giá**; nguồn mở nói về **quyền xem và sửa mã nguồn**. Rất nhiều phần mềm miễn phí nhưng mã nguồn hoàn toàn đóng." },
      { t: "Phần mềm nguồn mở vẫn có giấy phép, và giấy phép đó vẫn ràng buộc người dùng.",
        vi: "Đúng. Nhiều giấy phép buộc phải giữ tên tác giả, hoặc buộc phải mở nguồn cả bản mình sửa lại." },
      { t: "Dùng bản “crack” của phần mềm thương mại chỉ vi phạm khi đem đi bán lại.",
        sai: true,
        vi: "Sai. **Cài và dùng** đã là vi phạm bản quyền rồi, không cần bán lại. Ngoài ra bản crack là đường lây mã độc rất phổ biến, vì người dùng tự tay cấp quyền cài đặt." },
      { t: "Bản **dùng thử (trial)** thường giới hạn thời gian hoặc giới hạn tính năng.",
        vi: "Đúng, đó là mô hình cho dùng trước rồi mới quyết định mua." },
    ],
    chot: "Bốn loại cần phân biệt: **thương mại · dùng thử · miễn phí · nguồn mở**. Hai chữ dễ lẫn nhất: *miễn phí* nói về tiền, *nguồn mở* nói về mã.",
  }]);

  K("C10-09", [{
    de: "Bốn phát biểu về đồ hoạ vector và đồ hoạ điểm ảnh. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Ảnh **vector** phóng to bao nhiêu lần cũng không bị vỡ hạt.",
        vi: "Đúng. Nó lưu công thức hình học nên phóng to là tính lại, chứ không phải kéo giãn các điểm ảnh có sẵn." },
      { t: "Ảnh chụp bằng điện thoại nên lưu ở dạng **vector** cho nhẹ và nét.",
        sai: true,
        vi: "Sai. Không có công thức hình học nào mô tả được từng chi tiết của một khuôn mặt hay một tán lá. Ảnh chụp bắt buộc là **điểm ảnh** (`.jpg`, `.png`)." },
      { t: "Logo của trường nên làm bằng **vector** để in được cả trên danh thiếp lẫn biển hiệu lớn.",
        vi: "Đúng, và đây là lí do chính khiến vector tồn tại: một tệp dùng cho mọi kích thước mà đều sắc nét." },
      { t: "Xuất ảnh vector ra `.png` rồi vẫn tách được từng hình ra chỉnh sửa như cũ.",
        sai: true,
        vi: "Sai. Xuất ra `.png` là **chuyển thành điểm ảnh** — mọi hình gộp thành một lưới màu, không còn hình riêng nào để chọn. Phải giữ lại bản `.svg` gốc." },
    ],
    chot: "Vector lưu **công thức**, bitmap lưu **từng điểm ảnh**. Ảnh chụp thì bitmap, hình vẽ và logo thì vector.",
  }]);

  K("C10-10", [{
    de: "Bốn thao tác bạn Nam làm khi vẽ vector. Có **hai** chỗ hiểu sai.",
    loai: "y",
    dong: [
      { t: "**Nhóm (group)** nhiều hình lại thì kéo, xoay, phóng to cả cụm mà tỉ lệ giữa chúng không đổi.",
        vi: "Đúng, và là công cụ tiết kiệm thời gian nhất mà người mới hay bỏ quên." },
      { t: "Phóng to một hình vector làm đường viền của nó dày lên theo, nên phải vẽ lại.",
        sai: true,
        vi: "Sai. Phần mềm vector cho chọn **có co giãn nét viền theo hay không**. Và kể cả có dày lên thì chỉnh lại độ dày nét là xong, không phải vẽ lại gì cả." },
      { t: "Nên ghép hình phức tạp từ các **hình cơ bản** thay vì cố vẽ tay một nét duy nhất.",
        vi: "Đúng. Hình ghép từ chữ nhật, elip, đa giác thì chỉnh lại từng phần được; một nét vẽ tay thì sửa rất khó." },
      { t: "Thứ tự lớp không quan trọng trong đồ hoạ vector vì các hình đều là công thức.",
        sai: true,
        vi: "Sai. Hình vẽ sau vẫn **che** hình vẽ trước ở chỗ chúng chồng nhau, y như trong phần mềm chỉnh ảnh. Vì vậy mới có lệnh đưa lên trên, đưa xuống dưới." },
    ],
    chot: "Ba việc làm bản vẽ dễ sửa về sau: **ghép từ hình cơ bản**, **nhóm những phần đi với nhau**, và **lưu bản `.svg` gốc**.",
  }]);

  K("C10-28", [{
    de: "Bốn phát biểu về nắn nét và chọn định dạng bản vẽ. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "`.svg` là định dạng vector, mở lại vẫn chỉnh được từng hình.",
        vi: "Đúng, và vì vậy đây là định dạng để **lưu bản gốc**." },
      { t: "`.jpg` giữ được **nền trong suốt** nên hợp để làm logo dán lên nền màu.",
        sai: true,
        vi: "Sai — `.jpg` **không** hỗ trợ nền trong suốt, chỗ trong suốt sẽ thành nền trắng. Muốn nền trong suốt thì dùng **`.png`** (hoặc `.svg`)." },
      { t: "Muốn đem đi in đúng khổ giấy và đúng phông chữ thì xuất ra **`.pdf`**.",
        vi: "Đúng. PDF nhúng cả phông chữ và giữ khổ trang, nên nhà in mở ra thấy đúng như mình thấy." },
      { t: "Xuất ra `.png` xong thì xoá tệp `.svg` đi cho gọn, vì `.png` đẹp hơn.",
        sai: true,
        vi: "Sai và rất tai hại. `.png` là điểm ảnh — xoá `.svg` là mất khả năng sửa và mất khả năng phóng to không vỡ. Luôn **giữ bản gốc**." },
    ],
    chot: "Chọn theo việc người nhận sẽ làm: **`.svg` để sửa · `.png` khi cần nền trong suốt · `.jpg` cho ảnh chụp · `.pdf` để in**.",
  }]);

  K("C10-32", [{
    de: "Đoạn chương trình đếm số từ trong một câu và tìm từ “Tin”. Có **hai** dòng sai.",
    loai: "ma",
    dong: [
      { t: "s = \"  Hoc Tin hoc rat vui  \"",
        vi: "Dữ liệu, có thừa khoảng trắng hai đầu — cố ý, để bước sau phải xử lí." },
      { t: "tu = s.split()",
        vi: "Đúng, và là cách viết tốt: `split()` không tham số tự bỏ khoảng trắng thừa và tách theo mọi khoảng trắng. Viết `split(\" \")` mới sinh ra phần tử rỗng." },
      { t: "print(\"Số từ:\", len(tu()))",
        sai: true,
        vi: "Lỗi. `len` nhận danh sách chứ không gọi `tu()` như một hàm — `tu` là **danh sách**, không phải hàm. Phải viết `len(tu)`." },
      { t: "if s.find(\"Tin\"):\n    print(\"Có chữ Tin\")",
        sai: true,
        vi: "Sai về lôgic, và không báo lỗi nên rất khó phát hiện. `find` trả về **vị trí**, mà vị trí **0** thì Python coi là **sai**. Nên nếu “Tin” đứng ngay đầu câu thì câu lệnh này lại bỏ qua. Phải viết `if \"Tin\" in s:` hoặc `if s.find(\"Tin\") != -1:`." },
    ],
    chot: "Hai điều phải nhớ: `split()` **không tham số** an toàn hơn `split(\" \")`; và `find` trả về **−1** khi không thấy, nên đừng dùng thẳng nó làm điều kiện.",
  }]);

  K("C10-33", [{
    de: "Bốn phát biểu về truyền tham số và giá trị trả về. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Đối số** là giá trị đưa vào lúc gọi; **tham số** là tên biến nhận giá trị đó trong `def`.",
        vi: "Đúng — hai từ này chỉ hai đầu của cùng một việc truyền dữ liệu." },
      { t: "Gán lại cho một tham số **kiểu số** bên trong hàm thì biến ở ngoài cũng đổi theo.",
        sai: true,
        vi: "Sai. Với số và xâu, hàm làm việc trên **bản sao giá trị**; gán lại bên trong không đụng tới biến ngoài." },
      { t: "Truyền một **danh sách** vào hàm rồi `ds.append(5)` thì danh sách bên ngoài **cũng** dài thêm.",
        vi: "Đúng, và là chỗ khác biệt gây lỗi khó tìm nhất của bài này. Hàm nhận chính danh sách đó, không phải bản sao — nên sửa nội dung là sửa thật." },
      { t: "Một hàm chỉ được có **một** lệnh `return` trong toàn bộ thân hàm.",
        sai: true,
        vi: "Sai. Viết nhiều `return` ở nhiều nhánh khác nhau là bình thường và thường còn dễ đọc hơn. Điều đúng là: **chạy tới `return` đầu tiên thì hàm kết thúc ngay**, các dòng sau không chạy nữa." },
    ],
    chot: "Nhớ ranh giới: **gán lại** một tham số thì chỉ đổi bên trong; **sửa nội dung** của danh sách truyền vào thì đổi cả bên ngoài.",
  }]);

  K("C10-21", [{
    de: "Bốn phát biểu về nghề nghiệp trong lĩnh vực tin học. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Làm tin học thì nhất định phải giỏi lập trình.",
        sai: true,
        vi: "Sai. Quản trị mạng, an toàn thông tin, thiết kế giao diện, quản lí dự án đều là nghề tin học mà công việc chính hằng ngày không phải viết mã." },
      { t: "Hai năng lực dùng được cho mọi hướng là **tư duy giải quyết vấn đề** và **tự học công nghệ mới**.",
        vi: "Đúng, vì công cụ trong ngành đổi vài năm một lần — cái học được ở phổ thông phải là cách nghĩ, không phải một phần mềm cụ thể." },
      { t: "Nhiều nghề tin học đòi hỏi làm việc nhóm và giao tiếp với người không rành kĩ thuật.",
        vi: "Đúng. Hiểu đúng nhu cầu của người dùng thường khó hơn phần viết mã." },
      { t: "Học xong một ngôn ngữ lập trình là đủ dùng cho cả sự nghiệp.",
        sai: true,
        vi: "Sai. Ngôn ngữ và công cụ thay đổi liên tục. Nhưng có mặt đúng: học **kĩ một ngôn ngữ đầu tiên** thì học ngôn ngữ thứ hai rất nhanh, vì các khái niệm gốc giống nhau." },
    ],
    chot: "Bốn nhóm nghề: **làm ra sản phẩm · làm việc với dữ liệu · giữ hệ thống chạy · nối kĩ thuật với người dùng**.",
  }]);

  /* ============================================== LỚP 12 — phần còn thiếu */

  K("C12-22", [{
    de: "Bốn việc khi dùng chung trong mạng phòng máy. Có **hai** việc làm sai.",
    loai: "y",
    dong: [
      { t: "Chia sẻ **cả ổ đĩa C** cho tiện, khỏi phải chọn từng thư mục.",
        sai: true,
        vi: "Rất nguy hiểm. Chia sẻ cả ổ là mở luôn thư mục hệ thống và mọi tài liệu cá nhân trên máy đó. Chỉ chia sẻ **đúng thư mục cần dùng chung**." },
      { t: "Đặt quyền **chỉ đọc** cho thư mục tài liệu mà cả lớp chỉ cần chép về.",
        vi: "Đúng — nguyên tắc quyền tối thiểu. Cho quyền ghi thì một bạn xoá nhầm là mất của cả lớp." },
      { t: "**Tắt chia sẻ** khi đã xong việc.",
        vi: "Đúng. Thư mục mở suốt trong mạng phòng máy nghĩa là ai ngồi vào máy nào cũng vào được." },
      { t: "Máy in dùng chung thì ai gửi lệnh in sau sẽ được in trước cho nhanh.",
        sai: true,
        vi: "Sai. Hàng chờ in hoạt động theo **hàng đợi**: ai gửi trước in trước (FIFO). Đó cũng là cách công bằng." },
    ],
    chot: "Ba nguyên tắc chia sẻ trong mạng nội bộ: **chỉ chia sẻ thư mục cần · cho quyền thấp nhất đủ dùng · tắt khi xong**.",
  }]);

  K("C12-06", [{
    de: "Bốn tình huống trong môi trường số. Có **hai** phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Đăng ảnh chụp chung có mặt bạn bè lên mạng thì nên **hỏi ý kiến họ trước**.",
        vi: "Đúng. Hình ảnh cá nhân là dữ liệu của họ, và một khi đã lên mạng thì gần như không gỡ sạch được." },
      { t: "Chép nguyên một đoạn trên mạng vào bài tập là được, miễn không nộp lấy điểm cao.",
        sai: true,
        vi: "Sai. Chép mà không ghi nguồn là **đạo văn**, bất kể điểm số. Cách đúng là diễn đạt lại bằng lời mình và ghi rõ nguồn tham khảo." },
      { t: "Chia sẻ lại một tin sai thì người chia sẻ **cũng có phần trách nhiệm**.",
        vi: "Đúng. Chia sẻ chính là thứ làm tin sai lan ra — trách nhiệm kiểm tra thuộc về người bấm nút chia sẻ." },
      { t: "Trên mạng dùng tên ẩn danh thì không phải chịu trách nhiệm pháp lí về lời mình viết.",
        sai: true,
        vi: "Sai. Ẩn danh chỉ giấu tên với người đọc, không xoá được dấu vết kĩ thuật, và **pháp luật vẫn áp dụng** với hành vi xúc phạm hay vu khống trên mạng." },
    ],
    chot: "Bốn lớp từ nhẹ đến nặng: **văn hoá ứng xử → đạo đức nghề nghiệp → quy định của tổ chức → pháp luật**. Lớp trên có chế tài thật.",
  }]);

  K("C12-23", [{
    de: "Đoạn HTML nhúng nhạc, phim và bản đồ. Có **hai** dòng sai.",
    loai: "ma",
    dong: [
      { t: "<audio src=\"nhac/nen.mp3\" controls></audio>",
        vi: "Đúng. Có `controls` nên người xem thấy nút phát, tua và chỉnh âm lượng." },
      { t: "<video src=\"phim/gioi-thieu.mp4\"></video>",
        sai: true,
        vi: "Thiếu **`controls`**. Phim hiện ra một khung đứng im, không có nút nào để bấm — người xem tưởng trang bị lỗi. Phải là `<video src=\"...\" controls></video>`." },
      { t: "<iframe src=\"https://www.google.com/maps/embed?...\" width=\"400\" height=\"300\"></iframe>",
        vi: "Đúng. `<iframe>` nhúng **cả một trang khác** vào trang của mình — đây là cách chèn bản đồ hoặc video YouTube." },
      { t: "<video src=\"phim/nhac-nen.mp4\" autoplay></video>",
        sai: true,
        vi: "Sai về cả kĩ thuật lẫn trải nghiệm. Trình duyệt hiện nay **chặn autoplay có tiếng**, nên thường không chạy; mà chạy được thì nhạc bật đột ngột cũng làm người xem đóng trang ngay. Và vẫn thiếu `controls`." },
    ],
    chot: "Hai điều luôn phải nhớ với `<audio>` và `<video>`: **có `controls`**, **không `autoplay`**. Với `<iframe>` thì nội dung nằm trên máy chủ người khác — họ gỡ là trang mình trống chỗ đó.",
  }]);

  K("C12-24", [{
    de: "Biểu mẫu đăng kí của một trang web. Có **hai** dòng sai.",
    loai: "ma",
    dong: [
      { t: "<form action=\"/dang-ki\" method=\"post\">",
        vi: "Đúng. `action` là nơi gửi tới, `method=\"post\"` hợp cho dữ liệu cần kín đáo." },
      { t: "  <label for=\"ht\">Họ tên</label>\n  <input type=\"text\" id=\"ht\" name=\"ho_ten\">",
        vi: "Đúng, và viết tốt: `<label for>` khớp với `id` nên bấm vào chữ cũng vào được ô, trình đọc màn hình cũng đọc đúng tên ô." },
      { t: "  <input type=\"text\" id=\"email\">",
        sai: true,
        vi: "Thiếu thuộc tính **`name`**. Ô nào không có `name` thì dữ liệu của nó **không được gửi đi** — biểu mẫu vẫn chạy, vẫn nhập được, chỉ là máy chủ không nhận được gì. Lỗi âm thầm rất khó phát hiện." },
      { t: "  <input type=\"password\" name=\"mat_khau\">\n</form>",
        vi: "Đúng, và đúng chỗ: `type=\"password\"` che kí tự khi gõ. Nó dùng được ở đây vì biểu mẫu đã đặt `method=\"post\"` ở dòng đầu." },
      { t: "  <input type=\"submit\" value=\"Đăng kí\" method=\"get\">",
        sai: true,
        vi: "Sai: **`method` là thuộc tính của `<form>`, không phải của `<input>`** — viết ở đây trình duyệt bỏ qua. Ngoài ra `GET` đưa dữ liệu lên thanh địa chỉ nên **không bao giờ dùng cho mật khẩu**." },
    ],
    chot: "Ba thứ dễ quên: **`name` cho mọi ô cần gửi**, **`label` cho mọi ô**, và **`method` đặt ở `<form>`**. Mật khẩu thì luôn `POST`.",
  }]);

  K("C12-10", [{
    de: "Bốn phát biểu về cách áp dụng CSS. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Đặt CSS trong **tệp riêng** rồi liên kết vào thì sửa một tệp là cả website đổi theo.",
        vi: "Đúng, và đó là lí do đây là cách nên dùng dù nó có độ ưu tiên thấp nhất." },
      { t: "Viết `style=\"...\"` thẳng trong thẻ là cách nên dùng vì nó có ưu tiên cao nhất.",
        sai: true,
        vi: "Sai. Ưu tiên cao đúng, nhưng phải sửa **từng thẻ một** và nó trộn hình thức vào giữa nội dung — đúng thứ mà CSS sinh ra để tách ra. Chỉ dùng khi thật sự cần đè một chỗ duy nhất." },
      { t: "Hai quy tắc cùng nhắm vào một phần tử thì quy tắc **viết sau luôn thắng**.",
        sai: true,
        vi: "Sai — chỉ đúng khi **độ ưu tiên bằng nhau**. Một quy tắc `#id` viết ở đầu tệp vẫn thắng một quy tắc `.class` viết ở cuối." },
      { t: "Thẻ `<style>` đặt trong `<head>` áp dụng cho **cả trang đó**, không sang trang khác.",
        vi: "Đúng. Muốn dùng chung cho nhiều trang thì phải đưa ra tệp `.css` riêng." },
    ],
    chot: "Ba cách theo ưu tiên: **tệp riêng < trong trang < trong thẻ**. Nên dùng **tệp riêng** — ưu tiên thấp nhưng dễ bảo trì nhất.",
  }]);

  K("C12-26", [{
    de: "Bốn phát biểu về kích thước khung và khoảng cách trong CSS. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Đặt `width: 200px` cùng `padding: 20px` thì khối chiếm **đúng 200px** trên màn hình.",
        sai: true,
        vi: "Sai theo mặc định (`content-box`): `width` chỉ đo **phần nội dung**, nên chiều rộng thật là 200 + 20×2 + viền = **hơn 240px**. Đây là lí do hai khối 50% đặt cạnh nhau lại tràn xuống hàng dưới." },
      { t: "Đặt `box-sizing: border-box` thì `width` tính **cả** padding và border.",
        vi: "Đúng, và vì vậy hầu hết dự án web đặt ngay `* { box-sizing: border-box; }` từ đầu — con số mình viết đúng bằng thứ nhìn thấy." },
      { t: "`margin: 0 auto` cùng với một `width` xác định thì căn khối vào **giữa** theo chiều ngang.",
        vi: "Đúng, đó là cách căn giữa cả khối kinh điển. Không có `width` thì khối tự chiếm hết chiều ngang nên không có gì để căn." },
      { t: "`max-width: 100%` cho ảnh là để phóng ảnh nhỏ lên cho vừa khung.",
        sai: true,
        vi: "Ngược. `max-width` chỉ **giới hạn trên** — nó **thu nhỏ** ảnh quá to cho vừa khung, chứ không phóng ảnh nhỏ lên. Đây chính là cách chữa lỗi trang trượt ngang trên điện thoại." },
    ],
    chot: "Ba dòng đáng thuộc lòng: `box-sizing: border-box` cho con số đúng nghĩa, `margin: 0 auto` để căn giữa, `max-width: 100%` cho ảnh khỏi tràn.",
  }]);

  K("C12-13", [{
    de: "Bốn quyết định khi dựng một trang web nhỏ. Có **hai** quyết định sai.",
    loai: "y",
    dong: [
      { t: "Viết xong **toàn bộ** HTML và CSS rồi mới mở trình duyệt xem lần đầu.",
        sai: true,
        vi: "Sai về cách làm. Lỗi dồn lại thì không biết cái nào gây ra cái nào. Nên **mở xem sau mỗi phần nhỏ** — thêm khung, xem; thêm CSS, xem." },
      { t: "Dùng **đường dẫn tương đối** (`anh/logo.png`) chứ không phải `file:///D:/...`.",
        vi: "Đúng. Đường dẫn tuyệt đối trên máy mình chạy được ở nhà nhưng chết ngay khi đưa lên mạng hoặc nộp bài." },
      { t: "Đặt CSS vào tệp riêng trong thư mục `css/` và liên kết bằng `<link>`.",
        vi: "Đúng, và giữ được cấu trúc thư mục gọn khi trang nhiều lên." },
      { t: "Thu hẹp cửa sổ trình duyệt để thử khổ điện thoại là không đáng tin, phải có máy thật.",
        sai: true,
        vi: "Sai. Thu hẹp cửa sổ **bắt được phần lớn lỗi bố cục**, nhất là lỗi trượt ngang — và làm được ngay, miễn phí. Có máy thật để thử thêm thì tốt, nhưng đừng vì thiếu máy mà bỏ luôn bước này." },
    ],
    chot: "Làm theo vòng nhỏ: **dựng khung → đổ nội dung → thêm CSS → mở xem và sửa**, rồi lặp lại cho phần tiếp theo.",
  }]);

  K("C12-14", [{
    de: "Bốn phát biểu về hướng nghiệp ngành công nghệ thông tin. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Ngành công nghệ thông tin có nhiều hướng khác nhau, không chỉ có lập trình.",
        vi: "Đúng: làm ra sản phẩm, làm việc với dữ liệu, giữ hệ thống chạy, nối kĩ thuật với người dùng." },
      { t: "Nên chọn hướng theo **mức lương lúc mới ra trường** vì đó là chỉ dấu đáng tin nhất.",
        sai: true,
        vi: "Sai. Mức lương khởi điểm thay đổi theo thị trường từng năm, còn việc mình làm **hằng ngày** thì gắn với mình rất lâu. Chọn theo việc mình chịu được và thấy thú vị mới bền." },
      { t: "Học tốt **toán và tiếng Anh** ở phổ thông giúp ích cho hầu hết các hướng.",
        vi: "Đúng. Toán cho tư duy lôgic và thuật toán; tiếng Anh để đọc tài liệu gốc, vì tài liệu mới gần như luôn ra bằng tiếng Anh trước." },
      { t: "Chỉ cần học ở trường là đủ, không cần làm dự án hay sản phẩm nào của riêng mình.",
        sai: true,
        vi: "Sai. Trong ngành này, **sản phẩm mình đã làm** nói lên nhiều hơn bảng điểm — dù chỉ là một trang web nhỏ hay một chương trình tự viết. Nó cũng là cách duy nhất để biết mình có thích công việc đó thật không." },
    ],
    chot: "Hai thứ chuẩn bị được ngay từ phổ thông và dùng cho mọi hướng: **tư duy giải quyết vấn đề** và **tiếng Anh đọc tài liệu**.",
  }]);

  K("C12-28", [{
    de: "Bốn việc khi làm sạch một bảng dữ liệu khảo sát. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Cùng một lớp được ghi thành “12A”, “12 A”, “Lớp 12A” thì phải **thống nhất về một cách viết**.",
        vi: "Đúng. Không thống nhất thì đếm ra ba nhóm khác nhau cho cùng một lớp — sai ngay ở bước thống kê đầu tiên." },
      { t: "Ô để trống thì cứ điền **số 0** cho đủ dữ liệu.",
        sai: true,
        vi: "Sai, và làm hỏng số liệu. “Không trả lời” khác hẳn “trả lời là 0” — điền 0 vào cột điểm sẽ kéo tụt trung bình. Phải quyết định rõ: bỏ dòng đó, hay đánh dấu là thiếu, hay điền giá trị thay thế có căn cứ." },
      { t: "Một cột cân nặng lẫn cả **kg và gam** thì phải quy về cùng một đơn vị trước khi tính.",
        vi: "Đúng. Đây là lỗi kín tiếng nhất: mọi con số đều “hợp lệ”, chỉ có kết quả cuối là vô nghĩa." },
      { t: "Dữ liệu lấy từ hệ thống chính thức thì sạch sẵn, không cần kiểm tra.",
        sai: true,
        vi: "Sai. Hệ thống nào cũng có ô nhập tay, có bản ghi trùng do nhập hai lần, có dữ liệu cũ theo quy ước khác. **Luôn kiểm trước khi dùng**." },
    ],
    chot: "Nguyên tắc trùm lên cả bài: **dữ liệu vào rác thì kết quả ra rác**. Phân tích tinh vi trên dữ liệu bẩn chỉ cho ra kết luận sai một cách rất thuyết phục.",
  }]);

  K("C12-29", [{
    de: "Bốn kết luận rút ra từ một bảng số liệu. Có **hai** kết luận sai.",
    loai: "y",
    dong: [
      { t: "Lương **trung bình** của công ty là 30 triệu, nên phần lớn nhân viên nhận khoảng 30 triệu.",
        sai: true,
        vi: "Sai. Chỉ cần vài người thu nhập rất cao là trung bình bị kéo lên, trong khi phần lớn nhân viên nhận thấp hơn nhiều. Với dữ liệu lệch kiểu này phải nhìn **trung vị**." },
      { t: "**Trung vị** không bị một vài giá trị cực đoan kéo lệch như trung bình.",
        vi: "Đúng. Trung vị là giá trị đứng giữa khi xếp thứ tự, nên một người lương cực cao chỉ đẩy nó lên một bậc." },
      { t: "Số ca cảm cúm và doanh số áo ấm cùng tăng vào tháng 12, vậy **mua áo ấm gây ra cảm cúm**.",
        sai: true,
        vi: "Sai — nhầm **tương quan** với **nhân quả**. Cả hai cùng tăng vì một nguyên nhân thứ ba: trời lạnh. Đây là bẫy hay ra nhất khi đọc số liệu." },
      { t: "Khi kết luận nên nói rõ **giới hạn**: dữ liệu lấy từ đâu, bao nhiêu mẫu, thời gian nào.",
        vi: "Đúng. Cùng một con số nhưng lấy từ 20 người hay 20.000 người thì mức đáng tin khác hẳn nhau." },
    ],
    chot: "Hai câu hỏi phải tự đặt trước mọi bảng số liệu: **“có giá trị nào cực đoan kéo lệch trung bình không?”** và **“hai thứ cùng tăng, hay thứ này gây ra thứ kia?”**",
  }]);
})();
