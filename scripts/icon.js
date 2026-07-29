/* ============================================================================
 *  SINH ICON PWA TỪ LOGO  —  node scripts/icon.js
 *
 *  Vì sao tự vẽ thay vì xuất từ phần mềm đồ hoạ: logo (public/asset/favicon.svg)
 *  chỉ gồm một khung bo góc và ba nét bo tròn, mô tả bằng vài dòng toán là đủ.
 *  Đổi logo thì sửa NET/MAU dưới đây rồi chạy lại, khỏi phải cài thư viện ảnh
 *  hay nhớ ra đã xuất icon bằng công cụ nào.
 *
 *  Ghi thẳng PNG bằng zlib có sẵn của Node — PNG chỉ là vài khối dữ liệu kèm
 *  CRC32, không cần phụ thuộc ngoài.
 *
 *  BẢN MASKABLE khác bản thường ở hai chỗ, và sai chỗ nào cũng thấy ngay trên
 *  máy thật: nền phải TRÀN KÍN khung (Android cắt icon thành tròn/giọt nước —
 *  góc bo sẵn sẽ lòi nền trắng ra), và hình phải thu vào ~80% giữa khung (vùng
 *  an toàn) kẻo bị cắt mất nét.
 * ==========================================================================*/
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const THU_MUC = path.join(__dirname, "..", "public", "asset", "icon");

/* --- Logo, mô tả trong hệ toạ độ 64x64 y hệt favicon.svg --- */
const MAU_NEN = [0x4f, 0x46, 0xe5];   // chàm thương hiệu
const BO_GOC = 14;                     // bán kính bo, theo khung 64
const NET_RONG = 5.5;
const NET = [
  { mau: [0xff, 0xff, 0xff], diem: [[23, 22], [14, 32], [23, 42]] },  // dấu <
  { mau: [0xff, 0xff, 0xff], diem: [[41, 22], [50, 32], [41, 42]] },  // dấu >
  { mau: [0xfa, 0xcc, 0x15], diem: [[35, 18], [29, 46]] },            // gạch chéo vàng
];

/* Khoảng cách từ điểm tới đoạn thẳng — nét có đầu bo tròn chính là "mọi điểm
   cách đoạn thẳng không quá nửa bề rộng", nên chỗ nối hai đoạn tự bo tròn theo,
   không phải xử lý riêng. */
function cachDoan(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay;
  const len2 = vx * vx + vy * vy;
  let t = len2 ? ((px - ax) * vx + (py - ay) * vy) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = px - (ax + t * vx), dy = py - (ay + t * vy);
  return Math.sqrt(dx * dx + dy * dy);
}

/* Điểm có nằm trong khung bo góc cạnh `canh`, bán kính `r`? */
function trongKhung(x, y, canh, r) {
  if (r <= 0) return x >= 0 && y >= 0 && x < canh && y < canh;
  const dx = Math.max(r - x, 0, x - (canh - r));
  const dy = Math.max(r - y, 0, y - (canh - r));
  return dx * dx + dy * dy <= r * r;
}

/* Vẽ ở độ phân giải gấp KHU lần rồi lấy trung bình -> viền mượt, khỏi cần
   thuật toán khử răng cưa riêng. */
const KHU = 4;

function ve(canh, maskable) {
  const N = canh * KHU;
  const s = N / 64;                       // hệ số từ khung 64 sang điểm ảnh
  const r = maskable ? 0 : BO_GOC * s;    // maskable: nền tràn kín, không bo
  const thu = maskable ? 0.78 : 1;        // maskable: hình thu vào vùng an toàn
  const lech = (64 * (1 - thu)) / 2;
  const nua = (NET_RONG * thu * s) / 2;

  const net = NET.map((n) => ({
    mau: n.mau,
    doan: n.diem.slice(1).map((d, i) => [
      (n.diem[i][0] * thu + lech) * s, (n.diem[i][1] * thu + lech) * s,
      (d[0] * thu + lech) * s, (d[1] * thu + lech) * s,
    ]),
  }));

  /* Ảnh lớn: mỗi điểm ảnh là 4 byte RGBA. */
  const to = Buffer.alloc(N * N * 4);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const px = x + 0.5, py = y + 0.5;
      let mau = null;
      if (trongKhung(px, py, N, r)) {
        mau = MAU_NEN;
        /* Nét vẽ sau đè lên nền; duyệt ngược để nét khai báo sau nằm trên. */
        for (let i = net.length - 1; i >= 0 && mau === MAU_NEN; i--) {
          for (const d of net[i].doan) {
            if (cachDoan(px, py, d[0], d[1], d[2], d[3]) <= nua) { mau = net[i].mau; break; }
          }
        }
      }
      const o = (y * N + x) * 4;
      if (mau) { to[o] = mau[0]; to[o + 1] = mau[1]; to[o + 2] = mau[2]; to[o + 3] = 255; }
    }
  }

  /* Thu nhỏ: trung bình KHUxKHU điểm, nhân sẵn alpha để viền không bị viền đen. */
  const nho = Buffer.alloc(canh * canh * 4);
  for (let y = 0; y < canh; y++) {
    for (let x = 0; x < canh; x++) {
      let R = 0, G = 0, B = 0, A = 0;
      for (let j = 0; j < KHU; j++) {
        for (let i = 0; i < KHU; i++) {
          const o = (((y * KHU + j) * N) + (x * KHU + i)) * 4;
          const a = to[o + 3] / 255;
          R += to[o] * a; G += to[o + 1] * a; B += to[o + 2] * a; A += a;
        }
      }
      const o = (y * canh + x) * 4;
      if (A > 0) { nho[o] = Math.round(R / A); nho[o + 1] = Math.round(G / A); nho[o + 2] = Math.round(B / A); }
      nho[o + 3] = Math.round((A / (KHU * KHU)) * 255);
    }
  }
  return nho;
}

/* --- Đóng gói PNG (RGBA 8 bit, không lọc) --- */
const BANG_CRC = (() => {
  const b = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    b[n] = c;
  }
  return b;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = BANG_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function khoi(ten, data) {
  const dai = Buffer.alloc(4);
  dai.writeUInt32BE(data.length);
  const than = Buffer.concat([Buffer.from(ten, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(than));
  return Buffer.concat([dai, than, crc]);
}
function dongGoiPng(rgba, canh) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(canh, 0); ihdr.writeUInt32BE(canh, 4);
  ihdr[8] = 8; ihdr[9] = 6;                       // 8 bit/kênh, RGBA
  /* Mỗi hàng phải có 1 byte "kiểu lọc" ở đầu; 0 = không lọc. */
  const tho = Buffer.alloc(canh * (canh * 4 + 1));
  for (let y = 0; y < canh; y++) {
    tho[y * (canh * 4 + 1)] = 0;
    rgba.copy(tho, y * (canh * 4 + 1) + 1, y * canh * 4, (y + 1) * canh * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    khoi("IHDR", ihdr),
    khoi("IDAT", zlib.deflateSync(tho, { level: 9 })),
    khoi("IEND", Buffer.alloc(0)),
  ]);
}

const CAN = [
  { ten: "icon-192.png", canh: 192, mask: false },
  { ten: "icon-512.png", canh: 512, mask: false },
  { ten: "icon-maskable-512.png", canh: 512, mask: true },
  /* iOS tự bo góc ảnh này nên nền cũng phải tràn kín như bản maskable. */
  { ten: "apple-touch-icon.png", canh: 180, mask: true },
];

fs.mkdirSync(THU_MUC, { recursive: true });
for (const c of CAN) {
  const png = dongGoiPng(ve(c.canh, c.mask), c.canh);
  fs.writeFileSync(path.join(THU_MUC, c.ten), png);
  console.log("  " + c.ten.padEnd(24) + c.canh + "x" + c.canh + "  " + Math.round(png.length / 1024) + " KB");
}
console.log("Đã sinh " + CAN.length + " icon vào public/asset/icon/");
