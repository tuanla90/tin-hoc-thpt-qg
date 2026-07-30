/* ============================================================================
 *  ÔN NHANH — tổng kết chương, bẫy hay gặp, và bản in
 *
 *  VÌ SAO GỘP BA THỨ VÀO MỘT TỆP, MỘT MÀN: cả ba đều lắp từ CÙNG một nguồn dữ
 *  liệu đã có sẵn trong app — không tệp nào ở đây tự viết nội dung mới:
 *    · câu chốt   ← "chot" của js/sai-o-dau-*.js (105 câu), thiếu thì lấy "ghi"
 *                   của js/so-do-noi-dung*.js, thiếu nữa mới lấy keypoints[0]
 *    · bẫy        ← các dòng có "sai: true" của js/sai-o-dau-*.js (186 dòng)
 *    · cấu trúc   ← LESSON_CHAPTERS trong js/app.js (17 chương)
 *  Tách thành ba tính năng rời thì ba lần đi lấy cùng một nguồn, và ba chỗ phải
 *  sửa mỗi khi thêm bài.
 *
 *  VÌ SAO KHÔNG LÀM MIND MAP KÉO–THẢ–PHÓNG TO: một bản đồ 119 nhánh thì trên
 *  điện thoại không đọc nổi, mà bản đồ lộ trình (renderLessons) đã lo phần "cả
 *  chặng trông thế nào" rồi. Thứ còn thiếu là mức CHƯƠNG: mở một màn thấy hết
 *  các bài trong chương cùng câu chốt của từng bài. Đó là việc trang này làm.
 *
 *  VÌ SAO DANH SÁCH BẪY LÀ PHẦN ĐÁNG GIÁ NHẤT: đề có 4 câu Đúng/Sai = 16 phát
 *  biểu phải phán. Ôn gấp bằng danh sách kiến thức ĐÚNG thì không luyện được kĩ
 *  năng đó; đọc thẳng những phát biểu nghe xuôi tai mà SAI mới đúng việc.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  function napCss() {
    if (document.getElementById("onCss")) return;
    var st = document.createElement("style");
    st.id = "onCss";
    st.textContent =
      ".on-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}" +
      ".on-tab{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-soft);border-radius:999px;" +
        "padding:9px 16px;font:800 13px var(--font-sans);cursor:pointer;min-height:40px}" +
      ".on-tab:hover{border-color:var(--primary);color:var(--primary)}" +
      ".on-tab.chon{background:var(--primary);border-color:var(--primary);color:#fff}" +
      ".on-loc{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:0 0 16px}" +
      ".on-chip{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-soft);border-radius:999px;" +
        "padding:7px 13px;font:700 12.5px var(--font-sans);cursor:pointer;min-height:36px}" +
      ".on-chip.chon{background:var(--primary-soft);border-color:var(--primary);color:var(--primary)}" +
      ".on-tim{flex:1;min-width:180px;border:1.5px solid var(--border);background:var(--bg-card);color:var(--text);" +
        "border-radius:10px;padding:9px 12px;font:600 16px var(--font-sans);min-height:40px}" +
      ".on-tim:focus{outline:none;border-color:var(--primary)}" +

      /* ---- thẻ chương ở màn chính ---- */
      ".on-luoi{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}" +
      /* Phải đặt color: <button> KHÔNG kế thừa màu chữ mà lấy mặc định của trình
         duyệt (đen). Chế độ tối thì thành chữ đen trên nền tối. Các nút khác trong
         tệp này đều đã đặt màu, riêng thẻ chương thì quên — đã đo thấy. */
      ".on-the{display:block;width:100%;text-align:left;border:1.5px solid var(--border);border-left:5px solid var(--cc,var(--primary));" +
        "background:var(--bg-card);color:var(--text);border-radius:var(--radius);padding:13px 15px;cursor:pointer;transition:all .2s}" +
      ".on-the:hover{border-color:var(--primary);border-left-color:var(--cc,var(--primary));transform:translateY(-2px)}" +
      ".on-the b{display:block;font:800 14.5px/1.4 var(--font-sans);color:var(--text)}" +
      ".on-the small{display:block;margin-top:4px;font:600 12.5px var(--font-sans);color:var(--text-soft)}" +

      /* ---- sống chương: các bài nối thành một mạch dọc ---- */
      ".on-song{position:relative;padding-left:30px;margin-top:6px}" +
      ".on-song::before{content:'';position:absolute;left:11px;top:8px;bottom:8px;width:2px;background:var(--border-strong)}" +
      ".on-nut{position:relative;margin-bottom:11px}" +
      ".on-nut::before{content:'';position:absolute;left:-24px;top:13px;width:11px;height:11px;border-radius:50%;" +
        "background:var(--cc,var(--primary));border:2px solid var(--bg);box-shadow:0 0 0 2px var(--cc,var(--primary))}" +
      ".on-nut.xong::before{background:var(--success);box-shadow:0 0 0 2px var(--success)}" +
      ".on-hop{border:1.5px solid var(--border);border-radius:12px;background:var(--bg-card);padding:11px 14px}" +
      ".on-hop-d{display:flex;gap:9px;align-items:baseline;flex-wrap:wrap}" +
      ".on-hop-d b{font:800 14px/1.4 var(--font-sans)}" +
      ".on-hop-d a{font:700 12px var(--font-sans);color:var(--primary);text-decoration:none;margin-left:auto;flex:none}" +
      ".on-hop-d a:hover{text-decoration:underline}" +
      ".on-chot{margin:7px 0 0;font:600 13px/1.65 var(--font-sans);color:var(--text)}" +
      ".on-chot b{font-weight:800}" +
      ".on-nhan{display:inline-flex;align-items:center;gap:4px;font:800 10.5px var(--font-sans);text-transform:uppercase;" +
        "letter-spacing:.03em;color:var(--text-soft);border:1px solid var(--border);border-radius:5px;padding:1px 6px}" +

      /* ---- danh sách bẫy ---- */
      ".on-bay{border:1.5px solid var(--border);border-radius:12px;background:var(--bg-card);margin-bottom:10px;overflow:hidden}" +
      ".on-bay-d{display:block;width:100%;text-align:left;cursor:pointer;border:0;background:none;color:var(--text);" +
        "padding:12px 14px;font:600 13.5px/1.6 var(--font-sans)}" +
      ".on-bay-d:hover{background:var(--bg-soft)}" +
      ".on-bay-d .on-sai{display:inline-block;font:800 10.5px var(--font-sans);color:var(--danger);border:1px solid var(--danger);" +
        "border-radius:5px;padding:0 5px;margin-right:7px;vertical-align:1px}" +
      ".on-vi{padding:0 14px 12px;font:600 13px/1.65 var(--font-sans);color:var(--text-soft);" +
        "border-top:1px dashed var(--border);margin-top:2px;padding-top:10px}" +
      ".on-vi b{color:var(--text);font-weight:800}" +
      ".on-vi-bai{display:block;margin-top:7px;font:700 11.5px var(--font-sans)}" +
      ".on-vi-bai a{color:var(--primary);text-decoration:none}" +
      ".on-vi-bai a:hover{text-decoration:underline}" +
      ".on-trong{text-align:center;color:var(--text-soft);font-size:14px;padding:30px 10px}" +

      /* ---- bản in ---- */
      ".on-in-mo{border:1px solid var(--warning);background:var(--warning-soft);border-radius:10px;padding:10px 13px;" +
        "font:600 12.5px/1.6 var(--font-sans);margin:0 0 16px}" +
      ".on-in-chuong{margin:0 0 16px;break-inside:avoid}" +
      ".on-in-chuong h3{margin:0 0 7px;font:800 14px var(--font-sans);color:var(--cc,var(--primary));" +
        "border-bottom:2px solid var(--cc,var(--primary));padding-bottom:3px}" +
      ".on-in-y{margin:0;padding-left:19px}" +
      ".on-in-y li{font:600 12.5px/1.6 var(--font-sans);margin-bottom:4px}" +
      ".on-in-y li b{font-weight:800}" +
      ".on-in-y li i{font-style:normal;color:var(--text-soft);font-weight:700}" +

      /* ---- IN RA GIẤY ----
         CHIA LÀM HAI NHÓM, và ranh giới này là chỗ bản đầu làm sai:

         (a) ẨN PHẦN VỎ — áp dụng cho MỌI trang, không cần lớp nào.
             Bản đầu khoá cả nhóm này sau "body.in-nhanh", tức là chỉ chạy ở màn
             Bản in. Nhưng người ta in cả màn Tổng kết chương (rất tự nhiên, nó
             chính là bản tóm tắt), và lúc đó không có lớp nào nên nút trợ lý AI
             in đè lên chữ. Mà thật ra ẩn thanh trên, chân trang và mấy nút nổi là
             việc ĐÚNG cho mọi trang của app: chẳng ai muốn in ra tờ giấy có nút
             chat AI ở góc.

         (b) ÉP MÀU VÀ BỎ LỀ — chỉ ở màn Bản in (lớp "in-nhanh").
             Luật "* { color:#000 }" quá mạnh để bật ở mọi trang: in một bài học
             có code tô màu thì mất hết phân biệt. */

      /* (a) */
      "@media print{" +
        ".topbar,.footer,.on-khong-in{display:none!important}" +
        /* Mọi thứ NỔI đều phải biến mất. Hai lớp phòng thủ, vì liệt kê tay thì
           lần sau thêm nút nổi mới lại sót:
             · danh sách dưới đây bắt những cái đã biết;
             · lớp .on-an-khi-in do beforeprint quét động, bắt cả những thứ chưa
               có tên ở đây và những hộp mới hiện ra ngay trước lúc in. */
        ".floating-mascot-container,.toast,#nhacBar,#pwaBar," +
        ".tt-nen,.tt-panel,.tt-fab," +
        ".modal-overlay,.pay-nen,.plan-nen," +
        ".gam-xpfloat,.gam-cele,.gam-confetti," +
        ".on-an-khi-in{display:none!important}" +
        "@page{margin:14mm}" +
      "}" +
      /* (b) */
      "@media print{" +
        /* Nền trang phải đặt trên <html>, KHÔNG phải <body>: nền của body được lan
           lên canvas, nên luật nhắm vào body không đổi được màu nền trang dù có
           !important (đã đo: đặt gì trên body cũng vẫn ra #f8fafc, đặt trên html
           thì đổi ngay). Vì vậy lớp "in-nhanh" gắn lên CẢ HAI phần tử. */
        "html.in-nhanh{background:#fff!important}" +
        "body.in-nhanh{background:#fff!important}" +
        "body.in-nhanh .app-main{padding:0!important;max-width:none!important}" +
        /* Ép nền trắng chữ đen: nhiều máy in bỏ qua màu nền, ra chữ trắng trên
           giấy trắng là mất luôn nội dung. */
        "body.in-nhanh *{color:#000!important;background:transparent!important;box-shadow:none!important}" +
        "body.in-nhanh .on-in-chuong h3{border-bottom:1.5px solid #000!important}" +
        "body.in-nhanh .on-in-y li i{color:#444!important}" +
      "}" +
      "@media (max-width:560px){.on-luoi{grid-template-columns:1fr}.on-song{padding-left:24px}" +
        ".on-nut::before{left:-19px}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);font-size:.94em">$1</code>');
  }
  function ico(n, mau, co) {
    return typeof window.ICON === "function" ? window.ICON(n, co || 16, mau) : "";
  }
  /* Bỏ tiền tố "Bài 12. " khỏi tên bài: số bài đã hiện riêng ở cột bên, để cả hai
     thì mỗi dòng đọc thành "Bài 12 — Bài 12. Vòng lặp". */
  function tenGon(l) { return String(l.title || "").replace(/^Bài\s*\d+[.\s]*/, ""); }

  /* ------------------------------------------------------------ DỮ LIỆU */

  function cacChang() {
    var ds = [];
    (window.LESSONS || []).forEach(function (l) { if (ds.indexOf(l.stage) < 0) ds.push(l.stage); });
    return ds.sort(function (a, b) { return a - b; });
  }
  /* LESSON_CHAPTERS và CHANG_NHAN khai bằng `const` ở app.js, mà `const` ở mức
     toàn cục KHÔNG gắn vào window (khác `var`). Đọc qua window.X ra undefined,
     nên phải gọi thẳng tên — tệp này cũng là script cổ điển nên thấy được binding
     đó. Đã mắc đúng lỗi này một lần: thẻ chương ra rỗng và chip hiện "Chặng 20"
     thay vì "Tin học 10". */
  function bangChuong() { return typeof LESSON_CHAPTERS !== "undefined" ? LESSON_CHAPTERS : {}; }
  function bangNhan() { return typeof CHANG_NHAN !== "undefined" ? CHANG_NHAN : {}; }

  function tenChang(st) {
    var n = bangNhan()[st];
    if (n) return n.ten + (n.phu ? " · " + n.phu : "");
    return (window.STAGES && window.STAGES[st]) || ("Chặng " + st);
  }
  function chuongCuaChang(st) { return bangChuong()[st] || []; }
  function baiCuaChuong(st, ci) {
    var c = chuongCuaChang(st)[ci];
    if (!c) return [];
    return (window.LESSONS || [])
      .filter(function (l) { return l.stage === st && l.order >= c.from && l.order <= c.to; })
      .sort(function (a, b) { return a.order - b.order; });
  }

  /* Câu chốt của một bài, theo thứ tự ưu tiên có lí do:
       1. "chot" của khối Sai ở đâu — vốn được viết theo đúng công thức "nhớ mỗi
          câu này là đủ", nên hợp nhất với việc ôn gấp;
       2. "ghi" dưới sơ đồ — câu giải thích chỗ dễ nhầm của bài;
       3. keypoints[0] — chỉ là ý đầu tiên của bài, chung chung nhất, nên để cuối.
     Trả kèm nguồn để màn hình gắn nhãn, khỏi ai tưởng cả ba là một loại. */
  function chotCuaBai(id) {
    try {
      var s = window.SaiODau && window.SaiODau.lay && window.SaiODau.lay(id);
      if (s && s.length && s[0].chot) return { t: s[0].chot, nguon: "chot" };
    } catch (e) { /* thiếu khối nào thì rơi xuống nguồn dưới */ }
    try {
      var d = window.SoDo && window.SoDo.lay && window.SoDo.lay(id);
      if (d && d.ghi) return { t: d.ghi, nguon: "sodo" };
    } catch (e) { /* như trên */ }
    var l = (window.LESSONS || []).find(function (x) { return x.id === id; });
    if (l && l.keypoints && l.keypoints.length) return { t: l.keypoints[0], nguon: "canho" };
    return null;
  }

  /* Mọi dòng có lỗi cài sẵn của một bài. Đây là nguyên liệu của trang Bẫy. */
  function bayCuaBai(id) {
    var ra = [];
    var s = window.SaiODau && window.SaiODau.lay && window.SaiODau.lay(id);
    if (!s) return ra;
    s.forEach(function (m) {
      (m.dong || []).forEach(function (d) {
        if (d.sai) ra.push({ t: d.t, vi: d.vi, ma: m.loai === "ma" });
      });
    });
    return ra;
  }

  /* ------------------------------------------------------------ MÀN HÌNH */

  /* Hash của màn VỪA RỜI. Cần vì màn Tổng kết chương có hai lối vào — từ ô "Tổng
     kết" trên bản đồ chặng, và từ thẻ chương ở màn Ôn nhanh. Nút quay lại đóng
     cứng về màn Ôn nhanh thì người vào từ bản đồ bấm quay lại bị ném sang một
     trang khác hẳn chỗ họ vừa đứng. */
  var hashTruoc = null;
  window.addEventListener("hashchange", function (e) {
    var cu = e && e.oldURL && e.oldURL.indexOf("#") >= 0 ? e.oldURL.slice(e.oldURL.indexOf("#")) : null;
    hashTruoc = cu;
  });

  var app = function () { return document.getElementById("app"); };
  function dat(html) { app().innerHTML = html; }
  function di(hash) { location.hash = hash; }

  function thanhTab(muc, st) {
    var T = [
      ["", "Tổng kết chương", "layers"],
      ["bay", "Bẫy hay gặp", "warn"],
      ["in", "Bản in", "clipboard"],
    ];
    return '<div class="on-tabs on-khong-in">' + T.map(function (t) {
      var h = "#/on-nhanh" + (t[0] ? "/" + t[0] : "") + (st ? "/" + st : "");
      return '<button class="on-tab' + (muc === t[0] ? " chon" : "") + '" data-di="' + h + '">' +
        ico(t[2], null, 15) + " " + t[1] + "</button>";
    }).join("") + "</div>";
  }
  function chipChang(muc, st) {
    return '<div class="on-loc on-khong-in">' + cacChang().map(function (s) {
      var n = bangNhan()[s];
      /* Hai chặng cùng tên "Tin học 11" (Khoa học máy tính và Tin học ứng dụng) —
         thiếu hậu tố ƯD thì hai chip giống hệt nhau, bấm mới biết mình vào đâu. */
      var nhan = n ? n.ten + (n.phu && n.phu.indexOf("ứng dụng") >= 0 ? " ƯD" : "") : "Chặng " + s;
      return '<button class="on-chip' + (s === st ? " chon" : "") + '" data-di="#/on-nhanh' +
        (muc ? "/" + muc : "") + "/" + s + '">' + esc(nhan) + "</button>";
    }).join("") + "</div>";
  }
  function ganDi() {
    app().querySelectorAll("[data-di]").forEach(function (b) {
      b.onclick = function () { di(b.dataset.di); };
    });
  }
  function daHoc(id) {
    try { return typeof isLearned === "function" && isLearned(id); } catch (e) { return false; }
  }

  /* ---- 1. Màn chính: chọn chương ---- */
  function veHub(st) {
    var chuong = chuongCuaChang(st);
    var tongBai = (window.LESSONS || []).filter(function (l) { return l.stage === st; }).length;
    var soBay = 0;
    (window.LESSONS || []).forEach(function (l) { if (l.stage === st) soBay += bayCuaBai(l.id).length; });

    dat(
      '<h2 style="margin:0 0 6px">' + ico("zap", null, 22) + " Ôn nhanh</h2>" +
      '<p style="color:var(--text-soft);font-size:14.5px;margin:0 0 16px">' +
      "Bản rút gọn của cả chương trình: mỗi bài một câu chốt, kèm danh sách những phát biểu " +
      "<b>nghe xuôi tai nhưng sai</b> — đúng thứ 4 câu Đúng/Sai trong đề hay hỏi.</p>" +
      thanhTab("", st) + chipChang("", st) +
      '<p style="color:var(--text-soft);font-size:13px;margin:0 0 12px">' +
      esc(tenChang(st)) + " · <b>" + chuong.length + "</b> chương · <b>" + tongBai +
      "</b> bài · <b>" + soBay + "</b> bẫy đã gom.</p>" +
      '<div class="on-luoi">' + chuong.map(function (c, ci) {
        var ds = baiCuaChuong(st, ci);
        var xong = ds.filter(function (l) { return daHoc(l.id); }).length;
        return '<button class="on-the" style="--cc:' + c.color + '" data-di="#/on-nhanh/chuong/' + st + "/" + ci + '">' +
          "<b>" + esc(c.name) + "</b><small>" + ds.length + " bài · đã học " + xong + "/" + ds.length +
          "</small></button>";
      }).join("") + "</div>"
    );
    ganDi();
  }

  /* ---- 2. Tổng kết một chương ---- */
  function veChuong(st, ci) {
    var c = chuongCuaChang(st)[ci];
    if (!c) { veHub(st); return; }
    var ds = baiCuaChuong(st, ci);
    var NHAN = { chot: "chốt bài", sodo: "dễ nhầm", canho: "cần nhớ" };

    /* Vào từ bản đồ chặng thì quay lại đúng bản đồ đó; vào từ màn Ôn nhanh thì về
       màn Ôn nhanh. Chỉ nhận đúng dạng "#/lessons/<số>" chứ không nhận mọi hash
       cũ: hash lạ (hoặc rỗng khi mở thẳng bằng đường dẫn) thì rơi về mặc định. */
    var veBanDo = /^#\/lessons\/\d+$/.test(hashTruoc || "");
    var quayLai = veBanDo ? hashTruoc : "#/on-nhanh/" + st;
    var tenQuayLai = veBanDo ? "Bản đồ " + tenChang(st).split(" · ")[0] : "Ôn nhanh";

    dat(
      '<button class="back-link" data-di="' + esc(quayLai) + '">' + ico("aleft", null, 15) + " " +
      esc(tenQuayLai) + "</button>" +
      '<h2 style="margin:8px 0 4px">' + esc(c.name) + "</h2>" +
      '<p style="color:var(--text-soft);font-size:13.5px;margin:0 0 18px">' +
      esc(tenChang(st)) + " · " + ds.length + " bài. Mỗi bài một câu chốt — bấm tên bài để mở bài đầy đủ.</p>" +
      '<div class="on-song" style="--cc:' + c.color + '">' +
      ds.map(function (l) {
        var ch = chotCuaBai(l.id);
        var soBay = bayCuaBai(l.id).length;
        return '<div class="on-nut' + (daHoc(l.id) ? " xong" : "") + '"><div class="on-hop">' +
          '<div class="on-hop-d"><b>Bài ' + l.order + ". " + esc(tenGon(l)) + "</b>" +
          (ch ? '<span class="on-nhan">' + NHAN[ch.nguon] + "</span>" : "") +
          '<a href="#/lesson/' + encodeURIComponent(l.id) + '">Mở bài</a></div>' +
          (ch ? '<p class="on-chot">' + fmt(ch.t) + "</p>" : "") +
          (soBay ? '<p class="on-chot" style="color:var(--text-soft);font-size:12px;margin-top:6px">' +
            ico("warn", "var(--danger)", 13) + " " + soBay + " bẫy Đúng/Sai ở bài này</p>" : "") +
          "</div></div>";
      }).join("") + "</div>" +
      '<div class="on-tabs" style="margin-top:20px">' +
      '<button class="on-tab" data-di="#/on-nhanh/bay/' + st + '">' + ico("warn", null, 15) +
      " Xem bẫy của cả chặng</button>" +
      '<button class="on-tab" data-di="#/on-nhanh/in/' + st + '">' + ico("clipboard", null, 15) +
      " Bản in</button></div>"
    );
    ganDi();
  }

  /* ---- 3. Bẫy hay gặp ----
     Lời giải ẩn sẵn, bấm mới mở: hiện sẵn thì mắt đọc luôn câu giải thích và bỏ
     qua bước tự phán đoán — mà tự phán đoán mới là kĩ năng câu Đ/S đòi. */
  function veBay(st) {
    var ds = [];
    (window.LESSONS || []).filter(function (l) { return l.stage === st; })
      .sort(function (a, b) { return a.order - b.order; })
      .forEach(function (l) {
        bayCuaBai(l.id).forEach(function (b) { ds.push({ l: l, b: b }); });
      });

    dat(
      '<h2 style="margin:0 0 6px">' + ico("warn", null, 22) + " Bẫy hay gặp</h2>" +
      '<p style="color:var(--text-soft);font-size:14.5px;margin:0 0 16px">' +
      "Mỗi dòng dưới đây là một phát biểu <b>SAI</b> — nhưng nghe rất xuôi tai. Tự nghĩ xem sai ở đâu " +
      "rồi mới bấm để xem lời giải.</p>" +
      thanhTab("bay", st) + chipChang("bay", st) +
      '<div class="on-loc"><input class="on-tim" id="onTim" type="search" ' +
      'placeholder="Tìm trong ' + ds.length + ' bẫy (ví dụ: while, khoá chính, padding)…"></div>' +
      '<div id="onBayDs"></div>'
    );

    var oDs = document.getElementById("onBayDs");
    function ve(loc) {
      var q = String(loc || "").trim().toLowerCase();
      var hien = q
        ? ds.filter(function (x) {
            return (x.b.t + " " + x.b.vi + " " + x.l.title).toLowerCase().indexOf(q) >= 0;
          })
        : ds;
      if (!hien.length) {
        oDs.innerHTML = '<p class="on-trong">Không có bẫy nào khớp “' + esc(loc) + "”.</p>";
        return;
      }
      oDs.innerHTML = hien.map(function (x, i) {
        return '<div class="on-bay">' +
          '<button class="on-bay-d" data-i="' + i + '" aria-expanded="false">' +
          '<span class="on-sai">SAI</span>' +
          (x.b.ma ? '<code style="font-family:var(--font-mono);font-size:.94em">' + esc(x.b.t).replace(/\n/g, "<br>") + "</code>"
                  : fmt(x.b.t)) + "</button>" +
          '<div class="on-vi" hidden>' + fmt(x.b.vi) +
          '<span class="on-vi-bai">' + ico("book", null, 13) + " Bài " + x.l.order + ". " +
          '<a href="#/lesson/' + encodeURIComponent(x.l.id) + '">' + esc(tenGon(x.l)) + "</a></span></div></div>";
      }).join("");
      oDs.querySelectorAll(".on-bay-d").forEach(function (b) {
        b.onclick = function () {
          var v = b.nextElementSibling;
          v.hidden = !v.hidden;
          b.setAttribute("aria-expanded", v.hidden ? "false" : "true");
        };
      });
    }
    ve("");
    ganDi();
    var tim = document.getElementById("onTim");
    /* Lọc ngay khi gõ: 40–60 dòng mỗi chặng nên không cần chờ, mà chờ thì cảm
       giác ô tìm bị đơ. */
    tim.oninput = function () { ve(tim.value); };
  }

  /* ---- 4. Bản in ---- */
  function veIn(st) {
    datLopIn();
    var chuong = chuongCuaChang(st);
    var tong = 0;

    var than = chuong.map(function (c, ci) {
      var ds = baiCuaChuong(st, ci);
      tong += ds.length;
      return '<section class="on-in-chuong" style="--cc:' + c.color + '">' +
        "<h3>" + esc(c.name) + "</h3><ul class=\"on-in-y\">" +
        ds.map(function (l) {
          var ch = chotCuaBai(l.id);
          return "<li><b>Bài " + l.order + ". " + esc(tenGon(l)) + "</b>" +
            (ch ? " — <i>" + fmt(ch.t).replace(/<\/?b>/g, "") + "</i>" : "") + "</li>";
        }).join("") + "</ul></section>";
    }).join("");

    dat(
      '<div class="on-khong-in">' +
      '<h2 style="margin:0 0 6px">' + ico("clipboard", null, 22) + " Bản in</h2>" +
      thanhTab("in", st) + chipChang("in", st) +
      '<div class="on-in-mo">' + ico("bulb", null, 15) +
      " Bản rút gọn cả chặng để in ra giấy hoặc lưu PDF. Bấm nút dưới rồi chọn <b>Lưu thành PDF</b> " +
      "trong hộp thoại in nếu không có máy in. Thanh trên và chân trang sẽ tự ẩn khi in.</div>" +
      '<button class="btn btn-primary" id="onIn" style="margin-bottom:18px">' + ico("clipboard", "#fff", 16) +
      " In / Lưu PDF</button></div>" +
      '<h1 style="font-size:19px;margin:0 0 4px">Ôn nhanh — ' + esc(tenChang(st)) + "</h1>" +
      '<p style="color:var(--text-soft);font-size:12.5px;margin:0 0 16px">' +
      chuong.length + " chương · " + tong + " bài · mỗi bài một câu chốt</p>" +
      than
    );
    ganDi();
    document.getElementById("onIn").onclick = function () { window.print(); };
  }

  /* ------------------------------------------------------------ ĐIỀU HƯỚNG */

  /* Lớp in-nhanh chỉ đúng ở màn Bản in. Gỡ nó ở MỌI lần dựng khác và cả khi rời
     trang: để sót thì người dùng in một trang khác cũng bị cắt thanh trên. */
  /* Gắn lên cả <html> và <body>: body cho các luật ẩn phần tử, html cho luật nền
     (xem giải thích ở khối @media print). */
  function datLopIn() {
    document.body.classList.add("in-nhanh");
    document.documentElement.classList.add("in-nhanh");
  }
  function goLopIn() {
    document.body.classList.remove("in-nhanh");
    document.documentElement.classList.remove("in-nhanh");
  }
  window.addEventListener("hashchange", function () {
    if (String(location.hash || "").indexOf("#/on-nhanh/in") !== 0) goLopIn();
  });

  /* Quét động ngay trước lúc in: đánh dấu MỌI phần tử đang nổi (position fixed
     hoặc sticky) nằm ngoài vùng nội dung, để luật @media print ẩn chúng đi.
     Vì sao cần dù đã có danh sách tên ở CSS: nút trợ lý AI, thanh mời cài app,
     thanh nhắc học và hộp toast do bốn tệp khác nhau dựng, cái thì có sẵn trong
     index.html cái thì chèn lúc chạy — liệt kê tay chắc chắn sẽ sót về sau.
     beforeprint chạy cả khi người dùng bấm Ctrl+P chứ không riêng nút In của ta. */
  function quetNoi() {
    /* KHÔNG kiểm lớp "in-nhanh" ở đây. Bản đầu có kiểm, nên in bất kỳ trang nào
       ngoài màn Bản in là hàm này thoát ngay và nút trợ lý AI in đè lên chữ. */
    var app = document.getElementById("app");
    document.querySelectorAll("body *").forEach(function (e) {
      if (app && (e === app || app.contains(e))) return;   // nội dung cần in thì bỏ qua
      var p = getComputedStyle(e).position;
      if (p === "fixed" || p === "sticky") e.classList.add("on-an-khi-in");
    });
  }
  function boQuet() {
    document.querySelectorAll(".on-an-khi-in").forEach(function (e) {
      e.classList.remove("on-an-khi-in");
    });
  }
  window.addEventListener("beforeprint", quetNoi);
  window.addEventListener("afterprint", boQuet);

  /* Nạp CSS ngay lúc tệp chạy, KHÔNG chờ ai mở màn Ôn nhanh: nhóm luật ẩn phần vỏ
     phải có sẵn để in trang nào cũng sạch. Trước đây napCss() chỉ chạy trong
     renderOnNhanh, nên ai chưa từng vào Ôn nhanh thì in ra vẫn dính nút AI. */
  napCss();

  function renderOnNhanh(d) {
    napCss();
    goLopIn();
    d = d || {};
    var chang = cacChang();
    var st = Number(d.stage);
    if (chang.indexOf(st) < 0) st = chang[0];
    if (d.muc === "bay") { veBay(st); return; }
    if (d.muc === "in") { veIn(st); return; }
    if (d.muc === "chuong") { veChuong(st, Math.max(0, Number(d.ci) || 0)); return; }
    veHub(st);
  }

  window.renderOnNhanh = renderOnNhanh;
  window.OnNhanh = {
    chotCuaBai: chotCuaBai,
    bayCuaBai: bayCuaBai,
    /* app.js hỏi hàm này để biết có nên vẽ ô "Tổng kết" ở cuối chương không —
       chương nào chưa có bài nào gom được câu chốt thì ô đó rỗng, đừng vẽ. */
    chuongCoChot: function (st, ci) {
      return baiCuaChuong(st, ci).some(function (l) { return !!chotCuaBai(l.id); });
    },
  };
})();
