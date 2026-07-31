/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 9: TRÍ TUỆ NHÂN TẠO / HỌC MÁY / DỮ LIỆU, VÀ KHÉP LẠI
 *  NHỮNG BÀI CÒN TRẮNG HOÀN TOÀN
 *
 *  Sau đợt này không còn bài nào trắng cả mô phỏng lẫn sơ đồ. Bốn bài trắng
 *  còn lại được nhặt vào đây (C12-27, C12-05, C11-04, C11-08), phần còn lại là
 *  bù mô phỏng cho nhóm chủ đề G — nhóm đã có sơ đồ nhưng sơ đồ chỉ kể được
 *  "gồm những gì", không kể được "chạy ra sao".
 *
 *  VÌ SAO NHÓM AI/HỌC MÁY ĐÁNG LÀM MÔ PHỎNG: đây là nhóm bài mà đọc chữ xong
 *  học sinh vẫn không hình dung nổi máy làm gì, vì mọi thứ đều trừu tượng —
 *  "máy học từ dữ liệu", "máy tự gom nhóm". Chỉ cần cho các em bấm đổi số cụm
 *  k rồi thấy các điểm nhảy sang màu khác là hiểu ngay hai điều mà sách phải
 *  viết cả trang: k do NGƯỜI chọn, và máy gom được nhưng không biết nhóm ấy
 *  NGHĨA LÀ GÌ.
 *
 *  Mượn CSS sẵn có: .mh4-b/.mh4-hai/.mh4-cuon (đợt 4), .mh7-* (đợt 7),
 *  .mh8-dem/.mh8-canh/.mh8-lech/.mh8-trung (đợt 8). Thêm .mh9-* cho khung toạ
 *  độ, biểu đồ cột/tròn và hộp thiết bị mạng.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss9() {
    if (document.getElementById("mhCss9")) return;
    var st = document.createElement("style");
    st.id = "mhCss9";
    st.textContent =
      /* --- khung toạ độ cho điểm dữ liệu --- */
      ".mh9-do{position:relative;height:228px;margin:6px 10px 26px 40px;" +
        "border-left:2px solid var(--border);border-bottom:2px solid var(--border);" +
        "background:linear-gradient(var(--border) 1px,transparent 1px) 0 0/100% 25%," +
        "linear-gradient(90deg,var(--border) 1px,transparent 1px) 0 0/25% 100%;background-blend-mode:normal}" +
      ".mh9-do>span{position:absolute;font:700 10px var(--font-mono);color:var(--text-soft)}" +
      ".mh9-diem{position:absolute;width:15px;height:15px;border-radius:50%;" +
        "transform:translate(-50%,50%);border:2px solid var(--bg-card);background:#9aa0aa;" +
        "transition:background .35s,border-color .35s,width .2s,height .2s;cursor:default}" +
      ".mh9-diem.n1{background:var(--primary)}" +
      ".mh9-diem.n2{background:#d97706}" +
      ".mh9-diem.n3{background:var(--success)}" +
      ".mh9-diem.sai{border-color:var(--danger);box-shadow:0 0 0 2px var(--danger)}" +
      /* Tâm cụm vẽ hình vuông chứ không tròn: phải phân biệt được ngay với điểm
         dữ liệu thật, vì nó KHÔNG phải một học sinh nào cả — nó là số trung bình. */
      ".mh9-diem.tam{width:15px;height:15px;border-radius:3px;border:3px solid var(--text);" +
        "transform:translate(-50%,50%) rotate(45deg);z-index:2}" +
      ".mh9-truc{text-align:center;font:700 11px var(--font-sans);color:var(--text-soft);margin:0}" +
      ".mh9-ty{position:absolute;left:-38px;top:-6px;font:700 10px var(--font-mono);color:var(--text-soft)}" +

      /* --- chú giải --- */
      ".mh9-chu{display:flex;gap:13px;justify-content:center;flex-wrap:wrap;margin:9px 0 0;" +
        "font:700 11.5px var(--font-sans);color:var(--text-soft)}" +
      ".mh9-chu span{display:inline-flex;align-items:center;gap:5px}" +
      ".mh9-chu i{width:11px;height:11px;border-radius:50%;background:#9aa0aa;flex:none}" +
      ".mh9-chu i.n1{background:var(--primary)}.mh9-chu i.n2{background:#d97706}" +
      ".mh9-chu i.n3{background:var(--success)}" +
      ".mh9-chu i.xong{background:var(--success)}.mh9-chu i.hong{background:var(--danger)}" +
      ".mh9-chu i.cho{background:transparent;border:1.5px dashed var(--border)}" +

      /* --- biểu đồ cột --- */
      ".mh9-cot{display:flex;align-items:flex-end;justify-content:center;gap:16px;height:170px;" +
        "padding:0 6px;margin-bottom:22px;border-bottom:2px solid var(--border)}" +
      /* position:relative BẮT BUỘC ở đây: nhãn chân cột đặt absolute để nó nằm
         DƯỚI đường trục mà không ăn vào chiều cao cột — thiếu neo này thì nhãn
         định vị theo cả trang và văng đi mất. */
      ".mh9-c{position:relative;display:flex;flex-direction:column;justify-content:flex-end;" +
        "align-items:center;height:100%;min-width:42px}" +
      ".mh9-c i{display:block;width:38px;background:var(--primary);border-radius:5px 5px 0 0;" +
        "transition:height .4s ease}" +
      ".mh9-c b{font:800 12px var(--font-mono);color:var(--text);margin-bottom:3px}" +
      ".mh9-c small{position:absolute;left:0;right:0;bottom:-19px;text-align:center;" +
        "font:700 11px var(--font-sans);color:var(--text-soft)}" +
      ".mh9-c.nay i{background:var(--danger)}" +
      /* Ô chọn trong hàng điều khiển: styles.css chỉ tạo dáng cho input, select
         để trơn thì lạc hẳn khỏi phần còn lại. Cỡ chữ 16px để iOS khỏi tự phóng
         to trang lúc chạm vào — phóng rồi là kẹt ở trạng thái trượt ngang. */
      /* max-width BẮT BUỘC: thẻ select tự giãn theo option DÀI NHẤT, nên một
         nhãn kiểu "Hằng tuần — mỗi Chủ nhật" là đẩy select rộng 368px và làm
         tràn ngang cả trang trên điện thoại. */
      ".mh .mh-nhap select{border:1.5px solid var(--border);background:var(--bg-card);color:var(--text);" +
        "border-radius:10px;padding:8px 10px;font:700 16px var(--font-sans);min-height:40px;" +
        "max-width:100%}" +
      ".mh .mh-nhap select:focus{outline:none;border-color:var(--primary)}" +
      ".mh9-tron{width:150px;height:150px;border-radius:50%;margin:8px auto}" +

      /* --- hộp thiết bị mạng --- */
      ".mh9-so{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}" +
      ".mh9-tb{border:2px solid var(--border);background:var(--bg-card);border-radius:11px;" +
        "padding:8px 11px;min-width:96px;text-align:center;transition:all .25s}" +
      ".mh9-tb b{display:block;font:800 12px var(--font-sans);color:var(--text)}" +
      ".mh9-tb small{display:block;font-size:10.5px;color:var(--text-soft);line-height:1.35;margin-top:2px}" +
      ".mh9-tb.nay{border-color:var(--primary);background:var(--primary-soft);transform:translateY(-3px)}" +
      ".mh9-tb.xong{border-color:var(--success)}" +
      ".mh9-tb.hong{border-color:var(--danger);background:var(--danger-soft)}" +
      ".mh9-tb.cho{border-style:dashed;opacity:.45}" +
      ".mh9-noi{width:2px;height:18px;background:var(--border);margin:5px auto;position:relative}" +
      ".mh9-noi:after{content:'';position:absolute;left:-3px;bottom:0;border:4px solid transparent;" +
        "border-top-color:var(--border)}" +

      "@media (max-width:480px){.mh9-do{height:190px;margin-left:32px}.mh9-cot{gap:9px}.mh9-c i{width:30px}}";
    (document.head || document.documentElement).appendChild(st);
  }
  napCss9();

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
   *  C12-27 · DỮ LIỆU CÓ NHÃN, DỮ LIỆU KHÔNG NHÃN VÀ BÀI TOÁN PHÂN CỤM
   *
   *  Bài này đang TRẮNG cả mô phỏng lẫn sơ đồ, mà lại chứa ba ngộ nhận nặng:
   *
   *  1. Tưởng phân cụm "tự đặt tên" cho nhóm. Không. Máy chỉ nói "ba nhóm này
   *     khác nhau"; cái tên "nhóm chăm học" là do NGƯỜI nhìn vào rồi đặt.
   *  2. Tưởng máy tự biết có mấy cụm. Không — k do người chọn, và đổi k thì ra
   *     kết quả khác hẳn. Cho bấm đổi k là cách chứng minh nhanh nhất.
   *  3. Tưởng cụm máy tìm ra thì phải trùng với nhãn mình quan tâm. Dữ liệu ở
   *     đây cố ý dựng để KHÔNG trùng: nhãn có 2 loại (đỗ/trượt) mà hình dạng
   *     dữ liệu lại tách thành 3 cụm. Đó là chuyện bình thường, không phải lỗi.
   * ================================================================ */
  MH.dangKy("C12-27", function (host) {
    /* gio = số giờ tự học một tuần, diem = điểm trung bình, do = kết quả thi
       thử (nhãn do người chấm, KHÔNG suy ra được từ hai cột kia — cố ý để hai
       bạn ở giữa lệch nhau, cho thấy nhãn thật luôn có phần chồng lấn). */
    var DL = [
      { gio: 16, diem: 8.8, do: 1 }, { gio: 18, diem: 9.2, do: 1 },
      { gio: 17, diem: 8.5, do: 1 }, { gio: 19, diem: 9.0, do: 1 },
      { gio: 12, diem: 7.5, do: 1 }, { gio: 11, diem: 7.3, do: 1 },
      { gio: 10, diem: 7.0, do: 0 }, { gio: 9, diem: 6.8, do: 0 },
      { gio: 4, diem: 5.2, do: 0 }, { gio: 3, diem: 4.8, do: 0 },
      { gio: 5, diem: 5.5, do: 0 }, { gio: 2, diem: 4.5, do: 0 },
    ];
    var XMAX = 20, YMIN = 4, YMAX = 10;
    var buoc, k, cum, tam;

    var node = MH.el(MH.khung("Có nhãn, không nhãn, và chuyện máy “gom nhóm” thực ra làm gì",
      "Mỗi chấm là một học sinh: trục ngang là <b>số giờ tự học/tuần</b>, trục dọc là <b>điểm trung bình</b>. " +
      "Bấm “Bước tiếp” để xem cùng bộ dữ liệu đó được dùng theo hai kiểu khác hẳn nhau — " +
      "<b>có nhãn</b> và <b>không nhãn</b>.",
      '<div class="mh9-do" data-mh="do"></div>' +
      '<p class="mh9-truc">số giờ tự học mỗi tuần</p>' +
      '<div class="mh9-chu" data-mh="chu"></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label>Số cụm k:</label><select class="mh-o-nhap hep" data-mh="k">' +
      '<option value="2">2</option><option value="3" selected>3</option>' +
      '<option value="4">4</option></select>' +
      '<span class="mh-canh">k là do <b>em</b> chọn — máy không tự biết có mấy cụm.</span>'));

    var loi = loiCua(node);
    function docK() { return +node.querySelector('[data-mh="k"]').value; }

    /* Toạ độ vẽ, quy về 0..100. Cũng dùng luôn làm toạ độ để tính khoảng cách:
       hai trục có đơn vị khác nhau hoàn toàn (giờ và điểm), gom cụm trên số thô
       là trục "giờ" lấn át hết — quy về cùng thang mới công bằng. */
    function px(d) { return d.gio / XMAX * 100; }
    function py(d) { return (d.diem - YMIN) / (YMAX - YMIN) * 100; }

    /* k-means, khởi tạo cố định (trải đều theo trục x đã sắp) nên chạy lại bao
       nhiêu lần cũng ra đúng một kết quả — minh hoạ mà mỗi lần một khác thì
       học sinh tưởng máy đoán bừa. */
    function gomCum(sok) {
      var idx = DL.map(function (d, i) { return i; })
        .sort(function (a, b) { return px(DL[a]) - px(DL[b]); });
      var t = [];
      for (var c = 0; c < sok; c++) {
        var d = DL[idx[Math.floor(c * (DL.length - 1) / (sok - 1))]];
        t.push({ x: px(d), y: py(d) });
      }
      var nhan = DL.map(function () { return 0; }), lan, i, j;
      for (lan = 0; lan < 12; lan++) {
        for (i = 0; i < DL.length; i++) {
          var tot = 0, min = Infinity;
          for (j = 0; j < sok; j++) {
            var dx = px(DL[i]) - t[j].x, dy = py(DL[i]) - t[j].y;
            var kc = dx * dx + dy * dy;
            if (kc < min) { min = kc; tot = j; }
          }
          nhan[i] = tot;
        }
        for (j = 0; j < sok; j++) {
          var sx = 0, sy = 0, n = 0;
          for (i = 0; i < DL.length; i++) {
            if (nhan[i] === j) { sx += px(DL[i]); sy += py(DL[i]); n++; }
          }
          if (n) { t[j] = { x: sx / n, y: sy / n }; }
        }
      }
      return { nhan: nhan, tam: t };
    }

    function ve() {
      var o = node.querySelector('[data-mh="do"]');
      var h = '<span class="mh9-ty">' + YMAX + '</span><span class="mh9-ty" style="top:auto;bottom:-6px">' +
        YMIN + "</span>";
      DL.forEach(function (d, i) {
        var c = "mh9-diem";
        if (buoc === 1) c += d.do ? " n3" : " n2";          // giai đoạn có nhãn
        else if (buoc >= 2 && cum) c += " n" + (cum[i] + 1);  // giai đoạn phân cụm
        h += '<i class="' + c + '" style="left:' + px(d) + "%;bottom:" + py(d) + '%"></i>';
      });
      if (buoc >= 2 && tam) {
        tam.forEach(function (t) {
          h += '<i class="mh9-diem tam" style="left:' + t.x + "%;bottom:" + t.y + '%"></i>';
        });
      }
      o.innerHTML = h;

      var chu = node.querySelector('[data-mh="chu"]');
      if (buoc === 0) chu.innerHTML = "<span><i></i> chưa gắn nhãn — máy chỉ thấy hai con số</span>";
      else if (buoc === 1) chu.innerHTML = '<span><i class="n3"></i> đỗ</span><span><i class="n2"></i> trượt</span>';
      else {
        var s = "";
        for (var c = 0; c < k; c++) s += '<span><i class="n' + (c + 1) + '"></i> cụm ' + (c + 1) + "</span>";
        chu.innerHTML = s + "<span>hình thoi viền đậm = <b>tâm cụm</b> (số trung bình, không phải học sinh nào)</span>";
      }

      var dem = node.querySelector('[data-mh="dem"]');
      if (buoc === 0) dem.innerHTML = "<b>" + DL.length + "</b> học sinh · <b>0</b> nhãn";
      else if (buoc === 1) {
        var d1 = DL.filter(function (d) { return d.do; }).length;
        dem.innerHTML = "<b>" + d1 + "</b> đỗ · <b>" + (DL.length - d1) + "</b> trượt · nhãn do <b>người</b> gắn";
      } else {
        var dem2 = [];
        for (var j = 0; j < k; j++) {
          dem2.push("cụm " + (j + 1) + ": " + cum.filter(function (x) { return x === j; }).length);
        }
        dem.innerHTML = "k = <b>" + k + "</b> · " + dem2.join(" · ") + " · máy <b>không biết</b> tên các cụm";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < 3;
      if (buoc >= 3) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Ba điều hay bị hiểu sai, gói lại: <b>(1)</b> máy gom được nhóm nhưng " +
          "<b>không biết nhóm ấy nghĩa là gì</b> — cái tên “nhóm chăm học” là do em nhìn vào rồi đặt, " +
          "máy chỉ đánh số cụm 1, 2, 3. <b>(2)</b> <b>k do em chọn</b>, đổi k là ra kết quả khác, và " +
          "không có k nào “đúng tuyệt đối”. <b>(3)</b> Cụm máy tìm ra <b>không nhất thiết trùng</b> với " +
          "nhãn em quan tâm: ở đây nhãn có <b>2</b> loại (đỗ/trượt) mà hình dạng dữ liệu lại tách thành " +
          "<b>3</b> cụm — đó là chuyện bình thường, không phải máy sai.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= 3) {
        loi("Hết bước. Đổi <b>số cụm k</b> ở trên rồi xem các chấm được gom lại khác đi thế nào.");
        return;
      }
      buoc++;
      if (buoc >= 2) { k = docK(); var r = gomCum(k); cum = r.nhan; tam = r.tam; }
      ve();
      if (buoc === 1) {
        loi("Giờ thêm <b>nhãn</b>: kết quả thi thử của từng bạn, do <b>người</b> chấm rồi gắn vào. " +
          "Có nhãn thì bài toán là <b>học có giám sát</b> — máy học cách đoán nhãn cho bạn mới, và " +
          "<b>chấm được đúng/sai</b> vì đã biết đáp án.");
      } else if (buoc === 2) {
        loi("Bỏ hết nhãn đi, chỉ để lại hai con số. Máy <b>tự gom</b> các chấm gần nhau thành <b>" + k +
          "</b> cụm — đó là <b>phân cụm</b>, thuộc <b>học không giám sát</b>. Chú ý: không có nhãn thì " +
          "<b>không có đáp án để chấm</b>, nên không nói được “máy đúng bao nhiêu phần trăm”.");
      } else {
        loi("Hình thoi viền đậm là <b>tâm cụm</b> — số trung bình của cả cụm, <b>không phải một học sinh " +
          "nào cả</b>. Máy lặp đi lặp lại: gán mỗi chấm về tâm gần nhất, rồi dời tâm về giữa nhóm vừa " +
          "gán, cho tới khi không đổi nữa.");
      }
    };

    function lamLai() {
      buoc = 0; k = docK(); cum = null; tam = null;
      ve();
      loi("Máy đang thấy <b>" + DL.length + "</b> chấm và <b>không biết gì thêm</b> — không biết bạn nào " +
        "đỗ, bạn nào trượt. Đây là <b>dữ liệu không nhãn</b>. Bấm “Bước tiếp”.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="k"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-15 · HỌC MÁY LÀ GÌ
   *
   *  NGỘ NHẬN gốc của cả chủ đề: tưởng học máy cũng là "người viết sẵn luật cho
   *  máy làm theo", chỉ khác ở chỗ luật phức tạp hơn. Sai hẳn về bản chất.
   *  Cách trị: bắt học sinh TỰ ĐI CON ĐƯỜNG VIẾT LUẬT trước — thêm luật, thấy
   *  nó bắt trượt, thêm luật nữa, thấy nó bắt nhầm thư thật — rồi mới chuyển
   *  sang học máy. Không đi qua chỗ bế tắc đó thì câu "máy tự rút ra quy luật
   *  từ ví dụ" chỉ là một câu chữ nữa phải học thuộc.
   * ================================================================ */
  MH.dangKy("C12-15", function (host) {
    /* rac = nhãn thật do người gắn. Bộ này cố ý dựng để KHÔNG có luật một-từ
       nào bắt đúng hết: thư 6 là thư thật nhưng chứa "khuyến mãi". */
    var THU = [
      { t: "Khuyến mãi lớn, giảm 90% hôm nay!", rac: 1 },
      { t: "Bạn đã TRÚNG THƯỞNG 100 triệu, bấm vào đây", rac: 1 },
      { t: "Nhận quà miễn phí ngay!!! Nhanh tay!!!", rac: 1 },
      { t: "Lịch họp phụ huynh thứ Bảy tuần này", rac: 0 },
      { t: "Điểm kiểm tra giữa kì môn Tin học", rac: 0 },
      { t: "Nhà sách khuyến mãi sách giáo khoa cho lớp mình", rac: 0 },
      { t: "Vay tiền nhanh, không cần thế chấp, lãi 0%", rac: 1 },
      { t: "Nhắc nộp bài tập Tin học trước thứ Sáu", rac: 0 },
    ];
    /* Ba luật viết tay, bật dần theo bước. Cột "diem" là trọng số máy học được
       ở giai đoạn sau — cố ý cho "khuyến mãi" trọng số THẤP vì nó xuất hiện ở
       cả thư rác lẫn thư thật, đúng cái mà đếm thống kê sẽ phát hiện ra. */
    var LUAT = [
      { tu: "khuyến mãi", nhan: 'chứa "khuyến mãi"' },
      { tu: "trúng thưởng", nhan: 'chứa "trúng thưởng"' },
      { tu: "!!!", nhan: "có nhiều dấu chấm than" },
    ];
    var TRONG = { "khuyến mãi": 1, "trúng thưởng": 3, "!!!": 2, "miễn phí": 2, "vay tiền": 3, "lãi 0%": 2 };
    var NGUONG = 2;

    var buoc;   // 0 = chưa luật nào; 1..3 = số luật tay đang bật; 4 = chuyển sang học máy

    var node = MH.el(MH.khung("Học máy khác gì với “người viết sẵn luật cho máy”?",
      "Việc cần làm: lọc <b>thư rác</b>. Trước hết em thử <b>tự viết luật</b> — mỗi bước thêm một luật, " +
      "xem nó bắt đúng mấy thư. Đi tới lúc bế tắc rồi mới chuyển sang cách của <b>học máy</b>.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan" data-mh="nhanTrai"></p>' +
      '<div class="mh7-code" data-mh="luat"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Hộp thư</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="thu"></table></div></div>' +
      "</div>" +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    function coTu(t, tu) { return t.toLowerCase().indexOf(tu.toLowerCase()) >= 0; }

    /* Máy đoán thư này là rác hay không, theo cách đang dùng ở bước hiện tại. */
    function doan(m) {
      if (buoc >= 4) {
        var d = 0;
        for (var tu in TRONG) if (coTu(m.t, tu)) d += TRONG[tu];
        return { rac: d >= NGUONG ? 1 : 0, diem: d };
      }
      for (var i = 0; i < buoc; i++) if (coTu(m.t, LUAT[i].tu)) return { rac: 1 };
      return { rac: 0 };
    }

    function ve() {
      node.querySelector('[data-mh="nhanTrai"]').textContent =
        buoc >= 4 ? "Máy tự rút ra từ 8 ví dụ có nhãn" : "Luật em tự viết";
      var l = node.querySelector('[data-mh="luat"]');
      if (buoc >= 4) {
        var d = ["# máy KHÔNG hiểu nghĩa — nó chỉ đếm:", "# từ nào hay gặp ở thư rác hơn thì điểm cao hơn"];
        for (var tu in TRONG) d.push('  "' + tu + '"' + Array(16 - tu.length).join(" ") + "+" + TRONG[tu]);
        d.push("", "  tổng điểm >= " + NGUONG + "  ->  rác");
        l.innerHTML = d.map(function (x) { return '<div class="mh7-d">' + esc(x) + "</div>"; }).join("");
      } else if (buoc === 0) {
        l.innerHTML = '<div class="mh7-d mo">(chưa có luật nào)</div>';
      } else {
        l.innerHTML = LUAT.slice(0, buoc).map(function (x, i) {
          return '<div class="mh7-d' + (i === buoc - 1 ? " nay" : "") + '">nếu ' + esc(x.nhan) + " -> rác</div>";
        }).join("");
      }

      var dung = 0, sotRac = 0, batNham = 0;
      var t = "<tr><th>Nội dung thư</th><th>Thật</th><th>Máy đoán</th></tr>";
      THU.forEach(function (m) {
        var k = doan(m), ok = k.rac === m.rac;
        if (ok) dung++; else if (m.rac) sotRac++; else batNham++;
        t += '<tr class="' + (buoc === 0 ? "" : ok ? "khop" : "rac") + '"><td>' + esc(m.t) + "</td><td>" +
          (m.rac ? "rác" : "thật") + "</td><td>" + (buoc === 0 ? "—" : k.rac ? "rác" : "thật") + "</td></tr>";
      });
      node.querySelector('[data-mh="thu"]').innerHTML = t;

      node.querySelector('[data-mh="dem"]').innerHTML = buoc === 0
        ? "Chưa có luật nào — máy chưa đoán được gì"
        : "Đúng <b>" + dung + "</b>/" + THU.length + " · sót thư rác <b>" + sotRac +
          "</b> · bắt nhầm thư thật <b>" + batNham + "</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(buoc === 1 || buoc === 3);
      if (buoc === 1) {
        canh.innerHTML = "Luật này <b>sót</b> mấy thư rác không chứa đúng cụm từ đó. Cứ gặp một thư rác " +
          "kiểu mới là lại phải thêm một luật — mà kẻ gửi thư rác thì đổi câu chữ liên tục.";
      } else if (buoc === 3) {
        canh.innerHTML = "Đây là chỗ bế tắc: luật <b>“chứa khuyến mãi”</b> <b>bắt nhầm</b> thư thật của " +
          "nhà sách. Sửa luật cho thư đó lọt thì thư rác quảng cáo cũng lọt theo. Viết tay bao nhiêu luật " +
          "cũng không thoát, vì cùng một từ xuất hiện ở <b>cả hai loại thư</b>.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < 4;
      if (buoc >= 4) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Khác biệt cốt lõi: ở cách đầu <b>em viết luật</b>, máy chỉ làm theo. Ở học máy " +
          "<b>em đưa ví dụ đã gắn nhãn</b>, máy <b>tự rút ra quy luật</b> — cụ thể ở đây là tự tính xem " +
          "từ nào hay gặp trong thư rác hơn rồi cho điểm. Chú ý ba điều: máy <b>không hiểu nghĩa</b> câu " +
          "chữ, nó chỉ đếm thống kê; kết quả <b>không đúng 100%</b>, vẫn có thư sai; và <b>chất lượng phụ " +
          "thuộc dữ liệu học</b> — cho máy học từ bộ ví dụ lệch thì nó học ra thói quen lệch.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= 4) {
        loi("Hết bước. Bấm “Làm lại” để đi lại từ cách viết luật tay.");
        return;
      }
      buoc++;
      ve();
      if (buoc <= 3) {
        loi("Thêm luật <b>" + esc(LUAT[buoc - 1].nhan) + " -> rác</b>. Nhìn cột “Máy đoán” xem lần này " +
          "được mấy thư." + (buoc === 3 ? " Và chú ý dòng đỏ — có thư <b>thật</b> bị bắt nhầm." : ""));
      } else {
        loi("Giờ đổi cách hoàn toàn: <b>không viết luật nào nữa</b>. Em đưa cả <b>" + THU.length +
          "</b> thư <b>đã gắn nhãn</b> cho máy, máy <b>tự đếm</b> xem từ nào hay xuất hiện ở thư rác hơn " +
          "và tự cho điểm. Bảng bên trái là thứ <b>máy tự tìm ra</b>, không phải em gõ vào.");
      }
    };

    function lamLai() {
      buoc = 0; ve();
      loi("Hộp thư có <b>" + THU.length + "</b> thư, cột “Thật” là nhãn <b>người</b> gắn sẵn. Bấm “Bước " +
        "tiếp” để thêm luật đầu tiên do em tự nghĩ ra.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-08 · HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU (DBMS)
   *
   *  Bài này cũng đang TRẮNG. Hai ngộ nhận:
   *
   *  1. Lẫn CSDL với DBMS. CSDL là DỮ LIỆU, DBMS là PHẦN MỀM quản lí dữ liệu
   *     đó — đề rất hay hỏi phân biệt, mà sách chỉ định nghĩa bằng lời.
   *  2. Tưởng "không có DBMS thì tự mở tệp ra sửa, cũng thế thôi". Mô phỏng
   *     dựng đúng cảnh hai người sửa cùng lúc: không có DBMS thì thay đổi của
   *     người bấm Lưu trước bị người sau ghi đè mất sạch, mà KHÔNG ai được báo.
   * ================================================================ */
  MH.dangKy("C11-08", function (host) {
    var GOC = { ma: "HS02", ten: "Trần Bình", lop: "12A", sdt: "0933 202 707" };
    var buoc;

    var node = MH.el(MH.khung("Vì sao phải có hệ quản trị, không tự mở tệp ra sửa cho nhanh?",
      "Cô giáo chủ nhiệm và cô văn thư <b>cùng lúc</b> mở hồ sơ của bạn Trần Bình để sửa: một cô đổi " +
      "<b>lớp</b>, một cô đổi <b>số điện thoại</b>. Bấm “Bước tiếp” để xem chuyện gì xảy ra. " +
      "Rồi tích ô <b>“không có hệ quản trị”</b> và chạy lại.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Cô chủ nhiệm</p>' +
      '<div class="mh4-b-hop" data-mh="a"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Cô văn thư</p>' +
      '<div class="mh4-b-hop" data-mh="b"></div></div>' +
      "</div>" +
      '<p class="mh7-nhan" style="text-align:center;margin:13px 0 5px">Dữ liệu thật đang lưu</p>' +
      '<table class="mh4-b" data-mh="that" style="margin:0 auto"></table>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="khong"> không có hệ quản trị ' +
      "(hai người tự mở tệp)</label>"));

    var loi = loiCua(node);
    function khong() { return node.querySelector('[data-mh="khong"]').checked; }

    /* Trạng thái dữ liệu thật theo từng bước. Chỗ khác nhau duy nhất giữa hai
       chế độ nằm ở bước 3: có DBMS thì cô văn thư ghi ĐÈ LÊN bản đã cập nhật,
       không có DBMS thì ghi đè lên bản chụp cũ — nên cột lop mất. */
    function that() {
      var r = { ma: GOC.ma, ten: GOC.ten, lop: GOC.lop, sdt: GOC.sdt };
      if (buoc >= 2) r.lop = "12B";
      if (buoc >= 3) {
        r.sdt = "0988 111 555";
        if (khong()) r.lop = GOC.lop;   // bản chụp cũ ghi đè, thay đổi kia bay mất
      }
      return r;
    }

    function hop(ai) {
      var laA = ai === "a";
      var moc = laA ? 1 : 1;
      if (buoc < moc) return '<span class="mh7-trong">chưa mở hồ sơ</span>';
      var v = { lop: GOC.lop, sdt: GOC.sdt };
      if (laA && buoc >= 2) v.lop = "12B";
      if (!laA && buoc >= 3) v.sdt = "0988 111 555";
      /* Có DBMS thì cô văn thư đọc lại bản mới nhất trước khi ghi, nên thấy lớp
         đã đổi; không có DBMS thì màn hình cô ấy vẫn là bản chụp lúc mở. */
      if (!laA && buoc >= 3 && !khong()) v.lop = "12B";
      var doiLop = laA && buoc >= 2, doiSdt = !laA && buoc >= 3;
      return '<table class="mh4-b" style="margin:0 auto"><tr><th>lop</th><td class="' +
        (doiLop ? "mh8-trung" : "") + '">' + esc(v.lop) + "</td></tr><tr><th>sdt</th><td class=\"" +
        (doiSdt ? "mh8-trung" : "") + '">' + esc(v.sdt) + "</td></tr></table>";
    }

    function ve() {
      node.querySelector('[data-mh="a"]').innerHTML = hop("a");
      node.querySelector('[data-mh="b"]').innerHTML = hop("b");

      var r = that(), mat = buoc >= 3 && khong();
      node.querySelector('[data-mh="that"]').innerHTML =
        "<tr><th>ma_hs</th><th>ho_ten</th><th>lop</th><th>sdt</th></tr>" +
        '<tr><td class="mh8-khoa">' + esc(r.ma) + "</td><td>" + esc(r.ten) + '</td><td class="' +
        (mat ? "mh8-lech" : buoc >= 2 ? "mh8-trung" : "") + '">' + esc(r.lop) + '</td><td class="' +
        (buoc >= 3 ? "mh8-trung" : "") + '">' + esc(r.sdt) + "</td></tr>";

      node.querySelector('[data-mh="dem"]').innerHTML = khong()
        ? "Chế độ: <b>không có hệ quản trị</b> — hai người mở thẳng tệp"
        : "Chế độ: <b>có hệ quản trị</b> — mọi thao tác đi qua nó";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !mat;
      if (mat) {
        canh.innerHTML = "Cột <b>lop</b> quay về <b>" + esc(GOC.lop) + "</b> — thay đổi của cô chủ nhiệm " +
          "<b>bay mất sạch</b>. Cô văn thư mở tệp từ trước, trên màn hình cô ấy lớp vẫn là giá trị cũ, nên " +
          "lúc lưu cô ấy ghi đè cả bản ghi bằng bản chụp cũ. <b>Không ai được báo gì cả</b> — cả hai đều " +
          "tin là mình vừa lưu xong.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < 3;
      if (buoc >= 3) {
        ghi.className = "mh7-ghi" + (khong() ? "" : " xong");
        ghi.innerHTML = khong()
          ? "Đây gọi là <b>mất cập nhật</b>. Hệ quản trị chặn nó bằng cách <b>khoá</b> bản ghi: người thứ " +
            "hai phải chờ, và khi tới lượt thì đọc lại <b>bản mới nhất</b> chứ không ghi đè bằng bản cũ. " +
            "Ngoài ra hệ quản trị còn lo <b>phân quyền</b> (ai được xem, ai được sửa), <b>sao lưu</b>, và " +
            "<b>kiểm tra ràng buộc</b> — tự mở tệp thì không có thứ nào trong số đó."
          : "Có hệ quản trị thì hai người sửa hai cột khác nhau vẫn <b>giữ được cả hai</b> thay đổi. " +
            "Nhớ phân biệt cho đúng, đề rất hay hỏi: <b>cơ sở dữ liệu là DỮ LIỆU</b> đã được tổ chức; " +
            "<b>hệ quản trị cơ sở dữ liệu (DBMS) là PHẦN MỀM</b> đứng giữa người dùng và dữ liệu đó. " +
            "MySQL, PostgreSQL, Access là <b>hệ quản trị</b>, không phải cơ sở dữ liệu.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= 3) {
        loi(khong()
          ? "Bỏ tích ô đó rồi chạy lại để xem hệ quản trị cứu tình huống này thế nào."
          : "Xong. Giờ tích ô <b>“không có hệ quản trị”</b> và chạy lại — chú ý cột <b>lop</b>.");
        return;
      }
      buoc++;
      ve();
      if (buoc === 1) {
        loi("Cả hai cô cùng <b>mở</b> hồ sơ của bạn Trần Bình. Lúc này màn hình hai bên giống hệt nhau.");
      } else if (buoc === 2) {
        loi("Cô chủ nhiệm đổi <b>lop</b> thành <b>12B</b> rồi <b>lưu</b>. Dữ liệu thật đã đổi.");
      } else {
        loi(khong()
          ? "Cô văn thư đổi <b>sdt</b> rồi lưu. Nhưng màn hình cô ấy là <b>bản chụp lúc mở</b>, ở đó lớp " +
            "vẫn là " + esc(GOC.lop) + " — nên khi lưu, cô ấy ghi đè cả bản ghi. Nhìn cột lop bên dưới."
          : "Cô văn thư đổi <b>sdt</b> rồi lưu. Hệ quản trị <b>khoá bản ghi</b> trong lúc ghi và cho cô ấy " +
            "<b>bản mới nhất</b>, nên nó chỉ sửa đúng cột sdt. Cả hai thay đổi <b>cùng còn</b>.");
      }
    };

    function lamLai() {
      buoc = 0; ve();
      loi("Hồ sơ gốc của bạn Trần Bình. Bấm “Bước tiếp” để hai cô cùng mở nó lên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="khong"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-05 · THIẾT KẾ MỘT MẠNG LAN ĐƠN GIẢN
   *
   *  Bài này đọc thì trôi tuột: năm bước, ai cũng gật. Chỗ học sinh thật sự
   *  vấp là HẬU QUẢ của từng quyết định — nên mỗi bước ở đây dựng thêm một
   *  mảnh mạng rồi hiện ngay "lúc này thiết bị nào đã nối được, đã ra Internet
   *  chưa". Hai bước cố tình để hỏng: thiếu cổng LAN và trùng địa chỉ IP, vì
   *  đó đúng là hai câu hay ra đề và hai tai nạn hay gặp ngoài đời.
   * ================================================================ */
  MH.dangKy("C12-05", function (host) {
    /* Hàng trên: hạ tầng. Hàng dưới: thiết bị đầu cuối. Tách hai hàng để dòng
       nối ở giữa nói được đúng một ý — "các máy này treo vào hạ tầng kia". */
    var HT = [
      { ten: "Đường Internet", vai: "nhà cung cấp kéo vào" },
      { ten: "Modem/Router", vai: "chia mạng, ra Internet" },
      { ten: "Switch", vai: "chia thêm cổng nội bộ" },
      { ten: "Wifi (access point)", vai: "phủ sóng không dây" },
    ];
    var TB = [
      { ten: "Máy bàn 1", vai: "nối dây" },
      { ten: "Máy bàn 2", vai: "nối dây" },
      { ten: "Máy in mạng", vai: "nối dây" },
      { ten: "Điện thoại", vai: "wifi" },
      { ten: "Laptop", vai: "wifi" },
    ];
    /* trung = hai dòng này bị đặt trùng địa chỉ ở bước áp chót; sua = địa chỉ
       đúng sau khi sửa. Gom vào dữ liệu để hàm vẽ khỏi phải đoán theo tên. */
    var IP = [
      { ten: "Router (cổng LAN)", ip: "192.168.1.1" },
      { ten: "Máy bàn 1", ip: "192.168.1.10" },
      { ten: "Máy bàn 2", ip: "192.168.1.11", trung: true },
      { ten: "Máy in mạng", ip: "192.168.1.11", trung: true, sua: "192.168.1.12" },
      { ten: "Điện thoại", ip: "192.168.1.20" },
      { ten: "Laptop", ip: "192.168.1.21" },
    ];

    var BUOC = [
      { ht: ["cho", "cho", "cho", "cho"], tb: ["cho", "cho", "cho", "cho", "cho"],
        noi: 0, net: "chưa",
        giai: "Chưa mua gì cả, mới chỉ <b>đếm</b>: 5 thiết bị, trong đó <b>3 cái nối dây</b> (hai máy bàn " +
          "và máy in) và <b>2 cái dùng wifi</b>. Bước này quan trọng nhất vì mọi quyết định sau đều dựa " +
          "vào nó — đếm sai thì mua thiếu cổng, mua nhầm thiết bị, hoặc đi dây tới chỗ không có máy. " +
          "Thiết kế phải xong <b>trước</b> khi lắp; lắp rồi mới sửa là phải bóc dây đi lại từ đầu." },
      { ht: ["xong", "nay", "cho", "cho"], tb: ["xong", "xong", "cho", "cho", "cho"],
        noi: 2, net: "được",
        giai: "Cắm <b>modem/router</b>: nó nhận đường truyền từ nhà cung cấp rồi phân phối cho mạng trong " +
          "phòng. Hai máy bàn cắm thẳng vào cổng LAN là đã nói chuyện được với nhau <b>và</b> ra được " +
          "Internet. Trong cả mạng này, router là thiết bị duy nhất biết đường ra ngoài." },
      { ht: ["xong", "xong", "cho", "cho"], tb: ["xong", "xong", "hong", "cho", "cho"],
        noi: 2, net: "được (máy in thì không)",
        canh: "<b>Thiếu cổng.</b> Router chỉ có <b>2 cổng LAN</b> mà cần <b>3</b> thiết bị nối dây. " +
          "Máy in bị bỏ ngoài mạng.",
        giai: "Cắm nốt máy in thì hết chỗ. Máy in không hỏng, dây không đứt — chỉ là <b>không còn cổng</b>. " +
          "Đây là lỗi tốn tiền nhất của bài: phải đếm số cổng ngay lúc chọn thiết bị, và nên chừa dư vài " +
          "cổng cho thiết bị thêm về sau." },
      { ht: ["xong", "xong", "nay", "cho"], tb: ["xong", "xong", "xong", "cho", "cho"],
        noi: 3, net: "được",
        giai: "Thêm <b>switch</b>: một cổng LAN của router nối sang switch, switch chia tiếp ra nhiều cổng " +
          "cho các máy. Máy in vào được mạng. Nhớ kĩ chỗ này: switch <b>chỉ chia cổng trong mạng nội " +
          "bộ</b>, nó không tự tạo ra Internet. Cắm switch thẳng vào ổ tường mà không có router thì các " +
          "máy chỉ thấy nhau, không ra được ngoài." },
      { ht: ["xong", "xong", "xong", "nay"], tb: ["xong", "xong", "xong", "xong", "xong"],
        noi: 5, net: "được",
        giai: "Bật <b>wifi</b> — phần lớn router đời nay đã tích hợp sẵn, không phải mua access point " +
          "riêng. Điện thoại và laptop vào mạng mà không cần dây. Máy cố định vẫn nên nối dây vì đường " +
          "truyền ổn định hơn; wifi để dành cho thiết bị hay di chuyển." },
      { ht: ["xong", "xong", "xong", "xong"], tb: ["xong", "hong", "hong", "xong", "xong"],
        noi: 3, net: "được (2 máy xung đột)", bang: true,
        canh: "<b>Xung đột địa chỉ IP.</b> Máy bàn 2 và máy in cùng nhận <b>192.168.1.11</b> — " +
          "cả hai đều không dùng mạng bình thường được.",
        giai: "Mỗi thiết bị cần một <b>địa chỉ IP riêng</b> thì các máy khác mới tìm đúng nó. Ở đây hai " +
          "thiết bị bị đặt trùng địa chỉ, và hậu quả là <b>cả hai cùng trục trặc</b>, chứ không phải chỉ " +
          "máy đến sau chịu thiệt. Bình thường router tự cấp IP nên không trùng; trùng hay xảy ra khi có " +
          "người gõ tay địa chỉ tĩnh mà không tra lại." },
      { ht: ["xong", "xong", "xong", "xong"], tb: ["xong", "xong", "xong", "xong", "xong"],
        noi: 5, net: "được", bang: true, xong: true,
        ghi: "Thứ tự này không đảo được: <b>đếm nhu cầu → router để có Internet → đủ cổng → wifi → đặt " +
          "IP → kiểm thử</b>. Hai chỗ đề hay hỏi: <b>switch không thay được router</b> (switch chỉ chia " +
          "cổng nội bộ), và <b>mỗi thiết bị một IP riêng</b>, trùng là cả hai cùng hỏng.",
        giai: "Đổi máy in sang <b>192.168.1.12</b> là hết xung đột. Kiểm thử: từ mỗi máy thử <b>ping</b> " +
          "router và một máy khác, rồi mở thử một trang web — thông cả hai thì mạng mới coi là xong. Bỏ " +
          "kiểm thử thì lỗi chỉ lộ ra đúng lúc đang cần dùng." },
    ];

    var buoc;
    var node = MH.el(MH.khung("Dựng mạng LAN cho một phòng làm việc",
      "Phòng cần nối mạng cho <b>2 máy bàn</b> và <b>1 máy in</b> (nối dây), <b>điện thoại và laptop</b> " +
      "(wifi), tất cả phải ra được Internet. Bấm “Bước tiếp” để đi qua từng quyết định thiết kế và nhìn " +
      "ngay <b>lúc đó thiết bị nào đã vào được mạng</b>.",
      '<div data-mh="so"></div>' +
      '<div class="mh9-chu"><span><i class="xong"></i> đã vào mạng</span>' +
      '<span><i class="hong"></i> chưa nối được</span>' +
      '<span><i class="cho"></i> dự kiến, chưa có</span></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<table class="mh4-b" data-mh="bang" style="margin:11px auto 0" hidden></table>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));
    var loi = loiCua(node);

    function hangHop(ds, lop) {
      return '<div class="mh9-so">' + ds.map(function (o, i) {
        return '<div class="mh9-tb ' + lop[i] + '"><b>' + esc(o.ten) + "</b><small>" +
          esc(o.vai) + "</small></div>";
      }).join("") + "</div>";
    }

    function veBang(d) {
      var b = node.querySelector('[data-mh="bang"]');
      if (!d.bang) { b.hidden = true; return; }
      b.hidden = false;
      var h = "<tr><th>Thiết bị</th><th>Địa chỉ IP</th><th>Kiểm thử</th></tr>";
      IP.forEach(function (r) {
        /* Bước cuối chỉ đổi ĐÚNG MỘT ô địa chỉ, bảng giữ nguyên phần còn lại —
           để mắt thấy rõ sửa một chỗ là cả hai máy chạy lại được. */
        var conTrung = r.trung && !d.xong;
        var lop = conTrung ? "rac" : (r.sua && d.xong ? "nay" : "");
        h += '<tr class="' + lop + '"><td>' + esc(r.ten) + "</td><td>" +
          esc(r.sua && d.xong ? r.sua : r.ip) + "</td><td>" +
          (conTrung ? "xung đột" : "ping được") + "</td></tr>";
      });
      b.innerHTML = h;
    }

    function ve() {
      var d = BUOC[buoc];
      node.querySelector('[data-mh="so"]').innerHTML =
        hangHop(HT, d.ht) + '<div class="mh9-noi"></div>' + hangHop(TB, d.tb);
      node.querySelector('[data-mh="dem"]').innerHTML =
        "đã vào mạng: <b>" + d.noi + "/" + TB.length + "</b> thiết bị · ra Internet: <b>" +
        esc(d.net) + "</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !d.canh;
      if (d.canh) canh.innerHTML = d.canh;

      veBang(d);

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !d.ghi;
      ghi.className = "mh7-ghi" + (d.ghi ? " xong" : "");
      if (d.ghi) ghi.innerHTML = d.ghi;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= BUOC.length - 1) {
        loi("Đã dựng xong cả mạng. Bấm “Làm lại” để đi lại từ bước xác định nhu cầu.");
        return;
      }
      buoc++; ve(); loi(BUOC[buoc].giai);
    };

    function lamLai() { buoc = 0; ve(); loi(BUOC[0].giai); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-18 · TRỰC QUAN HOÁ DỮ LIỆU
   *
   *  Ý ĐỒ: giữ NGUYÊN một bộ số (4 quý, chênh nhau chưa tới 6%) rồi đổi cách
   *  vẽ. Học sinh thấy tận mắt cùng dữ liệu mà kết luận rút ra ngược nhau —
   *  bài học không nằm ở con số mà ở cái trục và ở loại biểu đồ.
   *
   *  ĐIỂM MẤU CHỐT KĨ THUẬT: chiều cao cột phải tính từ ĐÁY TRỤC chứ không
   *  phải từ 0. Gán chiều cao bừa là hỏng cả bài, vì cái học sinh cần đếm
   *  chính là "cột cao gấp mấy lần" trước và sau khi cắt trục.
   * ================================================================ */
  MH.dangKy("C12-18", function (host) {
    var DL = [{ ten: "Q1", v: 102 }, { ten: "Q2", v: 105 }, { ten: "Q3", v: 104 }, { ten: "Q4", v: 108 }];
    var MAU = ["var(--primary)", "var(--warning)", "var(--success)", "var(--danger)"];
    var b, i;

    var hTen = "", hSo = "";
    for (i = 0; i < DL.length; i++) {
      hTen += "<th>" + esc(DL[i].ten) + "</th>";
      hSo += "<td>" + DL[i].v + "</td>";
    }

    var node = MH.el(MH.khung("Cùng một bộ số, vẽ khác nhau thì kết luận khác nhau",
      "Doanh thu bốn quý của một cửa hàng (triệu đồng). Bấm <b>“Bước tiếp”</b> để xem cùng bộ số này " +
      "biến hình qua từng kiểu vẽ, hoặc tự bật/tắt các thủ thuật ở trên để so.",
      '<table class="mh4-b" style="margin:0 auto 13px"><tr><th>Quý</th>' + hTen + "</tr>" +
      "<tr><th>Doanh thu</th>" + hSo + "</tr></table>" +
      '<div data-mh="ve"></div>' +
      '<p class="mh9-truc" data-mh="truc"></p>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="cat"> cắt trục y (bắt đầu từ 100 ' +
      "thay vì 0)</label>" +
      ' <select data-mh="loai"><option value="cot">Biểu đồ cột</option>' +
      '<option value="tron">Biểu đồ tròn</option><option value="duong">Biểu đồ đường</option></select>'));

    var loi = loiCua(node);
    function loai() { return node.querySelector('[data-mh="loai"]').value; }
    function cat() { return node.querySelector('[data-mh="cat"]').checked; }
    function so1(x) { return x.toFixed(1).replace(".", ","); }

    /* CÔNG THỨC GỐC của cả minh hoạ: chiều cao đo từ đáy trục.
       đáy 0   -> h tỉ lệ thẳng với giá trị, cột nói thật.
       đáy 100 -> chỉ phần vượt quá 100 được vẽ, chênh lệch bị phóng đại. */
    function caoCot(v, day, tran) { return (v - day) / (tran - day) * 100; }

    function veCot(day, tran) {
      var h = '<div class="mh9-cot">', j;
      for (j = 0; j < DL.length; j++) {
        h += '<div class="mh9-c' + (j === DL.length - 1 ? " nay" : "") + '">' +
          '<i style="height:' + caoCot(DL[j].v, day, tran).toFixed(1) + '%"></i>' +
          "<b>" + DL[j].v + "</b><small>" + esc(DL[j].ten) + "</small></div>";
      }
      return h + "</div>";
    }

    function veTron() {
      var tong = 0, j;
      for (j = 0; j < DL.length; j++) tong += DL[j].v;
      var moc = 0, phan = [], chu = "", pt;
      for (j = 0; j < DL.length; j++) {
        pt = DL[j].v / tong * 100;
        phan.push(MAU[j] + " " + moc.toFixed(2) + "% " + (moc + pt).toFixed(2) + "%");
        moc += pt;
        chu += '<span><i style="background:' + MAU[j] + '"></i> ' + esc(DL[j].ten) + " " +
          so1(pt) + "%</span>";
      }
      return '<div class="mh9-tron" style="background:conic-gradient(' + phan.join(",") + ')"></div>' +
        '<div class="mh9-chu">' + chu + "</div>";
    }

    /* Đường vẫn lấy trục y từ 0 cho trung thực: đường lên rất thoải, đúng với
       chênh lệch thật. Cái nó cho thêm so với tròn là TRỤC THỜI GIAN. */
    function veDuong() {
      var TRAN = 120, X0 = 34, X1 = 306, Y0 = 124, Y1 = 12, j, x, y;
      var buocX = (X1 - X0) / (DL.length - 1), d = "", ch = "";
      for (j = 0; j < DL.length; j++) {
        x = X0 + buocX * j;
        y = Y0 - DL[j].v / TRAN * (Y0 - Y1);
        d += x.toFixed(1) + "," + y.toFixed(1) + " ";
        ch += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="var(--primary)"></circle>' +
          '<text x="' + x.toFixed(1) + '" y="' + (y - 9).toFixed(1) + '" text-anchor="middle" ' +
          'font-size="10" fill="var(--text-soft)">' + DL[j].v + "</text>" +
          '<text x="' + x.toFixed(1) + '" y="141" text-anchor="middle" font-size="10" ' +
          'fill="var(--text-soft)">' + esc(DL[j].ten) + "</text>";
      }
      return '<svg viewBox="0 0 320 150" style="width:100%;height:150px">' +
        '<line x1="30" y1="124" x2="312" y2="124" stroke="var(--border)" stroke-width="1"></line>' +
        '<line x1="30" y1="12" x2="30" y2="124" stroke="var(--border)" stroke-width="1"></line>' +
        '<text x="26" y="127" text-anchor="end" font-size="9" fill="var(--text-soft)">0</text>' +
        '<text x="26" y="16" text-anchor="end" font-size="9" fill="var(--text-soft)">120</text>' +
        '<polyline points="' + d + '" fill="none" stroke="var(--primary)" stroke-width="2.5" ' +
        'stroke-linejoin="round"></polyline>' + ch + "</svg>";
    }

    function ve() {
      var l = loai(), c = cat() && l === "cot";
      /* Cắt trục chỉ có nghĩa với biểu đồ cột, khoá lại cho khỏi hiểu nhầm. */
      node.querySelector('[data-mh="cat"]').disabled = l !== "cot";
      var oVe = node.querySelector('[data-mh="ve"]');
      var oTruc = node.querySelector('[data-mh="truc"]');
      var oDem = node.querySelector('[data-mh="dem"]');
      var oCanh = node.querySelector('[data-mh="canh"]');
      var dau = DL[0], cuoi = DL[DL.length - 1];
      var chenh = (cuoi.v - dau.v) / dau.v * 100;

      if (l === "cot") {
        var day = c ? 100 : 0, tran = c ? 110 : 120;
        var lan = caoCot(cuoi.v, day, tran) / caoCot(dau.v, day, tran);
        oVe.innerHTML = veCot(day, tran);
        oTruc.innerHTML = c ? "trục y bắt đầu từ <b>100</b> (đã cắt khúc dưới), đỉnh 110"
                            : "trục y bắt đầu từ <b>0</b>, đỉnh 120";
        oDem.innerHTML = "Doanh thu Q4 hơn Q1 <b>" + so1(chenh) + "%</b> &middot; cột Q4 cao gấp <b>" +
          so1(lan) + " lần</b> cột Q1";
        oCanh.hidden = !c;
        if (c) oCanh.innerHTML = "<b>Biểu đồ này đang đánh lừa.</b> Không con số nào sai, chỉ khúc trục " +
          "từ 0 đến 100 bị cắt bỏ. Mắt người so <b>chiều cao cột</b>, mà chiều cao giờ chỉ còn vẽ phần " +
          "vượt quá 100 — nên chênh <b>" + so1(chenh) + "%</b> hoá thành <b>" + so1(lan) + " lần</b>. " +
          "Gặp biểu đồ cột, việc đầu tiên là <b>nhìn xem trục y bắt đầu từ đâu</b>.";
      } else if (l === "tron") {
        oVe.innerHTML = veTron();
        oTruc.innerHTML = "biểu đồ tròn không có trục — nó chỉ nói <b>tỉ lệ của một tổng</b>";
        oDem.innerHTML = "Bốn phần đều xấp xỉ <b>25%</b> &middot; nhìn hình không biết quý nào trước, " +
          "quý nào sau";
        oCanh.hidden = false;
        oCanh.innerHTML = "<b>Sai loại biểu đồ.</b> Tròn chỉ dùng khi các phần <b>cộng lại thành một " +
          "tổng có nghĩa</b> (cơ cấu, tỉ lệ phần trăm). Bốn quý cộng lại thành cả năm nên tạm chấp " +
          "nhận, nhưng nó <b>giấu mất xu hướng theo thời gian</b> — thứ quan trọng nhất ở đây. Đổi chỗ " +
          "Q1 với Q4 thì hình gần như y hệt. Dữ liệu theo thời gian phải vẽ <b>cột hoặc đường</b>.";
      } else {
        oVe.innerHTML = veDuong();
        oTruc.innerHTML = "trục y bắt đầu từ <b>0</b> &middot; trục x là <b>thời gian</b>, có thứ tự";
        oDem.innerHTML = "Xu hướng: tăng &rarr; <b>hụt ở Q3</b> &rarr; tăng lại &middot; cả năm nhích " +
          "lên <b>" + so1(chenh) + "%</b>";
        oCanh.hidden = true;
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= 4) {
        loi("Hết bước rồi. Em tự đổi ô chọn loại biểu đồ và tích/bỏ tích <b>“cắt trục y”</b> để so lại.");
        return;
      }
      b++;
      var oL = node.querySelector('[data-mh="loai"]'), oC = node.querySelector('[data-mh="cat"]');
      if (b === 1) { oL.value = "cot"; oC.checked = true; }
      else if (b === 2) { oL.value = "tron"; oC.checked = false; }
      else if (b === 3) { oL.value = "duong"; }
      else { oL.value = "cot"; oC.checked = false; }
      ve();
      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = b < 4;
      if (b === 1) {
        loi("Vừa <b>cắt trục</b>: y bắt đầu từ 100. Bảng số liệu phía trên <b>không đổi một chữ</b>, " +
          "nhưng cột Q4 giờ trông cao vọt. Đây là thủ thuật đánh lừa phổ biến nhất trên báo và quảng cáo.");
      } else if (b === 2) {
        loi("Đổi sang <b>biểu đồ tròn</b>. Bốn miếng gần bằng nhau nên đọc được “mỗi quý góp khoảng một " +
          "phần tư năm”, nhưng <b>không thấy quý nào tăng, quý nào giảm</b> — hình tròn không có thứ tự " +
          "thời gian.");
      } else if (b === 3) {
        loi("<b>Biểu đồ đường</b> — hợp với dữ liệu theo thời gian. Trục x có thứ tự nên đọc được cả " +
          "nhịp: lên ở Q2, <b>hụt ở Q3</b>, lên lại ở Q4. Đường đi rất thoải vì chênh lệch thật vốn nhỏ.");
      } else {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "<b>Chọn biểu đồ theo câu hỏi cần trả lời, không theo cho đẹp.</b> " +
          "Hỏi “xu hướng theo thời gian ra sao?” &rarr; <b>đường</b> (hoặc cột). " +
          "Hỏi “so giá trị giữa các mục?” &rarr; <b>cột, trục y từ 0</b>. " +
          "Hỏi “mỗi phần chiếm bao nhiêu của tổng?” &rarr; <b>tròn</b>, và chỉ khi ít phần. " +
          "Và trước khi tin bất kì biểu đồ cột nào: <b>kiểm tra trục y có bắt đầu từ 0 không</b> — " +
          "trục không từ 0 thì cột nói dối dù mọi con số đều đúng.";
        loi("Xong. Em quay lại bật/tắt <b>“cắt trục y”</b> vài lần để nhớ mặt cái bẫy này.");
      }
    };

    function lamLai() {
      b = 0;
      node.querySelector('[data-mh="loai"]').value = "cot";
      node.querySelector('[data-mh="cat"]').checked = false;
      node.querySelector('[data-mh="ghi"]').hidden = true;
      ve();
      loi("Biểu đồ cột, <b>trục y bắt đầu từ 0</b>: chiều cao cột tỉ lệ đúng với con số nên đọc được " +
        "sự thật — bốn quý gần bằng nhau, chỉ nhích lên nhẹ. Ghi nhớ hình dáng này rồi bấm “Bước tiếp”.");
    }
    /* Không nối hai ô điều khiển vào ganDatLai: đặt lại về bước 0 là mất luôn
       phép so sánh trước/sau khi cắt trục — đúng cái đang cần nhìn. */
    ganDatLai(node, [], lamLai);
    node.querySelector('[data-mh="cat"]').addEventListener("change", ve);
    node.querySelector('[data-mh="loai"]').addEventListener("change", ve);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C12-28 · TỪ DỮ LIỆU THÔ ĐẾN BẢNG SỐ LIỆU ĐÁNG TIN
   *
   *  Bài này SGK nói bằng lời ("phải làm sạch dữ liệu") nên học sinh gật đầu
   *  rồi quên ngay — vì chưa ai cho các em thấy CÁI GIÁ của việc không làm.
   *  Nên mô phỏng đặt con số trung bình ngay dưới bảng và TÍNH LẠI THẬT sau
   *  mỗi bước: hơn 330 cm lúc đầu (học sinh cao hơn 3 mét!) tụt về khoảng 165
   *  cm khi bảng sạch. Cùng một công thức, cùng một bảng — chỉ khác dữ liệu.
   *
   *  KHÔNG gán số cứng ở bất kì bước nào: mọi con số đều chạy qua tinh(). Sửa
   *  dữ liệu mẫu thì lời giải thích tự khớp theo.
   * ================================================================ */
  MH.dangKy("C12-28", function (host) {
    /* Bảng thô cố ý cài đủ loại lỗi hay gặp khi thu bằng biểu mẫu. */
    var GOC = [
      { ten: "Lê An", lop: "12A1", cao: "162" },
      { ten: "Trần Bình", lop: " 12A1 ", cao: "170" },
      { ten: "Vũ Chi", lop: "12a1", cao: "" },       // thiếu giá trị
      { ten: "Phạm Dung", lop: "12A1", cao: "1.65" },  // sai đơn vị (mét)
      { ten: "Ngô Hà", lop: "12a1", cao: "1650" },     // ngoại lai, gõ thừa số 0
      { ten: "Lê An", lop: "12A1", cao: "162" },       // trùng lặp với dòng 1
      { ten: "Đỗ Kiên", lop: " 12A1 ", cao: "158" },
      { ten: "Bùi Mai", lop: "12A1", cao: "167" },
      { ten: "Hoàng Nam", lop: "12a1", cao: "172" },
    ];
    var TRONG = 2, DONVI = 3, NGOAI = 4, LAP = 5;  // chỉ số dòng lỗi tương ứng
    var HET = 6;                                    // bước cuối = kết luận
    var B, buoc, tbTruoc;

    var node = MH.el(MH.khung("Từ bảng thô bẩn đến bảng số liệu đáng tin",
      "Đây là dữ liệu khảo sát chiều cao thu về từ biểu mẫu, <b>chưa làm sạch</b>. Mỗi lần bấm “Bước " +
      "tiếp” em sửa một loại lỗi — hãy nhìn dòng số thống kê dưới bảng <b>đổi ngay sau mỗi bước</b>.",
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    /* Đọc một ô chiều cao. Trả null nếu ô trống hoặc không phải số — null nghĩa
       là KHÔNG BIẾT, và null không bao giờ được quy về 0 ở chỗ nào khác. */
    function so(txt) {
      var t = String(txt).replace(/^\s+|\s+$/g, "").replace(",", ".");
      if (t === "") return null;
      var n = parseFloat(t);
      return isNaN(n) ? null : n;
    }

    /* Tính lại toàn bộ thống kê từ trạng thái bảng HIỆN TẠI. */
    function tinh() {
      var ds = [], lop = [], i, v;
      for (i = 0; i < B.length; i++) {
        if (B[i].xoa) continue;                       // dòng trùng đã bỏ
        if (lop.indexOf(B[i].lop) < 0) lop.push(B[i].lop);
        if (B[i].loai) continue;                      // đã loại khỏi phép tính
        v = so(B[i].cao);
        if (v !== null) ds.push(v);
      }
      var tong = 0;
      for (i = 0; i < ds.length; i++) tong += ds[i];
      return { dung: ds.length, tong: tong, lop: lop.length,
        tb: ds.length ? tong / ds.length : null };
    }
    function sc(x) { return x === null ? "—" : x.toFixed(1); }

    /* Ô Lớp: khi chưa chuẩn hoá thì bọc trong ngoặc kép và giữ khoảng trắng,
       nếu không học sinh không thể thấy " 12A1 " khác "12A1" ở chỗ nào. */
    function veLop(r) {
      if (buoc >= 1) return esc(r.lop);
      return "“" + esc(r.lop).replace(/ /g, "\u00a0") + "”";
    }

    function ve() {
      var k = tinh();
      var nay = buoc === 4 ? DONVI : -1;   // dòng đang sửa (không bị loại/xoá)

      var h = "<tr><th>STT</th><th>Họ tên</th><th>Lớp</th><th>Chiều cao (cm)</th></tr>";
      for (var i = 0; i < B.length; i++) {
        var r = B[i], cls = "";
        if (r.xoa) cls = "xoa";
        else if (r.loai) cls = "rac";
        else if (i === nay) cls = "nay";
        else if (buoc >= HET) cls = "khop";

        var cTen = (i === LAP && buoc < 2) ? ' class="mh8-trung"' : "";
        var cLop = buoc < 1 ? ' class="mh8-trung"' : "";
        var xau = (i === TRONG && buoc < 3) || (i === DONVI && buoc < 4) ||
          (i === NGOAI && buoc < 5);
        var cCao = xau ? ' class="mh8-lech"' : "";
        var oCao = r.cao === "" ? "(trống)" : esc(r.cao);

        h += '<tr class="' + cls + '"><td>' + (i + 1) + "</td><td" + cTen + ">" +
          esc(r.ten) + "</td><td" + cLop + ">" + veLop(r) + "</td><td" + cCao + ">" +
          oCao + "</td></tr>";
      }
      node.querySelector('[data-mh="bang"]').innerHTML = h;

      node.querySelector('[data-mh="dem"]').innerHTML =
        "dùng được: <b>" + k.dung + "/" + B.length + "</b> dòng &nbsp;·&nbsp; " +
        "trung bình: <b>" + sc(k.tb) + "</b> cm &nbsp;·&nbsp; " +
        "số lớp đếm được: <b>" + k.lop + "</b>";
      return k;
    }

    function canhBao(html) {
      var c = node.querySelector('[data-mh="canh"]');
      c.hidden = !html;
      if (html) c.innerHTML = html;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= HET) {
        loi("Hết các bước làm sạch rồi. Bấm “Làm lại” để xem lại bảng thô từ đầu.");
        return;
      }
      var truoc = tinh();
      buoc++;
      canhBao("");

      if (buoc === 1) {
        /* Chuẩn hoá: cắt khoảng trắng hai đầu rồi viết hoa. */
        for (var i = 0; i < B.length; i++) {
          B[i].lop = B[i].lop.replace(/^\s+|\s+$/g, "").toUpperCase();
        }
      } else if (buoc === 2) { B[LAP].xoa = true; }
      else if (buoc === 3) { B[TRONG].loai = true; }
      else if (buoc === 4) { B[DONVI].cao = "165"; }
      else if (buoc === 5) { B[NGOAI].loai = true; }

      var k = ve();
      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = true;

      if (buoc === 1) {
        loi("Chuẩn hoá cột Lớp: cắt khoảng trắng thừa rồi viết hoa. Với máy thì <b>“12a1”, “12A1”, " +
          "“ 12A1 ” là ba giá trị khác nhau</b> — mắt em đọc thấy y hệt nhưng máy đếm ra <b>" +
          truoc.lop + "</b> lớp. Giờ chỉ còn <b>" + k.lop + "</b> lớp. Trung bình chưa đổi (" +
          sc(k.tb) + " cm) vì mới động vào cột chữ.");
      } else if (buoc === 2) {
        loi("Bạn <b>Lê An</b> nộp biểu mẫu hai lần nên có hai dòng giống hệt nhau. Bỏ dòng trùng: " +
          "trung bình <b>" + sc(truoc.tb) + "</b> → <b>" + sc(k.tb) + "</b> cm. Dòng trùng làm một bạn " +
          "được tính hai lần, kéo trung bình về phía bạn đó.");
      } else if (buoc === 3) {
        /* Trung bình KHÔNG đổi ở bước này và đó là chủ ý: ô trống vốn đã bị loại
           khỏi phép tính từ đầu. Cái đáng nói nằm ở khối cảnh báo — con số giả
           định "nếu điền 0" mới là bài học. */
        var neu0 = k.tong / (k.dung + 1);
        loi("Ô chiều cao của <b>Vũ Chi</b> bỏ trống. Trống nghĩa là <b>KHÔNG BIẾT</b>, nên loại dòng này " +
          "khỏi phép tính trung bình: còn <b>" + k.dung + "</b> dòng dùng được, trung bình vẫn <b>" +
          sc(k.tb) + "</b> cm.");
        canhBao("Ngộ nhận rất hay gặp: <b>coi ô trống là số 0</b>. Nếu điền 0 vào đây, trung bình tụt " +
          "ngay xuống <b>" + sc(neu0) + "</b> cm — thêm một con số sai nữa. Không ai cao 0 cm cả; ô " +
          "trống là <b>thiếu dữ liệu</b>, không phải giá trị bằng không.");
      } else if (buoc === 4) {
        loi("Dòng <b>Phạm Dung</b> ghi <b>1.65</b> — đó là đơn vị mét, trong khi cả cột ghi bằng " +
          "xăng-ti-mét. Đổi về <b>165</b> cm. Trung bình <b>" + sc(truoc.tb) + "</b> → <b>" +
          sc(k.tb) + "</b> cm. Máy không tự biết đơn vị: nó thấy 1.65 thì cứ cộng 1.65 vào.");
      } else if (buoc === 5) {
        loi("Giá trị <b>1650</b> cm là 16,5 mét — chắc chắn do gõ thừa một số 0. Loại nó ra: trung bình " +
          "<b>" + sc(truoc.tb) + "</b> → <b>" + sc(k.tb) + "</b> cm. <b>Chỉ MỘT giá trị ngoại lai đã đủ " +
          "làm hỏng trung bình của cả bảng</b>. Cẩn thận hơn thì hỏi lại bạn đó để sửa đúng, thay vì bỏ hẳn.");
      } else {
        loi("Xong. Bảng giờ đã đáng tin để vẽ biểu đồ và rút kết luận.");
        ghi.hidden = false;
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Trung bình lúc đầu <b>" + sc(tbTruoc) + "</b> cm — tức là bảng đang nói học " +
          "sinh lớp em cao hơn <b>3 mét</b>. Sau khi làm sạch: <b>" + sc(k.tb) + "</b> cm, dùng được <b>" +
          k.dung + "/" + B.length + "</b> dòng, đúng <b>" + k.lop + "</b> lớp. Công thức tính trung bình " +
          "<b>không hề sai ở lần nào</b> — chỉ dữ liệu bẩn. Nhớ lấy: <b>dữ liệu bẩn thì mọi biểu đồ và " +
          "mọi kết luận vẽ ra từ nó đều sai</b>. Vì thế trong công việc thật với dữ liệu, <b>làm sạch là " +
          "phần tốn thời gian nhất</b>, không phải phần phụ làm qua loa trước khi tính.";
      }
    };

    function lamLai() {
      B = GOC.map(function (r) { return { ten: r.ten, lop: r.lop, cao: r.cao }; });
      buoc = 0;
      canhBao("");
      node.querySelector('[data-mh="ghi"]').hidden = true;
      var k = ve();
      tbTruoc = k.tb;
      loi("Bảng thô vừa thu về. Máy tính trung bình ngay và ra <b>" + sc(k.tb) + "</b> cm — hơn 3 mét, " +
        "vô lí. Các ô <b>viền đỏ</b> là chỗ có vấn đề ở cột số, ô <b>gạch chân lượn sóng</b> là chỗ viết " +
        "không đồng nhất hoặc bị lặp. Bấm “Bước tiếp” để sửa từng loại lỗi.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-04 · TỔ CHỨC VÀ QUẢN LÍ DỮ LIỆU BẰNG TỆP VÀ THƯ MỤC
   *
   *  Bài này cũng đang TRẮNG. Đọc SGK thì ai cũng gật, nhưng đụng đề là sai ba
   *  chỗ: tưởng đường dẫn tương đối cũng tính từ ổ đĩa, tưởng đổi phần mở rộng
   *  là đổi được loại tệp, và tưởng xoá thư mục thì chỉ mất mỗi thư mục đó.
   *  Cả ba đều là ngộ nhận về HẬU QUẢ nên phải cho học sinh THẤY hậu quả.
   * ================================================================ */
  MH.dangKy("C11-04", function (host) {
    /* Cây dựng lại từ đầu ở mỗi bước thay vì sửa tại chỗ: bước 5 mọc thêm một
       tệp trùng tên, bước 6 đổi phần mở rộng. Dựng lại thì học sinh bấm nhảy về
       bước cũ lúc nào cũng đúng, không phải nhớ đường lùi. */
    function layCay(opt) {
      var toan11 = [{ ten: "dethi.docx" }];
      if (opt.trung) toan11.push({ ten: "baitap1.py" });
      return { ten: "C:\\", con: [
        { ten: "HocTap", con: [
          { ten: "Tin11", con: [{ ten: "baitap1.py" }, { ten: "baitap2.py" }] },
          { ten: "Toan11", con: toan11 }] },
        { ten: "Anh", con: [{ ten: "dulich", con: [{ ten: opt.doi ? "bien.txt" : "bien.jpg" }] }] }] };
    }

    function dsDong(opt) {
      var ds = [];
      (function duyet(nut, cha, sau) {
        var dd = cha === null ? nut.ten : (cha === "C:\\" ? cha + nut.ten : cha + "\\" + nut.ten);
        ds.push({ dd: dd, sau: sau, nhan: cha === null ? nut.ten : nut.ten + (nut.con ? "\\" : "") });
        if (nut.con) nut.con.forEach(function (c) { duyet(c, dd, sau + 1); });
      })(layCay(opt), null, 0);
      return ds;
    }

    var RAC = "\u00ffØ\u00ffà JFIF  H H  \u00ffÛ C  ) , ' 3 \u2021 q \u0002 Ü ¥ ¿ ‰ Š ×  ² ...";

    var B = [
      { dung: "C:\\Anh\\dulich", go: "C:\\HocTap\\Tin11\\baitap1.py", hop: true,
        mo: "C:\\HocTap\\Tin11\\baitap1.py", sang: ["C:\\HocTap\\Tin11\\baitap1.py"],
        tom: "Đường dẫn tuyệt đối — mở được",
        giai: "Em đang đứng tận trong <code>C:\\Anh\\dulich</code>, chẳng dính dáng gì tới Tin11, vậy mà " +
          "vẫn mở được tệp. Vì đường dẫn này bắt đầu từ <b>ổ đĩa C:\\</b> — nó chỉ đường từ gốc nên " +
          "<b>đứng ở đâu cũng ra đúng một tệp</b>. Đó là đường dẫn <b>tuyệt đối</b>." },

      { dung: "C:\\HocTap\\Tin11", go: "baitap2.py", hop: true,
        mo: "C:\\HocTap\\Tin11\\baitap2.py", sang: ["C:\\HocTap\\Tin11\\baitap2.py"],
        tom: "Đường dẫn tương đối — mở được",
        giai: "Lần này em gõ vỏn vẹn một cái tên, không có <code>C:\\</code> ở đầu. Hệ điều hành hiểu đó " +
          "là đường dẫn <b>tương đối</b>: nó lấy <b>thư mục em đang đứng</b> ghép với tên vừa gõ, thành " +
          "<code>C:\\HocTap\\Tin11\\baitap2.py</code>. Đứng đúng chỗ thì gõ ngắn cho nhanh." },

      { dung: "C:\\HocTap\\Tin11", go: "dethi.docx", hop: false, sang: [],
        tom: "Cùng kiểu gõ ngắn — nhưng không thấy",
        canh: "Không tìm thấy <b>dethi.docx</b> trong <b>C:\\HocTap\\Tin11</b>.",
        giai: "Tệp <code>dethi.docx</code> <b>có thật</b>, em nhìn thấy nó ngay trong cây bên trái. Nhưng " +
          "nó nằm ở <code>C:\\HocTap\\Toan11</code>. Đây là chỗ sai kinh điển: đường dẫn tương đối " +
          "<b>tính từ thư mục đang đứng</b>, <b>không phải từ ổ đĩa</b> — máy chỉ mở đúng Tin11 ra tìm, " +
          "không thấy thì báo không có, chứ nó không đi lùng khắp ổ đĩa giùm em." },

      { dung: "C:\\HocTap\\Tin11", go: "..\\Toan11\\dethi.docx", hop: true,
        mo: "C:\\HocTap\\Toan11\\dethi.docx", sang: ["C:\\HocTap\\Toan11\\dethi.docx"],
        tom: "Dùng .. để lùi ra thư mục cha",
        giai: "Hai dấu chấm <code>..</code> nghĩa là <b>lùi ra thư mục cha</b>. Đọc từ trái sang: từ " +
          "<code>Tin11</code> lùi ra <code>HocTap</code>, rồi vào <code>Toan11</code>, rồi lấy " +
          "<code>dethi.docx</code>. Vẫn là đường dẫn tương đối, chỉ khác là nó biết đi ngược lên trước " +
          "khi đi xuống." },

      { dung: "C:\\HocTap\\Tin11", go: "..\\Toan11\\baitap1.py", hop: true, opt: { trung: true },
        mo: "C:\\HocTap\\Toan11\\baitap1.py",
        sang: ["C:\\HocTap\\Tin11\\baitap1.py", "C:\\HocTap\\Toan11\\baitap1.py"],
        tom: "Hai tệp trùng tên, khác thư mục",
        canh: "Nhưng thử tạo thêm <b>một baitap1.py nữa ngay trong Tin11</b>: hệ điều hành <b>từ chối</b> " +
          "(hoặc hỏi có ghi đè lên tệp cũ không). Trong <b>cùng một thư mục</b> thì tên phải là duy nhất.",
        ghi: "Thư mục <code>Toan11</code> vừa có thêm một tệp cũng tên <code>baitap1.py</code>. Hai tệp " +
          "này <b>hoàn toàn khác nhau</b>, nội dung muốn khác thế nào cũng được, vì <b>đường dẫn đầy đủ " +
          "của chúng khác nhau</b>: <code>...\\Tin11\\baitap1.py</code> và " +
          "<code>...\\Toan11\\baitap1.py</code>. Nhớ gọn lại: trùng tên <b>khác thư mục thì được</b>, " +
          "<b>cùng thư mục thì không</b>.",
        giai: "Cả hai dòng <code>baitap1.py</code> cùng sáng lên — chúng là hai tệp riêng biệt. Cái định " +
          "danh một tệp là <b>cả đường dẫn</b>, không phải mỗi cái tên." },

      { dung: "C:\\Anh\\dulich", go: "bien.txt", hop: true, opt: { trung: true, doi: true },
        mo: "C:\\Anh\\dulich\\bien.txt", sang: ["C:\\Anh\\dulich\\bien.txt"],
        tom: "Đổi .jpg thành .txt rồi mở thử",
        canh: "Máy thấy đuôi <b>.txt</b> nên mở bằng phần mềm soạn thảo văn bản, và hiện ra:<br>" +
          "<code>" + esc(RAC) + "</code>",
        ghi: "Tệp <b>vẫn nguyên là tấm ảnh</b> — từng byte bên trong không hề suy suyển. Em chỉ đổi cái " +
          "nhãn dán ngoài. Phần mở rộng là <b>lời mách nước cho hệ điều hành biết nên gọi phần mềm " +
          "nào</b>, chứ nó <b>không quyết định nội dung</b>. Đổi <code>.jpg</code> thành <code>.txt</code> " +
          "thì máy gọi nhầm phần mềm, phần mềm đó cố đọc ảnh như chữ nên phun ra một mớ kí tự vô nghĩa. " +
          "Đổi ngược lại thành <code>.jpg</code> là ảnh xem được ngay như cũ. Muốn đổi thật loại tệp thì " +
          "phải dùng phần mềm <b>chuyển đổi</b>, không phải sửa tên.",
        giai: "Đây là ngộ nhận nặng nhất của bài: <b>đổi phần mở rộng không đổi nội dung tệp</b>." },

      { dung: "C:\\", go: "Xoá thư mục HocTap", van: true, opt: { trung: true, doi: true },
        sang: [], xoa: "C:\\HocTap",
        dem: "Đang đứng ở: <b>C:\\</b> · lệnh: <b>xoá thư mục HocTap</b><br>" +
          "Mất theo: <b>2 thư mục con và 4 tệp</b>",
        tom: "Xoá một thư mục — mất cả cây con",
        canh: "Mất luôn: <b>Tin11</b>, <b>Toan11</b>, <b>baitap1.py</b>, <b>baitap2.py</b>, " +
          "<b>dethi.docx</b> và cả <b>baitap1.py</b> bên Toan11.",
        ghi: "Xoá một thư mục là xoá <b>toàn bộ cây con</b> bên trong nó, sâu bao nhiêu tầng cũng xoá " +
          "hết. Máy không hỏi lại từng tệp một. Bên nhánh <code>Anh</code> không hề gì vì nó nằm ngoài " +
          "<code>HocTap</code>. Đây chính là lí do phải <b>sao lưu</b>: một cú bấm nhầm ở đúng thư mục " +
          "gốc là mất cả học kì, mà bấm xong mới nhớ ra thì đã muộn.",
        xong: true,
        giai: "Những dòng mờ đi là những thứ vừa biến mất chỉ bằng <b>một</b> thao tác xoá." },
    ];

    var b;
    var node = MH.el(MH.khung("Đi trong cây thư mục bằng đường dẫn",
      "Bên trái là cây thư mục, bên phải là các bước em đã thử. Bấm “Bước tiếp” để thử từng thao tác và " +
      "xem <b>hệ điều hành hiểu ra sao</b>. Bấm vào một bước cũ bên phải để xem lại bước đó.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Cây thư mục</p>' +
      '<div class="mh7-code" data-mh="cay"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Các bước đã thử</p>' +
      '<div class="mh7-ds" data-mh="ds"></div></div>' +
      "</div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);
    function o(t) { return node.querySelector('[data-mh="' + t + '"]'); }

    function veCay(opt, sang, xoa) {
      o("cay").innerHTML = dsDong(opt).map(function (d) {
        var c = "mh7-d";
        if (sang.indexOf(d.dd) >= 0) c += " nay";
        else if (xoa && (d.dd === xoa || d.dd.indexOf(xoa + "\\") === 0)) c += " mo";
        return '<div class="' + c + '">' + esc(new Array(d.sau * 2 + 1).join(" ") + d.nhan) + "</div>";
      }).join("");
    }

    function veDs(i) {
      if (i < 0) { o("ds").innerHTML = '<p class="mh7-trong">Chưa thử bước nào.</p>'; return; }
      var h = "", k;
      for (k = 0; k <= i; k++) {
        h += '<div class="mh7-m' + (k === i ? " nay" : "") + '" data-i="' + k + '">' +
          "<b" + (B[k].van ? ' class="van"' : "") + ">" + esc(B[k].go) + "</b>" +
          "<small>" + esc(B[k].tom) + "</small></div>";
      }
      o("ds").innerHTML = h;
      node.querySelectorAll("[data-i]").forEach(function (m) {
        m.onclick = function () { b = Number(this.getAttribute("data-i")); hien(); };
      });
    }

    function hien() {
      veDs(b);
      if (b < 0) {
        veCay({}, [], null);
        o("dem").innerHTML = "Đang đứng ở: <b>C:\\</b> · chưa gõ đường dẫn nào";
        o("canh").hidden = true; o("ghi").hidden = true;
        loi("Bấm “Bước tiếp” để thử thao tác đầu tiên.");
        return;
      }
      var s = B[b];
      veCay(s.opt || {}, s.sang, s.xoa);
      o("dem").innerHTML = s.dem ? s.dem
        : ("Đang đứng ở: <b>" + esc(s.dung) + "</b> · gõ: <b>" + esc(s.go) + "</b><br>" +
          (s.hop ? "Mở được tệp: <b>" + esc(s.mo) + "</b>" : "Kết quả: <b>không tìm thấy</b>"));
      o("canh").hidden = !s.canh;
      if (s.canh) o("canh").innerHTML = s.canh;
      o("ghi").hidden = !s.ghi;
      if (s.ghi) { o("ghi").className = "mh7-ghi" + (s.xong ? " xong" : ""); o("ghi").innerHTML = s.ghi; }
      loi(s.giai);
    }

    o("tien").onclick = function () {
      if (b >= B.length - 1) { loi("Đã hết các bước. Bấm “Làm lại” để chạy lại từ đầu."); return; }
      b++; hien();
    };

    function lamLai() { b = -1; hien(); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });
})();
