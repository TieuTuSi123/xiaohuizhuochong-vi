# Bộ ảnh động tác Desktop Pet của Erii

**Nhân vật:** Uesugi Erii (Thượng Sam Hội Lê Y), sản phẩm đồng nhân (fan-made) không chính thức từ tác phẩm *《Long Tộc》 (Dragon Raja)*.

**Tham khảo tạo hình:** Cố Thanh Hàn (Gu Qinghan), tài nguyên desktop pet Erii từ Cardwright.  
**Tài nguyên gốc:** https://github.com/1798547983tt/Cardwright/tree/359019715afc60813384964b023a09c6dd6ed326/assets/pets/erii  
**Giấy phép tài nguyên gốc:** CC BY-NC 4.0, https://creativecommons.org/licenses/by-nc/4.0/  

16 ảnh động tác ban đầu được tạo bởi ImageGen dựa trên các nguồn tham khảo nêu trên, sau đó được cắt thành ảnh WebP trong suốt không suy hao (lossless) kích thước 384×384.

- **v0.3.0:** Bổ sung 4 tư thế tương tác mới gồm: "bị nhấc bổng", "ngồi vững", "chào hỏi", "ló đầu". Động tác "ôm vịt" tiếp tục sử dụng tài nguyên đã chỉnh sửa ở phiên bản đó.
- **v0.3.1:** Sử dụng ImageGen tích hợp để sửa các chi tiết thừa từ ô bên cạnh và viền bị cắt cho 7 ảnh: "ghi chép", "uống trà", "vươn vai", "bị nhấc bổng", "ngồi vững", "chào hỏi", "ló đầu", sau đó xuất ra theo kích thước và đường cơ sở (baseline) đồng nhất; giữ lại kênh trong suốt (alpha channel).

Giữ nguyên ghi nhận tác quyền của tác giả gốc; tài nguyên đồ họa trong gói này được phát hành theo giấy phép CC BY-NC 4.0 chỉ dành cho mục đích phi thương mại.  
Nhân vật và các nhãn hiệu liên quan thuộc quyền sở hữu của các bên nắm bản quyền gốc. Dự án này không đại diện cho tác phẩm gốc hoặc sự ủy quyền chính thức từ tác giả/nhà phát hành.

---

**v0.5.11:** Bổ sung 3 ảnh ló đầu gồm `edge-left-v2.webp`, `edge-right-v2.webp`, `edge-bottom.webp`, được tạo riêng lẻ bằng ImageGen tích hợp, sau đó thu nhỏ theo tỷ lệ thành ảnh WebP trong suốt không suy hao 512×512. Cả 3 ảnh đều giữ chú vịt vàng nhỏ trên đầu, tay trần không đeo găng. Động tác ló đầu sang trái/phải được vẽ lại dựa trên phản hồi của người dùng, đổi thành tư thế tự nhiên với thân hình nấp sau mép viền, chỉ để lộ một tay vịn mép. Động tác ló đầu phía trên được hiển thị bằng cách dùng trình duyệt xoay góc ảnh từ tài nguyên mặt trước. Câu lệnh prompt và ảnh PNG gốc được lưu trong thư mục không gian làm việc bảo trì `outputs/小绘探头素材-v0.5.11`, không đưa vào gói cài đặt rút gọn (lightweight). Tham khảo tạo hình và giấy phép phi thương mại tiếp tục áp dụng theo mô tả trong tài liệu này.

---

**v0.7.0:** Bổ sung các tệp `assets/life/work-bookshop.webp`, `work-bakery.webp`, `work-florist.webp`, `eating.webp`. ImageGen tích hợp đã tham khảo nhân vật và nét vẽ của tệp `idle.webp` hiện có trong dự án để lần lượt tạo các tư thế mới: tiệm sách, tiệm bánh ngọt, tiệm hoa và đang ăn; giữ lại chú vịt vàng nhỏ trên đầu, tay trần không đeo găng. Ảnh gốc là các tệp PNG trong suốt độc lập, phiên bản phát hành chỉ thu nhỏ theo tỷ lệ và nén thành WebP 768×768 (chất lượng 90, giữ nguyên kênh trong suốt), không thực hiện tách nền hay chỉnh sửa lại nét vẽ. Ảnh gốc và prompt hoàn chỉnh được lưu trong không gian làm việc bảo trì, không đưa vào gói cài đặt rút gọn. Ghi nhận tác quyền tạo hình và điều kiện sử dụng phi thương mại tiếp tục áp dụng theo tài liệu này.

---

**v0.7.1:** Bổ sung 4 ảnh ăn uống độc lập: `assets/life/eat-pudding.webp`, `eat-riceball.webp`, `eat-omurice.webp`, `eat-ramen.webp`. ImageGen tích hợp dựa trên nét vẽ nhân vật của `idle.webp` và tư thế ngồi tự nhiên từ `eating.webp` gốc để tạo tương ứng; lần lượt thể hiện: bánh pudding, cơm nắm rong biển, cơm cuộn trứng (omurice), đũa gắp mì ramen; không đeo găng tay, giữ lại chú vịt vàng nhỏ trên đầu. Phiên bản phát hành chỉ thu nhỏ theo tỷ lệ và nén thành WebP trong suốt 768×768. Ảnh gốc cùng toàn bộ prompt được lưu tại thư mục `outputs/Erii-Food-Art-v0.7.1` và `小绘-v0.7.1-四种吃饭配图提示词.md`, không đưa vào gói cài đặt; việc ghi nhận tác quyền và điều kiện phi thương mại tiếp tục áp dụng như trên.

---

**v0.8.0:** Các ảnh động tác bổ sung của Zero (Linh) nằm tại `assets/zero/`, ghi nhận tác quyền và giấy phép xem tại `assets/zero/NOTICE.md`. Ảnh của Nãi Đán (Naidan) thuộc về "Cơ sở dữ liệu Long Huyết Huyền Hoàng", tiện ích mở rộng này chỉ đọc ảnh đã tải sẵn trong cơ sở dữ liệu khi chạy, không nằm trong gói này.

---

**v0.9.3:** Bổ sung trang phục "Tsukuyomi · Dạ Lễ Phục Tím" (Nguyệt Độc Mệnh · Đầm dạ hội tím), gồm 27 ảnh động tác/sinh hoạt trong suốt tại `assets/skins/erii-purple-night/`. Trang phục tham khảo hình ảnh do người dùng cung cấp, được tạo bởi ImageGen; phiên bản phát hành chỉ thu nhỏ theo tỷ lệ và nén thành WebP 960×960. Trang phục mới giữ lại găng tay ren mỏng; ảnh "ôm vịt" chỉ có chú vịt ôm trong lòng, các ảnh khác vẫn giữ chú vịt trên đầu. Nguồn gốc và phạm vi sử dụng của trang phục mới xem tại [Thuyết minh riêng](skins/erii-purple-night/NOTICE.md). Các byte dữ liệu của ảnh trang phục mặc định ban đầu không thay đổi.

---

## v1.0.0 Trang phục Hoàng nữ của Zero

Bổ sung 27 ảnh WebP trong suốt 960×960 và danh sách tệp đa phương tiện tại `skins/zero-ice-rose/`. Tiếp tục sử dụng tạo hình đồng nhân từ ảnh gốc đã được người dùng xác nhận, ảnh gốc và câu lệnh prompt được lưu giữ trong thư mục tài nguyên bảo trì; phương thức nhận là mở khóa bằng mật khẩu do người dùng chỉ định, không phải mua. Chi tiết xem tại `NOTICE.md` trong thư mục đó.

---

## v1.0.2 Tiểu Khắc (Claude)

Ảnh động tác mới thêm của Tiểu Khắc (Claude) nằm tại `assets/claude/` (16 ảnh chính, 3 ảnh ló đầu) và `assets/claude/life/` (7 ảnh sinh hoạt). Tham khảo tạo hình, phương thức tạo và giấy phép xem tại [assets/claude/NOTICE.md](claude/NOTICE.md). Dữ liệu byte của tài nguyên trước đó không thay đổi.