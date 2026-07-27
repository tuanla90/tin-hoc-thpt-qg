/* ============================================================================
 *  TỪ ĐIỂN THUẬT NGỮ TIẾNG ANH — 225 từ.
 *  Mỗi từ: { en, say (phiên âm kiểu Việt), vi (nghĩa), gloss (giải thích đời thường) }.
 *  Tệp sinh tự động khi gộp 2 chương trình (gộp vocab-terms + vocab-data + vocab-tin12).
 *  Nạp SAU vocab.js, TRƯỚC vocab-lessons.js.
 * ==========================================================================*/
var VOCAB_TERMS = {
 "data": {
  "en": "data",
  "say": "ĐÂY-tơ (như 'day' + tơ)",
  "vi": "dữ liệu",
  "gloss": "Những con số, chữ, hình còn thô mà máy lưu lại nhưng chưa hiểu ý nghĩa — giống rau củ để trong tủ lạnh, chưa nấu thành món ăn."
 },
 "information": {
  "en": "information",
  "say": "in-phơ-MÂY-sần",
  "vi": "thông tin",
  "gloss": "Dữ liệu đã được xử lí để mình hiểu được — giống món ăn ngon nấu ra từ rau củ trong tủ lạnh."
 },
 "bit": {
  "en": "bit",
  "say": "bít",
  "vi": "bit (đơn vị nhỏ nhất)",
  "gloss": "Một bóng đèn tí hon chỉ có 2 trạng thái: sáng (số 1) hoặc tắt (số 0), không có nấc giữa."
 },
 "byte": {
  "en": "byte",
  "say": "bai (như 'bye')",
  "vi": "byte (8 bit)",
  "gloss": "8 bit gộp lại thành 1 byte — vừa đủ để ghi 1 chữ cái như chữ 'A'."
 },
 "dataunits": {
  "en": "KB · MB · GB · TB",
  "speak": "kilobyte, megabyte, gigabyte, terabyte",
  "say": "KI-lô-bai · MÊ-ga-bai · GHI-ga-bai · TE-ra-bai",
  "vi": "đơn vị đo dung lượng dữ liệu",
  "gloss": "Các đơn vị đo lượng dữ liệu, mỗi đơn vị lớn hơn cái trước khoảng 1000 lần — từ 1 viên kẹo (KB) đến túi kẹo (MB), thùng kẹo (GB), rồi cả kho kẹo (TB)."
 },
 "input": {
  "en": "input",
  "say": "IN-pút",
  "vi": "đầu vào (input)",
  "gloss": "Những gì em đưa vào máy: gõ chữ, bấm chuột... Trong Python, lệnh input() giúp máy chờ em nhập gì đó vào."
 },
 "process": {
  "en": "process",
  "say": "PRÔ-xét",
  "vi": "xử lí (process)",
  "gloss": "Lúc máy âm thầm tính toán, biến đổi dữ liệu bên trong — giống máy đang nhào và nướng bột thành bánh."
 },
 "output": {
  "en": "output",
  "say": "ÁO-pút",
  "vi": "đầu ra (output)",
  "gloss": "Kết quả máy đưa ra cho em thấy hoặc nghe: chữ trên màn hình, tiếng loa, giấy in ra — giống cái bánh thơm lấy ra từ lò."
 },
 "binary": {
  "en": "binary",
  "say": "BAI-nờ-ri",
  "vi": "hệ nhị phân (cơ số 2)",
  "gloss": "Cách đếm chỉ dùng 2 số 0 và 1 — giống một dãy bóng đèn mà mỗi đèn chỉ có thể sáng hoặc tắt."
 },
 "decimal": {
  "en": "decimal",
  "say": "ĐE-xi-mờ",
  "vi": "hệ thập phân (cơ số 10)",
  "gloss": "Cách đếm dùng 10 chữ số từ 0 đến 9, chính là cách mình đếm hằng ngày — như đếm trên 10 đầu ngón tay."
 },
 "ascii": {
  "en": "ASCII",
  "say": "ÁT-ki (như 'ask' + ki)",
  "vi": "bảng mã ASCII",
  "gloss": "Một cuốn từ điển gán mỗi chữ cái, chữ số tiếng Anh với một con số riêng để máy hiểu — ví dụ chữ 'A' là số 65."
 },
 "unicode": {
  "en": "Unicode",
  "say": "IU-ni-cốt",
  "vi": "bảng mã Unicode",
  "gloss": "Một cuốn từ điển khổng lồ, đủ chỗ cho chữ viết của mọi ngôn ngữ, kể cả tiếng Việt có dấu như 'ă, ơ, ư'."
 },
 "rgb": {
  "en": "RGB",
  "say": "rờ-gờ-bờ (Đỏ-Lục-Lam)",
  "vi": "hệ màu RGB (Đỏ–Lục–Lam)",
  "gloss": "Cách pha màu bằng 3 ánh sáng Đỏ, Lục, Lam chiếu chồng lên nhau — giống 3 đèn pin màu trộn ra đủ màu trên màn hình."
 },
 "pixel": {
  "en": "pixel",
  "say": "PÍCH-sồ",
  "vi": "điểm ảnh (pixel)",
  "gloss": "Một ô vuông màu rất nhỏ — ghép hàng ngàn ô như vậy lại thành một bức ảnh, giống ghép nhiều viên gạch màu thành tranh."
 },
 "bitmap": {
  "en": "bitmap",
  "say": "BÍT-mép",
  "vi": "ảnh bitmap (ảnh điểm)",
  "gloss": "Ảnh tạo từ rất nhiều điểm ảnh xếp thành lưới — phóng to quá sẽ thấy vỡ, răng cưa."
 },
 "vector": {
  "en": "vector",
  "say": "VÉC-tơ",
  "vi": "ảnh vector",
  "gloss": "Ảnh vẽ bằng công thức đường nét và hình học, nên phóng to bao nhiêu vẫn mượt, không bị vỡ như ảnh bitmap."
 },
 "png": {
  "en": "PNG",
  "say": "pi-en-chi",
  "vi": "định dạng ảnh PNG",
  "gloss": "Một kiểu tệp lưu ảnh phổ biến, giữ hình rõ nét và có thể làm nền trong suốt — hay dùng cho logo, hình dán."
 },
 "matrix": {
  "en": "matrix",
  "say": "MÂY-trix",
  "vi": "ma trận (bảng số hàng và cột)",
  "gloss": "Một bảng số xếp ngay ngắn theo hàng và cột — giống một bàn cờ ca-rô có nhiều hàng, nhiều cột."
 },
 "ram": {
  "en": "RAM",
  "say": "ram",
  "vi": "bộ nhớ tạm",
  "gloss": "Giống mặt bàn làm việc: máy bày dữ liệu ra đây cho nhanh tay. Tắt máy là bàn bị dọn sạch, dữ liệu mất hết."
 },
 "rom": {
  "en": "ROM",
  "say": "rôm",
  "vi": "bộ nhớ chỉ đọc",
  "gloss": "Giống quyển sổ in chữ sẵn: máy chỉ đọc được, không xoá thêm gì. Không cần điện vẫn nhớ mãi, dùng để cất chỉ dẫn khởi động máy."
 },
 "cpu": {
  "en": "CPU",
  "say": "xi-pi-diu",
  "vi": "bộ xử lí trung tâm",
  "gloss": "Là 'bộ não' của máy tính — mọi phép tính, mọi lệnh chạy chương trình đều do đây lo hết."
 },
 "gpu": {
  "en": "GPU",
  "say": "gi-pi-diu",
  "vi": "bộ xử lí đồ hoạ",
  "gloss": "Giống một hoạ sĩ riêng trong máy, chuyên vẽ hình ảnh để phim, trò chơi hiện lên mượt và đẹp."
 },
 "alu": {
  "en": "ALU",
  "say": "a-lờ-u",
  "vi": "bộ số học và lôgic",
  "gloss": "Là 'bạn chuyên làm toán' bên trong CPU — mọi phép cộng, trừ và so sánh đúng-sai đều do đây làm."
 },
 "usb": {
  "en": "USB",
  "say": "u-ét-bê",
  "vi": "chuẩn cổng cắm đa năng",
  "gloss": "Kiểu cổng cắm đa năng nhất trên máy — chuột, bàn phím, USB nhớ, máy ảnh... cắm vào đều vừa."
 },
 "ssd": {
  "en": "SSD",
  "say": "ét-ét-đi",
  "vi": "ổ cứng thể rắn",
  "gloss": "Nơi lưu dữ liệu lâu dài, nhanh nhất trong các loại ổ đĩa vì bên trong không có gì quay tròn như ổ cứng thường."
 },
 "cd": {
  "en": "CD",
  "say": "xi-đi",
  "vi": "đĩa quang CD",
  "gloss": "Cái đĩa tròn sáng bóng dùng lưu nhạc, phim hay dữ liệu, đọc bằng một tia sáng nhỏ."
 },
 "dvd": {
  "en": "DVD",
  "say": "đi-vi-đi",
  "vi": "đĩa quang DVD",
  "gloss": "Giống đĩa CD nhưng chứa được nhiều hơn, nên thường dùng để lưu cả một bộ phim dài."
 },
 "vga": {
  "en": "VGA",
  "say": "vi-ga",
  "vi": "cổng nối màn hình VGA",
  "gloss": "Cổng nối máy tính với màn hình hay máy chiếu kiểu cũ, chỉ truyền được hình, không truyền tiếng."
 },
 "hdmi": {
  "en": "HDMI",
  "say": "hát-đi-em-ai",
  "vi": "cổng truyền hình ảnh và âm thanh",
  "gloss": "Cổng hiện đại nối máy với màn hình hay tivi, truyền được cả hình và tiếng cùng lúc, hình rất nét."
 },
 "network": {
  "en": "network",
  "say": "NÉT-guốc",
  "vi": "mạng máy tính",
  "gloss": "Nhiều máy tính được nối lại để cùng gửi thông tin cho nhau — giống một nhóm bạn chuyền tay mẩu giấy trong lớp."
 },
 "internet": {
  "en": "Internet",
  "say": "IN-tơ-nét",
  "vi": "mạng Internet toàn cầu",
  "gloss": "Khi tất cả những mạng nhỏ trên khắp thế giới nối chung lại thành một mạng khổng lồ, bao trùm cả Trái Đất."
 },
 "lan": {
  "en": "LAN",
  "say": "lan",
  "vi": "mạng cục bộ",
  "gloss": "Mạng gói gọn trong một chỗ nhỏ, như trong một nhà, một lớp hay một trường học."
 },
 "wan": {
  "en": "WAN",
  "say": "oan",
  "vi": "mạng diện rộng",
  "gloss": "Mạng nối nhiều mạng LAN hay nhiều máy ở xa nhau lại, nên trải ra một vùng rất rộng."
 },
 "hub": {
  "en": "hub",
  "say": "hấp",
  "vi": "bộ chia (hub)",
  "gloss": "Thiết bị nối nhiều máy vào mạng, nhưng hễ có tin đến là phát cho tất cả cùng nghe, dù chỉ một máy cần."
 },
 "switch": {
  "en": "switch",
  "say": "xuých",
  "vi": "bộ chuyển mạch",
  "gloss": "Cũng nối nhiều máy như hub, nhưng khôn hơn: giống bác đưa thư biết đúng nhà, chỉ đưa tin cho đúng máy cần."
 },
 "router": {
  "en": "router",
  "say": "RAU-tơ",
  "vi": "bộ định tuyến",
  "gloss": "Thiết bị nối mạng nhà em với Internet, biết đường đưa thông tin đi đúng chỗ — giống bưu điện chuyển thư đi xa."
 },
 "modem": {
  "en": "modem",
  "say": "MÔ-đem",
  "vi": "thiết bị kết nối Internet",
  "gloss": "Thiết bị nối nhà em với nhà cung cấp Internet — giống cây cầu nhỏ bắc từ nhà ra con đường lớn bên ngoài."
 },
 "protocol": {
  "en": "protocol",
  "say": "PRÔ-tô-côn",
  "vi": "giao thức",
  "gloss": "Bộ luật chung để các máy 'nói chuyện' hiểu nhau — giống luật chơi mà ai cũng phải theo khi chơi chung một trò."
 },
 "tcp": {
  "en": "TCP",
  "say": "ti-xi-pi",
  "vi": "giao thức TCP",
  "gloss": "Chia dữ liệu lớn thành nhiều gói nhỏ có đánh số, gửi đi rồi ghép lại đúng thứ tự — như xếp lại các trang truyện bị xáo cho đúng chỗ."
 },
 "ip": {
  "en": "IP",
  "say": "ai-pi",
  "vi": "địa chỉ IP",
  "gloss": "Là 'số nhà' riêng của mỗi máy trên mạng, để các máy khác biết gửi thông tin đến đúng chỗ."
 },
 "wifi": {
  "en": "Wi-Fi",
  "say": "OAI-phai",
  "vi": "mạng không dây",
  "gloss": "Cách nối máy vào Internet mà không cần dây, bằng sóng — giống sóng radio vậy."
 },
 "bluetooth": {
  "en": "Bluetooth",
  "say": "BLU-tút",
  "vi": "kết nối không dây tầm gần",
  "gloss": "Cách nối không dây ở khoảng cách gần, dưới 10 mét — giống hai bạn nói chuyện qua bộ đàm."
 },
 "rfid": {
  "en": "RFID",
  "say": "rờ-ép-ai-đi",
  "vi": "nhận dạng bằng sóng vô tuyến",
  "gloss": "Nhận ra thẻ hay đồ vật từ xa bằng sóng radio — giống thẻ dán trên kính xe giúp tự trừ phí khi qua trạm mà không cần dừng."
 },
 "http": {
  "en": "HTTP",
  "say": "hắt-tê-tê-pê",
  "vi": "giao thức tải trang web",
  "gloss": "Quy tắc giúp trình duyệt 'xin' trang web từ máy chủ rồi mang về cho em xem — giống mẫu đơn xin chung mà máy nào cũng hiểu."
 },
 "https": {
  "en": "HTTPS",
  "say": "hắt-tê-tê-pê-ét",
  "vi": "giao thức tải web có bảo mật",
  "gloss": "Vẫn là HTTP nhưng có thêm 'khoá bí mật' mã hoá thông tin trên đường truyền, nên kẻ xấu bắt được cũng chỉ thấy chữ lộn xộn."
 },
 "url": {
  "en": "URL",
  "say": "u-a-lờ",
  "vi": "địa chỉ trang web",
  "gloss": "Dòng chữ em gõ vào trình duyệt để đến đúng một trang web — giống địa chỉ nhà, mỗi trang chỉ có một, không trùng ai."
 },
 "dns": {
  "en": "DNS",
  "say": "đê-en-ét",
  "vi": "hệ thống phân giải tên miền",
  "gloss": "Giống sổ danh bạ: em gõ tên web dễ nhớ, DNS tra giúp ra đúng 'số nhà' thật của nó là địa chỉ IP."
 },
 "browser": {
  "en": "browser",
  "say": "BRAO-zơ",
  "vi": "trình duyệt web",
  "gloss": "Phần mềm em mở lên để xem các trang web, như Chrome hay Cốc Cốc — giống cửa sổ để nhìn ra thế giới Internet."
 },
 "server": {
  "en": "server",
  "say": "SƠ-vơ",
  "vi": "máy chủ",
  "gloss": "Máy tính lớn luôn bật, chứa dữ liệu cho máy khác xin về — như 'nhà kho chung' của Internet."
 },
 "website": {
  "en": "website",
  "say": "QUÉP-sai",
  "vi": "trang web",
  "gloss": "Một 'ngôi nhà nhỏ' trên Internet, có địa chỉ riêng để ai cũng ghé vào xem được."
 },
 "web": {
  "en": "web",
  "say": "QUÉP",
  "vi": "mạng lưới các trang web",
  "gloss": "Cả một 'thành phố' khổng lồ gồm hàng tỉ trang web nối nhau bằng các đường link, ai cũng dạo quanh được."
 },
 "email": {
  "en": "email",
  "say": "I-meo",
  "vi": "thư điện tử",
  "gloss": "Lá thư gửi qua Internet, viết xong bấm nút là tới nơi ngay, không cần dán tem như thư giấy."
 },
 "cloud": {
  "en": "cloud",
  "say": "CLAO",
  "vi": "đám mây (lưu trữ trực tuyến)",
  "gloss": "Dữ liệu lưu trên Internet thay vì trong máy nhà, nên ở đâu có mạng em cũng lấy lại được — như gửi đồ vào kho thần kỳ trên mây."
 },
 "software": {
  "en": "software",
  "say": "SÓP-que",
  "vi": "phần mềm",
  "gloss": "Các chương trình chạy bên trong máy, như phần mềm học bài hay trò chơi — thấy nó chạy nhưng không sờ được."
 },
 "hardware": {
  "en": "hardware",
  "say": "HÁT-que",
  "vi": "phần cứng",
  "gloss": "Các bộ phận sờ được của máy như màn hình, bàn phím, con chuột — khác với phần mềm vô hình bên trong."
 },
 "opensource": {
  "en": "open source",
  "say": "ÂU-pừn SỌT",
  "vi": "phần mềm nguồn mở",
  "gloss": "Phần mềm mà ai cũng được xem 'công thức' bên trong và sửa lại cho tốt hơn — giống công thức nấu ăn chia sẻ miễn phí."
 },
 "gnu": {
  "en": "GNU",
  "say": "gờ-en-diu",
  "vi": "dự án phần mềm tự do GNU",
  "gloss": "Một dự án làm ra phần mềm miễn phí, ai cũng được xem, sửa và chia sẻ mã nguồn — giống món đồ chơi chung ai cũng chỉnh sửa được."
 },
 "gpl": {
  "en": "GPL",
  "say": "gờ-pi-eo",
  "vi": "giấy phép phần mềm tự do",
  "gloss": "Một loại giấy phép đi kèm phần mềm, cho phép mọi người tự do dùng, xem và sửa mã nguồn, miễn là chia sẻ lại theo cách tương tự."
 },
 "malware": {
  "en": "malware",
  "say": "MẮN-quơ",
  "vi": "phần mềm độc hại (mã độc)",
  "gloss": "Tên gọi chung cho các phần mềm xấu tạo ra để phá máy, lấy cắp thông tin hoặc quấy phá người dùng."
 },
 "virus": {
  "en": "virus",
  "say": "VAI-rớt",
  "vi": "virus máy tính",
  "gloss": "Chương trình xấu tự lây từ máy này sang máy khác và phá hỏng dữ liệu — giống con vi trùng gây bệnh."
 },
 "firewall": {
  "en": "firewall",
  "say": "FAI-wôn",
  "vi": "tường lửa",
  "gloss": "Phần mềm hoặc thiết bị canh giữa máy và Internet, chặn kẻ xấu hoặc dữ liệu nguy hiểm đi vào — giống bức tường bảo vệ ngôi nhà."
 },
 "password": {
  "en": "password",
  "say": "PẮT-wợt",
  "vi": "mật khẩu",
  "gloss": "Dãy chữ và số bí mật để mở khoá tài khoản hoặc thiết bị, chỉ mình biết — giống chìa khoá bí mật riêng của em."
 },
 "hacker": {
  "en": "hacker",
  "say": "HẮC-cơ",
  "vi": "tin tặc",
  "gloss": "Người rất giỏi máy tính, tìm cách lẻn vào máy hoặc mạng của người khác mà không được cho phép."
 },
 "spam": {
  "en": "spam",
  "say": "xờ-PAM",
  "vi": "thư rác",
  "gloss": "Thư hoặc tin nhắn quảng cáo, làm phiền, gửi ào ạt tới rất nhiều người mà họ không muốn nhận — giống rác chất đầy hộp thư."
 },
 "phishing": {
  "en": "phishing",
  "say": "PHÍCH-sinh",
  "vi": "lừa đảo giả mạo qua mạng",
  "gloss": "Kẻ xấu giả làm ngân hàng, bạn bè hay web quen để dụ em bấm link hoặc khai mật khẩu — giống thả câu để dụ cá cắn."
 },
 "otp": {
  "en": "OTP",
  "say": "âu-ti-pi",
  "vi": "mã xác thực dùng một lần",
  "gloss": "Mã số gồm vài chữ số, chỉ dùng được một lần, gửi qua điện thoại để xác nhận đúng là em khi đăng nhập hoặc thanh toán."
 },
 "dos": {
  "en": "DoS",
  "speak": "D O S",
  "say": "đi-âu-ét",
  "vi": "tấn công từ chối dịch vụ",
  "gloss": "Kiểu tấn công gửi cực nhiều yêu cầu tới một web cùng lúc làm nó quá tải và sập — giống quá nhiều người chen cùng lúc qua một cửa nhỏ."
 },
 "copyright": {
  "en": "copyright",
  "say": "CÓP-pi-rai",
  "vi": "bản quyền",
  "gloss": "Quyền của người tạo ra sách, nhạc, ảnh, phần mềm... được pháp luật bảo vệ; người khác muốn dùng phải xin phép hoặc trả tiền."
 },
 "sql": {
  "en": "SQL",
  "say": "ét-qui-eo",
  "vi": "ngôn ngữ truy vấn cơ sở dữ liệu",
  "gloss": "Ngôn ngữ đặc biệt dùng để hỏi và lấy thông tin từ những kho dữ liệu lớn — giống cách em hỏi thủ thư tìm đúng cuốn sách cần."
 },
 "ai": {
  "en": "AI",
  "say": "ây-ai",
  "vi": "trí tuệ nhân tạo",
  "gloss": "Máy tính được 'dạy' để học hỏi và tự đưa ra quyết định giống con người, ví dụ nhận diện khuôn mặt, trả lời câu hỏi."
 },
 "iot": {
  "en": "IoT",
  "say": "ai-âu-ti",
  "vi": "Internet vạn vật",
  "gloss": "Các đồ vật hằng ngày như tủ lạnh, đèn, đồng hồ được nối mạng Internet, điều khiển từ xa qua điện thoại."
 },
 "inkscape": {
  "en": "Inkscape",
  "say": "INH-két",
  "vi": "phần mềm vẽ ảnh vector",
  "gloss": "Phần mềm miễn phí để vẽ hình bằng đường nét toán học, nên phóng to hình vẽ vẫn nét căng, không mờ."
 },
 "gimp": {
  "en": "GIMP",
  "say": "GHIM-pờ",
  "vi": "phần mềm sửa ảnh miễn phí",
  "gloss": "Phần mềm miễn phí để chỉnh sửa ảnh: cắt ghép, đổi màu, xoá phông — giống Photoshop nhưng không mất tiền."
 },
 "python": {
  "en": "Python",
  "say": "PAI-thần",
  "vi": "ngôn ngữ lập trình Python",
  "gloss": "Một ngôn ngữ lập trình dễ học, đặt theo tên loài trăn. Em dùng nó để viết các câu lệnh cho máy làm theo."
 },
 "ide": {
  "en": "IDE",
  "say": "ai-đi-i",
  "speak": "I D E",
  "vi": "phần mềm lập trình (IDE)",
  "gloss": "Phần mềm để em gõ code vào rồi bấm nút là chạy thử ngay — giống vừa có vở để viết, vừa có cô giáo chấm bài tại chỗ."
 },
 "syntax": {
  "en": "syntax",
  "say": "SIN-tăx",
  "vi": "cú pháp",
  "gloss": "Luật viết đúng của ngôn ngữ lập trình, giống ngữ pháp viết câu. Viết sai cú pháp thì máy không hiểu và báo lỗi."
 },
 "bug": {
  "en": "bug",
  "say": "bấc",
  "vi": "lỗi (bug)",
  "gloss": "Chỗ chương trình bị sai hoặc chạy không đúng ý em. Người ta gọi vui lỗi là 'con bọ' núp trong code."
 },
 "debug": {
  "en": "debug",
  "say": "đi-BẤC",
  "vi": "gỡ lỗi",
  "gloss": "Đi tìm con bọ (lỗi) đang trốn trong chương trình rồi sửa cho code chạy đúng — như tìm chỗ sai trong bài toán rồi sửa lại."
 },
 "test": {
  "en": "test",
  "say": "tét",
  "vi": "kiểm thử",
  "gloss": "Chạy thử chương trình xem có đúng như em muốn không — giống kiểm tra lại bài làm trước khi nộp cho cô."
 },
 "comment": {
  "en": "comment",
  "say": "CÒM-men-tờ",
  "vi": "chú thích",
  "gloss": "Dòng chữ em viết thêm để giải thích code, máy bỏ qua không chạy — giống ghi chú nhỏ bên lề vở để nhắc mình."
 },
 "variable": {
  "en": "variable",
  "say": "VE-ri-ơ-bồ",
  "vi": "biến",
  "gloss": "Một cái hộp có tên, dùng để chứa một giá trị. Em có thể thay đổi thứ trong hộp bất cứ lúc nào, ví dụ hộp 'tuoi' chứa số 10."
 },
 "function": {
  "en": "function",
  "say": "PHẮNG-sần",
  "vi": "hàm",
  "gloss": "Một 'cỗ máy nhỏ' lắp sẵn để làm một việc cụ thể. Em chỉ cần gọi tên nó ra là nó tự làm, không cần viết lại từ đầu."
 },
 "list": {
  "en": "list",
  "say": "lít",
  "vi": "danh sách",
  "gloss": "Một dãy nhiều giá trị xếp hàng, giống hộp bút có nhiều ô. Các ô được đánh số bắt đầu từ 0, không phải từ 1."
 },
 "dict": {
  "en": "dict",
  "say": "đíc-tờ",
  "vi": "từ điển (dictionary)",
  "gloss": "Nơi chứa nhiều cặp 'khoá và giá trị' đi cùng nhau. Em tra theo khoá để lấy giá trị, không cần nhớ số thứ tự."
 },
 "string": {
  "en": "string",
  "say": "xì-trinh",
  "vi": "chuỗi (xâu kí tự)",
  "gloss": "Một xâu các chữ cái, số hoặc kí hiệu viết trong dấu nháy. Ví dụ 'Xin chao' là một string."
 },
 "for": {
  "en": "for",
  "say": "pho",
  "vi": "vòng lặp for",
  "gloss": "Lệnh bảo máy làm đi làm lại một việc đúng số lần — như đếm từ 1 đến 10."
 },
 "while": {
  "en": "while",
  "say": "quai(-lờ)",
  "vi": "vòng lặp while",
  "gloss": "Lệnh bảo máy lặp lại một việc chừng nào điều kiện còn đúng, hết đúng thì dừng — như 'còn đói thì còn ăn, no rồi thì thôi'."
 },
 "if": {
  "en": "if",
  "say": "íp",
  "vi": "câu lệnh rẽ nhánh if",
  "gloss": "Lệnh kiểm tra một điều kiện, nếu đúng thì máy mới làm việc bên trong — như 'nếu trời mưa thì mang ô đi học'."
 },
 "elif": {
  "en": "elif",
  "say": "e-LÍP",
  "speak": "ee lif",
  "vi": "nhánh elif (nếu-không-thì-nếu)",
  "gloss": "Dùng ngay sau if, để kiểm tra thêm một điều kiện khác khi if ở trên sai — như 'nếu không mưa thì xem có nắng to không'."
 },
 "else": {
  "en": "else",
  "say": "e(-lờ)-xờ",
  "vi": "nhánh else (còn-không-thì)",
  "gloss": "Nói trường hợp còn lại, khi các if và elif ở trên đều sai — như 'còn không thì mặc áo bình thường đi học'."
 },
 "def": {
  "en": "def",
  "say": "đép",
  "vi": "khai báo hàm (def)",
  "gloss": "Từ khoá để bắt đầu tạo một hàm mới, như treo tấm bảng 'bắt đầu công thức'. Sau def là tên hàm do em đặt."
 },
 "return": {
  "en": "return",
  "say": "ri-TƠN",
  "vi": "lệnh trả về (return)",
  "gloss": "Lệnh đưa kết quả từ trong hàm ra ngoài để dùng tiếp — như đưa món ăn nấu xong ra khỏi bếp để mang lên bàn."
 },
 "print": {
  "en": "print",
  "say": "pơ-rin-tờ",
  "vi": "lệnh in ra màn hình (print)",
  "gloss": "Lệnh in kết quả ra màn hình cho em nhìn thấy. Hầu như ai học Python cũng dùng nó đầu tiên, ví dụ in chữ 'Xin chao'."
 },
 "range": {
  "en": "range",
  "say": "rên-chờ",
  "vi": "hàm tạo dãy số (range)",
  "gloss": "Tạo ra một dãy số liên tiếp để dùng cho vòng lặp for. Ví dụ range(5) tạo ra các số 0, 1, 2, 3, 4."
 },
 "len": {
  "en": "len",
  "say": "len",
  "vi": "hàm lấy độ dài (len)",
  "gloss": "Cho biết một danh sách hay xâu chữ có bao nhiêu phần tử. Ví dụ len('meo') cho ra số 3."
 },
 "append": {
  "en": "append",
  "say": "ơ-PEN-đờ",
  "vi": "thêm phần tử vào cuối danh sách",
  "gloss": "Thêm một phần tử mới vào cuối một danh sách đang có — như xếp thêm một bạn vào cuối hàng đang đứng."
 },
 "int": {
  "en": "int",
  "say": "in-tờ",
  "vi": "kiểu số nguyên (int)",
  "gloss": "Số nguyên, tức là số không có phần thập phân, ví dụ 5 hoặc -2. Dùng cho những số đếm được, tròn trịa."
 },
 "float": {
  "en": "float",
  "say": "phơ-lốt",
  "vi": "kiểu số thực (float)",
  "gloss": "Số thực, là số có phần thập phân, ví dụ 3.14 hoặc 0.5. Dùng khi số có phần lẻ sau dấu chấm."
 },
 "str": {
  "en": "str",
  "say": "xì-tơ",
  "speak": "stir",
  "vi": "kiểu chuỗi (str)",
  "gloss": "Kiểu chuỗi chữ trong Python, dùng cho đoạn chữ viết trong dấu nháy. Ví dụ 'Xin chao' có kiểu là str."
 },
 "bool": {
  "en": "bool",
  "say": "bu(-lờ)",
  "vi": "kiểu lôgic (bool)",
  "gloss": "Kiểu lôgic, chỉ có hai giá trị True (Đúng) hoặc False (Sai) — giống công tắc chỉ có bật hoặc tắt, không nửa vời."
 },
 "boolean": {
  "en": "Boolean",
  "say": "BU-li-ơn",
  "vi": "kiểu lôgic Boole",
  "gloss": "Tên đầy đủ của kiểu lôgic (Đúng/Sai), lấy theo tên nhà toán học Boole. Trong Python thường viết tắt là bool."
 },
 "index": {
  "en": "index",
  "say": "IN-đéc",
  "vi": "chỉ số",
  "gloss": "Số thứ tự của một phần tử. Máy đếm bắt đầu từ 0, như ngăn tủ đầu tiên được gọi là ngăn số 0."
 },
 "key": {
  "en": "key",
  "say": "ki",
  "vi": "khoá",
  "gloss": "Cái 'tên' dùng để tra ra giá trị — giống tên bạn trong sổ liên lạc, dùng để tìm ra số điện thoại."
 },
 "value": {
  "en": "value",
  "say": "VA-liu",
  "vi": "giá trị",
  "gloss": "Thông tin đi kèm với một khoá — giống số điện thoại đi kèm với cái tên trong sổ liên lạc."
 },
 "tuple": {
  "en": "tuple",
  "say": "TU-pồ",
  "vi": "bộ (tuple)",
  "gloss": "Giống danh sách, nhưng tạo xong thì không sửa được nữa — như dãy số đã in sẵn trên vé số, không thể tẩy sửa."
 },
 "set": {
  "en": "set",
  "say": "sét",
  "vi": "tập hợp",
  "gloss": "Một nhóm phần tử mà không ai được trùng ai — như hộp kẹo mà mỗi vị chỉ có đúng một viên duy nhất."
 },
 "operator": {
  "en": "operator",
  "say": "OP-ơ-rây-tơ",
  "vi": "toán tử",
  "gloss": "Dấu dùng để tính toán hoặc so sánh hai giá trị. Ví dụ dấu + để cộng hai số lại với nhau."
 },
 "modulo": {
  "en": "modulo",
  "say": "MÔ-đu-lô",
  "vi": "phép chia lấy phần dư",
  "gloss": "Phép chia nhưng chỉ lấy phần dư, bỏ phần nguyên. Như chia 7 cái bánh cho 2 bạn, mỗi bạn 3 cái, dư đúng 1 cái."
 },
 "loop": {
  "en": "loop",
  "say": "lúp",
  "vi": "vòng lặp",
  "gloss": "Bảo máy làm lại một việc nhiều lần — giống em chạy nhiều vòng quanh sân trường."
 },
 "array": {
  "en": "array",
  "say": "ơ-RÂY",
  "vi": "mảng",
  "gloss": "Dãy các ô chứa dữ liệu cùng loại, xếp liền nhau và được đánh số — như dãy ô để giày ở cửa lớp, mỗi ô một số."
 },
 "recursion": {
  "en": "recursion",
  "say": "ri-CƠ-sần",
  "vi": "đệ quy",
  "gloss": "Một hàm tự gọi lại chính nó để giải bài toán nhỏ hơn — giống búp bê Nga: mở ra lại thấy một búp bê giống vậy nhưng nhỏ hơn."
 },
 "stack": {
  "en": "stack",
  "say": "xờ-TẮC",
  "vi": "ngăn xếp",
  "gloss": "Cách chứa dữ liệu kiểu 'vào sau ra trước' — giống chồng đĩa: đĩa đặt lên sau cùng lại được lấy ra trước tiên."
 },
 "queue": {
  "en": "queue",
  "say": "kiu",
  "vi": "hàng đợi",
  "gloss": "Dãy dữ liệu 'vào trước ra trước' — y như xếp hàng mua vé, ai đến trước được trước."
 },
 "search": {
  "en": "search",
  "say": "XƠ-chờ",
  "vi": "tìm kiếm",
  "gloss": "Đi tìm xem một phần tử có trong dãy hay không — giống tìm một cuốn sách trên giá sách đầy ắp."
 },
 "sort": {
  "en": "sort",
  "say": "xọt",
  "vi": "sắp xếp",
  "gloss": "Xếp các phần tử theo thứ tự tăng hoặc giảm — như xếp các bạn trong lớp theo chiều cao từ thấp đến cao."
 },
 "node": {
  "en": "node",
  "say": "nốt",
  "vi": "nút",
  "gloss": "Một điểm trong cây hoặc mạng lưới — giống một trạm dừng trên bản đồ các tuyến xe buýt."
 },
 "algorithm": {
  "en": "algorithm",
  "say": "AL-gô-rít-thầm",
  "vi": "thuật toán",
  "gloss": "Các bước làm một việc theo đúng thứ tự để ra kết quả — như công thức pha mì gói: đổ nước sôi, chờ 3 phút, rồi ăn."
 },
 "and": {
  "en": "AND",
  "speak": "and",
  "say": "EN-đờ",
  "vi": "phép và (AND)",
  "gloss": "Chỉ đúng khi CẢ HAI điều kiện cùng đúng — như em chỉ được đi chơi khi vừa làm xong bài tập VÀ vừa dọn xong phòng."
 },
 "or": {
  "en": "OR",
  "speak": "or",
  "say": "O-rờ",
  "vi": "phép hoặc (OR)",
  "gloss": "Đúng khi chỉ cần MỘT điều kiện đúng thôi — như em được ăn kem khi ngoan HOẶC khi hôm nay là sinh nhật."
 },
 "not": {
  "en": "NOT",
  "speak": "not",
  "say": "nót",
  "vi": "phép phủ định (NOT)",
  "gloss": "Đảo ngược đúng thành sai, sai thành đúng — giống công tắc đèn: đang sáng, bấm NOT một cái là tắt ngay."
 },
 "xor": {
  "en": "XOR",
  "speak": "ex or",
  "say": "ẾCH-o-rờ",
  "vi": "phép hoặc loại trừ (XOR)",
  "gloss": "Đúng khi hai thứ KHÁC nhau, sai khi hai thứ GIỐNG nhau — như hai công tắc: bật khác nhau thì đèn sáng, giống nhau thì đèn tối."
 },
 "file": {
  "en": "file",
  "say": "phai (như 'phai màu')",
  "vi": "tệp tin",
  "gloss": "Một 'gói' dữ liệu có tên lưu trong máy — như một tờ giấy hay cuốn vở đã ghi chép."
 },
 "folder": {
  "en": "folder",
  "say": "PHÂU-đờ",
  "vi": "thư mục",
  "gloss": "Chỗ gom nhiều tệp lại cho gọn — giống cái cặp đựng nhiều tờ giấy."
 },
 "pdf": {
  "en": "PDF",
  "say": "pi-đi-ép",
  "vi": "tệp tài liệu PDF",
  "gloss": "Một kiểu tệp tài liệu giữ nguyên cách trình bày, mở ở máy nào cũng giống nhau."
 },
 "account": {
  "en": "account",
  "say": "ơ-KAO",
  "vi": "tài khoản",
  "gloss": "'Chỗ riêng' của em trên một trang web, đăng nhập bằng tên và mật khẩu."
 },
 "database": {
  "en": "database",
  "say": "ĐÊI-tơ-bêi",
  "vi": "cơ sở dữ liệu (CSDL)",
  "gloss": "Một kho chứa dữ liệu được sắp xếp gọn gàng để tìm và dùng lại dễ dàng — như thư viện xếp sách theo thứ tự."
 },
 "dbms": {
  "en": "DBMS",
  "say": "đi-bi-em-ét",
  "vi": "hệ quản trị cơ sở dữ liệu",
  "gloss": "Phần mềm giúp tạo, lưu và quản lí cơ sở dữ liệu — giống người thủ thư trông coi cả thư viện."
 },
 "table": {
  "en": "table",
  "say": "TÂY-bồ",
  "vi": "bảng (trong CSDL)",
  "gloss": "Nơi chứa dữ liệu theo hàng và cột — giống bảng điểm của lớp: mỗi hàng một bạn, mỗi cột một thông tin."
 },
 "record": {
  "en": "record",
  "say": "RE-cợt",
  "vi": "bản ghi (một hàng)",
  "gloss": "Một hàng trong bảng, chứa đủ thông tin của một đối tượng — như dòng ghi tên, tuổi, lớp của một bạn."
 },
 "field": {
  "en": "field",
  "say": "phin(-đờ)",
  "vi": "trường (một cột)",
  "gloss": "Một cột trong bảng, cho biết một loại thông tin — như cột 'Họ tên' hay cột 'Điểm'."
 },
 "query": {
  "en": "query",
  "say": "KUÊ-ri",
  "vi": "truy vấn",
  "gloss": "Câu hỏi gửi cho cơ sở dữ liệu để lấy đúng dữ liệu cần — như hỏi 'cho xem những bạn điểm trên 8'."
 },
 "primarykey": {
  "en": "primary key",
  "say": "PRAI-mơ-ri ki",
  "vi": "khoá chính",
  "gloss": "Cột dùng để phân biệt mỗi hàng, không ai trùng ai — như số báo danh riêng của mỗi học sinh."
 },
 "foreignkey": {
  "en": "foreign key",
  "say": "PHO-rìn ki",
  "vi": "khoá ngoài",
  "gloss": "Cột dùng để nối bảng này với bảng kia — như số lớp trong bảng học sinh chỉ sang bảng danh sách lớp."
 },
 "relational": {
  "en": "relational",
  "say": "ri-LÂY-sần-nồ",
  "vi": "(CSDL) quan hệ",
  "gloss": "Kiểu cơ sở dữ liệu chia dữ liệu thành nhiều bảng rồi nối với nhau, nhờ vậy đỡ ghi trùng, dễ quản lí."
 },
 "select": {
  "en": "SELECT",
  "say": "si-LẾCH",
  "vi": "lệnh SQL lấy dữ liệu",
  "gloss": "Lệnh SQL để 'chọn ra' dữ liệu cần xem từ bảng — như bảo 'lấy cho tôi cột tên và điểm'."
 },
 "insert": {
  "en": "INSERT",
  "say": "in-SƠT",
  "vi": "lệnh SQL thêm dữ liệu",
  "gloss": "Lệnh SQL để thêm một hàng dữ liệu mới vào bảng — như ghi thêm một bạn vào danh sách."
 },
 "update": {
  "en": "UPDATE",
  "say": "ẤP-đêi",
  "vi": "lệnh SQL sửa dữ liệu",
  "gloss": "Lệnh SQL để sửa lại dữ liệu đã có trong bảng — như đổi lại điểm cho đúng."
 },
 "delete": {
  "en": "DELETE",
  "say": "đi-LÍT",
  "vi": "lệnh SQL xoá dữ liệu",
  "gloss": "Lệnh SQL để xoá một hàng dữ liệu khỏi bảng — như xoá tên một bạn đã chuyển trường."
 },
 "module": {
  "en": "module",
  "say": "MÔ-điu",
  "vi": "mô đun",
  "gloss": "Một phần chương trình tách riêng làm một việc, để lắp ghép lại — như từng khối LEGO ghép thành mô hình lớn."
 },
 "library": {
  "en": "library",
  "say": "LAI-brơ-ri",
  "vi": "thư viện (lập trình)",
  "gloss": "Bộ sưu tập các hàm viết sẵn để dùng lại, khỏi viết từ đầu — như mượn dụng cụ có sẵn trong kho thay vì tự làm."
 },
 "bigo": {
  "en": "Big-O",
  "say": "bích-ô",
  "vi": "độ phức tạp (kí hiệu O lớn)",
  "gloss": "Cách ước lượng chương trình chạy nhanh hay chậm khi dữ liệu to lên — càng 'O lớn' thì càng lâu."
 },
 "machinelearning": {
  "en": "machine learning",
  "say": "mơ-sin lơ-ninh",
  "vi": "học máy",
  "gloss": "Là cách cho máy tính tự học từ thật nhiều ví dụ. Giống em nhìn nhiều con mèo rồi tự biết đâu là mèo; máy xem càng nhiều thì đoán càng giỏi."
 },
 "simulation": {
  "en": "simulation",
  "say": "si-miu-lây-sần",
  "vi": "mô phỏng",
  "gloss": "Là dùng máy tính bắt chước một việc có thật để thử trước. Giống trò chơi lái máy bay giả nhưng giống y như thật, tập mà không sợ hỏng."
 },
 "datascience": {
  "en": "data science",
  "say": "đây-tơ sai-ơns",
  "vi": "khoa học dữ liệu",
  "gloss": "Là môn tìm hiểu thật nhiều số liệu để rút ra điều hay. Giống em xem điểm cả lớp rồi biết môn nào các bạn học giỏi nhất."
 },
 "bigdata": {
  "en": "big data",
  "say": "bích đây-tơ",
  "vi": "dữ liệu lớn",
  "gloss": "Là lượng thông tin khổng lồ, nhiều đến mức đếm bằng tay không xuể. Giống gộp hết ảnh và tin nhắn của mọi người trên mạng lại với nhau."
 },
 "volume5v": {
  "en": "Volume",
  "say": "vô-lium",
  "vi": "khối lượng dữ liệu",
  "gloss": "Nói về việc dữ liệu nhiều hay ít. Giống hỏi trong kho có bao nhiêu món đồ; dữ liệu lớn thì kho chứa cực kỳ nhiều."
 },
 "velocity5v": {
  "en": "Velocity",
  "say": "vơ-lô-si-ti",
  "vi": "tốc độ dữ liệu",
  "gloss": "Nói về việc dữ liệu chạy tới nhanh cỡ nào. Giống tin nhắn cứ dồn dập gửi đến liên tục từng giây."
 },
 "variety5v": {
  "en": "Variety",
  "say": "vơ-rai-ơ-ti",
  "vi": "sự đa dạng dữ liệu",
  "gloss": "Nói về việc dữ liệu có nhiều kiểu khác nhau. Có chữ, có ảnh, có video, có tiếng — đủ loại trộn lẫn."
 },
 "veracity5v": {
  "en": "Veracity",
  "say": "vơ-ra-si-ti",
  "vi": "độ tin cậy dữ liệu",
  "gloss": "Nói về việc dữ liệu có đúng và đáng tin hay không. Giống có bạn kể chuyện thật, có bạn kể sai; ta phải chọn tin cái đúng."
 },
 "client": {
  "en": "client",
  "say": "clai-ơnt",
  "vi": "máy khách",
  "gloss": "Là máy hỏi xin và nhận dịch vụ từ máy chủ. Giống em vào quán gọi món, còn máy chủ là người phục vụ mang món ra."
 },
 "supervised": {
  "en": "supervised learning",
  "say": "su-pơ-vai-zơ lơ-ninh",
  "vi": "học có giám sát",
  "gloss": "Là kiểu dạy máy mà mỗi ví dụ đều dán sẵn đáp án đúng. Giống cô đưa ảnh và nói 'đây là con chó', máy nhìn theo mà học."
 },
 "unsupervised": {
  "en": "unsupervised learning",
  "say": "ăn-su-pơ-vai-zơ lơ-ninh",
  "vi": "học không giám sát",
  "gloss": "Là kiểu máy tự học mà không ai nói đáp án. Máy tự gom những thứ giống nhau vào một nhóm, giống em tự xếp bi cùng màu vào chung."
 },
 "dataset": {
  "en": "dataset",
  "say": "đây-tơ-sét",
  "vi": "tập dữ liệu",
  "gloss": "Là một bộ dữ liệu gom lại để cho máy học. Giống một hộp đầy ảnh mẫu để máy xem đi xem lại mà nhớ."
 },
 "model": {
  "en": "model",
  "say": "mo-đờl",
  "vi": "mô hình",
  "gloss": "Là thứ máy tạo ra sau khi học xong, dùng để đoán việc mới. Giống sau khi học thuộc bài, em có thể tự trả lời câu hỏi chưa gặp."
 },
 "fileserver": {
  "en": "file server",
  "say": "phai sơ-vơ",
  "vi": "máy chủ tệp",
  "gloss": "Máy tính lớn chuyên giữ giùm các tệp để cả lớp cùng dùng chung. Giống cái tủ chung của lớp, ai cần tài liệu thì tới đó lấy."
 },
 "webserver": {
  "en": "web server",
  "say": "oép sơ-vơ",
  "vi": "máy chủ web",
  "gloss": "Máy tính chứa sẵn các trang web, ai mở là nó gửi trang về cho xem. Giống bác thủ thư, em hỏi cuốn nào thì bác đưa cuốn đó."
 },
 "databaseserver": {
  "en": "database server",
  "say": "đây-tơ-bês sơ-vơ",
  "vi": "máy chủ cơ sở dữ liệu",
  "gloss": "Máy tính giữ cả kho thông tin như tên, điểm số cho nhiều người tra cứu. Giống quyển sổ điểm to của trường, cần tra ai thì mở ra xem."
 },
 "accesspoint": {
  "en": "access point",
  "say": "ác-xét poi",
  "vi": "bộ thu phát Wi-Fi",
  "gloss": "Thiết bị phát sóng Wi-Fi cho điện thoại, máy tính vào mạng mà không cần dây. Giống cái loa phát sóng cho cả nhà cùng bắt được."
 },
 "repeater": {
  "en": "repeater",
  "say": "ri-pi-tơ",
  "vi": "bộ lặp",
  "gloss": "Thiết bị làm tín hiệu yếu khỏe lại để mạng đi được xa hơn. Giống bạn đứng giữa sân hô lại thật to cho bạn ở xa nghe rõ."
 },
 "routing": {
  "en": "routing",
  "say": "rao-tinh",
  "vi": "định tuyến",
  "gloss": "Việc chỉ đường cho dữ liệu đi từ máy này tới đúng máy kia trong mạng. Giống bác đưa thư chọn đường để mang thư tới đúng nhà."
 },
 "collision": {
  "en": "collision",
  "say": "cơ-li-giơn",
  "vi": "xung đột tín hiệu",
  "gloss": "Khi hai máy cùng gửi dữ liệu một lúc, tín hiệu đâm vào nhau nên hỏng. Giống hai bạn cùng hét to một lúc thì chẳng nghe rõ ai."
 },
 "ethernet": {
  "en": "Ethernet",
  "say": "i-thơ-nét",
  "vi": "chuẩn mạng có dây",
  "gloss": "Cách nối các máy tính bằng dây cáp để chúng trao đổi với nhau. Sợi dây mạng cắm sau máy tính chính là dây Ethernet đó."
 },
 "workgroup": {
  "en": "workgroup",
  "say": "uốc-grúp",
  "vi": "nhóm làm việc",
  "gloss": "Mạng đơn giản mà các máy bình đẳng, tự chia sẻ với nhau, không máy nào làm sếp. Giống nhóm bạn tự chơi chung, chẳng cần ai làm nhóm trưởng."
 },
 "domainnet": {
  "en": "domain",
  "say": "đô-mên",
  "vi": "miền",
  "gloss": "Mạng có một máy chủ làm sếp, quản lí tài khoản và cho phép ai được vào. Giống lớp có cô giáo điểm danh, quyết ai được vào lớp."
 },
 "driver": {
  "en": "driver",
  "say": "đrai-vơ",
  "vi": "trình điều khiển",
  "gloss": "Phần mềm nhỏ giúp máy tính nhận ra và dùng được thiết bị như máy in, chuột. Giống người phiên dịch giúp máy tính với máy in hiểu nhau."
 },
 "gateway": {
  "en": "gateway",
  "say": "gết-uây",
  "vi": "cổng kết nối",
  "gloss": "Cửa nối giữa hai mạng khác nhau, giúp dữ liệu đi từ mạng này sang mạng kia. Giống cổng trường nối sân trường với đường phố bên ngoài."
 },
 "bandwidth": {
  "en": "bandwidth",
  "say": "ben-uýt",
  "vi": "băng thông",
  "gloss": "Bề rộng của đường truyền, cho biết mạng chở được bao nhiêu dữ liệu cùng lúc. Đường càng rộng thì càng nhiều xe qua được một lúc."
 },
 "gbps": {
  "en": "Gb/s",
  "say": "gi-ga-bít trên giây",
  "vi": "gigabit mỗi giây (đo tốc độ)",
  "gloss": "Đơn vị đo tốc độ đường truyền, cho biết mỗi giây gửi được bao nhiêu tỉ bit. Mạng cáp quang nhanh có thể đạt tới 1 Gb/s.",
  "speak": "gi-ga-bít trên giây"
 },
 "mbps": {
  "en": "Mb/s",
  "say": "mê-ga-bít trên giây",
  "vi": "megabit mỗi giây (đo tốc độ)",
  "gloss": "Đơn vị đo tốc độ đường truyền, cho biết mỗi giây gửi được bao nhiêu triệu bit. Gói mạng nhà em có thể là 100 Mb/s.",
  "speak": "mê-ga-bít trên giây"
 },
 "rj45": {
  "en": "RJ45",
  "say": "rờ-gi bốn lăm",
  "vi": "đầu/cổng cắm dây mạng",
  "gloss": "Đầu bấm bằng nhựa ở hai đầu sợi dây mạng, cũng là tên cái cổng để cắm dây đó vào. Em cắm đầu RJ45 vào máy tính hoặc bộ phát wifi để nối mạng.",
  "speak": "R J 45"
 },
 "utp": {
  "en": "UTP",
  "say": "diu-ti-pi",
  "vi": "cáp mạng xoắn đôi",
  "gloss": "Loại dây mạng phổ biến, bên trong có các sợi đồng nhỏ xoắn từng đôi với nhau cho đỡ nhiễu. Dây nối máy tính với bộ phát wifi thường là cáp UTP.",
  "speak": "U T P"
 },
 "adsl": {
  "en": "ADSL",
  "say": "ây-đi-ét-eo",
  "vi": "Internet cáp đồng đời cũ",
  "gloss": "Cách vào Internet kiểu cũ, truyền qua dây điện thoại bằng đồng. Ngày xưa nhiều nhà dùng ADSL, nay đã thay bằng cáp quang nhanh hơn.",
  "speak": "A D S L"
 },
 "gsm": {
  "en": "GSM",
  "say": "gi-ét-em",
  "vi": "mạng điện thoại di động",
  "gloss": "Chuẩn mạng cho điện thoại di động đời đầu, giúp gọi và nhắn tin. Điện thoại '2G' ngày xưa chạy trên mạng GSM.",
  "speak": "G S M"
 },
 "bts": {
  "en": "BTS",
  "say": "bi-ti-ét",
  "vi": "trạm thu phát sóng di động",
  "gloss": "Cột hoặc trạm phát sóng cho điện thoại di động. Điện thoại của em bắt sóng từ trạm BTS gần nhất để gọi và vào mạng.",
  "speak": "B T S"
 },
 "sms": {
  "en": "SMS",
  "say": "ét-em-ét",
  "vi": "tin nhắn điện thoại",
  "gloss": "Tin nhắn chữ gửi qua số điện thoại, không cần Internet. Em có thể gửi SMS 'Con sắp về' cho mẹ.",
  "speak": "S M S"
 },
 "nfc": {
  "en": "NFC",
  "say": "en-ép-xi",
  "vi": "kết nối chạm rất gần",
  "gloss": "Kiểu kết nối khi hai thiết bị chạm sát nhau, cách nhau chưa tới 4 cm. Người ta chạm điện thoại vào máy để trả tiền là nhờ NFC.",
  "speak": "N F C"
 },
 "gps": {
  "en": "GPS",
  "say": "gi-pi-ét",
  "vi": "định vị toàn cầu",
  "gloss": "Hệ thống vệ tinh giúp biết mình đang đứng ở đâu trên Trái Đất. Nhờ nó mà điện thoại chỉ đường cho ta đi.",
  "speak": "G P S"
 },
 "smtp": {
  "en": "SMTP",
  "say": "ét-em-ti-pi",
  "vi": "giao thức gửi thư điện tử",
  "gloss": "Bộ quy tắc giúp máy tính gửi thư điện tử đi. Khi em bấm 'Gửi' một email, máy dùng SMTP để chuyển thư đi.",
  "speak": "S M T P"
 },
 "pop3": {
  "en": "POP3",
  "say": "pốp ba",
  "vi": "giao thức nhận thư điện tử",
  "gloss": "Bộ quy tắc giúp máy tải thư điện tử từ máy chủ về máy của mình. Tải xong, thư thường bị lấy khỏi máy chủ nên chỉ xem được ở một máy.",
  "speak": "pốp ba"
 },
 "imap": {
  "en": "IMAP",
  "say": "ai-máp",
  "vi": "giao thức đồng bộ thư điện tử",
  "gloss": "Bộ quy tắc để xem thư điện tử mà thư vẫn nằm trên máy chủ. Nhờ vậy em mở cùng một hộp thư trên điện thoại hay máy tính đều thấy giống nhau.",
  "speak": "ai-máp"
 },
 "ipv4": {
  "en": "IPv4",
  "say": "ai-pi vê bốn",
  "vi": "địa chỉ IP gồm 4 số",
  "gloss": "Kiểu địa chỉ cũ và phổ biến để đặt tên số cho mỗi máy trên mạng, gồm 4 nhóm số. Ví dụ 192.168.1.1 là một địa chỉ IPv4.",
  "speak": "I P vê bốn"
 },
 "htmlhead": {
  "en": "head",
  "say": "hét",
  "vi": "phần đầu trang",
  "gloss": "Là phần đầu của trang web, chứa các thông tin cài đặt như tên trang. Người xem thường không nhìn thấy phần này, giống trang khai báo ở đầu quyển sách."
 },
 "htmldiv": {
  "en": "div",
  "say": "đíp",
  "vi": "thẻ chia khối",
  "gloss": "Giống một cái hộp trong suốt để gom các thứ trên trang web lại thành một nhóm, cho dễ sắp xếp."
 },
 "htmlimg": {
  "en": "img",
  "say": "im-mít",
  "vi": "thẻ chèn ảnh",
  "gloss": "Dùng để đưa một tấm ảnh vào trang web. Ví dụ muốn khoe hình chú mèo, em dùng thẻ này để ảnh hiện lên trang.",
  "speak": "image"
 },
 "htmlinput": {
  "en": "input (HTML)",
  "say": "in-pút",
  "vi": "ô nhập liệu",
  "gloss": "Là ô trống để người dùng gõ thông tin vào, như ô điền tên hoặc mật khẩu. Giống chỗ trống trong bài tập để em điền câu trả lời."
 },
 "htmllabel": {
  "en": "label",
  "say": "lê-bồ",
  "vi": "nhãn ô nhập",
  "gloss": "Là dòng chữ ghi tên cho một ô nhập, để người dùng biết ô đó cần điền gì. Ví dụ chữ 'Họ tên' đặt cạnh ô để điền tên."
 },
 "htmlselect": {
  "en": "select (HTML)",
  "say": "si-léc",
  "vi": "ô chọn xổ xuống",
  "gloss": "Là ô bấm vào sẽ xổ xuống một danh sách cho ta chọn, như chọn lớp hay chọn màu. Giống tấm thực đơn xổ ra để em chọn một món."
 },
 "htmloption": {
  "en": "option",
  "say": "óp-sần",
  "vi": "một lựa chọn",
  "gloss": "Là một dòng lựa chọn nằm bên trong ô select. Ví dụ trong ô chọn màu, mỗi màu đỏ, xanh, vàng là một option."
 },
 "htmltextarea": {
  "en": "textarea",
  "say": "tếch-e-ri-a",
  "vi": "ô nhập nhiều dòng",
  "gloss": "Là ô nhập chữ cỡ lớn, cho phép gõ nhiều dòng như viết một đoạn văn. Khác với ô input nhỏ chỉ gõ được một dòng ngắn.",
  "speak": "text area"
 },
 "htmlbutton": {
  "en": "button",
  "say": "bát-tần",
  "vi": "nút bấm",
  "gloss": "Là cái nút để bấm cho máy làm một việc gì đó, như nút 'Gửi' hay 'Đăng nhập'. Giống nút bấm chuông cửa, bấm là có chuyện xảy ra."
 },
 "htmlfieldset": {
  "en": "fieldset",
  "say": "phiu-sét",
  "vi": "khung gom nhóm",
  "gloss": "Là cái khung có viền bao quanh, dùng để gom nhiều ô nhập cùng nhóm lại với nhau. Ví dụ gom ô 'Họ tên' và 'Ngày sinh' vào chung một khung thông tin."
 },
 "htmllegend": {
  "en": "legend",
  "say": "le-giừn",
  "vi": "tiêu đề khung",
  "gloss": "Là dòng tiêu đề nằm trên khung fieldset, cho biết khung đó nói về điều gì. Ví dụ chữ 'Thông tin cá nhân' ghi trên khung gom các ô."
 },
 "attrhref": {
  "en": "href",
  "say": "hờ-rép",
  "vi": "địa chỉ liên kết",
  "gloss": "Là chỗ ghi địa chỉ trang web mà liên kết sẽ dẫn tới khi bấm vào. Giống địa chỉ nhà, cho biết bấm vào sẽ đưa ta đi đâu."
 },
 "attrsrc": {
  "en": "src",
  "say": "ét-rờ-xê",
  "vi": "đường dẫn ảnh/video",
  "gloss": "Là chỗ ghi đường dẫn tới tấm ảnh hoặc video cần hiện lên. Nó chỉ cho máy biết phải lấy ảnh từ chỗ nào để đưa lên trang."
 },
 "attralt": {
  "en": "alt",
  "say": "ót",
  "vi": "chữ mô tả ảnh",
  "gloss": "Là dòng chữ mô tả tấm ảnh, sẽ hiện ra khi ảnh bị lỗi không tải được. Ví dụ ảnh con mèo bị lỗi thì hiện chữ 'con mèo' thay cho ảnh."
 },
 "attrtarget": {
  "en": "target",
  "say": "ta-gợt",
  "vi": "nơi mở liên kết",
  "gloss": "Cho biết liên kết sẽ mở ra ở đâu: ngay tab đang xem hay mở sang một tab mới. Ví dụ đặt mở tab mới để không mất trang cũ đang đọc."
 },
 "colspan": {
  "en": "colspan",
  "say": "côn-span",
  "vi": "gộp nhiều cột",
  "gloss": "Dùng trong bảng để gộp một ô cho rộng ra, nằm đè lên nhiều cột. Ví dụ ô tiêu đề 'Điểm thi' nằm gộp trên 3 cột bên dưới."
 },
 "rowspan": {
  "en": "rowspan",
  "say": "rô-span",
  "vi": "gộp nhiều hàng",
  "gloss": "Dùng trong bảng để gộp một ô cho cao ra, nằm đè lên nhiều hàng. Ví dụ ô 'Tổ 1' gộp chung cho 3 hàng tên bên cạnh."
 },
 "csscolor": {
  "en": "color",
  "say": "cơ-lơ",
  "vi": "màu chữ",
  "gloss": "Thuộc tính CSS để đặt màu cho chữ. Ví dụ color:red thì chữ có màu đỏ."
 },
 "cssbgcolor": {
  "en": "background-color",
  "say": "béc-grao cơ-lơ",
  "vi": "màu nền",
  "gloss": "Thuộc tính CSS để tô màu nền phía sau chữ và hình. Ví dụ background-color:yellow thì nền có màu vàng."
 },
 "cssborder": {
  "en": "border",
  "say": "bo-đơ",
  "vi": "đường viền",
  "gloss": "Thuộc tính CSS để vẽ đường viền bao quanh một khối. Ví dụ border tạo một khung giống viền quanh tấm ảnh."
 },
 "cssfontfamily": {
  "en": "font-family",
  "say": "phông phe-mi-li",
  "vi": "kiểu phông chữ",
  "gloss": "Thuộc tính CSS để chọn kiểu (họ) phông chữ. Ví dụ chọn phông chữ tròn trịa hay phông chữ vuông vắn cho trang."
 },
 "cssfontsize": {
  "en": "font-size",
  "say": "phông sai",
  "vi": "cỡ chữ",
  "gloss": "Thuộc tính CSS để đặt chữ to hay nhỏ. Ví dụ font-size lớn thì chữ to như dòng tựa đề."
 },
 "cssfontweight": {
  "en": "font-weight",
  "say": "phông uây",
  "vi": "độ đậm chữ",
  "gloss": "Thuộc tính CSS để làm chữ đậm hay mảnh. Ví dụ font-weight:bold thì chữ được in đậm."
 },
 "csstextalign": {
  "en": "text-align",
  "say": "tếch ơ-lain",
  "vi": "canh lề chữ",
  "gloss": "Thuộc tính CSS để canh chữ sang trái, vào giữa hay sang phải. Ví dụ text-align:center thì chữ nằm chính giữa."
 },
 "csstextdecoration": {
  "en": "text-decoration",
  "say": "tếch đê-cơ-rê-sần",
  "vi": "trang trí chữ",
  "gloss": "Thuộc tính CSS để trang trí chữ, như thêm gạch chân. Ví dụ text-decoration:underline thì chữ có gạch ở dưới."
 },
 "csslineheight": {
  "en": "line-height",
  "say": "lain hai",
  "vi": "khoảng cách dòng",
  "gloss": "Thuộc tính CSS để đặt khoảng cách giữa các dòng chữ. Ví dụ line-height lớn thì các dòng thưa ra, đọc đỡ mỏi mắt."
 },
 "cssdisplay": {
  "en": "display",
  "say": "đis-plây",
  "vi": "cách hiển thị",
  "gloss": "Thuộc tính CSS để chọn cách một khối hiện ra trên trang. Ví dụ có thể xếp các khối nằm cạnh nhau hoặc mỗi khối một hàng."
 },
 "csswidth": {
  "en": "width",
  "say": "uít",
  "vi": "chiều rộng",
  "gloss": "Thuộc tính CSS để đặt chiều rộng cho một khối. Ví dụ width lớn thì khối trải rộng ra hai bên."
 },
 "cssheight": {
  "en": "height",
  "say": "hai",
  "vi": "chiều cao",
  "gloss": "Thuộc tính CSS để đặt chiều cao cho một khối. Ví dụ height lớn thì khối cao lên."
 },
 "cssserif": {
  "en": "serif",
  "say": "xe-ríp",
  "vi": "phông có chân",
  "gloss": "Kiểu phông chữ có nét chân nhỏ ở đầu và cuối mỗi chữ. Ví dụ chữ trong sách in thường là phông có chân."
 },
 "csssansserif": {
  "en": "sans-serif",
  "say": "xan xe-ríp",
  "vi": "phông không chân",
  "gloss": "Kiểu phông chữ trơn, không có nét chân. Ví dụ chữ trên nhiều trang web là phông không chân, nhìn gọn gàng."
 },
 "cssunderline": {
  "en": "underline",
  "say": "ăn-đơ-lain",
  "vi": "gạch chân",
  "gloss": "Giá trị CSS để kẻ một gạch ở dưới chữ. Ví dụ text-decoration:underline thì chữ được gạch chân."
 },
 "cssliststyletype": {
  "en": "list-style-type",
  "say": "lít s-tai tai",
  "vi": "kiểu dấu đầu dòng",
  "gloss": "Thuộc tính CSS để chọn dấu ở đầu mỗi mục trong danh sách. Ví dụ dùng chấm tròn hay số 1, 2, 3 ở đầu dòng."
 },
 "csshover": {
  "en": ":hover",
  "say": "ha-vơ",
  "speak": "hover",
  "vi": "khi rê chuột lên",
  "gloss": "Trạng thái CSS khi con trỏ chuột rê lên một thứ gì đó. Ví dụ nút đổi màu khi ta rê chuột lên nó."
 },
 "lifo": {
  "en": "LIFO (Last In, First Out)",
  "say": "lai-phâu",
  "vi": "vào sau ra trước",
  "gloss": "Luật hoạt động của ngăn xếp: thứ được bỏ vào sau cùng lại là thứ được lấy ra đầu tiên. Nút Hoàn tác trong phần mềm soạn thảo chạy theo luật này."
 },
 "fifo": {
  "en": "FIFO (First In, First Out)",
  "say": "phai-phâu",
  "vi": "vào trước ra trước",
  "gloss": "Luật hoạt động của hàng đợi: thứ vào trước thì ra trước. Hàng chờ in ấn hay hàng mua vé đều xử lí theo luật công bằng này."
 },
 "push": {
  "en": "push",
  "say": "pút",
  "vi": "đẩy vào đỉnh",
  "gloss": "Thao tác thêm một phần tử lên đỉnh ngăn xếp. Trong Python, `append()` của danh sách làm đúng việc này."
 },
 "pop": {
  "en": "pop",
  "say": "pốp",
  "vi": "nhấc ra khỏi đỉnh",
  "gloss": "Thao tác lấy phần tử ở đỉnh ngăn xếp ra và trả về giá trị của nó. Trong Python là `pop()`; nếu viết `pop(0)` thì lại lấy phần tử đầu, dùng cho hàng đợi."
 },
 "bruteforce": {
  "en": "brute force",
  "say": "brút phoóc",
  "vi": "vét cạn",
  "gloss": "Cách giải thử hết mọi khả năng rồi giữ lại cái thoả mãn. Chắc chắn ra đáp án đúng, nhưng rất chậm khi dữ liệu lớn."
 },
 "divideandconquer": {
  "en": "divide and conquer",
  "say": "đi-vai en con-cơ",
  "vi": "chia để trị",
  "gloss": "Bẻ bài toán lớn thành các bài con cùng dạng nhưng nhỏ hơn, giải từng bài con rồi ghép kết quả lại. Tìm kiếm nhị phân là ví dụ quen thuộc nhất."
 },
 "greedy": {
  "en": "greedy",
  "say": "gri-đi",
  "vi": "tham lam",
  "gloss": "Ở mỗi bước cứ chọn phương án trông tốt nhất ngay lúc đó rồi đi tiếp, không quay lại. Rất nhanh nhưng không phải lúc nào cũng cho kết quả tối ưu."
 },
 "dynamicprogramming": {
  "en": "dynamic programming",
  "say": "đai-na-mích prô-gram-ming",
  "vi": "quy hoạch động",
  "gloss": "Kĩ thuật dành cho bài toán mà các bài con bị tính đi tính lại: lưu kết quả từng bài con lại để lần sau lấy ra dùng ngay."
 },
 "memoization": {
  "en": "memoization",
  "say": "me-mô-ai-dây-sần",
  "vi": "ghi nhớ kết quả đã tính",
  "gloss": "Mẹo cất kết quả của một lời gọi hàm vào bộ nhớ đệm để lần sau gọi với cùng dữ liệu thì đọc thẳng ra, khỏi tính lại."
 },
 "mergesort": {
  "en": "merge sort",
  "say": "mớt-giơ sót",
  "vi": "sắp xếp trộn",
  "gloss": "Thuật toán sắp xếp theo lối chia để trị: chia dãy làm đôi, sắp xếp từng nửa rồi trộn hai nửa đã có thứ tự lại với nhau."
 }
};
if (typeof window !== "undefined") window.VOCAB_TERMS = VOCAB_TERMS;
