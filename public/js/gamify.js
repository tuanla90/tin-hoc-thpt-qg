/* ============================================================================
 *  GAMIFICATION — tạo động lực cho người tự học.
 *  XP + Cấp độ/Danh hiệu · Chuỗi ngày học 🔥 · Huy hiệu thành tựu ·
 *  Bảng điều khiển ở trang chủ · Hiệu ứng "+XP" và pháo giấy khi lên cấp/mở huy hiệu.
 *  Tự chứa: lưu riêng localStorage ("tinhoc_gam_v1"); đọc State/LESSONS lúc chạy.
 *  Nạp TRƯỚC app.js. app.js gọi các hook Gam.onXxx() (đã bọc typeof).
 * ==========================================================================*/
(function () {
  var css =
    "#gamDash{margin:0 0 18px}" +
    ".gam-card{display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:linear-gradient(135deg,var(--primary-soft),var(--bg-card));border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow)}" +
    ".gam-lvl{display:flex;align-items:center;gap:12px;min-width:190px}" +
    ".gam-ring{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;background:var(--bg-card);border:3px solid var(--primary);flex:none}" +
    ".gam-lvl-txt b{display:block;font-size:15px;color:var(--text)}" +
    ".gam-lvl-txt small{color:var(--text-soft);font-size:12.5px}" +
    ".gam-xp{flex:1;min-width:180px}" +
    ".gam-xp-bar{height:12px;border-radius:99px;background:var(--bg-soft);overflow:hidden;border:1px solid var(--border)}" +
    ".gam-xp-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--info));border-radius:99px;transition:width .6s ease}" +
    ".gam-xp-txt{display:flex;justify-content:space-between;font-size:12px;color:var(--text-soft);margin-top:4px}" +
    ".gam-chips{display:flex;gap:10px;flex-wrap:wrap}" +
    ".gam-chip{display:flex;align-items:center;gap:6px;background:var(--bg-card);border:1px solid var(--border);border-radius:99px;padding:7px 13px;font-size:13.5px;font-weight:600;color:var(--text);cursor:pointer}" +

    /* Bản GỌN chỉ cho bảng ở trang chủ (#gamDash). Trang Thành tựu dùng lại đúng
       các lớp trên với cỡ lớn — có cả trang cho nó, không cần bóp. Đừng sửa các
       luật trên để làm gọn trang chủ: làm thế là bóp luôn trang Thành tựu. */
    "#gamDash .gam-card{gap:8px;padding:10px 12px}" +
    /* Chip cấp bo 14px chứ không 99px như chip tròn khác: nó cao gấp đôi vì có
       vạch tiến độ bên trong, bo 99px thì hai đầu phình thành hình viên thuốc. */
    "#gamDash .gam-chip-cap{border-radius:14px;padding:6px 12px 8px 6px;gap:4px 9px;flex-wrap:wrap;flex:1 1 auto;min-width:230px;max-width:340px}" +
    ".gam-ngan{display:none}" +
    "#gamDash .gam-ring{width:34px;height:34px;border-width:2px}" +
    "#gamDash .gam-ring .ic{width:19px;height:19px}" +
    "#gamDash .gam-cap-txt{flex:1;min-width:0;display:block;line-height:1.15}" +
    "#gamDash .gam-cap-txt b{font-size:13.5px;color:var(--text)}" +
    "#gamDash .gam-cap-txt small{color:var(--text-soft);font-size:11.5px;margin-left:5px}" +
    "#gamDash .gam-cap-xp{flex:none;font-size:11px;font-weight:800;color:var(--primary-d);font-family:var(--font-mono)}" +
    /* flex 1 1 100%: thanh XP luôn tự xuống một dòng riêng và chiếm hết bề ngang
       chip cấp, kể cả phần dưới vòng tròn cấp và dưới số XP. */
    "#gamDash .gam-xp-bar{display:block;height:5px;margin:0;flex:1 1 100%}" +
    "#gamDash .gam-xp-fill{display:block}" +
    "#gamDash .gam-chip{font-size:13px}" +
    /* Chip XP hôm nay khi CHƯA đạt là một nút hành động, không phải chỉ số — viền
       và chữ theo màu chính để phân biệt với hai chip chỉ để xem. */
    "#gamDash .gam-chip-lam{border-color:var(--primary);color:var(--primary-d)}" +
    "#gamDash .gam-chip-lam:hover{background:var(--primary-soft)}" +
    "#gamDash .gam-chip-lam:focus-visible{outline:3px solid var(--primary);outline-offset:2px}" +

    /* Dưới 900px cho chip cấp chiếm trọn một hàng, nhường CẢ hàng dưới cho ba chip
       chuỗi / XP hôm nay / huy hiệu. Nếu để chip cấp đứng cùng hàng thì nó ăn tới
       340px, ba chip còn khoảng 360px trong khi cần ~460px -> rớt xuống hai hàng
       (đo ở 778px đúng ra hai hàng). Chip cấp chiếm trọn hàng cũng chính là thứ
       làm thanh XP full width. */
    "@media (max-width:900px){#gamDash .gam-chip-cap{flex:1 1 100%;max-width:none;min-width:0}}" +

    /* Dưới 560px thì ngay cả một hàng riêng cũng không đủ cho chữ đầy đủ (mỗi chip
       còn ~100px), nên đổi sang bản chữ rút. */
    "@media (max-width:560px){" +
      "#gamDash .gam-chip:not(.gam-chip-cap){flex:1 1 0;min-width:0;justify-content:center;padding:7px 6px;gap:4px}" +
      "#gamDash .gam-nhan{display:none}" +
      "#gamDash .gam-ngan{display:inline}" +
    "}" +
    ".gam-chip:hover{border-color:var(--primary)}" +
    ".gam-chip b{color:var(--primary-d)}" +
    /* +XP float */
    ".gam-xpfloat{position:fixed;left:50%;top:74px;transform:translateX(-50%);z-index:1200;background:var(--primary);color:#fff;font-weight:800;padding:8px 16px;border-radius:99px;box-shadow:var(--shadow-lg);font-size:15px;pointer-events:none;animation:gamFloat 1.5s ease forwards}" +
    "@keyframes gamFloat{0%{opacity:0;transform:translate(-50%,10px) scale(.8)}18%{opacity:1;transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-26px) scale(1)}}" +
    /* celebrate modal */
    ".gam-cele{position:fixed;inset:0;z-index:1300;display:flex;align-items:center;justify-content:center;background:rgba(10,15,30,.55);padding:20px}" +
    ".gam-cele[hidden]{display:none}" +
    ".gam-cele-box{background:var(--bg-card);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow-lg);padding:26px 28px;max-width:340px;width:100%;text-align:center;animation:gamPop .4s ease}" +
    "@keyframes gamPop{0%{transform:scale(.7);opacity:0}100%{transform:scale(1);opacity:1}}" +
    ".gam-cele-icon{font-size:64px;line-height:1;margin-bottom:6px;animation:gamBounce 1s ease infinite alternate}" +
    "@keyframes gamBounce{from{transform:translateY(0)}to{transform:translateY(-9px)}}" +
    ".gam-cele-box h3{margin:6px 0 4px;font-size:20px}" +
    ".gam-cele-box p{color:var(--text-soft);font-size:14.5px;margin-bottom:16px}" +
    ".gam-cele-box .gam-cele-name{color:var(--primary-d);font-weight:800}" +
    ".gam-confetti{position:fixed;top:-12px;width:10px;height:14px;z-index:1290;pointer-events:none;border-radius:2px}" +
    "@keyframes gamFall{to{transform:translateY(105vh) rotate(720deg);opacity:.9}}" +
    /* achievements page */
    ".gam-ach-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:18px}" +
    ".gam-badge-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}" +
    ".gam-badge{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px;text-align:center}" +
    ".gam-badge.locked{opacity:.5;filter:grayscale(1)}" +
    ".gam-badge-ic{font-size:38px;line-height:1;margin-bottom:6px}" +
    ".gam-badge-img{width:96px;height:96px;object-fit:contain;display:block;margin:0 auto -4px}" +
    ".gam-badge b{display:block;font-size:14px;margin-bottom:3px}" +
    ".gam-badge small{color:var(--text-soft);font-size:12px;line-height:1.4;display:block}" +
    ".gam-badge .gam-badge-got{margin-top:7px;font-size:11.5px;color:var(--success);font-weight:700}" +
    ".gam-cat-head{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;color:var(--text);margin:20px 0 10px}" +
    ".gam-cat-head span{font-size:12px;font-weight:600;color:var(--text-soft);background:var(--bg-soft);border:1px solid var(--border);border-radius:99px;padding:2px 10px}" +
    ".gam-cele-rare .gam-cele-box{border:2px solid #f59e0b;box-shadow:0 0 0 5px rgba(245,158,11,.22),var(--shadow-lg)}" +
    ".gam-cele-rare .gam-cele-box h3{color:#d97706}" +
    ".gam-chip-done{border-color:var(--success)}.gam-chip-done b{color:var(--success)}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

/* --- Lưu trữ riêng --- */
var GAM_KEY = window.GAM_KEY || "tinhoc_gam_v1";   /* theo hồ sơ đang dùng, xem js/session.js */
function gamLoad() {
  /* lastActive = ngày gần nhất có hoạt động (mọi ngày)
     lastSession = ngày gần nhất học ĐÚNG BUỔI theo lịch -> dùng để tính chuỗi */
  var def = { xp: 0, lastActive: null, lastSession: null, streak: 0, bestStreak: 0, correct: 0, exDone: [], vocab: [], badges: [], dayDate: null, dayXp: 0, goalDate: null };
  try {
    var o = JSON.parse(localStorage.getItem(GAM_KEY));
    if (o && typeof o === "object") {
      for (var k in def) if (!(k in o)) o[k] = def[k];
      // Bản cũ chỉ có lastActive: coi buổi học gần nhất chính là ngày đó, để
      // người đang có chuỗi dở không bị mất khi chuyển sang tính theo lịch học.
      if (!o.lastSession && o.lastActive) o.lastSession = o.lastActive;
      return o;
    }
  } catch (e) {}
  return def;
}
var GAM = gamLoad();
function gamSave() { try { localStorage.setItem(GAM_KEY, JSON.stringify(GAM)); } catch (e) {} }

/* --- Cấp độ / danh hiệu --- */
var GAM_LEVELS = [
  { min: 0,    name: "Tân binh Tin học", icon: "🌱", ic: "sprout", color: "#16a34a" },
  { min: 120,  name: "Học viên chăm chỉ", icon: "📗", ic: "book", color: "#3b82f6" },
  { min: 300,  name: "Lập trình viên nhí", icon: "💡", ic: "bulb", color: "#f59e0b" },
  { min: 550,  name: "Thợ săn thuật toán", icon: "⚙️", ic: "gear", color: "#0891b2" },
  { min: 900,  name: "Cao thủ dữ liệu", icon: "🚀", ic: "rocket", color: "#7c3aed" },
  { min: 1400, name: "Bậc thầy Tin học", icon: "🏆", ic: "trophy", color: "#eab308" },
  { min: 2100, name: "Huyền thoại", icon: "👑", ic: "crown", color: "#f59e0b" },
];
function gamLevel(xp) {
  var i = 0;
  for (var k = 0; k < GAM_LEVELS.length; k++) if (xp >= GAM_LEVELS[k].min) i = k;
  var cur = GAM_LEVELS[i], next = GAM_LEVELS[i + 1] || null;
  var prog = next ? Math.min(1, (xp - cur.min) / (next.min - cur.min)) : 1;
  return { lvl: i + 1, name: cur.name, icon: cur.icon, ic: cur.ic, color: cur.color, min: cur.min, nextMin: next ? next.min : null, progress: prog };
}

/* --- Thống kê (đọc từ State/LESSONS + GAM) --- */
function gamStats() {
  var lessons = 0, totalLessons = 0, exams = 0, bestExam = 0, quizzes = 0, perfect10 = 0;
  var g = { 10: { d: 0, t: 0 }, 11: { d: 0, t: 0 }, 12: { d: 0, t: 0 } };
  try {
    if (typeof LESSONS !== "undefined") {
      totalLessons = LESSONS.length;
      var learnedSet = {};
      if (typeof State !== "undefined" && State.learned) State.learned.forEach(function (id) { learnedSet[id] = 1; });
      LESSONS.forEach(function (l) {
        if (learnedSet[l.id]) lessons++;
        if (g[l.stage]) { g[l.stage].t++; if (learnedSet[l.id]) g[l.stage].d++; }
      });
    }
    if (typeof State !== "undefined" && State.history) {
      quizzes = State.history.length;
      State.history.forEach(function (h) {
        if (h.mode === "exam") { exams++; if (h.score > bestExam) bestExam = h.score; if (h.score >= 10) perfect10++; }
      });
    }
  } catch (e) {}
  var gradeDone = function (o) { return o.t > 0 && o.d >= o.t; };
  return {
    xp: GAM.xp, lessons: lessons, totalLessons: totalLessons, correct: GAM.correct,
    exams: exams, bestExam: bestExam, perfect10: perfect10, quizzes: quizzes, streak: gamStreakSong(), bestStreak: GAM.bestStreak,
    exDone: GAM.exDone.length, vocab: GAM.vocab.length, badges: GAM.badges.length,
    tin10Done: gradeDone(g[10]), tin11Done: gradeDone(g[11]), tin12Done: gradeDone(g[12]),
    lvl: gamLevel(GAM.xp).lvl,
  };
}

/* --- Huy hiệu (theo 6 nhóm: lesson/vocab/practice/exam/streak/level) --- */
var GAM_BADGES = [
  /* 📖 Học tập */
  { id: "first_lesson", cat: "lesson", ic: "👣", name: "Bước đầu tiên", desc: "Học xong bài học đầu tiên", chk: function (s) { return s.lessons >= 1; } },
  { id: "lessons_5", cat: "lesson", ic: "🌱", name: "Khởi động", desc: "Học xong 5 bài", chk: function (s) { return s.lessons >= 5; } },
  { id: "lessons_10", cat: "lesson", ic: "📚", name: "Ham học", desc: "Học xong 10 bài", chk: function (s) { return s.lessons >= 10; } },
  { id: "lessons_25", cat: "lesson", ic: "✏️", name: "Chăm chỉ", desc: "Học xong 25 bài", chk: function (s) { return s.lessons >= 25; } },
  { id: "lessons_50", cat: "lesson", ic: "📔", name: "Nửa chặng đường", desc: "Học xong 50 bài", chk: function (s) { return s.lessons >= 50; } },
  { id: "lessons_75", cat: "lesson", ic: "🏁", name: "Sắp về đích", desc: "Học xong 75 bài", chk: function (s) { return s.lessons >= 75; } },
  { id: "lessons_all", cat: "lesson", rare: true, ic: "🎓", name: "Mọt sách", desc: "Học xong TẤT CẢ bài", chk: function (s) { return s.totalLessons > 0 && s.lessons >= s.totalLessons; } },
  { id: "tin10_done", cat: "lesson", rare: true, ic: "📗", name: "Chinh phục lớp 10", desc: "Học hết chương trình Tin 10", chk: function (s) { return s.tin10Done; } },
  { id: "tin11_done", cat: "lesson", rare: true, ic: "📘", name: "Chinh phục lớp 11", desc: "Học hết chương trình Tin 11", chk: function (s) { return s.tin11Done; } },
  { id: "tin12_done", cat: "lesson", rare: true, ic: "📙", name: "Chinh phục lớp 12", desc: "Học hết chương trình Tin 12", chk: function (s) { return s.tin12Done; } },
  /* 📕 Từ vựng */
  { id: "vocab_10", cat: "vocab", ic: "🔤", name: "Chào từ mới", desc: "Thuộc 10 từ vựng", chk: function (s) { return s.vocab >= 10; } },
  { id: "vocab_25", cat: "vocab", ic: "📕", name: "Vốn từ vựng", desc: "Thuộc 25 từ vựng", chk: function (s) { return s.vocab >= 25; } },
  { id: "vocab_50", cat: "vocab", ic: "🗂️", name: "Kho từ", desc: "Thuộc 50 từ vựng", chk: function (s) { return s.vocab >= 50; } },
  { id: "vocab_100", cat: "vocab", ic: "📖", name: "Từ điển sống", desc: "Thuộc 100 từ vựng", chk: function (s) { return s.vocab >= 100; } },
  { id: "vocab_200", cat: "vocab", rare: true, ic: "🧠", name: "Bậc thầy từ vựng", desc: "Thuộc 200 từ vựng", chk: function (s) { return s.vocab >= 200; } },
  /* 🎯 Luyện tập */
  { id: "correct_10", cat: "practice", ic: "✅", name: "Phát súng đầu", desc: "Trả lời đúng 10 câu", chk: function (s) { return s.correct >= 10; } },
  { id: "correct_50", cat: "practice", ic: "🎯", name: "Xạ thủ", desc: "Trả lời đúng 50 câu", chk: function (s) { return s.correct >= 50; } },
  { id: "correct_100", cat: "practice", ic: "🏹", name: "Thiện xạ", desc: "Trả lời đúng 100 câu", chk: function (s) { return s.correct >= 100; } },
  { id: "correct_200", cat: "practice", ic: "🎖️", name: "Bách phát bách trúng", desc: "Trả lời đúng 200 câu", chk: function (s) { return s.correct >= 200; } },
  { id: "correct_500", cat: "practice", rare: true, ic: "🏆", name: "Vua luyện đề", desc: "Trả lời đúng 500 câu", chk: function (s) { return s.correct >= 500; } },
  { id: "code_1", cat: "practice", ic: "⌨️", name: "Dòng code đầu tiên", desc: "Làm đúng 1 bài tập code", chk: function (s) { return s.exDone >= 1; } },
  { id: "code_5", cat: "practice", ic: "🧑‍💻", name: "Tập viết code", desc: "Làm đúng 5 bài tập code", chk: function (s) { return s.exDone >= 5; } },
  { id: "code_10", cat: "practice", ic: "💻", name: "Lập trình viên", desc: "Làm đúng 10 bài tập code", chk: function (s) { return s.exDone >= 10; } },
  { id: "code_25", cat: "practice", ic: "🖥️", name: "Cao thủ code", desc: "Làm đúng 25 bài tập code", chk: function (s) { return s.exDone >= 25; } },
  { id: "code_50", cat: "practice", rare: true, ic: "🛠️", name: "Kiến trúc sư code", desc: "Làm đúng 50 bài tập code", chk: function (s) { return s.exDone >= 50; } },
  /* 📝 Thi thử — 2 nhánh 5 mốc: số lượt thi và điểm số */
  { id: "exam_first", cat: "exam", ic: "📝", name: "Thử sức", desc: "Hoàn thành 1 bài thi thử", chk: function (s) { return s.exams >= 1; } },
  { id: "exam_5", cat: "exam", ic: "📄", name: "Quen trận", desc: "Hoàn thành 5 bài thi thử", chk: function (s) { return s.exams >= 5; } },
  { id: "exam_10", cat: "exam", ic: "🗄️", name: "Dày dạn", desc: "Hoàn thành 10 bài thi thử", chk: function (s) { return s.exams >= 10; } },
  { id: "exam_25", cat: "exam", ic: "📚", name: "Luyện đề bền bỉ", desc: "Hoàn thành 25 bài thi thử", chk: function (s) { return s.exams >= 25; } },
  { id: "exam_50", cat: "exam", rare: true, ic: "🗂️", name: "Chiến binh phòng thi", desc: "Hoàn thành 50 bài thi thử", chk: function (s) { return s.exams >= 50; } },
  { id: "exam_pass7", cat: "exam", ic: "🔓", name: "Vượt ngưỡng", desc: "Thi thử đạt từ 7 điểm", chk: function (s) { return s.bestExam >= 7; } },
  { id: "exam_pass8", cat: "exam", ic: "⭐", name: "Học sinh giỏi", desc: "Thi thử đạt từ 8 điểm", chk: function (s) { return s.bestExam >= 8; } },
  { id: "exam_pass9", cat: "exam", ic: "🌟", name: "Xuất sắc", desc: "Thi thử đạt từ 9 điểm", chk: function (s) { return s.bestExam >= 9; } },
  { id: "exam_perfect", cat: "exam", rare: true, ic: "💯", name: "Điểm tuyệt đối", desc: "Thi thử đạt 10 điểm", chk: function (s) { return s.bestExam >= 10; } },
  { id: "exam_perfect_3", cat: "exam", rare: true, ic: "🎇", name: "Không phải may mắn", desc: "Đạt 10 điểm ở 3 bài thi thử", chk: function (s) { return s.perfect10 >= 3; } },
  /* 🔥 Chăm chỉ */
  { id: "streak_3", cat: "streak", ic: "📅", name: "Đều đặn", desc: "3 buổi học liên tiếp theo lịch", chk: function (s) { return s.bestStreak >= 3; } },
  { id: "streak_7", cat: "streak", ic: "🔥", name: "Kiên trì", desc: "7 buổi học liên tiếp theo lịch", chk: function (s) { return s.bestStreak >= 7; } },
  { id: "streak_14", cat: "streak", ic: "🗓️", name: "Hai tuần liền", desc: "14 buổi liên tiếp — hai tuần đều đặn", chk: function (s) { return s.bestStreak >= 14; } },
  { id: "streak_30", cat: "streak", rare: true, ic: "🏅", name: "Cả tháng không nghỉ", desc: "30 buổi liên tiếp — không bỏ buổi nào", chk: function (s) { return s.bestStreak >= 30; } },
  { id: "streak_60", cat: "streak", rare: true, ic: "🌋", name: "Hai tháng bền bỉ", desc: "60 buổi liên tiếp — cả một mùa ôn thi", chk: function (s) { return s.bestStreak >= 60; } },
  /* ⭐ Cấp độ */
  { id: "level_3", cat: "level", ic: "⚡", name: "Vào guồng", desc: "Đạt cấp độ 3", chk: function (s) { return s.lvl >= 3; } },
  { id: "level_5", cat: "level", ic: "🚀", name: "Lên hạng", desc: "Đạt cấp độ 5", chk: function (s) { return s.lvl >= 5; } },
  { id: "level_7", cat: "level", rare: true, ic: "👑", name: "Huyền thoại", desc: "Đạt cấp độ tối đa (7)", chk: function (s) { return s.lvl >= 7; } },
  { id: "xp_1000", cat: "level", ic: "💎", name: "Nghìn XP", desc: "Tích lũy 1000 XP", chk: function (s) { return s.xp >= 1000; } },
  { id: "xp_3000", cat: "level", rare: true, ic: "☄️", name: "Vượt trần", desc: "Tích lũy 3000 XP — quá cả mốc cấp tối đa", chk: function (s) { return s.xp >= 3000; } },
];
var GAM_BADGE_CATS = [
  { key: "lesson", label: "Học tập", ic: "cap", color: "#3b82f6" },
  { key: "vocab", label: "Từ vựng", ic: "book", color: "#ec4899" },
  { key: "practice", label: "Luyện tập", ic: "target", color: "#ef4444" },
  { key: "exam", label: "Thi thử", ic: "exam", color: "#6366f1" },
  { key: "streak", label: "Chăm chỉ", ic: "flame", color: "#f97316" },
  { key: "level", label: "Cấp độ", ic: "star", color: "#eab308" },
];

/* --- Hàng đợi hiệu ứng chúc mừng (tránh chồng nhau) --- */
var gamCeleQueue = [];
var gamCeleShowing = false;
function gamEnqueueCele(item) { gamCeleQueue.push(item); if (!gamCeleShowing) gamShowNextCele(); }
function gamShowNextCele() {
  if (!gamCeleQueue.length) { gamCeleShowing = false; return; }
  gamCeleShowing = true;
  var it = gamCeleQueue.shift();
  /* Đặt tiếng reo mừng ở ĐÂY, chỗ duy nhất mọi hộp chúc mừng đi qua (lên cấp,
     đạt mục tiêu ngày, mở huy hiệu). Hàng đợi đã giãn các hộp ra nên mở một lúc
     ba huy hiệu cũng không thành một mớ tiếng chồng lên nhau. */
  if (window.Am) Am.chucMung();
  var ov = document.createElement("div");
  ov.className = "gam-cele" + (it.rare ? " gam-cele-rare" : "");
  ov.innerHTML =
    '<div class="gam-cele-box">' +
      '<div class="gam-cele-icon">' + it.icon + "</div>" +
      "<h3>" + it.title + "</h3>" +
      '<p>' + it.body + "</p>" +
      '<button class="btn btn-primary" style="width:100%">Tuyệt vời! 🎉</button>' +
    "</div>";
  document.body.appendChild(ov);
  gamConfetti(it.rare);
  function close() { ov.remove(); setTimeout(gamShowNextCele, 250); }
  ov.querySelector("button").onclick = close;
  ov.onclick = function (e) { if (e.target === ov) close(); };
}
function gamConfetti(big) {
  var colors = big
    ? ["#f59e0b", "#fbbf24", "#facc15", "#eab308", "#fde68a", "#fff7cc"]
    : ["#4f46e5", "#16a34a", "#d97706", "#dc2626", "#0891b2", "#7c83ff"];
  var count = big ? 64 : 34;
  for (var i = 0; i < count; i++) {
    (function (i) {
      var c = document.createElement("div");
      c.className = "gam-confetti";
      c.style.left = (5 + (i * 2.7) % 90) + "%";
      c.style.background = colors[i % colors.length];
      var dur = 1.6 + (i % 5) * 0.25;
      c.style.animation = "gamFall " + dur + "s linear forwards";
      c.style.opacity = "0.9";
      document.body.appendChild(c);
      setTimeout(function () { c.remove(); }, dur * 1000 + 200);
    })(i);
  }
}
function gamXpFloat(txt) {
  var el = document.createElement("div");
  el.className = "gam-xpfloat";
  el.textContent = txt;
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, 1600);
}

/* --- Cộng XP (kèm kiểm tra lên cấp + mục tiêu ngày) --- */
var GAM_DAILY_GOAL = 80;
function gamDailyXp() {
  return (GAM.dayDate === gamDayStr(new Date())) ? (GAM.dayXp || 0) : 0;
}
function gamAward(xp, silent) {
  if (!xp) return;
  var before = gamLevel(GAM.xp).lvl;
  GAM.xp += xp;
  // Mục tiêu XP hằng ngày
  var today = gamDayStr(new Date());
  if (GAM.dayDate !== today) { GAM.dayDate = today; GAM.dayXp = 0; }
  GAM.dayXp += xp;
  var after = gamLevel(GAM.xp);
  gamSave();
  if (!silent) gamXpFloat("+" + xp + " XP");
  if (after.lvl > before) {
    gamEnqueueCele({ icon: (typeof ICON === "function" ? ICON(after.ic, 58, after.color) : after.icon), title: "Lên cấp " + after.lvl + "!", body: 'Bạn đã trở thành <span class="gam-cele-name">' + after.name + "</span>" });
  }
  if (GAM.dayXp >= GAM_DAILY_GOAL && GAM.goalDate !== today) {
    GAM.goalDate = today; gamSave();
    gamEnqueueCele({ icon: (typeof ICON === "function" ? ICON("target", 56, "#ef4444") : "🎯"), title: "Đạt mục tiêu hôm nay!", body: "Bạn đã kiếm <b>" + GAM_DAILY_GOAL + " XP</b> trong ngày. Giữ phong độ nhé!" });
  }
  gamRefreshDash();
}

/* --- Chuỗi buổi học (đếm theo LỊCH HỌC đã đăng kí, giống app tập gym) --------
   Người học chọn các thứ trong tuần mình định học (hồ sơ -> "Lịch học trong
   tuần"). Chuỗi chỉ tính trên những buổi đó:
     - Học đúng buổi theo lịch  -> chuỗi +1.
     - Bỏ lỡ một buổi theo lịch -> chuỗi đứt.
     - Ngày KHÔNG có lịch: học thêm được thưởng XP nhưng không tính vào chuỗi,
       và nghỉ cũng không làm đứt chuỗi.
   Chưa chọn ngày nào = học mọi ngày (giữ nguyên hành vi cũ). */
function gamDayStr(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

/* Lịch học lấy từ hồ sơ: mảng thứ (0 = Chủ nhật … 6 = Thứ Bảy). */
function gamLichHoc() {
  var p = (typeof State !== "undefined" && State.profile) || {};
  var d = p.days;
  return (Array.isArray(d) && d.length) ? d.map(Number) : null;   // null = mọi ngày
}
function gamLaBuoiHoc(d) {
  var lich = gamLichHoc();
  return !lich || lich.indexOf(d.getDay()) >= 0;
}
/* Buổi theo lịch gần nhất TRƯỚC ngày d (tìm ngược tối đa 14 ngày). */
function gamBuoiTruoc(d) {
  for (var i = 1; i <= 14; i++) {
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
    if (gamLaBuoiHoc(t)) return t;
  }
  return null;
}

/* Chuỗi còn hiệu lực: đứt khi đã bỏ lỡ một buổi VÀ hết luôn hạn bù.
   - Hôm nay dù chưa học vẫn chưa tính là bỏ lỡ — còn cả ngày để học.
   - Buổi của HÔM QUA bị lỡ thì hôm nay học bù vẫn kịp (hạn bù 1 ngày). */
function gamStreakSong() {
  if (!GAM.streak || !GAM.lastSession) return 0;
  var hnay = new Date();
  var truoc = gamBuoiTruoc(hnay);
  if (!truoc) return GAM.streak;
  if (GAM.lastSession === gamDayStr(hnay) || GAM.lastSession === gamDayStr(truoc)) return GAM.streak;

  /* Buổi gần nhất chưa học: chỉ còn cứu được khi buổi đó rơi vào HÔM QUA và
     mọi buổi TRƯỚC nó đều đã học (hạn bù che đúng một buổi, không che hai). */
  var homQua = new Date(hnay.getFullYear(), hnay.getMonth(), hnay.getDate() - 1);
  if (gamDayStr(truoc) !== gamDayStr(homQua)) return 0;
  var truocNua = gamBuoiTruoc(truoc);
  return truocNua && GAM.lastSession === gamDayStr(truocNua) ? GAM.streak : 0;
}

/* Nhãn hiển thị: có đăng kí lịch thì đếm "buổi", chưa đăng kí thì vẫn là "ngày". */
var GAM_TEN_THU = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
var GAM_THU_NGAN = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
function gamDonViChuoi() { return gamLichHoc() ? "buổi" : "ngày"; }
function gamMoTaLich() {
  var lich = gamLichHoc();
  if (!lich) return "Chưa đặt lịch — tính chuỗi theo mọi ngày";
  var ds = lich.slice().sort(function (a, b) { return ((a + 6) % 7) - ((b + 6) % 7); })
    .map(function (d) { return GAM_THU_NGAN[d]; });
  return "Lịch học: " + ds.join(", ") + " (" + ds.length + " buổi/tuần)";
}

function gamTouchStreak() {
  var now = new Date();
  var today = gamDayStr(now);
  if (GAM.lastActive === today) return;      // hôm nay đã ghi nhận rồi
  GAM.lastActive = today;

  /* Hôm nay ghi nhận được những buổi nào?
     - Buổi của HÔM QUA nếu hôm qua có lịch mà chưa học -> HỌC BÙ (hạn 1 ngày).
     - Buổi của hôm nay nếu hôm nay có lịch.
     Học bù xếp trước để chuỗi nối đúng thứ tự thời gian. */
  var homQua = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  var ghiNhan = [];
  if (gamLaBuoiHoc(homQua) && GAM.lastSession !== gamDayStr(homQua)) ghiNhan.push({ ngay: homQua, bu: true });
  if (gamLaBuoiHoc(now)) ghiNhan.push({ ngay: now, bu: false });

  if (!ghiNhan.length) {                     // ngày không có lịch, cũng không phải bù
    gamSave();
    gamAward(10);                            // học thêm ngoài lịch vẫn được thưởng
    gamXpFloat("💪 Học thêm ngoài lịch!");
    return;
  }

  var coBu = false;
  ghiNhan.forEach(function (b) {
    var truoc = gamBuoiTruoc(b.ngay);
    var noiTiep = truoc && GAM.lastSession === gamDayStr(truoc);
    GAM.streak = noiTiep ? (GAM.streak || 0) + 1 : 1;
    GAM.lastSession = gamDayStr(b.ngay);
    if (b.bu) coBu = true;
    if (GAM.streak > (GAM.bestStreak || 0)) GAM.bestStreak = GAM.streak;
    gamAward(10);                            // thưởng cho từng buổi được ghi nhận
  });
  gamSave();
  if (coBu) gamXpFloat("⏱️ Đã học bù buổi hôm qua!");
  else if (GAM.streak >= 2) gamXpFloat("🔥 Chuỗi " + GAM.streak + " buổi!");
}

/* --- Ảnh huy hiệu ---------------------------------------------------------
   Nhóm "Học tập" đã có tranh linh vật riêng cho từng huy hiệu; các nhóm còn
   lại vẫn dùng emoji cho tới khi có tranh. Ảnh hỏng thì tự quay về emoji. */
var GAM_BADGE_ANH = ["first_lesson", "lessons_5", "lessons_10", "lessons_25", "lessons_50",
  "lessons_75", "lessons_all", "tin10_done", "tin11_done", "tin12_done"];
function gamBadgeIc(b) {
  if (GAM_BADGE_ANH.indexOf(b.id) < 0) return b.ic;
  return '<img class="gam-badge-img" src="asset/mascot/badges/' + b.id + '.png" alt="" ' +
    "onerror=\"this.outerHTML='" + b.ic + "'\">";
}

/* --- Kiểm tra & mở huy hiệu mới --- */
function gamCheckBadges() {
  var s = gamStats();
  GAM_BADGES.forEach(function (b) {
    if (GAM.badges.indexOf(b.id) < 0 && b.chk(s)) {
      GAM.badges.push(b.id);
      gamSave();
      gamEnqueueCele({ icon: b.ic, rare: !!b.rare, title: b.rare ? "🌟 HUY HIỆU HIẾM!" : "Mở khoá huy hiệu!", body: '<span class="gam-cele-name">' + b.name + "</span><br>" + b.desc });
    }
  });
  gamRefreshDash();
}

/* --- Vẽ lại bảng điều khiển nếu đang ở trang chủ --- */
function gamRefreshDash() {
  var m = document.getElementById("gamDash");
  if (m) Gam.renderDashboard(m);   // renderDashboard tự chấm nhiệm vụ tuần
}

/* ==========================================================================
 *  CÁC HOOK (app.js / exercises.js / vocab.js gọi vào)
 * ========================================================================*/
/* Icon có màu (fallback emoji nếu icons.js chưa nạp) */
function gIco(name, color, emoji, size) {
  return (typeof ICON === "function") ? ICON(name, size || 16, color) : emoji;
}
function gRingIcon(lv) {
  return (typeof ICON === "function") ? ICON(lv.ic, 28, lv.color) : lv.icon;
}

var Gam = {
  onLessonDone: function () { gamTouchStreak(); gamAward(25); gamCheckBadges(); },
  onQuizDone: function (record) {
    gamTouchStreak();
    var correct = (record && record.correctCount) || 0;
    GAM.correct += correct; gamSave();
    if (record && record.mode === "exam") gamAward(20 + Math.round(record.score) * 5);
    else gamAward(5 + correct * 2);
    gamCheckBadges();
  },
  /* baiId (tuỳ chọn) là MÃ BÀI HỌC chứa bài tập này. Trước đây chữ ký chỉ gồm đề
     bài, nên đếm được TỔNG số bài đã làm nhưng không biết bài nào thuộc bài học
     nào — không tính được số sao cho từng bài học. Nay ghi thêm mã bài vào chữ ký.
     Bản ghi CŨ (không có mã bài) vẫn nằm nguyên trong exDone và vẫn được đếm vào
     tổng, chỉ là không quy được về bài học nào; xem Gam.soBaiTapXong(). Cố ý KHÔNG
     xoá hay chuyển đổi chúng: không có cách nào biết một đề bài cũ thuộc bài nào
     mà không đoán, mà đoán sai thì học sinh mất thành tích đã có. */
  onExercisePass: function (ex, baiId) {
    if (window.Am) Am.dung();               // code chạy đúng cũng đáng một tiếng khen
    var de = (ex && (ex.prompt || ex.expected)) || Math.random();
    var sig = "ex:" + (baiId ? baiId + ":" : "") + de;
    /* Đã làm đúng ở bản ghi kiểu CŨ thì cũng coi như xong, đừng cộng XP lần hai. */
    if (GAM.exDone.indexOf(sig) >= 0 || GAM.exDone.indexOf("ex:" + de) >= 0) return;
    GAM.exDone.push(sig); gamSave();
    gamTouchStreak(); gamAward(15); gamCheckBadges();
  },
  /* Làm đúng một widget KHÔNG thuộc kho bài thực hành nào: widget "Ôn tập tương
     tác" của concept-lab (74 cái) và các widget của trang Xưởng đồ hoạ. Vẫn cộng
     XP và giữ chuỗi ngày — vì học sinh có làm bài thật — nhưng KHÔNG ghi vào
     exDone. Trước đây chúng cũng gọi onExercisePass nên vào TỬ SỐ của "số bài thực
     hành đã làm", mà mẫu số chỉ đếm các kho bài tập, nên làm hết widget ôn tập là
     con số vượt cả tổng số bài tập. */
  onWidgetDung: function () {
    if (window.Am) Am.dung();
    gamTouchStreak(); gamAward(8); gamCheckBadges();
  },
  /* Số bài tập đã làm đúng TRONG một bài học. Chỉ đếm được từ bản ghi có mã bài. */
  soBaiTapXong: function (baiId) {
    if (!baiId) return 0;
    var tien = "ex:" + baiId + ":";
    return GAM.exDone.filter(function (s) { return String(s).indexOf(tien) === 0; }).length;
  },
  onVocabMastered: function (word) {
    if (!word) return;
    if (GAM.vocab.indexOf(word) >= 0) return;
    GAM.vocab.push(word); gamSave();
    gamAward(3, true); gamCheckBadges();
    return true;
  },
  isVocabMastered: function (word) { return GAM.vocab.indexOf(word) >= 0; },

  /* --- Bảng điều khiển ở trang chủ --- */
  renderDashboard: function (mount) {
    if (!mount) return;
    /* Chấm nhiệm vụ tuần ở ĐÂY chứ không ở gamRefreshDash: trang chủ gọi thẳng
       renderDashboard (app.js), còn gamRefreshDash thì thoát sớm khi không có
       #gamDash — mà XP luôn được cộng từ màn hình khác (bài học, kết quả, bài
       tập). Đặt nhầm chỗ là nhiệm vụ hiện ✓ mà không bao giờ được thưởng. */
    if (window.NhiemVu) NhiemVu.kiemTra();
    var s = gamStats(), lv = gamLevel(s.xp);
    var pct = Math.round(lv.progress * 100);
    var xpTxt = lv.nextMin != null ? (s.xp + " / " + lv.nextMin + " XP") : (s.xp + " XP · tối đa");
    /* MỘT hàng chip: cấp, XP, chuỗi ngày, XP hôm nay, huy hiệu. Trước đây xếp
       dọc ba khối (cấp / thanh XP / hàng chip) chiếm 352px ở trang chủ — cao nhất
       trang, đẩy hết phần chọn việc học xuống dưới.
       Thanh tiến độ cấp không bỏ, chỉ thu thành vạch mảnh nằm dưới chip cấp: nó
       là thứ cho biết còn bao nhiêu XP nữa lên cấp, mất hẳn thì XP thành con số
       trơ không biết để làm gì. */
    var coLich = gamLaBuoiHoc(new Date()) && GAM.lastSession !== gamDayStr(new Date());
    var xong = gamDailyXp() >= GAM_DAILY_GOAL;
    /* Chữ để trong hai span đối nhau: .gam-nhan là bản đủ (màn rộng), .gam-ngan là
       bản rút (màn hẹp) — CSS bật một cái tắt một cái. Ở 375px mỗi chip chỉ được
       khoảng 97px, để nguyên "0 ngày · hôm nay có lịch" là ba chip không thể nào
       nằm cùng hàng. Rút chữ chứ không bỏ chip nào, và title vẫn giữ câu đầy đủ.
       Thanh XP là con TRỰC TIẾP của chip (không nằm trong .gam-cap-txt) để
       flex-wrap đẩy được nó xuống một dòng riêng chiếm hết bề ngang chip. */
    mount.innerHTML =
      '<div class="gam-card">' +
        '<div class="gam-chip gam-chip-cap" id="gamChipCap" title="' + esc(xpTxt) + '">' +
          '<span class="gam-ring">' + gRingIcon(lv) + "</span>" +
          '<span class="gam-cap-txt"><b>Cấp ' + lv.lvl + "</b><small>" + esc(lv.name) + "</small></span>" +
          '<span class="gam-cap-xp">' + esc(xpTxt) + "</span>" +
          '<span class="gam-xp-bar"><span class="gam-xp-fill" style="width:' + pct + '%"></span></span>' +
        "</div>" +
        '<div class="gam-chip" id="gamChipStreak" title="' + esc(gamMoTaLich()) + '">' + gIco("flame", "#f97316", "🔥") +
          "<b>" + s.streak + "</b>" +
          '<span class="gam-nhan"> ' + gamDonViChuoi() + (coLich ? " · có lịch" : "") + "</span>" +
          (coLich ? '<span class="gam-ngan"> · có lịch</span>' : "") +
        "</div>" +
        '<div class="gam-chip' + (xong ? " gam-chip-done" : " gam-chip-lam") + '" id="gamChipHomNay"' +
          (xong ? ' title="Đã đạt mục tiêu XP hôm nay"' : ' role="button" tabindex="0" title="Bấm để luyện nhanh 10 câu, kiếm XP cho đủ mục tiêu hôm nay"') + ">" + gIco("target", "#ef4444", "🎯") +
          '<span class="gam-nhan">Hôm nay </span><b>' + Math.min(gamDailyXp(), GAM_DAILY_GOAL) + "/" + GAM_DAILY_GOAL + "</b>" +
          '<span class="gam-nhan"> XP</span>' + (xong ? " ✓" : "") +
        "</div>" +
        '<div class="gam-chip" id="gamChipBadge" title="Huy hiệu đã mở">' + gIco("medal", "#f59e0b", "🏅") +
          "<b>" + s.badges + "/" + GAM_BADGES.length + "</b>" +
          '<span class="gam-nhan"> huy hiệu</span>' +
        "</div>" +
      "</div>" +
      (window.NhiemVu ? NhiemVu.html() : "");
    /* Ba chip đi BA chỗ khác nhau. Trước đây chuỗi và huy hiệu cùng sang Thành tựu
       còn chip XP hôm nay không bấm được gì.
         huy hiệu  -> Thành tựu (lưới huy hiệu nằm ở đó)
         chuỗi     -> Hồ sơ (chỗ đặt lịch học, mà lịch mới là thứ quyết định chuỗi)
         XP hôm nay-> LÀM chứ không xem: chạy luôn Luyện nhanh 10 câu để kiếm XP.
       Chọn hành động cho chip XP vì Kết quả / Thành tựu / Hồ sơ đều đã có trên menu
       trên rồi — trỏ chip sang đó nữa thì chẳng thêm đường đi nào mới. */
    var di = function (v) { return function () { if (typeof go === "function") go(v); }; };
    var cb = mount.querySelector("#gamChipBadge"); if (cb) cb.onclick = di("achievements");
    var cs = mount.querySelector("#gamChipStreak"); if (cs) cs.onclick = di("profile");
    /* Đạt mục tiêu rồi thì chip chỉ còn là trạng thái, KHÔNG gắn hành động: bấm
       vào lại mở bài làm mới và ăn thêm quota ngày của gói Miễn phí. */
    var ch = mount.querySelector("#gamChipHomNay");
    if (ch && !xong) {
      var lam = function () { if (typeof startQuick === "function") startQuick(); };
      ch.onclick = lam;
      ch.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lam(); } };
    }
  },

  /* --- Trang Thành tựu --- */
  renderAchievements: function () {
    var app = document.getElementById("app");
    if (!app) return;
    var s = gamStats(), lv = gamLevel(s.xp);
    var pct = Math.round(lv.progress * 100);
    var xpTxt = lv.nextMin != null ? (s.xp + " / " + lv.nextMin + " XP") : (s.xp + " XP · đã tối đa");
    var groups = GAM_BADGE_CATS.map(function (c) {
      var list = GAM_BADGES.filter(function (b) { return b.cat === c.key; });
      var got = list.filter(function (b) { return GAM.badges.indexOf(b.id) >= 0; }).length;
      var cells = list.map(function (b) {
        var g = GAM.badges.indexOf(b.id) >= 0;
        return '<div class="gam-badge' + (g ? "" : " locked") + '">' +
          '<div class="gam-badge-ic">' + gamBadgeIc(b) + "</div>" +
          "<b>" + esc(b.name) + "</b><small>" + esc(b.desc) + "</small>" +
          (g ? '<div class="gam-badge-got">✓ Đã đạt</div>' : "") +
          "</div>";
      }).join("");
      return '<div class="gam-cat-head">' + gIco(c.ic, c.color, "", 18) + c.label + " <span>" + got + "/" + list.length + "</span></div>" +
        '<div class="gam-badge-grid">' + cells + "</div>";
    }).join("");
    app.innerHTML =
      '<button class="back-link" id="gamBack">← Trang chủ</button>' +
      '<h2 class="gam-ach-title" style="margin-bottom:12px">' + gIco("trophy", "#eab308", "🏆", 24) + "Thành tựu của bạn</h2>" +
      '<div class="gam-card gam-ach-head">' +
        '<div class="gam-lvl"><div class="gam-ring">' + gRingIcon(lv) + '</div><div class="gam-lvl-txt"><b>Cấp ' + lv.lvl + " · " + esc(lv.name) + "</b><small>" + s.xp + " XP</small></div></div>" +
        '<div class="gam-xp"><div class="gam-xp-bar"><div class="gam-xp-fill" style="width:' + pct + '%"></div></div><div class="gam-xp-txt"><span>Tiến độ cấp</span><span>' + xpTxt + "</span></div></div>" +
      "</div>" +
      '<div class="gam-chips" style="margin-bottom:16px">' +
        '<div class="gam-chip">' + gIco("flame", "#f97316", "🔥") + "Chuỗi hiện tại: <b>" + s.streak + "</b> " + gamDonViChuoi() + "</div>" +
        '<div class="gam-chip">' + gIco("flame", "#d97706", "📈") + "Kỷ lục chuỗi: <b>" + s.bestStreak + "</b> " + gamDonViChuoi() + "</div>" +
        '<div class="gam-chip">' + gIco("clock", "#0891b2", "🗓️") + esc(gamMoTaLich()) + "</div>" +
        '<div class="gam-chip">' + gIco("book", "#3b82f6", "📖") + "Bài đã học: <b>" + s.lessons + "/" + s.totalLessons + "</b></div>" +
        '<div class="gam-chip">' + gIco("target", "#ef4444", "🎯") + "Câu đúng: <b>" + s.correct + "</b></div>" +
        '<div class="gam-chip">' + gIco("book", "#ec4899", "📕") + "Từ đã thuộc: <b>" + s.vocab + "</b></div>" +
      "</div>" +
      '<div class="section-title">' + gIco("medal", "#f59e0b", "🏅", 18) + "Huy hiệu (" + s.badges + "/" + GAM_BADGES.length + ")</div>" +
      groups;
    var back = document.getElementById("gamBack");
    if (back) back.onclick = function () { if (typeof go === "function") go("home"); };
  },
};

window.Gam = Gam;
