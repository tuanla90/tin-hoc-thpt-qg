/* ============================================================================
 *  BÀI THỰC HÀNH TÌNH HUỐNG — Python, có máy chấm
 *
 *  Cùng tinh thần với questions-tinh-huong.js: đề bài đặt trong một cảnh có
 *  thật (quán nước, sổ điểm, tiền điện, trực nhật...) thay vì "viết chương
 *  trình tính tổng dãy số". Học sinh thấy được vì sao phải viết đoạn code này.
 *
 *  QUAN TRỌNG — đặt bài đúng chỗ trong lộ trình: mỗi bài chỉ được dùng những
 *  kiến thức ĐÃ dạy tới thời điểm đó. Bài cần if phải nằm từ "Câu lệnh rẽ
 *  nhánh" trở đi, bài cần for phải nằm từ "Vòng lặp for" trở đi. Đặt sai là học
 *  sinh gặp cú pháp chưa từng học và bỏ cuộc.
 *
 *  Nạp SAU exercises.js và các tệp clean-exercises*.js — tệp này CHÈN THÊM vào
 *  EXERCISES của những bài đã có, không ghi đè.
 * ==========================================================================*/
(function () {
  if (typeof EXERCISES === "undefined") return;

  var THEM = {
    /* C10-11 "Bắt đầu với Python" — mới chỉ có print và phép tính đơn giản */
    "C10-11": [
      { type: "code",
        prompt: "**Quán nước của mẹ.** Mỗi cốc nước mía giá `12000` đồng. In ra số tiền phải trả khi khách mua **7 cốc**.",
        starter: "gia = 12000\nso_coc = 7\n# in ra tổng tiền\n",
        expected: "84000",
        hint: "Tổng tiền = giá × số cốc, rồi dùng print() để in.",
        solution: "gia = 12000\nso_coc = 7\nprint(gia * so_coc)" },
      { type: "code",
        prompt: "**Bảng tên lớp.** Cho `ten = \"lan\"`. In ra dòng chữ `Xin chao LAN` (tên viết hoa toàn bộ).",
        starter: "ten = \"lan\"\n# in ra lời chào với tên viết hoa\n",
        expected: "Xin chao LAN",
        hint: "Dùng ten.upper() để viết hoa toàn bộ chuỗi.",
        solution: "ten = \"lan\"\nprint(\"Xin chao\", ten.upper())" },
    ],

    /* C10-13 "Nhập dữ liệu và các phép toán" — đã có // và % */
    "C10-13": [
      { type: "code",
        prompt: "**Đổi tiền lẻ.** Bạn có `47000` đồng, muốn biết đổi được bao nhiêu tờ `10000` và còn thừa bao nhiêu. In ra hai số cách nhau một dấu cách.",
        starter: "tien = 47000\n# in ra: số tờ 10000 và số tiền thừa\n",
        expected: "4 7000",
        hint: "Dùng // để lấy số tờ và % để lấy phần thừa.",
        solution: "tien = 47000\nprint(tien // 10000, tien % 10000)" },
      { type: "fill",
        prompt: "**Chia nhóm trực nhật.** Lớp có `45` bạn, chia thành các nhóm `6` bạn. Điền chỗ trống để in ra **số nhóm đầy đủ**.",
        starter: "so_ban = 45\nprint(so_ban ___ 6)",
        expected: "7",
        hint: "Chia lấy phần nguyên bằng toán tử //.",
        solution: "so_ban = 45\nprint(so_ban // 6)" },
    ],

    /* C10-14 "Câu lệnh rẽ nhánh if – elif – else" */
    "C10-14": [
      { type: "code",
        prompt: "**Tiền điện bậc thang (rút gọn).** Dưới `50` số thì mỗi số giá `1800` đồng, từ `50` số trở lên thì mỗi số giá `2500` đồng. Nhà bạn dùng hết `62` số. In ra số tiền phải trả.",
        starter: "so_dien = 62\n# dùng if ... else để chọn đơn giá rồi in tổng tiền\n",
        expected: "155000",
        hint: "62 >= 50 nên áp đơn giá 2500 cho toàn bộ 62 số.",
        solution: "so_dien = 62\nif so_dien >= 50:\n    gia = 2500\nelse:\n    gia = 1800\nprint(so_dien * gia)" },
      { type: "code",
        prompt: "**Xếp loại điểm.** Cho `diem = 7.5`. In ra `Gioi` nếu điểm từ 8 trở lên, `Kha` nếu từ 6.5 đến dưới 8, còn lại in `Trung binh`.",
        starter: "diem = 7.5\n# dùng if - elif - else\n",
        expected: "Kha",
        hint: "Xét lần lượt từ mốc cao xuống thấp: >= 8, rồi >= 6.5, cuối cùng là else.",
        solution: "diem = 7.5\nif diem >= 8:\n    print(\"Gioi\")\nelif diem >= 6.5:\n    print(\"Kha\")\nelse:\n    print(\"Trung binh\")" },
    ],

    /* C10-15 "Vòng lặp for" — từ đây mới được dùng for và duyệt danh sách */
    "C10-15": [
      { type: "code",
        prompt: "**Điểm danh cả tuần.** Danh sách `co_mat` ghi số bạn có mặt mỗi ngày trong 5 ngày. In ra **tổng lượt có mặt** của cả tuần.",
        starter: "co_mat = [40, 42, 39, 41, 38]\ntong = 0\n# duyệt danh sách và cộng dồn\n",
        expected: "200",
        hint: "Dùng for để duyệt từng phần tử rồi cộng vào biến tong.",
        solution: "co_mat = [40, 42, 39, 41, 38]\ntong = 0\nfor x in co_mat:\n    tong += x\nprint(tong)" },
      { type: "code",
        prompt: "**Đếm bạn đạt.** Danh sách `diem` là điểm kiểm tra của 6 bạn. In ra **số bạn đạt** (điểm từ 5 trở lên).",
        starter: "diem = [3, 5, 8, 4.5, 5.0, 9]\ndem = 0\n# đếm số bạn có điểm >= 5 rồi in ra\n",
        expected: "4",
        hint: "Duyệt từng điểm bằng for, gặp điểm >= 5 thì tăng biến đếm.",
        solution: "diem = [3, 5, 8, 4.5, 5.0, 9]\ndem = 0\nfor d in diem:\n    if d >= 5:\n        dem += 1\nprint(dem)" },
      { type: "code",
        prompt: "**Điểm cao nhất lớp.** Vẫn danh sách điểm trên, in ra **điểm cao nhất** mà không dùng hàm max().",
        starter: "diem = [3, 5, 8, 4.5, 5.0, 9]\ncao_nhat = diem[0]\n# duyệt và cập nhật cao_nhat\n",
        expected: "9",
        hint: "Giữ một biến cao_nhat, gặp điểm lớn hơn thì gán lại.",
        solution: "diem = [3, 5, 8, 4.5, 5.0, 9]\ncao_nhat = diem[0]\nfor d in diem:\n    if d > cao_nhat:\n        cao_nhat = d\nprint(cao_nhat)" },
      { type: "code",
        prompt: "**Lịch học hai tuần.** Trong danh sách `lich`, giá trị `1` nghĩa là có học, `0` là nghỉ. In ra **số ngày có học**.",
        starter: "lich = [1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0]\ndem = 0\n# đếm số ngày có học\n",
        expected: "8",
        hint: "Duyệt danh sách, gặp giá trị bằng 1 thì tăng biến đếm.",
        solution: "lich = [1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0]\ndem = 0\nfor x in lich:\n    if x == 1:\n        dem += 1\nprint(dem)" },
    ],
  };

  Object.keys(THEM).forEach(function (baiId) {
    if (!EXERCISES[baiId]) EXERCISES[baiId] = [];
    EXERCISES[baiId] = EXERCISES[baiId].concat(THEM[baiId]);
  });
})();
