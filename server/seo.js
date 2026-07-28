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
/* Tóm tắt hiển thị cho người đọc: cắt TRỌN CÂU, không cụt giữa chừng.
   Cắt theo số ký tự cho ra những mẩu như "hiểu ba bước máy…" — vô nghĩa và
   trông như lỗi. Lấy hết câu đầu; câu đầu mà dài quá thì mới đành cắt theo từ. */
function cauDau(s, toiDa) {
  const t = String(s || "").replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  const m = t.match(/^[\s\S]*?[.!?…](\s|$)/);
  const cau = (m ? m[0] : t).trim();
  return cau.length > toiDa ? cat(cau, toiDa) : cau;
}

/* ---------------------- NGÀY SỬA (cho lastmod trong sitemap) ----------------------
   Google đã bỏ qua `priority` và `changefreq` từ lâu; `lastmod` là thẻ duy nhất
   còn được dùng — nhưng chỉ khi nó nói thật. Nên lấy thẳng từ thời điểm sửa tệp,
   không đặt cứng và cũng không lấy ngày hôm nay (khai man mọi trang mới sửa thì
   Google sẽ thôi tin toàn bộ sitemap). */
function ngaySua(duongDan) {
  try { return fs.statSync(duongDan).mtime.toISOString().slice(0, 10); } catch (e) { return null; }
}

/* Trang bài dựng từ nhiều tệp dữ liệu, nên lấy tệp nội dung MỚI NHẤT. Nhớ lại
   kết quả vì sitemap có thể bị gọi liên tục. */
let _NGAY_ND = undefined;
function ngaySuaNoiDung() {
  if (_NGAY_ND !== undefined) return _NGAY_ND;
  const thuMuc = path.join(__dirname, "..", "public", "js");
  let moiNhat = 0;
  try {
    fs.readdirSync(thuMuc)
      .filter((f) => /^(clean-|questions|lessons|vocab|sgk-map)/.test(f) && f.endsWith(".js"))
      .forEach((f) => {
        const t = fs.statSync(path.join(thuMuc, f)).mtimeMs;
        if (t > moiNhat) moiNhat = t;
      });
  } catch (e) { /* không đọc được thì bỏ lastmod, còn hơn ghi bừa */ }
  _NGAY_ND = moiNhat ? new Date(moiNhat).toISOString().slice(0, 10) : null;
  return _NGAY_ND;
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

/* Bài SGK nào ứng với bài này. Trả [] khi không có — và KHÔNG được suy ra
   "bài này ngoài chương trình": phần lớn bài không có mặt ở đây là nửa sau của
   một bài SGK bị tách đôi cho dễ học (xem chú thích trong public/js/sgk-map.js). */
function sgkCua(lessonId, kho) {
  const m = kho.SGK_MAP;
  if (!m || !m.sach) return [];
  const ra = [];
  Object.keys(m.sach).forEach((lop) => {
    (m.sach[lop].bai || []).forEach((b) => {
      if (b.cua === lessonId) ra.push({ lop: Number(lop), tenSach: m.sach[lop].ten, ...b });
    });
  });
  return ra.sort((a, b) => a.lop - b.lop || a.so - b.so);
}

function tuVung(l, kho) {
  const khoa = (kho.VOCAB || {})[l.id] || [];
  const td = tuDien(kho);
  return khoa.map((k) => (typeof k === "string" ? td[k] : k)).filter((t) => t && t.en && t.vi);
}

/* ---------------------------- KHUNG TRANG ----------------------------
 *  Dùng CHUNG hệ thống thiết kế với landing / nang-cap / quyen-rieng-tu
 *  (css/landing.css + css/pages.css): cùng phông chữ, cùng bảng màu, cùng
 *  header và chân trang, có cả nút Sáng/Tối. Trước đây tệp này tự bịa một bộ
 *  CSS riêng nên khách bấm từ Google vào thấy như lạc sang website khác.
 *  Chỉ giữ vài lớp RIÊNG cho trang bài (thẻ câu hỏi, lưới danh sách, khối kể
 *  chuyện) và đều viết bằng biến màu của hệ thống chung.
 * ------------------------------------------------------------------- */
const CSS_RIENG = `
/* Danh sách 119 bài: TRA CỨU chứ không phải đọc. Trước đây mỗi thẻ kèm 3 dòng
   giới thiệu -> trang cao gần 10.000px, phải cuộn mãi mới tới lớp mình cần.
   Nay mỗi thẻ chỉ còn số bài + tên (mượn cách app đánh số bài: mono, màu nhãn),
   thêm thanh nhảy nhanh theo lớp ở đầu trang. Phần giới thiệu đã nằm sẵn ở
   trang chi tiết — nơi người ta thật sự đọc. */
.seo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:10px;margin:12px 0 4px}
.seo-grid a{display:flex;gap:11px;align-items:flex-start;background:var(--surface-card);
  border:1px solid var(--line);border-radius:12px;padding:11px 13px;text-decoration:none;
  color:var(--ink-main);transition:border-color .15s,transform .1s,box-shadow .15s}
.seo-grid a:hover{border-color:var(--brand);transform:translateY(-2px);box-shadow:var(--shadow-sm)}
.seo-so{flex:none;min-width:26px;height:26px;padding:0 6px;border-radius:8px;display:flex;
  align-items:center;justify-content:center;background:var(--brand-soft);color:var(--brand);
  font-family:var(--font-mono);font-size:12.5px;font-weight:700}
.seo-grid b{font-size:14.5px;font-weight:650;line-height:1.4;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.seo-lop{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:30px 0 0;
  padding-top:14px;border-top:1px solid var(--line)}
.seo-lop h2{margin:0;font-size:20px}
.seo-lop span{color:var(--ink-faint);font-size:13.5px}
/* Nhảy nhanh tới từng lớp — không phải cuộn qua cả trăm bài */
.seo-jump{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 4px}
.seo-jump a{font-size:13.5px;font-weight:650;text-decoration:none;color:var(--ink-muted);
  background:var(--bg-subtle);border:1px solid var(--line);border-radius:999px;padding:6px 14px}
.seo-jump a:hover{border-color:var(--brand);color:var(--brand)}
.seo-meta{color:var(--ink-muted);font-size:14px;margin:0 0 18px}
.seo-crumb{font-size:13px;color:var(--ink-faint);margin-bottom:10px}
.seo-crumb a{color:var(--ink-muted);text-decoration:none}
.seo-crumb a:hover{color:var(--brand)}
.seo-story{border-left:3px solid var(--brand);background:var(--brand-soft);border-radius:0 14px 14px 0;
  padding:15px 18px;margin:18px 0}
/* Dùng --ink-main chứ KHÔNG dùng --brand-dark: ở chế độ tối, --brand-dark
   (#4f46e5) nằm trên nền --brand-soft (#1e1b4b) là hai màu chàm sát nhau, chữ
   chìm hẳn. Viền trái và nền nhạt đã đủ báo hiệu khối này rồi. */
.seo-story h3{margin:0 0 6px;font-size:15.5px;color:var(--ink-main)}
/* Thẻ câu hỏi: siết mật độ (không bớt nội dung) để đọc liền mạch hơn — bốn câu
   mẫu trước đây chiếm hơn 1.300px chỉ vì khoảng đệm rộng. */
.seo-q{background:var(--surface-card);border:1px solid var(--line);border-radius:12px;padding:13px 15px;margin:9px 0}
.seo-q-no{font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:4px}
.seo-q ol{margin:7px 0 7px 20px;padding:0}
.seo-q li{margin:2px 0}
.seo-q p{margin:0}
.seo-dap{margin-top:9px;padding-top:9px;border-top:1px dashed var(--line);font-size:14px;color:var(--ink-muted)}
/* Bảng từ vựng: cột tiếng Anh không cần rộng bằng cột nghĩa, và dòng thưa quá
   làm khối này dài gần bằng cả phần lý thuyết. */
.pg-table.seo-tv td,.pg-table.seo-tv th{padding:7px 11px}
.pg-table.seo-tv td:first-child{white-space:nowrap;font-weight:650;width:1%}
.pg-table.seo-tv small{color:var(--ink-faint);line-height:1.5}
.seo-dap b{color:var(--accent-green)}
.seo-nav{display:flex;justify-content:space-between;gap:14px;margin-top:28px;font-size:14.5px;flex-wrap:wrap}
.seo-nav a{text-decoration:none}
.seo-sgk{margin-top:16px;padding:12px 15px;background:var(--accent-teal-soft);border:1px solid var(--accent-teal);
  border-radius:12px;font-size:14px;line-height:1.6;color:var(--ink-main)}
.seo-sgk b{display:block;font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--accent-teal);margin-bottom:2px}
.seo-sgk i{font-style:normal;color:var(--ink-muted)}
.seo-sgk a{display:inline-block;margin-top:6px;font-size:13.5px;text-decoration:none}
[data-theme="dark"] .seo-sgk{background:var(--info-soft,#134e4a);color:var(--ink-main)}
.seo-dc td:first-child{white-space:nowrap;font-family:var(--font-mono,monospace);font-size:13px}
pre{background:var(--bg-subtle);border:1px solid var(--line);border-radius:10px;padding:12px 14px;
  margin:10px 0;overflow-x:auto;font-size:13.5px;line-height:1.6}
pre code{background:none;padding:0;font-size:inherit}
`;

const LOGO_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>';
const IC_TRANG = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const IC_TROI = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

/* Nút Sáng/Tối dùng chung một khoá localStorage 'lpTheme' với các trang vệ tinh,
   để đổi ở trang nào thì sang trang khác vẫn giữ nguyên lựa chọn. */
const JS_THEME = "(function(){var b=document.getElementById('themeToggle');" +
  "var S=" + JSON.stringify(IC_TROI) + ",T=" + JSON.stringify(IC_TRANG) + ";" +
  "var l=null;try{l=localStorage.getItem('lpTheme')}catch(e){}" +
  "if(l)document.documentElement.setAttribute('data-theme',l);if(!b)return;" +
  "b.innerHTML=l==='dark'?S:T;b.onclick=function(){" +
  "var t=document.documentElement.getAttribute('data-theme')==='dark';" +
  "document.documentElement.setAttribute('data-theme',t?'light':'dark');" +
  "b.innerHTML=t?T:S;try{localStorage.setItem('lpTheme',t?'light':'dark')}catch(e){}}})();";

function khung(o) {
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    "<title>" + esc(o.title) + "</title>\n" +
    '<meta name="description" content="' + esc(o.desc) + '">\n' +
    '<link rel="canonical" href="' + esc(o.canonical) + '">\n' +
    '<meta property="og:type" content="article">\n' +
    '<meta property="og:title" content="' + esc(o.title) + '">\n' +
    '<meta property="og:description" content="' + esc(o.desc) + '">\n' +
    '<meta property="og:url" content="' + esc(o.canonical) + '">\n' +
    '<meta property="og:site_name" content="Ôn thi Tin học THPT">\n' +
    '<meta property="og:locale" content="vi_VN">\n' +
    '<meta name="twitter:card" content="summary">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Lexend:wght@700;800&family=JetBrains+Mono:wght@600;700&family=Plus+Jakarta+Sans:wght@500;650;750;800&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="/css/landing.css">\n' +
    '<link rel="stylesheet" href="/css/pages.css">\n' +
    "<style>" + CSS_RIENG + "</style>\n" +
    (o.ld ? '<script type="application/ld+json">' + JSON.stringify(o.ld) + "</script>\n" : "") +
    '</head>\n<body class="lp">\n\n' +
    '<header class="lp-head"><div class="wrap">' +
      '<a class="brand" href="/landing.html"><span class="brand-mark" aria-hidden="true">' + LOGO_SVG + "</span>Tin Học KHMT</a>" +
      /* Menu KHỚP với trang chủ: khách bấm từ Google vào thấy đúng thanh điều
         hướng quen thuộc, không phải một bộ mục lạ. Lối vào /bai và
         /doi-chieu-sgk vẫn còn ở chân trang và ở dấu vết đường dẫn, nên Google
         lẫn người dùng đều không mất đường. */
      '<nav class="nav-links">' +
        '<a href="/landing.html#cach-hoc">Cách học</a>' +
        '<a href="/landing.html#tinh-nang">Tính năng</a>' +
        '<a href="/landing.html#lo-trinh">Lộ trình</a>' +
        '<a href="/landing.html#hoc-phi">Học phí</a>' +
        '<a href="/landing.html#tac-gia">Tác giả</a>' +
        '<a class="nav-opt" href="/landing.html#faq">Câu hỏi</a>' +
      "</nav>" +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost btn-sm" id="themeToggle" title="Chuyển giao diện Sáng/Tối">' + IC_TRANG + "</button>" +
        '<a class="btn btn-primary btn-sm" href="/">Học thử miễn phí</a>' +
      "</div>" +
    "</div></header>\n\n" +
    '<main class="pg-main"><div class="wrap pg-narrow">\n' + o.body + "\n</div></main>\n\n" +
    '<footer class="foot"><div class="wrap">' +
      '<div class="foot-top"><div>' +
        '<a class="brand" href="/landing.html"><span class="brand-mark" aria-hidden="true">' + LOGO_SVG + "</span>Tin học KHMT</a>" +
        '<p class="tagline">Ôn thi Tin học tốt nghiệp, định hướng Khoa học máy tính — dễ hiểu, thực hành thật.</p>' +
      "</div>" +
      '<nav class="foot-links">' +
        '<a href="/bai">Tất cả bài học</a>' +
        '<a href="/doi-chieu-sgk">Đối chiếu SGK</a>' +
        '<a href="/landing.html">Giới thiệu</a>' +
        '<a href="/nang-cap.html">Bảng giá &amp; nâng cấp</a>' +
        '<a href="/quyen-rieng-tu.html">Quyền riêng tư</a>' +
      "</nav></div>" +
      '<p class="copy">Nội dung do người dạy tự biên soạn theo Chương trình GDPT 2018 — không sao chép sách giáo khoa. ' +
      "© 2026 Ôn thi Tin học THPT · Lê Anh Tuấn (Tuấn LA Lab).</p>" +
    "</div></footer>\n" +
    "<script>" + JS_THEME + "</script>\n</body>\n</html>";
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
  const sgk = sgkCua(l.id, kho);

  const cauMcHtml = mc.map((q, i) => `
  <div class="seo-q">
    <div class="seo-q-no">Câu ${i + 1} · ${esc(TEN_MUC[q.level] || "")}</div>
    <div>${nhan(q.question)}</div>
    ${q.code ? "<pre><code>" + esc(q.code) + "</code></pre>" : ""}
    <ol type="A">${(q.options || []).map((o) => "<li>" + nhan(o) + "</li>").join("")}</ol>
    <div class="seo-dap"><b>Đáp án: ${String.fromCharCode(65 + q.answer)}</b>${q.explain ? " — " + nhan(q.explain) : ""}</div>
  </div>`).join("");

  const cauTfHtml = tf.map((q) => `
  <div class="seo-q">
    <div class="seo-q-no">Câu Đúng/Sai (Phần II) · ${esc(TEN_MUC[q.level] || "")}</div>
    <div>${nhan(q.question)}</div>
    ${q.code ? "<pre><code>" + esc(q.code) + "</code></pre>" : ""}
    <div class="pg-table-wrap"><table class="pg-table">${(q.statements || []).map((s, i) => `<tr><td>${"abcd"[i]})</td><td>${nhan(s.text)}</td>
      <td style="white-space:nowrap"><b class="${s.correct ? "pg-yes" : "pg-lim"}">${s.correct ? "Đúng" : "Sai"}</b></td></tr>`).join("")}</table></div>
    ${q.explain ? '<div class="seo-dap">' + nhan(q.explain) + "</div>" : ""}
  </div>`).join("");

  const body = `
<div class="pg-hero left">
  <div class="seo-crumb"><a href="/bai">Ôn tập Tin học THPT</a> › ${esc(muc.lop)} › Bài ${l.order}</div>
  <span class="eyebrow">${esc(muc.lop)}</span>
  <h1>Bài ${l.order}. ${esc(l.title)}</h1>
  <p class="lead">${nhan(l.intro || "")}</p>
  <p class="seo-meta">Chủ đề ${esc(l.topic)} · ${esc(TEN_CHU_DE[l.topic] || "")} — đọc khoảng ${l.minutes || 10} phút${
    (l.quiz || []).length ? ` · ${(l.quiz || []).length} câu luyện tập trong ứng dụng` : ""}</p>
${sgk.length ? `<div class="seo-sgk">
  <b>Tương ứng sách giáo khoa</b>
  <span>${esc(kho.SGK_MAP.ten)} · ${esc(sgk[0].tenSach)} — ${sgk.map((b) =>
    "Bài " + b.so + ". " + esc(b.ten) + (b.trang ? " <i>(trang " + esc(b.trang) + ")</i>" : "")).join("; ")}</span>
  <a href="/doi-chieu-sgk">Xem bảng đối chiếu cả bộ →</a>
</div>` : ""}
</div>

<div class="pg-card pg-prose">
${mo ? '<div class="seo-story"><h3>Bắt đầu bằng một hình dung</h3>' + doan(mo.text) + "</div>" : ""}
${mucLon.length ? "<h2>Nội dung bài học</h2><ol>" + mucLon.map((h) => "<li>" + nhan(h) + "</li>").join("") + "</ol>" : ""}
${(l.keypoints || []).length ? "<h2>Tóm tắt lý thuyết cần nhớ</h2><ul>" +
    l.keypoints.map((k) => "<li>" + nhan(k) + "</li>").join("") + "</ul>" : ""}
</div>

${tv.length ? `<div class="pg-card">
<h2>Thuật ngữ tiếng Anh trong bài</h2>
<div class="pg-table-wrap"><table class="pg-table seo-tv">
<thead><tr><th>Tiếng Anh</th><th>Đọc là</th><th>Nghĩa</th></tr></thead>
<tbody>${tv.map((t) => `<tr><td><b>${esc(t.en)}</b></td><td>${esc(t.say || "")}</td><td>${esc(t.vi)}${
    t.gloss ? "<br><small>" + esc(cauDau(t.gloss, 170)) + "</small>" : ""}</td></tr>`).join("")}</tbody>
</table></div></div>` : ""}

${(cauMcHtml || cauTfHtml) ? `<div class="pg-card">
<h2>Câu hỏi trắc nghiệm có đáp án</h2>
<p class="pg-note" style="margin-top:0">Mấy câu mẫu để bạn tự kiểm tra ngay. Trong ứng dụng, bài này có đủ ${(l.quiz || []).length} câu, chấm điểm tự động và giải thích từng câu sai.</p>
${cauMcHtml}${cauTfHtml}</div>` : ""}

<div class="pg-card" style="text-align:center">
  <h2>Học trọn bài này trong ứng dụng</h2>
  <p class="pg-note">Bài giảng đầy đủ, ${(l.quiz || []).length} câu luyện tập chấm tự động, thi thử đúng cấu trúc đề tốt nghiệp
  (24 trắc nghiệm + 4 Đúng/Sai), bài thực hành máy tự chấm và gia sư AI giải thích chỗ sai.</p>
  <p style="margin-top:14px"><a class="btn btn-primary btn-lg" href="/#/lesson/${esc(l.id)}">Mở bài ${l.order} trong ứng dụng</a></p>
  <p class="pg-note" style="margin-top:10px">Phần học miễn phí, không cần tạo tài khoản.</p>
</div>

<div class="seo-nav">
  <span>${muc.truoc ? '<a href="/bai/' + muc.truoc.slug + '">← Bài ' + muc.truoc.bai.order + ". " + esc(muc.truoc.bai.title) + "</a>" : ""}</span>
  <span>${muc.sau ? '<a href="/bai/' + muc.sau.slug + '">Bài ' + muc.sau.bai.order + ". " + esc(muc.sau.bai.title) + " →</a>" : ""}</span>
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

  /* Mô tả mỗi thẻ: lấy TRỌN CÂU ĐẦU của phần giới thiệu. Cắt cứng theo số ký tự
     cho ra những mẩu cụt lủn kiểu "hiểu ba bước máy…" — trông như lỗi hiển thị. */
  const khoi = [...theoLop].map(([stage, ms]) => `
<div class="seo-lop"><h2 id="stage${stage}">${esc(ms[0].lop)}</h2><span>${ms.length} bài</span></div>
<div class="seo-grid">${ms.map((m) => `<a href="/bai/${m.slug}" title="${esc(cauDau(m.bai.intro, 160))}">` +
  `<span class="seo-so">${m.bai.order}</span><b>${esc(m.bai.title)}</b></a>`).join("")}</div>`).join("");

  /* Thanh nhảy nhanh: 119 bài chia 5 lớp, không ai muốn cuộn tìm lớp của mình. */
  const nhay = `<nav class="seo-jump" aria-label="Nhảy tới lớp">` +
    [...theoLop].map(([stage, ms]) =>
      `<a href="#stage${stage}">${esc(ms[0].lop)} <span style="opacity:.65">${ms.length}</span></a>`).join("") +
    `</nav>`;

  const body = `
<div class="pg-hero left">
  <span class="eyebrow">Ôn tập theo bài</span>
  <h1>${ds.length} bài Tin học THPT — lý thuyết &amp; trắc nghiệm có đáp án</h1>
  <p class="lead">Tóm tắt lý thuyết, thuật ngữ tiếng Anh và câu hỏi trắc nghiệm có đáp án cho cả ba lớp 10, 11, 12
  — cả nhánh Khoa học máy tính lẫn Tin học ứng dụng, bám Chương trình GDPT 2018 và cấu trúc đề tốt nghiệp
  (24 câu trắc nghiệm + 4 câu Đúng/Sai).</p>
  ${kho.SGK_MAP ? '<p class="seo-meta">Đang học theo sách giáo khoa? <a href="/doi-chieu-sgk"><b>Tra bảng đối chiếu bài trong sách ' +
    esc(kho.SGK_MAP.ten) + "</b></a> để mở nhanh đúng bài bạn học trên lớp.</p>" : ""}
</div>
${nhay}
${khoi}

<div class="pg-card" style="text-align:center;margin-top:34px">
  <h2>Học đầy đủ trong ứng dụng</h2>
  <p class="pg-note">${ds.length} bài giảng, ${kho.soCau} câu hỏi, 13 đề thi thử, 250+ bài thực hành máy tự chấm
  (Python, SQL, HTML/CSS) và gia sư AI kèm riêng.</p>
  <p style="margin-top:14px"><a class="btn btn-primary btn-lg" href="/">Bắt đầu học miễn phí</a></p>
</div>`;

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

/* ------------------------- trang đối chiếu với SGK -------------------------
   Học sinh tìm bài theo SÁCH ("tin học 12 bài 16 kết nối tri thức"), trong khi
   app đã sắp lại thứ tự cho dễ học. Trang này bắc cầu hai chiều — và cũng là
   trang trả lời được câu hỏi đầu tiên của phụ huynh, giáo viên: bám sách nào. */
function trangDoiChieu(base) {
  const khoaCache = "__dc|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);
  const { theoId, kho } = chiMuc();
  const m = kho.SGK_MAP;
  if (!m || !m.sach) return null;

  const bang = Object.keys(m.sach).sort().map((lop) => {
    const s = m.sach[lop];
    const hang = (s.bai || []).map((b) => {
      const muc = b.cua ? theoId.get(b.cua) : null;
      return `<tr>
        <td>Bài ${b.so}${b.trang ? "<br><small>tr. " + esc(b.trang) + "</small>" : ""}</td>
        <td>${esc(b.ten)}</td>
        <td>${muc
          ? '<a href="/bai/' + muc.slug + '">Bài ' + muc.bai.order + ". " + esc(muc.bai.title) + "</a>"
          : '<span class="pg-lim">chưa có</span>'}</td>
      </tr>`;
    }).join("");
    return `<div class="pg-card">
      <h2 id="lop${lop}">${esc(s.ten)}</h2>
      <p class="pg-note" style="margin-top:0">${(s.bai || []).length} bài trong sách — bấm vào cột bên phải để mở bài tương ứng.</p>
      <div class="pg-table-wrap"><table class="pg-table seo-dc">
        <thead><tr><th>SGK</th><th>Tên bài trong sách</th><th>Bài tương ứng trong ứng dụng</th></tr></thead>
        <tbody>${hang}</tbody>
      </table></div>
    </div>`;
  }).join("");

  const body = `
<div class="pg-hero left">
  <span class="eyebrow">Đối chiếu chương trình</span>
  <h1>Bài trong ứng dụng tương ứng bài nào trong SGK ${esc(m.ten)}?</h1>
  <p class="lead">Nội dung trong ứng dụng là bài giảng tự biên soạn theo Chương trình GDPT 2018 và
  <b>đã sắp lại thứ tự cho dễ học</b>, nên số bài không trùng số bài trong sách. Bảng dưới đây tra
  theo đúng số bài của sách để bạn mở nhanh phần mình đang học trên lớp.</p>
</div>
<div class="pg-card">
  <p class="pg-note" style="margin:0">Hiện có bộ <b>${esc(m.ten)}</b> cho ba lớp (nhánh Khoa học máy tính).
  Bộ Cánh Diều, Chân trời sáng tạo và nhánh Tin học ứng dụng sẽ bổ sung sau.
  Một bài trong ứng dụng đôi khi gộp hai bài của sách, và ngược lại một bài sách dài có thể được tách đôi.</p>
</div>
${bang}`;

  const html = khung({
    title: `Đối chiếu SGK ${m.ten} — Tin học 10, 11, 12`,
    desc: `Tra nhanh: bài trong sách giáo khoa Tin học ${m.ten} tương ứng bài nào trong ứng dụng ôn thi. Đủ ba lớp 10, 11, 12 kèm số trang.`,
    canonical: base + "/doi-chieu-sgk",
    body,
    ld: {
      "@context": "https://schema.org",
      "@type": "Table",
      about: "Đối chiếu chương trình Tin học THPT với sách giáo khoa " + m.ten,
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

  r.get("/doi-chieu-sgk", (req, res, next) => {
    try {
      const html = trangDoiChieu(goc(req));
      if (!html) return res.redirect(302, "/bai");   // chưa có dữ liệu đối chiếu
      traHtml(res, html);
    } catch (e) { next(e); }
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
        body: '<div class="pg-hero left"><h1>Không tìm thấy bài học này</h1>' +
          '<p class="lead">Có thể đường dẫn đã đổi.</p></div>' +
          '<div class="pg-card" style="text-align:center"><p style="margin-bottom:12px">Xem danh sách đầy đủ để tìm đúng bài bạn cần.</p>' +
          '<a class="btn btn-primary" href="/bai">Tất cả bài học</a></div>',
      }));
    } catch (e) { next(e); }
  });

  r.get("/sitemap.xml", (req, res, next) => {
    try {
      const base = goc(req);
      const { ds } = chiMuc();
      /* `lastmod` là thẻ DUY NHẤT Google còn thực sự dùng (priority và changefreq
         bị bỏ qua từ lâu) — nhưng chỉ có giá trị nếu nói thật. Nên lấy từ thời
         điểm sửa tệp: trang tĩnh lấy theo chính tệp HTML, trang bài lấy theo tệp
         nội dung mới nhất. Đẩy nội dung mới là ngày tự cập nhật, không phải sửa tay. */
      const url = (loc, uu, lm) =>
        `<url><loc>${esc(loc)}</loc>` + (lm ? `<lastmod>${lm}</lastmod>` : "") +
        `<changefreq>monthly</changefreq><priority>${uu}</priority></url>`;
      const lmTinh = (ten) => ngaySua(path.join(__dirname, "..", "public", ten));
      const lmBai = ngaySuaNoiDung();

      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=86400");
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(base + "/", "1.0", lmTinh("index.html"))}
${url(base + "/bai", "0.9", lmBai)}
${chiMuc().kho.SGK_MAP ? url(base + "/doi-chieu-sgk", "0.8", lmBai) : ""}
${url(base + "/landing.html", "0.8", lmTinh("landing.html"))}
${url(base + "/nang-cap.html", "0.6", lmTinh("nang-cap.html"))}
${url(base + "/quyen-rieng-tu.html", "0.3", lmTinh("quyen-rieng-tu.html"))}
${ds.map((m) => url(base + "/bai/" + m.slug, "0.7", lmBai)).join("\n")}
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
