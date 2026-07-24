/* ============================================================================
 *  THỰC HÀNH SQL TỰ CHẤM + SÂN CHƠI SQL — chạy SQLite trong trình duyệt bằng
 *  sql.js (WASM). Song song với phần Python (Skulpt): học sinh gõ truy vấn,
 *  máy chạy trên CSDL mẫu rồi TỰ CHẤM bằng cách so tập kết quả với câu lời giải.
 *  Nạp sql.js (js/vendor/sql-wasm.js + .wasm) LƯỜI (chỉ khi bấm Chạy lần đầu).
 *  Nạp TRƯỚC app.js.
 *    injectSqlExercises(lesson)  -> chèn bài tập SQL vào trang bài học
 *    renderSqlLab()              -> trang "Sân chơi SQL" (route sqlLab)
 * ==========================================================================*/
(function () {
  /* ---------------- CSS ---------------- */
  var css =
    ".sqx{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px}" +
    ".sqx + .sqx{margin-top:14px}" +
    ".sqx-prompt{font-size:15px;margin-bottom:10px;line-height:1.55}" +
    ".sqx-editor{width:100%;box-sizing:border-box;min-height:78px;border-radius:10px;border:1px solid var(--border);background:var(--bg-soft);color:var(--text);font-family:Consolas,'JetBrains Mono',monospace;font-size:14px;padding:10px 12px;resize:vertical}" +
    ".sqx-editor:focus{outline:none;border-color:var(--primary)}" +
    ".sqx-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}" +
    ".sqx-actions .btn{padding:8px 14px;font-size:13.5px}" +
    ".sqx-hint{margin-top:10px;padding:10px 14px;border-radius:8px;background:var(--warning-soft);border-left:4px solid var(--warning);font-size:14px}" +
    ".sqx-res{margin-top:10px}" +
    ".sqx-verdict{margin-top:10px;padding:12px 14px;border-radius:8px;font-size:14.5px}" +
    ".sqx-verdict.ok{background:var(--success-soft);border:1px solid var(--success)}" +
    ".sqx-verdict.no{background:var(--danger-soft);border:1px solid var(--danger)}" +
    ".sqx-verdict.err{background:var(--danger-soft);border:1px solid var(--danger);font-family:Consolas,monospace;font-size:13px;white-space:pre-wrap}" +
    ".sqx-tblwrap{overflow-x:auto;border:1px solid var(--border);border-radius:8px}" +
    ".sqx-tbl{border-collapse:collapse;width:100%;font-size:13.5px}" +
    ".sqx-tbl th,.sqx-tbl td{border:1px solid var(--border);padding:5px 10px;text-align:left;white-space:nowrap}" +
    ".sqx-tbl th{background:var(--bg-soft);font-weight:700}" +
    ".sqx-data{margin:8px 0 14px}" +
    ".sqx-data summary{cursor:pointer;font-weight:700;font-size:14px;color:var(--primary)}" +
    ".sqx-data .sqx-tblwrap{margin-top:8px}" +
    ".sqx-cap{font-size:12.5px;color:var(--text-soft);margin:8px 0 3px;font-weight:650}" +
    ".sqx-schema{font-size:12.5px;color:var(--text-soft);margin:2px 0 10px;line-height:1.7}" +
    ".sqx-chip{display:inline-block;margin:0 6px 6px 0;padding:6px 11px;border:1px solid var(--border);border-radius:999px;background:var(--bg-soft);color:var(--text);font-size:12.5px;font-family:Consolas,monospace;cursor:pointer}" +
    ".sqx-chip:hover{border-color:var(--primary);color:var(--primary)}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---------------- CSDL mẫu dùng chung (quản lí điểm trường học) ----------------
     Quan hệ: LOP 1—∞ HOCSINH 1—∞ KETQUA ∞—1 MONHOC (KETQUA nối học sinh × môn). */
  var LOP = [["L01", "11A1"], ["L02", "11A2"], ["L03", "11A3"]];
  var HOCSINH = [ // MaHS, HoTen, MaLop, DiemTB (điểm trung bình cả năm)
    ["H1", "An", "L01", 9.0], ["H2", "Bình", "L02", 4.5], ["H3", "Cường", "L01", 8.0],
    ["H4", "Dung", "L03", 9.5], ["H5", "Hoa", "L02", 8.0], ["H6", "Khoa", "L01", 6.5],
    ["H7", "Lan", "L03", 5.0], ["H8", "Nam", "L02", 7.0],
  ];
  var MONHOC = [["M1", "Toán"], ["M2", "Ngữ văn"], ["M3", "Tin học"], ["M4", "Tiếng Anh"]];
  var KETQUA = [ // MaHS, MaMon, Diem (điểm một môn)
    ["H1", "M1", 9], ["H1", "M2", 8], ["H1", "M3", 10], ["H1", "M4", 7],
    ["H2", "M1", 4], ["H2", "M2", 5], ["H2", "M3", 6],
    ["H3", "M1", 8], ["H3", "M3", 9], ["H3", "M4", 7],
    ["H4", "M1", 10], ["H4", "M2", 9], ["H4", "M3", 9], ["H4", "M4", 10],
    ["H5", "M2", 8], ["H5", "M3", 8], ["H5", "M4", 8],
    ["H6", "M1", 6], ["H6", "M3", 7],
    ["H7", "M2", 5], ["H7", "M4", 5],
    ["H8", "M1", 7], ["H8", "M3", 8], ["H8", "M4", 6],
  ];
  var q = function (v) { return typeof v === "number" ? v : "'" + String(v).replace(/'/g, "''") + "'"; };
  var vals = function (rows) { return rows.map(function (r) { return "(" + r.map(q).join(",") + ")"; }).join(","); };
  var SCHOOL_SCHEMA =
    "CREATE TABLE LOP(MaLop TEXT, TenLop TEXT);" +
    "CREATE TABLE HOCSINH(MaHS TEXT, HoTen TEXT, MaLop TEXT, DiemTB REAL);" +
    "CREATE TABLE MONHOC(MaMon TEXT, TenMon TEXT);" +
    "CREATE TABLE KETQUA(MaHS TEXT, MaMon TEXT, Diem REAL);" +
    "INSERT INTO LOP VALUES " + vals(LOP) + ";" +
    "INSERT INTO HOCSINH VALUES " + vals(HOCSINH) + ";" +
    "INSERT INTO MONHOC VALUES " + vals(MONHOC) + ";" +
    "INSERT INTO KETQUA VALUES " + vals(KETQUA) + ";";

  function tableHTML(cols, rows) {
    return '<div class="sqx-tblwrap"><table class="sqx-tbl"><thead><tr>' +
      cols.map(function (c) { return "<th>" + esc(String(c)) + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr>" + r.map(function (v) { return "<td>" + (v === null ? "∅" : esc(String(v))) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
  }
  var SCHEMA_TEXT =
    "<b>LOP</b>(MaLop, TenLop) · <b>HOCSINH</b>(MaHS, HoTen, MaLop, DiemTB) · " +
    "<b>MONHOC</b>(MaMon, TenMon) · <b>KETQUA</b>(MaHS, MaMon, Diem)<br>" +
    "Liên kết: HOCSINH.MaLop → LOP.MaLop; KETQUA.MaHS → HOCSINH.MaHS; KETQUA.MaMon → MONHOC.MaMon. " +
    "<i>DiemTB</i> = điểm trung bình cả năm; <i>Diem</i> trong KETQUA = điểm từng môn.";
  /* Tính lười (khi render) vì esc/ICON ở app.js/icons.js nạp SAU tệp này */
  function dataPreview(open) {
    return '<details class="sqx-data"' + (open ? " open" : "") + '><summary>' + (typeof ICON === "function" ? ICON("layers", 15, "#0891b2") : "") + ' Cơ sở dữ liệu mẫu (4 bảng)</summary>' +
      '<div class="sqx-schema">' + SCHEMA_TEXT + "</div>" +
      '<div class="sqx-cap">LOP</div>' + tableHTML(["MaLop", "TenLop"], LOP) +
      '<div class="sqx-cap">HOCSINH</div>' + tableHTML(["MaHS", "HoTen", "MaLop", "DiemTB"], HOCSINH) +
      '<div class="sqx-cap">MONHOC</div>' + tableHTML(["MaMon", "TenMon"], MONHOC) +
      '<div class="sqx-cap">KETQUA</div>' + tableHTML(["MaHS", "MaMon", "Diem"], KETQUA) +
      "</details>";
  }

  /* ---------------- Bài tập SQL theo bài học ---------------- */
  var S = SCHOOL_SCHEMA;
  var SQL_EXERCISES = {
    // ---- KHMT: SELECT / WHERE / ORDER BY / JOIN ----
    "C11-09": [
      { prompt: "Lấy **họ tên và điểm trung bình** của các học sinh thuộc lớp có mã `L01`.", schema: S,
        starter: "SELECT ... FROM HOCSINH WHERE ...;", solution: "SELECT HoTen, DiemTB FROM HOCSINH WHERE MaLop='L01';",
        hint: "Dùng WHERE MaLop='L01', chọn hai cột HoTen và DiemTB." },
      { prompt: "Liệt kê **họ tên và điểm trung bình** của MỌI học sinh, sắp xếp theo **điểm giảm dần**.", schema: S, orderMatters: true,
        starter: "SELECT HoTen, DiemTB FROM HOCSINH ORDER BY ...;", solution: "SELECT HoTen, DiemTB FROM HOCSINH ORDER BY DiemTB DESC;",
        hint: "Giảm dần dùng ORDER BY DiemTB DESC." },
      { prompt: "Liệt kê **họ tên học sinh** kèm **TÊN LỚP** (không phải mã lớp), chỉ những em có **điểm trung bình ≥ 8**. Cần nối hai bảng.", schema: S,
        starter: "SELECT ... FROM HOCSINH JOIN LOP ON ... WHERE ...;",
        solution: "SELECT HOCSINH.HoTen, LOP.TenLop FROM HOCSINH JOIN LOP ON HOCSINH.MaLop=LOP.MaLop WHERE HOCSINH.DiemTB>=8;",
        hint: "JOIN LOP ON HOCSINH.MaLop=LOP.MaLop, rồi WHERE DiemTB>=8." },
    ],
    // ---- KHMT: INSERT / UPDATE / DELETE ----
    "C11-10": [
      { prompt: "**Thêm** một học sinh mới vào bảng HOCSINH: mã `H9`, tên `Minh`, lớp `L01`, điểm trung bình `7.5`.", schema: S,
        check: "SELECT HoTen, MaLop, DiemTB FROM HOCSINH WHERE MaHS='H9';",
        starter: "INSERT INTO HOCSINH VALUES (...);", solution: "INSERT INTO HOCSINH VALUES ('H9','Minh','L01',7.5);",
        hint: "INSERT INTO HOCSINH VALUES ('H9','Minh','L01',7.5); — đủ 4 giá trị đúng thứ tự cột." },
      { prompt: "**Cộng thêm 1 điểm** vào điểm trung bình cho tất cả học sinh thuộc lớp `L02`.", schema: S,
        check: "SELECT MaHS, DiemTB FROM HOCSINH ORDER BY MaHS;",
        starter: "UPDATE HOCSINH SET ... WHERE ...;", solution: "UPDATE HOCSINH SET DiemTB=DiemTB+1 WHERE MaLop='L02';",
        hint: "SET DiemTB=DiemTB+1 WHERE MaLop='L02'." },
      { prompt: "**Xoá** khỏi bảng HOCSINH những học sinh có **điểm trung bình dưới 5**.", schema: S,
        check: "SELECT HoTen, DiemTB FROM HOCSINH ORDER BY MaHS;",
        starter: "DELETE FROM HOCSINH WHERE ...;", solution: "DELETE FROM HOCSINH WHERE DiemTB<5;",
        hint: "DELETE FROM HOCSINH WHERE DiemTB<5; (chỉ Bình 4,5 bị xoá)." },
    ],
    // ---- KHMT: hàm gộp COUNT / AVG / MAX / GROUP BY / HAVING ----
    "C11-27": [
      { prompt: "**Đếm** xem lớp `L01` có bao nhiêu học sinh.", schema: S,
        starter: "SELECT COUNT(*) FROM HOCSINH WHERE ...;", solution: "SELECT COUNT(*) FROM HOCSINH WHERE MaLop='L01';",
        hint: "Dùng hàm gộp COUNT(*) kèm WHERE MaLop='L01'." },
      { prompt: "Tính **điểm trung bình theo từng lớp**: hiển thị mã lớp và điểm trung bình của lớp đó.", schema: S,
        starter: "SELECT MaLop, AVG(DiemTB) FROM HOCSINH GROUP BY ...;", solution: "SELECT MaLop, AVG(DiemTB) FROM HOCSINH GROUP BY MaLop;",
        hint: "GROUP BY MaLop rồi dùng AVG(DiemTB)." },
      { prompt: "Liệt kê các **lớp có điểm trung bình ≥ 7** (mã lớp và điểm trung bình). Lọc trên nhóm.", schema: S,
        starter: "SELECT MaLop, AVG(DiemTB) FROM HOCSINH GROUP BY MaLop HAVING ...;",
        solution: "SELECT MaLop, AVG(DiemTB) FROM HOCSINH GROUP BY MaLop HAVING AVG(DiemTB)>=7;",
        hint: "Lọc sau khi gộp nhóm dùng HAVING AVG(DiemTB)>=7 (không phải WHERE)." },
      { prompt: "Tìm **điểm cao nhất** của môn có mã `M1` (Toán) trong bảng KETQUA.", schema: S,
        starter: "SELECT MAX(Diem) FROM KETQUA WHERE ...;", solution: "SELECT MAX(Diem) FROM KETQUA WHERE MaMon='M1';",
        hint: "Dùng hàm gộp MAX(Diem) kèm WHERE MaMon='M1'." },
    ],
    // ---- ICT: khoá ngoài & liên kết bảng (thực hành bằng SQL) ----
    "U11-04": [
      { prompt: "Nhờ **khoá ngoài** MaLop, hãy nối HOCSINH với LOP để liệt kê **họ tên kèm tên lớp** của mọi học sinh.", schema: S,
        starter: "SELECT HOCSINH.HoTen, LOP.TenLop FROM HOCSINH JOIN LOP ON ...;",
        solution: "SELECT HOCSINH.HoTen, LOP.TenLop FROM HOCSINH JOIN LOP ON HOCSINH.MaLop=LOP.MaLop;",
        hint: "ON HOCSINH.MaLop = LOP.MaLop — nối khoá ngoài với khoá chính." },
      { prompt: "Liệt kê **họ tên** các học sinh thuộc lớp có TÊN là `11A2` (dùng liên kết bảng, không dùng mã lớp trực tiếp).", schema: S,
        starter: "SELECT HOCSINH.HoTen FROM HOCSINH JOIN LOP ON ... WHERE LOP.TenLop=...;",
        solution: "SELECT HOCSINH.HoTen FROM HOCSINH JOIN LOP ON HOCSINH.MaLop=LOP.MaLop WHERE LOP.TenLop='11A2';",
        hint: "Nối hai bảng rồi WHERE LOP.TenLop='11A2'." },
      { prompt: "Dùng **ba bảng** (HOCSINH, KETQUA, MONHOC) liệt kê **họ tên và điểm** môn `Tin học` của từng học sinh.", schema: S,
        starter: "SELECT HOCSINH.HoTen, KETQUA.Diem FROM HOCSINH JOIN KETQUA ON ... JOIN MONHOC ON ... WHERE MONHOC.TenMon='Tin học';",
        solution: "SELECT HOCSINH.HoTen, KETQUA.Diem FROM HOCSINH JOIN KETQUA ON HOCSINH.MaHS=KETQUA.MaHS JOIN MONHOC ON KETQUA.MaMon=MONHOC.MaMon WHERE MONHOC.TenMon='Tin học';",
        hint: "Nối HOCSINH–KETQUA qua MaHS, rồi KETQUA–MONHOC qua MaMon; WHERE TenMon='Tin học'." },
    ],
    // ---- ICT: truy vấn qua liên kết nhiều bảng ----
    "U11-07": [
      { prompt: "Nối **ba bảng** để hiển thị **họ tên học sinh, tên môn và điểm** cho mọi kết quả trong bảng KETQUA.", schema: S,
        starter: "SELECT HOCSINH.HoTen, MONHOC.TenMon, KETQUA.Diem FROM KETQUA JOIN HOCSINH ON ... JOIN MONHOC ON ...;",
        solution: "SELECT HOCSINH.HoTen, MONHOC.TenMon, KETQUA.Diem FROM KETQUA JOIN HOCSINH ON KETQUA.MaHS=HOCSINH.MaHS JOIN MONHOC ON KETQUA.MaMon=MONHOC.MaMon;",
        hint: "KETQUA nối HOCSINH qua MaHS và MONHOC qua MaMon." },
      { prompt: "Tính **điểm trung bình mỗi môn**: hiển thị **tên môn** và điểm trung bình của môn đó.", schema: S,
        starter: "SELECT MONHOC.TenMon, AVG(KETQUA.Diem) FROM KETQUA JOIN MONHOC ON ... GROUP BY ...;",
        solution: "SELECT MONHOC.TenMon, AVG(KETQUA.Diem) FROM KETQUA JOIN MONHOC ON KETQUA.MaMon=MONHOC.MaMon GROUP BY MONHOC.TenMon;",
        hint: "Nối KETQUA–MONHOC rồi GROUP BY MONHOC.TenMon, dùng AVG(KETQUA.Diem)." },
      { prompt: "Liệt kê **họ tên và tên môn** ở những kết quả đạt **điểm ≥ 9** (nối ba bảng).", schema: S,
        starter: "SELECT HOCSINH.HoTen, MONHOC.TenMon FROM KETQUA JOIN HOCSINH ON ... JOIN MONHOC ON ... WHERE KETQUA.Diem>=9;",
        solution: "SELECT HOCSINH.HoTen, MONHOC.TenMon FROM KETQUA JOIN HOCSINH ON KETQUA.MaHS=HOCSINH.MaHS JOIN MONHOC ON KETQUA.MaMon=MONHOC.MaMon WHERE KETQUA.Diem>=9;",
        hint: "Nối ba bảng rồi WHERE KETQUA.Diem>=9." },
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
    var norm = function (res) { return res.rows.map(function (row) { return row.map(function (v) { return v === null ? " " : String(v); }).join(""); }); };
    var ra = norm(a), rb = norm(b);
    if (ra.length !== rb.length) return false;
    if (!orderMatters) { ra = ra.slice().sort(); rb = rb.slice().sort(); }
    return JSON.stringify(ra) === JSON.stringify(rb);
  }

  /* ---------------- Bài tập trong trang bài học ---------------- */
  function exHTML(ex, i) {
    return '<div class="sqx" data-i="' + i + '">' +
      '<div class="ex-head" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap"><span style="font-weight:800;color:var(--primary);font-size:14px">Bài ' + (i + 1) + '</span><span class="pill type-tf">SQL</span></div>' +
      '<div class="sqx-prompt">' + fmtInline(ex.prompt) + "</div>" +
      dataPreview(false) +
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
      res.innerHTML = ""; verdict.hidden = false; verdict.className = "sqx-verdict"; verdict.textContent = "Đang khởi động SQLite…";
      runBtn.disabled = true;
      var restore = function () { runBtn.disabled = false; };
      sqlReady().then(function (SQLmod) {
        var actual, err = null;
        try { actual = runSeq(SQLmod, ex.schema, ta.value, ex.check); }
        catch (e) { err = String(e && e.message ? e.message : e); }
        if (err) { verdict.className = "sqx-verdict err"; verdict.textContent = "❌ Lỗi SQL: " + err; restore(); return; }
        var expected = runSeq(SQLmod, ex.schema, ex.solution, ex.check);
        var showRes = ex.check ? actual : actual;
        res.innerHTML = (ex.check ? '<div class="sqx-cap">Bảng sau khi chạy:</div>' : '<div class="sqx-cap">Kết quả truy vấn của bạn:</div>') +
          (showRes.rows.length ? tableHTML(showRes.columns, showRes.rows) : '<div class="sqx-cap">(không có dòng nào)</div>');
        var ok = sameResult(actual, expected, ex.orderMatters);
        if (ok && typeof Gam !== "undefined" && Gam.onExercisePass) Gam.onExercisePass({ prompt: ex.prompt });
        verdict.className = "sqx-verdict " + (ok ? "ok" : "no");
        verdict.innerHTML = ok
          ? (typeof ICON === "function" ? ICON("check2", 15, "#16a34a") : "") + " <b>Chính xác!</b> Truy vấn cho đúng kết quả mong đợi."
          : (typeof ICON === "function" ? ICON("x", 15, "#dc2626") : "") + " <b>Chưa đúng.</b> Kết quả chưa khớp đáp án. Xem lại điều kiện lọc/nối bảng rồi thử lại nhé.";
        restore();
      }, function (e) { verdict.className = "sqx-verdict err"; verdict.textContent = "❌ Không nạp được SQLite: " + (e && e.message ? e.message : e); restore(); });
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

  /* ---------------- SÂN CHƠI SQL (route sqlLab) ---------------- */
  var _lab = null;                                  // CSDL giữ trạng thái trong phiên
  function labGetDb(SQLmod) { if (!_lab) { _lab = new SQLmod.Database(); _lab.run(SCHOOL_SCHEMA); } return _lab; }
  function labReset() { if (_lab) { try { _lab.close(); } catch (e) {} _lab = null; } }

  var LAB_SAMPLES = [
    "SELECT * FROM HOCSINH;",
    "SELECT HoTen, DiemTB FROM HOCSINH ORDER BY DiemTB DESC;",
    "SELECT HOCSINH.HoTen, LOP.TenLop FROM HOCSINH JOIN LOP ON HOCSINH.MaLop=LOP.MaLop;",
    "SELECT MONHOC.TenMon, AVG(KETQUA.Diem) FROM KETQUA JOIN MONHOC ON KETQUA.MaMon=MONHOC.MaMon GROUP BY MONHOC.TenMon;",
  ];

  function renderSqlLab() {
    var app = document.getElementById("app");
    if (!app) return;
    var ico = function (n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; };
    app.innerHTML =
      '<button class="back-link" id="labBack">' + ico("aleft", null, 15) + " Về trang chủ</button>" +
      '<h2 style="margin-bottom:6px">' + ico("layers", "#0891b2", 22) + " Sân chơi SQL</h2>" +
      '<p style="color:var(--text-soft);font-size:14px;margin:0 0 14px">Viết SQL tuỳ ý và chạy ngay trên cơ sở dữ liệu mẫu (SQLite trong trình duyệt). Thử `SELECT`, `JOIN`, `GROUP BY`… hoặc cả `INSERT`/`UPDATE` — thay đổi được giữ lại đến khi bấm “Đặt lại”.</p>' +
      dataPreview(true) +
      '<div style="margin:6px 0 4px;font-weight:650;font-size:13px;color:var(--text-soft)">Ví dụ nhanh (bấm để chèn):</div>' +
      '<div id="labChips">' + LAB_SAMPLES.map(function (s, i) { return '<span class="sqx-chip" data-i="' + i + '">' + esc(s.length > 46 ? s.slice(0, 44) + "…" : s) + "</span>"; }).join("") + "</div>" +
      '<textarea class="sqx-editor" id="labEditor" style="min-height:110px;margin-top:6px" spellcheck="false">SELECT * FROM HOCSINH;</textarea>' +
      '<div class="sqx-actions">' +
        '<button class="btn btn-ghost" id="labResetDb">' + ico("refresh", null, 14) + " Đặt lại CSDL</button>" +
        '<button class="btn btn-primary" id="labRun">' + ico("play", null, 14) + " Chạy</button>" +
      "</div>" +
      '<div class="sqx-res" id="labRes"></div><div class="sqx-verdict" id="labMsg" hidden></div>';

    if (typeof iconify === "function") iconify(app);
    var ta = app.querySelector("#labEditor"), resEl = app.querySelector("#labRes"), msg = app.querySelector("#labMsg");
    app.querySelector("#labBack").onclick = function () { if (typeof go === "function") go("home"); };
    app.querySelectorAll("#labChips .sqx-chip").forEach(function (c) { c.onclick = function () { ta.value = LAB_SAMPLES[+c.dataset.i]; }; });

    app.querySelector("#labRun").onclick = function () {
      resEl.innerHTML = ""; msg.hidden = false; msg.className = "sqx-verdict"; msg.textContent = "Đang khởi động SQLite…";
      sqlReady().then(function (SQLmod) {
        var db;
        try { db = labGetDb(SQLmod); } catch (e) { msg.className = "sqx-verdict err"; msg.textContent = "❌ " + e.message; return; }
        try {
          var out = db.exec(ta.value);
          if (!out.length) {
            var n = db.getRowsModified();
            msg.className = "sqx-verdict ok"; msg.innerHTML = (typeof ICON === "function" ? ICON("check2", 15, "#16a34a") : "") + " Đã chạy xong. Số dòng bị thay đổi: <b>" + n + "</b>.";
          } else {
            msg.hidden = true;
            resEl.innerHTML = out.map(function (r, k) {
              return (out.length > 1 ? '<div class="sqx-cap">Kết quả ' + (k + 1) + "</div>" : '<div class="sqx-cap">Kết quả (' + r.values.length + " dòng)</div>") + tableHTML(r.columns, r.values);
            }).join("");
          }
        } catch (e) { msg.className = "sqx-verdict err"; msg.textContent = "❌ Lỗi SQL: " + (e && e.message ? e.message : e); }
      }, function (e) { msg.className = "sqx-verdict err"; msg.textContent = "❌ Không nạp được SQLite: " + (e && e.message ? e.message : e); });
    };

    app.querySelector("#labResetDb").onclick = function () {
      labReset(); resEl.innerHTML = ""; msg.hidden = false; msg.className = "sqx-verdict ok";
      msg.innerHTML = (typeof ICON === "function" ? ICON("refresh", 15, "#16a34a") : "") + " Đã đặt lại cơ sở dữ liệu về ban đầu.";
    };
  }

  if (typeof window !== "undefined") {
    window.SQL_EXERCISES = SQL_EXERCISES;
    window.injectSqlExercises = injectSqlExercises;
    window.renderSqlLab = renderSqlLab;
  }
})();
