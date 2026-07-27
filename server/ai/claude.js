/* Gọi Claude (Anthropic Messages API) và trả LUỒNG CHỮ.
   Khác Gemini ở ba chỗ, xử lý gọn trong tệp này để bên ngoài không cần biết:
     - `system` là tham số RIÊNG, không nằm trong messages
     - vai trò trợ lý gọi là "assistant"
     - luồng SSE có nhiều loại sự kiện, chữ nằm ở content_block_delta */
const { docSSE, loiNhaCungCap } = require("./sse");

async function chat({ key, model, system, messages, maxTokens, onText, signal }) {
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
    throw e;
  }
  await docSSE(res, (d) => {
    if (d.type === "content_block_delta" && d.delta && typeof d.delta.text === "string") onText(d.delta.text);
  });
}

module.exports = { chat };
