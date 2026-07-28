/* ============================================================================
 *  TRANG CÔNG KHAI CHO GOOGLE (SEO)  —  /bai, /bai/<slug>, /sitemap.xml, /robots.txt
 *
 *  VÌ SAO CÓ TỆP NÀY: ứng dụng chính là SPA nằm sau màn đăng nhập, Google không
 *  đọc được chữ nào -> mất sạch kênh tìm kiếm miễn phí. Đối thủ cùng ngách thắng
 *  đúng ở chỗ này: mỗi bài một URL riêng, tiêu đề trùng thứ học sinh gõ Google.
 *
 *  NGUYÊN TẮC:
 *  1. Render THẲNG Ở MÁY CHỦ (không sinh tệp .html) — không thêm bước build, nội
 *     dung luôn khớp với public/js/clean-*.js, sửa bài là trang tự đổi theo.
 *  2. CHO ĐỦ ĐỂ CÓ ÍCH, KHÔNG CHO HẾT: mở đầu + ý chính + từ vựng + vài câu mẫu
 *     mức Nhận biết/Thông hiểu. Câu Vận dụng, phần luyện tập có chấm, thực hành
 *     code và gia sư AI vẫn nằm trong ứng dụng — đó mới là thứ bán được.
 *  3. Trang tự chứa (CSS nội tuyến), không JavaScript, không cookie, không đăng
 *     nhập -> tải nhanh trên 3G và crawler đọc được ngay.
 * ==========================================================================*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const express = require("express");
const { napKho, TEN_CHU_DE } = require("./lessons");

/* Nhãn lớp và từ điển thuật ngữ nằm trong các tệp dữ liệu của trình duyệt.
   lessons.js có trả về nếu đã cập nhật, nhưng tệp đó đang được sửa song song ở
   việc khác — nên ở đây tự lo phần dự phòng để trang công khai không bao giờ
   rơi mất mục Từ vựng chỉ vì một thay đổi ở chỗ khác. */
const NHAN_LOP_DP = {
  20: "Tin học 10",
  21: "Tin học 11 — Khoa học máy tính",
  22: "Tin học 12 — Khoa học máy tính",
  23: "Tin học 11 — Tin học ứng dụng",
  24: "Tin học 12 — Tin học ứng dụng",
};

let TU_DIEN_DP = null;
function tuDien(kho) {
  if (kho.VOCAB_TERMS && Object.keys(kho.VOCAB_TERMS).length) return kho.VOCAB_TERMS;
  if (TU_DIEN_DP) return TU_DIEN_DP;
  TU_DIEN_DP = {};
  try {
    const f = path.join(__dirname, "..", "public", "js", "vocab-terms.js");
    const box = { window: {} };
    vm.runInNewContext(fs.readFileSync(f, "utf8"), box, { timeout: 5000 });
    TU_DIEN_DP = box.VOCAB_TERMS || (box.window && box.window.VOCAB_TERMS) || {};
  } catch (e) {
    console.warn("[seo] Không đọc được từ điển thuật ngữ:", e.message);
  }
  return TU_DIEN_DP;
}

/* Số câu mẫu công khai MỖI BÀI. 3 + 1 ≈ 26% ngân hàng lộ ra, đủ để trang xếp
   hạng với truy vấn "trắc nghiệm ... có đáp án" mà vẫn giữ phần lớn kho câu.
   Chỉ lấy câu mức "easy"/"medium" — câu Vận dụng giữ riêng cho người dùng app. */
const SO_MC_MAU = 3;
const SO_TF_MAU = 1;
const MUC_MAU = ["easy", "medium"];

const TEN_MUC = { easy: "Nhận biết", medium: "Thông hiểu", hard: "Vận dụng" };

/* ------------------------------- tiện ích ------------------------------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function boDau(s) {
  return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D");
}

function slugHoa(s) {
  return boDau(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/* Markdown rút gọn giống fmtInline của app: **đậm** và `mã`. Escape TRƯỚC.
   Luật đậm chặt (không có khoảng trắng sát dấu **) để không bôi đậm nhầm toán tử
   luỹ thừa Python trong lời giải, ví dụ "2 ** 3 = 8". */
function nhan(s) {
  return esc(s)
    .replace(/\*\*(?!\s)([^*\n]+?)(?<!\s)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>");
}

/* Chuỗi nhiều đoạn (ngăn bằng dòng trống) -> nhiều thẻ <p>. */
function doan(s) {
  return String(s || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    .map((p) => "<p>" + nhan(p).replace(/\n/g, "<br>") + "</p>").join("");
}

function cat(s, n) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
}
/* Mô tả cho thẻ meta: bỏ hết đánh dấu markdown, cắt gọn một dòng. */
function moTa(s, n) {
  return cat(String(s || "").replace(/\*\*/g, "").replace(/`/g, ""), n);
}

/* ---------------------------- chỉ mục bài học ---------------------------- */
let CHI_MUC = null;

function chiMuc() {
  if (CHI_MUC) return CHI_MUC;
  const kho = napKho();
  const ds = [...kho.baiTheoId.values()]
    .sort((a, b) => a.stage - b.stage || a.order - b.order);

  const theoSlug = new Map(), theoId = new Map();
  ds.forEach((l, i) => {
    const nhanhUd = l.stage === 23 || l.stage === 24; // nhánh Tin học ứng dụng
    const slug = "tin-hoc-" + l.grade + (nhanhUd ? "-ung-dung" : "") +
      "-bai-" + l.order + "-" + slugHoa(l.title);
    const muc = {
      bai: l, slug,
      lop: (kho.STAGES || {})[l.stage] || NHAN_LOP_DP[l.stage] || "Tin học " + l.grade,
      truoc: null, sau: null, i,
    };
    theoSlug.set(slug, muc);
    theoId.set(l.id, muc);
  });
  /* Bài trước/sau tính trong cùng một lớp để điều hướng không nhảy ngang nhánh */
  const mucs = [...theoSlug.values()];
  mucs.forEach((m, i) => {
    const t = mucs[i - 1], s = mucs[i + 1];
    if (t && t.bai.stage === m.bai.stage) m.truoc = t;
    if (s && s.bai.stage === m.bai.stage) m.sau = s;
  });

  CHI_MUC = { ds: mucs, theoSlug, theoId, kho };
  return CHI_MUC;
}

/* Câu mẫu công khai: lấy theo đúng thứ tự trong bài (ổn định giữa các lần
   render — Google ghét nội dung nhảy múa mỗi lần vào). */
function cauMau(l, kho) {
  const qs = (l.quiz || []).map((id) => kho.cauTheoId.get(id)).filter(Boolean)
    .filter((q) => MUC_MAU.includes(q.level));
  return {
    mc: qs.filter((q) => q.type === "mc").slice(0, SO_MC_MAU),
    tf: qs.filter((q) => q.type === "tf").slice(0, SO_TF_MAU),
  };
}

function tuVung(l, kho) {
  const khoa = (kho.VOCAB || {})[l.id] || [];
  const td = tuDien(kho);
  return khoa.map((k) => (typeof k === "string" ? td[k] : k)).filter((t) => t && t.en && t.vi);
}

/* --------------------------------- CSS --------------------------------- */
const CSS = `
:root{--bg:#f8fafc;--card:#fff;--ink:#0f172a;--soft:#475569;--line:#e2e8f0;
  --pri:#4f46e5;--pri-soft:#eef2ff;--ok:#16a34a;--warn:#b45309}
@media(prefers-color-scheme:dark){:root{--bg:#0f172a;--card:#1e293b;--ink:#e2e8f0;
  --soft:#94a3b8;--line:#334155;--pri:#818cf8;--pri-soft:#1e1b4b}}
*{box-sizing:border-box;margin:0}
body{font:16px/1.7 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);
  color:var(--ink);padding:0 16px 56px}
.wrap{max-width:760px;margin:0 auto}
a{color:var(--pri)}
header.top{display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:14px 0;border-bottom:1px solid var(--line);margin-bottom:20px;flex-wrap:wrap}
header.top b{font-size:15px}
.crumb{font-size:13px;color:var(--soft);margin-bottom:10px}
.crumb a{color:var(--soft)}
.lop{display:inline-block;font-size:12.5px;font-weight:700;color:var(--pri);
  background:var(--pri-soft);border-radius:999px;padding:4px 11px;margin-bottom:10px}
h1{font-size:26px;line-height:1.3;margin-bottom:8px}
h2{font-size:19px;margin:30px 0 10px;padding-top:4px}
h3{font-size:16px;margin:18px 0 6px}
p{margin:0 0 12px}
code{font-family:ui-monospace,Consolas,monospace;font-size:.9em;background:var(--pri-soft);
  padding:1px 5px;border-radius:5px}
pre{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:11px 13px;
  margin:9px 0;overflow-x:auto;font-size:13.5px;line-height:1.55}
pre code{background:none;padding:0;font-size:inherit}
.meta{color:var(--soft);font-size:13.5px;margin-bottom:18px}
.box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin:14px 0}
.story{border-left:3px solid var(--pri)}
ul,ol{margin:0 0 12px 20px;padding:0}
li{margin:5px 0}
table{width:100%;border-collapse:collapse;font-size:14.5px;margin:6px 0 4px}
th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--soft);font-size:12.5px;text-transform:uppercase;letter-spacing:.03em}
.q{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:15px 17px;margin:12px 0}
.q .no{font-size:12.5px;color:var(--soft);font-weight:700;margin-bottom:5px}
.q ol{margin:8px 0 8px 22px}
.dap{margin-top:9px;padding-top:9px;border-top:1px dashed var(--line);font-size:14.5px}
.dap b{color:var(--ok)}
.cta{background:var(--pri-soft);border:1px solid var(--pri);border-radius:16px;padding:20px;margin:28px 0;text-align:center}
.cta h2{margin:0 0 8px;font-size:19px}
.cta p{color:var(--soft);font-size:14.5px}
.btn{display:inline-block;background:var(--pri);color:#fff;text-decoration:none;font-weight:700;
  border-radius:10px;padding:11px 22px;margin-top:6px}
.nav{display:flex;justify-content:space-between;gap:12px;margin-top:26px;font-size:14.5px;flex-wrap:wrap}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin:10px 0 6px}
.grid a{display:block;background:var(--card);border:1px solid var(--line);border-radius:11px;
  padding:11px 13px;text-decoration:none;color:var(--ink);font-size:14.5px}
.grid a:hover{border-color:var(--pri)}
.grid a small{display:block;color:var(--soft);font-size:12.5px;margin-top:2px}
footer{margin-top:38px;padding-top:16px;border-top:1px solid var(--line);color:var(--soft);font-size:13px}
footer a{margin-right:14px}
`;

function khung({ title, desc, canonical, body, ld }) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:site_name" content="Ôn thi Tin học THPT">
<meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary">
<style>${CSS}</style>
${ld ? '<script type="application/ld+json">' + JSON.stringify(ld) + "</script>" : ""}
</head>
<body><div class="wrap">
<header class="top">
  <b><a href="/bai" style="text-decoration:none;color:inherit">Ôn thi Tin học THPT</a></b>
  <a href="/">Vào ứng dụng học →</a>
</header>
${body}
<footer>
  <a href="/bai">Tất cả bài học</a>
  <a href="/landing.html">Giới thiệu</a>
  <a href="/nang-cap.html">Bảng giá</a>
  <a href="/quyen-rieng-tu.html">Quyền riêng tư</a>
  <p style="margin-top:8px">Nội dung do người dạy tự biên soạn theo Chương trình GDPT 2018 — không sao chép sách giáo khoa.</p>
</footer>
</div></body>
</html>`;
}

/* ------------------------------ trang một bài ------------------------------ */
const CACHE = new Map(); // slug|__ds -> html (nội dung chỉ đổi khi deploy lại)

function trangBai(muc, base) {
  const khoaCache = muc.slug + "|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);

  const { kho } = chiMuc();
  const l = muc.bai;
  const canonical = base + "/bai/" + muc.slug;
  /* Tiêu đề dồn từ khoá quan trọng lên đầu (Google cắt quanh 60-70 ký tự): tên
     lớp + số bài + tên bài trước, cụm "trắc nghiệm có đáp án" ở đuôi. Nhánh
     KHMT/Ứng dụng để dành cho H1 và breadcrumb cho khỏi dài. */
  const tieuDe = `Tin học ${l.grade} Bài ${l.order}. ${l.title} — trắc nghiệm có đáp án`;
  const desc = moTa(l.intro || l.title, 155);

  const mo = (l.sections || []).find((s) => (s.t || s.type) === "story");
  const mucLon = (l.sections || []).filter((s) => (s.t || s.type) === "h").map((s) => s.text);
  const { mc, tf } = cauMau(l, kho);
  const tv = tuVung(l, kho);

  const cauMcHtml = mc.map((q, i) => `
  <div class="q">
    <div class="no">Câu ${i + 1} · ${esc(TEN_MUC[q.level] || "")}</div>
    <div>${nhan(q.question)}</div>
    ${q.code ? "<pre><code>" + esc(q.code) + "</code></pre>" : ""}
    <ol type="A">${(q.options || []).map((o) => "<li>" + nhan(o) + "</li>").join("")}</ol>
    <div class="dap"><b>Đáp án: ${String.fromCharCode(65 + q.answer)}</b>${q.explain ? " — " + nhan(q.explain) : ""}</div>
  </div>`).join("");

  const cauTfHtml = tf.map((q) => `
  <div class="q">
    <div class="no">Câu Đúng/Sai (Phần II) · ${esc(TEN_MUC[q.level] || "")}</div>
    <div>${nhan(q.question)}</div>
    ${q.code ? "<pre><code>" + esc(q.code) + "</code></pre>" : ""}
    <table>${(q.statements || []).map((s, i) => `<tr><td>${"abcd"[i]})</td><td>${nhan(s.text)}</td>
      <td style="white-space:nowrap"><b style="color:${s.correct ? "var(--ok)" : "var(--warn)"}">${s.correct ? "Đúng" : "Sai"}</b></td></tr>`).join("")}</table>
    ${q.explain ? '<div class="dap">' + nhan(q.explain) + "</div>" : ""}
  </div>`).join("");

  const body = `
<div class="crumb"><a href="/bai">Ôn tập Tin học THPT</a> › ${esc(muc.lop)} › Bài ${l.order}</div>
<span class="lop">${esc(muc.lop)}</span>
<h1>Bài ${l.order}. ${esc(l.title)}</h1>
<p class="meta">Chủ đề ${esc(l.topic)} · ${esc(TEN_CHU_DE[l.topic] || "")} — đọc khoảng ${l.minutes || 10} phút${
    (l.quiz || []).length ? ` · bài này có ${(l.quiz || []).length} câu luyện tập trong ứng dụng` : ""}</p>
${doan(l.intro)}
${mo ? '<div class="box story"><h3>Bắt đầu bằng một hình dung</h3>' + doan(mo.text) + "</div>" : ""}
${mucLon.length ? "<h2>Nội dung bài học</h2><ol>" + mucLon.map((h) => "<li>" + nhan(h) + "</li>").join("") + "</ol>" : ""}
${(l.keypoints || []).length ? '<h2>Tóm tắt lý thuyết cần nhớ</h2><div class="box"><ul>' +
    l.keypoints.map((k) => "<li>" + nhan(k) + "</li>").join("") + "</ul></div>" : ""}
${tv.length ? `<h2>Thuật ngữ tiếng Anh trong bài</h2>
<table><tr><th>Tiếng Anh</th><th>Đọc là</th><th>Nghĩa</th></tr>
${tv.map((t) => `<tr><td><b>${esc(t.en)}</b></td><td>${esc(t.say || "")}</td><td>${esc(t.vi)}${
    t.gloss ? '<br><small style="color:var(--soft)">' + esc(moTa(t.gloss, 150)) + "</small>" : ""}</td></tr>`).join("")}
</table>` : ""}
${(cauMcHtml || cauTfHtml) ? `<h2>Câu hỏi trắc nghiệm có đáp án</h2>
<p class="meta">Mấy câu mẫu để bạn tự kiểm tra ngay. Trong ứng dụng, bài này có đủ ${(l.quiz || []).length} câu, chấm điểm tự động và giải thích từng câu sai.</p>
${cauMcHtml}${cauTfHtml}` : ""}

<div class="cta">
  <h2>Học trọn bài này trong ứng dụng</h2>
  <p>Bài giảng đầy đủ, ${(l.quiz || []).length} câu luyện tập chấm tự động, thi thử đúng cấu trúc đề tốt nghiệp
  (24 trắc nghiệm + 4 Đúng/Sai), bài thực hành máy tự chấm và gia sư AI giải thích chỗ sai.</p>
  <a class="btn" href="/#/lesson/${esc(l.id)}">Mở bài ${l.order} trong ứng dụng</a>
  <p style="margin-top:10px;font-size:13px">Miễn phí toàn bộ phần học — tạo tài khoản để lưu tiến độ.</p>
</div>

<div class="nav">
  <span>${muc.truoc ? '<a href="/bai/' + muc.truoc.slug + '">← Bài ' + muc.truoc.bai.order + ". " + esc(moTa(muc.truoc.bai.title, 40)) + "</a>" : ""}</span>
  <span>${muc.sau ? '<a href="/bai/' + muc.sau.slug + '">Bài ' + muc.sau.bai.order + ". " + esc(moTa(muc.sau.bai.title, 40)) + " →</a>" : ""}</span>
</div>`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: `Bài ${l.order}. ${l.title}`,
        description: desc,
        url: canonical,
        inLanguage: "vi",
        educationalLevel: muc.lop,
        learningResourceType: ["Bài giảng", "Trắc nghiệm"],
        about: TEN_CHU_DE[l.topic] || "Tin học",
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ôn tập Tin học THPT", item: base + "/bai" },
          { "@type": "ListItem", position: 2, name: muc.lop, item: base + "/bai#stage" + l.stage },
          { "@type": "ListItem", position: 3, name: `Bài ${l.order}. ${l.title}`, item: canonical },
        ],
      },
    ],
  };

  const html = khung({ title: tieuDe, desc, canonical, body, ld });
  CACHE.set(khoaCache, html);
  return html;
}

/* ------------------------------ trang danh sách ------------------------------ */
function trangDanhSach(base) {
  const khoaCache = "__ds|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);

  const { ds, kho } = chiMuc();
  const theoLop = new Map();
  ds.forEach((m) => {
    if (!theoLop.has(m.bai.stage)) theoLop.set(m.bai.stage, []);
    theoLop.get(m.bai.stage).push(m);
  });

  const khoi = [...theoLop].map(([stage, ms]) => `
<h2 id="stage${stage}">${esc(ms[0].lop)} <small style="color:var(--soft);font-weight:400">(${ms.length} bài)</small></h2>
<div class="grid">${ms.map((m) => `<a href="/bai/${m.slug}"><b>Bài ${m.bai.order}. ${esc(m.bai.title)}</b>
  <small>${esc(moTa(m.bai.intro, 70))}</small></a>`).join("")}</div>`).join("");

  const body = `
<h1>Ôn tập Tin học THPT — ${ds.length} bài lý thuyết &amp; trắc nghiệm có đáp án</h1>
<p class="meta">Tóm tắt lý thuyết, thuật ngữ tiếng Anh và câu hỏi trắc nghiệm có đáp án cho cả ba lớp 10, 11, 12
— cả nhánh Khoa học máy tính lẫn Tin học ứng dụng, bám Chương trình GDPT 2018 và cấu trúc đề tốt nghiệp
(24 câu trắc nghiệm + 4 câu Đúng/Sai).</p>
<div class="cta">
  <h2>Ứng dụng học đầy đủ</h2>
  <p>${ds.length} bài giảng, ${kho.soCau} câu hỏi, 13 đề thi thử, hơn 320 bài thực hành máy tự chấm
  (Python, SQL, HTML/CSS, đồ hoạ) và gia sư AI.</p>
  <a class="btn" href="/">Bắt đầu học miễn phí</a>
</div>
${khoi}`;

  const html = khung({
    title: `Ôn tập Tin học THPT — ${ds.length} bài lý thuyết & trắc nghiệm có đáp án`,
    desc: `Tổng hợp ${ds.length} bài Tin học lớp 10, 11, 12: tóm tắt lý thuyết, thuật ngữ tiếng Anh và câu trắc nghiệm có đáp án, bám cấu trúc đề thi tốt nghiệp THPT.`,
    canonical: base + "/bai",
    body,
    ld: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      numberOfItems: ds.length,
      itemListElement: ds.map((m, i) => ({
        "@type": "ListItem", position: i + 1,
        name: `Bài ${m.bai.order}. ${m.bai.title}`,
        url: base + "/bai/" + m.slug,
      })),
    },
  });
  CACHE.set(khoaCache, html);
  return html;
}

/* --------------------------------- router --------------------------------- */
function goc(req) {
  if (process.env.SITE_URL) return String(process.env.SITE_URL).replace(/\/+$/, "");
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";
  return proto + "://" + req.get("host");
}

function createSeo() {
  const r = express.Router();

  /* Nạp kho nội dung sau khi máy chủ đã lắng nghe, để cú vào đầu tiên của
     Google không phải đợi ~3 giây. unref() để không giữ tiến trình lúc chạy test. */
  const hen = setTimeout(() => { try { chiMuc(); } catch (e) { console.warn("[seo] Nạp kho lỗi:", e.message); } }, 2500);
  if (hen.unref) hen.unref();

  const traHtml = (res, html) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(html);
  };

  r.get("/bai", (req, res, next) => {
    try { traHtml(res, trangDanhSach(goc(req))); } catch (e) { next(e); }
  });

  r.get("/bai/:slug", (req, res, next) => {
    try {
      const { theoSlug, theoId } = chiMuc();
      const key = String(req.params.slug || "");
      const muc = theoSlug.get(key.toLowerCase());
      if (muc) return traHtml(res, trangBai(muc, goc(req)));
      /* Cho phép gọi thẳng bằng mã bài (C12-16) -> chuyển hẳn sang URL chuẩn,
         tránh hai đường dẫn cùng một nội dung (Google phạt trùng lặp). */
      const theoMa = theoId.get(key.toUpperCase());
      if (theoMa) return res.redirect(301, "/bai/" + theoMa.slug);
      res.status(404);
      traHtml(res, khung({
        title: "Không tìm thấy bài học",
        desc: "Đường dẫn không đúng.",
        canonical: goc(req) + "/bai",
        body: '<h1>Không tìm thấy bài học này</h1><p>Có thể đường dẫn đã đổi. <a href="/bai">Xem danh sách tất cả bài học</a>.</p>',
      }));
    } catch (e) { next(e); }
  });

  r.get("/sitemap.xml", (req, res, next) => {
    try {
      const base = goc(req);
      const { ds } = chiMuc();
      const url = (loc, uu) => `<url><loc>${esc(loc)}</loc><changefreq>monthly</changefreq><priority>${uu}</priority></url>`;
      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=86400");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(base + "/", "1.0")}
${url(base + "/bai", "0.9")}
${url(base + "/landing.html", "0.8")}
${url(base + "/nang-cap.html", "0.6")}
${ds.map((m) => url(base + "/bai/" + m.slug, "0.7")).join("\n")}
</urlset>`);
    } catch (e) { next(e); }
  });

  r.get("/robots.txt", (req, res) => {
    res.type("text/plain").send(
      "User-agent: *\n" +
      "Allow: /\n" +
      "Disallow: /api/\n" +
      "Disallow: /admin.html\n" +
      "Disallow: /admin\n\n" +
      "Sitemap: " + goc(req) + "/sitemap.xml\n"
    );
  });

  return r;
}

module.exports = { createSeo, chiMuc, slugHoa, SO_MC_MAU, SO_TF_MAU };
