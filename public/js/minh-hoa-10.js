/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 10: LẬP TRÌNH PYTHON (CHỦ ĐỀ F)
 *
 *  VÌ SAO ĐỢT NÀY: chủ đề F là lõi của định hướng Khoa học máy tính và là phần
 *  nặng nhất trong đề. Các bài ở đây đều đã có sơ đồ, nhưng sơ đồ chỉ kể được
 *  "có những gì" — mà mọi ngộ nhận lập trình lại nằm ở "chạy ra sao". Không có
 *  cách nào vẽ tĩnh cho học sinh thấy vì sao sửa b thì a cũng đổi.
 *
 *  KHUÔN CHUNG: bên trái code Python, bên phải là thứ HỌC SINH KHÔNG NHÌN THẤY
 *  khi tự gõ code — trạng thái biến, ô nhớ, và màn hình kết quả. Đúng chỗ đó
 *  mới là nơi hiểu nhầm sinh ra.
 *
 *  Mượn CSS: .mh7-* (đợt 7), .mh8-dem/.mh8-canh (đợt 8), .mh9-so/.mh9-tb (đợt
 *  9), .mh4-b (đợt 4). Thêm .mh10-* cho màn hình kết quả, ô biến và sơ đồ bộ nhớ.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

  function napCss10() {
    if (document.getElementById("mhCss10")) return;
    var st = document.createElement("style");
    st.id = "mhCss10";
    st.textContent =
      /* --- màn hình kết quả. Nền tối cố định, không theo chủ đề sáng/tối của
         app: đây là cửa sổ terminal của một chương trình khác đang chạy, không
         phải một mảng giao diện app. --- */
      ".mh10-out{background:#1b1e24;border-radius:10px;padding:9px 12px;min-height:56px;" +
        "font:600 12.5px/1.7 var(--font-mono);color:#d7dae0;overflow-x:auto;white-space:pre}" +
      ".mh10-out .loi{color:#ff8a80}" +
      ".mh10-out .trong{color:#6b7078;font-style:italic}" +

      /* --- ô biến --- */
      ".mh10-bien{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:9px 0 0}" +
      ".mh10-b{border:2px solid var(--border);border-radius:10px;background:var(--bg-card);" +
        "padding:5px 11px;text-align:center;min-width:62px;transition:all .25s}" +
      ".mh10-b b{display:block;font:800 11px var(--font-mono);color:var(--text-soft)}" +
      ".mh10-b i{display:block;font:700 14px var(--font-mono);color:var(--text);font-style:normal}" +
      ".mh10-b.nay{border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh10-b.nay i{color:var(--primary)}" +
      ".mh10-b.none{border-style:dashed;opacity:.6}" +
      ".mh10-kdl{display:inline-block;font:800 10px var(--font-mono);padding:1px 7px;border-radius:999px;" +
        "background:var(--bg-soft);border:1px solid var(--border);margin-left:6px}" +
      ".mh10-kdl.int{color:var(--primary);border-color:var(--primary);background:var(--primary-soft)}" +
      ".mh10-kdl.float{color:#d97706;border-color:#d97706;background:var(--warning-soft)}" +

      /* --- dãy số cho range() --- */
      ".mh10-day{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}" +
      ".mh10-o{min-width:34px;height:38px;border-radius:8px;border:2px solid var(--border);" +
        "background:var(--bg-card);display:flex;align-items:center;justify-content:center;" +
        "font:700 13px var(--font-mono);color:var(--text-soft);transition:all .25s}" +
      ".mh10-o.co{border-color:var(--primary);color:var(--primary);background:var(--primary-soft)}" +
      ".mh10-o.nay{background:var(--primary);color:#fff;transform:translateY(-3px) scale(1.08)}" +
      /* Giá trị dừng vẽ gạch chéo đỏ chứ không ẩn đi: cả bài học nằm ở chỗ nó
         CÓ MẶT trong lệnh mà KHÔNG được lấy — ẩn nó đi là mất luôn ý đó. */
      ".mh10-o.chan{border-color:var(--danger);border-style:dashed;color:var(--danger);" +
        "background:repeating-linear-gradient(45deg,transparent,transparent 4px," +
        "var(--danger-soft) 4px,var(--danger-soft) 8px)}" +
      ".mh10-o.xong{opacity:.4}" +

      /* --- sơ đồ bộ nhớ cho danh sách ---
         CỐ Ý KHÔNG VẼ MŨI TÊN: mũi tên phải tính toạ độ sau khi dựng xong DOM,
         mà chỉ cần một lần đổi cỡ chữ là nó lệch khỏi hộp. Thay vào đó mỗi ô
         nhớ tự khai "những tên nào đang trỏ vào tôi" — nói đúng cái cần nói
         (hai tên, một danh sách) mà không có gì để lệch. */
      ".mh10-vung{border:1.5px dashed var(--border);border-radius:12px;padding:11px;" +
        "background:var(--bg-soft);display:flex;flex-direction:column;gap:9px}" +
      ".mh10-obj{border:2px solid var(--border);border-radius:10px;background:var(--bg-card);" +
        "padding:8px 10px;transition:all .25s}" +
      ".mh10-obj.nay{border-color:var(--primary)}" +
      ".mh10-obj>p{margin:0 0 6px;font:700 10.5px var(--font-sans);color:var(--text-soft);" +
        "display:flex;align-items:center;gap:5px;flex-wrap:wrap}" +
      ".mh10-chip{display:inline-block;font:800 12px var(--font-mono);color:#fff;" +
        "background:var(--primary);border-radius:6px;padding:1px 8px}" +
      ".mh10-chip.b2{background:#d97706}" +
      ".mh10-oto{display:flex;gap:4px;flex-wrap:wrap}" +
      ".mh10-oto i{min-width:32px;height:34px;border-radius:7px;border:2px solid var(--border);" +
        "background:var(--bg-soft);display:flex;align-items:center;justify-content:center;" +
        "font:700 13px var(--font-mono);font-style:normal;color:var(--text);transition:all .25s}" +
      ".mh10-oto i.moi{border-color:var(--success);background:var(--success-soft);color:var(--success)}" +

      "@media (max-width:480px){.mh10-o{min-width:29px;height:33px;font-size:11.5px}}";
    (document.head || document.documentElement).appendChild(st);
  }
  napCss10();

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
  function veCode(oCode, dong, nay) {
    oCode.innerHTML = dong.map(function (d, i) {
      return '<div class="mh7-d' + (i === nay ? " nay" : "") + '">' + esc(d) + "</div>";
    }).join("");
  }

  /* ==================================================================
   *  C10-15 · VÒNG LẶP FOR VÀ HÀM range()
   *
   *  NGỘ NHẬN số một, và là câu sai nhiều nhất trong mọi đề có vòng lặp:
   *  range(1, 5) KHÔNG lấy 5. Học sinh đọc "từ 1 đến 5" rồi đếm ra 5 lần lặp,
   *  trong khi thật ra là 4. Chữ nghĩa không sửa được thói quen đó — phải cho
   *  nhìn thấy ô số 5 nằm ngay đó, gạch chéo đỏ, và bộ đếm dừng ở 4.
   *
   *  Ngộ nhận đi kèm: range(5) bắt đầu từ 0 chứ không phải 1; và biến lặp tự
   *  tăng, không phải viết i = i + 1 như vòng while.
   * ================================================================ */
  MH.dangKy("C10-15", function (host) {
    var TOI = 12;    // vẽ dãy số 0..12, đủ rộng để thấy chỗ range dừng lại
    var i, ds, tong, buoc;

    var node = MH.el(MH.khung("range(1, 5) chạy tới mấy? — chỗ sai nhiều nhất trong mọi đề vòng lặp",
      "Gõ ba số rồi bấm “Bước tiếp” để chạy vòng lặp <b>từng vòng một</b>. Ô <b>gạch chéo đỏ</b> là giá " +
      "trị <b>dừng</b> — nó có mặt trong lệnh nhưng <b>không bao giờ được lấy</b>.",
      '<div class="mh7-code" data-mh="code"></div>' +
      '<div class="mh10-day" data-mh="day" style="margin:12px 0"></div>' +
      '<div class="mh10-bien" data-mh="bien"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<p class="mh7-nhan" style="text-align:center;margin:11px 0 5px">Màn hình kết quả</p>' +
      '<div class="mh10-out" data-mh="out"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhBd">range(</label>' +
      '<input class="mh-o-nhap hep" id="mhBd" data-mh="bd" type="number" value="1" style="width:74px">' +
      '<label>,</label><input class="mh-o-nhap hep" data-mh="kt" type="number" value="5" style="width:74px">' +
      '<label>,</label><input class="mh-o-nhap hep" data-mh="bc" type="number" value="1" style="width:74px">' +
      "<label>)</label>"));

    var loi = loiCua(node);
    function num(t, mac) {
      var v = Math.floor(Number(node.querySelector('[data-mh="' + t + '"]').value));
      return isNaN(v) ? mac : v;
    }
    function bd() { return Math.max(0, Math.min(TOI, num("bd", 1))); }
    function kt() { return Math.max(0, Math.min(TOI, num("kt", 5))); }
    /* Bước 0 làm vòng lặp chạy vô hạn — Python báo ValueError. Ở đây chặn về 1
       cho mô phỏng khỏi treo, và nói rõ trong dòng đếm. */
    function bc() { var v = num("bc", 1); return v === 0 ? 1 : Math.abs(v); }

    /* Danh sách giá trị range thật sự sinh ra. Đây là nguồn duy nhất cho cả ô
       số, bộ đếm lẫn màn hình kết quả — không chỗ nào tự đoán lại. */
    function day() {
      var r = [], x;
      for (x = bd(); x < kt(); x += bc()) r.push(x);
      return r;
    }

    function ve() {
      var d = ds || [];
      veCode(node.querySelector('[data-mh="code"]'), [
        "tong = 0",
        "for i in range(" + bd() + ", " + kt() + ", " + bc() + "):",
        "    tong = tong + i",
        "    print(i, tong)",
      ], buoc < 0 ? 0 : (i >= d.length ? -1 : 2));

      var h = "";
      for (var x = 0; x <= TOI; x++) {
        var c = "mh10-o";
        if (x === kt()) c += " chan";
        else if (d.indexOf(x) >= 0) {
          c += " co";
          if (i >= 0 && i < d.length && d[i] === x) c += " nay";
          else if (i > 0 && d.indexOf(x) < i) c += " xong";
        }
        h += '<div class="' + c + '">' + x + "</div>";
      }
      node.querySelector('[data-mh="day"]').innerHTML = h;

      node.querySelector('[data-mh="bien"]').innerHTML =
        '<div class="mh10-b' + (i >= 0 && i < d.length ? " nay" : " none") + '"><b>i</b><i>' +
        (i >= 0 && i < d.length ? d[i] : "—") + "</i></div>" +
        '<div class="mh10-b"><b>tong</b><i>' + tong + "</i></div>";

      var bcv = num("bc", 1);
      node.querySelector('[data-mh="dem"]').innerHTML =
        "range(" + bd() + ", " + kt() + ", " + bc() + ") sinh ra <b>" + d.length + "</b> giá trị: " +
        (d.length ? d.join(", ") : "(rỗng)") + " · đã chạy <b>" + Math.min(Math.max(i, 0), d.length) +
        "</b> vòng" + (bcv === 0 ? " · <b>bước 0 thì Python báo lỗi ValueError</b>" : "");

      var out = node.querySelector('[data-mh="out"]');
      if (i < 0) { out.innerHTML = '<div class="trong">(chưa chạy vòng nào)</div>'; }
      else {
        var t = 0, s = "";
        for (var k = 0; k < Math.min(i, d.length); k++) { t += d[k]; s += d[k] + " " + t + "\n"; }
        out.innerHTML = s ? esc(s.replace(/\n$/, "")) : '<div class="trong">(chưa in dòng nào)</div>';
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !(i >= d.length && d.length >= 0 && buoc > 0);
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Vòng lặp dừng ở <b>" + (d.length ? d[d.length - 1] : "—") + "</b>, <b>không lấy " +
          kt() + "</b>. Nhớ ba điều: <b>(1)</b> <code>range(a, b)</code> lấy từ a đến <b>b − 1</b>, " +
          "không lấy b — nên số vòng lặp là <b>b − a</b>, không phải b − a + 1. <b>(2)</b> " +
          "<code>range(n)</code> chỉ có một số thì hiểu là <code>range(0, n)</code>, tức là <b>bắt đầu " +
          "từ 0</b>. <b>(3)</b> Biến <code>i</code> <b>tự nhận giá trị tiếp theo</b> ở mỗi vòng — không " +
          "phải viết <code>i = i + 1</code> như vòng <code>while</code>; viết thêm là làm hỏng vòng lặp.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var d = ds || [];
      if (i >= d.length) {
        loi("Đã chạy hết <b>" + d.length + "</b> vòng. Đổi ba số ở trên để thử range khác, " +
          "hoặc bấm “Làm lại”.");
        return;
      }
      buoc++;
      if (i < 0) {
        i = 0; ve();
        loi(d.length
          ? "Vòng <b>1</b>: <code>i</code> nhận giá trị đầu tiên là <b>" + d[0] + "</b>. Chú ý ô " +
            "<b>" + kt() + "</b> đang bị gạch chéo — nó là giá trị <b>dừng</b>, vòng lặp sẽ không bao " +
            "giờ chạy tới nó."
          : "range này <b>rỗng</b> — giá trị bắt đầu đã bằng hoặc vượt giá trị dừng, nên thân vòng lặp " +
            "<b>không chạy lần nào</b>. Đây cũng là một tình huống hay bị bỏ sót khi làm đề.");
        if (!d.length) i = 0;
        return;
      }
      tong += d[i];
      i++;
      ve();
      if (i < d.length) {
        loi("Xong vòng với <code>i = " + d[i - 1] + "</code>, <code>tong</code> giờ là <b>" + tong +
          "</b>. Sang vòng tiếp: <code>i</code> <b>tự nhảy</b> sang <b>" + d[i] + "</b>.");
      } else {
        loi("Sau vòng với <code>i = " + d[i - 1] + "</code>, giá trị tiếp theo sẽ là <b>" +
          (d[i - 1] + bc()) + "</b> — đã <b>bằng hoặc vượt " + kt() + "</b> nên vòng lặp <b>dừng</b>. " +
          "Tổng cộng chạy <b>" + d.length + "</b> vòng, <code>tong = " + tong + "</code>.");
      }
    };

    function lamLai() {
      ds = day(); i = -1; tong = 0; buoc = 0;
      ve();
      loi("Dãy ô trên là các số từ 0 đến " + TOI + ". Ô <b>xanh</b> là những giá trị <code>range</code> " +
        "sinh ra, ô <b>gạch chéo đỏ</b> là giá trị dừng. Bấm “Bước tiếp” để chạy vòng đầu tiên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="bd"]'), node.querySelector('[data-mh="kt"]'),
      node.querySelector('[data-mh="bc"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-17 · DANH SÁCH (LIST) — VÀ CHUYỆN "b = a" KHÔNG PHẢI LÀ CHÉP
   *
   *  NGỘ NHẬN nặng nhất của cả chủ đề lập trình, và gần như không dạy nổi bằng
   *  lời: học sinh tin rằng b = a tạo ra một bản sao. Thật ra nó chỉ dán thêm
   *  một cái tên nữa lên CÙNG một danh sách, nên b.append() làm a đổi theo.
   *
   *  Lí do khó dạy: trên màn hình học sinh chỉ thấy TÊN BIẾN, không thấy ô nhớ.
   *  Mà chỗ hiểu nhầm lại nằm đúng ở ô nhớ. Nên minh hoạ này vẽ hẳn vùng nhớ
   *  ra, và mỗi ô nhớ tự khai những tên nào đang trỏ vào nó — lúc b = a thì
   *  hai cái tên nằm chung MỘT ô, nhìn phát hiểu ngay.
   *
   *  Ô tích đổi sang b = a[:] để so: lúc đó vùng nhớ có HAI ô riêng biệt.
   * ================================================================ */
  MH.dangKy("C10-17", function (host) {
    var GOC = [3, 1, 4];
    var buoc;

    var node = MH.el(MH.khung("Vì sao sửa b mà a cũng đổi? — danh sách và chuyện hai tên một ô nhớ",
      "Bên phải là <b>vùng nhớ</b> — thứ em không nhìn thấy khi tự gõ code, mà mọi hiểu nhầm lại nằm " +
      "đúng ở đó. Chạy hết rồi hãy tích ô <b>“dùng b = a[:]”</b> và chạy lại để so.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Code Python</p>' +
      '<div class="mh7-code" data-mh="code"></div>' +
      '<p class="mh7-nhan" style="margin-top:9px">Màn hình kết quả</p>' +
      '<div class="mh10-out" data-mh="out"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Vùng nhớ</p>' +
      '<div class="mh10-vung" data-mh="vung"></div></div>' +
      "</div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="chep"> dùng <b>b = a[:]</b> ' +
      "(chép thật) thay cho <b>b = a</b></label>"));

    var loi = loiCua(node);
    function chep() { return node.querySelector('[data-mh="chep"]').checked; }

    function dongCode() {
      return [
        "a = [3, 1, 4]",
        chep() ? "b = a[:]" : "b = a",
        "b.append(9)",
        "print(a)",
        "print(b)",
      ];
    }

    /* Trạng thái vùng nhớ tại bước hiện tại. Trả về danh sách các Ô NHỚ, mỗi ô
       ghi rõ những tên nào đang trỏ vào nó — đó là toàn bộ ý đồ của minh hoạ. */
    function vungNho() {
      if (buoc < 1) return [];
      var them = buoc >= 3 ? [9] : [];
      if (buoc < 2) return [{ ten: ["a"], gt: GOC.slice(), moi: 0 }];
      if (!chep()) {
        /* Một ô duy nhất, hai cái tên cùng trỏ vào. */
        return [{ ten: ["a", "b"], gt: GOC.concat(them), moi: them.length }];
      }
      return [
        { ten: ["a"], gt: GOC.slice(), moi: 0 },
        { ten: ["b"], gt: GOC.concat(them), moi: them.length },
      ];
    }

    function ve() {
      veCode(node.querySelector('[data-mh="code"]'), dongCode(), buoc - 1);

      var v = vungNho();
      node.querySelector('[data-mh="vung"]').innerHTML = v.length
        ? v.map(function (o, k) {
          var chip = o.ten.map(function (t) {
            return '<span class="mh10-chip' + (t === "b" ? " b2" : "") + '">' + t + "</span>";
          }).join("");
          var oto = o.gt.map(function (x, j) {
            return "<i" + (o.moi && j >= o.gt.length - o.moi ? ' class="moi"' : "") + ">" + x + "</i>";
          }).join("");
          return '<div class="mh10-obj' + (buoc >= 3 && o.moi ? " nay" : "") + '">' +
            "<p>Danh sách #" + (k + 1) + " &nbsp;·&nbsp; đang được trỏ tới bởi: " + chip + "</p>" +
            '<div class="mh10-oto">' + oto + "</div></div>";
        }).join("")
        : '<p class="mh7-trong" style="margin:0">Vùng nhớ còn trống — chưa tạo danh sách nào.</p>';

      var out = node.querySelector('[data-mh="out"]');
      var s = "";
      if (buoc >= 4) s += "[" + (v[0] ? v[0].gt.join(", ") : "") + "]\n";
      if (buoc >= 5) s += "[" + (v[v.length - 1] ? v[v.length - 1].gt.join(", ") : "") + "]\n";
      out.innerHTML = s ? esc(s.replace(/\n$/, "")) : '<div class="trong">(chưa in gì)</div>';

      node.querySelector('[data-mh="dem"]').innerHTML = buoc < 2
        ? "Số danh sách thật trong bộ nhớ: <b>" + v.length + "</b>"
        : "Số danh sách thật trong bộ nhớ: <b>" + v.length + "</b> &nbsp;·&nbsp; <code>a is b</code> → <b>" +
          (chep() ? "False" : "True") + "</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(buoc >= 3 && !chep());
      if (!canh.hidden) {
        canh.innerHTML = "Em chỉ gọi <code>b.append(9)</code>, <b>không hề đụng vào a</b> — vậy mà " +
          "<code>a</code> cũng có thêm số 9. Vì <code>a</code> và <code>b</code> là <b>hai cái tên của " +
          "cùng một danh sách</b>, sửa qua tên nào cũng là sửa đúng danh sách đó.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < 5;
      if (buoc >= 5) {
        ghi.className = "mh7-ghi" + (chep() ? " xong" : "");
        ghi.innerHTML = chep()
          ? "<code>b = a[:]</code> <b>tạo một danh sách mới</b> rồi chép từng phần tử sang, nên vùng nhớ " +
            "có <b>hai</b> ô riêng biệt và <code>b.append(9)</code> chỉ đụng tới b. Ba cách chép tương " +
            "đương nhau: <code>a[:]</code>, <code>a.copy()</code>, <code>list(a)</code>. Kiểm nhanh bằng " +
            "<code>a is b</code>: ra <b>False</b> nghĩa là hai danh sách khác nhau thật."
          : "Nhớ cho kĩ: <b>dấu = với danh sách KHÔNG phải là chép</b>, nó chỉ dán thêm một cái tên nữa " +
            "lên đúng danh sách cũ. Với số hay xâu thì không gặp chuyện này vì chúng <b>không sửa tại " +
            "chỗ</b> được. Còn danh sách thì <b>sửa tại chỗ</b>, nên mọi tên đang trỏ vào nó đều thấy " +
            "thay đổi. Muốn có bản sao thật thì viết <code>b = a[:]</code> — tích ô ở trên rồi chạy lại " +
            "để thấy vùng nhớ tách làm hai.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= 5) {
        loi(chep()
          ? "Bỏ tích ô đó rồi chạy lại để thấy trường hợp <code>b = a</code>."
          : "Xong. Giờ tích ô <b>“dùng b = a[:]”</b> và chạy lại — chú ý <b>số ô nhớ</b>.");
        return;
      }
      buoc++;
      ve();
      if (buoc === 1) {
        loi("<code>a = [3, 1, 4]</code> làm <b>hai việc</b>: tạo một danh sách trong bộ nhớ, rồi cho cái " +
          "tên <code>a</code> <b>trỏ tới</b> nó. Tên và danh sách là hai thứ khác nhau.");
      } else if (buoc === 2) {
        loi(chep()
          ? "<code>b = a[:]</code> — dấu <code>[:]</code> là <b>cắt lát toàn bộ</b>, và cắt lát luôn " +
            "<b>tạo ra danh sách MỚI</b>. Nhìn vùng nhớ: giờ có <b>hai</b> ô riêng."
          : "<code>b = a</code> <b>không tạo danh sách mới</b>. Nó chỉ dán thêm cái tên <code>b</code> " +
            "lên <b>đúng danh sách đang có</b>. Nhìn vùng nhớ: vẫn chỉ <b>một</b> ô, nhưng giờ có " +
            "<b>hai</b> tên trỏ vào.");
      } else if (buoc === 3) {
        loi(chep()
          ? "<code>b.append(9)</code> thêm 9 vào <b>danh sách của b</b>. Danh sách của a nằm ở ô khác " +
            "nên <b>không hề gì</b>."
          : "<code>b.append(9)</code> thêm 9 vào danh sách mà <code>b</code> trỏ tới — <b>cũng chính là</b> " +
            "danh sách mà <code>a</code> trỏ tới. Đọc kĩ khối đỏ bên dưới.");
      } else if (buoc === 4) {
        loi("<code>print(a)</code> in ra " + (chep() ? "<b>[3, 1, 4]</b> — a không đổi." :
          "<b>[3, 1, 4, 9]</b> — a đổi theo, dù em chưa từng viết lệnh nào tác động lên a."));
      } else {
        loi("<code>print(b)</code> in ra <b>[3, 1, 4, 9]</b>. " + (chep()
          ? "Hai dòng in ra <b>khác nhau</b> — đúng như mong đợi."
          : "Hai dòng in ra <b>giống hệt nhau</b>, vì chúng là cùng một danh sách."));
      }
    };

    function lamLai() {
      buoc = 0; ve();
      loi("Chưa chạy dòng nào. Bấm “Bước tiếp” để tạo danh sách đầu tiên.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="chep"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-19 · HÀM (FUNCTION) — return KHÁC print Ở CHỖ NÀO
   *
   *  Ngộ nhận nặng nhất của cả bài: học sinh nghĩ "in ra" với "trả về" là một.
   *  Cách chữa nhanh nhất không phải giảng, mà là cho các em thấy CÙNG MỘT hàm
   *  viết hai kiểu: kiểu return thì kết quả dùng tiếp được, kiểu print thì màn
   *  hình có số nhưng chương trình NỔ ngay dòng sau vì hàm trả về None.
   *
   *  Vì thế bên phải có hai ô thông tin tách bạch: những gì print in ra, và
   *  giá trị hàm trả về. Hai thứ này trong đầu học sinh đang dính làm một;
   *  tách được ra là hiểu bài.
   * ================================================================ */
  MH.dangKy("C10-19", function (host) {
    var MA_A = [
      "def dien_tich(a, b):",
      "    return a * b",
      "",
      "s = dien_tich(3, 4)",
      "print(s + 10)",
    ];
    var MA_B = [
      "def dien_tich(a, b):",
      "    print(a * b)",
      "",
      "s = dien_tich(3, 4)",
      "print(s + 10)",
    ];
    /* Dòng đang chạy ứng với từng bước. -1 = chưa chạy dòng nào. Bước 4 (hàm
       kết thúc) vẫn đứng ở thân hàm, bước 5 mới quay lại dòng gọi. */
    var DONG = [-1, 0, 3, 1, 1, 3, 4];
    var HET = 6;
    var buoc;

    var node = MH.el(MH.khung("Hàm: <b>return</b> trả giá trị về, <b>print</b> chỉ hiện chữ ra màn hình",
      "Cùng một hàm tính diện tích, viết hai kiểu. Em chạy từng dòng và nhìn <b>hai ô bên phải</b>: " +
      "ô trên là thứ <b>print in ra</b>, ô dưới là <b>giá trị hàm trả về</b> cho nơi gọi. Hai thứ đó " +
      "khác nhau hoàn toàn.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Chương trình Python</p>' +
      '<div class="mh7-code" data-mh="ma"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Màn hình kết quả</p>' +
      '<div class="mh10-out" data-mh="out"></div>' +
      '<div data-mh="oTra" hidden><p class="mh7-nhan" style="margin-top:9px">Giá trị hàm trả về</p>' +
      '<div class="mh10-bien" data-mh="tra"></div></div></div>' +
      "</div>" +
      '<div data-mh="oBien" hidden><p class="mh7-nhan" style="text-align:center;margin:11px 0 0">' +
      'Biến đang có</p><div class="mh10-bien" data-mh="bien"></div></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="cachB"> cách B: dùng <b>print</b> trong ' +
      "hàm thay cho <b>return</b></label>"));

    var loi = loiCua(node);
    var oB = node.querySelector('[data-mh="cachB"]');
    function cachB() { return oB.checked; }

    function oBien(ten, gt, nay, none) {
      return '<div class="mh10-b' + (nay ? " nay" : "") + (none ? " none" : "") + '"><b>' +
        esc(ten) + "</b><i>" + esc(gt) + "</i></div>";
    }

    function ve() {
      var b = cachB();
      var ma = b ? MA_B : MA_A;
      var d = DONG[buoc];
      var maxD = -1, i;
      for (i = 0; i <= buoc; i++) if (DONG[i] > maxD) maxD = DONG[i];

      var h = "";
      for (i = 0; i < ma.length; i++) {
        var lop = i === d ? " nay" : (i > maxD ? " mo" : "");
        h += '<div class="mh7-d' + lop + '">' + (ma[i] === "" ? " " : esc(ma[i])) + "</div>";
      }
      node.querySelector('[data-mh="ma"]').innerHTML = h;

      /* Màn hình kết quả: CHỈ những gì print in ra, không có gì khác. Đây là
         nửa còn lại của phép so sánh, trộn thêm thứ gì vào là hỏng. */
      var out = "";
      if (b) {
        if (buoc >= 3) out += "<div>12</div>";
        if (buoc >= HET) out += '<div class="loi">' +
          esc("TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'") + "</div>";
      } else if (buoc >= HET) {
        out += "<div>22</div>";
      }
      node.querySelector('[data-mh="out"]').innerHTML = out ||
        '<div class="trong">(chưa in gì)</div>';

      node.querySelector('[data-mh="oTra"]').hidden = buoc < 4;
      if (buoc >= 4) {
        node.querySelector('[data-mh="tra"]').innerHTML =
          oBien("dien_tich(3, 4)", b ? "None" : "12", buoc === 4, b);
      }

      /* a, b là biến CỤC BỘ: hàm kết thúc là chúng biến mất, nên từ bước 5 chỉ còn s. */
      var bi = "";
      if (buoc >= 2 && buoc <= 4) bi += oBien("a", "3", buoc === 2) + oBien("b", "4", buoc === 2);
      if (buoc >= 5) bi += oBien("s", b ? "None" : "12", buoc === 5, b);
      node.querySelector('[data-mh="oBien"]').hidden = bi === "";
      node.querySelector('[data-mh="bien"]').innerHTML = bi;

      var dem = node.querySelector('[data-mh="dem"]');
      if (buoc === 0) dem.innerHTML = "Chương trình <b>chưa chạy</b> dòng nào";
      else if (buoc === 1) dem.innerHTML = "Đã <b>ghi nhớ</b> hàm dien_tich · thân hàm <b>chưa chạy</b>";
      else if (buoc === 2) dem.innerHTML = "Đang ở <b>trong thân hàm</b> · a = <b>3</b>, b = <b>4</b>";
      else if (buoc === 3) dem.innerHTML = b
        ? "Thân hàm: print vừa <b>in 12 ra màn hình</b>"
        : "Thân hàm: tính a * b = <b>12</b> rồi trả về";
      else if (buoc === 4) dem.innerHTML = b
        ? "Hàm kết thúc · không có return nên trả về <b>None</b>"
        : "Hàm kết thúc · trả về <b>12</b>";
      else if (buoc === 5) dem.innerHTML = "Gán vào s · s = <b>" + (b ? "None" : "12") + "</b>";
      else dem.innerHTML = b
        ? "None + 10 · <b>LỖI</b>, chương trình dừng"
        : "print(s + 10) · in ra <b>22</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(b && buoc >= HET);
      if (!canh.hidden) {
        canh.innerHTML = "Chương trình <b>dừng hẳn</b> ở đây. Hàm chỉ <b>in</b> chứ không <b>trả về</b>, " +
          "nên s nhận giá trị <b>None</b> — mà None thì <b>không cộng được</b> với số 10.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < HET;
      if (buoc >= HET) {
        ghi.className = b ? "mh7-ghi" : "mh7-ghi xong";
        ghi.innerHTML = b
          ? "Nhớ kĩ: <b>print chỉ hiện chữ ra màn hình rồi thôi</b>, nó <b>không</b> đưa kết quả về cho " +
            "nơi gọi. Hàm <b>không có return thì trả về None</b>. Màn hình có số 12 nên nhiều em tưởng " +
            "hàm chạy đúng — nhưng số 12 đó <b>không dùng lại được</b>. Bỏ tích ô trên để xem cách đúng."
          : "Chốt lại: <b>return</b> đưa giá trị <b>về cho nơi gọi</b> để dùng tiếp (gán vào s, cộng, so " +
            "sánh...), còn <b>print</b> chỉ hiện chữ ra màn hình. Thêm hai điều hay bị hỏi: viết <b>def " +
            "không làm hàm chạy</b>, hàm chỉ chạy khi được <b>gọi</b>; và mọi lệnh viết <b>sau return</b> " +
            "trong thân hàm <b>không bao giờ chạy</b>, vì gặp return là hàm kết thúc ngay.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= HET) {
        loi("Hết bước rồi. Em tích/bỏ tích ô <b>cách B</b> ở trên để chạy lại kiểu kia, hoặc bấm “Làm lại”.");
        return;
      }
      buoc++;
      ve();
      var b = cachB();
      if (buoc === 1) {
        loi("Gặp <b>def</b>, Python <b>chỉ ghi nhớ</b> rằng có hàm tên dien_tich — <b>chưa chạy</b> dòng " +
          "nào trong thân hàm. Màn hình vẫn trống. Viết def <b>không</b> làm hàm chạy.");
      } else if (buoc === 2) {
        loi("Gặp lời <b>gọi hàm</b> dien_tich(3, 4): chương trình <b>nhảy vào</b> thân hàm và gán " +
          "<b>a = 3</b>, <b>b = 4</b>. a, b là <b>tham số</b> (tên đặt lúc định nghĩa); 3 và 4 là " +
          "<b>đối số</b> (giá trị thật truyền vào lúc gọi).");
      } else if (buoc === 3) {
        loi(b
          ? "Chạy <b>print(a * b)</b>: máy tính 3 * 4 = 12 rồi <b>in 12 ra màn hình</b>. Chỉ hiện chữ " +
            "thôi — số 12 này <b>không</b> được giao lại cho nơi gọi."
          : "Chạy <b>return a * b</b>: máy tính 3 * 4 = 12 rồi <b>trả 12 về cho nơi gọi</b>. Chú ý màn " +
            "hình <b>vẫn trống</b> — return <b>không in gì cả</b>.");
      } else if (buoc === 4) {
        loi(b
          ? "Hàm kết thúc. Trong thân hàm <b>không có return</b>, nên Python tự trả về <b>None</b> — " +
            "nghĩa là “không có giá trị nào”. Nhìn ô “Giá trị hàm trả về”: nó là None, không phải 12."
          : "Hàm kết thúc, giá trị trả về là <b>12</b>. Từ giờ chỗ gọi dien_tich(3, 4) coi như <b>chính " +
            "là số 12</b>.");
      } else if (buoc === 5) {
        loi("Giá trị trả về được <b>gán vào s</b>: s = <b>" + (b ? "None" : "12") + "</b>. Còn a, b đã " +
          "<b>biến mất</b> vì chúng chỉ sống bên trong hàm.");
      } else {
        loi(b
          ? "<b>print(s + 10)</b> phải tính s + 10 trước, tức <b>None + 10</b> — cộng không được nên " +
            "<b>lỗi TypeError</b> và chương trình dừng. Đây đúng là bẫy đề hay gặp."
          : "<b>print(s + 10)</b> tính 12 + 10 = <b>22</b> rồi in ra. Nhờ có return, kết quả của hàm " +
            "<b>dùng lại được</b>.");
      }
    };

    function lamLai() {
      buoc = 0; ve();
      loi("Bấm “Bước tiếp” để chạy từng dòng. Vừa chạy vừa so <b>màn hình kết quả</b> với <b>giá trị " +
        "hàm trả về</b> — hai ô này không bao giờ là một.");
    }
    ganDatLai(node, [oB], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-20 · TÌM LỖI, SỬA LỖI VÀ KIỂM THỬ CHƯƠNG TRÌNH
   *
   *  NGỘ NHẬN cần đánh trúng: "chạy không báo lỗi tức là đúng". Cách trị duy
   *  nhất là cho các em thấy MÀN HÌNH KẾT QUẢ của cả ba loại lỗi cạnh nhau —
   *  cùng một chương trình, mỗi bản chỉ đổi một dòng. Điểm phân biệt không nằm
   *  ở chữ trong sách mà ở THỜI ĐIỂM lỗi lộ ra: trước khi chạy / giữa chừng /
   *  không bao giờ. Bản lỗi logic cố ý in ra 10.0 rất "hợp lí" và không một
   *  chữ đỏ nào.
   * ================================================================ */
  MH.dangKy("C10-20", function (host) {
    /* Bốn phiên bản chỉ khác nhau ĐÚNG MỘT DÒNG so với bản gốc — có thế thì
       "lỗi thuộc loại nào" mới là biến duy nhất đang thay đổi. */
    var GOC = [
      "diem = [8, 6, 9, 7]",
      'print("So bai kiem tra:", len(diem))',
      "tong = 0",
      "for d in diem:",
      "    tong = tong + d",
      "tb = tong / len(diem)",
      'print("Diem trung binh:", tb)',
    ];
    function doiDong(i, s) { var a = GOC.slice(); a[i] = s; return a; }

    var VER = [
      {
        ten: "Bản 1 — lỗi cú pháp",
        mo: "dòng 4 viết thiếu dấu <b>:</b> sau <code>for d in diem</code>",
        ma: doiDong(3, "for d in diem"),
        oLoi: 3,
        toi: [0, 1, 2, 4, 5, 6],          // không dòng nào chạy cả
        ra: [
          { t: '  File "bai.py", line 4' },
          { t: "    for d in diem" },
          { t: "                 ^" },
          { t: "SyntaxError: expected ':'", d: 1 },
        ],
        khi: "TRƯỚC KHI CHẠY",
        canh: "",
        ghi: "Màn hình kết quả <b>trống trơn</b> — dòng <code>print</code> ở dòng 2 nằm TRƯỚC chỗ hỏng " +
          "mà vẫn không in ra chữ nào. Vì Python <b>đọc hết cả tệp để dịch trước</b>, gặp câu sai ngữ " +
          "pháp là dừng ngay, chưa chạy dòng nào. Đây là loại <b>dễ sửa nhất</b>: máy chỉ thẳng số " +
          "dòng. Nhưng nhớ — máy chỉ dòng 4 không có nghĩa lỗi chắc chắn ở dòng 4; kiểu thiếu ngoặc " +
          "đóng ở <code>print</code> thì máy hay chỉ vào <b>dòng SAU đó</b>, phải ngó lên dòng trên.",
      },
      {
        ten: "Bản 2 — lỗi thời gian chạy",
        mo: "dòng 1 là danh sách <b>rỗng</b> <code>[]</code>",
        ma: doiDong(0, "diem = []"),
        oLoi: 5,
        toi: [4, 6],                       // thân vòng lặp và dòng cuối không tới lượt
        ra: [
          { t: "So bai kiem tra: 0" },
          { t: "Traceback (most recent call last):", d: 1 },
          { t: '  File "bai.py", line 6, in <module>', d: 1 },
          { t: "    tb = tong / len(diem)", d: 1 },
          { t: "ZeroDivisionError: division by zero", d: 1 },
        ],
        khi: "GIỮA CHỪNG",
        canh: "",
        ghi: "Cú pháp <b>không sai một chữ nào</b>, nên chương trình chạy thật: dòng 2 đã kịp in " +
          "<code>So bai kiem tra: 0</code>. Tới dòng 6, <code>len(diem)</code> bằng 0 và phép <b>chia " +
          "cho 0</b> là việc máy không làm được, chương trình <b>chết giữa chừng</b>. Dấu hiệu nhận ra: " +
          "có kết quả in dở rồi mới tới khối <code>Traceback</code>. Loại này chỉ lộ ra <b>khi gặp đúng " +
          "bộ dữ liệu xấu</b> — chạy với danh sách bình thường thì không bao giờ thấy.",
      },
      {
        ten: "Bản 3 — lỗi logic",
        mo: "dòng 6 viết <code>/ 3</code> thay vì <code>/ len(diem)</code>",
        ma: doiDong(5, "tb = tong / 3"),
        oLoi: 5,
        toi: [],
        ra: [
          { t: "So bai kiem tra: 4" },
          { t: "Diem trung binh: 10.0" },
        ],
        khi: "KHÔNG BAO GIỜ TỰ LỘ RA",
        canh: "Không một chữ đỏ nào. Máy <b>không hề báo gì</b> vì với nó, chia cho 3 là một phép chia " +
          "hợp lệ — nó không biết em ĐỊNH tính trung bình của 4 điểm. Chỉ có con người mới biết 10.0 là " +
          "sai. <b>Chạy trót lọt không có nghĩa là đúng.</b>",
        ghi: "Tổng 4 điểm là 30, chia cho 3 ra <b>10.0</b> trong khi đáp án đúng là <b>7.5</b>. Đây là " +
          "loại <b>nguy hiểm nhất</b>: máy không giúp được gì, chương trình vẫn nộp được, vẫn chạy " +
          "được, chỉ có số liệu sai âm thầm. Muốn bắt được nó em phải <b>tự kiểm thử</b>.",
      },
      {
        ten: "Bản đúng + kiểm thử",
        mo: "chạy đúng, và cách phát hiện lỗi logic",
        ma: GOC,
        oLoi: -1,
        toi: [],
        ra: [
          { t: "So bai kiem tra: 4" },
          { t: "Diem trung binh: 7.5" },
        ],
        khi: "KIỂM THỬ MỚI BIẾT ĐÚNG",
        canh: "",
        ghi: "Cách duy nhất bắt được lỗi logic: <b>kiểm thử bằng bộ dữ liệu đã biết trước đáp án</b>. " +
          "Tự nhẩm ra 7.5 rồi mới cho máy chạy — khớp thì mới yên tâm. Chạy thử rồi nhìn số gật gù " +
          "<b>chưa phải là kiểm thử</b>, vì không có gì để so. Thử thêm các <b>trường hợp biên</b> (một " +
          "phần tử, số âm, danh sách rỗng) mới thấy bản đúng này <b>vẫn chết</b> với danh sách rỗng — " +
          "chỗ còn phải sửa tiếp.",
      },
    ];

    /* Bảng kiểm thử: cột "đáp án biết trước" phải điền TRƯỚC khi chạy — đó mới
       là chỗ khác nhau giữa kiểm thử và chạy thử cho vui. */
    var KT = [
      { bo: "[8, 6, 9, 7]", cho: "7.5", ra: "7.5", ok: 1 },
      { bo: "[10]", cho: "10.0", ra: "10.0", ok: 1 },
      { bo: "[-2, 2]", cho: "0.0", ra: "0.0", ok: 1 },
      { bo: "[]  (biên)", cho: "báo “chưa có điểm”", ra: "ZeroDivisionError", ok: 0 },
    ];

    var b;   // phiên bản đang xem

    var node = MH.el(MH.khung("Ba loại lỗi — phân biệt bằng THỜI ĐIỂM chúng lộ ra",
      "Cùng một chương trình tính điểm trung bình, mỗi bản chỉ sai <b>một dòng</b>. Bấm “Bước tiếp” " +
      "hoặc chọn thẳng một bản để xem <b>màn hình kết quả</b> của nó.",
      '<div class="mh7-ds" data-mh="ds"></div>' +
      '<div class="mh7-doi" style="margin-top:11px">' +
      '<div class="mh7-panel"><p class="mh7-nhan">bai.py</p>' +
      '<div class="mh7-code" data-mh="code"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Màn hình kết quả</p>' +
      '<div class="mh10-out" data-mh="out"></div></div></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div data-mh="kt" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    function veDs() {
      var o = node.querySelector('[data-mh="ds"]');
      o.innerHTML = VER.map(function (v, i) {
        return '<div class="mh7-m' + (i === b ? " nay" : "") + '" data-i="' + i + '">' +
          '<b class="van">' + esc(v.ten) + "</b><small>" + v.mo + "</small></div>";
      }).join("");
      /* innerHTML vừa ghi đè nên phải gắn lại onclick sau MỖI lần vẽ. */
      o.querySelectorAll(".mh7-m").forEach(function (m) {
        m.onclick = function () { b = +m.getAttribute("data-i"); ve(); noi(); };
      });
    }

    function ve() {
      var v = VER[b];
      veDs();
      node.querySelector('[data-mh="code"]').innerHTML = v.ma.map(function (t, i) {
        var c = i === v.oLoi ? " nay" : (v.toi.indexOf(i) >= 0 ? " mo" : "");
        return '<div class="mh7-d' + c + '">' + esc(t) + "</div>";
      }).join("");
      node.querySelector('[data-mh="out"]').innerHTML = v.ra.map(function (r) {
        return "<div" + (r.d ? ' class="loi"' : "") + ">" + esc(r.t) + "</div>";
      }).join("");
      node.querySelector('[data-mh="dem"]').innerHTML = "Lỗi lộ ra lúc nào: <b>" + esc(v.khi) + "</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !v.canh;
      canh.innerHTML = v.canh;

      var kt = node.querySelector('[data-mh="kt"]');
      kt.hidden = b !== VER.length - 1;
      kt.innerHTML = kt.hidden ? ""
        : '<table class="mh4-b" style="margin:11px auto 0"><tr><th>Bộ dữ liệu thử</th>' +
          "<th>Đáp án biết trước</th><th>Máy in ra</th></tr>" +
          KT.map(function (r) {
            return '<tr class="' + (r.ok ? "khop" : "rac") + '"><td>' + esc(r.bo) + "</td><td>" +
              esc(r.cho) + "</td><td>" + esc(r.ra) + "</td></tr>";
          }).join("") + "</table>";

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = false;
      ghi.className = "mh7-ghi" + (b === VER.length - 1 ? " xong" : "");
      ghi.innerHTML = v.ghi;
    }

    function noi() {
      if (b === 0) {
        loi("Bản này <b>chưa chạy được một dòng nào</b> — cả khối code đang mờ. Sai ngữ pháp thì máy " +
          "dịch không nổi.");
      } else if (b === 1) {
        loi("Bản này <b>chạy được một đoạn rồi mới chết</b> — dòng 2 đã in ra, dòng 5 và 7 chưa tới lượt.");
      } else if (b === 2) {
        loi("Bản này chạy <b>hết sạch, êm ru, không báo gì</b> — chỉ có con số là sai. Nhìn kĩ dòng 6.");
      } else {
        loi("Bản đúng: ra <b>7.5</b>. Xem bảng kiểm thử bên dưới — mỗi bộ dữ liệu đều phải có <b>đáp án " +
          "tự biết trước</b>.");
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (b >= VER.length - 1) {
        loi("Hết bốn bản rồi. Bấm thẳng vào tên một bản ở trên để xem lại, hoặc “Làm lại”.");
        return;
      }
      b++; ve(); noi();
    };

    function lamLai() { b = 0; ve(); noi(); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-13 · NHẬP DỮ LIỆU VÀ CÁC PHÉP TOÁN
   *
   *  SGK chỉ liệt kê bảng phép toán, nên học sinh thuộc kí hiệu mà không thấy
   *  ba chỗ mất điểm thật sự:
   *    1. Phép "/" trong Python 3 LUÔN ra số thực — 6 / 3 là 2.0 chứ không phải
   *       2. Đọc bảng trong sách không bao giờ lộ ra điều này.
   *    2. Lẫn "//" (phần nguyên) với "%" (phần dư).
   *    3. Thứ tự ưu tiên: 2 + 3 * 4 ra 14 chứ không phải 20; và riêng "**" tính
   *       từ PHẢI sang nên 2 ** 3 ** 2 là 512 chứ không phải 64.
   *  Cách trị: cho cả bảy phép chạy trên CÙNG hai số học sinh tự gõ, đặt cạnh
   *  nhau, kèm cột kiểu dữ liệu — cột đó mới là nhân vật chính của minh hoạ.
   * ================================================================ */
  MH.dangKy("C10-13", function (host) {
    var node = MH.el(MH.khung("Bảng phép toán: cùng hai số, bảy phép, bảy kết quả",
      "Em gõ hai số <b>a</b> và <b>b</b>, tất cả phép toán chạy ngay trên đúng hai số đó. Nhìn kĩ huy " +
      "hiệu <b>int / float</b> sau mỗi kết quả. Bấm vào một dòng để xem giải thích riêng, hoặc bấm " +
      "“Bước tiếp” để đi lần lượt.",
      '<div class="mh7-code" data-mh="gan"></div>' +
      '<div class="mh4-cuon" style="margin-top:11px"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<div class="mh10-out" data-mh="out" style="margin-top:11px"></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi"></div>',
      'a = <input class="mh-o-nhap hep" data-mh="a" type="number" value="7"> &nbsp; ' +
      'b = <input class="mh-o-nhap hep" data-mh="b" type="number" value="2">'));

    var loi = loiCua(node);
    var k = 0;

    function laySo(t) {
      var v = parseInt(node.querySelector('[data-mh="' + t + '"]').value, 10);
      return isNaN(v) ? 0 : v;
    }

    /* In số thực đúng kiểu Python: chia hết vẫn phải có ".0" (2.0, không phải
       2). Đây chính là thứ minh hoạ muốn học sinh nhìn thấy. */
    function inThuc(v) {
      if (!isFinite(v)) return "inf";
      return (v === Math.floor(v) && Math.abs(v) < 1e16) ? v.toFixed(1) : String(v);
    }

    function dsBuoc() {
      var a = laySo("a"), b = laySo("b"), d = [];
      var Z0 = "ZeroDivisionError: division by zero";
      var Z1 = "ZeroDivisionError: integer division or modulo by zero";

      d.push({ bt: "a + b", ten: "cộng", kq: String(a + b), kdl: "int",
        giai: "Cộng hai số nguyên thì kết quả vẫn là số nguyên: <b>" + a + " + " + b + " = " + (a + b) +
          "</b>. Các phép <b>+ &nbsp;- &nbsp;*</b> giữ nguyên kiểu <b>int</b> khi cả hai vế là int." });
      d.push({ bt: "a - b", ten: "trừ", kq: String(a - b), kdl: "int",
        giai: "<b>" + a + " - " + b + " = " + (a - b) + "</b>, vẫn là <b>int</b>. Kết quả âm cũng vẫn là " +
          "int, kiểu dữ liệu không đổi vì dấu." });
      d.push({ bt: "a * b", ten: "nhân", kq: String(a * b), kdl: "int",
        giai: "<b>" + a + " * " + b + " = " + (a * b) + "</b>, kiểu <b>int</b>. Nhớ: dấu <b>*</b> không " +
          "được bỏ như trong Toán — viết <b>2a</b> là lỗi cú pháp, phải viết <b>2 * a</b>." });

      d.push({ bt: "a / b", ten: "chia", err: b === 0 ? Z0 : null,
        kq: b === 0 ? "" : inThuc(a / b), kdl: b === 0 ? null : "float",
        canh: "Trong Python 3, phép <b>/</b> <b>luôn</b> trả về <b>float</b>, kể cả khi chia hết. " +
          "<b>6 / 3</b> cho <b>2.0</b> chứ không phải <b>2</b>. Chép thiếu “.0” trong bài là mất điểm.",
        giai: b === 0
          ? "Chia cho 0 thì Python <b>báo lỗi</b> và dừng chương trình, chứ không cho ra vô cực. Muốn an " +
            "toàn phải kiểm tra <b>if b != 0:</b> trước khi chia."
          : "<b>" + a + " / " + b + " = " + inThuc(a / b) + "</b> — kiểu <b>float</b>. Em thử gõ b bằng " +
            "đúng a xem: kết quả là <b>1.0</b>, vẫn float. Muốn nhận số nguyên thì phải dùng <b>//</b>." });

      d.push({ bt: "a // b", ten: "chia lấy phần nguyên", err: b === 0 ? Z1 : null,
        kq: b === 0 ? "" : String(Math.floor(a / b)), kdl: b === 0 ? null : "int",
        canh: "<b>//</b> làm tròn <b>xuống</b> chứ không phải cắt bỏ phần lẻ: <b>-7 // 2</b> ra <b>-4</b> " +
          "chứ không phải -3.",
        giai: b === 0
          ? "Vẫn là chia, nên b = 0 cũng báo <b>ZeroDivisionError</b>."
          : "<b>" + a + " // " + b + " = " + Math.floor(a / b) + "</b>, kiểu <b>int</b>. Nó lấy phần " +
            "nguyên của phép chia " + inThuc(a / b) + "." });

      d.push({ bt: "a % b", ten: "chia lấy phần dư", err: b === 0 ? Z1 : null,
        kq: b === 0 ? "" : String(((a % b) + b) % b), kdl: b === 0 ? null : "int",
        giai: b === 0
          ? "Lấy dư khi chia cho 0 cũng vô nghĩa, nên Python báo lỗi giống hệt <b>//</b>."
          : "<b>" + a + " % " + b + " = " + (((a % b) + b) % b) + "</b> — phần <b>DƯ</b>, không phải phần " +
            "nguyên. Hai công dụng phải nhớ: <b>n % 2 == 0</b> để kiểm tra số chẵn (nói rộng ra, " +
            "<b>n % k == 0</b> là n chia hết cho k), và <b>n % 10</b> để lấy <b>chữ số cuối</b> của n." });

      /* Luỹ thừa: Python có số nguyên dài vô hạn, JavaScript thì không. Quá
         ngưỡng an toàn thì thà không in số còn hơn in một số sai. */
      var lt = Math.pow(a, b), kqLt, kdlLt, errLt = null;
      if (a === 0 && b < 0) {
        errLt = "ZeroDivisionError: 0.0 cannot be raised to a negative power"; kqLt = ""; kdlLt = null;
      } else if (!isFinite(lt) || Math.abs(lt) > 9e15) { kqLt = "(số quá lớn để hiện ở đây)"; kdlLt = null; }
      else if (b < 0) { kqLt = inThuc(lt); kdlLt = "float"; }
      else { kqLt = String(lt); kdlLt = "int"; }
      d.push({ bt: "a ** b", ten: "luỹ thừa", kq: kqLt, kdl: kdlLt, err: errLt,
        giai: "Luỹ thừa viết bằng <b>hai dấu sao</b>: <b>a ** b</b> là a mũ b" +
          (errLt || kdlLt === null ? "." : " — ở đây là <b>" + kqLt + "</b>, kiểu <b>" + kdlLt + "</b>.") +
          " Số mũ âm thì kết quả thành <b>float</b>. Đừng nhầm <b>**</b> với <b>*</b>." });

      d.push({ dau: "Thứ tự ưu tiên — biểu thức dài thì máy tính vế nào trước?",
        uu: 1, bt: "2 + 3 * 4", ten: "nhân trước, cộng sau", kq: String(2 + 3 * 4), kdl: "int",
        canh: "Kết quả là <b>14</b>, không phải 20. <b>Nhân chia trước, cộng trừ sau</b> — giống hệt Toán.",
        giai: "Máy làm <b>3 * 4 = 12</b> trước rồi mới cộng 2, ra <b>14</b>. Ai đọc từ trái sang " +
          "(2 + 3 = 5, rồi 5 * 4) sẽ ra 20 và sai." });
      d.push({ uu: 1, bt: "(2 + 3) * 4", ten: "ngoặc thắng tất cả", kq: String((2 + 3) * 4), kdl: "int",
        giai: "Vẫn ba số đó, chỉ thêm ngoặc mà kết quả đổi từ 14 thành <b>20</b>. <b>Ngoặc tròn được " +
          "tính trước mọi phép khác</b>. Không chắc thứ tự thì cứ đóng ngoặc cho rõ, không ai trừ điểm " +
          "vì thừa ngoặc." });
      d.push({ uu: 1, bt: "10 - 4 - 3", ten: "cùng mức: từ trái sang", kq: String(10 - 4 - 3), kdl: "int",
        giai: "Hai phép trừ cùng mức ưu tiên nên tính <b>từ trái sang</b>: (10 - 4) - 3 = <b>3</b>. Nếu " +
          "tính 4 - 3 trước sẽ ra 9 — sai. Phép <b>/ // %</b> cùng mức với <b>*</b> cũng theo quy tắc này." });
      d.push({ uu: 1, bt: "2 ** 3 ** 2", ten: "luỹ thừa: từ phải sang",
        kq: String(Math.pow(2, Math.pow(3, 2))), kdl: "int",
        canh: "Riêng <b>**</b> tính <b>từ PHẢI sang</b>: 2 ** (3 ** 2) = 2 ** 9 = <b>512</b>. Tính từ " +
          "trái (2 ** 3 = 8, rồi 8 ** 2) sẽ ra 64 — đây là câu bẫy quen thuộc.",
        giai: "Đây là ngoại lệ duy nhất của quy tắc “cùng mức thì từ trái sang”. Muốn ra 64 thì phải tự " +
          "đóng ngoặc: <b>(2 ** 3) ** 2</b>." });
      return d;
    }

    function veOut(it, a, b) {
      var h = "";
      if (it.uu) {
        h += "<div>&gt;&gt;&gt; " + esc(it.bt) + "</div><div>" + esc(it.kq) + "</div>";
      } else {
        h += "<div>&gt;&gt;&gt; a = " + a + "</div><div>&gt;&gt;&gt; b = " + b + "</div>" +
          "<div>&gt;&gt;&gt; " + esc(it.bt) + "</div>";
        if (it.err) {
          h += '<div class="loi">Traceback (most recent call last):</div>' +
            '<div class="loi">' + esc(it.err) + "</div>";
        } else {
          h += "<div>" + esc(it.kq) + "</div>";
          if (it.kdl) {
            h += "<div>&gt;&gt;&gt; type(" + esc(it.bt) + ")</div>" +
              "<div>&lt;class '" + it.kdl + "'&gt;</div>";
          }
        }
      }
      node.querySelector('[data-mh="out"]').innerHTML = h;
    }

    function ve() {
      var ds = dsBuoc(), a = laySo("a"), b = laySo("b");
      if (k >= ds.length) k = ds.length - 1;
      if (k < 0) k = 0;
      node.querySelector('[data-mh="gan"]').innerHTML =
        '<div class="mh7-d">a = ' + a + '</div><div class="mh7-d">b = ' + b + "</div>";

      var t = "<tr><th>Biểu thức</th><th>Kết quả</th><th>Phép toán</th></tr>";
      ds.forEach(function (it, i) {
        if (it.dau) t += '<tr><th colspan="3">' + esc(it.dau) + "</th></tr>";
        var kq = it.err ? "ZeroDivisionError"
          : esc(it.kq) + (it.kdl ? ' <span class="mh10-kdl ' + it.kdl + '">' + it.kdl + "</span>" : "");
        t += '<tr class="' + (i === k ? "nay" : it.err ? "rac" : "") + '" data-i="' + i +
          '" style="cursor:pointer"><td>' + esc(it.bt) + "</td><td>" + kq + "</td><td>" +
          esc(it.ten) + "</td></tr>";
      });
      node.querySelector('[data-mh="bang"]').innerHTML = t;

      /* innerHTML vừa ghi đè cả bảng nên phải gắn lại onclick cho từng dòng. */
      node.querySelectorAll('[data-mh="bang"] tr[data-i]').forEach(function (r) {
        r.onclick = function () {
          k = parseInt(r.getAttribute("data-i"), 10);
          ve();
          loi("Đang xem <b>" + esc(dsBuoc()[k].bt) + "</b>.");
        };
      });

      var it = ds[k];
      veOut(it, a, b);
      node.querySelector('[data-mh="dem"]').innerHTML =
        "Bước <b>" + (k + 1) + "</b>/" + ds.length + " · a = <b>" + a + "</b>, b = <b>" + b + "</b>";

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !it.canh;
      if (it.canh) canh.innerHTML = it.canh;

      var ghi = node.querySelector('[data-mh="ghi"]');
      var cuoi = k === ds.length - 1;
      ghi.className = "mh7-ghi" + (cuoi ? " xong" : "");
      ghi.innerHTML = it.giai + (cuoi
        ? "<br><br>Bốn điều gói lại: <b>/</b> luôn ra <b>float</b>, muốn số nguyên thì dùng <b>//</b>; " +
          "<b>%</b> cho phần <b>dư</b>; <b>nhân chia trước, cộng trừ sau</b>, ngoặc thắng tất cả; cùng " +
          "mức thì <b>từ trái sang</b>, riêng <b>**</b> <b>từ phải sang</b>."
        : "");
      return ds;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      var n = dsBuoc().length;
      if (k >= n - 1) {
        loi("Hết bảng rồi. Em thử đổi <b>a</b>, <b>b</b> ở trên — nhất là <b>b = 0</b> hoặc số <b>âm</b> " +
          "— rồi xem lại hai dòng <b>/</b> và <b>//</b>.");
        return;
      }
      k++;
      var ds = ve();
      loi("Phép <b>" + esc(ds[k].bt) + "</b> → <b>" + (ds[k].err ? "lỗi" : esc(ds[k].kq)) + "</b>.");
    };

    function lamLai() {
      k = 0; ve();
      loi("Hai số đang dùng là <b>a = " + laySo("a") + "</b>, <b>b = " + laySo("b") +
        "</b>. Bấm “Bước tiếp” hoặc bấm thẳng vào một dòng trong bảng.");
    }
    ganDatLai(node, [node.querySelector('[data-mh="a"]'), node.querySelector('[data-mh="b"]')], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-29 · CÁC MỨC NGÔN NGỮ LẬP TRÌNH VÀ VAI TRÒ CỦA CHƯƠNG TRÌNH DỊCH
   *
   *  Ý ĐỒ: hai điều học sinh không tin nếu chỉ đọc chữ. Một là "máy chỉ chạy
   *  được ngôn ngữ máy" — nên phần 1 viết CÙNG MỘT VIỆC ở ba mức để thấy cái
   *  giá phải trả khi xuống thấp. Hai là "biên dịch khác thông dịch" — nên
   *  phần 2 cho chạy một chương trình lỗi ở DÒNG CUỐI: thông dịch kịp in mấy
   *  dòng đầu, biên dịch thì màn hình trống trơn. Khác biệt đó nhìn thấy được,
   *  và nó cũng chính là cách nhận ra hai kiểu dịch trong đề.
   * ================================================================ */
  MH.dangKy("C10-29", function (host) {
    /* Ba mức, cùng làm một việc: cộng 3 với 4 rồi in kết quả. */
    var MUC = [
      { ten: "Bậc cao", vai: "gần tiếng người", tep: "tong.py", ma: ["print(3 + 4)"], nay: 1, that: [
        { b: "Số dòng: 1", s: "Một dòng lo cả việc cộng lẫn việc in." },
        { b: "Máy chạy thẳng: KHÔNG", s: "Phải qua chương trình dịch (Python) rồi mới thành mã máy." },
        { b: "Phụ thuộc loại máy: KHÔNG", s: "Chép sang máy khác, hệ khác vẫn dịch và chạy được." },
      ] },
      { ten: "Hợp ngữ", vai: "từ gợi nhớ", tep: "tong.asm", nay: 1,
        ma: ["MOV AX, 3", "ADD AX, 4", "CALL PRINT", "HLT"], that: [
          { b: "Số dòng: 4", s: "Mỗi dòng chỉ là MỘT thao tác của máy: nạp, cộng, gọi, dừng." },
          { b: "Máy chạy thẳng: KHÔNG", s: "Hợp ngữ không phải ngôn ngữ máy, còn phải nhờ assembler dịch." },
          { b: "Phụ thuộc loại máy: CÓ", s: "Tên lệnh và thanh ghi gắn với đúng dòng CPU đó." },
        ] },
      /* nay = 1: điểm chốt của mức này chính là dòng "máy chạy thẳng ĐƯỢC" —
         cả bài học nằm ở chỗ đây là mức DUY NHẤT có được điều đó. */
      { ten: "Ngôn ngữ máy", vai: "nhị phân", tep: "tong.exe", nay: 1,
        ma: ["B8 03 00", "05 04 00", "E8 12 00", "F4"], that: [
          { b: "Số dòng: 4 nhóm byte", s: "Viết dạng hex cho gọn; B8 thật ra là 10111000." },
          { b: "Máy chạy thẳng: ĐƯỢC", s: "Đây là thứ DUY NHẤT CPU đọc và thực hiện được." },
          { b: "Phụ thuộc loại máy: CÓ", s: "Đổi dòng CPU là bộ mã lệnh đổi theo, dãy byte này vô nghĩa." },
        ] },
    ];
    var CHANG = [
      { ten: "Mã nguồn", vai: "tệp em viết" }, { ten: "Chương trình dịch", vai: "một phần mềm" },
      { ten: "Tệp mã máy", vai: "chỉ biên dịch mới sinh" }, { ten: "Chạy trên CPU", vai: "lúc này mới in" },
    ];
    var CT = ['print("Xin chao")', 'print("Bat dau tinh")', "x = 10 / 0"];

    var BUOC = [
      { p: 1, m: 0,
        dem: "Việc cần làm: <b>cộng 3 với 4 rồi in ra</b> · mức đang xem: <b>bậc cao</b>",
        giai: "Ở <b>ngôn ngữ bậc cao</b> (Python), cả bài toán gói trong một dòng đọc gần như tiếng " +
          "người. Nhưng em nhớ cho: CPU <b>không hiểu dòng này</b>. Nó phải được một <b>chương trình " +
          "dịch</b> chuyển sang mã máy đã. Chương trình dịch là một <b>phần mềm</b>, không phải mạch " +
          "điện hay phần cứng nào cả." },
      { p: 1, m: 1,
        dem: "Cũng việc đó, viết ở mức <b>hợp ngữ</b> · dài ra <b>4 dòng</b>",
        giai: "Xuống <b>hợp ngữ</b>, một dòng Python vỡ ra thành bốn lệnh: nạp 3 vào thanh ghi AX, cộng " +
          "thêm 4, gọi thủ tục in, rồi dừng. Vẫn đọc được nhờ các <b>từ gợi nhớ</b> (MOV, ADD). Chỗ hay " +
          "nhầm: hợp ngữ <b>không phải</b> ngôn ngữ máy — nó vẫn cần một chương trình dịch riêng gọi là " +
          "<b>assembler</b>." },
      { p: 1, m: 2,
        dem: "Xuống tận <b>ngôn ngữ máy</b> · chỉ còn các byte",
        giai: "Đây mới là thứ <b>máy thật sự chạy</b>: từng byte, viết dạng hex cho người đọc đỡ hoa " +
          "mắt, bên trong là nhị phân (B8 chính là 10111000). Chú ý từng dòng ứng đúng một lệnh hợp ngữ " +
          "ở trên: B8 03 00 là MOV AX, 3 · 05 04 00 là ADD AX, 4. Không còn chữ nào gợi nhớ, nên người " +
          "gần như không đọc nổi." },
      { p: 1, m: 2,
        dem: "Ba mức, một việc: <b>1 dòng, 4 lệnh, rồi dãy byte</b>",
        ghi: "Chốt phần 1: <b>máy tính chỉ chạy được ngôn ngữ máy</b>. Mọi thứ viết ở mức cao hơn đều " +
          "phải qua <b>chương trình dịch</b> — và chương trình dịch là một <b>phần mềm</b>. Càng xuống " +
          "thấp thì càng dài, càng khó đọc, và càng <b>phụ thuộc loại máy</b>; đổi lại bậc cao thì ngắn, " +
          "dễ đọc, chép sang máy khác vẫn dùng được.",
        giai: "So ba cột số dòng: 1 rồi 4 rồi 4 nhóm byte — cùng một việc. Vì thế người ta viết ở bậc " +
          "cao rồi để máy dịch xuống, chứ không ai ngồi gõ nhị phân." },

      { p: 2, c: "bien", nay: 0, ch: ["xong", "nay", "cho", "cho"], out: [],
        dem: "Cách 1 — <b>BIÊN DỊCH</b>: dịch xong TOÀN BỘ rồi mới chạy · đang dịch dòng <b>1</b>",
        giai: "Chuyển sang phần 2 với chương trình có lỗi ở <b>dòng cuối</b>. Cách biên dịch làm việc " +
          "theo lối: đọc và dịch <b>cả tệp</b> trước đã. Dòng 1 dịch được, nhưng <b>chưa chạy</b> nên " +
          "màn hình vẫn trắng — chưa có chữ nào hiện ra." },
      { p: 2, c: "bien", nay: 1, ch: ["xong", "nay", "cho", "cho"], out: [],
        dem: "BIÊN DỊCH · đang dịch dòng <b>2</b> · đã in ra: <b>0 dòng</b>",
        giai: "Dòng 2 cũng dịch trót lọt. Vẫn <b>chưa in gì</b>, vì việc chạy chỉ bắt đầu sau khi dịch " +
          "xong hết. Em để ý: đây đúng là chỗ khác nhau căn bản — <b>dịch trước, chạy sau</b>." },
      { p: 2, c: "bien", nay: 2, ch: ["xong", "nay", "cho", "cho"], out: [],
        dem: "BIÊN DỊCH · <b>DỪNG ở dòng 3</b> · đã in ra: <b>0 dòng</b>",
        canh: "<b>Lỗi lúc dịch</b> ở dòng 3 (chia cho 0). Chương trình dịch dừng lại và <b>không sinh ra " +
          "tệp mã máy nào</b> — ô “Tệp mã máy” vẫn trống.",
        giai: "Gặp lỗi, quá trình dịch hỏng giữa chừng nên <b>không có tệp nào để chạy</b>. Kết quả: màn " +
          "hình <b>trống trơn</b>, dù hai lệnh in nằm ở dòng 1 và 2 hoàn toàn đúng. Bù lại, nếu chương " +
          "trình không lỗi thì tệp mã máy sinh ra một lần, các lần sau chạy lại <b>rất nhanh</b> vì khỏi " +
          "dịch nữa." },

      { p: 2, c: "tho", nay: 0, ch: ["xong", "nay", "cho", "nay"],
        out: [{ t: "Xin chao" }],
        dem: "Cách 2 — <b>THÔNG DỊCH</b> (Python): vừa dịch vừa chạy · xong dòng <b>1</b>",
        giai: "Cũng chương trình đó, nhưng thông dịch xử lí <b>từng lệnh một</b>: dịch dòng 1 rồi cho " +
          "chạy luôn dòng 1. Thế là chữ <b>Xin chao</b> đã hiện ra màn hình, trong khi máy còn <b>chưa " +
          "hề đọc</b> tới dòng 3." },
      { p: 2, c: "tho", nay: 1, ch: ["xong", "nay", "cho", "nay"],
        out: [{ t: "Xin chao" }, { t: "Bat dau tinh" }],
        dem: "THÔNG DỊCH · xong dòng <b>2</b> · đã in ra: <b>2 dòng</b>",
        giai: "Đến lượt dòng 2: dịch rồi chạy ngay, in tiếp <b>Bat dau tinh</b>. Nhìn hàng chặng ở trên " +
          "sẽ rõ: ô <b>Tệp mã máy</b> luôn mờ, vì thông dịch <b>không sinh tệp</b> — dịch tới đâu chạy " +
          "tới đó, lần sau chạy lại phải dịch lại từ đầu nên chậm hơn." },
      { p: 2, c: "tho", nay: 2, ch: ["xong", "nay", "cho", "nay"],
        out: [{ t: "Xin chao" }, { t: "Bat dau tinh" },
          { t: "ZeroDivisionError: division by zero", loi: 1 }],
        dem: "THÔNG DỊCH · <b>lỗi ở dòng 3</b> · đã in ra: <b>2 dòng</b>",
        canh: "Lỗi báo ra <b>lúc đang chạy</b>, không phải lúc dịch cả tệp — vì có dịch cả tệp đâu.",
        giai: "Tới dòng 3 mới lộ lỗi chia cho 0. Nhưng khác hẳn bên biên dịch: <b>hai dòng đầu đã kịp in " +
          "ra rồi</b>. Đây là dấu hiệu nhận biết nhanh nhất trong đề: chương trình chạy được nửa chừng " +
          "rồi mới báo lỗi thì đó là <b>thông dịch</b>." },
      { p: 2, c: "tho", nay: 2, xong: true,
        ch: ["xong", "xong", "cho", "xong"],
        out: [{ t: "Xin chao" }, { t: "Bat dau tinh" },
          { t: "ZeroDivisionError: division by zero", loi: 1 }],
        dem: "Cùng một chương trình lỗi: <b>biên dịch in 0 dòng</b> · <b>thông dịch in 2 dòng</b>",
        ghi: "Chốt cả bài: máy chỉ chạy <b>ngôn ngữ máy</b>, nên bậc cao và hợp ngữ đều phải qua " +
          "<b>chương trình dịch</b> — một phần mềm. <b>Biên dịch</b>: dịch hết rồi mới chạy, có lỗi thì " +
          "không sinh tệp và <b>chưa in gì</b>, nhưng chạy lại nhanh. <b>Thông dịch</b>: vừa dịch vừa " +
          "chạy, nên <b>đã in được mấy dòng đầu</b> mới báo lỗi, và lần nào chạy cũng phải dịch lại.",
        giai: "Đặt hai màn hình cạnh nhau là thấy: cùng một tệp, cùng một lỗi ở dòng cuối, mà kết quả " +
          "nhìn thấy khác nhau hẳn. Nhớ theo hệ quả này thì không bao giờ nhầm hai khái niệm." },
    ];

    var buoc;
    var node = MH.el(MH.khung("Ba mức ngôn ngữ và chương trình dịch",
      "Phần 1: cùng một việc (<b>cộng 3 với 4 rồi in ra</b>) viết ở ba mức. Phần 2: cho chạy một chương " +
      "trình <b>có lỗi ở dòng cuối</b> theo hai cách để xem <b>biên dịch</b> khác <b>thông dịch</b> chỗ " +
      "nào. Bấm “Bước tiếp”.",
      '<div data-mh="hang"></div>' +
      '<div class="mh7-doi" data-mh="doi" style="margin-top:11px"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));
    var loi = loiCua(node);

    function hangHop(ds, lop) {
      var h = '<div class="mh9-so">', i;
      for (i = 0; i < ds.length; i++) {
        h += '<div class="mh9-tb ' + lop[i] + '"><b>' + esc(ds[i].ten) + "</b><small>" +
          esc(ds[i].vai) + "</small></div>";
      }
      return h + "</div>";
    }

    /* nay = dòng đang xét; mo = có làm mờ các dòng chưa tới hay không. Phần 1
       không mờ vì cả khối là một bản dịch trọn vẹn, không đọc theo thứ tự. */
    function khoiMa(tep, ds, nay, mo) {
      var h = '<p class="mh7-tep">' + esc(tep) + '</p><div class="mh7-code">', i, c;
      for (i = 0; i < ds.length; i++) {
        c = "mh7-d";
        if (i === nay) c += " nay";
        else if (mo && i > nay) c += " mo";
        h += '<div class="' + c + '">' + esc(ds[i]) + "</div>";
      }
      return h + "</div>";
    }

    function ve() {
      var d = BUOC[buoc], i, lop = [], h, m;

      if (d.p === 1) {
        for (i = 0; i < MUC.length; i++) lop.push(i < d.m ? "xong" : (i === d.m ? "nay" : "cho"));
        node.querySelector('[data-mh="hang"]').innerHTML = hangHop(MUC, lop);

        m = MUC[d.m];
        h = '<div class="mh7-panel"><p class="mh7-nhan">Cùng một việc, viết ở mức: ' + esc(m.ten) +
          "</p>" + khoiMa(m.tep, m.ma, -1, false) + "</div>";
        h += '<div class="mh7-panel"><p class="mh7-nhan">Mức này thế nào</p><div class="mh7-ds">';
        for (i = 0; i < m.that.length; i++) {
          h += '<div class="mh7-m' + (i === m.nay ? " nay" : "") + '"><b class="van">' +
            esc(m.that[i].b) + "</b><small>" + esc(m.that[i].s) + "</small></div>";
        }
        node.querySelector('[data-mh="doi"]').innerHTML = h + "</div></div>";
      } else {
        node.querySelector('[data-mh="hang"]').innerHTML =
          hangHop(CHANG, d.ch) + '<div class="mh9-noi"></div>';

        h = '<div class="mh7-panel"><p class="mh7-nhan">Chương trình (lỗi ở dòng cuối)</p>' +
          khoiMa("thu.py", CT, d.nay, true) + "</div>";
        h += '<div class="mh7-panel"><p class="mh7-nhan">Màn hình kết quả — cách ' +
          (d.c === "bien" ? "BIÊN DỊCH" : "THÔNG DỊCH") + '</p><div class="mh10-out">';
        if (!d.out.length) {
          h += '<div class="trong">Chưa in được chữ nào.</div>';
        } else {
          for (i = 0; i < d.out.length; i++) {
            h += "<div" + (d.out[i].loi ? ' class="loi"' : "") + ">" + esc(d.out[i].t) + "</div>";
          }
        }
        node.querySelector('[data-mh="doi"]').innerHTML = h + "</div></div>";
      }

      node.querySelector('[data-mh="dem"]').innerHTML = d.dem;
      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !d.canh;
      if (d.canh) canh.innerHTML = d.canh;
      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !d.ghi;
      ghi.className = "mh7-ghi" + (d.xong ? " xong" : "");
      if (d.ghi) ghi.innerHTML = d.ghi;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= BUOC.length - 1) {
        loi("Hết bước rồi. Bấm “Làm lại” để xem lại từ ba mức ngôn ngữ.");
        return;
      }
      buoc++; ve(); loi(BUOC[buoc].giai);
    };

    function lamLai() { buoc = 0; ve(); loi(BUOC[0].giai); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });
})();
