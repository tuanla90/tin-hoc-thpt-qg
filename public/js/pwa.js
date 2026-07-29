/* ============================================================================
 *  CÀI APP RA MÀN HÌNH CHÍNH (PWA)
 *
 *  Hai việc: đăng ký service worker (js/../sw.js) và mời cài đặt đúng lúc.
 *
 *  Vì sao đáng làm: học sinh mở app qua trình duyệt thì phải nhớ địa chỉ, gõ
 *  lại mỗi lần — cài ra màn hình chính thì nó nằm cạnh các app khác, mở một
 *  chạm. Trên iPhone còn là ĐIỀU KIỆN BẮT BUỘC để nhận được nhắc học: Safari
 *  chỉ cho phép thông báo đẩy khi trang đã được thêm vào màn hình chính.
 *
 *  Mời cài lúc nào: KHÔNG mời ngay khi vừa mở lần đầu — lúc đó người ta chưa
 *  biết app có gì, hỏi cài là bị từ chối và trình duyệt sẽ không hỏi lại nữa.
 *  Đợi có dấu hiệu thật sự dùng (Pwa.dungThat() do app.js gọi sau khi học xong
 *  bài / làm xong bài luyện) rồi mới hiện thanh mời.
 * ==========================================================================*/
(function () {
  var KEY = "tinhoc_pwa_v1";     /* {tuChoi: số lần bấm "Để sau", lanCuoi: mốc thời gian, moc: số lần dùng thật} */
  var HOI_LAI = 7 * 24 * 3600 * 1000;   /* từ chối rồi thì một tuần sau mới hỏi lại */
  var MOC_MOI = 2;               /* dùng thật đủ 2 lần mới mời */
  var TOI_DA_TU_CHOI = 3;

  function doc() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function ghi(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  var sukien = null;             /* beforeinstallprompt đã bắt được (Chrome/Edge/Android) */
  var dangHien = false;

  function laDaCai() {
    return window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
  }
  function laIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      /* iPad từ iOS 13 khai là Macintosh, phân biệt bằng cảm ứng */
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function laSafari() {
    return /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios|edgios/i.test(navigator.userAgent);
  }

  /* ------------------------------- thanh mời ------------------------------- */
  function css() {
    if (document.getElementById("pwaCss")) return;
    var st = document.createElement("style");
    st.id = "pwaCss";
    st.textContent =
      "#pwaBar{position:fixed;left:12px;right:12px;bottom:12px;z-index:1250;display:flex;align-items:center;gap:12px;" +
        "background:var(--bg-card,#fff);border:1px solid var(--border,#e2e8f0);border-radius:16px;padding:13px 15px;" +
        "box-shadow:0 10px 30px rgba(15,23,42,.18);max-width:520px;margin:0 auto;animation:pwaLen .35s ease}" +
      "@keyframes pwaLen{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}" +
      "#pwaBar img{width:44px;height:44px;flex:none;border-radius:11px}" +
      "#pwaBar .pwa-txt{flex:1;min-width:0}" +
      "#pwaBar b{display:block;font-size:14.5px;color:var(--text,#0f172a);line-height:1.3}" +
      "#pwaBar small{display:block;font-size:12.5px;color:var(--text-soft,#64748b);line-height:1.45;margin-top:2px}" +
      "#pwaBar .pwa-nut{display:flex;gap:7px;flex:none}" +
      "#pwaBar button{font-family:inherit;font-size:13.5px;font-weight:700;border-radius:10px;padding:9px 13px;cursor:pointer;border:1px solid var(--border,#e2e8f0);background:transparent;color:var(--text-soft,#64748b)}" +
      "#pwaBar button.pwa-ok{background:var(--primary,#4f46e5);border-color:var(--primary,#4f46e5);color:#fff}" +
      "@media(max-width:420px){#pwaBar{flex-wrap:wrap}#pwaBar .pwa-nut{width:100%}#pwaBar .pwa-nut button{flex:1}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function dong(tuChoi) {
    var b = document.getElementById("pwaBar");
    if (b) b.remove();
    dangHien = false;
    if (tuChoi) {
      var o = doc();
      o.tuChoi = (o.tuChoi || 0) + 1;
      o.lanCuoi = Date.now();
      ghi(o);
    }
  }

  function hienThanh() {
    if (dangHien || document.getElementById("pwaBar")) return;
    css();
    dangHien = true;
    var ios = laIOS();
    var bar = document.createElement("div");
    bar.id = "pwaBar";
    bar.innerHTML =
      '<img src="/asset/icon/icon-192.png" alt="">' +
      '<div class="pwa-txt"><b>Cài app ra màn hình chính</b><small>' +
      (ios
        ? 'Bấm nút <b style="display:inline">Chia sẻ</b> ở thanh dưới rồi chọn “Thêm vào MH chính”.'
        : "Mở một chạm như app thường, và học được cả khi mất mạng.") +
      "</small></div>" +
      '<div class="pwa-nut">' +
        (ios ? "" : '<button class="pwa-ok" id="pwaCai">Cài</button>') +
        '<button id="pwaThoi">' + (ios ? "Đã hiểu" : "Để sau") + "</button>" +
      "</div>";
    document.body.appendChild(bar);
    var thoi = document.getElementById("pwaThoi");
    if (thoi) thoi.onclick = function () { dong(true); };
    var cai = document.getElementById("pwaCai");
    if (cai) cai.onclick = function () { Pwa.cai(); };
  }

  /* Đủ điều kiện mời chưa? Tách riêng cho dễ đọc và dễ sửa ngưỡng. */
  function nenMoi() {
    if (laDaCai()) return false;
    var o = doc();
    if ((o.moc || 0) < MOC_MOI) return false;
    if ((o.tuChoi || 0) >= TOI_DA_TU_CHOI) return false;
    if (o.lanCuoi && Date.now() - o.lanCuoi < HOI_LAI) return false;
    /* Android/Chrome: chỉ mời khi trình duyệt đã báo cài được.
       iPhone: không có sự kiện nào cả, phải tự nhận biết Safari. */
    return sukien ? true : (laIOS() && laSafari());
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();          /* giữ lại để tự chọn thời điểm hỏi */
    sukien = e;
    if (nenMoi()) hienThanh();
  });

  window.addEventListener("appinstalled", function () {
    dong(false);
    ghi({ moc: 99, daCai: 1 });
  });

  var Pwa = {
    laDaCai: laDaCai,
    laIOS: laIOS,
    /* Có nút "Cài app" bấm được không (dùng cho trang Hồ sơ). */
    caiDuoc: function () { return !laDaCai() && (!!sukien || (laIOS() && laSafari())); },
    cai: function () {
      if (!sukien) { hienThanh(); return; }     /* iPhone: chỉ hiện được hướng dẫn */
      var e = sukien;
      sukien = null;
      dong(false);
      e.prompt();
    },
    /* app.js gọi sau mỗi lần học xong bài / làm xong bài luyện. */
    dungThat: function () {
      if (laDaCai()) return;
      var o = doc();
      o.moc = (o.moc || 0) + 1;
      ghi(o);
      if (nenMoi()) setTimeout(hienThanh, 1200);   /* để hiệu ứng chúc mừng chạy xong đã */
    },
  };
  window.Pwa = Pwa;

  /* --------------------------- đăng ký service worker --------------------------- */
  /* Chỉ chạy ở nơi có HTTPS (hoặc localhost) — đúng ràng buộc của trình duyệt. */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function (e) {
        console.warn("[pwa] Không đăng ký được service worker:", e && e.message);
      });
    });
  }
})();
