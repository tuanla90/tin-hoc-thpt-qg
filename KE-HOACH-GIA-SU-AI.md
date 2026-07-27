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

## 2b. Đã chốt (28/07)

| Việc | Chốt |
|---|---|
| Khoá API, tên model | Đặt trong **Variables của Railway**, không nằm trong mã nguồn |
| Nhà cung cấp AI | **Cả Claude và Gemini**, đổi được bằng biến môi trường |
| Hạn mức miễn phí | 5 lượt/ngày (trả phí 50) |
| Lưu hội thoại | **Có**, đặc biệt lưu **câu trả lời sai** để phân tích |
| Hồ sơ năng lực | Biểu đồ **radar 7 chủ đề** như chỉ số nhân vật game |
| Chuyên đề | Tự sinh **bộ ôn tập nhắm vào mảng yếu nhất** |

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
nhà cung cấp AI từ trình duyệt — lộ khoá là mất tiền.

### Đổi nhà cung cấp bằng biến môi trường

`server/ai/index.js` chọn nhà cung cấp theo `AI_PROVIDER`; mỗi nhà cung cấp là
một tệp cùng khuôn, nhận `{system, messages, maxTokens}` và trả **luồng chữ**:

```
server/ai/
├── index.js        // chọn theo AI_PROVIDER, đọc hạn mức, gom log
├── claude.js       // POST https://api.anthropic.com/v1/messages  (stream SSE)
└── gemini.js       // POST .../v1beta/models/<model>:streamGenerateContent
```

Biến môi trường đặt trên Railway:

| Biến | Ví dụ | Ghi chú |
|---|---|---|
| `AI_PROVIDER` | `claude` hoặc `gemini` | Thiếu ⇒ tắt tính năng, nút gia sư tự ẩn |
| `AI_API_KEY` | `sk-ant-...` / `AIza...` | Khoá của nhà cung cấp đang chọn |
| `AI_MODEL` | `claude-haiku-4-5-20251001` / `gemini-2.5-flash` | Model dùng hằng ngày |
| `AI_MODEL_DEEP` | model mạnh hơn | Dùng khi bấm “giải thích kỹ hơn” |
| `AI_FREE_PER_DAY` | `5` | Hạn mức bản miễn phí |
| `AI_PAID_PER_DAY` | `50` | Hạn mức bản trả phí |

Khác biệt phải xử lý trong lớp bọc (không để lộ ra ngoài):

- **Claude**: `system` là tham số riêng; luồng trả về SSE `content_block_delta`.
- **Gemini**: không có `system` riêng ⇒ đưa vào `systemInstruction`; vai trò
  `assistant` gọi là `model`; luồng trả về JSON nối tiếp, phải tự ghép.
- Tên lỗi và mã hạn mức khác nhau ⇒ quy về một kiểu lỗi chung của ta.

Đổi nhà cung cấp = đổi biến trên Railway rồi khởi động lại, **không sửa mã**.

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

## 5b. Hồ sơ năng lực dạng RADAR + chuyên đề nhắm mảng yếu

> Phần này **không cần AI**, làm được ngay và là nền dữ liệu cho gia sư sau này.

### Việc bắt buộc làm trước: ghi lại chi tiết từng câu

Hiện `record` lịch sử chỉ lưu tổng điểm (`score`, `correctCount`, `total`) — **không
biết sai ở chủ đề nào**, nên không vẽ được radar. Phải bổ sung vào `doSubmit`:

```js
detail: Q.questions.map((q, i) => ({
  id: q.id, topic: q.topic, grade: q.grade, level: q.level,
  lessonId: Q.lessonId || null,
  dung: isAnswerCorrect(q, Q.answers[i]),
}))
```

Bảng `attempts` phía máy chủ đã có cột `detail JSONB` nên **không phải đổi CSDL**.
Dữ liệu chỉ tích luỹ từ lúc bật, nên bật càng sớm càng tốt.

### Chỉ số năng lực (giống chỉ số nhân vật game)

7 trục = 7 chủ đề A–G. Mỗi trục tính từ các câu đã làm:

```
điểm trục = tỉ lệ đúng (0-100), tính trên tối đa 40 câu GẦN NHẤT của chủ đề đó
```

- Lấy câu gần nhất để chỉ số **phản ánh trình độ hiện tại**, không bị kéo bởi
  những lần làm sai từ hồi mới học.
- Dưới 5 câu ⇒ hiện là “chưa đủ dữ liệu” (trục mờ), tránh kết luận vội.
- Kèm nhãn cho vui mắt, đúng tinh thần game: 0–39 “Cần luyện thêm”, 40–59
  “Đang lên”, 60–79 “Khá vững”, 80–100 “Thành thạo”.

Vẽ bằng **SVG thuần** (không thêm thư viện): 7 đỉnh, lưới 4 vòng, tô vùng năng
lực, chấm tròn ở mỗi đỉnh. Đặt ở trang **Thành tựu**, cạnh cấp độ và huy hiệu.

### Chuyên đề nhắm mảng yếu

- Trang chủ hiện thẻ: *“Chủ đề yếu nhất của bạn: **D. Đạo đức & an toàn** (48%)”*
  kèm nút **“Luyện 10 câu chỗ yếu”**.
- Bộ câu được chọn theo thứ tự ưu tiên:
  1. Câu **đã làm sai** trong chủ đề đó (ôn lại đúng chỗ vấp) — chiếm ~60%;
  2. Câu **chưa từng làm** cùng chủ đề, ưu tiên mức độ kế tiếp trình độ hiện tại;
  3. Nếu vẫn thiếu thì lấy thêm câu cùng chủ đề.
- Sau khi luyện, radar cập nhật ngay ⇒ người học **thấy trục đó dài ra**, đúng
  cảm giác “lên chỉ số” của game.
- Thêm một tab **“Chỗ yếu”** vào trang Luyện tập (cạnh Theo bài / chương / chủ
  đề / lớp) để vào lại bất cứ lúc nào.

### Vì sao lưu lỗi sai lại quan trọng

Ba tác dụng, xếp theo giá trị:

1. **Cho người học**: ôn lại đúng câu từng sai — cách ôn hiệu quả nhất.
2. **Cho người soạn bài**: câu nào cả trăm người cùng sai thì hoặc bài giảng
   chưa rõ, hoặc câu hỏi có vấn đề ⇒ có danh sách việc cần sửa dựa trên số liệu.
3. **Cho gia sư AI**: biết người học vừa sai gì để giải thích trúng chỗ hổng.

## 6. Các bước làm

### ✅ Bước 0 — Ghi chi tiết bài làm — XONG (28/07)
- [x] `doSubmit` ghi thêm `detail[]` (từng câu: id, chủ đề, lớp, mức độ, đúng/sai).
- [x] Dữ liệu bắt đầu tích luỹ từ nay; bản ghi cũ không có `detail` vẫn chạy bình thường.

### ✅ Bước 0b — Radar + chuyên đề chỗ yếu — XONG (28/07)
- [x] `public/js/skills.js`: chỉ số 7 trục (40 câu gần nhất, ngưỡng 5 câu), radar SVG ở trang Thành tựu.
- [x] Thẻ “Chỗ yếu của bạn” ở trang chủ + tab “Chỗ yếu” trong trang Luyện tập.
- [x] Bộ câu ưu tiên ~60% câu đã từng làm sai.

### ✅ Bước 1 — Máy chủ — XONG (29/07)
- [x] `server/lessons.js`: nạp `LESSONS` + `QUESTION_BANK` bằng `vm` (DOM giả), dựng `Map` theo id. Nạp **lười** ở lần hỏi đầu, ~280 ms, 119 bài / 1851 câu.
- [x] `server/ai/{index,claude,gemini}.js` + `sse.js` (bộ đọc SSE dùng chung) + `mock.js` (nhà cung cấp giả để chạy thử/test, không cần khoá, không tốn tiền).
- [x] `server/tutor.js`: `POST /api/tutor` — kiểm đăng nhập → kiểm hạn mức → dựng ngữ cảnh ở máy chủ → gọi AI → trả **luồng NDJSON**; `GET /api/tutor/status` cho giao diện biết có bật AI không và còn mấy lượt.
- [x] Biến môi trường (bảng ở mục 3), mẫu sẵn trong `.env.example`. Thiếu `AI_PROVIDER`/`AI_API_KEY` ⇒ `status` trả `{on:false}` và **nút gia sư tự gỡ khỏi trang**.
- [x] Bảng `tutor_usage` (đếm lượt/ngày, khoá theo **tài khoản** chứ không theo hồ sơ) + `tutor_log` (câu hỏi, câu trả lời, bài, câu sai).
- [x] `server/test/tutor.test.js`: 11 test với `AI_PROVIDER=mock` — rào chắn, hạn mức, cách ly tài khoản, ngữ cảnh dựng ở máy chủ.

### ✅ Bước 2 — Giao diện trong bài học — XONG (29/07)
- [x] `public/js/tutor.js`: bảng chat trượt từ phải (nền mờ, đóng bằng Esc), nút "Hỏi gia sư" trong `renderLesson`.
- [x] 3 câu hỏi gợi ý sẵn; sau mỗi câu trả lời hiện tiếp "Giải thích kỹ hơn" (dùng `AI_MODEL_DEEP`) và "Cho ví dụ dễ hình dung hơn".
- [x] Chữ hiện dần theo luồng; nút gửi biến thành nút dừng khi đang chảy.
- [x] Chưa đăng nhập → mời đăng nhập; hết lượt → báo số lượt và mời quay lại mai + gợi ý sang mục "Chỗ yếu".
- [x] Bộ hiển thị markdown rút gọn (đậm, mã, gạch đầu dòng, khối code) — escape trước, không bao giờ nhét chữ thô vào `innerHTML`.

### ✅ Bước 3 — "Vì sao tôi sai?" — XONG (29/07)
- [x] `renderExplain` thêm nút **"Vì sao tôi sai?"**, chỉ hiện khi làm SAI (làm đúng thì đừng chen ngang, và đỡ tốn lượt).
- [x] Máy chủ tự tra câu hỏi trong `QUESTION_BANK` theo `questionId`, dựng ngữ cảnh gồm đề bài + các phương án + **đáp án đúng** + **lựa chọn của học sinh** + lời giải sẵn có, rồi yêu cầu AI chỉ ra chỗ hiểu nhầm chứ không nhắc lại đáp án.
- [x] Ghi `tutor_log` với `kieu='wrong'` kèm `question_id` — đây chính là dữ liệu để rà câu nào cả trăm người cùng sai.

### Bước 4 — Gợi ý bài thực hành code (nửa buổi, làm sau)
- [ ] Trong `clean-exercises.js`/`sql-run.js`, khi chấm sai 2 lần → hiện "Gợi ý từ gia sư" gửi kèm code người học và thông báo lỗi.

### Bước 5 — Vận hành
- [x] Hạn mức theo **tài khoản** mỗi ngày (trừ lượt trước khi gọi AI, hoàn lại nếu nhà cung cấp lỗi ngay).
- [ ] Thêm giới hạn theo IP (hiện mới có ở đăng nhập/đăng ký).
- [ ] Xem log hằng tuần: câu hỏi nào lặp nhiều → **sửa luôn bài giảng cho rõ hơn**.

### Bật thật trên Railway (khi có khoá)

Đặt trong tab **Variables** của service web rồi Redeploy — không sửa mã:

| Dùng Claude | Dùng Gemini |
|---|---|
| `AI_PROVIDER=claude` | `AI_PROVIDER=gemini` |
| `AI_API_KEY=` khoá Anthropic | `AI_API_KEY=` khoá Google AI Studio |
| `AI_MODEL=claude-haiku-4-5-20251001` | `AI_MODEL=gemini-2.5-flash` |
| `AI_MODEL_DEEP=claude-sonnet-5` | `AI_MODEL_DEEP=gemini-2.5-pro` |

Chạy thử ở máy mà không tốn tiền: đặt `AI_PROVIDER=mock` trong `.env` — gia sư
trả lời sẵn một đoạn mẫu, đủ để xem giao diện, hạn mức và nhật ký chạy đúng.

## 7. Rủi ro và cách chặn

| Rủi ro | Cách chặn |
|---|---|
| Lộ khoá API | Chỉ gọi từ máy chủ; không bao giờ đưa khoá xuống client |
| Bị lạm dụng làm chatbot miễn phí | Ngữ cảnh do máy chủ dựng; hạn mức theo tài khoản; bắt đăng nhập |
| Bịa lịch sử hội thoại để lách luật | Client gửi được `history` nên **có thể bịa lượt "assistant"**. Chấp nhận có kiểm soát: luật hệ thống gửi lại mỗi lượt, lịch sử cắt còn 6 lượt × 2000 ký tự, vẫn trừ hạn mức và vẫn ghi log ⇒ thiệt hại tối đa là vài lượt/ngày và soi ra được ở `tutor_log` |
| AI trả lời sai kiến thức | Ép chỉ dùng nội dung bài; nói rõ "chưa chắc thì bảo không biết"; ghi log để rà |
| AI làm hộ bài tập | Prompt cấm; ở bài tập chỉ cho gợi ý, không cho đáp án |
| Chi phí vượt dự tính | Hạn mức ngày + model rẻ mặc định + cắt độ dài ngữ cảnh |
| Học sinh hỏi chuyện ngoài học | Prompt yêu cầu từ chối lịch sự và kéo về bài |

## 8. Đo hiệu quả

- Bao nhiêu % người học dùng gia sư ít nhất 1 lần?
- Người dùng gia sư có **học tiếp** nhiều hơn người không dùng không? (so số bài học xong sau 7 ngày)
- Câu hỏi lặp nhiều nhất thuộc bài nào → xếp hàng chờ sửa bài giảng.

## 9. Còn lại cần chốt

1. **Quyền riêng tư**: đã chốt là lưu hội thoại và lỗi sai. Cần viết vào trang
   Điều khoản / Quyền riêng tư trước khi mở bán: lưu những gì, để làm gì, giữ
   bao lâu, cách xoá. Người học là học sinh (có thể vị thành niên) nên phải nói
   rõ ràng, không giấu trong dòng chữ nhỏ.
2. **Model cụ thể cho từng nhà cung cấp** — điền vào Railway khi bật, ví dụ
   Claude Haiku 4.5 cho hằng ngày và một model mạnh hơn cho “giải thích kỹ hơn”;
   phía Gemini chọn bản Flash cho rẻ. Mã nguồn không cần biết tên model.
3. **Chuyên đề yếu tính theo bao nhiêu câu gần nhất** (đề xuất 40) và ngưỡng
   “chưa đủ dữ liệu” (đề xuất 5 câu) — chỉnh sau khi có số liệu thật.
