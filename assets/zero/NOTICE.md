# Các khung hình hành động của Pet màn hình Zero

Nhân vật: Zero (Renata), sản phẩm fanmade không chính thức của "Long Tộc" (Dragon Raja).

Tham khảo tạo hình: Zero trong ảnh quảng bá chính thức của "Long Tộc"; tỷ lệ đầu - thân và phong cách vẽ được căn chỉnh thống nhất với bộ khung hình hành động của Erii trong repository này (vốn lấy tham khảo tạo hình từ asset pet màn hình Erii Cardwright của Cố Thanh Hàn - giấy phép CC BY-NC 4.0).
Bé thiên nga đen trên đầu là đạo cụ nhận diện riêng của gói này, tương ứng với chú vịt vàng trên đầu Erii.

26 khung hình hành động được tạo bằng ImageGen dựa trên hai bảng tư thế: Bảng A 4×5 (16 ảnh cốt lõi, 3 ảnh ló đầu và 1 ảnh thiết kế không đưa vào gói), Bảng B 4×2 (7 ảnh sinh hoạt và 1 ảnh ăn uống chung không sử dụng). Cả hai bảng được phóng to 4 lần qua Real-ESRGAN (mô hình realesrgan-x4plus-anime), sau đó dùng script tools/slice-pose-sheet.py để cắt và xuất file dựa theo kích thước canvas và đường cơ sở (baseline) dưới chân được quy định thống nhất trong repository:
16 ảnh cốt lõi (384×384) và 3 ảnh ló đầu (512×512) đều ở định dạng WebP trong suốt, không nén (lossless); 7 ảnh sinh hoạt trong thư mục life/ (768×768) là định dạng WebP trong suốt, chất lượng 90.
Các bảng tư thế gốc và prompt (câu lệnh) được lưu trữ tại không gian làm việc bảo trì, không bao gồm trong gói cài đặt.

Tài nguyên mỹ thuật tuân theo giấy phép CC BY-NC 4.0, chỉ dành cho mục đích phi thương mại và yêu cầu giữ nguyên ghi công của tệp này. Nhân vật cùng các thương hiệu liên quan thuộc về chủ sở hữu bản quyền gốc. Dự án này không đại diện cho tác phẩm gốc hay sự ủy quyền chính thức; toàn bộ nội dung sẽ được gỡ bỏ ngay khi có yêu cầu từ chủ sở hữu.