/* ============================================================================
 *  TÀI KHOẢN & HỒ SƠ HỌC TẬP
 *  Nạp SAU profile.js (dùng lại CSS .pf-*), TRƯỚC app.js.
 *
 *  Luồng: mở app -> ĐĂNG NHẬP -> CHỌN HỒ SƠ -> vào học.
 *  Một tài khoản (email) có thể có nhiều hồ sơ; mỗi hồ sơ có tiến độ riêng
 *  (bài đã học, lịch sử làm bài, XP, huy hiệu, lịch học).
 *
 *  Dữ liệu trên máy được tách theo hồ sơ: khoá localStorage có đuôi ":<id hồ sơ>"
 *  (xem STORE_KEY trong app.js và GAM_KEY trong gamify.js). Đổi hồ sơ thì tải
 *  lại trang cho mọi mô-đun đọc lại đúng kho dữ liệu.
 * ==========================================================================*/
(function () {
  var API_TIMEOUT = 8000;
  var KEY_PROFILE = "tinhoc_profile_id";

  var Account = {
    user: undefined,      // undefined = chưa rõ, null = chưa đăng nhập
    profiles: [],
    profileId: null,      // hồ sơ đang dùng
    available: undefined, // false = bản tĩnh, không có máy chủ
    dbOff: false,
    lastSync: null,
    syncInfo: null,
    _mute: false,
    _timers: {},
  };

  /* ---------------- gọi API ---------------- */
  function api(path, method, body) {
    var ctl = new AbortController();
    var to = setTimeout(function () { ctl.abort(); }, API_TIMEOUT);
    return fetch("/api" + path, {
      method: method || "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      signal: ctl.signal,
    }).then(function (res) {
      clearTimeout(to);
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.status === 503) Account.dbOff = true;
        if (!res.ok) { var e = new Error(data.error || ("Lỗi " + res.status)); e.status = res.status; throw e; }
        return data;
      });
    }, function (err) { clearTimeout(to); err.network = true; throw err; });
  }
  function debounce(name, ms, fn) {
    clearTimeout(Account._timers[name]);
    Account._timers[name] = setTimeout(fn, ms);
  }
  function hoSoHienTai() {
    for (var i = 0; i < Account.profiles.length; i++) {
      if (Account.profiles[i].id === Account.profileId) return Account.profiles[i];
    }
    return null;
  }

  /* ---------------- đọc dữ liệu trên máy ---------------- */
  function localHistory() { return (typeof State !== "undefined" && State.history) || []; }
  function localLearned() { return (typeof State !== "undefined" && State.learned) || []; }
  function localGam() {
    try { return JSON.parse(localStorage.getItem(window.GAM_KEY || "tinhoc_gam_v1")) || null; } catch (e) { return null; }
  }
  function mutedSave(key, val) {
    Account._mute = true;
    try { if (typeof save === "function") save(key, val); } finally { Account._mute = false; }
  }

  /* ---------------- đồng bộ ---------------- */
  function fullSync() {
    if (!Account.user || !Account.profileId) return Promise.resolve();
    var pid = Account.profileId;
    return api("/sync?profileId=" + pid).then(function (srv) {
      /* learned: hợp hai bên */
      var loc = localLearned(), set = {};
      loc.forEach(function (id) { set[id] = 1; });
      (srv.learned || []).forEach(function (id) { set[id] = 1; });
      var merged = Object.keys(set);
      if (merged.length !== loc.length) {
        mutedSave("learned", merged);
        if (typeof State !== "undefined") State.learned = merged;
      }
      var p1 = merged.length ? api("/learned", "PUT", { profileId: pid, ids: merged }) : Promise.resolve();

      /* history/attempts: gộp theo mốc thời gian */
      var srvAtt = srv.attempts || [], srvTs = {};
      srvAtt.forEach(function (r) { if (r && r.at) srvTs[r.at] = 1; });
      var onlyLocal = localHistory().filter(function (r) { return r && r.at && !srvTs[r.at]; });
      var p2 = onlyLocal.length ? api("/attempts", "POST", { profileId: pid, records: onlyLocal }) : Promise.resolve();
      var all = {};
      srvAtt.concat(localHistory()).forEach(function (r) { if (r && r.at && !all[r.at]) all[r.at] = r; });
      var mergedHist = Object.keys(all).map(function (k) { return all[k]; })
        .sort(function (a, b) { return b.at - a.at; }).slice(0, 50);
      if (mergedHist.length !== localHistory().length) {
        mutedSave("history", mergedHist);
        if (typeof State !== "undefined") State.history = mergedHist;
      }

      /* hồ sơ: máy chủ là nguồn chuẩn (hồ sơ do người dùng sửa ở trang Hồ sơ) */
      if (srv.profile && typeof State !== "undefined") {
        mutedSave("profile", srv.profile);
        State.profile = srv.profile;
      }

      Account.syncInfo = { attempts: Math.max(srvAtt.length, mergedHist.length), learned: merged.length };
      Account.lastSync = new Date();

      /* gamify: bên nào XP cao hơn thì thắng */
      var lg = localGam(), sg = srv.gamify;
      if (sg && (!lg || (Number(sg.xp) || 0) > (Number(lg.xp) || 0))) {
        localStorage.setItem(window.GAM_KEY || "tinhoc_gam_v1", JSON.stringify(sg));
        if (!sessionStorage.getItem("acGamReloaded")) {
          sessionStorage.setItem("acGamReloaded", "1");
          location.reload();
          return;
        }
      } else if (lg) {
        p1 = p1.then(function () { return api("/gamify", "PUT", { profileId: pid, data: lg }); });
      }
      return Promise.all([p1, p2]);
    }).catch(function (e) { console.warn("[account] Đồng bộ lỗi:", e.message); });
  }

  /* app.js gọi trong save() */
  function onSaved(key, val) {
    if (Account._mute || !Account.user || !Account.profileId) return;
    var pid = Account.profileId;
    if (key === "history") {
      var newest = val && val[0];
      if (newest) api("/attempts", "POST", { profileId: pid, record: newest }).catch(function () {});
      debounce("gam", 3000, function () {
        var g = localGam();
        if (g) api("/gamify", "PUT", { profileId: pid, data: g }).catch(function () {});
      });
    } else if (key === "learned") {
      debounce("learned", 1500, function () {
        api("/learned", "PUT", { profileId: pid, ids: localLearned() }).catch(function () {});
      });
    } else if (key === "profile") {
      debounce("profile", 1200, function () {
        var p = (typeof State !== "undefined" && State.profile) || {};
        api("/profiles/" + pid, "PATCH", p).then(function (d) {
          for (var i = 0; i < Account.profiles.length; i++) {
            if (Account.profiles[i].id === pid) Account.profiles[i] = d.profile;
          }
        }).catch(function () {});
      });
    }
  }

  /* XP còn đổi ngoài save() (bài tập, từ vựng) -> đẩy định kỳ */
  var lastXp = -1;
  setInterval(function () {
    if (!Account.user || !Account.profileId) return;
    var g = localGam();
    if (g && (Number(g.xp) || 0) !== lastXp) {
      lastXp = Number(g.xp) || 0;
      api("/gamify", "PUT", { profileId: Account.profileId, data: g }).catch(function () {});
    }
  }, 60000);

  /* ---------------- khởi động ---------------- */
  function boot() {
    if (location.protocol === "file:") {
      Account.available = false; Account.user = null;
      return Promise.resolve();
    }
    return api("/me").then(function (d) {
      Account.available = true;
      Account.user = d.user || null;
      Account.profiles = d.profiles || [];
      var luu = Number(localStorage.getItem(KEY_PROFILE)) || null;
      var hopLe = Account.profiles.some(function (p) { return p.id === luu; });
      Account.profileId = hopLe ? luu : null;
      if (!Account.user) Account.profileId = null;
    }).catch(function (e) {
      if (e.status === 503) { Account.available = true; Account.dbOff = true; }
      else Account.available = false;
      Account.user = null;
    });
  }

  function chonHoSo(id) {
    Account.profileId = id;
    localStorage.setItem(KEY_PROFILE, String(id));
    location.reload();          // để mọi mô-đun đọc lại kho dữ liệu của hồ sơ này
  }

  /* ---------------- CSS ---------------- */
  var css =
    ".gate{max-width:440px;margin:6vh auto 0;text-align:center}" +
    ".gate-logo{width:64px;height:64px;border-radius:18px;background:var(--primary-soft);border:1px solid var(--primary);" +
      "display:flex;align-items:center;justify-content:center;margin:0 auto 14px}" +
    ".gate h1{font-family:var(--font-display);font-size:24px;margin-bottom:6px}" +
    ".gate p.sub{color:var(--text-soft);font-size:14.5px;margin-bottom:22px}" +
    ".gate .pf-card{text-align:left}" +
    ".ac-tabs{display:flex;gap:8px;margin-bottom:18px}" +
    ".ac-tab{flex:1;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--bg-soft);color:var(--text-soft);font-weight:700;font-size:14.5px;cursor:pointer;font-family:inherit}" +
    ".ac-tab.on{background:var(--primary);border-color:var(--primary);color:#fff}" +
    ".ac-err{color:#dc2626;font-size:13.5px;font-weight:650;margin:10px 0 0;min-height:18px}" +
    ".ac-note{color:var(--text-soft);font-size:13.5px;margin-top:14px;line-height:1.55}" +
    /* chọn hồ sơ */
    ".hs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-top:6px}" +
    ".hs-card{display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 12px;cursor:pointer;font-family:inherit;" +
      "background:var(--bg-card);border:1px solid var(--border);border-radius:16px;transition:border-color .15s,transform .1s}" +
    ".hs-card:hover{border-color:var(--primary);transform:translateY(-2px)}" +
    ".hs-card.on{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-soft)}" +
    ".hs-ava{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;" +
      "background:var(--primary-soft);border:1px solid var(--primary)}" +
    ".hs-ten{font-weight:800;font-size:15px;color:var(--text);text-align:center;word-break:break-word}" +
    ".hs-phu{font-size:12px;color:var(--text-soft)}" +
    ".hs-them{border-style:dashed;color:var(--text-soft);justify-content:center}" +
    ".hs-them .hs-ava{background:var(--bg-soft);border-style:dashed;border-color:var(--border);font-size:26px}" +
    /* trang tài khoản */
    ".ac-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px dashed var(--border);font-size:14.5px}" +
    ".ac-row b{font-weight:750}" +
    ".ac-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}" +
    ".ac-hs-item{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px dashed var(--border)}" +
    ".ac-hs-item .hs-ava{width:40px;height:40px;font-size:22px}" +
    ".ac-hs-name{flex:1;min-width:0}" +
    ".ac-hs-name b{display:block;font-size:15px}" +
    ".ac-hs-name small{color:var(--text-soft);font-size:12.5px}" +
    ".ac-mini{border:1px solid var(--border);background:var(--bg-card);border-radius:8px;padding:6px 12px;font-size:13px;" +
      "font-weight:650;cursor:pointer;font-family:inherit;color:var(--text-soft)}" +
    ".ac-mini:hover{border-color:var(--primary);color:var(--primary)}" +
    ".ac-mini.danger:hover{border-color:#dc2626;color:#dc2626}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function ico(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; }
  function avatarCua(p) { return p.gender === "nam" ? "👦" : p.gender === "nu" ? "👧" : "🧑‍🎓"; }
  function esc2(s) { return (typeof esc === "function") ? esc(s) : String(s == null ? "" : s); }

  /* =========================== MÀN ĐĂNG NHẬP =========================== */
  function renderGate(mode) {
    var app = document.getElementById("app");
    if (!app) return;
    var isReg = mode === "register";
    app.innerHTML =
      '<div class="gate">' +
        '<div class="gate-logo">' + ico("monitor", "#4f46e5", 30) + "</div>" +
        "<h1>Ôn thi Tin học THPT</h1>" +
        '<p class="sub">Đăng nhập để lưu tiến độ học và đồng bộ giữa các thiết bị.</p>' +
        '<div class="pf-card" id="acCard">' +
          '<div class="ac-tabs">' +
            '<button class="ac-tab' + (isReg ? "" : " on") + '" data-tab="login">Đăng nhập</button>' +
            '<button class="ac-tab' + (isReg ? " on" : "") + '" data-tab="register">Tạo tài khoản</button>' +
          "</div>" +
          '<div class="pf-field"><label for="acEmail">Email</label>' +
            '<input class="pf-input" id="acEmail" type="email" autocomplete="username" placeholder="vd: an.nguyen@gmail.com"></div>' +
          '<div class="pf-field"><label for="acPass">Mật khẩu' + (isReg ? " (ít nhất 6 ký tự)" : "") + "</label>" +
            '<input class="pf-input" id="acPass" type="password" autocomplete="' + (isReg ? "new-password" : "current-password") + '"></div>' +
          (isReg ? '<div class="pf-field"><label for="acName">Tên người học đầu tiên</label>' +
            '<input class="pf-input" id="acName" type="text" maxlength="40" placeholder="Ví dụ: Nguyễn Văn An"></div>' : "") +
          '<button class="btn btn-primary btn-lg btn-block" id="acGo">' + (isReg ? "Tạo tài khoản" : "Đăng nhập") + "</button>" +
          '<div class="ac-err" id="acErr"></div>' +
          '<p class="ac-note">Một tài khoản dùng được cho <b>nhiều người học</b> — ví dụ hai anh em, mỗi người một hồ sơ với tiến độ riêng.</p>' +
        "</div>" +
      "</div>";
    if (typeof iconify === "function") iconify(app);
    wireGate(isReg);
  }

  function wireGate(isReg) {
    var app = document.getElementById("app");
    app.querySelectorAll(".ac-tab").forEach(function (t) {
      t.onclick = function () { renderGate(t.dataset.tab); };
    });
    var email = app.querySelector("#acEmail"), pass = app.querySelector("#acPass");
    var nameEl = app.querySelector("#acName");
    var goBtn = app.querySelector("#acGo"), err = app.querySelector("#acErr");
    var submit = function () {
      err.textContent = ""; goBtn.disabled = true;
      var payload = { email: email.value, password: pass.value };
      if (isReg) payload.name = nameEl ? nameEl.value.trim() : "";
      api(isReg ? "/auth/register" : "/auth/login", "POST", payload).then(function (d) {
        Account.user = d.user;
        Account.profiles = d.profiles || [];
        if (Account.profiles.length === 1) { chonHoSo(Account.profiles[0].id); return; }
        renderProfilePicker();
      }).catch(function (e2) {
        err.textContent = e2.network ? "Không kết nối được máy chủ." : e2.message;
        goBtn.disabled = false;
      });
    };
    goBtn.onclick = submit;
    pass.onkeydown = function (ev) { if (ev.key === "Enter") submit(); };
  }

  /* =========================== CHỌN HỒ SƠ =========================== */
  function renderProfilePicker() {
    var app = document.getElementById("app");
    if (!app) return;
    var the = Account.profiles.map(function (p) {
      var phu = [p.grade ? "Lớp " + p.grade : "", p.track === "khmt" ? "KHMT" : p.track === "udung" ? "Ứng dụng" : ""]
        .filter(Boolean).join(" · ");
      return '<button class="hs-card" data-id="' + p.id + '">' +
        '<span class="hs-ava">' + avatarCua(p) + "</span>" +
        '<span class="hs-ten">' + esc2(p.name) + "</span>" +
        (phu ? '<span class="hs-phu">' + esc2(phu) + "</span>" : "") +
        "</button>";
    }).join("");
    var them = Account.profiles.length < 6
      ? '<button class="hs-card hs-them" id="hsThem"><span class="hs-ava">+</span><span class="hs-ten">Thêm hồ sơ</span></button>'
      : "";
    app.innerHTML =
      '<div class="gate" style="max-width:620px">' +
        "<h1>Ai đang học?</h1>" +
        '<p class="sub">Mỗi hồ sơ có tiến độ, chuỗi ngày học và huy hiệu riêng.</p>' +
        '<div class="hs-grid">' + the + them + "</div>" +
        '<div class="ac-actions" style="justify-content:center">' +
          '<button class="ac-mini" id="hsOut">Đăng xuất</button></div>' +
      "</div>";
    app.querySelectorAll(".hs-card[data-id]").forEach(function (c) {
      c.onclick = function () { chonHoSo(Number(c.dataset.id)); };
    });
    var themBtn = document.getElementById("hsThem");
    if (themBtn) themBtn.onclick = function () { themHoSo(); };
    document.getElementById("hsOut").onclick = function () { dangXuat(); };
  }

  function themHoSo() {
    var ten = window.prompt("Tên người học mới:", "");
    if (ten == null) return;
    ten = String(ten).trim();
    if (!ten) return;
    api("/profiles", "POST", { name: ten }).then(function (d) {
      Account.profiles.push(d.profile);
      chonHoSo(d.profile.id);
    }).catch(function (e) {
      if (typeof toast === "function") toast(e.message); else alert(e.message);
    });
  }

  function dangXuat() {
    api("/auth/logout", "POST").catch(function () {}).then(function () {
      localStorage.removeItem(KEY_PROFILE);
      location.reload();
    });
  }

  /* =========================== TRANG TÀI KHOẢN =========================== */
  function renderAccount() {
    var app = document.getElementById("app");
    if (!app) return;
    if (!Account.user) { renderGate("login"); return; }

    var hs = Account.profiles.map(function (p) {
      var dang = p.id === Account.profileId;
      var phu = [p.grade ? "Lớp " + p.grade : "", p.track === "khmt" ? "Khoa học máy tính" : p.track === "udung" ? "Tin học ứng dụng" : ""]
        .filter(Boolean).join(" · ") || "Chưa đặt lớp và định hướng";
      return '<div class="ac-hs-item">' +
        '<span class="hs-ava">' + avatarCua(p) + "</span>" +
        '<span class="ac-hs-name"><b>' + esc2(p.name) + (dang ? " (đang dùng)" : "") + "</b><small>" + esc2(phu) + "</small></span>" +
        (dang
          ? '<button class="ac-mini" data-sua="' + p.id + '">Sửa hồ sơ</button>'
          : '<button class="ac-mini" data-doi="' + p.id + '">Chuyển sang</button>') +
        (Account.profiles.length > 1 ? '<button class="ac-mini danger" data-xoa="' + p.id + '">Xoá</button>' : "") +
        "</div>";
    }).join("");

    var si = Account.syncInfo || {};
    app.innerHTML =
      '<button class="back-link" id="acBack">' + ico("aleft", null, 15) + " Trang chủ</button>" +
      '<h2 style="margin-bottom:6px">' + ico("user", "#4f46e5", 22) + " Tài khoản</h2>" +
      '<p class="ac-note" style="margin:0 0 14px">Một tài khoản dùng chung cho nhiều người học, mỗi người một hồ sơ riêng.</p>' +

      '<div class="section-title">' + ico("globe", "#0891b2", 17) + " Đăng nhập</div>" +
      '<div class="pf-card" style="margin-bottom:20px">' +
        '<div class="ac-row"><span>Email</span><b>' + esc2(Account.user.email) + "</b></div>" +
        '<div class="ac-row"><span>Lượt làm bài đã lưu</span><b>' + (si.attempts != null ? si.attempts : "…") + "</b></div>" +
        '<div class="ac-row" style="border-bottom:none"><span>Đồng bộ gần nhất</span><b>' +
          (Account.lastSync ? Account.lastSync.toLocaleTimeString("vi-VN") : "chưa") + "</b></div>" +
        '<div class="ac-actions">' +
          '<button class="btn btn-ghost" id="acSync">' + ico("refresh", null, 15) + " Đồng bộ ngay</button>" +
          '<button class="btn btn-ghost" id="acOut">Đăng xuất</button>' +
        "</div>" +
      "</div>" +

      '<div class="section-title">' + ico("user", "#4f46e5", 17) + " Hồ sơ học tập (" + Account.profiles.length + "/6)</div>" +
      '<div class="pf-card">' + hs +
        (Account.profiles.length < 6
          ? '<div class="ac-actions"><button class="btn btn-primary" id="acAdd">' + ico("user", null, 15) + " Thêm hồ sơ</button></div>"
          : '<p class="ac-note">Đã đủ 6 hồ sơ — xoá bớt nếu muốn thêm người học mới.</p>') +
      "</div>";

    if (typeof iconify === "function") iconify(app);
    document.getElementById("acBack").onclick = function () { if (typeof go === "function") go("home"); };
    document.getElementById("acSync").onclick = function () {
      var b = document.getElementById("acSync"); b.disabled = true;
      fullSync().then(function () { if (typeof toast === "function") toast("Đã đồng bộ ✓"); renderAccount(); });
    };
    document.getElementById("acOut").onclick = dangXuat;
    var add = document.getElementById("acAdd");
    if (add) add.onclick = themHoSo;
    app.querySelectorAll("[data-doi]").forEach(function (b) {
      b.onclick = function () { chonHoSo(Number(b.dataset.doi)); };
    });
    app.querySelectorAll("[data-sua]").forEach(function (b) {
      b.onclick = function () { if (typeof go === "function") go("profile"); };
    });
    app.querySelectorAll("[data-xoa]").forEach(function (b) {
      b.onclick = function () { xoaHoSo(Number(b.dataset.xoa)); };
    });
  }

  function xoaHoSo(id) {
    var p = null;
    Account.profiles.forEach(function (x) { if (x.id === id) p = x; });
    if (!p) return;
    var xong = function (ok) {
      if (!ok) return;
      api("/profiles/" + id, "DELETE").then(function () {
        Account.profiles = Account.profiles.filter(function (x) { return x.id !== id; });
        if (Account.profileId === id) {                 // xoá đúng hồ sơ đang dùng
          localStorage.removeItem("tinhoc_thpt_v1:" + id);
          localStorage.removeItem("tinhoc_gam_v1:" + id);
          chonHoSo(Account.profiles[0].id);
          return;
        }
        localStorage.removeItem("tinhoc_thpt_v1:" + id);
        localStorage.removeItem("tinhoc_gam_v1:" + id);
        renderAccount();
      }).catch(function (e) { if (typeof toast === "function") toast(e.message); });
    };
    var msg = "Toàn bộ tiến độ của hồ sơ “" + p.name + "” sẽ bị xoá vĩnh viễn. Tiếp tục?";
    if (typeof confirmBox === "function") confirmBox("Xoá hồ sơ?", msg, "Xoá").then(xong);
    else xong(window.confirm(msg));
  }

  Account.boot = boot;
  Account.onSaved = onSaved;
  Account.fullSync = fullSync;
  Account.renderGate = renderGate;
  Account.renderProfilePicker = renderProfilePicker;
  Account.hoSoHienTai = hoSoHienTai;
  window.Account = Account;
  window.renderAccount = renderAccount;
})();
