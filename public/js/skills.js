/* ============================================================================
 *  HỒ SƠ NĂNG LỰC — radar 7 chủ đề (kiểu chỉ số nhân vật) + luyện chỗ yếu.
 *  Đọc `detail` trong lịch sử làm bài (app.js ghi từ 28/07) để biết người học
 *  đúng/sai ở chủ đề nào, rồi:
 *    - vẽ biểu đồ radar ở trang Thành tựu (skillInjectRadar)
 *    - hiện thẻ "chỗ yếu" ở trang chủ (skillRenderCard)
 *    - dựng bộ câu ôn đúng chỗ yếu (skillWeakPool) cho tab "Chỗ yếu"
 *  Nạp TRƯỚC app.js. Không cần AI, không cần máy chủ.
 * ==========================================================================*/

/* Chỉ tính trên N câu GẦN NHẤT mỗi chủ đề -> phản ánh trình độ HIỆN TẠI, không
   bị kéo xuống bởi những lần sai hồi mới học. Dưới NGUONG câu thì coi như chưa
   đủ dữ liệu để kết luận. */
var SKILL_GANNHAT = 40;
var SKILL_NGUONG = 5;

var SKILL_MUC = [
  { min: 80, ten: "Thành thạo", mau: "#16a34a" },
  { min: 60, ten: "Khá vững", mau: "#0891b2" },
  { min: 40, ten: "Đang lên", mau: "#d97706" },
  { min: 0, ten: "Cần luyện thêm", mau: "#dc2626" },
];
function skillMuc(pct) {
  for (var i = 0; i < SKILL_MUC.length; i++) if (pct >= SKILL_MUC[i].min) return SKILL_MUC[i];
  return SKILL_MUC[SKILL_MUC.length - 1];
}

/* Gom mọi câu đã làm theo chủ đề, mới nhất trước. */
function skillStats() {
  var ds = (typeof TOPICS !== "undefined") ? Object.keys(TOPICS).sort() : [];
  var theo = {};
  ds.forEach(function (t) { theo[t] = { dung: 0, tong: 0, sai: [] }; });

  var lichSu = (typeof State !== "undefined" && State.history) || [];
  lichSu.forEach(function (h) {            // history đã sắp mới nhất trước
    (h.detail || []).forEach(function (d) {
      var o = theo[d.topic];
      if (!o || o.tong >= SKILL_GANNHAT) return;
      o.tong++;
      if (d.dung) o.dung++; else o.sai.push(d.id);
    });
  });

  var bang = ds.map(function (t) {
    var o = theo[t];
    var pct = o.tong ? Math.round((o.dung / o.tong) * 100) : 0;
    return {
      topic: t, ten: (typeof TOPICS !== "undefined" && TOPICS[t]) || t,
      dung: o.dung, tong: o.tong, pct: pct, sai: o.sai,
      du: o.tong >= SKILL_NGUONG, muc: skillMuc(pct),
    };
  });
  var duLieu = bang.filter(function (x) { return x.du; });
  var yeu = duLieu.slice().sort(function (a, b) { return a.pct - b.pct; })[0] || null;
  return { bang: bang, yeuNhat: yeu, soChuDeCoDuLieu: duLieu.length,
    tongCau: bang.reduce(function (s, x) { return s + x.tong; }, 0) };
}

/* ---------------------------------------------------------------------------
 *  Vẽ radar bằng SVG thuần (không thêm thư viện)
 * ------------------------------------------------------------------------- */
function skillRadarSvg(st) {
  var R = 96, CX = 150, CY = 128, n = st.bang.length;
  var goc = function (i) { return (Math.PI * 2 * i) / n - Math.PI / 2; };
  var diem = function (i, r) {
    return [(CX + Math.cos(goc(i)) * r).toFixed(1), (CY + Math.sin(goc(i)) * r).toFixed(1)];
  };
  var luoi = "";
  [0.25, 0.5, 0.75, 1].forEach(function (k) {
    var p = st.bang.map(function (_, i) { return diem(i, R * k).join(","); }).join(" ");
    luoi += '<polygon points="' + p + '" fill="none" stroke="var(--border)" stroke-width="1"' +
      (k === 1 ? "" : ' stroke-dasharray="3 3"') + " />";
  });
  var truc = st.bang.map(function (_, i) {
    var d = diem(i, R);
    return '<line x1="' + CX + '" y1="' + CY + '" x2="' + d[0] + '" y2="' + d[1] + '" stroke="var(--border)" stroke-width="1" />';
  }).join("");

  var vung = st.bang.map(function (x, i) { return diem(i, R * (x.du ? x.pct / 100 : 0)).join(","); }).join(" ");
  var cham = st.bang.map(function (x, i) {
    if (!x.du) return "";
    var d = diem(i, R * (x.pct / 100));
    return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="4" fill="' + x.muc.mau + '" stroke="var(--bg-card)" stroke-width="1.5" />';
  }).join("");

  var nhan = st.bang.map(function (x, i) {
    var d = diem(i, R + 20);
    var neo = Math.abs(Number(d[0]) - CX) < 12 ? "middle" : (Number(d[0]) > CX ? "start" : "end");
    return '<text x="' + d[0] + '" y="' + d[1] + '" text-anchor="' + neo + '" dominant-baseline="middle" ' +
      'font-size="13" font-weight="800" fill="' + (x.du ? "var(--text)" : "var(--text-soft)") + '">' + x.topic + "</text>" +
      '<text x="' + d[0] + '" y="' + (Number(d[1]) + 13) + '" text-anchor="' + neo + '" dominant-baseline="middle" ' +
      'font-size="10.5" fill="var(--text-soft)">' + (x.du ? x.pct + "%" : "—") + "</text>";
  }).join("");

  return '<svg viewBox="0 0 300 262" class="skill-radar" role="img" aria-label="Biểu đồ năng lực 7 chủ đề">' +
    luoi + truc +
    '<polygon points="' + vung + '" fill="var(--primary)" fill-opacity="0.22" stroke="var(--primary)" stroke-width="2" stroke-linejoin="round" />' +
    cham + nhan + "</svg>";
}

/* ---------------------------------------------------------------------------
 *  Khối "Hồ sơ năng lực" ở trang Thành tựu
 * ------------------------------------------------------------------------- */
function skillInjectRadar(oDich) {
  var dich = oDich || document.getElementById("skillHere");
  if (!dich || document.getElementById("skillBox")) return;
  var st = skillStats();
  var ico = function (n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; };

  var noiDung;
  if (!st.soChuDeCoDuLieu) {
    noiDung = '<p class="skill-empty">Hãy làm vài bài luyện tập, chỉ số của bạn sẽ hiện ở đây. ' +
      "Mỗi chủ đề cần ít nhất " + SKILL_NGUONG + " câu để có số liệu đáng tin.</p>";
  } else {
    var hang = st.bang.map(function (x) {
      return '<div class="skill-row">' +
        '<span class="skill-row-t">' + x.topic + "</span>" +
        '<span class="skill-row-n">' + esc(x.ten) + "</span>" +
        '<span class="skill-bar"><i style="width:' + (x.du ? x.pct : 0) + "%;background:" + x.muc.mau + '"></i></span>' +
        '<span class="skill-row-p">' + (x.du ? x.pct + "%" : "cần thêm " + (SKILL_NGUONG - x.tong) + " câu") + "</span>" +
        "</div>";
    }).join("");
    noiDung = '<div class="skill-wrap"><div class="skill-left">' + skillRadarSvg(st) + "</div>" +
      '<div class="skill-right">' + hang + "</div></div>";
  }

  var box = document.createElement("div");
  box.id = "skillBox";
  box.innerHTML = '<div class="section-title" style="margin-top:22px">' + ico("target", "#4f46e5", 18) +
    " Hồ sơ năng lực theo chủ đề</div>" +
    '<p class="skill-note">Tính trên <b>' + SKILL_GANNHAT + " câu gần nhất</b> của mỗi chủ đề, nên phản ánh trình độ hiện tại chứ không phải lúc mới bắt đầu." +
    (st.tongCau ? " Đã ghi nhận <b>" + st.tongCau + "</b> câu." : "") + "</p>" +
    '<div class="skill-card">' + noiDung + "</div>";
  dich.appendChild(box);
  if (typeof iconify === "function") iconify(box);
}

/* ---------------------------------------------------------------------------
 *  Thẻ "chỗ yếu" ở trang chủ
 * ------------------------------------------------------------------------- */
function skillRenderCard() {
  var el = document.getElementById("skillCard");
  if (!el) return;
  var st = skillStats();
  var y = st.yeuNhat;
  if (!y) { el.innerHTML = ""; return; }
  var ico = function (n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; };
  el.innerHTML =
    '<div class="skill-weak" id="skillWeakCard" role="button" tabindex="0">' +
      '<span class="skill-weak-ic">' + ico("target", "#ef4444", 22) + "</span>" +
      '<span class="skill-weak-txt"><b>Chỗ yếu của bạn: ' + esc(y.topic + ". " + y.ten) + "</b>" +
        "<small>Đang đúng " + y.pct + "% (" + y.dung + "/" + y.tong + " câu) · " + y.muc.ten + "</small></span>" +
      '<span class="btn btn-primary skill-weak-go">Luyện 10 câu</span>' +
    "</div>";
  var card = document.getElementById("skillWeakCard");
  card.onclick = function () { skillStartWeak(y.topic); };
  card.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); } };
}

/* ---------------------------------------------------------------------------
 *  Bộ câu ôn chỗ yếu: ưu tiên câu TỪNG SAI, rồi tới câu chưa từng làm
 * ------------------------------------------------------------------------- */
function skillWeakPool(topic) {
  if (typeof QUESTION_BANK === "undefined") return [];
  var st = skillStats();
  var o = st.bang.filter(function (x) { return x.topic === topic; })[0];
  var saiId = {};
  (o ? o.sai : []).forEach(function (id) { saiId[id] = 1; });

  var daLam = {};
  ((typeof State !== "undefined" && State.history) || []).forEach(function (h) {
    (h.detail || []).forEach(function (d) { daLam[d.id] = 1; });
  });

  var cungChuDe = QUESTION_BANK.filter(function (q) { return q.topic === topic; });
  return {
    tungSai: cungChuDe.filter(function (q) { return saiId[q.id]; }),
    chuaLam: cungChuDe.filter(function (q) { return !daLam[q.id]; }),
    daDung: cungChuDe.filter(function (q) { return daLam[q.id] && !saiId[q.id]; }),
  };
}

/* Trộn theo tỉ lệ: ~60% câu từng sai, còn lại câu chưa làm, thiếu thì bù câu cũ */
function skillPickWeak(topic, n) {
  var p = skillWeakPool(topic);
  var lay = function (ds, k) { return (typeof pick === "function" ? pick(ds, k) : ds.slice(0, k)); };
  var out = lay(p.tungSai, Math.min(p.tungSai.length, Math.ceil(n * 0.6)));
  if (out.length < n) out = out.concat(lay(p.chuaLam, n - out.length));
  if (out.length < n) out = out.concat(lay(p.daDung, n - out.length));
  return out.slice(0, n);
}

function skillStartWeak(topic, n) {
  var qs = skillPickWeak(topic, n || 10);
  if (!qs.length || typeof newQuiz !== "function") return;
  var ten = (typeof TOPICS !== "undefined" && TOPICS[topic]) || topic;
  State.quiz = newQuiz(qs, "practice", { title: "Luyện chỗ yếu: " + ten });
  if (typeof go === "function") go("quiz");
}

/* ---------------------------------------------------------------------------
 *  CSS
 * ------------------------------------------------------------------------- */
(function () {
  var css =
    ".skill-note{color:var(--text-soft);font-size:13.5px;margin:-4px 0 12px}" +
    ".skill-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow)}" +
    ".skill-empty{color:var(--text-soft);font-size:14px;margin:0}" +
    ".skill-wrap{display:flex;gap:22px;align-items:center;flex-wrap:wrap}" +
    ".skill-left{flex:0 0 300px;max-width:100%;margin:0 auto}" +
    ".skill-radar{width:100%;height:auto;display:block}" +
    ".skill-right{flex:1;min-width:240px;display:grid;gap:7px}" +
    ".skill-row{display:grid;grid-template-columns:20px 1fr 90px auto;align-items:center;gap:9px;font-size:13.5px}" +
    ".skill-row-t{font-weight:850;color:var(--primary-d)}" +
    ".skill-row-n{color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".skill-bar{height:8px;border-radius:99px;background:var(--bg-soft);border:1px solid var(--border);overflow:hidden}" +
    ".skill-bar i{display:block;height:100%;border-radius:99px;transition:width .5s ease}" +
    ".skill-row-p{color:var(--text-soft);font-size:12.5px;white-space:nowrap}" +
    "@media(max-width:560px){.skill-row{grid-template-columns:18px 1fr 60px auto;font-size:12.5px}}" +
    /* thẻ chỗ yếu ở trang chủ */
    ".skill-weak{display:flex;align-items:center;gap:13px;background:var(--danger-soft);border:1px solid var(--danger);" +
      "border-radius:var(--radius);padding:13px 16px;margin:0 0 18px;cursor:pointer}" +
    ".skill-weak-ic{display:flex;align-items:center;justify-content:center;width:42px;height:42px;flex:none;border-radius:12px;background:var(--bg-card)}" +
    ".skill-weak-txt{flex:1;min-width:0}" +
    ".skill-weak-txt b{display:block;font-size:15.5px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".skill-weak-txt small{color:var(--text-soft);font-size:12.5px}" +
    ".skill-weak-go{white-space:nowrap}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

if (typeof window !== "undefined") {
  window.skillStats = skillStats;
  window.skillInjectRadar = skillInjectRadar;
  window.skillRenderCard = skillRenderCard;
  window.skillPickWeak = skillPickWeak;
  window.skillStartWeak = skillStartWeak;
}
