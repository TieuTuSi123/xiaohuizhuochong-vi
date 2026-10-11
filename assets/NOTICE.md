# Các khung hình hành động của Pet màn hình Erii

Nhân vật: Uesugi Erii, sản phẩm đồng nhân không chính thức của "Long Tộc" (Dragon Raja).

Tham khảo tạo hình: Cố Thanh Hàn, asset pet màn hình Erii Cardwright.  
Asset gốc: https://github.com/1798547983tt/Cardwright/tree/359019715afc60813384964b023a09c6dd6ed326/assets/pets/erii  
Giấy phép asset gốc: CC BY-NC 4.0, https://creativecommons.org/licenses/by-nc/4.0/

16 khung hình hành động gốc được tạo bằng ImageGen dựa trên tham khảo nêu trên, sau đó cắt thành định dạng WebP trong suốt, không nén (lossless) kích thước 384×384.  
4 ảnh ở v0.3.0 gồm: bị nhấc lên, ngồi vững, vẫy gọi, ló đầu là các tư thế tương tác mới được thêm vào. Động tác ôm vịt tiếp tục sử dụng asset đã được chỉnh sửa tại thời điểm đó.  
Bản v0.3.1 sử dụng ImageGen tích hợp để sửa các mảnh vụn từ ô bên cạnh và cắt rìa cho 7 ảnh: viết ghi chép, uống trà, vươn vai, bị nhấc lên, ngồi vững, vẫy gọi, ló đầu. Sau đó xuất file theo kích thước và đường cơ sở đồng nhất; giữ nguyên kênh trong suốt.  
Giữ nguyên ghi công tác giả gốc; tài nguyên mỹ thuật trong gói này tuân theo giấy phép CC BY-NC 4.0, chỉ dành cho mục đích phi thương mại.  
Nhân vật cùng các thương hiệu liên quan thuộc về chủ sở hữu bản quyền gốc. Dự án này không đại diện cho tác phẩm gốc hay sự ủy quyền chính thức.

v0.5.11 bổ sung 3 ảnh ló đầu: edge-left-v2.webp, edge-right-v2.webp, edge-bottom.webp. Các ảnh này được tạo riêng biệt bằng ImageGen tích hợp, sau đó thu nhỏ theo tỷ lệ thành WebP trong suốt, không nén kích thước 512×512. Cả 3 ảnh đều giữ chú vịt vàng trên đầu, tay trần không đeo găng. Ảnh ló đầu trái và phải được vẽ lại dựa trên phản hồi của người dùng, đổi thành tư thế tự nhiên: giấu thân mình sau mép màn hình, chỉ lộ một tay vịn vào viền. Ảnh ló đầu phía trên được hiển thị bằng cách để trình duyệt xoay asset mặt trước. Prompt và ảnh PNG gốc được lưu trong không gian làm việc bảo trì tại "outputs/小绘探头素材-v0.5.11", không đưa vào gói cài đặt rút gọn. Tham khảo tạo hình và giấy phép phi thương mại tiếp tục áp dụng theo phần giải thích trong tệp này.

v0.7.0 bổ sung assets/life/work-bookshop.webp, work-bakery.webp, work-florist.webp, eating.webp. ImageGen tích hợp lấy tham khảo từ nhân vật và phong cách vẽ của ảnh idle.webp hiện có trong dự án để tạo các tư thế mới tương ứng cho nhà sách, tiệm bánh ngọt, tiệm hoa và khi ăn; giữ chú vịt vàng trên đầu, tay trần không đeo găng. Ảnh gốc là định dạng PNG trong suốt độc lập, bản phát hành chỉ thu nhỏ theo tỷ lệ và nén thành WebP kích thước 768×768 (chất lượng 90, giữ nguyên kênh trong suốt), không thực hiện tách nền hay vẽ lại thêm. Ảnh gốc và prompt đầy đủ được lưu ở không gian làm việc bảo trì, không đưa vào gói cài đặt rút gọn. Việc ghi công tham khảo tạo hình và điều kiện sử dụng phi thương mại tuân theo quy định của tệp này.

v0.7.1 bổ sung 4 ảnh ăn uống độc lập: assets/life/eat-pudding.webp, eat-riceball.webp, eat-omurice.webp, eat-ramen.webp. ImageGen tích hợp được dùng để tạo các ảnh này dựa trên tham khảo từ phong cách nhân vật của idle.webp và tư thế ngồi tự nhiên của eating.webp gốc; lần lượt thể hiện cảnh ăn bánh pudding, cơm nắm rong biển, cơm cuộn trứng (omurice), gắp mì ramen bằng đũa, không đeo găng tay, giữ nguyên vịt vàng trên đầu. Bản phát hành chỉ thu nhỏ theo tỷ lệ và nén thành WebP trong suốt kích thước 768×768. Ảnh gốc cùng prompt đầy đủ được lưu trong không gian làm việc ở thư mục outputs/Erii-Food-Art-v0.7.1 và tệp "小绘-v0.7.1-四种吃饭配图提示词.md", không đưa vào gói cài đặt; quy định ghi công và điều kiện phi thương mại áp dụng như trên.

v0.8.0 bổ sung ảnh động tác của Zero tại `assets/zero/`, phần ghi công và giấy phép xem tại `assets/zero/NOTICE.md`. Ảnh của Nãi Đản thuộc về "Long Huyết Huyền Hoàng · Cơ sở dữ liệu", tiện ích mở rộng này chỉ đọc ảnh cơ sở dữ liệu đã nạp sẵn lúc runtime, không nằm trong gói cài đặt này.

v0.9.3 bổ sung Tsukuyomi · Lễ Phục Dạ Tím, 27 ảnh động tác / sinh hoạt nền trong suốt tại `assets/skins/erii-purple-night/`. Trang phục tham khảo hình ảnh do người dùng cung cấp, do ImageGen tạo, bản phát hành chỉ thu nhỏ theo tỷ lệ và nén thành WebP 960×960. Skin mới giữ lại găng tay tơ; ảnh ôm vịt chỉ có con vịt trong lòng, các ảnh khác giữ lại vịt trên đỉnh đầu. Nguồn gốc và phạm vi sử dụng của skin mới xem tại [hướng dẫn riêng](skins/erii-purple-night/NOTICE.md). Kích thước byte của các tệp ảnh thuộc skin mặc định ban đầu được giữ nguyên không đổi.
