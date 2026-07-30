/* ============================================================================
 *  NHIỆM VỤ TUẦN
 *
 *  VÌ SAO: app đã có XP, chuỗi ngày và huy hiệu — phần "cảm giác" đủ rồi, nhưng
 *  huy hiệu thì xa mà XP thì vô tận. Thiếu thứ như "tuần này còn 1 đề nữa là
 *  xong" để kéo người học mở app tối thứ Năm.
 *
 *  NHIỆM VỤ THEO CHẶNG: học sinh mới học 3 bài mà giao "làm 1 đề thi thử" thì
 *  vừa vô nghĩa vừa làm nản — đề bao trùm cả 119 bài. Nên kho nhiệm vụ có điều
 *  kiện `co()`: chỉ giao khi học sinh đã đi đủ xa để làm được. Mức yêu cầu cũng
 *  tăng dần theo số bài đã học.
 *
 *  CÁCH TÍNH: không nuôi bộ đếm riêng (dễ lệch với dữ liệu thật). Đầu tuần chụp
 *  lại các con số tổng, tiến độ tuần = số hiện tại trừ mốc đã chụp.
 *
 *  KHÔNG PHẠT KHI BỎ LỠ: khác Duolingo, tiến độ tuần không reset giữa chừng vì
 *  bỏ một ngày. Đối tượng là học sinh 12 có tuần thi giữa kỳ môn khác — phạt
 *  nặng chỉ khiến các em bỏ hẳn.
 * ==========================================================================*/
(function () {
  var XP_MOI_NV = 30;
  var XP_TRON_BO = 100;

  /* Chỉ được TẠO nhiệm vụ mới sau khi dữ liệu thật đã về.
     Nếu chụp mốc lúc State.learned/State.history còn rỗng (trước khi đồng bộ đám
     mây xong) thì người học 2 tháng mở app trên máy mới sẽ thấy cả 3 nhiệm vụ tự
     xanh và được tặng 190 XP khống. app.js gọi moKhoa() đúng lúc dữ liệu sẵn. */
  var daSanSang = false;

  function tuanKey(d) {
    var x = new Date(d || Date.now());
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));  // lùi về thứ Hai
    return x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate();
  }
  function ngayKey(d) {
    var x = new Date(d || Date.now());
    return x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate();
  }
  function ngayConLai() { return 7 - ((new Date().getDay() + 6) % 7); }

  /* Đếm tổng số bài thực hành có trong app, để biết còn bài nào chưa làm không.
     Không đếm được (tệp dữ liệu chưa nạp) thì trả 0 -> nhiệm vụ tự bị loại. */
  /* BỐN kho, có cả GLAB. Trước đây cố ý bỏ GLAB với lí do "phòng đồ hoạ là mô
     phỏng, không có đúng/sai để chấm" — nhưng đó là mô tả sai: mỗi widget đồ hoạ
     đều có đáp án đích và tự chấm, làm đúng là gọi Gam.onExercisePass y như ba kho
     kia. Nên bài đồ hoạ đã làm xong VẪN vào exDone (tử số) mà lại không có trong
     mẫu số — đếm ra tỉ lệ hoàn thành vượt 100%. Đưa GLAB vào là hết lệch.
     Phải sửa ĐỒNG THỜI với soBaiTap ở renderHome trong app.js, không thì trang chủ
     và nhiệm vụ tuần báo hai con số khác nhau. */
  function demBaiTap() {
    var n = 0;
    ["EXERCISES", "SQL_EXERCISES", "WEB_EXERCISES", "GLAB"].forEach(function (ten) {
      var o = window[ten];
      if (!o) return;
      if (Array.isArray(o)) { n += o.length; return; }
      for (var k in o) if (Array.isArray(o[k])) n += o[k].length;
    });
    return n;
  }
  function demTuVung() {
    var o = window.VOCAB_TERMS;
    if (!o) return 0;
    if (Array.isArray(o)) return o.length;
    var n = 0;
    for (var k in o) n += Array.isArray(o[k]) ? o[k].length : 1;
    return n;
  }

  /* Mọi con số nhiệm vụ dựa vào, lấy từ chính nguồn app đang dùng để hiện tiến
     độ — không đếm song song một bản riêng. */
  function soLieu() {
    var s = (typeof gamStats === "function") ? gamStats() : {};
    var G = (typeof GAM !== "undefined") ? GAM : {};
    var lichSu = (typeof State !== "undefined" && State.history) || [];
    return {
      bai: s.lessons || 0,
      dung: G.correct || 0,
      de: s.exams || 0,
      bt: (G.exDone && G.exDone.length) || 0,
      tuvung: (G.vocab && G.vocab.length) || 0,
      diem8: lichSu.filter(function (h) { return (h.score || 0) >= 8; }).length,
      ngay: 0,   // đếm riêng, xem demNgayHoc()
    };
  }
  function boiCanh() {
    var s = (typeof gamStats === "function") ? gamStats() : {};
    var G = (typeof GAM !== "undefined") ? GAM : {};
    return {
      daHoc: s.lessons || 0,
      conBai: (s.totalLessons || 0) - (s.lessons || 0),
      conBT: demBaiTap() - ((G.exDone && G.exDone.length) || 0),
      conTuVung: demTuVung() - ((G.vocab && G.vocab.length) || 0),
    };
  }

  /* ---- KHO NHIỆM VỤ ----
     muc(daHoc): mức yêu cầu, tăng dần theo chặng.
     co(b): có giao nhiệm vụ này không — chặn mọi nhiệm vụ bất khả thi. */
  var KHO = {
    dung: { ic: "check2", ten: function (n) { return "Trả lời đúng " + n + " câu"; },
            muc: function (d) { return d < 5 ? 20 : (d < 20 ? 40 : 60); },
            co: function () { return true; } },
    bai:  { ic: "book", ten: function (n) { return "Học xong " + n + " bài mới"; },
            muc: function (d) { return d < 5 ? 2 : 3; },
            co: function (b) { return b.conBai >= 2; } },
    ngay: { ic: "calendar", ten: function (n) { return "Học đủ " + n + " ngày trong tuần"; },
            muc: function (d) { return d < 5 ? 3 : 4; },
            co: function () { return true; } },
    bt:   { ic: "monitor", ten: function (n) { return "Hoàn thành " + n + " bài thực hành"; },
            muc: function () { return 3; },
            /* Đã giải hết bài thực hành thì exDone không tăng được nữa — giao
               nhiệm vụ này là treo vĩnh viễn. */
            co: function (b) { return b.conBT >= 3; } },
    tuvung: { ic: "letters", ten: function (n) { return "Học " + n + " từ vựng mới"; },
            muc: function () { return 15; },
            co: function (b) { return b.conTuVung >= 15; } },
    diem8: { ic: "star", ten: function (n) { return "Đạt 8+ điểm " + n + " lượt luyện"; },
            muc: function () { return 1; },
            /* Chưa học được mấy bài thì điểm cao là chuyện may rủi, không phải
               kết quả của việc ôn — đợi đã học kha khá rồi hãy giao. */
            co: function (b) { return b.daHoc >= 8; } },
    de:   { ic: "exam", ten: function (n) { return "Làm " + n + " đề thi thử"; },
            muc: function () { return 1; },
            /* Đề thi thử bao trùm cả chương trình. Giao cho người mới học vài
               bài là bắt các em làm bài toàn câu chưa từng thấy -> nản. */
            co: function (b) { return b.daHoc >= 20; } },
  };

  /* Chọn 3 nhiệm vụ: luôn có "dung" làm trụ, 2 cái còn lại xoay vòng theo tuần
     để tuần nào cũng thấy mới. Xoay theo số tuần nên cùng một tuần luôn ra cùng
     kết quả, tải lại trang không bị đổi đề. */
  function chonNhiemVu(b, tuan) {
    var khac = ["bai", "ngay", "bt", "tuvung", "diem8", "de"].filter(function (m) {
      return KHO[m].co(b);
    });
    if (!khac.length) return ["dung"];
    var mam = 0;
    for (var i = 0; i < tuan.length; i++) mam = (mam * 31 + tuan.charCodeAt(i)) >>> 0;
    var chon = [];
    for (var k = 0; k < 2 && k < khac.length; k++) {
      chon.push(khac[(mam + k * 3) % khac.length]);
      if (chon.length === 2 && chon[0] === chon[1]) chon.pop();   // tránh trùng
    }
    return ["dung"].concat(chon);
  }

  /* nv có thể tới từ localStorage cũ hoặc JSONB máy chủ — không tin hình dạng.
     Một object thiếu trường làm ném TypeError giữa lúc vẽ và trắng cả trang chủ. */
  function hopLe(nv) {
    return !!(nv && typeof nv === "object" && typeof nv.tuan === "string" &&
      Array.isArray(nv.ma) && nv.ma.length && nv.ma.every(function (m) { return KHO[m]; }) &&
      nv.moc && typeof nv.moc === "object" && Array.isArray(nv.xong) && Array.isArray(nv.ngay));
  }

  /* choPhepTao=false -> chỉ đọc, KHÔNG ghi localStorage. Vẽ trang phải dùng
     nhánh này: trước đây việc vẽ lại ghi đè cả blob GAM vừa tải từ máy chủ. */
  function layNv(choPhepTao) {
    if (typeof GAM === "undefined") return null;
    var tuan = tuanKey();
    if (hopLe(GAM.nv) && GAM.nv.tuan === tuan) return GAM.nv;
    if (!choPhepTao || !daSanSang) return null;
    var b = boiCanh();
    GAM.nv = { tuan: tuan, moc: soLieu(), ma: chonNhiemVu(b, tuan), xong: [], ngay: [], thuongTronBo: false };
    return GAM.nv;
  }

  function demNgayHoc(nv) { return (nv.ngay || []).length; }

  function tienDo(nv) {
    nv = nv || layNv(false);
    if (!nv) return [];
    var nay = soLieu();
    var daHoc = boiCanh().daHoc;
    return nv.ma.map(function (ma) {
      var d = KHO[ma], muc = d.muc(daHoc);
      var dat;
      if (ma === "ngay") dat = demNgayHoc(nv);
      else {
        /* Vài bộ đếm CÓ THỂ ĐI LÙI: State.history bị cắt còn 50 lượt nên số đề
           thi thử giảm dần khi luyện nhiều, và người dùng xoá được lịch sử. Mốc
           chụp cao hơn số hiện tại sẽ khoá cứng nhiệm vụ cả tuần — hạ mốc xuống
           thay vì để nhiệm vụ bất khả thi. */
        if ((nay[ma] || 0) < (nv.moc[ma] || 0)) nv.moc[ma] = nay[ma] || 0;
        dat = (nay[ma] || 0) - (nv.moc[ma] || 0);
      }
      dat = Math.max(0, dat);
      return { ma: ma, ic: d.ic, ten: d.ten(muc), muc: muc,
               dat: Math.min(dat, muc), xong: dat >= muc };
    });
  }

  /* Chốt chống gọi lồng: gamAward sẽ vẽ lại bảng điều khiển, mà chỗ vẽ lại
     chính là nơi gọi hàm này. */
  var dangChay = false;
  function kiemTra() {
    if (dangChay || !daSanSang || typeof GAM === "undefined") return;
    dangChay = true;
    try {
      var nv = layNv(true);
      if (!nv) return;
      var doi = false;

      var homNay = ngayKey();
      if (nv.ngay.indexOf(homNay) === -1) { nv.ngay.push(homNay); doi = true; }

      var ds = tienDo(nv), moi = [];
      ds.forEach(function (t) {
        if (t.xong && nv.xong.indexOf(t.ma) === -1) { nv.xong.push(t.ma); moi.push(t); doi = true; }
      });
      var tronBo = ds.length > 0 && ds.every(function (t) { return t.xong; });
      if (tronBo && !nv.thuongTronBo) { nv.thuongTronBo = true; doi = true; }

      if (doi && typeof gamSave === "function") gamSave();
      /* Trao XP SAU khi đã lưu dấu, để mất điện giữa chừng không thành trao hai lần. */
      if (moi.length && typeof gamAward === "function") {
        moi.forEach(function () { gamAward(XP_MOI_NV, true); });
      }
      if (tronBo && moi.length && typeof gamAward === "function") {
        gamAward(XP_TRON_BO, true);
        if (typeof gamEnqueueCele === "function") {
          /* Tên trường phải khớp ĐÚNG với gamShowNextCele đọc (icon/body, không
             phải ic/desc) — sai tên thì hộp chúc mừng hiện chữ "undefined" thay
             vì icon và mô tả, lỗi im lặng vì không ai gặp cả ba nhiệm vụ mỗi
             tuần để thấy. */
          gamEnqueueCele({
            icon: (typeof ICON === "function" ? ICON("trophy", 56, "#eab308") : "🏆"),
            title: "Xong nhiệm vụ tuần!",
            body: "Cả ba nhiệm vụ tuần này đều hoàn thành. +" + XP_TRON_BO + " XP.",
          });
        }
      }
    } finally { dangChay = false; }
  }

  function html() {
    var nv = layNv(false);
    if (!nv) return "";           // chưa có dữ liệu thật -> đừng đoán, đừng vẽ
    var ds = tienDo(nv);
    if (!ds.length) return "";
    var xongHet = ds.every(function (t) { return t.xong; });
    var hang = ds.map(function (t) {
      var pct = Math.round((t.dat / t.muc) * 100);
      /* t.ic là TÊN icon trong icons.js, không phải emoji nữa. */
      var ico = typeof ICON === "function" ? ICON(t.ic, 19) : "";
      var so = t.xong && typeof ICON === "function" ? ICON("check2", 17) : (t.xong ? "✓" : t.dat + "/" + t.muc);
      /* Ba nhiệm vụ nằm NGANG nhau, mỗi cái một cột nhỏ: icon và số cùng hàng
         trên, tên bài dưới, vạch tiến độ dưới cùng. Xếp dọc ba dòng như trước
         chiếm gần 200px ở trang chủ mà nội dung mỗi dòng chỉ có một câu ngắn. */
      /* Bốn phần để PHẲNG, không bọc thêm tầng: nhờ vậy grid-template-areas xếp
         được hai bố cục khác nhau trên cùng một DOM — ngang 3 ô khi rộng, quay về
         một hàng gọn khi hẹp. Bọc icon với số vào một thẻ con là hết đảo được. */
      return '<div class="nv-item' + (t.xong ? " nv-done" : "") + '">' +
        '<span class="nv-ic">' + ico + "</span>" +
        '<b class="nv-ten">' + t.ten + "</b>" +
        '<span class="nv-so">' + so + "</span>" +
        '<div class="nv-bar"><div class="nv-fill" style="width:' + pct + '%"></div></div>' +
      "</div>";
    }).join("");
    return '<div class="nv-card' + (xongHet ? " nv-card-done" : "") + '">' +
      '<div class="nv-head"><b>Nhiệm vụ tuần này</b><small>' +
        (xongHet ? "Đã xong cả ba 🎉" : "còn " + ngayConLai() + " ngày") + "</small></div>" +
      '<div class="nv-hang">' + hang + "</div></div>";
  }

  function napCss() {
    if (document.getElementById("nvCss")) return;
    var st = document.createElement("style");
    st.id = "nvCss";
    st.textContent =
      ".nv-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:14px 16px;margin:0 0 18px}" +
      ".nv-card-done{border-color:var(--success,#16a34a)}" +
      ".nv-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:10px}" +
      ".nv-head b{font-family:var(--font-display);font-size:15.5px}" +
      ".nv-head small{color:var(--text-soft);font-size:12.5px;white-space:nowrap}" +
      /* auto-fit + minmax: ba nhiệm vụ nằm ngang khi đủ chỗ, tự rớt xuống 2 rồi 1
         cột trên máy hẹp — khỏi cần media query. */
      ".nv-hang{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}" +
      /* Rộng: mỗi nhiệm vụ là một ô nhỏ — icon và số cùng hàng trên, tên ở giữa,
         vạch tiến độ dưới cùng. */
      ".nv-item{display:grid;gap:5px 8px;align-items:center;padding:9px 11px;border:1px solid var(--border);" +
        "border-radius:12px;background:var(--bg-soft,transparent);" +
        "grid-template-columns:auto 1fr;grid-template-areas:'ic so' 'ten ten' 'bar bar'}" +
      ".nv-ic{grid-area:ic}.nv-ten{grid-area:ten}.nv-so{grid-area:so}.nv-bar{grid-area:bar}" +
      /* Icon nét thay emoji: cho nó cái nền tròn nhạt để vẫn nặng bằng emoji cũ,
         không thì hàng nhiệm vụ trông nhẹ bẫng lệch hẳn so với phần còn lại. */
      ".nv-ic{flex:none;width:30px;height:30px;border-radius:10px;display:grid;place-items:center;" +
        "background:var(--primary-soft);color:var(--primary)}" +
      ".nv-done .nv-ic{background:color-mix(in srgb, var(--success,#16a34a) 14%, transparent);color:var(--success,#16a34a)}" +
      ".nv-ten{display:block;font-size:12.5px;font-weight:700;line-height:1.3}" +
      ".nv-bar{height:7px;border-radius:99px;background:var(--border);overflow:hidden}" +
      ".nv-fill{height:100%;border-radius:99px;background:var(--primary);transition:width .4s ease}" +
      ".nv-done .nv-fill{background:var(--success,#16a34a)}" +
      ".nv-done .nv-ten{color:var(--text-soft);text-decoration:line-through}" +
      ".nv-so{font-size:12.5px;font-weight:800;color:var(--text-soft);text-align:right}" +
      ".nv-so .ic{vertical-align:-3px}" +
      ".nv-done .nv-so{color:var(--success,#16a34a)}" +
      /* Hẹp: 3 ô không xếp ngang nổi (mỗi ô còn ~90px), nên quay về đúng dáng cũ —
         icon bên trái, tên và vạch ở giữa, số bên phải. Giữ kiểu ô dọc ở đây thì
         mỗi nhiệm vụ cao 72px thay vì 48px, tức mobile còn tệ hơn trước khi sửa. */
      "@media (max-width:560px){" +
        ".nv-item{grid-template-columns:auto 1fr auto;grid-template-areas:'ic ten so' 'ic bar so';" +
          "gap:2px 10px;border:0;padding:6px 0;background:none}" +
        /* 1 cột: ở dáng hàng gọn, 2 cột chỉ còn 155px mỗi cột nên tên nhiệm vụ
           phải xuống 2 dòng. Một cột thì tên vừa đúng một dòng. */
        ".nv-hang{gap:0;grid-template-columns:1fr}" +
      "}" +
      "@media (max-width:420px){.nv-head b{font-size:14.5px}}";
    (document.head || document.documentElement).appendChild(st);
  }
  napCss();

  window.NhiemVu = {
    tienDo: function () { return tienDo(null); },
    kiemTra: kiemTra,
    html: html,
    tuanKey: tuanKey,
    /* app.js gọi khi State đã mang dữ liệu thật (khách: ngay; đã đăng nhập: sau
       fullSync). Trước đó không tạo nhiệm vụ để khỏi chụp mốc trên dữ liệu rỗng. */
    moKhoa: function () { daSanSang = true; },
  };
})();
