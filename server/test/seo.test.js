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

test("bố cục URL: / là trang giới thiệu, /hoc là ứng dụng", async () => {
  const goc = await lay("/");
  assert.equal(goc.status, 200);
  assert.ok(goc.body.includes("Ôn thi Tin học tốt nghiệp"), "/ phải là trang giới thiệu");
  assert.ok(goc.body.includes('rel="canonical"'), "/ phải có canonical");
  assert.ok(!/name="robots"[^>]*noindex/.test(goc.body), "/ KHÔNG được noindex");

  const hoc = await lay("/hoc");
  assert.equal(hoc.status, 200);
  assert.ok(hoc.body.includes('id="app"'), "/hoc phải là vỏ ứng dụng");
  /* Vỏ ứng dụng không có nội dung cho Google: để index sẽ thành trang mỏng
     tranh chỗ với chính trang giới thiệu ở "/". */
  assert.match(hoc.body, /name="robots"[^>]*noindex/, "/hoc phải noindex");
});

test("URL cũ chuyển 301 để link đã chia sẻ không chết", async () => {
  const mong = { "/landing.html": "/", "/landing": "/", "/index.html": "/hoc",
    "/nang-cap.html": "/nang-cap", "/quyen-rieng-tu.html": "/quyen-rieng-tu" };
  for (const [cu, moi] of Object.entries(mong)) {
    const r = await lay(cu);
    assert.equal(r.status, 301, cu + " phải trả 301");
    assert.equal(r.loc, moi, cu + " phải trỏ tới " + moi);
  }
});

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
  assert.ok(r.body.includes('href="/hoc#/lesson/C12-16"'), "phải có lối vào ứng dụng");
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
  /* "/" là trang giới thiệu; "/hoc" (vỏ ứng dụng) CỐ Ý không nằm trong sitemap
     vì nó noindex — nội dung của nó do JS dựng, Google đọc ra trang trống. */
  const trangTinh = ["/", "/bai", "/doi-chieu-sgk", "/nang-cap", "/quyen-rieng-tu"];
  trangTinh.forEach((p) => assert.ok(s.body.includes("<loc>http") && s.body.includes(p), "sitemap thiếu " + p));
  /* Từ bộ sách thứ hai trở đi, mỗi bộ có thêm một trang đối chiếu riêng. */
  const bo = (chiMuc().kho.SGK_MAP || {}).bo || [];
  const soTrangBo = bo.length > 1 ? bo.length : 0;
  if (soTrangBo) bo.forEach((b) => assert.ok(s.body.includes("/doi-chieu-sgk/" + b.ma), "sitemap thiếu bộ " + b.ma));
  const soUrl = (s.body.match(/<loc>/g) || []).length;
  assert.equal(soUrl, ds.length + trangTinh.length + soTrangBo);
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
  const nhieuBo = kho.SGK_MAP.bo.length > 1;
  const r = await lay("/doi-chieu-sgk");
  assert.equal(r.status, 200);
  assert.match(r.body, /Kết nối tri thức/);

  let soBai = 0, soCoDich = 0;
  for (const bo of kho.SGK_MAP.bo) {
    /* Nhiều bộ thì mỗi bộ một trang riêng; một bộ thì tất cả nằm ở /doi-chieu-sgk */
    const t = nhieuBo ? await lay("/doi-chieu-sgk/" + bo.ma) : r;
    assert.equal(t.status, 200, "không mở được trang bộ " + bo.ma);
    /* Ô lọc là thứ giúp khỏi cuộn qua cả trăm dòng: mỗi hàng phải có khoá tìm. */
    const soBaiBo = (bo.sach || []).reduce((n, s) => n + (s.bai || []).length, 0);
    assert.equal((t.body.match(/data-tim="/g) || []).length, soBaiBo,
      "bộ " + bo.ma + ": số khoá tìm không khớp số bài");
    for (const s of bo.sach || []) {
      assert.ok(t.body.includes('id="' + s.ma + '"'), "thiếu mục cho quyển " + s.ma);
      for (const b of s.bai || []) {
        soBai++;
        if (!b.cua) continue;
        soCoDich++;
        const muc = theoId.get(b.cua);
        assert.ok(muc, "bài SGK trỏ tới id không tồn tại: " + b.cua);
        assert.ok(t.body.includes('href="/bai/' + muc.slug + '"'), "thiếu liên kết tới " + b.cua);
        /* Bộ đánh số theo chủ đề thì PHẢI hiện mã chủ đề, không thì hai bài
           khác nhau cùng hiện "Bài 1" — người tra không phân biệt được. */
        /* Mỗi bộ đánh số một kiểu — trang phải hiện ĐÚNG kiểu của sách đó, vì
           đây là thứ người tra dùng để đối chiếu với quyển đang cầm trên tay. */
        if (b.maBai) {
          assert.ok(t.body.includes("Bài " + b.maBai),
            "thiếu mã bài kiểu Chân trời: " + s.ma + " → Bài " + b.maBai);
          /* Gõ lại đúng cái vừa nhìn thấy phải ra kết quả: mã bài in trên hàng
             cũng phải nằm trong khoá tìm, không thì gõ "E7" lại báo 0 bài. */
          assert.ok(t.body.includes('data-tim="' + b.maBai.toLowerCase() + ' '),
            "mã bài không nằm trong khoá tìm: " + s.ma + " → " + b.maBai);
        } else if (b.chuDe) {
          /* Bài không đánh số trong sách (chủ đề chỉ có một bài) thì chỉ hiện
             "Chủ đề D" — không được bịa thêm "Bài 1". */
          const mong = "Chủ đề " + b.chuDe + (b.so != null ? " · Bài " + b.so : "");
          assert.ok(t.body.includes(mong), "thiếu/sai nhãn chủ đề: " + s.ma + " → " + mong);
        }
      }
    }
  }
  assert.equal(soBai, soCoDich, "mọi bài SGK trong bảng đều phải trỏ tới một bài của app");
  assert.ok(soBai >= 154, "hụt bài so với các quyển đã đối chiếu, hiện " + soBai);

  /* Không được dùng <table> nữa — ba cột chữ dài luôn tràn ngang, phải cuộn.
     Chỉ soi phần THÂN trang: chuỗi "<table" còn nằm trong chú thích của CSS
     nội tuyến, bắt cả tệp là báo động giả. */
  const than = r.body.slice(r.body.lastIndexOf("</style>"));
  assert.ok(!/<table/.test(than), "trang đối chiếu không được dùng bảng");
  /* Ô lọc là thứ giúp khỏi cuộn qua 95 dòng: phải có ô nhập và dữ liệu để lọc. */
  assert.ok(r.body.includes('id="dcTim"'), "thiếu ô tìm nhanh");
  /* Bộ lọc ẩn hàng bằng thuộc tính `hidden`, nhưng .dc-hang có display:grid của
     tác giả — thắng luật [hidden] mặc định của trình duyệt. Thiếu quy tắc đè
     này thì ô lọc vẫn đếm "1 bài khớp" mà cả 33 dòng còn nguyên trên màn hình,
     và không test nào khác bắt được vì HTML sinh ra vẫn đúng. */
  assert.ok(/\.dc-hang\[hidden\][^{]*\{[^}]*display:\s*none/.test(r.body),
    "thiếu quy tắc CSS ẩn hàng bị lọc — ô lọc sẽ không ẩn được gì");

  /* Hai quyển cùng lớp của KNTT dùng chung phần lõi — bài lõi phải trỏ về CÙNG
     một bài của app ở cả hai quyển, nếu lệch là đối chiếu sai một bên. */
  const bo = kho.SGK_MAP.bo[0];
  const kh11 = bo.sach.find((s) => s.ma === "tin-hoc-11-khmt");
  const ict11 = bo.sach.find((s) => s.ma === "tin-hoc-11-ict");
  if (kh11 && ict11) {
    for (let so = 1; so <= 16; so++) {
      const a = kh11.bai.find((b) => b.so === so), c = ict11.bai.find((b) => b.so === so);
      assert.equal(c.cua, a.cua, "Bài " + so + " lõi lớp 11 trỏ lệch giữa hai quyển");
      /* Tên so sau khi chuẩn hoá gạch ngang/hoa thường: hai quyển được chép ở
         hai thời điểm khác nhau, lệch kiểu gõ dấu là chuyện thường và không
         đáng làm hỏng build — lệch THẬT về nội dung thì vẫn bị bắt. */
      const chuan = (s) => s.toLowerCase().replace(/[–—-]/g, "-").replace(/\s+/g, " ").trim();
      assert.equal(chuan(c.ten), chuan(a.ten), "Bài " + so + " lõi lớp 11 tên lệch giữa hai quyển");
    }
  }

  /* Chân trời lớp 12 cũng dùng chung phần lõi, nhưng quyển Ứng dụng chèn thêm
     chủ đề E vào giữa nên MỌI BÀI LÕI PHÍA SAU LỆCH TRANG. Chép cả dòng từ
     quyển kia là học sinh giở đúng số trang mà không thấy bài — nên vừa kiểm
     đích phải trùng, vừa kiểm số trang phải khác. */
  const ct = kho.SGK_MAP.bo.find((x) => x.ma === "chan-troi-sang-tao");
  const ctKh = ct && ct.sach.find((s) => s.ma === "ctst-tin-hoc-12-khmt");
  const ctIct = ct && ct.sach.find((s) => s.ma === "ctst-tin-hoc-12-ict");
  if (ctKh && ctIct) {
    let soLech = 0;
    for (const c of ctIct.bai) {
      const a = ctKh.bai.find((b) => b.maBai === c.maBai);
      if (!a) continue; /* A3, A4 và cả chủ đề E là bài riêng của quyển Ứng dụng */
      assert.equal(c.cua, a.cua, "Bài " + c.maBai + " lõi CTST 12 trỏ lệch giữa hai quyển");
      if (c.trang !== a.trang) soLech++;
    }
    assert.ok(soLech >= 10,
      "bài lõi CTST 12 đang trùng số trang với quyển kia — nhiều khả năng chép nhầm cả dòng");
  }
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

  /* Bài nào chưa có trong bảng đối chiếu (thường là nửa sau của một bài SGK bị
     tách đôi) thì tuyệt đối không được hiện chữ nào ám chỉ "ngoài chương trình".
     Tìm ĐỘNG một bài như vậy — càng thêm sách thì danh sách này càng đổi, ghi
     cứng một mã bài là test tự hỏng sau mỗi lần bổ sung sách. */
  const daMap = new Set();
  (chiMuc().kho.SGK_MAP.bo || []).forEach((b) => (b.sach || []).forEach((s) =>
    (s.bai || []).forEach((x) => x.cua && daMap.add(x.cua))));
  const chuaMap = chiMuc().ds.find((m) => !daMap.has(m.bai.id));
  assert.ok(chuaMap, "không còn bài nào chưa đối chiếu — cập nhật lại test này");
  const khongMap = await lay("/bai/" + chuaMap.slug);
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
