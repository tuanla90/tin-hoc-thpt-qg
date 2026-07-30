/* ============================================================================
 *  KHỐI "SƠ ĐỒ CỦA BÀI" — bộ sinh sơ đồ
 *
 *  VÌ SAO KHÔNG CHÈN LINK ẢNH — đây là câu trả lời cho ý "hay là chèn thêm ảnh":
 *    1. App cài được ra màn hình chính và chạy offline (xem sw.js). Ảnh lấy từ
 *       máy chủ khác là mất hình ngay khi mất mạng, đúng lúc cần nhất.
 *    2. Repo CÓ sẵn 480 ảnh trang sách trong public/sach/pages/, nhưng đó là ảnh
 *       scan sách có bản quyền. Các tệp clean-*.js đã cố ý bỏ trường 'sgk' và ghi
 *       rõ "nội dung gốc, không chép SGK" — bán phần mềm mà chèn lại ảnh sách là
 *       rủi ro pháp lí thật, không phải chuyện hình thức.
 *    3. Ảnh tĩnh tải về thì không đổi màu theo giao diện, không xuống dòng theo
 *       khổ máy, và không phóng to được mà không bị nhoè.
 *  Sơ đồ dựng bằng HTML + CSS thì tránh cả ba: vài trăm byte dữ liệu mỗi bài,
 *  chạy offline, tự đổi màu sáng/tối, và tự xếp lại thành một cột trên điện thoại.
 *
 *  VÌ SAO LÀ BỘ SINH CHỨ KHÔNG PHẢI VẼ TỪNG CÁI: vẽ tay từng sơ đồ thì mỗi bài
 *  tốn hàng chục dòng và trông mỗi cái một kiểu. Ở đây chỉ có NĂM kiểu sơ đồ, còn
 *  dữ liệu mỗi bài chỉ là mấy dòng chữ — nhờ vậy phủ được nhiều bài, và mọi sơ đồ
 *  trong app nhìn ra là cùng một bộ.
 *
 *  Năm kiểu:
 *    luong  – quy trình các bước nối tiếp nhau (DNS, kiểm thử, khoa học dữ liệu)
 *    tang   – các tầng xếp lớp, tầng đầu tiên trong danh sách nằm TRÊN CÙNG
 *    cay    – một gốc chia thành nhiều nhánh (AI → học máy → học sâu)
 *    doi    – so sánh hai bên (RAM / ổ cứng, biên dịch / thông dịch)
 *    vong   – như luong nhưng có mũi quay lại bước đầu
 *
 *  Nội dung theo bài nằm ở js/so-do-noi-dung.js (nạp SAU tệp này).
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  var THEO_BAI = {};

  function napCss() {
    if (document.getElementById("sdCss")) return;
    var st = document.createElement("style");
    st.id = "sdCss";
    st.textContent =
      ".sd{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:15px 16px;margin:0 0 18px}" +
      ".sd h4{margin:0 0 4px;font-family:var(--font-display);font-size:16px}" +
      ".sd-mo{margin:0 0 14px;font-size:13.5px;line-height:1.55;color:var(--text-soft)}" +
      ".sd-khung{background:var(--bg-soft);border-radius:12px;padding:14px 12px}" +
      ".sd-ghi{margin:12px 0 0;font-size:12.5px;line-height:1.55;color:var(--text-soft)}" +
      ".sd-ghi b{color:var(--text)}" +

      /* ---- Ô cơ bản, dùng chung cho cả năm kiểu ---- */
      ".sd-o{border:1.5px solid var(--sd-vien,var(--border-strong));border-radius:10px;background:var(--bg-card);" +
        "padding:9px 11px;text-align:center}" +
      ".sd-o b{display:block;font:800 13px/1.35 var(--font-sans);color:var(--text)}" +
      ".sd-o span{display:block;margin-top:3px;font:600 11.5px/1.45 var(--font-sans);color:var(--text-soft)}" +
      ".sd-o.dam{background:var(--sd-nen,var(--primary-soft));border-color:var(--sd-mau,var(--primary))}" +
      ".sd-o.dam b{color:var(--sd-mau,var(--primary))}" +
      /* Phải viết ".sd-o .sd-so" chứ không phải ".sd-so": luật ".sd-o span" ở trên có
         độ ưu tiên 0,1,1 — cao hơn một class trơn (0,1,0) — nên nó đè cả màu chữ lẫn
         display, làm ô số thành khối chữ xám trên nền tím, lệch sang trái và không
         căn giữa được. Đã đo thấy đúng như vậy trước khi sửa. */
      ".sd-o .sd-so{display:flex;align-items:center;justify-content:center;width:19px;height:19px;flex:none;" +
        "border-radius:6px;background:var(--sd-mau,var(--primary));color:#fff;" +
        "font:800 11px var(--font-mono);margin:0 auto 4px}" +

      /* ---- luong / vong: hàng ngang, xuống một cột khi hẹp ---- */
      /* KHÔNG cho xuống dòng: quy trình 5 bước xuống hai hàng thì mũi cuối của hàng
         một chỉ vào khoảng trống, đọc ra thành sơ đồ vẽ sai. Ở khổ trang thật (~604px
         lọt lòng) năm ô phải vừa một hàng, nên min-width để 84px và gap 5px:
         5×84 + 4×17 (mũi) + 8×5 (khoảng) = 528px, còn thừa chỗ để flex-grow giãn đều.
         Bước nào tên dài thì chữ tự xuống dòng trong ô — chấp nhận được, còn cả sơ đồ
         xuống dòng thì không. Dưới 560px đã có luật riêng xếp thành một cột. */
      ".sd-luong{display:flex;align-items:stretch;justify-content:center;gap:5px;flex-wrap:nowrap}" +
      ".sd-luong>.sd-o{flex:1 1 84px;min-width:84px;max-width:170px;padding:9px 6px;" +
        "display:flex;flex-direction:column;justify-content:center;overflow-wrap:break-word}" +
      ".sd-mui{display:flex;align-items:center;color:var(--sd-mau,var(--primary));flex:none}" +
      ".sd-quay{margin-top:11px;text-align:center;font:700 12px var(--font-sans);color:var(--sd-mau,var(--primary))}" +

      /* ---- tang: các thanh xếp dọc ---- */
      ".sd-tang{display:grid;gap:5px;max-width:430px;margin:0 auto}" +
      ".sd-tang>.sd-o{text-align:left;display:flex;gap:10px;align-items:baseline;justify-content:space-between}" +
      ".sd-tang>.sd-o b{display:inline;font-size:13px}" +
      ".sd-tang>.sd-o span{display:inline;margin:0;text-align:right;flex:1 1 auto}" +
      ".sd-tang-nhan{display:flex;justify-content:space-between;font:700 11px var(--font-sans);" +
        "color:var(--text-soft);max-width:430px;margin:0 auto 6px}" +

      /* ---- cay: một gốc, nhiều nhánh ---- */
      ".sd-cay{display:grid;justify-items:center;gap:0}" +
      ".sd-cay>.sd-o{max-width:280px}" +
      ".sd-nhanh{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative;padding-top:26px;width:100%}" +
      /* Cuống dọc từ ô gốc xuống thanh ngang, rồi thanh ngang tới các nhánh.
         Thanh ngang thu vào 12% mỗi bên để không thò ra ngoài ô nhánh ngoài cùng. */
      ".sd-nhanh::before{content:'';position:absolute;top:0;left:50%;width:2px;height:13px;background:var(--border-strong)}" +
      ".sd-nhanh::after{content:'';position:absolute;top:12px;left:12%;right:12%;height:2px;background:var(--border-strong)}" +
      ".sd-nhanh>.sd-o{flex:1 1 120px;min-width:104px;max-width:190px;position:relative;margin-top:0}" +
      ".sd-nhanh>.sd-o::before{content:'';position:absolute;top:-14px;left:50%;width:2px;height:14px;background:var(--border-strong)}" +

      /* ---- doi: hai cột so sánh ---- */
      ".sd-doi{display:grid;grid-template-columns:1fr 1fr;gap:11px}" +
      ".sd-cot{border:1.5px solid var(--border-strong);border-radius:11px;background:var(--bg-card);overflow:hidden}" +
      ".sd-cot>h5{margin:0;padding:9px 11px;font:800 13px var(--font-sans);text-align:center;" +
        "background:var(--bg-soft);border-bottom:1.5px solid var(--border)}" +
      ".sd-cot.a>h5{background:var(--primary-soft);color:var(--primary);border-bottom-color:var(--primary)}" +
      ".sd-cot.b>h5{background:var(--info-soft);color:var(--info);border-bottom-color:var(--info)}" +
      ".sd-cot ul{margin:0;padding:9px 11px 10px 26px;display:grid;gap:5px}" +
      ".sd-cot li{font:600 12.5px/1.5 var(--font-sans);color:var(--text)}" +
      ".sd-doi-hoi{grid-column:1/-1;text-align:center;font:700 12px var(--font-sans);color:var(--text-soft);" +
        "background:var(--bg-card);border:1px dashed var(--border-strong);border-radius:9px;padding:7px 10px}" +

      /* MỐC 700px CHO RIÊNG QUY TRÌNH, không dùng chung 560px với hai kiểu kia.
         Lí do đo được: một hàng năm ô cần 528px, mà bề rộng lọt lòng bằng bề rộng
         cửa sổ trừ khoảng 106px (lề trang + padding của .sd + padding của .sd-khung).
         Vậy dưới ~634px là tràn ngang. Lấy 700px cho dư một chút.
         Mũi chỉ phải quay 90 độ khi xếp dọc — không quay thì nó chỉ ngang trong khi
         các bước xếp xuống, đọc ra thành sơ đồ vẽ sai. */
      "@media (max-width:700px){" +
        ".sd-luong{flex-direction:column;align-items:stretch;flex-wrap:wrap}" +
        ".sd-luong>.sd-o{max-width:none;min-width:0;padding:9px 11px}" +
        ".sd-mui{justify-content:center;transform:rotate(90deg)}" +
      "}" +
      "@media (max-width:560px){" +
        ".sd-doi{grid-template-columns:1fr}" +
        /* Cây xuống một cột thì thanh ngang vô nghĩa — thay bằng cuống dọc bên trái. */
        ".sd-nhanh{flex-direction:column;padding-top:13px}" +
        ".sd-nhanh::after{display:none}" +
        ".sd-nhanh>.sd-o{max-width:none}" +
        ".sd-nhanh>.sd-o::before{display:none}" +
      "}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);font-size:.94em">$1</code>');
  }
  function mui() {
    var svg = typeof window.ICON === "function" ? window.ICON("aright", 17) : "&rarr;";
    return '<span class="sd-mui" aria-hidden="true">' + svg + "</span>";
  }
  /* Ô một tầng: b là dòng đậm, span là dòng phụ. fmt cho cả hai để viết được
     `code` trong tên ô (ví dụ tầng CSS có `padding`). */
  function o(m, cls, so) {
    return '<div class="sd-o' + (cls ? " " + cls : "") + '">' +
      (so != null ? '<span class="sd-so" aria-hidden="true">' + so + "</span>" : "") +
      "<b>" + fmt(m.t) + "</b>" + (m.p ? "<span>" + fmt(m.p) + "</span>" : "") + "</div>";
  }

  function veLuong(d) {
    var h = d.muc.map(function (m, i) { return o(m, "dam", i + 1); }).join(mui());
    return '<div class="sd-luong">' + h + "</div>" +
      (d.kieu === "vong"
        ? '<div class="sd-quay">' + fmt(d.quayLai || "rồi quay lại bước 1 với dữ liệu mới") + "</div>"
        : "");
  }
  function veTang(d) {
    /* Nhãn hai đầu để người đọc biết trục dọc nghĩa là gì — thiếu nó thì một chồng
       thanh xám không nói lên điều gì, và người học không biết đọc từ trên hay dưới. */
    var nhan = d.tren || d.duoi
      ? '<div class="sd-tang-nhan"><span>' + esc(d.tren || "") + "</span><span>" + esc(d.duoi || "") + "</span></div>"
      : "";
    return nhan + '<div class="sd-tang">' +
      d.muc.map(function (m, i) { return o(m, i === 0 || i === d.muc.length - 1 ? "dam" : ""); }).join("") +
      "</div>";
  }
  function veCay(d) {
    return '<div class="sd-cay">' + o(d.goc, "dam") +
      '<div class="sd-nhanh">' + d.muc.map(function (m) { return o(m); }).join("") + "</div></div>";
  }
  function veDoi(d) {
    var cot = function (c, cls) {
      return '<div class="sd-cot ' + cls + '"><h5>' + fmt(c.t) + "</h5><ul>" +
        c.y.map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ul></div>";
    };
    return '<div class="sd-doi">' + cot(d.a, "a") + cot(d.b, "b") +
      (d.hoi ? '<div class="sd-doi-hoi">' + fmt(d.hoi) + "</div>" : "") + "</div>";
  }

  var VE = { luong: veLuong, vong: veLuong, tang: veTang, cay: veCay, doi: veDoi };

  /* Mỗi sơ đồ mượn một màu của bộ giao diện. Đặt qua biến CSS trên chính khối
     .sd nên mọi phần bên trong tự thừa hưởng, khỏi truyền màu xuống từng ô. */
  var MAU = { primary: 1, info: 1, success: 1, warning: 1, danger: 1 };

  function veVao(host, id) {
    var d = THEO_BAI[id];
    if (!host || !d || !VE[d.kieu]) return false;
    napCss();
    var box = document.createElement("div");
    box.className = "sd";
    var m = MAU[d.mau] ? d.mau : "primary";
    box.style.setProperty("--sd-mau", "var(--" + m + ")");
    box.style.setProperty("--sd-nen", "var(--" + m + "-soft)");
    box.style.setProperty("--sd-vien", "var(--border-strong)");
    try {
      box.innerHTML =
        "<h4>" + fmt(d.ten) + "</h4>" +
        (d.mo ? '<p class="sd-mo">' + fmt(d.mo) + "</p>" : "") +
        '<div class="sd-khung">' + VE[d.kieu](d) + "</div>" +
        (d.ghi ? '<p class="sd-ghi">' + fmt(d.ghi) + "</p>" : "");
    } catch (e) {
      console.error("[so-do] Không dựng được sơ đồ của " + id + ":", e);
      return false;
    }
    host.appendChild(box);
    return true;
  }

  /* Cắm NGAY TRƯỚC phần lý thuyết, không phải cuối bài. Sơ đồ ở đây làm việc của
     một tấm bản đồ: đọc trước để biết bài này gồm mấy phần và chúng liên quan thế
     nào, rồi đọc chữ mới không bị lạc. Đặt cuối bài thì nó thành phần tóm tắt —
     mà việc tóm tắt đã có khối "Cần nhớ" lo rồi. */
  function injectSoDo(lesson) {
    if (!lesson || !THEO_BAI[lesson.id]) return;
    var app = document.getElementById("app");
    if (!app || app.querySelector(".sd")) return;
    var neo = app.querySelector(".lesson-body");
    if (!neo || !neo.parentNode) return;
    var wrap = document.createElement("div");
    neo.parentNode.insertBefore(wrap, neo);
    if (!veVao(wrap, lesson.id)) wrap.remove();
  }

  window.injectSoDo = injectSoDo;
  window.SoDo = {
    dangKy: function (id, d) { THEO_BAI[id] = d; },
    coBai: function () { return Object.keys(THEO_BAI); },
    veVao: veVao,
  };
})();
