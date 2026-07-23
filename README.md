# 💻 Phần mềm Ôn thi Tin học THPT Quốc gia

Phần mềm luyện thi môn **Tin học** kỳ thi Tốt nghiệp THPT Quốc gia, **định hướng
Khoa học máy tính (KHMT)**, bám sát **Chương trình GDPT 2018** và **cấu trúc đề
chính thức từ 2025**. Ngân hàng câu hỏi phủ **lớp 10 – 11 – 12, trọng tâm lớp 12**.
Chạy trực tiếp trên trình duyệt, **không cần cài đặt, không cần Internet**.

---

## 🚀 Cách chạy

**Cách 1 — Nhanh nhất:** Nhấp đúp vào tệp `index.html` để mở bằng trình duyệt
(Chrome, Edge, Firefox...).

**Cách 2 — Chạy như một trang web nội bộ (khuyến nghị):** Mở PowerShell tại thư
mục này và gõ:

```powershell
python -m http.server 8000
```

Sau đó mở trình duyệt và truy cập: <http://localhost:8000>

---

## ✨ Tính năng

| Chế độ | Mô tả |
|--------|-------|
| 📖 **Học lý thuyết** | **Lộ trình 25 bài tự học từ đầu** (lớp 10→12): lý thuyết, ví dụ code, **kể chuyện dễ hiểu**, tóm tắt cần nhớ, **bài thực hành tự viết code có máy chấm** (điền chỗ trống / tự code). Lưu tiến độ, "Luyện tập bài này" ngay sau khi học. |
| 💻 **Thực hành code** | **Viết & chạy Python** (offline bằng Skulpt) và **xem trước HTML/CSS trực tiếp** (như DataCamp/W3Schools). Có khu code tự do (chuyển Python ↔ HTML/CSS) + nút "▶ Chạy thử / Xem thử" ngay dưới mỗi ví dụ trong bài. |
| 📝 **Thi thử** | Đề đầy đủ 28 câu (**24 trắc nghiệm + 4 đúng/sai**), **tính giờ 50 phút**, chấm điểm theo thang 10 như thi thật. |
| 🎯 **Luyện tập theo chủ đề** | Lọc theo chủ đề, dạng câu, mức độ. **Hiện đáp án và lời giải ngay** sau mỗi câu. |
| ⚡ **Luyện nhanh** | 10 câu ngẫu nhiên để khởi động. |
| 📊 **Kết quả & Tiến độ** | Lưu lịch sử làm bài, điểm cao nhất, điểm trung bình (lưu trên máy bạn). |

Ngoài ra: giao diện **sáng/tối**, bảng đánh dấu câu hỏi, đánh dấu 🚩 câu cần
xem lại, xem lời giải chi tiết từng câu.

---

## 🎯 Cấu trúc đề & cách tính điểm (thi thử)

Đúng cấu trúc chính thức đề Tin học THPT từ 2025 — **chỉ 2 phần, không có trả lời ngắn**:

- **Phần I** — Trắc nghiệm nhiều lựa chọn: 24 câu × 0,25đ = **6,0đ**
- **Phần II** — Đúng/Sai (mỗi câu 4 ý): đúng 1 ý = 0,1đ · 2 ý = 0,25đ · 3 ý = 0,5đ · 4 ý = 1,0đ → tối đa **4,0đ**
- **Tổng: 28 câu, 10 điểm, 50 phút**

> Các câu *trả lời ngắn* trong ngân hàng không nằm trong đề thi thử (đúng chuẩn Tin học) nhưng vẫn được dùng ở chế độ **Luyện tập**.

> Muốn đổi số câu hoặc thời gian? Sửa `EXAM_CONFIG` ở đầu tệp `js/app.js`.

---

## 📐 Ma trận phân bổ đề thi thử

Mỗi đề thi thử được **tự sinh theo ma trận** (không ngẫu nhiên lệch), phân bổ theo
chủ đề như sau — có thể chỉnh trong `EXAM_MATRIX` (tệp `js/app.js`):

| Chủ đề | Trắc nghiệm | Đúng/Sai |
|--------|:--:|:--:|
| A. Máy tính, dữ liệu & số hóa | 3 | – |
| B. Mạng, Internet & IoT | 3 | – |
| C. Tổ chức, tìm kiếm thông tin | 1 | – |
| D. Đạo đức, pháp luật & an toàn TT | 3 | – |
| E. Ứng dụng & Thiết kế web | 3 | 1 |
| F. Lập trình, Thuật toán & CTDL (KHMT) | 9 | 3 |
| G. Trí tuệ nhân tạo & Học máy | 2 | – |
| **Tổng** | **24** | **4** |

- **Mức độ** (nhãn trong phần mềm): **Nhận biết – Thông hiểu – Vận dụng**.
- **Phạm vi lớp:** phủ 10–11–12, **trọng tâm lớp 12** (~45% số câu). Có thể lọc
  riêng theo lớp trong chế độ Luyện tập.

---

## 📚 Các chủ đề (định hướng Khoa học máy tính)

- **A.** Máy tính, dữ liệu & số hóa *(nền tảng lớp 10)*
- **B.** Mạng máy tính, Internet & IoT
- **C.** Tổ chức, lưu trữ & tìm kiếm thông tin
- **D.** Đạo đức, pháp luật & an toàn thông tin
- **E.** Ứng dụng tin học & Thiết kế web (HTML/CSS) *(lớp 12)*
- **F.** Lập trình, Thuật toán & CTDL — **trọng tâm KHMT** (đệ quy, độ phức tạp, sắp xếp/tìm kiếm, stack/queue)
- **G.** Trí tuệ nhân tạo & Học máy *(lớp 12)*

---

## ➕ Thêm câu hỏi của riêng bạn

Mở tệp `js/questions.js` và thêm câu hỏi mới vào mảng `QUESTION_BANK` theo mẫu:

> `grade`: **10 | 11 | 12** — `level`: **easy** (Nhận biết) · **medium** (Thông hiểu) · **hard** (Vận dụng).

```js
// Trắc nghiệm 4 lựa chọn
{
  id: "F-mc-99", type: "mc", topic: "F", grade: 12, level: "easy",
  question: "Câu hỏi của bạn?",
  options: ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
  answer: 0,                    // chỉ số đáp án đúng (0 = A, 1 = B, ...)
  explain: "Lời giải thích.",
}

// Đúng/Sai (4 ý)
{
  id: "F-tf-99", type: "tf", topic: "F", grade: 12, level: "medium",
  question: "Cho đoạn chương trình sau:",
  code: "x = 5\nprint(x)",       // tùy chọn: khối mã hiển thị
  statements: [
    { text: "Ý a", correct: true },
    { text: "Ý b", correct: false },
    { text: "Ý c", correct: true },
    { text: "Ý d", correct: false },
  ],
  explain: "Lời giải thích.",
}

// Trả lời ngắn (chỉ dùng ở chế độ Luyện tập)
{
  id: "F-sa-99", type: "sa", topic: "F", grade: 11, level: "hard",
  question: "Kết quả của 2 + 2 là bao nhiêu?",
  answer: "4",
  accept: ["bốn"],              // tùy chọn: các cách viết khác được chấp nhận
  explain: "Lời giải thích.",
}
```

Lưu lại và tải lại trang là xong.

---

## 📁 Cấu trúc thư mục

```
tin_hoc/
├── index.html          # Trang chính
├── css/styles.css      # Giao diện
├── js/
│   ├── questions.js       # Ngân hàng câu hỏi (157 câu)
│   ├── lessons.js         # 20 bài học lý thuyết
│   ├── lessons-extra.js   # 5 bài học bổ sung (mã hóa, xâu, mảng 2D, thiết kế thuật toán, gỡ lỗi)
│   ├── exercises.js       # Bài thực hành tự viết code (máy tự chấm kết quả)
│   ├── app.js             # Toàn bộ logic ứng dụng
│   └── vendor/            # Skulpt (trình chạy Python offline) — không cần sửa
└── README.md           # Tài liệu này
```

---

*Chúc bạn ôn thi hiệu quả và đạt điểm cao! 🎓*
