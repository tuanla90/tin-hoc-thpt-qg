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
      ".mh-nhap{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 12px}" +
      ".mh-nhap label{font-size:13px;font-weight:700;color:var(--text-soft)}" +
      /* Chọn bằng ".mh input.mh-o-nhap" (0,2,1) chứ không phải ".mh-o-nhap" (0,1,0):
         styles.css có luật input[type=text]{font-size:14px} với độ ưu tiên 0,1,1 —
         cao hơn một class trơn, nên cỡ chữ 16px sẽ bị đè. Mà dưới 16px thì iOS tự
         phóng to trang lúc chạm vào ô, phóng rồi là kẹt ở trạng thái trượt ngang. */
      ".mh input.mh-o-nhap{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text);" +
        "border-radius:10px;padding:9px 11px;font:700 16px var(--font-mono);min-height:40px;max-width:210px}" +
      ".mh input.mh-o-nhap:focus{outline:none;border-color:var(--primary)}" +
      ".mh input.mh-o-nhap.hep{width:92px}" +
      ".mh-canh{font-size:12.5px;color:var(--accent-amber,#d97706);flex-basis:100%;line-height:1.45}" +
      ".mh-btn{border:1px solid var(--border);background:var(--bg-card);color:var(--text);" +
        "font:700 13.5px var(--font-sans);padding:9px 15px;border-radius:10px;cursor:pointer;min-height:40px}" +
      ".mh-btn:hover{border-color:var(--primary);color:var(--primary)}" +
      ".mh-btn.chinh{background:var(--primary);color:#fff;border-color:var(--primary)}" +
      ".mh-btn.dang{background:var(--accent-amber,#d97706);color:#fff;border-color:var(--accent-amber,#d97706)}" +
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
  function khung(tieuDe, moTa, than, nhap) {
    return '<div class="mh"><h4>' + tieuDe + "</h4><p class=\"mh-mo\">" + moTa + "</p>" +
      (nhap ? '<div class="mh-nhap">' + nhap + "</div>" : "") +
      '<div class="mh-khung">' + than + "</div>" +
      '<div class="mh-thanh"><button class="mh-btn chinh" data-mh="tien">Bước tiếp →</button>' +
      '<button class="mh-btn" data-mh="auto">▶ Tự chạy</button>' +
      '<button class="mh-btn" data-mh="lai">Làm lại</button>' +
      '<span class="mh-loi" data-mh="loi"></span></div></div>';
  }

  /* ------------------------------------------------------------ TỰ CHẠY
     Gắn CHUNG cho cả bốn minh hoạ nên không phải sửa từng cái. Cách biết đã hết
     bước: chụp lại nội dung khung + dòng giải thích trước và sau khi bấm; không
     có gì đổi nghĩa là đã tới trạng thái cuối, tự dừng. Nhờ vậy không cần mỗi
     minh hoạ khai báo riêng "tôi xong rồi". */
  var NHIP = 1000;   // mỗi giây một bước — kịp đọc dòng giải thích

  function ganTuChay(node) {
    var btn = node.querySelector('[data-mh="auto"]');
    var tien = node.querySelector('[data-mh="tien"]');
    var lai = node.querySelector('[data-mh="lai"]');
    var oKhung = node.querySelector(".mh-khung");
    var oLoi = node.querySelector('[data-mh="loi"]');
    if (!btn || !tien) return;
    var hen = null;

    function anh() { return oKhung.innerHTML + "\u0000" + oLoi.innerHTML; }
    function dung() {
      if (hen) { clearInterval(hen); hen = null; }
      btn.textContent = "▶ Tự chạy";
      btn.classList.remove("dang");
    }
    function chay() {
      btn.textContent = "⏸ Tạm dừng";
      btn.classList.add("dang");
      hen = setInterval(function () {
        /* Đổi bài là trang bị dựng lại, node này rời khỏi DOM. Không kiểm thì bộ
           đếm chạy mãi và bấm vào phần tử đã biến mất. */
        if (!node.isConnected) { clearInterval(hen); hen = null; return; }
        var truoc = anh();
        tien.click();
        if (anh() === truoc) dung();   // không còn gì đổi -> hết bước
      }, NHIP);
    }

    btn.onclick = function () { if (hen) dung(); else chay(); };

    /* Học sinh bấm tay hoặc gõ lại dữ liệu thì dừng tự chạy, kẻo hai bên tranh
       nhau. isTrusted phân biệt cú bấm THẬT với cú tien.click() do bộ đếm gọi. */
    tien.addEventListener("click", function (e) { if (e.isTrusted) dung(); });
    if (lai) lai.addEventListener("click", dung);
    node.querySelectorAll(".mh-o-nhap").forEach(function (o) {
      o.addEventListener("input", dung);
    });
  }

  /* Đọc dãy số học sinh gõ vào. Nhận cả "5, 2, 9" lẫn "5 2 9" lẫn "5;2;9" —
     đừng bắt các em nhớ đúng một kiểu dấu phân cách. */
  function docDay(txt, toiDa) {
    return String(txt || "").split(/[^0-9]+/)
      .filter(function (x) { return x !== ""; })
      .map(Number).filter(function (n) { return n >= 0 && n <= 999; })
      .slice(0, toiDa);
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
    var MOI = "Gõ số em muốn đổi, hoặc bấm thẳng vào các ô bit để tự thử.";

    var node = el(khung("Số nhị phân biến thành số thập phân thế nào?",
      "Mỗi ô là một <b>bit</b>, dưới ô là <b>trọng số</b> của nó. Bấm vào ô để bật/tắt bit, " +
      "hoặc gõ một số rồi bấm “Bước tiếp” để xem máy đổi số đó từng bước.",
      '<div class="mh-bits" data-mh="bits"></div><div class="mh-tong" data-mh="tong"></div>',
      '<label for="mhSo">Đổi số:</label>' +
      '<input class="mh-o-nhap hep" id="mhSo" data-mh="so" type="number" min="0" max="255" value="77">' +
      '<span style="font-size:12.5px;color:var(--text-soft)">0–255 (8 bit)</span>'));

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

    function soNhap() {
      var v = Math.floor(Number(node.querySelector('[data-mh="so"]').value));
      if (!isFinite(v) || v < 0) v = 0;
      return Math.min(255, v);   // 8 bit chỉ chứa tới 255
    }
    /* Gõ số mới thì bắt đầu lại từ bit đầu, đừng để dở dang giữa số cũ. */
    node.querySelector('[data-mh="so"]').oninput = function () {
      bit = [0, 0, 0, 0, 0, 0, 0, 0]; buoc = -1; ve();
      loi("Số cần đổi: <b>" + soNhap() + "</b>. Bấm “Bước tiếp”.");
    };

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var goc = soNhap();
      if (buoc < 0) { bit = [0, 0, 0, 0, 0, 0, 0, 0]; muc = goc; buoc = 0; }
      if (buoc >= 8) {
        loi("Xong: <b>" + goc + "</b> = " + bit.join("") + "<sub>2</sub>. Gõ số khác để thử tiếp.");
        return;
      }
      var w = W[buoc], du = muc;
      if (du >= w) { bit[buoc] = 1; muc -= w; loi("Còn <b>" + du + "</b> ≥ " + w + " → bật bit, trừ đi " + w + ", còn <b>" + muc + "</b>."); }
      else { bit[buoc] = 0; loi("Còn <b>" + du + "</b> &lt; " + w + " → bit này để 0."); }
      buoc++; ve();
    };
    node.querySelector('[data-mh="lai"]').onclick = function () {
      bit = [0, 0, 0, 0, 0, 0, 0, 0]; buoc = -1; ve(); loi(MOI);
    };
    host.appendChild(node); ve(); loi(MOI);
  }

  /* ==================================================================
   *  2. TÌM KIẾM NHỊ PHÂN  (C11-14)
   *  Điểm học sinh hay tắc: vì sao "loại một nửa" lại nhanh đến vậy.
   *  Cho thấy vùng còn lại teo đi sau mỗi bước là hiểu ngay.
   * ================================================================ */
  function timNhiPhan(host) {
    var MAC_DINH = [3, 8, 12, 17, 23, 29, 34, 41, 47, 52, 58, 63, 70, 78, 85];
    var A = MAC_DINH.slice();
    var can, lo, hi, xong, soBuoc;

    var node = el(khung("Tìm kiếm nhị phân: vì sao chỉ vài bước là ra?",
      "Dãy phải <b>sắp xếp sẵn</b> — đó là điều kiện bắt buộc, nên dãy em gõ vào sẽ được " +
      "sắp lại trước khi tìm. Mỗi bước nhìn đúng <b>ô giữa</b> rồi bỏ hẳn một nửa; " +
      "để ý vùng sáng teo đi sau mỗi lần bấm.",
      '<div class="mh-mang" data-mh="mang"></div>',
      '<label for="mhTimSo">Tìm số:</label>' +
      '<input class="mh-o-nhap hep" id="mhTimSo" data-mh="can" type="number" min="0" max="999" value="58">' +
      '<label for="mhTimDay">trong dãy:</label>' +
      '<input class="mh-o-nhap" id="mhTimDay" data-mh="day" type="text" ' +
      'value="3 8 12 17 23 29 34 41 47 52 58 63 70 78 85">' +
      '<span class="mh-canh" data-mh="canh" hidden></span>'));

    /* Đọc dãy người nhập rồi SẮP LẠI — nói rõ đã sắp, để các em không tưởng thuật
       toán này chạy được trên dãy lộn xộn. Thử tìm một số KHÔNG có trong dãy cũng
       là bài học: vùng tìm teo về rỗng. */
    function docNhap() {
      var v = docDay(node.querySelector('[data-mh="day"]').value, 20);
      var canh = node.querySelector('[data-mh="canh"]');
      if (v.length < 2) { A = MAC_DINH.slice(); canh.hidden = true; }
      else {
        var truoc = v.join(" ");
        A = v.slice().sort(function (x, y) { return x - y; });
        canh.hidden = (A.join(" ") === truoc);
        canh.innerHTML = "Dãy em gõ chưa sắp xếp — đã tự sắp thành: " + A.join(" ");
      }
      can = Math.floor(Number(node.querySelector('[data-mh="can"]').value)) || 0;
    }

    function dat() { docNhap(); lo = 0; hi = A.length - 1; xong = false; soBuoc = 0; }
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

    /* Số bước tối đa của dò tuần tự = vị trí của số trong dãy (1-based); không có
       thì phải quét hết. So sánh với con số THẬT của dãy này, đừng ghi cứng 11. */
    function buocTuanTu() {
      var i = A.indexOf(can);
      return i < 0 ? A.length : i + 1;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (xong) { loi("Đã xong sau <b>" + soBuoc + "</b> bước. Dò từng ô sẽ mất tới <b>" + buocTuanTu() + "</b> bước."); return; }
      if (lo > hi) {
        loi("Vùng tìm đã teo về <b>rỗng</b> → dãy này <b>không có</b> số " + can +
            ". Chỉ mất <b>" + soBuoc + "</b> bước để chắc chắn điều đó.");
        xong = true; ve(-1); return;
      }
      var g = Math.floor((lo + hi) / 2); soBuoc++;
      if (A[g] === can) {
        xong = true; ve(g);
        loi("A[" + g + "] = <b>" + can + "</b> → tìm thấy sau <b>" + soBuoc + "</b> bước. " +
            "Dò tuần tự từ đầu sẽ mất <b>" + buocTuanTu() + "</b> bước.");
      } else if (A[g] < can) {
        loi("A[" + g + "] = " + A[g] + " &lt; " + can + " → số cần nằm bên <b>phải</b>, bỏ nửa trái.");
        lo = g + 1; ve(g);
      } else {
        loi("A[" + g + "] = " + A[g] + " &gt; " + can + " → số cần nằm bên <b>trái</b>, bỏ nửa phải.");
        hi = g - 1; ve(g);
      }
    };
    function lamLai() { dat(); ve(-1); loi("Tìm <b>" + can + "</b> trong " + A.length + " số. Bấm “Bước tiếp” để nhìn ô giữa."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="can"]').oninput = lamLai;
    node.querySelector('[data-mh="day"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  }

  /* ==================================================================
   *  3. SẮP XẾP NỔI BỌT  (C11-15)
   *  Mỗi bước là MỘT phép so sánh, không phải một lượt — để thấy vì sao
   *  số phép so sánh lớn lên rất nhanh theo độ dài dãy.
   * ================================================================ */
  function sapXep(host) {
    var MAC_DINH = [5, 2, 9, 1, 7, 3];
    var GOC = MAC_DINH.slice();
    var A, i, j, soSanh, doi, xong;

    var node = el(khung("Sắp xếp nổi bọt: từng phép so sánh một",
      "Mỗi lần bấm là <b>một</b> phép so sánh hai ô cạnh nhau; sai thứ tự thì đổi chỗ. " +
      "Số lớn “nổi” dần về cuối — ô đã đúng chỗ chuyển sang màu xanh. " +
      "Thử gõ dãy <b>đã sắp sẵn</b> rồi đếm số phép so sánh, so với dãy <b>ngược</b>.",
      '<div class="mh-mang" data-mh="mang"></div>',
      '<label for="mhDay">Dãy của em:</label>' +
      '<input class="mh-o-nhap" id="mhDay" data-mh="day" type="text" value="5 2 9 1 7 3">' +
      '<span style="font-size:12.5px;color:var(--text-soft)">2–10 số, cách nhau dấu cách</span>'));

    function dat() {
      var v = docDay(node.querySelector('[data-mh="day"]').value, 10);
      GOC = v.length >= 2 ? v : MAC_DINH.slice();
      A = GOC.slice(); i = 0; j = 0; soSanh = 0; doi = 0; xong = false;
    }
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
      if (xong) { loi("Xong: <b>" + soSanh + "</b> phép so sánh, <b>" + doi + "</b> lần đổi chỗ cho " + A.length + " số."); return; }
      if (j >= A.length - 1 - i) {
        i++; j = 0;
        if (i >= A.length - 1) {
          xong = true; ve(-1, -1);
          loi("Xong: <b>" + soSanh + "</b> phép so sánh, <b>" + doi + "</b> lần đổi chỗ cho " +
              A.length + " số. Dãy dài gấp đôi sẽ tốn khoảng <b>gấp bốn</b> — đó là ý nghĩa của O(n²).");
          return;
        }
      }
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
    function lamLai() { dat(); ve(-1, -1); loi("Dãy " + A.length + " số. Bấm “Bước tiếp” để so sánh cặp đầu tiên."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="day"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  }

  /* ==================================================================
   *  4. TỪ TÊN MIỀN ĐẾN ĐỊA CHỈ IP  (C12-05)
   *  Học sinh hay tưởng gõ tên miền là "vào thẳng". Cho thấy có mấy
   *  chặng hỏi đáp ở giữa, và vì sao lần sau lại nhanh hơn (bộ nhớ đệm).
   * ================================================================ */
  function dns(host) {
    /* CHỈ giữ biểu tượng ở đây. Nhãn và lời giải thích phải sinh theo tên miền
       người gõ — trước đây nhãn đậm đóng cứng "Máy chủ .net" nên gõ tên miền .vn
       vẫn hiện .net, trông như minh hoạ chẳng có logic gì. */
    var IC = ["🌐", "📇", "🌱", "🏷️", "📮", "✅"];
    var k = -1;
    var node = el(khung("Gõ một tên miền, máy tính tìm nhau thế nào?",
      "Máy tính chỉ liên lạc được bằng <b>địa chỉ IP</b> (dãy số), còn người thì nhớ <b>tên miền</b> (chữ). " +
      "Ở giữa là mấy chặng hỏi đáp mà ta không nhìn thấy — gõ tên miền em hay vào rồi bấm từng chặng. " +
      "<i>Đây là sơ đồ mô tả quy trình chuẩn, không phải một lần tra cứu thật: trang web không có " +
      "cách nào tự đi hỏi máy chủ gốc để cho em xem.</i>",
      '<div class="mh-nut" data-mh="nut"></div>',
      '<label for="mhTen">Tên miền:</label>' +
      '<input class="mh-o-nhap" id="mhTen" data-mh="ten" type="text" value="vnexpress.net" style="max-width:260px">' +
      '<span class="mh-canh" data-mh="canh" hidden></span>'));

    /* Đuôi tên miền quyết định chặng thứ 4 hỏi ai, nên phải lấy từ chữ người gõ.
       Gõ có "https://" hay "/tin-tuc" thì cắt bỏ, đừng bắt các em gõ đúng chuẩn. */
    function phanTich() {
      var t = String(node.querySelector('[data-mh="ten"]').value || "").trim().toLowerCase();
      /* Cắt giao thức, đường dẫn, "www." và SỐ CỔNG — đừng bắt các em gõ đúng chuẩn. */
      t = t.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").split(/[/?#]/)[0].replace(/^www\./, "").replace(/:\d+$/, "");
      var p = t.split(".").filter(Boolean);
      if (!t) return { ten: "vnexpress.net", duoi: "net", vi: "" };
      /* Không có dấu chấm ("localhost", "localhost:3000") thì KHÔNG phải tên miền
         nhiều cấp — nói thẳng, thay vì bịa ra đuôi .net như bản trước. */
      if (/^\d+(\.\d+){3}$/.test(t)) return { tho: t, ten: t, duoi: "", vi: "la-ip" };
      if (p.length < 2) return { tho: t, ten: t, duoi: "", vi: "khong-duoi" };
      return { tho: t, ten: p.join("."), duoi: p[p.length - 1], vi: "" };
    }

    function ve() {
      var pt = phanTich(), ten = pt.ten, d = pt.duoi;
      var canh = node.querySelector('[data-mh="canh"]');
      if (pt.vi === "khong-duoi") {
        canh.hidden = false;
        canh.innerHTML = "<b>" + pt.tho + "</b> không có đuôi tên miền nên DNS không tra theo đường này — " +
          "tên kiểu đó chỉ có nghĩa trong máy hoặc trong mạng nội bộ. Thử một tên miền thật, " +
          "ví dụ tên miền trường em.";
      } else if (pt.vi === "la-ip") {
        canh.hidden = false;
        canh.innerHTML = "Em vừa gõ sẵn một <b>địa chỉ IP</b> — khỏi cần tra DNS, trình duyệt kết nối " +
          "được luôn. Đó chính là thứ mà cả quá trình này đi tìm.";
      } else { canh.hidden = true; }

      /* Nhãn ĐẬM cũng phải sinh theo tên miền, không chỉ dòng nhỏ bên dưới. */
      var tenTld = d ? "Máy chủ ." + d : "Máy chủ đuôi";
      var TEN = ["Trình duyệt", "Máy chủ DNS", "Máy chủ gốc", tenTld, "Máy chủ quản lý", "Có IP"];
      var nhan = [ten, "của nhà mạng", "root", d ? "." + d : "—", ten, "kết nối"];
      var noi = [
        "Trình duyệt chưa biết địa chỉ số của <b>" + ten + "</b>, nên đi hỏi.",
        "Hỏi máy chủ DNS nhà mạng. Nếu nó vừa tra hộ ai đó, nó trả lời ngay từ <b>bộ nhớ đệm</b>.",
        "Chưa có trong đệm → hỏi máy chủ gốc. Gốc không biết địa chỉ, chỉ chỉ đường: “hỏi bên quản lý <b>." + d + "</b>”.",
        "Bên quản lý đuôi <b>." + d + "</b> cũng không giữ địa chỉ, nhưng biết ai quản lý <b>" + ten + "</b>.",
        "Đây mới là nơi giữ bản ghi thật của <b>" + ten + "</b>, trả về <b>địa chỉ IP</b>.",
        "Có IP rồi, trình duyệt mới thật sự kết nối tới <b>" + ten + "</b>. Địa chỉ được nhớ tạm, nên lần sau vào lại nhanh hơn hẳn.",
      ];
      node.querySelector('[data-mh="nut"]').innerHTML = IC.map(function (ic, n) {
        return '<div class="mh-hop' + (n <= k ? " sang" : "") + '"><div class="mh-ic">' + ic + "</div>" +
          "<b>" + TEN[n] + "</b><small>" + nhan[n] + "</small></div>";
      }).join("");
      return noi;
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= IC.length - 1) { loi("Cả quá trình này thường xong trong vài phần trăm giây."); return; }
      k++; loi(ve()[k]);
    };
    function lamLai() { k = -1; ve(); loi("Tra <b>" + phanTich().ten + "</b>. Bấm “Bước tiếp” để đi chặng đầu tiên."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="ten"]').oninput = lamLai;
    host.appendChild(node); lamLai();
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
    try {
      THEO_BAI[lesson.id](host);
      var node = host.querySelector(".mh");
      if (node) ganTuChay(node);
    } catch (e) { host.remove(); console.error("[minh-hoa] Không dựng được:", e); }
  }

  window.injectMinhHoa = injectMinhHoa;

  /* Mở khung dựng ra ngoài để minh hoạ mới đăng ký từ tệp khác, khỏi dồn hết vào
     một tệp nghìn dòng. injectMinhHoa đọc THEO_BAI lúc gọi nên đăng ký muộn vẫn
     kịp, và minh hoạ nào cũng tự có nút Tự chạy vì ganTuChay gắn ở một chỗ. */
  window.MinhHoa = {
    khung: khung,
    el: el,
    docDay: docDay,
    napCss: napCss,
    dangKy: function (id, fn) { THEO_BAI[id] = fn; },
    coBai: function () { return Object.keys(THEO_BAI); },
    /* Dựng vào một phần tử chỉ định. Trang công khai /bai/<slug> không có #app
       nên injectMinhHoa không dùng được ở đó — dùng hàm này. */
    veVao: function (host, id) {
      if (!host || !THEO_BAI[id]) return false;
      napCss();
      try {
        THEO_BAI[id](host);
        var n = host.querySelector(".mh");
        if (n) ganTuChay(n);
        return true;
      } catch (e) { console.error("[minh-hoa] Không dựng được:", e); return false; }
    },
  };
})();
