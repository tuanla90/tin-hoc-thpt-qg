/* Test vòng THỬ LẠI khi nhà cung cấp AI nghẽn (server/ai/index.js).
 * Dùng nhà cung cấp giả với AI_MOCK_LOI để ép lỗi, AI_RETRY_MS nhỏ cho chạy nhanh.
 * Chạy: npm test
 */
const { test, beforeEach } = require("node:test");
const assert = require("node:assert");

process.env.AI_PROVIDER = "mock";
process.env.AI_RETRY_MS = "5,5";      // hai lần thử lại, gần như không chờ

const { aiChat, nenThuLai, nhipCho } = require("../ai");
const mock = require("../ai/mock");
const { doiLaiMs } = require("../ai/sse");

function goi(opts) {
  let ra = "";
  const p = aiChat(Object.assign({
    system: "BÀI ĐANG HỌC: Thử nghiệm",
    messages: [{ role: "user", content: "Bit là gì?" }],
    onText(t) { ra += t; },
  }, opts));
  return p.then(() => ra, (e) => { e.chuDaChay = ra; throw e; });
}

/* Đặt lại môi trường trước MỖI test — để một test hỏng không kéo theo test sau
   (nhịp chờ và bộ đếm là biến toàn cục của tiến trình). */
beforeEach(() => {
  mock.datLai();
  delete process.env.AI_MOCK_LOI;
  process.env.AI_RETRY_MS = "5,5";
});

/* ----------------------------- phần thuần hàm ----------------------------- */

test("chỉ thử lại lỗi tạm thời, không thử lại lỗi cấu hình", () => {
  assert.equal(nenThuLai({ status: 429 }), true, "nghẽn hạn mức");
  assert.equal(nenThuLai({ status: 500 }), true, "sự cố nhà cung cấp");
  assert.equal(nenThuLai({ status: 503 }), true);
  assert.equal(nenThuLai({}), true, "rớt mạng: fetch ném không kèm status");

  assert.equal(nenThuLai({ status: 400 }), false, "gọi sai -> thử lại vô ích");
  assert.equal(nenThuLai({ status: 401 }), false, "sai khoá");
  assert.equal(nenThuLai({ status: 403 }), false);
  assert.equal(nenThuLai({ status: 404 }), false, "sai tên model");
  assert.equal(nenThuLai({ name: "AbortError" }), false, "người học tự dừng");
  assert.equal(nenThuLai(null), false);
});

test("đọc lời dặn chờ của nhà cung cấp: header retry-after và retryDelay của Gemini", () => {
  const res = (v) => ({ headers: { get: (k) => (k === "retry-after" ? v : null) } });
  assert.equal(doiLaiMs(res("3"), ""), 3000);
  assert.equal(doiLaiMs(res(null), '{"error":{"details":[{"retryDelay":"7s"}]}}'), 7000);
  assert.equal(doiLaiMs(res(null), '{"error":{"details":[{"retryDelay":"1.5s"}]}}'), 1500);
  assert.equal(doiLaiMs(res(null), "không có gì"), 0);
  assert.equal(doiLaiMs(null, ""), 0);
});

test("nhịp chờ đọc từ AI_RETRY_MS, để rỗng là tắt thử lại", () => {
  process.env.AI_RETRY_MS = "1000,2500";
  assert.deepEqual(nhipCho(), [1000, 2500]);
  process.env.AI_RETRY_MS = "";
  assert.deepEqual(nhipCho(), [], "rỗng nghĩa là KHÔNG thử lại, không phải chờ 0ms");
  process.env.AI_RETRY_MS = " 800 , x , 1600 ";
  assert.deepEqual(nhipCho(), [800, 1600], "bỏ qua mẩu vô nghĩa, không sinh NaN");
});

test("tắt thử lại (AI_RETRY_MS rỗng) thì hỏng phát nào biết ngay phát đó", async () => {
  process.env.AI_RETRY_MS = "";
  process.env.AI_MOCK_LOI = "429:9";
  await assert.rejects(goi(), (e) => e.status === 429);
  assert.equal(mock.soLanGoi(), 1);
});

/* -------------------------------- qua aiChat ------------------------------ */

test("nghẽn 429 hai lần rồi thông: học sinh vẫn nhận được câu trả lời", async () => {
  process.env.AI_MOCK_LOI = "429:2";
  const ra = await goi();
  assert.match(ra, /Bản chạy thử/, "lượt thứ ba phải trả lời được");
  assert.equal(mock.soLanGoi(), 3, "gọi 1 lần đầu + 2 lần thử lại");
});

test("sai khoá (401) thì hỏng ngay, KHÔNG phí thời gian thử lại", async () => {
  process.env.AI_MOCK_LOI = "401:5";
  await assert.rejects(goi(), (e) => e.status === 401);
  assert.equal(mock.soLanGoi(), 1);
});

test("nghẽn kéo dài quá số nhịp thì chịu thua, ném lỗi cuối cùng", async () => {
  process.env.AI_MOCK_LOI = "429:9";
  await assert.rejects(goi(), (e) => e.status === 429);
  assert.equal(mock.soLanGoi(), 3, "1 lần đầu + đúng 2 nhịp thử lại rồi dừng");
});

test("ĐÃ chảy chữ rồi thì không gọi lại — tránh câu trả lời lặp nửa chừng", async () => {
  /* Nhà cung cấp đẩy được vài chữ mới hỏng: thử lại sẽ khiến học sinh thấy đoạn
     đầu hai lần, nên aiChat phải ném thẳng lỗi. */
  const nhaHong = {
    soLan: 0,
    chat({ onText }) {
      nhaHong.soLan++;
      onText("Câu trả lời đang chảy");
      const e = new Error("rớt giữa chừng");
      e.status = 500;
      return Promise.reject(e);
    },
  };
  const cu = require("../ai/mock").chat;
  require("../ai/mock").chat = nhaHong.chat;
  try {
    await assert.rejects(goi(), (e) => {
      assert.equal(e.chuDaChay, "Câu trả lời đang chảy", "chữ đã chảy vẫn giữ nguyên, không nhân đôi");
      return e.status === 500;
    });
    assert.equal(nhaHong.soLan, 1, "chỉ gọi đúng một lần");
  } finally {
    require("../ai/mock").chat = cu;
  }
});

test("người học đóng bảng chat giữa nhịp chờ thì dừng ngay", async () => {
  process.env.AI_MOCK_LOI = "429:9";
  process.env.AI_RETRY_MS = "3000";      // nhịp chờ dài để kịp bấm huỷ
  const ctl = new AbortController();
  const p = goi({ signal: ctl.signal });
  setTimeout(() => ctl.abort(), 20);
  const t0 = Date.now();
  await assert.rejects(p, (e) => e.name === "AbortError");
  assert.ok(Date.now() - t0 < 1500, "phải thoát ngay, không chờ hết 3 giây");
});
