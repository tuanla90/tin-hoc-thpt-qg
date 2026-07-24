/* ============================================================================
 *  BAI TAP HTML/CSS cho cac bai web (ban sach). Gop vao WEB_EXERCISES.
 *  Nap SAU web-run.js. Cham bang cach render iframe + so voi loi giai.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined" || !window.WEB_EXERCISES) return;
  var ADD = {
 "C12-08": [
  {
   "mode": "html",
   "prompt": "Em hãy làm phần đầu trang giới thiệu **Câu lạc bộ Bóng rổ** của lớp. Yêu cầu:\n1. Một tiêu đề chính `h1` ghi đúng chữ **Câu lạc bộ Bóng rổ**.\n2. Một tiêu đề phụ `h2` ghi đúng chữ **Giới thiệu**.\n3. Một đoạn văn `p` (nội dung tự do) nói vài câu về câu lạc bộ.",
   "starter": "<h1>...</h1>\n<h2>...</h2>\n<p>...</p>",
   "solution": "<h1>Câu lạc bộ Bóng rổ</h1>\n<h2>Giới thiệu</h2>\n<p>Câu lạc bộ Bóng rổ của lớp em tập vào chiều thứ Bảy ở sân trường. Ai cũng có thể tham gia.</p>",
   "hint": "Tiêu đề lớn nhất dùng thẻ `h1`, tiêu đề nhỏ hơn dùng `h2`, đoạn văn dùng `p`.",
   "checks": [
    {
     "desc": "Có thẻ h1 ghi đúng chữ \"Câu lạc bộ Bóng rổ\"",
     "sel": "h1",
     "get": "text"
    },
    {
     "desc": "Có thẻ h2 ghi đúng chữ \"Giới thiệu\"",
     "sel": "h2",
     "get": "text"
    },
    {
     "desc": "Có một đoạn văn p",
     "sel": "p",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Em viết phần **Lịch tập và trang bị** cho trang câu lạc bộ. Yêu cầu:\n1. Một đoạn văn `p` trong đó có in **đậm** (thẻ `strong`) và in *nghiêng* (thẻ `em`) một vài từ.\n2. Một danh sách **không thứ tự** (`ul`) gồm đúng **3** mục `li` liệt kê đồ cần mang theo (ví dụ: giày, nước, áo).",
   "starter": "<p>Buổi tập bắt đầu lúc <strong>...</strong>, nhớ đến <em>...</em>.</p>\n<ul>\n  <li>...</li>\n</ul>",
   "solution": "<p>Buổi tập bắt đầu lúc <strong>15 giờ</strong> thứ Bảy, các bạn nhớ đến <em>đúng giờ</em> nhé.</p>\n<ul>\n  <li>Giày thể thao</li>\n  <li>Chai nước</li>\n  <li>Áo đồng phục</li>\n</ul>",
   "hint": "In đậm dùng cặp thẻ `strong`, in nghiêng dùng cặp thẻ `em`; mỗi mục trong danh sách bọc bằng một thẻ `li`.",
   "checks": [
    {
     "desc": "Trong đoạn văn có chữ in đậm (thẻ strong)",
     "sel": "strong",
     "get": "exists"
    },
    {
     "desc": "Trong đoạn văn có chữ in nghiêng (thẻ em)",
     "sel": "em",
     "get": "exists"
    },
    {
     "desc": "Danh sách ul có đúng 3 mục li",
     "sel": "ul li",
     "get": "count"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Em hoàn thiện phần **Liên hệ** cuối trang. Yêu cầu:\n1. Một tiêu đề phụ `h2` ghi đúng chữ **Liên hệ**.\n2. Một đoạn văn `p` bên trong có một **liên kết** (thẻ `a`) trỏ tới trang Facebook của câu lạc bộ, với thuộc tính `href` đúng bằng `https://facebook.com/clbbongro`.",
   "starter": "<h2>...</h2>\n<p>Theo dõi chúng em tại <a href=\"...\">Facebook</a>.</p>",
   "solution": "<h2>Liên hệ</h2>\n<p>Theo dõi chúng em tại <a href=\"https://facebook.com/clbbongro\">trang Facebook</a> của câu lạc bộ.</p>",
   "hint": "Liên kết dùng thẻ `a` và địa chỉ đặt trong thuộc tính `href`, ví dụ `<a href=\"...\">chữ hiển thị</a>`.",
   "checks": [
    {
     "desc": "Có thẻ h2 ghi đúng chữ \"Liên hệ\"",
     "sel": "h2",
     "get": "text"
    },
    {
     "desc": "Có một liên kết (thẻ a)",
     "sel": "a",
     "get": "exists"
    },
    {
     "desc": "Liên kết có href đúng bằng địa chỉ Facebook yêu cầu",
     "sel": "a",
     "get": "attr",
     "attr": "href"
    }
   ]
  }
 ],
 "C12-09": [
  {
   "mode": "html",
   "prompt": "Chèn một tấm ảnh vào trang bằng thẻ `img`. Đặt thuộc tính `src` là `avatar.jpg` và thuộc tính `alt` là `Ảnh đại diện của em`. Nhớ: thẻ `img` không có thẻ đóng.",
   "starter": "<img src=\"\" alt=\"\">",
   "solution": "<img src=\"avatar.jpg\" alt=\"Ảnh đại diện của em\">",
   "hint": "Điền địa chỉ ảnh vào `src`, còn `alt` là dòng chữ mô tả ảnh khi ảnh không hiện.",
   "checks": [
    {
     "desc": "Có thẻ img",
     "sel": "img",
     "get": "exists"
    },
    {
     "desc": "Thuộc tính src đúng là avatar.jpg",
     "sel": "img",
     "get": "attr",
     "attr": "src"
    },
    {
     "desc": "Thuộc tính alt đúng nội dung yêu cầu",
     "sel": "img",
     "get": "attr",
     "attr": "alt"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Tạo một bảng thời khóa biểu nhỏ bằng `table`. Bảng có **3 hàng** (`tr`): hàng đầu là hai ô tiêu đề `th` ghi `Thứ` và `Môn`; hai hàng sau dùng ô `td`, lần lượt ghi `Hai` - `Toán` và `Ba` - `Văn`.",
   "starter": "<table>\n  <tr>\n    <th></th>\n    <th></th>\n  </tr>\n  <!-- thêm các hàng dữ liệu ở đây -->\n</table>",
   "solution": "<table>\n  <tr><th>Thứ</th><th>Môn</th></tr>\n  <tr><td>Hai</td><td>Toán</td></tr>\n  <tr><td>Ba</td><td>Văn</td></tr>\n</table>",
   "hint": "Mỗi hàng bọc trong một cặp `<tr>...</tr>`; ô tiêu đề dùng `th`, ô dữ liệu dùng `td`.",
   "checks": [
    {
     "desc": "Có thẻ table",
     "sel": "table",
     "get": "exists"
    },
    {
     "desc": "Bảng có đủ 3 hàng tr",
     "sel": "tr",
     "get": "count"
    },
    {
     "desc": "Có 2 ô tiêu đề th",
     "sel": "th",
     "get": "count"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Làm bảng danh sách thành viên câu lạc bộ. Bảng có hàng tiêu đề gồm **3 ô `th`**: `Ảnh`, `Tên`, `Lớp`. Thêm **1 hàng dữ liệu**: ô đầu chứa một ảnh (`img` với `src` = `minh.jpg`, `alt` = `Bạn Minh`), hai ô còn lại ghi `Minh` và `12A2`.",
   "starter": "<table>\n  <tr>\n    <th>Ảnh</th>\n    <th>Tên</th>\n    <th>Lớp</th>\n  </tr>\n  <tr>\n    <td><!-- ảnh --></td>\n    <td></td>\n    <td></td>\n  </tr>\n</table>",
   "solution": "<table>\n  <tr><th>Ảnh</th><th>Tên</th><th>Lớp</th></tr>\n  <tr><td><img src=\"minh.jpg\" alt=\"Bạn Minh\"></td><td>Minh</td><td>12A2</td></tr>\n</table>",
   "hint": "Đặt thẻ `img` nằm bên trong ô `td` đầu tiên của hàng dữ liệu.",
   "checks": [
    {
     "desc": "Có 3 ô tiêu đề th",
     "sel": "th",
     "get": "count"
    },
    {
     "desc": "Ô trong bảng có chứa ảnh img",
     "sel": "td img",
     "get": "exists"
    },
    {
     "desc": "Ảnh trong bảng có alt đúng là Bạn Minh",
     "sel": "td img",
     "get": "attr",
     "attr": "alt"
    }
   ]
  }
 ],
 "C12-11": [
  {
   "mode": "css",
   "prompt": "Trang có sẵn tiêu đề `<h1 class=\"tieu-de\">`. Hãy viết CSS cho lớp `.tieu-de` để **màu chữ** là `#d81b60` (hồng đậm) và **cỡ chữ** (`font-size`) là `32px`.",
   "baseHtml": "<h1 class=\"tieu-de\">Câu lạc bộ Tin học 12A1</h1>",
   "starter": ".tieu-de {\n  /* Viết màu chữ và cỡ chữ ở đây */\n}",
   "solution": ".tieu-de {\n  color: #d81b60;\n  font-size: 32px;\n}",
   "hint": "Dùng thuộc tính `color` cho màu chữ và `font-size` cho cỡ chữ.",
   "checks": [
    {
     "desc": "Màu chữ của tiêu đề là hồng đậm (#d81b60)",
     "sel": ".tieu-de",
     "get": "css",
     "prop": "color"
    },
    {
     "desc": "Cỡ chữ của tiêu đề là 32px",
     "sel": ".tieu-de",
     "get": "css",
     "prop": "font-size"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Có sẵn một đoạn thông báo `<p class=\"thong-bao\">`. Hãy viết CSS cho `.thong-bao` để: **màu nền** (`background-color`) là `#fff3e0`, **màu chữ** là `#e65100`, và **khoảng đệm trong** (`padding`) là `16px` cho tất cả các phía.",
   "baseHtml": "<p class=\"thong-bao\">Lớp mình họp mặt cuối tuần này nhé!</p>",
   "starter": ".thong-bao {\n  /* Viết màu nền, màu chữ và khoảng đệm ở đây */\n}",
   "solution": ".thong-bao {\n  background-color: #fff3e0;\n  color: #e65100;\n  padding: 16px;\n}",
   "hint": "Màu nền dùng `background-color`, khoảng đệm trong dùng `padding: 16px;`.",
   "checks": [
    {
     "desc": "Màu nền của thông báo là #fff3e0",
     "sel": ".thong-bao",
     "get": "css",
     "prop": "background-color"
    },
    {
     "desc": "Màu chữ của thông báo là #e65100",
     "sel": ".thong-bao",
     "get": "css",
     "prop": "color"
    },
    {
     "desc": "Khoảng đệm trong (padding) là 16px",
     "sel": ".thong-bao",
     "get": "css",
     "prop": "padding"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Có sẵn một thẻ thành viên gồm khung `<div class=\"the-tv\">` chứa tên `<h2 class=\"ten\">`. Hãy viết CSS để: khung `.the-tv` có **màu nền** `#e8f5e9` và **khoảng đệm trong** (`padding`) `20px`; còn tên `.ten` có **màu chữ** `#2e7d32` và **cỡ chữ** `24px`.",
   "baseHtml": "<div class=\"the-tv\"><h2 class=\"ten\">Nguyễn Minh An</h2><p class=\"vai-tro\">Trưởng nhóm truyền thông</p></div>",
   "starter": ".the-tv {\n  /* màu nền và khoảng đệm cho khung */\n}\n.ten {\n  /* màu chữ và cỡ chữ cho tên */\n}",
   "solution": ".the-tv {\n  background-color: #e8f5e9;\n  padding: 20px;\n}\n.ten {\n  color: #2e7d32;\n  font-size: 24px;\n}",
   "hint": "Đặt `background-color` và `padding` trong `.the-tv`; đặt `color` và `font-size` trong `.ten`.",
   "checks": [
    {
     "desc": "Khung thẻ có màu nền #e8f5e9",
     "sel": ".the-tv",
     "get": "css",
     "prop": "background-color"
    },
    {
     "desc": "Khung thẻ có khoảng đệm trong (padding) 20px",
     "sel": ".the-tv",
     "get": "css",
     "prop": "padding"
    },
    {
     "desc": "Tên thành viên có màu chữ #2e7d32",
     "sel": ".ten",
     "get": "css",
     "prop": "color"
    },
    {
     "desc": "Tên thành viên có cỡ chữ 24px",
     "sel": ".ten",
     "get": "css",
     "prop": "font-size"
    }
   ]
  }
 ],
 "C12-12": [
  {
   "mode": "css",
   "prompt": "Trang lớp em có hai tấm thẻ. Hãy đặt **chiều rộng (`width`)** cho từng thẻ: khối `.the-lop` rộng **300px**, khối `.the-truong` rộng **220px**. Chỉ cần thêm `width`, không đổi gì khác.",
   "baseHtml": "<div class=\"the-lop\">Lớp 12A3</div><div class=\"the-truong\">THPT Nguyễn Du</div>",
   "starter": ".the-lop {\n  /* đặt chiều rộng ở đây */\n}\n.the-truong {\n  /* đặt chiều rộng ở đây */\n}",
   "solution": ".the-lop { width: 300px; }\n.the-truong { width: 220px; }",
   "hint": "Dùng thuộc tính `width` với đơn vị `px`, ví dụ `width: 300px;`.",
   "checks": [
    {
     "desc": "Khối .the-lop rộng đúng 300px",
     "sel": ".the-lop",
     "get": "css",
     "prop": "width"
    },
    {
     "desc": "Khối .the-truong rộng đúng 220px",
     "sel": ".the-truong",
     "get": "css",
     "prop": "width"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Khối `.hop-thongbao` đang chiếm hết chiều ngang. Hãy đặt **chiều rộng `width: 400px`** rồi **căn khối vào giữa trang** bằng `margin: 0 auto`.",
   "baseHtml": "<div class=\"hop-thongbao\">Thông báo: 15h chiều nay họp lớp tại phòng A2</div>",
   "starter": ".hop-thongbao {\n  /* đặt chiều rộng và căn giữa khối */\n}",
   "solution": ".hop-thongbao { width: 400px; margin: 0 auto; }",
   "hint": "Muốn căn giữa một khối block, cho nó một `width` rồi đặt `margin: 0 auto;`.",
   "checks": [
    {
     "desc": "Khối rộng đúng 400px",
     "sel": ".hop-thongbao",
     "get": "css",
     "prop": "width"
    },
    {
     "desc": "Khối được căn giữa (lề trái/phải tự động)",
     "sel": ".hop-thongbao",
     "get": "css",
     "prop": "margin-left"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Hoàn thiện thẻ bài viết của CLB Tin học: đặt **`width: 500px`**, **căn giữa** khối, và tạo **khoảng cách ngoài trên/dưới 40px**. Gợi ý: có thể gộp trong một dòng `margin: 40px auto;`.",
   "baseHtml": "<div class=\"the-baiviet\">Bài viết mới: Câu lạc bộ Tin học tuyển thành viên khóa mới</div>",
   "starter": ".the-baiviet {\n  /* rộng 500px, căn giữa, cách trên/dưới 40px */\n}",
   "solution": ".the-baiviet { width: 500px; margin: 40px auto; }",
   "hint": "`margin: 40px auto;` nghĩa là lề trên/dưới 40px, còn lề trái/phải tự động để căn giữa.",
   "checks": [
    {
     "desc": "Khối rộng đúng 500px",
     "sel": ".the-baiviet",
     "get": "css",
     "prop": "width"
    },
    {
     "desc": "Có khoảng cách trên 40px",
     "sel": ".the-baiviet",
     "get": "css",
     "prop": "margin-top"
    },
    {
     "desc": "Khối được căn giữa (lề trái/phải tự động)",
     "sel": ".the-baiviet",
     "get": "css",
     "prop": "margin-left"
    }
   ]
  }
 ],
 "C12-13": [
  {
   "mode": "html",
   "prompt": "Bắt đầu trang giới thiệu lớp em. Hãy tạo **một tiêu đề** bằng thẻ `h1` với đúng chữ **Lớp 12A3 của chúng em**, rồi thêm **một đoạn văn** bằng thẻ `p` để giới thiệu vài câu về lớp (nội dung tuỳ em).",
   "starter": "<h1>...</h1>\n<p>...</p>",
   "solution": "<h1>Lớp 12A3 của chúng em</h1>\n<p>Lớp em có 40 bạn, luôn đoàn kết và học tập chăm chỉ.</p>",
   "hint": "Thẻ `h1` dùng cho tiêu đề lớn, thẻ `p` dùng cho một đoạn văn.",
   "checks": [
    {
     "desc": "Có tiêu đề h1 đúng chữ \"Lớp 12A3 của chúng em\"",
     "sel": "h1",
     "get": "text"
    },
    {
     "desc": "Có một đoạn văn (thẻ p)",
     "sel": "p",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Thêm **một danh sách** các hoạt động của lớp. Dùng thẻ `ul` (danh sách không thứ tự) và bên trong đặt **đúng 3 mục** `li`, mỗi mục là một hoạt động (ví dụ: cắm trại, đá bóng, văn nghệ...).",
   "starter": "<ul>\n  <li>...</li>\n</ul>",
   "solution": "<ul>\n  <li>Cắm trại cuối năm</li>\n  <li>Giải bóng đá khối 12</li>\n  <li>Buổi văn nghệ chào mừng 20/11</li>\n</ul>",
   "hint": "Mỗi mục trong danh sách nằm trong một cặp thẻ `<li>...</li>`, và tất cả nằm trong thẻ `ul`.",
   "checks": [
    {
     "desc": "Có thẻ danh sách ul",
     "sel": "ul",
     "get": "exists"
    },
    {
     "desc": "Danh sách có đúng 3 mục li",
     "sel": "ul li",
     "get": "count"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Ghép lại thành một trang nhỏ hoàn chỉnh giới thiệu Câu lạc bộ Tin học. Trang cần có đủ 4 phần: một tiêu đề `h1` với chữ **CLB Tin học**, một đoạn văn `p` giới thiệu, một danh sách `ul` gồm **đúng 3 mục** `li`, và cuối cùng **một liên kết** `a` trỏ tới địa chỉ `https://truong.edu.vn` (chữ hiển thị tuỳ em).",
   "starter": "<h1>...</h1>\n<p>...</p>\n<ul>\n  <li>...</li>\n</ul>\n<a href=\"...\">...</a>",
   "solution": "<h1>CLB Tin học</h1>\n<p>Nơi các bạn yêu lập trình cùng nhau học hỏi mỗi tuần.</p>\n<ul>\n  <li>Học Python cơ bản</li>\n  <li>Thiết kế web</li>\n  <li>Thi lập trình</li>\n</ul>\n<a href=\"https://truong.edu.vn\">Xem thêm tại trang trường</a>",
   "hint": "Thẻ liên kết viết là `<a href=\"địa-chỉ\">chữ hiển thị</a>`; nhớ đặt đúng địa chỉ trong `href`.",
   "checks": [
    {
     "desc": "Có tiêu đề h1 đúng chữ \"CLB Tin học\"",
     "sel": "h1",
     "get": "text"
    },
    {
     "desc": "Danh sách ul có đúng 3 mục li",
     "sel": "ul li",
     "get": "count"
    },
    {
     "desc": "Có liên kết a trỏ đúng tới https://truong.edu.vn",
     "sel": "a",
     "get": "attr",
     "attr": "href"
    }
   ]
  }
 ],
 "C12-23": [
  {
   "mode": "html",
   "prompt": "Lớp em muốn đưa bài hát truyền thống lên trang web. Hãy chèn một thẻ **`audio`** để phát nhạc, có **thanh điều khiển** (`controls`) và thuộc tính `src=\"bai-hat-lop-12a1.mp3\"`.",
   "starter": "<!-- Viết thẻ audio phát bài hát ở đây -->",
   "solution": "<audio controls src=\"bai-hat-lop-12a1.mp3\"></audio>",
   "hint": "Dùng thẻ `<audio>` với thuộc tính `controls` và `src` trỏ tới tên file nhạc.",
   "checks": [
    {
     "desc": "Có thẻ audio",
     "sel": "audio",
     "get": "exists"
    },
    {
     "desc": "Thẻ audio có thanh điều khiển (controls)",
     "sel": "audio",
     "get": "attr",
     "attr": "controls"
    },
    {
     "desc": "Thẻ audio có src trỏ tới file bai-hat-lop-12a1.mp3",
     "sel": "audio",
     "get": "attr",
     "attr": "src"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Trang văn nghệ của lớp cần chèn một đoạn phim. Hãy dùng thẻ **`video`** có **thanh điều khiển** (`controls`), thuộc tính `src=\"van-nghe-20-11.mp4\"` và đặt chiều rộng `width=\"400\"`.",
   "starter": "<!-- Viết thẻ video ở đây -->",
   "solution": "<video controls src=\"van-nghe-20-11.mp4\" width=\"400\"></video>",
   "hint": "Dùng thẻ `<video>` với `controls`, `src` và `width`.",
   "checks": [
    {
     "desc": "Có thẻ video",
     "sel": "video",
     "get": "exists"
    },
    {
     "desc": "Thẻ video có thanh điều khiển (controls)",
     "sel": "video",
     "get": "attr",
     "attr": "controls"
    },
    {
     "desc": "Thẻ video có src trỏ tới file van-nghe-20-11.mp4",
     "sel": "video",
     "get": "attr",
     "attr": "src"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Trang giới thiệu câu lạc bộ Tin học cần: (1) một thẻ **`video`** giới thiệu có `controls` và `src=\"gioi-thieu-clb.mp4\"`; (2) một **khung nội tuyến** `iframe` nhúng bản đồ trường với `src=\"ban-do-truong.html\"` và `title=\"Bản đồ trường\"`.",
   "starter": "<h2>Câu lạc bộ Tin học</h2>\n<!-- Viết thẻ video và thẻ iframe ở đây -->",
   "solution": "<h2>Câu lạc bộ Tin học</h2>\n<video controls src=\"gioi-thieu-clb.mp4\"></video>\n<iframe src=\"ban-do-truong.html\" title=\"Bản đồ trường\"></iframe>",
   "hint": "Thẻ `<video controls src=...>` cho phim, thẻ `<iframe src=... title=...>` cho khung nhúng bản đồ.",
   "checks": [
    {
     "desc": "Thẻ video có thanh điều khiển (controls)",
     "sel": "video",
     "get": "attr",
     "attr": "controls"
    },
    {
     "desc": "Có thẻ iframe (khung nội tuyến)",
     "sel": "iframe",
     "get": "exists"
    },
    {
     "desc": "Thẻ iframe có src trỏ tới ban-do-truong.html",
     "sel": "iframe",
     "get": "attr",
     "attr": "src"
    }
   ]
  }
 ],
 "C12-24": [
  {
   "mode": "html",
   "prompt": "Trường em mở **CLB Tin học**. Hãy tạo một biểu mẫu đăng ký đơn giản: dùng thẻ `form` bao ngoài, bên trong có một ô nhập họ tên (`input` với `type=\"text\"`) và một nút gửi (`button`) mang chữ **Đăng ký**.",
   "starter": "<form>\n  <!-- Thêm ô nhập họ tên và nút gửi ở đây -->\n</form>",
   "solution": "<form>\n  <input type=\"text\">\n  <button>Đăng ký</button>\n</form>",
   "hint": "Ô nhập chữ dùng `<input type=\"text\">`, nút bấm dùng `<button>Đăng ký</button>`, cả hai đặt bên trong `<form>`.",
   "checks": [
    {
     "desc": "Có thẻ form bao ngoài",
     "sel": "form",
     "get": "exists"
    },
    {
     "desc": "Có ô nhập chữ (input type text) trong form",
     "sel": "form input[type=text]",
     "get": "exists"
    },
    {
     "desc": "Nút gửi có chữ 'Đăng ký'",
     "sel": "form button",
     "get": "text"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Bổ sung **nhãn** cho biểu mẫu góp ý của lớp. Trong thẻ `form`, hãy tạo: một nhãn `label` mang chữ **Email:**, một ô nhập email (`input` với `type=\"email\"`), và một nút gửi dùng `input` với `type=\"submit\"`.",
   "starter": "<form>\n  <!-- Thêm nhãn Email, ô nhập email và nút gửi -->\n</form>",
   "solution": "<form>\n  <label>Email:</label>\n  <input type=\"email\">\n  <input type=\"submit\">\n</form>",
   "hint": "Nhãn dùng `<label>Email:</label>`, ô nhập email dùng `<input type=\"email\">`, nút gửi dùng `<input type=\"submit\">`.",
   "checks": [
    {
     "desc": "Có nhãn label với chữ 'Email:'",
     "sel": "form label",
     "get": "text"
    },
    {
     "desc": "Có ô nhập email (input type email)",
     "sel": "form input[type=email]",
     "get": "exists"
    },
    {
     "desc": "Có nút gửi (input type submit)",
     "sel": "form input[type=submit]",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện biểu mẫu **đăng ký tham quan** của lớp 12A. Trong thẻ `form` cần có đủ: một nhãn `label` chữ **Họ tên:** đứng trước một ô nhập chữ (`type=\"text\"`), một nhãn `label` chữ **Email:** đứng trước một ô nhập email (`type=\"email\"`), và cuối cùng là một nút gửi (`button`) mang chữ **Gửi đăng ký**.",
   "starter": "<form>\n  <!-- Họ tên: ô text -->\n\n  <!-- Email: ô email -->\n\n  <!-- Nút Gửi đăng ký -->\n</form>",
   "solution": "<form>\n  <label>Họ tên:</label>\n  <input type=\"text\">\n  <label>Email:</label>\n  <input type=\"email\">\n  <button>Gửi đăng ký</button>\n</form>",
   "hint": "Đặt mỗi `<label>` ngay trước ô `<input>` tương ứng, và kết thúc bằng `<button>Gửi đăng ký</button>` bên trong `<form>`.",
   "checks": [
    {
     "desc": "Có đủ 2 nhãn label",
     "sel": "form label",
     "get": "count"
    },
    {
     "desc": "Có ô nhập chữ (type text)",
     "sel": "form input[type=text]",
     "get": "exists"
    },
    {
     "desc": "Có ô nhập email (type email)",
     "sel": "form input[type=email]",
     "get": "exists"
    },
    {
     "desc": "Nút gửi có chữ 'Gửi đăng ký'",
     "sel": "form button",
     "get": "text"
    }
   ]
  }
 ],
 "C12-25": [
  {
   "mode": "css",
   "prompt": "Trang thông báo của lớp có hai đoạn. Hãy viết CSS **chọn theo lớp** `.noibat` để đoạn thông báo nổi bật có chữ màu đỏ (`red`). Chú ý: chỉ đoạn có lớp `noibat` mới đổi màu, đoạn còn lại giữ nguyên.",
   "baseHtml": "<p>Ngày mai lớp trực nhật sân trường.</p><p class=\"noibat\">Sáng thứ Hai tất cả mặc đồng phục thể dục!</p>",
   "starter": ".noibat {\n  /* viết thuộc tính màu chữ ở đây */\n}",
   "solution": ".noibat { color: red; }",
   "hint": "Dùng dấu chấm trước tên lớp: `.noibat { color: red; }`.",
   "checks": [
    {
     "desc": "Đoạn có lớp .noibat có chữ màu đỏ",
     "sel": ".noibat",
     "get": "css",
     "prop": "color"
    },
    {
     "desc": "Đoạn thông báo thường vẫn giữ màu mặc định (không bị tô đỏ)",
     "sel": "p",
     "get": "css",
     "prop": "color"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Trang lớp 12A5 có một tiêu đề `<h1>` mang `id=\"tieude\"`. Hãy viết CSS **chọn theo id** `#tieude` để tiêu đề có nền màu vàng (`yellow`) và chữ **căn giữa** (`center`).",
   "baseHtml": "<h1 id=\"tieude\">Lớp 12A5 xin chào</h1><p>Đây là trang giới thiệu của lớp chúng mình.</p>",
   "starter": "#tieude {\n  /* nền vàng và căn giữa */\n}",
   "solution": "#tieude { background-color: yellow; text-align: center; }",
   "hint": "Dùng dấu thăng trước tên id: `#tieude { background-color: yellow; text-align: center; }`.",
   "checks": [
    {
     "desc": "Tiêu đề #tieude có nền màu vàng",
     "sel": "#tieude",
     "get": "css",
     "prop": "background-color"
    },
    {
     "desc": "Tiêu đề #tieude được căn giữa",
     "sel": "#tieude",
     "get": "css",
     "prop": "text-align"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Danh sách thành viên câu lạc bộ: các bạn thường có lớp `.thanhvien`, riêng bạn trưởng nhóm vừa có lớp `.thanhvien` vừa có `id=\"truongnhom\"`. Hãy viết CSS sao cho: mọi thành viên `.thanhvien` có chữ màu xanh dương (`blue`); riêng `#truongnhom` có chữ màu đỏ (`red`) và **in đậm** (`bold`). Nhờ **luật ưu tiên**, id sẽ thắng lớp nên trưởng nhóm hiện màu đỏ.",
   "baseHtml": "<ul>\n  <li class=\"thanhvien\">An</li>\n  <li class=\"thanhvien\">Bình</li>\n  <li class=\"thanhvien\" id=\"truongnhom\">Chi (trưởng nhóm)</li>\n</ul>",
   "starter": ".thanhvien {\n  /* màu chữ cho thành viên */\n}\n\n#truongnhom {\n  /* màu và độ đậm cho trưởng nhóm */\n}",
   "solution": ".thanhvien { color: blue; } #truongnhom { color: red; font-weight: bold; }",
   "hint": "Viết hai luật riêng: `.thanhvien { color: blue; }` và `#truongnhom { color: red; font-weight: bold; }`; id ưu tiên hơn lớp nên Chi sẽ đỏ.",
   "checks": [
    {
     "desc": "Thành viên .thanhvien có chữ màu xanh dương",
     "sel": ".thanhvien",
     "get": "css",
     "prop": "color"
    },
    {
     "desc": "Trưởng nhóm #truongnhom có chữ màu đỏ (id ưu tiên hơn lớp)",
     "sel": "#truongnhom",
     "get": "css",
     "prop": "color"
    },
    {
     "desc": "Trưởng nhóm #truongnhom được in đậm",
     "sel": "#truongnhom",
     "get": "css",
     "prop": "font-weight"
    }
   ]
  }
 ],
 "C12-26": [
  {
   "mode": "css",
   "prompt": "Trang thông báo của **CLB Tin học** có một khối `div` với lớp `.thongbao`. Em hãy viết CSS cho lớp này: đặt **chiều rộng** `width` là `320px` và thêm **đường viền** `border` kiểu `3px solid #2d6cdf` (dày 3px, nét liền, màu xanh).",
   "baseHtml": "<div class=\"thongbao\">CLB Tin học họp vào thứ Sáu tuần này</div>",
   "starter": ".thongbao {\n  /* Viết CSS của em vào đây */\n}",
   "solution": ".thongbao {\n  width: 320px;\n  border: 3px solid #2d6cdf;\n}",
   "hint": "Dùng `width: 320px;` cho chiều rộng và `border: 3px solid #2d6cdf;` cho đường viền.",
   "checks": [
    {
     "desc": "Khối .thongbao rộng đúng 320px",
     "sel": ".thongbao",
     "get": "css",
     "prop": "width"
    },
    {
     "desc": "Khối .thongbao có đường viền nét liền (solid)",
     "sel": ".thongbao",
     "get": "css",
     "prop": "border-style"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Đây là **hộp thư góp ý** của lớp 12A với khối `div` lớp `.hopthu`. Em hãy viết CSS cho `.hopthu`: đặt **chiều rộng** `width` là `260px`, thêm **đường viền** `border` kiểu `2px solid #888`, và tạo **khoảng đệm trong** `padding` là `20px` để chữ không dính sát viền.",
   "baseHtml": "<div class=\"hopthu\">Hộp thư góp ý của lớp 12A</div>",
   "starter": ".hopthu {\n  /* Viết CSS của em vào đây */\n}",
   "solution": ".hopthu {\n  width: 260px;\n  border: 2px solid #888;\n  padding: 20px;\n}",
   "hint": "`padding` là khoảng cách bên trong, giữa chữ và đường viền; viết `padding: 20px;`.",
   "checks": [
    {
     "desc": "Khối .hopthu rộng đúng 260px",
     "sel": ".hopthu",
     "get": "css",
     "prop": "width"
    },
    {
     "desc": "Có khoảng đệm trong (padding) 20px",
     "sel": ".hopthu",
     "get": "css",
     "prop": "padding"
    },
    {
     "desc": "Đường viền dày 2px",
     "sel": ".hopthu",
     "get": "css",
     "prop": "border-width"
    }
   ]
  },
  {
   "mode": "css",
   "prompt": "Em làm một **thẻ giới thiệu bản thân** cho khối `div` lớp `.the-gioithieu`. Hãy viết CSS đủ **cả bốn thuộc tính hộp**: **chiều rộng** `width` là `280px`, **đường viền** `border` kiểu `4px solid #e0533d`, **khoảng đệm trong** `padding` là `16px`, và **khoảng cách ngoài** `margin` là `24px` để thẻ tách khỏi các phần xung quanh.",
   "baseHtml": "<div class=\"the-gioithieu\">Xin chào, mình là Minh, học sinh lớp 12A</div>",
   "starter": ".the-gioithieu {\n  /* Viết CSS của em vào đây */\n}",
   "solution": ".the-gioithieu {\n  width: 280px;\n  border: 4px solid #e0533d;\n  padding: 16px;\n  margin: 24px;\n}",
   "hint": "`padding` là khoảng cách bên trong viền, còn `margin` là khoảng cách bên ngoài viền; đừng nhầm hai cái.",
   "checks": [
    {
     "desc": "Khoảng cách ngoài (margin) đúng 24px",
     "sel": ".the-gioithieu",
     "get": "css",
     "prop": "margin"
    },
    {
     "desc": "Khoảng đệm trong (padding) đúng 16px",
     "sel": ".the-gioithieu",
     "get": "css",
     "prop": "padding"
    },
    {
     "desc": "Đường viền dày 4px",
     "sel": ".the-gioithieu",
     "get": "css",
     "prop": "border-width"
    }
   ]
  }
 ],
 "U12-02": [
  {
   "mode": "html",
   "prompt": "Dựng **khung bố cục** cho trang bằng ba thẻ ngữ nghĩa: `header`, `main`, `footer`. Mỗi thẻ ghi một dòng chữ ngắn (ví dụ trang **Câu lạc bộ Bóng rổ** của lớp em). `header` là phần đầu trang, `main` là phần nội dung chính, `footer` là phần chân trang.",
   "starter": "<header>...</header>\n<main>...</main>\n<footer>...</footer>",
   "solution": "<header>Câu lạc bộ Bóng rổ 12A3</header>\n<main>Nơi các bạn yêu bóng rổ luyện tập vào mỗi chiều thứ Sáu.</main>\n<footer>Liên hệ: clb12a3@truong.edu.vn</footer>",
   "hint": "Dùng đúng ba tên thẻ header, main, footer; mỗi thẻ có thẻ mở và thẻ đóng, bên trong đặt một dòng chữ.",
   "checks": [
    {
     "desc": "Có thẻ header (phần đầu trang)",
     "sel": "header",
     "get": "exists"
    },
    {
     "desc": "Có thẻ main (phần nội dung chính)",
     "sel": "main",
     "get": "exists"
    },
    {
     "desc": "Có thẻ footer (phần chân trang)",
     "sel": "footer",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện khung trang lớp em. Trong `header` đặt một thẻ `<h1>` ghi đúng chữ **Trang lớp 12A3**. Trong `main` đặt một thẻ `<p>` giới thiệu ngắn về lớp. Trong `footer` ghi dòng bản quyền tuỳ ý.",
   "starter": "<header>\n  <h1>...</h1>\n</header>\n<main>\n  <p>...</p>\n</main>\n<footer>...</footer>",
   "solution": "<header>\n  <h1>Trang lớp 12A3</h1>\n</header>\n<main>\n  <p>Chào mừng đến với trang giới thiệu tập thể lớp 12A3.</p>\n</main>\n<footer>© 2026 Lớp 12A3</footer>",
   "hint": "Đặt thẻ h1 bên trong header, thẻ p bên trong main; chữ trong h1 phải viết đúng y như đề.",
   "checks": [
    {
     "desc": "Trong header có thẻ h1 ghi đúng \"Trang lớp 12A3\"",
     "sel": "header h1",
     "get": "text"
    },
    {
     "desc": "Trong main có đoạn văn (thẻ p)",
     "sel": "main p",
     "get": "exists"
    },
    {
     "desc": "Có thẻ footer (chân trang)",
     "sel": "footer",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Dựng khung trang **CLB Tin học** đầy đủ hơn. Trong `header` đặt một thanh điều hướng `<nav>` chứa đúng **2 liên kết** `<a>` (ví dụ Giới thiệu, Hoạt động). Trong `main` đặt một thẻ `<section>` chứa nội dung. Cuối trang là thẻ `footer`.",
   "starter": "<header>\n  <nav>\n    <a href=\"#...\">...</a>\n    <a href=\"#...\">...</a>\n  </nav>\n</header>\n<main>\n  <section>...</section>\n</main>\n<footer>...</footer>",
   "solution": "<header>\n  <nav>\n    <a href=\"#gioi-thieu\">Giới thiệu</a>\n    <a href=\"#hoat-dong\">Hoạt động</a>\n  </nav>\n</header>\n<main>\n  <section>\n    <h2>Giới thiệu</h2>\n    <p>CLB Tin học sinh hoạt vào chiều thứ Tư hằng tuần.</p>\n  </section>\n</main>\n<footer>Trường THPT Nguyễn Du - 2026</footer>",
   "hint": "Đặt thẻ nav bên trong header và cho đúng 2 thẻ a vào trong nav; thẻ section nằm trong main.",
   "checks": [
    {
     "desc": "Trong header có thanh điều hướng nav",
     "sel": "header nav",
     "get": "exists"
    },
    {
     "desc": "nav chứa đúng 2 liên kết a",
     "sel": "nav a",
     "get": "count"
    },
    {
     "desc": "Trong main có thẻ section",
     "sel": "main section",
     "get": "exists"
    }
   ]
  }
 ],
 "U12-03": [
  {
   "mode": "html",
   "prompt": "Dựng **phần đầu trang** cho website lớp em. Tạo một thẻ `header`, bên trong đặt một thẻ tiêu đề `<h1>` ghi đúng chữ **Lớp 12A5 Chào Bạn**.",
   "starter": "<header>\n  <h1>...</h1>\n</header>",
   "solution": "<header>\n  <h1>Lớp 12A5 Chào Bạn</h1>\n</header>",
   "hint": "Đặt thẻ h1 nằm bên trong cặp thẻ header; chữ trong h1 phải viết đúng y như đề.",
   "checks": [
    {
     "desc": "Có thẻ header (phần đầu trang)",
     "sel": "header",
     "get": "exists"
    },
    {
     "desc": "Trong header có thẻ h1",
     "sel": "header h1",
     "get": "exists"
    },
    {
     "desc": "Tiêu đề h1 ghi đúng \"Lớp 12A5 Chào Bạn\"",
     "sel": "header h1",
     "get": "text"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Thêm **logo** cho phần đầu trang. Trong thẻ `header`, đặt một thẻ ảnh `<img>` làm logo với `src=\"logo.png\"` và `alt=\"Logo lớp 12A5\"`, kèm một thẻ `<h1>` ghi đúng chữ **Câu lạc bộ Bóng đá 12A5**. Thẻ ảnh phải có thuộc tính `alt` để mô tả logo.",
   "starter": "<header>\n  <img src=\"...\" alt=\"...\">\n  <h1>...</h1>\n</header>",
   "solution": "<header>\n  <img src=\"logo.png\" alt=\"Logo lớp 12A5\">\n  <h1>Câu lạc bộ Bóng đá 12A5</h1>\n</header>",
   "hint": "Thẻ img nằm trong header và cần cả hai thuộc tính src và alt; thẻ h1 ghi đúng chữ theo đề.",
   "checks": [
    {
     "desc": "Trong header có thẻ img (logo)",
     "sel": "header img",
     "get": "exists"
    },
    {
     "desc": "Thẻ img (logo) có thuộc tính alt \"Logo lớp 12A5\"",
     "sel": "header img",
     "get": "attr",
     "attr": "alt"
    },
    {
     "desc": "Trong header có thẻ h1 ghi đúng \"Câu lạc bộ Bóng đá 12A5\"",
     "sel": "header h1",
     "get": "text"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện **phần đầu trang giới thiệu bản thân**. Trong thẻ `header`: đặt một logo `<img>` với `src=\"avatar.png\"` và `alt=\"Ảnh đại diện của Minh\"`, một thẻ `<h1>` ghi đúng chữ **Góc học tập của Minh**, và một thẻ `<p>` viết một câu khẩu hiệu ngắn tuỳ ý (ví dụ về việc học).",
   "starter": "<header>\n  <img src=\"...\" alt=\"...\">\n  <h1>...</h1>\n  <p>...</p>\n</header>",
   "solution": "<header>\n  <img src=\"avatar.png\" alt=\"Ảnh đại diện của Minh\">\n  <h1>Góc học tập của Minh</h1>\n  <p>Mỗi ngày cố gắng một chút, thành công sẽ tới.</p>\n</header>",
   "hint": "Đặt đủ ba thẻ img, h1, p bên trong header; thẻ img cần thuộc tính alt, còn h1 ghi đúng chữ theo đề, p viết câu tuỳ ý.",
   "checks": [
    {
     "desc": "Logo là thẻ img nằm trong header có alt \"Ảnh đại diện của Minh\"",
     "sel": "header img",
     "get": "attr",
     "attr": "alt"
    },
    {
     "desc": "Trong header có thẻ h1 ghi đúng \"Góc học tập của Minh\"",
     "sel": "header h1",
     "get": "text"
    },
    {
     "desc": "Trong header có thẻ p (câu khẩu hiệu)",
     "sel": "header p",
     "get": "exists"
    }
   ]
  }
 ],
 "U12-04": [
  {
   "mode": "html",
   "prompt": "Xây dựng **phần thân** và **chân trang** cho trang giới thiệu của em. Dùng thẻ `main` cho phần nội dung chính, bên trong đặt một tiêu đề `<h2>` và một đoạn văn `<p>`. Dùng thẻ `footer` cho chân trang, ghi một dòng bản quyền.",
   "starter": "<main>\n  <h2>...</h2>\n  <p>...</p>\n</main>\n<footer>...</footer>",
   "solution": "<main>\n  <h2>Chào các bạn</h2>\n  <p>Mình là Lan, học sinh lớp 12A1, rất thích vẽ và đọc sách.</p>\n</main>\n<footer>© 2026 Trang cá nhân của Lan</footer>",
   "hint": "Đặt thẻ h2 và thẻ p bên trong cặp thẻ main; thẻ footer viết riêng ở dưới cùng.",
   "checks": [
    {
     "desc": "Trong main có tiêu đề h2",
     "sel": "main h2",
     "get": "exists"
    },
    {
     "desc": "Trong main có đoạn văn p",
     "sel": "main p",
     "get": "exists"
    },
    {
     "desc": "Có thẻ footer (chân trang)",
     "sel": "footer",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện thân trang **CLB Nhiếp ảnh 12A5**. Trong `main` đặt một `<h2>` ghi đúng chữ **Về câu lạc bộ** và **hai** đoạn văn `<p>` giới thiệu. Trong `footer` ghi đúng dòng bản quyền **© 2026 CLB Nhiếp ảnh 12A5**.",
   "starter": "<main>\n  <h2>...</h2>\n  <p>...</p>\n  <p>...</p>\n</main>\n<footer>...</footer>",
   "solution": "<main>\n  <h2>Về câu lạc bộ</h2>\n  <p>CLB Nhiếp ảnh sinh hoạt vào chiều thứ Năm hằng tuần.</p>\n  <p>Chúng mình cùng nhau chụp ảnh sân trường và học chỉnh sửa ảnh.</p>\n</main>\n<footer>© 2026 CLB Nhiếp ảnh 12A5</footer>",
   "hint": "Chữ trong h2 và trong footer phải viết đúng y như đề; đặt đủ hai thẻ p trong main.",
   "checks": [
    {
     "desc": "Trong main có h2 ghi đúng \"Về câu lạc bộ\"",
     "sel": "main h2",
     "get": "text"
    },
    {
     "desc": "Trong main có đúng 2 đoạn văn p",
     "sel": "main p",
     "get": "count"
    },
    {
     "desc": "footer ghi đúng dòng bản quyền",
     "sel": "footer",
     "get": "text"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Dựng thân và chân trang **Lớp 12A3** đầy đủ hơn. Trong `main` đặt một thẻ `<section>` chứa một `<h2>` và một `<p>` nói về lớp. Trong `footer` đặt một thẻ `<small>` ghi dòng bản quyền, và thêm một liên kết email bằng thẻ `<a>` có thuộc tính `href` bắt đầu bằng `mailto:`.",
   "starter": "<main>\n  <section>\n    <h2>...</h2>\n    <p>...</p>\n  </section>\n</main>\n<footer>\n  <small>...</small>\n  <a href=\"mailto:...\">...</a>\n</footer>",
   "solution": "<main>\n  <section>\n    <h2>Tập thể lớp 12A3</h2>\n    <p>Lớp 12A3 gồm 40 thành viên luôn đoàn kết và học tốt.</p>\n  </section>\n</main>\n<footer>\n  <small>© 2026 Lớp 12A3</small>\n  <a href=\"mailto:lop12a3@truong.edu.vn\">Liên hệ lớp</a>\n</footer>",
   "hint": "section nằm trong main và chứa h2 với p; trong footer đặt thẻ small và thẻ a có href là mailto:...",
   "checks": [
    {
     "desc": "Trong main có section chứa tiêu đề h2",
     "sel": "main section h2",
     "get": "exists"
    },
    {
     "desc": "Trong footer có thẻ small (dòng bản quyền)",
     "sel": "footer small",
     "get": "exists"
    },
    {
     "desc": "footer có liên kết email href bắt đầu bằng mailto:",
     "sel": "footer a",
     "get": "attr",
     "attr": "href"
    }
   ]
  }
 ],
 "U12-05": [
  {
   "mode": "html",
   "prompt": "Tạo một **thanh điều hướng** (menu) cho trang lớp em: dùng thẻ `<nav>`, bên trong đặt đúng **3 liên kết** `<a>` trỏ tới ba trang khác nhau. Ví dụ: **Trang chủ** (`index.html`), **Thời khoá biểu** (`tkb.html`), **Liên hệ** (`lienhe.html`).",
   "starter": "<nav>\n  <a href=\"...\">...</a>\n  <a href=\"...\">...</a>\n  <a href=\"...\">...</a>\n</nav>",
   "solution": "<nav>\n  <a href=\"index.html\">Trang chủ</a>\n  <a href=\"tkb.html\">Thời khoá biểu</a>\n  <a href=\"lienhe.html\">Liên hệ</a>\n</nav>",
   "hint": "Đặt cả ba thẻ a vào bên trong thẻ nav; mỗi thẻ a có thuộc tính href trỏ tới một tên tệp trang khác nhau.",
   "checks": [
    {
     "desc": "Có thẻ nav (thanh điều hướng)",
     "sel": "nav",
     "get": "exists"
    },
    {
     "desc": "Trong nav có đúng 3 liên kết a",
     "sel": "nav a",
     "get": "count"
    },
    {
     "desc": "Liên kết đầu tiên trỏ tới trang index.html",
     "sel": "nav a",
     "get": "attr",
     "attr": "href"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Làm menu cho trang **Câu lạc bộ Bóng đá 12A5**. Dùng thẻ `<nav>` chứa **3 liên kết** `<a>`: liên kết đầu ghi đúng chữ **Giới thiệu** và trỏ tới `gioithieu.html`; hai liên kết còn lại trỏ tới `lichthidau.html` và `thanhvien.html`.",
   "starter": "<nav>\n  <a href=\"...\">Giới thiệu</a>\n  <a href=\"...\">...</a>\n  <a href=\"...\">...</a>\n</nav>",
   "solution": "<nav>\n  <a href=\"gioithieu.html\">Giới thiệu</a>\n  <a href=\"lichthidau.html\">Lịch thi đấu</a>\n  <a href=\"thanhvien.html\">Thành viên</a>\n</nav>",
   "hint": "Liên kết đầu tiên vừa phải ghi đúng chữ Giới thiệu vừa có href là gioithieu.html; đủ 3 thẻ a trong nav.",
   "checks": [
    {
     "desc": "Trong nav có đúng 3 liên kết a",
     "sel": "nav a",
     "get": "count"
    },
    {
     "desc": "Liên kết đầu ghi đúng chữ \"Giới thiệu\"",
     "sel": "nav a",
     "get": "text"
    },
    {
     "desc": "Liên kết đầu trỏ tới gioithieu.html",
     "sel": "nav a",
     "get": "attr",
     "attr": "href"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện menu trang cá nhân của em. Đặt thanh điều hướng `<nav>` bên trong `header`. Trong `nav`, gói **3 liên kết** `<a>` vào một danh sách `<ul>` (mỗi liên kết nằm trong một `<li>`): **Trang chủ** (`index.html`), **Sở thích** (`sothich.html`), **Album ảnh** (`album.html`).",
   "starter": "<header>\n  <nav>\n    <ul>\n      <li><a href=\"...\">...</a></li>\n      <li><a href=\"...\">...</a></li>\n      <li><a href=\"...\">...</a></li>\n    </ul>\n  </nav>\n</header>",
   "solution": "<header>\n  <nav>\n    <ul>\n      <li><a href=\"index.html\">Trang chủ</a></li>\n      <li><a href=\"sothich.html\">Sở thích</a></li>\n      <li><a href=\"album.html\">Album ảnh</a></li>\n    </ul>\n  </nav>\n</header>",
   "hint": "Thứ tự lồng nhau là header > nav > ul > li > a; mỗi li chứa đúng một thẻ a có href riêng.",
   "checks": [
    {
     "desc": "Có nav nằm trong header",
     "sel": "header nav",
     "get": "exists"
    },
    {
     "desc": "Trong nav có đúng 3 mục danh sách li",
     "sel": "nav ul li",
     "get": "count"
    },
    {
     "desc": "Mỗi mục li có một liên kết a (đủ 3 liên kết)",
     "sel": "nav li a",
     "get": "count"
    }
   ]
  }
 ],
 "U12-06": [
  {
   "mode": "html",
   "prompt": "Tạo một **biểu mẫu** đăng ký tham gia CLB. Dùng thẻ `form`, bên trong đặt một ô nhập chữ `<input type=\"text\">` để nhập họ tên, và một nút gửi `<button>` ghi đúng chữ **Gửi**.",
   "starter": "<form>\n  <input type=\"text\">\n  <button type=\"submit\">...</button>\n</form>",
   "solution": "<form>\n  <input type=\"text\">\n  <button type=\"submit\">Gửi</button>\n</form>",
   "hint": "Đặt thẻ input và button bên trong cặp thẻ form; ô nhập cần thuộc tính type=\"text\".",
   "checks": [
    {
     "desc": "Có biểu mẫu (thẻ form)",
     "sel": "form",
     "get": "exists"
    },
    {
     "desc": "Có ô nhập chữ (input type=text)",
     "sel": "input[type=\"text\"]",
     "get": "exists"
    },
    {
     "desc": "Có nút gửi ghi đúng chữ \"Gửi\"",
     "sel": "button",
     "get": "text"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Làm biểu mẫu liên hệ có **nhãn**. Trong `form`, đặt một nhãn `<label>` ghi **Họ tên** rồi đến ô `<input type=\"text\">`; tiếp theo một nhãn `<label>` ghi **Email** rồi đến ô `<input type=\"email\">`. Cuối biểu mẫu thêm nút gửi `<button>` ghi **Gửi**.",
   "starter": "<form>\n  <label>...</label>\n  <input type=\"text\">\n  <label>...</label>\n  <input type=\"email\">\n  <button type=\"submit\">...</button>\n</form>",
   "solution": "<form>\n  <label>Họ tên</label>\n  <input type=\"text\">\n  <label>Email</label>\n  <input type=\"email\">\n  <button type=\"submit\">Gửi</button>\n</form>",
   "hint": "Mỗi ô nhập đi kèm một thẻ label đứng trước; ô email dùng type=\"email\".",
   "checks": [
    {
     "desc": "Có đúng 2 nhãn label",
     "sel": "label",
     "get": "count"
    },
    {
     "desc": "Có ô nhập email (input type=email)",
     "sel": "input[type=\"email\"]",
     "get": "exists"
    },
    {
     "desc": "Có nút gửi",
     "sel": "button",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện **biểu mẫu liên hệ** đầy đủ cho trang lớp em. Trong `form` đặt lần lượt: nhãn **Họ tên** + `<input type=\"text\">`; nhãn **Email** + `<input type=\"email\">`; nhãn **Lời nhắn** + vùng nhập nhiều dòng `<textarea>`; cuối cùng là nút gửi `<button>` ghi **Gửi lời nhắn**.",
   "starter": "<form>\n  <label>...</label>\n  <input type=\"text\">\n  <label>...</label>\n  <input type=\"email\">\n  <label>...</label>\n  <textarea></textarea>\n  <button type=\"submit\">...</button>\n</form>",
   "solution": "<form>\n  <label>Họ tên</label>\n  <input type=\"text\">\n  <label>Email</label>\n  <input type=\"email\">\n  <label>Lời nhắn</label>\n  <textarea></textarea>\n  <button type=\"submit\">Gửi lời nhắn</button>\n</form>",
   "hint": "Vùng nhập nhiều dòng dùng thẻ textarea (có thẻ mở và thẻ đóng); mỗi ô nhập có một label đứng trước.",
   "checks": [
    {
     "desc": "Có vùng nhập nhiều dòng (textarea)",
     "sel": "textarea",
     "get": "exists"
    },
    {
     "desc": "Có ô nhập email (input type=email)",
     "sel": "input[type=\"email\"]",
     "get": "exists"
    },
    {
     "desc": "Có đúng 3 nhãn label",
     "sel": "label",
     "get": "count"
    }
   ]
  }
 ],
 "U12-07": [
  {
   "mode": "html",
   "prompt": "Hoàn thiện một trang web đơn giản cho **Góc học tập lớp 12A5**. Trang cần đủ 4 phần: `header` (đầu trang), `nav` (thanh điều hướng), `main` (nội dung chính), `footer` (chân trang). Trong `main` đặt một thẻ `<h2>` và một thẻ `<p>`. Nội dung chữ em tự đặt cho hợp lí.",
   "starter": "<header>...</header>\n<nav>...</nav>\n<main>\n  <h2>...</h2>\n  <p>...</p>\n</main>\n<footer>...</footer>",
   "solution": "<header>Góc học tập lớp 12A5</header>\n<nav>Trang chủ | Tài liệu | Góp ý</nav>\n<main>\n  <h2>Chia sẻ tài liệu ôn thi</h2>\n  <p>Nơi các bạn trong lớp cùng chia sẻ đề cương và bài tập ôn tập.</p>\n</main>\n<footer>© 2026 Lớp 12A5</footer>",
   "hint": "Viết đủ bốn thẻ header, nav, main, footer; riêng bên trong main phải có một thẻ h2 rồi tới một thẻ p.",
   "checks": [
    {
     "desc": "Có thanh điều hướng nav",
     "sel": "nav",
     "get": "exists"
    },
    {
     "desc": "Trong main có tiêu đề phụ h2",
     "sel": "main h2",
     "get": "exists"
    },
    {
     "desc": "Trong main có đoạn văn p",
     "sel": "main p",
     "get": "exists"
    },
    {
     "desc": "Có chân trang footer",
     "sel": "footer",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện trang **CLB Nhiếp ảnh** với thanh điều hướng có liên kết. Trong `header` đặt thẻ `<h1>` ghi đúng chữ **CLB Nhiếp ảnh 12A5**. Trong `nav` đặt đúng **3 liên kết** `<a>` (ví dụ Giới thiệu, Bộ ảnh, Liên hệ). Trong `main` đặt một `<h2>` và một `<p>`. Cuối trang là `footer`.",
   "starter": "<header>\n  <h1>...</h1>\n</header>\n<nav>\n  <a href=\"#...\">...</a>\n  <a href=\"#...\">...</a>\n  <a href=\"#...\">...</a>\n</nav>\n<main>\n  <h2>...</h2>\n  <p>...</p>\n</main>\n<footer>...</footer>",
   "solution": "<header>\n  <h1>CLB Nhiếp ảnh 12A5</h1>\n</header>\n<nav>\n  <a href=\"#gioi-thieu\">Giới thiệu</a>\n  <a href=\"#bo-anh\">Bộ ảnh</a>\n  <a href=\"#lien-he\">Liên hệ</a>\n</nav>\n<main>\n  <h2>Buổi chụp ảnh cuối tuần</h2>\n  <p>CLB tổ chức đi chụp ảnh tại công viên vào sáng Chủ nhật hằng tuần.</p>\n</main>\n<footer>Liên hệ: clbnhiepanh12a5@truong.edu.vn</footer>",
   "hint": "Đặt thẻ h1 trong header; cho đúng 3 thẻ a vào trong nav; trong main có h2 rồi tới p.",
   "checks": [
    {
     "desc": "Trong header có thẻ h1 ghi đúng \"CLB Nhiếp ảnh 12A5\"",
     "sel": "header h1",
     "get": "text"
    },
    {
     "desc": "Thanh nav chứa đúng 3 liên kết a",
     "sel": "nav a",
     "get": "count"
    },
    {
     "desc": "Trong main có tiêu đề phụ h2",
     "sel": "main h2",
     "get": "exists"
    },
    {
     "desc": "Trong main có đoạn văn p",
     "sel": "main p",
     "get": "exists"
    }
   ]
  },
  {
   "mode": "html",
   "prompt": "Hoàn thiện và kiểm thử trang **Giới thiệu bản thân**. Yêu cầu: `header` chứa `<h1>` ghi tên em (chữ tuỳ ý). `nav` chứa đúng **3 liên kết** `<a>`, trong đó liên kết đầu phải có thuộc tính `href` bằng đúng `#gioi-thieu`. `main` chứa một `<h2>` ghi đúng chữ **Sở thích của em** và một `<p>` mô tả. Cuối trang là `footer` chứa một `<p>` ghi dòng bản quyền.",
   "starter": "<header>\n  <h1>...</h1>\n</header>\n<nav>\n  <a href=\"#gioi-thieu\">...</a>\n  <a href=\"#...\">...</a>\n  <a href=\"#...\">...</a>\n</nav>\n<main>\n  <h2>...</h2>\n  <p>...</p>\n</main>\n<footer>\n  <p>...</p>\n</footer>",
   "solution": "<header>\n  <h1>Trang của Nguyễn Minh An</h1>\n</header>\n<nav>\n  <a href=\"#gioi-thieu\">Giới thiệu</a>\n  <a href=\"#so-thich\">Sở thích</a>\n  <a href=\"#lien-he\">Liên hệ</a>\n</nav>\n<main>\n  <h2>Sở thích của em</h2>\n  <p>Em thích đọc sách, chơi cầu lông và tự học lập trình web.</p>\n</main>\n<footer>\n  <p>© 2026 Nguyễn Minh An</p>\n</footer>",
   "hint": "Liên kết đầu trong nav cần viết href=\"#gioi-thieu\"; thẻ h2 trong main phải ghi đúng \"Sở thích của em\"; nhớ đặt một thẻ p bên trong footer.",
   "checks": [
    {
     "desc": "Liên kết đầu trong nav có href đúng \"#gioi-thieu\"",
     "sel": "nav a",
     "get": "attr",
     "attr": "href"
    },
    {
     "desc": "Thanh nav chứa đúng 3 liên kết a",
     "sel": "nav a",
     "get": "count"
    },
    {
     "desc": "Trong main có h2 ghi đúng \"Sở thích của em\"",
     "sel": "main h2",
     "get": "text"
    },
    {
     "desc": "Trong footer có đoạn văn p (dòng bản quyền)",
     "sel": "footer p",
     "get": "exists"
    }
   ]
  }
 ]
};
  Object.keys(ADD).forEach(function (k) { window.WEB_EXERCISES[k] = ADD[k]; });
})();
