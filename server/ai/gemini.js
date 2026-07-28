/* Gọi Gemini (Google Generative Language API) và trả LUỒNG CHỮ.
   Khác Claude ở ba chỗ:
     - không có tham số `system` riêng -> đưa vào systemInstruction
     - vai trò trợ lý gọi là "model" (không phải "assistant")
     - chữ nằm ở candidates[0].content.parts[].text */
const { docSSE, loiNhaCungCap, doiLaiMs } = require("./sse");

async function chat({ key, model, system, messages, maxTokens, onText, onUsage, signal }) {
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
    e.doiMs = doiLaiMs(res, tho);   // aiChat dùng để chờ đúng lời nhà cung cấp
    throw e;
  }
  await docSSE(res, (d) => {
    const parts = d && d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts;
    (parts || []).forEach((p) => { if (typeof p.text === "string") onText(p.text); });
    /* Mẩu cuối luồng kèm số token đã dùng. `cachedContentTokenCount` > 0 nghĩa là
       ĐỆM NGỮ CẢNH ngầm đã ăn — phần prompt trùng với lượt trước được tính rẻ. */
    const u = d && d.usageMetadata;
    if (u && onUsage) {
      onUsage({
        vao: u.promptTokenCount || 0,
        dem: u.cachedContentTokenCount || 0,
        ra: u.candidatesTokenCount || 0,
      });
    }
  });
}

module.exports = { chat };
