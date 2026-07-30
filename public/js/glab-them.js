/* ============================================================================
 *  THÊM BÀI THỰC HÀNH ĐỒ HOẠ
 *
 *  Nạp SAU js/graphics-lab.js — chỉ thêm dữ liệu bài tập vào window.GLAB, không
 *  sửa gì trong bộ dựng widget. Nhờ vậy muốn thêm bài nữa thì sửa đúng tệp này.
 *
 *  Mỗi bài đồ hoạ trước đây chỉ có 1–2 việc để làm, xong là hết. Ở đây thêm cho
 *  mỗi bài 1–2 việc nữa, CỐ Ý chọn dạng widget khác dạng đã có của bài đó, để em
 *  nào làm hết một bài thì cũng đi qua vài kiểu thao tác chứ không lặp lại một
 *  kiểu (bài kéo hình thì thêm bài nối khái niệm, bài pha màu thì thêm bài bấm
 *  đúng công cụ...).
 *
 *  8 dạng dùng được và dữ liệu mỗi dạng cần — theo đúng graphics-lab.js:
 *    filter    target {b:0,5–1,5  c:0,5–1,5  s:0–2  h:0–180}
 *    layers    layers[{name,color,draw:"sky"|"sun"|"house"}] + targetOrder
 *    crop      target {x,y,w,h} trên ảnh 200×140 (nhà x36–98 y56–120, mặt trời x138–178 y16–56)
 *    colorpick target {r,g,b}   (sai số cho phép 22/kênh)
 *    match     pairs[{l,r}]
 *    order     items[{label}] + targetOrder  (bộ dựng tự xáo thế bài ban đầu)
 *    hotspot   image:"toolbar" + answer thuộc but|tay|chon|do|chu, hoặc regions[] + answer
 *    place     pieces[{id:"sun"|"house"|"tree"|"cloud",label,x0,y0}] + targets[{id,x,y}]
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.GLAB) return;

  var THEM = {
    /* ---------- Tin 10 — Chủ đề Thiết kế đồ hoạ ---------- */
    "C10-09": [
      { type: "order", prompt: "Sắp đúng **trình tự làm một sản phẩm đồ hoạ** (ví dụ tấm áp phích cho lớp), từ lúc nhận yêu cầu đến lúc gửi đi in.",
        items: [{ label: "Hỏi rõ yêu cầu" }, { label: "Phác thảo bố cục" }, { label: "Dựng hình, gõ chữ" }, { label: "Chỉnh màu, cân đối" }, { label: "Xuất file đem in" }],
        targetOrder: [0, 1, 2, 3, 4] },
      { type: "hotspot", image: "toolbar", answer: "chu",
        prompt: "Áp phích đã có hình, giờ cần **thêm dòng tiêu đề** vào. Bấm vào công cụ dùng để **viết chữ lên bản vẽ**.",
        miss: "Công cụ chữ thường mang biểu tượng chữ T." },
    ],
    "C10-10": [
      { type: "match", prompt: "Nối mỗi **thành phần của một hình vector** với mô tả đúng.",
        pairs: [
          { l: "Điểm neo", r: "Điểm giữ hình dạng, kéo nó là đường cong đổi theo" },
          { l: "Đường path", r: "Nét nối các điểm neo, tạo nên viền của hình" },
          { l: "Màu nét (stroke)", r: "Màu của đường viền quanh hình" },
          { l: "Màu tô (fill)", r: "Màu phủ kín phần bên trong hình" },
        ] },
      { type: "place", prompt: "Dựng một bản vẽ vector đơn giản: **kéo mỗi hình về đúng ô nét đứt** — đám mây trên trời bên trái, mặt trời góc trên phải, cái cây dưới thấp.",
        pieces: [
          { id: "cloud", label: "Đám mây", x0: 30, y0: 124 },
          { id: "sun", label: "Mặt trời", x0: 100, y0: 124 },
          { id: "tree", label: "Cái cây", x0: 170, y0: 124 },
        ],
        targets: [{ id: "cloud", x: 52, y: 34 }, { id: "sun", x: 158, y: 30 }, { id: "tree", x: 108, y: 96 }] },
    ],
    "C10-28": [
      { type: "match", prompt: "Nối mỗi **định dạng tệp** với việc nên dùng nó — đây là chỗ rất dễ mất điểm vì chọn sai định dạng khi xuất file.",
        pairs: [
          { l: "SVG", r: "Bản vẽ vector, phóng to bao nhiêu cũng không vỡ nét" },
          { l: "PNG", r: "Ảnh điểm, giữ được phần trong suốt (nền rỗng)" },
          { l: "JPG", r: "Ảnh chụp nhiều màu, file nhẹ nhưng nén làm mất chi tiết" },
          { l: "PDF", r: "Bản in nhiều trang, mở máy nào cũng đúng bố cục" },
        ] },
      { type: "hotspot", image: "toolbar", answer: "chon",
        prompt: "Muốn **ghép nhiều hình thành một nhóm**, trước tiên phải khoanh lấy chúng đã. Bấm vào công cụ dùng để **chọn đối tượng**.",
        miss: "Công cụ chọn thường là hình chữ nhật nét đứt." },
    ],

    /* ---------- Tin học ứng dụng 11 — Ảnh & phim ---------- */
    "U11-09": [
      { type: "match", prompt: "Nối mỗi **khái niệm khi làm việc với lớp** trong phần mềm chỉnh ảnh với mô tả đúng.",
        pairs: [
          { l: "Lớp (layer)", r: "Một tầng ảnh riêng, sửa nó không đụng tới tầng khác" },
          { l: "Vùng chọn", r: "Phần ảnh được khoanh lại, thao tác chỉ ăn vào đó" },
          { l: "Độ mờ (opacity)", r: "Lớp trong suốt bao nhiêu phần, cho thấy lớp dưới" },
          { l: "Ẩn lớp", r: "Tạm không hiện lớp đó, nhưng vẫn giữ trong tệp" },
        ] },
      { type: "hotspot", image: "toolbar", answer: "chon",
        prompt: "Muốn chỉnh **chỉ một góc ảnh** mà không ảnh hưởng phần còn lại, việc đầu tiên là khoanh vùng. Bấm vào công cụ **tạo vùng chọn**.",
        miss: "Tìm biểu tượng khung nét đứt." },
    ],
    "U11-10": [
      { type: "filter", prompt: "Ảnh chụp trong nhà bị **tối và xám**. Kéo các thanh để ảnh của bạn giống ảnh mẫu: sáng lên, tương phản mạnh hơn một chút, màu tươi hơn.",
        target: { b: 1.3, c: 1.3, s: 1.4, h: 0 } },
      { type: "match", prompt: "Nối mỗi **thanh chỉnh ảnh** với việc nó làm.",
        pairs: [
          { l: "Độ sáng", r: "Toàn ảnh sáng lên hoặc tối đi" },
          { l: "Tương phản", r: "Khoảng cách giữa chỗ sáng nhất và chỗ tối nhất" },
          { l: "Bão hoà", r: "Màu đậm rực lên, hoặc nhạt dần về xám" },
          { l: "Xoay màu", r: "Đổi hẳn tông màu, ví dụ xanh chuyển sang tím" },
        ] },
    ],
    "U11-11": [
      { type: "crop", prompt: "Cần cắt riêng **mặt trời** ra khỏi ảnh để dán sang bài khác. Kéo khung chọn trùm đúng mặt trời (ô nét đứt).",
        target: { x: 138, y: 16, w: 40, h: 40 } },
      { type: "order", prompt: "Sắp đúng **trình tự tách một vật ra khỏi nền** rồi đem dán sang ảnh khác.",
        items: [{ label: "Phóng to chỗ cần tách" }, { label: "Khoanh vùng chọn quanh vật" }, { label: "Nắn lại mép chọn cho khít" }, { label: "Xoá nền ngoài vùng chọn" }, { label: "Lưu thành PNG nền trong" }],
        targetOrder: [0, 1, 2, 3, 4] },
    ],
    "U11-12": [
      { type: "hotspot", image: "toolbar", answer: "do",
        prompt: "Cả một vùng đã khoanh cần **phủ kín một màu** trong một nhát. Bấm vào công cụ làm việc đó.",
        miss: "Tìm biểu tượng thùng sơn đang dốc xuống." },
      { type: "colorpick", prompt: "Pha ba kênh **Đỏ, Lục, Lam** để ra màu **tím** dùng tô chữ tiêu đề (gợi ý: đỏ vừa, lục thấp, lam cao).",
        target: { r: 140, g: 60, b: 200 } },
    ],
    "U11-13": [
      { type: "match", prompt: "Nối mỗi **khái niệm của ảnh động** với mô tả đúng.",
        pairs: [
          { l: "Khung hình (frame)", r: "Một ảnh tĩnh trong chuỗi ảnh chiếu nối tiếp" },
          { l: "Khung hình/giây (fps)", r: "Số ảnh chiếu trong một giây, càng cao càng mượt" },
          { l: "Lặp (loop)", r: "Hết chuỗi thì quay lại chiếu từ đầu" },
          { l: "Thời lượng khung", r: "Một khung được giữ trên màn bao lâu" },
        ] },
      { type: "order", prompt: "Sắp các khung để làm ảnh động **mặt trời mọc rồi lặn**.",
        items: [{ label: "Mặt trời sát chân trời" }, { label: "Mặt trời lên lưng chừng" }, { label: "Mặt trời đứng bóng" }, { label: "Mặt trời xuống lưng chừng" }, { label: "Mặt trời lặn khuất" }],
        targetOrder: [0, 1, 2, 3, 4] },
    ],
    "U11-14": [
      { type: "order", prompt: "Sắp đúng **trình tự dựng một đoạn phim ngắn** từ lúc mở phần mềm tới lúc có file phim.",
        items: [{ label: "Nhập clip vào thư viện" }, { label: "Kéo clip lên dòng thời gian" }, { label: "Cắt bỏ đoạn thừa" }, { label: "Thêm nhạc và chữ" }, { label: "Xem trước toàn bộ" }, { label: "Xuất file phim" }],
        targetOrder: [0, 1, 2, 3, 4, 5] },
      { type: "match", prompt: "Nối mỗi **thao tác trên dòng thời gian** với kết quả của nó.",
        pairs: [
          { l: "Cắt (split)", r: "Chia một clip thành hai đoạn tại chỗ đang đứng" },
          { l: "Kéo mép clip", r: "Rút ngắn hoặc nới dài đoạn được chiếu" },
          { l: "Đổi chỗ hai clip", r: "Đổi thứ tự cảnh trong phim" },
          { l: "Khoá rãnh (track)", r: "Rãnh đó không bị sửa nhầm khi làm rãnh khác" },
        ] },
    ],
    "U11-15": [
      { type: "match", prompt: "Nối mỗi **việc khi biên tập phim** với mục đích của nó.",
        pairs: [
          { l: "Chuyển cảnh (transition)", r: "Nối hai cảnh cho mềm, đỡ giật khi đổi cảnh" },
          { l: "Lồng nhạc nền", r: "Đặt nhạc chạy suốt phim ở một rãnh riêng" },
          { l: "Giảm tiếng gốc", r: "Hạ tiếng ồn trong clip để nghe rõ lời thuyết minh" },
          { l: "Xuất phim (export)", r: "Kết tất cả các rãnh thành một tệp phim gửi được" },
        ] },
      { type: "order", prompt: "Phim đã cắt ghép xong. Sắp đúng **những việc cuối cùng** trước khi gửi bài cho cô.",
        items: [{ label: "Xem lại cả phim một lượt" }, { label: "Sửa chỗ tiếng to nhỏ chênh nhau" }, { label: "Thêm tên nhóm ở cuối phim" }, { label: "Chọn độ phân giải khi xuất" }, { label: "Xuất file rồi mở thử" }],
        targetOrder: [0, 1, 2, 3, 4] },
    ],
  };

  Object.keys(THEM).forEach(function (k) {
    window.GLAB[k] = (window.GLAB[k] || []).concat(THEM[k]);
  });
})();
