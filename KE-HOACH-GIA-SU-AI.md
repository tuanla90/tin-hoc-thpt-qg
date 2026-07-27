# Kế hoạch: Gia sư AI bám đúng nội dung từng bài

> Mục tiêu: người tự học đang đọc bài nào thì hỏi được ngay về bài đó, và khi
> làm sai câu nào thì hỏi được "vì sao tôi sai". Gia sư **chỉ dạy trong phạm vi
> bài đang mở**, không biến thành chatbot vạn năng.

## 1. Vì sao đáng làm

- Người học mục tiêu **không có thầy cô bên cạnh** — đây là lúc kẹt thì bỏ cuộc.
- Nội dung đã có sẵn dạng dữ liệu sạch: mỗi bài có `intro`, `sections`,
  `keypoints`, `quiz` → đưa thẳng vào ngữ cảnh, không cần dựng cơ sở tri thức.
- Là **lý do rõ ràng để trả tiền**: bản miễn phí không có gia sư, hoặc giới hạn
  số lượt/ngày.

## 2. Ba chỗ đặt gia sư (làm theo thứ tự)

| # | Chỗ đặt | Người học đang cần gì | Ngữ cảnh gửi cho AI |
|---|---|---|---|
| 1 | **Trong trang bài học** — nút "Hỏi gia sư" cạnh "Đánh dấu đã học" | Đọc mà chưa hiểu một đoạn | Toàn bộ nội dung bài đó |
| 2 | **Sau khi chấm một câu sai** — nút "Vì sao tôi sai?" | Biết đáp án rồi mà chưa hiểu | Câu hỏi + đáp án + lời giải + bài nguồn |
| 3 | **Trong bài thực hành code** — nút "Gợi ý" khi chạy sai | Code không chạy / sai kết quả | Đề bài + code người học + lỗi + đáp án mẫu |

Bắt đầu từ (1) và (2) — dùng chung một API, khác nhau ở ngữ cảnh.

## 3. Kiến trúc

```
Trình duyệt                        Máy chủ (Railway)              Anthropic API
────────────                       ─────────────────              ─────────────
js/tutor.js                        POST /api/tutor
 - mở bảng chat        ──────────>  - kiểm đăng nhập
 - gửi {lessonId,                   - kiểm hạn mức ngày
    câu hỏi, lịch sử}               - tự dựng ngữ cảnh từ
 - hiện câu trả lời    <──────────    LESSONS_SERVER[lessonId]  ──────>  Claude
                        (stream)    - ghi log lượt dùng          <──────
```

**Nguyên tắc bắt buộc:** khoá API **chỉ nằm ở máy chủ**. Không bao giờ gọi thẳng
Anthropic từ trình duyệt — lộ khoá là mất tiền.

**Ngữ cảnh do máy chủ tự dựng, không tin client:** client chỉ gửi `lessonId`;
máy chủ tự tra nội dung bài. Nếu để client gửi cả nội dung thì người dùng sửa
được payload và biến gia sư thành chatbot miễn phí.

### Nội dung bài ở phía máy chủ

Bài học hiện nằm trong `public/js/clean-*.js` (dạng `LESSONS.push([...])`).
Máy chủ đọc lại bằng đúng cách đã dùng trong `scratchpad/load-data.js`: chạy tệp
trong `vm` với DOM giả, lấy mảng `LESSONS`, nạp một lần lúc khởi động vào bộ nhớ.
Không cần chép nội dung sang DB.

## 4. Prompt và rào chắn

```
Bạn là gia sư môn Tin học THPT, đang kèm một người TỰ HỌC ôn thi tốt nghiệp.

Người học đang đọc bài: "<title>" (lớp <grade>).
Nội dung bài:
<intro + các mục + ý cần nhớ + ví dụ code>

Quy tắc:
1. CHỈ trả lời dựa trên nội dung bài trên. Hỏi ngoài phạm vi thì nói thẳng là
   bài này không bàn tới, chỉ tên bài có nội dung đó rồi mời họ mở bài ấy.
2. KHÔNG làm hộ bài tập. Gợi ý từng bước, hỏi ngược lại để họ tự nghĩ.
3. Giải thích dễ hiểu, xưng "bạn" và "ta", KHÔNG trẻ con. Thuật ngữ tiếng Anh
   kèm nghĩa tiếng Việt.
4. Trả lời ngắn (dưới 200 chữ) trừ khi được yêu cầu nói kỹ.
5. Nếu bài có ví dụ code, ưu tiên giải thích bằng chính ví dụ đó.
```

Rào chắn thêm ở máy chủ:
- Cắt độ dài câu hỏi (≤ 500 ký tự) và lịch sử hội thoại (≤ 6 lượt gần nhất).
- Chặn câu hỏi rỗng/spam ký tự.
- Không nhận `system` từ client.

## 5. Chi phí và hạn mức

Mỗi lượt hỏi ≈ 2 000 token vào (nội dung bài) + 300 token ra.

| Hạng | Hạn mức | Ước tính chi phí/tháng |
|---|---|---|
| Miễn phí | 5 lượt/ngày | rất nhỏ, coi như chi phí tiếp thị |
| Trả phí | 50 lượt/ngày | vài nghìn đồng/học sinh/tháng |

Việc cần làm: bảng `tutor_usage(user_id, ngay, so_luot)`, kiểm trước khi gọi;
hết hạn mức thì trả 429 kèm thông điệp mời nâng cấp. Dùng model rẻ (Haiku) cho
câu hỏi ngắn, model mạnh hơn khi người học bấm "giải thích kỹ hơn".

## 6. Các bước làm

### Bước 1 — Máy chủ (nửa buổi)
- [ ] `server/lessons.js`: nạp `LESSONS` từ `public/js/clean-*.js` bằng `vm`, dựng `Map` theo id.
- [ ] `server/tutor.js`: `POST /api/tutor` — kiểm đăng nhập, kiểm hạn mức, dựng prompt, gọi Anthropic, trả **stream**.
- [ ] Biến môi trường `ANTHROPIC_API_KEY` trên Railway. Thiếu khoá thì API trả 503 và nút gia sư tự ẩn.
- [ ] Bảng `tutor_usage` + `tutor_log` (lưu câu hỏi để sau này biết người học hay kẹt chỗ nào — **rất giá trị để cải tiến bài giảng**).

### Bước 2 — Giao diện trong bài học (nửa buổi)
- [ ] `public/js/tutor.js`: bảng chat trượt từ phải, nút "Hỏi gia sư" trong `renderLesson`.
- [ ] 3 câu hỏi gợi ý sẵn để người học đỡ ngại: "Giải thích lại mục này dễ hơn", "Cho tôi một ví dụ khác", "Phần này hay bị hỏi thế nào trong đề?".
- [ ] Hiện câu trả lời theo kiểu gõ dần (stream), có nút dừng.
- [ ] Chưa đăng nhập → mời đăng nhập; hết lượt → mời nâng cấp.

### Bước 3 — "Vì sao tôi sai?" (nửa buổi)
- [ ] Ở màn chấm câu (`renderExplain`), thêm nút mở gia sư với ngữ cảnh câu hỏi + đáp án + lời giải + bài nguồn.

### Bước 4 — Gợi ý bài thực hành code (nửa buổi, làm sau)
- [ ] Trong `clean-exercises.js`/`sql-run.js`, khi chấm sai 2 lần → hiện "Gợi ý từ gia sư" gửi kèm code người học và thông báo lỗi.

### Bước 5 — Vận hành
- [ ] Chặn lạm dụng: giới hạn theo IP + theo tài khoản.
- [ ] Xem log hằng tuần: câu hỏi nào lặp nhiều → **sửa luôn bài giảng cho rõ hơn**.

## 7. Rủi ro và cách chặn

| Rủi ro | Cách chặn |
|---|---|
| Lộ khoá API | Chỉ gọi từ máy chủ; không bao giờ đưa khoá xuống client |
| Bị lạm dụng làm chatbot miễn phí | Ngữ cảnh do máy chủ dựng; hạn mức theo tài khoản; bắt đăng nhập |
| AI trả lời sai kiến thức | Ép chỉ dùng nội dung bài; nói rõ "chưa chắc thì bảo không biết"; ghi log để rà |
| AI làm hộ bài tập | Prompt cấm; ở bài tập chỉ cho gợi ý, không cho đáp án |
| Chi phí vượt dự tính | Hạn mức ngày + model rẻ mặc định + cắt độ dài ngữ cảnh |
| Học sinh hỏi chuyện ngoài học | Prompt yêu cầu từ chối lịch sự và kéo về bài |

## 8. Đo hiệu quả

- Bao nhiêu % người học dùng gia sư ít nhất 1 lần?
- Người dùng gia sư có **học tiếp** nhiều hơn người không dùng không? (so số bài học xong sau 7 ngày)
- Câu hỏi lặp nhiều nhất thuộc bài nào → xếp hàng chờ sửa bài giảng.

## 9. Cần chốt trước khi làm

1. **Model**: mặc định Haiku cho rẻ, nâng lên Sonnet khi bấm "giải thích kỹ hơn"? (đề xuất: có)
2. **Miễn phí bao nhiêu lượt/ngày** để vừa hấp dẫn vừa không tốn? (đề xuất: 5)
3. **Có lưu lại nội dung hội thoại không?** Nên lưu để cải tiến bài giảng, nhưng phải ghi rõ trong phần Quyền riêng tư vì người học là học sinh.
