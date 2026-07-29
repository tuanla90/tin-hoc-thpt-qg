/* ============================================================================
 *  NHIỆM VỤ TUẦN
 *
 *  VÌ SAO: app đã có XP, chuỗi ngày và huy hiệu — tức là phần "cảm giác" đủ rồi,
 *  nhưng thiếu MỤC TIÊU NGẮN HẠN CÓ THỜI HẠN. Huy hiệu thì xa, XP thì vô tận;
 *  còn "tuần này còn 1 đề nữa là xong" mới là thứ kéo người ta mở app tối thứ Năm.
 *
 *  CÁCH TÍNH: không lưu bộ đếm riêng (dễ lệch với dữ liệu thật). Đầu tuần chụp
 *  lại các con số tổng đang có, tiến độ tuần = số hiện tại trừ mốc đã chụp. Nhờ
 *  vậy nhiệm vụ luôn khớp với tiến độ thật, kể cả khi đồng bộ từ máy khác về.
 *
 *  KHÔNG PHẠT KHI BỎ LỠ: khác Duolingo, tiến độ tuần không reset giữa chừng vì
 *  bỏ một ngày. Đối tượng ở đây là học sinh 12 có tuần thi giữa kỳ môn khác —
 *  phạt nặng chỉ khiến các em bỏ hẳn thay vì quay lại.
 *
 *  Dữ liệu nằm trong GAM.nv nên đi chung đường đồng bộ sẵn có (bảng gamify).
 * ==========================================================================*/
(function () {
  var XP_MOI_NV = 30;     // thưởng khi xong một nhiệm vụ
  var XP_TRON_BO = 100;   // thưởng thêm khi xong cả ba

  /* Khoá tuần = ngày thứ Hai của tuần đó, theo giờ máy người học.
     Dùng ngày thay vì "số tuần ISO" cho đỡ sai ở tuần giao năm. */
  function tuanKey(d) {
    var x = new Date(d || Date.now());
    x = new Date(x.getFullYear(), x.getMonth(), x.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));  // lùi về thứ Hai
    return x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate();
  }

  function ngayConLai() {
    var x = new Date();
    return 7 - ((x.getDay() + 6) % 7);   // thứ Hai -> 7, Chủ nhật -> 1
  }

  /* Các con số tổng mà nhiệm vụ dựa vào. Lấy từ chính nguồn app đang dùng để
     hiện tiến độ, không đếm song song một bản riêng. */
  function mocHienTai() {
    var s = (typeof gamStats === "function") ? gamStats() : {};
    return {
      bai: s.lessons || 0,
      dung: (typeof GAM !== "undefined" && GAM.correct) || 0,
      de: s.exams || 0,
      bt: (typeof GAM !== "undefined" && GAM.exDone && GAM.exDone.length) || 0,
    };
  }

  var DANH_SACH = {
    bai:  { ic: "📘", muc: 3,  ten: function (n) { return "Học xong " + n + " bài mới"; } },
    dung: { ic: "✅", muc: 40, ten: function (n) { return "Trả lời đúng " + n + " câu"; } },
    de:   { ic: "📝", muc: 1,  ten: function (n) { return "Làm " + n + " đề thi thử"; } },
    bt:   { ic: "💻", muc: 3,  ten: function (n) { return "Hoàn thành " + n + " bài thực hành"; } },
  };

  /* Chọn 3 nhiệm vụ cho tuần. Người đã học hết 119 bài mà vẫn giao "học 3 bài
     mới" thì nhiệm vụ đó treo vĩnh viễn — đổi sang bài thực hành. */
  function chonNhiemVu() {
    var s = (typeof gamStats === "function") ? gamStats() : {};
    var conLai = (s.totalLessons || 0) - (s.lessons || 0);
    return [conLai >= DANH_SACH.bai.muc ? "bai" : "bt", "dung", "de"];
  }

  /* Đảm bảo GAM.nv ứng với tuần hiện tại; sang tuần mới thì chụp mốc lại. */
  function baoDam() {
    if (typeof GAM === "undefined") return null;
    var tuan = tuanKey();
    if (!GAM.nv || GAM.nv.tuan !== tuan) {
      GAM.nv = { tuan: tuan, moc: mocHienTai(), ma: chonNhiemVu(), xong: [], thuongTronBo: false };
      if (typeof gamSave === "function") gamSave();
    }
    return GAM.nv;
  }

  function tienDo() {
    var nv = baoDam();
    if (!nv) return [];
    var nay = mocHienTai();
    return nv.ma.map(function (ma) {
      var d = DANH_SACH[ma];
      /* Kẹp ở 0: bỏ đánh dấu "đã học" một bài sẽ làm hiệu số âm. */
      var dat = Math.max(0, (nay[ma] || 0) - (nv.moc[ma] || 0));
      return { ma: ma, ic: d.ic, ten: d.ten(d.muc), muc: d.muc,
               dat: Math.min(dat, d.muc), xong: dat >= d.muc };
    });
  }

  /* Trao thưởng cho nhiệm vụ vừa xong. Có chốt chống gọi lồng nhau vì gamAward
     sẽ vẽ lại bảng điều khiển, mà chỗ vẽ lại chính là nơi gọi hàm này. */
  var dangChay = false;
  function kiemTra() {
    if (dangChay || typeof GAM === "undefined") return;
    var nv = baoDam();
    if (!nv) return;
    dangChay = true;
    try {
      var ds = tienDo(), moi = [];
      ds.forEach(function (t) {
        if (t.xong && nv.xong.indexOf(t.ma) === -1) { nv.xong.push(t.ma); moi.push(t); }
      });
      var tronBo = ds.length > 0 && ds.every(function (t) { return t.xong; });
      if (moi.length && typeof gamAward === "function") {
        moi.forEach(function (t) { gamAward(XP_MOI_NV, true); });
      }
      if (tronBo && !nv.thuongTronBo) {
        nv.thuongTronBo = true;
        if (typeof gamAward === "function") gamAward(XP_TRON_BO, true);
        if (typeof gamEnqueueCele === "function") {
          gamEnqueueCele({ ic: "🏆", title: "Xong nhiệm vụ tuần!",
                           desc: "Cả ba nhiệm vụ tuần này đều hoàn thành. +" + XP_TRON_BO + " XP." });
        }
      }
      if (moi.length || tronBo) { if (typeof gamSave === "function") gamSave(); }
    } finally { dangChay = false; }
  }

  function html() {
    var ds = tienDo();
    if (!ds.length) return "";
    var xongHet = ds.every(function (t) { return t.xong; });
    var con = ngayConLai();
    var hang = ds.map(function (t) {
      var pct = Math.round((t.dat / t.muc) * 100);
      return '<div class="nv-item' + (t.xong ? " nv-done" : "") + '">' +
        '<span class="nv-ic">' + t.ic + "</span>" +
        '<div class="nv-mid">' +
          "<b>" + t.ten + "</b>" +
          '<div class="nv-bar"><div class="nv-fill" style="width:' + pct + '%"></div></div>' +
        "</div>" +
        '<span class="nv-so">' + (t.xong ? "✓" : t.dat + "/" + t.muc) + "</span>" +
      "</div>";
    }).join("");
    return '<div class="nv-card' + (xongHet ? " nv-card-done" : "") + '">' +
      '<div class="nv-head"><b>Nhiệm vụ tuần này</b>' +
        '<small>' + (xongHet ? "Đã xong cả ba 🎉" : "còn " + con + " ngày") + "</small></div>" +
      hang +
    "</div>";
  }

  /* CSS để chung với module cho dễ gỡ bỏ — cùng cách gamify.js đang làm. */
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

  window.NhiemVu = { tienDo: tienDo, kiemTra: kiemTra, html: html, tuanKey: tuanKey };
})();
