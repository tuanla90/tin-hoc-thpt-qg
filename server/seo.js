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

/* Lời giải câu Đúng/Sai vốn viết liền một mạch "(1) ... (2) ... (3) ... (4) ...",
   đọc trên màn hình thành một khối chữ đặc, phải dò mắt mới biết ý nào ứng với
   mệnh đề nào. Tách ra mỗi ý một dòng.

   HAI CHỐT AN TOÀN, vì tách sai là MẤT CHỮ của lời giải:
     1. Chuỗi phải MỞ ĐẦU bằng một ý — có câu viết "Ý (2) sai: ... Còn lại đúng:
        (1) ..." , cắt theo dấu ngoặc sẽ nuốt mất phần đầu.
     2. Ghép các ý lại phải ra ĐÚNG chuỗi gốc, sai một ký tự là trả null.
   Không thoả thì giữ nguyên một đoạn — thà xấu còn hơn thiếu.
   Đã kiểm trên cả 2.052 câu: tách được 576, giữ nguyên 1.476, mất chữ 0. */
function tachY(s) {
  const t = String(s || "").trim();
  const re = /(^|[.;!?]\s+)(\((?:[1-4]|[a-d])\))/g;
  const idx = [];
  let m;
  while ((m = re.exec(t))) idx.push(m.index + m[1].length);
  if (idx.length < 2 || idx[0] !== 0) return null;
  const ra = idx
    .map((p, i) => t.slice(p, i + 1 < idx.length ? idx[i + 1] : t.length).trim())
    .filter(Boolean);
  const gon = (x) => x.replace(/\s+/g, "");
  return gon(ra.join(" ")) === gon(t) ? ra : null;
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
  if (!m || !Array.isArray(m.bo)) return [];
  const ra = [];
  m.bo.forEach((bo) => {
    (bo.sach || []).forEach((s) => {
      (s.bai || []).forEach((b) => {
        if (b.cua === lessonId) ra.push({ bo: bo.tenNgan || bo.ten, boMa: bo.ma, sach: s, ...b });
      });
    });
  });
  return ra.sort((a, b) => a.sach.lop - b.sach.lop || a.so - b.so);
}

/* Tên đầy đủ một quyển: "Tin học 11 (Khoa học máy tính)" */
function tenQuyen(s) { return s.ten + (s.tenHuong ? " (" + s.tenHuong + ")" : ""); }

/* Tên chủ đề: lấy đúng bảng TOPICS của app, không dùng TEN_CHU_DE (bản viết cho
   prompt gia sư, đặt tên khác — dùng nhầm là gắn sai nhãn cho cả trăm trang). */
function tenChuDe(kho) { return (kho && kho.TOPICS) || TEN_CHU_DE; }

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
/* KHÔNG cắt tên bài. Kẹp 2 dòng làm những tên dài như "Giấy phép sử dụng sản
   phẩm số và khung pháp lí…" cụt mất phần quan trọng nhất — người tra cứu không
   biết đó có phải bài mình cần không. Thẻ cứ cao thấp khác nhau, lưới vẫn đều. */
.seo-grid b{font-size:14.5px;font-weight:650;line-height:1.4}
.seo-lop{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:30px 0 0;
  padding-top:14px;border-top:1px solid var(--line)}
.seo-lop h2{margin:0;font-size:20px}
.seo-lop span{color:var(--ink-faint);font-size:13.5px}
/* Nhảy nhanh tới từng lớp — không phải cuộn qua cả trăm bài */
.seo-jump{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 4px}
.seo-jump a{font-size:13.5px;font-weight:650;text-decoration:none;color:var(--ink-muted);
  background:var(--bg-subtle);border:1px solid var(--line);border-radius:999px;padding:6px 14px}
.seo-jump a:hover{border-color:var(--brand);color:var(--brand)}
/* Câu dẫn ở đầu trang: .pg-hero .lead bị kẹp 620px nên ở khổ rộng chữ dồn thành
   cột hẹp, chừa một mảng trống lớn bên phải trông như lỗi dựng trang. */
.pg-hero.left .lead{max-width:none}
/* Mở/thu theo lớp — dùng <details> nên chạy không cần JavaScript và Google vẫn
   đọc được nội dung bên trong. Mặc định mở để không giấu mất 119 liên kết. */
.seo-lop-box{border-top:1px solid var(--line);margin-top:26px}
.seo-lop-box>summary{list-style:none;cursor:pointer;display:flex;align-items:baseline;gap:10px;
  flex-wrap:wrap;padding:14px 0 2px}
.seo-lop-box>summary::-webkit-details-marker{display:none}
.seo-lop-box>summary h2{margin:0;font-size:20px}
.seo-lop-box>summary span{color:var(--ink-faint);font-size:13.5px}
.seo-lop-box>summary::after{content:"▾";margin-left:auto;color:var(--ink-faint);font-size:13px;
  transition:transform .15s}
.seo-lop-box[open]>summary::after{transform:rotate(180deg)}
.seo-lop-box>summary:hover h2{color:var(--brand)}
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
.pg-table.seo-tv td,.pg-table.seo-tv th{padding:7px 11px;text-align:left;white-space:normal}
.pg-table.seo-tv td:first-child{white-space:nowrap;font-weight:650;width:1%}
.pg-table.seo-tv td:nth-child(2){white-space:nowrap;width:1%;color:var(--ink-muted)}
.pg-table.seo-tv small{display:block;margin-top:2px;color:var(--ink-faint);line-height:1.5}
/* Mệnh đề Đúng/Sai: KHÔNG dùng <table>. Ba cột chữ dài luôn tràn ngang trên máy
   hẹp, mà nhét vào khung cuộn thì người đọc phải kéo ngang mới thấy hết câu —
   đọc đề thi kiểu đó là hỏng. Danh sách co giãn được theo bề ngang màn hình. */
.seo-ds{list-style:none;margin:9px 0 0;padding:0}
.seo-ds li{display:flex;gap:9px;align-items:baseline;padding:7px 0;border-top:1px solid var(--line)}
.seo-ds li:first-child{border-top:0}
.seo-ds-k{flex:none;font-weight:700;color:var(--ink-faint);font-size:13.5px}
.seo-ds-t{flex:1;min-width:0}
.seo-ds-d{flex:none;font-size:13.5px}
/* Lời giải tách thành từng ý — mỗi ý một dòng, thụt vào cho thẳng hàng với
   dấu (1)(2)(3)(4) chứ không dùng chấm đầu dòng (đã có số rồi, thêm chấm là
   thừa hai lớp đánh dấu). */
.seo-vs{list-style:none;margin:6px 0 0;padding:0}
.seo-vs li{padding:3px 0 3px 2px}
.seo-vs li+li{border-top:1px dashed var(--line)}
.seo-dap b{color:var(--accent-green)}
.seo-nav{display:flex;justify-content:space-between;gap:14px;margin-top:28px;font-size:14.5px;flex-wrap:wrap}
.seo-nav a{text-decoration:none}
.seo-sgk{margin-top:16px;padding:12px 15px;background:var(--accent-teal-soft);border:1px solid var(--accent-teal);
  border-radius:12px;font-size:14px;line-height:1.6;color:var(--ink-main)}
.seo-sgk b{display:block;font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--accent-teal);margin-bottom:2px}
.seo-sgk i{font-style:normal;color:var(--ink-muted)}
.seo-sgk a{display:inline-block;margin-top:6px;font-size:13.5px;text-decoration:none}
[data-theme="dark"] .seo-sgk{background:var(--info-soft,#134e4a);color:var(--ink-main)}
/* ---- Trang đối chiếu SGK: hàng bấm được, KHÔNG dùng bảng ----
   Bảng ba cột chữ dài luôn tràn ngang, đọc phải kéo qua kéo lại. Lưới này co
   thành một cột trên điện thoại nên không bao giờ phải cuộn ngang. */
.dc-muc{padding-top:14px}
.dc-dau{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:10px;
  cursor:pointer;list-style:none}
.dc-dau::-webkit-details-marker{display:none}
/* Mũi tên tự vẽ: mặc định của trình duyệt canh lệch với tiêu đề nhiều cỡ chữ. */
.dc-dau h2{margin:0;font-size:19px;display:flex;align-items:center;gap:9px}
.dc-dau h2::before{content:"";width:8px;height:8px;flex:none;border-right:2px solid var(--ink-faint);
  border-bottom:2px solid var(--ink-faint);transform:rotate(-45deg);transition:transform .15s}
.dc-muc[open] .dc-dau h2::before{transform:rotate(45deg)}
.dc-dau:hover h2::before{border-color:var(--brand)}
.dc-dem{color:var(--ink-faint);font-size:13px;white-space:nowrap}
.dc-bang{border-top:1px solid var(--line)}
.dc-hang{display:grid;grid-template-columns:126px minmax(0,1fr) minmax(0,1.05fr);gap:6px 14px;align-items:baseline;
  padding:11px 8px;border-bottom:1px solid var(--line);text-decoration:none;
  border-radius:8px;transition:background .12s}
/* Cả hàng là một thẻ <a> nên nếu không nói rõ, chữ tên bài SGK bị tô màu link —
   nhìn như mọi thứ đều bấm được. Chọn đủ cụ thể để thắng quy tắc màu liên kết
   chung của pages.css (.pg-card a). */
.dc-bang a.dc-hang,.dc-bang .dc-hang{color:var(--ink-main)}
.dc-bang .dc-hang .dc-ten{color:var(--ink-main)}
.dc-bang a.dc-hang .dc-toi{color:var(--brand)}
a.dc-hang:hover{background:var(--brand-soft)}
.dc-so{font-size:13px;font-weight:750;color:var(--ink-muted);white-space:nowrap}
.dc-so small{display:block;font-weight:500;font-size:11.5px;color:var(--ink-faint)}
.dc-ten{font-size:14.5px;line-height:1.5}
.dc-toi{font-size:14.5px;line-height:1.5;color:var(--brand);font-weight:650}
a.dc-hang .dc-toi::after{content:" →";color:var(--ink-faint);font-weight:400}
.dc-trong{color:var(--ink-faint);font-weight:400;font-style:italic}
.dc-kho{opacity:.75}
/* Lọc trên trang danh sách bài — chip chủ đề là đích của các chip ở trang chủ */
.seo-loc-hop label{display:block;font-size:13.5px;font-weight:650;color:var(--ink-muted);margin-bottom:6px}
.seo-loc-hop .pg-note{margin:8px 0 0;min-height:20px}
.seo-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}
/* KHÔNG dùng cú pháp rút gọn "font: 650 13px/1.2 inherit" — phần font-family của
   shorthand không nhận giá trị inherit, cả khai báo bị vứt và nút rơi về font
   mặc định của hệ thống (lệch hẳn so với phần còn lại của trang). Viết tách ra.
   (Lưu ý: khối CSS này nằm trong chuỗi template của JS, tuyệt đối không dùng
   dấu backtick trong chú thích — sẽ cắt đứt chuỗi.) */
.seo-chip{border:1px solid var(--line-strong);background:var(--surface-card);color:var(--ink-muted);
  border-radius:999px;padding:7px 13px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;
  font-family:inherit;font-size:13px;font-weight:650;line-height:1.2}
.seo-chip span{font-size:11.5px;opacity:.6;font-family:var(--font-mono,monospace)}
.seo-chip:hover{border-color:var(--brand);color:var(--brand)}
.seo-chip.on{background:var(--brand);border-color:var(--brand);color:#fff}
.seo-chip.on span{opacity:.8}
/* Bộ lọc ẩn bằng thuộc tính hidden, nhưng các phần tử này đều có display riêng
   (flex/grid) — mà khai báo display của tác giả THẮNG luật [hidden] mặc định của
   trình duyệt. Thiếu dòng dưới đây thì JS chạy đúng, số đếm đổi đúng, mà danh
   sách vẫn hiện nguyên — đúng kiểu lỗi khó lần nhất. */
.seo-grid a[hidden],.seo-grid[hidden],.seo-lop-box[hidden],.seo-lop[hidden]{display:none}
.dc-tim-hop label{display:block;font-size:13.5px;font-weight:650;color:var(--ink-muted);margin-bottom:6px}
.dc-tim-hop .pg-note{margin:8px 0 0;min-height:20px}
.dc-bo{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.dc-bo a,.dc-bo-on{padding:8px 15px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;
  border:1px solid var(--line-strong);color:var(--ink-muted)}
.dc-bo a:hover{border-color:var(--brand);color:var(--brand)}
.dc-bo-on{background:var(--brand);border-color:var(--brand);color:#fff}
@media(max-width:640px){
  .dc-hang{grid-template-columns:1fr;gap:3px;padding:12px 8px}
  .dc-so{display:flex;align-items:baseline;gap:8px}
  .dc-so small{display:inline}
  .dc-toi::before{content:"↳ "}
}
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
    "<script>" + JS_THEME + "</script>\n" +
    (o.them || "") + "\n</body>\n</html>";
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
    <ul class="seo-ds">${(q.statements || []).map((s, i) => `<li><span class="seo-ds-k">${"abcd"[i]})</span>` +
      `<span class="seo-ds-t">${nhan(s.text)}</span>` +
      `<b class="seo-ds-d ${s.correct ? "pg-yes" : "pg-lim"}">${s.correct ? "Đúng" : "Sai"}</b></li>`).join("")}</ul>
    ${q.explain ? '<div class="seo-dap"><b>Vì sao:</b>' + (() => {
      const y = tachY(q.explain);
      return y ? '<ul class="seo-vs">' + y.map((x) => "<li>" + nhan(x) + "</li>").join("") + "</ul>"
        : " " + nhan(q.explain);
    })() + "</div>" : ""}
  </div>`).join("");

  const body = `
<div class="pg-hero left">
  <div class="seo-crumb"><a href="/bai">Ôn tập Tin học THPT</a> › ${esc(muc.lop)} › Bài ${l.order}</div>
  <span class="eyebrow">${esc(muc.lop)}</span>
  <h1>Bài ${l.order}. ${esc(l.title)}</h1>
  <p class="lead">${nhan(l.intro || "")}</p>
  <p class="seo-meta">Chủ đề ${esc(l.topic)} · ${esc(tenChuDe(kho)[l.topic] || "")} — đọc khoảng ${l.minutes || 10} phút${
    (l.quiz || []).length ? ` · ${(l.quiz || []).length} câu luyện tập trong ứng dụng` : ""}</p>
${sgk.length ? `<div class="seo-sgk">
  <b>Tương ứng sách giáo khoa</b>
  ${sgk.map((b) => `<span>${esc(b.bo)} · ${esc(tenQuyen(b.sach))} — ` +
    (b.maBai
      ? "Bài " + esc(b.maBai) + ". "
      : (b.chuDe ? "Chủ đề " + esc(b.chuDe) + (b.so != null ? " · " : ", ") : "") +
        (b.so != null ? "Bài " + b.so + ". " : "")) + esc(b.ten) +
    (b.trang ? " <i>(trang " + esc(b.trang) + ")</i>" : "") + "</span>").join("")}
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
        about: tenChuDe(kho)[l.topic] || "Tin học",
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
<details class="seo-lop-box" id="stage${stage}" data-lop open>
<summary class="seo-lop"><h2>${esc(ms[0].lop)}</h2><span>${ms.length} bài</span></summary>
<div class="seo-grid">${ms.map((m) => `<a href="/bai/${m.slug}" title="${esc(cauDau(m.bai.intro, 160))}"` +
  ` data-cd="${esc(m.bai.topic || "")}" data-tim="${esc(boDau(m.bai.title.toLowerCase()))}">` +
  `<span class="seo-so">${m.bai.order}</span><b>${esc(m.bai.title)}</b></a>`).join("")}</div>
</details>`).join("");

  /* Thanh nhảy nhanh: 119 bài chia 5 lớp, không ai muốn cuộn tìm lớp của mình. */
  const nhay = `<nav class="seo-jump" aria-label="Nhảy tới lớp">` +
    [...theoLop].map(([stage, ms]) =>
      `<a href="#stage${stage}">${esc(ms[0].lop)} <span style="opacity:.65">${ms.length}</span></a>`).join("") +
    `</nav>`;

  /* Lọc theo CHỦ ĐỀ: các chip ở trang chủ trỏ thẳng vào đây bằng #cd-<mã>, nên
     bấm "Lập trình Python" là ra ngay danh sách bài của mạch đó thay vì đổ 119
     bài rồi bắt người ta tự dò. Đếm trước để chủ đề rỗng không hiện chip chết. */
  const demCd = {};
  ds.forEach((m) => { const c = m.bai.topic; if (c) demCd[c] = (demCd[c] || 0) + 1; });
  const TCD = tenChuDe(kho);
  const chipCd = Object.keys(TCD).filter((c) => demCd[c]).map((c) =>
    `<button class="seo-chip" data-cd="${c}">${esc(TCD[c])} <span>${demCd[c]}</span></button>`).join("");
  const locHtml = `
<div class="pg-card seo-loc-hop">
  <label for="seoTim">Tìm nhanh trong ${ds.length} bài — gõ tên bài, hoặc chọn một mạch kiến thức</label>
  <input class="pg-input" id="seoTim" type="search" placeholder="ví dụ: python · mạng · css · học máy" autocomplete="off">
  <div class="seo-chips"><button class="seo-chip on" data-cd="">Tất cả <span>${ds.length}</span></button>${chipCd}</div>
  <p class="pg-note" id="seoDem"></p>
</div>`;

  const body = `
<div class="pg-hero left">
  <span class="eyebrow">Ôn tập theo bài</span>
  <h1>${ds.length} bài Tin học THPT — lý thuyết &amp; trắc nghiệm có đáp án</h1>
  <p class="lead">Tóm tắt lý thuyết, thuật ngữ tiếng Anh và câu hỏi trắc nghiệm có đáp án cho cả ba lớp 10, 11, 12
  — cả nhánh Khoa học máy tính lẫn Tin học ứng dụng, bám Chương trình GDPT 2018 và cấu trúc đề tốt nghiệp
  (24 câu trắc nghiệm + 4 câu Đúng/Sai).</p>
  ${kho.SGK_MAP && (kho.SGK_MAP.bo || []).length
    ? '<p class="seo-meta">Đang học theo sách giáo khoa? <a href="/doi-chieu-sgk"><b>Tra bảng đối chiếu bài trong sách ' +
      esc(kho.SGK_MAP.bo[0].tenNgan || kho.SGK_MAP.bo[0].ten) + "</b></a> để mở nhanh đúng bài bạn học trên lớp.</p>" : ""}
</div>
${locHtml}
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
    them: "<script>" + JS_LOC_BAI + "</script>",
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
function danhSachBo(kho) {
  const m = kho.SGK_MAP;
  return m && Array.isArray(m.bo) ? m.bo.filter((b) => (b.sach || []).length) : [];
}

/* Một quyển sách = một mục, mỗi bài một HÀNG BẤM ĐƯỢC.
   Không dùng <table> nữa: ba cột chữ dài luôn tràn ngang ở mọi khổ máy, đọc
   phải kéo qua kéo lại. Lưới CSS co lại thành một cột trên điện thoại. */
function mucSach(s, theoId, mo) {
  const hang = (s.bai || []).map((b) => {
    const muc = b.cua ? theoId.get(b.cua) : null;
    /* Cánh Diều đánh số bài lặp lại theo từng chủ đề, nên thiếu mã chủ đề là
       "Bài 1" của chủ đề A và của chủ đề F trông y hệt nhau. */
    /* Ba bộ sách đánh số bài ba kiểu khác nhau — hiện ĐÚNG như sách in:
         maBai có sẵn (Chân trời): "Bài F14"
         chuDe + so   (Cánh Diều): "Chủ đề F · Bài 14"
         chỉ có so       (KNTT)  : "Bài 14"
         so = null (chủ đề một bài, sách không đánh số): "Chủ đề D" trần. */
    const soTxt = b.maBai
      ? "Bài " + esc(b.maBai)
      : (b.chuDe ? "Chủ đề " + esc(b.chuDe) : "") +
        (b.so != null ? (b.chuDe ? " · " : "") + "Bài " + b.so : "");
    const trai =
      `<span class="dc-so">${soTxt}${b.trang ? "<small>tr. " + esc(b.trang) + "</small>" : ""}</span>` +
      `<span class="dc-ten">${esc(b.ten)}</span>`;
    const phai = muc
      ? `<span class="dc-toi">Bài ${muc.bai.order}. ${esc(muc.bai.title)}</span>`
      : '<span class="dc-toi dc-trong">chưa có bài tương ứng</span>';
    /* data-tim: chuỗi không dấu để ô lọc tìm được cả khi gõ thiếu dấu. */
    /* Gộp cả cách gõ tự nhiên ("chủ đề F") lẫn mã trần, và tên bài hai bên. */
    const tim = esc(boDau((b.so + " bài " + b.so + " " +
      (b.chuDe ? "chủ đề " + b.chuDe + " " : "") + (b.tenChuDe || "") + " " +
      b.ten + " " + (muc ? muc.bai.title : "")).toLowerCase()));
    return muc
      ? `<a class="dc-hang" href="/bai/${muc.slug}" data-tim="${tim}">${trai}${phai}</a>`
      : `<div class="dc-hang dc-kho" data-tim="${tim}">${trai}${phai}</div>`;
  }).join("");

  /* Mỗi quyển là một khối THU/MỞ: một bộ có tới 5 quyển, để mở hết thì trang dài
     cả nghìn dòng. Dùng <details> của HTML nên không cần thư viện, và nội dung
     vẫn nằm trong DOM để Google đọc được đủ. */
  return `<details class="pg-card dc-muc" id="${esc(s.ma)}"${mo ? " open" : ""}>
    <summary class="dc-dau">
      <h2>${esc(tenQuyen(s))}</h2>
      <span class="dc-dem">${(s.bai || []).length} bài</span>
    </summary>
    <div class="dc-bang">${hang}</div>
  </details>`;
}

/* Ô lọc + thanh nhảy: hai thứ này để KHÔNG PHẢI CUỘN qua cả trăm dòng.
   Gõ "16" hoặc "css" là còn đúng mấy dòng cần xem. Chạy hoàn toàn ở trình duyệt
   nên Google vẫn thấy đủ nội dung. */
const JS_LOC = "(function(){var o=document.getElementById('dcTim');if(!o)return;" +
  "var h=[].slice.call(document.querySelectorAll('.dc-hang'));" +
  "var m=[].slice.call(document.querySelectorAll('.dc-muc'));var d=document.getElementById('dcDem');" +
  "function bd(s){return s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/đ/g,'d')}" +
  "function loc(){var t=bd(o.value.toLowerCase().trim());var n=0;" +
  "h.forEach(function(x){var ok=!t||x.dataset.tim.indexOf(t)>=0;x.hidden=!ok;if(ok)n++;});" +
  /* Quyển nào còn kết quả thì MỞ RA luôn — đang lọc mà vẫn phải bấm mở từng
     quyển thì ô lọc mất tác dụng. Xoá ô lọc thì thu về như cũ (mở quyển đầu). */
  "m.forEach(function(s,i){var v=s.querySelector('.dc-hang:not([hidden])');s.hidden=!v;" +
  "if(t)s.open=!!v;else s.open=(i===0);});" +
  "if(d)d.textContent=t?('Đang hiện '+n+' bài khớp \"'+o.value.trim()+'\"'):'';}" +
  "o.addEventListener('input',loc);" +
  /* Bấm ở thanh nhảy: mở quyển đó ra rồi mới cuộn tới, không thì nhảy vào một
     khối đang đóng và người dùng tưởng hỏng. */
  "[].forEach.call(document.querySelectorAll('.seo-jump a'),function(a){" +
  "a.addEventListener('click',function(){var el=document.getElementById(a.hash.slice(1));" +
  "if(el){el.open=true;}});});" +
  "})();";

/* Lọc danh sách bài: ô gõ + chip chủ đề. Đọc luôn #cd-<mã> trên URL để các chip
   ở trang chủ ("Lập trình Python"…) mở thẳng đúng mạch kiến thức đó. Chạy ở
   trình duyệt nên Google vẫn thấy đủ 119 bài. */
const JS_LOC_BAI = "(function(){var o=document.getElementById('seoTim');if(!o)return;" +
  "var a=[].slice.call(document.querySelectorAll('.seo-grid a'));" +
  "var g=[].slice.call(document.querySelectorAll('.seo-grid'));" +
  "var chip=[].slice.call(document.querySelectorAll('.seo-chip'));" +
  "var d=document.getElementById('seoDem');var cd='';" +
  "function bd(s){return s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/đ/g,'d')}" +
  "function loc(){var t=bd(o.value.toLowerCase().trim());var n=0;" +
  "a.forEach(function(x){var ok=(!t||x.dataset.tim.indexOf(t)>=0)&&(!cd||x.dataset.cd===cd);x.hidden=!ok;if(ok)n++;});" +
  /* Cập nhật luôn số bài ghi cạnh tên lớp — để nguyên số cũ khi đang lọc thì
     đầu mục ghi "34 bài" mà bên dưới chỉ có 3, trông như hỏng. */
  /* Ẩn/hiện cả khối <details> của lớp, không ẩn riêng lưới và tiêu đề — ẩn lẻ
     thì còn trơ lại mũi tên mở/thu của một mục rỗng. Và khi đang lọc thì MỞ
     khối có kết quả, kẻo người dùng thu gọn lớp đó từ trước rồi tưởng không tìm
     ra bài nào. */
  "g.forEach(function(x){var v=x.querySelectorAll('a:not([hidden])').length;" +
  "var box=x.closest('.seo-lop-box');if(box){box.hidden=!v;if(v&&(t||cd))box.open=true;}" +
  "var h=x.previousElementSibling;if(h&&h.classList.contains('seo-lop')){" +
  "var s=h.querySelector('span');if(s)s.textContent=v+' bài';}});" +
  "chip.forEach(function(c){c.classList.toggle('on',(c.dataset.cd||'')===cd)});" +
  "if(d)d.textContent=(t||cd)?('Đang hiện '+n+' bài'):'';}" +
  "chip.forEach(function(c){c.addEventListener('click',function(){cd=c.dataset.cd||'';loc();" +
  "history.replaceState(null,'',cd?('#cd-'+cd):location.pathname);})});" +
  "o.addEventListener('input',loc);" +
  /* Đọc chủ đề từ phần neo, và đọc LẠI mỗi khi neo đổi: đổi mỗi phần neo trên
     trang đã tải sẵn thì trình duyệt KHÔNG chạy lại script, nên link dạng
     /bai#cd-G bấm từ trong trang (hoặc sửa tay trên thanh địa chỉ) sẽ không áp
     được bộ lọc — nhìn y như hỏng. */
  "function theoNeo(cuon){var m=(location.hash||'').match(/^#cd-([A-G])$/);" +
  "cd=m?m[1]:'';loc();" +
  "if(m&&cuon){var k=document.querySelector('.seo-loc-hop');if(k)k.scrollIntoView({block:'start'});}}" +
  "if(/^#cd-/.test(location.hash||''))theoNeo(true);" +
  "window.addEventListener('hashchange',function(){if(/^#cd-/.test(location.hash||''))theoNeo(false);});" +
  "})();";

function trangDoiChieu(base, boMa) {
  const { theoId, kho } = chiMuc();
  const ds = danhSachBo(kho);
  if (!ds.length) return null;
  const bo = boMa ? ds.find((b) => b.ma === boMa) : ds[0];
  if (!bo) return null;

  /* Một bộ thì để nguyên ở /doi-chieu-sgk cho khỏi chia đôi tín hiệu SEO; từ bộ
     thứ hai trở đi mỗi bộ một trang riêng (đúng thứ học sinh gõ: "… cánh diều"). */
  const nhieuBo = ds.length > 1;
  const duong = nhieuBo ? "/doi-chieu-sgk/" + bo.ma : "/doi-chieu-sgk";
  const khoaCache = "__dc|" + bo.ma + "|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);

  const lop = [...new Set(bo.sach.map((s) => s.lop))].sort();
  const chonBo = nhieuBo
    ? '<nav class="dc-bo">' + ds.map((b) =>
        b.ma === bo.ma
          ? '<span class="dc-bo-on">' + esc(b.tenNgan || b.ten) + "</span>"
          : '<a href="/doi-chieu-sgk/' + esc(b.ma) + '">' + esc(b.tenNgan || b.ten) + "</a>").join("") + "</nav>"
    : "";

  /* Dùng chung lớp .seo-jump với trang /bai — lớp .seo-nhay trước đây không có
     CSS nào nên các liên kết dính sát vào nhau thành một khối chữ. */
  const nhay = '<nav class="seo-jump" aria-label="Nhảy tới quyển sách">' + bo.sach.map((s) =>
    '<a href="#' + esc(s.ma) + '">' + esc(tenQuyen(s)) +
    ' <span style="opacity:.65">' + (s.bai || []).length + "</span></a>").join("") + "</nav>";

  const body = `
<div class="pg-hero left">
  <span class="eyebrow">Đối chiếu chương trình</span>
  <h1>Đối chiếu bài học với SGK ${esc(bo.tenNgan || bo.ten)}</h1>
  <p class="lead">Bài trong ứng dụng là bài giảng tự biên soạn theo Chương trình GDPT 2018 và
  <b>đã sắp lại thứ tự cho dễ học</b> nên số bài không trùng sách. Tra theo đúng số bài của sách
  để mở nhanh phần bạn đang học trên lớp.</p>
</div>
${chonBo}
<div class="pg-card dc-tim-hop">
  <label for="dcTim">Tìm nhanh — gõ số bài hoặc vài chữ trong tên bài</label>
  <input class="pg-input" id="dcTim" type="search" placeholder="ví dụ: 16 · css · mạng máy tính · học máy" autocomplete="off">
  <p class="pg-note" id="dcDem"></p>
  ${nhay}
</div>
${bo.sach.map((s, i) => mucSach(s, theoId, i === 0)).join("")}
<div class="pg-card">
  <p class="pg-note" style="margin:0">Đang có ${bo.sach.length} quyển của bộ <b>${esc(bo.ten)}</b>${
    lop.length ? " (lớp " + lop.join(", ") + ")" : ""}.
  Nhánh Tin học ứng dụng và các bộ sách khác sẽ bổ sung khi có sách.
  Một bài trong ứng dụng đôi khi gộp hai bài của sách, và ngược lại một bài sách dài có thể được tách đôi —
  nên vài bài của ứng dụng không xuất hiện ở bảng này, <b>không phải vì nằm ngoài chương trình</b>.</p>
</div>`;

  const html = khung({
    title: `Đối chiếu SGK ${bo.tenNgan || bo.ten} — Tin học ${lop.join(", ")}`,
    desc: `Tra nhanh bài trong sách giáo khoa Tin học ${bo.tenNgan || bo.ten} tương ứng bài nào trong ứng dụng ôn thi, kèm số trang. Đủ lớp ${lop.join(", ")}.`,
    canonical: base + duong,
    body,
    them: "<script>" + JS_LOC + "</script>",
    ld: {
      "@context": "https://schema.org",
      "@type": "Table",
      about: "Đối chiếu chương trình Tin học THPT với sách giáo khoa " + bo.ten,
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

  /* Mỗi bộ sách một trang riêng — đúng thứ học sinh gõ ("… cánh diều"). Khi mới
     có ĐÚNG MỘT bộ thì gom hết về /doi-chieu-sgk, tránh hai URL cùng nội dung. */
  r.get("/doi-chieu-sgk/:bo", (req, res, next) => {
    try {
      const { kho } = chiMuc();
      const ds = danhSachBo(kho);
      if (ds.length <= 1) return res.redirect(301, "/doi-chieu-sgk");
      const html = trangDoiChieu(goc(req), String(req.params.bo || "").toLowerCase());
      if (!html) return res.redirect(302, "/doi-chieu-sgk");
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
${(() => {
        const ds = danhSachBo(chiMuc().kho);
        if (!ds.length) return "";
        /* Một bộ -> chỉ /doi-chieu-sgk. Nhiều bộ -> thêm trang riêng từng bộ. */
        return [url(base + "/doi-chieu-sgk", "0.8", lmBai)]
          .concat(ds.length > 1 ? ds.map((b) => url(base + "/doi-chieu-sgk/" + b.ma, "0.8", lmBai)) : [])
          .join("\n");
      })()}
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
