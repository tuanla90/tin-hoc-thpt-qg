/* ============================================================================
 *  MUA PREMIUM — QUÉT MÃ LÀ XONG (window.Pay)
 *  Nạp SAU account.js, TRƯỚC app.js.
 *
 *  Vì sao có: bán bằng mã kích hoạt thì khách phải nhắn Zalo rồi NGỒI CHỜ người
 *  bán gửi mã — trả tiền lúc 11 giờ đêm là chờ tới sáng. Ở đây khách quét QR
 *  (số tài khoản, số tiền, nội dung đã nhúng sẵn — không phải gõ gì), tiền vào
 *  là máy chủ tự mở gói, trang này tự nhận ra và báo trong vài giây.
 *
 *  Máy chủ chưa bật thanh toán (thiếu khoá/số tài khoản) thì `Pay.co()` trả
 *  false và mọi nút mua tự ẩn — quay về đường cũ là nhập mã kích hoạt.
 * ==========================================================================*/
(function () {
  var CHU_KY_DO = 3000;        // dò trạng thái đơn mỗi 3 giây
  var TOI_DA_DO = 20 * 60000;  // thôi dò sau 20 phút, tránh gọi mãi khi khách bỏ đi

  var CAU_HINH = null;         // nhớ trong phiên
  var dangDo = null;

  function api(path, method, body) {
    return fetch("/api" + path, {
      method: method || "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) {
        if (!res.ok) { var e = new Error(d.error || ("Lỗi " + res.status)); e.status = res.status; throw e; }
        return d;
      });
    });
  }

  function napCauHinh() {
    if (CAU_HINH) return Promise.resolve(CAU_HINH);
    return api("/pay/config").then(function (d) { CAU_HINH = d; return d; })
      .catch(function () { CAU_HINH = { on: false }; return CAU_HINH; });
  }
  function co() { return !!(CAU_HINH && CAU_HINH.on); }
  function tien(n) { return Number(n || 0).toLocaleString("vi-VN") + "đ"; }
  function ico(n, c, s) { return (typeof ICON === "function") ? ICON(n, s || 16, c) : ""; }
  function esc2(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function dong() {
    if (dangDo) { clearTimeout(dangDo); dangDo = null; }
    var o = document.getElementById("payNen");
    if (o) o.remove();
  }

  /* Chọn gói -> tạo đơn -> hiện QR. Chưa đăng nhập thì phải đăng nhập trước,
     vì gói được mở cho ĐÚNG tài khoản đã đặt đơn. */
  function batDau(goi) {
    napCauHinh().then(function (cfg) {
      if (!cfg.on) {
        if (typeof toast === "function") toast("Máy chủ chưa bật thanh toán tự động — dùng mã kích hoạt nhé.");
        return;
      }
      if (typeof Account !== "undefined" && Account && !Account.user) {
        if (typeof toast === "function") toast("Đăng nhập trước đã, để gói được mở đúng tài khoản của bạn.");
        if (typeof go === "function") go("account");
        return;
      }
      veHop(null, "Đang tạo đơn…");
      api("/pay/order", "POST", { goi: goi || "nam" }).then(function (d) {
        veHop(d.don);
        doTrangThai(d.don.maDon, Date.now());
      }).catch(function (e) {
        veHop(null, e.message || "Không tạo được đơn, thử lại sau nhé.");
      });
    });
  }

  function doTrangThai(maDon, batDauLuc) {
    if (Date.now() - batDauLuc > TOI_DA_DO) return;
    dangDo = setTimeout(function () {
      api("/pay/order/" + maDon).then(function (d) {
        if (d.trangThai === "da_tra") return xong(d);
        doTrangThai(maDon, batDauLuc);
      }).catch(function () { doTrangThai(maDon, batDauLuc); });
    }, CHU_KY_DO);
  }

  function xong(d) {
    var han = d.plan && d.plan.hetHan ? new Date(d.plan.hetHan).toLocaleDateString("vi-VN") : "";
    var box = document.querySelector("#payNen .pay-box");
    if (box) {
      box.innerHTML =
        '<div class="pay-xong">' + ico("check2", "#16a34a", 44) + "</div>" +
        "<h3>Đã nhận thanh toán</h3>" +
        "<p>Premium của bạn đã mở" + (han ? " tới <b>" + esc2(han) + "</b>" : "") +
        ". Đang tải lại để dùng ngay…</p>";
    }
    setTimeout(function () { location.reload(); }, 1600);
  }

  function veHop(don, thongBao) {
    dong();
    var o = document.createElement("div");
    o.id = "payNen";
    o.className = "pay-nen";

    var than;
    if (!don) {
      than = '<p class="pay-cho">' + esc2(thongBao || "…") + "</p>";
    } else {
      var nh = don.nganHang || {};
      than =
        '<div class="pay-qr"><img src="' + esc2(don.qr) + '" alt="Mã QR chuyển khoản ' + esc2(don.soTien) + ' đồng" ' +
          'onerror="this.parentNode.innerHTML=\'<p class=&quot;pay-loi&quot;>Không tải được ảnh QR — chuyển khoản tay theo thông tin bên dưới nhé.</p>\'"></div>' +
        '<p class="pay-nhac">Mở app ngân hàng, quét mã này là điền sẵn hết — bạn không phải gõ gì.</p>' +
        '<div class="pay-tt">' +
          hang("Ngân hàng", nh.bank || "") +
          hang("Số tài khoản", nh.stk || "", true) +
          hang("Chủ tài khoản", nh.chuTk || "") +
          hang("Số tiền", tien(don.soTien), true, String(don.soTien)) +
          hang("Nội dung", don.noiDung, true) +
        "</div>" +
        '<p class="pay-cho" id="payCho">' + ico("clock", "#b45309", 15) +
          " Đang chờ chuyển khoản… trang này tự nhận ra khi tiền vào, bạn không phải làm gì thêm.</p>" +
        '<p class="pay-note">Chuyển khoản tay thì <b>giữ nguyên nội dung</b> ở trên. ' +
          "Nếu 5 phút chưa thấy, cứ đóng cửa sổ này — gói vẫn được mở khi tiền về, và phần Học vẫn dùng bình thường.</p>";
    }

    o.innerHTML =
      '<div class="pay-box" role="dialog" aria-modal="true">' +
        '<button class="pay-x" id="payX" title="Đóng">&times;</button>' +
        (don ? "<h3>Quét mã để mở Premium</h3><p class=\"pay-goi\">" +
          esc2(don.goi === "nuocrut" ? "Gói nước rút 3 tháng" : "Gói 1 năm học") + " · " + tien(don.soTien) + "</p>" : "<h3>Mua Premium</h3>") +
        than +
      "</div>";
    document.body.appendChild(o);
    o.onclick = function (e) { if (e.target === o) dong(); };
    o.querySelector("#payX").onclick = dong;
    o.querySelectorAll("[data-chep]").forEach(function (b) {
      b.onclick = function () {
        var t = b.dataset.chep;
        if (navigator.clipboard) navigator.clipboard.writeText(t);
        b.textContent = "đã chép";
        setTimeout(function () { b.textContent = "chép"; }, 1500);
      };
    });
  }

  function hang(nhan, giaTri, chep, giaTriChep) {
    return '<div class="pay-hang"><span>' + esc2(nhan) + "</span><b>" + esc2(giaTri) + "</b>" +
      (chep ? '<button class="pay-chep" data-chep="' + esc2(giaTriChep || giaTri) + '">chép</button>' : "") + "</div>";
  }

  /* --------------------------------- CSS --------------------------------- */
  var css =
    ".pay-nen{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:10010;display:flex;align-items:center;justify-content:center;padding:16px}" +
    ".pay-box{position:relative;background:var(--bg-card);border:1px solid var(--border);border-radius:18px;box-shadow:var(--shadow-lg);" +
      "max-width:400px;width:100%;padding:22px;text-align:center;max-height:92vh;overflow-y:auto}" +
    ".pay-box h3{font-family:var(--font-display);font-size:19px;margin:0 0 4px}" +
    ".pay-goi{color:var(--text-soft);font-size:14px;margin:0 0 14px}" +
    ".pay-x{position:absolute;top:10px;right:12px;border:0;background:var(--bg-soft);color:var(--text-soft);" +
      "width:30px;height:30px;border-radius:8px;font-size:20px;line-height:1;cursor:pointer}" +
    ".pay-qr{background:#fff;border:1px solid var(--border);border-radius:14px;padding:8px;display:inline-block;min-height:120px}" +
    ".pay-qr img{display:block;width:100%;max-width:300px;height:auto}" +
    ".pay-nhac{font-size:13px;color:var(--text-soft);margin:9px 0 12px}" +
    ".pay-tt{text-align:left;background:var(--bg-soft);border:1px solid var(--border);border-radius:12px;padding:10px 12px}" +
    ".pay-hang{display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13.5px;border-bottom:1px dashed var(--border)}" +
    ".pay-hang:last-child{border-bottom:0}" +
    ".pay-hang span{color:var(--text-soft);flex:none;min-width:96px}" +
    ".pay-hang b{flex:1;min-width:0;word-break:break-all;font-family:var(--font-mono,monospace)}" +
    ".pay-chep{border:1px solid var(--border-strong);background:var(--bg-card);color:var(--text-soft);border-radius:7px;" +
      "font-size:11.5px;padding:3px 8px;cursor:pointer;font-family:inherit;flex:none}" +
    ".pay-chep:hover{border-color:var(--primary);color:var(--primary)}" +
    ".pay-cho{font-size:13.5px;color:var(--text-soft);margin:13px 0 0;display:flex;align-items:center;justify-content:center;gap:6px}" +
    ".pay-note{font-size:12.5px;color:var(--text-soft);line-height:1.55;margin:10px 0 0}" +
    ".pay-loi{color:var(--danger);font-size:13px;margin:0}" +
    ".pay-xong{margin-bottom:6px}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  napCauHinh();   // hỏi sớm để các nút mua biết có nên hiện hay không

  window.Pay = { co: co, batDau: batDau, dong: dong, napCauHinh: napCauHinh, cauHinh: function () { return CAU_HINH; } };
})();
