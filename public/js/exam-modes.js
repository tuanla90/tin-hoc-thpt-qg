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
    ".exam-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px}" +
    ".exam-card{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;cursor:pointer;font-family:inherit;" +
      "background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px 16px;transition:border-color .15s,transform .1s}" +
    ".exam-card:hover{border-color:var(--primary);transform:translateY(-2px)}" +
    ".exam-card-tag{font-size:11px;font-weight:750;letter-spacing:.03em;text-transform:uppercase;color:var(--text-soft);" +
      "background:var(--bg-soft);border:1px solid var(--border);border-radius:999px;padding:2px 9px}" +
    ".exam-card-tag.tuyenchon{color:var(--primary);background:var(--primary-soft);border-color:var(--primary)}" +
    ".exam-card-name{font-size:15.5px;font-weight:800;color:var(--text);margin-top:5px}" +
    ".exam-card-note{font-size:12.5px;color:var(--text-soft)}" +
    ".exam-card-best{font-size:12.5px;color:var(--text-soft);display:flex;align-items:center;gap:5px;margin-top:7px}" +
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

  /* Một thẻ đề: nhãn loại + tên + điểm cao nhất đã đạt */
  function the(code, loai, ten, mota) {
    var best = examBestForCode(code);
    return '<button class="exam-card" data-code="' + code + '">' +
      '<span class="exam-card-tag' + (loai === "Tuyển chọn" ? " tuyenchon" : "") + '">' + loai + "</span>" +
      '<b class="exam-card-name">' + ten + "</b>" +
      '<span class="exam-card-note">' + mota + "</span>" +
      '<span class="exam-card-best">' +
        (best != null ? (eIco("trophy", "#f59e0b", 14) + " Cao nhất <b>" + best.toFixed(2) + "</b>") : "Chưa làm lần nào") +
      "</span></button>";
  }

  var deTuyenChon = (window.MOCK_EXAMS || []).map(function (e, i) {
    return the("TC" + (i + 1), "Tuyển chọn", e.name, "Câu do người soạn chọn tay");
  }).join("");
  var deMayLap = EXAM_CODES.map(function (code) {
    return the(code, "Máy lắp", "Mã đề " + code, "Máy tự lắp theo ma trận đề");
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

    '<div class="section-title" style="margin-top:26px">' + eIco("bookmark", "#0891b2", 18) + " Bộ đề cố định</div>" +
    '<p style="color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px">Mỗi đề dưới đây <b>luôn giữ nguyên câu hỏi</b>, nên làm lại là so được điểm với lần trước. Chọn một đề rồi quay lại sau vài tuần để đo tiến bộ.</p>' +
    '<div class="exam-grid" id="examFixedGrid">' + deTuyenChon + deMayLap + "</div>";

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
