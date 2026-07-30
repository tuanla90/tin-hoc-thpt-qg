/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 5: sáu bài cuối cần "phải thấy nó chạy mới tin"
 *
 *  Dùng khung dựng của js/minh-hoa.js (nạp SAU tệp đó). Màu lấy từ biến giao
 *  diện, số thập phân viết dấu phẩy — cùng quy ước với minh-hoa-3 và minh-hoa-4.
 *
 *  KHÔNG đăng ký cho C12-14 (hướng nghiệp): bài đó đang được server/test/seo.test.js
 *  dùng làm ví dụ "bài không có minh hoạ thì trang công khai không nạp script nào".
 *  Bài hướng nghiệp cũng chẳng có cơ chế gì để mô phỏng, nên đây không phải là
 *  đánh đổi — chỉ ghi ra để người sau khỏi vô tình thêm vào rồi làm vỡ test.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss5() {
    if (document.getElementById("mhCss5")) return;
    var st = document.createElement("style");
    st.id = "mhCss5";
    st.textContent =
      /* --- vector và điểm ảnh khi phóng to --- */
      ".mh5-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:430px;margin:0 auto}" +
      ".mh5-2 h5{margin:0 0 6px;font:800 12px var(--font-sans);text-align:center;color:var(--text-soft)}" +
      ".mh5-o{border:1px solid var(--border);border-radius:10px;background:var(--bg-card);height:132px;" +
        "display:flex;align-items:center;justify-content:center;overflow:hidden}" +
      ".mh5-o svg,.mh5-o canvas{display:block}" +
      /* --- xâu kí tự --- */
      ".mh5-tu{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}" +
      ".mh5-t{border:2px solid var(--border);border-radius:8px;background:var(--bg-card);padding:6px 9px;" +
        "font:700 13px var(--font-mono);transition:all .25s}" +
      ".mh5-t.sang{border-color:var(--primary);background:var(--primary-soft);color:var(--primary)}" +
      ".mh5-t.thay{border-color:var(--success);background:var(--success-soft);color:var(--success)}" +
      ".mh5-t.trong{border-style:dashed;color:var(--danger);border-color:var(--danger)}" +
      /* --- ngăn xếp lời gọi hàm --- */
      ".mh5-khung{display:grid;gap:6px;max-width:400px;margin:0 auto}" +
      ".mh5-k{border:1.5px solid var(--border);border-radius:10px;background:var(--bg-card);padding:8px 11px;" +
        "font:600 12.5px var(--font-mono);transition:all .25s}" +
      ".mh5-k.nay{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh5-k b{font-weight:800;color:var(--primary)}" +
      ".mh5-k small{display:block;margin-top:3px;font:600 11.5px var(--font-sans);color:var(--text-soft)}" +
      ".mh5-k.chung{border-color:var(--warning);background:var(--warning-soft)}" +
      ".mh5-k.chung b{color:var(--warning)}" +
      /* --- biểu mẫu --- */
      ".mh5-form{display:grid;gap:8px;max-width:330px;margin:0 auto}" +
      ".mh5-r{display:grid;grid-template-columns:88px 1fr;gap:8px;align-items:center}" +
      ".mh5-r label{font:700 12px var(--font-sans);color:var(--text-soft)}" +
      ".mh input.mh5-i{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text);border-radius:8px;" +
        "padding:7px 9px;font:600 13px var(--font-mono);width:100%;min-height:34px}" +
      ".mh5-r.thieu input{border-color:var(--danger);background:var(--danger-soft)}" +
      ".mh5-r.thieu label{color:var(--danger)}" +
      ".mh5-goi{margin:12px auto 0;max-width:400px;border-radius:9px;padding:9px 11px;background:var(--bg-card);" +
        "border:1px solid var(--border);font:600 12px/1.6 var(--font-mono);word-break:break-all}" +
      ".mh5-goi b{color:var(--primary)}" +
      /* --- hộp CSS đo được --- */
      ".mh5-hop{margin:0 auto;background:var(--warning-soft);border:2px dashed var(--warning);" +
        "transition:all .3s;text-align:center}" +
      ".mh5-vien{border:var(--mh5-bd,4px) solid var(--info);transition:all .3s}" +
      ".mh5-pad{background:var(--success-soft);transition:all .3s}" +
      ".mh5-noi{background:var(--primary);color:#fff;font:800 12px var(--font-mono);padding:10px 0;transition:all .3s}" +
      ".mh5-thuoc{position:relative;height:22px;max-width:100%;margin:8px auto 0}" +
      ".mh5-thuoc i{position:absolute;top:9px;height:2px;background:var(--text-soft)}" +
      ".mh5-thuoc b{position:absolute;top:-2px;transform:translateX(-50%);font:800 11px var(--font-mono);" +
        "background:var(--bg-soft);padding:0 5px;white-space:nowrap}" +
      /* --- trung bình và trung vị --- */
      ".mh5-cot{display:flex;gap:4px;align-items:flex-end;justify-content:center;height:120px}" +
      ".mh5-c{flex:1;max-width:38px;background:var(--primary);border-radius:5px 5px 0 0;position:relative;" +
        "transition:height .3s}" +
      ".mh5-c.lech{background:var(--danger)}" +
      ".mh5-c span{position:absolute;bottom:-17px;left:50%;transform:translateX(-50%);" +
        "font:700 10px var(--font-mono);color:var(--text-soft);white-space:nowrap}" +
      ".mh5-vach{position:relative;height:0;max-width:100%}" +
      ".mh5-ghi{margin:11px auto 0;max-width:440px;border-radius:9px;padding:8px 11px;font-size:12.5px;line-height:1.5;" +
        "background:var(--warning-soft);color:var(--text);border:1px solid var(--warning)}" +
      ".mh5-ghi.xong{background:var(--success-soft);border-color:var(--success)}" +
      ".mh5-so{text-align:center;margin-top:11px;font:700 13px var(--font-mono);color:var(--text-soft)}" +
      ".mh5-so b{color:var(--primary)}" +
      ".mh5-tick{display:inline-flex;align-items:center;gap:6px;font:700 12.5px var(--font-sans);color:var(--text-soft);cursor:pointer}" +
      ".mh5-tick input{accent-color:var(--primary);width:16px;height:16px}" +
      ".mh input.mh5-range{accent-color:var(--primary);width:132px;height:26px;padding:0;border:0;background:none;min-height:0}" +
      "@media (max-width:560px){.mh5-2{grid-template-columns:1fr}.mh5-r{grid-template-columns:74px 1fr}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function thap(x, n) { return Number(x).toFixed(n == null ? 1 : n).replace(".", ","); }
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
   *  C10-09 · VECTOR VÀ ĐIỂM ẢNH KHI PHÓNG TO
   *
   *  NGỘ NHẬN: "ảnh nét hay vỡ là do độ phân giải cao hay thấp". Không hẳn —
   *  ảnh vector KHÔNG có độ phân giải, phóng bao nhiêu cũng tính lại từ công
   *  thức. Chỗ này nói mãi không vào, nhưng đặt hai hình cạnh nhau rồi kéo mức
   *  phóng là xong trong ba giây. Bitmap vẽ bằng canvas cỡ nhỏ rồi phóng bằng
   *  CSS với image-rendering:pixelated — đúng cơ chế vỡ hạt thật.
   * ================================================================ */
  MH.dangKy("C10-09", function (host) {
    napCss5();
    var MUC = [1, 2, 4, 8, 16];
    var k;

    var node = MH.el(MH.khung("Phóng to lên thì hình nào vỡ, hình nào không?",
      "Bên trái là hình <b>vector</b> (lưu công thức: “một hình tròn bán kính r”), bên phải là hình " +
      "<b>điểm ảnh</b> cùng nội dung (lưu màu của từng ô). Bấm từng bước để phóng to dần — " +
      "chú ý cạnh của hình tròn.",
      '<div class="mh5-2">' +
      '<div><h5>Vector (.svg)</h5><div class="mh5-o" data-mh="vec"></div></div>' +
      '<div><h5>Điểm ảnh (.png)</h5><div class="mh5-o" data-mh="bit"></div></div>' +
      '</div><div class="mh5-so" data-mh="muc"></div><div class="mh5-ghi" data-mh="ghi" hidden></div>'));

    var loi = loiCua(node);

    /* Bitmap gốc CỐ Ý chỉ 16×16: phóng lên mới thấy rõ từng ô vuông. Vẽ bằng
       canvas rồi để trình duyệt phóng với image-rendering:pixelated — đó đúng là
       việc phần mềm xem ảnh làm, không phải hiệu ứng giả. */
    function veBit(z) {
      var N = 16, c = document.createElement("canvas");
      c.width = N; c.height = N;
      var g = c.getContext("2d");
      var mau = getComputedStyle(node).getPropertyValue("--primary") || "#4f46e5";
      g.fillStyle = mau.trim();
      var r = N / 2 - 1.5;
      for (var y = 0; y < N; y++) {
        for (var x = 0; x < N; x++) {
          var dx = x + 0.5 - N / 2, dy = y + 0.5 - N / 2;
          if (dx * dx + dy * dy <= r * r) g.fillRect(x, y, 1, 1);
        }
      }
      var cao = 26 * z;
      c.style.width = cao + "px";
      c.style.height = cao + "px";
      c.style.imageRendering = "pixelated";
      return c;
    }
    function ve() {
      var z = MUC[k], cao = 26 * z;
      node.querySelector('[data-mh="vec"]').innerHTML =
        '<svg width="' + cao + '" height="' + cao + '" viewBox="0 0 32 32" aria-hidden="true">' +
        '<circle cx="16" cy="16" r="14.5" fill="var(--primary)"/></svg>';
      var oBit = node.querySelector('[data-mh="bit"]');
      oBit.innerHTML = "";
      oBit.appendChild(veBit(z));
      node.querySelector('[data-mh="muc"]').innerHTML = "Mức phóng: <b>" + z + "×</b>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < MUC.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh5-ghi xong";
      ghi.innerHTML = "Ở <b>16×</b>, hình vector vẫn là một đường tròn trơn; hình điểm ảnh đã thành các <b>ô vuông</b>. " +
        "Lí do: vector lưu <b>công thức</b> nên phóng to là <b>vẽ lại</b>; ảnh điểm ảnh chỉ có đúng " +
        "16 × 16 = <b>256</b> ô màu, phóng lên chỉ là làm mỗi ô to ra — <b>không có thông tin nào để thêm vào</b>. " +
        "Vì vậy logo phải là vector (một tệp dùng cho cả danh thiếp lẫn biển hiệu), còn ảnh chụp thì bắt buộc " +
        "là điểm ảnh vì không có công thức nào tả được một khuôn mặt.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= MUC.length - 1) {
        loi("Đây cũng là lí do <b>không nên phóng to ảnh chụp</b> rồi đem in: máy không tạo thêm được chi tiết " +
          "mà nó chưa từng có.");
        return;
      }
      k++; ve();
      loi("Phóng <b>" + MUC[k] + "×</b>. " +
        (MUC[k] <= 2 ? "Ở mức này hai bên còn trông giống nhau — đó là lí do ngộ nhận tồn tại."
                     : "Cạnh hình bên phải bắt đầu <b>gãy thành bậc</b>, bên trái vẫn trơn."));
    };
    function lamLai() { k = 0; ve(); loi("Cả hai đang ở kích thước gốc. Bấm “Bước tiếp” để phóng to."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-32 · TÁCH, GHÉP VÀ TÌM TRONG XÂU
   *
   *  NGỘ NHẬN: split(" ") và split() là một. Không — chuỗi có khoảng trắng thừa
   *  thì split(" ") sinh ra các phần tử RỖNG, và đếm số từ ra sai. Cho gõ chuỗi
   *  có hai dấu cách liền nhau rồi bật tắt ô tích là thấy ngay.
   * ================================================================ */
  MH.dangKy("C10-32", function (host) {
    napCss5();
    var k;

    var node = MH.el(MH.khung("Tách một câu thành các từ — và cái bẫy khoảng trắng",
      "Bấm từng bước để tách câu thành danh sách từ. Câu mặc định cố ý có <b>hai dấu cách liền nhau</b> " +
      "và khoảng trắng ở hai đầu. Tích ô bên dưới để so <b>split(\" \")</b> với <b>split()</b>.",
      '<div style="text-align:center;font:600 13px var(--font-mono);color:var(--text-soft);margin-bottom:10px" data-mh="goc"></div>' +
      '<div class="mh5-tu" data-mh="tu"></div><div class="mh5-so" data-mh="so"></div>' +
      '<div class="mh5-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhCau">Câu:</label>' +
      '<input class="mh-o-nhap" id="mhCau" data-mh="cau" type="text" value=" Hoc Tin  hoc rat vui " style="max-width:250px">' +
      '<label class="mh5-tick"><input type="checkbox" data-mh="cach" checked> dùng <b>split(" ")</b> thay cho <b>split()</b></label>'));

    var loi = loiCua(node);
    function cau() { return String(node.querySelector('[data-mh="cau"]').value || " Hoc Tin  hoc rat vui "); }
    function dungCach() { return node.querySelector('[data-mh="cach"]').checked; }
    /* split(" ") tách đúng theo TỪNG dấu cách nên hai dấu liền nhau sinh phần tử
       rỗng; split() không tham số bỏ khoảng trắng thừa ở mọi chỗ. Mô phỏng đúng
       hai hành vi này chứ không dùng chung một cách rồi lọc. */
    function cacTu() {
      return dungCach() ? cau().split(" ") : cau().split(/\s+/).filter(Boolean);
    }

    function ve() {
      var ds = cacTu();
      node.querySelector('[data-mh="goc"]').textContent = '"' + cau().replace(/ /g, "␣") + '"';
      node.querySelector('[data-mh="tu"]').innerHTML = ds.map(function (t, n) {
        var rong = t === "";
        /* Phần tử RỖNG luôn giữ màu đỏ, không bao giờ nhận thêm lớp "thay" (xanh).
           Bản đầu cộng cả hai lớp nên phần tử rỗng đã đi qua ra nền xanh chữ đỏ —
           đúng ngược thông điệp, vì đây là thứ ta muốn học sinh thấy là SAI. */
        var cls = "mh5-t" + (rong ? " trong" : n === k ? " sang" : n < k ? " thay" : "");
        return '<div class="' + cls + '">' + (rong ? '""' : esc(t)) + "</div>";
      }).join("") || '<div style="color:var(--text-soft);font-size:12.5px">(danh sách rỗng)</div>';
      var rong = ds.filter(function (t) { return t === ""; }).length;
      node.querySelector('[data-mh="so"]').innerHTML =
        "Danh sách có <b>" + ds.length + "</b> phần tử" +
        (rong ? ' · <span style="color:var(--danger)"><b>' + rong + "</b> phần tử rỗng</span>" : "");

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < ds.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      var that = cau().trim().split(/\s+/).filter(Boolean).length;
      ghi.className = "mh5-ghi" + (rong ? "" : " xong");
      ghi.innerHTML = rong
        ? "<b>split(\" \")</b> tách theo <b>từng</b> dấu cách, nên hai dấu cách liền nhau sinh ra một phần tử " +
          "<b>rỗng</b> ở giữa, và khoảng trắng ở hai đầu sinh thêm hai phần tử rỗng nữa. " +
          "Đếm ra <b>" + ds.length + "</b> từ trong khi thật ra chỉ có <b>" + that + "</b>. " +
          "Bỏ tích ô để dùng <b>split()</b> không tham số — nó bỏ mọi khoảng trắng thừa."
        : "<b>split()</b> không tham số tách theo <b>mọi cụm khoảng trắng</b> và bỏ khoảng trắng hai đầu, " +
          "nên ra đúng <b>" + that + "</b> từ. Ghép ngược lại bằng <b>\" \".join(ds)</b>. " +
          "Còn muốn tìm thì nhớ: <b>\"Tin\" in s</b> cho Đúng/Sai, còn <b>s.find(\"Tin\")</b> cho <b>vị trí</b> " +
          "và trả về <b>−1</b> khi không thấy — đừng dùng thẳng find làm điều kiện, vì vị trí 0 bị coi là sai.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var ds = cacTu();
      if (k >= ds.length - 1) { loi("Thử bỏ tích ô rồi chạy lại để so hai cách tách."); return; }
      k++; ve();
      var t = ds[k];
      loi(t === ""
        ? "Phần tử thứ " + (k + 1) + " là <b>xâu rỗng</b> — sinh ra vì có hai dấu cách liền nhau (hoặc dấu cách ở đầu câu)."
        : "Phần tử thứ " + (k + 1) + ": <b>" + esc(t) + "</b>.");
    };
    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để lấy từng phần tử của danh sách."); }
    ganDatLai(node, ["cau", "cach"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-33 · TRUYỀN THAM SỐ VÀ GIÁ TRỊ TRẢ VỀ
   *
   *  NGỘ NHẬN đắt nhất của bài: "sửa biến trong hàm thì không ảnh hưởng ra ngoài".
   *  Đúng với SỐ, sai với DANH SÁCH. Chạy hai hàm gần như giống hệt nhau cạnh
   *  nhau rồi so kết quả cuối là chỗ duy nhất chuyện này vỡ ra.
   * ================================================================ */
  MH.dangKy("C10-33", function (host) {
    napCss5();
    var BUOC_SO = [
      { t: "n = 5", p: "Biến ngoài <b>n</b> được tạo, giá trị 5.", ng: "n = 5" },
      { t: "goi tang(n)", p: "Đưa <b>giá trị</b> 5 vào hàm — hàm nhận một <b>bản sao</b>.", ng: "n = 5", tr: "x = 5" },
      { t: "x = x + 1", p: "Trong hàm, <b>x</b> thành 6. Đây là biến <b>cục bộ</b>, hoàn toàn tách khỏi n.", ng: "n = 5", tr: "x = 6" },
      { t: "hàm kết thúc", p: "Không có <b>return</b>, biến cục bộ <b>x</b> biến mất.", ng: "n = 5" },
      { t: "print(n)", p: "In ra <b>5</b> — biến ngoài <b>không đổi</b>.", ng: "n = 5", kq: "5" },
    ];
    var BUOC_DS = [
      { t: "ds = [1, 2, 3]", p: "Biến ngoài <b>ds</b> trỏ tới một danh sách.", ng: "ds → [1, 2, 3]" },
      { t: "goi them(ds)", p: "Đưa vào hàm — nhưng lần này hàm nhận <b>chính danh sách đó</b>, không phải bản sao.", ng: "ds → [1, 2, 3]", tr: "a → cùng danh sách", chung: true },
      { t: "a.append(4)", p: "<b>Sửa nội dung</b> danh sách. Cả hai tên đều trỏ tới nó nên cả hai đều thấy.", ng: "ds → [1, 2, 3, 4]", tr: "a → cùng danh sách", chung: true },
      { t: "hàm kết thúc", p: "Tên <b>a</b> biến mất, nhưng danh sách thì <b>đã bị đổi thật</b>.", ng: "ds → [1, 2, 3, 4]" },
      { t: "print(ds)", p: "In ra <b>[1, 2, 3, 4]</b> — biến ngoài <b>ĐÃ đổi</b>.", ng: "ds → [1, 2, 3, 4]", kq: "[1, 2, 3, 4]" },
    ];
    var k, laDs;

    var node = MH.el(MH.khung("Sửa biến trong hàm có ảnh hưởng ra ngoài không?",
      "Hai chương trình gần như giống hệt nhau, chỉ khác <b>kiểu dữ liệu</b>. Chạy hết cái này rồi đổi sang " +
      "cái kia và so dòng cuối — kết quả <b>ngược nhau</b>, và đó là chỗ gây lỗi khó tìm nhất của bài.",
      '<div class="mh3-code" data-mh="code" style="max-width:360px;margin-bottom:12px"></div>' +
      '<div class="mh5-khung" data-mh="khung"></div>' +
      '<div class="mh5-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh5-tick"><input type="checkbox" data-mh="ds"> truyền vào một <b>danh sách</b> thay vì một <b>số</b></label>'));

    var loi = loiCua(node);
    function buoc() { return laDs ? BUOC_DS : BUOC_SO; }

    function ve() {
      var ds = buoc();
      var ma = laDs
        ? ["def them(a):", "    a.append(4)", "", "ds = [1, 2, 3]", "them(ds)", "print(ds)"]
        : ["def tang(x):", "    x = x + 1", "", "n = 5", "tang(n)", "print(n)"];
      /* Dòng code đang chạy suy từ số bước, không đánh số tay: đổi kịch bản là
         khỏi phải chỉnh lại bảng ánh xạ. */
      var dongNay = k < 0 ? -1 : [3, 4, 1, 4, 5][Math.min(k, 4)];
      node.querySelector('[data-mh="code"]').innerHTML = ma.map(function (d, i) {
        return '<div class="mh3-d' + (i === dongNay ? " nay" : "") + '">' + esc(d) + "</div>";
      }).join("");

      var b = k >= 0 ? ds[k] : null;
      var h = '<div class="mh5-k' + (b && !b.tr ? " nay" : "") + '"><b>Bên ngoài hàm</b>' +
        "<small>" + (b ? esc(b.ng) : "chưa có gì") + "</small></div>";
      if (b && b.tr) {
        h += '<div class="mh5-k nay' + (b.chung ? " chung" : "") + '"><b>Bên trong hàm</b>' +
          "<small>" + esc(b.tr) + (b.chung ? " — <b>cùng một danh sách!</b>" : " — bản sao riêng") + "</small></div>";
      }
      if (b && b.kq) {
        h += '<div class="mh5-k nay"><b>Màn hình in ra</b><small>' + esc(b.kq) + "</small></div>";
      }
      node.querySelector('[data-mh="khung"]').innerHTML = h;

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < ds.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh5-ghi" + (laDs ? "" : " xong");
      ghi.innerHTML = laDs
        ? "Với <b>danh sách</b>, hàm nhận <b>chính danh sách đó</b> chứ không phải bản sao — nên " +
          "<b>append</b>, <b>sort</b>, gán <b>a[0] = ...</b> đều đổi luôn biến ngoài. " +
          "Nhưng chú ý: gán lại <b>cả biến</b> (<b>a = [9, 9]</b>) thì chỉ đổi tên bên trong, biến ngoài vẫn nguyên. " +
          "Ranh giới là: <b>sửa nội dung</b> thì đổi cả ngoài, <b>gán lại tên</b> thì không."
        : "Với <b>số</b> (và xâu), hàm làm việc trên <b>bản sao giá trị</b>, nên gán lại bên trong không đụng gì " +
          "tới biến ngoài. Muốn lấy kết quả ra thì phải <b>return</b> rồi gán ở nơi gọi. " +
          "Giờ tích ô bên trên để chạy cùng kịch bản với một <b>danh sách</b> — kết quả sẽ ngược lại.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var ds = buoc();
      if (k >= ds.length - 1) {
        loi(laDs ? "Bỏ tích ô rồi chạy lại để so với trường hợp truyền một số."
                 : "Giờ tích ô <b>“truyền vào một danh sách”</b> và chạy lại — chú ý dòng cuối.");
        return;
      }
      k++; ve(); loi(ds[k].p);
    };
    function lamLai() {
      laDs = node.querySelector('[data-mh="ds"]').checked;
      k = -1; ve();
      loi("Chưa chạy dòng nào. Bấm “Bước tiếp” để chạy dòng đầu tiên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="ds"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-24 · BIỂU MẪU GỬI ĐI NHỮNG GÌ
   *
   *  NGỘ NHẬN: ô nào nhập được thì dữ liệu ô đó được gửi. Sai — ô thiếu thuộc
   *  tính name thì KHÔNG được gửi, mà biểu mẫu vẫn chạy bình thường nên không ai
   *  phát hiện. Cho gõ vào cả bốn ô rồi hiện đúng chuỗi máy chủ nhận được.
   * ================================================================ */
  MH.dangKy("C12-24", function (host) {
    napCss5();
    var O = [
      { nhan: "Họ tên", name: "ho_ten", gt: "Le An", type: "text" },
      { nhan: "Email", name: "", gt: "an@example.com", type: "text" },
      { nhan: "Lớp", name: "lop", gt: "12A", type: "text" },
      { nhan: "Mật khẩu", name: "mat_khau", gt: "abc123", type: "password" },
    ];
    var k;

    var node = MH.el(MH.khung("Biểu mẫu thật sự gửi đi những gì?",
      "Bấm từng bước để xem trình duyệt gom dữ liệu từng ô một. Ô <b>Email</b> cố ý <b>thiếu thuộc tính name</b> — " +
      "nhìn thì không khác gì các ô kia. Đổi phương thức để xem dữ liệu đi bằng đường nào.",
      '<div class="mh5-form" data-mh="form"></div>' +
      '<div class="mh5-goi" data-mh="goi"></div><div class="mh5-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhPt">Phương thức:</label>' +
      '<select class="mh4-chon" id="mhPt" data-mh="pt" style="min-height:40px">' +
      '<option value="post">POST</option><option value="get">GET</option></select>'));

    var loi = loiCua(node);
    function pt() { return node.querySelector('[data-mh="pt"]').value; }

    function ve() {
      node.querySelector('[data-mh="form"]').innerHTML = O.map(function (o, n) {
        var thieu = !o.name;
        return '<div class="mh5-r' + (thieu && n <= k ? " thieu" : "") + '">' +
          "<label>" + esc(o.nhan) + "</label>" +
          '<input class="mh5-i" type="' + o.type + '" value="' + esc(o.gt) + '" readonly>' +
          "</div>";
      }).join("");

      var gui = O.slice(0, k + 1).filter(function (o) { return o.name; });
      var chuoi = gui.map(function (o) { return o.name + "=" + encodeURIComponent(o.gt); }).join("&");
      var g = node.querySelector('[data-mh="goi"]');
      if (k < 0) { g.innerHTML = '<span style="color:var(--text-soft)">Chưa gom ô nào.</span>'; }
      else if (pt() === "get") {
        g.innerHTML = "Trình duyệt mở địa chỉ:<br><b>/dang-ki?" + esc(chuoi || "") + "</b>";
      } else {
        g.innerHTML = "Gửi kèm trong <b>thân yêu cầu</b> (không hiện trên thanh địa chỉ):<br><b>" +
          esc(chuoi || "(rỗng)") + "</b>";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < O.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh5-ghi";
      ghi.innerHTML = "Ô <b>Email</b> đã nhập chữ nhưng <b>không có trong dữ liệu gửi đi</b>, vì nó thiếu " +
        "thuộc tính <b>name</b>. Biểu mẫu vẫn chạy, vẫn gõ được, không báo lỗi gì — đó là lí do lỗi này " +
        "khó phát hiện. " +
        (pt() === "get"
          ? "Và chú ý: với <b>GET</b>, <b>mật khẩu hiện nguyên trên thanh địa chỉ</b>, bị lưu vào lịch sử " +
            "trình duyệt và ghi vào nhật kí máy chủ. Đổi sang <b>POST</b> xem khác thế nào."
          : "Với <b>POST</b>, dữ liệu đi trong thân yêu cầu nên không hiện trên thanh địa chỉ — bắt buộc " +
            "phải dùng cho mật khẩu. Thử đổi sang <b>GET</b> xem chuyện gì xảy ra.") +
        " Và dù gửi được, muốn <b>nhận và lưu</b> thì vẫn cần chương trình phía máy chủ.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= O.length - 1) {
        loi("Đổi phương thức ở trên để so <b>GET</b> với <b>POST</b> trên cùng bộ dữ liệu này.");
        return;
      }
      k++; ve();
      var o = O[k];
      loi(o.name
        ? "Ô <b>" + esc(o.nhan) + "</b> có <b>name=\"" + o.name + "\"</b> → gom thành cặp <b>" +
          o.name + "=" + esc(o.gt) + "</b>."
        : "Ô <b>" + esc(o.nhan) + "</b> <b>không có thuộc tính name</b> → trình duyệt <b>bỏ qua</b>, " +
          "dữ liệu người dùng vừa gõ không đi đâu cả.");
    };
    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để trình duyệt gom ô đầu tiên."); }
    ganDatLai(node, [node.querySelector('[data-mh="pt"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-26 · WIDTH ĐO PHẦN NÀO CỦA HỘP
   *
   *  NGỘ NHẬN kinh điển: đặt width:200px thì khối rộng 200px. Với box-sizing mặc
   *  định thì không — padding và viền CỘNG THÊM. Đây là lí do "hai khối 50% mà
   *  vẫn tràn hàng". Cho kéo padding rồi đo bằng thước ngay dưới hộp.
   * ================================================================ */
  MH.dangKy("C12-26", function (host) {
    napCss5();
    var W = 200;
    var k, tay;
    var BUOC = [
      { p: 0, b: 0, bb: false, noi: "Chưa có padding và viền: chiều rộng thật đúng bằng <b>width</b>. Đây là lúc ngộ nhận chưa lộ ra." },
      { p: 20, b: 0, bb: false, noi: "Thêm <b>padding: 20px</b>. Chiều rộng thật thành <b>200 + 20×2 = 240px</b> — <b>width</b> không hề thay đổi, nhưng khối đã rộng hơn." },
      { p: 20, b: 6, bb: false, noi: "Thêm <b>border: 6px</b>. Rộng thật <b>200 + 40 + 12 = 252px</b>. Con số ta viết là 200 mà thứ chiếm chỗ trên màn hình là 252." },
      { p: 20, b: 6, bb: true, noi: "Bật <b>box-sizing: border-box</b>. Rộng thật <b>đúng 200px</b> — padding và viền giờ ăn vào trong, phần nội dung hẹp lại còn 148px." },
    ];

    var node = MH.el(MH.khung("Đặt width: 200px thì khối rộng bao nhiêu?",
      "Khối dưới đây luôn đặt <b>width: 200px</b>. Bấm từng bước để thêm padding và viền, rồi bật " +
      "<b>box-sizing</b>. Thước ở dưới đo <b>chiều rộng thật</b> mà khối chiếm trên màn hình.",
      '<div data-mh="hop"></div><div class="mh5-thuoc" data-mh="thuoc"></div>' +
      '<div class="mh3-code" data-mh="code" style="max-width:280px;margin:14px auto 0"></div>' +
      '<div class="mh5-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhPad">padding:</label>' +
      '<input class="mh5-range" id="mhPad" data-mh="p" type="range" min="0" max="40" step="4" value="0">' +
      '<span class="mh4-nut" style="pointer-events:none" data-mh="pn"></span>' +
      '<label class="mh5-tick"><input type="checkbox" data-mh="bb"> box-sizing: border-box</label>'));

    var loi = loiCua(node);
    function ts() {
      if (tay) return { p: +node.querySelector('[data-mh="p"]').value, b: 6,
                        bb: node.querySelector('[data-mh="bb"]').checked };
      return BUOC[k];
    }

    function ve() {
      var t = ts();
      node.querySelector('[data-mh="p"]').value = t.p;
      node.querySelector('[data-mh="bb"]').checked = t.bb;
      node.querySelector('[data-mh="pn"]').textContent = t.p + "px";

      var that = t.bb ? W : W + t.p * 2 + t.b * 2;
      var noiDung = t.bb ? Math.max(0, W - t.p * 2 - t.b * 2) : W;
      node.querySelector('[data-mh="hop"]').innerHTML =
        '<div class="mh5-vien" style="width:' + that + "px;margin:0 auto;border-width:" + t.b + 'px">' +
        '<div class="mh5-pad" style="padding:' + t.p + 'px">' +
        '<div class="mh5-noi">nội dung ' + noiDung + "px</div></div></div>";

      /* Thước vẽ ĐÚNG bằng chiều rộng thật để mắt so được với hộp ngay phía trên,
         chứ không phải một thanh cố định có ghi số. */
      node.querySelector('[data-mh="thuoc"]').innerHTML =
        '<div style="width:' + that + 'px;margin:0 auto;position:relative;height:22px">' +
        '<i style="left:0;right:0"></i>' +
        '<i style="left:0;width:2px;height:10px;top:5px"></i>' +
        '<i style="right:0;width:2px;height:10px;top:5px"></i>' +
        '<b style="left:50%">rộng thật ' + that + "px</b></div>";

      node.querySelector('[data-mh="code"]').innerHTML =
        ['.khoi {', '  width: 200px;',
         '  padding: ' + t.p + 'px;',
         '  border: ' + t.b + 'px solid;',
         t.bb ? '  box-sizing: border-box;' : '  /* box-sizing mặc định */',
         '}'].map(function (d, i) {
          return '<div class="mh3-d' + (i === 4 && t.bb ? " nay" : "") + '">' + esc(d) + "</div>";
        }).join("");

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = false;
      if (t.bb) {
        ghi.className = "mh5-ghi xong";
        ghi.innerHTML = "Với <b>border-box</b>, con số mình viết <b>đúng bằng</b> thứ chiếm chỗ trên màn hình. " +
          "Vì vậy gần như mọi dự án web đặt ngay từ đầu: <b>* { box-sizing: border-box; }</b>";
      } else if (that > W) {
        ghi.className = "mh5-ghi";
        ghi.innerHTML = "Viết <b>200px</b> mà chiếm <b>" + that + "px</b> — chênh <b>" + (that - W) + "px</b>. " +
          "Đây chính là lí do đặt hai khối <b>width: 50%</b> cạnh nhau mà chúng vẫn <b>tràn xuống hàng dưới</b>: " +
          "50% + 50% = 100%, nhưng cộng thêm padding và viền là vượt quá bề ngang.";
      } else { ghi.hidden = true; }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      tay = false;
      if (k >= BUOC.length - 1) {
        loi("Giờ tự kéo <b>padding</b> và bật/tắt <b>box-sizing</b> để xem thước đổi theo.");
        return;
      }
      k++; ve(); loi(BUOC[k].noi);
    };
    ["p", "bb"].forEach(function (x) {
      var o = node.querySelector('[data-mh="' + x + '"]');
      o.addEventListener(x === "bb" ? "change" : "input", function () {
        tay = true;
        node.querySelector('[data-mh="lai"]').dispatchEvent(new Event("click"));
      });
    });
    function lamLai() { k = 0; tay = false; ve(); loi(BUOC[0].noi + " Bấm “Bước tiếp”."); }
    node.querySelector('[data-mh="lai"]').addEventListener("click", function (e) {
      if (e.isTrusted) { tay = false; lamLai(); } else ve();
    });
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-29 · TRUNG BÌNH VÀ TRUNG VỊ
   *
   *  NGỘ NHẬN: trung bình đại diện cho "người bình thường". Chỉ đúng khi dữ liệu
   *  không lệch. Cho kéo MỘT giá trị lên cao và xem hai con số tách nhau ra —
   *  đây là chỗ dạy nhanh nhất trong cả chương khoa học dữ liệu.
   * ================================================================ */
  MH.dangKy("C12-29", function (host) {
    napCss5();
    var GOC = [8, 9, 10, 11, 12, 13, 14, 15, 16];
    var k, tay;
    var BUOC = [
      { v: 16, noi: "Chín mức lương khá đều nhau. <b>Trung bình</b> và <b>trung vị</b> gần như trùng — lúc này trung bình đại diện tốt." },
      { v: 40, noi: "Người cuối lên <b>40 triệu</b>. Trung bình đã nhích lên, trung vị <b>đứng yên</b>." },
      { v: 90, noi: "Lên <b>90 triệu</b>. Trung bình giờ cao hơn <b>tám trên chín</b> người trong bảng — nói “lương trung bình” là gây hiểu nhầm." },
      { v: 200, noi: "Lên <b>200 triệu</b>. Trung bình vọt lên, trung vị <b>vẫn y nguyên</b>: nó chỉ quan tâm ai đứng giữa, không quan tâm người cuối cao bao nhiêu." },
    ];

    var node = MH.el(MH.khung("Trung bình hay trung vị mới nói đúng?",
      "Chín người, lương tính bằng triệu đồng. Bấm từng bước để kéo <b>một</b> người lên cao dần, " +
      "rồi xem hai con số tách nhau ra thế nào.",
      '<div class="mh5-cot" data-mh="cot"></div><div style="height:18px"></div>' +
      '<div class="mh5-so" data-mh="so"></div><div class="mh5-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhCao">Lương người cuối:</label>' +
      '<input class="mh5-range" id="mhCao" data-mh="v" type="range" min="16" max="200" step="8" value="16">' +
      '<span class="mh4-nut" style="pointer-events:none" data-mh="vn"></span>'));

    var loi = loiCua(node);
    function giaTri() { return tay ? +node.querySelector('[data-mh="v"]').value : BUOC[k].v; }
    function day() { var a = GOC.slice(); a[a.length - 1] = giaTri(); return a; }
    function trungBinh(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
    /* Dãy đã tăng dần sẵn nên trung vị là phần tử giữa. Vẫn sắp lại cho chắc,
       phòng khi sau này ai đó đổi dữ liệu gốc thành thứ tự khác. */
    function trungVi(a) {
      var b = a.slice().sort(function (x, y) { return x - y; }), n = b.length;
      return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2;
    }

    function ve() {
      var a = day(), tb = trungBinh(a), tv = trungVi(a), max = Math.max.apply(null, a);
      node.querySelector('[data-mh="v"]').value = giaTri();
      node.querySelector('[data-mh="vn"]').textContent = giaTri() + " tr";
      node.querySelector('[data-mh="cot"]').innerHTML = a.map(function (v, n) {
        return '<div class="mh5-c' + (n === a.length - 1 && v > 20 ? " lech" : "") +
          '" style="height:' + Math.max(6, (v / max) * 110).toFixed(0) + 'px"><span>' + v + "</span></div>";
      }).join("");
      var duoiTb = a.filter(function (v) { return v < tb; }).length;
      node.querySelector('[data-mh="so"]').innerHTML =
        "Trung bình: <b>" + thap(tb) + "</b> triệu · Trung vị: <b>" + thap(tv) + "</b> triệu" +
        '<div style="font:600 11.5px var(--font-sans);color:var(--text-soft);margin-top:4px">' +
        duoiTb + "/" + a.length + " người có lương <b>thấp hơn</b> mức trung bình</div>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (tb - tv < 2) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh5-ghi";
      ghi.innerHTML = "Chênh lệch <b>" + thap(tb - tv) + " triệu</b>. Chỉ <b>một</b> người thay đổi mà " +
        "trung bình chạy theo, còn trung vị đứng yên — vì trung vị chỉ hỏi <b>ai đứng giữa</b>. " +
        "Nói “lương trung bình <b>" + thap(tb) + "</b> triệu” là đúng về số học nhưng <b>gây hiểu nhầm</b>, " +
        "vì <b>" + duoiTb + "/" + a.length + "</b> người nhận thấp hơn thế. " +
        "Quy tắc: dữ liệu có <b>giá trị cực đoan</b> thì nhìn <b>trung vị</b>.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      tay = false;
      if (k >= BUOC.length - 1) {
        loi("Tự kéo thanh trượt về <b>16</b> xem hai con số có nhập lại làm một không. " +
          "Và nhớ thêm một bẫy nữa của bài: <b>tương quan không phải nhân quả</b>.");
        return;
      }
      k++; ve(); loi(BUOC[k].noi);
    };
    node.querySelector('[data-mh="v"]').addEventListener("input", function () {
      tay = true;
      node.querySelector('[data-mh="lai"]').dispatchEvent(new Event("click"));
    });
    function lamLai() { k = 0; tay = false; ve(); loi(BUOC[0].noi + " Bấm “Bước tiếp”."); }
    node.querySelector('[data-mh="lai"]').addEventListener("click", function (e) {
      if (e.isTrusted) { tay = false; lamLai(); } else ve();
    });
    host.appendChild(node); lamLai();
  });

  napCss5();
})();
