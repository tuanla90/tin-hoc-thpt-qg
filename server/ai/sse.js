/* Đọc luồng SSE (Server-Sent Events) — cả Claude lẫn Gemini đều trả kiểu này.
   Gọi onData(objectJSON) cho từng dòng "data: {...}". */
async function docSSE(res, onData) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let dem = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    dem += dec.decode(value, { stream: true });
    let i;
    while ((i = dem.indexOf("\n")) >= 0) {
      const dong = dem.slice(0, i).trim();
      dem = dem.slice(i + 1);
      if (!dong.startsWith("data:")) continue;
      const tho = dong.slice(5).trim();
      if (!tho || tho === "[DONE]") continue;
      try { onData(JSON.parse(tho)); } catch (e) { /* dòng chưa trọn, bỏ qua */ }
    }
  }
}

/* Lỗi từ nhà cung cấp -> thông điệp tiếng Việt gọn, KHÔNG lộ khoá hay chi tiết nội bộ */
function loiNhaCungCap(status, body) {
  if (status === 401 || status === 403) return "Khoá API không hợp lệ hoặc chưa được cấp quyền.";
  if (status === 429) return "Nhà cung cấp AI đang quá tải, thử lại sau ít phút.";
  if (status >= 500) return "Nhà cung cấp AI đang gặp sự cố, thử lại sau.";
  return "Không gọi được AI (mã " + status + ").";
}

module.exports = { docSSE, loiNhaCungCap };
