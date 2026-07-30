/* ============================================================================
 *  ỨNG DỤNG ÔN THI TIN HỌC THPT QUỐC GIA
 *  Vanilla JavaScript - không cần cài đặt, chạy trực tiếp trên trình duyệt.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 *  CẤU HÌNH ĐỀ THI THỬ (đúng cấu trúc CHÍNH THỨC đề THPT 2025 môn Tin học)
 *  - Phần I : 24 câu trắc nghiệm nhiều lựa chọn × 0,25đ = 6,0đ
 *  - Phần II: 4 câu đúng/sai (mỗi câu 4 ý)               = 4,0đ
 *  => Tổng 28 câu, 10 điểm, 50 phút.
 *  LƯU Ý: Môn Tin học KHÔNG có phần trả lời ngắn (khác Toán, Lí, Hóa, Sinh).
 *  Các câu trả lời ngắn trong ngân hàng vẫn được dùng cho chế độ Luyện tập.
 * ------------------------------------------------------------------------- */
const EXAM_CONFIG = {
  mc: 24,          // số câu Phần I  (trắc nghiệm nhiều lựa chọn)
  tf: 4,           // số câu Phần II (đúng/sai)
  sa: 0,           // Tin học không có phần trả lời ngắn
  minutes: 50,     // thời gian làm bài (phút)
};

/* Ma trận phân bổ đề thi thử (định hướng KHMT). Tổng MC = 24, tổng Đ/S = 4.
   Chủ đề F (lập trình/thuật toán) chiếm tỉ trọng lớn nhất, đúng như đề thật.

   NGOÀI chủ đề còn phân bổ theo LỚP: chỉ ràng buộc chủ đề thì đề bị lệch hẳn về
   lớp 10 (đo được: chỉ 23% câu là lớp 12) vì hai chủ đề nặng nhất — F (lập trình)
   và A (máy tính, dữ liệu) — trong chương trình này được dạy ở lớp 10-11.
   Nên với các chủ đề CÓ nội dung lớp 12 (B mạng nâng cao, D pháp luật số,
   E thiết kế web, G học máy) thì ưu tiên lấy câu lớp 12.

   Trần thực tế của tỉ lệ lớp 12 là ~39% (11/28 câu): F chiếm 9/24 câu trắc
   nghiệm mà chương trình không dạy lập trình ở lớp 12, nên không thể cao hơn. */
const EXAM_MATRIX = {
  mc: { A: 3, B: 3, C: 1, D: 3, E: 3, F: 9, G: 2 }, // = 24 câu
  tf: { E: 1, F: 3 },                                // = 4 câu
  /* Phân bổ lớp trong từng chủ đề; thiếu câu thì tự bù từ lớp khác cùng chủ đề */
  grade: {
    mc: {
      A: { 10: 2, 11: 1 },
      B: { 12: 2, 10: 1 },
      C: { 11: 1 },
      D: { 12: 2, 10: 1 },
      E: { 12: 2, 11: 1 },
      F: { 11: 5, 10: 4 },
      G: { 12: 2 },
    },
    tf: {
      E: { 12: 1 },
      F: { 11: 2, 10: 1 },
    },
  },
};

/* Thang điểm Phần II (đúng/sai) theo số ý đúng trong 1 câu 4 ý */
const TF_POINTS = { 0: 0, 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0 };
const MC_POINT = 0.25;   // điểm mỗi câu Phần I
const SA_POINT = 0.25;   // điểm mỗi câu Phần III

const STORE_KEY = window.STORE_KEY || "tinhoc_thpt_v1";   /* theo hồ sơ đang dùng, xem js/session.js */

/* ---------------------------------------------------------------------------
 *  TRẠNG THÁI ỨNG DỤNG
 * ------------------------------------------------------------------------- */
const State = {
  view: "home",
  quiz: null,        // bài đang làm
  settings: load("settings", { theme: "light" }),
  history: load("history", []),
  learned: load("learned", []),   // danh sách id bài học đã hoàn thành
  profile: load("profile", {}),   // hồ sơ: tên, giới tính, lớp, định hướng
};

const app = document.getElementById("app");

/* Chuyển tiến độ cũ sang id bài mới sau khi gộp 2 chương trình (chạy đúng 1 lần).
   Xem js/migrate-progress.js. Không có bảng ánh xạ thì bỏ qua, không lỗi. */
(function migrateLegacyProgress() {
  const MAP = window.LEGACY_LESSON_MAP;
  if (!MAP || load("mergedIds", false)) return;
  const doi = (id) => MAP[id] || id;
  const con = (id) => LESSONS.some((l) => l.id === id);   // chỉ giữ bài còn tồn tại

  const learned = [];
  State.learned.forEach((id) => {
    const m = doi(id);
    if (con(m) && learned.indexOf(m) < 0) learned.push(m);
  });
  State.learned = learned;

  State.history = State.history.map((h) =>
    h && h.lessonId && MAP[h.lessonId] ? Object.assign({}, h, { lessonId: MAP[h.lessonId] }) : h);

  save("learned", State.learned);
  save("history", State.history);
  save("mergedIds", true);
})();

/* ---------------------------------------------------------------------------
 *  TIỆN ÍCH LƯU TRỮ (localStorage)
 * ------------------------------------------------------------------------- */
function loadAll() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; } }
function load(key, def) { const all = loadAll(); return key in all ? all[key] : def; }
function save(key, val) { const all = loadAll(); all[key] = val; localStorage.setItem(STORE_KEY, JSON.stringify(all)); if (window.Account) Account.onSaved(key, val); }

/* ---------------------------------------------------------------------------
 *  TIỆN ÍCH CHUNG
 * ------------------------------------------------------------------------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function aIco(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; }
/* Màu theo lớp: 20/21/22 = Tin 10/11/12 (nhánh KHMT), 23/24 = Tin học ứng dụng */
function stageColor(s) { return s == 20 ? "#16a34a" : s == 21 ? "#3b82f6" : s == 22 ? "#d97706" : (s == 23 || s == 24) ? "#0891b2" : "#4f46e5"; }

/* Định hướng của bài học: "" = dùng chung cả hai định hướng; "khmt" / "udung" = chỉ riêng định hướng đó.
   Tính từ stage + topic + id, không cần lưu trường 'track' trên dữ liệu bài. */
const KHMT12_IDS = new Set(["C12-15", "C12-16", "C12-17", "C12-18", "C12-19", "C12-20", "C12-27", "C12-28", "C12-29", "C12-30"]);
function lessonTrack(l) {
  if (l.stage === 23 || l.stage === 24) return "udung";          // bản sạch Tin học ứng dụng
  if (l.stage === 21 && l.topic === "F") return "khmt";          // lập trình/thuật toán lớp 11 (KHMT)
  if (l.stage === 22 && KHMT12_IDS.has(l.id)) return "khmt";     // Học máy/KHDL/Mô phỏng lớp 12 (KHMT)
  return "";
}
/* Bài có hiện với định hướng trong hồ sơ không: chưa chọn -> hiện tất cả; bài chung luôn hiện. */
function visibleForTrack(l) {
  const t = (typeof State !== "undefined" && State.profile && State.profile.track) || "";
  if (!t) return true;
  const lt = lessonTrack(l);
  return !lt || lt === t;
}
/* Bài có hiện với hồ sơ hiện tại không (nay chỉ còn lọc theo định hướng —
   chương trình đã gộp về một bộ nội dung tự biên soạn duy nhất). */
function visibleForProfile(l) { return visibleForTrack(l); }
const TYPE_LABEL = { mc: "Trắc nghiệm", tf: "Đúng/Sai", sa: "Trả lời ngắn" };
const LEVEL_LABEL = { easy: "Nhận biết", medium: "Thông hiểu", hard: "Vận dụng" };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr, n) { return shuffle(arr).slice(0, n); }

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

/* Hộp thoại xác nhận trả về Promise<boolean> */
function confirmBox(title, body, okText = "Đồng ý", cancelText = "Hủy") {
  return new Promise((resolve) => {
    const modal = document.getElementById("modal");
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").textContent = body;
    const ok = document.getElementById("modalOk");
    const cancel = document.getElementById("modalCancel");
    ok.textContent = okText;
    cancel.textContent = cancelText;
    modal.hidden = false;
    const close = (val) => { modal.hidden = true; ok.onclick = cancel.onclick = null; resolve(val); };
    ok.onclick = () => close(true);
    cancel.onclick = () => close(false);
  });
}

/* Chuẩn hóa đáp án trả lời ngắn để so sánh */
function normSA(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, "").replace(",", ".");
}

/* Đếm số câu theo dạng */
function countByType(t) { return QUESTION_BANK.filter((q) => q.type === t).length; }

/* ---------------------------------------------------------------------------
 *  ĐIỀU HƯỚNG
 * ------------------------------------------------------------------------- */
/* Bảng ánh xạ view -> hàm render (dựng lại mỗi lần để bắt được window.* nạp sau) */
function viewRenderer(view) {
  const map = { home: renderHome, lessons: renderLessons, lesson: renderLesson, playground: renderPlayground, practiceSetup: renderPracticeSetup, quiz: renderQuiz, result: renderResult, history: renderHistory, vocab: window.renderVocabPage, achievements: (window.Gam && window.Gam.renderAchievements), examCodes: window.renderExamCodes, tfDrill: window.renderTFDrill, profile: window.renderProfile, sqlLab: window.renderSqlLab, gfxLab: window.renderGfxLab, account: window.renderAccount };
  return map[view] || renderHome;
}

/* Xưởng thực hành đang mở. Khai báo Ở ĐÂY, trên cả viewToHash: `let` có vùng chết
   (TDZ) nên nếu để dưới cuối tệp thì một lời gọi viewToHash sớm sẽ NÉM lỗi, mà
   `typeof` cũng không đỡ được. */
let pgLang = "python";

/* view + tham số  ->  chuỗi hash (nguồn sự thật của URL) */
function viewToHash(view, data) {
  switch (view) {
    /* Chặng nằm trong hash, không giữ trong biến: nhờ vậy nút Back của trình
       duyệt lùi từ bản đồ về màn chọn chặng, và vị trí cuộn nhớ được theo từng
       chặng riêng (xem scrollNho). */
    case "lessons": return "#/lessons" + (data && data.stage ? "/" + data.stage : "");
    case "lesson": return "#/lesson/" + encodeURIComponent((data && data.id) || "");
    /* Bốn xưởng thực hành có ĐỊA CHỈ RIÊNG. Trước đây mọi xưởng đều là #/playground:
       đổi tab không đổi URL, nên F5 là về Python, không gửi được link "vào thẳng
       xưởng SQL" cho bạn, và nút Back của trình duyệt không lùi giữa các tab.
       Không kèm lang thì hiểu là Python (giữ đúng link #/playground đã phát ra). */
    case "playground": {
      const lg = (data && data.lang) || pgLang;
      return "#/playground" + (lg && lg !== "python" ? "/" + lg : "");
    }
    case "sqlLab": return "#/sql-lab";
    case "gfxLab": return "#/graphics-lab";
    case "practiceSetup": return "#/practice" + (data && data.topic ? "?topic=" + encodeURIComponent(data.topic) : "");
    case "history": return "#/history";
    case "vocab": return "#/vocab";
    case "achievements": return "#/achievements";
    case "examCodes": return "#/exam";
    case "tfDrill": return "#/tf-drill";
    case "profile": return "#/profile";
    case "account": return "#/account";
    case "quiz": return "#/quiz";
    case "result": return "#/result";
    case "home":
    default: return "#/";
  }
}

/* hash hiện tại  ->  { view, data } (chịu được hash rỗng / lạ -> home) */
function parseHash() {
  let h = location.hash || "";
  if (h.charAt(0) === "#") h = h.slice(1);
  if (h.charAt(0) === "/") h = h.slice(1);
  let query = "";
  const qi = h.indexOf("?");
  if (qi >= 0) { query = h.slice(qi + 1); h = h.slice(0, qi); }
  const parts = h.split("/").filter((x) => x !== "");
  const seg = parts[0] || "";
  switch (seg) {
    case "lessons": {
      const st = parts[1] ? Number(parts[1]) : 0;
      return { view: "lessons", data: st ? { stage: st } : undefined };
    }
    case "lesson": return { view: "lesson", data: parts[1] ? { id: decodeURIComponent(parts[1]) } : undefined };
    /* #/playground/<python|web|sql|gfx>; #/sql-lab và #/graphics-lab giữ nguyên cho
       những link đã phát ra trước đây. Chữ lang lạ thì rơi về Python. */
    case "playground": {
      const HOP_LE = { python: 1, web: 1, sql: 1, gfx: 1 };
      const lg = parts[1] && HOP_LE[parts[1]] ? parts[1] : "python";
      return { view: "playground", data: { lang: lg } };
    }
    case "sql-lab": return { view: "playground", data: { lang: "sql" } };
    case "graphics-lab": return { view: "playground", data: { lang: "gfx" } };
    case "practice": {
      const m = /(?:^|&)topic=([^&]*)/.exec(query);
      return { view: "practiceSetup", data: m ? { topic: decodeURIComponent(m[1]) } : undefined };
    }
    case "history": return { view: "history", data: undefined };
    case "vocab": return { view: "vocab", data: undefined };
    case "achievements": return { view: "achievements", data: undefined };
    case "exam": return { view: "examCodes", data: undefined };
    case "tf-drill": return { view: "tfDrill", data: undefined };
    case "profile": return { view: "profile", data: undefined };
    case "account": return { view: "account", data: undefined };
    case "quiz": return { view: "quiz", data: undefined };
    case "result": return { view: "result", data: undefined };
    case "": return { view: "home", data: undefined };
    default: return { view: "home", data: undefined };
  }
}

/* Điều hướng: đặt hash tương ứng; hashchange -> renderFromHash sẽ render.
   Giữ nguyên chữ ký go(view, data) cho toàn bộ lời gọi sẵn có. */
let pendingNav = null;
function go(view, data) {
  pendingNav = { view, data };
  const h = viewToHash(view, data);
  if (location.hash === h) renderFromHash();   // cùng hash -> không tạo mục lịch sử mới -> render tay
  else location.hash = h;                       // khác hash -> hashchange -> renderFromHash
}

/* Render lại CÙNG màn hình mà KHÔNG nhảy lên đầu trang.
   Dùng khi người học đang nhìn giữa trang (bấm "Kiểm tra" ở cuối câu hỏi dài):
   cuộn lên đầu chỉ đúng khi CHUYỂN màn, còn làm mới tại chỗ thì phải giữ chỗ đọc. */
let keepScrollOnce = false;
function goStay(view, data) { keepScrollOnce = true; go(view, data); }

/* Nhớ vị trí cuộn theo TỪNG hash. Trước đây màn nào cũng bị kéo về đầu trang, nên
   học xong bài thứ 12 rồi thoát ra là phải cuộn lại từ đầu bản đồ để tìm bài 13 —
   mỗi bài một lần, cả trăm bài.
   Khoá theo hash chứ không theo tên view: mở bài khác là hash khác nên vẫn về đầu
   trang (đúng), còn quay lại đúng chỗ cũ thì trả lại đúng chỗ cũ. */
const scrollNho = new Map();
let hashTruoc = location.hash;
/* Hash vừa mở KÈM NEO (vào bài để xem đúng một khối, xem coNeo bên dưới). Chỗ cuộn
   sâu đó không được nhớ: nhớ rồi thì lần sau bấm ô BÀI HỌC của đúng bài ấy sẽ mở ra
   ở lưng trang, người học tưởng app cuộn bừa. */
let hashCoNeo = null;

/* Vẽ lại màn hiện tại sau khi đồng bộ xong: chỉ những màn ĐỌC tiến độ và KHÔNG
   giữ ô nhập của người học.
   Trước đây chỉ có "home" và "history". Đăng nhập trên máy mới rồi mở thẳng bản đồ
   lộ trình thì tiến độ tải về đủ (State.learned có 5 bài) nhưng màn hình vẫn báo
   0/34 — đúng cái người dùng báo là "đăng nhập mà không nhớ lịch sử học". Rời màn
   rồi vào lại mới thấy, nên dữ liệu không hề mất.
   Cố ý dùng danh sách CHO PHÉP, không dùng danh sách chặn: màn bài học và ba phòng
   code (playground / sqlLab / gfxLab) đang giữ code do người học tự gõ, vẽ lại là
   xoá sạch. Thêm màn mới mà quên khai ở đây thì chỉ chậm cập nhật một nhịp; quên
   chặn thì mất bài làm của các em. */
const VE_LAI_SAU_DONG_BO = new Set([
  "home", "history", "lessons", "practiceSetup", "achievements", "profile", "account",
]);

/* Đọc hash rồi render. Cả nút trong app lẫn Back/Forward đều đi qua đây. */
/* Bọc ngoài renderFromHash: ứng dụng dựng toàn bộ giao diện bằng JS từ ~40 tệp
   nạp nối nhau, chỉ cần MỘT tệp tải hỏng (mạng chập chờn, deploy dở) là <main>
   trống trơn và học sinh không hiểu chuyện gì. Thà báo lỗi và mời tải lại. */
function renderFromHash() {
  try {
    renderFromHashThat();
    window.__appDaVe = true;   // lưới an toàn trong index.html dựa vào cờ này
  } catch (e) {
    console.error("[app] Không dựng được màn hình:", e);
    baoLoiTai(e);
  }
}

function baoLoiTai(e) {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML =
    '<div style="max-width:520px;margin:56px auto;text-align:center;padding:0 20px">' +
    '<div style="font-size:44px;margin-bottom:8px">😵‍💫</div>' +
    '<h2 style="margin:0 0 10px">Trang chưa tải xong</h2>' +
    '<p style="color:var(--text-soft,#64748b);line-height:1.6;margin:0 0 20px">' +
    'Một phần dữ liệu bài học chưa tải được — thường do mạng chập chờn. ' +
    'Bấm nút dưới để tải lại, bài học và tiến độ của em vẫn còn nguyên.</p>' +
    '<button class="btn btn-primary" onclick="location.reload()">Tải lại trang</button>' +
    '<p style="color:var(--text-soft,#94a3b8);font-size:12px;margin-top:22px">Chi tiết: ' +
    esc(String((e && e.message) || e)).slice(0, 160) + "</p></div>";
}

function renderFromHashThat() {
  const parsed = parseHash();
  const view = parsed.view;
  const d = (pendingNav && pendingNav.view === view) ? pendingNav.data : parsed.data;
  pendingNav = null;
  // fallback cho màn tạm (dữ liệu chỉ có trong bộ nhớ) khi tải lại / mở link trực tiếp:
  if (view === "quiz" && !(typeof State !== "undefined" && State.quiz)) { go("home"); return; }
  if (view === "result" && !d) { go("history"); return; }
  State.view = view;
  if (view !== "lesson") LESSON_DANG_MO = null; // robot trợ lý dựa vào đây để biết ngữ cảnh
  const keepScroll = keepScrollOnce;
  keepScrollOnce = false;
  const prevY = window.scrollY;

  /* Vào bài để xem ĐÚNG MỘT KHỐI (ô "Mô phỏng" / "Thực hành" trên bản đồ gửi kèm
     data.tieu) thì màn hình tự cuộn tới khối đó ở cuối renderLesson — router phải
     tránh đường, không thì hai cú cuộn tranh nhau và khối kia luôn thắng. */
  const coNeo = !!(d && d.tieu);

  /* Ghi lại chỗ đang đứng của màn VỪA RỜI, rồi xem màn sắp vào đã từng ghé chưa.
     Màn vừa rời mà mở bằng NEO thì XOÁ chỗ đã nhớ chứ không ghi chỗ cuộn sâu ấy:
     ghi rồi thì lần sau bấm ô BÀI HỌC của đúng bài đó lại mở ra ở lưng trang, đúng
     chỗ khối thực hành — người học tưởng app cuộn bừa. */
  if (hashTruoc && hashTruoc !== location.hash) {
    if (hashTruoc === hashCoNeo) { scrollNho.delete(hashTruoc); hashCoNeo = null; }
    else scrollNho.set(hashTruoc, prevY);
  }
  hashTruoc = location.hash;
  if (coNeo) hashCoNeo = location.hash;
  const yCu = keepScroll ? prevY : scrollNho.get(location.hash);
  if (!keepScroll && yCu == null && !coNeo) window.scrollTo({ top: 0, behavior: "smooth" });
  (viewRenderer(view))(d);
  /* Đặt lại SAU khi DOM mới dựng xong: thay innerHTML có thể làm trang co lại rồi
     tụt cuộn, đặt trước thì mất tác dụng. */
  if (yCu != null && !coNeo) window.scrollTo(0, yCu);
}

window.addEventListener("hashchange", renderFromHash);

/* ===========================================================================
 *  TRANG CHỦ
 * ========================================================================= */
function renderHome() {
  /* Ba ô luyện/thi ở trang chủ là Premium; ba ô đầu (lý thuyết, thực hành, luyện
     nhanh 10 câu) miễn phí. Lộ trình bài học thì free hoàn toàn — luyện tập và
     thi thử có giới hạn nằm TRONG lộ trình, nên gói Miễn phí vẫn ôn được, chỉ là
     phải đi theo tiến độ chứ không nhảy vào cày tự do. */
  const laPre = typeof Plan !== "undefined" && !Plan.paid();
  const khoaPre = laPre ? " khoa-pre" : "";
  const nhanPre = (mac) => (laPre ? "Premium" : mac);

  const totalQ = QUESTION_BANK.length;
  const learnedCount = State.learned.filter((id) => LESSONS.some((l) => l.id === id)).length;
  const ic = (n, e) => (typeof ICON === "function" ? ICON(n, 30) : e);

  /* Số bài thực hành: đếm ĐÚNG như demBaiTap() trong nhiem-vu.js — ba kho có máy
     chấm, KHÔNG tính GLAB vì phòng đồ hoạ là mô phỏng, không có đúng/sai để chấm.
     Đếm khác đi là trang chủ và nhiệm vụ tuần báo hai con số lệch nhau. */
  const soBaiTap = ["EXERCISES", "SQL_EXERCISES", "WEB_EXERCISES"].reduce((n, ten) => {
    const o = window[ten];
    if (!o) return n;
    if (Array.isArray(o)) return n + o.length;
    return n + Object.keys(o).reduce((m, k) => m + (Array.isArray(o[k]) ? o[k].length : 0), 0);
  }, 0);
  const btXong = (typeof GAM !== "undefined" && GAM.exDone && GAM.exDone.length) || 0;

  /* Nhãn ô Luyện nhanh phải khớp ĐÚNG ba nhánh của khoLuyenNhanh():
       - dưới 2 bài đã học  -> bốc từ 3 bài đầu lộ trình (KHÔNG phải bài đã học)
       - bài đã học chưa đủ 10 câu -> dự phòng bằng cả kho
       - còn lại -> đúng là từ bài đã học
     Ghi "Từ bài đã học" cho mọi trường hợp là nói sai với người mới vào. */
  const khoQuick = typeof khoLuyenNhanh === "function" ? khoLuyenNhanh() : null;
  const nhanQuick = !khoQuick || khoQuick === QUESTION_BANK
    ? "Cả kho câu"
    : learnedCount >= 2 ? "Từ bài đã học" : "Bài đầu lộ trình";

  // Bài đang học: lấy đúng bài mà trang Lộ trình đang mở, để hai nơi không lệch nhau
  const curL = pathState().cur;
  const contTitle = curL ? esc((curL.title || "").replace(/^Bài\s*\d+[.\s]*/, "")) : "";
  const continueHtml = curL
    ? `<div class="continue-card" id="continueCard" data-id="${curL.id}" role="button" tabindex="0" style="display:flex;align-items:center;gap:14px;background:var(--primary-soft);border:1px solid var(--primary);border-radius:var(--radius);padding:13px 16px;margin:2px 0 18px;cursor:pointer">
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:700;color:var(--primary);letter-spacing:.02em">${learnedCount ? "TIẾP TỤC HỌC" : "BẮT ĐẦU HỌC"}</div>
          <b style="display:block;font-size:16px;color:var(--text);margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Bài ${curL.order}: ${contTitle}</b>
          <small style="color:var(--text-soft)">${STAGES[curL.stage] ? aIco("book", stageColor(curL.stage), 13) + " " : ""}${esc(STAGES[curL.stage] || "")}</small>
        </div>
        <span class="btn btn-primary" style="white-space:nowrap;display:inline-flex;align-items:center;gap:6px">${typeof ICON === "function" ? ICON("play", 18) : "▶"} Vào học</span>
      </div>`
    : `<div style="display:flex;align-items:center;justify-content:center;gap:8px;background:var(--success-soft);border:1px solid var(--success);border-radius:var(--radius);padding:14px 16px;margin:2px 0 18px;color:var(--success);font-weight:600;text-align:center">${typeof ICON === "function" ? ICON("trophy", 18) : "🎉"} Bạn đã hoàn thành cả lộ trình! Ôn lại bài hoặc thi thử nhé.</div>`;

  /* Đang học ở chế độ khách: nói rõ tiến độ nằm ở đâu và mất khi nào — nói một
     lần ngay trên trang chủ, tử tế hơn là chặn đường bằng form đăng nhập. */
  const khachHtml = (window.Account && Account.laKhach && Account.laKhach())
    ? `<div class="guest-bar" id="guestBar">
        <span class="guest-ic">${aIco("bookmark", "#b45309", 18)}</span>
        <span class="guest-txt"><b>Đang học ở chế độ khách</b>
          <small>Tiến độ chỉ lưu trên máy này. Đăng nhập miễn phí để giữ lại và hỏi được gia sư AI.</small></span>
        <button class="btn btn-primary" id="guestLogin">Đăng nhập</button>
      </div>`
    : "";

  /* Khối giới thiệu chỉ hiện với người CHƯA bắt đầu học. Nó cao 322px và nằm ngay
     trên nút "Tiếp tục học", nên với người học quay lại mỗi ngày thì việc đầu tiên
     họ thấy là chữ quảng cáo, còn nút cần bấm bị đẩy xuống y=447 — gần nửa màn
     hình. Ô thống kê "x/119 bài" cũng trùng đúng badge của thẻ "Học lý thuyết".
     Vẫn giữ cho người mới: nhiều em vào /hoc thẳng từ trang giới thiệu hoặc từ
     Google, không có khối này thì không biết đây là cái gì. */
  const chuaBatDau = learnedCount === 0 && !State.history.length;
  const gioiThieuHtml = chuaBatDau ? `
    <section class="hero">
      <div class="hero-ic">${ic("cap", "🎓")}</div>
      <h1>Học & Ôn thi Tin học THPT</h1>
      <p>Tự học từ đầu theo lộ trình bài giảng, rồi luyện tập và thi thử bám sát cấu trúc đề chính thức.</p>
      <div class="hero-stats">
        <div class="hero-stat"><b>${LESSONS.length}</b><span>bài học</span></div>
        <div class="hero-stat"><b>${totalQ}</b><span>câu hỏi luyện tập</span></div>
        <div class="hero-stat"><b>${soBaiTap}</b><span>bài thực hành</span></div>
      </div>
    </section>` : "";

  app.innerHTML = `
    ${typeof profileGreeting === "function" ? profileGreeting() : ""}
    ${khachHtml}
    ${gioiThieuHtml}
    ${continueHtml}

    <div id="gamDash"></div>
    <div id="skillCard"></div>

    <div class="section-title">${aIco("cap", "#4f46e5", 18)} Bắt đầu học</div>
    <div class="mode-grid">
      <div class="mode-card" data-mode="lessons" style="border-color:var(--primary)">
        <div class="m-badge">${learnedCount}/${LESSONS.length} bài</div>
        <div class="m-icon">${ic("cap", "📖")}</div>
        <h3>Học lý thuyết</h3>
        <p>Lộ trình bài giảng từ số 0: lý thuyết, ví dụ code, tóm tắt điểm cần nhớ. Học đến đâu luyện tập đến đó.</p>
      </div>
      <div class="mode-card" data-mode="playground">
        <div class="m-badge">${btXong}/${soBaiTap} bài</div>
        <div class="m-icon">${ic("code", "💻")}</div>
        <h3>Thực hành</h3>
        <p>Viết & chạy <b>Python</b>, xem trước <b>HTML/CSS</b>, thực hành <b>SQL</b> và <b>đồ hoạ</b> ngay trên trình duyệt — không cần cài đặt.</p>
      </div>
      <div class="mode-card" data-mode="quick">
        <div class="m-badge">${nhanQuick}</div>
        <div class="m-icon">${ic("zap", "⚡")}</div>
        <h3>Luyện nhanh 10 câu</h3>
        <p>10 câu rút từ những bài em đã học, để khởi động và ôn lại, có lời giải tức thì.</p>
      </div>
      <div class="mode-card${khoaPre}" data-mode="practice" data-pre="phan1">
        <div class="m-badge">${nhanPre("Phần I")}</div>
        <div class="m-icon">${ic("target", "🎯")}</div>
        <h3>Luyện trắc nghiệm Phần 1</h3>
        <p>Dạng trắc nghiệm 4 đáp án — chọn chủ đề, lớp, mức độ. Xem đáp án và lời giải ngay sau mỗi câu.</p>
      </div>
      <div class="mode-card${khoaPre}" data-mode="tfdrill" data-pre="phan2">
        <div class="m-badge">${nhanPre("Phần II")}</div>
        <div class="m-icon">${ic("check", "✅")}</div>
        <h3>Luyện Phần 2 — Đúng/Sai</h3>
        <p>Chuyên luyện dạng Đúng/Sai 4 ý — phần dễ mất điểm nhất của đề, có cách tính điểm và lời giải chi tiết.</p>
      </div>
      <div class="mode-card${khoaPre}" data-mode="exam" data-pre="thithu">
        <div class="m-badge">${nhanPre(EXAM_CONFIG.minutes + " phút")}</div>
        <div class="m-icon">${ic("exam", "📝")}</div>
        <h3>Thi thử full 2 phần</h3>
        <p>Đề đầy đủ ${EXAM_CONFIG.mc} câu trắc nghiệm + ${EXAM_CONFIG.tf} câu Đúng/Sai, tính giờ, chấm thang 10 — làm lại để so tiến bộ.</p>
      </div>
    </div>

  `;
  /* Bỏ khối "Ôn theo từng chủ đề": bảy hàng chủ đề chỉ mở đúng màn mà ô "Luyện
     trắc nghiệm Phần 1" đã mở, chỉ khác là chọn sẵn chủ đề — trùng chức năng.
     Bỏ luôn khép được một chỗ lệch cửa: ô Phần 1 khoá theo gói và hiện lời mời
     nâng cấp, còn hàng chủ đề đi thẳng vào màn luyện tập không qua lời mời nào
     (quota ngày vẫn chặn ở bước bắt đầu luyện, nên không phải mở toang, nhưng
     hai cửa cùng đích mà một khoá một mở thì người dùng thấy tiền hậu bất nhất). */

  app.querySelectorAll(".mode-card").forEach((c) => c.onclick = () => {
    const mode = c.dataset.mode;
    /* Ô Premium: mời nâng cấp thay vì mở. Vẫn CHO BẤM chứ không chặn từ ngoài —
       không bấm được thì học sinh chẳng biết mình đang bỏ lỡ cái gì. */
    if (c.dataset.pre && typeof Plan !== "undefined" && !Plan.paid()) { Plan.upsell(c.dataset.pre); return; }
    if (mode === "exam") go("examCodes");
    else if (mode === "tfdrill") go("tfDrill");
    else if (mode === "quick") startQuick();
    else if (mode === "lessons") go("lessons");
    else if (mode === "playground") go("playground");
    else go("practiceSetup");
  });
  const cc = document.getElementById("continueCard");
  if (cc) { const goCur = () => go("lesson", { id: cc.dataset.id }); cc.onclick = goCur; cc.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goCur(); } }; }
  const gl = document.getElementById("guestLogin");
  if (gl) gl.onclick = () => go("account");
  if (typeof Gam !== "undefined") Gam.renderDashboard(document.getElementById("gamDash"));
  if (typeof skillRenderCard === "function") skillRenderCard();
}

/* ===========================================================================
 *  HỌC LÝ THUYẾT - danh sách bài & trình xem bài
 * ========================================================================= */
function isLearned(id) { return State.learned.includes(id); }

/* Trạng thái lộ trình — NGUỒN DUY NHẤT cho cả trang chủ lẫn trang lộ trình.
   Trước đây hai nơi tự tính riêng nên nói khác nhau: trang chủ gợi ý bài theo
   lớp trong hồ sơ, còn lộ trình khoá tuần tự từ bài đầu tiên -> học xong bài
   trang chủ gợi ý mà vào lộ trình vẫn thấy khoá. */
function pathState() {
  const sorted = LESSONS.slice().filter(visibleForProfile).sort((a, b) => a.stage - b.stage || a.order - b.order);
  const learned = sorted.map((l) => isLearned(l.id));
  const seq = ((State.profile && State.profile.mode) || "") === "tuantu";
  const grade = (State.profile && State.profile.grade) || "";

  /* Khoá tuần tự chỉ áp từ LỚP ĐANG HỌC trở đi: bài của lớp dưới coi như đã học
     ở trường nên luôn mở (người lớp 11 không phải cày lại toàn bộ Tin 10). */
  const lopDuoi = (l) => !!grade && Number(l.grade) < Number(grade);
  const unlocked = sorted.map((l, i) => {
    if (!seq) return true;
    if (lopDuoi(l)) return true;                  // bài lớp dưới: mở sẵn
    if (i === 0) return true;
    const truoc = sorted[i - 1];
    if (learned[i - 1] || lopDuoi(truoc)) return true;
    // Mở bài ĐẦU của mỗi nhánh thuộc lớp đang học (vd nhánh Tin học ứng dụng
    // lớp 11 xếp sau toàn bộ lớp 12, không nên bắt học hết lớp 12 mới tới).
    return truoc.stage !== l.stage && !!grade && Number(l.grade) <= Number(grade);
  });

  // Bài đang học = bài chưa học đầu tiên trong những bài ĐÃ MỞ KHOÁ.
  // Hồ sơ có ghi lớp -> ưu tiên bài chưa học của đúng lớp đó.
  let curIdx = -1;
  if (grade) curIdx = sorted.findIndex((l, i) => unlocked[i] && !learned[i] && String(l.grade) === grade);
  if (curIdx < 0) curIdx = sorted.findIndex((l, i) => unlocked[i] && !learned[i]);
  return { sorted, learned, unlocked, curIdx, cur: curIdx >= 0 ? sorted[curIdx] : null };
}
function markLearned(id, val) {
  const has = isLearned(id);
  if (val && !has) State.learned.push(id);
  if (!val && has) State.learned = State.learned.filter((x) => x !== id);
  save("learned", State.learned);
  if (val && !has && typeof Gam !== "undefined") Gam.onLessonDone(id);
  // Vừa học xong một bài là lúc tiến độ đáng giữ nhất -> mời đăng nhập (có tiết chế)
  if (val && !has && window.Account && Account.moiDangNhap) {
    setTimeout(function () { Account.moiDangNhap("hoc"); }, 700);
  }
  // Đếm lần "dùng thật" cho lời mời cài app / bật nhắc học (js/pwa.js, js/nhac.js)
  if (val && !has && window.Pwa) Pwa.dungThat();
  if (val && !has && window.Nhac) Nhac.dungThat();
}

/* Chương (nhóm bài) của từng lớp — dùng chung cho lộ trình và trang luyện tập. */
const LESSON_CHAPTERS = {
  20: [
    { name: "Máy tính, dữ liệu và số hoá", from: 1, to: 7, color: "#2563eb" },
    { name: "Mạng máy tính và Internet", from: 8, to: 10, color: "#0d9488" },
    { name: "An toàn và đạo đức số", from: 11, to: 14, color: "#d97706" },
    { name: "Thiết kế đồ hoạ", from: 15, to: 17, color: "#e11d48" },
    { name: "Lập trình Python", from: 18, to: 33, color: "#4f46e5" },
    { name: "Hướng nghiệp tin học", from: 34, to: 34, color: "#ea580c" },
  ],
  21: [
    { name: "Máy tính và hệ điều hành", from: 1, to: 5, color: "#2563eb" },
    { name: "Internet, lưu trữ và an toàn số", from: 6, to: 10, color: "#0d9488" },
    { name: "Cơ sở dữ liệu và SQL", from: 11, to: 18, color: "#7c3aed" },
    { name: "Kĩ thuật lập trình và thuật toán", from: 19, to: 32, color: "#4f46e5" },
    { name: "Hướng nghiệp tin học", from: 33, to: 33, color: "#ea580c" },
  ],
  22: [
    { name: "Trí tuệ nhân tạo", from: 1, to: 2, color: "#9333ea" },
    { name: "Mạng máy tính", from: 3, to: 7, color: "#0d9488" },
    { name: "Đạo đức và pháp luật số", from: 8, to: 8, color: "#d97706" },
    { name: "Thiết kế web (HTML và CSS)", from: 9, to: 19, color: "#e11d48" },
    { name: "Hướng nghiệp công nghệ thông tin", from: 20, to: 20, color: "#ea580c" },
    { name: "Học máy, Khoa học dữ liệu, Mô phỏng", from: 21, to: 30, color: "#9333ea" },
  ],
  23: [
    { name: "Thực hành cơ sở dữ liệu", from: 1, to: 8, color: "#7c3aed" },
    { name: "Chỉnh sửa ảnh và làm phim", from: 9, to: 15, color: "#e11d48" },
  ],
  24: [
    { name: "Kết nối thiết bị số", from: 1, to: 1, color: "#0d9488" },
    { name: "Dự án xây dựng trang web", from: 2, to: 7, color: "#e11d48" },
  ],
};
function chapterOfLesson(l) {
  var ds = LESSON_CHAPTERS[l.stage] || [];
  return ds.find(function (c) { return l.order >= c.from && l.order <= c.to; })
    || { name: "", color: "var(--primary)" };
}

/* Nhãn ngắn + phụ đề cho năm chặng, dùng ở màn chọn chặng. STAGES giữ tên đầy đủ
   ("Tin học 11 — Khoa học máy tính") quá dài cho ô vuông, nên tách làm hai dòng. */
const CHANG_NHAN = {
  20: { ten: "Tin học 10", phu: "Dùng chung cả hai định hướng", ico: "sprout" },
  21: { ten: "Tin học 11", phu: "Khoa học máy tính", ico: "code" },
  22: { ten: "Tin học 12", phu: "Khoa học máy tính", ico: "brain" },
  23: { ten: "Tin học 11", phu: "Tin học ứng dụng", ico: "monitor" },
  24: { ten: "Tin học 12", phu: "Tin học ứng dụng", ico: "globe" },
};

/* MÀN CHỌN CHẶNG — năm ô, bấm một ô mới vào bản đồ bên trong.
   Trước đây vào là đổ thẳng cả 21 chương của cả năm chặng vào một trang, phải
   cuộn rất lâu mới tới chặng mình đang học. */
function renderChonChang() {
  injectPathCss();
  const app = document.getElementById("app");
  const { sorted, learned, curIdx } = pathState();
  const curL = sorted[curIdx];
  const doneAll = learned.filter(Boolean).length;
  const pctAll = Math.round((doneAll / sorted.length) * 100);

  const stages = Object.keys(STAGES).map(Number).sort((a, b) => a - b);
  const oHtml = stages.map((st) => {
    const bai = sorted.map((l, i) => ({ l, i })).filter((x) => x.l.stage === st);
    const xong = bai.filter((x) => learned[x.i]).length;
    const pct = bai.length ? Math.round((xong / bai.length) * 100) : 0;
    const nh = CHANG_NHAN[st] || { ten: STAGES[st] || "Lớp " + st, phu: "", ico: "book" };
    const dangHoc = curL && curL.stage === st;
    const soChuong = (LESSON_CHAPTERS[st] || []).length;
    return `<button class="cc-o${dangHoc ? " dang-hoc" : ""}${pct === 100 ? " xong" : ""}" data-stage="${st}"
        style="--cc:${stageColor(st)}" aria-label="${esc(nh.ten + " " + nh.phu)} — ${xong}/${bai.length} bài đã học">
        ${dangHoc ? '<span class="cc-co">Đang học</span>' : ""}
        <span class="cc-ico">${aIco(nh.ico, null, 26)}</span>
        <span class="cc-ten">${esc(nh.ten)}</span>
        <span class="cc-phu">${esc(nh.phu)}</span>
        <span class="cc-bar"><span class="cc-fill" style="width:${pct}%"></span></span>
        <span class="cc-so">${xong}/${bai.length} bài${soChuong ? " · " + soChuong + " chương" : ""}</span>
      </button>`;
  }).join("");

  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Về trang chủ</button>

    <div class="path-hero-card">
      <div class="path-hero-glow"></div>
      <div class="path-hero-content">
        <div class="path-hero-badge">${aIco("flag", null, 14)} LỘ TRÌNH HỌC</div>
        <h2>Hành trình chinh phục Tin học</h2>
        <p>Chọn một chặng để bắt đầu.</p>

        <div class="path-progress-box">
          <div class="progress-track-wrapper">
            <div class="progress-fill" style="width:${pctAll}%"></div>
          </div>
          <div class="path-progress-stats">
            <span><b>${doneAll}</b> / ${sorted.length} bài đã học (${pctAll}%)</span>
            <span class="path-xp-badge">${aIco("zap", null, 13)} ${doneAll * 50} XP</span>
          </div>
        </div>
      </div>
      <div class="path-hero-mascot">
        <div class="path-mascot-speech">${curL ? "Mình đang ở " + esc(CHANG_NHAN[curL.stage] ? CHANG_NHAN[curL.stage].ten : "") + " nhé!" : "Bắt đầu từ Tin học 10 nhé!"}</div>
        <img src="${mascotSrc("asset/mascot/poses/celebrate-jump.png")}" alt="Linh vật" />
      </div>
    </div>

    <div class="cc-luoi">${oHtml}</div>`;

  document.getElementById("back").onclick = () => go("home");
  app.querySelectorAll(".cc-o").forEach((b) => {
    b.onclick = () => go("lessons", { stage: Number(b.dataset.stage) });
  });
}

/* Bốn loại ô phụ trên bản đồ lộ trình. Màu tách hẳn khỏi màu chương để nhìn một
   cái là biết ô này không phải bài học: xem chapHtml trong renderLessons. */
const TEN_XUONG_NGAN = { python: "Python", sql: "SQL", web: "HTML/CSS", gfx: "đồ hoạ" };
/* icon lấy từ js/icons.js (bộ nét vẽ dùng khắp app), KHÔNG dùng emoji: emoji mỗi
   hệ điều hành vẽ một kiểu, cỡ không khớp icon xung quanh và không nhận màu. */
const O_PHU = {
  mophong: { nhan: "Mô phỏng", icon: "bulb", mau: "#0891b2" },
  thuchanh: { nhan: "Thực hành", icon: "code", mau: "#7c3aed" },
  luyen: { nhan: "Luyện tập", icon: "target", mau: "#16a34a" },
  thi: { nhan: "Thi thử", icon: "flag", mau: "#dc2626" },
};

function renderLessons(data) {
  if (!data || !data.stage) { renderChonChang(); return; }
  injectPathCss();
  // Dùng chung trạng thái với trang chủ (xem pathState) để không nói khác nhau
  const { sorted, learned, unlocked, curIdx: currentIdx } = pathState();
  const CHANG = data.stage;
  /* Chỉ số trong `sorted` là chỉ số TOÀN CỤC — learned/unlocked/currentIdx đều
     đánh theo nó, nên lọc theo chặng vẫn phải giữ nguyên chỉ số gốc. */
  const baiChang = sorted.map((l, i) => ({ l, i })).filter((x) => x.l.stage === CHANG);
  if (!baiChang.length) { go("lessons"); return; }
  const doneCount = baiChang.filter((x) => learned[x.i]).length;
  const pct = Math.round((doneCount / baiChang.length) * 100);
  const nhanChang = CHANG_NHAN[CHANG] || { ten: STAGES[CHANG] || "Lớp " + CHANG, phu: "" };

  const CHAPTERS = LESSON_CHAPTERS;
  const chapterOf = chapterOfLesson;

  // Điểm luyện tập tốt nhất theo từng bài (để tính sao mastery)
  const scoreByLesson = {};
  State.history.forEach((h) => {
    if (h && h.lessonId && h.total) {
      const s = h.correctCount / h.total;
      if (!(h.lessonId in scoreByLesson) || s > scoreByLesson[h.lessonId]) scoreByLesson[h.lessonId] = s;
    }
  });
  const starsFor = (s) => (s == null ? 0 : s >= 0.9 ? 3 : s >= 0.6 ? 2 : s > 0 ? 1 : 0);
  const starSvg = (on) => `<svg viewBox="0 0 24 24" class="pn-star${on ? " on" : ""}" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/></svg>`;

  // Gom chương -> bài, chỉ trong chặng đang xem (giữ nguyên thứ tự)
  const chaps = [];
  baiChang.forEach(({ l, i }) => {
    const cd = chapterOf(l);
    let c = chaps[chaps.length - 1];
    if (!c || c.name !== cd.name) { c = { name: cd.name, color: cd.color, items: [] }; chaps.push(c); }
    c.items.push({ l, gi: i });
  });

  /* ---- Các loại ô trên bản đồ ---------------------------------------------
     Trước đây bản đồ chỉ có ô bài học + một ô "rương thưởng" cứ 4 bài một lần,
     mà rương chỉ đổi hình chứ bấm vào vẫn ra đúng bài học đó -> không khác gì ô
     thường. Giờ bỏ rương, thay bằng 4 loại ô lấy từ nội dung THẬT của bài:
       mophong  – bài có minh hoạ tương tác (js/minh-hoa*.js)
       thuchanh – bài có bài tập tự viết code (EXERCISES / SQL / WEB / GLAB)
       luyen    – cuối mỗi chương: biết đáp án ngay từng câu, chấm 3 sao
       thi      – cuối mỗi chặng: có đếm giờ, làm xong mới trả kết quả
     Ô phụ KHÔNG tính vào tiến độ mở khoá: learned/unlocked/curIdx vẫn chỉ đánh
     theo bài học, nên thêm ô mới không đẩy ai đang học dở về trạng thái khoá. */
  const coMinhHoa = (id) => {
    try { return !!(window.MinhHoa && MinhHoa.coBai().indexOf(id) >= 0); } catch (e) { return false; }
  };
  const XUONG = [["python", "EXERCISES"], ["sql", "SQL_EXERCISES"], ["web", "WEB_EXERCISES"], ["gfx", "GLAB"]];
  const xuongCuaBai = (id) => {
    for (const [ten, bien] of XUONG) {
      const kho = window[bien];
      if (kho && kho[id] && kho[id].length) return { loai: ten, so: kho[id].length };
    }
    return null;
  };
  /* Điểm tốt nhất của một ô phụ — lấy từ lịch sử làm bài qua id tổng hợp
     ("LT:22:1", "TT:22"). Dùng chung đường ghi với luyện tập theo bài nên không
     phải thêm chỗ lưu mới, và đăng nhập rồi thì theo lên máy chủ luôn. */
  const diemO = (id) => {
    let best = null;
    State.history.forEach((h) => {
      if (h && h.lessonId === id && h.total) {
        const s = h.correctCount / h.total;
        if (best == null || s > best) best = s;
      }
    });
    return best;
  };
  /* Số đề THI THỬ TRONG LỘ TRÌNH đã làm (id tổng hợp bắt đầu bằng "TT:"). Chỉ đếm
     đề của lộ trình, không đếm đề ở mục Thi thử: mỗi đường có quyền lợi free
     riêng, trộn vào nhau thì làm 1 đề ở mục kia là mất luôn ô này. */
  const soDeDaThi = State.history.filter(
    (h) => h && h.mode === "exam" && typeof h.lessonId === "string" && h.lessonId.indexOf("TT:") === 0
  ).length;
  const traGoi = typeof Plan !== "undefined" && Plan.paid();
  /* Mốc mở ô thi thử: học xong 2/3 số bài của chặng. "Thời gian đầu chưa học đủ
     thì thi thử làm gì" — nên ô này phải là cửa ải cuối, không mở sẵn từ bài 1. */
  const mocThi = Math.ceil((baiChang.length * 2) / 3);

  const cellByKey = new Map();
  chaps.forEach((c, ci) => {
    const cells = [];
    c.items.forEach(({ l, gi }) => {
      cells.push({ loai: "bai", l, gi });
      if (coMinhHoa(l.id)) cells.push({ loai: "mophong", l, gi });
      const x = xuongCuaBai(l.id);
      if (x) cells.push({ loai: "thuchanh", l, gi, xuong: x.loai, soBt: x.so });
    });
    cells.push({ loai: "luyen", chuong: c, ci });
    if (ci === chaps.length - 1) cells.push({ loai: "thi" });
    cells.forEach((o, k) => {
      o.key = o.loai === "bai" ? o.l.id : `${o.loai}:${CHANG}:${ci}:${k}`;
      if (o.loai === "luyen") o.idDiem = `LT:${CHANG}:${ci}`;
      if (o.loai === "thi") o.idDiem = `TT:${CHANG}`;
      cellByKey.set(o.key, o);
    });
    c.cells = cells;
  });

  /* Hình học bản đồ — kiểu Duolingo: KHÔNG có đường nối, chỉ có các ô xếp thành
     làn sóng, nên bố cục do vị trí các ô tự nói lên.
     Bỏ đường nối cũng mở lại chỗ đặt chữ ngay dưới ô: trước đây phải đẩy chữ sang
     cạnh ô vì đường nối xuất phát từ tâm ô đi xuống và cắt qua chữ, giờ không còn
     đường thì dưới ô là chỗ sạch và cân nhất.
     Bề ngang: từ mép ngoài ô trái nhất tới mép ngoài ô phải nhất khoảng 5 ô. Ô
     rộng 68px nên tâm hai ô ngoài cùng cách nhau 4 ô; lấy biên độ 128 (thay vì
     136 đúng chằn) để chừa 8px lề, không thì vành nhấp nháy của ô đang học tràn
     ra khỏi thẻ. */
  const CELL = 68;                     // đường kính một ô
  /* Bề ngang = 2A + CELL. Muốn ≈ 5 ô thì 2A = 4·CELL, tức A = 2·CELL = 136; trừ
     8px lấy lề để vành nhấp nháy của ô đang học không tràn khỏi thẻ. */
  const A = 2 * CELL - 8;
  const IW = 340, CX = 170, STEP = 176, PADTOP = 78;
  const CAP_W = 190;                   // 190px/3 dòng: không cắt tên bài nào trong 119 bài
  const CAP_DY = 52;                   // hở từ tâm ô xuống đầu khối chữ (qua bóng nổi + vành)
  const CAP_BOT = 133;                 // chỗ chừa dưới ô cuối cho khối chữ của nó
  const ic = (name) => (typeof ICON === "function" ? ICON(name) : "");

  /* Lấy mẫu hình sin, chu kì 8 ô, KHÔNG lệch pha — ô đầu tiên nằm đúng giữa rồi
     mới cong dần sang phải. Trước đây lệch pha +1 nên ô đầu đã ở sát rìa phải,
     vào màn là thấy bản đồ bắt đầu lệch hẳn một bên.
     Dùng sin chứ không chia đều (0 – 0,5 – 1) vì sin chậm dần khi tới hai đầu
     biên (bước 0,71 rồi 0,29) nên chỗ quay đầu trông mềm, còn chia đều thì mỗi
     bước bằng nhau, quay đầu ra gãy góc.
     Năm cột x rơi vào 42 – 80 – 170 – 260 – 298: đúng "tầm 5 ô" theo bề ngang. */
  const lech = (k) => Math.sin((Math.PI * 2 * k) / 8);

  /* Linh vật rải vào khoảng trống bên đối diện node cho bản đồ đỡ trống trải. */
  const MASCOT_BANDO = [
    "asset/mascot/scenes/cheer-pompom.png",
    "asset/mascot/scenes/pointing.png",
    "asset/mascot/scenes/thumbs-up.png",
    "asset/mascot/scenes/reading-tablet.png",
    "asset/mascot/scenes/wave.png",
    "asset/mascot/scenes/magnifier.png",
  ];

  const chapHtml = (c, chapIdx) => {
    const n = c.cells.length;
    const C = c.color || "var(--primary)";
    const pts = c.cells.map((o, k) => ({
      x: CX + lech(k) * A, y: PADTOP + k * STEP, o,
    }));
    const H = pts[pts.length - 1].y + CAP_BOT;

    const f1 = (v) => v.toFixed(1);

    /* Linh vật đứng NGANG TẦM ô, ở lề phía đối diện ô. Bỏ đường nối rồi thì dải
       giữa không còn gì chiếm, nhưng khối chữ nằm ngay dưới ô nên vẫn phải tránh:
       đặt ở tầm ô (y ± 34) thì trên là khối chữ bậc trước đã kết thúc, dưới là
       khối chữ bậc này còn chưa bắt đầu.
       Bỏ qua ô nằm sát trục giữa: bên nào cũng chật vì khối chữ 190px canh giữa
       dưới ô sẽ phủ gần hết bề ngang. */
    const macs = (() => {
      const ra = [];
      let truoc = -99;
      pts.forEach((p, k) => {
        if (ra.length >= 3 || k > n - 2 || k - truoc < 3) return;
        if (Math.abs(p.x - CX) < 60) return;
        truoc = k;
        const ben = p.x < CX ? "right:6px" : "left:6px";
        const img = MASCOT_BANDO[(CHANG + chapIdx + ra.length) % MASCOT_BANDO.length];
        ra.push(`<div class="pmascot" style="${ben};top:${f1(p.y - 42)}px">
            <img src="${mascotSrc(img)}" alt="" aria-hidden="true" draggable="false" loading="lazy" />
          </div>`);
      });
      return ra.join("");
    })();

    const nodes = pts.map((p) => {
      const o = p.o;
      /* Khối chữ NGAY DƯỚI ô, canh giữa theo ô. Kẹp trong khung vì ô ngoài cùng
         lệch tới 128px, canh giữa nguyên bản sẽ đẩy khối chữ 190px ra ngoài mép. */
      const capL = Math.max(4, Math.min(IW - CAP_W - 4, p.x - CAP_W / 2));
      const capStyle = `left:${f1(capL)}px;top:${f1(p.y + CAP_DY)}px`;
      /* Nửa bề ngang ô, để đặt left = tâm - nửa. Phải bằng ĐÚNG nửa bề rộng CSS
         (ô bài 68px, ô phụ 76px), không thì hai ô lẽ ra đối xứng lại lệch nhau. */
      const dat = (bk) => `left:${f1(p.x - bk)}px;top:${f1(p.y - bk)}px;--cc:${C}`;
      const capHtml = (nhan, mauNhan, ten, phai) =>
        `<div class="pn-cap" style="${capStyle}">
          <span class="pn-top"><span class="pn-num"${mauNhan ? ` style="color:${mauNhan}"` : ""}>${nhan}</span>${phai || ""}</span>
          <span class="pn-name">${ten}</span>
        </div>`;

      if (o.loai === "bai") {
        const gi = o.gi, l = o.l, done = learned[gi], open = unlocked[gi], cur = gi === currentIdx;
        const cls = done ? "done" : open ? "open" : "locked";
        const glyph = done ? ic("check") : open ? ic("play") : ic("lock");
        const name = esc((l.title || "").replace(/^Bài\s*\d+[.\s]*/, ""));
        const stTxt = done ? "đã học" : open ? "đang học" : "chưa mở khóa";
        const hasQuiz = l.quiz && l.quiz.length;
        const stars = done && hasQuiz ? starsFor(scoreByLesson[l.id]) : -1;
        const starsHtml = stars >= 0 ? `<span class="pn-stars" title="Mastery: ${stars}/3 sao">${[0, 1, 2].map((i) => starSvg(i < stars)).join("")}</span>` : "";
        /* Bài khoá phải nói RÕ phải học xong bài nào mới mở, chứ "hãy hoàn thành bài
           trước" thì học sinh còn phải tự đi tìm bài trước là bài nào. */
        const truoc = open ? null : sorted[gi - 1];
        const khoaBai = truoc
          ? `Học xong Bài ${truoc.order} — ${(truoc.title || "").replace(/^Bài\s*\d+[.\s]*/, "")} thì bài này mở`
          : "Bài này chưa mở khoá trong lộ trình tuần tự";
        return `<button class="pnode ${cls}${cur ? " cur" : ""}" data-key="${esc(o.key)}" data-lock="${open ? 0 : 1}" data-khoa="${esc(khoaBai)}" style="${dat(CELL / 2)}" title="${esc(l.title)}" aria-label="Bài ${l.order}: ${name} — ${stTxt}">
            ${cur ? '<span class="pn-bubble">BẮT ĐẦU 🔥</span>' : ""}
            <span class="pnode-inner-icon">${glyph}</span>
          </button>
          ${capHtml("Bài " + l.order, null, name, starsHtml)}`;
      }

      // ---- Ô phụ: mô phỏng / thực hành / luyện tập / thi thử ----
      const dang = O_PHU[o.loai];
      let open = true, ten = "", nhan = dang.nhan, khoaTxt = "";
      let starsHtml = "", pre = false;

      /* Ô phụ nằm trong trang bài học nên bài chưa mở thì nó cũng chưa mở — nói rõ
         như vậy, đừng để học sinh đoán tại sao bấm không vào được. */
      const vBai = o.l ? `Ô này nằm trong Bài ${o.l.order}, mà bài đó chưa mở khoá — học xong bài trước nó là mở cả hai` : "";

      if (o.loai === "mophong") {
        open = unlocked[o.gi];
        // Nhãn trên đã ghi "Mô phỏng" nên dòng dưới chỉ cần nói mô phỏng CÁI GÌ
        ten = open ? "Bấm từng bước, xem máy làm gì" : "Chưa mở — bài học chưa tới";
        khoaTxt = vBai;
      } else if (o.loai === "thuchanh") {
        open = unlocked[o.gi];
        ten = `${o.soBt} bài ${TEN_XUONG_NGAN[o.xuong] || "code"} — máy chấm`;
        khoaTxt = vBai;
        pre = typeof Plan !== "undefined" && !Plan.xuongMo(o.xuong, o.l);
      } else if (o.loai === "luyen") {
        const daHoc = c.items.filter((it) => learned[it.gi]).length;
        open = daHoc >= 1;
        ten = open ? "Ôn lại cả chương, biết đáp án ngay" : "Học xong 1 bài để mở";
        khoaTxt = "Học xong ít nhất 1 bài trong chương rồi quay lại ô luyện tập này nhé";
        const st = starsFor(diemO(o.idDiem));
        if (open) starsHtml = `<span class="pn-stars" title="Luyện tập: ${st}/3 sao">${[0, 1, 2].map((i) => starSvg(i < st)).join("")}</span>`;
      } else if (o.loai === "thi") {
        open = doneCount >= mocThi;
        pre = open && !traGoi && soDeDaThi >= 1;
        const d = diemO(o.idDiem);
        ten = open
          ? (d != null ? `Điểm cao nhất: ${(d * 10).toFixed(1)}/10` : "50 phút, làm xong mới trả kết quả")
          : `Cần học ${mocThi} bài của chặng (đang ${doneCount})`;
        khoaTxt = `Ô thi thử mở khi em học xong ${mocThi}/${baiChang.length} bài của chặng này — hiện tại ${doneCount} bài`;
      }

      /* Ô mô phỏng / thực hành nằm ngay dưới bài của nó, nhìn thì rõ thuộc bài nào,
         nhưng đọc bằng màn hình đọc thì không có "ngay dưới" -> nhắc tên bài. */
      const cuaBai = o.l ? " — " + (o.l.title || "").replace(/^Bài\s*\d+[.\s]*/, "") : "";
      const mota = `${dang.nhan}${cuaBai}: ${ten}` + (pre ? " (gói Premium)" : "") + (open ? "" : " (chưa mở)");
      return `<button class="pnode ophu o-${o.loai} ${open ? "open" : "locked"}${pre ? " o-pre" : ""}" data-key="${esc(o.key)}" data-lock="${open ? 0 : 1}" data-khoa="${esc(khoaTxt)}" style="${dat(38)}" title="${esc(mota)}" aria-label="${esc(mota)}">
          <span class="ophu-ic">${ic(open ? dang.icon : "lock")}</span>
          ${pre ? '<span class="ophu-pre">Premium</span>' : ""}
        </button>
        ${capHtml(nhan, dang.mau, ten, starsHtml)}`;
    }).join("");

    const cDone = c.items.filter((it) => learned[it.gi]).length, cAll = c.items.length, cOk = cDone === cAll;
    const cPct = Math.round((cDone / cAll) * 100);
    const hasCurrentItem = c.items.some((it) => it.gi === currentIdx);
    /* Mặc định CHỈ mở chặng đang học, còn lại thu hết: người dùng chọn chương
       trước rồi mới mở vào trong. Trước đây mở luôn cả chặng đầu và mọi chặng đã
       học dở nên vào màn là một dọc bản đồ trải ra, không còn chỗ để "chọn". */
    const defaultOpen = hasCurrentItem;
    const accordId = `chap-acc-${CHANG}-${chapIdx}`;

    return `<div class="pchap-accordion-card ${defaultOpen ? "is-open" : ""}" style="--cc:${C}">
        <div class="pchap-acc-header" data-target="${accordId}" role="button" tabindex="0"
             aria-expanded="${defaultOpen ? "true" : "false"}" aria-controls="${accordId}">
          <span class="pchap-acc-icon">${cOk && typeof ICON === "function" ? ICON("check", 18) : aIco("layers", null, 18)}</span>
          <div class="pchap-head-mid">
            <div class="pchap-title">${esc(c.name)}</div>
            <div class="pchap-bar" role="progressbar" aria-valuenow="${cPct}" aria-valuemin="0" aria-valuemax="100"
                 aria-label="Tiến độ chương ${esc(c.name)}"><div class="pchap-fill" style="width:${cPct}%"></div></div>
            <div class="pchap-sub">${cDone}/${cAll} bài đã hoàn thành</div>
          </div>
          <div class="pchap-head-right">
            <span class="pchap-badge-pct">${cPct}%</span>
            <span class="pchap-chev">${aIco("chevdown", null, 18)}</span>
          </div>
        </div>

        <div class="pchap-acc-body" id="${accordId}" ${defaultOpen ? "" : "hidden"}>
          <div class="pwrap" style="height:${H}px">${macs}${nodes}</div>
        </div>
      </div>`;
  };

  const chapsHtml = chaps.map((c, cIdx) => chapHtml(c, cIdx)).join("");

  /* Bảng chú giải các loại ô — chỉ liệt kê loại CÓ THẬT trong chặng đang xem, để
     không hứa ô mô phỏng ở chặng chẳng có bài nào có minh hoạ. */
  const loaiCo = new Set();
  chaps.forEach((c) => c.cells.forEach((o) => { if (o.loai !== "bai") loaiCo.add(o.loai); }));
  const chuGiai = `<div class="path-chugiai">
      <span class="pcg"><b class="pcg-ic pcg-bai">${ic("play")}</b>Bài học</span>
      ${Object.keys(O_PHU).filter((k) => loaiCo.has(k)).map((k) => `<span class="pcg"><b class="pcg-ic pcg-${k}">${ic(O_PHU[k].icon)}</b>${O_PHU[k].nhan}</span>`).join("")}
    </div>`;

  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Chọn chặng khác</button>

    <div class="path-hero-card" style="--cc:${stageColor(CHANG)}">
      <div class="path-hero-glow"></div>
      <div class="path-hero-content">
        <div class="path-hero-badge">${aIco("book", null, 14)} ${esc(nhanChang.phu || "Lộ trình học")}</div>
        <h2>${esc(nhanChang.ten)}</h2>
        <p>Chọn một chương để mở bản đồ. Trên bản đồ, ngoài ô bài học còn có ô mô phỏng, thực hành, luyện tập và thi thử cuối chặng.</p>

        <div class="path-progress-box">
          <div class="progress-track-wrapper">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="path-progress-stats">
            <span><b>${doneCount}</b> / ${baiChang.length} bài đã học (${pct}%)</span>
            <span class="path-xp-badge">${aIco("zap", null, 13)} ${doneCount * 50} XP</span>
          </div>
        </div>
      </div>
      <div class="path-hero-mascot">
        <div class="path-mascot-speech">${pct === 100 ? "Chặng này xong hết rồi!" : "Cùng học tiếp nhé!"}</div>
        <img src="${mascotSrc("asset/mascot/poses/celebrate-jump.png")}" alt="Linh vật" />
      </div>
    </div>

    ${chuGiai}
    <div class="pathroot">${chapsHtml}</div>`;

  document.getElementById("back").onclick = () => go("lessons");
  
  /* Mở ra / thu vào từng chương. Mỗi lúc CHỈ một chương mở: bản đồ một chương đã
     dài cả nghìn pixel, mở nhiều cái cùng lúc thì cuộn mãi không thấy chương sau. */
  const datMo = (hdr, mo) => {
    const card = hdr.closest(".pchap-accordion-card");
    const body = document.getElementById(hdr.dataset.target);
    card.classList.toggle("is-open", mo);
    body.hidden = !mo;
    hdr.setAttribute("aria-expanded", mo ? "true" : "false");
    /* Chỉ QUAY mũi chevron bằng CSS, không đổi icon. icons.js không có "chevup":
       aIco rơi về icon mặc định là dấu tích trong vòng tròn, nên chương đang mở
       lại hiện dấu ✓ — dễ đọc thành "đã hoàn thành". */
  };
  app.querySelectorAll(".pchap-acc-header").forEach((hdr) => {
    const bat = () => {
      const dangMo = hdr.closest(".pchap-accordion-card").classList.contains("is-open");
      app.querySelectorAll(".pchap-acc-header").forEach((h) => { if (h !== hdr) datMo(h, false); });
      datMo(hdr, !dangMo);
      if (!dangMo) hdr.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    hdr.onclick = bat;
    // Header là <div> nên phải tự nối bàn phím, không thì chỉ bấm chuột mới mở được
    hdr.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bat(); } };
  });

  app.querySelectorAll(".pnode").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const o = cellByKey.get(btn.dataset.key);
      if (!o) return;
      /* Ô nào khoá cũng phải nói ĐÚNG lý do vì sao chưa vào học được — mỗi loại ô
         khoá vì một lẽ khác nhau (chưa tới bài, chưa học bài nào trong chương, chưa
         đủ 2/3 chặng), nói chung một câu thì học sinh không biết phải làm gì. */
      if (btn.dataset.lock === "1") {
        toast("🔒 " + (btn.dataset.khoa || "Ô này chưa mở khoá — hãy học tiếp lộ trình nhé"));
        return;
      }
      /* Ô mô phỏng / thực hành đưa về đúng bài rồi cuộn tới khối đó — nội dung đã
         nằm trong trang bài học, không dựng lại lần nữa ở chỗ khác. */
      if (o.loai === "bai") { go("lesson", { id: o.l.id }); return; }
      if (o.loai === "mophong") { go("lesson", { id: o.l.id, tieu: "mophong" }); return; }
      if (o.loai === "thuchanh") { go("lesson", { id: o.l.id, tieu: "thuchanh" }); return; }
      if (o.loai === "luyen") { batDauLuyenChuong(o.chuong, o.idDiem); return; }
      if (o.loai === "thi") {
        // Gói Miễn phí: thi thử 1 đề. Ô vẫn bấm được để biết mình đang bỏ lỡ gì.
        if (!traGoi && soDeDaThi >= 1) { Plan.upsell("thithu_chang"); return; }
        batDauThiChang(CHANG, nhanChang.ten, o.idDiem);
      }
    };
  });

  // Tự cuộn tới bài đang học
  const curEl = app.querySelector(".pnode.cur");
  if (curEl && doneCount > 0) requestAnimationFrame(() => curEl.scrollIntoView({ block: "center" }));
}

/* CSS cho màn chọn chặng và bản đồ lộ trình (kiểu Duolingo) */
function injectPathCss() {
  if (document.getElementById("pl-css")) return;
  const s = document.createElement("style");
  s.id = "pl-css";
  s.textContent =
    ".path-hero-card { display: flex; align-items: center; justify-content: space-between; gap: 20px; background: linear-gradient(135deg, #ff007f 0%, #7928ca 50%, #4338ca 100%); color: #fff; padding: 20px 26px; border-radius: 22px; box-shadow: 0 9px 0 #4f107b, 0 18px 30px rgba(121, 40, 202, 0.32); margin-bottom: 22px; position: relative; overflow: hidden; border: 2px solid #ff66c4; }" +
    "[data-theme='dark'] .path-hero-card { background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #4338ca 100%); border-color: #a855f7; box-shadow: 0 14px 0 #3730a3, 0 25px 40px rgba(124, 58, 237, 0.45); }" +
    /* Màn chọn chặng có lưới ô rộng 760px nên banner nới theo cho thẳng lề; màn
   bản đồ giữ 520px bằng .pathroot. Trước đây banner luôn 924px, rộng hơn nội
   dung tới 404px ở màn bản đồ nên hai khối trông lệch hẳn nhau. */
    /* MỘT chỗ duy nhất quy định bề ngang khung, cho cả banner, bản đồ chương và
       lưới chọn chặng. Tách ra ba chỗ như trước là kiểu gì cũng lệch lại: banner
       từng để tự giãn 924px trong khi nội dung chỉ 520-760px. */
    ".path-hero-card, .pathroot, .cc-luoi { max-width: 760px; margin-left: auto; margin-right: auto; }" +
    ".path-hero-glow { position: absolute; inset: 0; background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%); pointer-events: none; }" +
    ".path-hero-content { flex: 1; z-index: 2; }" +
    ".path-hero-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 900; background: rgba(0, 0, 0, 0.28); padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 8px; letter-spacing: 0.05em; backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.25); }" +
    ".path-hero-content h2 { font-family: var(--font-display); font-size: clamp(21px, 3.4vw, 26px); font-weight: 900; margin-bottom: 5px; letter-spacing: -0.02em; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }" +
    ".path-hero-content p { font-size: 13.5px; opacity: 0.95; margin-bottom: 13px; line-height: 1.5; text-shadow: 0 1px 2px rgba(0,0,0,0.15); }" +
    ".path-progress-box { background: rgba(0, 0, 0, 0.32); padding: 11px 15px; border-radius: 15px; backdrop-filter: blur(10px); border: 1.5px solid rgba(255,255,255,0.2); }" +
    ".path-progress-stats { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: 8px; font-size: 12.5px; font-weight: 800; }" +
    ".path-xp-badge { font-family: var(--font-mono); color: #ffeb3b; background: rgba(0, 0, 0, 0.45); padding: 4px 12px; border-radius: 12px; border: 1.5px solid #ffee58; font-weight: 900; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }" +
    ".path-hero-mascot { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }" +
    ".path-mascot-speech { background: #fff; color: #0f172a; font-weight: 900; font-size: 11.5px; padding: 5px 12px; border-radius: 15px; white-space: nowrap; margin-bottom: 6px; box-shadow: 0 8px 20px rgba(0,0,0,0.25); animation: floatSpeech 3s ease-in-out infinite; border: 2.5px solid #ff007f; font-family: var(--font-display); }" +
    "@keyframes floatSpeech { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }" +
    ".path-hero-mascot img { width: 96px; height: 96px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.35)); animation: mascotHover 4s ease-in-out infinite; }" +
    "@keyframes mascotHover { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }" +

    ".pathroot { padding-bottom: 60px; }" +

    /* Chú giải loại ô — đứng trên danh sách chương, tự xuống dòng trên điện thoại */
    ".path-chugiai { max-width: 520px; margin: -8px auto 14px; display: flex; flex-wrap: wrap; gap: 6px 14px; justify-content: center; }" +
    ".pcg { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: var(--text-soft); }" +
    ".pcg-ic { width: 24px; height: 24px; border-radius: 8px; display: grid; place-items: center; flex: none; color: #fff; }" +
    ".pcg-ic svg { width: 14px; height: 14px; }" +
    ".pcg-bai { border-radius: 50%; background: linear-gradient(180deg, #ff007f, #d8006c); color: #fff; }" +
    ".pcg-mophong { background: linear-gradient(180deg, #22d3ee, #0891b2); }" +
    ".pcg-thuchanh { background: linear-gradient(180deg, #a78bfa, #7c3aed); }" +
    ".pcg-luyen { background: linear-gradient(180deg, #4ade80, #16a34a); }" +
    ".pcg-thi { background: linear-gradient(180deg, #fb923c, #dc2626); }" +

    /* MÀN CHỌN CHẶNG — năm ô. auto-fit + minmax để 5 ô tự xếp 3+2 trên máy tính,
       2+2+1 trên máy tính bảng, 1 cột trên điện thoại, không cần media query. */
    ".cc-luoi { padding-bottom: 60px; display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(216px, 1fr)); }" +
    ".cc-o { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left; padding: 18px 18px 16px; border-radius: 20px; border: 2px solid var(--border); background: var(--bg-card); cursor: pointer; font: inherit; color: var(--text); transition: transform .15s cubic-bezier(.16,1,.3,1), border-color .15s, box-shadow .15s; }" +
    ".cc-o:hover { transform: translateY(-3px); border-color: var(--cc); box-shadow: 0 10px 24px color-mix(in srgb, var(--cc) 22%, transparent); }" +
    ".cc-o:focus-visible { outline: 3px solid var(--cc); outline-offset: 2px; }" +
    ".cc-o.dang-hoc { border-color: var(--cc); box-shadow: 0 6px 0 color-mix(in srgb, var(--cc) 55%, #000); }" +
    ".cc-ico { width: 46px; height: 46px; border-radius: 15px; display: grid; place-items: center; background: color-mix(in srgb, var(--cc) 15%, transparent); color: var(--cc); margin-bottom: 8px; }" +
    ".cc-ten { font-family: var(--font-display); font-weight: 850; font-size: 17px; line-height: 1.2; }" +
    ".cc-phu { font-size: 12.5px; font-weight: 650; color: var(--text-soft); margin-bottom: 10px; }" +
    ".cc-bar { width: 100%; height: 8px; border-radius: 99px; background: var(--border); overflow: hidden; }" +
    ".cc-fill { display: block; height: 100%; border-radius: 99px; background: var(--cc); }" +
    ".cc-so { font-size: 12px; font-weight: 700; color: var(--text-soft); margin-top: 7px; font-family: var(--font-mono); }" +
    // Cờ "Đang học" đặt tuyệt đối nên phải chừa chỗ, không thì nó phủ lên góc ô
    ".cc-o.dang-hoc { padding-top: 34px; }" +
    ".cc-co { position: absolute; top: 12px; left: 18px; font-size: 10.5px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--cc); padding: 3px 9px; border-radius: 99px; }" +
    // Chặng học hết: đảo nền icon thành đặc để nhìn một cái là thấy khác hẳn
    ".cc-o.xong .cc-ico { background: var(--cc); color: #fff; }" +
    "@media (prefers-reduced-motion: reduce) { .cc-o { transition: none; } .cc-o:hover { transform: none; } }" +
    
    /* Thẻ Chặng Ngang Accordion Mở Ra / Thu Vào */
    ".pchap-accordion-card { background: var(--surface-card); border: 2.5px solid var(--border); border-radius: 24px; margin-bottom: 18px; overflow: hidden; box-shadow: 0 8px 0 var(--border), 0 12px 24px rgba(0,0,0,0.05); transition: all 0.25s ease; }" +
    ".pchap-accordion-card.is-open { border-color: var(--cc, var(--brand)); box-shadow: 0 10px 0 color-mix(in srgb, var(--cc) 70%, #000), 0 16px 32px rgba(0,0,0,0.08); }" +
    ".pchap-acc-header { display: flex; align-items: center; gap: 14px; padding: 16px 20px; cursor: pointer; user-select: none; background: var(--surface-card); transition: background 0.15s; }" +
    ".pchap-acc-header:hover { background: var(--bg-soft); }" +
    ".pchap-acc-header:focus-visible { outline: 3px solid var(--cc); outline-offset: -3px; }" +
    ".pchap-acc-icon { width: 42px; height: 42px; border-radius: 14px; background: color-mix(in srgb, var(--cc) 15%, transparent); color: var(--cc); display: grid; place-items: center; font-size: 20px; font-weight: 850; flex-shrink: 0; }" +
    // min-width:0 để tên chương dài co lại được, không thì nó đẩy phần % ra ngoài
    ".pchap-head-mid { flex: 1; min-width: 0; }" +
    ".pchap-title { font-family: var(--font-display); font-weight: 850; font-size: 16px; color: var(--text); line-height: 1.3; }" +
    // Thanh tiến độ từng chương — thấy ngay chương nào còn dở mà không cần mở ra
    ".pchap-bar { height: 8px; border-radius: 99px; background: var(--border); overflow: hidden; margin: 7px 0 5px; }" +
    ".pchap-fill { height: 100%; border-radius: 99px; background: var(--cc); transition: width .45s cubic-bezier(.16,1,.3,1); }" +
    ".pchap-sub { font-size: 12.5px; color: var(--text-soft); font-weight: 650; }" +
    ".pchap-head-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }" +
    ".pchap-badge-pct { font-family: var(--font-mono); font-weight: 900; font-size: 13px; background: color-mix(in srgb, var(--cc) 15%, transparent); color: var(--cc); padding: 5px 12px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--cc) 30%, transparent); }" +
    ".pchap-chev { color: var(--text-soft); transition: transform 0.2s; display: grid; place-items: center; }" +
    ".pchap-accordion-card.is-open .pchap-chev { transform: rotate(180deg); color: var(--cc); }" +
    "@media (prefers-reduced-motion: reduce) { .pchap-chev { transition: none; } }" +
    ".pchap-acc-body { padding: 10px 0 30px; border-top: 2px dashed var(--border); background: color-mix(in srgb, var(--cc) 3%, var(--bg-card)); animation: fadeInAcc 0.3s ease; }" +
    "@keyframes fadeInAcc { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }" +

    ".pwrap { position: relative; width: 340px; margin: 0 auto; }" +

    /* Linh vật trang trí: nằm dưới đường nối, không nhận chuột, không đọc màn hình */
    /* Khung CỐ ĐỊNH, không để ảnh tự quyết chiều cao: bộ ảnh linh vật có tỉ lệ
       khác nhau (đo được 79px tới 153px cùng bề rộng 74px), thả tự do thì không
       tính trước được nó có chạm vào dòng chữ bậc dưới hay không. */
    ".pmascot { position: absolute; width: 78px; height: 84px; z-index: 0; pointer-events: none; user-select: none; filter: drop-shadow(0 8px 16px rgba(0,0,0,.16)); animation: pmFloat 5s ease-in-out infinite; }" +
    ".pmascot img { width: 100%; height: 100%; display: block; object-fit: contain; object-position: bottom; }" +
    "@keyframes pmFloat { 0%,100% { transform: translateY(0) rotate(-2.5deg); } 50% { transform: translateY(-10px) rotate(2.5deg); } }" +

    /* Ô bài học nổi khối — z-index phải CAO HƠN .pn-cap để vòng tròn
       không bao giờ bị dòng chữ vẽ chồng lên (khoảng cách đã đủ, đây là chốt hạ) */
    ".pnode { position: absolute; width: 68px; height: 68px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 3; padding: 0; transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1); outline: none; }" +
    ".pnode-inner-icon svg { width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)); }" +
    ".pnode.done { background: linear-gradient(180deg, #58cc02 0%, #46a302 100%); color: #fff; box-shadow: 0 9px 0 #3b8a02, 0 15px 25px rgba(88, 204, 2, 0.45); border: 3px solid #79e622; }" +
    ".pnode.open { background: linear-gradient(180deg, #ff007f 0%, #d8006c 100%); color: #fff; box-shadow: 0 9px 0 #9e004f, 0 15px 25px rgba(255, 0, 127, 0.45); border: 3px solid #ff66c4; }" +
    ".pnode.locked { background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%); color: #9ca3af; box-shadow: 0 9px 0 #9ca3af; border: 3px solid #f3f4f6; opacity: 0.85; }" +
    "[data-theme='dark'] .pnode.locked { background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); color: #475569; box-shadow: 0 9px 0 #020617; border-color: #334155; }" +
    /* Ô phụ (mô phỏng / thực hành / luyện tập / thi thử): VUÔNG bo góc và to hơn
       ô bài học 8px, để phân biệt được cả khi không nhìn màu — người mù màu vẫn
       thấy đây không phải một bài học. Màu lấy theo từng loại ở O_PHU. */
    ".pnode.ophu { width: 76px; height: 76px; border-radius: 24px; }" +
    ".ophu-ic { display: flex; color: #fff; }" +
    ".ophu-ic svg { width: 34px; height: 34px; stroke-width: 2.2; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)); }" +
    ".pnode.ophu.locked .ophu-ic { color: #9ca3af; }" +
    "[data-theme='dark'] .pnode.ophu.locked .ophu-ic { color: #475569; }" +
    ".pnode.o-mophong.open { background: linear-gradient(180deg, #22d3ee 0%, #0891b2 100%); box-shadow: 0 9px 0 #0e6f8a, 0 15px 25px rgba(8, 145, 178, .42); border: 3px solid #67e8f9; }" +
    ".pnode.o-thuchanh.open { background: linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%); box-shadow: 0 9px 0 #5b21b6, 0 15px 25px rgba(124, 58, 237, .42); border: 3px solid #c4b5fd; }" +
    ".pnode.o-luyen.open { background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%); box-shadow: 0 9px 0 #15803d, 0 15px 25px rgba(22, 163, 74, .42); border: 3px solid #86efac; }" +
    ".pnode.o-thi.open { background: linear-gradient(180deg, #fb923c 0%, #dc2626 100%); box-shadow: 0 9px 0 #991b1b, 0 15px 25px rgba(220, 38, 38, .45); border: 3px solid #fdba74; }" +
    /* Ô thi thử là cửa ải cuối chặng — cho nó thở nhẹ để mắt bắt được ngay */
    ".pnode.o-thi.open { animation: oThiTho 2.6s ease-in-out infinite; }" +
    "@keyframes oThiTho { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-3px) scale(1.03); } }" +
    /* Nhãn PRO: ô vẫn bấm được (bấm ra lời mời nâng cấp), chỉ nhạt đi cho biết */
    ".pnode.o-pre { opacity: .82; }" +
    /* Chữ "Premium" chứ không phải "PRO": trang chủ và bảng giá đều gọi là Premium,
       hai tên cho cùng một gói là mời người ta hỏi "PRO với Premium khác gì nhau". */
    ".ophu-pre { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); background: #b45309; color: #fff; font-family: var(--font-mono); font-size: 9.5px; font-weight: 900; padding: 2px 7px; border-radius: 8px; border: 2px solid #fff; letter-spacing: .03em; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,.28); }" +
    ".pnode:hover { transform: translateY(-4px) scale(1.06); }" +
    ".pnode:active { transform: translateY(6px); box-shadow: 0 3px 0 rgba(0,0,0,.4) !important; }" +

    ".pnode.cur::after { content: ''; position: absolute; inset: -14px; border-radius: 50%; border: 4px solid #ffc107; animation: plpulse 1.6s ease-in-out infinite; pointer-events: none; box-shadow: 0 0 20px rgba(255, 193, 7, 0.6); }" +
    "@keyframes plpulse { 0%,100% { transform: scale(1); opacity: .8; } 50% { transform: scale(1.24); opacity: .2; } }" +
    
    ".pn-bubble { position: absolute; top: -38px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #ff9800, #ff5722); color: #fff; font-family: var(--font-display); font-size: 11.5px; font-weight: 900; padding: 5px 14px; border-radius: 16px; white-space: nowrap; z-index: 4; box-shadow: 0 6px 18px rgba(255, 87, 34, 0.5); border: 2px solid #fff; animation: bounceNav 2s infinite; letter-spacing: 0.03em; }" +
    "@keyframes bounceNav { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5px); } }" +
    /* Khối chữ nằm ngang tầm node: translateY(-50%) canh tâm bất kể cao 1 hay 2
       dòng. .tl = chữ ở bên phải node (canh lề trái), .tr = ngược lại. */
    ".pn-cap { position: absolute; width: 190px; text-align: center; pointer-events: none; z-index: 2; line-height: 1.25; }" +
    ".pn-num { display: block; font-size: 12px; font-weight: 900; color: var(--primary); font-family: var(--font-mono); }" +
    ".pn-name { font-size: 12.5px; font-weight: 800; color: var(--text); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; margin-top: 3px; font-family: var(--font-sans); }" +
    ".pn-top { display: flex; align-items: center; justify-content: center; gap: 6px; line-height: 1; margin-bottom: 2px; }" +
    ".pn-stars { display: inline-flex; gap: 3px; }" +
    ".pn-star { width: 14px; height: 14px; fill: var(--border); }" +
    ".pn-star.on { fill: #ffc107; filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.6)); }" +
    "@media (max-width: 560px) { .path-hero-mascot { display: none; } .path-hero-card { padding: 16px 18px; margin-bottom: 16px; } }" +
    /* Bản đồ có ba thứ động cùng lúc (linh vật trôi, vành nhấp nháy, bong bóng
       nhảy) — ai đặt hệ thống giảm hiệu ứng thì tắt hết cho đỡ chóng mặt. */
    ".pnode.o-thi.open:hover { animation: none; }" +   // để :hover nhấc ô lên được
    "@media (prefers-reduced-motion: reduce) { .pmascot, .pn-bubble, .pnode.cur::after, .pnode.o-thi.open { animation: none; } }";
  document.head.appendChild(s);
}

/* Định dạng nội dung nội tuyến: **đậm** -> <strong>, `mã` -> <code> */
/* Markdown gọn dùng chung cho MỌI nội dung do người soạn viết (bài học, câu hỏi,
   lựa chọn, mệnh đề Đúng/Sai, lời giải).
   Luật ĐẬM bám đúng markdown: KHÔNG có khoảng trắng ngay sau `**` mở và ngay
   trước `**` đóng. Bắt buộc chặt như vậy vì nội dung Python có toán tử luỹ thừa
   `2 ** 3` — luật lỏng sẽ bôi đậm nhầm cả đoạn (đã kiểm: 2.370 cụm đậm thật vẫn
   nhận đủ, 2 chuỗi bị bỏ qua đều đúng là toán tử **). */
function fmtInline(s) {
  return esc(s)
    .replace(/\*\*(?!\s)([^*]+?)(?<!\s)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>');
}

/* Như trên, thêm giữ xuống dòng — dùng cho câu hỏi và lời giải. */
function fmtQ(s) { return fmtInline(s).replace(/\n/g, "<br>"); }

/* Lời giải câu Đúng/Sai viết liền một mạch "(1) ... (2) ... (3) ... (4) ...",
   đọc trên màn hình thành khối chữ đặc, phải dò mắt mới biết ý nào ứng với mệnh
   đề nào. Tách mỗi ý một dòng.

   HAI CHỐT AN TOÀN, vì tách sai là MẤT CHỮ của lời giải:
     1. Chuỗi phải MỞ ĐẦU bằng một ý — có câu viết "Ý (2) sai: ... Còn lại đúng:
        (1) ...", cắt theo dấu ngoặc sẽ nuốt mất phần đầu.
     2. Ghép lại phải ra ĐÚNG chuỗi gốc, lệch một ký tự là trả null.
   Không thoả thì giữ nguyên một đoạn — thà xấu còn hơn thiếu.
   Đã kiểm trên cả 2.052 câu: tách được 576, giữ nguyên 1.476, mất chữ 0. */
function tachYGiaiThich(s) {
  const t = String(s || "").trim();
  const re = /(^|[.;!?]\s+)(\((?:[1-4]|[a-d])\))/g;
  const idx = [];
  let m;
  while ((m = re.exec(t))) idx.push(m.index + m[1].length);
  if (idx.length < 2 || idx[0] !== 0) return null;
  const ra = idx
    .map((p, i) => t.slice(p, i + 1 < idx.length ? idx[i + 1] : t.length).trim())
    .filter(Boolean);
  const gon = (x) => x.replace(/\s+/g, "");
  return gon(ra.join(" ")) === gon(t) ? ra : null;
}

/* Lời giải -> HTML: tách được thì mỗi ý một dòng, không thì giữ nguyên đoạn. */
function fmtGiaiThich(s) {
  const y = tachYGiaiThich(s);
  if (!y) return fmtQ(s || "");
  return '<ul class="gt-y">' + y.map((x) => "<li>" + fmtQ(x) + "</li>").join("") + "</ul>";
}

function renderBlocks(sections) {
  const fi = (s) => fmtInline(s).replace(/\n/g, "<br>");   // giữ xuống dòng trong đoạn văn
  return sections.map((b) => {
    if (b.t === "story") return `<div class="ls-story"><span class="ls-story-icon">${aIco("bulb", "#f59e0b", 18)}</span><div><b>Hình dung nhé:</b> ${fi(b.text)}</div></div>`;
    if (b.t === "text") return `<p class="ls-p">${fi(b.text)}</p>`;
    if (b.t === "h") return `<h3 class="ls-h">${esc(b.text)}</h3>`;
    if (b.t === "code") return `<pre class="q-code">${esc(b.code)}</pre>`;
    if (b.t === "list") return `${b.text ? `<p class="ls-p">${fi(b.text)}</p>` : ""}<ul class="ls-list">${b.items.map((i) => `<li>${fi(i)}</li>`).join("")}</ul>`;
    if (b.t === "note") return `<div class="ls-note"><b>${aIco("bulb", "#d97706", 15)} Lưu ý:</b> ${fi(b.text)}</div>`;
    if (b.t === "example") return `<div class="ls-ex"><div class="ls-ex-tag">Ví dụ</div>${b.text ? `<p class="ls-p">${fi(b.text)}</p>` : ""}${b.code ? `<pre class="q-code">${esc(b.code)}</pre>` : ""}${b.output != null ? `<div class="ls-out">${aIco("play", "#16a34a", 13)} Kết quả: <b>${esc(b.output)}</b></div>` : ""}</div>`;
    return "";
  }).join("");
}

function renderLesson(data) {
  const sorted = LESSONS.slice().sort((a, b) => a.stage - b.stage || a.order - b.order);
  const idx = sorted.findIndex((l) => l.id === data.id);
  const l = sorted[idx];
  if (!l) { go("lessons"); return; }
  LESSON_DANG_MO = l; // để robot trợ lý mở gia sư đúng bài này
  const done = isLearned(l.id);
  const prev = sorted[idx - 1], next = sorted[idx + 1];
  const runCode = firstRunnableCode(l);
  const webCode = (!runCode && lessonHasWeb(l)) ? WEB_STARTER : null;

  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Danh sách bài học</button>
    <div class="quiz-meta" style="margin-bottom:10px">
      <span class="pill type-mc">Bài ${idx + 1}/${sorted.length}</span>
      <span class="pill">Lớp ${l.grade}</span>
      <span class="pill">~${l.minutes} phút</span>
    </div>
    <h2 style="margin-bottom:8px">${esc(l.title)}</h2>
    <p style="color:var(--text-soft);font-size:15px;margin-bottom:18px">${fmtInline(l.intro)}</p>

    <div class="lesson-body">${renderBlocks(l.sections)}</div>

    <div class="ls-keypoints">
      <b>${aIco("bookmark", "#dc2626", 16)} Cần nhớ</b>
      <ul>${l.keypoints.map((k) => `<li>${fmtInline(k)}</li>`).join("")}</ul>
    </div>

    ${runCode ? `
    <div class="section-title" style="margin-top:22px">${aIco("monitor", "#0891b2", 17)} Thực hành ngay</div>
    <p style="color:var(--text-soft);font-size:13.5px;margin-bottom:10px">Đây là ví dụ của bài — sửa lại tùy ý rồi bấm ${aIco("play", "#16a34a", 13)} Chạy để xem kết quả thay đổi thế nào.</p>
    <div id="lessonPg"></div>` : webCode ? `
    <div class="section-title" style="margin-top:22px">${aIco("globe", "#0891b2", 17)} Thử làm trang web</div>
    <p style="color:var(--text-soft);font-size:13.5px;margin-bottom:10px">Sửa HTML/CSS bên dưới rồi bấm ${aIco("play", "#16a34a", 13)} Xem kết quả — trang web sẽ hiện ra ngay.</p>
    <div id="lessonPg"></div>` : ""}

    <div class="ls-actions">
      <button class="btn ${done ? "btn-ghost" : "btn-success"}" id="doneBtn">${aIco("check2", null, 15)} ${done ? "Đã học (bấm để bỏ)" : "Đánh dấu đã học"}</button>
      <button class="btn btn-primary" id="practiceBtn">${aIco("target", null, 16)} Luyện tập bài này</button>
      <button class="btn btn-ghost" id="tutorBtn" style="display:none">${aIco("bulb", "#d97706", 16)} Hỏi gia sư</button>
    </div>

    <div class="quiz-nav" style="margin-top:20px">
      <button class="btn btn-ghost" id="prevBtn" ${prev ? "" : "disabled"}>${aIco("aleft", null, 14)} Bài trước</button>
      <button class="btn btn-ghost" id="nextBtn" ${next ? "" : "disabled"}>${next ? `Bài tiếp theo ${aIco("aright", null, 14)}` : `Hết lộ trình ${aIco("flag", "#16a34a", 15)}`}</button>
    </div>
  `;
  /* Về đúng bản đồ của chặng chứa bài này, không về màn chọn chặng — thoát bài
     xong lại phải chọn chặng lần nữa thì thành thêm một cú bấm mỗi bài. */
  document.getElementById("back").onclick = () => go("lessons", { stage: l.stage });
  document.getElementById("doneBtn").onclick = () => { markLearned(l.id, !isLearned(l.id)); go("lesson", { id: l.id }); };
  document.getElementById("practiceBtn").onclick = () => practiceLesson(l);
  // Nút gia sư chỉ hiện khi máy chủ đã bật AI (Tutor tự gỡ nút nếu chưa bật)
  if (typeof Tutor !== "undefined") Tutor.batNut(document.getElementById("tutorBtn"), () => Tutor.moBai(l));
  document.getElementById("prevBtn").onclick = () => prev && go("lesson", { id: prev.id });
  document.getElementById("nextBtn").onclick = () => next && go("lesson", { id: next.id });
  attachRunButtons(app.querySelector(".lesson-body"));
  if (runCode) buildEditor(document.getElementById("lessonPg"), runCode);
  else if (webCode) buildWebEditor(document.getElementById("lessonPg"), webCode);
  /* Xưởng thực hành: gói free chỉ mở các bài thuộc chương đầu mỗi xưởng
     (plan.js quyết định); bài khoá thay bằng hộp Premium đứng đúng vị trí đó.
     Concept lab thuộc PHẦN HỌC nên luôn mở. */
  const xuongBiKhoa = (loai, ds) => {
    if (!ds || !ds.length || typeof Plan === "undefined" || Plan.xuongMo(loai, l)) return false;
    Plan.khoaXuongBox(loai, l, ds);   // truyền cả mảng để hộp khoá còn hiện được ĐỀ
    return true;
  };
  if (typeof injectExercises === "function" && !xuongBiKhoa("python", (window.EXERCISES || {})[l.id])) injectExercises(l);
  if (typeof injectSqlExercises === "function" && !xuongBiKhoa("sql", (window.SQL_EXERCISES || {})[l.id])) injectSqlExercises(l);
  if (typeof injectWebExercises === "function" && !xuongBiKhoa("web", (window.WEB_EXERCISES || {})[l.id])) injectWebExercises(l);
  if (typeof injectGraphicsLab === "function" && !xuongBiKhoa("gfx", (window.GLAB || {})[l.id])) injectGraphicsLab(l);
  if (typeof injectSoDo === "function") injectSoDo(l);   // đặt TRƯỚC lý thuyết
  if (typeof injectConceptLab === "function") injectConceptLab(l);
  if (typeof injectSaiODau === "function") injectSaiODau(l);
  if (typeof injectMinhHoa === "function") injectMinhHoa(l);
  if (typeof injectVocab === "function") injectVocab(l);
  const sgkT = document.getElementById("sgkToggle");
  if (sgkT) sgkT.onclick = () => {
    const p = document.getElementById("sgkPages");
    p.hidden = !p.hidden;
    sgkT.querySelector(".sgk-chev").innerHTML = aIco(p.hidden ? "play" : "chevdown", null, 14);
  };

  /* Vào từ ô "Mô phỏng" / "Thực hành" trên bản đồ thì cuộn thẳng tới khối đó —
     hai khối này nằm gần cuối trang bài, không cuộn thì mở ra chỉ thấy lý thuyết
     và tưởng bấm sai ô. Khối chưa dựng (bài bị khoá xưởng) thì bỏ qua, không nhảy. */
  if (data && data.tieu) {
    const chon = data.tieu === "mophong" ? ".mh" : ".ex-host, .sqx-host, .wbx-host, .glab-host, .plan-lockbox";
    /* setTimeout chứ KHÔNG requestAnimationFrame: tab đang ẩn thì trình duyệt
       không gọi rAF, mở app ở tab sau rồi quay lại là chẳng cuộn gì cả (đã đo).
       Chỉnh lại lần hai sau 400ms vì khối bài tập dựng xong mới biết cao bao nhiêu. */
    const nhay = () => {
      const o = app.querySelector(chon);
      if (!o) return false;
      /* Neo vào cả TIÊU ĐỀ của khối, và đặt tiêu đề ngay dưới thanh trên cùng thay
         vì canh giữa khối: canh giữa một khối cao thì lên màn là chữ cắt ngang lưng,
         nhìn hệt như app cuộn bừa. Thấy dòng "Bài thực hành..." ở trên cùng thì
         hiểu ngay là trang mở đúng vào mục mình bấm. */
      const cha = o.parentElement;
      const khoi = cha && cha !== app && cha.querySelector(".section-title") ? cha : o;
      const dich = window.scrollY + khoi.getBoundingClientRect().top - 78;
      window.scrollTo({ top: Math.max(0, dich), behavior: "auto" });
      // Nháy viền một nhịp cho mắt bắt được mình vừa được đưa tới đâu
      khoi.classList.add("neo-sang");
      setTimeout(() => khoi.classList.remove("neo-sang"), 1500);
      return true;
    };
    setTimeout(() => { if (nhay()) setTimeout(nhay, 400); }, 0);
  }
}

function practiceLesson(l) {
  // Chỉ lấy đúng những câu hỏi gắn với bài này (khớp lý thuyết đã học)
  const ids = l.quiz || [];
  const pool = QUESTION_BANK.filter((q) => ids.includes(q.id));
  if (!pool.length) { toast("Bài này chưa có câu luyện tập"); return; }
  if (typeof Plan !== "undefined" && !Plan.chanLuyen()) return; // hết quỹ câu/ngày của gói free
  let qs = shuffle(pool).slice(0, Math.min(10, pool.length));
  if (typeof Plan !== "undefined") qs = Plan.catQuota(qs);
  State.quiz = newQuiz(qs, "practice", { title: "Luyện tập: " + l.title, lessonId: l.id });
  go("quiz");
}

/* ===========================================================================
 *  THỰC HÀNH CODE - chạy Python ngay trên trình duyệt (Skulpt, offline)
 * ========================================================================= */
const DEFAULT_SNIPPET =
  "# Viết code Python rồi bấm ▶ Chạy\nten = \"bạn\"\nprint(\"Xin chào\", ten)\n\ntong = 0\nfor i in range(1, 6):\n    tong = tong + i\nprint(\"Tổng 1..5 =\", tong)";

const PG_SAMPLES = [
  { label: "Chào hỏi", code: "ten = input(\"Tên bạn là gì? \")\nprint(\"Xin chào,\", ten)" },
  { label: "Tính tổng 1..n", code: "n = 10\ntong = 0\nfor i in range(1, n + 1):\n    tong = tong + i\nprint(\"Tổng 1 đến\", n, \"là\", tong)" },
  { label: "Kiểm tra chẵn/lẻ", code: "so = 7\nif so % 2 == 0:\n    print(so, \"là số chẵn\")\nelse:\n    print(so, \"là số lẻ\")" },
  { label: "Giai thừa (đệ quy)", code: "def gt(n):\n    if n == 0:\n        return 1\n    return n * gt(n - 1)\n\nprint(\"5! =\", gt(5))" },
  { label: "Tìm số lớn nhất", code: "a = [3, 9, 1, 7, 4]\nmax_val = a[0]\nfor x in a:\n    if x > max_val:\n        max_val = x\nprint(\"Lớn nhất:\", max_val)" },
];

const WEB_STARTER =
  "<!-- Viết HTML rồi bấm ▶ Xem kết quả -->\n<h1>Trang web đầu tiên của em</h1>\n<p class=\"gioithieu\">Xin chào! Đây là trang web do em tự làm.</p>\n<a href=\"#\">Một liên kết</a>\n\n<style>\n  h1 { color: #4f46e5; }\n  .gioithieu { font-size: 18px; color: green; }\n</style>";

const WEB_SAMPLES = [
  { label: "Trang cơ bản", code: WEB_STARTER },
  { label: "Danh sách", code: "<h2>Việc cần làm hôm nay</h2>\n<ul>\n  <li>Học bài</li>\n  <li>Làm bài tập</li>\n  <li>Ôn thi Tin học</li>\n</ul>" },
  { label: "Màu & cỡ chữ (CSS)", code: "<p id=\"tieude\">Chữ to màu tím</p>\n<p class=\"phu\">Chữ nhỏ màu xám</p>\n\n<style>\n  #tieude { color: purple; font-size: 24px; }\n  .phu { color: gray; font-size: 13px; }\n</style>" },
  { label: "Liên kết & ảnh", code: "<h3>Trang giới thiệu</h3>\n<p>Xem thêm tại <a href=\"https://vi.wikipedia.org\">Wikipedia</a>.</p>\n<p>Một ô màu:</p>\n<div style=\"width:80px;height:80px;background:#4f46e5;border-radius:12px\"></div>" },
];

/* Đoạn mã có chạy được bằng Skulpt không? (loại trừ HTML, thao tác tệp, mã minh họa) */
function isRunnable(code) {
  if (!code || !code.trim()) return false;
  if (/[×→²³⁰¹₂₃…│├└┌┐┘┤┬┴┼]/.test(code)) return false; // ký hiệu minh họa / vẽ bảng, không phải Python
  if (/^\s*</m.test(code)) return false;             // HTML (bài thiết kế web)
  if (code.includes("{") && code.includes(";")) return false; // CSS (dict Python không có ';')
  if (/\bopen\s*\(/.test(code)) return false;         // đọc/ghi tệp (Skulpt không hỗ trợ)
  // Chỉ coi là Python chạy được khi THỰC SỰ có dấu hiệu cú pháp Python (tránh nhận nhầm
  // bảng/sơ đồ/khung minh họa của các bài Tin học ứng dụng thành mã Python).
  return /\bprint\s*\(/.test(code)
    || /\bdef\s+\w+\s*\(/.test(code)
    || /\bimport\s+\w/.test(code)
    || /\binput\s*\(/.test(code)
    || /\brange\s*\(/.test(code)
    || /\.(append|pop|sort|sorted|split|join|insert|remove|count|index|keys|values|items)\s*\(/.test(code)
    || /^\s*(for|while|if|elif|else|try|except)\b[^\n]*:\s*$/m.test(code)
    || /^\s*[A-Za-z_]\w*\s*=\s*[^=]/m.test(code);   // phép gán biến kiểu Python
}
function firstRunnableCode(lesson) {
  for (const b of lesson.sections) {
    if (b.t === "code" && isRunnable(b.code)) return b.code;
    if (b.t === "example" && b.code && isRunnable(b.code)) return b.code;
  }
  return null;
}

/* Đoạn mã là HTML hoặc CSS (để xem trước trực tiếp bằng iframe) */
function isWebCode(code) {
  if (!code || !code.trim()) return false;
  if (/^\s*<[a-zA-Z!]/m.test(code)) return true;                 // thẻ HTML
  if (code.includes("{") && code.includes(";") && /[a-z-]+\s*:/.test(code)) return true; // luật CSS
  return false;
}
function lessonHasWeb(lesson) {
  return lesson.sections.some((b) => b.t === "code" && isWebCode(b.code));
}

/* Bọc đoạn HTML/CSS thành một trang hoàn chỉnh để hiển thị trong iframe */
function previewDoc(code) {
  const isCssOnly = !/^\s*</m.test(code) && code.includes("{");
  const body = isCssOnly
    ? `<style>${code}</style>\n<h1>Tiêu đề mẫu</h1>\n<p>Đoạn văn mẫu để xem CSS áp dụng.</p>\n<a href="#">Một liên kết</a>`
    : code;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">` +
    `<style>body{font-family:'Segoe UI',system-ui,sans-serif;padding:14px;margin:0;color:#111;background:#fff;line-height:1.5}</style>` +
    `</head><body>${body}</body></html>`;
}

/* Chạy một đoạn Python, đưa kết quả vào phần tử outEl */
function runPython(code, outEl, runBtn) {
  outEl.hidden = false;
  outEl.textContent = "Đang tải trình chạy Python…";
  outEl.classList.remove("has-error");
  if (runBtn) runBtn.disabled = true;
  skulptReady().then(
    () => chayPython(code, outEl, runBtn),
    () => {
      outEl.textContent = "⚠ Trình chạy Python chưa tải được. Kiểm tra kết nối mạng rồi bấm Chạy lại.";
      outEl.classList.add("has-error");
      if (runBtn) runBtn.disabled = false;
    }
  );
}

/* Chạy thật, gọi khi Skulpt đã sẵn sàng */
function chayPython(code, outEl, runBtn) {
  outEl.textContent = "Đang chạy...";
  let buffer = "";
  Sk.configure({
    output: (t) => { buffer += t; outEl.textContent = buffer; },
    read: (name) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][name] === undefined)
        throw "Không tìm thấy mô-đun '" + name + "'";
      return Sk.builtinFiles["files"][name];
    },
    inputfun: (p) => window.prompt(p || "Nhập dữ liệu:") || "",
    inputfunTakesPrompt: true,
    __future__: Sk.python3,
  });
  if (runBtn) runBtn.disabled = true;
  const finish = () => { if (runBtn) runBtn.disabled = false; };
  Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<code>", false, code, true))
    .then(
      () => { if (!buffer) outEl.textContent = "✓ Chạy xong (không có kết quả in ra)."; finish(); },
      (err) => { outEl.textContent = "❌ Lỗi: " + String(err && err.toString ? err.toString() : err); outEl.classList.add("has-error"); finish(); }
    );
}

/* Tạo một khu soạn thảo + chạy code (có thể chỉnh sửa) */
function buildEditor(host, initialCode) {
  host.innerHTML = `
    <div class="pg">
      <div class="pg-bar">
        <span class="pg-title">${aIco("code", "#0891b2", 16)} Python — sửa thoải mái rồi chạy thử</span>
        <span class="pg-actions">
          <button class="btn btn-ghost pg-reset">${aIco("refresh", null, 14)} Đặt lại</button>
          <button class="btn btn-primary pg-run">${aIco("play", null, 14)} Chạy</button>
        </span>
      </div>
      <textarea class="pg-editor" spellcheck="false" rows="8"></textarea>
      <div class="pg-out-label">Kết quả</div>
      <pre class="pg-out"></pre>
    </div>`;
  const ta = host.querySelector(".pg-editor");
  const out = host.querySelector(".pg-out");
  ta.value = initialCode;
  host.querySelector(".pg-run").onclick = (e) => runPython(ta.value, out, e.target);
  host.querySelector(".pg-reset").onclick = () => { ta.value = initialCode; out.textContent = ""; out.classList.remove("has-error"); };
  ta.onkeydown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 4;
    }
  };
}

/* Khu soạn thảo HTML/CSS + xem trước trực tiếp (iframe, không chạy script) */
function buildWebEditor(host, initialCode) {
  host.innerHTML = `
    <div class="pg">
      <div class="pg-bar">
        <span class="pg-title">${aIco("globe", "#0891b2", 16)} HTML/CSS — sửa rồi bấm Xem kết quả</span>
        <span class="pg-actions">
          <button class="btn btn-ghost pg-reset">${aIco("refresh", null, 14)} Đặt lại</button>
          <button class="btn btn-primary pg-run">${aIco("play", null, 14)} Xem kết quả</button>
        </span>
      </div>
      <textarea class="pg-editor" spellcheck="false" rows="9"></textarea>
      <div class="pg-out-label">Kết quả hiển thị</div>
      <iframe class="pg-preview" sandbox="" title="Xem trước"></iframe>
    </div>`;
  const ta = host.querySelector(".pg-editor");
  const frame = host.querySelector(".pg-preview");
  ta.value = initialCode;
  const render = () => { frame.srcdoc = previewDoc(ta.value); };
  host.querySelector(".pg-run").onclick = render;
  host.querySelector(".pg-reset").onclick = () => { ta.value = initialCode; render(); };
  ta.onkeydown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = ta.selectionStart, en = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 2;
    }
  };
  render(); // hiển thị ngay lần đầu
}

/* Trang Thực hành độc lập (Python / HTML/CSS / SQL / Đồ hoạ) — xưởng đang mở giữ ở
   pgLang, khai báo ở đầu tệp vì viewToHash cần đọc (xem chú thích tại đó). */
function renderPlayground(data) {
  if (data && data.lang) pgLang = data.lang;
  const isPy = pgLang === "python";
  const isWeb = pgLang === "web";
  const isSql = pgLang === "sql";
  const isGfx = pgLang === "gfx";
  /* Trình chạy Python nạp theo nhu cầu (js/skulpt-lazy.js) nên LÚC DỰNG MÀN Sk gần
     như luôn chưa có — trước đây chỗ này báo đỏ "Trình chạy Python chưa sẵn sàng"
     cho mọi người, kể cả người bấm Chạy xong thấy chạy tốt. Nay chỉ còn một dòng
     nhắc trung tính, và skulptReady() tự xoá nó ngay khi tải xong; còn khi tải
     HỎNG thật thì runPython/execPython đã báo ngay tại ô kết quả. */
  const noSk = typeof Sk === "undefined";
  const samples = isPy ? PG_SAMPLES : isWeb ? WEB_SAMPLES : [];
  const descMap = {
    python: "Viết Python và chạy ngay tại đây — hỗ trợ biến, vòng lặp, hàm, danh sách, đệ quy...",
    web: "Viết HTML/CSS và xem trang web hiện ra ngay lập tức — không chạy JavaScript (an toàn).",
    sql: 'Viết SQL tuỳ ý và chạy ngay trên cơ sở dữ liệu mẫu (SQLite trong trình duyệt). Thử <code>SELECT</code>, <code>JOIN</code>, <code>GROUP BY</code>…',
    gfx: "Thử các thao tác đồ hoạ mô phỏng: chỉnh ảnh, xếp lớp, chọn vùng, pha màu, nối cặp, sắp trình tự.",
  };
  const desc = descMap[pgLang] || descMap.python;
  const samplesHtml = (isPy || isWeb) ? `
    <div class="chip-group" id="samples" style="margin-bottom:14px">
      <span style="align-self:center;color:var(--text-soft);font-size:13px;margin-right:4px">Ví dụ mẫu:</span>
      ${samples.map((s, i) => `<button class="chip" data-i="${i}">${esc(s.label)}</button>`).join("")}
    </div>` : "";
  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Về trang chủ</button>
    <h2 style="margin-bottom:6px">${aIco("monitor", "#0891b2", 22)} Thực hành</h2>
    <div class="chip-group" id="langToggle" style="margin-bottom:12px">
      <button class="chip ${isPy ? "active" : ""}" data-lang="python">${aIco("code", null, 14)} Python</button>
      <button class="chip ${isWeb ? "active" : ""}" data-lang="web">${aIco("globe", null, 14)} HTML/CSS</button>
      <button class="chip ${isSql ? "active" : ""}" data-lang="sql">${aIco("layers", null, 14)} SQL</button>
      <button class="chip ${isGfx ? "active" : ""}" data-lang="gfx">${aIco("sprout", null, 14)} Đồ hoạ</button>
    </div>
    <p style="color:var(--text-soft);font-size:14px;margin-bottom:14px">${desc}</p>
    ${isPy && noSk ? `<div class="ls-note tin" id="pyTai">${aIco("bulb", "#0891b2", 15)} Lần chạy đầu cần mạng để tải trình chạy Python (~1&nbsp;MB), sau đó chạy được cả khi offline.</div>` : ""}
    ${samplesHtml}
    <div id="pgHost"></div>
  `;
  document.getElementById("back").onclick = () => go("home");
  if (isPy || isWeb) {
    const mount = (code) => isPy
      ? buildEditor(document.getElementById("pgHost"), code)
      : buildWebEditor(document.getElementById("pgHost"), code);
    mount(isPy ? ((data && data.code) || DEFAULT_SNIPPET) : WEB_STARTER);
    app.querySelectorAll("#samples .chip").forEach((b) => b.onclick = () => mount(samples[+b.dataset.i].code));
  } else if (isSql) {
    if (typeof window.renderSqlLabInner === "function") window.renderSqlLabInner(document.getElementById("pgHost"));
  } else if (isGfx) {
    if (typeof window.renderGfxLabInner === "function") window.renderGfxLabInner(document.getElementById("pgHost"));
  }
  /* Đổi tab là đổi URL (go mang lang theo), nhờ vậy Back lùi được về tab trước và
     link dán cho bạn mở đúng xưởng đó. */
  app.querySelectorAll("#langToggle .chip").forEach((b) => b.onclick = () => go("playground", { lang: b.dataset.lang }));
}

/* Gắn nút chạy/xem thử vào các khối code trong bài học */
function attachRunButtons(container) {
  if (!container) return;
  container.querySelectorAll("pre.q-code").forEach((pre) => {
    const code = pre.textContent;
    if (isRunnable(code)) {
      // Python: nút "Chạy thử" -> chạy bằng Skulpt, hiện kết quả
      const bar = document.createElement("div");
      bar.className = "code-run-bar";
      bar.innerHTML = `<button class="btn btn-ghost run-inline">${aIco("play", null, 14)} Chạy thử</button>`;
      const out = document.createElement("pre");
      out.className = "pg-out"; out.hidden = true;
      pre.after(out); pre.after(bar);
      bar.querySelector("button").onclick = (e) => runPython(code, out, e.target);
    } else if (isWebCode(code)) {
      // HTML/CSS: nút "Xem thử" -> hiển thị trong iframe
      const bar = document.createElement("div");
      bar.className = "code-run-bar";
      bar.innerHTML = `<button class="btn btn-ghost run-inline">${aIco("play", null, 14)} Xem thử</button>`;
      const frame = document.createElement("iframe");
      frame.className = "pg-preview"; frame.hidden = true; frame.setAttribute("sandbox", ""); frame.title = "Xem trước";
      pre.after(frame); pre.after(bar);
      bar.querySelector("button").onclick = () => { frame.hidden = false; frame.srcdoc = previewDoc(code); };
    }
  });
}

/* ===========================================================================
 *  THIẾT LẬP LUYỆN TẬP
 * ========================================================================= */
/* Luyện tập chia 4 cách chọn, mỗi cách một tab — người học biết ngay mình đang
   ôn phạm vi nào thay vì phải tự ghép các bộ lọc rời rạc. */
const PRACTICE_TABS = [
  { id: "bai", nhan: "Theo bài", ic: "book", mo: "Ôn đúng một bài — hợp khi vừa học xong bài đó." },
  { id: "chuong", nhan: "Theo chương", ic: "layers", mo: "Ôn trọn một chương — hợp khi kiểm tra 1 tiết." },
  { id: "chude", nhan: "Theo chủ đề", ic: "target", mo: "Ôn một mạch kiến thức xuyên suốt các lớp — hợp khi luyện thi tốt nghiệp." },
  { id: "lop", nhan: "Theo lớp", ic: "cap", mo: "Ôn tổng hợp cả một lớp — hợp khi thi học kì." },
  { id: "yeu", nhan: "Chỗ yếu", ic: "flame", mo: "Ôn đúng chủ đề bạn đang yếu, ưu tiên những câu đã từng làm sai." },
];
const setupCfg = { tab: "chude", topic: "all", grade: "all", type: "all", level: "all", lesson: "all", chapter: "", chapterStage: 0, weakTopic: "", count: 10, _gradeSynced: false };

function renderPracticeSetup(data) {
  if (data && data.topic) { setupCfg.tab = "chude"; setupCfg.topic = data.topic; }
  // Lần đầu vào luyện tập trong phiên: mặc định lọc theo lớp trong hồ sơ (nếu có)
  if (!setupCfg._gradeSynced) {
    const pg = (State.profile && State.profile.grade) || "";
    if (pg === "10" || pg === "11" || pg === "12") setupCfg.grade = pg;
    setupCfg._gradeSynced = true;
  }

  const tab = setupCfg.tab;
  const chip = (val, label, cur, group, extra) =>
    `<button class="chip ${val === cur ? "active" : ""}" data-group="${group}" data-val="${esc(val)}">${esc(label)}${extra ? ` <small>${esc(extra)}</small>` : ""}</button>`;

  const typeChips = [["all", "Tất cả"], ["mc", "Trắc nghiệm"], ["tf", "Đúng/Sai"], ["sa", "Trả lời ngắn"]];
  const levelChips = [["all", "Tất cả"], ["easy", "Nhận biết"], ["medium", "Thông hiểu"], ["hard", "Vận dụng"]];
  const gradeChips = [["10", "Lớp 10"], ["11", "Lớp 11"], ["12", "Lớp 12"]];

  /* Đếm nhanh số câu của một tổ hợp, để người học biết trước chỗ nào dày/mỏng */
  const demTheo = (fn) => QUESTION_BANK.filter(fn).length;

  /* ---------- thanh tab ---------- */
  const tabsHtml = PRACTICE_TABS.map((t) => {
    const khoa = t.id === "yeu" && typeof Plan !== "undefined" && !Plan.has("yeu");
    return `<button class="ptab ${t.id === tab ? "active" : ""}" data-tab="${t.id}">${aIco(t.ic, null, 15)} ${esc(t.nhan)}${khoa ? " " + aIco("lock", "#b45309", 12) : ""}</button>`;
  }).join("");
  const moTaTab = (PRACTICE_TABS.find((t) => t.id === tab) || {}).mo || "";

  /* ---------- phần chọn chính, tuỳ theo tab ---------- */
  const baiHienThi = LESSONS.filter(visibleForProfile).sort((a, b) => a.stage - b.stage || a.order - b.order);
  let phanChinh = "";

  if (tab === "bai") {
    const nhom = {};
    baiHienThi.forEach((l) => { (nhom[l.stage] = nhom[l.stage] || []).push(l); });
    const opts = Object.keys(nhom).map((st) =>
      `<optgroup label="${esc(STAGES[st] || "Lớp " + st)}">` +
      nhom[st].map((l) => `<option value="${esc(l.id)}" ${l.id === setupCfg.lesson ? "selected" : ""}>Bài ${l.order}. ${esc(l.title)} (${(l.quiz || []).length} câu)</option>`).join("") +
      "</optgroup>").join("");
    phanChinh = `
      <div class="config-row">
        <label>Chọn bài</label>
        <div class="chip-group"><select id="lessonSel" style="max-width:100%">
          <option value="all">— Chưa chọn bài —</option>${opts}
        </select></div>
      </div>`;

  } else if (tab === "chuong") {
    const stage = setupCfg.chapterStage || (baiHienThi[0] && baiHienThi[0].stage) || 20;
    const stages = [...new Set(baiHienThi.map((l) => l.stage))];
    const chuongCua = (st) => (LESSON_CHAPTERS[st] || []).map((c, i) => {
      const ids = new Set(baiHienThi.filter((l) => l.stage === Number(st) && l.order >= c.from && l.order <= c.to).flatMap((l) => l.quiz || []));
      return { key: st + "|" + i, name: c.name, so: ids.size };
    });
    phanChinh = `
      <div class="config-row">
        <label>Lớp</label>
        <div class="chip-group">${stages.map((st) => chip(String(st), STAGES[st] || ("Lớp " + st), String(stage), "chapterStage")).join("")}</div>
      </div>
      <div class="config-row">
        <label>Chương</label>
        <div class="chip-group">${chuongCua(stage).map((c) => chip(c.key, c.name, setupCfg.chapter, "chapter", c.so + " câu")).join("")}</div>
      </div>`;

  } else if (tab === "chude") {
    const gradeNote = setupCfg.grade === "all" ? "" : ` trong lớp ${setupCfg.grade}`;
    const tChips = [["all", "Tất cả"]].concat(Object.entries(TOPICS).map(([c, n]) => [c, `${c}. ${n}`]));
    phanChinh = `
      <div class="config-row">
        <label>Lớp</label>
        <div class="chip-group">${[["all", "Cả ba lớp"]].concat(gradeChips).map(([v, l]) =>
          chip(v, l, setupCfg.grade, "grade", v === "all" ? "" : demTheo((q) => String(q.grade) === v) + " câu")).join("")}</div>
      </div>
      <div class="config-row">
        <label>Chủ đề${gradeNote}</label>
        <div class="chip-group">${tChips.map(([v, l]) => {
          const so = v === "all" ? 0 : demTheo((q) => q.topic === v && (setupCfg.grade === "all" || String(q.grade) === setupCfg.grade));
          const rong = v !== "all" && so === 0;
          return `<button class="chip ${v === setupCfg.topic ? "active" : ""}" data-group="topic" data-val="${v}" ${rong ? "disabled title='Lớp này không có câu hỏi thuộc chủ đề đó'" : ""}>${esc(l)}${v === "all" ? "" : ` <small>${so} câu</small>`}</button>`;
        }).join("")}</div>
      </div>`;

  } else if (tab === "yeu") {
    const st = (typeof skillStats === "function") ? skillStats() : { bang: [], soChuDeCoDuLieu: 0 };
    const co = st.bang.filter((x) => x.du).sort((a, b) => a.pct - b.pct);
    if (!setupCfg.weakTopic && co.length) setupCfg.weakTopic = co[0].topic;
    phanChinh = co.length
      ? `<div class="config-row">
          <label>Chủ đề yếu</label>
          <div class="chip-group">${co.map((x) =>
            chip(x.topic, `${x.topic}. ${x.ten}`, setupCfg.weakTopic, "weakTopic", `${x.pct}% đúng`)).join("")}</div>
        </div>`
      : `<div class="config-row"><label>Chưa có dữ liệu</label><div class="chip-group">
          <span style="color:var(--text-soft);font-size:13.5px">Hãy làm vài bài luyện tập trước — mỗi chủ đề cần ít nhất 5 câu thì mới biết bạn yếu chỗ nào.</span>
        </div></div>`;

  } else { /* tab === "lop" */
    phanChinh = `
      <div class="config-row">
        <label>Lớp</label>
        <div class="chip-group">${gradeChips.map(([v, l]) =>
          chip(v, l, setupCfg.grade === "all" ? "" : setupCfg.grade, "grade", demTheo((q) => String(q.grade) === v) + " câu")).join("")}</div>
      </div>
      <div class="config-row">
        <label>Bộ đề</label>
        <div class="chip-group">${[[10, "Kiểm tra 15 phút"], [20, "Kiểm tra 1 tiết"], [40, "Ôn thi học kì"]].map(([n, l]) =>
          chip(String(n), l, String(setupCfg.count), "count", n + " câu")).join("")}</div>
      </div>`;
  }

  const soCauChon = tab === "lop" ? "" : `
      <div class="config-row">
        <label>Số câu tối đa</label>
        <div class="chip-group"><select id="countSel">
          ${[5, 10, 15, 20, 30, 50].map((n) => `<option value="${n}" ${n === setupCfg.count ? "selected" : ""}>${n} câu</option>`).join("")}
        </select></div>
      </div>`;

  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Về trang chủ</button>
    <h2 style="margin-bottom:6px">${aIco("target", "#ef4444", 22)} Luyện tập</h2>
    <div class="ptabs">${tabsHtml}</div>
    <p style="color:var(--text-soft);font-size:13.5px;margin:0 0 14px">${esc(moTaTab)}</p>
    <div class="config-card">
      ${phanChinh}
      <div class="config-row">
        <label>Dạng câu hỏi</label>
        <div class="chip-group">${typeChips.map(([v, l]) => chip(v, l, setupCfg.type, "type")).join("")}</div>
      </div>
      <div class="config-row">
        <label>Mức độ</label>
        <div class="chip-group">${levelChips.map(([v, l]) => chip(v, l, setupCfg.level, "level")).join("")}</div>
      </div>
      ${soCauChon}
      <div class="config-row" style="justify-content:space-between">
        <span id="availMsg" style="color:var(--text-soft);font-size:13.5px"></span>
        <button class="btn btn-primary btn-lg" id="startPractice">Bắt đầu luyện ${aIco("aright", null, 15)}</button>
      </div>
    </div>
    <p style="color:var(--text-soft);font-size:13.5px">${aIco("bulb", "#d97706", 14)} Ở chế độ luyện tập, bạn thấy ngay đáp án đúng và lời giải sau khi trả lời mỗi câu.</p>
  `;

  const updateAvail = () => {
    const pool = filterPool();
    const el = document.getElementById("availMsg");
    const nguon = practiceNguon();
    const quota = (typeof Plan !== "undefined" && Plan.quotaText()) ? " " + Plan.quotaText() : "";
    el.textContent = (pool.length
      ? `${nguon}: có ${pool.length} câu phù hợp — sẽ lấy ${Math.min(setupCfg.count, pool.length)} câu.`
      : `${nguon}: chưa có câu nào khớp, hãy nới bộ lọc bên trên.`) + quota;
    document.getElementById("startPractice").disabled = pool.length === 0;
  };

  app.querySelectorAll(".ptab").forEach((b) => b.onclick = () => {
    if (b.dataset.tab === "yeu" && typeof Plan !== "undefined" && !Plan.has("yeu")) { Plan.upsell("yeu"); return; }
    setupCfg.tab = b.dataset.tab;
    if (setupCfg.tab === "lop" && setupCfg.grade === "all") setupCfg.grade = (State.profile && State.profile.grade) || "12";
    renderPracticeSetup();
  });
  app.querySelectorAll(".chip[data-group]").forEach((b) => b.onclick = () => {
    const g = b.dataset.group;
    setupCfg[g] = g === "count" ? Number(b.dataset.val) : b.dataset.val;
    // đổi lớp/chương thì phải vẽ lại vì danh sách phụ thuộc lẫn nhau
    if (g === "grade" || g === "chapterStage" || g === "count" || g === "weakTopic") return renderPracticeSetup();
    app.querySelectorAll(`.chip[data-group="${g}"]`).forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    updateAvail();
  });
  const cs = document.getElementById("countSel");
  if (cs) cs.onchange = (e) => { setupCfg.count = +e.target.value; updateAvail(); };
  const ls = document.getElementById("lessonSel");
  if (ls) ls.onchange = (e) => { setupCfg.lesson = e.target.value; updateAvail(); };
  document.getElementById("back").onclick = () => go("home");
  document.getElementById("startPractice").onclick = startPractice;
  updateAvail();
}

/* Mô tả nguồn câu hỏi đang chọn — dùng cho dòng thông báo và tên bài luyện */
function practiceNguon() {
  if (setupCfg.tab === "bai") {
    const l = LESSONS.find((x) => x.id === setupCfg.lesson);
    return l ? `Bài ${l.order}. ${l.title}` : "Chưa chọn bài";
  }
  if (setupCfg.tab === "chuong") {
    const c = chuongDangChon();
    return c ? c.name : "Chưa chọn chương";
  }
  if (setupCfg.tab === "lop") return "Lớp " + (setupCfg.grade === "all" ? "—" : setupCfg.grade);
  if (setupCfg.tab === "yeu") {
    return setupCfg.weakTopic ? "Chỗ yếu: " + TOPICS[setupCfg.weakTopic] : "Chưa xác định chỗ yếu";
  }
  const t = setupCfg.topic === "all" ? "Tất cả chủ đề" : `${setupCfg.topic}. ${TOPICS[setupCfg.topic]}`;
  return t + (setupCfg.grade === "all" ? "" : " · lớp " + setupCfg.grade);
}

/* Chương đang chọn ở tab "theo chương" -> { name, ids } */
function chuongDangChon() {
  const key = setupCfg.chapter || "";
  const [st, i] = key.split("|");
  const ds = LESSON_CHAPTERS[st];
  const c = ds && ds[Number(i)];
  if (!c) return null;
  const ids = new Set(LESSONS.filter((l) => l.stage === Number(st) && l.order >= c.from && l.order <= c.to)
    .flatMap((l) => l.quiz || []));
  return { name: c.name, ids };
}


function filterPool() {
  /* Dạng câu và mức độ áp cho mọi cách chọn; phạm vi thì tuỳ tab. */
  const phu = (q) =>
    (setupCfg.type === "all" || q.type === setupCfg.type) &&
    (setupCfg.level === "all" || q.level === setupCfg.level);

  if (setupCfg.tab === "bai") {
    // Bài đã quy định sẵn chủ đề và lớp nên không lọc thêm hai thứ đó
    const l = LESSONS.find((x) => x.id === setupCfg.lesson);
    const ids = new Set((l && l.quiz) || []);
    return ids.size ? QUESTION_BANK.filter((q) => ids.has(q.id) && phu(q)) : [];
  }
  if (setupCfg.tab === "chuong") {
    const c = chuongDangChon();
    return c ? QUESTION_BANK.filter((q) => c.ids.has(q.id) && phu(q)) : [];
  }
  if (setupCfg.tab === "lop") {
    return setupCfg.grade === "all" ? [] : QUESTION_BANK.filter((q) => String(q.grade) === setupCfg.grade && phu(q));
  }
  if (setupCfg.tab === "yeu") {
    // Chủ đề yếu: chỉ lấy câu của chủ đề đó; thứ tự ưu tiên do skillPickWeak lo
    if (!setupCfg.weakTopic) return [];
    return QUESTION_BANK.filter((q) => q.topic === setupCfg.weakTopic && phu(q));
  }
  return QUESTION_BANK.filter((q) =>
    (setupCfg.topic === "all" || q.topic === setupCfg.topic) &&
    (setupCfg.grade === "all" || String(q.grade) === setupCfg.grade) &&
    phu(q)
  );
}

/* ===========================================================================
 *  TẠO & BẮT ĐẦU BÀI LÀM
 * ========================================================================= */
function newQuiz(questions, mode, opts = {}) {
  if (window.Am) Am.xoaCombo();          // bài mới thì chuỗi đúng liên tiếp tính lại từ đầu
  return {
    mode,                                  // "exam" | "practice"
    questions,
    answers: new Array(questions.length).fill(null),
    flags: new Array(questions.length).fill(false),
    revealed: new Array(questions.length).fill(false), // dùng cho practice
    index: 0,
    streak: 0,                              // chuỗi đúng liên tiếp
    startTs: Date.now(),
    minutes: opts.minutes || null,
    title: opts.title || "Bài luyện tập",
    code: opts.code || null,        // mã đề (nếu thi thử theo mã đề cố định)
    lessonId: opts.lessonId || null, // bài học nguồn (để tính sao mastery theo bài)
    timerId: null,
    submitted: false,
    reactions: {},                          // lưu phản ứng linh vật theo từng câu
  };
}

function startPractice() {
  const pool = filterPool();
  if (!pool.length) return;
  if (typeof Plan !== "undefined" && !Plan.chanLuyen()) return; // hết quỹ câu/ngày của gói free
  // Ôn chỗ yếu: ưu tiên câu TỪNG SAI rồi mới tới câu chưa làm (xem skills.js)
  let qs = (setupCfg.tab === "yeu" && setupCfg.weakTopic && typeof skillPickWeak === "function")
    ? skillPickWeak(setupCfg.weakTopic, Math.min(setupCfg.count, pool.length))
    : pick(pool, Math.min(setupCfg.count, pool.length));
  if (typeof Plan !== "undefined") qs = Plan.catQuota(qs);
  // Ôn đúng một bài -> ghi lessonId để tính sao thành thạo cho bài đó
  const bai = setupCfg.tab === "bai" ? LESSONS.find((x) => x.id === setupCfg.lesson) : null;
  State.quiz = newQuiz(qs, "practice", {
    title: "Luyện tập: " + practiceNguon(),
    lessonId: bai ? bai.id : null,
  });
  go("quiz");
}

/* Kho câu cho "Luyện nhanh": ưu tiên những bài EM ẤY ĐÃ HỌC.
   Trước đây bốc thẳng từ cả 2052 câu, nên người mới học 2 bài lớp 10 vẫn gặp câu
   về bộ chọn CSS của bài 17 lớp 12 — sai 8/10 câu ngay buổi đầu thì bỏ app.
   Chưa học bài nào thì lấy vài bài đầu của lộ trình để vẫn có cái mà luyện. */
function khoLuyenNhanh() {
  if (typeof LESSONS === "undefined") return QUESTION_BANK;
  const daHoc = new Set(State.learned || []);
  let bai = LESSONS.filter((l) => daHoc.has(l.id));
  if (bai.length < 2) bai = LESSONS.slice(0, 3);      // người mới: 3 bài đầu lộ trình
  const ids = new Set();
  bai.forEach((l) => (l.quiz || []).forEach((id) => ids.add(id)));
  const pool = QUESTION_BANK.filter((q) => ids.has(q.id));
  /* Bài đã học chưa đủ 10 câu thì bù thêm từ kho chung, đừng để nút bấm ra 3 câu. */
  return pool.length >= 10 ? pool : QUESTION_BANK;
}

function startQuick() {
  if (typeof Plan !== "undefined" && !Plan.chanLuyen()) return; // hết quỹ câu/ngày của gói free
  const kho = khoLuyenNhanh();
  let qs = pick(kho, Math.min(10, kho.length));
  if (typeof Plan !== "undefined") qs = Plan.catQuota(qs);
  State.quiz = newQuiz(qs, "practice", { title: "Luyện nhanh 10 câu" });
  go("quiz");
}

/* ---- Hai ô phụ trên bản đồ tự dựng bài làm ---------------------------------
   Cùng đi qua newQuiz + go("quiz") như mọi chỗ khác, chỉ khác nguồn câu và cách
   ghi điểm: `lessonId` là id tổng hợp ("LT:22:1" / "TT:22") để bản đồ đọc lại
   được số sao của chính ô đó từ lịch sử làm bài. */
function batDauLuyenChuong(chuong, idDiem) {
  /* Ưu tiên câu của những bài ĐÃ HỌC trong chương: ô này mở ngay khi học xong 1
     bài, nếu bốc cả chương thì học 1 bài mà gặp câu của 7 bài chưa học. */
  const layIds = (ds) => {
    const s = new Set();
    ds.forEach((l) => (l.quiz || []).forEach((q) => s.add(q)));
    return s;
  };
  const daHoc = chuong.items.filter((it) => isLearned(it.l.id)).map((it) => it.l);
  let pool = QUESTION_BANK.filter((q) => layIds(daHoc).has(q.id));
  if (pool.length < 5) {
    const ca = layIds(chuong.items.map((it) => it.l));
    pool = QUESTION_BANK.filter((q) => ca.has(q.id));
  }
  if (!pool.length) { toast("Chương này chưa có câu luyện tập"); return; }
  if (typeof Plan !== "undefined" && !Plan.chanLuyen()) return; // hết quỹ câu/ngày của gói free
  let qs = shuffle(pool).slice(0, Math.min(15, pool.length));
  if (typeof Plan !== "undefined") qs = Plan.catQuota(qs);
  State.quiz = newQuiz(qs, "practice", { title: "Luyện tập: " + chuong.name, lessonId: idDiem });
  go("quiz");
}

function batDauThiChang(stage, tenChang, idDiem) {
  /* Đề ĐỦ khổ 24 + 4 câu, ưu tiên câu của chặng này rồi mới bù từ kho chung:
     điểm hiện ra là thang 10 nên đề thiếu câu sẽ báo điểm sai (làm đúng hết mà
     chỉ được 7,0). Ô này lại mở ở cuối chặng nên đề đủ khổ mới đúng ý nghĩa. */
  const ids = new Set();
  LESSONS.filter((l) => l.stage === stage).forEach((l) => (l.quiz || []).forEach((q) => ids.add(q)));
  const boc = (type, n) => {
    const trong = shuffle(QUESTION_BANK.filter((q) => q.type === type && ids.has(q.id))).slice(0, n);
    if (trong.length >= n) return trong;
    const co = new Set(trong.map((q) => q.id));
    const bu = shuffle(QUESTION_BANK.filter((q) => q.type === type && !co.has(q.id)));
    return trong.concat(bu.slice(0, n - trong.length));
  };
  const qs = [...boc("mc", EXAM_CONFIG.mc), ...boc("tf", EXAM_CONFIG.tf)]; // giữ thứ tự Phần I → Phần II
  if (qs.length < EXAM_CONFIG.mc) { toast("Chưa đủ câu để dựng đề thi thử"); return; }
  State.quiz = newQuiz(qs, "exam", {
    minutes: EXAM_CONFIG.minutes,
    title: "Thi thử cuối chặng: " + tenChang,
    lessonId: idDiem,
  });
  go("quiz");
}

function startExam() {
  // Đề ngẫu nhiên vô hạn là quyền lợi Premium; gói free có 3 đề cố định
  if (typeof Plan !== "undefined" && !Plan.has("exam_random")) { Plan.upsell("exam"); return; }
  const mc = sampleByMatrix("mc", EXAM_MATRIX.mc, EXAM_CONFIG.mc);
  const tf = sampleByMatrix("tf", EXAM_MATRIX.tf, EXAM_CONFIG.tf);
  const qs = [...mc, ...tf]; // giữ thứ tự Phần I → Phần II
  State.quiz = newQuiz(qs, "exam", { minutes: EXAM_CONFIG.minutes, title: "Đề thi thử THPT Quốc gia" });
  go("quiz");
}

/* Lấy câu hỏi theo ma trận chủ đề; nếu một chủ đề thiếu câu thì bù từ ngân hàng cùng dạng */
/* Bốc n câu trong một ô (dạng câu · chủ đề · lớp), RẢI ĐỀU 3 mức độ để không có
   đề nào toàn câu dễ hoặc toàn câu khó. `boc` là hàm xáo trộn — truyền vào để
   dùng chung cho cả đề ngẫu nhiên lẫn đề cố định theo mã (xáo có seed). */
function pickExamCell(type, topic, grade, n, boc, used, xoay) {
  const pool = boc(QUESTION_BANK.filter((q) =>
    q.type === type && q.topic === topic && !used.has(q.id) &&
    (grade == null || q.grade === grade)));
  const theoMuc = { easy: [], medium: [], hard: [] };
  pool.forEach((q) => (theoMuc[q.level] || theoMuc.medium).push(q));
  /* Phần lớn ô chỉ có 1-2 câu, nếu ô nào cũng bắt đầu từ cùng một mức thì cả đề
     lệch hẳn (đo được: 2 dễ / 17 vừa / 9 khó). Xoay điểm bắt đầu theo từng ô để
     cả đề rải đều nhận biết - thông hiểu - vận dụng. */
  const MUC = ["easy", "medium", "hard"];
  const bd = xoay ? (xoay.i++) : 0;
  const out = [];
  for (let i = 0; out.length < n && i < n * 3 + 9; i++) {
    const ds = theoMuc[MUC[(bd + i) % 3]];
    if (ds.length) { const q = ds.pop(); out.push(q); used.add(q.id); }
  }
  return out;
}

/* Lắp một phần của đề theo ma trận: đúng chủ đề, đúng phân bổ lớp, rải mức độ.
   Thiếu câu ở một ô thì bù trong cùng chủ đề, cùng đường thì bù toàn ngân hàng. */
function sampleByMatrix(type, dist, target, boc) {
  boc = boc || shuffle;
  const chosen = [], used = new Set();
  const xoay = { i: 0 };   // xoay mức độ giữa các ô để cả đề không lệch độ khó
  const gradeDist = (EXAM_MATRIX.grade && EXAM_MATRIX.grade[type]) || {};
  for (const [topic, n] of Object.entries(dist)) {
    let got = 0;
    const gd = gradeDist[topic];
    if (gd) {
      for (const [g, cnt] of Object.entries(gd)) {
        pickExamCell(type, topic, Number(g), cnt, boc, used, xoay).forEach((q) => { chosen.push(q); got++; });
      }
    }
    if (got < n) pickExamCell(type, topic, null, n - got, boc, used, xoay).forEach((q) => chosen.push(q));
  }
  if (chosen.length < target) {
    boc(QUESTION_BANK.filter((q) => q.type === type && !used.has(q.id)))
      .slice(0, target - chosen.length)
      .forEach((q) => { chosen.push(q); used.add(q.id); });
  }
  const ket = boc(chosen).slice(0, target);
  if (type === "mc") apDungHanNgach(ket, used, boc);
  return ket;
}

/* ---------------------------------------------------------------------------
 *  HẠN NGẠCH DẠNG CÂU TRONG ĐỀ
 *
 *  Ma trận ở trên chia theo CHỦ ĐỀ, không biết gì về dạng câu. Hậu quả đo được:
 *  đề bốc ra trung bình 2,9 câu đọc code Python (khớp đề thật) nhưng chỉ 0,1 câu
 *  SQL — tức mười đề mới có một câu, trong khi đề thật năm nào cũng có 1–2 câu.
 *  Câu đọc đoạn HTML/CSS cũng gần như không bao giờ được bốc.
 *
 *  Cách chữa: sau khi bốc đủ số câu, đếm lại theo dạng; thiếu thì đổi một câu
 *  KHÔNG thuộc dạng nào đang thiếu lấy một câu thuộc dạng đó, ưu tiên đổi trong
 *  cùng chủ đề để ma trận lệch ít nhất. Dùng chung hàm bốc `boc` nên đề theo mã
 *  cố định vẫn tái lập được y hệt.
 * ------------------------------------------------------------------------- */
const HAN_NGACH_DE = [
  { ten: "sql", min: 1,
    hop: (q) => !!q.code && /\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE)\b/i.test(q.code) },
  { ten: "web", min: 1,
    hop: (q) => !!q.code &&
      /<(html|head|body|div|p|span|h[1-6]|ul|ol|li|a|img|table|tr|td|form|input|button|style|link|meta)\b/i.test(q.code) },
];

function apDungHanNgach(ds, used, boc) {
  HAN_NGACH_DE.forEach((hn) => {
    let co = ds.filter(hn.hop).length;
    if (co >= hn.min) return;
    const ungVien = boc(QUESTION_BANK.filter((q) => q.type === "mc" && !used.has(q.id) && hn.hop(q)));
    for (const q of ungVien) {
      if (co >= hn.min) break;
      /* Chỉ thay câu KHÔNG phục vụ hạn ngạch nào, kẻo vừa bù chỗ này lại thủng chỗ kia. */
      const raNh = (x) => !HAN_NGACH_DE.some((h) => h.hop(x));
      let i = ds.findIndex((x) => raNh(x) && x.topic === q.topic);
      if (i < 0) i = ds.findIndex(raNh);
      if (i < 0) break;
      used.delete(ds[i].id);
      used.add(q.id);
      ds[i] = q;
      co++;
    }
  });
}

/* ---------------------------------------------------------------------------
 *  ẢNH LINH VẬT THEO GIỚI TÍNH CỦA HỒ SƠ
 *  Bộ ảnh gốc là nhân vật nữ (asset/mascot/poses|scenes). Hồ sơ chọn giới tính
 *  "nam" thì đổi sang bộ nam (asset/mascot/nam/...) — chỉ đổi những ảnh ĐÃ CÓ
 *  bản nam, ảnh nào chưa có thì giữ nguyên để không bao giờ hiện ảnh vỡ.
 * ------------------------------------------------------------------------- */
const MASCOT_NAM = new Set([
  "poses/celebrate-jump", "poses/cheer", "poses/confident", "poses/crying",
  "poses/happy", "poses/love-heart", "poses/reading", "poses/sad",
  "poses/shocked", "poses/standing", "poses/studying", "poses/thinking",
  "poses/wink", "poses/worried",
  "scenes/did-you-know", "scenes/explaining", "scenes/gesture",
  "scenes/great-job", "scenes/thumbs-up", "scenes/wave",
]);
function mascotSrc(p) {
  const gioi = (typeof State !== "undefined" && State.profile && State.profile.gender) || "";
  if (gioi !== "nam" || !p) return p;
  const rel = String(p).replace("asset/mascot/", "").replace(/\.png$/, "");
  return MASCOT_NAM.has(rel) ? "asset/mascot/nam/" + rel + ".png" : p;
}

/* ---------------------------------------------------------------------------
 *  MASCOT DYNAMIC REACTION ENGINE (PHẢN ỨNG LINH VẬT SINH ĐỘNG NGẪU NHIÊN)
 * ------------------------------------------------------------------------- */
const MASCOT_REACTIONS = {
  happyPoses: [
    "asset/mascot/poses/happy.png",
    "asset/mascot/poses/wink.png",
    "asset/mascot/poses/confident.png",
    "asset/mascot/scenes/thumbs-up.png"
  ],
  happyMessages: [
    "Tuyệt vời lắm! Em chọn đáp án hoàn toàn chính xác!",
    "Chính xác 100%! Tư duy lập trình của em rất tốt!",
    "Đúng rồi nè! Tiến thêm một bước tới điểm 9+ rồi!",
    "Giỏi quá! Cứ giữ vững phong độ này nhé!",
    "Chuẩn không cần chỉnh! Robot thả tim cho em nè!"
  ],
  streakPoses: [
    "asset/mascot/poses/celebrate-jump.png",
    "asset/mascot/poses/cheer.png",
    "asset/mascot/scenes/cheer-pompom.png",
    "asset/mascot/poses/love-heart.png",
    "asset/mascot/scenes/great-job.png"
  ],
  streakMessages: [
    "🔥 BÙNG NỔ! Đã đúng {N} câu liên tiếp! Phong độ quá bá đạo!",
    "⚡ STREAK {N} CÂU DỄ DÀNG! Không ai ngăn cản được em lúc này!",
    "🏆 PHONG ĐỘ THIÊN TÀI! Đúng liên tục {N} câu rồi nè!",
    "🌟 SIÊU SAO LẬP TRÌNH! {N} câu đúng liên tiếp tuyệt đối!"
  ],
  sadPoses: [
    "asset/mascot/poses/sad.png",
    "asset/mascot/poses/crying.png",
    "asset/mascot/poses/worried.png",
    "asset/mascot/poses/shocked.png"
  ],
  sadMessages: [
    "Đừng nản nhé! Xem giải thích bên dưới để rút kinh nghiệm nào!",
    "Không sao cả em ơi! Lỗi nhỏ thôi, câu sau làm lại thật tốt nhé!",
    "Học từ sai lầm là chìa khóa thành công! Cố lên nhé!",
    "Vấp ở đâu đứng dậy ở đó! Robot tin em làm tốt hơn ở câu tiếp theo!"
  ],
  hintPoses: [
    "asset/mascot/poses/thinking.png",
    "asset/mascot/poses/reading.png",
    "asset/mascot/scenes/explaining.png",
    "asset/mascot/scenes/magnifier.png",
    "asset/mascot/scenes/did-you-know.png"
  ],
  hintMessages: [
    "Cùng Robot phân tích kỹ bản chất bài toán này nhé:",
    "Bí kíp ở đây nè, Robot hướng dẫn cho em:",
    "Mẹo ghi nhớ lý thuyết này cực kỳ đơn giản:",
    "Để Robot bật mí chi tiết lời giải cho em nhé:"
  ],
  defaultPoses: [
    "asset/mascot/poses/standing.png",
    "asset/mascot/poses/studying.png",
    "asset/mascot/scenes/wave.png",
    "asset/mascot/scenes/gesture.png"
  ],
  defaultMessages: [
    "Đọc kỹ đề bài rồi chọn đáp án ưng ý nhất nhé em!",
    "Robot đang đồng hành cùng em nè, bình tĩnh tự tin nhé!",
    "Hãy tập trung tư duy, em làm được mà!",
    "Thử sức câu này nào, chúc em đạt điểm tối đa!"
  ]
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMascotReaction(type, streak = 0) {
  if (streak >= 2 && (type === "correct" || type === "streak")) {
    const pose = mascotSrc(getRandomItem(MASCOT_REACTIONS.streakPoses));
    const msg = getRandomItem(MASCOT_REACTIONS.streakMessages).replace("{N}", streak);
    return { pose, msg, badge: `STREAK 🔥 ${streak}`, typeClass: "streak" };
  }
  if (type === "correct") {
    const pose = mascotSrc(getRandomItem(MASCOT_REACTIONS.happyPoses));
    const msg = getRandomItem(MASCOT_REACTIONS.happyMessages);
    return { pose, msg, badge: "CHÍNH XÁC ✨", typeClass: "correct" };
  }
  if (type === "wrong") {
    const pose = mascotSrc(getRandomItem(MASCOT_REACTIONS.sadPoses));
    const msg = getRandomItem(MASCOT_REACTIONS.sadMessages);
    return { pose, msg, badge: "THỬ LẠI 💪", typeClass: "wrong" };
  }
  if (type === "hint") {
    const pose = mascotSrc(getRandomItem(MASCOT_REACTIONS.hintPoses));
    const msg = getRandomItem(MASCOT_REACTIONS.hintMessages);
    return { pose, msg, badge: "GỢI Ý 💡", typeClass: "hint" };
  }
  const pose = mascotSrc(getRandomItem(MASCOT_REACTIONS.defaultPoses));
  const msg = getRandomItem(MASCOT_REACTIONS.defaultMessages);
  return { pose, msg, badge: "ROBOT ÔN THI 🤖", typeClass: "default" };
}

/* ===========================================================================
 *  MÀN HÌNH LÀM BÀI
 * ========================================================================= */

/* QUY TẮC THỐNG NHẤT cho mọi bài làm — chỉ định nghĩa ở đây, các nơi khác đọc lại:
   - Luyện tập (theo bài, theo chủ đề, luyện nhanh, luyện Đúng/Sai):
     bấm "Kiểm tra" chấm ngay TỪNG CÂU và xem lời giải liền, không tính giờ.
   - Thi thử (đề ngẫu nhiên, mã đề, đề biên soạn):
     KHÔNG chấm lẻ từng câu — làm hết rồi "Nộp bài", có tính giờ, xem lời giải
     sau khi nộp. */
function quizRules(Q) {
  const thi = Q.mode === "exam";
  return {
    thi,
    kiemTraTungCau: !thi,
    tinhGio: thi && !!Q.minutes,
    nhan: thi ? "Thi thử" : "Luyện tập",
    moTa: thi
      ? "Thi thử: làm hết rồi nộp bài, xem lời giải sau khi nộp"
      : "Luyện tập: bấm Kiểm tra để chấm ngay từng câu",
  };
}

function renderQuiz() {
  const Q = State.quiz;
  const q = Q.questions[Q.index];
  const revealed = Q.revealed[Q.index];

  const pct = Math.round(((Q.index + 1) / Q.questions.length) * 100);
  const curAns = Q.answers[Q.index];
  const isCorrect = revealed ? isAnswerCorrect(q, curAns) : null;

  const luat = quizRules(Q);

  // Chấm xong một câu -> khen/động viên. Lời nhắn hiện ở Robot trợ lý (góc dưới
  // phải), không chiếm chỗ giữa trang nữa.
  let phanHoiMoi = null;
  if (revealed && !Q.reactions[Q.index]) {
    if (isCorrect) {
      Q.streak = (Q.streak || 0) + 1;
      Q.reactions[Q.index] = getMascotReaction(Q.streak >= 2 ? "streak" : "correct", Q.streak);
    } else {
      Q.streak = 0;
      Q.reactions[Q.index] = getMascotReaction("wrong", 0);
    }
    phanHoiMoi = Q.reactions[Q.index];
  }

  app.innerHTML = `
    <div class="quiz-header">
      <div class="quiz-meta">
        <span class="pill">${esc(Q.title)}</span>
        <span class="pill type-${q.type}">${TYPE_LABEL[q.type]}</span>
        ${q.grade ? `<span class="pill">Lớp ${q.grade}</span>` : ""}
        <span class="pill">${LEVEL_LABEL[q.level]}</span>
        <span class="pill pill-mode" title="${esc(luat.moTa)}">${esc(luat.nhan)}</span>
      </div>
      <div class="quiz-meta">
        ${luat.tinhGio ? `<span class="timer" id="timer">--:--</span>` : ""}
        <button class="btn btn-ghost" id="quitBtn">Thoát</button>
      </div>
    </div>

    <!-- DYNAMIC GAMIFIED PROGRESS BAR -->
    <div class="progress-container">
      <div class="progress-track-wrapper">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-info-row">
        <span>Câu ${Q.index + 1} / ${Q.questions.length} (${pct}%)</span>
        ${Q.streak && Q.streak >= 2
          ? `<span class="streak-counter">🔥 Streak ${Q.streak} câu đúng</span>`
          : `<span>${esc(luat.moTa)}</span>`}
      </div>
    </div>

    <div class="palette" id="palette"></div>

    <div class="question-card">
      <div class="q-number">Câu ${Q.index + 1} / ${Q.questions.length}</div>
      <div class="q-text">${fmtQ(q.question)}</div>
      ${q.code ? `<pre class="q-code">${esc(q.code)}</pre>` : ""}
      <div id="answerArea"></div>
      <div id="explainArea"></div>
    </div>

    <div class="quiz-nav">
      <div class="quiz-nav-left">
        <button class="btn btn-ghost" id="prevBtn" ${Q.index === 0 ? "disabled" : ""}>${aIco("aleft", null, 14)} Câu trước</button>
        <button class="flag-btn ${Q.flags[Q.index] ? "on" : ""}" id="flagBtn">${aIco("flag", null, 14)} ${Q.flags[Q.index] ? "Bỏ đánh dấu" : "Đánh dấu"}</button>
      </div>
      <div class="quiz-nav-left">
        ${luat.kiemTraTungCau ? `<button class="btn btn-ghost" id="checkBtn" ${revealed ? "disabled" : ""}>Kiểm tra</button>` : ""}
        ${Q.index === Q.questions.length - 1
          ? `<button class="btn btn-success" id="submitBtn">${aIco("check2", null, 15)} Nộp bài</button>`
          : `<button class="btn btn-primary" id="nextBtn">Câu sau ${aIco("aright", null, 14)}</button>`}
      </div>
    </div>
  `;

  renderAnswerArea(q, revealed);
  renderPalette();
  if (revealed) renderExplain(q);

  // sự kiện
  const byId = (id) => document.getElementById(id);
  byId("prevBtn") && (byId("prevBtn").onclick = () => { Q.index--; go("quiz"); });
  byId("nextBtn") && (byId("nextBtn").onclick = () => { Q.index++; go("quiz"); });
  byId("flagBtn").onclick = () => {
    // Cập nhật tại chỗ: đổi đánh dấu không cần dựng lại cả màn (tránh nhảy trang).
    Q.flags[Q.index] = !Q.flags[Q.index];
    const fb = byId("flagBtn");
    fb.classList.toggle("on", Q.flags[Q.index]);
    fb.innerHTML = `${aIco("flag", null, 14)} ${Q.flags[Q.index] ? "Bỏ đánh dấu" : "Đánh dấu"}`;
    renderPalette();
  };
  byId("checkBtn") && (byId("checkBtn").onclick = () => {
    Q.revealed[Q.index] = true;
    /* Tiếng phát ở ĐÂY chứ không phải trong renderExplain: lời giải còn được vẽ
       lại mỗi lần quay về câu cũ, đặt ở đó thì đi tới đi lui là kêu suốt. */
    if (window.Am) (isAnswerCorrect(q, Q.answers[Q.index]) ? Am.dung() : Am.sai());
    goStay("quiz");   // hiện lời giải ngay dưới câu hỏi, giữ nguyên chỗ đang đọc
  });
  byId("submitBtn") && (byId("submitBtn").onclick = trySubmit);
  byId("quitBtn").onclick = async () => {
    const ok = await confirmBox("Thoát bài làm?", "Bài làm hiện tại sẽ không được lưu. Bạn có chắc muốn thoát?", "Thoát");
    if (ok) { stopTimer(); State.quiz = null; go("home"); }
  };

  if (luat.tinhGio) startTimer();

  // Phản hồi sau khi chấm một câu -> đẩy xuống Robot trợ lý ở góc dưới phải
  if (phanHoiMoi) mascotSay(phanHoiMoi.msg, { pose: phanHoiMoi.pose, badge: phanHoiMoi.badge, tone: phanHoiMoi.typeClass });
}

/* --- Vùng nhập đáp án theo từng dạng --- */
function renderAnswerArea(q, revealed) {
  const Q = State.quiz;
  const area = document.getElementById("answerArea");
  const locked = revealed; // ở practice, sau khi kiểm tra thì khóa

  if (q.type === "mc") {
    const cur = Q.answers[Q.index];
    area.innerHTML = `<div class="options">` + q.options.map((opt, i) => {
      let cls = "option";
      if (revealed) {
        cls += " locked";
        if (i === q.answer) cls += " correct";
        else if (i === cur) cls += " wrong";
      } else if (i === cur) cls += " selected";
      const key = String.fromCharCode(65 + i);
      return `<div class="${cls}" data-i="${i}"><span class="opt-key">${key}</span><span>${fmtQ(opt)}</span></div>`;
    }).join("") + `</div>`;
    /* Chọn đáp án chỉ đổi trạng thái 1 ô -> tô lại tại chỗ thay vì dựng lại cả
       màn hình (dựng lại sẽ kéo trang về đầu, mất chỗ đang đọc). */
    if (!locked) area.querySelectorAll(".option").forEach((o) => o.onclick = () => {
      /* Tiếng chạm rất khẽ (0,12s) và chỉ khi ĐỔI lựa chọn: bấm đi bấm lại cùng
         một ô mà cứ kêu thì thành ồn chứ không phải phản hồi. */
      if (window.Am && Q.answers[Q.index] !== +o.dataset.i) Am.cham();
      Q.answers[Q.index] = +o.dataset.i;
      area.querySelectorAll(".option").forEach((x) => x.classList.toggle("selected", x === o));
      renderPalette();
    });

  } else if (q.type === "tf") {
    if (!Array.isArray(Q.answers[Q.index])) Q.answers[Q.index] = new Array(q.statements.length).fill(null);
    const cur = Q.answers[Q.index];
    const letters = ["a", "b", "c", "d", "e", "f"];
    area.innerHTML = `<div class="tf-table">` + q.statements.map((st, i) => {
      let rowCls = "tf-row";
      let mark = "";
      if (revealed) {
        const right = cur[i] === st.correct;
        rowCls += right ? " reveal-correct" : " reveal-wrong";
        mark = `<span class="tf-mark">${right ? aIco("check2", "#16a34a", 15) : aIco("x", "#dc2626", 15)}</span>`;
      }
      return `
        <div class="${rowCls}">
          <div class="tf-text"><b>${letters[i]})</b> ${fmtQ(st.text)}</div>
          <div class="tf-choices" data-i="${i}">
            <button data-v="true" class="${cur[i] === true ? "sel-true" : ""}">Đúng</button>
            <button data-v="false" class="${cur[i] === false ? "sel-false" : ""}">Sai</button>
          </div>
          ${mark}
        </div>`;
    }).join("") + `</div>`;
    if (!locked) area.querySelectorAll(".tf-choices").forEach((grp) => {
      const i = +grp.dataset.i;
      grp.querySelectorAll("button").forEach((b) => b.onclick = () => {
        const v = b.dataset.v === "true";
        Q.answers[Q.index][i] = v;
        grp.querySelector('[data-v="true"]').classList.toggle("sel-true", v);
        grp.querySelector('[data-v="false"]').classList.toggle("sel-false", !v);
        renderPalette();
      });
    });

  } else if (q.type === "sa") {
    const cur = Q.answers[Q.index];
    let cls = "sa-input";
    if (revealed) cls += isSAcorrect(q, cur) ? " correct" : " wrong";
    area.innerHTML = `
      <input type="text" class="${cls}" id="saInput" placeholder="Nhập đáp án..."
             value="${cur != null ? esc(cur) : ""}" ${locked ? "disabled" : ""} autocomplete="off" />`;
    if (!locked) {
      const inp = document.getElementById("saInput");
      inp.oninput = () => { Q.answers[Q.index] = inp.value; };
      inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("checkBtn")?.click() || document.getElementById("nextBtn")?.click(); } };
      inp.focus();
    }
  }
}

function renderExplain(q) {
  const Q = State.quiz;
  const cur = Q.answers[Q.index];
  const correct = isAnswerCorrect(q, cur);
  const area = document.getElementById("explainArea");
  let correctText = "";
  if (q.type === "mc") correctText = `Đáp án đúng: <b>${String.fromCharCode(65 + q.answer)}. ${fmtQ(q.options[q.answer])}</b>`;
  else if (q.type === "sa") correctText = `Đáp án đúng: <b>${fmtQ(q.answer)}</b>`;
  else if (q.type === "tf") correctText = `Đáp án: ${q.statements.map((s, i) => `${["a", "b", "c", "d"][i]}-${s.correct ? "Đ" : "S"}`).join(", ")}`;

  // Đổi tư thế linh vật khi người dùng xem giải thích
  const hintReaction = getMascotReaction("hint", 0);

  area.innerHTML = `
    <div class="explain-box">
      <div class="result-flag ${correct ? "ok" : "no"}">${correct ? aIco("check2", "#16a34a", 15) + " Chính xác!" : aIco("x", "#dc2626", 15) + " Chưa đúng"}</div>
      <div style="margin-bottom:8px">${correctText}</div>
      <div style="display:flex; gap:10px; align-items:flex-start;">
        <img src="${hintReaction.pose}" alt="Robot Giải thích" style="width:42px; height:42px; object-fit:contain; flex-shrink:0;" />
        <div>
          <b>${aIco("bulb", "#d97706", 14)} ${hintReaction.msg}</b>
          <div style="margin-top:4px;">${fmtGiaiThich(q.explain || "")}</div>
        </div>
      </div>
      <button class="btn btn-ghost" id="whyBtn" style="display:none; margin-top:10px">${aIco("bulb", "#d97706", 15)} Vì sao tôi sai?</button>
    </div>`;

  /* Chỉ mời hỏi gia sư khi làm SAI — làm đúng rồi thì đừng chen ngang, và cũng
     đỡ tốn lượt hỏi của người học. */
  if (!correct && typeof Tutor !== "undefined") {
    Tutor.batNut(document.getElementById("whyBtn"), () => Tutor.moCauSai(q, cur, Q.lessonId || null));
  }
}

/* --- Bảng câu hỏi (palette) --- */
function renderPalette() {
  const Q = State.quiz;
  const pal = document.getElementById("palette");
  pal.innerHTML = Q.questions.map((q, i) => {
    let cls = "palette-btn";
    const a = Q.answers[i];
    const isAnswered = a !== null && a !== undefined && !(Array.isArray(a) && a.every((x) => x === null)) && a !== "";
    if (Q.revealed[i]) cls += isAnswerCorrect(q, a) ? " correct" : " wrong";
    else if (isAnswered) cls += " answered";
    if (i === Q.index) cls += " current";
    if (Q.flags[i]) cls += " flagged";
    return `<button class="${cls}" data-i="${i}">${i + 1}</button>`;
  }).join("");
  pal.querySelectorAll(".palette-btn").forEach((b) => b.onclick = () => { Q.index = +b.dataset.i; go("quiz"); });
}

/* ===========================================================================
 *  BỘ ĐẾM GIỜ
 * ========================================================================= */
function startTimer() {
  const Q = State.quiz;
  stopTimer();
  const el = document.getElementById("timer");
  const total = Q.minutes * 60;
  const tick = () => {
    const elapsed = Math.floor((Date.now() - Q.startTs) / 1000);
    const left = total - elapsed;
    if (!el) return;
    if (left <= 0) { el.textContent = "00:00"; stopTimer(); doSubmit(true); return; }
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    el.textContent = `${m}:${s}`;
    el.classList.toggle("danger", left <= 300);
  };
  tick();
  Q.timerId = setInterval(tick, 1000);
}
function stopTimer() { if (State.quiz && State.quiz.timerId) { clearInterval(State.quiz.timerId); State.quiz.timerId = null; } }

/* ===========================================================================
 *  CHẤM ĐIỂM
 * ========================================================================= */
function isSAcorrect(q, ans) {
  if (ans == null) return false;
  const set = [q.answer].concat(q.accept || []).map(normSA);
  return set.includes(normSA(ans));
}
function isAnswerCorrect(q, ans) {
  if (q.type === "mc") return ans === q.answer;
  if (q.type === "sa") return isSAcorrect(q, ans);
  if (q.type === "tf") return Array.isArray(ans) && q.statements.every((s, i) => ans[i] === s.correct);
  return false;
}

/* Tính điểm theo thang chính thức + thống kê */
function grade() {
  const Q = State.quiz;
  let score = 0, correctCount = 0;
  const parts = { mc: { got: 0, max: 0, correct: 0, total: 0 }, tf: { got: 0, max: 0, correct: 0, total: 0 }, sa: { got: 0, max: 0, correct: 0, total: 0 } };
  const details = [];

  Q.questions.forEach((q, i) => {
    const ans = Q.answers[i];
    let pts = 0, max = 0, fullyCorrect = false, subCorrect = 0;

    if (q.type === "mc") {
      max = MC_POINT;
      fullyCorrect = ans === q.answer;
      pts = fullyCorrect ? MC_POINT : 0;
    } else if (q.type === "sa") {
      max = SA_POINT;
      fullyCorrect = isSAcorrect(q, ans);
      pts = fullyCorrect ? SA_POINT : 0;
    } else if (q.type === "tf") {
      max = 1.0;
      subCorrect = q.statements.reduce((n, s, k) => n + ((Array.isArray(ans) && ans[k] === s.correct) ? 1 : 0), 0);
      pts = TF_POINTS[subCorrect];
      fullyCorrect = subCorrect === q.statements.length;
    }

    score += pts;
    parts[q.type].got += pts;
    parts[q.type].max += max;
    parts[q.type].total += 1;
    if (fullyCorrect) { parts[q.type].correct += 1; correctCount += 1; }

    details.push({ q, ans, pts, max, fullyCorrect, subCorrect });
  });

  return { score: Math.round(score * 100) / 100, correctCount, total: Q.questions.length, parts, details };
}

/* ===========================================================================
 *  NỘP BÀI
 * ========================================================================= */
async function trySubmit() {
  const Q = State.quiz;
  const unanswered = Q.answers.filter((a, i) => {
    const t = Q.questions[i].type;
    if (t === "tf") return !Array.isArray(a) || a.some((x) => x === null);
    return a === null || a === undefined || a === "";
  }).length;
  const msg = unanswered > 0
    ? `Bạn còn ${unanswered} câu chưa hoàn thành. Nộp bài ngay bây giờ?`
    : "Bạn đã hoàn thành tất cả các câu. Nộp bài?";
  const ok = await confirmBox("Nộp bài", msg, "Nộp bài");
  if (ok) doSubmit(false);
}

function doSubmit(timeUp) {
  const Q = State.quiz;
  if (Q.submitted) return;
  Q.submitted = true;
  stopTimer();
  const result = grade();
  const durationSec = Math.floor((Date.now() - Q.startTs) / 1000);

  const record = {
    at: Date.now(),
    mode: Q.mode,
    title: Q.title,
    code: Q.code || null,
    lessonId: Q.lessonId || null,
    score: result.score,
    correctCount: result.correctCount,
    total: result.total,
    durationSec,
    timeUp: !!timeUp,
    /* Chi tiết từng câu — để dựng hồ sơ năng lực (radar 7 chủ đề) và biết người
       học sai ở đâu mà ôn lại đúng chỗ. Không có phần này thì lịch sử chỉ biết
       tổng điểm, không biết yếu chủ đề nào. */
    detail: Q.questions.map((q, i) => ({
      id: q.id, topic: q.topic, grade: q.grade, level: q.level,
      dung: isAnswerCorrect(q, Q.answers[i]),
    })),
  };
  State.history.unshift(record);
  State.history = State.history.slice(0, 50);
  save("history", State.history);
  if (typeof Gam !== "undefined") Gam.onQuizDone(record);
  // Trừ quỹ câu luyện/ngày của gói free theo số câu ĐÃ trả lời (thi thử không tính)
  if (typeof Plan !== "undefined" && Q.mode === "practice") {
    Plan.dungCau(Q.answers.filter((a) => a != null).length);
  }
  // Nộp xong bài là lúc có kết quả đáng lưu -> mời đăng nhập (chờ màn kết quả hiện ra)
  if (window.Account && Account.moiDangNhap) {
    setTimeout(function () { Account.moiDangNhap("lam"); }, 900);
  }
  if (window.Pwa) Pwa.dungThat();
  if (window.Nhac) Nhac.dungThat();
  /* Điểm khá thì reo mừng; điểm thấp thì để yên. Nộp bài 2 điểm mà máy vẫn kêu
     một tràng vui vẻ nghe như đang trêu. Màn kết quả đã nói đủ rồi. */
  if (window.Am && result.score >= 5) setTimeout(function () { Am.chucMung(); }, 260);

  go("result", { result, record });
}

/* ===========================================================================
 *  MÀN HÌNH KẾT QUẢ
 * ========================================================================= */
function renderResult(data) {
  const { result, record } = data;
  const Q = State.quiz;
  const isExam = Q.mode === "exam";
  const scoreOn10 = isExam ? result.score : Math.round((result.correctCount / result.total) * 1000) / 100;
  const pctScore = isExam ? (result.score / 10) : (result.correctCount / result.total);
  const ring = ringSVG(pctScore, isExam ? result.score.toFixed(2) : `${result.correctCount}/${result.total}`, isExam ? "/ 10 điểm" : "câu đúng");

  const msg = pctScore >= 0.9 ? aIco("trophy", "#eab308", 20) + " Xuất sắc!" : pctScore >= 0.7 ? aIco("star", "#f59e0b", 20) + " Tốt lắm!" : pctScore >= 0.5 ? aIco("flame", "#f97316", 20) + " Khá ổn, cố lên!" : aIco("book", "#3b82f6", 20) + " Cần ôn thêm nhé!";
  const mm = Math.floor(record.durationSec / 60), ss = record.durationSec % 60;

  const partRow = (key, label) => {
    const p = result.parts[key];
    if (p.total === 0) return "";
    return `<div class="config-row">
      <label>${label} <small style="color:var(--text-soft);font-weight:400">(${p.correct}/${p.total} câu đúng hoàn toàn)</small></label>
      <b>${p.got.toFixed(2)} / ${p.max.toFixed(2)} đ</b>
    </div>`;
  };

  app.innerHTML = `
    <div class="result-hero">
      <div class="score-ring">${ring}</div>
      <div class="result-msg">${msg}</div>
      ${record.timeUp ? `<p style="color:var(--danger);margin-top:6px;font-weight:600">${aIco("clock", "#dc2626", 15)} Đã hết giờ làm bài</p>` : ""}
    </div>

    <div class="stat-grid">
      <div class="stat-box g"><b>${result.correctCount}</b><small>Câu đúng hoàn toàn</small></div>
      <div class="stat-box r"><b>${result.total - result.correctCount}</b><small>Câu sai / thiếu</small></div>
      <div class="stat-box"><b>${mm}:${String(ss).padStart(2, "0")}</b><small>Thời gian làm</small></div>
      <div class="stat-box"><b>${isExam ? result.score.toFixed(2) : scoreOn10.toFixed(2)}</b><small>Điểm (thang 10)</small></div>
    </div>

    ${isExam ? `
    <div class="config-card">
      <div class="section-title" style="margin-top:0">${aIco("clipboard", "#4f46e5", 17)} Chi tiết điểm theo phần</div>
      ${partRow("mc", "Phần I - Trắc nghiệm 4 lựa chọn")}
      ${partRow("tf", "Phần II - Đúng/Sai")}
      ${partRow("sa", "Phần III - Trả lời ngắn")}
    </div>` : ""}

    <div class="quiz-nav" style="margin-bottom:22px">
      <button class="btn btn-ghost" id="retryBtn">${aIco("refresh", null, 15)} Làm lại</button>
      <div class="quiz-nav-left">
        <button class="btn btn-ghost" id="homeBtn">${aIco("home", null, 15)} Trang chủ</button>
        <button class="btn btn-primary" id="toggleReview">${aIco("eye", null, 15)} Xem lời giải chi tiết</button>
      </div>
    </div>

    <div id="reviewArea" hidden></div>
  `;

  document.getElementById("homeBtn").onclick = () => { State.quiz = null; go("home"); };
  document.getElementById("retryBtn").onclick = () => {
    if (isExam && Q.code && typeof startExamCode === "function") startExamCode(Q.code);
    else if (isExam) startExam();
    else { State.quiz = newQuiz(shuffle(Q.questions), Q.mode, { title: Q.title, minutes: Q.minutes }); go("quiz"); }
  };
  const rev = document.getElementById("reviewArea");
  const tglRev = document.getElementById("toggleReview");
  tglRev.onclick = () => {
    if (rev.hidden) { rev.hidden = false; renderReviewList(result); tglRev.innerHTML = aIco("eye", null, 15) + " Ẩn lời giải"; rev.scrollIntoView({ behavior: "smooth" }); }
    else { rev.hidden = true; tglRev.innerHTML = aIco("eye", null, 15) + " Xem lời giải chi tiết"; }
  };
}

function renderReviewList(result) {
  const rev = document.getElementById("reviewArea");
  rev.innerHTML = `<div class="section-title">${aIco("exam", "#4f46e5", 17)} Xem lại từng câu</div>` + result.details.map((d, i) => {
    const q = d.q;
    let userAns = "";
    if (q.type === "mc") userAns = d.ans != null ? `${String.fromCharCode(65 + d.ans)}. ${fmtQ(q.options[d.ans])}` : "(chưa trả lời)";
    else if (q.type === "sa") userAns = d.ans ? esc(d.ans) : "(chưa trả lời)";
    else if (q.type === "tf") userAns = Array.isArray(d.ans) ? q.statements.map((s, k) => `${["a", "b", "c", "d"][k]}-${d.ans[k] == null ? "?" : (d.ans[k] ? "Đ" : "S")}`).join(", ") : "(chưa trả lời)";

    let correctAns = "";
    if (q.type === "mc") correctAns = `${String.fromCharCode(65 + q.answer)}. ${fmtQ(q.options[q.answer])}`;
    else if (q.type === "sa") correctAns = fmtQ(q.answer);
    else if (q.type === "tf") correctAns = q.statements.map((s, k) => `${["a", "b", "c", "d"][k]}-${s.correct ? "Đ" : "S"}`).join(", ");

    return `
      <div class="review-item ${d.fullyCorrect ? "ok" : "no"}">
        <div class="review-q">Câu ${i + 1}. ${fmtQ(q.question)}</div>
        ${q.code ? `<pre class="q-code">${esc(q.code)}</pre>` : ""}
        <div style="font-size:14px;margin:6px 0">
          <div>Bạn trả lời: <b style="color:${d.fullyCorrect ? "var(--success)" : "var(--danger)"}">${userAns}</b>
            ${q.type === "tf" ? ` — <span style="color:var(--text-soft)">${d.subCorrect}/${q.statements.length} ý đúng (${d.pts.toFixed(2)}đ)</span>` : ""}</div>
          <div>Đáp án đúng: <b style="color:var(--success)">${correctAns}</b></div>
        </div>
        <div class="explain-box"><b>${aIco("bulb", "#d97706", 14)} Giải thích:</b> ${fmtGiaiThich(q.explain || "")}</div>
        ${d.fullyCorrect ? "" : `<button class="btn btn-ghost rv-why" data-i="${i}" hidden style="margin-top:10px">${aIco("bulb", "#d97706", 15)} Vì sao tôi sai?</button>`}
      </div>`;
  }).join("");

  /* Mời hỏi gia sư ngay dưới lời giải của từng câu SAI — cùng lối vào
     Tutor.moCauSai như lúc chấm từng câu. Chỉ hiện khi máy chủ đã bật AI. */
  if (typeof Tutor !== "undefined") {
    Tutor.trangThai().then((t) => {
      if (!t.on) return;
      rev.querySelectorAll(".rv-why").forEach((b) => {
        b.hidden = false;
        b.onclick = () => {
          const d = result.details[+b.dataset.i];
          Tutor.moCauSai(d.q, d.ans, State.quiz?.lessonId || null);
        };
      });
    });
  }
}

/* Vẽ vòng tròn điểm số bằng SVG */
function ringSVG(pct, big, small) {
  const r = 65, c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  const color = pct >= 0.7 ? "var(--success)" : pct >= 0.5 ? "var(--warning)" : "var(--danger)";
  return `
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r="${r}" fill="none" stroke="var(--bg-soft)" stroke-width="12"/>
      <circle cx="75" cy="75" r="${r}" fill="none" stroke="${color}" stroke-width="12"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
    </svg>
    <div class="score-num"><b>${big}</b><span>${small}</span></div>`;
}

/* ===========================================================================
 *  LỊCH SỬ / KẾT QUẢ
 * ========================================================================= */
function renderHistory() {
  const h = State.history;
  if (!h.length) {
    app.innerHTML = `
      <button class="back-link" id="back">${aIco("aleft", null, 15)} Về trang chủ</button>
      <div class="empty-state">
        <div class="big">${aIco("chart", "#4f46e5", 40)}</div>
        <h3>Chưa có lịch sử làm bài</h3>
        <p>Hãy bắt đầu một bài thi thử hoặc luyện tập để xem kết quả tại đây.</p>
        <button class="btn btn-primary" style="margin-top:16px" id="startNow">Bắt đầu ngay</button>
      </div>`;
    document.getElementById("back").onclick = () => go("home");
    document.getElementById("startNow").onclick = () => go("home");
    return;
  }

  const avg = (h.reduce((s, x) => s + x.score, 0) / h.length).toFixed(2);
  const best = Math.max(...h.map((x) => x.score)).toFixed(2);
  const exams = h.filter((x) => x.mode === "exam").length;

  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Về trang chủ</button>
    <h2 style="margin-bottom:16px">${aIco("chart", "#4f46e5", 22)} Kết quả & Tiến độ</h2>
    <div class="stat-grid">
      <div class="stat-box"><b>${h.length}</b><small>Lượt làm bài</small></div>
      <div class="stat-box g"><b>${best}</b><small>Điểm cao nhất</small></div>
      <div class="stat-box"><b>${avg}</b><small>Điểm trung bình</small></div>
      <div class="stat-box"><b>${exams}</b><small>Lần thi thử</small></div>
    </div>
    <div id="skillHere"></div>
    <div class="section-title">${aIco("clock", "#4f46e5", 17)} Lịch sử gần đây</div>
    <div>
      ${h.map((x) => {
        const d = new Date(x.at);
        const pct = x.mode === "exam" ? x.score / 10 : x.correctCount / x.total;
        const color = pct >= 0.7 ? "var(--success)" : pct >= 0.5 ? "var(--warning)" : "var(--danger)";
        const scoreLabel = x.mode === "exam" ? x.score.toFixed(1) : `${x.correctCount}/${x.total}`;
        const mm = Math.floor(x.durationSec / 60), ss = x.durationSec % 60;
        return `
        <div class="history-item">
          <div class="history-score" style="background:${color}">${scoreLabel}</div>
          <div class="history-info">
            <b>${esc(x.title)}</b>
            <small>${x.mode === "exam" ? "Thi thử" : "Luyện tập"} • ${x.correctCount}/${x.total} câu đúng • ${mm}:${String(ss).padStart(2, "0")}</small>
            <small>${d.toLocaleString("vi-VN")}</small>
          </div>
        </div>`;
      }).join("")}
    </div>
    <button class="btn btn-ghost" id="clearHist" style="margin-top:18px">${aIco("trash", "#dc2626", 15)} Xóa lịch sử</button>
  `;
  // Hồ sơ năng lực (radar 7 chủ đề) — đặt ngay trong trang Kết quả, xem js/skills.js
  if (typeof skillInjectRadar === "function") skillInjectRadar();
  document.getElementById("back").onclick = () => go("home");
  document.getElementById("clearHist").onclick = async () => {
    const ok = await confirmBox("Xóa lịch sử?", "Toàn bộ kết quả đã lưu sẽ bị xóa vĩnh viễn. Tiếp tục?", "Xóa");
    if (ok) { State.history = []; save("history", []); toast("Đã xóa lịch sử"); go("history"); }
  };
}

/* ===========================================================================
 *  LINH VẬT TRỢ LÝ CỐ ĐỊNH GÓC DƯỚI BÊN PHẢI (FLOATING FIXED MASCOT ASSISTANT)
 * ========================================================================= */
const FLOATING_TIPS = [
  "Robot luôn ở đây đồng hành cùng em nè! Bấm vào Robot để nghe gợi ý nhé! 🤖",
  "Học 15 phút mỗi ngày là chìa khóa đạt điểm 9+ Tin học THPT! 💡",
  "Hoàn thành các bài luyện tập để tích lũy XP và nâng Level nhé! ⭐",
  "Cần xem lại bài học hay luyện đề? Sử dụng thanh điều hướng phía trên nhé! 🚀",
  "Cố lên em ơi! Tư duy lập trình tốt sẽ giúp ích rất nhiều cho tương lai! 💻",
  "Học từ sai lầm là cách nhanh nhất để làm chủ kiến thức! 🔥"
];

const FLOATING_POSES = [
  "asset/mascot/poses/standing.png",
  "asset/mascot/poses/happy.png",
  "asset/mascot/poses/wink.png",
  "asset/mascot/poses/reading.png",
  "asset/mascot/poses/studying.png"
];

let mascotBubbleOpen = true;
let LESSON_DANG_MO = null; // bài học đang mở (đặt ở renderLesson, xoá khi rời trang bài)

function initFloatingMascot() {
  if (document.getElementById("floatingMascot")) return;

  const container = document.createElement("div");
  container.id = "floatingMascot";
  container.className = "floating-mascot-container";

  const randomTip = FLOATING_TIPS[Math.floor(Math.random() * FLOATING_TIPS.length)];
  const randomPose = mascotSrc(FLOATING_POSES[Math.floor(Math.random() * FLOATING_POSES.length)]);

  container.innerHTML = `
    <div class="floating-mascot-wrapper">
      <div class="floating-mascot-bubble" id="mascotBubble" ${mascotBubbleOpen ? "" : "hidden"}>
        <div class="floating-mascot-bubble-header">
          <span class="floating-mascot-badge">ROBOT TRỢ LÝ</span>
          <button class="floating-mascot-close" id="closeMascotBubble" title="Đóng bóng thoại">&times;</button>
        </div>
        <div class="floating-mascot-text" id="mascotTipText">${randomTip}</div>
        <button class="floating-mascot-ask" id="mascotAsk" hidden>${aIco("bulb", "#d97706", 14)} Hỏi gia sư</button>
      </div>
      <button class="floating-mascot-btn" id="mascotBtn" title="Bấm để tương tác với Robot!">
        <div class="floating-mascot-pulse"></div>
        <img src="${randomPose}" alt="Linh vật Robot" class="floating-mascot-img" id="mascotImg" />
      </button>
    </div>
  `;

  document.body.appendChild(container);

  const btn = document.getElementById("mascotBtn");
  const bubble = document.getElementById("mascotBubble");
  const closeBtn = document.getElementById("closeMascotBubble");
  const tipText = document.getElementById("mascotTipText");
  const mascotImg = document.getElementById("mascotImg");

  closeBtn.onclick = (e) => {
    e.stopPropagation();
    bubble.hidden = true;
    mascotBubbleOpen = false;
  };

  /* Robot kiêm gia sư — dò ngữ cảnh từ hẹp tới rộng, trùng khớp với các nút
     gắn tại chỗ để hai lối vào không nói hai chuyện khác nhau:
       1. câu đang xem đã chấm và SAI -> "vì sao tôi sai" đúng câu đó
       2. đang mở bài học / luyện bài  -> hỏi về bài đó
       3. còn lại                      -> hỏi chung (máy chủ rào phạm vi môn học)
     Nút chỉ hiện khi máy chủ đã bật AI. */
  const askBtn = document.getElementById("mascotAsk");
  if (typeof Tutor !== "undefined") {
    Tutor.trangThai().then((t) => { if (t.on) askBtn.hidden = false; });
    askBtn.onclick = (e) => {
      e.stopPropagation();
      const Q = State.quiz;
      if (State.view === "quiz" && Q) {
        const q = Q.questions[Q.index], ans = Q.answers[Q.index];
        // chỉ khi ĐÃ bấm Kiểm tra (revealed) — đang thi thử thì chưa lộ đáp án
        if (Q.revealed[Q.index] && q && !isAnswerCorrect(q, ans)) {
          Tutor.moCauSai(q, ans, Q.lessonId || null);
          return;
        }
        if (Q.lessonId) {
          const l = LESSONS.find((x) => x.id === Q.lessonId);
          if (l) { Tutor.moBai(l); return; }
        }
      }
      if (LESSON_DANG_MO) Tutor.moBai(LESSON_DANG_MO); else Tutor.moChung();
    };
  }

  btn.onclick = () => {
    if (bubble.hidden) {
      bubble.hidden = false;
      mascotBubbleOpen = true;
    }
    mascotTip();   // bấm Robot -> đổi lời khuyên và tư thế
  };
}

/* --- Robot trợ lý: nơi DUY NHẤT hiện lời khen / động viên ---------------------
   Trước đây màn làm bài có thêm một khối linh vật to giữa trang; nay mọi phản
   hồi (đúng, sai, chuỗi đúng liên tiếp) đều nói qua bóng thoại của Robot ở góc
   dưới phải, rồi tự quay về lời khuyên chung sau ít giây. */
let mascotRevertTimer = null;

function mascotSay(msg, opts) {
  opts = opts || {};
  initFloatingMascot();
  const bubble = document.getElementById("mascotBubble");
  const text = document.getElementById("mascotTipText");
  const img = document.getElementById("mascotImg");
  const badge = document.querySelector(".floating-mascot-badge");
  if (!bubble || !text) return;

  bubble.hidden = false;
  mascotBubbleOpen = true;
  text.textContent = msg;
  if (opts.pose && img) img.src = opts.pose;
  if (badge) badge.textContent = opts.badge || "ROBOT TRỢ LÝ";
  bubble.classList.remove("tone-correct", "tone-wrong", "tone-streak");
  if (opts.tone) bubble.classList.add("tone-" + opts.tone);

  clearTimeout(mascotRevertTimer);
  if (opts.giuLai !== true) mascotRevertTimer = setTimeout(mascotTip, opts.giay ? opts.giay * 1000 : 7000);
}

/* Quay về một lời khuyên chung (cũng dùng khi người học bấm vào Robot). */
function mascotTip() {
  const text = document.getElementById("mascotTipText");
  const img = document.getElementById("mascotImg");
  const bubble = document.getElementById("mascotBubble");
  const badge = document.querySelector(".floating-mascot-badge");
  if (!text) return;
  text.textContent = FLOATING_TIPS[Math.floor(Math.random() * FLOATING_TIPS.length)];
  if (img) img.src = mascotSrc(FLOATING_POSES[Math.floor(Math.random() * FLOATING_POSES.length)]);
  if (badge) badge.textContent = "ROBOT TRỢ LÝ";
  if (bubble) bubble.classList.remove("tone-correct", "tone-wrong", "tone-streak");
}

/* ===========================================================================
 *  CHỦ ĐỀ SÁNG / TỐI + KHỞI ĐỘNG
 * ========================================================================= */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", State.settings.theme);
  const tb = document.getElementById("themeToggle");
  const dark = State.settings.theme === "dark";
  if (typeof ICON === "function") tb.innerHTML = ICON(dark ? "sun" : "moon", 18);
  else tb.textContent = dark ? "☀️" : "🌙";
}
function toggleTheme() {
  State.settings.theme = State.settings.theme === "dark" ? "light" : "dark";
  save("settings", State.settings);
  applyTheme();
}

function initNav() {
  if (typeof iconify === "function") iconify(document);
  document.getElementById("themeToggle").onclick = toggleTheme;
  document.getElementById("homeLink").onclick = () => guardLeave(() => go("home"));
  document.getElementById("homeLink").onkeydown = (e) => { if (e.key === "Enter") go("home"); };
  document.querySelectorAll(".nav-btn[data-nav]").forEach((b) => b.onclick = () => guardLeave(() => go(b.dataset.nav)));
}

/* Nếu đang làm bài thi (chưa nộp) thì hỏi trước khi rời đi */
async function guardLeave(fn) {
  if (State.quiz && !State.quiz.submitted && State.view === "quiz") {
    const ok = await confirmBox("Rời khỏi bài làm?", "Bài làm hiện tại chưa được lưu. Bạn có chắc muốn rời đi?", "Rời đi");
    if (!ok) return;
    stopTimer(); State.quiz = null;
  }
  fn();
}

/* Cảnh báo khi đóng tab lúc đang làm bài */
window.addEventListener("beforeunload", (e) => {
  if (State.quiz && !State.quiz.submitted) { e.preventDefault(); e.returnValue = ""; }
});

/* ---------------------------------------------------------------------------
 *  KHỞI ĐỘNG — phải ĐĂNG NHẬP và CHỌN HỒ SƠ mới vào được app.
 *  Thứ tự: hỏi máy chủ xem đã đăng nhập chưa -> chưa thì hiện màn đăng nhập;
 *  đăng nhập rồi mà chưa chọn hồ sơ -> hiện màn chọn hồ sơ; đủ cả hai mới render
 *  app và đồng bộ tiến độ. Ẩn thanh điều hướng khi chưa vào được.
 * ------------------------------------------------------------------------- */
function moKhoaGiaoDien(mo) {
  document.querySelectorAll(".topnav .nav-btn[data-nav]").forEach((b) => { b.hidden = !mo; });
  const brand = document.getElementById("homeLink");
  if (brand) brand.style.pointerEvents = mo ? "" : "none";
}

function khoiDong() {
  applyTheme();
  initNav();

  if (!window.Account) {           // không có account.js -> chạy như bản cũ
    if (window.NhiemVu) NhiemVu.moKhoa();
    moKhoaGiaoDien(true); initFloatingMascot(); renderFromHash(); return;
  }
  moKhoaGiaoDien(false);
  Account.boot().then(function () {
    /* CHƯA ĐĂNG NHẬP vẫn học được đầy đủ phần miễn phí — tiến độ lưu trên máy,
       khi nào đăng nhập thì được mang sang tài khoản (Account.gopDuLieuKhach).
       Không đặt tường đăng nhập ở đây: khách từ Google vào trang /bai bấm "Mở
       bài trong ứng dụng" mà gặp form đăng nhập là quay ra ngay.
       Máy chủ chưa nối CSDL cũng vào chế độ này thay vì chặn cả app. */
    if (!Account.user) {
      /* Khách: State đã nạp xong từ localStorage, đây CHÍNH LÀ dữ liệu thật của
         em ấy — chụp mốc nhiệm vụ tuần được ngay. */
      if (window.NhiemVu) NhiemVu.moKhoa();
      moKhoaGiaoDien(true);
      initFloatingMascot();
      renderFromHash();
      return;
    }
    if (!Account.profileId) { Account.renderProfilePicker(); return; }

    moKhoaGiaoDien(true);
    initFloatingMascot();
    renderFromHash();
    Account.fullSync().then(function () {
      /* CHỈ mở khoá nhiệm vụ tuần SAU khi đồng bộ xong. Chụp mốc lúc State còn
         rỗng thì người đã học 2 tháng mở app trên máy mới sẽ thấy cả 3 nhiệm vụ
         tự xanh và được tặng 190 XP khống. */
      if (window.NhiemVu) NhiemVu.moKhoa();
      if (VE_LAI_SAU_DONG_BO.has(State.view)) renderFromHash();
    });
  });
}
khoiDong();
