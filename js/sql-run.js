/* ============================================================================
 *  THỰC HÀNH SQL TỰ CHẤM — chạy SQLite trong trình duyệt bằng sql.js (WASM).
 *  Song song với phần Python (Skulpt): học sinh gõ truy vấn, máy chạy trên CSDL
 *  mẫu rồi TỰ CHẤM bằng cách so tập kết quả với câu lời giải.
 *  Nạp sql.js (js/vendor/sql-wasm.js + .wasm) LƯỜI (chỉ khi bấm Chạy lần đầu).
 *  Nạp TRƯỚC app.js. injectSqlExercises(lesson) gọi trong renderLesson.
 * ==========================================================================*/
(function () {
  /* ---------------- CSS ---------------- */
  var css =
    ".sqx{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px}" +
    ".sqx + .sqx{margin-top:14px}" +
    ".sqx-prompt{font-size:15px;margin-bottom:10px;line-height:1.55}" +
    ".sqx-editor{width:100%;box-sizing:border-box;min-height:80px;border-radius:10px;border:1px solid var(--border);background:var(--bg-soft);color:var(--text);font-family:Consolas,'JetBrains Mono',monospace;font-size:14px;padding:10px 12px;resize:vertical}" +
    ".sqx-editor:focus{outline:none;border-color:var(--primary)}" +
    ".sqx-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}" +
    ".sqx-actions .btn{padding:8px 14px;font-size:13.5px}" +
    ".sqx-hint{margin-top:10px;padding:10px 14px;border-radius:8px;background:var(--warning-soft);border-left:4px solid var(--warning);font-size:14px}" +
    ".sqx-res{margin-top:10px}" +
    ".sqx-verdict{margin-top:10px;padding:12px 14px;border-radius:8px;font-size:14.5px}" +
    ".sqx-verdict.ok{background:var(--success-soft);border:1px solid var(--success)}" +
    ".sqx-verdict.no{background:var(--danger-soft);border:1px solid var(--danger)}" +
    ".sqx-verdict.err{background:var(--danger-soft);border:1px solid var(--danger);font-family:Consolas,monospace;font-size:13px}" +
    ".sqx-tblwrap{overflow-x:auto;border:1px solid var(--border);border-radius:8px}" +
    ".sqx-tbl{border-collapse:collapse;width:100%;font-size:13.5px}" +
    ".sqx-tbl th,.sqx-tbl td{border:1px solid var(--border);padding:5px 10px;text-align:left;white-space:nowrap}" +
    ".sqx-tbl th{background:var(--bg-soft);font-weight:700}" +
    ".sqx-data{margin:8px 0 14px}" +
    ".sqx-data summary{cursor:pointer;font-weight:700;font-size:14px;color:var(--primary)}" +
    ".sqx-data .sqx-tblwrap{margin-top:8px}" +
    ".sqx-cap{font-size:12.5px;color:var(--text-soft);margin:6px 0 3px;font-weight:650}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---------------- CSDL mẫu dùng chung (trường học) ---------------- */
  var LOP = [["L01", "11A1"], ["L02", "11A2"], ["L03", "11A3"]];
  var HS = [
    ["H1", "An", "L01", 9.0], ["H2", "Bình", "L02", 4.5], ["H3", "Cường", "L01", 8.0],
    ["H4", "Dung", "L03", 9.5], ["H5", "Hoa", "L02", 8.0], ["H6", "Khoa", "L01", 6.5],
    ["H7", "Lan", "L03", 5.0], ["H8", "Nam", "L02", 7.0],
  ];
  var q = function (v) { return typeof v === "number" ? v : "'" + String(v).replace(/'/g, "''") + "'"; };
  var SCHOOL_SCHEMA =
    "CREATE TABLE LOP(MaLop TEXT, TenLop TEXT);" +
    "CREATE TABLE HOCSINH(Ma TEXT, HoTen TEXT, MaLop TEXT, Diem REAL);" +
    "INSERT INTO LOP VALUES " + LOP.map(function (r) { return "(" + r.map(q).join(",") + ")"; }).join(",") + ";" +
    "INSERT INTO HOCSINH VALUES " + HS.map(function (r) { return "(" + r.map(q).join(",") + ")"; }).join(",") + ";";

  function tableHTML(cols, rows) {
    return '<div class="sqx-tblwrap"><table class="sqx-tbl"><thead><tr>' +
      cols.map(function (c) { return "<th>" + esc(String(c)) + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr>" + r.map(function (v) { return "<td>" + (v === null ? "∅" : esc(String(v))) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
  }
  /* Tính lười (khi render), vì esc/ICON nằm ở app.js/icons.js nạp SAU tệp này */
  function schoolPreview() {
    return '<details class="sqx-data"><summary>' + (typeof ICON === "function" ? ICON("layers", 15, "#0891b2") : "") + ' Xem cơ sở dữ liệu mẫu (bảng LOP, HOCSINH)</summary>' +
      '<div class="sqx-cap">Bảng LOP</div>' + tableHTML(["MaLop", "TenLop"], LOP) +
      '<div class="sqx-cap">Bảng HOCSINH</div>' + tableHTML(["Ma", "HoTen", "MaLop", "Diem"], HS) +
      "</details>";
  }

  /* ---------------- Bài tập SQL theo bài học ---------------- */
  var S = SCHOOL_SCHEMA;
  var SQL_EXERCISES = {
    "C11-09": [
      { prompt: "Lấy **họ tên và điểm** của các học sinh thuộc lớp có mã `L01`.", schema: S,
        starter: "SELECT ... FROM HOCSINH WHERE ...;", solution: "SELECT HoTen, Diem FROM HOCSINH WHERE MaLop='L01';",
        hint: "Dùng WHERE MaLop='L01', chọn hai cột HoTen và Diem." },
      { prompt: "Liệt kê **họ tên và điểm** của MỌI học sinh, sắp xếp theo **điểm giảm dần**.", schema: S, orderMatters: true,
        starter: "SELECT HoTen, Diem FROM HOCSINH ORDER BY ...;", solution: "SELECT HoTen, Diem FROM HOCSINH ORDER BY Diem DESC;",
        hint: "Giảm dần dùng ORDER BY Diem DESC." },
      { prompt: "Liệt kê **họ tên học sinh** kèm **TÊN LỚP** (không phải mã lớp), chỉ những em có **điểm ≥ 8**. Gợi ý: cần nối hai bảng.", schema: S,
        starter: "SELECT ... FROM HOCSINH JOIN LOP ON ... WHERE ...;",
        solution: "SELECT HOCSINH.HoTen, LOP.TenLop FROM HOCSINH JOIN LOP ON HOCSINH.MaLop=LOP.MaLop WHERE HOCSINH.Diem>=8;",
        hint: "JOIN LOP ON HOCSINH.MaLop=LOP.MaLop, rồi WHERE Diem>=8." },
    ],
    "C11-10": [
      { prompt: "**Thêm** một học sinh mới vào bảng HOCSINH: mã `H9`, tên `Minh`, lớp `L01`, điểm `7.5`.", schema: S,
        check: "SELECT HoTen, MaLop, Diem FROM HOCSINH WHERE Ma='H9';",
        starter: "INSERT INTO HOCSINH VALUES (...);", solution: "INSERT INTO HOCSINH VALUES ('H9','Minh','L01',7.5);",
        hint: "INSERT INTO HOCSINH VALUES ('H9','Minh','L01',7.5);" },
      { prompt: "**Cộng thêm 1 điểm** cho tất cả học sinh thuộc lớp `L02`.", schema: S,
        check: "SELECT Ma, Diem FROM HOCSINH ORDER BY Ma;",
        starter: "UPDATE HOCSINH SET ... WHERE ...;", solution: "UPDATE HOCSINH SET Diem=Diem+1 WHERE MaLop='L02';",
        hint: "SET Diem=Diem+1 WHERE MaLop='L02'." },
      { prompt: "**Xoá** khỏi bảng HOCSINH những học sinh có **điểm dưới 5**.", schema: S,
        check: "SELECT HoTen, Diem FROM HOCSINH ORDER BY Ma;",
        starter: "DELETE FROM HOCSINH WHERE ...;", solution: "DELETE FROM HOCSINH WHERE Diem<5;",
        hint: "DELETE FROM HOCSINH WHERE Diem<5; (chỉ Bình 4,5 bị xoá)." },
    ],
    "C11-27": [
      { prompt: "**Đếm** xem lớp `L01` có bao nhiêu học sinh.", schema: S,
        starter: "SELECT COUNT(*) FROM HOCSINH WHERE ...;", solution: "SELECT COUNT(*) FROM HOCSINH WHERE MaLop='L01';",
        hint: "Dùng hàm gộp COUNT(*) kèm WHERE MaLop='L01'." },
      { prompt: "Tính **điểm trung bình theo từng lớp**: hiển thị mã lớp và điểm trung bình.", schema: S,
        starter: "SELECT MaLop, AVG(Diem) FROM HOCSINH GROUP BY ...;", solution: "SELECT MaLop, AVG(Diem) FROM HOCSINH GROUP BY MaLop;",
        hint: "GROUP BY MaLop rồi dùng AVG(Diem)." },
      { prompt: "Liệt kê các **lớp có điểm trung bình ≥ 7** (mã lớp và điểm trung bình). Gợi ý: lọc trên nhóm.", schema: S,
        starter: "SELECT MaLop, AVG(Diem) FROM HOCSINH GROUP BY MaLop HAVING ...;",
        solution: "SELECT MaLop, AVG(Diem) FROM HOCSINH GROUP BY MaLop HAVING AVG(Diem)>=7;",
        hint: "Lọc sau khi gộp nhóm dùng HAVING AVG(Diem)>=7 (không phải WHERE)." },
    ],
  };

  /* ---------------- Nạp sql.js lười ---------------- */
  var _sqlPromise = null;
  function sqlReady() {
    if (_sqlPromise) return _sqlPromise;
    _sqlPromise = new Promise(function (resolve, reject) {
      var go = function () { initSqlJs({ locateFile: function (f) { return "js/vendor/" + f; } }).then(resolve, reject); };
      if (typeof initSqlJs !== "undefined") { go(); return; }
      var s = document.createElement("script");
      s.src = "js/vendor/sql-wasm.js";
      s.onload = go;
      s.onerror = function () { reject(new Error("Không nạp được js/vendor/sql-wasm.js")); };
      (document.head || document.documentElement).appendChild(s);
    });
    return _sqlPromise;
  }

  /* Chạy: schema -> main; nếu có check thì chạy tiếp check. Trả về kết quả của
     câu SELECT cuối cùng (hoặc của check). Ném lỗi nếu SQL sai. */
  function runSeq(SQLmod, schema, main, check) {
    var db = new SQLmod.Database();
    try {
      db.run(schema);
      var out;
      if (check) { db.run(main); out = db.exec(check); }
      else { out = db.exec(main); }
      var last = out && out.length ? out[out.length - 1] : { columns: [], values: [] };
      return { columns: last.columns || [], rows: last.values || [] };
    } finally { db.close(); }
  }

  function sameResult(a, b, orderMatters) {
    var norm = function (res) {
      return res.rows.map(function (row) { return row.map(function (v) { return v === null ? " " : String(v); }).join(""); });
    };
    var ra = norm(a), rb = norm(b);
    if (ra.length !== rb.length) return false;
    if (!orderMatters) { ra = ra.slice().sort(); rb = rb.slice().sort(); }
    return JSON.stringify(ra) === JSON.stringify(rb);
  }

  /* ---------------- Hiển thị ---------------- */
  function exHTML(ex, i) {
    return '<div class="sqx" data-i="' + i + '">' +
      '<div class="ex-head" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap"><span style="font-weight:800;color:var(--primary);font-size:14px">Bài ' + (i + 1) + '</span><span class="pill type-tf">SQL</span></div>' +
      '<div class="sqx-prompt">' + fmtInline(ex.prompt) + "</div>" +
      schoolPreview() +
      '<textarea class="sqx-editor" spellcheck="false">' + esc(ex.starter || "") + "</textarea>" +
      '<div class="sqx-actions">' +
        (ex.hint ? '<button class="btn btn-ghost sqx-hint-btn">' + (typeof ICON === "function" ? ICON("bulb", 14, "#d97706") : "") + " Gợi ý</button>" : "") +
        (ex.solution ? '<button class="btn btn-ghost sqx-sol-btn">' + (typeof ICON === "function" ? ICON("eye", 14) : "") + " Đáp án mẫu</button>" : "") +
        '<button class="btn btn-primary sqx-run">' + (typeof ICON === "function" ? ICON("play", 14) : "") + " Chạy &amp; Kiểm tra</button>" +
      "</div>" +
      (ex.hint ? '<div class="sqx-hint" hidden>' + (typeof ICON === "function" ? ICON("bulb", 14, "#d97706") : "") + " " + esc(ex.hint) + "</div>" : "") +
      '<div class="sqx-res"></div><div class="sqx-verdict" hidden></div>' +
      "</div>";
  }

  function bindEx(node, ex) {
    var ta = node.querySelector(".sqx-editor");
    var res = node.querySelector(".sqx-res");
    var verdict = node.querySelector(".sqx-verdict");
    var runBtn = node.querySelector(".sqx-run");
    var hintBtn = node.querySelector(".sqx-hint-btn");
    if (hintBtn) hintBtn.onclick = function () { var h = node.querySelector(".sqx-hint"); h.hidden = !h.hidden; };
    var solBtn = node.querySelector(".sqx-sol-btn");
    if (solBtn) solBtn.onclick = function () { ta.value = ex.solution; res.innerHTML = ""; verdict.hidden = true; };
    runBtn.onclick = function () {
      verdict.hidden = true; res.innerHTML = "";
      runBtn.disabled = true;
      var restore = function () { runBtn.disabled = false; };
      verdict.hidden = false; verdict.className = "sqx-verdict"; verdict.textContent = "Đang khởi động SQLite…";
      sqlReady().then(function (SQLmod) {
        var actual, err = null;
        try { actual = runSeq(SQLmod, ex.schema, ta.value, ex.check); }
        catch (e) { err = String(e && e.message ? e.message : e); }
        if (err) {
          verdict.className = "sqx-verdict err";
          verdict.textContent = "❌ Lỗi SQL: " + err;
          restore(); return;
        }
        var expected = runSeq(SQLmod, ex.schema, ex.solution, ex.check);
        var showRes = ex.check ? runSeq(SQLmod, ex.schema, ta.value, ex.check) : actual;
        res.innerHTML = (ex.check ? '<div class="sqx-cap">Bảng sau khi chạy:</div>' : '<div class="sqx-cap">Kết quả truy vấn của bạn:</div>') +
          (showRes.rows.length ? tableHTML(showRes.columns, showRes.rows) : '<div class="sqx-cap">(không có dòng nào)</div>');
        var ok = sameResult(actual, expected, ex.orderMatters);
        if (ok && typeof Gam !== "undefined" && Gam.onExercisePass) Gam.onExercisePass({ prompt: ex.prompt });
        verdict.className = "sqx-verdict " + (ok ? "ok" : "no");
        verdict.innerHTML = ok
          ? (typeof ICON === "function" ? ICON("check2", 15, "#16a34a") : "") + " <b>Chính xác!</b> Truy vấn cho đúng kết quả mong đợi."
          : (typeof ICON === "function" ? ICON("x", 15, "#dc2626") : "") + " <b>Chưa đúng.</b> Kết quả chưa khớp đáp án. Xem lại điều kiện lọc/nối bảng rồi thử lại nhé.";
        restore();
      }, function (e) {
        verdict.className = "sqx-verdict err";
        verdict.textContent = "❌ Không nạp được SQLite: " + (e && e.message ? e.message : e);
        restore();
      });
    };
  }

  function injectSqlExercises(lesson) {
    var list = SQL_EXERCISES[lesson.id];
    if (!list || !list.length) return;
    var anchor = document.querySelector(".ls-actions");
    if (!anchor || !anchor.parentNode) return;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="section-title" style="margin-top:24px">' + (typeof ICON === "function" ? ICON("layers", 17, "#0891b2") : "") + " Thực hành SQL (máy chạy &amp; tự chấm)</div>" +
      '<p style="color:var(--text-soft);font-size:13.5px;margin-bottom:12px">Gõ câu lệnh SQL rồi bấm “Chạy &amp; Kiểm tra” — máy chạy trên cơ sở dữ liệu mẫu ngay trong trình duyệt và tự chấm kết quả.</p>' +
      '<div class="sqx-host"></div>';
    anchor.parentNode.insertBefore(wrap, anchor);
    var host = wrap.querySelector(".sqx-host");
    host.innerHTML = list.map(exHTML).join("");
    var nodes = host.querySelectorAll(".sqx");
    list.forEach(function (ex, i) { bindEx(nodes[i], ex); });
  }

  if (typeof window !== "undefined") {
    window.SQL_EXERCISES = SQL_EXERCISES;
    window.injectSqlExercises = injectSqlExercises;
  }
})();
