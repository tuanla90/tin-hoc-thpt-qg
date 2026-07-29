/* ============================================================================
 *  CHUẨN BỊ TỆP ÂM THANH  —  node scripts/am-thanh.js [thư-mục-nguồn]
 *
 *  Nguồn: gói sfx của dự án semantix-docs (landing/video-remotion/public/audio/sfx).
 *  Bên đó dùng cho video nên tệp dài và nặng; ứng dụng học thì cần ngược lại —
 *  tiếng phải NGẮN và NHẸ:
 *    · ngắn  : học sinh trả lời liên tiếp, tiếng dài 1,3 giây sẽ chồng lên câu
 *              sau và nghe như máy bị treo;
 *    · nhẹ   : phần lớn học trên điện thoại, 3G. Hạ 44,1kHz -> 22,05kHz và cắt
 *              phần đuôi im lặng là còn khoảng 1/5 dung lượng mà tai gần như
 *              không phân biệt được với tiếng gốc.
 *
 *  Ghi WAV chứ không phải MP3: mã hoá MP3 cần thư viện ngoài, trong khi cả ba
 *  tệp cộng lại chỉ vài chục KB, lại nằm trong /asset/ nên service worker giữ
 *  luôn ở máy sau lần tải đầu (xem public/sw.js) và máy chủ đặt cache 30 ngày.
 *
 *  Chạy lại khi đổi tiếng. Không có thư mục nguồn thì script báo rõ và dừng —
 *  tệp kết quả đã nằm trong repo nên không ai bị chặn vì thiếu nguồn.
 *
 *  NGUỒN GỐC (theo scripts/map_audio.py của semantix-docs) — ghi lại để sau này
 *  còn kiểm được giấy phép:
 *    ding.wav  <- dragon-studio-correct-472358.mp3      (tiếng "trả lời đúng")
 *    wrong.wav <- eritnhut1992-buzzer-or-wrong-answer-20582.mp3
 *    click.wav <- universfield-mouse-click-351398.mp3
 *  Cách đặt tên là kiểu của Pixabay (tên người đóng góp + mã số).
 * ==========================================================================*/
const fs = require("fs");
const path = require("path");

const NGUON = process.argv[2] ||
  "D:/Users/tuanla2/semantix-docs/landing/video-remotion/public/audio/sfx";
const DICH = path.join(__dirname, "..", "public", "asset", "am");
const SR_RA = 22050;          // đủ cho tiếng hiệu ứng; nửa dung lượng của 44,1kHz

/* tep    : tên trong gói nguồn
   dai    : độ dài tối đa (giây) — cắt thẳng rồi vuốt nhỏ dần, không để tiếng
            kéo dài chồng sang câu tiếp theo
   to     : mức đỉnh sau chuẩn hoá. Tiếng SAI cố ý nhỏ hơn tiếng ĐÚNG: sai đã
            khó chịu sẵn, rú lên còn to hơn khen đúng thì học sinh tắt loa. */
const CAN = [
  { ra: "dung.wav", tep: "ding.wav", dai: 0.60, to: 0.85 },
  { ra: "sai.wav", tep: "wrong.wav", dai: 0.55, to: 0.55 },
  { ra: "cham.wav", tep: "click.wav", dai: 0.12, to: 0.40 },
];

/* --------------------------- đọc / ghi WAV --------------------------- */
function docWav(duong) {
  const b = fs.readFileSync(duong);
  if (b.toString("latin1", 0, 4) !== "RIFF" || b.toString("latin1", 8, 12) !== "WAVE") {
    throw new Error("không phải tệp WAV: " + duong);
  }
  let i = 12, fmt = null, data = null;
  while (i + 8 <= b.length) {
    const id = b.toString("latin1", i, i + 4);
    const n = b.readUInt32LE(i + 4);
    if (id === "fmt ") fmt = { kenh: b.readUInt16LE(i + 10), sr: b.readUInt32LE(i + 12), bit: b.readUInt16LE(i + 22) };
    else if (id === "data") data = b.subarray(i + 8, i + 8 + n);
    i += 8 + n + (n % 2);          // các khối luôn căn theo số chẵn byte
  }
  if (!fmt || !data) throw new Error("thiếu khối fmt/data: " + duong);
  if (fmt.bit !== 16) throw new Error("chỉ đọc được WAV 16 bit, tệp này " + fmt.bit + " bit");

  /* Về dạng số thực -1..1, gộp các kênh thành một (tiếng hiệu ứng không cần nổi). */
  const soMau = Math.floor(data.length / 2 / fmt.kenh);
  const x = new Float32Array(soMau);
  for (let k = 0; k < soMau; k++) {
    let t = 0;
    for (let c = 0; c < fmt.kenh; c++) t += data.readInt16LE((k * fmt.kenh + c) * 2) / 32768;
    x[k] = t / fmt.kenh;
  }
  return { x, sr: fmt.sr };
}

function ghiWav(duong, x, sr) {
  const b = Buffer.alloc(44 + x.length * 2);
  b.write("RIFF", 0, "latin1"); b.writeUInt32LE(36 + x.length * 2, 4); b.write("WAVE", 8, "latin1");
  b.write("fmt ", 12, "latin1"); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);          // PCM, 1 kênh
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28);
  b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write("data", 36, "latin1"); b.writeUInt32LE(x.length * 2, 40);
  for (let i = 0; i < x.length; i++) {
    const v = Math.max(-1, Math.min(1, x[i]));
    b.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(duong, b);
  return b.length;
}

/* ------------------------------ xử lý ------------------------------ */
const dinh = (x) => x.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1e-9;

/* Bỏ khoảng lặng đầu tệp. Gói nguồn dựng cho video nên hay chừa vài chục mili
   giây trống ở đầu — để nguyên thì tiếng phát ra trễ hơn cái bấm, cảm giác
   như máy giật. */
function catDau(x, nguong) {
  const d = dinh(x) * nguong;
  let i = 0;
  while (i < x.length && Math.abs(x[i]) < d) i++;
  return x.subarray(Math.max(0, i - Math.round(0.003 * 44100)));   // lùi 3ms cho khỏi cụt đầu
}

/* Hạ 2 lần tần số lấy mẫu. Phải lọc trước rồi mới bỏ bớt mẫu: bỏ thẳng thì
   phần tần số cao gập xuống thành tiếng rè kim loại (aliasing). */
function ha2Lan(x) {
  const y = new Float32Array(Math.floor(x.length / 2));
  for (let i = 0; i < y.length; i++) {
    const k = i * 2;
    const a = x[k - 1] || 0, b = x[k], c = x[k + 1] || 0;
    y[i] = 0.25 * a + 0.5 * b + 0.25 * c;
  }
  return y;
}

function vuot(x, sr, vaoMs, raMs) {
  const v = Math.round((vaoMs / 1000) * sr), r = Math.round((raMs / 1000) * sr);
  for (let i = 0; i < v && i < x.length; i++) x[i] *= i / v;
  for (let i = 0; i < r && i < x.length; i++) {
    const j = x.length - 1 - i;
    x[j] *= (i / r) ** 0.7;      // hơi cong xuống, nghe mượt hơn tắt tuyến tính
  }
  return x;
}

/* ------------------------------ chạy ------------------------------ */
if (!fs.existsSync(NGUON)) {
  console.error("Không thấy thư mục nguồn: " + NGUON);
  console.error("Truyền đường dẫn khác: node scripts/am-thanh.js <thư-mục-sfx>");
  console.error("Tệp kết quả đã có sẵn trong public/asset/am/ nên không chạy lại cũng không sao.");
  process.exit(1);
}
fs.mkdirSync(DICH, { recursive: true });

let tong = 0;
for (const c of CAN) {
  const goc = docWav(path.join(NGUON, c.tep));
  let x = catDau(goc.x, 0.02);
  x = x.subarray(0, Math.round(c.dai * goc.sr));

  /* Hạ tần số bằng cách chia đôi nhiều lần cho tới khi chạm mức mong muốn —
     nguồn 44,1kHz nên đúng một lần là về 22,05kHz. */
  let sr = goc.sr;
  while (sr / 2 >= SR_RA) { x = ha2Lan(x); sr = sr / 2; }

  x = Float32Array.from(x);                     // tách khỏi bộ đệm gốc để sửa tại chỗ
  const he = c.to / dinh(x);
  for (let i = 0; i < x.length; i++) x[i] *= he;
  vuot(x, sr, 2, 45);

  const n = ghiWav(path.join(DICH, c.ra), x, sr);
  tong += n;
  console.log("  " + c.ra.padEnd(10) + (x.length / sr).toFixed(2) + "s  " + sr + "Hz  " +
    Math.round(n / 1024) + " KB   (từ " + c.tep + ", " + (goc.x.length / goc.sr).toFixed(2) + "s)");
}
console.log("Tổng " + Math.round(tong / 1024) + " KB vào public/asset/am/");
