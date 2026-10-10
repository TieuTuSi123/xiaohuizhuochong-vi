# Tiểu Erii · Pet màn hình cơ sở dữ liệu

Đây là một tiện ích mở rộng pet màn hình độc lập được cài đặt vào SillyTavern. Nó đọc trạng thái nhiệm vụ và thông báo kết quả đã được hiển thị bởi "Long Huyết Huyền Hoàng · Cơ sở dữ liệu", sau đó để pet màn hình phản ứng lại bằng hành động, tương tác nhấp chuột, bong bóng nhiệm vụ và lời thoại của riêng mình. Bạn có thể chuyển đổi pet màn hình giữa Tiểu Erii, Zero và Nai Dan, mỗi nhân vật có tính cách, lời thoại, hồ sơ nuôi dưỡng và lịch sử trò chuyện riêng. Bạn cũng có thể mở một cửa sổ độc lập để trò chuyện với pet màn hình bằng API hiện tại của Tavern hoặc API được cấu hình riêng.

## Phiên bản hiện tại: v0.9.0

**v0.9.0: Cửa sổ trò chuyện được bổ sung thêm chế độ "Bảo trì cơ sở dữ liệu" —— pet màn hình sẽ xem bảng biểu, các lỗi gần đây và vài tầng văn bản trò chuyện gần đây, liệt kê những chỗ cần sửa thành một danh sách sửa đổi; sau khi bạn kiểm tra và xác nhận từng mục, nó mới ghi vào thông qua giao diện công khai của cơ sở dữ liệu. Trước khi ghi, nó sẽ tự động sao lưu toàn bộ bảng và có thể hoàn tác bằng một nút bấm. Bổ sung "Quan sát trò chuyện" (mặc định tắt): Cứ cách vài tầng trò chuyện, pet màn hình sẽ xem văn bản mới xuất hiện và nói một hai câu cảm nghĩ vào lịch sử trò chuyện, bạn có thể trả lời trực tiếp; nếu liên tục vài lần không ai để ý, nó sẽ cảm thấy hơi tủi thân.**

Ba pet màn hình (Tiểu Erii / Zero / Nai Dan) của v0.8.0, nhà pet màn hình, hệ thống nuôi dưỡng, lời thoại nhiệm vụ, phím tắt mở bảng cơ sở dữ liệu và giao diện sổ tay bìa cứng đều được giữ nguyên.

- Chỉ có hai trường hợp tiện ích sẽ đọc văn bản trò chuyện của Tavern, và cả hai đều phải do bạn tự mở: chế độ bảo trì (mỗi lần gửi tin nhắn sẽ đính kèm từ 0～10 tầng trò chuyện gần đây, có thể điều chỉnh) và quan sát trò chuyện (sau khi bật, chỉ xem các tầng mới xuất hiện). Nội dung đọc được chỉ gửi đến API dùng để trò chuyện của pet màn hình.
- Chỉ có chế độ bảo trì mới sửa cơ sở dữ liệu: mỗi mục đều cần bạn đánh dấu chọn, nhấn **Áp dụng mục đã chọn** mới ghi; việc ghi chỉ đi qua `AutoCardUpdaterAPI` công khai của cơ sở dữ liệu, sao lưu toàn bộ trước khi ghi và có thể hoàn tác. Không có tính năng tự động áp dụng.
- Ngoài ra, vẫn duy trì cơ chế đồng bộ chỉ đọc: không sao chép, không thay thế cơ sở dữ liệu, bình thường không đọc/ghi bảng.
- Vị trí của pet màn hình chỉ thay đổi khi người dùng kéo thả thủ công; không khôi phục việc tự động di chuyển.
- Hình ảnh của Nai Dan được đọc từ cơ sở dữ liệu đang chạy lúc runtime, không phân phối kèm tiện ích này; khi cơ sở dữ liệu không mở thì không thể chuyển sang Nai Dan.

Các phiên bản cũ từng thêm tính năng tự động di chuyển, chạy bộ và đi dạo. Những logic đó đã được hoàn tác từ **v0.5.8**, không nên nhầm lẫn hành vi của phiên bản cũ với phiên bản hiện tại.

## Cách kiểm tra kho lưu trữ GitHub đã là bản mới nhất chưa

Hãy đối chiếu bốn điểm dưới đây, tất cả đều hiển thị `0.9.0` thì mới xem là mã nguồn bảo trì hiện tại đã được cập nhật đầy đủ:

1. Mở [`manifest.json`](manifest.json) ở thư mục gốc của kho lưu trữ, kiểm tra xem `version` có phải là `0.9.0` không.
2. Kiểm tra phần "Phiên bản hiện tại" ở đầu README này xem có phải là **v0.9.0** không.
3. Kiểm tra xem lần commit GitHub gần nhất có chứa các tệp chỉnh sửa của lần này không; v0.9.0 bắt buộc phải có `repair.js`, `repair-ticket.js`, `database-repair.js`, `backup-store.js`, `watch.js`, đồng thời vẫn giữ lại thư mục `characters/`, `characters.js`, `care-model.js`, `lines.js`, `notebook.js`, `pet-house.js`, `sheet.js`, `effects.js`, `icons.js`, `database-shortcuts.js` của v0.8.0, cũng như 19 ảnh WebP trong `assets/zero/` và 7 ảnh trong `assets/zero/life/`; `assets/run-*.webp` đã bị xóa.
4. Nếu dùng file nén, tên file phải là `绘梨衣桌宠-独立扩展-v0.9.0.zip`, sau khi giải nén thì `manifest.json` vẫn phải là `0.9.0`.

Phiên bản hiển thị trong danh sách tiện ích của Tavern là phiên bản được tải thực tế. Chỉ nhìn thấy README trên GitHub đã cập nhật không chứng minh được Tavern đã tải bản mới; hãy cập nhật tiện ích và làm mới trang rồi mới đối chiếu lại số phiên bản trong Tavern.

## Cài đặt trực tiếp trong Tavern

1. Mở phần **Tiện ích mở rộng** → **Cài đặt tiện ích mở rộng** ở thanh trên cùng của Tavern.
2. Dán địa chỉ kho lưu trữ: `https://github.com/dzsks/xiaohuizhuochong`.
3. Sau khi cài đặt hoặc cập nhật xong, hãy làm mới trang Tavern.
4. Trong danh sách tiện ích, xác nhận phiên bản của **Tiểu Erii · Pet màn hình cơ sở dữ liệu** là `0.9.0`.
5. Nhấp chuột phải vào pet màn hình trên máy tính, hoặc nhấn giữ khoảng 1.4 giây trên điện thoại để mở cuốn sổ nhỏ; nếu thấy "Đã kết nối cơ sở dữ liệu" hoặc "Cơ sở dữ liệu đang xử lý nhiệm vụ", điều đó có nghĩa là đã tìm thấy nguồn dữ liệu của cơ sở dữ liệu.

Thư mục gốc của kho lưu trữ phải chứa trực tiếp các tệp `manifest.json`, `index.js`, `style.css`, v.v., không được bọc thêm một lớp thư mục bên ngoài. Hình ảnh nằm trong thư mục `assets/` ở thư mục gốc.

## Cập nhật bản cài đặt hiện có

### Cập nhật qua kho lưu trữ GitHub

1. Ghi đè các tệp phiên bản mới lên cùng một thư mục gốc của kho lưu trữ, giữ nguyên cấu trúc tệp của `assets/`.
2. Commit các thay đổi lên GitHub.
3. Quay lại trình quản lý tiện ích của Tavern, nhấp vào nút cập nhật của tiện ích này.
4. Làm mới trang Tavern, xác nhận phiên bản trong danh sách tiện ích là `0.9.0`.
5. Nếu hành vi hoặc hình ảnh vẫn là của bản cũ, trước tiên hãy tải lại tiện ích; nếu vẫn không thay đổi, dùng `Ctrl+F5` để buộc làm mới bộ nhớ cache của trình duyệt.

### Kiểm tra qua file nén

Gói bảo trì hiện tại: `绘梨衣桌宠-独立扩展-v0.9.0.zip`.

Kiểm tra sau khi giải nén:

- `version` trong `manifest.json` là `0.9.0`;
- Dấu phiên bản pet màn hình trong `index.js` là `0.9.0`;
- Trong `assets/` không có các frame chạy trái phải, `assets/zero/` và `assets/zero/life/` đều có mặt;
- Mục mới nhất ở đầu README và lịch sử phiên bản đều là `v0.9.0`.

## Các chức năng hiện có

### Nhấp chuột và tương tác

| Thao tác | Phản ứng của pet màn hình (lấy Tiểu Erii làm ví dụ) |
| --- | --- |
| Chạm nhẹ một cái | Vẫy tay đáp lại |
| Nhấp đúp trong thời gian ngắn | Ôm vịt vàng nhỏ lắc nhẹ |
| Nhấp ba lần hoặc nhiều hơn trong 1.2 giây | Ôm cuốn sổ trốn đi một lát |
| Nhấp sáu lần trong 2.6 giây | Ló đầu → Ôm vịt → Vẫy tay, phát xong sẽ khôi phục |
| Nhấn giữ khoảng nửa giây | Bắt đầu chợp mắt; sau khi thả ra sẽ tiếp tục nghỉ ngơi khoảng 12 giây |
| Chạm nhẹ khi đang chợp mắt | Đánh thức sớm |
| Kéo thả | Bị xách lên, thả tay ra sẽ ngồi vững và lưu vị trí |
| Nhấp chuột phải (PC) | Mở / Thu gọn cuốn sổ nhỏ |

Cách tương tác của Zero và Nai Dan cũng tương tự, chỉ thay đổi hành động thành của riêng họ: Zero ôm thiên nga đen nhỏ, gấp thiên nga giấy, uống ca cao nóng; Nai Dan sợ nhột khi nhấp đúp, nhấp liên tục sẽ tức giận khè khè, nhấn giữ thì ngồi ngáy ngủ. Các hành động nhấp chuột, tặng hoa, cùng bạn điền bảng đều làm tăng một chút độ thân thiết (xem mục "Nuôi dưỡng"). Thỉnh thoảng nhấp một cái, pet màn hình sẽ đáp lại một câu trong bong bóng thoại.

Tiêu đề của cuốn sổ nhỏ là tên của nhân vật hiện tại, ví dụ: **Cuốn sổ nhỏ của Tiểu Erii**, **Cuốn sổ nhỏ của Zero**, không hiển thị số phiên bản. Nhấp chuột thông thường sẽ không mở trang; trên máy tính cũng có thể vào cuốn sổ nhỏ từ phần cài đặt tiện ích. Sau khi tắt "Hiển thị pet màn hình", vẫn có thể mở cuốn sổ nhỏ từ cài đặt tiện ích để xem nhiệm vụ và mở cơ sở dữ liệu; trong thời gian ẩn, các nút hành động giải trí sẽ bị vô hiệu hóa. Khi đang focus vào pet màn hình, phím Enter / Phím cách dùng để tương tác, Shift + Enter để mở cuốn sổ nhỏ, các phím mũi tên để tinh chỉnh vị trí, Home để đặt lại vị trí.

### Thao tác trên điện thoại

Điện thoại không có chuột phải, hãy sử dụng các cách sau:

- Chạm nhẹ hoặc nhấn ngắn: Tương tác;
- Nhấn giữ khoảng nửa giây: Chợp mắt;
- Tiếp tục nhấn giữ khoảng 1.4 giây: Mở cuốn sổ nhỏ;
- Nhấn giữ và di chuyển: Kéo Tiểu Erii.

Khi hộp nhập liệu cao lên, bàn phím hiện ra, xoay màn hình hoặc cửa sổ hẹp lại, pet màn hình sẽ bị giới hạn trong khu vực hiển thị và tránh hộp nhập liệu. Cuốn sổ nhỏ, cửa sổ trò chuyện, sổ tay sinh hoạt và nhà pet màn hình trên điện thoại đều được kéo lên từ dưới cùng màn hình, nhấn giữ phần đầu kéo xuống là có thể đóng lại; trên máy tính, chúng là các cửa sổ nổi có thể kéo thanh tiêu đề, cuốn sổ nhỏ vẫn gắn sát bên cạnh pet màn hình, cố gắng không che khuất nhân vật.

### Phản ứng với nhiệm vụ cơ sở dữ liệu

- Nhận được nhiệm vụ: Giơ cuốn sổ nhỏ lên;
- Đang xử lý nhiệm vụ: Ghi chép;
- Thành công: Hiển thị bản ghi hoàn thành;
- Lỗi hoặc cảnh báo: Kiểm tra bản ghi;
- Rảnh rỗi: Uống trà, đọc sách, gấp giấy, ôm vịt vàng, vươn vai, chợp mắt, v.v.

Ngoài hành động, pet màn hình còn nói một câu phía trên bong bóng nhiệm vụ: sẽ có các bộ thoại riêng cho lúc nhận nhiệm vụ, đang xử lý (khoảng 15 giây đổi một câu), hoàn thành, gặp lỗi, hoặc khi bị bạn dừng lại; lời thoại cho việc điền bảng, thúc đẩy cốt truyện và các nhiệm vụ khác cũng khác nhau. Lời thoại sẽ thay đổi theo tính cách, độ thân thiết và tâm trạng của nhân vật, ví dụ khi đói bụng sẽ lầm bầm một câu rồi mới làm tiếp. Lời thoại hoàn toàn là văn bản cục bộ đã được viết sẵn, không gọi API, không tốn tiền. Dòng chữ nhỏ bên dưới vẫn là tiến độ thực tế do cơ sở dữ liệu cung cấp (Cài đặt bản tóm tắt / bản đầy đủ vẫn giữ nguyên). Bạn có thể tắt lời thoại bằng mục "Nói chuyện khi làm nhiệm vụ" trong phần cài đặt tiện ích.

Khi có lỗi hoặc cảnh báo, bong bóng sẽ dừng lại lâu hơn một chút (khoảng 9 giây) và có thêm một nút **Đi xem thử**: các lỗi liên quan đến API (API, khóa, hạn mức, quá giờ, v.v.) sẽ mở bảng API của cơ sở dữ liệu, các lỗi khác sẽ mở "Nhật ký chạy" trong mục "Công cụ nâng cao".

Phản ứng khi đang xử lý nhiệm vụ và thông báo thành công/lỗi được ưu tiên hơn các hành động giải trí cục bộ. Nếu bong bóng cung cấp nút dừng cho nhiệm vụ gốc của cơ sở dữ liệu, Tiểu Erii sẽ hiển thị **Dừng nhiệm vụ**, nhấp vào sẽ gọi quy trình dừng ban đầu của cơ sở dữ liệu; nếu không có khả năng dừng thì sẽ không làm giả nút. Mục tiêu dừng sẽ bám theo nhiệm vụ hiện tại của cơ sở dữ liệu, kiểm tra lại trước khi nhấp; nếu nhiệm vụ đã chuyển sang cái khác, nó sẽ yêu cầu xác nhận trước, không gọi thao tác của nhiệm vụ cũ. Thông báo dừng thất bại sẽ được giữ lại khoảng 8 giây, thông báo lỗi cơ sở dữ liệu được ưu tiên hiển thị hơn văn bản tiến độ thông thường. Khi bong bóng gốc chuyển sang chuyện cười hoặc thông báo, và tạm thời không có nhiệm vụ hiện tại, Tiểu Erii sẽ hiển thị trạng thái chờ đồng bộ tiến độ, sau khi nhiệm vụ xuất hiện lại sẽ khôi phục nút dừng.

### Ló đầu ở mép màn hình và những câu chuyện chữa lành

- **Cách làm ló đầu:** Kéo Tiểu Erii sang sát mép trái, phải, trên hoặc dưới, thả tay ra cô ấy sẽ thụt vào và ló đầu ra, không cần phải đợi 6 giây hay dời chuột đi. Nếu vị trí mặc định đã sát mép thì cũng sẽ ló đầu ra ngay. Mép dưới sẽ tránh thanh nhập liệu, xuất hiện ở phía dưới khu vực khả dụng.
- **Vị trí có bị đổi không:** Hành động ló đầu chỉ thay đổi tạo hình và khẽ lắc lư tại chỗ, không thay đổi vị trí đã lưu, cũng không khôi phục việc tự đi bộ. Khi nhấp chuột, nhấn giữ, kéo thả, mở cuốn sổ nhỏ hoặc nhận nhiệm vụ sẽ khôi phục lại hành động tương ứng; di chuột qua sẽ không hủy ló đầu. Sau khi kết thúc tương tác, nếu vẫn đang ở sát mép, cô ấy sẽ tiếp tục ló đầu ngay lập tức.
- **Làm sao để nghe kể chuyện:** Nhấp vào "Nghe một câu chuyện nhỏ" trong cuốn sổ nhỏ. Sau khi bong bóng mở ra, cứ mỗi 30 giây sẽ tự động đổi một câu chuyện, luân phiên 12 câu chuyện, không lặp lại trong cùng một vòng; cũng có thể nhấp vào "Đổi câu khác" để đổi ngay, hoặc đóng lại bằng dấu X. Sau khi đóng sẽ kết thúc việc đổi bài liên tục của vòng này.
- **Chủ động kể chuyện:** Bắt đầu sau khi rảnh rỗi khoảng 5 phút; trong lúc đang hiển thị thì đổi bài mỗi 30 giây. Khi trỏ chuột vào hoặc focus bàn phím vào bong bóng sẽ tạm dừng đổi bài, khi dời đi sẽ tiếp tục thời gian còn lại; trên điện thoại, việc chạm vào câu chuyện sẽ giữ lại trạng thái đọc, sau khi đọc xong có thể chủ động đổi câu khác hoặc đóng lại.
- **Ưu tiên nhiệm vụ:** Khi cơ sở dữ liệu bắt đầu xử lý, gửi thông báo kết quả hoặc khi tắt hiển thị Tiểu Erii, câu chuyện sẽ thu lại. Bong bóng nhiệm vụ và nút dừng của nhiệm vụ gốc được ưu tiên; câu chuyện không gọi mô hình trò chuyện, không gửi tin nhắn trò chuyện, cũng không ghi vào cơ sở dữ liệu.
- **Công tắc:** Trong cài đặt tiện ích có thể tắt riêng "Kéo đến mép để ló đầu" và "Kể chuyện nhỏ chữa lành khi rảnh rỗi". Sau khi tắt tính năng kể chuyện tự động khi rảnh rỗi, vẫn có thể bấm thủ công "Nghe một câu chuyện nhỏ", và tính năng tự động đổi câu chuyện mỗi 30 giây vẫn hoạt động bình thường khi mở lên; quy tắc tạm dừng đọc cũng vẫn có hiệu lực.

## Đổi pet màn hình: Nhà pet màn hình

Cách mở: Mục **Nhà pet màn hình** ở cuối cuốn sổ nhỏ, hoặc thông qua nút nhân vật và "Nhà pet màn hình" trong **Cài đặt tiện ích → Pet màn hình cơ sở dữ liệu**. Căn nhà là một cuốn bách khoa toàn thư mở: trang bên trái là ảnh đứng, trang bên phải là hồ sơ nuôi dưỡng nhân vật đó. Nhấp vào các thẻ đánh dấu (bookmark) ở trên cùng để lật sang trang nhân vật khác, nhấn **Để cô ấy ra ngoài** để chuyển đổi, nhân vật cũ sẽ vẫy tay rút lui, người mới sẽ đáp xuống và chào hỏi.

| Nhân vật | Tóm tắt | Ghi chú |
| --- | --- | --- |
| Tiểu Erii (Erii) | Cô phù thủy tóc đỏ trầm lặng, thích vịt vàng nhỏ, bánh pudding và chơi game | Nhân vật mặc định, tài nguyên và hành vi giống như 0.7.1 |
| Zero | Thiếu nữ tóc vàng với đôi mắt xanh băng giá, ít nói, làm việc vô cùng tỉ mỉ, trên đầu có một con thiên nga đen nhỏ | Bản này bổ sung 26 ảnh (19 ảnh chính, 7 ảnh sinh hoạt) |
| Nai Dan | Chú nhóc màu vàng sữa béo ngậy đi kèm cơ sở dữ liệu, tham ăn, thích lăn lộn | Ảnh được đọc từ cơ sở dữ liệu lúc chạy; nếu cơ sở dữ liệu không bật hoặc tắt pet màn hình đi kèm thì không thể chuyển đổi, nhà pet màn hình sẽ ghi rõ lý do |

Sau khi đổi nhân vật:

- **Dùng chung**: Vị trí và kích thước của pet màn hình, các nút bật/tắt, ví tiền chung ở nhà.
- **Tách biệt riêng**: Lịch sử trò chuyện, cách xưng hô và thiết lập nhân vật, độ thân thiết, chỉ số nhu cầu, nhật ký trưởng thành, biệt danh, công việc làm thêm hoặc bữa ăn đang diễn ra.
- Trong lần trò chuyện đầu tiên với nhân vật mới, sẽ dùng lại các cài đặt kết nối của Tiểu Erii (địa chỉ API, mô hình, độ dài phản hồi, v.v.), không cần nhập lại; khóa bảo mật đã lưu trên thiết bị cũng được dùng chung.
- Nhân vật đang đi làm sau khi bị thay ra vẫn sẽ tiếp tục làm việc dưới nền, khi tan làm bong bóng thoại của pet màn hình sẽ nhắc bạn đi nhận lương.

## Nuôi dưỡng

Mọi hệ thống nuôi dưỡng đều không có hình phạt: độ thân thiết chỉ tăng chứ không giảm, chỉ số nhu cầu nếu thấp thì chỉ ảnh hưởng đến tâm trạng và lời thoại, sẽ không sinh bệnh, không bỏ nhà ra đi, cũng không cấm đi làm.

- **Độ thân thiết**: Chia làm năm mức độ: Mới quen, Quen thuộc, Thân thiết, Tin cậy, Yêu thương sâu đậm, mỗi nhân vật tính riêng. Vuốt ve +1 (tối đa 20/ngày), tặng hoa +5 (tối đa 3 lần/ngày), mời ăn cơm +3～+8, nhận lương +3, trò chuyện một lượt +2 (tối đa 20/ngày), lần đầu gặp nhau mỗi ngày +5, cùng bạn hoàn thành một nhiệm vụ cơ sở dữ liệu +2 (tối đa 20/ngày), tắm rửa chải chuốt +2. Mỗi khi lên một mức sẽ mở khóa một bộ lời thoại mới, một câu chuyện nhỏ độc quyền và một danh hiệu.
- **Chỉ số nhu cầu**: Độ no giảm từ đầy xuống rỗng mất khoảng 12 tiếng, độ sạch mất khoảng 24 tiếng, dù bạn không mở máy thì nó cũng sẽ từ từ giảm xuống. Độ no được hồi lại bằng cách mời ăn cơm (Pudding +15, Cơm nắm +25, Cơm cuộn trứng +40, Ramen +50), độ sạch thì bằng cách nhấp vào **Tắm rửa** trong cuốn sổ nhỏ hoặc trong nhà pet màn hình (miễn phí, hồi chiêu 30 phút). Trong phần cài đặt tiện ích có thể tắt các chỉ số nhu cầu này đi, sau khi tắt các con số sẽ bị đóng băng và không hiển thị nữa.
- **Tâm trạng**: Lo lắng (cơ sở dữ liệu vừa báo lỗi), Đói bụng, Muốn tắm rửa, Nhớ bạn (đã lâu không để ý đến cô ấy), Vui vẻ, Bình tĩnh. Tâm trạng chỉ quyết định lời thoại và con dấu tâm trạng trong nhà pet.
- **Nhật ký trưởng thành**: Mục **Nhật ký trưởng thành** trong nhà pet ghi lại các cột mốc, ví dụ ngày đầu quen biết, lần đầu ăn ramen, cùng bạn hoàn thành nhiệm vụ cơ sở dữ liệu lần thứ 100; các câu chuyện nhỏ độc quyền đã mở khóa cũng được đọc ở đây.
- **Biệt danh**: Bấm vào cây bút bên cạnh tên trong nhà pet để đặt biệt danh cho nhân vật, cách xưng hô trên giao diện và lời thoại sẽ thay đổi theo, để trống để khôi phục tên gốc.
- **Lời chào mỗi ngày**: Lần gặp gỡ đầu tiên mỗi ngày, pet màn hình sẽ chào hỏi tùy theo buổi sáng, trưa, tối và mức độ thân thiết của hai bạn, đồng thời ghi nhận một ngày "Số ngày đồng hành".
- **Trợ cấp cơ bản**: Khi ví tiền chung ở nhà còn ít hơn 5 tiền vàng, mỗi ngày có thể vào Sổ tay sinh hoạt để nhận 8 tiền vàng một lần, vừa đủ để mua một phần cơm nắm.

Đối với người dùng cũ khi nâng cấp, Tiểu Erii sẽ dựa vào số lần trò chuyện, đi làm và ăn cơm hiện có để quy đổi ra một lượng độ thân thiết ban đầu (tối đa đến mức "Quen thuộc"), "Ngày đầu gặp gỡ" sẽ lấy theo bản ghi trò chuyện hoặc sổ tay nhỏ sớm nhất.

## Phím tắt mở bảng cơ sở dữ liệu

Trong mục "Cơ sở dữ liệu" của cuốn sổ nhỏ có một nhóm phím tắt: **Mở cơ sở dữ liệu gốc** (Bảng điều khiển), **Bàn làm việc điền bảng**, **Thúc đẩy cốt truyện**, **Quản lý dữ liệu**, **API**, **Xem bảng** (Bảng trực quan của cơ sở dữ liệu). Trong thanh nhiệm vụ của cửa sổ trò chuyện và sổ tay sinh hoạt cũng có nút **Mở cơ sở dữ liệu**.

Việc mở cơ sở dữ liệu dùng hàm `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()` công khai của nó; nhảy đến một bảng chỉ định tương đương với việc nó nhấp giúp bạn vào mục đó trên thanh bên, chỉ đổi trang chứ không đọc/ghi bảng biểu, không gọi thao tác nhiệm vụ. Nếu một bảng nào đó không được hiển thị trong phiên bản cơ sở dữ liệu hiện tại của bạn, nút bấm sẽ chỉ mở cơ sở dữ liệu và ghi rõ lý do; khi không tìm thấy lối vào cơ sở dữ liệu, cuốn sổ nhỏ sẽ nhắc bạn bật cơ sở dữ liệu lên trước.

## Ngoại hình và Hiệu ứng

Giao diện mang phong cách "Sổ tay bìa cứng": vân giấy, viền ép kim, băng dính washi và con dấu, ba nhân vật có ba bộ màu sắc riêng. Mục **Hiệu ứng** trong cài đặt tiện ích có bốn mức: Tự động (Màn hình PC thì rực rỡ, điện thoại thì đơn giản), Rực rỡ, Đơn giản, Tắt. Mức "Rực rỡ" sẽ rải cánh hoa, bông tuyết hoặc ngôi sao khi tặng hoa, thăng cấp, hoặc đổi nhân vật, trang ảnh đứng của nhà pet màn hình cũng có dải ánh sáng lấp lánh chầm chậm chảy qua; mức "Đơn giản" chỉ giữ lại một lượng nhỏ hạt phân tử (particles); nếu hệ thống bật "giảm chuyển động động", hiệu ứng sẽ tự động tắt. Khi chuyển trang sang chạy ngầm hoặc đóng bảng điều khiển, mọi hình ảnh động sẽ dừng lại.

## Đi làm, Kiếm tiền và Ăn cơm

Nhấp chuột phải trên PC / nhấn giữ trên điện thoại để mở cuốn sổ nhỏ, chọn **Sổ tay sinh hoạt**; cũng có thể mở từ phần cài đặt tiện ích. Trên đỉnh cửa sổ có thể chọn cho ai đi làm: ví tiền là "ví tiền chung của nhà" dùng chung cho mọi nhân vật, còn việc đi làm và ăn cơm thì tính riêng cho từng người, các nhân vật có thể đi đến những chỗ khác nhau cùng một lúc.

### Công việc và Tiền lương

| Công việc | Nhiệm vụ | Thời gian | Lương |
| --- | --- | --- | --- |
| Tiệm sách | Đặt sách mới lên kệ | 1 Phút | 10 Tiền vàng |
| Tiệm tráng miệng | Phụ chuẩn bị đồ ngọt | 2 Phút | 18 Tiền vàng |
| Tiệm hoa | Sắp xếp bó hoa, thay nước | 3 Phút | 25 Tiền vàng |

1. Chọn công việc trong phần **Đi làm**. Mỗi lần chỉ thực hiện một hoạt động.
2. Sổ tay và bong bóng thoại sẽ đếm ngược thời gian còn lại, pet màn hình thay trang phục làm việc và khẽ hô hấp tại chỗ.
3. Khi làm xong, nhấp **Nhận tiền lương**. Bạn cũng có thể đóng sổ tay đi và nhận trực tiếp từ bong bóng thoại lúc tan làm.
4. Mỗi nhân vật phải nhận lương xong thì mới được làm tiếp hoặc mua đồ ăn. Lương chưa nhận sẽ được giữ mãi, không có kỳ hạn.

Tính năng **Tan làm sớm** yêu cầu xác nhận thêm một lần nữa: dừng công việc đang làm, không có lương nhưng cũng không bị trừ tiền. Các công việc đã hoàn thành sẽ được nhận ngay, không thể bấm nhầm hủy bỏ.

### Mời pet ăn cơm

| Thức ăn | Giá | Thời gian ăn |
| --- | --- | --- |
| Pudding | 5 Tiền vàng | 8 Giây |
| Cơm nắm | 8 Tiền vàng | 9 Giây |
| Cơm cuộn trứng | 15 Tiền vàng | 10 Giây |
| Ramen | 20 Tiền vàng | 12 Giây |

Mua đồ trong phần **Ăn chút đồ ngon**, sau khi xác nhận sẽ trừ tiền vàng và bắt đầu ăn, ăn xong độ no sẽ tăng. Nếu số dư không đủ hoặc đang có hoạt động khác diễn ra, nút mua sẽ bị vô hiệu hóa. Ăn xong sẽ được ghi vào cuốn sổ tay nhỏ; bốn món đồ ăn sử dụng bốn ảnh khác nhau: Pudding dùng thìa nhỏ ăn, Cơm nắm cầm bằng tay, Cơm cuộn trứng xúc bằng thìa to, Ramen gắp bằng đũa. Các thẻ gọi món, tranh minh họa trên sổ tay và ảnh pet màn hình nổi đều đồng nhất hình ảnh. Không có chỉ số đói khát, không có hình phạt nếu bị đói hay ép ăn.

### Lưu trữ và Nhiệm vụ Cơ sở dữ liệu

- Ví tiền khởi điểm có 0 tiền vàng. Công việc do bạn tự tay bắt đầu, sẽ không có chuyện tự động nhận việc tiếp theo hay treo máy kiếm tiền vô hạn; khi sắp hết tiền có thể đi nhận trợ cấp một lần.
- Tiền vàng, hoạt động hiện tại, tổng số lần đi làm/ăn cơm và 20 bản ghi sổ tay gần nhất sẽ được lưu trong phần cài đặt tiện ích của tài khoản Tavern hiện tại.
- Công việc đã bắt đầu sẽ tính giờ theo thời gian trên thiết bị. Việc đóng cửa sổ, tải lại trang hay tạm thời rời đi đều không ảnh hưởng, lúc về thời gian vẫn chạy tiếp, hoặc hiện trạng thái chờ nhận lương; khi offline mà ăn xong thì cũng chỉ tính tiền một lần chứ không trừ tiền nhiều lần.
- Khi nhiệm vụ cơ sở dữ liệu xuất hiện, các hành động, bong bóng thoại và nút dừng của nhiệm vụ gốc được ưu tiên hiển thị trước; sổ tay sinh hoạt cũng cung cấp tính năng dừng cơ sở dữ liệu gốc. Đồng hồ đếm ngược công việc vẫn chạy bình thường, đợi nhiệm vụ cơ sở dữ liệu kết thúc rồi mới bắt đầu công việc mới hoặc mua cơm.
- Cửa sổ trò chuyện, sổ tay sinh hoạt, nhà pet màn hình và cuốn sổ nhỏ được tách biệt với nhau. Trò chơi sinh hoạt không gọi API, cũng không ghi đè vào cơ sở dữ liệu hay văn bản trò chuyện Tavern. Tính năng tự di chuyển vẫn không được khôi phục.
- Đây chỉ là lối chơi nhẹ nhàng cho từng tài khoản một để ngăn việc lặp lại nhận lương / trừ tiền trên một trang; không có dịch vụ giao dịch ví tiền xuyên thiết bị.

## Trò chuyện cùng pet màn hình

Mỗi nhân vật có riêng lịch sử trò chuyện, cách xưng hô và thiết lập, chuyển đổi nhân vật sẽ không bị lẫn lộn dữ liệu. Thiết lập của Zero được soạn theo tính cách nguyên tác của "Long Tộc", còn Nai Dan là cậu bạn đồng hành háu ăn đầy sức sống (Mối quan hệ mặc định là "Bạn đồng hành"), bạn có thể tự điều chỉnh theo ý hiểu của mình trong mục `characters/`.

1. Nhấp chuột phải vào pet màn hình (PC), hoặc nhấn giữ khoảng 1.4 giây (điện thoại) để mở cuốn sổ nhỏ, nhấn vào **Trò chuyện cùng Tiểu Erii** (khi đổi sang Zero hay Nai Dan, nút bấm sẽ đổi tên theo). Bạn cũng có thể mở trực tiếp cửa sổ trò chuyện trong Cài đặt tiện ích.
2. Mặc định sẽ **Dùng API hiện tại của Tavern**, sử dụng kết nối, mô hình và các khóa hiện tại. Hãy cấu hình sẵn kết nối hoàn thành trò chuyện (chat completion) hoặc hoàn thành văn bản (text completion) hoạt động tốt trên Tavern.
3. Nhập tin nhắn và nhấp **Gửi**. Trên PC, nhấn Enter để gửi, Shift+Enter để xuống dòng; trên điện thoại dùng phím Return để xuống dòng, nút Gửi để đẩy tin nhắn lên.
4. **Dừng phản hồi** hủy bỏ yêu cầu lần này của Tiểu Erii; **Thử lại** gửi lại nội dung trò chuyện chưa nhận được phản hồi. Việc đóng cửa sổ hay tắt tiện ích cũng sẽ hủy các yêu cầu trò chuyện chưa xong.
5. Nhấp vào **Cài đặt kết nối**, bạn có thể tùy chỉnh danh xưng, quan hệ, phong cách trò chuyện, độ dài câu trả lời và những việc muốn cô ấy nhớ, hoặc chuyển sang phần **Cấu hình API riêng (Tương thích OpenAI)**.

### Cấu hình API riêng

Điền URL cơ sở (Base URL) API (ví dụ: `https://api.cua.ban/v1`) và Khóa (Key), nhấp **Lấy danh sách mô hình**, chọn trong danh sách **Mô hình khả dụng**, rồi xem lại mục **Tên mô hình** bên dưới trước khi nhấp **Lưu cài đặt**.

Bạn vẫn có thể nhập tay tên mô hình; một số giao diện không cung cấp danh sách mô hình, việc không lấy được danh sách chưa chắc là do kết nối trò chuyện không khả dụng. Trong quá trình lấy danh sách, có thể nhấn **Hủy lấy**. Thay đổi URL hoặc Khóa sẽ tự hủy các yêu cầu cũ và xóa danh sách cũ; việc đóng cửa sổ hoặc vô hiệu hóa tiện ích cũng sẽ hủy yêu cầu đang gọi. Danh sách sẽ lọc bỏ các ID mô hình trùng lặp và sắp xếp lại, việc chọn mô hình trong danh sách này sẽ không làm thay đổi thiết lập mô hình toàn cục của Tavern.

Chế độ **Sử dụng API hiện tại của Tavern** sẽ bám sát vào mô hình mà Tavern đang chọn; còn khi bạn muốn lựa chọn riêng, hãy chuyển sang chế độ **Cấu hình API riêng**.

Hệ thống sẽ tự động nhận diện URL cơ sở nếu bạn đã điền sẵn đường dẫn hoàn chỉnh kết thúc bằng `/chat/completions`. Phần kết nối riêng này hỗ trợ các giao diện API hoàn thành trò chuyện tương thích chuẩn OpenAI; bạn vẫn có thể dùng giao diện gốc của Claude / Gemini thông qua hệ thống kết nối hiện tại của Tavern.

Yêu cầu sẽ được chuyển tiếp qua thiết bị đang chạy Tavern, trình duyệt chỉ kết nối duy nhất vào Tavern. Nếu bạn điền `localhost`, nó sẽ được hiểu là cái thiết bị đang chạy Tavern. Nút **Kiểm tra kết nối** sẽ phát đi một yêu cầu siêu ngắn, có thể tốn phí; nội dung đoạn test này sẽ không bị ném vào lịch sử trò chuyện.

Khóa API theo thiết lập mặc định sẽ chỉ hoạt động trong lần chạy tiện ích hiện tại, tải lại trang sẽ phải điền lại. Tích chọn **Ghi nhớ khóa trên thiết bị này** sẽ lưu vào bộ nhớ trình duyệt; bỏ chọn và lưu lại sẽ xóa khóa. Khóa sẽ không bị ghi vào cài đặt tiện ích, prompt trò chuyện hay gói cài đặt.

### Thao tác tin nhắn và bản nháp

- **Sao chép**: Mọi tin nhắn đều có thể sao chép. Dù trình duyệt chặn việc tự động sao chép thì bạn vẫn có thể bôi đen văn bản để copy tay.
- **Trả lời lại**: Nằm ở phía dưới cùng của phản hồi thành công cuối cùng, dùng để trả lời lại cùng một câu hỏi. Cần đợi phản hồi mới thành công xong thì mới thế chỗ câu cũ; nếu hủy bỏ hoặc báo lỗi thì nội dung gốc vẫn được giữ lại. Sẽ không lưu lại nhiều nhánh câu trả lời phụ.
- **Sửa rồi gửi lại**: Cho phép sửa tin nhắn cuối cùng của bạn, rồi bắt nó tạo lại một vòng câu trả lời khác. Cũng cần phải thành công xong thì mới thế chỗ bản ghi gốc. Bấm vào "Hủy chỉnh sửa" sẽ quay trở về cái bản nháp trước lúc sửa.
- **Lưu bản nháp**: Các bản nháp bình thường và bản nháp đang chỉnh sửa dở đều sẽ được lưu lại. Cho dù đóng cửa sổ mở lại hay làm mới trang web thì bạn vẫn có thể viết tiếp.
- **Xuất dữ liệu**: Xuất lịch sử trò chuyện hiện tại thành tệp TXT, bao gồm danh xưng, nội dung tin nhắn và thời gian đã có, không bao gồm cấu hình kết nối, mã khóa hay ký ức tự điền.
- **Xóa bản ghi**: Cần phải bấm xác nhận thêm lần nữa. Hành động xóa chat sẽ không xóa thiết lập kết nối và ký ức điền tay; 2 mục đó phải tự sửa trong phần Cài đặt kết nối.

Tin nhắn sẽ hiện rõ avatar và mốc thời gian; những đoạn nhắn từ phiên bản cũ không có thời gian cũng không sao, nó vẫn đọc được và sẽ không tự chế ra cái mốc thời gian giả tạo nào. Lúc chờ API, nó sẽ hiện "Erii đang soạn hồi âm", tới lúc nhận xong thì bung ra đầy đủ luôn; ở phiên bản này, câu trả lời vẫn không phải dạng luồng (non-streaming).

Lúc lật xem lại tin nhắn cũ, có câu trả lời mới xuất hiện nó cũng sẽ không tự động cuộn tuột xuống đáy đâu, phải bấm "Quay lại tin nhắn mới nhất" thì nó mới xuống. PC thì kéo cái thanh tiêu đề ↔ để giãn cửa sổ ra, còn kéo đi đâu cũng được; điện thoại thì phần gõ chữ sẽ tự động phình to lên tới giới hạn nhất định, đồng thời còn phải chừa chỗ cho cái bàn phím ảo nhảy lên nữa.

Khi lịch sử trống trơn, ba nút bấm chủ đề sẽ chỉ điền chữ vào ô nháp thôi, bạn phải bấm nút Gửi nó mới đi, không có vụ tự gửi luôn đâu.

### Phong cách trò chuyện và ký ức thủ công

Bạn có thể chỉnh trong phần **Cài đặt kết nối → Bạn và Tiểu Erii**:

- **Trò chuyện tự nhiên**: Độ dài dài ngắn là tùy vào chủ đề, chú tâm vào việc hồi đáp nội dung chi tiết.
- **Bầu bạn ngắn gọn**: Thường chỉ một đến ba câu, hạn chế lan man sang mấy thứ chả liên quan.
- **Giao tiếp chi tiết**: Lúc nghiêm túc hỏi thăm thì sẽ trả lời đẩy đủ, còn giao tiếp thường ngày thì vẫn tự nhiên.
- **Mong Tiểu Erii ghi nhớ**: Tối đa 2000 ký tự, có thể ghi thói quen gọi nhau, sở thích hay tình hình dạo này, sau khi lưu thì lần nào yêu cầu nó cũng đính kèm theo, bạn có thể sửa hay xóa bất cứ lúc nào.

Mấy cái này là dữ liệu bạn tự cập nhật bằng tay, nó không tự chiết xuất từ khung chat ra đâu, cũng không gọi model đi tóm tắt chi cho tốn tiền, và dĩ nhiên là nó cũng chả thèm ngó ngàng tới cơ sở dữ liệu hay mấy cái khung văn bản của Tavern đâu. Phong cách được truyền đạt qua câu lệnh prompt, còn trả lời thế nào thì lại phải xem cái model kia; còn "Giới hạn độ dài câu trả lời" thì vẫn dùng để gò cái đầu ra cho chuẩn.

### Lệnh prompt và bản ghi

Câu lệnh prompt tích hợp sẵn đã được nhào nặn lại từ cái preset của Erii do người dùng tạo (như mục `opt_mode_chat`, tính cách và khí chất, v.v...), mặc định là quan hệ người yêu, bạn có thể tự chỉnh lại thành bạn bè hay quan hệ nào khác cũng được. Dùng toàn bộ bằng văn bản thuần, không cần phải bấu víu vào macro preset của Tavern, sách thế giới, regex hay kịch bản sổ truyện (storybook script). Tệp bảo trì ở đây là `chat-prompt.js`.

Lịch sử trò chuyện được cất vào một xó riêng trong phần cấu hình cài đặt cho cái tài khoản Tavern đó, sức chứa tối đa là 100 dòng, tầm đâu cỡ 128000 chữ. Mỗi lần xin yêu cầu thì nó kẹp thêm cỡ 40 dòng chat gần nhất, khoảng 24000 chữ; nó sẽ không tự động ôm đồm thêm văn bản từ Tavern, thẻ nhân vật, sách thế giới hay bảng dữ liệu gì đâu. **Xóa bản ghi** bắt buộc phải ấn lần nữa để xác nhận.

Cửa sổ chat hiển thị tách biệt luôn, trên PC thì túm thanh tiêu đề kéo đi đâu cũng được, điện thoại thì nó sẽ tự co giãn lấp đầy màn hình. Lúc chờ nó phản hồi, Tiểu Erii sẽ làm hành động ghi chép tại chỗ, nhận được tin thì sẽ vẫy tay chào; lúc chat thì tạm thời dẹp vụ tự động kể chuyện sang một bên. Nhiệm vụ cơ sở dữ liệu sẽ hiển thị ở ngay phía trên cửa sổ trò chuyện và có hẳn cái nút **Dừng nhiệm vụ** độc lập.

### Phạm vi của API hiện tại

- Kết nối hoàn thành trò chuyện (chat completion) của Tavern: Dùng nguyên nhà cung cấp, mô hình và khóa Backend của nó hiện tại, kể cả mấy nguồn kiểu Claude, Gemini, OpenRouter mà Tavern đang cấu hình; ở bản này, câu trả lời vẫn không phải dạng luồng, và sẽ hiện trạng thái lúc đang chờ.
- Kết nối hoàn thành văn bản `textgenerationwebui` của Tavern: Sử dụng trình tạo tham số nguyên bản và backend tương ứng.
- Hiện chưa hỗ trợ trò chuyện độc lập cho các kết nối Kobold, Horde, NovelAI, nếu dính phải nó sẽ nhắc thẳng là phải đổi kết nối hoặc phải xài cài đặt riêng.
- 1.14.0 thì tận dụng luôn cái tính năng yêu cầu ẩn (quiet request) độc lập có sẵn của nó; giới hạn độ dài đầu ra bám theo thiết lập hiện thời của Tavern. Từ 1.15.0-1.19.0 thì copy cái trình tạo tham số ra xài, bạn có thể chỉnh độ dài câu trả lời riêng cho Tiểu Erii mà chả ảnh hưởng gì đến thiết lập chung của Tavern cả.

## Bảo trì cơ sở dữ liệu (Chế độ bảo trì của cửa sổ trò chuyện)

Lúc điền bảng bị lỗi, hoặc bảng biểu và cốt truyện không khớp, bạn có thể gọi pet màn hình ra kiểm tra xem.

1. Bật cửa sổ trò chuyện lên, bấm vào cái chữ **Bảo trì cơ sở dữ liệu** ở trên đỉnh (bấm lại vào **Trò chuyện** để quay về như cũ; dữ liệu của 2 bên lưu riêng, mấy thông tin bảo trì sẽ chả dính vô cuộc sống đời thường của bạn đâu).
2. Phía trên cửa sổ sẽ ghi rõ lần này nó ngó được những gì: **Toàn bộ bảng biểu**, **Mấy tầng văn bản gần đây** (bấm vào để chọn từ 0-10, mặc định là 3 tầng) và **Mấy cái lỗi gần đây** (thông báo lỗi/cảnh báo từ cơ sở dữ liệu bay qua, tối đa là 5 thông báo).
3. Cứ thẳng thắn nói ra chỗ sai ở đâu, không thì ấn **Kiểm tra giúp tôi**. Nó sẽ lấy cái ngữ khí riêng của nó để kể lại nó thấy gì; nếu phải sửa, bên dưới câu trả lời của nó sẽ đi kèm theo một **Danh sách sửa đổi**.
4. Trong đó, mỗi cái mục sửa đổi đều ghi rõ nằm ở chỗ nào (bảng nào, hàng thứ mấy, cột nào), giá trị cũ -> giá trị mới, và luôn cả lý do vì sao. Lúc đầu **mặc định là không chọn mục nào hết**. Những mục nào đối chiếu thấy fail (ghi sai tên bảng, sai cột, hàng lặn đâu mất tiêu, giá trị mới với cũ như nhau, đụng độ (conflict) với mục khác) sẽ bị chú thích lý do và bị mờ đi không cho chọn.
5. Đánh dấu mấy mục bạn cần, rồi ấn **Áp dụng mục đã chọn (N mục)**. Trước khi ghi vào, nó sẽ sao lưu toàn bộ cái bảng đó; sau đó sẽ nạp theo thứ tự: "sửa dòng có sẵn -> xóa dòng -> thêm dòng -> chuyển đổi preset thúc đẩy cốt truyện -> điền bảng lại", mục nào làm xong hay báo lỗi đều được hiển thị kết quả.
6. Sau khi nạp xong xuôi, bạn có thể ấn **Hoàn tác**, lôi cái bảng về lại như lúc chưa đụng vào (kể cả preset cốt truyện đã chuyển cũng sẽ kéo về luôn); hoặc bạn có thể **Tải bản sao lưu về** dưới định dạng JSON.

Những việc mà Danh sách sửa đổi làm được:

- **Sửa ô**, **sửa cả dòng**, **thêm dòng**, **xóa dòng**: Dùng thẳng qua giao diện công khai `updateCell`, `updateRow`, `insertRow`, `deleteRow` để ghi vào, nó y hệt như lúc bạn sửa bảng bằng tay bên trong cơ sở dữ liệu. Mấy cái dòng, cột hay ô đang bị khóa sẽ bị cơ sở dữ liệu đá văng ra, phần mềm sẽ hiện đúng trạng thái "chưa được nạp vào".
- **Chuyển preset cốt truyện**: Giúp chuyển đoạn chat hiện tại sang một cái preset cốt truyện khác đã có sẵn (`switchPlotPreset`).
- **Điền bảng lại**: Ép cơ sở dữ liệu điền bảng một lần nữa dựa theo cái cài đặt hiện tại của nó (`manualUpdate`). Tính năng này sẽ kích hoạt cái API điền bảng mà bạn đã cài bên trong cơ sở dữ liệu, có tính tiền y như lúc bạn điền bảng bình thường.

Để còn nước cứu vãn, có mấy món cố tình không được cài vào:

- **Không sửa nội dung của preset cốt truyện, cũng không lưu bản phụ.** Giao diện nhập preset của cơ sở dữ liệu sẽ vô tình kéo theo cuộc hội thoại hiện tại vào "Chế độ triệu hồi LLM" (LLM Recall), mà cái giao diện công khai của nó thì không có nút xóa hay trả về chế độ cũ, nên nạp vô rồi là khỏi hoàn tác. Nếu muốn sửa thì pet màn hình sẽ nói cho bạn biết trong tin nhắn, bạn tự qua bên trang **Thúc đẩy cốt truyện** của cơ sở dữ liệu mà sửa bằng tay (Trên cuốn sổ nhỏ có luôn nút bấm bay tới thẳng).
- Không đề xuất vụ xóa bay cả cái bảng, xóa sạch dữ liệu hay nạp lại với số lượng lớn; một cái danh sách sửa chữa giới hạn nhiều nhất là 12 mục thôi.
- Không tự động nạp vô, bạn không ấn thì nó chả bao giờ tự ghi.

Chính sách bảo vệ an toàn:

- Mỗi mục trước khi được nạp vô đều sẽ được đối chiếu lại một lần: Cái ô này đã bị thay đổi trước khi bạn xác nhận rồi, hoặc cái dòng này mất tiêu luôn rồi, thì khỏi nạp, ghi thẳng lý do. Hàng được tra bằng `row_id` của cơ sở dữ liệu, nên vụ xóa dòng hay thêm dòng sẽ không khiến những mục phía sau sửa nhầm.
- Chỉ cho phép áp dụng và hoàn tác trên cái đoạn chat mà cái danh sách đó được đẻ ra; nếu bạn đổi qua phòng chat khác thì hệ thống sẽ từ chối cái lệnh hoàn tác.
- Lúc bấm hoàn tác, nếu nó phát hiện cái bảng đã bị chỉnh sửa sau lần ghi đó (ví dụ như cơ sở dữ liệu tự nhiên nó nhảy ra điền bảng một lần nữa), nó sẽ cảnh báo ngay: "Hoàn tác sẽ kéo theo mấy cái thay đổi mới này lùi về theo luôn đó", bạn bấm **Vẫn muốn hoàn tác** thì nó mới chịu thực thi.
- Sao lưu sẽ được giấu vào trong trình duyệt của thiết bị này luôn (IndexedDB), một máy tính giữ lại được tối đa 10 bản mới nhất, bấm F5 load lại trang thì vẫn hoàn tác được. Nếu trình duyệt chặn không cho lưu cục bộ, hệ thống sẽ chỉ giữ lại trong lần mở trang này thôi, nó sẽ hiện thông báo khuyên bạn nên tải một bản nháp về máy.
- Trong lúc cơ sở dữ liệu bận bịu, nút **Áp dụng mục đã chọn** sẽ tối màu, đợi nó rảnh tay rồi tính.

Quá trình kiểm tra sẽ kẹp cái bảng, mớ lỗi gần đây với những tầng văn bản chat mà bạn chọn quăng luôn cho kết nối API của pet màn hình (Cái giao diện cài đặt ngay ở tab **Cài đặt kết nối** trong khung trò chuyện). Bảng biểu mà dài quá là nó tự hớt bớt phần mào đầu ở bảng nào dài nhất, rồi nó còn để lại dòng ghi chú báo hiệu luôn.

## Quan sát trò chuyện

Bật cái này lên, con pet nó sẽ kiểu như đang chầu chực kế bên coi bạn diễn, lâu lâu quăng ra một hai câu review.

- Vào **Cài đặt tiện ích → Quan sát & Bảo trì** bật **Quan sát trò chuyện** lên (Mặc định nó bị tắt). Sau đó lựa chọn **Tần suất bình luận** (Từ 1-20 tầng, mặc định là 4 tầng).
- Nó chỉ đếm mấy cái tầng chat mới sinh ra sau khi bật thôi: Lướt sang khung chat khác là nó đếm lại từ đầu, bạn có lỡ tay xóa cũng không bị trừ bớt, bạn có lướt lên bắt nó tạo lại (chưa sinh thêm tầng mới) thì nó chả tính đâu. Mấy tầng chat bị ẩn đi là nó mù luôn, cũng không coi được gì hết.
- Sau khi đã đủ target, phải chờ nhân vật thả câu xong thì 4 giây sau nó mới quyết định bình phẩm; cách mỗi lần sủa phải cách nhau tầm 60 giây. Đợt nào mà dữ liệu nó đang điền bảng thì nó sẽ nén thêm tầm 30 giây nữa, mà đang bận tối tăm mặt mũi thì nó nhịn không bình phẩm, để tầng tới nói luôn.
- Những lời nhận xét của nó sẽ nhảy ngay trên bong bóng thoại (đi kèm nút **Trả lời cô ấy/nó**), cái này cũng sẽ được ghi luôn vào lịch sử chat cá nhân dưới tư cách "người quan sát". Bấm vô là mở thẳng cửa sổ chat để nhắn lại luôn.
- Bất kể bạn rep, xoa đầu nó hay tặng hoa thì cũng coi như là đã phản hồi. Liên tục 3 câu chả ai thèm nghía, thì tâm trạng nó chuyển sang "Tủi thân" liền; tới lúc cất lời tiếp theo nó sẽ rụt rè hỏi thăm xem bạn có đang kẹt lịch không——không chửi rủa, không hối thúc, mà một tiếng đồng hồ nó chỉ dám hỏi một lần.
- Cứ mỗi lần mỏ nó nhấp nháy là coi như request gọi thông qua mạng của nhân vật; nếu lỗi API là nó chịu chết chứ không spam lại, trong menu cài đặt sẽ thảy lỗi hôm đó.

## Bong bóng nhiệm vụ: Bản tóm tắt và Bản đầy đủ

Trong **Cài đặt tiện ích → Tiểu Erii · Pet màn hình cơ sở dữ liệu → Hiển thị nội dung nhiệm vụ**, hãy chọn:

- **Bản tóm tắt (Mặc định)**: Ví dụ "Đang cập nhật thủ công…".
- **Bản đầy đủ (Nội dung công việc thực tế)**: Hiển thị tên nhiệm vụ ban đầu và `detail` (chi tiết) đầy đủ, ví dụ "Cập nhật thủ công / Đợt 1/4 · Gọi AI (Lần thử thứ 1/3)". Giữ nguyên ngắt dòng ban đầu, nội dung dài có thể cuộn, nút dừng vẫn thao tác được bình thường.

Lựa chọn này sẽ được lưu lại, và áp dụng đồng thời cho bong bóng của pet màn hình lẫn thanh nhiệm vụ trong cửa sổ trò chuyện. Nội dung nhiệm vụ đọc trực tiếp `feature` và `detail` từ giao diện gốc của cơ sở dữ liệu; không đoán mò phần trăm, số đợt hay số lần thử lại. Khi thanh cuộn của cơ sở dữ liệu không có nhiệm vụ nào, nó sẽ hiển thị trạng thái đang đợi đồng bộ tiến độ.

## Giới hạn đồng bộ cơ sở dữ liệu

Bình thường tiện ích này chỉ đọc trạng thái nhiệm vụ được cung cấp trên giao diện hiện tại của cơ sở dữ liệu, văn bản nhiệm vụ đang hiển thị và thông báo kết quả:

- Không sao chép plugin cơ sở dữ liệu;
- Không thay thế lối vào cơ sở dữ liệu;
- Không sửa đổi văn bản trò chuyện trong Tavern, thiết lập API toàn cục của Tavern hay các nút nhiệm vụ của cơ sở dữ liệu; lịch sử trò chuyện và cài đặt kết nối của Tiểu Erii được lưu riêng;
- Bảng biểu của cơ sở dữ liệu chỉ bị thay đổi khi ở chế độ bảo trì, và sau khi bạn tích chọn từng mục rồi nhấn "Áp dụng mục đã chọn", hơn nữa chỉ dùng `AutoCardUpdaterAPI` công khai, sao lưu toàn bộ trước khi ghi; preset thúc đẩy cốt truyện chỉ thực hiện chuyển đổi, không sửa nội dung của nó;
- Văn bản của Tavern chỉ được đọc khi ở chế độ bảo trì (kèm theo một vài tầng gần nhất) và khi bạn bật tính năng quan sát trò chuyện, nội dung đó cũng chỉ được gửi đến API dành riêng cho trò chuyện của pet màn hình;
- Không gọi điều khiển hành động của Nai Dan (pet gốc của cơ sở dữ liệu); ảnh của Nai Dan chỉ được đọc lúc runtime khi cơ sở dữ liệu đã tải xong hình ảnh, không đi sao chép hay phát tán lại;
- Cuốn sổ nhỏ lưu lại phần văn bản nhiệm vụ quan sát được gần đây nhất, những bản ghi này không đồng nghĩa với toàn bộ danh sách các nhiệm vụ đang chạy; nút dừng chỉ ăn khớp với nhiệm vụ mà cơ sở dữ liệu đang hiển thị ra ngoài;
- Khi không có số liệu phần trăm thực, nó sẽ hiện luôn cái dòng tiến độ gốc của cơ sở dữ liệu;
- Tính năng mở trang chỉ là mở cái giao diện cơ sở dữ liệu, nhảy sang cái trang cần mở, chứ không đọc ghi bảng, cũng chả gọi thao tác nhiệm vụ.

Hiện tại đang tương thích với cấu trúc giao diện sẵn có của cơ sở dữ liệu `naiv1`. Nếu tương lai cơ sở dữ liệu có chỉnh sửa cấu trúc giao diện như `DeskPetLayer`, `DeskPet` hay `NoticeBubble`, Tiểu Erii có thể thông báo "Giao diện cơ sở dữ liệu không tương thích", và nó sẽ bảo toàn cho cái hiển thị pet màn hình gốc của cơ sở dữ liệu.

Khuyến nghị nên duy trì việc hiển thị con Nai Dan gốc lẫn bong bóng nhiệm vụ trong phần cài đặt của cơ sở dữ liệu, rồi sau đó vào cài đặt tiện ích này ẩn chúng đi. Chữ "ẩn" ở đây chỉ là che đi cái phần hiển thị, không gỡ bỏ cơ sở dữ liệu, cũng không cắt đứt nguồn cấp dữ liệu.

## Thông báo về Xem trước cục bộ và Trả lời lặp lại

Trong phiên bản v0.6.0, tính năng xem trước độc lập (standalone preview) từng bị chặn lại để gửi một mẫu cố định, khiến cho tin nhắn khác nhau cũng chỉ nhận được cùng một câu trả lời, và kiểm tra kết nối cũng chỉ là giả lập kết quả. Vấn đề này đã được khắc phục ở phần xem trước của bản v0.6.1; gói cài đặt chính thức luôn lấy phản hồi thật qua API.

Bản xem trước mặc định của phiên bản mới cần bạn phải tự điền API của riêng mình vào Cài đặt kết nối, để lấy danh sách mô hình, test kết nối và nhắn tin nó mới gọi API thật. Giao diện trang độc lập thì chịu chết không đọc được thông số kết nối của Tavern; chỉ khi đã cài tiện ích vô rồi mới có thể kế thừa API mặc định của Tavern. Giao diện sẽ đính mác **Xem trước độc lập · Cấu hình API riêng là có thể trò chuyện thật**.

Chỉ có tự nguyện xài thêm cái đuôi `demo=1` ở link Demo thì mới thấy được mẫu test. Giao diện sẽ thông báo rành rọt "Chế độ xem trước", cái phần Demo với Xem trước thực tế là hai mục riêng biệt chả ai đụng ai, phần dữ liệu demo cũ mềm không có len lỏi vào lịch sử trò chuyện được. Lỗi giao diện thì nó cũng nổ thông báo lỗi, chả nhét đại một cái mẫu thoại vô tri đâu.

Cái xem trước trên máy dùng cục bộ này chạy qua `work/erii_preview_server.mjs` hốt hết request rồi đẩy lại trong localhost; nó chả được kẹp vô cục cài đặt đâu. Bản cài trong Tavern thì dùng xài luôn cái backend của Tavern, khỏi cần tốn công boot thêm cái server xem trước rách việc này nữa.

## Toàn bộ lịch sử phiên bản

Phiên bản được sắp xếp theo thời gian từ mới nhất đến cũ nhất. Hành vi của phiên bản mới nhất sẽ lấy theo mục ở trên cùng.

### v0.9.0 · Chế độ bảo trì & Quan sát trò chuyện (Hiện tại)

- Cửa sổ trò chuyện thêm nút chuyển đổi **Trò chuyện / Bảo trì cơ sở dữ liệu**. Khi bảo trì, pet màn hình đọc bảng, các lỗi gần đây và 0～10 tầng văn bản gần nhất (có thể chỉnh), đưa ra danh sách sửa đổi; người dùng phải đánh dấu và xác nhận từng mục, việc ghi chỉ dùng API công khai của cơ sở dữ liệu, sao lưu trước toàn bộ và có nút hoàn tác nhanh; không tự động áp dụng.
- Danh sách sửa đổi hỗ trợ chỉnh ô, đổi cả hàng, thêm hàng, xóa hàng, đổi preset cốt truyện, hoặc kêu cơ sở dữ liệu tự điền bảng lại; dựa vào `row_id` để định vị, check lại giá trị cũ trước khi đè vô, nếu đổi đoạn chat, bị lock hoặc xung đột là từ chối thẳng và báo lỗi luôn.
- Preset thúc đẩy cốt truyện chỉ thực hiện chuyển đổi chứ không đổi ruột: API chèn preset của cơ sở dữ liệu tiện tay gạt đoạn chat hiện tại sang chế độ gọi LLM, mà API mở chả có tính năng xóa preset hoặc vác về chế độ cũ, nên viết xong là vô phương cứu vãn.
- Thêm tính năng **Quan sát trò chuyện** (Mặc định đóng): Cứ cách N tầng (1～20, mặc định là 4) nó đọc tầng mới xuất hiện, để lại bình luận vào lịch sử chat và cho phép reply thẳng luôn; 3 câu liên tiếp mà không rep là nó sầu não, lần sau nó nói nó sẽ hỏi rụt rè lại, tiếng đồng hồ hỏi 1 lần thôi; khoảng cách mỗi đợt chém gió là 60 giây, lúc cơ sở dữ liệu đang điền là ráng ôm thêm 30 giây nữa.
- Lời thoại mới: tâm trạng "Tủi thân" của cả 3 đứa, với phản ứng lúc đang ghi dữ liệu bảo trì hoặc hoàn tác.
- Bổ sung file: `repair.js` (Làm gọn dữ liệu, tháo dỡ rồi đối soát phiếu sửa), `repair-ticket.js` (Khung phiếu sửa), `database-repair.js` (Thực thi ghi vô hoặc rút về), `backup-store.js` (Lưu vô cache của trình duyệt), `watch.js` (Nhẩm tính số tầng với me đúng thời gian để hót).

### v0.8.0 · Ba pet màn hình, Nuôi dưỡng và Phím tắt mở bảng cơ sở dữ liệu (Bản cũ)

- Thêm nhân vật Zero (26 hình) và Nai Dan (đọc trực tiếp hình gốc của cơ sở dữ liệu đang chạy); gom chung tư liệu nhân vật vào `characters/`, muốn nhét thêm nv là chỉ cần bổ sung 1 file với 1 folder tài nguyên thôi.
- Cập nhật thêm tính năng Nhà pet màn hình: Cái đống card nhân vật kiểu sổ tay bách khoa, anime lúc thay đứa khác, rồi thì tên gọi, ghi nhật ký, đến mấy cái mẩu chuyện bé xinh làm riêng cho nhân vật.
- Nhét thêm tính năng Nuôi bé: Độ thân thiết 5 nấc, sạch với no, đủ trò vui buồn, chào buổi sáng, ân xá cho lính mới; mọi thứ chả có gì trừng phạt, thậm chí có quyền gạt bay cái chỉ số nhu cầu.
- Lương bổng với cắm cơm là tách biệt theo từng nhân vật, nhưng kho tiền là cái thẻ Visa dùng chung; file save chơi tương thích tuốt 0.7.1 (tiến độ sinh hoạt của Tiểu Erii sẽ bám dính vào file cũ).
- Có đống lời thoại offline theo tính cách, tâm trạng, và độ khăng khít cho đủ loại hầm bà lằng từ việc cơ sở dữ liệu, sờ đụng, hầu hạ, lêu lổng; cái bong bóng thoại cũng tách làm 2 nhịp thoại với tiến độ gốc; tắt được tuốt.
- Cuốn sổ tay thêm cái phím tắt bay qua cơ sở dữ liệu với nút "Xem bảng"; error cũng lòi thêm "Chạy qua xem thử".
- UI biến tấu mang đậm phong vị sổ da xịn xò, có level hiệu ứng bung xòe; UI lúc xem điện thoại thì kéo từ dưới mông lên cho nhanh.
- Thanh lọc cả đám hình nhấp nhô chạy sang ngang chả xài (Bay mất tầm 21 MB), tóm lại extension gọt từ hơn 25 MB về cỡ 6.5 MB.
- Nhét thêm con `tools/slice-pose-sheet.py`: Tách bảng biểu tạo dáng ra cái frame rời đúng chuẩn cho dự án.
- Hình ảnh, đường dẫn, văn bản, tương tác, đồng bộ độc quyền đọc (read-only) cơ sở dữ liệu, phím dừng, mấy đoạn kể chuyện nhảm, lịch mần ăn đều bất di bất dịch của Tiểu Erii; Nếu cài đặt cũ chả lòi thêm thuộc tính gì thì ưu tiên xài của Tiểu Erii; `settings.chat` tiếp tục ghi, giật lùi về 0.7.1 không rớt một sợi lông.

### v0.7.1 · Bốn hình minh họa riêng lúc ăn với đổi tên nút (Bản cũ)

- Mấy cái Pudding / Cơm nắm / Cơm cuộn trứng / Ramen lấy luôn 4 bộ ảnh nền WebP xuyên thấu là eat-pudding / eat-riceball / eat-omurice / eat-ramen.
- Card gọi món đổi thành mấy cái biểu tượng lúc ăn của Tiểu Erii; mua đồ ăn thì trong sổ tay với ngoài màn hình nó lên đồ giống y chang nhau, bỏ luôn bộ icon ăn cơm chung.
- Hình mới cũng cố giữ đầu gắn vịt vàng, xòe hai tay, mắt đỏ tóc đỏ, mận áo kimono đỏ trắng; hình HD được lưu chui, hình up lên bị ép lại thành WebP 768x768.
- Lối vào của sổ tay nhỏ, cài đặt extension, với trang Preview được nhét thành 1 tên "Sổ tay sinh hoạt".
- Cơ chế tiền bạc, giá cả đồ ăn, thời lượng cạp, tiến độ nhặt gạch, dữ kiện có sẵn y xì đúc; bản record ăn dở cũ được đẩy qua ảnh mới nếu trùng cái Food ID.

### v0.7.0 · Đi làm, Bào tiền và Ăn cơm (Bản cũ)

- Mở thêm Sổ tay sinh hoạt với cái cửa sổ trơ chọi: cày tiền, bốc cái gì ngon xơi đi, quyển sổ bé hạt tiêu.
- Mấy tiệm như Tiệm sách / Tráng miệng / Tiệm Hoa cắn tầm 1 / 2 / 3 phút, hốt 10 / 18 / 25 tiền vàng; Xong là nghỉ chứ đếch cho tự động mần lại.
- Tương ứng Pudding / Cơm nắm / Cơm cuộn trứng / Ramen ngốn hết 5 / 8 / 15 / 20 tiền vàng, ăn uống trôi qua 8 / 9 / 10 / 12 giây.
- Ghi sổ ví, giờ giấc nổ máy, tổng lượng hoạt động với 20 lượt bốc mần ăn; F5 hoặc sập mạng cũng hồi lại như cũ.
- Lương chưa rinh chả bao giờ rụng đi đâu, chung một tab đố mà ấn trùng hay thồn gấp đôi; Hủy kèo bốc phét là phải dằn mặt xác nhận.
- 4 bức WebP trong vắt 768x768 nhét thêm có 584 KB; Ảnh cũ nằm yên. Gõ phím / Hốc cơm ngồi ỳ một xó, múa may chầm chậm, chả đi bộ rong ruổi nữa.
- Lòi thêm thanh trạng thái sinh hoạt với cái bong bóng hốt bạc lúc hết giờ; cơ sở dữ liệu bay ra cướp cờ thì chịu lùi bước, tab sinh hoạt cũng có thể diệt trừ lệnh cũ gốc.
- Mấy cái chức năng múa phím, chỉnh tone, nhớ dài, nháp văn, API với đổi model hồi v0.6.2 vẫn yên vị.

### v0.6.2 · Sổ tay trò chuyện và Thao tác tin nhắn (Bản cũ)

- Băm lại khung chat: Ava, giờ giấc, dải phân cách ngày, cái tag rỗng, status treo mạng, với tab settings nhóm.
- Mọc thêm chức năng Copy từng cái, hốt cả mảng TXT, xé nháp rep lại cái đuôi, hốt văn cũ nắn lại rớt ra chém tiếp.
- Làm mới hay sửa đè chỉ nuốt lời lúc API phím pass, tạch hay hủy là câu cũ vẫn ngồi im.
- Nuốt nháp thường với nháp đang nặn; hủy nặn là khè lại ngay mớ văn thô chưa nổ.
- Ba style: Tự nhiên / Cụt lủn / Nhây nhớt, cộng thêm cái kho ghi chú tống tay mắc xê được 2000 chữ.
- Coi đồ cổ vẫn neo đúng tọa độ cày, thêm nút "Chạy vèo xuống coi câu mới"; PC xòe to hẹp nhỏ được, Mobile tự dãn khung text lên lấp bàn phím.
- Ăn rơ cả đống log thời xưa rít, chả bốc phét thời điểm tin nhắn; Mã key vẫn tống ly thân với mớ chat và setting.
- Cái list Model, API đơn / cục bộ, chức năng cắt cổ lệnh cũ cơ sở dữ liệu, với mấy trò bẹo má tương tác pet y như cũ; tính năng tản bộ, làm cu li chả ló dạng.

### v0.6.1 · Danh sách mô hình và Kết nối thực cho bản xem trước (Bản cũ)

- Mục cấu hình API riêng có thêm tính năng "Lấy danh sách mô hình", giúp lựa chọn các mô hình hiện có, nhưng vẫn có thể tự gõ tên.
- Hiện lên lúc húp data, chửi thề vì fail, với bấm Hủy; bẻ tay cắm IP/Key khác, ngắt tab, hay tắt đi là nó xả kèo request, đỡ phải lo chèn đồ cũ.
- Quăng mẻ lấy model xuyên qua cái cổng Model Native Tavern, lôi hẳn Key riêng đang ghi, chứ chả thèm móc ngoéo gì vô connection của Tavern.
- Bản Local Preview đẻ ra là chỏ thẳng tới API query model, móc connection check test, nhào vô chat thiệt; chôn cái trò sample fix cứng, nhái fake connection thành công.
- Muốn vọc cái Demo mode là phải khai rõ ràng, băm log ra xài riêng biệt.
- Check hàng 2 chiều câu mới nứt đọt với dây leo; Lỗi API nổ chữ đỏ, chả nặn thêm cái câu bù khú cho qua chuyện.
- Cái tab Chat độc lập, tắt bật status chi tiết task với cái nút trảm lệnh cơ sở dữ liệu đời v0.6.0 thì vẫn để y.

### v0.6.0 · Trò chuyện độc lập và Nội dung công việc thực tế (Bản cũ)

- Ợ thêm cái tab độc lập để Chat, nhét sẵn đống Prompt của con ẻm Erii, có quyền set xưng hô/tình trạng 2 đứa.
- Trả về cái Completion Chat / Text của Tavern xài mặc định; Hoặc tay bo nhồi API tương thích OpenAI, Model, với Key vô.
- API rời rạc cũng xài nút cắt phăng Request riêng; Ném lệnh, thử lửa lại, check IP, diệt chat log, sao lưu lịch sử có cả.
- Mobile Layout vẹo vọ nắn theo cái view hiển thị, PC kéo cái Header bứng đi cũng ngon. Cái vụ Save API Key lên Device thì quăng cho Options.
- Cái Setting Extension đẻ thêm mục coi Status gọn gọn hay ném mẹ nó ra; Full là ôm luôn tên cũ, giữ cái ngắt dòng của `detail`, content cuộn thả phanh, nút diệt Task còn nhạy.
- Màn Chat quất luôn cái nút chặt Task gốc của cơ sở dữ liệu, Chat Stop với Task Stop chia ra hai đường.
- Cái trò rớt vịt vàng trên đầu, bê kéo tự do, mép là chòi, vỗ lạch bạch vô em nó, câu chuyện ru ngủ 30 giây rải rác tuốt; Cái trò tự bay bộ là chả thấy mọc lên nữa.

### v0.5.14 · Câu chuyện nhỏ tự động đổi bài mỗi 30 giây (Bản cũ)

- Sau khi mở bóng thoại câu chuyện, cứ 30 giây nó nhảy sang truyện mới; tự mở hay máy rảnh ném ra thì đều dùng được.
- Quất loạn cái mớ 12 bài, nhưng 1 vòng cấm lặp, 2 vòng cạnh nhau cấm trùng liên hoàn.
- Để chuột hơ hơ, gõ gõ thì nó ngừng, lấy đi thì đếm lùi tiếp; Mobile thì chọc 1 phát là ghim lại.
- Bấm "Đổi câu khác" là trảm ngay luôn; Diệt tab, Task cơ sở dữ liệu lao vào, bung cuốn sổ là bóp cổ cái loop này.
- Cái chức năng 5 phút quăng Story, Toggles của nó với cái trò sửa cái nút băm Task hồi v0.5.13 vẫn chạy bền.

### v0.5.13 · Sửa lỗi dừng nhiệm vụ và ẩn cuốn sổ nhỏ (Bản cũ)

- Nút dừng nối thẳng vào cái đuôi Task hiện tại của cơ sở dữ liệu, khỏi có vụ Task dỏm ngồi lên đầu.
- Rờ chuột vô cái là nó ngó lại nguồn với Task; Nguồn đứt, Task biến hình thì khỏi xài lệnh mốc, nó hỏi dò xem có hốt cái mới không.
- Cơ sở dữ liệu cập nhật cái tính năng thao tác tắt chứ chả thay đổi chữ thì nó cũng nhặt luôn thao tác mới.
- Lệnh vỡ mồm thì ghim tầm 8 giây, F5 là điếng người chả đè lên kịp; Lỗi/Báo động của cơ sở dữ liệu ngoi lên trên cùng.
- Tắt "Hiển thị Erii" thì mớ Setting vẫn gọi được cuốn sổ nháp với Cổng cơ sở dữ liệu; nhưng mất bóng thì đồ chơi giải trí tạch hết.
- Cái chức năng ngó mép, bê kéo, vỗ vỗ, kể truyện của v0.5.12 giữ sạch; Đéo có cái tính năng lội bộ đâu.

### v0.5.12 · Kéo vào sát mép là ló đầu ra ngay (Bản cũ)

- Bẻ cổ cái đếm lùi 6 giây chờ ngó chỏm; Ném ẻm tới mép buông tay là nó lút thụt chỏm ra.
- Trỏ chuột vứt vưởng ngay cạnh thì cứ ngó thôi, chả thèm đuổi đi.
- Nếu ở cái thế mép sẵn rồi thì nó khè luôn, khỏi chờ lết kéo đè lưu.
- Đang dính mép thì dẹp cái khung chờ êm mông, chuyển dáng lướt qua cái chéo 0.16 giây thôi.
- Kéo tay vẫn báo là xách cổ, Đụng chạm, chợp mắt, ngó nháp, nhét Task thì nổ trước; Hết việc rớt vô góc thì lại ló đầu ra.
- Vẫn nén 12 mẩu truyện gốc với nút băm Task của cơ sở dữ liệu; Đếch thèm trả lại tính năng tự thân vận động.

### v0.5.11 · Ló đầu ở mép và câu chuyện nhỏ chữa lành (Bản cũ)

- Gim mẹ cái X vào góc trên bên phải của cuốn nháp, kéo xa cái nút chui cổng Cơ sở dữ liệu cho khỏi chọt mù mắt.
- Cho lên sóng 3 cái WebP trong vắt 512x512 ló đầu mép (trái, phải, đít); Cái mép trên sài lại hình thò đầu xuôi bình thường.
- Sửa lại cái hình cho anh em la ó: Cái xác nó chui gọn, ló đầu với 1 tay bám mép (tay lột trần), gỡ cái mớ hai tay chèn một ống lồng với cái dáng quặt quẹo.
- Kéo tống vào góc, 6 giây sau nó thò mặt; Mèo, đụng tay, ấn mút, kéo cổ hoặc dính Task là trở mặt lại.
- Dồn 12 mẩu chuyện tự kỉ sáng tác; 5 phút không chọc ngoáy là tự nổ, bật tay trên nháp cũng ok.
- Nhồi nút qua bài, tắt, lơ chuột ngừng, bàn phím chặn, mobile bấm để đọc.
- Task với Log của cơ sở dữ liệu là nổ trước Story, nút cắt Task vẫn trỏ vào rễ của Cơ sở dữ liệu.
- Mọc 2 cái công tắc rời rạc; Hình hỏng thì quay về pose cũ.
- Hành vi không tự bay, bật sổ chuột phải, rúc Tavern 1.14.0 - 1.19.0 từ v0.5.8 vẫn thế.

### v0.5.10 · Căn chỉnh lại các nút trong cuốn sổ nhỏ (Bản cũ)

- "Tặng cô ấy một bông hoa" chui vô ổ đồ chơi tiêu khiển, từ Font, Viền, Back Color với Mode Disabled đều sài chuẩn chung.
- Quất cái List "Vươn vai -> Ngủ hờ -> Quăng cái hoa", hốt dọn đi để khỏi nới dòng tốn chỗ.
- Dịch cái X đóng nháp nhích sang góc xíu xiu, nới cái nút "Chui cổng gốc" xa thêm tí ti cho bớt vồ nhầm.
- Lối mở chuột phải, cổng vào database hồi v0.5.9 vẫn để mốc.

### v0.5.9 · Bật tắt bằng chuột phải và cổng vào cơ sở dữ liệu (Bản cũ)

- Mút chuột phải (PC) vô cái mặt con nhóc: Phát 1 bung sổ, Phát 2 xếp luôn, Đỡ phải lết tay tìm con X.
- Thổi bay hai nút "Quăng về ổ mặc định", "Đảo bên mông" khỏi cuốn nháp, vì đéo ai dùng tốn space.
- Kẹp cái "Vô cái lõi cơ sở dữ liệu" thẳng trên đầu sổ nháp, cắm vào cái Extension của cơ sở dữ liệu mà quẩy.
- Ráp tuốt cái menu V2 `acu-v2-menu-item` với cái đồ cũ `shujuku_v120-menu-item`; Ngó đéo ra mặt cơ sở dữ liệu thì nó chửi mở lên trước.
- Kèo v0.5.8 bảo trì chuẩn: Nhỏ kia đéo tự thèm nhấc mông, tao bê thì nó mới lết.

### v0.5.8 · Hoàn tác việc tự động di chuyển

- Đập bay vụ lôi hình chạy qua lại.
- Xóa sổ bộ logic dạo phố, nhích mông hóng mát.
- Bé kia đéo thèm chạy hay dời mông tự xưng, chỉ lúc hất tay tao kéo thì nó chịu đi.
- Giữ cái thói thở khò, chạm vô, ấn lún, xách cổ, móc đồng bộ với trảm Task.
- Hốt sạch rác rưởi của cái mớ hình lộn xộn, cho file setup nó mỏng đi tí với trừ logic thừa.

### v0.5.7 · Sửa lỗi cập nhật vị trí lúc đi dạo (Bản cũ)

- Sửa cái phốt "Dáng thì đang lượn, mà cái hồn vẫn cắm neo yên 1 góc".
- Mỗi nhịp ném toạ độ đàng hoàng, ẻo lượn mạn trái mạn phải xíu xíu rồi bò về mốc đầu.

**Tính năng chủ động đi bộ của bản này đã bị ăn rìu từ bản v0.5.8.**

### v0.5.6 · Ổn định thời gian hành vi chủ động (Bản cũ)

- Delay mốc đục khoét chập choạng cỡ 12 - 20 giây cho đỡ dính phốt lag.
- Hốt bớt cái mớ rác của cái timer lách cách đi dạo lúc vứt màn ngâm dấm.

**Tính năng chủ động đi bộ của bản này đã bị ăn rìu từ bản v0.5.8.**

### v0.5.5 · Đi bộ qua lại chầm chậm (Bản cũ)

- Dựa dẫm vô cái vụ múa chân của con Nai Dan, cứ vắt 260 củ ms nó ếch 8 pixel.
- Gần tới target rồi thì quay xe đi nhùi cái đường vừa dẫm.
- Hết dạo thì đóng nguyên chỗ cũ, méo Save cái gốc tào lao.
- Nút Setting Option chà lại rực sáng cho đỡ lòi mắt.

**Tính năng chủ động đi bộ của bản này đã bị ăn rìu từ bản v0.5.8.**

### v0.5.4 · Ảnh động chạy bộ trái phải (Bản cũ)

- Câu vô 2 set chạy bộ 8 khung quẩy qua trái phải.
- Xách vịt lên đầu ẻm như cũ.
- Lết xong thả lại điểm xuất, méo Save vào kho.
- Khung chạy ập vô chung cái lưới Transparent, Trục tâm, Baseline chuẩn đế.

**Tính năng hoạt ảnh chạy bộ của bản này đã bị ăn rìu từ bản v0.5.8.**

### v0.5.3 · Tương tác chủ động và Tự động di chuyển (Bản cũ)

- Ế mốc ra thì tự lấy trà húp, đọc cuốn, múc giấy, bó vịt vàng, xoay mình, dòm nhòm, hất tay.
- Rảnh quá bứng cả cái mông tự xục 1 nhát trong mốc an toàn.
- Dính đống Task, bị xách cổ, lôi sổ nháp thì cạch đéo thèm nhích.

**Tính năng chủ động di chuyển của bản này đã bị ăn rìu từ bản v0.5.8. Đống vẹo tương tác nhàn rỗi thì tha.**

### v0.5.2 · Thêm nút dừng vào bong bóng nhiệm vụ

- Lúc đẩy truyện với cày bảng, nếu Task cơ sở dữ liệu ngầm cho cắt, bong bóng nổ nút Dừng.
- Nhấp mỏ vô là quăng luồng lệnh dẹp của cơ sở dữ liệu gốc.
- Đéo có khả năng ngắt thì đéo mọc nút lụi (fake).

### v0.5.1 · Nhấn giữ trên điện thoại để mở cuốn sổ nhỏ

- Trên mobile bói không ra cái Right-Click, thì đè mẹ nó 1.4s sổ nháp phọt lên.
- Đục ngắn, ấn mù, lút hờ mút dãn, lôi cổ cắt mẹ nó ra rành mạch khỏi tạch thành bật Tab nháp.

### v0.5.0 · Khả năng tương thích Tavern bản cũ

- Hướng vào họng súng của SillyTavern 1.14.0–1.19.0.
- Lướt mượt với mấy đồ xưa đéo có Call-back Start, nốc luôn cả Call-back New-Life.
- Buff cái Shield né trò khởi tạo trùng cho khỏi mọc nấm hai bé con.
- Hình chưa Decode lòi thì éo múc con pet cũ của Cơ sở dữ liệu; Hình tạch thì ném cái đồ cổ ra.
- Trét thêm đống Kill, Cleans, Back Cache Refresh của Trình duyệt vô luồng Hồi sinh.

### v0.4.1 · Kéo dài thời gian chợp mắt và nối ảnh động

- Ấn tầm nửa giây cho bé ngủ, nhả ra cho cày thêm 12 sọc ngủ khì.
- Khì khì, hất tay, vỗ mỏ thì đéo cho mấy trò linh tinh khác ngắt.
- Thó mấy chiêu xòe thế, nẩy người, thở chập chùng với nhịp điệu của Nai Dan ráp vào nhịp vung tay, nổ bong bóng, tụt dốc, bó vịt với ngủ ngày.
- Bốc lên tụt xuống êm ái cái Trọng tâm (Pivot), bóp cổ cái phốt quay vòng mòng.

### v0.4.0 · Nhấp, liên tục nhấp và nhấn giữ tương tác

- 1 búa thì Hất tay, 2 búa nhồi nhẹ con vịt, 3 búa xúm lấy sổ trốn một tí, 6 nhát nổ chùm pháo hoa (Combination).
- Đè sâu chui vào nấc Ngủ; Rút rê, quăng mẩu tin, Click thì dọn rành mạch đéo nhầm lộn cuối rê là búa phọt.
- Cuốn nháp cạo mả đổi thành "Cuốn sổ nhỏ của Tiểu Erii", cạo sạch đuôi version lố lăng trên tít.
- Menu Task còn giữ được cả quả Click chuột phải, mớ Icon Setting với xài Key nấp.

### v0.3.1 · Giảm gánh nặng kéo, Dọn dẹp đồ cổ với múa khớp

- Lúc kéo, Update mỗi toạ độ với ẻo người thôi, đéo moi họng đo Viewport Size hay nhả thêm chữ Task dỏm.
- Nhả bay cục bóng chat với sổ nháp khỏi chân con ẻm, lướt êm méo mấp mô giật bọ xít.
- Hệ Hô hấp chạy riêng con server; Quệt ảnh, nẩy bốc ẻm, rơi uỵch đít nhồi sụn mượt òm.
- Trị mấy phốt vụn vặt: Bơm record, húp nước chè, oằn lưng, xách lủng lẳng, chạm sàn, thè lè tay, thò mặt ngơ (Bị lem nham rác).
- Bắt phải xài trọn bộ 384x384 WebP cực trong; Dáng kẹp ẻm vẫn nốc giữ mớ mỏ con vịt vàng.

### v0.3.0 · Kéo, Nhớ vị trí và Bộ sưu tập Full HD

- Lấy sức rinh con chuột với vọc chạm màn, cản mép ranh giới, dí vào góc, lưu mộc toạ.
- Bị dồn khung, xoay màn nhào ngang xấp ngửa hay lòi Bàn phím thì nó né cục Input.
- Rớt 4 chiêu: Xách cổ, Chân tiếp địa, Hỏi mào, Dòm bám ngó; Cửa nháp thêm chọt dáng.
- Nạp sẵn ảnh hông cần la hét, Decode mượt nẩy phím, vả rách nhịp trễ Database Sync cùi.
- Cho vào đời dàn WebP khủng 384x384 (16 pic), đéo mượn cái đống Pixel 192 chích ép nén bẩn.

### v0.2.0 · Phiên bản Tiện ích độc lập

- Lôi đầu từ cái động "Đục khoét DB" rẽ thành cái mác SillyTavern Extension chảnh.
- Hút chực dữ liệu DB qua cái ống nhòm (Observer) để nẩy bọt UI.
- Éo Cop DB, đéo độ sọ DB Business, Khỏi xưng API lôi thôi.
- Tọng Option Setting, Mốc toạ độ, Cửa sổ nháp với Action Task Basic mồi vô.

### v0.1.1 · Bản thử nghiệm tương thích Windows (Đã bị vứt)

- Cục Adapter bẩn mót làm cho Windows ngày trước, dính rễ đống cắm sạc cùi bắp.
- Rác rồi, đừng lấy râu ông nọ cắm cằm bà kia (Đéo phải cục trên Git).

### v0.1.0 · Bản thử nghiệm đầu tiên (Đã bị vứt)

- Test mẹo cục Patch Interface gốc DB xưa rích.
- Buộc đục chui đường tắt DB, sau thọt bay nhường ghế cho Standalone.
- Repo với Note mớ này đéo chơi nữa.

## Cài đặt và Khôi phục

Trong phần cài đặt tiện ích của Tavern, bạn có thể điều chỉnh:

- Pet màn hình hiện tại (Tiểu Erii / Zero / Nai Dan) và đường dẫn vào nhà pet màn hình;
- Công tắc hiển thị pet màn hình;
- Kích thước pet màn hình;
- Hành động khi rảnh rỗi;
- Ló đầu sát mép;
- Câu chuyện chữa lành tự động (vẫn có thể tự bấm nghe chuyện);
- Có ẩn Nai Dan và bong bóng thoại gốc đi không;
- Nội dung nhiệm vụ bản tóm tắt / bản đầy đủ;
- Nói chuyện khi làm nhiệm vụ;
- Công tắc chỉ số nhu cầu (độ no, độ sạch);
- Hiệu ứng: Tự động / Rực rỡ / Đơn giản / Tắt;
- Bật/tắt "Quan sát trò chuyện" và Tần suất bình luận (Mỗi 1～20 tầng);
- Số tầng văn bản đính kèm khi bảo trì (0～10 tầng);
- Mở cuộc trò chuyện và cấu hình kết nối, danh xưng, quan hệ trong cửa sổ trò chuyện;
- Đặt lại vị trí pet màn hình.

Sau khi tắt hoặc gỡ tiện ích này, chỉ cần làm mới trang Tavern là nó sẽ hồi sinh lại cái pet màn hình gốc của cơ sở dữ liệu. Bản thân cơ sở dữ liệu đéo cần phải Rollback đi đâu cả, mà bạn cũng đừng có lôi cái đống thử nghiệm thời cổ đại mà rải lên cái mặt cổng của cơ sở dữ liệu nghen.

## Phạm vi tương thích và Ranh giới xác nhận

- Mục tiêu SillyTavern: **1.14.0–1.19.0**.
- 1.14.0–1.16.0: Cổng nạp tự ôm cây đợi API setup của Tavern phọt nảy.
- 1.17.0–1.19.0: Gắn vô Call-back vòng đời do Tavern bố thí, có chèn luôn khiên Single Instance.
- Banh mắt dòm thêm chi tiết tại [`COMPATIBILITY.md`](COMPATIBILITY.md).

Vụ Test file với cái trò cách ly check của Trình duyệt chỉ xì ra được mấy cái mã nguồn, list, nhái task với lợp khung bố cục ra sao thôi, méo thể thay bạn tự bê cái Tavern thật ra mà Test được. Bạn vẫn phải tự thọt tay test trên máy bạn mấy cái này:

- Sau khi Update trên GitHub, ngó coi cái Tavern của bạn đã nhai đúng cái Ver `0.9.0` chưa;
- Cái cơ sở dữ liệu của bạn có còn ban phát cái State giao diện khớp rơ không;
- Thúc cốt truyện thật, Nhồi bảng biểu thật, Dính Error, Trảm Task;
- Lúc nạp Model thiệt, cái Danh sách sửa đổi mà màn hình Bảo trì nó rặn ra có xài được không (Trước lúc vọc là phải căng mắt đọc kỹ từng mục rồi hẵng vung tay tích chọn);
- Cái cảm giác sờ nắn chọc chạm trên Mobile thiệt với lúc cái bàn phím ập lên.

## Câu hỏi thường gặp

### Cập nhật xong Tiểu Erii vẫn tự chạy rong

Check ngay coi danh sách tiện ích của Tavern nó đã nhảy đúng Ver mới nhất chưa. Nếu không trúng `0.9.0`, nghĩa là cái Tavern của bạn vẫn đang ôm đống rác rưởi cũ kỹ; nhấp update lại rồi ấn F5 nghen. Phiên bản `v0.5.7` đổ về trước mới chứa cái logic lăng quăng, chứ từ `v0.5.8` là vứt mẹ nó vụ lượn lờ rồi.

### GitHub hiện bản mới, mà Tavern vẫn dở hơi thói cũ

File trên GitHub mọc thêm bản mới méo có nghĩa là Tavern của bạn đã nuốt vào đầu. Cứ triển khai y nguyên xì: Update trên trình Extension -> Ấn Refresh Trang -> Đè cái `Ctrl+F5` vỡ phím cho tôi. Xong check lại coi Ver Extension trong Tavern có nhích chưa, đừng bói chữ trên tít cái cuốn sổ; tít nháp từ v0.4.0 là cạo sạch dấu ấn phiên bản rồi.

### Pet lù lù ra đó, mà lại réo chưa kết nối Cơ sở dữ liệu

Xác định coi cái cơ sở dữ liệu gốc đang gào mồm chạy chưa, có bị thằng nào dán cái đống nạp Experimental lụi thế vô không. Khuyên chân thành là cứ để kệ cha cái con Nai Dan gốc với bong bóng Task chạy ẩn trong nền, chỉ cần ấn che màn trong phần Option Extension là ngon. Cấu trúc UI DB mà nát, là bé Pet ngậm họng hoặc ném cảnh báo không khớp cọc, đéo thèm giả lụi cái trò "Connected".

### Tại sao không đổi được sang Nai Dan

Cái đống hình chóp của Nai Dan là nhặt từ mồm cơ sở dữ liệu đang thè ra chạy. Vui lòng coi lại xem cơ sở dữ liệu đã mở chưa, và cái đám Pet mặc định của nó có bị ngắt rốn không; Éo vớt được mớ hình thì trong Căn nhà sẽ thét lớn nguyên do, và pet màn hình sẽ lấy cái nhân vật gốc ra đứng bồi tiếp.

### Lỡ tay sửa sai trong lúc bảo trì thì sao

Thì lấy cái nút **Hoàn tác** chọt dô ngay dưới danh sách sửa lỗi đó, bảng tính sẽ hồi quang phản chiếu về lúc chưa lụi. Load lại trang F5 vẫn cứ ok (Bản Backup ghim dưới Cache Browser); mà lỡ Browser nó hãm không cho ghi Local, hệ thống sẽ khều tay kêu gào "Tải cái bản Backup dằn túi đi". Trước khi bấm rút lại, nếu cái bảng tự nhiên nó lại trồi thêm khúc mới (do DB đè), thì hệ thống sẽ xọt mồm nói cho mầy nghe.

### Sao thằng Quan sát trò chuyện câm mồm quài thế

Xem kĩ coi cài đặt Tiện ích đã nẩy **Quan sát trò chuyện** lên chưa, mớ chat mới nứt ra từ lúc mở đã vỡ họng đúng cái chỉ số gáy bài (Comment Frequency) chưa; Mỗi lần quăng nùi bình luận phải rớt nhau 60 giây, DB mà mót điền bảng là ẻm nín thêm 1 phát rưỡi. Ngó vô setting Option **Quan sát & Bảo trì**, nó vạch rõ thời gian đợt hót gần nhất hoặc lỗi sập nguồn chưa phọt.

### Mobile không có Click Chuột phải, mở Cuốn sổ nhiệm vụ bằng niềm tin à

Nhấn tí là vỗ ve, dí cái 0.5s là ngáy khì, dặm sâu tầm 1.4s là banh cái Nháp ra liền; Hoặc rặn ra đường Setting Extension múc "Xem cuốn nháp nhiệm vụ" là có lối thoát.

## Tài nguyên & Cấp phép

Kiểu dáng Tiểu Erii đúc theo cái nguồn [Cardwright 绘梨衣桌宠素材](https://github.com/1798547983tt/Cardwright/tree/359019715afc60813384964b023a09c6dd6ed326/assets/pets/erii). Đống hình múa may ImageGen phệt rồi tỉa tót dặm lại, bộ khung chỏm là nền rỗng vắt kiệt WebP, tới v0.7.0 chích cái đống hình đời sống giữ lằn ranh tàng hình của WebP nét băm. Đống tài sản Graphic là hàng Non-Official Đạo nhái fanmade của "Long Tộc", đè chiếu xài theo chữ ký & nguyên lý méo vì Lợi Nhuận của file [`assets/NOTICE.md`](assets/NOTICE.md); Rễ của mớ Code bợ quyền MIT License, MIT đéo đè vô đám Mĩ Thuật được.

Chùm hình của Zero do ImageGen đẻ theo 2 bảng tạo mẫu Pose, bơm bung bét qua cái Real-ESRGAN (Bơm dòng Anime) xong mới xắn khúc bằng con mã `tools/slice-pose-sheet.py`, Nhãn chữ ký với chứng chỉ ném tuốt tại [`assets/zero/NOTICE.md`](assets/zero/NOTICE.md). Mớ ảnh con Nai Dan của Database, tụi này chỉ húp vớt từ hình phọt đang ngốn, miễn Copy, đéo chôm chĩa phát tán.

Nguồn Database xào nấu: [AlbusKen/shujuku](https://github.com/AlbusKen/shujuku).
