/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 12: MẠNG, ĐÁM MÂY, CSDL ỨNG DỤNG, KIỂM THỬ
 *
 *  Đợt thứ hai liên tiếp không phải viết CSS. Toàn bộ dùng lại bộ class chung
 *  đã gom từ đợt 7 tới đợt 10 — nạp sau minh-hoa-11.js nên có đủ.
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
   *  C10-05 · INTERNET VÀ WORLD WIDE WEB
   *
   *  NGỘ NHẬN SỐ MỘT CỦA BÀI: học sinh dùng "Internet" và "Web" như hai tên của
   *  cùng một thứ. Chữ nghĩa không chữa được, phải cho thấy bằng hành vi: PHẦN 1
   *  tắt Web mà email/gọi video vẫn chạy, rồi tắt Internet thì chết cả loạt —
   *  đó mới là bằng chứng "Web nằm TRÊN Internet".
   *  PHẦN 2 đi hết một lần bấm địa chỉ (mổ URL, DNS, HTTP, HTML, trình duyệt vẽ)
   *  để chốt nốt hai ngộ nhận con: trình duyệt không phải Internet, và máy chủ
   *  chỉ trả về MÃ chứ không trả về trang đã vẽ sẵn.
   * ================================================================ */
  MH.dangKy("C10-05", function (host) {
    var DV = [
      { ten: "Web (WWW)", gt: "HTTP / HTTPS" },
      { ten: "Thư điện tử", gt: "SMTP, IMAP" },
      { ten: "Gọi video", gt: "WebRTC, RTP" },
      { ten: "Truyền tệp", gt: "FTP" },
      { ten: "Trò chơi", gt: "TCP / UDP riêng" },
    ];

    /* Căn cột bằng dấu cách vì .mh7-d để white-space:pre — mổ URL mà các mũi
       tên so le nhau thì mắt không gom được ba thành phần. */
    var URL_D = [
      "https://vi.wikipedia.org/wiki/Tin_hoc",
      "",
      "https             -> giao thức: cách nói chuyện (s = được mã hoá)",
      "vi.wikipedia.org  -> tên miền: địa chỉ máy chủ chứa trang",
      "/wiki/Tin_hoc     -> đường dẫn: trang cụ thể trên máy chủ đó",
    ];
    var HTML_D = [
      "<h1>Tin học</h1>",
      "<p>Tin học là ngành khoa học về",
      "   xử lí thông tin tự động.</p>",
      '<a href="/wiki/May_tinh">Máy tính</a>',
    ];
    var OUT = [
      [{ t: "máy của em hỏi DNS: vi.wikipedia.org ở địa chỉ IP nào?" },
        { t: "DNS trả lời: 198.35.26.96" }],
      [{ t: "GET /wiki/Tin_hoc HTTP/1.1" },
        { t: "Host: vi.wikipedia.org" },
        { t: "(gửi tới 198.35.26.96, nội dung đã mã hoá vì là https)", m: 1 }],
      [{ t: "HTTP/1.1 200 OK" },
        { t: "Content-Type: text/html; charset=utf-8" },
        { t: "(kèm theo là MÃ HTML, chưa phải trang đã vẽ)", m: 1 }],
    ];

    var B = [
      { p: 1, dv: -1, net: "nay", dem: "hạ tầng: <b>Internet</b> · dịch vụ đang xét: <b>chưa</b>",
        g: "Nhìn cho đúng tầng trước đã. <b>Internet</b> là mạng lưới máy tính toàn cầu: dây cáp, thiết " +
          "bị mạng và bộ giao thức TCP/IP. Năm ô phía trên đều là <b>dịch vụ</b> chạy nhờ hạ tầng đó — " +
          "chưa ô nào là Internet cả." },
      { p: 1, dv: 0, dem: "đang xét: <b>Web (WWW)</b> · giao thức <b>HTTP/HTTPS</b>",
        g: "<b>Web</b> là kho trang web nối nhau bằng siêu liên kết, nói chuyện bằng <b>HTTP/HTTPS</b>. " +
          "Web chỉ là MỘT ô trong hàng, không phải cả hàng." },
      { p: 1, dv: 1, dem: "đang xét: <b>Thư điện tử</b> · giao thức <b>SMTP, IMAP</b>",
        g: "Thư đi bằng <b>SMTP</b> (gửi) và <b>IMAP/POP3</b> (nhận) — không có chữ HTTP nào, nghĩa là " +
          "thư <b>không đi qua Web</b>. Em mở hộp thư bằng trình duyệt là chuyện khác: người ta dựng " +
          "thêm một giao diện Web cho hộp thư thôi." },
      { p: 1, dv: 2, dem: "đang xét: <b>Gọi video</b> · giao thức <b>WebRTC, RTP</b>",
        g: "Tiếng và hình chạy thẳng giữa hai máy bằng <b>RTP/WebRTC</b>, ưu tiên nhanh hơn chính xác " +
          "nên chấp nhận rơi vài gói. Cũng không dính gì tới Web." },
      { p: 1, dv: 3, dem: "đang xét: <b>Truyền tệp</b> · giao thức <b>FTP</b>",
        g: "<b>FTP</b> chép tệp giữa máy em và máy chủ. Có từ trước khi Web ra đời, và vẫn sống độc lập." },
      { p: 1, dv: 4, dem: "đang xét: <b>Trò chơi trực tuyến</b> · <b>TCP / UDP riêng</b>",
        g: "Trò chơi bắn gói tin nhỏ và liên tục, phần lớn đi <b>UDP</b> cho nhanh, theo giao thức riêng " +
          "của từng hãng." },
      { p: 1, tt: ["hong", "xong", "xong", "xong", "xong"], net: "xong",
        dem: "Web: <b>sập</b> · bốn dịch vụ còn lại: <b>vẫn chạy</b>",
        canh: "Tắt sạch Web đi: thư điện tử, gọi video, truyền tệp, trò chơi <b>vẫn chạy bình thường</b> " +
          "— vì chúng không đi qua Web, chúng đi thẳng trên Internet.",
        g: "Đây là chỗ đề hay hỏi. Web hỏng mà mạng vẫn còn, nên <b>Web không thể là Internet</b>." },
      { p: 1, tt: ["hong", "hong", "hong", "hong", "hong"], net: "hong",
        dem: "Internet: <b>mất</b> · tất cả dịch vụ: <b>chết</b>",
        ghi: "Chốt: <b>Internet là mạng lưới máy tính toàn cầu (phần cứng + giao thức); WWW chỉ là một " +
          "dịch vụ chạy trên Internet.</b> Không có Web thì Internet vẫn còn; không có Internet thì Web " +
          "không tồn tại.",
        g: "Ngược lại, rút hạ tầng đi thì cả năm cùng chết. Quan hệ một chiều: dịch vụ dựa vào hạ tầng, " +
          "không có chiều ngược lại." },
      { p: 2, c: "url", n: -1, dem: "em vừa bấm một địa chỉ · <b>chưa gửi gì đi</b>",
        g: "Sang phần hai. Em bấm địa chỉ này, và trước khi máy làm gì thì <b>trình duyệt</b> — một phần " +
          "mềm để xem Web, <b>không phải Internet</b> — phải đọc hiểu địa chỉ đã." },
      { p: 2, c: "url", n: 2, dem: "thành phần 1/3: <b>giao thức</b>",
        canh: "<b>http</b> gửi trần, ai chặn giữa đường cũng đọc được. <b>https</b> có mã hoá. Nhập mật " +
          "khẩu ở trang chỉ có <b>http</b> là coi như đưa mật khẩu cho người khác.",
        g: "<b>https</b> là cách hai bên nói chuyện. Chữ <b>s</b> nghĩa là nội dung <b>được mã hoá</b>." },
      { p: 2, c: "url", n: 3, dem: "thành phần 2/3: <b>tên miền</b>",
        g: "<b>vi.wikipedia.org</b> là <b>tên miền</b> — tên gợi nhớ của máy chủ. Máy tính không hiểu tên " +
          "này, lát nữa phải nhờ DNS đổi ra số." },
      { p: 2, c: "url", n: 4, dem: "thành phần 3/3: <b>đường dẫn</b>",
        g: "<b>/wiki/Tin_hoc</b> là <b>đường dẫn</b>: trong máy chủ đó, lấy đúng trang nào. Đủ ba phần thì " +
          "địa chỉ mới xác định duy nhất một trang." },
      { p: 2, c: "url", n: -1, o: 1, dem: "chặng 1: <b>hỏi DNS</b>",
        g: "Chặng 1: máy hỏi <b>DNS</b> để đổi tên miền ra <b>địa chỉ IP</b>. Không có bước này thì máy " +
          "không biết gửi yêu cầu đi đâu." },
      { p: 2, c: "url", n: -1, o: 2, dem: "chặng 2: <b>gửi yêu cầu HTTP</b>",
        g: "Chặng 2: gửi <b>yêu cầu HTTP</b> tới IP vừa tra được, kèm đường dẫn và tên miền. Vì là https " +
          "nên gói tin này đã được mã hoá." },
      { p: 2, c: "html", n: -1, o: 3, dem: "chặng 3: <b>máy chủ trả về mã HTML</b>",
        g: "Chặng 3: máy chủ trả <b>200 OK</b> cùng một mớ <b>mã HTML</b> — đúng những dòng bên trái. Lúc " +
          "này bên phải vẫn trống: em thấy rõ máy chủ <b>không</b> gửi về trang đã vẽ sẵn." },
      { p: 2, c: "html", n: -1, o: 3, x: 1, dem: "chặng 4: <b>trình duyệt vẽ ra trang</b>",
        ghi: "Bốn chặng cố định: <b>DNS đổi tên miền ra IP → gửi yêu cầu HTTP → máy chủ trả mã HTML → " +
          "trình duyệt vẽ ra trang</b>. Nhớ thêm: trình duyệt là phần mềm xem Web chứ không phải " +
          "Internet, và thứ đi trên đường là <b>mã</b>, còn <b>trang</b> là do trình duyệt dựng lên.",
        g: "Chặng 4: <b>trình duyệt</b> đọc mã HTML rồi vẽ thành trang bên phải — cùng một mã, mở bằng " +
          "trình duyệt khác vẫn ra trang đó." },
    ];

    var buoc;
    var node = MH.el(MH.khung("Internet không phải là Web",
      "Hai phần: <b>(1)</b> Web chỉ là một trong nhiều dịch vụ chạy trên Internet — thử tắt từng thứ để " +
      "thấy cái nào phụ thuộc cái nào; <b>(2)</b> bấm một địa chỉ thì thật ra chuyện gì xảy ra. Bấm " +
      "<b>“Bước tiếp”</b> để đi từng chặng.",
      '<div data-mh="p1">' +
      '<div class="mh9-so" data-mh="dv"></div>' +
      '<div class="mh9-noi"></div>' +
      '<div class="mh9-so" data-mh="net"></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> đang chạy</span>' +
      '<span><i class="hong"></i> đã hỏng</span>' +
      '<span><i class="cho"></i> chưa xét</span></div>' +
      "</div>" +
      '<div data-mh="p2" hidden><div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="nhan"></p>' +
      '<div class="mh7-code" data-mh="code"></div>' +
      '<div class="mh10-out" data-mh="out" style="margin-top:10px"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trình duyệt vẽ ra</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Tin học</div>' +
      '<div class="mh7-noi" data-mh="xem"></div></div></div>' +
      "</div></div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));
    var loi = loiCua(node);

    function hop(ten, gt, lop) {
      return '<div class="mh9-tb ' + lop + '"><b>' + esc(ten) + "</b><small>" + esc(gt) + "</small></div>";
    }

    function veP1(d) {
      var h = "", i, lop;
      for (i = 0; i < DV.length; i++) {
        if (d.tt) lop = d.tt[i];
        else lop = i < d.dv ? "xong" : (i === d.dv ? "nay" : "cho");
        h += hop(DV[i].ten, DV[i].gt, lop);
      }
      node.querySelector('[data-mh="dv"]').innerHTML = h;
      node.querySelector('[data-mh="net"]').innerHTML =
        hop("INTERNET", "hạ tầng toàn cầu: cáp, thiết bị mạng, bộ giao thức TCP/IP", d.net || "xong");
    }

    function veP2(d) {
      var ds = d.c === "html" ? HTML_D : URL_D, h = "", i;
      node.querySelector('[data-mh="nhan"]').textContent =
        d.c === "html" ? "Máy chủ trả về (mã HTML)" : "Địa chỉ em vừa bấm";
      for (i = 0; i < ds.length; i++) {
        h += '<div class="mh7-d' + (i === d.n ? " nay" : (d.n >= 0 && i > 0 ? " mo" : "")) + '">' +
          esc(ds[i] || " ") + "</div>";
      }
      node.querySelector('[data-mh="code"]').innerHTML = h;

      var o = "", j, k, g;
      for (j = 0; j < (d.o || 0); j++) {
        g = OUT[j];
        for (k = 0; k < g.length; k++) {
          o += "<div" + (g[k].m ? ' class="trong"' : "") + ">" + esc(g[k].t) + "</div>";
        }
      }
      node.querySelector('[data-mh="out"]').innerHTML =
        o || '<div class="trong">chưa gửi gói tin nào</div>';

      var xem = node.querySelector('[data-mh="xem"]');
      xem.innerHTML = d.x
        ? "<h1>Tin học</h1><p>Tin học là ngành khoa học về xử lí thông tin tự động.</p>" +
          '<p><a href="#" data-mh="lk">Máy tính</a></p>'
        : '<p class="mh7-trong">chưa vẽ được gì — mã HTML mới về tới, hoặc còn chưa về</p>';
      /* innerHTML vừa ghi đè nên phải gắn lại onclick mỗi lần vẽ. Chặn điều
         hướng vì đây là trang giả, bấm thật là văng khỏi bài học. */
      var lk = xem.querySelector('[data-mh="lk"]');
      if (lk) {
        lk.onclick = function (e) {
          e.preventDefault();
          loi("Đó là <b>siêu liên kết</b>: bấm vào là trình duyệt lặp lại đúng bốn chặng trên cho một " +
            "địa chỉ khác. Ở đây chặn lại để em không rời bài.");
        };
      }
    }

    function ve() {
      var d = B[buoc];
      node.querySelector('[data-mh="p1"]').hidden = d.p !== 1;
      node.querySelector('[data-mh="p2"]').hidden = d.p !== 2;
      if (d.p === 1) veP1(d); else veP2(d);
      node.querySelector('[data-mh="dem"]').innerHTML = d.dem;

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !d.canh;
      if (d.canh) canh.innerHTML = d.canh;

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !d.ghi;
      ghi.className = "mh7-ghi xong";
      if (d.ghi) ghi.innerHTML = d.ghi;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= B.length - 1) {
        loi("Hết bước rồi. Bấm “Làm lại” để xem lại từ đầu.");
        return;
      }
      buoc++; ve(); loi(B[buoc].g);
    };

    function lamLai() { buoc = 0; ve(); loi(B[0].g); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-04 · MẠNG MÁY TÍNH — GÓI TIN ĐI ĐƯỜNG NÀO, VÀ PHÂN LOẠI MẠNG
   *
   *  Bài này KHÔNG lặp lại hai minh hoạ đã có (thiết kế LAN, phân giải DNS).
   *  Nó trị đúng ngộ nhận gốc: học sinh tưởng gửi tệp là "đẩy nguyên cục dữ
   *  liệu" chạy thẳng một mạch tới đích. Cách trị duy nhất hiệu quả là cho các
   *  em NHÌN THẤY gói tới lộn xộn và một gói mất — rồi thấy máy nhận vẫn ghép
   *  lại đúng nhờ số thứ tự.
   *
   *  Kịch bản viết cứng trong mảng KICH, không có số ngẫu nhiên: minh hoạ mà
   *  mỗi lần chạy một khác thì học sinh tưởng máy đoán bừa.
   * ================================================================ */
  MH.dangKy("C10-04", function (host) {
    var TONG = 5;                    // ảnh 5 MB, cắt thành 5 gói mỗi gói ~1 MB

    var PHAN = [
      { b: "Theo phạm vi — LAN (mạng cục bộ)",
        s: "Một phòng máy, một toà nhà, một trường học. LAN nói về PHẠM VI, không nói về cách nối: một " +
          "LAN có thể vừa có máy cắm dây, vừa có máy bắt wifi." },
      { b: "Theo phạm vi — WAN (mạng diện rộng)",
        s: "Nối nhiều vùng, nhiều quốc gia bằng cáp quang, cáp biển, vệ tinh. Internet là WAN lớn nhất: " +
          "nó nối vô số LAN lại với nhau." },
      { b: "Theo vai trò — khách chủ (client - server)",
        s: "Mọi máy khách đều hỏi chung một máy chủ: web, thư điện tử, phần mềm quản lí của trường. Quản " +
          "lí tập trung dễ, nhưng máy chủ hỏng là cả mạng tê liệt." },
      { b: "Theo vai trò — ngang hàng (peer-to-peer)",
        s: "Các máy trực tiếp trao đổi với nhau, máy nào cũng vừa xin vừa cho. Không có điểm chết như " +
          "máy chủ, đổi lại khó quản lí và khó bảo mật." },
    ];

    /* k = loại việc xảy ra trong bước; ket = số phận của gói vừa gửi. */
    var KICH = [
      { k: "gui", so: 1, duong: "Đ1", ket: "toi",
        loi: "Ảnh 5 MB <b>không đi thành một khối</b>. Máy A cắt nó thành <b>5 gói</b>, mỗi gói khoảng " +
          "1 MB, mỗi gói mang theo <b>số thứ tự</b> và <b>địa chỉ máy B</b>. Gói 1 đi đường Đ1, tới nơi ngay." },
      { k: "gui", so: 2, duong: "Đ2", ket: "treo",
        loi: "Gói 2 bị đẩy sang <b>đường Đ2</b> vì lúc này Đ1 đang đông. Các gói <b>không bắt buộc đi " +
          "cùng một đường</b>. Đ2 đang tắc nên gói 2 còn lang thang giữa đường — máy A <b>không ngồi chờ " +
          "nó</b>, cứ gửi gói tiếp theo." },
      { k: "gui", so: 3, duong: "Đ1", ket: "toi",
        loi: "Gói 3 đi Đ1 thoáng hơn nên <b>tới trước gói 2</b>. Nhìn hàng dưới: máy B đang giữ gói 1 rồi " +
          "tới gói 3 — <b>sai thứ tự</b>. Đây là chuyện bình thường của mạng, không phải lỗi." },
      { k: "gui", so: 4, duong: "Đ2", ket: "mat",
        loi: "Gói 4 đi Đ2 và <b>thất lạc</b> giữa đường. Máy B không hề biết gói 4 chứa gì, nó chỉ thấy " +
          "các số mình nhận được <b>nhảy cóc</b>, nên biết là đang thiếu." },
      { k: "gui", so: 5, duong: "Đ1", ket: "toi",
        loi: "Gói 5 vẫn được gửi bình thường. Mất một gói <b>không làm dừng</b> những gói còn lại." },
      { k: "toi", so: 2,
        loi: "Gói 2 đi đường vòng, bây giờ mới tới — nó <b>chậm chứ không mất</b>. Máy B cứ nhận đã, chưa " +
          "vội xếp lại." },
      { k: "lai", so: 4,
        loi: "Máy B báo về: <b>thiếu gói 4</b>. Máy A gửi lại <b>đúng một gói 4</b> — <b>không phải gửi " +
          "lại cả tấm ảnh 5 MB</b>. Đó chính là cái lợi lớn nhất của việc chia nhỏ dữ liệu." },
      { k: "xep",
        loi: "Đủ 5 gói. Máy B <b>xếp lại theo số thứ tự</b> 1-2-3-4-5 rồi ghép thành tấm ảnh <b>nguyên " +
          "vẹn</b>, giống hệt bản gốc. Thứ tự <b>tới</b> không quan trọng; <b>số thứ tự ghi trong gói</b> " +
          "mới quan trọng." },
      { k: "p2", i: 0,
        loi: "Sang phần hai: người ta phân loại mạng ra sao. Theo <b>phạm vi</b> trước. Nhớ kĩ: <b>LAN " +
          "không phải là wifi</b>. LAN nói về <b>phạm vi</b>, wifi nói về <b>cách truyền</b> (không dây). " +
          "Phòng máy nối toàn dây vẫn là một LAN." },
      { k: "p2", i: 1,
        loi: "Mở rộng ra là <b>WAN</b>. Tấm ảnh vừa rồi nếu gửi sang tỉnh khác thì các gói đã đi qua WAN, " +
          "và mỗi gói vẫn có thể đi một đường riêng." },
      { k: "p2", i: 2,
        loi: "Theo <b>vai trò</b> của các máy. Kiểu <b>khách - chủ</b>: mọi máy đều hỏi một máy chủ chung. " +
          "Điểm yếu lộ ngay — <b>máy chủ hỏng thì cả mạng tê liệt</b>." },
      { k: "p2", i: 3,
        loi: "Kiểu <b>ngang hàng</b>: các máy nói chuyện thẳng với nhau, không cần máy chủ, nên <b>không " +
          "có điểm chết</b> như trên. Bù lại <b>khó quản lí</b> và khó giữ an toàn dữ liệu." },
    ];

    var node = MH.el(MH.khung("Gửi một tấm ảnh 5 MB từ máy A sang máy B",
      "Dữ liệu trên mạng <b>không đi thành một khối</b>. Bấm “Bước tiếp” để đi theo từng gói: gói nào tới " +
      "trước, gói nào lạc đường, và máy nhận ghép lại bằng cách nào.",
      '<div data-mh="p1">' +
      '<p class="mh7-nhan">Máy A — bên gửi (ảnh 5 MB cắt thành 5 gói)</p>' +
      '<div class="mh9-so" data-mh="gui"></div>' +
      '<div class="mh9-noi"></div>' +
      '<p class="mh7-nhan">Máy B — bên nhận (xếp theo thứ tự TỚI, chưa sắp lại)</p>' +
      '<div class="mh9-so" data-mh="nhan"></div>' +
      '<div class="mh9-chu"><span><i class="cho"></i> chưa gửi</span>' +
      '<span><i class="n1"></i> đang trên đường</span>' +
      '<span><i class="xong"></i> đã tới đích</span>' +
      '<span><i class="hong"></i> thất lạc</span></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh10-out" data-mh="out"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      "</div>" +
      '<div data-mh="p2" hidden><div class="mh7-ds" data-mh="ds"></div></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);
    var GHI1 = "Chốt phần gói tin: <b>(1)</b> dữ liệu <b>không đi nguyên khối</b> mà bị chia thành gói, " +
      "mỗi gói mang <b>số thứ tự</b> và <b>địa chỉ đích</b>. <b>(2)</b> Các gói có thể đi <b>đường khác " +
      "nhau</b> và <b>tới không đúng thứ tự</b> — máy nhận xếp lại được là nhờ số thứ tự. <b>(3)</b> Gói " +
      "nào mất thì chỉ <b>gửi lại gói đó</b>, không gửi lại cả tệp.";
    var GHI2 = GHI1 + "<br><br>Chốt phần phân loại: <b>LAN/WAN</b> nói về <b>phạm vi</b> — <b>LAN không " +
      "phải là wifi</b>, vì wifi chỉ là <b>cách truyền</b>, một LAN có thể vừa có dây vừa có wifi. " +
      "<b>Khách - chủ / ngang hàng</b> nói về <b>vai trò</b>: khách - chủ dễ quản lí nhưng máy chủ hỏng " +
      "là tê liệt; ngang hàng không có điểm chết đó nhưng khó quản lí.";

    var tt, daNhan, nk, canh, daXep, p2i, buoc;

    function themNk(t, c) { nk.push({ t: t, c: c || "" }); }

    function chay(b) {
      if (b.k === "gui") {
        if (b.ket === "toi") {
          tt[b.so] = "xong"; daNhan.push(b.so);
          themNk("gửi gói " + esc(b.so) + " qua " + esc(b.duong) + " -> tới máy B");
        } else if (b.ket === "treo") {
          tt[b.so] = "nay";
          themNk("gửi gói " + esc(b.so) + " qua " + esc(b.duong) + " -> đường tắc, chưa tới", "trong");
        } else {
          tt[b.so] = "hong";
          themNk("gửi gói " + esc(b.so) + " qua " + esc(b.duong) + " -> THẤT LẠC", "loi");
          canh = "<b>Mất gói " + esc(b.so) + ".</b> Máy B không biết gói đó chứa gì, nó chỉ thấy dãy số " +
            "nhận được nhảy cóc nên biết mình đang thiếu số mấy, rồi báo về xin lại <b>đúng gói đó</b>.";
        }
      } else if (b.k === "toi") {
        tt[b.so] = "xong"; daNhan.push(b.so);
        themNk("gói " + esc(b.so) + " tới muộn -> máy B nhận (chậm, không mất)");
      } else if (b.k === "lai") {
        tt[b.so] = "xong"; daNhan.push(b.so); canh = "";
        themNk("máy B xin lại gói " + esc(b.so) + " -> máy A gửi lại RIÊNG gói này -> tới nơi");
      } else if (b.k === "xep") {
        daXep = true;
        themNk("máy B xếp 5 gói theo số thứ tự -> ghép thành ảnh 5 MB nguyên vẹn");
      } else if (b.k === "p2") {
        p2i = b.i;
      }
    }

    function ve() {
      node.querySelector('[data-mh="p1"]').hidden = p2i >= 0;
      node.querySelector('[data-mh="p2"]').hidden = p2i < 0;

      var h = "", i;
      for (i = 1; i <= TONG; i++) {
        h += '<div class="mh9-tb ' + tt[i] + '"><b>Gói ' + esc(i) +
          "</b><small>đích: máy B<br>1 MB</small></div>";
      }
      node.querySelector('[data-mh="gui"]').innerHTML = h;

      /* Chỉ sắp xếp KHI máy nhận đã đủ gói — trước đó phải giữ nguyên thứ tự tới,
         vì cái lộn xộn ấy chính là điều bài học muốn cho thấy. */
      var ds = daXep ? daNhan.slice().sort(function (a, b) { return a - b; }) : daNhan;
      h = ds.length ? "" : '<div class="mh9-tb cho"><b>trống</b><small>chưa nhận gói nào</small></div>';
      for (i = 0; i < ds.length; i++) {
        h += '<div class="mh9-tb xong"><b>Gói ' + esc(ds[i]) + "</b><small>" +
          (daXep ? "đã về đúng chỗ" : "tới thứ " + esc(i + 1)) + "</small></div>";
      }
      node.querySelector('[data-mh="nhan"]').innerHTML = h;

      /* Đếm thật từ danh sách đã nhận, không gán cứng theo số bước. */
      var thieu = [];
      for (i = 1; i <= TONG; i++) { if (daNhan.indexOf(i) < 0) thieu.push(i); }
      node.querySelector('[data-mh="dem"]').innerHTML =
        "máy B đã nhận <b>" + daNhan.length + "</b>/" + TONG + " gói · " +
        (thieu.length ? "còn thiếu gói <b>" + esc(thieu.join(", ")) + "</b>"
          : daXep ? "<b>đủ</b> và đã xếp đúng thứ tự" : "<b>đủ</b>, chờ xếp lại");

      h = "";
      for (i = 0; i < nk.length; i++) {
        h += '<div class="' + nk[i].c + '">' + nk[i].t + "</div>";
      }
      node.querySelector('[data-mh="out"]').innerHTML =
        h || '<div class="trong">chưa gửi gói nào</div>';

      var oc = node.querySelector('[data-mh="canh"]');
      oc.hidden = !canh; oc.innerHTML = canh;

      if (p2i >= 0) {
        h = "";
        for (i = 0; i <= p2i; i++) {
          h += '<div class="mh7-m' + (i === p2i ? " nay" : "") + '"><b class="van">' +
            esc(PHAN[i].b) + "</b><small>" + esc(PHAN[i].s) + "</small></div>";
        }
        node.querySelector('[data-mh="ds"]').innerHTML = h;
      }

      var g = node.querySelector('[data-mh="ghi"]');
      g.hidden = !daXep;
      if (daXep) {
        g.className = "mh7-ghi xong";
        g.innerHTML = p2i >= PHAN.length - 1 ? GHI2 : GHI1;
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= KICH.length) {
        loi("Hết bước rồi. Bấm <b>Làm lại</b> nếu em muốn đi lại đường đi của từng gói từ đầu.");
        return;
      }
      var b = KICH[buoc++];
      chay(b);
      ve();
      loi(b.loi);
    };

    function lamLai() {
      buoc = 0; daNhan = []; nk = []; canh = ""; daXep = false; p2i = -1; tt = {};
      for (var i = 1; i <= TONG; i++) { tt[i] = "cho"; }
      ve();
      loi("Máy A sắp gửi một tấm ảnh <b>5 MB</b> sang máy B. Bấm “Bước tiếp” — em sẽ thấy nó <b>không đi " +
        "nguyên một khối</b> như nhiều bạn vẫn tưởng.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-18 · KIỂM THỬ VÀ GỠ LỖI (NÂNG CAO) — TRUY RA DÒNG HỎNG
   *
   *  KHÔNG lặp lại phần "ba loại lỗi" (app đã có ở đợt 10). Bài này chỉ dạy KĨ
   *  THUẬT ĐI TÌM: chương trình chạy trót lọt nhưng ra sai, học sinh phải ĐO
   *  chứ không đoán. Mọi con số dưới đây đều do mô phỏng thật vòng lặp sinh ra.
   * ================================================================ */
  MH.dangKy("C11-18", function (host) {
    var A = [4, 7, 2, 9, 6];

    /* tu = chỉ số bắt đầu vòng lặp. tu=1 là bản lỗi, tu=0 là bản đã sửa. Cả
       bảng vết chạy lẫn bảng kiểm thử đều gọi hàm này — không gán số cứng. */
    function chay(a, tu) {
      var dem = 0, vet = [], i, chan;
      for (i = tu; i < a.length; i++) {
        chan = a[i] % 2 === 0;
        if (chan) dem = dem + 1;
        vet.push({ i: i, v: a[i], chan: chan, dem: dem });
      }
      return { dem: dem, vet: vet };
    }
    var CU = chay(A, 1), MOI = chay(A, 0);

    var BO = [
      { ten: "[" + A.join(", ") + "]", a: A },
      { ten: "[] (danh sách rỗng)", a: [] },
      { ten: "[8] (một phần tử, chẵn)", a: [8] },
      { ten: "[3, 5, 7] (toàn số lẻ)", a: [3, 5, 7] },
      { ten: "[2, 4] (toàn số chẵn)", a: [2, 4] },
    ];

    function maMa(tu, coPrint) {
      var d = ["a = [" + A.join(", ") + "]", "dem = 0",
        "for i in range(" + (tu === 1 ? "1, " : "") + "len(a)):",
        "    if a[i] % 2 == 0:", "        dem = dem + 1"];
      if (coPrint) d.push("    print(i, a[i], dem)");
      d.push('print("So so chan:", dem)');
      return d;
    }
    function veMa(dong, nay) {
      return dong.map(function (d, k) {
        return '<div class="mh7-d' + (k === nay ? " nay" : "") + '">' + esc(d) + "</div>";
      }).join("");
    }
    function oBien(ten, gt, nay, none) {
      return '<div class="mh10-b' + (nay ? " nay" : (none ? " none" : "")) + '"><b>' +
        esc(ten) + "</b><i>" + esc(gt) + "</i></div>";
    }
    /* den = số vòng đã chạy xong; coMa = có vẽ thêm dòng "ma" i=0 bị bỏ sót. */
    function bangVet(vet, den, coMa) {
      var h = "<tr><th>i</th><th>a[i]</th><th>" + esc("a[i] % 2 == 0") + "</th><th>dem</th></tr>";
      if (coMa) {
        h += '<tr class="rac"><td>0</td><td>' + esc(A[0]) + "</td><td>—</td><td>" +
          esc("vòng này KHÔNG hề chạy") + "</td></tr>";
      }
      vet.slice(0, den).forEach(function (r, k) {
        h += "<tr" + (k === den - 1 ? ' class="nay"' : "") + "><td>" + r.i + "</td><td>" +
          esc(r.v) + "</td><td>" + (r.chan ? "True" : "False") + "</td><td>" + r.dem + "</td></tr>";
      });
      return '<div class="mh4-cuon"><table class="mh4-b">' + h + "</table></div>";
    }
    function bangKt() {
      var h = "<tr><th>Bộ dữ liệu vào</th><th>Đáp án đúng</th><th>Bản cũ</th><th>Bản đã sửa</th></tr>";
      BO.forEach(function (b) {
        var d = chay(b.a, 0).dem, c = chay(b.a, 1).dem;
        h += '<tr class="' + (c === d ? "khop" : "rac") + '"><td>' + esc(b.ten) + "</td><td>" +
          d + "</td><td>" + c + (c === d ? " (qua)" : " (SAI)") + "</td><td>" + d + " (qua)</td></tr>";
      });
      return '<div class="mh4-cuon"><table class="mh4-b">' + h + "</table></div>";
    }
    function manHinh(dong) { return '<div class="mh10-out">' + dong.join("") + "</div>"; }

    /* Dựng danh sách bước: mỗi vòng lặp của bản lỗi là một bước riêng, nên số
       bước tự khớp với dữ liệu chứ không phải đếm tay. */
    var BUOC = [{ p: "chay" }, { p: "in" }], k;
    for (k = 0; k < CU.vet.length; k++) BUOC.push({ p: "vet", k: k });
    BUOC.push({ p: "dung" }, { p: "sua" }, { p: "kt" });

    var KT = [
      { b: "print(...) chèn giữa chừng",
        m: "In giá trị biến ra ngay trong vòng lặp rồi chạy lại — cách rẻ nhất, không cần công cụ gì." },
      { b: "Chạy từng bước, theo dõi biến",
        m: "Phần mềm chạy một dòng rồi dừng, bảng biến cập nhật theo. Đúng là bảng vết chạy được làm " +
          "sẵn cho em." },
      { b: "Đặt điểm dừng (breakpoint)",
        m: "Đánh dấu một dòng; chương trình chạy tới đó mới dừng. Khỏi in ra hàng trăm dòng rồi mò." },
    ];

    var node = MH.el(MH.khung("Gỡ lỗi: chương trình chạy trót lọt nhưng ra sai",
      "Đoạn này đếm số chẵn trong danh sách. Nó <b>không báo lỗi gì cả</b> — vẫn in ra một con số. Chỉ " +
      "có điều con số đó <b>sai</b>. Em sẽ dùng ba kĩ thuật gỡ lỗi để truy ra <b>đúng dòng hỏng</b>.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="nt"></p>' +
      '<div class="mh7-code" data-mh="ma"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="np"></p>' +
      '<div data-mh="phai"></div></div></div>' +
      '<div class="mh10-bien" data-mh="bien"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh7-ds" data-mh="ds"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));
    var loi = loiCua(node);
    var buoc;

    function ve() {
      var s = BUOC[buoc], p = s.p;
      var nhanT = "Chương trình (bản lỗi)", nhanP = "Máy in ra", ma = "", phai = "", bien = "", dem = "";
      var chon = -1, canh = "", ghi = "";

      if (p === "chay") {
        ma = veMa(maMa(1, false), -1);
        phai = manHinh(["<div>So so chan: " + CU.dem + "</div>",
          '<div class="trong">(chạy xong, không một dòng báo lỗi nào)</div>']);
        dem = "Máy in: <b>" + CU.dem + "</b> · Em nhẩm tay: <b>" + MOI.dem + "</b>";
        canh = "Muốn biết chương trình sai, em <b>phải biết trước đáp án đúng</b> để so. Không có đáp án " +
          "để so thì con số nào in ra em cũng tin là đúng.";
      } else if (p === "in") {
        chon = 0;
        nhanT = "Chèn thêm một dòng print vào trong vòng lặp";
        ma = veMa(maMa(1, true), 5);
        var d = CU.vet.map(function (r) {
          return "<div>" + r.i + " " + esc(r.v) + " " + r.dem + "</div>";
        });
        d.push("<div>So so chan: " + CU.dem + "</div>");
        d.push('<div class="trong">a[0] = ' + esc(A[0]) + " không xuất hiện ở dòng nào cả</div>");
        phai = manHinh(d);
        dem = "Dòng đầu tiên máy in là <b>" + CU.vet[0].i + " " + CU.vet[0].v + " " + CU.vet[0].dem + "</b>";
        canh = "<b>i bắt đầu từ 1</b>, không phải 0. Phần tử <b>a[0] = " + esc(A[0]) + "</b> chưa bao giờ " +
          "được xét. Em vừa <b>đo</b> được điều đó, chứ không phải đọc code rồi đoán.";
      } else if (p === "vet") {
        chon = 1;
        var r = CU.vet[s.k];
        ma = veMa(maMa(1, false), 3);
        nhanP = "Bảng vết chạy — dựng dần qua từng vòng";
        phai = bangVet(CU.vet, s.k + 1, true);
        bien = oBien("i", r.i, true) + oBien("a[i]", r.v, false) + oBien("dem", r.dem, false);
        dem = "Vòng thứ <b>" + (s.k + 1) + "</b> / " + CU.vet.length + " · i = <b>" + r.i + "</b>";
      } else if (p === "dung") {
        chon = 2;
        var r0 = CU.vet[0];
        ma = veMa(maMa(1, false), 3);
        nhanT = "Điểm dừng đặt ở dòng if (dòng đang sáng)";
        nhanP = "Chương trình tạm dừng";
        phai = manHinh(["<div>[go loi] Dung tai dong 4: if a[i] % 2 == 0:</div>",
          "<div>[go loi] Cac bien luc nay:</div>",
          "<div>    i = " + r0.i + "</div>",
          "<div>    a[i] = " + esc(r0.v) + "</div>",
          "<div>    dem = 0</div>",
          '<div class="trong">lan cham DAU TIEN da la i = ' + r0.i + "</div>"]);
        bien = oBien("i", r0.i, true) + oBien("a[i]", r0.v, false) + oBien("dem", 0, false) +
          oBien("a[0]", A[0], false, true);
        dem = "Ô <b>a[0]</b> để mờ: vòng lặp <b>không bao giờ chạm tới</b> nó";
        canh = "Chỉ cần <b>một</b> lần dừng là đủ kết luận: lần chạm đầu tiên đã là i = " + r0.i +
          ". Điểm dừng hơn print ở chỗ nó cho em soi <b>đúng lúc, đúng chỗ</b>.";
      } else if (p === "sua") {
        nhanT = "Bản đã sửa";
        ma = veMa(maMa(0, false), 2);
        nhanP = "Chạy lại";
        phai = manHinh(["<div>So so chan: " + MOI.dem + "</div>"]) +
          bangVet(MOI.vet, MOI.vet.length, false);
        dem = "Ra <b>" + MOI.dem + "</b> — khớp đáp án nhẩm tay";
        canh = "Sửa <b>range(1, len(a))</b> thành <b>range(len(a))</b>. Lỗi nằm ở <b>chỉ số đầu của vòng " +
          "lặp</b> — người ta gọi đây là <b>lỗi lệch một đơn vị</b>, và nó là loại lỗi logic phổ biến nhất.";
      } else {
        nhanT = "Bản đã sửa";
        ma = veMa(maMa(0, false), -1);
        nhanP = "Chạy lại TẤT CẢ các bộ kiểm thử";
        phai = bangKt();
        dem = "Có bộ <b>bản cũ vẫn qua</b> — qua không có nghĩa là không có lỗi";
        ghi = "Ba điều phải nhớ: (1) sửa xong phải chạy lại <b>toàn bộ</b> các bộ cũ chứ không chỉ bộ vừa " +
          "hỏng — đó là <b>kiểm thử hồi quy</b>, vì vá chỗ này rất hay làm hỏng chỗ khác; (2) phải có " +
          "<b>trường hợp biên</b>: danh sách rỗng, một phần tử, toàn số lẻ; (3) bộ <b>[3, 5, 7]</b> ở trên " +
          "bản cũ <b>vẫn cho đúng kết quả</b> — nếu em chỉ thử mỗi bộ đó thì lỗi lọt lưới êm ru.";
      }

      node.querySelector('[data-mh="nt"]').innerHTML = nhanT;
      node.querySelector('[data-mh="np"]').innerHTML = nhanP;
      node.querySelector('[data-mh="ma"]').innerHTML = ma;
      node.querySelector('[data-mh="phai"]').innerHTML = phai;
      node.querySelector('[data-mh="bien"]').innerHTML = bien;
      node.querySelector('[data-mh="dem"]').innerHTML = dem;
      node.querySelector('[data-mh="ds"]').innerHTML = KT.map(function (t, j) {
        return '<div class="mh7-m' + (j === chon ? " nay" : "") + '"><b class="van">' +
          esc(t.b) + "</b><small>" + esc(t.m) + "</small></div>";
      }).join("");
      var oc = node.querySelector('[data-mh="canh"]');
      oc.hidden = !canh; oc.innerHTML = canh;
      var og = node.querySelector('[data-mh="ghi"]');
      og.hidden = !ghi; og.className = "mh7-ghi xong"; og.innerHTML = ghi;
    }

    var LOI = {
      chay: "Chương trình chạy <b>trót lọt</b>, không báo lỗi dòng nào, in ra <b>" + CU.dem +
        "</b>. Nhưng em nhẩm tay: 4, 2, 6 — phải là <b>" + MOI.dem + "</b>. Máy <b>không hề biết</b> nó sai.",
      in: "Kĩ thuật 1 — <b>in ra giữa chừng</b>. Chèn <b>print(i, a[i], dem)</b> vào trong vòng lặp rồi " +
        "chạy lại. Bảng vết chạy hiện ra ngay trên màn hình: i chạy từ <b>1</b>, nên a[0] bị bỏ sót.",
      vet: "Kĩ thuật 2 — <b>chạy từng bước và theo dõi biến</b>. Dòng đỏ trên cùng là vòng i = 0 <b>lẽ ra " +
        "phải có</b> mà không có. Trình gỡ lỗi trong phần mềm làm sẵn bảng này cho em, khỏi chèn print.",
      dung: "Kĩ thuật 3 — <b>điểm dừng</b>. Đặt ở dòng <b>if</b>, chương trình chạy tới đó là <b>đứng " +
        "lại</b> cho em soi giá trị tại chỗ, thay vì in ra hàng trăm dòng rồi tìm trong đống chữ.",
      sua: "Đã <b>sửa</b> và chạy lại: ra <b>" + MOI.dem + "</b>. Chú ý — em tìm ra lỗi bằng cách <b>đo</b> " +
        "(in giá trị, chạy từng bước, đặt điểm dừng), không phải đọc code chằm chằm rồi đoán.",
      kt: "Bước cuối, chỗ nhiều người bỏ qua nhất: <b>kiểm thử lại bằng nhiều bộ</b>, gồm cả các trường " +
        "hợp biên.",
    };

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= BUOC.length - 1) {
        loi("Hết các bước rồi. Bấm “Làm lại” để đi lại từ lúc chương trình ra kết quả sai.");
        return;
      }
      buoc++; ve(); loi(LOI[BUOC[buoc].p]);
    };

    function lamLai() { buoc = 0; ve(); loi(LOI.chay); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-06 · ĐIỆN TOÁN ĐÁM MÂY: ĐỒNG BỘ KHÔNG PHẢI SAO LƯU
   *
   *  NGỘ NHẬN GÂY MẤT DỮ LIỆU THẬT: "để trên đám mây là an toàn tuyệt đối".
   *  Học sinh thấy tệp tự hiện ra ở mọi thiết bị nên tin rằng đám mây giữ hộ
   *  mọi thứ. Nói lí thuyết không ăn thua — phải cho các em XOÁ NHẦM một tệp
   *  rồi nhìn nó biến mất ở cả ba nơi thì mới nhớ đời.
   *
   *  Ba nơi lưu trữ được mô phỏng bằng ba mảng THẬT: mỗi thao tác chỉ đổi mảng
   *  ở một nơi, bước "đồng bộ" mới chép sang hai nơi kia. Nhờ vậy số tệp hiện
   *  trên màn hình luôn là số đếm thật, không phải ba bảng viết sẵn.
   * ================================================================ */
  MH.dangKy("C10-06", function (host) {
    var THEM = "Bai_tap_Toan.docx", SUA = "Anh_lop.jpg", MAT = "Ghi_chu.txt";
    var CUOI = 8, buoc;
    /* Nơi nào vừa thao tác / vừa mất tệp ở mỗi bước — chỉ để tô màu hộp. */
    var TAC = { 0: ["nha"], 1: ["may", "dt"], 2: ["dt"], 3: ["nha", "may"], 5: ["may", "dt"] };
    var HONG = { 4: ["nha"], 5: ["nha", "may", "dt"] };

    var node = MH.el(MH.khung("Đồng bộ <b>không phải</b> là sao lưu",
      "Một thư mục đang <b>đồng bộ</b> giữa máy ở nhà, đám mây và điện thoại. Em bấm từng bước để thêm, " +
      "sửa, rồi <b>xoá nhầm</b> một tệp — và xem đám mây có cứu được em không.",
      '<div class="mh9-so" data-mh="noi"></div>' +
      '<div class="mh9-chu"><span><i class="n1"></i> nơi vừa thao tác</span>' +
      '<span><i class="hong"></i> vừa mất tệp</span>' +
      '<span><i class="xong"></i> bản sao lưu còn giữ</span>' +
      '<span><i class="cho"></i> chưa bật</span></div>' +
      '<div class="mh9-noi"></div>' +
      '<div class="mh4-hai" data-mh="bang"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh10-out" data-mh="ki"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh4-cuon" data-mh="ss" hidden></div>' +
      '<div class="mh7-ds" data-mh="uu" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="sao"> có bật <b>sao lưu riêng</b> ra ổ ' +
      "cứng rời (chép một bản, không đồng bộ)</label>"));

    var loi = loiCua(node);
    var oSao = node.querySelector('[data-mh="sao"]');
    function sao() { return oSao.checked; }

    function goc() {
      return [{ ten: MAT, ban: 1 }, { ten: SUA, ban: 1 }, { ten: "Bao_cao.docx", ban: 1 }];
    }
    function chep(ds) {
      var r = [], i;
      for (i = 0; i < ds.length; i++) r.push({ ten: ds[i].ten, ban: ds[i].ban });
      return r;
    }
    function tim(ds, ten) {
      for (var i = 0; i < ds.length; i++) if (ds[i].ten === ten) return i;
      return -1;
    }

    /* Dựng lại trạng thái từ đầu ở mỗi lần vẽ. Nhờ vậy bật/tắt ô sao lưu hay bấm
       "Làm lại" không bao giờ để sót trạng thái cũ. */
    function tinh(b) {
      var s = { nha: goc(), may: goc(), dt: goc(), sao: null, rac: [], mat: {},
        lop: { nha: {}, may: {}, dt: {} } }, i;
      if (b >= 0) { s.nha.push({ ten: THEM, ban: 1 }); if (b === 0) s.lop.nha[THEM] = "khop"; }
      if (b >= 1) {
        s.may = chep(s.nha); s.dt = chep(s.nha);
        if (b === 1) { s.lop.may[THEM] = "khop"; s.lop.dt[THEM] = "khop"; }
        if (sao()) s.sao = chep(s.nha);   // ổ cứng rời chép MỘT LẦN, tại đúng lúc này
      }
      if (b >= 2) { i = tim(s.dt, SUA); s.dt[i].ban = 2; if (b === 2) s.lop.dt[SUA] = "nay"; }
      if (b >= 3) {
        s.nha = chep(s.dt); s.may = chep(s.dt);
        if (b === 3) { s.lop.nha[SUA] = "nay"; s.lop.may[SUA] = "nay"; }
      }
      if (b >= 4) { s.nha.splice(tim(s.nha, MAT), 1); if (b === 4) s.mat.nha = 1; }
      if (b >= 5) {
        s.may = chep(s.nha); s.dt = chep(s.nha);
        if (b === 5) { s.mat.nha = 1; s.mat.may = 1; s.mat.dt = 1; }
        s.rac = [{ ten: MAT, ban: 1 }];
      }
      if (b >= 7) s.rac = [];            // quá 30 ngày, thùng rác tự dọn
      return s;
    }

    function cot(nhan, ds, lop, mat, racLop) {
      var h = "<div><h5>" + esc(nhan) + '</h5><div class="mh4-cuon"><table class="mh4-b">' +
        "<tr><th>Tên tệp</th><th>Bản</th></tr>", i, c;
      for (i = 0; i < ds.length; i++) {
        c = racLop || lop[ds[i].ten] || "";
        h += "<tr" + (c ? ' class="' + c + '"' : "") + "><td>" + esc(ds[i].ten) +
          "</td><td>bản " + ds[i].ban + "</td></tr>";
      }
      if (mat) h += '<tr class="xoa"><td>' + esc(MAT) + "</td><td>đã xoá</td></tr>";
      if (!ds.length && !mat) h += '<tr><td colspan="2">(trống)</td></tr>';
      return h + "</table></div></div>";
    }

    function nhatKi(b) {
      var d = [], i;
      if (b >= 0) d.push(["[Máy ở nhà] tạo tệp " + THEM, ""]);
      if (b >= 1) {
        d.push(["[Đám mây] nhận " + THEM, ""]);
        d.push(["[Điện thoại] nhận " + THEM, ""]);
        if (sao()) d.push(["[Ổ cứng rời] chép một bản thư mục (4 tệp, bản 1)", "trong"]);
      }
      if (b >= 2) d.push(["[Điện thoại] sửa " + SUA + " -> bản 2", ""]);
      if (b >= 3) {
        d.push(["[Đám mây] cập nhật " + SUA + " bản 2", ""]);
        d.push(["[Máy ở nhà] cập nhật " + SUA + " bản 2", ""]);
      }
      if (b >= 4) d.push(["[Máy ở nhà] XOÁ " + MAT, "loi"]);
      if (b >= 5) {
        d.push(["[Đám mây] xoá " + MAT + " (đồng bộ chép cả thao tác xoá)", "loi"]);
        d.push(["[Điện thoại] xoá " + MAT, "loi"]);
        if (sao()) d.push(["[Ổ cứng rời] không đồng bộ nên VẪN GIỮ " + MAT, ""]);
      }
      if (b >= 6) d.push(["[Đám mây] " + MAT + " nằm trong Thùng rác, còn 30 ngày", ""]);
      if (b >= 7) d.push(["[Đám mây] quá 30 ngày: thùng rác tự dọn, " + MAT + " mất hẳn", "loi"]);
      var h = "";
      for (i = 0; i < d.length; i++) {
        h += "<div" + (d[i][1] ? ' class="' + d[i][1] + '"' : "") + ">" + esc(d[i][0]) + "</div>";
      }
      return h || '<div class="trong">(chưa có thao tác nào)</div>';
    }

    function ve() {
      var s = tinh(buoc), i, h = "";
      var N = [["nha", "Máy ở nhà", "ổ cứng ở nhà em"],
        ["may", "Đám mây", "máy chủ thật của một công ty"],
        ["dt", "Điện thoại", "bộ nhớ điện thoại"]];
      var tac = TAC[buoc] || [], hong = HONG[buoc] || [];
      for (i = 0; i < N.length; i++) {
        var c = hong.indexOf(N[i][0]) >= 0 ? "hong" : (tac.indexOf(N[i][0]) >= 0 ? "nay" : "");
        h += '<div class="mh9-tb ' + c + '"><b>' + esc(N[i][1]) + "</b><small>" + esc(N[i][2]) +
          "<br>" + s[N[i][0]].length + " tệp</small></div>";
      }
      h += '<div class="mh9-tb ' + (sao() ? (buoc >= 5 ? "xong" : "") : "cho") + '"><b>Ổ cứng rời</b>' +
        "<small>" + (sao() ? "sao lưu, KHÔNG đồng bộ<br>" + (s.sao ? s.sao.length : 0) + " tệp"
          : "chưa bật sao lưu") + "</small></div>";
      node.querySelector('[data-mh="noi"]').innerHTML = h;

      h = cot("Máy ở nhà", s.nha, s.lop.nha, s.mat.nha, "") +
        cot("Đám mây", s.may, s.lop.may, s.mat.may, "") +
        cot("Điện thoại", s.dt, s.lop.dt, s.mat.dt, "");
      if (sao()) h += cot("Ổ cứng rời (sao lưu)", s.sao || [], {}, 0, "khop");
      if (buoc >= 6) h += cot("Thùng rác đám mây", s.rac, {}, 0, "rac");
      node.querySelector('[data-mh="bang"]').innerHTML = h;
      node.querySelector('[data-mh="ki"]').innerHTML = nhatKi(buoc);

      var DEM = ["Vừa thêm 1 tệp ở <b>Máy ở nhà</b> — hai nơi kia chưa biết gì",
        "Đồng bộ xong: cả ba nơi đều <b>" + s.may.length + "</b> tệp",
        "Sửa ở <b>Điện thoại</b> — mới chỉ điện thoại có bản 2",
        "Đồng bộ <b>hai chiều</b>: cả ba nơi đều là <b>bản 2</b>",
        "Vừa <b>xoá nhầm</b> ở Máy ở nhà — đám mây chưa kịp biết",
        "Đồng bộ chép luôn thao tác xoá: mất ở <b>cả ba nơi</b>",
        "Thùng rác đám mây còn giữ hộ — <b>30 ngày</b>",
        "Quá 30 ngày: thùng rác <b>tự dọn</b>",
        "Tổng kết: đồng bộ khác sao lưu"];
      node.querySelector('[data-mh="dem"]').innerHTML =
        buoc < 0 ? "Ba nơi đang giống hệt nhau: <b>" + s.nha.length + "</b> tệp" : DEM[buoc];

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(buoc === 5 || buoc === 7);
      if (buoc === 5) {
        canh.innerHTML = "Đây là điều em phải nhớ nhất bài này. <b>Đồng bộ chép cả thao tác xoá</b>. Xoá " +
          "một tệp ở một nơi là <b>mất ở mọi nơi</b> — đám mây <b>không cứu</b> em khỏi xoá nhầm, vì " +
          "nhiệm vụ của nó chỉ là làm cho mọi nơi <b>giống nhau</b>." +
          (sao() ? " May là em đã bật <b>sao lưu riêng</b>: ổ cứng rời không đồng bộ nên bản chép cũ " +
            "<b>vẫn còn</b> " + esc(MAT) + " — chép ngược lại là cứu được."
            : " Em thử tích ô <b>sao lưu riêng</b> ở trên rồi xem lại bước này.");
      } else if (buoc === 7) {
        canh.innerHTML = "Thùng rác chỉ là <b>cứu cánh có hạn</b>: hết 30 ngày là dọn sạch, và nó không " +
          "giúp gì khi em <b>sửa hỏng</b> tệp rồi mấy tháng sau mới phát hiện. <b>Thùng rác không thay " +
          "được sao lưu thật.</b>";
      }

      var ss = node.querySelector('[data-mh="ss"]');
      ss.hidden = buoc < 7;
      if (!ss.hidden) {
        ss.innerHTML = '<table class="mh4-b"><tr><th>Tình huống</th><th>Đồng bộ</th><th>Sao lưu</th></tr>' +
          "<tr><td>Mục đích</td><td>mọi nơi luôn giống nhau</td><td>giữ một bản chép ở một thời điểm</td></tr>" +
          '<tr class="nay"><td>Xoá nhầm bản chính</td><td>mất ở mọi nơi</td><td>bản sao vẫn còn</td></tr>' +
          "<tr><td>Sửa hỏng tệp</td><td>bản hỏng lan ra hết</td><td>bản cũ còn nguyên</td></tr>" +
          "<tr><td>Cần Internet</td><td>có</td><td>không, nếu chép ra ổ cứng rời</td></tr></table>";
      }

      var uu = node.querySelector('[data-mh="uu"]');
      uu.hidden = buoc < 8;
      if (!uu.hidden) {
        var U = [["Truy cập mọi lúc mọi nơi",
          "chỉ cần đăng nhập, không phải mang theo đúng chiếc máy", ""],
          ["Không lo hỏng ổ cứng", "máy hỏng hay mất máy thì bản trên máy chủ vẫn còn", ""],
          ["Trả tiền theo dung lượng dùng", "cần bao nhiêu mua bấy nhiêu, không phải sắm sẵn ổ đĩa", ""],
          ["Phải có mạng", "mất mạng là không truy cập được, trừ phần đã tải sẵn về máy", "nay"],
          ["Dữ liệu nằm trên máy người khác",
            "đó là máy chủ thật của một công ty, đặt trong một trung tâm dữ liệu", "nay"],
          ["Nhạy cảm thì cân nhắc",
            "đưa lên là giao cho bên thứ ba giữ; ảnh giấy tờ, mật khẩu thì nên nghĩ kĩ", "nay"]];
        h = "";
        for (i = 0; i < U.length; i++) {
          h += '<div class="mh7-m ' + U[i][2] + '"><b class="van">' + esc(U[i][0]) +
            "</b><small>" + esc(U[i][1]) + "</small></div>";
        }
        uu.innerHTML = h;
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < CUOI;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Bốn điều phải nhớ. <b>(1) Đồng bộ không phải sao lưu</b> — đồng bộ lo cho mọi " +
          "nơi giống nhau, nên xoá một nơi là mất mọi nơi. <b>(2)</b> Muốn an toàn thật thì phải có " +
          "<b>bản chép riêng</b> ở một thời điểm, để chỗ khác, <b>không đồng bộ</b> với bản chính. " +
          "<b>(3)</b> Thùng rác 30 ngày là cứu cánh <b>có hạn</b>. <b>(4)</b> “Đám mây” chỉ là cách vẽ " +
          "cho gọn: dữ liệu của em nằm trên <b>máy chủ thật của một công ty</b>, cần <b>Internet</b> mới " +
          "lấy được, và thứ gì nhạy cảm thì phải cân nhắc trước khi đưa lên.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= CUOI) {
        loi("Hết bước rồi. Em thử bật/tắt ô <b>sao lưu riêng</b> rồi chạy lại để so hai kết cục, hoặc " +
          "bấm “Làm lại”.");
        return;
      }
      buoc++;
      ve();
      if (buoc === 0) {
        loi("Em vừa lưu bài tập vào thư mục ở <b>Máy ở nhà</b>. Lúc này mới chỉ máy ở nhà có 4 tệp.");
      } else if (buoc === 1) {
        loi("Phần mềm đồng bộ tự đẩy tệp mới lên <b>Đám mây</b>, rồi điện thoại tải về. Ba nơi lại " +
          "<b>giống hệt nhau</b> — đó chính là <b>đồng bộ</b>.");
      } else if (buoc === 2) {
        loi("Lần này em sửa ảnh <b>ngay trên điện thoại</b>. Đồng bộ không phân biệt máy nào là chính.");
      } else if (buoc === 3) {
        loi("Bản sửa lan ngược lên đám mây rồi về máy ở nhà: đồng bộ là <b>hai chiều</b>, sửa ở đâu cũng " +
          "được, cuối cùng mọi nơi vẫn <b>giống nhau</b>.");
      } else if (buoc === 4) {
        loi("Em <b>xoá nhầm</b> " + esc(MAT) + " ở máy ở nhà. Ngay lúc này hai nơi kia vẫn còn tệp — em " +
          "thử đoán vài giây nữa chuyện gì xảy ra.");
      } else if (buoc === 5) {
        loi("Tệp <b>biến mất luôn</b> ở đám mây và điện thoại. Đồng bộ hiểu “xoá” cũng là một thay đổi " +
          "cần chép đi khắp nơi." + (sao() ? " Chỉ <b>ổ cứng rời</b> là còn giữ." : ""));
      } else if (buoc === 6) {
        loi("Nhiều dịch vụ có <b>Thùng rác</b> giữ tệp đã xoá thêm khoảng <b>30 ngày</b>. Nếu phát hiện " +
          "sớm, em vào đó khôi phục được.");
      } else if (buoc === 7) {
        loi("Nhưng 30 ngày trôi qua thì thùng rác <b>tự dọn</b>. Xem bảng so sánh phía dưới để thấy rõ " +
          "<b>đồng bộ</b> khác <b>sao lưu</b> chỗ nào.");
      } else {
        loi("Cuối cùng là ưu và nhược của điện toán đám mây — biết cả hai mặt thì mới dùng đúng cách.");
      }
    };

    function lamLai() {
      buoc = -1;
      ve();
      loi("Thư mục có <b>3</b> tệp, giống nhau ở cả ba nơi. Bấm “Bước tiếp” để em thêm một tệp ở " +
        "<b>Máy ở nhà</b>.");
    }
    ganDatLai(node, [oSao], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-22 · CỔNG KẾT NỐI, CHUẨN KHÔNG DÂY VÀ TRÌNH ĐIỀU KHIỂN
   *
   *  NGỘ NHẬN CHÍNH: học sinh tưởng "cắm vừa cổng là chạy". Nên phần 1 cho cắm
   *  thật một máy in rồi CHẶN ở chặng 4 khi thiếu driver — dây vẫn đúng, cổng
   *  vẫn tốt, mà vẫn không in được. Đó là chỗ duy nhất chứng minh được trình
   *  điều khiển là PHẦN MỀM chứ không phải dây hay cổng.
   * ================================================================ */
  MH.dangKy("C11-22", function (host) {
    var CHANG = [
      { b: "1. Cắm vào cổng USB", s: "máy nhận ra có thiết bị mới" },
      { b: "2. Hỏi: anh là ai?", s: "thiết bị báo mã hãng, mã sản phẩm" },
      { b: "3. Tìm trình điều khiển", s: "khớp mã thì dùng, không thì cài thêm" },
      { b: "4. Hiện trong danh sách", s: "có driver mới dùng được" },
      { b: "5. In thử", s: "ra giấy" },
    ];
    var CONG = [
      { c: "USB-A", d: "chuột, bàn phím, USB, máy in", t: "dữ liệu và điện (sạc)",
        g: "chỉ cắm được một chiều", k: "" },
      { c: "USB-C", d: "điện thoại, máy tính đời mới", t: "dữ liệu, điện và cả hình ảnh",
        g: "cắm chiều nào cũng được", k: "khop" },
      { c: "HDMI", d: "màn hình, tivi, máy chiếu", t: "hình và tiếng đi ra",
        g: "chỉ đưa hình tiếng ra, không sạc", k: "" },
      { c: "RJ-45", d: "dây mạng LAN", t: "dữ liệu mạng có dây",
        g: "ổn định hơn Wi-Fi", k: "" },
      { c: "Jack 3,5 mm", d: "tai nghe, loa, micro", t: "âm thanh",
        g: "chỉ âm thanh, không truyền dữ liệu", k: "" },
    ];
    var KD = [
      { c: "Wi-Fi", x: "vài chục mét", n: "thiết bị với MẠNG (qua bộ định tuyến)",
        d: "vào Internet, tốc độ cao, tốn điện hơn" },
      { c: "Bluetooth", x: "vài mét", n: "hai thiết bị TRỰC TIẾP với nhau",
        d: "tai nghe, chuột, loa; tốn rất ít điện" },
      { c: "NFC", x: "vài xen-ti-mét, phải chạm sát", n: "hai thiết bị chạm nhau",
        d: "thanh toán, thẻ ra vào; dữ liệu rất ít" },
    ];
    var TONG = 9;          /* 5 chặng cắm máy in + 1 bảng cổng + 3 chuẩn không dây */
    var buoc;

    var node = MH.el(MH.khung("Cắm máy in vào máy: chuyện gì thật sự xảy ra?",
      "Em cắm dây rồi, cổng vẫn tốt — nhưng máy in <b>chưa chắc dùng được</b>. Bấm “Bước tiếp” để đi " +
      "từng chặng và xem thứ còn thiếu là gì.",
      '<div class="mh9-so" data-mh="chang"></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> đã xong</span>' +
      '<span><i class="hong"></i> hỏng: thiếu trình điều khiển</span>' +
      '<span><i class="cho"></i> chưa tới</span></div>' +
      '<div class="mh10-out" data-mh="out" style="margin:11px 0 0"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div data-mh="hcong" hidden><p class="mh8-dem">Các loại cổng và việc của từng cổng</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bcong"></table></div></div>' +
      '<div data-mh="hkd" hidden><p class="mh8-dem">Ba chuẩn không dây</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bkd"></table></div></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="thieu"> máy chưa có trình điều khiển ' +
      "của máy in này</label>"));

    var loi = loiCua(node);
    var oThieu = node.querySelector('[data-mh="thieu"]');
    function thieu() { return oThieu.checked; }

    function veChang() {
      var h = "", i, lop;
      for (i = 0; i < CHANG.length; i++) {
        /* Chặng 4 chỉ "hỏng" đúng lúc buoc = 4 và đang thiếu driver; sang bước 5
           đã cài xong nên nó phải trở lại bình thường. */
        if (thieu() && i === 3 && buoc === 4) lop = "hong";
        else if (i === buoc - 1) lop = "nay";
        else if (i < buoc - 1) lop = "xong";
        else lop = "cho";
        h += '<div class="mh9-tb ' + lop + '"><b>' + esc(CHANG[i].b) + "</b><small>" +
          esc(CHANG[i].s) + "</small></div>";
      }
      node.querySelector('[data-mh="chang"]').innerHTML = h;
    }

    /* Nhật kí dựng lại từ đầu mỗi lần vẽ: đổi ô tích là mọi dòng tự đúng theo,
       không phải nhớ trạng thái cũ. */
    function veOut() {
      var d = [];
      if (buoc < 1) d.push(["(chưa cắm gì — nhật kí hệ điều hành đang trống)", 2]);
      if (buoc >= 1) d.push(["USB: phát hiện thiết bị mới ở cổng USB-A", 0]);
      if (buoc >= 2) {
        d.push(["USB: hỏi thiết bị — anh là ai?", 0]);
        d.push(["USB: thiết bị khai VID_03F0 (mã hãng), PID_0C17 (mã sản phẩm), lớp: máy in", 0]);
      }
      if (buoc >= 3) {
        d.push(thieu()
          ? ["DRIVER: tìm trong kho có sẵn... KHÔNG có phần mềm nào khớp VID_03F0/PID_0C17", 1]
          : ["DRIVER: kho có sẵn đã khớp VID_03F0/PID_0C17 — nạp luôn, không cần cài thêm", 0]);
      }
      if (buoc >= 4) {
        d.push(thieu()
          ? ["DEVICE: máy in có trong danh sách nhưng mang DẤU CHẤM THAN — chưa dùng được", 1]
          : ["DEVICE: máy in đã sẵn sàng", 0]);
      }
      if (buoc >= 5) {
        if (thieu()) d.push(["DRIVER: đã cài phần mềm điều khiển (tải về hoặc từ đĩa) — nạp xong", 0]);
        d.push(["PRINT: gửi trang thử... in xong", 0]);
      }
      node.querySelector('[data-mh="out"]').innerHTML = d.map(function (x) {
        return "<div" + (x[1] === 1 ? ' class="loi"' : x[1] === 2 ? ' class="trong"' : "") + ">" +
          esc(x[0]) + "</div>";
      }).join("");
    }

    function veBang() {
      var h = "<tr><th>Cổng</th><th>Cắm cái gì</th><th>Truyền được gì</th><th>Nhớ</th></tr>", i;
      for (i = 0; i < CONG.length; i++) {
        h += '<tr class="' + (buoc >= 6 ? CONG[i].k : "") + '"><td>' + esc(CONG[i].c) + "</td><td>" +
          esc(CONG[i].d) + "</td><td>" + esc(CONG[i].t) + "</td><td>" + esc(CONG[i].g) + "</td></tr>";
      }
      node.querySelector('[data-mh="bcong"]').innerHTML = h;
      var k = "<tr><th>Chuẩn</th><th>Xa được bao nhiêu</th><th>Nối cái gì với cái gì</th>" +
        "<th>Dùng để</th></tr>";
      for (i = 0; i < KD.length; i++) {
        k += '<tr class="' + (buoc - 7 === i ? "nay" : "") + '"><td>' + esc(KD[i].c) + "</td><td>" +
          esc(KD[i].x) + "</td><td>" + esc(KD[i].n) + "</td><td>" + esc(KD[i].d) + "</td></tr>";
      }
      node.querySelector('[data-mh="bkd"]').innerHTML = k;
      node.querySelector('[data-mh="hcong"]').hidden = buoc < 6;
      node.querySelector('[data-mh="hkd"]').hidden = buoc < 7;
    }

    function ve() {
      veChang(); veOut(); veBang();
      var t = "Máy in: <b>chưa dùng được</b>";
      if (buoc >= 5) t = "Máy in: <b>in được</b>";
      else if (buoc === 4 && !thieu()) t = "Máy in: <b>sẵn sàng</b>";
      node.querySelector('[data-mh="dem"]').innerHTML =
        "Chặng <b>" + Math.min(buoc, 5) + "</b>/5 · " + t;

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(thieu() && buoc === 4);
      if (!canh.hidden) {
        canh.innerHTML = "<b>Dây vẫn cắm đúng. Cổng vẫn tốt. Máy in vẫn có điện.</b> Vậy mà không in " +
          "được, vì thứ còn thiếu là <b>trình điều khiển — một phần mềm</b>. Không có nó, hệ điều hành " +
          "biết “có cái gì đó vừa cắm vào” nhưng <b>không biết ra lệnh cho nó thế nào</b>.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < TONG;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Bốn điều phải nhớ. <b>(1)</b> Trình điều khiển là <b>phần mềm</b>, không phải " +
          "dây, không phải cổng — cắm đúng cổng mà thiếu nó thì thiết bị vẫn nằm im. <b>(2)</b> Mỗi " +
          "loại thiết bị cần <b>driver riêng do nhà sản xuất viết</b>; hệ điều hành đã gói sẵn driver " +
          "cho những thiết bị phổ biến nên nhiều thứ “cắm là chạy” — chứ không phải chúng không cần " +
          "driver. <b>(3)</b> <b>Bluetooth không phải Wi-Fi</b>: Bluetooth nối <b>hai thiết bị với " +
          "nhau</b>, Wi-Fi nối thiết bị <b>vào mạng</b>. <b>(4)</b> Cổng cắm vừa <b>không có nghĩa là " +
          "chạy được</b>: còn phải đúng chuẩn và có trình điều khiển.";
      }
    }

    function loiBuoc() {
      if (buoc === 1) {
        return "Em cắm dây vào <b>cổng USB</b>. Cổng có sẵn dây tín hiệu và dây điện, nên máy tính " +
          "<b>nhận ra ngay “có thiết bị mới”</b> — nhưng lúc này nó mới chỉ biết có <i>một cái gì đó</i>, " +
          "chưa biết đó là máy in hay chuột.";
      }
      if (buoc === 2) {
        return "Hệ điều hành <b>hỏi thiết bị: anh là ai?</b> Thiết bị tự khai <b>mã nhà sản xuất</b> " +
          "(VID_03F0) và <b>mã sản phẩm</b> (PID_0C17). Hai con số này là <b>căn cước</b> của thiết bị — " +
          "nhờ nó mà máy biết phải đi tìm phần mềm nào.";
      }
      if (buoc === 3) {
        return thieu()
          ? "Hệ điều hành lục kho driver có sẵn để tìm phần mềm khớp hai mã đó. <b>Không có.</b> Lúc này " +
            "chỉ còn hai đường: <b>tải về</b> từ trang của hãng, hoặc <b>cài từ đĩa</b> bán kèm máy in."
          : "Hệ điều hành lục kho driver có sẵn và <b>tìm thấy</b> phần mềm khớp hai mã đó, nạp luôn. " +
            "Đây chính là cái em quen gọi là “cắm là chạy” — không phải thiết bị không cần driver, mà là " +
            "<b>driver đã nằm sẵn trong hệ điều hành</b>.";
      }
      if (buoc === 4) {
        return thieu()
          ? "Máy in <b>có hiện</b> trong danh sách thiết bị, nhưng mang <b>dấu chấm than</b> và không in " +
            "được. Đây là chỗ phải nhớ: <b>trình điều khiển là phần mềm</b>. Thay dây khác, đổi cổng " +
            "khác, cắm chặt hơn — <b>đều vô ích</b>."
          : "Máy in hiện trong danh sách thiết bị, <b>không có dấu chấm than</b>, dùng được ngay. Thử " +
            "tích ô <b>“máy chưa có trình điều khiển”</b> ở trên rồi chạy lại để thấy trường hợp ngược lại.";
      }
      if (buoc === 5) {
        return (thieu()
          ? "Cài driver xong — chỉ là <b>chép thêm một phần mềm</b> vào máy, không đụng gì tới dây hay " +
            "cổng — thế là <b>in được</b>. "
          : "Máy in ra giấy. ") + "Từ nay mỗi lần em bấm In, chương trình chỉ nói với hệ điều hành “in " +
          "trang này”, còn <b>driver</b> mới là thứ dịch câu đó thành lệnh riêng mà đúng loại máy in này " +
          "hiểu được.";
      }
      if (buoc === 6) {
        return "Bảng các loại cổng. Nhìn cột cuối: <b>USB-C cắm chiều nào cũng được</b> và truyền được " +
          "cả <b>hình ảnh lẫn điện</b>, còn USB-A chỉ cắm một chiều và không đưa hình ra màn hình. Nhưng " +
          "nhớ: <b>cắm vừa cổng chưa có nghĩa là chạy được</b> — vẫn còn phải đúng chuẩn và có trình " +
          "điều khiển như em vừa thấy.";
      }
      if (buoc === 7) {
        return "<b>Wi-Fi</b>: nối thiết bị <b>vào một mạng</b>, thường qua bộ định tuyến. Xa được <b>vài " +
          "chục mét</b>, tốc độ cao, đủ để xem phim và tải tệp lớn — đổi lại tốn điện hơn.";
      }
      if (buoc === 8) {
        return "<b>Bluetooth</b>: nối <b>hai thiết bị trực tiếp với nhau</b>, không cần mạng nào cả. Chỉ " +
          "<b>vài mét</b> và tốn rất ít điện, nên hợp với tai nghe, chuột, loa. <b>Bluetooth không phải " +
          "Wi-Fi</b> — đây là hai việc khác nhau.";
      }
      return "<b>NFC</b>: phải <b>chạm sát, vài xen-ti-mét</b>, truyền được rất ít dữ liệu. Đúng cho " +
        "thanh toán và thẻ ra vào, vì chính khoảng cách ngắn ấy là thứ giữ an toàn. Ba chuẩn khác nhau ở " +
        "<b>tầm xa, tốc độ và mục đích</b>, <b>không thay được cho nhau</b>.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TONG) {
        loi("Đã đi hết các bước. Bấm “Làm lại” để chạy lại, hoặc tích/bỏ tích ô <b>chưa có trình điều " +
          "khiển</b> ở trên để so hai trường hợp.");
        return;
      }
      buoc++;
      ve();
      loi(loiBuoc());
    };

    function lamLai() {
      buoc = 0;
      ve();
      loi(thieu()
        ? "Máy chưa có trình điều khiển của máy in này. Bấm “Bước tiếp” để cắm dây và xem máy dừng lại " +
          "ở chặng nào."
        : "Máy in đang cầm trên tay, dây USB chưa cắm. Bấm “Bước tiếp” để cắm vào cổng.");
    }
    ganDatLai(node, [oThieu], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-08 · SAO LƯU VÀ PHỤC HỒI DỮ LIỆU
   *
   *  SGK nói "phải sao lưu thường xuyên" — câu không ai cãi và cũng không ai
   *  thấy thấm. Nó chỉ có nghĩa khi TẦN SUẤT biến thành CON SỐ: hằng ngày mất
   *  20 bản ghi, hằng tuần mất 100, hằng tháng mất 500.
   *
   *  Mọi con số đều TÍNH RA từ lịch: ngày 1 của tháng rơi vào thứ Hai nên ngày
   *  26 đúng là thứ Sáu và các Chủ nhật là ngày 7, 14, 21. Không gán cứng số
   *  nào — đổi MOI_NGAY hay NGAY_SC là cả minh hoạ tính lại.
   * ================================================================ */
  MH.dangKy("U11-08", function (host) {
    var MOI_NGAY = 20;    // bản ghi mượn/trả thêm mỗi ngày
    var NGAY_SC = 26;     // ngày xảy ra sự cố (thứ Sáu)
    var KHO_CU = 9000;    // bản ghi đã có từ các tháng trước
    var PHUT_LAY = 20;    // chép bản sao về, dựng lại CSDL
    var PHUT_MOT = 2;     // nhập tay lại MỘT bản ghi từ sổ giấy
    var THU = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    var TAN = [
      { ma: "ngay", ten: "Hằng ngày", mo: "cuối mỗi ngày làm việc" },
      { ma: "tuan", ten: "Hằng tuần", mo: "mỗi Chủ nhật" },
      { ma: "thang", ten: "Hằng tháng", mo: "ngày 1 hằng tháng" },
      { ma: "khong", ten: "Không sao lưu", mo: "chưa chép ra chỗ nào khác" },
    ];

    /* Ngày của lần sao lưu gần nhất TRƯỚC sự cố; 0 nghĩa là không có bản nào.
       Đây là chỗ duy nhất quyết định mọi con số phía sau. */
    function lanCuoi(ma) {
      if (ma === "ngay") return NGAY_SC - 1;             // xong việc hôm trước là sao lưu
      if (ma === "tuan") return NGAY_SC - (NGAY_SC % 7); // lùi về Chủ nhật gần nhất
      if (ma === "thang") return 1;
      return 0;
    }
    function ngayMat(ma) { var c = lanCuoi(ma); return c ? NGAY_SC - c : NGAY_SC; }
    function soMat(ma) {
      var c = lanCuoi(ma);
      /* Không sao lưu thì mất cả kho cũ chứ không riêng phần mới sinh ra. */
      if (!c) return KHO_CU + NGAY_SC * MOI_NGAY;
      return (NGAY_SC - c) * MOI_NGAY;
    }
    function phutPhuc(ma) { return (lanCuoi(ma) ? PHUT_LAY : 0) + soMat(ma) * PHUT_MOT; }
    function soVn(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
    function tgPhut(p) {
      if (p < 60) return p + " phút";
      var g = Math.floor(p / 60), d = p % 60;
      if (g < 40) return g + " giờ" + (d ? " " + d + " phút" : "");
      return "khoảng " + Math.round(g / 8) + " ngày công";
    }
    function tenLan(ma) {
      var c = lanCuoi(ma);
      return c ? "hết ngày " + c + " (" + THU[c % 7] + ")" : "chưa có bản nào";
    }
    function tenTep(ma) {
      var c = lanCuoi(ma);
      return c ? "thu_vien_" + (c < 10 ? "0" + c : c) + ".bak" : "";
    }
    function tenTan(ma) {
      for (var i = 0; i < TAN.length; i++) if (TAN[i].ma === ma) return TAN[i].ten;
      return "";
    }
    function tanNay() { return node.querySelector('[data-mh="tan"]').value; }

    var buoc = 0;

    var chon = TAN.map(function (t) {
      return '<option value="' + t.ma + '">' + esc(t.ten + " — " + t.mo) + "</option>";
    }).join("");

    var node = MH.el(MH.khung("Sao lưu bao lâu một lần chính là chấp nhận mất bấy nhiêu dữ liệu",
      "Cơ sở dữ liệu thư viện, mỗi ngày thêm khoảng <b>" + MOI_NGAY + "</b> bản ghi mượn/trả. Sự cố xảy " +
      "ra <b>thứ Sáu, ngày " + NGAY_SC + "</b>. Em đổi tần suất ở trên và nhìn con số <b>bản ghi mất</b> " +
      "đổi theo — đó là toàn bộ bài học.",
      '<div class="mh9-so" data-mh="dt"></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> có bản sao lưu</span>' +
      '<span><i class="cho"></i> ngày chưa kịp sao lưu</span>' +
      '<span><i class="hong"></i> sự cố · mất vĩnh viễn</span></div>' +
      '<div class="mh9-noi"></div>' +
      '<div class="mh10-out" data-mh="out"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div data-mh="noi3" hidden></div>' +
      '<div class="mh4-cuon" data-mh="boc" hidden style="margin-top:11px">' +
      '<table class="mh4-b" data-mh="bang"></table></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi"></div>',
      'Tần suất sao lưu: <select data-mh="tan">' + chon + "</select>"));

    var loi = loiCua(node);

    function hop(lop, b, s) {
      return '<div class="mh9-tb ' + lop + '"><b>' + esc(b) + "</b><small>" + esc(s) + "</small></div>";
    }

    /* Dòng thời gian: vài mốc sao lưu gần nhất, khoảng trống chưa sao lưu gộp
       thành một hộp, rồi tới mốc sự cố. */
    function veDt(ma) {
      var c = lanCuoi(ma), h = "", i;
      if (ma === "ngay") {
        for (i = c - 3; i <= c; i++) h += hop("xong", "Ngày " + i, THU[i % 7] + " · sao lưu");
      } else if (ma === "tuan") {
        for (i = c - 14; i <= c; i += 7) h += hop("xong", "Ngày " + i, THU[i % 7] + " · sao lưu");
      } else if (ma === "thang") {
        h += hop("xong", "Ngày " + c, THU[c % 7] + " · sao lưu");
      }

      var g = NGAY_SC - 1 - c;   // số ngày sau lần sao lưu cuối, trước ngày sự cố
      if (g > 0) {
        h += hop(buoc >= 2 ? "hong" : "cho", g + " ngày",
          c ? "chưa kịp sao lưu" : "không có bản sao nào");
      }
      h += hop(buoc >= 1 ? "hong" : "cho", "Ngày " + NGAY_SC,
        buoc >= 1 ? "T6 · SỰ CỐ" : "T6 · sắp tới");
      node.querySelector('[data-mh="dt"]').innerHTML = h;
    }

    function dongOut(ma) {
      var c = lanCuoi(ma), mat = soMat(ma), tong = KHO_CU + NGAY_SC * MOI_NGAY;
      if (buoc === 0) {
        return [{ t: "08:00  Hệ thống thư viện chạy bình thường." },
          { t: "CSDL thu_vien.db: " + soVn(tong) + " bản ghi." },
          { m: 1, t: "Lịch sao lưu đang đặt: " + tenTan(ma) + "." }];
      }
      if (buoc === 1) {
        return [{ t: "09:15  Ổ cứng máy chủ kêu lạ rồi dừng hẳn." },
          { l: 1, t: "LỖI: không đọc được thu_vien.db." },
          { l: 1, t: "Dữ liệu đang nằm trên máy chủ: mất sạch." },
          { m: 1, t: "(Xoá nhầm hay nhiễm mã độc tống tiền cho ra đúng màn hình này.)" }];
      }
      if (buoc === 5) {
        return [{ t: "Thử phục hồi " + (c ? tenTep(ma) : "(không có tệp nào)") + " ra máy khác..." },
          { l: 1, t: c ? "Tệp hỏng, giải nén được 41%. Bản sao này vô dụng." : "Không có gì để thử." },
          { m: 1, t: "Nhiều nơi biết tệp sao lưu hỏng đúng vào lúc cần dùng nó nhất." }];
      }
      if (!c) {
        return [{ l: 1, t: "09:40  Tìm bản sao lưu... không có tệp nào." },
          { l: 1, t: "Không phục hồi được gì. Mất " + soVn(mat) + " bản ghi, tức cả CSDL." },
          { m: 1, t: "Chỉ còn cách nhập tay lại từ sổ mượn giấy, nếu sổ giấy còn." }];
      }
      return [{ t: "09:40  Lấy " + tenTep(ma) + ", dựng lại CSDL." },
        { t: "Xong. Dữ liệu đúng tới " + tenLan(ma) + "." },
        { l: 1, t: "Mất vĩnh viễn " + soVn(mat) + " bản ghi (ngày " + (c + 1) + " tới ngày " +
          NGAY_SC + ")." }];
    }

    function veOut(ds) {
      node.querySelector('[data-mh="out"]').innerHTML = ds.map(function (d) {
        return "<div" + (d.l ? ' class="loi"' : d.m ? ' class="trong"' : "") + ">" + esc(d.t) + "</div>";
      }).join("");
    }

    function veBang(ma) {
      var t = "<tr><th>Tần suất</th><th>Bản sao gần nhất</th><th>Số ngày mất</th>" +
        "<th>Bản ghi mất</th><th>Phục hồi mất</th></tr>";
      TAN.forEach(function (o) {
        var lop = o.ma === ma ? "nay" : o.ma === "ngay" ? "khop" : o.ma === "khong" ? "rac" : "";
        t += '<tr class="' + lop + '"><td>' + esc(o.ten) + "</td><td>" + esc(tenLan(o.ma)) +
          "</td><td>" + (lanCuoi(o.ma) ? ngayMat(o.ma) : "cả CSDL") + "</td><td><b>" +
          soVn(soMat(o.ma)) + "</b></td><td>" + esc(tgPhut(phutPhuc(o.ma))) + "</td></tr>";
      });
      node.querySelector('[data-mh="bang"]').innerHTML = t;
    }

    function loiGhi(ma, c, mat) {
      if (buoc === 0) {
        return "Đây là lịch sao lưu của <b>" + esc(tenTan(ma)) + "</b>. Hộp xanh là ngày <b>đã có bản " +
          "sao</b>, hộp nét đứt là ngày <b>chưa kịp sao lưu</b>. Khoảng trống giữa bản sao cuối cùng và " +
          "ngày " + NGAY_SC + " chính là phần dữ liệu đang <b>không được bảo vệ</b>.";
      }
      if (buoc === 1) {
        return "Ổ cứng hỏng, bản chính coi như không còn. Chú ý: <b>toàn bộ</b> dữ liệu trên máy chủ mất " +
          "cùng một lúc chứ không mất dần — nên không có chuyện “để mai tính”.";
      }
      if (buoc === 2) {
        return c
          ? "Phục hồi chỉ đưa được CSDL về <b>đúng thời điểm sao lưu</b> (" + esc(tenLan(ma)) + "). Mọi " +
            "bản ghi sinh ra <b>sau</b> mốc đó — " + ngayMat(ma) + " ngày, " + soVn(mat) + " bản ghi — " +
            "<b>mất vĩnh viễn</b>, không cách nào lấy lại từ máy."
          : "Không có bản sao thì không có gì để phục hồi. Mất <b>" + soVn(mat) + "</b> bản ghi, tức cả " +
            "cơ sở dữ liệu, kể cả phần tích luỹ từ những tháng trước.";
      }
      if (buoc === 3) {
        return "Bốn tần suất, <b>cùng một sự cố</b>, khác nhau ở cột “Bản ghi mất”: " +
          soVn(soMat("ngay")) + " · " + soVn(soMat("tuan")) + " · " + soVn(soMat("thang")) + " · " +
          soVn(soMat("khong")) + ". Ba dòng đầu bằng đúng <b>số ngày kể từ lần sao lưu gần nhất nhân " +
          MOI_NGAY + "</b>; dòng cuối không có mốc nào để trừ nên mất cả kho. Sao lưu càng thưa, hố càng sâu.";
      }
      if (buoc === 4) {
        return "Quy tắc dân trong nghề dùng: giữ <b>nhiều bản</b>, ở <b>nhiều nơi</b>, ít nhất <b>một bản " +
          "đặt ở chỗ khác</b>. Bản sao 1 chết cùng bản chính vì nằm cùng phòng; chỉ bản sao 2 ở toà nhà " +
          "khác mới thật sự cứu được thư viện.";
      }
      return "Điều cuối, cũng là điều hay bị bỏ qua nhất: <b>bản sao lưu chưa thử phục hồi thì chưa tính " +
        "là có sao lưu</b>. Gói lại bốn ý: sao lưu phải <b>định kì</b> chứ không phải chép một lần rồi " +
        "thôi; <b>tần suất quyết định lượng dữ liệu mất</b>; để <b>cùng chỗ</b> với bản chính thì không " +
        "phải sao lưu; và <b>đồng bộ đám mây không thay được sao lưu</b>.";
    }

    function ve() {
      var ma = tanNay(), c = lanCuoi(ma), mat = soMat(ma);
      veDt(ma);
      veOut(dongOut(ma));

      node.querySelector('[data-mh="dem"]').innerHTML =
        "Lần sao lưu gần nhất: <b>" + esc(tenLan(ma)) + "</b> · mất <b>" + soVn(mat) +
        "</b> bản ghi · phục hồi mất <b>" + esc(tgPhut(phutPhuc(ma))) + "</b>";

      node.querySelector('[data-mh="boc"]').hidden = buoc < 3;
      if (buoc >= 3) veBang(ma);

      var n3 = node.querySelector('[data-mh="noi3"]');
      n3.hidden = buoc < 4;
      if (buoc >= 4) {
        n3.innerHTML = '<div class="mh9-so" style="margin-top:11px">' +
          hop("hong", "Bản chính", "máy chủ thư viện · đã hỏng") +
          hop("hong", "Bản sao 1", "ổ cứng ngoài để cạnh máy chủ · cháy thì mất theo") +
          hop("xong", "Bản sao 2", "phòng máy toà nhà khác · còn nguyên") + "</div>";
      }

      var canh = node.querySelector('[data-mh="canh"]'), tc = "";
      if (buoc === 1) {
        tc = "Sao lưu <b>không phải chép một lần rồi thôi</b>. Từ giây phút này, thứ duy nhất cứu được em " +
          "là <b>bản sao lưu gần nhất</b> — chép hôm nào thì cứu được tới hôm đó.";
      } else if (buoc === 2 && !c) {
        tc = "Đồng bộ đám mây <b>không thay được</b> sao lưu: em xoá bản chính thì bản trên mây cũng biến " +
          "mất theo, vì nó chỉ soi gương bản chính chứ không giữ lịch sử.";
      } else if (buoc === 4) {
        tc = "Bản sao để <b>cùng chỗ</b> với bản chính thì <b>không phải sao lưu</b>. Cháy, mất trộm, mã " +
          "độc tống tiền quét cả ổ mạng — hai bản đi cùng nhau. Phải có <b>ít nhất một bản ở toà nhà " +
          "khác</b>.";
      }
      canh.hidden = !tc;
      canh.innerHTML = tc;

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.className = "mh7-ghi" + (buoc === 5 ? " xong" : "");
      ghi.innerHTML = loiGhi(ma, c, mat);
    }

    function noiBuoc() {
      var ma = tanNay();
      if (buoc === 1) {
        loi("Sự cố xảy ra <b>thứ Sáu, ngày " + NGAY_SC + "</b>. Dữ liệu trên máy chủ mất hết.");
      } else if (buoc === 2) {
        loi("Phục hồi xong: mất <b>" + soVn(soMat(ma)) + "</b> bản ghi.");
      } else if (buoc === 3) {
        loi("So bốn tần suất trong bảng — cùng sự cố, khác hẳn thiệt hại.");
      } else if (buoc === 4) {
        loi("Nhiều bản, nhiều nơi, ít nhất một bản ở <b>toà nhà khác</b>.");
      } else if (buoc === 5) {
        loi("Thử phục hồi đi, kẻo tệp sao lưu hỏng mà không ai biết.");
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= 5) {
        loi("Hết bước rồi. Em đổi <b>tần suất</b> ở ô trên rồi xem lại bảng — con số mất đổi theo ngay.");
        return;
      }
      buoc++; ve(); noiBuoc();
    };

    /* Đổi tần suất thì GIỮ NGUYÊN bước đang xem, chỉ tính lại số — chính lúc so
       đi so lại ở bước 2, 3 là lúc bài học ngấm; kéo về bước 0 là hỏng. */
    node.querySelector('[data-mh="tan"]').onchange = function () {
      var ma = tanNay();
      ve();
      loi("Chuyển sang <b>" + esc(tenTan(ma)) + "</b>: mất <b>" + soVn(soMat(ma)) + "</b> bản ghi.");
    };

    function lamLai() {
      buoc = 0;
      node.querySelector('[data-mh="tan"]').value = "tuan";
      ve();
      loi("Chọn tần suất ở ô trên, rồi bấm “Bước tiếp” để xem sự cố ngày " + NGAY_SC + " lấy mất gì.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-22 · DÙNG CHUNG THƯ MỤC, MÁY IN VÀ PHÂN QUYỀN TRONG MẠNG NỘI BỘ
   *
   *  Mọi kết quả "được / không" đều TRA TỪ bảng Q trong dữ liệu, không viết sẵn
   *  từng câu — nhờ vậy lúc cô giáo nâng quyền ở bước 6 thì bảng, nhãn vai và
   *  cả kết quả các thao tác đều đổi thật theo.
   * ================================================================ */
  MH.dangKy("C12-22", function (host) {
    var TONG = 8;
    var NGUOI = [{ id: "co", ten: "Cô giáo" }, { id: "lt", ten: "Lớp trưởng" },
      { id: "hs", ten: "Học sinh thường" }];
    var THAO = [
      { id: "mo", ten: "Mở tệp", vi: "chỉ cần quyền đọc là mở ra xem được.",
        chan: "không có cả quyền đọc thì tệp không mở." },
      { id: "sua", ten: "Sửa rồi lưu", vi: "có quyền ghi nên bản trên máy chủ bị ghi đè.",
        chan: "chỉ đọc — hệ điều hành chặn đúng lúc ghi đè bản trên máy chủ." },
      { id: "them", ten: "Thêm tệp mới", vi: "quyền ghi cho phép tạo tệp mới trong thư mục.",
        chan: "không có quyền ghi thì không tạo được tệp ở đây." },
      { id: "xoa", ten: "Xoá tệp", vi: "quyền xoá dành cho chủ sở hữu thư mục.",
        chan: "đọc – ghi KHÔNG kèm quyền xoá tệp của người khác." },
      { id: "quyen", ten: "Đổi quyền người khác", vi: "chủ sở hữu mới được sửa danh sách quyền.",
        chan: "không phải chủ sở hữu thì không tự nâng quyền cho mình được." }];
    var TIN = [{ id: "gui", ten: "Gửi lệnh in" }, { id: "mau", ten: "In màu" },
      { id: "huy", ten: "Huỷ lệnh in của người khác" }];
    var QIN = { co: { gui: 1, mau: 1, huy: 1 }, lt: { gui: 1, mau: 1, huy: 0 },
      hs: { gui: 1, mau: 0, huy: 0 } };
    var Q, ai, hang, buoc, out, canh, hienIn;

    function taoQ() {
      return { co: { mo: 1, sua: 1, them: 1, xoa: 1, quyen: 1 },
        lt: { mo: 1, sua: 1, them: 1, xoa: 0, quyen: 0 },
        hs: { mo: 1, sua: 0, them: 0, xoa: 0, quyen: 0 } };
    }

    var node = MH.el(MH.khung("Ai được làm gì trong thư mục dùng chung?",
      "Thư mục <b>ÔN THI</b> nằm trên máy chủ phòng máy, ba người có ba mức quyền khác nhau. Bấm " +
      "<b>Bước tiếp</b> để thử từng thao tác, hoặc <b>bấm thẳng vào một ô</b> trong bảng quyền để xem " +
      "vì sao được hay bị chặn.",
      '<div class="mh9-so" data-mh="ng"></div><div class="mh9-noi"></div>' +
      '<div class="mh9-so" data-mh="tn"></div>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> ĐƯỢC</span>' +
      '<span><i class="hong"></i> KHÔNG</span></div>' +
      '<p class="mh8-dem" data-mh="dem"></p><div class="mh10-out" data-mh="out" hidden></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh4-cuon" data-mh="cin" hidden><table class="mh4-b" data-mh="bin"></table></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      "<label>Đang đăng nhập:</label><select data-mh=\"ai\">" +
      NGUOI.map(function (n) {
        return '<option value="' + esc(n.id) + '">' + esc(n.ten) + "</option>";
      }).join("") + '</select><label class="mh7-tick"><input type="checkbox" data-mh="moi"> ' +
      "Chia sẻ “Mọi người — Toàn quyền”</label>"));

    var loi = loiCua(node);

    function moiTQ() { return node.querySelector('[data-mh="moi"]').checked; }
    /* MỘT cửa duy nhất để hỏi "được hay không" — mọi chỗ khác đều gọi vào đây. */
    function co(n, t) { return moiTQ() ? 1 : (Q[n][t] ? 1 : 0); }
    /* Nhãn vai TÍNH RA từ quyền, không gán cứng, nên nâng quyền là nhãn đổi theo. */
    function vai(n) {
      if (moiTQ()) return "Toàn quyền (mọi người)";
      if (Q[n].quyen) return "Toàn quyền — chủ sở hữu";
      if (Q[n].sua || Q[n].them) return "Đọc – ghi";
      return Q[n].mo ? "Chỉ đọc" : "Không truy cập";
    }
    function tenNguoi(n) {
      for (var i = 0; i < NGUOI.length; i++) if (NGUOI[i].id === n) return NGUOI[i].ten;
      return n;
    }
    function tenThao(t) {
      for (var i = 0; i < THAO.length; i++) if (THAO[i].id === t) return THAO[i];
      return THAO[0];
    }
    function kq(t) { return co(ai, t) ? "ĐƯỢC" : "KHÔNG"; }
    function giaiThich(n, t) {
      var th = tenThao(t), duoc = co(n, t);
      return "<b>" + esc(tenNguoi(n)) + "</b> (" + esc(vai(n)) + ") · " + esc(th.ten) + ": <b>" +
        (duoc ? "ĐƯỢC" : "KHÔNG") + "</b> — " + (duoc ? th.vi : th.chan) +
        (moiTQ() ? " Thư mục đang mở <b>Mọi người — Toàn quyền</b> nên ai cũng làm được tuốt." : "");
    }
    function bamO() {
      ai = this.getAttribute("data-n"); hang = this.getAttribute("data-t"); out = "";
      ve(); loi(giaiThich(ai, hang));
    }

    function ve() {
      node.querySelector('[data-mh="ai"]').value = ai;
      node.querySelector('[data-mh="ng"]').innerHTML = NGUOI.map(function (n) {
        return '<div class="mh9-tb ' + (n.id === ai ? "nay" : "") + '"><b>' + esc(n.ten) +
          "</b><small>" + esc(vai(n.id)) + "</small></div>";
      }).join("");
      node.querySelector('[data-mh="tn"]').innerHTML =
        '<div class="mh9-tb"><b>Thư mục ÔN THI</b><small>\\\\MAYCHU\\ONTHI — quyền đặt ở thư mục lan ' +
        "xuống mọi tệp và thư mục con bên trong</small></div>" +
        '<div class="mh9-tb ' + (hienIn ? "nay" : "cho") + '"><b>Máy in phòng máy</b><small>tài nguyên ' +
        "dùng chung, cũng phân quyền được</small></div>";

      var h = "<tr><th>Thao tác</th>" + NGUOI.map(function (n) {
        return "<th>" + esc(n.ten) + "<br>" + esc(vai(n.id)) + "</th>";
      }).join("") + "</tr>";
      for (var i = 0; i < THAO.length; i++) {
        var t = THAO[i];
        h += '<tr class="' + (t.id === hang ? "nay" : "") + '"><td>' + esc(t.ten) + "</td>";
        for (var j = 0; j < NGUOI.length; j++) {
          var n = NGUOI[j].id, duoc = co(n, t.id);
          h += '<td class="' + (duoc ? "" : "mh8-lech") + '" data-n="' + esc(n) + '" data-t="' +
            esc(t.id) + '" style="cursor:pointer">' + (duoc ? "ĐƯỢC" : "KHÔNG") + "</td>";
        }
        h += "</tr>";
      }
      node.querySelector('[data-mh="bang"]').innerHTML = h;
      /* innerHTML vừa ghi đè -> phải gắn LẠI onclick cho từng ô sau mỗi lần vẽ. */
      node.querySelectorAll('[data-mh="bang"] td[data-n]').forEach(function (o) { o.onclick = bamO; });

      node.querySelector('[data-mh="dem"]').innerHTML = "Cùng một máy trong phòng máy · đang đăng " +
        "nhập: <b>" + esc(tenNguoi(ai)) + "</b> · quyền: <b>" + esc(vai(ai)) + "</b>";

      var oOut = node.querySelector('[data-mh="out"]');
      oOut.hidden = !out;
      if (out) oOut.innerHTML = out;

      var c = moiTQ() ? "<b>Thư mục đang chia sẻ “Mọi người — Toàn quyền”.</b> Bảng quyền vừa thành " +
        "ĐƯỢC hết: bất kì ai vào được mạng nội bộ đều <b>xoá sạch</b> thư mục này được. Đây là kiểu " +
        "chia sẻ nguy hiểm nhất, nhiều người chọn chỉ vì cho nhanh." : canh;
      var oCanh = node.querySelector('[data-mh="canh"]');
      oCanh.hidden = !c;
      if (c) oCanh.innerHTML = c;

      node.querySelector('[data-mh="cin"]').hidden = !hienIn;
      if (hienIn) {
        var k = "<tr><th>Máy in dùng chung</th>" + NGUOI.map(function (x) {
          return "<th>" + esc(x.ten) + "</th>";
        }).join("") + "</tr>";
        for (var u = 0; u < TIN.length; u++) {
          k += "<tr><td>" + esc(TIN[u].ten) + "</td>";
          for (var v = 0; v < NGUOI.length; v++) {
            var d = QIN[NGUOI[v].id][TIN[u].id];
            k += '<td class="' + (d ? "" : "mh8-lech") + '">' + (d ? "ĐƯỢC" : "KHÔNG") + "</td>";
          }
          k += "</tr>";
        }
        node.querySelector('[data-mh="bin"]').innerHTML = k;
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < TONG;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Bốn điều phải nhớ: <b>(1)</b> quyền gắn với <b>người dùng</b>, không gắn với " +
          "máy tính — cùng một máy, đăng nhập tài khoản khác là quyền khác hẳn. <b>(2)</b> <b>Chỉ đọc " +
          "không có nghĩa là không sao chép được</b>: đã cho đọc là cho chép, muốn giữ bí mật thì đừng " +
          "chia sẻ. <b>(3)</b> Đặt quyền ở <b>thư mục</b> thì quyền đó <b>lan xuống</b> tệp và thư mục " +
          "con bên trong. <b>(4)</b> Chia sẻ “Mọi người — Toàn quyền” cho nhanh là <b>nguy hiểm " +
          "nhất</b> — hãy cho đúng người, đúng mức; máy in dùng chung cũng phân quyền y như vậy.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TONG) {
        loi("Đã đi hết <b>" + TONG + "</b> bước rồi. Em bấm thẳng vào các ô trong bảng để xem lại từng " +
          "trường hợp, hoặc bấm “Làm lại”.");
        return;
      }
      buoc++; out = ""; canh = "";

      if (buoc === 1) {
        ai = "hs"; hang = "mo";
        out = "<div>Mở \\\\MAYCHU\\ONTHI\\de-cuong.docx — thành công</div>";
        loi("Em đăng nhập tài khoản <b>học sinh thường</b> rồi mở tệp: <b>" + kq("mo") + "</b>, vì mức " +
          "<b>Chỉ đọc</b> đã đủ để đọc nội dung.");
      } else if (buoc === 2) {
        ai = "hs"; hang = "sua";
        out = "<div>Ghi đè de-cuong.docx trên máy chủ...</div>" +
          '<div class="loi">Truy cập bị từ chối — em không có quyền ghi vào thư mục này</div>';
        loi("Vẫn tệp đó, em sửa vài chữ rồi bấm Lưu: <b>" + kq("sua") + "</b>. Hệ điều hành chỉ chặn " +
          "<b>đúng lúc ghi đè bản trên máy chủ</b> — còn mở thì vẫn mở được như thường.");
      } else if (buoc === 3) {
        ai = "hs"; hang = "";
        out = "<div>Sao chép de-cuong.docx về D:\\TaiLieu\\ — thành công</div>" +
          "<div>Sửa và lưu bản D:\\TaiLieu\\de-cuong.docx — thành công</div>";
        loi("Chỗ nhiều em hiểu sai nhất: em <b>chép tệp về máy mình</b> rồi sửa, lưu sang chỗ khác — " +
          "<b>được hết</b>. Quyền chỉ áp cho <b>bản nằm trên máy chủ</b>, không cấm nổi người ta chép về " +
          "rồi làm gì tuỳ ý. Nhớ: <b>chia sẻ chỉ-đọc không giữ được bí mật</b>; muốn giữ bí mật thì " +
          "đừng chia sẻ.");
      } else if (buoc === 4) {
        ai = "lt"; hang = "them";
        out = "<div>Tạo \\\\MAYCHU\\ONTHI\\de-thi-thu\\bai-1.pdf — thành công</div>";
        loi("Đổi sang tài khoản <b>lớp trưởng</b> trên <b>chính chiếc máy vừa nãy</b>: thêm tệp mới <b>" +
          kq("them") + "</b>. Quyền <b>gắn với người dùng</b>, không gắn với máy tính. Tệp mới nằm trong " +
          "thư mục con cũng <b>thừa hưởng</b> quyền của thư mục cha.");
      } else if (buoc === 5) {
        ai = "lt"; hang = "xoa";
        out = "<div>Xoá de-cuong.docx (tệp của cô giáo)...</div>" +
          '<div class="loi">Truy cập bị từ chối — em không có quyền xoá</div>';
        canh = "Đọc – ghi <b>không bao gồm</b> quyền xoá tệp của người khác, cũng <b>không</b> cho sửa " +
          "danh sách quyền: nhìn hai hàng cuối của cột Lớp trưởng.";
        loi("Lớp trưởng xoá tệp của cô: <b>" + kq("xoa") + "</b>; thử đổi quyền cho bạn khác: <b>" +
          (co("lt", "quyen") ? "ĐƯỢC" : "KHÔNG") + "</b>. <b>Ghi được không có nghĩa là xoá được.</b>");
      } else if (buoc === 6) {
        ai = "co"; hang = "quyen";
        Q.hs.sua = 1; Q.hs.them = 1;   // chỉ chủ sở hữu mới sửa được bảng quyền
        out = "<div>Cô giáo đặt lại quyền: Học sinh thường  Chỉ đọc  →  Đọc – ghi</div>" +
          "<div>Áp dụng cho thư mục ÔN THI và mọi thư mục con — thành công</div>";
        loi("Cô giáo là <b>chủ sở hữu</b> nên đổi quyền được (<b>" + kq("quyen") + "</b>). Cô nâng " +
          "<b>Học sinh thường</b> lên <b>Đọc – ghi</b> — nhìn bảng: nhãn cột đổi, hai ô KHÔNG ở hàng " +
          "“Sửa rồi lưu” và “Thêm tệp mới” vừa thành ĐƯỢC. Thao tác bị chặn ở bước 2 giờ làm lại là " +
          "chạy, mà không phải cài gì trên máy học sinh.");
      } else if (buoc === 7) {
        ai = "hs"; hang = ""; hienIn = true;
        out = "<div>Gửi lệnh in de-cuong.docx tới Máy in phòng máy — đang in</div>" +
          '<div class="loi">Huỷ lệnh in của bạn khác: bị từ chối</div>';
        loi("<b>Máy in dùng chung cũng phân quyền y hệt</b> (bảng dưới): ai được in, ai được in màu, ai " +
          "được <b>huỷ lệnh in của người khác</b>. Học sinh in được nhưng không đụng vào hàng đợi của " +
          "bạn khác — không thì cả lớp huỷ lệnh in của nhau, loạn hết.");
      } else {
        hang = "";
        canh = "Thử tích ô <b>“Mọi người — Toàn quyền”</b> ở trên xem bảng biến thành cái gì.";
        loi("Bước cuối: em tự tích ô <b>“Mọi người — Toàn quyền”</b> phía trên để thấy cả bảng chuyển " +
          "ĐƯỢC hết — kiểu chia sẻ cho nhanh mà <b>ai vào mạng cũng xoá được</b>. Đọc kĩ khối ghi chú " +
          "bên dưới rồi bỏ tích đi.");
      }
      ve();
    };

    node.querySelector('[data-mh="ai"]').onchange = function () {
      ai = this.value; hang = ""; out = "";
      ve();
      loi("Em vừa <b>đăng nhập tài khoản khác trên cùng chiếc máy</b> — quyền đổi theo <b>người</b>, " +
        "không theo máy. Quyền hiện tại: <b>" + esc(vai(ai)) + "</b>.");
    };
    node.querySelector('[data-mh="moi"]').onchange = function () {
      out = ""; ve();
      loi(this.checked
        ? "Cả bảng vừa thành <b>ĐƯỢC</b> hết. Nhanh thật, nhưng bất kì ai vào được mạng nội bộ cũng " +
          "<b>xoá sạch</b> thư mục được — kể cả người chẳng phải lớp mình."
        : "Đã bỏ chia sẻ “Mọi người — Toàn quyền”. Bảng quay lại đúng ba mức quyền của ba người.");
    };

    function lamLai() {
      Q = taoQ(); ai = "hs"; hang = ""; buoc = 0; out = ""; canh = ""; hienIn = false;
      node.querySelector('[data-mh="moi"]').checked = false;
      ve();
      loi("Thư mục <b>ÔN THI</b> đang chia sẻ cho ba người với ba mức quyền. Bấm “Bước tiếp” để thử " +
        "thao tác đầu tiên, hoặc bấm vào bất kì ô nào trong bảng.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-01 · MỘT VÒNG QUANH HỆ QUẢN TRỊ CSDL: BỐN ĐỐI TƯỢNG, HAI CHẾ ĐỘ
   *
   *  Học sinh mở phần mềm quản trị CSDL ra là bối rối ngay: một đống chữ lạ,
   *  không biết cái nào chứa cái nào. Hai ngộ nhận phải gỡ bằng MẮT chứ không
   *  bằng lời: (1) biểu mẫu và truy vấn KHÔNG chứa dữ liệu — nên ở đây xoá
   *  chúng đi mà bảng vẫn còn đủ bản ghi; (2) chế độ thiết kế đổi CẤU TRÚC còn
   *  chế độ trang dữ liệu đổi DỮ LIỆU — nên phải cho em tự làm SAI chế độ và bị
   *  phần mềm từ chối thẳng mặt.
   * ================================================================ */
  MH.dangKy("U11-01", function (host) {
    var DOI = [
      { t: "Bảng", m: "nơi lưu dữ liệu thật" },
      { t: "Biểu mẫu", m: "nhập, xem từng bản ghi" },
      { t: "Truy vấn", m: "đặt câu hỏi cho dữ liệu" },
      { t: "Báo cáo", m: "trình bày để in ra giấy" },
    ];
    var COT = ["MaTV", "HoTen", "Lop", "SoDT"];
    var DL = [
      ["TV01", "Nguyễn An", "11A5", "0912345678"],
      ["TV02", "Trần Bình", "11A5", "0987654321"],
      ["TV03", "Lê Chi", "11A2", "0905112233"],
    ];
    var MOI = ["TV04", "Phạm Dung", "11A2", "0978246810"];

    /* p = 1 (bốn đối tượng) hay 2 (hai chế độ). cd = chế độ ĐÚNG của bước;
       bat = bước này thật sự làm một thao tác, nên vào sai chế độ thì bị chặn. */
    var BUOC = [
      { p: 1, ob: -1, man: "tep", nhan: "Cửa sổ tệp CSDL",
        out: "Đã mở tệp CLB_Sach.", dem: "Một tệp CSDL &middot; bên trong có <b>4</b> đối tượng",
        giai: "Nhìn kĩ: đây là <b>một tệp duy nhất</b>, bên trong chứa cả bốn loại đối tượng. Không phải " +
          "mỗi bảng một tệp như em vẫn tưởng." },
      { p: 1, ob: 0, man: "bang", nhan: "Bảng THANHVIEN",
        out: "Mở bảng THANHVIEN: 3 bản ghi.", dem: "Bảng &middot; <b>3</b> bản ghi &middot; 4 trường",
        giai: "<b>Bảng</b> là nơi dữ liệu <b>thật sự được lưu</b>. Ba đối tượng còn lại không có kho " +
          "riêng, chúng chỉ nhìn vào bảng này." },
      { p: 1, ob: 1, man: "form", nhan: "Biểu mẫu Nhap_ThanhVien",
        out: "Biểu mẫu đang hiển thị bản ghi 2 / 3 lấy từ bảng THANHVIEN.",
        dem: "Biểu mẫu &middot; xem <b>từng</b> bản ghi &middot; nguồn: bảng THANHVIEN",
        giai: "<b>Biểu mẫu</b> là cái cửa sổ đẹp để nhập và xem <b>từng bản ghi</b> cho đỡ hoa mắt. Em " +
          "gõ vào đây thì chữ vẫn chạy về nằm trong bảng — biểu mẫu <b>không chứa dữ liệu</b>." },
      { p: 1, ob: 2, man: "query", nhan: "Truy vấn Muon_QuaHan",
        out: "Chạy truy vấn: 2 / 3 bản ghi thoả điều kiện.",
        dem: "Truy vấn &middot; lọc ra <b>2</b> dòng &middot; chạy lại mỗi lần mở",
        giai: "<b>Truy vấn</b> là một <b>câu hỏi</b> đặt cho dữ liệu: lọc, sắp xếp, tính toán. Kết quả " +
          "<b>không phải một bảng mới</b> được cất đi — đóng ra mở vào là nó tính lại trên dữ liệu mới " +
          "nhất." },
      { p: 1, ob: 3, man: "report", nhan: "Báo cáo DS_ThanhVien",
        out: "Xem trước khi in: 1 trang A4.", dem: "Báo cáo &middot; định dạng để <b>in ra giấy</b>",
        giai: "<b>Báo cáo</b> lấy đúng dữ liệu đó, thêm tiêu đề, đánh số, cộng tổng rồi bày cho gọn để " +
          "<b>in</b>. Vẫn không có kho dữ liệu riêng." },
      { p: 1, ob: 0, k: ["xong", "hong", "hong", "xong"], man: "bang",
        nhan: "Bảng THANHVIEN sau khi xoá",
        out: "Đã xoá Nhap_ThanhVien và Muon_QuaHan.\nBảng THANHVIEN: 3 bản ghi — không mất dòng nào.",
        dem: "Xoá 2 đối tượng &middot; dữ liệu còn <b>3</b>/3 bản ghi",
        giai: "Xoá biểu mẫu và truy vấn xong: dữ liệu <b>vẫn còn nguyên</b>. Mất cái cửa sổ thôi, kho " +
          "không suy suyển — làm lại biểu mẫu khác là xem được tiếp." },
      { p: 1, ob: 0, k: ["hong", "hong", "hong", "hong"], man: "xoa", nhan: "Đã xoá bảng THANHVIEN",
        out: "@Không mở được: bảng nguồn THANHVIEN không tồn tại.",
        dem: "Xoá bảng &middot; còn <b>0</b> bản ghi",
        canh: "Xoá <b>bảng</b> là <b>mất hết dữ liệu</b>. Báo cáo và biểu mẫu còn nằm đó nhưng rỗng " +
          "tuếch vì mất nguồn. Đây là chỗ khác nhau sống còn giữa bảng và ba đối tượng kia.",
        giai: "Còn xoá <b>bảng</b> thì mất sạch. Nhớ một câu: xoá biểu mẫu hay truy vấn thì dữ liệu vẫn " +
          "còn, xoá bảng là mất." },
      { p: 2, cd: false,
        giai: "Sang phần hai. Cùng một bảng THANHVIEN nhưng mở được bằng <b>hai chế độ</b>. Em tích rồi " +
          "bỏ tích ô ở trên để thấy màn hình đổi hẳn." },
      { p: 2, cd: false, bat: true, out: "Đã thêm bản ghi TV04 — Phạm Dung. Bảng: 4 bản ghi.",
        giai: "Ở <b>chế độ trang dữ liệu</b> em nhập thêm một bản ghi — chỉ <b>dữ liệu</b> đổi, cấu trúc " +
          "y nguyên. Bây giờ tích ô <b>chế độ thiết kế</b> rồi thử nhập tiếp xem sao." },
      { p: 2, cd: true, bat: true,
        out: "Đã đổi kiểu trường SoDT: Text &rarr; Number.\nPhần mềm cảnh báo: có thể mất dữ liệu đang có.",
        giai: "Ở <b>chế độ thiết kế</b> em đổi được kiểu dữ liệu của trường SoDT — thay đổi này ảnh " +
          "hưởng <b>mọi bản ghi</b>. Bỏ tích ô để thử đổi kiểu ở chế độ kia xem phần mềm nói gì." },
      { p: 2, cd: false, out: "Đã lưu cấu trúc. Về chế độ trang dữ liệu: 4 ô SoDT trống rỗng.",
        canh: "Số điện thoại <b>0912345678</b> là dãy chữ số bắt đầu bằng số 0, kiểu <b>Number</b> không " +
          "giữ được. Đổi kiểu dữ liệu của một trường khi bảng <b>đã có dữ liệu</b> là việc nguy hiểm — " +
          "phần mềm cắt bỏ những gì không hợp kiểu và <b>không hoàn lại được</b>.",
        giai: "Quay về nhìn dữ liệu: bốn số điện thoại <b>mất sạch</b>. Cấu trúc và dữ liệu tách nhau " +
          "thật, nhưng sửa cấu trúc thì dữ liệu lãnh đủ." },
      { p: 2, cd: false, out: "Bảng THANHVIEN: 4 bản ghi, trường SoDT rỗng.",
        giai: "Xong một vòng. Đọc kĩ ô ghi nhớ bên dưới trước khi làm bài tập.",
        ghi: "Bốn điều phải nhớ. <b>(1)</b> Dữ liệu chỉ nằm ở <b>bảng</b>; biểu mẫu, truy vấn, báo cáo " +
          "đều <b>không chứa dữ liệu</b>. <b>(2)</b> Một <b>tệp CSDL</b> chứa cả bốn loại đối tượng. " +
          "<b>(3)</b> <b>Chế độ thiết kế</b> khai tên trường, kiểu dữ liệu, ràng buộc, khoá chính — đổi " +
          "<b>cấu trúc</b>, ảnh hưởng mọi bản ghi; <b>chế độ trang dữ liệu</b> nhập, sửa, xoá bản ghi — " +
          "đổi <b>dữ liệu</b>. <b>(4)</b> Đổi kiểu dữ liệu khi bảng đã có dữ liệu thì <b>có thể mất dữ " +
          "liệu</b>." },
    ];
    var buoc;

    var node = MH.el(MH.khung(
      "Một vòng quanh <b>hệ quản trị cơ sở dữ liệu</b>: bốn đối tượng, hai chế độ",
      "Phần một đi qua <b>bảng, biểu mẫu, truy vấn, báo cáo</b> để xem cái nào thật sự giữ dữ liệu. Phần " +
      "hai mở một bảng bằng <b>hai chế độ</b> và thử làm việc <b>sai chế độ</b> cho biết mặt.",
      '<div class="mh9-so" data-mh="do"></div><div class="mh9-noi"></div>' +
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="nhan"></p><div data-mh="man"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Thông báo của phần mềm</p>' +
      '<div class="mh10-out" data-mh="out"></div></div></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="cd"> mở bảng ở <b>chế độ thiết kế</b> ' +
      "(bỏ tích: <b>chế độ trang dữ liệu</b>) &mdash; dùng ở phần hai</label>"));

    var loi = loiCua(node);
    function o(k) { return node.querySelector('[data-mh="' + k + '"]'); }
    var oCd = o("cd");
    function cd() { return oCd.checked; }
    /* Trạng thái chỉ phụ thuộc số bước, trừ đúng bước đang thao tác: ở đó nếu em
       vào sai chế độ thì thao tác chưa xảy ra, nhờ vậy màn hình không bao giờ
       mâu thuẫn với dòng giải thích. */
    function daThem() { return buoc > 8 || (buoc === 8 && !cd()); }
    function daDoi() { return buoc > 9 || (buoc === 9 && cd()); }

    function boc(h) { return '<div class="mh4-cuon"><table class="mh4-b">' + h + "</table></div>"; }

    function bangDL(op) {
      var hang = DL.slice(0), h = "<tr>", i, j, r, c;
      if (op.them) hang.push(MOI);
      for (i = 0; i < COT.length; i++) h += "<th>" + esc(COT[i]) + "</th>";
      h += "</tr>";
      for (i = 0; i < hang.length; i++) {
        r = hang[i]; c = "";
        if (op.loc) c = r[2] === "11A5" ? "khop" : "rac";
        else if (op.moi && i === hang.length - 1) c = "nay";
        h += "<tr" + (c ? ' class="' + c + '"' : "") + ">";
        for (j = 0; j < COT.length; j++) {
          h += j === 3 && op.mat ? '<td class="mh8-lech">(mất)</td>'
            : "<td" + (j === 0 ? ' class="mh8-khoa"' : "") + ">" + esc(r[j]) + "</td>";
        }
        h += "</tr>";
      }
      return h;
    }

    function bangTK() {
      var doi = daDoi(), i, h = "<tr><th>Tên trường</th><th>Kiểu dữ liệu</th><th>Ràng buộc</th></tr>";
      var T = [["MaTV", "Text (5)", "Khoá chính", 1], ["HoTen", "Text (40)", "Bắt buộc nhập", 0],
        ["Lop", "Text (5)", "&mdash;", 0],
        ["SoDT", doi ? "Number" : "Text (15)", doi ? "vừa đổi kiểu" : "&mdash;", 0]];
      for (i = 0; i < T.length; i++) {
        h += "<tr><td" + (T[i][3] ? ' class="mh8-khoa"' : "") + ">" + esc(T[i][0]) + "</td>" +
          "<td" + (doi && i === 3 ? ' class="mh8-lech"' : "") + ">" + esc(T[i][1]) + "</td>" +
          "<td>" + T[i][2] + "</td></tr>";
      }
      return h;
    }

    function manHinh(d) {
      var h, i;
      if (d.man === "tep") {
        h = "<tr><th>Tên đối tượng</th><th>Loại</th><th>Chứa dữ liệu?</th></tr>";
        var TN = ["THANHVIEN", "Nhap_ThanhVien", "Muon_QuaHan", "DS_ThanhVien"];
        for (i = 0; i < 4; i++) {
          h += "<tr><td>" + esc(TN[i]) + "</td><td>" + esc(DOI[i].t) + "</td>" +
            (i === 0 ? '<td class="mh8-khoa">CÓ</td>' : "<td>không</td>") + "</tr>";
        }
        return boc(h);
      }
      if (d.man === "bang") return boc(bangDL({}));
      if (d.man === "form") {
        h = '<tr><th colspan="2">Nhap_ThanhVien &mdash; bản ghi 2 / 3</th></tr>';
        for (i = 0; i < COT.length; i++) {
          h += '<tr><td class="mh8-khoa">' + esc(COT[i]) + "</td><td>" + esc(DL[1][i]) + "</td></tr>";
        }
        return boc(h);
      }
      if (d.man === "query") {
        return boc('<tr><th colspan="4">Điều kiện: Lop = "11A5"</th></tr>' + bangDL({ loc: 1 }));
      }
      if (d.man === "report") {
        h = '<tr><th colspan="3">DANH SÁCH THÀNH VIÊN CLB SÁCH</th></tr>' +
          "<tr><th>STT</th><th>Họ tên</th><th>Lớp</th></tr>";
        for (i = 0; i < DL.length; i++) {
          h += "<tr><td>" + (i + 1) + "</td><td>" + esc(DL[i][1]) + "</td><td>" + esc(DL[i][2]) +
            "</td></tr>";
        }
        return boc(h + '<tr class="nay"><td colspan="3">Tổng cộng: 3 thành viên</td></tr>');
      }
      if (d.man === "xoa") {
        return boc("<tr><th>Bảng THANHVIEN</th></tr>" +
          '<tr class="rac"><td>đã bị xoá &mdash; 3 bản ghi mất theo</td></tr>');
      }
      return boc(cd() ? bangTK() : bangDL({ them: daThem(), moi: buoc === 8, mat: daDoi() }));
    }

    function ve() {
      var d = BUOC[buoc], i, s = "", t;
      for (i = 0; i < DOI.length; i++) {
        t = d.p === 2 ? (i === 0 ? "nay" : "")
          : d.k ? d.k[i] : i === d.ob ? "nay" : i < d.ob ? "xong" : "cho";
        s += '<div class="mh9-tb ' + t + '"><b>' + esc(DOI[i].t) + "</b><small>" +
          esc(DOI[i].m) + "</small></div>";
      }
      o("do").innerHTML = s;

      if (d.p === 1) {
        o("nhan").textContent = d.nhan;
        o("dem").innerHTML = d.dem;
        o("out").innerHTML = d.out.charAt(0) === "@"
          ? '<div class="loi">' + esc(d.out.slice(1)) + "</div>" : esc(d.out);
      } else {
        o("nhan").textContent = "Bảng THANHVIEN — chế độ " + (cd() ? "thiết kế" : "trang dữ liệu");
        o("dem").innerHTML = "Bảng THANHVIEN &middot; chế độ <b>" +
          (cd() ? "THIẾT KẾ" : "TRANG DỮ LIỆU") + "</b> &middot; đang làm việc với " +
          (cd() ? "CẤU TRÚC" : "DỮ LIỆU");
        /* Vào sai chế độ ở bước có thao tác: phần mềm từ chối — đây là bài học chính. */
        if (d.bat && cd() !== d.cd) {
          o("out").innerHTML = cd()
            ? '<div class="loi">Không nhập được bản ghi ở đây.</div>Chế độ thiết kế không có dòng nào ' +
              "để gõ dữ liệu, nó chỉ khai báo cấu trúc. Bỏ tích ô ở trên để về chế độ trang dữ liệu."
            : '<div class="loi">Kiểu dữ liệu ở đây chỉ để xem.</div>Chế độ trang dữ liệu không đổi được ' +
              "cấu trúc. Tích ô ở trên để sang chế độ thiết kế.";
        } else if (cd() !== d.cd) {
          o("out").innerHTML = cd()
            ? '<div class="trong">Chế độ thiết kế: em đang nhìn CẤU TRÚC — tên trường, kiểu dữ liệu, ' +
              "ràng buộc, khoá chính. Sửa ở đây ảnh hưởng mọi bản ghi.</div>"
            : '<div class="trong">Chế độ trang dữ liệu: em đang nhìn DỮ LIỆU — mỗi dòng một bản ghi. ' +
              "Sửa ở đây chỉ động vào bản ghi đó.</div>";
        } else {
          o("out").innerHTML = d.out ? d.out.replace(/\n/g, "<br>") : "Đã mở bảng THANHVIEN.";
        }
      }
      o("man").innerHTML = manHinh(d);

      var canh = o("canh");
      canh.hidden = !d.canh;
      if (d.canh) canh.innerHTML = d.canh;
      var ghi = o("ghi");
      ghi.hidden = !d.ghi;
      ghi.className = "mh7-ghi" + (d.ghi ? " xong" : "");
      if (d.ghi) ghi.innerHTML = d.ghi;
    }

    o("tien").onclick = function () {
      if (buoc >= BUOC.length - 1) {
        loi("Hết bước rồi. Em tích / bỏ tích ô <b>chế độ thiết kế</b> ở trên để so lại hai màn hình, " +
          "hoặc bấm “Làm lại”.");
        return;
      }
      buoc++;
      /* Mỗi bước phần hai tự đặt đúng chế độ của nó, em vẫn tự đổi lại được sau đó. */
      if (BUOC[buoc].p === 2) oCd.checked = !!BUOC[buoc].cd;
      ve();
      loi(BUOC[buoc].giai);
    };

    oCd.onchange = function () {
      ve();
      loi(BUOC[buoc].p === 1
        ? "Ô chế độ này chỉ có tác dụng ở <b>phần hai</b>, khi đã mở một bảng ra. Em bấm “Bước tiếp” đi tiếp."
        : cd()
          ? "Đang ở <b>chế độ thiết kế</b>: em thấy <b>cấu trúc</b> — tên trường, kiểu dữ liệu, ràng " +
            "buộc, khoá chính. Không có bản ghi nào ở đây cả."
          : "Đang ở <b>chế độ trang dữ liệu</b>: em thấy <b>dữ liệu</b> — từng dòng là một bản ghi. Cấu " +
            "trúc thì chỉ đọc, không sửa được.");
    };

    function lamLai() { buoc = 0; oCd.checked = false; ve(); loi(BUOC[0].giai); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-06 · RÀNG BUỘC TOÀN VẸN VÀ DỮ LIỆU THAM CHIẾU (bản ứng dụng)
   *
   *  KHÁC hai minh hoạ đã có (ràng buộc bằng câu lệnh SQL ở đợt 8, khoá ngoài
   *  chặn xoá): ở đây KHÔNG viết câu lệnh nào. Mọi ràng buộc là thứ học sinh GÕ
   *  VÀO Ô THUỘC TÍNH TRƯỜNG ở chế độ thiết kế, rồi phần mềm tự áp cho mọi
   *  người nhập liệu về sau.
   * ================================================================ */
  MH.dangKy("U11-06", function (host) {
    var TONG = 8;
    var COT = ["ma", "ten", "lop", "diem", "dt", "em", "ng"];
    var TEN = ["ma_hs", "ho_ten", "ma_lop", "diem", "dien_thoai", "email", "ngay_muon"];
    var VTEXT = "Điểm phải từ 0 đến 10";     // Validation Text do người thiết kế tự viết

    function hai(n) { return (n < 10 ? "0" : "") + n; }
    /* Default Value = Date() lấy ngày THẬT của máy — mở lại hôm khác sẽ thấy
       ngày khác, đúng như trong phần mềm quản trị. */
    function homNay() {
      var d = new Date();
      return hai(d.getDate()) + "/" + hai(d.getMonth() + 1) + "/" + d.getFullYear();
    }

    var LOP_GOC = [
      { ma: "11A", ten: "11A - Tin học", gv: "Cô Hạnh" },
      { ma: "11B", ten: "11B - Ngữ văn", gv: "Thầy Kiên" },
      { ma: "11C", ten: "11C - Vật lí", gv: "Cô Nga" },
    ];
    var HS_GOC = [
      { ma: "HS01", ten: "Lê Vân An", lop: "11A", diem: "8.0", dt: "0912345671",
        em: "an.lv@thpt.vn", ng: "12/09/2025" },
      { ma: "HS02", ten: "Trần Gia Bình", lop: "11A", diem: "7.5", dt: "0912345672",
        em: "binh.tg@thpt.vn", ng: "12/09/2025" },
      { ma: "HS03", ten: "Vũ Ngọc Chi", lop: "11B", diem: "9.0", dt: "0912345673",
        em: "chi.vn@thpt.vn", ng: "13/09/2025" },
      { ma: "HS04", ten: "Phạm Mỹ Dung", lop: "11B", diem: "6.5", dt: "0912345674",
        em: "dung.pm@thpt.vn", ng: "13/09/2025" },
    ];

    var lop, hs, log, tk, qt, nhap, lech, out, canh, buoc, soChan;

    var node = MH.el(MH.khung("Ràng buộc gõ một lần lúc thiết kế — sai là phần mềm chặn ngay",
      "Bên trái là <b>bảng thuộc tính trường</b> em gõ <b>một lần</b> lúc thiết kế bảng. Bên phải là dữ " +
      "liệu người nhập gõ vào <b>hằng ngày</b>. Bấm “Bước tiếp” để thử nhập sai từng kiểu, xem ràng " +
      "buộc nào chặn lại và chặn bằng lời lẽ gì.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Chế độ thiết kế</p>' +
      '<table class="mh4-b" data-mh="tk"></table>' +
      '<div class="mh7-code" data-mh="qt" hidden style="margin-top:8px"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Người nhập gõ vào</p>' +
      '<table class="mh4-b" data-mh="nhap"></table>' +
      '<div class="mh10-out" data-mh="out" style="margin-top:8px"></div></div>' +
      "</div>" +
      '<p class="mh7-nhan" style="margin-top:11px">Bảng LOP</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="blop"></table></div>' +
      '<p class="mh7-nhan" style="margin-top:9px">Bảng HOC_SINH</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bhs"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ds" data-mh="ds" style="margin-top:9px"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="cas" checked> bật Xoá dây chuyền ' +
      "(Cascade Delete)</label>"));

    var loi = loiCua(node);
    function o(t) { return node.querySelector('[data-mh="' + t + '"]'); }
    var oCas = o("cas");

    /* MỘT bộ kiểm dùng chung cho mọi bước: mỗi bước chỉ đưa một bản ghi vào,
       chính hàm này quyết định nhận hay chặn — không bước nào viết sẵn kết quả. */
    function kiem(r) {
      var i, d;
      if (String(r.ten).replace(/\s+/g, "") === "") {
        return { rb: "Bắt buộc nhập (Required)", tr: "ho_ten",
          bao: "Trường 'ho_ten' không được để trống. Hãy nhập giá trị rồi lưu bản ghi." };
      }
      d = parseFloat(r.diem);
      if (isNaN(d) || d < 0 || d > 10) {
        return { rb: "Quy tắc kiểm tra (Validation Rule)", tr: "diem", bao: VTEXT };
      }
      if (!/^[0-9]{10}$/.test(r.dt)) {
        return { rb: "Mặt nạ nhập (Input Mask)", tr: "dien_thoai",
          bao: "Giá trị vừa nhập không hợp với mặt nạ 0000000000 — phải đủ 10 chữ số." };
      }
      for (i = 0; i < hs.length; i++) {
        if (hs[i].cls !== "xoa" && hs[i].em === r.em) {
          return { rb: "Chỉ mục không trùng (Indexed - No Duplicates)", tr: "email",
            bao: "Không thêm được bản ghi: giá trị trùng lặp ở chỉ mục đã đặt là 'không trùng'." };
        }
      }
      for (i = 0; i < lop.length; i++) if (lop[i].cls !== "xoa" && lop[i].ma === r.lop) return null;
      return { rb: "Toàn vẹn tham chiếu", tr: "ma_lop",
        bao: "Không thêm được bản ghi: cần có bản ghi tương ứng trong bảng LOP." };
    }

    function xoaNhan() {
      var i;
      for (i = 0; i < hs.length; i++) { if (hs[i].cls !== "xoa") hs[i].cls = ""; }
      for (i = 0; i < lop.length; i++) { if (lop[i].cls !== "xoa") lop[i].cls = ""; }
    }
    function demHS() {
      var n = 0, i;
      for (i = 0; i < hs.length; i++) if (hs[i].cls !== "xoa") n++;
      return n;
    }
    /* Thử ghi một bản ghi: nếu hợp lệ thì áp Default Value rồi đưa vào bảng. */
    function thuGhi(r, nhat) {
      var k = kiem(r);
      nhap = r; lech = k ? k.tr : "";
      if (k) {
        soChan++;
        out = [{ t: "Phần mềm không lưu bản ghi" }, { t: k.bao, loi: 1 },
          { t: "Ràng buộc đã chặn: " + k.rb }];
        log.push({ t: k.rb, s: nhat });
      } else {
        if (r.ng === "") r.ng = homNay();     // Default Value điền hộ, người nhập khỏi gõ
        r.cls = "khop";
        hs.push(r);
        out = [{ t: "Đã lưu bản ghi " + r.ma + " vào bảng HOC_SINH" },
          { t: "ngay_muon để trống -> tự điền " + r.ng }];
        log.push({ t: "Giá trị mặc định (Default Value)", s: nhat });
      }
    }

    function ve() {
      var h, i, r;

      h = '<tr><th colspan="2">' + esc(tk.nhan) + "</th></tr>";
      for (i = 0; i < tk.ds.length; i++) {
        h += '<tr class="' + (tk.ds[i][2] ? "nay" : "") + '"><td>' + esc(tk.ds[i][0]) +
          "</td><td>" + esc(tk.ds[i][1]) + "</td></tr>";
      }
      o("tk").innerHTML = h;

      o("qt").hidden = !qt.length;
      o("qt").innerHTML = qt.map(function (d) {
        return '<div class="mh7-d' + (d[1] ? " nay" : " mo") + '">' + esc(d[0]) + "</div>";
      }).join("");

      h = "<tr><th>Trường</th><th>Giá trị gõ vào</th></tr>";
      if (!nhap) h += '<tr><td colspan="2">(bước này không nhập bản ghi mới)</td></tr>';
      else {
        for (i = 0; i < COT.length; i++) {
          h += "<tr><td>" + esc(TEN[i]) + "</td><td" + (lech === TEN[i] ? ' class="mh8-lech"' : "") +
            ">" + esc(nhap[COT[i]] === "" ? "(để trống)" : nhap[COT[i]]) + "</td></tr>";
        }
      }
      o("nhap").innerHTML = h;

      o("out").innerHTML = out.map(function (d) {
        return "<div" + (d.loi ? ' class="loi"' : "") + ">" + esc(d.t) + "</div>";
      }).join("");

      h = '<tr><th class="mh8-khoa">ma_lop</th><th>ten_lop</th><th>gvcn</th></tr>';
      for (i = 0; i < lop.length; i++) {
        h += '<tr class="' + esc(lop[i].cls) + '"><td class="mh8-khoa">' + esc(lop[i].ma) +
          "</td><td>" + esc(lop[i].ten) + "</td><td>" + esc(lop[i].gv) + "</td></tr>";
      }
      o("blop").innerHTML = h;

      h = "<tr>";
      for (i = 0; i < TEN.length; i++) {
        h += "<th" + (i === 0 || i === 2 ? ' class="mh8-khoa"' : "") + ">" + TEN[i] + "</th>";
      }
      h += "</tr>";
      for (i = 0; i < hs.length; i++) {
        r = hs[i];
        h += '<tr class="' + esc(r.cls) + '">';
        for (var j = 0; j < COT.length; j++) {
          h += "<td" + (j === 0 || j === 2 ? ' class="mh8-khoa"' : "") + ">" + esc(r[COT[j]]) + "</td>";
        }
        h += "</tr>";
      }
      o("bhs").innerHTML = h;

      o("dem").innerHTML = "Bảng LOP: <b>" + lop.length + "</b> · HOC_SINH: <b>" + demHS() +
        "</b> bản ghi · bị ràng buộc chặn: <b>" + soChan + "</b>";

      o("canh").hidden = !canh;
      if (canh) o("canh").innerHTML = canh;

      o("ds").innerHTML = log.map(function (m, i2) {
        return '<div class="mh7-m' + (i2 === log.length - 1 ? " nay" : "") + '"><b class="van">' +
          esc(m.t) + "</b><small>" + esc(m.s) + "</small></div>";
      }).join("");

      var ghi = o("ghi");
      ghi.hidden = buoc < TONG;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Chốt lại: sáu ràng buộc vừa rồi đều <b>gõ một lần lúc thiết kế</b>, sau đó " +
          "<b>áp cho mọi người nhập liệu, mọi lúc</b> — chắc hơn hẳn dặn miệng “nhớ nhập cẩn thận”, vì " +
          "lời dặn thì người quên, người nghỉ, người mới vào chưa nghe. <b>Bắt buộc nhập</b> chặn ô " +
          "trống; <b>quy tắc kiểm tra</b> chặn giá trị ngoài miền và báo bằng <b>câu do em tự viết</b>; " +
          "<b>giá trị mặc định</b> điền hộ để bớt gõ, bớt sai; <b>mặt nạ nhập</b> ép đúng khuôn dạng; " +
          "<b>không trùng</b> giữ email duy nhất dù nó chẳng phải khoá chính; <b>toàn vẹn tham chiếu</b> " +
          "cấm trỏ tới lớp không có thật. Riêng hai lựa chọn dây chuyền phải cân nhắc: <b>cập nhật dây " +
          "chuyền</b> gần như luôn nên bật, còn <b>xoá dây chuyền rất nguy hiểm</b> — một cú xoá lớp là " +
          "bay sạch học sinh của lớp đó, phần mềm <b>không hỏi lại từng em</b> và Ctrl+Z không cứu được.";
      }
    }

    o("tien").onclick = function () {
      if (buoc >= TONG) {
        loi("Đã đi hết <b>" + TONG + "</b> bước. Bấm “Làm lại”, hoặc đổi ô tick ở trên rồi xem lại bước " +
          "cuối.");
        return;
      }
      buoc++;
      canh = ""; qt = []; xoaNhan();
      var i, n = 0;

      if (buoc === 1) {
        tk = { nhan: "Thuộc tính trường — ho_ten", ds: [["Kiểu dữ liệu", "Văn bản ngắn", 0],
          ["Cỡ trường", "50", 0], ["Bắt buộc (Required)", "Có", 1], ["Cho phép dài rỗng", "Không", 0]] };
        thuGhi({ ma: "HS05", ten: "", lop: "11A", diem: "8.5", dt: "0912345675",
          em: "my.nh@thpt.vn", ng: "" }, "Bỏ trống ho_ten -> không lưu được");
        loi("Em gõ <b>Có</b> vào ô <b>Bắt buộc</b> của trường <code>ho_ten</code> lúc thiết kế. Giờ có " +
          "người nhập vội, bỏ trống họ tên rồi bấm lưu — phần mềm <b>không lưu</b>. Cả bản ghi bị giữ " +
          "lại chứ không phải lưu tạm rồi sửa sau.");
      } else if (buoc === 2) {
        tk = { nhan: "Thuộc tính trường — diem", ds: [["Kiểu dữ liệu", "Số", 0],
          ["Quy tắc kiểm tra", ">= 0 And <= 10", 1], ["Thông báo lỗi", VTEXT, 1],
          ["Bắt buộc", "Có", 0]] };
        qt = [["Validation Rule:  diem >= 0 And diem <= 10", 1], ["Validation Text:  " + VTEXT, 1]];
        thuGhi({ ma: "HS05", ten: "Nguyễn Hà My", lop: "11A", diem: "12", dt: "0912345675",
          em: "my.nh@thpt.vn", ng: "" }, "Điểm 12 nằm ngoài 0..10");
        loi("Họ tên đã có nên qua được cửa thứ nhất, nhưng điểm gõ <b>12</b>. Phần mềm mang 12 ra so với " +
          "biểu thức <code>diem &gt;= 0 And diem &lt;= 10</code> → không thoả → chặn. Chú ý câu báo lỗi: " +
          "đó là <b>Thông báo lỗi do chính em viết</b> lúc thiết kế, nên học sinh đọc là hiểu ngay phải " +
          "sửa gì. Nếu để trống ô này, phần mềm sẽ báo bằng một câu kĩ thuật khó hiểu.");
      } else if (buoc === 3) {
        tk = { nhan: "Thuộc tính trường — ngay_muon", ds: [["Kiểu dữ liệu", "Ngày/Giờ", 0],
          ["Giá trị mặc định", "Date()", 1], ["Định dạng", "dd/mm/yyyy", 0], ["Bắt buộc", "Không", 0]] };
        qt = [["Default Value:  Date()", 1], ["-> tự điền ngày hôm nay: " + homNay(), 0]];
        thuGhi({ ma: "HS05", ten: "Nguyễn Hà My", lop: "11A", diem: "8.5", dt: "0912345675",
          em: "my.nh@thpt.vn", ng: "" }, "Sửa điểm còn 8.5 -> bản ghi được lưu");
        loi("Sửa điểm còn <b>8.5</b> là lọt. Để ý ô <code>ngay_muon</code>: người nhập <b>không gõ gì " +
          "cả</b>, phần mềm tự điền <b>" + esc(homNay()) + "</b> nhờ <b>Giá trị mặc định = Date()</b>. " +
          "Giá trị mặc định không phải để làm đẹp — mỗi ô khỏi phải gõ là bớt một chỗ gõ sai, mà ngày " +
          "tháng thì cực dễ gõ sai.");
      } else if (buoc === 4) {
        tk = { nhan: "Thuộc tính trường — dien_thoai", ds: [["Kiểu dữ liệu", "Văn bản ngắn", 0],
          ["Mặt nạ nhập", "0000000000", 1], ["Cỡ trường", "10", 0], ["Bắt buộc", "Có", 0]] };
        qt = [["Input Mask:  0000000000", 1], ["Người nhập gõ:  09abc12", 0],
          ["Ô nhận được:    0912  (chữ bị chặn ngay khi gõ)", 0]];
        thuGhi({ ma: "HS06", ten: "Trần Văn Đô", lop: "11B", diem: "7.0",
          dt: "09abc12".replace(/[^0-9]/g, ""), em: "do.tv@thpt.vn", ng: "" },
        "Mặt nạ chỉ nhận chữ số, thiếu số");
        loi("Mặt nạ <b>0000000000</b> nghĩa là mười vị trí, mỗi vị trí <b>chỉ nhận một chữ số</b>. Người " +
          "nhập gõ <code>09abc12</code> thì ba chữ cái <b>không vào được ô</b> — bàn phím như bị kệ. Còn " +
          "lại <b>" + esc("09abc12".replace(/[^0-9]/g, "")) + "</b>, chưa đủ mười, nên vẫn bị chặn. Mặt " +
          "nạ chặn <b>ngay lúc gõ</b>, sớm hơn quy tắc kiểm tra.");
      } else if (buoc === 5) {
        tk = { nhan: "Thuộc tính trường — email", ds: [["Kiểu dữ liệu", "Văn bản ngắn", 0],
          ["Chỉ mục (Indexed)", "Có - Không trùng", 1], ["Bắt buộc", "Có", 0],
          ["Là khoá chính?", "Không", 0]] };
        thuGhi({ ma: "HS06", ten: "Trần Văn Đô", lop: "11B", diem: "7.0", dt: "0987654321",
          em: "binh.tg@thpt.vn", ng: "" }, "Email trùng bản ghi đã có");
        loi("Số điện thoại đã đúng khuôn, nhưng email lại <b>trùng với HS02</b>. Phần mềm dò khắp cột " +
          "<code>email</code> rồi chặn. Điều đáng nhớ: <code>email</code> <b>không phải khoá chính</b> " +
          "(khoá chính là <code>ma_hs</code>), vậy mà vẫn buộc được duy nhất — chỉ cần đặt <b>Chỉ mục = " +
          "Có, không trùng</b>. Một bảng có <b>một</b> khoá chính nhưng <b>nhiều</b> trường không trùng.");
      } else if (buoc === 6) {
        tk = { nhan: "Cửa sổ Quan hệ — LOP 1—nhiều HOC_SINH",
          ds: [["Khoá chính", "LOP.ma_lop", 0], ["Khoá ngoài", "HOC_SINH.ma_lop", 0],
            ["Thực thi toàn vẹn tham chiếu", "Có", 1], ["Cập nhật dây chuyền", "Có", 0],
            ["Xoá dây chuyền", oCas.checked ? "Có" : "Không", 0]] };
        thuGhi({ ma: "HS06", ten: "Trần Văn Đô", lop: "11D", diem: "7.0", dt: "0987654321",
          em: "do.tv2@thpt.vn", ng: "" }, "Mã lớp 11D không có trong bảng LOP");
        loi("Email đã riêng, nhưng <code>ma_lop</code> gõ <b>11D</b> — phần mềm dò bảng LOP, <b>không " +
          "thấy</b> mã này nên chặn. Đây là <b>toàn vẹn tham chiếu</b>: mọi giá trị ở khoá ngoài phải " +
          "<b>có thật</b> bên bảng được trỏ tới. Nhờ nó, cơ sở dữ liệu không bao giờ có học sinh học một " +
          "lớp không tồn tại.");
      } else if (buoc === 7) {
        tk = { nhan: "Cửa sổ Quan hệ — LOP 1—nhiều HOC_SINH",
          ds: [["Thực thi toàn vẹn tham chiếu", "Có", 0],
            ["Cập nhật dây chuyền (Cascade Update)", "Có", 1],
            ["Xoá dây chuyền", oCas.checked ? "Có" : "Không", 0]] };
        nhap = null; lech = "";
        for (i = 0; i < hs.length; i++) {
          if (hs[i].cls !== "xoa" && hs[i].lop === "11A") { hs[i].lop = "11A1"; hs[i].cls = "khop"; n++; }
        }
        for (i = 0; i < lop.length; i++) {
          if (lop[i].ma === "11A") { lop[i].ma = "11A1"; lop[i].ten = "11A1 - Tin học"; lop[i].cls = "nay"; }
        }
        out = [{ t: "Sửa LOP.ma_lop: 11A -> 11A1" },
          { t: "Cập nhật dây chuyền: " + n + " bản ghi HOC_SINH tự đổi theo" }];
        log.push({ t: "Cập nhật dây chuyền (Cascade Update)",
          s: "Đổi mã lớp, " + n + " học sinh đổi theo" });
        loi("Nhà trường đổi tên lớp <b>11A</b> thành <b>11A1</b>. Em chỉ sửa <b>một ô</b> bên bảng LOP, " +
          "và <b>" + n + "</b> học sinh bên HOC_SINH <b>tự đổi theo</b> — con số này đếm thật từ bảng. " +
          "Nếu <b>tắt</b> cập nhật dây chuyền, phần mềm sẽ <b>không cho sửa</b> vì sửa xong thì " + n +
          " học sinh kia trỏ vào lớp không còn tồn tại. Lựa chọn này gần như luôn nên bật.");
      } else {
        tk = { nhan: "Cửa sổ Quan hệ — LOP 1—nhiều HOC_SINH",
          ds: [["Thực thi toàn vẹn tham chiếu", "Có", 0], ["Cập nhật dây chuyền", "Có", 0],
            ["Xoá dây chuyền (Cascade Delete)", oCas.checked ? "Có" : "Không", 1]] };
        nhap = null; lech = "";
        for (i = 0; i < hs.length; i++) if (hs[i].cls !== "xoa" && hs[i].lop === "11B") n++;
        if (!oCas.checked) {
          soChan++;
          for (i = 0; i < hs.length; i++) {
            if (hs[i].cls !== "xoa" && hs[i].lop === "11B") hs[i].cls = "nay";
          }
          out = [{ t: "Xoá bản ghi 11B khỏi bảng LOP" },
            { t: "Không xoá được: bảng HOC_SINH còn " + n + " bản ghi liên quan.", loi: 1 }];
          canh = "<b>Xoá dây chuyền đang TẮT.</b> Toàn vẹn tham chiếu <b>chặn</b> cú xoá, vì xoá lớp 11B " +
            "thì <b>" + n + "</b> học sinh sẽ mồ côi lớp. Muốn xoá thật thì phải xử lí " + n +
            " bản ghi con trước — chậm hơn, nhưng em <b>nhìn thấy</b> mình sắp mất những gì.";
          log.push({ t: "Xoá bị chặn (chưa bật dây chuyền)", s: "Còn " + n + " bản ghi con" });
          loi("Em chọn lớp <b>11B</b> rồi bấm Xoá. Vì ô tick ở trên <b>đang tắt</b>, phần mềm <b>từ " +
            "chối</b> và chỉ rõ còn <b>" + n + "</b> bản ghi liên quan. Hãy <b>tích lại ô đó</b> rồi " +
            "chạy lại để thấy đầu kia của lựa chọn.");
        } else {
          for (i = 0; i < hs.length; i++) {
            if (hs[i].cls !== "xoa" && hs[i].lop === "11B") hs[i].cls = "xoa";
          }
          for (i = 0; i < lop.length; i++) if (lop[i].ma === "11B") lop[i].cls = "xoa";
          out = [{ t: "Đã xoá 1 bản ghi khỏi bảng LOP" },
            { t: "Xoá dây chuyền: đã xoá luôn " + n + " bản ghi HOC_SINH", loi: 1 },
            { t: "Ctrl+Z không lấy lại được" }];
          canh = "<b>Xoá dây chuyền rất nguy hiểm.</b> Một cú xoá <b>một</b> dòng bên LOP vừa kéo theo " +
            "<b>" + n + "</b> học sinh biến mất, và phần mềm <b>không hỏi lại từng em</b> — nó chỉ hỏi " +
            "một câu duy nhất lúc đầu. Ở đây mới " + n + " bạn nên còn đếm được; lớp thật 40 bạn thì chỉ " +
            "một lần bấm nhầm là mất sạch. Hãy <b>sao lưu trước khi xoá</b>.";
          log.push({ t: "Xoá dây chuyền (Cascade Delete)",
            s: "Xoá 1 lớp, mất luôn " + n + " học sinh" });
          loi("Ô tick <b>đang bật</b>, nên xoá lớp <b>11B</b> là <b>" + n + "</b> học sinh bị gạch theo " +
            "— số này đếm thật từ bảng, không viết sẵn. Bảng HOC_SINH còn <b>" + demHS() + "</b> bản " +
            "ghi. Đọc kĩ khối đỏ và khối kết luận bên dưới.");
        }
      }
      ve();
    };

    function lamLai() {
      lop = LOP_GOC.map(function (x) { return { ma: x.ma, ten: x.ten, gv: x.gv, cls: "" }; });
      hs = HS_GOC.map(function (x) {
        return { ma: x.ma, ten: x.ten, lop: x.lop, diem: x.diem, dt: x.dt, em: x.em, ng: x.ng, cls: "" };
      });
      log = []; buoc = 0; soChan = 0; canh = ""; nhap = null; lech = ""; qt = [];
      out = [{ t: "(chưa có thao tác nào)" }];
      tk = { nhan: "Chế độ thiết kế bảng HOC_SINH",
        ds: [["Trường", "ma_hs, ho_ten, ma_lop, ...", 0], ["Khoá chính", "ma_hs", 0],
          ["Ràng buộc đã đặt", "6 loại — xem từng bước", 1]] };
      ve();
      loi("Bấm “Bước tiếp” để thử nhập sai kiểu thứ nhất.");
    }

    ganDatLai(node, [oCas], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U12-07 · HOÀN THIỆN VÀ KIỂM THỬ TRANG WEB
   *
   *  NGỘ NHẬN đắt nhất: "trang mở được trên máy em" = "trang chạy đúng". Sai
   *  đường dẫn, thiếu alt, bố cục vỡ trên điện thoại, ảnh chưa nén — KHÔNG lỗi
   *  nào làm trang báo lỗi, nên nhìn qua rồi gật là bỏ sót sạch. Cách trị: chạy
   *  đúng một DANH SÁCH, mỗi hạng mục hai nhịp (phát hiện lỗi rồi sửa), số hạng
   *  mục ĐẠT đếm thật từ trạng thái chứ không gán cứng.
   * ================================================================ */
  MH.dangKy("U12-07", function (host) {
    var KB_TRUOC = 5120, KB_SAU = 200, MANG = 500;   // KB ảnh gốc · KB sau nén · KB/s
    function so(n) { return n % 1 === 0 ? String(n) : n.toFixed(1).replace(".", ","); }

    /* Không tải ảnh thật (app phải chạy được khi mất mạng): ô ảnh vẽ bằng khung
       viền — đứt nét đỏ là ảnh vỡ, liền nét là ảnh hiện đúng. */
    function oAnh(hong, ten, chu) {
      return '<div style="padding:13px;text-align:center;border-radius:6px;' +
        'font:600 11.5px var(--font-mono);' +
        (hong ? "border:1.5px dashed #c05252;background:#fff5f5;color:#a33"
          : "border:1px solid #9aa0aa;background:#e6ebf2;color:#3c4250") + '">' +
        esc(ten) + "<br>" + esc(chu) + "</div>";
    }
    function bangLich(rong) {
      var d = [["Thứ 3", "Học HTML", "P.201", "Cô Hà"], ["Thứ 5", "Học CSS", "P.203", "Thầy Nam"]];
      var t = '<table style="width:' + rong + '"><tr><th>Buổi</th><th>Nội dung</th><th>Phòng</th>' +
        "<th>Phụ trách</th></tr>";
      d.forEach(function (r) {
        t += "<tr>";
        r.forEach(function (o) { t += "<td>" + esc(o) + "</td>"; });
        t += "</tr>";
      });
      return t + "</table>";
    }

    /* Mỗi hạng mục tự khai: trang hiện ra sao (trước/sau khi sửa), nhật kí công
       cụ in gì, và hai câu giải thích cho hai nhịp. Thêm bớt hạng mục không phải
       đụng vào phần điều khiển bên dưới. */
    var HANG = [
      { ten: "Liên kết chết", mo: "bấm thử mọi href", tab: "index.html",
        trang: function () {
          return "<h1>CLB Tin học 12A1</h1><p>Chọn nội dung để xem:</p><ul>" +
            "<li><a>Bài 1 — HTML</a></li><li><a>Bài 2 — CSS</a></li><li><a>Liên hệ</a></li></ul>";
        },
        nhat: function (ok) {
          return ok
            ? [{ d: "bai-1.html — 200 OK" }, { d: "bai-2.html — 200 OK" },
              { d: "lien-he.html — 200 OK" }, { d: "3/3 liên kết mở được" }]
            : [{ d: "quét 3 liên kết trong index.html" }, { d: "bai-1.html — 200 OK" },
              { d: "bai-3.html — 404 KHÔNG TÌM THẤY", l: 1 },
              { d: 'href="" — liên kết bỏ trống, bấm vào chỉ tải lại chính trang này', l: 1 },
              { d: "1/3 liên kết mở được", l: 1 }];
        },
        kiem: "Công cụ bấm thử <b>từng</b> liên kết: <code>bai-3.html</code> trả về <b>404</b> (tệp thật " +
          "tên <code>bai-2.html</code>), còn “Liên hệ” để <code>href=\"\"</code> rỗng. Nhìn sang trang " +
          "bên phải: <b>ba liên kết vẫn xanh gạch chân y hệt nhau</b> — gõ sai đường dẫn <b>không báo " +
          "lỗi lúc viết</b>, nó chỉ lộ ra khi có người bấm vào.",
        sua: "Sửa <code>bai-3.html</code> thành <code>bai-2.html</code>, điền <code>lien-he.html</code> " +
          "vào href rỗng, quét lại: 3/3 mở được. Hạng mục 1 chuyển sang <b>ĐẠT</b>." },

      { ten: "Ảnh không hiện", mo: "src sai, thiếu alt", tab: "index.html",
        trang: function (ok) {
          return "<h1>CLB Tin học 12A1</h1>" +
            (ok ? oAnh(0, "anh-san-truong.jpg", 'alt="Sân trường giờ ra chơi"')
              : oAnh(1, "anh-truong.jpg", "ô ảnh vỡ — không có chữ alt để đọc thay")) +
            "<p>Buổi sinh hoạt đầu tiên của câu lạc bộ.</p>";
        },
        nhat: function (ok) {
          return ok
            ? [{ d: '<img src="anh/anh-san-truong.jpg" alt="Sân trường giờ ra chơi">' },
              { d: "ảnh tải được — trình đọc màn hình đọc: “Sân trường giờ ra chơi”" }]
            : [{ d: '<img src="anh-truong.jpg"> — 404, tệp thật là anh/anh-san-truong.jpg', l: 1 },
              { d: "<img> thiếu thuộc tính alt", l: 1 },
              { d: "trình đọc màn hình chỉ đọc được: “hình ảnh”", l: 1 }];
        },
        kiem: "Hai lỗi khác hẳn nhau. Một: <code>src</code> trỏ sai tên tệp nên ô ảnh vỡ. Hai: thẻ " +
          "&lt;img&gt; <b>thiếu <code>alt</code></b> — trang <b>vẫn chạy bình thường</b>, không lỗi gì, " +
          "nên rất dễ bỏ qua. Nhưng <code>alt</code> là chữ thay thế khi ảnh không tải được, và là thứ " +
          "<b>trình đọc màn hình</b> đọc cho người khiếm thị. Bỏ <code>alt</code> là bỏ rơi hẳn một nhóm " +
          "người dùng.",
        sua: "Chép ảnh vào thư mục <code>anh/</code>, sửa <code>src</code> cho đúng, thêm " +
          "<code>alt=\"Sân trường giờ ra chơi\"</code>. Hạng mục 2: <b>ĐẠT</b>." },

      { ten: "Hiển thị trên điện thoại", mo: "tràn ngang, chữ bé tí", tab: "lich.html",
        trang: function (ok) {
          return "<h1>Lịch sinh hoạt</h1>" + bangLich(ok ? "100%" : "900px") +
            (ok ? "<p>Bảng rộng được bọc trong khối cuộn ngang riêng.</p>" : "");
        },
        nhat: function (ok) {
          return ok
            ? [{ d: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
              { d: "bảng chuyển sang width:100%, đặt trong khối cuộn ngang" },
              { d: "nội dung vừa khung 360px — không phải kéo ngang" }]
            : [{ d: '<head> thiếu <meta name="viewport">', l: 1 },
              { d: "điện thoại tự thu nhỏ cả trang cho vừa -> chữ bé tí", l: 1 },
              { d: "bảng cứng 900px > khung máy 360px — tràn ngang, bị cắt mất", l: 1 }];
        },
        kiem: "Đổi ô chọn phía trên sang <b>màn hình điện thoại</b> mà xem: bảng đặt cứng " +
          "<code>width:900px</code> nên tràn hẳn ra ngoài, lại thiếu " +
          "<code>&lt;meta name=\"viewport\"&gt;</code> nên điện thoại thu cả trang lại, chữ nhỏ đến mức " +
          "không đọc nổi. Trên máy tính của em <b>hai lỗi này không hề xuất hiện</b>.",
        sua: "Thêm <code>meta viewport</code> vào &lt;head&gt;, cho bảng <code>width:100%</code> và bọc " +
          "trong khối cuộn ngang. Đổi ô chọn sang điện thoại lần nữa để thấy khác biệt. Hạng mục 3: " +
          "<b>ĐẠT</b>.",
        canh: "<b>Trang mở được trên máy em không có nghĩa là nó chạy đúng.</b> Màn hình của em rộng, " +
          "mạng của em nhanh, trình duyệt của em mới — phần lớn người xem thì không như vậy." },

      { ten: "Tương thích trình duyệt", mo: "thử trên nhiều trình duyệt", tab: "index.html",
        trang: function () {
          return "<h1>CLB Tin học 12A1</h1>" +
            oAnh(0, "anh-san-truong.jpg", 'alt="Sân trường giờ ra chơi"') +
            "<p>Sinh hoạt chiều thứ 3 và thứ 5 hàng tuần.</p>";
        },
        nhat: function (ok) {
          return ok
            ? [{ d: "Chrome 126 — hiển thị đúng" }, { d: "Firefox 127 — hiển thị đúng" },
              { d: "Safari (iPhone) — hiển thị đúng" },
              { d: "Edge bản cũ (máy phòng tin) — hiển thị đúng" },
              { d: "4/4 trình duyệt hiển thị đúng" }]
            : [{ d: "Chrome 126 — hiển thị đúng" }, { d: "Firefox 127 — hiển thị đúng" },
              { d: "Safari (iPhone) — chân trang chồng lên nội dung", l: 1 },
              { d: "Edge bản cũ (máy phòng tin) — cả khối bố cục xếp lệch", l: 1 },
              { d: "2/4 trình duyệt hiển thị đúng", l: 1 }];
        },
        kiem: "Vẫn <b>một tệp HTML duy nhất</b>: khung bên phải (trình duyệt của em) hiện đúng, nhưng mở " +
          "bằng bốn trình duyệt thì <b>hai cái vỡ</b> — xem nhật kí. Mỗi trình duyệt hiểu CSS hơi khác " +
          "nhau, bản cũ lại chưa hỗ trợ thuộc tính mới. Đừng chỉ thử trên đúng một trình duyệt của mình " +
          "rồi kết luận là xong.",
        sua: "Bỏ thuộc tính CSS quá mới, viết thêm cách dự phòng cho bản cũ, thử lại đủ bốn nơi: 4/4 " +
          "đúng. Hạng mục 4: <b>ĐẠT</b>." },

      { ten: "Chính tả và nội dung", mo: "lỗi gõ, thông tin cũ", tab: "gioi-thieu.html",
        trang: function (ok) {
          return "<h1>Giới thiệu</h1>" + (ok
            ? "<p>Câu lạc bộ Tin học sinh hoạt vào thứ 5 hàng tuần tại phòng 203.</p>" +
              "<p>Học phí: miễn phí. Số thành viên: 32.</p><p>Cập nhật lần cuối: 20/05/2026.</p>"
            : "<p>Câu lạc bộ Tin hoc sinh hoat vào thứ 5 hàng tuàn tại phòng 203.</p>" +
              "<p>Học phí: miễn phí. Số thành viên: 12 (số liệu năm 2019).</p>");
        },
        nhat: function (ok) {
          return ok
            ? [{ d: "sửa 3 lỗi gõ · cập nhật số thành viên 12 -> 32" },
              { d: "đã thêm dòng “Cập nhật lần cuối”" }]
            : [{ d: 'lỗi gõ: "Tin hoc", "sinh hoat", "hàng tuàn"', l: 1 },
              { d: "thông tin cũ: số thành viên vẫn là số liệu năm 2019", l: 1 },
              { d: "trang không ghi ngày cập nhật", l: 1 }];
        },
        kiem: "Máy <b>không bắt lỗi giúp em</b>: chính tả sai, số liệu cũ thì trang vẫn chạy trơn tru. " +
          "Người xem lại đánh giá độ tin cậy của trang qua đúng mấy thứ đó. Không có ngày cập nhật thì " +
          "họ cũng không biết thông tin còn dùng được nữa hay không.",
        sua: "Sửa chính tả, cập nhật số liệu, thêm dòng ngày cập nhật. Hạng mục 5: <b>ĐẠT</b>." },

      { ten: "Tốc độ tải trang", mo: "ảnh chưa nén", tab: "index.html",
        trang: function (ok) {
          return "<h1>CLB Tin học 12A1</h1>" +
            (ok ? oAnh(0, "anh-san-truong.jpg", KB_SAU + " KB — đã nén, 1200×800")
              : oAnh(1, "anh-truong.jpg", so(KB_TRUOC / 1024) + " MB — ảnh gốc chụp bằng điện thoại")) +
            "<p>Buổi sinh hoạt đầu tiên của câu lạc bộ.</p>";
        },
        nhat: function (ok) {
          var kb = ok ? KB_SAU : KB_TRUOC, giay = kb / MANG;   // thời gian tính thật từ cỡ tệp
          return [{ d: "cỡ tệp ảnh: " + kb + " KB", l: ok ? 0 : 1 },
            { d: "mạng 3G ~" + MANG + " KB/s -> tải hết " + so(giay) + " giây", l: giay > 3 ? 1 : 0 },
            { d: ok ? "trang hiện gần như tức thì" : "người xem bỏ đi trước khi ảnh kịp hiện",
              l: ok ? 0 : 1 }];
        },
        kiem: "Ảnh chụp bằng điện thoại nặng <b>" + so(KB_TRUOC / 1024) + " MB</b>, nhét thẳng vào " +
          "trang. Trên máy em, tệp nằm ngay ổ cứng nên thấy nhanh; qua mạng 3G thì mất <b>" +
          so(KB_TRUOC / MANG) + " giây</b> chỉ để hiện một tấm ảnh. Ảnh chưa nén là <b>nguyên nhân số " +
          "một</b> làm trang tải chậm.",
        sua: "Nén ảnh còn <b>" + KB_SAU + " KB</b>: " + KB_TRUOC + " ÷ " + KB_SAU + " = <b>" +
          so(KB_TRUOC / KB_SAU) + " lần</b> nhẹ hơn, thời gian tải từ " + so(KB_TRUOC / MANG) +
          " giây xuống " + so(KB_SAU / MANG) + " giây. Hạng mục 6: <b>ĐẠT</b>." },
    ];

    var TONG = HANG.length * 2;   // chỉ số bước "tổng kết", nằm sau mọi nhịp
    var b;                        // -1 = chưa kiểm hạng mục nào

    var node = MH.el(MH.khung("Chạy danh sách kiểm thử trước khi đưa trang lên mạng",
      "Trang web của nhóm em <b>đã làm xong</b> và mở được trên máy em. Nhưng “mở được” chưa phải là " +
      "“chạy đúng”. Bấm “Bước tiếp” để soát <b>từng hạng mục một</b>: phát hiện lỗi, sửa, xong mới đánh " +
      "dấu ĐẠT. Bấm vào một hạng mục ở cột trái để nhảy thẳng tới nó.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Danh sách kiểm thử</p>' +
      '<div class="mh7-ds" data-mh="ds"></div><p class="mh8-dem" data-mh="dem"></p></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trang đang kiểm</p>' +
      '<div class="mh7-xem" data-mh="xem"><div class="mh7-tab"><i></i><span data-mh="tab"></span></div>' +
      '<div class="mh7-noi" data-mh="noi"></div></div>' +
      '<p class="mh7-nhan" style="margin-top:9px">Nhật kí công cụ kiểm thử</p>' +
      '<div class="mh10-out" data-mh="log"></div></div></div>' +
      '<div data-mh="bang" style="margin-top:11px" hidden></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick">Xem thử trên: <select data-mh="mh">' +
      '<option value="rong">màn hình rộng</option><option value="dt">màn hình điện thoại</option>' +
      "</select></label>"));

    var loi = loiCua(node);
    var oDs = node.querySelector('[data-mh="ds"]'), oDem = node.querySelector('[data-mh="dem"]');
    var oTab = node.querySelector('[data-mh="tab"]'), oNoi = node.querySelector('[data-mh="noi"]');
    var oXem = node.querySelector('[data-mh="xem"]'), oLog = node.querySelector('[data-mh="log"]');
    var oBang = node.querySelector('[data-mh="bang"]'), oCanh = node.querySelector('[data-mh="canh"]');
    var oGhi = node.querySelector('[data-mh="ghi"]'), oMh = node.querySelector('[data-mh="mh"]');

    /* Trạng thái SUY RA từ b chứ không giữ mảng riêng: nhảy tới hạng mục nào là
       mọi hạng mục sau nó tự về "chưa kiểm", không bao giờ lệch nhau. */
    function tt(i) { return b >= 2 * i + 1 ? 2 : (b >= 2 * i ? 1 : 0); }
    function chu(t) { return t === 2 ? "ĐẠT" : (t === 1 ? "CHƯA ĐẠT" : "chưa kiểm"); }
    function demDat() {
      var d = 0, i;
      for (i = 0; i < HANG.length; i++) if (tt(i) === 2) d++;   // đếm thật từ trạng thái
      return d;
    }

    function ve() {
      var i = b < 0 ? 0 : Math.min(Math.floor(b / 2), HANG.length - 1);
      var h = HANG[i], ok = tt(i) === 2, xong = b >= TONG, dt = oMh.value === "dt";

      oDs.innerHTML = HANG.map(function (m, k) {
        return '<div class="mh7-m' + (b >= 0 && k === i ? " nay" : "") + '" data-i="' + k + '">' +
          '<b class="van">' + esc(k + 1 + ". " + m.ten) + "</b><small>" + chu(tt(k)) + " — " +
          esc(m.mo) + "</small></div>";
      }).join("");
      /* innerHTML vừa ghi đè nên phải gắn lại onclick mỗi lần vẽ. */
      oDs.querySelectorAll(".mh7-m").forEach(function (o) {
        o.onclick = function () { b = 2 * Number(o.getAttribute("data-i")); ve(); noiBuoc(); };
      });
      oDem.innerHTML = "ĐẠT <b>" + demDat() + "/" + HANG.length + "</b> hạng mục";

      oTab.textContent = h.tab + (dt ? " · điện thoại 360px" : "");
      oNoi.innerHTML = h.trang(ok);
      oLog.innerHTML = b < 0
        ? '<div class="trong">Chưa chạy kiểm thử nào — trang “nhìn thì vẫn ổn”.</div>'
        : h.nhat(ok).map(function (d) {
          return '<div class="' + (d.l ? "loi" : "") + '">' + esc(d.d) + "</div>";
        }).join("");

      /* Thu hẹp khung xem để mô phỏng điện thoại. Chừng nào chưa có meta viewport
         thì ép cỡ chữ nhỏ lại — đúng thứ điện thoại làm khi không được báo bề
         rộng màn hình; sửa xong mới cho bảng rộng cuộn ngang tử tế. */
      oXem.style.maxWidth = dt ? "260px" : "";
      oNoi.style.fontSize = dt && tt(2) !== 2 ? "8.5px" : "";
      oNoi.style.overflowX = tt(2) === 2 ? "auto" : "";

      oBang.hidden = !xong;
      if (xong) {
        oBang.innerHTML = '<div class="mh4-cuon"><table class="mh4-b"><tr><th>#</th><th>Hạng mục</th>' +
          "<th>Kết quả</th></tr>" + HANG.map(function (m, k) {
            var t = tt(k);
            return '<tr class="' + (t === 2 ? "khop" : "rac") + '"><td>' + (k + 1) + "</td><td>" +
              esc(m.ten) + "</td><td>" + chu(t) + "</td></tr>";
          }).join("") + "</table></div>";
      }

      var canh = b >= 0 && b % 2 === 0 && h.canh ? h.canh : "";
      oCanh.hidden = !canh;
      oCanh.innerHTML = canh;

      oGhi.hidden = !xong;
      oGhi.className = "mh7-ghi" + (demDat() === HANG.length ? " xong" : "");
      if (xong) {
        oGhi.innerHTML = "<b>" + demDat() + "/" + HANG.length + " hạng mục ĐẠT</b> — tới lúc này mới " +
          "được đưa trang lên mạng. Nhớ lấy điều này: cả sáu lỗi vừa rồi <b>không lỗi nào làm trang báo " +
          "lỗi</b>, trang vẫn mở ra bình thường trên máy em. Chúng chỉ lộ ra khi <b>chạy theo danh " +
          "sách</b>: bấm thử từng liên kết, xem trên điện thoại, mở bằng trình duyệt khác, đo cỡ tệp " +
          "ảnh. Nhìn qua rồi gật không phải là kiểm thử.";
      }
    }

    function noiBuoc() {
      if (b < 0) {
        loi("Trang đã làm xong, mở lên vẫn bình thường. Bấm “Bước tiếp” để soát hạng mục đầu tiên.");
        return;
      }
      if (b >= TONG) {
        loi("Đã chạy hết danh sách — xem bảng tổng kết bên dưới. Muốn xem lại hạng mục nào thì bấm vào " +
          "nó ở cột trái, hoặc bấm “Làm lại”.");
        return;
      }
      var h = HANG[Math.floor(b / 2)];
      loi(b % 2 === 0 ? h.kiem : h.sua);
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= TONG) { noiBuoc(); return; }   // hết bước thì chỉ nhắc, không được lỗi
      b++; ve(); noiBuoc();
    };
    /* Đổi khổ màn hình chỉ vẽ lại, KHÔNG qua ganDatLai — không được xoá tiến độ. */
    oMh.onchange = ve;

    function lamLai() { b = -1; oMh.value = "rong"; ve(); noiBuoc(); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });
})();
