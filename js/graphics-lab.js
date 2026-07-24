/* ============================================================================
 *  XƯỞNG ĐỒ HOẠ TƯƠNG TÁC — cho các bài đồ hoạ/ảnh có "bóng dáng thực hành".
 *  Không chạy phần mềm GUI thật, nhưng dùng SVG + CSS filter + kéo/xếp trong
 *  trình duyệt để học sinh THAO TÁC thật rồi máy chấm. Nạp TRƯỚC app.js.
 *   injectGraphicsLab(lesson) gọi trong renderLesson.
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
    ".glab-row{display:grid;grid-template-columns:96px 1fr 44px;align-items:center;gap:9px;font-size:13.5px}" +
    ".glab-row input[type=range]{width:100%}" +
    ".glab-row b{text-align:right;font-family:Consolas,monospace;color:var(--text-soft)}" +
    ".glab-layers{margin-top:10px;display:grid;gap:7px}" +
    ".glab-lyr{display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:9px;padding:7px 10px;background:var(--bg-soft)}" +
    ".glab-lyr .sw{width:18px;height:18px;border-radius:4px;flex:0 0 auto;border:1px solid rgba(0,0,0,.2)}" +
    ".glab-lyr .nm{flex:1;font-size:14px;font-weight:600}" +
    ".glab-lyr .mv{display:flex;gap:4px}" +
    ".glab-lyr .mv button{border:1px solid var(--border);background:var(--bg-card);border-radius:7px;width:30px;height:28px;cursor:pointer;font-size:14px;color:var(--text)}" +
    ".glab-lyr .mv button:disabled{opacity:.35;cursor:default}" +
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

  /* Ảnh gốc: một cảnh SVG tự vẽ (không dính bản quyền), đủ màu để thấy rõ filter. */
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

  /* ------------------------- Widget: CHỈNH ẢNH (CSS filter) ------------------------- */
  function filterStr(v) { return "brightness(" + v.b + ") contrast(" + v.c + ") saturate(" + v.s + ") hue-rotate(" + v.h + "deg)"; }
  var FKEYS = [
    { k: "b", label: "Độ sáng", min: 0.5, max: 1.5, step: 0.05, tol: 0.08 },
    { k: "c", label: "Tương phản", min: 0.5, max: 1.5, step: 0.05, tol: 0.08 },
    { k: "s", label: "Bão hoà", min: 0, max: 2, step: 0.05, tol: 0.12 },
    { k: "h", label: "Xoay màu", min: 0, max: 180, step: 5, tol: 15 },
  ];
  function renderFilter(node, w) {
    var cur = { b: 1, c: 1, s: 1, h: 0 };
    node.innerHTML =
      '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-two">' +
        '<div><div class="glab-cap">Ảnh của bạn</div><div class="glab-stage" id="mine">' + scene() + "</div></div>" +
        '<div><div class="glab-cap">Ảnh mẫu (cần đạt tới)</div><div class="glab-stage" id="goal">' + scene() + "</div></div>" +
      "</div>" +
      '<div class="glab-sliders">' + FKEYS.map(function (f) {
        return '<div class="glab-row"><label>' + f.label + '</label><input type="range" data-k="' + f.k + '" min="' + f.min + '" max="' + f.max + '" step="' + f.step + '" value="' + cur[f.k] + '"><b data-v="' + f.k + '">' + cur[f.k] + "</b></div>";
      }).join("") + "</div>" +
      '<div class="glab-actions"><button class="btn btn-ghost" id="gReset">' + (typeof ICON === "function" ? ICON("refresh", 14) : "") + ' Đặt lại</button><button class="btn btn-primary" id="gCheck">' + (typeof ICON === "function" ? ICON("check2", 14) : "") + " Kiểm tra</button></div>" +
      '<div class="glab-verdict" hidden></div>';
    var mine = node.querySelector("#mine"), goal = node.querySelector("#goal"), verdict = node.querySelector(".glab-verdict");
    goal.style.filter = filterStr(w.target);
    function apply() { mine.style.filter = filterStr(cur); }
    apply();
    node.querySelectorAll('input[type=range]').forEach(function (r) {
      r.oninput = function () { cur[r.dataset.k] = parseFloat(r.value); node.querySelector('[data-v="' + r.dataset.k + '"]').textContent = r.value; apply(); verdict.hidden = true; };
    });
    node.querySelector("#gReset").onclick = function () {
      cur = { b: 1, c: 1, s: 1, h: 0 }; verdict.hidden = true;
      node.querySelectorAll('input[type=range]').forEach(function (r) { r.value = cur[r.dataset.k]; node.querySelector('[data-v="' + r.dataset.k + '"]').textContent = cur[r.dataset.k]; }); apply();
    };
    node.querySelector("#gCheck").onclick = function () {
      var fb = FKEYS.map(function (f) {
        var d = cur[f.k] - w.target[f.k], ok = Math.abs(d) <= f.tol;
        var dir = ok ? "đạt" : (d < 0 ? "cần tăng thêm" : "cần giảm bớt");
        return { label: f.label, ok: ok, dir: dir };
      });
      var all = fb.every(function (x) { return x.ok; });
      if (all && typeof Gam !== "undefined" && Gam.onExercisePass) Gam.onExercisePass({ prompt: w.prompt });
      verdict.hidden = false; verdict.className = "glab-verdict " + (all ? "ok" : "no");
      verdict.innerHTML = (all ? "<b>Chính xác! Ảnh của bạn đã khớp ảnh mẫu.</b>" : "<b>Gần rồi — chỉnh tiếp mấy thanh sau:</b>") +
        "<ul>" + fb.map(function (x) { return "<li>" + (typeof ICON === "function" ? ICON(x.ok ? "check2" : "aright", 14, x.ok ? "#16a34a" : "#d97706") : "") + " " + x.label + ": " + x.dir + "</li>"; }).join("") + "</ul>";
    };
  }

  /* ------------------------- Widget: XẾP LỚP (z-order) ------------------------- */
  function renderLayers(node, w) {
    var order = w.layers.map(function (_, i) { return i; }); // thứ tự hiện tại (đầu danh sách = trên cùng)
    node.innerHTML =
      '<div class="glab-prompt">' + fmtInline(w.prompt) + "</div>" +
      '<div class="glab-two"><div><div class="glab-cap">Kết quả ghép lớp</div><div class="glab-stage" id="comp"></div></div>' +
      '<div><div class="glab-cap">Thứ tự lớp (trên → dưới)</div><div class="glab-layers" id="lyrs"></div></div></div>' +
      '<div class="glab-actions"><button class="btn btn-primary" id="gCheck2">' + (typeof ICON === "function" ? ICON("check2", 14) : "") + " Kiểm tra</button></div>" +
      '<div class="glab-verdict" hidden></div>';
    var comp = node.querySelector("#comp"), lyrs = node.querySelector("#lyrs"), verdict = node.querySelector(".glab-verdict");
    function drawLayer(k) {
      if (k === "sky") return '<rect width="200" height="140" fill="url(#gl-sky)"/>';
      if (k === "sun") return '<circle cx="150" cy="44" r="24" fill="url(#gl-sun)"/>';
      if (k === "house") return '<g><rect x="72" y="82" width="56" height="40" rx="2" fill="#f3ddb2"/><path d="M66 82 L100 56 L134 82 Z" fill="#d1573e"/><rect x="91" y="100" width="15" height="22" rx="1" fill="#8a5a3b"/><rect x="80" y="90" width="13" height="11" fill="#bfe3ff" stroke="#7fb2d9" stroke-width="1"/></g>';
      return "";
    }
    function draw() {
      // vẽ từ DƯỚI lên: phần tử cuối danh sách vẽ trước (nằm dưới), đầu danh sách vẽ sau (trên cùng)
      var svg = '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"><defs>' +
        '<linearGradient id="gl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cb8f2"/><stop offset="1" stop-color="#cfeaff"/></linearGradient>' +
        '<radialGradient id="gl-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff7c8"/><stop offset="1" stop-color="#ffce3c"/></radialGradient>' +
        '<pattern id="gl-check" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#ffffff"/><rect width="8" height="8" fill="#e9edf1"/><rect x="8" y="8" width="8" height="8" fill="#e9edf1"/></pattern>' +
        "</defs><rect width=\"200\" height=\"140\" fill=\"url(#gl-check)\"/>";
      order.slice().reverse().forEach(function (idx) { svg += drawLayer(w.layers[idx].draw); });
      comp.innerHTML = svg + "</svg>";
      lyrs.innerHTML = order.map(function (idx, pos) {
        var l = w.layers[idx];
        return '<div class="glab-lyr"><span class="sw" style="background:' + l.color + '"></span><span class="nm">' + esc(l.name) + '</span><span class="mv">' +
          '<button data-pos="' + pos + '" data-d="-1"' + (pos === 0 ? " disabled" : "") + ' title="Lên">▲</button>' +
          '<button data-pos="' + pos + '" data-d="1"' + (pos === order.length - 1 ? " disabled" : "") + ' title="Xuống">▼</button></span></div>';
      }).join("");
      lyrs.querySelectorAll(".mv button").forEach(function (b) {
        b.onclick = function () { var p = +b.dataset.pos, d = +b.dataset.d, t = p + d; var tmp = order[p]; order[p] = order[t]; order[t] = tmp; verdict.hidden = true; draw(); };
      });
    }
    draw();
    node.querySelector("#gCheck2").onclick = function () {
      var ok = JSON.stringify(order) === JSON.stringify(w.targetOrder);
      if (ok && typeof Gam !== "undefined" && Gam.onExercisePass) Gam.onExercisePass({ prompt: w.prompt });
      verdict.hidden = false; verdict.className = "glab-verdict " + (ok ? "ok" : "no");
      verdict.innerHTML = ok ? "<b>Chính xác! Thứ tự lớp đã đúng.</b>" : "<b>Chưa đúng.</b> Nhớ: lớp ở TRÊN che lớp ở DƯỚI. Xem lại thứ tự rồi thử tiếp.";
    };
  }

  /* ------------------------- Dữ liệu widget theo bài ------------------------- */
  var GLAB = {
    "U11-10": [
      { type: "filter", prompt: "Kéo các thanh **Độ sáng, Tương phản, Bão hoà, Xoay màu** để **ảnh của bạn** trông giống **ảnh mẫu** bên phải, rồi bấm Kiểm tra.",
        target: { b: 1.25, c: 1.2, s: 1.5, h: 0 } },
    ],
    "U11-09": [
      { type: "layers", prompt: "Trong phần mềm ảnh, **lớp ở trên che lớp ở dưới**. Hãy sắp thứ tự để **Ngôi nhà** nổi trên cùng, rồi tới **Mặt trời**, dưới cùng là **Bầu trời**.",
        layers: [
          { name: "Bầu trời (nền)", color: "#7cc4f2", draw: "sky" },
          { name: "Mặt trời", color: "#ffcf3f", draw: "sun" },
          { name: "Ngôi nhà", color: "#d1573e", draw: "house" },
        ],
        targetOrder: [2, 1, 0] },
    ],
  };

  function injectGraphicsLab(lesson) {
    var list = GLAB[lesson.id];
    if (!list || !list.length) return;
    var anchor = document.querySelector(".ls-actions");
    if (!anchor || !anchor.parentNode) return;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="section-title" style="margin-top:24px">' + (typeof ICON === "function" ? ICON("sprout", 17, "#0891b2") : "") + " Thử thao tác (mô phỏng)</div>" +
      '<p style="color:var(--text-soft);font-size:13.5px;margin-bottom:12px">Đây là mô phỏng ngay trên trình duyệt để bạn cảm nhận thao tác — không thay cho phần mềm thật nhưng giúp hiểu khái niệm nhanh hơn.</p>' +
      '<div class="glab-host"></div>';
    anchor.parentNode.insertBefore(wrap, anchor);
    var host = wrap.querySelector(".glab-host");
    list.forEach(function (w) {
      var d = document.createElement("div"); d.className = "glab"; host.appendChild(d);
      if (w.type === "filter") renderFilter(d, w);
      else if (w.type === "layers") renderLayers(d, w);
    });
  }

  if (typeof window !== "undefined") {
    window.GLAB = GLAB;
    window.injectGraphicsLab = injectGraphicsLab;
  }
})();
