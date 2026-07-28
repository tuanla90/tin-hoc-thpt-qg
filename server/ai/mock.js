/* Nhà cung cấp GIẢ — dùng khi chạy thử ở máy và khi chạy test.
   Không gọi mạng, không cần khoá, trả lại vài câu có nhắc tới bài đang học để
   kiểm tra đường đi của dữ liệu (hạn mức, lưu nhật ký, hiển thị dần trên trang). */

/* Giả lập lỗi để test vòng thử lại của aiChat.
   AI_MOCK_LOI = "<mã>:<số lần hỏng>" — vd "429:2" là hai lượt đầu trả 429 rồi
   lượt thứ ba mới thành công. Chỉ có ở nhà cung cấp giả, không ảnh hưởng bản thật. */
let _soLanGoi = 0;
function soLanGoi() { return _soLanGoi; }
function datLai() { _soLanGoi = 0; }

function loiGiaLap() {
  const raw = process.env.AI_MOCK_LOI;
  if (!raw) return null;
  const [ma, lan] = String(raw).split(":");
  if (_soLanGoi > (Number(lan) || 1)) return null;   // đã hỏng đủ số lần -> cho qua
  const e = new Error("Giả lập lỗi " + ma);
  e.status = Number(ma) || 500;
  return e;
}

function chat({ system, messages, onText, onUsage }) {
  _soLanGoi++;
  const gia = loiGiaLap();
  if (gia) return Promise.reject(gia);
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
    "Các bước nên làm:\n" +
    "1. Đọc lại mục đầu của bài\n" +
    "2. Làm thử một câu luyện tập\n" +
    "3. Sai chỗ nào thì hỏi mình tiếp\n" +
    "\nLưu ý: 2 ** 3 = 8 (dấu ** ở đây là luỹ thừa, không phải chữ đậm).";
  /* Ước lượng token từ độ dài thật (~2,8 ký tự/token với tiếng Việt) để trang
     quản trị ở bản chạy thử vẫn ra số liệu giống thật, không phải toàn số 0. */
  const soTok = (s) => Math.round(String(s || "").length / 2.8);
  const vao = soTok(system) + messages.reduce((n, m) => n + soTok(m.content), 0);

  return new Promise((ok) => {
    const tu = cau.split(" ");
    let i = 0;
    const go = () => {
      if (i >= tu.length) {
        if (onUsage) onUsage({ vao, dem: 0, ra: soTok(cau) });
        return ok();
      }
      onText((i ? " " : "") + tu[i++]);
      setTimeout(go, 12);
    };
    go();
  });
}

module.exports = { chat, soLanGoi, datLai };
