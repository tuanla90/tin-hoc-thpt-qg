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
  const map = { home: renderHome, lessons: renderLessons, lesson: renderLesson, playground: renderPlayground, practiceSetup: renderPracticeSetup, quiz: renderQuiz, result: renderResult, history: renderHistory, vocab: window.renderVocabPage, achievements: (window.Gam && window.Gam.renderAchievements), examCodes: window.renderExamCodes, tfDrill: window.renderTFDrill, profile: window.renderProfile, sqlLab: window.renderSqlLab, gfxLab: window.renderGfxLab, account: window.renderAccount, onNhanh: window.renderOnNhanh,
    moPhong: window.renderMoPhong, thucHanh: window.renderThucHanh };
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
    /* Mô phỏng và Thực hành có ĐỊA CHỈ RIÊNG, không còn là trang bài học cuộn
       xuống. Nhờ vậy gửi được link riêng, F5 vẫn ở đúng chỗ, và mỗi màn có tiến
       độ riêng (dấu "đã xem" cho mô phỏng, số sao cho thực hành). */
    case "moPhong": return "#/mo-phong/" + encodeURIComponent((data && data.id) || "");
    case "thucHanh": return "#/thuc-hanh/" + encodeURIComponent((data && data.id) || "");
    /* Ôn nhanh gộp ba màn (tổng kết chương / bẫy / bản in) vào MỘT view, phân
       biệt bằng data.muc — ba view rời thì ba lần khai báo ở cả ba chỗ (hash,
       parse, renderer) trong khi chúng dùng chung hết dữ liệu và thanh tab. */
    case "onNhanh": {
      const m = data && data.muc, s = data && data.stage;
      if (m === "chuong") return "#/on-nhanh/chuong/" + s + "/" + (data.ci || 0);
      return "#/on-nhanh" + (m ? "/" + m : "") + (s ? "/" + s : "");
    }
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
    case "mo-phong": return { view: "moPhong", data: parts[1] ? { id: decodeURIComponent(parts[1]) } : undefined };
    case "thuc-hanh": return { view: "thucHanh", data: parts[1] ? { id: decodeURIComponent(parts[1]) } : undefined };
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
    /* #/on-nhanh · #/on-nhanh/<muc> · #/on-nhanh/<stage> · #/on-nhanh/chuong/<stage>/<ci>
       Đoạn thứ hai vừa có thể là tên mục vừa có thể là số chặng (dạng "#/on-nhanh/20"),
       nên phải xét bằng isNaN chứ không đếm số đoạn. */
    case "on-nhanh": {
      const p1 = parts[1] || "";
      if (p1 === "chuong") return { view: "onNhanh", data: { muc: "chuong", stage: +parts[2], ci: +parts[3] } };
      if (p1 === "" || !isNaN(+p1)) return { view: "onNhanh", data: { stage: +p1 || undefined } };
      return { view: "onNhanh", data: { muc: p1, stage: +parts[2] || undefined } };
    }
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
  // Đồng bộ trạng thái active của Bottom Nav di động
  document.querySelectorAll(".bottom-nav .bnav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.nav === view);
  });
  if (view !== "lesson") LESSON_DANG_MO = null; // robot trợ lý dựa vào đây để biết ngữ cảnh
  const keepScroll = keepScrollOnce;
  keepScrollOnce = false;
  const prevY = window.scrollY;

  /* Ghi lại chỗ đang đứng của màn VỪA RỜI, rồi xem màn sắp vào đã từng ghé chưa.
     Trước đây chỗ này còn một nhánh "hashCoNeo" để XOÁ chỗ cuộn đã nhớ khi màn vừa
     rời được mở bằng neo (bấm ô Mô phỏng/Thực hành thì vào trang bài rồi cuộn sâu
     xuống). Mô phỏng và Thực hành giờ là MÀN RIÊNG nên không còn cuộn sâu nào để
     phải quên — nhánh đó đã bỏ. */
  if (hashTruoc && hashTruoc !== location.hash) scrollNho.set(hashTruoc, prevY);
  hashTruoc = location.hash;
  const yCu = keepScroll ? prevY : scrollNho.get(location.hash);
  (viewRenderer(view))(d);
  /* CUỘN SAU KHI DỰNG XONG, và cuộn TỨC THÌ chứ không mượt.
     Bản trước gọi scrollTo({behavior:"smooth"}) TRƯỚC khi thay innerHTML: cú cuộn
     mượt là một hoạt ảnh kéo dài vài trăm mili giây, mà ngay sau đó cả trang bị
     thay nội dung — trình duyệt huỷ hoạt ảnh giữa chừng nên trang đứng nguyên ở
     chỗ cũ. Đó chính là lỗi "bấm Bài tiếp theo mà ĐÔI KHI không lên đầu": lúc lên
     lúc không tuỳ nội dung mới dựng nhanh hay chậm.
     Đổi màn hình thì cuộn tức thì mới đúng — cuộn mượt qua một trang đã biến mất
     chẳng để làm gì. */
  if (yCu != null) window.scrollTo(0, yCu);
  else if (!keepScroll) window.scrollTo(0, 0);
}

window.addEventListener("hashchange", renderFromHash);

/* Bản đồ lộ trình tính hình học (bề ngang khung, biên độ sóng) MỘT LẦN lúc dựng,
   dựa vào window.innerWidth. Xoay ngang điện thoại là đổi mốc 620px nhưng bản đồ
   vẫn giữ hình học cũ — sóng hẹp giữa một khung rộng, hoặc chữ tràn khỏi thẻ.
   Chỉ dựng lại KHI ĐỔI MỐC, không phải mỗi lần kéo cửa sổ: dựng lại là mất chỗ
   cuộn và đóng lại các chương đang mở, không đáng làm cho một vài pixel. */
let mocRongCu = window.innerWidth >= 620;
let henDoiCo = null;
window.addEventListener("resize", () => {
  const moc = window.innerWidth >= 620;
  if (moc === mocRongCu) return;
  mocRongCu = moc;
  if (State.view !== "lessons") return;   // màn khác không phụ thuộc hình học này
  clearTimeout(henDoiCo);
  henDoiCo = setTimeout(() => { keepScrollOnce = true; renderFromHash(); }, 180);
});

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

  /* Số bài thực hành: đếm ĐÚNG như demBaiTap() trong nhiem-vu.js — BỐN kho, có cả
     GLAB. Trước đây bỏ GLAB với lí do "phòng đồ hoạ là mô phỏng, không có đúng/sai
     để chấm", nhưng mỗi widget đồ hoạ đều có đáp án đích và tự chấm, làm đúng là
     gọi Gam.onExercisePass y như ba kho kia — nên nó vào tử số mà không có trong
     mẫu số, đếm ra tỉ lệ vượt 100%. Đổi ở đây thì phải đổi cả demBaiTap(), không
     thì trang chủ và nhiệm vụ tuần báo hai con số lệch nhau. */
  const soBaiTap = ["EXERCISES", "SQL_EXERCISES", "WEB_EXERCISES", "GLAB"].reduce((n, ten) => {
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
  /* Ô "Ôn hôm nay" — chỉ hiện khi THẬT SỰ có câu tới hẹn. Hiện cả lúc rỗng thì
     nó thành một ô "0 câu" nằm chình ình mỗi ngày, người học quen mắt rồi bỏ qua
     luôn cả những hôm có việc thật. */
  const onHomNayHtml = () => {
    if (!window.OnTap) return "";
    const sl = OnTap.soLieu();
    if (!sl.denHan) return "";
    const so = sl.trongSo;
    return `<div class="continue-card" id="onHomNay" role="button" tabindex="0"
        style="display:flex;align-items:center;gap:14px;background:var(--warning-soft);
          border:1px solid var(--warning);border-radius:var(--radius);padding:13px 16px;margin:2px 0 18px;cursor:pointer">
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:700;color:#b45309;letter-spacing:.02em">ÔN HÔM NAY</div>
          <b style="display:block;font-size:16px;color:var(--text);margin:2px 0 0">${sl.denHan} câu tới hẹn ôn lại</b>
          <small style="color:var(--text-soft);font-size:12.5px">${
            so ? so + " câu trong sổ sai được hỏi trước" : "Ôn đúng lúc sắp quên thì nhớ lâu nhất"
          }</small>
        </div>
        ${aIco("clock", "#b45309", 26)}
      </div>`;
  };

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
    ${onHomNayHtml()}

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
  const oOn = document.getElementById("onHomNay");
  if (oOn) {
    /* Tên VIEW là "practiceSetup" (hash mới là "#/practice") — gọi go("practice")
       thì viewToHash không khớp case nào, hash không đổi và trang đứng yên. */
    const moOn = () => { setupCfg.tab = "hom-nay"; go("practiceSetup"); };
    oOn.onclick = moOn;
    oOn.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); moOn(); } };
  }
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
  tongket: { nhan: "Tổng kết", icon: "layers", mau: "#0284c7" },
  luyen: { nhan: "Luyện tập", icon: "target", mau: "#16a34a" },
  thi: { nhan: "Thi thử", icon: "flag", mau: "#dc2626" },
};

/* Quy đổi tỉ lệ đúng -> số sao (0-3), và vẽ một ngôi sao. Ở SCOPE NGOÀI vì cả
   bản đồ lộ trình (renderLessons) lẫn màn kết quả (renderResult) đều cần —
   đặt trùng công thức ở hai nơi thì có ngày một chỗ đổi ngưỡng, chỗ kia quên. */
const starsFor = (s) => (s == null ? 0 : s >= 0.9 ? 3 : s >= 0.6 ? 2 : s > 0 ? 1 : 0);
const starSvg = (on, cls) => `<svg viewBox="0 0 24 24" class="${cls || "pn-star"}${on ? " on" : ""}" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/></svg>`;

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

  /* Điểm tốt nhất của một bài hoặc một ô phụ ("LT:22:1", "TT:22"), lấy từ kho
     THÀNH TÍCH BỀN chứ không quét lại lịch sử: lịch sử chỉ giữ 50 lượt nên bài học
     từ lâu sẽ mất sao. Xem js/thanh-tich.js. */
  const diemO = (id) => (window.ThanhTich ? ThanhTich.diem(id) : null);
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
  /* Số đề THI THỬ TRONG LỘ TRÌNH đã làm (id tổng hợp bắt đầu bằng "TT:"). Chỉ đếm
     đề của lộ trình, không đếm đề ở mục Thi thử: mỗi đường có quyền lợi free
     riêng, trộn vào nhau thì làm 1 đề ở mục kia là mất luôn ô này. */
  const soDeDaThi = window.ThanhTich ? ThanhTich.soDeThiThu() : 0;
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
    /* Ô tổng kết đứng TRƯỚC ô luyện tập: đọc lại chốt kiến thức rồi mới làm câu
       hỏi mới đúng thứ tự ôn. Chương nào chưa gom được câu chốt nào thì bỏ qua,
       không vẽ ô rỗng. */
    if (typeof OnNhanh !== "undefined" && OnNhanh.chuongCoChot(CHANG, ci)) {
      cells.push({ loai: "tongket", chuong: c, ci });
    }
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
  const CELL = 68;                     // BƯỚC hình học của bản đồ (dùng tính A, không phải cỡ ô)
  /* Ô HƠI BẸT chứ không tròn hẳn — Duolingo cũng vậy, và đó là thứ tạo cảm giác
     nhìn từ trên chếch xuống. Tròn hẳn + cạnh dày bên dưới thì cạnh đó đọc ra như
     một vệt bóng dán vào, không ra khối. Tỉ lệ ~1,15 : 1 là mức thấy được mà chưa
     thành bầu dục. Đổi hai số này thì phải đổi cả bán kính cung sao ở cungSao(). */
  const NODE_W = 76, NODE_H = 66;      // ô bài
  const OPHU_W = 82, OPHU_H = 72;      // ô phụ (mô phỏng / thực hành / luyện tập / thi thử)
  const CAP_W = 190;                   // 190px/3 dòng: không cắt tên bài nào trong 119 bài

  /* BỀ NGANG KHUNG THEO MÀN HÌNH, và BIÊN ĐỘ SÓNG SUY TỪ NÓ.
     Trước đây khung đóng cứng 340px với biên độ 128px. Khối chữ rộng 190px canh
     giữa dưới ô, nên ô ngoài cùng (tâm cách lề 42px) cần chữ bắt đầu ở -53px —
     phải kẹp về 4px, tức chữ LỆCH KHỎI TÂM Ô 57px. Đo được 15 khối lệch mỗi chặng,
     hai cột ngoài cùng lệch 57px, hai cột trong lệch 19px. Mắt thấy ngay.
     Ở desktop thẻ chương rộng 756px nên 340px là bỏ không hơn 400px chỗ trống —
     nới khung ra là hết phải kẹp mà sóng vẫn giữ nguyên biên độ.
     Ở điện thoại 375px thẻ chỉ rộng 339px, không nới được, nên phải HẠ biên độ:
     sóng hẹp hơn nhưng chữ đúng tâm ô. Thà sóng bớt rộng còn hơn chữ lệch. */
  const IW = window.innerWidth >= 620 ? 460 : 330;
  const CX = Math.round(IW / 2);
  /* Biên độ tối đa để khối chữ của ô ngoài cùng vẫn nằm trong khung: CX − nửa
     khối chữ − 4px lề. Trần 2·CELL−8 giữ đúng ý "sóng rộng khoảng 5 ô" của bản
     đầu, và chừa 8px cho vành nhấp nháy của ô đang học. */
  const A = Math.min(2 * CELL - 8, CX - CAP_W / 2 - 4);
  /* STEP 176 -> 184: chữ 3 dòng của ô TRÊN chạm vào cung sao của ô DƯỚI đúng 3px.
     Nới bước 8px thì hở 5px ở mọi trường hợp — chắc chắn hơn hẳn cách bào bớt cỡ
     sao hay kéo cung sát ô, hai cách đó chỉ còn hở 1-2px nên tên bài dài thêm một
     dòng là lại vỡ. Bản đồ cao thêm ~5%, đổi lại mất hẳn một LOẠI va chạm. */
  const STEP = 184, PADTOP = 78;
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

  /* Linh vật rải vào khoảng trống bên đối diện node cho bản đồ đỡ trống trải.
     SÁU ẢNH NÀY ĐỀU CÓ CẢ BẢN NỮ LẪN BẢN NAM (xem MASCOT_NAM) — đó là điều kiện
     bắt buộc, không phải chọn cho đẹp. Danh sách cũ có cheer-pompom, pointing,
     reading-tablet, magnifier: bốn ảnh chỉ có bản nữ. Hồ sơ chọn "nam" thì
     mascotSrc() đổi được 2 trong 6 ảnh, còn 4 ảnh kia vẫn ra nhân vật nữ — cuộn
     bản đồ xuống là thấy lúc nam lúc nữ, trông như hai nhân vật khác nhau. */
  const MASCOT_BANDO = [
    "asset/mascot/scenes/wave.png",
    "asset/mascot/scenes/explaining.png",
    "asset/mascot/scenes/thumbs-up.png",
    "asset/mascot/scenes/did-you-know.png",
    "asset/mascot/scenes/great-job.png",
    "asset/mascot/scenes/gesture.png",
  ];

  const chapHtml = (c, chapIdx) => {
    const n = c.cells.length;
    const C = c.color || "var(--primary)";
    const pts = c.cells.map((o, k) => ({
      x: CX + lech(k) * A, y: PADTOP + k * STEP, o,
    }));
    const H = pts[pts.length - 1].y + CAP_BOT;

    const f1 = (v) => v.toFixed(1);

    /* LINH VẬT — quy tắc cố định: đứng NGANG ô thứ 3, 7, 11, 15… (đếm từ 1),
       tức chỉ số 0 là k ≡ 2 (mod 4), và luôn ở phía ĐỐI DIỆN ô đó.

       Vì sao đúng những ô ấy: làn sóng có lech(k) = sin(2πk/8), nên k = 2, 6, 10,
       14… rơi vào lech = ±1 — hai CỘT NGOÀI CÙNG. Ô ở cột ngoài cùng thì bên đối
       diện rộng nhất (khối chữ 190px canh giữa ô nằm hẳn về một phía), nên chỗ đặt
       luôn dư và trái/phải tự đổi luân phiên. Nhờ vậy bỏ được cả ba thứ chắp vá
       của bản trước: giới hạn 3 con mỗi chương, luật giãn cách "cách nhau ít nhất
       3 ô", và phép đo chỗ trống rồi bỏ qua khi chật.

       top = p.y - 65 (nửa chiều cao khung 130px) -> khung ảnh canh giữa đúng hàng
       của ô. Ảnh dùng object-position: bottom nên NHÂN VẬT nằm ở nửa dưới khung,
       tức hơi thấp hơn ô một chút — đúng dáng Duolingo. */
    const macs = (() => {
      const ra = [];
      for (let k = 2; k < n; k += 4) {
        const p = pts[k];
        const ben = p.x > CX ? "left:6px" : "right:6px";
        const img = MASCOT_BANDO[(CHANG + chapIdx + ra.length) % MASCOT_BANDO.length];
        ra.push(`<div class="pmascot" style="${ben};top:${f1(p.y - 65)}px">
            <img src="${mascotSrc(img)}" alt="" aria-hidden="true" draggable="false" loading="lazy" />
          </div>`);
      }
      return ra.join("");
    })();

    const nodes = pts.map((p) => {
      const o = p.o;
      /* Khối chữ NGAY DƯỚI ô, canh giữa theo ô. Kẹp trong khung vì ô ngoài cùng
         lệch tới 128px, canh giữa nguyên bản sẽ đẩy khối chữ 190px ra ngoài mép. */
      /* KHÔNG kẹp nữa — A ở trên đã được suy ra sao cho khối chữ của ô ngoài cùng
         vẫn nằm trong khung, nên kẹp chỉ có thể làm chữ lệch khỏi tâm ô chứ không
         cứu được gì. Đó chính là lỗi của bản trước. */
      const capL = p.x - CAP_W / 2;
      const capStyle = `left:${f1(capL)}px;top:${f1(p.y + CAP_DY)}px`;
      /* Nửa bề ngang ô, để đặt left = tâm - nửa. Phải bằng ĐÚNG nửa bề rộng CSS
         (ô bài 68px, ô phụ 76px), không thì hai ô lẽ ra đối xứng lại lệch nhau. */
      const dat = (w, h) => `left:${f1(p.x - w / 2)}px;top:${f1(p.y - h / 2)}px;--cc:${C}`;
      /* mauNhan chỉ được truyền cho ô phụ (mô phỏng/thực hành/luyện tập/thi thử) —
         dùng chính điều kiện đó để đổi font: .pn-num vốn font-mono cho vừa nhãn
         "Bài 12" (số, hợp monospace), nhưng nhãn ô phụ là CHỮ VIỆT NHIỀU DẤU
         ("Luyện tập", "Mô phỏng") — monospace ép mỗi kí tự vào ô rộng bằng nhau
         bất kể nét chữ, nhìn ra một khoảng "hở" giữa các kí tự có dấu, giống lỗi
         dãn cách. Đổi sang phông thường (.pn-chu) cho đúng nhãn có dấu. */
      const capHtml = (nhan, mauNhan, ten, phai) =>
        `<div class="pn-cap" style="${capStyle}">
          <span class="pn-top"><span class="pn-num${mauNhan ? " pn-chu" : ""}"${mauNhan ? ` style="color:${mauNhan}"` : ""}>${nhan}</span>${phai || ""}</span>
          <span class="pn-name">${ten}</span>
        </div>`;

      /* BA SAO XẾP THÀNH CUNG ÔM PHÍA TRÊN Ô — kiểu Candy Crush / Duolingo.
         Luôn hiện đủ ba sao: chưa đạt thì sao rỗng, đạt tới đâu tô vàng tới đó. Bản
         trước chỉ hiện sao SAU KHI học xong và đặt cạnh tên bài, nên trước khi học
         không có gì cho biết bài này chấm được mấy sao — mất hẳn cái đích để nhắm.
         Sao rỗng tô TRẮNG kèm viền xám: trắng trơn thì chìm mất trên nền sáng, mà
         xám trơn thì chìm trên nền tối; có viền thì đọc được ở cả hai giao diện.
         Ba góc -112° / -90° / -68°: cụm sát nhau (đã đi qua -138/-90/-42 rồi
         -122/-90/-58, cả hai còn rời rạc). Tâm hai sao kề nhau cách ~22px, sao rộng
         20px nên chúng gần chạm nhau — đúng kiểu Candy Crush, mỗi sao xoay theo tiếp tuyến nên cả cụm ôm đúng mép ô.
         HAI BÁN KÍNH chứ không một: ô nay là ELIP (bẹt hơn chiều cao), nên cung
         sao cũng phải elip theo, không thì sao trên đỉnh sát ô mà sao hai bên lại
         hở toác. Rx/Ry = bán trục của ô cộng cùng một khoảng hở.
         Khoảng hở tính theo hình học: sao 20px xoay đi thì nửa đường chéo là
         20·√2/2 ≈ 14,1px, cộng lề ~7 -> 21 cho ô bài. Ô phụ là chữ nhật bo góc nên
         mép theo hướng chéo xa hơn -> 26. Đo lại bằng khoảng cách tâm-tới-tâm trừ
         nửa đường chéo sao, KHÔNG ướm bằng hình chữ nhật bao (hình chữ nhật bao
         một ô cong báo chồng ở bốn góc trống, sai hoàn toàn). */
      const GOC_SAO = [-112, -90, -68];
      const SAO_NUA = 10;                       // nửa cạnh sao (.pn-as 20px)
      const cungSao = (cx, cy, sang, Rx, Ry) => GOC_SAO.map((g, i) => {
        const r = (g * Math.PI) / 180;
        const x = cx + Rx * Math.cos(r), y = cy + Ry * Math.sin(r);
        /* Góc xoay đặt qua biến CSS --r thay vì thẳng vào transform: animation
           "sao mới" (xem .pn-as.moi) cần CỘNG scale vào cùng transform, mà một
           thuộc tính CSS chỉ nhận một giá trị transform cuối cùng — để lẫn trong
           inline style thì animation ghi đè mất góc xoay, sao quay ngang loạn. */
        return `<svg class="pn-as${i < sang ? " on" : ""}" viewBox="0 0 24 24" aria-hidden="true"
            style="left:${f1(x - SAO_NUA)}px;top:${f1(y - SAO_NUA)}px;--r:${g + 90}deg;animation-delay:${i * 110}ms">
            <path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/></svg>`;
      }).join("");

      if (o.loai === "bai") {
        const gi = o.gi, l = o.l, done = learned[gi], open = unlocked[gi], cur = gi === currentIdx;
        const cls = done ? "done" : open ? "open" : "locked";
        const glyph = done ? ic("check") : open ? ic("play") : ic("lock");
        const name = esc((l.title || "").replace(/^Bài\s*\d+[.\s]*/, ""));
        const stTxt = done ? "đã học" : open ? "đang học" : "chưa mở khóa";
        const hasQuiz = l.quiz && l.quiz.length;
        /* Sao lấy từ điểm luyện tập của bài. CHƯA học cũng vẫn vẽ đủ ba sao rỗng —
           đó là cái đích để nhắm; chỉ bài chưa mở khoá mới mờ đi. */
        const stars = hasQuiz ? Math.max(0, starsFor(diemO(l.id))) : -1;
        /* Bài khoá phải nói RÕ phải học xong bài nào mới mở, chứ "hãy hoàn thành bài
           trước" thì học sinh còn phải tự đi tìm bài trước là bài nào. */
        const truoc = open ? null : sorted[gi - 1];
        const khoaBai = truoc
          ? `Học xong Bài ${truoc.order} — ${(truoc.title || "").replace(/^Bài\s*\d+[.\s]*/, "")} thì bài này mở`
          : "Bài này chưa mở khoá trong lộ trình tuần tự";
        return `${stars >= 0 ? `<div class="pn-arc${open ? "" : " mo"}" title="Mastery: ${stars}/3 sao">${cungSao(p.x, p.y, stars, NODE_W / 2 + 21, NODE_H / 2 + 21)}</div>` : ""}
          <button class="pnode ${cls}${cur ? " cur" : ""}" data-key="${esc(o.key)}" data-lock="${open ? 0 : 1}" data-khoa="${esc(khoaBai)}" style="${dat(NODE_W, NODE_H)}" title="${esc(l.title)}" aria-label="Bài ${l.order}: ${name} — ${stTxt}, ${stars}/3 sao">
            ${cur ? `<span class="pn-bubble">${ICON("flame", 13)} BẮT ĐẦU</span>` : ""}
            <span class="pnode-inner-icon">${glyph}</span>
          </button>
          ${capHtml("Bài " + l.order, null, name, "")}`;
      }

      // ---- Ô phụ: mô phỏng / thực hành / luyện tập / thi thử ----
      const dang = O_PHU[o.loai];
      let open = true, ten = "", nhan = dang.nhan, khoaTxt = "";
      let starsHtml = "", pre = false;
      /* Số sao của ô phụ, -1 nghĩa là ô này không chấm sao (mô phỏng, tổng kết).
         Vẽ thành CUNG giống ô bài, không phải chùm sao nhỏ cạnh nhãn. */
      let saoO = -1;

      /* Ô phụ nằm trong trang bài học nên bài chưa mở thì nó cũng chưa mở — nói rõ
         như vậy, đừng để học sinh đoán tại sao bấm không vào được. */
      const vBai = o.l ? `Ô này nằm trong Bài ${o.l.order}, mà bài đó chưa mở khoá — học xong bài trước nó là mở cả hai` : "";

      if (o.loai === "mophong") {
        open = unlocked[o.gi];
        // Nhãn trên đã ghi "Mô phỏng" nên dòng dưới chỉ cần nói mô phỏng CÁI GÌ
        ten = open ? "Bấm từng bước, xem máy làm gì" : "Chưa mở — bài học chưa tới";
        khoaTxt = vBai;
        /* DẤU TÍCH, không phải sao. Mô phỏng không có đúng/sai để chấm, gắn sao vào
           thì ai cũng 3/3 — sao vô nghĩa, mà còn làm loãng ý nghĩa của sao ở ô
           Luyện tập. Dấu tích chỉ nói "đã xem hết các bước". */
        if (open && window.ManRieng && ManRieng.daXemMoPhong(o.l.id)) {
          starsHtml = `<span class="pn-xem" title="Đã xem hết các bước">${aIco("check2", "#16a34a", 14)}</span>`;
        }
      } else if (o.loai === "thuchanh") {
        open = unlocked[o.gi];
        ten = `${o.soBt} bài ${TEN_XUONG_NGAN[o.xuong] || "code"} — máy chấm`;
        khoaTxt = vBai;
        pre = typeof Plan !== "undefined" && !Plan.xuongMo(o.xuong, o.l);
        /* SAO theo số bài làm đúng — xưởng thực hành có máy chấm nên đo được thật.
           Vẽ đủ ba sao (rỗng khi chưa làm) như ô bài, để nhìn là biết ô này chấm sao. */
        if (open && !pre && window.ManRieng) saoO = ManRieng.saoThucHanh(o.l.id).sao;
      } else if (o.loai === "tongket") {
        /* Mở ngay từ đầu, KHÔNG đòi học xong bài nào: đây là bản rút gọn để ôn
           gấp, mà lúc ôn gấp thì học sinh cần vào thẳng chứ không đi lại lộ trình. */
        open = true;
        ten = "Cả chương trong một màn, mỗi bài một câu chốt";
      } else if (o.loai === "luyen") {
        const daHoc = c.items.filter((it) => learned[it.gi]).length;
        open = daHoc >= 1;
        ten = open ? "Ôn lại cả chương, biết đáp án ngay" : "Học xong 1 bài để mở";
        khoaTxt = "Học xong ít nhất 1 bài trong chương rồi quay lại ô luyện tập này nhé";
        if (open) saoO = Math.max(0, starsFor(diemO(o.idDiem)));
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
      return `${saoO >= 0 ? `<div class="pn-arc"${o.idDiem ? ` data-sao-id="${esc(o.idDiem)}"` : ""} title="${esc(dang.nhan)}: ${saoO}/3 sao">${cungSao(p.x, p.y, saoO, OPHU_W / 2 + 26, OPHU_H / 2 + 26)}</div>` : ""}
        <button class="pnode ophu o-${o.loai} ${open ? "open" : "locked"}${pre ? " o-pre" : ""}" data-key="${esc(o.key)}" data-lock="${open ? 0 : 1}" data-khoa="${esc(khoaTxt)}" style="${dat(OPHU_W, OPHU_H)}" title="${esc(mota)}" aria-label="${esc(mota)}">
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
          <div class="pwrap" style="width:${IW}px;height:${H}px">${macs}${nodes}</div>
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
      /* Mở MÀN RIÊNG, không còn mở trang bài rồi cuộn xuống — xem lí do ở đầu
         js/man-rieng.js. */
      if (o.loai === "mophong") { go("moPhong", { id: o.l.id }); return; }
      if (o.loai === "thuchanh") { go("thucHanh", { id: o.l.id }); return; }
      if (o.loai === "tongket") { go("onNhanh", { muc: "chuong", stage: CHANG, ci: o.ci }); return; }
      if (o.loai === "luyen") { batDauLuyenChuong(o.chuong, o.idDiem); return; }
      if (o.loai === "thi") {
        // Gói Miễn phí: thi thử 1 đề. Ô vẫn bấm được để biết mình đang bỏ lỡ gì.
        if (!traGoi && soDeDaThi >= 1) { Plan.upsell("thithu_chang"); return; }
        batDauThiChang(CHANG, nhanChang.ten, o.idDiem);
      }
    };
  });

  /* Vừa quay lại từ màn kết quả của MỘT ô "Luyện tập"/"Thi thử" (đặt ở nút "Quay
     lại bản đồ" trong renderResult) — mở đúng chương chứa ô đó (mặc định có thể
     đang đóng, vì chương mở sẵn là chương có bài ĐANG HỌC, chưa chắc là chương
     vừa ôn), cuộn tới, rồi mới cho sao "bung" ra. Việc này THAY vì cuộn tới bài
     đang học ở dưới — quay lại đúng lúc phải thấy ngay thành quả vừa đạt, không
     phải đi tìm. */
  const vuaXong = vuaXongOPhu;
  vuaXongOPhu = null;
  const arcVuaXong = vuaXong ? app.querySelector(`.pn-arc[data-sao-id="${CSS.escape(vuaXong)}"]`) : null;
  if (arcVuaXong) {
    const the = arcVuaXong.closest(".pchap-accordion-card");
    if (the && !the.classList.contains("is-open")) {
      const hdr = the.querySelector(".pchap-acc-header");
      the.classList.add("is-open");
      the.querySelector(".pchap-acc-body").hidden = false;
      if (hdr) hdr.setAttribute("aria-expanded", "true");
    }
    setTimeout(() => {
      /* Cuộn TỨC THÌ (behavior mặc định), không "smooth": cuộn mượt chạy bằng
         animation frame — tab đứng nền (mở app ở tab khác rồi quay lại) trình
         duyệt ngừng cấp animation frame, cú cuộn coi như không chạy, sao bung ra
         mà học sinh vẫn đang nhìn chỗ cũ. Cuộn tức thì không phụ thuộc animation
         frame nên luôn chắc ăn; đổi lại thì sao TỰ bung ra 380ms sau đã đủ mềm
         cho mắt, không cần thêm cú trượt trang làm gì. */
      const r = arcVuaXong.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, window.scrollY + r.top - window.innerHeight / 2));
      /* Đợi cuộn xong rồi mới bung sao — bung ngay lúc chuyển màn thì học sinh
         chưa kịp nhìn tới, animation coi như phí. */
      setTimeout(() => arcVuaXong.querySelectorAll(".pn-as").forEach((s) => s.classList.add("moi")), 380);
    }, 60);
  } else {
    // Tự cuộn tới bài đang học — hành vi cũ, chỉ chạy khi KHÔNG vừa xong ô phụ
    const curEl = app.querySelector(".pnode.cur");
    if (curEl && doneCount > 0) requestAnimationFrame(() => curEl.scrollIntoView({ block: "center" }));
  }
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

    /* Bề ngang do renderLessons đặt inline (đổi theo khổ màn hình) — ở đây chỉ để
       340px làm giá trị đỡ, phòng khi có chỗ nào dựng .pwrap mà quên đặt. */
    ".pwrap { position: relative; width: 340px; max-width: 100%; margin: 0 auto; }" +

    /* Linh vật trang trí: nằm dưới đường nối, không nhận chuột, không đọc màn hình */
    /* Khung CỐ ĐỊNH, không để ảnh tự quyết chiều cao: bộ ảnh linh vật có tỉ lệ
       khác nhau (đo được 79px tới 153px cùng bề rộng 74px), thả tự do thì không
       tính trước được nó có chạm vào dòng chữ bậc dưới hay không. */
    /* 120×130 (78×84 -> 104×112 -> nay). CHỌN CỠ PHẢI TÍNH CẢ PHÉP XOAY: hiệu ứng
       trôi pmFloat xoay ±2,5°, làm bề ngang THẬT của khung lớn hơn con số CSS —
       đo được 132px ra thành 138px. Chữ dưới ô gần nhất bắt đầu ở x=136 trong khung
       340px, nên 132 đè lên chữ 5px, còn 120 (thật ~126) thì chừa được 7px.
       Đổi cỡ thì phải đổi cả độ lệch dọc ở macs (nửa chiều cao = 65). */
    ".pmascot { position: absolute; width: 120px; height: 130px; z-index: 0; pointer-events: none; user-select: none; filter: drop-shadow(0 8px 16px rgba(0,0,0,.16)); animation: pmFloat 5s ease-in-out infinite; }" +
    ".pmascot img { width: 100%; height: 100%; display: block; object-fit: contain; object-position: bottom; }" +
    "@keyframes pmFloat { 0%,100% { transform: translateY(0) rotate(-2.5deg); } 50% { transform: translateY(-10px) rotate(2.5deg); } }" +

    /* Ô bài học nổi khối — z-index phải CAO HƠN .pn-cap để vòng tròn
       không bao giờ bị dòng chữ vẽ chồng lên (khoảng cách đã đủ, đây là chốt hạ) */
    ".pnode { position: absolute; width: 76px; height: 66px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 3; padding: 0; transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1); outline: none; }" +
    ".pnode-inner-icon svg { width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)); }" +
    ".pnode.done { background: linear-gradient(180deg, #58cc02 0%, #46a302 100%); color: #fff; box-shadow: 0 9px 0 #3b8a02, 0 15px 25px rgba(88, 204, 2, 0.45); border: 3px solid #79e622; }" +
    ".pnode.open { background: linear-gradient(180deg, #ff007f 0%, #d8006c 100%); color: #fff; box-shadow: 0 9px 0 #9e004f, 0 15px 25px rgba(255, 0, 127, 0.45); border: 3px solid #ff66c4; }" +
    ".pnode.locked { background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%); color: #9ca3af; box-shadow: 0 9px 0 #9ca3af; border: 3px solid #f3f4f6; opacity: 0.85; }" +
    "[data-theme='dark'] .pnode.locked { background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); color: #475569; box-shadow: 0 9px 0 #020617; border-color: #334155; }" +
    /* Ô phụ (mô phỏng / thực hành / luyện tập / thi thử): VUÔNG bo góc và to hơn
       ô bài học 8px, để phân biệt được cả khi không nhìn màu — người mù màu vẫn
       thấy đây không phải một bài học. Màu lấy theo từng loại ở O_PHU. */
    ".pnode.ophu { width: 82px; height: 72px; border-radius: 26px; }" +
    ".ophu-ic { display: flex; color: #fff; }" +
    ".ophu-ic svg { width: 34px; height: 34px; stroke-width: 2.2; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)); }" +
    ".pnode.ophu.locked .ophu-ic { color: #9ca3af; }" +
    "[data-theme='dark'] .pnode.ophu.locked .ophu-ic { color: #475569; }" +
    ".pnode.o-mophong.open { background: linear-gradient(180deg, #22d3ee 0%, #0891b2 100%); box-shadow: 0 9px 0 #0e6f8a, 0 15px 25px rgba(8, 145, 178, .42); border: 3px solid #67e8f9; }" +
    ".pnode.o-thuchanh.open { background: linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%); box-shadow: 0 9px 0 #5b21b6, 0 15px 25px rgba(124, 58, 237, .42); border: 3px solid #c4b5fd; }" +
    /* Xanh dương: tách hẳn khỏi lục (luyện tập) đứng ngay cạnh nó, và khỏi lam
       của ô mô phỏng ở xa hơn trong chương. */
    ".pnode.o-tongket.open { background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); box-shadow: 0 9px 0 #075985, 0 15px 25px rgba(2, 132, 199, .42); border: 3px solid #7dd3fc; }" +
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
    
    ".pn-bubble { position: absolute; top: -38px; left: 50%; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #ff9800, #ff5722); color: #fff; font-family: var(--font-display); font-size: 11.5px; font-weight: 900; padding: 5px 14px; border-radius: 16px; white-space: nowrap; z-index: 4; box-shadow: 0 6px 18px rgba(255, 87, 34, 0.5); border: 2px solid #fff; animation: bounceNav 2s infinite; letter-spacing: 0.03em; }" +
    "@keyframes bounceNav { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5px); } }" +
    /* Khối chữ nằm ngang tầm node: translateY(-50%) canh tâm bất kể cao 1 hay 2
       dòng. .tl = chữ ở bên phải node (canh lề trái), .tr = ngược lại. */
    ".pn-cap { position: absolute; width: 190px; text-align: center; pointer-events: none; z-index: 2; line-height: 1.25; }" +
    ".pn-num { display: block; font-size: 12px; font-weight: 900; color: var(--primary); font-family: var(--font-mono); }" +
    /* Nhãn ô phụ là chữ Việt ("Luyện tập", "Mô phỏng"...), không phải số như "Bài 12" —
       xem chú thích tại chỗ gọi capHtml. */
    ".pn-num.pn-chu { font-family: var(--font-sans); letter-spacing: 0; }" +
    ".pn-name { font-size: 12.5px; font-weight: 800; color: var(--text); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; margin-top: 3px; font-family: var(--font-sans); }" +
    ".pn-top { display: flex; align-items: center; justify-content: center; gap: 6px; line-height: 1; margin-bottom: 2px; }" +
    /* Cung ba sao ôm phía trên ô. z-index 2: dưới ô (3) nên bóng đổ của ô vẫn phủ
       lên chân sao đúng thứ tự lớp, nhưng trên khối chữ (.pn-cap cũng 2, sao đứng
       sau trong DOM nên thắng) — mà hai thứ này không chồng nhau nên không sao. */
    ".pn-arc { position: absolute; inset: 0; pointer-events: none; z-index: 2; }" +
    ".pn-arc.mo { opacity: .38; }" +
    /* Sao RỖNG: trắng + viền xám. Trắng trơn chìm trên nền sáng, xám trơn chìm trên
       nền tối; có viền thì đọc được ở cả hai giao diện. */
    ".pn-as { position: absolute; width: 20px; height: 20px; fill: #fff; stroke: #94a3b8; stroke-width: 1.4; " +
      "stroke-linejoin: round; transform: rotate(var(--r)); transition: fill .25s, filter .25s; }" +
    ".pn-as.on { fill: #ffc107; stroke: #d99e06; filter: drop-shadow(0 2px 5px rgba(255, 193, 7, .55)); }" +
    /* Sao "vừa đạt được" — bung ra kèm nảy nhẹ, so le từng sao qua animation-delay
       (đặt ở style inline lúc dựng HTML, xem cungSao). Giữ NGUYÊN góc --r suốt vòng
       chạy, chỉ động scale/opacity — animation không được phép tự khai transform
       riêng mà đè mất góc xoay của sao. */
    "@keyframes saoBung { 0% { transform: rotate(var(--r)) scale(0); opacity: 0; } " +
      "55% { transform: rotate(var(--r)) scale(1.35); opacity: 1; } 100% { transform: rotate(var(--r)) scale(1); opacity: 1; } }" +
    ".pn-as.moi { animation: saoBung .5s cubic-bezier(.34,1.56,.64,1) both; }" +
    "@media (prefers-reduced-motion: reduce) { .pn-as.moi { animation: none; } }" +
    ".pn-stars { display: inline-flex; gap: 3px; }" +
    /* Dấu "đã xem hết mô phỏng" — đứng cùng chỗ với chùm sao trên .pn-top nên phải
       cùng cách canh, không thì dòng nhãn nhảy lên nhảy xuống giữa các ô. */
    ".pn-xem { display: inline-flex; align-items: center; }" +
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
/* THỨ TỰ Ở ĐÂY LÀ TẤT CẢ. Trước đây luật ĐẬM chạy trước luật MÃ, nên nội dung
   bên trong `dấu nháy ngược` vẫn bị luật đậm ăn vào:

       vào:  ta biểu diễn được `2**n` giá trị (từ 0 đến `2**n - 1`)
       ra:   ta biểu diễn được 2n  giá trị (từ 0 đến 2n - 1)

   Toán tử luỹ thừa BIẾN MẤT, và thẻ <strong> mở trong ô <code> này lại đóng ở
   ô <code> kia — trình duyệt tự sắp lại tuỳ ý. Học sinh không biết là hiển thị
   sai, tưởng công thức đúng. Dính đúng ba chuỗi, nhưng một trong số đó là dòng
   dạy chính toán tử `**`.

   Cách chữa: rút KHỐI MÃ rồi tới MÃ TRONG DÒNG ra chỗ gửi tạm trước, chạy luật
   đậm trên phần còn lại, rồi trả chúng về nguyên si. */

/* ---------------------------------------------------------------------------
 *  KHỐI MÃ: XUỐNG DÒNG HAY CUỘN NGANG?
 *
 *  Mặc định XUỐNG DÒNG. Đo trên 16 bài ở màn 375px: 22/38 khối mã và 21/25 ô
 *  "Kết quả" bị tràn ngang, chỗ tràn xa nhất tới 3656px. Mà phần lớn nội dung
 *  tràn lại là CÂU VĂN XUÔI viết trong khung mã — "Kết quả: Từ máy tính bỏ túi
 *  nhỏ gọn đến siêu máy tính, ..." — chứ không phải mã thật. Bắt cuộn ngang một
 *  câu văn thì mỗi lần chỉ đọc được nửa câu, mà thanh cuộn ngang nằm lọt trong
 *  một thẻ đang cuộn dọc lại rất khó bắt trúng trên điện thoại.
 *
 *  NGOẠI LỆ giữ nguyên một dòng: hình vẽ bằng kí tự và bảng căn cột — xuống dòng
 *  là nát hình, lúc đó cuộn ngang mới là đúng.
 * ------------------------------------------------------------------------- */
const MA_VE_HINH = /[│├└┌┐┘┤┬┴┼─━┃╔╗╚╝║═▲▼◄►]/;
function maXuongDong(s) {
  const t = String(s == null ? "" : s);
  if (MA_VE_HINH.test(t)) return false;
  /* Từ HAI dòng trở lên có khoảng trắng BA ô trở lên ở GIỮA dòng = đang căn cột
     thành bảng. Một dòng lẻ thì chưa phải bảng, chỉ là gõ thưa tay.
     Ngưỡng ba ô chứ không phải hai: hai ô còn là lối gõ thoáng bình thường quanh
     dấu gạch ngang ("Ảnh 1  —  CC BY"), mà nhận nhầm kiểu đó là bảng thì cả khối
     văn xuôi bên dưới bị khoá lại, không xuống dòng được. Đo trên C10-27 đúng như
     vậy: khối tràn ngang 289px chỉ vì bốn dòng tiêu đề có hai dấu cách. */
  return t.split("\n").filter((d) => /\S {3,}\S/.test(d)).length < 2;
}
/* Dựng thẻ <pre> cho một đoạn mã, tự quyết định có cho xuống dòng hay không. */
function preCode(code) {
  return `<pre class="q-code${maXuongDong(code) ? " q-code-wrap" : ""}">${esc(code)}</pre>`;
}

function fmtInline(s) {
  const gui = [];
  /* Mốc gửi tạm phải là thứ KHÔNG THỂ có trong nội dung người soạn gõ. Lấy
     khoảng trắng + chữ số làm mốc là hỏng ngay: một câu bình thường như
     "có 5 bạn" cũng khớp mốc rồi bị thay bằng phần tử thứ 5 của mảng.
     U+0000 vừa không gõ được, vừa không bị esc() đụng tới. */
  const MOC = "\u0000";
  const giu = (html) => MOC + (gui.push(html) - 1) + MOC;

  let t = String(s == null ? "" : s);

  /* Khối ``` ``` phải rút TRƯỚC mã trong dòng, nếu không ba dấu huyền bị luật
     một dấu huyền cắn mất cái thứ ba rồi bỏ hai cái đầu làm chữ trần. */
  t = t.replace(/```[a-zA-Z]*\n?([\s\S]*?)```/g, (m, ma) =>
    giu(preCode(ma.replace(/\n$/, ""))));
  t = t.replace(/`([^`\n]+)`/g, (m, ma) => giu('<code class="ic">' + esc(ma) + "</code>"));

  /* Luật ĐẬM giữ nguyên độ chặt cũ (không khoảng trắng ngay trong hai dấu sao)
     và thêm chặn xuống dòng: cụm đậm không được vắt qua nhiều dòng, nếu không
     hai toán tử ** ở hai dòng khác nhau sẽ bắt cặp với nhau. */
  t = esc(t).replace(/\*\*(?!\s)([^*\n]+?)(?<!\s)\*\*/g, "<strong>$1</strong>");

  return t.replace(/\u0000(\d+)\u0000/g, (m, i) => gui[+i]);
}

/* Như trên, thêm giữ xuống dòng — dùng cho câu hỏi và lời giải.
   KHÔNG đụng vào xuống dòng bên trong <pre>: ở đó khoảng trắng đã được giữ
   nguyên, nhét thêm <br> là mỗi dòng hở gấp đôi. */
function fmtQ(s) {
  return fmtInline(s)
    .split(/(<pre class="q-code[^"]*">[\s\S]*?<\/pre>)/)
    .map((phan, i) => (i % 2 ? phan : phan.replace(/\n/g, "<br>")))
    .join("");
}

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
  /* Giữ xuống dòng trong đoạn văn, nhưng KHÔNG đụng vào bên trong <pre> — ở đó
     khoảng trắng đã được giữ nguyên, thêm <br> là mỗi dòng hở gấp đôi. Đo được
     32 bài dính trước khi vá. Đây đúng là việc fmtQ làm, nên gọi thẳng nó. */
  const fi = (s) => fmtQ(s);
  return sections.map((b) => {
    if (b.t === "story") return `<div class="ls-story"><span class="ls-story-icon">${aIco("bulb", "#f59e0b", 18)}</span><div><b>Hình dung nhé:</b> ${fi(b.text)}</div></div>`;
    if (b.t === "text") return `<p class="ls-p">${fi(b.text)}</p>`;
    if (b.t === "h") return `<h3 class="ls-h">${esc(b.text)}</h3>`;
    if (b.t === "code") return preCode(b.code);
    if (b.t === "list") return `${b.text ? `<p class="ls-p">${fi(b.text)}</p>` : ""}<ul class="ls-list">${b.items.map((i) => `<li>${fi(i)}</li>`).join("")}</ul>`;
    if (b.t === "note") return `<div class="ls-note"><b>${aIco("bulb", "#d97706", 15)} Lưu ý:</b> ${fi(b.text)}</div>`;
    /* BẢNG THẬT thay cho bảng vẽ bằng dấu cách. Khác biệt không nằm ở chỗ "căn
       thẳng hơn" mà ở chỗ BỎ HẲN nhu cầu căn thẳng: mỗi ô tự xuống dòng riêng,
       nên bảng 91 cột — trước đây là 2,6 màn hình cuộn ngang ở 360px — chỉ còn
       cao thêm vài dòng. Và ở màn hẹp mỗi hàng xếp lại thành một thẻ có nhãn
       kèm giá trị (xem data-nhan bên dưới), đọc được mà không cuộn ngang.
       CHỈ dùng khi dữ liệu THẬT SỰ là hàng × cột. Những khối cố ý trưng dữ liệu
       thô lộn xộn để dạy làm sạch dữ liệu thì phải giữ nguyên dạng "code". */
    if (b.t === "bang") {
      const dau = (b.head || []).map((h) => `<th>${fi(h)}</th>`).join("");
      const than = (b.rows || []).map((hang) =>
        "<tr>" + hang.map((o, i) =>
          `<td data-nhan="${esc((b.head || [])[i] || "")}">${fi(o)}</td>`).join("") + "</tr>").join("");
      return `<figure class="ls-bang">${b.text ? `<figcaption>${fi(b.text)}</figcaption>` : ""}` +
        `<div class="ls-bang-cuon"><table>${dau ? `<thead><tr>${dau}</tr></thead>` : ""}` +
        `<tbody>${than}</tbody></table></div></figure>`;
    }
    if (b.t === "example") return `<div class="ls-ex"><div class="ls-ex-tag">Ví dụ</div>${b.text ? `<p class="ls-p">${fi(b.text)}</p>` : ""}${b.code ? preCode(b.code) : ""}${b.output != null ? `<div class="ls-out">${aIco("play", "#16a34a", 13)} Kết quả: <b class="${maXuongDong(b.output) ? "ls-out-wrap" : ""}">${esc(b.output)}</b></div>` : ""}</div>`;
    return "";
  }).join("");
}

/* CSS riêng, KHÔNG gộp vào injectPathCss(): hàm đó chỉ chạy khi mở bản đồ lộ trình,
   nên mở thẳng một bài bằng đường dẫn thì cả ba phần sẽ mất hết kiểu dáng.
   Gọi VÔ ĐIỀU KIỆN từ renderLesson. Trước đây hàm này nằm lọt bên trong thanh chip
   và chỉ chạy khi bài có ít nhất một chip — bài nào không có chip nào thì toàn bộ
   khung ba phần hiện ra trần trụi. Lỗi này càng lộ ra khi thanh chip bị rút gọn. */
function injectLsPhaCss() {
  if (document.getElementById("lsPhaCss")) return;
  const s = document.createElement("style");
  s.id = "lsPhaCss";
  s.textContent =
    /* ---- Ba phần của bài học ---- */
    ".ls-pha{border:1.5px solid var(--border);border-radius:var(--radius);background:var(--bg-card);" +
      "margin:0 0 14px;overflow:hidden}" +
    ".ls-pha-d{display:flex;align-items:center;gap:12px;width:100%;text-align:left;cursor:pointer;" +
      "border:0;background:var(--bg-soft);color:var(--text);padding:12px 15px;font:inherit}" +
    ".ls-pha-d:hover{background:var(--primary-soft)}" +
    ".ls-pha-so{flex:none;width:26px;height:26px;border-radius:50%;background:var(--primary);color:#fff;" +
      "display:flex;align-items:center;justify-content:center;font:900 13px var(--font-mono)}" +
    ".ls-pha-ten{flex:1;min-width:0;font:800 15px var(--font-display);display:flex;align-items:center;gap:6px;flex-wrap:wrap}" +
    ".ls-pha-ten small{flex-basis:100%;font:600 12px var(--font-sans);color:var(--text-soft)}" +
    ".ls-pha-chev{flex:none;color:var(--text-soft);display:inline-flex;transition:transform .2s}" +
    ".ls-pha.dong .ls-pha-chev{transform:rotate(-90deg)}" +
    ".ls-pha-than{padding:15px 16px}" +
    ".ls-pha.dong .ls-pha-than{display:none}" +
    ".lesson-mo .ls-story{margin-top:0}" +
    /* ---- Nhóm nhỏ trong phần lý thuyết ---- */
    ".ls-nhom-thanh{display:flex;justify-content:flex-end;margin:0 0 8px}" +
    ".ls-nhom-tat{border:1px solid var(--border);background:var(--bg-card);color:var(--text-soft);" +
      "border-radius:9px;padding:6px 12px;font:700 12px var(--font-sans);cursor:pointer;min-height:34px}" +
    ".ls-nhom-tat:hover{border-color:var(--primary);color:var(--primary)}" +
    ".ls-nhom{border-top:1px solid var(--border);margin-top:4px}" +
    ".ls-nhom:first-of-type{border-top:0;margin-top:0}" +
    ".ls-nhom-d{display:flex;align-items:center;gap:10px;width:100%;text-align:left;cursor:pointer;" +
      "border:0;background:none;color:var(--text);padding:11px 0;font:inherit}" +
    ".ls-nhom-ten{flex:1;min-width:0;font:800 16px var(--font-display);line-height:1.35}" +
    ".ls-nhom-chev{flex:none;color:var(--text-soft);display:inline-flex;transition:transform .2s}" +
    ".ls-nhom.dong .ls-nhom-chev{transform:rotate(-90deg)}" +
    ".ls-nhom.dong .ls-nhom-than{display:none}" +
    /* Tiêu đề phụ giờ nằm trên nút thu/mở nên .ls-h trong nhóm là thừa */
    ".ls-nhom-than>.ls-h:first-child{margin-top:0}" +
    /* ---- Thanh tiến độ đọc ---- */
    ".ls-tien{position:fixed;left:0;right:0;height:3px;background:transparent;z-index:49;pointer-events:none}" +
    ".ls-tien i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--primary),var(--info));" +
      "transition:width .08s linear}" +
    "@media (prefers-reduced-motion: reduce){.ls-tien i,.ls-pha-chev,.ls-nhom-chev{transition:none}}";
  (document.head || document.documentElement).appendChild(s);
}

/* Lối vào các MÀN RIÊNG của bài (Mô phỏng, Thực hành): hai màn có địa chỉ riêng
   và tiến độ riêng nên không nằm trong trang bài, phải có nút mở.
   ĐẶT Ở CUỐI BÀI, cùng hàng với "Đánh dấu đã học" — không phải thanh chip dưới
   câu dẫn như trước. Nằm trên đầu thì nó mời người học rời bài NGAY KHI vừa mở,
   mà đi rồi quay lại là mất chỗ đang đọc (vào bằng đường dẫn khác nên trang bài
   dựng lại từ đầu). Mô phỏng và thực hành chỉ có nghĩa sau khi đã đọc xong, nên
   chỗ của chúng là hàng lựa chọn cuối bài.
   Đã bỏ hẳn các chip "cuộn nhanh xuống Sơ đồ / Sai ở đâu / Từ vựng": ba khối đó
   nằm ngay trong bài, cuộn tới trong vài giây; ở chế độ Thẻ chúng còn sai hẳn vì
   khối đích nằm trong một thẻ chưa mở. */
function lsManKhac(l) {
  const co = (f) => { try { return !!f(); } catch (e) { return false; } };
  const ds = [];
  if (co(() => window.MinhHoa && MinhHoa.coBai().indexOf(l.id) >= 0)) {
    ds.push({ ic: "bulb", ten: "Mô phỏng", di: () => go("moPhong", { id: l.id }) });
  }
  const x = co(() => window.ManRieng) ? ManRieng.xuongCuaBai(l.id) : null;
  if (x) ds.push({ ic: x.icon, ten: "Thực hành", di: () => go("thucHanh", { id: l.id }) });
  LS_MAN = ds;
  return ds.map((c, i) =>
    `<button class="btn btn-ghost ls-man-b" data-m="${i}">${aIco(c.ic, null, 16)} ${esc(c.ten)}</button>`
  ).join("");
}
let LS_MAN = [];

/* ---------------------------------------------------------------------------
 *  CHẾ ĐỘ ĐỌC BÀI — cấu hình trong menu tài khoản, không phải nút rời trong bài
 *
 *  "auto" : điện thoại đọc theo Thẻ, máy tính cuộn dài (mặc định, hợp cả hai bên)
 *  "the"  : luôn chia thẻ
 *  "cuon" : luôn cuộn dài
 *
 *  Trước đây có một nút bật/tắt nằm ngay trong trang bài: mỗi bài lại phải bấm
 *  lại vì nó không nhớ gì, và nó chiếm một dòng ở đầu MỌI bài chỉ để phục vụ một
 *  lựa chọn mà người học chọn một lần rồi thôi. Đó đúng là thứ thuộc về Cài đặt.
 * ------------------------------------------------------------------------- */
const DOC_BAI = ["auto", "the", "cuon"];
function docBaiCauHinh() {
  const v = (State.settings && State.settings.docBai) || "auto";
  return DOC_BAI.includes(v) ? v : "auto";
}
function datDocBai(v) {
  if (!DOC_BAI.includes(v)) return;
  State.settings.docBai = v;
  save("settings", State.settings);
  capNhatNutDocBai();
  // Đang đọc dở một bài thì vẽ lại NGAY để thấy kết quả, khỏi phải thoát ra vào lại.
  if (State.view === "lesson" && LESSON_DANG_MO) go("lesson", { id: LESSON_DANG_MO.id });
}
function dungCheDoThe() {
  const v = docBaiCauHinh();
  return v === "the" || (v === "auto" && window.innerWidth <= 768);
}
const DOC_BAI_GIAI_THICH = {
  auto: "Máy tính cuộn dài, điện thoại chia thẻ.",
  the: "Mỗi phần của bài là một thẻ, đọc xong bấm Thẻ tiếp.",
  cuon: "Cả bài trên một trang, cuộn từ đầu đến cuối.",
};
function capNhatNutDocBai() {
  const seg = document.getElementById("umDocBai");
  if (!seg) return;
  const v = docBaiCauHinh();
  seg.querySelectorAll("button[data-doc]").forEach((b) => {
    b.setAttribute("aria-checked", b.dataset.doc === v ? "true" : "false");
  });
  const hint = document.getElementById("umDocBaiHint");
  if (hint) hint.textContent = DOC_BAI_GIAI_THICH[v] || "";
}

/* ---------------------------------------------------------------------------
 *  KHOÁ NÚT "ĐÁNH DẤU ĐÃ HỌC" CHO ĐẾN KHI ĐỌC HẾT BÀI
 *
 *  Nút này cộng XP, mở bài kế trong lộ trình tuần tự và tính vào nhiệm vụ tuần —
 *  mà trước đây bấm được ngay từ dòng đầu tiên, nên "đã học 119 bài" chẳng bảo
 *  đảm điều gì. Mở khoá khi người học THẬT SỰ đi hết bài:
 *    - chế độ Thẻ  : xem tới thẻ cuối;
 *    - chế độ cuộn : cuộn tới cuối trang (thanhTienDoDoc gọi sang).
 *  Bài ĐÃ học rồi thì không khoá: lúc đó nút mang nghĩa "bấm để bỏ đánh dấu",
 *  khoá lại là nhốt người học vào một dấu tích không gỡ được.
 * ------------------------------------------------------------------------- */
let nutDoneMo = null;      // hàm mở khoá của bài đang mở (null = không còn khoá)
let doneTheoCuon = false;  // true = mở khoá bằng cách cuộn hết trang

function khoaNutDone(l) {
  nutDoneMo = null;
  doneTheoCuon = false;
  const btn = document.getElementById("doneBtn");
  if (!btn || isLearned(l.id)) return;
  btn.disabled = true;
  btn.classList.add("btn-cho");
  btn.innerHTML = `${aIco("lock", null, 15)} Đọc hết bài rồi đánh dấu`;
  btn.title = "Đi hết bài học rồi mới đánh dấu được";
  nutDoneMo = (bao) => {
    nutDoneMo = null;
    if (!btn.isConnected) return;
    btn.disabled = false;
    btn.classList.remove("btn-cho");
    btn.innerHTML = `${aIco("check2", null, 15)} Đánh dấu đã học`;
    btn.title = "";
    /* Báo một tiếng: nút vừa đổi trạng thái lại nằm cuối trang, không nói thì
       người học đang ở giữa bài không biết là đã mở.
       KHÔNG báo khi mở khoá ngay lúc dựng trang (bài ngắn hơn màn hình, không có
       cú cuộn nào để chờ) — vừa vào bài đã bị mắng "đã đọc hết bài" thì vô lý. */
    if (bao) toast("Đã đọc hết bài — giờ đánh dấu đã học được rồi");
  };
}
function moKhoaNutDone(bao) { if (nutDoneMo) nutDoneMo(bao); }

/* ---------------------------------------------------------------------------
 *  BA PHẦN CỦA MỘT BÀI HỌC
 *
 *  Đo được: một bài dài 6–7,6 màn điện thoại (4874–6152px), trong đó riêng lý
 *  thuyết chiếm ~55%. Cuộn liên tục không có mốc nào nên không biết còn bao xa,
 *  cũng không biết chỗ nào bỏ qua được — đó mới là bệnh, chứ không phải "nhiều
 *  nội dung quá".
 *
 *  Chia làm ba phần theo đúng trình tự dạy học, và cả ba đều lắp từ dữ liệu ĐÃ CÓ,
 *  không phải viết thêm nội dung nào:
 *    1. Đặt vấn đề  — khối "story" (đo được: 119/119 bài có, và LUÔN đứng đầu) và
 *                     sơ đồ của bài;
 *    2. Nội dung chính — phần lý thuyết còn lại, cắt theo tiêu đề phụ `h`
 *                     (115/119 bài có từ 2 tiêu đề trở lên), cộng khối Cần nhớ;
 *    3. Củng cố     — chạy thử code, Sai ở đâu, Ôn tập tương tác, Từ vựng.
 *
 *  PHẦN 3 THU SẴN, hai phần đầu mở. Đây là chỗ làm trang dài nhất sau lý thuyết,
 *  mà cũng là phần người học chỉ tới sau khi đọc xong — thu lại là ngắn thật, còn
 *  tiêu đề vẫn nói rõ bên trong có gì nên không phải "giấu".
 * ------------------------------------------------------------------------- */
/* data-ten/data-icon để chế độ Thẻ lấy lại tên phần mà không phải mò trong chuỗi
   của .ls-pha-ten (chuỗi đó dính cả icon lẫn dòng phụ trong <small>). */
function phaMo(so, ten, icon, phu, mo) {
  return `<section class="ls-pha${mo ? "" : " dong"}" data-pha="${so}" data-ten="${esc(ten)}" data-icon="${esc(icon)}">
    <button class="ls-pha-d" type="button" aria-expanded="${mo ? "true" : "false"}">
      <span class="ls-pha-so">${so}</span>
      <span class="ls-pha-ten">${aIco(icon, null, 16)} ${esc(ten)}<small>${esc(phu)}</small></span>
      <span class="ls-pha-chev">${aIco("chevdown", null, 18)}</span>
    </button>
    <div class="ls-pha-than">`;
}
function phaDong() { return "</div></section>"; }

/* Cắt phần lý thuyết thành các nhóm theo tiêu đề phụ. Khối nào đứng TRƯỚC tiêu đề
   đầu tiên thì gom vào một nhóm không tên, để không mất nội dung. */
function nhomLyThuyet(sections) {
  const nhom = [];
  (sections || []).forEach((b) => {
    if (b.t === "h" || !nhom.length) nhom.push({ ten: b.t === "h" ? b.text : "", khoi: [] });
    if (b.t !== "h") nhom[nhom.length - 1].khoi.push(b);
  });
  return nhom.filter((n) => n.ten || n.khoi.length);
}
/* Mỗi nhóm là một khối thu/mở được, MẶC ĐỊNH MỞ: người học lần đầu phải đọc được
   ngay, không phải bấm bốn lần. Thu lại là để người ôn lại gấp lượt hai — nút "Thu
   gọn tất cả" ở đầu phần 2 biến cả bài thành một mục lục trong một cú bấm. */
function veThan(sections) {
  const nhom = nhomLyThuyet(sections);
  if (nhom.length < 2) return renderBlocks(sections);
  return `<div class="ls-nhom-thanh">
      <button class="ls-nhom-tat" type="button" id="thuTatCa">${aIco("layers", null, 14)} Thu gọn tất cả</button>
    </div>` + nhom.map((n, i) => n.ten
    ? `<section class="ls-nhom" data-nhom="${i}">
         <button class="ls-nhom-d" type="button" aria-expanded="true">
           <span class="ls-nhom-ten">${esc(n.ten)}</span>
           <span class="ls-nhom-chev">${aIco("chevdown", null, 16)}</span>
         </button>
         <div class="ls-nhom-than">${renderBlocks(n.khoi)}</div>
       </section>`
    : renderBlocks(n.khoi)).join("");
}

/* Đưa các khối do tệp khác chèn về đúng phần của nó. Khối cha = tổ tiên gần nhất
   mà cha của nó chính là #app — các injector đều bọc nội dung trong MỘT div rồi
   chèn div đó vào #app, nên đi ngược lên tới đó là lấy trọn khối. */
/* Nhớ người học thích mở hay thu từng PHẦN — theo loại phần, không theo từng bài:
   ai quen thu phần Củng cố thì bài nào cũng muốn vậy, còn nhớ riêng 119 bài thì kho
   phình ra mà chẳng ai được lợi. */
function ganThuMo() {
  const app = document.getElementById("app");
  const nho = load("phaMo", {});
  app.querySelectorAll(".ls-pha").forEach((pha) => {
    const so = pha.dataset.pha;
    if (so in nho) pha.classList.toggle("dong", !nho[so]);
    const nut = pha.querySelector(".ls-pha-d");
    nut.setAttribute("aria-expanded", pha.classList.contains("dong") ? "false" : "true");
    nut.onclick = () => {
      const mo = pha.classList.toggle("dong") === false;
      nut.setAttribute("aria-expanded", mo ? "true" : "false");
      const m = load("phaMo", {}); m[so] = mo; save("phaMo", m);
    };
  });
  /* Nhóm nhỏ trong lý thuyết KHÔNG nhớ trạng thái: chúng là chỗ đọc chính, mở sẵn
     luôn đúng cho lần đầu; thu lại chỉ là thao tác nhất thời lúc ôn. */
  app.querySelectorAll(".ls-nhom").forEach((n) => {
    const nut = n.querySelector(".ls-nhom-d");
    nut.onclick = () => {
      const mo = n.classList.toggle("dong") === false;
      nut.setAttribute("aria-expanded", mo ? "true" : "false");
    };
  });
  const tat = document.getElementById("thuTatCa");
  if (tat) {
    tat.onclick = () => {
      const ds = app.querySelectorAll(".ls-nhom");
      /* Còn nhóm nào đang mở thì THU HẾT; đã thu hết rồi thì mở lại — một nút làm
         hai chiều, khỏi phải đoán nó đang ở trạng thái nào. */
      const conMo = [].some.call(ds, (n) => !n.classList.contains("dong"));
      ds.forEach((n) => {
        n.classList.toggle("dong", conMo);
        n.querySelector(".ls-nhom-d").setAttribute("aria-expanded", conMo ? "false" : "true");
      });
      tat.innerHTML = (conMo ? aIco("chevdown", null, 14) + " Mở lại tất cả"
                             : aIco("layers", null, 14) + " Thu gọn tất cả");
    };
  }
}

/* Thanh tiến độ đọc, bám ngay dưới thanh trên cùng. Đo theo phần ĐÃ CUỘN QUA trên
   tổng chiều cao cuộn được — không đo theo số phần đã mở, vì phần dài ngắn rất khác
   nhau nên "xong 2/3 phần" không nói lên còn bao nhiêu chữ phải đọc. */
let goThanhTien = null;

function thanhTienDoDoc() {
  /* Gỡ hẳn lượt trước. Chuyển bài -> bài thì hash vẫn là #/lesson/... nên
     doiMan() không kích hoạt; không dọn ở đây thì mỗi lần chuyển bài lại bỏ lại
     một cặp bộ nghe trỏ vào cái thanh đã bị xoá. */
  if (goThanhTien) goThanhTien();
  document.querySelectorAll(".ls-tien").forEach((e) => e.remove());
  const bar = document.createElement("div");
  bar.className = "ls-tien";
  bar.innerHTML = "<i></i>";
  const top = document.querySelector(".topbar");
  bar.style.top = (top ? Math.round(top.getBoundingClientRect().height) : 0) + "px";
  document.body.appendChild(bar);
  const thanh = bar.firstElementChild;
  const capNhat = (bao) => {
    if (!bar.isConnected) return;
    /* Trang ngắn hơn màn hình thì không có gì để đo — để 0 chứ đừng chia cho 0. */
    const con = document.documentElement.scrollHeight - window.innerHeight;
    thanh.style.width = con > 40 ? Math.min(100, (window.scrollY / con) * 100).toFixed(1) + "%" : "0%";
    /* Cuộn tới cuối = đã đi hết bài -> mở nút "Đánh dấu đã học". Ở chế độ Thẻ thì
       KHÔNG tính theo cuộn (trang chỉ dài bằng một thẻ, cuộn hết vẫn còn mấy thẻ
       chưa xem) — thẻ tự mở khoá khi tới thẻ cuối.
       Trang ngắn hơn màn hình thì mở luôn: không có cú cuộn nào để chờ. */
    if (doneTheoCuon && nutDoneMo &&
        (con <= 40 || window.scrollY >= con - 120)) moKhoaNutDone(bao);
  };
  const khiCuon = () => capNhat(true);
  window.addEventListener("scroll", khiCuon, { passive: true });
  window.addEventListener("resize", khiCuon);
  /* Gỡ thanh khi RỜI trang bài. Phải nghe hashchange chứ KHÔNG dựa vào sự kiện
     cuộn: bản trước dọn dẹp ngay trong hàm xử lí cuộn, nên màn nào ngắn hơn màn
     hình (trang chủ, kết quả) thì chẳng có cú cuộn nào xảy ra và thanh nằm lại
     mãi ở đó. Đã đo thấy đúng như vậy. */
  const go = () => {
    window.removeEventListener("scroll", khiCuon);
    window.removeEventListener("resize", khiCuon);
    window.removeEventListener("hashchange", doiMan);
    if (goThanhTien === go) goThanhTien = null;
    bar.remove();
  };
  const doiMan = () => {
    if (String(location.hash || "").indexOf("#/lesson/") === 0) return;
    go();
  };
  goThanhTien = go;
  window.addEventListener("hashchange", doiMan);
  /* Đo lần đầu Ở NHỊP SAU, không đo ngay tại đây. Hàm này chạy giữa lúc
     renderLesson đang dựng, mà lệnh cuộn của router (window.scrollTo về đầu
     trang, hoặc về chỗ đọc dở đã nhớ) đứng SAU đó — đo ngay bây giờ thì
     window.scrollY vẫn là chỗ đứng ở BÀI TRƯỚC. Đã đo thấy đúng như vậy: đọc hết
     bài 1 rồi bấm "Bài tiếp theo", bài 2 vừa hiện ra là nút "Đánh dấu đã học" đã
     tự mở, đúng cái lỗ hổng mà khoá này sinh ra để bịt.
     Lần đo đầu KHÔNG báo toast — người học vừa mở bài chứ chưa đọc gì.
     Dùng setTimeout chứ không requestAnimationFrame: rAF không chạy khi thẻ đang
     ở nền (trình duyệt ngừng dựng khung hình), nên mở bài trong thẻ nền rồi quay
     lại là thanh tiến độ trống trơn cho tới cú cuộn đầu tiên. */
  setTimeout(() => capNhat(false), 0);
}

function donVaoPha(l) {
  const app = document.getElementById("app");
  const pha1 = app.querySelector('[data-pha="1"] .ls-pha-than');
  const pha3 = app.querySelector("#phaCungCo");
  if (!pha1 || !pha3) return;
  /* Đi ngược lên tới khối bọc ngoài cùng, NHƯNG DỪNG ở ranh giới một phần.
     Không dừng thì hỏng nặng: sơ đồ được chèn cạnh .lesson-body, mà .lesson-body
     nay nằm trong phần 2 — đi thẳng lên tới #app sẽ trả về chính SECTION phần 2,
     và lệnh "chuyển sơ đồ sang phần 1" biến thành "nhét cả phần 2 vào phần 1".
     Đã đo thấy đúng như vậy: trang phình từ 6152px lên 14302px. */
  const ranh = (e) => e.classList.contains("ls-pha-than") || e.id === "phaCungCo" || e === app;
  const khoiCha = (el) => {
    let e = el;
    while (e && e.parentElement && !ranh(e.parentElement)) e = e.parentElement;
    return e && e.parentElement && ranh(e.parentElement) ? e : null;
  };
  const chuyen = (sel, dich) => {
    const el = app.querySelector(sel);
    const k = el && khoiCha(el);
    if (k) dich.appendChild(k);
  };
  chuyen(".sd", pha1);                     // sơ đồ thuộc phần Đặt vấn đề
  [".sod", ".clab-host", ".voc-box"].forEach((sel) => chuyen(sel, pha3));
  /* Phần Củng cố mà rỗng thì ẩn hẳn, đừng để một tiêu đề bấm vào không có gì. */
  const p3 = app.querySelector('[data-pha="3"]');
  if (p3 && !p3.querySelector(".ls-pha-than").textContent.trim() &&
      !p3.querySelector("#lessonPg, .sod, .clab-host, .voc-box, .glab")) p3.hidden = true;
}

function renderLesson(data) {
  const sorted = LESSONS.slice().sort((a, b) => a.stage - b.stage || a.order - b.order);
  const idx = sorted.findIndex((l) => l.id === data.id);
  const l = sorted[idx];
  if (!l) { go("lessons"); return; }
  LESSON_DANG_MO = l; // để robot trợ lý mở gia sư đúng bài này
  const done = isLearned(l.id);
  const prev = sorted[idx - 1], next = sorted[idx + 1];
  /* "story" luôn là khối mở đầu (đã đo: 119/119 bài) nên tách nó ra làm phần Đặt
     vấn đề. Vẫn cắt theo ĐIỀU KIỆN chứ không cắt cứng sections[0]: bài nào sau này
     viết khác thì phần 1 rỗng chứ không lấy nhầm khối lý thuyết. */
  const mo = (l.sections || []).filter((b, i) => b.t === "story" && i < 2);
  const than = (l.sections || []).filter((b) => mo.indexOf(b) < 0);
  const runCode = firstRunnableCode(l);
  const webCode = (!runCode && lessonHasWeb(l)) ? WEB_STARTER : null;
  injectLsPhaCss();

  app.innerHTML = `
    <button class="back-link" id="back">${aIco("aleft", null, 15)} Danh sách bài học</button>
    <div class="quiz-meta" style="margin-bottom:10px">
      <span class="pill type-mc">Bài ${idx + 1}/${sorted.length}</span>
      <span class="pill">Lớp ${l.grade}</span>
      <span class="pill">~${l.minutes} phút</span>
    </div>
    <h2 style="margin-bottom:8px">${esc(l.title)}</h2>
    <p style="color:var(--text-soft);font-size:15px;margin-bottom:18px">${fmtInline(l.intro)}</p>

    ${phaMo("1", "Đặt vấn đề", "bulb", "Vì sao cần học bài này", true)}
      <div class="lesson-mo">${renderBlocks(mo)}</div>
    ${phaDong()}

    ${phaMo("2", "Nội dung chính", "book", nhomLyThuyet(than).length + " phần", true)}
      <div class="lesson-body">${veThan(than)}</div>
      <div class="ls-keypoints">
        <b>${aIco("bookmark", "#dc2626", 16)} Cần nhớ</b>
        <ul>${l.keypoints.map((k) => `<li>${fmtInline(k)}</li>`).join("")}</ul>
      </div>
    ${phaDong()}

    ${phaMo("3", "Củng cố", "target", "Làm thử để biết mình đã hiểu chưa", false)}
      ${runCode ? `
      <div class="section-title">${aIco("monitor", "#0891b2", 17)} Thực hành ngay</div>
      <p style="color:var(--text-soft);font-size:13.5px;margin-bottom:10px">Đây là ví dụ của bài — sửa lại tùy ý rồi bấm ${aIco("play", "#16a34a", 13)} Chạy để xem kết quả thay đổi thế nào.</p>
      <div id="lessonPg"></div>` : webCode ? `
      <div class="section-title">${aIco("globe", "#0891b2", 17)} Thử làm trang web</div>
      <p style="color:var(--text-soft);font-size:13.5px;margin-bottom:10px">Sửa HTML/CSS bên dưới rồi bấm ${aIco("play", "#16a34a", 13)} Xem kết quả — trang web sẽ hiện ra ngay.</p>
      <div id="lessonPg"></div>` : ""}
      <div id="phaCungCo"></div>
    ${phaDong()}

    <div class="ls-actions">
      <button class="btn ${done ? "btn-ghost" : "btn-success"}" id="doneBtn">${aIco("check2", null, 15)} ${done ? "Đã học (bấm để bỏ)" : "Đánh dấu đã học"}</button>
      <button class="btn btn-primary" id="practiceBtn">${aIco("target", null, 16)} Luyện tập bài này</button>
      ${lsManKhac(l)}
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
  /* Sang bài khác thì LUÔN mở ở đầu trang. Bộ nhớ chỗ cuộn (scrollNho) có ích khi
     quay LẠI một màn đã ghé — nhưng bấm "Bài tiếp theo" là đi TỚI, mà nếu bài đó
     từng đọc dở thì router lại thả người học xuống lưng trang, trông như app cuộn
     bừa. Quên chỗ đã nhớ của bài đích trước khi chuyển. */
  const sangBai = (id) => { scrollNho.delete("#/lesson/" + encodeURIComponent(id)); go("lesson", { id: id }); };
  document.getElementById("prevBtn").onclick = () => prev && sangBai(prev.id);
  document.getElementById("nextBtn").onclick = () => next && sangBai(next.id);
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

  /* Các khối do tệp khác chèn (sơ đồ, Sai ở đâu, Ôn tập tương tác, Từ vựng) đều
     tự tìm .lesson-body hoặc .ls-actions rồi chèn cạnh đó, nên chúng rơi ra NGOÀI
     ba phần. Dồn lại sau khi mọi thứ đã dựng — cách này không phải sửa bốn tệp
     injector, và nếu tệp nào đổi chỗ chèn thì cùng lắm khối đó nằm ngoài phần chứ
     không mất. */
  donVaoPha(l);
  ganThuMo();

  app.querySelectorAll(".ls-man-b").forEach((b) => {
    const c = LS_MAN[+b.dataset.m];
    if (c) b.onclick = c.di;
  });
  const sgkT = document.getElementById("sgkToggle");
  if (sgkT) sgkT.onclick = () => {
    const p = document.getElementById("sgkPages");
    p.hidden = !p.hidden;
    sgkT.querySelector(".sgk-chev").innerHTML = aIco(p.hidden ? "play" : "chevdown", null, 14);
  };

  /* Khoá TRƯỚC khi dựng thẻ: bài chỉ có một phần thì dungTheBai() bỏ qua, lúc đó
     rơi về mở khoá theo cuộn. */
  khoaNutDone(l);
  doneTheoCuon = !(dungCheDoThe() && dungTheBai(app, l));
  /* Dựng thanh tiến độ đọc SAU CÙNG: lần cập nhật đầu tiên của nó cũng là lần
     kiểm tra "đã cuộn hết chưa" — phải đo trên trang đã dựng xong, không thì bài
     ngắn vẫn bị khoá nút cho tới khi người học vẩy chuột một cái. */
  thanhTienDoDoc();
}

/* ---------------------------------------------------------------------------
 *  CHẾ ĐỘ THẺ — mỗi phần của bài là một thẻ, đi tới bằng nút Thẻ tiếp
 *
 *  Bản trước NHÂN BẢN (cloneNode) ba phần vào thẻ. Bản sao của một nút DOM không
 *  mang theo bộ nghe sự kiện nào, nên trong thẻ thì nút Chạy, ô soạn code, "Sai ở
 *  đâu?", từ vựng, thu/mở từng mục... bấm đều không ăn — đúng thứ người học cần
 *  dùng nhất lại là thứ chết trước. Bản sao còn trùng id với bản gốc
 *  (#lessonPg, #thuTatCa), mà bản gốc chỉ bị display:none chứ vẫn nằm trong DOM,
 *  nên getElementById trả về bản đang bị ẩn.
 *  Nay CHUYỂN THẲNG phần thật vào thẻ: di chuyển một nút DOM giữ nguyên mọi bộ
 *  nghe đã gắn, không sinh bản sao nào, và trang chỉ còn một bản duy nhất của
 *  mỗi khối.
 *
 *  CẮT NHỎ TỚI TỪNG KHỐI, KHÔNG PHẢI TỪNG PHẦN. Ba phần là quá thô: đo trên 8 bài
 *  thì phần "Nội dung chính" ra 4,8–10,8 màn điện thoại một thẻ — cuộn mãi trong
 *  một thẻ thì đúng bằng cuộn cả bài, chế độ Thẻ chẳng giải quyết được gì. Nay cắt
 *  ở RANH GIỚI KHỐI có sẵn trong bài (mỗi mục lý thuyết, Cần nhớ, ô chạy thử, Sai ở
 *  đâu, Từ vựng...) rồi dồn các khối liền nhau vào một thẻ cho tới khi chạm ngưỡng
 *  ~1,4 màn hình. Không bao giờ cắt ĐÔI một khối: nửa cái bảng hay nửa đoạn mã thì
 *  vô nghĩa, nên khối nào tự nó đã cao hơn ngưỡng vẫn được để nguyên một thẻ.
 *
 *  Trả về true nếu cắt được từ 2 thẻ trở lên.
 * ------------------------------------------------------------------------- */

/* Hai khối này là HỘP ĐỰNG, không phải một mạch đọc: bên trong là nhiều mạch xếp
   chồng nên trải phẳng ra để cắt được. Khối khác giữ nguyên. */
const THE_HOP = ".lesson-body, #phaCungCo";

/* Đang đọc tới thẻ nào của từng bài. CHỈ nhớ trong phiên, không lưu xuống máy:
   quay lại bài sau vài hôm là một lượt đọc mới, thả thẳng vào giữa bài mới là lạ. */
const theDangDoc = new Map();

/* Tên thẻ tra theo khối "nặng" đầu tiên nằm trong nó. Cụ thể đứng trước, chung
   đứng sau; không khớp cái nào thì lấy tên của phần. */
const THE_TEN = [
  [".ls-keypoints", "Cần nhớ"],
  ["#lessonPg", "Thực hành ngay"],
  [".sd", "Sơ đồ của bài"],
  [".sod-host, .sod", "Sai ở đâu?"],
  [".clab-host", "Ôn tập tương tác"],
  [".voc-box", "Từ vựng"],
  [".ex-host", "Bài tập"],
  [".glab", "Xưởng đồ hoạ"],
];

/* Tiêu đề sẵn có của một khối, nếu khối đó tự mang một cái. Chỉ đi theo con ĐẦU
   TIÊN và tối đa ba tầng: tiêu đề của khối luôn nằm ngay đầu khối, còn quét bừa
   bằng querySelector("h4") thì vớ phải một tiêu đề nào đó lọt giữa nội dung. */
function dauKhoi(k) {
  let e = k;
  for (let i = 0; i < 3 && e; i++) {
    if (e.classList.contains("ls-nhom-ten") || e.classList.contains("section-title")) return e;
    if (/^H[1-4]$/.test(e.tagName)) return e;
    /* Khối "Cần nhớ" mở đầu bằng <b> chứ không phải thẻ tiêu đề — vẫn là tên của
       khối, vẫn nên lên đầu thẻ thay vì hiện lại lần nữa ngay bên dưới. */
    if (e.tagName === "B" && e.parentElement && e.parentElement.classList.contains("ls-keypoints")) return e;
    e = e.firstElementChild;
  }
  return null;
}

/* Đặt tên cho một thẻ. CÓ TÁC DỤNG PHỤ có chủ ý: tên lấy từ tiêu đề nào thì ẩn
   luôn tiêu đề đó đi — để nguyên thì cùng một dòng chữ hiện hai lần, cách nhau
   đúng một đường kẻ. */
function tenThe(khoi, phaTen) {
  for (const k of khoi) {
    const d = dauKhoi(k);
    const ten = d ? d.textContent.trim() : "";
    if (ten) {
      /* Mục lý thuyết: ẩn cả HÀNG tiêu đề (nút thu/mở kèm mũi tên), không chỉ
         mỗi chữ — bỏ lại cái nút rỗng thì thành một vệt bấm được mà không làm gì. */
      if (d.classList.contains("ls-nhom-ten")) k.classList.add("the-an-dau");
      else d.classList.add("the-dau-an");
      return ten;
    }
    for (const [sel, t] of THE_TEN) {
      if (k.matches(sel) || k.querySelector(sel)) return t;
    }
  }
  return phaTen;
}

function dungTheBai(app, l) {
  /* Phần Củng cố rỗng đã bị donVaoPha() ẩn đi — đừng dựng một thẻ trắng cho nó. */
  const phas = Array.from(app.querySelectorAll(".ls-pha")).filter((p) => !p.hidden);
  if (!phas.length) return false;

  /* Mở hết TRƯỚC KHI ĐO. ganThuMo() có thể đã thu phần Củng cố theo thói quen đã
     lưu, mà khối đang bị thu thì offsetHeight bằng 0 — đo lúc đó sẽ dồn cả phần
     vào chung một thẻ vì tưởng nó chẳng cao gì cả. */
  phas.forEach((p) => p.classList.remove("dong"));

  /* Ngưỡng một thẻ: 1,4 màn hình. Đúng bằng một mạch giải thích trọn vẹn mà cuộn
     thêm non nửa màn là hết thẻ. Sàn 560px để màn hình thấp (điện thoại nằm
     ngang) không bị băm ra hàng chục thẻ vụn. */
  const nguong = Math.max(560, Math.round(window.innerHeight * 1.4));
  const dsThe = [];
  phas.forEach((pha) => {
    const than = pha.querySelector(".ls-pha-than");
    if (!than) return;
    const so = pha.dataset.pha || "";
    const phaTen = pha.dataset.ten || "";
    const manh = [];
    const themKhoi = (c) => {
      /* Một mục lý thuyết mà TỰ NÓ đã cao hơn ngưỡng thì cắt tiếp ở ranh giới các
         khối con của nó (đoạn văn, ví dụ, bảng, danh sách, khung lưu ý). Vẫn là
         ranh giới có sẵn trong bài, vẫn không khối nào bị cắt đôi. Đo được: mục
         "Lệnh print()" của C10-11 dài 3,9 màn — cắt ra thành hai, ba thẻ đọc thở
         được, mà mạch vẫn liền vì các thẻ đó cùng mang tên mục. */
      if (c.classList.contains("ls-nhom") && (c.offsetHeight || 0) > nguong) {
        const t = c.querySelector(".ls-nhom-ten");
        const than2 = c.querySelector(".ls-nhom-than");
        if (than2 && than2.children.length > 1) {
          const ten = t ? t.textContent.trim() : "";
          Array.from(than2.children).forEach((x) => manh.push({ el: x, ten }));
          return;
        }
      }
      manh.push({ el: c });
    };
    Array.from(than.children).forEach((c) => {
      if (c.matches(THE_HOP)) Array.from(c.children).forEach(themKhoi);
      else themKhoi(c);
    });

    let the = null;
    manh.forEach((m) => {
      /* Nút "Thu gọn tất cả" mất nghĩa khi mỗi mục đã là một thẻ riêng. */
      if (m.el.classList.contains("ls-nhom-thanh")) return;
      const cao = m.el.offsetHeight || 0;
      /* Thẻ đang mở còn rỗng thì luôn nhận, kể cả khối cao hơn cả ngưỡng — không
         thì sinh ra một thẻ trắng rồi khối vẫn phải nằm ở thẻ sau. */
      if (!the || (the.cao > 0 && the.cao + cao > nguong)) {
        the = { so, phaTen, tenEp: m.ten || "", khoi: [], cao: 0 };
        dsThe.push(the);
      }
      the.khoi.push(m.el);
      the.cao += cao;
    });
  });
  if (dsThe.length <= 1) return false;

  /* Đánh số các thẻ cắt ra từ CÙNG một mục: "(2/4)" nói rõ đang ở đâu trong mục,
     chứ ba thẻ liền nhau cùng ghi "(tiếp)" thì nhìn y hệt nhau, đọc xong thẻ 4
     không biết mình đã qua thẻ 3 hay chưa. */
  for (let i = 0; i < dsThe.length;) {
    const ep = dsThe[i].tenEp;
    if (!ep) { i++; continue; }
    let j = i;
    while (j < dsThe.length && dsThe[j].tenEp === ep) j++;
    if (j - i > 1) for (let k = i; k < j; k++) dsThe[k].phan = `${k - i + 1}/${j - i}`;
    i = j;
  }

  const tong = dsThe.length;
  /* Quay lại bài thì mở đúng thẻ đang đọc dở, không thả về thẻ 1. Rời bài sang màn
     Mô phỏng / Thực hành là đổi địa chỉ nên trang bài dựng lại từ đầu — không nhớ
     thì đọc tới thẻ 9 rồi bấm Mô phỏng, quay về phải bấm "Thẻ tiếp" tám lần. */
  let cur = Math.min(theDangDoc.get(l.id) || 0, tong - 1), xaNhat = cur;
  const deck = document.createElement("div");
  deck.className = "the-deck";
  deck.innerHTML = `
    <div class="the-head">
      <div class="the-track"><i style="width:${(100 / tong).toFixed(1)}%"></i></div>
      <span class="the-dem">Thẻ 1/${tong}</span>
    </div>
    <div class="the-list"></div>
    <div class="the-nav">
      <button class="btn btn-ghost the-lui" type="button" disabled>${aIco("aleft", null, 14)} Thẻ trước</button>
      <div class="the-cham" role="tablist"></div>
      <button class="btn btn-primary the-toi" type="button">Thẻ tiếp ${aIco("aright", null, 14)}</button>
    </div>`;
  phas[0].parentNode.insertBefore(deck, phas[0]);

  const list = deck.querySelector(".the-list");
  const chams = deck.querySelector(".the-cham");
  /* Quá nhiều thẻ thì hàng chấm thành một vệt lấm tấm không bấm trúng cái nào —
     lúc đó thanh tiến độ và số "Thẻ 7/14" đã nói đủ. */
  const coCham = tong <= 12;
  dsThe.forEach((t, i) => {
    /* Thẻ cắt ra từ một mục quá dài mang sẵn tên mục (tenEp) kèm số phần. */
    const ten = (t.tenEp || tenThe(t.khoi, t.phaTen)) + (t.phan ? ` (${t.phan})` : "");
    const the = document.createElement("div");
    the.className = "the-card" + (i ? "" : " hien");
    /* Tên thẻ trùng tên phần (phần chỉ cắt được một thẻ) thì bỏ dòng nhỏ đi —
       viết "ĐẶT VẤN ĐỀ / Đặt vấn đề" chồng lên nhau chẳng thêm được gì. */
    the.innerHTML = `<div class="the-dau">
        <span class="the-so">${esc(t.so)}</span>
        <span class="the-tit">${ten === t.phaTen ? "" : `<small>${esc(t.phaTen)}</small>`}<b>${esc(ten)}</b></span>
      </div><div class="the-than"></div>`;
    const than = the.querySelector(".the-than");
    t.khoi.forEach((k) => than.appendChild(k));   // CHUYỂN, không cloneNode
    list.appendChild(the);

    if (!coCham) return;
    const cham = document.createElement("button");
    cham.type = "button";
    cham.className = "the-cham-b" + (i ? "" : " hien");
    cham.setAttribute("aria-label", `Thẻ ${i + 1}: ${ten}`);
    cham.onclick = () => veThe(i, true);
    chams.appendChild(cham);
  });
  /* Vỏ .ls-pha giờ rỗng ruột (mọi khối đã sang thẻ) và tiêu đề của nó đã được
     đầu thẻ thay thế — bỏ hẳn, để lại thì thành ba cái khung trống dưới bộ thẻ. */
  phas.forEach((p) => p.remove());

  const lui = deck.querySelector(".the-lui");
  const toi = deck.querySelector(".the-toi");
  const dem = deck.querySelector(".the-dem");
  const vach = deck.querySelector(".the-track i");

  function veThe(i, cuonLen, imLang) {
    cur = Math.max(0, Math.min(tong - 1, i));
    xaNhat = Math.max(xaNhat, cur);
    theDangDoc.set(l.id, cur);
    list.querySelectorAll(".the-card").forEach((c, k) => c.classList.toggle("hien", k === cur));
    chams.querySelectorAll(".the-cham-b").forEach((c, k) => {
      c.classList.toggle("hien", k === cur);
      c.classList.toggle("qua", k < xaNhat && k !== cur);
    });
    vach.style.width = ((cur + 1) / tong * 100).toFixed(1) + "%";
    dem.textContent = `Thẻ ${cur + 1}/${tong}`;
    lui.disabled = cur === 0;
    toi.innerHTML = cur === tong - 1
      ? `${aIco("flag", null, 14)} Xong bài`
      : `Thẻ tiếp ${aIco("aright", null, 14)}`;
    /* Xem tới thẻ cuối = đã đi hết bài -> mở nút "Đánh dấu đã học". Tới được đây
       luôn là do người học tự bấm (thẻ đầu không bao giờ là thẻ cuối vì bộ thẻ
       chỉ dựng khi cắt được từ 2 thẻ), nên báo một tiếng là đúng lúc — trừ lượt
       dựng đầu, lúc đó chỉ là mở lại thẻ đang đọc dở chứ chưa đọc thêm gì. */
    if (xaNhat >= tong - 1) moKhoaNutDone(!imLang);
    /* Đổi thẻ thì đưa mép trên của bộ thẻ về đầu màn: thẻ vừa đọc có thể dài hơn
       một màn hình, không kéo lên thì thẻ mới mở ra ở lưng chừng chỗ đang đứng. */
    if (cuonLen) {
      const y = window.scrollY + deck.getBoundingClientRect().top - 78;
      if (window.scrollY > y) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  }

  lui.onclick = () => veThe(cur - 1, true);
  toi.onclick = () => {
    if (cur < tong - 1) { veThe(cur + 1, true); return; }
    const nut = document.getElementById("doneBtn");
    if (nut) nut.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  veThe(cur, false, true);   // cur = thẻ đang đọc dở đã nhớ, không phải luôn thẻ 1
  return true;
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
  /* Hai tab dưới đây KHÔNG lọc theo chủ đề/lớp như bốn tab trên — chúng lấy câu
     theo LỊCH ÔN của từng câu, nên phần chọn bộ lọc bị ẩn đi khi chọn chúng. */
  { id: "hom-nay", nhan: "Ôn hôm nay", ic: "clock", mo: "Những câu tới hẹn ôn lại hôm nay — càng để lâu càng dễ quên." },
  { id: "so-sai", nhan: "Câu sai", ic: "warn", mo: "Sổ câu đã từng làm sai. Mỗi câu phải làm đúng 2 lần vào 2 NGÀY khác nhau mới được xoá khỏi sổ." },
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

  } else if (tab === "hom-nay" || tab === "so-sai") {
    /* Hai tab này KHÔNG có bộ lọc để chọn: danh sách câu do lịch ôn quyết định.
       Thay vào đó hiện SỐ LIỆU, để người học biết mình đang đứng ở đâu. */
    const sl = window.OnTap ? OnTap.soLieu() : { danhGia: 0, denHan: 0, trongSo: 0, daThuoc: 0 };
    const trong = tab === "hom-nay" ? sl.denHan === 0 : sl.trongSo === 0;
    const oSo = (nhan, so, mau) =>
      `<div style="flex:1;min-width:104px;border:1.5px solid var(--border);border-radius:12px;
        background:var(--bg-card);padding:10px 12px">
        <div style="font:900 22px var(--font-display);color:${mau}">${so}</div>
        <div style="font:700 11.5px var(--font-sans);color:var(--text-soft)">${esc(nhan)}</div></div>`;
    phanChinh = `
      <div class="config-row"><label>Tình hình ôn tập</label>
        <div style="display:flex;gap:9px;flex-wrap:wrap">
          ${oSo("tới hẹn hôm nay", sl.denHan, "var(--primary)")}
          ${oSo("đang trong sổ sai", sl.trongSo, "var(--danger)")}
          ${oSo("đã thuộc", sl.daThuoc, "var(--success)")}
          ${oSo("câu đã làm", sl.danhGia, "var(--text-soft)")}
        </div>
      </div>
      ${trong ? `<div class="config-row"><label>${tab === "hom-nay" ? "Hôm nay nghỉ" : "Sổ trống"}</label>
        <div class="chip-group"><span style="color:var(--text-soft);font-size:13.5px">${
          sl.danhGia === 0
            ? "Chưa có câu nào để ôn — hãy làm một lượt luyện tập ở tab khác trước, những câu đó sẽ tự vào lịch ôn."
            : tab === "hom-nay"
              ? "Không có câu nào tới hẹn hôm nay. Cứ nghỉ — ôn sớm hơn lịch thì tốn thời gian mà nhớ không lâu hơn."
              : "Không còn câu nào trong sổ sai. Câu đã sai chỉ ra khỏi sổ khi làm đúng 2 lần vào 2 ngày khác nhau."
        }</span></div></div>` : ""}`;

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
  if (setupCfg.tab === "hom-nay") return "Câu tới hẹn ôn lại hôm nay";
  if (setupCfg.tab === "so-sai") return "Sổ câu đã từng làm sai";
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
  /* Hai tab theo LỊCH ÔN: danh sách câu do OnTap quyết định, KHÔNG áp bộ lọc dạng
     câu / mức độ. Lọc thêm ở đây là bỏ sót đúng những câu tới hẹn — mà tới hẹn thì
     phải hỏi lại, không phụ thuộc nó là câu dạng gì. */
  if (setupCfg.tab === "hom-nay") {
    return window.OnTap ? OnTap.cauTheoId(OnTap.denHan(60)) : [];
  }
  if (setupCfg.tab === "so-sai") {
    return window.OnTap ? OnTap.cauTheoId(OnTap.dsSoSai().map((x) => x.id)) : [];
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
          ? `<span class="streak-counter">${aIco("flame", null, 14)} Streak ${Q.streak} câu đúng</span>`
          : `<span>${esc(luat.moTa)}</span>`}
      </div>
    </div>

    <div class="palette" id="palette"></div>

    <div class="question-card">
      <div class="q-number">Câu ${Q.index + 1} / ${Q.questions.length}</div>
      <div class="q-text">${fmtQ(q.question)}</div>
      ${q.code ? preCode(q.code) : ""}
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
  /* Ghi vào kho lặp giãn cách TRƯỚC khi cắt lịch sử: kho đó mới là nơi giữ trí
     nhớ dài hạn của từng câu, còn State.history chỉ để xem lại mấy lượt gần đây. */
  if (window.OnTap) OnTap.ghiNhanLuot(record.detail);
  if (window.ThanhTich) ThanhTich.ghiLuot(record);
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

  /* Ô "Luyện tập" / "Thi thử" trên bản đồ lộ trình gắn lessonId tổng hợp
     "LT:<chặng>:<chỉ số chương>" / "TT:<chặng>" (xem batDauLuyenChuong,
     batDauThiChang) — nhận ra bằng tiền tố này để đổi màn kết quả sang NGÔN NGỮ
     SAO, khớp với chính cái ô đó đang hiển thị trên bản đồ, thay vì vòng tròn
     phần trăm chỉ hợp với bài luyện/thi độc lập ngoài trang chủ. */
  const oPhuMatch = typeof Q.lessonId === "string" && /^(LT|TT):(\d+)/.exec(Q.lessonId);
  const changOPhu = oPhuMatch ? Number(oPhuMatch[2]) : null;
  const stars = oPhuMatch ? starsFor(pctScore) : null;

  const ring = ringSVG(pctScore, isExam ? result.score.toFixed(2) : `${result.correctCount}/${result.total}`, isExam ? "/ 10 điểm" : "câu đúng");
  const starHero = `<div class="result-stars">${[0, 1, 2].map((i) => starSvg(i < stars, "result-star")).join("")}</div>`;

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
      ${oPhuMatch ? starHero : `<div class="score-ring">${ring}</div>`}
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
        ${oPhuMatch
          ? `<button class="btn btn-ghost" id="backMapBtn">${aIco("aleft", null, 15)} Quay lại bản đồ</button>
             <button class="btn btn-primary" id="continueBtn">${aIco("aright", null, 15)} Học tiếp</button>`
          : `<button class="btn btn-ghost" id="homeBtn">${aIco("home", null, 15)} Trang chủ</button>`}
        <button class="btn ${oPhuMatch ? "btn-ghost" : "btn-primary"}" id="toggleReview">${aIco("eye", null, 15)} Xem lời giải chi tiết</button>
      </div>
    </div>

    <div id="reviewArea" hidden></div>
  `;

  if (oPhuMatch) {
    /* "Quay lại bản đồ": về đúng chặng của ô vừa làm. "Học tiếp": đi thẳng tới
       bài đang học dở của lộ trình — không bắt học sinh tự tìm lại chỗ mình
       đang học sau khi vừa làm xong ô luyện tập/thi thử.
       CHƯA làm animation sao xuất hiện lúc quay lại bản đồ: chờ chốt cách biểu
       diễn số sao (việc của một phiên khác), làm animation trước dễ phải sửa lại. */
    document.getElementById("backMapBtn").onclick = () => {
      vuaXongOPhu = Q.lessonId; // báo cho renderLessons biết chạy animation sao cho đúng ô này
      State.quiz = null;
      go("lessons", { stage: changOPhu });
    };
    document.getElementById("continueBtn").onclick = () => {
      State.quiz = null;
      const cur = pathState().cur;
      if (cur) go("lesson", { id: cur.id });
      else go("lessons", { stage: changOPhu });
    };
  } else {
    document.getElementById("homeBtn").onclick = () => { State.quiz = null; go("home"); };
  }
  document.getElementById("retryBtn").onclick = () => {
    if (isExam && Q.code && typeof startExamCode === "function") startExamCode(Q.code);
    else if (isExam) startExam();
    /* Giữ lessonId khi làm lại: thiếu dòng này thì làm lại ô "Luyện tập"/"Thi thử"
       xong nộp bài lại rơi về màn kết quả kiểu thường (vòng tròn %), mất luôn
       sao — vì màn kết quả nhận diện ô phụ qua CHÍNH lessonId này. */
    else { State.quiz = newQuiz(shuffle(Q.questions), Q.mode, { title: Q.title, minutes: Q.minutes, lessonId: Q.lessonId }); go("quiz"); }
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
        ${q.code ? preCode(q.code) : ""}
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
/* idDiem của ô "Luyện tập"/"Thi thử" vừa làm xong, đặt ở nút "Quay lại bản đồ"
   trong renderResult, đọc và xoá ngay ở renderLessons — để bản đồ biết cần
   chạy animation sao xuất hiện cho đúng MỘT ô, và chỉ chạy một lần. */
let vuaXongOPhu = null;

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
          <button class="floating-mascot-close" id="closeMascotBubble" title="Đóng bóng thoại">${aIco("close", null, 15)}</button>
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
  // aria-pressed để .um-switch[aria-pressed="true"] tô sáng đúng lúc đang bật tối
  tb.setAttribute("aria-pressed", dark ? "true" : "false");
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
  document.querySelectorAll(".nav-btn[data-nav], .bottom-nav .bnav-btn[data-nav]").forEach((b) => {
    b.onclick = () => {
      if (b.dataset.nav === "tutor") {
        if (typeof Tutor !== "undefined") {
          if (State.view === "lesson" && typeof LESSON_DANG_MO !== "undefined" && LESSON_DANG_MO) {
            Tutor.moBai(LESSON_DANG_MO);
          } else {
            Tutor.moChung();
          }
        }
        return;
      }
      guardLeave(() => go(b.dataset.nav));
    };
  });
  initUserMenu();
}

/* Khối avatar góc phải (Hồ sơ / Tài khoản / âm thanh / giao diện gộp lại).
   Chỉ lo việc MỞ/ĐÓNG — nội dung bên trong (avatar, tên, gói) do
   Account.veUserMenu() ở account.js tự cập nhật, độc lập với hàm này. */
function initUserMenu() {
  const trig = document.getElementById("umTrigger");
  const menu = document.getElementById("umMenu");
  if (!trig || !menu) return;
  const dat = (mo) => {
    menu.hidden = !mo;
    trig.setAttribute("aria-expanded", mo ? "true" : "false");
    trig.classList.toggle("open", mo);
  };
  trig.onclick = (e) => { e.stopPropagation(); dat(menu.hidden); };
  /* Dùng composedPath() để biết click có nằm trong menu không, KHÔNG dùng
     menu.contains(e.target): nút loa/giao diện thay nguyên innerHTML (đổi icon)
     ngay lúc bấm, nên nếu bấm trúng đúng hình <svg>/<path> bên trong, phần tử
     đó bị THÁO KHỎI DOM giữa lúc sự kiện đang nổi bọt lên — .contains() với một
     nút đã tháo luôn trả về false dù bấm rõ ràng ở trong menu, khiến menu tự
     đóng và tưởng như bấm icon "không có phản hồi". composedPath() chụp lại
     đường đi của sự kiện NGAY LÚC PHÁT ra, không đổi dù DOM có bị sửa giữa
     chừng — đây chính là lỗi đã đo được khi bấm thẳng vào icon loa/theme. */
  const trongMenu = (e) => {
    const duong = e.composedPath ? e.composedPath() : [e.target];
    return duong.includes(menu) || duong.includes(trig);
  };
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !trongMenu(e)) dat(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { dat(false); trig.focus(); }
  });
  // Bấm "Hồ sơ" / "Tài khoản" / "Đổi hồ sơ" / "Đăng xuất" thì đóng menu trước
  // khi chuyển màn, không thì menu vẫn che lên trên nội dung màn mới.
  menu.querySelectorAll(".um-item").forEach((b) => b.addEventListener("click", () => dat(false)));
  // Hai hàng công tắc: bấm cả hàng cũng bật/tắt được, không chỉ đúng cái nút nhỏ.
  // Không đóng menu khi bấm — người học có thể muốn chỉnh cả hai rồi mới đóng.
  [["umRowSound", "amToggle"], ["umRowTheme", "themeToggle"]].forEach(([rowId, btnId]) => {
    const row = document.getElementById(rowId), btn = document.getElementById(btnId);
    if (!row || !btn) return;
    row.addEventListener("click", (e) => {
      const duong = e.composedPath ? e.composedPath() : [e.target];
      if (!duong.includes(btn)) btn.click();
    });
  });
  // Dải chọn "Cách hiển thị bài học". Không đóng menu khi bấm: người học vừa đổi
  // là bài đang mở phía sau vẽ lại ngay, xem thử rồi đổi tiếp cũng được.
  const seg = document.getElementById("umDocBai");
  if (seg) {
    seg.querySelectorAll("button[data-doc]").forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); datDocBai(b.dataset.doc); };
    });
    capNhatNutDocBai();
  }
  // "Đổi hồ sơ": dùng lại đúng màn chọn hồ sơ ở lúc đăng nhập (Account.renderProfilePicker),
  // qua guardLeave vì đây là đổi cả danh tính đang dùng, không phải chuyển trang thường.
  const switchBtn = document.getElementById("umSwitchBtn");
  if (switchBtn) switchBtn.onclick = () => guardLeave(() => { if (window.Account) Account.renderProfilePicker(); });
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
  // Khối avatar không mang data-nav (nó là nút mở menu, không phải điều hướng
  // trực tiếp) nên phải tự ẩn/hiện riêng, không thì lúc chờ đăng nhập vẫn bấm
  // mở được menu trong khi mọi nút khác đã bị khoá.
  const umWrap = document.getElementById("umWrap");
  if (umWrap) umWrap.hidden = !mo;
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
    /* Đổ avatar/tên/gói vào khối tài khoản NGAY khi boot() xong, bất kể sau đó
       rẽ vào nhánh khách, chọn hồ sơ, hay đã đăng nhập đủ — cả bốn đường trong
       boot() (file://, mất mạng, đăng nhập, lỗi máy chủ) đều đi qua đúng một
       chỗ này khi resolve. */
    if (window.Account && Account.veUserMenu) Account.veUserMenu();
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
