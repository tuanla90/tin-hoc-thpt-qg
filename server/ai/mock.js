/* Nhà cung cấp GIẢ — dùng khi chạy thử ở máy và khi chạy test.
   Không gọi mạng, không cần khoá, trả lại vài câu có nhắc tới bài đang học để
   kiểm tra đường đi của dữ liệu (hạn mức, lưu nhật ký, hiển thị dần trên trang). */
function chat({ system, messages, onText }) {
  const hoi = (messages[messages.length - 1] || {}).content || "";
  const ten = (String(system).match(/BÀI ĐANG HỌC:\s*(.+)/) || [])[1] || "bài này";
  /* Câu trả lời mẫu cố tình có đủ **đậm**, `mã`, gạch đầu dòng, khối code và một
     con số kẹp giữa hai dấu cách — để kiểm luôn bộ hiển thị markdown ở trình duyệt. */
  const cau =
    "(Bản chạy thử — chưa nối AI thật.) Bạn hỏi: “" + hoi.slice(0, 80) + "”.\n" +
    "Trong " + ten.trim() + " có 3 ý chính:\n" +
    "- **Dữ liệu** là phần thô, chưa có nghĩa\n" +
    "- **Thông tin** là nghĩa ta hiểu ra\n" +
    "- Phép chia lấy phần nguyên viết là `a // b`\n" +
    "\nVí dụ:\n```python\na = 5\nprint(a // 2)\n```\n" +
    "Bạn thử đọc lại mục đầu rồi làm một câu luyện tập xem sao nhé.";
  return new Promise((ok) => {
    const tu = cau.split(" ");
    let i = 0;
    const go = () => {
      if (i >= tu.length) return ok();
      onText((i ? " " : "") + tu[i++]);
      setTimeout(go, 12);
    };
    go();
  });
}

module.exports = { chat };
