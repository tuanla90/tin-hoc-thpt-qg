/* ============================================================================
 *  ĐỐI CHIẾU BÀI CỦA ỨNG DỤNG VỚI SÁCH GIÁO KHOA
 *
 *  Vì sao cần: học sinh học theo sách nào thì tìm theo sách đó ("tin học 12
 *  bài 16 kết nối tri thức"). Nội dung app là tự biên soạn và ĐÃ SẮP LẠI THỨ
 *  TỰ cho dễ học, nên số bài KHÔNG trùng số bài SGK — bảng này để bắc cầu.
 *
 *  CẤU TRÚC: bo[] -> sach[] -> bai[]. Chương trình GDPT 2018 cho lớp 10 học
 *  chung, lớp 11 và 12 tách hai định hướng (Khoa học máy tính / Tin học ứng
 *  dụng) nên MỘT BỘ CÓ TỚI 5 QUYỂN. Thêm bộ hoặc thêm quyển chỉ là thêm phần
 *  tử vào mảng — trang /doi-chieu-sgk tự sinh thêm mục và thêm trang riêng.
 *
 *  MỘT bài SGK trỏ tới ĐÚNG MỘT bài của app; ngược lại một bài của app có thể
 *  gộp nhiều bài SGK.
 *
 *  LƯU Ý KHI ĐỌC: bài nào của app không xuất hiện ở đây thì KHÔNG có nghĩa là
 *  "ngoài chương trình" — phần lớn là nửa sau của một bài SGK bị tách đôi cho
 *  dễ học. Giao diện vì thế chỉ hiện đối chiếu khi CÓ, không gắn nhãn phủ định.
 *
 *  CÒN THIẾU (xem SACH-CAN-TIM.md): nhánh Tin học ứng dụng, và hai bộ Cánh
 *  Diều / Chân trời sáng tạo cho lớp 10, 11.
 * ==========================================================================*/
var SGK_MAP = {
  bo: [
    {
      ma: "kntt",
      ten: "Kết nối tri thức với cuộc sống",
      tenNgan: "Kết nối tri thức",
      sach: [
        {
          ma: "tin-hoc-10", ten: "Tin học 10", lop: 10, huong: "chung", tenHuong: "",
          bai: [
            {"so":1,"ten":"Thông tin và xử lí thông tin","trang":"6–10","cua":"C10-01"},
            {"so":2,"ten":"Vai trò của thiết bị thông minh và tin học đối với xã hội","trang":"11–15","cua":"C10-03"},
            {"so":3,"ten":"Một số kiểu dữ liệu và dữ liệu văn bản","trang":"16–19","cua":"C10-22"},
            {"so":4,"ten":"Hệ nhị phân và dữ liệu số nguyên","trang":"20–23","cua":"C10-23"},
            {"so":5,"ten":"Dữ liệu lôgic","trang":"24–27","cua":"C10-24"},
            {"so":6,"ten":"Dữ liệu âm thanh và hình ảnh","trang":"28–32","cua":"C10-25"},
            {"so":7,"ten":"Thực hành sử dụng thiết bị số thông dụng","trang":"33–37","cua":"C10-03"},
            {"so":8,"ten":"Mạng máy tính trong cuộc sống hiện đại","trang":"38–43","cua":"C10-04"},
            {"so":9,"ten":"An toàn trên không gian mạng","trang":"44–49","cua":"C10-07"},
            {"so":10,"ten":"Thực hành khai thác tài nguyên trên Internet","trang":"50–54","cua":"C10-05"},
            {"so":11,"ten":"Ứng xử trên môi trường số. Nghĩa vụ tôn trọng bản quyền","trang":"55–62","cua":"C10-08"},
            {"so":12,"ten":"Phần mềm thiết kế đồ hoạ","trang":"63–68","cua":"C10-09"},
            {"so":13,"ten":"Bổ sung các đối tượng đồ hoạ","trang":"69–74","cua":"C10-10"},
            {"so":14,"ten":"Làm việc với đối tượng đường và văn bản","trang":"75–81","cua":"C10-28"},
            {"so":15,"ten":"Hoàn thiện hình ảnh đồ hoạ","trang":"82–85","cua":"C10-28"},
            {"so":16,"ten":"Ngôn ngữ lập trình bậc cao và Python","trang":"86–90","cua":"C10-29"},
            {"so":17,"ten":"Biến và lệnh gán","trang":"91–96","cua":"C10-12"},
            {"so":18,"ten":"Các lệnh vào ra đơn giản","trang":"97–100","cua":"C10-13"},
            {"so":19,"ten":"Câu lệnh rẽ nhánh If","trang":"101–104","cua":"C10-14"},
            {"so":20,"ten":"Câu lệnh lặp for","trang":"105–107","cua":"C10-15"},
            {"so":21,"ten":"Câu lệnh lặp While","trang":"108–110","cua":"C10-16"},
            {"so":22,"ten":"Kiểu dữ liệu danh sách","trang":"111–114","cua":"C10-17"},
            {"so":23,"ten":"Một số lệnh làm việc với dữ liệu danh sách","trang":"115–118","cua":"C10-31"},
            {"so":24,"ten":"Xâu kí tự","trang":"119–122","cua":"C10-18"},
            {"so":25,"ten":"Một số lệnh làm việc với xâu kí tự","trang":"123–126","cua":"C10-32"},
            {"so":26,"ten":"Hàm trong Python","trang":"127–130","cua":"C10-19"},
            {"so":27,"ten":"Tham số của hàm","trang":"131–135","cua":"C10-33"},
            {"so":28,"ten":"Phạm vi của biến","trang":"136–140","cua":"C10-34"},
            {"so":29,"ten":"Nhận biết lỗi chương trình","trang":"141–144","cua":"C10-20"},
            {"so":30,"ten":"Kiểm thử và gỡ lỗi chương trình","trang":"145–148","cua":"C10-20"},
            {"so":31,"ten":"Thực hành viết chương trình đơn giản","trang":"149–152","cua":"C10-30"},
            {"so":32,"ten":"Ôn tập lập trình Python","trang":"153–155","cua":"C10-11"},
            {"so":33,"ten":"Nghề thiết kế đồ hoạ máy tính","trang":"156–159","cua":"C10-21"},
            {"so":34,"ten":"Nghề phát triển phần mềm","trang":"160–164","cua":"C10-21"},
          ],
        },
        {
          ma: "tin-hoc-11-khmt", ten: "Tin học 11", lop: 11, huong: "khmt", tenHuong: "Khoa học máy tính",
          bai: [
            {"so":1,"ten":"Hệ điều hành","trang":"5–9","cua":"C11-01"},
            {"so":2,"ten":"Thực hành sử dụng hệ điều hành","trang":"10–14","cua":"C11-21"},
            {"so":3,"ten":"Phần mềm nguồn mở và phần mềm chạy trên Internet","trang":"15–20","cua":"C11-02"},
            {"so":4,"ten":"Bên trong máy tính","trang":"21–26","cua":"C11-03"},
            {"so":5,"ten":"Kết nối máy tính với các thiết bị số","trang":"27–31","cua":"C11-22"},
            {"so":6,"ten":"Lưu trữ và chia sẻ tệp tin trên Internet","trang":"32–35","cua":"C11-24"},
            {"so":7,"ten":"Thực hành tìm kiếm thông tin trên Internet","trang":"36–38","cua":"C11-05"},
            {"so":8,"ten":"Thực hành nâng cao sử dụng thư điện tử và mạng xã hội","trang":"39–42","cua":"C11-23"},
            {"so":9,"ten":"Giao tiếp an toàn trên Internet","trang":"43–48","cua":"C11-25"},
            {"so":10,"ten":"Lưu trữ dữ liệu và khai thác thông tin phục vụ quản lí","trang":"49–52","cua":"C11-26"},
            {"so":11,"ten":"Cơ sở dữ liệu","trang":"53–57","cua":"C11-06"},
            {"so":12,"ten":"Hệ quản trị cơ sở dữ liệu và hệ cơ sở dữ liệu","trang":"58–63","cua":"C11-08"},
            {"so":13,"ten":"Cơ sở dữ liệu quan hệ","trang":"64–68","cua":"C11-07"},
            {"so":14,"ten":"SQL - ngôn ngữ truy vấn có cấu trúc","trang":"69–72","cua":"C11-09"},
            {"so":15,"ten":"Bảo mật và an toàn hệ cơ sở dữ liệu","trang":"73–76","cua":"C11-11"},
            {"so":16,"ten":"Công việc quản trị cơ sở dữ liệu","trang":"77–80","cua":"C11-20"},
            {"so":17,"ten":"Dữ liệu mảng một chiều và hai chiều","trang":"81–85","cua":"C11-12"},
            {"so":18,"ten":"Thực hành dữ liệu mảng một chiều và hai chiều","trang":"86–88","cua":"C11-28"},
            {"so":19,"ten":"Bài toán tìm kiếm","trang":"89–93","cua":"C11-13"},
            {"so":20,"ten":"Thực hành bài toán tìm kiếm","trang":"94–98","cua":"C11-14"},
            {"so":21,"ten":"Các thuật toán sắp xếp đơn giản","trang":"99–103","cua":"C11-15"},
            {"so":22,"ten":"Thực hành bài toán sắp xếp","trang":"104–105","cua":"C11-29"},
            {"so":23,"ten":"Kiểm thử và đánh giá chương trình","trang":"106–110","cua":"C11-18"},
            {"so":24,"ten":"Đánh giá độ phức tạp thời gian thuật toán","trang":"111–114","cua":"C11-16"},
            {"so":25,"ten":"Thực hành xác định độ phức tạp thời gian thuật toán","trang":"115–117","cua":"C11-16"},
            {"so":26,"ten":"Phương pháp làm mịn dần trong thiết kế chương trình","trang":"118–122","cua":"C11-17"},
            {"so":27,"ten":"Thực hành thiết kế chương trình theo phương pháp làm mịn dần","trang":"123–126","cua":"C11-17"},
            {"so":28,"ten":"Thiết kế chương trình theo mô đun","trang":"127–131","cua":"C11-30"},
            {"so":29,"ten":"Thực hành thiết kế chương trình theo mô đun","trang":"132–136","cua":"C11-30"},
            {"so":30,"ten":"Thiết lập thư viện cho chương trình","trang":"137–142","cua":"C11-31"},
            {"so":31,"ten":"Thực hành thiết lập thư viện chương trình","trang":"143–145","cua":"C11-31"},
          ],
        },
        {
          ma: "tin-hoc-12-khmt", ten: "Tin học 12", lop: 12, huong: "khmt", tenHuong: "Khoa học máy tính",
          bai: [
            {"so":1,"ten":"Làm quen với Trí tuệ nhân tạo","trang":"5–8","cua":"C12-01"},
            {"so":2,"ten":"Trí tuệ nhân tạo trong khoa học và đời sống","trang":"9–13","cua":"C12-02"},
            {"so":3,"ten":"Một số thiết bị mạng thông dụng","trang":"14–20","cua":"C12-04"},
            {"so":4,"ten":"Giao thức mạng","trang":"21–25","cua":"C12-21"},
            {"so":5,"ten":"Thực hành chia sẻ tài nguyên trên mạng","trang":"26–33","cua":"C12-22"},
            {"so":6,"ten":"Giao tiếp và ứng xử trong không gian mạng","trang":"34–38","cua":"C12-06"},
            {"so":7,"ten":"HTML và cấu trúc trang web","trang":"39–45","cua":"C12-07"},
            {"so":8,"ten":"Định dạng văn bản","trang":"46–51","cua":"C12-08"},
            {"so":9,"ten":"Tạo danh sách, bảng","trang":"52–56","cua":"C12-09"},
            {"so":10,"ten":"Tạo liên kết","trang":"57–61","cua":"C12-08"},
            {"so":11,"ten":"Chèn tệp tin đa phương tiện và khung nội tuyến vào trang web","trang":"62–66","cua":"C12-23"},
            {"so":12,"ten":"Tạo biểu mẫu","trang":"67–70","cua":"C12-24"},
            {"so":13,"ten":"Khái niệm, vai trò của CSS","trang":"71–75","cua":"C12-10"},
            {"so":14,"ten":"Định dạng văn bản bằng CSS","trang":"76–82","cua":"C12-11"},
            {"so":15,"ten":"Tạo màu cho chữ và nền","trang":"83–88","cua":"C12-11"},
            {"so":16,"ten":"Định dạng khung","trang":"89–95","cua":"C12-26"},
            {"so":17,"ten":"Các mức ưu tiên của bộ chọn","trang":"96–101","cua":"C12-25"},
            {"so":18,"ten":"Thực hành tổng hợp thiết kế trang web","trang":"102–105","cua":"C12-13"},
            {"so":19,"ten":"Dịch vụ sửa chữa và bảo trì máy tính","trang":"106–109","cua":"C12-14"},
            {"so":20,"ten":"Nhóm nghề quản trị thuộc ngành Công nghệ thông tin","trang":"110–112","cua":"C12-14"},
            {"so":21,"ten":"Hội thảo hướng nghiệp","trang":"113–117","cua":"C12-14"},
            {"so":22,"ten":"Tìm hiểu thiết bị mạng","trang":"118–122","cua":"C12-03"},
            {"so":23,"ten":"Đường truyền mạng và ứng dụng","trang":"123–127","cua":"C12-04"},
            {"so":24,"ten":"Sơ bộ về thiết kế mạng","trang":"128–133","cua":"C12-05"},
            {"so":25,"ten":"Làm quen với Học máy","trang":"134–139","cua":"C12-15"},
            {"so":26,"ten":"Làm quen với Khoa học dữ liệu","trang":"140–144","cua":"C12-17"},
            {"so":27,"ten":"Máy tính và Khoa học dữ liệu","trang":"145–148","cua":"C12-28"},
            {"so":28,"ten":"Thực hành trải nghiệm trích rút thông tin và tri thức","trang":"149–154","cua":"C12-29"},
            {"so":29,"ten":"Mô phỏng trong giải quyết vấn đề","trang":"155–158","cua":"C12-19"},
            {"so":30,"ten":"Ứng dụng mô phỏng trong giáo dục","trang":"159–163","cua":"C12-30"},
          ],
        },
      ],
    },
  ],
};
if (typeof window !== "undefined") window.SGK_MAP = SGK_MAP;
