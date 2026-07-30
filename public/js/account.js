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
    /* Avatar/tên ở khối tài khoản phải theo kịp MỌI lần đổi hồ sơ — kể cả lúc
       còn là khách (chưa có Account.user, thoát sớm ở dưới) và lúc fullSync()
       ghi hồ sơ từ máy chủ đè lên qua mutedSave (đang _mute nên cũng thoát sớm
       ở dưới) — nên gọi TRƯỚC hai điều kiện thoát sớm đó, không phải sau. */
    if (key === "profile") veUserMenu();
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
    /* Mất mạng thì đừng chờ /me: cả giao diện đứng im tới 8 giây (API_TIMEOUT)
       rồi mới hiện, người dùng tưởng app hỏng. App đã cài ra màn hình chính
       (service worker) nên vẫn mở được — vào thẳng chế độ khách, có mạng lại
       thì lần mở sau tự đăng nhập lại. */
    if (navigator.onLine === false) {
      Account.available = false; Account.user = null; Account.offline = true;
      return Promise.resolve();
    }
    return api("/me").then(function (d) {
      Account.available = true;
      Account.user = d.user || null;
      Account.profiles = d.profiles || [];
      Account.plan = d.plan || null;             // { tier: 'free'|'paid', hetHan } — plan.js đọc
      Account.maxProfiles = d.maxProfiles || 1;  // theo gói: free 1, premium 3
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
    gopDuLieuKhach(id);         // mang tiến độ học lúc chưa đăng nhập sang hồ sơ này
    Account.profileId = id;
    localStorage.setItem(KEY_PROFILE, String(id));
    location.reload();          // để mọi mô-đun đọc lại kho dữ liệu của hồ sơ này
  }

  /* ================== CHẾ ĐỘ KHÁCH (chưa đăng nhập) ==================
     Người mới vào học được ngay, không bắt tạo tài khoản. Tiến độ lúc đó nằm ở
     khoá localStorage KHÔNG có đuôi hồ sơ (xem session.js). Khi họ đăng nhập,
     toàn bộ phần đã học phải theo sang hồ sơ vừa chọn — nếu không thì cảm giác
     "đăng nhập xong mất sạch bài đã học", tệ hơn là không mời đăng nhập. */
  var KEY_DATA = "tinhoc_thpt_v1", KEY_GAM = "tinhoc_gam_v1";
  var KEY_MOI = "tinhoc_moi_dangnhap";

  function docJson(k) {
    try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; }
  }
  function laKhach() { return Account.available !== false && !Account.user; }

  /* GỘP chứ không đè: hồ sơ đích có thể đã có tiến độ học từ máy khác. */
  function gopDuLieuKhach(id) {
    var khach = docJson(KEY_DATA), gamKhach = docJson(KEY_GAM);
    if (!khach && !gamKhach) return;
    var keyDich = KEY_DATA + ":" + id, keyGamDich = KEY_GAM + ":" + id;

    if (khach) {
      var dich = docJson(keyDich) || {};
      var set = {};
      (dich.learned || []).concat(khach.learned || []).forEach(function (x) { set[x] = 1; });
      dich.learned = Object.keys(set);

      var all = {};
      (dich.history || []).concat(khach.history || []).forEach(function (r) { if (r && r.at) all[r.at] = r; });
      dich.history = Object.keys(all).map(function (k) { return all[k]; })
        .sort(function (a, b) { return b.at - a.at; }).slice(0, 50);

      // Hồ sơ (tên/lớp/định hướng): chỉ lấy của khách khi hồ sơ đích còn trống
      if (khach.profile && (!dich.profile || !dich.profile.grade)) dich.profile = khach.profile;
      if (khach.settings && !dich.settings) dich.settings = khach.settings;
      try { localStorage.setItem(keyDich, JSON.stringify(dich)); } catch (e) {}
    }
    if (gamKhach) {
      var gamDich = docJson(keyGamDich);
      if (!gamDich || (Number(gamKhach.xp) || 0) > (Number(gamDich.xp) || 0)) {
        try { localStorage.setItem(keyGamDich, JSON.stringify(gamKhach)); } catch (e) {}
      }
    }
    localStorage.removeItem(KEY_DATA);
    localStorage.removeItem(KEY_GAM);
  }

  /* Mời đăng nhập — gọi SAU khi người học vừa làm xong việc gì đó (học xong một
     bài, nộp xong một bài luyện), không bao giờ chặn giữa đường.
     Tiết chế: bỏ qua mốc đầu (để họ trải nghiệm đã), sau đó thưa dần, tối thiểu
     12 giờ một lần, và ai đã từ chối 5 lần thì thôi không mời nữa. */
  function moiDangNhap(lyDo) {
    if (!laKhach()) return;
    var m = docJson(KEY_MOI) || { moc: 0, lanCuoi: 0, tuChoi: 0 };
    m.moc++;
    var duXa = Date.now() - (m.lanCuoi || 0) > 12 * 3600 * 1000;
    var denLuot = m.moc === 2 || (m.moc > 2 && (m.moc - 2) % 5 === 0);
    var hien = denLuot && duXa && (m.tuChoi || 0) < 5;
    if (hien) m.lanCuoi = Date.now();
    try { localStorage.setItem(KEY_MOI, JSON.stringify(m)); } catch (e) {}
    if (!hien || typeof confirmBox !== "function") return;

    var soBai = ((typeof State !== "undefined" && State.learned) || []).length;
    var soLuot = ((typeof State !== "undefined" && State.history) || []).length;
    var da = [];
    if (soBai) da.push("học xong " + soBai + " bài");
    if (soLuot) da.push("làm " + soLuot + " lượt luyện tập");
    var xp = (docJson(KEY_GAM) || {}).xp || 0;
    if (xp) da.push("gom được " + xp + " XP");

    confirmBox(
      lyDo === "hoc" ? "Giữ lại tiến độ học nhé?" : "Lưu kết quả này nhé?",
      (da.length ? "Bạn đã " + da.join(", ") + ". " : "") +
      "Tiến độ đang chỉ nằm trên máy này — xoá lịch sử trình duyệt hoặc đổi sang điện thoại là mất. " +
      "Tạo tài khoản (miễn phí, chỉ cần email) để giữ lại và học tiếp ở bất kỳ máy nào.",
      "Tạo tài khoản / Đăng nhập", "Để sau"
    ).then(function (ok) {
      if (ok) { if (typeof go === "function") go("account"); return; }
      var m2 = docJson(KEY_MOI) || m;
      m2.tuChoi = (m2.tuChoi || 0) + 1;
      try { localStorage.setItem(KEY_MOI, JSON.stringify(m2)); } catch (e) {}
    });
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
  /* Ảnh đại diện lấy từ profile.js để thống nhất với nhân vật đã chọn */
  function avatarCua(p) {
    return (typeof profileAvatar === "function") ? profileAvatar(p)
      : (p.gender === "nam" ? "👦" : p.gender === "nu" ? "👧" : "🧑‍🎓");
  }
  function esc2(s) { return (typeof esc === "function") ? esc(s) : String(s == null ? "" : s); }

  /* Nhãn ngắn cho gói đang dùng — dùng lại đúng logic renderAccount() (dòng
     "Đang dùng") để khỏi hai chỗ nói khác nhau, ví dụ khối này bảo "Premium"
     mà trang Tài khoản lại bảo "Miễn phí". */
  function nhanGoi() {
    var plan = Account.plan || { tier: "free" };
    if (plan.tier !== "paid") return "Miễn phí";
    var hanTxt = plan.hetHan ? new Date(plan.hetHan).toLocaleDateString("vi-VN") : "";
    var theoVaiTro = plan.nguon === "vaiTro";
    return "Premium" + (hanTxt ? " — đến " + hanTxt : theoVaiTro ? " (theo vai trò quản lí)" : "");
  }

  /* ================== KHỐI AVATAR / MENU TÀI KHOẢN Ở THANH TRÊN ==================
     Đổ avatar, tên, gói và nút đăng xuất vào #umTrigger/#umMenu (index.html).
     Gọi lại MỖI KHI hồ sơ đổi (xem onSaved) chứ không chỉ một lần lúc vào app,
     vì sửa tên/ảnh đại diện ở trang Hồ sơ không tải lại trang — mọi nơi KHÁC
     đổi trạng thái đăng nhập (đăng nhập, đổi hồ sơ, tạo hồ sơ, đăng xuất) đều
     kết thúc bằng location.reload() nên tự nhiên vẽ lại từ đầu. */
  function veUserMenu() {
    var trig = document.getElementById("umTrigger");
    if (!trig) return;   // trang không có khối này thì thôi, đừng vỡ
    var p = (typeof getProfile === "function") ? getProfile() : { name: "" };
    var avaHtml = avatarCua(p);
    var ten = p.name || (Account.user && Account.user.name) ||
      (Account.user && Account.user.email ? Account.user.email.split("@")[0] : "Khách");

    var umAvatar = document.getElementById("umAvatar"), umHeadAva = document.getElementById("umHeadAvatar");
    if (umAvatar) umAvatar.innerHTML = avaHtml;
    if (umHeadAva) umHeadAva.innerHTML = avaHtml;
    var umName = document.getElementById("umName"), umHeadName = document.getElementById("umHeadName");
    if (umName) umName.textContent = ten;
    if (umHeadName) umHeadName.textContent = ten;

    var sub = document.getElementById("umHeadSub");
    if (sub) {
      if (Account.user) {
        var laPre = !!(Account.plan && Account.plan.tier === "paid");
        sub.innerHTML = '<span class="um-email">' + esc2(Account.user.email || "") + "</span>" +
          '<span class="um-plan' + (laPre ? " um-plan-pre" : "") + '">' + esc2(nhanGoi()) + "</span>";
      } else {
        sub.textContent = "Chế độ khách — tiến độ lưu trên máy này";
      }
    }

    var out = document.getElementById("umAuthBtn"), sep = document.getElementById("umSepOut");
    var doi = document.getElementById("umSwitchBtn");
    if (out) { out.hidden = !Account.user; out.onclick = dangXuat; }
    if (sep) sep.hidden = !Account.user;
    // "Đổi hồ sơ": khách chưa có tài khoản thì không có gì để đổi.
    if (doi) doi.hidden = !Account.user;
  }

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
        '<p class="ac-note" style="margin-top:14px;text-align:center">' +
          (isReg ? "Tạo tài khoản nghĩa là bạn đồng ý với " : "") +
          '<a href="/quyen-rieng-tu#dieu-khoan" target="_blank" rel="noopener">Điều khoản sử dụng</a> và ' +
          '<a href="/quyen-rieng-tu" target="_blank" rel="noopener">Quyền riêng tư</a>.' +
          (isReg ? " Người học dưới 18 tuổi nên nhờ cha mẹ tạo tài khoản." : "") +
        "</p>" +
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
    var toiDa = Account.maxProfiles || 1;
    var them = Account.profiles.length < toiDa
      ? '<button class="hs-card hs-them" id="hsThem"><span class="hs-ava">+</span><span class="hs-ten">Thêm hồ sơ</span></button>'
      : (toiDa <= 1
        ? '<button class="hs-card hs-them" id="hsThemKhoa"><span class="hs-ava">' + ico("lock", "#b45309", 22) + '</span><span class="hs-ten">Thêm hồ sơ<br><small style="font-weight:600;color:var(--text-soft)">Premium</small></span></button>'
        : "");
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
    var themKhoa = document.getElementById("hsThemKhoa");
    if (themKhoa) themKhoa.onclick = function () {
      if (typeof Plan !== "undefined") Plan.upsell("hoso");
    };
    document.getElementById("hsOut").onclick = function () { dangXuat(); };
  }

  /* Mở màn tạo hồ sơ (form đầy đủ trong profile.js) thay cho hộp prompt của trình duyệt */
  function themHoSo() {
    if (typeof renderProfileNew === "function") renderProfileNew();
  }
  /* profile.js gọi lại khi người dùng bấm "Tạo hồ sơ" */
  function taoHoSo(data) {
    return api("/profiles", "POST", data).then(function (d) {
      Account.profiles.push(d.profile);
      chonHoSo(d.profile.id);        // vào học bằng hồ sơ vừa tạo
      return d.profile;
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
    var toiDa = Account.maxProfiles || 1;
    var plan = Account.plan || { tier: "free" };
    var laPaid = plan.tier === "paid";
    var hanTxt = plan.hetHan ? new Date(plan.hetHan).toLocaleDateString("vi-VN") : "";
    /* Còn mấy ngày nữa hết hạn — con số này mới là thứ người ta muốn biết, đọc
       ngày tháng rồi tự trừ nhẩm thì phiền. Dưới 30 ngày mới nhắc, để bình
       thường không làm phiền. */
    var conNgay = plan.hetHan
      ? Math.ceil((new Date(plan.hetHan).getTime() - Date.now()) / 86400000) : null;
    var sapHet = conNgay != null && conNgay <= 30;
    /* nguon='vaiTro': quyền đến từ vai trò admin/giáo viên chứ không phải mã đã
       mua. Nói rõ ra, kẻo thử luồng mua bằng tài khoản admin lại tưởng đã mua
       thành công trong khi webhook chưa hề chạy. */
    var theoVaiTro = plan.nguon === "vaiTro";
    var goiHtml =
      '<div class="section-title">' + ico("crown", "#b45309", 17) + " Gói của bạn</div>" +
      '<div class="pf-card" style="margin-bottom:20px">' +
        '<div class="ac-row" style="border-bottom:none"><span>Đang dùng</span><b>' +
          (laPaid
            ? "Premium" + (hanTxt ? " — đến " + hanTxt : theoVaiTro ? " (theo vai trò quản lí)" : "")
            : "Miễn phí") + "</b></div>" +
        (laPaid && hanTxt
          ? '<div class="ac-row" style="border-bottom:none"><span>Còn lại</span><b' +
            (sapHet ? ' style="color:var(--warning)"' : "") + ">" +
            (conNgay > 0 ? conNgay + " ngày" : "hết hạn hôm nay") + "</b></div>"
          : "") +
        (laPaid
          ? '<p class="ac-note" style="margin:4px 0 0">' +
            (sapHet ? "<b>Sắp hết hạn</b> — gia hạn ngay để không gián đoạn. " : "") +
            "Nhập thêm mã hoặc gia hạn sẽ <b>cộng dồn</b> vào hạn hiện có.</p>"
          : '<p class="ac-note" style="margin:4px 0 0">Premium mở: luyện tập không giới hạn · 13 đề thi thử + đề ngẫu nhiên · toàn bộ bài thực hành · tab Chỗ yếu · gia sư AI 25 lượt/ngày · 3 hồ sơ học tập.</p>') +
        /* Mua thẳng ở đây khi máy chủ đã bật thanh toán tự động: quét QR, tiền
           vào là gói mở trong vài giây, không phải nhắn Zalo chờ mã.
           Dựng sẵn nhưng ẩn: cấu hình thanh toán về sau lần vẽ đầu (fetch async),
           nếu chờ nó rồi mới vẽ thì nút không bao giờ kịp xuất hiện. */
        '<div id="acMuaBox" hidden>' +
          '<div class="ac-actions" style="margin-top:14px">' +
            '<button class="btn btn-primary" id="acMua">' + ico("crown", null, 15) + " " +
            (laPaid ? "Gia hạn — quét mã là xong" : "Mua Premium — quét mã là xong") + "</button>" +
          "</div>" +
          '<p class="ac-note" style="margin:6px 0 0">Quét bằng app ngân hàng bất kỳ, nội dung chuyển khoản điền sẵn. ' +
          "Tiền vào là gói mở ngay.</p>" +
        "</div>" +
        '<div class="pf-field" style="margin-top:12px"><label for="acLic">Hoặc nhập mã kích hoạt (mẫu: TIN-XXXX-XXXX)</label>' +
          '<div style="display:flex;gap:8px"><input class="pf-input" id="acLic" type="text" maxlength="16" placeholder="TIN-" style="flex:1;text-transform:uppercase" autocomplete="off">' +
          '<button class="btn btn-primary" id="acLicGo">Kích hoạt</button></div></div>' +
        '<div class="ac-err" id="acLicErr"></div>' +
        (laPaid ? "" : '<p class="ac-note" style="margin:6px 0 0">Chưa có mã? ' +
          '<a href="/nang-cap" target="_blank" rel="noopener"><b>Xem giá &amp; cách mua</b> — 249.000đ/năm học</a>, ' +
          'hoặc nhận mã từ giáo viên của bạn.</p>') +
      "</div>";
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

      goiHtml +

      '<div class="section-title">' + ico("user", "#4f46e5", 17) + " Hồ sơ học tập (" + Account.profiles.length + "/" + toiDa + ")</div>" +
      '<div class="pf-card">' + hs +
        (Account.profiles.length < toiDa
          ? '<div class="ac-actions"><button class="btn btn-primary" id="acAdd">' + ico("user", null, 15) + " Thêm hồ sơ</button></div>"
          : (toiDa <= 1
            ? '<p class="ac-note">Gói Miễn phí dùng 1 hồ sơ học tập. <b>Premium</b> mở 3 hồ sơ — anh chị em dùng chung tài khoản, tiến độ vẫn riêng.</p>'
            : '<p class="ac-note">Đã đủ ' + toiDa + " hồ sơ — xoá bớt nếu muốn thêm người học mới.</p>")) +
      "</div>" +

      /* Thẻ "Nhắc học" dựng sau (js/nhac.js phải hỏi máy chủ + trình duyệt mới
         biết hiện gì), nên chừa sẵn chỗ đúng vị trí rồi điền vào. */
      '<div id="nhacHop"></div>' +

      '<div class="section-title" style="margin-top:22px">' + ico("bookmark", "#64748b", 17) + " Dữ liệu của bạn</div>" +
      '<div class="pf-card">' +
        '<p class="ac-note" style="margin:0 0 10px">Xem ứng dụng lưu những gì và vì sao: ' +
          '<a href="/quyen-rieng-tu" target="_blank" rel="noopener">Quyền riêng tư</a> · ' +
          '<a href="/quyen-rieng-tu#dieu-khoan" target="_blank" rel="noopener">Điều khoản sử dụng</a></p>' +
        '<div class="ac-actions"><button class="btn btn-ghost danger-text" id="acDelAcc">Xoá tài khoản</button></div>' +
        '<p class="ac-note" style="margin:8px 0 0">Xoá tài khoản là xoá hẳn mọi hồ sơ, kết quả học và nhật ký hỏi gia sư — <b>không lấy lại được</b>.</p>' +
      "</div>";

    if (typeof iconify === "function") iconify(app);
    /* Nhắc học: trạng thái phụ thuộc quyền thông báo + cấu hình máy chủ nên chỉ
       biết được sau một lượt hỏi bất đồng bộ. Vẽ xong mới điền vào ô đã chừa. */
    if (window.Nhac) {
      Nhac.trangThai().then(function (tt) {
        var hop = document.getElementById("nhacHop");
        if (!hop) return;                       // người dùng đã rời trang
        hop.innerHTML = Nhac.theHtml(tt);
        Nhac.ganSuKien(renderAccount);
      });
    }
    document.getElementById("acBack").onclick = function () { if (typeof go === "function") go("home"); };
    document.getElementById("acSync").onclick = function () {
      var b = document.getElementById("acSync"); b.disabled = true;
      fullSync().then(function () { if (typeof toast === "function") toast("Đã đồng bộ ✓"); renderAccount(); });
    };
    document.getElementById("acOut").onclick = dangXuat;
    var muaBtn = document.getElementById("acMua");
    if (muaBtn && typeof Pay !== "undefined") {
      muaBtn.onclick = function () { Pay.batDau("nam"); };
      Pay.napCauHinh().then(function (cfg) {
        var hop = document.getElementById("acMuaBox");
        if (hop) hop.hidden = !cfg.on;
      });
    }
    var licGo = document.getElementById("acLicGo");
    if (licGo) licGo.onclick = function () {
      var inp = document.getElementById("acLic"), err = document.getElementById("acLicErr");
      err.textContent = ""; licGo.disabled = true;
      api("/licenses/activate", "POST", { code: inp.value }).then(function (d) {
        var han = d.plan && d.plan.hetHan ? new Date(d.plan.hetHan).toLocaleDateString("vi-VN") : "";
        if (typeof toast === "function") {
          toast(d.daTung ? "Mã này bạn đã kích hoạt từ trước ✓" : "Đã lên Premium" + (han ? " — dùng đến " + han : "") + " ✓");
        }
        // nạp lại trang để mọi khoá (đề, xưởng, quỹ câu, gia sư) mở theo gói mới
        setTimeout(function () { location.reload(); }, 900);
      }).catch(function (e) {
        err.textContent = e.network ? "Không kết nối được máy chủ." : e.message;
        licGo.disabled = false;
      });
    };
    var add = document.getElementById("acAdd");
    if (add) add.onclick = themHoSo;
    app.querySelectorAll("[data-doi]").forEach(function (b) {
      b.onclick = function () { chonHoSo(Number(b.dataset.doi)); };
    });
    app.querySelectorAll("[data-sua]").forEach(function (b) {
      b.onclick = function () { if (typeof go === "function") go("profile"); };
    });
    document.getElementById("acDelAcc").onclick = xoaTaiKhoan;
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

  /* Xoá hẳn tài khoản. Không dùng hộp xác nhận thường vì việc này không lấy lại
     được — bắt gõ lại mật khẩu ngay tại chỗ, máy chủ kiểm lần nữa. */
  function xoaTaiKhoan() {
    var nut = document.getElementById("acDelAcc");
    if (!nut || nut.dataset.mo === "1") return;
    nut.dataset.mo = "1";
    nut.disabled = true;
    var o = document.createElement("div");
    o.style.marginTop = "10px";
    o.innerHTML =
      '<div class="pf-field"><label for="acDelPass">Nhập mật khẩu để xác nhận xoá tài khoản</label>' +
        '<input class="pf-input" id="acDelPass" type="password" autocomplete="current-password"></div>' +
      '<div class="ac-actions">' +
        '<button class="btn btn-ghost" id="acDelHuy">Thôi, giữ lại</button>' +
        '<button class="btn btn-danger" id="acDelOk">Xoá vĩnh viễn</button>' +
      "</div>" +
      '<div class="ac-err" id="acDelErr"></div>';
    nut.parentNode.parentNode.appendChild(o);
    var pass = o.querySelector("#acDelPass");
    pass.focus();
    o.querySelector("#acDelHuy").onclick = function () { o.remove(); nut.disabled = false; nut.dataset.mo = ""; };
    o.querySelector("#acDelOk").onclick = function () {
      var err = o.querySelector("#acDelErr");
      err.textContent = "";
      api("/auth/account", "DELETE", { password: pass.value }).then(function () {
        Account.profiles.forEach(function (p) {
          localStorage.removeItem("tinhoc_thpt_v1:" + p.id);
          localStorage.removeItem("tinhoc_gam_v1:" + p.id);
        });
        localStorage.removeItem(KEY_PROFILE);
        location.href = "index.html";
      }).catch(function (e) { err.textContent = e.message; });
    };
  }

  Account.boot = boot;
  Account.onSaved = onSaved;
  Account.fullSync = fullSync;
  Account.renderGate = renderGate;
  Account.renderProfilePicker = renderProfilePicker;
  Account.hoSoHienTai = hoSoHienTai;
  Account.taoHoSo = taoHoSo;
  Account.themHoSo = themHoSo;
  Account.laKhach = laKhach;
  Account.moiDangNhap = moiDangNhap;
  Account.gopDuLieuKhach = gopDuLieuKhach;
  Account.veUserMenu = veUserMenu;
  window.Account = Account;
  window.renderAccount = renderAccount;
})();
