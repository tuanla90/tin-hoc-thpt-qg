/* ============================================================================
 *  SERVICE WORKER — chạy được khi mất mạng + nhận nhắc học
 *
 *  Vì sao cần: học sinh hay học trên điện thoại, mạng 3G chập chờn hoặc hết
 *  dung lượng. Đã mở app một lần thì lần sau vẫn vào học được, không thấy khủng
 *  long mất mạng.
 *
 *  CHIẾN LƯỢC CACHE — cố ý bám theo đúng Cache-Control mà máy chủ đang đặt
 *  (xem server/app.js), để hai bên không nói ngược nhau:
 *    · asset/ và js/vendor/  -> LẤY CACHE TRƯỚC. Ảnh, phông, skulpt (~948KB),
 *      sql-wasm (~692KB): nội dung gắn chặt với tên tệp, gần như không đổi, mà
 *      lại nặng nhất. Máy chủ cho cache 30 ngày.
 *    · mọi thứ còn lại       -> LẤY MẠNG TRƯỚC, hỏng mới lấy cache. Máy chủ đặt
 *      no-cache cho js/css/html vì tên tệp CHƯA có mã băm: deploy xong là phải
 *      thấy bản mới ngay.
 *
 *  KHÔNG lấy-cache-trước cho js/ thường, dù nhanh hơn: các tệp dữ liệu phụ
 *  thuộc lẫn nhau (questions-tinh-huong.js đánh số câu nối tiếp số đã có), trộn
 *  bản cũ với bản mới sẽ sinh câu trùng mã. Nhanh thêm vài trăm mili giây không
 *  đáng đánh đổi bằng dữ liệu sai.
 *
 *  KHÔNG cache /api: dữ liệu tài khoản, tiến độ, thanh toán — trả bản cũ còn
 *  tệ hơn báo lỗi.
 * ==========================================================================*/
var PHIEN_BAN = "tinhoc-v1";
var CACHE = PHIEN_BAN;

/* Vỏ tối thiểu: đủ để mở ra thấy giao diện chứ không phải trang trắng, kể cả
   khi vừa cài xong đã mất mạng. Phần dữ liệu bài học tự vào cache khi dùng. */
var VO = ["/hoc", "/css/styles.css", "/asset/icon/icon-192.png", "/manifest.webmanifest"];

self.addEventListener("install", function (e) {
  /* Một tệp lỗi không được làm hỏng cả lượt cài -> thêm từng tệp, bỏ qua tệp hỏng. */
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(VO.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ds) {
    return Promise.all(ds.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function laBenVung(url) {
  return url.pathname.indexOf("/asset/") === 0 || url.pathname.indexOf("/js/vendor/") === 0;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;          // phông Google… để trình duyệt lo
  if (url.pathname.indexOf("/api/") === 0) return;          // không bao giờ cache API

  /* Ghi vào cache phải bọc trong waitUntil: nếu không, người dùng chuyển trang
     giữa chừng là trình duyệt có quyền dừng service worker trước khi ghi xong,
     và tệp đó lặng lẽ vắng mặt trong cache — offline mới lòi ra thiếu. */
  function luu(res) {
    if (!res || !res.ok || res.type !== "basic") return;
    var ban = res.clone();
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.put(req, ban); }));
  }

  if (laBenVung(url)) {
    e.respondWith(caches.match(req).then(function (co) {
      return co || fetch(req).then(function (res) { luu(res); return res; });
    }));
    return;
  }

  e.respondWith(
    fetch(req).then(function (res) {
      luu(res);
      return res;
    }).catch(function () {
      return caches.match(req).then(function (co) {
        if (co) return co;
        /* Mất mạng mà mở một URL chưa từng vào: trả về vỏ ứng dụng để còn học
           được phần đã tải, thay vì màn hình lỗi của trình duyệt. */
        if (req.mode === "navigate") return caches.match("/hoc");
        return Promise.reject(new Error("offline"));
      });
    })
  );
});

/* ==========================================================================
 *  NHẮC HỌC
 *
 *  Bản tin đẩy cố ý KHÔNG kèm nội dung (xem server/nhac.js), nên ở đây phải hỏi
 *  máy chủ xem nên hiện chữ gì. Đổi lại được cái lợi: chữ tính đúng lúc đọc,
 *  học sinh vừa học xong thì thấy lời khen chứ không bị nhắc "chưa học".
 *
 *  BẮT BUỘC phải hiện MỘT thông báo cho mỗi bản tin nhận được: im lặng thì
 *  trình duyệt tự hiện dòng "trang web này đã cập nhật ở chế độ nền" — vừa xấu
 *  vừa vô nghĩa. Vì thế mọi nhánh lỗi đều rơi về lời nhắc mặc định.
 * ========================================================================*/
var NHAC_MAC_DINH = { title: "Tới giờ ôn Tin học 📘", body: "Mười phút hôm nay là chuỗi của bạn còn nguyên.", url: "/hoc" };

self.addEventListener("push", function (e) {
  e.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function (sub) {
        if (!sub) return NHAC_MAC_DINH;
        return fetch("/api/nhac/noidung", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).then(function (r) { return r.ok ? r.json() : NHAC_MAC_DINH; });
      })
      .catch(function () { return NHAC_MAC_DINH; })
      .then(function (n) {
        return self.registration.showNotification(n.title || NHAC_MAC_DINH.title, {
          body: n.body || "",
          icon: "/asset/icon/icon-192.png",
          badge: "/asset/icon/icon-192.png",
          lang: "vi",
          /* Cùng tag -> bản tin mới ĐÈ LÊN bản cũ thay vì xếp chồng: mở máy sau
             mấy ngày không thấy một dọc thông báo giống hệt nhau. */
          tag: "nhac-hoc",
          renotify: true,
          data: { url: n.url || "/hoc" },
        });
      })
  );
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var dich = (e.notification.data && e.notification.data.url) || "/hoc";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (ds) {
      /* Đang mở sẵn tab của app thì chuyển sang tab đó, đừng mở thêm cửa sổ mới. */
      for (var i = 0; i < ds.length; i++) {
        if (ds[i].url.indexOf(self.location.origin) === 0 && "focus" in ds[i]) {
          if (ds[i].navigate) { try { ds[i].navigate(dich); } catch (err) {} }
          return ds[i].focus();
        }
      }
      return self.clients.openWindow(dich);
    })
  );
});
