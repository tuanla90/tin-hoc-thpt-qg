/* ============================================================================
 *  CÂU HỎI TÌNH HUỐNG ỨNG DỤNG — đặt người học vào một cảnh có thật rồi mới hỏi
 *
 *  Vì sao tách riêng: phần lớn ngân hàng hiện có là hỏi định nghĩa ("X là gì?",
 *  "Phát biểu nào đúng?"). Đề thi tốt nghiệp lại thiên về tình huống: cho một
 *  bối cảnh đời thường (nhà trường, quán ăn, mạng nhà, nhóm chat, bảng tính của
 *  mẹ...) rồi hỏi phải làm gì / vì sao / chọn cách nào. Bộ này bù đúng chỗ đó.
 *
 *  Quy tắc viết (giữ khi thêm câu mới):
 *   - Mở đầu bằng NGƯỜI và VIỆC cụ thể, không mở bằng thuật ngữ.
 *   - Phương án nhiễu phải là cái học sinh THẬT SỰ hay chọn nhầm, không bịa cho đủ.
 *   - Lời giải nói rõ vì sao phương án nhiễu sai, không chỉ nhắc lại đáp án.
 *   - KHÔNG có dạng trả lời ngắn: cấu trúc đề Tin học chỉ có trắc nghiệm + Đúng/Sai.
 *
 *  ID tự sinh nối tiếp số hiện có (giống questions-vandung.js) nên tệp này phải
 *  nạp SAU mọi tệp câu hỏi khác trong index.html.
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;

  var NEW = [

    /* =========================== A — MÁY TÍNH & XÃ HỘI TRI THỨC =========================== */
    { type: "mc", topic: "A", grade: 10, level: "medium",
      question: "Điện thoại của Lan báo sắp hết dung lượng. Lan thấy một video quay 4K dài 3 phút nặng 1,2 GB, còn 400 tấm ảnh chụp thường chỉ nặng tổng cộng 800 MB. Vì sao một video ngắn lại nặng hơn hàng trăm tấm ảnh?",
      options: [
        "Vì video lưu liên tiếp rất nhiều khung hình, mỗi khung gần như một tấm ảnh, kèm cả âm thanh",
        "Vì video luôn được lưu ở định dạng không nén còn ảnh thì luôn được nén",
        "Vì video phải lưu thêm tên người quay và vị trí chụp",
        "Vì một giây video luôn chiếm đúng 1 MB theo quy định",
      ], answer: 0,
      explain: "Video 4K quay ở 30 khung hình/giây thì 3 phút đã là hơn 5.000 khung, mỗi khung tương đương một ảnh độ phân giải cao, lại kèm âm thanh. Phương án B sai vì video cũng được nén rất mạnh (chính nhờ nén nó mới chỉ còn 1,2 GB). C và D là con số bịa." },

    { type: "mc", topic: "A", grade: 10, level: "medium",
      question: "Thầy giáo yêu cầu nộp bài dưới dạng tệp văn bản. Nam gõ bài trong Word rồi lưu, dung lượng 45 KB. Bạn Nam chụp màn hình bài đó rồi nộp ảnh, dung lượng 2,3 MB. Nhận xét nào đúng nhất?",
      options: [
        "Ảnh chụp nặng hơn nhiều mà máy không đọc được chữ bên trong để tìm kiếm hay chỉnh sửa",
        "Ảnh chụp tốt hơn vì giữ nguyên được hình thức trình bày",
        "Hai cách lưu là như nhau, chỉ khác phần mở rộng của tệp",
        "Tệp Word nặng hơn vì phải lưu cả phông chữ",
      ], answer: 0,
      explain: "Văn bản lưu từng kí tự bằng mã (mỗi kí tự chỉ vài byte) nên rất nhẹ và máy hiểu được nội dung — tìm kiếm, sửa, đếm từ đều được. Ảnh chỉ là lưới điểm ảnh: nặng hơn hàng chục lần mà máy không biết trong đó viết gì." },

    { type: "mc", topic: "A", grade: 10, level: "easy",
      question: "Mẹ nhờ Bình mua thẻ nhớ 64 GB để lưu ảnh. Ra cửa hàng, Bình thấy thẻ ghi 64 GB nhưng cắm vào máy chỉ hiện khoảng 59,6 GB. Vì sao?",
      options: [
        "Nhà sản xuất tính 1 GB = 1.000 MB, còn máy tính tính theo bội số của 1024",
        "Cửa hàng đã bán thẻ giả thiếu dung lượng",
        "Một phần thẻ nhớ đã bị hỏng khi vận chuyển",
        "Máy tính luôn giữ lại đúng 4,4 GB để chạy hệ điều hành",
      ], answer: 0,
      explain: "Nhà sản xuất quảng cáo theo hệ thập phân (1 GB = 1.000.000.000 byte), còn máy tính quy đổi theo bội số 1024. Chia lại thì 64 tỉ byte chỉ còn khoảng 59,6 GB theo cách máy tính đếm — thẻ không hề thiếu." },

    { type: "mc", topic: "A", grade: 10, level: "medium",
      question: "Trong giờ thực hành, máy của Hoa đang mở 15 tab trình duyệt thì chạy chậm hẳn, quạt kêu to. Bạn khuyên Hoa nâng cấp máy. Bộ phận nào nên nâng cấp trước để đỡ chậm khi mở nhiều tab?",
      options: ["RAM", "Màn hình", "Bàn phím cơ", "Card mạng"],
      answer: 0,
      explain: "Mỗi tab chiếm một phần bộ nhớ trong (RAM). Thiếu RAM, máy phải liên tục chuyển dữ liệu ra ổ đĩa nên chậm hẳn. Màn hình, bàn phím, card mạng không liên quan tới việc giữ nhiều tab cùng lúc." },

    { type: "mc", topic: "A", grade: 10, level: "medium",
      question: "Trường tổ chức khảo sát, thu về 800 phiếu trả lời gồm tên, lớp và điểm hài lòng từ 1 đến 5. Ban tổ chức muốn biết \"lớp nào hài lòng nhất\". Dãy 800 con số thu về đóng vai trò gì trong quá trình này?",
      options: [
        "Là dữ liệu; sau khi xử lí, tính trung bình theo lớp mới thành thông tin có ý nghĩa",
        "Là thông tin, vì đã ghi rõ ràng trên phiếu",
        "Là tri thức, vì giúp ra quyết định",
        "Không phải dữ liệu lẫn thông tin vì chưa nhập vào máy tính",
      ], answer: 0,
      explain: "Dãy số thô chưa trả lời được câu hỏi nào — đó là dữ liệu. Chỉ khi xử lí (nhóm theo lớp, tính trung bình, so sánh) mới thành thông tin. Dữ liệu không cần nằm trong máy tính mới được gọi là dữ liệu." },

    { type: "mc", topic: "A", grade: 10, level: "hard",
      question: "Một cảm biến đo nhiệt độ phòng gửi về máy tính giá trị 26,5 độ. Máy tính chỉ làm việc với dãy bit. Điều gì BẮT BUỘC phải xảy ra trước khi máy tính lưu được giá trị này?",
      options: [
        "Giá trị được số hoá: chuyển từ tín hiệu liên tục thành một số biểu diễn bằng dãy bit",
        "Giá trị được đổi sang tiếng Anh rồi mới mã hoá",
        "Giá trị được nhân với 1024 để thành số nguyên",
        "Giá trị được lưu nguyên dạng chữ \"26,5 độ\" nên không cần chuyển đổi",
      ], answer: 0,
      explain: "Nhiệt độ là đại lượng liên tục, còn máy tính chỉ hiểu 0 và 1. Bước số hoá (lấy mẫu và lượng tử hoá) biến nó thành một số hữu hạn bit. Ngay cả khi hiển thị là chữ \"26,5\" thì bên trong vẫn là dãy bit." },

    { type: "mc", topic: "A", grade: 11, level: "medium",
      question: "Anh của Tú nói: \"Máy tính 64-bit chạy nhanh gấp đôi máy 32-bit\". Nhận định nào đúng?",
      options: [
        "Không hẳn; 64-bit chủ yếu cho phép dùng nhiều RAM hơn và xử lí số lớn trong một lần",
        "Đúng, vì tốc độ luôn tỉ lệ thuận với số bit",
        "Đúng, vì 64-bit có gấp đôi số nhân xử lí",
        "Sai, vì 64-bit thực ra chậm hơn 32-bit",
      ], answer: 0,
      explain: "Con số 32/64-bit nói về độ rộng thanh ghi và địa chỉ bộ nhớ, không phải tốc độ. Lợi ích rõ nhất là địa chỉ hoá được nhiều RAM hơn (32-bit bị chặn ở khoảng 4 GB) và xử lí số lớn gọn hơn. Số nhân xử lí là chuyện hoàn toàn khác." },

    { type: "mc", topic: "A", grade: 10, level: "easy",
      question: "Khi soạn thảo, Mai gõ chữ \"Ơ\" nhưng máy bạn cùng bàn mở tệp lên lại hiện ra kí tự lạ. Nguyên nhân thường gặp nhất là gì?",
      options: [
        "Hai máy dùng bảng mã khác nhau khi mở tệp",
        "Máy kia thiếu bộ nhớ nên không hiện được",
        "Tệp đã bị nhiễm virus",
        "Chữ \"Ơ\" không tồn tại trong máy tính",
      ], answer: 0,
      explain: "Cùng một dãy byte nhưng đọc bằng bảng mã khác sẽ ra kí tự khác. Đây chính là lí do Unicode ra đời: một bảng mã chung cho mọi ngôn ngữ, tránh cảnh mỗi máy hiểu một kiểu." },

    { type: "mc", topic: "A", grade: 11, level: "medium",
      question: "Cửa hàng của bác Ba muốn lưu lại mọi hoá đơn để cuối tháng thống kê. Bác hỏi nên lưu trên máy tính cửa hàng hay lưu trên dịch vụ đám mây. Lợi thế RÕ NHẤT của đám mây trong trường hợp này là gì?",
      options: [
        "Dữ liệu vẫn còn nếu máy tính cửa hàng hỏng hoặc mất, và xem được từ nhiều nơi",
        "Đám mây luôn miễn phí nên tiết kiệm chi phí",
        "Đám mây xử lí nhanh hơn máy tính tại chỗ trong mọi trường hợp",
        "Đám mây không cần Internet nên tiện hơn",
      ], answer: 0,
      explain: "Điểm mạnh của đám mây là dữ liệu nằm ngoài thiết bị nên hỏng máy không mất dữ liệu, lại truy cập được nhiều nơi. Đám mây không miễn phí vô hạn, không nhanh hơn trong mọi việc, và bắt buộc phải có Internet." },

    { type: "mc", topic: "A", grade: 11, level: "hard",
      question: "Phòng máy của trường có 30 máy. Cô giáo muốn cài cùng một phần mềm cho cả 30 máy nhưng chỉ mua được một giấy phép dùng cho một máy. Cách xử lí ĐÚNG là gì?",
      options: [
        "Mua đủ giấy phép cho 30 máy, hoặc chọn phần mềm nguồn mở/miễn phí cho giáo dục tương đương",
        "Cài chung một giấy phép cho cả 30 máy vì dùng trong trường học nên được miễn trừ",
        "Cài bản bẻ khoá vì trường không kinh doanh",
        "Chỉ cần cài cho máy giáo viên, học sinh xem chung màn chiếu",
      ], answer: 0,
      explain: "Giấy phép một máy chỉ hợp pháp trên một máy; mục đích giáo dục không tự động miễn trừ. Cách đúng là mua đủ số giấy phép, xin giấy phép giáo dục của hãng, hoặc dùng phần mềm nguồn mở tương đương." },

    { type: "mc", topic: "A", grade: 12, level: "medium",
      question: "Khi Hùng gửi ảnh qua ứng dụng nhắn tin, ảnh nhận được mờ hơn ảnh gốc rõ rệt. Ứng dụng đã làm gì với ảnh?",
      options: [
        "Nén ảnh theo kiểu mất dữ liệu để gửi nhanh và tốn ít băng thông",
        "Đổi ảnh sang định dạng văn bản",
        "Xoá bớt màu trong bảng màu của ảnh cho nhẹ",
        "Cắt bớt chiều rộng ảnh cho vừa màn hình",
      ], answer: 0,
      explain: "Nén mất dữ liệu (như JPEG chất lượng thấp) bỏ bớt chi tiết mắt người ít nhận ra để giảm mạnh dung lượng — đổi lại ảnh mờ đi và không khôi phục lại được. Nén không mất dữ liệu thì giữ nguyên chất lượng nhưng nhẹ ít hơn." },

    { type: "mc", topic: "A", grade: 12, level: "medium",
      question: "Một trợ lí ảo trả lời trôi chảy nhưng lại nói sai ngày sinh của một nhân vật lịch sử. Với người dùng, cách xử lí hợp lí nhất là gì?",
      options: [
        "Kiểm chứng lại thông tin ở nguồn đáng tin trước khi dùng, vì mô hình có thể tạo ra nội dung nghe hợp lí mà sai",
        "Tin tưởng vì máy tính không bao giờ nhầm",
        "Hỏi lại đúng câu đó nhiều lần cho tới khi ra đáp án khác",
        "Kết luận rằng mọi câu trả lời của trợ lí ảo đều sai",
      ], answer: 0,
      explain: "Mô hình ngôn ngữ sinh câu theo xác suất chứ không tra cứu sự thật, nên có thể nói sai rất trôi chảy. Thái độ đúng là dùng nó như công cụ gợi ý rồi tự kiểm chứng — không tin tuyệt đối mà cũng không phủ nhận sạch trơn." },

    { type: "mc", topic: "A", grade: 12, level: "hard",
      question: "Trường muốn dùng phần mềm nhận diện khuôn mặt để điểm danh học sinh. Vấn đề cần cân nhắc kĩ NHẤT trước khi triển khai là gì?",
      options: [
        "Dữ liệu sinh trắc học là dữ liệu cá nhân nhạy cảm, cần sự đồng ý và có cách bảo vệ, lưu trữ an toàn",
        "Phần mềm có giao diện đẹp hay không",
        "Máy tính có đủ dung lượng ổ cứng để lưu ảnh hay không",
        "Học sinh có thích chụp ảnh hay không",
      ], answer: 0,
      explain: "Khuôn mặt là dữ liệu sinh trắc học — mất thì không đổi lại được như mật khẩu. Phải hỏi ý kiến người học và người giám hộ, nêu rõ mục đích, thời hạn lưu và cách bảo vệ. Dung lượng hay giao diện chỉ là chuyện kĩ thuật phụ." },

    { type: "mc", topic: "A", grade: 11, level: "easy",
      question: "Máy tính của Khoa bật lên rất lâu mới vào được màn hình chính. Bạn khuyên thay ổ cứng HDD bằng SSD. Vì sao cách này thường hiệu quả?",
      options: [
        "SSD đọc dữ liệu nhanh hơn nhiều lần vì không có đĩa quay và đầu đọc cơ học",
        "SSD có dung lượng luôn lớn hơn HDD",
        "SSD làm tăng tốc độ đường truyền Internet",
        "SSD giúp màn hình hiển thị nhiều màu hơn",
      ], answer: 0,
      explain: "Khởi động là lúc máy đọc rất nhiều tệp nhỏ nằm rải rác. HDD phải quay đĩa và di chuyển đầu đọc nên chậm; SSD dùng bộ nhớ bán dẫn, đọc gần như tức thì. Dung lượng, mạng và màu sắc không liên quan." },

    { type: "mc", topic: "A", grade: 10, level: "medium",
      question: "Lớp cần chọn cách lưu danh sách 45 học sinh gồm họ tên, ngày sinh, điểm ba môn để dễ sắp xếp và tính điểm trung bình. Cách lưu nào phù hợp nhất?",
      options: [
        "Bảng tính, mỗi học sinh một hàng và mỗi thuộc tính một cột",
        "Một tệp văn bản gõ liền, mỗi bạn một đoạn văn",
        "Một tấm ảnh chụp lại bảng danh sách viết tay",
        "Một bản trình chiếu, mỗi bạn một trang",
      ], answer: 0,
      explain: "Dữ liệu có cấu trúc lặp lại (cùng bộ thuộc tính cho mọi học sinh) rất hợp với bảng tính: sắp xếp, lọc, tính trung bình chỉ bằng một thao tác. Ba cách còn lại đều biến dữ liệu thành thứ máy không tính toán được." },

    { type: "mc", topic: "A", grade: 12, level: "medium",
      question: "Một ứng dụng học tập xin quyền truy cập danh bạ, vị trí và micrô. Học sinh nên làm gì?",
      options: [
        "Chỉ cấp những quyền thực sự cần cho chức năng đang dùng, từ chối phần còn lại",
        "Cấp hết cho nhanh vì không cấp thì ứng dụng không chạy",
        "Gỡ ứng dụng ngay vì mọi ứng dụng xin quyền đều xấu",
        "Cấp hết rồi tắt Internet để dữ liệu không gửi đi được",
      ], answer: 0,
      explain: "Nguyên tắc là quyền tối thiểu: ứng dụng học từ vựng cần micrô để luyện nói thì cấp micrô, chứ không có lí do gì cần danh bạ hay vị trí. Đa số ứng dụng vẫn chạy khi bị từ chối quyền không cốt lõi." },

    { type: "mc", topic: "A", grade: 11, level: "medium",
      question: "Bố của Vy hỏi vì sao cùng một bức ảnh mà lưu sang định dạng PNG lại nặng gấp nhiều lần JPG. Giải thích đúng là gì?",
      options: [
        "PNG nén không mất dữ liệu nên giữ nguyên mọi điểm ảnh, còn JPG bỏ bớt chi tiết để nhẹ hơn",
        "PNG lưu được nhiều màu hơn nên luôn đẹp hơn trong mọi trường hợp",
        "JPG chỉ lưu được ảnh trắng đen nên nhẹ",
        "PNG lưu kèm cả phần mềm để mở ảnh",
      ], answer: 0,
      explain: "PNG dùng nén không mất dữ liệu: mở ra đúng từng điểm ảnh như gốc, đổi lại nặng hơn. JPG chấp nhận bỏ chi tiết để giảm mạnh dung lượng. Vì thế ảnh chụp thường để JPG, còn ảnh có chữ, nét sắc hoặc nền trong suốt thì để PNG." },

    { type: "mc", topic: "A", grade: 10, level: "hard",
      question: "Một tệp nhạc dài 4 phút, lấy mẫu 44.100 lần mỗi giây, mỗi mẫu 16 bit, thu 2 kênh (âm thanh nổi) và KHÔNG nén. Dung lượng xấp xỉ bao nhiêu?",
      options: ["Khoảng 42 MB", "Khoảng 4 MB", "Khoảng 420 MB", "Khoảng 400 KB"],
      answer: 0,
      explain: "Mỗi giây: 44.100 × 16 bit × 2 kênh = 1.411.200 bit ≈ 176,4 KB. Nhân 240 giây ≈ 42 MB. Đây chính là lí do định dạng nén như MP3 ra đời — cùng bài hát chỉ còn vài MB." },

    { type: "tf", topic: "A", grade: 10, level: "medium",
      question: "Nhà bạn Sơn có một máy tính cũ chạy chậm. Sơn tìm hiểu và đưa ra vài nhận định. Xét tính đúng/sai:",
      statements: [
        { text: "Thêm RAM giúp máy mở được nhiều chương trình cùng lúc mà ít bị chậm", correct: true },
        { text: "Ổ SSD giúp máy khởi động và mở phần mềm nhanh hơn ổ HDD", correct: true },
        { text: "Xoá bớt tệp trong ổ đĩa luôn làm CPU tính toán nhanh hơn", correct: false },
        { text: "Màn hình lớn hơn sẽ làm máy chạy nhanh hơn", correct: false },
      ],
      explain: "(a)(b) đúng: RAM quyết định số việc giữ được cùng lúc, SSD quyết định tốc độ đọc tệp. (c) sai vì dung lượng trống không làm CPU nhanh hơn (chỉ tránh được tình trạng đầy ổ gây treo). (d) sai hoàn toàn — màn hình chỉ là thiết bị hiển thị." },

    { type: "tf", topic: "A", grade: 11, level: "medium",
      question: "Lớp 11A thảo luận về dữ liệu và thông tin qua ví dụ: bảng điểm thi của cả khối gồm 400 con số. Xét tính đúng/sai:",
      statements: [
        { text: "400 con số đó là dữ liệu", correct: true },
        { text: "Câu \"điểm trung bình khối là 7,2\" là thông tin rút ra từ dữ liệu", correct: true },
        { text: "Dữ liệu chỉ được gọi là dữ liệu khi đã nằm trong máy tính", correct: false },
        { text: "Cùng một tập dữ liệu chỉ có thể rút ra đúng một thông tin duy nhất", correct: false },
      ],
      explain: "(a)(b) đúng theo đúng định nghĩa dữ liệu → xử lí → thông tin. (c) sai: điểm ghi trên giấy vẫn là dữ liệu. (d) sai: từ cùng bảng điểm có thể rút ra điểm trung bình, tỉ lệ đạt, môn yếu nhất... tuỳ câu hỏi đặt ra." },

    { type: "tf", topic: "A", grade: 12, level: "hard",
      question: "Trường dự định dùng một phần mềm trí tuệ nhân tạo để chấm tự động bài luận của học sinh. Xét tính đúng/sai:",
      statements: [
        { text: "Kết quả chấm nên có giáo viên xem lại, vì mô hình có thể chấm lệch với trường hợp bất thường", correct: true },
        { text: "Cần cho học sinh biết bài của mình được chấm bằng phần mềm", correct: true },
        { text: "Vì là máy chấm nên kết quả luôn khách quan và công bằng tuyệt đối", correct: false },
        { text: "Bài luận của học sinh có thể tải lên bất kì dịch vụ nào mà không cần cân nhắc", correct: false },
      ],
      explain: "(a)(b) đúng: cần con người giám sát và cần minh bạch với người bị đánh giá. (c) sai vì mô hình học từ dữ liệu cũ nên mang theo thiên lệch của dữ liệu đó. (d) sai vì bài viết của học sinh là dữ liệu cá nhân, đưa lên dịch vụ ngoài phải cân nhắc và xin phép." },

    { type: "tf", topic: "A", grade: 10, level: "easy",
      question: "Bạn Hà nói về đơn vị đo dữ liệu khi mua thẻ nhớ và gói cước mạng. Xét tính đúng/sai:",
      statements: [
        { text: "1 KB lớn hơn 1 byte", correct: true },
        { text: "1 GB lớn hơn 1 MB", correct: true },
        { text: "1 byte gồm 8 bit", correct: true },
        { text: "1 MB lớn hơn 1 GB", correct: false },
      ],
      explain: "(a) Đúng: 1 KB = 1024 byte nên lớn hơn 1 byte. (b) Đúng: 1 GB = 1024 MB nên lớn hơn 1 MB. (c) Đúng: 1 byte gồm đúng 8 bit. (d) Sai: thứ tự từ nhỏ tới lớn là bit → byte → KB → MB → GB → TB, nên 1 MB nhỏ hơn 1 GB chứ không lớn hơn." },

    { type: "tf", topic: "A", grade: 11, level: "medium",
      question: "Chị của Minh làm nghề chỉnh sửa ảnh, hay nhắc tới độ phân giải. Xét tính đúng/sai:",
      statements: [
        { text: "Ảnh 4000×3000 điểm ảnh có nhiều điểm ảnh hơn ảnh 1920×1080", correct: true },
        { text: "Cùng nội dung, ảnh nhiều điểm ảnh hơn thường nặng hơn", correct: true },
        { text: "Phóng to một ảnh nhỏ sẽ tự sinh thêm chi tiết vốn không có trong ảnh gốc", correct: false },
        { text: "Ảnh vectơ phóng to bao nhiêu cũng không bị vỡ", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: phóng to ảnh điểm ảnh chỉ kéo giãn các điểm sẵn có nên càng mờ hoặc vỡ — chi tiết đã mất thì không tự quay lại (các công cụ AI chỉ đoán thêm chi tiết chứ không khôi phục cái gốc)." },

    /* =========================== B — MẠNG MÁY TÍNH & INTERNET =========================== */
    { type: "mc", topic: "B", grade: 10, level: "medium",
      question: "Nhà Trang lắp mạng 100 Mbps nhưng khi tải tệp chỉ thấy tốc độ khoảng 12 MB/s. Trang tưởng bị nhà mạng bớt xén. Thực tế là gì?",
      options: [
        "Đúng như hợp đồng: 100 Mbps là megabit/giây, chia 8 mới ra khoảng 12,5 megabyte/giây",
        "Nhà mạng đã cắt bớt một nửa tốc độ",
        "Máy tính hiển thị sai đơn vị",
        "Tốc độ tải luôn bằng một phần mười tốc độ hợp đồng",
      ], answer: 0,
      explain: "Nhà mạng ghi tốc độ bằng bit/giây (Mbps), còn phần mềm tải hiện byte/giây (MB/s). 1 byte = 8 bit nên 100 Mbps ≈ 12,5 MB/s — con số Trang thấy là hoàn toàn khớp." },

    { type: "mc", topic: "B", grade: 11, level: "medium",
      question: "Máy của Đức vào được Facebook nhưng không vào được trang web của trường, trong khi bạn cùng lớp vẫn vào bình thường. Cách kiểm tra hợp lí ĐẦU TIÊN là gì?",
      options: [
        "Thử mở trang trường bằng mạng khác hoặc máy khác để xác định lỗi nằm ở máy mình hay ở máy chủ trường",
        "Cài lại toàn bộ hệ điều hành",
        "Mua gói cước Internet tốc độ cao hơn",
        "Thay dây mạng mới",
      ], answer: 0,
      explain: "Vào được Facebook chứng tỏ Internet vẫn thông, nên lỗi khoanh vùng ở phía trang trường hoặc ở cấu hình máy Đức. Thử máy khác hoặc mạng khác là bước tách biệt nguyên nhân nhanh nhất, trước khi làm những việc tốn kém." },

    { type: "mc", topic: "B", grade: 11, level: "medium",
      question: "Khi Ngọc gõ \"truonghoc.edu.vn\" vào trình duyệt, việc đầu tiên máy cần làm là gì?",
      options: [
        "Hỏi hệ thống tên miền DNS để đổi tên đó thành địa chỉ IP",
        "Tải toàn bộ trang web về rồi mới tìm địa chỉ",
        "Gửi mật khẩu Wi-Fi tới máy chủ của trang",
        "Kiểm tra xem máy có phần mềm diệt virus chưa",
      ], answer: 0,
      explain: "Máy tính định tuyến theo địa chỉ IP chứ không theo tên chữ. DNS đóng vai trò danh bạ: tra tên miền ra IP, rồi trình duyệt mới kết nối tới máy chủ đó để tải trang." },

    { type: "mc", topic: "B", grade: 12, level: "medium",
      question: "Ở quán cà phê, Lâm định đăng nhập tài khoản ngân hàng qua Wi-Fi công cộng miễn phí. Lời khuyên đúng nhất là gì?",
      options: [
        "Nên dùng mạng di động của mình hoặc chờ về nhà, vì Wi-Fi công cộng dễ bị nghe lén hoặc giả mạo",
        "Cứ đăng nhập bình thường vì đã có mật khẩu Wi-Fi",
        "Chỉ cần đổi mật khẩu ngân hàng sau khi dùng là an toàn",
        "Chỉ cần tắt Bluetooth là đủ an toàn",
      ], answer: 0,
      explain: "Wi-Fi công cộng có thể bị dựng giả (điểm phát trùng tên) hoặc bị nghe lén trong cùng mạng. Với giao dịch quan trọng, dùng mạng di động riêng an toàn hơn nhiều. Đổi mật khẩu sau khi đã lộ là quá muộn." },

    { type: "mc", topic: "B", grade: 12, level: "hard",
      question: "Trang web của lớp hiển thị ổ khoá và địa chỉ bắt đầu bằng https. Điều này bảo đảm điều gì?",
      options: [
        "Dữ liệu trao đổi giữa máy và trang được mã hoá trên đường truyền",
        "Nội dung trên trang chắc chắn là đúng sự thật",
        "Trang không thể chứa mã độc",
        "Chủ trang là một tổ chức được nhà nước cấp phép",
      ], answer: 0,
      explain: "HTTPS chỉ bảo đảm đường truyền được mã hoá và bạn đang nói chuyện đúng với máy chủ mang tên miền đó. Nó không nói gì về việc nội dung có đúng không hay chủ trang có tử tế không — trang lừa đảo vẫn xin được chứng chỉ HTTPS." },

    { type: "mc", topic: "B", grade: 10, level: "easy",
      question: "Nhà Bảo có máy tính, điện thoại, tivi và loa thông minh cùng nối vào một bộ phát Wi-Fi. Hệ thống này là ví dụ của loại mạng nào?",
      options: ["Mạng cục bộ (LAN)", "Mạng diện rộng (WAN)", "Mạng đô thị (MAN)", "Mạng vệ tinh"],
      answer: 0,
      explain: "Các thiết bị trong cùng một nhà, nối qua một bộ phát là mạng cục bộ. WAN là mạng nối các vùng địa lí rộng như Internet, còn MAN ở quy mô một thành phố." },

    { type: "mc", topic: "B", grade: 11, level: "medium",
      question: "Nhóm của Vy làm bài tập chung, cần nhiều người sửa một tài liệu cùng lúc và luôn thấy bản mới nhất. Cách làm phù hợp nhất là gì?",
      options: [
        "Dùng tài liệu trực tuyến chia sẻ quyền chỉnh sửa cho cả nhóm",
        "Mỗi người sửa bản của mình rồi gửi email cho nhóm trưởng ghép lại",
        "Chép tệp vào USB rồi chuyền tay nhau",
        "Chụp màn hình phần mình sửa rồi gửi vào nhóm chat",
      ], answer: 0,
      explain: "Tài liệu trực tuyến giữ một bản duy nhất trên máy chủ, ai sửa cũng thấy ngay nên không có cảnh nhiều bản lệch nhau. Ba cách còn lại đều sinh ra nhiều phiên bản và mất công ghép thủ công, rất dễ sót." },

    { type: "mc", topic: "B", grade: 12, level: "medium",
      question: "Nam nhận email báo \"Tài khoản sắp bị khoá, bấm vào đây để xác minh trong 24 giờ\". Địa chỉ gửi trông gần giống ngân hàng nhưng thừa một chữ cái. Nam nên làm gì?",
      options: [
        "Không bấm liên kết, tự mở ứng dụng ngân hàng hoặc gọi tổng đài để kiểm tra",
        "Bấm vào liên kết để xem thử rồi mới quyết định",
        "Trả lời email hỏi lại xem có đúng ngân hàng gửi không",
        "Chuyển tiếp email cho bạn bè nhờ kiểm tra hộ",
      ], answer: 0,
      explain: "Đây là dấu hiệu lừa đảo điển hình: tạo gấp gáp và dùng tên miền gần giống. Nguyên tắc là không bấm liên kết trong thư nghi ngờ mà tự truy cập qua kênh chính thức mình vốn biết. Trả lời hoặc chuyển tiếp chỉ làm lan rộng thêm." },

    { type: "mc", topic: "B", grade: 11, level: "hard",
      question: "Khi tải một tệp lớn, đôi lúc mạng chập chờn nhưng tệp tải xong vẫn nguyên vẹn. Giao thức nào chịu trách nhiệm chính cho việc đó?",
      options: [
        "TCP, vì nó chia dữ liệu thành gói, đánh số và yêu cầu gửi lại gói bị mất",
        "HTTP, vì nó quy định cách hiển thị trang web",
        "DNS, vì nó tra cứu tên miền",
        "SMTP, vì nó phụ trách thư điện tử",
      ], answer: 0,
      explain: "TCP bảo đảm truyền tin cậy: đánh số thứ tự gói, báo nhận, phát hiện thiếu thì yêu cầu gửi lại và ghép đúng thứ tự. HTTP nằm trên TCP, DNS lo tra tên, SMTP lo email — không cái nào làm việc này." },

    { type: "mc", topic: "B", grade: 10, level: "medium",
      question: "Wi-Fi nhà Hùng để mật khẩu là \"12345678\". Rủi ro lớn nhất là gì?",
      options: [
        "Người lạ dễ đoán ra, vào được mạng nội bộ và có thể dòm ngó thiết bị trong nhà",
        "Wi-Fi sẽ tự động chậm đi vì mật khẩu ngắn",
        "Bộ phát Wi-Fi sẽ nhanh hỏng hơn",
        "Không có rủi ro gì vì hàng xóm ở xa",
      ], answer: 0,
      explain: "Mật khẩu quá phổ biến bị dò ra trong vài giây. Vào được Wi-Fi là vào được mạng nội bộ, có thể thấy máy in, camera, ổ đĩa chia sẻ trong nhà — nguy hiểm hơn nhiều so với chuyện chỉ dùng ké mạng." },

    { type: "mc", topic: "B", grade: 12, level: "medium",
      question: "Trường muốn phát trực tiếp lễ khai giảng cho phụ huynh xem từ xa. Yếu tố kĩ thuật cần quan tâm nhất là gì?",
      options: [
        "Băng thông tải lên của đường truyền tại trường",
        "Dung lượng ổ cứng của máy quay",
        "Số lượng máy in trong phòng hành chính",
        "Tốc độ tải xuống của phụ huynh",
      ], answer: 0,
      explain: "Phát trực tiếp là đẩy dữ liệu ĐI nên phụ thuộc băng thông tải lên của trường — vốn thường thấp hơn tải xuống nhiều lần ở các gói cước phổ thông. Tốc độ tải xuống của phụ huynh cũng cần nhưng trường không kiểm soát được." },

    { type: "mc", topic: "B", grade: 11, level: "easy",
      question: "Địa chỉ IP đóng vai trò gì trong mạng máy tính?",
      options: [
        "Định danh vị trí của thiết bị để dữ liệu tìm được đường tới đúng nơi",
        "Lưu mật khẩu đăng nhập của người dùng",
        "Quy định tốc độ tối đa của đường truyền",
        "Ghi lại lịch sử duyệt web của thiết bị",
      ], answer: 0,
      explain: "IP giống địa chỉ nhà: nhờ nó mà gói tin biết đi tới thiết bị nào. Nó không chứa mật khẩu, không quyết định tốc độ và không lưu lịch sử duyệt web." },

    { type: "mc", topic: "B", grade: 12, level: "hard",
      question: "Website bán hàng của chị Mai đột nhiên không ai truy cập được, trong khi máy chủ vẫn chạy và có hàng triệu yêu cầu đổ về cùng lúc từ rất nhiều nơi. Đây nhiều khả năng là hiện tượng gì?",
      options: [
        "Tấn công từ chối dịch vụ phân tán làm nghẽn máy chủ",
        "Virus đã xoá toàn bộ tệp của trang",
        "Tên miền đã hết hạn",
        "Máy tính cá nhân của chị Mai bị nhiễm mã độc",
      ], answer: 0,
      explain: "Đặc trưng của tấn công từ chối dịch vụ phân tán là lượng yêu cầu khổng lồ từ nhiều nguồn làm máy chủ quá tải, không còn sức phục vụ người dùng thật — dù máy chủ vẫn hoạt động và dữ liệu còn nguyên." },

    { type: "mc", topic: "B", grade: 10, level: "medium",
      question: "Lan cần gửi một thư mục 3 GB cho bạn ở tỉnh khác. Cách hợp lí nhất là gì?",
      options: [
        "Tải lên dịch vụ lưu trữ đám mây rồi gửi liên kết chia sẻ",
        "Đính kèm thẳng vào email",
        "Gửi từng tệp một qua tin nhắn cho tới hết",
        "Chép ra USB rồi gửi bưu điện",
      ], answer: 0,
      explain: "Email thường giới hạn tệp đính kèm khoảng 25 MB nên 3 GB là không thể. Gửi qua đám mây rồi chia sẻ liên kết vừa nhanh vừa không giới hạn số người nhận. Gửi bưu điện thì mất nhiều ngày." },

    { type: "mc", topic: "B", grade: 11, level: "medium",
      question: "Trong phòng máy, tất cả 30 máy đều mất mạng cùng lúc, còn điện thoại dùng 4G vẫn vào Internet bình thường. Nên nghi ngờ điều gì trước tiên?",
      options: [
        "Thiết bị mạng dùng chung của phòng (bộ định tuyến hoặc bộ chia) hoặc đường truyền của trường gặp sự cố",
        "Cả 30 máy cùng nhiễm virus một lúc",
        "30 máy đều hỏng card mạng cùng lúc",
        "Nhà mạng đã chặn tất cả các trang web",
      ], answer: 0,
      explain: "Khi lỗi xảy ra đồng loạt, nguyên nhân gần như chắc chắn nằm ở điểm dùng chung — thiết bị mạng hoặc đường truyền. Việc 30 máy cùng hỏng phần cứng hay cùng nhiễm virus đúng một thời điểm là cực kì khó xảy ra." },

    { type: "mc", topic: "B", grade: 12, level: "medium",
      question: "Bạn của Tú gửi liên kết rút gọn kèm lời mời \"xem ảnh lớp mình nè\". Nguy cơ của liên kết rút gọn là gì?",
      options: [
        "Che mất địa chỉ thật nên không biết sẽ tới trang nào trước khi bấm",
        "Làm máy tính chạy chậm hơn bình thường",
        "Tự động tải virus ngay khi nhìn thấy liên kết",
        "Làm lộ mật khẩu Wi-Fi của nhà",
      ], answer: 0,
      explain: "Rút gọn liên kết vốn tiện, nhưng đổi lại người nhận không thấy tên miền thật. Kẻ xấu lợi dụng để dẫn tới trang giả mạo. Chỉ nhìn thấy liên kết thì chưa bị gì — nguy hiểm nằm ở bước bấm vào và nhập thông tin." },

    { type: "mc", topic: "B", grade: 11, level: "medium",
      question: "Khi họp trực tuyến, hình ảnh của Hà bị giật và tiếng ngắt quãng dù mạng nhà vẫn tải web bình thường. Cách xử lí nào thường hiệu quả nhất và nên thử trước?",
      options: [
        "Tắt video, chỉ để tiếng, và đóng bớt ứng dụng đang chiếm băng thông",
        "Mua ngay bộ phát Wi-Fi mới",
        "Đổi sang máy tính khác",
        "Gọi điện báo nhà mạng cắt hợp đồng",
      ], answer: 0,
      explain: "Video chiếm băng thông gấp nhiều lần âm thanh, nên tắt video là cách giảm tải nhanh nhất và không tốn gì. Duyệt web bình thường không chứng tỏ đường truyền đủ ổn định cho luồng video liên tục." },

    { type: "tf", topic: "B", grade: 11, level: "medium",
      question: "Bạn Kiên tìm hiểu về địa chỉ IP và tên miền khi làm bài tập nhóm. Xét tính đúng/sai:",
      statements: [
        { text: "DNS giúp đổi tên miền dạng chữ thành địa chỉ IP", correct: true },
        { text: "Hai thiết bị trong cùng một mạng gia đình thường có địa chỉ IP nội bộ khác nhau", correct: true },
        { text: "Tên miền và địa chỉ IP là hai cách gọi của cùng một dãy số", correct: false },
        { text: "Một máy chủ không thể phục vụ nhiều tên miền khác nhau", correct: false },
      ],
      explain: "(a)(b) đúng. (c) sai vì tên miền là chuỗi chữ do con người đặt cho dễ nhớ, còn IP là địa chỉ số dùng để định tuyến. (d) sai: một máy chủ hoàn toàn có thể phục vụ hàng trăm tên miền khác nhau." },

    { type: "tf", topic: "B", grade: 12, level: "hard",
      question: "Gia đình bạn Thảo bàn về an toàn khi dùng Internet. Xét tính đúng/sai:",
      statements: [
        { text: "Nên bật xác thực hai bước cho các tài khoản quan trọng", correct: true },
        { text: "Không nên dùng lại một mật khẩu cho nhiều dịch vụ", correct: true },
        { text: "Trang có HTTPS thì chắc chắn không phải trang lừa đảo", correct: false },
        { text: "Phần mềm diệt virus giúp giảm rủi ro nhưng không thay thế được thói quen cẩn thận", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: HTTPS chỉ mã hoá đường truyền, kẻ lừa đảo vẫn xin được chứng chỉ cho tên miền giả của chúng. Ổ khoá không phải dấu chứng nhận uy tín." },

    { type: "tf", topic: "B", grade: 10, level: "easy",
      question: "Bạn Quân mô tả cách các thiết bị trong nhà kết nối Internet. Xét tính đúng/sai:",
      statements: [
        { text: "Wi-Fi là cách kết nối mạng không dây", correct: true },
        { text: "Cáp mạng thường cho kết nối ổn định hơn Wi-Fi ở cùng điều kiện", correct: true },
        { text: "Muốn vào Internet thì bắt buộc phải có Wi-Fi", correct: false },
        { text: "Một mạng gia đình có thể vừa dùng cáp vừa dùng Wi-Fi", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: có thể vào Internet bằng cáp mạng, bằng mạng di động 4G/5G hoặc các cách khác — Wi-Fi chỉ là một trong nhiều lựa chọn." },

    { type: "tf", topic: "B", grade: 12, level: "medium",
      question: "Lớp thảo luận về thư rác và lừa đảo qua mạng. Xét tính đúng/sai:",
      statements: [
        { text: "Thư tạo cảm giác gấp gáp, doạ khoá tài khoản là dấu hiệu đáng ngờ", correct: true },
        { text: "Nên kiểm tra kĩ tên miền của người gửi trước khi tin", correct: true },
        { text: "Nếu thư xưng đúng tên mình thì chắc chắn là thư thật", correct: false },
        { text: "Không nên cung cấp mã xác thực một lần cho bất kì ai, kể cả người tự xưng nhân viên ngân hàng", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: tên và email bị lộ từ các vụ rò rỉ dữ liệu, nên kẻ lừa đảo hoàn toàn có thể xưng đúng tên bạn để tăng độ tin cậy." },

    { type: "tf", topic: "B", grade: 11, level: "medium",
      question: "Nhóm bạn bàn về việc dùng đám mây để lưu bài tập chung. Xét tính đúng/sai:",
      statements: [
        { text: "Nhiều người có thể cùng xem một tài liệu tại cùng thời điểm", correct: true },
        { text: "Cần đặt quyền truy cập phù hợp, tránh chia sẻ công khai bài có thông tin cá nhân", correct: true },
        { text: "Lưu trên đám mây thì không cần Internet vẫn mở được mọi lúc", correct: false },
        { text: "Xoá tệp trong thư mục chia sẻ có thể ảnh hưởng tới tất cả thành viên", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: về nguyên tắc phải có kết nối mới đồng bộ được; một số dịch vụ cho phép đánh dấu tệp dùng ngoại tuyến nhưng đó là tính năng phải bật trước, không mặc định." },

    /* =========================== C — ĐẠO ĐỨC, PHÁP LUẬT & VĂN HOÁ =========================== */
    { type: "mc", topic: "C", grade: 10, level: "medium",
      question: "Nam tìm được một tấm ảnh đẹp trên mạng và muốn dùng làm bìa bài thuyết trình nộp thầy. Cách làm đúng đắn nhất là gì?",
      options: [
        "Tìm ảnh có giấy phép cho dùng lại (hoặc tự chụp, tự vẽ) và ghi rõ nguồn",
        "Cứ dùng vì bài nộp thầy không phải là kinh doanh",
        "Xoá chữ kí của tác giả trên ảnh rồi dùng cho gọn",
        "Chụp màn hình ảnh đó rồi dùng, vì ảnh chụp màn hình là của mình",
      ], answer: 0,
      explain: "Quyền tác giả phát sinh ngay khi tác phẩm ra đời, không phụ thuộc việc bạn có kiếm tiền hay không. Xoá chữ kí hay chụp lại màn hình đều không làm ảnh thành của mình — xoá thông tin tác giả còn là hành vi nặng hơn." },

    { type: "mc", topic: "C", grade: 11, level: "medium",
      question: "Trong nhóm chat lớp, một bạn đăng ảnh chế giễu ngoại hình của bạn khác kèm lời bình. Nhiều người thả biểu tượng cười. Hành động đúng của một thành viên trong nhóm là gì?",
      options: [
        "Không hùa theo, đề nghị gỡ bài và báo giáo viên chủ nhiệm nếu tiếp diễn",
        "Im lặng cho qua vì không phải chuyện của mình",
        "Thả biểu tượng cười cho vui vì mọi người đều làm vậy",
        "Chụp lại rồi gửi sang nhóm khác để mọi người cùng biết",
      ], answer: 0,
      explain: "Đây là bắt nạt trên mạng. Im lặng khiến hành vi tiếp diễn, hùa theo là tiếp tay, còn phát tán sang nhóm khác làm nạn nhân tổn thương nặng hơn và chính người chia sẻ cũng phải chịu trách nhiệm." },

    { type: "mc", topic: "C", grade: 12, level: "hard",
      question: "Một bạn dùng phần mềm ghép mặt tạo video giả cảnh thầy giáo nói câu bậy rồi đăng lên mạng cho vui. Nhận định nào đúng?",
      options: [
        "Có thể vi phạm pháp luật vì xâm phạm hình ảnh, danh dự và lan truyền thông tin sai sự thật",
        "Không sao vì ai cũng biết đó là video giả",
        "Chỉ sai nếu video được nhiều người xem",
        "Chỉ sai nếu người tạo kiếm được tiền từ video",
      ], answer: 0,
      explain: "Dùng hình ảnh người khác dựng nội dung sai sự thật xâm phạm quyền hình ảnh và danh dự — bị xử lí bất kể mục đích đùa vui, lượt xem hay có kiếm tiền hay không." },

    { type: "mc", topic: "C", grade: 11, level: "medium",
      question: "Hà đăng ảnh nhóm bạn đi chơi lên trang cá nhân, trong ảnh có bạn Vy. Vy nhắn riêng đề nghị gỡ vì không muốn xuất hiện. Hà nên làm gì?",
      options: [
        "Gỡ ảnh hoặc che mặt Vy theo đề nghị, vì mỗi người có quyền với hình ảnh của mình",
        "Giữ nguyên vì ảnh do Hà chụp nên Hà toàn quyền",
        "Giữ nguyên nhưng gắn thẻ thêm Vy cho công bằng",
        "Chỉ gỡ nếu có nhiều người khác cùng phản đối",
      ], answer: 0,
      explain: "Người chụp có quyền tác giả với bức ảnh, nhưng người xuất hiện trong ảnh có quyền với hình ảnh cá nhân của họ. Đã được đề nghị thì tôn trọng là cách vừa đúng luật vừa đúng đạo lí." },

    { type: "mc", topic: "C", grade: 10, level: "easy",
      question: "Bạn cùng lớp xin mượn tài khoản học trực tuyến của Minh để \"học ké cho tiết kiệm\". Minh nên trả lời thế nào?",
      options: [
        "Từ chối, vì chia sẻ tài khoản thường vi phạm điều khoản dịch vụ và có rủi ro lộ thông tin cá nhân",
        "Cho mượn vì bạn bè nên giúp nhau",
        "Cho mượn nhưng đổi mật khẩu sau mỗi lần",
        "Cho mượn và nhờ bạn trả một nửa tiền",
      ], answer: 0,
      explain: "Tài khoản gắn với thông tin cá nhân và lịch sử học của Minh; cho mượn là vi phạm điều khoản, có thể bị khoá, lại lộ dữ liệu riêng. Chia tiền hay đổi mật khẩu không làm việc đó thành hợp lệ." },

    { type: "mc", topic: "C", grade: 12, level: "medium",
      question: "Trên mạng lan truyền tin \"ngày mai học sinh toàn thành phố nghỉ học\" kèm ảnh chụp một văn bản mờ. Trước khi chia sẻ, việc cần làm là gì?",
      options: [
        "Kiểm tra trên cổng thông tin chính thức của sở hoặc trường, chưa xác minh thì không chia sẻ",
        "Chia sẻ ngay để bạn bè kịp biết",
        "Chia sẻ kèm dòng \"không biết đúng không\" để tránh trách nhiệm",
        "Hỏi trong nhóm chat xem có ai tin không rồi quyết định",
      ], answer: 0,
      explain: "Tin sai lan nhanh chính nhờ những lần chia sẻ vội. Ghi chú \"không biết đúng không\" không gỡ được trách nhiệm vì hành vi phát tán đã xảy ra. Nguồn chính thức là chỗ duy nhất đáng tin ở đây." },

    { type: "mc", topic: "C", grade: 11, level: "medium",
      question: "Bài tập nhóm của Lan có phần trích nguyên hai đoạn từ một trang báo. Cách xử lí đúng là gì?",
      options: [
        "Đặt phần trích trong ngoặc kép, ghi rõ tác giả và đường dẫn nguồn",
        "Viết lại bằng từ đồng nghĩa rồi coi như của mình",
        "Không cần ghi nguồn vì thông tin trên mạng là của chung",
        "Ghi nguồn ở cuối bài mà không cần đánh dấu đoạn nào là trích",
      ], answer: 0,
      explain: "Trích dẫn hợp lệ phải chỉ rõ ĐOẠN NÀO là của người khác và nguồn ở đâu. Đổi vài từ đồng nghĩa vẫn là đạo văn; ghi nguồn chung chung ở cuối thì người đọc không phân biệt được đâu là ý của bạn." },

    { type: "mc", topic: "C", grade: 12, level: "medium",
      question: "Một ứng dụng miễn phí yêu cầu Bình đăng nhập bằng tài khoản mạng xã hội và xin quyền đăng bài thay mặt Bình. Rủi ro chính là gì?",
      options: [
        "Ứng dụng có thể tự đăng nội dung trên trang cá nhân của Bình, kể cả quảng cáo hoặc nội dung xấu",
        "Ứng dụng sẽ làm điện thoại nóng lên",
        "Ứng dụng sẽ chiếm hết dung lượng lưu trữ",
        "Không có rủi ro vì đăng nhập bằng mạng xã hội luôn an toàn",
      ], answer: 0,
      explain: "Quyền \"đăng bài thay mặt bạn\" đúng nghĩa đen. Trước khi đồng ý, cần đọc danh sách quyền và tự hỏi ứng dụng có thật sự cần quyền ấy để chạy không." },

    { type: "mc", topic: "C", grade: 10, level: "medium",
      question: "Sơn định tải phần mềm chỉnh ảnh bản quyền từ trang chia sẻ có kèm \"thuốc\" bẻ khoá. Nguy cơ thực tế nhất là gì?",
      options: [
        "Bản bẻ khoá thường bị cài kèm mã độc đánh cắp tài khoản, ngoài ra còn vi phạm bản quyền",
        "Phần mềm sẽ chạy chậm hơn bản gốc một chút",
        "Máy sẽ tự động bị phát hiện và phạt ngay",
        "Không có nguy cơ gì nếu chỉ dùng ở nhà",
      ], answer: 0,
      explain: "Nguy cơ trực tiếp nhất là mã độc đi kèm — đây là con đường phát tán phần mềm gián điệp phổ biến nhất. Cạnh đó vẫn là hành vi vi phạm bản quyền, dù dùng ở đâu." },

    { type: "mc", topic: "C", grade: 11, level: "hard",
      question: "Thể lệ một cuộc thi ảnh của trường ghi: \"Ban tổ chức được toàn quyền sử dụng ảnh dự thi cho mọi mục đích\". Nhận xét đúng nhất là gì?",
      options: [
        "Đây là điều khoản chuyển giao quyền rất rộng, người dự thi nên đọc kĩ và cân nhắc trước khi nộp bài",
        "Điều khoản này vô hiệu vì ban tổ chức không có quyền đặt ra",
        "Điều khoản này chỉ áp dụng cho ảnh đoạt giải",
        "Nộp ảnh rồi vẫn có thể rút lại toàn bộ quyền bất cứ lúc nào",
      ], answer: 0,
      explain: "Thể lệ cuộc thi là một dạng thoả thuận: nộp bài đồng nghĩa chấp nhận. \"Mọi mục đích\" bao gồm cả thương mại, nên tác giả cần cân nhắc trước khi nộp." },

    { type: "mc", topic: "C", grade: 12, level: "medium",
      question: "Hoa nhận tin nhắn từ tài khoản mang tên bạn thân, nhờ chuyển gấp 2 triệu đồng vào một số tài khoản lạ. Bước xử lí đúng nhất là gì?",
      options: [
        "Gọi điện thoại trực tiếp cho bạn để xác minh trước khi làm bất cứ điều gì",
        "Chuyển trước rồi hỏi sau vì bạn đang cần gấp",
        "Nhắn lại hỏi vài câu riêng tư rồi chuyển nếu trả lời đúng",
        "Chuyển một nửa số tiền cho an toàn",
      ], answer: 0,
      explain: "Kẻ chiếm tài khoản đọc được lịch sử chat nên trả lời đúng câu riêng tư là chuyện thường. Chỉ gọi thoại trực tiếp mới xác minh chắc chắn." },

    { type: "mc", topic: "C", grade: 10, level: "easy",
      question: "Trong giờ thực hành, Tuấn thấy máy bên cạnh còn đăng nhập tài khoản của bạn khác chưa đăng xuất. Tuấn nên làm gì?",
      options: [
        "Báo cho bạn đó hoặc giáo viên để đăng xuất, không tự ý xem hay dùng",
        "Vào xem thử tài khoản có gì hay không",
        "Đổi mật khẩu giúp bạn cho an toàn",
        "Đăng bài trêu bạn một câu rồi thoát ra",
      ], answer: 0,
      explain: "Truy cập tài khoản người khác dù không phá gì cũng là xâm phạm quyền riêng tư. Đổi mật khẩu \"giúp\" cũng là can thiệp trái phép." },

    { type: "mc", topic: "C", grade: 11, level: "medium",
      question: "Một trang web yêu cầu Vy nhập số căn cước và ảnh chụp hai mặt giấy tờ chỉ để \"nhận quà tặng miễn phí\". Vy nên nghĩ gì?",
      options: [
        "Đây là dấu hiệu bất thường; giấy tờ tuỳ thân có thể bị dùng để mở tài khoản, vay tiền dưới tên Vy",
        "Cứ nhập vì nhận quà thì phải xác minh danh tính",
        "Nhập nhưng che đi vài số cuối là an toàn tuyệt đối",
        "Nhập số căn cước của người thân để tránh liên quan tới mình",
      ], answer: 0,
      explain: "Không món quà miễn phí nào đáng đánh đổi giấy tờ tuỳ thân. Ảnh căn cước bị dùng để mở tài khoản ngân hàng, đăng kí vay — hậu quả kéo dài nhiều năm." },

    { type: "mc", topic: "C", grade: 12, level: "hard",
      question: "Một nhóm học sinh lập trang web đăng lại toàn bộ đề thi và lời giải của một trung tâm luyện thi, có chèn quảng cáo để kiếm tiền. Nhận định pháp lí đúng nhất là gì?",
      options: [
        "Sao chép và khai thác thương mại tài liệu của người khác khi chưa được phép là vi phạm quyền tác giả",
        "Không vi phạm vì học sinh làm vì mục đích học tập",
        "Không vi phạm vì đề thi là tài sản chung của xã hội",
        "Chỉ vi phạm nếu trung tâm phát hiện và khiếu nại",
      ], answer: 0,
      explain: "Tài liệu do trung tâm biên soạn được bảo hộ quyền tác giả. Có chèn quảng cáo nghĩa là khai thác thương mại. Hành vi vi phạm tồn tại độc lập với việc chủ sở hữu đã phát hiện hay chưa." },

    { type: "mc", topic: "C", grade: 11, level: "medium",
      question: "Lớp muốn lập kho tài liệu ôn thi dùng chung trên đám mây. Cách đặt quyền truy cập hợp lí nhất là gì?",
      options: [
        "Chia sẻ cho đúng danh sách thành viên lớp, phân quyền xem hoặc sửa theo vai trò",
        "Đặt công khai cho bất kì ai có liên kết đều sửa được cho tiện",
        "Chỉ để một bạn giữ, ai cần thì nhắn xin",
        "Đăng liên kết công khai lên mạng xã hội cho nhiều người dùng",
      ], answer: 0,
      explain: "Nguyên tắc quyền tối thiểu: đúng người, đúng quyền. Mở công khai quyền SỬA thì bất kì ai cũng có thể xoá sạch kho tài liệu." },

    { type: "mc", topic: "C", grade: 10, level: "medium",
      question: "Khi tham gia diễn đàn học tập, cách ứng xử nào thể hiện văn hoá mạng tốt?",
      options: [
        "Đọc nội quy, tìm xem câu hỏi đã có ai hỏi chưa, đặt câu hỏi rõ ràng và cảm ơn người giúp",
        "Đăng liên tiếp nhiều bài giống nhau cho nhanh được trả lời",
        "Viết toàn chữ in hoa để mọi người chú ý",
        "Chê bai câu trả lời chưa đúng ý mình",
      ], answer: 0,
      explain: "Diễn đàn vận hành bằng công sức tự nguyện. Hỏi trùng lặp, spam, viết in hoa (bị hiểu là quát) hay chê bai người giúp đều làm cộng đồng xấu đi." },

    { type: "mc", topic: "C", grade: 12, level: "medium",
      question: "Bạn của Kiên khoe vừa dùng công cụ AI viết hộ toàn bộ bài luận rồi nộp như bài của mình. Nhận định đúng nhất là gì?",
      options: [
        "Đây là gian lận học thuật, vì bài nộp không phản ánh năng lực thật và không ghi rõ phần do công cụ tạo ra",
        "Không sao vì AI là công cụ như từ điển",
        "Chỉ sai nếu giáo viên phát hiện ra",
        "Chỉ sai nếu bài đó được điểm cao",
      ], answer: 0,
      explain: "Dùng AI để gợi ý hay sửa lỗi diễn đạt là hợp lí nếu được phép và ghi rõ. Nộp nguyên bài do AI viết dưới danh nghĩa của mình là gian lận, bất kể có bị phát hiện hay không." },

    { type: "mc", topic: "C", grade: 11, level: "easy",
      question: "Mật khẩu nào sau đây an toàn nhất cho tài khoản email của học sinh?",
      options: [
        "Một cụm từ dài dễ nhớ với riêng mình, có thêm chữ số và kí tự đặc biệt",
        "Ngày sinh của mình",
        "Tên trường viết không dấu",
        "Dãy 123456 vì dễ nhớ",
      ], answer: 0,
      explain: "Độ dài là yếu tố chống dò mạnh nhất. Ngày sinh, tên trường là thông tin công khai nên bị đoán ngay; 123456 luôn nằm đầu danh sách mật khẩu bị thử." },

    { type: "tf", topic: "C", grade: 11, level: "medium",
      question: "Bạn Ngọc chuẩn bị đăng một bài viết có sử dụng tư liệu sưu tầm lên trang cá nhân. Xét tính đúng/sai:",
      statements: [
        { text: "Ghi rõ nguồn tư liệu là việc nên làm và thể hiện sự tôn trọng tác giả", correct: true },
        { text: "Ảnh có nhãn cho phép dùng lại vẫn cần kiểm tra điều kiện kèm theo, ví dụ phải ghi tên tác giả", correct: true },
        { text: "Mọi nội dung đăng công khai trên mạng đều được tự do sao chép lại", correct: false },
        { text: "Chỉ cần không kiếm tiền thì dùng tác phẩm của người khác luôn hợp pháp", correct: false },
      ],
      explain: "(a)(b) đúng. (c) sai: đăng công khai không đồng nghĩa từ bỏ quyền tác giả. (d) sai: phi lợi nhuận chỉ là một yếu tố được xem xét, không phải tấm vé miễn trừ." },

    { type: "tf", topic: "C", grade: 12, level: "hard",
      question: "Một bạn trong lớp bị lập tài khoản giả mạo tên và ảnh để nhắn tin xin tiền bạn bè. Xét tính đúng/sai:",
      statements: [
        { text: "Nên báo cáo tài khoản giả mạo với nền tảng và thông báo cho bạn bè cảnh giác", correct: true },
        { text: "Nên lưu bằng chứng (ảnh chụp màn hình, đường dẫn) trước khi tài khoản bị xoá", correct: true },
        { text: "Mạo danh người khác trên mạng là hành vi có thể bị xử lí theo pháp luật", correct: true },
        { text: "Cách tốt nhất là tự lập một tài khoản giả khác để trả đũa", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: trả đũa bằng cách tương tự khiến chính mình vi phạm." },

    { type: "tf", topic: "C", grade: 10, level: "medium",
      question: "Lớp thảo luận về việc dùng phần mềm có bản quyền trong học tập. Xét tính đúng/sai:",
      statements: [
        { text: "Phần mềm nguồn mở thường cho phép dùng, chỉnh sửa và phân phối lại theo điều kiện của giấy phép", correct: true },
        { text: "Phần mềm miễn phí không đồng nghĩa với phần mềm nguồn mở", correct: true },
        { text: "Đã tải về máy mình thì phần mềm thành tài sản của mình, chia sẻ cho ai cũng được", correct: false },
        { text: "Nhiều hãng có chính sách giấy phép riêng cho trường học và học sinh", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: cài đặt chỉ là được cấp quyền SỬ DỤNG theo giấy phép, không phải mua đứt quyền sở hữu để đem phân phối." },

    { type: "tf", topic: "C", grade: 12, level: "medium",
      question: "Gia đình bạn Thu bàn về việc chia sẻ hình ảnh trẻ nhỏ lên mạng xã hội. Xét tính đúng/sai:",
      statements: [
        { text: "Nên cân nhắc quyền riêng tư của trẻ, vì ảnh có thể tồn tại rất lâu trên mạng", correct: true },
        { text: "Nên tránh để lộ thông tin nhận dạng như tên trường, biển số xe, địa chỉ nhà trong ảnh", correct: true },
        { text: "Trẻ em chưa có quyền riêng tư nên cha mẹ đăng gì cũng được", correct: false },
        { text: "Có thể giới hạn người xem bằng cài đặt quyền riêng tư của bài đăng", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: pháp luật bảo vệ quyền riêng tư và bí mật đời sống riêng tư của trẻ em; cha mẹ có trách nhiệm bảo vệ chứ không phải toàn quyền công khai." },

    { type: "tf", topic: "C", grade: 11, level: "medium",
      question: "Nhóm bạn thảo luận về việc một ứng dụng học tập thu thập dữ liệu người dùng. Xét tính đúng/sai:",
      statements: [
        { text: "Ứng dụng cần nói rõ thu thập dữ liệu gì và dùng để làm gì", correct: true },
        { text: "Người dùng nên được quyền xem lại và yêu cầu xoá dữ liệu của mình", correct: true },
        { text: "Đã có chính sách quyền riêng tư thì ứng dụng muốn bán dữ liệu cho bên nào cũng được", correct: false },
        { text: "Chỉ nên thu thập dữ liệu thực sự cần cho chức năng của ứng dụng", correct: true },
      ],
      explain: "(a)(b)(d) là ba nguyên tắc cốt lõi: minh bạch, quyền của chủ thể dữ liệu, tối thiểu hoá. (c) sai: có chính sách không có nghĩa được làm mọi thứ." },

    /* =========================== D — ỨNG DỤNG TIN HỌC (BẢNG TÍNH, CSDL) =========================== */
    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Thư viện trường quản lí mượn trả bằng ba bảng SACH, DOC_GIA và MUON_TRA. Mỗi đầu sách có mã riêng Ma_sach, mỗi người đọc có Ma_doc_gia. Vì sao bảng MUON_TRA cần cột Ma_sach và Ma_doc_gia thay vì ghi thẳng tên sách và tên người mượn?",
      options: [
        "Vì mã là duy nhất, tránh nhầm khi trùng tên và khi đổi tên thì chỉ phải sửa ở một bảng",
        "Vì tên sách và tên người quá dài nên máy không lưu được",
        "Vì bảng chỉ được phép chứa số, không chứa chữ",
        "Vì ghi tên sẽ làm cơ sở dữ liệu bị khoá",
      ], answer: 0,
      explain: "Hai người đọc có thể trùng tên, hai cuốn sách có thể trùng nhan đề. Dùng mã bảo đảm phân biệt được và tránh dư thừa: sửa tên ở bảng gốc là mọi nơi tham chiếu đều đúng theo." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Trong cơ sở dữ liệu quản lí thư viện, bảng MUON_TRA lưu các lượt mượn sách. Người quản trị muốn xoá bản ghi có mã phiếu mượn là PM08 khỏi bảng này. Câu lệnh SQL nào thực hiện đúng yêu cầu?",
      options: [
        "DELETE FROM MUON_TRA WHERE MaPhieu = 'PM08';",
        "DROP MUON_TRA WHERE MaPhieu = 'PM08';",
        "REMOVE FROM MUON_TRA WHERE MaPhieu = 'PM08';",
        "ERASE MUON_TRA WHERE MaPhieu = 'PM08';",
      ], answer: 0,
      explain: "DELETE FROM ... WHERE ... là câu lệnh xoá BẢN GHI. DROP dùng để xoá cả BẢNG (mất luôn cấu trúc và toàn bộ dữ liệu), còn REMOVE và ERASE không phải câu lệnh của SQL." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Vẫn với bảng MUON_TRA của thư viện, muốn liệt kê những phiếu mượn CHƯA trả (cột NgayTra chưa có giá trị), điều kiện nào đúng?",
      options: [
        "WHERE NgayTra IS NULL",
        "WHERE NgayTra = NULL",
        "WHERE NgayTra = ''",
        "WHERE NgayTra = 0",
      ], answer: 0,
      explain: "NULL nghĩa là \"chưa có giá trị\", không so sánh bằng dấu = được (kết quả luôn không xác định). SQL dành riêng toán tử IS NULL cho việc này. Chuỗi rỗng và số 0 là những giá trị cụ thể, khác hẳn NULL." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Cô thủ thư muốn đếm xem mỗi người đọc đã mượn bao nhiêu lượt sách. Câu lệnh nào phù hợp?",
      options: [
        "SELECT Ma_doc_gia, COUNT(*) FROM MUON_TRA GROUP BY Ma_doc_gia;",
        "SELECT COUNT(*) FROM MUON_TRA;",
        "SELECT Ma_doc_gia FROM MUON_TRA ORDER BY Ma_doc_gia;",
        "SELECT SUM(Ma_doc_gia) FROM MUON_TRA;",
      ], answer: 0,
      explain: "GROUP BY gom các dòng cùng mã người đọc thành một nhóm, COUNT(*) đếm số dòng trong từng nhóm. Phương án B chỉ ra một con số tổng, C chỉ sắp xếp, còn D cộng mã người đọc lại — vô nghĩa." },

    { type: "mc", topic: "D", grade: 11, level: "medium",
      question: "Mẹ Lan mở quán ăn, ghi doanh thu hằng ngày vào bảng tính. Mẹ muốn ô tổng luôn tự cập nhật khi thêm dòng mới. Cách làm đúng là gì?",
      options: [
        "Dùng hàm SUM cho cả vùng dữ liệu (kể cả các dòng còn trống bên dưới)",
        "Cộng tay từng ô rồi gõ kết quả vào ô tổng",
        "Chụp màn hình bảng rồi tính bằng máy tính bỏ túi",
        "Ghi công thức vào ô ghi chú để nhớ mà tính lại",
      ], answer: 0,
      explain: "Hàm SUM tính lại tự động mỗi khi dữ liệu trong vùng thay đổi. Gõ tay kết quả thì chỉ đúng đúng một lần, thêm dòng là sai ngay mà không ai biết." },

    { type: "mc", topic: "D", grade: 11, level: "hard",
      question: "Trong bảng tính, ô C2 chứa công thức =A2*B2. Khi Lan sao chép công thức này xuống ô C3, công thức tự thành =A3*B3. Vì sao?",
      options: [
        "Vì A2, B2 là địa chỉ tương đối nên tự dịch theo vị trí ô mới",
        "Vì bảng tính luôn cộng thêm 1 vào mọi con số trong công thức",
        "Vì Lan đã bấm nhầm phím",
        "Vì công thức bị lỗi và bảng tính tự sửa",
      ], answer: 0,
      explain: "Địa chỉ tương đối được hiểu theo khoảng cách so với ô chứa công thức, nên sao chép xuống một dòng thì tham chiếu cũng xuống một dòng. Muốn giữ nguyên thì dùng địa chỉ tuyệt đối với dấu $ (ví dụ $A$2)." },

    { type: "mc", topic: "D", grade: 11, level: "medium",
      question: "Bảng điểm của lớp có 45 dòng. Cô giáo muốn tô màu tự động các ô điểm dưới 5,0 để nhìn ra ngay. Công cụ nào phù hợp nhất?",
      options: ["Định dạng có điều kiện", "Chèn biểu đồ", "Trộn ô", "Đóng băng dòng tiêu đề"],
      answer: 0,
      explain: "Định dạng có điều kiện đổi màu ô theo quy tắc về giá trị, và tự cập nhật khi điểm thay đổi. Biểu đồ để so sánh trực quan, trộn ô và đóng băng dòng chỉ phục vụ trình bày." },

    { type: "mc", topic: "D", grade: 11, level: "medium",
      question: "Nam có bảng 200 dòng gồm tên và điểm, muốn xem 10 bạn điểm cao nhất. Cách nhanh nhất là gì?",
      options: [
        "Sắp xếp bảng theo cột điểm giảm dần rồi lấy 10 dòng đầu",
        "Đọc lần lượt 200 dòng rồi ghi ra giấy",
        "Xoá bớt các dòng điểm thấp cho tới khi còn 10 dòng",
        "Đổi màu chữ của tất cả các dòng",
      ], answer: 0,
      explain: "Sắp xếp là thao tác một lần, không làm mất dữ liệu. Xoá bớt dòng là phá dữ liệu gốc — sai lầm rất hay gặp và không khôi phục được nếu đã lưu đè." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Trường lưu danh sách học sinh trong bảng tính, mỗi khối một tệp riêng, cùng cấu trúc cột. Khi cần thống kê toàn trường, khó khăn lớn nhất là gì?",
      options: [
        "Dữ liệu bị phân mảnh nhiều tệp nên phải gộp thủ công, dễ sai và khó cập nhật đồng bộ",
        "Bảng tính không tính được phép cộng",
        "Không thể sắp xếp dữ liệu trong bảng tính",
        "Bảng tính chỉ chứa được tối đa 100 dòng",
      ], answer: 0,
      explain: "Đây chính là lí do người ta chuyển sang cơ sở dữ liệu: một nơi lưu duy nhất, truy vấn toàn bộ trong một lần, tránh cảnh mỗi tệp một phiên bản." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Khi thiết kế bảng HOC_SINH, thuộc tính nào phù hợp nhất để làm khoá chính?",
      options: [
        "Mã học sinh do trường cấp",
        "Họ và tên",
        "Ngày sinh",
        "Tên lớp đang học",
      ], answer: 0,
      explain: "Khoá chính phải xác định duy nhất một bản ghi và không đổi. Họ tên có thể trùng, ngày sinh trùng rất nhiều, còn tên lớp thì thay đổi mỗi năm và nhiều người chung một lớp." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Bạn Tú viết truy vấn lấy tên những học sinh có điểm Tin lớn hơn 8. Mệnh đề nào giữ vai trò lọc?",
      options: ["WHERE", "SELECT", "FROM", "ORDER BY"],
      answer: 0,
      explain: "SELECT chọn cột hiển thị, FROM chỉ bảng nguồn, ORDER BY sắp xếp kết quả, còn WHERE mới là nơi đặt điều kiện lọc dòng." },

    { type: "mc", topic: "D", grade: 11, level: "easy",
      question: "Anh Hùng cần gửi báo cáo cho khách hàng, muốn người nhận xem đúng bố cục trên mọi máy và không sửa được nội dung. Nên gửi định dạng nào?",
      options: ["PDF", "Tệp văn bản .docx", "Tệp bảng tính .xlsx", "Ảnh chụp màn hình từng trang"],
      answer: 0,
      explain: "PDF giữ nguyên bố cục, phông chữ trên mọi thiết bị và mặc định không cho sửa trực tiếp. Tệp .docx dễ bị lệch phông và sửa được; ảnh chụp thì không tìm kiếm hay chọn chữ được." },

    { type: "mc", topic: "D", grade: 12, level: "medium",
      question: "Một cửa hàng lưu dữ liệu bán hàng trong cơ sở dữ liệu. Ưu điểm nào là của cơ sở dữ liệu so với ghi rời từng tệp bảng tính?",
      options: [
        "Nhiều người dùng đồng thời, kiểm soát quyền truy cập và tránh dữ liệu trùng lặp mâu thuẫn",
        "Không cần sao lưu vì dữ liệu không bao giờ mất",
        "Không cần đặt cấu trúc trước khi nhập dữ liệu",
        "Luôn chạy nhanh hơn bất kể lượng dữ liệu",
      ], answer: 0,
      explain: "Điểm mạnh cốt lõi là quản lí truy cập đồng thời, phân quyền và ràng buộc toàn vẹn để dữ liệu không mâu thuẫn. Sao lưu vẫn bắt buộc, và cơ sở dữ liệu đòi hỏi thiết kế cấu trúc trước." },

    { type: "mc", topic: "D", grade: 11, level: "medium",
      question: "Trong bài trình chiếu báo cáo dự án, cách trình bày nào giúp người nghe theo dõi tốt nhất?",
      options: [
        "Mỗi trang một ý chính, chữ ít, có hình minh hoạ, phần diễn giải để người nói trình bày",
        "Chép toàn bộ nội dung báo cáo lên trang rồi đọc lại",
        "Dùng nhiều hiệu ứng chuyển trang cho sinh động",
        "Dùng phông chữ nhỏ để vừa hết nội dung trong một trang",
      ], answer: 0,
      explain: "Trang chiếu là chỗ dựa thị giác chứ không phải bản in của bài nói. Chữ dày đặc khiến người nghe đọc thay vì nghe; hiệu ứng nhiều và chữ nhỏ chỉ gây phân tán và mỏi mắt." },

    { type: "mc", topic: "D", grade: 12, level: "hard",
      question: "Bảng DIEM có 3.000 dòng. Truy vấn tìm điểm theo Ma_hoc_sinh chạy chậm. Biện pháp kĩ thuật nào thường giúp nhanh lên rõ rệt?",
      options: [
        "Tạo chỉ mục (index) trên cột Ma_hoc_sinh",
        "Đổi tên bảng cho ngắn hơn",
        "Xoá bớt các cột không dùng đến trong câu truy vấn",
        "Đổi phông chữ hiển thị kết quả",
      ], answer: 0,
      explain: "Chỉ mục cho phép hệ quản trị nhảy thẳng tới dòng cần tìm thay vì duyệt tuần tự cả bảng — giống mục lục của cuốn sách. Tên bảng và phông chữ không ảnh hưởng tốc độ truy vấn." },

    { type: "mc", topic: "D", grade: 11, level: "medium",
      question: "Lan gõ nhầm khiến cả cột ngày sinh trong bảng tính bị hiển thị thành dãy số như 45123. Nguyên nhân là gì?",
      options: [
        "Ô đang để định dạng số, trong khi bên trong ngày tháng vốn được lưu dưới dạng số thứ tự ngày",
        "Dữ liệu đã bị hỏng vĩnh viễn",
        "Bảng tính không lưu được ngày tháng",
        "Máy tính bị nhiễm virus",
      ], answer: 0,
      explain: "Bảng tính lưu ngày tháng bằng một số đếm ngày kể từ mốc quy ước, rồi hiển thị theo định dạng. Đổi định dạng ô về kiểu ngày là hiện lại bình thường — dữ liệu không hề mất." },

    { type: "tf", topic: "D", grade: 12, level: "hard",
      question: "Một thư viện trường dùng hệ thống quản lí mượn trả sách. Dữ liệu lưu trong các bảng SACH, DOC_GIA và MUON_TRA. Bảng MUON_TRA lưu ai đã mượn cuốn sách nào và khi nào phải trả; mỗi đầu sách có mã riêng Ma_sach, mỗi người đọc có mã thành viên Ma_doc_gia. Một số ý kiến được đưa ra:",
      statements: [
        { text: "Ten_sach có thể dùng làm khoá chính vì mỗi cuốn sách có tên riêng", correct: false },
        { text: "Nếu cột ngày trả bị NULL, hệ thống vẫn tính được tổng số sách đang cho mượn bằng cách đếm các dòng có ngày trả IS NULL", correct: true },
        { text: "Ma_sach trong bảng MUON_TRA đóng vai trò khoá ngoài, tham chiếu tới bảng SACH", correct: true },
        { text: "Có thể xoá một dòng trong bảng SACH mà không cần quan tâm các dòng đang tham chiếu tới nó trong MUON_TRA", correct: false },
      ],
      explain: "(b)(c) đúng. (a) sai vì hai cuốn sách khác nhau hoàn toàn có thể trùng nhan đề, lại còn có thể đổi tên — khoá chính phải duy nhất và ổn định. (d) sai: xoá bừa sẽ phá ràng buộc khoá ngoài, để lại phiếu mượn trỏ tới cuốn sách không còn tồn tại." },

    { type: "tf", topic: "D", grade: 11, level: "medium",
      question: "Bạn Mai lập bảng tính theo dõi chi tiêu cá nhân trong ba tháng. Xét tính đúng/sai:",
      statements: [
        { text: "Nên để mỗi khoản chi một dòng, mỗi thuộc tính (ngày, loại, số tiền) một cột", correct: true },
        { text: "Dùng hàm SUM và AVERAGE để tính tổng và trung bình theo tháng", correct: true },
        { text: "Nên gõ số tiền kèm chữ \"đồng\" vào cùng ô để dễ đọc", correct: false },
        { text: "Có thể dùng biểu đồ để so sánh chi tiêu giữa các tháng", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: gõ kèm chữ biến ô thành văn bản, hàm tính toán sẽ bỏ qua ô đó. Muốn hiện chữ \"đồng\" thì dùng định dạng ô, giá trị bên trong vẫn là số." },

    { type: "tf", topic: "D", grade: 12, level: "medium",
      question: "Lớp thảo luận về câu lệnh SQL khi làm bài thực hành cơ sở dữ liệu. Xét tính đúng/sai:",
      statements: [
        { text: "SELECT dùng để truy vấn lấy dữ liệu ra xem", correct: true },
        { text: "DELETE FROM xoá bản ghi, còn DROP TABLE xoá cả bảng", correct: true },
        { text: "Câu lệnh DELETE không có mệnh đề WHERE sẽ xoá toàn bộ bản ghi trong bảng", correct: true },
        { text: "UPDATE dùng để tạo bảng mới", correct: false },
      ],
      explain: "(a)(b)(c) đúng — đặc biệt ý (c) là lỗi tai hại rất hay gặp khi quên WHERE. (d) sai: UPDATE dùng để sửa dữ liệu đã có, tạo bảng mới là CREATE TABLE." },

    { type: "tf", topic: "D", grade: 11, level: "medium",
      question: "Nhà trường chuyển từ quản lí điểm bằng nhiều tệp bảng tính sang một cơ sở dữ liệu chung. Xét tính đúng/sai:",
      statements: [
        { text: "Cơ sở dữ liệu giúp nhiều người cùng làm việc trên một nguồn dữ liệu duy nhất", correct: true },
        { text: "Có thể phân quyền để giáo viên chỉ xem, sửa được lớp mình phụ trách", correct: true },
        { text: "Chuyển sang cơ sở dữ liệu thì không cần sao lưu nữa", correct: false },
        { text: "Ràng buộc dữ liệu giúp hạn chế nhập sai, ví dụ điểm nằm ngoài khoảng 0–10", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: cơ sở dữ liệu vẫn có thể hỏng ổ đĩa, bị xoá nhầm hoặc bị mã hoá tống tiền — sao lưu định kì luôn bắt buộc." },

    { type: "tf", topic: "D", grade: 12, level: "hard",
      question: "Một cửa hàng muốn thống kê doanh thu theo từng nhân viên từ bảng HOA_DON. Xét tính đúng/sai:",
      statements: [
        { text: "Cần dùng GROUP BY theo mã nhân viên để gom các hoá đơn của cùng một người", correct: true },
        { text: "Hàm SUM dùng để cộng tổng tiền trong mỗi nhóm", correct: true },
        { text: "ORDER BY có thể dùng để sắp kết quả theo doanh thu giảm dần", correct: true },
        { text: "COUNT(*) trả về tổng số tiền của các hoá đơn", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: COUNT(*) đếm SỐ DÒNG chứ không cộng giá trị — muốn tổng tiền phải dùng SUM(cột_tiền)." },

    /* =========================== E — GIẢI QUYẾT VẤN ĐỀ VỚI MÁY TÍNH =========================== */
    { type: "mc", topic: "E", grade: 10, level: "medium",
      question: "Thư viện trường có 2.000 cuốn sách xếp theo thứ tự mã sách tăng dần. Cô thủ thư cần tìm cuốn mã S1450. Cách tìm nào ít bước nhất?",
      options: [
        "Tìm kiếm nhị phân: mở giữa kệ, so mã rồi bỏ hẳn một nửa, lặp lại",
        "Tìm tuần tự từ cuốn đầu tiên tới khi gặp",
        "Tìm ngẫu nhiên cho tới khi trúng",
        "Đếm ngược từ cuốn cuối cùng",
      ], answer: 0,
      explain: "Dữ liệu ĐÃ SẮP XẾP là điều kiện để dùng tìm kiếm nhị phân: mỗi lần loại được nửa số cuốn nên chỉ khoảng 11 bước cho 2.000 cuốn, thay vì trung bình 1.000 bước khi dò tuần tự." },

    { type: "mc", topic: "E", grade: 11, level: "hard",
      question: "Nam viết chương trình tìm số lớn nhất trong danh sách 1 triệu số. Bạn Nam nói \"cứ sắp xếp danh sách rồi lấy phần tử cuối\". Vì sao cách của bạn kém hiệu quả hơn?",
      options: [
        "Vì chỉ cần duyệt một lượt là xong, còn sắp xếp làm nhiều việc thừa và tốn thời gian hơn hẳn",
        "Vì máy tính không sắp xếp được 1 triệu số",
        "Vì sắp xếp sẽ làm mất dữ liệu gốc",
        "Vì phần tử cuối sau khi sắp xếp không phải số lớn nhất",
      ], answer: 0,
      explain: "Duyệt một lượt giữ lại giá trị lớn nhất chỉ mất số bước tỉ lệ với n. Sắp xếp tốn nhiều hơn hẳn (cỡ n·log n) mà ta lại vứt bỏ gần hết công sức đó — chỉ dùng đúng một phần tử." },

    { type: "mc", topic: "E", grade: 10, level: "medium",
      question: "Cô giáo mô tả cách pha nước chanh: \"vắt chanh, cho đường, thêm nước, khuấy đều\". Đây là ví dụ minh hoạ cho khái niệm nào?",
      options: [
        "Thuật toán — dãy bước hữu hạn, rõ ràng, thực hiện theo thứ tự để đạt kết quả",
        "Chương trình dịch",
        "Cấu trúc dữ liệu",
        "Hệ điều hành",
      ], answer: 0,
      explain: "Thuật toán không nhất thiết phải viết bằng ngôn ngữ lập trình. Điều kiện là các bước hữu hạn, xác định rõ ràng và cho ra kết quả mong muốn — công thức nấu ăn thoả đủ." },

    { type: "mc", topic: "E", grade: 11, level: "medium",
      question: "Chương trình của Vy chạy đúng với danh sách có phần tử, nhưng báo lỗi khi danh sách rỗng. Đây là kiểu vấn đề gì và nên xử lí thế nào?",
      options: [
        "Chưa xét trường hợp biên; nên kiểm tra danh sách rỗng trước khi truy cập phần tử",
        "Máy tính bị thiếu bộ nhớ; nên khởi động lại",
        "Ngôn ngữ Python có lỗi; nên đổi ngôn ngữ",
        "Danh sách rỗng là trường hợp không cần quan tâm",
      ], answer: 0,
      explain: "Trường hợp biên (rỗng, một phần tử, giá trị âm, số 0) là nơi chương trình hay vỡ nhất. Thói quen tốt là kiểm tra biên ngay đầu hàm rồi mới xử lí phần chính." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Một ứng dụng gợi ý bài hát cho người dùng dựa trên lịch sử nghe. Bài toán này thuộc nhóm nào?",
      options: [
        "Học máy — máy tự rút ra quy luật từ dữ liệu thay vì được lập trình sẵn từng luật",
        "Sắp xếp — chỉ cần xếp bài hát theo bảng chữ cái",
        "Tìm kiếm nhị phân trên danh sách bài hát",
        "Nén dữ liệu để giảm dung lượng bài hát",
      ], answer: 0,
      explain: "Không ai viết nổi hàng triệu luật kiểu \"nếu thích bài A thì gợi ý bài B\". Hệ gợi ý học từ hành vi của rất nhiều người dùng để tìm ra mẫu, đó chính là học máy." },

    { type: "mc", topic: "E", grade: 10, level: "easy",
      question: "Trước khi viết chương trình tính điểm trung bình, bước hợp lí đầu tiên là gì?",
      options: [
        "Xác định rõ đầu vào, đầu ra và các bước xử lí",
        "Mở trình soạn thảo và gõ ngay dòng lệnh đầu tiên",
        "Chọn màu nền cho giao diện",
        "Đặt tên tệp thật hay",
      ], answer: 0,
      explain: "Xác định đầu vào (danh sách điểm), đầu ra (một số trung bình) và cách xử lí giúp tránh viết xong mới phát hiện hiểu sai đề. Gõ code ngay là cách nhanh nhất để phải viết lại." },

    { type: "mc", topic: "E", grade: 11, level: "medium",
      question: "Trong bài toán xếp lịch trực nhật cho 40 học sinh trong 4 tuần, dữ liệu nào nên dùng để lưu danh sách tên học sinh?",
      options: ["Danh sách (list)", "Một biến số nguyên", "Một biến kiểu chuỗi duy nhất", "Một biến lôgic"],
      answer: 0,
      explain: "Cần lưu nhiều giá trị cùng kiểu và truy cập theo chỉ số nên danh sách là cấu trúc phù hợp. Một biến đơn chỉ chứa được một giá trị." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Nhóm học sinh xây dựng mô hình dự đoán học sinh có nguy cơ trượt tốt nghiệp, dùng dữ liệu điểm các kì trước ĐÃ có nhãn \"đỗ\"/\"trượt\". Đây là kiểu học máy nào?",
      options: [
        "Học có giám sát, vì dữ liệu huấn luyện đã được gán nhãn",
        "Học không giám sát, vì máy tự tìm nhóm",
        "Học tăng cường, vì có thưởng phạt",
        "Không phải học máy, chỉ là thống kê thông thường",
      ], answer: 0,
      explain: "Dấu hiệu nhận biết học có giám sát là dữ liệu huấn luyện đi kèm nhãn đúng. Học không giám sát thì không có nhãn (máy tự gom cụm), còn học tăng cường học qua thử — sai — nhận phản hồi." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Mô hình dự đoán nói trên đạt độ chính xác 95% trên dữ liệu ĐÃ DÙNG ĐỂ HUẤN LUYỆN nhưng chỉ 62% trên dữ liệu mới. Hiện tượng này gọi là gì?",
      options: [
        "Quá khớp — mô hình học thuộc cả nhiễu của tập huấn luyện nên kém khi gặp dữ liệu lạ",
        "Thiếu khớp — mô hình quá đơn giản",
        "Dữ liệu bị mã hoá sai",
        "Máy tính không đủ mạnh",
      ], answer: 0,
      explain: "Chênh lệch lớn giữa kết quả trên tập huấn luyện và tập kiểm thử là dấu hiệu kinh điển của quá khớp. Cách chữa: thêm dữ liệu, làm mô hình đơn giản hơn, hoặc dùng kiểm thử chéo." },

    { type: "mc", topic: "E", grade: 11, level: "medium",
      question: "Bạn Kiên cần kiểm tra một số n có phải số nguyên tố không. Cách viết nào hiệu quả hơn?",
      options: [
        "Chỉ thử chia n cho các số từ 2 tới căn bậc hai của n",
        "Thử chia n cho mọi số từ 2 tới n − 1",
        "Thử chia n cho mọi số từ 1 tới n",
        "Thử chia n cho 1.000 số ngẫu nhiên",
      ], answer: 0,
      explain: "Nếu n có ước lớn hơn căn bậc hai của n thì nó cũng phải có ước nhỏ hơn căn bậc hai — nên duyệt tới căn bậc hai là đủ, giảm số phép chia rất nhiều. Chia cho 1 thì luôn được nên vô nghĩa." },

    { type: "mc", topic: "E", grade: 10, level: "medium",
      question: "Bạn Hoà mô tả bài toán \"tính tiền điện theo bậc thang\". Cấu trúc điều khiển nào chắc chắn cần dùng?",
      options: [
        "Rẽ nhánh (if – elif – else) để chọn mức giá theo số điện tiêu thụ",
        "Chỉ cần phép cộng, không cần cấu trúc điều khiển nào",
        "Vòng lặp vô hạn",
        "Đệ quy nhiều tầng",
      ], answer: 0,
      explain: "Giá điện bậc thang nghĩa là mỗi khoảng tiêu thụ áp một đơn giá khác nhau — đúng bài toán của rẽ nhánh. Không có rẽ nhánh thì không phân biệt được bậc." },

    { type: "mc", topic: "E", grade: 12, level: "medium",
      question: "Một mô hình học máy được huấn luyện chỉ với ảnh chụp ban ngày, khi triển khai lại phải nhận diện ảnh chụp ban đêm và cho kết quả rất kém. Nguyên nhân cốt lõi là gì?",
      options: [
        "Dữ liệu huấn luyện không đại diện cho dữ liệu thực tế khi sử dụng",
        "Mô hình chưa được cài đặt đúng ngôn ngữ",
        "Máy chủ chạy quá chậm",
        "Ảnh ban đêm có dung lượng lớn hơn",
      ], answer: 0,
      explain: "Mô hình chỉ giỏi trong phạm vi nó đã thấy. Nếu dữ liệu huấn luyện lệch so với thực tế sử dụng, kết quả sẽ kém — đây là lỗi về dữ liệu, không phải lỗi lập trình hay phần cứng." },

    { type: "mc", topic: "E", grade: 11, level: "medium",
      question: "Khi chương trình chạy sai kết quả nhưng không báo lỗi, cách gỡ rối hiệu quả nhất trong tình huống này là gì?",
      options: [
        "In giá trị các biến ở những bước then chốt để xem chỗ nào lệch so với suy nghĩ của mình",
        "Viết lại toàn bộ chương trình từ đầu",
        "Đổi tên các biến cho dễ nhìn hơn",
        "Chạy lại nhiều lần cho tới khi ra kết quả đúng",
      ], answer: 0,
      explain: "Lỗi lôgic không tự báo, nên phải tự quan sát. In giá trị biến (hoặc dùng công cụ gỡ rối) giúp thu hẹp dần đoạn code sai. Chạy lại nhiều lần không đổi được gì vì máy tính luôn làm đúng những gì đã viết." },

    { type: "mc", topic: "E", grade: 10, level: "easy",
      question: "Trong sơ đồ khối, hình thoi thường biểu diễn điều gì?",
      options: ["Điều kiện rẽ nhánh", "Bắt đầu chương trình", "Nhập dữ liệu", "Kết thúc chương trình"],
      answer: 0,
      explain: "Hình thoi là điểm quyết định, từ đó tách thành nhánh đúng và nhánh sai. Hình bầu dục là bắt đầu/kết thúc, hình bình hành là nhập/xuất dữ liệu." },

    { type: "mc", topic: "E", grade: 12, level: "hard",
      question: "Một bệnh viện dùng mô hình học máy sàng lọc bệnh. Mô hình bỏ sót người thật sự có bệnh sẽ nguy hiểm hơn nhiều so với báo nhầm người khoẻ. Điều này có ý nghĩa gì khi đánh giá mô hình?",
      options: [
        "Không nên chỉ nhìn độ chính xác tổng thể; phải xem riêng tỉ lệ bỏ sót ca bệnh",
        "Chỉ cần độ chính xác trên 90% là dùng được",
        "Nên chọn mô hình nào chạy nhanh nhất",
        "Nên bỏ qua các ca hiếm gặp cho đơn giản",
      ], answer: 0,
      explain: "Khi hai loại sai lầm có hậu quả khác nhau, một con số độ chính xác chung sẽ che mất điều quan trọng. Với sàng lọc bệnh, chỉ số cần theo dõi là tỉ lệ phát hiện đúng ca bệnh (độ nhạy)." },

    { type: "mc", topic: "E", grade: 11, level: "medium",
      question: "Bài toán sắp xếp danh sách 10 điểm số của một bạn học sinh có thể làm bằng nhiều thuật toán. Với dữ liệu nhỏ như vậy, tiêu chí nào nên ưu tiên?",
      options: [
        "Chọn cách đơn giản, dễ viết đúng — vì với 10 phần tử thì chênh lệch tốc độ là không đáng kể",
        "Bắt buộc chọn thuật toán nhanh nhất về lí thuyết",
        "Chọn thuật toán dài dòng nhất để chắc chắn đúng",
        "Không nên sắp xếp mà nên tự nhìn bằng mắt",
      ], answer: 0,
      explain: "Độ phức tạp chỉ tạo khác biệt khi dữ liệu lớn. Với n = 10, mọi thuật toán đều xong tức thì, nên tiêu chí thực tế là dễ viết đúng và dễ đọc lại về sau." },

    { type: "tf", topic: "E", grade: 12, level: "hard",
      question: "Minh dùng một dịch vụ email có tính năng học máy để lọc thư rác. Sau nhiều lần Minh tự đánh dấu thư rác, hệ thống dần lọc chính xác hơn với những thư quảng cáo hoặc lừa đảo. Xét tính đúng/sai các nhận xét sau:",
      statements: [
        { text: "Việc Minh đánh dấu một thư là rác góp phần giúp hệ thống cải thiện khả năng phân loại về sau", correct: true },
        { text: "Minh dùng càng lâu thì bộ lọc càng hợp với nhu cầu riêng của cậu — đó là biểu hiện của khả năng thích nghi với dữ liệu cá nhân hoá", correct: true },
        { text: "Bộ lọc dùng học máy để sinh ra một bộ quy tắc cố định, giống hệt nhau cho mọi người dùng", correct: false },
        { text: "Bài toán phân loại thư thành \"rác\" và \"không rác\" là học có giám sát, vì dữ liệu được gán nhãn", correct: true },
      ],
      explain: "(a)(b)(d) đúng: phản hồi của người dùng chính là nhãn mới để mô hình học tiếp, và bài toán hai lớp có nhãn là học có giám sát. (c) sai ở hai chỗ — mô hình học máy không phải bộ quy tắc cố định do người viết, và nó được cá nhân hoá theo từng người chứ không giống hệt nhau." },

    { type: "tf", topic: "E", grade: 12, level: "hard",
      question: "Một nhóm học sinh xây dựng mô hình học máy chẩn đoán bệnh tim với bộ dữ liệu 1.190 hồ sơ (mỗi hồ sơ gồm tuổi, giới tính, huyết áp, nhịp tim…). Thử trên các mẫu bệnh án tại một bệnh viện, mô hình cho tỉ lệ chính xác 78%. Xét tính đúng/sai:",
      statements: [
        { text: "Đây là bài toán phân lớp và thuộc nhóm học có giám sát", correct: true },
        { text: "Nên chia dữ liệu thành tập huấn luyện và tập kiểm thử riêng để đánh giá khách quan", correct: true },
        { text: "Tỉ lệ 78% chưa cao là do bộ dữ liệu 1.190 hồ sơ QUÁ LỚN gây nhiễu cho quá trình học", correct: false },
        { text: "Kết quả của mô hình chỉ nên dùng để hỗ trợ bác sĩ, không thay thế chẩn đoán của bác sĩ", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai — và đây là chỗ bẫy: dữ liệu NHIỀU hơn thường giúp mô hình tốt hơn chứ không gây nhiễu. Với bài toán y tế, 1.190 hồ sơ là khá ÍT, đó mới là lí do độ chính xác còn hạn chế." },

    { type: "tf", topic: "E", grade: 11, level: "medium",
      question: "Lớp thảo luận về thuật toán tìm kiếm khi làm bài tập. Xét tính đúng/sai:",
      statements: [
        { text: "Tìm kiếm nhị phân yêu cầu dãy đã được sắp xếp", correct: true },
        { text: "Tìm kiếm tuần tự áp dụng được cho cả dãy chưa sắp xếp", correct: true },
        { text: "Với dãy 1.000 phần tử đã sắp xếp, tìm nhị phân cần khoảng 10 bước", correct: true },
        { text: "Tìm kiếm nhị phân luôn nhanh hơn tìm tuần tự trong mọi trường hợp", correct: false },
      ],
      explain: "(a)(b)(c) đúng (2^10 = 1024 nên khoảng 10 bước). (d) sai: nếu phần tử cần tìm nằm ngay đầu dãy thì tìm tuần tự chỉ mất 1 bước; ngoài ra nếu dãy chưa sắp xếp thì chi phí sắp xếp còn lớn hơn." },

    { type: "tf", topic: "E", grade: 10, level: "medium",
      question: "Bạn An mô tả các tính chất mà một thuật toán cần có. Xét tính đúng/sai:",
      statements: [
        { text: "Thuật toán phải kết thúc sau hữu hạn bước", correct: true },
        { text: "Mỗi bước phải xác định rõ ràng, không mập mờ", correct: true },
        { text: "Một bài toán chỉ có duy nhất một thuật toán giải được", correct: false },
        { text: "Thuật toán có thể được mô tả bằng ngôn ngữ tự nhiên hoặc sơ đồ khối", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: cùng bài toán sắp xếp đã có hàng chục thuật toán khác nhau, mỗi cái mạnh yếu ở tình huống riêng." },

    { type: "tf", topic: "E", grade: 12, level: "medium",
      question: "Một công ty thời trang muốn phân tích khách hàng cũ (tuổi, giới tính, sản phẩm đã mua) để tự động chia thành các nhóm có hành vi giống nhau, nhưng chưa biết trước sẽ có những nhóm nào. Xét tính đúng/sai:",
      statements: [
        { text: "Đây là bài toán gom cụm và thuộc nhóm học không giám sát", correct: true },
        { text: "Vì chưa có nhãn nhóm cho trước nên không dùng học có giám sát được", correct: true },
        { text: "Bước đầu tiên của quy trình học máy là thu thập dữ liệu", correct: true },
        { text: "Bài toán này giống hệt bài toán lọc thư rác vì đều dùng học máy", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: lọc thư rác có nhãn sẵn (\"rác\"/\"không rác\") nên là học có giám sát, còn gom cụm khách hàng thì không có nhãn — hai nhóm bài toán khác hẳn nhau." },

    /* =========================== F — LẬP TRÌNH & HƯỚNG NGHIỆP =========================== */
    { type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Xét đoạn chương trình sau. Giá trị của biến T được in ra là bao nhiêu?",
      code: "def f(a, b):\n    return a ** b\n\nT = f(2, 5) + f(3, 3)\nprint(T)",
      options: ["59", "41", "35", "1000"],
      answer: 0,
      explain: "Toán tử ** là luỹ thừa: f(2,5) = 2^5 = 32 và f(3,3) = 3^3 = 27. Vậy T = 32 + 27 = 59. Nhầm ** thành phép nhân sẽ ra 10 + 9 = 19, còn nhầm thứ tự cơ số và số mũ ra 25 + 27." },

    { type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Đoạn chương trình sau in ra gì?",
      code: "gio = [7, 8, 9, 10, 11]\ntong = 0\nfor g in gio:\n    if g % 2 == 0:\n        tong += g\n    else:\n        tong -= 1\nprint(tong)",
      options: ["15", "18", "45", "12"],
      answer: 0,
      explain: "Số chẵn được cộng vào (8 + 10 = 18), số lẻ mỗi lần trừ 1 và có ba số lẻ (7, 9, 11) nên trừ 3. Kết quả 18 − 3 = 15." },

    { type: "mc", topic: "F", grade: 10, level: "medium",
      question: "Quán nước của chị Lan tính tiền: mua từ 5 cốc trở lên được giảm 10%. Đoạn nào viết đúng?",
      code: "so_coc = int(input())\ngia = 15000\n# chọn dòng đúng để thay vào chỗ ___\n___",
      options: [
        "tong = so_coc * gia * 0.9 if so_coc >= 5 else so_coc * gia",
        "tong = so_coc * gia * 0.9",
        "tong = so_coc * gia if so_coc >= 5 else so_coc * gia * 0.9",
        "tong = so_coc >= 5 * gia * 0.9",
      ], answer: 0,
      explain: "Chỉ giảm khi mua từ 5 cốc nên điều kiện phải gắn với nhánh giảm giá. Phương án B giảm cho mọi trường hợp, C giảm ngược (mua ít mới giảm), D là biểu thức sai cú pháp lôgic." },

    { type: "mc", topic: "F", grade: 11, level: "medium",
      question: "Đoạn chương trình sau in ra gì?",
      code: "ds = [\"Lan\", \"Nam\", \"Hoa\"]\nds.append(\"Vy\")\nds.remove(\"Nam\")\nprint(len(ds), ds[0])",
      options: ["3 Lan", "4 Lan", "3 Nam", "4 Vy"],
      answer: 0,
      explain: "Thêm \"Vy\" thành 4 phần tử, xoá \"Nam\" còn 3. Phần tử đầu vẫn là \"Lan\" vì việc xoá chỉ dồn các phần tử phía sau lên." },

    { type: "mc", topic: "F", grade: 10, level: "medium",
      question: "Bạn Tú muốn chương trình hỏi tuổi rồi in \"Đủ tuổi\" nếu từ 18 trở lên. Dòng nào đúng?",
      code: "tuoi = int(input())\n___\n    print(\"Đủ tuổi\")",
      options: ["if tuoi >= 18:", "if tuoi > 18:", "if tuoi = 18:", "while tuoi >= 18:"],
      answer: 0,
      explain: "\"Từ 18 trở lên\" là >= 18 (bao gồm cả 18). Dấu = đơn là phép GÁN nên sai cú pháp trong điều kiện, còn while sẽ lặp vô hạn vì tuổi không đổi trong vòng lặp." },

    { type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Chương trình đếm số học sinh đạt (điểm >= 5) trong danh sách. Đoạn sau in ra số mấy?",
      code: "diem = [3, 5, 8, 4.5, 5.0, 9, 2]\ndem = 0\nfor d in diem:\n    if d >= 5:\n        dem += 1\nprint(dem)",
      options: ["4", "3", "5", "2"],
      answer: 0,
      explain: "Các giá trị thoả điều kiện: 5, 8, 5.0 và 9 — tổng cộng 4. Lưu ý 5.0 vẫn thoả >= 5, còn 4.5 thì không." },

    { type: "mc", topic: "F", grade: 12, level: "medium",
      question: "Một bạn muốn theo nghề lập trình viên. Kĩ năng nào là nền tảng quan trọng nhất cần rèn ngay từ phổ thông?",
      options: [
        "Tư duy giải quyết vấn đề và khả năng tự học công nghệ mới",
        "Thuộc lòng cú pháp của càng nhiều ngôn ngữ càng tốt",
        "Gõ bàn phím thật nhanh",
        "Biết dùng nhiều phần mềm văn phòng",
      ], answer: 0,
      explain: "Ngôn ngữ và công cụ thay đổi liên tục, còn cách phân tích bài toán và khả năng tự học thì dùng được cả sự nghiệp. Gõ nhanh hay thạo phần mềm văn phòng là kĩ năng phụ trợ." },

    { type: "mc", topic: "F", grade: 11, level: "medium",
      question: "Đoạn chương trình sau in ra gì?",
      code: "s = \"Tin hoc\"\nprint(s.upper()[:3], len(s))",
      options: ["TIN 7", "Tin 7", "TIN 8", "TIN HOC 7"],
      answer: 0,
      explain: "upper() cho \"TIN HOC\", cắt 3 kí tự đầu được \"TIN\". Chuỗi \"Tin hoc\" có 7 kí tự (tính cả dấu cách giữa hai từ)." },

    { type: "mc", topic: "F", grade: 10, level: "easy",
      question: "Lệnh nào dùng để đọc dữ liệu người dùng gõ từ bàn phím trong Python?",
      options: ["input()", "print()", "read()", "scan()"],
      answer: 0,
      explain: "input() đọc một dòng người dùng gõ và trả về chuỗi (muốn thành số phải đổi bằng int() hoặc float()). print() là để in ra màn hình." },

    { type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Đoạn chương trình sau in ra gì?",
      code: "def dem(n):\n    if n <= 0:\n        return 0\n    return 1 + dem(n - 1)\n\nprint(dem(4))",
      options: ["4", "5", "0", "Lỗi tràn đệ quy"],
      answer: 0,
      explain: "Mỗi lần gọi cộng 1 rồi gọi tiếp với n − 1, dừng khi n <= 0 trả về 0. Chuỗi gọi n = 4,3,2,1 cộng được 4 lần, cộng với 0 ở đáy nên kết quả là 4." },

    { type: "mc", topic: "F", grade: 12, level: "medium",
      question: "Nhóm nghề nào sau đây gắn trực tiếp với việc phân tích dữ liệu để hỗ trợ ra quyết định kinh doanh?",
      options: [
        "Chuyên viên phân tích dữ liệu",
        "Kĩ thuật viên lắp ráp máy tính",
        "Nhân viên nhập liệu",
        "Thợ sửa chữa máy in",
      ], answer: 0,
      explain: "Phân tích dữ liệu là công việc thu thập, làm sạch, trực quan hoá và diễn giải số liệu để đưa ra khuyến nghị. Ba nghề còn lại thuộc nhóm vận hành và dịch vụ kĩ thuật." },

    { type: "mc", topic: "F", grade: 11, level: "medium",
      question: "Chương trình nhập điểm bị lỗi khi người dùng gõ chữ thay vì số. Cách xử lí phù hợp là gì?",
      options: [
        "Dùng cấu trúc try – except để bắt lỗi và yêu cầu nhập lại",
        "Yêu cầu người dùng cẩn thận hơn",
        "Bỏ qua vì lỗi này hiếm gặp",
        "Đổi sang ngôn ngữ lập trình khác",
      ], answer: 0,
      explain: "Dữ liệu nhập từ người dùng luôn phải coi là có thể sai. try – except cho phép chương trình phát hiện lỗi chuyển kiểu và xử lí êm thay vì dừng đột ngột." },

    { type: "mc", topic: "F", grade: 10, level: "medium",
      question: "Đoạn chương trình sau in ra bao nhiêu dòng?",
      code: "for i in range(3):\n    for j in range(2):\n        print(i, j)",
      options: ["6", "5", "3", "2"],
      answer: 0,
      explain: "Vòng ngoài chạy 3 lần, mỗi lần vòng trong chạy 2 lần nên tổng số lần in là 3 × 2 = 6 dòng." },

    { type: "mc", topic: "F", grade: 11, level: "hard",
      question: "Đoạn chương trình sau in ra gì?",
      code: "a = [1, 2, 3, 4, 5]\nb = a[1:4]\nb[0] = 99\nprint(a[1], b[0])",
      options: ["2 99", "99 99", "2 2", "1 99"],
      answer: 0,
      explain: "Phép cắt a[1:4] tạo ra danh sách MỚI (bản sao) chứ không tham chiếu tới a. Sửa b không ảnh hưởng a, nên a[1] vẫn là 2 còn b[0] đã thành 99." },

    { type: "mc", topic: "F", grade: 12, level: "medium",
      question: "Khi làm dự án phần mềm theo nhóm, công cụ nào giúp nhiều người cùng sửa mã nguồn mà không đè mất việc của nhau?",
      options: [
        "Hệ quản lí phiên bản như Git",
        "Phần mềm trình chiếu",
        "Bảng tính",
        "Trình duyệt web",
      ], answer: 0,
      explain: "Quản lí phiên bản lưu lại lịch sử thay đổi, cho phép mỗi người làm trên nhánh riêng rồi hoà lại, và khôi phục khi hỏng. Đây là công cụ nền tảng của mọi nhóm phát triển phần mềm." },

    { type: "mc", topic: "F", grade: 11, level: "medium",
      question: "Đoạn chương trình sau in ra gì?",
      code: "d = {\"Toan\": 8, \"Ly\": 7, \"Tin\": 9}\nprint(d[\"Tin\"], len(d))",
      options: ["9 3", "3 9", "9 9", "Tin 3"],
      answer: 0,
      explain: "Từ điển truy cập theo khoá nên d[\"Tin\"] cho 9; len(d) đếm số cặp khoá – giá trị nên bằng 3." },

    { type: "mc", topic: "F", grade: 10, level: "medium",
      question: "Bạn Hải viết vòng lặp nhưng chương trình chạy mãi không dừng. Nguyên nhân phổ biến nhất là gì?",
      options: [
        "Biến điều khiển không được cập nhật nên điều kiện dừng không bao giờ đạt",
        "Máy tính bị thiếu bộ nhớ",
        "Python không hỗ trợ vòng lặp while",
        "Dữ liệu đầu vào quá lớn",
      ], answer: 0,
      explain: "Vòng lặp vô hạn gần như luôn do quên tăng/giảm biến điều khiển hoặc điều kiện dừng viết sai. Đây là lỗi kinh điển khi mới học while." },

    { type: "mc", topic: "F", grade: 12, level: "hard",
      question: "Hai bạn viết cùng một thuật toán, một bạn dùng Python, một bạn dùng C++. Nhận định nào đúng?",
      options: [
        "Cùng thuật toán thì cho cùng kết quả, chỉ khác cú pháp và tốc độ chạy",
        "Kết quả sẽ khác nhau vì hai ngôn ngữ tính toán khác nhau",
        "Chỉ C++ mới cài đặt được thuật toán, Python thì không",
        "Python luôn chạy nhanh hơn C++",
      ], answer: 0,
      explain: "Thuật toán là cách giải, độc lập với ngôn ngữ. Cùng thuật toán, cùng đầu vào thì cùng kết quả; khác biệt nằm ở cú pháp và hiệu năng (C++ biên dịch nên thường nhanh hơn Python thông dịch)." },

    { type: "mc", topic: "F", grade: 11, level: "medium",
      question: "Đoạn chương trình sau in ra gì?",
      code: "x = 7\ny = 2\nprint(x // y, x % y, x / y)",
      options: ["3 1 3.5", "3.5 1 3", "3 3.5 1", "4 1 3.5"],
      answer: 0,
      explain: "// là chia lấy phần nguyên (7 // 2 = 3), % là chia lấy dư (7 % 2 = 1), còn / cho kết quả thực (7 / 2 = 3.5)." },

    { type: "mc", topic: "F", grade: 12, level: "medium",
      question: "Một bạn muốn làm nghề kiểm thử phần mềm. Công việc chính của nghề này là gì?",
      options: [
        "Tìm lỗi và kiểm tra phần mềm có đúng yêu cầu trước khi đưa tới người dùng",
        "Chỉ viết mã nguồn cho tính năng mới",
        "Bán phần mềm cho khách hàng",
        "Lắp đặt đường truyền mạng",
      ], answer: 0,
      explain: "Kiểm thử viên thiết kế các tình huống thử, tìm lỗi và xác nhận phần mềm đáp ứng yêu cầu — vai trò khác với lập trình viên, nhân viên kinh doanh hay kĩ thuật viên mạng." },

    { type: "tf", topic: "F", grade: 11, level: "hard",
      question: "Xét đoạn chương trình Python sau khi làm bài tập trên lớp:",
      code: "a = [4, 8, 15, 16, 23, 42]\nprint(a[0], a[-1])\nprint(len(a))\nprint(a[1:3])",
      statements: [
        { text: "Dòng đầu in ra: 4 42", correct: true },
        { text: "Dòng thứ hai in ra: 6", correct: true },
        { text: "Dòng thứ ba in ra: [8, 15]", correct: true },
        { text: "a[-1] gây lỗi vì Python không cho phép chỉ số âm", correct: false },
      ],
      explain: "(a)(b)(c) đúng: chỉ số âm đếm từ cuối nên a[-1] là 42; cắt a[1:3] lấy chỉ số 1 và 2, KHÔNG lấy chỉ số 3. (d) sai vì Python hỗ trợ chỉ số âm." },

    { type: "tf", topic: "F", grade: 10, level: "medium",
      question: "Bạn Quỳnh mới học Python và đưa ra vài nhận định về kiểu dữ liệu. Xét tính đúng/sai:",
      statements: [
        { text: "input() luôn trả về dữ liệu kiểu chuỗi", correct: true },
        { text: "Muốn tính toán với số người dùng nhập thì cần đổi kiểu bằng int() hoặc float()", correct: true },
        { text: "Phép \"2\" + \"3\" trong Python cho kết quả 5", correct: false },
        { text: "Phép 2 + 3 cho kết quả 5", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: cộng hai CHUỖI là nối chúng lại thành \"23\", không phải cộng số. Đây là lỗi rất hay gặp khi quên đổi kiểu sau input()." },

    { type: "tf", topic: "F", grade: 11, level: "medium",
      question: "Nhóm bạn viết chương trình quản lí điểm và bàn về cách tổ chức mã nguồn. Xét tính đúng/sai:",
      statements: [
        { text: "Tách các phần việc thành hàm giúp dễ đọc và dễ sửa hơn", correct: true },
        { text: "Đặt tên biến có nghĩa giúp người khác đọc mã hiểu nhanh hơn", correct: true },
        { text: "Viết chú thích giải thích những chỗ khó hiểu là việc nên làm", correct: true },
        { text: "Chương trình càng ngắn thì luôn càng tốt, kể cả khi khó hiểu", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: mã nguồn được đọc nhiều hơn được viết. Rút ngắn tới mức khó hiểu sẽ khiến chính mình mất thời gian gấp bội khi quay lại sửa." },

    { type: "tf", topic: "F", grade: 12, level: "medium",
      question: "Lớp tìm hiểu về các nhóm nghề trong lĩnh vực tin học. Xét tính đúng/sai:",
      statements: [
        { text: "Lập trình viên, kiểm thử viên và quản trị mạng là những nghề khác nhau về nhiệm vụ chính", correct: true },
        { text: "Nghề trong lĩnh vực tin học đòi hỏi phải học và cập nhật liên tục", correct: true },
        { text: "Chỉ người học chuyên ngành công nghệ thông tin mới dùng được kĩ năng tin học trong công việc", correct: false },
        { text: "Kĩ năng làm việc nhóm và giao tiếp cũng quan trọng với người làm tin học", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: kế toán, y tế, nông nghiệp, báo chí đều dùng công cụ tin học và phân tích dữ liệu — kĩ năng tin học đã thành kĩ năng nền cho hầu hết ngành nghề." },

    { type: "tf", topic: "F", grade: 11, level: "hard",
      question: "Xét đoạn chương trình sau:",
      code: "def tinh(ds):\n    if len(ds) == 0:\n        return 0\n    return sum(ds) / len(ds)\n\nprint(tinh([6, 7, 8]))\nprint(tinh([]))",
      statements: [
        { text: "Dòng đầu in ra 7.0", correct: true },
        { text: "Dòng thứ hai in ra 0 mà không gây lỗi", correct: true },
        { text: "Nếu bỏ đoạn kiểm tra len(ds) == 0 thì lời gọi tinh([]) sẽ gây lỗi chia cho 0", correct: true },
        { text: "Hàm này trả về tổng của danh sách", correct: false },
      ],
      explain: "(a)(b)(c) đúng: (6+7+8)/3 = 7.0, và nhánh kiểm tra danh sách rỗng chính là cách chặn lỗi chia cho 0. (d) sai: hàm trả về trung bình cộng, không phải tổng." },

    /* =========================== G — KHOA HỌC MÁY TÍNH (CHUYÊN SÂU) =========================== */
    { type: "mc", topic: "G", grade: 11, level: "hard",
      question: "Chương trình duyệt qua từng phần tử của danh sách n phần tử đúng một lần để tìm giá trị nhỏ nhất. Độ phức tạp thời gian là bao nhiêu?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      answer: 0,
      explain: "Số phép so sánh tỉ lệ thuận với n nên độ phức tạp là O(n). O(n²) ứng với hai vòng lặp lồng nhau, O(log n) ứng với việc chia đôi mỗi bước, O(1) là số bước không đổi." },

    { type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Thuật toán sắp xếp nổi bọt trên danh sách 1.000 phần tử trong trường hợp xấu nhất cần khoảng bao nhiêu phép so sánh?",
      options: ["Khoảng 500.000", "Khoảng 1.000", "Khoảng 10", "Khoảng 100",],
      answer: 0,
      explain: "Sắp xếp nổi bọt có độ phức tạp O(n²): với n = 1.000 thì số phép so sánh cỡ n(n−1)/2 ≈ 500.000. Đây là lí do người ta chuyển sang các thuật toán O(n·log n) khi dữ liệu lớn." },

    { type: "mc", topic: "G", grade: 11, level: "medium",
      question: "Cấu trúc dữ liệu nào phù hợp nhất để mô phỏng hàng người xếp hàng mua vé (ai đến trước được phục vụ trước)?",
      options: ["Hàng đợi (queue)", "Ngăn xếp (stack)", "Cây nhị phân", "Đồ thị"],
      answer: 0,
      explain: "Hàng đợi hoạt động theo nguyên tắc vào trước ra trước, đúng với cảnh xếp hàng. Ngăn xếp thì vào sau ra trước, phù hợp với chức năng hoàn tác hoặc gọi hàm đệ quy." },

    { type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Chức năng \"hoàn tác\" (Undo) trong phần mềm soạn thảo thường được cài đặt bằng cấu trúc dữ liệu nào?",
      options: ["Ngăn xếp (stack)", "Hàng đợi (queue)", "Từ điển (dictionary)", "Tập hợp (set)"],
      answer: 0,
      explain: "Thao tác cuối cùng phải được hoàn tác đầu tiên — đúng nguyên tắc vào sau ra trước của ngăn xếp. Hàng đợi cho thứ tự ngược lại nên không dùng được cho Undo." },

    { type: "mc", topic: "G", grade: 11, level: "medium",
      question: "Một danh sách đã sắp xếp có 1.024 phần tử. Tìm kiếm nhị phân cần tối đa bao nhiêu bước?",
      options: ["11", "1.024", "512", "10"],
      answer: 0,
      explain: "Mỗi bước chia đôi số phần tử còn lại: 1024 → 512 → 256 → … → 1, tức 10 lần chia, cộng thêm bước kiểm tra phần tử cuối cùng nên tối đa 11 bước." },

    { type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Vì sao thuật toán có độ phức tạp O(n·log n) được coi là tốt hơn O(n²) khi n lớn?",
      options: [
        "Vì khi n tăng, n·log n tăng chậm hơn n² rất nhiều nên thời gian chạy chênh lệch ngày càng lớn",
        "Vì O(n·log n) luôn chạy nhanh hơn với mọi giá trị của n",
        "Vì O(n·log n) dùng ít bộ nhớ hơn",
        "Vì O(n²) không cài đặt được trên máy tính hiện đại",
      ], answer: 0,
      explain: "Với n = 1 triệu, n² là 10¹² còn n·log n chỉ khoảng 2·10⁷ — chênh nhau hàng chục nghìn lần. Với n nhỏ thì thuật toán O(n²) đơn giản có thể còn nhanh hơn, nên phương án B sai." },

    { type: "mc", topic: "G", grade: 11, level: "medium",
      question: "Kĩ thuật \"chia để trị\" thể hiện rõ nhất ở thuật toán nào sau đây?",
      options: ["Sắp xếp trộn (merge sort)", "Sắp xếp nổi bọt", "Tìm kiếm tuần tự", "Đếm số phần tử của danh sách"],
      answer: 0,
      explain: "Sắp xếp trộn chia đôi danh sách, sắp xếp từng nửa rồi trộn lại — đúng ba bước chia, trị, hợp. Ba phương án còn lại chỉ duyệt tuần tự chứ không chia nhỏ bài toán." },

    { type: "mc", topic: "G", grade: 12, level: "hard",
      question: "Một hàm đệ quy gọi chính nó mà thiếu điều kiện dừng. Hậu quả là gì?",
      options: [
        "Chương trình gọi hàm mãi cho tới khi tràn vùng nhớ ngăn xếp và dừng bất thường",
        "Chương trình vẫn chạy đúng nhưng chậm hơn",
        "Trình biên dịch tự thêm điều kiện dừng",
        "Kết quả trả về luôn bằng 0",
      ], answer: 0,
      explain: "Mỗi lời gọi hàm chiếm một khung trên ngăn xếp. Không có điều kiện dừng thì ngăn xếp đầy và chương trình dừng với lỗi tràn ngăn xếp — điều kiện dừng là phần bắt buộc của mọi hàm đệ quy." },

    { type: "mc", topic: "G", grade: 11, level: "medium",
      question: "Muốn kiểm tra nhanh một tên đã có trong danh sách 100.000 tên hay chưa, cấu trúc dữ liệu nào cho tốc độ tốt nhất?",
      options: ["Tập hợp (set) hoặc từ điển (dictionary)", "Danh sách chưa sắp xếp", "Chuỗi nối tất cả tên lại", "Danh sách hai chiều"],
      answer: 0,
      explain: "Tập hợp và từ điển dùng bảng băm nên kiểm tra thành viên gần như tức thì, không phụ thuộc số phần tử. Duyệt danh sách chưa sắp xếp phải so sánh tới 100.000 lần." },

    { type: "tf", topic: "G", grade: 12, level: "hard",
      question: "Lớp chuyên tin thảo luận về độ phức tạp thuật toán khi so sánh các cách giải cùng một bài toán. Xét tính đúng/sai:",
      statements: [
        { text: "Độ phức tạp O(1) nghĩa là số bước không phụ thuộc kích thước dữ liệu đầu vào", correct: true },
        { text: "Với dữ liệu rất lớn, thuật toán O(log n) thường nhanh hơn nhiều so với O(n)", correct: true },
        { text: "Một thuật toán O(n²) không bao giờ dùng được trong thực tế", correct: false },
        { text: "Độ phức tạp còn có thể xét theo bộ nhớ sử dụng, không chỉ theo thời gian", correct: true },
      ],
      explain: "(a)(b)(d) đúng. (c) sai: với dữ liệu nhỏ, thuật toán O(n²) đơn giản, dễ viết đúng vẫn là lựa chọn hợp lí — độ phức tạp chỉ quan trọng khi n lớn." },

    { type: "tf", topic: "G", grade: 11, level: "medium",
      question: "Bạn Đạt tìm hiểu về ngăn xếp và hàng đợi để làm bài tập lập trình. Xét tính đúng/sai:",
      statements: [
        { text: "Ngăn xếp hoạt động theo nguyên tắc vào sau ra trước", correct: true },
        { text: "Hàng đợi hoạt động theo nguyên tắc vào trước ra trước", correct: true },
        { text: "Chức năng hoàn tác trong phần mềm soạn thảo phù hợp với ngăn xếp", correct: true },
        { text: "Hàng đợi và ngăn xếp là hai tên gọi khác nhau của cùng một cấu trúc", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: hai cấu trúc khác nhau ở thứ tự lấy phần tử ra, dẫn tới ứng dụng hoàn toàn khác nhau." },

    { type: "tf", topic: "G", grade: 12, level: "hard",
      question: "Nhóm học sinh so sánh hai cách tìm một giá trị trong dãy 1 triệu số. Xét tính đúng/sai:",
      statements: [
        { text: "Nếu dãy chưa sắp xếp, tìm tuần tự là lựa chọn hợp lí khi chỉ tìm một lần", correct: true },
        { text: "Nếu phải tìm nhiều lần, nên sắp xếp trước rồi dùng tìm kiếm nhị phân", correct: true },
        { text: "Tìm kiếm nhị phân áp dụng được cho dãy chưa sắp xếp", correct: false },
        { text: "Chi phí sắp xếp chỉ đáng bỏ ra khi số lần tìm kiếm đủ nhiều", correct: true },
      ],
      explain: "(a)(b)(d) đúng — đây chính là cách cân nhắc thực tế giữa chi phí chuẩn bị và chi phí truy vấn. (c) sai: nhị phân dựa vào tính đã sắp xếp để loại nửa dãy, không có điều đó thì kết luận sẽ sai." },

    { type: "tf", topic: "G", grade: 11, level: "hard",
      question: "Xét hàm đệ quy tính giai thừa sau:",
      code: "def gt(n):\n    if n <= 1:\n        return 1\n    return n * gt(n - 1)\n\nprint(gt(5))",
      statements: [
        { text: "Chương trình in ra 120", correct: true },
        { text: "Điều kiện n <= 1 là điều kiện dừng của đệ quy", correct: true },
        { text: "Nếu bỏ điều kiện dừng, chương trình sẽ gọi hàm mãi và báo lỗi tràn ngăn xếp", correct: true },
        { text: "Hàm này chạy nhanh hơn cách dùng vòng lặp vì dùng đệ quy", correct: false },
      ],
      explain: "(a)(b)(c) đúng: 5×4×3×2×1 = 120. (d) sai: đệ quy còn tốn thêm chi phí cho mỗi lời gọi hàm, nên thường CHẬM hơn vòng lặp — ưu điểm của nó là diễn đạt gọn và tự nhiên với bài toán chia nhỏ." },

    { type: "tf", topic: "G", grade: 12, level: "medium",
      question: "Lớp thảo luận cách chọn cấu trúc dữ liệu cho từng bài toán cụ thể. Xét tính đúng/sai:",
      statements: [
        { text: "Danh sách phù hợp khi cần truy cập phần tử theo chỉ số", correct: true },
        { text: "Từ điển phù hợp khi cần tra cứu nhanh theo khoá", correct: true },
        { text: "Tập hợp tự động loại bỏ các phần tử trùng nhau", correct: true },
        { text: "Chọn cấu trúc dữ liệu nào cũng cho tốc độ như nhau", correct: false },
      ],
      explain: "(a)(b)(c) đúng. (d) sai: chọn đúng cấu trúc có thể đưa một thao tác từ O(n) xuống O(1) — đây là một trong những quyết định ảnh hưởng lớn nhất tới hiệu năng chương trình." },
  ];

  /* ID nối tiếp số hiện có theo từng (chủ đề, loại) — giống questions-vandung.js,
     nhờ vậy thêm tệp mới không bao giờ đụng ID cũ. */
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
