/* ============================================================================
 *  TỪ VỰNG THUẬT NGỮ – "học thuật ngữ tiếng Anh như học từ vựng".
 *  Mục tiêu: một bạn ~lớp 4–5 gặp nhiều từ tiếng Anh/chuyên ngành trong bài
 *  vẫn không bị choáng. Mỗi bài khai báo VOCAB[id] = [ {en, say, ipa?, vi,
 *  gloss, speak?}, ... ] và injectVocab(lesson) chèn khối "📕 Từ vựng trong
 *  bài" vào cuối phần Giảng lại (trước "Cần nhớ").
 *    en    : từ/cụm tiếng Anh (thuật ngữ)
 *    say   : cách đọc kiểu Việt cho trẻ dễ đọc (vd "AL-gô-rít-thầm")
 *    ipa   : phiên âm quốc tế (không bắt buộc)
 *    vi    : nghĩa tiếng Việt
 *    gloss : giải thích đời thường, siêu dễ hiểu (1–2 câu)
 *    speak : chuỗi để máy đọc (mặc định = en) — dùng khi en có ký tự trang trí
 *  Nút 🔊 dùng giọng đọc sẵn của trình duyệt (speechSynthesis) → chạy offline.
 * ==========================================================================*/
(function () {
  var css =
    ".voc-box{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin:18px 0;background:var(--bg-card)}" +
    ".voc-head{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--primary-soft);cursor:pointer;font-weight:700;font-size:15px;color:var(--primary-d)}" +
    ".voc-head small{color:var(--text-soft);font-weight:500;font-size:12.5px;flex:1;min-width:140px}" +
    ".voc-chev{color:var(--text-soft);font-size:12px;display:inline-flex}" +
    ".voc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:12px;padding:14px;background:var(--bg-soft)}" +
    ".voc-grid[hidden]{display:none}" +
    ".voc-card{background:var(--bg-card);border:1px solid var(--border);border-left:4px solid var(--info);border-radius:var(--radius-sm);padding:11px 13px}" +
    ".voc-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}" +
    ".voc-en{font-size:16.5px;font-weight:800;color:var(--info);line-height:1.2}" +
    /* Trước dùng border:var(--border) trên nền background:var(--bg-soft) — ở giao
       diện Tối hai biến đó CÙNG MỘT MÃ MÀU (#1e293b), nên viền biến mất và nút chỉ
       còn là một khối xám mờ hơi nhỉnh màu thẻ, nhìn "chìm" y như phản ánh. Đổi sang
       tông --info: đã là màu nhấn của khối từ vựng (viền trái thẻ, tên thuật ngữ),
       nút mượn màu đó nên nổi rõ mà vẫn cùng một hệ màu, không lạc tông. */
    ".voc-say{margin-left:auto;flex:none;border:1.5px solid var(--info);background:var(--info-soft);color:var(--info);border-radius:8px;cursor:pointer;font-size:14px;line-height:1;padding:5px 8px;transition:background .15s,color .15s}" +
    ".voc-say:hover{background:var(--info);color:#fff}" +
    ".voc-say:active{transform:scale(.92)}" +
    ".voc-pron{font-size:13.5px;color:var(--text);margin-bottom:3px}" +
    ".voc-ipa{color:var(--text-soft);font-size:12px;margin-left:4px}" +
    ".voc-vi{font-size:14.5px;margin-bottom:4px}" +
    ".voc-gloss{font-size:13px;color:var(--text-soft);line-height:1.5}" +
    ".voc-pron .ic,.voc-vi .ic,.voc-src .ic,.voc-head .ic{vertical-align:-2px;margin-right:2px}" +
    ".voc-say{line-height:0}.voc-say .ic{display:block}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

/* VOCAB[mã-bài] = danh sách phần tử, mỗi phần tử là:
 *   - CHUỖI khóa   → tra trong từ điển gốc VOCAB_TERMS (định nghĩa 1 lần, dùng lại)
 *   - hoặc OBJECT  → {en, say, vi, gloss, speak?} viết thẳng (khi cần giải thích riêng)
 * Dữ liệu thật nằm ở js/vocab-terms.js (từ điển) + js/vocab-data.js (gán khóa cho bài). */
var VOCAB = {};

/* Đổi 1 phần tử (khóa hoặc object) thành object từ vựng đầy đủ */
function vocResolve(e) {
  if (typeof e === "string") {
    return (typeof VOCAB_TERMS !== "undefined" && VOCAB_TERMS[e]) || null;
  }
  return e || null;
}

/* --- Tuỳ chọn giọng đọc (người học tự chọn ở trang Từ vựng) --- */
var vocabPrefs = (function () {
  var p = { voice: null, rate: 0.85 };
  try {
    var s = localStorage.getItem("vocabPrefs");
    if (s) { var o = JSON.parse(s); if (o) { if (o.voice) p.voice = o.voice; if (o.rate) p.rate = o.rate; } }
  } catch (e) {}
  return p;
})();
function vocabSavePrefs() {
  try { localStorage.setItem("vocabPrefs", JSON.stringify(vocabPrefs)); } catch (e) {}
}
function vocabVoices() {
  try { return window.speechSynthesis.getVoices() || []; } catch (e) { return []; }
}

/* Đọc to từ tiếng Anh bằng giọng có sẵn của trình duyệt (offline) */
function vocabSpeak(text, btn) {
  try {
    if (!("speechSynthesis" in window)) {
      if (btn) { btn.innerHTML = vIco("volumeoff", null, 16); btn.title = "Trình duyệt không hỗ trợ đọc"; }
      return;
    }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = vocabPrefs.rate || 0.85; // tốc độ do người học chọn
    if (vocabPrefs.voice) {
      var vs = vocabVoices();
      for (var i = 0; i < vs.length; i++) {
        if (vs[i].name === vocabPrefs.voice) { u.voice = vs[i]; u.lang = vs[i].lang; break; }
      }
    }
    window.speechSynthesis.speak(u);
  } catch (e) { /* im lặng nếu môi trường chặn */ }
}

function vocEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

/* Icon (fallback rỗng nếu icons.js chưa nạp — thực tế luôn nạp trước khi render) */
function vIco(name, color, size) { return (typeof ICON === "function") ? ICON(name, size || 15, color) : ""; }

function vocabCardHTML(v, tag) {
  return (
    '<div class="voc-card">' +
      '<div class="voc-top">' +
        '<span class="voc-en">' + vocEsc(v.en) + "</span>" +
        '<button class="voc-say" type="button" data-say="' + vocEsc(v.speak || v.en) + '" title="Nghe đọc">' + vIco("volume", null, 16) + "</button>" +
      "</div>" +
      '<div class="voc-pron">' + vIco("mic", "#6366f1", 14) + " đọc: <b>" + vocEsc(v.say) + "</b></div>" +
      '<div class="voc-vi">' + vIco("aright", "#16a34a", 14) + " <b>" + vocEsc(v.vi) + "</b></div>" +
      '<div class="voc-gloss">' + vocEsc(v.gloss) + "</div>" +
      (tag ? '<div class="voc-src">' + vIco("book", "#3b82f6", 13) + " " + vocEsc(tag) + "</div>" : "") +
    "</div>"
  );
}

/* Chèn khối Từ vựng vào trang bài học (gọi 1 lần trong renderLesson) */
function injectVocab(lesson) {
  var raw = (typeof VOCAB !== "undefined" && VOCAB[lesson.id]) || [];
  var list = raw.map(vocResolve).filter(Boolean);
  if (!list.length) return;
  var anchor = document.querySelector(".ls-keypoints") || document.querySelector(".ls-actions");
  if (!anchor) return;

  var box = document.createElement("div");
  box.className = "voc-box";
  box.innerHTML =
    '<div class="voc-head"><span>' + vIco("book", "#ec4899", 17) + " Từ vựng trong bài</span>" +
      "<small>" + list.length + " từ tiếng Anh · bấm " + vIco("volume", null, 13) + " để nghe đọc</small>" +
      '<span class="voc-chev">' + vIco("chevdown", null, 14) + "</span></div>" +
    '<div class="voc-grid">' + list.map(function (v) { return vocabCardHTML(v); }).join("") + "</div>";
  anchor.parentNode.insertBefore(box, anchor);

  var head = box.querySelector(".voc-head");
  var grid = box.querySelector(".voc-grid");
  var chev = box.querySelector(".voc-chev");
  /* Đổi HẲN icon (chevdown mở / aright đóng) thay vì xoay một icon bằng CSS
     transform: trước đây gán textContent "▼"/"▶" — vừa không nhận màu theo giao
     diện, vừa lệch phông chữ mũi tên so với icon "chevdown" lúc mới dựng. */
  head.onclick = function () {
    var hidden = grid.hasAttribute("hidden");
    if (hidden) { grid.removeAttribute("hidden"); chev.innerHTML = vIco("chevdown", null, 14); }
    else { grid.setAttribute("hidden", ""); chev.innerHTML = vIco("aright", null, 14); }
  };
  box.querySelectorAll(".voc-say").forEach(function (b) {
    b.onclick = function () { vocabSpeak(b.getAttribute("data-say"), b); };
  });
}

/* ==========================================================================
 *  TRANG "TỪ VỰNG" RIÊNG: tra cứu tất cả thuật ngữ + lật thẻ (flashcard).
 * ========================================================================*/
(function () {
  var css =
    ".voc-src{margin-top:8px;font-size:12px;color:var(--text-soft)}" +
    ".voc-modes{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}" +
    ".voc-mode{border:1px solid var(--border);background:var(--bg-card);color:var(--text);border-radius:999px;padding:7px 16px;cursor:pointer;font-weight:600;font-size:14px}" +
    ".voc-mode.active{background:var(--primary);color:#fff;border-color:var(--primary)}" +
    ".voc-search{width:100%;box-sizing:border-box;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--bg-card);color:var(--text);font-size:14.5px;margin-bottom:14px}" +
    ".voc-count{color:var(--text-soft);font-size:13px;margin:-6px 0 10px}" +
    ".flash-wrap{max-width:460px;margin:0 auto}" +
    ".flash-card{perspective:1200px;cursor:pointer;margin-bottom:16px}" +
    ".flash-inner{position:relative;width:100%;min-height:240px;transition:transform .5s;transform-style:preserve-3d}" +
    ".flash-card.flipped .flash-inner{transform:rotateY(180deg)}" +
    ".flash-face{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden;border:1px solid var(--border);border-radius:16px;background:var(--bg-card);box-shadow:var(--shadow);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px;box-sizing:border-box;overflow:auto}" +
    ".flash-front{border-top:5px solid var(--info)}" +
    ".flash-back{transform:rotateY(180deg);border-top:5px solid var(--success);justify-content:flex-start}" +
    ".flash-en{font-size:30px;font-weight:800;color:var(--info);margin-bottom:10px;word-break:break-word}" +
    ".flash-say{margin:0 0 8px 0!important}" +
    ".flash-hint{font-size:12.5px;color:var(--text-soft)}" +
    ".flash-pron{font-size:15px;margin-bottom:8px;color:var(--text)}" +
    ".flash-vi{font-size:21px;font-weight:800;margin-bottom:10px;color:var(--success)}" +
    ".flash-gloss{font-size:14px;color:var(--text-soft);line-height:1.55}" +
    ".flash-src{margin-top:12px;font-size:12px;color:var(--text-soft)}" +
    ".flash-ctrl{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}" +
    ".flash-prog{font-size:14px;color:var(--text-soft);font-weight:700}" +
    ".flash-ctrl2{text-align:center}" +
    ".voc-empty{padding:30px;text-align:center;color:var(--text-soft)}" +
    ".voc-voicebar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:var(--bg-soft);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:14px}" +
    ".voc-vlabel{font-size:13.5px;color:var(--text-soft);font-weight:600}" +
    ".voc-vselect{padding:6px 8px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:13.5px;max-width:230px}" +
    ".voc-vrate{max-width:120px}" +
    ".voc-vtest{border:1px solid var(--border);background:var(--bg-card);color:var(--text);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:13.5px}" +
    ".voc-vtest:hover{background:var(--primary-soft)}" +
    ".voc-vnote{font-size:13px;color:var(--text-soft)}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

/* Gom tất cả từ vựng từ mọi bài thành một danh sách phẳng (kèm tên bài) */
function vocabCollectAll() {
  var all = [], seen = {};
  for (var id in VOCAB) {
    if (!VOCAB.hasOwnProperty(id)) continue;
    var title = id;
    if (typeof LESSONS !== "undefined") {
      for (var i = 0; i < LESSONS.length; i++) {
        if (LESSONS[i].id === id) { title = LESSONS[i].title; break; }
      }
    }
    VOCAB[id].forEach(function (e) {
      var v = vocResolve(e);
      if (!v || seen[v.en]) return;   // gộp trùng theo từ tiếng Anh
      seen[v.en] = 1;
      var c = {}; for (var k in v) c[k] = v[k];
      c._lesson = title;
      all.push(c);
    });
  }
  return all;
}

var vocPageState = { mode: "cards", order: [], pos: 0, flipped: false };

function vocabShuffle(n) {
  var a = []; for (var i = 0; i < n; i++) a.push(i);
  for (var j = a.length - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var t = a[j]; a[j] = a[k]; a[k] = t;
  }
  return a;
}

function vocabRenderVoiceBar() {
  var bar = document.getElementById("vocVoiceBar");
  if (!bar) return;
  var vs = vocabVoices().slice();
  if (!vs.length) {
    bar.innerHTML = '<span class="voc-vnote">' + vIco("volume", null, 14) + " Đang tải danh sách giọng đọc… Nếu vẫn trống thì máy bạn chưa cài giọng đọc.</span>";
    return;
  }
  vs.sort(function (a, b) {   // ưu tiên giọng tiếng Anh lên đầu
    var ae = /^en/i.test(a.lang) ? 0 : 1, be = /^en/i.test(b.lang) ? 0 : 1;
    if (ae !== be) return ae - be;
    return a.name < b.name ? -1 : 1;
  });
  var opts = vs.map(function (v) {
    var sel = (vocabPrefs.voice === v.name) ? " selected" : "";
    return '<option value="' + vocEsc(v.name) + '"' + sel + ">" + vocEsc(v.name) + " (" + vocEsc(v.lang) + ")</option>";
  }).join("");
  var rates = [["Chậm", 0.6], ["Vừa", 0.85], ["Nhanh", 1.1]];
  var ropts = rates.map(function (r) {
    var sel = (Math.abs((vocabPrefs.rate || 0.85) - r[1]) < 0.02) ? " selected" : "";
    return '<option value="' + r[1] + '"' + sel + ">" + r[0] + "</option>";
  }).join("");
  bar.innerHTML =
    '<span class="voc-vlabel">' + vIco("volume", null, 15) + " Giọng đọc:</span>" +
    '<select class="voc-vselect" id="vocVoiceSel">' + opts + "</select>" +
    '<span class="voc-vlabel">Tốc độ:</span>' +
    '<select class="voc-vselect voc-vrate" id="vocRateSel">' + ropts + "</select>" +
    '<button class="voc-vtest" id="vocVoiceTest" type="button">' + vIco("play", null, 14) + " Nghe thử</button>";
  document.getElementById("vocVoiceSel").onchange = function () { vocabPrefs.voice = this.value; vocabSavePrefs(); };
  document.getElementById("vocRateSel").onchange = function () { vocabPrefs.rate = parseFloat(this.value); vocabSavePrefs(); };
  document.getElementById("vocVoiceTest").onclick = function () { vocabSpeak("byte, algorithm, computer", this); };
}

function renderVocabPage() {
  var app = document.getElementById("app");
  var all = vocabCollectAll();
  if (!all.length) {
    app.innerHTML =
      '<button class="back-link" id="vback">' + vIco("aleft", null, 15) + " Trang chủ</button>" +
      '<div class="voc-empty">' + vIco("book", null, 16) + ' Chưa có từ vựng nào. Hãy thêm <code>VOCAB["mã-bài"]</code> cho các bài học.</div>';
    document.getElementById("vback").onclick = function () { go("home"); };
    return;
  }
  app.innerHTML =
    '<button class="back-link" id="vback">' + vIco("aleft", null, 15) + " Trang chủ</button>" +
    '<h2 class="voc-h2" style="margin-bottom:6px">' + vIco("book", "#ec4899", 22) + " Từ vựng thuật ngữ</h2>" +
    '<p style="color:var(--text-soft);font-size:14.5px;margin-bottom:14px">Tất cả <b>' + all.length + '</b> từ tiếng Anh gặp trong các bài. Học như học từ vựng tiếng Anh — bấm ' + vIco("volume", null, 13) + ' để nghe đọc nhé!</p>' +
    '<div class="voc-voicebar" id="vocVoiceBar"></div>' +
    '<div class="voc-modes"><button class="voc-mode" data-m="cards">' + vIco("layers", null, 15) + " Lật thẻ</button><button class=\"voc-mode\" data-m=\"list\">" + vIco("clipboard", null, 15) + " Tra cứu</button></div>" +
    '<div id="vocPane"></div>';
  document.getElementById("vback").onclick = function () { go("home"); };
  vocabRenderVoiceBar();
  // Giọng đọc thường nạp trễ → khi trình duyệt báo có giọng, vẽ lại thanh chọn
  try { window.speechSynthesis.onvoiceschanged = function () { vocabRenderVoiceBar(); }; } catch (e) {}
  var modeBtns = app.querySelectorAll(".voc-mode");
  function paintModes() { modeBtns.forEach(function (b) { b.classList.toggle("active", b.dataset.m === vocPageState.mode); }); }
  modeBtns.forEach(function (b) {
    b.onclick = function () { vocPageState.mode = b.dataset.m; paintModes(); vocRenderPane(all); };
  });
  paintModes();
  vocRenderPane(all);
}

function vocRenderPane(all) {
  if (vocPageState.mode === "list") vocRenderList(all);
  else vocRenderCards(all);
}

function vocRenderList(all) {
  var pane = document.getElementById("vocPane");
  var sorted = all.slice().sort(function (a, b) {
    return a.en.toLowerCase() < b.en.toLowerCase() ? -1 : 1;
  });
  pane.innerHTML =
    '<input id="vocSearch" class="voc-search" placeholder="Tìm từ (tiếng Anh hoặc nghĩa tiếng Việt)...">' +
    '<div class="voc-count" id="vocCount"></div>' +
    '<div class="voc-grid" id="vocPageGrid">' +
      sorted.map(function (v) { return vocabCardHTML(v, v._lesson); }).join("") +
    "</div>";
  var grid = pane.querySelector("#vocPageGrid");
  var cards = grid.children;
  var count = pane.querySelector("#vocCount");
  function refreshCount() {
    var shown = 0; for (var i = 0; i < cards.length; i++) if (cards[i].style.display !== "none") shown++;
    count.textContent = "Hiện " + shown + " / " + sorted.length + " từ";
  }
  refreshCount();
  pane.querySelector("#vocSearch").oninput = function (e) {
    var q = e.target.value.trim().toLowerCase();
    sorted.forEach(function (v, i) {
      var hay = (v.en + " " + v.vi + " " + (v.say || "")).toLowerCase();
      cards[i].style.display = (!q || hay.indexOf(q) >= 0) ? "" : "none";
    });
    refreshCount();
  };
  grid.querySelectorAll(".voc-say").forEach(function (b) {
    b.onclick = function () { vocabSpeak(b.getAttribute("data-say"), b); };
  });
}

function vocRenderCards(all) {
  if (vocPageState.order.length !== all.length) {
    vocPageState.order = vocabShuffle(all.length);
    vocPageState.pos = 0; vocPageState.flipped = false;
  }
  var pane = document.getElementById("vocPane");
  pane.innerHTML =
    '<div class="flash-wrap">' +
      '<div class="flash-card" id="flashCard"><div class="flash-inner">' +
        '<div class="flash-face flash-front">' +
          '<div class="flash-en" id="flashEn"></div>' +
          '<button class="voc-say flash-say" id="flashSay" type="button" title="Nghe đọc">' + vIco("volume", null, 20) + "</button>" +
          '<div class="flash-hint">' + vIco("aright", null, 13) + ' Bấm vào thẻ để xem nghĩa</div>' +
        "</div>" +
        '<div class="flash-face flash-back">' +
          '<div class="flash-pron" id="flashPron"></div>' +
          '<div class="flash-vi" id="flashVi"></div>' +
          '<div class="flash-gloss" id="flashGloss"></div>' +
          '<div class="flash-src" id="flashSrc"></div>' +
        "</div>" +
      "</div></div>" +
      '<div class="flash-ctrl">' +
        '<button class="btn btn-ghost" id="flPrev">' + vIco("aleft", null, 14) + " Trước</button>" +
        '<span class="flash-prog" id="flProg"></span>' +
        '<button class="btn btn-ghost" id="flNext">Tiếp ' + vIco("aright", null, 14) + "</button>" +
      "</div>" +
      '<div class="flash-ctrl2"><button class="btn btn-success" id="flKnow">' + vIco("check2", null, 14) + ' Đánh dấu đã thuộc</button> <button class="btn btn-ghost" id="flShuffle">' + vIco("refresh", null, 14) + " Xáo trộn lại</button></div>" +
    "</div>";

  var card = pane.querySelector("#flashCard");
  function paint() {
    var v = all[vocPageState.order[vocPageState.pos]];
    pane.querySelector("#flashEn").textContent = v.en;
    pane.querySelector("#flashSay").setAttribute("data-say", v.speak || v.en);
    pane.querySelector("#flashPron").innerHTML = vIco("mic", "#6366f1", 15) + " đọc: <b>" + vocEsc(v.say) + "</b>";
    pane.querySelector("#flashVi").textContent = v.vi;
    pane.querySelector("#flashGloss").textContent = v.gloss;
    pane.querySelector("#flashSrc").innerHTML = vIco("book", "#3b82f6", 14) + " " + vocEsc(v._lesson);
    pane.querySelector("#flProg").textContent = (vocPageState.pos + 1) + " / " + all.length;
    card.classList.toggle("flipped", vocPageState.flipped);
    var kb = pane.querySelector("#flKnow");
    if (kb) {
      var mastered = (typeof Gam !== "undefined" && Gam.isVocabMastered && Gam.isVocabMastered(v.en));
      kb.innerHTML = vIco("check2", null, 14) + (mastered ? " Đã thuộc rồi" : " Đánh dấu đã thuộc");
    }
  }
  card.onclick = function () { vocPageState.flipped = !vocPageState.flipped; paint(); };
  pane.querySelector("#flashSay").onclick = function (e) {
    e.stopPropagation();
    vocabSpeak(this.getAttribute("data-say"), this);
  };
  pane.querySelector("#flPrev").onclick = function () {
    vocPageState.pos = (vocPageState.pos - 1 + all.length) % all.length;
    vocPageState.flipped = false; paint();
  };
  pane.querySelector("#flNext").onclick = function () {
    vocPageState.pos = (vocPageState.pos + 1) % all.length;
    vocPageState.flipped = false; paint();
  };
  pane.querySelector("#flShuffle").onclick = function () {
    vocPageState.order = vocabShuffle(all.length);
    vocPageState.pos = 0; vocPageState.flipped = false; paint();
  };
  pane.querySelector("#flKnow").onclick = function () {
    var v = all[vocPageState.order[vocPageState.pos]];
    if (typeof Gam !== "undefined" && Gam.onVocabMastered) Gam.onVocabMastered(v.en);
    this.innerHTML = vIco("check2", null, 14) + " Đã thuộc rồi";
    // tự chuyển sang từ tiếp theo cho mạch học
    setTimeout(function () { vocPageState.pos = (vocPageState.pos + 1) % all.length; vocPageState.flipped = false; paint(); }, 650);
  };
  paint();
}

window.VOCAB = VOCAB;
window.injectVocab = injectVocab;
window.renderVocabPage = renderVocabPage;
