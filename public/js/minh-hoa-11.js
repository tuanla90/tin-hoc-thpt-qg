/* ============================================================================
 *  MINH HOẠ ĐỘNG — ĐỢT 11: NỐT LẬP TRÌNH, CSDL BẢN ỨNG DỤNG, KIẾN TRÚC MÁY
 *
 *  ĐỢT ĐẦU TIÊN KHÔNG PHẢI VIẾT DÒNG CSS NÀO. Sau mười đợt, bộ class dùng
 *  chung đã đủ phủ mọi thứ cần vẽ ở đây: khối code có dòng sáng (.mh7-code),
 *  màn hình kết quả nền tối (.mh10-out), ô biến (.mh10-b), bảng dữ liệu
 *  (.mh4-b), hộp chặng (.mh9-tb), khối cảnh báo và ghi chú (.mh8-canh,
 *  .mh7-ghi). Đó là lí do gom hạ tầng ngay từ đợt 7 — tới lúc này thì mỗi
 *  minh hoạ mới chỉ còn là phần nội dung thuần tuý.
 *
 *  Tệp này nạp SAU minh-hoa-10.js nên mọi class trên đều đã có sẵn.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.MinhHoa) return;
  var MH = window.MinhHoa;

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
   *  C10-11 · DẤU "=" KHÔNG PHẢI DẤU BẰNG CỦA TOÁN
   *
   *  NGỘ NHẬN GỐC của cả chủ đề F, chưa gỡ được thì mọi bài sau đều tắc: học
   *  sinh đọc "x = x + 1" bằng con mắt Toán và kết luận là vô lí (trong Toán
   *  nó thật sự vô nghiệm). Nói lí thuyết không ăn thua, vì cái sai nằm ở PHẢN
   *  XẠ đọc chứ không ở kiến thức. Nên minh hoạ này bắt em nhìn thấy vế phải
   *  được tính TRƯỚC, ra một con số, rồi mới ghi đè vào ô biến.
   * ================================================================ */
  MH.dangKy("C10-11", function (host) {
    /* Biến bị GHI vào ở mỗi bước — dùng để tô sáng đúng ô vừa đổi. */
    var DOI = ["x", "y", "x", "y", "ten", "tuoi", null, null];
    var buoc;

    var node = MH.el(MH.khung(
      "Dấu <b>=</b> trong lập trình là lệnh <b>GÁN</b>, không phải dấu bằng của Toán",
      "Đọc dấu <b>=</b> <b>từ phải sang trái</b>: tính xong vế phải, rồi <b>ghi đè</b> kết quả vào ô " +
      "biến ở vế trái. Em bấm “Bước tiếp” chạy từng dòng và nhìn các ô biến đổi giá trị.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Chương trình Python</p>' +
      '<div class="mh7-code" data-mh="ma"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Màn hình kết quả</p>' +
      '<div class="mh10-out" data-mh="out"></div></div>' +
      "</div>" +
      '<p class="mh7-nhan" style="text-align:center;margin:12px 0 0">Các ô biến trong bộ nhớ</p>' +
      '<div class="mh10-bien" data-mh="bien"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="hoa"> gõ nhầm <b>Tuoi</b> (chữ T hoa) ' +
      "ở dòng <b>print</b> thứ nhất</label>"));

    var loi = loiCua(node);
    var oHoa = node.querySelector('[data-mh="hoa"]');
    function hoa() { return oHoa.checked; }
    /* Gõ nhầm hoa thường thì Python báo NameError và DỪNG HẲN — dòng print thứ
       hai không bao giờ chạy. Vì vậy số bước cuối cùng ngắn đi một. */
    function cuoi() { return hoa() ? 6 : 7; }

    function ma() {
      return ["x = 5", "y = x", "x = x + 1", "y = y * 2", 'ten = "An"', "tuoi = 16",
        hoa() ? "print(ten, Tuoi)" : "print(ten, tuoi)", 'print("tuoi", tuoi)'];
    }

    /* Danh sách ô biến sau khi đã chạy xong bước b. Viết theo kiểu "ghi đè dần"
       đúng như máy làm, để giá trị hiện ra không bao giờ lệch với lời giải thích. */
    function bang(b) {
      var t = [];
      function dat(ten, gt) {
        for (var i = 0; i < t.length; i++) if (t[i].ten === ten) { t[i].gt = gt; return; }
        t.push({ ten: ten, gt: gt });
      }
      if (b >= 0) dat("x", "5");
      if (b >= 1) dat("y", "5");
      if (b >= 2) dat("x", "6");
      if (b >= 3) dat("y", "10");
      if (b >= 4) dat("ten", '"An"');
      if (b >= 5) dat("tuoi", "16");
      return t;
    }

    var DEM = [
      "x = 5  &rarr;  lấy <b>5</b> ở vế phải, ghi vào ô <b>x</b>",
      "y = x  &rarr;  y = <b>5</b>  (chép giá trị của x <b>lúc này</b>)",
      "x = x + 1  &rarr;  x = <b>5</b> + 1  &rarr;  x = <b>6</b>",
      "y = y * 2  &rarr;  y = <b>5</b> * 2  &rarr;  y = <b>10</b>",
      'ten = "An"  &rarr;  ô ten giữ <b>chuỗi kí tự</b> "An"',
      "tuoi = 16  &rarr;  ô tuoi giữ <b>số</b> 16",
      "print(...)  &rarr;  lệnh in, <b>không tạo ra biến nào</b>",
      "print(...)  &rarr;  lệnh in, <b>không tạo ra biến nào</b>",
    ];

    function ve() {
      var m = ma(), i, h = "";
      for (i = 0; i < m.length; i++) {
        h += '<div class="mh7-d' + (i === buoc ? " nay" : (i > buoc ? " mo" : "")) + '">' +
          esc(m[i]) + "</div>";
      }
      node.querySelector('[data-mh="ma"]').innerHTML = h;

      var t = bang(buoc), b = "";
      for (i = 0; i < t.length; i++) {
        b += '<div class="mh10-b' + (t[i].ten === DOI[buoc] ? " nay" : "") + '"><b>' +
          esc(t[i].ten) + "</b><i>" + esc(t[i].gt) + "</i></div>";
      }
      node.querySelector('[data-mh="bien"]').innerHTML = b ||
        '<div class="mh10-b none"><b>(chưa có)</b><i>&mdash;</i></div>';

      var out = "";
      if (buoc >= 6) {
        out += hoa()
          ? '<div class="loi">' + esc("NameError: name 'Tuoi' is not defined") + "</div>"
          : "<div>An 16</div>";
      }
      if (buoc >= 7 && !hoa()) out += "<div>tuoi 16</div>";
      node.querySelector('[data-mh="out"]').innerHTML = out ||
        '<div class="trong">(chưa in gì)</div>';

      node.querySelector('[data-mh="dem"]').innerHTML =
        buoc < 0 ? "Chương trình <b>chưa chạy</b> dòng nào" : DEM[buoc];

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(buoc === 1 || buoc === 2 || buoc === 3 || (buoc === 6 && hoa()));
      if (!canh.hidden) {
        if (buoc === 1) {
          canh.innerHTML = "<b>y = x</b> chỉ <b>chép giá trị</b> của x tại đúng lúc này (là 5) sang y. " +
            "Nó <b>không</b> buộc y phải luôn bằng x. Bấm bước tiếp để thấy x đổi mà y đứng yên.";
        } else if (buoc === 2) {
          canh.innerHTML = "Đây là dòng em hay kêu “vô lí”. Trong <b>Toán</b> thì <code>x = x + 1</code> " +
            "đúng là <b>vô nghiệm</b>. Nhưng trong <b>lập trình</b> nó hoàn toàn bình thường: máy tính " +
            "<b>vế phải trước</b> (x đang là 5, nên 5 + 1 = 6), rồi mới <b>ghi đè</b> số 6 vào ô x, xoá " +
            "mất số 5 cũ. Không có phương trình nào ở đây cả.";
        } else if (buoc === 3) {
          canh.innerHTML = "Chú ý: y = <b>5</b> * 2 = <b>10</b>, <b>không phải</b> 6 * 2 = 12. Vì y vẫn " +
            "đang giữ số 5 chép từ trước, nó <b>không dõi theo</b> x. Đây là chỗ sai nhiều nhất khi làm " +
            "bài “chạy tay chương trình”.";
        } else {
          canh.innerHTML = "Python <b>phân biệt chữ hoa với chữ thường</b>: <code>Tuoi</code> và " +
            "<code>tuoi</code> là <b>hai cái tên khác nhau</b>. Chưa có biến nào tên <code>Tuoi</code> " +
            "nên máy báo <b>NameError</b> và <b>dừng hẳn</b> — dòng print cuối không được chạy.";
        }
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < cuoi();
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Bốn điều phải nhớ. <b>(1)</b> Dấu <code>=</code> là <b>lệnh gán</b>, đọc <b>từ " +
          "phải sang trái</b>; <code>x = x + 1</code> nghĩa là “lấy x cộng 1 rồi cất lại vào x”. " +
          "<b>(2)</b> <code>y = x</code> chép <b>giá trị</b> tại thời điểm đó — x đổi thành 6 thì y " +
          "<b>vẫn là 5</b>. <b>(3)</b> Tên biến <b>phân biệt hoa thường</b>, <b>không</b> được bắt đầu " +
          "bằng chữ số và <b>không</b> được trùng từ khoá (<code>if</code>, <code>for</code>, " +
          "<code>print</code>…). <b>(4)</b> Trong <code>print</code>, thứ <b>có nháy kép</b> được in " +
          "<b>nguyên văn</b>, thứ <b>không nháy</b> là <b>tên biến</b> nên in ra <b>giá trị</b> — vì vậy " +
          "<code>print(\"tuoi\", tuoi)</code> ra <b>tuoi 16</b>.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= cuoi()) {
        loi("Đã chạy hết chương trình. Em thử tích ô <b>Tuoi</b> ở trên để xem lỗi hoa thường, " +
          "hoặc bấm “Làm lại”.");
        return;
      }
      buoc++;
      ve();
      if (buoc === 0) {
        loi("Ô nhớ tên <b>x</b> ra đời và giữ số <b>5</b>. Chưa có gì lạ.");
      } else if (buoc === 1) {
        loi("Máy đọc vế phải: <code>x</code> đang là <b>5</b>. Nó chép số <b>5</b> sang ô <b>y</b>. " +
          "Từ giây phút này, <b>y và x không còn liên quan gì nhau</b>.");
      } else if (buoc === 2) {
        loi("Vế phải tính trước: <b>5 + 1 = 6</b>. Rồi số <b>6</b> được ghi đè vào ô <b>x</b>. Nhìn ô " +
          "<b>y</b> mà xem — vẫn là <b>5</b>, không nhúc nhích.");
      } else if (buoc === 3) {
        loi("y = y * 2, mà y đang là <b>5</b> chứ không phải 6, nên y thành <b>10</b>.");
      } else if (buoc === 4) {
        loi("Chuỗi <b>\"An\"</b> có <b>nháy kép</b> nên là <b>chữ nguyên văn</b>, được cất vào ô " +
          "<code>ten</code>.");
      } else if (buoc === 5) {
        loi("Số <b>16</b> không có nháy nên là <b>số thật</b>, cất vào ô <code>tuoi</code>.");
      } else if (buoc === 6) {
        loi(hoa()
          ? "Máy đi tìm ô nhớ tên <b>Tuoi</b> (T hoa) và <b>không thấy</b> — chỉ có <b>tuoi</b> chữ " +
            "thường. Chương trình <b>dừng ngay</b> tại đây."
          : "Cả <code>ten</code> lẫn <code>tuoi</code> đều <b>không có nháy</b> nên là <b>tên biến</b> — " +
            "máy in ra <b>giá trị</b> của chúng: <b>An 16</b>.");
      } else {
        loi("Lần này <code>\"tuoi\"</code> <b>có nháy kép</b> nên in ra <b>nguyên chữ</b> tuoi; còn " +
          "<code>tuoi</code> không nháy vẫn in ra <b>16</b>. Cùng một chữ, khác nhau mỗi cặp nháy.");
      }
    };

    function lamLai() {
      buoc = -1;
      ve();
      loi("Chương trình chưa chạy dòng nào, chưa có ô biến nào cả. Bấm “Bước tiếp” để máy chạy dòng đầu.");
    }
    ganDatLai(node, [oHoa], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C10-30 · NGHĨ TRƯỚC KHI GÕ: XÁC ĐỊNH BÀI TOÁN VÀ MÔ TẢ THUẬT TOÁN
   *
   *  NGỘ NHẬN đắt nhất của bài: học sinh mở máy gõ code trước, sai đâu sửa đó.
   *  Nên minh hoạ cố tình KHÔNG cho thấy dòng Python nào cho tới chặng cuối —
   *  hai chặng đầu chỉ có tiếng Việt.
   *
   *  Ô "dùng thuật toán sai" là chỗ ăn tiền: thuật toán so dây chuyền (b với a,
   *  rồi c với b) vẫn ra ĐÚNG ở bộ (3, 9, 5) và hỏng ở bộ (9, 3, 5). Phải cho
   *  chạy bộ đúng TRƯỚC thì cái bẫy "chạy đúng một bộ là tưởng xong" mới lộ.
   * ================================================================ */
  MH.dangKy("C10-30", function (host) {
    var CHANG = [
      { ten: "Xác định bài toán", vai: "Đầu vào / Đầu ra" },
      { ten: "Mô tả thuật toán", vai: "liệt kê từng bước" },
      { ten: "Viết chương trình", vai: "lúc này mới gõ" },
    ];
    var THU = [[3, 9, 5], [9, 3, 5], [2, 4, 8]];

    var BUOC = [
      { p: 1, io: 1, dem: "Chặng 1 — <b>xác định bài toán</b> · mới tách được ĐẦU VÀO",
        giai: "Đề là <b>“Cho ba số nguyên, tìm số lớn nhất”</b>. Việc đầu tiên <b>không phải</b> mở máy " +
          "gõ code, mà là tách đề làm hai phần. <b>ĐẦU VÀO</b>: ba số nguyên a, b, c — thứ đề cho sẵn." },
      { p: 1, io: 2, dem: "Chặng 1 xong · vào: <b>a, b, c</b> · ra: <b>số lớn nhất</b>",
        giai: "<b>ĐẦU RA</b>: một số duy nhất, là số lớn nhất trong ba số. Viết rõ được Input/Output thì " +
          "em mới có cái để làm. Mơ hồ ở đây là code sai ở kia: chưa biết phải xuất ra cái gì thì gõ bao " +
          "nhiêu dòng cũng không tới đích." },

      { p: 2, n: 2, nay: 1, dem: "Chặng 2 — <b>mô tả thuật toán</b> · vừa viết xong <b>B2</b>",
        giai: "Vẫn chưa có dòng Python nào. Em mô tả cách làm bằng <b>tiếng Việt, đánh số bước</b>. " +
          "<b>B2</b> gán max = a nghĩa là: tạm coi a đang giữ chức lớn nhất, rồi đem hai số kia ra so." },
      { p: 2, n: 3, nay: 2, dem: "Chặng 2 · <b>B3</b> — đem b ra so với số đang giữ chức",
        giai: "So b với <b>max</b> (số đang giữ chức), chứ không phải so với riêng a. Ai hơn thì lên " +
          "thay. Chỗ này chính là chỗ dễ viết hỏng nhất — lát nữa em sẽ thấy." },
      { p: 2, n: 5, nay: 4, dem: "Chặng 2 xong · thuật toán có đúng <b>5 bước</b>",
        giai: "B4 làm y hệt B3 với c, B5 xuất kết quả. Năm bước này <b>là</b> thuật toán rồi, dù chưa có " +
          "chữ Python nào. Nếu em vẽ nó ra sơ đồ khối thì đó <b>vẫn là thuật toán ấy</b> — liệt kê bước " +
          "và sơ đồ khối chỉ là <b>hai cách mô tả cùng một thuật toán</b>, không phải hai thuật toán." },

      { p: 3, hang: 1, dem: "Vẫn ở chặng 2 — <b>kiểm tra bằng tay</b> · bộ (3, 9, 5)",
        giai: "Trước khi gõ, em <b>chạy thử bằng tay</b>. Bộ (3, 9, 5): max = 3, b = 9 lớn hơn nên max = " +
          "9, c = 5 không hơn nên giữ nguyên. Ra <b>9</b>, khớp đáp án." },
      { p: 3, hang: 2, moi: 1, dem: "Kiểm tra bằng tay · bộ <b>(9, 3, 5)</b> — số lớn nhất nằm ở đầu",
        giai: "Bộ này cố tình đặt số lớn nhất ở <b>vị trí bất ngờ</b>: ngay đầu. Với thuật toán đúng thì " +
          "chẳng sao. Bây giờ hãy <b>tích ô “dùng thuật toán sai”</b> ở trên và nhìn lại đúng dòng này." },
      { p: 3, hang: 3, dem: "Kiểm tra bằng tay · thêm bộ (2, 4, 8) — lớn nhất ở cuối",
        giai: "Thử tiếp bộ có đáp án ở cuối. Nguyên tắc chọn bộ thử: cho đáp án <b>lần lượt rơi vào mỗi " +
          "vị trí</b> — đầu, giữa, cuối. Chỉ thử một bộ thì không phát hiện được gì." },
      { p: 3, hang: 4, dem: "Kiểm tra bằng tay · thêm bộ của em ở ô nhập trên",
        giai: "Ba ô nhập ở trên cũng thành một bộ thử. Em đổi số rồi xem bảng đổi theo. <b>Chạy đúng một " +
          "bộ dữ liệu không có nghĩa thuật toán đúng</b> — dòng nào tô đỏ là chỗ thuật toán trả lời sai." },

      { p: 4, nb: 0, dem: "Chặng 3 — <b>viết chương trình</b> · B1 thành <b>3 dòng</b> Python",
        giai: "Giờ mới gõ. Từng bước liệt kê <b>dịch thẳng</b> thành dòng code, khớp một-một. <b>B1 “Nhập " +
          "a, b, c”</b> thành ba lệnh <b>int(input())</b> — int vì đề nói số nguyên." },
      { p: 4, nb: 1, dem: "Chặng 3 · <b>B2</b> thành đúng một dòng gán",
        giai: "<b>B2 “Gán max = a”</b> thành đúng một dòng <b>max = a</b>. Không phải nghĩ gì thêm, vì " +
          "phần nghĩ đã làm xong ở chặng 2 rồi." },
      { p: 4, nb: 2, dem: "Chặng 3 · <b>B3</b> thành câu <b>if</b> và dòng thụt vào",
        giai: "<b>B3</b> thành <b>if</b> cùng một dòng thụt vào bên trong. Chữ “Nếu … thì …” trong bước " +
          "liệt kê chính là chữ <b>if</b>; phần “thì” tụt vào một tầng thụt lề." },
      { p: 4, nb: -1, xong: 1, dem: "Xong · <b>5 bước</b> tiếng Việt thành <b>9 dòng</b> Python",
        ghi: "Chốt bài: <b>nghĩ thuật toán trước, gõ sau</b>. Gõ trước rồi sửa dần là sửa mãi không hết, " +
          "vì cái hỏng nằm ở cách nghĩ chứ không ở dòng code. Thứ tự bắt buộc: <b>xác định bài toán " +
          "(Input/Output) → mô tả thuật toán → kiểm tra bằng tay → mới viết chương trình</b>. Và nhớ: " +
          "<b>chạy đúng một bộ dữ liệu không có nghĩa thuật toán đúng</b>.",
        giai: "Nhìn hai cột: mỗi bước tiếng Việt ứng đúng một cụm dòng code. Vì thuật toán đã đúng từ " +
          "chặng 2 nên chặng 3 chỉ còn là việc <b>chép lại bằng Python</b>, gần như không phải nghĩ." },
    ];

    var buoc;
    var node = MH.el(MH.khung("Nghĩ trước khi gõ: xác định bài toán rồi mới mô tả thuật toán",
      "Một đề duy nhất — <b>“Cho ba số nguyên, tìm số lớn nhất”</b> — đi qua đúng ba chặng trước khi gõ " +
      "dòng code đầu tiên. Đổi ba số ở dưới, hoặc tích ô <b>“dùng thuật toán sai”</b> để thấy một thuật " +
      "toán hỏng vẫn cho kết quả đúng với vài bộ dữ liệu.",
      '<div data-mh="hang"></div>' +
      '<div class="mh7-doi" data-mh="doi" style="margin-top:11px"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      'a <input class="mh-o-nhap hep" type="number" data-mh="a" value="9"> ' +
      'b <input class="mh-o-nhap hep" type="number" data-mh="b" value="3"> ' +
      'c <input class="mh-o-nhap hep" type="number" data-mh="c" value="5"> ' +
      '<label class="mh7-tick"><input type="checkbox" data-mh="sai"> dùng thuật toán sai</label>'));
    var loi = loiCua(node);

    function o(k) { return node.querySelector('[data-mh="' + k + '"]'); }
    function sai() { return o("sai").checked; }
    function so(k) {
      var v = parseInt(o(k).value, 10);
      if (isNaN(v)) v = 0;
      return v > 999 ? 999 : (v < -999 ? -999 : v);
    }

    /* Mô phỏng ĐÚNG logic của từng thuật toán, không tra bảng đáp án sẵn. Bản
       sai so dây chuyền: b với a, rồi c với b — nên số lớn nhất đứng đầu không
       bao giờ được đem ra so lại lần nữa. */
    function chay(a, b, c, xau) {
      var mx = a;
      if (xau) { if (b > a) mx = b; if (c > b) mx = c; }
      else { if (b > mx) mx = b; if (c > mx) mx = c; }
      return mx;
    }

    function dsBuoc() {
      var x = sai();
      return ["B1: Nhập a, b, c", "B2: Gán max = a",
        x ? "B3: Nếu b > a   thì max = b" : "B3: Nếu b > max thì max = b",
        x ? "B4: Nếu c > b   thì max = c" : "B4: Nếu c > max thì max = c",
        "B5: Xuất max"];
    }
    function dsPy() {
      var x = sai();
      return [{ t: "a = int(input())", b: 0 }, { t: "b = int(input())", b: 0 },
        { t: "c = int(input())", b: 0 }, { t: "max = a", b: 1 },
        { t: x ? "if b > a:" : "if b > max:", b: 2 }, { t: "    max = b", b: 2 },
        { t: x ? "if c > b:" : "if c > max:", b: 3 }, { t: "    max = c", b: 3 },
        { t: "print(max)", b: 4 }];
    }

    function khoiDong(ds, nay, mo) {
      var h = '<div class="mh7-code">', i, c;
      for (i = 0; i < ds.length; i++) {
        c = "mh7-d";
        if (nay(i)) c += " nay"; else if (mo && mo(i)) c += " mo";
        h += '<div class="' + c + '">' + esc(ds[i]) + "</div>";
      }
      return h + "</div>";
    }
    function panel(nhan, trong) {
      return '<div class="mh7-panel"><p class="mh7-nhan">' + nhan + "</p>" + trong + "</div>";
    }
    function khong() { return false; }

    function bangThu(n) {
      var ds = THU.concat([[so("a"), so("b"), so("c")]]), i, r, kq, dg, h;
      h = '<table class="mh4-b"><tr><th>a</th><th>b</th><th>c</th>' +
        "<th>Thuật toán cho</th><th>Đúng ra là</th></tr>";
      for (i = 0; i < n && i < ds.length; i++) {
        r = ds[i];
        kq = chay(r[0], r[1], r[2], sai());
        dg = Math.max(r[0], r[1], r[2]);
        h += '<tr class="' + (kq === dg ? "khop" : "rac") + '"><td>' + esc(r[0]) + "</td><td>" +
          esc(r[1]) + "</td><td>" + esc(r[2]) + "</td><td>" + esc(kq) + "</td><td>" +
          esc(dg) + "</td></tr>";
      }
      return h + "</table>";
    }

    function ve() {
      var d = BUOC[buoc], nb = d.nb, h, py;

      node.querySelector('[data-mh="hang"]').innerHTML =
        (function (m) {
          var s = '<div class="mh9-so">', i, c;
          for (i = 0; i < CHANG.length; i++) {
            c = i < m ? "xong" : (i === m ? "nay" : "cho");
            s += '<div class="mh9-tb ' + c + '"><b>' + esc(CHANG[i].ten) + "</b><small>" +
              esc(CHANG[i].vai) + "</small></div>";
          }
          return s + '</div><div class="mh9-noi"></div>';
        })(d.p === 1 ? 0 : (d.p === 4 ? 2 : 1));

      if (d.p === 1) {
        h = panel("Đầu vào (Input)", khoiDong(["ba số nguyên a, b, c",
          "vd: a = " + so("a") + ", b = " + so("b") + ", c = " + so("c")], khong));
        h += panel("Đầu ra (Output)", d.io >= 2
          ? khoiDong(["một số: số lớn nhất trong", "ba số a, b, c"], khong)
          : khoiDong(["( chưa xác định )"], khong, function () { return true; }));
      } else if (d.p === 2) {
        h = panel("Bài toán đã xác định", khoiDong(["vào : a, b, c (số nguyên)",
          "ra  : số lớn nhất"], khong));
        h += panel("Thuật toán — liệt kê bước", khoiDong(dsBuoc().slice(0, d.n),
          function (i) { return i === d.nay; }));
      } else if (d.p === 3) {
        h = panel("Thuật toán đang kiểm tra", khoiDong(dsBuoc(), khong));
        h += panel("Chạy thử bằng tay", bangThu(d.hang));
      } else {
        py = dsPy();
        h = panel("Mô tả thuật toán (chặng 2)", khoiDong(dsBuoc(),
          function (i) { return i === nb; },
          function (i) { return nb >= 0 && i > nb; }));
        h += panel("Chương trình Python (chặng 3)", khoiDong(
          py.map(function (x) { return x.t; }),
          function (i) { return py[i].b === nb; },
          function (i) { return nb >= 0 && py[i].b > nb; }));
      }
      node.querySelector('[data-mh="doi"]').innerHTML = h;

      var canh = node.querySelector('[data-mh="canh"]'), t = "";
      if (sai() && d.p >= 3) {
        t = "<b>Thuật toán sai</b> chỉ so b với a rồi so c với b. Bộ (3, 9, 5) nó <b>vẫn ra đúng 9</b> — " +
          "nhưng bộ (9, 3, 5) nó ra <b>5</b>, vì số lớn nhất đứng ngay đầu nên không bao giờ được đem ra " +
          "so lại. Chạy đúng một bộ <b>không chứng minh được</b> thuật toán đúng.";
      } else if (d.moi) {
        t = "Bây giờ tích ô <b>“dùng thuật toán sai”</b> ở trên rồi nhìn lại đúng dòng này.";
      }
      canh.hidden = !t;
      canh.innerHTML = t;

      node.querySelector('[data-mh="dem"]').innerHTML = d.dem;
      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !d.ghi;
      ghi.className = "mh7-ghi" + (d.xong ? " xong" : "");
      if (d.ghi) ghi.innerHTML = d.ghi;
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= BUOC.length - 1) {
        loi("Hết bước rồi. Tích ô “dùng thuật toán sai” rồi bấm “Làm lại” để xem lại từ đầu.");
        return;
      }
      buoc++; ve(); loi(BUOC[buoc].giai);
    };

    function lamLai() { buoc = 0; ve(); loi(BUOC[0].giai); }
    ganDatLai(node, [o("a"), o("b"), o("c"), o("sai")], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-17 · CHIA BÀI TOÁN THÀNH HÀM VÀ LÀM MỊN DẦN
   *
   *  NGỘ NHẬN: học sinh tưởng chia hàm là chuyện "cho code trông đẹp" — một thứ
   *  trang trí, làm cũng được không làm cũng xong. Nên minh hoạ này không giảng
   *  về cái đẹp, nó ra một YÊU CẦU ĐỔI rồi ĐẾM số chỗ phải sửa ở hai bản. 3 chỗ
   *  so với 1 chỗ, và bản 3 chỗ thì sót mất một chỗ, in ra ba con số không khớp
   *  nhau. Đó là lí do thật sự của việc tách hàm.
   * ================================================================ */
  MH.dangKy("C11-17", function (host) {
    var TOI = 6;
    var buoc = 0;

    var MA_A = [
      "diem = [8, 6, 9, 7, 5, 10]",
      "to1 = [8, 6, 9]",
      "to2 = [7, 5, 10]",
      "",
      "tong = 0",
      "for d in diem:",
      "    tong = tong + d",
      "tb_lop = tong / len(diem)",
      "",
      "tong = 0",
      "for d in to1:",
      "    tong = tong + d",
      "tb_to1 = tong / len(to1)",
      "",
      "tong = 0",
      "for d in to2:",
      "    tong = tong + d",
      "tb_to2 = tong / len(to2)",
      "",
      "print(tb_lop, tb_to1, tb_to2)",
    ];
    var MA_B = [
      "def diem_trung_binh(ds):",
      "    tong = 0",
      "    for d in ds:",
      "        tong = tong + d",
      "    return tong / len(ds)",
      "",
      "diem = [8, 6, 9, 7, 5, 10]",
      "to1 = [8, 6, 9]",
      "to2 = [7, 5, 10]",
      "",
      "tb_lop = diem_trung_binh(diem)",
      "tb_to1 = diem_trung_binh(to1)",
      "tb_to2 = diem_trung_binh(to2)",
      "",
      "print(tb_lop, tb_to1, tb_to2)",
    ];
    var LAP_A = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17];  // ba đoạn chép lại
    var SUA_A = [7, 12, 17];                                   // ba chỗ phải sửa
    var GOI_B = [0, 1, 2, 3, 4, 10, 11, 12];                   // hàm và ba lời gọi

    /* Bản đã sửa: A cố tình SÓT dòng 17 — đó chính là điều minh hoạ muốn cho
       thấy, chứ không phải lỗi gõ nhầm. */
    function maA(sua) {
      var r = MA_A.slice();
      if (sua) {
        r[7] = "tb_lop = round(tong / len(diem), 1)";
        r[12] = "tb_to1 = round(tong / len(to1), 1)";
      }
      return r;
    }
    function maB(sua) {
      var r = MA_B.slice();
      if (sua) r[4] = "    return round(tong / len(ds), 1)";
      return r;
    }
    function demDong(ma) {
      var n = 0, i;
      for (i = 0; i < ma.length; i++) if (ma[i] !== "") n++;
      return n;
    }

    var node = MH.el(MH.khung("Vì sao phải chia chương trình thành hàm?",
      "Cùng một chương trình “quản lí điểm lớp”, viết theo <b>hai bản</b>. Bấm “Bước tiếp” để ra một " +
      "<b>yêu cầu thay đổi</b> rồi <b>đếm số chỗ phải sửa</b> ở mỗi bản.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Bản A — viết dồn một mạch</p>' +
      '<span class="mh7-tep">diem_a.py</span><div class="mh7-code" data-mh="ma"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Bản B — chia thành hàm</p>' +
      '<span class="mh7-tep">diem_b.py</span><div class="mh7-code" data-mh="mb"></div></div>' +
      "</div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div data-mh="out" hidden><p class="mh7-nhan" style="text-align:center;margin:11px 0 5px">' +
      "Màn hình kết quả</p>" +
      '<div class="mh10-out">' +
      "<div>Ban A: 7.5 7.7 7.333333333333333</div>" +
      '<div class="loi">ba con so khong cung dang — sot mot cho sua</div>' +
      "<div>Ban B: 7.5 7.7 7.3</div>" +
      "</div></div>" +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div data-mh="cay" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    function veMa(t, ma, nay, lamMo) {
      var h = "", i, c;
      for (i = 0; i < ma.length; i++) {
        c = "mh7-d";
        if (nay.indexOf(i) >= 0) c += " nay";
        else if (lamMo) c += " mo";
        /* Dòng trống vẫn phải chiếm chỗ, nếu không hai bản lệch dòng nhau. */
        h += '<div class="' + c + '">' + esc(ma[i] === "" ? " " : ma[i]) + "</div>";
      }
      node.querySelector('[data-mh="' + t + '"]').innerHTML = h;
    }

    function moHop(ten, vao, ra, lop) {
      return '<div class="mh9-tb ' + lop + '"><b>' + esc(ten) + "</b><small>" +
        esc("vào: " + vao + " · ra: " + ra) + "</small></div>";
    }
    function veCay() {
      node.querySelector('[data-mh="cay"]').innerHTML =
        '<p class="mh7-nhan" style="text-align:center;margin:14px 0 6px">Làm mịn dần: việc lớn chẻ ' +
        "xuống việc con</p>" +
        '<div class="mh9-so">' + moHop("quan_li_diem_lop()", "tệp điểm", "báo cáo", "nay") + "</div>" +
        '<div class="mh9-noi"></div>' +
        '<div class="mh9-so">' +
        moHop("doc_diem()", "tên tệp", "danh sách điểm", "cho") +
        moHop("diem_trung_binh(ds)", "danh sách", "một số", "xong") +
        moHop("xep_loai(tb)", "một số", "chữ xếp loại", "cho") +
        moHop("in_bao_cao(ds)", "danh sách", "chữ in ra màn hình", "cho") +
        "</div>";
    }

    function ve() {
      var suaA = buoc >= 4, suaB = buoc >= 4;
      var nayA = [], nayB = [], moA = false, moB = false;
      if (buoc === 1) { nayA = LAP_A; moA = true; }
      if (buoc === 2) { nayB = GOI_B; moB = true; }
      if (buoc === 3) { nayA = SUA_A; nayB = [4]; moA = true; moB = true; }
      if (buoc === 4) { nayA = [17]; nayB = [4]; }
      veMa("ma", maA(suaA), nayA, moA);
      veMa("mb", maB(suaB), nayB, moB);

      var d = node.querySelector('[data-mh="dem"]');
      if (buoc === 0) {
        d.innerHTML = "Hai bản làm <b>đúng một việc như nhau</b>: tính điểm trung bình cả lớp, tổ 1, tổ 2.";
      } else if (buoc === 1) {
        d.innerHTML = "Bản A: đoạn tính trung bình bị <b>chép lại 3 lần</b>, chỉ khác tên danh sách.";
      } else if (buoc === 2) {
        d.innerHTML = "Số dòng lệnh — bản A: <b>" + demDong(MA_A) + "</b> · bản B: <b>" +
          demDong(MA_B) + "</b>";
      } else if (buoc >= 3) {
        d.innerHTML = "Yêu cầu đổi: làm tròn 1 chữ số thập phân — bản A phải sửa <b>3 chỗ</b> · " +
          "bản B sửa <b>1 chỗ</b>";
      }

      node.querySelector('[data-mh="out"]').hidden = buoc < 4;
      var c = node.querySelector('[data-mh="canh"]');
      c.hidden = buoc !== 4;
      if (buoc === 4) {
        c.innerHTML = "Bản A sửa được 2 chỗ, <b>sót chỗ thứ ba</b> (dòng đang sáng). Chương trình " +
          "<b>vẫn chạy, không báo lỗi</b> — chỉ có số in ra là sai dạng. Loại sai này khó phát hiện " +
          "nhất, vì máy không hề kêu ca.";
      }
      node.querySelector('[data-mh="cay"]').hidden = buoc < 5;
      if (buoc === 5) veCay();

      var g = node.querySelector('[data-mh="ghi"]');
      g.hidden = buoc < 6;
      if (buoc >= 6) {
        g.className = "mh7-ghi xong";
        g.innerHTML = "Nhớ bốn điều. <b>(1)</b> Chia hàm <b>không phải để code trông đẹp</b> — để khi " +
          "đổi yêu cầu thì <b>sửa một chỗ thay vì nhiều chỗ</b>, và không bao giờ sót. <b>(2)</b> Thấy " +
          "<b>code lặp lại</b> là dấu hiệu phải tách hàm, không cần lí do nào khác. <b>(3)</b> Làm mịn " +
          "dần đi <b>từ trên xuống</b>: nghĩ việc lớn trước, chẻ nhỏ dần, chứ không gõ tuần tự từ dòng " +
          "đầu tới dòng cuối. <b>(4)</b> Mỗi hàm <b>làm đúng một việc</b> và <b>tên phải nói rõ việc đó</b>.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TOI) {
        loi("Đã hết các bước. Bấm “Làm lại” để xem lại từ đầu.");
        return;
      }
      buoc++;
      ve();
      if (buoc === 1) {
        loi("Ba đoạn đang sáng là <b>giống hệt nhau</b>: đặt tong = 0, cộng dồn, rồi chia cho số phần " +
          "tử. Chỉ khác mỗi <b>tên danh sách</b>. Em <b>chép một việc ba lần</b>.");
      } else if (buoc === 2) {
        loi("Bản B gói đúng việc đó vào <code>diem_trung_binh(ds)</code> rồi <b>gọi ba lần</b>. Việc làm " +
          "y hệt, nhưng <b>ít dòng hơn</b> — và quan trọng hơn: cách tính trung bình giờ chỉ nằm ở " +
          "<b>một chỗ duy nhất</b>.");
      } else if (buoc === 3) {
        loi("Yêu cầu mới: <b>làm tròn điểm trung bình tới 1 chữ số thập phân</b>. Đếm các dòng đang " +
          "sáng: bản A có <b>3 chỗ</b> phải sửa, bản B chỉ <b>1 chỗ</b>.");
      } else if (buoc === 4) {
        loi("Bản A sửa hai chỗ đầu rồi <b>quên chỗ thứ ba</b> — nhìn màn hình kết quả: hai số đã làm " +
          "tròn, số thứ ba vẫn dài dằng dặc. Bản B sửa <b>một dòng return</b> là <b>cả ba số</b> đổi " +
          "theo, không thể sót.");
      } else if (buoc === 5) {
        loi("Giờ đi <b>ngược chiều</b>: chưa viết dòng nào cả. Từ việc lớn <b>quản lí điểm lớp</b>, chẻ " +
          "xuống bốn việc con. Đó là <b>làm mịn dần từ trên xuống</b>: nghĩ việc lớn trước, chia nhỏ " +
          "dần, rồi mới viết thân từng hàm.");
      } else {
        loi("Chú ý: mỗi hộp chỉ mới có <b>tên hàm</b> cùng <b>đầu vào - đầu ra</b>, thân hàm còn để " +
          "trống — vậy mà bài <b>đã xong một nửa</b>. Viết được tên và đầu vào - đầu ra nghĩa là em đã " +
          "biết rõ mình cần gì. Ô <code>diem_trung_binh</code> tô đậm vì em vừa viết xong nó.");
      }
    };

    function lamLai() {
      buoc = 0;
      ve();
      loi("Đọc qua hai bản trước. Chúng làm <b>y hệt nhau</b> — cùng in ra ba con số. Bấm “Bước tiếp” " +
        "để xem chúng khác nhau ở đâu.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-31 · NẠP THƯ VIỆN PYTHON VÀ TỰ TẠO THƯ VIỆN
   *
   *  NGỘ NHẬN LÕI: học sinh học "import math rồi dùng hàm của math", nhớ đúng
   *  một nửa đó rồi viết sqrt(16) trơ trọi. Câu chữ không sửa được — phải cho
   *  thấy đúng thông báo NameError mà Python in ra. Ngộ nhận sinh đôi của nó ít
   *  ai nói tới: from math import sqrt thì có sqrt nhưng MẤT tên math.
   *
   *  Mỗi bước hai nhịp: nhịp 1 hiện code cho em ĐOÁN, nhịp 2 mới chạy. Thấy kết
   *  quả ngay lập tức thì không ai kịp đoán sai — mà đoán sai mới nhớ.
   * ================================================================ */
  MH.dangKy("C11-31", function (host) {
    /* Python dừng ngay ở lỗi đầu tiên, nên trong mỗi bước dòng CHẠY ĐƯỢC luôn
       đặt trước dòng lỗi — xếp ngược lại là mô phỏng sai hành vi thật. */
    function ok(s) { return { t: s }; }
    function err(ten, dong) {
      return [
        { t: "Traceback (most recent call last):", e: 1 },
        { t: '  File "main.py", line ' + dong + ", in <module>", e: 1 },
        { t: "NameError: name '" + ten + "' is not defined", e: 1 },
      ];
    }

    var BUOC = [
      {
        lenh: "Chưa import gì", van: 1,
        mo: "Gọi thẳng <code>sqrt(16)</code>",
        tep: [{ ten: "main.py", dong: ["print(sqrt(16))"], nay: 0 }],
        out: err("sqrt", 1),
        ten: [["sqrt", "KHÔNG"], ["math", "KHÔNG"]],
        doan: "Chương trình chỉ có một dòng <code>print(sqrt(16))</code>. Em đoán xem: Python có sẵn " +
          "hàm <code>sqrt</code> không? Bấm “Bước tiếp” để chạy.",
        giai: "Lỗi. Python <b>không tự biết</b> mọi hàm — lúc khởi động nó chỉ có vài chục tên có sẵn " +
          "(<code>print</code>, <code>len</code>, <code>int</code>…), và <code>sqrt</code> không nằm " +
          "trong đó. Muốn dùng thì phải <b>nạp thư viện chứa nó</b> trước.",
      },
      {
        lenh: "import math",
        mo: "Nạp cả mô đun, giữ nguyên tên <code>math</code>",
        tep: [{ ten: "main.py",
          dong: ["import math", "", "print(math.sqrt(16))", "print(sqrt(16))"], nay: 0 }],
        out: [ok("4.0")].concat(err("sqrt", 4)),
        ten: [["math", "CÓ"], ["sqrt", "KHÔNG"]],
        doan: "Đã có <code>import math</code> ở dòng 1. Hai dòng gọi hàm bên dưới, em đoán dòng nào " +
          "chạy được, dòng nào lỗi?",
        giai: "<b>Đây là chỗ sai kinh điển.</b> <code>import math</code> chỉ mang về <b>một cái tên duy " +
          "nhất là <code>math</code></b>, không hề làm tên <code>sqrt</code> xuất hiện trơ trọi. Nên " +
          "<code>math.sqrt(16)</code> ra <b>4.0</b>, còn <code>sqrt(16)</code> vẫn lỗi y như khi chưa " +
          "import. (Kết quả là <b>4.0</b> chứ không phải 4: <code>math.sqrt</code> luôn trả số thực.)",
      },
      {
        lenh: "from math import sqrt",
        mo: "Chỉ lấy ra <b>một hàm</b>, không lấy tên mô đun",
        tep: [{ ten: "main.py",
          dong: ["from math import sqrt", "", "print(sqrt(16))", "print(math.sqrt(16))"], nay: 0 }],
        out: [ok("4.0")].concat(err("math", 4)),
        ten: [["sqrt", "CÓ"], ["math", "KHÔNG"]],
        doan: "Lần này viết <code>from math import sqrt</code>. Hai dòng gọi hàm vẫn như cũ nhưng đảo " +
          "thứ tự — em đoán lần này dòng nào lỗi?",
        giai: "<b>Ngược hẳn bước trước.</b> <code>from math import sqrt</code> chỉ lôi <b>đúng cái tên " +
          "<code>sqrt</code></b> vào chương trình, còn cái tên <code>math</code> thì <b>chưa hề được " +
          "nạp</b>. Vậy nên <code>sqrt(16)</code> chạy ngon mà <code>math.sqrt(16)</code> lại báo " +
          "<code>name 'math' is not defined</code>. Nạp kiểu nào thì gọi đúng kiểu đó.",
      },
      {
        lenh: "import math as m",
        mo: "Nạp mô đun nhưng <b>đặt tên tắt</b>",
        tep: [{ ten: "main.py",
          dong: ["import math as m", "", "print(m.sqrt(16))", "print(math.sqrt(16))"], nay: 0 }],
        out: [ok("4.0")].concat(err("math", 4)),
        ten: [["m", "CÓ"], ["math", "KHÔNG"], ["sqrt", "KHÔNG"]],
        doan: "<code>as m</code> nghĩa là gì? Em đoán <code>m.sqrt(16)</code> và " +
          "<code>math.sqrt(16)</code> — dòng nào chạy?",
        giai: "<code>as m</code> là <b>đổi tên khi nạp</b> cho gọn tay (hay gặp với thư viện tên dài). " +
          "Từ lúc đó trong chương trình chỉ có tên <b><code>m</code></b>; tên <code>math</code> <b>không " +
          "tồn tại</b> nữa nên gọi bằng <code>math.</code> là lỗi. Quy tắc chung: <b>gọi bằng đúng cái " +
          "tên mà lệnh nạp đã tạo ra</b>.",
      },
      {
        lenh: "import hinhhoc",
        mo: "Nạp <b>thư viện do chính em viết</b>",
        tep: [
          { ten: "hinhhoc.py",
            dong: ["import math", "", "def dien_tich_tron(r):", "    return math.pi * r * r"], nay: 2 },
          { ten: "main.py", dong: ["import hinhhoc", "", "print(hinhhoc.dien_tich_tron(2))"], nay: 0 },
        ],
        out: [ok("12.566370614359172")],
        ten: [["hinhhoc", "CÓ"], ["dien_tich_tron", "KHÔNG"]],
        doan: "Giờ có <b>hai tệp</b>: <code>hinhhoc.py</code> em tự viết, và <code>main.py</code> nạp nó " +
          "về dùng. Em đoán xem có phải khai báo gì thêm để <code>hinhhoc.py</code> trở thành thư viện không?",
        giai: "<b>Không cần khai báo gì cả.</b> <b>Mỗi tệp .py đã là một mô đun</b> — cứ viết hàm vào " +
          "rồi tệp khác nạp về dùng được ngay. Ba điều phải nhớ: <b>(1)</b> tên mô đun chính là <b>tên " +
          "tệp bỏ đuôi .py</b> (tệp <code>hinhhoc.py</code> thì viết <code>import hinhhoc</code>, " +
          "<b>không</b> viết <code>import hinhhoc.py</code>); <b>(2)</b> hai tệp phải <b>nằm cùng thư " +
          "mục</b>; <b>(3)</b> nạp kiểu này thì gọi là <code>hinhhoc.dien_tich_tron(2)</code>, đúng luật " +
          "của bước 2.",
      },
    ];

    var i = 0, chay = false;

    var node = MH.el(MH.khung("Nạp thư viện Python: viết import kiểu nào thì gọi hàm kiểu ấy",
      "Bên trái là chương trình, bên phải là <b>màn hình kết quả thật</b>. Mỗi bước thử một cách " +
      "<code>import</code> rồi xem <b>gọi hàm kiểu nào chạy, kiểu nào lỗi</b>.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Chương trình</p><div data-mh="trai"></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">Màn hình kết quả</p>' +
      '<div class="mh10-out" data-mh="out"></div></div>' +
      "</div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<p class="mh7-nhan" style="margin:12px 0 5px">Các cách nạp — bấm để xem lại</p>' +
      '<div class="mh7-ds" data-mh="ds"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    function chonMuc() { i = Number(this.getAttribute("data-k")); chay = false; ve(); loi(BUOC[i].doan); }

    function ve() {
      var b = BUOC[i];

      node.querySelector('[data-mh="trai"]').innerHTML = b.tep.map(function (t) {
        return '<span class="mh7-tep">' + esc(t.ten) + '</span><div class="mh7-code">' +
          t.dong.map(function (d, k) {
            return '<div class="mh7-d' + (k === t.nay ? " nay" : "") + '">' + esc(d) + "</div>";
          }).join("") + "</div>";
      }).join('<div style="height:10px"></div>');

      var out = node.querySelector('[data-mh="out"]');
      out.innerHTML = chay
        ? b.out.map(function (d) {
          return "<div" + (d.e ? ' class="loi"' : "") + ">" + esc(d.t) + "</div>";
        }).join("")
        : '<div class="trong">(chưa chạy — em thử đoán trước xem dòng nào lỗi)</div>';

      /* Dòng này là cốt lõi cả bài: mỗi lệnh nạp tạo ra NHỮNG TÊN NÀO. */
      node.querySelector('[data-mh="dem"]').innerHTML = "Tên dùng được lúc này: " +
        b.ten.map(function (p) { return "<b>" + esc(p[0]) + "</b> " + p[1]; }).join(" · ");

      node.querySelector('[data-mh="ds"]').innerHTML = BUOC.map(function (x, k) {
        return '<div class="mh7-m' + (k === i ? " nay" : "") + '" data-k="' + k + '">' +
          "<b" + (x.van ? ' class="van"' : "") + ">" + esc(x.lenh) + "</b><small>" + x.mo + "</small></div>";
      }).join("");
      /* innerHTML vừa ghi đè xong nên phải gắn lại onclick mỗi lần vẽ. */
      node.querySelectorAll(".mh7-m").forEach(function (o) { o.onclick = chonMuc; });

      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !(i === BUOC.length - 1 && chay);
      if (!canh.hidden) {
        canh.innerHTML = "Bẫy khi tự đặt tên tệp: <b>đừng đặt trùng tên thư viện chuẩn</b>. Nếu em đặt " +
          "tệp của mình là <code>math.py</code> thì lệnh <code>import math</code> sẽ nạp <b>tệp của " +
          "em</b> chứ không phải thư viện toán của Python — và <code>math.sqrt</code> lập tức báo lỗi " +
          "không tìm thấy, rất khó đoán ra nguyên nhân.";
      }

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = !(i === BUOC.length - 1 && chay);
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Thư viện <b>không phải phép màu</b>: nó cũng chỉ là những tệp .py người khác " +
          "viết sẵn, y hệt <code>hinhhoc.py</code> em vừa làm. Việc duy nhất của lệnh <code>import</code> " +
          "là <b>mang tên của thứ đó vào chương trình</b> — mang tên nào thì gọi bằng tên ấy:" +
          '<table class="mh4-b" style="margin-top:9px"><tr><th>Viết</th><th>Gọi ĐƯỢC</th>' +
          "<th>Gọi LỖI</th></tr>" +
          '<tr class="khop"><td>import math</td><td>math.sqrt(16)</td><td>sqrt(16)</td></tr>' +
          '<tr class="khop"><td>from math import sqrt</td><td>sqrt(16)</td><td>math.sqrt(16)</td></tr>' +
          '<tr class="khop"><td>import math as m</td><td>m.sqrt(16)</td><td>math.sqrt(16)</td></tr>' +
          "</table>";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (!chay) { chay = true; ve(); loi(BUOC[i].giai); return; }
      if (i >= BUOC.length - 1) {
        loi("Đã đi hết <b>" + BUOC.length + "</b> cách nạp thư viện. Bấm vào danh sách bên dưới để xem " +
          "lại bất kì cách nào, hoặc bấm “Làm lại” để chạy từ đầu.");
        return;
      }
      i++; chay = false; ve(); loi(BUOC[i].doan);
    };

    ganDatLai(node, [], function () { i = 0; chay = false; ve(); loi(BUOC[0].doan); });
    ve(); loi(BUOC[0].doan);
    host.appendChild(node);
  });

  /* ==================================================================
   *  C11-33 · CÁC KĨ THUẬT THIẾT KẾ THUẬT TOÁN
   *
   *  NGỘ NHẬN gốc: học sinh nghĩ "thuật toán tốt hơn" là "code ngắn hơn" hoặc
   *  "nghe hay hơn". Không lời khen nào chữa được — chỉ có CON SỐ. Nên minh hoạ
   *  này cho gõ n rồi tự đếm số phép so sánh của hai cách trên cùng một bài:
   *  với n = 16 chênh 4 lần (chả đáng gì), với n = 1 000 000 chênh hơn 50 000
   *  lần. Đúng lúc con số nhảy lên thì "chia để trị" mới có nghĩa.
   *
   *  Tham lam để cuối cùng vì nó dạy điều ngược lại: nhanh mà VẪN CÓ THỂ SAI.
   * ================================================================ */
  MH.dangKy("C11-33", function (host) {
    var MG = [500000, 200000, 100000, 50000, 20000, 10000];   // mệnh giá tiền Việt, giảm dần
    var HET = 5, buoc;

    var node = MH.el(MH.khung(
      "Thuật toán nào tốt hơn? — đo bằng số phép so sánh, không đo bằng lời khen",
      "Cùng một việc: tìm một số trong dãy <b>đã sắp xếp</b> gồm n phần tử. Em gõ <b>n</b>, bảng tự tính " +
      "lại <b>số phép so sánh</b> của hai cách. Bấm “Bước tiếp” để đi qua ba kĩ thuật thiết kế.",
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh7-code" data-mh="code" hidden></div>' +
      '<div data-mh="hop" hidden><p class="mh8-dem" data-mh="dtien"></p>' +
      '<div class="mh9-so" data-mh="to"></div></div>' +
      '<div class="mh4-cuon" data-mh="tk" hidden><table class="mh4-b" data-mh="btk"></table></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhN33">n =</label>' +
      '<input class="mh-o-nhap hep" id="mhN33" data-mh="n" type="number" value="1000">' +
      '<label for="mhT33">Tiền thừa =</label>' +
      '<input class="mh-o-nhap hep" id="mhT33" data-mh="tt" type="number" value="780000">'));

    var loi = loiCua(node);
    function o(t) { return node.querySelector('[data-mh="' + t + '"]'); }
    function hien(t, co) { o(t).hidden = !co; }
    function soDep(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

    /* Chặn hai đầu: n < 1 thì bài toán vô nghĩa, n quá lớn thì bảng ra số rác. */
    function layN() {
      var v = Math.floor(Number(o("n").value));
      if (isNaN(v)) v = 1000;
      return Math.max(1, Math.min(100000000, v));
    }
    function layTien() {
      var v = Math.floor(Number(o("tt").value));
      if (isNaN(v)) v = 780000;
      return Math.max(0, Math.min(100000000, v));
    }
    /* floor(log2 n) + 1. Cộng epsilon vì Math.log(1024)/Math.log(2) có thể ra
       9.999999… do sai số dấu phẩy động, làm lệch mất một phép so sánh. */
    function nhiPhan(n) { return Math.floor(Math.log(n) / Math.log(2) + 1e-9) + 1; }

    /* Thuật toán tham lam chạy thật: luôn rút tờ lớn nhất còn dùng được. */
    function thoiTien(t) {
      var kq = [], i, so;
      for (i = 0; i < MG.length; i++) {
        so = Math.floor(t / MG[i]);
        t -= so * MG[i];
        kq.push({ m: MG[i], so: so });
      }
      return { ds: kq, du: t };
    }

    function veCode(dong, nay) {
      o("code").innerHTML = dong.map(function (d, i) {
        return '<div class="mh7-d' + (i === nay ? " nay" : "") + '">' + esc(d) + "</div>";
      }).join("");
    }

    /* Bảng luôn có mấy mốc quen thuộc để so, cộng thêm đúng n em vừa gõ (tô
       sáng) — nhìn một phát thấy khoảng cách giãn ra thế nào khi n lớn dần. */
    function veBang() {
      var n = layN(), moc = [16, 1000, 1000000], ds = [n], i, v, b;
      for (i = 0; i < moc.length; i++) if (moc[i] !== n) ds.push(moc[i]);
      ds.sort(function (a, c) { return a - c; });
      var h = "<tr><th>n</th><th>Vét cạn (tuần tự)</th><th>Chia để trị (nhị phân)</th>" +
        "<th>Nhanh gấp</th></tr>";
      for (i = 0; i < ds.length; i++) {
        v = ds[i]; b = nhiPhan(v);
        h += '<tr class="' + (v === n ? "nay" : "") + '"><td>' + esc(soDep(v)) + "</td><td>" +
          esc(soDep(v)) + "</td><td>" + b + "</td><td>" + esc(soDep(Math.round(v / b))) + " lần</td></tr>";
      }
      o("bang").innerHTML = h;
      o("dem").innerHTML = "Với <b>n = " + esc(soDep(n)) + "</b>: vét cạn cần tới <b>" + esc(soDep(n)) +
        "</b> phép so sánh, nhị phân chỉ cần <b>" + nhiPhan(n) + "</b>.";
    }

    function veTien() {
      var t = layTien(), r = thoiTien(t), tong = 0, h = "", i;
      for (i = 0; i < r.ds.length; i++) {
        tong += r.ds[i].so;
        h += '<div class="mh9-tb ' + (r.ds[i].so > 0 ? "xong" : "cho") + '"><b>' +
          esc(soDep(r.ds[i].m)) + "</b><small>" +
          (r.ds[i].so > 0 ? r.ds[i].so + " tờ" : "không dùng") + "</small></div>";
      }
      o("to").innerHTML = h;
      o("dtien").innerHTML = "Trả <b>" + esc(soDep(t)) + "</b> đồng bằng <b>" + tong + "</b> tờ" +
        (r.du > 0 ? " · còn thừa <b>" + esc(soDep(r.du)) + "</b> đồng, bộ mệnh giá này không trả nổi" : "");
    }

    function veTongKet() {
      o("btk").innerHTML =
        "<tr><th>Kĩ thuật</th><th>Ý tưởng</th><th>Ví dụ</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr>" +
        "<tr><td>Vét cạn</td><td>Thử hết mọi khả năng</td><td>Tìm tuần tự</td>" +
        "<td>Luôn đúng, dễ viết</td><td>Chậm khi n lớn</td></tr>" +
        "<tr><td>Chia để trị</td><td>Chia thành bài nhỏ cùng dạng rồi ghép lại</td>" +
        "<td>Tìm nhị phân, sắp xếp trộn</td><td>Nhanh hẳn một bậc</td>" +
        "<td>Không phải bài nào cũng chia được</td></tr>" +
        "<tr><td>Tham lam</td><td>Mỗi bước chọn cái tốt nhất trước mắt</td><td>Trả tiền thừa</td>" +
        "<td>Rất nhanh, rất gọn</td><td>Không bảo đảm tối ưu</td></tr>";
    }

    o("tien").onclick = function () {
      if (buoc >= HET) {
        loi("Hết bước rồi. Em đổi <b>n</b> hoặc <b>số tiền thừa</b> ở trên để xem con số nhảy theo, " +
          "hoặc bấm “Làm lại” để đi lại từ đầu.");
        return;
      }
      buoc++;
      var n = layN(), b = nhiPhan(n);

      if (buoc === 1) {
        hien("code", true);
        veCode(["# VÉT CẠN — tìm x trong dãy a có n phần tử",
          "for i in range(n):",
          "    if a[i] == x:        # 1 phép so sánh",
          "        return i",
          "return -1                # xấu nhất: n phép so sánh"], 2);
        loi("<b>Vét cạn</b>: thử hết mọi khả năng, dò từng phần tử từ đầu tới cuối. Rất dễ nghĩ và luôn " +
          "cho đáp án đúng vì không bỏ sót gì. Cái giá là xấu nhất phải so <b>" + esc(soDep(n)) +
          "</b> lần — đúng bằng n.");
      } else if (buoc === 2) {
        veCode(["# CHIA ĐỂ TRỊ — dãy a phải ĐÃ SẮP XẾP tăng dần",
          "trai, phai = 0, n - 1",
          "while trai <= phai:",
          "    giua = (trai + phai) // 2",
          "    if a[giua] == x: return giua      # 1 phép so sánh",
          "    if a[giua] < x: trai = giua + 1   # bỏ luôn nửa trái",
          "    else: phai = giua - 1             # bỏ luôn nửa phải"], 3);
        hien("canh", true);
        o("canh").innerHTML = "<b>Nhị phân chỉ dùng được khi dãy ĐÃ SẮP XẾP.</b> Nó tin rằng phần tử ở " +
          "giữa chia dãy thành “bên trái nhỏ hơn, bên phải lớn hơn” — dãy chưa sắp thì niềm tin đó sai " +
          "và thuật toán trả về kết quả bậy. Gặp dãy lộn xộn thì phải sắp trước đã.";
        loi("<b>Chia để trị</b>: chia bài toán thành bài nhỏ hơn <b>cùng dạng</b>, giải rồi ghép lại. Mỗi " +
          "lần so là vứt đi một nửa vùng tìm, nên với n = " + esc(soDep(n)) + " chỉ cần <b>" + b +
          "</b> phép so sánh — nhanh gấp <b>" + esc(soDep(Math.round(n / b))) + "</b> lần vét cạn. Sắp " +
          "xếp trộn (merge sort) cũng đúng lối nghĩ này.");
      } else if (buoc === 3) {
        hien("code", true); hien("hop", true); hien("canh", false);
        veCode(["# THAM LAM — trả tiền thừa bằng ít tờ nhất",
          "menh_gia = [500000, 200000, 100000, 50000, 20000, 10000]",
          "for m in menh_gia:            # duyệt từ lớn xuống nhỏ",
          "    so_to = tien // m         # lấy tối đa tờ này",
          "    tien = tien - so_to * m   # chọn xong KHÔNG xét lại"], 3);
        veTien();
        loi("<b>Tham lam</b>: mỗi bước chọn cái tốt nhất trước mắt — ở đây là luôn rút tờ lớn nhất còn " +
          "dùng được — rồi <b>không bao giờ quay lại sửa</b>. Em thử đổi số tiền ở ô trên xem cách trả " +
          "đổi theo thế nào.");
      } else if (buoc === 4) {
        hien("canh", true);
        o("canh").innerHTML = "<b>Tham lam không bảo đảm tối ưu.</b> Với bộ mệnh giá tiền Việt thì nó " +
          "luôn trúng, nhưng đó là may mắn của bộ mệnh giá chứ không phải công của thuật toán. Thử bộ " +
          "mệnh giá 4, 3, 1 và cần trả 6: tham lam rút tờ 4 trước, còn 2, phải bù hai tờ 1 — <b>3 tờ</b>. " +
          "Trong khi 3 + 3 chỉ mất <b>2 tờ</b>. Chọn tốt nhất tại chỗ đã làm hỏng nước sau.";
        loi("Đây là điểm yếu chí mạng của tham lam: nó <b>nhanh</b> nhưng <b>có thể sai</b>. Chưa chứng " +
          "minh được nó luôn đúng thì đừng dùng — hãy viết thêm bản vét cạn để đối chứng.");
      } else {
        hien("code", false); hien("hop", false); hien("canh", false); hien("tk", true);
        veTongKet();
        hien("ghi", true);
        o("ghi").className = "mh7-ghi xong";
        o("ghi").innerHTML = "Ba điều cần nhớ. <b>(1)</b> “Thuật toán tốt hơn” nghĩa là <b>làm ít phép " +
          "tính hơn khi dữ liệu lớn</b>, không phải viết ngắn hơn hay đọc hay hơn. <b>(2)</b> Với n nhỏ " +
          "thì hai cách gần như nhau — thử gõ n = 16 mà xem, chênh có 4 lần. <b>Khác biệt chỉ lộ ra khi " +
          "n lớn</b>, và đó chính là lí do phải học độ phức tạp. <b>(3)</b> Mỗi kĩ thuật có điều kiện " +
          "dùng riêng: nhị phân đòi dãy đã sắp xếp, tham lam đòi bài toán “đẹp” — dùng sai chỗ là ra kết " +
          "quả sai chứ không chỉ chậm.";
        loi("Xong. Trước khi chọn kĩ thuật, em nhìn <b>cấu trúc bài toán</b>: chia đôi được thì chia để " +
          "trị, chọn tại chỗ mà chứng minh được thì tham lam, còn bí thì cứ vét cạn để có đáp án đúng đã.");
      }
    };

    function lamLai() {
      buoc = 0;
      veBang();
      hien("code", false); hien("hop", false); hien("tk", false);
      hien("canh", false); hien("ghi", false);
      loi("Bài toán: tìm một số trong dãy <b>đã sắp xếp</b> gồm n phần tử. Bảng trên đã tính sẵn số phép " +
        "so sánh của hai cách. Bấm “Bước tiếp” để xem từng cách làm ăn thua ở đâu.");
    }
    ganDatLai(node, [o("n"), o("tt")], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-02 · THIẾT KẾ CẤU TRÚC BẢNG: TRƯỜNG, KIỂU DỮ LIỆU, KHOÁ CHÍNH
   *
   *  Sách chỉ liệt kê "có những kiểu dữ liệu nào" rồi thôi, nên học sinh học
   *  thuộc bảng kiểu mà vẫn chọn bừa lúc làm thật — vì chưa bao giờ thấy chọn
   *  sai thì HỎNG Ở ĐÂU. Minh hoạ này cho tích ô "chọn kiểu sai" rồi tính ra
   *  hậu quả THẬT: số 0 đầu số điện thoại thật sự bốc hơi qua Number(), thứ tự
   *  ngày sinh thật sự sắp theo chuỗi, điểm thật sự bị làm tròn.
   * ================================================================ */
  MH.dangKy("U11-02", function (host) {
    /* Bốn bản ghi, mỗi bản mang sẵn một cái bẫy: hai bạn TRÙNG TÊN, một bạn
       KHÔNG CÓ điện thoại, ngày sinh xếp theo chữ khác hẳn xếp theo thời gian,
       điểm có phần thập phân. Bớt dòng đi là mất luôn chỗ để lỗi lộ ra. */
    var HS = [
      { ma: "HS01", ten: "Trần Bảo Minh", ns: "02/12/2007", dt: "0912345678", d: 8.5, nop: "Yes" },
      { ma: "HS02", ten: "Lê Thu Hà", ns: "10/01/2007", dt: "0987000123", d: 7.25, nop: "No" },
      { ma: "HS03", ten: "Trần Bảo Minh", ns: "25/07/2007", dt: "", d: 6.8, nop: "Yes" },
      { ma: "HS04", ten: "Phạm Gia Huy", ns: "09/03/2007", dt: "0333456789", d: 9.4, nop: "No" },
    ];
    /* Để da_nop_hs là Text thì mỗi người ghi một kiểu — đúng thứ xảy ra ngoài đời. */
    var VAN_NOP = ["Rồi", "Chưa", "co", "0"];

    var TR = [
      { ten: "ma_hs", mo: "mã HS01, HS02… — có chữ", dung: "Text (văn bản)", sai: "Number (số)" },
      { ten: "ho_ten", mo: "họ tên đầy đủ", dung: "Text (văn bản)", sai: "Number (số)" },
      { ten: "ngay_sinh", mo: "ngày tháng năm sinh", dung: "Date/Time (ngày)", sai: "Text (văn bản)" },
      { ten: "so_dien_thoai", mo: "số bắt đầu bằng chữ số 0", dung: "Text (văn bản)", sai: "Number (số)" },
      { ten: "diem_tb", mo: "điểm có phần thập phân", dung: "Number thực", sai: "Number nguyên" },
      { ten: "da_nop_hs", mo: "đã nộp hồ sơ hay chưa", dung: "Yes/No (lô-gic)", sai: "Text (văn bản)" },
    ];
    var KHOA = [
      { ten: "ho_ten", mo: "thử lấy họ tên làm khoá chính", phu: "ngay_sinh",
        lay: function (h) { return h.ten; }, lp: function (h) { return h.ns; } },
      { ten: "so_dien_thoai", mo: "thử lấy số điện thoại làm khoá chính", phu: "ho_ten",
        lay: function (h) { return h.dt; }, lp: function (h) { return h.ten; } },
      { ten: "ma_hs", mo: "dùng mã do trường tự đặt", phu: "ho_ten",
        lay: function (h) { return h.ma; }, lp: function (h) { return h.ten; } },
    ];

    var k = 0;        // 0..5 = sáu trường, 6..8 = ba lần thử khoá chính
    var sai = false;  // đang xem kiểu sai của trường hiện tại?

    var node = MH.el(MH.khung("Thiết kế bảng HOC_SINH — chọn sai kiểu dữ liệu thì hỏng ở đâu?",
      "Mỗi trường phải khai <b>tên</b> và <b>kiểu dữ liệu</b>. Bấm “Bước tiếp” để đi từng trường, hoặc " +
      "bấm thẳng vào tên trường. Tích ô bên dưới để <b>chọn kiểu sai</b> — em sẽ thấy hậu quả thật, " +
      "không phải nghe kể.",
      '<div class="mh7-ds" data-mh="ds"></div>' +
      '<label class="mh7-tick" data-mh="tick" style="margin:10px 0 2px">' +
      '<input type="checkbox" data-mh="sai"> chọn <b>kiểu sai</b> cho trường này</label>' +
      '<div class="mh4-cuon" data-mh="bang" style="margin-top:8px"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);
    var oSai = node.querySelector('[data-mh="sai"]');

    function ngay(s) { var p = s.split("/"); return new Date(+p[2], +p[1] - 1, +p[0]); }
    function tuoi(s) {
      var d = ngay(s), h = new Date(), t = h.getFullYear() - d.getFullYear();
      if (h.getMonth() < d.getMonth() || (h.getMonth() === d.getMonth() && h.getDate() < d.getDate())) t--;
      return t;
    }
    function tb(ds) {
      var s = 0, i;
      for (i = 0; i < ds.length; i++) s += ds[i];
      return (s / ds.length).toFixed(2);
    }
    function bang(th, hang) {
      return '<table class="mh4-b"><tr>' + th.map(function (c) {
        return "<th" + (c.c ? ' class="' + c.c + '"' : "") + ">" + esc(c.t) + "</th>";
      }).join("") + "</tr>" + hang.map(function (r) {
        return "<tr>" + r.map(function (o) {
          return "<td" + (o.c ? ' class="' + o.c + '"' : "") + ">" + esc(o.t) + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</table>";
    }

    function veDs() {
      var o = node.querySelector('[data-mh="ds"]');
      var ds = k <= 5 ? TR : KHOA, moc = k <= 5 ? 0 : 6;
      o.innerHTML = ds.map(function (m, i) {
        return '<div class="mh7-m' + (i + moc === k ? " nay" : "") + '" data-i="' + (i + moc) + '">' +
          "<b>" + esc(m.ten) + "</b><small>" + esc(m.mo + (m.dung ? " · kiểu đúng: " + m.dung : "")) +
          "</small></div>";
      }).join("");
      /* innerHTML vừa ghi đè nên phải gắn lại onclick sau MỖI lần vẽ. */
      var ms = o.querySelectorAll(".mh7-m"), i;
      for (i = 0; i < ms.length; i++) {
        ms[i].onclick = function () { k = +this.getAttribute("data-i"); sai = false; ve(); };
      }
    }

    function ve() {
      veDs();
      var canh = "", dem = "", hl = "", nhan = "";
      node.querySelector('[data-mh="tick"]').style.display = k <= 5 ? "" : "none";
      oSai.checked = sai;

      if (k <= 5) {
        var t = TR[k], kieu = sai ? t.sai : t.dung;
        dem = "Trường <b>" + esc(t.ten) + "</b> · kiểu đang chọn: <b>" + esc(kieu) + "</b>";

        if (k <= 1) {
          var lay = k === 0 ? "ma" : "ten";
          hl = bang([{ t: "Em gõ vào ô " + t.ten }, { t: "Kiểu " + kieu + " nhận được gì" }],
            HS.map(function (h) {
              return [{ t: h[lay] }, sai ? { t: "lỗi — kiểu số không chứa được chữ", c: "mh8-lech" }
                : { t: h[lay] }];
            }));
          if (sai) {
            canh = "Cả cột <b>không nhập nổi một dòng nào</b>. Hễ giá trị có chữ thì kiểu bắt buộc là Text.";
          }
          nhan = sai
            ? (k === 0
              ? "Vừa đổi sang <b>Number</b>: mã “HS01” có hai chữ HS ở đầu, kiểu số không chứa được chữ " +
                "nên nhập vào là báo lỗi."
              : "Họ tên toàn chữ, để <b>Number</b> thì không có gì lọt vào bảng cả.")
            : (k === 0
              ? "<b>ma_hs</b> để <b>Text</b> vì mã có chữ, dù nhìn qua tưởng là “số thứ tự”. Lát nữa " +
                "chính trường này sẽ được chọn làm <b>khoá chính</b>."
              : "<b>ho_ten</b> để <b>Text</b> — dễ. Nhưng nhớ: Text chỉ so <b>mặt chữ</b>, không cộng " +
                "trừ và không sắp theo thời gian được. Hai trường sau hỏng đúng chỗ đó.");

        } else if (k === 2) {
          /* Sắp xếp THẬT hai kiểu: một bên so mốc thời gian, một bên so từng kí tự. */
          var dg = HS.slice().sort(function (a, b) { return ngay(a.ns) - ngay(b.ns); });
          var dv = HS.slice().sort(function (a, b) { return a.ns < b.ns ? -1 : a.ns > b.ns ? 1 : 0; });
          hl = bang([{ t: "Học sinh" }, { t: "ngay_sinh — máy sắp tăng dần" }, { t: "Tuổi máy tính ra" }],
            (sai ? dv : dg).map(function (h, i) {
              var lech = sai && h.ns !== dg[i].ns;   // đứng sai chỗ so với thứ tự thời gian thật
              return [{ t: h.ten }, { t: h.ns, c: lech ? "mh8-lech" : "" },
                sai ? { t: "không tính được", c: "mh8-lech" } : { t: tuoi(h.ns) + " tuổi" }];
            }));
          if (sai) {
            canh = "Bạn sinh <b>tháng 12</b> lại bị xếp lên đầu, bạn sinh <b>tháng 1</b> tụt xuống dưới " +
              "— danh sách theo tuổi coi như bỏ. Và Text thì không trừ ra được tuổi.";
          }
          nhan = sai
            ? "Để <b>Text</b>, máy so từng kí tự từ trái sang: “02/12/2007” bắt đầu bằng 0 nên đứng " +
              "trước “10/01/2007”. Thứ tự sai thật, ngay trên bảng."
            : "Kiểu <b>Date/Time</b>: máy hiểu đây là mốc thời gian nên sắp đúng trục thời gian, và lấy " +
              "hôm nay trừ đi là ra tuổi.";

        } else if (k === 3) {
          var hong = 0;
          hl = bang([{ t: "Học sinh" }, { t: "Số thật của bạn" }, { t: "Kiểu " + kieu + " lưu thành" }],
            HS.map(function (h) {
              if (!h.dt) return [{ t: h.ten }, { t: "(không có)" }, { t: "(trống)" }];
              /* Không viết sẵn kết quả — cho Number() chạy thật để số 0 tự rụng. */
              var luu = sai ? String(Number(h.dt)) : h.dt;
              if (luu !== h.dt) hong++;
              return [{ t: h.ten }, { t: h.dt }, { t: luu, c: luu !== h.dt ? "mh8-lech" : "" }];
            }));
          if (sai) {
            dem += " · số bị hỏng: <b>" + hong + "</b>/3";
            canh = "Với máy, <b>0912345678</b> và <b>912345678</b> là <b>cùng một giá trị số</b> nên số " +
              "0 đầu bị bỏ đi luôn. Gọi theo số đó thì không ai nghe máy.";
          }
          nhan = sai
            ? "Đây là cái bẫy nặng nhất: chọn <b>Number</b> vì thấy “toàn chữ số”. Nhưng số điện thoại " +
              "chẳng bao giờ đem cộng trừ — nó là <b>dãy kí tự</b>, phải để Text."
            : "<b>Text</b> giữ nguyên từng kí tự nên số 0 ở đầu còn đủ. Quy tắc: chỉ để Number khi thật " +
              "sự cần <b>tính toán</b> trên giá trị đó.";

        } else if (k === 4) {
          var thuc = [], luuDs = [];
          hl = bang([{ t: "Học sinh" }, { t: "Điểm thật" }, { t: "Kiểu " + kieu + " lưu thành" }],
            HS.map(function (h) {
              var l = sai ? Math.round(h.d) : h.d;   // làm tròn thật, không ghi sẵn kết quả
              thuc.push(h.d); luuDs.push(l);
              return [{ t: h.ten }, { t: h.d.toFixed(2) },
                { t: l.toFixed(2), c: l !== h.d ? "mh8-lech" : "" }];
            }).concat([[{ t: "Điểm TB cả lớp" }, { t: tb(thuc) },
              { t: tb(luuDs), c: tb(luuDs) !== tb(thuc) ? "mh8-lech" : "" }]]));
          if (sai) {
            canh = "Điểm 8.5 thành <b>9</b>, 6.8 thành <b>7</b> — phần thập phân mất hẳn, không lấy lại " +
              "được. Điểm trung bình cả lớp cũng lệch theo.";
          }
          nhan = sai
            ? "Kiểu số <b>nguyên</b> không có chỗ chứa phần thập phân nên máy làm tròn ngay lúc lưu. Xếp " +
              "hạng lớp từ đây là sai."
            : "Điểm có phần thập phân nên phải chọn <b>Number kiểu thực</b>. Cùng là “số” nhưng nguyên " +
              "và thực là hai lựa chọn khác nhau trong danh sách kiểu.";

        } else {
          var demMay = 0, demThat = 0;
          hl = bang([{ t: "Học sinh" }, { t: "Ô da_nop_hs" }, { t: "Máy có đếm được không" }],
            HS.map(function (h, i) {
              if (h.nop === "Yes") demThat++;
              if (!sai) return [{ t: h.ten }, { t: h.nop }, { t: "đếm được" }];
              /* Máy chỉ đếm ô khớp đúng chuỗi "Rồi" — mọi cách ghi khác đều rơi. */
              var v = VAN_NOP[i], ok = v === "Rồi";
              if (ok) demMay++;
              return [{ t: h.ten }, { t: v, c: ok ? "" : "mh8-lech" },
                { t: ok ? "đếm được" : "không khớp — bỏ sót", c: ok ? "" : "mh8-lech" }];
            }));
          dem += " · máy đếm “đã nộp”: <b>" + (sai ? demMay : demThat) + "</b>, thực tế <b>" +
            demThat + "</b> bạn";
          if (sai) {
            canh = "Người ghi “Rồi”, người ghi “co”, người ghi “0” — cùng một ý mà máy coi là ba giá " +
              "trị khác nhau nên đếm thiếu.";
          }
          nhan = sai
            ? "Để <b>Text</b> thì ô này gõ gì cũng được, mỗi người một kiểu, và câu hỏi “bao nhiêu bạn " +
              "đã nộp?” trả lời sai."
            : "Kiểu <b>Yes/No</b> chỉ cho hai giá trị, không ai gõ lệch được, nên đếm và lọc luôn chính xác.";
        }

      } else {
        var kh = KHOA[k - 6];
        var gt = HS.map(kh.lay), trung = 0, rong = 0;
        var lop = gt.map(function (v, i) {
          if (v === "") { rong++; return "mh8-khoa mh8-lech"; }
          for (var j = 0; j < gt.length; j++) {
            if (j !== i && gt[j] === v) { trung++; return "mh8-khoa mh8-trung"; }
          }
          return "mh8-khoa";
        });
        hl = bang([{ t: kh.ten, c: "mh8-khoa" }, { t: kh.phu }, { t: "diem_tb" }],
          HS.map(function (h, i) {
            return [{ t: gt[i] === "" ? "(để trống)" : gt[i], c: lop[i] }, { t: kh.lp(h) },
              { t: h.d.toFixed(2) }];
          }));
        dem = "Khoá chính <b>" + esc(kh.ten) + "</b> · ô bị trùng: <b>" + trung + "</b> · ô bỏ trống: <b>" +
          rong + "</b>";
        if (k === 6) {
          canh = "Hai bạn <b>trùng tên</b>. Đặt khoá chính ở đây thì phần mềm <b>không cho lưu</b> bản " +
            "ghi thứ hai — mà bạn ấy vẫn là một học sinh có thật.";
          nhan = "Lấy <b>ho_ten</b> làm khoá chính: hỏng ngay ở bản ghi thứ ba. Tên người không bao giờ " +
            "chắc chắn duy nhất.";
        } else if (k === 7) {
          canh = "Bạn HS03 <b>không có điện thoại</b> nên ô này rỗng, mà khoá chính thì <b>không được " +
            "rỗng</b>. Bản ghi đó không vào bảng được.";
          nhan = "Lấy <b>so_dien_thoai</b> làm khoá chính: không trùng thật, nhưng lại có ô <b>bỏ " +
            "trống</b> — cũng trượt.";
        } else {
          nhan = "Lấy <b>ma_hs</b>: không ô nào trùng, không ô nào rỗng. Trường tự cấp mã nên bạn nào " +
            "cũng có, và mã không đổi.";
        }
      }

      node.querySelector('[data-mh="bang"]').innerHTML = hl;
      node.querySelector('[data-mh="dem"]').innerHTML = dem;
      var oC = node.querySelector('[data-mh="canh"]');
      oC.hidden = !canh; oC.innerHTML = canh;
      var oG = node.querySelector('[data-mh="ghi"]');
      oG.hidden = k !== 8;
      oG.className = "mh7-ghi xong";
      oG.innerHTML = k === 8
        ? "Khoá chính phải thoả <b>hai</b> điều: <b>không trùng</b> và <b>không rỗng</b>. Dữ liệu của " +
          "con người — tên, số điện thoại, email — đều có thể trùng hoặc thiếu, nên chắc ăn nhất là một " +
          "<b>mã do trường tự đặt</b>. Kiểu dữ liệu cũng vậy: chọn theo <b>việc sẽ làm với dữ liệu</b> " +
          "(sắp xếp? tính toán? đếm?), không chọn theo hình dáng bề ngoài của giá trị."
        : "";
      loi(nhan);
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      /* Trường nào có bẫy thì bước tiếp lật sang kiểu sai trước, rồi mới đi tiếp. */
      if (k <= 5 && !sai) { sai = true; ve(); return; }
      if (k >= 8) {
        loi("Hết bài rồi. Bấm vào tên trường ở trên để xem lại chỗ nào hỏng, hoặc “Làm lại”.");
        return;
      }
      k++; sai = false; ve();
    };
    oSai.onchange = function () { sai = this.checked; ve(); };

    function lamLai() { k = 0; sai = false; ve(); }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-04 · KHOÁ NGOÀI VÀ LIÊN KẾT GIỮA CÁC BẢNG
   *
   *  NGỘ NHẬN chính: học sinh đặt khoá ngoài NGƯỢC — nhét ma_hs vào bảng LOP,
   *  vì nghĩ "bảng chính thì giữ khoá". Chữ nghĩa không sửa nổi, phải cho các
   *  em bấm vào một lớp và nhìn thấy NHIỀU dòng học sinh cùng sáng lên: chỉ
   *  bảng phía nhiều mới chứa nổi liên kết đó.
   * ================================================================ */
  MH.dangKy("U11-04", function (host) {
    /* Cố ý để ba lớp có sĩ số LỆCH NHAU (3, 2, 1): giá trị khoá ngoài lặp lại
       khác nhau ở mỗi lớp thì mới thấy "trùng lặp là bình thường". */
    var LOP = [
      ["12A1", "Nguyễn Thu Hà", "P.201"],
      ["12A2", "Trần Minh Đức", "P.202"],
      ["12A3", "Lê Thị Vân", "P.305"],
    ];
    var HS = [
      ["HS01", "Trần Vân An", "12A1"],
      ["HS02", "Lê Hoàng Bình", "12A2"],
      ["HS03", "Phạm Ngọc Chi", "12A1"],
      ["HS04", "Đỗ Quang Duy", "12A3"],
      ["HS05", "Vũ Khánh Linh", "12A1"],
      ["HS06", "Ngô Bảo Nam", "12A2"],
    ];
    var MOI = ["HS07", "Bùi Gia Huy"];
    var CUOI = 5;
    var buoc, chon;

    var node = MH.el(MH.khung("Khoá ngoài: nối HOC_SINH về LOP theo quan hệ một–nhiều",
      "Hai bảng rời nhau thì không ai biết bạn nào học lớp nào. Em sẽ đặt <b>khoá ngoài</b> vào bảng " +
      "HOC_SINH, rồi <b>bấm vào một dòng ở bảng LOP</b> để thấy cả nhóm học sinh của lớp đó sáng lên.",
      '<div data-mh="san"></div>' +
      '<div class="mh8-dem" data-mh="dem"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label for="mhU4ml">Thêm học sinh ' + MOI[0] + ' với ma_lop =</label>' +
      '<input class="mh-o-nhap hep" id="mhU4ml" data-mh="ml" value="12Z">'));

    var loi = loiCua(node);
    var san = node.querySelector('[data-mh="san"]');
    var oMl = node.querySelector('[data-mh="ml"]');

    function ml() { return oMl.value.replace(/^\s+|\s+$/g, ""); }
    function coLop(ma) {
      for (var i = 0; i < LOP.length; i++) if (LOP[i][0] === ma) return true;
      return false;
    }
    function hopLe() { return coLop(ml()); }

    /* MỘT nguồn duy nhất cho cả bảng lẫn bộ đếm: dòng mới chỉ được nhập vào
       danh sách khi khoá ngoài của nó hợp lệ, nên sĩ số hiện ra luôn đúng bằng
       số dòng đang nhìn thấy — không có con số nào gán cứng. */
    function dsHS() {
      var d = HS.slice();
      if (buoc >= 4) d.push([MOI[0], MOI[1], ml(), true]);
      return d;
    }
    function siSo(ma) {
      var d = dsHS(), n = 0, i;
      for (i = 0; i < d.length; i++) {
        if (d[i][2] === ma && !(d[i][3] && !hopLe())) n++;
      }
      return n;
    }

    function bangLop() {
      var h = '<div><h5>LOP — phía MỘT</h5><table class="mh4-b"><tr>' +
        '<th class="mh8-khoa">ma_lop</th><th>gv_chu_nhiem</th><th>phong_hoc</th></tr>';
      for (var i = 0; i < LOP.length; i++) {
        var r = LOP[i];
        h += '<tr data-ma="' + esc(r[0]) + '"' + (buoc >= 2 ? ' style="cursor:pointer"' : "") +
          ' class="' + (buoc >= 2 && r[0] === chon ? "nay" : "") + '">' +
          '<td class="mh8-khoa">' + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" +
          esc(r[2]) + "</td></tr>";
      }
      return h + "</table></div>";
    }

    function bangHS() {
      var co = buoc >= 1, d = dsHS(), i;
      var h = '<div><h5>HOC_SINH — phía NHIỀU' + (co ? " (chứa khoá ngoài)" : "") +
        '</h5><table class="mh4-b"><tr><th class="mh8-khoa">ma_hs</th><th>ho_ten</th>' +
        (co ? '<th class="mh8-khoa">ma_lop</th>' : "") + "</tr>";
      for (i = 0; i < d.length; i++) {
        var r = d[i], moi = !!r[3], xau = moi && !hopLe();
        var lop = xau ? "rac" : (buoc >= 2 && r[2] === chon ? "khop" : (moi ? "nay" : ""));
        h += '<tr class="' + lop + '"><td class="mh8-khoa">' + esc(r[0]) + "</td><td>" +
          esc(r[1]) + "</td>" +
          (co ? '<td class="mh8-khoa' + (xau ? " mh8-lech" : "") + '">' + esc(r[2]) + "</td>" : "") +
          "</tr>";
      }
      return h + "</table></div>";
    }

    function ve() {
      var h = '<div class="mh4-hai">' + bangLop() + bangHS() + "</div>", i;
      if (buoc >= 4 && !hopLe()) {
        h += '<div class="mh8-canh">Hệ quản trị <b>từ chối</b> dòng ' + esc(MOI[0]) +
          ": giá trị <b>ma_lop = " + (esc(ml()) || "(rỗng)") + "</b> không có ở bảng LOP. Khoá ngoài " +
          "chỉ nhận những giá trị <b>đã tồn tại</b> trong khoá chính của bảng nó trỏ tới — đó mới là ý " +
          "nghĩa thật của liên kết, chứ không phải chỉ đặt trùng tên cột.</div>";
      }
      san.innerHTML = h;

      var dem;
      if (buoc === 0) {
        dem = "LOP: <b>" + LOP.length + "</b> dòng · HOC_SINH: <b>" + HS.length +
          "</b> dòng · số cột nối hai bảng: <b>0</b>";
      } else if (buoc === 1) {
        dem = "Khoá ngoài <b>HOC_SINH.ma_lop</b> &rarr; khoá chính <b>LOP.ma_lop</b>";
      } else {
        var ds = [];
        for (i = 0; i < LOP.length; i++) ds.push(esc(LOP[i][0]) + ": <b>" + siSo(LOP[i][0]) + "</b>");
        dem = "Lớp <b>" + esc(chon) + "</b> có <b>" + siSo(chon) + "</b> học sinh · sĩ số từng lớp — " +
          ds.join(" · ");
      }
      node.querySelector('[data-mh="dem"]').innerHTML = dem;

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < CUOI;
      ghi.className = "mh7-ghi xong";
      if (buoc >= CUOI) {
        ghi.innerHTML = "Vì sao không chép luôn tên lớp, sĩ số, tên giáo viên chủ nhiệm vào bảng " +
          "HOC_SINH? Vì khi ấy <b>" + HS.length + "</b> học sinh sẽ chép lại thông tin lớp <b>" +
          HS.length + "</b> lần. Lớp 12A1 đổi giáo viên chủ nhiệm là em phải sửa <b>" + siSo("12A1") +
          "</b> dòng, sót một dòng thì cùng một lớp lại có hai tên giáo viên khác nhau. Còn sĩ số thì " +
          "<b>đếm ra được</b> từ khoá ngoài, lưu thêm chỉ để sai.<br><br>Ba điều phải nhớ cho đúng: " +
          "<b>(1)</b> khoá ngoài nằm ở bảng phía <b>NHIỀU</b> (HOC_SINH), trỏ về khoá chính ở bảng phía " +
          "<b>MỘT</b> (LOP) — đặt ngược, nhét ma_hs vào bảng LOP, là hỏng thiết kế vì một lớp có nhiều " +
          "học sinh mà một ô chỉ chứa được một mã. <b>(2)</b> Khoá ngoài <b>không phải</b> khoá chính " +
          "của bảng chứa nó: nó được phép <b>trùng lặp</b>, 12A1 lặp " + siSo("12A1") + " lần là bình " +
          "thường. <b>(3)</b> Giá trị khoá ngoài <b>phải có thật</b> ở bảng được trỏ tới.";
      }
    }

    function loiThem() {
      if (hopLe()) {
        return "Nhận dòng mới: <b>" + esc(MOI[0]) + "</b> có ma_lop = <b>" + esc(ml()) +
          "</b> — giá trị này <b>có thật</b> ở bảng LOP nên liên kết đứng vững. Sĩ số lớp <b>" +
          esc(ml()) + "</b> tăng lên <b>" + siSo(ml()) + "</b>, tự đếm chứ không ai gõ tay.";
      }
      return "Bị từ chối: <b>" + (esc(ml()) || "(rỗng)") + "</b> không phải mã lớp nào cả. Khoá ngoài " +
        "chỉ nhận giá trị <b>đã có</b> ở LOP.ma_lop. Em sửa ô trên thành <b>12A2</b> xem hệ quản trị " +
        "nhận dòng đó ngay.";
    }

    function loiBuoc() {
      if (buoc === 1) {
        return "Em vừa thêm cột <b>ma_lop</b> vào HOC_SINH và khai nó là <b>khoá ngoài</b> trỏ về " +
          "LOP.ma_lop. Chú ý chỗ này: khoá ngoài đặt ở bảng phía <b>NHIỀU</b>. Nếu làm ngược — thêm cột " +
          "ma_hs vào bảng LOP — thì mỗi lớp chỉ ghi được <b>một</b> học sinh, sai ngay từ ý tưởng.";
      }
      if (buoc === 2) {
        return "Bấm thử các dòng khác ở bảng LOP. Đang chọn <b>" + esc(chon) + "</b>: <b>" + siSo(chon) +
          "</b> dòng bên HOC_SINH sáng lên. Đó là <b>một</b> lớp có <b>nhiều</b> học sinh; ngược lại " +
          "mỗi học sinh chỉ có <b>một</b> ô ma_lop nên thuộc <b>một</b> lớp duy nhất.";
      }
      if (buoc === 3) {
        return "Nhìn kĩ cột ma_lop: <b>" + esc(chon) + "</b> xuất hiện <b>" + siSo(chon) + "</b> lần. " +
          "Khoá ngoài <b>được phép trùng</b> — nó không phải khoá chính của HOC_SINH. Khoá chính ở đây " +
          "là <b>ma_hs</b>, và chỉ ma_hs mới buộc không trùng, không rỗng.";
      }
      if (buoc === 4) return loiThem();
      if (buoc === CUOI) {
        return "Chốt lại: liên kết không phải là gạch một mũi tên cho đẹp sơ đồ, mà là lời cam kết của " +
          "hệ quản trị — mọi ma_lop trong HOC_SINH đều phải chỉ tới một lớp có thật.";
      }
      return "Hai bảng đang <b>rời rạc</b>: LOP biết lớp nào có giáo viên nào, HOC_SINH biết tên từng " +
        "bạn, nhưng không có cột nào cho biết bạn nào học lớp nào. Bấm “Bước tiếp”.";
    }

    /* Gắn MỘT lần trên khung chứa (san còn nguyên, chỉ ruột bị vẽ lại), nên
       không phải gắn lại onclick cho từng dòng sau mỗi lần ve(). */
    san.onclick = function (e) {
      if (buoc < 2) return;
      var tr = e.target && e.target.closest ? e.target.closest("tr[data-ma]") : null;
      if (!tr) return;
      chon = tr.getAttribute("data-ma");
      ve();
      loi("Chọn lớp <b>" + esc(chon) + "</b>: <b>" + siSo(chon) + "</b> học sinh của lớp này sáng lên " +
        "bên phải — <b>một</b> lớp, <b>nhiều</b> học sinh.");
    };

    /* Ô nhập KHÔNG nối vào ganDatLai: mỗi lần gõ mà nhảy về bước 0 là mất luôn
       phép thử khoá ngoài đang dở. */
    oMl.addEventListener("input", function () {
      if (buoc < 4) return;
      ve();
      loi(loiThem());
    });

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= CUOI) {
        loi("Hết các bước rồi. Em thử gõ lại ô <b>ma_lop</b> ở trên (ví dụ <b>12A2</b>) để xem dòng mới " +
          "được nhận, hoặc bấm “Làm lại”.");
        return;
      }
      buoc++;
      if (buoc === 2 && !chon) chon = LOP[0][0];
      ve();
      loi(loiBuoc());
    };

    function lamLai() {
      buoc = 0; chon = null; oMl.value = "12Z";
      ve();
      loi(loiBuoc());
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  U11-05 · CẬP NHẬT DỮ LIỆU: THÊM, SỬA, XOÁ BẢN GHI (bản ứng dụng)
   *
   *  Bài này KHÔNG gõ SQL — học sinh thao tác trên bảng dữ liệu của phần mềm
   *  quản trị. Ba ngộ nhận phải đánh trúng: (1) hệ quản trị kiểm TRƯỚC khi nhận
   *  chứ không nhận bừa rồi báo sau; (2) sửa xong RỜI KHỎI Ô là đã ghi, không
   *  có nút Lưu nào phải bấm; (3) xoá bản ghi KHÔNG hoàn tác được bằng Ctrl+Z
   *  như văn bản. Chốt lại bằng chuyện phân biệt cập nhật DỮ LIỆU với cập nhật
   *  CẤU TRÚC — đề rất hay hỏi tráo hai thứ này.
   * ================================================================ */
  MH.dangKy("U11-05", function (host) {
    var TONG = 9;
    var GOC = [
      { ma: "M01", ten: "Trần Thu Lan", sach: "Dế Mèn phiêu lưu kí", ngay: "05/09" },
      { ma: "M02", ten: "Lê Minh Hùng", sach: "Số đỏ", ngay: "07/09" },
      { ma: "M03", ten: "Phạm Gia Bảo", sach: "Tắt đèn", ngay: "07/09" },
      { ma: "M04", ten: "Đỗ Khánh Vy", sach: "Lặng lẽ Sa Pa", ngay: "09/09" },
    ];
    var COT = ["ma", "ten", "sach", "ngay"];
    var ds, log, canh, hop, buoc;

    var node = MH.el(MH.khung("Thêm, sửa, xoá bản ghi — hệ quản trị kiểm những gì trước khi nhận?",
      "Bấm “Bước tiếp” để lần lượt <b>Thêm</b>, <b>Sửa</b>, <b>Xoá</b> ngay trên bảng dữ liệu của phần " +
      "mềm. Chú ý hai chỗ hay nhầm: <b>rời khỏi ô là đã ghi</b>, và <b>xoá rồi thì Ctrl+Z không cứu " +
      "được</b>.",
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="bang"></table></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh10-out" data-mh="hop" hidden></div>' +
      '<div class="mh7-ds" data-mh="ds" style="margin-top:11px"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>', ""));

    var loi = loiCua(node);

    /* Đếm THẬT từ dữ liệu: chỉ những dòng co=true mới nằm trong bảng. Dòng bị
       từ chối và dòng vừa xoá vẫn hiện trên màn cho học sinh nhìn, nhưng không
       được tính — đó chính là điều cần thấy. */
    function demBanGhi() {
      var n = 0, i;
      for (i = 0; i < ds.length; i++) if (ds[i].co) n++;
      return n;
    }
    function tim(ma) {
      for (var i = 0; i < ds.length; i++) if (ds[i].ma === ma && ds[i].co) return ds[i];
      return null;
    }
    function xoaLop() {
      for (var i = 0; i < ds.length; i++) { if (ds[i].lop !== "xoa") ds[i].lop = ""; ds[i].lech = ""; }
    }
    function boRac() {
      var g = [], i;
      for (i = 0; i < ds.length; i++) if (ds[i].lop !== "rac") g.push(ds[i]);
      ds = g;
    }
    function ghiLog(t, s) { log.push({ t: t, s: s }); }

    function ve() {
      var h = '<tr><th class="mh8-khoa">ma_muon</th><th>ho_ten</th><th>ten_sach</th>' +
        "<th>ngay_muon</th></tr>";
      for (var i = 0; i < ds.length; i++) {
        var r = ds[i];
        h += '<tr class="' + esc(r.lop) + '">';
        for (var j = 0; j < COT.length; j++) {
          var f = COT[j], c = f === "ma" ? "mh8-khoa" : "";
          if (r.lech === f) c += (c ? " " : "") + "mh8-lech";
          h += "<td" + (c ? ' class="' + c + '"' : "") + ">" +
            esc(r[f] === "" ? "(để trống)" : r[f]) + "</td>";
        }
        h += "</tr>";
      }
      node.querySelector('[data-mh="bang"]').innerHTML = h;

      node.querySelector('[data-mh="dem"]').innerHTML =
        "Bảng THE_MUON hiện có <b>" + demBanGhi() + "</b> bản ghi";

      var oCanh = node.querySelector('[data-mh="canh"]');
      oCanh.hidden = !canh;
      if (canh) oCanh.innerHTML = canh;

      var oHop = node.querySelector('[data-mh="hop"]');
      oHop.hidden = !hop;
      if (hop) oHop.innerHTML = hop;

      node.querySelector('[data-mh="ds"]').innerHTML = log.map(function (o, i) {
        return '<div class="mh7-m' + (i === log.length - 1 ? " nay" : "") + '"><b class="van">' +
          o.t + "</b><small>" + o.s + "</small></div>";
      }).join("");

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < TONG;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Câu đề hay đánh tráo: <b>cập nhật DỮ LIỆU</b> là thêm / sửa / xoá <b>bản " +
          "ghi</b> — tức là thêm bớt <b>dòng</b>, đổi giá trị trong <b>ô</b>; cấu trúc bảng không đổi. " +
          "Còn <b>cập nhật CẤU TRÚC</b> là thêm hoặc xoá <b>trường</b>, đổi <b>kiểu dữ liệu</b>, đặt lại " +
          "<b>khoá chính</b> — làm ở chế độ thiết kế và ảnh hưởng <b>mọi bản ghi</b> cùng lúc. Xoá một " +
          "bản ghi thì mất một học sinh; xoá một trường thì mất giá trị đó của <b>tất cả</b> học sinh. " +
          "Ba điều nhớ kèm: hệ quản trị <b>kiểm trước khi nhận</b>, sửa xong <b>rời ô là đã ghi</b>, và " +
          "xoá bản ghi <b>không hoàn tác</b> được — chỉ phục hồi từ bản sao lưu.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TONG) {
        loi("Đã đi hết <b>" + TONG + "</b> bước rồi. Bấm “Làm lại” để xem lại từ đầu.");
        return;
      }
      buoc++;
      canh = ""; hop = "";
      var r;

      if (buoc === 1) {
        xoaLop();
        ds.push({ ma: "M05", ten: "Nguyễn Hà My", sach: "Cho tôi xin một vé đi tuổi thơ",
          ngay: "11/09", co: true, lop: "khop", lech: "" });
        ghiLog("Thêm bản ghi M05", "Hợp lệ — được ghi vào bảng");
        loi("Em điền vào dòng trống cuối bảng rồi chuyển sang bản ghi khác. Hệ quản trị kiểm hai điều: " +
          "mã <b>M05</b> <b>chưa trùng</b> khoá chính nào, các trường bắt buộc <b>đều có giá trị</b> → " +
          "nhận. Dòng mới sáng xanh, bảng lên <b>" + demBanGhi() + "</b> bản ghi.");
      } else if (buoc === 2) {
        xoaLop();
        ds.push({ ma: "M03", ten: "Vũ Đình Nam", sach: "Chí Phèo", ngay: "12/09",
          co: false, lop: "rac", lech: "ma" });
        canh = "<b>Không thêm được bản ghi.</b> Giá trị <b>M03</b> ở trường khoá chính " +
          "<code>ma_muon</code> đã có ở một bản ghi khác. Khoá chính phải <b>duy nhất</b>.";
        ghiLog("Thêm bản ghi M03", "Bị từ chối — trùng khoá chính");
        loi("Dòng vừa gõ <b>bị đỏ và không vào bảng</b>. Chú ý thứ tự: hệ quản trị <b>kiểm trước, nhận " +
          "sau</b> — chứ không phải nhận bừa rồi lát nữa mới báo. Vì thế số bản ghi vẫn là <b>" +
          demBanGhi() + "</b>, đúng bằng lúc trước.");
      } else if (buoc === 3) {
        boRac(); xoaLop();
        ds.push({ ma: "M06", ten: "", sach: "Mắt biếc", ngay: "12/09",
          co: false, lop: "rac", lech: "ten" });
        canh = "<b>Không thêm được bản ghi.</b> Trường <code>ho_ten</code> là <b>trường bắt buộc</b> " +
          "nhưng đang <b>bỏ trống</b>. Điền đủ rồi mới lưu được.";
        ghiLog("Thêm bản ghi M06", "Bị từ chối — bỏ trống trường bắt buộc");
        loi("Lần này mã <b>M06</b> chẳng trùng ai, nhưng vẫn bị chặn vì <b>để trống ô bắt buộc</b>. Hai " +
          "lần từ chối liên tiếp cho thấy: các <b>ràng buộc</b> đặt lúc thiết kế bảng chính là hàng rào " +
          "giữ cho dữ liệu không bẩn.");
      } else if (buoc === 4) {
        boRac(); xoaLop();
        r = tim("M02");
        r.ngay = "08/09"; r.lop = "nay";
        hop = "<div>Con trỏ đang ở ô ngay_muon của bản ghi M02</div>" +
          '<div class="loi">Chưa ghi xuống cơ sở dữ liệu — em vẫn đang gõ trong ô</div>';
        ghiLog("Sửa ô ngay_muon của M02", "Đang gõ, con trỏ còn trong ô");
        loi("Bạn Hùng báo ghi nhầm ngày. Em <b>nhấp đúp vào đúng ô</b> <code>ngay_muon</code> của " +
          "<b>M02</b>, xoá 07/09, gõ <b>08/09</b>. Lúc này con trỏ <b>vẫn nằm trong ô</b> nên thay đổi " +
          "mới chỉ ở trên màn hình.");
      } else if (buoc === 5) {
        xoaLop();
        r = tim("M02"); r.lop = "khop";
        hop = "<div>Đã ghi bản ghi M02 vào bảng THE_MUON</div>" +
          "<div>ngay_muon: 07/09  →  08/09</div>";
        ghiLog("Rời khỏi ô", "Ghi ngay — không cần bấm nút Lưu");
        loi("Em nhấn <b>Tab</b> (hoặc bấm sang dòng khác) là <b>rời khỏi ô</b> — và ngay lúc đó dữ liệu " +
          "<b>đã ghi vào cơ sở dữ liệu</b>. <b>Không có nút Lưu nào phải bấm</b> như khi soạn văn bản. " +
          "Nhiều em tưởng chưa bấm Lưu thì chưa sao, rồi sửa nhầm lúc nào không biết.");
      } else if (buoc === 6) {
        xoaLop();
        r = tim("M02"); r.lop = "nay"; r.lech = "ma";
        canh = "<b>Không đổi được khoá chính M02.</b> Bảng <code>CHI_TIET_TRA</code> còn <b>2 bản ghi</b> " +
          "đang tham chiếu tới mã này qua khoá ngoài. Đổi mã thì các bản ghi đó <b>mất chỗ trỏ</b>.";
        ghiLog("Sửa khoá chính M02 thành M09", "Bị chặn — bảng khác đang trỏ tới");
        loi("Sửa một ô thường chỉ ảnh hưởng <b>một bản ghi</b>. Nhưng sửa <b>khoá chính</b> thì khác " +
          "hẳn: các bảng khác đang <b>trỏ vào nó</b>. Muốn đổi mã thật thì phải xử lí các bảng liên quan " +
          "trước, không phải cứ gõ đè lên là xong.");
      } else if (buoc === 7) {
        xoaLop();
        r = tim("M04"); r.lop = "nay";
        hop = "<div>Xác nhận xoá</div><div>Em sắp xoá 1 bản ghi: M04</div>" +
          '<div class="loi">Sau khi xoá sẽ KHÔNG thể hoàn tác thao tác này</div>' +
          "<div>[ Có ]   [ Không ]</div>";
        ghiLog("Xoá bản ghi M04", "Hệ quản trị hỏi xác nhận");
        loi("Em chọn dòng <b>M04</b> rồi bấm Xoá. Phần mềm <b>không xoá ngay</b> mà hiện hộp thoại hỏi " +
          "lại — và nói thẳng là <b>không hoàn tác được</b>. Hộp thoại này là cơ hội cuối để em nhìn " +
          "lại mình đang đứng ở <b>đúng dòng</b> chưa.");
      } else if (buoc === 8) {
        xoaLop();
        r = tim("M04"); r.co = false; r.lop = "xoa";
        hop = "<div>Đã xoá 1 bản ghi khỏi bảng THE_MUON</div>" +
          '<div class="loi">Ctrl+Z: không có tác dụng với bản ghi đã xoá</div>';
        ghiLog("Chọn Có", "Bản ghi biến mất, không lấy lại được");
        loi("Dòng M04 bị gạch ngang và <b>không còn được tính</b>: bảng còn <b>" + demBanGhi() +
          "</b> bản ghi. Đây là chỗ khác hẳn soạn thảo văn bản — <b>Ctrl+Z không cứu được</b>. Muốn lấy " +
          "lại phải <b>phục hồi từ bản sao lưu</b>, nên hãy <b>sao lưu trước khi xoá</b>.");
      } else {
        xoaLop();
        ghiLog("Chốt lại", "Cập nhật dữ liệu khác cập nhật cấu trúc");
        loi("Cả bảy thao tác vừa rồi đều là <b>cập nhật dữ liệu</b> — em chỉ động vào <b>dòng và ô</b>, " +
          "cấu trúc bảng không hề đổi. Đọc kĩ khối ghi chú bên dưới để khỏi nhầm với <b>cập nhật cấu " +
          "trúc</b>.");
      }
      ve();
    };

    function lamLai() {
      ds = GOC.map(function (o) {
        return { ma: o.ma, ten: o.ten, sach: o.sach, ngay: o.ngay, co: true, lop: "", lech: "" };
      });
      log = []; canh = ""; hop = ""; buoc = 0;
      ve();
      loi("Đây là bảng <b>THE_MUON</b> của câu lạc bộ Sách, cột <b>ma_muon</b> là <b>khoá chính</b>. " +
        "Bấm “Bước tiếp” để thử thao tác <b>Thêm</b> đầu tiên.");
    }
    ganDatLai(node, [], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-01 · HỆ ĐIỀU HÀNH VÀ VAI TRÒ CỦA NÓ
   *
   *  NGỘ NHẬN gốc: học sinh tin máy "chạy nhiều chương trình cùng lúc" theo
   *  nghĩa đen. Không lời giảng nào lay được niềm tin đó, vì màn hình đúng là
   *  trông như vậy. Nên minh hoạ này cho nhìn thẳng vào từng lát thời gian:
   *  mỗi lát CHỈ MỘT chương trình giữ CPU, hai cái kia đứng chờ.
   *
   *  Ô tích "tắt hệ điều hành" là đòn chốt: bỏ bộ định thời đi thì chương trình
   *  đầu tiên giữ CPU suốt, hai cái kia đứng ở 0 lát — số 0 đó do thuật toán
   *  tính ra thật, không gán cứng.
   * ================================================================ */
  MH.dangKy("C11-01", function (host) {
    var TEN = ["Trình duyệt", "Nghe nhạc", "Soạn thảo"];
    var VIEC = ["tải thêm được một phần trang", "phát thêm được một đoạn nhạc",
      "hiện thêm được mấy kí tự vừa gõ"];
    var NHIP = [8, 9, 7];      // mỗi lát CPU đẩy tiến độ chương trình lên bấy nhiêu phần trăm
    var LAT = 12;              // đủ để mỗi chương trình được 4 lượt, thấy rõ vòng luân phiên
    var VAI = [
      { ten: "Quản lí bộ nhớ", vd: "chia RAM, chặn ghi lấn",
        giai: "<b>Quản lí bộ nhớ.</b> Hệ điều hành cắt RAM thành từng vùng riêng: Trình duyệt một vùng, " +
          "Nghe nhạc một vùng khác. Nếu Trình duyệt lỡ ghi lấn sang vùng của Nghe nhạc thì hệ điều hành " +
          "<b>chặn lại</b> và chỉ dừng riêng chương trình sai — cả máy không chết theo." },
      { ten: "Quản lí tệp", vd: "thư mục, biết tệp nằm đâu",
        giai: "<b>Quản lí tệp.</b> Em lưu <code>baitap.docx</code> vào thư mục <code>Hoctap</code>. " +
          "Chương trình soạn thảo chỉ cần nói <b>tên tệp</b>; còn tệp nằm ở những khối nào trên ổ đĩa là " +
          "việc của hệ điều hành nhớ. Không có nó thì mỗi chương trình phải tự quản lí từng khối đĩa." },
      { ten: "Quản lí thiết bị", vd: "máy in, bàn phím, trình điều khiển",
        giai: "<b>Quản lí thiết bị.</b> Bấm In, chương trình chỉ gửi cho hệ điều hành câu “in trang " +
          "này”. Hệ điều hành gọi đúng <b>trình điều khiển</b> của máy in đang cắm. Nhờ vậy người viết " +
          "chương trình <b>không cần biết máy in hiệu gì</b> — đổi máy in khác, chương trình vẫn chạy y " +
          "nguyên." },
      { ten: "Giao diện người dùng", vd: "cửa sổ, chuột, dòng lệnh",
        giai: "<b>Giao diện với người dùng.</b> Cửa sổ, biểu tượng, con trỏ chuột, hoặc cửa sổ dòng lệnh " +
          "để gõ câu lệnh — đều do hệ điều hành dựng ra. Đó là chỗ em ra lệnh cho máy mà không phải " +
          "đụng tới phần cứng." },
    ];
    var TONG = LAT + VAI.length;

    var buoc, lat, day;

    var node = MH.el(MH.khung("“Chạy nhiều chương trình cùng lúc” thật ra là gì?",
      "Máy một nhân <b>chỉ làm được một việc tại một thời điểm</b>. Mỗi lần bấm “Bước tiếp” là một " +
      "<b>lát thời gian</b>: hệ điều hành giao CPU cho <b>đúng một</b> chương trình. Nó chuyển qua lại " +
      "nhanh đến mức em tưởng cả ba chạy song song.",
      '<table class="mh4-b" data-mh="bang" style="margin:0 auto"></table>' +
      '<div class="mh9-chu"><span><i class="n1"></i> đang giữ CPU</span>' +
      '<span><i class="cho"></i> đang chờ tới lượt</span>' +
      '<span><i class="hong"></i> đứng im vì không ai chia lượt</span></div>' +
      '<div class="mh10-out" data-mh="out" style="margin:11px 0 0"></div>' +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh9-so" data-mh="vai" style="margin:13px 0 0"></div>' +
      '<div class="mh7-ghi" data-mh="ghi" hidden></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="tat"> tắt hệ điều hành ' +
      "(bỏ bộ định thời)</label>"));

    var loi = loiCua(node);
    var oTat = node.querySelector('[data-mh="tat"]');
    function tat() { return oTat.checked; }
    function tienDo(i) { return Math.min(100, lat[i] * NHIP[i]); }

    /* Chèn khoảng trắng cho cột thẳng hàng trong khung nền tối (khung đó để
       white-space:pre nên khoảng trắng giữ nguyên). */
    function chen(s, n) {
      var t = String(s);
      while (t.length < n) t += " ";
      return t;
    }

    function veBang() {
      var chay = day.length ? day[day.length - 1] : -1;
      var h = "<tr><th>Chương trình</th><th>Số lát đã nhận</th><th>Tiến độ</th></tr>";
      for (var i = 0; i < TEN.length; i++) {
        var treo = tat() && lat[i] === 0 && buoc > 0;
        var lop = i === chay && buoc <= LAT ? "nay" : (treo ? "rac" : "");
        h += '<tr class="' + lop + '"><td>' + esc(TEN[i]) + "</td><td>" + lat[i] + "</td><td>" +
          tienDo(i) + "% · " +
          esc(lat[i] ? VIEC[i] : (treo ? "đứng im, không nhúc nhích" : "chưa chạy")) + "</td></tr>";
      }
      node.querySelector('[data-mh="bang"]').innerHTML = h;
    }

    /* Dải lát thời gian: mỗi dòng một chương trình, mỗi cột một lát. Nhìn ngang
       một dòng thấy chương trình đó được chen vào những lát nào; nhìn dọc một
       cột thấy MỖI LÁT CHỈ CÓ ĐÚNG MỘT chữ X. */
    function veDai() {
      var out = node.querySelector('[data-mh="out"]');
      if (!day.length) {
        out.innerHTML = '<div class="trong">(chưa cấp lát nào — chưa chương trình nào chạm được vào ' +
          "CPU)</div>";
        return;
      }
      var dau = chen("lát", 14), k;
      for (k = 0; k < day.length; k++) dau += chen(k + 1, 3);
      var h = '<div class="trong">' + esc(dau) + "</div>";
      for (var i = 0; i < TEN.length; i++) {
        var d = chen(TEN[i], 14);
        for (k = 0; k < day.length; k++) d += chen(day[k] === i ? "X" : ".", 3);
        var treo = tat() && lat[i] === 0;
        h += '<div class="' + (treo ? "loi" : "") + '">' + esc(d) +
          (treo ? esc("   (đứng im suốt)") : "") + "</div>";
      }
      h += '<div class="trong">' + esc("X: lát CPU của chương trình đó   .: đang chờ") + "</div>";
      out.innerHTML = h;
    }

    function veVai() {
      var h = '<div class="mh9-tb ' + (buoc <= LAT ? "nay" : "xong") + '"><b>' + esc("Điều phối CPU") +
        "</b><small>" + esc("chia lát thời gian, luân phiên") + "</small></div>";
      for (var i = 0; i < VAI.length; i++) {
        var moc = LAT + i + 1;
        var lop = buoc === moc ? "nay" : (buoc > moc ? "xong" : "cho");
        h += '<div class="mh9-tb ' + lop + '"><b>' + esc(VAI[i].ten) + "</b><small>" +
          esc(VAI[i].vd) + "</small></div>";
      }
      node.querySelector('[data-mh="vai"]').innerHTML = h;
    }

    function ve() {
      veBang(); veDai(); veVai();
      var canh = node.querySelector('[data-mh="canh"]');
      canh.hidden = !tat();
      if (tat()) {
        canh.innerHTML = "<b>Đang tắt hệ điều hành.</b> Không ai thu CPU về để chia lại, nên chương " +
          "trình chiếm được CPU trước thì <b>giữ luôn</b>. Hai chương trình kia đứng ở <b>0 lát</b>: " +
          "nhạc đứt tiếng, chữ gõ vào không hiện. Đây chính là việc mà mỗi chương trình sẽ phải <b>tự " +
          "lo lấy</b> nếu máy không có hệ điều hành.";
      }
      node.querySelector('[data-mh="dem"]').innerHTML =
        "Đã cấp <b>" + day.length + "</b>/" + LAT + " lát · CPU một nhân chỉ chạy được <b>một</b> " +
        "chương trình tại một thời điểm";

      var ghi = node.querySelector('[data-mh="ghi"]');
      ghi.hidden = buoc < TONG;
      if (!ghi.hidden) {
        ghi.className = "mh7-ghi xong";
        ghi.innerHTML = "Ba điều phải nhớ cho đúng. <b>(1)</b> Máy <b>một nhân không chạy song song " +
          "thật</b> — nó luân phiên cực nhanh nên mắt người tưởng là cùng lúc. Máy nhiều nhân thì có " +
          "song song thật, nhưng số chương trình đang mở <b>luôn nhiều hơn số nhân</b> nên vẫn phải " +
          "luân phiên. <b>(2)</b> Hệ điều hành là <b>phần mềm</b>, không phải phần cứng — và là <b>phần " +
          "mềm hệ thống</b>, khác phần mềm ứng dụng như trình duyệt hay Word. <b>(3)</b> Không có hệ " +
          "điều hành thì <b>mỗi chương trình phải tự lo hết</b>: tự chia CPU, tự quản RAM, tự biết tệp " +
          "nằm ở khối nào, tự nói chuyện với từng loại máy in.";
      }
    }

    node.querySelector('[data-mh="tien"]').onclick = function () {
      if (buoc >= TONG) {
        loi("Đã đi hết các bước. Bấm “Làm lại” để chạy lại, hoặc tích/bỏ tích ô <b>tắt hệ điều hành</b> " +
          "ở trên để so hai trường hợp.");
        return;
      }
      buoc++;
      if (buoc <= LAT) {
        /* Vòng luân phiên: lát thứ k giao cho chương trình k mod 3. Tắt hệ điều
           hành thì không có ai xoay vòng, chỉ số đứng nguyên ở 0. */
        var idx = tat() ? 0 : (buoc - 1) % TEN.length;
        var truoc = day.length ? day[day.length - 1] : -1;
        day.push(idx);
        lat[idx]++;
        ve();
        if (tat()) {
          loi("Lát <b>" + buoc + "</b>: CPU vẫn nằm trong tay <b>" + esc(TEN[0]) + "</b>. Không có bộ " +
            "định thời thì <b>không ai thu CPU về</b>, nên <b>" + esc(TEN[1]) + "</b> và <b>" +
            esc(TEN[2]) + "</b> vẫn <b>0 lát</b> — nhạc vẫn đứt, chữ gõ vẫn không hiện.");
        } else if (truoc < 0) {
          loi("Lát <b>1</b>: hệ điều hành giao CPU cho <b>" + esc(TEN[idx]) + "</b>. Ngay lúc này hai " +
            "chương trình kia <b>không chạy một câu lệnh nào</b> — chúng chỉ đang chờ.");
        } else {
          loi("Lát <b>" + buoc + "</b>: hệ điều hành <b>thu CPU</b> khỏi <b>" + esc(TEN[truoc]) +
            "</b> (đang làm dở, để nguyên đó) rồi giao cho <b>" + esc(TEN[idx]) + "</b>. Đổi tay xong, " +
            "chỉ mình <b>" + esc(TEN[idx]) + "</b> chạy trong lát này." +
            (buoc % TEN.length === 0 ? " Vừa hết một <b>vòng</b>: cả ba đều đã được một lượt." : ""));
        }
        if (buoc === LAT) {
          loi(tat()
            ? "Hết <b>" + LAT + "</b> lát: <b>" + esc(TEN[0]) + "</b> tiến được <b>" + tienDo(0) +
              "%</b>, hai chương trình kia đứng nguyên <b>0%</b>. Bỏ tích ô ở trên rồi chạy lại để thấy " +
              "hệ điều hành cứu tình hình thế nào. Bấm tiếp để xem các vai trò khác của nó."
            : "Hết <b>" + LAT + "</b> lát: cả ba đều tiến được một ít (" + tienDo(0) + "%, " + tienDo(1) +
              "%, " + tienDo(2) + "%). Máy <b>chưa hề chạy song song</b> — nó chỉ đổi tay " + LAT +
              " lần trong chớp mắt. “Cùng lúc” chính là như vậy. Bấm tiếp để xem các vai trò khác của " +
              "hệ điều hành.");
        }
        return;
      }
      ve();
      loi(VAI[buoc - LAT - 1].giai);
    };

    function lamLai() {
      buoc = 0; lat = [0, 0, 0]; day = [];
      ve();
      loi(tat()
        ? "Đã <b>tắt hệ điều hành</b>: không có bộ định thời. Bấm “Bước tiếp” xem chuyện gì xảy ra với " +
          "hai chương trình còn lại."
        : "Ba chương trình đang mở. Bấm “Bước tiếp” để hệ điều hành cấp <b>lát thời gian</b> đầu tiên.");
    }
    ganDatLai(node, [oTat], lamLai);
    host.appendChild(node); lamLai();
  });

  /* ==================================================================
   *  C11-03 · BÊN TRONG MÁY TÍNH: CPU, BỘ NHỚ VÀ THIẾT BỊ
   *
   *  NGỘ NHẬN nặng nhất của bài không phải "CPU là gì" mà là "RAM mất điện là
   *  mất sạch" — học sinh nào cũng gật đầu lúc học rồi vẫn mất bài vì chưa bấm
   *  Lưu. Nên minh hoạ chạy thật một chương trình trong RAM cho ra kết quả, rồi
   *  cho các em tự tay cắt điện và nhìn kết quả ấy biến mất.
   *
   *  Phần 1 mô phỏng THẬT: giá trị R1 và ô [12] được tính trong vòng lặp, không
   *  viết sẵn — đổi số ở ô [10]/[11] là mọi lời giải thích tự đúng theo.
   * ================================================================ */
  MH.dangKy("C11-03", function (host) {
    /* Tách "chuỗi nằm trong ô nhớ" khỏi "op + toán hạng" chính là để chặng
       GIẢI MÃ có việc thật: đọc một dãy kí tự, tách ra làm gì và với ô nào. */
    var CT = [
      { ma: "LOAD  R1, [10]", op: "LOAD", dc: 10 },
      { ma: "ADD   R1, [11]", op: "ADD", dc: 11 },
      { ma: "STORE R1, [12]", op: "STORE", dc: 12 },
      { ma: "HALT", op: "HALT", dc: null },
    ];
    var DIA = [0, 1, 2, 3, "gap", 10, 11, 12];
    var PHA = ["NẠP LỆNH", "GIẢI MÃ", "THỰC HIỆN"];
    var PHA_MO = [
      "Lấy lệnh ở ô mà PC đang trỏ, cất vào IR",
      "Hiểu lệnh: làm việc gì, với ô nhớ nào",
      "Làm thật: đọc/ghi ô nhớ, tính trên thanh ghi",
    ];
    var BN = [
      { ten: "Thanh ghi",
        mo: "Nằm trong CPU. Nhanh nhất. Cả chip chỉ vài chục ô như R1. Mất điện là mất.",
        mat: "Trống trơn. Mất hết." },
      { ten: "RAM",
        mo: "Nhanh, cỡ vài GB. Chương trình đang chạy nằm ở đây. Mất điện là mất sạch.",
        mat: "Trắng trơn. Chương trình lẫn kết quả bay hết." },
      { ten: "Ổ cứng / SSD",
        mo: "Chậm hơn RAM rất nhiều, nhưng chứa hàng trăm GB. Mất điện vẫn còn.",
        mat: "Còn nguyên. Tệp đã Lưu vẫn nằm đây." },
    ];

    function sao(o) { var m = {}, k; for (k in o) { if (o.hasOwnProperty(k)) m[k] = o[k]; } return m; }

    /* Chạy trọn chương trình MỘT LẦN rồi cất lại từng khung hình. Nhờ vậy học
       sinh bấm tới bấm lui bao nhiêu cũng ra đúng số, mà số thì vẫn do vòng lặp
       tính chứ không phải gõ tay vào lời thoại. */
    function chay() {
      var ram = {}, i;
      for (i = 0; i < CT.length; i++) { ram[i] = CT[i].ma; }
      ram[10] = 7; ram[11] = 5; ram[12] = null;
      var pc = 0, ir = null, r1 = null, kh = [], nhip = 0, dung = false;

      function chup(o) {
        kh.push({ ram: sao(ram), pc: pc, ir: ir, r1: r1, pha: o.pha, doc: o.doc, ghi: o.ghi,
          sang: o.sang || "", nhip: o.nhip, bo: o.bo, xong: o.xong, giai: o.giai });
      }

      chup({ pha: -1, doc: null, ghi: null, nhip: 0,
        giai: "Máy vừa bật. Chương trình đã nằm sẵn trong <b>RAM</b>: bốn lệnh ở ô [0] đến [3], hai số " +
          "liệu ở ô [10] và [11], ô [12] để trống chờ kết quả. <b>PC</b> đang là 0 nghĩa là lệnh sắp " +
          "chạy nằm ở ô [0]. Mỗi lệnh, không trừ lệnh nào, đều phải đi đủ ba chặng." });

      while (!dung && nhip < 12) {
        var dc = pc, l = CT[dc];
        /* --- chặng 1: NẠP LỆNH --- */
        ir = l.ma; pc = dc + 1; nhip++;
        chup({ pha: 0, doc: dc, ghi: null, sang: "PC IR", nhip: nhip,
          giai: "PC đang trỏ ô <b>[" + esc(dc) + "]</b> nên CPU ra RAM lấy đúng ô đó về, cất vào " +
            "<b>IR</b>. Lấy xong PC tự cộng 1 thành <b>" + esc(pc) + "</b>, trỏ sẵn lệnh kế tiếp — CPU " +
            "chưa cần biết lệnh vừa lấy là lệnh gì." });
        /* --- chặng 2: GIẢI MÃ. Cố ý không đổi gì để thấy nó là chặng "hiểu đề" --- */
        nhip++;
        var g2;
        if (l.op === "LOAD") {
          g2 = "CPU nhìn vào IR, tách ra hai phần: việc phải làm là <b>LOAD</b> (chép một số vào thanh " +
            "ghi), số ấy nằm ở ô <b>[" + esc(l.dc) + "]</b>. Chặng này <b>chưa đụng vào RAM, chưa đổi " +
            "R1</b> — mới chỉ là hiểu đề.";
        } else if (l.op === "ADD") {
          g2 = "Tách IR ra: việc là <b>ADD</b> — cộng thêm số ở ô <b>[" + esc(l.dc) + "]</b> vào cái R1 " +
            "đang giữ. Vẫn chưa cộng, mới chỉ <b>biết là phải cộng</b>.";
        } else if (l.op === "STORE") {
          g2 = "Tách IR ra: việc là <b>STORE</b> — chép giá trị trong R1 xuống ô <b>[" + esc(l.dc) +
            "]</b>. Đây là chiều ngược lại của LOAD.";
        } else {
          g2 = "Tách IR ra: <b>HALT</b> — dừng máy. Lệnh này không có toán hạng nên không đụng ô nhớ nào.";
        }
        chup({ pha: 1, doc: null, ghi: null, nhip: nhip, giai: g2 });
        /* --- chặng 3: THỰC HIỆN --- */
        nhip++;
        var doc = null, ghi = null, sang = "", g3, v, cu;
        if (l.op === "LOAD") {
          v = ram[l.dc]; r1 = v; doc = l.dc; sang = "R1";
          g3 = "Giờ mới thật sự làm. CPU đọc ô <b>[" + esc(l.dc) + "]</b>, thấy số <b>" + esc(v) +
            "</b>, chép vào <b>R1</b>. Ô [" + esc(l.dc) + "] vẫn còn nguyên số " + esc(v) +
            " — đọc là <b>chép ra</b> chứ không phải lấy đi.";
        } else if (l.op === "ADD") {
          cu = r1; v = ram[l.dc]; r1 = cu + v; doc = l.dc; sang = "R1";
          g3 = "CPU đọc ô <b>[" + esc(l.dc) + "]</b> được <b>" + esc(v) + "</b>, cộng với <b>" +
            esc(cu) + "</b> đang nằm trong R1, ra <b>" + esc(r1) + "</b> rồi cất lại vào R1. Phép cộng " +
            "xảy ra <b>bên trong CPU</b>, trên thanh ghi — RAM chỉ biết chứa số, không biết cộng.";
        } else if (l.op === "STORE") {
          ram[l.dc] = r1; ghi = l.dc;
          g3 = "R1 đang giữ <b>" + esc(r1) + "</b>. CPU chép con số đó xuống ô <b>[" + esc(l.dc) +
            "]</b>: ô [" + esc(l.dc) + "] từ chỗ trống nay thành <b>" + esc(ram[l.dc]) + "</b>. R1 vẫn " +
            "giữ " + esc(r1) + " — ghi cũng là chép, không phải dọn đi.";
        } else {
          dung = true;
          g3 = "CPU dừng lại. Chương trình chạy hết: <b>4 lệnh</b>, mỗi lệnh đủ ba chặng, tổng cộng <b>" +
            esc(nhip) + " nhịp</b>. Kết quả <b>" + esc(ram[12]) + "</b> đang nằm ở ô [12] trong RAM. " +
            "Không lệnh nào được nhảy cóc bớt một chặng.";
        }
        chup({ pha: 2, doc: doc, ghi: ghi, sang: sang, nhip: nhip, giai: g3 });
      }

      /* --- phần 2: so ba loại bộ nhớ, bám vào chính con số vừa chạy ra --- */
      chup({ pha: 3, doc: null, ghi: null, nhip: nhip, bo: 0,
        giai: "Nhìn lại đường đi của số <b>" + esc(ram[10]) + "</b>: nó nằm ở RAM ô [10], phải được " +
          "<b>nạp vào R1</b> rồi CPU mới cộng được. <b>Thanh ghi</b> nằm ngay trong CPU nên nhanh nhất, " +
          "nhưng cả con chip chỉ có vài chục ô như R1 — vừa đủ giữ mấy con số đang tính dở." });
      chup({ pha: 3, doc: null, ghi: null, nhip: nhip, bo: 1,
        giai: "<b>RAM</b> giữ cả chương trình (ô [0] đến [3]) lẫn dữ liệu (ô [10] đến [12]) của mọi thứ " +
          "đang mở. Chậm hơn thanh ghi nhưng to hơn nhiều, cỡ vài GB. Đừng lẫn: <b>máy 8GB RAM</b> là " +
          "<b>chỗ làm việc</b>, còn <b>ổ 512GB</b> là <b>chỗ cất đồ</b> — hai thứ khác hẳn nhau, không " +
          "thay cho nhau được." });
      chup({ pha: 3, doc: null, ghi: null, nhip: nhip, bo: 2,
        giai: "<b>Ổ cứng / SSD</b> to hơn hàng trăm lần nhưng chậm hơn RAM rất nhiều, và <b>CPU không " +
          "tính trực tiếp trên ổ cứng</b>. Mở một tệp là dữ liệu phải đi <b>ổ cứng → RAM → thanh ghi</b> " +
          "rồi mới được tính. Không có đường tắt nào cả." });
      chup({ pha: 3, doc: null, ghi: null, nhip: nhip, xong: true,
        giai: "Ba loại khác nhau về tốc độ và dung lượng, nhưng khác biệt <b>quan trọng nhất</b> lại nằm " +
          "ở chỗ khác: <b>mất điện thì mất gì</b>. Đánh dấu ô “mô phỏng mất điện” ở trên để thấy." });
      return kh;
    }

    var KH = chay(), b = 0;

    var node = MH.el(MH.khung("Bên trong máy tính: CPU chạy một lệnh ra sao?",
      "Bên trái là <b>RAM</b> — từng ô có địa chỉ riêng. Bên phải là <b>CPU</b> với mấy thanh ghi và ba " +
      "chặng nó phải đi cho <b>mỗi</b> lệnh. Bấm “Bước tiếp” để chạy từng nhịp.",
      '<div class="mh7-doi">' +
      '<div class="mh7-panel"><p class="mh7-nhan">Bộ nhớ RAM</p>' +
      '<div class="mh4-cuon"><table class="mh4-b" data-mh="ram"></table></div></div>' +
      '<div class="mh7-panel"><p class="mh7-nhan">CPU — thanh ghi</p>' +
      '<div class="mh10-bien" data-mh="tg"></div>' +
      '<p class="mh7-nhan" style="margin-top:9px">Chu trình lệnh</p>' +
      '<div class="mh9-so" data-mh="chang"></div></div>' +
      "</div>" +
      '<p class="mh8-dem" data-mh="dem"></p>' +
      '<p class="mh7-nhan" style="text-align:center;margin:13px 0 5px">Ba loại bộ nhớ — nhanh chậm, ' +
      "to nhỏ, và mất điện thì mất gì</p>" +
      '<div class="mh9-so" data-mh="bonho"></div>' +
      '<div class="mh8-canh" data-mh="canh" hidden></div>' +
      '<div class="mh7-ghi" data-mh="ghi"></div>',
      '<label class="mh7-tick"><input type="checkbox" data-mh="mat"> mô phỏng mất điện</label>'));

    var loi = loiCua(node);
    function o(t) { return node.querySelector('[data-mh="' + t + '"]'); }
    var oMat = o("mat");

    function veRam(f, mat) {
      var h = "<tr><th>Địa chỉ</th><th>Nội dung ô nhớ</th></tr>", i, a, c, v;
      for (i = 0; i < DIA.length; i++) {
        a = DIA[i];
        c = mat ? ' class="rac"' : "";
        if (!mat && a === f.doc) c = ' class="nay"';
        else if (!mat && a === f.ghi) c = ' class="khop"';
        if (a === "gap") { h += "<tr" + c + "><td>[4] - [9]</td><td>(chưa dùng)</td></tr>"; continue; }
        v = mat ? "(mất sạch)" : (f.ram[a] === null ? "(trống)" : f.ram[a]);
        h += "<tr" + c + "><td>[" + esc(a) + "]</td><td>" + esc(v) + "</td></tr>";
      }
      o("ram").innerHTML = h;
    }

    function oTg(ten, gt, sang) {
      var trong = gt === null || gt === "";
      return '<div class="mh10-b' + (sang ? " nay" : "") + (trong ? " none" : "") + '"><b>' +
        esc(ten) + "</b><i>" + esc(trong ? "-" : gt) + "</i></div>";
    }

    function veTg(f, mat) {
      if (mat) {
        o("tg").innerHTML = oTg("PC", null, false) + oTg("IR", null, false) + oTg("R1", null, false);
        return;
      }
      o("tg").innerHTML = oTg("PC", f.pc, f.sang.indexOf("PC") >= 0) +
        oTg("IR", f.ir, f.sang.indexOf("IR") >= 0) +
        oTg("R1", f.r1, f.sang.indexOf("R1") >= 0);
    }

    function veChang(f, mat) {
      var h = "", i, c;
      for (i = 0; i < 3; i++) {
        if (mat || f.pha < 0) c = "cho";
        else if (f.pha > 2) c = "xong";
        else if (i === f.pha) c = "nay";
        else c = i < f.pha ? "xong" : "cho";
        h += '<div class="mh9-tb ' + c + '"><b>' + esc(PHA[i]) + "</b><small>" +
          esc(PHA_MO[i]) + "</small></div>";
      }
      o("chang").innerHTML = h;
    }

    function veBn(f, mat) {
      /* Lúc mất điện: hai ô đầu chuyển sang nét đứt mờ (rỗng), ô ổ cứng xanh —
         một hình là đủ nói hết chuyện "cái nào bay, cái nào ở lại". */
      var h = "", i, c;
      for (i = 0; i < BN.length; i++) {
        if (mat) c = i < 2 ? "cho" : "xong";
        else c = f.bo === i ? "nay" : "";
        h += '<div class="mh9-tb ' + c + '"><b>' + esc(BN[i].ten) + "</b><small>" +
          esc(mat ? BN[i].mat : BN[i].mo) + "</small></div>";
      }
      o("bonho").innerHTML = h;
    }

    function hien() {
      var mat = oMat.checked, f = KH[b];
      veRam(f, mat); veTg(f, mat); veChang(f, mat); veBn(f, mat);
      if (mat) {
        o("dem").innerHTML = "<b>MẤT ĐIỆN</b> &middot; CPU đứng im &middot; RAM không giữ được gì";
        o("canh").hidden = false;
        o("canh").innerHTML = "<b>Cúp điện.</b> Thanh ghi trống. RAM trắng trơn: cả bốn lệnh ở ô [0] " +
          "đến [3] lẫn kết quả <b>12</b> vừa ghi vào ô [12] đều bay sạch trong chớp mắt. Cắm điện lại " +
          "thì RAM vẫn trống — <b>không có cách nào lấy lại</b>.";
        o("ghi").className = "mh7-ghi";
        o("ghi").innerHTML = "Đây chính là lí do phải bấm <b>Lưu</b>. Bài em đang gõ nằm trong RAM; chỉ " +
          "khi bấm Lưu nó mới được chép xuống <b>ổ cứng</b> — chỗ duy nhất trong ba loại giữ được dữ " +
          "liệu khi không có điện. Chưa lưu mà mất điện thì mất, phần mềm không cứu giúp em được.";
        loi("Bỏ dấu tick để cấp điện lại và chạy tiếp.");
        return;
      }
      o("canh").hidden = true;
      o("dem").innerHTML = f.pha < 0
        ? "Máy vừa bật &middot; PC = <b>0</b> &middot; chưa nạp lệnh nào"
        : (f.pha > 2
          ? "Chạy xong &middot; ô [12] = <b>" + esc(f.ram[12]) + "</b> &middot; đang so ba loại bộ nhớ"
          : "Nhịp <b>" + esc(f.nhip) + "</b>/12 &middot; chặng <b>" + esc(PHA[f.pha]) +
            "</b> &middot; PC = <b>" + esc(f.pc) + "</b> &middot; R1 = <b>" +
            esc(f.r1 === null ? "-" : f.r1) + "</b>");
      o("ghi").className = "mh7-ghi" + (f.xong ? " xong" : "");
      o("ghi").innerHTML = f.giai;
      loi(b >= KH.length - 1
        ? "Hết bước rồi. Đánh dấu ô “mô phỏng mất điện” để xem cú chốt."
        : "Bấm “Bước tiếp” để đi tiếp một nhịp.");
    }

    o("tien").onclick = function () {
      if (oMat.checked) { loi("Máy đang mất điện, không chạy được. Bỏ dấu tick trước đã."); return; }
      if (b >= KH.length - 1) { loi("Đã hết bước. Bấm “Làm lại” để chạy lại từ đầu."); return; }
      b++; hien();
    };
    ganDatLai(node, [oMat], function () { b = 0; hien(); });

    hien();
    host.appendChild(node);
  });
})();
