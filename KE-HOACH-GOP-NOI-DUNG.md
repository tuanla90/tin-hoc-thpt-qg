# Kế hoạch gộp 2 chương trình vào 1 (bản tự soạn làm chính)

> Mục tiêu: chỉ còn **một lộ trình duy nhất** — bản tự biên soạn — đã hút hết
> phần giá trị của nhánh bám SGK (câu hỏi, từ vựng, thực hành, ý giảng còn
> thiếu). Bỏ mục "Bộ sách đang học" trong hồ sơ. Bỏ hẳn ảnh trang SGK.

## ✅ ĐÃ XONG (27/07/2026) — Phase A→F

| | Trước | Sau |
|---|--:|--:|
| Bài học | 212 (95 SGK + 117 tự soạn) | **117** (chỉ tự soạn) |
| Câu hỏi có bài dùng tới | 1 399 | **1 687** (0 mồ côi) |
| Câu / bài (trung bình) | 8,7 | **14,9** |
| Bài có từ vựng | 0 bài tự soạn | **82** (215 thuật ngữ) |
| Ảnh SGK có bản quyền | có | **không còn** |

Đã làm: bảng ánh xạ 95→82 bài do 3 sub-agent đối chiếu theo nội dung; hợp câu
hỏi; chuyển từ vựng + bài tập; gắn 132 câu ICT và 156 câu gốc bị bỏ quên; xoá
17 tệp `sgk-*.js`; bỏ chọn bộ sách; đổi nhãn "Bản sạch — Tin 10" → "Tin học 10".

**Bẫy đã vấp, ghi lại để đừng lặp:** các tệp `sgk-*.js` không chỉ chứa bài học
mà còn đẩy **104 câu hỏi** vào ngân hàng → xoá tệp là mất câu. Đã tách sang
`questions-sgk.js`. Tệp này phải nạp **trước `questions-vandung.js`** vì
`questions-vandung.js` **tự đánh số ID lúc chạy** theo ngân hàng hiện có; đổi
thứ tự nạp sẽ làm lệch toàn bộ ID và hỏng mọi `quiz` trỏ tới chúng.

**✅ Đã lấp 2 lỗ hổng nội dung (27/07/2026):** thêm **C11-32 "Ngăn xếp và hàng
đợi"** và **C11-33 "Các kĩ thuật thiết kế thuật toán"** (vét cạn, chia để trị,
tham lam, quy hoạch động) vào chương "Kĩ thuật lập trình và thuật toán" — mỗi
bài 14 mục, 3 ví dụ code chạy được, 8 câu hỏi mới, 6 từ vựng. 9 câu hỏi vốn
đứng nhầm chỗ (ngăn xếp/hàng đợi nằm ở bài mảng một chiều; tham lam/vét cạn/quy
hoạch động rải ở bài tìm kiếm, sắp xếp, độ phức tạp) đã chuyển về đúng bài.
Nay **119 bài · 1 703 câu · 225 thuật ngữ**.

---

*Phần dưới là kế hoạch gốc, giữ lại để đối chiếu.*

## 1. Hiện trạng (số liệu đo thật trên app, 27/07/2026)

| Nhánh | Bài | Câu gắn vào bài | Từ vựng | Thực hành |
|---|--:|--:|--:|--:|
| **SGK KNTT** — stage 10/11/12 | 95 (34/31/30) | 383 câu gốc (A–G) | **94 bài** | 13 bộ Python |
| **Tự soạn KHMT** — stage 20/21/22 | 95 (34/31/30) | 855 câu (CA/CB/CC) | **0** | 38 Python |
| **Tự soạn ICT** — stage 23/24 | 22 (15/7) | 176 câu (UB/UC) | **0** | 15 SQL + 17 Web |
| **Tổng** | **212 bài** | **1 687 câu** | | |

**288 câu đang mồ côi** (không bài nào gọi tới):
- **156 câu gốc** A=24, B=25, C=16, D=27, E=15, F=27, G=22 — soạn thêm nhưng chưa gắn bài.
- **132 câu `UD2-*`** — bổ sung cho 22 bài ICT ở commit `8ca9e68` nhưng **quên gắn vào `quiz`** của bài. Đã dò ra quy luật: **4 TN + 2 Đ/S mỗi bài, đúng thứ tự 22 bài U11/U12** (đối chiếu nội dung khớp: `UD2-mc-001..004` ⟷ U11-01 hệ QTCSDL, `005..008` ⟷ U11-02 thiết kế bảng…). → gắn lại bằng script, **không cần agent**.

Nhận xét quan trọng: **từ vựng (215 thuật ngữ) hiện CHỈ nằm ở nhánh SGK.** Đây là lý do không được bỏ nhánh SGK trước khi gộp — xem mục 5.

## 2. Đích đến

- **117 bài** (95 KHMT + 22 ICT), stage 20–24, không còn stage 10/11/12.
- Mỗi bài dày lên: ~9 câu hiện có **+ ~4 câu gốc** ⇒ ~13 câu/bài; **0 câu mồ côi**.
- 94 bài có từ vựng (chuyển nguyên từ nhánh SGK sang).
- Thực hành: 51 bộ Python + 15 SQL + 17 Web, không mất bộ nào.
- Không còn trường `sgk:{images}` ⇒ **không còn ảnh sách có bản quyền** — điều kiện để bán.
- Hồ sơ chỉ còn: tên, giới tính, lớp, định hướng (KHMT/ICT), cách mở bài.

## 3. Nút thắt: ánh xạ bài SGK → bài tự soạn

Số bài mỗi lớp **khớp chính xác** (34/31/30) nhưng **thứ tự đã bị sắp lại** khi bản tự soạn lấp gap, nên **không ánh xạ theo `order` được**. Ví dụ thật:

| Bài SGK | Bài tự soạn tương ứng |
|---|---|
| S10-03 Một số kiểu dữ liệu và dữ liệu văn bản | **C10-22** Bảng mã kí tự và dung lượng tệp văn bản |
| S10-05 Dữ liệu lôgic | **C10-24** Đúng, sai và bảng chân trị |
| S10-12 Phần mềm thiết kế đồ hoạ | **C10-09** Làm quen với thiết kế đồ hoạ |
| S10-18 Các lệnh vào ra đơn giản | **C10-11** Bắt đầu với Python |

Ánh xạ theo *chủ đề* thì có, chỉ là lệch vị trí ⇒ phải dựng **bảng ánh xạ theo nội dung** trước khi gộp bất cứ thứ gì.

## 4. Các bước

### Phase A — Bảng ánh xạ 95 cặp (~0,5 buổi)
- Xuất `{id, title, keypoints}` của 190 bài ra JSON.
- Tung **3 sub-agent** (mỗi lớp 1 agent) đối chiếu, trả `{sgk, clean, doTinCay: cao|vua|thap, lyDo}`.
- Chỉ rà tay các cặp `thap` + các bài SGK bị ánh xạ trùng đích (2 bài SGK → 1 bài sạch).
- Ra `scratchpad/mapping.json`. **Chốt bảng này trước khi sang B** (mọi bước sau đều dựa vào nó).

### Phase B — Gộp câu hỏi (~1 buổi)
1. **Theo cặp**: `quiz` bài sạch **hợp** với `quiz` bài SGK (giữ nguyên ID gốc, không sinh câu mới).
2. **156 câu gốc mồ côi**: agent phân về đúng bài (lọc trước theo `topic`+`grade` cho hẹp).
3. **132 câu UD2**: gắn theo quy luật đã xác minh — script thuần, chạy 1 phút.
- Kiểm: 0 ID thiếu, 0 ID trùng, 0 câu mồ côi, mỗi bài ≥ 8 câu.

### Phase C — Gộp từ vựng (~0,5 buổi, ăn ngay, gần như không rủi ro)
- `VOCAB` đang khoá theo `S10-*/S11-*/S12-*` → đổi khoá sang `C*` qua bảng ánh xạ.
- `VOCAB_TERMS` (215 thuật ngữ) **giữ nguyên**, không phải soạn lại.
- Kiểm: 94 bài có từ vựng, 0 khoá không resolve được.

### Phase D — Gộp thực hành + phần giảng còn thiếu (~1 buổi)
- 13 bộ `EXERCISES` gắn bài SGK → chuyển sang bài sạch tương ứng (`cleanup-old.js` đang remap `L*→S*`, sửa thành `→C*`).
- Nội dung giảng: agent **chỉ bổ sung mục còn THIẾU** (ví dụ minh hoạ, lưu ý tránh lỗi hay), **không chép nguyên khối** — giữ giọng văn thống nhất theo góp ý "dễ nhưng không trẻ con".
- **Không mang theo** `sgk:{ref, images}`.

### Phase E — Bỏ chọn bộ sách + gỡ nhánh SGK (~0,5 buổi)
- `profile.js`: bỏ `BOOKS`, bỏ `book` khỏi `DEFAULT` và hàm lưu, bỏ khối chip "Bộ sách đang học".
- `app.js`: xoá `bookOfLesson()` / `visibleForBook()`; `visibleForProfile()` chỉ còn gọi `visibleForTrack()`.
- `index.html`: gỡ 17 thẻ `<script src="js/sgk-*.js">`; xoá luôn các tệp đó.
- `STAGES`: đổi nhãn `"Bản sạch — Tin 10"` → **"Tin học 10"** (nay là bản chính, không còn gì để phân biệt); bỏ nhãn stage 10/11/12.
- `CHAPTERS`: bỏ khoá 10/11/12; giữ 20–24.
- `lessonTrack()` vẫn dùng stage 21/22/23/24 ⇒ **không phải sửa** phần lọc định hướng.

### Phase F — Nghiệm thu & dọn (~0,5 buổi)
Script kiểm chạy trong trình duyệt, phải xanh hết:
- [ ] 117 bài, chỉ còn stage 20–24, mỗi lớp liền mạch `order`
- [ ] 0 quiz ID thiếu · 0 ID trùng · 0 câu mồ côi (1 687 câu đều có bài dùng)
- [ ] 94 bài có từ vựng, 0 khoá hỏng
- [ ] 51 + 15 + 17 bộ thực hành đủ, chấm được
- [ ] 0 bài còn trường `sgk` · 0 lỗi console · lộ trình + chương hiển thị đúng
- Dọn: xoá `public/sach/` khỏi máy nếu không dùng nữa (đang gitignore, không lên web).

## 5. ⚠️ Thứ tự bắt buộc: KHÔNG bỏ chọn bộ sách trước khi gộp

Từ vựng (215 thuật ngữ, 94 bài) và 383 câu hỏi gốc **đang chỉ gắn vào nhánh SGK**. Nếu bỏ option và ẩn nhánh SGK ngay bây giờ thì app **mất sạch phần Từ vựng** và mất 383 câu — một bước lùi thấy rõ. Vì vậy Phase E đặt **sau** B, C, D.

Nếu muốn thấy kết quả sớm: làm **A → C** (nửa ngày) là bản tự soạn đã có từ vựng, rồi mới B, D, E.

## 6. Rủi ro & cách chặn

| Rủi ro | Cách chặn |
|---|---|
| Ánh xạ sai ⇒ câu hỏi gắn nhầm bài | Agent trả kèm độ tin cậy + đối chiếu `topic`/`grade`; chỉ rà tay phần nghi ngờ |
| Xoá nhánh SGK sớm ⇒ mất nội dung | Chỉ xoá ở Phase F, sau khi script kiểm xanh; git giữ lịch sử để lấy lại |
| 2 phiên làm song song cùng sửa `app.js` | Read lại tệp ngay trước khi sửa; commit từng phase |
| Bài sạch dài thêm quá mức khi nhồi nội dung SGK | Phase D chỉ bổ sung mục thiếu, không chép nguyên |

## 7. Cần anh/chị chốt

1. **Xoá hẳn 95 bài SGK** (khuyến nghị — nội dung đã hút hết, git vẫn giữ lịch sử) hay **giữ ẩn** để dùng riêng cho việc học của bạn nhỏ?
2. **Tính năng "Trang sách"** (ảnh SGK trong bài) bỏ hẳn cùng nhánh SGK — xác nhận giúp, vì đây là rào cản bản quyền số 1 khi bán.
3. Bắt đầu ngay bằng **A → C** (từ vựng về bản chính trong nửa buổi) hay chạy tuần tự A → F một mạch?
