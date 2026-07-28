/* ============================================================================
 *  CHỌN NHÀ CUNG CẤP AI THEO BIẾN MÔI TRƯỜNG
 *  Đổi giữa Claude và Gemini chỉ bằng biến trên Railway, KHÔNG sửa mã:
 *    AI_PROVIDER     claude | gemini | mock   (thiếu -> tắt tính năng gia sư)
 *    AI_API_KEY      khoá của nhà cung cấp đang chọn
 *    AI_MODEL        model dùng hằng ngày
 *    AI_MODEL_DEEP   model mạnh hơn cho nút "giải thích kỹ hơn" (không có thì
 *                    dùng lại AI_MODEL)
 *    AI_FREE_PER_DAY / AI_PAID_PER_DAY   hạn mức lượt hỏi mỗi ngày
 *    AI_RETRY_MS     các nhịp chờ khi bị nghẽn, vd "1200,3000" (mặc định);
 *                    để rỗng là tắt hẳn thử lại
 *  "mock" là nhà cung cấp giả để chạy thử và test mà không tốn tiền, không cần khoá.
 * ==========================================================================*/
const claude = require("./claude");
const gemini = require("./gemini");
const mock = require("./mock");

const NHA_CC = { claude, gemini, mock };

function aiConfig() {
  const provider = String(process.env.AI_PROVIDER || "").toLowerCase().trim();
  const key = process.env.AI_API_KEY || "";
  const model = process.env.AI_MODEL || "";
  return {
    provider,
    key,
    model,
    modelDeep: process.env.AI_MODEL_DEEP || model,
    freePerDay: Number(process.env.AI_FREE_PER_DAY || 5),
    paidPerDay: Number(process.env.AI_PAID_PER_DAY || 25),
    /* mock không cần khoá; hai nhà cung cấp thật thì thiếu khoá hoặc thiếu model
       là coi như chưa bật, để giao diện tự ẩn nút gia sư thay vì lỗi khi bấm */
    ready: provider === "mock" ? true : !!(NHA_CC[provider] && key && model),
  };
}

/* ---------------------------- THỬ LẠI KHI NGHẼN ----------------------------
 *  Tối mùa thi, cả trăm học sinh hỏi trong cùng một khung giờ nên thỉnh thoảng
 *  nhà cung cấp trả 429 dù chỉ nghẽn một hai giây. Không thử lại thì học sinh
 *  nhận ngay "AI đang quá tải" — hỏng trải nghiệm vì một cái chớp mắt.
 *
 *  Ba nguyên tắc:
 *   1. CHỈ thử lại khi CHƯA đẩy được chữ nào ra trình duyệt. Đã chảy chữ rồi mà
 *      gọi lại thì học sinh thấy câu trả lời lặp nửa chừng — thà báo lỗi.
 *   2. Chỉ thử lại lỗi TẠM THỜI (429, 5xx, rớt mạng). 400/401/403 là sai cấu
 *      hình hoặc sai khoá: gọi lại mười lần cũng vậy, chỉ tổ chậm.
 *   3. Người học đóng bảng chat (abort) thì dừng ngay, không chờ hết nhịp.
 * ------------------------------------------------------------------------- */
const CHO_MAX = 8000;   // trần một nhịp chờ, kể cả khi nhà cung cấp đòi lâu hơn

/* Các nhịp chờ (ms) sau lần hỏng thứ 1, thứ 2... Số nhịp = số lần thử lại.
   Đặt AI_RETRY_MS="" để tắt hẳn; test đặt số nhỏ cho chạy nhanh. */
function nhipCho() {
  const raw = process.env.AI_RETRY_MS;
  if (raw === undefined) return [1200, 3000];
  return String(raw).split(",")
    .map((s) => s.trim())
    .filter(Boolean)                       // chuỗi rỗng KHÔNG phải "chờ 0ms" mà là không có nhịp nào
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= 0);
}

function nenThuLai(e) {
  if (!e || e.name === "AbortError") return false;   // người học tự dừng
  const s = e.status;
  if (s === 429) return true;                        // nghẽn hạn mức
  if (typeof s === "number" && s >= 500) return true; // sự cố phía họ
  return !s;                                          // rớt mạng: fetch ném không kèm status
}

/* Chờ, nhưng bỏ chờ ngay nếu người học đóng bảng chat giữa chừng. */
function ngu(ms, signal) {
  return new Promise((xong, hong) => {
    const huy = () => {
      clearTimeout(t);
      const e = new Error("Đã huỷ");
      e.name = "AbortError";
      hong(e);
    };
    if (signal && signal.aborted) return huy();
    const t = setTimeout(() => {
      if (signal) signal.removeEventListener("abort", huy);
      xong();
    }, ms);
    if (signal) signal.addEventListener("abort", huy, { once: true });
  });
}

/* Gọi AI, đẩy từng mẩu chữ ra onText. Ném lỗi có .status nếu gọi hỏng. */
async function aiChat(opts) {
  const cfg = aiConfig();
  const nha = NHA_CC[cfg.provider];
  if (!nha || !cfg.ready) {
    const e = new Error("Chưa bật gia sư AI trên máy chủ.");
    e.status = 503;
    throw e;
  }

  let daChay = false;   // đã đẩy được chữ nào ra chưa -> chốt chặn của nguyên tắc 1
  const doiChu = (t) => { daChay = true; opts.onText(t); };
  const cho = nhipCho();

  for (let lan = 0; ; lan++) {
    try {
      return await nha.chat({
        key: cfg.key,
        model: opts.deep ? cfg.modelDeep : cfg.model,
        system: opts.system,
        messages: opts.messages,
        maxTokens: opts.maxTokens,
        onText: doiChu,
        signal: opts.signal,
      });
    } catch (e) {
      if (daChay || lan >= cho.length || !nenThuLai(e)) throw e;
      // nhà cung cấp có nói chờ bao lâu thì nghe theo, nhưng không quá CHO_MAX
      const ms = Math.min(Math.max(Number(e.doiMs) || 0, cho[lan]), CHO_MAX);
      console.warn("[ai] " + (e.status || "lỗi mạng") + " — thử lại lần " + (lan + 1) + " sau " + ms + "ms");
      await ngu(ms, opts.signal);
    }
  }
}

module.exports = { aiConfig, aiChat, nenThuLai, nhipCho };
