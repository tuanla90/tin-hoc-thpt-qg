/* Canh danh sách màn được vẽ lại sau khi đồng bộ tiến độ (VE_LAI_SAU_DONG_BO
 * trong public/js/app.js).
 *
 * Bối cảnh: người dùng báo "đăng nhập mà không nhớ lịch sử học". Thật ra tiến độ
 * tải về đủ, nhưng sau khi đồng bộ app chỉ vẽ lại hai màn "home" và "history" —
 * ai đăng nhập trên máy mới rồi mở thẳng bản đồ lộ trình sẽ thấy 0/34 bài.
 *
 * Test này canh hai chiều:
 *   - "lessons" PHẢI có, không thì lỗi cũ quay lại y nguyên.
 *   - Các màn giữ dữ liệu người học tự gõ (bài học, ba phòng code, bài làm đang
 *     dở) KHÔNG được có: vẽ lại là xoá sạch code hoặc câu trả lời của các em.
 * Chạy: npm test
 */
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const APP = path.join(__dirname, "..", "..", "public", "js", "app.js");

/* Đọc bằng cách tách chữ chứ không nạp app.js: tệp đó cần DOM, nạp trong node là
   vỡ ngay. Chỉ cần biết trong ngoặc [] có những tên màn nào. */
function docDanhSach() {
  const src = fs.readFileSync(APP, "utf8");
  const m = /const\s+VE_LAI_SAU_DONG_BO\s*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(src);
  assert.ok(m, "Không tìm thấy VE_LAI_SAU_DONG_BO trong public/js/app.js");
  return m[1].match(/"([a-zA-Z]+)"/g).map((x) => x.replace(/"/g, ""));
}

test("màn đọc tiến độ phải được vẽ lại sau khi đồng bộ", () => {
  const ds = docDanhSach();
  for (const v of ["home", "history", "lessons"]) {
    assert.ok(ds.includes(v), `thiếu "${v}" — đăng nhập trên máy mới sẽ thấy tiến độ bằng 0`);
  }
});

test("màn đang giữ bài làm / code của người học thì KHÔNG vẽ lại", () => {
  const ds = docDanhSach();
  const giuDuLieu = ["lesson", "playground", "sqlLab", "gfxLab", "quiz", "result"];
  const viPham = giuDuLieu.filter((v) => ds.includes(v));
  assert.deepEqual(viPham, [], `vẽ lại ${viPham.join(", ")} sẽ xoá code hoặc câu trả lời đang làm dở`);
});

test("chỉ khai tên màn có thật trong bảng điều hướng", () => {
  const src = fs.readFileSync(APP, "utf8");
  const m = /const map = \{([\s\S]*?)\};/.exec(src);
  assert.ok(m, "Không tìm thấy bảng view -> hàm render trong viewRenderer");
  const coThat = new Set(m[1].match(/(\w+):/g).map((x) => x.replace(":", "")));
  const la = docDanhSach().filter((v) => !coThat.has(v));
  assert.deepEqual(la, [], `tên màn không có trong bảng điều hướng: ${la.join(", ")}`);
});
