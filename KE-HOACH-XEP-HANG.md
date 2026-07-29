# Kế hoạch: Bảng xếp hạng, Top tháng, Nhiệm vụ tuần

Mục tiêu: thêm vòng lặp quay lại hằng ngày/hằng tuần kiểu Duolingo, để học sinh
có lý do mở app cả vào những hôm không bị kiểm tra.

---

## 1. Đang có sẵn những gì

| Thứ | Ở đâu | Ghi chú |
|---|---|---|
| XP, cấp độ, danh hiệu | `public/js/gamify.js` (`GAM_LEVELS`) | tính **ở trình duyệt** |
| Chuỗi ngày học 🔥 | `gamify.js` (`streak`, `bestStreak`) | tính ở trình duyệt |
| 38 huy hiệu, 6 nhóm | `gamify.js` (`lesson/vocab/practice/exam/streak/level`) | tính ở trình duyệt |
| Lưu trữ | bảng `gamify (profile_id, data JSONB)` | máy chủ **chỉ chép lại**, không kiểm |
| Kết quả làm bài thật | bảng `attempts` | **máy chủ kiểm được** — đây là mỏ vàng |
| Hồ sơ học tập | bảng `profiles (name, grade, track…)` | `name` là tên tự đặt, có thể là tên thật |

Nói cách khác: phần "cảm giác" của gamification đã xong khá đầy đủ. Cái thiếu là
**tính xã hội** (so với người khác) và **mục tiêu ngắn hạn có thời hạn**.

---

## 2. Hai chốt chặn phải xử lý TRƯỚC

Đây không phải chi tiết kỹ thuật vụn vặt — bỏ qua thì tính năng ra đời là hỏng,
sửa sau tốn hơn nhiều.

### 2.1. XP đang do trình duyệt tự tính → xếp hạng gian lận được trong 30 giây

Hiện `gamify.js` cộng XP ở máy khách rồi đồng bộ lên qua `Account.fullSync()`.
Máy chủ nhận sao lưu vậy. Với bảng xếp hạng riêng tư (chỉ mình xem) thì không
sao. Nhưng vừa treo giải "Top tháng" lên là **một học sinh biết mở DevTools sẽ
đứng số 1 vĩnh viễn**, và những em học thật sẽ bỏ cuộc ngay khi nhận ra.

**Cách xử lý:** XP dùng để xếp hạng phải do máy chủ tính lại từ `attempts` và
`learned` — hai bảng máy chủ ghi và kiểm được. Giữ nguyên XP máy khách cho phần
hiệu ứng tức thì (+XP bay lên, pháo giấy) vì nó cần phản hồi tức khắc; nhưng
**điểm lên bảng xếp hạng là điểm máy chủ**, tính lại độc lập.

Kèm theo trần chống cày ảo: tối đa ~200 XP xếp hạng/ngày, mỗi câu chỉ tính điểm
lần trả lời **đầu tiên** (làm lại vẫn học được, chỉ không ăn thêm điểm hạng).

### 2.2. Tên thật của học sinh dưới 18 tuổi không được lên bảng công khai

`profiles.name` do người dùng gõ, rất nhiều em sẽ gõ tên thật. Trang quyền riêng
tư đang cam kết thu thập tối thiểu và không công khai gì. Đưa tên đó lên bảng
xếp hạng là vừa phá cam kết, vừa là vấn đề pháp lý với Nghị định 13/2023 và
Luật Trẻ em.

**Cách xử lý:**
- Thêm cột `biet_danh` (nickname) riêng, **không dùng lại `profiles.name`**.
- Tham gia xếp hạng là **tự nguyện, mặc định TẮT**. Muốn vào bảng thì phải bật
  và tự đặt biệt danh.
- Có bộ lọc từ thô tục cho biệt danh, và nút rời bảng bất cứ lúc nào (rời là xoá
  khỏi bảng ngay).
- Bảng xếp hạng **không hiện email, lớp, trường, tỉnh** — chỉ biệt danh + điểm.
- Cập nhật `public/quyen-rieng-tu.html` mục 1 và mục 5 trước khi bật tính năng.

---

## 3. Lộ trình

### Giai đoạn 1 — XP máy chủ (nền móng, chưa có gì để khoe)

Không có giao diện mới. Nhưng không làm bước này thì 3 giai đoạn sau đều xây trên cát.

- Bảng mới `diem_hang (profile_id, tuan, thang, diem, cap_nhat_luc)`.
- `server/diem.js`: hàm tính điểm từ `attempts` + `learned`, có trần ngày.
- Cộng điểm ngay trong luồng đã có sẵn: chỗ máy chủ ghi `attempts`.
- Test: gửi 500 lượt làm bài giả trong 1 ngày → điểm phải bị chặn ở trần.

**Ước lượng:** 1 buổi.

### Giai đoạn 2 — Nhiệm vụ tuần (giá trị cao nhất, rủi ro thấp nhất)

Làm trước bảng xếp hạng vì: có tác dụng ngay cả khi mới có 5 người dùng, không
đụng gì tới quyền riêng tư, và không cần so sánh với ai.

Mỗi tuần 3 nhiệm vụ, sinh theo hồ sơ (lớp, chỗ yếu):
- "Học xong 3 bài mới"
- "Trả lời đúng 40 câu"
- "Làm 1 đề thi thử"

Xong cả 3 → huy hiệu tuần + XP thưởng. Thanh tiến độ đặt ngay trang chủ app,
nơi đang có sẵn khối "Hôm nay 0/80 XP".

- Bảng `nhiem_vu_tuan (profile_id, tuan, ma_nv, muc_tieu, da_lam, xong_luc)`.
- Sinh nhiệm vụ lười: lần đầu vào app trong tuần thì tạo.
- Nhiệm vụ **không reset về 0 giữa tuần** dù bỏ lỡ ngày — khác Duolingo, vì đối
  tượng ở đây là học sinh 12 có tuần thi giữa kỳ, phạt nặng chỉ khiến bỏ hẳn.

**Ước lượng:** 1–2 buổi.

### Giai đoạn 3 — Bảng xếp hạng tuần

- Nhóm ~30 người/bảng, ghép theo **lớp + tuần bắt đầu tham gia** để em mới không
  bị ném vào cùng bảng với người đã học 3 tháng.
- Hiện: hạng, biệt danh, điểm tuần. Tự làm nổi dòng của mình.
- Reset 00:00 thứ Hai (giờ VN — chú ý máy chủ Railway chạy UTC).

**Cân nhắc thiết kế — KHÔNG sao chép nguyên "giải đấu thăng/xuống hạng" của
Duolingo.** Cơ chế đó tối ưu cho việc học ngoại ngữ không có deadline. Học sinh
lớp 12 có deadline thật là kỳ thi; tụt hạng vào đúng tuần ôn Toán–Lý sẽ tạo cảm
giác thất bại ở đúng chỗ không đáng. Đề xuất: chỉ **thăng hạng và giữ nguyên**,
không tụt.

- Bảng `bang_xep_hang (id, tuan, ma_bang)` + `bxh_thanh_vien (bang_id, profile_id, diem)`.
- `GET /api/bxh/tuan` trả bảng của chính mình.

**Ước lượng:** 2–3 buổi.

### Giai đoạn 4 — Top tháng

- Bảng vàng toàn hệ thống, top 20 theo điểm tháng.
- Chốt sổ cuối tháng, lưu lại thành bảng lịch sử để tháng sau vẫn xem lại được.
- Đây là chỗ hợp lý để tặng thưởng thật (ví dụ 3 em đầu được tặng mã Premium) —
  vừa là marketing, vừa là lý do để chia sẻ cho bạn bè.

**Ước lượng:** 1 buổi (đã có nền từ giai đoạn 1 và 3).

---

## 4. Việc phải làm kèm, dễ quên

- `server/thongke.js`: thêm mốc phễu `xem-bxh`, `xong-nhiem-vu-tuan` để biết
  tính năng có ai dùng không — đừng làm xong rồi đoán mò.
- Múi giờ: mọi mốc "tuần"/"tháng" phải tính theo **giờ Việt Nam**, không phải UTC
  của Railway. Sai chỗ này thì bảng reset lúc 7 giờ sáng thứ Hai.
- Hồ sơ khách (chưa đăng nhập) **không** vào bảng xếp hạng được — đây lại là một
  lý do tự nhiên và tử tế để mời đăng ký tài khoản.
- Premium: đừng bán "điểm mua được". Bán lợi thế trong bảng xếp hạng là phá hỏng
  niềm tin. Nếu muốn gắn với Premium thì gắn ở chỗ vô hại: khung avatar, biệt
  danh màu.

## 5. Thứ tự đề xuất

**Giai đoạn 1 → 2 → dừng lại xem số liệu → 3 → 4.**

Lý do dừng giữa chừng: nhiệm vụ tuần có tác dụng ngay cả khi ít người dùng, còn
bảng xếp hạng thì **cần đủ người mới có ý nghĩa** — một bảng có 3 người trông
còn thảm hơn là không có bảng. Sau giai đoạn 2, xem `luot_xem` và số người hoàn
thành nhiệm vụ tuần; đủ vài chục người hoạt động thật rồi hãy mở bảng xếp hạng.
