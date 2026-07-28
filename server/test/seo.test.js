/* Test trang công khai cho Google. Không cần DB (pool = null) — đây là phần
 * duy nhất của máy chủ chạy được cả khi Postgres chưa nối.
 * Chạy: npm test
 */
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const session = require("express-session");
const { createApp } = require("../app");
const { chiMuc, SO_MC_MAU, SO_TF_MAU } = require("../seo");

let srv, base;

function lay(path) {
  return fetch(base + path, { redirect: "manual" }).then(async (res) => ({
    status: res.status,
    loc: res.headers.get("location"),
    kieu: res.headers.get("content-type") || "",
    body: await res.text(),
  }));
}

before(() => {
  const app = createApp({ pool: null, sessionStore: new session.MemoryStore() });
  srv = app.listen(0);
  base = "http://127.0.0.1:" + srv.address().port;
});

after(() => srv && srv.close());

test("trang danh sách liệt kê đủ mọi bài học", async () => {
  const { ds } = chiMuc();
  const r = await lay("/bai");
  assert.equal(r.status, 200);
  assert.match(r.kieu, /text\/html/);
  assert.equal(ds.length, 119);
  // mỗi bài đúng một liên kết
  ds.forEach((m) => assert.ok(r.body.includes('href="/bai/' + m.slug + '"'), "thiếu liên kết " + m.slug));
  assert.match(r.body, /<title>[^<]*119 bài/);
  assert.match(r.body, /Tin học 12 — Khoa học máy tính/);
});

test("trang một bài có đủ phần cần cho SEO", async () => {
  const { theoId } = chiMuc();
  const m = theoId.get("C12-16");
  const r = await lay("/bai/" + m.slug);
  assert.equal(r.status, 200);
  assert.match(r.body, /<h1>Bài \d+\. /);
  assert.ok(r.body.includes("<title>"), "phải có title");
  assert.ok(r.body.includes('rel="canonical"'), "phải có canonical");
  assert.ok(r.body.includes('name="description"'), "phải có meta description");
  assert.ok(r.body.includes('property="og:title"'), "phải có Open Graph");
  assert.ok(r.body.includes("application/ld+json"), "phải có dữ liệu có cấu trúc");
  assert.match(r.body, /Tóm tắt lý thuyết cần nhớ/);
  assert.match(r.body, /Đáp án: [A-D]/);
  assert.match(r.body, /Thuật ngữ tiếng Anh/);
  assert.ok(r.body.includes('href="/#/lesson/C12-16"'), "phải có lối vào ứng dụng");
  assert.ok(!r.body.includes("<script src"), "trang public không nạp JS của app");
});

test("chỉ mở vài câu mẫu, KHÔNG mở câu Vận dụng", async () => {
  const { ds, theoId } = chiMuc();
  const dem = (s, mau) => (s.match(new RegExp(mau, "g")) || []).length;
  for (const id of ["C10-01", "C11-05", "C12-16", "U11-03"]) {
    const m = theoId.get(id);
    if (!m) continue;
    const r = await lay("/bai/" + m.slug);
    assert.equal(r.status, 200, id);
    const soCau = dem(r.body, '<div class="q">');
    assert.ok(soCau <= SO_MC_MAU + SO_TF_MAU, id + ": lộ " + soCau + " câu, quá mức cho phép");
    assert.ok(!r.body.includes("· Vận dụng"), id + ": không được lộ câu mức Vận dụng");
  }
  assert.equal(ds.length, 119);
});

test("gọi bằng mã bài thì chuyển hẳn sang URL chuẩn (tránh trùng nội dung)", async () => {
  const { theoId } = chiMuc();
  const r = await lay("/bai/C12-16");
  assert.equal(r.status, 301);
  assert.equal(r.loc, "/bai/" + theoId.get("C12-16").slug);
});

test("đường dẫn sai trả 404 kèm lối quay lại", async () => {
  const r = await lay("/bai/khong-he-co-bai-nay");
  assert.equal(r.status, 404);
  assert.match(r.body, /Không tìm thấy bài học/);
  assert.ok(r.body.includes('href="/bai"'));
});

test("sitemap liệt kê mọi bài, robots chặn trang quản trị", async () => {
  const { ds } = chiMuc();
  const s = await lay("/sitemap.xml");
  assert.equal(s.status, 200);
  assert.match(s.kieu, /xml/);
  const soUrl = (s.body.match(/<loc>/g) || []).length;
  assert.equal(soUrl, ds.length + 4); // 119 bài + trang chủ + /bai + landing + nâng cấp
  ds.forEach((m) => assert.ok(s.body.includes("/bai/" + m.slug), "sitemap thiếu " + m.slug));

  const rb = await lay("/robots.txt");
  assert.equal(rb.status, 200);
  assert.match(rb.body, /Disallow: \/admin\.html/);
  assert.match(rb.body, /Disallow: \/api\//);
  assert.match(rb.body, /Sitemap: http/);
});

test("slug không trùng nhau và không có ký tự lạ", () => {
  const { ds } = chiMuc();
  const set = new Set(ds.map((m) => m.slug));
  assert.equal(set.size, ds.length, "slug bị trùng");
  ds.forEach((m) => {
    assert.match(m.slug, /^[a-z0-9-]+$/, "slug có ký tự lạ: " + m.slug);
    assert.ok(m.slug.length < 110, "slug quá dài: " + m.slug);
  });
});
