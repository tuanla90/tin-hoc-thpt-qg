/* Gọi Claude (Anthropic Messages API) và trả LUỒNG CHỮ.
   Khác Gemini ở ba chỗ, xử lý gọn trong tệp này để bên ngoài không cần biết:
     - `system` là tham số RIÊNG, không nằm trong messages
     - vai trò trợ lý gọi là "assistant"
     - luồng SSE có nhiều loại sự kiện, chữ nằm ở content_block_delta */
const { docSSE, loiNhaCungCap, doiLaiMs } = require("./sse");

async function chat({ key, model, system, messages, maxTokens, onText, onUsage, signal }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens || 700,
      system,
      messages: messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      stream: true,
    }),
    signal,
  });
  if (!res.ok) {
    const tho = await res.text().catch(() => "");
    const e = new Error(loiNhaCungCap(res.status, tho));
    e.status = res.status;
    e.chiTiet = tho.slice(0, 300);
    e.doiMs = doiLaiMs(res, tho);   // aiChat dùng để chờ đúng lời nhà cung cấp
    throw e;
  }
  /* Anthropic báo token làm hai nhịp: `message_start` có token vào (kèm phần đọc
     từ đệm), `message_delta` cuối luồng có token ra. Gom lại rồi báo một lần. */
  const dem = { vao: 0, dem: 0, ra: 0 };
  await docSSE(res, (d) => {
    if (d.type === "content_block_delta" && d.delta && typeof d.delta.text === "string") onText(d.delta.text);
    const u = (d.type === "message_start" && d.message && d.message.usage) ||
      (d.type === "message_delta" && d.usage) || null;
    if (u) {
      if (u.input_tokens) dem.vao = u.input_tokens;
      if (u.cache_read_input_tokens) dem.dem = u.cache_read_input_tokens;
      if (u.output_tokens) dem.ra = u.output_tokens;
    }
  });
  if (onUsage && (dem.vao || dem.ra)) onUsage(dem);
}

module.exports = { chat };
