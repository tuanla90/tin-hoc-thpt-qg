/* ============================================================================
 *  ÂM THANH PHẢN HỒI
 *
 *  Vì sao đáng làm: phần lớn cảm giác "đã tay" của các app học kiểu Duolingo
 *  đến từ tiếng *ting* ngay khi trả lời đúng. Mắt còn đang đọc câu hỏi thì tai
 *  đã biết mình đúng hay sai — phản hồi nhanh hơn bất cứ hiệu ứng hình nào.
 *
 *  Dùng WebAudio chứ không phải thẻ <audio>, vì ba lý do:
 *    1. Độ trễ: <audio> mỗi lần phát phải dựng lại luồng, trên điện thoại trễ
 *       cả trăm mili giây — nghe như tiếng vọng chứ không phải phản hồi.
 *    2. Chồng tiếng: học sinh bấm nhanh thì <audio> đang phát phải dừng lại từ
 *       đầu; WebAudio cho phát nhiều nguồn cùng lúc.
 *    3. Đổi cao độ: chuỗi đúng liên tiếp nhích tiếng lên cao dần (combo) —
 *       chỉ cần đổi playbackRate, không cần thêm tệp nào.
 *
 *  Luật của trình duyệt: KHÔNG được tạo/chạy AudioContext trước khi người dùng
 *  chạm vào trang. Vì thế mọi thứ dựng lười ở lần chạm đầu tiên, và tệp âm
 *  thanh cũng tải lúc đó (55KB, sau đó service worker giữ luôn ở máy).
 * ==========================================================================*/
(function () {
  var KEY = "tinhoc_am_v1";
  var GOC = "asset/am/";
  var TEP = { dung: "dung.wav", sai: "sai.wav", cham: "cham.wav" };

  var ctx = null, chinh = null;      /* AudioContext + nút chỉnh âm lượng chung */
  var kho = {};                      /* tên -> AudioBuffer đã giải mã */
  var dangNap = false;
  var combo = 0;

  function dangBat() {
    try { return localStorage.getItem(KEY) !== "0"; } catch (e) { return true; }
  }
  function datBat(bat) {
    try { localStorage.setItem(KEY, bat ? "1" : "0"); } catch (e) {}
    veNut();
  }

  /* --------------------------- dựng lười --------------------------- */
  function moCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    chinh = ctx.createGain();
    chinh.gain.value = 0.8;
    chinh.connect(ctx.destination);
    return ctx;
  }

  function nap() {
    if (dangNap || !moCtx()) return;
    dangNap = true;
    Object.keys(TEP).forEach(function (ten) {
      fetch(GOC + TEP[ten])
        .then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(new Error("HTTP " + r.status)); })
        .then(function (buf) {
          return new Promise(function (ok, hong) {
            /* Safari cũ chỉ có decodeAudioData kiểu gọi lại, không trả Promise. */
            var p = ctx.decodeAudioData(buf, ok, hong);
            if (p && p.then) p.then(ok, hong);
          });
        })
        .then(function (am) { kho[ten] = am; })
        .catch(function () { /* thiếu tiếng thì im lặng, không được làm hỏng bài học */ });
    });
  }

  /* Lần chạm đầu tiên vào trang: vừa đủ điều kiện của trình duyệt để mở
     AudioContext, vừa là lúc hợp lý để tải trước 55KB tiếng. */
  function moKhoa() {
    if (!dangBat()) return;
    if (moCtx() && ctx.state === "suspended") ctx.resume();
    nap();
  }
  ["pointerdown", "keydown", "touchstart"].forEach(function (e) {
    window.addEventListener(e, moKhoa, { once: true, passive: true });
  });

  /* ----------------------------- phát ----------------------------- */
  function phat(ten, caoDo, to) {
    if (!dangBat() || !ctx || !kho[ten]) return;
    if (ctx.state === "suspended") ctx.resume();
    try {
      var ng = ctx.createBufferSource();
      ng.buffer = kho[ten];
      ng.playbackRate.value = caoDo || 1;
      if (to == null || to === 1) {
        ng.connect(chinh);
      } else {
        var g = ctx.createGain();
        g.gain.value = to;
        ng.connect(g); g.connect(chinh);
      }
      ng.start();
    } catch (e) { /* hết nguồn phát, tab bị treo… không đáng để văng lỗi */ }
  }

  /* ------------------------- nút loa ở thanh trên ------------------------- */
  function veNut() {
    var b = document.getElementById("amToggle");
    if (!b) return;
    var bat = dangBat();
    /* icons.js nạp SAU tệp này nên ICON chưa có lúc phân tích cú pháp, nhưng hàm
       này chỉ chạy từ DOMContentLoaded trở đi nên lúc đó đã có. Vẫn để nhánh dự
       phòng emoji cho trường hợp icons.js lỗi, đừng để trống trơ cái nút. */
    if (typeof ICON === "function") b.innerHTML = ICON(bat ? "volume" : "volumeoff", 20);
    else b.textContent = bat ? "🔊" : "🔇";
    b.title = bat ? "Tắt âm thanh" : "Bật âm thanh";
    b.setAttribute("aria-pressed", bat ? "true" : "false");
  }
  function ganNut() {
    var b = document.getElementById("amToggle");
    if (!b) return;
    veNut();
    b.onclick = function () {
      var bat = !dangBat();
      datBat(bat);
      /* Bật lên thì phát thử một tiếng — nghe được ngay mới biết là đã bật,
         chứ nhìn cái biểu tượng đổi thì chưa chắc. */
      if (bat) { moKhoa(); setTimeout(function () { phat("dung", 1); }, 120); }
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ganNut);
  else ganNut();

  window.Am = {
    dangBat: dangBat,
    /* Trả lời đúng. Đúng liên tiếp thì cao độ nhích lên — chuỗi càng dài nghe
       càng phấn khích, đúng như cảm giác đang "vào phom". Chặn trần để không
       thành tiếng chuột kêu. */
    dung: function () {
      combo++;
      phat("dung", Math.min(1 + 0.045 * (combo - 1), 1.32));
    },
    sai: function () { combo = 0; phat("sai", 1); },
    cham: function () { phat("cham", 1, 0.7); },
    /* Mốc đáng ăn mừng (lên cấp, mở huy hiệu, học xong bài): ba tiếng đi lên
       thành một câu nhạc ngắn — khỏi cần thêm tệp riêng. */
    chucMung: function () {
      [0, 110, 220].forEach(function (tre, i) {
        setTimeout(function () { phat("dung", [1, 1.26, 1.5][i]); }, tre);
      });
    },
    /* Bắt đầu bài mới thì chuỗi combo tính lại từ đầu. */
    xoaCombo: function () { combo = 0; },
    combo: function () { return combo; },
  };
})();
