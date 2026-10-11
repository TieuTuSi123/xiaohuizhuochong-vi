Link Gốc: https://github.com/dzsks/xiaohuizhuochong

# Tiểu Erii · Pet màn hình cơ sở dữ liệu

## Phiên bản hiện tại: v0.9.3

**v0.9.3: Mở bán trang phục mới của Tiểu Erii「Lễ phục Dạ tím Tsukuyomi」, giá 10.320 vé hoa; tỷ lệ quy đổi 1 xu vàng = 40 vé hoa, cần 258 xu vàng là đổi đủ một bộ. Trang phục không tặng sẵn từ đầu mà cần tự đi làm thêm tích lũy tiền. Đã tích hợp trọn bộ 27 hình ảnh hành động và sinh hoạt, số dư xu vàng, hoạt động và dữ liệu lưu cũ vẫn tiếp tục được sử dụng.**

Sổ tay cuộc sống → **Trang phục** → Nhập số lượng xu vàng → **Đổi vé hoa** → **Mua** → **Mặc vào**. Điền số lượng sẽ không trừ tiền, chỉ khi bấm đổi mới trừ xu vàng; sau khi đã mua thì thay đổi qua lại hoàn toàn miễn phí.

Tiếp tục duy trì 6 mục sửa lỗi từ bản v0.9.2:

- Đề xuất kiểm tu được tạo dựa trên dữ liệu bảng biểu tại thời điểm gửi yêu cầu; nếu chuyển đoạn chat trong lúc chờ phản hồi thì yêu cầu cũ sẽ bị hủy. Trong cùng một đoạn chat, nếu các dòng bị chèn thêm hoặc sắp xếp lại thứ tự thì hệ thống vẫn dựa vào `row_id` gốc để định vị dòng tương ứng, nếu giá trị gốc bị thay đổi sẽ từ chối ghi đè.
- Sau khi quá trình sao lưu kết thúc, trước mỗi mục ghi và trước khi hoàn tác nhập lại, hệ thống sẽ kiểm tra lại phiên chat, nguồn cơ sở dữ liệu và trạng thái bận; mỗi trang chỉ thực hiện một tác vụ ghi/hoàn tác kiểm tu tại một thời điểm. Trường hợp thành công một phần vẫn lưu lại kết quả từng mục và bản sao lưu.
- Trước khi xóa dòng sẽ đối chiếu toàn bộ nội dung dòng và tiêu đề cột; trước khi đổi preset sẽ đối chiếu preset gốc. Các đề xuất xóa dòng tạo từ bản cũ thiếu giá trị gốc hoàn chỉnh sẽ được nhắc tạo lại; sau khi nâng cấp nên kiểm tra lại các đề xuất cũ chưa áp dụng một lần nữa.
- Khi cơ sở dữ liệu đang bận, thao tác hoàn tác thông thường và "Vẫn muốn hoàn tác" đều tạm thời bị vô hiệu hóa; hoàn tác cưỡng chế chỉ có thể bỏ qua bước xác nhận "bảng biểu đã bị thay đổi sau đó", tuyệt đối không bỏ qua bước kiểm tra nguồn đoạn chat và trạng thái bận.
- Khi tắt chỉ số nhu cầu sẽ đóng băng độ no/sạch sẽ tại thời điểm tắt, khi bật lại sẽ bắt đầu tính giờ từ thời điểm mới.
- Khi tắt quan sát trò chuyện, ẩn pet màn hình hoặc chuyển đoạn chat, các bình luận đang chờ phản hồi sẽ bị hủy; kể cả khi API trả về trễ cũng không lưu vào lịch sử và không hiện bóng thoại cũ. Các yêu cầu trò chuyện thông thường vẫn độc lập.

Tiếp tục giữ lại khung hệ thống trang phục từ bản v0.9.1; Erii có thêm Lễ phục Dạ tím, Zero và Naidan hiện tại vẫn dùng trang phục mặc định.

Toàn bộ các tính năng từ v0.9.0 (Kiểm tu cơ sở dữ liệu, quan sát trò chuyện), v0.8.0 (3 pet màn hình Erii / Zero / Naidan, nhà pet màn hình, hệ thống nuôi dưỡng, lời thoại nhiệm vụ, phím tắt mở bảng cơ sở dữ liệu và giao diện sổ tay bìa cứng) đều được giữ nguyên vẹn.

- Chỉ có hai trường hợp tiện ích sẽ đọc văn bản trò chuyện của Tavern, và cả hai đều phải do bạn tự mở: chế độ kiểm tu (mỗi lần gửi tin nhắn sẽ đính kèm từ 0～10 tầng trò chuyện gần đây, có thể điều chỉnh) và quan sát trò chuyện (sau khi bật, chỉ xem các tầng mới xuất hiện). Nội dung đọc được chỉ gửi đến API dùng để trò chuyện của pet màn hình.
- Chỉ có chế độ kiểm tu mới sửa cơ sở dữ liệu: mỗi mục đều cần bạn đánh dấu chọn, nhấn **Áp dụng mục đã chọn** mới ghi; việc ghi chỉ đi qua `AutoCardUpdaterAPI` công khai của cơ sở dữ liệu, sao lưu toàn bộ trước khi ghi và có thể hoàn tác. Không có tính năng tự động áp dụng.
- Ngoài ra, vẫn duy trì cơ chế đồng bộ chỉ đọc: không sao chép, không thay thế cơ sở dữ liệu, bình thường không đọc/ghi bảng biểu.
- Vị trí của pet màn hình chỉ thay đổi khi người dùng kéo thả thủ công; không khôi phục việc tự động di chuyển.
- Hình ảnh của Naidan được đọc từ cơ sở dữ liệu đang chạy lúc runtime, không phân phối kèm tiện ích này; khi cơ sở dữ liệu không mở thì không thể chuyển sang Naidan.
- Vé hoa được đổi thủ công từ xu vàng trong sổ tay cuộc sống, mua trang phục trừ vé hoa. Lối chơi sinh hoạt không gọi API, không đọc/ghi cơ sở dữ liệu và văn bản Tavern.

Các phiên bản cũ từng thêm tính năng tự động di chuyển, chạy bộ và đi dạo. Những logic đó đã được hoàn tác từ **v0.5.8**, không nên nhầm lẫn hành vi của phiên bản cũ với phiên bản hiện tại.

Đối chiếu theo 4 mục dưới đây, tất cả đều hiển thị `0.9.3` thì mới tính là nguồn bảo trì hiện tại đã cập nhật hoàn chỉnh:

1. Mở [`manifest.json`](manifest.json) ở thư mục gốc của kho lưu trữ, kiểm tra xem `version` có phải là `0.9.3` không.
2. Kiểm tra phần "Phiên bản hiện tại" ở đầu README này xem có phải là **v0.9.3** không.
3. Kiểm tra xem lần commit GitHub gần nhất có chứa các tệp chỉnh sửa của lần này không; v0.9.3 bắt buộc phải có `life-model.js`, `life-window.js`, `skin-model.js`, `index.js`, `style.css` đã cập nhật, cùng với **27 ảnh WebP, hướng dẫn tư liệu và danh mục media** trong thư mục `assets/skins/erii-purple-night/`; đồng thời vẫn giữ lại `repair.js`, `repair-ticket.js`, `database-repair.js`, `backup-store.js`, `watch.js` của v0.9.0, thư mục `characters/`, `characters.js`, `care-model.js`, `lines.js`, `notebook.js`, `pet-house.js`, `sheet.js`, `effects.js`, `icons.js`, `database-shortcuts.js` của v0.8.0, cùng 19 ảnh trong `assets/zero/` và 7 ảnh trong `assets/zero/life/`; các tệp `assets/run-*.webp` đã bị xóa.
4. Nếu dùng file nén, tên file phải là `绘梨衣桌宠-独立扩展-v0.9.3.zip`, sau khi giải nén thì `manifest.json` vẫn phải là `0.9.3`.

Phiên bản hiển thị trong danh sách tiện ích của Tavern là phiên bản được tải thực tế. Chỉ nhìn thấy README trên GitHub đã cập nhật không chứng minh được Tavern đã tải bản mới; hãy cập nhật tiện ích và làm mới trang rồi mới đối chiếu lại số phiên bản trong Tavern.

### Cài đặt lần đầu

1. Mở phần **Tiện ích mở rộng** → **Cài đặt tiện ích mở rộng** ở thanh trên cùng của Tavern.
2. Dán địa chỉ kho lưu trữ: `https://github.com/dzsks/xiaohuizhuochong` (hoặc link fork tiếng Việt của bạn).
3. Sau khi cài đặt hoặc cập nhật xong, hãy làm mới trang Tavern.
4. Trong danh sách tiện ích, xác nhận phiên bản của **Tiểu Erii · Pet màn hình cơ sở dữ liệu** là `0.9.3`.
5. Nhấp chuột phải vào pet màn hình trên máy tính, hoặc nhấn giữ khoảng 1.4 giây trên điện thoại để mở cuốn sổ nhỏ; nếu thấy "Đã kết nối cơ sở dữ liệu" hoặc "Cơ sở dữ liệu đang xử lý nhiệm vụ", điều đó có nghĩa là đã tìm thấy nguồn dữ liệu của cơ sở dữ liệu.

Thư mục gốc của kho lưu trữ phải chứa trực tiếp các tệp `manifest.json`, `index.js`, `style.css`, v.v., không được bọc thêm một lớp thư mục bên ngoài. Hình ảnh nằm trong thư mục `assets/` ở thư mục gốc.

## Cập nhật bản cài đặt hiện có

1. Ghi đè các tệp phiên bản mới lên cùng một thư mục gốc của kho lưu trữ, giữ nguyên cấu trúc thư mục của `assets/`.
2. Commit các thay đổi lên GitHub.
3. Quay lại trình quản lý tiện ích của Tavern, nhấp vào nút cập nhật của tiện ích này.
4. Làm mới trang Tavern, xác nhận phiên bản trong danh sách tiện ích là `0.9.3`.
5. Nếu hành vi hoặc hình ảnh vẫn là của bản cũ, trước tiên hãy tải lại tiện ích; nếu vẫn không thay đổi, dùng <kbd>Ctrl</kbd>+<kbd>F5</kbd> để buộc làm mới bộ nhớ cache của trình duyệt.

Gói bảo trì hiện tại: `绘梨衣桌宠-独立扩展-v0.9.3.zip`.

- `version` trong `manifest.json` là `0.9.3`;
- Dấu phiên bản pet màn hình trong `index.js` là `0.9.3`;
- Thư mục gốc có `skin-model.js`, giá Lễ phục Dạ tím là 10320, loại tiền tệ là `tickets`;
- `assets/skins/erii-purple-night/` bao gồm đầy đủ 27 tệp WebP, thiếu hình ảnh thì không được chỉ tải lên mã nguồn;
- Trong `assets/` không có các frame chạy trái phải, `assets/zero/` và `assets/zero/life/` đều có mặt đầy đủ;
- Mục mới nhất ở đầu README và lịch sử phiên bản đều là `v0.9.3`.

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
| Kéo thả | Bị nhấc lên, thả tay ra sẽ ngồi vững và lưu vị trí |
| Nhấp chuột phải (PC) | Mở / Thu gọn cuốn sổ nhỏ |

Cách tương tác của Zero và Naidan cũng tương tự, chỉ thay đổi hành động thành nét riêng của từng nhân vật: Zero ôm thiên nga đen nhỏ, gấp thiên nga giấy, uống ca cao nóng; Naidan sợ nhột khi nhấp đúp, nhấp liên tục sẽ tức giận khè khè, nhấn giữ thì ngồi ngáy ngủ. Các hành động nhấp chuột, tặng hoa, cùng bạn điền bảng đều làm tăng một chút độ thân mật (xem mục "Nuôi dưỡng"). Thỉnh thoảng nhấp một cái, pet màn hình sẽ đáp lại một câu trong bong bóng thoại.

Tiêu đề của cuốn sổ nhỏ là tên của nhân vật hiện tại, ví dụ: **Cuốn sổ nhỏ của Tiểu Erii**, **Cuốn sổ nhỏ của Zero**, không hiển thị số phiên bản. Nhấp chuột thông thường sẽ không mở trang; trên máy tính cũng có thể vào cuốn sổ nhỏ từ phần cài đặt tiện ích. Sau khi tắt "Hiển thị pet màn hình", vẫn có thể mở cuốn sổ nhỏ từ cài đặt tiện ích để xem nhiệm vụ và mở cơ sở dữ liệu; trong thời gian ẩn, các nút hành động giải trí sẽ bị vô hiệu hóa. Khi đang chọn pet màn hình, phím <kbd>Enter</kbd> / <kbd>Space</kbd> dùng để tương tác, <kbd>Shift</kbd>+<kbd>Enter</kbd> để mở cuốn sổ nhỏ, các phím mũi tên để tinh chỉnh vị trí, <kbd>Home</kbd> để đặt lại vị trí ban đầu.

### Thao tác trên điện thoại

Điện thoại không có chuột phải, hãy sử dụng các thao tác sau:

- Chạm nhẹ hoặc nhấn ngắn: Tương tác;
- Nhấn giữ khoảng nửa giây: Chợp mắt;
- Tiếp tục nhấn giữ khoảng 1.4 giây: Mở cuốn sổ nhỏ;
- Nhấn giữ và di chuyển: Kéo di chuyển Tiểu Erii.

Khi khung nhập liệu phình to, bàn phím ảo hiện ra, xoay màn hình hoặc khung nhìn hẹp lại, pet màn hình sẽ tự giới hạn trong khu vực hiển thị và tránh đè lên khung nhập liệu. Cuốn sổ nhỏ, cửa sổ trò chuyện, sổ tay cuộc sống và nhà pet màn hình trên điện thoại đều được kéo lên từ đáy màn hình, nhấn giữ phần đầu kéo xuống là có thể đóng lại; trên máy tính, chúng là các cửa sổ nổi có thể kéo thanh tiêu đề, cuốn sổ nhỏ luôn bám sát cạnh pet màn hình và cố gắng không che khuất nhân vật.

### Phản ứng với nhiệm vụ cơ sở dữ liệu

- Nhận được nhiệm vụ: Giơ cuốn sổ nhỏ lên;
- Đang xử lý nhiệm vụ: Ghi chép;
- Thành công: Hiển thị bản ghi hoàn thành;
- Lỗi hoặc cảnh báo: Kiểm tra bản ghi;
- Rảnh rỗi: Uống trà, đọc sách, gấp giấy, ôm vịt vàng, vươn vai, chợp mắt, v.v.

Ngoài hành động, pet màn hình còn hiển thị một câu thoại phía trên bong bóng nhiệm vụ: có các bộ thoại riêng cho lúc nhận nhiệm vụ, đang xử lý (khoảng 15 giây đổi một câu), hoàn thành, gặp lỗi, hoặc khi bạn nhấn dừng; lời thoại cho việc điền bảng, thúc đẩy cốt truyện và các nhiệm vụ khác cũng khác nhau. Lời thoại thay đổi theo tính cách, độ thân mật và tâm trạng của nhân vật, ví dụ khi đói bụng sẽ lầm bầm một câu rồi mới làm tiếp. Lời thoại hoàn toàn là văn bản cục bộ đã được thiết lập sẵn, không gọi API, không phát sinh chi phí. Dòng chữ nhỏ bên dưới vẫn là tiến độ thực tế do cơ sở dữ liệu cung cấp (cài đặt bản tóm tắt / bản đầy đủ vẫn giữ nguyên). Bạn có thể tắt lời thoại qua mục "Nói chuyện khi làm nhiệm vụ" trong cài đặt tiện ích.

Khi có lỗi hoặc cảnh báo, bong bóng sẽ dừng lại lâu hơn một chút (khoảng 9 giây) và hiển thị thêm nút **Đi xem thử**: các lỗi liên quan đến API (API, khóa, hạn mức, quá thời gian, v.v.) sẽ mở bảng API của cơ sở dữ liệu, các lỗi khác sẽ mở "Nhật ký chạy" trong mục "Công cụ nâng cao".

Phản ứng khi đang xử lý nhiệm vụ và thông báo kết quả/lỗi luôn được ưu tiên hơn các hành động giải trí cục bộ. Nếu bong bóng cung cấp nút dừng cho nhiệm vụ gốc của cơ sở dữ liệu, Tiểu Erii sẽ hiển thị **Dừng nhiệm vụ**, nhấp vào sẽ kích hoạt quy trình dừng ban đầu của cơ sở dữ liệu; nếu không có khả năng dừng thì sẽ không tạo nút giả. Mục tiêu dừng sẽ bám sát nhiệm vụ hiện tại của cơ sở dữ liệu, kiểm tra lại trước khi nhấp; nếu nhiệm vụ đã chuyển sang thao tác khác, hệ thống sẽ yêu cầu xác nhận trước, không gọi thao tác của nhiệm vụ cũ. Thông báo dừng thất bại được giữ lại khoảng 8 giây, thông báo lỗi cơ sở dữ liệu được ưu tiên hiển thị hơn văn bản tiến độ thông thường. Khi bong bóng gốc chuyển sang câu bông đùa hoặc thông báo và tạm thời không có nhiệm vụ hiện hành, Tiểu Erii sẽ hiển thị trạng thái chờ đồng bộ tiến độ, sau khi nhiệm vụ xuất hiện lại sẽ khôi phục nút dừng.

### Ló đầu ở mép màn hình và những câu chuyện nhỏ

- **Cách kích hoạt ló đầu:** Kéo Tiểu Erii sang sát mép trái, phải, trên hoặc dưới, thả tay ra cô ấy sẽ thu mình và ló đầu ra ngay, không cần chờ đếm lùi hay dời chuột đi. Nếu vị trí mặc định đã sát mép thì cũng sẽ ló đầu ra lập tức. Mép dưới sẽ tự động tránh thanh nhập liệu và hiển thị ở vùng khả dụng phía trên.
- **Vị trí có bị thay đổi không:** Hành động ló đầu chỉ đổi tư thế và khẽ đung đưa tại chỗ, không làm thay đổi tọa độ đã lưu, cũng không khôi phục việc tự đi lại. Khi nhấp chuột, nhấn giữ, kéo thả, mở cuốn sổ nhỏ hoặc nhận nhiệm vụ sẽ khôi phục lại tư thế tương ứng; di chuột qua sẽ không hủy trạng thái ló đầu. Sau khi kết thúc tương tác, nếu vẫn ở sát mép, cô ấy sẽ tiếp tục ló đầu ngay.
- **Cách nghe kể chuyện:** Nhấp vào "Nghe một mẩu chuyện nhỏ" trong cuốn sổ nhỏ. Sau khi bong bóng mở ra, cứ mỗi 30 giây sẽ tự động đổi câu chuyện mới, luân phiên 12 mẩu chuyện, không lặp lại trong cùng một vòng; bạn cũng có thể nhấp vào "Đổi câu khác" để chuyển ngay, hoặc đóng lại bằng dấu ×. Sau khi đóng sẽ kết thúc vòng lặp kể chuyện này.
- **Chủ động kể chuyện:** Tự kích hoạt sau khi rảnh rỗi khoảng 5 phút; trong lúc hiển thị sẽ đổi mẩu chuyện mỗi 30 giây. Khi trỏ chuột vào hoặc focus bàn phím vào bong bóng sẽ tạm dừng đếm thời gian, khi dời đi sẽ tiếp tục thời gian còn lại; trên điện thoại, việc chạm vào câu chuyện sẽ giữ nguyên trạng thái đọc, sau khi đọc xong có thể chủ động đổi câu khác hoặc đóng lại.
- **Ưu tiên nhiệm vụ:** Khi cơ sở dữ liệu bắt đầu xử lý, gửi thông báo kết quả hoặc khi tắt hiển thị Tiểu Erii, câu chuyện sẽ tự thu lại. Bong bóng nhiệm vụ và nút dừng của nhiệm vụ gốc luôn được ưu tiên; câu chuyện không gọi mô hình AI, không gửi tin nhắn trò chuyện và không ghi vào cơ sở dữ liệu.
- **Công tắc điều khiển:** Trong cài đặt tiện ích có thể bật/tắt riêng "Kéo đến mép để ló đầu" và "Kể chuyện nhỏ khi rảnh rỗi". Sau khi tắt tự động kể chuyện lúc rảnh rỗi, bạn vẫn có thể bấm thủ công "Nghe một mẩu chuyện nhỏ", và tính năng tự đổi câu chuyện mỗi 30 giây vẫn hoạt động bình thường; quy tắc tạm dừng khi đọc vẫn có hiệu lực đầy đủ.

## Đổi pet màn hình: Nhà pet màn hình

Cách mở: Mục **Nhà pet màn hình** ở cuối cuốn sổ nhỏ, hoặc thông qua nút nhân vật và "Nhà pet màn hình" trong **Cài đặt tiện ích → Pet màn hình cơ sở dữ liệu**. Căn nhà được thiết kế như một cuốn bách khoa toàn thư mở: trang bên trái là hình đứng và hiệu ứng luồng sáng, trang bên phải là hồ sơ bồi dưỡng nhân vật. Nhấp vào các dải thẻ đánh dấu (ribbon) ở trên cùng để lật trang nhân vật, nhấn **Đổi sang đồng hành cùng tôi** để chuyển đổi, nhân vật cũ sẽ vẫy tay rút lui, người mới sẽ đáp xuống chào hỏi.

| Nhân vật | Tóm tắt | Ghi chú |
| --- | --- | --- |
| Tiểu Erii (Erii) | Nàng phù thủy tóc đỏ trầm lặng, thích vịt vàng nhỏ, bánh pudding và chơi game | Nhân vật mặc định, tài nguyên và hành vi tương thích hoàn toàn |
| Zero | Thiếu nữ tóc vàng với đôi mắt băng giá, ít nói, làm việc vô cùng tỉ mỉ, trên đầu có chú thiên nga đen nhỏ | Bổ sung 26 ảnh (19 ảnh chính, 7 ảnh sinh hoạt) |
| Naidan | Cậu nhóc tròn trịa màu vàng sữa đi kèm cơ sở dữ liệu, ham ăn, thích lăn lộn | Ảnh được đọc từ cơ sở dữ liệu lúc runtime; nếu cơ sở dữ liệu chưa bật hoặc tắt pet đi kèm thì không thể chuyển đổi, nhà pet sẽ ghi rõ lý do |

Sau khi đổi nhân vật:

- **Dùng chung:** Vị trí và kích thước pet màn hình, các công tắc cài đặt, ví tiền gia đình.
- **Tách biệt theo từng nhân vật:** Lịch sử trò chuyện, cách xưng hô và thiết lập tính cách, độ thân mật, chỉ số nhu cầu, nhật ký trưởng thành, biệt danh, công việc làm thêm hoặc bữa ăn đang diễn ra, trang phục sở hữu và đang mặc.
- Lần đầu trò chuyện với nhân vật mới sẽ kế thừa cấu hình kết nối của Tiểu Erii (địa chỉ API, mô hình, độ dài phản hồi...), không cần nhập lại; khóa API lưu trên thiết bị vốn dùng chung.
- Nhân vật đang làm việc nếu bị đổi xuống sẽ tiếp tục làm việc ngầm trong nền, khi tan làm bong bóng thoại của pet hiện tại sẽ nhắc bạn nhận lương.

## Nuôi dưỡng

Hệ thống nuôi dưỡng hoàn toàn không có cơ chế trừng phạt: độ thân mật chỉ tăng chứ không giảm; chỉ số nhu cầu nếu thấp chỉ ảnh hưởng đến tâm trạng và lời thoại, không sinh bệnh, không bỏ đi và không cấm làm việc.

- **Độ thân mật**: Chia làm 5 cấp bậc: Mới quen, Quen thuộc, Thân thiết, Tin cậy, Yêu thương sâu đậm; mỗi nhân vật tính riêng. Tương tác vuốt ve +1 (tối đa 20 lần/ngày), tặng hoa +5 (tối đa 3 lần/ngày), mời ăn cơm +3～+8, nhận lương +3, trò chuyện một lượt +2 (tối đa 20 lượt/ngày), lần đầu gặp gỡ mỗi ngày +5, cùng bạn hoàn thành một nhiệm vụ cơ sở dữ liệu +2 (tối đa 20 lần/ngày), chải chuốt sạch sẽ +2. Mỗi khi lên một cấp sẽ mở khóa một bộ lời thoại mới, một mẩu chuyện độc quyền và một danh hiệu.
- **Chỉ số nhu cầu**: Độ no giảm từ đầy xuống cạn mất khoảng 12 tiếng, độ sạch sẽ mất khoảng 24 tiếng, kể cả khi bạn không mở máy chỉ số vẫn giảm từ từ. Độ no hồi phục bằng cách mời ăn cơm (Pudding +15, Cơm nắm +25, Cơm cuộn trứng +40, Ramen +50); độ sạch sẽ hồi phục bằng cách nhấn vào **Chải chuốt** trong cuốn sổ nhỏ hoặc nhà pet (miễn phí, thời gian hồi 30 phút). Trong cài đặt tiện ích có thể tắt các chỉ số nhu cầu này, sau khi tắt các con số sẽ đóng băng và không hiển thị nữa.
- **Tâm trạng**: Lo lắng (cơ sở dữ liệu vừa báo lỗi), Đói bụng, Muốn chải chuốt, Nhớ bạn (lâu ngày chưa tương tác), Vui vẻ, Bình tĩnh. Tâm trạng chỉ quyết định lời thoại và con dấu tâm trạng trong nhà pet.
- **Nhật ký trưởng thành**: Mục **Nhật ký trưởng thành** trong nhà pet ghi lại các cột mốc: ngày đầu quen biết, lần đầu ăn ramen, cùng hoàn thành nhiệm vụ cơ sở dữ liệu lần thứ 100; các mẩu chuyện độc quyền đã mở khóa cũng được xem tại đây.
- **Biệt danh**: Bấm vào biểu tượng cây bút cạnh tên trong nhà pet để đặt biệt danh cho nhân vật, cách xưng hô trên giao diện và lời thoại sẽ thay đổi theo; để trống để khôi phục tên gốc.
- **Lời chào mỗi ngày**: Lần đầu gặp gỡ mỗi ngày, pet màn hình sẽ chào hỏi tùy theo buổi sáng, trưa, chiều tối và mức độ thân mật của hai bạn, đồng thời ghi nhận thêm một ngày trong "Số ngày đồng hành".
- **Trợ cấp sinh hoạt**: Khi ví tiền gia đình còn dưới 5 xu vàng, mỗi ngày có thể vào Sổ tay cuộc sống để nhận 8 xu vàng một lần, vừa đủ để mua một phần cơm nắm.

Đối với người dùng nâng cấp từ bản cũ, Tiểu Erii sẽ dựa vào số lần trò chuyện, làm thêm và dùng bữa hiện có để quy đổi ra độ thân mật ban đầu (tối đa đến mức "Quen thuộc"), "Ngày đầu gặp gỡ" sẽ tính theo bản ghi trò chuyện hoặc sổ tay sớm nhất.

## Phím tắt mở bảng cơ sở dữ liệu

Trong mục "Cơ sở dữ liệu" của cuốn sổ nhỏ có một nhóm phím tắt điều hướng nhanh: **Mở cơ sở dữ liệu gốc** (Bảng điều khiển), **Bàn làm việc điền bảng**, **Thúc đẩy cốt truyện**, **Quản lý dữ liệu**, **API**, **Xem bảng** (Bảng trực quan của cơ sở dữ liệu). Trong thanh nhiệm vụ của cửa sổ trò chuyện và sổ tay cuộc sống cũng có nút **Mở cơ sở dữ liệu**.

Thao tác mở cơ sở dữ liệu sử dụng giao diện công khai `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()`; chuyển đến bảng chỉ định tương đương với việc nhấp chuyển trang trên thanh bên giúp bạn, chỉ đổi giao diện chứ không đọc/ghi bảng biểu, không gọi thao tác nhiệm vụ. Nếu một trang nào đó không có trong phiên bản cơ sở dữ liệu hiện tại của bạn, nút bấm sẽ chỉ mở cơ sở dữ liệu và giải thích lý do; khi không tìm thấy cơ sở dữ liệu, cuốn sổ nhỏ sẽ nhắc bạn kích hoạt cơ sở dữ liệu trước.

## Ngoại hình và Hiệu ứng

Giao diện mang phong cách "Sổ tay bìa cứng": vân giấy, viền ép kim mờ, họa tiết và con dấu, ba nhân vật sở hữu ba bộ màu sắc riêng biệt. Mục **Hiệu ứng** trong cài đặt tiện ích có 4 mức: Tự động (Màn hình PC hiển thị rực rỡ, điện thoại hiển thị đơn giản), Rực rỡ, Đơn giản, Tắt. Mức "Rực rỡ" sẽ kích hoạt hiệu ứng rải cánh hoa, bông tuyết hoặc ánh sao khi tặng hoa, thăng cấp, hoặc đổi nhân vật; khung ảnh đứng của nhà pet màn hình có dải cực quang chuyển động mượt mà bằng WebGL; mức "Đơn giản" chỉ giữ lại một lượng nhỏ hạt phân tử (Canvas2D); nếu hệ thống bật chế độ "Giảm chuyển động", hiệu ứng sẽ tự động tắt. Khi chuyển tab sang chạy ngầm hoặc đóng giao diện, toàn bộ hoạt ảnh đồ họa sẽ lập tức dừng lại.

## Đi làm, Kiếm tiền và Dùng bữa

Nhấp chuột phải trên PC hoặc nhấn giữ trên điện thoại để mở cuốn sổ nhỏ, chọn **Sổ tay cuộc sống**; bạn cũng có thể mở từ phần cài đặt tiện ích. Phía trên cùng cửa sổ có thể chọn phân công nhân vật: ví tiền dùng chung cho cả gia đình, các hoạt động làm việc, ăn uống và thay trang phục được tính riêng cho từng người; các nhân vật có thể đến các địa điểm khác nhau cùng lúc. Sổ tay gồm bốn tab: **Đi làm thêm**, **Ăn món ngon**, **Trang phục**, **Sổ cái nhỏ**.

### Công việc và Tiền lương

| Công việc | Nhiệm vụ | Thời gian | Lương |
| --- | --- | --- | --- |
| Tiệm sách | Đặt sách mới lên kệ | 1 Phút | 10 Xu vàng |
| Tiệm tráng miệng | Phụ chuẩn bị đồ ngọt | 2 Phút | 18 Xu vàng |
| Tiệm hoa | Sắp xếp bó hoa, thay nước | 3 Phút | 25 Xu vàng |

1. Chọn công việc trong mục **Đi làm thêm**. Mỗi nhân vật chỉ thực hiện một hoạt động tại một thời điểm.
2. Sổ tay và bong bóng thoại sẽ đếm ngược thời gian còn lại, pet màn hình đổi sang trang phục làm việc và cử động nhẹ nhàng tại chỗ.
3. Khi hoàn thành, nhấn **Nhận tiền lương**. Bạn cũng có thể đóng sổ tay lại và bấm nhận trực tiếp trên bong bóng thoại khi tan làm.
4. Mỗi nhân vật phải hoàn tất nhận lương thì mới có thể bắt đầu công việc tiếp theo hoặc mua đồ ăn. Lương chưa nhận sẽ được lưu giữ vĩnh viễn, không có thời hạn hết hạn.

Thao tác **Tan làm sớm** yêu cầu bấm xác nhận thêm một lần: dừng công việc đang làm dở, không nhận được lương nhưng cũng không bị trừ xu vàng. Những công việc đã hoàn thành sẽ chỉ có nút nhận lương, không thể bấm nhầm hủy bỏ.

### Mời pet ăn cơm

| Món ăn | Giá cả | Thời gian ăn |
| --- | --- | --- |
| Pudding | 5 Xu vàng | 8 Giây |
| Cơm nắm | 8 Xu vàng | 9 Giây |
| Cơm cuộn trứng | 15 Xu vàng | 10 Giây |
| Ramen | 20 Xu vàng | 12 Giây |

Mua tại mục **Ăn món ngon**, sau khi bấm xác nhận hệ thống sẽ trừ xu vàng và bắt đầu dùng bữa, ăn xong độ no sẽ tăng lên. Khi số dư không đủ hoặc đang bận làm việc khác, nút mua sẽ bị vô hiệu hóa. Bữa ăn hoàn tất sẽ được ghi vào sổ cái nhỏ; bốn món ăn có 4 bộ hình ảnh riêng biệt: Pudding dùng thìa nhỏ ăn bánh flan caramel, cơm nắm cầm tay bọc rong biển, cơm cuộn trứng dùng thìa xúc trứng vàng ươm, mì ramen dùng đũa gắp sợi mì. Thẻ gọi món, ảnh minh họa trong sổ tay và pet ngoài màn hình đều đồng bộ hình ảnh tương ứng. Chỉ số nhu cầu chỉ tác động tới tâm trạng và lời thoại, không có phạt bỏ đói hay ép ăn.

### Thay trang phục (Skin)

Trang thứ ba của Sổ tay cuộc sống là **Trang phục**; nút **Thay đồ cho cô ấy** trong nhà pet cũng có thể dẫn thẳng vào đây. Mỗi nhân vật luôn sở hữu sẵn một bộ trang phục mặc định hoàn toàn miễn phí.

Bộ trang phục mới của Tiểu Erii trong bản này là **Lễ phục Dạ tím Tsukuyomi**, chỉ dành riêng cho Erii:

| Nội dung | Chi tiết |
| --- | --- |
| Giá trang phục | 10.320 Vé hoa |
| Tỷ lệ quy đổi | 1 Xu vàng → 40 Vé hoa |
| Tích lũy từ 0 vé hoa | 258 Xu vàng |
| Sở hữu ban đầu | Không, cần mua trong cửa hàng |

1. Đi làm thêm, sau khi hoàn thành bấm nhận tiền lương thủ công.
2. Tại mục **Đổi vé hoa** ở trang phục, nhập số lượng xu vàng nguyên dương muốn đổi. Bên cạnh sẽ hiển thị số vé hoa dự kiến nhận được; bạn cũng có thể bấm **Điền số xu vàng cần để mua trang phục**, thao tác này chỉ điền số hộ bạn chứ chưa trừ tiền.
3. Bấm **Đổi vé hoa**, hệ thống mới trừ xu vàng và cộng thêm vé hoa vào ví. Nếu không đủ xu vàng hoặc số lượng không hợp lệ sẽ không thể đổi; vé hoa không thể đổi ngược lại thành xu vàng, vé hoa chưa dùng hết sẽ được giữ nguyên.
4. Khi đủ vé hoa, nhấn vào **Mua · 10.320 vé hoa** trên thẻ trang phục. Thao tác mua chỉ thực hiện một lần, không tự động mặc lên người và không trừ tiền lặp lại.
5. Nhấn **Mặc vào**. Sau đó bạn có thể chuyển qua lại giữa trang phục mặc định và bộ lễ phục này hoàn toàn miễn phí bất cứ lúc nào.

- Trang phục mới bao gồm 27 bức ảnh: phủ kín 16 tư thế chờ/nhiệm vụ/tương tác, 4 tư thế ló đầu ở mép, 3 hình làm thêm và 4 hình ăn uống độc lập. Pet màn hình, avatar cuốn sổ nhỏ và chat, ảnh minh họa sinh hoạt, menu món ăn, hình đứng nhà pet đều đồng bộ đổi sang trang phục mới; bong bóng thoại và sổ tay chuyển sang tông màu tím nhạt thanh lịch.
- Thiết kế giữ lại găng tay voan đen mỏng, nơ bướm màu tím ở cổ và giày. Động tác ôm vịt giữ lại chú vịt trong lòng, các động tác khác giữ lại vịt con trên đầu; hình ảnh của trang phục mặc định gốc không bị can thiệp.
- Xu vàng và vé hoa nằm trong ví tiền dùng chung của gia đình; trang phục thuộc quyền sở hữu riêng của từng nhân vật, mua cho Erii sẽ không dùng chung cho Zero hay Naidan. Việc chuyển nhân vật, làm mới trang, đóng cửa sổ đều bảo lưu toàn vẹn dữ liệu.
- Thay trang phục không chiếm dụng lượt hoạt động làm việc hay ăn uống; khi cơ sở dữ liệu đang bận bạn vẫn có thể đổi vé hoa và thay đồ. Tính năng này không phát sinh yêu cầu API mới và không có việc tự động đi lại.
- Thư mục trang phục thanh toán bằng xu vàng của bản cũ vẫn tương thích; thuộc tính `currency: 'tickets'` trong cấu hình biểu thị thanh toán bằng vé hoa, nếu không khai báo sẽ mặc định thanh toán bằng xu vàng.

### Lưu trữ dữ liệu và Nhiệm vụ Cơ sở dữ liệu

- Ví tiền ban đầu có 0 xu vàng, 0 vé hoa, trang phục mới chưa sở hữu. Công việc do bạn chủ động bắt đầu, không tự động nhận tiếp hay treo máy kiếm tiền vô hạn; khi tiền gần cạn có thể nhận trợ cấp sinh hoạt mỗi ngày một lần.
- Xu vàng, vé hoa, lịch sử đổi và chi tiêu vé hoa, hoạt động hiện tại, tổng số lần làm thêm/dùng bữa và 20 bản ghi sổ cái gần nhất được lưu trong cấu hình tiện ích của tài khoản Tavern hiện hành; trang phục sở hữu và đang mặc cũng lưu tại đó (trường `skins`), phân chia theo từng nhân vật.
- Công việc đã bắt đầu sẽ tính giờ theo thời gian thực của thiết bị. Khi đóng cửa sổ, làm mới trang hoặc tạm rời đi, khi quay lại đồng hồ vẫn tiếp tục chạy hoặc hiển thị trạng thái chờ nhận lương; bữa ăn diễn ra lúc ngoại tuyến chỉ quyết toán một lần duy nhất, không trừ tiền lặp lại.
- Khi nhiệm vụ cơ sở dữ liệu xuất hiện, động tác, bong bóng thoại và nút dừng của nhiệm vụ gốc luôn được ưu tiên; sổ tay cuộc sống cũng cung cấp nút dừng cho tác vụ cơ sở dữ liệu gốc. Tiến trình đếm giờ làm thêm vẫn chạy bình thường, sau khi cơ sở dữ liệu hoàn thành nhiệm vụ bạn mới có thể nhận việc mới hoặc mua đồ ăn.
- Cửa sổ trò chuyện, sổ tay cuộc sống, nhà pet và cuốn sổ nhỏ mở hoàn toàn độc lập. Lối chơi sinh hoạt không gọi API ngoài, không sửa đổi bảng biểu hay văn bản của Tavern. Không có việc tự ý di chuyển.
- Hệ thống này là lối chơi cục bộ nhẹ nhàng trong cài đặt tài khoản người dùng, có cơ chế ngăn chặn việc nhận thưởng/trừ tiền trùng lặp trên cùng một trang; không có dịch vụ giao dịch ví tiền đồng thời giữa nhiều thiết bị.

## Trò chuyện cùng pet màn hình

Mỗi nhân vật sở hữu lịch sử trò chuyện, cách xưng hô và thiết lập tính cách hoàn toàn riêng biệt, chuyển đổi nhân vật sẽ không bị trộn lẫn dữ liệu. Thiết lập của Zero được bám sát nguyên tác "Long Tộc", còn Naidan là cậu bạn đồng hành tinh nghịch háu ăn (mối quan hệ mặc định là "Bạn đồng hành"); bạn có thể tự tinh chỉnh theo ý muốn trong thư mục `characters/`.

1. Nhấp chuột phải vào pet màn hình (PC) hoặc nhấn giữ khoảng 1.4 giây (điện thoại) để mở cuốn sổ nhỏ, nhấn vào **Trò chuyện cùng Tiểu Erii** (khi đổi sang Zero hay Naidan, nút bấm sẽ tự đổi tên tương ứng). Bạn cũng có thể mở trực tiếp cửa sổ trò chuyện từ Cài đặt tiện ích.
2. Mặc định sẽ chọn **Dùng API hiện tại của Tavern**, kế thừa toàn bộ kết nối, mô hình và khóa hiện hành. Hãy đảm bảo Tavern đã thiết lập sẵn kết nối hoàn thành trò chuyện (chat completion) hoặc hoàn thành văn bản (text completion) hoạt động tốt.
3. Nhập tin nhắn và nhấn **Gửi**. Trên PC, nhấn <kbd>Enter</kbd> để gửi, <kbd>Shift</kbd>+<kbd>Enter</kbd> để xuống dòng; trên điện thoại dùng phím Return để xuống dòng và chạm nút Gửi.
4. Nút **Dừng phản hồi** giúp hủy bỏ yêu cầu lần này của pet; **Thử lại** sẽ gửi lại nội dung trò chuyện chưa nhận được phản hồi. Việc đóng cửa sổ hay tắt tiện ích cũng sẽ hủy các yêu cầu trò chuyện đang chờ xử lý.
5. Nhấp vào **Cài đặt kết nối** để tùy chỉnh cách xưng hô, mối quan hệ, phong cách nói chuyện, độ dài câu trả lời và ký ức thủ công, hoặc chuyển sang chế độ **Cấu hình API riêng (Tương thích OpenAI)**.

### Cấu hình API riêng

Điền URL cơ sở (Base URL) API (ví dụ: `https://api.cua.ban/v1`) và Khóa API (Key), nhấp **Lấy danh sách mô hình**, chọn trong danh sách **Mô hình khả dụng**, kiểm tra lại **Tên mô hình** bên dưới trước khi nhấp **Lưu cài đặt**.

Bạn hoàn toàn có thể tự nhập tay tên mô hình; một số nhà cung cấp không mở API lấy danh sách, việc không lấy được danh sách không đồng nghĩa với việc kết nối trò chuyện không khả dụng. Trong lúc lấy danh sách có thể bấm **Hủy lấy**. Việc đổi URL hoặc Khóa sẽ tự động hủy các yêu cầu cũ và làm mới danh sách; đóng cửa sổ hoặc vô hiệu hóa tiện ích cũng sẽ hủy tiến trình đang gọi. Danh sách sẽ tự lọc trùng ID mô hình và sắp xếp lại, việc chọn mô hình tại đây không ảnh hưởng đến thiết lập mô hình toàn cục của Tavern.

Chế độ **Dùng API hiện tại của Tavern** sẽ bám sát theo mô hình mà Tavern đang chọn; khi bạn muốn chỉ định mô hình độc lập, hãy dùng **Cấu hình API riêng**.

Hệ thống sẽ tự nhận diện URL cơ sở nếu bạn lỡ điền sẵn đường dẫn hoàn chỉnh kết thúc bằng `/chat/completions`. Cổng kết nối riêng hỗ trợ chuẩn API chat completion tương thích OpenAI; bạn vẫn có thể sử dụng giao diện Claude / Gemini qua kết nối mặc định của Tavern.

Yêu cầu mạng được chuyển tiếp qua thiết bị đang chạy máy chủ Tavern, trình duyệt chỉ kết nối duy nhất tới Tavern. Điền `localhost` được hiểu là chính thiết bị đang chạy Tavern. Nút **Kiểm tra kết nối** sẽ gửi một yêu cầu thử nghiệm cực ngắn (có thể phát sinh chi phí nhỏ của nhà cung cấp); nội dung kiểm tra này hoàn toàn không lưu vào lịch sử trò chuyện.

Khóa API theo mặc định chỉ lưu trong phiên làm việc hiện tại, tải lại trang sẽ cần nhập lại. Đánh dấu chọn **Ghi nhớ khóa trên thiết bị này** sẽ lưu vào bộ nhớ cục bộ trình duyệt; bỏ chọn và lưu lại sẽ xóa khóa khỏi thiết bị. Khóa không bao giờ bị ghi vào cài đặt tiện ích, prompt trò chuyện hay gói cài đặt.

### Thao tác tin nhắn và bản nháp

- **Sao chép**: Mọi tin nhắn đều có thể sao chép nhanh qua nút bấm. Nếu trình duyệt chặn quyền clipboard tự động, bạn có thể bôi đen văn bản để sao chép thủ công.
- **Tạo lại câu trả lời**: Nằm ở phía dưới cùng của câu trả lời thành công gần nhất, dùng để yêu cầu AI trả lời lại câu hỏi đó. Phản hồi mới tạo thành công mới thay thế câu cũ; nếu bị hủy hoặc báo lỗi thì nội dung gốc vẫn được bảo toàn. Hệ thống không lưu nhiều nhánh câu trả lời rẽ nhánh.
- **Chỉnh sửa rồi gửi lại**: Cho phép sửa lại tin nhắn người dùng gần nhất và yêu cầu pet phản hồi lại một lượt mới. Chỉ khi thành công mới cập nhật bản ghi. Bấm "Hủy chỉnh sửa" sẽ khôi phục lại bản nháp ban đầu.
- **Lưu bản nháp tự động**: Ô nhập liệu thông thường và nội dung đang chỉnh sửa dở dang đều được tự động lưu nháp. Bạn đóng cửa sổ hoặc làm mới trang web vẫn có thể viết tiếp nội dung cũ.
- **Xuất dữ liệu**: Xuất toàn bộ lịch sử trò chuyện hiện tại thành tệp `.txt` bao gồm tên người nói, nội dung và mốc thời gian; không đính kèm thông tin nhạy cảm như khóa API hay ký ức riêng tư.
- **Xóa bản ghi**: Thao tác yêu cầu bấm xác nhận thêm một lần. Xóa lịch sử trò chuyện không làm ảnh hưởng đến cấu hình kết nối và ký ức thủ công; hai mục này có thể chỉnh sửa trong Cài đặt kết nối.

Tin nhắn hiển thị rõ ảnh đại diện và mốc thời gian; các tin nhắn cũ từ phiên bản trước không có mốc thời gian vẫn đọc được bình thường mà không tự tạo thời gian giả. Trong lúc chờ API, giao diện hiển thị thông báo pet đang soạn lời hồi đáp; ở phiên bản hiện tại, phản hồi được trả về nguyên khối (non-streaming).

Khi đang cuộn lên xem lại tin nhắn cũ, nếu có câu trả lời mới xuất hiện khung chat sẽ không tự động nhảy tuột xuống đáy, bạn chỉ cần bấm "Quay lại tin nhắn mới nhất". Trên PC có thể kéo mép thanh tiêu đề ↔ để mở rộng kích thước cửa sổ; trên điện thoại khung nhập liệu tự động co giãn theo nội dung và chừa khoảng trống cho bàn phím ảo.

Khi lịch sử trống, các nút gợi ý chủ đề chỉ hỗ trợ điền sẵn chữ vào khung nhập liệu, bạn cần bấm nút Gửi thì tin nhắn mới phát đi, không tự động gửi ngầm.

### Phong cách trò chuyện và Ký ức thủ công

Bạn có thể tùy chỉnh trong **Cài đặt kết nối → Bạn và Tiểu Erii**:

- **Trò chuyện tự nhiên**: Độ dài phản hồi linh hoạt theo chủ đề, tập trung vào việc hồi đáp chi tiết, chân thật.
- **Bầu bạn ngắn gọn**: Thường gói gọn trong 1 đến 3 câu, hạn chế dài dòng lan man.
- **Giao tiếp chi tiết**: Khi hỏi han nghiêm túc sẽ phân tích đầy đủ, giao tiếp thường ngày vẫn giữ nét tự nhiên.
- **Mong muốn pet ghi nhớ**: Cho phép ghi tối đa 2.000 ký tự (thói quen xưng hô, sở thích, hoàn cảnh cá nhân), sau khi lưu sẽ được đính kèm vào mỗi yêu cầu gửi đi; bạn có thể chỉnh sửa hoặc xóa bất cứ lúc nào.

Dữ liệu ký ức này hoàn toàn do bạn nhập thủ công, hệ thống không tự động trích xuất từ nội dung trò chuyện, không gọi AI tóm tắt gây tốn chi phí và không đọc trộm dữ liệu bảng biểu hay văn bản của Tavern. Phong cách giao tiếp được truyền đạt qua câu lệnh định hình (prompt), chất lượng câu trả lời phụ thuộc vào mô hình AI bạn chọn; mục "Giới hạn độ dài phản hồi" giúp kiểm soát số lượng token trả về.

### Câu lệnh định hình (Prompt) và Lưu trữ bản ghi

Prompt tích hợp sẵn được tái cấu trúc từ các bộ preset do người dùng tạo (chế độ chat, tính cách, thói quen), mặc định thiết lập mối quan hệ thân thiết; bạn có thể tự chỉnh thành quan hệ bạn bè hoặc thiết lập khác. Toàn bộ sử dụng văn bản thuần, không phụ thuộc vào macro của Tavern, world info/lorebook, regex hay script cốt truyện. Tệp quản lý prompt là `chat-prompt.js`.

Lịch sử trò chuyện được lưu độc lập trong thiết lập tiện ích của tài khoản Tavern hiện hành, giới hạn tối đa 100 dòng (khoảng 128.000 ký tự). Mỗi yêu cầu gửi đi sẽ kèm theo khoảng 40 lượt hội thoại gần nhất (tương đương 24.000 ký tự); tuyệt đối không tự ý gom thêm văn bản từ Tavern, thẻ nhân vật hay cơ sở dữ liệu. Nút **Xóa bản ghi** yêu cầu xác nhận lần hai để tránh bấm nhầm.

Cửa sổ chat hiển thị độc lập: trên PC có thể kéo thanh tiêu đề di chuyển tự do, trên điện thoại tự động căn chỉnh toàn màn hình. Trong lúc đợi phản hồi, Tiểu Erii sẽ làm động tác ghi chép, nhận được tin sẽ vẫy tay chào; khi đang chat tính năng tự động kể chuyện sẽ tạm dừng. Nhiệm vụ cơ sở dữ liệu sẽ hiển thị ở dải thông tin phía trên cửa sổ chat và có nút **Dừng nhiệm vụ** riêng biệt.

### Phạm vi tương thích của API hiện tại

- Kết nối Chat Completion của Tavern: Sử dụng trọn vẹn nhà cung cấp, mô hình và khóa máy chủ hiện hành của Tavern (bao gồm Claude, Gemini, OpenRouter); phiên bản hiện tại trả về phản hồi nguyên khối và hiển thị trạng thái chờ.
- Kết nối Text Completion `textgenerationwebui` của Tavern: Sử dụng trình tạo tham số nguyên bản và backend tương ứng.
- Hiện chưa hỗ trợ trò chuyện độc lập cho các kết nối Kobold, Horde, NovelAI; nếu gặp phải hệ thống sẽ nhắc đổi kết nối hoặc chuyển sang Cấu hình API riêng.
- SillyTavern 1.14.0: Tận dụng cơ chế yêu cầu chạy ngầm (quiet request) có sẵn; giới hạn độ dài phản hồi theo thiết lập của Tavern. Từ 1.15.0–1.19.0: Sao chép trình tạo tham số độc lập, bạn có thể chỉnh độ dài câu trả lời riêng cho pet mà không ảnh hưởng tới thiết lập chung của Tavern.

## Kiểm tu cơ sở dữ liệu (Chế độ kiểm tu trong cửa sổ trò chuyện)

Khi việc điền bảng gặp lỗi, hoặc dữ liệu bảng biểu không khớp với cốt truyện, bạn có thể gọi pet màn hình ra hỗ trợ phân tích và sửa chữa.

1. Mở cửa sổ trò chuyện, bấm vào mục **Kiểm tu cơ sở dữ liệu** ở thanh tiêu đề trên cùng (bấm lại vào **Trò chuyện** để quay về chế độ thường; dữ liệu hai bên lưu riêng biệt, thông tin kiểm tu không làm xáo trộn cuộc trò chuyện thường nhật).
2. Phía trên cửa sổ sẽ ghi rõ các dữ liệu được thu thập lần này: **Toàn bộ bảng biểu**, **Số tầng văn bản gần đây** (bấm vào để chọn từ 0～10 tầng, mặc định là 3) và **Các lỗi gần nhất** (thông báo lỗi/cảnh báo nhận từ cơ sở dữ liệu, tối đa 5 thông báo).
3. Bạn có thể nêu rõ lỗi cần sửa, hoặc nhấn **Kiểm tra giúp tôi**. Pet sẽ dùng văn phong riêng để phân tích hiện trạng; nếu cần chỉnh sửa, phía dưới phản hồi sẽ đính kèm một **Phiếu chỉnh sửa**.
4. Mỗi mục trong phiếu chỉnh sửa đều ghi rõ vị trí (bảng nào, hàng nào, cột nào), giá trị cũ → giá trị mới, kèm lý do sửa. Ban đầu **mặc định không có mục nào được chọn sẵn**. Những mục đối chiếu thấy lỗi (sai tên bảng, sai cột, hàng không tồn tại, giá trị mới trùng giá trị cũ, xung đột với mục khác) sẽ bị chú thích nguyên nhân và làm mờ, không thể tích chọn.
5. Đánh dấu những mục cần áp dụng, sau đó nhấn **Áp dụng mục đã chọn (N mục)**. Trước khi ghi dữ liệu, hệ thống tự động sao lưu toàn bộ bảng biểu; sau đó tiến hành ghi theo thứ tự an toàn: "sửa ô/dòng hiện có → xóa dòng → thêm dòng mới → chuyển preset cốt truyện → yêu cầu điền lại bảng"; kết quả thành công hay thất bại của từng mục đều được hiển thị rõ ràng.
6. Sau khi hoàn tất, bạn có thể bấm **Hoàn tác** để khôi phục toàn bộ bảng biểu về trạng thái trước khi ghi (bao gồm cả preset cốt truyện); hoặc bạn có thể **Tải bản sao lưu** dưới dạng tệp JSON về máy.

Các thao tác mà Phiếu chỉnh sửa có thể thực hiện:

- **Sửa ô, sửa dòng, thêm dòng, xóa dòng**: Gọi trực tiếp qua các hàm công khai `updateCell`, `updateRow`, `insertRow`, `deleteRow`, tương đương với thao tác thủ công trong cơ sở dữ liệu. Các ô, hàng, cột bị khóa trong cơ sở dữ liệu sẽ bị từ chối và hiển thị rõ trạng thái "chưa thể áp dụng".
- **Chuyển đổi preset cốt truyện**: Hỗ trợ chuyển cuộc trò chuyện hiện tại sang một preset thúc đẩy cốt truyện khác đã có sẵn (`switchPlotPreset`).
- **Yêu cầu điền lại bảng**: Yêu cầu cơ sở dữ liệu thực hiện điền bảng thủ công một lần theo cấu hình hiện tại (`manualUpdate`). Thao tác này sẽ kích hoạt API điền bảng của cơ sở dữ liệu và tính phí theo dịch vụ API cơ sở dữ liệu của bạn.

Các giới hạn an toàn được thiết lập:

- **Không sửa nội dung bên trong preset cốt truyện, không lưu preset phụ**: Cơ chế nhập preset của cơ sở dữ liệu sẽ vô tình chuyển cuộc trò chuyện sang chế độ "Triệu hồi LLM", trong khi API công khai không có hàm xóa preset hay khôi phục chế độ cũ nên không thể hoàn tác an toàn. Nếu cần sửa nội dung, pet sẽ giải thích trong tin nhắn để bạn tự vào trang **Thúc đẩy cốt truyện** của cơ sở dữ liệu chỉnh sửa thủ công (trong cuốn sổ nhỏ có phím tắt mở trực tiếp).
- Không hỗ trợ lệnh xóa toàn bộ bảng, xóa hàng loạt dữ liệu lớn; mỗi phiếu sửa chữa giới hạn tối đa 12 mục.
- Tuyệt đối không tự động ghi dữ liệu; chỉ thực thi khi bạn trực tiếp tích chọn và nhấn nút áp dụng.

Chính sách bảo vệ an toàn:

- Mỗi mục trước khi ghi đều được đối chiếu lại: nếu ô dữ liệu đã bị sửa đổi trước khi bạn xác nhận, hoặc dòng dữ liệu đã biến mất, hệ thống sẽ từ chối ghi và báo rõ lý do. Định vị dòng dựa trên `row_id` của cơ sở dữ liệu, việc xóa hoặc thêm dòng khác sẽ không làm lệch mục tiêu của các dòng phía sau.
- Chỉ cho phép áp dụng và hoàn tác trên đúng đoạn chat đã tạo ra phiếu chỉnh sửa đó; chuyển sang đoạn chat khác hệ thống sẽ từ chối thực thi.
- Khi nhấn hoàn tác, nếu phát hiện bảng biểu đã có thay đổi mới sau lần ghi đó (ví dụ cơ sở dữ liệu vừa tự động điền bảng một lượt mới), hệ thống sẽ cảnh báo: "Hoàn tác sẽ xóa bỏ cả những thay đổi mới này", bạn phải nhấn **Vẫn muốn hoàn tác** thì lệnh mới chạy.
- Bản sao lưu được lưu an toàn trong IndexedDB của trình duyệt, mỗi thiết bị lưu trữ tối đa 10 bản gần nhất; làm mới trang (<kbd>F5</kbd>) vẫn có thể hoàn tác bình thường. Nếu trình duyệt chặn IndexedDB, hệ thống sẽ lưu tạm trong bộ nhớ phiên và hiển thị thông báo khuyên bạn nên tải bản sao lưu JSON về máy.
- Trong lúc cơ sở dữ liệu đang bận xử lý, nút **Áp dụng mục đã chọn** sẽ bị vô hiệu hóa để đảm bảo an toàn toàn vẹn dữ liệu.

Quá trình kiểm tra sẽ đóng gói toàn bộ bảng biểu, các thông báo lỗi gần nhất và các tầng trò chuyện bạn đã chọn gửi tới kết nối API của pet màn hình. Nếu bảng biểu quá dài, hệ thống sẽ tự động rút gọn phần đầu của bảng dài nhất kèm dòng chú thích thông báo rõ ràng.

## Quan sát trò chuyện

Khi bật tính năng này, pet màn hình sẽ đồng hành bên cạnh cuộc hội thoại của bạn và thỉnh thoảng đưa ra những lời bình phẩm, nhận xét thú vị.

- Vào **Cài đặt tiện ích → Quan sát & Kiểm tu** để bật **Quan sát trò chuyện** (mặc định tắt). Sau đó tùy chỉnh **Tần suất bình luận** (từ 1～20 tầng trò chuyện, mặc định là 4 tầng).
- Hệ thống chỉ đếm các tầng tin nhắn mới phát sinh sau khi bật: chuyển sang đoạn chat khác bộ đếm sẽ tính lại từ đầu; xóa tin nhắn không bị trừ lùi; tạo lại câu trả lời (chưa sinh tầng mới) sẽ không tính thêm. Các tầng tin nhắn bị ẩn đi sẽ không được thu thập.
- Khi đủ số tầng quy định, hệ thống sẽ chờ nhân vật nói xong khoảng 4 giây mới bắt đầu đánh giá; khoảng cách giữa hai lần bình luận tối thiểu là 60 giây. Nếu cơ sở dữ liệu đang bận điền bảng, pet sẽ chờ thêm 30 giây; nếu vẫn bận liên tục pet sẽ bỏ qua lượt đó để chờ tầng tiếp theo.
- Lời nhận xét của pet sẽ hiển thị ngay trên bong bóng thoại (kèm nút **Trả lời cô ấy/cậu ấy**), đồng thời được lưu vào lịch sử chat riêng dưới vai trò "người quan sát". Bấm vào nút sẽ mở thẳng cửa sổ trò chuyện để bạn đối thoại tiếp.
- Các hành động trả lời tin nhắn, vuốt ve hay tặng hoa đều được tính là đã phản hồi pet. Nếu liên tục 3 câu bình phẩm không được người dùng tương tác, tâm trạng pet sẽ chuyển sang "Tủi thân"; ở lần tiếp theo pet sẽ rụt rè hỏi thăm xem bạn có đang bận không——hoàn toàn không giục giã, và mỗi tiếng đồng hồ chỉ hỏi tối đa một lần.
- Mỗi lần bình luận sẽ gửi một yêu cầu thông qua kết nối API của nhân vật; nếu lỗi mạng pet sẽ im lặng chứ không gửi lại dồn dập, chi tiết lỗi hiển thị trong cài đặt tiện ích.

## Bong bóng nhiệm vụ: Bản tóm tắt và Bản đầy đủ

Trong mục **Cài đặt tiện ích → Tiểu Erii · Pet màn hình cơ sở dữ liệu → Hiển thị nội dung nhiệm vụ**, bạn có thể chọn:

- **Bản tóm tắt (Mặc định)**: Ví dụ "Đang cập nhật thủ công…".
- **Bản đầy đủ (Nội dung công việc thực tế)**: Hiển thị tên nhiệm vụ ban đầu và chuỗi `detail` đầy đủ, ví dụ "Cập nhật thủ công / Đợt 1/4 · Gọi AI (Lần thử thứ 1/3)". Giữ nguyên các dấu xuống dòng gốc, nội dung dài hỗ trợ cuộn văn bản, nút dừng nhiệm vụ vẫn thao tác bình thường.

Tùy chọn này được lưu cục bộ và áp dụng đồng thời cho bong bóng ngoài màn hình lẫn thanh nhiệm vụ trong cửa sổ chat. Dữ liệu nhiệm vụ đọc trực tiếp từ `feature` và `detail` trên giao diện gốc của cơ sở dữ liệu; tuyệt đối không đoán mò phần trăm tiến độ, số đợt hay số lần thử lại. Khi cơ sở dữ liệu không có nhiệm vụ nào, pet sẽ hiển thị trạng thái chờ đồng bộ.

## Ranh giới đồng bộ cơ sở dữ liệu

Bình thường tiện ích này chỉ đọc trạng thái nhiệm vụ, văn bản tiến độ và thông báo kết quả hiển thị trên giao diện hiện hành của cơ sở dữ liệu:

- Không sao chép hay chỉnh sửa mã nguồn của plugin cơ sở dữ liệu;
- Không thay thế lối vào cơ sở dữ liệu gốc;
- Không can thiệp vào văn bản trò chuyện trong Tavern, cấu hình API toàn cục của Tavern hay các nút bấm nhiệm vụ gốc; lịch sử trò chuyện và cài đặt kết nối của pet được lưu riêng biệt;
- Dữ liệu bảng biểu chỉ bị chỉnh sửa khi ở chế độ kiểm tu, sau khi người dùng trực tiếp tích chọn từng mục và bấm "Áp dụng mục đã chọn"; chỉ dùng API công khai `AutoCardUpdaterAPI` và luôn sao lưu toàn bộ trước khi ghi; preset thúc đẩy cốt truyện chỉ thực hiện chuyển đổi, không chỉnh sửa nội dung bên trong;
- Văn bản trò chuyện của Tavern chỉ được đọc khi ở chế độ kiểm tu (kèm vài tầng gần nhất) và khi bạn chủ động bật quan sát trò chuyện; nội dung này chỉ gửi duy nhất tới API trò chuyện của pet;
- Không can thiệp vào điều khiển cử động của Naidan (pet gốc của cơ sở dữ liệu); hình ảnh Naidan chỉ được đọc lúc runtime khi cơ sở dữ liệu đã tải xong ảnh, không đóng gói phát tán lại;
- Cuốn sổ nhỏ chỉ lưu văn bản nhiệm vụ quan sát được gần nhất, không đại diện cho danh sách toàn bộ tiến trình ngầm; nút dừng bám sát nhiệm vụ đang hiển thị ngoài giao diện cơ sở dữ liệu;
- Khi không có dữ liệu tỷ lệ phần trăm chính xác, hệ thống hiển thị nguyên văn tiến độ gốc của cơ sở dữ liệu;
- Phím tắt điều hướng chỉ hỗ trợ mở giao diện và chuyển tab tương ứng, không tự ý đọc/ghi bảng hay kích hoạt nhiệm vụ.

Hiện tại tiện ích tương thích với cấu trúc giao diện của cơ sở dữ liệu `naiv1`. Nếu tương lai cơ sở dữ liệu thay đổi cấu trúc DOM (như `DeskPetLayer`, `DeskPet` hay `NoticeBubble`), Tiểu Erii có thể báo "Giao diện cơ sở dữ liệu không tương thích" và sẽ bảo toàn nguyên vẹn hiển thị cho pet gốc của cơ sở dữ liệu.

Khuyến nghị: Bạn nên giữ hiển thị cho Naidan gốc và bong bóng nhiệm vụ trong phần cài đặt của cơ sở dữ liệu, sau đó vào cài đặt của tiện ích này để ẩn chúng đi. Thao tác "ẩn" tại đây chỉ là che phần hiển thị trên giao diện, không gỡ bỏ cơ sở dữ liệu và không làm gián đoạn nguồn cấp dữ liệu.

## Xem trước cục bộ và Trả lời lặp lại

Trong phiên bản v0.6.0, tính năng xem trước độc lập (standalone preview) từng sử dụng dữ liệu mẫu cố định, dẫn tới việc mọi câu hỏi đều nhận phản hồi giống nhau và kiểm tra kết nối chỉ là giả lập. Vấn đề này đã được khắc phục hoàn toàn từ bản v0.6.1; gói cài đặt chính thức luôn gửi và nhận phản hồi thực tế qua API.

Bản xem trước độc lập yêu cầu bạn tự nhập API của mình vào Cài đặt kết nối để lấy danh sách mô hình, kiểm tra kết nối và trò chuyện thực tế. Giao diện trang độc lập không thể đọc thông số cấu hình của Tavern; chỉ khi cài đặt tiện ích vào Tavern bạn mới có thể dùng API mặc định của Tavern. Giao diện xem trước sẽ hiển thị nhãn **Xem trước độc lập · Cấu hình API riêng là có thể trò chuyện thật**.

Chế độ xem trước chỉ hiển thị dữ liệu mẫu khi bạn chủ động thêm tham số `demo=1` vào đường dẫn URL. Giao diện sẽ thông báo rõ ràng "Chế độ xem trước", dữ liệu demo và môi trường thực tế hoàn toàn tách biệt, dữ liệu mẫu cũ không bao giờ lọt vào lịch sử trò chuyện. Khi gặp lỗi kết nối, hệ thống sẽ báo lỗi thực tế chứ không dùng mẫu văn bản giả để lấp liếm.

Môi trường xem trước cục bộ chạy qua `work/erii_preview_server.mjs` chuyển tiếp yêu cầu trong localhost; tệp này không nằm trong gói phát hành chính thức. Khi cài trong Tavern, tiện ích sử dụng trực tiếp backend của Tavern nên không cần khởi chạy máy chủ xem trước này.

## Toàn bộ lịch sử phiên bản

Phiên bản được sắp xếp theo thứ tự thời gian từ mới nhất đến cũ nhất. Hành vi của phiên bản mới nhất căn cứ theo mục đầu tiên.

### v0.9.3 · Lễ phục Dạ tím và Đổi vé hoa (Hiện tại)

- Mở bán「Lễ phục Dạ tím Tsukuyomi」: Giá 10.320 vé hoa, tỷ lệ đổi 1 xu vàng = 40 vé hoa; ban đầu không sở hữu, không tự động mua hay tự mặc.
- Trang phục bổ sung hiển thị số dư xu vàng/vé hoa, số lượng quy đổi, dự kiến nhận được, số xu vàng cần để mua đồ, cảnh báo khi thiếu số dư. Nút điền số không trừ tiền; quy đổi, mua, mặc vào là 3 thao tác độc lập, rõ ràng.
- Dữ liệu ví tiền bổ sung số dư vé hoa, tổng đổi và chi tiêu vé hoa; trang phục thống kê riêng lượng vé hoa đã dùng, bảo lưu toàn bộ xu vàng, hoạt động và dữ liệu trang phục cũ. Mua một lần thay đổi miễn phí vĩnh viễn, vé hoa dư được bảo toàn.
- Bổ sung 27 ảnh WebP trong suốt chất lượng cao phủ kín mọi hành động và sinh hoạt; ảnh phát hành chuẩn 960×960 (khoảng 6.45 MiB). Ảnh gốc PNG 1254×1254 lưu trong không gian tư liệu bảo trì, không đưa vào gói cài đặt nhẹ của tiện ích.
- Tải trước 8 hành động thường dùng, các hành động khác giải mã theo nhu cầu; sửa lỗi tràn viền ngang do xoay thẻ trang phục. Khi mặc đồ, bong bóng pet và sổ tay chuyển sang tông màu tím nhạt.
- Vượt qua 9 nhóm kiểm thử logic mới, 10 kịch bản trình duyệt cho trang phục (độ rộng 1280/375/320), cùng 25 nhóm kiểm thử mô hình và 15 nhóm kiểm thử hồi quy trình duyệt. Xác nhận tương thích thực tế trên Tavern và điện thoại xem tại `COMPATIBILITY.md`.
- Duy trì 6 mục sửa lỗi của v0.9.2; không khôi phục tự động di chuyển, không thay đổi mỹ thuật mặc định, không tự động gọi API trò chuyện.

### v0.9.2 · Sáu hạng mục sửa lỗi (Bản cũ)

- Đề xuất kiểm tu cố định dữ liệu bảng biểu tại thời điểm gửi yêu cầu; chuyển chat hủy yêu cầu cũ, sắp xếp lại dòng vẫn định vị theo `row_id` gốc, giá trị gốc thay đổi sẽ từ chối áp dụng.
- Quá trình ghi/hoàn tác kiểm tra lại quyền sở hữu sau khi sao lưu; chuyển chat trong lúc đang thực thi hàng loạt sẽ dừng các mục tiếp theo; bản sao lưu bắt buộc phải thuộc về đoạn chat hiện hành; mỗi lần chỉ thực hiện một tác vụ kiểm tu.
- Thao tác xóa dòng so sánh toàn bộ nội dung dòng gốc và tiêu đề cột, phiếu xóa dòng từ bản cũ thiếu giá trị gốc bắt buộc phải tạo lại; chuyển preset so sánh với preset gốc.
- Vô hiệu hóa hoàn tác và hoàn tác cưỡng chế khi cơ sở dữ liệu đang bận, kiểm tra lại trạng thái ngay trước khi gọi hàm.
- Sửa lỗi chỉ số no/sạch sẽ bị nhảy về giá trị cũ sau khi tắt; đóng băng chỉ số trong thời gian tắt, bật lại không tính bù phần sụt giảm lúc tắt.
- Khi tắt quan sát trò chuyện, ẩn pet hoặc chuyển chat sẽ hủy bỏ bình luận đang chờ, loại bỏ phản hồi trễ; việc hủy bình luận không ảnh hưởng tới tin nhắn chat thông thường của người dùng.
- Vượt qua 25 nhóm kiểm thử hồi quy thuần logic, 15 kịch bản trình duyệt cách ly (gồm PC/375px/320px) cùng kiểm tra cú pháp, danh mục và tham chiếu tư liệu. Kiểm thử sử dụng mô phỏng, không phát sinh chi phí API.
- Nếu API công khai của cơ sở dữ liệu đã bắt đầu tiến trình bên trong, tiện ích không thể can thiệp hoàn tác giữa chừng; cơ chế bảo vệ bao quát thời điểm trước và giữa các lần gọi. Cơ chế lưu trữ bất đồng bộ thực tế của cơ sở dữ liệu vẫn cần kiểm tra độc lập.
- Giữ nguyên vịt vàng trên đầu, cử động tại chỗ, kéo thả thủ công và nút dừng nhiệm vụ gốc; không khôi phục việc tự do đi lại.

### v0.9.1 · Khung hệ thống trang phục (Bản cũ)

- Sổ tay cuộc sống thêm tab **Trang phục**: Mua trang phục bằng tiền trong ví gia đình, tính sở hữu riêng theo từng nhân vật, có thể mặc hoặc đổi về mặc định tùy thích; thiếu tiền nút bấm sẽ khóa và ghi rõ số tiền còn thiếu; mua và thay đồ đều ghi vào sổ cái nhỏ và pet sẽ nói một câu tương ứng.
- Khi thay trang phục, toàn bộ hình ảnh pet, avatar, ảnh minh họa sinh hoạt, thumbnail gọi món và hình đứng nhà pet đều đổi theo skin; các tư thế chưa vẽ skin sẽ dùng ảnh mặc định; màu hạt hiệu ứng có thể tùy biến theo skin; giao diện hỗ trợ thuộc tính `data-skin` để tùy biến CSS màu sắc.
- Nhà pet thêm nút **Thay đồ cho cô ấy**, mở thẳng tab trang phục của nhân vật tương ứng.
- Bản này chỉ dựng khung hệ thống, **chưa mở bán trang phục**: danh mục rỗng, mỗi nhân vật chỉ có trang phục mặc định gốc. Sau này chỉ cần thêm dữ liệu vào `skin-model.js` và bổ sung ảnh, không cần sửa đổi mã nguồn khác.
- Lưu trữ: Trang phục sở hữu và đang mặc lưu trong trường `skins` của cài đặt tiện ích; trang phục đã mua nếu tạm thời bị ẩn khỏi danh mục vẫn không bị mất. Khi hạ cấp về v0.9.0 trường này sẽ bị bỏ qua, tiền và sổ cái vẫn nguyên vẹn.
- Bổ sung 2 bộ thoại cho cả 3 nhân vật (khi mua được đồ mới, khi mặc đồ mới). Tổng kết trong sổ cái đổi từ "Tiền ăn" thành "Đã chi", vì tiền có thể dùng để mua trang phục.
- Tệp mới: `skin-model.js` (danh mục skin, lưu trữ, mua và thay trang phục).

### v0.9.0 · Chế độ kiểm tu và Quan sát trò chuyện (Bản cũ)

- Bổ sung chế độ kiểm tu cơ sở dữ liệu chuyên sâu, tạo phiếu sửa đổi an toàn với khả năng hoàn tác toàn diện qua IndexedDB.
- Bổ sung tính năng quan sát trò chuyện thông minh, phản hồi theo ngữ cảnh với tần suất tùy chỉnh và trạng thái cảm xúc tự nhiên.

### v0.8.0 · Ba pet màn hình, Nuôi dưỡng và Phím tắt mở bảng cơ sở dữ liệu (Bản cũ)

- Thêm nhân vật Zero (26 ảnh) và Naidan (đọc trực tiếp ảnh gốc của cơ sở dữ liệu lúc chạy); gom dữ liệu nhân vật vào thư mục `characters/`, muốn thêm nhân vật mới chỉ cần bổ sung 1 file cấu hình và 1 thư mục tài nguyên.
- Cập nhật tính năng Nhà pet màn hình: thiết kế dạng bách khoa toàn thư, hiệu ứng lật trang mượt mà khi đổi nhân vật, hỗ trợ đặt biệt danh, ghi nhật ký trưởng thành và các mẩu chuyện độc quyền.
- Tích hợp hệ thống nuôi dưỡng: độ thân mật 5 cấp bậc, chỉ số no và sạch sẽ, các trạng thái cảm xúc, lời chào buổi sáng; hoàn toàn không có cơ chế phạt, có thể tắt bỏ chỉ số nhu cầu tùy thích.
- Tiền lương và bữa ăn tính riêng cho từng nhân vật, ví tiền gia đình dùng chung; tương thích hoàn toàn với tệp lưu của v0.7.1.
- Bổ sung hệ thống lời thoại ngoại tuyến phong phú theo tính cách, tâm trạng và độ thân mật; bong bóng thoại tách biệt câu thoại của pet và tiến độ thực tế của cơ sở dữ liệu; hỗ trợ bật/tắt linh hoạt.
- Cuốn sổ nhỏ bổ sung nhóm phím tắt mở nhanh các bảng cơ sở dữ liệu; thông báo lỗi có thêm nút "Đi xem thử".
- Giao diện thiết kế theo phong cách sổ bìa cứng cao cấp, bổ sung các mức hiệu ứng đồ họa; trên điện thoại hỗ trợ vuốt ngăn kéo từ dưới lên.
- Tối ưu hóa dung lượng: dọn dẹp các khung hình chuyển động không dùng (giảm khoảng 21 MB), tổng dung lượng gói tiện ích giảm từ hơn 25 MB xuống còn khoảng 6.5 MB.
- Bổ sung công cụ `tools/slice-pose-sheet.py`: Tách bảng pose ảnh thành các khung hình rời chuẩn xác.
- Bảo toàn nguyên vẹn tài nguyên, đường dẫn, văn bản, tương tác, cơ chế đồng bộ chỉ đọc và nút dừng nhiệm vụ của Tiểu Erii; hạ cấp về 0.7.1 vẫn an toàn tuyệt đối.

### v0.7.1 · Bốn hình minh họa lúc ăn và chuẩn hóa tên gọi (Bản cũ)

- Bổ sung 4 ảnh nền WebP trong suốt chất lượng cao cho các món ăn: Pudding, Cơm nắm, Cơm cuộn trứng, Ramen (`eat-pudding`, `eat-riceball`, `eat-omurice`, `eat-ramen`).
- Thẻ gọi món đổi thành biểu tượng tương ứng lúc ăn của Tiểu Erii; hình ảnh trong sổ tay và pet ngoài màn hình đồng bộ hoàn toàn.
- Hình ảnh thiết kế tỉ mỉ giữ nguyên nét đặc trưng: vịt vàng trên đầu, kimono đỏ trắng; ảnh xuất bản nén chuẩn WebP 768×768.
- Thống nhất tên gọi trên toàn bộ giao diện thành "Sổ tay cuộc sống".
- Cơ chế tiền tệ, giá món ăn, thời gian ăn và dữ liệu lưu trữ giữ nguyên vẹn; bản ghi ăn dở cũ tự động ánh xạ sang ảnh mới theo Food ID.

### v0.7.0 · Đi làm, Kiếm tiền và Dùng bữa (Bản cũ)

- Ra mắt tính năng Sổ tay cuộc sống: hệ thống làm thêm kiếm tiền, ăn uống hồi phục và sổ cái theo dõi thu chi.
- Ba công việc: Tiệm sách, Tiệm tráng miệng, Tiệm hoa với thời gian 1 / 2 / 3 phút, nhận thưởng 10 / 18 / 25 xu vàng; làm xong phải nhận lương thủ công, không tự động nhận việc tiếp.
- Bốn món ăn: Pudding, Cơm nắm, Cơm cuộn trứng, Ramen với giá 5 / 8 / 15 / 20 xu vàng, thời gian ăn 8 / 9 / 10 / 12 giây.
- Tự động lưu trữ số dư ví, thời gian bắt đầu, tổng hoạt động và 20 bản ghi sổ cái gần nhất; làm mới trang hoặc mất mạng vẫn bảo lưu dữ liệu.
- Tiền lương chưa nhận được giữ vĩnh viễn, không nhận trùng lặp; hủy công việc yêu cầu xác nhận lần hai.
- Thêm 4 ảnh WebP trong suốt 768×768 tối ưu (chỉ 584 KB). Hoạt ảnh làm việc và ăn uống cử động nhẹ nhàng tại chỗ, không tự do đi lại.
- Bổ sung thanh trạng thái sinh hoạt và bong bóng nhận lương khi hết giờ; ưu tiên hiển thị nhiệm vụ cơ sở dữ liệu khi có xung đột.
- Toàn bộ tính năng chat, prompt, ký ức thủ công, cấu hình API từ v0.6.2 được giữ nguyên vẹn.

### v0.6.2 · Sổ tay trò chuyện và Thao tác tin nhắn (Bản cũ)

- Nâng cấp khung chat: avatar, mốc thời gian, dải phân cách ngày, trạng thái kết nối và nhóm cài đặt chuyên biệt.
- Bổ sung tính năng sao chép tin nhắn, xuất tệp `.txt`, tạo lại câu trả lời và sửa tin nhắn cũ gửi lại.
- Lưu trữ bản nháp thông thường và bản nháp đang chỉnh sửa tự động.
- Ba phong cách trò chuyện: Tự nhiên / Bầu bạn ngắn gọn / Chi tiết, cùng ô ký ức thủ công tối đa 2.000 ký tự.
- Giữ nguyên vị trí cuộn khi xem tin nhắn cũ, có nút quay lại tin nhắn mới nhất; trên PC kéo chỉnh kích thước linh hoạt, trên điện thoại tự co giãn tránh bàn phím ảo.
- Đọc tốt dữ liệu chat từ phiên bản cũ; khóa API lưu độc lập và an toàn.

### v0.6.1 · Danh sách mô hình và Kết nối thực cho bản xem trước (Bản cũ)

- Mục API riêng có thêm tính năng "Lấy danh sách mô hình", hỗ trợ chọn nhanh hoặc tự nhập tay.
- Hiển thị rõ trạng thái tải danh sách, báo lỗi chi tiết hoặc hủy tác vụ; đổi URL/Khóa sẽ tự làm mới tiến trình.
- Bản xem trước độc lập hỗ trợ kết nối API thực tế, loại bỏ hoàn toàn dữ liệu giả lập.
- Chế độ demo chỉ hiển thị khi có tham số `demo=1` rõ ràng.

### v0.6.0 · Trò chuyện độc lập và Nội dung công việc thực tế (Bản cũ)

- Thêm tab trò chuyện độc lập với bộ prompt định hình nhân vật Erii, hỗ trợ tùy chỉnh danh xưng và mối quan hệ.
- Hỗ trợ kế thừa API mặc định của Tavern hoặc cấu hình API riêng tương thích OpenAI.
- Cho phép dừng phản hồi, gửi lại tin nhắn, kiểm tra kết nối và xóa lịch sử trò chuyện an toàn.
- Cung cấp tùy chọn hiển thị nội dung nhiệm vụ cơ sở dữ liệu: Bản tóm tắt hoặc Bản đầy đủ.
- Nút dừng nhiệm vụ cơ sở dữ liệu hoạt động độc lập ngay trong khung chat.

### v0.5.14 · Tự động đổi mẩu chuyện mỗi 30 giây (Bản cũ)

- Tự động đổi câu chuyện nhỏ mỗi 30 giây sau khi mở bong bóng; áp dụng cho cả mở thủ công và tự động lúc rảnh rỗi.
- Luân phiên 12 mẩu chuyện, đảm bảo không lặp lại trong một vòng.
- Tự động tạm dừng đếm ngược khi di chuột vào hoặc thao tác bàn phím; trên điện thoại chạm để giữ trạng thái đọc.
- Bấm "Đổi câu khác" để chuyển ngay lập tức; đóng bong bóng hoặc có nhiệm vụ cơ sở dữ liệu sẽ dừng chu kỳ.

### v0.5.13 · Sửa lỗi dừng nhiệm vụ và ẩn cuốn sổ nhỏ (Bản cũ)

- Nút dừng liên kết trực tiếp với tiến trình nhiệm vụ hiện hành của cơ sở dữ liệu, loại bỏ nút dừng không hợp lệ.
- Kiểm tra lại nguồn dữ liệu trước khi thực thi lệnh dừng; nếu nhiệm vụ đã thay đổi sẽ yêu cầu xác nhận.
- Cảnh báo và lỗi của cơ sở dữ liệu được hiển thị ưu tiên với thời gian giữ lâu hơn.
- Khi tắt hiển thị pet, cài đặt vẫn cho phép mở cuốn sổ nhỏ và cổng cơ sở dữ liệu; các nút giải trí tạm ẩn.

### v0.5.12 · Kéo sát mép để ló đầu ngay (Bản cũ)

- Loại bỏ thời gian chờ 6 giây: kéo pet sát mép và thả tay là nhân vật sẽ thu mình và ló đầu ra ngay lập tức.
- Giữ nguyên trạng thái khi rê chuột qua, không tự động hủy tư thế.
- Tương tác nhấp chuột, kéo thả hoặc nhận nhiệm vụ sẽ khôi phục tư thế đứng thông thường; sau đó nếu vẫn ở sát mép sẽ tiếp tục ló đầu.

### v0.5.11 · Tư thế ló đầu ở mép và mẩu chuyện nhỏ (Bản cũ)

- Chuyển nút đóng × lên góc trên bên phải của cuốn sổ nhỏ, tách xa nút mở cơ sở dữ liệu để tránh bấm nhầm.
- Bổ sung các ảnh WebP trong suốt 512×512 cho cử động ló đầu ở mép màn hình (trái, phải, dưới).
- Tinh chỉnh tư thế nhân vật gọn gàng, một tay bám mép tự nhiên.
- Tích hợp 12 mẩu chuyện ngắn tự động kích hoạt sau 5 phút rảnh rỗi.

### v0.5.10 · Căn chỉnh nút bấm trong cuốn sổ nhỏ (Bản cũ)

- Nút "Tặng cô ấy một bông hoa" đưa vào nhóm nút giải trí, đồng bộ font chữ, viền và trạng thái vô hiệu hóa.
- Tối ưu hóa bố cục các nút tương tác để tiết kiệm không gian hiển thị.

### v0.5.9 · Phím tắt chuột phải và Lối vào cơ sở dữ liệu (Bản cũ)

- Nhấp chuột phải vào pet trên PC để mở hoặc thu gọn nhanh cuốn sổ nhỏ.
- Tích hợp nút mở trực tiếp cơ sở dữ liệu ngay trên đầu cuốn sổ nhỏ.
- Hỗ trợ tương thích cả menu V2 `acu-v2-menu-item` và bản cũ `shujuku_v120-menu-item`.

### v0.5.8 · Hoàn tác tính năng tự do di chuyển

- Loại bỏ hoàn toàn các khung hình chạy bộ qua lại.
- Xóa bỏ logic tự động đi dạo quanh màn hình.
- Pet chỉ di chuyển vị trí khi người dùng chủ động kéo thả chuột/tay.
- Tối ưu hóa dung lượng gói cài đặt, loại bỏ các tệp hình ảnh và mã nguồn dư thừa.

### v0.5.7 · Sửa lỗi cập nhật tọa độ khi đi dạo (Bản cũ)

- Khắc phục hiện tượng lệch tọa độ thực tế khi nhân vật di chuyển hoạt ảnh.

*(Lưu ý: Tính năng chủ động đi bộ đã được gỡ bỏ hoàn toàn từ v0.5.8).*

### v0.5.6 · Ổn định thời gian hành vi chủ động (Bản cũ)

- Tinh chỉnh khoảng thời gian chờ giữa các hành động ngẫu nhiên để tránh hiện tượng lag giật.

*(Lưu ý: Tính năng chủ động đi bộ đã được gỡ bỏ hoàn toàn từ v0.5.8).*

### v0.5.5 · Đi bộ chậm rãi (Bản cũ)

- Thử nghiệm tính năng di chuyển từng bước nhỏ dựa trên nhịp bước của Naidan.

*(Lưu ý: Tính năng chủ động đi bộ đã được gỡ bỏ hoàn toàn từ v0.5.8).*

### v0.5.4 · Hoạt ảnh chạy bộ trái phải (Bản cũ)

- Bổ sung 2 bộ khung hình chạy bộ 8 frame sang hai bên.

*(Lưu ý: Hoạt ảnh chạy bộ đã được gỡ bỏ hoàn toàn từ v0.5.8).*

### v0.5.3 · Tương tác rảnh rỗi và Tự do di chuyển (Bản cũ)

- Tự động thực hiện các cử động uống trà, đọc sách, gấp giấy, ôm vịt vàng khi rảnh rỗi.
- Thử nghiệm tự động đổi vị trí trong phạm vi an toàn.

*(Lưu ý: Tính năng tự di chuyển đã gỡ bỏ từ v0.5.8; các tương tác rảnh rỗi vẫn được giữ lại).*

### v0.5.2 · Nút dừng trên bong bóng nhiệm vụ (Bản cũ)

- Hiển thị nút dừng trực tiếp trên bong bóng khi cơ sở dữ liệu đang chạy tác vụ hỗ trợ ngắt quãng.

### v0.5.1 · Nhấn giữ trên điện thoại để mở cuốn sổ (Bản cũ)

- Hỗ trợ thao tác nhấn giữ khoảng 1.4 giây trên màn hình cảm ứng để mở cuốn sổ nhỏ thay cho chuột phải.

### v0.5.0 · Tương thích các phiên bản SillyTavern (Bản cũ)

- Tương thích với dải phiên bản SillyTavern 1.14.0–1.19.0.
- Tự động chờ API khởi tạo của Tavern trên các bản cũ, bổ sung cơ chế Single Instance chống tạo trùng lặp nhân vật.

### v0.4.1 · Kéo dài thời gian chợp mắt và mượt hóa hoạt ảnh (Bản cũ)

- Nhấn giữ nửa giây để pet chợp mắt, thả tay ra sẽ tiếp tục nghỉ ngơi khoảng 12 giây mà không bị gián đoạn.
- Tinh chỉnh trọng tâm (pivot) giúp các cử động nhấc lên, đặt xuống và thở nhịp nhàng hơn.

### v0.4.0 · Tương tác nhấp liên tục và nhấn giữ (Bản cũ)

- Phân biệt rõ các thao tác: nhấp 1 lần, nhấp đúp, nhấp 3 lần và combo 6 lần.
- Đổi tên tiêu đề thành "Cuốn sổ nhỏ của Tiểu Erii", bỏ số phiên bản trên thanh tiêu đề.

### v0.3.1 · Tối ưu hiệu năng kéo thả và nâng cấp đồ họa (Bản cũ)

- Tối ưu hóa logic cập nhật tọa độ khi kéo thả, tránh nghẽn layout trình duyệt.
- Tách riêng nhịp thở sinh học, cử động mượt mà không giật cục.
- Nâng cấp toàn bộ hình ảnh lên chuẩn WebP 384×384 sắc nét, nền trong suốt hoàn hảo.

### v0.3.0 · Kéo thả, Ghi nhớ vị trí và Bộ sưu tập hình ảnh (Bản cũ)

- Cho phép kéo thả tự do, giới hạn cạnh màn hình, tự động tránh khung nhập liệu khi xoay màn hình hoặc bật bàn phím ảo.
- Bổ sung các tư thế nhấc lên, tiếp đất, hỏi han và bám mép.

### v0.2.0 · Phiên bản Tiện ích độc lập (Bản cũ)

- Tách thành tiện ích mở rộng độc lập cho SillyTavern.
- Lắng nghe trạng thái cơ sở dữ liệu qua Observer để hiển thị giao diện, không can thiệp logic nội bộ của cơ sở dữ liệu.

### v0.1.1 · Bản thử nghiệm Windows (Đã loại bỏ)

- Bản adapter thử nghiệm ban đầu dành cho Windows, đã lỗi thời và không còn sử dụng.

### v0.1.0 · Bản thử nghiệm đầu tiên (Đã loại bỏ)

- Phiên bản sơ khai thử nghiệm can thiệp giao diện cơ sở dữ liệu cũ, đã bị loại bỏ để thay thế bằng kiến trúc độc lập.

## Nâng cấp tệp lưu và Khôi phục bản cũ

Phiên bản v0.9.3 sử dụng `life.schema = 3`, bổ sung thêm các trường `tickets`, `ticketsEarned`, `ticketsSpent` vào ví tiền cũ; hệ thống trang phục dùng `skins.schema = 2`, bổ sung `spentTickets`. Tệp lưu cũ sẽ được tự động nhận diện và nâng cấp, số vé hoa mới mặc định là 0, tuyệt đối không làm mất xu vàng, hoạt động, nhật ký chat, độ thân mật hay các trang phục đã sở hữu.

Các phiên bản cũ không nhận diện được trường vé hoa, **nếu hạ cấp về bản cũ rồi lưu lại dữ liệu, bạn có thể bị mất số dư vé hoa mới, số liệu tích lũy và lịch sử đổi vé**. Hãy sao lưu dữ liệu tài khoản Tavern trước khi có ý định hạ cấp. Thao tác chỉ tắt tiện ích hoặc đổi về trang phục mặc định sẽ không làm mất số dư hay trang phục.

## Cài đặt và Khôi phục

Sau khi tắt hoặc gỡ bỏ tiện ích này, bạn chỉ cần làm mới lại trang Tavern là pet màn hình gốc của cơ sở dữ liệu sẽ tự động hiển thị lại bình thường. Bản thân cơ sở dữ liệu không cần phải rollback hay khôi phục gì cả; người dùng tuyệt đối không nên dùng các bản vá thử nghiệm cũ đè lên giao diện cơ sở dữ liệu.

## Phạm vi tương thích và Ranh giới kiểm thử

- Phiên bản SillyTavern hỗ trợ: **1.14.0–1.19.0**.
- 1.14.0–1.16.0: Điểm đầu vào tự động chờ API thiết lập của Tavern sẵn sàng.
- 1.17.0–1.19.0: Đăng ký thông qua vòng đời chính thức của Tavern, tích hợp cơ chế bảo vệ Single Instance.
- Chi tiết kỹ thuật bổ sung có thể tham khảo tại [`COMPATIBILITY.md`](COMPATIBILITY.md).

Các bài kiểm tra tự động và kịch bản cách ly trên trình duyệt chỉ xác thực mã nguồn, danh mục tệp và bố cục giao diện mô phỏng, không thể thay thế hoàn toàn việc kiểm thử thực tế trên hệ thống Tavern của bạn. Bạn nên tự kiểm tra trên máy các mục sau:

- Sau khi cập nhật kho lưu trữ, kiểm tra xem Tavern đã thực sự tải đúng phiên bản `0.9.3` chưa;
- Phiên bản cơ sở dữ liệu của bạn có còn cung cấp cấu hình giao diện tương thích không;
- Thử nghiệm thực tế các tác vụ thúc đẩy cốt truyện, điền bảng, kiểm tra lỗi và dừng nhiệm vụ;
- Khi dùng mô hình AI thật, hãy xem xét kỹ lưỡng tính hợp lý của Phiếu chỉnh sửa do chế độ kiểm tu đề xuất trước khi tích chọn áp dụng;
- Cảm giác vuốt chạm và độ nảy tránh bàn phím ảo trên điện thoại thực tế.

## Câu hỏi thường gặp

### Tại sao trang phục mới không thể mặc ngay?

Trang phục mới cần phải mua. Hãy vào Sổ tay cuộc sống → Trang phục, đổi xu vàng sang vé hoa rồi nhấn mua; từ 0 vé hoa bạn cần tích lũy 258 xu vàng (tương đương 10.320 vé hoa). Xu vàng trong ví không thanh toán trực tiếp cho bộ đồ này mà bắt buộc phải đổi sang vé hoa trước. Mua xong nhấn "Mặc vào".

### Sau khi cập nhật không thấy trang phục, hoặc đổi trang phục bị thiếu ảnh?

Hãy xác nhận danh sách tiện ích của Tavern đã tải đúng bản `0.9.3`, đồng thời kiểm tra kho lưu trữ GitHub của bạn đã tải lên đầy đủ 27 tệp WebP trong thư mục `assets/skins/erii-purple-night/` chưa. Nếu chỉ cập nhật file code hay README mà thiếu ảnh thì hệ thống không thể tự tạo ảnh. Sau khi tải lên đủ ảnh, hãy cập nhật lại tiện ích và dùng <kbd>Ctrl</kbd>+<kbd>F5</kbd> để làm mới bộ nhớ cache trình duyệt.

### Sau khi cập nhật Tiểu Erii vẫn tự ý đi lại?

Hãy kiểm tra số phiên bản trong danh sách tiện ích Tavern. Nếu chưa phải `0.9.3`, chứng tỏ Tavern vẫn đang chạy phiên bản cũ trong bộ nhớ cache; hãy nhấn cập nhật tiện ích và làm mới trang. Logic tự động di chuyển chỉ có ở bản `v0.5.7` trở về trước và đã bị loại bỏ hoàn toàn từ bản `v0.5.8`.

### Pet hiển thị ngoài màn hình nhưng báo chưa kết nối Cơ sở dữ liệu?

Hãy kiểm tra xem tiện ích cơ sở dữ liệu gốc đã được bật và đang chạy chưa. Khuyến nghị bạn nên để pet Naidan gốc và bong bóng nhiệm vụ chạy bình thường trong cài đặt cơ sở dữ liệu, sau đó dùng mục ẩn trong cài đặt của tiện ích này để che đi. Nếu cấu trúc DOM của cơ sở dữ liệu bị thay đổi, pet sẽ không thể bắt được dữ liệu và sẽ thông báo không tương thích chứ không làm giả trạng thái kết nối.

### Tại sao không thể chuyển sang nhân vật Naidan?

Hình ảnh của Naidan được đọc trực tiếp từ bộ nhớ của cơ sở dữ liệu đang hoạt động. Vui lòng kiểm tra xem cơ sở dữ liệu đã mở chưa và pet đi kèm của nó có bị tắt hoàn toàn không; nếu không lấy được tài nguyên ảnh, nhà pet sẽ ghi rõ nguyên nhân và giữ nguyên nhân vật hiện tại.

### Lỡ áp dụng nhầm đề xuất trong lúc kiểm tu thì xử lý thế nào?

Bạn chỉ cần bấm nút **Hoàn tác** ngay phía dưới phiếu chỉnh sửa đó, bảng biểu sẽ được khôi phục về trạng thái ban đầu trước khi sửa. Dữ liệu sao lưu được lưu trong IndexedDB của trình duyệt nên làm mới trang (<kbd>F5</kbd>) vẫn có thể hoàn tác tốt. Nếu cơ sở dữ liệu vô tình có cập nhật mới đè lên sau đó, hệ thống sẽ cảnh báo trước khi bạn nhấn hoàn tác.

### Tại sao tính năng Quan sát trò chuyện không thấy bình luận?

Hãy kiểm tra xem trong **Cài đặt tiện ích → Quan sát & Kiểm tu** đã bật tính năng này chưa, và số tầng trò chuyện mới sinh ra đã đạt mốc tần suất quy định chưa. Mỗi lần bình luận cách nhau tối thiểu 60 giây, và nếu cơ sở dữ liệu đang bận điền bảng pet sẽ lùi lại thêm một nhịp. Bạn có thể xem mốc thời gian bình luận gần nhất hoặc nhật ký lỗi trong phần cài đặt.

### Điện thoại không có chuột phải thì mở Cuốn sổ nhỏ thế nào?

Chạm nhẹ là tương tác, nhấn giữ khoảng nửa giây là chợp mắt, nhấn giữ lâu khoảng 1.4 giây là cuốn sổ nhỏ sẽ mở lên. Ngoài ra, bạn luôn có thể mở cuốn sổ nhỏ bằng nút bấm trong phần cài đặt tiện ích mở rộng của Tavern.

## Tài nguyên & Giấy phép bản quyền

Tạo hình của Tiểu Erii được tham khảo từ [Cardwright 绘梨衣桌宠素材](https://github.com/1798547983tt/Cardwright/tree/359019715afc60813384964b023a09c6dd6ed326/assets/pets/erii). Các hình ảnh hành động được tạo bằng ImageGen và tinh chỉnh cục bộ; các ảnh hành động gốc là tệp WebP trong suốt không nén suy hao, các ảnh minh họa sinh hoạt từ v0.7.0 là WebP chất lượng cao có kênh trong suốt. Tài nguyên mỹ thuật là nội dung đồng nhân phi thương mại dựa trên tác phẩm "Long Tộc", tuân thủ điều kiện ghi công phi thương mại trong [`assets/NOTICE.md`](assets/NOTICE.md); mã nguồn chương trình sử dụng giấy phép MIT, giấy phép MIT không bao gồm tài nguyên mỹ thuật. Lễ phục Dạ tím được thiết kế theo hình ảnh trang phục Erii Tsukuyomi trong "Long Tộc" do người dùng cung cấp và sinh qua ImageGen; chi tiết giấy phép xem tại [`Hướng dẫn tư liệu trang phục`](assets/skins/erii-purple-night/NOTICE.md).

Hình ảnh hành động của Zero được tạo bằng ImageGen dựa trên hai bảng tư thế, nâng độ phân giải qua mô hình Real-ESRGAN (Anime) và cắt bằng công cụ `tools/slice-pose-sheet.py`, điều khoản cấp phép xem tại [`assets/zero/NOTICE.md`](assets/zero/NOTICE.md). Hình ảnh của Naidan thuộc bản quyền của tiện ích cơ sở dữ liệu, tiện ích này chỉ đọc ảnh đã tải lúc runtime, không sao chép và không phân phối lại.

Tham khảo cơ sở dữ liệu: [AlbusKen/shujuku](https://github.com/AlbusKen/shujuku).