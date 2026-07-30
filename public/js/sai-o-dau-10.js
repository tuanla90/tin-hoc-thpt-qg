/* ============================================================================
 *  NỘI DUNG "SAI Ở ĐÂU?" — LỚP 10
 *
 *  Nạp SAU js/sai-o-dau.js. Mỗi mục có dạng:
 *    { de, loai: "y" | "ma", dong: [{ t, sai, vi }], chot }
 *  · loai "y"  — phát biểu, có hiểu **đậm** và `code`
 *  · loai "ma" — dòng code, giữ nguyên thụt lề, KHÔNG hiểu đậm (vì thụt lề và
 *                dấu sao trong code đều là nghĩa thật)
 *
 *  NGUYÊN TẮC VIẾT — mỗi dòng SAI phải sai vì một lí do học sinh thật sự hay
 *  nhầm, không phải sai vì viết lấp lửng. Và mỗi dòng ĐÚNG cũng phải có lời giải
 *  thích, vì phần dạy được nhiều nhất là lúc học sinh nghi oan một dòng viết lạ
 *  mắt mà thật ra đúng.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SaiODau) return;
  var K = window.SaiODau.dangKy;

  /* ------------------------------------------------ Thông tin và dữ liệu */
  K("C10-01", [{
    de: "Bốn phát biểu về **thông tin** và **dữ liệu**. Bấm vào phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Dữ liệu là những gì được ghi lại; thông tin là ý nghĩa con người rút ra được từ dữ liệu.",
        vi: "Đúng — đây là cách phân biệt cơ bản nhất của bài." },
      { t: "Cùng một dữ liệu có thể cho ra thông tin khác nhau tuỳ người đọc và hoàn cảnh.",
        vi: "Đúng. Dãy `28` là nhiệt độ với người xem dự báo, là số học sinh với giáo viên chủ nhiệm." },
      { t: "Số `37` được lưu trong máy tính đã là thông tin, không cần biết nó nói về cái gì.",
        sai: true,
        vi: "Đây mới là **dữ liệu**. Nó chỉ thành **thông tin** khi gắn được ý nghĩa: “37 độ C — người này bình thường”. Thiếu ngữ cảnh thì con số chẳng cho ta biết điều gì." },
      { t: "Máy tính xử lí dữ liệu theo quy tắc đã lập trình, chứ không hiểu ý nghĩa của dữ liệu đó.",
        vi: "Đúng, và đây là ý quan trọng nhất của cả bài. Máy so sánh, cộng, sắp xếp rất nhanh nhưng không biết mình đang tính cái gì." },
    ],
    chot: "Mẹo phân biệt khi làm câu Đ/S: hỏi “thứ này có cần người hiểu mới có nghĩa không?”. Cần → thông tin. Không cần, chỉ là thứ ghi lại được → dữ liệu.",
  }]);

  /* ------------------------------------------------------- Đơn vị dữ liệu */
  K("C10-02", [{
    de: "Bốn phát biểu về cách máy tính biểu diễn dữ liệu. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Một **bit** chỉ nhận một trong hai giá trị: 0 hoặc 1.",
        vi: "Đúng. Bit là đơn vị nhỏ nhất, tương ứng một trạng thái đóng/mở trong mạch điện." },
      { t: "Với **8 bit** biểu diễn được **8** giá trị khác nhau.",
        sai: true,
        vi: "Sai — biểu diễn được **2⁸ = 256** giá trị (từ 0 đến 255). Mỗi bit thêm vào **nhân đôi** số giá trị, chứ không cộng thêm một. Đây là lỗi hay gặp nhất của bài này." },
      { t: "1 byte = 8 bit, và 1 KB = 1024 byte.",
        vi: "Đúng theo cách tính của sách: các mốc đều là lũy thừa của 2, vì 1024 = 2¹⁰." },
      { t: "Máy tính dùng hệ nhị phân vì hệ này tính nhanh hơn hệ thập phân.",
        sai: true,
        vi: "Sai lí do. Máy dùng nhị phân vì **mạch điện chỉ dễ phân biệt hai trạng thái** có điện / không điện. Đó là chuyện của phần cứng, không phải chuyện hệ đếm nào tính nhanh hơn." },
    ],
    chot: "Cứ thấy “n bit biểu diễn được bao nhiêu giá trị” thì viết ngay **2ⁿ**. Và cứ thấy câu giải thích *vì sao* dùng nhị phân, hãy nhớ lí do nằm ở mạch điện.",
  }]);

  /* ---------------------------------------------------- Bảng mã kí tự */
  K("C10-22", [{
    de: "Bốn phát biểu về bảng mã và dung lượng tệp văn bản. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Bảng mã **ASCII** đủ để lưu mọi kí tự của tiếng Việt có dấu.",
        sai: true,
        vi: "Sai. ASCII chỉ có 128 mã, đủ cho chữ Latin không dấu, chữ số và dấu câu — không có chỗ cho `ă`, `ơ`, `ệ`. Muốn lưu tiếng Việt phải dùng bảng mã lớn hơn như **Unicode / UTF-8**." },
      { t: "Trong **UTF-8**, chữ Latin không dấu tốn 1 byte còn chữ có dấu tiếng Việt tốn 2–3 byte.",
        vi: "Đúng, và đây là lí do một tệp tiếng Việt nặng hơn tệp tiếng Anh cùng số chữ." },
      { t: "Cùng một nội dung, lưu bằng bảng mã khác nhau thì dung lượng tệp có thể khác nhau.",
        vi: "Đúng. Bảng mã quyết định mỗi kí tự tốn mấy byte, nên đổi bảng mã là đổi dung lượng." },
      { t: "Mở một tệp bằng sai bảng mã thì tệp bị hỏng, không cứu được nữa.",
        sai: true,
        vi: "Sai. Các byte trong tệp **không đổi**, chỉ là phần mềm dịch chúng ra kí tự sai nên hiện thành chữ loạn. Mở lại bằng đúng bảng mã là đọc được bình thường." },
    ],
    chot: "Nhớ: bảng mã là **quy ước dịch giữa số và chữ**. Sai bảng mã là dịch sai, không phải mất dữ liệu.",
  }]);

  /* ----------------------------------------------- Tính toán nhị phân */
  K("C10-23", [{
    de: "Một bạn làm bài đổi hệ và cộng nhị phân như dưới. Chỉ ra dòng làm sai.",
    loai: "ma",
    dong: [
      { t: "5₁₀  = 101₂          (4 + 1)",
        vi: "Đúng: 101₂ = 1×4 + 0×2 + 1×1 = 5." },
      { t: "1111₂ = 15₁₀         (8 + 4 + 2 + 1)",
        vi: "Đúng. Dãy n chữ số 1 luôn cho giá trị 2ⁿ − 1, ở đây 2⁴ − 1 = 15." },
      { t: "101₂ + 11₂ = 1000₂",
        vi: "Đúng: 5 + 3 = 8, mà 8 = 1000₂. Dòng này trông lạ vì kết quả dài hơn cả hai số hạng, nhưng cộng có nhớ thì đúng là như vậy." },
      { t: "1010₂ = 20₁₀",
        sai: true,
        vi: "Sai. 1010₂ = 8 + 0 + 2 + 0 = **10**, không phải 20. Bạn này chắc thấy 1010 giống “mười mười” rồi nhân đôi. Cách chắc chắn: viết trọng số 8 4 2 1 lên trên rồi cộng những cột có chữ số 1." },
    ],
    chot: "Luôn viết dãy trọng số **… 16 8 4 2 1** phía trên các bit rồi cộng. Mất ba giây nhưng không bao giờ sai.",
  }]);

  /* ------------------------------------------------------------- Lôgic */
  K("C10-24", [{
    de: "Bốn phát biểu về biểu thức lôgic. Bấm vào phát biểu sai.",
    loai: "y",
    dong: [
      { t: "`A and B` chỉ đúng khi cả A và B đều đúng.",
        vi: "Đúng — chỉ một trong bốn dòng bảng chân trị cho kết quả đúng." },
      { t: "`A or B` sai chỉ khi cả A và B đều sai.",
        vi: "Đúng. Ba dòng còn lại của bảng chân trị đều cho `or` bằng đúng." },
      { t: "`not (A and B)` viết lại được thành `not A and not B`.",
        sai: true,
        vi: "Sai. Khi đưa `not` vào trong ngoặc thì **and phải đổi thành or**: `not (A and B)` = `not A or not B`. Thử A đúng, B sai: vế đầu cho **đúng**, vế sau cho **sai**. Đây là định luật De Morgan, và là chỗ hay bị gài trong câu Đ/S." },
      { t: "Muốn kiểm tra hai biểu thức có tương đương không, lập bảng chân trị và so từng dòng là chắc chắn nhất.",
        vi: "Đúng. Với hai biến chỉ có bốn dòng, so hết là xong — không cần suy luận mẹo mực." },
    ],
    chot: "Quy tắc gọn: **đẩy `not` vào trong ngoặc thì đảo luôn phép nối** — and thành or, or thành and.",
  }]);

  /* -------------------------------------------- Dung lượng ảnh, nén tệp */
  K("C10-25", [{
    de: "Bốn phát biểu về dung lượng ảnh, âm thanh và nén tệp. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Ảnh có cùng số điểm ảnh nhưng nhiều màu hơn thì tốn dung lượng hơn.",
        vi: "Đúng. Nhiều màu nghĩa là mỗi điểm ảnh cần nhiều bit hơn để ghi màu." },
      { t: "Giảm cả chiều rộng và chiều cao của ảnh xuống một nửa thì dung lượng giảm một nửa.",
        sai: true,
        vi: "Sai — giảm **bốn lần**. Số điểm ảnh bằng rộng × cao, nên cả hai chiều đều giảm một nửa thì tích giảm 2 × 2 = 4 lần." },
      { t: "Nén **có mất mát** (như JPG, MP3) làm tệp nhẹ hơn nhiều nhưng không lấy lại được y nguyên bản gốc.",
        vi: "Đúng. Nó bỏ đi những chi tiết mà mắt và tai gần như không nhận ra, và bỏ rồi thì không khôi phục được." },
      { t: "Nén tệp **không mất mát** (như ZIP) cũng làm mọi tệp nhỏ đi được nữa, cứ nén nhiều lần là nhỏ mãi.",
        sai: true,
        vi: "Sai. Nén không mất mát dựa vào chỗ dữ liệu có **phần lặp lại**; nén xong thì gần như hết chỗ lặp, nén lại lần hai thường **không nhỏ thêm** mà còn to hơn vì phải ghi thêm thông tin quản lí." },
    ],
    chot: "Hai con số hay bị hỏi: dung lượng ảnh = **rộng × cao × số bit mỗi điểm ảnh**; đổi từ bit sang byte thì **chia 8**.",
  }]);

  /* ------------------------------------------------- Internet và WWW */
  K("C10-05", [{
    de: "Bốn phát biểu về Internet và World Wide Web. Bấm vào phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Internet là hạ tầng mạng toàn cầu; WWW chỉ là **một trong nhiều dịch vụ** chạy trên hạ tầng đó.",
        vi: "Đúng. Thư điện tử, gọi video, chơi game trực tuyến cũng chạy trên Internet mà không phải là Web." },
      { t: "Internet và World Wide Web là hai tên gọi của cùng một thứ.",
        sai: true,
        vi: "Sai, và đây là câu Đ/S rất hay ra. Internet có trước Web khoảng hai mươi năm. Tắt hết trình duyệt thì Web không dùng được nữa nhưng Internet vẫn hoạt động." },
      { t: "Địa chỉ dạng `https://...` là địa chỉ của một tài nguyên trên Web, gọi là URL.",
        vi: "Đúng. URL gồm giao thức, tên miền và đường dẫn tới tài nguyên." },
      { t: "Một trang web có thể liên kết tới trang web đặt ở máy chủ khác, ở nước khác.",
        vi: "Đúng — chính khả năng liên kết chéo này làm nên chữ “Web” (mạng nhện)." },
    ],
    chot: "Câu chốt để nhớ: **Internet là con đường, Web là một loại xe chạy trên đường đó.**",
  }]);

  /* -------------------------------------------- An toàn thông tin cá nhân */
  K("C10-07", [{
    de: "Bốn việc bạn Lan làm để giữ an toàn tài khoản. Có **hai** việc làm sai.",
    loai: "y",
    dong: [
      { t: "Đặt mật khẩu dài, có cả chữ, số và kí tự đặc biệt, và mỗi tài khoản một mật khẩu khác nhau.",
        vi: "Đúng cách. Dùng chung một mật khẩu thì lộ một chỗ là mất tất cả." },
      { t: "Bật **xác thực hai bước** cho tài khoản quan trọng.",
        vi: "Đúng. Kẻ khác có mật khẩu vẫn cần mã gửi về điện thoại nên chưa vào được." },
      { t: "Lưu ảnh chụp căn cước và mật khẩu vào thư mục ảnh trên điện thoại cho khỏi quên.",
        sai: true,
        vi: "Rất nguy hiểm. Thư mục ảnh thường **tự đồng bộ lên đám mây** và nhiều ứng dụng xin được quyền đọc nó. Mất điện thoại hoặc lộ tài khoản đám mây là lộ luôn giấy tờ." },
      { t: "Thấy tin nhắn báo “tài khoản sắp bị khoá, bấm vào đây xác minh ngay” thì bấm vào để kiểm tra cho chắc.",
        sai: true,
        vi: "Đây là **giả mạo (phishing)** kinh điển: tạo cảm giác gấp để người ta bấm mà không kịp nghĩ. Cách đúng là tự mở ứng dụng hoặc gõ địa chỉ chính thức, không bấm vào liên kết trong tin nhắn." },
    ],
    chot: "Dấu hiệu chung của lừa đảo trực tuyến: **gấp gáp + yêu cầu bấm liên kết + đòi thông tin đăng nhập**. Đủ ba thứ đó thì gần như chắc chắn là lừa.",
  }]);

  /* --------------------------------------------- Mã độc và lừa đảo mạng */
  K("C10-26", [{
    de: "Bốn phát biểu về mã độc. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Virus** cần lây vào một tệp hoặc chương trình khác để nhân bản, còn **worm** tự lan qua mạng.",
        vi: "Đúng — đây là điểm phân biệt hai loại hay bị hỏi." },
      { t: "**Ransomware** mã hoá dữ liệu rồi đòi tiền để mở; trả tiền là cách chắc chắn lấy lại được dữ liệu.",
        sai: true,
        vi: "Nửa đầu đúng, nửa sau sai. Trả tiền **không có gì bảo đảm** được mở khoá, và còn nuôi kẻ tấn công. Cách phòng thật sự là **sao lưu dữ liệu** ở nơi tách biệt." },
      { t: "Máy tính đã cài phần mềm diệt virus thì không thể nhiễm mã độc nữa.",
        sai: true,
        vi: "Sai. Phần mềm diệt virus chỉ nhận ra được những mẫu nó **đã biết**; mã độc mới vẫn lọt. Nó là một lớp bảo vệ, không phải bức tường tuyệt đối." },
      { t: "Phần mềm tải từ nguồn không rõ, hoặc bản “crack”, là đường lây mã độc rất phổ biến.",
        vi: "Đúng. Người dùng tự tay cấp quyền cài đặt nên mã độc không cần vượt qua rào nào cả." },
    ],
    chot: "Ba việc phòng thân đáng nhớ: **cập nhật hệ điều hành**, **sao lưu dữ liệu**, **không cài phần mềm nguồn lạ**.",
  }]);

  /* --------------------------------------------------- Bản quyền số */
  K("C10-08", [{
    de: "Bốn phát biểu về bản quyền và ứng xử trên mạng. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Ảnh tìm được trên Internet mà không thấy ghi tên tác giả thì được tự do dùng lại.",
        sai: true,
        vi: "Sai. Tác phẩm **có bản quyền ngay khi được tạo ra**, không cần ghi chú hay đăng ký gì. Không thấy tên tác giả chỉ nghĩa là ta không biết ai, chứ không nghĩa là không có ai." },
      { t: "Dẫn lại một đoạn ngắn có **ghi rõ nguồn** để minh hoạ cho bài học của mình là việc được phép.",
        vi: "Đúng, đây là trích dẫn hợp lệ: lấy phần nhỏ, có ghi nguồn, và không thay thế cho bản gốc." },
      { t: "Phần mềm **nguồn mở** vẫn có giấy phép, và giấy phép đó vẫn ràng buộc người dùng phải làm một số việc.",
        vi: "Đúng — nguồn mở không có nghĩa là không có luật. Nhiều giấy phép buộc phải giữ tên tác giả hoặc phải mở nguồn bản sửa lại." },
      { t: "Chia sẻ lại một bài viết sai sự thật thì người chia sẻ không có lỗi gì, vì mình không phải người viết ra.",
        sai: true,
        vi: "Sai. Chia sẻ là **góp phần lan truyền**, và đó chính là thứ gây hại thật. Trách nhiệm kiểm tra trước khi chia sẻ thuộc về người bấm nút chia sẻ." },
    ],
    chot: "Nguyên tắc gọn: **mặc định là có bản quyền**; muốn dùng thì tìm giấy phép cho phép, hoặc xin, hoặc chỉ trích dẫn có ghi nguồn.",
  }]);

  /* --------------------------------------------- Biến và kiểu dữ liệu */
  K("C10-12", [{
    de: "Bạn Minh viết mấy dòng Python. Chỉ ra dòng gây lỗi.",
    loai: "ma",
    dong: [
      { t: "ten = \"Minh\"",
        vi: "Đúng. Gán một xâu cho biến, dùng dấu nháy là bắt buộc." },
      { t: "tuoi = 16",
        vi: "Đúng. Số nguyên viết không có dấu nháy." },
      { t: "print(\"Bạn \" + ten + \" năm nay \" + tuoi + \" tuổi\")",
        sai: true,
        vi: "Lỗi. Không **cộng xâu với số** được — Python báo `TypeError`. Phải đổi kiểu: `str(tuoi)`, hoặc dùng dấu phẩy `print(\"Bạn\", ten, \"năm nay\", tuoi, \"tuổi\")`, hoặc f-string `f\"Bạn {ten} năm nay {tuoi} tuổi\"`." },
      { t: "print(tuoi + 1)",
        vi: "Đúng, và chạy được: cộng số với số thì bình thường. Dòng này trông giống dòng trên nhưng khác hẳn về kiểu." },
    ],
    chot: "Dấu `+` làm **hai việc khác nhau**: với số là cộng, với xâu là nối. Trộn một số với một xâu thì nó không biết chọn việc nào nên báo lỗi.",
  }]);

  /* --------------------------------------------------- Nhập dữ liệu */
  K("C10-13", [{
    de: "Chương trình tính tổng hai số người dùng nhập. Nhập `2` và `3` lại cho ra `23`. Chỉ ra **hai** dòng sai.",
    loai: "ma",
    dong: [
      { t: "a = input(\"Nhập số thứ nhất: \")",
        sai: true,
        vi: "Đây là chỗ sai. `input()` **luôn trả về xâu**, kể cả khi người dùng gõ chữ số. Phải bọc lại: `a = int(input(\"...\"))`." },
      { t: "b = input(\"Nhập số thứ hai: \")",
        sai: true,
        vi: "Sai cùng lí do — cũng phải `int(input(...))`." },
      { t: "print(\"Tổng =\", a + b)",
        vi: "Dòng này **viết đúng**. Nó chỉ cho ra kết quả lạ vì `a` và `b` đang là xâu, nên `+` nối chuỗi thành `\"23\"` thay vì cộng. Sửa ở chỗ nhập, không sửa ở đây." },
      { t: "print(\"Xong\")",
        vi: "Đúng, không liên quan gì tới lỗi." },
    ],
    chot: "Nhớ chắc: **`input()` trả về xâu**. Muốn tính toán thì phải `int()` hoặc `float()`. Đây là lỗi số một của học sinh mới học Python.",
  }]);

  /* ------------------------------------------------------ if – elif – else */
  K("C10-14", [{
    de: "Chương trình xếp loại theo điểm. Bạn 9 điểm lại được in ra ba dòng. Chỉ ra **hai** chỗ sai.",
    loai: "ma",
    dong: [
      { t: "diem = float(input(\"Điểm: \"))",
        vi: "Đúng. Dùng `float` vì điểm có thể lẻ như 6.5." },
      { t: "if diem >= 8:",
        vi: "Đúng — nhánh đầu tiên luôn là `if`." },
      { t: "if diem >= 6.5:",
        sai: true,
        vi: "Đây là chỗ sai: phải là **`elif`**. Viết `if` rời thì Python xét điều kiện này **độc lập** với điều kiện trên, nên bạn 9 điểm thoả cả ba và bị in ba dòng. `elif` thì dừng ngay ở nhánh đúng đầu tiên." },
      { t: "if diem >= 5:",
        sai: true,
        vi: "Sai cùng lí do — cũng phải là `elif`." },
    ],
    chot: "`elif` nghĩa là “**chỉ xét nếu các điều kiện trên đều sai**”. Các nhánh loại trừ nhau thì bắt buộc phải dùng `elif`, không dùng `if` rời.",
  }]);

  /* ----------------------------------------------------------- Vòng lặp for */
  K("C10-15", [{
    de: "Chương trình in các số từ 1 đến 10 và tính tổng. Chạy ra tổng 45 thay vì 55. Chỉ ra dòng sai.",
    loai: "ma",
    dong: [
      { t: "tong = 0",
        vi: "Đúng, và bắt buộc: chưa gán 0 thì dòng cộng dồn sẽ báo lỗi biến chưa tồn tại." },
      { t: "for i in range(1, 10):",
        sai: true,
        vi: "Sai. `range(1, 10)` cho các số **1 → 9**, dừng TRƯỚC số 10. Muốn có cả 10 phải viết `range(1, 11)`. Thiếu đúng số 10 nên tổng hụt 10, ra 45." },
      { t: "    tong = tong + i",
        vi: "Đúng. Thụt lề vào trong `for` nên chạy mỗi vòng một lần." },
      { t: "print(tong)",
        vi: "Đúng, và cố ý **không thụt lề** để chỉ in một lần sau khi lặp xong. Thụt vào là in mười dòng." },
    ],
    chot: "`range(a, b)` luôn **không lấy b**. Muốn chạy tới n thì viết `range(1, n+1)`. Đây là lỗi lệch một đơn vị hay gặp nhất.",
  }]);

  /* ------------------------------------------------------- Vòng lặp while */
  K("C10-16", [{
    de: "Chương trình cộng 1 + 2 + … + 5 bằng `while`. Chạy thì treo, không bao giờ dừng. Chỉ ra chỗ sai.",
    loai: "ma",
    dong: [
      { t: "i = 1",
        vi: "Đúng. Với `while`, biến đếm phải được **tự khởi tạo trước** vòng lặp." },
      { t: "tong = 0",
        vi: "Đúng." },
      { t: "while i <= 5:",
        vi: "Điều kiện này **viết đúng**. Nó chỉ mãi đúng vì `i` không bao giờ đổi — lỗi nằm ở thân vòng lặp, không nằm ở đây." },
      { t: "    tong = tong + i",
        sai: true,
        vi: "Thân vòng lặp **thiếu dòng `i = i + 1`**. `while` không tự tăng biến đếm như `for`; người viết phải tự làm. Không tăng thì điều kiện `i <= 5` mãi đúng và chương trình lặp vô hạn." },
    ],
    chot: "Khác biệt cốt lõi: **`for` tự lo biến đếm, `while` thì không**. Viết `while` xong, việc đầu tiên phải kiểm là “có dòng nào làm điều kiện tiến tới chỗ sai chưa?”.",
  }]);

  /* ------------------------------------------------------- Danh sách (list) */
  K("C10-17", [{
    de: "Bốn phát biểu về danh sách trong Python. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Với `a = [10, 20, 30]` thì `a[0]` bằng `10`.",
        vi: "Đúng. Chỉ số của danh sách bắt đầu từ **0**, nên phần tử đầu là `a[0]`." },
      { t: "Với `a = [10, 20, 30]` thì `a[3]` bằng `30`.",
        sai: true,
        vi: "Sai — `a[3]` báo lỗi `IndexError`. Danh sách có 3 phần tử thì chỉ số hợp lệ là 0, 1, 2. Phần tử cuối là `a[2]`, hoặc viết gọn `a[-1]`." },
      { t: "`len(a)` cho **số phần tử**, nên chỉ số lớn nhất là `len(a) - 1`.",
        vi: "Đúng, và đây là cách nhớ để không bao giờ tràn chỉ số." },
      { t: "Danh sách chỉ chứa được các phần tử cùng một kiểu dữ liệu.",
        sai: true,
        vi: "Sai. Python cho phép `[1, \"hai\", 3.0, True]` trong cùng một danh sách. (Nhiều ngôn ngữ khác thì bắt cùng kiểu, nhưng Python không.)" },
    ],
    chot: "Hai con số phải nhớ: phần tử đầu ở chỉ số **0**, phần tử cuối ở chỉ số **len(a) − 1**.",
  }]);

  /* ------------------------------------------------------------- Cắt lát */
  K("C10-31", [{
    de: "Với `a = [0, 1, 2, 3, 4, 5, 6]`, bốn phát biểu về cắt lát. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "`a[2:5]` cho `[2, 3, 4]` — ba phần tử.",
        vi: "Đúng. Lấy từ chỉ số 2, **dừng trước** chỉ số 5, nên được 5 − 2 = 3 phần tử." },
      { t: "`a[2:5]` cho bốn phần tử, vì lấy từ vị trí 2 đến vị trí 5.",
        sai: true,
        vi: "Sai — đúng cái bẫy của bài. Vị trí kết thúc **không được lấy**, nên chỉ có ba phần tử. Số phần tử = kết thúc − bắt đầu." },
      { t: "`a[:3]` cho `[0, 1, 2]`, còn `a[4:]` cho `[4, 5, 6]`.",
        vi: "Đúng. Bỏ trống bên trái là lấy từ đầu, bỏ trống bên phải là lấy đến hết." },
      { t: "`a[10:20]` báo lỗi vì danh sách không có chỉ số 10.",
        sai: true,
        vi: "Sai. **Cắt lát** thì Python tự kẹp về trong khoảng hợp lệ và trả về danh sách rỗng `[]`, không báo lỗi. (Còn **truy cập một phần tử** như `a[10]` thì mới báo `IndexError` — hai chuyện khác nhau.)" },
    ],
    chot: "Cắt lát rỗng là chỗ nguy hiểm âm thầm: vòng lặp trên một lát cắt sai sẽ **không chạy lần nào** mà chẳng có thông báo lỗi gì.",
  }]);

  /* ---------------------------------------------------- Xâu kí tự (string) */
  K("C10-18", [{
    de: "Bạn Hà muốn đổi chữ đầu của một xâu thành chữ in hoa. Chỉ ra dòng gây lỗi.",
    loai: "ma",
    dong: [
      { t: "s = \"minh\"",
        vi: "Đúng." },
      { t: "print(s[0])",
        vi: "Đúng và chạy được: **đọc** một kí tự của xâu thì bình thường, in ra `m`." },
      { t: "s[0] = \"M\"",
        sai: true,
        vi: "Lỗi `TypeError`. Xâu trong Python **không sửa được từng kí tự** — đọc thì được, gán thì không. Muốn đổi thì tạo xâu mới: `s = \"M\" + s[1:]`, hoặc dùng `s = s.capitalize()`." },
      { t: "print(s.upper())",
        vi: "Đúng. Các hàm như `upper()` **trả về xâu mới** chứ không sửa `s`, nên vẫn hợp lệ." },
    ],
    chot: "Nhớ: **danh sách sửa được, xâu thì không**. Mọi phép “đổi xâu” trong Python thật ra là **tạo ra một xâu mới**.",
  }]);

  /* ------------------------------------------------------------- Hàm */
  K("C10-19", [{
    de: "Hàm tính diện tích hình chữ nhật. Gọi `s = dien_tich(3, 4)` thì `s` lại bằng `None`. Chỉ ra chỗ sai.",
    loai: "ma",
    dong: [
      { t: "def dien_tich(a, b):",
        vi: "Đúng — khai báo hàm với hai tham số." },
      { t: "    kq = a * b",
        vi: "Đúng, tính toán không có vấn đề gì." },
      { t: "    print(kq)",
        sai: true,
        vi: "Đây là chỗ sai: phải là **`return kq`**. `print` chỉ **hiện** kết quả ra màn hình rồi thôi; hàm không có `return` thì tự trả về `None`, nên `s` nhận `None`." },
      { t: "s = dien_tich(3, 4)",
        vi: "Dòng này **viết đúng**. Nó nhận `None` chỉ vì hàm không trả về gì — sửa trong hàm, không sửa ở đây." },
    ],
    chot: "Phân biệt cho chắc: **`print` là cho người xem, `return` là cho chương trình dùng tiếp**. Muốn lấy kết quả ra biến thì bắt buộc phải `return`.",
  }]);

  /* -------------------------------------------- Biến cục bộ và toàn cục */
  K("C10-34", [{
    de: "Chương trình đếm số lần gọi hàm. Chạy xong `dem` vẫn bằng 0. Chỉ ra chỗ sai.",
    loai: "ma",
    dong: [
      { t: "dem = 0",
        vi: "Đúng — biến toàn cục, khai báo ngoài mọi hàm." },
      { t: "def ghi_nhan():",
        vi: "Đúng." },
      { t: "    dem = dem + 1",
        sai: true,
        vi: "Đây là chỗ sai. Trong hàm mà **gán** cho `dem` thì Python coi `dem` là **biến cục bộ mới**, tách rời biến toàn cục. Thiếu dòng `global dem` ở đầu hàm nên biến ngoài không đổi. (Thực tế dòng này còn báo lỗi `UnboundLocalError` vì đọc biến cục bộ chưa có giá trị.)" },
      { t: "print(dem)",
        vi: "Đúng, in ra biến toàn cục. Nó bằng 0 vì hàm chưa hề chạm được tới biến này." },
    ],
    chot: "Quy tắc: trong hàm **đọc** biến toàn cục thì được, còn muốn **gán** cho nó phải khai `global`. Nhưng cách tốt hơn là để hàm `return` giá trị rồi gán ở ngoài — ít gây lỗi khó tìm hơn nhiều.",
  }]);

  /* -------------------------------------------------- Chương trình dịch */
  K("C10-29", [{
    de: "Bốn phát biểu về ngôn ngữ lập trình và chương trình dịch. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Máy tính chỉ chạy trực tiếp được **ngôn ngữ máy**; mọi ngôn ngữ bậc cao đều phải qua chương trình dịch.",
        vi: "Đúng — đây là lí do tồn tại của trình biên dịch và trình thông dịch." },
      { t: "**Trình biên dịch** dịch cả chương trình một lượt thành tệp chạy được; **trình thông dịch** dịch và chạy từng câu lệnh.",
        vi: "Đúng, đây là điểm phân biệt chuẩn." },
      { t: "Chương trình dịch bằng trình thông dịch chạy **nhanh hơn** chương trình đã biên dịch.",
        sai: true,
        vi: "Ngược lại. Bản đã biên dịch là ngôn ngữ máy nên chạy nhanh hơn; thông dịch phải vừa dịch vừa chạy nên chậm hơn. Đổi lại, thông dịch tiện thử nhanh và dễ chạy trên nhiều loại máy." },
      { t: "**Hợp ngữ** (assembly) là ngôn ngữ bậc cao, gần với tiếng Anh tự nhiên.",
        sai: true,
        vi: "Sai. Hợp ngữ là ngôn ngữ **bậc thấp**, mỗi câu lệnh ứng gần như một lệnh máy. Nó chỉ dễ đọc hơn dãy số nhị phân, chứ không gần tiếng Anh như Python hay C." },
    ],
    chot: "Thứ tự từ thấp lên cao: **ngôn ngữ máy → hợp ngữ → ngôn ngữ bậc cao**. Càng lên cao càng dễ cho người, càng cần dịch nhiều cho máy.",
  }]);
})();
