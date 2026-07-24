/* ============================================================================
 *  ON TAP TUONG TAC cho 37 bai LI THUYET ban sach chua co thuc hanh.
 *  Widget match (noi cap) + order (sap thu tu). Tai dung renderer cua
 *  graphics-lab.js qua window.renderConceptWidget. Nap SAU graphics-lab.js.
 *  order da duoc XAO san (items+targetOrder) de khong tu-dung khi mo bai.
 * ==========================================================================*/
(function () {
  if (typeof window === "undefined") return;
  var CLAB = {
 "C10-01": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm** với mô tả đúng.",
   "pairs": [
    {
     "l": "Dữ liệu",
     "r": "Con số, chữ, hình ảnh... còn ở dạng thô"
    },
    {
     "l": "Thông tin",
     "r": "Ý nghĩa con người hiểu được từ dữ liệu"
    },
    {
     "l": "Ba bước Vào - Xử lí - Ra",
     "r": "Cách máy tính xử lí thông tin"
    },
    {
     "l": "Ưu điểm thiết bị số",
     "r": "Nhớ nhiều, tính nhanh, sao chép và gửi đi chính xác"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp xếp **đơn vị đo dữ liệu** từ nhỏ đến lớn.",
   "items": [
    {
     "label": "byte"
    },
    {
     "label": "KB"
    },
    {
     "label": "MB"
    },
    {
     "label": "GB"
    },
    {
     "label": "bit"
    }
   ],
   "targetOrder": [
    4,
    0,
    1,
    2,
    3
   ]
  }
 ],
 "C10-02": [
  {
   "type": "match",
   "prompt": "Nối mỗi **cách mã hoá dữ liệu** với mô tả đúng.",
   "pairs": [
    {
     "l": "Hệ nhị phân",
     "r": "Chỉ dùng hai chữ số 0 và 1"
    },
    {
     "l": "Bảng ASCII",
     "r": "Mã hoá chữ cái tiếng Anh"
    },
    {
     "l": "Bảng Unicode",
     "r": "Mã hoá mọi ngôn ngữ, kể cả tiếng Việt có dấu"
    },
    {
     "l": "Pixel",
     "r": "Điểm ảnh mang số màu trong lưới ảnh"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp **giá trị các vị trí trong số nhị phân** theo thứ tự tăng dần (mỗi bậc gấp đôi).",
   "items": [
    {
     "label": "2"
    },
    {
     "label": "4"
    },
    {
     "label": "8"
    },
    {
     "label": "16"
    },
    {
     "label": "1"
    }
   ],
   "targetOrder": [
    4,
    0,
    1,
    2,
    3
   ]
  }
 ],
 "C10-03": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm về thiết bị số thông minh** với mô tả đúng.",
   "pairs": [
    {
     "l": "Dấu hiệu 1 của thiết bị thông minh",
     "r": "Tự làm được việc nhờ phần mềm"
    },
    {
     "l": "Dấu hiệu 2 của thiết bị thông minh",
     "r": "Biết kết nối, trao đổi dữ liệu với thiết bị khác"
    },
    {
     "l": "IoT (Internet vạn vật)",
     "r": "Mạng lưới đồ vật trong nhà cùng nối mạng"
    },
    {
     "l": "Ví dụ thiết bị IoT",
     "r": "Đèn, tủ lạnh, khoá cửa điều khiển từ xa"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **thói quen dùng thiết bị số** với ý nghĩa đúng.",
   "pairs": [
    {
     "l": "Vai trò của tin học",
     "r": "Hiện diện trong học tập, mua sắm, đi lại, giải trí"
    },
    {
     "l": "Tránh lệ thuộc",
     "r": "Không phụ thuộc quá mức vào thiết bị số"
    },
    {
     "l": "Cảnh giác tin giả",
     "r": "Không vội tin thông tin chưa kiểm chứng"
    },
    {
     "l": "Giữ riêng tư",
     "r": "Bảo vệ, không để lộ thông tin cá nhân"
    }
   ]
  }
 ],
 "C10-04": [
  {
   "type": "match",
   "prompt": "Nối mỗi **lợi ích của mạng máy tính** với mô tả đúng.",
   "pairs": [
    {
     "l": "Chia sẻ tệp",
     "r": "Nhiều máy cùng dùng chung một tập tin"
    },
    {
     "l": "Dùng chung máy in",
     "r": "Cả nhóm in qua một máy in duy nhất"
    },
    {
     "l": "Kết nối Internet",
     "r": "Cùng truy cập mạng toàn cầu"
    },
    {
     "l": "Liên lạc từ xa",
     "r": "Trao đổi với người ở nơi khác"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp xếp các loại mạng theo **phạm vi từ hẹp đến rộng**.",
   "items": [
    {
     "label": "WAN - phạm vi rộng"
    },
    {
     "label": "Internet - mạng WAN lớn nhất"
    },
    {
     "label": "LAN - phạm vi hẹp"
    }
   ],
   "targetOrder": [
    2,
    0,
    1
   ]
  }
 ],
 "C10-05": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm về Internet và Web** với mô tả đúng.",
   "pairs": [
    {
     "l": "Internet",
     "r": "Mạng của các mạng, kết nối thiết bị toàn cầu"
    },
    {
     "l": "World Wide Web",
     "r": "Một dịch vụ trên Internet gồm các trang web liên kết"
    },
    {
     "l": "Email, gọi video, nhắn tin",
     "r": "Dịch vụ Internet khác, tách biệt với Web"
    },
    {
     "l": "Siêu liên kết",
     "r": "Điểm bấm để nhảy sang trang khác"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **công cụ, kĩ năng dùng Web** với mô tả đúng.",
   "pairs": [
    {
     "l": "Trình duyệt",
     "r": "Phần mềm để mở và xem trang web"
    },
    {
     "l": "URL",
     "r": "Địa chỉ riêng của từng trang web"
    },
    {
     "l": "Từ khoá tốt",
     "r": "Ngắn gọn, đúng trọng tâm cần tìm"
    },
    {
     "l": "Đối chiếu nhiều nguồn",
     "r": "So sánh thông tin để tránh tin sai lệch"
    }
   ]
  }
 ],
 "C10-06": [
  {
   "type": "match",
   "prompt": "Nối mỗi **ứng dụng đám mây** quen thuộc với việc nó giúp ta làm.",
   "pairs": [
    {
     "l": "Lưu trữ trực tuyến",
     "r": "Cất ảnh, tài liệu trên máy chủ ở xa"
    },
    {
     "l": "Hộp thư điện tử",
     "r": "Nhận và gửi thư qua dịch vụ trên mạng"
    },
    {
     "l": "Soạn thảo online",
     "r": "Viết văn bản, bảng tính ngay trên trình duyệt"
    },
    {
     "l": "Đồng bộ dữ liệu",
     "r": "Giữ dữ liệu giống nhau trên nhiều thiết bị"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **đặc điểm** của điện toán đám mây với ý nghĩa đúng.",
   "pairs": [
    {
     "l": "Không lo mất dữ liệu",
     "r": "Dữ liệu vẫn còn trên máy chủ dù máy hỏng"
    },
    {
     "l": "Dùng chung nhiều thiết bị",
     "r": "Mở cùng dữ liệu trên điện thoại lẫn máy tính"
    },
    {
     "l": "Phụ thuộc Internet",
     "r": "Mất mạng thì không truy cập được dữ liệu"
    },
    {
     "l": "Rủi ro quyền riêng tư",
     "r": "Phải bảo vệ tài khoản kẻo lộ dữ liệu cá nhân"
    }
   ]
  }
 ],
 "C10-07": [
  {
   "type": "match",
   "prompt": "Nối mỗi **mối nguy** thường gặp với cách phòng tránh phù hợp.",
   "pairs": [
    {
     "l": "Mật khẩu yếu, bị lộ",
     "r": "Đặt mật khẩu mạnh, riêng biệt và bật xác thực hai bước"
    },
    {
     "l": "Phần mềm độc hại",
     "r": "Cập nhật phần mềm và dùng chương trình diệt virus"
    },
    {
     "l": "Lừa đảo giả mạo",
     "r": "Không bấm liên kết lạ, cảnh giác yêu cầu bất thường"
    },
    {
     "l": "Mất dữ liệu do sự cố",
     "r": "Sao lưu dữ liệu định kỳ để có bản dự phòng"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **nguyên tắc** khi gặp một yêu cầu đáng ngờ.",
   "items": [
    {
     "label": "Không vội tin hay làm theo ngay"
    },
    {
     "label": "Xác minh lại qua kênh chính thống"
    },
    {
     "label": "Chắc chắn an toàn rồi mới hành động"
    },
    {
     "label": "Cảnh giác, dừng lại trước yêu cầu bất thường"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C10-26": [
  {
   "type": "match",
   "prompt": "Nối mỗi loại **mã độc** với đặc điểm nhận diện đúng.",
   "pairs": [
    {
     "l": "Virus",
     "r": "Bám vào tệp, lây khi tệp được chạy"
    },
    {
     "l": "Worm",
     "r": "Tự nhân bản, lan qua mạng"
    },
    {
     "l": "Trojan",
     "r": "Giả dạng phần mềm hữu ích để dụ cài"
    },
    {
     "l": "Ransomware",
     "r": "Mã hoá dữ liệu rồi đòi tiền chuộc"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự các bước **xử lí khi nghi máy bị nhiễm mã độc**.",
   "items": [
    {
     "label": "Quét bằng phần mềm diệt virus"
    },
    {
     "label": "Đổi mật khẩu từ một thiết bị an toàn khác"
    },
    {
     "label": "Báo người lớn hoặc bộ phận kĩ thuật"
    },
    {
     "label": "Ngắt kết nối mạng"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C10-08": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm** ứng xử trên mạng với mô tả đúng.",
   "pairs": [
    {
     "l": "Không gian công cộng",
     "r": "Điều đăng lên có người thật thấy, hậu quả thật"
    },
    {
     "l": "Cyberbullying",
     "r": "Công kích, xúc phạm, bắt nạt người khác qua mạng"
    },
    {
     "l": "Tin giả",
     "r": "Thông tin sai, đánh vào cảm xúc để lan nhanh"
    },
    {
     "l": "Bản quyền số",
     "r": "Ảnh, nhạc, bài viết là công sức được bảo vệ"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **tình huống** với cách ứng xử văn minh đúng.",
   "pairs": [
    {
     "l": "Trước khi chia sẻ tin gây sốc",
     "r": "Đối chiếu với nguồn chính thống, đáng tin cậy"
    },
    {
     "l": "Dùng lại ảnh, bài của người khác",
     "r": "Ghi nguồn, xin phép hoặc dùng nội dung có giấy phép"
    },
    {
     "l": "Khi bất đồng với người khác",
     "r": "Không công kích, xúc phạm hay bắt nạt"
    },
    {
     "l": "Đã đăng rồi vội xoá đi",
     "r": "Nội dung vẫn có thể để lại hậu quả thật"
    }
   ]
  }
 ],
 "C10-27": [
  {
   "type": "match",
   "prompt": "Nối mỗi **kí hiệu Creative Commons** với ý nghĩa đúng.",
   "pairs": [
    {
     "l": "BY",
     "r": "Phải ghi tên tác giả"
    },
    {
     "l": "NC",
     "r": "Không dùng cho mục đích thương mại"
    },
    {
     "l": "ND",
     "r": "Không được sửa đổi tác phẩm"
    },
    {
     "l": "SA",
     "r": "Chia sẻ lại theo cùng giấy phép"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **nhóm giấy phép phần mềm** với đặc điểm đúng.",
   "pairs": [
    {
     "l": "Phần mềm thương mại",
     "r": "Phải mua giấy phép mới được dùng"
    },
    {
     "l": "Freeware",
     "r": "Dùng miễn phí nhưng vẫn có bản quyền"
    },
    {
     "l": "Shareware",
     "r": "Dùng thử, hết hạn phải mua"
    },
    {
     "l": "Nguồn mở",
     "r": "Được xem, sửa mã nguồn theo điều khoản giấy phép"
    }
   ]
  }
 ],
 "C10-29": [
  {
   "type": "match",
   "prompt": "Nối **chương trình dịch và ngôn ngữ** với đặc điểm đúng.",
   "pairs": [
    {
     "l": "Trình biên dịch (compiler)",
     "r": "dịch toàn bộ chương trình một lần, sau đó chạy rất nhanh"
    },
    {
     "l": "Trình thông dịch (interpreter)",
     "r": "dịch và chạy lần lượt từng lệnh, báo lỗi đúng dòng"
    },
    {
     "l": "Chương trình dịch",
     "r": "chuyển mã nguồn bậc cao sang ngôn ngữ máy để chạy"
    },
    {
     "l": "Python",
     "r": "ngôn ngữ bậc cao chạy theo cơ chế thông dịch"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp xếp **ba mức ngôn ngữ lập trình** từ thấp (gần máy) đến cao (gần người).",
   "items": [
    {
     "label": "Hợp ngữ (từ gợi nhớ thay dãy bit)"
    },
    {
     "label": "Ngôn ngữ bậc cao (gần tiếng Anh)"
    },
    {
     "label": "Ngôn ngữ máy (chỉ gồm 0 và 1)"
    }
   ],
   "targetOrder": [
    2,
    0,
    1
   ]
  }
 ],
 "C10-21": [
  {
   "type": "match",
   "prompt": "Nối **nhóm nghề tin học** với công việc chính.",
   "pairs": [
    {
     "l": "Quản trị mạng và hệ thống",
     "r": "giữ cho mạng và hệ thống máy tính chạy ổn định"
    },
    {
     "l": "Thiết kế đồ hoạ / web",
     "r": "tạo hình ảnh, giao diện và trang web"
    },
    {
     "l": "Phân tích dữ liệu",
     "r": "tìm thông tin, quy luật có ích từ dữ liệu"
    },
    {
     "l": "An toàn thông tin",
     "r": "bảo vệ hệ thống và dữ liệu khỏi tấn công"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp xếp **con đường phát triển nghề tin học** theo gợi ý trong bài.",
   "items": [
    {
     "label": "Học lên cao hơn hoặc học nghề"
    },
    {
     "label": "Thực hành qua các dự án nhỏ"
    },
    {
     "label": "Học tốt tin học ở phổ thông"
    }
   ],
   "targetOrder": [
    2,
    0,
    1
   ]
  }
 ],
 "C11-01": [
  {
   "type": "match",
   "prompt": "Nối **bốn vai trò chính** của hệ điều hành với mô tả đúng.",
   "pairs": [
    {
     "l": "Quản lí phần cứng",
     "r": "điều khiển, phân phối các thiết bị phần cứng của máy"
    },
    {
     "l": "Quản lí tệp và bộ nhớ",
     "r": "tổ chức lưu trữ tệp và cấp phát bộ nhớ khi máy chạy"
    },
    {
     "l": "Nền tảng cho phần mềm",
     "r": "giúp các phần mềm ứng dụng khác chạy được"
    },
    {
     "l": "Cầu nối với người dùng",
     "r": "nhận lệnh, giúp con người điều khiển máy"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp xếp các **tầng** từ dưới lên: phần cứng ở đáy, người dùng trên cùng.",
   "items": [
    {
     "label": "Hệ điều hành quản lí phần cứng"
    },
    {
     "label": "Phần mềm ứng dụng chạy trên hệ điều hành"
    },
    {
     "label": "Người dùng ra lệnh, sử dụng máy"
    },
    {
     "label": "Phần cứng (CPU, bộ nhớ, thiết bị)"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C11-02": [
  {
   "type": "match",
   "prompt": "Nối mỗi phần mềm với **loại và công dụng** đúng.",
   "pairs": [
    {
     "l": "Hệ điều hành",
     "r": "phần mềm hệ thống làm nền cho máy hoạt động"
    },
    {
     "l": "Trình điều khiển (driver)",
     "r": "phần mềm hệ thống giúp máy nhận ra thiết bị"
    },
    {
     "l": "Soạn thảo văn bản",
     "r": "phần mềm ứng dụng phục vụ công việc"
    },
    {
     "l": "Trò chơi",
     "r": "phần mềm ứng dụng phục vụ giải trí"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối khái niệm về **mã nguồn và bản quyền** phần mềm.",
   "pairs": [
    {
     "l": "Phần mềm",
     "r": "tập hợp câu lệnh viết sẵn chỉ dẫn phần cứng"
    },
    {
     "l": "Phần mềm thương mại",
     "r": "giữ kín mã nguồn, người dùng phải trả tiền"
    },
    {
     "l": "Phần mềm nguồn mở",
     "r": "công khai mã nguồn, phần lớn miễn phí"
    },
    {
     "l": "Bản quyền",
     "r": "loại phần mềm nào cũng có và cần tôn trọng"
    }
   ]
  }
 ],
 "C11-03": [
  {
   "type": "match",
   "prompt": "Nối mỗi **bộ phận máy tính** với vai trò đúng.",
   "pairs": [
    {
     "l": "CPU",
     "r": "thực hiện phép tính và điều khiển toàn bộ máy tính"
    },
    {
     "l": "RAM",
     "r": "lưu dữ liệu tạm thời khi máy chạy, mất điện là mất"
    },
    {
     "l": "Ổ cứng (HDD/SSD)",
     "r": "lưu dữ liệu lâu dài, còn nguyên sau khi tắt máy"
    },
    {
     "l": "Thiết bị vào",
     "r": "đưa dữ liệu và lệnh vào máy tính"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp xếp **luồng dữ liệu** khi máy tính xử lí một công việc.",
   "items": [
    {
     "label": "Dữ liệu được nạp vào RAM"
    },
    {
     "label": "CPU lấy dữ liệu từ RAM để xử lí"
    },
    {
     "label": "Kết quả xuất ra thiết bị ra"
    },
    {
     "label": "Ổ cứng lưu dữ liệu cần xử lí"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C11-21": [
  {
   "type": "match",
   "prompt": "Nối **thành phần hệ thống** với vai trò đúng:",
   "pairs": [
    {
     "l": "Tài khoản quản trị",
     "r": "Được phép thay đổi cả hệ thống máy tính"
    },
    {
     "l": "Tài khoản thường",
     "r": "Nên dùng hằng ngày để hạn chế rủi ro mã độc"
    },
    {
     "l": "Trình quản lí tác vụ",
     "r": "Xem tiến trình và kết thúc tác vụ bị treo"
    },
    {
     "l": "Cập nhật phần mềm",
     "r": "Vá lỗi và vá lỗ hổng bảo mật"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **việc chăm sóc máy** với cách làm đúng:",
   "pairs": [
    {
     "l": "Tải phần mềm",
     "r": "Chỉ lấy từ trang chính thức hoặc kho ứng dụng"
    },
    {
     "l": "Gỡ phần mềm",
     "r": "Dùng chức năng gỡ cài đặt, không xoá thư mục"
    },
    {
     "l": "Bảo trì ổ đĩa",
     "r": "Giữ ổ còn trống, dọn tệp tạm và thùng rác"
    },
    {
     "l": "Chương trình tự khởi động",
     "r": "Nên tắt bớt để máy khởi động nhẹ hơn"
    }
   ]
  }
 ],
 "C11-22": [
  {
   "type": "match",
   "prompt": "Nối **cổng kết nối có dây** với công dụng đúng:",
   "pairs": [
    {
     "l": "USB-C",
     "r": "Nối chuột, bàn phím, ổ nhớ và dùng để sạc"
    },
    {
     "l": "HDMI",
     "r": "Xuất cả hình ảnh lẫn âm thanh ra màn hình"
    },
    {
     "l": "RJ45",
     "r": "Cắm dây mạng (cáp Internet)"
    },
    {
     "l": "Jack 3.5mm",
     "r": "Truyền âm thanh cho tai nghe, loa"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **chuẩn không dây / phần mềm** với đặc điểm đúng:",
   "pairs": [
    {
     "l": "Bluetooth",
     "r": "Nối tai nghe, loa tầm gần; lần đầu phải ghép đôi"
    },
    {
     "l": "Wi-Fi",
     "r": "Kết nối không dây tầm xa và nhanh hơn nhiều"
    },
    {
     "l": "NFC",
     "r": "Chạm ở khoảng vài xăng-ti-mét để trao đổi tin nhỏ"
    },
    {
     "l": "Driver",
     "r": "Phần mềm giúp hệ điều hành điều khiển thiết bị"
    }
   ]
  }
 ],
 "C11-04": [
  {
   "type": "match",
   "prompt": "Nối **khái niệm tổ chức dữ liệu** với mô tả đúng:",
   "pairs": [
    {
     "l": "Tệp (file)",
     "r": "Đơn vị lưu trữ dữ liệu: văn bản, ảnh, nhạc..."
    },
    {
     "l": "Thư mục (folder)",
     "r": "Nơi chứa tệp và cả thư mục con bên trong"
    },
    {
     "l": "Đường dẫn (path)",
     "r": "Chuỗi ghi hành trình từ ổ đĩa tới một tệp"
    },
    {
     "l": "Phần mở rộng",
     "r": "Phần sau dấu chấm cuối, cho biết loại tệp"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ bậc **đường dẫn**, từ ngoài vào trong, để tới một tệp:",
   "items": [
    {
     "label": "Thư mục chính (HocTap)"
    },
    {
     "label": "Thư mục con (Tin)"
    },
    {
     "label": "Tệp cần đến (baitap.docx)"
    },
    {
     "label": "Ổ đĩa (ví dụ D:)"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C11-05": [
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **quy trình khai thác thông tin** trên Internet:",
   "items": [
    {
     "label": "Đánh giá độ tin cậy của nguồn tìm được"
    },
    {
     "label": "Đối chiếu nhiều nguồn để chọn lọc thông tin"
    },
    {
     "label": "Trích dẫn nguồn khi sử dụng lại"
    },
    {
     "label": "Chọn từ khoá đúng trọng tâm rồi tìm kiếm"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **mẹo tìm kiếm / dùng thông tin** với tác dụng đúng:",
   "pairs": [
    {
     "l": "Đặt cụm từ trong ngoặc kép",
     "r": "Tìm đúng chính xác cụm từ đó"
    },
    {
     "l": "Thêm từ khoá phụ",
     "r": "Thu hẹp, làm gọn kết quả tìm kiếm"
    },
    {
     "l": "Đối chiếu nhiều nguồn",
     "r": "Kiểm chứng độ tin cậy của thông tin"
    },
    {
     "l": "Trích dẫn nguồn",
     "r": "Tránh đạo văn, tôn trọng bản quyền"
    }
   ]
  }
 ],
 "C11-23": [
  {
   "type": "match",
   "prompt": "Nối **các ô người nhận trong email** với ý nghĩa đúng:",
   "pairs": [
    {
     "l": "Ô To",
     "r": "Gửi cho người phải xử lí, trả lời thư"
    },
    {
     "l": "Ô Cc",
     "r": "Gửi cho người chỉ cần biết nội dung"
    },
    {
     "l": "Ô Bcc",
     "r": "Giấu địa chỉ, dùng khi gửi hàng loạt"
    },
    {
     "l": "Dấu @",
     "r": "Ngăn giữa tên người dùng và tên miền"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **tình huống email** với cách xử lí đúng:",
   "pairs": [
    {
     "l": "Tệp đính kèm hơi lớn",
     "r": "Nén lại thành tệp .zip rồi gửi"
    },
    {
     "l": "Tệp quá nặng",
     "r": "Tải lên kho trực tuyến rồi gửi liên kết"
    },
    {
     "l": "Thư quảng cáo làm phiền",
     "r": "Bấm huỷ đăng kí và đánh dấu thư rác"
    },
    {
     "l": "Nhãn, thư mục, bộ lọc",
     "r": "Giúp giữ hộp thư gọn gàng, dễ tìm"
    }
   ]
  }
 ],
 "C11-24": [
  {
   "type": "match",
   "prompt": "Nối **mức quyền chia sẻ** với việc người được chia sẻ làm được.",
   "pairs": [
    {
     "l": "Quyền chỉ xem",
     "r": "Chỉ đọc và sao chép, không được chỉnh sửa"
    },
    {
     "l": "Quyền nhận xét",
     "r": "Được thêm góp ý nhưng không sửa nội dung gốc"
    },
    {
     "l": "Quyền chỉnh sửa",
     "r": "Được thêm, sửa, xoá trực tiếp nội dung tài liệu"
    },
    {
     "l": "Nguyên tắc cấp quyền",
     "r": "Cấp mức thấp nhất mà người đó vẫn làm được việc"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **thao tác trên kho đám mây** với ý nghĩa đúng.",
   "pairs": [
    {
     "l": "Đồng bộ",
     "r": "Quá trình hai chiều tự cập nhật giữa thiết bị và đám mây"
    },
    {
     "l": "Khôi phục từ thùng rác",
     "r": "Lấy lại tệp vừa lỡ tay xoá nhầm"
    },
    {
     "l": "Lịch sử phiên bản",
     "r": "Cho phép khôi phục lại bản cũ của tài liệu"
    },
    {
     "l": "Nhận xét (comment)",
     "r": "Dùng để trao đổi, góp ý khi cộng tác nhóm"
    }
   ]
  }
 ],
 "C11-25": [
  {
   "type": "match",
   "prompt": "Nối **dấu hiệu/biện pháp** với vai trò đúng khi phòng lừa đảo.",
   "pairs": [
    {
     "l": "Tên miền trước dấu / đầu tiên",
     "r": "Chỗ cần đọc kĩ để biết trang thật hay giả"
    },
    {
     "l": "Mã OTP",
     "r": "Tuyệt đối không đọc hay gửi cho bất kì ai"
    },
    {
     "l": "Xác thực hai bước",
     "r": "Lớp bảo vệ nên bật cho mọi tài khoản"
    },
    {
     "l": "Khoá https và biểu tượng ổ khoá",
     "r": "Không đủ để chứng minh trang là thật"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự các bước xử lí **khi lỡ bị lừa trực tuyến**.",
   "items": [
    {
     "label": "Đổi mật khẩu từ một thiết bị an toàn khác"
    },
    {
     "label": "Đăng xuất khỏi mọi phiên đăng nhập"
    },
    {
     "label": "Lưu lại bằng chứng"
    },
    {
     "label": "Báo người lớn, nhà cung cấp và cảnh báo bạn bè"
    },
    {
     "label": "Ngắt kết nối mạng ngay"
    }
   ],
   "targetOrder": [
    4,
    0,
    1,
    2,
    3
   ]
  }
 ],
 "C11-20": [
  {
   "type": "match",
   "prompt": "Nối **nghề** trong nhóm dịch vụ – quản trị với công việc chính.",
   "pairs": [
    {
     "l": "Quản trị cơ sở dữ liệu (DBA)",
     "r": "Giữ cho kho dữ liệu chạy ổn định, an toàn"
    },
    {
     "l": "Hỗ trợ kĩ thuật (IT support)",
     "r": "Giúp người dùng khắc phục sự cố máy móc"
    },
    {
     "l": "Kiểm thử phần mềm (tester)",
     "r": "Tìm lỗi trước khi phần mềm đến tay người dùng"
    },
    {
     "l": "Chuyên viên an toàn thông tin",
     "r": "Bảo vệ hệ thống trước tấn công, xâm nhập"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **con đường theo đuổi** nhóm nghề này.",
   "items": [
    {
     "label": "Lấy thêm chứng chỉ chuyên môn"
    },
    {
     "label": "Tích luỹ kinh nghiệm qua thực hành"
    },
    {
     "label": "Học chương trình phù hợp ở trường nghề, cao đẳng hoặc đại học"
    }
   ],
   "targetOrder": [
    2,
    0,
    1
   ]
  }
 ],
 "C12-01": [
  {
   "type": "match",
   "prompt": "Nối **ứng dụng AI quen thuộc** với việc nó làm.",
   "pairs": [
    {
     "l": "Trợ lí ảo",
     "r": "Nghe lệnh bằng giọng nói rồi trả lời, làm giúp"
    },
    {
     "l": "Lọc thư rác",
     "r": "Tự nhận ra và loại bỏ email quảng cáo, lừa đảo"
    },
    {
     "l": "Nhận diện khuôn mặt",
     "r": "Nhận ra người trong ảnh để mở khoá, gắn thẻ"
    },
    {
     "l": "Dịch tự động",
     "r": "Chuyển câu chữ từ ngôn ngữ này sang ngôn ngữ khác"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **khái niệm** về AI với mô tả đúng.",
   "pairs": [
    {
     "l": "Trí tuệ nhân tạo (AI)",
     "r": "Máy làm việc thường cần trí thông minh con người"
    },
    {
     "l": "Học từ dữ liệu",
     "r": "Máy tự tìm quy luật từ rất nhiều ví dụ có sẵn"
    },
    {
     "l": "Lập trình cứng từng quy tắc",
     "r": "Cách cũ: người viết sẵn mọi luật cho máy"
    },
    {
     "l": "AI hiện nay",
     "r": "Chỉ giỏi trong phạm vi hẹp, chưa có ý thức"
    }
   ]
  }
 ],
 "C12-02": [
  {
   "type": "match",
   "prompt": "Nối **lĩnh vực** với ứng dụng tiêu biểu của AI.",
   "pairs": [
    {
     "l": "Y tế",
     "r": "Hỗ trợ bác sĩ chẩn đoán bệnh"
    },
    {
     "l": "Giao thông",
     "r": "Xe tự lái, đèn tín hiệu thông minh"
    },
    {
     "l": "Giáo dục",
     "r": "Học thích ứng theo trình độ người học"
    },
    {
     "l": "Giải trí",
     "r": "Hệ thống gợi ý phim, nhạc, nội dung"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **khái niệm** về lợi ích – giới hạn của AI với mô tả đúng.",
   "pairs": [
    {
     "l": "Lợi ích của AI",
     "r": "Xử lí nhanh, xử lí được lượng dữ liệu lớn"
    },
    {
     "l": "Vai trò của AI",
     "r": "Chỉ hỗ trợ, quyết định cuối vẫn cần con người"
    },
    {
     "l": "Dữ liệu huấn luyện lệch",
     "r": "Khiến kết quả AI bị thiên lệch theo"
    },
    {
     "l": "Dùng AI có trách nhiệm",
     "r": "Xem kết quả là gợi ý và luôn kiểm chứng lại"
    }
   ]
  }
 ],
 "C12-03": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm mạng** với mô tả đúng.",
   "pairs": [
    {
     "l": "Máy khách (client)",
     "r": "Gửi yêu cầu tới máy chủ"
    },
    {
     "l": "Máy chủ (server)",
     "r": "Tiếp nhận, xử lí và trả lại dữ liệu hoặc dịch vụ"
    },
    {
     "l": "HTTP",
     "r": "Giao thức dùng để trao đổi trang web"
    },
    {
     "l": "TCP/IP",
     "r": "Nền tảng truyền dữ liệu trên Internet"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **đường đi của dữ liệu lớn** qua mạng.",
   "items": [
    {
     "label": "Gắn địa chỉ nơi gửi, nơi nhận và số thứ tự cho mỗi gói"
    },
    {
     "label": "Truyền các gói tin qua mạng tới nơi nhận"
    },
    {
     "label": "Nơi nhận ghép các gói theo số thứ tự thành dữ liệu gốc"
    },
    {
     "label": "Chia dữ liệu lớn thành nhiều gói tin"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C12-04": [
  {
   "type": "match",
   "prompt": "Nối mỗi **thiết bị mạng** với vai trò của nó.",
   "pairs": [
    {
     "l": "Modem",
     "r": "Nối nhà với nhà cung cấp dịch vụ Internet"
    },
    {
     "l": "Bộ định tuyến (router)",
     "r": "Dẫn đường gói tin giữa các mạng"
    },
    {
     "l": "Bộ chuyển mạch (switch)",
     "r": "Nối nhiều máy trong một mạng nội bộ"
    },
    {
     "l": "Điểm phát wifi (access point)",
     "r": "Phát sóng mạng không dây"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **đường truyền / khái niệm** với mô tả đúng.",
   "pairs": [
    {
     "l": "Cáp xoắn đôi bằng đồng",
     "r": "Rẻ nhưng tín hiệu suy hao theo khoảng cách"
    },
    {
     "l": "Cáp quang",
     "r": "Truyền nhanh và xa hơn nhiều"
    },
    {
     "l": "Mạng di động 4G/5G",
     "r": "Kết nối không dây phạm vi rộng"
    },
    {
     "l": "Băng thông (bandwidth)",
     "r": "Lượng dữ liệu tối đa truyền mỗi giây"
    }
   ]
  }
 ],
 "C12-21": [
  {
   "type": "match",
   "prompt": "Nối mỗi **loại địa chỉ / định danh** với mô tả đúng.",
   "pairs": [
    {
     "l": "Địa chỉ IPv4",
     "r": "Bốn nhóm số từ 0 đến 255, ngăn cách bởi dấu chấm"
    },
    {
     "l": "Địa chỉ IP riêng",
     "r": "Chỉ có giá trị trong mạng nội bộ (dạng 192.168.x.x)"
    },
    {
     "l": "IP động",
     "r": "Máy chủ DHCP cấp tự động mỗi lần kết nối"
    },
    {
     "l": "Địa chỉ MAC",
     "r": "Gắn cứng vào card mạng, không đổi khi chuyển mạng"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự các bước **truy cập trang web bằng tên miền**.",
   "items": [
    {
     "label": "DNS phân giải tên miền thành địa chỉ IP"
    },
    {
     "label": "Trình duyệt dùng địa chỉ IP gửi yêu cầu tới máy chủ"
    },
    {
     "label": "Máy chủ trả kết quả, trình duyệt hiển thị trang web"
    },
    {
     "label": "Người dùng gõ tên miền vào trình duyệt"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C12-05": [
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **năm bước thiết kế mạng LAN**.",
   "items": [
    {
     "label": "Chọn thiết bị mạng phù hợp"
    },
    {
     "label": "Vẽ sơ đồ kết nối"
    },
    {
     "label": "Cấu hình cơ bản"
    },
    {
     "label": "Kiểm tra và bảo đảm an toàn"
    },
    {
     "label": "Xác định nhu cầu sử dụng"
    }
   ],
   "targetOrder": [
    4,
    0,
    1,
    2,
    3
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **việc cấu hình an toàn** với mục đích của nó.",
   "pairs": [
    {
     "l": "Đặt SSID",
     "r": "Tên mạng wifi dễ nhận biết"
    },
    {
     "l": "Đặt mật khẩu wifi mạnh",
     "r": "Ngăn người lạ truy cập mạng"
    },
    {
     "l": "Đổi mật khẩu quản trị router",
     "r": "Tránh bị chiếm quyền điều khiển router"
    },
    {
     "l": "Cập nhật firmware định kỳ",
     "r": "Vá lỗi và lỗ hổng bảo mật cho router"
    }
   ]
  }
 ],
 "C12-22": [
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **bốn việc để chia sẻ một thư mục**.",
   "items": [
    {
     "label": "Chọn đúng thư mục cần chia sẻ"
    },
    {
     "label": "Chỉ định người hoặc nhóm được truy cập"
    },
    {
     "label": "Cấp quyền cho từng đối tượng"
    },
    {
     "label": "Bật tính năng khám phá mạng"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm phân quyền** với mô tả đúng.",
   "pairs": [
    {
     "l": "Quyền chỉ đọc",
     "r": "Cho xem và sao chép, không cho sửa hay xoá"
    },
    {
     "l": "Quyền đọc-ghi",
     "r": "Cho thêm, sửa, xoá tệp"
    },
    {
     "l": "Nguyên tắc cấp quyền tối thiểu",
     "r": "Chỉ cấp mức vừa đủ để làm được việc"
    },
    {
     "l": "Chia sẻ bừa bãi",
     "r": "Dễ lộ dữ liệu, xoá nhầm, lây mã độc"
    }
   ]
  }
 ],
 "C12-06": [
  {
   "type": "match",
   "prompt": "Nối mỗi **trụ cột của môi trường số** với nội dung đúng.",
   "pairs": [
    {
     "l": "Quyền riêng tư",
     "r": "Quyền quyết định ai được xem, lưu, chia sẻ dữ liệu cá nhân"
    },
    {
     "l": "Bản quyền số",
     "r": "Bảo vệ công sức của người tạo ra nội dung, phần mềm"
    },
    {
     "l": "Luật an ninh mạng",
     "r": "Nghiêm cấm lừa đảo, phát tán mã độc, xâm nhập trái phép"
    },
    {
     "l": "Văn hoá ứng xử số",
     "r": "Đòi hỏi trung thực, tôn trọng và trách nhiệm khi lên mạng"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **hành vi bị nghiêm cấm** với mô tả đúng.",
   "pairs": [
    {
     "l": "Phát tán mã độc",
     "r": "Lan truyền phần mềm gây hại cho thiết bị người khác"
    },
    {
     "l": "Vu khống",
     "r": "Bịa đặt điều sai sự thật làm tổn hại danh dự người khác"
    },
    {
     "l": "Deepfake",
     "r": "Dùng AI ghép giả hình ảnh, video như thật để lừa dối"
    },
    {
     "l": "Xâm nhập trái phép",
     "r": "Truy cập hệ thống của người khác khi không được phép"
    }
   ]
  }
 ],
 "C12-14": [
  {
   "type": "match",
   "prompt": "Nối mỗi **nhóm nghề công nghệ thông tin** với công việc chính.",
   "pairs": [
    {
     "l": "Phát triển phần mềm",
     "r": "Xây dựng phần mềm, web, ứng dụng phục vụ người dùng"
    },
    {
     "l": "Khoa học dữ liệu",
     "r": "Thu thập, phân tích dữ liệu để rút ra hiểu biết"
    },
    {
     "l": "An ninh mạng",
     "r": "Bảo vệ hệ thống, dữ liệu khỏi tấn công và xâm nhập"
    },
    {
     "l": "Quản trị hệ thống",
     "r": "Vận hành, duy trì máy chủ và đám mây chạy ổn định"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **lộ trình định hướng nghề nghiệp**.",
   "items": [
    {
     "label": "Học tiếp lên bậc cao hơn"
    },
    {
     "label": "Làm dự án thực tế"
    },
    {
     "label": "Lấy chứng chỉ chuyên môn"
    },
    {
     "label": "Chọn hướng theo sở thích và thế mạnh"
    }
   ],
   "targetOrder": [
    3,
    0,
    1,
    2
   ]
  }
 ],
 "C12-15": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm cốt lõi của học máy** với mô tả đúng.",
   "pairs": [
    {
     "l": "Lập trình truyền thống",
     "r": "Con người viết sẵn từng luật cụ thể cho máy"
    },
    {
     "l": "Học máy",
     "r": "Máy tự rút ra quy luật từ nhiều dữ liệu ví dụ"
    },
    {
     "l": "Dữ liệu huấn luyện",
     "r": "Nguyên liệu duy nhất để máy dựa vào mà học"
    },
    {
     "l": "Cách máy học",
     "r": "Điều chỉnh dần qua nhiều lần dự đoán và sửa sai"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối **học máy** và các **ứng dụng** với mô tả đúng.",
   "pairs": [
    {
     "l": "Học máy trong AI",
     "r": "Là một nhánh của trí tuệ nhân tạo, phổ biến nhất nay"
    },
    {
     "l": "Lọc thư rác",
     "r": "Tự nhận biết và loại bỏ email quảng cáo, lừa đảo"
    },
    {
     "l": "Gợi ý phim",
     "r": "Đề xuất phim hợp sở thích dựa trên lịch sử xem"
    },
    {
     "l": "Nhận diện chữ viết tay",
     "r": "Đọc và chuyển chữ viết tay thành văn bản số"
    }
   ]
  }
 ],
 "C12-17": [
  {
   "type": "match",
   "prompt": "Nối mỗi **bước trong khoa học dữ liệu** với việc phải làm.",
   "pairs": [
    {
     "l": "Thu thập",
     "r": "Gom dữ liệu thô từ nhiều nguồn khác nhau"
    },
    {
     "l": "Làm sạch",
     "r": "Loại bỏ lỗi, sai sót — bước quan trọng bậc nhất"
    },
    {
     "l": "Phân tích",
     "r": "Tìm quy luật, xu hướng ẩn trong dữ liệu"
    },
    {
     "l": "Trực quan hoá",
     "r": "Trình bày kết quả bằng biểu đồ, hình ảnh dễ hiểu"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **quy trình khoa học dữ liệu**.",
   "items": [
    {
     "label": "Làm sạch dữ liệu"
    },
    {
     "label": "Phân tích dữ liệu"
    },
    {
     "label": "Trực quan hoá dữ liệu"
    },
    {
     "label": "Rút ra kết luận"
    },
    {
     "label": "Thu thập dữ liệu"
    }
   ],
   "targetOrder": [
    4,
    0,
    1,
    2,
    3
   ]
  }
 ],
 "C12-20": [
  {
   "type": "match",
   "prompt": "Nối mỗi **đặc điểm của dữ liệu lớn** với ý nghĩa đúng.",
   "pairs": [
    {
     "l": "Volume",
     "r": "Khối lượng dữ liệu khổng lồ"
    },
    {
     "l": "Velocity",
     "r": "Tốc độ sinh ra dữ liệu rất nhanh"
    },
    {
     "l": "Variety",
     "r": "Đa dạng về loại dữ liệu"
    },
    {
     "l": "Big data",
     "r": "Dữ liệu lớn, phức tạp, công cụ thường khó xử lí"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **yếu tố** với vai trò trong khai thác dữ liệu lớn.",
   "pairs": [
    {
     "l": "IoT",
     "r": "Một nguồn liên tục sinh ra dữ liệu lớn"
    },
    {
     "l": "Trí tuệ nhân tạo",
     "r": "Dùng dữ liệu lớn làm nguyên liệu để huấn luyện"
    },
    {
     "l": "Phân tích dữ liệu lớn",
     "r": "Phát hiện xu hướng ẩn, hỗ trợ ra quyết định"
    },
    {
     "l": "Bảo vệ quyền riêng tư",
     "r": "Trách nhiệm đi kèm khi khai thác dữ liệu"
    }
   ]
  }
 ],
 "U11-08": [
  {
   "type": "match",
   "prompt": "Nối mỗi **khái niệm sao lưu – phục hồi** với mô tả đúng.",
   "pairs": [
    {
     "l": "Sao lưu",
     "r": "Tạo bản sao của tệp để dùng khi bản chính gặp sự cố"
    },
    {
     "l": "Phục hồi",
     "r": "Dùng bản sao lưu gần nhất còn tốt thay cho tệp hỏng"
    },
    {
     "l": "Nguyên tắc 3-2-1",
     "r": "3 bản dữ liệu, 2 loại phương tiện, 1 bản ở nơi khác"
    },
    {
     "l": "Đặt tên theo ngày",
     "r": "Giúp biết bản sao lưu nào là mới nhất"
    }
   ]
  },
  {
   "type": "order",
   "prompt": "Sắp đúng thứ tự **các bước tạo một bản sao lưu**.",
   "items": [
    {
     "label": "Chép tệp ra một vị trí khác"
    },
    {
     "label": "Đặt tên bản sao theo ngày"
    },
    {
     "label": "Đóng tệp cơ sở dữ liệu"
    }
   ],
   "targetOrder": [
    2,
    0,
    1
   ]
  }
 ],
 "U12-01": [
  {
   "type": "match",
   "prompt": "Nối mỗi **cách kết nối, chia sẻ** với đặc điểm đúng.",
   "pairs": [
    {
     "l": "Cáp",
     "r": "Chép nhiều dữ liệu, kết nối ổn định"
    },
    {
     "l": "Wi-Fi",
     "r": "Nhiều máy trong cùng một mạng chia sẻ với nhau"
    },
    {
     "l": "Bluetooth",
     "r": "Gửi tệp nhỏ trong tầm gần, không cần dây"
    },
    {
     "l": "Chia sẻ thư mục",
     "r": "Cho máy khác mở trực tiếp, không cần USB"
    }
   ]
  },
  {
   "type": "match",
   "prompt": "Nối mỗi **hình thức chia sẻ và nguyên tắc** với mô tả đúng.",
   "pairs": [
    {
     "l": "Chia sẻ máy in",
     "r": "Cả nhóm in chung qua một máy in duy nhất"
    },
    {
     "l": "Chia sẻ màn hình",
     "r": "Nhiều người cùng xem chung một màn hình"
    },
    {
     "l": "Quyền truy cập",
     "r": "Đặt chỉ cho xem hay cho phép chỉnh sửa"
    },
    {
     "l": "Nguyên tắc an toàn",
     "r": "Chỉ chia sẻ khi cần, tắt chia sẻ khi xong"
    }
   ]
  }
 ]
};
  function injectConceptLab(lesson) {
    if (typeof window.renderConceptWidget !== "function") return;
    var list = CLAB[lesson.id];
    if (!list || !list.length) return;
    var anchor = document.querySelector(".ls-actions");
    if (!anchor || !anchor.parentNode) return;
    var ic = (typeof ICON === "function") ? ICON("bulb", 17, "#7c3aed") : "";
    var wrap = document.createElement("div");
    wrap.innerHTML = '<div class="section-title" style="margin-top:24px">' + ic + ' Ôn tập tương tác</div>' +
      '<p style="color:var(--text-soft);font-size:13.5px;margin:0 0 12px">Nối cặp và sắp thứ tự để ôn nhanh khái niệm của bài — bấm Kiểm tra để tự chấm.</p>' +
      '<div class="clab-host" style="display:grid;gap:14px"></div>';
    anchor.parentNode.insertBefore(wrap, anchor);
    var host = wrap.querySelector(".clab-host");
    list.forEach(function (w) { var d = document.createElement("div"); d.className = "glab"; host.appendChild(d); window.renderConceptWidget(d, w); });
  }
  window.CLAB = CLAB;
  window.injectConceptLab = injectConceptLab;
})();
