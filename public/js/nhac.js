/* ============================================================================
 *  NHẮC HỌC — phía trình duyệt
 *
 *  Chuỗi ngày học giữ chân người tự học, mà chuỗi đứt phần lớn chỉ vì QUÊN.
 *  Không ai mở app để nhớ rằng mình cần mở app — nên phải có người nhắc.
 *
 *  Ba ràng buộc của trình duyệt, phải chiều cả ba:
 *   1. Chỉ được xin quyền thông báo NGAY SAU một thao tác của người dùng. Xin
 *      lúc vừa mở app thì hầu hết bấm "Chặn", mà chặn rồi là VĨNH VIỄN không
 *      hỏi lại được nữa — phải tự vào cài đặt trình duyệt mở lại. Vì vậy chỉ
 *      mời sau khi đã học thật vài lần (Nhac.dungThat() do app.js gọi).
 *   2. iPhone/iPad chỉ cho phép thông báo đẩy khi trang ĐÃ ĐƯỢC CÀI ra màn
 *      hình chính. Chưa cài thì mời cài trước (js/pwa.js), đừng xin quyền để
 *      rồi báo lỗi.
 *   3. Đăng ký gắn với TÀI KHOẢN ở máy chủ nên phải đăng nhập trước.
 * ==========================================================================*/
(function () {
  var KEY = "tinhoc_nhac_v1";     /* {moc, tuChoi, lanCuoi, gio} */
  var MOC_MOI = 3;                /* học thật 3 lần rồi mới mời — sau lời mời cài app */
  var HOI_LAI = 10 * 24 * 3600 * 1000;
  var TOI_DA_TU_CHOI = 2;
  var GIO_MAC_DINH = 19;

  function doc() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function ghi(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  var cauHinh = null;             /* {bat, publicKey} — hỏi máy chủ một lần */
  function napCauHinh() {
    if (cauHinh) return Promise.resolve(cauHinh);
    return fetch("/api/nhac/config", { credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (d) { cauHinh = d || { bat: false }; return cauHinh; })
      .catch(function () { cauHinh = { bat: false }; return cauHinh; });
  }

  /* Khoá công khai đi trên dây dưới dạng base64url, còn pushManager đòi mảng byte. */
  function khoaSangByte(b64) {
    var chuan = (b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(chuan);
    var m = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) m[i] = raw.charCodeAt(i);
    return m;
  }
  function byteSangB64(buf) {
    if (!buf) return "";
    var b = new Uint8Array(buf), s = "";
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function hoTro() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  }
  /* iPhone chưa cài ra màn hình chính thì Safari không cho đăng ký đẩy. */
  function canCaiTruoc() {
    return !!(window.Pwa && Pwa.laIOS() && !Pwa.laDaCai());
  }
  function daDangNhap() { return !!(window.Account && Account.user); }

  function layDangKy() {
    if (!hoTro()) return Promise.resolve(null);
    return navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); })
      .catch(function () { return null; });
  }

  /* Trạng thái để giao diện biết hiện gì:
       'khong'    – trình duyệt/máy chủ không hỗ trợ
       'caiTruoc' – iPhone, phải cài ra màn hình chính đã
       'dangNhap' – chưa đăng nhập
       'chan'     – người dùng đã chặn thông báo trong trình duyệt
       'tat'      – dùng được nhưng chưa bật
       'bat'      – đang bật  */
  function trangThai() {
    return napCauHinh().then(function (c) {
      if (!hoTro() || !c.bat) return "khong";
      if (canCaiTruoc()) return "caiTruoc";
      if (!daDangNhap()) return "dangNhap";
      if (Notification.permission === "denied") return "chan";
      return layDangKy().then(function (s) { return s ? "bat" : "tat"; });
    });
  }

  function bat(gio) {
    return napCauHinh().then(function (c) {
      if (!c.bat || !hoTro()) throw new Error("Trình duyệt hoặc máy chủ chưa hỗ trợ nhắc học.");
      if (canCaiTruoc()) throw new Error("Trên iPhone cần thêm app ra màn hình chính trước rồi mới bật được nhắc học.");
      if (!daDangNhap()) throw new Error("Hãy đăng nhập để nhắc học theo đúng tiến độ của bạn.");
      return Notification.requestPermission();
    }).then(function (quyen) {
      if (quyen !== "granted") throw new Error("Bạn chưa cho phép hiện thông báo.");
      return navigator.serviceWorker.ready;
    }).then(function (reg) {
      return reg.pushManager.getSubscription().then(function (cu) {
        return cu || reg.pushManager.subscribe({
          userVisibleOnly: true,                        /* bắt buộc: mỗi bản tin phải hiện một thông báo */
          applicationServerKey: khoaSangByte(cauHinh.publicKey),
        });
      });
    }).then(function (sub) {
      var k = sub.toJSON().keys || {};
      return fetch("/api/nhac/dangky", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: k.p256dh || byteSangB64(sub.getKey && sub.getKey("p256dh")),
          auth: k.auth || byteSangB64(sub.getKey && sub.getKey("auth")),
          gio: gio == null ? (doc().gio || GIO_MAC_DINH) : gio,
          profileId: (window.Account && Account.profileId) || null,
        }),
      }).then(function (r) {
        if (!r.ok) return r.json().catch(function () { return {}; }).then(function (d) {
          throw new Error(d.error || "Máy chủ từ chối đăng ký nhắc học.");
        });
        return r.json();
      });
    }).then(function (d) {
      var o = doc(); o.gio = d.gio; o.tuChoi = 0; ghi(o);
      return d;
    });
  }

  function tat() {
    return layDangKy().then(function (sub) {
      if (!sub) return null;
      return fetch("/api/nhac/tat", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      }).catch(function () {}).then(function () { return sub.unsubscribe(); });
    });
  }

  function thu() {
    return layDangKy().then(function (sub) {
      if (!sub) throw new Error("Thiết bị này chưa bật nhắc học.");
      return fetch("/api/nhac/thu", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      }).then(function (r) {
        if (!r.ok) return r.json().catch(function () { return {}; }).then(function (d) {
          throw new Error(d.error || "Không gửi thử được.");
        });
      });
    });
  }

  /* ---------------------------- thanh mời bật ---------------------------- */
  function css() {
    if (document.getElementById("nhacCss")) return;
    var st = document.createElement("style");
    st.id = "nhacCss";
    st.textContent =
      "#nhacBar{position:fixed;left:12px;right:12px;bottom:12px;z-index:1240;display:flex;align-items:center;gap:12px;" +
        "background:var(--bg-card,#fff);border:1px solid var(--border,#e2e8f0);border-radius:16px;padding:13px 15px;" +
        "box-shadow:0 10px 30px rgba(15,23,42,.18);max-width:520px;margin:0 auto}" +
      "#nhacBar .nhac-ic{font-size:26px;flex:none;line-height:1}" +
      "#nhacBar .nhac-txt{flex:1;min-width:0}" +
      "#nhacBar b{display:block;font-size:14.5px;color:var(--text,#0f172a);line-height:1.3}" +
      "#nhacBar small{display:block;font-size:12.5px;color:var(--text-soft,#64748b);line-height:1.45;margin-top:2px}" +
      "#nhacBar .nhac-nut{display:flex;gap:7px;flex:none}" +
      "#nhacBar button{font-family:inherit;font-size:13.5px;font-weight:700;border-radius:10px;padding:9px 13px;cursor:pointer;border:1px solid var(--border,#e2e8f0);background:transparent;color:var(--text-soft,#64748b)}" +
      "#nhacBar button.nhac-ok{background:var(--primary,#4f46e5);border-color:var(--primary,#4f46e5);color:#fff}" +
      ".nhac-hang{display:flex;align-items:center;gap:10px;flex-wrap:wrap}" +
      ".nhac-hang select{font-family:inherit;font-size:14px;padding:8px 10px;border-radius:10px;border:1px solid var(--border,#e2e8f0);background:var(--bg-card,#fff);color:var(--text,#0f172a)}" +
      "@media(max-width:420px){#nhacBar{flex-wrap:wrap}#nhacBar .nhac-nut{width:100%}#nhacBar .nhac-nut button{flex:1}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function dongThanh(tuChoi) {
    var b = document.getElementById("nhacBar");
    if (b) b.remove();
    if (tuChoi) { var o = doc(); o.tuChoi = (o.tuChoi || 0) + 1; o.lanCuoi = Date.now(); ghi(o); }
  }

  function hienThanh() {
    if (document.getElementById("nhacBar") || document.getElementById("pwaBar")) return;
    css();
    var bar = document.createElement("div");
    bar.id = "nhacBar";
    bar.innerHTML =
      '<span class="nhac-ic">🔔</span>' +
      '<div class="nhac-txt"><b>Nhắc bạn học mỗi tối?</b>' +
      "<small>Một lời nhắc lúc 19h vào đúng ngày có lịch học — để chuỗi không đứt vì quên.</small></div>" +
      '<div class="nhac-nut"><button class="nhac-ok" id="nhacBat">Bật</button><button id="nhacThoi">Để sau</button></div>';
    document.body.appendChild(bar);
    document.getElementById("nhacThoi").onclick = function () { dongThanh(true); };
    document.getElementById("nhacBat").onclick = function () {
      var nut = document.getElementById("nhacBat");
      nut.disabled = true; nut.textContent = "Đang bật…";
      bat().then(function () {
        dongThanh(false);
        if (window.toast) toast("Đã bật nhắc học lúc 19h 🔔");
      }).catch(function (e) {
        dongThanh(false);
        if (window.toast) toast(e.message || "Chưa bật được nhắc học");
      });
    };
  }

  function nenMoi() {
    var o = doc();
    if ((o.moc || 0) < MOC_MOI) return false;
    if ((o.tuChoi || 0) >= TOI_DA_TU_CHOI) return false;
    if (o.lanCuoi && Date.now() - o.lanCuoi < HOI_LAI) return false;
    return true;
  }

  /* ------------------------- thẻ trong trang Tài khoản ------------------------- */
  var GIO_CHON = [6, 7, 8, 12, 17, 18, 19, 20, 21, 22];
  function theHtml(tt) {
    var gio = doc().gio || GIO_MAC_DINH;
    if (tt === "khong") return "";     /* không hỗ trợ thì đừng bày ra cho rối */
    var than;
    if (tt === "caiTruoc") {
      than = '<p class="ac-note" style="margin:0">Trên iPhone/iPad, hãy bấm <b>Chia sẻ → Thêm vào MH chính</b> ' +
        "để cài app ra màn hình chính; sau đó mở app từ đó là bật được nhắc học.</p>";
    } else if (tt === "dangNhap") {
      than = '<p class="ac-note" style="margin:0">Đăng nhập rồi bật, để lời nhắc bám đúng lịch học và chuỗi của bạn.</p>';
    } else if (tt === "chan") {
      than = '<p class="ac-note" style="margin:0">Trình duyệt đang <b>chặn thông báo</b> của trang này. ' +
        "Mở cài đặt trang trong trình duyệt (biểu tượng ổ khoá cạnh địa chỉ) và cho phép Thông báo, rồi quay lại bật.</p>";
    } else if (tt === "bat") {
      than =
        '<div class="nhac-hang"><span>Nhắc lúc</span>' +
          '<select id="nhacGio">' + GIO_CHON.map(function (g) {
            return '<option value="' + g + '"' + (g === gio ? " selected" : "") + ">" + g + ":00</option>";
          }).join("") + "</select>" +
          '<button class="btn btn-ghost" id="nhacThu">Gửi thử</button>' +
          '<button class="btn btn-ghost danger-text" id="nhacTat">Tắt nhắc</button>' +
        "</div>" +
        '<p class="ac-note" style="margin:8px 0 0">Chỉ nhắc vào ngày có trong lịch học của hồ sơ, và bỏ qua nếu hôm đó bạn đã học rồi.</p>';
    } else {
      than =
        '<div class="nhac-hang"><span>Nhắc lúc</span>' +
          '<select id="nhacGio">' + GIO_CHON.map(function (g) {
            return '<option value="' + g + '"' + (g === gio ? " selected" : "") + ">" + g + ":00</option>";
          }).join("") + "</select>" +
          '<button class="btn btn-primary" id="nhacBatCard">Bật nhắc học</button>' +
        "</div>" +
        '<p class="ac-note" style="margin:8px 0 0">Một lời nhắc mỗi ngày có lịch học. Tắt lúc nào cũng được.</p>';
    }
    return '<div class="section-title" style="margin-top:22px">🔔 Nhắc học</div>' +
      '<div class="pf-card" id="nhacThe">' + than + '<div class="ac-err" id="nhacErr"></div></div>';
  }

  function ganSuKien(veLai) {
    var loi = document.getElementById("nhacErr");
    var bao = function (e) { if (loi) loi.textContent = e && e.message ? e.message : ""; };
    var gioEl = document.getElementById("nhacGio");
    var batEl = document.getElementById("nhacBatCard");
    if (batEl) batEl.onclick = function () {
      batEl.disabled = true; bao(null);
      bat(gioEl ? Number(gioEl.value) : null)
        .then(function () { veLai(); })
        .catch(function (e) { batEl.disabled = false; bao(e); });
    };
    var tatEl = document.getElementById("nhacTat");
    if (tatEl) tatEl.onclick = function () { tatEl.disabled = true; tat().then(veLai); };
    var thuEl = document.getElementById("nhacThu");
    if (thuEl) thuEl.onclick = function () {
      thuEl.disabled = true; thuEl.textContent = "Đang gửi…"; bao(null);
      thu().then(function () { thuEl.textContent = "Đã gửi — chờ vài giây"; })
        .catch(function (e) { thuEl.disabled = false; thuEl.textContent = "Gửi thử"; bao(e); });
    };
    /* Đổi giờ khi đang bật: đăng ký lại chính endpoint đó, máy chủ ghi đè giờ. */
    if (gioEl && document.getElementById("nhacTat")) gioEl.onchange = function () {
      bao(null);
      bat(Number(gioEl.value)).catch(bao);
    };
  }

  window.Nhac = {
    trangThai: trangThai,
    bat: bat,
    tat: tat,
    thu: thu,
    /* account.js gọi: trả HTML rồi gắn sự kiện sau khi đã cắm vào DOM. */
    theHtml: theHtml,
    ganSuKien: ganSuKien,
    dungThat: function () {
      var o = doc();
      o.moc = (o.moc || 0) + 1;
      ghi(o);
      if (!nenMoi()) return;
      trangThai().then(function (tt) {
        if (tt === "tat") setTimeout(hienThanh, 1500);   /* nhường hiệu ứng chúc mừng chạy trước */
      });
    },
  };
})();
