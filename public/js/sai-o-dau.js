/* ============================================================================
 *  KHỐI "SAI Ở ĐÂU?" — bộ máy dựng
 *
 *  VÌ SAO CẦN THÊM MỘT KHỐI NỮA khi đã có trắc nghiệm và Ôn tập tương tác:
 *  đề tốt nghiệp có 4 câu Đúng/Sai, mỗi câu 4 ý — tức là 16 phát biểu phải phán
 *  đúng/sai, chiếm phần điểm rất lớn. Nhưng trắc nghiệm A/B/C/D luyện kĩ năng
 *  KHÁC: chọn đáp án tốt nhất trong bốn phương án. Còn câu Đ/S đòi kĩ năng đọc
 *  một phát biểu nghe rất hợp lí rồi chỉ ra chính xác chữ nào làm nó sai.
 *
 *  Nên khối này KHÔNG hỏi "đáp án nào đúng". Nó đưa ra một đoạn code hoặc mấy
 *  phát biểu, trong đó có chỗ sai, và bắt học sinh CHỈ VÀO chỗ đó. Bấm sai chỗ
 *  cũng được giải thích vì sao chỗ đó thật ra đúng — đây mới là phần dạy được
 *  nhiều nhất, vì học sinh hay nghi oan đúng những dòng viết lạ mắt.
 *
 *  CHẤM NGAY TỪNG CÚ BẤM, không có nút "Kiểm tra" gom cuối: bấm xong mới biết
 *  đúng sai thì mỗi cú bấm là một lần học, còn gom lại chấm một lượt thì học sinh
 *  tích bừa cho hết rồi đọc đáp án.
 *
 *  Nội dung theo bài nằm ở js/sai-o-dau-noi-dung.js (nạp SAU tệp này).
 *  Khoá đăng ký là ID BÀI (C10-14), không phải số bài trong slug.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  var THEO_BAI = {};

  function napCss() {
    if (document.getElementById("sodCss")) return;
    var st = document.createElement("style");
    st.id = "sodCss";
    st.textContent =
      ".sod{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:15px 16px;margin-bottom:14px}" +
      ".sod-de{margin:0 0 12px;font-size:14px;line-height:1.6}" +
      ".sod-de b{color:var(--text)}" +
      ".sod-ds{display:grid;gap:7px}" +
      /* Dòng là <button> chứ không phải <div onclick>: bàn phím Tab tới được, Enter
         bấm được, và trình đọc màn hình đọc ra là nút bấm. Học sinh dùng máy tính
         phòng máy hay bấm Tab hơn là trỏ chuột. */
      ".sod-d{display:flex;gap:9px;align-items:flex-start;width:100%;text-align:left;cursor:pointer;" +
        "border:1.5px solid var(--border);background:var(--bg-soft);color:var(--text);border-radius:10px;" +
        "padding:10px 12px;font:600 13.5px/1.6 var(--font-sans);transition:all .2s}" +
      ".sod-d:hover{border-color:var(--primary)}" +
      /* Dòng đã bấm thì không đổi viền khi trỏ chuột lên nữa — giữ nguyên màu
         xanh/đỏ đã chấm, kẻo học sinh tưởng bấm lại được để đổi đáp án. */
      ".sod-d.bat:hover{border-color:var(--success)}" +
      ".sod-d.oan:hover{border-color:var(--danger)}" +
      ".sod-d.hien:hover{border-color:var(--warning)}" +
      ".sod-ma .sod-d{font-family:var(--font-mono);white-space:pre-wrap;font-size:13px}" +
      ".sod-d .sod-so{flex:none;width:21px;height:21px;border-radius:6px;background:var(--bg-card);" +
        "border:1px solid var(--border);display:flex;align-items:center;justify-content:center;" +
        "font:800 11.5px var(--font-mono);color:var(--text-soft)}" +
      ".sod-d.bat{border-color:var(--success);background:var(--success-soft)}" +
      ".sod-d.bat .sod-so{background:var(--success);border-color:var(--success);color:#fff}" +
      ".sod-d.oan{border-color:var(--danger);background:var(--danger-soft)}" +
      ".sod-d.oan .sod-so{background:var(--danger);border-color:var(--danger);color:#fff}" +
      /* Dòng sai mà học sinh không tìm ra, hiện khi bấm "Chỉ chỗ sai còn lại" */
      ".sod-d.hien{border-color:var(--warning);background:var(--warning-soft)}" +
      ".sod-d.hien .sod-so{background:var(--warning);border-color:var(--warning);color:#fff}" +
      ".sod-vi{margin-top:11px;display:grid;gap:7px}" +
      ".sod-vi p{margin:0;border-radius:9px;padding:9px 12px;font-size:13px;line-height:1.6;" +
        "border:1px solid var(--border);background:var(--bg-soft)}" +
      ".sod-vi p.bat{border-color:var(--success);background:var(--success-soft)}" +
      ".sod-vi p.oan{border-color:var(--danger);background:var(--danger-soft)}" +
      ".sod-vi p.hien{border-color:var(--warning);background:var(--warning-soft)}" +
      ".sod-vi p b{font-weight:800}" +
      ".sod-chot{margin-top:11px;border-radius:9px;padding:10px 12px;font-size:13.5px;line-height:1.6;" +
        "border:1px solid var(--primary);background:var(--primary-soft)}" +
      ".sod-thanh{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px}" +
      ".sod-diem{font:800 12.5px var(--font-sans);color:var(--text-soft)}" +
      ".sod-diem.xong{color:var(--success)}" +
      ".sod-btn{margin-left:auto;border:1px solid var(--border);background:var(--bg-card);color:var(--text-soft);" +
        "font:700 12.5px var(--font-sans);padding:8px 13px;border-radius:9px;cursor:pointer;min-height:38px}" +
      ".sod-btn:hover{border-color:var(--primary);color:var(--primary)}" +
      "@media (max-width:560px){.sod{padding:13px}.sod-btn{margin-left:0;width:100%}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* **đậm** và `code` — cùng cú pháp với nội dung bài học, để người viết nội dung
     không phải nhớ thêm quy ước riêng cho khối này. Escape TRƯỚC rồi mới thay
     dấu, kẻo phát biểu chứa "<" hay "&" thành thẻ HTML. */
  function fmt(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);font-size:.94em">$1</code>');
  }
  function ico(ten, mau, co) {
    return typeof window.ICON === "function" ? window.ICON(ten, co || 15, mau) : "";
  }

  /* Một mục = một đoạn code hoặc một chùm phát biểu.
     { de, loai: "ma" | "y", dong: [{ t, sai, vi }], chot } */
  function veMuc(muc, i) {
    var soSai = muc.dong.filter(function (d) { return d.sai; }).length;
    var daBat = 0, daBam = {};

    var wrap = document.createElement("div");
    wrap.className = "sod";
    wrap.innerHTML =
      '<p class="sod-de">' + fmt(muc.de) + "</p>" +
      '<div class="sod-ds' + (muc.loai === "ma" ? " sod-ma" : "") + '"></div>' +
      '<div class="sod-vi"></div>' +
      '<div class="sod-chot" hidden></div>' +
      '<div class="sod-thanh"><span class="sod-diem"></span>' +
      '<button class="sod-btn" type="button">Chịu, chỉ chỗ sai giúp em</button></div>';

    var oDs = wrap.querySelector(".sod-ds");
    var oVi = wrap.querySelector(".sod-vi");
    var oChot = wrap.querySelector(".sod-chot");
    var oDiem = wrap.querySelector(".sod-diem");
    var oBtn = wrap.querySelector(".sod-btn");

    /* Dòng code giữ nguyên khoảng trắng đầu dòng (thụt lề là NGHĨA trong Python)
       nên loai "ma" không fmt, chỉ escape. */
    muc.dong.forEach(function (d, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sod-d";
      b.dataset.i = n;
      b.innerHTML = '<span class="sod-so">' + (n + 1) + "</span><span>" +
        (muc.loai === "ma" ? esc(d.t) : fmt(d.t)) + "</span>";
      oDs.appendChild(b);
    });

    function demChu() {
      oDiem.innerHTML = daBat >= soSai
        ? ico("check", "var(--success)") + " Tìm đủ " + soSai + "/" + soSai + " chỗ sai"
        : "Đã tìm <b>" + daBat + "/" + soSai + "</b> chỗ sai";
      oDiem.className = "sod-diem" + (daBat >= soSai ? " xong" : "");
    }
    function themVi(loai, n, chu) {
      var p = document.createElement("p");
      p.className = loai;
      var nhan = loai === "bat" ? "Đúng, dòng " + (n + 1) + " sai: "
        : loai === "oan" ? "Dòng " + (n + 1) + " không sai: "
        : "Dòng " + (n + 1) + " mới là chỗ sai: ";
      p.innerHTML = "<b>" + nhan + "</b>" + fmt(chu);
      oVi.appendChild(p);
    }
    /* CỐ Ý KHÔNG khoá các dòng còn lại khi đã tìm đủ chỗ sai. Bản đầu có khoá, và
       nó ăn mất phần dạy được nhiều nhất: mục nào có dòng sai nằm ngay đầu thì học
       sinh bấm một cái là "xong", không bao giờ biết ba dòng dưới đúng vì lí do gì.
       Mà đó chính là ba phát biểu đề sẽ đưa vào câu Đ/S. daBam đã chặn cộng điểm
       hai lần nên để mở cũng không hỏng cách chấm. */
    function xong() {
      if (daBat < soSai) return;
      oBtn.hidden = true;
      if (muc.chot) { oChot.hidden = false; oChot.innerHTML = ico("bulb", "var(--primary)") + " " + fmt(muc.chot); }
      var conLai = muc.dong.length - Object.keys(daBam).length;
      if (conLai > 0) {
        oDiem.innerHTML += ' <span style="font-weight:600;color:var(--text-soft)">— còn ' + conLai +
          " dòng chưa thử, bấm xem vì sao chúng đúng</span>";
      }
    }

    oDs.onclick = function (e) {
      var b = e.target.closest(".sod-d");
      if (!b) return;
      var n = +b.dataset.i, d = muc.dong[n];
      if (daBam[n]) return;              // bấm lại dòng cũ không cộng thêm gì
      daBam[n] = true;
      if (d.sai) { b.classList.add("bat"); daBat++; themVi("bat", n, d.vi); }
      else { b.classList.add("oan"); themVi("oan", n, d.vi || "Dòng này viết đúng."); }
      demChu();
      xong();
    };

    oBtn.onclick = function () {
      muc.dong.forEach(function (d, n) {
        if (!d.sai || daBam[n]) return;
        daBam[n] = true;
        oDs.querySelector('.sod-d[data-i="' + n + '"]').classList.add("hien");
        themVi("hien", n, d.vi);
      });
      daBat = soSai;
      demChu();
      xong();
    };

    demChu();
    return wrap;
  }

  function veVao(host, id) {
    var ds = THEO_BAI[id];
    if (!host || !ds || !ds.length) return false;
    napCss();
    ds.forEach(function (m, i) {
      try { host.appendChild(veMuc(m, i)); }
      catch (e) { console.error("[sai-o-dau] Không dựng được mục " + i + " của " + id + ":", e); }
    });
    return true;
  }

  /* Cắm vào ngay trước khối hành động cuối bài — cùng chỗ concept-lab dùng, nên
     nó nằm sau "Ôn tập tương tác" và trước hai nút Đã học / Luyện tập. Đúng thứ
     tự học: đọc lý thuyết, xem minh hoạ, ôn khái niệm, rồi mới tự bắt lỗi. */
  function injectSaiODau(lesson) {
    if (!lesson || !THEO_BAI[lesson.id]) return;
    var app = document.getElementById("app");
    if (!app || app.querySelector(".sod")) return;
    var neo = app.querySelector(".ls-actions");
    if (!neo || !neo.parentNode) return;
    napCss();
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="section-title" style="margin-top:24px">' + ico("search", "#dc2626", 17) + " Sai ở đâu?</div>" +
      '<p style="color:var(--text-soft);font-size:13.5px;margin:0 0 12px">' +
      "Mỗi mục dưới đây có chỗ sai. Bấm vào dòng em cho là sai — bấm đúng hay bấm oan đều được giải thích ngay. " +
      "Đây chính là việc phải làm với 4 câu <b>Đúng/Sai</b> trong đề thi.</p>" +
      '<div class="sod-host"></div>';
    neo.parentNode.insertBefore(wrap, neo);
    if (!veVao(wrap.querySelector(".sod-host"), lesson.id)) wrap.remove();
  }

  window.injectSaiODau = injectSaiODau;
  window.SaiODau = {
    dangKy: function (id, ds) { THEO_BAI[id] = ds; },
    coBai: function () { return Object.keys(THEO_BAI); },
    veVao: veVao,
  };
})();
