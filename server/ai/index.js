/* ============================================================================
 *  CHỌN NHÀ CUNG CẤP AI THEO BIẾN MÔI TRƯỜNG
 *  Đổi giữa Claude và Gemini chỉ bằng biến trên Railway, KHÔNG sửa mã:
 *    AI_PROVIDER     claude | gemini | mock   (thiếu -> tắt tính năng gia sư)
 *    AI_API_KEY      khoá của nhà cung cấp đang chọn
 *    AI_MODEL        model dùng hằng ngày
 *    AI_MODEL_DEEP   model mạnh hơn cho nút "giải thích kỹ hơn" (không có thì
 *                    dùng lại AI_MODEL)
 *    AI_FREE_PER_DAY / AI_PAID_PER_DAY   hạn mức lượt hỏi mỗi ngày
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

/* Gọi AI, đẩy từng mẩu chữ ra onText. Ném lỗi có .status nếu gọi hỏng. */
async function aiChat(opts) {
  const cfg = aiConfig();
  const nha = NHA_CC[cfg.provider];
  if (!nha || !cfg.ready) {
    const e = new Error("Chưa bật gia sư AI trên máy chủ.");
    e.status = 503;
    throw e;
  }
  return nha.chat({
    key: cfg.key,
    model: opts.deep ? cfg.modelDeep : cfg.model,
    system: opts.system,
    messages: opts.messages,
    maxTokens: opts.maxTokens,
    onText: opts.onText,
    signal: opts.signal,
  });
}

module.exports = { aiConfig, aiChat };
