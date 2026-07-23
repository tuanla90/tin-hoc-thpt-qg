/* ============================================================================
 *  KHUNG DỮ LIỆU BÀI HỌC — chỉ khai báo mảng LESSONS và bảng nhãn STAGES.
 *  Nội dung bài học THỰC TẾ nằm ở các tệp sgk-*.js (bám sát SGK, nạp sau tệp này,
 *  dùng LESSONS.push(...) để thêm bài và đặt STAGES[10/11/12]).
 *
 *  (Toàn bộ 25 bài chủ đề cũ đã được GỠ BỎ — nội dung nay bám SGK Tin 10/11/12,
 *   tập trung đúng phạm vi ôn thi tốt nghiệp THPT.)
 *
 *  Mỗi bài (định nghĩa trong sgk-*.js) có dạng:
 *   - id, stage, order, topic, grade, minutes, title, intro
 *   - sgk: { ref, images:[...] }            tham chiếu SGK + ảnh trang sách
 *   - sections[]: story | text | h | code | list | note | example
 *   - keypoints[]: các ý cần nhớ
 *   - quiz[]: DANH SÁCH ID CÂU HỎI cho "Luyện tập bài này"
 *  Nhãn các chặng (STAGES[10], [11], [12]) được đặt trong sgk-lessons.js.
 * ==========================================================================*/

const STAGES = {};
const LESSONS = [];

if (typeof window !== "undefined") {
  window.STAGES = STAGES;
  window.LESSONS = LESSONS;
}
