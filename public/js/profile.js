/* ============================================================================
 *  HỒ SƠ HỌC TẬP — màn tạo mới và màn chỉnh sửa dùng CHUNG một form.
 *  Nạp TRƯỚC app.js.
 *    window.getProfile()        -> hồ sơ đang dùng (đã điền mặc định)
 *    window.renderProfile()     -> trang sửa hồ sơ (đăng ký trong router app.js)
 *    window.renderProfileNew()  -> trang tạo hồ sơ mới (account.js gọi)
 *    window.profileGreeting()   -> lời chào ở trang chủ
 *    window.profileAvatar(p)    -> ảnh/emoji đại diện theo nhân vật đã chọn
 *
 *  Ghi chú thiết kế: trường `gender` không hỏi kiểu khai lí lịch mà cho người
 *  học CHỌN NHÂN VẬT ĐỒNG HÀNH — vì trong app nó chỉ quyết định bộ ảnh linh vật
 *  (xem mascotSrc trong app.js). Chọn bằng ảnh thật nên thấy ngay mình sẽ đi
 *  cùng ai suốt quá trình học.
 * ==========================================================================*/
(function () {
  var css =
    /* khung chung */
    ".pf-wrap{max-width:680px;margin:0 auto}" +
    ".pf-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:22px 20px;box-shadow:var(--shadow)}" +
    ".pf-note{color:var(--text-soft);font-size:13.5px;margin:2px 0 18px;line-height:1.55}" +
    /* dải đầu trang có ảnh nhân vật */
    ".pf-hero{display:flex;align-items:center;gap:18px;padding:20px 22px;margin-bottom:18px;border-radius:var(--radius);" +
      "background:linear-gradient(135deg,var(--primary),var(--primary-d));color:#fff;box-shadow:0 8px 22px rgba(79,70,229,.28)}" +
    ".pf-hero-ava{width:86px;height:86px;flex:none;border-radius:50%;background:rgba(255,255,255,.18);" +
      "border:2px solid rgba(255,255,255,.45);display:flex;align-items:center;justify-content:center;font-size:44px;overflow:hidden}" +
    ".pf-hero-ava img{width:100%;height:100%;object-fit:contain}" +
    ".pf-hero-txt{min-width:0}" +
    ".pf-hero-txt small{font-size:12.5px;opacity:.9;font-weight:700;letter-spacing:.04em;text-transform:uppercase}" +
    ".pf-hero-txt b{display:block;font-family:var(--font-display);font-size:24px;line-height:1.25;margin:2px 0 6px;word-break:break-word}" +
    ".pf-hero-tags{display:flex;gap:6px;flex-wrap:wrap}" +
    ".pf-hero-tags span{font-size:12px;font-weight:700;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:3px 10px}" +
    /* từng mục */
    ".pf-field{margin-bottom:22px}" +
    ".pf-field>label{display:flex;align-items:center;gap:7px;font-weight:800;font-size:14.5px;margin-bottom:4px;color:var(--text)}" +
    ".pf-field .pf-hint{color:var(--text-soft);font-size:12.5px;margin:0 0 9px;line-height:1.5}" +
    ".pf-input{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid var(--border);border-radius:10px;" +
      "background:var(--bg-soft);color:var(--text);font-size:15.5px;font-family:inherit}" +
    ".pf-input:focus{outline:none;border-color:var(--primary);background:var(--bg-card)}" +
    /* chọn nhân vật bằng ảnh */
    ".pf-chars{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}" +
    ".pf-char{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px 10px;cursor:pointer;font-family:inherit;" +
      "background:var(--bg-card);border:1.5px solid var(--border);border-radius:14px;transition:all .13s}" +
    ".pf-char:hover{border-color:var(--primary);transform:translateY(-2px)}" +
    ".pf-char.on{border-color:var(--primary);background:var(--primary-soft);box-shadow:0 0 0 3px var(--primary-soft)}" +
    ".pf-char img{width:74px;height:74px;object-fit:contain}" +
    ".pf-char .pf-char-emoji{font-size:52px;line-height:74px;height:74px}" +
    ".pf-char b{font-size:13.5px;color:var(--text);font-weight:750}" +
    /* thẻ lựa chọn có mô tả */
    ".pf-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}" +
    ".pf-opt{text-align:left;padding:13px 15px;cursor:pointer;font-family:inherit;background:var(--bg-card);" +
      "border:1.5px solid var(--border);border-radius:12px;transition:all .13s}" +
    ".pf-opt:hover{border-color:var(--primary)}" +
    ".pf-opt.on{border-color:var(--primary);background:var(--primary-soft)}" +
    ".pf-opt b{display:block;font-size:14.5px;color:var(--text);margin-bottom:2px}" +
    ".pf-opt small{color:var(--text-soft);font-size:12.5px;line-height:1.45;display:block}" +
    /* lớp: 3 ô vuông to */
    ".pf-grades{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}" +
    ".pf-grade{padding:14px 8px;text-align:center;cursor:pointer;font-family:inherit;background:var(--bg-card);" +
      "border:1.5px solid var(--border);border-radius:12px;transition:all .13s}" +
    ".pf-grade:hover{border-color:var(--primary);transform:translateY(-2px)}" +
    ".pf-grade b{display:block;font-family:var(--font-display);font-size:24px;line-height:1.1;color:var(--primary-d)}" +
    ".pf-grade small{font-size:12px;color:var(--text-soft)}" +
    ".pf-grade.on{border-color:var(--primary);background:var(--primary-soft)}" +
    /* lịch học: 7 vòng tròn */
    ".pf-week{display:flex;gap:8px;flex-wrap:wrap}" +
    ".pf-day{width:46px;height:46px;border-radius:50%;cursor:pointer;font-family:inherit;font-weight:750;font-size:13.5px;" +
      "background:var(--bg-soft);border:1.5px solid var(--border);color:var(--text-soft);transition:all .13s}" +
    ".pf-day:hover{border-color:var(--primary);color:var(--text)}" +
    ".pf-day.on{background:var(--primary);border-color:var(--primary);color:#fff}" +
    ".pf-week-sum{margin-top:8px;font-size:12.5px;color:var(--text-soft)}" +
    /* nút lưu */
    ".pf-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}" +
    /* lời chào trang chủ */
    ".pf-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}" +
    ".pf-tag{font-size:12px;font-weight:650;padding:3px 9px;border-radius:999px;background:var(--bg-soft);border:1px solid var(--border);color:var(--text-soft)}" +
    ".pf-avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;" +
      "background:var(--primary-soft);border:1px solid var(--primary);flex:0 0 auto;overflow:hidden}" +
    ".pf-avatar img{width:100%;height:100%;object-fit:contain}" +
    ".pf-hello{font-size:13px;color:var(--text-soft);font-weight:600}" +
    ".pf-hello b{color:var(--text);font-size:17px;display:block;margin-top:1px}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---- Lựa chọn ---- */
  var CHARS = [
    { val: "nu", ten: "Bạn nữ", anh: "asset/mascot/poses/happy.png", emoji: "👧" },
    { val: "nam", ten: "Bạn nam", anh: "asset/mascot/nam/poses/happy.png", emoji: "👦" },
    { val: "khac", ten: "Để sau", anh: "", emoji: "🧑‍🎓" },
  ];
  var GRADES = [["10", "Lớp 10", "Nền tảng"], ["11", "Lớp 11", "Kĩ thuật"], ["12", "Lớp 12", "Ôn thi"]];
  var TRACKS = [
    ["khmt", "Khoa học máy tính", "Lập trình Python, thuật toán, cơ sở dữ liệu"],
    ["udung", "Tin học ứng dụng", "Thực hành phần mềm, chỉnh ảnh, dựng web"],
  ];
  var MODES = [
    ["tudo", "Mở tự do", "Học bài nào tuỳ ý, thích hợp khi ôn lại"],
    ["tuantu", "Khoá tuần tự", "Xong bài trước mới mở bài sau, đỡ bỏ sót"],
  ];
  var DAYS = [[1, "T2"], [2, "T3"], [3, "T4"], [4, "T5"], [5, "T6"], [6, "T7"], [0, "CN"]];
  var DEFAULT = { name: "", gender: "", grade: "", track: "", mode: "", days: [] };

  function labelOf(list, val) { for (var i = 0; i < list.length; i++) if (list[i][0] === val) return list[i][1]; return ""; }
  function charOf(val) { for (var i = 0; i < CHARS.length; i++) if (CHARS[i].val === val) return CHARS[i]; return CHARS[2]; }
  function profileAvatar(p) {
    var c = charOf((p && p.gender) || "");
    return c.anh ? '<img src="' + c.anh + '" alt="">' : c.emoji;
  }

  function getProfile() {
    var raw = (typeof load === "function") ? load("profile", {}) : {};
    var p = {};
    for (var k in DEFAULT) p[k] = (raw && raw[k] != null ? raw[k] : DEFAULT[k]);
    if (!Array.isArray(p.days)) p.days = [];
    return p;
  }
  function setProfile(p) {
    if (typeof save === "function") save("profile", p);
    if (typeof State !== "undefined") State.profile = p;
  }

  function profileGreeting() {
    var p = getProfile();
    if (!p.name) return "";
    var tags = [];
    if (p.grade) tags.push('<span class="pf-tag">' + esc(labelOf(GRADES, p.grade)) + "</span>");
    if (p.track) tags.push('<span class="pf-tag">' + esc(labelOf(TRACKS, p.track)) + "</span>");
    return '<div style="display:flex;align-items:center;gap:12px;margin:0 0 14px">' +
      '<div class="pf-avatar" style="width:44px;height:44px;font-size:24px">' + profileAvatar(p) + "</div>" +
      '<div><div class="pf-hello">Xin chào 👋<b>' + esc(p.name) + "</b></div>" +
      (tags.length ? '<div class="pf-meta">' + tags.join("") + "</div>" : "") +
      "</div></div>";
  }

  /* =========================================================================
   *  FORM DÙNG CHUNG cho tạo mới và chỉnh sửa
   * ========================================================================= */
  function ico(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; }

  function formHtml(p, taoMoi) {
    var char = function (c) {
      return '<button type="button" class="pf-char' + (c.val === p.gender ? " on" : "") + '" data-char="' + c.val + '">' +
        (c.anh ? '<img src="' + c.anh + '" alt="">' : '<span class="pf-char-emoji">' + c.emoji + "</span>") +
        "<b>" + esc(c.ten) + "</b></button>";
    };
    var opt = function (list, group, cur) {
      return list.map(function (o) {
        return '<button type="button" class="pf-opt' + (o[0] === cur ? " on" : "") + '" data-group="' + group + '" data-val="' + o[0] + '">' +
          "<b>" + esc(o[1]) + "</b><small>" + esc(o[2]) + "</small></button>";
      }).join("");
    };
    var ngay = (p.days || []).map(String);

    return '<div class="pf-hero">' +
        '<div class="pf-hero-ava" id="pfAva">' + profileAvatar(p) + "</div>" +
        '<div class="pf-hero-txt"><small>' + (taoMoi ? "Hồ sơ mới" : "Hồ sơ đang học") + "</small>" +
          '<b id="pfNamePreview">' + (p.name ? esc(p.name) : "Chưa đặt tên") + "</b>" +
          '<div class="pf-hero-tags" id="pfTags"></div></div></div>' +

      '<div class="pf-card">' +
        '<div class="pf-field"><label>' + ico("user", "#4f46e5") + "Tên người học</label>" +
          '<p class="pf-hint">Hiện ở lời chào và trên thẻ chọn hồ sơ.</p>' +
          '<input class="pf-input" id="pfName" type="text" maxlength="40" placeholder="Ví dụ: Nguyễn Văn An" value="' + esc(p.name) + '"></div>' +

        '<div class="pf-field"><label>' + ico("star", "#f59e0b") + "Nhân vật đồng hành</label>" +
          '<p class="pf-hint">Linh vật sẽ cổ vũ bạn suốt quá trình học — chọn bạn thấy hợp nhất.</p>' +
          '<div class="pf-chars" id="pfChars">' + CHARS.map(char).join("") + "</div></div>" +

        '<div class="pf-field"><label>' + ico("cap", "#0891b2") + "Lớp đang học</label>" +
          '<p class="pf-hint">Dùng để gợi ý bài phù hợp và mở sẵn bài của lớp dưới.</p>' +
          '<div class="pf-grades" id="pfGrades">' + GRADES.map(function (g) {
            return '<button type="button" class="pf-grade' + (g[0] === p.grade ? " on" : "") + '" data-group="grade" data-val="' + g[0] + '">' +
              "<b>" + g[1].replace("Lớp ", "") + "</b><small>" + esc(g[2]) + "</small></button>";
          }).join("") + "</div></div>" +

        '<div class="pf-field"><label>' + ico("layers", "#7c3aed") + "Định hướng Tin học</label>" +
          '<p class="pf-hint">Nhánh môn Tin học bạn theo ở trường (Chương trình GDPT 2018).</p>' +
          '<div class="pf-opts">' + opt(TRACKS, "track", p.track) + "</div></div>" +

        '<div class="pf-field"><label>' + ico("clock", "#ea580c") + "Lịch học trong tuần</label>" +
          '<p class="pf-hint">Chuỗi 🔥 chỉ tính trên các buổi này. Lỡ một buổi vẫn học bù được trong ngày hôm sau.</p>' +
          '<div class="pf-week" id="pfWeek">' + DAYS.map(function (d) {
            return '<button type="button" class="pf-day' + (ngay.indexOf(String(d[0])) >= 0 ? " on" : "") + '" data-day="' + d[0] + '">' + d[1] + "</button>";
          }).join("") + "</div>" +
          '<div class="pf-week-sum" id="pfWeekSum"></div></div>' +

        '<div class="pf-field" style="margin-bottom:10px"><label>' + ico("lock", "#16a34a") + "Cách mở bài học</label>" +
          '<p class="pf-hint">Chưa chọn thì mặc định mở tự do.</p>' +
          '<div class="pf-opts">' + opt(MODES, "mode", p.mode) + "</div></div>" +

        '<div class="pf-actions">' +
          '<button class="btn btn-primary btn-lg" id="pfSave">' + ico("save", null, 16) +
            (taoMoi ? " Tạo hồ sơ" : " Lưu thay đổi") + "</button>" +
          (taoMoi ? '<button class="btn btn-ghost btn-lg" id="pfCancel">Huỷ</button>' : "") +
        "</div>" +
      "</div>";
  }

  /* Gắn sự kiện + đồng bộ phần xem trước ở dải đầu trang */
  function wireForm(root, p, luu) {
    var nameEl = root.querySelector("#pfName");
    var preview = root.querySelector("#pfNamePreview");
    var ava = root.querySelector("#pfAva");
    var tags = root.querySelector("#pfTags");
    var sum = root.querySelector("#pfWeekSum");

    function docChon(sel) { var el = root.querySelector(sel + ".on"); return el ? el.dataset.val : ""; }
    function docNgay() {
      return [].slice.call(root.querySelectorAll(".pf-day.on")).map(function (b) { return Number(b.dataset.day); });
    }
    function hienThi() {
      var g = docChon('.pf-grade[data-group="grade"]'), t = docChon('.pf-opt[data-group="track"]');
      var ds = [];
      if (g) ds.push("Lớp " + g);
      if (t) ds.push(labelOf(TRACKS, t));
      tags.innerHTML = ds.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("");
      var n = docNgay().length;
      sum.textContent = n ? "Đang chọn " + n + " buổi/tuần" : "Chưa chọn buổi nào — chuỗi sẽ tính theo mọi ngày.";
    }
    function doiNhanVat(val) {
      ava.innerHTML = profileAvatar({ gender: val });
      root.querySelectorAll(".pf-char").forEach(function (b) { b.classList.toggle("on", b.dataset.char === val); });
    }

    nameEl.oninput = function () { preview.textContent = nameEl.value.trim() || "Chưa đặt tên"; };
    root.querySelectorAll(".pf-char").forEach(function (b) {
      b.onclick = function () { doiNhanVat(b.dataset.char); };
    });
    /* nhóm chọn-một: bấm lại để bỏ chọn */
    root.querySelectorAll('[data-group="grade"], [data-group="track"], [data-group="mode"]').forEach(function (b) {
      b.onclick = function () {
        var nhom = b.dataset.group, dangBat = b.classList.contains("on");
        root.querySelectorAll('[data-group="' + nhom + '"]').forEach(function (x) { x.classList.remove("on"); });
        if (!dangBat) b.classList.add("on");
        hienThi();
      };
    });
    root.querySelectorAll(".pf-day").forEach(function (b) {
      b.onclick = function () { b.classList.toggle("on"); hienThi(); };
    });
    hienThi();

    root.querySelector("#pfSave").onclick = function () {
      var ten = nameEl.value.trim();
      if (!ten) { nameEl.focus(); nameEl.style.borderColor = "#dc2626"; return; }
      luu({
        name: ten,
        gender: (root.querySelector(".pf-char.on") || {}).dataset ? root.querySelector(".pf-char.on").dataset.char : "",
        grade: docChon('.pf-grade[data-group="grade"]'),
        track: docChon('.pf-opt[data-group="track"]'),
        mode: docChon('.pf-opt[data-group="mode"]'),
        days: docNgay(),
      });
    };
  }

  /* ------------------------------ SỬA HỒ SƠ ------------------------------ */
  function renderProfile() {
    var app = document.getElementById("app");
    if (!app) return;
    var p = getProfile();
    app.innerHTML =
      '<button class="back-link" id="pfBack">' + ico("aleft", null, 15) + " Trang chủ</button>" +
      '<div class="pf-wrap">' + formHtml(p, false) + "</div>";
    if (typeof iconify === "function") iconify(app);
    app.querySelector("#pfBack").onclick = function () { if (typeof go === "function") go("home"); };
    wireForm(app, p, function (data) {
      setProfile(data);
      if (typeof toast === "function") toast("Đã lưu hồ sơ " + ((typeof ICON === "function") ? ICON("check2", 15) : "✓"));
      if (typeof go === "function") go("home");
    });
  }

  /* ------------------------------ TẠO HỒ SƠ ------------------------------ */
  function renderProfileNew() {
    var app = document.getElementById("app");
    if (!app) return;
    var p = { name: "", gender: "", grade: "", track: "", mode: "", days: [] };
    app.innerHTML =
      '<div class="pf-wrap">' +
        '<h2 style="margin-bottom:4px">' + ico("user", "#4f46e5", 22) + " Thêm người học</h2>" +
        '<p class="pf-note">Mỗi người học có tiến độ, chuỗi ngày học và huy hiệu riêng. Có thể sửa lại bất cứ lúc nào.</p>' +
        formHtml(p, true) +
      "</div>";
    if (typeof iconify === "function") iconify(app);
    var huy = app.querySelector("#pfCancel");
    if (huy) huy.onclick = function () {
      if (window.Account && Account.renderProfilePicker) Account.renderProfilePicker();
      else if (typeof go === "function") go("account");
    };
    wireForm(app, p, function (data) {
      var btn = app.querySelector("#pfSave");
      btn.disabled = true;
      if (window.Account && Account.taoHoSo) {
        Account.taoHoSo(data).catch(function (e) {
          btn.disabled = false;
          if (typeof toast === "function") toast(e.message || "Không tạo được hồ sơ");
        });
      }
    });
  }

  if (typeof window !== "undefined") {
    window.getProfile = getProfile;
    window.renderProfile = renderProfile;
    window.renderProfileNew = renderProfileNew;
    window.profileGreeting = profileGreeting;
    window.profileAvatar = profileAvatar;
  }
})();
