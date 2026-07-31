/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 8: MỞ CHỦ ĐỀ C (CƠ SỞ DỮ LIỆU) + KHÉP NỐT CHỦ ĐỀ E (WEB)
 *
 *  VÌ SAO CHỌN CSDL: đây là hố trống lớn nhất còn lại — 14 bài chủ đề C của lớp
 *  11 (cả bản KHMT lẫn bản ứng dụng) mà gần như không có mô phỏng nào. Và nó
 *  hợp mô phỏng đến mức lãng phí nếu bỏ qua: mọi ngộ nhận CSDL đều là ngộ nhận
 *  về HẬU QUẢ của một thao tác — xoá dòng này thì bảng kia ra sao, quên WHERE
 *  thì bao nhiêu dòng dính đòn. Đọc sách chỉ thấy lời cảnh báo; bấm một cái
 *  thấy cả bảng đỏ lòm thì nhớ suốt đời.
 *
 *  MƯỢN CSS SẴN CÓ THAY VÌ VIẾT LẠI:
 *    · .mh4-b/.mh4-hai/.mh4-cuon (minh-hoa-4.js) — bảng dữ liệu và trạng thái
 *      dòng .nay/.khop/.rac. Đã dùng cho minh hoạ nối bảng, dùng lại nguyên si.
 *    · .mh7-doi/.mh7-code/.mh7-xem/.mh7-noi... (minh-hoa-7.js) — khuôn chia đôi
 *      code | trang web thật của đợt 7. Mấy bài web ở đây là phần tiếp của đúng
 *      loạt đó nên không có lí do gì đổi khuôn.
 *  Cả hai tệp đều tự nạp CSS lúc module chạy nên luôn sẵn sàng khi tệp này chạy.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss8() {
    if (document.getElementById("mhCss8")) return;
    var st = document.createElement("style");
    st.id = "mhCss8";
    st.textContent =
      /* --- khối câu lệnh SQL, có dòng sáng --- */
      ".mh8-sql{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;" +
        "padding:9px 4px;overflow-x:auto;margin:0 0 11px}" +
      ".mh8-sd{font:600 12px/1.7 var(--font-mono);white-space:pre;padding:0 8px;" +
        "border-left:3px solid transparent;color:var(--text);transition:background .2s,opacity .2s}" +
      ".mh8-sd.nay{background:var(--primary-soft);border-left-color:var(--primary);color:var(--primary)}" +
      ".mh8-sd.mo{opacity:.34}" +
      ".mh8-sd b{color:var(--danger);font-weight:800}" +

      /* --- đánh dấu ô trong bảng dữ liệu --- */
      ".mh8-trung{text-decoration:underline wavy var(--warning);text-underline-offset:3px}" +
      ".mh8-khoa{background:var(--primary-soft) !important;font-weight:800;color:var(--primary)}" +
      /* PHẢI đứng sau .mh8-khoa: một ô khoá ngoài trỏ vào hư không mang cả hai
         class, mà cả hai đều đặt nền kèm !important — luật viết sau mới thắng.
         Đảo thứ tự là ô hỏng lại hiện màu xanh "bình thường", đúng cái cần tố cáo. */
      ".mh8-lech{background:var(--danger-soft) !important;box-shadow:inset 0 0 0 2px var(--danger);" +
        "color:var(--danger) !important}" +
      /* Dòng vừa bị xoá: gạch ngang rồi mờ đi, để mắt kịp thấy nó BIẾN MẤT vì
         câu lệnh nào — xoá phắt thì học sinh không kịp nối nhân với quả. */
      ".mh4-b tr.xoa td{text-decoration:line-through;opacity:.45;background:var(--danger-soft)}" +

      ".mh8-canh{margin:11px 0 0;border-radius:9px;padding:9px 11px;font-size:12.5px;line-height:1.55;" +
        "background:var(--danger-soft);border:1px solid var(--danger);color:var(--text)}" +
      ".mh8-canh b{color:var(--danger)}" +
      ".mh8-dem{text-align:center;margin:11px 0 0;font:700 12.5px var(--font-mono);color:var(--text-soft)}" +
      ".mh8-dem b{color:var(--primary);font-size:14px}" +

      /* --- trình phát nhạc/phim và khung nội tuyến trong trang mẫu --- */
      ".mh7-noi audio{width:100%;max-width:320px;display:block;margin:.5em 0}" +
      ".mh7-noi video{width:100%;max-width:300px;display:block;margin:.5em 0;background:#20232a;border-radius:4px}" +
      ".mh7-noi iframe{width:100%;max-width:320px;height:118px;border:2px solid #9aa0aa;border-radius:4px;" +
        "margin:.5em 0;background:#fff;display:block}" +
      /* Thẻ media KHÔNG có controls thì cao 0px, nhìn như trang trống — đó chính
         là bài học, nên phải có chỗ nói rõ "có thẻ nhưng không thấy gì". */
      ".mh8-vohinh{border:1.5px dashed #c9ccd3;border-radius:6px;padding:7px 9px;margin:.5em 0;" +
        "color:#8a8f99;font:italic 12px var(--font-sans)}";
    (document.head || document.documentElement).appendChild(st);
  }
  napCss8();

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
   *  C11-10 · SQL: THÊM, SỬA VÀ XOÁ DỮ LIỆU
   *
   *  NGỘ NHẬN đắt nhất — và là tai nạn có thật ngoài đời, không phải bẫy đề
   *  vẽ ra: QUÊN MỆNH ĐỀ WHERE. Câu "UPDATE ... SET lop = '12B'" thiếu WHERE
   *  không hề sai cú pháp, hệ quản trị chạy ngon lành và im lặng sửa TOÀN BỘ
   *  bảng. "DELETE FROM HOC_SINH" thiếu WHERE thì xoá sạch.
   *
   *  Chỗ khó dạy là học sinh đọc lời cảnh báo trong SGK thì gật đầu, nhưng
   *  không thấy được quy mô. Nên mô phỏng đặt con số "số dòng bị ảnh hưởng"
   *  ngay dưới bảng: có WHERE thì 1, bỏ WHERE thì 6 — cùng một câu lệnh, chỉ
   *  thiếu một dòng chữ.
   * ================================================================ */
  MH.dangKy("C11-10", function (host) {
    var GOC = [
      { ma: "HS01", ten: "Lê An", lop: "12A" },
      { ma: "HS02", ten: "Trần Bình", lop: "12A" },
      { ma: "HS03", ten: "Vũ Chi", lop: "12B" },
      { ma: "HS04", ten: "Phạm Dung", lop: "12C" },
      { ma: "HS05", ten: "Ngô Hà", lop: "12C" },
    ];
    var B;        // bảng hiện tại
    var buoc;     // -1 = chưa chạy lệnh nào
    var danh;     // mã các dòng vừa bị lệnh vừa rồi tác động
    var xoa;      // mã các dòng vừa bị xoá (giữ lại để vẽ gạch ngang một nhịp)

    var node = MH.el(MH.khung("Ba lệnh sửa dữ liệu — và tai nạn kinh điển: quên WHERE",
      "Bấm “Bước tiếp” để chạy lần lượt <b>INSERT</b>, <b>UPDATE</b>, <b>DELETE</b>. Nhìn con số " +
      "<b>số dòng bị ảnh hưởng</b> dưới bảng. Rồi tích ô <b>“quên WHERE”</b> và chạy lại — " +
      "câu lệnh vẫn đúng cú pháp, vẫn chạy, không báo lỗi gì.",
      '<div class="mh8-sql" data-mh="sql"></div>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="quen"> quên WHERE</label>'));

    var loi = loiCua(node);
    function quen() { return node.querySelector('[data-mh="quen"]').checked; }

    /* Ba lệnh viết ra sẵn, phần WHERE tách riêng để bỏ đi được mà không phải
       ghép chuỗi ở ba chỗ khác nhau. */
    var LENH = [
      { sql: ["INSERT INTO HOC_SINH (ma_hs, ho_ten, lop)", "VALUES ('HS06', 'Đỗ Kiên', '12A');"], w: null },
      { sql: ["UPDATE HOC_SINH", "SET lop = '12B'"], w: "WHERE ma_hs = 'HS02';" },
      { sql: ["DELETE FROM HOC_SINH"], w: "WHERE lop = '12C';" },
    ];

    function dongSql() {
      var d = [];
      LENH.forEach(function (l, i) {
        var mo = i !== buoc;
        l.sql.forEach(function (s) { d.push({ t: s, mo: mo, nay: i === buoc }); });
        if (l.w) {
          d.push(quen()
            ? { t: "  -- (thiếu " + l.w.replace(";", "") + ")", mo: mo, nay: i === buoc, do: true }
            : { t: "  " + l.w, mo: mo, nay: i === buoc });
        }
        if (i < LENH.length - 1) d.push({ t: "", mo: true });
      });
      return d;
    }

    function chay(i) {
      danh = []; xoa = [];
      if (i === 0) {
        B.push({ ma: "HS06", ten: "Đỗ Kiên", lop: "12A" });
        danh = ["HS06"];
        return { so: 1, loai: "them" };
      }
      if (i === 1) {
        B.forEach(function (r) {
          if (quen() || r.ma === "HS02") { r.lop = "12B"; danh.push(r.ma); }
        });
        return { so: danh.length, loai: "sua" };
      }
      var giu = [];
      B.forEach(function (r) {
        if (quen() || r.lop === "12C") xoa.push(r); else giu.push(r);
      });
      B = giu;
      return { so: xoa.length, loai: "xoa" };
    }

    function ve(kq) {
      var d = dongSql();
      node.querySelector('[data-mh="sql"]').innerHTML = d.map(function (o) {
        return '<div class="mh8-sd' + (o.nay ? " nay" : "") + (o.mo ? " mo" : "") + '">' +
          (o.do ? "<b>" + esc(o.t) + "</b>" : esc(o.t) || "&nbsp;") + "</div>";
      }).join("");

      var t = '<tr><th class="mh8-khoa">ma_hs</th><th>ho_ten</th><th>lop</th></tr>';
      B.forEach(function (r) {
        var c = danh.indexOf(r.ma) >= 0 ? (kq && kq.loai === "them" ? "khop" : "nay") : "";
        t += '<tr class="' + c + '"><td class="mh8-khoa">' + esc(r.ma) + "</td><td>" +
          esc(r.ten) + "</td><td>" + esc(r.lop) + "</td></tr>";
      });
      /* Dòng đã xoá vẫn vẽ ra một nhịp, gạch ngang — biến mất luôn thì không ai
         kịp thấy câu lệnh vừa rồi đã lấy đi cái gì. */
      xoa.forEach(function (r) {
        t += '<tr class="xoa"><td>' + esc(r.ma) + "</td><td>" + esc(r.ten) + "</td><td>" +
          esc(r.lop) + "</td></tr>";
      });
      node.querySelector('[data-mh="bang"]').innerHTML = t;

      node.querySelector('[data-mh="dem"]').innerHTML = kq
        ? "Số dòng bị ảnh hưởng: <b>" + kq.so + "</b> &nbsp;·&nbsp; bảng còn <b>" + B.length + "</b> dòng"
        : "Bảng đang có <b>" + B.length + "</b> dòng";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(quen() && kq && buoc >= 1);
      if (!canh.hidden) {
        canh.innerHTML = buoc === 1
          ? "Thiếu WHERE nên <b>cả " + kq.so + " dòng</b> đổi lớp thành 12B — kể cả những bạn không liên quan. " +
            "Hệ quản trị <b>không báo lỗi</b>: câu lệnh đúng cú pháp, nó chỉ làm đúng thứ em bảo."
          : "Thiếu WHERE nên DELETE <b>xoá sạch " + kq.so + " dòng</b>, bảng trống trơn. " +
            "Không có nút hoàn tác nào cả — muốn lấy lại thì phải phục hồi từ bản sao lưu.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (buoc < LENH.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh7-ghi" + (quen() ? "" : " xong");
      ghi.innerHTML = quen()
        ? "Ba lệnh đều chạy trót lọt mà bảng thì tan nát. Nhớ: <b>WHERE là bộ lọc chọn dòng để tác động</b>; " +
          "thiếu nó thì UPDATE và DELETE hiểu là <b>“làm với mọi dòng”</b>, không phải “không làm gì”. " +
          "Thói quen tự cứu mình: trước khi UPDATE/DELETE, chạy thử <code>SELECT * FROM ... WHERE (đúng " +
          "điều kiện đó)</code> để xem nó <b>trúng bao nhiêu dòng</b> đã."
        : "Có WHERE nên mỗi lệnh chỉ chạm đúng phần cần chạm: INSERT thêm <b>1</b> dòng, UPDATE sửa <b>1</b> " +
          "dòng, DELETE xoá <b>2</b> dòng lớp 12C. Lưu ý INSERT không có WHERE — nó thêm dòng mới nên " +
          "chẳng có dòng cũ nào để lọc. Giờ tích ô <b>“quên WHERE”</b> và chạy lại.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= LENH.length - 1) {
        loi(quen()
          ? "Bỏ tích “quên WHERE” rồi chạy lại để so với cách viết đúng."
          : "Hết ba lệnh. Tích ô <b>“quên WHERE”</b> và chạy lại — cùng ba lệnh đó.");
        return;
      }
      buoc++;
      var kq = chay(buoc);
      ve(kq);
      if (buoc === 0) {
        loi("<b>INSERT</b> thêm một dòng mới vào cuối bảng. Danh sách cột trong ngoặc phải khớp " +
          "<b>đúng thứ tự</b> với danh sách giá trị ở VALUES.");
      } else if (buoc === 1) {
        loi(quen()
          ? "<b>UPDATE</b> thiếu WHERE: <b>" + kq.so + " dòng</b> vừa đổi lớp, không phải 1."
          : "<b>UPDATE</b> có WHERE lọc đúng ma_hs = 'HS02' nên chỉ <b>1 dòng</b> đổi lớp. " +
            "SET nói sửa cột nào, WHERE nói sửa dòng nào.");
      } else {
        loi(quen()
          ? "<b>DELETE</b> thiếu WHERE: <b>" + kq.so + " dòng</b> vừa bị xoá — tức là cả bảng."
          : "<b>DELETE</b> xoá <b>" + kq.so + " dòng</b> có lop = '12C'. DELETE xoá <b>cả dòng</b>, " +
            "không xoá riêng một ô — muốn bỏ trống một ô thì dùng UPDATE ... SET cot = NULL.");
      }
    };

    function lamLai() {
      B = GOC.map(function (r) { return { ma: r.ma, ten: r.ten, lop: r.lop }; });
      buoc = -1; danh = []; xoa = [];
      ve(null);
      loi("Bảng HOC_SINH ban đầu có <b>" + B.length + "</b> dòng. Bấm “Bước tiếp” để chạy lệnh INSERT.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="quen"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-23 · ÂM THANH, PHIM VÀ KHUNG NỘI TUYẾN
   *
   *  NGỘ NHẬN 1 — và là lỗi làm học sinh ngồi hàng giờ tưởng máy hỏng: thẻ
   *  <audio>/<video> KHÔNG có thuộc tính controls thì trình duyệt vẫn nhận thẻ,
   *  vẫn tải tệp, nhưng <b>không vẽ ra gì cả</b> — trang trông y như trống.
   *  Ở đây bật/tắt controls thấy ngay khung điều khiển hiện ra rồi biến mất.
   *
   *  NGỘ NHẬN 2: tưởng <iframe> "chép" nội dung trang kia sang. Không — nó mở
   *  một trang web KHÁC nằm gọn trong khung; sửa trang gốc thì khung đổi theo.
   *
   *  KHÔNG DÙNG TỆP NHẠC/PHIM THẬT: app chạy được offline (PWA), nhúng tệp
   *  media thật là hỏng cả hai chuyện — nặng và mất mạng là vỡ. Thẻ media
   *  không src vẫn vẽ đúng thanh điều khiển, mà bài học nằm ở chỗ CÓ hay KHÔNG
   *  có thanh đó, nên vẫn minh hoạ trọn vẹn. Riêng iframe dùng srcdoc để nội
   *  dung nằm ngay trong thuộc tính, không phải gọi mạng.
   * ================================================================ */
  MH.dangKy("C12-23", function (host) {
    var BUOC = [
      { ma: ['<audio src="nhac-nen.mp3" controls></audio>'],
        giai: "<b>&lt;audio&gt;</b> nhúng một tệp âm thanh. <code>src</code> trỏ tới tệp, " +
          "<code>controls</code> bảo trình duyệt vẽ ra thanh điều khiển (nút chạy, thanh tua, âm lượng). " +
          "Thử bỏ tích <b>“có controls”</b> ở trên xem chuyện gì xảy ra." },
      { ma: ['<video src="gioi-thieu.mp4" controls', '       width="300"></video>'],
        giai: "<b>&lt;video&gt;</b> dùng y hệt audio, chỉ thêm <code>width</code>/<code>height</code> cho khung " +
          "hình. Cũng cần <code>controls</code> mới có nút bấm. Thêm <code>autoplay</code> thì tự chạy — " +
          "nhưng hầu hết trình duyệt <b>chặn autoplay có tiếng</b>, nên đừng trông cậy vào nó." },
      { ma: ['<video controls width="300">',
             '  <source src="phim.mp4"  type="video/mp4">',
             '  <source src="phim.webm" type="video/webm">',
             '  Trình duyệt của bạn không xem được phim.',
             "</video>"],
        giai: "Cách viết đầy đủ: thay <code>src</code> bằng nhiều thẻ <b>&lt;source&gt;</b>. Trình duyệt thử " +
          "<b>từ trên xuống</b>, gặp định dạng nào nó đọc được thì dùng và bỏ qua phần còn lại. Dòng chữ " +
          "cuối là <b>phương án dự phòng</b>, chỉ hiện khi không định dạng nào chạy được." },
      { ma: ['<iframe src="gioi-thieu.html"', '        width="320" height="118"></iframe>'],
        giai: "<b>&lt;iframe&gt;</b> (khung nội tuyến) mở <b>hẳn một trang web khác</b> nằm gọn trong khung này — " +
          "nó <b>không chép</b> nội dung sang. Sửa trang gốc thì cái nhìn thấy trong khung đổi theo ngay. " +
          "Đây là cách người ta nhúng bản đồ hay video YouTube: chỉ dán mã nhúng, không phải tải phim về." },
    ];

    var k;
    var node = MH.el(MH.khung("Nhạc, phim và khung nội tuyến — vì sao có thẻ mà không thấy gì?",
      "Bên trái là code, bên phải là trang thật. Bấm “Bước tiếp” để đi qua bốn cách nhúng. " +
      "Chỗ đáng nhớ nhất: bỏ tích <b>“có controls”</b> thì thẻ vẫn nằm đó, trình duyệt vẫn nhận, " +
      "mà trang <b>trông như trống trơn</b>.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Code HTML</p><div class="mh7-code" data-mh="code"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trình duyệt vẽ ra</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Trang lớp em</div>' +
      '<div class="mh7-noi" data-mh="xem"></div></div></div>' +
      "</div><div class=\"mh7-ghi\" data-mh=\"ghi\" hidden></div>",
      '<label class="mh7-tick"><input type="checkbox" data-mh="dk" checked> có controls</label>'));

    var loi = loiCua(node);
    function dk() { return node.querySelector('[data-mh="dk"]').checked; }

    /* Trang mẫu bên trong iframe: để thẳng vào srcdoc nên không gọi mạng, chạy
       được cả khi app đang offline. */
    var SRCDOC = '<body style="font:14px sans-serif;margin:8px;color:#1a1a1a">' +
      "<h3 style=\"margin:0 0 4px\">Giới thiệu lớp 12A</h3>" +
      "<p style=\"margin:0\">Đây là một trang web khác, đang chạy bên trong khung.</p></body>";

    function maHienTai() {
      var d = BUOC[k].ma.slice();
      if (!dk()) {
        d = d.map(function (s) { return s.replace(/ ?controls/, ""); });
      }
      return d;
    }

    function ve() {
      node.querySelector('[data-mh="code"]').innerHTML = maHienTai().map(function (s, i) {
        return '<div class="mh7-d' + (i === 0 ? " nay" : "") + '">' + esc(s) + "</div>";
      }).join("");

      var c = dk() ? " controls" : "";
      var h;
      if (k === 0) h = "<audio" + c + "></audio>";
      else if (k === 1) h = '<video width="300"' + c + "></video>";
      else if (k === 2) h = '<video width="300"' + c + "></video>";
      else h = '<iframe srcdoc="' + esc(SRCDOC) + '"></iframe>';

      /* Thẻ media bỏ controls thì cao 0px — trang trông y như chưa viết gì. Phải
         nói ra bằng chữ, không thì học sinh tưởng minh hoạ bị lỗi. */
      if (!dk() && k < 3) {
        h += '<div class="mh8-vohinh">Thẻ ' + (k === 0 ? "&lt;audio&gt;" : "&lt;video&gt;") +
          " vẫn nằm trong trang và tệp vẫn được tải — nhưng không có <b>controls</b> nên " +
          "trình duyệt không vẽ nút nào, trang trông như trống.</div>";
      }
      node.querySelector('[data-mh="xem"]').innerHTML = h;

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < BUOC.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh7-ghi" + (dk() ? " xong" : "");
      ghi.innerHTML = dk()
        ? "Ba thẻ này đều <b>nhúng nội dung từ nơi khác</b> vào trang, không chép nội dung ấy vào tệp HTML " +
          "của em. Tệp .html vẫn chỉ là văn bản vài dòng; nhạc, phim, trang kia nằm ở chỗ của chúng. " +
          "Nhớ ba điều hay ra đề: <b>controls</b> mới có nút bấm, nhiều <b>&lt;source&gt;</b> để phòng trình " +
          "duyệt không đọc được định dạng, và <b>&lt;iframe&gt;</b> mở một trang khác chứ không sao chép nó."
        : "Không có <b>controls</b> nên cả audio lẫn video đều <b>vô hình</b>: thẻ đúng, đường dẫn đúng, tệp " +
          "vẫn tải về, mà người xem không thấy gì và tưởng trang lỗi. Đây là lỗi tốn thời gian nhất khi " +
          "mới học nhúng media. Tích lại ô <b>“có controls”</b> để thấy chúng hiện ra.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= BUOC.length - 1) {
        loi("Đã xem hết bốn cách nhúng. Thử bật/tắt ô <b>“có controls”</b> rồi bấm “Làm lại”.");
        return;
      }
      k++; ve(); loi(BUOC[k].giai);
    };

    function lamLai() { k = 0; ve(); loi(BUOC[0].giai); }
    ganDatLai(node, [node.querySelector('[data-mh="dk"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-06 · CƠ SỞ DỮ LIỆU LÀ GÌ VÀ VÌ SAO CẦN ĐẾN NÓ?
   *
   *  Đánh vào ngộ nhận "một bảng to là đủ": bảng gộp làm thông tin học sinh bị
   *  chép lại ở nhiều dòng, nên một lần đổi số điện thoại là nhiều lần sửa —
   *  sót một dòng thì dữ liệu tự mâu thuẫn với chính nó, mà bảng không hề báo.
   * ================================================================ */
  MH.dangKy("C11-06", function (host) {
    var TIEU = ["Mã mượn", "Họ tên", "Lớp", "Điện thoại", "Tên sách"];
    var TEN = "Lê An";
    var SDT_CU = "0912 345 678", SDT_MOI = "0987 111 222";
    var DL = [
      ["M01", "Lê An", "11A1", SDT_CU, "Dế Mèn phiêu lưu kí"],
      ["M02", "Trần Bình", "11A2", "0933 202 707", "Số đỏ"],
      ["M03", "Phạm Chi", "11A1", "0977 818 141", "Toán rời rạc"],
      ["M04", "Lê An", "11A1", SDT_CU, "Lập trình Python"],
      ["M05", "Trần Bình", "11A2", "0933 202 707", "Vật lí đại cương"],
      ["M06", "Vũ Dung", "11A3", "0966 505 313", "Nhà giả kim"],
      ["M07", "Lê An", "11A1", SDT_CU, "Mắt biếc"],
      ["M08", "Phạm Chi", "11A1", "0977 818 141", "Số đỏ"],
    ];
    var dsAn = [];   // vị trí các dòng ghi tên Lê An — chính là chỗ dữ liệu bị lặp
    DL.forEach(function (r, i) { if (r[1] === TEN) dsAn.push(i); });

    var b;   // 0 = chưa sửa; 1..hetB = vừa sửa xong dòng thứ b; hetB+1 = chốt kết luận

    var node = MH.el(MH.khung("Một bảng gánh tất cả: sửa một số điện thoại phải sửa mấy lần?",
      "Sổ mượn sách chỉ có <b>một bảng</b> nên mỗi lượt mượn đều chép lại tên, lớp, số điện thoại của " +
      "người mượn. Bạn <b>" + esc(TEN) + "</b> vừa đổi số. Bấm “Bước tiếp” để sửa <b>từng dòng một</b> " +
      "và xem chuyện gì xảy ra khi em sửa sót.",
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="du"> sửa đủ mọi dòng</label>'));

    var loi = loiCua(node);
    function du() { return node.querySelector('[data-mh="du"]').checked; }
    /* Bỏ tích thì cố ý dừng SỚM một dòng — đó là toàn bộ ý đồ của minh hoạ này. */
    function hetB() { return du() ? dsAn.length : dsAn.length - 1; }
    function daSua(i) {
      var k = dsAn.indexOf(i);
      return k >= 0 && k < Math.min(b, hetB());
    }
    function vuaSua() { return b >= 1 && b <= hetB() ? dsAn[b - 1] : -1; }
    function lech() { return b > hetB() && !du(); }

    function ve() {
      var t = "<tr>";
      TIEU.forEach(function (v) { t += "<th>" + esc(v) + "</th>"; });
      t += "</tr>";
      DL.forEach(function (r, i) {
        var an = r[1] === TEN, xong = daSua(i);
        var cls = "";
        if (i === vuaSua()) cls = "nay";
        else if (xong) cls = "khop";
        else if (lech() && an) cls = "rac";
        t += '<tr class="' + cls + '">';
        for (var c = 0; c < 5; c++) {
          var giaTri = (c === 3 && xong) ? SDT_MOI : r[c];
          var co = "";
          /* Ô tên luôn gạch vàng: nhắc rằng dù sửa đúng hết thì dữ liệu vẫn
             đang bị chép lại — dư thừa không tự mất đi. */
          if (an && c === 1) co = "mh8-trung";
          if (an && c === 3) co = lech() ? "mh8-lech" : (xong ? "" : "mh8-trung");
          t += "<td" + (co ? ' class="' + co + '"' : "") + ">" + esc(giaTri) + "</td>";
        }
        t += "</tr>";
      });
      node.querySelector('[data-mh="bang"]').innerHTML = t;

      var soXong = Math.min(b, hetB());
      node.querySelector('[data-mh="dem"]').innerHTML =
        "Số điện thoại của " + esc(TEN) + " nằm ở <b>" + dsAn.length + "</b> dòng &nbsp;·&nbsp; đã sửa <b>" +
        soXong + "</b> &nbsp;·&nbsp; còn sót <b>" + (dsAn.length - soXong) + "</b>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (b <= hetB()) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh7-ghi" + (lech() ? "" : " xong");
      ghi.innerHTML = lech()
        ? "Bảng đang nói <b>hai điều trái ngược</b> về cùng một người: dòng M01, M04 ghi " + esc(SDT_MOI) +
          " còn dòng M07 vẫn ghi " + esc(SDT_CU) + ". Không có cách nào nhìn vào bảng mà biết dòng nào " +
          "đúng. Chuyện một dữ liệu bị chép ra nhiều chỗ gọi là <b>dư thừa dữ liệu</b>; hậu quả vừa thấy " +
          "gọi là <b>thiếu nhất quán</b>. Ai nghĩ “một bảng to là đủ, cần gì cơ sở dữ liệu cho phức tạp” " +
          "thì đây là cái giá: mỗi lần sửa phải sửa <b>đúng hết</b> mọi dòng, sót một dòng là hỏng — mà " +
          "bảng thật có hàng nghìn dòng."
        : "Lần này đúng, nhưng em phải sửa <b>" + dsAn.length + " lần</b> cho <b>một</b> việc, và phải " +
          "tự nhớ là còn dòng nào chưa sửa — không ai nhắc. Cột “Họ tên” vẫn đang bị chép lại, tức " +
          "<b>dư thừa dữ liệu</b> vẫn còn nguyên. Cách chữa là <b>tách thành nhiều bảng</b>: một bảng " +
          "Học sinh giữ tên, lớp, điện thoại — mỗi người <b>đúng một dòng duy nhất</b>; bảng Lượt mượn " +
          "chỉ ghi mã học sinh. Khi đó đổi số điện thoại là sửa <b>một ô</b>, không thể sót. Đó chính là " +
          "việc mà <b>cơ sở dữ liệu</b> sinh ra để làm.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b > hetB()) {
        loi(du()
          ? "Xong rồi. Bỏ tích “sửa đủ mọi dòng” rồi làm lại để thấy tình huống sửa sót."
          : "Hết bước. Tích ô <b>“sửa đủ mọi dòng”</b> để so với trường hợp sửa đúng hết.");
        return;
      }
      b++;
      ve();
      if (b <= hetB()) {
        var ma = DL[dsAn[b - 1]][0], con = dsAn.length - b;
        if (b === hetB() && !du()) {
          loi("Sửa dòng <b>" + esc(ma) + "</b> xong — và em <b>dừng ở đây</b>, tưởng là hết. " +
            "Bấm tiếp để xem bảng lúc này đang nói gì.");
        } else if (b === 1) {
          loi("Sửa dòng <b>" + esc(ma) + "</b> sang " + esc(SDT_MOI) + ". Nhưng số cũ vẫn nằm ở <b>" + con +
            "</b> dòng khác — sửa một dòng chưa đổi được gì, vì bảng vẫn đang lưu số cũ.");
        } else if (con > 0) {
          loi("Sửa tiếp dòng <b>" + esc(ma) + "</b>. Vẫn còn <b>" + con + "</b> dòng mang số cũ. Việc đổi " +
            "một số điện thoại đáng lẽ là một thao tác, ở đây thành nhiều thao tác chỉ vì dữ liệu bị chép lặp.");
        } else {
          loi("Sửa nốt dòng <b>" + esc(ma) + "</b>. Giờ cả " + dsAn.length + " dòng cùng ghi một số.");
        }
        return;
      }
      loi(lech()
        ? "Còn <b>một dòng chưa sửa</b>. Bảng không hề báo lỗi, nó vẫn nhận cả hai số cùng lúc."
        : "Sửa đủ cả " + dsAn.length + " dòng nên dữ liệu thống nhất — nhưng hãy đọc kĩ ghi chú bên dưới.");
    };

    function lamLai() {
      b = 0;
      ve();
      loi("Cả sổ nhét vào <b>một bảng</b>: mỗi lượt mượn chép lại đủ tên, lớp, điện thoại. " + esc(TEN) +
        " mượn " + dsAn.length + " lần nên thông tin của bạn ấy bị chép lại <b>" + dsAn.length +
        "</b> chỗ (các ô gạch vàng). Bấm “Bước tiếp” để đổi số điện thoại cho bạn ấy.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="du"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-26 · TÁCH SỔ GHI TAY THÀNH CÁC BẢNG LIÊN KẾT
   *
   *  NGỘ NHẬN CHÍNH: "tách bảng ra là mất thông tin". Nên bước cuối phải GHÉP
   *  LẠI và cho thấy bảng dựng lại trùng khít sổ ban đầu — nói miệng không đủ.
   *  Chỗ thứ hai hay hiểu ngược: tách xong dữ liệu ÍT đi (mỗi học sinh lưu một
   *  lần), chứ không phải nhiều lên vì "có thêm một bảng".
   * ================================================================ */
  MH.dangKy("C11-26", function (host) {
    var HS = [
      { ma: "HS01", ten: "Lê An", lop: "12A" },
      { ma: "HS02", ten: "Trần Bình", lop: "12A" },
      { ma: "HS03", ten: "Vũ Chi", lop: "12B" },
    ];
    /* Sổ ghi tay: mỗi lượt mượn một dòng, họ tên và lớp chép lại y nguyên. */
    var SO = [
      { ma: "HS01", sach: "Toán 12", ngay: "05/09" },
      { ma: "HS02", sach: "Ngữ văn 12", ngay: "06/09" },
      { ma: "HS01", sach: "Tin học 12", ngay: "12/09" },
      { ma: "HS03", sach: "Vật lí 12", ngay: "12/09" },
      { ma: "HS02", sach: "Sinh học 12", ngay: "15/09" },
    ];
    var buoc;

    function nguoi(ma) {
      for (var i = 0; i < HS.length; i++) if (HS[i].ma === ma) return HS[i];
      return null;
    }
    function demLuot(ma) {
      var d = 0;
      SO.forEach(function (r) { if (r.ma === ma) d++; });
      return d;
    }

    function htmlGop(danhDau) {
      var h = "<tr><th>ho_ten</th><th>lop</th><th>ten_sach</th><th>ngay_muon</th></tr>";
      SO.forEach(function (r) {
        var n = nguoi(r.ma);
        var c = danhDau && demLuot(r.ma) > 1 ? ' class="mh8-trung"' : "";
        h += "<tr><td" + c + ">" + esc(n.ten) + "</td><td" + c + ">" + esc(n.lop) + "</td><td>" +
          esc(r.sach) + "</td><td>" + esc(r.ngay) + "</td></tr>";
      });
      return h;
    }
    function htmlHS(coKhoa) {
      var h = "<tr>" + (coKhoa ? '<th class="mh8-khoa">ma_hs</th>' : "") + "<th>ho_ten</th><th>lop</th></tr>";
      HS.forEach(function (n) {
        h += "<tr>" + (coKhoa ? '<td class="mh8-khoa">' + esc(n.ma) + "</td>" : "") +
          "<td>" + esc(n.ten) + "</td><td>" + esc(n.lop) + "</td></tr>";
      });
      return h;
    }
    function htmlMuon() {
      var h = '<tr><th class="mh8-khoa">ma_hs</th><th>ten_sach</th><th>ngay_muon</th></tr>';
      SO.forEach(function (r) {
        h += '<tr><td class="mh8-khoa">' + esc(r.ma) + "</td><td>" + esc(r.sach) +
          "</td><td>" + esc(r.ngay) + "</td></tr>";
      });
      return h;
    }
    function htmlGhep() {
      var h = "<tr><th>ho_ten</th><th>lop</th><th>ten_sach</th><th>ngay_muon</th></tr>";
      SO.forEach(function (r) {
        var n = nguoi(r.ma);
        h += '<tr class="khop"><td>' + esc(n.ten) + "</td><td>" + esc(n.lop) + "</td><td>" +
          esc(r.sach) + "</td><td>" + esc(r.ngay) + "</td></tr>";
      });
      return h;
    }

    /* Nhãn của bảng đứng một mình — .mh4-hai h5 chỉ tô được h5 nằm trong lưới
       hai bảng, còn hai chỗ dưới đây nằm ngoài lưới đó. */
    var NHAN = 'style="margin:0 0 6px;font:800 11.5px var(--font-sans);text-align:center;color:var(--text-soft)"';
    var DEM = [
      "Sổ gộp: <b>" + SO.length + "</b> dòng · chỉ có <b>" + HS.length + "</b> học sinh",
      "Họ tên và lớp bị chép lại <b>" + SO.length + "</b> lần cho <b>" + HS.length + "</b> người",
      "Bảng HOC_SINH: <b>" + HS.length + "</b> dòng — mỗi học sinh <b>một</b> dòng",
      "Khoá chính <b>ma_hs</b>: <b>" + HS.length + "</b> giá trị, không trùng, không rỗng",
      "Bảng MUON: <b>" + SO.length + "</b> dòng · cả cụm học sinh gói lại còn <b>một</b> cột",
      "Ghép lại được <b>" + SO.length + "</b> dòng — trùng khít sổ ban đầu",
    ];
    var LOI = [
      "Đây là quyển sổ của thủ thư chép thẳng vào máy: <b>một bảng gộp</b>, mỗi lượt mượn một dòng. Bấm “Bước tiếp”.",
      "Các ô <b>viền vàng</b> là chỗ chép đi chép lại: Lê An mượn 2 lần nên họ tên và lớp của em ấy nằm ở 2 dòng. " +
        "Đổi lớp cho em ấy là phải sửa <b>nhiều ô</b>, sót một ô là dữ liệu mâu thuẫn ngay.",
      "Em vừa <b>tách nhóm cột về học sinh</b> ra bảng riêng: mỗi học sinh <b>đúng một dòng</b>. Chú ý — dữ liệu " +
        "<b>ít đi</b> chứ không nhiều lên, vì thông tin một người giờ chỉ lưu <b>một lần</b>.",
      "Bảng HOC_SINH cần chỉ ra <b>mỗi dòng là ai</b>, nên đặt <b>khoá chính ma_hs</b>. Khoá chính có hai điều " +
        "kiện cứng: <b>không trùng</b> và <b>không rỗng</b>. Lấy họ tên làm khoá thì hỏng, vì hai bạn trùng tên " +
        "là hết phân biệt.",
      "Bảng MUON chỉ giữ việc mượn. Cả cụm họ tên + lớp bị thay bằng <b>một cột ma_hs</b> — đó là <b>khoá " +
        "ngoài</b>, thứ <b>nối</b> hai bảng lại. Bỏ cột này đi thì hai bảng thành hai mẩu rời rạc, chẳng còn " +
        "biết ai mượn sách nào.",
      "Ghép hai bảng theo <b>ma_hs</b>: mỗi dòng MUON tìm đúng một dòng HOC_SINH, dựng lại <b>y hệt</b> sổ ban " +
        "đầu. Vậy tách bảng <b>không mất</b> thông tin — nó chỉ bỏ phần chép thừa.",
    ];

    var node = MH.el(MH.khung("Tách quyển sổ ghi tay thành hai bảng liên kết",
      "Thủ thư ghi mọi thứ vào <b>một bảng gộp</b>. Em sẽ tách nó thành <b>HOC_SINH</b> và <b>MUON</b>, " +
      "nối nhau bằng khoá — rồi ghép lại để xem có mất chữ nào không.",
      '<div data-mh="san"></div><div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));
    var loi = loiCua(node);

    function ve() {
      var s;
      if (buoc <= 1) {
        s = "<div><h5 " + NHAN + ">SO_MUON_SACH — chép y quyển sổ ghi tay</h5>" +
          '<div class="mh4-cuon"><table class="mh4-b">' + htmlGop(buoc === 1) + "</table></div></div>";
      } else {
        s = '<div class="mh4-hai">' +
          '<div><h5>HOC_SINH</h5><table class="mh4-b">' + htmlHS(buoc >= 3) + "</table></div>" +
          "<div><h5>" + (buoc >= 4 ? "MUON (ma_hs là khoá ngoài)" : "SO_MUON_SACH (bảng gộp cũ)") + "</h5>" +
          '<div class="mh4-cuon"><table class="mh4-b">' + (buoc >= 4 ? htmlMuon() : htmlGop(true)) +
          "</table></div></div></div>";
      }
      if (buoc >= 5) {
        s += '<div style="margin-top:13px"><h5 ' + NHAN + ">Ghép HOC_SINH với MUON theo ma_hs</h5>" +
          '<div class="mh4-cuon"><table class="mh4-b">' + htmlGhep() + "</table></div></div>";
      }
      node.querySelector('[data-mh="san"]').innerHTML = s;
      node.querySelector('[data-mh="dem"]').innerHTML = DEM[buoc];

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < 5;
      ghi.className = "mh7-ghi xong";
      if (buoc >= 5) {
        ghi.innerHTML = "Hai bảng nhỏ <b>chứa đủ</b> mọi thứ quyển sổ có. Cái mất đi chỉ là phần chép thừa: " +
          "trước phải viết họ tên + lớp <b>" + SO.length + "</b> lần, giờ viết <b>" + HS.length + "</b> lần. " +
          "Muốn sửa lớp cho một bạn thì sửa <b>một ô duy nhất</b> ở HOC_SINH, mọi lượt mượn của bạn ấy đổi theo.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= LOI.length - 1) {
        loi("Hết các bước rồi. Bấm “Làm lại” để xem lại từ quyển sổ gộp ban đầu.");
        return;
      }
      buoc++; ve(); loi(LOI[buoc]);
    };

    function lamLai() { buoc = 0; ve(); loi(LOI[0]); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-11 · AN TOÀN VÀ TOÀN VẸN DỮ LIỆU — RÀNG BUỘC KHOÁ NGOÀI
   *
   *  NGỘ NHẬN: học sinh nghĩ ràng buộc khoá ngoài là thứ "làm khó", cứ tắt đi
   *  cho dễ thao tác. Nói lí thuyết không lay chuyển được. Cách ăn thua là cho
   *  các em TỰ TẮT nó rồi nhìn bảng MUON còn nguyên hai dòng trỏ tới mã học
   *  sinh không còn tồn tại — dữ liệu hỏng âm thầm, không thông báo nào cả.
   *  Vì thế ô tích mới là trung tâm của minh hoạ này, không phải nút Bước tiếp.
   * ================================================================ */
  MH.dangKy("C11-11", function (host) {
    var buoc;

    var HS = [
      ["HS01", "Trần Vân An", "11A1"],
      ["HS02", "Lê Hoàng Bình", "11A2"],
      ["HS03", "Phạm Ngọc Chi", "11A1"],
    ];
    var MU = [
      ["M01", "HS02", "Toán 11", "05/09"],
      ["M02", "HS01", "Vật lí 11", "06/09"],
      ["M03", "HS02", "Ngữ văn 11", "08/09"],
    ];
    var DICH = "HS02";   // học sinh bị đem ra xoá thử

    var node = MH.el(MH.khung("An toàn và toàn vẹn dữ liệu — xoá một học sinh đang mượn sách",
      "Bảng HOC_SINH có khoá chính ma_hs, bảng MUON có khoá ngoài ma_hs trỏ về đó. " +
      "Em thử xoá học sinh <b>HS02</b> — người đang giữ 2 quyển sách — rồi bật/tắt ràng buộc để so kết quả.",
      '<div data-mh="san"></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="tat"> tắt ràng buộc khoá ngoài</label>'));
    var loi = loiCua(node);
    var san = node.querySelector('[data-mh="san"]');
    function tat() { return node.querySelector('[data-mh="tat"]').checked; }

    /* Hai mốc mất dữ liệu khác hẳn nhau giữa hai chế độ, tách riêng cho rõ: tắt
       ràng buộc thì học sinh biến mất trước (bước 2) và lượt mượn ở lại; bật
       ràng buộc thì phải xoá lượt mượn trước (bước 3) mới xoá được học sinh. */
    function matHS() { return tat() ? buoc >= 2 : buoc >= 4; }
    function matMuon() { return !tat() && buoc >= 3; }

    function bangHS() {
      var h = '<div><h5>HOC_SINH</h5><table class="mh4-b"><tr>' +
        '<th class="mh8-khoa">ma_hs</th><th>ho_ten</th><th>lop</th></tr>';
      for (var i = 0; i < HS.length; i++) {
        var r = HS[i], la = r[0] === DICH;
        if (la && matHS()) continue;
        h += '<tr class="' + (la && buoc >= 1 ? "nay" : "") + '">' +
          '<td class="mh8-khoa">' + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td></tr>";
      }
      return h + "</table></div>";
    }

    function bangMuon() {
      var h = '<div><h5>MUON</h5><table class="mh4-b"><tr>' +
        '<th class="mh8-khoa">ma_muon</th><th class="mh8-khoa">ma_hs</th><th>ten_sach</th><th>ngay</th></tr>';
      for (var i = 0; i < MU.length; i++) {
        var r = MU[i], la = r[1] === DICH;
        if (la && matMuon()) continue;
        var moCoi = la && matHS();          // dòng con còn sống mà cha đã mất
        var lop = moCoi ? "rac" : (la && buoc >= 1 ? "khop" : "");
        h += '<tr class="' + lop + '"><td class="mh8-khoa">' + esc(r[0]) + "</td>" +
          '<td class="mh8-khoa' + (moCoi ? " mh8-lech" : "") + '">' + esc(r[1]) + "</td>" +
          "<td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td></tr>";
      }
      return h + "</table></div>";
    }

    /* Truy vấn ghép hai bảng — chỗ hậu quả lộ ra rõ nhất: mã vẫn còn đó nhưng
       không tra ra được tên ai. */
    function bangTraCuu() {
      var h = '<table class="mh4-b"><tr><th>ma_muon</th><th class="mh8-khoa">ma_hs</th>' +
        "<th>ho_ten (tra từ HOC_SINH)</th></tr>";
      for (var i = 0; i < MU.length; i++) {
        var r = MU[i], ten = "", co = false;
        for (var j = 0; j < HS.length; j++) {
          if (HS[j][0] === r[1] && !(HS[j][0] === DICH && matHS())) { ten = HS[j][1]; co = true; }
        }
        h += '<tr class="' + (co ? "" : "rac") + '"><td>' + esc(r[0]) + "</td>" +
          '<td class="mh8-khoa' + (co ? "" : " mh8-lech") + '">' + esc(r[1]) + "</td>" +
          '<td class="' + (co ? "" : "mh8-lech") + '">' + (co ? esc(ten) : "(không tra được)") + "</td></tr>";
      }
      return h + "</table>";
    }

    function ve() {
      var t = tat(), h = "";
      h += '<div class="mh8-dem">Ràng buộc khoá ngoài: <b>' + (t ? "ĐANG TẮT" : "ĐANG BẬT") + "</b></div>";
      h += '<div class="mh4-hai">' + bangHS() + bangMuon() + "</div>";

      if (buoc >= 1) {
        h += '<div class="mh8-dem">Lệnh: <b>xoá học sinh HS02 khỏi bảng HOC_SINH</b></div>';
      }
      if (!t && buoc >= 2 && buoc < 4) {
        h += '<div class="mh8-canh">Không xoá được HS02: còn 2 bản ghi ở bảng MUON đang tham chiếu tới mã ' +
          "này (khoá ngoài ma_hs). Hãy xử lí các bản ghi con trước.</div>";
      }
      if (t && buoc >= 3) {
        h += '<div class="mh8-dem">Truy vấn: <b>ai đang mượn sách?</b></div>' + bangTraCuu();
      }
      if (buoc >= 4) {
        h += '<div class="mh7-ghi' + (t ? "" : " xong") + '">' +
          (t
            ? "Tắt ràng buộc thì lệnh xoá chạy trót lọt, nhưng cơ sở dữ liệu đã hỏng: M01 và M03 vẫn giữ mã " +
              "HS02 trỏ vào hư không — đó là <b>bản ghi mồ côi</b>. Không ai biết hai quyển sách kia đang ở " +
              "đâu, và không có thông báo lỗi nào để em biết mà sửa."
            : "Bật ràng buộc thì hệ quản trị chặn ngay lúc thao tác, buộc em xử lí lượt mượn trước rồi mới " +
              "xoá học sinh. Kết quả: hai bảng vẫn khớp nhau, không còn mã nào trỏ vào hư không.") +
          "<br><br>Phân biệt hai khái niệm dễ lẫn: <b>an toàn</b> là phân quyền và sao lưu — chống mất và lộ " +
          "dữ liệu; <b>toàn vẹn</b> là các ràng buộc như khoá ngoài — chống dữ liệu vô lí.</div>";
      }
      san.innerHTML = h;
    }

    var LOI_TAT = [
      "Hai bảng đang khớp nhau: mỗi ma_hs trong MUON đều tìm được người ở HOC_SINH. Ô tích đang TẮT ràng " +
        "buộc — bấm “Bước tiếp” để xem hậu quả.",
      "Em ra lệnh xoá HS02. Hai dòng xanh ở bảng MUON là các lượt mượn đang trỏ tới học sinh này.",
      "Xoá xong, không lỗi gì cả. Nhưng nhìn bảng MUON: M01 và M03 vẫn còn, vẫn ghi ma_hs = HS02 — trong khi " +
        "HS02 đã biến mất. Ngộ nhận “xoá bảng cha thì bảng con tự ổn” sai ở đúng chỗ này.",
      "Truy vấn ghép hai bảng để xem ai đang mượn: hai dòng ra tên trống vì không tra được HS02. Sách mất dấu, " +
        "mà phải nhiều tháng sau thủ thư mới phát hiện.",
      "Kết luận: ràng buộc khoá ngoài không phải để làm khó em, mà để hệ quản trị chặn ngay lúc thao tác thay " +
        "vì để dữ liệu hỏng âm thầm.",
    ];
    var LOI_BAT = [
      "Ràng buộc khoá ngoài đang BẬT: hệ quản trị cam kết mọi ma_hs trong MUON đều phải có thật ở HOC_SINH.",
      "Em ra lệnh xoá HS02. Hai dòng xanh là các lượt mượn đang trỏ tới học sinh này.",
      "Hệ quản trị <b>từ chối xoá</b> và báo lỗi ngay. Bảng HOC_SINH còn nguyên HS02 — dữ liệu vẫn toàn vẹn, " +
        "không có gì hỏng ngầm.",
      "Cách làm đúng: xoá (hoặc trả) hai lượt mượn M01, M03 trước. Giờ không còn dòng con nào trỏ tới HS02 nữa.",
      "Lúc này lệnh xoá HS02 được chấp nhận, vì xoá xong vẫn không sinh ra bản ghi mồ côi nào.",
    ];

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= 4) {
        loi("Đã hết bước. Em tích hoặc bỏ tích ô <b>“tắt ràng buộc khoá ngoài”</b> ở trên để chạy lại theo " +
          "chế độ kia mà so sánh.");
        return;
      }
      buoc++;
      ve();
      loi((tat() ? LOI_TAT : LOI_BAT)[buoc]);
    };

    function lamLai() {
      buoc = 0;
      ve();
      loi((tat() ? LOI_TAT : LOI_BAT)[0]);
    }
    ganDatLai(node, [node.querySelector('[data-mh="tat"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-27 · TẠO BẢNG, ĐẶT RÀNG BUỘC VÀ THỐNG KÊ BẰNG SQL
   *
   *  NGỘ NHẬN gốc: học sinh coi ràng buộc là thứ "phải học thuộc để thi", nên
   *  không thấy nó làm gì. Cách chữa duy nhất là cho các em CHỨNG KIẾN hệ quản
   *  trị chặn một dòng sai NGAY tại chỗ, kèm tên đúng ràng buộc đã chặn — và
   *  dòng đó biến mất, không hề lọt vào bảng. Cuối cùng chạy GROUP BY trên đúng
   *  dữ liệu vừa được lọc sạch, để thấy số dòng kết quả bằng số NHÓM.
   * ================================================================ */
  MH.dangKy("C11-27", function (host) {
    /* Mỗi dòng CREATE TABLE có chỉ số cố định; khi một lệnh chèn bị chặn thì tô
       sáng ĐÚNG dòng khai báo đã chặn nó — nối được lỗi với nguyên nhân. */
    var TAO = [
      "CREATE TABLE HOC_SINH (",
      "  ma_hs   CHAR(4)      PRIMARY KEY,",
      "  ho_ten  VARCHAR(50)  NOT NULL,",
      "  lop     VARCHAR(10)  NOT NULL,",
      "  diem_tb DECIMAL(3,1) CHECK (diem_tb >= 0 AND diem_tb <= 10)",
      ");",
    ];

    var DS = [
      { ma: "HS01", ten: "Lê An", lop: "12A", diem: 8.5,
        giai: "Bốn giá trị đều thoả: mã <code>HS01</code> chưa ai dùng, họ tên và lớp đều có, điểm 8.5 nằm " +
          "trong 0–10 → dòng được <b>ghi vào bảng</b>." },
      { ma: "HS02", ten: "Trần Bình", lop: "12A", diem: 7.0,
        giai: "Mã <code>HS02</code> khác mọi mã đang có, các cột bắt buộc đều có giá trị, điểm 7.0 hợp lệ → " +
          "<b>vào bảng</b>. Bảng giờ có 2 dòng." },
      { ma: "HS01", ten: "Vũ Chi", lop: "12B", diem: 9.0, dong: 1,
        bao: "LỖI: vi phạm ràng buộc PRIMARY KEY trên cột ma_hs — giá trị 'HS01' đã tồn tại. " +
          "Lệnh bị từ chối, không dòng nào được ghi.",
        giai: "Mã <code>HS01</code> đã có ở dòng đầu. <b>PRIMARY KEY</b> buộc mọi giá trị <code>ma_hs</code> " +
          "phải <b>khác nhau</b> và <b>không được rỗng</b> — mỗi dòng phải có một “chứng minh thư” riêng. " +
          "Dòng đỏ này <b>không vào bảng chút nào</b>, chứ không phải vào rồi sửa sau." },
      { ma: "HS03", ten: null, lop: "12B", diem: 8.0, dong: 2,
        bao: "LỖI: vi phạm ràng buộc NOT NULL trên cột ho_ten — không được để trống (NULL). Lệnh bị từ chối.",
        giai: "Mã <code>HS03</code> không trùng ai, nhưng <code>ho_ten</code> bỏ trống. Cột này khai " +
          "<b>NOT NULL</b> nghĩa là <b>bắt buộc phải có giá trị</b>, nên hệ quản trị chặn. Nếu không có ràng " +
          "buộc này, vài tháng sau em mới phát hiện một học sinh không tên — lúc đó chẳng biết đó là ai." },
      { ma: "HS04", ten: "Phạm Dung", lop: "12C", diem: 12.5, dong: 4,
        bao: "LỖI: vi phạm ràng buộc CHECK (diem_tb >= 0 AND diem_tb <= 10) — giá trị 12.5 nằm ngoài khoảng " +
          "cho phép. Lệnh bị từ chối.",
        giai: "Mã, họ tên, lớp đều ổn; chỉ mỗi điểm 12.5 là vô lí. <b>CHECK</b> nghĩa là giá trị phải " +
          "<b>thoả điều kiện</b> đã ghi sẵn. Đây đúng kiểu gõ nhầm (12.5 thay vì 1.25 hay 2.5) mà mắt người " +
          "dò lại rất khó thấy." },
      { ma: "HS05", ten: "Ngô Hà", lop: "12C", diem: 9.5,
        giai: "Hợp lệ ở cả ba ràng buộc → <b>vào bảng</b>. Đây là dòng cuối cùng em thử chèn." },
    ];

    var bang, buoc, chan, vuaVao;

    var node = MH.el(MH.khung("Ràng buộc chặn dữ liệu sai ngay tại cửa",
      "Bảng <code>HOC_SINH</code> được tạo kèm ba loại ràng buộc. Bấm “Bước tiếp” để thử chèn từng dòng — " +
      "có dòng hợp lệ, có dòng sai. Xem hệ quản trị <b>chặn ngay</b> dòng sai và nói rõ nó phạm ràng buộc nào.",
      '<div class="mh8-sql" data-mh="tao"></div>' +
      '<div class="mh8-sql" data-mh="lenh"></div>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div data-mh="kqbox" hidden><div class="mh4-cuon"><table class="mh4-b" data-mh="kq"></table></div></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);
    function o(t) { return node.querySelector('[data-mh="' + t + '"]'); }

    function veTao(dong) {
      o("tao").innerHTML = TAO.map(function (t, i) {
        var c = "mh8-sd";
        if (dong >= 0) c += (i === dong ? " nay" : " mo");
        return '<div class="' + c + '">' + esc(t) + "</div>";
      }).join("");
    }
    function veLenh(t) { o("lenh").innerHTML = '<div class="mh8-sd nay">' + esc(t) + "</div>"; }
    function cauChen(r) {
      return "INSERT INTO HOC_SINH VALUES ('" + r.ma + "', " +
        (r.ten === null ? "NULL" : "'" + r.ten + "'") + ", '" + r.lop + "', " + r.diem.toFixed(1) + ");";
    }
    function oDong(r) {
      return "<td>" + esc(r.ma) + "</td><td>" + (r.ten === null ? "NULL" : esc(r.ten)) +
        "</td><td>" + esc(r.lop) + "</td><td>" + r.diem.toFixed(1) + "</td>";
    }

    function veBang() {
      var h = "<tr><th>ma_hs</th><th>ho_ten</th><th>lop</th><th>diem_tb</th></tr>";
      if (!bang.length && !chan) h += '<tr><td colspan="4">(bảng vừa tạo xong, chưa có dòng nào)</td></tr>';
      bang.forEach(function (r, i) {
        var c = (vuaVao && i === bang.length - 1) ? ' class="khop"' : "";
        h += "<tr" + c + ">" + oDong(r) + "</tr>";
      });
      /* Dòng bị chặn vẫn vẽ ra một nhịp cho học sinh nhìn thấy nó ĐỎ, rồi bước
         sau biến mất — đúng sự thật: nó chưa bao giờ nằm trong bảng. */
      if (chan) h += '<tr class="rac">' + oDong(chan) + "</tr>";
      o("bang").innerHTML = h;
    }

    function veDem() {
      o("dem").innerHTML = "Đã thử chèn <b>" + buoc + "</b>/" + DS.length +
        " dòng · vào bảng <b>" + bang.length + "</b> · bị chặn <b>" + (buoc - bang.length) + "</b>";
    }

    function nhom() {
      var ds = [], m = {};
      bang.forEach(function (r) {
        if (!m[r.lop]) { m[r.lop] = { lop: r.lop, n: 0, tong: 0 }; ds.push(m[r.lop]); }
        m[r.lop].n++; m[r.lop].tong += r.diem;
      });
      return ds;
    }

    function thongKe() {
      chan = null; vuaVao = false;
      veTao(-1); veBang();
      o("canh").hidden = true;
      veLenh("SELECT lop, COUNT(*), AVG(diem_tb) FROM HOC_SINH GROUP BY lop;");
      var g = nhom();
      var h = "<tr><th>lop</th><th>COUNT(*)</th><th>AVG(diem_tb)</th></tr>";
      g.forEach(function (x) {
        h += '<tr class="khop"><td>' + esc(x.lop) + "</td><td>" + x.n + "</td><td>" +
          (x.tong / x.n).toFixed(2) + "</td></tr>";
      });
      o("kq").innerHTML = h;
      o("kqbox").hidden = false;
      var ghi = o("ghi");
      ghi.hidden = false;
      ghi.className = "mh7-ghi xong";
      ghi.innerHTML = "Bảng có <b>" + bang.length + " dòng</b> nhưng kết quả chỉ có <b>" + g.length +
        " dòng</b> — vì <b>GROUP BY lop</b> gom mọi dòng cùng lớp thành <b>MỘT</b> dòng kết quả. " +
        "Số dòng kết quả bằng <b>số nhóm</b>, không phải số dòng của bảng. <code>COUNT(*)</code> và " +
        "<code>AVG(diem_tb)</code> tính riêng <b>trong từng nhóm</b>, không phải trên cả bảng. " +
        "Và điểm trung bình này <b>tin được</b>: 3 dòng sai đã bị chặn ở cửa. Nếu không có ràng buộc, " +
        "dòng điểm 12.5 đã lọt vào và kéo lệch mọi con số thống kê — vài tháng sau mới phát hiện thì " +
        "không còn biết dòng nào đúng, dòng nào sai.";
      loi("Xong. Ràng buộc <b>không phải để làm khó</b> — nó giữ cho dữ liệu sạch ngay từ lúc nhập.");
    }

    o("tien").onclick = function () {
      if (buoc > DS.length) { loi("Đã hết các bước. Bấm “Làm lại” để chạy lại từ đầu."); return; }
      if (buoc === DS.length) { buoc++; thongKe(); return; }
      var r = DS[buoc];
      buoc++;
      veLenh(cauChen(r));
      o("kqbox").hidden = true;
      o("ghi").hidden = true;
      if (r.dong === undefined) {
        chan = null; vuaVao = true; bang.push(r);
        veTao(-1);
        o("canh").hidden = true;
      } else {
        chan = r; vuaVao = false;
        veTao(r.dong);
        o("canh").hidden = false;
        o("canh").textContent = r.bao;
      }
      veBang(); veDem();
      loi(r.giai);
    };

    function lamLai() {
      bang = []; buoc = 0; chan = null; vuaVao = false;
      veTao(-1);
      veLenh("-- chưa chèn dòng nào");
      veBang(); veDem();
      o("canh").hidden = true;
      o("kqbox").hidden = true;
      o("ghi").hidden = true;
      loi("Bảng đã tạo xong với ba loại ràng buộc. Bấm “Bước tiếp” để thử chèn dòng đầu tiên.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U12-06 · THÊM BIỂU MẪU VÀO TRANG WEB
   *
   *  NGỘ NHẬN đắt nhất, và là bẫy đề kinh điển: quên thuộc tính name. Biểu mẫu
   *  thiếu name nhìn KHÔNG khác gì biểu mẫu đúng — vẫn hiện, vẫn gõ được, không
   *  báo lỗi — chỉ tới lúc gửi thì ô đó lặng lẽ vắng mặt. Cách duy nhất dạy nổi
   *  là cho học sinh gõ vào ô rồi bấm Gửi và tự thấy chữ mình vừa gõ biến mất.
   *  Kèm theo: tách bạch id (để label trỏ tới) với name (để gửi dữ liệu).
   * ================================================================ */
  MH.dangKy("U12-06", function (host) {
    var b;        // 0 = mới có vỏ form ... 5 = đủ nút, 6 = đã bấm Gửi
    var daGui;    // đã gửi lần nào chưa (để vừa gõ vừa thấy chuỗi dữ liệu đổi theo)
    var gt;       // giá trị đang có trong các ô, giữ riêng để vẽ lại không mất chữ đã gõ
    /* id phải duy nhất trong cả trang app chứ không chỉ trong minh hoạ này, nếu
       không thì label của bài khác có thể trỏ nhầm sang ô ở đây. */
    var uid = "u1206x";

    var node = MH.el(MH.khung("Biểu mẫu: thiếu name thì ô đó không gửi được gì",
      "Bấm “Bước tiếp” để lắp dần biểu mẫu — bên trái là code, bên phải là biểu mẫu <b>thật</b>, " +
      "em gõ vào được. Lắp xong thì bấm <b>Gửi</b> để xem dữ liệu nào thực sự rời khỏi trình duyệt, " +
      "rồi tích ô <b>“bỏ name”</b> và gửi lại.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Code HTML</p><div class="mh7-code" data-mh="code"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trình duyệt vẽ ra</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Đăng kí câu lạc bộ Tin học</div>' +
      '<div class="mh7-noi" data-mh="xem"></div></div></div>' +
      '</div><p class="mh8-dem" data-mh="gui" hidden></p>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="bo"> bỏ thuộc tính name của ô Họ tên</label>'));

    var loi = loiCua(node);
    function boName() { return node.querySelector('[data-mh="bo"]').checked; }

    /* Mã hoá y như trình duyệt làm khi gửi: dấu cách thành +, kí tự đặc biệt
       thành %.. — nên chữ có dấu tiếng Việt sẽ dài ngoằng, đó là chuyện bình
       thường chứ không phải lỗi. */
    function ma(s) { return encodeURIComponent(s).replace(/%20/g, "+"); }

    /* Mỗi dòng code kèm số bước mà nó xuất hiện: bằng bước hiện tại thì sáng
       lên, lớn hơn thì để mờ cho thấy trước còn phải đi tới đâu. */
    function dsDong() {
      var oTen = boName()
        ? '  &lt;input type="text" id="ten"&gt;'
        : '  &lt;input type="text" id="ten" name="ten"&gt;';
      return [
        [0, '&lt;form action="dangky.php" method="post"&gt;'],
        [1, '  &lt;label for="ten"&gt;Họ tên:&lt;/label&gt;'],
        [1, oTen],
        [2, '  &lt;label for="email"&gt;Email:&lt;/label&gt;'],
        [2, '  &lt;input type="email" id="email" name="email"&gt;'],
        [3, '  &lt;label&gt;&lt;input type="radio" name="khoi" value="A"&gt; Khối A&lt;/label&gt;'],
        [3, '  &lt;label&gt;&lt;input type="radio" name="khoi" value="B"&gt; Khối B&lt;/label&gt;'],
        [4, '  &lt;textarea name="ghichu" rows="2"&gt;&lt;/textarea&gt;'],
        [5, '  &lt;button type="submit"&gt;Gửi&lt;/button&gt;'],
        [0, "&lt;/form&gt;"],
      ];
    }

    function veCode() {
      node.querySelector('[data-mh="code"]').innerHTML = dsDong().map(function (d) {
        var c = "mh7-d";
        if (d[0] === b) c += " nay";
        else if (d[0] > b) c += " mo";
        return '<div class="' + c + '">' + d[1] + "</div>";
      }).join("");
    }

    /* CỐ Ý KHÔNG dùng thẻ <form> thật ở bên phải: form thật nằm chung tài liệu
       với app, bấm Gửi là trình duyệt nạp lại cả trang và học sinh mất sạch bài
       đang làm. Bên phải chỉ là <div> chứa các ô nhập thật, chuỗi dữ liệu tự
       tính bằng JS đúng luật trình duyệt; code BÊN TRÁI vẫn viết <form> như SGK. */
    function veXem() {
      var x = node.querySelector('[data-mh="xem"]');
      if (b === 0) {
        x.innerHTML = '<span class="mh7-trong">Biểu mẫu rỗng — mới có cái vỏ &lt;form&gt;, ' +
          "chưa có ô nào để nhập.</span>";
        return;
      }
      var h = '<p><label for="' + uid + 'ten">Họ tên:</label> ' +
        '<input type="text" id="' + uid + 'ten" data-o="ten" value="' + esc(gt.ten) + '"></p>';
      if (b >= 2) h += '<p><label for="' + uid + 'em">Email:</label> ' +
        '<input type="email" id="' + uid + 'em" data-o="email" value="' + esc(gt.email) + '"></p>';
      if (b >= 3) h += "<p>Khối thi: " +
        '<label><input type="radio" name="' + uid + 'k" value="A" data-o="khoi"' +
        (gt.khoi === "A" ? " checked" : "") + "> Khối A</label> &nbsp; " +
        '<label><input type="radio" name="' + uid + 'k" value="B" data-o="khoi"' +
        (gt.khoi === "B" ? " checked" : "") + "> Khối B</label></p>";
      if (b >= 4) h += '<p><label for="' + uid + 'gc">Ghi chú:</label><br>' +
        '<textarea id="' + uid + 'gc" rows="2" data-o="ghichu">' + esc(gt.ghichu) + "</textarea></p>";
      if (b >= 5) h += '<p><button type="button" data-mh="nut">Gửi</button></p>';
      x.innerHTML = h;

      var os = x.querySelectorAll("[data-o]");
      for (var i = 0; i < os.length; i++) ganO(os[i]);
      var nut = x.querySelector('[data-mh="nut"]');
      if (nut) nut.onclick = function () { b = 6; daGui = true; ve(); noiGui(); };
    }

    function ganO(o) {
      o.addEventListener(o.type === "radio" ? "change" : "input", function () {
        if (o.type === "radio") gt.khoi = o.value;
        else gt[o.getAttribute("data-o")] = o.value;
        /* Đang gõ mà vẽ lại cả khung thì mất con trỏ, nên chỉ cập nhật riêng
           dòng dữ liệu gửi đi — vừa gõ vừa thấy chuỗi đổi theo. */
        if (daGui) veGui();
      });
    }

    /* Đúng luật trình duyệt: ô có name thì luôn được gửi kể cả đang để trống,
       ô không có name thì không bao giờ được gửi, radio chưa chọn thì vắng mặt. */
    function chuoiGui() {
      var p = [];
      if (!boName()) p.push("ten=" + ma(gt.ten));
      p.push("email=" + ma(gt.email));
      if (gt.khoi) p.push("khoi=" + gt.khoi);
      p.push("ghichu=" + ma(gt.ghichu));
      return p.join("&");
    }

    function veGui() {
      var g = node.querySelector('[data-mh="gui"]');
      g.hidden = !daGui;
      if (daGui) g.innerHTML = "POST tới dangky.php &rarr; <b>" + esc(chuoiGui()) + "</b>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !daGui;
      if (!daGui) return;
      ghi.className = "mh7-ghi" + (boName() ? "" : " xong");
      ghi.innerHTML = boName()
        ? "Nhìn bên phải: ô Họ tên <b>vẫn hiện, vẫn gõ được</b>, trình duyệt không báo lỗi gì. " +
          "Nhưng trong chuỗi gửi đi <b>không còn ten=</b> — máy chủ nhận được một hồ sơ mất tên. " +
          "<b>Thiếu name thì dữ liệu ô đó không được gửi</b>, dù nhìn vẫn bình thường. Chú ý ô này " +
          "vẫn còn <b>id=\"ten\"</b> nên bấm vào chữ “Họ tên” con trỏ vẫn nhảy vào ô: " +
          "<b>id để label trỏ tới, name để gửi dữ liệu</b> — hai thứ khác nhau, đừng lẫn."
        : "Mỗi ô có <b>name</b> đều góp một cặp <i>name=giá trị</i>, nối nhau bằng dấu &amp;. " +
          "Ô để trống vẫn được gửi (chỉ là giá trị rỗng), riêng radio <b>chưa chọn thì vắng mặt</b>. " +
          "Thứ được gửi của radio là <b>value</b> chứ không phải chữ “Khối A” hiện bên cạnh. " +
          "Giờ tích ô <b>“bỏ name”</b> ở trên rồi so lại chuỗi này.";
    }

    function ve() { veCode(); veXem(); veGui(); }

    function noiGui() {
      loi(boName()
        ? "Đã gửi. Dò trong chuỗi trên xem có <b>ten=</b> không — và giải thích vì sao."
        : "Đã gửi. Thử gõ lại vào các ô bên phải, chuỗi dữ liệu đổi theo ngay.");
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= 6) {
        loi("Hết bước rồi. Em gõ vào các ô bên phải, hoặc tích/bỏ tích ô <b>“bỏ name”</b> để so hai " +
          "chuỗi dữ liệu.");
        return;
      }
      b++;
      if (b === 6) daGui = true;
      ve();
      if (b === 1) {
        loi("Thêm nhãn và ô nhập. <b>for</b> của &lt;label&gt; phải trùng <b>id</b> của ô thì bấm vào chữ " +
          "“Họ tên” con trỏ mới nhảy vào ô — thử bấm bên phải xem. Còn <b>name</b> là tên dùng lúc gửi: " +
          "<b>id để label trỏ tới, name để gửi dữ liệu</b>.");
      } else if (b === 2) {
        loi("Ô này để <b>type=\"email\"</b>: trình duyệt tự kiểm tra định dạng (thiếu @ là báo lỗi) và " +
          "trên điện thoại hiện bàn phím có sẵn @. Vẫn là &lt;input&gt; — <b>thẻ rỗng, không có thẻ đóng</b>.");
      } else if (b === 3) {
        loi("Hai nút tròn <b>cùng name=\"khoi\"</b> nên chúng <b>loại trừ nhau</b>: chọn A thì B tự bỏ " +
          "(thử bên phải). Đặt hai name khác nhau là tích được cả hai — sai ý đồ ngay. Thứ gửi đi là " +
          "<b>value</b>, không phải chữ hiện bên cạnh.");
      } else if (b === 4) {
        loi("&lt;textarea&gt; là ô nhập <b>nhiều dòng</b> và <b>có thẻ đóng</b> &lt;/textarea&gt; — khác " +
          "&lt;input&gt; là thẻ rỗng. Chữ mặc định đặt giữa cặp thẻ, không đặt ở thuộc tính value.");
      } else if (b === 5) {
        loi("Thêm <b>&lt;button type=\"submit\"&gt;</b> — nút gửi. Bấm nút <b>Gửi</b> bên phải (hoặc bấm " +
          "“Bước tiếp”) để xem dữ liệu nào thực sự được gửi đi.");
      } else {
        noiGui();
      }
    };

    function lamLai() {
      b = 0; daGui = false;
      gt = { ten: "Nguyen An", email: "an@lop12a1.vn", khoi: "", ghichu: "" };
      ve();
      loi("Mới có cái vỏ <b>&lt;form&gt;</b>: <b>action</b> là địa chỉ trang sẽ nhận dữ liệu, <b>method</b> " +
        "là cách gửi (<b>post</b> gửi kín trong thân yêu cầu, <b>get</b> gắn luôn vào địa chỉ). Vỏ chưa có " +
        "ô nào nên chưa gửi được gì.");
    }
    /* Ô tích KHÔNG nối vào ganDatLai như các minh hoạ khác: "bỏ name" là thứ
       phải so sánh ngay tại bước cuối, mà đặt lại về bước 0 là mất luôn phép so. */
    ganDatLai(node, [], lamLai);
    node.querySelector('[data-mh="bo"]').addEventListener("change", ve);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U12-05 · LIÊN KẾT TRANG VÀ THANH ĐIỀU HƯỚNG (MENU)
   *
   *  NGỘ NHẬN đắt nhất: học sinh đọc href="index.html" và hiểu là "về trang chủ".
   *  Sai — đường dẫn tương đối tính từ THƯ MỤC CHỨA TRANG ĐANG ĐỨNG, nên ở
   *  bai-viet/bai-1.html máy đi tìm website/bai-viet/index.html, tệp không hề có.
   *  Giảng suông không ăn thua vì viết sai KHÔNG báo lỗi lúc gõ, phải bấm mới ra
   *  404. Nên mô phỏng bày đúng khoảnh khắc đó: mỗi href hiện ra "máy giải thành
   *  tệp nào" rồi mới nói tệp ấy có hay không.
   * ================================================================ */
  MH.dangKy("U12-05", function (host) {
    var DANG = "website/bai-viet/bai-1.html";   // trang đang đứng, cố định cả bài

    var CAY = [
      { t: "website/", p: "website/" },
      { t: "  index.html", p: "website/index.html" },
      { t: "  gioi-thieu.html", p: "website/gioi-thieu.html" },
      { t: "  anh/", p: "website/anh/" },
      { t: "    logo.png", p: "website/anh/logo.png" },
      { t: "  bai-viet/", p: "website/bai-viet/" },
      { t: "    bai-1.html", p: "website/bai-viet/bai-1.html" },
      { t: "    bai-2.html", p: "website/bai-viet/bai-2.html" },
    ];

    var TRANG = {
      "website/index.html": { tab: "Trang chủ",
        noi: "<h1>CLB Tin học 12A1</h1><p>Chào mừng em tới trang chủ của câu lạc bộ.</p>" },
      "website/gioi-thieu.html": { tab: "Giới thiệu",
        noi: "<h1>Giới thiệu</h1><p>Câu lạc bộ thành lập năm 2023.</p>" },
      "website/bai-viet/bai-2.html": { tab: "Bài 2",
        noi: "<h1>Bài 2: Sắp xếp nổi bọt</h1><p>Nội dung bài viết thứ hai.</p>" },
      "website/anh/logo.png": { tab: "logo.png",
        noi: '<p><span class="mh7-trong">(ảnh logo.png hiện ra một mình, không phải trang web)</span></p>' },
    };

    var MUC = [
      { h: "../index.html", t: "Trang chủ" },
      { h: "../gioi-thieu.html", t: "Giới thiệu" },
      { h: "bai-1.html", t: "Bài 1" },
      { h: "bai-2.html", t: "Bài 2" },
    ];

    var B = [
      { href: "bai-2.html", nhan: "cùng thư mục", ra: "website/bai-viet/bai-2.html",
        giai: "Đường dẫn <b>tương đối</b>, không có dấu gì phía trước. Máy hiểu là “tìm ngay trong thư mục " +
          "đang chứa trang này”, tức <code>website/bai-viet/</code>. Ở đó có <code>bai-2.html</code> thật nên " +
          "liên kết chạy được." },
      { href: "index.html", nhan: "lỗi kinh điển", ra: "website/bai-viet/index.html",
        giai: "Em định về trang chủ, nhưng máy <b>không</b> hiểu vậy. Nó vẫn tìm trong thư mục hiện tại " +
          "<code>website/bai-viet/</code> và đòi tệp <code>bai-viet/index.html</code> — trong cây bên trái " +
          "<b>không có</b> tệp ấy. Nhớ kĩ: đường dẫn tương đối tính từ <b>thư mục chứa trang đang mở</b>, " +
          "chứ không phải từ gốc website." },
      { href: "../index.html", nhan: "lùi ra một cấp", ra: "website/index.html",
        giai: "Hai dấu chấm <b>..</b> nghĩa là <b>lùi ra thư mục cha một cấp</b>. Đang ở " +
          "<code>website/bai-viet/</code>, lùi một cấp thì ra <code>website/</code>, rồi mới lấy " +
          "<code>index.html</code> ở đó. Đây mới là cách viết đúng cho bước trước." },
      { href: "../anh/logo.png", nhan: "lùi ra rồi vào thư mục khác", ra: "website/anh/logo.png",
        giai: "Đọc từ trái sang: <b>..</b> lùi ra <code>website/</code>, rồi <b>anh/</b> đi vào thư mục anh, " +
          "cuối cùng lấy <code>logo.png</code>. Muốn sang một nhánh khác của cây thì phải lùi ra tới chỗ rẽ " +
          "chung rồi mới đi vào — y như đi đường." },
      { href: "/index.html", nhan: "tuyệt đối từ gốc", ra: "website/index.html",
        giai: "Dấu <b>/</b> ở <b>đầu</b> đổi hẳn luật chơi: bỏ qua thư mục hiện tại, bắt đầu đếm từ " +
          "<b>gốc website</b>. Nên dù em đặt liên kết này ở trang nào, nằm sâu mấy tầng, nó luôn ra " +
          "<code>website/index.html</code>. Đây là lí do menu chung của cả site hay dùng kiểu này." },
      { href: "https://vi.wikipedia.org", nhan: "sang website khác", ra: null,
        giai: "Có <b>https://</b> và tên miền ở đầu thì đó là đường dẫn <b>tuyệt đối đầy đủ</b>: nó chỉ tới " +
          "một máy chủ khác, không liên quan gì tới cây thư mục của em. Muốn dẫn ra ngoài thì bắt buộc viết " +
          "đủ như vậy." },
      { menu: 1, nhan: "Thanh menu chỉ là một danh sách liên kết", ra: null,
        giai: "Thanh điều hướng <b>không có thẻ thần kì nào cả</b>. Nó chỉ là <b>&lt;nav&gt;</b> (thẻ báo " +
          "“đây là vùng điều hướng”) bọc một <b>&lt;ul&gt;</b> gồm các <b>&lt;li&gt;</b>, mỗi &lt;li&gt; chứa " +
          "một <b>&lt;a&gt;</b>. Nhìn bên phải: chưa có CSS thì nó hiện đúng như danh sách gạch đầu dòng " +
          "<b>xếp dọc</b> — vì đó thực sự là một cái danh sách." },
      { menu: 2, nhan: "CSS xếp danh sách nằm ngang", ra: null,
        giai: "Vẫn <b>y nguyên</b> đoạn HTML đó, chỉ thêm CSS cho các &lt;li&gt; nằm cạnh nhau và bỏ dấu " +
          "chấm đầu dòng. Giờ nó trông như thanh menu quen thuộc. Vậy “menu” là <b>kết quả của CSS</b>, " +
          "không phải một loại thẻ riêng. Chú ý các href trong menu: hai mục đầu có <code>../</code> vì " +
          "trang này nằm trong thư mục con." },
    ];

    var b;   // chỉ số bước hiện tại

    var node = MH.el(MH.khung("Đường dẫn trong href dẫn tới đâu?",
      "Em đang đứng ở trang <code>website/bai-viet/bai-1.html</code>. Mỗi bước thử một kiểu viết " +
      "<code>href</code> khác nhau — xem máy <b>giải nó ra thành tệp nào</b> và tệp đó có tồn tại không. " +
      "Bấm thẳng vào một dòng trong danh sách dưới để nhảy tới bước đó.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="nhanTrai"></p>' +
      '<div class="mh7-code" data-mh="code"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Bấm liên kết thì ra cái này</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i><span data-mh="tab"></span></div>' +
      '<div class="mh7-noi" data-mh="noi"></div></div></div>' +
      "</div>" +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ds" data-mh="ds" style="margin-top:11px"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    /* Dựng đoạn nav thật. ngang = true thì kèm style trên từng <li>. Cố ý áp
       bằng style="" chứ không chèn thẻ <style>: trang render nằm chung tài liệu
       với app nên một luật ul/li sẽ rò ra toàn bộ giao diện. */
    function veMenu(ngang) {
      var sLi = ngang ? ' style="display:inline-block;margin-right:16px"' : "";
      var sUl = ngang ? ' style="list-style:none;padding-left:0"' : "";
      return "<nav><ul" + sUl + ">" + MUC.map(function (m) {
        return "<li" + sLi + '><a href="#">' + esc(m.t) + "</a></li>";
      }).join("") + "</ul></nav>";
    }

    function maMenu() {
      var d = ["<nav>", "  <ul>"];
      MUC.forEach(function (m) {
        d.push('    <li><a href="' + m.h + '">' + m.t + "</a></li>");
      });
      d.push("  </ul>", "</nav>");
      return d;
    }

    function ve() {
      var o = B[b];
      var oCode = node.querySelector('[data-mh="code"]');

      if (o.menu) {
        node.querySelector('[data-mh="nhanTrai"]').textContent = "Code thanh menu";
        oCode.innerHTML = maMenu().map(function (t) {
          return '<div class="mh7-d">' + esc(t) + "</div>";
        }).join("");
      } else {
        node.querySelector('[data-mh="nhanTrai"]').textContent = "Cây thư mục website";
        oCode.innerHTML = CAY.map(function (d) {
          /* Dòng sáng = đúng tệp mà href vừa giải ra. Bước 404 không dòng nào
             sáng — chính cái "không có gì sáng lên" đã nói hộ lỗi rồi. */
          return '<div class="mh7-d' + (o.ra === d.p ? " nay" : "") + '">' + esc(d.t) + "</div>";
        }).join("");
      }

      var tab = node.querySelector('[data-mh="tab"]');
      var noi = node.querySelector('[data-mh="noi"]');
      var dem = node.querySelector('[data-mh="dem"]');
      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = true;

      if (o.menu) {
        tab.textContent = "Bài 1";
        noi.innerHTML = veMenu(o.menu === 2) +
          "<h1>Bài 1: Tìm kiếm tuần tự</h1><p>Nội dung bài viết thứ nhất.</p>";
        dem.innerHTML = "Thẻ dùng: <b>&lt;nav&gt; &gt; &lt;ul&gt; &gt; &lt;li&gt; &gt; &lt;a&gt;</b>" +
          (o.menu === 2 ? " &nbsp;+&nbsp; <b>CSS xếp ngang</b>" : " &nbsp;—&nbsp; <b>chưa có CSS</b>");
      } else if (o.ra === null) {
        tab.textContent = "Wikipedia tiếng Việt";
        noi.innerHTML = "<h1>Wikipedia</h1><p>Em đã rời khỏi website của mình. " +
          '<a href="https://vi.wikipedia.org" target="_blank" rel="noopener">vi.wikipedia.org</a></p>';
        dem.innerHTML = 'href="<b>' + esc(o.href) + '</b>" &nbsp;&rarr;&nbsp; <b>một website khác</b>';
      } else if (TRANG[o.ra]) {
        tab.textContent = TRANG[o.ra].tab;
        noi.innerHTML = TRANG[o.ra].noi;
        dem.innerHTML = "Đang ở <b>" + esc(DANG) + "</b> &nbsp;&rarr;&nbsp; <b>" + esc(o.ra) + "</b>";
      } else {
        tab.textContent = "Không tìm thấy trang";
        noi.innerHTML = "<h1>404</h1><p>Không tìm thấy tệp <code>" + esc(o.ra) + "</code> trên máy chủ.</p>";
        dem.innerHTML = "Đang ở <b>" + esc(DANG) + "</b> &nbsp;&rarr;&nbsp; <b>" + esc(o.ra) + "</b>";
        canh.hidden = false;
        canh.innerHTML = "<b>Lỗi 404 — không có tệp này.</b> Lúc em gõ <code>href=\"" + esc(o.href) +
          "\"</code> thì trình duyệt <b>không hề báo lỗi</b>, trang vẫn mở bình thường; chỉ tới khi có " +
          "người <b>bấm vào</b> liên kết mới lòi ra 404. Sai đường dẫn là loại lỗi tự mình phải đi thử " +
          "từng liên kết mới thấy.";
      }

      node.querySelector('[data-mh="ds"]').innerHTML = B.map(function (x, i) {
        var ten = x.menu ? '<b class="van">' + esc(x.nhan) + "</b>"
          : "<b>" + esc('href="' + x.href + '"') + "</b><small>" + esc(x.nhan) + "</small>";
        return '<div class="mh7-m' + (i === b ? " nay" : "") + '" data-i="' + i + '">' + ten + "</div>";
      }).join("");

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = b < B.length - 1;
      ghi.className = "mh7-ghi xong";
      ghi.innerHTML = "Ba luật gói lại: <b>không có dấu gì ở đầu</b> = tìm từ thư mục chứa trang hiện tại; " +
        "<b>..</b> = lùi ra một cấp, viết mấy lần thì lùi mấy cấp; <b>/</b> ở đầu = đếm từ gốc website nên " +
        "đứng ở đâu cũng ra một chỗ. Còn <b>&lt;nav&gt;</b> chỉ là cái vỏ ngữ nghĩa bọc một &lt;ul&gt; các " +
        "&lt;a&gt; — trông ngang hay dọc là do CSS quyết định.";
    }

    /* Chặn điều hướng thật của mọi <a> trong khung xem, trừ liên kết ra ngoài
       (nó có target="_blank" nên mở tab mới, không cuốn app đi mất). */
    node.querySelector('[data-mh="noi"]').addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a && a.getAttribute("target") !== "_blank") e.preventDefault();
    });

    node.querySelector('[data-mh="ds"]').addEventListener("click", function (e) {
      var m = e.target && e.target.closest ? e.target.closest(".mh7-m") : null;
      if (!m) return;
      b = +m.getAttribute("data-i");
      ve(); loi(B[b].giai);
    });

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= B.length - 1) {
        loi("Hết bước rồi. Bấm vào một dòng trong danh sách để xem lại kiểu đường dẫn bất kì, " +
          "hoặc bấm “Làm lại”.");
        return;
      }
      b++; ve(); loi(B[b].giai);
    };

    function lamLai() { b = 0; ve(); loi(B[0].giai); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });
})();
