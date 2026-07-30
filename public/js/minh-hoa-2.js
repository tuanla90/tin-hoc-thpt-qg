/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 2
 *
 *  Dùng khung dựng của js/minh-hoa.js (nạp SAU tệp đó). Mỗi minh hoạ tự có nút
 *  "Tự chạy" vì ganTuChay gắn chung ở injectMinhHoa.
 *
 *  KHOÁ ĐĂNG KÝ LÀ ID BÀI, không phải số bài trong slug — "bai-15" trong đường
 *  dẫn là thuộc tính order, hoàn toàn khác ID. Suy ID từ slug từng làm minh hoạ
 *  DNS nằm lạc sang bài Thiết kế mạng LAN.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss2() {
    if (document.getElementById("mhCss2")) return;
    var st = document.createElement("style");
    st.id = "mhCss2";
    st.textContent =
      /* bảng mã kí tự */
      ".mh-kt{display:flex;gap:5px;flex-wrap:wrap;justify-content:center}" +
      ".mh-kt-o{min-width:46px;border:2px solid var(--border);border-radius:9px;background:var(--bg-card);" +
        "padding:6px 5px;text-align:center;transition:all .25s}" +
      ".mh-kt-o.sang{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh-kt-o.nang{border-color:#f59e0b;background:#fef3c7}" +
      ".mh-kt-c{font:800 18px var(--font-mono);line-height:1.2}" +
      ".mh-kt-o small{display:block;font:700 10.5px var(--font-mono);color:var(--text-soft);margin-top:2px}" +
      /* ngăn xếp đệ quy */
      ".mh-xep{display:flex;flex-direction:column;gap:5px;align-items:center}" +
      ".mh-tang{width:100%;max-width:330px;border:2px solid var(--border);border-radius:10px;background:var(--bg-card);" +
        "padding:8px 12px;display:flex;justify-content:space-between;gap:10px;font:700 13.5px var(--font-mono);transition:all .25s}" +
      ".mh-tang.moi{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh-tang.tra{border-color:var(--success,#16a34a);background:color-mix(in srgb,var(--success,#16a34a) 12%,transparent)}" +
      ".mh-tang i{font-style:normal;color:var(--text-soft)}" +
      /* bảng dữ liệu (quan hệ / SQL) */
      ".mh-bang{border-collapse:collapse;margin:0 auto;font-size:13.5px}" +
      ".mh-bang th,.mh-bang td{border:1px solid var(--border);padding:6px 10px;text-align:left;transition:all .25s}" +
      ".mh-bang th{background:var(--bg-soft);font-weight:800;font-size:12.5px}" +
      ".mh-bang tr.chon td{background:var(--primary-soft)}" +
      ".mh-bang tr.loai td{opacity:.3}" +
      ".mh-bang td.cot{background:color-mix(in srgb,var(--success,#16a34a) 14%,transparent)}" +
      ".mh-bang th.cot{background:color-mix(in srgb,var(--success,#16a34a) 22%,transparent)}" +
      ".mh-hai{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}" +
      ".mh-hai h5{margin:0 0 6px;font-size:12.5px;text-align:center;color:var(--text-soft);font-family:var(--font-mono)}" +
      /* mô hình hộp CSS */
      ".mh-hop-css{margin:0 auto;text-align:center;font:700 11.5px var(--font-mono)}" +
      ".mh-lop{border:2px dashed transparent;padding:0;transition:all .3s}" +
      ".mh-margin{background:#fef3c7;border-color:#f59e0b}" +
      ".mh-border{background:#e9d5ff;border-color:#a855f7;border-style:solid}" +
      ".mh-padding{background:#ccfbf1;border-color:#0d9488}" +
      ".mh-content{background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center}" +
      ".mh-lop.mo{opacity:.25}" +
      /* tầng mạng */
      ".mh-goi{display:flex;gap:3px;justify-content:center;flex-wrap:wrap;margin-bottom:10px}" +
      ".mh-mieng{border:2px solid var(--border);border-radius:7px;padding:5px 8px;font:700 11.5px var(--font-mono);" +
        "background:var(--bg-card);transition:all .25s}" +
      ".mh-mieng.dau{background:#e9d5ff;border-color:#a855f7}" +
      ".mh-mieng.than{background:var(--primary);color:#fff;border-color:var(--primary)}";
    (document.head || document.documentElement).appendChild(st);
  }

  /* Chuỗi hiển thị an toàn — mọi minh hoạ dưới đây đều nhận chữ do người học gõ. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ==================================================================
   *  C10-22 · BẢNG MÃ KÍ TỰ VÀ DUNG LƯỢNG TỆP
   *  Điểm học sinh hay tắc: vì sao tệp tiếng Việt nặng hơn tệp tiếng Anh
   *  cùng số chữ. Gõ chữ có dấu vào là thấy ngay từng kí tự tốn mấy byte.
   * ================================================================ */
  MH.dangKy("C10-22", function (host) {
    var k = -1;

    var node = MH.el(MH.khung("Một dòng chữ nặng bao nhiêu byte?",
      "Máy tính lưu chữ bằng <b>mã số</b>. Bảng mã UTF-8 dùng <b>1 byte</b> cho chữ Latin không dấu, " +
      "nhưng phải <b>2–3 byte</b> cho chữ có dấu tiếng Việt. Gõ thử tên em rồi bấm từng kí tự để xem.",
      '<div class="mh-kt" data-mh="kt"></div><div class="mh-tong" data-mh="tong"></div>',
      '<label for="mhChu">Dòng chữ:</label>' +
      '<input class="mh-o-nhap" id="mhChu" data-mh="chu" type="text" value="Tiếng Việt" maxlength="24" style="max-width:240px">'));

    function chu() { return String(node.querySelector('[data-mh="chu"]').value || "Tiếng Việt").slice(0, 24); }
    /* Đếm byte UTF-8 thật bằng TextEncoder; không có thì suy từ điểm mã. */
    function soByte(c) {
      if (window.TextEncoder) return new TextEncoder().encode(c).length;
      var m = c.codePointAt(0);
      return m < 0x80 ? 1 : m < 0x800 ? 2 : 3;
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    function ve() {
      var s = [].concat(Array.from(chu()));
      node.querySelector('[data-mh="kt"]').innerHTML = s.map(function (c, i) {
        var b = soByte(c);
        var cls = "mh-kt-o" + (i <= k ? (b > 1 ? " nang" : " sang") : "");
        return '<div class="' + cls + '"><div class="mh-kt-c">' + (c === " " ? "␣" : esc(c)) + "</div>" +
          "<small>" + (i <= k ? b + " byte" : "?") + "</small></div>";
      }).join("");
      var daHien = s.slice(0, k + 1);
      var tong = daHien.reduce(function (t, c) { return t + soByte(c); }, 0);
      var coDau = daHien.filter(function (c) { return soByte(c) > 1; }).length;
      node.querySelector('[data-mh="tong"]').innerHTML =
        "<b>" + tong + "</b> byte cho " + daHien.length + "/" + s.length + " kí tự" +
        (coDau ? '<div style="font-size:12.5px;color:var(--text-soft);margin-top:3px">' + coDau +
          " kí tự có dấu tốn hơn 1 byte — đó là lí do tệp tiếng Việt nặng hơn tệp tiếng Anh cùng độ dài.</div>" : "");
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var s = Array.from(chu());
      if (k >= s.length - 1) {
        var t = s.reduce(function (a, c) { return a + soByte(c); }, 0);
        loi("Cả dòng <b>" + s.length + "</b> kí tự tốn <b>" + t + "</b> byte. " +
            "Nếu chỉ dùng bảng mã ASCII 1 byte thì không lưu nổi chữ có dấu.");
        return;
      }
      k++; ve();
      var c = s[k], b = soByte(c);
      loi("Kí tự <b>" + (c === " " ? "khoảng trắng" : esc(c)) + "</b> có mã <b>U+" +
          c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0") + "</b> → tốn <b>" + b + " byte</b>" +
          (b > 1 ? " (chữ có dấu nên phải dùng nhiều byte)." : "."));
    };
    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để tính từng kí tự một."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="chu"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-13 · TÌM KIẾM TUẦN TỰ
   *  Cố tình dùng CÙNG dãy mặc định với bài tìm kiếm nhị phân, để hai bài
   *  đặt cạnh nhau là thấy ngay chênh lệch số bước.
   * ================================================================ */
  MH.dangKy("C11-13", function (host) {
    var MAC_DINH = [3, 8, 12, 17, 23, 29, 34, 41, 47, 52, 58, 63, 70, 78, 85];
    var A, can, i, xong;

    var node = MH.el(MH.khung("Tìm kiếm tuần tự: dò từng ô từ đầu",
      "Thuật toán này <b>không cần dãy sắp xếp</b> — đổi lại nó phải dò lần lượt. " +
      "Thử tìm số ở gần cuối dãy, rồi so số bước với bài <b>tìm kiếm nhị phân</b> trên cùng dãy này.",
      '<div class="mh-mang" data-mh="mang"></div>',
      '<label for="mhTtSo">Tìm số:</label>' +
      '<input class="mh-o-nhap hep" id="mhTtSo" data-mh="can" type="number" min="0" max="999" value="78">' +
      '<label for="mhTtDay">trong dãy:</label>' +
      '<input class="mh-o-nhap" id="mhTtDay" data-mh="day" type="text" value="3 8 12 17 23 29 34 41 47 52 58 63 70 78 85">'));

    function dat() {
      var v = MH.docDay(node.querySelector('[data-mh="day"]').value, 20);
      A = v.length >= 2 ? v : MAC_DINH.slice();
      can = Math.floor(Number(node.querySelector('[data-mh="can"]').value)) || 0;
      i = -1; xong = false;
    }
    function ve() {
      node.querySelector('[data-mh="mang"]').innerHTML = A.map(function (v, n) {
        var c = "mh-o";
        if (xong && n === i) c += " thay";
        else if (n === i) c += " giua";
        else if (n < i) c += " ngoai";
        return '<div class="' + c + '">' + v + "</div>";
      }).join("");
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }
    /* log2 làm tròn lên = số bước tối đa của tìm kiếm nhị phân trên dãy này. */
    function buocNhiPhan() { return Math.ceil(Math.log2(A.length + 1)); }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (xong) {
        loi("Dò tuần tự mất <b>" + (i + 1) + "</b> bước. Tìm kiếm nhị phân trên cùng dãy " +
            A.length + " số chỉ cần tối đa <b>" + buocNhiPhan() + "</b> bước.");
        return;
      }
      if (i >= A.length - 1) {
        xong = true; i = A.length - 1; ve();
        loi("Đã dò hết <b>" + A.length + "</b> ô mà không thấy số " + can +
            ". Không tìm thấy thì tuần tự luôn phải quét TOÀN BỘ dãy.");
        return;
      }
      i++;
      if (A[i] === can) { xong = true; ve(); loi("Ô thứ <b>" + (i + 1) + "</b> là <b>" + can + "</b> → tìm thấy."); }
      else { ve(); loi("Ô thứ " + (i + 1) + " là " + A[i] + ", không phải " + can + " → dò tiếp ô sau."); }
    };
    function lamLai() { dat(); ve(); loi("Tìm <b>" + can + "</b> trong " + A.length + " số. Bấm “Bước tiếp”."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="can"]').oninput = lamLai;
    node.querySelector('[data-mh="day"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-19 · ĐỆ QUY
   *  Khái niệm khó nhất của lớp 11. Chỗ tắc không phải công thức mà là
   *  "hàm chưa xong đã gọi chính nó thì cái nào chạy trước". Vẽ NGĂN XẾP
   *  lời gọi: đi xuống tới điều kiện dừng, rồi trả về ngược lên.
   * ================================================================ */
  MH.dangKy("C11-19", function (host) {
    var n, xep, pha, tra;

    var node = MH.el(MH.khung("Đệ quy: ngăn xếp lời gọi đi xuống rồi trả về",
      "Tính <b>n!</b> bằng đệ quy. Mỗi lời gọi phải <b>chờ</b> lời gọi bên trong xong mới tính được — " +
      "nên máy xếp chúng thành chồng, đi xuống tới <b>điều kiện dừng</b> rồi mới trả kết quả ngược lên.",
      '<div class="mh-xep" data-mh="xep"></div>',
      '<label for="mhN">Tính n! với n =</label>' +
      '<input class="mh-o-nhap hep" id="mhN" data-mh="n" type="number" min="1" max="8" value="4">' +
      '<span style="font-size:12.5px;color:var(--text-soft)">1–8</span>'));

    function dat() {
      n = Math.min(8, Math.max(1, Math.floor(Number(node.querySelector('[data-mh="n"]').value) || 4)));
      xep = []; pha = "xuong"; tra = null;
    }
    function ve(nhanMoi) {
      node.querySelector('[data-mh="xep"]').innerHTML = xep.map(function (o, idx) {
        var c = "mh-tang" + (idx === xep.length - 1 && nhanMoi === "moi" ? " moi" : "") +
                (o.kq !== null ? " tra" : "");
        return '<div class="' + c + '">giaiThua(' + o.k + ")" +
          "<i>" + (o.kq !== null ? "= " + o.kq : "chờ…") + "</i></div>";
      }).join("");
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (pha === "xuong") {
        var k = xep.length ? xep[xep.length - 1].k - 1 : n;
        xep.push({ k: k, kq: null });
        ve("moi");
        if (k <= 1) {
          xep[xep.length - 1].kq = 1; pha = "len"; ve();
          loi("giaiThua(1) là <b>điều kiện dừng</b> → trả về 1 ngay, không gọi thêm. " +
              "Không có điều kiện dừng thì ngăn xếp lớn mãi và chương trình sập.");
        } else {
          loi("giaiThua(" + k + ") cần biết giaiThua(" + (k - 1) + ") mới tính được → " +
              "<b>gọi tiếp</b> và tự xếp mình vào chồng chờ.");
        }
        return;
      }
      /* Pha trả về: lấy kết quả của tầng dưới nhân lên rồi bỏ tầng đó khỏi chồng. */
      var duoi = xep.pop();
      if (!xep.length) {
        xep.push(duoi); ve();
        loi("Xong: <b>" + n + "! = " + duoi.kq + "</b>. Ngăn xếp rỗng trở lại — " +
            "mỗi lời gọi chỉ kết thúc SAU khi lời gọi bên trong nó xong.");
        pha = "het";
        return;
      }
      var me = xep[xep.length - 1];
      me.kq = me.k * duoi.kq;
      ve();
      loi("giaiThua(" + duoi.k + ") trả về " + duoi.kq + " → giaiThua(" + me.k + ") tính được " +
          me.k + " × " + duoi.kq + " = <b>" + me.kq + "</b>.");
    };
    function lamLai() { dat(); ve(); loi("Bấm “Bước tiếp” để gọi giaiThua(" + n + ")."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="n"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-07 · MÔ HÌNH DỮ LIỆU QUAN HỆ
   *  Chỗ tắc: khoá ngoài để làm gì. Bấm một học sinh -> thấy đúng những
   *  bản ghi bên bảng kia trỏ về em ấy.
   * ================================================================ */
  MH.dangKy("C11-07", function (host) {
    var HS = [
      { ma: "HS01", ten: "An", lop: "12A" },
      { ma: "HS02", ten: "Bình", lop: "12A" },
      { ma: "HS03", ten: "Chi", lop: "12B" },
    ];
    var MUON = [
      { ma: "HS01", sach: "Toán 12" }, { ma: "HS03", sach: "Lí 12" },
      { ma: "HS01", sach: "Tin 12" }, { ma: "HS02", sach: "Văn 12" },
      { ma: "HS03", sach: "Hoá 12" },
    ];
    var k = -1;

    var node = MH.el(MH.khung("Khoá ngoài nối hai bảng lại với nhau",
      "Bảng <b>HOCSINH</b> có <b>khoá chính</b> MaHS — không hai em nào trùng. Bảng <b>MUONSACH</b> " +
      "chỉ ghi lại MaHS, gọi là <b>khoá ngoài</b>: nhờ nó máy biết phiếu mượn thuộc về ai mà " +
      "không phải chép lại tên và lớp. Bấm từng học sinh để xem.",
      '<div class="mh-hai" data-mh="hai"></div>'));

    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }
    function ve() {
      var chon = k >= 0 ? HS[k % HS.length] : null;
      var b1 = "<div><h5>HOCSINH</h5><table class=\"mh-bang\"><tr><th>MaHS</th><th>HoTen</th><th>Lop</th></tr>" +
        HS.map(function (h) {
          return "<tr class=\"" + (chon && h.ma === chon.ma ? "chon" : "") + "\"><td>" + h.ma +
            "</td><td>" + h.ten + "</td><td>" + h.lop + "</td></tr>";
        }).join("") + "</table></div>";
      var b2 = "<div><h5>MUONSACH</h5><table class=\"mh-bang\"><tr><th>MaHS</th><th>TenSach</th></tr>" +
        MUON.map(function (m) {
          var cls = chon ? (m.ma === chon.ma ? "chon" : "loai") : "";
          return "<tr class=\"" + cls + "\"><td>" + m.ma + "</td><td>" + m.sach + "</td></tr>";
        }).join("") + "</table></div>";
      node.querySelector('[data-mh="hai"]').innerHTML = b1 + b2;
      /* Bấm thẳng vào dòng cho nhanh hơn bấm nút. */
      node.querySelectorAll(".mh-bang tr").forEach(function (tr) {
        var ma = tr.cells[0] && tr.cells[0].textContent;
        var idx = HS.findIndex(function (h) { return h.ma === ma; });
        if (idx >= 0) { tr.style.cursor = "pointer"; tr.onclick = function () { k = idx; ve(); noiVe(); }; }
      });
    }
    function noiVe() {
      var chon = HS[k % HS.length];
      var ds = MUON.filter(function (m) { return m.ma === chon.ma; });
      loi("<b>" + chon.ten + "</b> (" + chon.ma + ") đang mượn <b>" + ds.length + "</b> quyển: " +
          ds.map(function (m) { return m.sach; }).join(", ") +
          ". Bảng MUONSACH không cần chép tên hay lớp — sửa lớp của em ấy ở một chỗ là mọi phiếu mượn đúng theo.");
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= HS.length - 1) { loi("Đó là ý nghĩa của <b>quan hệ</b>: dữ liệu ghi một lần, nối với nhau bằng khoá."); return; }
      k++; ve(); noiVe();
    };
    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp”, hoặc bấm thẳng vào một học sinh."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-09 · SQL SELECT
   *  Chỗ tắc: thứ tự thực hiện. Học sinh đọc "SELECT ... FROM ... WHERE"
   *  từ trái sang phải nên tưởng chọn cột trước. Máy làm ngược: lấy bảng,
   *  LỌC DÒNG, rồi mới cắt cột.
   * ================================================================ */
  MH.dangKy("C11-09", function (host) {
    var T = [
      { ma: "HS01", ten: "An", lop: "12A", diem: 8.5 },
      { ma: "HS02", ten: "Bình", lop: "12A", diem: 6.0 },
      { ma: "HS03", ten: "Chi", lop: "12B", diem: 9.0 },
      { ma: "HS04", ten: "Dũng", lop: "12B", diem: 7.5 },
      { ma: "HS05", ten: "Hà", lop: "12A", diem: 5.5 },
    ];
    var COT = ["ma", "ten", "lop", "diem"];
    var NHAN = { ma: "MaHS", ten: "HoTen", lop: "Lop", diem: "Diem" };
    var k = -1;

    var node = MH.el(MH.khung("SELECT chạy theo thứ tự nào?",
      "Câu lệnh viết là <code>SELECT HoTen, Diem FROM HOCSINH WHERE Diem &gt;= ?</code> nhưng máy " +
      "<b>không</b> làm từ trái sang phải: nó lấy bảng trước, <b>lọc dòng</b> theo WHERE, rồi mới " +
      "<b>cắt cột</b> theo SELECT. Đổi mốc điểm để xem.",
      '<div data-mh="cau" style="text-align:center;font:700 13.5px var(--font-mono);margin-bottom:10px;color:var(--primary)"></div>' +
      '<div data-mh="bang"></div>',
      '<label for="mhDiem">WHERE Diem &gt;=</label>' +
      '<input class="mh-o-nhap hep" id="mhDiem" data-mh="diem" type="number" min="0" max="10" step="0.5" value="7">'));

    function moc() { var v = Number(node.querySelector('[data-mh="diem"]').value); return isFinite(v) ? v : 7; }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }
    function ve() {
      var m = moc();
      var locDong = k >= 1, catCot = k >= 2;
      var hienCot = catCot ? ["ten", "diem"] : COT;
      node.querySelector('[data-mh="cau"]').textContent =
        "SELECT HoTen, Diem FROM HOCSINH WHERE Diem >= " + m;
      var html = '<table class="mh-bang"><tr>' + COT.map(function (c) {
        return "<th class=\"" + (catCot && hienCot.indexOf(c) >= 0 ? "cot" : "") + "\">" + NHAN[c] + "</th>";
      }).join("") + "</tr>" +
        T.map(function (r) {
          var giu = r.diem >= m;
          return "<tr class=\"" + (locDong ? (giu ? "chon" : "loai") : "") + "\">" +
            COT.map(function (c) {
              return "<td class=\"" + (catCot && giu && hienCot.indexOf(c) >= 0 ? "cot" : "") + "\">" + r[c] + "</td>";
            }).join("") + "</tr>";
        }).join("") + "</table>";
      node.querySelector('[data-mh="bang"]').innerHTML = html;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var m = moc(), giu = T.filter(function (r) { return r.diem >= m; });
      if (k >= 2) {
        loi("Kết quả: <b>" + giu.length + "</b> dòng × <b>2</b> cột. Nhớ thứ tự thật: " +
            "<b>FROM → WHERE → SELECT</b>, không phải theo thứ tự chữ viết.");
        return;
      }
      k++; ve();
      if (k === 0) loi("<b>Bước 1 — FROM HOCSINH:</b> lấy toàn bộ bảng, " + T.length + " dòng × " + COT.length + " cột.");
      else if (k === 1) loi("<b>Bước 2 — WHERE Diem &gt;= " + m + ":</b> bỏ những dòng không thoả, còn <b>" +
                            giu.length + "</b> dòng. Cột vẫn đủ.");
      else loi("<b>Bước 3 — SELECT HoTen, Diem:</b> giờ mới cắt lấy 2 cột cần. " +
               "Cột Lop bị bỏ ở bước này, nhưng WHERE ở bước trước vẫn dùng được nó — đó là vì WHERE chạy TRƯỚC.");
    };
    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để chạy câu lệnh theo đúng thứ tự máy làm."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="diem"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-11 · MÔ HÌNH HỘP CSS
   *  Chỗ tắc: vì sao đặt width:200px mà hộp chiếm hơn 200px. Cho gõ số
   *  rồi hiện phép cộng ra tổng chiều rộng thật.
   * ================================================================ */
  MH.dangKy("C12-11", function (host) {
    var LOP = ["content", "padding", "border", "margin"];
    var k = -1;

    var node = MH.el(MH.khung("Vì sao width: 200px mà hộp rộng hơn 200px?",
      "Một hộp gồm bốn lớp bọc nhau: <b>nội dung</b> → <b>padding</b> → <b>viền</b> → <b>lề</b>. " +
      "Thuộc tính <code>width</code> chỉ tính <b>nội dung</b>, ba lớp kia cộng thêm vào. Gõ số để thử.",
      '<div class="mh-hop-css" data-mh="hop"></div><div class="mh-tong" data-mh="tong"></div>',
      '<label for="mhW">width</label><input class="mh-o-nhap hep" id="mhW" data-mh="w" type="number" min="40" max="240" value="200">' +
      '<label for="mhP">padding</label><input class="mh-o-nhap hep" id="mhP" data-mh="p" type="number" min="0" max="40" value="16">' +
      '<label for="mhB">border</label><input class="mh-o-nhap hep" id="mhB" data-mh="b" type="number" min="0" max="20" value="4">' +
      '<label for="mhM">margin</label><input class="mh-o-nhap hep" id="mhM" data-mh="m" type="number" min="0" max="40" value="12">'));

    function so(t, mac, tran) {
      var v = Math.floor(Number(node.querySelector('[data-mh="' + t + '"]').value));
      if (!isFinite(v) || v < 0) v = mac;
      return Math.min(tran, v);
    }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }

    function ve() {
      var w = so("w", 200, 240), p = so("p", 16, 40), b = so("b", 4, 20), m = so("m", 12, 40);
      var mo = function (ten) { return k >= 0 && LOP.indexOf(ten) > k ? " mo" : ""; };
      node.querySelector('[data-mh="hop"]').innerHTML =
        '<div class="mh-lop mh-margin' + mo("margin") + '" style="padding:' + m + 'px;display:inline-block">' +
          '<div class="mh-lop mh-border' + mo("border") + '" style="border-width:' + b + 'px;display:inline-block">' +
            '<div class="mh-lop mh-padding' + mo("padding") + '" style="padding:' + p + 'px;display:inline-block">' +
              '<div class="mh-lop mh-content" style="width:' + w + 'px;height:46px">width ' + w + "px</div>" +
            "</div></div></div>";
      var chiem = w + 2 * p + 2 * b;
      var cho = chiem + 2 * m;
      node.querySelector('[data-mh="tong"]').innerHTML =
        "Hộp chiếm <b>" + chiem + "px</b>" +
        '<div style="font-size:12.5px;color:var(--text-soft);margin-top:3px">' +
        w + " (nội dung) + " + p + "×2 (padding) + " + b + "×2 (viền) = " + chiem +
        "px · cộng lề " + m + "×2 thì choán " + cho + "px trên trang</div>";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= LOP.length - 1) {
        loi("Muốn <code>width</code> tính luôn padding và viền thì đặt " +
            "<code>box-sizing: border-box</code> — khi đó 200px là tổng, không phải riêng nội dung.");
        return;
      }
      k++; ve();
      var t = ["<b>content</b> — vùng chữ thật, đúng bằng width.",
               "<b>padding</b> — khoảng đệm bên trong viền, đẩy chữ xa viền ra.",
               "<b>border</b> — viền, cũng chiếm chỗ chứ không phải nét vẽ suông.",
               "<b>margin</b> — lề bên ngoài, không thuộc hộp nhưng đẩy các hộp khác ra xa."][k];
      loi(t);
    };
    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để bóc từng lớp, hoặc gõ số để xem tổng đổi ngay."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    ["w", "p", "b", "m"].forEach(function (t) {
      node.querySelector('[data-mh="' + t + '"]').oninput = function () { ve(); };
    });
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-03 · KIẾN TRÚC MẠNG PHÂN TẦNG
   *  Chỗ tắc: "phân tầng" nghe trừu tượng. Cho thấy mỗi tầng BỌC THÊM
   *  phần đầu của mình vào gói, và bên nhận bóc ngược lại.
   * ================================================================ */
  MH.dangKy("C12-03", function (host) {
    var TANG = [
      { ten: "Ứng dụng", dau: "HTTP", noi: "Tầng ứng dụng tạo nội dung: “GET /trang-chu”. Chưa quan tâm đường đi thế nào." },
      { ten: "Giao vận", dau: "TCP", noi: "Tầng giao vận thêm đầu <b>TCP</b>: số cổng và số thứ tự, để bên nhận ghép lại đúng thứ tự và biết gói nào thiếu." },
      { ten: "Mạng", dau: "IP", noi: "Tầng mạng thêm đầu <b>IP</b>: địa chỉ máy gửi và máy nhận, để các bộ định tuyến biết chuyển đi đâu." },
      { ten: "Liên kết", dau: "MAC", noi: "Tầng liên kết thêm đầu <b>MAC</b>: địa chỉ thiết bị trong đoạn mạng ngay trước mặt." },
    ];
    var k = -1, boc = false;

    var node = MH.el(MH.khung("Phân tầng: mỗi tầng bọc thêm một lớp đầu gói",
      "Dữ liệu đi <b>xuống</b> qua các tầng, mỗi tầng thêm phần <b>đầu gói</b> của riêng nó — như " +
      "cho thư vào phong bì rồi cho phong bì vào thùng. Bên nhận bóc ngược lại. Nhờ vậy đổi Wi-Fi " +
      "sang dây mạng thì chỉ tầng dưới cùng đổi, phần trên không phải sửa gì.",
      '<div class="mh-goi" data-mh="goi"></div><div style="text-align:center;font-size:12.5px;color:var(--text-soft)" data-mh="nhan"></div>',
      '<label for="mhTin">Nội dung gửi:</label>' +
      '<input class="mh-o-nhap" id="mhTin" data-mh="tin" type="text" value="GET /trang-chu" maxlength="22" style="max-width:220px">'));

    function tin() { return String(node.querySelector('[data-mh="tin"]').value || "GET /trang-chu").slice(0, 22); }
    function loi(t) { node.querySelector('[data-mh="loi"]').innerHTML = t; }
    function ve() {
      var n = boc ? TANG.length - 1 - k : k;   // pha bóc: bỏ dần từ ngoài vào
      var dau = [];
      for (var i = TANG.length - 1; i >= 1; i--) if (i <= n) dau.push(TANG[i].dau);
      var html = dau.map(function (d) { return '<span class="mh-mieng dau">' + d + "</span>"; }).join("") +
        '<span class="mh-mieng than">' + esc(tin()) + "</span>";
      node.querySelector('[data-mh="goi"]').innerHTML = html;
      node.querySelector('[data-mh="nhan"]').textContent =
        n < 0 ? "" : (boc ? "Bên NHẬN đang bóc — còn " + (n + 1) + " tầng"
                          : "Bên GỬI đang bọc — tầng " + TANG[Math.max(0, n)].ten);
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (!boc) {
        if (k >= TANG.length - 1) {
          boc = true; k = 0; ve();
          loi("Gói đã đủ lớp, truyền qua đường mạng. Giờ <b>bên nhận bóc ngược</b>: tầng dưới cùng bóc trước.");
          return;
        }
        k++; ve(); loi(TANG[k].noi);
        return;
      }
      if (k >= TANG.length - 1) {
        loi("Bóc hết các đầu gói, tầng ứng dụng bên nhận nhận đúng <b>" + esc(tin()) +
            "</b> như lúc gửi. Mỗi tầng chỉ đọc phần đầu của mình và không cần biết các tầng khác làm gì.");
        return;
      }
      k++; ve();
      var t = TANG[TANG.length - 1 - k];
      loi("Bóc đầu <b>" + TANG[TANG.length - k].dau + "</b> ra, chuyển phần còn lại lên tầng <b>" + t.ten + "</b>.");
    };
    function lamLai() { k = -1; boc = false; ve(); loi("Bấm “Bước tiếp” để bọc gói từ tầng ứng dụng xuống."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    node.querySelector('[data-mh="tin"]').oninput = lamLai;
    host.appendChild(node); lamLai();
  });

  napCss2();
})();
