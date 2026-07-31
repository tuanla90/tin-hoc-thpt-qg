/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 6: năm bài đang TRẮNG HOÀN TOÀN (không mô phỏng, không
 *  sơ đồ) — ưu tiên bài có NGỘ NHẬN rõ và mô phỏng bấm-từng-bước trị được tận
 *  gốc, không phải làm cho đủ số.
 *
 *  Dùng khung dựng của js/minh-hoa.js (nạp SAU tệp đó), và mượn CSS mảng/ô
 *  (.mh-mang/.mh-o) từ minh-hoa.js, khối code có dòng highlight (.mh3-code/
 *  .mh3-d) từ minh-hoa-3.js, khối so sánh hai biến (.mh5-khung/.mh5-k) từ
 *  minh-hoa-5.js — cả ba tệp đó tự nạp CSS lúc module chạy (không lười), nên
 *  luôn có sẵn khi tệp này thực thi.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss6() {
    if (document.getElementById("mhCss6")) return;
    var st = document.createElement("style");
    st.id = "mhCss6";
    st.textContent =
      /* --- mảng có nhãn CHỈ SỐ ngay dưới mỗi ô — .mh-o gốc không có nhãn này --- */
      ".mh6-mang{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}" +
      ".mh6-c{display:flex;flex-direction:column;align-items:center;gap:4px}" +
      ".mh6-idx{font:700 11px var(--font-mono);color:var(--text-soft)}" +
      ".mh6-idx.nay{color:var(--primary);font-weight:800}" +
      ".mh6-idx2{font:600 10px var(--font-mono);color:var(--text-soft);opacity:.6}" +
      /* --- ma trận (mảng hai chiều) --- */
      ".mh6-mtwrap{display:flex;justify-content:center;overflow-x:auto}" +
      ".mh6-mt{border-collapse:separate;border-spacing:5px}" +
      ".mh6-mt td{width:44px;height:38px;text-align:center;border-radius:8px;" +
        "border:2px solid var(--border);background:var(--bg-card);font:700 13px var(--font-mono);" +
        "transition:all .25s}" +
      ".mh6-mt td.hd{border:none;background:transparent;color:var(--text-soft);font:700 11px var(--font-sans)}" +
      ".mh6-mt td.nay{border-color:var(--primary);background:var(--primary-soft);color:var(--primary);transform:scale(1.08)}" +
      ".mh6-mt td.xong{border-color:var(--success);background:var(--success-soft);color:var(--success)}" +
      ".mh6-mt td.hang-nay{background:color-mix(in srgb, var(--primary) 7%, transparent)}" +
      /* --- dòng trạng thái i / j / tổng --- */
      ".mh6-so{text-align:center;margin-top:11px;font:700 13px var(--font-mono);color:var(--text-soft)}" +
      ".mh6-so b{color:var(--primary)}" +
      ".mh6-ghi{margin:11px auto 0;max-width:440px;border-radius:9px;padding:9px 11px;font-size:12.5px;" +
        "line-height:1.55;background:var(--warning-soft);color:var(--text);border:1px solid var(--warning)}" +
      ".mh6-ghi.xong{background:var(--success-soft);border-color:var(--success)}" +
      ".mh6-tick{display:inline-flex;align-items:center;gap:6px;font:700 12.5px var(--font-sans);color:var(--text-soft);cursor:pointer}" +
      ".mh6-tick input{accent-color:var(--primary);width:16px;height:16px}" +
      /* --- kiểu dữ liệu --- */
      ".mh6-kdl{display:inline-block;font:800 11px var(--font-mono);padding:2px 8px;border-radius:999px;" +
        "background:var(--bg-soft);border:1px solid var(--border);margin-left:6px}" +
      ".mh6-kdl.str{color:#d97706;border-color:#d97706;background:var(--warning-soft)}" +
      ".mh6-kdl.int{color:var(--primary);border-color:var(--primary);background:var(--primary-soft)}" +
      "@media (max-width:480px){.mh6-mt td{width:34px;height:32px;font-size:11.5px}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function loiCua(node) { return function (t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }; }
  function ganDatLai(node, ds, lamLai) {
    var lai = node.querySelector('[data-mh="lai"]');
    lai.onclick = lamLai;
    ds.forEach(function (o) {
      if (!o) return;
      var su = o.tagName === "SELECT" || o.type === "checkbox" ? "change" : "input";
      o.addEventListener(su, function () { lai.click(); });
    });
  }

  /* ==================================================================
   *  C11-12 · MẢNG MỘT CHIỀU — TÌM GIÁ TRỊ LỚN NHẤT VÀ VỊ TRÍ CỦA NÓ
   *
   *  NGỘ NHẬN đắt nhất của bài: đề luôn hỏi "vị trí của giá trị lớn nhất", mà
   *  học sinh chỉ cập nhật max mà QUÊN cập nhật vị trí đi kèm — vì hai lệnh gán
   *  đứng cạnh nhau trong code nhưng khi ĐỌC thì mắt chỉ dừng ở a[i] > max, dòng
   *  vi_tri = i bị bỏ qua. Mô phỏng buộc thấy CẢ HAI được gán CÙNG một lúc.
   *  Nhãn chỉ số 0,1,2... đặt NGAY DƯỚI mỗi ô — không đợi tới cuối mới nói
   *  "chỉ số bắt đầu từ 0", mà để nó luôn hiện diện suốt quá trình bấm.
   * ================================================================ */
  MH.dangKy("C11-12", function (host) {
    napCss6();
    var MAC_DINH = [12, 45, 7, 89, 34, 61, 23];
    var A, i, max, viTri, xong;

    var node = MH.el(MH.khung("Tìm giá trị lớn nhất — và VỊ TRÍ của nó",
      "Đề hay hỏi cả hai: <b>giá trị</b> lớn nhất và <b>vị trí</b> (chỉ số) của nó trong mảng. " +
      "Bấm từng bước để xem hai thứ này được cập nhật <b>cùng lúc</b> — quên cập nhật vị trí là lỗi hay gặp nhất của bài.",
      '<div class="mh6-mang" data-mh="mang"></div><div class="mh6-so" data-mh="so"></div>' +
      '<div class="mh6-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhMangA">Mảng a:</label>' +
      '<input class="mh-o-nhap" id="mhMangA" data-mh="day" type="text" value="12 45 7 89 34 61 23" style="max-width:260px">'));

    var loi = loiCua(node);
    function dat() {
      var v = MH.docDay(node.querySelector('[data-mh="day"]').value, 12);
      A = v.length >= 2 ? v : MAC_DINH.slice();
      i = -1; max = null; viTri = null; xong = false;
    }
    function ve() {
      node.querySelector('[data-mh="mang"]').innerHTML = A.map(function (v, n) {
        var oCls = "mh-o";
        if (n === viTri) oCls += xong ? " thay" : " giua";
        else if (n === i && n !== viTri) oCls += " doi";
        else if (n < i || (i < 0 && n === 0)) oCls += n <= i ? " ngoai" : "";
        var idxCls = "mh6-idx" + (n === i ? " nay" : "");
        return '<div class="mh6-c"><div class="' + oCls + '">' + v + '</div>' +
          '<div class="' + idxCls + '">' + n + "</div></div>";
      }).join("");
      node.querySelector('[data-mh="so"]').innerHTML = i < 0
        ? "Chưa xét ô nào."
        : "max hiện tại = <b>" + max + "</b> · vị trí hiện tại = <b>" + viTri + "</b>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (!xong) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh6-ghi xong";
      ghi.innerHTML = "Giá trị lớn nhất là <b>" + max + "</b>, ở <b>vị trí (chỉ số) " + viTri + "</b> — " +
        "tức phần tử thứ <b>" + (viTri + 1) + "</b> nếu đếm theo thói quen thường ngày, vì <b>chỉ số luôn bắt đầu từ 0</b>. " +
        "Hai dòng <code>max = a[i]</code> và <code>vi_tri = i</code> phải đi <b>CÙNG NHAU</b> trong thân điều kiện — " +
        "thiếu dòng sau là bài chỉ đúng một nửa, sai đúng chỗ đề chấm điểm.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (xong) { loi("Đã duyệt hết mảng. Bấm “Làm lại” để thử mảng khác."); return; }
      if (i < 0) {
        i = 0; max = A[0]; viTri = 0; ve();
        loi("<b>Khởi tạo</b>: coi ô đầu tiên là lớn nhất tạm thời → <code>max = a[0] = " + A[0] +
          "</code>, <code>vi_tri = 0</code>. Giờ so các ô còn lại với nó.");
        return;
      }
      if (i >= A.length - 1) { xong = true; ve(); loi("Đã xét hết " + A.length + " ô."); return; }
      i++;
      if (A[i] > max) {
        max = A[i]; viTri = i; ve();
        loi("<code>a[" + i + "] = " + A[i] + "</code> <b>lớn hơn</b> max hiện tại → cập nhật CẢ HAI: " +
          "<code>max = " + max + "</code> và <code>vi_tri = " + viTri + "</code>.");
      } else {
        ve();
        loi("<code>a[" + i + "] = " + A[i] + "</code> không lớn hơn max (" + max + ") → " +
          "giữ nguyên, không đổi gì.");
      }
    };
    function lamLai() { dat(); ve(); loi("Bấm “Bước tiếp” để bắt đầu duyệt mảng gồm " + A.length + " phần tử."); }
    ganDatLai(node, [node.querySelector('[data-mh="day"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-28 · MẢNG HAI CHIỀU — TỔNG ĐIỂM TỪNG HÀNG
   *
   *  NGỘ NHẬN: lộn i (hàng) với j (cột), tưởng vòng lặp NGOÀI chạy nhanh còn
   *  vòng TRONG chạy chậm — thật ra ngược lại: i (ngoài) đứng yên trong khi j
   *  (trong) chạy hết một lượt, xong mới sang i tiếp theo. Bảng ma trận tô màu
   *  nguyên HÀNG đang xét để mắt thấy rõ "i cố định, j chạy" chứ không phải chỉ
   *  đọc qua code.
   * ================================================================ */
  MH.dangKy("C11-28", function (host) {
    napCss6();
    var MT = [[8, 7, 9], [6, 8, 7], [9, 9, 8]];
    var MON = ["Toán", "Văn", "Anh"];
    var i, j, tongHang, ketQua;

    var node = MH.el(MH.khung("Mảng hai chiều: tổng điểm từng học sinh",
      "<b>i</b> là <b>hàng</b> (học sinh), <b>j</b> là <b>cột</b> (môn). Vòng <b>i</b> ở ngoài nên <b>đứng yên</b> " +
      "suốt khi vòng <b>j</b> ở trong chạy hết một lượt — không phải ngược lại. Bấm từng bước để tính tổng điểm mỗi học sinh.",
      '<div class="mh6-mtwrap"><table class="mh6-mt" data-mh="mt"></table></div>' +
      '<div class="mh6-so" data-mh="so"></div><div class="mh6-ghi" data-mh="ghi" hidden></div>'));

    var loi = loiCua(node);
    function dat() { i = -1; j = -1; tongHang = 0; ketQua = []; }
    function ve() {
      var h = "<tr><td class=\"hd\"></td>" + MON.map(function (m) { return '<td class="hd">' + m + "</td>"; }).join("") + "</tr>";
      MT.forEach(function (hang, r) {
        h += "<tr><td class=\"hd\">HS" + (r + 1) + "</td>";
        hang.forEach(function (v, c) {
          var cls = "";
          if (r === i && c === j) cls = "nay";
          else if (r === i && c < j) cls = "hang-nay";
          else if (r < i || (r === i && ketQua[r] != null)) cls = "xong";
          h += '<td class="' + cls + '">' + v + "</td>";
        });
        h += "</tr>";
      });
      node.querySelector('[data-mh="mt"]').innerHTML = h;
      node.querySelector('[data-mh="so"]').innerHTML = i < 0
        ? "Chưa xét học sinh nào."
        : "i (hàng) = <b>" + i + "</b> · j (cột) = <b>" + (j < 0 ? "—" : j) + "</b> · tổng đang cộng dồn = <b>" + tongHang + "</b>" +
          (ketQua.length ? "<br>" + ketQua.map(function (t, n) { return "HS" + (n + 1) + " = <b>" + t + "</b>"; }).join(" · ") : "");

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (ketQua.length < MT.length) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh6-ghi xong";
      ghi.innerHTML = "Xong cả ba học sinh: " + ketQua.map(function (t, n) { return "HS" + (n + 1) + " = <b>" + t + "</b>"; }).join(", ") + ". " +
        "Nhìn lại: mỗi lần <b>i</b> tăng (sang học sinh mới) thì <b>j chạy lại từ 0</b> và <b>tổng phải reset về 0</b> — " +
        "quên reset tổng là lỗi hay gặp thứ hai của dạng bài này, sau lỗi lộn i/j.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (ketQua.length >= MT.length) { loi("Đã tính xong cả " + MT.length + " học sinh. Bấm “Làm lại” để xem lại."); return; }
      if (i < 0 || j >= MT[i].length - 1) {
        i++; j = -1; tongHang = 0;
        ve();
        loi("Sang học sinh mới: <b>i = " + i + "</b> (HS" + (i + 1) + "). Đặt lại <code>tong = 0</code>, rồi cho <b>j</b> chạy từ 0.");
        return;
      }
      j++;
      tongHang += MT[i][j];
      ve();
      loi("<code>a[" + i + "][" + j + "]</code> = điểm " + MON[j] + " của HS" + (i + 1) + " = <b>" + MT[i][j] +
        "</b> → cộng dồn: <code>tong = " + tongHang + "</code>." +
        (j === MT[i].length - 1 ? " Hết môn — lưu <code>ketQua[" + i + "] = " + tongHang + "</code>." : ""));
      if (j === MT[i].length - 1) { ketQua[i] = tongHang; ve(); }
    };
    function lamLai() { dat(); ve(); loi("Bấm “Bước tiếp” để bắt đầu tính tổng điểm từng học sinh."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-34 · BIẾN CỤC BỘ, TOÀN CỤC VÀ LỆNH GLOBAL
   *
   *  NGỘ NHẬN: "gán biến trong hàm mà trùng tên biến ngoài thì đổi luôn biến
   *  ngoài". SAI với Python — không có global thì Python coi đó là một biến
   *  CỤC BỘ MỚI, đè lên biến ngoài trong phạm vi hàm rồi biến mất khi hàm kết
   *  thúc, biến ngoài giữ nguyên. Đặt cạnh phiên bản CÓ global để thấy khác biệt
   *  chỉ nằm ở đúng MỘT DÒNG mà kết quả lại ngược hẳn nhau.
   * ================================================================ */
  MH.dangKy("C10-34", function (host) {
    napCss6();
    var BUOC_KHONG = [
      { t: "diem = 5", p: "Biến <b>toàn cục</b> <b>diem</b> được tạo, giá trị 5.", ng: "diem = 5" },
      { t: "goi doi_diem()", p: "Gọi hàm — bước vào bên trong.", ng: "diem = 5" },
      { t: "diem = 10", p: "Trong hàm, không có <code>global</code> → Python tạo <b>biến CỤC BỘ mới</b> cũng tên " +
        "<b>diem</b>, HOÀN TOÀN TÁCH biệt với biến ngoài.", ng: "diem = 5", tr: "diem (cục bộ) = 10" },
      { t: "hàm kết thúc", p: "Biến cục bộ <b>diem</b> biến mất theo hàm. Biến toàn cục chưa từng bị đụng tới.", ng: "diem = 5" },
      { t: "print(diem)", p: "In ra <b>5</b> — biến toàn cục <b>không đổi</b>, dù trong hàm đã có dòng <code>diem = 10</code>.", ng: "diem = 5", kq: "5" },
    ];
    var BUOC_CO = [
      { t: "diem = 5", p: "Biến <b>toàn cục</b> <b>diem</b> được tạo, giá trị 5.", ng: "diem = 5" },
      { t: "goi doi_diem()", p: "Gọi hàm — bước vào bên trong.", ng: "diem = 5" },
      { t: "global diem", p: "Dòng khai báo này nói với Python: “<b>diem</b> trong hàm này là <b>chính biến toàn cục</b>, đừng tạo bản mới”.", ng: "diem = 5", tr: "(không tạo biến cục bộ)" },
      { t: "diem = 10", p: "Vì đã khai <code>global</code>, dòng này <b>sửa thẳng</b> biến toàn cục.", ng: "diem = 10", tr: "(cùng một biến diem)", chung: true },
      { t: "print(diem)", p: "In ra <b>10</b> — biến toàn cục <b>đã đổi thật</b>.", ng: "diem = 10", kq: "10" },
    ];
    var k, coGlobal;

    var node = MH.el(MH.khung("Gán biến trùng tên trong hàm — có đổi biến ngoài không?",
      "Hai hàm chỉ khác nhau <b>một dòng duy nhất</b>: có hay không có <code>global diem</code>. " +
      "Chạy hết bên này rồi tích ô để chạy bên kia — so dòng <b>print</b> cuối cùng.",
      '<div class="mh3-code" data-mh="code" style="max-width:320px;margin-bottom:12px"></div>' +
      '<div class="mh5-khung" data-mh="khung"></div>' +
      '<div class="mh6-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh6-tick"><input type="checkbox" data-mh="gb"> dùng <b>global</b></label>'));

    var loi = loiCua(node);
    function buoc() { return coGlobal ? BUOC_CO : BUOC_KHONG; }

    function ve() {
      var ds = buoc();
      var ma = coGlobal
        ? ["diem = 5", "", "def doi_diem():", "    global diem", "    diem = 10", "", "doi_diem()", "print(diem)"]
        : ["diem = 5", "", "def doi_diem():", "    diem = 10", "", "doi_diem()", "print(diem)"];
      var dongTheoBuoc = coGlobal ? [0, 6, 3, 4, 7] : [0, 5, 3, 3, 6];
      var dongNay = k < 0 ? -1 : dongTheoBuoc[Math.min(k, dongTheoBuoc.length - 1)];
      node.querySelector('[data-mh="code"]').innerHTML = ma.map(function (d, i) {
        return '<div class="mh3-d' + (i === dongNay ? " nay" : "") + '">' + esc(d) + "</div>";
      }).join("");

      var b = k >= 0 ? ds[k] : null;
      var h = '<div class="mh5-k' + (b && !b.tr ? " nay" : "") + '"><b>Biến toàn cục</b><small>' +
        (b ? esc(b.ng) : "chưa có gì") + "</small></div>";
      if (b && b.tr) {
        h += '<div class="mh5-k nay' + (b.chung ? " chung" : "") + '"><b>Trong hàm</b><small>' +
          esc(b.tr) + (b.chung ? " — <b>cùng một biến!</b>" : "") + "</small></div>";
      }
      if (b && b.kq) h += '<div class="mh5-k nay"><b>Màn hình in ra</b><small>' + esc(b.kq) + "</small></div>";
      node.querySelector('[data-mh="khung"]').innerHTML = h;

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < ds.length - 1) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh6-ghi" + (coGlobal ? " xong" : "");
      ghi.innerHTML = coGlobal
        ? "Với <code>global diem</code>, dòng <code>diem = 10</code> bên trong hàm sửa <b>thẳng</b> biến toàn cục — " +
          "in ra <b>10</b>. Đây là cách <b>DUY NHẤT</b> để một hàm gán lại (không chỉ sửa nội dung) một biến toàn cục."
        : "KHÔNG có <code>global</code>, Python coi <code>diem = 10</code> trong hàm là tạo <b>biến cục bộ mới</b>, " +
          "dù trùng tên với biến ngoài. Biến toàn cục <b>không hề bị đụng tới</b>, nên vẫn in ra <b>5</b>. " +
          "Tích ô <b>“dùng global”</b> ở trên rồi chạy lại để thấy kết quả đảo ngược.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var ds = buoc();
      if (k >= ds.length - 1) {
        loi(coGlobal ? "Bỏ tích ô rồi chạy lại để so với trường hợp KHÔNG có global."
                     : "Tích ô <b>“dùng global”</b> ở trên rồi chạy lại — chú ý dòng in ra cuối cùng.");
        return;
      }
      k++; ve(); loi(ds[k].p);
    };
    function lamLai() {
      coGlobal = node.querySelector('[data-mh="gb"]').checked;
      k = -1; ve();
      loi("Chưa chạy dòng nào. Bấm “Bước tiếp” để bắt đầu.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="gb"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-18 · XÂU KÍ TỰ — CHỈ SỐ VÀ CẮT LÁT s[a:b]
   *
   *  NGỘ NHẬN đắt nhất: cắt lát s[a:b] thì LẤY ĐẾN kí tự tại chỉ số b. Sai —
   *  cận trên LUÔN LUÔN KHÔNG được lấy, s[a:b] chỉ lấy tới chỉ số b-1. Mỗi kí
   *  tự hiện CẢ chỉ số dương lẫn chỉ số âm cùng lúc, để hai cách đếm (từ đầu /
   *  từ cuối) không còn là hai thế giới tách biệt.
   * ================================================================ */
  MH.dangKy("C10-18", function (host) {
    napCss6();
    var s = "PYTHON";
    var a, b;

    var node = MH.el(MH.khung("Cắt lát xâu s[a:b] — lấy đến đâu là hết?",
      "Xâu mặc định <b>\"" + s + "\"</b>, dài " + s.length + " kí tự. Đổi <b>a</b> và <b>b</b> rồi bấm “Bước tiếp” " +
      "để tô những kí tự nằm trong <code>s[a:b]</code> — chú ý ô có chỉ số <b>đúng bằng b</b> KHÔNG được tô.",
      '<div class="mh6-mang" data-mh="mang"></div>' +
      '<div class="mh6-so" data-mh="so"></div><div class="mh6-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhCatA">a =</label>' +
      '<input class="mh-o-nhap hep" id="mhCatA" data-mh="a" type="number" min="0" max="' + (s.length - 1) + '" value="1">' +
      '<label for="mhCatB">b =</label>' +
      '<input class="mh-o-nhap hep" id="mhCatB" data-mh="b" type="number" min="0" max="' + s.length + '" value="4">'));

    var loi = loiCua(node);
    function dat() {
      a = Math.max(0, Math.min(s.length, Math.floor(Number(node.querySelector('[data-mh="a"]').value)) || 0));
      b = Math.max(0, Math.min(s.length, Math.floor(Number(node.querySelector('[data-mh="b"]').value)) || 0));
    }
    function ve(hienKq) {
      node.querySelector('[data-mh="mang"]').innerHTML = s.split("").map(function (ch, n) {
        var trongLat = n >= a && n < b;
        var oCls = "mh-o" + (hienKq && trongLat ? " thay" : n === a || n === b ? " giua" : "");
        return '<div class="mh6-c">' +
          '<div class="mh6-idx2">' + (n - s.length) + "</div>" +
          '<div class="' + oCls + '">' + ch + "</div>" +
          '<div class="mh6-idx' + (n === a || n === b ? " nay" : "") + '">' + n + "</div></div>";
      }).join("");
      var ketQua = s.slice(a, b);
      node.querySelector('[data-mh="so"]').innerHTML = "<code>s[" + a + ":" + b + "]</code> = <b>\"" + esc(ketQua) + "\"</b>" +
        (ketQua ? " (" + ketQua.length + " kí tự)" : " (rỗng)");

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !hienKq;
      if (!hienKq) return;
      ghi.className = "mh6-ghi xong";
      var coChuB = b < s.length ? "kí tự \"" + s[b] + "\" ở chỉ số " + b : "(b chạm cuối xâu, không còn kí tự nào để loại)";
      ghi.innerHTML = "Lấy từ chỉ số <b>" + a + "</b> đến TRƯỚC chỉ số <b>" + b + "</b>, tức các chỉ số <b>" +
        (b > a ? a + " → " + (b - 1) : "(không có, vì a ≥ b)") + "</b>. " +
        "Chỉ số <b>" + b + "</b> — " + coChuB + " — <b>KHÔNG</b> nằm trong kết quả. " +
        "Muốn lấy ĐẾN HẾT kí tự đó thì phải viết <code>s[" + a + ":" + (b + 1) + "]</code>. " +
        "Nhãn nhỏ phía trên mỗi ô là <b>chỉ số âm</b> (đếm từ cuối): <code>s[-1]</code> luôn là kí tự cuối cùng, " +
        "dù xâu dài bao nhiêu.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var dangHien = !node.querySelector('[data-mh="ghi"]').hidden;
      if (dangHien) { loi("Đổi <b>a</b>/<b>b</b> ở trên rồi bấm “Bước tiếp” để xem lát cắt khác."); return; }
      ve(true);
      loi("Đã tô các kí tự thuộc <code>s[" + a + ":" + b + "]</code>.");
    };
    function lamLai() { dat(); ve(false); loi("Bấm “Bước tiếp” để tô các kí tự thuộc s[" + a + ":" + b + "]."); }
    ganDatLai(node, ["a", "b"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-12 · BIẾN VÀ KIỂU DỮ LIỆU — input() LUÔN TRẢ VỀ CHUỖI
   *
   *  NGỘ NHẬN phổ biến nhất của người mới học Python: gõ số vào input() thì máy
   *  tự hiểu là số. SAI — input() LUÔN trả về kiểu str (chuỗi), bất kể gõ gì.
   *  Cộng hai chuỗi số bằng dấu + là NỐI CHUỖI ("5"+"3"="53"), không phải cộng
   *  số học. Đây là lỗi đầu tiên gần như MỌI người học Python đều gặp.
   * ================================================================ */
  MH.dangKy("C10-12", function (host) {
    napCss6();
    var A_MD = "5", B_MD = "3";
    var k, dungInt;

    var node = MH.el(MH.khung("input() trả về kiểu gì — và vì sao 5 + 3 lại ra \"53\"",
      "Gõ hai số vào các ô nhập bên dưới rồi bấm từng bước để xem <code>type()</code> của mỗi biến, " +
      "và kết quả thật sự của <code>a + b</code>.",
      '<div class="mh3-code" data-mh="code" style="max-width:300px;margin-bottom:12px"></div>' +
      '<div class="mh5-khung" data-mh="khung"></div>' +
      '<div class="mh6-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhVA">a nhập:</label>' +
      '<input class="mh-o-nhap hep" id="mhVA" data-mh="va" type="text" value="5" maxlength="4">' +
      '<label for="mhVB">b nhập:</label>' +
      '<input class="mh-o-nhap hep" id="mhVB" data-mh="vb" type="text" value="3" maxlength="4">' +
      '<label class="mh6-tick"><input type="checkbox" data-mh="ci"> bọc <b>int(...)</b> quanh input()</label>'));

    var loi = loiCua(node);
    function vA() { return String(node.querySelector('[data-mh="va"]').value || A_MD); }
    function vB() { return String(node.querySelector('[data-mh="vb"]').value || B_MD); }
    function laSo(s) { return /^-?\d+$/.test(s); }

    function ve() {
      var ma = dungInt
        ? ["a = int(input())", "b = int(input())", "", "print(a + b)"]
        : ["a = input()", "b = input()", "", "print(a + b)"];
      var dongNay = [0, 1, 3][Math.min(Math.max(k, 0), 2)];
      node.querySelector('[data-mh="code"]').innerHTML = ma.map(function (d, i) {
        return '<div class="mh3-d' + (k >= 0 && i === dongNay ? " nay" : "") + '">' + esc(d) + "</div>";
      }).join("");

      var a = vA(), b = vB();
      var aVal = dungInt ? (laSo(a) ? parseInt(a, 10) : NaN) : a;
      var bVal = dungInt ? (laSo(b) ? parseInt(b, 10) : NaN) : b;
      var kdl = dungInt ? "int" : "str";
      var h = "";
      if (k >= 0) {
        h += '<div class="mh5-k' + (k === 0 ? " nay" : "") + '"><b>a</b><small>' +
          esc(String(aVal)) + '<span class="mh6-kdl ' + kdl + '">' + kdl + "</span></small></div>";
      }
      if (k >= 1) {
        h += '<div class="mh5-k' + (k === 1 ? " nay" : "") + '"><b>b</b><small>' +
          esc(String(bVal)) + '<span class="mh6-kdl ' + kdl + '">' + kdl + "</span></small></div>";
      }
      if (k >= 2) {
        var kq = dungInt
          ? (isNaN(aVal) || isNaN(bVal) ? "Lỗi: không đổi được sang số" : String(aVal + bVal))
          : String(a) + String(b);
        h += '<div class="mh5-k nay"><b>a + b</b><small>' + esc(kq) + "</small></div>";
      }
      node.querySelector('[data-mh="khung"]').innerHTML = h || '<div style="color:var(--text-soft);font-size:12.5px">Chưa chạy dòng nào.</div>';

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < 2) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh6-ghi" + (dungInt ? " xong" : "");
      ghi.innerHTML = dungInt
        ? "Bọc <code>int(...)</code> quanh <code>input()</code> đổi chuỗi thành <b>số nguyên</b> NGAY khi nhận, " +
          "nên <code>a + b</code> là <b>phép cộng số học</b>, ra <b>" + (laSo(a) && laSo(b) ? aVal + bVal : "lỗi") + "</b>. " +
          "Đây là lí do <b>gần như mọi</b> chương trình Python có nhập số đều bọc <code>int()</code> hoặc <code>float()</code>."
        : "<code>input()</code> <b>LUÔN LUÔN</b> trả về kiểu <b>str</b> (chuỗi) — kể cả khi người dùng gõ toàn chữ số. " +
          "Vì vậy <code>a + b</code> ở đây là <b>nối chuỗi</b>, không phải cộng: <code>\"" + a + "\" + \"" + b +
          "\" = \"" + a + b + "\"</code>, KHÔNG PHẢI <b>" + (laSo(a) && laSo(b) ? Number(a) + Number(b) : "?") + "</b>. " +
          "Tích ô <b>“bọc int(...)”</b> ở trên để sửa lỗi này.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= 2) {
        loi(dungInt ? "Bỏ tích ô để quay lại lỗi gốc." : "Tích ô <b>“bọc int(...)”</b> ở trên rồi chạy lại.");
        return;
      }
      k++;
      ve();
      loi(k === 0 ? "Đọc dòng đầu — <code>a</code> nhận về kiểu <b>" + (dungInt ? "int" : "str") + "</b>."
        : k === 1 ? "Đọc dòng hai — <code>b</code> cũng kiểu <b>" + (dungInt ? "int" : "str") + "</b>."
        : "Tính <code>a + b</code> — xem kết quả bên dưới.");
    };
    function lamLai() { dungInt = node.querySelector('[data-mh="ci"]').checked; k = -1; ve(); loi("Bấm “Bước tiếp” để chạy dòng đầu tiên."); }
    ganDatLai(node, ["va", "vb", "ci"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai);
    host.appendChild(node); lamLai();
  });

  napCss6();
})();
