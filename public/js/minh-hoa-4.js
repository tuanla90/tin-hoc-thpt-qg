/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 4: nốt lớp 11 và nhánh TIN HỌC ỨNG DỤNG
 *
 *  Dùng khung dựng của js/minh-hoa.js (nạp SAU tệp đó). Màu lấy từ biến giao
 *  diện, số thập phân viết dấu phẩy — cùng quy ước với js/minh-hoa-3.js.
 *
 *  CHỌN BÀI THEO TIÊU CHÍ NÀO: nhánh ứng dụng có 22 bài, nhưng phần lớn là thao
 *  tác trên phần mềm mà một sơ đồ đã nói đủ. Chỉ sáu chỗ dưới đây là loại "phải
 *  thấy nó chạy mới tin", vì kết quả TRÁI với điều học sinh đoán:
 *    · quên nối khoá thì truy vấn không báo lỗi mà phình ra hàng nghìn dòng
 *    · gộp lớp là mất khả năng sửa, và mất rồi thì không có nút hoàn tác
 *    · tăng độ sáng và tăng tương phản làm hai việc khác nhau hẳn
 *  Những chỗ đó nói miệng thì học sinh gật đầu rồi vẫn làm sai.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss4() {
    if (document.getElementById("mhCss4")) return;
    var st = document.createElement("style");
    st.id = "mhCss4";
    st.textContent =
      /* --- bảng dữ liệu (nối bảng) --- */
      ".mh4-b{border-collapse:collapse;font:600 12.5px var(--font-mono);margin:0 auto}" +
      ".mh4-b th,.mh4-b td{border:1px solid var(--border);padding:5px 9px;text-align:left;transition:all .25s}" +
      ".mh4-b th{background:var(--bg-soft);font:800 11.5px var(--font-sans);white-space:nowrap}" +
      ".mh4-b tr.nay td{background:var(--primary-soft)}" +
      ".mh4-b tr.khop td{background:var(--success-soft)}" +
      ".mh4-b tr.rac td{background:var(--danger-soft);opacity:.75}" +
      ".mh4-hai{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}" +
      ".mh4-hai>div{min-width:0}" +
      ".mh4-hai h5{margin:0 0 6px;font:800 11.5px var(--font-sans);text-align:center;color:var(--text-soft)}" +
      ".mh4-cuon{max-height:196px;overflow:auto;border-radius:8px}" +
      /* --- chồng lớp ảnh --- */
      ".mh4-xem{position:relative;width:230px;height:150px;margin:0 auto;border:1px solid var(--border);" +
        "border-radius:10px;overflow:hidden;background:repeating-conic-gradient(var(--bg-soft) 0 25%,var(--bg-card) 0 50%) 0 0/16px 16px}" +
      ".mh4-lop{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;" +
        "font:800 13px var(--font-sans);transition:opacity .25s}" +
      ".mh4-lop.an{opacity:0}" +
      ".mh4-ds{display:grid;gap:5px;max-width:300px;margin:12px auto 0}" +
      ".mh4-hang{display:flex;gap:7px;align-items:center;border:1.5px solid var(--border);border-radius:9px;" +
        "background:var(--bg-card);padding:6px 9px;font:700 12.5px var(--font-sans);transition:all .25s}" +
      ".mh4-hang.moi{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh4-hang.tat{opacity:.45}" +
      ".mh4-hang span{flex:1;min-width:0}" +
      ".mh4-hang small{color:var(--text-soft);font-weight:600;font-size:11px}" +
      ".mh4-nut{border:1px solid var(--border);background:var(--bg-soft);color:var(--text-soft);border-radius:7px;" +
        "cursor:pointer;font:800 11.5px var(--font-sans);padding:4px 8px;min-height:28px;flex:none}" +
      ".mh4-nut:hover:not(:disabled){border-color:var(--primary);color:var(--primary)}" +
      ".mh4-nut:disabled{opacity:.35;cursor:default}" +
      /* --- dải ô xám (độ sáng, tương phản) --- */
      ".mh4-dai{display:flex;gap:3px;justify-content:center;flex-wrap:wrap}" +
      ".mh4-o{width:46px;text-align:center}" +
      ".mh4-o i{display:block;height:44px;border-radius:8px;border:2px solid var(--border);font-style:normal;" +
        "transition:background .25s}" +
      ".mh4-o.chay i{border-color:var(--danger)}" +
      ".mh4-o small{display:block;margin-top:4px;font:700 10.5px var(--font-mono);color:var(--text-soft)}" +
      ".mh4-o.chay small{color:var(--danger)}" +
      /* --- khung hình ảnh động --- */
      ".mh4-phim{position:relative;width:240px;height:120px;margin:0 auto;border:1px solid var(--border);" +
        "border-radius:10px;background:var(--bg-card);overflow:hidden}" +
      ".mh4-bong{position:absolute;width:26px;height:26px;border-radius:50%;background:var(--primary);top:47px;transition:none}" +
      ".mh4-khung{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin-top:11px}" +
      ".mh4-k{width:34px;height:26px;border:2px solid var(--border);border-radius:6px;background:var(--bg-card);" +
        "display:flex;align-items:center;justify-content:center;font:800 11px var(--font-mono);color:var(--text-soft)}" +
      ".mh4-k.nay{border-color:var(--primary);background:var(--primary-soft);color:var(--primary)}" +
      /* --- xem trước cấu trúc trang web --- */
      ".mh4-trang{max-width:330px;margin:0 auto;border:1.5px solid var(--border-strong);border-radius:10px;" +
        "overflow:hidden;background:var(--bg-card);min-height:170px;display:flex;flex-direction:column}" +
      ".mh4-khoi{padding:9px 11px;font:800 11.5px var(--font-mono);border-bottom:1px dashed var(--border);" +
        "animation:mh4Hien .3s ease-out}" +
      ".mh4-khoi small{display:block;margin-top:2px;font:600 10.5px var(--font-sans);color:var(--text-soft)}" +
      ".mh4-khoi.hd{background:var(--primary-soft);color:var(--primary)}" +
      ".mh4-khoi.nv{background:var(--info-soft);color:var(--info)}" +
      ".mh4-khoi.mn{flex:1;background:var(--bg-soft)}" +
      ".mh4-khoi.ft{background:var(--warning-soft);border-bottom:0}" +
      "@keyframes mh4Hien{0%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:none}}" +
      ".mh4-tick{display:inline-flex;align-items:center;gap:6px;font:700 12.5px var(--font-sans);color:var(--text-soft);cursor:pointer}" +
      ".mh4-tick input{accent-color:var(--primary);width:16px;height:16px}" +
      ".mh input.mh4-range{accent-color:var(--primary);width:140px;height:26px;padding:0;border:0;background:none;min-height:0}" +
      ".mh select.mh4-chon{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text);border-radius:10px;" +
        "padding:8px 10px;font:700 14px var(--font-sans);min-height:40px}" +
      ".mh4-ghi{margin:11px auto 0;max-width:440px;border-radius:9px;padding:8px 11px;font-size:12.5px;line-height:1.5;" +
        "background:var(--warning-soft);color:var(--text);border:1px solid var(--warning)}" +
      ".mh4-ghi.xong{background:var(--success-soft);border-color:var(--success)}" +
      ".mh4-so{text-align:center;margin-top:11px;font:700 13px var(--font-mono);color:var(--text-soft)}" +
      ".mh4-so b{color:var(--primary)}" +
      "@media (max-width:560px){.mh4-hai{flex-direction:column}.mh4-o{width:38px}.mh4-o i{height:38px}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function so(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function thap(x, n) { return Number(x).toFixed(n == null ? 1 : n).replace(".", ","); }
  function loiCua(node) { return function (t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }; }
  /* Thanh trượt và ô chọn phải huỷ chế độ Tự chạy: bấm hộ nút "Làm lại", vì
     ganTuChay đã gắn hàm dừng vào chính nút đó. Giống hệt minh-hoa-3.js. */
  /* veTaiCho: xem chú thích cùng tên ở js/minh-hoa-3.js — đổi dữ liệu vào thì vẽ
     lại TẠI BƯỚC ĐANG ĐỨNG thay vì quay về đầu, dùng cho những mô phỏng mà đổi dữ
     liệu không làm hỏng các bước đã đi. */
  function ganDatLai(node, ds, lamLai, veTaiCho) {
    var lai = node.querySelector('[data-mh="lai"]');
    lai.onclick = lamLai;
    ds.forEach(function (o) {
      if (!o) return;
      var su = o.tagName === "SELECT" || o.type === "checkbox" ? "change" : "input";
      o.addEventListener(su, function () {
        if (!veTaiCho) { lai.click(); return; }
        lai.onclick = veTaiCho;
        lai.click();
        lai.onclick = lamLai;
      });
    });
  }

  /* ==================================================================
   *  C11-29 · SẮP XẾP CHỌN DẦN VÀ CHÈN DẦN
   *
   *  NGỘ NHẬN: hai cái này "cũng như nổi bọt thôi". Khác ở chỗ đo được: chọn
   *  dần đổi chỗ đúng n−1 lần dù dãy thế nào, còn chèn dần gặp dãy gần sắp sẵn
   *  thì gần như không phải làm gì. Nên minh hoạ này ĐẾM và báo cả số liệu của
   *  thuật toán kia trên cùng dãy — đó mới là chỗ so được.
   * ================================================================ */
  MH.dangKy("C11-29", function (host) {
    var MAC_DINH = [5, 2, 9, 1, 7, 3];
    var A, i, j, minI, tam, soSanh, doiCho, xong, cach;

    var node = MH.el(MH.khung("Chọn dần và chèn dần làm việc khác nhau thế nào?",
      "Cùng một dãy, hai cách sắp xếp. Bấm từng bước rồi đổi sang cách kia để so <b>số phép so sánh</b> " +
      "và <b>số lần dịch chuyển</b>. Thử cả dãy <b>gần như đã sắp sẵn</b> (ví dụ 1 2 3 5 4 6) — " +
      "lúc đó chênh lệch mới rõ.",
      '<div class="mh-mang" data-mh="mang"></div><div class="mh4-so" data-mh="dem"></div>' +
      '<div class="mh4-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhCach">Cách:</label>' +
      '<select class="mh4-chon" id="mhCach" data-mh="cach">' +
      '<option value="chon">Chọn dần</option><option value="chen">Chèn dần</option></select>' +
      '<label for="mhDay29">Dãy:</label>' +
      '<input class="mh-o-nhap" id="mhDay29" data-mh="day" type="text" value="5 2 9 1 7 3" style="max-width:180px">'));

    var loi = loiCua(node);
    function dayGoc() {
      var v = MH.docDay(node.querySelector('[data-mh="day"]').value, 9);
      return v.length >= 2 ? v : MAC_DINH.slice();
    }
    /* Chạy cả hai thuật toán trên bản sao để báo được số liệu của cách KIA lúc
       kết thúc. Không có con số đối chiếu thì học sinh chỉ thấy "cũng sắp xong",
       chẳng rút ra được gì. */
    function demCa(goc) {
      var kq = {};
      var a = goc.slice(), s = 0, d = 0, n = a.length, m, t;
      for (var x = 0; x < n - 1; x++) {
        m = x;
        for (var y = x + 1; y < n; y++) { s++; if (a[y] < a[m]) m = y; }
        if (m !== x) { t = a[x]; a[x] = a[m]; a[m] = t; d++; }
      }
      kq.chon = { ss: s, dc: d };
      a = goc.slice(); s = 0; d = 0;
      for (var p = 1; p < n; p++) {
        var v = a[p], q = p - 1;
        while (q >= 0) { s++; if (a[q] <= v) break; a[q + 1] = a[q]; d++; q--; }
        a[q + 1] = v;
      }
      kq.chen = { ss: s, dc: d };
      return kq;
    }

    function dat() {
      A = dayGoc();
      cach = node.querySelector('[data-mh="cach"]').value;
      i = cach === "chon" ? 0 : 1;
      j = cach === "chon" ? 1 : 0;
      minI = 0; tam = null; soSanh = 0; doiCho = 0; xong = false;
    }

    function ve(nhan) {
      nhan = nhan || {};
      node.querySelector('[data-mh="mang"]').innerHTML = A.map(function (v, n) {
        var c = "mh-o";
        if (xong) c += " xong";
        else if (n === nhan.chinh) c += " giua";
        else if (n === nhan.min) c += " thay";
        else if (nhan.daXong != null && n < nhan.daXong) c += " xong";
        else if (n === nhan.doi) c += " doi";
        return '<div class="' + c + '">' + v + "</div>";
      }).join("");
      node.querySelector('[data-mh="dem"]').innerHTML =
        "So sánh: <b>" + soSanh + "</b> · " +
        (cach === "chon" ? "Đổi chỗ" : "Dịch chỗ") + ": <b>" + doiCho + "</b>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (!xong) { ghi.hidden = true; return; }
      var d = demCa(dayGoc());
      var kia = cach === "chon" ? "chen" : "chon";
      var tenKia = cach === "chon" ? "Chèn dần" : "Chọn dần";
      ghi.hidden = false;
      ghi.className = "mh4-ghi xong";
      ghi.innerHTML = "Trên <b>đúng dãy này</b>: cách em vừa chạy cần <b>" + soSanh + "</b> so sánh và <b>" +
        doiCho + "</b> lần " + (cach === "chon" ? "đổi chỗ" : "dịch chỗ") + "; <b>" + tenKia +
        "</b> cần <b>" + d[kia].ss + "</b> so sánh và <b>" + d[kia].dc + "</b> lần " +
        (kia === "chon" ? "đổi chỗ" : "dịch chỗ") + ". " +
        "Chọn dần luôn quét đủ nên <b>số so sánh không đổi</b> dù dãy thế nào, bù lại đổi chỗ " +
        "<b>nhiều nhất n−1 = " + (A.length - 1) + "</b> lần; còn chèn dần thì <b>dãy càng gần sắp sẵn càng ít việc</b>. " +
        "Cả hai đều là O(n²).";
    }

    /* Một bấm = một phép so sánh, không phải một lượt: học sinh phải thấy được
       chỗ "đang tìm giá trị nhỏ nhất" và chỗ "đang lùi về tìm chỗ chèn". */
    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (xong) { loi("Đổi sang cách kia hoặc đổi dãy rồi chạy lại để so số liệu."); return; }

      if (cach === "chon") {
        if (i >= A.length - 1) {
          xong = true; ve(); loi("Xong. Dãy đã sắp: <b>" + A.join(" ") + "</b>.");
          return;
        }
        if (j < A.length) {
          soSanh++;
          var doiMin = A[j] < A[minI];
          if (doiMin) minI = j;
          ve({ chinh: j, min: minI, daXong: i });
          loi("So sánh <b>" + A[j] + "</b> với giá trị nhỏ nhất đang giữ (<b>" + A[minI] + "</b>). " +
            (doiMin ? "Nhỏ hơn → <b>ghi nhớ vị trí mới</b>." : "Không nhỏ hơn → giữ nguyên.") +
            " Chú ý: chưa đổi chỗ gì cả, chỉ đang tìm.");
          j++;
          return;
        }
        if (minI !== i) {
          var t = A[i]; A[i] = A[minI]; A[minI] = t; doiCho++;
          ve({ doi: i, daXong: i });
          loi("Hết lượt tìm. Đưa <b>" + A[i] + "</b> về vị trí <b>" + (i + 1) + "</b> — " +
            "<b>một lần đổi chỗ duy nhất</b> cho cả lượt quét.");
        } else {
          ve({ daXong: i + 1 });
          loi("Giá trị nhỏ nhất đã nằm đúng chỗ rồi → <b>không phải đổi chỗ</b>.");
        }
        i++; minI = i; j = i + 1;
        return;
      }

      /* Chèn dần: lấy A[i] ra rồi lùi về, mỗi bấm là một phép so sánh + có thể
         một phép dịch. Giữ giá trị đang cầm trong biến tam để vẽ đúng. */
      if (i >= A.length) {
        xong = true; ve(); loi("Xong. Dãy đã sắp: <b>" + A.join(" ") + "</b>.");
        return;
      }
      if (tam == null) {
        tam = A[i]; j = i - 1;
        ve({ chinh: i, daXong: i });
        loi("Lấy <b>" + tam + "</b> ra, giờ lùi về bên trái tìm chỗ chèn. " +
          "Phần bên trái (<b>" + A.slice(0, i).join(" ") + "</b>) đã sắp xong.");
        return;
      }
      if (j >= 0) {
        soSanh++;
        if (A[j] > tam) {
          A[j + 1] = A[j]; doiCho++; j--;
          ve({ doi: j + 2, daXong: i });
          loi("So sánh: <b>" + A[j + 2] + "</b> lớn hơn <b>" + tam + "</b> → <b>dịch nó sang phải</b> một ô, tiếp tục lùi.");
          return;
        }
        ve({ min: j, daXong: i });
        loi("So sánh: <b>" + A[j] + "</b> không lớn hơn <b>" + tam + "</b> → <b>đã tìm được chỗ</b>, dừng lùi.");
      }
      A[j + 1] = tam;
      var vt = j + 2;
      tam = null; i++;
      ve({ min: vt - 1, daXong: i });
      loi("Chèn <b>" + A[vt - 1] + "</b> vào vị trí <b>" + vt + "</b>. Dãy hiện tại: <b>" + A.join(" ") + "</b>.");
    };

    function lamLai() {
      dat(); ve({ daXong: 0 });
      loi((cach === "chon" ? "<b>Chọn dần</b>: mỗi lượt tìm giá trị nhỏ nhất rồi đưa về đầu."
                           : "<b>Chèn dần</b>: lấy từng phần tử, lùi về tìm đúng chỗ chèn vào.") +
        " Bấm “Bước tiếp”.");
    }
    ganDatLai(node, ["cach", "day"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-07 · TRUY VẤN NỐI NHIỀU BẢNG
   *
   *  NGỘ NHẬN NGUY HIỂM NHẤT của bài: "quên nối khoá thì nó báo lỗi". Không —
   *  nó ghép MỌI dòng bảng này với MỌI dòng bảng kia và im lặng trả về kết quả
   *  vô nghĩa. Ô tích ở đây cho thấy đúng chuyện đó: số dòng phình từ 4 lên 12,
   *  và mỗi dòng rác đều trông "hợp lệ" nếu chỉ nhìn một dòng.
   * ================================================================ */
  MH.dangKy("U11-07", function (host) {
    var HS = [
      { ma: "HS01", ten: "Lê An", lop: "12A" },
      { ma: "HS02", ten: "Trần Bình", lop: "12A" },
      { ma: "HS03", ten: "Vũ Chi", lop: "12B" },
    ];
    var MUON = [
      { ma: "HS01", sach: "Toán 12" },
      { ma: "HS03", sach: "Vật lí 12" },
      { ma: "HS01", sach: "Tin học 12" },
      { ma: "HS02", sach: "Ngữ văn 12" },
    ];
    var k, kq;

    var node = MH.el(MH.khung("Nối hai bảng theo khoá — và chuyện gì xảy ra nếu quên",
      "Bảng <b>MUON</b> chỉ ghi <b>mã học sinh</b>, không ghi tên. Muốn xem ai mượn sách gì thì phải " +
      "<b>nối</b> nó với bảng <b>HOC_SINH</b> theo mã. Bấm từng bước để xem máy ghép từng dòng. " +
      "Rồi tích ô <b>“quên nối khoá”</b> và chạy lại — chú ý <b>số dòng</b>.",
      '<div class="mh4-hai">' +
      '<div><h5>HOC_SINH</h5><table class="mh4-b" data-mh="hs"></table></div>' +
      '<div><h5>MUON (có khoá ngoài ma_hs)</h5><table class="mh4-b" data-mh="mn"></table></div>' +
      "</div>" +
      '<div style="margin-top:13px"><h5 style="margin:0 0 6px;font:800 11.5px var(--font-sans);' +
      'text-align:center;color:var(--text-soft)">Kết quả truy vấn</h5>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="kq"></table></div></div>' +
      '<div class="mh4-so" data-mh="dem"></div><div class="mh4-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh4-tick"><input type="checkbox" data-mh="quen"> quên nối khoá (thiếu điều kiện <b>ON</b>)</label>'));

    var loi = loiCua(node);
    function quen() { return node.querySelector('[data-mh="quen"]').checked; }
    /* Danh sách các cặp máy sẽ xét, theo đúng thứ tự nó xét. Quên nối khoá thì
       tập này là TÍCH của hai bảng — sinh ra ở đây chứ không phải lúc vẽ, để số
       bước bấm cũng phình lên đúng như số phép ghép thật. */
    function cacCap() {
      var ds = [];
      MUON.forEach(function (m, mi) {
        HS.forEach(function (h, hi) {
          if (quen() || h.ma === m.ma) ds.push({ m: m, h: h, mi: mi, hi: hi });
        });
      });
      return ds;
    }

    function ve(cap) {
      node.querySelector('[data-mh="hs"]').innerHTML =
        "<tr><th>ma_hs</th><th>ho_ten</th><th>lop</th></tr>" +
        HS.map(function (h, n) {
          return '<tr class="' + (cap && cap.hi === n ? "nay" : "") + '"><td>' + h.ma + "</td><td>" +
            esc(h.ten) + "</td><td>" + h.lop + "</td></tr>";
        }).join("");
      node.querySelector('[data-mh="mn"]').innerHTML =
        "<tr><th>ma_hs</th><th>ten_sach</th></tr>" +
        MUON.map(function (m, n) {
          return '<tr class="' + (cap && cap.mi === n ? "nay" : "") + '"><td>' + m.ma + "</td><td>" +
            esc(m.sach) + "</td></tr>";
        }).join("");
      node.querySelector('[data-mh="kq"]').innerHTML = kq.length
        ? "<tr><th>ho_ten</th><th>lop</th><th>ten_sach</th></tr>" +
          kq.map(function (r) {
            return '<tr class="' + (r.rac ? "rac" : "khop") + '"><td>' + esc(r.ten) + "</td><td>" +
              r.lop + "</td><td>" + esc(r.sach) + "</td></tr>";
          }).join("")
        : "<tr><th>ho_ten</th><th>lop</th><th>ten_sach</th></tr>" +
          '<tr><td colspan="3" style="color:var(--text-soft);font-weight:600">(chưa có dòng nào)</td></tr>';

      var tong = cacCap().length;
      node.querySelector('[data-mh="dem"]').innerHTML =
        "Đã ghép <b>" + kq.length + "</b>/" + tong + " dòng" +
        (quen() ? " · trong đó <b>" + kq.filter(function (r) { return r.rac; }).length + "</b> dòng vô nghĩa" : "");

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (kq.length < tong) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh4-ghi" + (quen() ? "" : " xong");
      ghi.innerHTML = quen()
        ? "Không có điều kiện nối, máy ghép <b>mỗi</b> dòng MUON với <b>mỗi</b> dòng HOC_SINH: " +
          MUON.length + " × " + HS.length + " = <b>" + tong + "</b> dòng, và <b>không báo lỗi gì cả</b>. " +
          "Nhìn riêng một dòng thì vẫn thấy hợp lệ — đó là chỗ nguy hiểm. Với bảng thật 50 học sinh và " +
          "200 lượt mượn, con số này là <b>10.000</b> dòng. " +
          "<b>Cách kiểm nhanh: đếm số dòng kết quả.</b> Phình lên vô lí là quên nối khoá."
        : "Nối đúng khoá thì mỗi lượt mượn ghép với <b>đúng một</b> học sinh, ra <b>" + tong +
          "</b> dòng — bằng số dòng của bảng MUON. Bảng MUON chỉ giữ <b>mã</b>, nên đổi tên một học sinh " +
          "thì sửa <b>một ô</b> ở bảng HOC_SINH là mọi kết quả truy vấn đổi theo.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var ds = cacCap();
      if (k >= ds.length - 1) {
        loi(quen()
          ? "Bỏ tích ô đó rồi chạy lại để thấy truy vấn nối đúng ra bao nhiêu dòng."
          : "Giờ tích ô <b>“quên nối khoá”</b> và chạy lại — đếm xem ra mấy dòng.");
        return;
      }
      k++;
      var c = ds[k], khop = c.h.ma === c.m.ma;
      kq.push({ ten: c.h.ten, lop: c.h.lop, sach: c.m.sach, rac: !khop });
      ve(c);
      loi(khop
        ? "Lượt mượn “" + esc(c.m.sach) + "” có <b>ma_hs = " + c.m.ma + "</b> → tìm thấy <b>" +
          esc(c.h.ten) + "</b> ở bảng HOC_SINH → ghép thành một dòng kết quả."
        : "Ghép “" + esc(c.m.sach) + "” (mã <b>" + c.m.ma + "</b>) với <b>" + esc(c.h.ten) + "</b> (mã <b>" +
          c.h.ma + "</b>) — <b>hai mã khác nhau</b>! Dòng này hoàn toàn vô nghĩa, nhưng không có điều kiện " +
          "nối nên máy vẫn nhận.");
    };

    function lamLai() {
      k = -1; kq = []; ve(null);
      loi(quen()
        ? "Truy vấn <b>thiếu điều kiện nối</b>. Bấm “Bước tiếp” và đếm số dòng."
        : "Nối <b>MUON.ma_hs = HOC_SINH.ma_hs</b>. Bấm “Bước tiếp” để ghép dòng đầu tiên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="quen"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-09 · LỚP TRONG PHẦN MỀM CHỈNH SỬA ẢNH
   *
   *  NGỘ NHẬN đắt tiền nhất của cả nhánh ứng dụng: xuất ra .jpg rồi mới nhận ra
   *  không sửa lại được nữa. Nói thì ai cũng gật, làm thì vẫn mất bài. Nên minh
   *  hoạ này cho GỘP LỚP thật: bấm xong thì các nút bật/tắt và đổi thứ tự đều
   *  chết, và không có cách nào lấy lại — đúng như ngoài đời.
   * ================================================================ */
  MH.dangKy("U11-09", function (host) {
    var GOC = [
      { t: "Lớp nền", p: "màu nền", mau: "var(--info-soft)", chu: "var(--info)" },
      { t: "Lớp ảnh chính", p: "ảnh đã tách nền", mau: "var(--primary-soft)", chu: "var(--primary)" },
      { t: "Lớp hiệu ứng", p: "khung viền", mau: "transparent", chu: "var(--text-soft)", vien: true },
      { t: "Lớp chữ", p: "tiêu đề", mau: "transparent", chu: "var(--danger)", chuHien: "TIÊU ĐỀ" },
    ];
    var lop, hienTo, daGop;

    var node = MH.el(MH.khung("Lớp hoạt động thế nào, và gộp lớp mất gì?",
      "Bấm từng bước để thêm lần lượt các lớp từ <b>dưới lên</b>. Sau đó tự bật/tắt và đổi thứ tự để xem " +
      "ảnh kết quả đổi theo. Bước cuối là <b>gộp lớp</b> — đúng việc xảy ra khi em xuất ra tệp <b>.jpg</b>.",
      '<div class="mh4-xem" data-mh="xem"></div><div class="mh4-ds" data-mh="ds"></div>' +
      '<div class="mh4-ghi" data-mh="ghi" hidden></div>'));

    var loi = loiCua(node);

    function ve() {
      var xem = node.querySelector('[data-mh="xem"]');
      if (daGop) {
        /* Sau khi gộp, khung xem CHỈ còn một lớp phẳng — dựng lại từ trạng thái
           đang thấy lúc bấm gộp, không dựng từ danh sách lớp nữa. */
        xem.innerHTML = '<div class="mh4-lop" style="background:var(--bg-soft);color:var(--text-soft);' +
          'flex-direction:column;gap:3px"><b style="font-size:12px">ảnh phẳng</b>' +
          '<small style="font-weight:600;font-size:10.5px">1 lớp · không sửa được</small></div>';
      } else {
        xem.innerHTML = lop.slice(0, hienTo + 1).map(function (l, n) {
          var st = "background:" + l.mau + ";color:" + l.chu;
          if (l.vien) st += ";border:5px solid var(--warning);border-radius:8px";
          return '<div class="mh4-lop' + (l.tat ? " an" : "") + '" style="' + st + '">' +
            (l.chuHien ? l.chuHien : "") + "</div>";
        }).join("");
      }

      /* Danh sách lớp vẽ NGƯỢC: lớp trên cùng của ảnh phải nằm trên cùng của
         danh sách, y như mọi phần mềm chỉnh ảnh thật. */
      node.querySelector('[data-mh="ds"]').innerHTML = lop.map(function (l, n) {
        return { l: l, n: n };
      }).reverse().filter(function (x) {
        return x.n <= hienTo;
      }).map(function (x) {
        var l = x.l, n = x.n;
        return '<div class="mh4-hang' + (l.tat ? " tat" : "") + (n === hienTo && !daGop ? " moi" : "") + '">' +
          '<button class="mh4-nut" data-tat="' + n + '"' + (daGop ? " disabled" : "") + '>' +
          (l.tat ? "hiện" : "ẩn") + "</button>" +
          "<span>" + esc(l.t) + "<small> · " + esc(l.p) + "</small></span>" +
          '<button class="mh4-nut" data-len="' + n + '"' +
          (daGop || n === lop.length - 1 ? " disabled" : "") + ">lên</button>" +
          '<button class="mh4-nut" data-xuong="' + n + '"' +
          (daGop || n === 0 ? " disabled" : "") + ">xuống</button></div>";
      }).join("");

      node.querySelector('[data-mh="ds"]').querySelectorAll("button").forEach(function (b) {
        b.onclick = function () {
          if (daGop) return;
          var n;
          if (b.dataset.tat != null) {
            n = +b.dataset.tat; lop[n].tat = !lop[n].tat; ve();
            loi((lop[n].tat ? "Ẩn" : "Hiện") + " <b>" + esc(lop[n].t) + "</b> — các lớp khác không việc gì. " +
              "Đó là toàn bộ lí do người ta làm việc theo lớp.");
          } else if (b.dataset.len != null) {
            n = +b.dataset.len;
            var t = lop[n]; lop[n] = lop[n + 1]; lop[n + 1] = t; ve();
            loi("Đưa <b>" + esc(t.t) + "</b> lên trên. Lớp nào ở trên thì <b>che</b> lớp dưới nó.");
          } else {
            n = +b.dataset.xuong;
            var u = lop[n]; lop[n] = lop[n - 1]; lop[n - 1] = u; ve();
            loi("Đưa <b>" + esc(u.t) + "</b> xuống dưới — giờ nó bị lớp trên che.");
          }
        };
      });

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (!daGop) { ghi.hidden = hienTo < lop.length - 1; if (!ghi.hidden) {
        ghi.className = "mh4-ghi xong";
        ghi.innerHTML = "Đủ bốn lớp. Giờ thử <b>ẩn</b> một lớp hoặc đổi thứ tự — sửa lớp nào chỉ lớp đó đổi. " +
          "Bấm “Bước tiếp” một lần nữa để <b>gộp lớp</b>.";
      } return; }
      ghi.hidden = false;
      ghi.className = "mh4-ghi";
      ghi.innerHTML = "Đã gộp. Mọi nút đều <b>chết</b>: không còn lớp nào để bật, tắt hay xê dịch — " +
        "cả ảnh giờ chỉ là một mảng điểm ảnh. Đây <b>đúng là</b> điều xảy ra khi em xuất ra <b>.jpg</b> " +
        "hoặc <b>.png</b>, và <b>không có nút hoàn tác</b> sau khi đã đóng tệp. " +
        "Vì vậy quy tắc là: <b>lưu tệp nhiều lớp trước</b> (<b>.xcf</b> của GIMP, <b>.psd</b> của Photoshop), " +
        "<b>xuất .jpg sau</b>.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (daGop) { loi("Muốn sửa tiếp thì phải mở lại <b>tệp nhiều lớp</b> — mà tệp đó em phải lưu từ trước. Bấm “Làm lại”."); return; }
      if (hienTo < lop.length - 1) {
        hienTo++; ve();
        var l = lop[hienTo];
        loi("Thêm <b>" + esc(l.t) + "</b> lên trên cùng. Ảnh ta thấy là kết quả của việc " +
          "<b>nhìn từ trên xuống</b> qua cả chồng lớp." +
          (hienTo === 2 ? " Lớp này để nền trong suốt nên vẫn thấy lớp dưới." : ""));
        return;
      }
      daGop = true; ve();
      loi("<b>Gộp lớp.</b> Bốn lớp thành một. Thử bấm các nút xem còn dùng được không.");
    };

    function lamLai() {
      lop = GOC.map(function (l) { var c = {}; for (var k in l) c[k] = l[k]; c.tat = false; return c; });
      hienTo = 0; daGop = false; ve();
      loi("Đang có <b>một</b> lớp nền. Bấm “Bước tiếp” để thêm lớp tiếp theo lên trên.");
    }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-10 · ĐỘ SÁNG VÀ ĐỘ TƯƠNG PHẢN
   *
   *  NGỘ NHẬN: hai thanh trượt này "đại khái giống nhau, đều làm ảnh rõ hơn".
   *  Cho thấy bằng CON SỐ trên từng ô xám: độ sáng CỘNG một lượng như nhau cho
   *  mọi ô, độ tương phản NHÂN khoảng cách tới mức giữa. Và đánh dấu đỏ những ô
   *  đã bị đẩy về 0 hoặc 255 — đó là chỗ chi tiết mất vĩnh viễn.
   * ================================================================ */
  MH.dangKy("U11-10", function (host) {
    var GOC = [10, 45, 80, 115, 140, 175, 210, 245];
    var BUOC = [
      { s: 0, t: 100, noi: "Đây là ảnh gốc: tám mức xám từ gần đen tới gần trắng. Số dưới mỗi ô là <b>giá trị độ xám</b> (0 = đen, 255 = trắng)." },
      { s: 60, t: 100, noi: "<b>Độ sáng +60</b>: mọi ô đều <b>cộng thêm 60</b> — cùng một lượng. Ô tối cũng sáng lên, nên ảnh trông bạc màu, mờ đục chứ không rõ hơn." },
      { s: 0, t: 100, noi: "Về lại ảnh gốc để so." },
      { s: 0, t: 170, noi: "<b>Tương phản +70%</b>: không cộng gì cả, mà <b>nhân khoảng cách tới mức giữa (128)</b>. Ô tối <b>tối thêm</b>, ô sáng <b>sáng thêm</b> — ảnh trông nét hơn." },
      { s: 55, t: 200, noi: "<b>Cả hai kéo quá tay</b>: những ô đánh dấu đỏ đã bị đẩy về <b>0</b> hoặc <b>255</b>. Mấy ô đó giờ <b>giống nhau y hệt</b> — chi tiết ở đó đã mất." },
    ];
    var k, tay;

    var node = MH.el(MH.khung("Độ sáng và độ tương phản làm hai việc khác nhau",
      "Bấm từng bước để xem máy làm gì với con số của từng ô, hoặc tự kéo hai thanh trượt. " +
      "Ô nào viền <b>đỏ</b> là đã bị đẩy về 0 hoặc 255 — <b>mất chi tiết, không lấy lại được</b>.",
      '<div class="mh4-dai" data-mh="dai"></div><div class="mh4-so" data-mh="ct"></div>' +
      '<div class="mh4-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhSang">Độ sáng:</label>' +
      '<input class="mh4-range" id="mhSang" data-mh="s" type="range" min="-100" max="100" step="5" value="0">' +
      '<span class="mh4-nut" style="pointer-events:none" data-mh="sn"></span>' +
      '<label for="mhTp">Tương phản:</label>' +
      '<input class="mh4-range" id="mhTp" data-mh="t" type="range" min="0" max="250" step="10" value="100">' +
      '<span class="mh4-nut" style="pointer-events:none" data-mh="tn"></span>'));

    var loi = loiCua(node);
    function thamSo() {
      if (tay) return { s: +node.querySelector('[data-mh="s"]').value, t: +node.querySelector('[data-mh="t"]').value };
      return { s: BUOC[k].s, t: BUOC[k].t };
    }
    /* Đúng công thức phần mềm ảnh dùng: nhân quanh mức giữa 128 rồi mới cộng độ
       sáng, sau đó kẹp về 0..255. Kẹp chính là chỗ "mất chi tiết". */
    function bien(v, p) {
      var x = (v - 128) * (p.t / 100) + 128 + p.s;
      return Math.max(0, Math.min(255, Math.round(x)));
    }

    function ve() {
      var p = thamSo();
      node.querySelector('[data-mh="s"]').value = p.s;
      node.querySelector('[data-mh="t"]').value = p.t;
      node.querySelector('[data-mh="sn"]').textContent = (p.s > 0 ? "+" : "") + p.s;
      node.querySelector('[data-mh="tn"]').textContent = p.t + "%";

      var chay = 0;
      node.querySelector('[data-mh="dai"]').innerHTML = GOC.map(function (v) {
        var m = bien(v, p), mat = m === 0 || m === 255;
        if (mat) chay++;
        return '<div class="mh4-o' + (mat ? " chay" : "") + '">' +
          '<i style="background:rgb(' + m + "," + m + "," + m + ')"></i>' +
          "<small>" + m + "</small></div>";
      }).join("");
      node.querySelector('[data-mh="ct"]').innerHTML =
        "Công thức: <b>(giá trị − 128) × " + thap(p.t / 100, 2) + " + 128 " +
        (p.s >= 0 ? "+ " + p.s : "− " + -p.s) + "</b>" +
        (chay ? ' · <span style="color:var(--danger)"><b>' + chay + "</b> ô mất chi tiết</span>" : "");

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (!chay) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh4-ghi";
      ghi.innerHTML = "<b>" + chay + "</b> ô đã bị kẹp về 0 hoặc 255. Kéo thanh trượt về giữa xem: " +
        "màu quay lại được nhưng nếu đây là ảnh thật và em đã <b>lưu</b> ở trạng thái này thì " +
        "những ô đó vĩnh viễn giống nhau — <b>không có thông tin nào để khôi phục</b>. " +
        "Vì vậy phải chỉnh trên <b>lớp riêng</b> hoặc bản sao, đừng chỉnh thẳng lên lớp gốc.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      tay = false;
      if (k >= BUOC.length - 1) {
        loi("Hết các bước. Giờ tự kéo hai thanh trượt: thử <b>tương phản 0%</b> xem cả ảnh thành cái gì.");
        return;
      }
      k++; ve(); loi(BUOC[k].noi);
    };
    ["s", "t"].forEach(function (x) {
      node.querySelector('[data-mh="' + x + '"]').addEventListener("input", function () {
        tay = true;
        node.querySelector('[data-mh="lai"]').dispatchEvent(new Event("click"));
      });
    });
    function lamLai() { k = 0; tay = false; ve(); loi(BUOC[0].noi + " Bấm “Bước tiếp”."); }
    /* Kéo thanh trượt KHÔNG được đặt lại về bước 0 — chỉ được dừng chế độ Tự chạy.
       Nên gắn tay thay vì dùng ganDatLai như các minh hoạ khác. */
    node.querySelector('[data-mh="lai"]').addEventListener("click", function (e) {
      if (e.isTrusted) { tay = false; lamLai(); } else ve();
    });
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-13 · ẢNH ĐỘNG TỪ NHIỀU KHUNG HÌNH
   *
   *  NGỘ NHẬN: "càng nhiều khung càng mượt càng tốt". Đúng nửa đầu. Minh hoạ này
   *  hiện luôn DUNG LƯỢNG ƯỚC TÍNH bên cạnh số khung mỗi giây, để thấy đây là
   *  một phép đánh đổi chứ không phải càng nhiều càng hay.
   * ================================================================ */
  MH.dangKy("U11-13", function (host) {
    var k;

    var node = MH.el(MH.khung("Ảnh động chỉ là nhiều ảnh tĩnh chiếu lần lượt",
      "Mỗi <b>khung hình</b> là một ảnh riêng — trong phần mềm chỉnh ảnh thì mỗi khung là <b>một lớp</b>. " +
      "Bấm “Bước tiếp” để chiếu từng khung, hoặc bấm <b>Tự chạy</b> để nó chạy liên tục. " +
      "Đổi số khung và độ trễ để xem đánh đổi giữa <b>mượt</b> và <b>nhẹ</b>.",
      '<div class="mh4-phim" data-mh="phim"></div><div class="mh4-khung" data-mh="ks"></div>' +
      '<div class="mh4-so" data-mh="so"></div><div class="mh4-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhSoK">Số khung:</label>' +
      '<input class="mh4-range" id="mhSoK" data-mh="n" type="range" min="2" max="12" step="1" value="6">' +
      '<span class="mh4-nut" style="pointer-events:none" data-mh="nn"></span>' +
      '<label for="mhTre">Độ trễ:</label>' +
      '<input class="mh4-range" id="mhTre" data-mh="tre" type="range" min="40" max="500" step="20" value="100">' +
      '<span class="mh4-nut" style="pointer-events:none" data-mh="tren"></span>'));

    var loi = loiCua(node);
    function soKhung() { return +node.querySelector('[data-mh="n"]').value; }
    function doTre() { return +node.querySelector('[data-mh="tre"]').value; }

    function ve() {
      var n = soKhung(), tre = doTre();
      node.querySelector('[data-mh="nn"]').textContent = n + " khung";
      node.querySelector('[data-mh="tren"]').textContent = tre + " ms";
      /* Quả bóng đi từ trái sang phải theo số khung: khung n ở vị trí n/(N-1).
         Đây chính là "vẽ lại từng khung một chút khác nhau". */
      var t = n > 1 ? k / (n - 1) : 0;
      node.querySelector('[data-mh="phim"]').innerHTML =
        '<div class="mh4-bong" style="left:calc(' + (t * 100).toFixed(1) + "% - " + (t * 26).toFixed(1) + 'px)"></div>' +
        '<div style="position:absolute;left:8px;top:6px;font:800 11px var(--font-mono);color:var(--text-soft)">khung ' +
        (k + 1) + "/" + n + "</div>";
      node.querySelector('[data-mh="ks"]').innerHTML = "";
      var h = "";
      for (var x = 0; x < n; x++) h += '<div class="mh4-k' + (x === k ? " nay" : "") + '">' + (x + 1) + "</div>";
      node.querySelector('[data-mh="ks"]').innerHTML = h;

      var fps = 1000 / tre, nang = n * 12;   // ~12KB mỗi khung ở cỡ nhỏ, ước tính thô
      node.querySelector('[data-mh="so"]').innerHTML =
        "<b>" + thap(fps) + "</b> khung mỗi giây · một vòng chạy hết <b>" + thap(n * tre / 1000, 2) +
        "</b> giây · tệp GIF nặng khoảng <b>" + so(nang) + " KB</b>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = false;
      if (fps < 8) {
        ghi.className = "mh4-ghi";
        ghi.innerHTML = "Dưới <b>8 khung/giây</b> thì mắt nhận ra từng khung riêng lẻ — chuyển động trông giật. " +
          "Giảm độ trễ xuống khoảng <b>100 ms</b> (10 khung/giây) là mượt vừa đủ cho ảnh động đơn giản.";
      } else if (n >= 10) {
        ghi.className = "mh4-ghi";
        ghi.innerHTML = "Mượt hơn, nhưng tệp đã <b>" + so(nang) + " KB</b>. Mỗi khung là <b>một ảnh phải lưu</b>, " +
          "nên số khung tăng thì dung lượng tăng theo — <b>không có chuyện càng nhiều khung càng nhẹ</b>. " +
          "Ảnh động dài hoặc nhiều màu thì nên làm <b>video</b>: GIF nén kém hơn video nhiều và chỉ có 256 màu.";
      } else {
        ghi.className = "mh4-ghi xong";
        ghi.innerHTML = "Cân bằng tốt: <b>" + thap(fps) + " khung/giây</b> đủ mượt mà tệp vẫn nhẹ. " +
          "Ảnh động là phép <b>đánh đổi giữa mượt và nhẹ</b> — không có cấu hình nào tốt cho mọi trường hợp.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      /* Cố ý chạy VÒNG TRÒN, không dừng ở khung cuối: ảnh động thật là lặp lại.
         Nhưng ganTuChay tự dừng khi nội dung không đổi, mà ở đây nó luôn đổi nên
         Tự chạy sẽ chiếu mãi — đúng ý, vì đó chính là "lặp vô hạn" của GIF. */
      k = (k + 1) % soKhung();
      ve();
      if (k === 0) loi("Hết vòng, quay lại khung 1 — đó là <b>lặp vô hạn</b>, tuỳ chọn khi xuất GIF.");
      else loi("Khung <b>" + (k + 1) + "</b>: quả bóng dịch thêm một chút. Từng khung đứng im, " +
        "chỉ có việc <b>đổi khung liên tục</b> tạo ra cảm giác chuyển động.");
    };
    function lamLai() { k = 0; ve(); loi("Đang ở khung 1. Bấm “Bước tiếp”, hoặc bấm <b>Tự chạy</b> để xem nó động thật."); }
    /* Đổi số khung hay độ trễ thì GIỮ khung đang xem, chỉ kẹp lại cho khỏi vượt số
       khung mới. Đây là bài người ta kéo qua kéo lại để so mượt/nhẹ, quay về khung 1
       mỗi lần nhích thanh trượt thì không so được gì. */
    function veTaiCho() {
      if (k >= soKhung()) k = soKhung() - 1;
      ve();
    }
    ganDatLai(node, ["n", "tre"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai, veTaiCho);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U12-03 · CẤU TRÚC KHỐI CỦA MỘT TRANG WEB
   *
   *  NGỘ NHẬN: dùng <div> hay dùng <header> thì cũng thế, "trông giống nhau mà".
   *  Trông thì giống thật — nên minh hoạ này thêm một bước cuối: bật chế độ
   *  "nghe bằng trình đọc màn hình", và cho thấy cùng một trang đọc ra hai kiểu
   *  hoàn toàn khác nhau. Đó là chỗ khác biệt mà mắt không thấy được.
   * ================================================================ */
  MH.dangKy("U12-03", function (host) {
    var KHOI = [
      { the: "header", cls: "hd", ten: "logo, tên trang", doc: "vùng đầu trang" },
      { the: "nav", cls: "nv", ten: "Trang chủ · Giới thiệu · Liên hệ", doc: "vùng điều hướng, 3 liên kết" },
      { the: "main", cls: "mn", ten: "nội dung riêng của trang này", doc: "nội dung chính" },
      { the: "footer", cls: "ft", ten: "liên hệ · © 2026", doc: "vùng chân trang" },
    ];
    var k, div;

    var node = MH.el(MH.khung("Bốn khối của một trang web — và vì sao không dùng div",
      "Bấm từng bước để thêm lần lượt bốn khối. Xong rồi tích ô <b>“dùng div hết”</b>: " +
      "bản xem trước <b>không đổi gì cả</b>, nhưng phần dưới cho thấy trình đọc màn hình " +
      "nghe ra hai trang hoàn toàn khác nhau.",
      '<div class="mh4-trang" data-mh="trang"></div>' +
      '<div class="mh4-so" data-mh="nghe"></div><div class="mh4-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh4-tick"><input type="checkbox" data-mh="div"> dùng <b>&lt;div&gt;</b> hết thay cho các thẻ đúng nghĩa</label>'));

    var loi = loiCua(node);
    function dungDiv() { return node.querySelector('[data-mh="div"]').checked; }

    function ve() {
      var la = dungDiv();
      node.querySelector('[data-mh="trang"]').innerHTML = KHOI.slice(0, k).map(function (b) {
        return '<div class="mh4-khoi ' + b.cls + '">&lt;' + (la ? "div" : b.the) + "&gt;" +
          "<small>" + esc(b.ten) + "</small></div>";
      }).join("") || '<div style="margin:auto;color:var(--text-soft);font-size:12.5px">(trang trống)</div>';

      var nghe = node.querySelector('[data-mh="nghe"]');
      if (!k) { nghe.innerHTML = "&nbsp;"; }
      else {
        nghe.innerHTML = '<span style="font-size:11.5px;color:var(--text-soft);font-family:var(--font-sans);' +
          'font-weight:800">Trình đọc màn hình đọc ra:</span><br>' +
          KHOI.slice(0, k).map(function (b) {
            return la ? '<span style="color:var(--danger)">“một khối”</span>'
                      : "<b>“" + b.doc + "”</b>";
          }).join(" · ");
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      if (k < KHOI.length) { ghi.hidden = true; return; }
      ghi.hidden = false;
      ghi.className = "mh4-ghi" + (la ? "" : " xong");
      ghi.innerHTML = la
        ? "Bản xem trước <b>y nguyên</b> — mắt không thấy khác gì. Nhưng trình đọc màn hình chỉ nghe được " +
          "<b>“một khối, một khối, một khối, một khối”</b>, nên người khiếm thị <b>không nhảy thẳng tới</b> " +
          "thanh điều hướng hay nội dung chính được, phải nghe tuần tự từ đầu. Máy tìm kiếm cũng không biết " +
          "đâu là nội dung chính. Đây là khác biệt <b>không nhìn thấy được</b> — và đó chính là lí do nó hay bị bỏ qua."
        : "Bốn khối, bốn thẻ đúng nghĩa. Thứ tự <b>header → nav → main → footer</b> gần như mọi trang web đều theo. " +
          "Trong bốn khối này, chỉ <b>&lt;main&gt;</b> đổi giữa các trang — ba khối kia nên giống nhau ở mọi trang " +
          "để người xem không bị lạc. Và mỗi trang chỉ có <b>một</b> &lt;main&gt;; muốn chia nhỏ bên trong thì dùng &lt;section&gt;.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= KHOI.length) {
        loi(dungDiv()
          ? "Bỏ tích ô đó rồi xem lại dòng “trình đọc màn hình đọc ra”."
          : "Giờ tích ô <b>“dùng div hết”</b> — bản xem trước sẽ không đổi, nhưng dòng dưới thì đổi hẳn.");
        return;
      }
      k++; ve();
      var b = KHOI[k - 1];
      loi("Thêm <b>&lt;" + (dungDiv() ? "div" : b.the) + "&gt;</b>: " + esc(b.ten) + ". " +
        (b.the === "main" ? "Đây là khối <b>duy nhất</b> thay đổi giữa các trang."
                          : b.the === "footer" ? "Khối cuối, giống nhau ở mọi trang."
                          : "Khối này nên giống nhau ở mọi trang của website."));
    };
    function lamLai() { k = 0; ve(); loi("Trang đang trống. Bấm “Bước tiếp” để thêm khối đầu tiên."); }
    ganDatLai(node, [node.querySelector('[data-mh="div"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  napCss4();
})();
