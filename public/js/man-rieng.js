/* ============================================================================
 *  MÀN MÔ PHỎNG và MÀN THỰC HÀNH — hai màn RIÊNG, tách khỏi trang bài học
 *
 *  VÌ SAO TÁCH: trước đây bấm ô "Mô phỏng" trên bản đồ gọi go("lesson", {tieu})
 *  — dựng TOÀN BỘ trang bài (lý thuyết, Cần nhớ, sơ đồ, Sai ở đâu, ôn tập tương
 *  tác, từ vựng, cả bộ soạn code) rồi mới cuộn xuống khối cần xem. Ba cái giá:
 *    · dựng cả trang chỉ để xem một khối, kéo theo Skulpt (~948KB) dù mô phỏng
 *      không cần tới nó;
 *    · router phải có nhánh riêng "hashCoNeo" để XOÁ chỗ cuộn đã nhớ, kẻo lần
 *      sau bấm ô BÀI HỌC lại mở ra ở lưng trang. Đoạn phức tạp đó tồn tại CHỈ vì
 *      thiết kế này — tách màn ra là xoá được;
 *    · mô phỏng và bài học dùng CHUNG một địa chỉ, nên không gửi được link riêng
 *      và không có chỗ nào gắn tiến độ riêng cho nó.
 *
 *  ĐÁNH GIÁ: hai màn cố ý đo hai kiểu khác nhau, không phải cho khác cho vui.
 *    · Thực hành có máy chấm -> SAO, tính theo số bài làm đúng (Gam.soBaiTapXong).
 *    · Mô phỏng không có đúng/sai -> DẤU TÍCH "đã xem hết các bước". Gắn sao vào
 *      đây thì ai cũng 3/3, tức là sao vô nghĩa, và làm loãng ý nghĩa của sao ở ô
 *      Luyện tập.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;

  var KHOA_XEM = "mophongXem";   // danh sách id bài đã xem hết mô phỏng

  function napCss() {
    if (document.getElementById("mrCss")) return;
    var st = document.createElement("style");
    st.id = "mrCss";
    st.textContent =
      ".mr-dau{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;margin:8px 0 6px}" +
      ".mr-dau h2{margin:0;font-size:21px;flex:1;min-width:200px}" +
      ".mr-lop{display:inline-flex;align-items:center;gap:5px;flex:none;border-radius:999px;padding:5px 12px;" +
        "font:800 12px var(--font-sans)}" +
      ".mr-lop.mp{background:var(--info-soft);color:var(--info)}" +
      ".mr-lop.th{background:var(--primary-soft);color:var(--primary)}" +
      ".mr-mo{color:var(--text-soft);font-size:14px;line-height:1.6;margin:0 0 16px}" +
      ".mr-mo b{color:var(--text)}" +
      /* Thanh tiến độ / dấu tích ở đầu màn: cho biết ngay còn phải làm gì */
      ".mr-tien{display:flex;gap:10px;align-items:center;flex-wrap:wrap;border:1.5px solid var(--border);" +
        "border-radius:12px;background:var(--bg-card);padding:11px 14px;margin:0 0 18px}" +
      ".mr-tien.xong{border-color:var(--success);background:var(--success-soft)}" +
      ".mr-tien b{font:800 13.5px var(--font-sans)}" +
      ".mr-sao{display:inline-flex;gap:4px;flex:none}" +
      ".mr-sao svg{width:20px;height:20px;fill:var(--border)}" +
      ".mr-sao svg.on{fill:#ffc107;filter:drop-shadow(0 2px 4px rgba(255,193,7,.5))}" +
      ".mr-phu{font:600 12.5px var(--font-sans);color:var(--text-soft);flex:1;min-width:150px}" +
      ".mr-cuoi{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px;padding-top:18px;border-top:1px solid var(--border)}" +
      ".mr-trong{text-align:center;color:var(--text-soft);font-size:14px;padding:34px 12px}" +
      "@media (max-width:560px){.mr-cuoi .btn{width:100%}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ico(n, mau, co) {
    return typeof window.ICON === "function" ? window.ICON(n, co || 16, mau) : "";
  }
  function tenGon(l) { return String(l.title || "").replace(/^Bài\s*\d+[.\s]*/, ""); }
  function baiTheoId(id) {
    return (window.LESSONS || []).find(function (l) { return l.id === id; }) || null;
  }

  /* ------------------------------------------------ ĐÃ XEM HẾT MÔ PHỎNG */
  /* Lưu qua load/save của app.js để đi cùng đường đồng bộ tài khoản đang có
     (save() gọi Account.onSaved), khỏi phải thêm khoá lưu trữ mới ở chỗ khác. */
  function dsDaXem() {
    try { return (typeof load === "function" && load(KHOA_XEM, [])) || []; }
    catch (e) { return []; }
  }
  function daXemMoPhong(id) { return dsDaXem().indexOf(id) >= 0; }
  function ghiDaXem(id) {
    if (!id || daXemMoPhong(id)) return;
    var ds = dsDaXem(); ds.push(id);
    try { if (typeof save === "function") save(KHOA_XEM, ds); } catch (e) { /* hết chỗ lưu thì thôi */ }
  }

  /* ------------------------------------------------------- SỐ SAO THỰC HÀNH */
  var XUONG = [
    ["python", "EXERCISES", "injectExercises", "Python", "code"],
    ["sql", "SQL_EXERCISES", "injectSqlExercises", "SQL", "layers"],
    ["web", "WEB_EXERCISES", "injectWebExercises", "HTML/CSS", "globe"],
    ["gfx", "GLAB", "injectGraphicsLab", "đồ hoạ", "sprout"],
  ];
  /* Xưởng của một bài — lấy ĐÚNG thứ tự như xuongCuaBai() trong app.js, nếu không
     thì ô trên bản đồ nói một xưởng mà màn riêng mở ra xưởng khác. */
  function xuongCuaBai(id) {
    for (var i = 0; i < XUONG.length; i++) {
      var kho = window[XUONG[i][1]];
      if (kho && kho[id] && kho[id].length) {
        return { loai: XUONG[i][0], so: kho[id].length, ve: XUONG[i][2], ten: XUONG[i][3], icon: XUONG[i][4] };
      }
    }
    return null;
  }
  /* 3 sao = làm đúng hết, 2 sao = từ 2/3, 1 sao = làm đúng ít nhất một bài. */
  function saoThucHanh(id) {
    var x = xuongCuaBai(id);
    if (!x || !window.Gam || !Gam.soBaiTapXong) return { sao: 0, xong: 0, tong: x ? x.so : 0 };
    var xong = Math.min(x.so, Gam.soBaiTapXong(id));
    var ti = x.so ? xong / x.so : 0;
    return { sao: ti >= 1 ? 3 : ti >= 2 / 3 ? 2 : xong > 0 ? 1 : 0, xong: xong, tong: x.so };
  }

  function saoHtml(n) {
    var d = '<svg viewBox="0 0 24 24" class="%c" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/></svg>';
    return '<span class="mr-sao">' + [0, 1, 2].map(function (i) {
      return d.replace("%c", i < n ? "on" : "");
    }).join("") + "</span>";
  }

  /* ------------------------------------------------------------- KHUNG MÀN */
  function khung(l, loai, nhanLop, moTa, than, tienDo) {
    var app = document.getElementById("app");
    var iconLop = loai === "mp" ? "bulb" : "code";
    app.innerHTML =
      '<button class="back-link" id="mrBack">' + ico("aleft", null, 15) + " Bản đồ lộ trình</button>" +
      '<div class="mr-dau"><h2>' + esc(tenGon(l)) + "</h2>" +
      '<span class="mr-lop ' + loai + '">' + ico(iconLop, "currentColor", 14) + " " + esc(nhanLop) + "</span></div>" +
      '<p class="mr-mo">Bài ' + l.order + " · Lớp " + l.grade + " — " + moTa + "</p>" +
      tienDo +
      '<div id="mrThan"></div>' +
      '<div class="mr-cuoi">' +
      '<button class="btn btn-primary" id="mrBai">' + ico("book", "#fff", 16) + " Mở bài học đầy đủ</button>" +
      '<button class="btn btn-ghost" id="mrBack2">' + ico("aleft", null, 15) + " Về bản đồ</button>" +
      "</div>";
    var veBanDo = function () {
      if (typeof go === "function") go("lessons", { stage: l.stage });
    };
    document.getElementById("mrBack").onclick = veBanDo;
    document.getElementById("mrBack2").onclick = veBanDo;
    document.getElementById("mrBai").onclick = function () {
      if (typeof go === "function") go("lesson", { id: l.id });
    };
    return document.getElementById("mrThan");
  }

  /* ============================================================ MÔ PHỎNG */
  function renderMoPhong(d) {
    napCss();
    var l = baiTheoId(d && d.id);
    if (!l) { if (typeof go === "function") go("lessons"); return; }
    var xongTruoc = daXemMoPhong(l.id);

    var tien =
      '<div class="mr-tien' + (xongTruoc ? " xong" : "") + '" id="mrTien">' +
      ico(xongTruoc ? "check" : "play", xongTruoc ? "var(--success)" : "var(--info)", 18) +
      "<b>" + (xongTruoc ? "Đã xem hết các bước" : "Bấm “Bước tiếp” để đi từng bước") + "</b>" +
      '<span class="mr-phu">' +
      (xongTruoc ? "Xem lại bao nhiêu lần cũng được — mô phỏng không có điểm."
                 : "Mô phỏng không chấm điểm: cứ thử, đoán trước rồi bấm xem mình đoán đúng không.") +
      "</span></div>";

    var host = khung(l, "mp", "Mô phỏng",
      "thử từng bước để thấy máy làm gì. Không có đúng/sai, không tính điểm.", "", tien);

    var ok = false;
    try { ok = !!(window.MinhHoa && MinhHoa.veVao(host, l.id)); } catch (e) { ok = false; }
    if (!ok) {
      host.innerHTML = '<p class="mr-trong">' + ico("warn", "var(--warning)", 16) +
        " Bài này chưa có mô phỏng. Mở bài học đầy đủ để đọc lý thuyết nhé.</p>";
      return;
    }

    /* Coi là "đã xem hết" khi người học bấm Bước tiếp tới lúc minh hoạ không đổi
       gì nữa — đúng cách ganTuChay() trong minh-hoa.js nhận biết đã hết bước.
       Không đếm số lần bấm: mỗi minh hoạ có số bước khác nhau, và người học đổi
       dữ liệu đầu vào giữa đường là số bước lại khác. */
    var node = host.querySelector(".mh");
    var tien2 = node && node.querySelector('[data-mh="tien"]');
    if (!tien2 || xongTruoc) return;
    var oKhung = node.querySelector(".mh-khung");
    var oLoi = node.querySelector('[data-mh="loi"]');
    tien2.addEventListener("click", function () {
      var truoc = oKhung.innerHTML + "\u0000" + oLoi.innerHTML;
      /* Đọc lại NGAY SAU vòng lặp sự kiện hiện tại: handler của chính minh hoạ
         cũng nghe cú bấm này, phải để nó chạy xong mới so được. */
      setTimeout(function () {
        if (oKhung.innerHTML + "\u0000" + oLoi.innerHTML !== truoc) return;
        ghiDaXem(l.id);
        var t = document.getElementById("mrTien");
        if (!t) return;
        t.className = "mr-tien xong";
        t.innerHTML = ico("check", "var(--success)", 18) + "<b>Đã xem hết các bước</b>" +
          '<span class="mr-phu">Xem lại bao nhiêu lần cũng được — mô phỏng không có điểm.</span>';
      }, 0);
    });
  }

  /* =========================================================== THỰC HÀNH */
  function renderThucHanh(d) {
    napCss();
    var l = baiTheoId(d && d.id);
    if (!l) { if (typeof go === "function") go("lessons"); return; }
    var x = xuongCuaBai(l.id);

    if (!x) {
      khung(l, "th", "Thực hành", "bài này chưa có bài tập máy chấm.", "",
        '<div class="mr-tien">' + ico("warn", "var(--warning)", 18) +
        "<b>Chưa có bài tập</b></div>");
      return;
    }

    var s = saoThucHanh(l.id);
    var tien =
      '<div class="mr-tien' + (s.sao >= 3 ? " xong" : "") + '" id="mrTien">' + saoHtml(s.sao) +
      "<b>" + s.xong + "/" + s.tong + " bài đã làm đúng</b>" +
      '<span class="mr-phu">' +
      (s.sao >= 3 ? "Làm đúng hết cả " + s.tong + " bài — ba sao."
        : "Máy chấm từng bài. Làm đúng hết " + s.tong + " bài là ba sao.") +
      "</span></div>";

    var host = khung(l, "th", "Thực hành " + x.ten,
      "tự viết rồi bấm chạy, máy chấm ngay. Có Gợi ý và Đáp án mẫu khi bí.", "", tien);

    /* Gói Miễn phí: chặn đúng như trang bài học, để hai nơi không nói khác nhau. */
    if (typeof Plan !== "undefined" && !Plan.xuongMo(x.loai, l)) {
      host.innerHTML = "";
      var ds = (window[XUONG.find(function (y) { return y[0] === x.loai; })[1]] || {})[l.id] || [];
      try { Plan.khoaXuongBox(x.loai, l, ds, host); }
      catch (e) {
        host.innerHTML = '<p class="mr-trong">' + ico("lock", "var(--text-soft)", 16) +
          " Phần thực hành này thuộc gói Premium.</p>";
      }
      return;
    }

    var ve = window[x.ve];
    var xong = false;
    try { xong = typeof ve === "function" && ve(l, host) !== false; } catch (e) { xong = false; }
    if (!xong || !host.children.length) {
      host.innerHTML = '<p class="mr-trong">' + ico("warn", "var(--warning)", 16) +
        " Không dựng được phần thực hành. Thử mở bài học đầy đủ.</p>";
      return;
    }

    /* Cập nhật sao ngay khi làm đúng thêm một bài — không phải chờ vào lại màn.
       Nghe trên chính khối thân: mọi xưởng đều đổi DOM khi chấm xong. */
    var quan = new MutationObserver(function () {
      var m = saoThucHanh(l.id);
      if (m.xong === s.xong) return;
      s = m;
      var t = document.getElementById("mrTien");
      if (!t) return;
      t.className = "mr-tien" + (m.sao >= 3 ? " xong" : "");
      t.innerHTML = saoHtml(m.sao) + "<b>" + m.xong + "/" + m.tong + " bài đã làm đúng</b>" +
        '<span class="mr-phu">' +
        (m.sao >= 3 ? "Làm đúng hết cả " + m.tong + " bài — ba sao."
          : "Còn " + (m.tong - m.xong) + " bài nữa là ba sao.") + "</span>";
    });
    quan.observe(host, { childList: true, subtree: true, characterData: true });
  }

  window.renderMoPhong = renderMoPhong;
  window.renderThucHanh = renderThucHanh;
  window.ManRieng = {
    daXemMoPhong: daXemMoPhong,
    saoThucHanh: saoThucHanh,
    xuongCuaBai: xuongCuaBai,
  };
})();
