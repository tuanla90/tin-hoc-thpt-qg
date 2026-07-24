/* ============================================================================
 *  HỒ SƠ NGƯỜI DÙNG — lưu tên, giới tính, lớp hiện tại, định hướng Tin học.
 *  Lưu cục bộ (localStorage) qua save()/load() của app.js. Nạp TRƯỚC app.js.
 *   window.getProfile()   -> đối tượng hồ sơ (đã điền mặc định)
 *   window.renderProfile()-> vẽ trang hồ sơ (đăng ký trong router của app.js)
 *   window.profileGreeting()-> chuỗi HTML lời chào (dùng ở trang chủ)
 * ==========================================================================*/
(function () {
  /* ---- CSS (tự chèn, không đụng styles.css) ---- */
  var css =
    ".pf-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:22px 20px;box-shadow:var(--shadow);max-width:640px}" +
    ".pf-top{display:flex;align-items:center;gap:16px;margin-bottom:20px}" +
    ".pf-avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;background:var(--primary-soft);border:1px solid var(--primary);flex:0 0 auto}" +
    ".pf-hello{font-size:13px;color:var(--text-soft);font-weight:600}" +
    ".pf-hello b{color:var(--text);font-size:17px;display:block;margin-top:1px}" +
    ".pf-field{margin-bottom:18px}" +
    ".pf-field>label{display:block;font-weight:700;font-size:14px;margin-bottom:8px;color:var(--text)}" +
    ".pf-input{width:100%;box-sizing:border-box;padding:11px 14px;border:1px solid var(--border);border-radius:10px;background:var(--bg-soft);color:var(--text);font-size:15px;font-family:inherit}" +
    ".pf-input:focus{outline:none;border-color:var(--primary)}" +
    ".pf-chips{display:flex;gap:8px;flex-wrap:wrap}" +
    ".pf-chip{padding:9px 15px;border:1px solid var(--border);border-radius:999px;background:var(--bg-soft);color:var(--text-soft);font-size:14px;font-weight:650;cursor:pointer;transition:all .12s;font-family:inherit}" +
    ".pf-chip:hover{border-color:var(--primary)}" +
    ".pf-chip.on{background:var(--primary);border-color:var(--primary);color:#fff}" +
    ".pf-save{margin-top:6px}" +
    ".pf-note{color:var(--text-soft);font-size:13.5px;margin:2px 0 18px}" +
    ".pf-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}" +
    ".pf-tag{font-size:12px;font-weight:650;padding:3px 9px;border-radius:999px;background:var(--bg-soft);border:1px solid var(--border);color:var(--text-soft)}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---- Lựa chọn ---- */
  var GENDERS = [["nam", "Nam"], ["nu", "Nữ"], ["khac", "Khác"]];
  var GRADES = [["10", "Lớp 10"], ["11", "Lớp 11"], ["12", "Lớp 12"]];
  var TRACKS = [["khmt", "Khoa học máy tính"], ["udung", "Tin học ứng dụng"]];
  var DEFAULT = { name: "", gender: "", grade: "", track: "" };

  function labelOf(list, val) { for (var i = 0; i < list.length; i++) if (list[i][0] === val) return list[i][1]; return ""; }
  function avatarOf(p) { return p.gender === "nam" ? "👦" : p.gender === "nu" ? "👧" : "🧑‍🎓"; }

  /* ---- Đọc / ghi hồ sơ ---- */
  function getProfile() {
    var raw = (typeof load === "function") ? load("profile", {}) : {};
    var p = {}; for (var k in DEFAULT) p[k] = (raw && raw[k]) || DEFAULT[k];
    return p;
  }
  function setProfile(p) {
    if (typeof save === "function") save("profile", p);
    if (typeof State !== "undefined") State.profile = p;   // để trang chủ đọc ngay
  }

  /* ---- Lời chào ở trang chủ (rỗng nếu chưa có tên) ---- */
  function profileGreeting() {
    var p = getProfile();
    if (!p.name) return "";
    var tags = [];
    if (p.grade) tags.push('<span class="pf-tag">' + esc(labelOf(GRADES, p.grade)) + "</span>");
    if (p.track) tags.push('<span class="pf-tag">' + esc(labelOf(TRACKS, p.track)) + "</span>");
    return '<div style="display:flex;align-items:center;gap:12px;margin:0 0 14px">' +
      '<div class="pf-avatar" style="width:44px;height:44px;font-size:24px">' + avatarOf(p) + "</div>" +
      '<div><div class="pf-hello">Xin chào 👋<b>' + esc(p.name) + "</b></div>" +
      (tags.length ? '<div class="pf-meta">' + tags.join("") + "</div>" : "") +
      "</div></div>";
  }

  /* ---- Trang hồ sơ ---- */
  function renderProfile() {
    var app = document.getElementById("app");
    if (!app) return;
    var p = getProfile();
    var ico = function (n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; };

    var chipRow = function (list, group, cur) {
      return '<div class="pf-chips" data-group="' + group + '">' +
        list.map(function (o) {
          return '<button type="button" class="pf-chip' + (o[0] === cur ? " on" : "") + '" data-val="' + o[0] + '">' + esc(o[1]) + "</button>";
        }).join("") + "</div>";
    };

    app.innerHTML =
      '<button class="back-link" id="pfBack">' + ico("aleft", null, 15) + " Trang chủ</button>" +
      '<h2 style="margin-bottom:6px">' + ico("user", "#4f46e5", 22) + " Hồ sơ của bạn</h2>" +
      '<p class="pf-note">Thông tin lưu trên máy này để cá nhân hoá trải nghiệm học. Không gửi đi đâu cả.</p>' +
      '<div class="pf-card">' +
        '<div class="pf-top"><div class="pf-avatar" id="pfAvatar">' + avatarOf(p) + "</div>" +
          '<div class="pf-hello">' + (p.name ? "Xin chào" : "Chưa đặt tên") +
          '<b id="pfNamePreview">' + (p.name ? esc(p.name) : "…") + "</b></div></div>" +

        '<div class="pf-field"><label for="pfName">Họ và tên</label>' +
          '<input class="pf-input" id="pfName" type="text" maxlength="40" placeholder="Ví dụ: Nguyễn Văn An" value="' + esc(p.name) + '"></div>' +

        '<div class="pf-field"><label>Giới tính</label>' + chipRow(GENDERS, "gender", p.gender) + "</div>" +

        '<div class="pf-field"><label>Lớp hiện tại</label>' + chipRow(GRADES, "grade", p.grade) + "</div>" +

        '<div class="pf-field"><label>Định hướng Tin học</label>' + chipRow(TRACKS, "track", p.track) +
          '<p class="pf-note" style="margin:8px 0 0">Chọn nhánh môn Tin học em đang theo ở trường (theo Chương trình GDPT 2018).</p></div>' +

        '<button class="btn btn-primary btn-lg pf-save" id="pfSave">' + ico("save", null, 16) + " Lưu hồ sơ</button>" +
      "</div>";

    if (typeof iconify === "function") iconify(app);

    /* chip: chọn 1 trong nhóm */
    app.querySelectorAll(".pf-chips").forEach(function (grp) {
      grp.querySelectorAll(".pf-chip").forEach(function (b) {
        b.onclick = function () {
          var wasOn = b.classList.contains("on");
          grp.querySelectorAll(".pf-chip").forEach(function (x) { x.classList.remove("on"); });
          if (!wasOn) b.classList.add("on");   // bấm lại để bỏ chọn
          syncAvatar();
        };
      });
    });

    var nameEl = app.querySelector("#pfName");
    var preview = app.querySelector("#pfNamePreview");
    nameEl.oninput = function () { preview.textContent = nameEl.value.trim() || "…"; };

    function pick(group) { var el = app.querySelector('.pf-chips[data-group="' + group + '"] .pf-chip.on'); return el ? el.dataset.val : ""; }
    function syncAvatar() { app.querySelector("#pfAvatar").textContent = avatarOf({ gender: pick("gender") }); }

    app.querySelector("#pfBack").onclick = function () { if (typeof go === "function") go("home"); };
    app.querySelector("#pfSave").onclick = function () {
      var data = { name: nameEl.value.trim(), gender: pick("gender"), grade: pick("grade"), track: pick("track") };
      setProfile(data);
      if (typeof toast === "function") toast("Đã lưu hồ sơ " + ((typeof ICON === "function") ? ICON("check2", 15) : "✓"));
    };
  }

  if (typeof window !== "undefined") {
    window.getProfile = getProfile;
    window.renderProfile = renderProfile;
    window.profileGreeting = profileGreeting;
  }
})();
