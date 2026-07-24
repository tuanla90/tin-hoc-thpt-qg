/* ============================================================================
 *  TỪ VỰNG TIN 12 — thêm ~74 thuật ngữ mới vào VOCAB_TERMS + gán VOCAB[S12-xx].
 *  Nạp SAU vocab-terms.js & vocab-data.js, TRƯỚC app.js.
 *  Không ghi đè key đã có (guard `!(k in VOCAB_TERMS)`).
 * ==========================================================================*/
(function () {
  var NEW = {
    /* --- AI / Học máy / Khoa học dữ liệu / Mô phỏng (topic G) --- */
    "machinelearning": { en: "machine learning", say: "mơ-sin lơ-ninh", vi: "học máy", gloss: "Là cách cho máy tính tự học từ thật nhiều ví dụ. Giống em nhìn nhiều con mèo rồi tự biết đâu là mèo; máy xem càng nhiều thì đoán càng giỏi." },
    "simulation": { en: "simulation", say: "si-miu-lây-sần", vi: "mô phỏng", gloss: "Là dùng máy tính bắt chước một việc có thật để thử trước. Giống trò chơi lái máy bay giả nhưng giống y như thật, tập mà không sợ hỏng." },
    "datascience": { en: "data science", say: "đây-tơ sai-ơns", vi: "khoa học dữ liệu", gloss: "Là môn tìm hiểu thật nhiều số liệu để rút ra điều hay. Giống em xem điểm cả lớp rồi biết môn nào các bạn học giỏi nhất." },
    "bigdata": { en: "big data", say: "bích đây-tơ", vi: "dữ liệu lớn", gloss: "Là lượng thông tin khổng lồ, nhiều đến mức đếm bằng tay không xuể. Giống gộp hết ảnh và tin nhắn của mọi người trên mạng lại với nhau." },
    "volume5v": { en: "Volume", say: "vô-lium", vi: "khối lượng dữ liệu", gloss: "Nói về việc dữ liệu nhiều hay ít. Giống hỏi trong kho có bao nhiêu món đồ; dữ liệu lớn thì kho chứa cực kỳ nhiều." },
    "velocity5v": { en: "Velocity", say: "vơ-lô-si-ti", vi: "tốc độ dữ liệu", gloss: "Nói về việc dữ liệu chạy tới nhanh cỡ nào. Giống tin nhắn cứ dồn dập gửi đến liên tục từng giây." },
    "variety5v": { en: "Variety", say: "vơ-rai-ơ-ti", vi: "sự đa dạng dữ liệu", gloss: "Nói về việc dữ liệu có nhiều kiểu khác nhau. Có chữ, có ảnh, có video, có tiếng — đủ loại trộn lẫn." },
    "veracity5v": { en: "Veracity", say: "vơ-ra-si-ti", vi: "độ tin cậy dữ liệu", gloss: "Nói về việc dữ liệu có đúng và đáng tin hay không. Giống có bạn kể chuyện thật, có bạn kể sai; ta phải chọn tin cái đúng." },
    "client": { en: "client", say: "clai-ơnt", vi: "máy khách", gloss: "Là máy hỏi xin và nhận dịch vụ từ máy chủ. Giống em vào quán gọi món, còn máy chủ là người phục vụ mang món ra." },
    "supervised": { en: "supervised learning", say: "su-pơ-vai-zơ lơ-ninh", vi: "học có giám sát", gloss: "Là kiểu dạy máy mà mỗi ví dụ đều dán sẵn đáp án đúng. Giống cô đưa ảnh và nói 'đây là con chó', máy nhìn theo mà học." },
    "unsupervised": { en: "unsupervised learning", say: "ăn-su-pơ-vai-zơ lơ-ninh", vi: "học không giám sát", gloss: "Là kiểu máy tự học mà không ai nói đáp án. Máy tự gom những thứ giống nhau vào một nhóm, giống em tự xếp bi cùng màu vào chung." },
    "dataset": { en: "dataset", say: "đây-tơ-sét", vi: "tập dữ liệu", gloss: "Là một bộ dữ liệu gom lại để cho máy học. Giống một hộp đầy ảnh mẫu để máy xem đi xem lại mà nhớ." },
    "model": { en: "model", say: "mo-đờl", vi: "mô hình", gloss: "Là thứ máy tạo ra sau khi học xong, dùng để đoán việc mới. Giống sau khi học thuộc bài, em có thể tự trả lời câu hỏi chưa gặp." },

    /* --- Mạng: thiết bị & khái niệm (topic B) --- */
    "fileserver": { en: "file server", say: "phai sơ-vơ", vi: "máy chủ tệp", gloss: "Máy tính lớn chuyên giữ giùm các tệp để cả lớp cùng dùng chung. Giống cái tủ chung của lớp, ai cần tài liệu thì tới đó lấy." },
    "webserver": { en: "web server", say: "oép sơ-vơ", vi: "máy chủ web", gloss: "Máy tính chứa sẵn các trang web, ai mở là nó gửi trang về cho xem. Giống bác thủ thư, em hỏi cuốn nào thì bác đưa cuốn đó." },
    "databaseserver": { en: "database server", say: "đây-tơ-bês sơ-vơ", vi: "máy chủ cơ sở dữ liệu", gloss: "Máy tính giữ cả kho thông tin như tên, điểm số cho nhiều người tra cứu. Giống quyển sổ điểm to của trường, cần tra ai thì mở ra xem." },
    "accesspoint": { en: "access point", say: "ác-xét poi", vi: "bộ thu phát Wi-Fi", gloss: "Thiết bị phát sóng Wi-Fi cho điện thoại, máy tính vào mạng mà không cần dây. Giống cái loa phát sóng cho cả nhà cùng bắt được." },
    "repeater": { en: "repeater", say: "ri-pi-tơ", vi: "bộ lặp", gloss: "Thiết bị làm tín hiệu yếu khỏe lại để mạng đi được xa hơn. Giống bạn đứng giữa sân hô lại thật to cho bạn ở xa nghe rõ." },
    "routing": { en: "routing", say: "rao-tinh", vi: "định tuyến", gloss: "Việc chỉ đường cho dữ liệu đi từ máy này tới đúng máy kia trong mạng. Giống bác đưa thư chọn đường để mang thư tới đúng nhà." },
    "collision": { en: "collision", say: "cơ-li-giơn", vi: "xung đột tín hiệu", gloss: "Khi hai máy cùng gửi dữ liệu một lúc, tín hiệu đâm vào nhau nên hỏng. Giống hai bạn cùng hét to một lúc thì chẳng nghe rõ ai." },
    "ethernet": { en: "Ethernet", say: "i-thơ-nét", vi: "chuẩn mạng có dây", gloss: "Cách nối các máy tính bằng dây cáp để chúng trao đổi với nhau. Sợi dây mạng cắm sau máy tính chính là dây Ethernet đó." },
    "workgroup": { en: "workgroup", say: "uốc-grúp", vi: "nhóm làm việc", gloss: "Mạng đơn giản mà các máy bình đẳng, tự chia sẻ với nhau, không máy nào làm sếp. Giống nhóm bạn tự chơi chung, chẳng cần ai làm nhóm trưởng." },
    "domainnet": { en: "domain", say: "đô-mên", vi: "miền", gloss: "Mạng có một máy chủ làm sếp, quản lí tài khoản và cho phép ai được vào. Giống lớp có cô giáo điểm danh, quyết ai được vào lớp." },
    "driver": { en: "driver", say: "đrai-vơ", vi: "trình điều khiển", gloss: "Phần mềm nhỏ giúp máy tính nhận ra và dùng được thiết bị như máy in, chuột. Giống người phiên dịch giúp máy tính với máy in hiểu nhau." },
    "gateway": { en: "gateway", say: "gết-uây", vi: "cổng kết nối", gloss: "Cửa nối giữa hai mạng khác nhau, giúp dữ liệu đi từ mạng này sang mạng kia. Giống cổng trường nối sân trường với đường phố bên ngoài." },
    "bandwidth": { en: "bandwidth", say: "ben-uýt", vi: "băng thông", gloss: "Bề rộng của đường truyền, cho biết mạng chở được bao nhiêu dữ liệu cùng lúc. Đường càng rộng thì càng nhiều xe qua được một lúc." },

    /* --- Mạng: đơn vị, chuẩn, giao thức (topic B) --- */
    "gbps": { en: "Gb/s", say: "gi-ga-bít trên giây", vi: "gigabit mỗi giây (đo tốc độ)", gloss: "Đơn vị đo tốc độ đường truyền, cho biết mỗi giây gửi được bao nhiêu tỉ bit. Mạng cáp quang nhanh có thể đạt tới 1 Gb/s.", speak: "gi-ga-bít trên giây" },
    "mbps": { en: "Mb/s", say: "mê-ga-bít trên giây", vi: "megabit mỗi giây (đo tốc độ)", gloss: "Đơn vị đo tốc độ đường truyền, cho biết mỗi giây gửi được bao nhiêu triệu bit. Gói mạng nhà em có thể là 100 Mb/s.", speak: "mê-ga-bít trên giây" },
    "rj45": { en: "RJ45", say: "rờ-gi bốn lăm", vi: "đầu/cổng cắm dây mạng", gloss: "Đầu bấm bằng nhựa ở hai đầu sợi dây mạng, cũng là tên cái cổng để cắm dây đó vào. Em cắm đầu RJ45 vào máy tính hoặc bộ phát wifi để nối mạng.", speak: "R J 45" },
    "utp": { en: "UTP", say: "diu-ti-pi", vi: "cáp mạng xoắn đôi", gloss: "Loại dây mạng phổ biến, bên trong có các sợi đồng nhỏ xoắn từng đôi với nhau cho đỡ nhiễu. Dây nối máy tính với bộ phát wifi thường là cáp UTP.", speak: "U T P" },
    "adsl": { en: "ADSL", say: "ây-đi-ét-eo", vi: "Internet cáp đồng đời cũ", gloss: "Cách vào Internet kiểu cũ, truyền qua dây điện thoại bằng đồng. Ngày xưa nhiều nhà dùng ADSL, nay đã thay bằng cáp quang nhanh hơn.", speak: "A D S L" },
    "gsm": { en: "GSM", say: "gi-ét-em", vi: "mạng điện thoại di động", gloss: "Chuẩn mạng cho điện thoại di động đời đầu, giúp gọi và nhắn tin. Điện thoại '2G' ngày xưa chạy trên mạng GSM.", speak: "G S M" },
    "bts": { en: "BTS", say: "bi-ti-ét", vi: "trạm thu phát sóng di động", gloss: "Cột hoặc trạm phát sóng cho điện thoại di động. Điện thoại của em bắt sóng từ trạm BTS gần nhất để gọi và vào mạng.", speak: "B T S" },
    "sms": { en: "SMS", say: "ét-em-ét", vi: "tin nhắn điện thoại", gloss: "Tin nhắn chữ gửi qua số điện thoại, không cần Internet. Em có thể gửi SMS 'Con sắp về' cho mẹ.", speak: "S M S" },
    "nfc": { en: "NFC", say: "en-ép-xi", vi: "kết nối chạm rất gần", gloss: "Kiểu kết nối khi hai thiết bị chạm sát nhau, cách nhau chưa tới 4 cm. Người ta chạm điện thoại vào máy để trả tiền là nhờ NFC.", speak: "N F C" },
    "gps": { en: "GPS", say: "gi-pi-ét", vi: "định vị toàn cầu", gloss: "Hệ thống vệ tinh giúp biết mình đang đứng ở đâu trên Trái Đất. Nhờ nó mà điện thoại chỉ đường cho ta đi.", speak: "G P S" },
    "smtp": { en: "SMTP", say: "ét-em-ti-pi", vi: "giao thức gửi thư điện tử", gloss: "Bộ quy tắc giúp máy tính gửi thư điện tử đi. Khi em bấm 'Gửi' một email, máy dùng SMTP để chuyển thư đi.", speak: "S M T P" },
    "pop3": { en: "POP3", say: "pốp ba", vi: "giao thức nhận thư điện tử", gloss: "Bộ quy tắc giúp máy tải thư điện tử từ máy chủ về máy của mình. Tải xong, thư thường bị lấy khỏi máy chủ nên chỉ xem được ở một máy.", speak: "pốp ba" },
    "imap": { en: "IMAP", say: "ai-máp", vi: "giao thức đồng bộ thư điện tử", gloss: "Bộ quy tắc để xem thư điện tử mà thư vẫn nằm trên máy chủ. Nhờ vậy em mở cùng một hộp thư trên điện thoại hay máy tính đều thấy giống nhau.", speak: "ai-máp" },
    "ipv4": { en: "IPv4", say: "ai-pi vê bốn", vi: "địa chỉ IP gồm 4 số", gloss: "Kiểu địa chỉ cũ và phổ biến để đặt tên số cho mỗi máy trên mạng, gồm 4 nhóm số. Ví dụ 192.168.1.1 là một địa chỉ IPv4.", speak: "I P vê bốn" },

    /* --- Web: thẻ & thuộc tính HTML (topic E) --- */
    "htmlhead": { en: "head", say: "hét", vi: "phần đầu trang", gloss: "Là phần đầu của trang web, chứa các thông tin cài đặt như tên trang. Người xem thường không nhìn thấy phần này, giống trang khai báo ở đầu quyển sách." },
    "htmldiv": { en: "div", say: "đíp", vi: "thẻ chia khối", gloss: "Giống một cái hộp trong suốt để gom các thứ trên trang web lại thành một nhóm, cho dễ sắp xếp." },
    "htmlimg": { en: "img", say: "im-mít", vi: "thẻ chèn ảnh", gloss: "Dùng để đưa một tấm ảnh vào trang web. Ví dụ muốn khoe hình chú mèo, em dùng thẻ này để ảnh hiện lên trang.", speak: "image" },
    "htmlinput": { en: "input (HTML)", say: "in-pút", vi: "ô nhập liệu", gloss: "Là ô trống để người dùng gõ thông tin vào, như ô điền tên hoặc mật khẩu. Giống chỗ trống trong bài tập để em điền câu trả lời." },
    "htmllabel": { en: "label", say: "lê-bồ", vi: "nhãn ô nhập", gloss: "Là dòng chữ ghi tên cho một ô nhập, để người dùng biết ô đó cần điền gì. Ví dụ chữ 'Họ tên' đặt cạnh ô để điền tên." },
    "htmlselect": { en: "select (HTML)", say: "si-léc", vi: "ô chọn xổ xuống", gloss: "Là ô bấm vào sẽ xổ xuống một danh sách cho ta chọn, như chọn lớp hay chọn màu. Giống tấm thực đơn xổ ra để em chọn một món." },
    "htmloption": { en: "option", say: "óp-sần", vi: "một lựa chọn", gloss: "Là một dòng lựa chọn nằm bên trong ô select. Ví dụ trong ô chọn màu, mỗi màu đỏ, xanh, vàng là một option." },
    "htmltextarea": { en: "textarea", say: "tếch-e-ri-a", vi: "ô nhập nhiều dòng", gloss: "Là ô nhập chữ cỡ lớn, cho phép gõ nhiều dòng như viết một đoạn văn. Khác với ô input nhỏ chỉ gõ được một dòng ngắn.", speak: "text area" },
    "htmlbutton": { en: "button", say: "bát-tần", vi: "nút bấm", gloss: "Là cái nút để bấm cho máy làm một việc gì đó, như nút 'Gửi' hay 'Đăng nhập'. Giống nút bấm chuông cửa, bấm là có chuyện xảy ra." },
    "htmlfieldset": { en: "fieldset", say: "phiu-sét", vi: "khung gom nhóm", gloss: "Là cái khung có viền bao quanh, dùng để gom nhiều ô nhập cùng nhóm lại với nhau. Ví dụ gom ô 'Họ tên' và 'Ngày sinh' vào chung một khung thông tin." },
    "htmllegend": { en: "legend", say: "le-giừn", vi: "tiêu đề khung", gloss: "Là dòng tiêu đề nằm trên khung fieldset, cho biết khung đó nói về điều gì. Ví dụ chữ 'Thông tin cá nhân' ghi trên khung gom các ô." },
    "attrhref": { en: "href", say: "hờ-rép", vi: "địa chỉ liên kết", gloss: "Là chỗ ghi địa chỉ trang web mà liên kết sẽ dẫn tới khi bấm vào. Giống địa chỉ nhà, cho biết bấm vào sẽ đưa ta đi đâu." },
    "attrsrc": { en: "src", say: "ét-rờ-xê", vi: "đường dẫn ảnh/video", gloss: "Là chỗ ghi đường dẫn tới tấm ảnh hoặc video cần hiện lên. Nó chỉ cho máy biết phải lấy ảnh từ chỗ nào để đưa lên trang." },
    "attralt": { en: "alt", say: "ót", vi: "chữ mô tả ảnh", gloss: "Là dòng chữ mô tả tấm ảnh, sẽ hiện ra khi ảnh bị lỗi không tải được. Ví dụ ảnh con mèo bị lỗi thì hiện chữ 'con mèo' thay cho ảnh." },
    "attrtarget": { en: "target", say: "ta-gợt", vi: "nơi mở liên kết", gloss: "Cho biết liên kết sẽ mở ra ở đâu: ngay tab đang xem hay mở sang một tab mới. Ví dụ đặt mở tab mới để không mất trang cũ đang đọc." },
    "colspan": { en: "colspan", say: "côn-span", vi: "gộp nhiều cột", gloss: "Dùng trong bảng để gộp một ô cho rộng ra, nằm đè lên nhiều cột. Ví dụ ô tiêu đề 'Điểm thi' nằm gộp trên 3 cột bên dưới." },
    "rowspan": { en: "rowspan", say: "rô-span", vi: "gộp nhiều hàng", gloss: "Dùng trong bảng để gộp một ô cho cao ra, nằm đè lên nhiều hàng. Ví dụ ô 'Tổ 1' gộp chung cho 3 hàng tên bên cạnh." },

    /* --- Web: thuộc tính & giá trị CSS (topic E) --- */
    "csscolor": { en: "color", say: "cơ-lơ", vi: "màu chữ", gloss: "Thuộc tính CSS để đặt màu cho chữ. Ví dụ color:red thì chữ có màu đỏ." },
    "cssbgcolor": { en: "background-color", say: "béc-grao cơ-lơ", vi: "màu nền", gloss: "Thuộc tính CSS để tô màu nền phía sau chữ và hình. Ví dụ background-color:yellow thì nền có màu vàng." },
    "cssborder": { en: "border", say: "bo-đơ", vi: "đường viền", gloss: "Thuộc tính CSS để vẽ đường viền bao quanh một khối. Ví dụ border tạo một khung giống viền quanh tấm ảnh." },
    "cssfontfamily": { en: "font-family", say: "phông phe-mi-li", vi: "kiểu phông chữ", gloss: "Thuộc tính CSS để chọn kiểu (họ) phông chữ. Ví dụ chọn phông chữ tròn trịa hay phông chữ vuông vắn cho trang." },
    "cssfontsize": { en: "font-size", say: "phông sai", vi: "cỡ chữ", gloss: "Thuộc tính CSS để đặt chữ to hay nhỏ. Ví dụ font-size lớn thì chữ to như dòng tựa đề." },
    "cssfontweight": { en: "font-weight", say: "phông uây", vi: "độ đậm chữ", gloss: "Thuộc tính CSS để làm chữ đậm hay mảnh. Ví dụ font-weight:bold thì chữ được in đậm." },
    "csstextalign": { en: "text-align", say: "tếch ơ-lain", vi: "canh lề chữ", gloss: "Thuộc tính CSS để canh chữ sang trái, vào giữa hay sang phải. Ví dụ text-align:center thì chữ nằm chính giữa." },
    "csstextdecoration": { en: "text-decoration", say: "tếch đê-cơ-rê-sần", vi: "trang trí chữ", gloss: "Thuộc tính CSS để trang trí chữ, như thêm gạch chân. Ví dụ text-decoration:underline thì chữ có gạch ở dưới." },
    "csslineheight": { en: "line-height", say: "lain hai", vi: "khoảng cách dòng", gloss: "Thuộc tính CSS để đặt khoảng cách giữa các dòng chữ. Ví dụ line-height lớn thì các dòng thưa ra, đọc đỡ mỏi mắt." },
    "cssdisplay": { en: "display", say: "đis-plây", vi: "cách hiển thị", gloss: "Thuộc tính CSS để chọn cách một khối hiện ra trên trang. Ví dụ có thể xếp các khối nằm cạnh nhau hoặc mỗi khối một hàng." },
    "csswidth": { en: "width", say: "uít", vi: "chiều rộng", gloss: "Thuộc tính CSS để đặt chiều rộng cho một khối. Ví dụ width lớn thì khối trải rộng ra hai bên." },
    "cssheight": { en: "height", say: "hai", vi: "chiều cao", gloss: "Thuộc tính CSS để đặt chiều cao cho một khối. Ví dụ height lớn thì khối cao lên." },
    "cssserif": { en: "serif", say: "xe-ríp", vi: "phông có chân", gloss: "Kiểu phông chữ có nét chân nhỏ ở đầu và cuối mỗi chữ. Ví dụ chữ trong sách in thường là phông có chân." },
    "csssansserif": { en: "sans-serif", say: "xan xe-ríp", vi: "phông không chân", gloss: "Kiểu phông chữ trơn, không có nét chân. Ví dụ chữ trên nhiều trang web là phông không chân, nhìn gọn gàng." },
    "cssunderline": { en: "underline", say: "ăn-đơ-lain", vi: "gạch chân", gloss: "Giá trị CSS để kẻ một gạch ở dưới chữ. Ví dụ text-decoration:underline thì chữ được gạch chân." },
    "cssliststyletype": { en: "list-style-type", say: "lít s-tai tai", vi: "kiểu dấu đầu dòng", gloss: "Thuộc tính CSS để chọn dấu ở đầu mỗi mục trong danh sách. Ví dụ dùng chấm tròn hay số 1, 2, 3 ở đầu dòng." },
    "csshover": { en: ":hover", say: "ha-vơ", speak: "hover", vi: "khi rê chuột lên", gloss: "Trạng thái CSS khi con trỏ chuột rê lên một thứ gì đó. Ví dụ nút đổi màu khi ta rê chuột lên nó." }
  };

  if (typeof VOCAB_TERMS !== "undefined") {
    Object.keys(NEW).forEach(function (k) {
      if (!(k in VOCAB_TERMS)) VOCAB_TERMS[k] = NEW[k];
    });
  }

  /* Gán danh sách từ vựng cho từng bài Tin 12 (dùng key mới + key có sẵn) */
  var MAP = {
    "S12-01": ["ai"],
    "S12-02": ["ai", "machinelearning"],
    "S12-03": ["hub", "switch", "router", "accesspoint", "modem", "wifi", "lan", "wan", "ethernet", "routing"],
    "S12-04": ["tcp", "ip", "ipv4", "http", "dns", "smtp", "pop3", "imap"],
    "S12-05": ["firewall", "driver"],
    "S12-06": ["internet"],
    "S12-07": ["htmlhead"],
    "S12-08": ["csscolor", "cssfontfamily", "cssfontsize"],
    "S12-09": ["cssliststyletype", "colspan", "rowspan", "cssborder"],
    "S12-10": ["attrhref", "url", "attrtarget"],
    "S12-11": ["htmlimg", "attrsrc", "attralt", "attrtarget"],
    "S12-12": ["htmlinput", "htmllabel", "htmlselect", "htmloption", "htmltextarea", "htmlbutton", "htmlfieldset", "htmllegend"],
    "S12-13": ["csscolor", "cssbgcolor"],
    "S12-14": ["cssfontfamily", "cssfontsize", "cssfontweight", "csstextalign", "csstextdecoration", "csslineheight", "cssserif", "csssansserif", "cssunderline"],
    "S12-15": ["csscolor", "cssbgcolor", "cssborder"],
    "S12-16": ["cssdisplay", "csswidth", "cssheight", "htmldiv"],
    "S12-17": ["csshover"],
    "S12-18": ["cssdisplay"],
    "S12-19": ["driver", "ram", "virus"],
    "S12-20": ["firewall", "dos", "router"],
    "S12-22": ["server", "client", "fileserver", "webserver", "databaseserver", "hub", "switch", "router", "repeater", "accesspoint"],
    "S12-23": ["rj45", "utp", "adsl", "gsm", "bts", "sms", "nfc", "gps", "bluetooth", "wifi", "mbps", "gbps"],
    "S12-24": ["workgroup", "domainnet", "ethernet", "mbps"],
    "S12-25": ["machinelearning", "supervised", "unsupervised", "dataset", "model"],
    "S12-26": ["datascience", "bigdata", "volume5v", "velocity5v", "variety5v", "veracity5v", "ai"],
    "S12-27": ["datascience", "bigdata"],
    "S12-28": ["datascience"],
    "S12-29": ["simulation", "model"],
    "S12-30": ["simulation"]
  };

  if (typeof VOCAB !== "undefined") {
    Object.keys(MAP).forEach(function (id) { VOCAB[id] = MAP[id]; });
  }
})();
