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
  /* Đếm theo DANH SÁCH thật thay vì một con số ma: thêm trang tĩnh mới là test
     tự đúng, không phải đi sửa số. */
  const trangTinh = ["/", "/bai", "/doi-chieu-sgk", "/landing.html", "/nang-cap.html", "/quyen-rieng-tu.html"];
  trangTinh.forEach((p) => assert.ok(s.body.includes("<loc>http") && s.body.includes(p), "sitemap thiếu " + p));
  const soUrl = (s.body.match(/<loc>/g) || []).length;
  assert.equal(soUrl, ds.length + trangTinh.length);
  ds.forEach((m) => assert.ok(s.body.includes("/bai/" + m.slug), "sitemap thiếu " + m.slug));

  const loc = [...s.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.equal(loc.length, new Set(loc).size, "sitemap có URL trùng nhau");

  /* lastmod là thẻ DUY NHẤT Google còn dùng (priority và changefreq bị bỏ qua).
     Thiếu hoặc sai định dạng thì mất tín hiệu cập nhật mà không ai nhận ra, vì
     trang vẫn hiện bình thường — nên phải có test canh. */
  const urls = [...s.body.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);
  assert.equal(urls.length, soUrl, "mỗi <url> phải có đúng một <loc>");
  urls.forEach((u) => {
    const lm = (u.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1];
    assert.ok(lm, "thiếu lastmod: " + (u.match(/<loc>(.*?)<\/loc>/) || [])[1]);
    assert.match(lm, /^\d{4}-\d{2}-\d{2}$/, "lastmod sai định dạng: " + lm);
  });

  const rb = await lay("/robots.txt");
  assert.equal(rb.status, 200);
  assert.match(rb.body, /Disallow: \/admin\.html/);
  assert.match(rb.body, /Disallow: \/api\//);
  assert.match(rb.body, /Sitemap: http/);
});

test("đối chiếu SGK: đủ mọi quyển, mỗi bài sách trỏ đúng một bài app", async () => {
  const { kho, theoId } = chiMuc();
  assert.ok(kho.SGK_MAP && Array.isArray(kho.SGK_MAP.bo), "phải nạp được bảng đối chiếu SGK");
  const r = await lay("/doi-chieu-sgk");
  assert.equal(r.status, 200);
  assert.match(r.body, /Kết nối tri thức/);

  let soBai = 0, soCoDich = 0;
  kho.SGK_MAP.bo.forEach((bo) => (bo.sach || []).forEach((s) => {
    assert.ok(r.body.includes('id="' + s.ma + '"'), "thiếu mục cho quyển " + s.ma);
    (s.bai || []).forEach((b) => {
      soBai++;
      if (!b.cua) return;
      soCoDich++;
      const muc = theoId.get(b.cua);
      assert.ok(muc, "bài SGK trỏ tới id không tồn tại: " + b.cua);
      assert.ok(r.body.includes('href="/bai/' + muc.slug + '"'), "thiếu liên kết tới " + b.cua);
    });
  }));
  assert.equal(soBai, 95);
  assert.equal(soCoDich, 95, "mọi bài SGK đều phải có đích");

  /* Không được dùng <table> nữa — ba cột chữ dài luôn tràn ngang, phải cuộn. */
  assert.ok(!/<table/.test(r.body), "trang đối chiếu không được dùng bảng");
  /* Ô lọc là thứ giúp khỏi cuộn qua 95 dòng: phải có ô nhập và dữ liệu để lọc. */
  assert.ok(r.body.includes('id="dcTim"'), "thiếu ô tìm nhanh");
  assert.equal((r.body.match(/data-tim="/g) || []).length, 95, "mỗi hàng phải có khoá tìm không dấu");
});

test("mới có một bộ sách thì gom về một URL duy nhất", async () => {
  const { kho } = chiMuc();
  const soBo = kho.SGK_MAP.bo.length;
  const r = await lay("/doi-chieu-sgk/kntt");
  if (soBo <= 1) {
    assert.equal(r.status, 301, "một bộ -> dồn về /doi-chieu-sgk, tránh hai URL trùng nội dung");
    assert.equal(r.loc, "/doi-chieu-sgk");
  } else {
    assert.equal(r.status, 200);
    assert.match(r.body, /dc-bo/, "nhiều bộ thì phải có thanh chọn bộ sách");
  }
});

test("trang bài có khối đối chiếu SGK, và KHÔNG gắn nhãn sai cho bài chưa map", async () => {
  const { theoId } = chiMuc();
  const coMap = await lay("/bai/" + theoId.get("C10-01").slug);
  assert.match(coMap.body, /Tương ứng sách giáo khoa/);
  assert.match(coMap.body, /Bài 1\. Thông tin và xử lí thông tin/);

  /* C11-10 là nửa sau của một bài SGK bị tách đôi -> không có trong bảng.
     Tuyệt đối không được hiện chữ nào ám chỉ "ngoài chương trình". */
  const khongMap = await lay("/bai/" + theoId.get("C11-10").slug);
  assert.equal(khongMap.status, 200);
  assert.ok(!/Tương ứng sách giáo khoa/.test(khongMap.body));
  assert.ok(!/ngoài SGK|ngoài chương trình|không thuộc/i.test(khongMap.body));
});

test("sitemap có trang đối chiếu SGK", async () => {
  const s = await lay("/sitemap.xml");
  assert.ok(s.body.includes("/doi-chieu-sgk"));
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
