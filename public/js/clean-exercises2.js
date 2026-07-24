/* ============================================================================
 *  BAI TAP TU CHAM (dot 2) cho bai hoc BAN SACH — Python/Skulpt, tu cham output.
 *  14 bai chua co thuc hanh: ma hoa, nhi phan, logic, dung luong, do phuc tap,
 *  mo dun, thu vien, ML/khoa hoc du lieu (phan loai, phan cum, mo phong...).
 *  Gan vao EXERCISES theo id C10-xx, C11-xx, C12-xx. Nap SAU exercises.js.
 * ==========================================================================*/
(function () {
  if (typeof EXERCISES === "undefined") return;
  var ADD = {
 "C10-22": [
  {
   "type": "fill",
   "prompt": "Trong bảng mã ASCII, mỗi kí tự có một **mã số** riêng: `'A'` là **65**, `'a'` là **97**, `'0'` (chữ số không) là **48**. Trong Python, `ord(kí_tự)` cho ra mã số, còn `chr(số)` cho ra kí tự.\nHãy điền vào chỗ trống để chương trình in ra đúng ba dòng:\n```\n65\na\n48\n```",
   "starter": "print(ord('A'))\nprint(chr(___))\nprint(ord(___))",
   "expected": "65\na\n48",
   "hint": "`chr(97)` cho kí tự có mã 97 là `'a'`; muốn lấy mã của chữ số 0 thì dùng `ord('0')` (số 0 đặt trong dấu nháy).",
   "solution": "print(ord('A'))\nprint(chr(97))\nprint(ord('0'))"
  },
  {
   "type": "code",
   "prompt": "Mỗi chữ **thường** có mã lớn hơn chữ **hoa** tương ứng đúng **32** đơn vị (ví dụ `'a'` là 97, `'A'` là 65). Cho chuỗi chữ hoa `s = 'TIN'`. Hãy dùng công thức `chr(ord(c) + 32)` để đổi **từng** kí tự sang chữ thường rồi in ra:\n`tin`\nLưu ý: không dùng `.lower()`, hãy tự tính bằng `ord` và `chr`.",
   "starter": "s = \"TIN\"\n# Tao mot chuoi rong de ghep ket qua\n# Duyet tung ki tu c trong s, cong 32 vao ma roi doi lai thanh chu\n# In chuoi ket qua ra man hinh\n",
   "expected": "tin",
   "hint": "Duyệt `for c in s`, mỗi vòng lặp nối thêm `chr(ord(c) + 32)` vào chuỗi kết quả, cuối cùng mới `print` chuỗi đó.",
   "solution": "s = \"TIN\"\nkq = \"\"\nfor c in s:\n    kq = kq + chr(ord(c) + 32)\nprint(kq)"
  },
  {
   "type": "code",
   "prompt": "Một tệp văn bản dùng bảng mã Unicode (UTF-8): mỗi **kí tự ASCII** (chữ, số không dấu) chiếm **1 byte**, mỗi **kí tự tiếng Việt có dấu** chiếm **2 byte**. Một tệp có **8 kí tự ASCII** và **6 kí tự tiếng Việt có dấu**. Hãy tính tổng dung lượng và in ra đúng:\n`Tong dung luong: 20 byte`",
   "starter": "ascii_chars = 8\nviet_chars = 6\n# ASCII: 1 byte moi ki tu; tieng Viet co dau: 2 byte moi ki tu\n# Tinh tong so byte roi in: Tong dung luong: ... byte\n",
   "expected": "Tong dung luong: 20 byte",
   "hint": "Tổng byte = `ascii_chars * 1 + viet_chars * 2`; in bằng `print` với các phần cách nhau bởi dấu phẩy.",
   "solution": "ascii_chars = 8\nviet_chars = 6\ntong = ascii_chars * 1 + viet_chars * 2\nprint(\"Tong dung luong:\", tong, \"byte\")"
  }
 ],
 "C10-23": [
  {
   "type": "fill",
   "prompt": "Trong Python: đổi **nhị phân sang thập phân** dùng `int('chuỗi_bit', 2)`; đổi **thập phân sang nhị phân** dùng `bin(số)` (kết quả có tiền tố `'0b'`, nên cắt bỏ 2 kí tự đầu bằng `[2:]`).\nHãy điền vào chỗ trống để in ra:\n```\n11\n1101\n```",
   "starter": "print(int('1011', ___))\nprint(bin(13)[___:])",
   "expected": "11\n1101",
   "hint": "Cơ số của hệ nhị phân là **2**; chuỗi `bin(13)` là `'0b1101'` nên bắt đầu lấy từ vị trí **2** để bỏ `'0b'`.",
   "solution": "print(int('1011', 2))\nprint(bin(13)[2:])"
  },
  {
   "type": "code",
   "prompt": "Máy tính lưu số bằng các **bit**. Với **n bit** ta biểu diễn được `2**n` giá trị khác nhau (từ 0 đến `2**n - 1`). Hãy in ra số giá trị biểu diễn được với **1 bit, 4 bit và 8 bit**, mỗi số trên một dòng:\n```\n2\n16\n256\n```",
   "starter": "# So gia tri cua n bit la 2 mu n (2 ** n)\n# Lan luot tinh cho n = 1, 4, 8 va in moi ket qua mot dong\n",
   "expected": "2\n16\n256",
   "hint": "Có thể dùng `for n in [1, 4, 8]:` rồi mỗi vòng `print(2 ** n)`.",
   "solution": "for n in [1, 4, 8]:\n    print(2 ** n)"
  },
  {
   "type": "code",
   "prompt": "Cho hai số nhị phân `a = '101'` và `b = '11'`. Hãy đổi chúng sang hệ thập phân, **cộng** lại, rồi in tổng ở **cả hai dạng** thập phân và nhị phân, đúng như sau:\n```\nThap phan: 8\nNhi phan: 1000\n```",
   "starter": "a = \"101\"\nb = \"11\"\n# Doi a, b sang thap phan bang int(..., 2) roi cong lai\n# In tong thap phan, sau do in tong nhi phan bang bin(...)[2:]\n",
   "expected": "Thap phan: 8\nNhi phan: 1000",
   "hint": "`int(a, 2)` và `int(b, 2)` cho hai số thập phân để cộng; đổi tổng về nhị phân bằng `bin(tong)[2:]`.",
   "solution": "a = \"101\"\nb = \"11\"\ntong = int(a, 2) + int(b, 2)\nprint(\"Thap phan:\", tong)\nprint(\"Nhi phan:\", bin(tong)[2:])"
  }
 ],
 "C10-24": [
  {
   "type": "fill",
   "prompt": "**Điều kiện đỗ kì thi.** Thí sinh **đỗ** khi điểm `>= 5` **VÀ** *không* vắng thi.\n\nCho `diem = 7` và `vang_thi = False`. Điền **một** toán tử lôgic vào chỗ `___` để `do` nhận đúng giá trị, rồi in ra.\n\nKết quả mong muốn:\n```\nTrue\n```",
   "starter": "diem = 7\nvang_thi = False\ndo = diem >= 5 and ___ vang_thi\nprint(do)",
   "expected": "True",
   "hint": "Cần đảo giá trị của `vang_thi` (False thành True) — dùng toán tử phủ định `not`.",
   "solution": "diem = 7\nvang_thi = False\ndo = diem >= 5 and not vang_thi\nprint(do)"
  },
  {
   "type": "code",
   "prompt": "**Bảng chân trị của phép AND (`and`).**\n\nPhép `and` chỉ cho `True` khi **cả hai** vế đều `True`. Dùng hai vòng `for` cho `a` và `b` chạy qua `[False, True]` để in bảng chân trị. Mỗi dòng in ba giá trị: `a`, `b`, `a and b` (cách nhau bởi dấu cách).\n\nKết quả mong muốn:\n```\nFalse False False\nFalse True False\nTrue False False\nTrue True True\n```",
   "starter": "# In bang chan tri cua phep AND\n# Duyet a trong [False, True], b trong [False, True]\n# Moi dong: print(a, b, a and b)",
   "expected": "False False False\nFalse True False\nTrue False False\nTrue True True",
   "hint": "Vòng `for a in [False, True]:` lồng vòng `for b in [False, True]:`, bên trong dùng `print(a, b, a and b)`.",
   "solution": "for a in [False, True]:\n    for b in [False, True]:\n        print(a, b, a and b)"
  },
  {
   "type": "fill",
   "prompt": "**Xếp loại Giỏi.** Một học sinh đạt loại **Giỏi** khi điểm trung bình `>= 8.0` **VÀ** không có môn nào dưới `6.5`.\n\nCho `diem = [8.0, 9.0, 8.5, 6.5]`. Điền toán tử lôgic vào chỗ `___` rồi in điểm trung bình và kết quả xếp loại.\n\nKết quả mong muốn:\n```\n8.0\nTrue\n```",
   "starter": "diem = [8.0, 9.0, 8.5, 6.5]\ndiem_tb = sum(diem) / len(diem)\ngioi = diem_tb >= 8.0 ___ min(diem) >= 6.5\nprint(diem_tb)\nprint(gioi)",
   "expected": "8.0\nTrue",
   "hint": "Cả hai điều kiện phải cùng đúng nên dùng toán tử `and`; `min(diem)` cho điểm thấp nhất.",
   "solution": "diem = [8.0, 9.0, 8.5, 6.5]\ndiem_tb = sum(diem) / len(diem)\ngioi = diem_tb >= 8.0 and min(diem) >= 6.5\nprint(diem_tb)\nprint(gioi)"
  }
 ],
 "C10-25": [
  {
   "type": "fill",
   "prompt": "**Dung lượng ảnh màu.** Một ảnh màu RGB rộng `800` điểm, cao `600` điểm, mỗi điểm ảnh dùng `24` bit (độ sâu màu).\n\nCông thức: dung lượng thô (bit) = rộng × cao × độ_sâu, rồi **chia 8** để đổi ra **byte**. Điền toán tử vào chỗ `___` để `so_byte` là **số nguyên byte**, rồi in ra.\n\nKết quả mong muốn:\n```\n1440000\n```",
   "starter": "rong = 800\ncao = 600\ndo_sau = 24\nso_byte = rong * cao * do_sau ___ 8\nprint(so_byte)",
   "expected": "1440000",
   "hint": "Đổi bit sang byte là chia cho 8; để ra số nguyên hãy dùng phép chia lấy phần nguyên `//`.",
   "solution": "rong = 800\ncao = 600\ndo_sau = 24\nso_byte = rong * cao * do_sau // 8\nprint(so_byte)"
  },
  {
   "type": "code",
   "prompt": "**Nhân đôi kích thước ảnh.** Ảnh gốc rộng `400` điểm, cao `300` điểm. Nếu **nhân đôi cả chiều rộng lẫn chiều cao** thì số điểm ảnh thay đổi thế nào?\n\nHãy in ba dòng: số điểm ảnh gốc, số điểm ảnh sau khi nhân đôi mỗi chiều, và số lần tăng lên.\n\nKết quả mong muốn:\n```\n120000\n480000\n4\n```",
   "starter": "rong = 400\ncao = 300\n# So diem anh = rong * cao\n# Khi nhan doi moi chieu: (rong*2) * (cao*2)\n# In: diem goc, diem moi, so lan tang (diem moi // diem goc)",
   "expected": "120000\n480000\n4",
   "hint": "Số điểm ảnh là tích hai chiều; nhân đôi mỗi chiều làm tích tăng 2 × 2 = 4 lần.",
   "solution": "rong = 400\ncao = 300\ndiem_goc = rong * cao\ndiem_moi = (rong * 2) * (cao * 2)\nprint(diem_goc)\nprint(diem_moi)\nprint(diem_moi // diem_goc)"
  },
  {
   "type": "code",
   "prompt": "**Dung lượng âm thanh.** Một đoạn nhạc chất lượng CD: tần số lấy mẫu `44100` Hz, mỗi mẫu `16` bit, `2` kênh (stereo), dài `10` giây.\n\nCông thức: dung lượng thô (bit) = tần_số × bit_mỗi_mẫu × số_kênh × số_giây; chia `8` để ra **byte**. Hãy in **số bit** rồi **số byte**.\n\nKết quả mong muốn:\n```\n14112000\n1764000\n```",
   "starter": "tan_so = 44100\nbit_mau = 16\nso_kenh = 2\nso_giay = 10\n# so_bit = tan_so * bit_mau * so_kenh * so_giay\n# so_byte = so_bit // 8\n# In so_bit roi so_byte",
   "expected": "14112000\n1764000",
   "hint": "Nhân lần lượt bốn đại lượng để ra số bit, sau đó dùng `// 8` để đổi sang byte.",
   "solution": "tan_so = 44100\nbit_mau = 16\nso_kenh = 2\nso_giay = 10\nso_bit = tan_so * bit_mau * so_kenh * so_giay\nso_byte = so_bit // 8\nprint(so_bit)\nprint(so_byte)"
  }
 ],
 "C11-16": [
  {
   "type": "code",
   "prompt": "Bài học **độ phức tạp thuật toán**: ta đo một thuật toán bằng cách **đếm số phép tính cơ bản**, không bấm giờ.\n\nCho danh sách `ds = [5, 3, 8, 1, 9, 2]`, hãy **tìm kiếm tuần tự** giá trị `x = 1`: so sánh lần lượt từ đầu và dùng một biến đếm để biết phải **so sánh bao nhiêu lần** thì tìm thấy (tìm thấy thì dừng).\n\nIn ra đúng:\n```\nSố phép so sánh: 4\n```",
   "starter": "ds = [5, 3, 8, 1, 9, 2]\nx = 1\n# Tạo biến dem = 0 để đếm số lần so sánh\n# Duyệt từng phần tử, mỗi lần so sánh thì dem tăng 1\n# Khi gặp x thì dừng vòng lặp bằng break\n",
   "expected": "Số phép so sánh: 4",
   "hint": "Mỗi vòng lặp cộng `dem` thêm 1 trước khi kiểm tra; khi `ds[i] == x` thì dùng `break` để dừng.",
   "solution": "ds = [5, 3, 8, 1, 9, 2]\nx = 1\ndem = 0\nfor i in range(len(ds)):\n    dem = dem + 1\n    if ds[i] == x:\n        break\nprint(\"Số phép so sánh:\", dem)"
  },
  {
   "type": "fill",
   "prompt": "Thuật toán có **hai vòng lặp lồng nhau** (kiểu sắp xếp nổi bọt) chạy với `n = 5`. Vòng ngoài chạy `n` lần, mỗi lần vòng trong lại chạy `n` lần, nên tổng số phép tính là `n * n`.\n\nĐiền vào chỗ `___` để đếm đúng tổng số phép tính rồi in ra:\n```\nSố phép tính: 25\n```",
   "starter": "n = 5\ndem = 0\nfor i in range(n):\n    for j in range(___):\n        dem = dem + 1\nprint(\"Số phép tính:\", dem)",
   "expected": "Số phép tính: 25",
   "hint": "Vòng trong cũng lặp `n` lần giống vòng ngoài, nên điền `n` vào `range(...)`.",
   "solution": "n = 5\ndem = 0\nfor i in range(n):\n    for j in range(n):\n        dem = dem + 1\nprint(\"Số phép tính:\", dem)"
  },
  {
   "type": "code",
   "prompt": "Với thuật toán độ phức tạp **O(n²)**, số phép tính là `n * n`. Hãy cho thấy khi **n tăng 10 lần** (từ 10 lên 100) thì số phép tính tăng bao nhiêu lần.\n\nTính số phép tính cho `n = 10` và `n = 100`, rồi in ra đúng **3 dòng**:\n```\nn = 10 cần 100 phép tính\nn = 100 cần 10000 phép tính\nGấp 100 lần\n```",
   "starter": "# Số phép tính khi n = 10 là 10 * 10\n# Số phép tính khi n = 100 là 100 * 100\n# In 2 dòng số phép tính, rồi in số lần gấp (dùng chia lấy nguyên //)\n",
   "expected": "n = 10 cần 100 phép tính\nn = 100 cần 10000 phép tính\nGấp 100 lần",
   "hint": "`10 * 10` bằng 100, `100 * 100` bằng 10000; số lần gấp tính bằng `10000 // 100`.",
   "solution": "a = 10 * 10\nb = 100 * 100\nprint(\"n = 10 cần\", a, \"phép tính\")\nprint(\"n = 100 cần\", b, \"phép tính\")\nprint(\"Gấp\", b // a, \"lần\")"
  }
 ],
 "C11-30": [
  {
   "type": "code",
   "prompt": "Chia chương trình thành các **mô đun (hàm)**, mỗi hàm một nhiệm vụ. Hãy viết hàm `trung_binh(ds)` **trả về** điểm trung bình của danh sách `ds` (dùng `sum` và `len`).\n\nVới `diem = [8, 9, 7, 10]`, gọi hàm và in ra đúng:\n```\nĐiểm trung bình: 8.5\n```",
   "starter": "# Viết hàm trung_binh(ds) trả về sum(ds) / len(ds)\n# Sau đó gọi với diem = [8, 9, 7, 10] và in kết quả, làm tròn 2 chữ số\n",
   "expected": "Điểm trung bình: 8.5",
   "hint": "Hàm dùng `return sum(ds) / len(ds)`; khi in có thể bọc `round(..., 2)` cho gọn.",
   "solution": "def trung_binh(ds):\n    return sum(ds) / len(ds)\n\ndiem = [8, 9, 7, 10]\nprint(\"Điểm trung bình:\", round(trung_binh(diem), 2))"
  },
  {
   "type": "fill",
   "prompt": "Viết một **mô đun** khác: hàm `dem_dat(ds, nguong)` **đếm** xem có bao nhiêu điểm **đạt** (lớn hơn hoặc bằng ngưỡng). Điền vào chỗ `___` để mỗi khi gặp một điểm đạt thì biến đếm tăng thêm 1.\n\nVới `diem = [4, 6, 8, 3, 9, 5]` và ngưỡng `5`, chương trình in ra:\n```\nSố bạn đạt: 4\n```",
   "starter": "def dem_dat(ds, nguong):\n    dem = 0\n    for x in ds:\n        if x >= nguong:\n            dem = dem + ___\n    return dem\n\ndiem = [4, 6, 8, 3, 9, 5]\nprint(\"Số bạn đạt:\", dem_dat(diem, 5))",
   "expected": "Số bạn đạt: 4",
   "hint": "Mỗi khi tìm thấy một điểm đạt, tăng biến đếm lên **1** đơn vị.",
   "solution": "def dem_dat(ds, nguong):\n    dem = 0\n    for x in ds:\n        if x >= nguong:\n            dem = dem + 1\n    return dem\n\ndiem = [4, 6, 8, 3, 9, 5]\nprint(\"Số bạn đạt:\", dem_dat(diem, 5))"
  },
  {
   "type": "code",
   "prompt": "Ghép các mô đun lại: **chương trình chính** gọi lần lượt các hàm nhỏ. Hãy định nghĩa trong cùng đoạn code ba hàm: `trung_binh(ds)`, `dem_dat(ds, nguong)` và `bao_cao(ds)` (hàm `bao_cao` gọi lại hai hàm kia để in báo cáo).\n\nVới `diem = [5, 8, 4, 9, 10, 6]` (ngưỡng đạt là 5), in ra đúng **2 dòng**:\n```\nTrung bình: 7.0\nSố đạt: 5\n```",
   "starter": "# Định nghĩa 3 hàm trong CÙNG đoạn code (không import tệp riêng):\n# - trung_binh(ds): trả về trung bình\n# - dem_dat(ds, nguong): đếm số điểm >= nguong\n# - bao_cao(ds): gọi 2 hàm trên rồi in ra\n# Cuối cùng gọi bao_cao(diem)\ndiem = [5, 8, 4, 9, 10, 6]\n",
   "expected": "Trung bình: 7.0\nSố đạt: 5",
   "hint": "Hàm `bao_cao` không tự tính, nó chỉ **gọi lại** `trung_binh(ds)` và `dem_dat(ds, 5)` rồi in kết quả.",
   "solution": "def trung_binh(ds):\n    return sum(ds) / len(ds)\n\ndef dem_dat(ds, nguong):\n    dem = 0\n    for x in ds:\n        if x >= nguong:\n            dem = dem + 1\n    return dem\n\ndef bao_cao(ds):\n    print(\"Trung bình:\", round(trung_binh(ds), 2))\n    print(\"Số đạt:\", dem_dat(ds, 5))\n\ndiem = [5, 8, 4, 9, 10, 6]\nbao_cao(diem)"
  }
 ],
 "C11-31": [
  {
   "type": "fill",
   "prompt": "Thư viện chuẩn `math` có sẵn hàm tính **căn bậc hai**. Sau khi `import math`, hãy dùng hàm đó để tính **cạnh huyền** tam giác vuông có hai cạnh góc vuông `a = 3`, `b = 4` (định lí Pythagore: căn của `a*a + b*b`).\n\nĐiền tên hàm còn thiếu vào chỗ `___` để in ra:\n```\nCạnh huyền: 5\n```",
   "starter": "import math\na = 3\nb = 4\nc = ___(a * a + b * b)\nprint(\"Cạnh huyền:\", int(c))",
   "expected": "Cạnh huyền: 5",
   "hint": "Hàm căn bậc hai trong thư viện `math` là `math.sqrt`.",
   "solution": "import math\na = 3\nb = 4\nc = math.sqrt(a * a + b * b)\nprint(\"Cạnh huyền:\", int(c))"
  },
  {
   "type": "code",
   "prompt": "Thư viện `math` còn có hằng số **pi** (`math.pi`). Cho đường tròn bán kính `r = 10`, hãy tính **chu vi** (`2 * pi * r`) và **diện tích** (`pi * r * r`), rồi in **phần nguyên** của mỗi kết quả bằng `int(...)`.\n\nIn ra đúng **2 dòng**:\n```\nChu vi khoảng: 62\nDiện tích khoảng: 314\n```",
   "starter": "import math\nr = 10\n# Chu vi = 2 * math.pi * r ; Diện tích = math.pi * r * r\n# In phần nguyên của mỗi kết quả bằng int(...)\n",
   "expected": "Chu vi khoảng: 62\nDiện tích khoảng: 314",
   "hint": "`int(2 * math.pi * r)` cho phần nguyên của chu vi; tương tự `int(math.pi * r * r)` cho diện tích.",
   "solution": "import math\nr = 10\nprint(\"Chu vi khoảng:\", int(2 * math.pi * r))\nprint(\"Diện tích khoảng:\", int(math.pi * r * r))"
  },
  {
   "type": "code",
   "prompt": "Ta có thể **tự tạo thư viện** bằng cách gói các hàm dùng chung. Hãy tự viết hàm `rut_gon(tu, mau)` để **rút gọn phân số**: chia cả tử và mẫu cho **ước chung lớn nhất** (dùng `math.gcd`), trả về chuỗi dạng `\"tử/mẫu\"`.\n\nGọi hàm với `24/36` và `15/25`, in ra đúng **2 dòng**:\n```\n24/36 = 2/3\n15/25 = 3/5\n```",
   "starter": "import math\n\n# Viết hàm rut_gon(tu, mau):\n#   uc = math.gcd(tu, mau)\n#   trả về str(tu // uc) + \"/\" + str(mau // uc)\n# Rồi gọi cho 24/36 và 15/25\n",
   "expected": "24/36 = 2/3\n15/25 = 3/5",
   "hint": "Lấy `uc = math.gcd(tu, mau)` rồi ghép chuỗi `str(tu // uc) + \"/\" + str(mau // uc)`.",
   "solution": "import math\n\ndef rut_gon(tu, mau):\n    uc = math.gcd(tu, mau)\n    return str(tu // uc) + \"/\" + str(mau // uc)\n\nprint(\"24/36 =\", rut_gon(24, 36))\nprint(\"15/25 =\", rut_gon(15, 25))"
  }
 ],
 "C12-16": [
  {
   "type": "fill",
   "prompt": "**Phân loại theo ngưỡng.** Một bộ phân loại đơn giản gán nhãn dựa trên **ngưỡng điểm 5**: nếu điểm **>= 5** thì **\"Đạt\"**, ngược lại **\"Chưa đạt\"**. Điền ngưỡng còn thiếu để chương trình in đúng nhãn cho 5 bạn:\n```\nĐạt\nChưa đạt\nĐạt\nĐạt\nChưa đạt\n```",
   "starter": "diem = [7, 4, 5, 9, 3]\nfor d in diem:\n    if d >= ___:\n        print(\"Đạt\")\n    else:\n        print(\"Chưa đạt\")",
   "expected": "Đạt\nChưa đạt\nĐạt\nĐạt\nChưa đạt",
   "hint": "Điều kiện phân loại là điểm lớn hơn hoặc bằng ngưỡng 5, nên điền số 5 vào chỗ trống.",
   "solution": "diem = [7, 4, 5, 9, 3]\nfor d in diem:\n    if d >= 5:\n        print(\"Đạt\")\n    else:\n        print(\"Chưa đạt\")"
  },
  {
   "type": "code",
   "prompt": "**Độ chính xác của mô hình.** Trên tập kiểm tra, mô hình lọc thư đưa ra `du_doan`, đáp án thật là `thuc_te`. **Độ chính xác = số dự đoán đúng / tổng số** (đổi ra phần trăm). Viết chương trình đếm số dự đoán trùng khớp rồi in ra đúng:\n```\nSố dự đoán đúng: 4\nĐộ chính xác: 80 %\n```",
   "starter": "# du_doan và thuc_te là kết quả trên tập kiểm tra\ndu_doan = [\"rác\", \"rác\", \"sạch\", \"sạch\", \"rác\"]\nthuc_te = [\"rác\", \"sạch\", \"sạch\", \"sạch\", \"rác\"]\n# Đếm số vị trí i mà du_doan[i] == thuc_te[i], rồi tính phần trăm\n",
   "expected": "Số dự đoán đúng: 4\nĐộ chính xác: 80 %",
   "hint": "Duyệt theo chỉ số i, cộng 1 mỗi khi du_doan[i] bằng thuc_te[i]; phần trăm = dung * 100 // len(du_doan).",
   "solution": "du_doan = [\"rác\", \"rác\", \"sạch\", \"sạch\", \"rác\"]\nthuc_te = [\"rác\", \"sạch\", \"sạch\", \"sạch\", \"rác\"]\ndung = 0\nfor i in range(len(du_doan)):\n    if du_doan[i] == thuc_te[i]:\n        dung = dung + 1\nprint(\"Số dự đoán đúng:\", dung)\nprint(\"Độ chính xác:\", dung * 100 // len(du_doan), \"%\")"
  },
  {
   "type": "fill",
   "prompt": "**Dự đoán số (hồi quy).** Mô hình dự đoán **giá nhà** theo công thức đường thẳng `y = a * x + b` với `a = 2`, `b = 10` (x là diện tích). Điền phần còn thiếu của công thức để in ra giá dự đoán cho 3 ngôi nhà:\n```\nDiện tích 1 -> Giá dự đoán: 12\nDiện tích 3 -> Giá dự đoán: 16\nDiện tích 5 -> Giá dự đoán: 20\n```",
   "starter": "a = 2\nb = 10\ndien_tich = [1, 3, 5]\nfor x in dien_tich:\n    y = a * x + ___\n    print(\"Diện tích\", x, \"-> Giá dự đoán:\", y)",
   "expected": "Diện tích 1 -> Giá dự đoán: 12\nDiện tích 3 -> Giá dự đoán: 16\nDiện tích 5 -> Giá dự đoán: 20",
   "hint": "Công thức đường thẳng là y = a * x + b, phần còn thiếu sau dấu cộng chính là biến b.",
   "solution": "a = 2\nb = 10\ndien_tich = [1, 3, 5]\nfor x in dien_tich:\n    y = a * x + b\n    print(\"Diện tích\", x, \"-> Giá dự đoán:\", y)"
  }
 ],
 "C12-27": [
  {
   "type": "fill",
   "prompt": "**Phân cụm quanh 2 tâm.** Khi chưa biết trước nhãn, ta gom mỗi điểm về **tâm gần hơn**. Cho `tam1 = 10`, `tam2 = 30`. Với mỗi điểm, tính **khoảng cách** `|x - tâm|` tới hai tâm; gần `tam1` hơn thì thuộc **Cụm 1**, ngược lại **Cụm 2**. Điền chỗ trống để in đúng:\n```\n8 -> Cụm 1\n12 -> Cụm 1\n25 -> Cụm 2\n33 -> Cụm 2\n18 -> Cụm 1\n```",
   "starter": "tam1 = 10\ntam2 = 30\ndiem = [8, 12, 25, 33, 18]\nfor x in diem:\n    d1 = abs(x - tam1)\n    d2 = abs(x - ___)\n    if d1 <= d2:\n        print(x, \"-> Cụm 1\")\n    else:\n        print(x, \"-> Cụm 2\")",
   "expected": "8 -> Cụm 1\n12 -> Cụm 1\n25 -> Cụm 2\n33 -> Cụm 2\n18 -> Cụm 1",
   "hint": "Khoảng cách tới một tâm là abs(x - tâm); ở dòng còn trống ta cần khoảng cách tới tâm còn lại là tam2.",
   "solution": "tam1 = 10\ntam2 = 30\ndiem = [8, 12, 25, 33, 18]\nfor x in diem:\n    d1 = abs(x - tam1)\n    d2 = abs(x - tam2)\n    if d1 <= d2:\n        print(x, \"-> Cụm 1\")\n    else:\n        print(x, \"-> Cụm 2\")"
  },
  {
   "type": "code",
   "prompt": "**Đếm số phần tử mỗi cụm.** Cho `tam1 = 5`, `tam2 = 20` và danh sách điểm. Gán mỗi điểm về tâm gần hơn rồi **đếm** xem mỗi cụm có bao nhiêu phần tử. In ra đúng:\n```\nCụm 1 có 4 phần tử\nCụm 2 có 3 phần tử\n```",
   "starter": "tam1 = 5\ntam2 = 20\ndiem = [3, 6, 4, 19, 22, 18, 7]\n# Dùng hai biến dem1, dem2; so sánh abs(x - tam1) và abs(x - tam2)\n",
   "expected": "Cụm 1 có 4 phần tử\nCụm 2 có 3 phần tử",
   "hint": "Mỗi điểm gần tam1 hơn thì tăng dem1, ngược lại tăng dem2; điểm gần hơn là điểm có abs nhỏ hơn.",
   "solution": "tam1 = 5\ntam2 = 20\ndiem = [3, 6, 4, 19, 22, 18, 7]\ndem1 = 0\ndem2 = 0\nfor x in diem:\n    if abs(x - tam1) <= abs(x - tam2):\n        dem1 = dem1 + 1\n    else:\n        dem2 = dem2 + 1\nprint(\"Cụm 1 có\", dem1, \"phần tử\")\nprint(\"Cụm 2 có\", dem2, \"phần tử\")"
  },
  {
   "type": "code",
   "prompt": "**Tìm cụm gần nhất trong 3 tâm.** Cho điểm `x = 14` và ba tâm `tam = [5, 15, 25]`. Tính danh sách **khoảng cách** `|x - tâm|` tới từng tâm, tìm khoảng cách **nhỏ nhất**, rồi cho biết `x` thuộc **cụm** nào (đánh số từ 1). In ra đúng:\n```\nKhoảng cách tới các tâm: [9, 1, 11]\nKhoảng cách nhỏ nhất: 1\nĐiểm x thuộc cụm số: 2\n```",
   "starter": "x = 14\ntam = [5, 15, 25]\n# Tạo list d = khoảng cách |x - t| bằng list comprehension\n# Tìm min(d), rồi tìm vị trí của nó để suy ra số cụm\n",
   "expected": "Khoảng cách tới các tâm: [9, 1, 11]\nKhoảng cách nhỏ nhất: 1\nĐiểm x thuộc cụm số: 2",
   "hint": "Dùng list comprehension tính các khoảng cách, min(d) là nhỏ nhất; vị trí i có d[i] bằng min ứng với cụm i + 1.",
   "solution": "x = 14\ntam = [5, 15, 25]\nd = [abs(x - t) for t in tam]\nprint(\"Khoảng cách tới các tâm:\", d)\nnho_nhat = min(d)\ncum = 0\nfor i in range(len(d)):\n    if d[i] == nho_nhat:\n        cum = i + 1\nprint(\"Khoảng cách nhỏ nhất:\", nho_nhat)\nprint(\"Điểm x thuộc cụm số:\", cum)"
  }
 ],
 "C12-18": [
  {
   "type": "fill",
   "prompt": "Máy tính không vẽ được đồ hoạ, nên ta dựng **biểu đồ cột bằng kí tự**. Cho doanh thu 4 tháng (triệu đồng) trong danh sách `doanh_thu`. Hãy điền vào chỗ `___` để mỗi tháng in ra một hàng gồm số dấu `#` đúng bằng doanh thu tháng đó. Kết quả cần in ra:\n```\nTháng 1: ###\nTháng 2: #####\nTháng 3: ##\nTháng 4: ######\n```",
   "starter": "doanh_thu = [3, 5, 2, 6]\nfor i in range(len(doanh_thu)):\n    print('Tháng ' + str(i + 1) + ': ' + '#' * ___)",
   "expected": "Tháng 1: ###\nTháng 2: #####\nTháng 3: ##\nTháng 4: ######",
   "hint": "Số lượng dấu `#` của tháng thứ i chính là `doanh_thu[i]`; toán tử `*` dùng để lặp lại chuỗi.",
   "solution": "doanh_thu = [3, 5, 2, 6]\nfor i in range(len(doanh_thu)):\n    print('Tháng ' + str(i + 1) + ': ' + '#' * doanh_thu[i])"
  },
  {
   "type": "code",
   "prompt": "Bảng `doanh_thu` ghi doanh thu 5 tháng (triệu đồng). Hãy viết chương trình tìm **tháng có doanh thu cao nhất** rồi in ra đúng hai dòng:\n```\nTháng cao nhất: tháng 4\nDoanh thu: 200 triệu\n```\nGợi ý: dùng `max()` để lấy giá trị lớn nhất, rồi duyệt để tìm tháng tương ứng.",
   "starter": "# Dữ liệu doanh thu 5 tháng (triệu đồng)\ndoanh_thu = [120, 150, 90, 200, 170]\n# Dùng max() lấy giá trị lớn nhất, rồi dò vị trí tháng\n",
   "expected": "Tháng cao nhất: tháng 4\nDoanh thu: 200 triệu",
   "hint": "Sau khi có `cao_nhat = max(doanh_thu)`, duyệt `range(len(doanh_thu))`; khi `doanh_thu[i] == cao_nhat` thì tháng là `i + 1`.",
   "solution": "doanh_thu = [120, 150, 90, 200, 170]\ncao_nhat = max(doanh_thu)\nthang = 0\nfor i in range(len(doanh_thu)):\n    if doanh_thu[i] == cao_nhat:\n        thang = i + 1\nprint('Tháng cao nhất: tháng ' + str(thang))\nprint('Doanh thu: ' + str(cao_nhat) + ' triệu')"
  },
  {
   "type": "code",
   "prompt": "🐞 **TÌM & SỬA LỖI**\nMột khảo sát môn thể thao yêu thích cho kết quả trong `so_lieu`. Chương trình muốn in **tỉ lệ phần trăm** mỗi môn dưới dạng **số nguyên**:\n```\nBóng đá: 50%\nCầu lông: 30%\nBơi: 20%\n```\nNhưng khi chạy lại ra `50.0%`, `30.0%`... vì dùng **sai phép chia**. Hãy sửa để tỉ lệ in ra là số nguyên.",
   "starter": "so_lieu = [25, 15, 10]\nten = ['Bóng đá', 'Cầu lông', 'Bơi']\ntong = sum(so_lieu)\nfor i in range(len(so_lieu)):\n    ti_le = so_lieu[i] * 100 / tong\n    print(ten[i] + ': ' + str(ti_le) + '%')",
   "expected": "Bóng đá: 50%\nCầu lông: 30%\nBơi: 20%",
   "hint": "Phép `/` luôn cho số thực (50.0); muốn ra số nguyên khi chia hết, hãy dùng phép chia lấy phần nguyên `//`.",
   "solution": "so_lieu = [25, 15, 10]\nten = ['Bóng đá', 'Cầu lông', 'Bơi']\ntong = sum(so_lieu)\nfor i in range(len(so_lieu)):\n    ti_le = so_lieu[i] * 100 // tong\n    print(ten[i] + ': ' + str(ti_le) + '%')"
  }
 ],
 "C12-29": [
  {
   "type": "fill",
   "prompt": "Danh sách `diem` là điểm kiểm tra của 5 bạn. Hãy điền hai hàm còn thiếu để tính **điểm trung bình cộng** (tổng chia cho số phần tử). Chương trình cần in ra:\n```\nĐiểm trung bình: 8.0\n```\nLưu ý: phép chia `/` trong Python cho ra số thực nên kết quả là `8.0` chứ không phải `8`.",
   "starter": "diem = [7, 8, 9, 6, 10]\ntong = ___(diem)\ntrung_binh = tong / ___(diem)\nprint('Điểm trung bình:', trung_binh)",
   "expected": "Điểm trung bình: 8.0",
   "hint": "`sum(diem)` cho tổng các phần tử, còn `len(diem)` cho số phần tử của danh sách.",
   "solution": "diem = [7, 8, 9, 6, 10]\ntong = sum(diem)\ntrung_binh = tong / len(diem)\nprint('Điểm trung bình:', trung_binh)"
  },
  {
   "type": "code",
   "prompt": "Bảng `diem` ghi điểm của 7 bạn. Hãy viết chương trình **đếm số bạn giỏi** (điểm từ 8 trở lên), rồi in điểm **cao nhất** và **thấp nhất**. Kết quả in ra đúng ba dòng:\n```\nSố bạn giỏi: 4\nCao nhất: 10\nThấp nhất: 5\n```",
   "starter": "# Bảng điểm của 7 bạn\ndiem = [5, 8, 9, 6, 10, 7, 8]\n# Đếm số bạn có điểm >= 8, rồi dùng max() và min()\ngioi = 0\n",
   "expected": "Số bạn giỏi: 4\nCao nhất: 10\nThấp nhất: 5",
   "hint": "Dùng một vòng lặp cộng dồn `gioi` mỗi khi gặp `d >= 8`; `max(diem)` và `min(diem)` cho giá trị lớn nhất, nhỏ nhất.",
   "solution": "diem = [5, 8, 9, 6, 10, 7, 8]\ngioi = 0\nfor d in diem:\n    if d >= 8:\n        gioi = gioi + 1\nprint('Số bạn giỏi:', gioi)\nprint('Cao nhất:', max(diem))\nprint('Thấp nhất:', min(diem))"
  },
  {
   "type": "code",
   "prompt": "Danh sách `thu_nhap` (triệu đồng) của 5 hộ có một giá trị **đột biến** rất lớn. Hãy tính **trung bình cộng** và **trung vị** (phần tử ở giữa sau khi **sắp xếp**) để so sánh. Kết quả in ra:\n```\nTrung bình: 20.0\nTrung vị: 8\n```\nQua đó thấy vì sao khi có giá trị đột biến, **trung vị** phản ánh trung thực hơn trung bình.",
   "starter": "# Thu nhập 5 hộ (triệu đồng), có 1 giá trị đột biến\nthu_nhap = [6, 7, 8, 9, 70]\n# Sắp xếp bằng sorted(), trung vị là phần tử ở giữa\n",
   "expected": "Trung bình: 20.0\nTrung vị: 8",
   "hint": "`sorted(thu_nhap)` cho danh sách đã sắp xếp; danh sách có 5 phần tử nên trung vị nằm ở chỉ số `5 // 2 = 2`.",
   "solution": "thu_nhap = [6, 7, 8, 9, 70]\nsx = sorted(thu_nhap)\ntrung_binh = sum(thu_nhap) / len(thu_nhap)\ntrung_vi = sx[len(sx) // 2]\nprint('Trung bình:', trung_binh)\nprint('Trung vị:', trung_vi)"
  }
 ],
 "C12-19": [
  {
   "type": "fill",
   "prompt": "**Mô phỏng lây bệnh.** Ngày đầu có **1 ca**. Mỗi người bệnh lây cho 2 người khác nên tổng số ca **gấp 3 lần** mỗi ngày. Điền phép toán còn thiếu để in số ca sau mỗi ngày trong **5 ngày**:\n```\n3\n9\n27\n81\n243\n```",
   "starter": "so_ca = 1\nfor ngay in range(5):\n    so_ca = so_ca ___ 3\n    print(so_ca)",
   "expected": "3\n9\n27\n81\n243",
   "hint": "Gấp 3 lần nghĩa là phép nhân; dùng dấu `*`.",
   "solution": "so_ca = 1\nfor ngay in range(5):\n    so_ca = so_ca * 3\n    print(so_ca)"
  },
  {
   "type": "code",
   "prompt": "**Mô phỏng bùng phát dịch.** Bắt đầu có **5 ca**, mỗi ngày số ca **gấp đôi**. Viết chương trình dùng vòng lặp `while` để đếm xem sau **bao nhiêu ngày** thì số ca **vượt quá 100**, rồi in số ngày và số ca lúc đó. Kết quả cần in ra:\n```\nSố ngày: 5\nSố ca: 160\n```",
   "starter": "# Bắt đầu 5 ca, mỗi ngày số ca gấp đôi\n# Dùng while đếm số ngày để số ca vượt quá 100\nso_ca = 5\nngay = 0\n",
   "expected": "Số ngày: 5\nSố ca: 160",
   "hint": "Trong `while so_ca <= 100:` mỗi vòng nhân đôi số ca và cộng 1 vào biến đếm ngày.",
   "solution": "so_ca = 5\nngay = 0\nwhile so_ca <= 100:\n    so_ca = so_ca * 2\n    ngay = ngay + 1\nprint('Số ngày:', ngay)\nprint('Số ca:', so_ca)"
  },
  {
   "type": "code",
   "prompt": "**Ghi lại quá trình mô phỏng.** Một mẫu vi khuẩn bắt đầu là **1**, mỗi bước **nhân đôi**. Hãy ghi số lượng ở đầu mỗi bước vào danh sách `lich_su` trong **6 bước** rồi in cả danh sách. Kết quả cần in ra:\n```\n[1, 2, 4, 8, 16, 32]\n```",
   "starter": "# Ghi lại số lượng mỗi bước vào danh sách lich_su rồi in danh sách\nso_luong = 1\nlich_su = []\n",
   "expected": "[1, 2, 4, 8, 16, 32]",
   "hint": "Dùng `lich_su.append(so_luong)` trước khi nhân đôi; lặp bằng `range(6)`.",
   "solution": "so_luong = 1\nlich_su = []\nfor buoc in range(6):\n    lich_su.append(so_luong)\n    so_luong = so_luong * 2\nprint(lich_su)"
  }
 ],
 "C12-28": [
  {
   "type": "fill",
   "prompt": "**Làm sạch dữ liệu điểm.** Điểm hợp lệ phải nằm trong khoảng **từ 0 đến 10**. Điền phép so sánh còn thiếu để **lọc bỏ** các giá trị bất thường, chỉ giữ lại điểm hợp lệ rồi in danh sách. Kết quả cần in ra:\n```\n[8, 7, 10, 5, 9]\n```",
   "starter": "diem = [8, 12, 7, -3, 10, 5, 15, 9]\nhop_le = []\nfor d in diem:\n    if d >= 0 and d ___ 10:\n        hop_le.append(d)\nprint(hop_le)",
   "expected": "[8, 7, 10, 5, 9]",
   "hint": "Điểm nhỏ hơn hoặc bằng 10 thì dùng phép so sánh `<=`.",
   "solution": "diem = [8, 12, 7, -3, 10, 5, 15, 9]\nhop_le = []\nfor d in diem:\n    if d >= 0 and d <= 10:\n        hop_le.append(d)\nprint(hop_le)"
  },
  {
   "type": "code",
   "prompt": "**Loại bỏ bản ghi trùng.** Danh sách mã học sinh bị lặp lại. Viết chương trình **loại bỏ các mã trùng nhau, giữ nguyên thứ tự** xuất hiện lần đầu, rồi in danh sách kết quả. Kết quả cần in ra:\n```\n[3, 5, 7, 9, 1]\n```",
   "starter": "# Loại bỏ mã trùng, giữ nguyên thứ tự xuất hiện đầu tiên\nma = [3, 5, 3, 7, 5, 9, 7, 1]\nket_qua = []\n",
   "expected": "[3, 5, 7, 9, 1]",
   "hint": "Duyệt từng phần tử, chỉ `append` khi nó **chưa có** trong danh sách kết quả (`not in`).",
   "solution": "ma = [3, 5, 3, 7, 5, 9, 7, 1]\nket_qua = []\nfor x in ma:\n    if x not in ket_qua:\n        ket_qua.append(x)\nprint(ket_qua)"
  },
  {
   "type": "code",
   "prompt": "**Đọc một dòng CSV và tìm giá trị thiếu.** Trong dòng dữ liệu, các giá trị cách nhau bởi dấu phẩy; **ô rỗng** là giá trị bị thiếu. Hãy tách dòng bằng `.split(',')`, đếm tổng số ô và số ô bị thiếu. Kết quả cần in ra:\n```\nTổng số: 6\nSố thiếu: 2\n```",
   "starter": "# Một dòng CSV, các giá trị cách nhau bởi dấu phẩy; ô rỗng là giá trị thiếu\ndong = '8,,7,10,,5'\n# Tách bằng .split(',') rồi đếm ô rỗng\n",
   "expected": "Tổng số: 6\nSố thiếu: 2",
   "hint": "Sau khi `.split(',')`, một ô thiếu là chuỗi rỗng `''`; đếm bằng vòng lặp.",
   "solution": "dong = '8,,7,10,,5'\ngia_tri = dong.split(',')\nthieu = 0\nfor g in gia_tri:\n    if g == '':\n        thieu = thieu + 1\nprint('Tổng số:', len(gia_tri))\nprint('Số thiếu:', thieu)"
  }
 ],
 "C12-30": [
  {
   "type": "fill",
   "prompt": "**Bên trong mô hình lan tin.** Mô hình có các **tham số**: bắt đầu **5 bạn** biết tin, mỗi ngày số người biết **nhân với hệ số 3**, chạy trong **4 ngày**. Điền chỗ trống để áp dụng đúng **quy tắc** rồi in số người biết tin sau 4 ngày. Kết quả cần in ra:\n```\n405\n```",
   "starter": "bat_dau = 5\nhe_so = 3\nso_ngay = 4\nso_biet = bat_dau\nfor ngay in range(so_ngay):\n    so_biet = so_biet * ___\nprint(so_biet)",
   "expected": "405",
   "hint": "Quy tắc mỗi ngày là nhân số người biết với `he_so`.",
   "solution": "bat_dau = 5\nhe_so = 3\nso_ngay = 4\nso_biet = bat_dau\nfor ngay in range(so_ngay):\n    so_biet = so_biet * he_so\nprint(so_biet)"
  },
  {
   "type": "code",
   "prompt": "**Phép thử 'nếu...thì'.** Vẫn mô hình lan tin (bắt đầu **5**, chạy **3 ngày**), hãy chạy **hai kịch bản**: hệ số **2** và hệ số **3**, rồi in cả hai kết quả để so sánh. Kết quả cần in ra:\n```\nHệ số 2: 40\nHệ số 3: 135\n```",
   "starter": "# Cùng mô hình lan tin (bắt đầu 5, chạy 3 ngày), thử hai hệ số khác nhau\n# Kịch bản 1: hệ số 2 ; Kịch bản 2: hệ số 3\n",
   "expected": "Hệ số 2: 40\nHệ số 3: 135",
   "hint": "Lặp lại đúng đoạn mô phỏng hai lần, chỉ thay hệ số từ 2 thành 3.",
   "solution": "so_biet = 5\nfor ngay in range(3):\n    so_biet = so_biet * 2\nprint('Hệ số 2:', so_biet)\nso_biet = 5\nfor ngay in range(3):\n    so_biet = so_biet * 3\nprint('Hệ số 3:', so_biet)"
  },
  {
   "type": "code",
   "prompt": "**Hàm mô hình với tham số.** Viết hàm `dan_so(ty_le)` mô phỏng dân số ban đầu **100**, mỗi năm tăng thêm `ty_le` phần trăm (dùng `//` để lấy phần nguyên), trong **3 năm**, trả về **danh sách** dân số từng năm. Gọi hàm với hai kịch bản **10** và **20**. Kết quả cần in ra:\n```\nTăng 10%: [110, 121, 133]\nTăng 20%: [120, 144, 172]\n```",
   "starter": "# Viết hàm dan_so(ty_le): dân số bắt đầu 100, tăng ty_le %/năm trong 3 năm\n# Trả về danh sách dân số từng năm, rồi gọi với 10 và 20\n",
   "expected": "Tăng 10%: [110, 121, 133]\nTăng 20%: [120, 144, 172]",
   "hint": "Trong hàm, mỗi năm `ds = ds + ds * ty_le // 100` rồi `append` vào danh sách, cuối cùng `return`.",
   "solution": "def dan_so(ty_le):\n    ds = 100\n    ket_qua = []\n    for nam in range(3):\n        ds = ds + ds * ty_le // 100\n        ket_qua.append(ds)\n    return ket_qua\n\nprint('Tăng 10%:', dan_so(10))\nprint('Tăng 20%:', dan_so(20))"
  }
 ]
};
  Object.keys(ADD).forEach(function (k) { EXERCISES[k] = (EXERCISES[k] || []).concat(ADD[k]); });
})();
