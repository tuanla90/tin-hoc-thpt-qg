/* ============================================================================
 *  MINH HOẠ ĐỘNG CHO BÀI HỌC
 *
 *  VÌ SAO TỰ DỰNG THAY VÌ LẤY ẢNH/ANIMATION CÓ SẴN: mấy khái niệm khó nhất của
 *  môn này — đổi hệ nhị phân, tìm kiếm nhị phân, sắp xếp, phân giải tên miền —
 *  không có kho ảnh nào làm sẵn. Kho Lottie sẵn có (xem semantix-docs) chỉ là
 *  biểu tượng phản hồi chung chung: dấu tích, dấu X, bóng đèn. Chúng minh hoạ
 *  CẢM XÚC chứ không minh hoạ CƠ CHẾ, mà cơ chế mới là chỗ học sinh tắc.
 *
 *  VÌ SAO SVG/CSS THAY VÌ VIDEO HAY LOTTIE:
 *    · nhẹ — mỗi minh hoạ vài KB, so với lottie-web ~250KB cộng tệp JSON;
 *    · chạy offline — app vừa cài được ra màn hình chính, video thì phải tải;
 *    · CHO HỌC SINH BẤM TỪNG BƯỚC. Xem một vòng lặp tự chạy thì mắt lướt qua,
 *      còn tự bấm "Bước tiếp" thì phải đoán trước điều gì sắp xảy ra — đó mới
 *      là lúc hiểu bài. Vì vậy mọi minh hoạ ở đây đều do người học điều khiển.
 *
 *  Cắm vào trang bài cùng chỗ với concept-lab (xem app.js).
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  /* ------------------------------------------------------------------ CSS */
  function napCss() {
    if (document.getElementById("mhCss")) return;
    var st = document.createElement("style");
    st.id = "mhCss";
    st.textContent =
      ".mh{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;margin:18px 0}" +
      ".mh h4{margin:0 0 4px;font-family:var(--font-display);font-size:16px}" +
      ".mh-mo{color:var(--text-soft);font-size:13.5px;margin:0 0 14px;line-height:1.55}" +
      ".mh-khung{background:var(--bg-soft);border-radius:12px;padding:14px 12px;overflow-x:auto}" +
      ".mh-thanh{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px}" +
      ".mh-btn{border:1px solid var(--border);background:var(--bg-card);color:var(--text);" +
        "font:700 13.5px var(--font-sans);padding:9px 15px;border-radius:10px;cursor:pointer;min-height:40px}" +
      ".mh-btn:hover{border-color:var(--primary);color:var(--primary)}" +
      ".mh-btn.chinh{background:var(--primary);color:#fff;border-color:var(--primary)}" +
      ".mh-btn:disabled{opacity:.45;cursor:default}" +
      ".mh-loi{flex:1;min-width:190px;font-size:13.5px;color:var(--text-soft);line-height:1.5}" +
      ".mh-loi b{color:var(--text)}" +
      /* --- nhị phân --- */
      ".mh-bits{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}" +
      ".mh-bit{width:44px;text-align:center;cursor:pointer;user-select:none}" +
      ".mh-bit-o{height:44px;border-radius:10px;border:2px solid var(--border);background:var(--bg-card);" +
        "display:flex;align-items:center;justify-content:center;font:800 19px var(--font-mono);transition:all .18s}" +
      ".mh-bit.on .mh-bit-o{background:var(--primary);color:#fff;border-color:var(--primary);transform:translateY(-3px)}" +
      ".mh-bit small{display:block;margin-top:5px;font:700 11.5px var(--font-mono);color:var(--text-soft)}" +
      ".mh-bit.on small{color:var(--primary)}" +
      ".mh-tong{text-align:center;margin-top:14px;font-size:15px}" +
      ".mh-tong b{font-family:var(--font-mono);font-size:22px;color:var(--primary)}" +
      /* --- mảng (tìm kiếm / sắp xếp) --- */
      ".mh-mang{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}" +
      ".mh-o{min-width:38px;height:44px;border-radius:9px;border:2px solid var(--border);background:var(--bg-card);" +
        "display:flex;align-items:center;justify-content:center;font:700 15px var(--font-mono);transition:all .25s}" +
      ".mh-o.ngoai{opacity:.28}" +
      ".mh-o.giua{border-color:var(--primary);background:var(--primary-soft);color:var(--primary);transform:scale(1.1)}" +
      ".mh-o.thay{border-color:var(--success,#16a34a);background:var(--success,#16a34a);color:#fff}" +
      ".mh-o.doi{border-color:#f59e0b;background:#fef3c7;color:#92400e}" +
      ".mh-o.xong{border-color:var(--success,#16a34a);color:var(--success,#16a34a)}" +
      /* --- luồng DNS --- */
      ".mh-nut{display:flex;gap:8px;align-items:stretch;justify-content:center;flex-wrap:wrap}" +
      ".mh-hop{flex:1;min-width:104px;max-width:150px;border:2px solid var(--border);border-radius:12px;" +
        "padding:10px 8px;text-align:center;background:var(--bg-card);transition:all .25s}" +
      ".mh-hop.sang{border-color:var(--primary);background:var(--primary-soft);transform:translateY(-3px)}" +
      ".mh-hop .mh-ic{font-size:24px;line-height:1.1}" +
      ".mh-hop b{display:block;font-size:12.5px;margin-top:4px}" +
      ".mh-hop small{display:block;font-size:11.5px;color:var(--text-soft);margin-top:2px;line-height:1.35}" +
      "@media (max-width:560px){.mh-bit{width:38px}.mh-bit-o{height:38px;font-size:16px}}" +

      /* --- CHUYỂN ĐỘNG ---
         Cố ý rất ngắn (180–420ms) và chỉ chạy MỘT lần khi trạng thái đổi. Animation
         dài hoặc chạy vô hạn ở đây sẽ phản tác dụng: học sinh bấm liên tiếp thì các
         hiệu ứng chồng lên nhau thành nhấp nháy, và mắt bị hút vào chuyển động thay
         vì vào con số. Toàn bộ tự tắt khi hệ điều hành bật "giảm chuyển động" —
         xem luật prefers-reduced-motion ở css/styles.css. */
      "@keyframes mhPop{0%{transform:translateY(-3px) scale(1)}45%{transform:translateY(-6px) scale(1.14)}100%{transform:translateY(-3px) scale(1)}}" +
      ".mh-bit.on .mh-bit-o{animation:mhPop .26s ease}" +

      /* Ô giữa: vòng sáng loang ra một nhịp, đủ để mắt bắt được "đang xét ô này". */
      "@keyframes mhLoang{0%{box-shadow:0 0 0 0 var(--primary)}100%{box-shadow:0 0 0 11px transparent}}" +
      ".mh-o.giua{animation:mhLoang .5s ease-out}" +

      /* Đổi chỗ: lắc ngang — trực giác "hai ô vừa tráo nhau". */
      "@keyframes mhLac{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}" +
      ".mh-o.doi{animation:mhLac .3s ease}" +

      /* Tìm thấy / đã đúng chỗ: nảy lên một cái cho ra cảm giác chốt hạ. */
      "@keyframes mhNay{0%{transform:scale(1)}40%{transform:scale(1.22)}100%{transform:scale(1)}}" +
      ".mh-o.thay{animation:mhNay .42s cubic-bezier(.34,1.56,.64,1)}" +

      /* Chặng DNS vừa sáng: trôi lên vào chỗ, thấy rõ "câu hỏi đi tiếp một chặng". */
      "@keyframes mhTroi{0%{opacity:.35;transform:translateY(7px)}100%{opacity:1;transform:translateY(-3px)}}" +
      ".mh-hop.sang{animation:mhTroi .34s ease-out}" +

      /* Ô bị loại khỏi vùng tìm mờ dần thay vì tắt đột ngột. */
      ".mh-o{transition:opacity .3s ease,border-color .25s,background .25s,color .25s,transform .25s}" +

      /* Thanh tổng nhấp một nhịp khi số đổi, để không ai bấm bit mà không nhận ra. */
      "@keyframes mhSang{0%{background:var(--primary-soft)}100%{background:transparent}}" +
      ".mh-tong.doi{animation:mhSang .5s ease-out;border-radius:9px}";
    (document.head || document.documentElement).appendChild(st);
  }

  function el(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function khung(tieuDe, moTa, than) {
    return '<div class="mh"><h4>' + tieuDe + "</h4><p class=\"mh-mo\">" + moTa + "</p>" +
      '<div class="mh-khung">' + than + "</div>" +
      '<div class="mh-thanh"><button class="mh-btn chinh" data-mh="tien">Bước tiếp →</button>' +
      '<button class="mh-btn" data-mh="lai">Làm lại</button>' +
      '<span class="mh-loi" data-mh="loi"></span></div></div>';
  }

  /* ==================================================================
   *  1. ĐỔI HỆ NHỊ PHÂN  (C10-23)
   *  Cho bấm trực tiếp vào từng bit: học sinh tự thấy "bật bit nào thì
   *  cộng thêm bao nhiêu", nhanh hơn mọi lời giảng.
   * ================================================================ */
  function nhiPhan(host) {
    var W = [128, 64, 32, 16, 8, 4, 2, 1];
    var bit = [0, 0, 0, 0, 0, 0, 0, 0];
    var buoc = -1;
    var muc = 0;

    var node = el(khung("Số nhị phân biến thành số thập phân thế nào?",
      "Mỗi ô là một <b>bit</b>, dưới ô là <b>trọng số</b> của nó. Bấm vào ô để bật/tắt bit — " +
      "hoặc bấm “Bước tiếp” để xem máy đổi số <b>77</b> từng bước một.",
      '<div class="mh-bits" data-mh="bits"></div><div class="mh-tong" data-mh="tong"></div>'));

    function ve() {
      var bits = node.querySelector('[data-mh="bits"]');
      bits.innerHTML = W.map(function (w, i) {
        return '<div class="mh-bit' + (bit[i] ? " on" : "") + '" data-i="' + i + '">' +
          '<div class="mh-bit-o">' + bit[i] + "</div><small>" + w + "</small></div>";
      }).join("");
      var tong = bit.reduce(function (s, b, i) { return s + (b ? W[i] : 0); }, 0);
      var cong = W.filter(function (w, i) { return bit[i]; });
      var oTong = node.querySelector('[data-mh="tong"]');
      /* Phần tử này KHÔNG bị dựng lại (chỉ đổi innerHTML) nên animation sẽ không tự
         chạy lần hai. Bỏ class, buộc trình duyệt tính lại layout, rồi gắn lại. */
      oTong.classList.remove("doi");
      void oTong.offsetWidth;
      oTong.classList.add("doi");
      oTong.innerHTML =
        (cong.length ? cong.join(" + ") + " = " : "") + "<b>" + tong + "</b>" +
        '<div style="font-size:12.5px;color:var(--text-soft);margin-top:3px">nhị phân ' +
        bit.join("") + "<sub>2</sub> = " + tong + "<sub>10</sub></div>";
      bits.querySelectorAll(".mh-bit").forEach(function (o) {
        o.onclick = function () { buoc = -1; bit[+o.dataset.i] ^= 1; ve(); loi("Em vừa tự đổi bit — tổng cập nhật ngay."); };
      });
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc < 0) { bit = [0, 0, 0, 0, 0, 0, 0, 0]; muc = 77; buoc = 0; }
      if (buoc >= 8) { loi("Xong: <b>77</b> = 01001101<sub>2</sub>. Bấm “Làm lại” để thử số khác."); return; }
      var w = W[buoc], du = muc;
      if (du >= w) { bit[buoc] = 1; muc -= w; loi("Còn <b>" + du + "</b> ≥ " + w + " → bật bit, trừ đi " + w + ", còn <b>" + muc + "</b>."); }
      else { bit[buoc] = 0; loi("Còn <b>" + du + "</b> &lt; " + w + " → bit này để 0."); }
      buoc++; ve();
    };
    node.querySelector('[data-mh="lai"]').onclick = function () {
      bit = [0, 0, 0, 0, 0, 0, 0, 0]; buoc = -1; ve(); loi("Bấm vào ô bất kỳ để tự thử, hoặc “Bước tiếp” để xem máy đổi số 77.");
    };
    host.appendChild(node); ve();
    loi("Bấm vào ô bất kỳ để tự thử, hoặc “Bước tiếp” để xem máy đổi số 77.");
  }

  /* ==================================================================
   *  2. TÌM KIẾM NHỊ PHÂN  (C11-14)
   *  Điểm học sinh hay tắc: vì sao "loại một nửa" lại nhanh đến vậy.
   *  Cho thấy vùng còn lại teo đi sau mỗi bước là hiểu ngay.
   * ================================================================ */
  function timNhiPhan(host) {
    var A = [3, 8, 12, 17, 23, 29, 34, 41, 47, 52, 58, 63, 70, 78, 85];
    var can = 58, lo, hi, xong, soBuoc;

    var node = el(khung("Tìm kiếm nhị phân: vì sao chỉ vài bước là ra?",
      "Dãy đã <b>sắp xếp sẵn</b> — đó là điều kiện bắt buộc. Ta tìm số <b>" + can + "</b>. " +
      "Mỗi bước nhìn đúng <b>ô giữa</b> rồi bỏ hẳn một nửa. Để ý vùng sáng teo đi sau mỗi lần bấm.",
      '<div class="mh-mang" data-mh="mang"></div>'));

    function dat() { lo = 0; hi = A.length - 1; xong = false; soBuoc = 0; }
    function ve(giua) {
      node.querySelector('[data-mh="mang"]').innerHTML = A.map(function (v, i) {
        var c = "mh-o";
        if (i < lo || i > hi) c += " ngoai";
        if (xong && v === can) c += " thay";
        else if (i === giua) c += " giua";
        return '<div class="' + c + '">' + v + "</div>";
      }).join("");
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (xong) { loi("Đã tìm xong sau <b>" + soBuoc + "</b> bước. Dò từng ô sẽ mất tới 11 bước."); return; }
      if (lo > hi) { loi("Vùng tìm rỗng → không có số này trong dãy."); xong = true; return; }
      var g = Math.floor((lo + hi) / 2); soBuoc++;
      if (A[g] === can) {
        xong = true; ve(g);
        loi("A[" + g + "] = <b>" + can + "</b> → tìm thấy sau <b>" + soBuoc + "</b> bước. " +
            "Dò tuần tự từ đầu sẽ mất <b>11</b> bước.");
      } else if (A[g] < can) {
        loi("A[" + g + "] = " + A[g] + " &lt; " + can + " → số cần nằm bên <b>phải</b>, bỏ nửa trái.");
        lo = g + 1; ve(g);
      } else {
        loi("A[" + g + "] = " + A[g] + " &gt; " + can + " → số cần nằm bên <b>trái</b>, bỏ nửa phải.");
        hi = g - 1; ve(g);
      }
    };
    node.querySelector('[data-mh="lai"]').onclick = function () { dat(); ve(-1); loi("Bấm “Bước tiếp” để nhìn ô giữa."); };
    host.appendChild(node); dat(); ve(-1);
    loi("Bấm “Bước tiếp” để nhìn ô giữa.");
  }

  /* ==================================================================
   *  3. SẮP XẾP NỔI BỌT  (C11-15)
   *  Mỗi bước là MỘT phép so sánh, không phải một lượt — để thấy vì sao
   *  số phép so sánh lớn lên rất nhanh theo độ dài dãy.
   * ================================================================ */
  function sapXep(host) {
    var GOC = [5, 2, 9, 1, 7, 3];
    var A, i, j, soSanh, doi, xong;

    var node = el(khung("Sắp xếp nổi bọt: từng phép so sánh một",
      "Mỗi lần bấm là <b>một</b> phép so sánh hai ô cạnh nhau; sai thứ tự thì đổi chỗ. " +
      "Số lớn “nổi” dần về cuối — ô đã đúng chỗ chuyển sang màu xanh.",
      '<div class="mh-mang" data-mh="mang"></div>'));

    function dat() { A = GOC.slice(); i = 0; j = 0; soSanh = 0; doi = 0; xong = false; }
    function ve(a, b, dangDoi) {
      node.querySelector('[data-mh="mang"]').innerHTML = A.map(function (v, k) {
        var c = "mh-o";
        if (xong || k >= A.length - i) c += " xong";
        else if (dangDoi && (k === a || k === b)) c += " doi";
        else if (k === a || k === b) c += " giua";
        return '<div class="' + c + '">' + v + "</div>";
      }).join("");
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (xong) { loi("Xong: <b>" + soSanh + "</b> phép so sánh, <b>" + doi + "</b> lần đổi chỗ cho 6 số."); return; }
      if (j >= A.length - 1 - i) { i++; j = 0; if (i >= A.length - 1) { xong = true; ve(-1, -1); loi("Xong: <b>" + soSanh + "</b> phép so sánh, <b>" + doi + "</b> lần đổi chỗ. Dãy 6 số đã tốn ngần này — dãy 1000 số thì sao?"); return; } }
      soSanh++;
      if (A[j] > A[j + 1]) {
        var t = A[j]; A[j] = A[j + 1]; A[j + 1] = t; doi++;
        ve(j, j + 1, true);
        loi("So sánh " + A[j + 1] + " và " + A[j] + ": sai thứ tự → <b>đổi chỗ</b>. (so sánh thứ " + soSanh + ")");
      } else {
        ve(j, j + 1, false);
        loi("So sánh " + A[j] + " và " + A[j + 1] + ": đã đúng thứ tự → giữ nguyên. (so sánh thứ " + soSanh + ")");
      }
      j++;
    };
    node.querySelector('[data-mh="lai"]').onclick = function () { dat(); ve(-1, -1); loi("Bấm “Bước tiếp” để so sánh cặp đầu tiên."); };
    host.appendChild(node); dat(); ve(-1, -1);
    loi("Bấm “Bước tiếp” để so sánh cặp đầu tiên.");
  }

  /* ==================================================================
   *  4. TỪ TÊN MIỀN ĐẾN ĐỊA CHỈ IP  (C12-05)
   *  Học sinh hay tưởng gõ tên miền là "vào thẳng". Cho thấy có mấy
   *  chặng hỏi đáp ở giữa, và vì sao lần sau lại nhanh hơn (bộ nhớ đệm).
   * ================================================================ */
  function dns(host) {
    var B = [
      { ic: "🌐", ten: "Trình duyệt", mo: "gõ vnexpress.net", noi: "Trình duyệt chưa biết địa chỉ số của tên miền này, nên đi hỏi." },
      { ic: "📇", ten: "Máy chủ DNS", mo: "của nhà mạng", noi: "Hỏi máy chủ DNS nhà mạng. Nếu nó vừa tra hộ ai đó, nó trả lời ngay từ <b>bộ nhớ đệm</b>." },
      { ic: "🌱", ten: "Máy chủ gốc", mo: "root", noi: "Chưa có trong đệm → hỏi máy chủ gốc. Gốc không biết địa chỉ, chỉ chỉ đường: “hỏi bên quản lý .net”." },
      { ic: "🏷️", ten: "Máy chủ .net", mo: "TLD", noi: "Bên quản lý đuôi .net cũng không giữ địa chỉ, nhưng biết ai quản lý vnexpress.net." },
      { ic: "📮", ten: "Máy chủ quản lý", mo: "vnexpress.net", noi: "Đây mới là nơi giữ bản ghi thật, trả về <b>địa chỉ IP</b>." },
      { ic: "✅", ten: "Có IP", mo: "kết nối", noi: "Có IP rồi, trình duyệt mới thật sự kết nối tới máy chủ web. Địa chỉ được nhớ tạm, nên lần sau vào lại nhanh hơn hẳn." },
    ];
    var k = -1;
    var node = el(khung("Gõ một tên miền, máy tính tìm nhau thế nào?",
      "Máy tính chỉ liên lạc được bằng <b>địa chỉ IP</b> (dãy số), còn người thì nhớ <b>tên miền</b> (chữ). " +
      "Ở giữa là mấy chặng hỏi đáp mà ta không nhìn thấy — bấm để đi từng chặng.",
      '<div class="mh-nut" data-mh="nut"></div>'));

    function ve() {
      node.querySelector('[data-mh="nut"]').innerHTML = B.map(function (b, n) {
        return '<div class="mh-hop' + (n <= k ? " sang" : "") + '"><div class="mh-ic">' + b.ic + "</div>" +
          "<b>" + b.ten + "</b><small>" + b.mo + "</small></div>";
      }).join("");
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= B.length - 1) { loi("Cả quá trình này thường xong trong vài phần trăm giây."); return; }
      k++; ve(); loi(B[k].noi);
    };
    node.querySelector('[data-mh="lai"]').onclick = function () { k = -1; ve(); loi("Bấm “Bước tiếp” để đi chặng đầu tiên."); };
    host.appendChild(node); ve();
    loi("Bấm “Bước tiếp” để đi chặng đầu tiên.");
  }

  /* ------------------------------------------------------- ĐĂNG KÝ THEO BÀI */
  /* Khoá là ID bài (C12-21), KHÔNG phải số bài trong tên slug. Slug ghi "bai-5"
     là thuộc tính order, hoàn toàn khác ID — suy ID từ slug là gắn minh hoạ sai
     bài (DNS từng bị gắn vào bài Thiết kế mạng LAN vì lỗi này). */
  var THEO_BAI = {
    "C10-23": nhiPhan,      // Bài 4 lớp 10 — Tính toán với số nhị phân
    "C11-14": timNhiPhan,   // Bài 22 lớp 11 — Thuật toán tìm kiếm nhị phân
    "C11-15": sapXep,       // Bài 23 lớp 11 — Thuật toán sắp xếp
    "C12-21": dns,          // Bài 5 lớp 12 — Từ tên miền đến địa chỉ IP
  };

  /* Cắm vào cuối phần lý thuyết, ngay trước khu luyện tập — đúng chỗ concept-lab
     đang dùng, để bài học không bị chèn hình vào giữa mạch đọc. */
  function injectMinhHoa(lesson) {
    if (!lesson || !THEO_BAI[lesson.id]) return;
    napCss();
    var app = document.getElementById("app");
    if (!app || app.querySelector(".mh")) return;
    var neo = app.querySelector("#conceptLab") || app.querySelector(".lesson-body") || app;
    var host = document.createElement("div");
    neo.appendChild(host);
    try { THEO_BAI[lesson.id](host); }
    catch (e) { host.remove(); console.error("[minh-hoa] Không dựng được:", e); }
  }

  window.injectMinhHoa = injectMinhHoa;
  window.MINH_HOA_CO = Object.keys(THEO_BAI);
})();
