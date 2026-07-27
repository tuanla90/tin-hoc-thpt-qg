/* Gọi Gemini (Google Generative Language API) và trả LUỒNG CHỮ.
   Khác Claude ở ba chỗ:
     - không có tham số `system` riêng -> đưa vào systemInstruction
     - vai trò trợ lý gọi là "model" (không phải "assistant")
     - chữ nằm ở candidates[0].content.parts[].text */
const { docSSE, loiNhaCungCap } = require("./sse");

async function chat({ key, model, system, messages, maxTokens, onText, signal }) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(model) + ":streamGenerateContent?alt=sse&key=" + encodeURIComponent(key);
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: maxTokens || 700, temperature: 0.4 },
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
    const parts = d && d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts;
    (parts || []).forEach((p) => { if (typeof p.text === "string") onText(p.text); });
  });
}

module.exports = { chat };
