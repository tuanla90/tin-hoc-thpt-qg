/* ============================================================================
 *  CHẾ ĐỘ THI/LUYỆN MỞ RỘNG
 *   (2) Luyện Đúng/Sai riêng (Phần II) — renderTFDrill
 *   (3) Bộ đề thi thử NHIỀU MÃ ĐỀ — mỗi mã đề là đề CỐ ĐỊNH (PRNG có seed),
 *       làm lại vẫn ra đúng đề đó để so tiến bộ — renderExamCodes / startExamCode
 *  Tái dùng newQuiz/go/State/QUESTION_BANK/EXAM_* của app.js (nạp SAU app.js).
 * ==========================================================================*/
(function () {
  var css =
    /* Nút lớn "Thi thử ngay" */
    ".exam-start{width:100%;display:flex;align-items:center;gap:14px;text-align:left;cursor:pointer;font-family:inherit;" +
      "background:linear-gradient(135deg,var(--primary),var(--primary-d));color:#fff;border:none;border-radius:var(--radius);" +
      "padding:18px 20px;box-shadow:0 6px 18px rgba(79,70,229,.3);transition:transform .12s,box-shadow .12s}" +
    ".exam-start:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(79,70,229,.4)}" +
    ".exam-start b{display:block;font-size:17px;font-weight:800}" +
    ".exam-start small{display:block;font-size:13px;opacity:.9;margin-top:2px}" +
    ".exam-start-ic{display:flex;align-items:center;justify-content:center;width:46px;height:46px;flex:none;border-radius:12px;background:rgba(255,255,255,.18)}" +
    ".exam-start>span:nth-child(2){flex:1}" +
    ".exam-start-go{display:flex;align-items:center;opacity:.85}" +
    /* Lưới bộ đề cố định */
    /* 10 đề xếp 5 thẻ mỗi hàng -> vừa 2 hàng */
    ".exam-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}" +
    "@media(max-width:820px){.exam-grid{grid-template-columns:repeat(3,1fr)}}" +
    "@media(max-width:520px){.exam-grid{grid-template-columns:repeat(2,1fr)}}" +
    ".exam-card{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;font-family:inherit;text-align:center;" +
      "background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px 12px;transition:border-color .15s,transform .1s}" +
    ".exam-card:hover{border-color:var(--primary);transform:translateY(-2px)}" +
    ".exam-card-num{font-size:19px;font-weight:850;color:var(--primary-d)}" +
    ".exam-card-best{font-size:12.5px;color:var(--text-soft);display:flex;align-items:center;gap:5px}" +
    ".exam-card-best b{color:var(--success)}" +
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

/* Lấy câu theo ma trận bằng RNG có seed — dùng chung sampleByMatrix của app.js,
   chỉ thay hàm xáo trộn bằng bản có seed để mỗi mã đề luôn ra đúng bộ câu đó. */
function examSampleByMatrix(type, dist, target, rnd) {
  return sampleByMatrix(type, dist, target, function (arr) { return examShuffle(arr, rnd); });
}

var EXAM_CODES = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

function startExamCode(code) {
  /* Mã "TC1..TC3" = đề tuyển chọn tay (định nghĩa trong questions-vandung.js).
     Nhận ở đây để nút "Làm lại đề này" ở màn kết quả dùng chung một lối. */
  if (typeof code === "string" && code.indexOf("TC") === 0) {
    if (typeof startMockExam === "function") startMockExam(Number(code.slice(2)) - 1);
    return;
  }
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
  var cauHinh = EXAM_CONFIG.mc + " câu trắc nghiệm + " + EXAM_CONFIG.tf + " câu Đúng/Sai · " +
    EXAM_CONFIG.minutes + " phút · chấm thang 10 như thi thật";

  /* Một thẻ đề: số thứ tự + điểm cao nhất đã đạt */
  var deCoDinh = EXAM_CODES.map(function (code, i) {
    var best = examBestForCode(code);
    var so = String(i + 1).padStart(2, "0");
    return '<button class="exam-card" data-code="' + code + '">' +
      '<span class="exam-card-num">Đề ' + so + "</span>" +
      '<span class="exam-card-best">' +
        (best != null ? (eIco("trophy", "#f59e0b", 14) + " Cao nhất <b>" + best.toFixed(2) + "</b>") : "Chưa làm lần nào") +
      "</span></button>";
  }).join("");

  app.innerHTML =
    '<button class="back-link" id="ecBack">' + eIco("aleft", null, 15) + " Về trang chủ</button>" +
    '<h2 style="margin-bottom:6px">' + eIco("exam", "#4f46e5", 22) + " Thi thử</h2>" +
    '<p style="color:var(--text-soft);font-size:14.5px;margin-bottom:16px">Mỗi đề gồm ' + cauHinh +
      ". Nộp bài xong có đáp án và lời giải từng câu.</p>" +

    '<button class="exam-start" id="ecRand">' +
      '<span class="exam-start-ic">' + eIco("dice", null, 26) + "</span>" +
      "<span><b>Thi thử ngay</b><small>Đề mới mỗi lần bấm — dùng khi muốn luyện nhiều đề khác nhau</small></span>" +
      '<span class="exam-start-go">' + eIco("aright", null, 20) + "</span>" +
    "</button>" +

    '<div class="section-title" style="margin-top:26px">' + eIco("bookmark", "#0891b2", 18) + " 10 đề tuyển chọn</div>" +
    '<p style="color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px">Mười đề lắp theo đúng ma trận đề thật, <b>luôn giữ nguyên câu hỏi</b> — làm lại là so được điểm với lần trước. Chọn một đề rồi quay lại sau vài tuần để đo tiến bộ.</p>' +
    '<div class="exam-grid" id="examFixedGrid">' + deCoDinh + "</div>";

  document.getElementById("ecBack").onclick = function () { go("home"); };
  document.getElementById("ecRand").onclick = function () { if (typeof startExam === "function") startExam(); };
  app.querySelectorAll(".exam-card").forEach(function (c) {
    c.onclick = function () {
      var code = c.dataset.code;
      startExamCode(/^\d+$/.test(code) ? +code : code);
    };
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
