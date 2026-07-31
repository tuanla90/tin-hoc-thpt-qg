/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 13: NỀN TẢNG LỚP 10, AN TOÀN SỐ, GIỚI HẠN CỦA AI
 *
 *  Đợt này quét nốt những bài "chữ nghĩa" mà trước đây tôi cho là không mô
 *  phỏng được: dữ liệu và thông tin, an toàn cá nhân, lừa đảo, giới hạn AI.
 *  Hoá ra đều mô phỏng được — chỉ cần tìm ra con số nào biết nói.
 *  Vẫn không phải viết CSS: bộ class chung từ đợt 4 tới đợt 10 là đủ.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function loiCua(node) { return function (t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }; }
  function ganDatLai(node, ds, lamLai) {
    var lai = node.querySelector('[data-mh="lai"]');
    lai.onclick = lamLai;
    ds.forEach(function (o) {
      if (!o) return;
      var su = o.tagName === "SELECT" || o.type === "checkbox" ? "change" : "input";
      o.addEventListener(su, function () { lai.click(); });
    });
  }

  /* ==================================================================
   *  C10-01 · THÔNG TIN, DỮ LIỆU VÀ CÁCH MÁY TÍNH XỬ LÍ
   *
   *  Bài mở đầu cả chương trình, và cũng là bài dễ học vẹt nhất: học sinh
   *  thuộc lòng "dữ liệu là thô, thông tin là ý nghĩa" mà không phân biệt nổi
   *  hai thứ khi gặp ví dụ thật. Cách trị: giữ NGUYÊN một con số, chỉ đổi ngữ
   *  cảnh, để chính các em thấy nghĩa nhảy từ "đi khám" sang "mua giày" trong
   *  khi con số không nhúc nhích. Phần hai chạy đủ chu trình nhập–lưu–xử lí–
   *  xuất trên một bảng điểm có thật, rồi dừng lại đúng chỗ máy hết khả năng:
   *  con số 6,4 hiện ra nhưng "có cần phụ đạo không" thì máy không trả lời được.
   * ================================================================ */
  MH.dangKy("C10-01", function (host) {
    /* Cùng một dữ liệu "38". Mỗi mục nói rõ: thông tin rút ra là gì, và rồi
       làm gì — vì thông tin chỉ đáng gọi là thông tin khi nó dẫn tới hành động. */
    var NC = [
      { ten: "Nhiệt độ cơ thể (°C)", mo: "Cặp nhiệt độ vừa đo cho một bạn trong lớp",
        tt: "Bạn ấy <b>đang sốt</b> — người bình thường chỉ khoảng 37°C.",
        lam: "Cho nghỉ ngơi, báo phụ huynh, <b>đưa đi khám</b>." },
      { ten: "Nhiệt độ ngoài trời (°C)", mo: "Trạm khí tượng báo về lúc 13 giờ",
        tt: "<b>Trời rất nóng</b>, nắng gay gắt.",
        lam: "<b>Hạn chế ra đường</b> giữa trưa, uống nhiều nước." },
      { ten: "Cỡ giày", mo: "Số ghi ở lót trong một đôi giày",
        tt: "Đây là <b>cỡ chân</b> — không nói gì về sức khoẻ hay thời tiết.",
        lam: "Ra cửa hàng hỏi đúng đôi <b>số 38</b>." },
      { ten: "Số học sinh trong lớp", mo: "Sĩ số lớp 10A đầu năm",
        tt: "Lớp <b>khá đông</b>.",
        lam: "Kê đủ <b>38 chỗ ngồi</b>, in đủ 38 đề kiểm tra." },
      { ten: "Số tuổi", mo: "Tuổi của một người trong hồ sơ",
        tt: "Người này <b>đã trưởng thành</b>.",
        lam: "Không liên quan gì tới sốt hay trời nóng." }
    ];

    var DIEM = [7, 5, 9, 4, 7];   /* tổng 32, trung bình 6,4, cao nhất 9 */

    /* Tính THẬT từ mảng — không gán cứng, để sửa mảng là mọi con số tự đổi theo. */
    function tinhTong() {
      var s = 0, i;
      for (i = 0; i < DIEM.length; i++) s += DIEM[i];
      return s;
    }
    function tinhMax() {
      var m = DIEM[0], i;
      for (i = 1; i < DIEM.length; i++) if (DIEM[i] > m) m = DIEM[i];
      return m;
    }
    function soVN(x) { return String(x).replace(".", ","); }

    var TONG = tinhTong();
    var TB = TONG / DIEM.length;
    var MAX = tinhMax();

    var CHANG = [
      { ten: "Nhập (Input)", mo: "Bàn phím, cảm biến, tệp — số liệu thô đi vào máy" },
      { ten: "Lưu trữ (Storage)", mo: "Cất vào bộ nhớ để lát nữa còn dùng lại" },
      { ten: "Xử lí (Processing)", mo: "Tính tổng, trung bình, tìm giá trị lớn nhất" },
      { ten: "Xuất (Output)", mo: "Hiện lên màn hình, in ra giấy, gửi đi" }
    ];

    var MANH = [
      { v: "Tính rất nhanh", ok: 1, vs: "Hàng triệu phép tính mỗi giây; người tính tay cả buổi chưa xong." },
      { v: "Chính xác", ok: 1, vs: "Máy không tự sai số học. Sai là do người nhập sai hoặc lập trình sai." },
      { v: "Làm liên tục không mệt", ok: 1, vs: "Chạy suốt ngày đêm, lần thứ một triệu vẫn làm y như lần đầu." },
      { v: "Lưu được rất nhiều", ok: 1, vs: "Một thẻ nhớ bé xíu chứa được hàng chục nghìn quyển sách." },
      { v: "Truyền đi xa tức thì", ok: 1, vs: "Gửi bảng điểm này đi nửa vòng Trái Đất chỉ mất vài giây." },
      { v: "Sáng tạo ngoài dữ liệu đã có", ok: 0, vs: "Không có trong dữ liệu thì máy không nghĩ ra được." },
      { v: "Hiểu ngữ cảnh", ok: 0, vs: "38 là sốt hay cỡ giày — con người phải nói cho máy biết." },
      { v: "Ra quyết định", ok: 0, vs: "Máy đưa ra 6,4; còn “có phụ đạo không” là việc của thầy cô." }
    ];

    var B_KET1 = 6, B_NHAP = 7, B_XL = 9, B_XUAT = 10, B_QD = 11, B_HET = 12;

    var b = 0;      /* bước hiện tại */
    var nc = -1;    /* ngữ cảnh đang chọn, -1 là chưa chọn */

    var node = MH.el(MH.khung("Cùng một con số 38 — đổi ngữ cảnh là đổi hẳn nghĩa",
      "Máy tính lưu được con số, nhưng <b>ngữ cảnh là do con người cung cấp</b>. Bấm chọn một ngữ " +
      "cảnh để xem <b>thông tin</b> rút ra, rồi bấm “Bước tiếp” đi hết chu trình xử lí của máy.",
      '<div class="mh10-bien" data-mh="so"></div>' +
      '<div class="mh7-ds" data-mh="ds" style="margin-top:11px"></div>' +
      '<div class="mh7-ghi" data-mh="y1" hidden></div>' +
      '<div data-mh="p2" hidden style="margin-top:13px">' +
        '<div class="mh9-so" data-mh="chang"></div>' +
        '<div class="mh9-noi"></div>' +
        '<div class="mh9-so" data-mh="qd"></div>' +
        '<div class="mh10-day" data-mh="day" style="margin:12px 0 0"></div>' +
        '<div class="mh10-bien" data-mh="ket"></div>' +
        '<div class="mh10-out" data-mh="out" style="margin-top:11px"></div>' +
      "</div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<table class="mh4-b" data-mh="bang" style="margin:11px auto 0" hidden></table>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    function veDs() {
      var o = node.querySelector('[data-mh="ds"]'), ms, i;
      o.innerHTML = NC.map(function (c, k) {
        return '<div class="mh7-m' + (k === nc ? " nay" : "") + '" data-i="' + k + '">' +
          '<b class="van">' + esc(c.ten) + "</b><small>" + esc(c.mo) + "</small></div>";
      }).join("");
      /* innerHTML vừa ghi đè toàn bộ nên phải gắn lại onclick sau MỖI lần vẽ. */
      ms = o.querySelectorAll(".mh7-m");
      for (i = 0; i < ms.length; i++) {
        ms[i].onclick = function () {
          nc = Number(this.getAttribute("data-i"));
          if (b < B_KET1) b = nc + 1;
          ve(); noi();
        };
      }
    }

    function ve() {
      node.querySelector('[data-mh="so"]').innerHTML =
        '<div class="mh10-b nay"><b>dữ liệu</b><i>38</i></div>' +
        '<div class="mh10-b' + (nc < 0 ? " none" : "") + '"><b>ngữ cảnh</b><i>' +
          esc(nc < 0 ? "chưa có" : NC[nc].ten) + "</i></div>";
      veDs();

      var y1 = node.querySelector('[data-mh="y1"]');
      y1.hidden = nc < 0;
      y1.className = "mh7-ghi" + (nc < 0 ? "" : " xong");
      y1.innerHTML = nc < 0 ? "" :
        "<b>Thông tin rút ra:</b> " + NC[nc].tt + " &nbsp;<b>Việc phải làm:</b> " + NC[nc].lam;

      node.querySelector('[data-mh="p2"]').hidden = b < B_NHAP;
      var st = b - B_NHAP;   /* chặng đang sáng, âm nghĩa là chưa vào phần 2 */
      node.querySelector('[data-mh="chang"]').innerHTML = CHANG.map(function (c, i) {
        var lop = b < B_NHAP ? "cho" : (b >= B_QD || i < st ? "xong" : (i === st ? "nay" : "cho"));
        return '<div class="mh9-tb ' + lop + '"><b>' + esc(c.ten) + "</b><small>" +
          esc(c.mo) + "</small></div>";
      }).join("");
      node.querySelector('[data-mh="qd"]').innerHTML =
        '<div class="mh9-tb ' + (b >= B_QD ? "hong" : "cho") + '"><b>Hiểu nghĩa và quyết định</b>' +
        "<small>Chặng này máy KHÔNG làm được — chỉ con người làm</small></div>";

      node.querySelector('[data-mh="day"]').innerHTML = DIEM.map(function (d) {
        var lop = b >= B_XL && d === MAX ? "nay" : "co";
        return '<div class="mh10-o ' + lop + '">' + esc(d) + "</div>";
      }).join("");

      var xong = b >= B_XL;
      node.querySelector('[data-mh="ket"]').innerHTML =
        '<div class="mh10-b' + (xong ? " nay" : " none") + '"><b>tổng</b><i>' +
          esc(xong ? TONG : "?") + "</i></div>" +
        '<div class="mh10-b' + (xong ? " nay" : " none") + '"><b>trung bình</b><i>' +
          esc(xong ? soVN(TB.toFixed(1)) : "?") + "</i></div>" +
        '<div class="mh10-b' + (xong ? " nay" : " none") + '"><b>cao nhất</b><i>' +
          esc(xong ? MAX : "?") + "</i></div>";

      var ra = '<div class="trong">(chưa xuất gì ra màn hình)</div>';
      if (b >= B_XUAT) {
        ra = "<div>BANG DIEM LOP 10A</div><div>So bai: " + esc(DIEM.length) + "</div>" +
          "<div>Tong diem: " + esc(TONG) + "</div>" +
          "<div>Trung binh: " + esc(soVN(TB.toFixed(1))) + "</div>" +
          "<div>Cao nhat: " + esc(MAX) + "</div>";
        if (b >= B_QD) ra += '<div class="trong">Máy dừng ở đây. Không có dòng nào nói lớp ' +
          "này cần phụ đạo hay không.</div>";
      }
      node.querySelector('[data-mh="out"]').innerHTML = ra;

      var dem = node.querySelector('[data-mh="dem"]');
      if (b < B_NHAP) {
        dem.innerHTML = "Dữ liệu: <b>38</b> · Ngữ cảnh: <b>" +
          esc(nc < 0 ? "chưa có" : NC[nc].ten) + "</b>" +
          (nc < 0 ? " → chưa rút ra được thông tin nào" : "");
      } else {
        dem.innerHTML = "Chặng: <b>" + esc(b >= B_QD ? "Quyết định (con người)" :
          CHANG[Math.min(st, CHANG.length - 1)].ten) + "</b>";
      }

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = b < B_QD;
      canh.innerHTML = b < B_QD ? "" :
        "Máy xuất ra <b>" + esc(soVN(TB.toFixed(1))) + "</b> rồi thôi. <b>Xuất ra một con số chưa " +
        "phải là ra quyết định.</b> Lớp này có cần phụ đạo không còn tuỳ chuẩn của trường, tuỳ đề " +
        "khó hay dễ, tuỳ hôm đó lớp vắng mấy bạn — máy không biết những thứ ấy.";

      var bang = node.querySelector('[data-mh="bang"]');
      bang.hidden = b < B_HET;
      bang.innerHTML = b < B_HET ? "" :
        "<tr><th>Việc</th><th>Máy làm được?</th><th>Vì sao</th></tr>" +
        MANH.map(function (m) {
          return '<tr class="' + (m.ok ? "khop" : "rac") + '"><td>' + esc(m.v) + "</td><td>" +
            esc(m.ok ? "Được, hơn hẳn người" : "Không") + "</td><td>" + esc(m.vs) + "</td></tr>";
        }).join("");
    }

    function noi() {
      if (b === 0) {
        loi("Đây là con số <b>38</b> trơ trọi — mới chỉ là <b>dữ liệu</b>. Nó chưa nói lên điều gì, " +
          "vì em chưa biết nó đo cái gì. Bấm chọn một ngữ cảnh bên dưới.");
      } else if (b <= 5) {
        loi("Ngữ cảnh <b>" + esc(NC[nc].ten) + "</b>. Con số vẫn là 38, không đổi một li — nhưng " +
          "<b>nghĩa</b> vừa đổi hẳn. Thử bấm sang ngữ cảnh khác mà xem.");
      } else if (b === B_KET1) {
        loi("Năm lần chọn, năm nghĩa khác nhau, mà <b>số 38 không hề đổi</b>. Vậy: dữ liệu là thứ " +
          "được ghi lại; <b>thông tin là ý nghĩa rút ra từ dữ liệu</b>, và nghĩa chỉ có khi biết " +
          "ngữ cảnh. Máy lưu được 38, còn ngữ cảnh là do <b>con người</b> cung cấp.");
      } else if (b === B_NHAP) {
        loi("<b>Nhập:</b> năm con số điểm đi vào máy — gõ bàn phím, đọc từ tệp, hay lấy từ cảm " +
          "biến đều được. Lúc này chúng vẫn chỉ là <b>dữ liệu thô</b>.");
      } else if (b === B_NHAP + 1) {
        loi("<b>Lưu trữ:</b> máy cất năm con số vào bộ nhớ. Nhờ vậy lát nữa tính xong vẫn còn " +
          "bản gốc để đối chiếu, và mai mở lại vẫn dùng được.");
      } else if (b === B_XL) {
        loi("<b>Xử lí:</b> máy cộng ra <b>" + esc(TONG) + "</b>, chia ra <b>" +
          esc(soVN(TB.toFixed(1))) + "</b>, dò ra cao nhất là <b>" + esc(MAX) + "</b> — xong trong " +
          "vài phần triệu giây. <b>Máy không tự sai số học</b>; sai thường là do người nhập sai " +
          "số hoặc lập trình sai.");
      } else if (b === B_XUAT) {
        loi("<b>Xuất:</b> kết quả hiện lên màn hình, in ra giấy được, gửi đi được. Đến đây máy đã " +
          "làm xong phần việc của nó.");
      } else if (b === B_QD) {
        loi("Chặng cuối: <b>từ kết quả tính ra quyết định</b>. Trung bình " +
          esc(soVN(TB.toFixed(1))) + " thì kết luận gì? Máy <b>không biết</b> — nó chỉ đưa ra con số.");
      } else {
        loi("<b>Máy giỏi chặng xử lí; con người mới làm được chặng hiểu nghĩa và quyết định.</b> " +
          "Máy tính lưu và xử lí <b>dữ liệu</b>, chứ không “hiểu” thông tin.");
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= B_HET) {
        loi("Hết các bước rồi. Bấm thẳng vào một ngữ cảnh ở trên để xem lại phần đầu, hoặc bấm " +
          "“Làm lại” để chạy từ đầu.");
        return;
      }
      b++;
      if (b >= 1 && b <= 5) nc = b - 1;
      ve(); noi();
    };

    function lamLai() { b = 0; nc = -1; ve(); noi(); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-02 · MỌI DỮ LIỆU ĐỀU THÀNH DÃY BIT
   *
   *  KHÔNG lặp lại phần đổi hệ nhị phân (đã có ở bài khác) và đơn vị đo dữ
   *  liệu. Bài này chỉ đánh đúng một ý: chữ, ảnh, tiếng — ba thứ trông
   *  chẳng liên quan gì nhau — cuối cùng đều nằm trong máy dưới dạng dãy
   *  0/1, và mỗi lần quy đổi đều là một QUY ƯỚC do người đặt ra.
   * ================================================================ */
  MH.dangKy("C10-02", function (host) {
    var MAU_GOC = [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0];   /* hình chiếc nhẫn 4x4 */
    var anh = MAU_GOC.slice();
    var chuoi = [], L = 0, b = 0;

    var node = MH.el(MH.khung(
      "Chữ, ảnh, âm thanh — cuối cùng đều là một dãy 0 và 1",
      "Máy tính <b>không lưu chữ, không lưu màu, không lưu tiếng</b>. Nó chỉ lưu được bit. " +
      "Ba phần dưới đây cho em thấy ba loại dữ liệu quen thuộc bị quy về dãy bit như thế nào.",

      '<div class="mh9-so" data-mh="pha" style="margin-bottom:12px"></div>' +

      '<div data-mh="p1">' +
        '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
        '<p class="mh8-dem" data-mh="dem1"></p></div>' +

      '<div data-mh="p2" hidden>' +
        '<div data-mh="luoi"></div>' +
        '<div class="mh10-day" data-mh="bit2" style="margin:11px 0"></div>' +
        '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang2"></table></div>' +
        '<p class="mh8-dem" data-mh="dem2"></p></div>' +

      '<div data-mh="p3" hidden>' +
        '<div data-mh="ve3"></div>' +
        '<div class="mh10-day" data-mh="mau" style="margin:9px 0"></div>' +
        '<p class="mh8-dem" data-mh="dem3"></p></div>' +

      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',

      '<label for="mhC02t">Từ cần lưu:</label>' +
      '<input class="mh-o-nhap" id="mhC02t" data-mh="tu" type="text" value="Tin" maxlength="8">' +
      '<label for="mhC02s">Số mẫu âm thanh:</label>' +
      '<select class="mh-o-nhap" id="mhC02s" data-mh="ts">' +
      '<option value="4">4 mẫu (ít)</option><option value="8" selected>8 mẫu</option>' +
      '<option value="16">16 mẫu (nhiều)</option></select>'));

    var loi = loiCua(node);
    function q(t) { return node.querySelector('[data-mh="' + t + '"]'); }

    /* padStart không có trong ES5 nên tự đệm. */
    function bin8(n) { var s = n.toString(2); while (s.length < 8) s = "0" + s; return s; }

    /* Byte UTF-8 thật của một kí tự — nhờ nó mà "ế tốn 3 byte" là số đo được,
       không phải lời kể. */
    function utf8(cp) {
      if (cp < 0x80) return [cp];
      if (cp < 0x800) return [0xC0 | (cp >> 6), 0x80 | (cp & 63)];
      return [0xE0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63)];
    }
    function docTu() {
      var t = String(q("tu").value || "").replace(/\s+/g, "");
      return (t || "Tin").split("").slice(0, 6);
    }
    function soMau() { return Math.floor(Number(q("ts").value)) || 8; }

    /* Sóng âm: tổng hai dao động hình sin, tính thật tại mọi x. */
    function song(x) {
      var a = 2 * Math.PI * 1.5 * x / 320;
      return 0.75 * Math.sin(a) + 0.25 * Math.sin(2 * a);
    }
    function yv(v) { return (60 - 40 * v).toFixed(1); }
    function mucQ(x) {                       /* làm tròn về 1 trong 16 mức (4 bit) */
      var v = Math.max(-1, Math.min(1, song(x)));
      return Math.round((v + 1) / 2 * 15);
    }
    function yq(m) { return (60 - 40 * ((2 * m - 15) / 15)).toFixed(1); }

    function veLuoi(to) {
      var h = "", r, c, i, k, os;
      var n = to ? 8 : 4;                    /* phóng to: mỗi điểm ảnh hoá 2x2 ô */
      for (r = 0; r < n; r++) {
        h += '<div class="mh10-day" style="margin-bottom:5px">';
        for (c = 0; c < n; c++) {
          i = to ? ((r >> 1) * 4 + (c >> 1)) : (r * 4 + c);
          h += '<div class="mh10-o' + (anh[i] ? " co" : "") + '" data-i="' + i + '">' + anh[i] + "</div>";
        }
        h += "</div>";
      }
      var o = q("luoi");
      o.innerHTML = h;
      /* Gắn lại onclick sau MỖI lần vẽ, vì các ô cũ đã bị xoá khỏi DOM. */
      os = o.querySelectorAll(".mh10-o");
      for (k = 0; k < os.length; k++) {
        os[k].onclick = function () {
          anh[Number(this.getAttribute("data-i"))] ^= 1;
          ve();
          loi("Em vừa đổi một điểm ảnh. Dãy bit và dung lượng bên dưới <b>tính lại ngay</b> — " +
            "vì bức ảnh này <b>chính là</b> dãy bit đó, không có gì khác.");
        };
      }
    }

    function ve() {
      var i, h, x, m, n, cp, by;

      /* --- thanh ba phần --- */
      var ten = ["Chữ", "Ảnh", "Âm thanh"], moc = [L + 2, L + 6, L + 11];
      var pha = b <= L + 2 ? 0 : (b <= L + 6 ? 1 : 2);
      h = "";
      for (i = 0; i < 3; i++) {
        h += '<div class="mh9-tb' + (i === pha ? " nay" : (b > moc[i] ? " xong" : " cho")) + '">' +
          "<b>" + ten[i] + "</b><small>" + ["mã ASCII / Unicode", "lưới điểm ảnh", "lấy mẫu sóng"][i] +
          "</small></div>";
      }
      q("pha").innerHTML = h;
      q("p1").hidden = pha !== 0; q("p2").hidden = pha !== 1; q("p3").hidden = pha !== 2;

      /* --- PHẦN 1: chữ --- */
      h = "<tr><th>Kí tự</th><th>Mã (thập phân)</th><th>Trong máy (mỗi byte 8 bit)</th><th>Byte</th></tr>";
      var tongByte = 0;
      for (i = 0; i < L; i++) {
        cp = chuoi[i].charCodeAt(0); by = utf8(cp); tongByte += by.length;
        var hien = b > i;
        var cls = !hien ? "" : (b === i + 1 ? "nay" : (cp < 128 ? "khop" : "rac"));
        h += "<tr" + (cls ? ' class="' + cls + '"' : "") + "><td>" + esc(chuoi[i]) + "</td><td>" +
          (hien ? cp : "—") + "</td><td>" +
          (hien ? by.map(bin8).join(" ") : "—") + "</td><td>" + (hien ? by.length : "—") + "</td></tr>";
      }
      q("bang").innerHTML = h;
      q("dem1").innerHTML = b < L + 1 ? "" :
        "Từ này có <b>" + L + "</b> kí tự nhưng chiếm <b>" + tongByte + "</b> byte trong máy.";

      /* --- PHẦN 2: ảnh --- */
      veLuoi(b >= L + 6);
      h = ""; var sang = 0;
      for (i = 0; i < 16; i++) { sang += anh[i]; h += '<div class="mh10-o' + (anh[i] ? " co" : "") + '">' + anh[i] + "</div>"; }
      q("bit2").innerHTML = b >= L + 4 ? h : "";
      if (b >= L + 5) {
        q("bang2").innerHTML =
          "<tr><th>Ảnh</th><th>Số điểm ảnh</th><th>Bit mỗi điểm</th><th>Thành</th></tr>" +
          '<tr class="khop"><td>Lưới trên (đen trắng)</td><td>16</td><td>1</td><td>16 bit = 2 byte</td></tr>' +
          '<tr class="nay"><td>Lưới trên (màu RGB)</td><td>16</td><td>24</td><td>384 bit = 48 byte</td></tr>' +
          "<tr><td>Ảnh 1920×1080 màu</td><td>2 073 600</td><td>24</td><td>6 220 800 byte ≈ 5,9 MB</td></tr>";
      } else { q("bang2").innerHTML = ""; }
      q("dem2").innerHTML = b < L + 4 ? "" :
        "Đang có <b>" + sang + "</b> điểm đen / 16 điểm · ảnh này là dãy <b>16 bit</b>.";

      /* --- PHẦN 3: âm thanh --- */
      n = soMau();
      var pGoc = [], pNoi = [], cham = "";
      for (x = 0; x <= 320; x += 4) pGoc.push(x + "," + yv(song(x)));
      for (i = 0; i < n; i++) {
        x = i * 320 / (n - 1); m = mucQ(x);
        pNoi.push(x.toFixed(1) + "," + yq(m));
        cham += '<circle cx="' + x.toFixed(1) + '" cy="' + yq(m) + '" r="3.5" fill="var(--primary)"></circle>';
      }
      q("ve3").innerHTML =
        '<svg viewBox="0 0 320 120" style="width:100%;height:120px">' +
        '<line x1="0" y1="60" x2="320" y2="60" stroke="var(--border)" stroke-width="1"></line>' +
        '<polyline points="' + pGoc.join(" ") + '" fill="none" stroke="var(--text-soft)" stroke-width="1.6"></polyline>' +
        (b >= L + 9 ? '<polyline points="' + pNoi.join(" ") + '" fill="none" stroke="var(--primary)" stroke-width="2.4"></polyline>' : "") +
        (b >= L + 8 ? cham : "") + "</svg>";
      h = "";
      if (b >= L + 9) for (i = 0; i < n; i++) h += '<div class="mh10-o co">' + mucQ(i * 320 / (n - 1)) + "</div>";
      q("mau").innerHTML = h;
      q("dem3").innerHTML = b < L + 10 ? "" :
        "<b>" + n + "</b> mẫu × <b>4</b> bit = <b>" + (n * 4) + "</b> bit = " + (n / 2) +
        " byte · 1 giây nhạc CD: 44 100 × 16 × 2 = 1 411 200 bit ≈ 172 KB.";

      /* --- cảnh báo đúng chỗ ngộ nhận --- */
      var canh = q("canh");
      canh.hidden = !(b === L + 2 || b === L + 6);
      if (b === L + 2) {
        canh.innerHTML = "<b>Số byte không bằng số kí tự.</b> Một chữ tiếng Việt có dấu như " +
          "<b>ế</b>, <b>ộ</b>, <b>ữ</b> phải dùng <b>2–3 byte</b> theo Unicode, vì bảng ASCII cũ " +
          "chỉ có 128 chỗ, không còn ô nào cho dấu tiếng Việt. Đề hay hỏi “văn bản 10 kí tự nặng " +
          "bao nhiêu byte” — phải hỏi lại: <b>kí tự gì đã</b>.";
      } else if (b === L + 6) {
        canh.innerHTML = "<b>Phóng to ảnh không làm ảnh nét hơn.</b> Vẫn đúng 16 điểm ảnh cũ, mỗi " +
          "điểm chỉ được vẽ to gấp 4 lần nên ta thấy các ô vuông — đó là ảnh <b>bị vỡ</b>. Máy " +
          "không thể <b>bịa</b> thêm chi tiết mà nó chưa từng lưu.";
      }

      var ghi = q("ghi");
      ghi.hidden = b < L + 11;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Ba phần vừa rồi đều làm <b>một việc giống nhau</b>: quy dữ liệu về dãy bit. " +
          "<b>(1)</b> Máy tính chỉ lưu được 0 và 1 — chữ, ảnh, nhạc đều phải đổi thành số trước. " +
          "<b>(2)</b> Bảng mã ASCII/Unicode là <b>thoả thuận do con người đặt ra</b>, không phải " +
          "tính chất tự nhiên của chữ cái; đổi bảng mã là đọc ra chữ khác. <b>(3)</b> Ảnh và âm " +
          "thanh vốn <b>liên tục</b>, máy phải cắt thành điểm ảnh và mẫu <b>rời rạc</b>: càng " +
          "nhiều điểm ảnh, càng nhiều mẫu thì càng giống thật, đổi lại <b>càng tốn dung lượng</b>.";
      }
    }

    q("tien").onclick = function () {
      if (b >= L + 11) {
        loi("Đã đi hết ba phần. Em có thể <b>gõ từ khác</b> (thử một từ có dấu), <b>bấm vào lưới " +
          "điểm ảnh</b> để đổi ảnh, hoặc đổi <b>số mẫu</b> ở trên rồi xem lại.");
        return;
      }
      b++;
      ve();
      if (b <= L) {
        var cp = chuoi[b - 1].charCodeAt(0), by = utf8(cp);
        loi("Kí tự <b>" + esc(chuoi[b - 1]) + "</b> được tra bảng mã, ra số <b>" + cp + "</b>. Số này " +
          "viết ở dạng nhị phân là <b>" + by.map(bin8).join(" ") + "</b> — " + (cp < 128
            ? "vừa đúng <b>1 byte</b> (8 bit), đây là vùng của bảng <b>ASCII</b>."
            : "phải dùng tới <b>" + by.length + " byte</b>, vì mã <b>" + cp + "</b> vượt xa 127 nên " +
              "không nằm trong ASCII mà nằm trong <b>Unicode</b>."));
      } else if (b === L + 1) {
        loi("Trong máy giờ chỉ còn <b>một dãy bit</b> — không có chữ nào cả. Máy đọc lại đúng từ này " +
          "được là nhờ nó dùng <b>cùng một bảng mã</b> với máy đã ghi. Bảng mã là <b>quy ước con " +
          "người đặt ra</b>: nếu hai máy dùng hai bảng khác nhau, cùng dãy bit ấy hiện ra chữ khác — " +
          "đó chính là hiện tượng văn bản bị lỗi phông.");
      } else if (b === L + 2) {
        loi("Đọc kĩ cột <b>Byte</b>: kí tự tiếng Anh 1 byte, kí tự tiếng Việt có dấu 2–3 byte.");
      } else if (b === L + 3) {
        loi("Sang <b>ảnh</b>. Bức ảnh này chỉ có <b>4×4 = 16 điểm ảnh</b>. Mỗi điểm mang đúng một " +
          "màu. Em <b>bấm vào từng ô</b> để đổi đen/trắng và xem mọi con số bên dưới đổi theo.");
      } else if (b === L + 4) {
        loi("Ảnh chỉ có hai màu nên mỗi điểm ảnh chỉ cần <b>1 bit</b>: 1 là đen, 0 là trắng — lại " +
          "một <b>quy ước</b>. Đọc lưới từ trái sang phải, từ trên xuống dưới, ta được đúng dãy 16 " +
          "bit ở dưới. Bức ảnh <b>chính là</b> dãy bit đó.");
      } else if (b === L + 5) {
        loi("Ảnh màu thì mỗi điểm phải ghi <b>3 kênh R, G, B</b>, mỗi kênh 8 bit — tức <b>24 bit " +
          "mỗi điểm</b>, gấp 24 lần. Bảng trên nhân ra: cùng 16 điểm ảnh mà từ 2 byte thành 48 byte.");
      } else if (b === L + 6) {
        loi("Cùng bức ảnh ấy, phóng to gấp đôi.");
      } else if (b === L + 7) {
        loi("Sang <b>âm thanh</b>. Đường xám là sóng âm thật — nó <b>liên tục</b>, tại mỗi thời điểm " +
          "dù nhỏ đến đâu cũng có một giá trị. Máy tính không thể lưu vô hạn giá trị như vậy.");
      } else if (b === L + 8) {
        loi("Máy <b>lấy mẫu</b>: cứ sau những khoảng thời gian <b>đều nhau</b>, nó đo độ cao của sóng " +
          "đúng một lần — đó là các chấm xanh. Giữa hai chấm, máy <b>không biết gì cả</b>.");
      } else if (b === L + 9) {
        loi("Mỗi mẫu được làm tròn thành <b>một số</b> (ở đây 16 mức, tức 4 bit) — dãy số dưới hình. " +
          "Khi phát lại, máy chỉ nối các số ấy: đó là đường xanh. Đổi <b>số mẫu</b> ở trên để thấy " +
          "<b>càng nhiều mẫu thì đường xanh càng bám sát sóng xám</b>.");
      } else if (b === L + 10) {
        loi("Dung lượng = <b>số mẫu mỗi giây × số bit mỗi mẫu</b> (× số kênh). Muốn nghe giống thật " +
          "hơn thì phải lấy nhiều mẫu hơn, và tệp <b>nặng lên</b> đúng theo tỉ lệ đó.");
      } else {
        loi("Xong ba phần. Đọc kĩ phần kết luận màu xanh bên dưới.");
      }
    };

    function lamLai() {
      chuoi = docTu(); L = chuoi.length; b = 0; anh = MAU_GOC.slice();
      ve();
      loi("Bảng trên đang trống cột mã. Bấm <b>“Bước tiếp”</b> để xem máy tra bảng mã cho <b>từng kí " +
        "tự</b> một, rồi đi tiếp sang ảnh và âm thanh.");
    }
    ganDatLai(node, [q("tu"), q("ts")], lamLai);
    host.appendChild(node);
    lamLai();
  });

  /* ==================================================================
   *  C10-07 · AN TOÀN THÔNG TIN CÁ NHÂN
   *
   *  Câu "đặt mật khẩu mạnh vào" là câu nói suông cho tới khi nó biến thành
   *  một con số. Nên phần chính của minh hoạ này là một MÁY TÍNH THẬT: gõ mật
   *  khẩu vào, nó tính R^n rồi chia cho tốc độ dò, ra thời gian đọc được bằng
   *  tiếng Việt. Con số tự nó đánh sập ngộ nhận "rắc rối = mạnh": mật khẩu 18
   *  kí tự toàn chữ thường lâu hơn mật khẩu 12 kí tự đủ loại tới hàng trăm
   *  triệu lần, và học sinh THẤY được điều đó chứ không phải nghe kể.
   * ================================================================ */
  MH.dangKy("C10-07", function (host) {
    var TOC = 1e9;                 /* giả định: máy thử 1 tỉ mật khẩu mỗi giây */
    var NAM = 31557600;            /* số giây trong một năm */
    var MAU = ["123456", "matkhau", "Matkhau1", "Ng@ySinh2007", "con-meo-an-ca-ranh"];
    var buoc;

    /* --- Bộ kí tự: mỗi loại có mặt thì cộng cỡ của loại đó vào cơ số R --- */
    function boKiTu(mk) {
      var co = { thuong: false, hoa: false, so: false, dac: false }, i, c;
      for (i = 0; i < mk.length; i++) {
        c = mk.charAt(i);
        if (c >= "a" && c <= "z") co.thuong = true;
        else if (c >= "A" && c <= "Z") co.hoa = true;
        else if (c >= "0" && c <= "9") co.so = true;
        else co.dac = true;
      }
      co.phan = [];
      if (co.thuong) co.phan.push(26);
      if (co.hoa) co.phan.push(26);
      if (co.so) co.phan.push(10);
      if (co.dac) co.phan.push(32);
      co.R = co.phan.reduce(function (a, b) { return a + b; }, 0);
      return co;
    }

    /* --- Đọc số cho ra tiếng Việt. Không bao giờ được in "1e+45" ra màn hình:
       học sinh lớp 10 đọc dòng đó là hết hiểu, mà con số mới là điểm ăn tiền. */
    var THANG = [[1e18, "tỉ tỉ"], [1e15, "triệu tỉ"], [1e12, "nghìn tỉ"],
                 [1e9, "tỉ"], [1e6, "triệu"], [1e3, "nghìn"]];
    function so1(x) {
      var s = x >= 100 ? String(Math.round(x)) : x.toFixed(1);
      return s.replace(/\.0$/, "").replace(".", ",");
    }
    function docSo(x) {
      if (!isFinite(x) || x >= 1e21) return "nhiều tỉ tỉ";
      if (x < 1000) return so1(x);
      for (var i = 0; i < THANG.length; i++) if (x >= THANG[i][0]) return so1(x / THANG[i][0]) + " " + THANG[i][1];
      return so1(x);
    }
    /* Quá 1e15 thì mọi tên gọi đều vô nghĩa với các em — đếm số chữ số dễ hình dung hơn. */
    function docToHop(x) {
      if (!isFinite(x)) return "lớn tới mức máy tính này không viết nổi";
      if (x < 1e15) return docSo(x);
      return "một số có " + (Math.floor(Math.log(x) / Math.LN10) + 1) + " chữ số";
    }
    function docGio(giay) {
      if (!isFinite(giay) || giay / NAM >= 1e21) return "nhiều tỉ tỉ năm";
      if (giay < 1) return "dưới một giây";
      if (giay < 60) return so1(giay) + " giây";
      if (giay < 3600) return so1(giay / 60) + " phút";
      if (giay < 86400) return so1(giay / 3600) + " giờ";
      if (giay < NAM) return so1(giay / 86400) + " ngày";
      var nam = giay / NAM;
      if (nam < 100) return so1(nam) + " năm";
      if (nam < 1e5) return so1(nam / 100) + " thế kỉ";
      return docSo(nam) + " năm";
    }

    /* --- Bẫy quan trọng: mọi con số trên đây chỉ đúng khi máy dò MÒ TỪNG TỔ HỢP.
       Mật khẩu là một từ có trong từ điển thì máy thử danh sách từ trước, và thay
       a bằng @ không thoát được vì biến thể leet nằm ngay trong danh sách đó. */
    var TU_DIEN = ["matkhau", "password", "qwerty", "iloveyou", "ngaysinh", "admin", "meomeo", "hocsinh", "vietnam"];
    function laTuQuen(mk) {
      var t = mk.toLowerCase().replace(/@/g, "a").replace(/\$/g, "s").replace(/!/g, "i");
      var boSo = t.replace(/[^a-z]/g, "");
      var leet = t.replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/5/g, "s").replace(/[^a-z]/g, "");
      for (var i = 0; i < TU_DIEN.length; i++) if (boSo === TU_DIEN[i] || leet === TU_DIEN[i]) return TU_DIEN[i];
      return null;
    }

    function tinh(mk) {
      var b = boKiTu(mk), n = mk.length, th = n ? Math.pow(b.R, n) : 0;
      return { mk: mk, b: b, n: n, toHop: th, giay: th / TOC };
    }

    var node = MH.el(MH.khung(
      "Mật khẩu của em trụ được bao lâu?",
      "Gõ một mật khẩu vào ô dưới, máy sẽ <b>tính thật</b> số tổ hợp và thời gian dò ra nó. " +
      "Giả định: kẻ xấu có máy thử <b>1 tỉ mật khẩu mỗi giây</b>. " +
      "<b>Đừng gõ mật khẩu thật của em vào đây</b> — đây chỉ là bài học, hãy gõ một mật khẩu bịa ra.",
      '<div class="mh9-so" data-mh="bo"></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh10-out" data-mh="out"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh4-cuon" data-mh="bang" hidden></div>' +
      '<div class="mh7-ds" data-mh="ds" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label>Mật khẩu thử:</label> <input class="mh-o-nhap" type="text" data-mh="mk" value="123456" maxlength="40"> ' +
      MAU.map(function (m) { return '<button class="mh4-nut" data-mk="' + esc(m) + '">' + esc(m) + "</button>"; }).join(" ")
    ));

    var loi = loiCua(node);
    var oMk = node.querySelector('[data-mh="mk"]');
    function docMk() { return oMk.value; }

    /* Bốn bước cuối: mật khẩu mạnh mới là một phần, ba phần còn lại nằm ở đây. */
    var BUOC_SAU = [
      ["Mật khẩu mạnh vẫn vô dụng nếu em dùng lại ở nhiều nơi",
       "Một trang web nhỏ bị lộ dữ liệu là kẻ xấu có đúng cặp email + mật khẩu của em. " +
       "Chúng đem cặp đó thử thẳng vào Facebook, email, ngân hàng — gọi là <b>nhồi thông tin đăng nhập</b>. " +
       "Mật khẩu 18 kí tự cũng thua, vì chúng không phải dò gì cả, chúng đã có sẵn."],
      ["Bật xác thực hai bước — lớp bảo vệ đáng giá nhất",
       "Kể cả khi kẻ xấu biết đúng mật khẩu, chúng vẫn thiếu <b>mã trên điện thoại em</b> nên không vào được. " +
       "Đây là thứ chặn được cả trường hợp mật khẩu đã lộ mà em chưa hay biết."],
      ["Có những thứ đừng bao giờ đăng công khai",
       "<b>Ngày sinh đầy đủ</b>: là câu hỏi xác minh của ngân hàng và tổng đài. " +
       "<b>Số căn cước</b>: đủ để người khác đăng kí dịch vụ dưới tên em. " +
       "<b>Ảnh vé máy bay</b>: mã đặt chỗ trên đó cho người lạ đổi hoặc huỷ chuyến của gia đình em. " +
       "<b>Ảnh thẻ học sinh</b>: lộ họ tên, lớp, trường, ảnh mặt — đủ để giả làm em nhắn tin cho bạn bè."],
      ["App xin quyền không liên quan thì phải nghi ngờ",
       "App đèn pin chỉ cần bật đèn. Nó xin quyền <b>đọc danh bạ</b> và <b>vị trí</b> thì đó không phải nhầm lẫn — " +
       "danh bạ và vị trí bán được tiền. Trước khi cài, em đọc danh sách quyền và tự hỏi: chức năng chính có cần cái này không?"]
    ];

    function hangBang(t, laNay) {
      var c = laNay ? "nay" : (t.giay < 86400 ? "rac" : (t.giay / NAM >= 1000 ? "khop" : ""));
      return '<tr class="' + c + '"><td>' + esc(t.mk) + "</td><td>" + t.n + "</td><td>" + t.b.R +
        "</td><td>" + docToHop(t.toHop) + "</td><td><b>" + docGio(t.giay) + "</b></td></tr>";
    }

    function ve() {
      var t = tinh(docMk()), b = t.b;

      var DS_BO = [["Chữ thường", "a…z", 26, b.thuong], ["Chữ hoa", "A…Z", 26, b.hoa],
                   ["Chữ số", "0…9", 10, b.so], ["Kí tự đặc biệt", "@ # ! -", 32, b.dac]];
      node.querySelector('[data-mh="bo"]').innerHTML = DS_BO.map(function (o) {
        return '<div class="mh9-tb ' + (o[3] ? "xong" : "cho") + '"><b>' + (o[3] ? "+" + o[2] : "—") +
          "</b><small>" + o[0] + "<br>" + esc(o[1]) + "</small></div>";
      }).join("");

      node.querySelector('[data-mh="dem"]').innerHTML = t.n
        ? "cơ số <b>R = " + b.R + "</b> · độ dài <b>n = " + t.n + "</b> · số tổ hợp <b>R<sup>n</sup></b>"
        : "<b>Chưa gõ gì cả</b> — mật khẩu rỗng thì không cần dò.";

      /* Bảng tính hiện dần từng dòng: dòng chưa tới để mờ, để học sinh biết
         phép tính còn đi tiếp chứ không tưởng là đã xong. */
      var DONG = [
        ["mật khẩu  =", esc(t.mk) || "(rỗng)"],
        ["độ dài  n =", String(t.n)],
        ["cơ số   R =", (b.phan.join(" + ") || "0") + " = " + b.R],
        ["số tổ hợp =", b.R + "^" + t.n + " = " + docToHop(t.toHop)],
        ["tốc độ dò =", "1 000 000 000 mật khẩu mỗi giây"],
        ["thời gian =", docGio(t.giay)]
      ];
      var hien = buoc <= 0 ? 2 : buoc === 1 ? 3 : buoc === 2 ? 4 : 6;
      var out = "", i;
      for (i = 0; i < DONG.length; i++) {
        var ro = i < hien;
        var lop = !ro ? "trong" : (i === 5 && t.giay < 86400 ? "loi" : "");
        out += '<div class="' + lop + '">' + DONG[i][0] + " " + (ro ? DONG[i][1] : "…") + "</div>";
      }
      node.querySelector('[data-mh="out"]').innerHTML = out;

      var canh = node.querySelector('[data-mh="canh"]'), tu = laTuQuen(t.mk);
      var toanSo = t.n > 0 && b.R === 10;
      canh.hidden = !(buoc >= 3 && (tu || toanSo));
      if (!canh.hidden) {
        canh.innerHTML = tu
          ? "Con số trên là <b>quá lạc quan</b>. Mật khẩu của em xoay quanh từ <b>" + esc(tu) +
            "</b> — một từ có trong từ điển. Máy dò thử danh sách từ trước, và nó thử luôn cả các biến thể " +
            "thay <b>a</b> bằng <b>@</b>, <b>o</b> bằng <b>0</b>. Thực tế nó bị dò ra trong <b>dưới một giây</b>."
          : "Mật khẩu toàn chữ số nên cơ số chỉ có <b>10</b>. Riêng dãy <b>" + esc(t.mk) +
            "</b> lại còn nằm trong danh sách mật khẩu phổ biến nhất — máy thử nó ở lần thử <b>đầu tiên</b>.";
      }

      var bang = node.querySelector('[data-mh="bang"]');
      bang.hidden = buoc < 4;
      if (buoc >= 4) {
        var h = '<table class="mh4-b"><tr><th>Mật khẩu</th><th>n</th><th>R</th><th>Số tổ hợp</th><th>Thời gian dò</th></tr>';
        for (i = 0; i < MAU.length; i++) h += hangBang(tinh(MAU[i]), MAU[i] === t.mk);
        if (MAU.indexOf(t.mk) < 0 && t.n) h += hangBang(t, true);
        bang.innerHTML = h + "</table>";
      }

      var ds = node.querySelector('[data-mh="ds"]');
      ds.hidden = buoc < 5;
      if (buoc >= 5) {
        ds.innerHTML = BUOC_SAU.map(function (o, k) {
          if (buoc < 5 + k) return "";
          return '<div class="mh7-m' + (buoc === 5 + k ? " nay" : "") + '"><b class="van">' + o[0] +
            "</b><small>" + o[1] + "</small></div>";
        }).join("");
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < 4;
      if (buoc >= 4) {
        ghi.className = buoc >= 8 ? "mh7-ghi xong" : "mh7-ghi";
        ghi.innerHTML = buoc >= 8
          ? "Bốn điều hay bị hiểu sai, gói lại: <b>(1) Dài quan trọng hơn rắc rối</b> — thêm một kí tự thì nhân " +
            "số tổ hợp lên gấp R lần, còn thêm một loại kí tự chỉ làm R to hơn một chút. <b>(2)</b> Thay <b>a</b> " +
            "bằng <b>@</b> không cứu được mật khẩu là một từ trong từ điển, máy thử biến thể đó đầu tiên. " +
            "<b>(3) Dùng lại mật khẩu là lỗi nguy hiểm nhất</b>, còn nguy hơn mật khẩu ngắn — một nơi lộ là mất tất cả. " +
            "<b>(4) Xoá bài đăng không có nghĩa là nó biến mất</b> — người khác đã kịp chụp màn hình từ lâu."
          : "Nhìn hai dòng cuối bảng: <b>Ng@ySinh2007</b> có <b>đủ bốn loại kí tự</b> mà vẫn thua xa " +
            "<b>con-meo-an-ca-ranh</b> — thứ trông “đơn giản” hơn hẳn, chỉ toàn chữ thường và gạch nối. " +
            "Lí do: nó <b>dài hơn 6 kí tự</b>. Mỗi kí tự thêm vào nhân số tổ hợp lên gấp R lần, còn thêm cả một " +
            "loại kí tự mới chỉ kéo R từ 58 lên 94. <b>Độ dài thắng độ phức tạp.</b>";
      }
    }

    var TIN = [
      "Máy đã tách ra được mật khẩu này dùng những <b>loại kí tự</b> nào. Bấm tiếp để cộng chúng lại thành cơ số <b>R</b>.",
      "<b>R</b> là số kí tự khác nhau máy phải thử ở <b>mỗi vị trí</b>. Có bao nhiêu loại thì cộng cỡ của bấy nhiêu loại.",
      "Mỗi vị trí có <b>R</b> khả năng, mật khẩu dài <b>n</b> vị trí, nên tổng số tổ hợp là <b>R<sup>n</sup></b> — nhân R với chính nó n lần.",
      "Chia số tổ hợp cho <b>1 tỉ</b> là ra số giây. Đây là <b>trường hợp xấu nhất</b> cho kẻ xấu: chúng phải mò hết. Nếu mật khẩu đoán được thì thực tế nhanh hơn nhiều.",
      "Bảng so sánh 5 mật khẩu mẫu. Đọc kĩ cột cuối trước khi đọc lời kết bên dưới.",
      "Xong phần mật khẩu. Nhưng mật khẩu mạnh mới là <b>một phần</b> — đây là phần bị bỏ quên nhiều nhất.",
      "Lớp bảo vệ thứ hai. Nếu chỉ làm được <b>một việc</b> sau bài này, hãy làm việc này.",
      "Mật khẩu bảo vệ tài khoản, nhưng có những thứ em <b>tự tay đưa ra</b> mà không ai dò cả.",
      "Điều cuối: quyền của app. Xem lời kết bên dưới để chốt lại cả bài."
    ];

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TIN.length - 1) {
        loi("Hết bước rồi. Em gõ một mật khẩu khác vào ô trên — thử <b>thêm một kí tự</b> vào cuối rồi xem thời gian dò nhảy lên bao nhiêu lần.");
        return;
      }
      buoc++; ve(); loi(TIN[buoc]);
    };

    function lamLai() {
      buoc = 0; ve();
      loi("Đang xét mật khẩu <b>" + esc(docMk() || "(rỗng)") + "</b>. Bấm “Bước tiếp” để máy cộng ra cơ số <b>R</b>.");
    }

    /* Nút mẫu nằm ở hàng nhập (không bị ve() vẽ lại) nên gắn một lần là đủ. */
    var nut = node.querySelectorAll("[data-mk]");
    for (var i = 0; i < nut.length; i++) {
      nut[i].onclick = function () { oMk.value = this.getAttribute("data-mk"); lamLai(); };
    }
    ganDatLai(node, [oMk], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-23 · DÙNG THƯ ĐIỆN TỬ VÀ MẠNG XÃ HỘI MỘT CÁCH CHUYÊN NGHIỆP
   *
   *  NGỘ NHẬN CHÍNH: học sinh tưởng Cc và Bcc chỉ là "hai chỗ điền thêm", và
   *  tưởng "Trả lời tất cả" là trả lời cho người gửi. Hai cái đó gây hậu quả
   *  thật: lộ email của người khác, và nói câu riêng tư cho cả danh sách đọc.
   *  Nên MỌI con số ở đây đều ĐẾM từ mảng TO/CC/BCC/CC8 — đổi mảng là mọi chỗ
   *  tự đổi theo, không gán cứng số nào.
   * ================================================================ */
  MH.dangKy("C11-23", function (host) {
    var TO = [{ n: "Cô Nguyễn Thị Hạnh (GVCN 11A3)", e: "co.hanh@thpt-hungvuong.edu.vn" }];
    var CC = [{ n: "Trần Minh Khoa (lớp trưởng 11A3)", e: "khoa.tm@thpt-hungvuong.edu.vn" }];
    var BCC = [{ n: "Mẹ em (phụ huynh)", e: "ph.lananh@thpt-hungvuong.edu.vn" }];
    var GUI = { n: "Cô Hạnh", e: "co.hanh@thpt-hungvuong.edu.vn" };
    var CC8 = [
      { n: "Thầy Dũng", e: "thay.dung@thpt-hungvuong.edu.vn" },
      { n: "Cô Mai", e: "co.mai@thpt-hungvuong.edu.vn" },
      { n: "Minh Khoa", e: "khoa.tm@thpt-hungvuong.edu.vn" },
      { n: "Thuỳ Linh", e: "linh.nt@thpt-hungvuong.edu.vn" },
      { n: "Phạm Huy", e: "huy.pv@thpt-hungvuong.edu.vn" },
      { n: "Lê An", e: "an.lt@thpt-hungvuong.edu.vn" },
      { n: "Đỗ Thảo", e: "thao.dt@thpt-hungvuong.edu.vn" },
      { n: "Hoàng Nam", e: "nam.hq@thpt-hungvuong.edu.vn" }
    ];
    var MXH = [
      { b: "Đăng rồi khó xoá sạch", s: "người khác đã chụp màn hình" },
      { b: "Kiểm tra trước khi chia sẻ", s: "tin giật gân thường là tin sai" },
      { b: "Ảnh đại diện và tên hiển thị", s: "cũng là hồ sơ của em" },
      { b: "Cài đặt riêng tư", s: "phải xem lại định kì" }
    ];
    var TONG = 12;          /* 6 bước soạn thư + 2 bước trả lời + 4 bước mạng xã hội */
    var buoc, che;          /* che: 0 chưa bấm, 1 Trả lời, 2 Trả lời tất cả */

    var node = MH.el(MH.khung(
      "Thư điện tử: To, Cc, Bcc và cái bẫy “Trả lời tất cả”",
      "Em soạn một thư xin phép nghỉ học gửi cô chủ nhiệm. Bấm <b>“Bước tiếp”</b> để điền từng ô và xem " +
      "ô đó đổi <b>ai nhận được thư</b> và <b>ai nhìn thấy tên ai</b>.",
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Thư mới — hộp thư của em</div>' +
      '<div class="mh7-noi" data-mh="thu"></div></div>' +
      '<div data-mh="hthay" hidden><p class="mh8-dem">Ai nhận được thư, và ai nhìn thấy tên ai</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bthay"></table></div>' +
      '<p class="mh8-dem" data-mh="demthu"></p></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div data-mh="hrep" hidden><p class="mh8-dem">Thư đến từ <b>1</b> người gửi, có <b data-mh="socc">' +
      '</b> người trong Cc. Em bấm nút nào?</p>' +
      '<div class="mh7-ds"><div class="mh7-m" data-mh="tl1"><b class="van">Trả lời</b>' +
      "<small>chỉ gửi cho người đã gửi thư</small></div>" +
      '<div class="mh7-m" data-mh="tl2"><b class="van">Trả lời tất cả</b>' +
      "<small>gửi cho người gửi VÀ toàn bộ danh sách Cc</small></div></div>" +
      '<div class="mh9-so" data-mh="ng" style="margin:10px 0 0"></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> đọc được thư trả lời của em</span>' +
      '<span><i class="cho"></i> không nhận</span></div>' +
      '<p class="mh8-dem" data-mh="dem"></p></div>' +
      '<div data-mh="hmxh" hidden><p class="mh8-dem">Bốn điều phải nhớ khi dùng mạng xã hội</p>' +
      '<div class="mh9-so" data-mh="mxh"></div></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="cau"> soạn kiểu cẩu thả (tiêu đề mơ hồ, ' +
      "viết tắt như nhắn tin, quên đính kèm)</label>"));

    var loi = loiCua(node);
    var oCau = node.querySelector('[data-mh="cau"]');
    function cau() { return oCau.checked; }

    /* Số người nhận phải tính lại từ mảng theo đúng số ô đã điền tới bước này. */
    function soTo() { return buoc >= 1 ? TO.length : 0; }
    function soCc() { return buoc >= 2 ? CC.length : 0; }
    function soBcc() { return buoc >= 3 ? BCC.length : 0; }
    function ten(ds) {
      var v = [], i;
      for (i = 0; i < ds.length; i++) v.push(esc(ds[i].n) + " &lt;" + esc(ds[i].e) + "&gt;");
      return v.join("; ");
    }
    function o(nhan, hien, noi, sang, xau) {
      if (!hien) return "<tr><th>" + esc(nhan) + '</th><td class="trong">(chưa điền)</td></tr>';
      var c = xau ? "mh8-lech" : sang ? "mh8-khoa" : "";
      return "<tr><th>" + esc(nhan) + '</th><td class="' + c + '">' + noi + "</td></tr>";
    }

    function veThu() {
      var h = "<table>";
      h += o("Đến (To)", buoc >= 1, ten(TO), buoc === 1, false);
      h += o("Đồng gửi (Cc)", buoc >= 2, ten(CC), buoc === 2, false);
      h += o("Đồng gửi ẩn (Bcc)", buoc >= 3, ten(BCC), buoc === 3, false);
      h += o("Tiêu đề", buoc >= 4, cau()
        ? esc("Chào cô")
        : esc("Xin phép nghỉ học buổi sáng 12-9 — Lê Anh Tuấn, lớp 11A3"), buoc === 4, cau());
      h += "</table>";
      if (buoc >= 5) {
        h += '<div class="' + (cau() ? "mh8-lech" : "") + '" style="margin-top:8px">';
        h += cau()
          ? "<p>" + esc("co oi mai e ko di hoc dc dau a, e met qua. tks co") + "</p>"
          : "<p>" + esc("Em chào cô ạ.") + "</p><p>" +
            esc("Em là Lê Anh Tuấn, học sinh lớp 11A3. Sáng mai thứ Năm ngày 12-9 em bị sốt, phải đi " +
              "khám nên không đến lớp được. Em xin phép cô cho em nghỉ buổi học sáng mai. Em đã nhờ bạn " +
              "Khoa chép bài giúp và sẽ học bù phần còn thiếu.") + "</p><p>" +
            esc("Em cảm ơn cô ạ.") + "</p><p>" +
            esc("Học sinh: Lê Anh Tuấn — lớp 11A3") + "</p>";
        h += "</div>";
      }
      if (buoc >= 6) {
        h += "<table>" + o("Tệp đính kèm", true, cau()
          ? esc("(quên đính kèm giấy xin phép — thư gửi đi rồi mới nhớ ra)")
          : esc("giay-xin-phep.jpg — 0,8 MB (giới hạn của hộp thư: 25 MB)"), true, cau()) + "</table>";
      }
      node.querySelector('[data-mh="thu"]').innerHTML = h;
    }

    function veThay() {
      var h = "<tr><th>Người</th><th>Ở ô</th><th>Nhận thư</th><th>Người khác có thấy tên?</th></tr>", i;
      for (i = 0; i < soTo(); i++) {
        h += '<tr class="khop"><td>' + esc(TO[i].n) + "</td><td>To</td><td>có</td>" +
          "<td>có — ai cũng thấy</td></tr>";
      }
      for (i = 0; i < soCc(); i++) {
        h += '<tr class="khop"><td>' + esc(CC[i].n) + "</td><td>Cc</td><td>có</td>" +
          "<td>có — ai cũng thấy</td></tr>";
      }
      for (i = 0; i < soBcc(); i++) {
        h += '<tr class="nay"><td>' + esc(BCC[i].n) + "</td><td>Bcc</td><td>có</td>" +
          "<td>KHÔNG — cô và lớp trưởng không thấy</td></tr>";
      }
      node.querySelector('[data-mh="bthay"]').innerHTML = h;
      node.querySelector('[data-mh="hthay"]').hidden = buoc < 1;
      node.querySelector('[data-mh="demthu"]').innerHTML =
        "Thư tới <b>" + (soTo() + soCc() + soBcc()) + "</b> người · <b>" + (soTo() + soCc()) +
        "</b> người thấy được tên nhau · <b>" + soBcc() + "</b> người được giấu tên";
    }

    function veRep() {
      var hien = buoc >= 7, i, lop, h = "";
      node.querySelector('[data-mh="hrep"]').hidden = !hien;
      node.querySelector('[data-mh="socc"]').textContent = String(CC8.length);
      /* Trả lời: chỉ người gửi. Trả lời tất cả: người gửi + toàn bộ Cc. */
      var nhanGui = che > 0;
      var nhanCc = che === 2;
      h += '<div class="mh9-tb ' + (nhanGui ? "xong" : "cho") + '"><b>' + esc(GUI.n) +
        "</b><small>người gửi</small></div>";
      for (i = 0; i < CC8.length; i++) {
        lop = nhanCc ? "xong" : "cho";
        h += '<div class="mh9-tb ' + lop + '"><b>' + esc(CC8[i].n) + "</b><small>trong Cc</small></div>";
      }
      node.querySelector('[data-mh="ng"]').innerHTML = h;
      var so = (nhanGui ? 1 : 0) + (nhanCc ? CC8.length : 0);
      node.querySelector('[data-mh="dem"]').innerHTML = che === 0
        ? "Chưa bấm nút nào — <b>0</b> người nhận"
        : "Thư trả lời của em tới <b>" + so + "</b> người";
      node.querySelector('[data-mh="tl1"]').className = "mh7-m" + (che === 1 ? " nay" : "");
      node.querySelector('[data-mh="tl2"]').className = "mh7-m" + (che === 2 ? " nay" : "");
    }

    function veMxh() {
      var h = "", i, lop;
      node.querySelector('[data-mh="hmxh"]').hidden = buoc < 9;
      for (i = 0; i < MXH.length; i++) {
        lop = buoc - 9 === i ? "nay" : buoc - 9 > i ? "xong" : "cho";
        h += '<div class="mh9-tb ' + lop + '"><b>' + esc(MXH[i].b) + "</b><small>" +
          esc(MXH[i].s) + "</small></div>";
      }
      node.querySelector('[data-mh="mxh"]').innerHTML = h;
    }

    function ve() {
      veThu(); veThay(); veRep(); veMxh();
      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(buoc === 3 || buoc === 8);
      if (buoc === 3) {
        canh.innerHTML = "Đây là chỗ sai gây hậu quả thật. Gửi thông báo cho <b>50 phụ huynh</b> mà để " +
          "hết vào <b>Cc</b> thì <b>cả 50 người đọc được địa chỉ thư của nhau</b> — em vừa làm lộ dữ " +
          "liệu của người khác. Đúng ra phải để vào <b>Bcc</b>.";
      } else if (buoc === 8) {
        canh.innerHTML = "Chỉ bấm nhầm một nút. Câu em định nói riêng với cô thì <b>cả " +
          (1 + CC8.length) + " người đọc được</b>, và <b>không rút lại được</b> — vài dịch vụ cho huỷ " +
          "trong mấy giây đầu, nhưng đó là ưu ái chứ không phải luôn có.";
      }
      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < TONG;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Bốn điều phải nhớ. <b>(1)</b> <b>To</b> là người phải hành động, <b>Cc</b> là " +
          "người cần biết, <b>Bcc</b> là người nhận mà những người khác <b>không thấy tên</b>. " +
          "<b>(2)</b> Gửi hàng loạt thì <b>luôn dùng Bcc</b>, để Cc là làm lộ địa chỉ của người khác. " +
          "<b>(3)</b> <b>Trả lời tất cả</b> gửi cho cả danh sách chứ không phải riêng người gửi — nhìn " +
          "dòng người nhận trước khi bấm gửi. <b>(4)</b> Thư đã gửi và bài đã đăng <b>không tự mất " +
          "đi</b>; tiêu đề rõ ràng thì thư mới được đọc, tiêu đề trống hay mơ hồ thì dễ bị bỏ qua và dễ " +
          "rơi vào thư rác.";
      }
    }

    function loiBuoc() {
      if (buoc === 1) {
        return "Ô <b>Đến (To)</b>: em vừa điền <b>người phải hành động</b> với thư này. Ở đây chỉ có " +
          "<b>cô chủ nhiệm</b>, vì cô là người quyết định cho em nghỉ. Ai không phải làm gì thì " +
          "<b>đừng để vào To</b>.";
      }
      if (buoc === 2) {
        return "Ô <b>Đồng gửi (Cc)</b>: lớp trưởng <b>cần biết</b> để điểm danh, nhưng <b>không phải " +
          "làm gì cả</b>. Thư giờ tới <b>" + (soTo() + soCc()) + "</b> người, và <b>cả " +
          (soTo() + soCc()) + " người này đều thấy tên và địa chỉ của nhau</b>.";
      }
      if (buoc === 3) {
        return "Ô <b>Đồng gửi ẩn (Bcc)</b>: mẹ em <b>cũng nhận được đúng lá thư đó</b>, nhưng cô và lớp " +
          "trưởng <b>không hề thấy tên mẹ em</b> trong thư. Đó là khác biệt duy nhất giữa Cc và Bcc: " +
          "<b>Cc thì mọi người thấy nhau, Bcc thì không</b>.";
      }
      if (buoc === 4) {
        return cau()
          ? "Tiêu đề <b>“Chào cô”</b> không nói được việc gì. Cô mở hộp thư thấy mấy chục thư như thế " +
            "thì thư của em <b>dễ bị bỏ qua</b>, thậm chí <b>rơi vào thư rác</b>. Bỏ trống còn tệ hơn."
          : "Tiêu đề <b>nói rõ việc, ngày và người viết</b> — cô liếc qua là biết ngay phải xử lí gì. " +
            "Thử tích ô <b>“soạn kiểu cẩu thả”</b> ở trên để thấy tiêu đề mơ hồ trông thế nào.";
      }
      if (buoc === 5) {
        return cau()
          ? "Nội dung viết tắt như nhắn tin, <b>không chào, không kí tên</b>. Cô có hơn 40 học sinh — " +
            "địa chỉ thư không phải lúc nào cũng chỉ ra em là ai, nên cô <b>không biết ai xin nghỉ</b>."
          : "Nội dung đúng có đủ ba phần: <b>chào hỏi</b>, <b>nói rõ việc</b> (nghỉ buổi nào, vì sao, đã " +
            "thu xếp thế nào) và <b>kí tên đầy đủ: họ tên + lớp</b>. Thư điện tử <b>không phải tin " +
            "nhắn</b>: viết tắt là mất lịch sự và dễ gây hiểu nhầm.";
      }
      if (buoc === 6) {
        return cau()
          ? "Bấm gửi rồi mới nhớ ra <b>quên đính kèm</b> giấy xin phép. Thư đã đi thì <b>không rút lại " +
            "được</b> — em phải gửi thêm thư thứ hai. Quen tay: <b>đính kèm trước, bấm gửi sau</b>."
          : "Đính kèm xong mới bấm gửi. Nhớ luôn <b>xem dung lượng</b>: hộp thư thường chỉ cho khoảng " +
            "<b>25 MB</b>. Tệp lớn hơn (video, tập ảnh) thì <b>tải lên kho lưu trữ rồi gửi liên kết</b>, " +
            "đừng cố nhồi vào thư.";
      }
      if (buoc === 7) {
        che = 1;
        return "Sang thư khác: cô gửi cho em, trong Cc có <b>" + CC8.length + "</b> người. Em bấm " +
          "<b>Trả lời</b> — thư đi tới đúng <b>1</b> người là <b>người đã gửi</b>. Đây là nút dùng khi " +
          "em nói riêng với cô.";
      }
      if (buoc === 8) {
        che = 2;
        return "Cùng lá thư đó, em bấm <b>Trả lời tất cả</b> — thư đi tới <b>" + (1 + CC8.length) +
          "</b> người: người gửi cộng <b>toàn bộ danh sách Cc</b>. Bấm lại hai nút ở trên để so.";
      }
      if (buoc === 9) {
        return "Mạng xã hội. <b>Những gì đăng lên rất khó xoá sạch</b>: em xoá bài, nhưng người khác " +
          "<b>đã chụp màn hình</b> hoặc chia sẻ lại từ lâu. Bản của em mất, bản của họ vẫn còn.";
      }
      if (buoc === 10) {
        return "<b>Kiểm tra trước khi chia sẻ.</b> Tin càng giật gân càng phải soi nguồn: ai đăng, đăng " +
          "khi nào, báo chính thống có đưa không. Chia sẻ tin sai thì <b>em là người phát tán</b>, " +
          "không phải người vô can.";
      }
      if (buoc === 11) {
        return "<b>Ảnh đại diện và tên hiển thị</b> cũng là hồ sơ. Trường đại học và nhà tuyển dụng sau " +
          "này <b>có tìm tên em</b>. Cái tên nghịch ngợm và bức ảnh nhố nhăng hôm nay sẽ ở đó vài năm " +
          "nữa, lúc em cần nghiêm túc nhất.";
      }
      return "<b>Cài đặt riêng tư không phải bật một lần là xong.</b> Ứng dụng cập nhật, mục cài đặt đổi " +
        "chỗ, có khi bị đặt lại về mặc định công khai. <b>Vài tháng xem lại một lần</b>: ai xem được bài " +
        "của em, ai tìm được em, ai thấy số điện thoại của em.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TONG) {
        loi("Đã đi hết các bước. Bấm <b>“Làm lại”</b> để chạy lại, hoặc tích/bỏ tích ô <b>“soạn kiểu " +
          "cẩu thả”</b> ở trên để so hai cách viết thư.");
        return;
      }
      buoc++;
      var t = loiBuoc();   /* gọi trước khi vẽ vì bước 7, 8 đặt lại giá trị "che" */
      ve();
      loi(t);
    };
    node.querySelector('[data-mh="tl1"]').onclick = function () {
      if (buoc < 7) { loi("Bấm <b>“Bước tiếp”</b> tới phần trả lời thư đã, rồi hãy chọn nút."); return; }
      che = 1; ve();
      loi("<b>Trả lời</b>: thư chỉ tới <b>1</b> người — người đã gửi. Những người trong Cc " +
        "<b>không nhận được gì</b>.");
    };
    node.querySelector('[data-mh="tl2"]').onclick = function () {
      if (buoc < 7) { loi("Bấm <b>“Bước tiếp”</b> tới phần trả lời thư đã, rồi hãy chọn nút."); return; }
      che = 2; ve();
      loi("<b>Trả lời tất cả</b>: thư tới <b>" + (1 + CC8.length) + "</b> người. Nếu em định nói một câu " +
        "riêng tư thì <b>cả " + (1 + CC8.length) + " người đó đọc được</b>.");
    };

    function lamLai() {
      buoc = 0; che = 0;
      ve();
      loi(cau()
        ? "Cửa sổ soạn thư đang trống, và em đang chọn <b>cách viết cẩu thả</b>. Bấm “Bước tiếp” để xem " +
          "từng ô hỏng ở chỗ nào."
        : "Cửa sổ soạn thư đang trống. Bấm “Bước tiếp” để điền ô <b>Đến (To)</b> trước.");
    }
    ganDatLai(node, [oCau], lamLai);
    host.appendChild(node); lamLai();
  });
})();
