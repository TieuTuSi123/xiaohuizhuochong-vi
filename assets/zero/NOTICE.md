# Ảnh Động Tác Desktop Pet Zero

Nhân vật: Zero (Renata), sản phẩm đồng nhân phi chính thức dựa trên "Long Tộc".

Tham chiếu tạo hình: Zero trong hình ảnh quảng bá chính thức của "Long Tộc"; tỷ lệ đầu-thân cùng phong cách vẽ được căn chỉnh đồng bộ với bộ ảnh động tác Erii trong kho lưu trữ này (tạo hình Erii tham khảo từ tài nguyên desktop pet Erii của Cố Thanh Hàn trên Cardwright, giấy phép CC BY-NC 4.0).  
Thiên nga đen nhỏ trên đỉnh đầu là phụ kiện nhận diện riêng do bộ tài nguyên này tự thiết lập, tương ứng với vịt vàng nhỏ trên đỉnh đầu Erii.

26 ảnh động tác do ImageGen tạo dựa trên 2 bảng tư thế (pose sheet):
- Bảng A (4×5): Gồm 16 ảnh hành động cốt lõi, 3 ảnh nhô đầu và 1 ảnh concept không đóng gói.
- Bảng B (4×2): Gồm 7 ảnh sinh hoạt thường nhật và 1 ảnh động tác ăn uống chung chưa sử dụng.

Cả 2 bảng ảnh sau khi phóng to 4 lần bằng Real-ESRGAN (`realesrgan-x4plus-anime`) được cắt và xuất bằng script `tools/slice-pose-sheet.py` theo kích thước khung vẽ (canvas) và đường gióng chân (baseline) chuẩn của kho lưu trữ:
- 16 ảnh cốt lõi: 384×384, định dạng WebP không nén suy hao (lossless), nền trong suốt.
- 3 ảnh nhô đầu: 512×512, định dạng WebP không nén suy hao (lossless), nền trong suốt.
- 7 ảnh sinh hoạt trong thư mục `life/`: 768×768, định dạng WebP nền trong suốt với chất lượng 90.

Bảng tư thế gốc và prompt được lưu trữ trong workspace bảo trì, không đính kèm vào gói cài đặt phát hành.

Tài nguyên mỹ thuật phát hành theo giấy phép CC BY-NC 4.0 chỉ dành cho mục đích phi thương mại, yêu cầu giữ nguyên phần ghi nhận quyền tác giả trong tài liệu này. Nhân vật và các nhãn hiệu liên quan thuộc sở hữu của bên nắm bản quyền gốc; dự án này không đại diện cho tác phẩm gốc hoặc nhận ủy quyền chính thức, sẵn sàng gỡ bỏ ngay khi bên nắm bản quyền yêu cầu.
