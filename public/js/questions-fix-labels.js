/* ============================================================================
 *  ĐỒNG BỘ NHÃN CHỦ ĐỀ / LỚP CỦA CÂU HỎI THEO BÀI ĐANG DẠY NÓ.
 *  Sau các đợt gộp nội dung, nhiều câu được gắn sang bài khác chủ đề hoặc khác
 *  lớp, nhưng nhãn topic/grade trên câu vẫn là nhãn cũ. Lệch nhãn làm hỏng bộ
 *  lọc "Luyện tập theo chủ đề / theo lớp" và ma trận đề thi (ví dụ sinh ra ô
 *  "chủ đề C lớp 10" trong khi không có bài học nào như vậy).
 *  Câu dùng chung nhiều bài thì lấy nhãn của bài SỚM NHẤT trong lộ trình
 *  (bài đầu tiên người học gặp kiến thức đó).
 *  Vá ở đây thay vì sửa tệp nguồn, vì questions-vandung.js TỰ SINH ID theo
 *  topic + type lúc chạy — đổi topic trong tệp đó sẽ làm lệch toàn bộ ID.
 *  Nạp SAU mọi tệp câu hỏi và mọi tệp bài học.
 * ==========================================================================*/
(function () {
  if (typeof QUESTION_BANK === "undefined") return;
  var VA = {
 "A-mc-5": {
  "grade": 11
 },
 "B-mc-1": {
  "grade": 12
 },
 "B-mc-2": {
  "grade": 10
 },
 "B-mc-3": {
  "grade": 12
 },
 "C-mc-1": {
  "topic": "B"
 },
 "C-mc-2": {
  "topic": "G",
  "grade": 12
 },
 "D-mc-2": {
  "grade": 10
 },
 "D-mc-3": {
  "grade": 10
 },
 "D-mc-6": {
  "grade": 10
 },
 "F-mc-10": {
  "grade": 10
 },
 "F-mc-11": {
  "grade": 10
 },
 "F-mc-13": {
  "grade": 10
 },
 "F-mc-15": {
  "grade": 10
 },
 "F-mc-19": {
  "grade": 11
 },
 "F-mc-20": {
  "grade": 11
 },
 "F-mc-21": {
  "grade": 11
 },
 "F-mc-22": {
  "grade": 11
 },
 "F-mc-23": {
  "grade": 11
 },
 "F-mc-24": {
  "grade": 11
 },
 "F-mc-25": {
  "grade": 11
 },
 "F-mc-26": {
  "grade": 11
 },
 "F-mc-27": {
  "grade": 11
 },
 "F-mc-28": {
  "grade": 11
 },
 "F-mc-29": {
  "grade": 11
 },
 "F-mc-30": {
  "grade": 11
 },
 "F-mc-31": {
  "grade": 11
 },
 "F-mc-32": {
  "grade": 11
 },
 "F-mc-33": {
  "grade": 10
 },
 "G-mc-2": {
  "topic": "A",
  "grade": 10
 },
 "F-tf-4": {
  "grade": 11
 },
 "F-tf-5": {
  "grade": 11
 },
 "F-tf-6": {
  "grade": 11
 },
 "F-tf-7": {
  "grade": 11
 },
 "B-tf-1": {
  "grade": 10
 },
 "D-tf-1": {
  "grade": 10
 },
 "B-sa-1": {
  "grade": 12
 },
 "F-sa-3": {
  "grade": 10
 },
 "F-sa-4": {
  "grade": 10
 },
 "F-sa-5": {
  "grade": 11
 },
 "F-sa-6": {
  "grade": 10
 },
 "F-sa-8": {
  "grade": 11
 },
 "F-mc-38": {
  "grade": 10
 },
 "F-mc-45": {
  "grade": 10
 },
 "F-tf-9": {
  "grade": 10
 },
 "F-mc-46": {
  "grade": 10
 },
 "F-mc-47": {
  "grade": 11
 },
 "F-mc-48": {
  "grade": 11
 },
 "F-mc-51": {
  "grade": 10
 },
 "F-mc-52": {
  "grade": 10
 },
 "F-mc-53": {
  "grade": 10
 },
 "F-mc-54": {
  "grade": 10
 },
 "F-tf-10": {
  "grade": 10
 },
 "F-mc-60": {
  "grade": 11
 },
 "F-mc-61": {
  "grade": 11
 },
 "F-mc-62": {
  "grade": 11
 },
 "F-mc-63": {
  "grade": 11
 },
 "F-mc-64": {
  "grade": 11
 },
 "F-mc-65": {
  "grade": 11
 },
 "F-tf-12": {
  "grade": 11
 },
 "F-mc-66": {
  "grade": 10
 },
 "F-mc-68": {
  "grade": 10
 },
 "F-mc-70": {
  "grade": 10
 },
 "F-mc-71": {
  "grade": 10
 },
 "F-mc-72": {
  "grade": 10
 },
 "F-mc-73": {
  "grade": 11
 },
 "F-tf-15": {
  "grade": 11
 },
 "F-mc-74": {
  "grade": 11
 },
 "F-tf-16": {
  "grade": 11
 },
 "D-tf-2": {
  "grade": 10
 },
 "C-mc-4": {
  "topic": "B",
  "grade": 10
 },
 "C-mc-5": {
  "topic": "B"
 },
 "C-mc-6": {
  "topic": "B",
  "grade": 11
 },
 "C-mc-7": {
  "topic": "A"
 },
 "C-mc-8": {
  "topic": "G"
 },
 "C-mc-9": {
  "topic": "A",
  "grade": 10
 },
 "C-mc-10": {
  "topic": "B",
  "grade": 11
 },
 "C-mc-11": {
  "topic": "G"
 },
 "C-mc-12": {
  "topic": "B",
  "grade": 11
 },
 "C-tf-1": {
  "topic": "B",
  "grade": 10
 },
 "G-mc-8": {
  "topic": "A",
  "grade": 10
 },
 "G-mc-9": {
  "topic": "A",
  "grade": 10
 },
 "D-mc-8": {
  "grade": 10
 },
 "D-mc-10": {
  "grade": 10
 },
 "D-mc-11": {
  "grade": 10
 },
 "D-mc-12": {
  "topic": "A",
  "grade": 10
 },
 "D-tf-3": {
  "grade": 10
 },
 "B-mc-10": {
  "grade": 12
 },
 "B-tf-2": {
  "grade": 12
 },
 "C-mc-15": {
  "topic": "B"
 },
 "F-mc-81": {
  "grade": 10
 },
 "F-mc-84": {
  "grade": 10
 },
 "F-mc-85": {
  "grade": 10
 },
 "F-mc-86": {
  "grade": 10
 },
 "F-tf-18": {
  "grade": 10
 },
 "B-mc-30": {
  "topic": "D"
 },
 "F-mc-91": {
  "grade": 10
 },
 "F-mc-93": {
  "grade": 10
 },
 "F-mc-94": {
  "grade": 10
 },
 "F-tf-20": {
  "grade": 10
 },
 "F-mc-102": {
  "topic": "E"
 },
 "F-mc-103": {
  "topic": "E"
 },
 "B-mc-37": {
  "grade": 12
 },
 "B-mc-41": {
  "grade": 12
 },
 "C-mc-37": {
  "topic": "B"
 },
 "C-mc-38": {
  "topic": "B"
 },
 "C-mc-45": {
  "topic": "E"
 },
 "C-mc-46": {
  "topic": "E"
 },
 "D-mc-22": {
  "grade": 10
 },
 "D-mc-24": {
  "grade": 10
 },
 "D-mc-26": {
  "topic": "B"
 },
 "D-mc-28": {
  "topic": "B"
 },
 "D-mc-29": {
  "grade": 11
 },
 "D-mc-31": {
  "topic": "A"
 },
 "D-tf-6": {
  "topic": "B"
 },
 "D-tf-7": {
  "grade": 10
 },
 "D-tf-8": {
  "topic": "B",
  "grade": 11
 },
 "D-tf-9": {
  "grade": 10
 },
 "B-mc-45": {
  "grade": 10
 },
 "B-mc-46": {
  "grade": 12
 },
 "F-mc-119": {
  "grade": 10
 },
 "D-mc-33": {
  "grade": 10
 },
 "D-mc-34": {
  "grade": 10
 },
 "D-mc-36": {
  "topic": "B"
 },
 "D-mc-37": {
  "grade": 11
 },
 "D-tf-10": {
  "grade": 10
 },
 "B-mc-6": {
  "topic": "A",
  "grade": 10
 },
 "B-mc-7": {
  "topic": "A",
  "grade": 10
 },
 "F-mc-6": {
  "topic": "A"
 },
 "F-mc-12": {
  "grade": 10
 },
 "F-mc-17": {
  "grade": 10
 },
 "F-mc-18": {
  "grade": 10
 },
 "F-tf-3": {
  "grade": 10
 },
 "F-mc-39": {
  "grade": 10
 },
 "F-mc-40": {
  "grade": 10
 },
 "F-mc-43": {
  "grade": 10
 },
 "F-mc-44": {
  "grade": 10
 },
 "F-mc-59": {
  "grade": 10
 },
 "F-mc-67": {
  "grade": 10
 },
 "F-mc-69": {
  "grade": 10
 },
 "F-tf-13": {
  "grade": 10
 },
 "F-tf-14": {
  "grade": 10
 },
 "C-mc-13": {
  "topic": "B"
 }
};
  QUESTION_BANK.forEach(function (q) {
    var v = VA[q.id];
    if (!v) return;
    if (v.topic) q.topic = v.topic;
    if (v.grade) q.grade = v.grade;
  });
})();
