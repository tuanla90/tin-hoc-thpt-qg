/* ============================================================================
 *  SGK TIN 10 - Chủ đề 2, Bài 8-10 (soạn song song bởi sub-agent, đã duyệt).
 *  Nạp sau sgk-lessons.js.
 * ==========================================================================*/
(function () {
  if (typeof LESSONS === "undefined") return;
  var META = {
    "S10-08": { stage: 10, order: 8, topic: "B", grade: 10, minutes: 15,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 8, trang 38–43",
        images: ["sach/pages/tin10/p039.png", "sach/pages/tin10/p040.png", "sach/pages/tin10/p041.png", "sach/pages/tin10/p042.png", "sach/pages/tin10/p043.png", "sach/pages/tin10/p044.png"] },
      quiz: ["B-mc-4", "B-mc-2", "B-mc-6", "B-mc-7", "B-tf-1"] },
    "S10-09": { stage: 10, order: 9, topic: "D", grade: 10, minutes: 16,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 9, trang 44–49",
        images: ["sach/pages/tin10/p045.png", "sach/pages/tin10/p046.png", "sach/pages/tin10/p047.png", "sach/pages/tin10/p048.png", "sach/pages/tin10/p049.png", "sach/pages/tin10/p050.png"] },
      quiz: ["D-mc-3", "D-mc-6", "D-mc-2", "D-tf-1", "D-tf-2"] },
    "S10-10": { stage: 10, order: 10, topic: "C", grade: 10, minutes: 12,
      sgk: { ref: "SGK Tin học 10 (Kết nối tri thức) · Bài 10, trang 50–54",
        images: ["sach/pages/tin10/p051.png", "sach/pages/tin10/p052.png", "sach/pages/tin10/p053.png", "sach/pages/tin10/p054.png", "sach/pages/tin10/p055.png"] },
      quiz: ["C-mc-1", "C-mc-4", "C-mc-5", "C-tf-1"] },
  };

  var CONTENT = {
    "S10-08": {
      "title": "Bài 8. Mạng máy tính trong cuộc sống hiện đại",
      "intro": "Bài này giúp em hiểu mạng máy tính là gì, vì sao mạng LAN trong nhà lại khác với Internet toàn cầu, và làm quen với hai công nghệ rất hay dựa trên Internet: **điện toán đám mây** và **kết nối vạn vật (IoT)**.",
      "sections": [
        {"t":"story","text":"Em hãy tưởng tượng lớp học của mình nhé. Các bạn ngồi trong cùng một lớp muốn nhắn gì cho nhau thì rất dễ: chỉ cần chuyền tay một mẩu giấy là tới ngay, vì mọi người ở gần nhau. Đó giống như một **mạng nhỏ**. Nhưng nếu em muốn gửi thư cho một người bạn ở tỉnh khác thật xa, em phải bỏ thư vào bưu điện để bác đưa thư mang đi. Máy tính cũng y hệt vậy: người ta nối nhiều máy tính lại để chúng 'nói chuyện' và gửi thông tin cho nhau. Mấy máy ở gần nhau (trong một nhà, một trường) nối lại thành một mạng nhỏ. Còn khi tất cả những mạng nhỏ trên khắp thế giới được nối chung lại, ta có một mạng khổng lồ bao trùm cả Trái Đất, đó chính là **Internet**."},
        {"t":"h","text":"Trong một mạng máy tính có những gì?"},
        {"t":"text","text":"Nhìn vào mô hình một mạng máy tính, em sẽ thấy hai kiểu thiết bị. Kiểu thứ nhất là **thiết bị đầu cuối**, là nơi thông tin bắt đầu đi ra hoặc đi tới, ví dụ **máy chủ**, **máy tính để bàn** và **máy in**. Em có thể hình dung chúng như những 'ngôi nhà' có người ở, nơi gửi thư đi và nhận thư về. Kiểu thứ hai là **thiết bị kết nối**, chuyên nối các máy lại và dẫn thông tin đi đúng đường, gồm **bộ chia** (`HUB`), **bộ chuyển mạch** (`Switch`) và **bộ định tuyến** (`Router`). Chúng giống như những 'con đường' và 'bác đưa thư' giúp thư tới đúng nhà. Riêng bộ định tuyến có nhiều cổng cắm dây mạng, phân biệt cổng `LAN` (nối các máy trong nhà) và cổng `INTERNET` (nối ra thế giới bên ngoài)."},
        {"t":"h","text":"1. Mạng LAN và Internet"},
        {"t":"text","text":"Người ta dựa vào phạm vi rộng hay hẹp để chia mạng thành hai loại. Loại thứ nhất là **mạng cục bộ**, tiếng Anh là Local Area Network, viết tắt `LAN`. 'Cục bộ' nghĩa là gói gọn trong một chỗ nhỏ, như một gia đình, một trường học hay một công ty. Loại thứ hai là **mạng diện rộng**, tiếng Anh là Wide Area Network, viết tắt `WAN`, được tạo bằng cách nối nhiều mạng LAN hoặc nhiều máy tính lẻ lại với nhau, nên trải ra rất rộng."},
        {"t":"text","text":"Vậy **Internet** là gì? Internet chính là mạng diện rộng lớn nhất, quy mô **toàn cầu**, phủ khắp cả thế giới. Một gia đình, trường học hay cơ quan trước hết lắp một mạng LAN cho mình, sau đó **đăng kí với nhà cung cấp dịch vụ Internet** thì mới nối được ra Internet để dùng."},
        {"t":"text","text":"Các thiết bị kết nối làm việc khác nhau. **Bộ chia** và **bộ chuyển mạch** chỉ chuyển thông tin qua lại trong nội bộ một mạng LAN, giống bác đưa thư của xóm chỉ phát thư loanh quanh trong xóm. Còn **bộ định tuyến** (`Router`) mới nối các mạng LAN với nhau. Nó làm việc rất khôn: khi có gói thông tin cần gửi, nó xem địa chỉ nơi nhận; nếu địa chỉ đó **có** trong LAN thì gửi ngay trong nhà, còn nếu **không** có thì đẩy gói tin ra cổng Internet để đi xa — giống hệt bưu điện: thư trong xã thì phát luôn, thư đi tỉnh khác thì chuyển ra ngoài."},
        {"t":"text","text":"Một điểm khác nữa là **chủ sở hữu**. Mạng LAN luôn có chủ: của một người, một gia đình hay một cơ quan. Còn Internet thì **không của riêng ai**, không có ông chủ nào ngồi một chỗ quản lí tất cả. Tuy vậy vẫn có vài tổ chức phi lợi nhuận quốc tế điều phối những thứ dùng chung (địa chỉ, tên miền) và đặt ra tiêu chuẩn kĩ thuật, để cả thế giới nối vào nhau cho ăn khớp."},
        {"t":"list","text":"Ghi nhớ sự khác nhau qua bảng nhỏ:","items":["**Phạm vi, quy mô:** Mạng cục bộ gói trong cơ quan, gia đình; còn Internet phủ toàn cầu.","**Cách kết nối:** Mạng cục bộ nối trực tiếp qua `Hub`, `Switch`, `Wifi`; còn Internet nối qua các `Router` thông qua nhà cung cấp dịch vụ.","**Sở hữu:** Mạng cục bộ có chủ; còn Internet không có chủ sở hữu."]},
        {"t":"note","text":"Muốn nối điện thoại, máy tính hay ti vi vào Internet, nhà mình phải đăng kí với một **nhà cung cấp dịch vụ Internet**, ví dụ Viettel, FPT, VNPT,..."},
        {"t":"h","text":"2. Vai trò của Internet"},
        {"t":"text","text":"Ngày nay Internet chạm tới gần như mọi việc trong đời sống. **Trong giao tiếp:** ta có thể liên lạc, chia sẻ, nêu ý tưởng và nhận trả lời **ngay lập tức**, bất cứ lúc nào, ở đâu, mà không cần gặp mặt. Ví dụ ông bà ở quê vẫn nhìn thấy và nói chuyện với cháu ở thành phố qua một cuộc gọi video. **Trong giáo dục:** Internet là kho thông tin khổng lồ; nhờ các nền tảng học trực tuyến, người học có thể **học từ xa, mọi lúc, mọi nơi**."},
        {"t":"list","text":"Ba điều cần nhớ về vai trò của Internet:","items":["Internet là một **kho tri thức khổng lồ** thường xuyên cập nhật, truy cập được bất cứ đâu, bất cứ lúc nào.","Internet giúp con người **kết nối và giao tiếp** dễ dàng, tiện lợi.","Internet ảnh hưởng sâu sắc tới mọi mặt đời sống: cách làm việc, học tập, giao tiếp."]},
        {"t":"h","text":"3. Điện toán đám mây"},
        {"t":"text","text":"**Chuyện bạn An.** An có nhiều ảnh cần cất nhưng ổ cứng sắp đầy. Thay vì mua thêm ổ cứng, An **đăng kí một dịch vụ lưu trữ trên Internet** như `Google Drive`, `Dropbox`. Mỗi khi cần, An nối Internet, đăng nhập là dùng được như một ổ đĩa ngay trong máy. Dùng ít thì **không mất tiền**, dùng nhiều mới trả tiền theo mức đã dùng."},
        {"t":"text","text":"**Chuyện cô Bình.** Cô hay đi công tác. Thay vì mua Word cài sẵn, cô **dùng `Google Docs`** chạy trên máy chủ Google, nên soạn thảo được ở bất cứ đâu, bằng bất cứ máy nào có Internet; văn bản cũng được cất trên máy chủ Google."},
        {"t":"text","text":"Hai người đều không mua đứt đồ về nhà, mà **thuê dùng qua Internet**. Những thứ họ thuê nằm ở đâu đó rất xa, ta chỉ hình dung là 'đâu đó trên mạng'. Người ta ví chỗ mơ hồ đó như một đám mây trên trời, nên mới có tên **điện toán đám mây**."},
        {"t":"note","text":"Việc chia sẻ các tài nguyên trên mạng theo nhu cầu qua Internet (miễn phí hoặc trả phí theo mức dùng) gọi là **dịch vụ điện toán đám mây**. Muốn dùng phải đăng kí thuê bao rồi được cấp tài khoản để truy cập. `Google Docs`, `Dropbox`,... là ví dụ quen thuộc."},
        {"t":"h","text":"Ba loại dịch vụ đám mây cơ bản"},
        {"t":"list","text":"Dịch vụ đám mây chủ yếu là **cho thuê** phần mềm và phần cứng, chia thành ba loại (nghĩ đơn giản là 'thuê ba mức'):","items":["**`SaaS` — thuê phần mềm dùng ngay** (Software as a service). Giống thuê món đồ làm sẵn để dùng luôn, ví dụ Google Docs để soạn thảo, Zoom để học.","**`PaaS` — thuê nền tảng** (Platform as a service). Giống thuê cả một xưởng có sẵn máy móc để tự làm sản phẩm; ví dụ công ty làm app đặt taxi thuê bản đồ số của Google.","**`IaaS` — thuê hạ tầng** (Infrastructure as a service). 'Hạ tầng' là phần cứng như máy chủ, thiết bị lưu trữ; giống thuê một cái kho trống để chứa đồ (ví dụ Google Drive)."]},
        {"t":"list","text":"Lợi ích của dịch vụ đám mây:","items":["**Mềm dẻo, luôn sẵn sàng:** làm việc lúc nào, ở đâu cũng được, miễn có Internet.","**Chất lượng cao:** nhà cung cấp đầu tư bài bản, hệ thống có dự phòng lớn nên ổn định, an toàn.","**Tiết kiệm hơn:** chỉ trả tiền theo mức dùng; nhiều dịch vụ còn miễn phí cho cá nhân (như `Gmail`, `Google Maps`)."]},
        {"t":"note","text":"Nói gọn: **điện toán đám mây** là phân phối tài nguyên công nghệ thông tin theo nhu cầu qua Internet, trả tiền theo mức dùng — thường **linh hoạt hơn, tin cậy hơn và rẻ hơn** so với tự mua sắm phần cứng, phần mềm."},
        {"t":"h","text":"4. Kết nối vạn vật (IoT)"},
        {"t":"text","text":"Trước đây, mỗi tháng nhân viên điện lực phải đến từng nhà đọc **công tơ điện** rồi ghi lại. Nay dùng **công tơ điện tử**: bên trong có gắn con chip tự đọc chỉ số điện rồi tự gửi về trung tâm dữ liệu qua Internet. Cái công tơ biết tự làm việc như thế là một **thiết bị thông minh**. Ý tưởng nối các thiết bị thông minh lại với nhau chính là **kết nối vạn vật** — tiếng Anh là Internet of Things, viết tắt `IoT`. Nói dễ hiểu, IoT là nối các thiết bị thông minh để chúng **tự động thu thập, trao đổi và xử lí dữ liệu**, nhiều khi con người không cần nhúng tay vào."},
        {"t":"list","text":"IoT có mấy lợi ích lớn:","items":["**Thu thập dữ liệu trên diện rộng**, làm được cả ở nơi nguy hiểm mà con người không vào được.","**Hoạt động liên tục, tự động**, cho dữ liệu tức thời — rất quan trọng với các hệ thống **thời gian thực** (như xe tự lái).","**Tiết kiệm chi phí** vì bớt được công thu thập, xử lí thông tin bằng tay."]},
        {"t":"text","text":"Hai ví dụ gần gũi: **Thu phí không dừng trên cao tốc** — mỗi ô tô dán một **thẻ định danh** ở kính lái (dùng sóng radio `RFID`); khi xe qua trạm, thiết bị đọc thẻ, tự trừ phí và mở thanh chắn, xe **không phải dừng lại**. **Nhà thông minh (Smart home)** — cảm biến tự bật/tắt điều hoà, đèn; khoá cửa **nhận ra khuôn mặt**; hệ thống chống trộm tự nhắn tin báo chủ nhà. Chủ nhà chỉ cần một điện thoại là **theo dõi, điều khiển cả nhà từ xa**."},
        {"t":"note","text":"Ghi nhớ: **IoT** là hệ thống các thiết bị thông minh gắn cảm biến và phần mềm, tự động kết nối, thu thập và trao đổi dữ liệu qua mạng mà không nhất thiết có con người tham gia trực tiếp. Nó được xem là **một nội dung chủ chốt của cuộc cách mạng công nghiệp lần thứ tư**."}
      ],
      "keypoints": [
        "Theo phạm vi, mạng chia thành **mạng cục bộ (LAN)** nhỏ và **mạng diện rộng (WAN)**; **Internet** là mạng diện rộng lớn nhất, phủ toàn cầu.",
        "**Bộ chia, bộ chuyển mạch** chỉ chuyển dữ liệu trong một LAN; **bộ định tuyến (Router)** nối các LAN và đẩy dữ liệu ra Internet khi nơi nhận không nằm trong LAN.",
        "**LAN có chủ sở hữu**, còn **Internet không của riêng ai** (chỉ có vài tổ chức quốc tế điều phối, chuẩn hoá).",
        "**Internet** là kho tri thức khổng lồ, giúp con người giao tiếp, học tập, làm việc dễ dàng mọi lúc, mọi nơi.",
        "**Điện toán đám mây** là thuê tài nguyên công nghệ thông tin qua Internet, trả tiền theo mức dùng; ba loại chính: **SaaS** (thuê phần mềm), **PaaS** (thuê nền tảng), **IaaS** (thuê hạ tầng).",
        "**Kết nối vạn vật (IoT)** là nối các thiết bị thông minh để tự động thu thập, trao đổi, xử lí dữ liệu (công tơ điện tử, thu phí không dừng, nhà thông minh)."
      ]
    },
    "S10-09": {
      "title": "Bài 9. An toàn trên không gian mạng",
      "intro": "Bài này nói về **an toàn trên không gian mạng**. 'Không gian mạng' (gọi tắt là **mạng**) chính là **Internet**. Em sẽ học hai điều lớn: các **nguy cơ** khi lên mạng và cách phòng tránh; và **phần mềm độc hại** (chương trình xấu hại máy tính) cùng cách chống lại.",
      "sections": [
        {"t":"story","text":"Hãy tưởng tượng **Internet** giống một cái **chợ khổng lồ** có hàng triệu người. Em có thể gặp bạn bè, xem tin tức, tải trò chơi... rất vui. Nhưng chợ đông thì không phải ai cũng tốt — có **kẻ xấu** trà trộn, giả vờ thân thiện để lừa em. Giống ngoài đời bố mẹ hay dặn: 'Đừng đi theo người lạ, đừng nhận quà của người lạ.' Trên mạng cũng vậy, nó **đầy rẫy cạm bẫy**. Bài này dạy em cách **tự bảo vệ mình**, giống như học cách **khoá cửa nhà** cho an toàn."},
        {"t":"h","text":"1. Một số nguy cơ trên mạng"},
        {"t":"text","text":"**Nguy cơ** là điều nguy hiểm có thể xảy ra. Trên mạng có nhiều nguy cơ; mình tìm hiểu từng cái rồi học cách tránh."},
        {"t":"h","text":"Nguy cơ 1 — Tin giả và tin xấu"},
        {"t":"text","text":"Trên mạng, **ai cũng có thể đăng bài**, kể cả tin xấu. Vì thế có nhiều **tin giả** (không có thật) và tin **phản cảm** làm em **nghĩ sai, hiểu lệch**. Giống một bạn bịa chuyện kể cho cả lớp làm mọi người tin nhầm. Nên em phải **cảnh giác**, đừng vội tin mọi thứ đọc được trên mạng."},
        {"t":"h","text":"Nguy cơ 2 — Lừa đảo trên mạng"},
        {"t":"text","text":"Kẻ xấu lấy **ảnh và tin tức** trên trang cá nhân của một người, rồi lập một trang **giống hệt**, đi **kết bạn** với bạn bè của người đó. Ai cũng tưởng là bạn thật. Cuối cùng chúng **mạo danh** để hỏi **vay tiền** rồi chiếm đoạt. Giống có kẻ đeo mặt nạ giả làm anh của em để mượn tiền."},
        {"t":"h","text":"Nguy cơ 3 — Lộ thông tin cá nhân"},
        {"t":"text","text":"**Thông tin cá nhân** là thứ riêng của em: tên tuổi, số điện thoại, email, tài khoản ngân hàng, tài khoản các ứng dụng. Nếu **lộ** thì rất nguy: lộ tài khoản ứng dụng dễ bị **mạo danh**, lộ tài khoản ngân hàng dễ bị **mất tiền**. Giữ thông tin cá nhân như **giữ chìa khoá nhà**: tuyệt đối đừng đưa cho người lạ."},
        {"t":"list","text":"Cách bảo vệ thông tin cá nhân:","items":["Không ghi thông tin cá nhân ở nơi người khác đọc được.","Giữ cho máy không bị nhiễm **phần mềm gián điệp**.","Cẩn thận khi dùng **wifi công cộng**, vì hầu hết không che giấu (mã hoá) thông tin khi truyền."]},
        {"t":"h","text":"Nguy cơ 4 — Bắt nạt trên mạng"},
        {"t":"text","text":"**Bắt nạt trên mạng** là khi có người trêu chọc, hăm doạ em qua mạng: nhẹ thì **chửi bới, làm nhục**; nặng thì **đe doạ, bịa đặt, vu khống**, thậm chí **tống tiền**. Kiểu này làm nạn nhân rất **buồn và sợ**."},
        {"t":"list","text":"Bắt nạt trên mạng đáng sợ vì:","items":["Có thể xảy ra **bất cứ lúc nào**, kéo dài dai dẳng.","Kẻ bắt nạt có thể **giấu mặt** (ẩn danh).","Rất đông người có thể theo dõi, bình luận, gây **áp lực nặng nề**.","Nhiều bạn không dám nói ra, nên bị **buồn chán** và có thể làm điều dại dột."]},
        {"t":"list","text":"Cách phòng chống khi bị bắt nạt:","items":["**Không kết bạn dễ dãi** qua mạng.","**Không trả lời, không tranh luận** với kẻ bắt nạt.","**Lưu giữ tất cả bằng chứng.**","**Chia sẻ với bố mẹ hoặc thầy cô.**","Khi nghiêm trọng, **báo cho công an** kèm bằng chứng."]},
        {"t":"h","text":"Nguy cơ 5 — Nghiện mạng"},
        {"t":"text","text":"Có người dành **quá nhiều thời gian** cho mạng, nhất là **chơi game**, đến mức **nghiện** thì hại sức khoẻ. Vì thế **không nên dùng Internet quá nhiều**. Giống ăn kẹo: ngon thật, nhưng ăn nhiều quá sẽ đau bụng và sâu răng."},
        {"t":"note","text":"**Ghi nhớ phần 1:** Chỉ vào **web tin cậy**, cảnh giác tin giả và lừa đảo. **Giữ bí mật** thông tin cá nhân. Chỉ **kết bạn với người quen**. Khi bị bắt nạt, hãy **kể cho người thân hoặc thầy cô**. Đừng dùng Internet quá nhiều."},
        {"t":"h","text":"2. Phần mềm độc hại"},
        {"t":"text","text":"**Phần mềm độc hại** là những phần mềm viết ra với **ý đồ xấu**, để **gây hại** cho người dùng (tiếng Anh viết tắt `malware`) — cứ hình dung như những **con vi trùng** làm máy tính bị 'ốm'. Có loại biết **tự lây lan** là **virus** và **worm**; còn **trojan** thì chỉ lo **ăn trộm thông tin** hoặc **chiếm quyền** máy."},
        {"t":"h","text":"a) Virus, worm và trojan"},
        {"t":"text","text":"**Virus** chỉ là một **đoạn mã độc** nhỏ, phải **bám vào một phần mềm khác** mới hoạt động và lây được — giống con vi trùng phải bám vào cơ thể mới sống và lan ra. **Worm** (còn gọi là **sâu máy tính**) là **phần mềm hoàn chỉnh**, tự đứng một mình, lây qua **lỗ hổng** của hệ điều hành hoặc **lừa** em tự cài (giấu **liên kết** trong email/tin nhắn: bấm vào là mã độc lén tải về). **Trojan** là **phần mềm nội gián**, tên lấy từ chuyện 'Con ngựa thành Troa' — **giả vờ hiền lành** để chui vào máy rồi làm việc xấu."},
        {"t":"list","text":"Tuỳ việc nó làm, trojan có nhiều tên:","items":["`Spyware` (**phần mềm gián điệp**): ăn trộm thông tin rồi chuyển ra ngoài.","`Keylogger`: **ghi lén** những gì em gõ trên bàn phím và bấm chuột.","`Backdoor` (**cửa sau**): tạo tài khoản bí mật để lẻn vào máy bất cứ lúc nào.","`Rootkit`: chiếm **quyền cao nhất**, làm được mọi thứ, kể cả **xoá sạch dấu vết**."]},
        {"t":"h","text":"b) Gây hại thế nào?"},
        {"t":"text","text":"**Virus và worm** thì **lây lan** và gây tác động xấu; còn **trojan** làm **nội gián**. Có khi hại nhẹ (làm khó chịu), nhưng loại 'dữ' rất nguy: **làm hỏng phần mềm khác**, **xoá mất dữ liệu**, hoặc **làm tê liệt** cả máy. Worm rất khó phát hiện vì nạn nhân **bị lừa tự cài**."},
        {"t":"list","text":"Nhiều sâu (worm) từng gây thảm hoạ lớn:","items":["**Sâu Melissa (1999):** thiệt hại **hơn 1 tỉ đô la**.","**Sâu Code Red (2001):** chỉ 10 ngày gây thiệt hại **khoảng 2 tỉ đô la**.","**Sâu WannaCry (2017):** **khoá** dữ liệu trong đĩa cứng rồi **đòi tiền chuộc**."]},
        {"t":"note","text":"Có loại lây ra nhiều máy, biến chúng thành một **đội quân ngầm**; khi có lệnh, tất cả **cùng lúc** truy cập vào một máy chủ làm nó **quá tải, tê liệt** — cách phá này gọi là **tấn công từ chối dịch vụ** (`DOS`)."},
        {"t":"h","text":"c) Cách phòng chống"},
        {"t":"list","items":["**Cẩn thận khi chép và tải:** nhiều **phần mềm bẻ khoá** cho tải miễn phí đã bị cài mã độc cố ý.","**Không mở liên kết lạ:** kể cả thư của **bạn bè** — nếu thấy bảo bấm vào liên kết, tốt nhất **gọi hỏi lại bạn** cho chắc.","**Giữ kín mật khẩu.**","**Dùng phần mềm chống độc hại** để bảo vệ máy."]},
        {"t":"note","text":"**So sánh nhanh.** **Virus:** phải bám vào phần mềm khác, **có** lây, làm hỏng máy/xoá dữ liệu. **Worm:** hoàn chỉnh, **có** lây, có thể làm tê liệt cả hệ thống. **Trojan:** hoàn chỉnh, **ít** lây, chuyên **nội gián** (ăn trộm thông tin, chiếm quyền)."},
        {"t":"h","text":"Thực hành — Chống virus bằng Windows Defender"},
        {"t":"text","text":"Có hàng trăm phần mềm chống virus (Kaspersky, AVG, Avast, McAfee, Norton, hay `BKAV` của Việt Nam). Chúng còn được gọi là **Firewall** (bức tường lửa) vì chặn nguy hiểm từ bên ngoài. **Windows Defender** có **sẵn** trong Windows 10, **tự chạy ngầm** để bảo vệ máy và **tự cập nhật** mẫu virus mới — như một **bác bảo vệ** luôn canh cửa cho ngôi nhà."},
        {"t":"list","text":"Mở `Windows Security` → `Virus & threat protection`. Có 4 kiểu quét:","items":["**Quét nhanh** (`Quick scan`): chỉ quét các thư mục **hay bị** virus.","**Quét hết** (`Full scan`): quét **tất cả** các ổ đĩa.","**Quét theo yêu cầu** (`Custom scan`): chỉ quét **một thư mục** em chọn.","**Quét ngoại tuyến** (`Offline scan`): dành cho người rất giỏi."]},
        {"t":"note","text":"Chọn kiểu quét xong bấm `Scan now` rồi đợi kết quả. Cách nhanh khác: **nháy phải chuột** vào tên thư mục rồi chọn `Scan with Microsoft Defender`."}
      ],
      "keypoints": [
        "Mạng (Internet) rất tiện nhưng đầy cạm bẫy, nên em phải biết tự bảo vệ mình.",
        "5 nguy cơ cần tránh: tin giả, lừa đảo, lộ thông tin cá nhân, bị bắt nạt và nghiện mạng.",
        "Giữ bí mật thông tin cá nhân và mật khẩu; chỉ kết bạn với người quen; chỉ vào web tin cậy; không dùng Internet quá nhiều.",
        "Khi bị bắt nạt: lưu bằng chứng, không tranh luận, kể cho bố mẹ/thầy cô, việc nặng thì báo công an.",
        "Phần mềm độc hại (malware) gồm: **virus** và **worm** (biết tự lây) và **trojan** (nội gián, ăn trộm thông tin/chiếm quyền).",
        "Phòng chống: cẩn thận khi tải và chép, không mở liên kết lạ, giữ kín mật khẩu, dùng phần mềm chống virus (như Windows Defender)."
      ]
    },
    "S10-10": {
      "title": "Bài 10. Thực hành khai thác tài nguyên trên Internet",
      "intro": "Bài này dạy em cách dùng Internet để học tốt hơn. Em sẽ tập hai việc: dùng phần mềm dịch **Google Dịch** để học ngoại ngữ, và vào một 'kho' bài giảng miễn phí trên mạng để tìm tài liệu ôn bài. Đây là bài **thực hành**, em vừa đọc vừa làm theo từng bước nhé.",
      "sections": [
        {"t":"story","text":"Em đang học tiếng Anh và gặp một câu lạ, không hiểu nghĩa. Ngày xưa muốn biết nghĩa phải lật cuốn từ điển thật dày, tra từng từ, rất lâu. Bây giờ thì khác! Trên Internet có một 'người bạn' cực giỏi tên là **Google Dịch**: em gõ câu tiếng Việt vào, chớp mắt nó dịch ngay ra tiếng Anh, còn đọc to lên cho em nghe nữa. Và nếu muốn tìm bài giảng để ôn, Internet cũng có sẵn một 'thư viện' khổng lồ chứa hàng vạn bài học, ai cũng xem được mà không mất tiền. Hôm nay em học cách mở hai kho báu này ra dùng."},
        {"t":"list","text":"Học xong bài này, em sẽ biết cách:","items":["Dùng phần mềm dịch **Google Dịch** để giúp học ngoại ngữ (nghe, nói, đọc, viết).","Vào **kho học liệu mở** trên Internet để tìm bài giảng và tài liệu miễn phí."]},
        {"t":"note","text":"**Tài nguyên trên Internet** là những thứ có ích trên mạng mà em lấy ra dùng được: phần mềm giúp học, bài giảng, sách... Bài này giới thiệu hai thứ rất hữu ích cho việc học."},
        {"t":"h","text":"Việc 1: Dùng Google Dịch để học ngoại ngữ"},
        {"t":"text","text":"**Google Dịch** là phần mềm dịch **đa ngữ** (biết rất nhiều thứ tiếng). Mình làm theo 4 bước."},
        {"t":"text","text":"**Bước 1: Mở trang Google Dịch.** Mở trình duyệt (Chrome hay Cốc Cốc), gõ vào ô địa chỉ `https://translate.google.com/` rồi nhấn Enter. Trang chia làm hai khung: khung **bên trái** để em gõ câu cần dịch, khung **bên phải** hiện bản dịch đã xong."},
        {"t":"text","text":"Hai cái tên nghe hơi lạ nhưng dễ hiểu: **Ngôn ngữ nguồn** là tiếng gốc, câu em gõ vào (khung trái). **Ngôn ngữ đích** là tiếng em muốn đổi sang, tức bản dịch (khung phải). Ví dụ gõ tiếng Việt muốn ra tiếng Anh thì Việt là nguồn, Anh là đích."},
        {"t":"text","text":"**Bước 2: Chọn tiếng.** Nói cho máy biết dịch từ tiếng gì sang tiếng gì: nháy vào mũi tên nhỏ hình chữ V cạnh tên tiếng, rồi chọn thứ tiếng muốn. Ví dụ khung trái chọn **Việt**, khung phải chọn **Anh**."},
        {"t":"list","text":"**Bước 3: Nhập câu cần dịch.** Có 3 cách, thích cách nào dùng cách đó:","items":["**Cách 1 - Gõ bằng bàn phím** (máy bật sẵn nút `Văn bản`). Gõ câu vào khung trái, khung phải hiện bản dịch ngay.","**Cách 2 - Nói bằng miệng** (máy cần có **micro**). Nháy vào hình micro, đọc to câu, máy tự nghe và viết ra chữ.","**Cách 3 - Dịch cả một tệp.** Nháy nút `Tài liệu`, chọn tệp (Word, Excel, PowerPoint hay PDF) rồi nháy `Dịch`."]},
        {"t":"note","text":"Google Dịch còn biết 'nói': nháy vào hình cái **loa** để nghe máy đọc bản dịch — lần thứ nhất tốc độ bình thường, lần thứ hai đọc chậm lại để em nghe rõ từng chữ. Rất hay để tập phát âm."},
        {"t":"text","text":"**Bước 4: Chép kết quả ra để dùng.** Bôi đen chữ ở khung phải, nhấn `Ctrl + C` để sao chép, rồi mở một tệp Word và nhấn `Ctrl + V` để dán vào."},
        {"t":"note","text":"Bản dịch của máy chưa thật mượt, đôi khi dịch nhầm, nên **đừng tin hoàn toàn**. Hãy xem nó như người giúp việc: làm nhanh phần thô, còn em đọc lại và sửa cho đúng, cho hay hơn."},
        {"t":"h","text":"Việc 2: Vào kho học liệu mở để tìm bài giảng"},
        {"t":"text","text":"**Học liệu mở** là bài học, tài liệu đưa lên Internet cho mọi người dùng **miễn phí**. Ở Việt Nam, Bộ Giáo dục và Đào tạo làm một kho chứa hàng vạn bài học tại `https://igiaoduc.vn`."},
        {"t":"text","text":"**Bước 1: Mở trang.** Gõ `https://igiaoduc.vn/` vào ô địa chỉ rồi Enter. Nhìn sang **bên trái** trang sẽ thấy một 'cây thư mục' — giống một cái tủ nhiều ngăn: mở ngăn to ra bên trong lại có ngăn nhỏ hơn, các bài học xếp gọn theo chủ đề."},
        {"t":"list","text":"**Bước 2: Tìm bài học.** Mở dần các ngăn tủ:","items":["Ngăn to nhất có 3 loại: **Học liệu số**, **Sách giáo khoa**, **Dư địa chí**. Nháy dấu `>` bên cạnh để mở ngăn nhỏ hơn.","Nháy vào một mục (ví dụ **Học liệu số**) để mở ngăn nhỏ hơn nữa.","Ở đó các bài chia theo từng **môn học** (Toán, Ngữ văn, Địa lí...); chọn môn là thấy hết bài của môn đó."]},
        {"t":"text","text":"**Bước 3: Xem bài giảng.** Nháy vào **ảnh** của bài muốn học; máy hiện tên bài, chủ đề, tác giả. Nháy nút `Học trực tuyến` để bắt đầu xem. Bài giảng có nhiều dạng: **video** quay cảnh thầy cô giảng, hoặc các trang trình chiếu."},
        {"t":"note","text":"Vậy là em đã có hai công cụ tuyệt vời: **Google Dịch** giúp học ngoại ngữ, và **kho học liệu mở** giúp xem lại bài giảng bất cứ lúc nào. Khi ở nhà chưa hiểu bài, hãy nhớ tới hai người bạn này nhé."}
      ],
      "keypoints": [
        "Trên Internet có nhiều tài nguyên giúp học tập, trong đó có **phần mềm dịch** và **kho học liệu mở**.",
        "**Google Dịch** (`https://translate.google.com/`): khung trái là **ngôn ngữ nguồn** (tiếng gốc), khung phải là **ngôn ngữ đích** (bản dịch).",
        "3 cách nhập câu cần dịch: gõ bằng bàn phím, nói bằng micro, hoặc dịch cả một tệp.",
        "Nháy hình cái **loa** để nghe máy đọc bản dịch (nháy lần hai đọc chậm hơn); bản dịch chỉ để tham khảo, cần đọc lại và sửa.",
        "**Học liệu mở** là bài học miễn phí trên mạng; ở Việt Nam có kho `https://igiaoduc.vn` với hàng vạn học liệu.",
        "Trong kho, bài xếp theo cây thư mục nhiều cấp; nháy `Học trực tuyến` để xem (dạng video hoặc trình chiếu)."
      ]
    }
  };

  ["S10-08", "S10-09", "S10-10"].forEach(function (id) {
    LESSONS.push(Object.assign({ id: id }, META[id], CONTENT[id]));
  });
})();
