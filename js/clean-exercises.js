/* ============================================================================
 *  BAI TAP TU CHAM cho bai hoc BAN SACH (Python/Skulpt, tu cham output).
 *  Gan bai tap vao EXERCISES theo id bai C10-xx, C11-xx. Nap SAU exercises.js.
 * ==========================================================================*/
(function () {
  if (typeof EXERCISES === "undefined") return;
  var ADD = {
 "C10-11": [
  {
   "type": "fill",
   "prompt": "Bạn muốn máy in ra **hai dòng** giới thiệu bản thân. Hoàn thiện chương trình để in đúng ra:\n```\nTôi tên là Minh\nNăm nay tôi 16 tuổi\n```",
   "starter": "print(\"Tôi tên là Minh\")\n___(\"Năm nay tôi 16 tuổi\")",
   "expected": "Tôi tên là Minh\nNăm nay tôi 16 tuổi",
   "hint": "Lệnh để in một nội dung ra màn hình là `print`; mỗi lệnh `print()` in ra một dòng riêng.",
   "solution": "print(\"Tôi tên là Minh\")\nprint(\"Năm nay tôi 16 tuổi\")"
  },
  {
   "type": "code",
   "prompt": "Tổ em có **8 bạn**, mỗi bạn đóng quỹ **5000 đồng**. Viết chương trình dùng dấu phẩy trong một lệnh `print()` (để có chữ và số trên cùng một dòng) in ra đúng:\n`Tổ em đóng quỹ tổng cộng: 40000 đồng`\nGợi ý: hãy để Python tự tính tổng tiền, đừng gõ sẵn số 40000.",
   "starter": "# Dùng dấu phẩy trong print để nối chữ và số\n# Cho Python tính 8 * 5000\n",
   "expected": "Tổ em đóng quỹ tổng cộng: 40000 đồng",
   "hint": "Đặt phần chữ trong dấu nháy kép, số và phép tính `8 * 5000` viết trực tiếp, các phần cách nhau bằng dấu phẩy.",
   "solution": "print(\"Tổ em đóng quỹ tổng cộng:\", 8 * 5000, \"đồng\")"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**\nĐoạn code dưới đây lẽ ra phải in hướng dẫn học bài theo đúng thứ tự:\n```\nBước 1: Mở sách\nBước 2: Làm bài\n```\nnhưng đang có lỗi: các dòng bị **sai thứ tự** và một câu lệnh **thiếu dấu nháy kép** mở đầu. Hãy sửa lại cho chương trình chạy đúng.",
   "starter": "print(\"Bước 2: Làm bài\")\nprint(Bước 1: Mở sách\")",
   "expected": "Bước 1: Mở sách\nBước 2: Làm bài",
   "hint": "Máy chạy lệnh lần lượt từ trên xuống, nên dòng in Bước 1 phải nằm trước; và mỗi chuỗi văn bản cần đủ **hai** dấu nháy kép ở đầu và cuối.",
   "solution": "print(\"Bước 1: Mở sách\")\nprint(\"Bước 2: Làm bài\")"
  }
 ],
 "C10-12": [
  {
   "type": "fill",
   "prompt": "Bạn Lan muốn lưu thông tin của mình vào 4 biến. Hãy điền giá trị đúng **kiểu** vào các chỗ `___`: `tuoi` là số nguyên **16**, `diem_tb` là số thực **8.5**, `la_doan_vien` là giá trị logic **đúng**. Chương trình phải in ra lần lượt: `Lan`, `16`, `8.5`, `True`.",
   "starter": "ten = 'Lan'\ntuoi = ___\ndiem_tb = ___\nla_doan_vien = ___\nprint(ten)\nprint(tuoi)\nprint(diem_tb)\nprint(la_doan_vien)",
   "expected": "Lan\n16\n8.5\nTrue",
   "hint": "Số nguyên viết không có dấu chấm, số thực có dấu chấm, giá trị logic đúng viết là True (viết hoa chữ T).",
   "solution": "ten = 'Lan'\ntuoi = 16\ndiem_tb = 8.5\nla_doan_vien = True\nprint(ten)\nprint(tuoi)\nprint(diem_tb)\nprint(la_doan_vien)"
  },
  {
   "type": "code",
   "prompt": "Ban đầu điểm kiểm tra miệng của bạn được ghi là số nguyên **7**. Hãy tạo biến `diem` gán bằng 7 rồi in ra **kiểu** của nó bằng `type()`. Sau đó thầy chấm lại thành **8.5**, hãy gán lại `diem` bằng 8.5, in **giá trị mới** rồi in **kiểu mới**. Kết quả in ra 3 dòng: `<class 'int'>`, `8.5`, `<class 'float'>`.",
   "starter": "# Tạo biến diem = 7 rồi in type(diem)\n# Gán lại diem = 8.5 rồi in diem và in type(diem)\n",
   "expected": "<class 'int'>\n8.5\n<class 'float'>",
   "hint": "Dùng print(type(diem)) để in kiểu; gán lại biến bằng dấu = giống như tạo mới, giá trị cũ sẽ bị thay thế.",
   "solution": "diem = 7\nprint(type(diem))\ndiem = 8.5\nprint(diem)\nprint(type(diem))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code dưới đây định tính tổng tiền quỹ lớp: **40** bạn, mỗi bạn nộp **15000** đồng, rồi in tổng ra. Nhưng khi chạy lại bị lỗi vì Python **phân biệt chữ hoa/chữ thường** trong tên biến. Hãy sửa lại cho chạy đúng, in ra `600000`.",
   "starter": "So_ban = 40\ntien = 15000\ntong = so_ban * tien\nprint(tong)",
   "expected": "600000",
   "hint": "Tên biến lúc tạo (`So_ban`) và lúc dùng (`so_ban`) phải viết giống hệt nhau từng chữ; sửa cho hai chỗ trùng nhau.",
   "solution": "so_ban = 40\ntien = 15000\ntong = so_ban * tien\nprint(tong)"
  }
 ],
 "C10-13": [
  {
   "type": "fill",
   "prompt": "Tổ em có **47 cái kẹo** chia đều cho **6 bạn**. Điền hai phép toán còn thiếu để tính **số kẹo mỗi bạn nhận được** (chia lấy phần nguyên) và **số kẹo còn dư**. Chương trình cần in ra:\n```\nMỗi bạn được: 7 cái\nCòn dư: 5 cái\n```",
   "starter": "so_keo = 47\nso_ban = 6\nmoi_ban = so_keo ___ so_ban\ncon_du = so_keo ___ so_ban\nprint('Mỗi bạn được:', moi_ban, 'cái')\nprint('Còn dư:', con_du, 'cái')",
   "expected": "Mỗi bạn được: 7 cái\nCòn dư: 5 cái",
   "hint": "Chia lấy phần nguyên dùng `//`, còn tìm phần dư dùng `%`.",
   "solution": "so_keo = 47\nso_ban = 6\nmoi_ban = so_keo // so_ban\ncon_du = so_keo % so_ban\nprint('Mỗi bạn được:', moi_ban, 'cái')\nprint('Còn dư:', con_du, 'cái')"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Điểm hai môn được lưu dưới dạng **chuỗi** (giống như `input()` luôn trả về chuỗi). Đoạn code dưới đây muốn tính **tổng điểm** nhưng lại in ra `Tổng điểm hai môn: 87` (nối chuỗi) thay vì số `15`. Hãy sửa để chương trình in ra đúng:\n```\nTổng điểm hai môn: 15\n```",
   "starter": "diem_toan = '8'\ndiem_van = '7'\ntong = diem_toan + diem_van\nprint('Tổng điểm hai môn:', tong)",
   "expected": "Tổng điểm hai môn: 15",
   "hint": "Trước khi cộng, phải ép chuỗi về số nguyên bằng `int()`.",
   "solution": "diem_toan = int('8')\ndiem_van = int('7')\ntong = diem_toan + diem_van\nprint('Tổng điểm hai môn:', tong)"
  },
  {
   "type": "code",
   "prompt": "Lớp em làm một tấm biển báo hình **vuông cạnh 6 dm**. Viết chương trình tính **diện tích** (dùng phép **luỹ thừa** `**`) và **chu vi** của tấm biển. Chương trình cần in ra đúng hai dòng:\n```\nDiện tích: 36\nChu vi: 24\n```",
   "starter": "# Gợi ý: gán cạnh vào một biến rồi tính\ncanh = 6\n",
   "expected": "Diện tích: 36\nChu vi: 24",
   "hint": "Diện tích hình vuông là cạnh luỹ thừa 2 (`canh ** 2`), chu vi là cạnh nhân 4.",
   "solution": "canh = 6\ndien_tich = canh ** 2\nchu_vi = canh * 4\nprint('Diện tích:', dien_tich)\nprint('Chu vi:', chu_vi)"
  }
 ],
 "C10-14": [
  {
   "type": "fill",
   "prompt": "Bạn Lan có điểm môn Tin là `7`. Điền phần **điều kiện** còn thiếu để: nếu điểm từ 5 trở lên thì in ra `Bạn đã đạt môn Tin học`, ngược lại in `Bạn chưa đạt, cần cố gắng thêm`. Với điểm = 7, chương trình phải in ra `Bạn đã đạt môn Tin học`.",
   "starter": "diem = 7\nif diem ___:\n    print(\"Bạn đã đạt môn Tin học\")\nelse:\n    print(\"Bạn chưa đạt, cần cố gắng thêm\")",
   "expected": "Bạn đã đạt môn Tin học",
   "hint": "Đạt nghĩa là điểm lớn hơn hoặc bằng 5; dùng phép so sánh `>=`.",
   "solution": "diem = 7\nif diem >= 5:\n    print(\"Bạn đã đạt môn Tin học\")\nelse:\n    print(\"Bạn chưa đạt, cần cố gắng thêm\")"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code dưới xếp loại học lực theo điểm trung bình `diem = 9`. Đáng lẽ phải in `Học lực Giỏi`, nhưng do **thứ tự các nhánh bị sai** nên nó in nhầm. Hãy sắp xếp lại các điều kiện cho đúng để chương trình in ra `Học lực Giỏi`.",
   "starter": "diem = 9\nif diem >= 5:\n    print(\"Học lực Trung bình\")\nelif diem >= 6.5:\n    print(\"Học lực Khá\")\nelif diem >= 8:\n    print(\"Học lực Giỏi\")\nelse:\n    print(\"Học lực Yếu\")",
   "expected": "Học lực Giỏi",
   "hint": "Python chỉ chạy nhánh đúng đầu tiên rồi thoát, nên phải xét mốc điểm cao nhất trước.",
   "solution": "diem = 9\nif diem >= 8:\n    print(\"Học lực Giỏi\")\nelif diem >= 6.5:\n    print(\"Học lực Khá\")\nelif diem >= 5:\n    print(\"Học lực Trung bình\")\nelse:\n    print(\"Học lực Yếu\")"
  },
  {
   "type": "code",
   "prompt": "Một bạn có điểm hai môn: `toan = 8` và `van = 9`. Viết chương trình xét kết quả cuối năm theo quy tắc: nếu **cả hai môn** đều từ 5 trở lên thì tính điểm trung bình `(toan + van) // 2` rồi xếp loại (từ 8 trở lên in `Học sinh Giỏi`, từ 6 trở lên in `Học sinh Khá`, còn lại in `Học sinh Trung bình`); nếu có ít nhất một môn dưới 5 thì in `Có môn dưới 5, phải thi lại`. Với dữ liệu trên, chương trình phải in ra `Học sinh Giỏi`.",
   "starter": "toan = 8\nvan = 9\n# Dùng and để xét cả hai môn, rồi if - elif - else để xếp loại\n",
   "expected": "Học sinh Giỏi",
   "hint": "Dùng `and` cho điều kiện hai môn cùng đạt, và lồng một cấu trúc `if - elif - else` bên trong nhánh đó.",
   "solution": "toan = 8\nvan = 9\nif toan >= 5 and van >= 5:\n    diem_tb = (toan + van) // 2\n    if diem_tb >= 8:\n        print(\"Học sinh Giỏi\")\n    elif diem_tb >= 6:\n        print(\"Học sinh Khá\")\n    else:\n        print(\"Học sinh Trung bình\")\nelse:\n    print(\"Có môn dưới 5, phải thi lại\")"
  }
 ],
 "C10-15": [
  {
   "type": "fill",
   "prompt": "Bạn Nam luyện chống đẩy theo kế hoạch: **ngày thứ i tập đúng i cái** (ngày 1 tập 1 cái, ngày 2 tập 2 cái...). Hãy điền vào chỗ trống để in ra số cái Nam tập trong **5 ngày đầu**, mỗi ngày một dòng. Kết quả cần in ra:\n```\n1\n2\n3\n4\n5\n```",
   "starter": "for i in range(1, ___):\n    print(i)",
   "expected": "1\n2\n3\n4\n5",
   "hint": "`range(a, b)` chạy từ a và luôn dừng TRƯỚC b, nên muốn i chạy đến 5 thì b phải là mấy?",
   "solution": "for i in range(1, 6):\n    print(i)"
  },
  {
   "type": "code",
   "prompt": "Tổ 1 nuôi heo đất, mỗi lần chỉ bỏ vào các tờ tiền chẵn nghìn từ **2 nghìn đến 20 nghìn** (tức 2, 4, 6, ..., 20). Viết chương trình dùng vòng lặp `for` tính **tổng** các số đó rồi in ra một số duy nhất. Kết quả cần in ra là `110`.",
   "starter": "# Dùng range có bước nhảy để lấy các số chẵn\n# Cộng dồn vào một biến rồi in ra\n",
   "expected": "110",
   "hint": "Dùng `range(2, 21, 2)` để lấy các số chẵn, và một biến khởi tạo bằng 0 để cộng dồn.",
   "solution": "tong = 0\nfor i in range(2, 21, 2):\n    tong = tong + i\nprint(tong)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**\n\nBạn Lan để dành tiền theo cách: **ngày thứ i để dành i nghìn đồng**, làm liên tục trong **10 ngày** (ngày 1 bỏ 1 nghìn, ..., ngày 10 bỏ 10 nghìn). Chương trình dưới đây định tính tổng số tiền Lan để dành được nhưng bị **sai một chỗ** nên ra kết quả thiếu. Hãy sửa để in ra đúng:\n```\nTổng Lan để dành được: 55 nghìn đồng\n```",
   "starter": "tong = 0\nfor i in range(1, 10):\n    tong = tong + i\nprint('Tổng Lan để dành được:', tong, 'nghìn đồng')",
   "expected": "Tổng Lan để dành được: 55 nghìn đồng",
   "hint": "Vòng lặp đang dừng trước ngày 10 nên thiếu một số hạng; xem lại giá trị b trong `range(1, b)`.",
   "solution": "tong = 0\nfor i in range(1, 11):\n    tong = tong + i\nprint('Tổng Lan để dành được:', tong, 'nghìn đồng')"
  }
 ],
 "C10-16": [
  {
   "type": "fill",
   "prompt": "Lịch trực nhật của tổ em kéo dài **7 ngày**. Hãy dùng vòng lặp `while` để in ra thứ tự các ngày, **mỗi ngày một dòng**, từ `1` đến `7`. Điền vào hai chỗ trống.",
   "starter": "ngay = 1\nwhile ngay ___ 7:\n    print(ngay)\n    ngay = ___\n",
   "expected": "1\n2\n3\n4\n5\n6\n7",
   "hint": "Điều kiện lặp còn đúng chừng nào `ngay` chưa vượt quá 7; và sau mỗi lần in phải tăng biến đếm thêm 1 để tránh lặp vô hạn.",
   "solution": "ngay = 1\nwhile ngay <= 7:\n    print(ngay)\n    ngay = ngay + 1"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Lớp em góp quỹ, **mỗi bạn góp 20000 đồng**, cần góp cho tới khi đủ **ít nhất 100000 đồng**. Đoạn code sau bị lỗi khiến chương trình lặp mãi không dừng. Hãy sửa để in ra đúng:\n`Số bạn cần góp: 5`\n`Tổng quỹ: 100000`",
   "starter": "quy = 0\nsoban = 0\nwhile quy < 100000:\n    soban = soban + 1\nprint('Số bạn cần góp:', soban)\nprint('Tổng quỹ:', quy)",
   "expected": "Số bạn cần góp: 5\nTổng quỹ: 100000",
   "hint": "Điều kiện `quy < 100000` chẳng bao giờ sai đi vì `quy` không hề tăng — hãy cộng tiền của mỗi bạn vào `quy` bên trong vòng lặp.",
   "solution": "quy = 0\nsoban = 0\nwhile quy < 100000:\n    quy = quy + 20000\n    soban = soban + 1\nprint('Số bạn cần góp:', soban)\nprint('Tổng quỹ:', quy)"
  },
  {
   "type": "code",
   "prompt": "Tài khoản tiết kiệm của em có **100000 đồng**. Mỗi tháng em rút ra **30000 đồng**, và chỉ rút khi số dư còn **đủ 30000 đồng trở lên**. Dùng vòng lặp `while` để đếm xem rút được bao nhiêu tháng và còn lại bao nhiêu. In ra đúng hai dòng:\n`Số tháng rút được: 3`\n`Còn lại: 10000`",
   "starter": "# tien ban đầu là 100000, mỗi tháng rút 30000\n# dùng while, đếm số tháng và tính số tiền còn lại\n",
   "expected": "Số tháng rút được: 3\nCòn lại: 10000",
   "hint": "Lặp chừng nào `tien >= 30000`: mỗi vòng trừ đi 30000 và tăng biến đếm tháng thêm 1; ta không biết trước rút được mấy tháng nên `while` hợp hơn `for`.",
   "solution": "tien = 100000\nthang = 0\nwhile tien >= 30000:\n    tien = tien - 30000\n    thang = thang + 1\nprint('Số tháng rút được:', thang)\nprint('Còn lại:', tien)"
  }
 ],
 "C10-17": [
  {
   "type": "fill",
   "prompt": "Danh sách `so_ban` lưu sĩ số của 4 tổ trong lớp. Điền chỗ trống để chương trình in ra **số tổ** (dùng `len`) và **sĩ số của tổ 1** (phần tử ở chỉ số 0). Kết quả in ra:\n```\nSo to trong lop: 4\nTo 1 co si so: 10\n```",
   "starter": "so_ban = [10, 9, 11, 8]\nprint('So to trong lop:', ___(so_ban))\nprint('To 1 co si so:', so_ban[___])",
   "expected": "So to trong lop: 4\nTo 1 co si so: 10",
   "hint": "`len(a)` cho số phần tử; phần tử đầu tiên nằm ở chỉ số 0.",
   "solution": "so_ban = [10, 9, 11, 8]\nprint('So to trong lop:', len(so_ban))\nprint('To 1 co si so:', so_ban[0])"
  },
  {
   "type": "code",
   "prompt": "Danh sách `gop_quy` ghi số tiền (nghìn đồng) mà 5 bạn đã góp quỹ lớp: `[15, 20, 10, 25, 15]`. Dùng vòng lặp `for` duyệt qua danh sách để tính **tổng quỹ**, rồi in ra đúng hai dòng:\n```\nTong quy lop: 85\nSo ban da gop: 5\n```",
   "starter": "gop_quy = [15, 20, 10, 25, 15]\n# duyet danh sach bang for de cong don\n",
   "expected": "Tong quy lop: 85\nSo ban da gop: 5",
   "hint": "Tạo biến `tong = 0`, dùng `for tien in gop_quy:` rồi cộng dồn; số bạn lấy bằng `len`.",
   "solution": "gop_quy = [15, 20, 10, 25, 15]\ntong = 0\nfor tien in gop_quy:\n    tong = tong + tien\nprint('Tong quy lop:', tong)\nprint('So ban da gop:', len(gop_quy))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code muốn thêm điểm 10 vào danh sách rồi in **phần tử cuối cùng**, nhưng đang bị lỗi `IndexError` (chỉ số vượt phạm vi). Hãy sửa để chương trình in ra đúng:\n```\nDanh sach diem: [7, 8, 9, 6, 10]\nDiem cuoi cung: 10\n```",
   "starter": "diem = [7, 8, 9, 6]\ndiem.append(10)\nprint('Danh sach diem:', diem)\nprint('Diem cuoi cung:', diem[len(diem)])",
   "expected": "Danh sach diem: [7, 8, 9, 6, 10]\nDiem cuoi cung: 10",
   "hint": "Danh sách có `len(diem)` phần tử nhưng chỉ số cuối chỉ đến `len(diem) - 1`.",
   "solution": "diem = [7, 8, 9, 6]\ndiem.append(10)\nprint('Danh sach diem:', diem)\nprint('Diem cuoi cung:', diem[len(diem) - 1])"
  }
 ],
 "C10-18": [
  {
   "type": "fill",
   "prompt": "Bạn An lưu họ tên đầy đủ vào biến `s`. Hãy điền vào chỗ trống để chương trình in ra **độ dài xâu**, **chữ cái đầu tiên** và phần **họ** (6 kí tự đầu). Cần in đúng 3 dòng:\n```\nDo dai: 13\nChu cai dau: N\nHo: Nguyen\n```",
   "starter": "s = 'Nguyen Van An'\nprint('Do dai:', ___)\nprint('Chu cai dau:', s[___])\nprint('Ho:', s[0:___])",
   "expected": "Do dai: 13\nChu cai dau: N\nHo: Nguyen",
   "hint": "Dùng `len(s)` để đếm kí tự; chỉ số đầu tiên là 0; lát cắt `s[0:6]` lấy 6 kí tự đầu.",
   "solution": "s = 'Nguyen Van An'\nprint('Do dai:', len(s))\nprint('Chu cai dau:', s[0])\nprint('Ho:', s[0:6])"
  },
  {
   "type": "code",
   "prompt": "Cô giáo ghi lại một câu về lớp: `s = 'lop em co ba muoi hai ban'`. Hãy viết chương trình **đếm xem chữ `a` xuất hiện bao nhiêu lần** trong câu, rồi in ra đúng dòng:\n```\nChu a xuat hien 3 lan\n```",
   "starter": "s = 'lop em co ba muoi hai ban'\n# duyet tung ki tu bang for va dem\n",
   "expected": "Chu a xuat hien 3 lan",
   "hint": "Đặt biến đếm bằng 0, dùng `for ch in s:` rồi kiểm tra `if ch == 'a':` để cộng dồn.",
   "solution": "s = 'lop em co ba muoi hai ban'\ndem = 0\nfor ch in s:\n    if ch == 'a':\n        dem = dem + 1\nprint('Chu a xuat hien', dem, 'lan')"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI.** Đoạn code dưới đây muốn đếm **số từ** trong câu bằng cách đếm số dấu cách rồi cộng thêm 1 (câu có 4 dấu cách nên có 5 từ), nhưng đang in ra **sai**. Hãy sửa để chương trình in đúng:\n```\nCau co 5 tu\n```",
   "starter": "s = 'hom nay troi rat dep'\ndem_cach = 0\nfor ch in s:\n    if ch == ' ':\n        dem_cach = dem_cach + 1\nprint('Cau co', dem_cach, 'tu')",
   "expected": "Cau co 5 tu",
   "hint": "Số từ nhiều hơn số dấu cách đúng 1 đơn vị — hãy in ra `dem_cach + 1`.",
   "solution": "s = 'hom nay troi rat dep'\ndem_cach = 0\nfor ch in s:\n    if ch == ' ':\n        dem_cach = dem_cach + 1\nprint('Cau co', dem_cach + 1, 'tu')"
  }
 ],
 "C10-19": [
  {
   "type": "fill",
   "prompt": "Hoàn thiện hàm `tinh_tien(gia, so_luong)` để tính **thành tiền** (giá nhân số lượng) rồi trả kết quả về. Chương trình in ra:\n```\nBut bi: 15000\nVo o li: 40000\n```",
   "starter": "def tinh_tien(gia, so_luong):\n    thanh_tien = gia ___ so_luong\n    return thanh_tien\n\nprint(\"But bi:\", tinh_tien(5000, 3))\nprint(\"Vo o li:\", tinh_tien(8000, 5))\n",
   "expected": "But bi: 15000\nVo o li: 40000",
   "hint": "Thành tiền bằng giá một món nhân với số lượng mua.",
   "solution": "def tinh_tien(gia, so_luong):\n    thanh_tien = gia * so_luong\n    return thanh_tien\n\nprint(\"But bi:\", tinh_tien(5000, 3))\nprint(\"Vo o li:\", tinh_tien(8000, 5))"
  },
  {
   "type": "code",
   "prompt": "Viết hàm `xep_loai(diem)` nhận vào điểm của một bạn: nếu điểm **từ 5 trở lên** thì trả về chuỗi `Dat`, ngược lại trả về `Chua dat`. Sau đó gọi hàm cho bạn An (điểm 8) và bạn Binh (điểm 4), in ra đúng:\n```\nAn: Dat\nBinh: Chua dat\n```",
   "starter": "# Dinh nghia ham xep_loai(diem) roi goi ham de in ket qua\n",
   "expected": "An: Dat\nBinh: Chua dat",
   "hint": "Dùng `if diem >= 5:` để chọn kết quả, và `return` ngay chuỗi cần trả về.",
   "solution": "def xep_loai(diem):\n    if diem >= 5:\n        return 'Dat'\n    else:\n        return 'Chua dat'\n\nprint('An:', xep_loai(8))\nprint('Binh:', xep_loai(4))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Bạn muốn hàm `tinh_dien_tich` tính diện tích mảnh đất rồi trả kết quả ra ngoài, nhưng chương trình lại in ra `Dien tich manh dat: None`. Hãy sửa hàm để in đúng:\n```\nDien tich manh dat: 24\n```",
   "starter": "def tinh_dien_tich(dai, rong):\n    dt = dai * rong\n\nprint(\"Dien tich manh dat:\", tinh_dien_tich(6, 4))\n",
   "expected": "Dien tich manh dat: 24",
   "hint": "Hàm có tính toán nhưng chưa **trả kết quả** ra ngoài cho nơi gọi.",
   "solution": "def tinh_dien_tich(dai, rong):\n    dt = dai * rong\n    return dt\n\nprint(\"Dien tich manh dat:\", tinh_dien_tich(6, 4))"
  }
 ],
 "C10-20": [
  {
   "type": "fill",
   "prompt": "🐞 **TÌM & SỬA LỖI (lỗi logic).** Bạn Lan tính điểm trung bình 3 môn nhưng máy in ra con số vô lí. Nguyên nhân là sai thứ tự phép tính: `/` được làm trước `+`. Hãy điền vào `___` để chương trình cộng cả ba điểm **rồi mới** chia cho 3. Với `diem1 = 9`, `diem2 = 6`, `diem3 = 9`, chương trình phải in ra đúng `Điểm trung bình: 8.0`.",
   "starter": "diem1 = 9\ndiem2 = 6\ndiem3 = 9\ntrung_binh = ___ / 3\nprint(\"Điểm trung bình:\", trung_binh)",
   "expected": "Điểm trung bình: 8.0",
   "hint": "Muốn cộng trước rồi mới chia, hãy đặt cả ba điểm vào trong một cặp dấu ngoặc tròn.",
   "solution": "diem1 = 9\ndiem2 = 6\ndiem3 = 9\ntrung_binh = (diem1 + diem2 + diem3) / 3\nprint(\"Điểm trung bình:\", trung_binh)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI (lỗi cú pháp).** Đoạn code dưới đây tính tổng tiền quỹ lớp từ ba khoản góp `15000`, `20000`, `12000` nhưng máy báo lỗi và không chạy được vì dòng `for` viết sai quy tắc. Hãy sửa lỗi cú pháp để chương trình in ra đúng `Tổng quỹ lớp: 47000`.",
   "starter": "tong = 0\nfor tien in [15000, 20000, 12000]\n    tong = tong + tien\nprint(\"Tổng quỹ lớp:\", tong)",
   "expected": "Tổng quỹ lớp: 47000",
   "hint": "Sau danh sách ở dòng `for`, câu lệnh còn thiếu một dấu quan trọng ở cuối dòng.",
   "solution": "tong = 0\nfor tien in [15000, 20000, 12000]:\n    tong = tong + tien\nprint(\"Tổng quỹ lớp:\", tong)"
  },
  {
   "type": "code",
   "prompt": "**Kiểm thử trường hợp đặc biệt.** Viết hàm `trung_binh(ds)` tính điểm trung bình (làm tròn xuống, dùng `//`) của danh sách điểm `ds`. Nếu danh sách **rỗng** thì trả về chuỗi `Không có điểm nào` để tránh lỗi chia cho 0. Sau đó chạy thử với hai bộ dữ liệu: gọi `print(trung_binh([8, 6, 10]))` rồi `print(trung_binh([]))`. Kết quả phải là hai dòng: `8` và `Không có điểm nào`.",
   "starter": "# Viết hàm trung_binh(ds) ở đây\n# Nhớ xử lí trường hợp danh sách rỗng\n\n# Hai dòng kiểm thử (giữ nguyên):\n# print(trung_binh([8, 6, 10]))\n# print(trung_binh([]))\n",
   "expected": "8\nKhông có điểm nào",
   "hint": "Trước khi chia, hãy kiểm tra `len(ds) == 0` để bắt trường hợp danh sách rỗng.",
   "solution": "def trung_binh(ds):\n    if len(ds) == 0:\n        return \"Không có điểm nào\"\n    return sum(ds) // len(ds)\n\nprint(trung_binh([8, 6, 10]))\nprint(trung_binh([]))"
  }
 ],
 "C10-30": [
  {
   "type": "fill",
   "prompt": "Sơ đồ khối trong bài mô tả thuật toán **tính tổng các số chia hết cho 3** từ 1 đến `n`. Đầu vào là `n = 10`, Đầu ra là tổng `S`. Điền điều kiện còn thiếu ở hình thoi (`i` chia hết cho 3) để chương trình **in ra** đúng tổng `S`.",
   "starter": "n = 10\nS = 0\nfor i in range(1, n + 1):\n    if i % 3 == ___:\n        S = S + i\nprint(S)",
   "expected": "18",
   "hint": "Một số chia hết cho 3 khi phần dư của phép chia cho 3 bằng 0.",
   "solution": "n = 10\nS = 0\nfor i in range(1, n + 1):\n    if i % 3 == 0:\n        S = S + i\nprint(S)"
  },
  {
   "type": "fill",
   "prompt": "🐞 **TÌM & SỬA LỖI.** Bài yêu cầu tính **điểm trung bình** 4 môn trong danh sách `diem`. Bạn học sinh nhầm **dữ liệu trung gian** (tổng điểm) với **Đầu ra** nên in nhầm tổng. Hãy sửa dòng cuối để chương trình **in ra điểm trung bình** (tổng chia số môn). Kết quả phải in ra `7.5`.",
   "starter": "diem = [8, 6, 7, 9]\ntong = 0\nfor d in diem:\n    tong = tong + d\nso_mon = len(diem)\nprint(___)",
   "expected": "7.5",
   "hint": "Trung bình = tổng điểm chia cho số môn; dùng biến `tong` và `so_mon`.",
   "solution": "diem = [8, 6, 7, 9]\ntong = 0\nfor d in diem:\n    tong = tong + d\nso_mon = len(diem)\nprint(tong / so_mon)"
  },
  {
   "type": "code",
   "prompt": "Cô giáo cho danh sách điểm của tổ: `diem = [8, 5, 9, 7, 10, 6, 8]`. Hãy xác định Đầu vào (danh sách điểm) và Đầu ra (số bạn đạt loại **giỏi**, tức điểm **từ 8 trở lên**), rồi viết chương trình **in ra số bạn đạt loại giỏi**.",
   "starter": "diem = [8, 5, 9, 7, 10, 6, 8]\n# đếm số bạn có điểm >= 8 rồi in ra\n",
   "expected": "4",
   "hint": "Dùng một biến đếm bắt đầu từ 0, duyệt từng điểm bằng vòng `for` và tăng đếm khi `d >= 8`.",
   "solution": "diem = [8, 5, 9, 7, 10, 6, 8]\ndem = 0\nfor d in diem:\n    if d >= 8:\n        dem = dem + 1\nprint(dem)"
  }
 ],
 "C10-31": [
  {
   "type": "fill",
   "prompt": "Tổ 1 có bảng điểm kiểm tra `diem = [8, 6, 9, 7]`. Điền vào ba chỗ trống để: **chèn** điểm `10` vào ô chỉ số `2`, **xoá** điểm `6`, rồi **lấy ra** (pop) phần tử ở ô đầu tiên vào biến `x`. In ra danh sách sau mỗi bước và giá trị `x`. Kết quả mong đợi:\n```\n[8, 6, 10, 9, 7]\n[8, 10, 9, 7]\n8\n[10, 9, 7]\n```",
   "starter": "diem = [8, 6, 9, 7]\ndiem.___(2, 10)\nprint(diem)\ndiem.___(6)\nprint(diem)\nx = diem.___(0)\nprint(x)\nprint(diem)",
   "expected": "[8, 6, 10, 9, 7]\n[8, 10, 9, 7]\n8\n[10, 9, 7]",
   "hint": "Ba lệnh cần dùng lần lượt là chèn theo vị trí, xoá theo giá trị, và lấy ra theo vị trí (có trả về giá trị).",
   "solution": "diem = [8, 6, 9, 7]\ndiem.insert(2, 10)\nprint(diem)\ndiem.remove(6)\nprint(diem)\nx = diem.pop(0)\nprint(x)\nprint(diem)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code dưới xử lí danh sách số báo danh `sbd = [15, 8, 23, 8, 40]`: đếm số lần xuất hiện của `8`, tìm vị trí đầu tiên của `8`, xoá `23`, rồi muốn xoá `30` nếu có — nếu không có thì in `Khong tim thay 30`. Code hiện **báo lỗi và dừng** vì gọi thẳng `remove(30)` trong khi `30` không hề có trong danh sách. Hãy sửa để chương trình chạy trọn vẹn và in ra:\n```\n2\n1\n[15, 8, 8, 40]\nKhong tim thay 30\n```",
   "starter": "sbd = [15, 8, 23, 8, 40]\nprint(sbd.count(8))\nprint(sbd.index(8))\nsbd.remove(23)\nprint(sbd)\nsbd.remove(30)\nprint(sbd)",
   "expected": "2\n1\n[15, 8, 8, 40]\nKhong tim thay 30",
   "hint": "Trước khi gọi `remove`, hãy hỏi `if 30 in sbd:` rồi mới xoá; nhánh `else` in thông báo không tìm thấy.",
   "solution": "sbd = [15, 8, 23, 8, 40]\nprint(sbd.count(8))\nprint(sbd.index(8))\nsbd.remove(23)\nprint(sbd)\nif 30 in sbd:\n    sbd.remove(30)\n    print(sbd)\nelse:\n    print('Khong tim thay 30')"
  },
  {
   "type": "code",
   "prompt": "Sổ quỹ lớp ghi số tiền (nghìn đồng) biến động mỗi ngày: `quy = [20, -5, 35, 10, -8, 50, 15]`, trong đó số **âm** là ngày chi tiền. Hãy viết chương trình: giữ lại một **bản sao độc lập** của `quy` vào biến `goc`; lọc ra các khoản **không âm** rồi **sắp giảm dần**; sau đó in ra (mỗi thứ một dòng): danh sách đã sắp, **ba khoản thu lớn nhất** (lát cắt), rồi `len sum max min` của danh sách đã lọc cách nhau một dấu cách, và cuối cùng in `goc` để chứng minh bản gốc không đổi. Kết quả mong đợi:\n```\n[50, 35, 20, 15, 10]\n[50, 35, 20]\n5 130 50 10\n[20, -5, 35, 10, -8, 50, 15]\n```",
   "starter": "quy = [20, -5, 35, 10, -8, 50, 15]\n# tao ban sao goc bang .copy()\n# loc so khong am vao danh sach moi, roi sort giam dan\n# in: danh sach, lat cat 3 phan tu dau, va len/sum/max/min\n",
   "expected": "[50, 35, 20, 15, 10]\n[50, 35, 20]\n5 130 50 10\n[20, -5, 35, 10, -8, 50, 15]",
   "hint": "Dùng `goc = quy.copy()`, vòng `for` với `if x >= 0` để `append`, `sort(reverse=True)`, lát cắt `[:3]`, và `print(len(...), sum(...), max(...), min(...))`.",
   "solution": "quy = [20, -5, 35, 10, -8, 50, 15]\ngoc = quy.copy()\nduong = []\nfor x in quy:\n    if x >= 0:\n        duong.append(x)\nduong.sort(reverse=True)\nprint(duong)\nprint(duong[:3])\nprint(len(duong), sum(duong), max(duong), min(duong))\nprint(goc)"
  }
 ],
 "C10-32": [
  {
   "type": "fill",
   "prompt": "Tổ 1 của lớp em có danh sách bạn viết liền, cách nhau bởi dấu phẩy trong xâu `to`. Hãy **tách xâu theo dấu phẩy** để được danh sách các tên, rồi in ra **số bạn trong tổ**. Điền vào chỗ `___`. Kết quả in ra: `6`.",
   "starter": "to = \"Lan,Huy,Minh,Trang,Bảo,An\"\nten = to.___(\",\")\nprint(len(ten))",
   "expected": "6",
   "hint": "Muốn cắt xâu theo dấu phân cách tự chọn, dùng phương thức tách và đặt dấu phẩy trong ngoặc.",
   "solution": "to = \"Lan,Huy,Minh,Trang,Bảo,An\"\nten = to.split(\",\")\nprint(len(ten))"
  },
  {
   "type": "code",
   "prompt": "Xâu `tkb` ghi thời khóa biểu một buổi học (các môn cách nhau dấu cách). Hãy **dò tìm trong xâu** rồi in ra **ba dòng**: (1) số tiết môn `\"Toán\"` bằng `count`, (2) kết quả kiểm tra `\"Lí\"` có trong thời khóa biểu không (`True`/`False`) bằng toán tử `in`, (3) vị trí xuất hiện đầu tiên của `\"Tin\"` bằng `find`. Với `tkb = \"Toán Văn Toán Tin Toán Anh\"`, kết quả in ra:\n```\n3\nFalse\n14\n```",
   "starter": "tkb = \"Toán Văn Toán Tin Toán Anh\"\n# In 3 dòng: count(\"Toán\"), \"Lí\" in tkb, find(\"Tin\")\n",
   "expected": "3\nFalse\n14",
   "hint": "Dùng lần lượt `tkb.count(...)`, `\"Lí\" in tkb` và `tkb.find(...)`, mỗi kết quả một lệnh `print`.",
   "solution": "tkb = \"Toán Văn Toán Tin Toán Anh\"\nprint(tkb.count(\"Toán\"))\nprint(\"Lí\" in tkb)\nprint(tkb.find(\"Tin\"))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code muốn ghép ba điểm kiểm tra thành thông báo và tính tổng, nhưng chạy bị **lỗi**. Sửa cho chạy đúng để in ra:\n```\nTổng điểm: 9 + 8 + 10 = 27\n```\nGợi ý lỗi: `join` chỉ ghép được **danh sách toàn xâu**, và không thể nối một **số** vào xâu bằng dấu `+`.",
   "starter": "diem = [9, 8, 10]\ntong = 0\nfor x in diem:\n    tong = tong + x\nprint(\"Tổng điểm: \" + \" + \".join(diem) + \" = \" + tong)",
   "expected": "Tổng điểm: 9 + 8 + 10 = 27",
   "hint": "Chuyển mỗi điểm sang xâu bằng `str(x)` trước khi `join`, và bọc `tong` trong `str()` khi nối vào câu.",
   "solution": "diem = [9, 8, 10]\ntong = 0\nds = []\nfor x in diem:\n    tong = tong + x\n    ds.append(str(x))\nprint(\"Tổng điểm: \" + \" + \".join(ds) + \" = \" + str(tong))"
  }
 ],
 "C10-33": [
  {
   "type": "fill",
   "prompt": "Bạn viết hàm `tien_but(so_luong, gia_moi_cay)` để tính tiền mua bút cho tổ. Hàm phải **trả về** (return) tổng tiền = số lượng nhân đơn giá. Điền chỗ trống để chương trình chạy đúng. In ra tiền mua **6** cây bút, mỗi cây **4000** đồng (kết quả mong đợi: `24000`).",
   "starter": "def tien_but(so_luong, gia_moi_cay):\n    return ___\n\nprint(tien_but(6, 4000))",
   "expected": "24000",
   "hint": "Trong thân hàm, hai tham số `so_luong` và `gia_moi_cay` đóng vai trò như hai ô trống chứa giá trị được truyền vào; hãy nhân chúng với nhau.",
   "solution": "def tien_but(so_luong, gia_moi_cay):\n    return so_luong * gia_moi_cay\n\nprint(tien_but(6, 4000))"
  },
  {
   "type": "code",
   "prompt": "Viết hàm `xep_loai(diem)` **trả về** xếp loại học lực: điểm từ 8 trở lên trả về `\"Giỏi\"`, từ 6.5 đến dưới 8 trả về `\"Khá\"`, còn lại trả về `\"Trung bình\"`. Sau đó in ra xếp loại của ba bạn có điểm lần lượt là **9**, **7** và **5**, mỗi kết quả một dòng.",
   "starter": "# Viết hàm xep_loai(diem) dùng nhiều lệnh return\n# rồi gọi và in cho các điểm 9, 7, 5\n",
   "expected": "Giỏi\nKhá\nTrung bình",
   "hint": "Một hàm được phép có nhiều `return` ở các nhánh `if`; khi một lệnh `return` chạy thì hàm kết thúc ngay nên các nhánh sau không cần `else`.",
   "solution": "def xep_loai(diem):\n    if diem >= 8:\n        return \"Giỏi\"\n    if diem >= 6.5:\n        return \"Khá\"\n    return \"Trung bình\"\n\nprint(xep_loai(9))\nprint(xep_loai(7))\nprint(xep_loai(5))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Bạn muốn hàm `dien_tich` tính diện tích hình chữ nhật rồi giao kết quả về cho biến `s` để in câu `Diện tích là: 20`. Nhưng chạy lên lại ra `Diện tích là: None`. Hãy tìm và sửa lỗi để chương trình in ra đúng dòng `Diện tích là: 20`.",
   "starter": "def dien_tich(dai, rong):\n    print(dai * rong)\n\ns = dien_tich(4, 5)\nprint(\"Diện tích là:\", s)",
   "expected": "Diện tích là: 20",
   "hint": "Hàm chỉ `print()` mà không có `return` thì khi gán vào biến sẽ cho `None`; muốn giao giá trị ra ngoài phải dùng lệnh nào?",
   "solution": "def dien_tich(dai, rong):\n    return dai * rong\n\ns = dien_tich(4, 5)\nprint(\"Diện tích là:\", s)"
  }
 ],
 "C10-34": [
  {
   "type": "fill",
   "prompt": "Quỹ lớp có **500000** đồng, được lưu trong biến toàn cục `quy_lop`. Hàm `xem_quy()` chỉ **đọc** biến này để in ra. Điền chỗ trống để chương trình in đúng:\n\n`Quy lop hien co: 500000 dong`\n`Ngoai ham, quy van la: 500000`",
   "starter": "quy_lop = 500000\n\ndef xem_quy():\n    print(\"Quy lop hien co:\", ___, \"dong\")\n\nxem_quy()\nprint(\"Ngoai ham, quy van la:\", quy_lop)",
   "expected": "Quy lop hien co: 500000 dong\nNgoai ham, quy van la: 500000",
   "hint": "Trong hàm chỉ đọc chứ không gán, nên cứ gọi thẳng tên biến toàn cục.",
   "solution": "quy_lop = 500000\n\ndef xem_quy():\n    print(\"Quy lop hien co:\", quy_lop, \"dong\")\n\nxem_quy()\nprint(\"Ngoai ham, quy van la:\", quy_lop)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Bạn muốn hàm `cong_diem` cộng dồn điểm thi đua vào biến toàn cục `diem_to`. Sau khi cộng 10 rồi cộng 5, chương trình phải in ra:\n\n`Diem to hien tai: 15`\n\nNhưng đoạn code dưới đây bị lỗi. Hãy sửa để hàm thật sự cập nhật được biến toàn cục.",
   "starter": "diem_to = 0\n\ndef cong_diem(them):\n    diem_to = diem_to + them\n\ncong_diem(10)\ncong_diem(5)\nprint(\"Diem to hien tai:\", diem_to)",
   "expected": "Diem to hien tai: 15",
   "hint": "Muốn hàm sửa được biến toàn cục thì phải khai báo `global` cho tên đó ở đầu thân hàm.",
   "solution": "diem_to = 0\n\ndef cong_diem(them):\n    global diem_to\n    diem_to = diem_to + them\n\ncong_diem(10)\ncong_diem(5)\nprint(\"Diem to hien tai:\", diem_to)"
  },
  {
   "type": "code",
   "prompt": "Ba bạn góp quỹ lớp với các khoản `20000`, `15000`, `30000` (đã cho sẵn trong danh sách `gop`). Hãy viết hàm `cong_them(hien_tai, k)` **trả về** tổng mới (dùng `return`, KHÔNG dùng `global`), rồi duyệt danh sách để cộng dồn vào biến `tong`. Cuối cùng in ra:\n\n`Tong quy gop duoc: 65000 dong`",
   "starter": "gop = [20000, 15000, 30000]\ntong = 0\n\n# Viet ham cong_them(hien_tai, k) tra ve tong moi\n# Roi dung vong for cong don vao bien tong\n",
   "expected": "Tong quy gop duoc: 65000 dong",
   "hint": "Hàm chỉ nhận vào giá trị hiện tại và số cần cộng rồi `return`; việc cập nhật `tong` là do chương trình chính gán lại.",
   "solution": "gop = [20000, 15000, 30000]\ntong = 0\n\ndef cong_them(hien_tai, k):\n    return hien_tai + k\n\nfor x in gop:\n    tong = cong_them(tong, x)\nprint(\"Tong quy gop duoc:\", tong, \"dong\")"
  }
 ],
 "C11-12": [
  {
   "type": "fill",
   "prompt": "Bạn dùng đồng hồ đếm số bước chân trong 5 ngày, lưu vào `list` `so_buoc`. Điền vào chỗ trống để **cộng dồn** tất cả phần tử và in ra dòng: `Tong so buoc ca tuan: 27000`.",
   "starter": "so_buoc = [4200, 6800, 5100, 7300, 3600]\ntong = 0\nfor b in so_buoc:\n    tong = ___\nprint('Tong so buoc ca tuan:', tong)",
   "expected": "Tong so buoc ca tuan: 27000",
   "hint": "Mỗi vòng lặp lấy giá trị cũ của `tong` cộng thêm phần tử `b` hiện tại.",
   "solution": "so_buoc = [4200, 6800, 5100, 7300, 3600]\ntong = 0\nfor b in so_buoc:\n    tong = tong + b\nprint('Tong so buoc ca tuan:', tong)"
  },
  {
   "type": "code",
   "prompt": "`list` `tien_tiet_kiem` ghi số tiền (đồng) bạn để dành mỗi ngày trong 6 ngày: `[15000, 8000, 20000, 5000, 12000, 25000]`. Hãy **đếm** xem có bao nhiêu ngày để dành được **từ 12000 trở lên** và in ra đúng dòng: `So ngay tiet kiem tu 12000 tro len: 4`.",
   "starter": "tien_tiet_kiem = [15000, 8000, 20000, 5000, 12000, 25000]\n# đếm số ngày >= 12000 rồi in ra\n",
   "expected": "So ngay tiet kiem tu 12000 tro len: 4",
   "hint": "Khởi tạo biến đếm bằng 0, duyệt list, gặp phần tử thỏa điều kiện thì cộng thêm 1.",
   "solution": "tien_tiet_kiem = [15000, 8000, 20000, 5000, 12000, 25000]\ndem = 0\nfor t in tien_tiet_kiem:\n    if t >= 12000:\n        dem = dem + 1\nprint('So ngay tiet kiem tu 12000 tro len:', dem)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code muốn tìm nhiệt độ **cao nhất**, **thấp nhất** trong `list` `nhiet_do` rồi in chênh lệch, nhưng chạy ra kết quả sai. Hãy sửa để in đúng 3 dòng:\n`Nhiet do cao nhat: 34`\n`Nhiet do thap nhat: 26`\n`Chenh lech: 8`",
   "starter": "nhiet_do = [28, 31, 27, 34, 30, 26]\ncao_nhat = 0\nthap_nhat = 0\nfor nd in nhiet_do:\n    if nd > cao_nhat:\n        cao_nhat = nd\n    if nd < thap_nhat:\n        thap_nhat = nd\nprint('Nhiet do cao nhat:', cao_nhat)\nprint('Nhiet do thap nhat:', thap_nhat)\nprint('Chenh lech:', cao_nhat - thap_nhat)",
   "expected": "Nhiet do cao nhat: 34\nNhiet do thap nhat: 26\nChenh lech: 8",
   "hint": "Khởi tạo `thap_nhat` bằng 0 luôn sai vì mọi nhiệt độ đều lớn hơn 0; hãy lấy phần tử đầu tiên làm chuẩn.",
   "solution": "nhiet_do = [28, 31, 27, 34, 30, 26]\ncao_nhat = nhiet_do[0]\nthap_nhat = nhiet_do[0]\nfor nd in nhiet_do:\n    if nd > cao_nhat:\n        cao_nhat = nd\n    if nd < thap_nhat:\n        thap_nhat = nd\nprint('Nhiet do cao nhat:', cao_nhat)\nprint('Nhiet do thap nhat:', thap_nhat)\nprint('Chenh lech:', cao_nhat - thap_nhat)"
  }
 ],
 "C11-13": [
  {
   "type": "fill",
   "prompt": "Tổ em ghi lại điểm kiểm tra của 5 bạn vào danh sách `diem`. Hãy hoàn thiện đoạn **tìm kiếm tuần tự** để tìm vị trí (chỉ số) của điểm `9`. Chương trình in ra: `Vị trí: 2`",
   "starter": "diem = [7, 5, 9, 6, 8]\ncan_tim = 9\nvi_tri = -1\nfor i in range(___):\n    if diem[i] == can_tim:\n        vi_tri = i\nprint('Vị trí:', vi_tri)",
   "expected": "Vị trí: 2",
   "hint": "Muốn duyệt qua mọi chỉ số của danh sách thì `range` cần chạy từ 0 đến hết độ dài của `diem`.",
   "solution": "diem = [7, 5, 9, 6, 8]\ncan_tim = 9\nvi_tri = -1\nfor i in range(len(diem)):\n    if diem[i] == can_tim:\n        vi_tri = i\nprint('Vị trí:', vi_tri)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Hàm `tim` phải tìm kiếm tuần tự một số trong danh bạ `sodt`, trả về chỉ số nếu thấy và `-1` nếu không có. Nhưng bạn An đặt `return -1` sai chỗ nên hàm luôn trả lời sai. Hãy sửa để chương trình in ra đúng:\n```\n2\n-1\n```",
   "starter": "def tim(day, x):\n    for i in range(len(day)):\n        if day[i] == x:\n            return i\n        else:\n            return -1\n\nsodt = [98, 77, 12, 45, 63]\nprint(tim(sodt, 12))\nprint(tim(sodt, 100))",
   "expected": "2\n-1",
   "hint": "Chỉ được kết luận 'không có' (`return -1`) SAU KHI đã duyệt hết dãy, chứ không phải ngay khi phần tử đầu tiên không khớp.",
   "solution": "def tim(day, x):\n    for i in range(len(day)):\n        if day[i] == x:\n            return i\n    return -1\n\nsodt = [98, 77, 12, 45, 63]\nprint(tim(sodt, 12))\nprint(tim(sodt, 100))"
  },
  {
   "type": "code",
   "prompt": "Lớp em lưu số tiền mỗi bạn đóng quỹ vào danh sách `quy`. Hãy tự viết hàm `tim_kiem(day, x)` dùng **tìm kiếm tuần tự**: trả về chỉ số đầu tiên bằng `x`, hoặc `-1` nếu không có. Dùng hàm đó cho 3 lần tra và in ra:\n```\nTìm 100 -> 2\nTìm 30 -> -1\nTìm 20 -> 1\n```",
   "starter": "# Viết hàm tim_kiem(day, x) ở đây\n\nquy = [50, 20, 100, 20, 80]\n# In kết quả tìm 100, 30, 20\n",
   "expected": "Tìm 100 -> 2\nTìm 30 -> -1\nTìm 20 -> 1",
   "hint": "Dùng `for i in range(len(day))`, gặp phần tử khớp thì `return i` ngay; hết vòng lặp mà không thấy thì `return -1`.",
   "solution": "def tim_kiem(day, x):\n    for i in range(len(day)):\n        if day[i] == x:\n            return i\n    return -1\n\nquy = [50, 20, 100, 20, 80]\nprint('Tìm 100 ->', tim_kiem(quy, 100))\nprint('Tìm 30 ->', tim_kiem(quy, 30))\nprint('Tìm 20 ->', tim_kiem(quy, 20))"
  }
 ],
 "C11-14": [
  {
   "type": "fill",
   "prompt": "Tổ em có bảng điểm đã **sắp xếp tăng dần** `diem = [4, 5, 6, 7, 8, 9, 10]`. Hãy điền vào hai chỗ trống để thuật toán **tìm kiếm nhị phân** chạy đúng, rồi cho biết vị trí của điểm 9. Chương trình phải in ra: `Vị trí của điểm 9: 5`.",
   "starter": "def tim_kiem(day, x):\n    trai = 0\n    phai = len(day) - 1\n    while trai <= phai:\n        giua = (trai + phai) // ___\n        if day[giua] == x:\n            return giua\n        elif day[giua] < x:\n            trai = giua + 1\n        else:\n            phai = giua - ___\n    return -1\n\ndiem = [4, 5, 6, 7, 8, 9, 10]\nvt = tim_kiem(diem, 9)\nprint('Vị trí của điểm 9:', vt)",
   "expected": "Vị trí của điểm 9: 5",
   "hint": "Chỉ số giữa là trung bình cộng của `trai` và `phai` lấy phần nguyên; khi giá trị giữa lớn hơn x thì `phai` lùi về ngay trước vị trí giữa.",
   "solution": "def tim_kiem(day, x):\n    trai = 0\n    phai = len(day) - 1\n    while trai <= phai:\n        giua = (trai + phai) // 2\n        if day[giua] == x:\n            return giua\n        elif day[giua] < x:\n            trai = giua + 1\n        else:\n            phai = giua - 1\n    return -1\n\ndiem = [4, 5, 6, 7, 8, 9, 10]\nvt = tim_kiem(diem, 9)\nprint('Vị trí của điểm 9:', vt)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Bạn lớp trưởng viết hàm tìm kiếm nhị phân trên danh sách cân nặng (kg) đã sắp xếp tăng dần, nhưng cả hai lần tìm đều ra `-1` dù giá trị có trong danh sách. Hãy tìm và sửa lỗi để chương trình in đúng:\n`45 kg ở vị trí: 2`\n`64 kg ở vị trí: 7`",
   "starter": "def tim_kiem(day, x):\n    trai = 0\n    phai = len(day) - 1\n    while trai <= phai:\n        giua = (trai + phai) // 2\n        if day[giua] == x:\n            return giua\n        elif day[giua] < x:\n            phai = giua - 1\n        else:\n            trai = giua + 1\n    return -1\n\ncan_nang = [38, 42, 45, 48, 51, 55, 60, 64]\nprint('45 kg ở vị trí:', tim_kiem(can_nang, 45))\nprint('64 kg ở vị trí:', tim_kiem(can_nang, 64))",
   "expected": "45 kg ở vị trí: 2\n64 kg ở vị trí: 7",
   "hint": "Dãy tăng dần: nếu giá trị ở giữa **nhỏ hơn** x thì x phải nằm ở nửa **bên phải** — hai nhánh cập nhật `trai` và `phai` đang bị đảo ngược.",
   "solution": "def tim_kiem(day, x):\n    trai = 0\n    phai = len(day) - 1\n    while trai <= phai:\n        giua = (trai + phai) // 2\n        if day[giua] == x:\n            return giua\n        elif day[giua] < x:\n            trai = giua + 1\n        else:\n            phai = giua - 1\n    return -1\n\ncan_nang = [38, 42, 45, 48, 51, 55, 60, 64]\nprint('45 kg ở vị trí:', tim_kiem(can_nang, 45))\nprint('64 kg ở vị trí:', tim_kiem(can_nang, 64))"
  },
  {
   "type": "code",
   "prompt": "Danh sách số báo danh đã sắp xếp tăng dần: `sbd = [101, 104, 109, 115, 120, 128, 133, 140, 152, 160, 175, 188, 199, 210, 225]`. Hãy viết hàm **tìm kiếm nhị phân** vừa trả về vị trí của số 152, vừa **đếm số bước lặp** (mỗi lần tính lại `giua` là một bước) đã dùng để tìm ra. In đúng hai dòng:\n`Tìm thấy 152 ở vị trí 8`\n`Số bước đã dùng: 4`",
   "starter": "# Viết hàm tìm kiếm nhị phân có đếm số bước (dùng vòng while với trai, phai, giua)\n# Danh sách đã cho:\nsbd = [101, 104, 109, 115, 120, 128, 133, 140, 152, 160, 175, 188, 199, 210, 225]\n",
   "expected": "Tìm thấy 152 ở vị trí 8\nSố bước đã dùng: 4",
   "hint": "Tạo một biến đếm khởi tạo bằng 0, tăng thêm 1 ở đầu mỗi vòng lặp `while` (ngay khi tính lại `giua`).",
   "solution": "def tim_kiem_nhi_phan(day, x):\n    trai = 0\n    phai = len(day) - 1\n    so_buoc = 0\n    while trai <= phai:\n        so_buoc = so_buoc + 1\n        giua = (trai + phai) // 2\n        if day[giua] == x:\n            return giua, so_buoc\n        elif day[giua] < x:\n            trai = giua + 1\n        else:\n            phai = giua - 1\n    return -1, so_buoc\n\nsbd = [101, 104, 109, 115, 120, 128, 133, 140, 152, 160, 175, 188, 199, 210, 225]\nvt, buoc = tim_kiem_nhi_phan(sbd, 152)\nprint('Tìm thấy 152 ở vị trí', vt)\nprint('Số bước đã dùng:', buoc)"
  }
 ],
 "C11-15": [
  {
   "type": "fill",
   "prompt": "Tổ 1 có điểm kiểm tra 5 bạn là `[7, 5, 9, 6, 8]`. Hãy điền chỗ trống để **sắp xếp nổi bọt** dãy điểm tăng dần, rồi in ra: `Điểm sắp xếp tăng dần: [5, 6, 7, 8, 9]`. Chỗ trống thứ nhất là **điều kiện** hai phần tử liền kề sai thứ tự, chỗ trống thứ hai là **câu lệnh đổi chỗ** chúng.",
   "starter": "diem = [7, 5, 9, 6, 8]\nn = len(diem)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if diem[j] ___ diem[j + 1]:\n            ___\nprint('Điểm sắp xếp tăng dần:', diem)",
   "expected": "Điểm sắp xếp tăng dần: [5, 6, 7, 8, 9]",
   "hint": "Muốn tăng dần thì đổi chỗ khi phần tử trước lớn hơn phần tử sau; đổi chỗ dùng cú pháp gán đồng thời hai vế.",
   "solution": "diem = [7, 5, 9, 6, 8]\nn = len(diem)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if diem[j] > diem[j + 1]:\n            diem[j], diem[j + 1] = diem[j + 1], diem[j]\nprint('Điểm sắp xếp tăng dần:', diem)"
  },
  {
   "type": "code",
   "prompt": "Chiều cao (cm) của 4 bạn khi mới xếp hàng là `[160, 155, 170, 150]`. Hãy dùng **sắp xếp nổi bọt** (hai vòng lặp lồng nhau) để xếp tăng dần, và **sau mỗi lượt duyệt của vòng ngoài** in ra dãy hiện tại theo dạng: `Sau lượt <số lượt> : <dãy>`. In đúng 3 dòng như vậy.",
   "starter": "cao = [160, 155, 170, 150]\nn = len(cao)\n# viết hai vòng lặp lồng nhau, in dãy sau mỗi lượt của vòng ngoài\n",
   "expected": "Sau lượt 1 : [155, 160, 150, 170]\nSau lượt 2 : [155, 150, 160, 170]\nSau lượt 3 : [150, 155, 160, 170]",
   "hint": "Đặt lệnh `print` ngay sau khi vòng trong kết thúc, tức là bên trong vòng ngoài nhưng ngoài vòng trong.",
   "solution": "cao = [160, 155, 170, 150]\nn = len(cao)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if cao[j] > cao[j + 1]:\n            cao[j], cao[j + 1] = cao[j + 1], cao[j]\n    print('Sau lượt', i + 1, ':', cao)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn code dưới đây định sắp xếp số tiền quỹ (nghìn đồng) mỗi bạn góp `[20, 50, 10, 40, 30]` tăng dần bằng nổi bọt, rồi in ra `Sắp xếp tăng dần: [10, 20, 30, 40, 50]`. Nhưng khi chạy nó **báo lỗi vượt chỉ số** (index out of range). Hãy tìm và sửa **phạm vi vòng lặp** cho đúng để chương trình in ra kết quả trên.",
   "starter": "tien = [20, 50, 10, 40, 30]\nn = len(tien)\nfor i in range(n):\n    for j in range(n):\n        if tien[j] > tien[j + 1]:\n            tien[j], tien[j + 1] = tien[j + 1], tien[j]\nprint('Sắp xếp tăng dần:', tien)",
   "expected": "Sắp xếp tăng dần: [10, 20, 30, 40, 50]",
   "hint": "Vòng trong so sánh `tien[j]` với `tien[j + 1]` nên `j` không được chạm tới chỉ số cuối; xem lại `range` của vòng trong (và có thể cả vòng ngoài).",
   "solution": "tien = [20, 50, 10, 40, 30]\nn = len(tien)\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if tien[j] > tien[j + 1]:\n            tien[j], tien[j + 1] = tien[j + 1], tien[j]\nprint('Sắp xếp tăng dần:', tien)"
  }
 ],
 "C11-17": [
  {
   "type": "fill",
   "prompt": "Tổ em ghi lại số cây mỗi bạn trồng trong buổi lao động. Bài toán được **chia thành một hàm nhỏ** `tinh_tong(ds)` lo đúng việc cộng dồn, còn phần chính chỉ gọi hàm và in kết quả. Hãy điền chỗ `___` để hàm trả về đúng tổng. Chương trình cần in ra: `Tổng số cây: 14`",
   "starter": "def tinh_tong(ds):\n    tong = 0\n    for x in ds:\n        tong = tong + x\n    return ___\n\ncay = [3, 5, 2, 4]\nprint('Tổng số cây:', tinh_tong(cay))",
   "expected": "Tổng số cây: 14",
   "hint": "Biến nào đang giữ kết quả cộng dồn sau vòng lặp thì trả về biến đó.",
   "solution": "def tinh_tong(ds):\n    tong = 0\n    for x in ds:\n        tong = tong + x\n    return tong\n\ncay = [3, 5, 2, 4]\nprint('Tổng số cây:', tinh_tong(cay))"
  },
  {
   "type": "code",
   "prompt": "Lớp em thu quỹ, mỗi tổ đóng một khoản: `[50000, 45000, 60000]`. Hãy **chia bài toán thành hai hàm**, mỗi hàm lo đúng một việc: `tong_quy(ds)` tính tổng tiền, và `trung_binh(ds)` tính trung bình mỗi tổ (dùng phép chia lấy nguyên `//`, và nên **tái sử dụng** hàm `tong_quy`). Phần chính gọi hai hàm rồi in đúng hai dòng:\n`Tổng quỹ: 155000`\n`Trung bình mỗi tổ: 51666`",
   "starter": "# Bước 1: viết hàm tong_quy(ds) tính tổng\n# Bước 2: viết hàm trung_binh(ds) dùng lại tong_quy\n# Bước 3: phần chính gọi hàm và in kết quả\n",
   "expected": "Tổng quỹ: 155000\nTrung bình mỗi tổ: 51666",
   "hint": "Cho `trung_binh` gọi lại `tong_quy(ds)` rồi chia cho `len(ds)` bằng `//`.",
   "solution": "def tong_quy(ds):\n    t = 0\n    for x in ds:\n        t = t + x\n    return t\n\ndef trung_binh(ds):\n    return tong_quy(ds) // len(ds)\n\ntien = [50000, 45000, 60000]\nprint('Tổng quỹ:', tong_quy(tien))\nprint('Trung bình mỗi tổ:', trung_binh(tien))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn dưới tách riêng hàm `dem_dat(ds)` để đếm số bạn đạt (điểm từ 5 trở lên) trong danh sách điểm `[8, 4, 6, 5, 3, 9]`. Đúng ra phải đếm được **4** bạn, nhưng chương trình lại in sai. Hãy tìm và sửa lỗi để in đúng: `Số bạn đạt: 4`",
   "starter": "def dem_dat(ds):\n    dem = 0\n    for d in ds:\n        if d >= 5:\n            dem = dem + 1\n        return dem\n\ndiem = [8, 4, 6, 5, 3, 9]\nprint('Số bạn đạt:', dem_dat(diem))",
   "expected": "Số bạn đạt: 4",
   "hint": "Lệnh `return` đang nằm trong vòng lặp nên hàm thoát ngay sau bạn đầu tiên; hãy đưa nó ra đúng mức của hàm.",
   "solution": "def dem_dat(ds):\n    dem = 0\n    for d in ds:\n        if d >= 5:\n            dem = dem + 1\n    return dem\n\ndiem = [8, 4, 6, 5, 3, 9]\nprint('Số bạn đạt:', dem_dat(diem))"
  }
 ],
 "C11-18": [
  {
   "type": "fill",
   "prompt": "Chương trình dưới đây kiểm thử hàm `tong` (tính tổng một dãy điểm cộng của tổ) với **3 bộ dữ liệu**, trong đó có trường hợp biên là dãy rỗng. Điền chỗ trống để so kết quả chương trình với **kết quả mong đợi**. Cần in ra 3 dòng, mỗi dòng có dạng `<đầu vào> -> Đúng`.",
   "starter": "def tong(day):\n    s = 0\n    for x in day:\n        s = s + x\n    return s\n\nbo_kiem_thu = [\n    ([1, 2, 3], 6),\n    ([10], 10),\n    ([], 0),\n]\n\nfor dau_vao, mong_doi in bo_kiem_thu:\n    ket_qua = tong(dau_vao)\n    if ket_qua == ___:\n        print(dau_vao, \"-> Đúng\")\n    else:\n        print(dau_vao, \"-> Sai\")",
   "expected": "[1, 2, 3] -> Đúng\n[10] -> Đúng\n[] -> Đúng",
   "hint": "Trong mỗi bộ dữ liệu, phần thứ hai chính là kết quả mong đợi; hãy so `ket_qua` với đúng biến đó.",
   "solution": "def tong(day):\n    s = 0\n    for x in day:\n        s = s + x\n    return s\n\nbo_kiem_thu = [\n    ([1, 2, 3], 6),\n    ([10], 10),\n    ([], 0),\n]\n\nfor dau_vao, mong_doi in bo_kiem_thu:\n    ket_qua = tong(dau_vao)\n    if ket_qua == mong_doi:\n        print(dau_vao, \"-> Đúng\")\n    else:\n        print(dau_vao, \"-> Sai\")"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Hàm `dem_gioi` phải đếm số bạn đạt điểm **giỏi**, tức điểm **từ 8 trở lên**. Bộ kiểm thử có trường hợp biên là đúng điểm 8. Chạy thử, bộ đầu tiên sẽ báo `Sai` — hãy tìm và sửa lỗi để cả **3 bộ đều in ra `Đúng`**.",
   "starter": "def dem_gioi(diem):\n    dem = 0\n    for d in diem:\n        if d > 8:\n            dem = dem + 1\n    return dem\n\nbo_kiem_thu = [\n    ([8, 9, 7], 2),\n    ([10, 8], 2),\n    ([5, 6], 0),\n]\n\nfor dau_vao, mong_doi in bo_kiem_thu:\n    ket_qua = dem_gioi(dau_vao)\n    if ket_qua == mong_doi:\n        print(dau_vao, \"-> Đúng\")\n    else:\n        print(dau_vao, \"-> Sai. Mong đợi\", mong_doi, \"nhưng được\", ket_qua)",
   "expected": "[8, 9, 7] -> Đúng\n[10, 8] -> Đúng\n[5, 6] -> Đúng",
   "hint": "Điểm đúng bằng 8 vẫn là giỏi, nhưng `d > 8` lại bỏ sót nó — hãy xem lại dấu so sánh.",
   "solution": "def dem_gioi(diem):\n    dem = 0\n    for d in diem:\n        if d >= 8:\n            dem = dem + 1\n    return dem\n\nbo_kiem_thu = [\n    ([8, 9, 7], 2),\n    ([10, 8], 2),\n    ([5, 6], 0),\n]\n\nfor dau_vao, mong_doi in bo_kiem_thu:\n    ket_qua = dem_gioi(dau_vao)\n    if ket_qua == mong_doi:\n        print(dau_vao, \"-> Đúng\")\n    else:\n        print(dau_vao, \"-> Sai. Mong đợi\", mong_doi, \"nhưng được\", ket_qua)"
  },
  {
   "type": "code",
   "prompt": "Viết hàm `dem_rot(diem)` trả về số bạn bị **rớt**, tức số điểm **nhỏ hơn 5**. Sau đó tự xây một **bộ kiểm thử** gồm đúng 3 bộ dữ liệu (đầu vào, kết quả mong đợi): `([4, 5, 6], 1)`, `([9, 10], 0)` và trường hợp biên dãy rỗng `([], 0)`. Lần lượt chạy hàm với từng bộ và in ra 3 dòng dạng `<đầu vào> -> Đúng` hoặc `<đầu vào> -> Sai`.",
   "starter": "# 1) Viết hàm dem_rot(diem) đếm số điểm nhỏ hơn 5\n# 2) Tạo danh sách bo_kiem_thu gồm 3 bộ (đầu vào, mong đợi)\n# 3) Duyệt từng bộ, so ket_qua với mong_doi rồi in Đúng/Sai\n",
   "expected": "[4, 5, 6] -> Đúng\n[9, 10] -> Đúng\n[] -> Đúng",
   "hint": "Mỗi phần tử của `bo_kiem_thu` là một cặp `(dau_vao, mong_doi)`; duyệt bằng `for dau_vao, mong_doi in bo_kiem_thu`.",
   "solution": "def dem_rot(diem):\n    dem = 0\n    for d in diem:\n        if d < 5:\n            dem = dem + 1\n    return dem\n\nbo_kiem_thu = [\n    ([4, 5, 6], 1),\n    ([9, 10], 0),\n    ([], 0),\n]\n\nfor dau_vao, mong_doi in bo_kiem_thu:\n    ket_qua = dem_rot(dau_vao)\n    if ket_qua == mong_doi:\n        print(dau_vao, \"-> Đúng\")\n    else:\n        print(dau_vao, \"-> Sai\")"
  }
 ],
 "C11-19": [
  {
   "type": "fill",
   "prompt": "Bạn Lan đặt mục tiêu: **ngày thứ 1** làm 1 bài tập, ngày thứ 2 làm 2 bài, ..., ngày thứ `n` làm `n` bài. Hàm đệ quy `tong_bai(n)` tính **tổng số bài** làm được sau `n` ngày (tức `1 + 2 + ... + n`). Điền vào chỗ trống để chương trình in ra tổng số bài sau **6 ngày**.",
   "starter": "def tong_bai(n):\n    if n == 1:\n        return ___\n    else:\n        return n + tong_bai(___)\n\nprint(tong_bai(6))",
   "expected": "21",
   "hint": "Điều kiện dừng là ngày đầu tiên (`n == 1`) làm đúng 1 bài; mỗi lượt gọi tiếp phải nhỏ hơn một đơn vị để tiến về điều kiện dừng.",
   "solution": "def tong_bai(n):\n    if n == 1:\n        return 1\n    else:\n        return n + tong_bai(n - 1)\n\nprint(tong_bai(6))"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Trước giờ thi, màn hình lớp đếm ngược từ `5` về `0`. Hàm đệ quy `dem_nguoc(n)` phải in mỗi số trên một dòng: `5`, `4`, `3`, `2`, `1`, rồi in dòng cuối `Het gio! Nop bai!`. Code dưới đây bị lỗi khiến hàm **gọi mãi không dừng**. Hãy sửa để chương trình chạy đúng.",
   "starter": "def dem_nguoc(n):\n    if n == 0:\n        print(\"Het gio! Nop bai!\")\n    else:\n        print(n)\n        dem_nguoc(n)\n\ndem_nguoc(5)",
   "expected": "5\n4\n3\n2\n1\nHet gio! Nop bai!",
   "hint": "Sau mỗi lần in, lượt gọi đệ quy phải truyền một số **nhỏ hơn** thì mới có ngày chạm điều kiện dừng `n == 0`.",
   "solution": "def dem_nguoc(n):\n    if n == 0:\n        print(\"Het gio! Nop bai!\")\n    else:\n        print(n)\n        dem_nguoc(n - 1)\n\ndem_nguoc(5)"
  },
  {
   "type": "code",
   "prompt": "Bạn Minh bỏ ống heo: **tuần 0** có sẵn `1000` đồng, và **cứ mỗi tuần số tiền tăng gấp đôi** so với tuần trước. Viết hàm đệ quy `so_tien(tuan)` trả về số tiền ở tuần đó, với **điều kiện dừng tại `tuan == 0` trả về 1000**. In ra số tiền ở tuần `0`, tuần `3` và tuần `5`, mỗi kết quả trên một dòng.",
   "starter": "# Viết hàm đệ quy so_tien(tuan)\n# Điều kiện dừng: tuan == 0 -> trả về 1000\n# Ngược lại: 2 * so_tien(tuan - 1)\n",
   "expected": "1000\n8000\n32000",
   "hint": "Bài toán cỡ `tuan` dựa vào kết quả cỡ `tuan - 1` rồi nhân đôi; đừng quên `return` ở cả hai nhánh.",
   "solution": "def so_tien(tuan):\n    if tuan == 0:\n        return 1000\n    else:\n        return 2 * so_tien(tuan - 1)\n\nprint(so_tien(0))\nprint(so_tien(3))\nprint(so_tien(5))"
  }
 ],
 "C11-28": [
  {
   "type": "fill",
   "prompt": "Bảng `diem` lưu điểm của **3 bạn**, mỗi bạn **2 môn** (mỗi hàng là một bạn). Điền vào chỗ trống để chương trình in đúng **số hàng**, **số cột** và **điểm bạn 1 ở môn 2**. Kết quả cần in:\n```\nSố hàng: 3\nSố cột: 2\nĐiểm bạn 1 môn 2: 9\n```",
   "starter": "diem = [\n    [8, 9],\n    [7, 6],\n    [10, 8]\n]\nprint('Số hàng:', len(diem))\nprint('Số cột:', len(___))\nprint('Điểm bạn 1 môn 2:', diem[0][___])",
   "expected": "Số hàng: 3\nSố cột: 2\nĐiểm bạn 1 môn 2: 9",
   "hint": "Số cột chính là độ dài của một hàng bất kì, ví dụ hàng đầu `diem[0]`; ô đếm từ 0 nên môn thứ 2 là chỉ số 1.",
   "solution": "diem = [\n    [8, 9],\n    [7, 6],\n    [10, 8]\n]\nprint('Số hàng:', len(diem))\nprint('Số cột:', len(diem[0]))\nprint('Điểm bạn 1 môn 2:', diem[0][1])"
  },
  {
   "type": "code",
   "prompt": "Bảng `so` cho biết số bạn đi trực nhật của **3 tổ** trong **5 ngày** (mỗi hàng là một tổ). Dùng **hai vòng lặp lồng nhau** tính tổng số lượt trực của từng tổ và in ra đúng dạng:\n```\nTổ 1 : 12\nTổ 2 : 10\nTổ 3 : 13\n```\nDùng sẵn bảng:\n```\nso = [\n    [2, 3, 2, 4, 1],\n    [1, 2, 3, 2, 2],\n    [3, 3, 1, 2, 4]\n]\n```",
   "starter": "so = [\n    [2, 3, 2, 4, 1],\n    [1, 2, 3, 2, 2],\n    [3, 3, 1, 2, 4]\n]\n# Vòng ngoài chạy theo từng tổ (hàng), vòng trong cộng dồn các ngày (cột)\n",
   "expected": "Tổ 1 : 12\nTổ 2 : 10\nTổ 3 : 13",
   "hint": "Đặt lại `tong = 0` ở đầu mỗi hàng, rồi vòng trong cộng dồn `so[i][j]`; in `'Tổ', i + 1, ':', tong`.",
   "solution": "so = [\n    [2, 3, 2, 4, 1],\n    [1, 2, 3, 2, 2],\n    [3, 3, 1, 2, 4]\n]\nn = len(so)\nm = len(so[0])\nfor i in range(n):\n    tong = 0\n    for j in range(m):\n        tong = tong + so[i][j]\n    print('Tổ', i + 1, ':', tong)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**. Đoạn mã dưới muốn tìm **điểm lớn nhất** trong bảng `diem` (2 hàng, 4 cột) cùng **vị trí hàng, cột** của nó, nhưng vòng lặp trong đang chạy sai nên ra kết quả sai. Hãy sửa để in đúng:\n```\nLớn nhất: 10 tại hàng 1 cột 3\n```",
   "starter": "diem = [\n    [6, 8, 7, 5],\n    [9, 5, 8, 10]\n]\nn = len(diem)\nm = len(diem[0])\nmaxv = diem[0][0]\nhang = 0\ncot = 0\nfor i in range(n):\n    for j in range(len(diem)):\n        if diem[i][j] > maxv:\n            maxv = diem[i][j]\n            hang = i\n            cot = j\nprint('Lớn nhất:', maxv, 'tại hàng', hang, 'cột', cot)",
   "expected": "Lớn nhất: 10 tại hàng 1 cột 3",
   "hint": "Vòng trong phải chạy hết số **cột** chứ không phải số hàng: xem lại `range(len(diem))`.",
   "solution": "diem = [\n    [6, 8, 7, 5],\n    [9, 5, 8, 10]\n]\nn = len(diem)\nm = len(diem[0])\nmaxv = diem[0][0]\nhang = 0\ncot = 0\nfor i in range(n):\n    for j in range(m):\n        if diem[i][j] > maxv:\n            maxv = diem[i][j]\n            hang = i\n            cot = j\nprint('Lớn nhất:', maxv, 'tại hàng', hang, 'cột', cot)"
  }
 ],
 "C11-29": [
  {
   "type": "fill",
   "prompt": "**Sắp xếp chọn** dãy điểm kiểm tra của tổ em theo thứ tự **tăng dần**. Mỗi lượt, vòng trong chỉ ghi nhớ **vị trí** phần tử nhỏ nhất vào biến `vt_min`. Điền chỗ trống để so sánh cho đúng, rồi in ra:\n`Diem sap tang dan: [5, 6, 7, 8, 9]`",
   "starter": "diem = [8, 5, 9, 6, 7]\nn = len(diem)\nfor i in range(n - 1):\n    vt_min = i\n    for j in range(i + 1, n):\n        if diem[j] < diem[___]:\n            vt_min = j\n    diem[i], diem[vt_min] = diem[vt_min], diem[i]\nprint('Diem sap tang dan:', diem)",
   "expected": "Diem sap tang dan: [5, 6, 7, 8, 9]",
   "hint": "Cần so sánh phần tử đang xét với phần tử nhỏ nhất tìm được đến lúc này, mà vị trí của nó đang được giữ trong biến nào?",
   "solution": "diem = [8, 5, 9, 6, 7]\nn = len(diem)\nfor i in range(n - 1):\n    vt_min = i\n    for j in range(i + 1, n):\n        if diem[j] < diem[vt_min]:\n            vt_min = j\n    diem[i], diem[vt_min] = diem[vt_min], diem[i]\nprint('Diem sap tang dan:', diem)"
  },
  {
   "type": "code",
   "prompt": "Lớp em đo chiều cao (cm) của 5 bạn: `cao = [160, 155, 168, 152, 163]`.\nDùng công cụ có sẵn của Python để in đúng **ba dòng**:\n- Dòng 1: `Sap tang dan:` kèm danh sách sắp **tăng dần** bằng `sorted()` (KHÔNG được làm đổi danh sách gốc).\n- Dòng 2: `Danh sach goc:` kèm danh sách gốc để chứng minh nó **chưa đổi**.\n- Dòng 3: `Sap giam dan:` kèm danh sách sắp **giảm dần** bằng `.sort(reverse=True)`.",
   "starter": "cao = [160, 155, 168, 152, 163]\n# Viết code ở đây\n",
   "expected": "Sap tang dan: [152, 155, 160, 163, 168]\nDanh sach goc: [160, 155, 168, 152, 163]\nSap giam dan: [168, 163, 160, 155, 152]",
   "hint": "`sorted(cao)` tạo danh sách mới nên không đụng vào bản gốc; còn `cao.sort(...)` sắp xếp ngay tại chỗ.",
   "solution": "cao = [160, 155, 168, 152, 163]\ntang = sorted(cao)\nprint('Sap tang dan:', tang)\nprint('Danh sach goc:', cao)\ncao.sort(reverse=True)\nprint('Sap giam dan:', cao)"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**\nBạn Lan viết hàm **sắp xếp chèn** để sắp tiền quỹ (nghìn đồng) của các tổ theo thứ tự **tăng dần**, nhưng chạy ra lại **giảm dần**. Hãy tìm và sửa đúng **một** chỗ sai để chương trình in ra:\n`Sap xep: [10, 20, 30, 40, 50]`",
   "starter": "def chen(a):\n    for i in range(1, len(a)):\n        x = a[i]\n        j = i - 1\n        while j >= 0 and a[j] < x:\n            a[j + 1] = a[j]\n            j = j - 1\n        a[j + 1] = x\n    return a\n\nquy = [30, 10, 50, 20, 40]\nprint('Sap xep:', chen(quy))",
   "expected": "Sap xep: [10, 20, 30, 40, 50]",
   "hint": "Để sắp tăng dần, ta phải dịch sang phải những phần tử **lớn hơn** `x`; xem lại dấu so sánh trong điều kiện `while`.",
   "solution": "def chen(a):\n    for i in range(1, len(a)):\n        x = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > x:\n            a[j + 1] = a[j]\n            j = j - 1\n        a[j + 1] = x\n    return a\n\nquy = [30, 10, 50, 20, 40]\nprint('Sap xep:', chen(quy))"
  }
 ]
};
  Object.keys(ADD).forEach(function (k) { EXERCISES[k] = (EXERCISES[k] || []).concat(ADD[k]); });
})();
