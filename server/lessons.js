/* ============================================================================
 *  ĐỌC NỘI DUNG BÀI HỌC Ở PHÍA MÁY CHỦ
 *
 *  Vì sao cần: gia sư AI phải tự dựng ngữ cảnh từ `lessonId` do người dùng gửi
 *  lên, KHÔNG BAO GIỜ nhận nội dung bài do trình duyệt gửi kèm. Nếu tin lời
 *  trình duyệt thì ai cũng nhét được văn bản tuỳ ý và biến app thành chatbot
 *  chung miễn phí.
 *
 *  Dữ liệu bài học vốn viết cho trình duyệt (public/js/clean-*.js, questions*.js
 *  — các tệp gán biến toàn cục chứ không export). Ở đây nạp chúng bằng `vm` với
 *  một DOM giả tối thiểu, đúng thứ tự khai báo trong index.html để ID câu hỏi
 *  sinh ra trùng khít với trình duyệt.
 *
 *  Nạp lười (lần gọi gia sư đầu tiên) và nhớ luôn — không làm chậm lúc khởi động
 *  và không tốn gì nếu chưa bật AI.
 * ==========================================================================*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const PUB = path.join(__dirname, "..", "public");

/* DOM giả: đủ để các tệp dữ liệu chèn <style>, đọc localStorage... mà không nổ. */
function dungSandbox() {
  const el = () => ({
    style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    appendChild() {}, insertAdjacentHTML() {}, setAttribute() {}, addEventListener() {},
    querySelector: () => null, querySelectorAll: () => [], remove() {},
    set textContent(v) {}, get textContent() { return ""; },
    set innerHTML(v) {}, get innerHTML() { return ""; },
  });
  const doc = {
    createElement: el, createTextNode: el, head: el(), body: el(), documentElement: el(),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, readyState: "complete",
  };
  const box = {
    console: { log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, setInterval, clearInterval, JSON, Math, Date, RegExp,
    document: doc,
    navigator: { language: "vi", userAgent: "node" },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    speechSynthesis: { getVoices: () => [], speak() {}, cancel() {} },
    fetch: () => Promise.reject(new Error("no fetch")),
    location: { hash: "", protocol: "http:", href: "http://localhost/" },
    history: { replaceState() {}, pushState() {} },
    requestAnimationFrame: (f) => setTimeout(f, 0),
  };
  box.window = box;
  box.globalThis = box;
  return box;
}

/* Thứ tự nạp lấy đúng từ index.html — bỏ vendor và các tệp chỉ lo giao diện.
   ID câu hỏi trong questions-vandung.js sinh theo thứ tự nạp, nên KHÔNG được
   tự ý sắp lại danh sách này. */
function danhSachTep() {
  const html = fs.readFileSync(path.join(PUB, "index.html"), "utf8");
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  const boQua = /vendor\/|\/app\.js$|account\.js$|exam-modes\.js$|profile\.js$|skills\.js$|session\.js$|tutor\.js$/;
  return srcs.filter((s) => !boQua.test(s));
}

let KHO = null; // { baiTheoId: Map, cauTheoId: Map, soBai, soCau }

function napKho() {
  if (KHO) return KHO;
  const box = dungSandbox();
  const ctx = vm.createContext(box);
  for (const src of danhSachTep()) {
    const file = path.join(PUB, src);
    if (!fs.existsSync(file)) continue;
    try {
      vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: src, timeout: 20000 });
    } catch (e) {
      console.warn("[lessons] Bỏ qua", src, "-", e.message.slice(0, 120));
    }
  }
  const baiTheoId = new Map();
  (box.LESSONS || []).forEach((l) => baiTheoId.set(l.id, l));
  const cauTheoId = new Map();
  (box.QUESTION_BANK || []).forEach((q) => cauTheoId.set(q.id, q));
  KHO = { baiTheoId, cauTheoId, soBai: baiTheoId.size, soCau: cauTheoId.size, VOCAB: box.VOCAB || {} };
  console.log("[lessons] Đã nạp", KHO.soBai, "bài,", KHO.soCau, "câu hỏi cho gia sư AI.");
  return KHO;
}

function layBai(id) { return napKho().baiTheoId.get(String(id)) || null; }
function layCau(id) { return napKho().cauTheoId.get(String(id)) || null; }

const TEN_CHU_DE = {
  A: "Máy tính và xã hội tri thức", B: "Mạng máy tính và Internet",
  C: "Đạo đức, pháp luật và văn hoá", D: "Ứng dụng tin học",
  E: "Giải quyết vấn đề với máy tính", F: "Hướng nghiệp với tin học",
  G: "Khoa học máy tính (chuyên sâu)",
};

/* Bài học -> văn bản thuần để nhét vào prompt. Cắt bớt cho vừa hạn mức token:
   giữ trọn phần lý thuyết, bỏ bớt phần kể chuyện dẫn nhập nếu quá dài. */
function noiDungBai(bai, gioiHan = 7000) {
  const p = [];
  p.push("BÀI ĐANG HỌC: " + bai.title);
  p.push("Lớp " + bai.grade + " — chủ đề " + bai.topic + " (" + (TEN_CHU_DE[bai.topic] || "") + ")");
  if (bai.intro) p.push("Giới thiệu: " + bai.intro);
  p.push("");
  (bai.sections || []).forEach((s) => {
    const t = s.t || s.type;
    if (t === "h") p.push("\n## " + s.text);
    else if (t === "code") p.push("```\n" + (s.code || s.text || "") + "\n```");
    else if (t === "list") p.push((s.items || []).map((x) => "- " + x).join("\n"));
    else if (t === "example") {
      if (s.text) p.push(s.text);
      if (s.code) p.push("```\n" + s.code + "\n```");
      if (s.output) p.push("Kết quả: " + s.output);
    } else if (t === "note") p.push("Lưu ý: " + s.text);
    else if (s.text) p.push(s.text);
  });
  if ((bai.keypoints || []).length) {
    p.push("\n## Ý chính cần nhớ");
    bai.keypoints.forEach((k) => p.push("- " + k));
  }
  let vb = p.join("\n").replace(/\n{3,}/g, "\n\n");
  if (vb.length > gioiHan) vb = vb.slice(0, gioiHan) + "\n… (đã lược bớt phần cuối)";
  return vb;
}

/* Câu hỏi -> văn bản, kèm đáp án đúng và lời giải sẵn có trong ngân hàng câu hỏi.
   Dùng cho chế độ "Vì sao tôi sai?": AI phải biết đáp án ĐÚNG là gì, và biết học
   sinh đã chọn gì, để giảng đúng chỗ hiểu nhầm. */
function noiDungCau(q, daChon) {
  const p = [];
  p.push("CÂU HỎI: " + q.question);
  if (q.code) p.push("```\n" + q.code + "\n```");
  if (q.type === "mc") {
    (q.options || []).forEach((o, i) => p.push(String.fromCharCode(65 + i) + ". " + o));
    p.push("Đáp án đúng: " + String.fromCharCode(65 + q.answer));
    if (typeof daChon === "number" && daChon >= 0) p.push("Học sinh đã chọn: " + String.fromCharCode(65 + daChon));
  } else if (q.type === "tf") {
    (q.statements || []).forEach((s, i) => {
      const chon = Array.isArray(daChon) ? daChon[i] : null;
      p.push("Ý " + "abcd"[i] + ") " + s.text + " → đáp án đúng: " + (s.correct ? "Đúng" : "Sai") +
        (chon == null ? "" : "; học sinh chọn: " + (chon ? "Đúng" : "Sai")));
    });
  } else {
    p.push("Đáp án đúng: " + q.answer);
    if (typeof daChon === "string" && daChon) p.push("Học sinh trả lời: " + daChon);
  }
  if (q.explain) p.push("Lời giải vắn tắt có sẵn: " + q.explain);
  return p.join("\n");
}

module.exports = { layBai, layCau, noiDungBai, noiDungCau, napKho, TEN_CHU_DE };
