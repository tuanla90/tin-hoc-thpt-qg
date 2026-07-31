/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 3
 *
 *  Dùng khung dựng của js/minh-hoa.js (nạp SAU tệp đó). Mỗi minh hoạ tự có nút
 *  "Tự chạy" vì ganTuChay gắn chung ở injectMinhHoa.
 *
 *  KHOÁ ĐĂNG KÝ LÀ ID BÀI (C10-24), KHÔNG phải số bài trong slug — "bai-6" trong
 *  đường dẫn là thuộc tính order, hoàn toàn khác ID.
 *
 *  MÀU LẤY TỪ BIẾN GIAO DIỆN, không đóng cứng mã hex như hai đợt trước: hai đợt
 *  đó viết trước lúc có chế độ tối nên nền #fef3c7 vẫn sáng khi cả trang đã tối,
 *  chữ đen trên đó thì đọc được nhưng lệch hẳn khỏi phần còn lại.
 *
 *  MỖI MINH HOẠ Ở ĐÂY ĐỀU NHẮM VÀO MỘT NGỘ NHẬN CỤ THỂ, không phải "vẽ lại bài
 *  cho có hình". Chỗ nào học sinh tin sai thì cho bấm để tự thấy mình sai — ghi
 *  rõ ngộ nhận đó trong lời bình đầu mỗi phần.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss3() {
    if (document.getElementById("mhCss3")) return;
    var st = document.createElement("style");
    st.id = "mhCss3";
    st.textContent =
      /* --- bảng (chân trị, vòng lặp, độ phức tạp) --- */
      ".mh3-b{border-collapse:collapse;margin:0 auto;font:600 13.5px var(--font-mono)}" +
      ".mh3-b th,.mh3-b td{border:1px solid var(--border);padding:6px 11px;text-align:center;transition:all .25s}" +
      ".mh3-b th{background:var(--bg-soft);font:800 12px var(--font-sans)}" +
      ".mh3-b td.an{color:transparent}" +
      ".mh3-b tr.nay td{background:var(--primary-soft)}" +
      ".mh3-b .d{color:var(--success);font-weight:800}" +
      ".mh3-b .s{color:var(--danger);font-weight:800}" +
      ".mh3-b td.khac{background:var(--danger-soft)}" +
      /* --- khối code có tô dòng đang chạy --- */
      ".mh3-code{margin:0 auto;max-width:420px;font:600 13.5px/1.75 var(--font-mono);" +
        "background:var(--code-bg,var(--bg-card));border-radius:10px;padding:10px 0;overflow-x:auto}" +
      /* xem chú thích .mh7-d: nền dòng đang sáng phải trải hết bề rộng CUỘN */
      ".mh3-d{padding:1px 14px;white-space:pre;width:max-content;min-width:100%;" +
        "box-sizing:border-box;border-left:3px solid transparent;transition:all .2s}" +
      ".mh3-d.nay{border-left-color:var(--primary);background:var(--primary-soft)}" +
      ".mh3-d.chay{border-left-color:var(--success);background:var(--success-soft)}" +
      ".mh3-d.bo{opacity:.35}" +
      ".mh3-d i{font-style:normal;color:var(--text-soft);font-size:12px}" +
      /* --- thanh so sánh độ lớn --- */
      ".mh3-cot{display:grid;gap:7px;max-width:460px;margin:0 auto}" +
      ".mh3-cot-h{display:grid;grid-template-columns:88px 1fr auto;gap:9px;align-items:center;font-size:12.5px}" +
      ".mh3-cot-h b{font:800 12px var(--font-sans)}" +
      ".mh3-ray{height:16px;border-radius:8px;background:var(--bg-card);border:1px solid var(--border);overflow:hidden}" +
      ".mh3-ray span{display:block;height:100%;border-radius:8px;background:var(--primary);transition:width .4s ease}" +
      ".mh3-ray.canh span{background:var(--warning)}" +
      ".mh3-ray.nang span{background:var(--danger)}" +
      ".mh3-num{font:700 12.5px var(--font-mono);min-width:74px;text-align:right}" +
      /* --- hai cột song song (ngăn xếp / hàng đợi) --- */
      ".mh3-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}" +
      ".mh3-2 h5{margin:0 0 7px;font:800 12.5px var(--font-sans);text-align:center;color:var(--text-soft)}" +
      ".mh3-hop{border:1px solid var(--border);border-radius:11px;background:var(--bg-card);padding:9px;min-height:132px;" +
        "display:flex;flex-direction:column;justify-content:flex-end;gap:4px}" +
      ".mh3-hop.ngang{flex-direction:row;align-items:flex-end;justify-content:flex-start}" +
      ".mh3-the{border:2px solid var(--border);border-radius:8px;background:var(--bg-soft);text-align:center;" +
        "padding:7px 4px;font:800 14px var(--font-mono);transition:all .25s}" +
      ".mh3-the.moi{border-color:var(--primary);background:var(--primary-soft);color:var(--primary)}" +
      ".mh3-the.ra{border-color:var(--success);background:var(--success-soft);color:var(--success)}" +
      ".mh3-hop.ngang .mh3-the{min-width:34px}" +
      ".mh3-ket{margin-top:7px;text-align:center;font:700 13px var(--font-mono);color:var(--text-soft);min-height:20px}" +
      /* --- trục số (phân loại, cắt lát) --- */
      ".mh3-truc{position:relative;height:74px;margin:6px 4px 0}" +
      ".mh3-vach{position:absolute;left:0;right:0;top:37px;height:2px;background:var(--border-strong)}" +
      ".mh3-diem{position:absolute;width:15px;height:15px;border-radius:50%;transform:translate(-50%,-50%);" +
        "border:2px solid var(--bg-card);transition:all .3s}" +
      ".mh3-diem.co{background:var(--success)}" +
      ".mh3-diem.khong{background:var(--danger)}" +
      ".mh3-diem.sai{box-shadow:0 0 0 4px var(--warning)}" +
      ".mh3-nguong{position:absolute;top:6px;bottom:6px;width:3px;background:var(--primary);transform:translateX(-50%);" +
        "transition:left .3s ease}" +
      ".mh3-nguong b{position:absolute;top:-4px;left:50%;transform:translateX(-50%);white-space:nowrap;" +
        "font:800 11px var(--font-mono);color:var(--primary);background:var(--bg-soft);padding:0 4px;border-radius:5px}" +
      /* --- khung xem trước bố cục CSS --- */
      ".mh3-khung-css{border:2px dashed var(--border-strong);border-radius:10px;background:var(--bg-card);" +
        "min-height:112px;padding:8px;display:flex;gap:7px;transition:all .35s ease}" +
      ".mh3-khoi{background:var(--primary);color:#fff;border-radius:8px;padding:11px 13px;font:800 13px var(--font-mono);" +
        "transition:all .35s ease;white-space:nowrap}" +
      /* --- ô nhập dạng thanh trượt --- */
      /* Cao 44px chứ không phải 26px: đây là thứ học sinh phải KÉO, mà 26px chỉ
         bằng 59% ngón tay. touch-action:manipulation để cú kéo hơi chéo không
         bị trình duyệt hiểu thành cuộn trang. Ở màn hẹp giãn hết bề ngang —
         150px trên màn 360px là kéo rất thô. */
      ".mh input.mh3-range{accent-color:var(--primary);width:150px;max-width:100%;" +
        "height:44px;padding:0;border:0;background:none;min-height:44px;touch-action:manipulation}" +
      "@media(max-width:560px){.mh input.mh3-range{width:100%}}" +
      ".mh select.mh3-chon{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text);border-radius:10px;" +
        "padding:8px 10px;font:700 14px var(--font-mono);min-height:40px;max-width:210px}" +
      ".mh select.mh3-chon:focus{outline:none;border-color:var(--primary)}" +
      /* --- dòng phép tính hiện dần --- */
      ".mh3-tinh{display:grid;gap:6px;max-width:430px;margin:0 auto;font:600 13.5px var(--font-mono)}" +
      ".mh3-tinh div{display:flex;justify-content:space-between;gap:10px;padding:7px 11px;border-radius:9px;" +
        "background:var(--bg-card);border:1px solid var(--border);opacity:.32;transition:all .3s}" +
      ".mh3-tinh div.hien{opacity:1}" +
      ".mh3-tinh div.chot{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh3-tinh i{font-style:normal;color:var(--text-soft);font:600 12.5px var(--font-sans)}" +
      ".mh3-tinh b{font-family:var(--font-mono);color:var(--primary)}" +
      /* --- ghi chú cảnh báo trong khung --- */
      ".mh3-canh{margin:11px auto 0;max-width:440px;border-radius:9px;padding:8px 11px;font-size:12.5px;line-height:1.5;" +
        "background:var(--warning-soft);color:var(--text);border:1px solid var(--warning)}" +
      ".mh3-canh.xong{background:var(--success-soft);border-color:var(--success)}" +
      /* --- hộp chọn phương án (bật/tắt một biến thể) --- */
      ".mh3-tick{display:inline-flex;align-items:center;gap:6px;font:700 12.5px var(--font-sans);color:var(--text-soft);cursor:pointer}" +
      ".mh3-tick input{accent-color:var(--primary);width:16px;height:16px}" +
      "@media (max-width:560px){.mh3-2{grid-template-columns:1fr}.mh3-cot-h{grid-template-columns:70px 1fr auto}" +
        ".mh3-b th,.mh3-b td{padding:5px 7px;font-size:12.5px}}";
    (document.head || document.documentElement).appendChild(st);
  }

  /* Mọi minh hoạ dưới đây đều hiển thị lại chữ do người học gõ. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* Nhóm nghìn bằng DẤU CHẤM theo cách viết số của tiếng Việt — toLocaleString
     phụ thuộc ngôn ngữ trình duyệt nên máy đặt tiếng Anh sẽ ra "1,048,576". */
  function so(n) {
    var x = Math.round(Number(n) || 0);
    return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  /* Số thập phân viết DẤU PHẨY. Cùng lí do như hàm so() ở trên: toFixed luôn ra
     "5.93" kiểu Anh, đặt cạnh "1.920 × 1.080" thì dấu chấm mang hai nghĩa khác
     nhau trong cùng một khung — học sinh đọc "5.93 MB" thành năm nghìn chín trăm. */
  function thap(x, n) {
    return Number(x).toFixed(n == null ? 1 : n).replace(".", ",");
  }
  /* Số có thể nguyên hoặc lẻ (điểm 7 và điểm 6,5; ngưỡng 6,5 giờ): số nguyên thì
     đừng thêm ",0" vào — "điểm 7,0" đọc lên đã lạ so với cách nói trong lớp. */
  function num(x) {
    var v = Number(x);
    return Number.isInteger(v) ? String(v) : thap(v, 1);
  }
  function loiCua(node) {
    return function (t) { node.querySelector('[data-mh="loi"]').innerHTML = t; };
  }
  /* Thanh trượt và ô chọn cũng phải huỷ chế độ Tự chạy như ô .mh-o-nhap. Cách
     rẻ nhất: bấm hộ nút "Làm lại" — ganTuChay đã gắn hàm dừng vào chính nút đó.

     veTaiCho (tuỳ chọn): đổi dữ liệu vào thì VẼ LẠI TẠI BƯỚC ĐANG ĐỨNG thay vì
     quay về bước 0. Chỉ dùng được khi đổi dữ liệu KHÔNG làm hỏng các bước đã đi —
     ví dụ bài tính dung lượng ảnh, kéo thanh "rộng" thì cả năm phép tính vẫn đúng,
     chỉ khác con số. Còn bài dò từng ô của một dãy thì đổi dãy là mọi bước trước
     thành vô nghĩa, phải quay về đầu.
     Trước đây MỌI mô phỏng đều quay về đầu, nên đi tới bước 4 rồi lỡ tay nhích
     thanh trượt là mất sạch chỗ đang đứng. */
  function ganDatLai(node, ds, lamLai, veTaiCho) {
    var lai = node.querySelector('[data-mh="lai"]');
    lai.onclick = lamLai;
    ds.forEach(function (o) {
      if (!o) return;
      var su = o.tagName === "SELECT" || o.type === "checkbox" ? "change" : "input";
      o.addEventListener(su, function () {
        /* Vẫn phải bấm "Làm lại" để dừng chế độ Tự chạy, nhưng nếu giữ được bước
           thì gắn tạm hàm khác vào nút rồi trả lại ngay. */
        if (!veTaiCho) { lai.click(); return; }
        lai.onclick = veTaiCho;
        lai.click();
        lai.onclick = lamLai;
      });
    });
  }

  /* ==================================================================
   *  C10-24 · BẢNG CHÂN TRỊ VÀ HAI BIỂU THỨC TƯƠNG ĐƯƠNG
   *
   *  NGỘ NHẬN: "not (A and B)" thì đổi thành "not A and not B" — đổi dấu
   *  từng vế là xong. Sai, và sai kiểu này ăn đúng vào câu Đ/S trong đề.
   *  Cách chữa duy nhất có tác dụng là bắt dò TỪNG DÒNG bảng chân trị rồi
   *  tự tìm ra dòng khác nhau, chứ không phải học vẹt định luật De Morgan.
   * ================================================================ */
  var BIEU_THUC = [
    { ma: "A and B",         f: function (a, b) { return a && b; } },
    { ma: "A or B",          f: function (a, b) { return a || b; } },
    { ma: "not (A and B)",   f: function (a, b) { return !(a && b); } },
    { ma: "not A or not B",  f: function (a, b) { return !a || !b; } },
    { ma: "not A and not B", f: function (a, b) { return !a && !b; } },
    { ma: "not (A or B)",    f: function (a, b) { return !(a || b); } },
    { ma: "A and not B",     f: function (a, b) { return a && !b; } },
    { ma: "A or not B",      f: function (a, b) { return a || !b; } },
  ];
  var TO_HOP = [[true, true], [true, false], [false, true], [false, false]];

  MH.dangKy("C10-24", function (host) {
    napCss3();
    var k = -1;   // số dòng đã tính

    function oChon(id, chon) {
      return '<select class="mh3-chon" id="' + id + '" data-mh="' + id + '" style="max-width:180px">' +
        BIEU_THUC.map(function (b, i) {
          return '<option value="' + i + '"' + (i === chon ? " selected" : "") + ">" + esc(b.ma) + "</option>";
        }).join("") + "</select>";
    }

    var node = MH.el(MH.khung("Hai biểu thức lôgic này có tương đương không?",
      "Cách duy nhất để biết chắc: lập <b>bảng chân trị</b> và so từng dòng. Chỉ cần <b>một dòng</b> khác nhau " +
      "là hai biểu thức KHÁC nhau. Mặc định đang để sẵn cặp mà học sinh hay đổi sai — " +
      "bấm từng dòng xem chúng có thật là một không.",
      '<div style="overflow-x:auto"><table class="mh3-b" data-mh="bang"></table></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhBt1">So:</label>' + oChon("bt1", 2) +
      '<label for="mhBt2">với</label>' + oChon("bt2", 4)));

    var loi = loiCua(node);
    function lay(n) { return BIEU_THUC[+node.querySelector('[data-mh="bt' + n + '"]').value]; }
    function dau(v) { return '<span class="' + (v ? "d" : "s") + '">' + (v ? "Đúng" : "Sai") + "</span>"; }

    /* Dòng lệch đầu tiên. Trả -1 nếu hai biểu thức trùng khớp cả bốn dòng. */
    function dongLech() {
      var p = lay(1), q = lay(2);
      for (var i = 0; i < TO_HOP.length; i++) {
        if (!!p.f(TO_HOP[i][0], TO_HOP[i][1]) !== !!q.f(TO_HOP[i][0], TO_HOP[i][1])) return i;
      }
      return -1;
    }

    function ve() {
      var p = lay(1), q = lay(2);
      var th = "<tr><th>A</th><th>B</th><th>" + esc(p.ma) + "</th><th>" + esc(q.ma) +
        "</th><th>Giống nhau?</th></tr>";
      var tr = TO_HOP.map(function (h, i) {
        var a = h[0], b = h[1];
        if (i > k) {
          return "<tr><td>" + dau(a) + "</td><td>" + dau(b) +
            '</td><td class="an">?</td><td class="an">?</td><td class="an">?</td></tr>';
        }
        var v1 = !!p.f(a, b), v2 = !!q.f(a, b), giong = v1 === v2;
        return '<tr class="' + (i === k ? "nay" : "") + '"><td>' + dau(a) + "</td><td>" + dau(b) +
          "</td><td>" + dau(v1) + "</td><td>" + dau(v2) + "</td>" +
          '<td class="' + (giong ? "" : "khac") + '">' +
          (giong ? '<span class="d">có</span>' : '<span class="s">KHÁC</span>') + "</td></tr>";
      }).join("");
      node.querySelector('[data-mh="bang"]').innerHTML = th + tr;

      /* Kết luận chỉ hiện khi đã dò hết bốn dòng — hiện sớm thì học sinh đọc đáp
         án rồi bỏ luôn việc dò, mất đúng phần có ích. */
      var canh = node.querySelector('[data-mh="canh"]');
      if (k < TO_HOP.length - 1) { canh.hidden = true; return; }
      var lech = dongLech();
      canh.hidden = false;
      canh.className = "mh3-canh" + (lech < 0 ? " xong" : "");
      canh.innerHTML = lech < 0
        ? "Cả <b>bốn</b> dòng đều giống nhau → hai biểu thức <b>tương đương</b>. Thay cái này bằng cái kia " +
          "trong chương trình thì kết quả không đổi."
        : "Dòng <b>A = " + (TO_HOP[lech][0] ? "Đúng" : "Sai") + ", B = " + (TO_HOP[lech][1] ? "Đúng" : "Sai") +
          "</b> cho hai kết quả khác nhau → hai biểu thức <b>KHÔNG tương đương</b>. " +
          "Chỉ cần một dòng lệch là đủ để kết luận, không cần xét thêm.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= TO_HOP.length - 1) {
        var lech = dongLech();
        loi(lech < 0
          ? "Xong bốn dòng và không có dòng nào lệch. Đổi ô chọn để thử cặp khác — thử " +
            "<b>not (A and B)</b> với <b>not A and not B</b> xem có còn tương đương nữa không."
          : "Xong. Mẹo nhớ: <b>not</b> đặt ngoài ngoặc thì khi bỏ ngoặc phải đổi luôn " +
            "<b>and</b> thành <b>or</b> (và ngược lại), không chỉ đổi dấu từng vế.");
        return;
      }
      k++; ve();
      var h = TO_HOP[k], p = lay(1), q = lay(2);
      var v1 = !!p.f(h[0], h[1]), v2 = !!q.f(h[0], h[1]);
      loi("A = <b>" + (h[0] ? "Đúng" : "Sai") + "</b>, B = <b>" + (h[1] ? "Đúng" : "Sai") + "</b> → " +
        esc(p.ma) + " cho <b>" + (v1 ? "Đúng" : "Sai") + "</b>, " + esc(q.ma) + " cho <b>" + (v2 ? "Đúng" : "Sai") +
        "</b>. " + (v1 === v2 ? "Dòng này khớp." : "<b>Dòng này lệch</b> — đã đủ để kết luận không tương đương."));
    };

    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để tính dòng đầu của bảng chân trị."); }
    ganDatLai(node, [node.querySelector('[data-mh="bt1"]'), node.querySelector('[data-mh="bt2"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-25 · DUNG LƯỢNG ẢNH VÀ CHUYỆN NÉN
   *
   *  NGỘ NHẬN: ảnh nặng bao nhiêu là do "chụp bằng máy xịn hay không".
   *  Thật ra chỉ có ba con số quyết định — rộng, cao, số bit mỗi điểm ảnh —
   *  và ba con số đó nhân với nhau. Cho kéo thanh trượt là thấy ngay quan hệ
   *  BÌNH PHƯƠNG: giảm nửa chiều rộng lẫn chiều cao thì tệp nhẹ đi bốn lần.
   * ================================================================ */
  MH.dangKy("C10-25", function (host) {
    var MAU = [
      { ten: "Đen trắng (1 bit)", bit: 1 },
      { ten: "256 màu (8 bit)", bit: 8 },
      { ten: "Màu thật (24 bit)", bit: 24 },
      { ten: "Màu thật + trong suốt (32 bit)", bit: 32 },
    ];
    var k = -1;

    var node = MH.el(MH.khung("Một tấm ảnh nặng bao nhiêu, và vì sao?",
      "Máy tính lưu ảnh bằng cách lưu <b>màu của từng điểm ảnh</b>. Nên dung lượng chỉ phụ thuộc ba con số: " +
      "rộng, cao và số <b>bit</b> dùng cho mỗi điểm. Kéo thanh trượt và bấm từng bước để xem phép tính.",
      '<div class="mh3-tinh" data-mh="tinh"></div><div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhR">Rộng:</label>' +
      '<input class="mh3-range" id="mhR" data-mh="r" type="range" min="160" max="4000" step="80" value="1920">' +
      '<span class="mh3-num" data-mh="rn"></span>' +
      '<label for="mhC">Cao:</label>' +
      '<input class="mh3-range" id="mhC" data-mh="c" type="range" min="120" max="3000" step="60" value="1080">' +
      '<span class="mh3-num" data-mh="cn"></span>' +
      '<label for="mhM">Màu:</label>' +
      '<select class="mh3-chon" id="mhM" data-mh="m" style="max-width:240px">' +
      MAU.map(function (m, i) {
        return '<option value="' + i + '"' + (i === 2 ? " selected" : "") + ">" + esc(m.ten) + "</option>";
      }).join("") + "</select>"));

    var loi = loiCua(node);
    function docSo(t) { return Math.round(Number(node.querySelector('[data-mh="' + t + '"]').value) || 0); }
    function thongSo() {
      var r = docSo("r"), c = docSo("c"), m = MAU[+node.querySelector('[data-mh="m"]').value];
      var diem = r * c, bit = diem * m.bit, byte = bit / 8;
      return { r: r, c: c, m: m, diem: diem, bit: bit, byte: byte, mb: byte / 1048576 };
    }
    function goiMB(mb) {
      return mb >= 1 ? thap(mb, mb < 10 ? 2 : 1) + " MB" : Math.round(mb * 1024) + " KB";
    }

    function ve() {
      var t = thongSo();
      node.querySelector('[data-mh="rn"]').textContent = so(t.r) + " px";
      node.querySelector('[data-mh="cn"]').textContent = so(t.c) + " px";
      var dong = [
        ["Số điểm ảnh", so(t.r) + " × " + so(t.c) + " = <b>" + so(t.diem) + "</b> điểm"],
        ["Mỗi điểm tốn " + t.m.bit + " bit", so(t.diem) + " × " + t.m.bit + " = <b>" + so(t.bit) + "</b> bit"],
        ["Đổi bit sang byte (chia 8)", so(t.bit) + " ÷ 8 = <b>" + so(t.byte) + "</b> byte"],
        ["Đổi sang đơn vị dễ đọc", "<b>" + goiMB(t.mb) + "</b> (chưa nén)"],
        ["Nén lại thành tệp JPG", "còn khoảng <b>" + goiMB(t.mb / 10) + "</b>"],
      ];
      node.querySelector('[data-mh="tinh"]').innerHTML = dong.map(function (d, i) {
        return '<div class="' + (i <= k ? "hien" : "") + (i === 3 && k >= 3 ? " chot" : "") +
          '"><i>' + d[0] + "</i><span>" + (i <= k ? d[1] : "…") + "</span></div>";
      }).join("");

      var canh = node.querySelector('[data-mh="canh"]');
      if (k < dong.length - 1) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh xong";
      /* Neo vào một vật thật để con số có nghĩa. Thẻ nhớ 32GB là thứ học sinh
         nào cũng từng cầm, dễ hình dung hơn "mấy chục megabyte". */
      var soAnh = Math.floor(32768 / Math.max(0.01, t.mb / 10));
      canh.innerHTML = "Nén là <b>bỏ đi những chi tiết mắt gần như không nhận ra</b>, nên tệp nhẹ đi khoảng " +
        "mười lần mà nhìn vẫn gần như cũ — đó là lí do ảnh trên máy em toàn là <b>.jpg</b> chứ không phải ảnh thô. " +
        "Một thẻ nhớ 32 GB chứa được khoảng <b>" + so(soAnh) + "</b> tấm cỡ này.";
    }

    /* Lời giải thích của từng bước, tính LẠI theo thông số hiện tại mỗi lần gọi —
       nhờ vậy kéo thanh trượt xong thì câu chữ cũng mang con số mới, không phải câu
       cũ của kích thước cũ. */
    function loiBuoc(b) {
      var t = thongSo();
      return [
        "Ảnh là một lưới điểm. Nhân rộng với cao ra <b>" + so(t.diem) + "</b> điểm ảnh — chỉ riêng con số này đã lớn.",
        "Mỗi điểm cần <b>" + t.m.bit + " bit</b> để ghi màu. Càng nhiều màu càng nhiều bit, nên ảnh đen trắng nhẹ hơn hẳn.",
        "Đơn vị dung lượng là <b>byte</b>, mà 1 byte = 8 bit, nên chia cho 8.",
        "<b>" + goiMB(t.mb) + "</b> cho MỘT tấm ảnh chưa nén. Chụp 100 tấm là hết " + goiMB(t.mb * 100) + ".",
        "Tệp <b>JPG</b> nén xuống còn khoảng một phần mười. Nén kiểu này làm mất một ít chi tiết — gọi là nén <b>có mất mát</b>.",
      ][b];
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= 4) {
        loi("Thử kéo <b>rộng</b> và <b>cao</b> xuống một nửa: dung lượng không giảm một nửa mà giảm " +
          "<b>bốn lần</b>, vì cả hai chiều đều bị nhân vào. Đó là ý nghĩa của “giảm độ phân giải”.");
        return;
      }
      k++; ve();
      loi(loiBuoc(k));
    };

    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để tính dung lượng theo từng phép một."); }
    /* Kéo thanh trượt thì GIỮ NGUYÊN bước đang đứng, chỉ tính lại con số và viết
       lại lời giải thích của đúng bước đó. Năm phép tính không phụ thuộc nhau nên
       đổi kích thước giữa chừng vẫn đúng — mà đây lại là bài người ta muốn kéo qua
       kéo lại nhất để xem dung lượng đổi thế nào. */
    function veTaiCho() {
      ve();
      if (k >= 0) loi(loiBuoc(k));
    }
    ganDatLai(node, ["r", "c", "m"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai, veTaiCho);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-14 · IF – ELIF – ELSE
   *
   *  NGỘ NHẬN LỚN NHẤT CỦA BÀI: tưởng máy xét HẾT các điều kiện. Với elif thì
   *  máy dừng ngay ở nhánh đúng đầu tiên; đổi elif thành các if rời thì mọi
   *  nhánh đúng đều chạy. Ô tích ở đây cho chạy CÙNG MỘT dữ liệu qua hai cách
   *  để thấy kết quả khác nhau — nói miệng chuyện này thì không ai tin.
   * ================================================================ */
  MH.dangKy("C10-14", function (host) {
    var NHANH = [
      { dk: "diem >= 8",   ten: "Giỏi",       f: function (d) { return d >= 8; } },
      { dk: "diem >= 6.5", ten: "Khá",        f: function (d) { return d >= 6.5; } },
      { dk: "diem >= 5",   ten: "Trung bình", f: function (d) { return d >= 5; } },
    ];
    var k = -1, xong = false, inRa = [];

    var node = MH.el(MH.khung("Máy xét hết mọi điều kiện, hay dừng ở nhánh đúng đầu tiên?",
      "Nhập một điểm rồi bấm từng bước để xem máy xét điều kiện nào, bỏ qua điều kiện nào. " +
      "Sau đó tích vào ô <b>“dùng if rời”</b> và chạy lại CÙNG số điểm đó — kết quả sẽ khác.",
      '<div class="mh3-code" data-mh="code"></div>' +
      '<div class="mh3-ket" data-mh="ket"></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhDiem">Điểm:</label>' +
      '<input class="mh-o-nhap hep" id="mhDiem" data-mh="diem" type="number" min="0" max="10" step="0.5" value="7">' +
      '<label class="mh3-tick"><input type="checkbox" data-mh="roi"> dùng if rời thay cho elif</label>'));

    var loi = loiCua(node);
    function diem() {
      var v = Number(node.querySelector('[data-mh="diem"]').value);
      if (!isFinite(v)) v = 0;
      return Math.max(0, Math.min(10, v));
    }
    function roi() { return node.querySelector('[data-mh="roi"]').checked; }

    /* Mỗi nhánh chiếm 2 dòng code (điều kiện + print) nên đánh số dòng theo nhánh
       rồi nhân đôi, đừng đếm tay — đổi số nhánh là lệch hết. */
    function ve() {
      var d = diem(), la = roi();
      var h = "";
      NHANH.forEach(function (n, i) {
        var tu = la || i === 0 ? "if" : "elif";
        var trang = "";
        if (i === k) trang = xong && !la ? " chay" : " nay";
        else if (i < k) trang = inRa.indexOf(n.ten) >= 0 ? " chay" : (la ? "" : " bo");
        else if (k >= 0 && !la && xong) trang = " bo";
        h += '<div class="mh3-d' + trang + '">' + tu + " " + n.dk + ":</div>";
        h += '<div class="mh3-d' + (inRa.indexOf(n.ten) >= 0 ? " chay" : trang === " nay" ? "" : " bo") +
          '">    print("' + n.ten + '")</div>';
      });
      var elseChay = k >= NHANH.length && !inRa.length;
      h += '<div class="mh3-d' + (elseChay ? " chay" : k >= NHANH.length ? " bo" : "") + '">' +
        (la ? 'if diem < 5:  <i># else không đi kèm if rời được</i>' : "else:") + "</div>";
      h += '<div class="mh3-d' + (elseChay ? " chay" : k >= NHANH.length ? " bo" : "") +
        '">    print("Chưa đạt")</div>';
      node.querySelector('[data-mh="code"]').innerHTML = h;
      node.querySelector('[data-mh="ket"]').innerHTML = inRa.length
        ? "Đã in ra: " + inRa.map(function (x) { return "<b>" + esc(x) + "</b>"; }).join(" · ")
        : "Chưa in ra gì. Điểm đang xét: <b>" + num(d) + "</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      if (!xong) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh" + (la && inRa.length > 1 ? "" : " xong");
      canh.innerHTML = la
        ? (inRa.length > 1
          ? "Với <b>if rời</b>, máy xét TỪNG điều kiện một cách độc lập nên in ra <b>" + inRa.length +
            "</b> dòng — một học sinh không thể vừa Giỏi vừa Khá. Đây chính là lỗi hay gặp khi quên chữ <b>elif</b>."
          : "Lần này if rời chỉ khớp một điều kiện nên trông vẫn đúng — đó là chỗ nguy hiểm: " +
            "lỗi chỉ lộ ra với <b>một số giá trị</b>. Thử điểm <b>9</b> xem sao.")
        : "Với <b>elif</b>, máy <b>dừng ngay</b> khi gặp điều kiện đúng đầu tiên và bỏ qua toàn bộ phần còn lại. " +
          "Vì vậy thứ tự các nhánh rất quan trọng: đặt <b>diem >= 5</b> lên trên cùng thì ai trên 5 điểm cũng thành Trung bình.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var d = diem(), la = roi();
      if (xong) {
        loi(la
          ? "Bỏ tích ô “dùng if rời” rồi chạy lại cùng số điểm để so hai cách."
          : "Giờ tích ô <b>“dùng if rời”</b> và chạy lại điểm <b>" + num(d) + "</b> — chú ý số dòng in ra.");
        return;
      }
      k++;
      if (k < NHANH.length) {
        var n = NHANH[k], dung = n.f(d);
        if (dung) inRa.push(n.ten);
        /* elif: khớp là chốt luôn, nhảy thẳng tới trạng thái kết thúc để học sinh
           thấy các nhánh dưới KHÔNG được xét, chứ không phải "xét rồi thấy sai". */
        if (dung && !la) { xong = true; k = NHANH.length; ve(); }
        else ve();
        loi("Xét <b>" + n.dk + "</b> với diem = " + num(d) + " → <b>" + (dung ? "Đúng" : "Sai") + "</b>. " +
          (dung
            ? (la ? 'In ra "' + n.ten + '", rồi VẪN xét tiếp điều kiện dưới.'
                  : 'In ra "' + n.ten + '" rồi <b>thoát khỏi cả khối</b> — các nhánh dưới không được xét nữa.')
            : "Chưa in gì, xuống điều kiện tiếp theo."));
        return;
      }
      xong = true; ve();
      loi(inRa.length
        ? "Hết khối lệnh. Tổng cộng in ra <b>" + inRa.length + "</b> dòng."
        : 'Không điều kiện nào đúng → chạy nhánh <b>else</b>, in ra "Chưa đạt".');
    };

    function lamLai() {
      k = -1; xong = false; inRa = [];
      ve(); loi("Điểm cần xếp loại: <b>" + num(diem()) + "</b>. Bấm “Bước tiếp” để xét điều kiện đầu tiên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="diem"]'), node.querySelector('[data-mh="roi"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-16 · VÒNG LẶP WHILE
   *
   *  NGỘ NHẬN: while giống for, chỉ khác cách viết. Khác ở chỗ chết người:
   *  for tự tăng biến đếm, while thì KHÔNG — quên dòng tăng biến là treo máy.
   *  Ô tích "quên tăng biến" cho thấy đúng cái treo đó một cách an toàn: đếm
   *  tới 8 vòng thì tự dừng và nói rõ vì sao thật ra nó không bao giờ dừng.
   * ================================================================ */
  MH.dangKy("C10-16", function (host) {
    var TOI_DA_VE = 12;   // quá 12 dòng thì bảng dài hơn màn hình, chẳng ai đọc
    var vong, i, tong, xong;

    var node = MH.el(MH.khung("While chạy tới khi nào thì dừng?",
      "Chương trình cộng dồn 1 + 2 + … + n. Mỗi lần bấm là <b>một vòng lặp</b>: máy kiểm tra điều kiện trước, " +
      "đúng thì chạy thân vòng lặp, rồi quay lại kiểm tra tiếp. " +
      "Tích ô <b>“quên dòng i = i + 1”</b> để xem vòng lặp vô hạn xảy ra thế nào.",
      '<div class="mh3-code" data-mh="code"></div>' +
      '<div style="overflow-x:auto;margin-top:11px"><table class="mh3-b" data-mh="bang"></table></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhN">n =</label>' +
      '<input class="mh-o-nhap hep" id="mhN" data-mh="n" type="number" min="1" max="10" value="5">' +
      '<label class="mh3-tick"><input type="checkbox" data-mh="quen"> quên dòng i = i + 1</label>'));

    var loi = loiCua(node);
    function nCua() {
      var v = Math.floor(Number(node.querySelector('[data-mh="n"]').value));
      return isFinite(v) ? Math.max(1, Math.min(10, v)) : 5;
    }
    function quen() { return node.querySelector('[data-mh="quen"]').checked; }

    function ve(dongNay) {
      var n = nCua(), la = quen();
      var ma = [
        ["i = 1", 0], ["tong = 0", 0],
        ["while i <= " + n + ":", 1],
        ["    tong = tong + i", 2],
        [la ? '    # i = i + 1   <i># dòng bị quên</i>' : "    i = i + 1", 3],
        ["print(tong)", 4],
      ];
      node.querySelector('[data-mh="code"]').innerHTML = ma.map(function (m) {
        var cls = "mh3-d";
        if (m[1] === dongNay) cls += " nay";
        if (la && m[1] === 3) cls += " bo";
        return '<div class="' + cls + '">' + m[0] + "</div>";
      }).join("");

      var th = "<tr><th>Vòng</th><th>i</th><th>i &lt;= " + n + " ?</th><th>tong sau vòng</th></tr>";
      var tr = vong.map(function (v, idx) {
        return '<tr class="' + (idx === vong.length - 1 ? "nay" : "") + "\"><td>" + (idx + 1) + "</td><td>" + v.i +
          '</td><td><span class="' + (v.dk ? "d" : "s") + '">' + (v.dk ? "Đúng" : "Sai") + "</span></td><td>" +
          (v.dk ? v.tong : "—") + "</td></tr>";
      }).join("");
      node.querySelector('[data-mh="bang"]').innerHTML = th + (tr || "");

      var canh = node.querySelector('[data-mh="canh"]');
      if (!xong) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh" + (la ? "" : " xong");
      canh.innerHTML = la
        ? "Biến <b>i</b> đứng nguyên ở 1 nên điều kiện <b>i &lt;= " + n + "</b> mãi mãi đúng — " +
          "đây là <b>vòng lặp vô hạn</b>, chương trình treo và phải tắt bằng tay. " +
          "Với <b>while</b>, việc thay đổi biến điều kiện là <b>trách nhiệm của người viết</b>; " +
          "<b>for</b> thì tự lo khoản đó, nên for an toàn hơn khi đã biết trước số vòng."
        : "Điều kiện <b>i &lt;= " + n + "</b> sai ở vòng thứ " + vong.length +
          " nên máy thoát và in <b>" + vong.reduce(function (t, v) { return v.dk ? v.tong : t; }, 0) + "</b>. " +
          "Chú ý: máy kiểm tra điều kiện <b>trước</b> mỗi vòng, nên nếu ngay từ đầu điều kiện đã sai " +
          "thì thân vòng lặp chạy <b>không lần nào</b>.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var n = nCua(), la = quen();
      if (xong) {
        loi(la ? "Bỏ tích ô đó rồi chạy lại để xem vòng lặp dừng đúng cách."
               : "Giờ tích ô <b>“quên dòng i = i + 1”</b> và chạy lại — xem cột <b>i</b> có nhích lên không.");
        return;
      }
      var dk = i <= n;
      if (!dk) {
        vong.push({ i: i, tong: tong, dk: false });
        xong = true; ve(4);
        loi("Kiểm tra <b>" + i + " &lt;= " + n + "</b> → <b>Sai</b> → thoát vòng lặp, chạy dòng <b>print</b>.");
        return;
      }
      tong += i;
      vong.push({ i: i, tong: tong, dk: true });
      var iCu = i;
      if (!la) i += 1;
      if (vong.length >= TOI_DA_VE) {
        xong = true; ve(la ? 2 : 3);
        loi("Đã chạy <b>" + vong.length + "</b> vòng và i vẫn bằng <b>" + i + "</b> — dừng vẽ ở đây cho khỏi tràn màn hình.");
        return;
      }
      ve(la ? 2 : 3);
      loi("Kiểm tra <b>" + iCu + " &lt;= " + n + "</b> → <b>Đúng</b> → cộng thêm " + iCu + ", tong = <b>" + tong + "</b>. " +
        (la ? "Nhưng <b>i</b> không được tăng, nên vòng sau vẫn xét <b>i = " + i + "</b>."
            : "Rồi tăng i thành <b>" + i + "</b>."));
    };

    function lamLai() {
      vong = []; i = 1; tong = 0; xong = false;
      ve(0); loi("n = <b>" + nCua() + "</b>. Bấm “Bước tiếp” để máy kiểm tra điều kiện lần đầu.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="n"]'), node.querySelector('[data-mh="quen"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-31 · CẮT LÁT DANH SÁCH
   *
   *  NGỘ NHẬN: a[2:5] lấy 4 phần tử (từ 2 đến 5). Không — vị trí cuối KHÔNG
   *  được lấy, nên đúng 3 phần tử. Chỗ này chỉ vỡ ra khi thấy ô số 5 nằm
   *  ngoài vùng tô. Vẽ luôn cả chỉ số âm vì đề rất hay hỏi a[-1], a[:-1].
   * ================================================================ */
  MH.dangKy("C10-31", function (host) {
    var k = -1;

    var node = MH.el(MH.khung("a[bắt_đầu : kết_thúc] lấy đúng những ô nào?",
      "Quy tắc chỉ có một câu: <b>lấy từ vị trí bắt đầu, DỪNG TRƯỚC vị trí kết thúc</b>. " +
      "Vì vậy <b>a[2:5]</b> cho ba phần tử chứ không phải bốn. Đổi hai số rồi bấm từng bước để lấy lần lượt.",
      '<div class="mh-mang" data-mh="mang"></div>' +
      '<div class="mh3-ket" data-mh="ket"></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhDs">a =</label>' +
      '<input class="mh-o-nhap" id="mhDs" data-mh="ds" type="text" value="10 20 30 40 50 60 70" style="max-width:210px">' +
      '<label for="mhBd">a[</label>' +
      '<input class="mh-o-nhap hep" id="mhBd" data-mh="bd" type="number" value="2" style="width:74px">' +
      '<label for="mhKt">:</label>' +
      '<input class="mh-o-nhap hep" id="mhKt" data-mh="kt" type="number" value="5" style="width:74px">' +
      '<label>]</label>'));

    var loi = loiCua(node);
    function mang() {
      var v = MH.docDay(node.querySelector('[data-mh="ds"]').value, 12);
      return v.length >= 2 ? v : [10, 20, 30, 40, 50, 60, 70];
    }
    function docChiSo(t, mac) {
      var s = String(node.querySelector('[data-mh="' + t + '"]').value).trim();
      if (s === "") return mac;
      var v = Math.floor(Number(s));
      return isFinite(v) ? Math.max(-20, Math.min(20, v)) : mac;
    }
    /* Chỉ số âm đếm từ cuối. Python còn tự kẹp về trong khoảng hợp lệ, nên
       a[2:99] không báo lỗi mà chỉ lấy tới hết dãy — phải mô phỏng đúng cả
       chuyện đó, kẻo học sinh tưởng ra ngoài là lỗi. */
    function chuanHoa(v, n) {
      if (v < 0) v += n;
      return Math.max(0, Math.min(n, v));
    }
    function vung() {
      var A = mang(), n = A.length;
      var bd = chuanHoa(docChiSo("bd", 0), n), kt = chuanHoa(docChiSo("kt", n), n);
      return { A: A, n: n, bd: bd, kt: Math.max(bd, kt) };
    }

    function ve() {
      var v = vung(), lay = [];
      var h = "";
      for (var t = 0; t < v.n; t++) {
        var trong = t >= v.bd && t < v.kt;
        var daLay = trong && t < v.bd + k + 1;
        if (daLay) lay.push(v.A[t]);
        var cls = "mh-o" + (daLay ? " thay" : trong ? "" : " ngoai");
        h += '<div style="text-align:center"><div class="' + cls + '">' + v.A[t] + "</div>" +
          '<small style="display:block;margin-top:4px;font:700 11px var(--font-mono);color:var(--text-soft)">' +
          t + '<br><span style="opacity:.7">' + (t - v.n) + "</span></small></div>";
      }
      node.querySelector('[data-mh="mang"]').innerHTML = h;
      node.querySelector('[data-mh="ket"]').innerHTML = k < 0
        ? "Vùng được tô đậm là phần sẽ lấy — <b>" + (v.kt - v.bd) + "</b> phần tử."
        : "Kết quả: <b>[" + lay.join(", ") + "]</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      if (k < v.kt - v.bd - 1 && v.kt > v.bd) { canh.hidden = true; return; }
      if (k < 0) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh xong";
      var bdG = docChiSo("bd", 0), ktG = docChiSo("kt", v.n);
      canh.innerHTML = v.kt === v.bd
        ? "Vùng rỗng nên kết quả là <b>[]</b> — Python không báo lỗi, chỉ trả về danh sách rỗng. " +
          "Đây là lí do vòng lặp trên một lát cắt sai đôi khi <b>không chạy lần nào</b> mà chẳng có thông báo gì."
        : "Lấy được <b>" + (v.kt - v.bd) + "</b> phần tử: từ vị trí <b>" + v.bd + "</b> tới vị trí <b>" +
          (v.kt - 1) + "</b>. Vị trí <b>" + v.kt + "</b> bị bỏ lại. " +
          "Nhớ nhanh: <b>số phần tử = kết_thúc − bắt_đầu = " + ktG + " − " + bdG + "</b> khi cả hai đều dương." +
          (ktG > v.n ? " Số " + ktG + " vượt quá độ dài dãy nhưng Python tự kẹp về " + v.n + ", không báo lỗi." : "");
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var v = vung(), soLay = v.kt - v.bd;
      if (k >= soLay - 1) {
        loi(soLay === 0
          ? "Lát cắt rỗng. Thử để <b>bắt đầu</b> nhỏ hơn <b>kết thúc</b>."
          : "Thử a[<b>0</b>:<b>-1</b>] — cách viết quen tay để lấy “tất cả trừ phần tử cuối”. " +
            "Hoặc bỏ trống một ô: bỏ trống bên trái là lấy từ đầu, bỏ trống bên phải là lấy đến hết.");
        return;
      }
      k++; ve();
      loi("Lấy ô ở vị trí <b>" + (v.bd + k) + "</b>, giá trị <b>" + v.A[v.bd + k] + "</b>. " +
        (k === soLay - 1 ? "Tới đây là hết — ô <b>" + v.kt + "</b> không lấy vì đó là vị trí kết thúc."
                         : "Còn " + (soLay - k - 1) + " ô nữa."));
    };

    function lamLai() { k = -1; ve(); loi("Bấm “Bước tiếp” để lấy phần tử đầu tiên của lát cắt."); }
    ganDatLai(node, ["ds", "bd", "kt"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-16 · ĐỘ PHỨC TẠP CỦA THUẬT TOÁN
   *
   *  NGỘ NHẬN: "máy tính nhanh lắm, thuật toán nào chả được". Cách chữa là quy
   *  số phép tính ra THỜI GIAN THẬT. Mỗi bước bấm gấp đôi n: học sinh thấy cột
   *  O(n²) nhảy gấp bốn, và tới n = 1 triệu thì con số thành hàng năm.
   * ================================================================ */
  MH.dangKy("C11-16", function (host) {
    var TOC_DO = 1e8;   // ~100 triệu phép/giây, cỡ một máy tính để bàn phổ thông
    var n0, n;

    var node = MH.el(MH.khung("Chọn sai thuật toán thì chậm hơn bao nhiêu?",
      "Ba thuật toán làm cùng một việc trên dãy <b>n</b> số nhưng số phép tính khác nhau. " +
      "Mỗi lần bấm là <b>nhân đôi n</b>. Để ý cột thời gian: máy tính nhanh không cứu được thuật toán tệ.",
      '<div class="mh3-cot" data-mh="cot"></div><div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhN16">Bắt đầu với n =</label>' +
      '<input class="mh-o-nhap hep" id="mhN16" data-mh="n" type="number" min="4" max="1024" value="16">'));

    var loi = loiCua(node);
    function nGoc() {
      var v = Math.floor(Number(node.querySelector('[data-mh="n"]').value));
      return isFinite(v) ? Math.max(4, Math.min(1024, v)) : 16;
    }
    /* Đơn vị tự nhảy theo độ lớn: hiện "0,00000031 giây" thì con số vô nghĩa,
       mà hiện "3170 năm" thì hiểu ngay. */
    function thoiGian(pt) {
      var s = pt / TOC_DO;
      if (s < 1e-3) return Math.round(s * 1e6) + " µs";
      if (s < 1) return thap(s * 1e3) + " ms";
      if (s < 90) return thap(s) + " giây";
      if (s < 5400) return thap(s / 60) + " phút";
      if (s < 172800) return thap(s / 3600) + " giờ";
      if (s < 3.15e7) return thap(s / 86400) + " ngày";
      return so(s / 3.156e7) + " năm";
    }
    function cacCot(x) {
      return [
        { ten: "O(n)", mo: "tìm tuần tự", pt: x, cls: "" },
        { ten: "O(n log n)", mo: "sắp xếp tốt", pt: x * Math.log2(x), cls: "canh" },
        { ten: "O(n²)", mo: "sắp xếp nổi bọt", pt: x * x, cls: "nang" },
      ];
    }

    function ve() {
      var ds = cacCot(n), max = ds[2].pt;
      node.querySelector('[data-mh="cot"]').innerHTML =
        '<div style="text-align:center;font:800 14px var(--font-sans);margin-bottom:3px">n = ' + so(n) + "</div>" +
        ds.map(function (c) {
          /* Tỉ lệ theo CĂN BẬC HAI: theo tỉ lệ thẳng thì hai cột nhỏ mảnh như sợi
             chỉ, không so được với nhau, mà so hai cột nhỏ mới là chỗ có ích. */
          var w = Math.max(2, Math.sqrt(c.pt / max) * 100);
          return '<div class="mh3-cot-h"><b>' + c.ten + '<br><span style="font:600 10.5px var(--font-sans);' +
            'color:var(--text-soft)">' + c.mo + '</span></b>' +
            '<div class="mh3-ray ' + c.cls + '"><span style="width:' + w.toFixed(1) + '%"></span></div>' +
            '<span class="mh3-num">' + so(c.pt) + "<br>" +
            '<span style="color:var(--text-soft);font-weight:600">' + thoiGian(c.pt) + "</span></span></div>";
        }).join("");

      var canh = node.querySelector('[data-mh="canh"]');
      var lan = Math.round(n / n0);
      if (lan < 2) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh" + (n >= 1e5 ? "" : " xong");
      canh.innerHTML = "So với lúc đầu, <b>n</b> gấp <b>" + lan + "</b> lần thì O(n) gấp <b>" + lan +
        "</b> lần, còn O(n²) gấp <b>" + so(lan * lan) + "</b> lần. " +
        "Đó là toàn bộ ý nghĩa của kí hiệu O: nó không nói thuật toán chạy mất mấy giây, " +
        "nó nói <b>dữ liệu lớn lên thì chi phí phình ra theo kiểu nào</b>." +
        (n >= 1e5 ? " Ở cỡ dữ liệu này thì O(n²) đã không dùng được nữa — không phải vì máy yếu, mà vì cách làm sai." : "");
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (n >= 4194304) {
        loi("Tới đây thì thấy rõ: chênh lệch giữa O(n) và O(n²) không phải “nhanh hơn một chút”, " +
          "mà là <b>chạy xong ngay</b> so với <b>đợi hàng năm</b>.");
        return;
      }
      n *= 2; ve();
      var ds = cacCot(n);
      loi("n = <b>" + so(n) + "</b>. O(n) cần " + so(ds[0].pt) + " phép (" + thoiGian(ds[0].pt) + "), " +
        "O(n²) cần <b>" + so(ds[2].pt) + "</b> phép (" + thoiGian(ds[2].pt) + ").");
    };

    function lamLai() {
      n0 = nGoc(); n = n0; ve();
      loi("n = <b>" + so(n) + "</b>. Bấm “Bước tiếp” để nhân đôi n.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="n"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-32 · NGĂN XẾP VÀ HÀNG ĐỢI
   *
   *  NGỘ NHẬN: hai cái này "gần giống nhau, đều là danh sách". Đặt cạnh nhau và
   *  đưa CÙNG một dãy vào là thấy ngay: lấy ra khỏi ngăn xếp thì thứ tự đảo
   *  ngược, khỏi hàng đợi thì giữ nguyên. Đó là lí do nút Undo dùng ngăn xếp
   *  còn hàng in dùng hàng đợi.
   * ================================================================ */
  MH.dangKy("C11-32", function (host) {
    var vao, xep, doi, k, pha, raXep, raDoi;

    var node = MH.el(MH.khung("Ngăn xếp và hàng đợi khác nhau ở đâu?",
      "Đưa <b>cùng một dãy</b> vào hai cấu trúc, rồi lấy hết ra. Ngăn xếp lấy từ <b>trên xuống</b> " +
      "(vào sau ra trước), hàng đợi lấy từ <b>đầu hàng</b> (vào trước ra trước). Bấm từng bước để so.",
      '<div class="mh3-2">' +
      '<div><h5>Ngăn xếp (Stack) — vào sau ra trước</h5><div class="mh3-hop" data-mh="xep"></div>' +
      '<div class="mh3-ket" data-mh="raXep"></div></div>' +
      '<div><h5>Hàng đợi (Queue) — vào trước ra trước</h5><div class="mh3-hop ngang" data-mh="doi"></div>' +
      '<div class="mh3-ket" data-mh="raDoi"></div></div>' +
      "</div><div class=\"mh3-canh\" data-mh=\"canh\" hidden></div>",
      '<label for="mhVao">Đưa vào lần lượt:</label>' +
      '<input class="mh-o-nhap" id="mhVao" data-mh="vao" type="text" value="A B C D" style="max-width:200px">'));

    var loi = loiCua(node);
    function docVao() {
      var v = String(node.querySelector('[data-mh="vao"]').value || "")
        .split(/[\s,;]+/).filter(Boolean).map(function (x) { return x.slice(0, 3); }).slice(0, 6);
      return v.length ? v : ["A", "B", "C", "D"];
    }
    function the(x, cls) { return '<div class="mh3-the ' + cls + '">' + esc(x) + "</div>"; }

    function ve(moiXep, moiDoi) {
      /* Ngăn xếp vẽ dọc, phần tử mới nhất ở TRÊN — hộp dùng flex-direction:column
         với justify-content:flex-end nên phải đảo mảng khi in ra. */
      node.querySelector('[data-mh="xep"]').innerHTML =
        xep.slice().reverse().map(function (x, i) {
          return the(x, i === 0 && moiXep ? (pha === "ra" ? "ra" : "moi") : "");
        }).join("") || '<div style="color:var(--text-soft);font-size:12.5px;text-align:center">(rỗng)</div>';
      node.querySelector('[data-mh="doi"]').innerHTML =
        doi.map(function (x, i) {
          return the(x, i === 0 && moiDoi ? (pha === "ra" ? "ra" : "moi") : (i === doi.length - 1 && moiDoi && pha === "vao" ? "moi" : ""));
        }).join("") || '<div style="color:var(--text-soft);font-size:12.5px;align-self:center">(rỗng)</div>';
      node.querySelector('[data-mh="raXep"]').innerHTML = raXep.length
        ? "Lấy ra: <b>" + raXep.join(" ") + "</b>" : "&nbsp;";
      node.querySelector('[data-mh="raDoi"]').innerHTML = raDoi.length
        ? "Lấy ra: <b>" + raDoi.join(" ") + "</b>" : "&nbsp;";

      var canh = node.querySelector('[data-mh="canh"]');
      if (raXep.length < vao.length) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh xong";
      canh.innerHTML = "Vào <b>" + vao.join(" ") + "</b> · ngăn xếp trả ra <b>" + raXep.join(" ") +
        "</b> (đảo ngược) · hàng đợi trả ra <b>" + raDoi.join(" ") + "</b> (nguyên thứ tự). " +
        "Nên nút <b>Hoàn tác</b> phải dùng ngăn xếp — việc vừa làm phải được hoàn trước; " +
        "còn <b>hàng chờ in</b> phải dùng hàng đợi — ai gửi trước in trước mới công bằng.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (pha === "vao") {
        if (k < vao.length) {
          var x = vao[k]; xep.push(x); doi.push(x); k++;
          ve(true, true);
          loi("Đưa <b>" + esc(x) + "</b> vào. Ngăn xếp đặt nó lên <b>trên cùng</b>; hàng đợi cho nó xuống <b>cuối hàng</b>. " +
            "Lúc đưa vào thì hai bên trông như nhau — khác biệt chỉ lộ ra khi lấy ra.");
          return;
        }
        pha = "ra"; k = 0;
      }
      if (raXep.length >= vao.length) {
        loi("Đổi dãy đưa vào rồi chạy lại. Câu hỏi để tự kiểm tra: đưa vào <b>1 2 3</b> thì ngăn xếp trả ra gì?");
        return;
      }
      var a = xep.pop(), b = doi.shift();
      raXep.push(a); raDoi.push(b);
      ve(true, true);
      loi("Ngăn xếp lấy phần tử <b>trên cùng</b> → <b>" + esc(a) + "</b>. " +
        "Hàng đợi lấy phần tử <b>đầu hàng</b> → <b>" + esc(b) + "</b>." +
        (a === b ? "" : " Hai bên đã cho ra hai phần tử khác nhau."));
    };

    function lamLai() {
      vao = docVao(); xep = []; doi = []; raXep = []; raDoi = []; k = 0; pha = "vao";
      ve(false, false);
      loi("Sắp đưa vào: <b>" + vao.map(esc).join(" ") + "</b>. Bấm “Bước tiếp”.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="vao"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-12 · BỐ CỤC TRANG BẰNG FLEXBOX
   *
   *  NGỘ NHẬN: căn giữa thì dùng text-align, xếp ngang thì phải dùng bảng. Bài
   *  này không có gì để suy luận — chỉ cần THẤY khối di chuyển khi đổi thuộc
   *  tính. Nên mỗi bước đổi đúng MỘT dòng CSS và nói dòng đó làm gì.
   * ================================================================ */
  MH.dangKy("C12-12", function (host) {
    var BUOC = [
      { css: {}, ten: "chưa có flex",
        noi: "Ba khối đang là <b>block</b>: mỗi khối chiếm cả một dòng, xếp dọc từ trên xuống. " +
             "Đây là cách trình duyệt xếp mặc định." },
      { css: { display: "flex" }, ten: "display: flex",
        noi: "Chỉ cần <b>display: flex</b> trên khối cha là ba con lập tức xếp <b>ngang</b> — " +
             "không cần bảng, không cần float." },
      { css: { display: "flex", "justify-content": "center" }, ten: "justify-content: center",
        noi: "<b>justify-content</b> điều khiển khoảng cách <b>theo chiều ngang</b> (chiều chính). " +
             "Giá trị <b>center</b> dồn cả nhóm vào giữa — đây mới là cách căn giữa cả khối, " +
             "còn text-align chỉ căn được chữ bên trong." },
      { css: { display: "flex", "justify-content": "space-between" }, ten: "justify-content: space-between",
        noi: "<b>space-between</b> đẩy khối đầu sát trái, khối cuối sát phải, khoảng trống chia đều ở giữa — " +
             "đúng kiểu thanh menu: logo bên trái, nút đăng nhập bên phải." },
      { css: { display: "flex", "justify-content": "space-between", "align-items": "center" }, ten: "align-items: center",
        noi: "<b>align-items</b> điều khiển chiều <b>còn lại</b> (chiều dọc). Với <b>center</b>, " +
             "các khối cao thấp khác nhau vẫn thẳng hàng giữa — việc mà trước Flexbox rất khó làm." },
      { css: { display: "flex", "flex-direction": "column", "justify-content": "space-between", "align-items": "center" },
        ten: "flex-direction: column",
        noi: "Đổi <b>flex-direction</b> thành <b>column</b> thì chiều chính thành chiều DỌC. " +
             "Chú ý: justify-content giờ điều khiển dọc, align-items điều khiển ngang — hai cái vừa đổi vai. " +
             "Đây là mẹo thường dùng để trang tự xếp lại trên điện thoại." },
    ];
    var CAO = ["44px", "72px", "56px"];
    var k = 0;

    var node = MH.el(MH.khung("Flexbox xếp các khối trên trang thế nào?",
      "Ba khối con nằm trong một khối cha. Mỗi bước thêm hoặc đổi <b>đúng một dòng CSS</b> — " +
      "xem khối nào dịch đi đâu. Đây là cách nhanh nhất để nhớ khác biệt giữa " +
      "<b>justify-content</b> và <b>align-items</b>.",
      '<div class="mh3-code" data-mh="code" style="max-width:340px;margin-bottom:11px"></div>' +
      '<div class="mh3-khung-css" data-mh="xem"></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>'));

    var loi = loiCua(node);

    function ve() {
      var b = BUOC[k], css = b.css;
      var xem = node.querySelector('[data-mh="xem"]');
      /* Đặt lại về mặc định trước rồi mới áp: không xoá thì thuộc tính của bước
         trước còn dính lại và bước "chưa có flex" trông vẫn như flex. */
      xem.style.display = css.display || "block";
      xem.style.flexDirection = css["flex-direction"] || "row";
      xem.style.justifyContent = css["justify-content"] || "flex-start";
      xem.style.alignItems = css["align-items"] || "stretch";
      xem.innerHTML = CAO.map(function (h, i) {
        return '<div class="mh3-khoi" style="height:' + h + ';display:flex;align-items:center' +
          (css.display ? "" : ";margin-bottom:6px") + '">Khối ' + (i + 1) + "</div>";
      }).join("");

      var dong = [".cha {"];
      Object.keys(css).forEach(function (t) { dong.push("  " + t + ": " + css[t] + ";"); });
      if (!Object.keys(css).length) dong.push("  /* chưa đặt gì */");
      dong.push("}");
      node.querySelector('[data-mh="code"]').innerHTML = dong.map(function (d, i) {
        var moi = i > 0 && i === Object.keys(css).length;   // dòng vừa thêm ở bước này
        return '<div class="mh3-d' + (moi ? " nay" : "") + '">' + esc(d) + "</div>";
      }).join("");

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = k < BUOC.length - 1;
      canh.className = "mh3-canh xong";
      canh.innerHTML = "Nhớ một câu là đủ: <b>justify-content</b> lo chiều CHÍNH, <b>align-items</b> lo chiều CÒN LẠI. " +
        "Chiều chính là ngang khi <b>flex-direction: row</b> (mặc định) và là dọc khi <b>column</b>.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (k >= BUOC.length - 1) {
        loi("Hết các bước. Thử tự đoán trước khi bấm “Làm lại”: nếu đổi <b>justify-content</b> thành " +
          "<b>space-around</b> thì khoảng trống hai đầu sẽ thế nào?");
        return;
      }
      k++; ve();
      loi(BUOC[k].noi);
    };

    function lamLai() { k = 0; ve(); loi(BUOC[0].noi + " Bấm “Bước tiếp” để thêm dòng CSS đầu tiên."); }
    node.querySelector('[data-mh="lai"]').onclick = lamLai;
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-16 · PHÂN LOẠI TRONG HỌC MÁY
   *
   *  NGỘ NHẬN nặng nhất của cả chương: "máy tự học" nghe như máy hiểu bài. Thật
   *  ra ở bài toán đơn giản nhất, học = THỬ NHIỀU NGƯỠNG rồi giữ ngưỡng sai ít
   *  nhất. Mỗi bước bấm là máy thử một ngưỡng — học sinh thấy đúng cái vòng lặp
   *  đó, và thấy luôn là không có ngưỡng nào đúng 100% vì dữ liệu thật có ngoại lệ.
   * ================================================================ */
  MH.dangKy("C12-16", function (host) {
    /* Dữ liệu cố định, KHÔNG sinh ngẫu nhiên: cần có sẵn hai ngoại lệ (bạn ôn
       nhiều mà vẫn không đỗ, bạn ôn ít mà đỗ) để nói được chuyện "không bao giờ
       đúng hết". Ngẫu nhiên thì có lần ra dữ liệu tách sạch, mất luôn bài học. */
    var HS = [
      { g: 1, d: 0 }, { g: 2, d: 0 }, { g: 3, d: 0 }, { g: 4, d: 0 },
      { g: 5, d: 0 }, { g: 6, d: 1 }, { g: 6, d: 0 }, { g: 7, d: 1 },
      { g: 8, d: 1 }, { g: 9, d: 0 }, { g: 10, d: 1 }, { g: 11, d: 1 },
      { g: 12, d: 1 }, { g: 13, d: 1 },
    ];
    var NGUONG = [1.5, 3.5, 5.5, 6.5, 7.5, 8.5, 9.5, 11.5];
    var k, tot, tay;

    var node = MH.el(MH.khung("“Máy học” nghĩa là máy làm gì?",
      "Mỗi điểm là một học sinh: trục ngang là <b>số giờ ôn mỗi tuần</b>, màu xanh là <b>đỗ</b>, đỏ là <b>chưa đỗ</b>. " +
      "Máy phải tìm một <b>ngưỡng</b>: trên ngưỡng thì đoán đỗ. Bấm từng bước để xem máy thử lần lượt các ngưỡng " +
      "và giữ lại cái sai ít nhất. Vòng tròn vàng là những bạn bị đoán sai.",
      '<div class="mh3-truc" data-mh="truc"></div>' +
      '<div class="mh3-ket" data-mh="ket"></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhNg">Tự kéo ngưỡng:</label>' +
      '<input class="mh3-range" id="mhNg" data-mh="ng" type="range" min="0.5" max="13.5" step="1" value="6.5">' +
      '<span class="mh3-num" data-mh="ngn"></span>'));

    var loi = loiCua(node);
    var MIN = 0, MAX = 14;
    function viTri(g) { return ((g - MIN) / (MAX - MIN)) * 100; }
    /* Số bạn bị đoán sai với một ngưỡng. Đây chính là "hàm mất mát" ở dạng
       đơn giản nhất — đếm số lần đoán trượt. */
    function soSai(ng) {
      return HS.filter(function (h) { return (h.g >= ng ? 1 : 0) !== h.d; }).length;
    }
    function ngHienTai() { return tay != null ? tay : (k < 0 ? null : NGUONG[Math.min(k, NGUONG.length - 1)]); }

    function ve() {
      var ng = ngHienTai();
      var h = '<div class="mh3-vach"></div>';
      HS.forEach(function (s, i) {
        /* Xê dọc theo số thứ tự để hai bạn cùng số giờ không đè lên nhau. */
        var top = 37 + ((i % 2) ? 13 : -13) + (i % 4 === 3 ? 8 : 0);
        var sai = ng != null && (s.g >= ng ? 1 : 0) !== s.d;
        h += '<div class="mh3-diem ' + (s.d ? "co" : "khong") + (sai ? " sai" : "") +
          '" style="left:' + viTri(s.g) + "%;top:" + top + 'px"></div>';
      });
      if (ng != null) h += '<div class="mh3-nguong" style="left:' + viTri(ng) + '%"><b>' + num(ng) + " giờ</b></div>";
      for (var g = 0; g <= 14; g += 2) {
        h += '<div style="position:absolute;left:' + viTri(g) + "%;top:58px;transform:translateX(-50%);" +
          'font:700 10.5px var(--font-mono);color:var(--text-soft)">' + g + "</div>";
      }
      node.querySelector('[data-mh="truc"]').innerHTML = h;
      node.querySelector('[data-mh="ngn"]').textContent = num(node.querySelector('[data-mh="ng"]').value) + " giờ";

      var ket = node.querySelector('[data-mh="ket"]');
      if (ng == null) { ket.innerHTML = "Chưa thử ngưỡng nào. Bấm “Bước tiếp”."; }
      else {
        var s = soSai(ng);
        ket.innerHTML = "Ngưỡng <b>" + num(ng) + " giờ</b> → đoán sai <b>" + s + "/" + HS.length + "</b> bạn · " +
          "độ chính xác <b>" + Math.round((1 - s / HS.length) * 100) + "%</b>" +
          (tot != null ? " · tốt nhất đã tìm được: <b>" + num(tot.ng) + " giờ</b> (sai " + tot.sai + ")" : "");
      }

      var canh = node.querySelector('[data-mh="canh"]');
      if (k < NGUONG.length - 1 && tay == null) { canh.hidden = true; return; }
      canh.hidden = false;
      canh.className = "mh3-canh xong";
      canh.innerHTML = "Đó là <b>toàn bộ</b> việc “học” ở đây: thử nhiều tham số, đo xem sai bao nhiêu, giữ cái sai ít nhất. " +
        "Máy không hiểu vì sao ôn nhiều thì dễ đỗ — nó chỉ đếm. " +
        "Và chú ý: <b>không ngưỡng nào đúng 100%</b>, vì có bạn ôn nhiều vẫn trượt và bạn ôn ít vẫn đỗ. " +
        "Dữ liệu thật luôn có ngoại lệ, nên mô hình học máy chỉ cho <b>dự đoán</b>, không cho chắc chắn.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      tay = null;
      if (k >= NGUONG.length - 1) {
        loi("Thử <b>kéo thanh trượt</b> xem có ngưỡng nào sai ít hơn <b>" + tot.sai + "</b> bạn không. " +
          "Nếu không có, nghĩa là máy đã tìm ra ngưỡng tốt nhất trong tầm mà nó thử.");
        return;
      }
      k++;
      var ng = NGUONG[k], s = soSai(ng);
      var moi = !tot || s < tot.sai;
      if (moi) tot = { ng: ng, sai: s };
      ve();
      loi("Thử ngưỡng <b>" + num(ng) + " giờ</b>: đoán sai <b>" + s + "</b> bạn. " +
        (moi ? "Ít hơn mọi ngưỡng đã thử → <b>giữ lại</b> làm ngưỡng tốt nhất."
             : "Không tốt hơn ngưỡng <b>" + num(tot.ng) + " giờ</b> (sai " + tot.sai + ") → bỏ."));
    };

    node.querySelector('[data-mh="ng"]').oninput = function () {
      tay = Number(node.querySelector('[data-mh="ng"]').value);
      ve();
      var s = soSai(tay);
      loi("Ngưỡng em tự chọn: <b>" + num(tay) + " giờ</b> → sai <b>" + s + "</b> bạn." +
        (tot ? (s < tot.sai ? " <b>Tốt hơn</b> cái máy tìm được!" : s === tot.sai ? " Bằng cái máy tìm được." : " Máy vẫn đang tốt hơn.") : ""));
    };
    function lamLai() {
      k = -1; tot = null; tay = null; ve();
      loi("Máy chưa thử gì cả. Bấm “Bước tiếp” để nó thử ngưỡng đầu tiên.");
    }
    node.querySelector('[data-mh="lai"]').onclick = function () { lamLai(); };
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-19 và C12-30 · MÔ PHỎNG TRÊN MÁY TÍNH
   *
   *  NGỘ NHẬN: mô phỏng là "máy dự đoán tương lai". Không — mô phỏng là chạy
   *  một QUY TẮC do người đặt ra, lặp lại nhiều lần, để trả lời câu "nếu... thì".
   *  Đổi một tham số là kết quả khác hẳn, mà quy tắc thì y nguyên: đó vừa là sức
   *  mạnh (thử được kịch bản không dám thử thật) vừa là giới hạn (đặt quy tắc sai
   *  thì kết quả sai một cách rất thuyết phục).
   *
   *  Đăng ký cho CẢ HAI bài vì C12-30 nói đúng về tham số và phép thử "nếu... thì"
   *  trên cùng một mô hình này.
   * ================================================================ */
  function moPhongLay(host) {
    napCss3();
    var DAN_SO = 1000;
    var ngay, ca, lichSu;

    var node = MH.el(MH.khung("Mô phỏng: đổi một con số, kết quả khác hẳn",
      "Quy tắc của mô hình chỉ có một câu: <b>mỗi người đang bệnh lây cho R người khác trong một ngày</b>. " +
      "Mỗi lần bấm là <b>một ngày</b>. Kéo <b>R</b> qua rồi lại dưới <b>1</b> để thấy vì sao con số này " +
      "được nhắc suốt trong các đợt dịch.",
      '<div class="mh3-cot" data-mh="cot"></div>' +
      '<div class="mh3-ket" data-mh="ket"></div>' +
      '<div class="mh3-canh" data-mh="canh" hidden></div>',
      '<label for="mhR19">R =</label>' +
      '<input class="mh3-range" id="mhR19" data-mh="r" type="range" min="0.4" max="3" step="0.1" value="1.6">' +
      '<span class="mh3-num" data-mh="rn"></span>' +
      '<label for="mhC19">Số ca ngày đầu:</label>' +
      '<input class="mh-o-nhap hep" id="mhC19" data-mh="c0" type="number" min="1" max="50" value="2">'));

    var loi = loiCua(node);
    function R() { return Number(node.querySelector('[data-mh="r"]').value) || 1; }
    function ca0() {
      var v = Math.floor(Number(node.querySelector('[data-mh="c0"]').value));
      return isFinite(v) ? Math.max(1, Math.min(50, v)) : 2;
    }

    function ve() {
      node.querySelector('[data-mh="rn"]').textContent = thap(R());
      var max = Math.max.apply(null, lichSu.concat([DAN_SO / 20]));
      node.querySelector('[data-mh="cot"]').innerHTML = lichSu.map(function (v, i) {
        var w = Math.max(1.5, (v / max) * 100);
        var cls = v >= DAN_SO * 0.9 ? "nang" : v > lichSu[Math.max(0, i - 1)] ? "canh" : "";
        return '<div class="mh3-cot-h"><b>Ngày ' + (i + 1) + '</b><div class="mh3-ray ' + cls +
          '"><span style="width:' + w.toFixed(1) + '%"></span></div>' +
          '<span class="mh3-num">' + so(v) + " ca</span></div>";
      }).join("");
      node.querySelector('[data-mh="ket"]').innerHTML =
        "Dân số giả định <b>" + so(DAN_SO) + "</b> người · đang bệnh <b>" + so(ca) + "</b> người";

      var canh = node.querySelector('[data-mh="canh"]');
      if (lichSu.length < 4) { canh.hidden = true; return; }
      var r = R();
      canh.hidden = false;
      canh.className = "mh3-canh" + (r < 1 ? " xong" : "");
      canh.innerHTML = r < 1
        ? "Với <b>R = " + thap(r) + " (nhỏ hơn 1)</b>, mỗi ngày số ca lại <b>giảm</b> và dịch tự tắt. " +
          "Mọi biện pháp phòng dịch đều nhắm vào đúng một việc: kéo R xuống dưới 1."
        : "Với <b>R = " + thap(r) + " (lớn hơn 1)</b>, số ca <b>nhân lên mỗi ngày</b> — tăng theo kiểu " +
          "<b>hàm số mũ</b>, nghĩa là mấy ngày đầu trông chẳng có gì rồi bùng lên rất nhanh. " +
          "Kéo R xuống dưới 1 và chạy lại xem khác thế nào.";
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (ngay >= 14) {
        loi("Đủ 14 ngày. Điều quan trọng nhất của bài: mô phỏng <b>không dự đoán tương lai</b> — " +
          "nó chỉ chạy đúng cái quy tắc mình đặt vào. Quy tắc ở đây bỏ qua chuyện khỏi bệnh, tiêm phòng, " +
          "đi lại… nên kết quả chỉ dùng để <b>so các kịch bản</b> với nhau, không phải để tin như con số thật.");
        return;
      }
      var r = R();
      ngay++;
      /* Chặn trên bằng dân số: bỏ chặn thì tăng theo hàm mũ vài ngày là ra số ca
         nhiều hơn cả dân số — vô nghĩa, mà học sinh sẽ tin vì máy in ra. */
      var moi = Math.min(DAN_SO - ca, Math.round(ca * r));
      var truoc = ca;
      ca = Math.max(0, Math.min(DAN_SO, ca + moi));
      lichSu.push(ca);
      ve();
      if (ca >= DAN_SO) {
        loi("Ngày " + ngay + ": số ca chạm <b>giới hạn dân số</b> " + so(DAN_SO) + " nên không tăng được nữa. " +
          "Mô hình nào cũng phải có chặn kiểu này, không thì nó cho ra con số vô nghĩa.");
        return;
      }
      loi("Ngày " + ngay + ": " + so(truoc) + " người bệnh × R = " + thap(r) + " → thêm <b>" + so(moi) +
        "</b> ca, tổng <b>" + so(ca) + "</b> ca. " +
        (moi > truoc ? "Số ca thêm mỗi ngày càng lúc càng nhiều." : moi < truoc ? "Số ca thêm mỗi ngày đang ít dần." : ""));
    };

    function lamLai() {
      ngay = 0; ca = ca0(); lichSu = [ca]; ve();
      loi("Ngày 1 có <b>" + ca + "</b> ca, R = <b>" + thap(R()) + "</b>. Bấm “Bước tiếp” để chạy một ngày.");
    }
    ganDatLai(node, ["r", "c0"].map(function (x) { return node.querySelector('[data-mh="' + x + '"]'); }), lamLai);
    host.appendChild(node); lamLai();
  }
  MH.dangKy("C12-19", moPhongLay);
  MH.dangKy("C12-30", moPhongLay);

  /* Nạp CSS ngay lúc tệp chạy, giống minh-hoa-2.js: gọi trong từng hàm dựng thì
     dễ sót một chỗ, và bỏ sót thì minh hoạ đó hiện ra không có kiểu dáng gì. */
  napCss3();
})();
