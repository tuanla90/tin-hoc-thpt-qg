/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 7: CHỦ ĐỀ E (THIẾT KẾ WEB) CỦA LỚP 12
 *
 *  VÌ SAO CẢ MỘT ĐỢT DÀNH RIÊNG CHO CHỦ ĐỀ NÀY: cả chủ đề E gần như TRẮNG minh
 *  hoạ (chỉ 3/13 bài có), mà đây lại đúng là chỗ mô phỏng ăn đứt đọc SGK. Học
 *  HTML/CSS bằng cách đọc mô tả thẻ trong sách là kiểu học tệ nhất có thể: học
 *  sinh thuộc tên thẻ nhưng không hình dung được thẻ đó BIẾN THÀNH CÁI GÌ trên
 *  màn hình. Vòng lặp "sửa code -> thấy trang đổi ngay" mới là thứ dạy được.
 *
 *  KHUÔN CHUNG CỦA ĐỢT NÀY — CHIA ĐÔI MÀN HÌNH: bên trái code, bên phải trang
 *  web render THẬT bằng chính trình duyệt đang chạy (không phải ảnh chụp, không
 *  phải mô tả). Hai bên luôn khớp nhau: dòng code đang xét sáng lên thì phần
 *  tương ứng bên phải cũng vừa hiện ra. Đây là điểm khác biệt so với sáu đợt
 *  trước — chúng vẽ trạng thái biến, còn đợt này vẽ chính kết quả cuối.
 *
 *  KHUNG "CỬA SỔ TRÌNH DUYỆT" (.mh7-xem) CỐ Ý ÉP NỀN TRẮNG CHỮ ĐEN, không dùng
 *  biến màu theo chủ đề sáng/tối của app. Lí do: đó là một trang web KHÁC đang
 *  được xem, không phải một phần giao diện app. Nếu nó đổi màu theo app thì học
 *  sinh mất luôn ranh giới "đây là app - kia là sản phẩm mình vừa viết ra".
 *
 *  Dùng khung dựng của js/minh-hoa.js (nạp SAU tệp đó).
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss7() {
    if (document.getElementById("mhCss7")) return;
    var st = document.createElement("style");
    st.id = "mhCss7";
    st.textContent =
      /* --- lưới chia đôi: code | kết quả --- */
      ".mh7-doi{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}" +
      ".mh7-panel{min-width:0}" +
      ".mh7-nhan{font:800 10.5px var(--font-sans);letter-spacing:.06em;text-transform:uppercase;" +
        "color:var(--text-soft);margin:0 0 6px}" +
      ".mh7-tep{display:inline-block;font:700 10.5px var(--font-mono);color:var(--text-soft);" +
        "background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:1px 7px;margin:0 0 5px}" +

      /* --- khối code, có dòng sáng --- */
      ".mh7-code{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;" +
        "padding:9px 4px;overflow-x:auto}" +
      /* width:max-content BẮT BUỘC: .mh7-d là block con của khung cuộn ngang,
         nên bề rộng của nó = bề rộng NHÌN THẤY chứ không phải bề rộng cuộn.
         Chữ thì tràn ra ngoài nhờ pre, còn nền vàng "dòng đang chạy" và vạch
         màu bên trái chỉ tô hết phần nhìn thấy — cuộn sang phải là mất luôn
         tín hiệu chính của minh hoạ. min-width:100% để dòng ngắn vẫn tô đủ. */
      ".mh7-d{font:600 12px/1.75 var(--font-mono);white-space:pre;padding:0 8px;" +
        "width:max-content;min-width:100%;box-sizing:border-box;border-left:3px solid transparent;" +
        "color:var(--text);transition:background .2s,opacity .2s}" +
      ".mh7-d.nay{background:var(--primary-soft);border-left-color:var(--primary);color:var(--primary)}" +
      ".mh7-d.mo{opacity:.32}" +

      /* --- cửa sổ trình duyệt giả. Màu cố định, xem chú thích đầu tệp. --- */
      ".mh7-xem{background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden;" +
        "box-shadow:0 1px 3px rgba(0,0,0,.08)}" +
      ".mh7-tab{background:#e9eaee;border-bottom:1px solid #d3d5db;padding:6px 10px;" +
        "font:700 11px var(--font-sans);color:#4a4d57;display:flex;align-items:center;gap:6px}" +
      ".mh7-tab i{width:8px;height:8px;border-radius:50%;background:#c4c6cd;flex:none}" +
      ".mh7-noi{padding:11px 13px;color:#1a1a1a;font:400 13.5px/1.5 var(--font-sans);min-height:64px}" +

      /* Trang bên trong phải trông như trang web mặc định, nên phải ghi đè lại
         mọi thứ styles.css của app đã đặt cho h1/p/ul/a... Không reset thì học
         sinh thấy <h1> ra đúng cỡ chữ tiêu đề của app — sai hoàn toàn ý bài. */
      ".mh7-noi h1{font:700 1.9em/1.25 var(--font-sans);margin:.5em 0;color:inherit}" +
      ".mh7-noi h2{font:700 1.45em/1.3 var(--font-sans);margin:.55em 0;color:inherit}" +
      ".mh7-noi h3{font:700 1.15em/1.35 var(--font-sans);margin:.6em 0;color:inherit}" +
      ".mh7-noi p{margin:.75em 0;color:inherit;font-size:1em;line-height:1.5}" +
      ".mh7-noi ul{list-style:disc;margin:.7em 0;padding-left:1.9em}" +
      ".mh7-noi ol{list-style:decimal;margin:.7em 0;padding-left:1.9em}" +
      ".mh7-noi li{margin:.18em 0;display:list-item;color:inherit}" +
      ".mh7-noi a{color:#0000ee;text-decoration:underline;font-weight:400}" +
      ".mh7-noi strong{font-weight:700}.mh7-noi em{font-style:italic}" +
      ".mh7-noi>*:first-child{margin-top:0}.mh7-noi>*:last-child{margin-bottom:0}" +
      ".mh7-noi table{border-collapse:collapse;margin:.4em 0}" +
      ".mh7-noi td,.mh7-noi th{border:1px solid #9aa0aa;padding:4px 10px;font-size:.93em;text-align:left}" +
      ".mh7-noi th{background:#eef0f3;font-weight:700;text-align:center}" +
      ".mh7-noi td.trong{background:repeating-linear-gradient(45deg,#fff,#fff 4px,#ffe4e4 4px,#ffe4e4 8px);" +
        "border-style:dashed;border-color:#e05252}" +
      ".mh7-trong{color:#9aa0aa;font-style:italic;font-size:12.5px}" +

      /* --- danh sách mục bấm được (bảng tra thẻ / chọn cách làm) --- */
      ".mh7-ds{display:flex;flex-direction:column;gap:5px}" +
      ".mh7-m{border:1.5px solid var(--border);background:var(--bg-card);border-radius:9px;" +
        "padding:6px 10px;cursor:pointer;transition:all .18s}" +
      ".mh7-m:hover{border-color:var(--primary)}" +
      ".mh7-m b{display:block;font:700 12.5px var(--font-mono);color:var(--text)}" +
      /* Mục nào là câu tiếng Việt chứ không phải tên thẻ thì bỏ font mono đi — để
         mono thì trông như code, học sinh tưởng phải gõ đúng chuỗi đó. */
      ".mh7-m b.van{font-family:var(--font-sans);font-size:12px}" +
      ".mh7-m small{display:block;font-size:11px;color:var(--text-soft);line-height:1.35;margin-top:1px}" +
      ".mh7-m.nay{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh7-m.nay b{color:var(--primary)}" +

      /* --- điểm ưu tiên của bộ chọn CSS --- */
      ".mh7-diem{float:right;font:800 10.5px var(--font-mono);color:var(--text-soft);" +
        "background:var(--bg-soft);border-radius:999px;padding:1px 8px;margin-left:8px}" +
      ".mh7-m.nay .mh7-diem{background:#fff;color:var(--primary)}" +
      ".mh7-m.thua{opacity:.5}" +
      ".mh7-thang{display:inline-block;font:800 9.5px var(--font-sans);letter-spacing:.05em;" +
        "background:var(--success);color:#fff;border-radius:999px;padding:1px 7px;margin-left:6px}" +

      ".mh7-tick{display:inline-flex;align-items:center;gap:6px;font:700 12.5px var(--font-sans);" +
        "color:var(--text-soft);cursor:pointer}" +
      ".mh7-tick input{accent-color:var(--primary);width:16px;height:16px}" +
      ".mh7-ghi{margin:11px 0 0;border-radius:9px;padding:9px 11px;font-size:12.5px;line-height:1.55;" +
        "background:var(--warning-soft);color:var(--text);border:1px solid var(--warning)}" +
      ".mh7-ghi.xong{background:var(--success-soft);border-color:var(--success)}" +

      /* Dưới 560px hai cột nằm cạnh nhau thì cột nào cũng hẹp đến mức không đọc
         nổi code lẫn trang. Xếp chồng, code trên - kết quả dưới, giữ đúng thứ tự
         nhân quả "viết cái này thì ra cái kia". */
      "@media (max-width:560px){.mh7-doi{grid-template-columns:1fr;gap:10px}}";
    (document.head || document.documentElement).appendChild(st);
  }
  napCss7();

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
  /* Dựng các dòng code từ mảng chuỗi. tới = số dòng đã "đọc xong", nay = dòng
     đang sáng. Dòng chưa tới thì mờ đi chứ không ẩn — để học sinh thấy trước
     mình đang đi tới đâu trong một tệp có sẵn, giống hệt lúc đọc code thật. */
  function veCode(oCode, dong, nay, toi) {
    oCode.innerHTML = dong.map(function (d, i) {
      var c = "mh7-d";
      if (i === nay) c += " nay";
      else if (toi !== undefined && i > toi) c += " mo";
      return '<div class="' + c + '">' + d + "</div>";
    }).join("");
  }

  /* ==================================================================
   *  C12-09 · HTML: TẠO BẢNG
   *
   *  NGỘ NHẬN đắt nhất: học sinh tìm chỗ khai báo "bảng này có mấy cột" và
   *  không thấy đâu cả — vì HTML KHÔNG có chỗ đó. Số cột được SUY RA từ số ô
   *  trong một hàng. Hệ quả trực tiếp là lỗi kinh điển: thêm cột mà chỉ thêm
   *  <td> vào một hàng, bảng vỡ ngay. Mô phỏng cho bấm nút "bớt một ô ở hàng
   *  cuối" để thấy tận mắt cái lỗ thủng đó, thay vì đọc lời cảnh báo suông.
   *
   *  Bảng dựng dần TỪNG HÀNG chứ không hiện luôn: mỗi bước một <tr>, để cặp
   *  "một <tr> = một hàng, các <td> bên trong = các ô của hàng ấy" tự lộ ra.
   * ================================================================ */
  MH.dangKy("C12-09", function (host) {
    var TIEU = ["Môn", "Giữa kì", "Cuối kì"];
    var DL = [
      ["Toán", "8.5", "9.0"],
      ["Văn", "7.0", "7.5"],
      ["Tin học", "9.5", "10"],
    ];
    var h;   // số hàng dữ liệu đã dựng xong (-1 = chưa dựng gì, 0 = mới có hàng tiêu đề)

    var node = MH.el(MH.khung("Bảng HTML: một &lt;tr&gt; là một hàng, các &lt;td&gt; bên trong là các ô",
      "Bấm “Bước tiếp” để dựng bảng <b>từng hàng một</b> — bên trái là code, bên phải là bảng thật " +
      "trình duyệt vẽ ra. Dựng xong rồi hãy tích ô <b>“thiếu một ô”</b> và tìm chỗ bảng bị thủng.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Code HTML</p><div class="mh7-code" data-mh="code"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trình duyệt vẽ ra</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Bảng điểm</div>' +
      '<div class="mh7-noi" data-mh="xem"></div></div></div>' +
      "</div><div class=\"mh7-ghi\" data-mh=\"ghi\" hidden></div>",
      '<label class="mh7-tick"><input type="checkbox" data-mh="thieu"> thiếu một ô ở hàng cuối</label>'));

    var loi = loiCua(node);
    function thieu() { return node.querySelector('[data-mh="thieu"]').checked; }

    /* Số ô của hàng cuối. Đây là chỗ duy nhất "thiếu ô" tác động tới, nhưng nó
       tác động tới CẢ code lẫn trang vẽ ra — cùng một nguồn, nên không bao giờ
       lệch nhau. */
    function soO(hang) {
      return thieu() && hang === DL.length - 1 ? TIEU.length - 1 : TIEU.length;
    }

    function dongCode() {
      var d = ["&lt;table&gt;"];
      if (h >= 0) {
        d.push("  &lt;tr&gt;");
        TIEU.forEach(function (t) { d.push("    &lt;th&gt;" + esc(t) + "&lt;/th&gt;"); });
        d.push("  &lt;/tr&gt;");
      }
      for (var r = 0; r < h; r++) {
        d.push("  &lt;tr&gt;");
        for (var c = 0; c < soO(r); c++) d.push("    &lt;td&gt;" + esc(DL[r][c]) + "&lt;/td&gt;");
        d.push("  &lt;/tr&gt;");
      }
      d.push("&lt;/table&gt;");
      return d;
    }

    function ve() {
      veCode(node.querySelector('[data-mh="code"]'), dongCode());
      var x = node.querySelector('[data-mh="xem"]');
      if (h < 0) { x.innerHTML = '<span class="mh7-trong">Bảng rỗng — mới chỉ có thẻ &lt;table&gt;.</span>'; }
      else {
        var t = "<table><tr>" + TIEU.map(function (v) { return "<th>" + esc(v) + "</th>"; }).join("") + "</tr>";
        for (var r = 0; r < h; r++) {
          t += "<tr>";
          for (var c = 0; c < soO(r); c++) t += "<td>" + esc(DL[r][c]) + "</td>";
          /* Ô còn thiếu vẽ bằng ô gạch chéo đỏ. Trình duyệt thật để trống hẳn,
             nhưng để trống thì trên màn hình nhỏ nhìn như bảng vẫn bình thường —
             tô lên mới thấy được "chỗ này đáng lẽ phải có ô". */
          for (var k = soO(r); k < TIEU.length; k++) t += '<td class="trong"></td>';
          t += "</tr>";
        }
        x.innerHTML = t + "</table>";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (h < DL.length) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh7-ghi" + (thieu() ? "" : " xong");
      ghi.innerHTML = thieu()
        ? "Hàng cuối chỉ có <b>" + (TIEU.length - 1) + "</b> thẻ &lt;td&gt; trong khi các hàng khác có <b>" +
          TIEU.length + "</b> — chỗ gạch chéo là ô bị hụt. HTML <b>không có chỗ nào khai báo “bảng này " +
          "mấy cột”</b>, số cột chỉ được suy ra từ số ô trong hàng, nên trình duyệt <b>không báo lỗi</b>, " +
          "nó cứ vẽ thiếu. Nhớ: thêm hay bớt một cột là phải sửa <b>mọi</b> hàng."
        : "Bảng có <b>" + (DL.length + 1) + "</b> thẻ &lt;tr&gt; (1 hàng tiêu đề + " + DL.length +
          " hàng dữ liệu), mỗi &lt;tr&gt; chứa <b>" + TIEU.length + "</b> ô nên bảng có " + TIEU.length +
          " cột. &lt;th&gt; và &lt;td&gt; đều là ô — khác nhau ở <b>ý nghĩa</b>: &lt;th&gt; là ô tiêu đề " +
          "(trình duyệt tự in đậm, căn giữa), &lt;td&gt; là ô dữ liệu thường.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (h >= DL.length) {
        loi(thieu()
          ? "Bỏ tích ô “thiếu một ô” rồi dựng lại để thấy bảng đầy đủ."
          : "Bảng xong rồi. Giờ tích ô <b>“thiếu một ô”</b> và xem trình duyệt xử lí ra sao.");
        return;
      }
      h++;
      ve();
      if (h === 0) {
        loi("Thêm một thẻ <b>&lt;tr&gt;</b> — đây là <b>một hàng</b>. Trong nó đặt " + TIEU.length +
          " thẻ <b>&lt;th&gt;</b>, mỗi thẻ là <b>một ô tiêu đề</b>. Chính " + TIEU.length +
          " ô này quyết định bảng có " + TIEU.length + " cột.");
      } else {
        var n = soO(h - 1);
        loi("Thêm hàng dữ liệu thứ <b>" + h + "</b>: một &lt;tr&gt; nữa, bên trong là <b>" + n +
          "</b> thẻ &lt;td&gt;" +
          (n < TIEU.length
            ? " — <b>thiếu mất một ô</b> so với hàng tiêu đề. Nhìn sang bên phải xem bảng hụt chỗ nào."
            : " ứng với " + n + " ô của hàng. Số ô khớp với hàng tiêu đề nên bảng vẫn vuông vắn."));
      }
    };

    function lamLai() {
      h = -1; ve();
      loi("Mới có cặp thẻ <b>&lt;table&gt;</b> bao ngoài — bảng còn rỗng. Bấm “Bước tiếp” để thêm hàng đầu tiên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="thieu"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-25 · BỘ CHỌN CSS MỞ RỘNG VÀ LUẬT ƯU TIÊN
   *
   *  NGỘ NHẬN đắt nhất, và là bẫy đề rất hay gặp: "luật nào viết SAU thì thắng".
   *  Câu đó chỉ đúng khi hai luật CÓ CÙNG độ ưu tiên. Đề chỉ cần đảo thứ tự
   *  cho luật #id nằm TRƯỚC luật .class là quá nửa lớp chọn sai.
   *
   *  Cách trị: cho bốn luật cùng nhắm vào MỘT thẻ, bật dần từng luật, mỗi bước
   *  hiện điểm ưu tiên của từng luật và tô luật đang thắng — chữ bên phải đổi
   *  màu ngay. Luật #3 cố ý đặt SAU luật #4 (id sau class) để bước cuối tự phá
   *  niềm tin "viết sau thắng" mà không cần giảng.
   * ================================================================ */
  MH.dangKy("C12-25", function (host) {
    /* d = [id, class, thẻ] — cách chấm điểm chuẩn của CSS. So sánh theo thứ tự
       từ trái sang, hết nhóm này mới xét nhóm sau; KHÔNG cộng lại thành một số,
       vì 11 class vẫn thua 1 id. */
    var LUAT = [
      { chon: "p", ma: "color: gray;", mau: "#6b7280", d: [0, 0, 1],
        giai: "Bộ chọn <b>tên thẻ</b> — nhắm mọi thẻ &lt;p&gt; trong trang. Yếu nhất." },
      { chon: ".noi-bat", ma: "color: green;", mau: "#15803d", d: [0, 1, 0],
        giai: "Bộ chọn <b>lớp</b> (dấu chấm) — nhắm mọi thẻ mang class=\"noi-bat\". Mạnh hơn tên thẻ." },
      { chon: "p.noi-bat", ma: "color: purple;", mau: "#7e22ce", d: [0, 1, 1],
        giai: "Ghép <b>thẻ + lớp</b>: cộng dồn trong cùng nhóm nên hơn <code>.noi-bat</code> đứng một mình." },
      { chon: "#gioi-thieu", ma: "color: red;", mau: "#dc2626", d: [1, 0, 0],
        giai: "Bộ chọn <b>định danh</b> (dấu thăng) — mạnh hơn mọi tổ hợp lớp và thẻ." },
    ];
    var k;   // số luật đã bật

    var node = MH.el(MH.khung("Bốn luật CSS cùng nhắm một thẻ — luật nào thắng?",
      "Cả bốn luật dưới đây đều tô màu cho <b>đúng một</b> thẻ &lt;p&gt;. Bấm “Bước tiếp” để bật thêm " +
      "từng luật và xem chữ bên phải đổi màu. Ba số trong huy hiệu là <b>điểm ưu tiên</b> " +
      "<code>(id, lớp, thẻ)</code> — so từ trái sang phải.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><span class="mh7-tep">style.css</span><div class="mh7-ds" data-mh="ds"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trình duyệt vẽ ra</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Trang giới thiệu</div>' +
      '<div class="mh7-noi" data-mh="xem"></div></div>' +
      '<div class="mh7-code" data-mh="html" style="margin-top:8px"></div></div>' +
      "</div><div class=\"mh7-ghi\" data-mh=\"ghi\" hidden></div>", ""));

    var loi = loiCua(node);

    /* Trả về chỉ số luật thắng trong số các luật ĐANG bật: điểm cao nhất; nếu
       bằng điểm thì luật đứng sau thắng (đúng luật thật của CSS). */
    function thang() {
      var t = -1;
      for (var i = 0; i < k; i++) {
        if (t < 0) { t = i; continue; }
        for (var n = 0; n < 3; n++) {
          if (LUAT[i].d[n] > LUAT[t].d[n]) { t = i; break; }
          if (LUAT[i].d[n] < LUAT[t].d[n]) break;
          if (n === 2) t = i;          // bằng điểm hoàn toàn -> luật sau thắng
        }
      }
      return t;
    }

    function ve() {
      var t = thang();
      node.querySelector('[data-mh="ds"]').innerHTML = LUAT.map(function (l, i) {
        var tat = i >= k;
        return '<div class="mh7-m' + (i === t ? " nay" : "") + (tat ? " thua" : "") + '">' +
          '<span class="mh7-diem">' + l.d.join(",") + "</span>" +
          "<b>" + esc(l.chon) + " { " + esc(l.ma) + " }" +
          (i === t ? '<span class="mh7-thang">THẮNG</span>' : "") + "</b>" +
          "<small>" + (tat ? "(chưa bật)" : l.giai) + "</small></div>";
      }).join("");

      var mau = t >= 0 ? LUAT[t].mau : "#1a1a1a";
      node.querySelector('[data-mh="xem"]').innerHTML =
        '<p id="gioi-thieu" class="noi-bat" style="color:' + mau + ';font-weight:600">' +
        "Trường THPT của chúng em</p>" +
        '<p style="color:#1a1a1a">Một đoạn văn thường, không mang class hay id.</p>';
      veCode(node.querySelector('[data-mh="html"]'),
        ['&lt;p id="gioi-thieu" class="noi-bat"&gt;Trường THPT của chúng em&lt;/p&gt;']);

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < LUAT.length) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh7-ghi xong";
      ghi.innerHTML = "Luật <code>#gioi-thieu</code> viết <b>cuối cùng</b> và cũng thắng — dễ tưởng vì nó " +
        "viết sau. Nhưng ở bước trước, <code>p.noi-bat</code> viết SAU <code>.noi-bat</code> mà thắng là do " +
        "<b>điểm cao hơn</b>, chứ không phải do đứng sau. <b>Thứ tự chỉ được đem ra phân xử khi điểm bằng " +
        "nhau.</b> Và điểm không cộng gộp thành một số: <code>(1,0,0)</code> hơn <code>(0,9,9)</code> ngay ở " +
        "nhóm đầu — mười một lớp vẫn thua một id.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= LUAT.length) {
        loi("Đã bật hết bốn luật. Bấm “Làm lại” để xem lại từ đầu.");
        return;
      }
      k++;
      var t = thang(), l = LUAT[k - 1];
      ve();
      if (k === 1) {
        loi("Bật luật <code>" + esc(l.chon) + "</code>, điểm <b>" + l.d.join(",") +
          "</b>. Mới có một luật nên nó thắng mặc nhiên — chữ chuyển sang <b>xám</b>.");
      } else if (t === k - 1) {
        loi("Luật mới <code>" + esc(l.chon) + "</code> có điểm <b>" + l.d.join(",") + "</b>, " +
          "cao hơn luật đang giữ → nó <b>giành quyền</b>, chữ đổi màu ngay. " + l.giai);
      } else {
        loi("Luật mới <code>" + esc(l.chon) + "</code> chỉ được <b>" + l.d.join(",") +
          "</b>, <b>thua</b> luật <code>" + esc(LUAT[t].chon) + "</code> (" + LUAT[t].d.join(",") +
          ") nên chữ <b>không đổi</b> — dù nó được viết sau.");
      }
    };

    function lamLai() {
      k = 0; ve();
      loi("Chưa bật luật nào, chữ để màu mặc định. Bấm “Bước tiếp” để bật luật đầu tiên.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-07 · TRANG WEB VÀ NGÔN NGỮ HTML
   *
   *  NGỘ NHẬN 1: tưởng <title> là dòng tiêu đề to giữa trang. Nói bằng lời thì
   *  học sinh vẫn lẫn, nên phải cho thấy CÙNG LÚC hai chỗ: chữ "Lớp 12A" nhảy
   *  lên THANH TAB trong khi vùng trang vẫn trống trơn.
   *  NGỘ NHẬN 2: đóng thẻ lung tung. Khi đọc tới một thẻ đóng, dòng thẻ mở
   *  tương ứng cũng sáng lên, để mắt thấy từng cặp lồng nhau — mở sau đóng trước.
   * ================================================================ */
  MH.dangKy("C12-07", function (host) {
    /* cap = chỉ số dòng chứa thẻ MỞ tương ứng (-1 nếu dòng này không phải thẻ đóng) */
    var DONG = [
      { ma: "<!DOCTYPE html>", thut: 0, cap: -1,
        giai: "<b>&lt;!DOCTYPE html&gt;</b> không phải thẻ nội dung. Nó chỉ báo cho trình duyệt: tệp này " +
          "viết bằng HTML chuẩn hiện hành, hãy đọc theo đúng chuẩn đó. Trang vẫn trống." },
      { ma: "<html>", thut: 0, cap: -1,
        giai: "<b>&lt;html&gt;</b> mở thẻ bao ngoài cùng — mọi thẻ khác đều nằm bên trong nó. Đây là thẻ mở " +
          "<b>đầu tiên</b>, nên nó sẽ là thẻ đóng <b>cuối cùng</b>." },
      { ma: "<head>", thut: 1, cap: -1,
        giai: "<b>&lt;head&gt;</b> mở phần khai báo. Mọi thứ nằm trong head là thông tin gửi cho " +
          "<b>trình duyệt</b>, không phải nội dung cho người đọc — nên sẽ <b>không hiện lên trang</b>." },
      { ma: "<title>Lớp 12A</title>", thut: 2, cap: -1,
        giai: "Trình duyệt lấy chữ trong <b>&lt;title&gt;</b> ghi lên <b>tên tab</b> — nhìn thanh tab bên phải, " +
          "chữ “Lớp 12A” vừa hiện ra, còn vùng trang <b>vẫn trống</b>. Nhiều em tưởng title là dòng tiêu đề " +
          "to giữa trang: không phải, dòng đó là <code>&lt;h1&gt;</code>, sắp thấy ở dưới." },
      { ma: "</head>", thut: 1, cap: 2,
        giai: "<b>&lt;/head&gt;</b> đóng đúng thẻ <code>&lt;head&gt;</code> đang sáng cùng nó ở trên. Phần khai " +
          "báo kết thúc mà chưa có chữ nào hiện lên trang — đó là bình thường, không phải trang bị lỗi." },
      { ma: "<body>", thut: 1, cap: -1,
        giai: "<b>&lt;body&gt;</b> mở phần thân. Từ đây trở đi mới là thứ người xem <b>nhìn thấy</b> trên trang." },
      { ma: "<h1>Chào cả lớp</h1>", thut: 2, cap: -1,
        giai: "Chữ nằm giữa <b>&lt;h1&gt;</b> và <b>&lt;/h1&gt;</b> hiện ngay lên trang, cỡ to vì h1 là mức tiêu " +
          "đề lớn nhất. Em so hai chỗ: “Lớp 12A” ở <b>tab</b> (do title), “Chào cả lớp” ở <b>trên trang</b> " +
          "(do h1) — hai thứ khác nhau." },
      { ma: "<p>Đây là trang web đầu tiên của em.</p>", thut: 2, cap: -1,
        giai: "<b>&lt;p&gt;</b> là một đoạn văn. Trình duyệt tự tách đoạn xuống dòng riêng và để cỡ chữ thường — " +
          "em không phải tự gõ dấu xuống dòng." },
      { ma: "</body>", thut: 1, cap: 5,
        giai: "<b>&lt;/body&gt;</b> đóng thẻ <code>&lt;body&gt;</code> sáng cùng nó. Phần nhìn thấy dừng ở đây. " +
          "<code>&lt;body&gt;</code> mở <b>sau</b> <code>&lt;head&gt;</code> và nằm trong <code>&lt;html&gt;</code>, " +
          "nên phải đóng <b>trước</b> <code>&lt;/html&gt;</code>." },
      { ma: "</html>", thut: 0, cap: 1,
        giai: "<b>&lt;/html&gt;</b> đóng thẻ ngoài cùng: mở đầu tiên thì đóng sau cùng. Quy tắc nhớ suốt đời: " +
          "<b>thẻ mở sau phải đóng trước</b>, các cặp lồng nhau như hộp trong hộp, tuyệt đối không bắt chéo " +
          "kiểu <code>&lt;h1&gt;&lt;p&gt;&lt;/h1&gt;&lt;/p&gt;</code>. Trang đã xong: tên tab lấy từ " +
          "<code>&lt;title&gt;</code>, còn mọi thứ nhìn thấy đều nằm trong <code>&lt;body&gt;</code>." },
    ];

    var buoc;   // chỉ số dòng vừa đọc; -1 = chưa đọc dòng nào

    var node = MH.el(MH.khung("Trình duyệt đọc HTML và dựng trang như thế nào",
      "Bên trái là mã HTML, bên phải là trang web thật. Bấm “Bước tiếp” để trình duyệt đọc thêm một thẻ và " +
      "xem trang lớn dần lên. Chú ý hai chỗ: thẻ nằm trong <code>&lt;head&gt;</code> <b>không hiện</b> trên " +
      "trang, và mỗi thẻ đóng phải khớp đúng thẻ mở của nó.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Mã HTML — đọc từ trên xuống</p>' +
      '<div class="mh7-code" data-mh="code"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Cửa sổ trình duyệt</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i><span data-mh="tab"></span></div>' +
      '<div class="mh7-noi" data-mh="noi"></div></div></div>' +
      "</div>", ""));

    var loi = loiCua(node);

    function thut(n) {
      var s = "", i;
      for (i = 0; i < n; i++) s += "  ";   /* .mh7-d để white-space:pre nên dấu cách thường là đủ */
      return s;
    }

    function ve() {
      var d = DONG.map(function (o, i) {
        var c = "mh7-d";
        /* Dòng đang đọc VÀ dòng mở tương ứng của nó cùng sáng — đó là cách duy
           nhất để thấy "cặp thẻ" thay vì hai dòng rời rạc. */
        if (i === buoc || (buoc >= 0 && DONG[buoc].cap === i)) c += " nay";
        else if (i > buoc) c += " mo";
        return '<div class="' + c + '">' + thut(o.thut) + esc(o.ma) + "</div>";
      }).join("");
      node.querySelector('[data-mh="code"]').innerHTML = d;

      node.querySelector('[data-mh="tab"]').innerHTML = buoc >= 3
        ? esc("Lớp 12A")
        : '<span class="mh7-trong">chưa có tên</span>';

      var noi = "";
      if (buoc >= 6) noi += "<h1>Chào cả lớp</h1>";
      if (buoc >= 7) noi += "<p>Đây là trang web đầu tiên của em.</p>";
      node.querySelector('[data-mh="noi"]').innerHTML = noi ||
        '<span class="mh7-trong">Trang còn trống — chưa có gì hiện ra.</span>';
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= DONG.length - 1) {
        loi("Trình duyệt đã đọc hết tệp, trang dựng xong. Bấm “Làm lại” để chạy lại từ đầu.");
        return;
      }
      buoc++; ve(); loi(DONG[buoc].giai);
    };

    function lamLai() {
      buoc = -1; ve();
      loi("Trình duyệt vừa mở tệp, chưa đọc dòng nào nên trang còn trống. Bấm “Bước tiếp” để đọc thẻ đầu tiên.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-08 · HTML: VĂN BẢN, TIÊU ĐỀ, DANH SÁCH VÀ LIÊN KẾT
   *
   *  Bảng tra thẻ bấm được: chọn thẻ nào thì thấy NGAY ba thứ cạnh nhau — code,
   *  trang web render thật, và câu giải thích. Đặt code sát bên kết quả là cách
   *  duy nhất trị được ngộ nhận "gõ Enter trong tệp thì trang xuống dòng theo":
   *  em nhìn thấy tận mắt hai dòng trong code dính liền một dòng trên trang.
   * ================================================================ */
  MH.dangKy("C12-08", function (host) {
    var THE = [
      { ten: "<h1> … <h3>", mo: "tiêu đề theo cấp bậc", d: 0,
        ma: "<h1>Trường THPT Hùng Vương</h1>\n<h2>Tổ Tin học</h2>\n<h3>Lớp 12A1</h3>",
        hien: "<h1>Trường THPT Hùng Vương</h1><h2>Tổ Tin học</h2><h3>Lớp 12A1</h3>",
        giai: "<b>h1 đến h6 là CẤP BẬC tiêu đề, không phải cỡ chữ.</b> h1 là tiêu đề lớn nhất của trang " +
          "(thường mỗi trang chỉ một cái), h2 là mục con của h1, h3 là mục con của h2 — giống mục lục sách. " +
          "Trình duyệt vô tình để sẵn h1 to nhất nên nhiều em chọn h1 chỉ vì muốn chữ to: <b>sai</b>. " +
          "Muốn chữ to thì để CSS lo, còn thẻ h nói về <b>vai trò</b> của dòng đó." },

      { ten: "<p>", mo: "một đoạn văn", d: 1,
        ma: "<p>Hà Nội là thủ đô nước ta.\nCâu này em gõ ở dòng dưới.</p>\n<p>Đây mới là đoạn thứ hai.</p>",
        hien: "<p>Hà Nội là thủ đô nước ta. Câu này em gõ ở dòng dưới.</p><p>Đây mới là đoạn thứ hai.</p>",
        giai: "Nhìn kĩ: trong code câu thứ hai nằm ở <b>dòng dưới</b>, vậy mà trang web vẫn in nó nối tiếp " +
          "ngay sau câu đầu. <b>Gõ Enter trong tệp HTML KHÔNG làm trang xuống dòng</b> — trình duyệt coi mọi " +
          "dấu cách và mọi lần xuống dòng chỉ là <b>một dấu cách</b>. Đây là lỗi kinh điển. Muốn tách đoạn " +
          "thì phải bọc bằng <code>&lt;p&gt;…&lt;/p&gt;</code>, và mỗi &lt;p&gt; tự cách đoạn trước một khoảng." },

      { ten: "<br>", mo: "xuống dòng trong cùng đoạn", d: 1,
        ma: "<p>Lê Anh Tuấn<br>\nLớp 12A1<br>\nTrường THPT Hùng Vương</p>",
        hien: "<p>Lê Anh Tuấn<br>Lớp 12A1<br>Trường THPT Hùng Vương</p>",
        giai: "Khi cần xuống dòng mà <b>vẫn trong một đoạn</b> (địa chỉ, khổ thơ, dòng ghi tên) thì dùng " +
          "<code>&lt;br&gt;</code> — chỗ nào đặt &lt;br&gt; thì chỗ đó mới ngắt dòng, chứ Enter trong tệp thì " +
          "vô tác dụng. <b>&lt;br&gt; là thẻ RỖNG</b>: nó không bọc nội dung nào cả nên <b>không có thẻ đóng</b>. " +
          "Viết <code>&lt;/br&gt;</code> là sai, đề hay bẫy đúng chỗ này." },

      { ten: "<strong>", mo: "in đậm phần quan trọng", d: 0,
        ma: "<p>Hạn nộp bài là <strong>thứ Sáu</strong>, không lùi.</p>",
        hien: "<p>Hạn nộp bài là <strong>thứ Sáu</strong>, không lùi.</p>",
        giai: "<code>&lt;strong&gt;</code> đánh dấu phần <b>quan trọng</b>, trình duyệt in đậm. Nó nằm " +
          "<b>lồng bên trong</b> một đoạn &lt;p&gt;, chỉ tô đúng mấy chữ nằm giữa hai thẻ. Nhớ: strong làm " +
          "chữ <b>đậm</b> chứ không làm chữ <b>to</b> — cần chữ to là việc của CSS." },

      { ten: "<em>", mo: "in nghiêng để nhấn giọng", d: 0,
        ma: "<p>Em <em>nên</em> đọc kĩ đề trước khi làm.</p>",
        hien: "<p>Em <em>nên</em> đọc kĩ đề trước khi làm.</p>",
        giai: "<code>&lt;em&gt;</code> nhấn giọng khi đọc, trình duyệt in nghiêng. Cũng là thẻ lồng trong đoạn " +
          "văn như strong. Hai thẻ này chỉ đổi <b>kiểu chữ</b> của đúng phần nằm giữa, phần còn lại của đoạn " +
          "không bị ảnh hưởng." },

      { ten: "<ul> / <li>", mo: "danh sách KHÔNG đánh số", d: 0,
        ma: "<ul>\n  <li>Bàn phím</li>\n  <li>Chuột</li>\n  <li>Màn hình</li>\n</ul>",
        hien: "<ul><li>Bàn phím</li><li>Chuột</li><li>Màn hình</li></ul>",
        giai: "<code>&lt;ul&gt;</code> là danh sách <b>không đánh số</b> (unordered) — trình duyệt chỉ chấm " +
          "tròn đầu dòng, dùng khi thứ tự các mục không quan trọng. Mỗi mục là một <code>&lt;li&gt;</code>, và " +
          "<b>&lt;li&gt; luôn phải nằm trong &lt;ul&gt; hoặc &lt;ol&gt;</b>, không được đứng một mình." },

      { ten: "<ol> / <li>", mo: "danh sách CÓ đánh số", d: 0,
        ma: "<ol>\n  <li>Mở trình soạn thảo</li>\n  <li>Gõ mã HTML</li>\n  <li>Lưu tệp .html rồi mở bằng trình duyệt</li>\n</ol>",
        hien: "<ol><li>Mở trình soạn thảo</li><li>Gõ mã HTML</li><li>Lưu tệp .html rồi mở bằng trình duyệt</li></ol>",
        giai: "<code>&lt;ol&gt;</code> là danh sách <b>có đánh số</b> (ordered), dùng khi thứ tự có ý nghĩa: " +
          "các bước làm. Số <b>1, 2, 3 do trình duyệt tự đánh</b>, em đừng tự gõ số vào — đổi chỗ hai mục thì " +
          "số tự đánh lại cho đúng. Bên trong <b>vẫn là &lt;li&gt; y hệt ul</b>; ul và ol chỉ khác nhau ở thẻ " +
          "bao ngoài." },

      { ten: "<a href>", mo: "liên kết bấm được", d: 0,
        ma: "<p>Xem thêm tại <a href=\"https://vi.wikipedia.org\">Wikipedia tiếng Việt</a>.</p>",
        /* target="_blank" để em bấm thử mà không mất chỗ đang học; rel="noopener"
           là thói quen bắt buộc khi mở tab mới. */
        hien: "<p>Xem thêm tại <a href=\"https://vi.wikipedia.org\" target=\"_blank\" rel=\"noopener\">" +
          "Wikipedia tiếng Việt</a>.</p>",
        giai: "Thẻ <code>&lt;a&gt;</code> <b>phải có thuộc tính href mới bấm được</b>; thiếu href thì nó chỉ là " +
          "chữ thường, không dẫn đi đâu cả. Phân biệt hai phần: <b>chữ người đọc nhìn thấy</b> là phần nằm " +
          "giữa &lt;a&gt; và &lt;/a&gt; (“Wikipedia tiếng Việt”), còn <b>địa chỉ trang đích</b> giấu trong " +
          "href. Hai thứ đó khác nhau, đề hay hỏi đúng chỗ này." },
    ];

    var k;
    var node = MH.el(MH.khung("Bảng tra thẻ HTML — bấm thẻ nào, thấy ngay thẻ đó",
      "Bên trái là các thẻ hay dùng nhất. Em bấm vào một thẻ để xem <b>code</b> và <b>trang web hiện ra</b> " +
      "đặt cạnh nhau, kèm câu giải thích thẻ đó dùng làm gì. Bấm “Bước tiếp” thì tự chuyển sang thẻ kế tiếp.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Chọn thẻ</p><div class="mh7-ds" data-mh="ds"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Code HTML em gõ</p>' +
      '<div class="mh7-code" data-mh="code"></div>' +
      '<p class="mh7-nhan" style="margin-top:9px">Trang web hiện ra</p>' +
      '<div class="mh7-xem"><div class="mh7-noi" data-mh="xem"></div></div></div>' +
      "</div>", ""));

    var loi = loiCua(node);
    function chonMuc() { chon(Number(this.getAttribute("data-k"))); }

    function ve() {
      var t = THE[k];
      node.querySelector('[data-mh="ds"]').innerHTML = THE.map(function (o, i) {
        return '<div class="mh7-m' + (i === k ? " nay" : "") + '" data-k="' + i + '">' +
          "<b>" + esc(o.ten) + "</b><small>" + o.mo + "</small></div>";
      }).join("");
      node.querySelector('[data-mh="code"]').innerHTML = t.ma.split("\n").map(function (dong, i) {
        return '<div class="mh7-d' + (i === t.d ? " nay" : "") + '">' + esc(dong) + "</div>";
      }).join("");
      node.querySelector('[data-mh="xem"]').innerHTML = t.hien;
      /* ve() ghi đè innerHTML của danh sách nên phải gắn LẠI onclick sau mỗi lần vẽ */
      node.querySelectorAll(".mh7-m").forEach(function (o) { o.onclick = chonMuc; });
    }

    function chon(i) { k = i; ve(); loi(THE[k].giai); }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= THE.length - 1) {
        loi("Em đã xem hết " + THE.length + " thẻ. Bấm vào thẻ bất kì bên trái để xem lại, " +
          "hoặc bấm “Làm lại” để quay về thẻ đầu tiên.");
        return;
      }
      chon(k + 1);
    };

    function lamLai() { chon(0); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-10 · CSS LÀ GÌ VÀ BA CÁCH ÁP CSS VÀO TRANG
   *
   *  NGỘ NHẬN: tưởng ba cách cho ra ba kết quả khác nhau, hoặc tưởng "CSS ngoài
   *  thì đẹp hơn". Thật ra kết quả HIỆN RA y hệt; khác nhau ở chỗ luật đó dùng
   *  lại được cho BAO NHIÊU TRANG. Nên bên phải giữ nguyên không đổi khi bấm
   *  qua ba cách đầu — chính chỗ "không đổi" đó mới là bài học.
   * ================================================================ */
  MH.dangKy("C12-10", function (host) {
    function d(t, c) { return { t: t, c: c || "" }; }
    var TIEU = "CLB Tin học", DOAN = "Sinh hoạt chiều thứ Sáu hằng tuần.";

    var CACH = [
      { ten: "1 · Nội tuyến — style ngay trên thẻ", mau: "#2563eb",
        tep: [{ ten: "index.html", dong: [
          d("<!DOCTYPE html>", "mo"), d("<html>", "mo"), d("<head>", "mo"),
          d("  <title>Trang của em</title>", "mo"), d("</head>", "mo"), d("<body>", "mo"),
          d('  <h1 style="color: #2563eb">' + TIEU + "</h1>", "nay"),
          d('  <p style="font-size: 18px">' + DOAN + "</p>", "nay"),
          d("</body>", "mo"), d("</html>", "mo")] }],
        giai: "Cách <b>nội tuyến</b>: viết thẳng <code>style=\"...\"</code> vào thẻ. Nó chỉ tô được " +
          "<b>đúng thẻ đó</b> — thêm một &lt;p&gt; nữa là phải viết lại, có 20 trang thì sửa 20 chỗ." },

      { ten: "2 · Bên trong — thẻ &lt;style&gt; trong &lt;head&gt;", mau: "#2563eb",
        tep: [{ ten: "index.html", dong: [
          d("<!DOCTYPE html>", "mo"), d("<html>", "mo"), d("<head>", "mo"),
          d("  <title>Trang của em</title>", "mo"),
          d("  <style>", "nay"),
          d("    h1 { color: #2563eb; }", "nay"),
          d("    p  { font-size: 18px; }", "nay"),
          d("  </style>", "nay"),
          d("</head>", "mo"), d("<body>", "mo"),
          d("  <h1>" + TIEU + "</h1>", ""), d("  <p>" + DOAN + "</p>", ""),
          d("</body>", "mo"), d("</html>", "mo")] }],
        giai: "Cách <b>bên trong</b>: gom luật vào <code>&lt;style&gt;</code> đặt trong <code>&lt;head&gt;</code>. " +
          "Mọi &lt;h1&gt; của <b>trang này</b> đều theo, nhưng trang khác thì không. Kết quả bên phải " +
          "<b>y hệt</b> cách 1 — em so lại mà xem." },

      { ten: "3 · Bên ngoài — tệp .css riêng nối bằng &lt;link&gt;", mau: "#2563eb",
        tep: [
          { ten: "index.html", dong: [
            d("<!DOCTYPE html>", "mo"), d("<html>", "mo"), d("<head>", "mo"),
            d("  <title>Trang của em</title>", "mo"),
            d('  <link rel="stylesheet" href="style.css">', "nay"),
            d("</head>", "mo"), d("<body>", "mo"),
            d("  <h1>" + TIEU + "</h1>", ""), d("  <p>" + DOAN + "</p>", ""),
            d("</body>", "mo"), d("</html>", "mo")] },
          { ten: "style.css", dong: [
            d("h1 { color: #2563eb; }", "nay"),
            d("p  { font-size: 18px; }", "nay")] }],
        giai: "Cách <b>bên ngoài</b>: luật nằm ở tệp <code>style.css</code>, nối vào bằng " +
          "<code>&lt;link rel=\"stylesheet\" href=\"style.css\"&gt;</code> đặt trong <code>&lt;head&gt;</code>. " +
          "<code>&lt;link&gt;</code> <b>không có thẻ đóng</b>, và thiếu <code>rel=\"stylesheet\"</code> là " +
          "trình duyệt bỏ qua. Đây là cách thực tế hay dùng nhất: sửa <b>một tệp</b>, cả website đổi theo." },

      { ten: "4 · Cả ba cùng có — ai thắng?", mau: "#dc2626",
        tep: [
          { ten: "index.html", dong: [
            d("<head>", "mo"),
            d('  <link rel="stylesheet" href="style.css">', ""),
            d("  <style>", ""), d("    h1 { color: #16a34a; }", ""), d("  </style>", ""),
            d("</head>", "mo"), d("<body>", "mo"),
            d('  <h1 style="color: #dc2626">' + TIEU + "</h1>", "nay"),
            d('  <p style="font-size: 18px">' + DOAN + "</p>", ""),
            d("</body>", "mo")] },
          { ten: "style.css", dong: [d("h1 { color: #6b7280; }", "")] }],
        giai: "Ba nơi cùng đòi màu cho <code>h1</code>: ngoài xám, bên trong xanh lá, nội tuyến đỏ — chữ hiện " +
          "ra <b>màu đỏ</b>. Nội tuyến bám sát thẻ nhất nên độ ưu tiên cao nhất." },
    ];

    var k;
    var node = MH.el(MH.khung("CSS là gì và ba cách áp vào trang",
      "Một luật CSS viết là <code>bộ-chọn { thuộc-tính: giá-trị; }</code> — dấu <b>hai chấm</b> ngăn thuộc " +
      "tính với giá trị, dấu <b>chấm phẩy</b> kết thúc mỗi dòng khai báo. Cùng một trang, em thử áp CSS theo " +
      "ba cách và nhìn kết quả bên phải.",
      '<div class="mh7-ds" data-mh="ds" style="margin-bottom:11px"></div>' +
      '<div class="mh7-doi">' +
      '<div class="mh7-panel" data-mh="ma"></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Trang hiện ra trên trình duyệt</p>' +
      '<div class="mh7-xem"><div class="mh7-tab"><i></i>Trang của em</div>' +
      '<div class="mh7-noi" data-mh="xem"></div></div></div>' +
      "</div>", ""));
    var loi = loiCua(node);

    function ve() {
      var c = CACH[k];
      node.querySelector('[data-mh="ds"]').innerHTML = CACH.map(function (o, i) {
        return '<div class="mh7-m' + (i === k ? " nay" : "") + '" data-i="' + i + '"><b class="van">' +
          o.ten + "</b></div>";
      }).join("");
      /* innerHTML vừa ghi đè nên onclick cũ mất, phải gắn lại mỗi lần vẽ. */
      node.querySelectorAll(".mh7-m").forEach(function (o) {
        o.onclick = function () { k = +o.getAttribute("data-i"); ve(); loi(CACH[k].giai); };
      });

      node.querySelector('[data-mh="ma"]').innerHTML =
        '<p class="mh7-nhan">Code em viết</p>' +
        c.tep.map(function (t) {
          return '<span class="mh7-tep">' + esc(t.ten) + '</span><div class="mh7-code">' +
            t.dong.map(function (o) {
              return '<div class="mh7-d ' + o.c + '">' + esc(o.t) + "</div>";
            }).join("") + "</div>";
        }).join("");

      /* Trang render nằm CHUNG tài liệu với app: chèn thẻ <style> thật thì luật
         h1/p sẽ rò ra toàn bộ giao diện app. Nên bên phải luôn áp bằng style=""
         trên phần tử, dù code bên trái viết đúng ba cách như SGK. */
      node.querySelector('[data-mh="xem"]').innerHTML =
        '<h1 style="color:' + c.mau + '">' + esc(TIEU) + "</h1>" +
        '<p style="font-size:18px">' + esc(DOAN) + "</p>";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= CACH.length - 1) {
        loi("Hết rồi. Nhớ: ba cách đầu cho <b>cùng một kết quả</b>, khác nhau ở chỗ dùng lại được cho bao " +
          "nhiêu trang.");
        return;
      }
      k++; ve(); loi(CACH[k].giai);
    };

    function lamLai() {
      k = 0; ve();
      loi("Bấm chọn từng cách để so. Kết quả bên phải sẽ <b>không đổi</b> ở ba cách đầu — đó mới là điều " +
        "cần thấy.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });
})();
