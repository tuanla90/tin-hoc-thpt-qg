/* ============================================================================
 *  TÀI KHOẢN & ĐỒNG BỘ TIẾN ĐỘ LÊN MÁY CHỦ
 *  Nạp SAU profile.js (dùng lại CSS .pf-*), TRƯỚC app.js.
 *  Cách hoạt động (offline-first — chưa đăng nhập thì app y như cũ):
 *   - app.js gọi Account.onSaved(key, val) trong hàm save() → đẩy thay đổi lên.
 *   - Khi mở app / đăng nhập: kéo GET /api/sync về, TRỘN với dữ liệu local:
 *       learned  = hợp 2 tập;  history = gộp theo mốc thời gian (at);
 *       gamify   = bên nào XP cao hơn thắng;  profile = local có tên thì thắng.
 *   - window.renderAccount() đăng ký trong router của app.js (view "account").
 * ==========================================================================*/
(function () {
  var GAM_KEY = "tinhoc_gam_v1";
  var API_TIMEOUT = 8000;

  var Account = {
    user: undefined,      // undefined = chưa rõ, null = chưa đăng nhập, object = đã
    available: undefined, // false = đang chạy bản tĩnh (file:// hoặc host không có API)
    dbOff: false,         // server chạy nhưng chưa nối DB (thiếu DATABASE_URL)
    lastSync: null,       // Date lần đồng bộ gần nhất
    syncInfo: null,       // {attempts, learned} số liệu từ server
    _mute: false,         // true khi đang ghi local trong lúc trộn (chặn vòng lặp đẩy)
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
        if (res.status === 503) { Account.dbOff = true; }
        if (!res.ok) { var e = new Error(data.error || ("Lỗi " + res.status)); e.status = res.status; throw e; }
        return data;
      });
    }, function (err) { clearTimeout(to); err.network = true; throw err; });
  }

  function debounce(name, ms, fn) {
    clearTimeout(Account._timers[name]);
    Account._timers[name] = setTimeout(fn, ms);
  }

  /* ---------------- đọc dữ liệu local ---------------- */
  function localHistory() { return (typeof State !== "undefined" && State.history) || []; }
  function localLearned() { return (typeof State !== "undefined" && State.learned) || []; }
  function localProfile() { return (typeof State !== "undefined" && State.profile) || {}; }
  function localGam() {
    try { return JSON.parse(localStorage.getItem(GAM_KEY)) || null; } catch (e) { return null; }
  }
  function mutedSave(key, val) {
    Account._mute = true;
    try { if (typeof save === "function") save(key, val); } finally { Account._mute = false; }
  }

  /* ---------------- trộn & đồng bộ ---------------- */
  function fullSync() {
    if (!Account.user) return Promise.resolve();
    return api("/sync").then(function (srv) {
      /* 1) learned: hợp 2 tập */
      var loc = localLearned();
      var set = {};
      loc.forEach(function (id) { set[id] = 1; });
      (srv.learned || []).forEach(function (id) { set[id] = 1; });
      var merged = Object.keys(set);
      if (merged.length !== loc.length) {
        mutedSave("learned", merged);
        if (typeof State !== "undefined") State.learned = merged;
      }
      var newForServer = merged.filter(function (id) { return (srv.learned || []).indexOf(id) < 0; });
      var p1 = newForServer.length ? api("/learned", "PUT", { ids: merged }) : Promise.resolve();

      /* 2) history/attempts: gộp theo record.at */
      var srvAtt = srv.attempts || [];
      var srvTs = {};
      srvAtt.forEach(function (r) { if (r && r.at) srvTs[r.at] = 1; });
      var onlyLocal = localHistory().filter(function (r) { return r && r.at && !srvTs[r.at]; });
      var p2 = onlyLocal.length ? api("/attempts", "POST", { records: onlyLocal }) : Promise.resolve();
      var all = {};
      srvAtt.concat(localHistory()).forEach(function (r) { if (r && r.at && !all[r.at]) all[r.at] = r; });
      var mergedHist = Object.keys(all).map(function (k) { return all[k]; })
        .sort(function (a, b) { return b.at - a.at; }).slice(0, 50);
      if (mergedHist.length !== localHistory().length) {
        mutedSave("history", mergedHist);
        if (typeof State !== "undefined") State.history = mergedHist;
      }

      /* 3) profile: local có tên thì đẩy lên; local trống mà server có -> kéo về */
      var lp = localProfile();
      var p3 = Promise.resolve();
      if (lp && lp.name) p3 = api("/profile", "PUT", { profile: lp });
      else if (srv.profile && srv.profile.name) {
        mutedSave("profile", srv.profile);
        if (typeof State !== "undefined") State.profile = srv.profile;
      }

      Account.syncInfo = { attempts: Math.max(srvAtt.length, mergedHist.length), learned: merged.length };
      Account.lastSync = new Date();

      /* 4) gamify (XP/huy hiệu): bên XP cao hơn thắng — làm CUỐI vì có thể reload */
      var lg = localGam();
      var sg = srv.gamify;
      if (sg && (!lg || (Number(sg.xp) || 0) > (Number(lg.xp) || 0))) {
        localStorage.setItem(GAM_KEY, JSON.stringify(sg));
        if (!sessionStorage.getItem("acGamReloaded")) {
          sessionStorage.setItem("acGamReloaded", "1");
          location.reload();
          return;
        }
      } else if (lg) {
        p1 = p1.then(function () { return api("/gamify", "PUT", { data: lg }); });
      }

      return Promise.all([p1, p2, p3]).then(function () {
        if (typeof State !== "undefined" && State.view === "account") renderAccount();
      });
    }).catch(function (e) {
      console.warn("[account] Đồng bộ lỗi:", e.message);
    });
  }

  function pushGamifySoon() {
    debounce("gam", 3000, function () {
      var g = localGam();
      if (g && Account.user) api("/gamify", "PUT", { data: g }).catch(function () {});
    });
  }

  /* app.js gọi hàm này bên trong save() */
  function onSaved(key, val) {
    if (Account._mute || !Account.user || Account.available === false) return;
    if (key === "history") {
      var newest = val && val[0];
      if (newest) api("/attempts", "POST", { record: newest }).catch(function () {});
      pushGamifySoon();
    } else if (key === "learned") {
      debounce("learned", 1500, function () {
        api("/learned", "PUT", { ids: localLearned() }).catch(function () {});
      });
      pushGamifySoon();
    } else if (key === "profile") {
      debounce("profile", 1200, function () {
        api("/profile", "PUT", { profile: localProfile() }).catch(function () {});
      });
    }
  }

  /* Gamify còn đổi ngoài save() (bài tập, từ vựng) -> đẩy định kỳ khi mở app */
  var lastPushedXp = -1;
  setInterval(function () {
    if (!Account.user || Account.available === false) return;
    var g = localGam();
    if (g && (Number(g.xp) || 0) !== lastPushedXp) {
      lastPushedXp = Number(g.xp) || 0;
      api("/gamify", "PUT", { data: g }).catch(function () {});
    }
  }, 60000);

  /* ---------------- khởi động ---------------- */
  function boot() {
    if (location.protocol === "file:") { Account.available = false; Account.user = null; return; }
    api("/me").then(function (d) {
      Account.available = true;
      Account.user = d.user || null;
      if (Account.user) fullSync();
      updateNavBadge();
    }).catch(function (e) {
      if (e.status === 503) { Account.available = true; Account.user = null; } // server có, DB chưa
      else { Account.available = false; Account.user = null; }                  // bản tĩnh
      updateNavBadge();
    });
  }

  /* Chấm xanh trên nút Tài khoản khi đã đăng nhập */
  function updateNavBadge() {
    var btn = document.querySelector('.nav-btn[data-nav="account"]');
    if (!btn) return;
    btn.classList.toggle("ac-on", !!Account.user);
  }

  /* ---------------- giao diện ---------------- */
  var css =
    '.nav-btn.ac-on .nav-ic{position:relative}' +
    '.nav-btn.ac-on .nav-ic::after{content:"";position:absolute;top:-2px;right:-4px;width:8px;height:8px;border-radius:50%;background:var(--success,#16a34a)}' +
    ".ac-tabs{display:flex;gap:8px;margin-bottom:18px}" +
    ".ac-tab{flex:1;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--bg-soft);color:var(--text-soft);font-weight:700;font-size:14.5px;cursor:pointer;font-family:inherit}" +
    ".ac-tab.on{background:var(--primary);border-color:var(--primary);color:#fff}" +
    ".ac-err{color:#dc2626;font-size:13.5px;font-weight:650;margin:10px 0 0;min-height:18px}" +
    ".ac-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px dashed var(--border);font-size:14.5px}" +
    ".ac-row b{font-weight:750}" +
    ".ac-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}" +
    ".ac-note{color:var(--text-soft);font-size:13.5px;margin-top:14px;line-height:1.55}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function ico(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; }

  function formHtml(mode) {
    var isReg = mode === "register";
    return (
      '<div class="ac-tabs">' +
        '<button class="ac-tab' + (isReg ? "" : " on") + '" data-tab="login">Đăng nhập</button>' +
        '<button class="ac-tab' + (isReg ? " on" : "") + '" data-tab="register">Đăng ký</button>' +
      "</div>" +
      '<div class="pf-field"><label for="acEmail">Email</label>' +
        '<input class="pf-input" id="acEmail" type="email" autocomplete="username" placeholder="vd: an.nguyen@gmail.com"></div>' +
      '<div class="pf-field"><label for="acPass">Mật khẩu' + (isReg ? " (ít nhất 6 ký tự)" : "") + "</label>" +
        '<input class="pf-input" id="acPass" type="password" autocomplete="' + (isReg ? "new-password" : "current-password") + '"></div>' +
      '<button class="btn btn-primary btn-lg" id="acGo">' + (isReg ? "Tạo tài khoản" : "Đăng nhập") + "</button>" +
      '<div class="ac-err" id="acErr"></div>' +
      '<p class="ac-note">Tài khoản dùng để <b>lưu tiến độ trên máy chủ</b>: lịch sử làm bài, bài đã học, XP/huy hiệu, hồ sơ — đăng nhập ở máy khác là có lại toàn bộ. Toàn bộ nội dung học hiện <b>miễn phí</b>, không đăng nhập vẫn dùng được.</p>'
    );
  }

  function loggedInHtml() {
    var p = localProfile();
    var si = Account.syncInfo || {};
    return (
      '<div class="ac-row"><span>Email</span><b>' + esc(Account.user.email) + "</b></div>" +
      '<div class="ac-row"><span>Tên hiển thị</span><b>' + esc(p.name || Account.user.name || "(chưa đặt — vào Hồ sơ)") + "</b></div>" +
      '<div class="ac-row"><span>Lượt làm bài đã lưu</span><b>' + (si.attempts != null ? si.attempts : "…") + "</b></div>" +
      '<div class="ac-row"><span>Bài đã học</span><b>' + (si.learned != null ? si.learned : "…") + "</b></div>" +
      '<div class="ac-row" style="border-bottom:none"><span>Đồng bộ gần nhất</span><b>' +
        (Account.lastSync ? Account.lastSync.toLocaleTimeString("vi-VN") : "chưa") + "</b></div>" +
      '<div class="ac-actions">' +
        '<button class="btn btn-primary" id="acSync">' + ico("refresh", null, 15) + " Đồng bộ ngay</button>" +
        '<button class="btn btn-ghost" id="acOut">Đăng xuất</button>' +
      "</div>" +
      '<p class="ac-note">Mọi lần nộp bài / học xong bài đều tự đẩy lên máy chủ — nút trên chỉ cần khi bạn muốn chắc chắn.</p>'
    );
  }

  function renderAccount() {
    var app = document.getElementById("app");
    if (!app) return;
    var head =
      '<button class="back-link" id="acBack">' + ico("aleft", null, 15) + " Trang chủ</button>" +
      '<h2 style="margin-bottom:6px">' + ico("globe", "#0d9488", 22) + " Tài khoản</h2>";

    var body;
    if (Account.available === false) {
      body = '<p class="pf-note">Bạn đang mở <b>bản chạy trên máy</b> (không có máy chủ) nên chưa dùng được tài khoản. ' +
        "Hãy mở bản web chính thức để lưu tiến độ trên máy chủ.</p>";
    } else if (Account.dbOff && !Account.user) {
      body = '<p class="pf-note">Máy chủ đang chạy nhưng <b>chưa nối cơ sở dữ liệu</b> (thiếu <code>DATABASE_URL</code>). ' +
        "Trang web vẫn dùng bình thường; tính năng tài khoản sẽ mở khi cấu hình xong.</p>";
    } else if (!Account.user) {
      body = '<div class="pf-card" id="acCard">' + formHtml("login") + "</div>";
    } else {
      body = '<div class="pf-card" id="acCard">' + loggedInHtml() + "</div>";
    }
    app.innerHTML = head + body;
    if (typeof iconify === "function") iconify(app);
    var back = app.querySelector("#acBack");
    if (back) back.onclick = function () { if (typeof go === "function") go("home"); };
    wireCard(app);
  }

  function wireCard(app) {
    var card = app.querySelector("#acCard");
    if (!card) return;

    /* dạng form (chưa đăng nhập) */
    var tabs = card.querySelectorAll(".ac-tab");
    if (tabs.length) {
      tabs.forEach(function (t) {
        t.onclick = function () { card.innerHTML = formHtml(t.dataset.tab); wireCard(app); };
      });
      var email = card.querySelector("#acEmail");
      var pass = card.querySelector("#acPass");
      var goBtn = card.querySelector("#acGo");
      var err = card.querySelector("#acErr");
      var isReg = card.querySelector('.ac-tab[data-tab="register"]').classList.contains("on");
      var submit = function () {
        err.textContent = "";
        goBtn.disabled = true;
        var payload = { email: email.value, password: pass.value };
        if (isReg) payload.name = (localProfile().name || "");
        api(isReg ? "/auth/register" : "/auth/login", "POST", payload).then(function (d) {
          Account.user = d.user;
          updateNavBadge();
          if (typeof toast === "function") toast(isReg ? "Đã tạo tài khoản 🎉" : "Xin chào " + (d.user.name || d.user.email));
          return fullSync();
        }).then(function () { renderAccount(); }).catch(function (e2) {
          err.textContent = e2.network ? "Không kết nối được máy chủ." : e2.message;
          goBtn.disabled = false;
        });
      };
      goBtn.onclick = submit;
      pass.onkeydown = function (ev) { if (ev.key === "Enter") submit(); };
      return;
    }

    /* dạng đã đăng nhập */
    var syncBtn = card.querySelector("#acSync");
    if (syncBtn) syncBtn.onclick = function () {
      syncBtn.disabled = true;
      fullSync().then(function () {
        if (typeof toast === "function") toast("Đã đồng bộ ✓");
        renderAccount();
      });
    };
    var outBtn = card.querySelector("#acOut");
    if (outBtn) outBtn.onclick = function () {
      api("/auth/logout", "POST").catch(function () {}).then(function () {
        Account.user = null;
        Account.syncInfo = null;
        updateNavBadge();
        if (typeof toast === "function") toast("Đã đăng xuất — dữ liệu trên máy vẫn giữ nguyên");
        renderAccount();
      });
    };
  }

  Account.boot = boot;
  Account.onSaved = onSaved;
  Account.fullSync = fullSync;
  window.Account = Account;
  window.renderAccount = renderAccount;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
