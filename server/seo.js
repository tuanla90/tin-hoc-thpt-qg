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

/* Số quyển hiện thẳng ở khối "Tương ứng sách giáo khoa"; phần dư gấp vào
   <details>. Ba bộ x hai định hướng nên một bài có thể ứng tới 18 quyển (bài
   hướng nghiệp Tin 12) — trải hết là khối tham chiếu cao gần 1000px, dài hơn cả
   phần nội dung nó đứng cạnh. Mức 6 để 110/119 bài vẫn hiện trọn. */
const SGK_HIEN = 6;

function dongSgk(b) {
  return "<li>" +
    `<span class="seo-sgk-bo">${esc(b.bo)}</span>` +
    `<span class="seo-sgk-noi"><em>${esc(tenQuyen(b.sach))}</em> — ` +
    (b.maBai
      ? "Bài " + esc(b.maBai) + ". "
      : (b.chuDe ? "Chủ đề " + esc(b.chuDe) + (b.so != null ? " · " : ", ") : "") +
        (b.so != null ? "Bài " + b.so + ". " : "")) + esc(b.ten) + "</span>" +
    (b.trang ? `<i class="seo-sgk-tr">tr. ${esc(b.trang)}</i>` : "") + "</li>";
}

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
/* Bắc cầu biến màu cho khối minh hoạ: js/minh-hoa.js viết cho css/styles.css của
   app (--bg-card, --border, --primary…), còn trang công khai dùng landing.css với
   tên khác (--surface-card, --line, --brand…). Không map thì minh hoạ mất hết màu.
   Biến CSS kế thừa nên đặt ở khối bọc là đủ. */
.mh-cau-noi{--bg-card:var(--surface-card);--bg-soft:var(--bg-subtle);--border:var(--line);
  --primary:var(--brand);--primary-soft:var(--brand-soft);--primary-d:var(--brand-dark);
  --text:var(--ink-main);--text-soft:var(--ink-muted);--success:#16a34a;--radius:14px;
  /* Đợt minh hoạ thứ ba dùng thêm bộ màu trạng thái và --border-strong; không map
     thì bảng chân trị mất hẳn phần tô đúng/sai, tức là mất luôn nội dung. Lấy đúng
     mã trong css/styles.css chứ không đoán, để hai bên nhìn giống nhau. */
  --border-strong:#cbd5e1;--danger:#f43f5e;--danger-soft:#fff1f2;--success-soft:#ecfdf5;
  --warning:#f59e0b;--warning-soft:#fffbeb;--info:#0d9488;--code-bg:#eef2f8}
.mh-cau-noi .mh{margin:0;border:0;padding:0;background:transparent}
/* Nhãn lớp trong khối "Bài liên quan": xuống dòng riêng cho khỏi dính vào tên
   bài, và nhạt hơn để tên bài vẫn là thứ đọc trước. */
.seo-lq-lop{display:block;margin-top:3px;font-weight:600;font-size:12.5px;color:var(--ink-faint)}
/* Thẻ xưởng thực hành: .seo-grid a mặc định xếp NGANG (số bài + tên), còn thẻ này
   có ba dòng nên phải xếp dọc, không thì ba dòng nằm cạnh nhau và tràn thẻ. */
.seo-grid a.seo-lq{flex-direction:column;gap:2px}
.seo-lq .seo-lq-lop{margin-top:0}
.seo-lq-ten{font-size:14.5px;font-weight:650;line-height:1.4}
.seo-lq-so{font-size:12.5px;color:var(--ink-muted);line-height:1.5}
/* Đề mẫu của xưởng */
.seo-de-ds{display:grid;gap:10px;margin-top:12px}
.seo-de{background:var(--bg-subtle);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.seo-de-txt{font-size:14.5px;line-height:1.55}
.seo-de-bai{margin-top:7px;font-size:12.5px;color:var(--ink-muted)}
.seo-de-bai a{color:var(--brand);font-weight:700;text-decoration:none}
.seo-de-bai a:hover{text-decoration:underline}
.seo-lop{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:30px 0 0;
  padding-top:14px;border-top:1px solid var(--line)}
.seo-lop h2{margin:0;font-size:20px}
.seo-lop span{color:var(--ink-faint);font-size:13.5px}
/* Nhảy nhanh tới từng lớp — không phải cuộn qua cả trăm bài */
.seo-jump{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 4px}
.seo-jump a{font-size:13.5px;font-weight:650;text-decoration:none;color:var(--ink-muted);
  background:var(--bg-subtle);border:1px solid var(--line);border-radius:999px;padding:10px 15px;
  display:inline-flex;align-items:center;min-height:40px}
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
.seo-q-no{font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:4px}
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
/* --sgk-nhan: màu chữ cho nhãn. KHÔNG dùng thẳng --accent-teal (#0d9488): trên
   nền hộp nó chỉ đạt ~3,3:1 ở nền sáng và ~2,6:1 ở nền tối, mà đây là chữ 11–12px
   in hoa nên đọc rất mờ. Hai sắc dưới cho ~4,9:1 và ~6,5:1. Viền hộp vẫn để
   --accent-teal vì viền không phải chữ. */
.seo-sgk{--sgk-nhan:#0f766e;margin-top:16px;padding:12px 15px;background:var(--accent-teal-soft);
  border:1px solid var(--accent-teal);border-radius:12px;font-size:14px;line-height:1.6;color:var(--ink-main)}
.seo-sgk b{display:block;font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--sgk-nhan);margin-bottom:2px}
/* Chỉ bỏ nghiêng ở đây. Đừng đặt màu: luật này là .seo-sgk i (0,1,1), đè mất
   .seo-sgk-tr (0,1,0) nên số trang giữ nguyên --ink-muted kể cả ở nền tối. */
.seo-sgk i{font-style:normal}
/* Màu link mặc định là xanh dương, đặt lên nền teal chỉ được 2,1:1 lúc tối.
   Buộc theo --sgk-nhan và trả lại gạch chân cho biết đây là link. */
.seo-sgk a{display:inline-block;margin-top:8px;font-size:13.5px;font-weight:650;
  text-decoration:underline;text-underline-offset:3px}
/* pages.css có .pg-main a:not(.btn):not(.pg-zalo) — độ đặc trưng (0,3,1), cao hơn
   .seo-sgk a (0,1,1) — nên link ở đây bị kéo về màu chàm --brand, đặt trên nền
   teal đậm chỉ còn 2,1:1. Phải nhắc lại màu ở mức đặc trưng cao hơn. */
.pg-main .seo-sgk a:not(.btn):not(.pg-zalo){color:var(--sgk-nhan)}
/* Mỗi quyển sách MỘT DÒNG. Trước đây các mục là thẻ span (inline) nối bằng chuỗi
   rỗng nên dính liền nhau: "...trang 67)Cánh Diều · Tin học 11..." — nhìn như
   lỗi dữ liệu. Một bài có thể ứng với 4 quyển (2 bộ x 2 định hướng) nên càng
   phải tách bạch. Tên bộ tách thành nhãn để mắt bắt nhanh, số trang đẩy sang
   phải cho các dòng thẳng cột. */
.seo-sgk-ds{list-style:none;margin:6px 0 0;padding:0}
.seo-sgk-ds li{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:6px 0;
  border-top:1px solid color-mix(in srgb, var(--accent-teal) 22%, transparent)}
.seo-sgk-ds li:first-child{border-top:0}
.seo-sgk-bo{flex:none;font-size:12.5px;font-weight:750;letter-spacing:.02em;text-transform:uppercase;
  color:var(--sgk-nhan);background:var(--surface-card);border-radius:999px;padding:2px 9px}
.seo-sgk-noi{flex:1;min-width:190px;line-height:1.5}
.seo-sgk-them summary{cursor:pointer;padding:7px 0 0;font-size:13px;font-weight:650;color:var(--sgk-nhan)}
.seo-sgk-them summary::marker{color:var(--sgk-nhan)}
.seo-sgk-them .seo-sgk-ds{margin-top:0}
.seo-sgk-them .seo-sgk-ds li:first-child{border-top:1px solid color-mix(in srgb, var(--accent-teal) 22%, transparent)}
.seo-sgk-noi em{font-style:normal;font-weight:650}
.seo-sgk-tr{flex:none;margin-left:auto;font-size:12.5px;color:var(--sgk-mo,var(--ink-muted));font-family:var(--font-mono)}
/* Màn hẹp: để nguyên một hàng thì tên quyển chỉ còn ~215px, mỗi mục ngốn 3–4
   dòng chữ. Đảo thứ tự cho nhãn bộ và số trang đứng chung hàng trên, tên bài
   xuống dưới ăn trọn chiều ngang — mỗi mục rút còn 2 dòng. */
@media (max-width:560px){
  .seo-sgk-bo{order:1}
  .seo-sgk-tr{order:2}
  .seo-sgk-noi{order:3;flex-basis:100%;min-width:0}
}
/* --sgk-mo: nền hộp lúc tối là teal đậm, không phải nền trang, nên --ink-muted
   đặt lên chỉ được 3,7:1. Sắc bạc hà nhạt cho 5,7:1 mà vẫn nhạt hơn tên bài. */
[data-theme="dark"] .seo-sgk{--sgk-nhan:#5eead4;--sgk-mo:#8fd3c9;background:var(--info-soft,#134e4a);color:var(--ink-main)}
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
/* BẮT BUỘC: quy tắc display ở trên thắng [hidden] mặc định của trình duyệt, nên
   thiếu dòng này thì ô lọc đếm "1 bài khớp" mà cả 33 dòng vẫn nằm đó. */
.dc-hang[hidden],.dc-muc[hidden]{display:none}
/* Cả hàng là một thẻ <a> nên nếu không nói rõ, chữ tên bài SGK bị tô màu link —
   nhìn như mọi thứ đều bấm được. Chọn đủ cụ thể để thắng quy tắc màu liên kết
   chung của pages.css (.pg-card a). */
.dc-bang a.dc-hang,.dc-bang .dc-hang{color:var(--ink-main)}
.dc-bang .dc-hang .dc-ten{color:var(--ink-main)}
.dc-bang a.dc-hang .dc-toi{color:var(--brand)}
a.dc-hang:hover{background:var(--brand-soft)}
.dc-so{font-size:13px;font-weight:750;color:var(--ink-muted);white-space:nowrap}
.dc-so small{display:block;font-weight:500;font-size:12.5px;color:var(--ink-faint)}
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
  border-radius:999px;padding:10px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;
  font-family:inherit;font-size:13.5px;font-weight:650;line-height:1.2;min-height:40px}
.seo-chip span{font-size:12.5px;opacity:.65;font-family:var(--font-mono,monospace)}
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
  /* Ảnh chia sẻ và favicon phải là URL tuyệt đối thì Zalo/Facebook mới lấy được —
     suy ra gốc miền từ canonical (canonical luôn tuyệt đối, xem goc(req)). */
  const goc = String(o.canonical || "").replace(/^(https?:\/\/[^/]+).*$/, "$1");
  /* Trang danh sách (/bai, /doi-chieu-sgk) là mục lục chứ không phải bài viết —
     gắn article cho chúng là sai loại. */
  const ogType = o.ogType || "article";
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    "<title>" + esc(o.title) + "</title>\n" +
    '<meta name="description" content="' + esc(o.desc) + '">\n' +
    (o.noindex ? '<meta name="robots" content="noindex, follow">\n' : "") +
    '<link rel="canonical" href="' + esc(o.canonical) + '">\n' +
    '<link rel="icon" href="/asset/favicon.svg" type="image/svg+xml">\n' +
    '<meta property="og:type" content="' + ogType + '">\n' +
    '<meta property="og:title" content="' + esc(o.title) + '">\n' +
    '<meta property="og:description" content="' + esc(o.desc) + '">\n' +
    '<meta property="og:url" content="' + esc(o.canonical) + '">\n' +
    '<meta property="og:site_name" content="Ôn thi Tin học THPT">\n' +
    '<meta property="og:locale" content="vi_VN">\n' +
    '<meta property="og:image" content="' + esc(goc) + '/asset/og-cover.jpg">\n' +
    '<meta property="og:image:width" content="1200">\n' +
    '<meta property="og:image:height" content="630">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:image" content="' + esc(goc) + '/asset/og-cover.jpg">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400..800&family=Nunito:wght@300..900&family=JetBrains+Mono:wght@400..700&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="/css/landing.css">\n' +
    '<link rel="stylesheet" href="/css/pages.css">\n' +
    "<style>" + CSS_RIENG + "</style>\n" +
    (o.ld ? '<script type="application/ld+json">' + JSON.stringify(o.ld) + "</script>\n" : "") +
    '</head>\n<body class="lp">\n\n' +
    '<header class="lp-head"><div class="wrap">' +
      '<a class="brand" href="/"><span class="brand-mark" aria-hidden="true">' + LOGO_SVG + "</span>Tin Học KHMT</a>" +
      /* Menu KHỚP với trang chủ: khách bấm từ Google vào thấy đúng thanh điều
         hướng quen thuộc, không phải một bộ mục lạ. Lối vào /bai và
         /doi-chieu-sgk vẫn còn ở chân trang và ở dấu vết đường dẫn, nên Google
         lẫn người dùng đều không mất đường. */
      '<nav class="nav-links">' +
        '<a href="/#cach-hoc">Cách học</a>' +
        '<a href="/#tinh-nang">Tính năng</a>' +
        '<a href="/#lo-trinh">Lộ trình</a>' +
        '<a href="/#hoc-phi">Học phí</a>' +
        '<a href="/#tac-gia">Tác giả</a>' +
        '<a class="nav-opt" href="/#faq">Câu hỏi</a>' +
      "</nav>" +
      '<div class="head-actions">' +
        '<button class="btn btn-ghost btn-sm" id="themeToggle" title="Chuyển giao diện Sáng/Tối">' + IC_TRANG + "</button>" +
        '<a class="btn btn-primary btn-sm" href="/hoc">Học thử miễn phí</a>' +
      "</div>" +
    "</div></header>\n\n" +
    '<main class="pg-main"><div class="wrap pg-narrow">\n' + o.body + "\n</div></main>\n\n" +
    '<footer class="foot"><div class="wrap">' +
      '<div class="foot-top"><div>' +
        '<a class="brand" href="/"><span class="brand-mark" aria-hidden="true">' + LOGO_SVG + "</span>Tin học KHMT</a>" +
        '<p class="tagline">Ôn thi Tin học tốt nghiệp, định hướng Khoa học máy tính — dễ hiểu, thực hành thật.</p>' +
      "</div>" +
      '<nav class="foot-links">' +
        '<a href="/bai">Tất cả bài học</a>' +
        '<a href="/thuc-hanh">Thực hành</a>' +
        '<a href="/doi-chieu-sgk">Đối chiếu SGK</a>' +
        '<a href="/">Giới thiệu</a>' +
        '<a href="/nang-cap">Bảng giá &amp; nâng cấp</a>' +
        '<a href="/quyen-rieng-tu">Quyền riêng tư</a>' +
      "</nav></div>" +
      '<p class="copy">Nội dung do người dạy tự biên soạn theo Chương trình GDPT 2018 — không sao chép sách giáo khoa. ' +
      "© 2026 Ôn thi Tin học THPT · Lê Anh Tuấn (Tuấn LA Lab).</p>" +
    "</div></footer>\n" +
    "<script>" + JS_THEME + "</script>\n" +
    (o.them || "") + "\n</body>\n</html>";
}

/* ------------------------------ trang một bài ------------------------------ */
const CACHE = new Map(); // slug|__ds -> html (nội dung chỉ đổi khi deploy lại)

/* Bài cùng mạch kiến thức.
   Trước đây 119 trang bài chỉ nối nhau bằng trước/sau, nên mỗi mạch kiến thức là
   một chuỗi thẳng: Google khó thấy các bài cùng chủ đề thuộc về nhau, và người
   đọc muốn tìm bài liên quan phải quay ra danh sách. Ưu tiên bài cùng lớp để
   không đẩy học sinh lớp 12 sang bài lớp 10 giữa chừng. */
function lienQuanHtml(muc) {
  const { ds, kho } = chiMuc();
  const cd = muc.bai.topic;
  if (!cd) return "";
  const bo = new Set([muc.slug, muc.truoc && muc.truoc.slug, muc.sau && muc.sau.slug]);
  const hop = ds.filter((m) => m.bai.topic === cd && !bo.has(m.slug));
  if (hop.length < 2) return "";
  hop.sort((a, b) => (a.bai.grade === muc.bai.grade ? 0 : 1) - (b.bai.grade === muc.bai.grade ? 0 : 1));
  const chon = hop.slice(0, 6);
  const ten = tenChuDe(kho)[cd] || "cùng chủ đề";
  return `
<div class="pg-card">
  <h2 style="margin-top:0">Bài liên quan — ${esc(ten)}</h2>
  <p class="pg-note">Cùng mạch kiến thức với bài này, học nối tiếp cho chắc phần lí thuyết.</p>
  <div class="seo-grid">${chon.map((m) =>
    `<a href="/bai/${m.slug}"><span class="seo-so">${m.bai.order}</span>` +
    `<b>${esc(m.bai.title)}<span class="seo-lq-lop">${esc(m.lop)}</span></b></a>`).join("")}</div>
</div>`;
}

/* ---- Bài nào có minh hoạ động ----
   Quét ID trực tiếp từ hai tệp JS thay vì chép tay danh sách vào đây: chép tay
   là kiểu gì cũng có lúc thêm minh hoạ mà quên cập nhật, rồi trang công khai
   thiếu khối trong khi app thì có. Đọc một lần rồi nhớ. */
let MH_CO = null;
function baiCoMinhHoa() {
  if (MH_CO) return MH_CO;
  MH_CO = new Set();
  ["minh-hoa.js", "minh-hoa-2.js", "minh-hoa-3.js", "minh-hoa-4.js"].forEach((ten) => {
    try {
      const src = fs.readFileSync(path.join(__dirname, "..", "public", "js", ten), "utf8");
      // khớp cả 'dangKy("C10-22"' lẫn '"C10-23": nhiPhan' trong bảng THEO_BAI
      for (const m of src.matchAll(/dangKy\(\s*"([A-Z]\d{2}-\d{2})"/g)) MH_CO.add(m[1]);
      for (const m of src.matchAll(/"([A-Z]\d{2}-\d{2})":\s*[a-zA-Z]/g)) MH_CO.add(m[1]);
    } catch (e) { /* thiếu tệp thì đơn giản là không có bài nào */ }
  });
  return MH_CO;
}

/* Khối minh hoạ trên trang công khai.
   Trang này CỐ Ý không nạp bundle của app (nặng ~1,2MB). Ba tệp minh hoạ thì
   độc lập hoàn toàn — không đụng State, LESSONS hay QUESTION_BANK — nên nạp
   riêng được, tổng ~130KB và chỉ nạp ở những bài thật có minh hoạ (hiện 22 bài). */
function minhHoaHtml(muc) {
  const id = muc.bai.id;
  if (!baiCoMinhHoa().has(id)) return { than: "", them: "" };
  const than = `
<div class="pg-card">
  <h2>Thử ngay: minh hoạ từng bước</h2>
  <p class="pg-note" style="margin-top:0">Bấm từng bước để tự xem cơ chế hoạt động, hoặc bấm
    “Tự chạy” cho nó tiến mỗi giây một lần. Đổi được dữ liệu đầu vào — không cần đăng nhập.</p>
  <div class="mh-cau-noi" id="mhMount" data-bai="${esc(id)}"></div>
  <noscript><p class="pg-note">Minh hoạ này cần bật JavaScript.
    <a href="/hoc#/lesson/${esc(id)}">Mở trong ứng dụng</a>.</p></noscript>
</div>`;
  const them = `<script src="/js/minh-hoa.js" defer></script>
<script src="/js/minh-hoa-2.js" defer></script>
<script src="/js/minh-hoa-3.js" defer></script>
<script src="/js/minh-hoa-4.js" defer></script>
<script>window.addEventListener("load",function(){var h=document.getElementById("mhMount");` +
    `if(h&&window.MinhHoa)window.MinhHoa.veVao(h,h.dataset.bai)});</script>`;
  return { than, them };
}

function trangBai(muc, base) {
  const khoaCache = muc.slug + "|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);

  const { kho } = chiMuc();
  const l = muc.bai;
  const mh = minhHoaHtml(muc);
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
  <ul class="seo-sgk-ds">${sgk.slice(0, SGK_HIEN).map(dongSgk).join("")}</ul>
  ${sgk.length > SGK_HIEN ? `<details class="seo-sgk-them">
    <summary>Xem thêm ${sgk.length - SGK_HIEN} quyển</summary>
    <ul class="seo-sgk-ds">${sgk.slice(SGK_HIEN).map(dongSgk).join("")}</ul>
  </details>` : ""}
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

${mh.than}

<div class="pg-card" style="text-align:center">
  <h2>Học trọn bài này trong ứng dụng</h2>
  <p class="pg-note">Bài giảng đầy đủ, ${(l.quiz || []).length} câu luyện tập chấm tự động, thi thử đúng cấu trúc đề tốt nghiệp
  (24 trắc nghiệm + 4 Đúng/Sai), bài thực hành máy tự chấm và gia sư AI giải thích chỗ sai.</p>
  <p style="margin-top:14px"><a class="btn btn-primary btn-lg" href="/hoc#/lesson/${esc(l.id)}">Mở bài ${l.order} trong ứng dụng</a></p>
  <p class="pg-note" style="margin-top:10px">Phần học miễn phí, không cần tạo tài khoản.</p>
</div>

${lienQuanHtml(muc)}

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

  const html = khung({ title: tieuDe, desc, canonical, body, ld, them: mh.them });
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
  <p style="margin-top:14px"><a class="btn btn-primary btn-lg" href="/hoc">Bắt đầu học miễn phí</a></p>
</div>`;

  const html = khung({
    title: `Ôn tập Tin học THPT — ${ds.length} bài lý thuyết & trắc nghiệm có đáp án`,
    desc: `Tổng hợp ${ds.length} bài Tin học lớp 10, 11, 12: tóm tắt lý thuyết, thuật ngữ tiếng Anh và câu trắc nghiệm có đáp án, bám cấu trúc đề thi tốt nghiệp THPT.`,
    canonical: base + "/bai",
    ogType: "website",
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
    /* data-tim: chuỗi không dấu để ô lọc tìm được cả khi gõ thiếu dấu.
       Phải chứa ĐÚNG CÁI ĐANG IN TRÊN HÀNG, nếu không người ta gõ lại thứ vừa
       nhìn thấy mà máy báo không có: bộ Chân trời in "Bài E7" nhưng chuỗi tìm
       chỉ có số 7 thì gõ "E7" ra rỗng. Gộp cả cách gõ tự nhiên ("chủ đề F")
       lẫn mã trần, và tên bài của cả hai bên. */
    const tim = esc(boDau([
      b.maBai ? b.maBai + " bài " + b.maBai : "",
      b.so != null ? b.so + " bài " + b.so : "",
      b.chuDe ? "chủ đề " + b.chuDe : "",
      b.tenChuDe || "", b.ten, muc ? muc.bai.title : "",
    ].join(" ").toLowerCase()));
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

  /* Câu chốt cuối trang phải nói đúng tình trạng của TỪNG bộ: bộ đủ 5 quyển thì
     đừng hứa "sẽ bổ sung", còn bộ Chân trời thiếu lớp 10-11 là do nhà xuất bản
     không làm sách chứ không phải chúng ta chưa đối chiếu — nói nhầm hướng nào
     cũng khiến người tra tưởng bảng còn dở. */
  const duLop = [10, 11, 12].every((n) => lop.includes(n));
  const duHuong = [11, 12].every((n) =>
    !lop.includes(n) || bo.sach.filter((s) => s.lop === n).length >= 2);
  const tinhTrang = duLop && duHuong
    ? "Đủ cả ba lớp và cả hai định hướng từ lớp 11."
    : duHuong
      ? "Bộ này chỉ xuất bản sách Tin học cho lớp " + lop.join(", ") + "."
      : "Các quyển còn lại sẽ bổ sung khi có sách.";
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
    lop.length ? " (lớp " + lop.join(", ") + ")" : ""}. ${tinhTrang}
  Một bài trong ứng dụng đôi khi gộp hai bài của sách, và ngược lại một bài sách dài có thể được tách đôi —
  nên vài bài của ứng dụng không xuất hiện ở bảng này, <b>không phải vì nằm ngoài chương trình</b>.</p>
</div>`;

  const html = khung({
    title: `Đối chiếu SGK ${bo.tenNgan || bo.ten} — Tin học ${lop.join(", ")}`,
    desc: `Tra nhanh bài trong sách giáo khoa Tin học ${bo.tenNgan || bo.ten} tương ứng bài nào trong ứng dụng ôn thi, kèm số trang. Đủ lớp ${lop.join(", ")}.`,
    canonical: base + duong,
    ogType: "website",
    body,
    them: "<script>" + JS_LOC + "</script>",
    ld: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Đối chiếu SGK ${bo.tenNgan || bo.ten} — Tin học ${lop.join(", ")}`,
      inLanguage: "vi",
      about: "Đối chiếu chương trình Tin học THPT với sách giáo khoa " + bo.ten,
      isPartOf: { "@type": "WebSite", name: "Ôn thi Tin học THPT", url: base + "/" },
    },
  });
  CACHE.set(khoaCache, html);
  return html;
}

/* --------------------------------- router --------------------------------- */
/* ==========================================================================
 *  TRANG CÔNG KHAI CHO BỐN XƯỞNG THỰC HÀNH
 *
 *  Trong ứng dụng, bốn xưởng đã có địa chỉ riêng (#/playground/sql...) nhưng đó là
 *  HASH — với Google cả bốn vẫn là một trang /hoc, nên "thực hành Python online"
 *  hay "luyện SQL online" không có trang nào để xếp hạng. Bốn trang dưới đây là
 *  trang thật, dựng sẵn HTML, mỗi xưởng một URL.
 *
 *  Nội dung KHÔNG bịa: số bài, đề bài mẫu và danh sách bài học đều đọc từ chính
 *  kho bài tập mà ứng dụng đang dùng, nên trang không bao giờ nói quá.
 * ========================================================================= */
const XUONG = [
  {
    ma: "python", slug: "python", lang: "python", ten: "Python",
    tenDai: "Thực hành Python online",
    khoa: "python",
    mo: "Viết Python ngay trong trình duyệt rồi bấm Chạy — không cài Python, không cài IDE, mở bằng điện thoại cũng được. Máy so kết quả với đáp án và nói ngay đúng hay sai.",
    lam: [
      "Gõ code vào khung soạn rồi bấm <b>Chạy &amp; Kiểm tra</b> — máy chạy thật, không phải chấm bằng cách so từng chữ.",
      "Sai thì có <b>Gợi ý</b> và <b>Đáp án mẫu</b>; vấp hai lần thì hiện thêm nút hỏi gia sư AI về đúng bài đó.",
      "Đủ dạng của chương trình lớp 10–11: biến, nhập/xuất, rẽ nhánh, vòng lặp, danh sách, xâu, hàm, đệ quy, tìm kiếm và sắp xếp.",
    ],
    hoi: [
      ["Có phải cài Python không?", "Không. Trình chạy Python hoạt động ngay trong trình duyệt (Skulpt). Lần chạy đầu cần mạng để tải trình chạy khoảng 1 MB, sau đó chạy được cả khi mất mạng."],
      ["Máy chấm kiểu gì?", "Máy chạy chương trình của bạn rồi so phần in ra với kết quả mong đợi của đề. Viết cách khác mà in ra đúng thì vẫn được tính đúng."],
      ["Dùng được trên điện thoại không?", "Được. Khung soạn code và nút Chạy đều vừa màn hình điện thoại, tuy gõ code trên máy tính vẫn nhanh hơn."],
    ],
  },
  {
    ma: "web", slug: "html-css", lang: "web", ten: "HTML/CSS",
    tenDai: "Thực hành HTML và CSS online",
    khoa: "web",
    mo: "Gõ HTML/CSS và thấy trang web hiện ra ngay bên cạnh. Máy đối chiếu với yêu cầu của đề — đúng thẻ, đúng thuộc tính mới tính là xong.",
    lam: [
      "Sửa code là <b>xem trước cập nhật ngay</b>, khỏi lưu tệp rồi mở lại bằng trình duyệt.",
      "Bài tập theo đúng mạch Tin học 12: thẻ cơ bản, danh sách, bảng, hình ảnh, liên kết, biểu mẫu, bộ chọn CSS, mô hình hộp, bố cục.",
      "Không chạy JavaScript trong phần xem trước — an toàn cho máy của trường.",
    ],
    hoi: [
      ["Trang xem trước có chạy JavaScript không?", "Không. Phần xem trước chỉ dựng HTML và CSS, cố ý không chạy JavaScript để an toàn khi dùng máy chung ở trường."],
      ["Có cần cài phần mềm gì không?", "Không. Chỉ cần trình duyệt — kể cả trình duyệt trên điện thoại."],
      ["Máy chấm HTML thế nào?", "Máy đọc cấu trúc trang bạn vừa viết và kiểm đúng những gì đề yêu cầu (có thẻ nào, chữ gì, thuộc tính nào), chứ không so từng dấu cách."],
    ],
  },
  {
    ma: "sql", slug: "sql", lang: "sql", ten: "SQL",
    tenDai: "Thực hành SQL online",
    khoa: "sql",
    mo: "Viết câu truy vấn SQL và chạy thật trên cơ sở dữ liệu mẫu ngay trong trình duyệt (SQLite). Máy so bảng kết quả với đáp án, không so chữ.",
    lam: [
      "Chạy <code>SELECT</code>, <code>WHERE</code>, <code>ORDER BY</code>, <code>JOIN</code>, <code>GROUP BY</code> trên bảng mẫu có sẵn dữ liệu.",
      "Máy <b>so bảng kết quả</b>, nên viết câu khác cách mà ra đúng dữ liệu thì vẫn đúng.",
      "Có sẵn sơ đồ bảng bên cạnh đề, khỏi phải nhớ tên cột.",
    ],
    hoi: [
      ["Chạy SQL ở đâu, có cần cài MySQL không?", "Không cần cài gì. Cơ sở dữ liệu SQLite chạy ngay trong trình duyệt, dữ liệu mẫu nằm sẵn trong bài."],
      ["Viết truy vấn khác đáp án mẫu có được tính không?", "Được, miễn bảng kết quả đúng. Riêng những bài yêu cầu sắp xếp thì thứ tự dòng cũng phải đúng."],
      ["Có mất dữ liệu của bài khác không?", "Không. Mỗi bài dựng lại dữ liệu mẫu riêng, bạn thử xoá hay sửa thoải mái."],
    ],
  },
  {
    ma: "gfx", slug: "do-hoa", lang: "gfx", ten: "Đồ hoạ",
    tenDai: "Thực hành đồ hoạ và ảnh online",
    khoa: "gfx",
    mo: "Kéo hình, xếp lớp, khoanh vùng chọn, pha màu RGB, sắp trình tự dựng phim — thao tác thật bằng chuột trong trình duyệt rồi máy chấm, không cần cài Photoshop hay GIMP.",
    lam: [
      "Tám kiểu thao tác: chỉnh sáng/tương phản, xếp lớp, khoanh vùng chọn, pha màu, nối khái niệm, sắp trình tự, bấm đúng công cụ, kéo hình vào chỗ.",
      "Hình vẽ trong bài là <b>hình tự dựng bằng SVG</b> — không dùng ảnh của ai nên không vướng bản quyền.",
      "Bám đúng phần Thiết kế đồ hoạ (Tin 10) và nhánh Tin học ứng dụng: ảnh, ảnh động, dựng phim.",
    ],
    hoi: [
      ["Có cần cài Photoshop hay GIMP không?", "Không. Các bài mô phỏng đúng thao tác của phần mềm thật (lớp, vùng chọn, thanh chỉnh màu) nhưng chạy hoàn toàn trong trình duyệt."],
      ["Đây có phải phần mềm đồ hoạ thật không?", "Không, và bài học cũng nói rõ như vậy. Mục đích là luyện đúng khái niệm và trình tự thao tác để khi ngồi vào phần mềm thật thì làm được ngay."],
      ["Dùng chuột hay ngón tay đều được chứ?", "Được cả hai. Phần kéo-thả và khoanh vùng đều nhận cả chuột lẫn cảm ứng."],
    ],
  },
];
const XUONG_THEO_SLUG = new Map(XUONG.map((x) => [x.slug, x]));

/* Đọc kho bài tập của một xưởng từ chính dữ liệu ứng dụng đang dùng */
function baiTapXuong(x) {
  const { kho, theoId } = chiMuc();
  const nguon = x.ma === "gfx" ? (kho.GLAB || {}) : ((kho.BT || {})[x.khoa] || {});
  const bai = [];
  let soBt = 0;
  Object.keys(nguon).forEach((id) => {
    const ds = nguon[id];
    if (!Array.isArray(ds) || !ds.length) return;
    const muc = theoId.get(id);
    if (!muc) return;                       // bài đã gỡ khỏi lộ trình
    soBt += ds.length;
    bai.push({ muc, ds });
  });
  bai.sort((a, b) => a.muc.i - b.muc.i);
  return { bai, soBt, soBai: bai.length };
}

/* Đề mẫu: lấy rải đều các bài học chứ không dồn mấy bài đầu, để người đọc thấy
   được độ khó tăng dần thay vì toàn bài "in ra Xin chào". */
function deMau(bai, n) {
  if (!bai.length) return [];
  const buoc = Math.max(1, Math.floor(bai.length / n));
  const ra = [];
  for (let i = 0; i < bai.length && ra.length < n; i += buoc) {
    const b = bai[i];
    const bt = b.ds[0];
    const de = String((bt && bt.prompt) || "").split("\n")[0];
    if (de) ra.push({ muc: b.muc, de, so: b.ds.length });
  }
  return ra;
}

function trangXuong(x, base) {
  const khoaCache = "xuong-" + x.slug + "|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);

  const { bai, soBt, soBai } = baiTapXuong(x);
  const canonical = base + "/thuc-hanh/" + x.slug;
  const tieuDe = `${x.tenDai} — ${soBt} bài tập máy tự chấm | Tin học THPT`;
  const desc = moTa(x.mo, 155);
  const mau = deMau(bai, 6);

  const body = `
<div class="pg-hero left">
  <div class="seo-crumb"><a href="/thuc-hanh">Thực hành</a> › ${esc(x.ten)}</div>
  <span class="eyebrow">Xưởng thực hành</span>
  <h1>${esc(x.tenDai)}</h1>
  <p class="lead">${nhan(x.mo)}</p>
  <p class="seo-meta">${soBt} bài tập · trải trên ${soBai} bài học · máy chấm ngay trong trình duyệt · không cần cài đặt</p>
</div>

<div class="pg-card pg-prose">
  <h2>Ở đây bạn làm được gì</h2>
  <ul>${x.lam.map((t) => "<li>" + t + "</li>").join("")}</ul>
</div>

${mau.length ? `<div class="pg-card">
  <h2>Một vài đề trong xưởng</h2>
  <p class="pg-note" style="margin-top:0">Đề thật lấy từ chính xưởng, rải đều từ bài đầu tới bài cuối. Bấm tên bài để đọc phần lí thuyết trước khi làm.</p>
  <div class="seo-de-ds">${mau.map((m) => `<div class="seo-de">
    <div class="seo-de-txt">${nhan(m.de)}</div>
    <div class="seo-de-bai"><a href="/bai/${esc(m.muc.slug)}">Bài ${m.muc.bai.order}. ${esc(m.muc.bai.title)}</a> · ${m.so} bài tập</div>
  </div>`).join("")}</div>
</div>` : ""}

<div class="pg-card" style="text-align:center">
  <h2>Mở xưởng ${esc(x.ten)} và làm thử</h2>
  <p class="pg-note">Không cần tạo tài khoản, không cần cài đặt. Bài thực hành của những chương đầu mở miễn phí cho mọi người.</p>
  <p style="margin-top:14px"><a class="btn btn-primary btn-lg" href="/hoc#/playground/${esc(x.lang)}">Vào xưởng ${esc(x.ten)}</a></p>
</div>

${soBai ? `<div class="pg-card">
  <h2>Bài tập ${esc(x.ten)} theo từng bài học</h2>
  <p class="pg-note" style="margin-top:0">Mỗi bài học có lí thuyết riêng rồi mới tới phần thực hành — học trước, làm sau thì đỡ bí.</p>
  <div class="seo-grid">${bai.map((b) => `<a class="seo-lq" href="/bai/${esc(b.muc.slug)}">
    <span class="seo-lq-lop">${esc(b.muc.lop)}</span>
    <span class="seo-lq-ten">Bài ${b.muc.bai.order}. ${esc(b.muc.bai.title)}</span>
    <span class="seo-lq-so">${b.ds.length} bài tập</span>
  </a>`).join("")}</div>
</div>` : ""}

<div class="pg-card pg-prose">
  <h2>Câu hỏi thường gặp</h2>
  ${x.hoi.map((h) => "<h3>" + esc(h[0]) + "</h3><p>" + esc(h[1]) + "</p>").join("")}
</div>

<div class="pg-card">
  <h2 style="margin-top:0">Ba xưởng còn lại</h2>
  <div class="seo-grid">${XUONG.filter((y) => y.ma !== x.ma).map((y) => `<a class="seo-lq" href="/thuc-hanh/${esc(y.slug)}">
    <span class="seo-lq-lop">Xưởng thực hành</span>
    <span class="seo-lq-ten">${esc(y.tenDai)}</span>
    <span class="seo-lq-so">${baiTapXuong(y).soBt} bài tập</span>
  </a>`).join("")}</div>
</div>`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: x.tenDai,
        description: desc,
        url: canonical,
        inLanguage: "vi",
        learningResourceType: ["Bài thực hành", "Bài tập có chấm điểm"],
        educationalLevel: "Trung học phổ thông",
        teaches: x.ten,
        isAccessibleForFree: true,
      },
      {
        "@type": "FAQPage",
        mainEntity: x.hoi.map((h) => ({
          "@type": "Question", name: h[0],
          acceptedAnswer: { "@type": "Answer", text: h[1] },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Thực hành", item: base + "/thuc-hanh" },
          { "@type": "ListItem", position: 2, name: x.tenDai, item: canonical },
        ],
      },
    ],
  };

  const html = khung({ title: tieuDe, desc, canonical, body, ld });
  CACHE.set(khoaCache, html);
  return html;
}

function trangXuongDs(base) {
  const khoaCache = "xuong-ds|" + base;
  if (CACHE.has(khoaCache)) return CACHE.get(khoaCache);

  const so = XUONG.map((x) => ({ x, ...baiTapXuong(x) }));
  const tong = so.reduce((n, s) => n + s.soBt, 0);
  const canonical = base + "/thuc-hanh";

  const body = `
<div class="pg-hero left">
  <div class="seo-crumb"><a href="/">Trang chủ</a> › Thực hành</div>
  <span class="eyebrow">Bốn xưởng</span>
  <h1>Thực hành Tin học online — ${tong} bài tập máy tự chấm</h1>
  <p class="lead">Viết Python, dựng HTML/CSS, truy vấn SQL và thao tác đồ hoạ ngay trong trình duyệt. Không cài đặt, không tạo tài khoản, mở bằng điện thoại cũng làm được.</p>
  <p class="seo-meta">${tong} bài tập · 4 xưởng · máy chấm ngay tại chỗ</p>
</div>

<div class="pg-card">
  <h2 style="margin-top:0">Chọn xưởng</h2>
  <div class="seo-grid">${so.map((s) => `<a class="seo-lq" href="/thuc-hanh/${esc(s.x.slug)}">
    <span class="seo-lq-lop">${s.soBt} bài tập · ${s.soBai} bài học</span>
    <span class="seo-lq-ten">${esc(s.x.tenDai)}</span>
    <span class="seo-lq-so">${esc(cat(s.x.mo, 96))}</span>
  </a>`).join("")}</div>
</div>

<div class="pg-card pg-prose">
  <h2>Vì sao nên làm thực hành, không chỉ đọc lí thuyết</h2>
  <p>Đề tốt nghiệp môn Tin học định hướng Khoa học máy tính hỏi rất nhiều về <b>đọc code và đoán kết quả</b>. Đọc lí thuyết thì thấy hiểu hết, nhưng ngồi trước một đoạn code sai một dấu hai chấm mà tìm không ra thì lúc thi vẫn mất điểm. Tự gõ và tự chạy là cách nhanh nhất để những chỗ hiểu lơ mơ lộ ra.</p>
  <p>Ở đây máy chấm ngay nên bạn biết mình sai ở đâu mà không phải đợi ai chữa bài. Sai thì có gợi ý, bí quá thì xem đáp án mẫu rồi tự viết lại.</p>
</div>

<div class="pg-card" style="text-align:center">
  <h2>Mở xưởng thực hành</h2>
  <p class="pg-note">Bài thực hành của những chương đầu mỗi xưởng mở miễn phí, không cần tài khoản.</p>
  <p style="margin-top:14px"><a class="btn btn-primary btn-lg" href="/hoc#/playground">Vào xưởng thực hành</a></p>
  <p class="pg-note" style="margin-top:10px">Muốn học lí thuyết trước? Xem <a href="/bai">danh sách toàn bộ bài học</a>.</p>
</div>`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Thực hành Tin học online",
        description: "Bốn xưởng thực hành chạy trong trình duyệt: Python, HTML/CSS, SQL và đồ hoạ, máy chấm ngay.",
        url: canonical,
        inLanguage: "vi",
      },
      {
        "@type": "ItemList",
        itemListElement: so.map((s, i) => ({
          "@type": "ListItem", position: i + 1, name: s.x.tenDai,
          url: base + "/thuc-hanh/" + s.x.slug,
        })),
      },
    ],
  };

  const html = khung({
    title: `Thực hành Tin học online — ${tong} bài tập Python, SQL, HTML/CSS, đồ hoạ`,
    desc: "Bốn xưởng thực hành chạy ngay trong trình duyệt: viết Python, dựng HTML/CSS, truy vấn SQL, thao tác đồ hoạ. Máy chấm tại chỗ, không cần cài đặt.",
    canonical, body, ld, ogType: "website",
  });
  CACHE.set(khoaCache, html);
  return html;
}

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

  /* ---- Trang tĩnh: chèn gốc miền vào canonical/og ----
     canonical và og:image bắt buộc là URL tuyệt đối (Zalo/Facebook không đọc
     đường dẫn tương đối), nhưng tên miền thì tuỳ nơi deploy. Nên trong tệp HTML
     ghi %%GOC%% rồi thay lúc phục vụ — khỏi phải đóng cứng tên miền vào repo và
     bản chạy local vẫn đúng. */
  const PUB_DIR = path.join(__dirname, "..", "public");
  /* Nhớ theo mtime chứ không nhớ vĩnh viễn: nếu chỉ nhớ một lần thì sửa tệp HTML
     xong phải khởi động lại máy chủ mới thấy — rất dễ tưởng là sửa không ăn.
     statSync rẻ hơn đọc cả tệp nhiều lần. */
  const boNhoTrang = new Map();
  function docTrangTinh(ten) {
    const duong = path.join(PUB_DIR, ten);
    const mtime = fs.statSync(duong).mtimeMs;
    const cu = boNhoTrang.get(ten);
    if (cu && cu.mtime === mtime) return cu.html;
    const html = fs.readFileSync(duong, "utf8");
    boNhoTrang.set(ten, { mtime, html });
    return html;
  }
  /* BỐ CỤC URL
     "/"    -> trang giới thiệu (landing.html): đây là URL mà người ta dẫn link
               tới và Google coi trọng nhất, nên phải là trang CÓ nội dung đọc
               được. Trước đây "/" là vỏ ứng dụng rỗng, phí toàn bộ backlink.
     "/hoc" -> ứng dụng (index.html).
     Các URL cũ chuyển 301 để link đã chia sẻ và dấu trang không chết. */
  const TRANG_TINH = { "/": "landing.html", "/hoc": "index.html",
    "/nang-cap": "nang-cap.html", "/quyen-rieng-tu": "quyen-rieng-tu.html" };
  const CHUYEN_301 = { "/index.html": "/hoc", "/landing": "/", "/landing.html": "/",
    "/nang-cap.html": "/nang-cap", "/quyen-rieng-tu.html": "/quyen-rieng-tu" };
  r.get(Object.keys(CHUYEN_301), (req, res) => res.redirect(301, CHUYEN_301[req.path]));

  r.get(Object.keys(TRANG_TINH), (req, res, next) => {
    try {
      const html = docTrangTinh(TRANG_TINH[req.path]).replace(/%%GOC%%/g, goc(req));
      res.set("Content-Type", "text/html; charset=utf-8");
      res.set("Cache-Control", "no-cache");
      res.send(html);
    } catch (e) { next(e); }
  });

  r.get("/bai", (req, res, next) => {
    try { traHtml(res, trangDanhSach(goc(req))); } catch (e) { next(e); }
  });

  /* Bốn xưởng thực hành — trang thật cho Google, xem chú thích ở XUONG */
  r.get("/thuc-hanh", (req, res, next) => {
    try { traHtml(res, trangXuongDs(goc(req))); } catch (e) { next(e); }
  });

  r.get("/thuc-hanh/:xuong", (req, res, next) => {
    try {
      const key = String(req.params.xuong || "").toLowerCase();
      const x = XUONG_THEO_SLUG.get(key);
      if (x) return traHtml(res, trangXuong(x, goc(req)));
      /* Gọi bằng mã trong ứng dụng (web, gfx) -> chuyển sang URL chuẩn, tránh hai
         đường dẫn cùng một nội dung. */
      const theoMa = XUONG.find((y) => y.ma === key || y.lang === key);
      if (theoMa) return res.redirect(301, "/thuc-hanh/" + theoMa.slug);
      res.redirect(302, "/thuc-hanh");
    } catch (e) { next(e); }
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
        noindex: true,
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
${url(base + "/", "1.0", lmTinh("landing.html"))}
${url(base + "/bai", "0.9", lmBai)}
${(() => {
        const ds = danhSachBo(chiMuc().kho);
        if (!ds.length) return "";
        /* Một bộ -> chỉ /doi-chieu-sgk. Nhiều bộ -> thêm trang riêng từng bộ. */
        return [url(base + "/doi-chieu-sgk", "0.8", lmBai)]
          .concat(ds.length > 1 ? ds.map((b) => url(base + "/doi-chieu-sgk/" + b.ma, "0.8", lmBai)) : [])
          .join("\n");
      })()}
${url(base + "/thuc-hanh", "0.8", lmBai)}
${XUONG.map((x) => url(base + "/thuc-hanh/" + x.slug, "0.7", lmBai)).join("\n")}
${url(base + "/nang-cap", "0.6", lmTinh("nang-cap.html"))}
${url(base + "/quyen-rieng-tu", "0.3", lmTinh("quyen-rieng-tu.html"))}
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
      "Disallow: /admin\n" +
      /* Ảnh scan và PDF sách giáo khoa: chỉ dùng để đối chiếu khi soạn nội dung,
         không phải tài liệu của mình nên tuyệt đối không để Google lập chỉ mục.
         Thư mục đã nằm trong .gitignore (không lên Railway) — dòng này là lớp
         chặn thứ hai cho trường hợp chạy máy khác. */
      "Disallow: /sach/\n\n" +
      "Sitemap: " + goc(req) + "/sitemap.xml\n"
    );
  });

  return r;
}

module.exports = { createSeo, chiMuc, slugHoa, SO_MC_MAU, SO_TF_MAU };
