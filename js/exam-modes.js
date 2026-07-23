/* ============================================================================
 *  CHẾ ĐỘ THI/LUYỆN MỞ RỘNG
 *   (2) Luyện Đúng/Sai riêng (Phần II) — renderTFDrill
 *   (3) Bộ đề thi thử NHIỀU MÃ ĐỀ — mỗi mã đề là đề CỐ ĐỊNH (PRNG có seed),
 *       làm lại vẫn ra đúng đề đó để so tiến bộ — renderExamCodes / startExamCode
 *  Tái dùng newQuiz/go/State/QUESTION_BANK/EXAM_* của app.js (nạp SAU app.js).
 * ==========================================================================*/
(function () {
  var css =
    ".exam-code-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}" +
    ".exam-code{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px 14px;text-align:center;cursor:pointer;transition:border-color .15s,transform .1s}" +
    ".exam-code:hover{border-color:var(--primary);transform:translateY(-2px)}" +
    ".exam-code-badge{font-size:12px;color:var(--text-soft);text-transform:uppercase;letter-spacing:.5px}" +
    ".exam-code-num{font-size:30px;font-weight:800;color:var(--primary-d);line-height:1.2;margin:2px 0 6px}" +
    ".exam-code-best{font-size:12.5px;color:var(--text-soft)}" +
    ".exam-code-best b{color:var(--success)}" +
    ".tf-scorebox{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 4px}" +
    ".tf-scorebox span{background:var(--bg-soft);border:1px solid var(--border);border-radius:8px;padding:5px 10px;font-size:12.5px;color:var(--text-soft)}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

function eIco(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 15, c) : ""; }

/* --- PRNG có seed (mulberry32) để mỗi mã đề luôn cho cùng một bộ câu --- */
function examRng(seed) {
  var t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    var r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function examShuffle(arr, rnd) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(rnd() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
function examPick(arr, n, rnd) { return examShuffle(arr, rnd).slice(0, n); }

/* Lấy câu theo ma trận chủ đề bằng RNG có seed (bản seeded của sampleByMatrix) */
function examSampleByMatrix(type, dist, target, rnd) {
  var chosen = [], used = {};
  Object.keys(dist).forEach(function (topic) {
    examPick(QUESTION_BANK.filter(function (q) { return q.type === type && q.topic === topic; }), dist[topic], rnd)
      .forEach(function (q) { chosen.push(q); used[q.id] = 1; });
  });
  if (chosen.length < target) {
    examPick(QUESTION_BANK.filter(function (q) { return q.type === type && !used[q.id]; }), target - chosen.length, rnd)
      .forEach(function (q) { chosen.push(q); used[q.id] = 1; });
  }
  return examShuffle(chosen, rnd).slice(0, target);
}

var EXAM_CODES = [101, 102, 103, 104, 105, 106];

function startExamCode(code) {
  var rnd = examRng((code * 2654435761) >>> 0);
  var mc = examSampleByMatrix("mc", EXAM_MATRIX.mc, EXAM_CONFIG.mc, rnd);
  var tf = examSampleByMatrix("tf", EXAM_MATRIX.tf, EXAM_CONFIG.tf, rnd);
  var qs = mc.concat(tf); // giữ Phần I → Phần II
  State.quiz = newQuiz(qs, "exam", { minutes: EXAM_CONFIG.minutes, title: "Thi thử — Mã đề " + code, code: code });
  go("quiz");
}

function examBestForCode(code) {
  var best = null;
  (State.history || []).forEach(function (h) {
    if (h.mode === "exam" && h.code === code && (best === null || h.score > best)) best = h.score;
  });
  return best;
}

function renderExamCodes() {
  var app = document.getElementById("app");
  var cards = EXAM_CODES.map(function (code) {
    var best = examBestForCode(code);
    return '<div class="exam-code" data-code="' + code + '">' +
      '<div class="exam-code-badge">Mã đề</div>' +
      '<div class="exam-code-num">' + code + "</div>" +
      '<div class="exam-code-best">' + (best != null ? ("Cao nhất: <b>" + best.toFixed(2) + "</b>") : "Chưa làm") + "</div>" +
      "</div>";
  }).join("");
  app.innerHTML =
    '<button class="back-link" id="ecBack">' + eIco("aleft", null, 15) + " Về trang chủ</button>" +
    '<h2 style="margin-bottom:6px">' + eIco("exam", "#4f46e5", 22) + " Thi thử — chọn mã đề</h2>" +
    '<p style="color:var(--text-soft);font-size:14.5px;margin-bottom:16px">Mỗi đề gồm ' + EXAM_CONFIG.mc + " câu trắc nghiệm + " + EXAM_CONFIG.tf + " câu Đúng/Sai · " + EXAM_CONFIG.minutes + " phút · thang 10. <b>Mỗi mã đề là một bộ đề cố định</b> — làm lại vẫn ra đúng đề đó để so sánh tiến bộ.</p>" +
    '<div class="exam-code-grid">' + cards + "</div>" +
    '<div style="margin-top:16px"><button class="btn btn-ghost" id="ecRand">' + eIco("dice", null, 15) + " Đề ngẫu nhiên (mỗi lần một khác)</button></div>";
  document.getElementById("ecBack").onclick = function () { go("home"); };
  document.getElementById("ecRand").onclick = function () { if (typeof startExam === "function") startExam(); };
  app.querySelectorAll(".exam-code").forEach(function (c) {
    c.onclick = function () { startExamCode(+c.dataset.code); };
  });
}

/* --- (2) Luyện Đúng/Sai riêng --- */
var tfCfg = { topic: "all", count: 10 };
function tfPool() {
  return QUESTION_BANK.filter(function (q) {
    return q.type === "tf" && (tfCfg.topic === "all" || q.topic === tfCfg.topic);
  });
}
function renderTFDrill() {
  var app = document.getElementById("app");
  var topics = [["all", "Tất cả"]].concat(Object.keys(TOPICS).map(function (c) { return [c, c + ". " + TOPICS[c]]; }));
  var chips = topics.map(function (t) {
    return '<button class="chip ' + (t[0] === tfCfg.topic ? "active" : "") + '" data-val="' + t[0] + '">' + esc(t[1]) + "</button>";
  }).join("");
  var counts = [5, 8, 10, 15].map(function (n) { return '<option value="' + n + '" ' + (n === tfCfg.count ? "selected" : "") + ">" + n + " câu</option>"; }).join("");
  app.innerHTML =
    '<button class="back-link" id="tfBack">' + eIco("aleft", null, 15) + " Về trang chủ</button>" +
    '<h2 style="margin-bottom:6px">' + eIco("check", "#16a34a", 22) + " Luyện Đúng/Sai (Phần II)</h2>" +
    '<p style="color:var(--text-soft);font-size:14.5px;margin-bottom:6px">Mỗi câu có 4 ý — chọn Đúng/Sai từng ý. Có đáp án + lời giải ngay sau mỗi câu.</p>' +
    '<div class="tf-scorebox"><span>Cách tính điểm như đề thật:</span><span>1 ý đúng = 0,1đ</span><span>2 ý = 0,25đ</span><span>3 ý = 0,5đ</span><span>4 ý = 1,0đ</span></div>' +
    '<div class="config-card">' +
      '<div class="config-row"><label>Chủ đề</label><div class="chip-group">' + chips + "</div></div>" +
      '<div class="config-row"><label>Số câu</label><div class="chip-group"><select id="tfCount">' + counts + "</select></div></div>" +
      '<div class="config-row" style="justify-content:space-between"><span id="tfAvail" style="color:var(--text-soft);font-size:13.5px"></span><button class="btn btn-primary btn-lg" id="tfStart">Bắt đầu ' + eIco("aright", null, 15) + "</button></div>" +
    "</div>";
  function upd() {
    var p = tfPool();
    document.getElementById("tfAvail").textContent = "Có " + p.length + " câu Đúng/Sai phù hợp.";
    document.getElementById("tfStart").disabled = p.length === 0;
  }
  app.querySelectorAll(".chip").forEach(function (b) {
    b.onclick = function () {
      tfCfg.topic = b.dataset.val;
      app.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active"); upd();
    };
  });
  document.getElementById("tfCount").onchange = function (e) { tfCfg.count = +e.target.value; };
  document.getElementById("tfBack").onclick = function () { go("home"); };
  document.getElementById("tfStart").onclick = function () {
    var p = tfPool(); if (!p.length) return;
    var n = Math.min(tfCfg.count, p.length);
    var qs = (typeof pick === "function") ? pick(p, n) : p.slice(0, n);
    State.quiz = newQuiz(qs, "practice", { title: "Luyện Đúng/Sai" });
    go("quiz");
  };
  upd();
}

window.renderExamCodes = renderExamCodes;
window.renderTFDrill = renderTFDrill;
window.startExamCode = startExamCode;
