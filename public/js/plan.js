/* ============================================================================
 *  GÓI FREE / PREMIUM — phía giao diện (window.Plan)
 *  Nạp SAU account.js (đọc Account.plan lấy từ /api/me), TRƯỚC app.js.
 *
 *  Ranh giới đã chốt trong KE-HOACH-SAAS.md (Phase 4):
 *   - Free = TOÀN BỘ phần học (bài, từ vựng, concept lab, gamify, playground).
 *   - Quỹ 30 câu luyện có chấm/ngày (quiz cuối bài + luyện tập + luyện nhanh
 *     + Đúng/Sai dùng CHUNG một quỹ). Thi thử không tính vào quỹ.
 *   - Thi thử free: đề TC1 + mã 101, 102. Random + các đề còn lại: Premium.
 *   - Xưởng thực hành free ~15% bài đầu mỗi xưởng; tab "Chỗ yếu": Premium.
 *
 *  LƯU Ý: đây là KHOÁ GIAO DIỆN (đủ với người dùng bình thường). Hạn mức gia
 *  sư AI mới là khoá thật ở máy chủ. Nội dung premium chuyển dần sang API có
 *  auth ở bước "chống copy" sau — đừng coi tệp này là hàng rào an ninh.
 * ==========================================================================*/
(function () {
  var QUOTA_NGAY = 30;                                   // câu luyện có chấm/ngày (free)
  /* Mở MỘT đề cho free: đủ để học sinh biết đề thi thử ra sao rồi mới quyết định
     mua, nhưng không đủ để ôn cả kỳ bằng gói miễn phí.
     ĐỔI SỐ NÀY PHẢI SỬA LUÔN bảng so sánh ở nang-cap.html và landing.html, kẻo
     trang bán hàng công bố sai. */
  var DE_FREE = { TC1: 1 };
  var XUONG_FREE = { python: 20, web: 8, sql: 6, gfx: 3 }; // số bài thực hành free mỗi xưởng

  function ico(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; }

  /* ------------------------------- gói ------------------------------- */
  function tier() {
    if (typeof Account === "undefined" || !Account || Account.available === false) return "paid"; // bản dev tĩnh: mở hết
    var p = Account.plan;
    return p && p.tier === "paid" ? "paid" : "free";
  }
  function paid() { return tier() === "paid"; }
  function hetHan() {
    var p = (typeof Account !== "undefined" && Account && Account.plan) || null;
    return p && p.hetHan ? new Date(p.hetHan) : null;
  }

  /* --------------------- quỹ câu luyện có chấm/ngày --------------------- */
  function homNay() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function quotaKey() { return "tinhoc_quota_v1:" + (window.PROFILE_ID || "0"); }
  function docQuota() {
    try {
      var o = JSON.parse(localStorage.getItem(quotaKey()));
      if (o && o.d === homNay() && typeof o.n === "number") return o;
    } catch (e) { /* hỏng thì coi như chưa dùng */ }
    return { d: homNay(), n: 0 };
  }
  function quotaLeft() { return paid() ? Infinity : Math.max(0, QUOTA_NGAY - docQuota().n); }
  /* Gọi từ doSubmit (app.js) với số câu ĐÃ TRẢ LỜI của bài luyện vừa nộp. */
  function dungCau(n) {
    n = Number(n) || 0;
    if (paid() || n <= 0) return;
    var o = docQuota();
    o.n += n;
    try { localStorage.setItem(quotaKey(), JSON.stringify(o)); } catch (e) { /* đầy bộ nhớ thì thôi */ }
  }
  /* Gọi TRƯỚC khi vào một bài luyện: còn quỹ thì cho vào, hết thì mở modal. */
  function chanLuyen() {
    if (quotaLeft() > 0) return true;
    upsell("quota");
    return false;
  }
  /* Cắt bài luyện cho vừa quỹ còn lại (gọi sau chanLuyen nên luôn còn >= 1). */
  function catQuota(qs) {
    var left = quotaLeft();
    if (left === Infinity || qs.length <= left) return qs;
    if (typeof toast === "function") toast("Gói Miễn phí còn " + left + " câu hôm nay — bài luyện rút còn " + left + " câu.");
    return qs.slice(0, Math.max(1, left));
  }
  function quotaText() {
    return paid() ? "" : "Gói Miễn phí: còn " + quotaLeft() + "/" + QUOTA_NGAY + " câu luyện hôm nay.";
  }

  /* ------------------------------ đề thi ------------------------------ */
  function deMo(code) { return paid() || !!DE_FREE[String(code)]; }

  /* ------------------------- tính năng bật/tắt ------------------------- */
  /* "yeu" = tab Chỗ yếu, "exam_random" = Thi thử ngay, "deep" = giải thích kỹ hơn */
  function has(f) { return paid() || (f !== "yeu" && f !== "exam_random" && f !== "deep"); }

  /* --------------------------- xưởng thực hành --------------------------- */
  /* Free = N bài ĐẦU của mỗi xưởng, đơn vị là BÀI HỌC (không cắt lửng giữa một
     bài). "Đầu" tính theo thứ tự lộ trình CỦA HỒ SƠ (lọc theo định hướng), nên
     học sinh Tin học ứng dụng cũng có phần free của nhánh mình. */
  var _freeSets = null;
  function nguonXuong() {
    return {
      python: window.EXERCISES || {},
      sql: window.SQL_EXERCISES || {},
      web: window.WEB_EXERCISES || {},
      gfx: window.GLAB || {},
    };
  }
  function tinhFreeSets() {
    var nguon = nguonXuong();
    var thuTu = (window.LESSONS || []).slice();
    if (typeof visibleForProfile === "function") thuTu = thuTu.filter(visibleForProfile);
    thuTu.sort(function (a, b) { return a.stage - b.stage || a.order - b.order; });
    var out = {};
    Object.keys(XUONG_FREE).forEach(function (loai) {
      var budget = XUONG_FREE[loai], sum = 0, set = {};
      thuTu.forEach(function (l) {
        var ds = nguon[loai][l.id];
        if (!ds || !ds.length || sum >= budget) return;
        set[l.id] = 1;
        sum += ds.length;
      });
      out[loai] = set;
    });
    return out;
  }
  function xuongMo(loai, lesson) {
    if (paid()) return true;
    if (!_freeSets) _freeSets = tinhFreeSets();
    return !!(_freeSets[loai] && _freeSets[loai][lesson.id]);
  }
  var TEN_XUONG = {
    python: "Bài thực hành Python (tự viết code, máy chấm)",
    sql: "Thực hành SQL (máy chạy & tự chấm)",
    web: "Thực hành HTML/CSS (xem trước & máy chấm)",
    gfx: "Thử thao tác đồ hoạ (mô phỏng)",
  };
  /* Khu bài tập bị khoá — CHO XEM ĐỀ, chỉ khoá phần gõ code và máy chấm.
     Trước đây chỉ hiện một hộp "cần Premium", học sinh không biết mình đang bỏ lỡ
     cái gì nên cũng chẳng có lý do nâng cấp; mà đề bài thì đọc xong vẫn học được
     (nghĩ cách giải trên giấy). Nhận cả mảng bài tập lẫn số lượng để lời gọi cũ
     truyền số vẫn chạy. */
  function khoaXuongBox(loai, lesson, ds) {
    var anchor = document.querySelector(".ls-actions");
    if (!anchor || !anchor.parentNode) return;
    var ds2 = Array.isArray(ds) ? ds : [];
    var soBai = Array.isArray(ds) ? ds.length : (ds || 0);
    var chu = function (s) {
      return typeof fmtInline === "function" ? fmtInline(String(s || "")) : esc(String(s || ""));
    };
    var deHtml = ds2.length
      ? '<ol class="plan-de-ds">' + ds2.map(function (bt, i) {
          var p = (bt && bt.prompt) || "(chưa có đề)";
          return '<li class="plan-de"><span class="plan-de-so">Bài ' + (i + 1) + "</span>" +
                 '<span class="plan-de-txt">' + chu(String(p).split("\n")[0]) + "</span></li>";
        }).join("") + "</ol>"
      : "";
    var d = document.createElement("div");
    d.className = "plan-xuong-khoa";
    d.innerHTML =
      '<div class="section-title" style="margin-top:24px">' + ico("code", "#0891b2", 17) + " " +
        (TEN_XUONG[loai] || "Bài thực hành") + ' <span class="plan-tag">Premium</span></div>' +
      '<p class="plan-de-mo">Đề của cả ' + soBai + " bài dưới đây em đọc được hết — cứ thử nghĩ cách giải. " +
        "Phần gõ code trực tiếp và máy chấm tự động thuộc gói Premium.</p>" +
      deHtml +
      '<div class="plan-lockbox">' +
        '<span class="plan-lock-ic">' + ico("lock", "#b45309", 20) + "</span>" +
        '<span class="plan-lock-txt"><b>Vì sao chưa gõ code ở đây được?</b>' +
        "<small>Gói Miễn phí mở phần thực hành của những chương ĐẦU mỗi xưởng, và em đã dùng hết " +
        "phần đó — bài này thuộc chương sau. Nâng cấp Premium là mở khung code, nút Chạy &amp; Kiểm tra, " +
        "Gợi ý và Đáp án mẫu của cả " + soBai + " bài này.</small></span>" +
        '<button class="btn btn-primary plan-lock-btn">Tìm hiểu Premium</button>' +
      "</div>";
    anchor.parentNode.insertBefore(d, anchor);
    d.querySelector(".plan-lock-btn").onclick = function () { upsell("xuong"); };
  }

  /* ----------------------------- modal upsell ----------------------------- */
  var LY_DO = {
    quota: { tit: "Hết quỹ luyện hôm nay", mo: "Bạn đã luyện đủ " + QUOTA_NGAY + " câu miễn phí của hôm nay — đúng nhịp học đều đấy! Muốn cày ôn kiểm tra hay ôn thi không giới hạn thì cần gói Premium." },
    exam: { tit: "Đề này thuộc gói Premium", mo: "Gói Miễn phí thi thử được 1 đề (Đề biên soạn 1) — làm lại bao nhiêu lần cũng được. Nâng cấp để mở cả 13 đề và đề ngẫu nhiên mỗi ngày." },
    xuong: { tit: "Bài thực hành Premium", mo: "Các bài thực hành thuộc những chương đầu là miễn phí. Nâng cấp để mở toàn bộ 250+ bài Python, SQL, HTML/CSS có máy chấm." },
    /* Ba khoá cho 3 ô luyện/thi ở trang chủ. Nói rõ vẫn còn đường miễn phí (lộ
       trình + luyện nhanh 10 câu) để lời mời không thành cụt đường. */
    phan1: { tit: "Luyện trắc nghiệm Phần 1 — Premium", mo: "Chọn chủ đề, lớp, mức độ rồi luyện không giới hạn dạng trắc nghiệm 4 đáp án (Phần I của đề). Gói Miễn phí vẫn luyện được qua lộ trình bài học và ô Luyện nhanh 10 câu." },
    phan2: { tit: "Luyện Phần 2 Đúng/Sai — Premium", mo: "Chuyên luyện dạng Đúng/Sai 4 ý — phần dễ mất điểm nhất của đề. Gói Miễn phí gặp dạng này trong lộ trình bài học và trong đề thi thử miễn phí." },
    thithu: { tit: "Thi thử full 2 phần — Premium", mo: "Đề đầy đủ 24 câu trắc nghiệm + 4 câu Đúng/Sai, tính giờ 50 phút, chấm thang 10. Gói Miễn phí được thi thử 1 đề — làm lại bao nhiêu lần cũng được." },
    /* Ô "Thi thử" cuối chặng trên bản đồ lộ trình. Đề đầu tiên free thật, nên chỉ
       hiện lời mời này từ đề thứ hai — nói rõ đề đã làm vẫn thi lại được. */
    thithu_chang: { tit: "Đã dùng lượt thi thử miễn phí", mo: "Gói Miễn phí được thi thử 1 đề trong lộ trình và bạn đã làm rồi. Vẫn còn Đề biên soạn 1 ở mục Thi thử — làm lại bao nhiêu lần cũng được. Nâng cấp để mở ô Thi thử ở cuối mọi chặng, 13 đề biên soạn và đề ngẫu nhiên không giới hạn." },
    yeu: { tit: "Luyện đúng chỗ yếu — Premium", mo: "Ứng dụng đã âm thầm chấm bạn mạnh/yếu chủ đề nào qua từng câu luyện. Gói Premium mở tab Chỗ yếu: ôn đúng chủ đề yếu, ưu tiên câu từng làm sai." },
    deep: { tit: "Giải thích kỹ hơn — Premium", mo: "Nút này gọi model AI mạnh hơn để giảng chậm và sâu hơn. Gói Premium được dùng model sâu và 25 lượt hỏi gia sư mỗi ngày (miễn phí: 5 lượt)." },
    hoso: { tit: "Thêm hồ sơ — Premium", mo: "Gói Miễn phí dùng 1 hồ sơ học tập. Premium mở 3 hồ sơ — nhà có anh chị em dùng chung một tài khoản, tiến độ vẫn riêng." },
  };
  var QUYEN_LOI = [
    "Luyện tập không giới hạn (miễn phí: " + QUOTA_NGAY + " câu/ngày)",
    "13 đề thi thử + đề ngẫu nhiên không giới hạn",
    "250+ bài thực hành Python · SQL · HTML/CSS có máy chấm",
    "Tab Chỗ yếu — ôn đúng chủ đề đang yếu",
    "Gia sư AI 25 lượt/ngày + nút “giải thích kỹ hơn”",
    "3 hồ sơ học tập trong một tài khoản",
  ];

  function dongUpsell() {
    var o = document.getElementById("planUpsell");
    if (o) o.remove();
  }
  /* Có mua thẳng trong app được không (máy chủ đã bật thanh toán tự động chưa) */
  function coTuDong() { return typeof Pay !== "undefined" && Pay.co(); }
  function upsell(lyDo) {
    dongUpsell();
    var ld = LY_DO[lyDo] || LY_DO.quota;
    var o = document.createElement("div");
    o.id = "planUpsell";
    o.className = "plan-nen";
    o.innerHTML =
      '<div class="plan-modal" role="dialog" aria-modal="true">' +
        '<div class="plan-m-ic">' + ico("crown", "#b45309", 30) + "</div>" +
        "<h3>" + ld.tit + "</h3>" +
        '<p class="plan-m-mo">' + ld.mo + "</p>" +
        '<ul class="plan-m-ul">' + QUYEN_LOI.map(function (x) {
          return "<li>" + ico("check2", "#16a34a", 14) + " " + x + "</li>";
        }).join("") + "</ul>" +
        (quotaText() ? '<p class="plan-m-quota">' + quotaText() + "</p>" : "") +
        /* Máy chủ đã bật thanh toán tự động thì mua ngay tại đây: quét QR, tiền
           vào là mở gói trong vài giây. Chưa bật thì quay về đường cũ (mua mã,
           nhận qua Zalo) — không để nút bấm vào không ra gì. */
        '<div class="plan-m-btns">' +
          (coTuDong()
            ? '<button class="btn btn-primary btn-lg" id="planMua">Mua ngay — quét mã là xong</button>'
            : '<a class="btn btn-primary btn-lg" href="/nang-cap" target="_blank" rel="noopener">Xem giá &amp; mua mã</a>') +
          '<button class="btn btn-ghost" id="planGoAcc">Nhập mã kích hoạt</button>' +
          '<button class="btn btn-ghost" id="planLater">Để sau</button>' +
        "</div>" +
        '<p class="plan-m-note">' + (coTuDong()
          ? "Quét mã bằng app ngân hàng — số tài khoản, số tiền và nội dung đã điền sẵn. Tiền vào là gói mở ngay, không phải chờ ai."
          : "Chuyển khoản QR → nhận mã qua Zalo trong ít phút → dán mã là lên Premium.") + "</p>" +
      "</div>";
    document.body.appendChild(o);
    o.onclick = function (e) { if (e.target === o) dongUpsell(); };
    o.querySelector("#planLater").onclick = dongUpsell;
    var nutMua = o.querySelector("#planMua");
    if (nutMua) nutMua.onclick = function () { dongUpsell(); Pay.batDau("nam"); };
    o.querySelector("#planGoAcc").onclick = function () {
      dongUpsell();
      if (typeof go === "function") go("account");
      else location.hash = "#/account";
    };
  }

  /* --------------------------------- CSS --------------------------------- */
  var css =
    ".plan-nen{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:10005;display:flex;align-items:center;justify-content:center;padding:18px}" +
    ".plan-modal{background:var(--bg-card);border:1px solid var(--border);border-radius:18px;box-shadow:var(--shadow-lg);" +
      "max-width:430px;width:100%;padding:24px 22px;text-align:center;max-height:90vh;overflow-y:auto}" +
    ".plan-m-ic{width:56px;height:56px;border-radius:16px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;" +
      "background:#fef3c7;border:1px solid #f59e0b}" +
    ".plan-modal h3{font-family:var(--font-display);font-size:19px;margin:0 0 6px}" +
    ".plan-m-mo{color:var(--text-soft);font-size:14px;line-height:1.6;margin:0 0 12px}" +
    ".plan-m-ul{list-style:none;margin:0 0 12px;padding:12px 14px;text-align:left;background:var(--bg-soft);" +
      "border:1px solid var(--border);border-radius:12px}" +
    ".plan-m-ul li{font-size:13.5px;padding:3px 0;display:flex;gap:7px;align-items:flex-start;line-height:1.5}" +
    ".plan-m-ul li svg{flex:none;margin-top:3px}" +
    ".plan-m-quota{font-size:12.5px;color:var(--text-soft);margin:0 0 10px}" +
    ".plan-m-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}" +
    ".plan-m-btns a.btn{text-decoration:none}" +
    ".plan-m-note{font-size:12.5px;color:var(--text-soft);margin:10px 0 0}" +
    /* Xem đề của khu bài tập bị khoá */
    ".plan-tag{display:inline-block;vertical-align:middle;margin-left:6px;background:#fef3c7;color:#92400e;" +
      "border:1px solid #f59e0b;border-radius:8px;padding:1px 7px;font-family:var(--font-mono);font-size:10.5px;font-weight:900}" +
    ".plan-de-mo{color:var(--text-soft);font-size:13.5px;line-height:1.6;margin:0 0 12px}" +
    ".plan-de-ds{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}" +
    ".plan-de{display:flex;gap:10px;align-items:flex-start;background:var(--bg-soft);border:1px solid var(--border);" +
      "border-radius:12px;padding:10px 13px}" +
    ".plan-de-so{flex:none;font-family:var(--font-mono);font-size:11.5px;font-weight:900;color:var(--primary);" +
      "background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:2px 7px;margin-top:1px}" +
    ".plan-de-txt{font-size:13.5px;line-height:1.55;color:var(--text)}" +
    ".plan-de-txt code{font-family:var(--font-mono);font-size:12.5px;background:var(--bg-card);border:1px solid var(--border);" +
      "border-radius:6px;padding:1px 5px}" +
    ".plan-lockbox{display:flex;align-items:center;gap:12px;margin:24px 0 0;padding:14px 16px;flex-wrap:wrap;" +
      "background:var(--bg-soft);border:1px dashed var(--border-strong);border-radius:14px}" +
    ".plan-lock-ic{flex:none;display:flex}" +
    ".plan-lock-txt{flex:1;min-width:180px}" +
    ".plan-lock-txt b{display:block;font-size:14.5px}" +
    ".plan-lock-txt small{color:var(--text-soft);font-size:12.5px;line-height:1.5;display:block;margin-top:2px}" +
    ".exam-card.plan-khoa{opacity:.75;border-style:dashed}" +
    ".exam-card.plan-khoa .exam-card-best{color:#b45309;font-weight:650}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  window.Plan = {
    tier: tier, paid: paid, hetHan: hetHan, has: has,
    quotaLeft: quotaLeft, dungCau: dungCau, chanLuyen: chanLuyen, catQuota: catQuota, quotaText: quotaText,
    deMo: deMo, xuongMo: xuongMo, khoaXuongBox: khoaXuongBox,
    upsell: upsell, QUOTA_NGAY: QUOTA_NGAY,
  };
})();
