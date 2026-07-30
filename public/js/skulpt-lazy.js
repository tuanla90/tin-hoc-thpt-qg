/* ============================================================================
 *  NẠP TRÌNH CHẠY PYTHON (SKULPT) THEO NHU CẦU
 *
 *  Vì sao: skulpt.min.js + skulpt-stdlib.js nặng ~948KB, trước đây nạp ngay ở
 *  index.html nên MỌI học sinh đều phải tải — kể cả người chỉ làm trắc nghiệm
 *  và không bao giờ bấm "Chạy". Ở đây chỉ nạp khi thực sự cần chạy Python.
 *
 *  Cùng khuôn với cách sql-run.js nạp sql.js, để hai trình chạy hành xử giống
 *  nhau: gọi skulptReady() -> Promise, nạp một lần rồi nhớ luôn.
 * ==========================================================================*/
(function () {
  var _promise = null;

  function napTep(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Không nạp được " + src)); };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  /* Nạp xong thì dòng nhắc "lần chạy đầu cần mạng" ở trang Thực hành hết đúng —
     xoá tại đây, một chỗ, thay vì bắt từng chỗ gọi tự nhớ mà xoá. */
  function xoaNhac() {
    var n = document.getElementById("pyTai");
    if (n) n.remove();
  }

  /* Trả Promise: xong nghĩa là biến toàn cục Sk đã dùng được.
     stdlib phải nạp SAU lõi vì nó gắn thêm vào Sk.builtinFiles. */
  window.skulptReady = function () {
    if (_promise) return _promise;
    if (typeof Sk !== "undefined" && Sk.builtinFiles) { xoaNhac(); return (_promise = Promise.resolve()); }
    _promise = napTep("js/vendor/skulpt.min.js")
      .then(function () { return napTep("js/vendor/skulpt-stdlib.js"); })
      .then(xoaNhac)
      .catch(function (e) { _promise = null; throw e; }); // cho phép thử lại lần sau
    return _promise;
  };
})();
