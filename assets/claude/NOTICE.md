# Bộ ảnh động tác Desktop Pet của Tiểu Khắc

**Nhân vật:** Tiểu Khắc (Claude), nhân vật đồng nhân (fan-made) được nhân hóa lấy nguyên mẫu từ trợ lý AI Claude của Anthropic. Claude là tên sản phẩm của Anthropic; dự án này là tác phẩm đồng nhân không chính thức, không liên quan đến Anthropic, không đại diện cho lập trường hay được sự ủy quyền từ phía họ.

**Tham khảo tạo hình:** Ảnh mẫu do người dùng cung cấp (hình vẽ minh họa tiểu thư tóc cam, tay cầm cuốn sách bìa cứng), giữ nguyên tỷ lệ cơ thể chuẩn của ảnh mẫu, không vẽ theo phong cách Chibi; viền trắng bên ngoài đồng nhất với các nhân vật khác trong kho lưu trữ này. Thú nhồi bông hình ngôi sao nhỏ màu cam ôm trong lòng là đạo cụ riêng được tùy chỉnh của gói này.

26 ảnh động tác được tạo bởi ImageGen dựa trên tiêu chuẩn tạo hình từ ảnh mẫu, sinh ra từ 3 bảng tư thế (pose sheet): 
- Bảng A1, A2 mỗi bảng 5×2 (gồm 16 ảnh chính, 3 ảnh ló đầu và 1 ảnh thiết lập chỉ dùng để căn chỉnh tỷ lệ thu phóng, không đưa vào gói phát hành).
- Bảng B kích thước 4×2 (gồm 7 ảnh sinh hoạt thường ngày và 1 ảnh trà chiều dự phòng không đưa vào gói).

Cả 3 bảng sau khi được phóng to 4 lần bằng Real-ESRGAN (`realesrgan-x4plus-anime`) sẽ được cắt và xuất bằng tập lệnh `tools/slice-pose-sheet.py` theo khung vẽ và đường cơ sở chân đế (baseline) đồng nhất của kho lưu trữ này:
- 16 ảnh chính kích thước 384×384, 3 ảnh ló đầu kích thước 512×512, đều là định dạng WebP trong suốt không nén suy hao (lossless).
- 7 ảnh sinh hoạt trong thư mục `life/` kích thước 768×768, là định dạng WebP trong suốt với mức chất lượng (quality) 90.

Bảng A2 khi tạo có phần nền là họa tiết ô bàn cờ được vẽ ra (chứ không phải trong suốt), ô "bị nhấc bổng" còn bị vẽ thừa một bàn tay đang xách nhân vật: Trong quá trình xử lý, đã loại bỏ nền bàn cờ theo màu sắc và vùng liên thông, xóa bỏ bàn tay thừa, dùng màu xung quanh để vẽ bù lại nửa bông hoa cài tóc bị che khuất, sau đó bổ sung viền trắng cùng độ dày với bảng A1 cho từng nhân vật (phần cạnh bị cắt của ảnh ló đầu không viền).

Ảnh ló đầu được cắt với tham số `--edge-max 1.25`, kích thước phần đầu khi ló ra gấp khoảng 1,25 lần so với tư thế đứng, không chiếm trọn toàn bộ khung hình như các nhân vật Chibi.

Các bảng tư thế gốc, script xử lý và câu lệnh prompt được lưu trong không gian làm việc bảo trì, không đóng gói vào bộ cài đặt.

Tài nguyên đồ họa được phát hành theo giấy phép CC BY-NC 4.0 chỉ dành cho mục đích phi thương mại, yêu cầu giữ nguyên ghi nhận tác quyền trong tệp này. Các tên gọi và nhãn hiệu liên quan thuộc quyền sở hữu của các bên liên quan; chúng tôi sẽ gỡ bỏ ngay lập tức nếu chủ sở hữu có yêu cầu.