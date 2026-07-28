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
    /* Đề kiểm tra trên lớp: 3 thẻ (lớp 10/11/12) nên xếp 3 cột cho cân */
    ".kt-grid{grid-template-columns:repeat(3,1fr)}" +
    "@media(max-width:520px){.kt-grid{grid-template-columns:1fr}}" +
    ".kt-spec{font-size:12px;color:var(--text-soft);font-weight:650}" +
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

/* ---------------------------------------------------------------------------
 *  ĐỀ KIỂM TRA TRÊN LỚP (1 tiết / cuối kì)
 *  Khác đề thi thử THPT ở hai chỗ: gói gọn trong MỘT lớp (kiểm tra lớp 11 thì
 *  chỉ hỏi nội dung lớp 11), và ngắn hơn cho vừa tiết học. Vẫn là chế độ THI:
 *  có đồng hồ, làm hết rồi nộp, xem lời giải sau khi nộp, hiển thị cuộn dọc.
 *  Mỗi đề CỐ ĐỊNH theo mã (PRNG có seed) nên làm lại vẫn ra đúng đề đó để so
 *  điểm với lần trước — giống 10 đề tuyển chọn.
 * ------------------------------------------------------------------------- */
var KIEM_TRA = {
  "1tiet":  { ten: "1 tiết",  mc: 16, tf: 4, minutes: 45 },
  "cuoiki": { ten: "cuối kì", mc: 24, tf: 4, minutes: 50 },
};
var KT_LOP = [10, 11, 12];
function ktCode(loai, lop) { return "KT-" + loai + "-" + lop; }

/* Mã đề là chuỗi -> băm ra số để làm seed cho PRNG (đề luôn giữ nguyên câu) */
function ktSeed(s) {
  var h = 2166136261;
  for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* Rải số câu cho các chủ đề CÓ TRONG lớp đó theo tỉ lệ câu sẵn có, để đề không
   dồn hết vào một chủ đề (lớp 12 chẳng hạn chỉ có 4 chủ đề trắc nghiệm). */
function ktChiaTheoChuDe(pool, tong, rnd) {
  if (!pool.length || tong <= 0) return [];
  var theo = {};
  pool.forEach(function (q) { (theo[q.topic] = theo[q.topic] || []).push(q); });
  var ma = Object.keys(theo).sort(function (a, b) { return theo[b].length - theo[a].length; });
  var phan = ma.map(function (t) { return { t: t, n: Math.floor(tong * theo[t].length / pool.length) }; });
  var du = tong - phan.reduce(function (s, p) { return s + p.n; }, 0);
  for (var i = 0; du > 0; i = (i + 1) % phan.length) { phan[i].n++; du--; }

  var out = [], daLay = {};
  phan.forEach(function (p) {
    examPick(theo[p.t], p.n, rnd).forEach(function (q) { out.push(q); daLay[q.id] = 1; });
  });
  // Chủ đề nào hụt câu thì bù từ phần còn lại của lớp, đừng trả về đề thiếu câu
  if (out.length < tong) {
    examPick(pool.filter(function (q) { return !daLay[q.id]; }), tong - out.length, rnd)
      .forEach(function (q) { out.push(q); });
  }
  return examShuffle(out, rnd).slice(0, tong);
}

function startKiemTra(loai, lop) {
  var c = KIEM_TRA[loai];
  if (!c) return;
  var code = ktCode(loai, lop);
  if (typeof Plan !== "undefined" && !Plan.deMo(code)) { Plan.upsell("exam"); return; }
  var rnd = examRng(ktSeed(code));
  var trongLop = function (t) {
    return QUESTION_BANK.filter(function (q) { return q.type === t && q.grade === lop; });
  };
  var mc = ktChiaTheoChuDe(trongLop("mc"), c.mc, rnd);
  var tf = ktChiaTheoChuDe(trongLop("tf"), c.tf, rnd);
  if (!mc.length && !tf.length) { if (typeof toast === "function") toast("Chưa đủ câu hỏi cho lớp " + lop + "."); return; }
  State.quiz = newQuiz(mc.concat(tf), "exam", {   // giữ Phần I → Phần II
    minutes: c.minutes, title: "Kiểm tra " + c.ten + " — Lớp " + lop, code: code,
  });
  go("quiz");
}

function startExamCode(code) {
  /* Gói free chỉ mở TC1 + mã 101, 102 (xem plan.js) — mọi lối vào đề cố định
     đều qua đây (thẻ đề, nút "Làm lại đề này" ở màn kết quả) nên chặn một chỗ đủ. */
  if (typeof Plan !== "undefined" && !Plan.deMo(code)) { Plan.upsell("exam"); return; }
  /* Mã "KT-1tiet-11" = đề kiểm tra trên lớp. Nhận ở đây để nút "Làm lại đề này"
     ở màn kết quả cũng chạy được. */
  if (typeof code === "string" && code.indexOf("KT-") === 0) {
    var p = code.split("-");
    startKiemTra(p[1], +p[2]);
    return;
  }
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

  /* Một thẻ đề: số thứ tự + điểm cao nhất đã đạt (hoặc nhãn Premium nếu khoá) */
  var theDe = function (code, ten, phu) {
    var best = examBestForCode(code);
    var khoa = typeof Plan !== "undefined" && !Plan.deMo(code);
    return '<button class="exam-card' + (khoa ? " plan-khoa" : "") + '" data-code="' + code + '">' +
      '<span class="exam-card-num">' + ten + "</span>" +
      '<span class="exam-card-best">' +
        (khoa ? (eIco("lock", "#b45309", 13) + " Premium")
          : best != null ? (eIco("trophy", "#f59e0b", 14) + " Cao nhất <b>" + best.toFixed(2) + "</b>") : phu) +
      "</span></button>";
  };
  var deCoDinh = EXAM_CODES.map(function (code, i) {
    return theDe(code, "Đề " + String(i + 1).padStart(2, "0"), "Chưa làm lần nào");
  }).join("");

  /* Thẻ đề kiểm tra trên lớp — có thêm dòng nói rõ bao nhiêu câu, mấy phút, vì
     mỗi loại một khác chứ không đồng nhất như 10 đề thi thử. */
  var theDeKT = function (loai, lop) {
    var c = KIEM_TRA[loai], code = ktCode(loai, lop);
    var best = examBestForCode(code);
    var khoa = typeof Plan !== "undefined" && !Plan.deMo(code);
    return '<button class="exam-card' + (khoa ? " plan-khoa" : "") + '" data-code="' + code + '">' +
      '<span class="exam-card-num">Lớp ' + lop + "</span>" +
      '<span class="kt-spec">' + (c.mc + c.tf) + " câu · " + c.minutes + " phút</span>" +
      '<span class="exam-card-best">' +
        (khoa ? (eIco("lock", "#b45309", 13) + " Premium")
          : best != null ? (eIco("trophy", "#f59e0b", 14) + " Cao nhất <b>" + best.toFixed(2) + "</b>")
          : "Chưa làm lần nào") +
      "</span></button>";
  };
  var khoiKT = function (loai, tieuDe, mauIcon, moTa) {
    return '<div class="section-title" style="margin-top:26px">' + eIco("clock", mauIcon, 18) + " " + tieuDe + "</div>" +
      '<p style="color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px">' + moTa + "</p>" +
      '<div class="exam-grid kt-grid">' + KT_LOP.map(function (l) { return theDeKT(loai, l); }).join("") + "</div>";
  };
  /* 3 đề biên soạn tay (MOCK_EXAMS, questions-vandung.js) hiện chung một màn */
  var deTay = (typeof MOCK_EXAMS !== "undefined" ? MOCK_EXAMS : []).map(function (e, i) {
    return theDe("TC" + (i + 1), "Biên soạn " + (i + 1), "Chưa làm lần nào");
  }).join("");
  var freeGhiChu = (typeof Plan !== "undefined" && !Plan.paid())
    ? ' Gói Miễn phí mở <b>Biên soạn 1</b>, <b>Đề 01, 02</b> và cả <b>3 đề kiểm tra 1 tiết</b> — làm lại thoải mái.' : "";

  app.innerHTML =
    '<button class="back-link" id="ecBack">' + eIco("aleft", null, 15) + " Về trang chủ</button>" +
    '<h2 style="margin-bottom:6px">' + eIco("exam", "#4f46e5", 22) + " Thi thử &amp; kiểm tra</h2>" +
    '<p style="color:var(--text-soft);font-size:14.5px;margin-bottom:16px">Đề thi thử THPT gồm ' + cauHinh +
      ". Bên dưới còn đề kiểm tra 1 tiết và cuối kì gói gọn trong từng lớp. " +
      "Đề nào cũng có đồng hồ, nộp bài xong mới hiện đáp án và lời giải từng câu." + freeGhiChu + "</p>" +

    '<button class="exam-start" id="ecRand">' +
      '<span class="exam-start-ic">' + eIco("dice", null, 26) + "</span>" +
      "<span><b>Thi thử ngay" +
        ((typeof Plan !== "undefined" && !Plan.has("exam_random")) ? " · Premium" : "") +
      "</b><small>Đề mới mỗi lần bấm — dùng khi muốn luyện nhiều đề khác nhau</small></span>" +
      '<span class="exam-start-go">' + eIco("aright", null, 20) + "</span>" +
    "</button>" +

    (deTay
      ? '<div class="section-title" style="margin-top:26px">' + eIco("bookmark", "#7c3aed", 18) + " Đề biên soạn</div>" +
        '<p style="color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px">Ba đề tuyển chọn tay, bám ma trận đề thật, <b>luôn giữ nguyên câu hỏi</b> và có lời giải từng câu.</p>' +
        '<div class="exam-grid">' + deTay + "</div>"
      : "") +

    '<div class="section-title" style="margin-top:26px">' + eIco("bookmark", "#0891b2", 18) + " 10 đề tuyển chọn</div>" +
    '<p style="color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px">Mười đề lắp theo đúng ma trận đề thật, <b>luôn giữ nguyên câu hỏi</b> — làm lại là so được điểm với lần trước. Chọn một đề rồi quay lại sau vài tuần để đo tiến bộ.</p>' +
    '<div class="exam-grid" id="examFixedGrid">' + deCoDinh + "</div>" +

    khoiKT("1tiet", "Kiểm tra 1 tiết", "#16a34a",
      "Đề 45 phút, <b>chỉ hỏi nội dung của lớp đó</b> — dùng khi sắp kiểm tra 1 tiết trên lớp. Đề cố định nên làm lại là so được điểm.") +
    khoiKT("cuoiki", "Kiểm tra cuối kì", "#d97706",
      "Đề 50 phút theo cấu trúc như đề thi thật (24 trắc nghiệm + 4 Đúng/Sai) nhưng gói trong một lớp — ôn trước kì thi cuối học kì.");

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
    if (typeof Plan !== "undefined" && !Plan.chanLuyen()) return; // dùng chung quỹ câu/ngày
    var n = Math.min(tfCfg.count, p.length);
    var qs = (typeof pick === "function") ? pick(p, n) : p.slice(0, n);
    if (typeof Plan !== "undefined") qs = Plan.catQuota(qs);
    State.quiz = newQuiz(qs, "practice", { title: "Luyện Đúng/Sai" });
    go("quiz");
  };
  upd();
}

window.renderExamCodes = renderExamCodes;
window.renderTFDrill = renderTFDrill;
window.startExamCode = startExamCode;
window.startKiemTra = startKiemTra;
