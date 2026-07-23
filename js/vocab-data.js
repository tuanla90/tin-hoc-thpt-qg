/* ============================================================================
 *  DỮ LIỆU TỪ VỰNG: gán danh sách KHÓA từ vựng cho từng bài học.
 *  Khóa tra trong từ điển gốc VOCAB_TERMS (js/vocab-terms.js).
 *  Nạp SAU vocab.js và vocab-terms.js, TRƯỚC app.js.
 * ==========================================================================*/
(function () {
  if (typeof VOCAB === "undefined") return;

  /* --- Bổ sung vài thuật ngữ hay gặp chưa có trong từ điển gốc --- */
  if (typeof VOCAB_TERMS !== "undefined") {
    var extra = {
      file:    { en: "file", say: "phai (như 'phai màu')", vi: "tệp tin", gloss: "Một 'gói' dữ liệu có tên lưu trong máy — như một tờ giấy hay cuốn vở đã ghi chép." },
      folder:  { en: "folder", say: "PHÂU-đờ", vi: "thư mục", gloss: "Chỗ gom nhiều tệp lại cho gọn — giống cái cặp đựng nhiều tờ giấy." },
      pdf:     { en: "PDF", say: "pi-đi-ép", vi: "tệp tài liệu PDF", gloss: "Một kiểu tệp tài liệu giữ nguyên cách trình bày, mở ở máy nào cũng giống nhau." },
      account: { en: "account", say: "ơ-KAO", vi: "tài khoản", gloss: "'Chỗ riêng' của em trên một trang web, đăng nhập bằng tên và mật khẩu." },
      /* Cơ sở dữ liệu & SQL (Tin 11) */
      database: { en: "database", say: "ĐÊI-tơ-bêi", vi: "cơ sở dữ liệu (CSDL)", gloss: "Một kho chứa dữ liệu được sắp xếp gọn gàng để tìm và dùng lại dễ dàng — như thư viện xếp sách theo thứ tự." },
      dbms: { en: "DBMS", say: "đi-bi-em-ét", vi: "hệ quản trị cơ sở dữ liệu", gloss: "Phần mềm giúp tạo, lưu và quản lí cơ sở dữ liệu — giống người thủ thư trông coi cả thư viện." },
      table: { en: "table", say: "TÂY-bồ", vi: "bảng (trong CSDL)", gloss: "Nơi chứa dữ liệu theo hàng và cột — giống bảng điểm của lớp: mỗi hàng một bạn, mỗi cột một thông tin." },
      record: { en: "record", say: "RE-cợt", vi: "bản ghi (một hàng)", gloss: "Một hàng trong bảng, chứa đủ thông tin của một đối tượng — như dòng ghi tên, tuổi, lớp của một bạn." },
      field: { en: "field", say: "phin(-đờ)", vi: "trường (một cột)", gloss: "Một cột trong bảng, cho biết một loại thông tin — như cột 'Họ tên' hay cột 'Điểm'." },
      query: { en: "query", say: "KUÊ-ri", vi: "truy vấn", gloss: "Câu hỏi gửi cho cơ sở dữ liệu để lấy đúng dữ liệu cần — như hỏi 'cho xem những bạn điểm trên 8'." },
      primarykey: { en: "primary key", say: "PRAI-mơ-ri ki", vi: "khoá chính", gloss: "Cột dùng để phân biệt mỗi hàng, không ai trùng ai — như số báo danh riêng của mỗi học sinh." },
      foreignkey: { en: "foreign key", say: "PHO-rìn ki", vi: "khoá ngoài", gloss: "Cột dùng để nối bảng này với bảng kia — như số lớp trong bảng học sinh chỉ sang bảng danh sách lớp." },
      relational: { en: "relational", say: "ri-LÂY-sần-nồ", vi: "(CSDL) quan hệ", gloss: "Kiểu cơ sở dữ liệu chia dữ liệu thành nhiều bảng rồi nối với nhau, nhờ vậy đỡ ghi trùng, dễ quản lí." },
      select: { en: "SELECT", say: "si-LẾCH", vi: "lệnh SQL lấy dữ liệu", gloss: "Lệnh SQL để 'chọn ra' dữ liệu cần xem từ bảng — như bảo 'lấy cho tôi cột tên và điểm'." },
      insert: { en: "INSERT", say: "in-SƠT", vi: "lệnh SQL thêm dữ liệu", gloss: "Lệnh SQL để thêm một hàng dữ liệu mới vào bảng — như ghi thêm một bạn vào danh sách." },
      update: { en: "UPDATE", say: "ẤP-đêi", vi: "lệnh SQL sửa dữ liệu", gloss: "Lệnh SQL để sửa lại dữ liệu đã có trong bảng — như đổi lại điểm cho đúng." },
      "delete": { en: "DELETE", say: "đi-LÍT", vi: "lệnh SQL xoá dữ liệu", gloss: "Lệnh SQL để xoá một hàng dữ liệu khỏi bảng — như xoá tên một bạn đã chuyển trường." },
      /* Kĩ thuật lập trình (Tin 11) */
      module: { en: "module", say: "MÔ-điu", vi: "mô đun", gloss: "Một phần chương trình tách riêng làm một việc, để lắp ghép lại — như từng khối LEGO ghép thành mô hình lớn." },
      library: { en: "library", say: "LAI-brơ-ri", vi: "thư viện (lập trình)", gloss: "Bộ sưu tập các hàm viết sẵn để dùng lại, khỏi viết từ đầu — như mượn dụng cụ có sẵn trong kho thay vì tự làm." },
      bigo: { en: "Big-O", say: "bích-ô", vi: "độ phức tạp (kí hiệu O lớn)", gloss: "Cách ước lượng chương trình chạy nhanh hay chậm khi dữ liệu to lên — càng 'O lớn' thì càng lâu." },
    };
    for (var k in extra) if (!VOCAB_TERMS[k]) VOCAB_TERMS[k] = extra[k];
  }

  /* --- Gán khóa từ vựng cho từng bài (đã lọc bỏ mảnh chữ hoa tiếng Việt) --- */
  Object.assign(VOCAB, {
    /* ===== TIN 10 ===== */
    "S10-01": ["data", "information", "bit", "byte", "input", "process", "output", "dataunits"],
    "S10-02": ["iot", "ai", "internet", "python", "wifi", "bluetooth"],
    "S10-03": ["ascii", "unicode", "bit", "string"],
    "S10-04": ["binary", "decimal", "bit", "byte"],
    "S10-05": ["bool", "boolean", "and", "or", "not", "xor"],
    "S10-06": ["pixel", "bitmap", "vector", "rgb", "byte", "bit"],
    "S10-07": ["usb", "internet", "email", "file", "wifi", "bluetooth"],
    "S10-08": ["network", "lan", "wan", "internet", "hub", "switch", "router", "wifi", "iot", "software", "rfid"],
    "S10-09": ["malware", "virus", "firewall", "dos", "password", "internet"],
    "S10-10": ["browser", "url", "https", "pdf", "internet"],
    "S10-11": ["copyright", "internet"],
    "S10-12": ["pixel", "vector", "bitmap", "inkscape", "gimp", "file"],
    "S10-13": ["inkscape", "vector"],
    "S10-14": ["inkscape", "vector"],
    "S10-15": ["inkscape", "png", "file"],
    "S10-16": ["python", "ide", "print", "input", "int", "str", "for", "range"],
    "S10-17": ["variable", "syntax", "comment", "python"],
    "S10-18": ["input", "print", "int", "float", "str", "bool"],
    "S10-19": ["if", "elif", "else", "bool"],
    "S10-20": ["for", "range", "loop"],
    "S10-21": ["while", "loop"],
    "S10-22": ["list", "index", "append", "len"],
    "S10-23": ["list", "index", "append", "value"],
    "S10-24": ["string", "str", "unicode", "len", "index"],
    "S10-25": ["string", "str"],
    "S10-26": ["function", "def", "return"],
    "S10-27": ["function", "def", "variable"],
    "S10-28": ["variable", "function"],
    "S10-29": ["bug", "syntax", "debug"],
    "S10-30": ["debug", "test", "bug"],
    "S10-31": ["algorithm", "function", "debug"],
    "S10-32": ["python", "function", "list", "string"],
    "S10-33": ["website", "web", "gimp", "vector"],
    "S10-34": ["software", "ai", "iot"],
    /* ===== TIN 11 ===== */
    "S11-01": ["software", "cpu"],
    "S11-02": ["file", "virus", "byte", "web"],
    "S11-03": ["opensource", "gnu", "gpl", "software", "server", "sql"],
    "S11-04": ["cpu", "ram", "rom", "alu", "usb", "ssd", "cd", "dvd", "dataunits", "bit", "and", "or", "not", "xor"],
    "S11-05": ["usb", "vga", "hdmi", "bluetooth", "wifi", "file"],
    "S11-06": ["cloud", "file", "internet", "email", "usb"],
    "S11-07": ["url", "browser", "web", "search", "pdf"],
    "S11-08": ["email", "spam", "account"],
    "S11-09": ["otp", "password", "phishing", "firewall"],
    "S11-10": ["database", "data", "record", "field"],
    "S11-11": ["database", "table", "record", "field"],
    "S11-12": ["dbms", "database", "server", "sql"],
    "S11-13": ["relational", "database", "table", "record", "field", "primarykey", "foreignkey"],
    "S11-14": ["sql", "query", "select", "insert", "update", "delete", "table", "database"],
    "S11-15": ["database", "dbms", "password", "firewall"],
    "S11-16": ["dbms", "database", "sql", "server"],
    "S17": ["array", "list", "matrix", "index"],
    "S11-18": ["array", "list", "index"],
    "S11-19": ["search", "algorithm"],
    "S11-20": ["search", "list"],
    "S11-21": ["sort", "algorithm"],
    "S11-22": ["sort", "list"],
    "S11-23": ["test", "debug", "bug"],
    "S11-24": ["bigo", "algorithm", "loop"],
    "S11-25": ["bigo", "algorithm"],
    "S11-26": ["algorithm", "function"],
    "S11-27": ["algorithm", "function"],
    "S11-28": ["module", "function"],
    "S11-29": ["module", "function"],
    "S11-30": ["library", "module", "function", "node"],
    "S11-31": ["library", "module"],
  });
})();
