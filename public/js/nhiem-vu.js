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
  function demBaiTap() {
    var n = 0;
    ["EXERCISES", "SQL_EXERCISES", "WEB_EXERCISES"].forEach(function (ten) {
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
    dung: { ic: "✅", ten: function (n) { return "Trả lời đúng " + n + " câu"; },
            muc: function (d) { return d < 5 ? 20 : (d < 20 ? 40 : 60); },
            co: function () { return true; } },
    bai:  { ic: "📘", ten: function (n) { return "Học xong " + n + " bài mới"; },
            muc: function (d) { return d < 5 ? 2 : 3; },
            co: function (b) { return b.conBai >= 2; } },
    ngay: { ic: "📅", ten: function (n) { return "Học đủ " + n + " ngày trong tuần"; },
            muc: function (d) { return d < 5 ? 3 : 4; },
            co: function () { return true; } },
    bt:   { ic: "💻", ten: function (n) { return "Hoàn thành " + n + " bài thực hành"; },
            muc: function () { return 3; },
            /* Đã giải hết bài thực hành thì exDone không tăng được nữa — giao
               nhiệm vụ này là treo vĩnh viễn. */
            co: function (b) { return b.conBT >= 3; } },
    tuvung: { ic: "🔤", ten: function (n) { return "Học " + n + " từ vựng mới"; },
            muc: function () { return 15; },
            co: function (b) { return b.conTuVung >= 15; } },
    diem8: { ic: "⭐", ten: function (n) { return "Đạt 8+ điểm " + n + " lượt luyện"; },
            muc: function () { return 1; },
            /* Chưa học được mấy bài thì điểm cao là chuyện may rủi, không phải
               kết quả của việc ôn — đợi đã học kha khá rồi hãy giao. */
            co: function (b) { return b.daHoc >= 8; } },
    de:   { ic: "📝", ten: function (n) { return "Làm " + n + " đề thi thử"; },
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
          gamEnqueueCele({ ic: "🏆", title: "Xong nhiệm vụ tuần!",
                           desc: "Cả ba nhiệm vụ tuần này đều hoàn thành. +" + XP_TRON_BO + " XP." });
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
      return '<div class="nv-item' + (t.xong ? " nv-done" : "") + '">' +
        '<span class="nv-ic">' + t.ic + "</span>" +
        '<div class="nv-mid"><b>' + t.ten + "</b>" +
          '<div class="nv-bar"><div class="nv-fill" style="width:' + pct + '%"></div></div></div>' +
        '<span class="nv-so">' + (t.xong ? "✓" : t.dat + "/" + t.muc) + "</span>" +
      "</div>";
    }).join("");
    return '<div class="nv-card' + (xongHet ? " nv-card-done" : "") + '">' +
      '<div class="nv-head"><b>Nhiệm vụ tuần này</b><small>' +
        (xongHet ? "Đã xong cả ba 🎉" : "còn " + ngayConLai() + " ngày") + "</small></div>" +
      hang + "</div>";
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
      ".nv-item{display:flex;align-items:center;gap:11px;padding:7px 0}" +
      /* Emoji rộng hơn cỡ chữ danh nghĩa — để 26px là bị cắt mép trên iOS. */
      ".nv-ic{font-size:21px;line-height:1;flex:none;width:30px;text-align:center}" +
      ".nv-mid{flex:1;min-width:0}" +
      ".nv-mid b{display:block;font-size:13.5px;font-weight:700;margin-bottom:5px}" +
      ".nv-bar{height:7px;border-radius:99px;background:var(--border);overflow:hidden}" +
      ".nv-fill{height:100%;border-radius:99px;background:var(--primary);transition:width .4s ease}" +
      ".nv-done .nv-fill{background:var(--success,#16a34a)}" +
      ".nv-done .nv-mid b{color:var(--text-soft);text-decoration:line-through}" +
      ".nv-so{flex:none;font-size:13px;font-weight:800;color:var(--text-soft);min-width:38px;text-align:right}" +
      ".nv-done .nv-so{color:var(--success,#16a34a)}" +
      "@media (max-width:420px){.nv-head b{font-size:14.5px}.nv-mid b{font-size:12.5px}}";
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
