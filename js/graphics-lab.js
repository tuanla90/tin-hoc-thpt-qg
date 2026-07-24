/* ============================================================================
 *  XƯỞNG ĐỒ HOẠ TƯƠNG TÁC — cho các bài đồ hoạ/ảnh/phim có "bóng dáng thực hành".
 *  Không chạy phần mềm GUI thật, nhưng dùng SVG + CSS filter + kéo/xếp/chọn trong
 *  trình duyệt để học sinh THAO TÁC thật rồi máy chấm.
 *  6 dạng widget: filter (chỉnh ảnh), layers (xếp lớp), crop (khung chọn),
 *  colorpick (pha màu), match (nối cặp), order (sắp thứ tự).
 *  Nạp TRƯỚC app.js.
 *    injectGraphicsLab(lesson)  -> chèn widget vào trang bài học
 *    renderGfxLab()             -> trang "Xưởng đồ hoạ" (route gfxLab)
 * ==========================================================================*/
(function () {
  var css =
    ".glab{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px}" +
    ".glab + .glab{margin-top:14px}" +
    ".glab-prompt{font-size:15px;margin-bottom:12px;line-height:1.55}" +
    ".glab-two{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}" +
    "@media(max-width:560px){.glab-two{grid-template-columns:1fr}}" +
    ".glab-cap{font-size:12.5px;font-weight:700;color:var(--text-soft);margin-bottom:5px;text-align:center}" +
    ".glab-stage{border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff}" +
    ".glab-stage svg{display:block;width:100%;height:auto}" +
    ".glab-sliders{margin-top:12px;display:grid;gap:9px}" +
    ".glab-row{display:grid;grid-template-columns:96px 1fr 46px;align-items:center;gap:9px;font-size:13.5px}" +
    ".glab-row input[type=range]{width:100%}" +
    ".glab-row b{text-align:right;font-family:Consolas,monospace;color:var(--text-soft)}" +
    ".glab-layers{margin-top:10px;display:grid;gap:7px}" +
    ".glab-lyr{display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:9px;padding:7px 10px;background:var(--bg-soft)}" +
    ".glab-lyr .sw{width:18px;height:18px;border-radius:4px;flex:0 0 auto;border:1px solid rgba(0,0,0,.2)}" +
    ".glab-lyr .nm{flex:1;font-size:14px;font-weight:600}" +
    ".glab-lyr .mv{display:flex;gap:4px}" +
    ".glab-lyr .mv button{border:1px solid var(--border);background:var(--bg-card);border-radius:7px;width:30px;height:28px;cursor:pointer;font-size:14px;color:var(--text)}" +
    ".glab-lyr .mv button:disabled{opacity:.35;cursor:default}" +
    ".glab-cropwrap{position:relative;max-width:340px;margin:0 auto}" +
    ".glab-crop-ov{position:absolute;inset:0;width:100%;height:100%;cursor:crosshair;touch-action:none}" +
    ".glab-sw{height:64px;border-radius:10px;border:1px solid var(--border)}" +
    ".glab-match{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px}" +
    ".glab-mcol{display:grid;gap:7px}" +
    ".glab-mi{display:flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:9px;padding:8px 10px;background:var(--bg-soft);cursor:pointer;font-size:13.5px}" +
    ".glab-mi.sel{border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-soft)}" +
    ".glab-mi .bdg{width:20px;height:20px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;background:var(--text-soft);visibility:hidden}" +
    ".glab-mi.paired .bdg{visibility:visible}" +
    ".glab-strip{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}" +
    ".glab-tile{border:1px solid var(--border);border-radius:9px;background:var(--bg-soft);padding:8px 6px;min-width:78px;text-align:center;font-size:12.5px}" +
    ".glab-tile .tn{font-weight:800;color:var(--primary);font-size:13px}" +
    ".glab-tile .mv{display:flex;gap:4px;justify-content:center;margin-top:5px}" +
    ".glab-tile .mv button{border:1px solid var(--border);background:var(--bg-card);border-radius:6px;width:26px;height:24px;cursor:pointer;color:var(--text)}" +
    ".glab-tile .mv button:disabled{opacity:.35;cursor:default}" +
    ".glab-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}" +
    ".glab-actions .btn{padding:8px 14px;font-size:13.5px}" +
    ".glab-verdict{margin-top:10px;padding:11px 14px;border-radius:8px;font-size:14.5px}" +
    ".glab-verdict.ok{background:var(--success-soft);border:1px solid var(--success)}" +
    ".glab-verdict.no{background:var(--danger-soft);border:1px solid var(--danger)}" +
    ".glab-verdict ul{list-style:none;margin:6px 0 0;padding:0;font-size:13.5px}" +
    ".glab-verdict li{padding:2px 0}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  var ico = function (n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 15, c) : ""; };
  function seedShuffle(a, seed) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { seed = (seed * 9301 + 49297) % 233280; var j = Math.floor(seed / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function okLine(ok, txt) { return "<li>" + ico(ok ? "check2" : "aright", ok ? "#16a34a" : "#d97706", 14) + " " + esc(txt) + "</li>"; }
  function done(w) { if (typeof Gam !== "undefined" && Gam.onExercisePass) Gam.onExercisePass({ prompt: w.prompt }); }

  /* Ảnh gốc: cảnh SVG tự vẽ (không dính bản quyền) */
  function scene() {
    return '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4aa8ee"/><stop offset="1" stop-color="#c7ebff"/></linearGradient>' +
        '<radialGradient id="gsun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff7c8"/><stop offset="0.65" stop-color="#ffd23f"/><stop offset="1" stop-color="#ffbe2c"/></radialGradient>' +
      "</defs>" +
      '<rect width="200" height="140" fill="url(#gsky)"/>' +
      '<circle cx="156" cy="34" r="17" fill="url(#gsun)"/>' +
      '<g fill="#ffffff" opacity="0.9"><ellipse cx="48" cy="30" rx="20" ry="9"/><ellipse cx="66" cy="32" rx="14" ry="8"/><ellipse cx="34" cy="34" rx="12" ry="7"/></g>' +
      '<path d="M0 104 Q55 80 110 100 T200 98 V140 H0 Z" fill="#74c47d"/>' +
      '<path d="M0 121 Q70 101 140 121 T200 119 V140 H0 Z" fill="#48a45b"/>' +
      '<rect x="45" y="88" width="42" height="30" rx="2" fill="#f3ddb2"/>' +
      '<path d="M40 88 L66 65 L92 88 Z" fill="#d1573e"/>' +
      '<rect x="59" y="100" width="13" height="18" rx="1" fill="#8a5a3b"/>' +
      '<rect x="49" y="93" width="11" height="10" fill="#bfe3ff" stroke="#7fb2d9" stroke-width="1"/>' +
      "</svg>";
  }

  /* ============ 1) CHỈNH ẢNH (CSS filter) ============ */
  function fstr(v) { return "brightness(" + v.b + ") contrast(" + v.c + ") saturate(" + v.s + ") hue-rotate(" + v.h + "deg)"; }
  var FKEYS = [
    { k: "b", label: "Độ sáng", min: 0.5, max: 1.5, step: 0.05, tol: 0.08 },
    { k: "c", label: "Tương phản", min: 0.5, max: 1.5, step: 0.05, tol: 0.08 },
    { k: "s", label: "Bão hoà", min: 0, max: 2, step: 0.05, tol: 0.12 },
    { k: "h", label: "Xoay màu", min: 0, max: 180, step: 5, tol: 15 },
  ];
  function renderFilter(node, w) {
    var cur = { b: 1, c: 1, s: 1, h: 0 };
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-two"><div><div class="glab-cap">Ảnh của bạn</div><div class="glab-stage" data-r="mine">' + scene() + "</div></div>" +
      '<div><div class="glab-cap">Ảnh mẫu</div><div class="glab-stage" data-r="goal">' + scene() + "</div></div></div>" +
      '<div class="glab-sliders">' + FKEYS.map(function (f) { return '<div class="glab-row"><label>' + f.label + '</label><input type="range" data-k="' + f.k + '" min="' + f.min + '" max="' + f.max + '" step="' + f.step + '" value="' + cur[f.k] + '"><b data-v="' + f.k + '">' + cur[f.k] + "</b></div>"; }).join("") + "</div>" +
      '<div class="glab-actions"><button class="btn btn-ghost" data-a="reset">' + ico("refresh", null, 14) + ' Đặt lại</button><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + " Kiểm tra</button></div>" +
      '<div class="glab-verdict" hidden></div>';
    var mine = node.querySelector('[data-r="mine"]'), goal = node.querySelector('[data-r="goal"]'), verdict = node.querySelector(".glab-verdict");
    goal.style.filter = fstr(w.target);
    function apply() { mine.style.filter = fstr(cur); }
    apply();
    node.querySelectorAll('input[type=range]').forEach(function (r) { r.oninput = function () { cur[r.dataset.k] = parseFloat(r.value); node.querySelector('[data-v="' + r.dataset.k + '"]').textContent = r.value; apply(); verdict.hidden = true; }; });
    node.querySelector('[data-a="reset"]').onclick = function () { cur = { b: 1, c: 1, s: 1, h: 0 }; verdict.hidden = true; node.querySelectorAll('input[type=range]').forEach(function (r) { r.value = cur[r.dataset.k]; node.querySelector('[data-v="' + r.dataset.k + '"]').textContent = cur[r.dataset.k]; }); apply(); };
    node.querySelector('[data-a="check"]').onclick = function () {
      var fb = FKEYS.map(function (f) { var d = cur[f.k] - w.target[f.k]; return { ok: Math.abs(d) <= f.tol, t: f.label + ": " + (Math.abs(d) <= f.tol ? "đạt" : (d < 0 ? "cần tăng thêm" : "cần giảm bớt")) }; });
      var all = fb.every(function (x) { return x.ok; }); if (all) done(w);
      verdict.hidden = false; verdict.className = "glab-verdict " + (all ? "ok" : "no");
      verdict.innerHTML = (all ? "<b>Chính xác! Ảnh của bạn đã khớp ảnh mẫu.</b>" : "<b>Gần rồi — chỉnh tiếp:</b>") + "<ul>" + fb.map(function (x) { return okLine(x.ok, x.t); }).join("") + "</ul>";
    };
  }

  /* ============ 2) XẾP LỚP (z-order) ============ */
  function renderLayers(node, w) {
    var order = w.layers.map(function (_, i) { return i; });
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-two"><div><div class="glab-cap">Kết quả ghép lớp</div><div class="glab-stage" data-r="comp"></div></div>' +
      '<div><div class="glab-cap">Thứ tự lớp (trên → dưới)</div><div class="glab-layers" data-r="lyrs"></div></div></div>' +
      '<div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var comp = node.querySelector('[data-r="comp"]'), lyrs = node.querySelector('[data-r="lyrs"]'), verdict = node.querySelector(".glab-verdict");
    function dl(k) {
      if (k === "sky") return '<rect width="200" height="140" fill="url(#gl-sky)"/>';
      if (k === "sun") return '<circle cx="150" cy="44" r="24" fill="url(#gl-sun)"/>';
      if (k === "house") return '<g><rect x="72" y="82" width="56" height="40" rx="2" fill="#f3ddb2"/><path d="M66 82 L100 56 L134 82 Z" fill="#d1573e"/><rect x="91" y="100" width="15" height="22" rx="1" fill="#8a5a3b"/><rect x="80" y="90" width="13" height="11" fill="#bfe3ff" stroke="#7fb2d9" stroke-width="1"/></g>';
      return "";
    }
    function draw() {
      var svg = '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"><defs>' +
        '<linearGradient id="gl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cb8f2"/><stop offset="1" stop-color="#cfeaff"/></linearGradient>' +
        '<radialGradient id="gl-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff7c8"/><stop offset="1" stop-color="#ffce3c"/></radialGradient>' +
        '<pattern id="gl-check" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#ffffff"/><rect width="8" height="8" fill="#e9edf1"/><rect x="8" y="8" width="8" height="8" fill="#e9edf1"/></pattern>' +
        '</defs><rect width="200" height="140" fill="url(#gl-check)"/>';
      order.slice().reverse().forEach(function (idx) { svg += dl(w.layers[idx].draw); });
      comp.innerHTML = svg + "</svg>";
      lyrs.innerHTML = order.map(function (idx, pos) { var l = w.layers[idx]; return '<div class="glab-lyr"><span class="sw" style="background:' + l.color + '"></span><span class="nm">' + esc(l.name) + '</span><span class="mv"><button data-p="' + pos + '" data-d="-1"' + (pos === 0 ? " disabled" : "") + '>▲</button><button data-p="' + pos + '" data-d="1"' + (pos === order.length - 1 ? " disabled" : "") + ">▼</button></span></div>"; }).join("");
      lyrs.querySelectorAll(".mv button").forEach(function (b) { b.onclick = function () { var p = +b.dataset.p, t = p + (+b.dataset.d), tmp = order[p]; order[p] = order[t]; order[t] = tmp; verdict.hidden = true; draw(); }; });
    }
    draw();
    node.querySelector('[data-a="check"]').onclick = function () { var ok = JSON.stringify(order) === JSON.stringify(w.targetOrder); if (ok) done(w); verdict.hidden = false; verdict.className = "glab-verdict " + (ok ? "ok" : "no"); verdict.innerHTML = ok ? "<b>Chính xác! Thứ tự lớp đã đúng.</b>" : "<b>Chưa đúng.</b> Nhớ: lớp ở TRÊN che lớp ở DƯỚI."; };
  }

  /* ============ 3) KHUNG CHỌN (kéo chọn vùng) ============ */
  function renderCrop(node, w) {
    var t = w.target, sel = null;
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-cropwrap"><div class="glab-stage">' + scene() + "</div>" +
      '<svg class="glab-crop-ov" viewBox="0 0 200 140" preserveAspectRatio="none"><rect x="' + t.x + '" y="' + t.y + '" width="' + t.w + '" height="' + t.h + '" fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/><rect data-sel="1" fill="rgba(79,70,229,0.22)" stroke="#4f46e5" stroke-width="1.5" width="0" height="0"/></svg></div>' +
      '<p style="color:var(--text-soft);font-size:12.5px;text-align:center;margin:8px 0 0">Kéo chuột trên ảnh để vẽ khung chọn trùng ô nét đứt.</p>' +
      '<div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var ov = node.querySelector(".glab-crop-ov"), selEl = node.querySelector('[data-sel="1"]'), verdict = node.querySelector(".glab-verdict");
    var start = null;
    function pt(e) { var r = ov.getBoundingClientRect(); var cx = (e.touches ? e.touches[0].clientX : e.clientX), cy = (e.touches ? e.touches[0].clientY : e.clientY); return { x: Math.max(0, Math.min(200, (cx - r.left) / r.width * 200)), y: Math.max(0, Math.min(140, (cy - r.top) / r.height * 140)) }; }
    function setRect(a, b) { var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), ww = Math.abs(a.x - b.x), hh = Math.abs(a.y - b.y); selEl.setAttribute("x", x); selEl.setAttribute("y", y); selEl.setAttribute("width", ww); selEl.setAttribute("height", hh); sel = { x: x, y: y, w: ww, h: hh }; }
    ov.addEventListener("pointerdown", function (e) { e.preventDefault(); start = pt(e); setRect(start, start); verdict.hidden = true; ov.setPointerCapture && ov.setPointerCapture(e.pointerId); });
    ov.addEventListener("pointermove", function (e) { if (start) setRect(start, pt(e)); });
    ov.addEventListener("pointerup", function () { start = null; });
    node.querySelector('[data-a="check"]').onclick = function () {
      verdict.hidden = false;
      if (!sel || sel.w < 6 || sel.h < 6) { verdict.className = "glab-verdict no"; verdict.innerHTML = "<b>Hãy kéo để vẽ khung chọn trước nhé.</b>"; return; }
      var tol = 14, ok = Math.abs(sel.x - t.x) <= tol && Math.abs(sel.y - t.y) <= tol && Math.abs((sel.x + sel.w) - (t.x + t.w)) <= tol && Math.abs((sel.y + sel.h) - (t.y + t.h)) <= tol;
      if (ok) done(w); verdict.className = "glab-verdict " + (ok ? "ok" : "no");
      verdict.innerHTML = ok ? "<b>Chính xác! Khung chọn đã trùng vùng cần chọn.</b>" : "<b>Chưa khít.</b> Kéo lại cho khung trùng với ô nét đứt hơn.";
    };
  }

  /* ============ 4) PHA MÀU (RGB) ============ */
  var CKEYS = [{ k: "r", label: "Đỏ (R)" }, { k: "g", label: "Lục (G)" }, { k: "b", label: "Lam (B)" }];
  function rgb(c) { return "rgb(" + c.r + "," + c.g + "," + c.b + ")"; }
  function renderColorpick(node, w) {
    var cur = { r: 128, g: 128, b: 128 };
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-two"><div><div class="glab-cap">Màu của bạn</div><div class="glab-sw" data-r="mine"></div></div><div><div class="glab-cap">Màu mẫu</div><div class="glab-sw" style="background:' + rgb(w.target) + '"></div></div></div>' +
      '<div class="glab-sliders">' + CKEYS.map(function (f) { return '<div class="glab-row"><label>' + f.label + '</label><input type="range" data-k="' + f.k + '" min="0" max="255" step="1" value="' + cur[f.k] + '"><b data-v="' + f.k + '">' + cur[f.k] + "</b></div>"; }).join("") + "</div>" +
      '<div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var mine = node.querySelector('[data-r="mine"]'), verdict = node.querySelector(".glab-verdict");
    function apply() { mine.style.background = rgb(cur); }
    apply();
    node.querySelectorAll('input[type=range]').forEach(function (r) { r.oninput = function () { cur[r.dataset.k] = +r.value; node.querySelector('[data-v="' + r.dataset.k + '"]').textContent = r.value; apply(); verdict.hidden = true; }; });
    node.querySelector('[data-a="check"]').onclick = function () {
      var tol = 22, fb = CKEYS.map(function (f) { var d = cur[f.k] - w.target[f.k]; return { ok: Math.abs(d) <= tol, t: f.label + ": " + (Math.abs(d) <= tol ? "đạt" : (d < 0 ? "cần tăng" : "cần giảm")) }; });
      var all = fb.every(function (x) { return x.ok; }); if (all) done(w);
      verdict.hidden = false; verdict.className = "glab-verdict " + (all ? "ok" : "no");
      verdict.innerHTML = (all ? "<b>Chính xác! Đã pha đúng màu mẫu.</b>" : "<b>Chưa khớp — chỉnh tiếp:</b>") + "<ul>" + fb.map(function (x) { return okLine(x.ok, x.t); }).join("") + "</ul>";
    };
  }

  /* ============ 5) NỐI CẶP (match) ============ */
  var PAIR_COLORS = ["#2563eb", "#16a34a", "#d97706", "#9333ea", "#dc2626"];
  function renderMatch(node, w) {
    var lefts = w.pairs.map(function (p) { return p.l; });
    var rights = seedShuffle(w.pairs.map(function (p) { return p.r; }), 7).slice();
    var assign = lefts.map(function () { return -1; }); // assign[i] = index trong rights
    var selL = -1;
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<p style="color:var(--text-soft);font-size:12.5px;margin:0 0 8px">Bấm một ô bên trái rồi bấm ô bên phải tương ứng để nối.</p>' +
      '<div class="glab-match"><div class="glab-mcol" data-c="L"></div><div class="glab-mcol" data-c="R"></div></div>' +
      '<div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var L = node.querySelector('[data-c="L"]'), R = node.querySelector('[data-c="R"]'), verdict = node.querySelector(".glab-verdict");
    function rightOwner(ri) { for (var i = 0; i < assign.length; i++) if (assign[i] === ri) return i; return -1; }
    function badge(i) { return '<span class="bdg" style="background:' + PAIR_COLORS[i % 5] + '">' + (i + 1) + "</span>"; }
    function draw() {
      L.innerHTML = lefts.map(function (t, i) { return '<div class="glab-mi' + (assign[i] >= 0 ? " paired" : "") + (selL === i ? " sel" : "") + '" data-i="' + i + '">' + badge(i) + "<span>" + esc(t) + "</span></div>"; }).join("");
      R.innerHTML = rights.map(function (t, ri) { var o = rightOwner(ri); return '<div class="glab-mi' + (o >= 0 ? " paired" : "") + '" data-r="' + ri + '">' + (o >= 0 ? badge(o) : '<span class="bdg"></span>') + "<span>" + esc(t) + "</span></div>"; }).join("");
      L.querySelectorAll("[data-i]").forEach(function (el) { el.onclick = function () { selL = +el.dataset.i; verdict.hidden = true; draw(); }; });
      R.querySelectorAll("[data-r]").forEach(function (el) { el.onclick = function () { if (selL < 0) return; var ri = +el.dataset.r, prev = rightOwner(ri); if (prev >= 0) assign[prev] = -1; assign[selL] = ri; selL = -1; verdict.hidden = true; draw(); }; });
    }
    draw();
    node.querySelector('[data-a="check"]').onclick = function () {
      var fb = lefts.map(function (t, i) { var ok = assign[i] >= 0 && rights[assign[i]] === w.pairs[i].r; return { ok: ok, t: t }; });
      var all = fb.every(function (x) { return x.ok; }); if (all) done(w);
      verdict.hidden = false; verdict.className = "glab-verdict " + (all ? "ok" : "no");
      verdict.innerHTML = (all ? "<b>Chính xác! Nối đúng hết các cặp.</b>" : "<b>Chưa đúng hết:</b>") + "<ul>" + fb.map(function (x) { return okLine(x.ok, x.t); }).join("") + "</ul>";
    };
  }

  /* ============ 6) SẮP THỨ TỰ (order) ============ */
  function renderOrder(node, w) {
    var order = w.items.map(function (_, i) { return i; });
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-strip" data-r="strip"></div>' +
      '<div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var strip = node.querySelector('[data-r="strip"]'), verdict = node.querySelector(".glab-verdict");
    function draw() {
      strip.innerHTML = order.map(function (idx, pos) { return '<div class="glab-tile"><div class="tn">' + (pos + 1) + '</div><div>' + esc(w.items[idx].label) + '</div><div class="mv"><button data-p="' + pos + '" data-d="-1"' + (pos === 0 ? " disabled" : "") + '>◀</button><button data-p="' + pos + '" data-d="1"' + (pos === order.length - 1 ? " disabled" : "") + ">▶</button></div></div>"; }).join("");
      strip.querySelectorAll(".mv button").forEach(function (b) { b.onclick = function () { var p = +b.dataset.p, t = p + (+b.dataset.d), tmp = order[p]; order[p] = order[t]; order[t] = tmp; verdict.hidden = true; draw(); }; });
    }
    draw();
    node.querySelector('[data-a="check"]').onclick = function () { var ok = JSON.stringify(order) === JSON.stringify(w.targetOrder); if (ok) done(w); verdict.hidden = false; verdict.className = "glab-verdict " + (ok ? "ok" : "no"); verdict.innerHTML = ok ? "<b>Chính xác! Thứ tự đã đúng.</b>" : "<b>Chưa đúng.</b> Dùng ◀ ▶ để sắp lại cho đúng trình tự."; };
  }

  /* ============ 7) HOTSPOT (bấm đúng công cụ/vùng) ============ */
  function toolbarImg() {
    var T = [
      { n: "Bút vẽ", ic: '<path d="M-9 9 L5 -5 L8 -2 L-6 12 Z" fill="#5b7cff"/><path d="M-9 9 L-11 13 L-6 12 Z" fill="#333"/>' },
      { n: "Tẩy", ic: '<rect x="-9" y="-4" width="17" height="9" rx="2" transform="rotate(-18)" fill="#ff9db0" stroke="#c76"/>' },
      { n: "Chọn", ic: '<rect x="-9" y="-7" width="18" height="14" rx="1" fill="none" stroke="#333" stroke-dasharray="3 2"/>' },
      { n: "Đổ màu", ic: '<path d="M-8 -4 L4 -4 L2 6 L-6 6 Z" fill="#7bd3ee" stroke="#39a8c9"/><circle cx="7" cy="5" r="2.6" fill="#39a8c9"/>' },
      { n: "Chữ", ic: '<path d="M-7 -6 H7 M0 -6 V8" stroke="#333" stroke-width="2.5" fill="none"/>' },
    ];
    var svg = '<svg viewBox="0 0 200 54" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="54" rx="6" fill="#eef1f5"/>';
    T.forEach(function (t, i) { var cx = i * 40 + 20; svg += '<g transform="translate(' + cx + ',20)">' + t.ic + "</g><text x=\"" + cx + "\" y=\"48\" font-size=\"7.5\" text-anchor=\"middle\" fill=\"#444\">" + t.n + "</text>"; });
    return svg + "</svg>";
  }
  var TOOLBAR_REGIONS = ["but", "tay", "chon", "do", "chu"].map(function (id, i) { return { id: id, x: i * 40, y: 0, w: 40, h: 54 }; });
  function renderHotspot(node, w) {
    var picked = null;
    var isBar = w.image === "toolbar";
    var img = isBar ? toolbarImg() : scene();
    var regions = isBar ? TOOLBAR_REGIONS : w.regions;
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-cropwrap" style="max-width:' + (isBar ? "420" : "340") + 'px"><div class="glab-stage">' + img + "</div>" +
      '<svg class="glab-crop-ov" style="cursor:pointer" viewBox="0 0 200 ' + (isBar ? "54" : "140") + '" preserveAspectRatio="none">' +
      regions.map(function (r) { return '<rect data-id="' + r.id + '" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" fill="rgba(0,0,0,0.001)" stroke="transparent" stroke-width="2"/>'; }).join("") +
      '</svg></div><div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var ov = node.querySelector(".glab-crop-ov"), verdict = node.querySelector(".glab-verdict");
    ov.querySelectorAll("[data-id]").forEach(function (el) { el.onclick = function () { picked = el.dataset.id; ov.querySelectorAll("[data-id]").forEach(function (x) { x.setAttribute("stroke", "transparent"); }); el.setAttribute("stroke", "#4f46e5"); verdict.hidden = true; }; });
    node.querySelector('[data-a="check"]').onclick = function () {
      verdict.hidden = false;
      if (!picked) { verdict.className = "glab-verdict no"; verdict.innerHTML = "<b>Hãy bấm vào một chỗ trước nhé.</b>"; return; }
      var ok = picked === w.answer; if (ok) done(w);
      verdict.className = "glab-verdict " + (ok ? "ok" : "no");
      verdict.innerHTML = ok ? "<b>Chính xác! Bạn bấm đúng rồi.</b>" : "<b>Chưa đúng.</b> " + (w.miss || "Thử lại nhé.");
    };
  }

  /* ============ 8) ĐẶT HÌNH (kéo-thả đúng vị trí) ============ */
  var PIECE = {
    sun: '<circle r="14" fill="#ffce3c" stroke="#f0a92e"/>',
    house: '<g><rect x="-16" y="-4" width="32" height="22" rx="2" fill="#f3ddb2"/><path d="M-19 -4 L0 -18 L19 -4 Z" fill="#d1573e"/><rect x="-5" y="4" width="10" height="14" fill="#8a5a3b"/></g>',
    tree: '<g><rect x="-2.5" y="4" width="5" height="12" fill="#8a5a3b"/><circle cx="0" cy="-4" r="12" fill="#4ca35a"/></g>',
    cloud: '<g fill="#ffffff" stroke="#cdd8e0"><ellipse cx="-6" cy="0" rx="12" ry="7"/><ellipse cx="6" cy="1" rx="10" ry="6"/></g>',
  };
  function renderPlace(node, w) {
    var pos = w.pieces.map(function (p) { return { x: p.x0, y: p.y0 }; });
    var drag = null;
    node.innerHTML = '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-cropwrap" style="max-width:340px"><svg class="glab-place" viewBox="0 0 200 140" preserveAspectRatio="none" style="width:100%;display:block;border:1px solid var(--border);border-radius:10px;background:#eef6ff;touch-action:none"></svg></div>' +
      '<p style="color:var(--text-soft);font-size:12.5px;text-align:center;margin:8px 0 0">Kéo mỗi hình vào đúng ô nét đứt.</p>' +
      '<div class="glab-actions"><button class="btn btn-primary" data-a="check">' + ico("check2", null, 14) + ' Kiểm tra</button></div><div class="glab-verdict" hidden></div>';
    var svg = node.querySelector(".glab-place"), verdict = node.querySelector(".glab-verdict");
    function toVb(e) { var r = svg.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 200, y: (e.clientY - r.top) / r.height * 140 }; }
    function build() {
      var s = "";
      w.pieces.forEach(function (p) { var t = tgtOf(p.id); s += '<circle cx="' + t.x + '" cy="' + t.y + '" r="17" fill="none" stroke="#9aa7b4" stroke-width="1.3" stroke-dasharray="4 3"/>'; });
      w.pieces.forEach(function (p, i) { s += '<g data-pi="' + i + '" transform="translate(' + pos[i].x + "," + pos[i].y + ')" style="cursor:grab">' + PIECE[p.id] + "</g>"; });
      svg.innerHTML = s;
      svg.querySelectorAll("[data-pi]").forEach(function (g) { g.addEventListener("pointerdown", function (e) { e.preventDefault(); var i = +g.dataset.pi; var pt = toVb(e); drag = { i: i, ox: pt.x - pos[i].x, oy: pt.y - pos[i].y }; svg.setPointerCapture && svg.setPointerCapture(e.pointerId); }); });
    }
    function tgtOf(id) { for (var i = 0; i < w.targets.length; i++) if (w.targets[i].id === id) return w.targets[i]; return { x: 0, y: 0 }; }
    svg.addEventListener("pointermove", function (e) { if (!drag) return; var pt = toVb(e); pos[drag.i] = { x: Math.max(6, Math.min(194, pt.x - drag.ox)), y: Math.max(6, Math.min(134, pt.y - drag.oy)) }; svg.querySelector('[data-pi="' + drag.i + '"]').setAttribute("transform", "translate(" + pos[drag.i].x + "," + pos[drag.i].y + ")"); verdict.hidden = true; });
    svg.addEventListener("pointerup", function () { drag = null; });
    svg.addEventListener("pointerleave", function () { drag = null; });
    build();
    node.querySelector('[data-a="check"]').onclick = function () {
      var tol = 20, fb = w.pieces.map(function (p, i) { var t = tgtOf(p.id); var d = Math.hypot(pos[i].x - t.x, pos[i].y - t.y); return { ok: d <= tol, t: p.label }; });
      var all = fb.every(function (x) { return x.ok; }); if (all) done(w);
      verdict.hidden = false; verdict.className = "glab-verdict " + (all ? "ok" : "no");
      verdict.innerHTML = (all ? "<b>Chính xác! Các hình đã vào đúng chỗ.</b>" : "<b>Chưa đúng hết — kéo cho khít hơn:</b>") + "<ul>" + fb.map(function (x) { return okLine(x.ok, x.t); }).join("") + "</ul>";
    };
  }

  function renderWidget(node, w) {
    if (w.type === "filter") return renderFilter(node, w);
    if (w.type === "layers") return renderLayers(node, w);
    if (w.type === "crop") return renderCrop(node, w);
    if (w.type === "colorpick") return renderColorpick(node, w);
    if (w.type === "match") return renderMatch(node, w);
    if (w.type === "order") return renderOrder(node, w);
    if (w.type === "hotspot") return renderHotspot(node, w);
    if (w.type === "place") return renderPlace(node, w);
  }

  /* ---------------- Widget theo bài học ---------------- */
  var GLAB = {
    "C10-09": [{ type: "match", prompt: "Nối mỗi **thao tác/khái niệm đồ hoạ** với mô tả đúng.", pairs: [{ l: "Lớp (layer)", r: "Tầng ảnh xếp chồng, sửa riêng không ảnh hưởng lớp khác" }, { l: "Vùng chọn", r: "Giới hạn thao tác vào một phần của ảnh" }, { l: "Ảnh vector", r: "Vẽ bằng đường và hình, phóng to không vỡ" }, { l: "Ảnh điểm (bitmap)", r: "Gồm nhiều điểm ảnh, phóng to sẽ bị vỡ hạt" }] }, { type: "hotspot", image: "toolbar", prompt: "Trên thanh công cụ, **bấm vào công cụ dùng để khoanh vùng (chọn) một phần ảnh**.", answer: "chon", miss: "Công cụ chọn thường là hình chữ nhật nét đứt." }],
    "C10-10": [{ type: "colorpick", prompt: "Pha ba kênh **Đỏ, Lục, Lam** để tạo màu **cam** giống ô mẫu (gợi ý: đỏ cao, lục vừa, lam thấp).", target: { r: 240, g: 140, b: 40 } }, { type: "place", prompt: "Vẽ tranh bằng cách **kéo mỗi hình về đúng ô nét đứt**: mặt trời góc trên phải, ngôi nhà giữa dưới, cái cây bên trái.", pieces: [{ id: "sun", label: "Mặt trời", x0: 28, y0: 120 }, { id: "house", label: "Ngôi nhà", x0: 100, y0: 122 }, { id: "tree", label: "Cái cây", x0: 172, y0: 120 }], targets: [{ id: "sun", x: 158, y: 30 }, { id: "house", x: 100, y: 96 }, { id: "tree", x: 34, y: 92 }] }],
    "C10-28": [{ type: "order", prompt: "Sắp đúng **trình tự hoàn thiện một bản vẽ vector** rồi xuất file.", items: [{ label: "Vẽ các hình cơ bản" }, { label: "Chỉnh nét & màu" }, { label: "Ghép/nhóm đối tượng" }, { label: "Xuất file ảnh" }], targetOrder: [0, 1, 2, 3] }],
    "U11-09": [{ type: "layers", prompt: "Trong phần mềm ảnh, **lớp ở trên che lớp ở dưới**. Hãy sắp để **Ngôi nhà** trên cùng, rồi **Mặt trời**, dưới cùng là **Bầu trời**.", layers: [{ name: "Bầu trời (nền)", color: "#7cc4f2", draw: "sky" }, { name: "Mặt trời", color: "#ffcf3f", draw: "sun" }, { name: "Ngôi nhà", color: "#d1573e", draw: "house" }], targetOrder: [2, 1, 0] }],
    "U11-10": [{ type: "filter", prompt: "Kéo các thanh **Độ sáng, Tương phản, Bão hoà, Xoay màu** cho **ảnh của bạn** giống **ảnh mẫu**.", target: { b: 1.25, c: 1.2, s: 1.5, h: 0 } }],
    "U11-11": [{ type: "crop", prompt: "Dùng công cụ chọn: **kéo một khung chọn bao quanh ngôi nhà** (trùng ô nét đứt).", target: { x: 36, y: 62, w: 60, h: 58 } }, { type: "hotspot", prompt: "Luyện mắt chọn vùng: **bấm vào vùng có ngôi nhà** trong ảnh.", regions: [{ id: "sky", x: 0, y: 0, w: 200, h: 62 }, { id: "sun", x: 138, y: 16, w: 40, h: 40 }, { id: "house", x: 36, y: 56, w: 62, h: 64 }], answer: "house", miss: "Ngôi nhà nằm ở phía dưới bên trái." }],
    "U11-12": [{ type: "colorpick", prompt: "Chọn màu để tô: pha ra màu **xanh lá cây** giống ô mẫu (lục cao, đỏ và lam thấp).", target: { r: 60, g: 170, b: 80 } }],
    "U11-13": [{ type: "order", prompt: "Ảnh động là chuỗi **khung hình** chiếu nối tiếp. Sắp các khung để quả bóng **rơi từ trên xuống rồi nảy lên**.", items: [{ label: "Bóng ở đỉnh" }, { label: "Bóng lưng chừng" }, { label: "Bóng chạm đất" }, { label: "Bóng nảy lên" }], targetOrder: [0, 1, 2, 3] }],
    "U11-14": [{ type: "match", prompt: "Nối mỗi **thành phần khi dựng phim** với vai trò của nó.", pairs: [{ l: "Dòng thời gian (timeline)", r: "Nơi sắp các clip theo thứ tự thời gian" }, { l: "Rãnh (track)", r: "Hàng chứa riêng hình, hoặc âm thanh" }, { l: "Khung hình/giây (fps)", r: "Số hình chiếu mỗi giây, càng cao càng mượt" }, { l: "Xem trước (preview)", r: "Chạy thử phim trước khi xuất" }] }],
    "U11-15": [{ type: "order", prompt: "Sắp các cảnh cho đúng **mạch câu chuyện** một chuyến đi rồi mới xuất phim.", items: [{ label: "Lên xe khởi hành" }, { label: "Tới nơi tham quan" }, { label: "Hoạt động trải nghiệm" }, { label: "Chụp ảnh cả nhóm" }], targetOrder: [0, 1, 2, 3] }],
  };

  function injectGraphicsLab(lesson) {
    var list = GLAB[lesson.id];
    if (!list || !list.length) return;
    var anchor = document.querySelector(".ls-actions");
    if (!anchor || !anchor.parentNode) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = '<div class="section-title" style="margin-top:24px">' + ico("sprout", "#0891b2", 17) + " Thử thao tác (mô phỏng)</div>" +
      '<p style="color:var(--text-soft);font-size:13.5px;margin-bottom:12px">Mô phỏng ngay trên trình duyệt để cảm nhận thao tác — không thay phần mềm thật nhưng giúp hiểu khái niệm nhanh hơn.</p><div class="glab-host"></div>';
    anchor.parentNode.insertBefore(wrap, anchor);
    var host = wrap.querySelector(".glab-host");
    list.forEach(function (w) { var d = document.createElement("div"); d.className = "glab"; host.appendChild(d); renderWidget(d, w); });
  }

  /* ---------------- Trang "Xưởng đồ hoạ" (route gfxLab) ---------------- */
  var GFX_ITEMS = [
    { head: "Chỉnh ảnh (độ sáng, màu sắc)", w: { type: "filter", prompt: "Kéo các thanh cho **ảnh của bạn** giống **ảnh mẫu**.", target: { b: 1.2, c: 1.15, s: 1.4, h: 0 } } },
    { head: "Xếp lớp (lớp trên che lớp dưới)", w: { type: "layers", prompt: "Sắp để **Ngôi nhà** trên cùng, dưới cùng là **Bầu trời**.", layers: [{ name: "Bầu trời (nền)", color: "#7cc4f2", draw: "sky" }, { name: "Mặt trời", color: "#ffcf3f", draw: "sun" }, { name: "Ngôi nhà", color: "#d1573e", draw: "house" }], targetOrder: [2, 1, 0] } },
    { head: "Khung chọn (chọn một vùng ảnh)", w: { type: "crop", prompt: "**Kéo một khung chọn bao quanh mặt trời** (trùng ô nét đứt).", target: { x: 130, y: 12, w: 52, h: 46 } } },
    { head: "Pha màu RGB", w: { type: "colorpick", prompt: "Pha ra màu **tím** giống ô mẫu (đỏ vừa, lam cao, lục thấp).", target: { r: 150, g: 60, b: 200 } } },
    { head: "Nối cặp công cụ ↔ công dụng", w: { type: "match", prompt: "Nối mỗi công cụ ảnh với công dụng đúng.", pairs: [{ l: "Bút vẽ", r: "Tô/vẽ nét lên ảnh" }, { l: "Tẩy", r: "Xoá phần ảnh đã vẽ" }, { l: "Công cụ chọn", r: "Khoanh vùng để thao tác" }, { l: "Đổ màu", r: "Tô đầy một vùng bằng một màu" }] } },
    { head: "Sắp trình tự làm phim", w: { type: "order", prompt: "Sắp đúng các bước dựng một video ngắn.", items: [{ label: "Nhập tư liệu" }, { label: "Cắt & sắp clip" }, { label: "Thêm nhạc/chữ" }, { label: "Xuất phim" }], targetOrder: [0, 1, 2, 3] } },
    { head: "Bấm đúng công cụ (trắc nghiệm GUI)", w: { type: "hotspot", image: "toolbar", prompt: "Trên thanh công cụ, **bấm vào công cụ dùng để tô/vẽ nét** lên ảnh.", answer: "but", miss: "Đó là công cụ Bút vẽ (biểu tượng cây bút)." } },
    { head: "Kéo-thả đặt hình đúng vị trí", w: { type: "place", prompt: "**Kéo mặt trời** lên góc trên phải và **ngôi nhà** xuống giữa dưới cho khớp ô nét đứt.", pieces: [{ id: "sun", label: "Mặt trời", x0: 30, y0: 118 }, { id: "house", label: "Ngôi nhà", x0: 150, y0: 118 }], targets: [{ id: "sun", x: 160, y: 28 }, { id: "house", x: 96, y: 98 }] } },
  ];
  function renderGfxLab() {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = '<button class="back-link" data-a="back">' + ico("aleft", null, 15) + " Về trang chủ</button>" +
      '<h2 style="margin-bottom:6px">' + ico("sprout", "#0891b2", 22) + " Xưởng đồ hoạ</h2>" +
      '<p style="color:var(--text-soft);font-size:14px;margin:0 0 16px">Nơi thử các thao tác đồ hoạ mô phỏng ngay trong trình duyệt: chỉnh ảnh, xếp lớp, chọn vùng, pha màu, nối cặp, sắp trình tự. Không thay phần mềm thật nhưng giúp cảm nhận và hiểu khái niệm nhanh.</p>' +
      '<div id="gfxHost"></div>';
    app.querySelector('[data-a="back"]').onclick = function () { if (typeof go === "function") go("home"); };
    var host = app.querySelector("#gfxHost");
    GFX_ITEMS.forEach(function (it) {
      var sec = document.createElement("div");
      sec.innerHTML = '<div class="section-title" style="margin-top:8px">' + ico("sprout", "#0891b2", 16) + " " + esc(it.head) + "</div>";
      var d = document.createElement("div"); d.className = "glab"; d.style.marginBottom = "16px";
      host.appendChild(sec); host.appendChild(d); renderWidget(d, it.w);
    });
    if (typeof iconify === "function") iconify(app);
  }

  if (typeof window !== "undefined") {
    window.GLAB = GLAB;
    window.injectGraphicsLab = injectGraphicsLab;
    window.renderGfxLab = renderGfxLab;
  }
})();
