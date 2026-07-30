/* ============================================================================
 *  NỘI DUNG "SAI Ở ĐÂU?" — ĐỢT 2
 *  Nốt lớp 11 (Khoa học máy tính) và toàn bộ nhánh TIN HỌC ỨNG DỤNG (U11, U12).
 *
 *  Nạp SAU js/sai-o-dau.js. Xem quy ước định dạng ở đầu js/sai-o-dau-10.js.
 *
 *  Nhánh ứng dụng nặng về THAO TÁC trên phần mềm, nên phần lớn ngộ nhận ở đây
 *  không phải sai kiến thức mà là sai thói quen làm việc — xuất .jpg rồi mới
 *  nhận ra mất hết lớp, sao lưu để cùng ổ với bản gốc, biểu mẫu HTML tĩnh tưởng
 *  bấm Gửi là dữ liệu tự vào máy chủ. Đây đúng là loại phát biểu đề đưa vào câu
 *  Đúng/Sai, vì nghe rất xuôi tai.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.SaiODau) return;
  var K = window.SaiODau.dangKy;

  /* ============================================ LỚP 11 — phần còn thiếu */

  K("C11-02", [{
    de: "Bốn phát biểu về phần mềm hệ thống và phần mềm ứng dụng. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Hệ điều hành và trình điều khiển thiết bị đều là **phần mềm hệ thống**.",
        vi: "Đúng. Cả hai phục vụ cho máy hoạt động, không làm việc thay người dùng." },
      { t: "Phần mềm diệt virus là **phần mềm ứng dụng**, vì người dùng tự chọn cài.",
        sai: true,
        vi: "Sai. Phân loại theo **việc nó phục vụ ai**, không theo ai cài. Diệt virus và dọn ổ đĩa chăm cho máy nên xếp vào **tiện ích hệ thống**." },
      { t: "Không có phần mềm hệ thống thì phần mềm ứng dụng vẫn chạy được bình thường.",
        sai: true,
        vi: "Sai. Ứng dụng không nói chuyện trực tiếp với phần cứng — nó **xin việc qua hệ điều hành** (mở tệp, cấp bộ nhớ, vẽ lên màn hình). Không có lớp đó thì không chạy được." },
      { t: "Cùng một phần mềm ứng dụng có thể chạy trên nhiều máy khác cấu hình.",
        vi: "Đúng, và chính lớp hệ điều hành làm được điều đó: ứng dụng không cần biết ổ đĩa hãng nào, card màn hình đời nào." },
    ],
    chot: "Câu hỏi phân loại: **phần mềm này phục vụ máy hoạt động, hay phục vụ công việc của người?**",
  }]);

  K("C11-21", [{
    de: "Bốn việc bạn Khoa làm để chăm máy tính. Có **hai** việc hiểu sai.",
    loai: "y",
    dong: [
      { t: "Cập nhật hệ điều hành chủ yếu để có tính năng mới, ít liên quan tới an toàn.",
        sai: true,
        vi: "Sai. Phần lớn bản cập nhật là **vá lỗ hổng bảo mật**, và phần lớn vụ nhiễm mã độc lợi dụng lỗ hổng **đã có bản vá** mà người dùng chưa cài." },
      { t: "Tắt bớt phần mềm **tự chạy khi bật máy** thì máy khởi động nhanh hơn.",
        vi: "Đúng, và đây là nguyên nhân số một làm máy khởi động chậm dần theo thời gian." },
      { t: "Ổ đĩa gần đầy cũng làm máy chạy chậm đi.",
        vi: "Đúng. Hệ điều hành cần chỗ trống để làm bộ nhớ tạm; hết chỗ là mọi thao tác chậm lại." },
      { t: "Sao lưu vào một thư mục khác trên **cùng ổ đĩa** là đủ an toàn.",
        sai: true,
        vi: "Sai. Ổ hỏng hoặc mã độc quét cả ổ là mất luôn cả hai bản. Sao lưu phải ở **thiết bị khác**, tốt nhất là nơi khác." },
    ],
    chot: "Bốn việc nên làm định kì: **cập nhật · dọn dẹp · sao lưu · kiểm phần mềm tự khởi động**. Mỗi tháng một lần là đủ với máy học tập.",
  }]);

  K("C11-22", [{
    de: "Bốn phát biểu về cổng kết nối và trình điều khiển. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Cổng **USB-C** vừa truyền dữ liệu vừa cấp điện được.",
        vi: "Đúng, và đó là lí do nhiều máy tính xách tay nay chỉ dùng USB-C cho cả sạc lẫn kết nối." },
      { t: "Cắm thiết bị vào mà máy không nhận thì chắc chắn thiết bị đã hỏng.",
        sai: true,
        vi: "Sai. Nguyên nhân phổ biến hơn nhiều là **thiếu hoặc lỗi trình điều khiển (driver)** — phần mềm giúp hệ điều hành hiểu thiết bị đó. Cài driver là chạy lại bình thường." },
      { t: "Cổng **HDMI** truyền được cả hình ảnh và âm thanh trên một dây.",
        vi: "Đúng, khác với chuẩn VGA cũ chỉ truyền hình." },
      { t: "**Bluetooth** nhanh hơn cáp USB nên nên dùng nó để chép tệp lớn.",
        sai: true,
        vi: "Ngược lại. Bluetooth chậm hơn cáp rất nhiều và chỉ hợp cho **tệp nhỏ tầm gần**. Chép vài GB qua Bluetooth có thể mất hàng giờ." },
    ],
    chot: "Chọn kết nối là chọn giữa **ổn định** (có dây) và **tiện lợi** (không dây). Dữ liệu càng nhiều thì cáp càng đáng dùng.",
  }]);

  K("C11-05", [{
    de: "Bốn phát biểu về tìm và đánh giá thông tin trên mạng. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Kết quả đứng **đầu** trang tìm kiếm là kết quả đáng tin nhất.",
        sai: true,
        vi: "Sai. Thứ hạng phụ thuộc vào cách trang được tối ưu và mức độ phổ biến, **không phải độ chính xác**. Kết quả đầu tiên còn có thể là quảng cáo." },
      { t: "Đặt cụm từ trong **dấu ngoặc kép** để tìm đúng cụm đó, không tách rời.",
        vi: "Đúng — mẹo thu hẹp kết quả rất hiệu quả." },
      { t: "Một thông tin quan trọng nên được đối chiếu ở **ít nhất hai nguồn độc lập**.",
        vi: "Đúng. Chữ **độc lập** quan trọng: mười trang cùng chép lại từ một nguồn thì vẫn chỉ là một nguồn." },
      { t: "Bài viết được chia sẻ rất nhiều lần thì thông tin trong đó chính xác.",
        sai: true,
        vi: "Sai. Nội dung gây sốc hoặc gây giận lan nhanh hơn nội dung đúng — **số lượt chia sẻ đo độ hấp dẫn, không đo độ đúng**." },
    ],
    chot: "Bốn câu hỏi soi nguồn: **ai viết? viết khi nào? có dẫn nguồn gốc không? có ai khác nói giống không?**",
  }]);

  K("C11-23", [{
    de: "Bốn phát biểu về dùng thư điện tử. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Gửi thư cho nhiều người **không quen nhau** thì nên để địa chỉ của họ ở ô **Cc**.",
        sai: true,
        vi: "Sai — phải dùng **Bcc**. Để ở Cc là làm lộ địa chỉ của tất cả cho tất cả, vừa mất riêng tư vừa dễ bị thu thập để gửi thư rác." },
      { t: "Người ở ô **Bcc** vẫn nhận được thư, nhưng người ở ô To không thấy tên họ.",
        vi: "Đúng, đó chính là nghĩa của chữ “ẩn” trong Bcc." },
      { t: "Tiêu đề thư nên nói đúng nội dung, vì nó quyết định thư có được mở hay không.",
        vi: "Đúng. Thư không có tiêu đề hoặc tiêu đề chung chung rất dễ bị bỏ qua hoặc lọc vào thư rác." },
      { t: "Trả lời một thư gửi cho cả lớp thì luôn nên bấm **Trả lời tất cả** cho lịch sự.",
        sai: true,
        vi: "Sai. Việc chỉ liên quan tới người gửi thì Trả lời tất cả làm ba mươi người nhận thư không cần thiết. Chỉ dùng khi **mọi người trong danh sách đều cần biết** câu trả lời." },
    ],
    chot: "Ba ô người nhận, ba nghĩa: **To** là người phải trả lời, **Cc** là người cần biết, **Bcc** là người cần biết mà không lộ danh sách.",
  }]);

  K("C11-24", [{
    de: "Bốn phát biểu về chia sẻ tài liệu trên đám mây. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Chia sẻ kiểu **“bất kì ai có liên kết”** thì chỉ người mình gửi mới mở được.",
        sai: true,
        vi: "Sai. Ai **nhận được liên kết** cũng vào được, kể cả người được chuyển tiếp lại, và liên kết có thể bị máy tìm kiếm lập chỉ mục. Tài liệu có thông tin cá nhân phải mời **theo từng địa chỉ**." },
      { t: "Nên cho quyền **thấp nhất** mà người ta vẫn làm được việc của họ.",
        vi: "Đúng — nguyên tắc quyền tối thiểu. Người chỉ cần đọc thì không cho quyền sửa." },
      { t: "Nhiều người sửa cùng lúc thì hệ thống ghi lại **lịch sử phiên bản**, xem lại và khôi phục được.",
        vi: "Đúng, và đây là ưu điểm lớn nhất so với gửi tệp qua lại cho nhau." },
      { t: "Tài liệu đã ở trên đám mây thì không cần sao lưu, vì đã an toàn tuyệt đối.",
        sai: true,
        vi: "Sai. Đám mây chống được **ổ hỏng**, nhưng không chống được **xoá nhầm** hay **tài khoản bị chiếm** — và đồng bộ sẽ chép luôn việc xoá sang mọi thiết bị." },
    ],
    chot: "Bốn mức quyền từ cao xuống thấp: **chủ sở hữu → chỉnh sửa → nhận xét → chỉ xem**.",
  }]);

  K("C11-25", [{
    de: "Bốn tình huống trên mạng. Có **hai** phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Nhân viên ngân hàng có thể gọi điện và hỏi **mã OTP** để xác minh giúp em.",
        sai: true,
        vi: "Sai, và đây là kịch bản lừa đảo phổ biến nhất hiện nay. **Không tổ chức hợp pháp nào hỏi mã OTP hay mật khẩu** — mã OTP sinh ra chính là để chỉ mình em biết." },
      { t: "Tên miền lệch **một chữ** so với trang thật là dấu hiệu trang giả mạo.",
        vi: "Đúng. Kẻ lừa đăng ký những tên rất giống để mắt lướt qua không nhận ra." },
      { t: "Máy đã cài phần mềm diệt virus thì không bị lừa lấy mật khẩu.",
        sai: true,
        vi: "Sai. Trong chuỗi lừa này **chính người dùng tự gõ** mật khẩu vào một trang web bình thường — không có mã độc nào để phần mềm diệt. Đây là lí do lừa đảo qua tâm lí hiệu quả hơn tấn công kĩ thuật." },
      { t: "Yêu cầu phải làm gấp “trong 24 giờ nếu không sẽ bị khoá” là dấu hiệu đáng ngờ.",
        vi: "Đúng. Gây gấp gáp là bước bắt buộc của kẻ lừa: để nạn nhân không kịp dừng lại kiểm tra." },
    ],
    chot: "Quy tắc cứng, không có ngoại lệ: **không bấm liên kết trong tin nhắn để đăng nhập**, và **không đọc mã OTP cho bất kì ai**.",
  }]);

  K("C11-26", [{
    de: "Bốn phát biểu về việc tách một quyển sổ ghi tay thành các bảng. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Cùng một thông tin bị chép lại ở nhiều dòng là dấu hiệu **nên tách bảng**.",
        vi: "Đúng — đó chính là dữ liệu trùng lặp, nguồn gốc của mọi chuyện thiếu nhất quán." },
      { t: "Tách bảng làm dữ liệu khó tìm hơn nên nói chung nên tránh.",
        sai: true,
        vi: "Sai. Tách xong vẫn ghép lại được bằng **truy vấn nối bảng**, và đổi lại thì mỗi thông tin chỉ sửa ở **một chỗ**." },
      { t: "Sau khi tách, các bảng được nối lại với nhau bằng **khoá**.",
        vi: "Đúng: bảng con giữ khoá ngoài trỏ tới khoá chính của bảng cha." },
      { t: "Tách bảng xong thì mỗi lần có học sinh mới phải nhập tên bạn ấy vào **cả hai** bảng.",
        sai: true,
        vi: "Ngược hẳn với mục đích. Tên chỉ nhập **một lần** vào bảng HOC_SINH; bảng mượn sách chỉ ghi **mã** học sinh. Đó là toàn bộ lợi ích của việc tách." },
    ],
    chot: "Phép thử: **đổi lớp của một bạn thì phải sửa mấy chỗ?** Sửa một ô là thiết kế đúng; phải tìm hết mọi dòng bạn ấy từng xuất hiện là còn trùng lặp.",
  }]);

  K("C11-27", [{
    de: "Đoạn SQL tạo bảng rồi thống kê. Chỉ ra dòng sai.",
    loai: "ma",
    dong: [
      { t: "CREATE TABLE hoc_sinh (\n    ma_hs TEXT PRIMARY KEY,",
        vi: "Đúng. Khoá chính khai ngay lúc tạo bảng — chuẩn hơn nhiều so với thêm vào sau khi đã có dữ liệu." },
      { t: "    ho_ten TEXT NOT NULL,\n    diem REAL CHECK (diem BETWEEN 0 AND 10) );",
        vi: "Đúng. `NOT NULL` bắt buộc nhập, `CHECK` chặn điểm ngoài khoảng 0–10 ngay từ lúc nhập." },
      { t: "INSERT INTO hoc_sinh VALUES ('HS01', 'Lê An', 8.5);",
        vi: "Chạy được. Không ghi danh sách cột thì phải nhập **đủ và đúng thứ tự** mọi cột — viết được nhưng thêm cột mới vào bảng là câu này hỏng, nên ghi rõ danh sách cột vẫn tốt hơn." },
      { t: "SELECT lop, COUNT(*) FROM hoc_sinh\n  WHERE COUNT(*) > 30 GROUP BY lop;",
        sai: true,
        vi: "Sai. Không lọc theo hàm gộp bằng `WHERE` được — phải dùng **`HAVING`**: `... GROUP BY lop HAVING COUNT(*) > 30;`. Lí do: `WHERE` lọc **hàng trước khi gom nhóm**, lúc đó chưa có kết quả đếm nào để so." },
    ],
    chot: "Nhớ cặp này: **`WHERE` lọc hàng, `HAVING` lọc nhóm**. Và `HAVING` luôn viết **sau** `GROUP BY`.",
  }]);

  K("C11-29", [{
    de: "Bốn phát biểu về sắp xếp chọn dần và chèn dần. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Chọn dần**: mỗi lượt tìm phần tử nhỏ nhất trong phần chưa sắp rồi đưa về đầu phần đó.",
        vi: "Đúng — đó là định nghĩa của thuật toán này." },
      { t: "**Chèn dần** với dãy gần như đã sắp sẵn thì chạy rất nhanh.",
        vi: "Đúng, và là ưu điểm lớn nhất của nó: mỗi phần tử chỉ phải lùi lại vài bước là tìm được chỗ." },
      { t: "**Chọn dần** với dãy đã sắp sẵn thì nhận ra ngay và dừng sau lượt đầu.",
        sai: true,
        vi: "Sai. Chọn dần **luôn quét đủ** phần còn lại để tìm giá trị nhỏ nhất, dù dãy đã sắp hay chưa. Nó không có cơ chế nào nhận ra dãy đã xong." },
      { t: "Cả hai thuật toán này đều có độ phức tạp **O(n log n)**.",
        sai: true,
        vi: "Sai — cả hai đều là **O(n²)**, vì đều có hai vòng lặp lồng nhau. O(n log n) là của các thuật toán sắp xếp tốt như sắp xếp trộn hay sắp xếp nhanh." },
    ],
    chot: "Chọn dần **ít đổi chỗ nhất** (đúng n−1 lần); chèn dần **nhanh nhất khi dãy gần sắp sẵn**. Cả hai đều O(n²).",
  }]);

  K("C11-17", [{
    de: "Bốn phát biểu về việc chia chương trình thành hàm. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Mỗi hàm nên làm **một việc**, và tên hàm nói rõ việc đó.",
        vi: "Đúng. Phép thử: đọc tên hàm lên mà đoán được nó làm gì thì chia đúng." },
      { t: "Nên để một hàm vừa nhập dữ liệu, vừa tính, vừa in kết quả cho gọn.",
        sai: true,
        vi: "Sai. Hàm ôm cả ba việc thì **không kiểm thử riêng được** (chạy là nó đòi nhập), và **không dùng lại được** cho chỗ khác. Tách thành `doc_du_lieu()`, `tinh(...)`, `in_bao_cao(...)`." },
      { t: "Chia thành hàm giúp kiểm thử **từng phần riêng** trước khi ghép lại.",
        vi: "Đúng, và đó là lợi ích lớn nhất — lỗi bị khoanh vùng trong một hàm thay vì nằm đâu đó trong hai trăm dòng." },
      { t: "Chia chương trình thành nhiều hàm làm chương trình **chạy nhanh hơn**.",
        sai: true,
        vi: "Sai. Gọi hàm còn tốn thêm một chút chi phí. Lợi ích của việc chia hàm là **cho người viết và người đọc**: dễ hiểu, dễ sửa, dễ kiểm thử, dùng lại được." },
    ],
    chot: "Làm mịn dần: viết chương trình chính chỉ **gọi tên các việc** trước, rồi mới đi viết từng hàm. Nghĩ được cấu trúc trước khi sa vào chi tiết.",
  }]);

  K("C11-30", [{
    de: "Bốn phát biểu về tổ chức chương trình thành mô đun. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Trong Python, một **mô đun** đơn giản là một tệp `.py`.",
        vi: "Đúng. `import xu_ly` là nạp tệp `xu_ly.py` nằm cùng thư mục." },
      { t: "Tách mô đun chủ yếu để chương trình **chạy nhanh hơn**.",
        sai: true,
        vi: "Sai — lí do là **con người**: mỗi người trong nhóm sửa một tệp khác nhau nên không đè lên nhau, và mô đun tính toán dùng lại được cho chương trình khác." },
      { t: "Khi `import` một mô đun, phần mã ở **mức ngoài cùng** của tệp đó được chạy ngay.",
        vi: "Đúng, và hay gây bất ngờ: để một dòng `print` hay một lệnh nhập liệu ở ngoài cùng là nó chạy mỗi lần ai đó import. Vì vậy mới có `if __name__ == \"__main__\":`." },
      { t: "Hai người sửa hai mô đun khác nhau thì vẫn đè lên công việc của nhau.",
        sai: true,
        vi: "Sai. Đó chính là điều tách mô đun tránh được: hai tệp khác nhau thì hai người sửa song song thoải mái." },
    ],
    chot: "Chia mô đun theo **nhóm việc**, không theo độ dài: nhập liệu một tệp, xử lí một tệp, hiển thị một tệp. Tệp xử lí không được dính gì tới màn hình thì mới dùng lại được.",
  }]);

  K("C11-31", [{
    de: "Bốn dòng dùng thư viện Python. Chỉ ra dòng gây lỗi.",
    loai: "ma",
    dong: [
      { t: "import math\nprint(sqrt(9))",
        sai: true,
        vi: "Lỗi `NameError`. Viết `import math` thì phải gọi kèm tên mô đun: **`math.sqrt(9)`**. Muốn gọi thẳng `sqrt(9)` thì phải viết `from math import sqrt`." },
      { t: "from math import sqrt\nprint(sqrt(9))",
        vi: "Đúng và chạy được. Cách này gọn hơn nhưng dễ **trùng tên** với hàm mình tự viết, nên với thư viện lớn thì `import ...` rồi gọi kèm tên vẫn an toàn hơn." },
      { t: "import random\nprint(random.randint(1, 6))",
        vi: "Đúng. `random` có sẵn khi cài Python, không cần tải thêm." },
      { t: "from datetime import date\nprint(date.today())",
        vi: "Đúng. `datetime` cũng là thư viện có sẵn." },
    ],
    chot: "Ba nguồn thư viện: **có sẵn** (`math`, `random`, `datetime`), **cài thêm** bằng `pip install`, và **tự viết** (tệp `.py` của mình).",
  }]);

  K("C11-18", [{
    de: "Bốn phát biểu về kiểm thử và gỡ lỗi. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Lỗi cú pháp** làm chương trình không chạy được dòng nào, và máy chỉ ra đúng dòng sai.",
        vi: "Đúng — đây là loại lỗi dễ sửa nhất, dù nhìn thông báo đỏ thì có vẻ đáng sợ." },
      { t: "**Lỗi lôgic** sẽ được Python báo ra khi chạy tới chỗ sai.",
        sai: true,
        vi: "Sai, và đây là điều làm lỗi lôgic khó nhất: chương trình **chạy trơn tru, không báo gì**, chỉ kết quả là sai. Máy không biết em định làm gì nên không thể báo được." },
      { t: "Chương trình chạy xong mà không có thông báo lỗi nào nghĩa là nó đã đúng.",
        sai: true,
        vi: "Sai vì lí do trên. Cách duy nhất biết đúng là **chạy với dữ liệu mình đã biết đáp án** rồi so." },
      { t: "Nên thử cả những trường hợp đặc biệt: dãy rỗng, dãy một phần tử, toàn số âm, số 0.",
        vi: "Đúng. Phần lớn lỗi nằm ở **biên**, không nằm ở trường hợp bình thường." },
    ],
    chot: "Ba loại lỗi: **cú pháp** (không chạy được), **khi chạy** (dừng giữa chừng), **lôgic** (chạy ngon, kết quả sai). Chỉ loại thứ ba cần tự đi tìm.",
  }]);

  K("C11-33", [{
    de: "Bốn phát biểu về các kĩ thuật thiết kế thuật toán. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Tham lam** luôn cho ra kết quả tốt nhất, vì mỗi bước đều chọn phương án tốt nhất.",
        sai: true,
        vi: "Sai, và là bẫy hay ra nhất của bài này. Tham lam chỉ nhìn **một bước trước mắt**, nên có bài chọn đúng từng bước mà tổng thể lại tệ. Nó nhanh và đơn giản, nhưng chỉ tối ưu với một số dạng bài nhất định." },
      { t: "**Vét cạn** chắc chắn tìm ra đáp án nếu đáp án tồn tại, nhưng thường rất chậm.",
        vi: "Đúng. Nó thử mọi khả năng nên không bỏ sót, đổi lại chi phí thường tăng theo hàm mũ." },
      { t: "**Chia để trị** chia bài toán thành các bài toán con **cùng dạng** rồi ghép kết quả lại.",
        vi: "Đúng — tìm kiếm nhị phân và sắp xếp trộn đều theo kiểu này, và vì cùng dạng nên hay cài bằng đệ quy." },
      { t: "**Quay lui** đi một mạch theo hướng đã chọn, không bao giờ phải thử lại hướng khác.",
        sai: true,
        vi: "Sai — “quay lui” chính là **lùi lại thử hướng khác** khi đi vào ngõ cụt. Đó là toàn bộ ý tưởng của kĩ thuật này, dùng cho bài xếp hậu, giải sudoku, tìm đường trong mê cung." },
    ],
    chot: "Đề rất hay gài ở chữ **“luôn luôn”**. Tham lam không luôn tối ưu; vét cạn luôn đúng nhưng không luôn chạy nổi.",
  }]);

  K("C11-20", [{
    de: "Bốn phát biểu về nhóm nghề dịch vụ và quản trị. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Công việc chính của **quản trị mạng** là viết phần mềm cho công ty.",
        sai: true,
        vi: "Sai. Quản trị mạng **thiết kế, vận hành và giám sát** hệ thống mạng — viết phần mềm là việc của nhóm phát triển." },
      { t: "**Quản trị cơ sở dữ liệu** lo cả việc sao lưu và phân quyền truy cập.",
        vi: "Đúng. Bảo đảm dữ liệu đúng, nhanh và không mất là ba việc chính của nghề này." },
      { t: "**Hỗ trợ kĩ thuật** cần kĩ năng giao tiếp không kém gì kiến thức kĩ thuật.",
        vi: "Đúng. Phần lớn thời gian là nghe người dùng mô tả sự cố bằng lời của họ rồi đoán ra chuyện gì đang xảy ra." },
      { t: "Nhóm nghề dịch vụ không cần hiểu về hệ thống, chỉ cần biết dùng máy thành thạo.",
        sai: true,
        vi: "Sai. Xử lí sự cố đòi hỏi hiểu **máy hoạt động thế nào** — mạng, hệ điều hành, quyền truy cập — chứ biết dùng phần mềm thì chưa sửa được sự cố." },
    ],
    chot: "Cả nhóm này có điểm chung: **kiến thức hệ thống và mạng** cộng **kĩ năng làm việc với người**, chứ không phải viết mã.",
  }]);

  /* ================================ TIN HỌC ỨNG DỤNG — LỚP 11 */

  K("U11-01", [{
    de: "Bốn phát biểu về các đối tượng trong một tệp cơ sở dữ liệu. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Chỉ có **bảng** là nơi dữ liệu được lưu thật.",
        vi: "Đúng, và đây là ý quan trọng nhất của bài. Truy vấn, biểu mẫu, báo cáo đều chỉ là cách nhìn vào dữ liệu trong bảng." },
      { t: "Xoá một **truy vấn** thì dữ liệu nó lấy ra cũng bị xoá theo.",
        sai: true,
        vi: "Sai. Truy vấn chỉ là **câu hỏi được lưu lại**; xoá nó thì mất câu hỏi chứ dữ liệu trong bảng còn nguyên. Đây là câu Đúng/Sai rất hay ra." },
      { t: "**Biểu mẫu** dùng để nhập và xem dữ liệu cho dễ hơn là nhập thẳng vào bảng.",
        vi: "Đúng. Biểu mẫu hiện mỗi lần một bản ghi, đặt được nhãn tiếng Việt và kiểm tra dữ liệu ngay lúc nhập." },
      { t: "**Báo cáo** giữ một bản sao của dữ liệu tại thời điểm tạo ra nó.",
        sai: true,
        vi: "Sai. Báo cáo cũng **đọc lại từ bảng** mỗi lần mở, nên dữ liệu đổi thì báo cáo đổi theo. Muốn giữ số liệu tại một thời điểm thì phải xuất ra tệp riêng." },
    ],
    chot: "Nhớ một câu: **bảng chứa dữ liệu, ba loại kia chỉ là cách nhìn vào bảng**.",
  }]);

  K("U11-02", [{
    de: "Bạn Mai thiết kế bảng HOC_SINH. Có **hai** quyết định sai.",
    loai: "y",
    dong: [
      { t: "Gộp họ và tên vào **một cột** `ho_ten` cho gọn.",
        sai: true,
        vi: "Sai về thiết kế. Gộp rồi thì **không sắp xếp theo tên** được (người Việt xếp theo tên chứ không theo họ), cũng không lọc theo họ được. Nên tách `ho_dem` và `ten` riêng." },
      { t: "Để cột `so_dien_thoai` kiểu **văn bản** chứ không phải kiểu số.",
        vi: "Đúng, và là quyết định tinh. Để kiểu số thì số **0 ở đầu bị mất** (`0389…` thành `389…`). Nguyên tắc: cái nào không đem ra cộng trừ thì đừng để kiểu số." },
      { t: "Chọn `ma_hs` làm khoá chính vì mỗi học sinh một mã, không trùng, không trống.",
        vi: "Đúng. Mã do trường cấp nên chắc chắn duy nhất — tốt hơn hẳn dùng họ tên." },
      { t: "Để **mọi cột** kiểu văn bản cho an toàn, khỏi lo sai kiểu.",
        sai: true,
        vi: "Sai. Cột `diem` để kiểu văn bản thì **không tính trung bình được**, và sắp xếp sẽ theo thứ tự chữ cái — “10” đứng trước “9”. Cột `ngay_sinh` để văn bản thì không tính được tuổi." },
    ],
    chot: "Chọn kiểu dữ liệu theo câu hỏi: **cột này có đem ra tính toán hoặc so sánh thứ tự không?** Có thì để đúng kiểu số hoặc ngày.",
  }]);

  K("U11-03", [{
    de: "Bốn việc khi tạo lập một cơ sở dữ liệu mới. Có **hai** việc làm sai.",
    loai: "y",
    dong: [
      { t: "Nhập thử vài bản ghi ngay sau khi tạo bảng để kiểm cấu trúc.",
        vi: "Đúng, và nên nhập cả **trường hợp khó**: tên rất dài, tên có dấu, ngày 29/02, số điện thoại bắt đầu bằng 0." },
      { t: "Nhập xong toàn bộ dữ liệu rồi mới quay lại đặt khoá chính và ràng buộc.",
        sai: true,
        vi: "Sai. Dữ liệu sai đã nằm trong bảng rồi thì đặt ràng buộc sẽ **bị từ chối** hoặc phải đi sửa tay hàng loạt. Ràng buộc phải đặt **trước khi nạp dữ liệu**." },
      { t: "Mỗi cột đều phải chọn một **kiểu dữ liệu** khi tạo bảng.",
        vi: "Đúng. Kiểu dữ liệu chính là lớp ràng buộc cơ bản nhất, có ngay không cần khai thêm." },
      { t: "Đặt tên bảng và tên cột có dấu tiếng Việt và khoảng trắng cho dễ đọc.",
        sai: true,
        vi: "Sai về thói quen làm việc. Tên có dấu và khoảng trắng gây rắc rối khi viết câu lệnh (phải bọc trong ngoặc) và dễ lỗi khi chuyển sang hệ quản trị khác. Nên dùng **chữ không dấu, nối bằng gạch dưới**: `ho_ten`, `ngay_sinh`." },
    ],
    chot: "Trình tự đúng: **tạo tệp → tạo bảng → đặt kiểu và ràng buộc → nhập thử → mới nạp dữ liệu thật**.",
  }]);

  K("U11-04", [{
    de: "Bốn phát biểu về khoá chính và khoá ngoài. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Giá trị của **khoá ngoài** được phép trùng lặp trong bảng của nó.",
        vi: "Đúng. Một học sinh mượn sách mười lần thì mã của bạn ấy xuất hiện mười dòng trong bảng MUON — hoàn toàn bình thường." },
      { t: "Mỗi bảng chỉ được có **một** khoá ngoài.",
        sai: true,
        vi: "Sai. Bảng MUON có tới hai khoá ngoài: `ma_hs` trỏ sang HOC_SINH và `ma_sach` trỏ sang SACH. Chỉ **khoá chính** mới bị giới hạn một cái mỗi bảng." },
      { t: "Khoá ngoài trỏ tới **khoá chính** của một bảng khác.",
        vi: "Đúng — đó là cơ chế nối hai bảng lại với nhau." },
      { t: "Nhập vào khoá ngoài một giá trị **chưa có** ở bảng được trỏ tới thì vẫn lưu được.",
        sai: true,
        vi: "Sai khi đã khai liên kết. Hệ quản trị sẽ **chặn** lại — đó gọi là **toàn vẹn tham chiếu**, và nó ngăn chuyện có phiếu mượn của một học sinh không tồn tại." },
    ],
    chot: "Khoá chính **định danh**, khoá ngoài **nối bảng**. Khoá chính không trùng không trống; khoá ngoài được trùng nhưng phải có thật ở bảng kia.",
  }]);

  K("U11-05", [{
    de: "Bốn phát biểu về cập nhật dữ liệu. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Xoá nhầm một bản ghi thì bấm Hoàn tác (Ctrl+Z) để lấy lại như trong Word.",
        sai: true,
        vi: "Sai. Cơ sở dữ liệu **ghi thẳng xuống ổ đĩa** ngay khi lưu; nói chung không có nút hoàn tác. Chỉ lấy lại được từ **bản sao lưu**." },
      { t: "Trước khi sửa, nên đọc lại vài trường khác để chắc đúng bản ghi cần sửa.",
        vi: "Đúng. Hai học sinh trùng tên là chuyện thường — phải soi thêm ngày sinh hoặc lớp." },
      { t: "Xoá một bản ghi **đang được bản ghi khác tham chiếu tới** thì có thể bị chặn.",
        vi: "Đúng. Tuỳ cách khai liên kết mà nó bị chặn, hoặc kéo theo xoá dây chuyền — phải biết bảng của mình đang đặt kiểu nào." },
      { t: "Sửa hàng loạt thì không cần sao lưu, vì hệ quản trị tự giữ bản cũ để khôi phục.",
        sai: true,
        vi: "Sai. Không có chuyện đó. **Sao lưu trước khi sửa hoặc xoá hàng loạt** là việc bắt buộc, nhất là khi thao tác bằng câu lệnh." },
    ],
    chot: "Ba việc thêm / sửa / xoá đều **không lùi lại được**. Với dữ liệu thật thì làm từng bước và sao lưu trước.",
  }]);

  K("U11-06", [{
    de: "Bốn phát biểu về ràng buộc toàn vẹn. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Ràng buộc do **người thiết kế khai báo**, không phải hệ quản trị tự có.",
        vi: "Đúng. Không khai thì phần mềm cho nhập điểm 200 hay ngày sinh năm 3000 bình thường — nó chỉ thực thi luật được giao." },
      { t: "`NOT NULL` bắt buộc cột đó phải có giá trị, không được để trống.",
        vi: "Đúng." },
      { t: "Ràng buộc **Unique** không cho trùng, nhưng vẫn cho để trống.",
        vi: "Đúng, và đây là điểm khác với khoá chính — khoá chính vừa không trùng vừa **không được trống**." },
      { t: "Đã đặt cột `diem` kiểu số thì tự khắc chặn được người nhập điểm 200.",
        sai: true,
        vi: "Sai. Kiểu số chỉ chặn **chữ**, còn 200 vẫn là một số hợp lệ. Muốn chặn thì phải khai thêm ràng buộc miền giá trị: `CHECK (diem BETWEEN 0 AND 10)`." },
    ],
    chot: "Kiểu dữ liệu chặn **sai loại**, ràng buộc miền giá trị chặn **sai khoảng**. Hai lớp khác nhau, phải khai cả hai.",
  }]);

  K("U11-07", [{
    de: "Bốn phát biểu về truy vấn nhiều bảng. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Quên nối khoá giữa hai bảng thì hệ quản trị báo lỗi, không chạy.",
        sai: true,
        vi: "Sai, và đây là chỗ nguy hiểm nhất. Nó **không báo gì cả** mà ghép **mọi** dòng bảng này với **mọi** dòng bảng kia: 50 học sinh × 200 lượt mượn ra 10.000 dòng vô nghĩa." },
      { t: "Đếm số dòng kết quả là cách nhanh để kiểm mình đã nối đúng chưa.",
        vi: "Đúng. Con số phình lên vô lí chính là dấu hiệu quên nối khoá." },
      { t: "Nối bảng theo nguyên tắc: **khoá ngoài** của bảng này bằng **khoá chính** của bảng kia.",
        vi: "Đúng — đó là chỗ hai bảng gặp nhau." },
      { t: "Truy vấn nhiều bảng tạo ra một **bảng mới** được lưu trong cơ sở dữ liệu.",
        sai: true,
        vi: "Sai. Kết quả truy vấn chỉ là **cách nhìn tạm thời**, tính lại mỗi lần mở. Cơ sở dữ liệu không phình to thêm vì em tạo mười truy vấn." },
    ],
    chot: "Truy vấn là **câu hỏi**, không phải bản sao dữ liệu. Và quên nối khoá thì sai một cách **im lặng** — luôn kiểm số dòng.",
  }]);

  K("U11-08", [{
    de: "Bốn phát biểu về sao lưu và phục hồi. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Để bản sao lưu trong một thư mục khác trên cùng ổ đĩa là đã sao lưu.",
        sai: true,
        vi: "Sai. Ổ hỏng hay mã độc mã hoá cả ổ là mất luôn cả hai bản. Sao lưu phải ở **thiết bị khác**, tốt nhất là **địa điểm khác**." },
      { t: "Phải **thử phục hồi** thì mới biết bản sao lưu có dùng được không.",
        vi: "Đúng, và là bước hay bị bỏ nhất. Rất nhiều đơn vị chỉ phát hiện bản sao lưu hỏng đúng vào lúc cần tới nó." },
      { t: "Quy tắc **3-2-1**: giữ 3 bản, trên 2 loại thiết bị, có 1 bản ở nơi khác.",
        vi: "Đúng — cách nhớ gọn cho một chiến lược sao lưu đủ dùng." },
      { t: "Đã bật đồng bộ đám mây thì khỏi sao lưu, vì xoá nhầm sẽ không bị đồng bộ theo.",
        sai: true,
        vi: "Ngược lại — **đồng bộ chép luôn việc xoá** sang mọi thiết bị, đó chính là điều làm nó khác với sao lưu. Đồng bộ giữ mọi nơi **giống nhau**; sao lưu giữ **trạng thái tại một thời điểm**." },
    ],
    chot: "Phân biệt cho chắc: **đồng bộ ≠ sao lưu**. Đồng bộ chống mất thiết bị, sao lưu chống mất dữ liệu.",
  }]);

  K("U11-09", [{
    de: "Bốn phát biểu về lớp trong phần mềm chỉnh sửa ảnh. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Lớp nằm **trên** che phần lớp nằm dưới ở chỗ nó không trong suốt.",
        vi: "Đúng. Ảnh cuối cùng là cái ta thấy khi nhìn từ trên xuống qua cả chồng lớp." },
      { t: "Sửa hoặc xoá một lớp thì các lớp khác **không bị ảnh hưởng**.",
        vi: "Đúng, và đó là toàn bộ lí do người ta làm việc theo lớp." },
      { t: "Xuất ảnh ra tệp **`.jpg`** vẫn giữ được các lớp để lần sau mở ra sửa tiếp.",
        sai: true,
        vi: "Sai. `.jpg` và `.png` **gộp hết lớp lại** thành một ảnh phẳng. Muốn còn sửa được thì phải lưu tệp gốc nhiều lớp (`.xcf` của GIMP, `.psd` của Photoshop)." },
      { t: "Nên giữ cả tệp gốc nhiều lớp lẫn tệp `.jpg` đã xuất.",
        vi: "Đúng: tệp gốc để sửa tiếp, tệp `.jpg` để gửi và đăng." },
    ],
    chot: "Quy tắc sống còn khi làm ảnh: **lưu tệp nhiều lớp trước, xuất `.jpg` sau**. Làm ngược là mất hết công chỉnh.",
  }]);

  K("U11-10", [{
    de: "Bốn phát biểu về chỉnh màu, độ sáng, tương phản. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Tăng **độ sáng** làm vùng sáng sáng thêm và vùng tối **tối thêm**.",
        sai: true,
        vi: "Sai — đó là mô tả của **độ tương phản**. Tăng độ sáng kéo **toàn bộ** ảnh sáng lên cùng một lượng, nên tăng nhiều thì ảnh bạc màu, mờ đục." },
      { t: "Tăng **độ tương phản** làm khoảng cách giữa vùng sáng và vùng tối giãn ra.",
        vi: "Đúng, và vì vậy nó chữa được ảnh trông “phẳng”, thiếu nét." },
      { t: "Kéo quá tay thì **mất chi tiết** ở vùng rất sáng hoặc rất tối, và không lấy lại được.",
        vi: "Đúng. Chi tiết đã bị đẩy về trắng hoàn toàn hay đen hoàn toàn thì kéo ngược lại cũng chỉ ra một mảng xám." },
      { t: "Nên chỉnh trực tiếp lên lớp ảnh gốc cho nhanh, khỏi phải tạo thêm lớp.",
        sai: true,
        vi: "Sai về thói quen. Chỉnh trên **lớp riêng** (hoặc lớp điều chỉnh, hoặc bản sao) thì còn tắt đi, sửa lại, so trước–sau được. Chỉnh thẳng lên gốc rồi lưu là không lùi lại được." },
    ],
    chot: "**Sáng** dịch cả ảnh cùng một lượng; **tương phản** đẩy hai đầu ra xa nhau. Và luôn chỉnh trên lớp riêng.",
  }]);

  K("U11-11", [{
    de: "Bốn phát biểu về công cụ chọn và tách nền. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Công cụ chọn theo màu dễ dùng khi nền **một màu và khác hẳn** chủ thể.",
        vi: "Đúng — đó là lí do ảnh chụp trên phông xanh rất dễ tách." },
      { t: "**Đảo vùng chọn** là chọn lấy toàn bộ phần còn lại của ảnh.",
        vi: "Đúng, và là mẹo hay dùng: chọn nền (dễ) rồi đảo lại để được chủ thể (khó)." },
      { t: "Tóc, lông và vật trong suốt chọn theo màu là ra biên sạch.",
        sai: true,
        vi: "Sai. Những chỗ đó có hàng nghìn điểm ảnh **pha giữa chủ thể và nền**, chọn theo màu sẽ ra biên răng cưa như cắt bằng kéo. Phải làm mềm biên hoặc dùng công cụ chuyên cho tóc." },
      { t: "Tách nền xong nên đặt ảnh lên **nền tối và nền sáng** để soi viền còn sót.",
        vi: "Đúng. Viền sáng sót lại chỉ lộ ra trên nền tối, và ngược lại — chỉ nhìn trên nền trắng thì không thấy." },
    ],
    chot: "Luôn xoá nền trên **lớp riêng**, đừng xoá lớp gốc. Xoá nhầm thì tắt lớp đó đi là xong, không mất ảnh gốc.",
  }]);

  K("U11-12", [{
    de: "Bốn phát biểu về công cụ vẽ, tô màu và thêm chữ. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "**Bút chì** cho nét biên cứng, **cọ** cho nét biên mềm.",
        vi: "Đúng. Bút chì tô dứt khoát từng điểm ảnh, cọ pha dần ở rìa nên trông mượt hơn." },
      { t: "Chọn công cụ trước, rồi mới đặt cỡ nét, độ mờ và màu cho nó.",
        vi: "Đúng — thanh tuỳ chọn đổi theo công cụ đang chọn." },
      { t: "Sau khi **gộp lớp** hoặc xuất ra `.jpg`, vẫn sửa lại được nội dung chữ đã viết.",
        sai: true,
        vi: "Sai. Lớp chữ khi còn là lớp chữ thì sửa nội dung, đổi phông được. Gộp lớp rồi thì chữ **thành các điểm ảnh** như phần còn lại — muốn đổi một chữ cũng phải xoá đi viết lại." },
      { t: "**Dấu nhân bản** (clone) chép một vùng ảnh sang chỗ khác, hay dùng để xoá vật thừa.",
        vi: "Đúng: lấy mẫu ở vùng nền sạch rồi tô đè lên vật cần xoá." },
    ],
    chot: "Nguyên tắc chung của cả bài: **để chữ và hình vẽ ở lớp riêng, gộp lớp càng muộn càng tốt**.",
  }]);

  K("U11-13", [{
    de: "Bốn phát biểu về ảnh động. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Ảnh động chỉ là **nhiều ảnh tĩnh** được chiếu lần lượt đủ nhanh.",
        vi: "Đúng, và trong phần mềm chỉnh ảnh thì mỗi khung hình chính là **một lớp**." },
      { t: "Càng nhiều khung hình thì ảnh càng mượt và tệp càng **nhẹ**.",
        sai: true,
        vi: "Nửa đầu đúng, nửa sau sai ngược. Mỗi khung là một ảnh phải lưu, nên càng nhiều khung thì tệp càng **nặng**. Làm ảnh động luôn là đánh đổi giữa mượt và nhẹ." },
      { t: "Độ trễ khoảng **100 ms** mỗi khung tương ứng 10 khung mỗi giây.",
        vi: "Đúng: 1000 ms ÷ 100 ms = 10 khung. Mức này đủ mượt cho ảnh động đơn giản." },
      { t: "GIF nén tốt ngang video, nên đoạn hoạt hình dài vài phút cũng nên làm GIF.",
        sai: true,
        vi: "Sai. GIF nén kém hơn video rất nhiều và chỉ hiển thị được 256 màu. Nội dung dài hoặc nhiều màu thì phải dùng **video** (MP4)." },
    ],
    chot: "GIF hợp với đoạn **ngắn, ít màu, lặp lại**. Dài hơn vài giây là nên chuyển sang video.",
  }]);

  K("U11-14", [{
    de: "Bốn phát biểu về dòng thời gian trong phần mềm làm phim. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Trục ngang của dòng thời gian là **thời gian**; các rãnh xếp chồng theo chiều dọc.",
        vi: "Đúng — đó là cách đọc một dòng thời gian." },
      { t: "Rãnh nằm **trên** hiện đè lên rãnh nằm dưới ở cùng một thời điểm.",
        vi: "Đúng, cùng nguyên tắc chồng lớp như chỉnh ảnh. Vì vậy chữ và logo phải để ở rãnh trên cùng." },
      { t: "Cắt một clip ở rãnh video thì nhạc ở rãnh âm thanh cũng tự bị cắt theo.",
        sai: true,
        vi: "Sai. Mỗi rãnh **xử lí riêng**. Đây là lí do sau khi cắt bớt video thì nhạc nền vẫn dài hơn phần hình và phải cắt tay — hoặc phải nhóm hai rãnh lại trước khi cắt." },
      { t: "Có thể đặt nhạc nền chạy suốt phim trong khi các clip ở rãnh trên thay đổi liên tục.",
        vi: "Đúng, và đó chính là lợi ích của việc tách rãnh." },
    ],
    chot: "Ba nhóm rãnh cần nhớ: **chữ ở trên, hình ở giữa, tiếng ở dưới** — và mỗi rãnh cắt ghép độc lập.",
  }]);

  K("U11-15", [{
    de: "Bốn phát biểu về biên tập và xuất phim. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "**Tệp dự án** mở được ở máy khác và chiếu được như một tệp phim bình thường.",
        sai: true,
        vi: "Sai. Tệp dự án chỉ lưu **các lệnh biên tập** cùng đường dẫn tới tệp gốc — mở ở máy khác mà không có các tệp gốc thì rỗng. Muốn chiếu ở mọi nơi phải **xuất phim**." },
      { t: "Xoá tệp video gốc rồi mở lại dự án thì clip đó bị mất.",
        vi: "Đúng, cùng lí do trên: dự án chỉ **trỏ tới** tệp gốc chứ không chứa nó." },
      { t: "Nhạc nền nên để nhỏ hơn lời nói, và làm mờ dần ở đầu và cuối.",
        vi: "Đúng. Nhạc to ngang lời nói là lỗi phổ biến nhất của phim học sinh làm." },
      { t: "Xuất phim xong vẫn mở tệp phim ra sửa lại từng đoạn như trên dự án.",
        sai: true,
        vi: "Sai. Tệp phim đã xuất là **một chuỗi khung hình đã gộp**, không còn ranh giới clip nào để sửa. Muốn sửa thì mở **tệp dự án** ra sửa rồi xuất lại." },
    ],
    chot: "Nhớ hai tệp, hai vai: **tệp dự án để sửa** (cần tệp gốc đi kèm), **tệp phim đã xuất để chiếu** (không sửa được).",
  }]);

  /* ================================ TIN HỌC ỨNG DỤNG — LỚP 12 */

  K("U12-01", [{
    de: "Bốn phát biểu về kết nối và chia sẻ giữa các thiết bị. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Chia sẻ thư mục giữa các máy trong **mạng nội bộ** thì bắt buộc phải có Internet.",
        sai: true,
        vi: "Sai. Mạng nội bộ (LAN) chạy độc lập: các máy vẫn chia sẻ tệp, dùng chung máy in dù nhà mạng đứt hoàn toàn. Internet chỉ cần khi muốn ra ngoài." },
      { t: "**Bluetooth** hợp cho tệp nhỏ ở tầm gần, không cần mạng.",
        vi: "Đúng. Chậm nhưng tiện và không phụ thuộc hạ tầng nào." },
      { t: "Khi chia sẻ một thư mục phải **đặt quyền**: cho xem thôi hay cho cả sửa và xoá.",
        vi: "Đúng, và nên cho quyền thấp nhất đủ dùng." },
      { t: "Nên **tắt chia sẻ** khi đã xong việc.",
        vi: "Đúng. Thư mục mở suốt trong mạng phòng máy nghĩa là ai ngồi vào máy nào cũng vào được." },
    ],
    chot: "Chọn cách chia sẻ theo **dung lượng và khoảng cách**: nhiều dữ liệu và ở cạnh nhau thì dùng cáp; ở xa thì đám mây.",
  }]);

  K("U12-02", [{
    de: "Bốn quyết định khi chuẩn bị một dự án trang web. Có **hai** quyết định sai.",
    loai: "y",
    dong: [
      { t: "Đặt tên tệp trang chủ là **`index.html`**.",
        vi: "Đúng, và quan trọng: đó là tên mà máy chủ tự mở khi có người vào địa chỉ gốc. Đặt tên khác thì phải gõ cả tên tệp mới vào được." },
      { t: "Dùng thẳng ảnh gốc từ máy ảnh cho nét, không thu nhỏ lại.",
        sai: true,
        vi: "Sai. Ảnh gốc có thể vài MB mỗi tấm; trang mười ảnh là hàng chục MB, tải trên mạng di động rất lâu. Phải **thu nhỏ về đúng kích thước hiển thị** và nén trước khi đưa lên." },
      { t: "Vẽ sơ đồ các trang và liên kết giữa chúng trước khi gõ dòng HTML nào.",
        vi: "Đúng. Biết trước có mấy trang thì viết `href` không bị sai và không phải đổi tên tệp giữa chừng." },
      { t: "Đặt tên tệp có dấu tiếng Việt và khoảng trắng, ví dụ `giới thiệu.html`.",
        sai: true,
        vi: "Sai. Dấu và khoảng trắng trong đường dẫn web bị mã hoá thành ký tự lạ (`%20`), dễ gây liên kết chết trên một số máy chủ. Dùng **chữ không dấu, nối bằng gạch ngang**: `gioi-thieu.html`." },
    ],
    chot: "Tổ chức thư mục ngay từ đầu: `index.html` ở gốc, ảnh trong `anh/`, kiểu dáng trong `css/`. Đổi cấu trúc sau khi đã viết nhiều trang là hỏng hàng loạt liên kết.",
  }]);

  K("U12-03", [{
    de: "Bốn phát biểu về cấu trúc khối của một trang web. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "`<header>`, `<nav>` và `<footer>` nên **giống nhau ở mọi trang** của website.",
        vi: "Đúng. Người xem dựa vào những khối cố định này để biết mình đang ở đâu và đi tiếp thế nào." },
      { t: "`<main>` chứa nội dung **riêng của trang đang mở**, khác nhau ở từng trang.",
        vi: "Đúng — đó là phần duy nhất thật sự thay đổi giữa các trang." },
      { t: "Dùng `<div>` thay cho `<header>`, `<nav>`, `<main>` thì trình đọc màn hình vẫn hiểu như nhau.",
        sai: true,
        vi: "Sai. `<div>` **không mang nghĩa gì** — trình đọc màn hình chỉ thấy “một khối”. Với các thẻ đúng nghĩa, người khiếm thị **nhảy thẳng tới** thanh điều hướng hoặc nội dung chính, và máy tìm kiếm cũng hiểu đâu là nội dung chính." },
      { t: "Một trang nên có **nhiều** thẻ `<main>` để chia nội dung cho rõ.",
        sai: true,
        vi: "Sai. Mỗi trang chỉ có **một** `<main>` — nó nghĩa là “nội dung chính của trang này”, mà nội dung chính thì chỉ có một. Muốn chia nhỏ bên trong thì dùng `<section>`." },
    ],
    chot: "Bốn khối theo thứ tự: **header → nav → main → footer**. Dùng đúng thẻ là làm trang **dùng được cho mọi người**, không chỉ cho mắt nhìn.",
  }]);

  K("U12-04", [{
    de: "Bốn phát biểu về phần thân và chân trang. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Trật tự tiêu đề nên liền mạch: `<h1>` rồi `<h2>` rồi `<h3>`, không nhảy cấp.",
        vi: "Đúng. Trật tự tiêu đề là bộ khung mục lục của trang, cả trình đọc màn hình lẫn máy tìm kiếm đều dựa vào đó." },
      { t: "Muốn chữ nhỏ hơn một chút thì dùng `<h3>` thay cho `<h2>`.",
        sai: true,
        vi: "Sai. Cấp tiêu đề nói về **vai trò trong cấu trúc**, không phải cỡ chữ. Muốn đổi cỡ thì dùng CSS: `h2 { font-size: 20px; }`." },
      { t: "Chân trang thường đặt thông tin liên hệ, bản quyền và các liên kết phụ.",
        vi: "Đúng. Đó là nơi người xem tìm khi không thấy thứ mình cần ở phần trên." },
      { t: "Nên đặt **nhiều `<h1>`** trong một trang để máy tìm kiếm thấy trang quan trọng hơn.",
        sai: true,
        vi: "Sai. `<h1>` là **tiêu đề của cả trang** nên chỉ nên có một. Nhồi nhiều `<h1>` không làm thứ hạng tốt hơn, mà còn làm cấu trúc trang rối." },
    ],
    chot: "Chia `<main>` bằng `<section>`, mỗi phần mở đầu bằng một `<h2>`. Cấp tiêu đề là **cấu trúc**, cỡ chữ là **CSS**.",
  }]);

  K("U12-05", [{
    de: "Thanh điều hướng của một trang web. Có **hai** dòng sai.",
    loai: "ma",
    dong: [
      { t: "<nav>\n  <a href=\"index.html\">Trang chủ</a>",
        vi: "Đúng. Đường dẫn tương đối, trỏ tới tệp cùng thư mục — đưa lên máy chủ vẫn chạy." },
      { t: "  <a href=\"file:///D:/web/lien-he.html\">Liên hệ</a>",
        sai: true,
        vi: "Sai. Đây là **đường dẫn tuyệt đối trên máy của em**. Trên máy em bấm thì được, nhưng đưa lên mạng là liên kết chết với mọi người khác. Phải viết `href=\"lien-he.html\"`." },
      { t: "  <a href=\"san-pham.html\">Sản phẩm</a>",
        vi: "Đúng, cùng kiểu với dòng đầu." },
      { t: "  <a>Giới thiệu</a>\n</nav>",
        sai: true,
        vi: "Sai. Thiếu thuộc tính **`href`** nên đây không còn là liên kết — hiện ra chữ nhưng bấm không đi đâu, và bàn phím cũng không Tab tới được. Phải là `<a href=\"gioi-thieu.html\">Giới thiệu</a>`." },
    ],
    chot: "Luôn dùng **đường dẫn tương đối** trong một website. Và kiểm bằng cách bấm thử **từng** liên kết trước khi coi là xong.",
  }]);

  K("U12-06", [{
    de: "Bốn phát biểu về biểu mẫu trong HTML. Chỉ ra phát biểu sai.",
    loai: "y",
    dong: [
      { t: "Các nút `type=\"radio\"` phải có **cùng `name`** thì mới loại trừ nhau.",
        vi: "Đúng. Khác `name` là chúng thành các nhóm riêng, chọn được nhiều cái cùng lúc — lỗi hay gặp." },
      { t: "`type=\"checkbox\"` cho phép chọn **nhiều** ô cùng lúc.",
        vi: "Đúng: radio chọn một, checkbox chọn nhiều." },
      { t: "Trang HTML tĩnh chỉ có `<form>`, bấm nút Gửi là dữ liệu tự được lưu vào máy chủ.",
        sai: true,
        vi: "Sai. HTML chỉ **thu** dữ liệu và gửi đi; muốn **nhận và lưu** thì phải có chương trình phía máy chủ. Biểu mẫu trên một trang tĩnh bấm Gửi sẽ chưa đi đâu cả." },
      { t: "Gắn `<label>` cho mỗi ô thì bấm vào dòng chữ cũng chọn được ô đó.",
        vi: "Đúng, và nó còn giúp trình đọc màn hình đọc đúng tên ô — nên `<label>` gần như là bắt buộc." },
    ],
    chot: "Nhớ ranh giới: **HTML lo phần hỏi, máy chủ lo phần nhận**. Đề rất hay hỏi ở đúng chỗ này.",
  }]);

  K("U12-07", [{
    de: "Bốn phát biểu về kiểm thử một trang web. Có **hai** chỗ sai.",
    loai: "y",
    dong: [
      { t: "Trang **trượt ngang được** trên điện thoại là chuyện bình thường, không cần sửa.",
        sai: true,
        vi: "Sai — đó là dấu hiệu lỗi bố cục nặng nhất trên di động. Nguyên nhân thường là một ảnh hoặc bảng đặt chiều rộng cố định; thêm `max-width: 100%` cho ảnh chữa được phần lớn." },
      { t: "Phải bấm thử **từng** liên kết để tìm liên kết chết.",
        vi: "Đúng. Liên kết chết hay sinh ra khi đổi tên tệp mà quên sửa chỗ trỏ tới." },
      { t: "Nên kiểm ảnh đã có thuộc tính `alt` và trang đã có `<title>` chưa.",
        vi: "Đúng. `alt` cho người khiếm thị và cho lúc ảnh lỗi; `<title>` hiện trên tab và trong kết quả tìm kiếm." },
      { t: "Chạy tốt trên một trình duyệt thì các trình duyệt khác cũng hiện y hệt.",
        sai: true,
        vi: "Sai. Mỗi trình duyệt có kiểu mặc định hơi khác nhau, và hỗ trợ các tính năng CSS mới không giống nhau. Nên thử **ít nhất hai** trình duyệt khác nhau." },
    ],
    chot: "Bốn việc phải làm trước khi coi là xong: **kiểm liên kết · thử trên điện thoại · thử trình duyệt khác · soát chính tả và `alt`**.",
  }]);
})();
