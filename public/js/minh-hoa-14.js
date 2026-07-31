/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 14: LỪA ĐẢO, ĐỒ HOẠ VECTOR, PHÂN LOẠI PHẦN MỀM,
 *  GIỚI HẠN CỦA AI, TÌM KIẾM THÔNG TIN, CHUẨN BỊ DỰ ÁN WEB
 *
 *  Nửa sau của đợt 13 — tách tệp cho gọn, cùng một bộ class dùng chung.
 *  Vẫn không viết thêm dòng CSS nào.
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
   *  C10-26 · NHẬN DIỆN MÃ ĐỘC VÀ CHIÊU TRÒ LỪA ĐẢO TRỰC TUYẾN
   *
   *  Bài này hay bị dạy thành danh sách gạch đầu dòng "dấu hiệu lừa đảo": học
   *  sinh thuộc làu mà vẫn dính, vì ngoài đời không ai đưa kèm danh sách theo
   *  lá thư. Nên ở đây thư giả được dựng TRÔNG NHƯ THẬT và em phải TỰ SOI ra
   *  sáu chỗ; cột phải chỉ điền dần khi em tìm thấy, không hiện trước.
   *
   *  Chỗ đắt nhất là liên kết đội lốt — không mô tả bằng lời được, phải cho rê
   *  chuột lên và thấy thanh trạng thái hiện ra một địa chỉ hoàn toàn khác.
   * ================================================================ */
  MH.dangKy("C10-26", function (host) {
    /* Mọi tên miền dưới đây đều là tên BỊA, không phải tên miền có thật của ai. */
    var GUI_GIA = "hotro@vietcombank-online.com.vn", GUI_THAT = "no-reply@vietcombank.com.vn";
    var MIEN = "vietcombank.com.vn", LK_THAT = "http://vcb-secure.xyz/login", TEP = "sao-ke.pdf.exe";

    var DH = [
      { ten: "Địa chỉ người gửi", tom: "tên miền gần giống nhưng không phải tên thật",
        noi: "Người gửi là <code>" + GUI_GIA + "</code>. Đọc lướt thấy chữ “vietcombank” là yên tâm ngay — đúng chỗ kẻ xấu nhắm vào. Tên miền chính thức chỉ là <b>" + MIEN + "</b>; kẻ xấu <b>thêm chữ vào</b> cho giống. Ai cũng mua được một tên miền chứa chữ giống tên ngân hàng, mất vài phút." },
      { ten: "Lời chào chung chung", tom: "“Kính gửi Quý khách hàng” — không có tên em",
        noi: "“Kính gửi Quý khách hàng”. Ngân hàng <b>biết tên em</b> vì em mở tài khoản ở đó, thư thật luôn gọi đúng họ tên. Kẻ gian gửi cùng một lá thư cho hàng chục nghìn địa chỉ nên buộc phải chào chung chung." },
      { ten: "Tạo cảm giác gấp gáp", tom: "“khoá trong 24 giờ” — ép bấm trước khi kịp nghĩ",
        noi: "“Tài khoản sẽ bị khoá trong 24 giờ”. Đây không phải thông tin, đây là <b>chiêu</b>: sợ thì người ta bấm trước rồi mới nghĩ. Hễ thư nào hối em làm gì đó <b>ngay lập tức</b>, đó chính là lúc phải chậm lại." },
      { ten: "Liên kết đội lốt", tom: "chữ hiện ra khác hẳn địa chỉ thật",
        noi: "Dấu hiệu <b>quan trọng nhất</b> cả bài. Chữ hiện trên màn hình là <b>" + MIEN + "</b>, nhưng địa chỉ thật — xem thanh trạng thái bên dưới — là <b>" + LK_THAT + "</b>. <b>Chữ hiển thị của một liên kết không phải địa chỉ thật của nó</b>: người viết thư gõ chữ gì lên đó cũng được. Luôn rê chuột xem địa chỉ thật trước khi bấm." },
      { ten: "Đòi thông tin nhạy cảm", tom: "hỏi mật khẩu và mã OTP",
        noi: "Thư đòi em nhập <b>mật khẩu</b> và <b>mã OTP</b>. Nhớ đúng câu này là tránh được gần hết mọi vụ lừa: <b>không ngân hàng nào hỏi mật khẩu hay OTP</b> — không qua thư, không qua tin nhắn, không qua điện thoại. Ai hỏi là kẻ lừa đảo, <b>không có ngoại lệ</b>." },
      { ten: "Tệp đính kèm lạ", tom: "đuôi kép " + TEP + " — thật ra là tệp chạy được",
        noi: "Tệp <code>" + TEP + "</code>. Đuôi thật của một tệp là cụm <b>cuối cùng</b>, ở đây là <b>.exe</b> — tệp chạy được, không phải PDF. Chữ <code>.pdf</code> ở giữa chỉ là một phần của tên, cố ý đặt vào cho em tưởng là tài liệu. Mở nó là tự tay chạy chương trình của kẻ xấu." }
    ];

    var MD = [
      { ten: "Virus", cach: "bám vào một tệp khác", mo: "có — em phải chạy tệp đó", chong: "không chạy tệp lạ",
        noi: "<b>Virus</b> bám vào một tệp hoặc chương trình có sẵn, kiểu kí sinh. Nó nằm im cho tới khi em <b>chạy đúng tệp mang nó</b>, lúc đó mới lây tiếp." },
      { ten: "Worm", cach: "tự lan qua mạng", mo: "không — nó tự đi", chong: "cập nhật vá lỗ hổng",
        noi: "<b>Worm</b> (sâu) khác hẳn: nó <b>tự nhân bản, tự lan qua mạng</b>, không cần ai mở gì. Máy chỉ cần nối mạng và còn lỗ hổng chưa vá là đủ — nên thứ chặn worm là <b>bản cập nhật</b>, không phải sự cẩn thận của em." },
      { ten: "Trojan", cach: "giả làm phần mềm hữu ích", mo: "có — chính em tự cài", chong: "chỉ tải từ nguồn chính thức",
        noi: "<b>Trojan</b> khoác vỏ một phần mềm có ích — bộ ảnh nền miễn phí, công cụ tăng tốc máy, hay đúng cái tệp <code>" + TEP + "</code> trong thư trên. <b>Chính em bấm cài</b>, nên máy hiểu là em đồng ý." },
      { ten: "Ransomware", cach: "mã hoá dữ liệu rồi đòi tiền", mo: "thường vào qua trojan hoặc worm", chong: "sao lưu — cách duy nhất",
        noi: "<b>Ransomware</b> (mã độc tống tiền) mã hoá sạch tệp của em rồi đòi tiền chuộc để đổi khoá giải mã. Nhấn mạnh: <b>trả tiền cũng không chắc lấy lại được</b> — em đang tin vào chính kẻ vừa tấn công mình, lại nuôi sống đường dây đó. Cách chống thật sự <b>duy nhất</b> là <b>sao lưu</b>: có bản lưu ở nơi khác thì lời đe doạ mất hết sức nặng." },
      { ten: "Spyware", cach: "âm thầm ghi lại thao tác bàn phím", mo: "không — nó chỉ nằm im", chong: "đổi mật khẩu từ máy khác",
        noi: "<b>Spyware</b> không phá gì, nó <b>ghi lại từng phím em gõ</b> rồi lén gửi ra ngoài — không phá thì mới nằm lâu được. Hệ quả rất thực tế: nghi máy dính thì <b>đừng đổi mật khẩu ngay trên máy đó</b>, vì mật khẩu mới vừa gõ cũng bị ghi luôn." }
    ];

    var VIEC = [
      { ten: "Tự gõ địa chỉ", mo: "không bấm liên kết trong thư lạ" },
      { ten: "Xác thực hai bước", mo: "lộ mật khẩu vẫn chưa mất tài khoản" },
      { ten: "Cập nhật phần mềm", mo: "bịt lỗ hổng worm đang khai thác" },
      { ten: "Sao lưu", mo: "thứ duy nhất cứu được khi bị mã hoá" }
    ];

    var HET = MD.length;   /* k = HET là bước kết luận, nằm sau mọi loại mã độc */
    var tim, cuoi, k;      /* tim: chỗ đã soi ra · cuoi: chỗ vừa lộ · k: -1 = còn đang soi thư */

    var node = MH.el(MH.khung("Soi một lá thư lừa đảo: sáu chỗ tố cáo nó là giả",
      "Lá thư bên dưới trông <b>rất chuyên nghiệp</b> — đó chính là vấn đề. <b>Bấm vào từng chỗ em thấy " +
      "đáng ngờ</b> trong thư (có 6 chỗ), hoặc bấm “Bước tiếp” để lộ dần. Nhớ <b>rê chuột lên liên kết</b> " +
      "và nhìn thanh trạng thái.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Thư vừa nhận</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i><span data-mh="tab"></span></div>' +
      '<div class="mh7-noi" data-mh="thu"></div></div>' +
      '<p class="mh7-nhan" style="margin-top:9px">Thanh trạng thái — địa chỉ thật của liên kết</p>' +
      '<div class="mh10-out" data-mh="out"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Dấu hiệu đã tìm ra</p>' +
      '<div class="mh7-ds" data-mh="ds"></div><p class="mh8-dem" data-mh="dem"></p></div></div>' +
      '<div data-mh="bang" style="margin-top:11px" hidden></div>' +
      '<div data-mh="viec" style="margin-top:11px" hidden></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="that"> xem thư THẬT của ngân hàng để đối chiếu</label>'));

    var loi = loiCua(node);
    var oThu = node.querySelector('[data-mh="thu"]'), oTab = node.querySelector('[data-mh="tab"]');
    var oOut = node.querySelector('[data-mh="out"]'), oDs = node.querySelector('[data-mh="ds"]');
    var oDem = node.querySelector('[data-mh="dem"]'), oBang = node.querySelector('[data-mh="bang"]');
    var oViec = node.querySelector('[data-mh="viec"]'), oCanh = node.querySelector('[data-mh="canh"]');
    var oGhi = node.querySelector('[data-mh="ghi"]'), oThat = node.querySelector('[data-mh="that"]');

    function demTim() {   /* đếm THẬT từ trạng thái, không giữ biến đếm riêng */
      var d = 0, i;
      for (i = 0; i < tim.length; i++) if (tim[i]) d++;
      return d;
    }
    /* Chỗ đáng ngờ chưa soi ra thì trông y hệt chữ thường — tô sẵn là hỏng bài. */
    function o(i, noi) {
      return '<span data-i="' + i + '" style="cursor:pointer" class="' + (tim[i] ? "mh8-lech" : "") +
        '">' + noi + "</span>";
    }
    function thuGia() {
      return "<p><strong>Từ:</strong> Ngân hàng VCB &lt;" + o(0, esc(GUI_GIA)) + "&gt;<br>" +
        "<strong>Chủ đề:</strong> [KHẨN] Yêu cầu xác minh tài khoản</p><h3>THÔNG BÁO BẢO MẬT</h3>" +
        "<p>" + o(1, "Kính gửi Quý khách hàng,") + "</p><p>Hệ thống ghi nhận một lượt đăng nhập lạ vào " +
        "tài khoản của quý khách. " + o(2, "Tài khoản sẽ bị khoá trong 24 giờ") + " nếu không xác minh ngay.</p>" +
        '<p>Xác minh tại: <a href="#" data-i="3" class="' + (tim[3] ? "mh8-lech" : "") + '">' + esc(MIEN) +
        "</a></p><p>" + o(4, "Vui lòng nhập mật khẩu Internet Banking và mã OTP vừa nhận được để hoàn tất.") +
        "</p><p>Đính kèm: " + o(5, esc(TEP)) + "</p>";
    }
    function thuThat() {
      return "<p><strong>Từ:</strong> Ngân hàng VCB &lt;" + esc(GUI_THAT) + "&gt;<br>" +
        "<strong>Chủ đề:</strong> Sao kê tài khoản tháng 7</p><h3>THÔNG BÁO SAO KÊ</h3>" +
        "<p>Kính gửi ông <strong>NGUYEN VAN NAM</strong>,</p><p>Sao kê tháng 7 đã sẵn sàng. Ông vui lòng " +
        "<strong>tự mở ứng dụng ngân hàng</strong> hoặc <strong>tự gõ</strong> địa chỉ " + esc(MIEN) +
        " để xem.</p><p>Ngân hàng <strong>không bao giờ</strong> yêu cầu mật khẩu hay mã OTP qua thư " +
        "điện tử, tin nhắn hoặc điện thoại.</p><p>Thư này không có tệp đính kèm và không hối ông làm gì gấp.</p>";
    }

    function veDs() {
      oDs.innerHTML = DH.map(function (d, i) {
        if (!tim[i]) {
          return '<div class="mh7-m" style="opacity:.45;cursor:default"><b class="van">' +
            esc("Chỗ thứ " + (i + 1)) + "</b><small>chưa tìm ra — soi tiếp trong thư</small></div>";
        }
        return '<div class="mh7-m' + (i === cuoi ? " nay" : "") + '"><b class="van">' + esc(d.ten) +
          "</b><small>" + esc(d.tom) + "</small></div>";
      }).join("");
      oDem.innerHTML = "Đã tìm ra <b>" + demTim() + "/" + DH.length + "</b> dấu hiệu";
    }
    function veBang() {
      var h = '<div class="mh4-cuon"><table class="mh4-b"><tr><th>Loại</th><th>Cách hoạt động</th>' +
        "<th>Cần em tự mở?</th><th>Cách chống</th></tr>", i;
      for (i = 0; i <= Math.min(k, MD.length - 1); i++) {
        h += '<tr class="' + (i === k ? "nay" : "") + '"><td>' + esc(MD[i].ten) + "</td><td>" +
          esc(MD[i].cach) + "</td><td>" + esc(MD[i].mo) + "</td><td>" + esc(MD[i].chong) + "</td></tr>";
      }
      return h + "</table></div>";
    }
    function veOut() {
      oOut.innerHTML = oThat.checked
        ? '<span class="trong">Thư thật không có liên kết nào để bấm.</span>'
        : '<span class="trong">Rê chuột lên liên kết trong thư để xem địa chỉ thật của nó.</span>';
    }

    function ve() {
      var that = oThat.checked, xong = k >= HET, c = "", ds, i;
      oTab.textContent = that ? "Thư thật của ngân hàng" : "Thư mới — chưa đọc";
      oThu.innerHTML = that ? thuThat() : thuGia();
      /* innerHTML vừa ghi đè nên phải gắn lại onclick mỗi lần vẽ. */
      if (!that) {
        ds = oThu.querySelectorAll("[data-i]");
        for (i = 0; i < ds.length; i++) {
          (function (e) {
            var j = Number(e.getAttribute("data-i"));
            e.onclick = function (ev) { ev.preventDefault(); moDh(j); };   /* chặn điều hướng thật */
            if (e.tagName === "A") {
              e.onmouseover = function () { oOut.innerHTML = '<span class="loi">' + esc(LK_THAT) + "</span>"; };
              e.onmouseout = veOut;
            }
          })(ds[i]);
        }
      }
      veOut(); veDs();

      oBang.hidden = k < 0;
      if (k >= 0) oBang.innerHTML = veBang();
      oViec.hidden = !xong;
      if (xong) {
        oViec.innerHTML = '<div class="mh9-so">' + VIEC.map(function (v) {
          return '<div class="mh9-tb xong"><b>' + esc(v.ten) + "</b><small>" + esc(v.mo) + "</small></div>";
        }).join("") + "</div>";
      }

      if (k < 0 && demTim() === 1) {
        c = "<b>Thư trông chuyên nghiệp không có nghĩa là thư thật.</b> Logo, màu sắc, bố cục đều chép " +
          "lại được trong vài phút — vẻ ngoài chỉn chu không chứng minh được gì cả.";
      } else if (k === 2) {
        c = "<b>Máy có phần mềm diệt virus vẫn dính</b> nếu chính em tự bấm cài và tự nhập thông tin. " +
          "Đây là lừa <b>người</b>, không phải lừa <b>máy</b>.";
      }
      oCanh.hidden = !c;
      oCanh.innerHTML = c;

      oGhi.hidden = !xong;
      oGhi.className = "mh7-ghi" + (xong ? " xong" : "");
      if (xong) {
        oGhi.innerHTML = "Tích ô phía trên để xem <b>thư thật</b> mà đối chiếu: gọi đúng tên em, không " +
          "hối thúc, không đính kèm, và nó <b>bảo em tự mở ứng dụng</b> chứ không đưa liên kết để bấm. " +
          "Bốn việc phải làm: <b>tự gõ địa chỉ ngân hàng</b> thay vì bấm liên kết trong thư, bật " +
          "<b>xác thực hai bước</b>, <b>cập nhật phần mềm</b>, và <b>sao lưu</b>.";
      }
    }

    function moDh(i) { tim[i] = true; cuoi = i; ve(); noiBuoc(); }   /* bấm lại chỗ cũ thì đọc lại lời giải */

    function noiBuoc() {
      if (k >= HET) {
        loi("Hết bước rồi. Tích ô “xem thư THẬT” để đối chiếu hai lá thư, hoặc bấm “Làm lại”.");
        return;
      }
      if (k >= 0) { loi(MD[k].noi); return; }
      if (cuoi < 0) {
        loi("Một lá thư ngân hàng, nhìn qua thì bình thường. Bấm vào chỗ em thấy đáng ngờ, hoặc bấm " +
          "“Bước tiếp” để lộ dần từng chỗ một.");
        return;
      }
      loi(DH[cuoi].noi + (demTim() < DH.length ? "" :
        " <b>Đủ 6 dấu hiệu.</b> Bấm “Bước tiếp” để xem tệp đính kèm kia thả thứ gì vào máy."));
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var i;
      if (demTim() < DH.length) {   /* còn chỗ chưa soi ra thì lộ chỗ đầu tiên còn sót */
        for (i = 0; i < DH.length; i++) if (!tim[i]) { moDh(i); return; }
      }
      if (k >= HET) { noiBuoc(); return; }   /* hết bước: chỉ nhắc, không được lỗi */
      k++; ve(); noiBuoc();
    };
    /* Đổi sang thư thật chỉ vẽ lại, KHÔNG qua ganDatLai — không được xoá tiến độ. */
    oThat.onchange = ve;

    function lamLai() {
      tim = DH.map(function () { return false; });
      cuoi = -1; k = -1; oThat.checked = false;
      ve(); noiBuoc();
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-10 · THỰC HÀNH VẼ HÌNH BẰNG ĐỒ HOẠ VECTOR
   *
   *  NGỘ NHẬN SỐ MỘT: học sinh thuộc câu "vector phóng to không vỡ" nhưng không
   *  tin, vì chưa bao giờ thấy tận mắt. Nên PHẦN 1 không giải thích gì cả —
   *  nó phóng THẬT vào cùng một con mắt của cùng một khuôn mặt, một bên dựng
   *  bằng 32x32 ô vuông thật (mỗi ô là một rect), một bên dựng bằng hình SVG.
   *  Ảnh điểm ảnh ở đây được TÔ RA TỪ chính công thức của bản vector, nên hai
   *  bên đúng là "cùng một hình, hai cách lưu" chứ không phải hai bức khác nhau.
   * ================================================================ */
  MH.dangKy("C10-10", function (host) {
    var S = 100 / 32;                  /* ảnh điểm ảnh: lưới 32x32 trong hệ toạ độ 0..100 */
    var ZS = [100, 200, 400, 800];
    var GOC = 240;                     /* bề ngang hiển thị (điểm ảnh) khi ở mức 100% */
    var VEC = 5 * 46 + 130;            /* 5 hình x ~46 byte lệnh + phần đầu tệp = cố định */
    var CUOI = 8, buoc;

    var node = MH.el(MH.khung("Phóng to: ảnh vector <b>không vỡ</b>, ảnh điểm ảnh thì <b>vỡ</b>",
      "Cùng một khuôn mặt cười, vẽ bằng hai cách. Em chọn <b>mức phóng</b> rồi nhìn kĩ con mắt trái: " +
      "bên nào thành bậc thang răng cưa, bên nào vẫn cong mượt.",
      '<div class="mh7-doi" data-mh="doi"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh4-cuon" data-mh="bang" hidden></div>' +
      '<div class="mh7-doi" data-mh="doi2"></div>' +
      '<div class="mh4-cuon" data-mh="ss" hidden></div>' +
      '<div class="mh7-ds" data-mh="ds"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      'Mức phóng: <select data-mh="zoom"><option value="100">100%</option>' +
      '<option value="200">200%</option><option value="400">400%</option>' +
      '<option value="800">800%</option></select>'));

    var loi = loiCua(node);
    var oZoom = node.querySelector('[data-mh="zoom"]');
    function mucZ() { return parseInt(oZoom.value, 10) || 100; }

    /* --- Công thức của bức hình. Cả hai bên đều dùng đúng bộ số này. --- */
    function mauO(x, y) {
      var dx = x - 50, dy = y - 50, d = Math.sqrt(dx * dx + dy * dy);
      if (d > 42.5) return "#bfe3ff";                                        /* nền trời */
      if ((x - 35) * (x - 35) + (y - 39) * (y - 39) < 38) return "#4a3a12";  /* mắt trái */
      if ((x - 65) * (x - 65) + (y - 39) * (y - 39) < 38) return "#4a3a12";  /* mắt phải */
      var m = Math.sqrt(dx * dx + (y - 46) * (y - 46));
      if (y > 57 && m > 21.5 && m < 27.5) return "#4a3a12";                  /* miệng cười */
      if (d > 38) return "#e08a1e";                                          /* viền mặt */
      return "#ffd75e";
    }

    /* Cửa sổ đang phóng, tính trong hệ 0..100. Tâm đặt ở MÉP con mắt trái —
       chỗ có đường cong cắt ngang, vì chỉ ở mép mới nhìn ra bậc thang. */
    function cua(z) {
      var w = 10000 / z;
      return [Math.max(0, Math.min(100 - w, 30 - w / 2)),
        Math.max(0, Math.min(100 - w, 36 - w / 2)), w];
    }
    function moSvg(c, cao) {
      return '<svg viewBox="' + c[0] + " " + c[1] + " " + c[2] + " " + c[2] +
        '" style="width:100%;height:' + cao + 'px;display:block">';
    }

    function veBit(z) {
      var c = cua(z), i, j, h = moSvg(c, 168).replace("<svg ", '<svg shape-rendering="crispEdges" ');
      var i0 = Math.floor(c[0] / S), i1 = Math.ceil((c[0] + c[2]) / S);
      var j0 = Math.floor(c[1] / S), j1 = Math.ceil((c[1] + c[2]) / S);
      /* Chỉ dựng những ô đang lọt vào khung nhìn — phóng càng sâu càng ít ô,
         và đó chính là điều bài muốn em thấy: hết ô là hết chi tiết. */
      for (j = j0; j < j1; j++) {
        for (i = i0; i < i1; i++) {
          h += '<rect x="' + (i * S) + '" y="' + (j * S) + '" width="' + S + '" height="' + S +
            '" fill="' + mauO((i + 0.5) * S, (j + 0.5) * S) + '"/>';
        }
      }
      return h + "</svg>";
    }
    function veVec(z) {
      return moSvg(cua(z), 168) +
        '<rect x="0" y="0" width="100" height="100" fill="#bfe3ff"/>' +
        '<circle cx="50" cy="50" r="40.25" fill="#ffd75e" stroke="#e08a1e" stroke-width="4.5"/>' +
        '<circle cx="35" cy="39" r="6.16" fill="#4a3a12"/>' +
        '<circle cx="65" cy="39" r="6.16" fill="#4a3a12"/>' +
        '<path d="M 28.1 57 A 24.5 24.5 0 0 0 71.9 57" fill="none" stroke="#4a3a12" ' +
        'stroke-width="6" stroke-linecap="round"/></svg>';
    }

    function co(b) {
      if (b >= 1048576) return (b / 1048576).toFixed(1).replace(".", ",") + " MB";
      if (b >= 1024) return Math.round(b / 1024) + " KB";
      return b + " B";
    }
    function bitByte(z) { var w = GOC * z / 100; return w * w * 3; }   /* 3 byte mỗi điểm ảnh */

    /* ---------------- PHẦN 2: mở tệp .svg ra xem ---------------- */
    function ma(b) {
      var L = [], td = b >= 6 ? "  " : "";
      var tr = b >= 7 ? ' transform="translate(-24 14) rotate(20 80 58) scale(0.8)"' : "";
      var hs = b <= 5 ? "nay" : "";
      function d(t, c) { L.push('<div class="mh7-d' + (c ? " " + c : "") + '">' + esc(t) + "</div>"); }
      d('<svg viewBox="0 0 160 120">', "");
      d('  <rect x="0" y="0" width="160" height="120"' + (b >= 5 ? ' fill="#bfe3ff"' : "") + "/>", hs);
      if (b >= 6) d('  <g id="matTroi"' + tr + ">", "nay");
      d(td + '  <polygon points="80,8 87,40 73,40"' + (b >= 5 ? ' fill="#ffc93c"' : "") + "/>", hs);
      d(td + "  (lặp 8 bản, mỗi bản rotate 45 độ quanh 80 58)", "mo");
      d(td + '  <circle cx="80" cy="58" r="22"' +
        (b >= 5 ? ' fill="#ffd75e" stroke="#e08a1e" stroke-width="3"' : "") + "/>", hs);
      if (b >= 6) {
        d("  </g>", b === 6 ? "nay" : "");
        d('  <circle cx="116" cy="32" r="16" fill="#fff"/>', b === 6 ? "nay" : "");
        d('  <circle cx="136" cy="38" r="11" fill="#fff"/>', b === 6 ? "nay" : "");
      }
      d("</svg>", "");
      return L.join("");
    }
    function veSvg2(b) {
      var mau = b >= 5, k;
      var tia = mau ? "#ffc93c" : "#ced2da", than = mau ? "#ffd75e" : "#aeb3bd";
      var vien = mau ? ' stroke="#e08a1e" stroke-width="3"' : "";
      var tr = b >= 7 ? ' transform="translate(-24 14) rotate(20 80 58) scale(0.8)"' : "";
      var h = '<svg viewBox="0 0 160 120" style="width:100%;height:168px;display:block">' +
        '<rect x="0" y="0" width="160" height="120" fill="' + (mau ? "#bfe3ff" : "#d9dce3") + '"/><g' + tr + ">";
      for (k = 0; k < 8; k++) {
        h += '<polygon points="80,8 87,40 73,40" fill="' + tia +
          '" transform="rotate(' + (k * 45) + ' 80 58)"/>';
      }
      h += '<circle cx="80" cy="58" r="22" fill="' + than + '"' + vien + "/></g>";
      /* Mây vẽ SAU nên đè lên tia nắng — đó là toàn bộ ý "thứ tự lớp". */
      if (b >= 6) h += '<circle cx="116" cy="32" r="16" fill="#fff"/><circle cx="136" cy="38" r="11" fill="#fff"/>';
      return h + "</svg>";
    }

    function ve() {
      var z = mucZ(), i, h;
      var d1 = node.querySelector('[data-mh="doi"]'), d2 = node.querySelector('[data-mh="doi2"]');
      d1.innerHTML = buoc >= 4 ? "" :
        '<div class="mh7-panel"><p class="mh7-nhan">Ảnh điểm ảnh — lưới 32×32 ô</p>' + veBit(z) + "</div>" +
        '<div class="mh7-panel"><p class="mh7-nhan">Ảnh vector — 5 hình, lưu bằng công thức</p>' + veVec(z) + "</div>";
      d2.innerHTML = buoc < 4 ? "" :
        '<div class="mh7-panel"><p class="mh7-nhan">Tệp .svg — máy chỉ lưu mấy dòng này</p>' +
        '<div class="mh7-code">' + ma(buoc) + "</div></div>" +
        '<div class="mh7-panel"><p class="mh7-nhan">Máy vẽ lại từ chính mấy con số đó</p>' + veSvg2(buoc) + "</div>";

      var DEM2 = ["Bước 1 · <b>hình cơ bản</b>: 1 hình chữ nhật + 8 đa giác + 1 hình tròn",
        "Bước 2 · <b>thuộc tính</b>: màu tô, màu viền, độ dày viền",
        "Bước 3 · <b>nhóm và lớp</b>: mây vẽ sau nên đè lên tia nắng",
        "Bước 4 · <b>biến đổi</b>: dời, xoay 20°, thu còn 0,8 lần — vẫn <b>nét nguyên</b>"];
      node.querySelector('[data-mh="dem"]').innerHTML = buoc >= 4 && buoc < 8
        ? DEM2[buoc - 4]
        : "Mức phóng <b>" + z + "%</b> · ảnh điểm ảnh muốn nét phải lưu <b>" + co(bitByte(z)) +
          "</b> · ảnh vector <b>" + co(VEC) + "</b>, không đổi";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(buoc === 2 || buoc === 3 || buoc === 8);
      if (buoc === 2) {
        canh.innerHTML = "Đây là chỗ phải hiểu cho đúng. Tệp vector <b>không lưu điểm ảnh</b>, nó lưu " +
          "<b>công thức hình</b>: “hình tròn tâm (35; 39), bán kính 6,16”. Khi em phóng to, máy " +
          "<b>vẽ lại từ đầu</b> ở kích thước mới — nên bao nhiêu phần trăm cũng nét. Ảnh điểm ảnh thì " +
          "chỉ có sẵn 32×32 ô, phóng to là <b>kéo giãn ô cũ</b> ra, không sinh thêm chi tiết nào cả.";
      } else if (buoc === 3) {
        canh.innerHTML = "Nhìn bảng: bitmap tăng theo <b>bình phương</b> kích thước — gấp đôi bề ngang " +
          "là nặng gấp <b>bốn</b>. Còn vector <b>đứng yên</b> ở " + co(VEC) + " suốt cả bốn dòng. " +
          "Dung lượng vector phụ thuộc <b>số hình</b>, <b>không</b> phụ thuộc kích thước hiển thị: " +
          "vẽ logo này to bằng cái sân trường thì tệp vẫn đúng bấy nhiêu byte.";
      } else if (buoc === 8) {
        canh.innerHTML = "Hai điều hay bị làm sai. <b>(1) Đổi đuôi tệp không biến ảnh chụp thành " +
          "vector</b> — đặt tên <code>anh.svg</code> cho một tấm <code>.jpg</code> thì bên trong vẫn là " +
          "lưới điểm ảnh, phóng to vẫn vỡ. Muốn có vector thật thì phải <b>vẽ lại</b> bằng các hình cơ " +
          "bản, hoặc nhờ phần mềm <b>dò nét</b> rồi sửa tay. <b>(2)</b> Ảnh chụp <b>không nên</b> để " +
          "dạng vector: chuyển ra thì mất hết chuyển màu tinh tế mà tệp còn <b>nặng hơn</b>, vì phải " +
          "tả hàng vạn mảng màu bằng hàng vạn hình.";
      }

      var bang = node.querySelector('[data-mh="bang"]');
      bang.hidden = buoc !== 3;
      if (!bang.hidden) {
        h = '<table class="mh4-b"><tr><th>Mức phóng</th><th>Bitmap phải lưu</th><th>Dung lượng</th>' +
          "<th>Vector</th></tr>";
        for (i = 0; i < ZS.length; i++) {
          h += "<tr" + (ZS[i] === z ? ' class="nay"' : "") + "><td>" + ZS[i] + "%</td><td>" +
            (GOC * ZS[i] / 100) + "×" + (GOC * ZS[i] / 100) + "</td><td>" + co(bitByte(ZS[i])) +
            '</td><td class="khop">' + co(VEC) + "</td></tr>";
        }
        bang.innerHTML = h + "</table>";
      }

      var ss = node.querySelector('[data-mh="ss"]');
      ss.hidden = buoc < 8;
      if (!ss.hidden) {
        ss.innerHTML = '<table class="mh4-b"><tr><th></th><th>Ảnh vector</th><th>Ảnh điểm ảnh</th></tr>' +
          "<tr><td>Lưu cái gì</td><td>công thức hình (toạ độ, bán kính)</td><td>lưới điểm ảnh, từng ô một màu</td></tr>" +
          '<tr class="nay"><td>Phóng to</td><td>vẽ lại, luôn nét</td><td>giãn ô cũ, vỡ hạt</td></tr>' +
          "<tr><td>Dung lượng theo</td><td>số hình</td><td>số điểm ảnh (bình phương kích thước)</td></tr>" +
          "<tr><td>Hợp với</td><td>logo, biểu tượng, bản vẽ kĩ thuật, chữ nghệ thuật</td>" +
          "<td>ảnh chụp, ảnh có chuyển màu phức tạp</td></tr>" +
          "<tr><td>Định dạng</td><td>.svg, .ai, .eps</td><td>.jpg, .png, .bmp</td></tr></table>";
      }

      var ds = node.querySelector('[data-mh="ds"]');
      if (buoc < 8) { ds.innerHTML = ""; } else {
        var CH = [["Logo của trường, in từ thẻ tên tới băng rôn", "vector — một tệp dùng cho mọi cỡ", "nay"],
          ["Bản vẽ chi tiết máy trong môn Công nghệ", "vector — cần phóng to xem kích thước", "nay"],
          ["Ảnh chụp lớp trong buổi liên hoan", "điểm ảnh — .jpg", ""],
          ["Ảnh nền hoàng hôn nhiều sắc chuyển dần", "điểm ảnh — vector tả không nổi chuyển màu", ""],
          ["Biểu tượng ứng dụng trên điện thoại", "vector — mỗi máy hiển thị một cỡ khác nhau", "nay"]];
        h = "";
        for (i = 0; i < CH.length; i++) {
          h += '<div class="mh7-m ' + CH[i][2] + '"><b class="van">' + esc(CH[i][0]) + "</b><small>" +
            esc(CH[i][1]) + "</small></div>";
        }
        ds.innerHTML = h;
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < CUOI;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Bốn câu gọn để nhớ. <b>(1)</b> Vector lưu <b>công thức hình</b>, phóng bao nhiêu " +
          "cũng nét vì máy <b>vẽ lại từ đầu</b>; ảnh điểm ảnh chỉ có từng ấy ô nên phóng là <b>vỡ</b>. " +
          "<b>(2)</b> Vẽ vector là ghép <b>hình cơ bản</b>, đặt <b>thuộc tính</b>, xếp <b>lớp</b> và " +
          "<b>nhóm</b>, rồi <b>biến đổi</b> — tất cả chỉ là sửa mấy con số nên không bao giờ mất chất " +
          "lượng. <b>(3)</b> Dung lượng vector theo <b>số hình</b>, không theo cỡ hiển thị. <b>(4)</b> " +
          "<b>Đổi đuôi tệp không tạo ra vector</b> — và ảnh chụp thì cứ để <b>.jpg</b> cho đúng việc.";
      }
    }

    oZoom.onchange = function () {
      ve();
      if (buoc >= 4) {
        loi("Ô mức phóng chỉ tác dụng cho hai bức ở <b>phần trên</b>. Em bấm “Làm lại” để quay về đó.");
      } else {
        loi("Em vừa đặt mức phóng <b>" + mucZ() + "%</b>. Nhìn con mắt trái: bên trái là các <b>ô vuông</b> " +
          "to dần, bên phải máy <b>vẽ lại</b> nên đường cong vẫn liền.");
      }
    };

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= CUOI) {
        loi("Hết bước rồi. Em thử đổi <b>mức phóng</b> ở trên rồi bấm “Làm lại” để xem lại phần đầu.");
        return;
      }
      buoc++;
      if (buoc <= 2) oZoom.value = String(ZS[buoc + 1]);
      ve();
      if (buoc === 0) {
        loi("Phóng <b>200%</b> vào mép con mắt trái. Bên trái đã lấm tấm ô vuông — vì máy chỉ có " +
          "<b>32×32</b> điểm ảnh, phóng to là <b>kéo giãn</b> từng ô ra chứ không có thêm chi tiết nào.");
      } else if (buoc === 1) {
        loi("Phóng <b>400%</b>: bên trái con mắt đã thành <b>bậc thang</b> răng cưa, còn bên phải vẫn là " +
          "một đường cong liền. Cùng một hình, chỉ khác cách lưu.");
      } else if (buoc === 2) {
        loi("Phóng <b>800%</b>: bên trái chỉ còn <b>vài ô vuông</b> khổng lồ, không ai nhận ra là con mắt " +
          "nữa. Bên phải vẫn tròn trịa. Đọc khối đỏ ở dưới để biết vì sao.");
      } else if (buoc === 3) {
        loi("Bây giờ nói về <b>dung lượng</b>. Muốn ảnh điểm ảnh <b>nét</b> ở mỗi mức phóng thì phải lưu " +
          "đủ số điểm ảnh — xem bảng, và để ý cột cuối gần như không nhúc nhích.");
      } else if (buoc === 4) {
        loi("Sang phần hai: <b>vector được tạo bằng gì</b>. Đầu tiên là <b>hình cơ bản</b> — hình chữ " +
          "nhật, đa giác, hình tròn. Mỗi hình chỉ là <b>mấy con số</b>: toạ độ, chiều dài, bán kính.");
      } else if (buoc === 5) {
        loi("Thêm <b>thuộc tính</b>: <code>fill</code> màu tô, <code>stroke</code> màu viền, " +
          "<code>stroke-width</code> độ dày viền. Đổi lúc nào cũng được, và <b>không mất chất lượng</b> " +
          "vì hình vẫn nguyên là công thức, chỉ đổi mấy chữ mô tả màu.");
      } else if (buoc === 6) {
        loi("Vẽ thêm đám mây <b>sau</b> mặt trời nên nó <b>đè lên</b> tia nắng — đó là <b>thứ tự lớp</b>. " +
          "Đồng thời tia nắng và thân mặt trời được gộp vào <b>một nhóm</b> " +
          "<code>&lt;g&gt;</code> để lát nữa di chuyển cùng nhau.");
      } else if (buoc === 7) {
        loi("<b>Biến đổi</b> cả nhóm: dời sang trái, xoay <b>20°</b>, thu còn <b>0,8</b> lần — mây đứng " +
          "yên vì không nằm trong nhóm. Máy chỉ sửa mấy con số rồi vẽ lại, nên hình <b>không hề vỡ</b>.");
      } else {
        loi("Chốt lại: <b>khi nào dùng vector, khi nào dùng ảnh điểm ảnh</b>, và hai điều hay bị làm sai.");
      }
    };

    function lamLai() {
      buoc = -1;
      oZoom.value = "100";
      ve();
      loi("Ở <b>100%</b> hai bên trông <b>y hệt nhau</b> — nhìn ảnh nhỏ em không thể đoán được đâu là " +
        "vector. Bấm “Bước tiếp” để phóng to và bắt tận tay.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-02 · PHẦN MỀM HỆ THỐNG VÀ PHẦN MỀM ỨNG DỤNG
   *
   *  KHÔNG lặp lại hai minh hoạ đã có (chia lát thời gian CPU, trình điều
   *  khiển thiết bị). Ở đây chỉ có MỘT câu hỏi: phần mềm này phục vụ AI —
   *  phục vụ cái máy, hay phục vụ công việc của người dùng?
   *
   *  Vì sao dựng tháp TỪ DƯỚI LÊN chứ không vẽ sẵn cả bốn tầng: thứ tự dựng
   *  chính là quan hệ phụ thuộc. Hai bước "gỡ thử" ở cuối phần 1 cho thấy quan
   *  hệ ấy MỘT CHIỀU — chỗ đề hay hỏi ở dạng đúng/sai.
   * ================================================================ */
  MH.dangKy("C11-02", function (host) {
    /* Chỉ số 0 là tầng TRÊN CÙNG (màn hình vẽ từ trên xuống), nhưng tháp
       được dựng từ tầng cuối mảng trở lên. */
    var TANG = [
      { ten: "Phần mềm ứng dụng", mo: "soạn thảo, trình duyệt, bảng tính, trò chơi" },
      { ten: "Phần mềm tiện ích", mo: "diệt virus, nén tệp, dọn ổ đĩa, sao lưu" },
      { ten: "Phần mềm hệ thống", mo: "hệ điều hành, trình điều khiển thiết bị" },
      { ten: "Phần cứng", mo: "CPU, RAM, ổ đĩa, màn hình" }
    ];

    var NHOM = { ht: "Phần mềm hệ thống", ti: "Phần mềm tiện ích", ud: "Phần mềm ứng dụng" };
    var THU = ["ht", "ti", "ud"];   /* vòng bấm: chưa xếp -> ht -> ti -> ud -> chưa xếp */

    var PM = [
      { id: "hdh", ten: "Hệ điều hành máy tính", dung: "ht",
        vi: "Nạp đầu tiên khi bật máy, quản lí phần cứng và <b>làm nền cho mọi phần mềm khác</b>." },
      { id: "dt", ten: "Hệ điều hành điện thoại", dung: "ht",
        vi: "Điện thoại cũng là một máy tính; vai trò của nó y hệt hệ điều hành máy tính." },
      { id: "drv", ten: "Trình điều khiển máy in", dung: "ht",
        vi: "Phiên dịch giữa hệ điều hành và một thiết bị cụ thể — <b>phục vụ máy</b>, không phục vụ em." },
      { id: "av", ten: "Phần mềm diệt virus", dung: "ti",
        vi: "Bảo vệ chính chiếc máy. Nó <b>chăm sóc máy</b> chứ không làm hộ em việc gì." },
      { id: "nen", ten: "Phần mềm nén tệp", dung: "ti",
        vi: "Tiết kiệm chỗ trên ổ đĩa — vẫn là chuyện của cái máy." },
      { id: "tr", ten: "Trình duyệt web", dung: "ud",
        vi: "<b>Là ứng dụng</b>, dù được cài sẵn theo máy. Cài sẵn không biến nó thành phần mềm hệ thống: " +
          "em mở nó ra để <b>đọc web — việc của em</b>. Gỡ nó đi máy vẫn chạy bình thường." },
      { id: "van", ten: "Phần mềm soạn thảo văn bản", dung: "ud",
        vi: "Phục vụ đúng một việc của người dùng: viết tài liệu." },
      { id: "bt", ten: "Bảng tính", dung: "ud",
        vi: "Tính toán, lập bảng biểu — công việc của em." },
      { id: "td", ten: "Trình dịch Python", dung: "ht",
        vi: "<b>Là phần mềm hệ thống.</b> Nó phục vụ việc <b>tạo ra phần mềm khác</b>, không phục vụ " +
          "công việc thường ngày. Đây là ca bị xếp nhầm nhiều nhất." },
      { id: "game", ten: "Trò chơi", dung: "ud",
        vi: "Giải trí cũng là nhu cầu của người dùng, nên vẫn thuộc phần mềm ứng dụng." }
    ];

    var BUOC = [
      { co: 1, giai: "Mới có <b>phần cứng</b>: CPU, RAM, ổ đĩa, màn hình. Chưa cài gì thì nó chỉ là " +
        "một đống mạch điện — không biết phải làm việc gì." },
      { co: 2, giai: "Đặt <b>phần mềm hệ thống</b> lên: hệ điều hành và các trình điều khiển. Nó " +
        "<b>không làm việc cụ thể nào cho em</b> — nó làm cho phần cứng dùng được và phục vụ các phần " +
        "mềm khác." },
      { co: 3, giai: "<b>Phần mềm tiện ích</b> nằm giữa: diệt virus, nén tệp, dọn ổ đĩa, sao lưu. Nó " +
        "<b>chăm sóc cái máy</b> chứ không làm việc của người dùng." },
      { co: 4, giai: "Trên cùng là <b>phần mềm ứng dụng</b> — thứ em mở ra để <b>làm việc của mình</b>. " +
        "Mỗi tầng chỉ nói chuyện được với tầng ngay dưới nó, không nhảy cóc." },
      { co: 4, ht: 1, giai: "Thử <b>gỡ tầng phần mềm hệ thống</b>: không còn ai điều khiển phần cứng, " +
        "nên <b>tiện ích và ứng dụng chết theo hết</b>. Không có phần mềm hệ thống thì không ứng dụng " +
        "nào chạy được." },
      { co: 4, ud: 1, giai: "Ngược lại, gỡ <b>một phần mềm ứng dụng</b> (ví dụ trò chơi): các tầng " +
        "dưới <b>không hề gì</b>, máy vẫn chạy. Quan hệ phụ thuộc chỉ đi <b>một chiều</b>." },
      { p: 2, giai: "Giờ tới phần xếp nhóm. <b>Bấm vào từng dòng</b> để chọn nhóm cho phần mềm đó; " +
        "xếp đúng thì dòng xanh, sai thì dòng đỏ. Câu hỏi duy nhất cần tự hỏi: nó phục vụ <b>máy</b> " +
        "hay phục vụ <b>công việc của em</b>?" },
      { p: 2, soi: "tr", giai: "Ca dễ nhầm thứ nhất — <b>trình duyệt web là phần mềm ứng dụng</b>. " +
        "Nhiều em tưởng nó là một phần của hệ điều hành vì máy nào cũng có sẵn, nhưng cài sẵn chỉ là " +
        "chuyện tiện lợi; gỡ nó đi máy vẫn chạy." },
      { p: 2, soi: "td", giai: "Ca dễ nhầm thứ hai — <b>trình dịch là phần mềm hệ thống</b>. Nó phục " +
        "vụ việc tạo ra phần mềm khác, chứ không phục vụ công việc thường ngày của người dùng." },
      { p: 2, mo: 1, giai: "Mở hết đáp án kèm lí do. Đọc cột lí do chứ đừng học thuộc danh sách tên " +
        "phần mềm — đề có thể hỏi một phần mềm em chưa nghe bao giờ." },
      { p: 3, giai: "Còn một cách phân loại khác, theo <b>bản quyền</b>. Chỗ đề hay bẫy nằm ở dòng " +
        "giữa: <b>miễn phí không có nghĩa là nguồn mở</b>." }
    ];

    var buoc;
    var chon = {};   /* id phần mềm -> nhóm học sinh đã chọn */
    var moHet;       /* đã mở toàn bộ đáp án chưa */

    var node = MH.el(MH.khung("Bốn tầng phần mềm: cái nào phục vụ máy, cái nào phục vụ em?",
      "Bấm “Bước tiếp” để dựng tháp <b>từ dưới lên</b>, thử gỡ từng tầng, rồi tự xếp nhóm cho 10 phần " +
      "mềm quen thuộc. Hai ô tích ở trên bật/tắt được bất cứ lúc nào để so.",
      '<div data-mh="thap"></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> đang chạy được</span>' +
      '<span><i class="hong"></i> không chạy được</span>' +
      '<span><i class="cho"></i> chưa có</span></div>' +
      '<div class="mh4-cuon" data-mh="oBang" hidden><table class="mh4-b" data-mh="bang"></table></div>' +
      '<div class="mh4-cuon" data-mh="oBq" hidden><table class="mh4-b" data-mh="bq"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="goht"> gỡ bỏ phần mềm hệ thống</label> ' +
      '<label class="mh7-tick"><input type="checkbox" data-mh="goud"> gỡ bỏ một phần mềm ứng dụng</label>'));

    var loi = loiCua(node);
    function o(k) { return node.querySelector('[data-mh="' + k + '"]'); }
    function tick(k) { return o(k).checked; }

    /* Trạng thái tầng tính LẠI từ số tầng đã dựng + hai ô tích, nên ô tích bật
       tay hay do bước tự bật đều ra cùng một kết quả. */
    function veThap(co) {
      var goHt = tick("goht"), goUd = tick("goud"), h = "", i, lop, mo;
      for (i = 0; i < 4; i++) {
        mo = TANG[i].mo;
        if (i < 4 - co) lop = "cho";
        else if (i === 3) lop = "xong";
        else if (goHt) {
          lop = "hong";
          mo = i === 2 ? "đã gỡ — không còn ai điều khiển phần cứng"
            : (i === 1 ? "chết theo — mất nền để chạy" : "chết theo — mọi ứng dụng dừng hết");
        } else { lop = "xong"; if (i === 0 && goUd) mo = "đã gỡ trò chơi, các phần mềm khác vẫn chạy"; }
        h += '<div class="mh9-so"><div class="mh9-tb ' + lop + '"><b>' + esc(TANG[i].ten) +
          "</b><small>" + esc(mo) + "</small></div></div>";
        if (i < 3) h += '<div class="mh9-noi"></div>';
      }
      o("thap").innerHTML = h;
      return goHt ? 1 : co;   /* gỡ tầng hệ thống thì chỉ còn phần cứng sống */
    }

    function demDung() {
      var n = 0;
      PM.forEach(function (p) { if (chon[p.id] === p.dung) n++; });
      return n;
    }

    function veBang(soi) {
      var h = "<tr><th>Phần mềm</th><th>Em xếp vào</th><th>Nhóm đúng và lí do</th></tr>", ds, i;
      PM.forEach(function (p, k) {
        var c = chon[p.id];
        var lop = p.id === soi ? "nay" : (c ? (c === p.dung ? "khop" : "rac") : "");
        var mo = moHet || c === p.dung;
        h += '<tr class="' + lop + '" data-i="' + k + '"><td>' + esc(p.ten) + "</td><td>" +
          (c ? esc(NHOM[c]) : "bấm để xếp") + "</td><td>" +
          (mo ? "<b>" + esc(NHOM[p.dung]) + "</b> — " + p.vi : "—") + "</td></tr>";
      });
      o("bang").innerHTML = h;
      /* Gắn lại onclick sau mỗi lần vẽ vì innerHTML vừa xoá sạch các tr cũ. */
      ds = node.querySelectorAll('[data-mh="bang"] tr[data-i]');
      for (i = 0; i < ds.length; i++) {
        (function (tr) {
          tr.onclick = function () {
            var p = PM[Number(tr.getAttribute("data-i"))];
            var j = THU.indexOf(chon[p.id]);      /* -1 khi chưa xếp -> vòng về "ht" */
            if (j >= THU.length - 1) delete chon[p.id]; else chon[p.id] = THU[j + 1];
            ve(); loi(chon[p.id] === p.dung ? "Đúng. " + p.vi
              : (chon[p.id] ? "Chưa đúng. Thử hỏi lại: nó phục vụ <b>máy</b> hay phục vụ <b>công việc " +
                "của em</b>?" : "Đã bỏ chọn dòng này."));
          };
        })(ds[i]);
      }
    }

    function veBanQuyen() {
      o("bq").innerHTML =
        "<tr><th>Loại</th><th>Trả tiền?</th><th>Xem và sửa mã nguồn?</th><th>Được chia sẻ lại?</th></tr>" +
        "<tr><td>Thương mại</td><td>Phải mua giấy phép mới dùng hợp pháp</td><td>Không</td>" +
        "<td>Không</td></tr>" +
        "<tr><td>Miễn phí</td><td>Không mất tiền</td>" +
        '<td class="mh8-lech">Không — đây là chỗ hay nhầm</td><td>Tuỳ giấy phép, thường chỉ được dùng</td></tr>' +
        "<tr><td>Nguồn mở</td><td>Phần lớn không mất tiền</td>" +
        '<td class="mh8-khoa">Có, được xem và sửa</td><td>Có, theo giấy phép đi kèm</td></tr>';
    }

    function ve() {
      var d = BUOC[buoc], i, song;
      var co = 4;
      for (i = buoc; i >= 0; i--) if (BUOC[i].co) { co = BUOC[i].co; break; }
      song = veThap(co);

      o("oBang").hidden = !(d.p >= 2);
      o("oBq").hidden = !(d.p >= 3);
      if (d.p >= 2) veBang(d.soi);
      if (d.p >= 3) veBanQuyen();

      o("dem").innerHTML = d.p >= 2
        ? "đã xếp đúng: <b>" + demDung() + "/" + PM.length + "</b> phần mềm"
        : "tầng đang hoạt động: <b>" + song + "/4</b>";

      var canh = o("canh");
      canh.hidden = !(tick("goht") || d.p >= 3);
      if (tick("goht")) canh.innerHTML = "<b>Gỡ phần mềm hệ thống thì mọi thứ phía trên sập theo.</b> " +
        "Ứng dụng không nói chuyện thẳng với phần cứng được — nó phải đi qua hệ điều hành.";
      else if (d.p >= 3) canh.innerHTML = "<b>Miễn phí khác nguồn mở.</b> Miễn phí là không mất tiền; " +
        "nguồn mở là được xem và sửa mã. Một phần mềm có thể miễn phí mà vẫn giấu kín mã nguồn.";

      var ghi = o("ghi");
      ghi.hidden = !(d.p >= 3);
      ghi.className = "mh7-ghi xong";
      if (d.p >= 3) ghi.innerHTML = "Nhớ đúng một câu: <b>phần mềm hệ thống phục vụ máy và phục vụ " +
        "phần mềm khác; phần mềm ứng dụng phục vụ công việc của người dùng.</b> Lưu ý nhiều sách xếp " +
        "<b>phần mềm tiện ích vào chung nhóm phần mềm hệ thống</b> — vì nó cũng chăm sóc máy chứ không " +
        "làm việc của em; tách riêng ở đây chỉ để nhìn rõ nó nằm giữa.";
    }

    o("tien").onclick = function () {
      if (buoc >= BUOC.length - 1) {
        loi("Đã hết bước. Bảng phân loại vẫn bấm được — thử xếp lại vài dòng, hoặc bấm “Làm lại”.");
        return;
      }
      buoc++;
      var d = BUOC[buoc];
      o("goht").checked = !!d.ht;      /* đặt lại ô tích theo bước, để bước 5 và 6 khác hẳn nhau */
      o("goud").checked = !!d.ud;
      if (d.mo) moHet = true;
      ve(); loi(d.giai);
    };

    function lamLai() {
      buoc = 0; chon = {}; moHet = false;
      o("goht").checked = false; o("goud").checked = false;
      ve(); loi(BUOC[0].giai);
    }
    /* Không đưa hai ô tích vào ganDatLai: ở đó mọi thay đổi đều gọi "Làm lại",
       mà tích để gỡ tầng thì phải giữ nguyên bước hiện tại mới thấy được hậu quả. */
    ganDatLai(node, [], lamLai);
    ["goht", "goud"].forEach(function (k) {
      o(k).addEventListener("change", function () {
        ve();
        loi(tick("goht") ? "Vừa gỡ tầng hệ thống — nhìn hai tầng trên cùng đổ theo."
          : (tick("goud") ? "Vừa gỡ một ứng dụng — các tầng dưới không hề gì."
            : "Đã lắp lại đủ các tầng."));
      });
    });
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-05 · KHAI THÁC THÔNG TIN SỐ — TÌM CHO RA, RỒI MỚI TIN
   *
   *  Bộ lọc CHẠY THẬT trên mảng KQ (10 kết quả giả lập): mỗi toán tử là một
   *  điều kiện loại bỏ riêng, số còn lại do đếm mà ra — nên em gõ truy vấn
   *  khác vào ô nhập thì kết quả vẫn đúng, không phải kịch bản viết sẵn.
   * ================================================================ */
  MH.dangKy("C11-05", function (host) {
    /* Tên miền cố ý đặt chung chung — không mượn tên trang có thật của ai. */
    var KQ = [
      { td: "Khoá học lập trình cấp tốc — đăng ký ngay hôm nay", mien: "khoahoc-online.vn", loai: "trang", qc: 1,
        tr: "Học thuật toán từ số 0. Nội dung gồm sắp xếp, tìm kiếm, đồ thị. Ưu đãi 50% trong tuần này." },
      { td: "Thuật toán sắp xếp nổi bọt và sắp xếp chèn — bài giảng", mien: "dhbk.edu.vn", loai: "trang",
        tr: "Bài giảng trình bày các thuật toán sắp xếp cơ bản kèm phân tích số phép so sánh." },
      { td: "Tài liệu: Các thuật toán sắp xếp cơ bản", mien: "dhbk.edu.vn", loai: "pdf",
        tr: "Chương 3 — thuật toán sắp xếp: nổi bọt, chọn, chèn, trộn; có mã giả và bài tập cuối chương." },
      { td: "Cài đặt thuật toán sắp xếp bằng Python", mien: "tapchi-tinhoc.vn", loai: "trang",
        tr: "Hướng dẫn viết thuật toán sắp xếp nổi bọt bằng Python và đo thời gian chạy thực tế." },
      { td: "Giáo trình cấu trúc dữ liệu và giải thuật", mien: "dhsp.edu.vn", loai: "pdf",
        tr: "Toàn văn giáo trình: mảng, danh sách liên kết, thuật toán sắp xếp và tìm kiếm nhị phân." },
      { td: "Mẹo sắp xếp góc học tập cho gọn gàng", mien: "meovat-hangngay.vn", loai: "trang",
        tr: "Vài thuật nhỏ giúp bàn học ngăn nắp: sách toán, văn, tiếng Anh xếp riêng từng ngăn." },
      { td: "Hỏi cả nhà: thuật toán nào nhanh nhất vậy?", mien: "mangxahoi.vn", loai: "trang", chep: 1,
        tr: "Mình đọc đâu đó nói sắp xếp nổi bọt nhanh nhất, ai cũng nói vậy nên chắc là đúng rồi." },
      { td: "Top 5 thuật toán sắp xếp nhanh nhất hiện nay", mien: "tinhot-24h.vn", loai: "trang", chep: 1,
        tr: "Đứng đầu danh sách là thuật toán sắp xếp nổi bọt — nhanh nhất trong mọi trường hợp." },
      { td: "Thuật toán sắp xếp nổi bọt có nhanh nhất không?", mien: "chiase-kienthuc.vn", loai: "trang", chep: 1,
        tr: "Theo nhiều nguồn, thuật toán sắp xếp nổi bọt cho tốc độ nhanh nhất với mọi loại dữ liệu." },
      { td: "Bộ đề thi thử môn Tin học có đáp án", mien: "tailieu-chung.vn", loai: "pdf",
        tr: "Đề gồm câu hỏi về mảng một chiều, thuật toán tìm kiếm, biểu thức toán học và cách sắp xếp dữ liệu." }
    ];
    var TOAN = [
      { k: "\"...\"", m: "khớp đúng cụm từ liền nhau, đúng thứ tự" },
      { k: "site:", m: "chỉ lấy kết quả trong một tên miền" },
      { k: "-từ", m: "loại bỏ kết quả có chứa từ đó" },
      { k: "filetype:", m: "chỉ lấy một loại tệp (pdf, doc…)" }
    ];
    var NGUON = [
      { ten: "Trang bài giảng của một trường đại học", mien: "dhbk.edu.vn", lop: "khop", kl: "tin cậy cao",
        o: [{ t: "TS. Nguyễn Văn A, khoa CNTT", ok: 1 }, { t: "cập nhật 03/2025", ok: 1 },
          { t: "có danh mục tài liệu tham khảo", ok: 1 }, { t: "dạy học, không bán gì", ok: 1 }] },
      { ten: "Bài trên tạp chí tin học", mien: "tapchi-tinhoc.vn", lop: "khop", kl: "dùng được",
        o: [{ t: "Trần B, có tên và chức danh", ok: 1 }, { t: "đăng 11/2024", ok: 1 },
          { t: "dẫn lại 2 công trình gốc", ok: 1 }, { t: "chia sẻ kiến thức", ok: 1 }] },
      { ten: "Trang bán khoá học", mien: "khoahoc-online.vn", lop: "rac", kl: "chỉ để tham khảo",
        o: [{ t: "chỉ ghi “Ban biên tập”", ok: 0 }, { t: "không ghi ngày nào cả", ok: 0 },
          { t: "không dẫn nguồn nào", ok: 0 }, { t: "bán khoá học — mục đích thương mại", ok: 0 }] },
      { ten: "Bài đăng trên mạng xã hội", mien: "mangxahoi.vn", lop: "rac", kl: "không dùng được",
        o: [{ t: "một nick ẩn danh", ok: 0 }, { t: "đăng đã lâu, không sửa lại", ok: 0 },
          { t: "“mình đọc đâu đó”", ok: 0 }, { t: "câu tương tác", ok: 0 }] }
    ];

    var P2 = 6;                       /* chỉ số bước đầu tiên của phần 2 */
    var B = [
      { p: 1, q: "thuật toán sắp xếp",
        canh: "<b>Kết quả đứng đầu không có nghĩa là đúng nhất.</b> Thứ hạng do nhiều yếu tố quyết định " +
          "(từ khoá, lượt bấm, trang tự tối ưu), và mấy vị trí đầu thường là <b>quảng cáo trả tiền</b> " +
          "để được đứng đó — đúng như ô đầu tiên em đang thấy.",
        g: "Tìm thường: máy lấy mọi trang có đủ bốn từ, nằm rời rạc chỗ nào cũng được. Ra <b>10/10</b>, " +
          "có cả trang mẹo dọn bàn học lẫn trang bán khoá học." },
      { p: 1, q: "thuật toán sắp xếp", dau: 1,
        canh: "<b>Nhiều trang cùng nói một điều không làm điều đó thành đúng.</b> Ba trang đánh dấu chép " +
          "lẫn của nhau từ cùng một nguồn sai — “nổi bọt nhanh nhất” là <b>sai</b>, nổi bọt thuộc nhóm " +
          "chậm. Đối chiếu là tìm nguồn <b>độc lập</b>, không phải đếm xem bao nhiêu trang nói vậy.",
        g: "Vẫn truy vấn cũ. Em nhìn ba kết quả được đánh dấu: câu chữ gần như giống hệt nhau." },
      { p: 1, q: "\"thuật toán sắp xếp\"",
        g: "Thêm <b>dấu ngoặc kép</b>: bốn từ phải đứng <b>liền nhau, đúng thứ tự</b>. Trang dọn bàn học " +
          "và trang bán khoá học rơi ngay, vì chúng chỉ chứa các từ rời rạc." },
      { p: 1, q: "\"thuật toán sắp xếp\" site:edu.vn",
        canh: "Trang <b>.edu</b> hay <b>.gov</b> thường đáng tin hơn nhưng <b>không phải luôn luôn</b>: " +
          "một trang cá nhân đặt nhờ tên miền trường, bỏ mười năm không sửa, vẫn có đuôi .edu.vn. Vẫn " +
          "phải xem <b>ai viết</b> và <b>viết khi nào</b>.",
        g: "<b>site:</b> giới hạn trong một tên miền — chỉ còn các trang đuôi <b>edu.vn</b>." },
      { p: 1, q: "\"thuật toán sắp xếp\" -python",
        g: "<b>Dấu trừ</b> gạch bỏ mọi kết quả có chứa từ đó. Em đang học lí thuyết, chưa cần bản cài " +
          "đặt bằng Python — bài đó biến mất." },
      { p: 1, q: "\"thuật toán sắp xếp\" filetype:pdf",
        ghi: "Bốn toán tử cần thuộc: <b>\"…\"</b> khớp đúng cụm liền nhau · <b>site:</b> giới hạn tên " +
          "miền · <b>-từ</b> loại bỏ · <b>filetype:</b> lọc loại tệp. Thử tự gõ truy vấn khác vào ô phía " +
          "trên — bộ lọc chạy thật trên đúng 10 kết quả này.",
        g: "<b>filetype:</b> chỉ lấy một loại tệp. Còn lại toàn <b>PDF</b> — hợp khi cần giáo trình hay " +
          "tài liệu dài thay vì bài viết ngắn." },
      { p: 2, ng: 0,
        g: "Sang phần hai: tìm ra rồi thì <b>tin cái nào</b>? Chấm nguồn thứ nhất bằng bốn câu hỏi. Có " +
          "tên tác giả kèm cơ quan, mới cập nhật, có dẫn tài liệu tham khảo, mục đích là dạy học." },
      { p: 2, ng: 1,
        g: "Bài tạp chí: có tác giả, có ngày, có dẫn lại công trình gốc. Dùng được — nhưng vẫn nên đối " +
          "chiếu, vì đây là bài viết lại chứ không phải nguồn gốc." },
      { p: 2, ng: 2,
        canh: "Trang này <b>bán khoá học</b>. Mục đích thương mại không tự động biến nội dung thành sai, " +
          "nhưng nó có lí do để nói quá — nên chỉ đọc tham khảo, không lấy làm căn cứ.",
        g: "Trang bán khoá học: không rõ ai viết, không ngày, không dẫn nguồn — <b>hỏng cả bốn ô</b>." },
      { p: 2, ng: 3,
        g: "Bài mạng xã hội: nick ẩn danh, đăng đã lâu, nguồn là “mình đọc đâu đó”, viết để câu tương " +
          "tác. Không có gì kiểm chứng được — thấp nhất." },
      { p: 2, ng: 4,
        canh: "<b>Chép nguyên văn từ mạng vào bài là đạo văn</b> — dù nguồn tin cậy tới đâu, dù em có " +
          "tìm được nguồn hay không. Đọc hiểu rồi viết lại bằng lời của em, và ghi rõ tham khảo ở đâu.",
        ghi: "Chốt bài: thu hẹp bằng <b>toán tử</b>, rồi chấm nguồn bằng bốn câu hỏi <b>ai viết · viết " +
          "khi nào · có dẫn nguồn không · viết để làm gì</b>. Thứ hạng cao, nhiều trang cùng nói, hay " +
          "đuôi .edu đều <b>không</b> thay được bốn câu hỏi đó.",
        g: "Bốn nguồn cùng nói một chủ đề nhưng giá trị khác hẳn nhau — cái quyết định là bốn cột trong " +
          "bảng, không phải trang nào đẹp hơn hay đứng trước." }
    ];

    var buoc, tuGo = 0;
    var node = MH.el(MH.khung("Tìm cho ra, rồi mới tin",
      "Hai phần: <b>(1)</b> thêm từng toán tử vào truy vấn để xem nó cắt bớt kết quả thế nào — bộ lọc " +
      "chạy thật trên 10 kết quả giả lập; <b>(2)</b> chấm độ tin cậy của bốn nguồn cùng nói một chủ đề. " +
      "Bấm <b>“Bước tiếp”</b>, hoặc tự gõ truy vấn khác vào ô dưới.",
      '<div data-mh="p1"><div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Truy vấn</p>' +
      '<div class="mh7-code" data-mh="code"></div>' +
      '<p class="mh7-nhan" style="margin-top:11px">Toán tử đang dùng</p>' +
      '<div class="mh7-ds" data-mh="toan"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Kết quả trả về</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Máy tìm kiếm</div>' +
      '<div class="mh7-noi" data-mh="kq"></div></div></div></div></div>' +
      '<div data-mh="p2" hidden><div class="mh7-ds" data-mh="ds"></div>' +
      '<div class="mh4-cuon" style="margin-top:11px"><table class="mh4-b" data-mh="bang"></table></div></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhTimQ">Truy vấn:</label>' +
      '<input class="mh-o-nhap" id="mhTimQ" data-mh="q" type="text" style="max-width:330px">'));
    var loi = loiCua(node);
    var oQ = node.querySelector('[data-mh="q"]');

    /* Chuẩn hoá về "chữ thường, chỉ còn chữ và số, có khoảng trắng bao hai đầu"
       để so khớp NGUYÊN TỪ, chứ không khớp một mẩu lọt giữa từ khác. */
    function chuan(s) {
      return " " + String(s).toLowerCase().replace(/[^0-9a-zà-ỹ]+/gi, " ").replace(/^\s+|\s+$/g, "") + " ";
    }
    function tach(q) { return String(q).match(/"[^"]*"|\S+/g) || []; }

    function docTV(q) {
      var r = { cum: [], tu: [], tru: [], site: "", tep: "" }, ds = tach(q), i, t;
      for (i = 0; i < ds.length; i++) {
        t = ds[i];
        if (t.charAt(0) === "\"") r.cum.push(t.replace(/"/g, ""));
        else if (t.toLowerCase().indexOf("site:") === 0) r.site = t.slice(5).toLowerCase();
        else if (t.toLowerCase().indexOf("filetype:") === 0) r.tep = t.slice(9).toLowerCase();
        else if (t.charAt(0) === "-" && t.length > 1) r.tru.push(t.slice(1));
        else r.tu.push(t);
      }
      return r;
    }

    function loc(pt) {
      var gc = [], i, j, k, t, ok;
      for (i = 0; i < KQ.length; i++) {
        k = KQ[i]; t = chuan(k.td + " " + k.tr); ok = true;
        for (j = 0; j < pt.cum.length; j++) if (t.indexOf(chuan(pt.cum[j])) < 0) ok = false;
        for (j = 0; j < pt.tu.length; j++) if (t.indexOf(chuan(pt.tu[j])) < 0) ok = false;
        for (j = 0; j < pt.tru.length; j++) if (t.indexOf(chuan(pt.tru[j])) >= 0) ok = false;
        if (pt.site && k.mien !== pt.site && k.mien.slice(-pt.site.length - 1) !== "." + pt.site) ok = false;
        if (pt.tep && k.loai !== pt.tep) ok = false;
        if (ok) gc.push(k);
      }
      return gc;
    }

    function veP1(q, dau) {
      var pt = docTV(q), ds = loc(pt), tk = tach(q), h = "", i, j;
      /* Toán tử vừa thêm luôn là mẩu cuối truy vấn, trừ khi cả truy vấn chỉ có
         mỗi cụm trong ngoặc kép. Tính ra, không viết cứng cho từng bước. */
      var tt = pt.tep ? 3 : (pt.tru.length ? 2 : (pt.site ? 1 : (pt.cum.length ? 0 : -1)));
      var nay = tt < 0 ? -1 : (tk.length > 1 ? tk.length - 1 : 0);
      for (i = 0; i < tk.length; i++) {
        h += '<div class="mh7-d' + (i === nay ? " nay" : (nay >= 0 ? " mo" : "")) + '">' + esc(tk[i]) + "</div>";
      }
      node.querySelector('[data-mh="code"]').innerHTML = h || '<div class="mh7-d">(chưa gõ gì)</div>';
      node.querySelector('[data-mh="toan"]').innerHTML = TOAN.map(function (o, n) {
        return '<div class="mh7-m' + (n === tt ? " nay" : "") + '"><b>' + esc(o.k) + "</b><small>" +
          esc(o.m) + "</small></div>";
      }).join("");

      h = "";
      for (i = 0; i < ds.length; i++) {
        h += '<p><a href="#">' + esc(ds[i].td) + "</a>" +
          (ds[i].qc ? " <strong>[Quảng cáo]</strong>" : "") +
          (dau && ds[i].chep ? " <strong>[ba trang chép của nhau]</strong>" : "") +
          "<br><em>" + esc(ds[i].mien) + (ds[i].loai === "pdf" ? " · tệp PDF" : "") + "</em><br>" +
          esc(ds[i].tr) + "</p>";
      }
      var oKq = node.querySelector('[data-mh="kq"]');
      oKq.innerHTML = h || '<p class="mh7-trong">Không kết quả nào khớp truy vấn này.</p>';
      /* innerHTML vừa ghi đè nên phải gắn lại mỗi lần vẽ. Chặn điều hướng: đây
         là kết quả giả lập, bấm thật là văng khỏi bài học. */
      var lk = oKq.getElementsByTagName("a");
      for (j = 0; j < lk.length; j++) {
        lk[j].onclick = function (e) {
          e.preventDefault();
          loi("Đây là kết quả <b>giả lập</b> để em tập lọc, nên không dẫn đi đâu cả.");
        };
      }
      node.querySelector('[data-mh="dem"]').innerHTML =
        "còn <b>" + ds.length + "</b>/" + KQ.length + " kết quả";
    }

    function veP2(ng) {
      node.querySelector('[data-mh="ds"]').innerHTML = NGUON.map(function (n, i) {
        return '<div class="mh7-m' + (i === ng ? " nay" : "") + '" data-i="' + i + '">' +
          '<b class="van">' + esc(n.ten) + "</b><small>" + esc(n.mien) + "</small></div>";
      }).join("");
      var m = node.querySelectorAll('[data-mh="ds"] .mh7-m'), i, j, n;
      for (i = 0; i < m.length; i++) {
        m[i].onclick = function () {
          tuGo = 0; buoc = P2 + Number(this.getAttribute("data-i")); ve(); loi(B[buoc].g);
        };
      }
      var h = "<tr><th>Nguồn</th><th>Ai viết</th><th>Viết khi nào</th><th>Có dẫn nguồn</th>" +
        "<th>Viết để làm gì</th><th>Kết luận</th></tr>";
      for (i = 0; i < NGUON.length && i <= ng; i++) {
        n = NGUON[i];
        h += '<tr class="' + (i === ng ? "nay" : n.lop) + '"><td>' + esc(n.ten) + "</td>";
        for (j = 0; j < n.o.length; j++) {
          h += "<td" + (n.o[j].ok ? "" : ' class="mh8-lech"') + ">" + esc(n.o[j].t) + "</td>";
        }
        h += "<td" + (n.lop === "khop" ? ' class="mh8-khoa"' : "") + ">" + esc(n.kl) + "</td></tr>";
      }
      node.querySelector('[data-mh="bang"]').innerHTML = h;
      node.querySelector('[data-mh="dem"]').innerHTML =
        "đã chấm <b>" + Math.min(ng + 1, NGUON.length) + "</b>/" + NGUON.length + " nguồn";
    }

    function ve() {
      var d = B[buoc];
      node.querySelector('[data-mh="p1"]').hidden = d.p !== 1;
      node.querySelector('[data-mh="p2"]').hidden = d.p !== 2;
      if (d.p === 1) { oQ.value = d.q; veP1(d.q, d.dau); } else veP2(d.ng);
      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !d.canh;
      if (d.canh) canh.innerHTML = d.canh;
      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !d.ghi;
      ghi.className = "mh7-ghi xong";
      if (d.ghi) ghi.innerHTML = d.ghi;
    }

    /* Em tự gõ: vẫn lọc thật, nhưng bỏ mọi lời dẫn của bước đang chạy. */
    oQ.oninput = function () {
      tuGo = 1;
      node.querySelector('[data-mh="p1"]').hidden = false;
      node.querySelector('[data-mh="p2"]').hidden = true;
      node.querySelector('[data-mh="canh"]').hidden = true;
      node.querySelector('[data-mh="ghi"]').hidden = true;
      veP1(oQ.value, 0);
      loi("Em đang tự gõ truy vấn — bộ lọc vẫn chạy thật trên 10 kết quả đó. Bấm “Bước tiếp” để quay " +
        "lại bài, hoặc “Làm lại” để bắt đầu từ đầu.");
    };

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (tuGo) { tuGo = 0; ve(); loi(B[buoc].g); return; }
      if (buoc >= B.length - 1) {
        loi("Hết bước rồi. Bấm “Làm lại” để xem lại từ đầu, hoặc tự gõ một truy vấn khác.");
        return;
      }
      buoc++; ve(); loi(B[buoc].g);
    };

    function lamLai() { tuGo = 0; buoc = 0; ve(); loi(B[0].g); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-02 · ỨNG DỤNG VÀ GIỚI HẠN CỦA TRÍ TUỆ NHÂN TẠO
   *
   *  Đây là bài học sinh dễ tin AI "biết tuốt" nhất: đọc sách xong vẫn ngầm
   *  cho rằng câu trả lời trôi chảy là câu trả lời đúng. Nên minh hoạ không kể
   *  lí thuyết mà bày ra BỐN chỗ AI hỏng, mỗi chỗ một tình huống bấm được.
   *  Riêng chỗ thiên lệch, điểm được TÍNH THẬT bằng diemAI() — tích ô "dữ liệu
   *  đã cân bằng" là quy tắc cộng điểm vô lí biến mất và bảng đổi ngay.
   * ================================================================ */
  MH.dangKy("C12-02", function (host) {
    var UNGDUNG = [
      { t: "Nhận dạng ảnh", m: "hàng triệu ảnh đã gán nhãn" },
      { t: "Dịch máy", m: "hàng tỉ câu đã dịch sẵn" },
      { t: "Gợi ý nội dung", m: "lịch sử xem của rất nhiều người" },
      { t: "Trợ lí ảo", m: "kho văn bản khổng lồ" },
      { t: "Xe tự lái", m: "hàng triệu giờ ghi hình đường phố" },
      { t: "Đọc ảnh y tế", m: "kho ảnh chụp đã có chẩn đoán" }
    ];
    var GIOIHAN = [
      { t: "Thiên lệch dữ liệu", m: "dữ liệu lệch thì máy học lệch" },
      { t: "Bịa thông tin", m: "trôi chảy nhưng nguồn không có thật" },
      { t: "Không hiểu ngữ cảnh", m: "khớp mẫu chứ không hiểu ý" },
      { t: "Không chịu trách nhiệm", m: "sai thì con người gánh" }
    ];
    /* Sáu hồ sơ ghép thành ba cặp NĂNG LỰC Y HỆT NHAU (H01–H02, H03–H04,
       H05–H06). Có cặp thì chênh lệch điểm không thể đổ cho "người này
       giỏi hơn" — chỉ còn một lời giải thích duy nhất là quy tắc thiên lệch. */
    var HOSO = [
      { ma: "H01", nhom: "Nam", nam: 3, kt: 90 },
      { ma: "H02", nhom: "Nữ", nam: 3, kt: 90 },
      { ma: "H03", nhom: "Nam", nam: 5, kt: 75 },
      { ma: "H04", nhom: "Nữ", nam: 5, kt: 75 },
      { ma: "H05", nhom: "Nam", nam: 4, kt: 80 },
      { ma: "H06", nhom: "Nữ", nam: 4, kt: 80 }
    ];
    var CAU = [
      { c: "Đề dễ ghê, mỗi tội cả lớp làm không xong.",
        may: "Người viết KHEN đề kiểm tra dễ.",
        that: "Đang mỉa mai: đề khó, cả lớp không làm nổi." },
      { c: "Con ngựa đá con ngựa đá.",
        may: "Ngựa này đá ngựa kia (hai lần đều là động từ).",
        that: "Từ đá thứ hai là chất liệu: con ngựa bằng đá." },
      { c: "Hôm qua em học bài đến 2 giờ.",
        may: "Em học trong 2 tiếng đồng hồ.",
        that: "Học tới 2 giờ sáng — chỉ người biết hoàn cảnh mới đoán đúng." }
    ];
    var LINHVUC = [
      { t: "Y tế", v: "AI đọc ảnh chụp, báo không có gì bất thường",
        ai: "Bác sĩ kí kết luận là người chịu trách nhiệm trước người bệnh." },
      { t: "Pháp luật", v: "AI tóm tắt hồ sơ, dẫn một điều luật không tồn tại",
        ai: "Người nộp bản tóm tắt đó chịu, không đổ được cho phần mềm." },
      { t: "Tuyển dụng", v: "AI loại một hồ sơ vì thiên lệch học từ dữ liệu cũ",
        ai: "Công ty triển khai hệ thống chịu trách nhiệm trước ứng viên." },
      { t: "Tài chính", v: "AI khuyên dồn tiền vào một khoản đầu tư",
        ai: "Người bấm nút mất tiền, và không đòi lại được từ ai cả." }
    ];

    var b;        /* bước hiện tại; -1 = chưa bắt đầu, 2..5 = bốn giới hạn */
    var chamAI;   /* đã bấm "chạy AI" chưa */
    var canBang;  /* dữ liệu học đã cân bằng lại chưa */
    var daKiem;   /* đã kiểm chứng nguồn chưa */
    var iCau, iLv;

    /* QUY TẮC MÁY HỌC ĐƯỢC, viết thẳng ra để thấy thiên lệch nằm ở dòng nào:
       hai số hạng đầu bám vào năng lực thật, còn +12 chỉ bám vào một đặc
       điểm KHÔNG liên quan năng lực. Nó có mặt vì 10 năm hồ sơ được nhận
       của công ty hầu hết là nam, máy khớp ra "nam thì hợp việc". */
    function diemAI(h) {
      var d = h.nam * 4 + h.kt * 3 / 5;
      if (!canBang && h.nhom === "Nam") d += 12;
      return d;
    }
    function xepHang() {
      var ds = HOSO.map(function (h, i) { return { h: h, i: i, d: diemAI(h) }; });
      ds.sort(function (x, y) { return y.d - x.d || x.i - y.i; });
      return ds;
    }
    function bangHS() {
      var t = '<div class="mh4-cuon"><table class="mh4-b"><tr><th>Hồ sơ</th><th>Năm KN</th>' +
        "<th>Điểm KT</th><th>Điểm AI</th></tr>";
      xepHang().forEach(function (o, k) {
        var thuong = !canBang && o.h.nhom === "Nam";
        t += '<tr class="' + (chamAI ? (k < 3 ? "khop" : "rac") : "") + '"><td>' +
          esc(o.h.ma + " · " + o.h.nhom) + "</td><td>" + o.h.nam + "</td><td>" +
          esc((o.h.kt / 10).toFixed(1).replace(".", ",")) + '</td><td class="' +
          (chamAI && thuong ? "mh8-lech" : "") + '">' +
          (chamAI ? o.d + (thuong ? " (+12)" : "") : "—") + "</td></tr>";
      });
      return t + "</table></div>";
    }

    var node = MH.el(MH.khung("AI mạnh ở đâu, và hỏng ở đâu",
      "Hai bước đầu xem AI làm tốt việc gì và <b>vì sao</b>. Bốn bước sau là bốn giới hạn thật, " +
      "mỗi giới hạn một tình huống bấm được. Bấm thẳng vào tên giới hạn bên trái để nhảy tới.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Bốn giới hạn</p><div class="mh7-ds" data-mh="ds"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="nhan">Ứng dụng</p><div data-mh="san"></div></div>' +
      '</div><div class="mh7-ghi xong" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    function nhac() {
      if (b < 0) return "Bấm <b>“Bước tiếp”</b> để xem AI đang làm tốt những việc gì.";
      if (b === 0) return "Sáu việc AI làm rất tốt. Điểm chung nằm ở dòng chữ nhỏ dưới mỗi ô — bấm tiếp để xem.";
      if (b === 1) return "Cả sáu việc đều có <b>rất nhiều dữ liệu mẫu</b>. AI tìm quy luật thống kê trên đống mẫu đó, " +
        "chứ không <b>hiểu</b> việc mình làm. Bốn bước sau cho thấy điều đó dẫn tới đâu.";
      if (b === 2) {
        if (!chamAI) return "Sáu hồ sơ ghép thành ba cặp <b>năng lực y hệt nhau</b>. Bấm <b>“Chạy AI chấm”</b>.";
        if (!canBang) return "Ba hồ sơ đứng đầu đều là nam, dù H02 có đúng năng lực của H01. " +
          "<b>AI không tự nghĩ ra thiên kiến</b> — nó học từ dữ liệu con người để lại. " +
          "Dữ liệu 10 năm toàn nam nên máy suy ra “nam thì hợp việc”, rồi trả về một con số " +
          "nghe rất khách quan, khiến thiên kiến của máy <b>khó cãi hơn</b> thiên kiến của người.";
        return "Bỏ quy tắc +12 đi thì mỗi cặp bằng điểm nhau đúng như năng lực của họ. " +
          "Sửa được là vì lỗi nằm ở <b>dữ liệu học</b>, không nằm ở chỗ máy “có ác ý”.";
      }
      if (b === 3) {
        if (!daKiem) return "Trợ lí AI trả lời rất trôi chảy, có cả tên sách, tên tác giả, số trang. " +
          "Bấm <b>“Kiểm chứng nguồn”</b> xem sách đó có thật không.";
        return "Không có cuốn sách nào như vậy. AI đoán <b>chữ nào hay đi sau chữ nào</b>, " +
          "nó không tra cứu sự thật — mà một cái nguồn giả thì cũng “nghe như thật” y hệt nguồn thật. " +
          "Vậy nên <b>giọng tự tin không phải bằng chứng</b>: cái gì quan trọng thì em phải tự kiểm chứng.";
      }
      if (b === 4) {
        if (iCau < 0) return "Bấm vào một câu tiếng Việt để xem AI hiểu nó thế nào.";
        return "Máy chọn nghĩa <b>hay gặp nhất trong dữ liệu</b> chứ không đoán ý người nói. " +
          "Mỉa mai, chơi chữ, câu thiếu ngữ cảnh — người nghe hiểu nhờ biết hoàn cảnh, " +
          "còn máy chỉ <b>khớp mẫu</b>, nên trượt.";
      }
      if (b === 5) {
        if (iLv < 0) return "Bấm vào một lĩnh vực để xem ai là người chịu trách nhiệm khi AI gợi ý sai.";
        return "Máy không có tài sản, không ra toà, không xin lỗi ai được — nên nó <b>không chịu trách nhiệm</b> " +
          "được. Trách nhiệm luôn rơi vào <b>người dùng và người triển khai</b>. Vì thế bốn lĩnh vực này " +
          "bắt buộc phải có người quyết định cuối.";
      }
      return "Bốn giới hạn đều bắt nguồn từ một chỗ: AI <b>không hiểu</b>, nó tìm quy luật trên dữ liệu.";
    }

    function veSan(san, nhan) {
      var s = "";
      if (b <= 1) {
        nhan.textContent = "Ứng dụng của AI";
        s = '<div class="mh9-so">' + UNGDUNG.map(function (u) {
          return '<div class="mh9-tb' + (b >= 1 ? " xong" : "") + '"><b>' + esc(u.t) +
            "</b><small>" + (b >= 1 ? esc(u.m) : "làm tốt") + "</small></div>";
        }).join("") + "</div>";
        if (b >= 1) s += '<p class="mh8-dem">Điểm chung: việc nào cũng có <b>rất nhiều dữ liệu mẫu</b> để học</p>';
      } else if (b === 2) {
        nhan.textContent = "Giới hạn 1 · AI tuyển dụng";
        s = '<p class="mh8-dem">Dữ liệu học: 10 năm hồ sơ được nhận của một công ty công nghệ — ' +
          "<b>hầu hết là nam</b></p>" + bangHS();
        if (!chamAI) s += '<p class="mh8-dem"><button class="mh-btn chinh" data-mh="chay">Chạy AI chấm 6 hồ sơ</button></p>';
        else {
          s += '<p class="mh8-dem">Quy tắc máy học được: điểm = 4×số năm + 0,6×điểm KT' +
            (canBang ? "" : " <b>+12 nếu là nam</b>") + "</p>" +
            '<label class="mh7-tick"><input type="checkbox" data-mh="cb"' + (canBang ? " checked" : "") +
            "> dùng dữ liệu học đã cân bằng lại</label>";
          s += canBang
            ? '<p class="mh8-dem">H01 và H02 giờ <b class="mh8-khoa">bằng điểm nhau</b>, H03 = H04, H05 = H06</p>'
            : '<div class="mh8-canh">Ba suất phỏng vấn rơi hết vào nhóm nam. H01 và H02 năng lực như nhau ' +
              "nhưng lệch đúng <b>12 điểm</b> — đúng bằng số điểm máy tự cộng cho một đặc điểm " +
              "<b>không liên quan tới năng lực</b>.</div>";
        }
      } else if (b === 3) {
        nhan.textContent = "Giới hạn 2 · Bịa nghe rất thật";
        s = '<div class="mh10-out"><div>Em hỏi: nghề in ở Việt Nam có từ bao giờ?</div>' +
          "<div>Trợ lí AI: Nghề in xuất hiện từ rất sớm và</div>" +
          "<div>phát triển mạnh qua nhiều thế kỉ.</div>" +
          '<div class="trong">Nguồn: “Lịch sử nghề in ở Việt Nam”,</div>' +
          '<div class="trong">Trần Văn Hùng, 2018, trang 112.</div>' +
          (daKiem
            ? '<div class="loi">Tra thư viện: KHÔNG có cuốn sách này.</div>' +
              '<div class="loi">KHÔNG có tác giả này. Trang 112 là bịa.</div>'
            : "") + "</div>";
        if (!daKiem) s += '<p class="mh8-dem"><button class="mh-btn chinh" data-mh="kiem">Kiểm chứng nguồn</button></p>';
        else s += '<div class="mh8-canh">Câu trả lời <b>trôi chảy</b> không có nghĩa là câu trả lời <b>đúng</b>. ' +
          "Cái nguồn giả kia được sinh ra vì nó <b>giống hình dạng</b> của một cái nguồn thật.</div>";
      } else if (b === 4) {
        nhan.textContent = "Giới hạn 3 · Không hiểu ý";
        s = '<div class="mh7-ds">' + CAU.map(function (c, k) {
          return '<div class="mh7-m' + (iCau === k ? " nay" : "") + '" data-c="' + k + '">' +
            '<b class="van">' + esc(c.c) + "</b><small>bấm để xem AI hiểu thế nào</small></div>";
        }).join("") + "</div>";
        if (iCau >= 0) s += '<div class="mh10-out" style="margin-top:9px">' +
          '<div class="loi">AI hiểu: ' + esc(CAU[iCau].may) + "</div>" +
          "<div>Ý thật: " + esc(CAU[iCau].that) + "</div></div>";
      } else if (b === 5) {
        nhan.textContent = "Giới hạn 4 · Ai chịu trách nhiệm?";
        s = '<div class="mh9-so">' + LINHVUC.map(function (l, k) {
          return '<div class="mh9-tb' + (iLv === k ? " nay" : "") + '" data-l="' + k + '"><b>' +
            esc(l.t) + "</b><small>bấm xem</small></div>";
        }).join("") + "</div>";
        if (iLv >= 0) s += '<div class="mh8-canh">' + esc(LINHVUC[iLv].v) +
          " → <b>" + esc(LINHVUC[iLv].ai) + "</b></div>";
      } else {
        nhan.textContent = "Tóm lại";
        s = '<div class="mh9-so">' + GIOIHAN.map(function (g) {
          return '<div class="mh9-tb xong"><b>' + esc(g.t) + "</b><small>" + esc(g.m) + "</small></div>";
        }).join("") + "</div>";
      }
      san.innerHTML = s;
    }

    function ve() {
      var san = node.querySelector('[data-mh="san"]');
      veSan(san, node.querySelector('[data-mh="nhan"]'));

      var ds = node.querySelector('[data-mh="ds"]');
      ds.innerHTML = GIOIHAN.map(function (g, k) {
        return '<div class="mh7-m' + (b - 2 === k ? " nay" : "") + '" data-g="' + k + '">' +
          '<b class="van">' + (k + 1) + ". " + esc(g.t) + "</b><small>" + esc(g.m) + "</small></div>";
      }).join("");

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = b < 6;
      ghi.innerHTML = "AI là <b>công cụ mạnh nhưng phải kiểm chứng</b>. Nó không hiểu như người, " +
        "chỉ tìm quy luật thống kê trên dữ liệu: dữ liệu lệch thì kết quả lệch, và giọng tự tin " +
        "không phải bằng chứng. Càng việc quan trọng — sức khoẻ, tiền bạc, pháp lí, tuyển dụng — " +
        "thì càng phải có <b>người xem lại và chịu trách nhiệm</b>.";

      /* Mọi nút bên trong khung đều bị innerHTML ở trên xoá sạch, nên phải gắn
         lại tay sau MỖI lần vẽ, không gắn một lần lúc dựng được. */
      ganNut(san, ds);
    }

    function ganNut(san, ds) {
      var o = san.querySelector('[data-mh="chay"]'), n, i;
      if (o) o.onclick = function () { chamAI = true; ve(); loi(nhac()); };
      o = san.querySelector('[data-mh="cb"]');
      if (o) o.onchange = function () { canBang = this.checked; ve(); loi(nhac()); };
      o = san.querySelector('[data-mh="kiem"]');
      if (o) o.onclick = function () { daKiem = true; ve(); loi(nhac()); };
      n = san.querySelectorAll("[data-c]");
      for (i = 0; i < n.length; i++) {
        n[i].onclick = function () { iCau = Number(this.getAttribute("data-c")); ve(); loi(nhac()); };
      }
      n = san.querySelectorAll("[data-l]");
      for (i = 0; i < n.length; i++) {
        n[i].onclick = function () { iLv = Number(this.getAttribute("data-l")); ve(); loi(nhac()); };
      }
      n = ds.querySelectorAll("[data-g]");
      for (i = 0; i < n.length; i++) {
        n[i].onclick = function () { b = 2 + Number(this.getAttribute("data-g")); ve(); loi(nhac()); };
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      /* Ở bốn bước có tình huống, lần bấm đầu tiên KHÔNG nhảy bước mà chạy chính
         tình huống đó — nhờ vậy "Tự chạy" cũng đi hết được mọi tình huống. */
      if (b === 2 && !chamAI) { chamAI = true; }
      else if (b === 3 && !daKiem) { daKiem = true; }
      else if (b === 4 && iCau < 0) { iCau = 0; }
      else if (b === 5 && iLv < 0) { iLv = 0; }
      else if (b >= 6) {
        loi("Hết bước rồi. Bấm <b>“Làm lại”</b> để đi lại từ đầu, hoặc bấm vào một giới hạn bên trái để xem lại.");
        return;
      } else b++;
      ve();
      loi(nhac());
    };

    function lamLai() {
      b = -1; chamAI = false; canBang = false; daKiem = false; iCau = -1; iLv = -1;
      ve(); loi(nhac());
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U12-02 · CHUẨN BỊ DỰ ÁN: LÊN Ý TƯỞNG VÀ CẤU TRÚC TRANG WEB
   *
   *  Giống tinh thần "nghĩ thuật toán trước khi gõ code": ở đây dòng HTML
   *  đầu tiên chỉ xuất hiện SAU chặng cuối. Mọi con số (số mục đã gom, số
   *  trang, số cấp) đều suy ra từ ba mảng dữ liệu, không gán cứng.
   * ================================================================ */
  MH.dangKy("U12-02", function (host) {
    var XEM = [
      { ai: "Học sinh muốn tham gia", can: "CLB làm gì, sinh hoạt lúc nào, đăng kí thế nào" },
      { ai: "Thầy cô", can: "CLB đạt thành tích gì, hoạt động có nề nếp không" },
      { ai: "Phụ huynh", can: "con học được gì, mất bao nhiêu thời gian, liên hệ với ai" }
    ];
    var MUC = ["Giới thiệu câu lạc bộ", "Lịch sinh hoạt", "Ảnh hoạt động", "Danh sách bài học",
      "Cách đăng kí", "Thông tin liên hệ", "Thành tích", "Câu hỏi thường gặp"];
    var NHOM = [
      { ten: "Về câu lạc bộ", tep: "gioi-thieu.html", muc: [0, 6],
        than: "CLB lập năm nào, mục đích, các thành tích nổi bật" },
      { ten: "Hoạt động", tep: "hoat-dong.html", muc: [1, 2, 3],
        than: "Lịch sinh hoạt, ảnh buổi học, danh sách bài đã dạy" },
      { ten: "Tham gia", tep: "tham-gia.html", muc: [4, 7],
        than: "Các bước đăng kí và câu hỏi thường gặp" },
      { ten: "Liên hệ", tep: "lien-he.html", muc: [5],
        than: "Phòng sinh hoạt, email CLB, thầy cô phụ trách" }
    ];
    var CHAU = [
      { ten: "Ảnh hoạt động", tep: "anh-hoat-dong.html", cha: 1 },
      { ten: "Danh sách bài học", tep: "bai-hoc.html", cha: 1 },
      { ten: "Thành tích", tep: "thanh-tich.html", cha: 0, moCoi: 1 }
    ];
    var TEN = [
      { sai: "Trang chủ.html", vi: "có dấu và có khoảng trắng", dung: "index.html" },
      { sai: "Giới thiệu.html", vi: "chữ có dấu, đường dẫn thành kí tự lạ", dung: "gioi-thieu.html" },
      { sai: "Hoat Dong.html", vi: "khoảng trắng biến thành %20 trong địa chỉ", dung: "hoat-dong.html" },
      { sai: "LienHe.HTML", vi: "nhiều máy chủ phân biệt hoa thường", dung: "lien-he.html" }
    ];
    var CHANG = ["Mục tiêu và người xem", "Liệt kê rồi gom nhóm", "Vẽ sơ đồ site", "Phác khung trang"];
    var CHU = { ten: "Trang chủ", tep: "index.html", than: "Lời chào, ba tin mới nhất, nút Đăng kí" };
    var TRANG = [CHU].concat(NHOM);
    var TONG = 16;   /* chỉ số bước cuối; -1 = chưa bắt đầu */
    var b;

    var LOI = [
      "Đề bài đây: website giới thiệu <b>câu lạc bộ Tin học</b> của trường. Câu hỏi đầu tiên " +
      "<b>không phải</b> “gõ thẻ gì” mà là <b>làm cho ai xem</b>. Ba nhóm người xem đang để mờ vì em " +
      "chưa hỏi tới họ.",
      "Hỏi xong: <b>mỗi nhóm cần một thứ khác nhau</b>. Học sinh cần biết cách vào CLB, thầy cô nhìn " +
      "thành tích, phụ huynh nhìn thời gian và người phụ trách. Ba nhu cầu này chính là nội dung của " +
      "trang sau này.",
      "Chốt mục tiêu: <b>giúp người mới hiểu CLB và biết cách đăng kí</b>. Từ giờ mỗi khi định thêm gì " +
      "vào trang, em hỏi lại “cái này phục vụ mục tiêu nào?”.",
      "Bắt đầu gom. Hai mục <b>Giới thiệu</b> và <b>Thành tích</b> đều trả lời câu “CLB này là gì” nên " +
      "về chung một nhóm. Chú ý: em đang gom theo <b>ý nghĩa</b>, chưa hề nghĩ tới tệp hay thẻ HTML.",
      "Nhóm thứ hai: <b>Lịch sinh hoạt · Ảnh hoạt động · Danh sách bài học</b> — cùng trả lời “CLB làm " +
      "gì”. Ba mục rời rạc lúc nãy giờ nằm cạnh nhau vì cùng một câu hỏi của người xem.",
      "Nhóm thứ ba: <b>Cách đăng kí</b> và <b>Câu hỏi thường gặp</b>. Người đọc mục đăng kí thường thắc " +
      "mắc ngay sau đó, để hai mục xa nhau là bắt họ đi tìm.",
      "Mục cuối cùng — <b>Thông tin liên hệ</b> — không hợp nhóm nào nên đứng riêng. Hết 8 mục, được " +
      "<b>4 nhóm</b>. Giờ mới đặt tên trang cho từng nhóm: <b>gom nhóm trước, chia trang sau</b>. Làm " +
      "ngược lại là chia bừa rồi phải gộp đi gộp lại.",
      "Sang chặng 3. Đặt <b>trang chủ</b> lên đỉnh sơ đồ — đây là chỗ người xem bước vào, phải dẫn được " +
      "tới mọi nơi khác.",
      "Bốn nhóm vừa gom trở thành <b>4 trang cấp 2</b>, treo thẳng dưới trang chủ. Nhìn sơ đồ là thấy " +
      "ngay cả website có gì, chưa cần mở tệp nào.",
      "Ba mục con nặng nội dung được tách xuống <b>cấp 3</b>. Dừng ở đây: sơ đồ <b>không nên sâu quá 3 " +
      "cấp</b>. Sâu hơn nữa thì người xem bấm bốn năm lần vẫn chưa tới nơi cần tới và bỏ đi.",
      "Soát lại đường đi tới từng trang thì lòi ra lỗi: <b>thanh-tich.html</b> nằm trong sơ đồ nhưng " +
      "<b>không menu nào trỏ tới nó</b>. Tệp vẫn nằm trên máy chủ, mở đúng địa chỉ vẫn ra — nhưng không " +
      "ai gõ địa chỉ đó cả.",
      "Thêm liên kết “Thành tích” vào menu của <b>gioi-thieu.html</b>. Nhớ lấy: <b>mọi trang phải với " +
      "tới được từ menu</b>, trang không có liên kết nào trỏ tới thì coi như không tồn tại.",
      "Chặng 4 — phác khung. Mỗi trang chia bốn khối: <b>đầu trang (header) — thanh điều hướng (nav) — " +
      "thân (main) — chân trang (footer)</b>. Khối <b>main</b> đang được tô đậm vì nó là phần đổi theo " +
      "từng trang.",
      "Đổi ô chọn phía trên sang trang khác mà xem: header, nav, footer <b>y hệt nhau</b>, chỉ mỗi main " +
      "thay nội dung. <b>Mọi trang dùng chung một khung</b> thì người xem không bị lạc, và em cũng đỡ " +
      "phải nghĩ lại bố cục từ đầu ở mỗi trang.",
      "Nghĩ xong hết rồi, <b>tới lúc này mới đặt tên tệp</b>. Mỗi trang trong sơ đồ thành một tệp " +
      "<code>.html</code>. Trang chủ bắt buộc tên <b>index.html</b> — máy chủ tự mở đúng tệp này khi có " +
      "người gõ tên miền, đặt tên khác thì họ vào chỉ thấy trang trắng hoặc danh sách thư mục.",
      "Quy tắc đặt tên, xem bảng: <b>chữ thường, không dấu, không khoảng trắng, ngăn từ bằng gạch " +
      "nối</b>. Bốn cái tên cột trái mở trên máy em thì vẫn được, nhưng đưa lên máy chủ là hỏng đường dẫn.",
      "Xong bốn chặng. Nhìn lại: em có mục tiêu, 4 nhóm nội dung, sơ đồ 8 trang sâu 3 cấp, một khung " +
      "dùng chung và một danh sách tên tệp — <b>mà vẫn chưa gõ dòng HTML nào</b>. Giờ ngồi gõ thì gõ " +
      "tới đâu chắc tới đó."
    ];
    var NHAC = "Đã đi hết bốn chặng chuẩn bị. Đổi ô chọn để xem lại khung của từng trang, hoặc bấm " +
      "“Làm lại” để chạy lại từ đề bài.";
    var CANH = {};
    CANH[9] = "<b>Không nên sâu quá 3 cấp.</b> Mỗi cấp là thêm một lần bấm chuột. Website của trường " +
      "hay CLB mà bắt người ta bấm tới bốn năm lần mới thấy thông tin thì họ đóng tab trước khi tới nơi.";
    CANH[10] = "<b>Trang không có liên kết nào trỏ tới thì không ai tìm ra</b> — dù tệp vẫn nằm nguyên " +
      "trên máy chủ. Không có công cụ nào báo lỗi việc này cho em: trang vẫn “đúng”, chỉ là vô hình.";
    CANH[15] = "<b>Tên tệp có dấu hoặc khoảng trắng gây lỗi đường dẫn</b> khi đưa lên máy chủ. Tệ hơn: " +
      "trên máy Windows của em <code>LienHe.html</code> và <code>lienhe.html</code> là một, nhưng phần " +
      "lớn máy chủ <b>phân biệt hoa thường</b> — chạy ở nhà ngon lành, lên mạng là lỗi 404 hàng loạt.";

    var node = MH.el(MH.khung("Chuẩn bị dự án: nghĩ xong cấu trúc rồi mới gõ HTML",
      "Giống như phải nghĩ ra thuật toán trước khi gõ code, dựng website cũng phải <b>nghĩ xong cấu " +
      "trúc rồi mới mở trình soạn thảo</b>. Bấm “Bước tiếp” để đi hết bốn chặng chuẩn bị cho website " +
      "câu lạc bộ Tin học — dòng HTML đầu tiên chỉ xuất hiện sau chặng cuối.",
      '<div data-mh="chang"></div><div data-mh="than"></div><p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick">Xem khung của trang: <select data-mh="trang">' +
      TRANG.map(function (t, i) {
        return '<option value="' + i + '">' + esc(t.ten) + "</option>";
      }).join("") + "</select></label>"));

    var loi = loiCua(node);
    var oChang = node.querySelector('[data-mh="chang"]'), oThan = node.querySelector('[data-mh="than"]');
    var oDem = node.querySelector('[data-mh="dem"]'), oCanh = node.querySelector('[data-mh="canh"]');
    var oGhi = node.querySelector('[data-mh="ghi"]'), oTrang = node.querySelector('[data-mh="trang"]');

    function pha(i) { return i < 0 ? 1 : (i < 3 ? 1 : (i < 7 ? 2 : (i < 12 ? 3 : 4))); }
    function soNhom() { return Math.max(0, Math.min(NHOM.length, b - 2)); }
    function soMuc() {
      var d = 0, k;
      for (k = 0; k < soNhom(); k++) d += NHOM[k].muc.length;   /* đếm thật, không gán cứng */
      return d;
    }
    function hop(tt, ten, phu, st) {
      return '<div class="mh9-tb' + (tt ? " " + tt : "") + '"' + (st ? ' style="' + st + '"' : "") +
        "><b>" + esc(ten) + "</b><small>" + esc(phu) + "</small></div>";
    }

    function veChang() {
      var p = pha(b), h = b < 0 ? 0 : 1;
      return '<div class="mh9-so" style="margin-bottom:11px">' + CHANG.map(function (t, i) {
        return hop(h && p > i + 1 ? "xong" : (h && p === i + 1 ? "nay" : "cho"), "Chặng " + (i + 1), t);
      }).join("") + "</div>";
    }

    function ve1() {
      var ro = b >= 1;
      return '<div class="mh9-so">' + XEM.map(function (x) {
        return hop(ro ? "xong" : "cho", x.ai, ro ? x.can : "chưa hỏi tới");
      }).join("") + "</div>";
    }

    function ve2() {
      var n = soNhom(), gom = {}, k, j;
      for (k = 0; k < n; k++) for (j = 0; j < NHOM[k].muc.length; j++) gom[NHOM[k].muc[j]] = k + 1;
      var trai = MUC.map(function (m, i) {
        var g = gom[i];
        return '<div class="mh7-m' + (g === n ? " nay" : (g ? " thua" : "")) + '"><b class="van">' +
          esc(m) + "</b><small>" + (g ? "đã gom vào nhóm " + g : "chưa gom") + "</small></div>";
      }).join("");
      var phai = n === 0 ? '<p class="mh7-trong">Chưa gom nhóm nào — mới chỉ là một đống mục rời.</p>'
        : NHOM.slice(0, n).map(function (g, i) {
          return '<div class="mh7-m' + (i === n - 1 ? " nay" : "") + '"><b class="van">' +
            esc("Nhóm " + (i + 1) + ": " + g.ten) + "</b><small>" +
            esc(g.muc.map(function (u) { return MUC[u]; }).join(" · ")) + "</small></div>";
        }).join("");
      return '<div class="mh7-doi"><div class="mh7-panel">' +
        '<p class="mh7-nhan">Nội dung nghĩ ra, còn rời rạc</p><div class="mh7-ds">' + trai +
        '</div></div><div class="mh7-panel"><p class="mh7-nhan">Gom nhóm theo ý nghĩa</p>' +
        '<div class="mh7-ds">' + phai + "</div></div></div>";
    }

    function ve3() {
      var h = '<div class="mh9-so">' + hop("xong", "Trang chủ", "index.html · cấp 1") + "</div>";
      if (b >= 8) {
        h += '<div class="mh9-noi"></div><div class="mh9-so">' + NHOM.map(function (g) {
          return hop("xong", g.ten, g.tep);
        }).join("") + "</div>";
      }
      if (b >= 9) {
        h += '<div class="mh9-noi"></div><div class="mh9-so">' + CHAU.map(function (c) {
          if (!c.moCoi) return hop("xong", c.ten, c.tep + " · dưới " + NHOM[c.cha].ten);
          if (b < 10) return hop("cho", c.ten, c.tep + " · vừa đặt vào sơ đồ");
          if (b === 10) return hop("hong", c.ten, c.tep + " · KHÔNG menu nào trỏ tới");
          return hop("xong", c.ten, c.tep + " · đã thêm vào menu " + NHOM[c.cha].tep);
        }).join("") + "</div>";
      }
      return h;
    }

    function khoi(ten, phu, chung, tt) {
      return '<div class="mh9-so" style="margin:5px 0">' +
        hop(tt, ten, phu + (chung ? " — giữ nguyên ở mọi trang" : ""), "flex:1;text-align:left") +
        "</div>";
    }

    function veCay() {
      var d = [{ t: "clb-tin-hoc/", c: "thư mục gốc của cả website" },
        { t: "  index.html", c: "trang chủ — BẮT BUỘC tên này", nay: 1 }];
      NHOM.forEach(function (g) { d.push({ t: "  " + g.tep, c: g.ten }); });
      CHAU.forEach(function (c) { d.push({ t: "  " + c.tep, c: c.ten + " (trang cháu)" }); });
      d.push({ t: "  anh/", c: "thư mục chứa ảnh hoạt động" });
      return '<p class="mh7-nhan" style="margin-top:11px">Tên tệp — đặt sau cùng</p>' +
        '<div class="mh7-code">' + d.map(function (x) {
          var t = x.t;
          while (t.length < 22) t += " ";   /* white-space:pre nên thụt lề bằng dấu cách được */
          return '<div class="mh7-d' + (x.nay ? " nay" : "") + '">' + esc(t + "  " + x.c) + "</div>";
        }).join("") + "</div>";
    }

    function veBang() {
      return '<div class="mh4-cuon" style="margin-top:11px"><table class="mh4-b"><tr>' +
        "<th>Đặt sai</th><th>Hỏng ở chỗ nào</th><th>Đặt đúng</th></tr>" + TEN.map(function (x) {
          return '<tr class="rac"><td class="mh8-lech">' + esc(x.sai) + "</td><td>" + esc(x.vi) +
            '</td><td class="mh8-khoa">' + esc(x.dung) + "</td></tr>";
        }).join("") + "</table></div>";
    }

    function ve4() {
      var t = TRANG[Number(oTrang.value)] || CHU, chung = b >= 13;
      var menu = "Trang chủ · " + NHOM.map(function (g) { return g.ten; }).join(" · ");
      var h = '<div class="mh7-xem"><div class="mh7-tab"><i></i>' + esc(t.tep) +
        '</div><div class="mh7-noi">' +
        khoi("ĐẦU TRANG (header)", "Tên câu lạc bộ, khẩu hiệu, ảnh nền", chung, "xong") +
        khoi("THANH ĐIỀU HƯỚNG (nav)", menu, chung, "xong") +
        khoi("THÂN TRANG (main)", t.than, 0, "nay") +
        khoi("CHÂN TRANG (footer)", "Địa chỉ trường, email CLB, năm học", chung, "xong") +
        "</div></div>";
      if (b >= 14) h += veCay();
      if (b >= 15) h += veBang();
      return h;
    }

    function veDem() {
      var p = pha(b);
      if (b < 0) return "Chưa bắt đầu — và <b>chưa gõ dòng HTML nào</b>";
      if (p === 1) return "Chặng <b>1</b>/" + CHANG.length + " — vẫn chưa gõ dòng HTML nào";
      if (p === 2) return "Đã gom <b>" + soMuc() + "</b>/" + MUC.length + " mục · <b>" + soNhom() +
        "</b> nhóm";
      if (p === 3) return "Sơ đồ có <b>" + (1 + NHOM.length + (b >= 9 ? CHAU.length : 0)) +
        "</b> trang · sâu <b>" + (b >= 9 ? 3 : 2) + "</b> cấp";
      return "<b>1</b> khung dùng chung cho <b>" + (1 + NHOM.length + CHAU.length) + "</b> trang";
    }

    function veGhi() {
      if (b === 2) return "<b>Mục tiêu quyết định nội dung</b>, không phải thích gì làm nấy. Ảnh đẹp, " +
        "nhạc nền, hiệu ứng chữ chạy — không phục vụ mục tiêu thì bỏ.";
      if (b === 13) return "Một khung dùng cho mọi trang: em chỉ phải nghĩ bố cục <b>một lần</b>, và " +
        "người xem đi tới đâu cũng thấy menu nằm đúng chỗ cũ.";
      if (b >= TONG) return "<b>Nghĩ cấu trúc trước, gõ HTML sau.</b> Gõ trước rồi chắp vá thì website " +
        "rối, trang nọ lạc trang kia, sửa được chỗ này hỏng chỗ khác — cuối cùng phải làm lại từ đầu. " +
        "Bốn thứ dễ sai nhất: trang chủ <b>phải</b> là <code>index.html</code>; tên tệp <b>chữ thường, " +
        "không dấu, không khoảng trắng, dùng gạch nối</b>; sơ đồ <b>không sâu quá 3 cấp</b>; và " +
        "<b>trang nào cũng phải với tới được từ menu</b>.";
      return "";
    }

    function ve() {
      var p = pha(b);
      oChang.innerHTML = veChang();
      oThan.innerHTML = p === 1 ? ve1() : (p === 2 ? ve2() : (p === 3 ? ve3() : ve4()));
      oDem.innerHTML = veDem();
      oTrang.disabled = p !== 4;   /* ô chọn chỉ có nghĩa ở chặng phác khung */
      var c = b >= 0 && CANH[b] ? CANH[b] : "";
      oCanh.hidden = !c; oCanh.innerHTML = c;
      var g = veGhi();
      oGhi.hidden = !g;
      oGhi.className = "mh7-ghi" + (b >= TONG ? " xong" : "");
      oGhi.innerHTML = g;
    }

    function noiBuoc() {
      if (b < 0) {
        loi("Nhóm em nhận đề: làm website giới thiệu <b>câu lạc bộ Tin học</b> của trường. Đừng mở trình " +
          "soạn thảo vội — bấm “Bước tiếp” để đi qua bốn chặng chuẩn bị.");
        return;
      }
      loi(LOI[b]);
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= TONG) { loi(NHAC); return; }   /* hết bước thì chỉ nhắc, không được lỗi */
      b++; ve(); noiBuoc();
    };
    /* Đổi trang xem khung chỉ vẽ lại, KHÔNG qua ganDatLai — không được xoá tiến độ. */
    oTrang.onchange = ve;

    function lamLai() { b = -1; oTrang.value = "0"; ve(); noiBuoc(); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });
})();
