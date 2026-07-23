/* ============================================================================
 *  BÀI THỰC HÀNH TỰ VIẾT CODE - máy chạy Python (Skulpt) và TỰ CHẤM kết quả.
 *  Hai kiểu: "fill" (điền chỗ trống) và "code" (tự viết). Chấm bằng cách so
 *  sánh kết quả in ra (output) với đáp án mong đợi.
 *  Tách riêng để dễ mở rộng & tránh lỗi ghi trên lessons.js/app.js.
 * ==========================================================================*/

/* ------- CSS cho phần bài thực hành (tự chèn để không phải sửa styles.css) ------- */
(function () {
  var css =
    ".ex-list{display:grid;gap:14px}" +
    ".ex{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px}" +
    ".ex-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap}" +
    ".ex-num{font-weight:800;color:var(--primary);font-size:14px}" +
    ".ex-prompt{font-size:15px;margin-bottom:10px;line-height:1.55}" +
    ".ex-editor{min-height:92px;border-radius:10px;border:1px solid var(--border)}" +
    ".ex-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}" +
    ".ex-actions .btn{padding:8px 14px;font-size:13.5px}" +
    ".ex-hint{margin-top:10px;padding:10px 14px;border-radius:8px;background:var(--warning-soft);border-left:4px solid var(--warning);font-size:14px}" +
    ".ex-out{margin-top:10px;border-radius:10px}" +
    ".ex-result{margin-top:10px;padding:12px 14px;border-radius:8px;font-size:14.5px}" +
    ".ex-result.ok{background:var(--success-soft);border:1px solid var(--success)}" +
    ".ex-result.no{background:var(--danger-soft);border:1px solid var(--danger)}" +
    ".ex-result code{background:rgba(125,125,125,0.2);padding:2px 6px;border-radius:5px;font-family:Consolas,monospace}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();

/* ------------------------------ DỮ LIỆU BÀI THỰC HÀNH ------------------------------ */
function xIco(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 15, c) : ""; }
const EXERCISES = {
  L04: [
    { type: "code", prompt: "Tạo biến `ten` có giá trị `\"Nam\"`, rồi in ra dòng chữ: **Xin chào Nam**",
      starter: "# Gợi ý: dùng  print(\"Xin chào\", ten)\n", expected: "Xin chào Nam",
      hint: "Gán ten = \"Nam\" rồi print(\"Xin chào\", ten).", solution: "ten = \"Nam\"\nprint(\"Xin chào\", ten)" },
    { type: "fill", prompt: "Điền toán tử để chương trình in ra **TỔNG** của a và b.",
      starter: "a = 5\nb = 3\nprint(a ___ b)", expected: "8",
      hint: "Toán tử cộng là dấu +.", solution: "a = 5\nb = 3\nprint(a + b)" },
  ],
  L05: [
    { type: "fill", prompt: "Điền toán tử để in ra **PHẦN DƯ** của 17 chia 5.",
      starter: "print(17 ___ 5)", expected: "2",
      hint: "Phép chia lấy dư dùng dấu %.", solution: "print(17 % 5)" },
    { type: "code", prompt: "In ra kết quả của **2 lũy thừa 10** (tức 2¹⁰).",
      starter: "# dùng toán tử **\n", expected: "1024",
      hint: "2 ** 10", solution: "print(2 ** 10)" },
  ],
  L06: [
    { type: "fill", prompt: "Điền toán tử để chương trình in ra **Chẵn** (kiểm tra n chia hết cho 2).",
      starter: "n = 8\nif n ___ 2 == 0:\n    print(\"Chẵn\")\nelse:\n    print(\"Lẻ\")", expected: "Chẵn",
      hint: "Chia hết nghĩa là phần dư bằng 0 → dùng %.", solution: "n = 8\nif n % 2 == 0:\n    print(\"Chẵn\")\nelse:\n    print(\"Lẻ\")" },
    { type: "code", prompt: "Cho `tuoi = 20`. Viết if...else in ra **Người lớn** nếu tuoi ≥ 18, ngược lại in **Trẻ em**.",
      starter: "tuoi = 20\n# viết if ... else ...\n", expected: "Người lớn",
      hint: "if tuoi >= 18: ... else: ...", solution: "tuoi = 20\nif tuoi >= 18:\n    print(\"Người lớn\")\nelse:\n    print(\"Trẻ em\")" },
  ],
  L07: [
    { type: "code", prompt: "Dùng vòng lặp **for** in ra các số từ 1 đến 5 (mỗi số một dòng).",
      starter: "# for i in range(...)\n", expected: "1\n2\n3\n4\n5",
      hint: "range(1, 6) tạo dãy 1,2,3,4,5.", solution: "for i in range(1, 6):\n    print(i)" },
    { type: "code", prompt: "Tính và in ra **TỔNG các số từ 1 đến 100**.",
      starter: "# dùng biến s cộng dồn trong vòng lặp\n", expected: "5050",
      hint: "s = 0; cộng dồn trong for i in range(1, 101).", solution: "s = 0\nfor i in range(1, 101):\n    s = s + i\nprint(s)" },
    { type: "fill", prompt: "Điền số còn thiếu để chương trình in ra 1 2 3 4 5.",
      starter: "for i in range(1, ___):\n    print(i)", expected: "1\n2\n3\n4\n5",
      hint: "range không bao gồm số cuối, nên cần 6.", solution: "for i in range(1, 6):\n    print(i)" },
  ],
  L08: [
    { type: "code", prompt: "Cho `a = [4, 8, 15, 16, 23, 42]`. In ra **SỐ PHẦN TỬ** của danh sách.",
      starter: "a = [4, 8, 15, 16, 23, 42]\n# in số phần tử\n", expected: "6",
      hint: "Dùng hàm len(a).", solution: "a = [4, 8, 15, 16, 23, 42]\nprint(len(a))" },
    { type: "code", prompt: "Cho `a = [10, 20, 30]`. Thêm số **40** vào cuối rồi in ra cả danh sách.",
      starter: "a = [10, 20, 30]\n# thêm 40 rồi in a\n", expected: "[10, 20, 30, 40]",
      hint: "a.append(40) rồi print(a).", solution: "a = [10, 20, 30]\na.append(40)\nprint(a)" },
    { type: "fill", prompt: "Điền chỉ số để in ra **ký tự đầu tiên** của chuỗi.",
      starter: "s = \"Python\"\nprint(s[___])", expected: "P",
      hint: "Chỉ số bắt đầu từ 0.", solution: "s = \"Python\"\nprint(s[0])" },
  ],
  L09: [
    { type: "code", prompt: "Viết hàm `binh_phuong(x)` trả về x nhân x. Sau đó in ra `binh_phuong(6)`.",
      starter: "# def binh_phuong(x):\n#     return ...\n", expected: "36",
      hint: "return x * x, rồi print(binh_phuong(6)).", solution: "def binh_phuong(x):\n    return x * x\nprint(binh_phuong(6))" },
    { type: "code", prompt: "Viết hàm `lon_hon(a, b)` trả về số lớn hơn trong hai số. In ra `lon_hon(7, 12)`.",
      starter: "# def lon_hon(a, b): ...\n", expected: "12",
      hint: "if a > b: return a; ngược lại return b.", solution: "def lon_hon(a, b):\n    if a > b:\n        return a\n    return b\nprint(lon_hon(7, 12))" },
  ],
  L10: [
    { type: "code", prompt: "Cho `d = {\"an\": 8, \"binh\": 9}`. In ra **điểm của 'binh'**.",
      starter: "d = {\"an\": 8, \"binh\": 9}\n# in điểm của binh\n", expected: "9",
      hint: "Truy cập theo khóa: d[\"binh\"].", solution: "d = {\"an\": 8, \"binh\": 9}\nprint(d[\"binh\"])" },
    { type: "code", prompt: "Dùng **list comprehension** tạo danh sách bình phương của 1, 2, 3, 4 rồi in ra.",
      starter: "# [x*x for x in range(1, 5)]\n", expected: "[1, 4, 9, 16]",
      hint: "print([x * x for x in range(1, 5)]).", solution: "print([x * x for x in range(1, 5)])" },
  ],
  L11: [
    { type: "code", prompt: "Cho `a = [3, 7, 2, 8, 5]`. Tìm và in ra **giá trị LỚN NHẤT** (không dùng hàm max).",
      starter: "a = [3, 7, 2, 8, 5]\n# tìm max bằng vòng lặp\n", expected: "8",
      hint: "Gán max_val = a[0], duyệt và so sánh cập nhật.", solution: "a = [3, 7, 2, 8, 5]\nmax_val = a[0]\nfor x in a:\n    if x > max_val:\n        max_val = x\nprint(max_val)" },
    { type: "code", prompt: "Cho `a = [5, 2, 9, 1, 7]`. Đếm và in ra **số phần tử lớn hơn 4**.",
      starter: "a = [5, 2, 9, 1, 7]\n# đếm phần tử > 4\n", expected: "3",
      hint: "dem = 0, tăng dem khi x > 4.", solution: "a = [5, 2, 9, 1, 7]\ndem = 0\nfor x in a:\n    if x > 4:\n        dem = dem + 1\nprint(dem)" },
  ],
  L16: [
    { type: "fill", prompt: "Điền **trường hợp dừng** (0! trả về mấy?) để hàm giai thừa chạy đúng.",
      starter: "def gt(n):\n    if n == 0:\n        return ___\n    return n * gt(n - 1)\nprint(gt(4))", expected: "24",
      hint: "0! = 1.", solution: "def gt(n):\n    if n == 0:\n        return 1\n    return n * gt(n - 1)\nprint(gt(4))" },
    { type: "code", prompt: "Viết hàm **đệ quy** `tong(n)` tính 1+2+...+n. In ra `tong(10)`.",
      starter: "# def tong(n): điều kiện dừng + gọi đệ quy\n", expected: "55",
      hint: "if n <= 0: return 0; return n + tong(n - 1).", solution: "def tong(n):\n    if n <= 0:\n        return 0\n    return n + tong(n - 1)\nprint(tong(10))" },
  ],
  L22: [
    { type: "code", prompt: "Cho `s = \"tin hoc\"`. In ra chuỗi đó bằng **CHỮ HOA**.",
      starter: "s = \"tin hoc\"\n# in ra chữ hoa\n", expected: "TIN HOC",
      hint: "Dùng s.upper().", solution: "s = \"tin hoc\"\nprint(s.upper())" },
    { type: "code", prompt: "Cho `s = \"abracadabra\"`. Đếm và in ra **số chữ 'a'**.",
      starter: "s = \"abracadabra\"\n# đếm chữ a\n", expected: "5",
      hint: "Dùng s.count(\"a\").", solution: "s = \"abracadabra\"\nprint(s.count(\"a\"))" },
  ],
  L23: [
    { type: "code", prompt: "Cho `a = [[1, 2], [3, 4], [5, 6]]`. Tính và in ra **TỔNG tất cả phần tử**.",
      starter: "a = [[1, 2], [3, 4], [5, 6]]\n# dùng hai vòng lặp lồng nhau\n", expected: "21",
      hint: "Hai vòng for lồng nhau, cộng dồn vào biến s.", solution: "a = [[1, 2], [3, 4], [5, 6]]\ns = 0\nfor hang in a:\n    for x in hang:\n        s = s + x\nprint(s)" },
  ],
  L13: [
    { type: "code", prompt: "Hai vòng lặp lồng nhau (kiểu O(n²)). Đếm số lần lặp khi i và j đều chạy từ 0 đến 3, in ra kết quả.",
      starter: "dem = 0\n# hai vòng for lồng nhau, mỗi vòng range(4)\n", expected: "16",
      hint: "4 × 4 = 16 lần.", solution: "dem = 0\nfor i in range(4):\n    for j in range(4):\n        dem = dem + 1\nprint(dem)" },
    { type: "code", prompt: "Thuật toán O(n) duyệt một lần. Cho `a = [10, 20, 30, 40, 50]`, đếm và in ra số lần lặp khi duyệt hết.",
      starter: "a = [10, 20, 30, 40, 50]\ndem = 0\n# duyệt và đếm\n", expected: "5",
      hint: "Mỗi phần tử duyệt 1 lần → bằng len(a).", solution: "a = [10, 20, 30, 40, 50]\ndem = 0\nfor x in a:\n    dem = dem + 1\nprint(dem)" },
  ],
  L14: [
    { type: "code", prompt: "Cho `a = [3, 8, 12, 20, 25]` và `x = 20`. Viết **tìm kiếm tuần tự**, in ra CHỈ SỐ (vị trí) của x trong a.",
      starter: "a = [3, 8, 12, 20, 25]\nx = 20\n# duyệt tìm x, in ra chỉ số\n", expected: "3",
      hint: "for i in range(len(a)): nếu a[i] == x thì print(i).", solution: "a = [3, 8, 12, 20, 25]\nx = 20\nfor i in range(len(a)):\n    if a[i] == x:\n        print(i)" },
    { type: "fill", prompt: "Điền toán tử so sánh để dừng đúng khi tìm thấy giá trị 15.",
      starter: "a = [4, 15, 8, 23]\nfor i in range(len(a)):\n    if a[i] ___ 15:\n        print(\"Tìm thấy tại\", i)", expected: "Tìm thấy tại 1",
      hint: "So sánh BẰNG dùng ==.", solution: "a = [4, 15, 8, 23]\nfor i in range(len(a)):\n    if a[i] == 15:\n        print(\"Tìm thấy tại\", i)" },
  ],
  L15: [
    { type: "code", prompt: "Cho `a = [5, 2, 8, 1]`. Viết **sắp xếp nổi bọt** cho TĂNG DẦN rồi in ra danh sách.",
      starter: "a = [5, 2, 8, 1]\n# sắp xếp nổi bọt rồi print(a)\n", expected: "[1, 2, 5, 8]",
      hint: "Hai vòng lặp, đổi chỗ khi a[j] > a[j+1].", solution: "a = [5, 2, 8, 1]\nn = len(a)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)" },
    { type: "fill", prompt: "Điền toán tử để đổi chỗ khi phần tử trước LỚN HƠN phần tử sau (sắp tăng dần).",
      starter: "a = [3, 1, 2]\nn = len(a)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if a[j] ___ a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)", expected: "[1, 2, 3]",
      hint: "Lớn hơn dùng dấu >.", solution: "a = [3, 1, 2]\nn = len(a)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]\nprint(a)" },
  ],
  L17: [
    { type: "code", prompt: "Dùng list làm **ngăn xếp (Stack)**. Thêm lần lượt 1, 2, 3 (append) rồi lấy ra phần tử trên đỉnh (pop) và in ra.",
      starter: "s = []\n# append 1, 2, 3 rồi print(s.pop())\n", expected: "3",
      hint: "Stack là LIFO: pop lấy phần tử thêm vào SAU CÙNG.", solution: "s = []\ns.append(1)\ns.append(2)\ns.append(3)\nprint(s.pop())" },
    { type: "code", prompt: "Ngăn xếp LIFO: thêm 'a', 'b', 'c' rồi **pop 2 lần**, mỗi lần in ra phần tử lấy được.",
      starter: "s = []\nfor x in ['a', 'b', 'c']:\n    s.append(x)\n# pop 2 lần, mỗi lần print\n", expected: "c\nb",
      hint: "Lần pop đầu ra 'c' (mới nhất), lần sau ra 'b'.", solution: "s = []\nfor x in ['a', 'b', 'c']:\n    s.append(x)\nprint(s.pop())\nprint(s.pop())" },
  ],
  L18: [
    { type: "code", prompt: "Viết `try...except`: thử tính `10 / 0`; nếu lỗi thì in ra **Không thể chia cho 0**.",
      starter: "# try: ... except: ...\n", expected: "Không thể chia cho 0",
      hint: "Chia cho 0 gây lỗi → khối except in thông báo.", solution: "try:\n    print(10 / 0)\nexcept:\n    print(\"Không thể chia cho 0\")" },
    { type: "fill", prompt: "Điền từ khóa để **bắt lỗi**: nếu đổi 'abc' sang số nguyên bị lỗi thì in **Sai định dạng**.",
      starter: "try:\n    x = int(\"abc\")\n___:\n    print(\"Sai định dạng\")", expected: "Sai định dạng",
      hint: "Từ khóa bắt lỗi trong Python là except.", solution: "try:\n    x = int(\"abc\")\nexcept:\n    print(\"Sai định dạng\")" },
  ],
  L25: [
    { type: "code", prompt: "🐞 **TÌM & SỬA LỖI:** Đoạn code muốn in TỔNG các số 1 đến 5 (kết quả 15) nhưng đang SAI. Hãy sửa lại cho đúng.",
      starter: "s = 0\nfor i in range(1, 5):\n    s = s + i\nprint(s)", expected: "15",
      hint: "range(1, 5) chỉ cho 1..4. Cần range(1, 6) để có cả số 5.", solution: "s = 0\nfor i in range(1, 6):\n    s = s + i\nprint(s)" },
    { type: "code", prompt: "🐞 **TÌM & SỬA LỖI:** Đoạn code muốn in **Chẵn** cho n = 8 nhưng đang in sai. Hãy sửa lại.",
      starter: "n = 8\nif n % 2 == 1:\n    print(\"Chẵn\")\nelse:\n    print(\"Lẻ\")", expected: "Chẵn",
      hint: "Số chẵn có phần dư chia 2 bằng 0, không phải 1.", solution: "n = 8\nif n % 2 == 0:\n    print(\"Chẵn\")\nelse:\n    print(\"Lẻ\")" },
  ],
};

/* ------------------------------ BỘ CHẤM ------------------------------ */
/* Chuẩn hóa output để so sánh: bỏ khoảng trắng thừa cuối dòng & đầu/cuối */
function normOut(s) {
  return String(s).replace(/\r/g, "").replace(/[ \t]+$/gm, "").replace(/\n+$/g, "").replace(/^\n+/g, "").trim();
}

/* Chạy code Python, gọi onDone(output, errorOrNull) */
function execPython(code, onDone) {
  if (typeof Sk === "undefined") { onDone("", "Trình chạy Python chưa sẵn sàng (thiếu thư viện js/vendor/skulpt)."); return; }
  var buffer = "";
  Sk.configure({
    output: function (t) { buffer += t; },
    read: function (name) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][name] === undefined) throw "Không tìm thấy mô-đun '" + name + "'";
      return Sk.builtinFiles["files"][name];
    },
    inputfun: function (p) { return window.prompt(p || "Nhập dữ liệu:") || ""; },
    inputfunTakesPrompt: true,
    __future__: Sk.python3,
  });
  Sk.misceval.asyncToPromise(function () { return Sk.importMainWithBody("<code>", false, code, true); })
    .then(function () { onDone(buffer, null); },
          function (e) { onDone(buffer, String(e && e.toString ? e.toString() : e)); });
}

/* ------------------------------ HIỂN THỊ ------------------------------ */
function exerciseHTML(ex, i) {
  var typeLabel = ex.type === "fill" ? "Điền chỗ trống" : "Tự viết code";
  var typeCls = ex.type === "fill" ? "type-tf" : "type-sa";
  var rows = Math.max(4, (ex.starter || "").split("\n").length + 1);
  return '<div class="ex">' +
    '<div class="ex-head"><span class="ex-num">Bài ' + (i + 1) + '</span>' +
      '<span class="pill ' + typeCls + '">' + typeLabel + '</span></div>' +
    '<div class="ex-prompt">' + fmtInline(ex.prompt) + '</div>' +
    '<textarea class="pg-editor ex-editor" spellcheck="false" rows="' + rows + '">' + esc(ex.starter || "") + '</textarea>' +
    '<div class="ex-actions">' +
      (ex.hint ? '<button class="btn btn-ghost ex-hint-btn">' + xIco("bulb", "#d97706", 14) + ' Gợi ý</button>' : '') +
      (ex.solution ? '<button class="btn btn-ghost ex-sol-btn">' + xIco("eye", null, 14) + ' Đáp án mẫu</button>' : '') +
      '<button class="btn btn-primary ex-run">' + xIco("play", null, 14) + ' Chạy &amp; Kiểm tra</button>' +
    '</div>' +
    (ex.hint ? '<div class="ex-hint" hidden>' + xIco("bulb", "#d97706", 14) + " " + esc(ex.hint) + "</div>" : "") +
    '<pre class="pg-out ex-out" hidden></pre>' +
    '<div class="ex-result" hidden></div>' +
    '</div>';
}

function renderExercises(host, exercises) {
  if (!host) return;
  host.innerHTML = '<div class="ex-list">' + exercises.map(exerciseHTML).join("") + '</div>';
  var nodes = host.querySelectorAll(".ex");
  exercises.forEach(function (ex, i) {
    var node = nodes[i];
    var ta = node.querySelector(".ex-editor");
    var out = node.querySelector(".ex-out");
    var res = node.querySelector(".ex-result");
    node.querySelector(".ex-run").onclick = function (e) {
      var btn = e.target;
      out.hidden = false; out.textContent = "Đang chạy..."; out.classList.remove("has-error"); res.hidden = true;
      btn.disabled = true;
      execPython(ta.value, function (output, err) {
        btn.disabled = false;
        if (err) { out.textContent = "❌ Lỗi: " + err; out.classList.add("has-error"); res.hidden = true; return; }
        out.classList.remove("has-error");
        out.textContent = output === "" ? "(chương trình không in ra gì)" : output;
        var ok = normOut(output) === normOut(ex.expected);
        if (ok && typeof Gam !== "undefined") Gam.onExercisePass(ex);
        res.hidden = false;
        res.className = "ex-result " + (ok ? "ok" : "no");
        res.innerHTML = ok
          ? xIco("check2", "#16a34a", 15) + " <b>Chính xác!</b> Làm tốt lắm " + xIco("party", "#f59e0b", 15)
          : xIco("x", "#dc2626", 15) + " <b>Chưa đúng.</b> Kết quả mong đợi: <code>" + esc(ex.expected).replace(/\n/g, "⏎") + "</code>. Hãy thử lại nhé!";
      });
    };
    var hintBtn = node.querySelector(".ex-hint-btn");
    if (hintBtn) hintBtn.onclick = function () { var h = node.querySelector(".ex-hint"); h.hidden = !h.hidden; };
    var solBtn = node.querySelector(".ex-sol-btn");
    if (solBtn) solBtn.onclick = function () { ta.value = ex.solution; res.hidden = true; out.hidden = true; };
    ta.onkeydown = function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
    };
  });
}

/* Chèn khu bài thực hành vào trang bài học (gọi từ renderLesson trong app.js) */
function injectExercises(lesson) {
  var exs = (typeof EXERCISES !== "undefined" && EXERCISES[lesson.id]) || [];
  if (!exs.length) return;
  var anchor = document.querySelector(".ls-actions");
  if (!anchor || !anchor.parentNode) return;
  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<div class="section-title" style="margin-top:24px">' + xIco("code", "#0891b2", 17) + " Bài thực hành (tự viết code)</div>" +
    '<p style="color:var(--text-soft);font-size:13.5px;margin-bottom:12px">Tự tay viết code rồi bấm "Chạy &amp; Kiểm tra" — máy sẽ chấm kết quả giúp em. Bí quá thì xem Gợi ý hoặc Đáp án mẫu.</p>' +
    '<div class="ex-host"></div>';
  anchor.parentNode.insertBefore(wrap, anchor);
  renderExercises(wrap.querySelector(".ex-host"), exs);
}

if (typeof window !== "undefined") {
  window.EXERCISES = EXERCISES;
  window.injectExercises = injectExercises;
}
