/* ============================================================================
 *  GIA SƯ AI — BẢNG CHAT TRƯỢT TỪ PHẢI
 *
 *  Các lối vào:
 *    - Trang bài học: nút "Hỏi gia sư"  -> Tutor.moBai(bai)
 *    - Sau khi chấm sai một câu: nút "Vì sao tôi sai?" -> Tutor.moCauSai(...)
 *    - Robot trợ lý góc phải: "Hỏi gia sư" -> Tutor.moChung() khi không mở bài
 *      nào (máy chủ tự rào trong phạm vi môn Tin học THPT)
 *
 *  Trình duyệt CHỈ gửi ID (lessonId / questionId) — nội dung bài do máy chủ tự
 *  lấy. Không có khoá API ở đây và không bao giờ được có.
 * ==========================================================================*/
(function () {
  const API = "/api";
  let TT = null;          // trạng thái từ /tutor/status, nhớ trong phiên
  let dangChay = null;    // AbortController của lượt hỏi đang chảy
  let NGU = null;         // ngữ cảnh hiện tại { lessonId, questionId, daChon, tieuDe }
  let LICH = [];          // hội thoại của lượt mở này

  const GOI_Y_BAI = [
    "Giải thích lại mục này dễ hiểu hơn",
    "Cho tôi một ví dụ khác",
    "Phần này hay được hỏi thế nào trong đề?",
  ];
  const GOI_Y_SAI = [
    "Vì sao đáp án tôi chọn lại sai?",
    "Có mẹo nào để không nhầm nữa không?",
    "Cho tôi một câu tương tự để thử lại",
  ];
  const GOI_Y_BT_LOI = [
    "Máy báo lỗi này nghĩa là gì?",
    "Sai ở dòng nào?",
    "Chỉ tôi bước sửa đầu tiên",
  ];
  const GOI_Y_BT_SAI = [
    "Vì sao kết quả chưa khớp?",
    "Tôi hiểu sai đề ở chỗ nào?",
    "Chỉ tôi bước sửa đầu tiên",
  ];
  const GOI_Y_CHUNG = [
    "Nên bắt đầu ôn từ phần nào?",
    "Muốn chắc phần Python thì ôn bài nào?",
    "Mẹo làm dạng câu Đúng/Sai?",
  ];
  /* Gợi ý hiện SAU khi gia sư trả lời xong. Mục đầu dùng model mạnh hơn nên
     đánh dấu riêng — mỗi lần bấm vẫn tính một lượt. */
  const GOI_Y_TIEP = ["Giải thích kỹ hơn", "Cho ví dụ dễ hình dung hơn"];

  /* ------------------------------- tiện ích ------------------------------- */
  function esc2(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* Markdown rút gọn — đủ cho những gì AI hay dùng: khối code, **đậm**, `mã`,
     gạch đầu dòng, tiêu đề nhỏ. Escape TRƯỚC rồi mới thêm thẻ, không dùng
     innerHTML với chữ thô. */
  function md(s) {
    const khoi = [];
    let t = String(s || "").replace(/```([a-z]*)\n?([\s\S]*?)```/g, (m, lang, code) => {
      khoi.push('<pre class="tt-code">' + esc2(code.replace(/\n$/, "")) + "</pre>");
      return "\u0000" + (khoi.length - 1) + "\u0000";
    });
    t = esc2(t)
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`\n]+)`/g, "<code>$1</code>");
    const dong = t.split("\n");
    const ra = [];
    let trongUl = false;
    dong.forEach((d) => {
      const li = d.match(/^\s*[-*]\s+(.*)$/);
      if (li) {
        if (!trongUl) { ra.push("<ul>"); trongUl = true; }
        ra.push("<li>" + li[1] + "</li>");
        return;
      }
      if (trongUl) { ra.push("</ul>"); trongUl = false; }
      if (/^#{1,4}\s/.test(d)) ra.push("<b>" + d.replace(/^#{1,4}\s/, "") + "</b>");
      else if (d.trim() === "") ra.push("");
      else ra.push(d);
    });
    if (trongUl) ra.push("</ul>");
    return ra.join("\n").replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>")
      .replace(/\u0000(\d+)\u0000/g, (m, i) => khoi[+i])
      // <br> nằm sát danh sách / khối code chỉ tạo khoảng trống thừa
      .replace(/<br>\s*(<\/?(?:ul|li|pre)\b[^>]*>)/g, "$1")
      .replace(/(<\/(?:ul|li|pre)>)\s*<br>/g, "$1");
  }

  function anh() {
    return typeof mascotSrc === "function"
      ? mascotSrc("asset/mascot/scenes/explaining.png") : "asset/mascot/scenes/explaining.png";
  }

  /* ------------------------------ trạng thái ------------------------------ */
  async function layTrangThai(lamMoi) {
    if (TT && !lamMoi) return TT;
    try {
      const r = await fetch(API + "/tutor/status", { credentials: "same-origin" });
      TT = await r.json();
    } catch (e) { TT = { on: false }; }
    return TT;
  }

  /* Nút "Hỏi gia sư" chỉ hiện khi máy chủ đã bật AI — không bật thì không có nút
     nào chết vô duyên. */
  async function batNut(nut, moKhi) {
    if (!nut) return;
    const t = await layTrangThai();
    if (!t.on) { nut.remove(); return; }
    nut.style.display = "";
    nut.hidden = false;      // chỗ gọi có thể dùng thuộc tính hidden thay vì style
    nut.onclick = moKhi;
  }

  /* -------------------------------- bảng chat ----------------------------- */
  function dungBang() {
    let el = document.getElementById("ttPanel");
    if (el) return el;
    el = document.createElement("div");
    el.id = "ttPanel";
    el.className = "tt-panel";
    el.innerHTML = `
      <div class="tt-head">
        <img class="tt-ava" src="${anh()}" alt="">
        <div class="tt-head-txt">
          <b>Gia sư AI</b>
          <div class="tt-sub" id="ttSub"></div>
        </div>
        <button class="tt-x" id="ttClose" title="Đóng">&times;</button>
      </div>
      <div class="tt-body" id="ttBody"></div>
      <div class="tt-goiy" id="ttGoiy"></div>
      <div class="tt-foot">
        <textarea id="ttInput" rows="1" maxlength="500" placeholder="Hỏi về bài này…"></textarea>
        <button class="tt-send" id="ttSend" title="Gửi">${"➤"}</button>
      </div>`;
    document.body.appendChild(el);

    const nen = document.createElement("div");
    nen.id = "ttNen"; nen.className = "tt-nen";
    document.body.appendChild(nen);
    nen.onclick = dong;

    el.querySelector("#ttClose").onclick = dong;
    const inp = el.querySelector("#ttInput");
    inp.addEventListener("input", () => {
      inp.style.height = "auto";
      inp.style.height = Math.min(110, inp.scrollHeight) + "px";
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); gui(inp.value); }
    });
    el.querySelector("#ttSend").onclick = () => gui(inp.value);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && el.classList.contains("mo")) dong();
    });
    return el;
  }

  function themBong(ai, html, id) {
    const body = document.getElementById("ttBody");
    const d = document.createElement("div");
    d.className = "tt-msg " + ai;
    if (id) d.id = id;
    d.innerHTML = ai === "bot" ? `<img class="tt-ava-s" src="${anh()}" alt=""><div class="tt-noi">${html}</div>`
      : `<div class="tt-noi">${html}</div>`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }

  function veGoiY(ds) {
    const g = document.getElementById("ttGoiy");
    g.innerHTML = ds.map((s) => {
      const sau = s === GOI_Y_TIEP[0];
      // Nút model sâu là quyền lợi Premium — gói free thấy nút kèm nhãn, bấm thì mở giới thiệu
      const khoa = sau && typeof Plan !== "undefined" && !Plan.has("deep");
      return `<button class="tt-chip${sau ? " sau" : ""}" data-t="${esc2(s)}">${esc2(s)}${khoa ? " · Premium" : ""}</button>`;
    }).join("");
    g.querySelectorAll(".tt-chip").forEach((b) =>
      b.onclick = () => gui(b.dataset.t, b.classList.contains("sau")));
  }

  function capNhatSub() {
    const s = document.getElementById("ttSub");
    if (!s) return;
    const conLai = TT && TT.conLai;
    s.textContent = (NGU && NGU.tieuDe ? NGU.tieuDe : "") +
      (typeof conLai === "number" ? "  •  còn " + conLai + " lượt hôm nay" : "");
  }

  /* Khoá định danh ngữ cảnh — phải trùng KHỚP với khoaNguCanh() ở máy chủ.
     Mỗi lượt hội thoại được đóng dấu khoá này; đổi bài / đổi câu là máy chủ tự
     bỏ những lượt mang dấu cũ, nên chuyện của bài trước không lẫn sang bài sau
     và cũng không tốn token gửi đi gửi lại. */
  function khoaNgu(n) {
    if (!n) return "chung";
    if (n.exLoai) return "bt:" + n.exLoai + ":" + (n.lessonId || "") + ":" + n.exIndex;
    if (n.questionId) return "cau:" + n.questionId;
    if (n.lessonId) return "bai:" + n.lessonId;
    return "chung";
  }

  function mo(ngu, goiY) {
    NGU = ngu;
    NGU.khoa = khoaNgu(ngu);
    LICH = [];
    const el = dungBang();
    document.getElementById("ttBody").innerHTML = "";
    el.classList.add("mo");
    document.getElementById("ttNen").classList.add("mo");
    capNhatSub();

    layTrangThai(true).then((t) => {
      capNhatSub();
      if (!t.dangNhap) {
        themBong("bot", "Bạn cần <b>đăng nhập</b> để hỏi gia sư nhé.");
        khoaNhap(true);
        return;
      }
      if (t.conLai === 0) { hetLuot(t.hanMuc); return; }
      khoaNhap(false);
      themBong("bot", md(ngu.chao));
      veGoiY(goiY);
      const i = document.getElementById("ttInput");
      if (i && window.innerWidth > 700) i.focus();
    });
  }

  function dong() {
    if (dangChay) { dangChay.abort(); dangChay = null; }
    const el = document.getElementById("ttPanel");
    if (el) el.classList.remove("mo");
    const n = document.getElementById("ttNen");
    if (n) n.classList.remove("mo");
  }

  function khoaNhap(khoa) {
    const i = document.getElementById("ttInput"), s = document.getElementById("ttSend");
    const chungChung = NGU && !NGU.lessonId && !NGU.questionId; // chế độ hỏi chung
    if (i) { i.disabled = khoa; i.placeholder = khoa ? "Chưa dùng được" : chungChung ? "Hỏi về môn Tin học…" : "Hỏi về bài này…"; }
    if (s) s.disabled = khoa;
  }

  function hetLuot(max) {
    themBong("bot", "Hôm nay bạn đã dùng hết <b>" + (max || "") + " lượt</b> hỏi gia sư. " +
      "Mai lượt sẽ được cấp lại. Trong lúc đó bạn thử đọc lại phần <b>Cần nhớ</b> " +
      "hoặc luyện vài câu ở mục <b>Chỗ yếu</b> nhé.");
    document.getElementById("ttGoiy").innerHTML = "";
    khoaNhap(true);
  }

  /* --------------------------------- gửi hỏi -------------------------------
     `sau` = true khi người học bấm "Giải thích kỹ hơn" -> máy chủ dùng model
     mạnh hơn (AI_MODEL_DEEP) và cho phép trả lời dài hơn. */
  async function gui(txt, sau) {
    const hoi = String(txt || "").trim();
    if (!hoi || dangChay) return;
    if (sau && typeof Plan !== "undefined" && !Plan.has("deep")) { Plan.upsell("deep"); return; }
    const inp = document.getElementById("ttInput");
    inp.value = ""; inp.style.height = "auto";
    document.getElementById("ttGoiy").innerHTML = "";
    themBong("toi", esc2(hoi));

    const bong = themBong("bot", '<span class="tt-cham"><i></i><i></i><i></i></span>');
    const noi = bong.querySelector(".tt-noi");
    const body = document.getElementById("ttBody");

    dangChay = new AbortController();
    napNutDung(true);
    let ra = "";
    try {
      const res = await fetch(API + "/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        signal: dangChay.signal,
        body: JSON.stringify({
          profileId: window.PROFILE_ID || null,
          lessonId: NGU.lessonId || null,
          questionId: NGU.questionId || null,
          daChon: NGU.daChon != null ? NGU.daChon : undefined,
          exLoai: NGU.exLoai || undefined,
          exIndex: NGU.exIndex != null ? NGU.exIndex : undefined,
          code: NGU.code || undefined,
          ketQua: NGU.ketQua || undefined,
          loi: NGU.loi || undefined,
          question: hoi,
          history: LICH.slice(-4),
          deep: !!sau,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        if (res.status === 429 && j.hetLuot) { bong.remove(); hetLuot(j.hanMuc); return; }
        noi.innerHTML = '<span class="tt-loi">' + esc2(j.error || "Gia sư đang bận, thử lại sau.") + "</span>";
        return;
      }
      const doc = res.body.getReader();
      const dec = new TextDecoder();
      let dem = "";
      for (;;) {
        const { done, value } = await doc.read();
        if (done) break;
        dem += dec.decode(value, { stream: true });
        let i;
        while ((i = dem.indexOf("\n")) >= 0) {
          const dong1 = dem.slice(0, i).trim(); dem = dem.slice(i + 1);
          if (!dong1) continue;
          let o; try { o = JSON.parse(dong1); } catch (e) { continue; }
          if (o.t) { ra += o.t; noi.innerHTML = md(ra); body.scrollTop = body.scrollHeight; }
          if (o.loi) noi.innerHTML = md(ra) + '<div class="tt-loi">' + esc2(o.loi) + "</div>";
          if (o.xong) { TT = Object.assign({}, TT, { conLai: o.conLai }); capNhatSub(); }
        }
      }
      if (ra) {
        // đóng dấu ngữ cảnh vào từng lượt để máy chủ bỏ được lượt của bài/câu cũ
        LICH.push({ role: "user", content: hoi, ngu: NGU.khoa },
          { role: "assistant", content: ra, ngu: NGU.khoa });
        if (TT && TT.conLai !== 0) veGoiY(sau ? GOI_Y_TIEP.slice(1) : GOI_Y_TIEP);
      } else if (!noi.textContent.trim()) {
        noi.innerHTML = '<span class="tt-loi">Gia sư chưa trả lời được, thử hỏi lại nhé.</span>';
      }
    } catch (e) {
      if (e.name === "AbortError") { if (!ra) bong.remove(); }
      else noi.innerHTML = '<span class="tt-loi">Mất kết nối tới máy chủ.</span>';
    } finally {
      dangChay = null;
      napNutDung(false);
      body.scrollTop = body.scrollHeight;
    }
  }

  /* Nút gửi biến thành nút dừng khi đang chảy chữ. */
  function napNutDung(dang) {
    const s = document.getElementById("ttSend");
    if (!s) return;
    s.innerHTML = dang ? "■" : "➤";
    s.title = dang ? "Dừng" : "Gửi";
    s.classList.toggle("dung", dang);
    s.onclick = dang
      ? () => { if (dangChay) dangChay.abort(); }
      : () => gui(document.getElementById("ttInput").value);
  }

  /* -------------------------------- lối vào -------------------------------- */
  const Tutor = {
    trangThai: layTrangThai,
    batNut,
    moBai(bai) {
      mo({
        lessonId: bai.id, tieuDe: bai.title,
        chao: "Chào bạn! Mình đọc cùng bạn bài **" + bai.title + "**. " +
          "Chỗ nào chưa thông thì hỏi mình nhé — mình chỉ bàn trong phạm vi bài này thôi.",
      }, GOI_Y_BAI);
    },
    /* Hỏi chung từ robot trợ lý — không gắn với bài nào, máy chủ tự rào phạm vi
       trong chương trình Tin học THPT và chỉ bài nên mở khi hỏi sâu. */
    moChung() {
      mo({
        tieuDe: "Hỏi nhanh",
        chao: "Chào bạn! Mình là robot trợ lý kiêm **gia sư AI**. Cứ hỏi mình bất kỳ " +
          "kiến thức Tin học THPT nào — mình trả lời ngắn gọn và chỉ luôn bài nên mở để học kỹ nhé.",
      }, GOI_Y_CHUNG);
    },
    moCauSai(q, daChon, lessonId) {
      mo({
        questionId: q.id, lessonId: lessonId || null, daChon,
        tieuDe: "Câu vừa làm",
        chao: "Mình xem câu này rồi. Bạn muốn mình giảng lại chỗ nào — vì sao đáp án bạn chọn chưa đúng, hay ý chính của câu?",
      }, GOI_Y_SAI);
    },
    /* Bài thực hành: gửi loại + chỉ số để máy chủ tự tra đề, kèm bài làm và
       kết quả chạy. Đề bài và đáp án mẫu KHÔNG gửi từ đây. */
    moBaiTap(loai, lessonId, i, code, ketQua, loi) {
      mo({
        lessonId, exLoai: loai, exIndex: i, code, ketQua, loi,
        tieuDe: "Bài thực hành " + (i + 1),
        chao: loi
          ? "Mình thấy máy đang báo lỗi ở bài làm của bạn. Hỏi mình để cùng lần ra chỗ hỏng nhé — mình sẽ không đưa đáp án sẵn đâu."
          : "Bài chạy được nhưng kết quả chưa khớp. Bạn muốn mình gợi ý từ đâu?",
      }, loi ? GOI_Y_BT_LOI : GOI_Y_BT_SAI);
    },
    dong,
  };
  window.Tutor = Tutor;

  /* ---------------------------------- CSS ---------------------------------- */
  const st = document.createElement("style");
  st.textContent = `
.tt-nen { position:fixed; inset:0; background:rgba(15,23,42,.35); opacity:0; pointer-events:none;
  transition:opacity .2s; z-index:10000; }
.tt-nen.mo { opacity:1; pointer-events:auto; }
.tt-panel { position:fixed; top:0; right:0; height:100%; width:min(420px,100%); z-index:10001;
  background:var(--bg-card); border-left:1px solid var(--border); box-shadow:var(--shadow-lg);
  display:flex; flex-direction:column; transform:translateX(100%); transition:transform .25s ease;
  font-family:var(--font-sans); }
.tt-panel.mo { transform:none; }
.tt-head { display:flex; align-items:center; gap:10px; padding:12px 14px; border-bottom:1px solid var(--border);
  background:linear-gradient(135deg,var(--primary),var(--primary-d)); color:#fff; }
.tt-ava { width:38px; height:38px; object-fit:contain; }
.tt-head-txt { flex:1; min-width:0; }
.tt-head-txt b { font-family:var(--font-display); font-size:15px; }
.tt-sub { font-size:11.5px; opacity:.85; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tt-x { background:rgba(255,255,255,.18); border:0; color:#fff; width:30px; height:30px; border-radius:8px;
  font-size:20px; line-height:1; cursor:pointer; }
.tt-x:hover { background:rgba(255,255,255,.3); }
.tt-body { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:12px; }
.tt-msg { display:flex; gap:8px; align-items:flex-start; }
.tt-msg.toi { justify-content:flex-end; }
.tt-ava-s { width:26px; height:26px; object-fit:contain; flex-shrink:0; margin-top:2px; }
.tt-noi { max-width:82%; padding:9px 12px; border-radius:14px; font-size:14px; line-height:1.6;
  background:var(--bg-soft); color:var(--text); overflow-wrap:anywhere; }
.tt-msg.toi .tt-noi { background:var(--primary); color:#fff; border-bottom-right-radius:4px; }
.tt-msg.bot .tt-noi { border-bottom-left-radius:4px; }
.tt-noi ul { margin:6px 0 6px 18px; padding:0; }
.tt-noi li { margin:2px 0; }
.tt-noi code { font-family:var(--font-mono); font-size:12.5px; background:rgba(79,70,229,.12);
  padding:1px 5px; border-radius:5px; }
.tt-code { font-family:var(--font-mono); font-size:12.5px; background:var(--bg); border:1px solid var(--border);
  border-radius:8px; padding:8px 10px; margin:6px 0; overflow-x:auto; white-space:pre; }
.tt-loi { color:var(--danger); font-size:13px; display:block; margin-top:4px; }
.tt-cham i { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--text-soft);
  margin-right:3px; animation:ttNhay 1s infinite; }
.tt-cham i:nth-child(2) { animation-delay:.15s; } .tt-cham i:nth-child(3) { animation-delay:.3s; }
@keyframes ttNhay { 0%,60%,100% { opacity:.25; } 30% { opacity:1; } }
.tt-goiy { display:flex; flex-wrap:wrap; gap:6px; padding:0 14px 8px; }
.tt-chip { border:1px solid var(--border-strong); background:var(--bg-card); color:var(--text-soft);
  font-size:12.5px; padding:5px 10px; border-radius:20px; cursor:pointer; font-family:inherit; }
.tt-chip:hover { border-color:var(--primary); color:var(--primary); }
.tt-chip.sau { border-color:var(--primary); color:var(--primary); background:var(--primary-soft); }
.tt-foot { display:flex; gap:8px; padding:10px 14px 14px; border-top:1px solid var(--border); align-items:flex-end; }
.tt-foot textarea { flex:1; resize:none; border:1px solid var(--border-strong); border-radius:12px;
  padding:9px 12px; font:14px/1.5 var(--font-sans); background:var(--bg); color:var(--text); max-height:110px; }
.tt-foot textarea:focus { outline:none; border-color:var(--primary); }
.tt-send { width:38px; height:38px; border:0; border-radius:12px; background:var(--primary); color:#fff;
  font-size:15px; cursor:pointer; flex-shrink:0; }
.tt-send:disabled { opacity:.45; cursor:not-allowed; }
.tt-send.dung { background:var(--danger); }
.tt-hoi-btn { display:none; }
@media (max-width:700px) { .tt-panel { width:100%; } }
`;
  document.head.appendChild(st);
})();
