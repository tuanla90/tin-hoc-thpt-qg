/* ============================================================================
 *  THỰC HÀNH HTML/CSS TỰ CHẤM — học sinh viết HTML/CSS, có XEM TRƯỚC trực tiếp
 *  (iframe) và máy KIỂM TRA kết quả render: có thẻ đúng chưa, thuộc tính CSS
 *  tính ra đúng chưa, nội dung/thuộc tính đúng chưa. Giá trị mong đợi TỰ LẤY từ
 *  câu lời giải (không cần gõ cứng), giống cách chấm SQL.
 *  Nạp TRƯỚC app.js. injectWebExercises(lesson) gọi trong renderLesson.
 * ==========================================================================*/
(function () {
  var css =
    ".wbx{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px}" +
    ".wbx + .wbx{margin-top:14px}" +
    ".wbx-prompt{font-size:15px;margin-bottom:10px;line-height:1.55}" +
    ".wbx-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
    "@media(max-width:640px){.wbx-grid{grid-template-columns:1fr}}" +
    ".wbx-col-cap{font-size:12.5px;font-weight:700;color:var(--text-soft);margin-bottom:5px}" +
    ".wbx-editor{width:100%;box-sizing:border-box;min-height:150px;border-radius:10px;border:1px solid var(--code-line);background:var(--code-bg);color:var(--code-text);font-family:Consolas,'JetBrains Mono',monospace;font-size:13.5px;padding:10px 12px;resize:vertical}" +
    ".wbx-editor:focus{outline:none;border-color:var(--primary)}" +
    ".wbx-frame{width:100%;min-height:150px;border:1px solid var(--border);border-radius:10px;background:#fff}" +
    ".wbx-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}" +
    ".wbx-actions .btn{padding:8px 14px;font-size:13.5px}" +
    ".wbx-hint{margin-top:10px;padding:10px 14px;border-radius:8px;background:var(--warning-soft);border-left:4px solid var(--warning);font-size:14px}" +
    ".wbx-verdict{margin-top:10px;padding:12px 14px;border-radius:8px;font-size:14.5px}" +
    ".wbx-verdict.ok{background:var(--success-soft);border:1px solid var(--success)}" +
    ".wbx-verdict.no{background:var(--danger-soft);border:1px solid var(--danger)}" +
    ".wbx-checks{list-style:none;margin:8px 0 0;padding:0;font-size:13.5px}" +
    ".wbx-checks li{padding:2px 0;display:flex;gap:7px;align-items:flex-start}" +
    ".wbx-checks .ci{flex:0 0 auto;margin-top:1px}" +
    ".wbx-baseh{font-size:12.5px;color:var(--text-soft);margin:0 0 8px;font-family:Consolas,monospace;white-space:pre-wrap;background:var(--bg-soft);border:1px solid var(--border);border-radius:8px;padding:8px 10px}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function wrapDoc(bodyHtml, cssText) {
    return '<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,Arial,sans-serif;margin:12px}' + (cssText || "") + "</style></head><body>" + (bodyHtml || "") + "</body></html>";
  }
  /* fullHtml cho 1 bài theo lời giải/bài làm */
  function buildHtml(ex, code) {
    if (ex.mode === "css") return wrapDoc(ex.baseHtml || "", code);
    return wrapDoc(code, "");
  }

  /* Render vào iframe ẩn rồi rút giá trị của từng check. Trả Promise<mảng giá trị>. */
  function extractOne(doc, win, c) {
    try {
      if (c.get === "count") return doc.querySelectorAll(c.sel).length;
      var el = doc.querySelector(c.sel);
      if (c.get === "exists") return !!el;
      if (!el) return null;
      if (c.get === "text") return (el.textContent || "").replace(/\s+/g, " ").trim();
      if (c.get === "tag") return el.tagName;
      if (c.get === "attr") return el.getAttribute(c.attr);
      if (c.get === "css") return win.getComputedStyle(el).getPropertyValue(c.prop).trim();
    } catch (e) { return "ERR:" + (e && e.message ? e.message : e); }
    return null;
  }
  function renderAndExtract(fullHtml, checks) {
    return new Promise(function (resolve) {
      var f = document.createElement("iframe");
      f.setAttribute("sandbox", "allow-same-origin");
      f.style.cssText = "position:absolute;left:-9999px;top:0;width:820px;height:620px;border:0";
      f.onload = function () {
        var vals;
        try { vals = checks.map(function (c) { return extractOne(f.contentDocument, f.contentWindow, c); }); }
        catch (e) { vals = checks.map(function () { return "ERR"; }); }
        setTimeout(function () { try { document.body.removeChild(f); } catch (e) {} resolve(vals); }, 0);
      };
      f.srcdoc = fullHtml;            // đặt srcdoc TRƯỚC append -> chỉ 1 lần onload (nội dung thật, không phải about:blank)
      document.body.appendChild(f);
    });
  }

  /* ---------------- DỮ LIỆU BÀI TẬP (mẫu; phần lớn do agent sinh, gộp thêm) ---------------- */
  var WEB_EXERCISES = {
    "C12-07": [
      { mode: "html", prompt: "Tạo một **tiêu đề lớn** (thẻ `h1`) có nội dung `Trang của em`.",
        starter: "<h1>...</h1>", solution: "<h1>Trang của em</h1>",
        hint: "Đặt nội dung giữa cặp thẻ: <h1>Trang của em</h1>.",
        checks: [{ desc: "Có thẻ tiêu đề h1", sel: "h1", get: "exists" }, { desc: "Nội dung h1 là 'Trang của em'", sel: "h1", get: "text" }] },
      { mode: "html", prompt: "Thêm một **tiêu đề phụ** `h2` ghi `Giới thiệu` và một **đoạn văn** `p` ghi `Xin chào các bạn`.",
        starter: "<h2>...</h2>\n<p>...</p>", solution: "<h2>Giới thiệu</h2>\n<p>Xin chào các bạn</p>",
        hint: "Dùng thẻ <h2> cho tiêu đề phụ và <p> cho đoạn văn.",
        checks: [{ desc: "Có h2 nội dung 'Giới thiệu'", sel: "h2", get: "text" }, { desc: "Có đoạn văn p", sel: "p", get: "exists" }, { desc: "Nội dung đoạn văn đúng", sel: "p", get: "text" }] },
    ],
    "C12-10": [
      { mode: "css", prompt: "Cho sẵn đoạn văn. Viết **CSS** để đoạn văn (`p`) có **màu chữ đỏ**.",
        baseHtml: "<p>Xin chào</p>", starter: "p {\n  \n}", solution: "p { color: red; }",
        hint: "p { color: red; } — thuộc tính color đổi màu chữ.",
        checks: [{ desc: "Đoạn văn có màu đỏ", sel: "p", get: "css", prop: "color" }] },
      { mode: "css", prompt: "Viết CSS để tiêu đề `h1` được **căn giữa** (text-align).",
        baseHtml: "<h1>Tiêu đề trang</h1>", starter: "h1 {\n  \n}", solution: "h1 { text-align: center; }",
        hint: "h1 { text-align: center; }",
        checks: [{ desc: "h1 được căn giữa", sel: "h1", get: "css", prop: "text-align" }] },
    ],
  };

  /* ---------------- Hiển thị & chấm ---------------- */
  function exHTML(ex, i) {
    var isCss = ex.mode === "css";
    return '<div class="wbx" data-i="' + i + '">' +
      '<div class="ex-head" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap"><span style="font-weight:800;color:var(--primary);font-size:14px">Bài ' + (i + 1) + '</span><span class="pill type-tf">' + (isCss ? "CSS" : "HTML") + "</span></div>" +
      '<div class="wbx-prompt">' + fmtInline(ex.prompt) + "</div>" +
      (isCss ? '<div class="wbx-col-cap">HTML có sẵn (không sửa):</div><div class="wbx-baseh">' + esc(ex.baseHtml || "") + "</div>" : "") +
      '<div class="wbx-grid"><div><div class="wbx-col-cap">' + (isCss ? "CSS của bạn:" : "HTML của bạn:") + '</div><textarea class="wbx-editor" spellcheck="false">' + esc(ex.starter || "") + "</textarea></div>" +
      '<div><div class="wbx-col-cap">Xem trước:</div><iframe class="wbx-frame" sandbox="allow-same-origin"></iframe></div></div>' +
      '<div class="wbx-actions">' +
        (ex.hint ? '<button class="btn btn-ghost wbx-hint-btn">' + (typeof ICON === "function" ? ICON("bulb", 14, "#d97706") : "") + " Gợi ý</button>" : "") +
        (ex.solution ? '<button class="btn btn-ghost wbx-sol-btn">' + (typeof ICON === "function" ? ICON("eye", 14) : "") + " Đáp án mẫu</button>" : "") +
        '<button class="btn btn-primary wbx-check">' + (typeof ICON === "function" ? ICON("check2", 14) : "") + " Kiểm tra</button>" +
      "</div>" +
      (ex.hint ? '<div class="wbx-hint" hidden>' + (typeof ICON === "function" ? ICON("bulb", 14, "#d97706") : "") + " " + esc(ex.hint) + "</div>" : "") +
      '<div class="wbx-verdict" hidden></div>' +
      '<button class="btn btn-ghost wbx-ai" hidden style="margin-top:10px">' + (typeof ICON === "function" ? ICON("bulb", 14, "#d97706") : "") + " Hỏi gia sư về bài này</button>" +
      "</div>";
  }

  function bindEx(node, ex, i, lessonId) {
    var ta = node.querySelector(".wbx-editor");
    var frame = node.querySelector(".wbx-frame");
    var verdict = node.querySelector(".wbx-verdict");
    var aiBtn = node.querySelector(".wbx-ai");
    var timer = null;
    var hong = 0;
    function preview() { frame.srcdoc = buildHtml(ex, ta.value); }
    ta.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(preview, 250); });
    preview();
    var hintBtn = node.querySelector(".wbx-hint-btn");
    if (hintBtn) hintBtn.onclick = function () { var h = node.querySelector(".wbx-hint"); h.hidden = !h.hidden; };
    var solBtn = node.querySelector(".wbx-sol-btn");
    if (solBtn) solBtn.onclick = function () { ta.value = ex.solution; preview(); verdict.hidden = true; };

    node.querySelector(".wbx-check").onclick = function () {
      var ci = function (ok) { return typeof ICON === "function" ? ICON(ok ? "check2" : "x", 15, ok ? "#16a34a" : "#dc2626") : (ok ? "✓" : "✗"); };
      Promise.all([
        renderAndExtract(buildHtml(ex, ta.value), ex.checks),
        renderAndExtract(buildHtml(ex, ex.solution), ex.checks),
      ]).then(function (r) {
        var got = r[0], want = r[1];
        var results = ex.checks.map(function (c, k) { return { desc: c.desc, ok: String(got[k]) === String(want[k]) }; });
        var allOk = results.every(function (x) { return x.ok; });
        if (allOk && typeof Gam !== "undefined" && Gam.onExercisePass) Gam.onExercisePass({ prompt: ex.prompt }, lessonId);
        /* Vấp 2 lần mới mời gia sư; gửi kèm danh sách yêu cầu chưa đạt. */
        if (allOk) { hong = 0; if (aiBtn) aiBtn.hidden = true; }
        else if (++hong >= 2 && aiBtn && typeof Tutor !== "undefined") {
          var chuaDat = results.filter(function (x) { return !x.ok; }).map(function (x) { return "- " + x.desc; }).join("\n");
          Tutor.batNut(aiBtn, function () {
            Tutor.moBaiTap("web", lessonId, i, ta.value, "Yêu cầu chưa đạt:\n" + chuaDat, null);
          });
        }
        verdict.hidden = false;
        verdict.className = "wbx-verdict " + (allOk ? "ok" : "no");
        verdict.innerHTML =
          (allOk ? "<b>" + ci(true) + " Chính xác! Hoàn thành tất cả yêu cầu.</b>" : "<b>" + ci(false) + " Chưa đạt — còn yêu cầu chưa xong:</b>") +
          '<ul class="wbx-checks">' + results.map(function (x) { return '<li><span class="ci">' + ci(x.ok) + "</span>" + esc(x.desc) + "</li>"; }).join("") + "</ul>";
      });
    };
  }

  /* hostNgoai: xem chú thích ở injectExercises trong js/exercises.js. */
  function injectWebExercises(lesson, hostNgoai) {
    var list = WEB_EXERCISES[lesson.id];
    if (!list || !list.length) return false;
    var host;
    if (hostNgoai) {
      host = hostNgoai;
    } else {
      var anchor = document.querySelector(".ls-actions");
      if (!anchor || !anchor.parentNode) return false;
      var wrap = document.createElement("div");
      wrap.innerHTML =
        '<div class="section-title" style="margin-top:24px">' + (typeof ICON === "function" ? ICON("globe", 17, "#0891b2") : "") + " Thực hành HTML/CSS (xem trước &amp; máy chấm)</div>" +
        '<p style="color:var(--text-soft);font-size:13.5px;margin-bottom:12px">Sửa mã bên trái, kết quả hiện ngay bên phải. Bấm “Kiểm tra” để máy soát từng yêu cầu.</p>' +
        '<div class="wbx-host"></div>';
      anchor.parentNode.insertBefore(wrap, anchor);
      host = wrap.querySelector(".wbx-host");
    }
    host.innerHTML = list.map(exHTML).join("");
    var nodes = host.querySelectorAll(".wbx");
    list.forEach(function (ex, i) { bindEx(nodes[i], ex, i, lesson.id); });
    return true;
  }

  if (typeof window !== "undefined") {
    window.WEB_EXERCISES = WEB_EXERCISES;
    window.injectWebExercises = injectWebExercises;
  }
})();
