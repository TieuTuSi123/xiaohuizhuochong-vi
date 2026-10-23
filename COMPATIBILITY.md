# Thuyết minh tính tương thích phiên bản SillyTavern

Phiên bản tiện ích mở rộng hiện tại: **v1.0.2**

Cập nhật lần này: **21-10-2026**. Manifest và file khởi chạy là 1.0.2; nhật ký kiểm thử của v1.0.1 cùng các bản trước đó được lưu lại dưới dạng lịch sử.

Tài liệu này giải thích phạm vi tương thích với môi trường máy chủ (host) của v1.0.2. Điều này không có nghĩa là các gói thử nghiệm v0.1.x trước đây vẫn còn tương thích, cũng không đảm bảo rằng các thay đổi giao diện cơ sở dữ liệu trong tương lai sẽ không cần phải điều chỉnh lại.

Tiện ích mở rộng này hướng tới mục tiêu tương thích với SillyTavern phiên bản từ **1.14.0 đến 1.19.0**.

- **1.14.0–1.16.0**: Tải module ES nhưng không gọi `activate`; điểm khởi chạy (entry point) sẽ tự động đợi `SillyTavern.getContext()` và giao diện cài đặt sẵn sàng.
- **1.17.0–1.19.0**: Sẽ gọi các hàm `activate`, `enable`, `disable`; điểm khởi chạy có cơ chế bảo vệ đơn phiên bản (singleton), các lệnh gọi lặp lại sẽ không tạo ra Desktop Pet thứ hai.
- Vòng đời và thiết lập của Desktop Pet sử dụng `SillyTavern.getContext()`, `extensionSettings` và `saveSettingsDebounced`. Tính năng trò chuyện từ v0.6.0 sẽ import bộ sinh tham số `openai.js` gốc của phiên bản tương ứng khi người dùng gửi yêu cầu; tính năng hoàn thành văn bản (text completion) sử dụng thêm `script.js` và `textgen-settings.js`, tất cả đều kiểm tra các API khả dụng trước khi gọi.
- Khi trình duyệt khôi phục từ bộ nhớ cache (bfcache), Desktop Pet sẽ được giữ nguyên; khi thoát thông thường, tắt tiện ích hoặc dọn dẹp, Desktop Pet cùng các bộ theo dõi (observer), bộ hẹn giờ (timer) và bảng cài đặt sẽ bị gỡ bỏ.
- Trước khi ảnh được giải mã thành công, Desktop Pet gốc từ cơ sở dữ liệu sẽ không bị ẩn đi. Khi tải ảnh thất bại, Desktop Pet gốc vẫn được giữ lại và cho phép các động tác tiếp theo thử tải lại.

## Đối chiếu phiên bản chính thức

Đã đối chiếu bộ tải tiện ích mở rộng, API ngữ cảnh, vùng chứa cài đặt và thông tin phiên bản trên các Git tag chính thức: 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0. Các commit cố định và mã băm (hash) của tệp được ghi lại trong thư mục làm việc `work/erii-host-contracts/sources.json`, không đưa vào gói phát hành.

## v0.5.8 Kiểm thử môi trường lịch sử

Dưới đây là phạm vi kiểm thử thực tế của các phiên bản lịch sử. Kết quả kiểm tra của phiên bản mới nhất nằm ở cuối tài liệu.

- Bản **1.14.0** và **1.19.0**: Sử dụng hình ảnh Docker chính thức để tải tiện ích mở rộng này; đã vượt qua các bài kiểm tra về Desktop Pet, bảng cài đặt, lưu vị trí kéo thả, khôi phục khi làm mới trang, nhấp chuột, chuột phải, cuốn sổ nhỏ, kích thước hiển thị trên điện thoại và tác vụ mô phỏng cơ sở dữ liệu.
- Bản **1.15.0–1.18.0**: Khởi động bằng hình ảnh chính thức và xác nhận tiện ích mở rộng, bảng cài đặt cùng số hiệu phiên bản 0.5.8 xuất hiện thành công; khả năng tương thích của điểm khởi chạy đã đạt yêu cầu; quy trình tắt hoàn toàn, bật lại và kiểm tra hồi quy tương tác được thực hiện đại diện trên bản 1.14.0 / 1.19.0.

*Lưu ý:* Đây là các phiên bản SillyTavern cách ly hoàn toàn sạch sẽ, không phải là bản cài đặt tại `D:\Jiuguan` của bạn; các tác vụ cơ sở dữ liệu sử dụng cấu trúc dữ liệu mô phỏng dạng chỉ đọc từ Vue gốc. Việc cài đặt/cập nhật thực tế, các tác vụ cơ sở dữ liệu thực tế và phần cứng điện thoại thật vẫn cần được xác nhận trực tiếp trong môi trường của bạn.

Nếu plugin cơ sở dữ liệu trong tương lai thay đổi cấu trúc giao diện của `DeskPetLayer`, `DeskPet` hoặc `NoticeBubble`, Tiểu Hội (Erii) sẽ nhắc nhở rằng giao diện cơ sở dữ liệu hiện tại không tương thích và giữ lại Desktop Pet gốc của cơ sở dữ liệu.

## v0.5.11 Kiểm thử lịch sử

Các tính năng mới sử dụng API sẵn có của trình duyệt, không thêm bất kỳ phụ thuộc nào vào module nội bộ của SillyTavern. Các tính năng mới như: ló đầu, cốt truyện, khoảng cách nút dấu nhân (X), dừng tác vụ mô phỏng và độ rộng màn hình máy tính / điện thoại đã được kiểm tra trên trang độc lập; các nhật ký kiểm thử thực tế trên các phiên bản chính thức trước đây được giữ lại làm dữ liệu lịch sử. Hiệu năng cuối cùng của v0.5.11 trên SillyTavern thực tế, cơ sở dữ liệu thật và thiết bị di động vật lý của bạn vẫn cần được kiểm tra thêm.

## v0.5.12 Kiểm thử lịch sử

Phiên bản này chỉ điều chỉnh thời điểm kích hoạt hiển thị ở mép màn hình và hiệu ứng chuyển cảnh cục bộ, không thêm phụ thuộc mới vào API của SillyTavern. Đã kiểm tra tính năng bám viền lập tức ló đầu, giữ nguyên khi di chuột qua (hover), kéo thả và ưu tiên tác vụ trên độ rộng màn hình máy tính và điện thoại. Môi trường SillyTavern thực tế và điện thoại vật lý vẫn cần được xác nhận lại sau khi cập nhật.

## v0.5.13 Kiểm thử lịch sử

Lần này sửa lỗi đồng bộ tác vụ hiện tại với thao tác dừng, thông báo lỗi khi dừng thất bại và cuốn sổ nhỏ độc lập sau khi ẩn Desktop Pet. Không thêm phụ thuộc mới vào API nội bộ của SillyTavern; vẫn đọc tác vụ do giao diện cơ sở dữ liệu gốc cung cấp và gọi thao tác dừng gốc khi người dùng nhấp chuột. Các tác vụ ghi nhận gần đây chỉ dùng để ghi chép vào cuốn sổ nhỏ, không dùng làm mục tiêu để dừng.

Các kịch bản mô phỏng lỗi tác vụ trên màn hình máy tính và điện thoại, chuyển đổi tác vụ, cập nhật thao tác dừng, ngắt kết nối nguồn, mở sổ tay sau khi ẩn và kiểm thử hồi quy tương tác đều được kiểm tra trong bản xem trước độc lập. Các kiểm tra phiên bản SillyTavern chính thức trước đây được giữ lại làm dữ liệu lịch sử, không có nghĩa là v0.5.13 đã được kiểm tra lại trên toàn bộ các phiên bản. Các môi trường thực tế tại `D:\Jiuguan`, cơ sở dữ liệu thật và điện thoại vật lý vẫn cần kiểm tra sau khi cập nhật.

## v0.5.14 Kiểm thử lịch sử

Lần này chỉ sửa đổi hành vi khi hết thời gian của bong bóng cốt truyện cục bộ: từ thu lại chuyển thành tự động đổi mẩu truyện mới mỗi 30 giây, đồng thời giữ lại các tính năng đổi mẩu truyện thủ công, tạm dừng khi đang đọc, đóng lại và ưu tiên tác vụ cơ sở dữ liệu. Không thêm API hay phụ thuộc mới từ SillyTavern.

Các kiểm thử quy tắc cốt truyện, đổi bài liên tục trên kích thước máy tính / điện thoại, tạm dừng khi hover / focus / chạm, đóng, công tắc tự động kể chuyện và dừng tác vụ được thực hiện trong trang xem trước độc lập; đồng thời dùng bộ đếm thời gian thực của trình duyệt để kiểm tra chu kỳ đổi bài 30 giây một lần. Các bài kiểm tra phiên bản lịch sử không đồng nghĩa với việc v0.5.14 đã được kiểm tra thực tế trên `D:\Jiuguan` hay điện thoại thật, kết quả cuối cùng vẫn cần xác nhận sau khi cài đặt.

## v0.6.0 Kiểm thử lịch sử

Bổ sung tính năng trò chuyện độc lập và công tắc chi tiết tác vụ. Đã đối chiếu `openai.js` của các bản chính thức 1.14.0–1.19.0: bản 1.14.0 dùng `sendOpenAIRequest('quiet', messages, signal)`; các bản 1.15.0–1.19.0 dùng bản sao cài đặt từ `createGenerationParameters`, sau đó gửi yêu cầu tới backend trò chuyện gốc. Cấu hình riêng sử dụng `custom_url` / `custom_include_headers` của các phiên bản này; API key trống cũng sẽ ghi đè rõ ràng lên key CUSTOM của host nhằm tránh việc dùng nhầm key của kết nối khác.

Mỗi yêu cầu có một AbortController độc lập, không phát ra sự kiện sinh nội dung hay sự kiện dừng toàn cục. Yêu cầu sử dụng tin nhắn do tiện ích tự tổng hợp, không thực hiện cơ chế lắp ghép cốt truyện theo preset hiện tại, không tạo ra các tầng tin nhắn mới trong văn bản chính của SillyTavern. Bản 1.14.0 khi dùng lệnh gọi quiet gốc sẽ đi qua sự kiện `CHAT_COMPLETION_SETTINGS_READY` ban đầu; hoàn thiện văn bản sử dụng sự kiện gốc `TEXT_COMPLETION_SETTINGS_READY`. Khi cài đặt cùng các tiện ích mở rộng khác có sửa đổi tham số yêu cầu, vẫn cần kiểm tra thực tế trên máy.

Kiểm thử trên trình duyệt độc lập bao quát các độ rộng 1280 / 375 / 320, thu nhỏ vùng hiển thị màn hình, lưu lịch sử, dừng / thử lại, công tắc lưu key, lỗi giao diện, bảo mật văn bản và dọn dẹp; chuyển đổi chi tiết / tóm tắt tác vụ, chi tiết dài hơn 600 từ, dừng tác vụ gốc cùng các cử chỉ / ló đầu sẵn có đã được hồi quy hoàn tất.

Môi trường SillyTavern cách ly của các bản chính thức 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0 đều vượt qua bài kiểm tra trò chuyện lần này: module gốc thực tế cấu hình yêu cầu, chuyển đổi kết nối hiện tại / kết nối riêng, dừng độc lập, lưu cài đặt tiện ích mở rộng và khôi phục khi làm mới; cài đặt kết nối toàn cục của SillyTavern vẫn đồng nhất với cuộc trò chuyện chính. Ngoài ra, trên backend SillyTavern thực tế của 6 phiên bản này, đã dùng API mô phỏng cục bộ để kiểm tra địa chỉ, mô hình, tin nhắn và việc chuyển tiếp khi có/không có key của API riêng. Không kết nối với nhà cung cấp AI thực tế. Hoàn thiện văn bản lần này chỉ đối chiếu interface và kiểm tra logic độc lập, chưa gửi yêu cầu thực tế trong 6 phiên bản này.

Báo cáo trong thư mục làm việc: `小绘-v0.6.0-聊天-酒馆兼容检查.json`, `小绘-v0.6.0-本地接口转发检查.json`, `小绘-v0.6.0-聊天检查.json`. Các báo cáo và script kiểm thử này không đưa vào gói cài đặt.

Các yêu cầu tới nhà cung cấp AI thực tế trong quá trình kiểm thử đều bị chặn lại thành phản hồi mô phỏng, không gửi yêu cầu trả phí. API người dùng thật, tác vụ thực tế của cơ sở dữ liệu v1.2, việc cài đặt cập nhật tại `D:\Jiuguan` và bàn phím điện thoại thật vẫn chờ người dùng xác nhận. Chưa cài đặt hoặc đẩy lên kho lưu trữ của người dùng.

## v0.6.1 Kiểm thử lịch sử

Danh sách mô hình sử dụng `POST /api/backends/chat-completions/status`, truyền vào `chat_completion_source: custom`, `custom_url` và `custom_include_headers`. Backend sẽ gửi yêu cầu `/models` tới địa chỉ cơ sở đã điền. Giữ lại tên mô hình nhập thủ công, thất bại không làm thay đổi kết nối toàn cục, key trống sẽ ghi đè rõ ràng lên key CUSTOM của host.

Đã kiểm tra trên các độ rộng 1280 / 375 / 320 về việc chọn danh sách, quay về nhập tay, ẩn key, hủy bỏ, thay đổi địa chỉ, đóng / dọn dẹp, lưu lựa chọn và bố cục. Bản xem trước mặc định mới thông qua chuyển tiếp HTTP thực tế đến interface kiểm thử cục bộ, xác nhận 2 tin nhắn khác nhau nhận được 2 kết quả upstream khác nhau tương ứng, kèm theo lịch sử gần nhất, khi chưa cấu hình hoặc xảy ra lỗi sẽ không có phản hồi cố định hay báo thành công giả. Quá trình kiểm thử không gọi nhà cung cấp AI thực tế.

Môi trường SillyTavern cách ly 1.14.0–1.19.0 đã kiểm tra cổng vào danh sách mô hình, chuyển tiếp backend thực tế, trạng thái có key / không key và việc duy trì cài đặt toàn cục của SillyTavern; kết quả xem tại thư mục làm việc `小绘-v0.6.1-模型列表-酒馆兼容检查.json`. Việc gửi tin nhắn trò chuyện / dừng / thử lại và hiển thị tác vụ đã được kiểm thử hồi quy trên trang độc lập.

Dịch vụ xem trước chỉ dùng cho phát triển cục bộ, không đưa vào gói cài đặt; tiện ích mở rộng chính thức vẫn dùng backend gốc của SillyTavern. Quyền hạn API của tài khoản thực tế, tính khả dụng thực tế của mô hình, chất lượng câu trả lời và hành vi trên điện thoại thật vẫn cần người dùng trải nghiệm.

## v0.6.2 Kiểm thử lịch sử

Lần này không bổ sung thêm API nội bộ nào của SillyTavern. Cài đặt trò chuyện bổ sung thêm phong cách, ký ức thủ công, bản nháp và mốc thời gian của tin nhắn cũ, tiếp tục sử dụng cài đặt tiện ích mở rộng của tài khoản để lưu trữ; API key tiếp tục được lưu trong bộ nhớ riêng của thiết bị. Thao tác sao chép và xuất file TXT sử dụng khả năng sẵn có của trình duyệt, không thêm dịch vụ từ xa nào.

Đã kiểm tra trên độ rộng 1280 / 375 / 320 đối với việc sao chép, xuất file thật, trả lời lại và sửa để gửi lại (thành công / hủy / thất bại), khôi phục bản nháp và chỉnh sửa, đưa phong cách và ký ức thủ công vào yêu cầu, bản ghi cũ không bị gán thời gian giả, vị trí đọc và thu nhỏ màn hình hiển thị. Báo cáo: thư mục làm việc `小绘-v0.6.2-聊天增强检查.json`.

Các tính năng gửi / dừng / thử lại, hiển thị tóm tắt / đầy đủ của tác vụ và nút dừng gốc của cơ sở dữ liệu đã hồi quy thành công. Danh sách mô hình và chuyển tiếp HTTP thật của bản xem trước mặc định tiếp tục kết nối với interface kiểm thử cục bộ, kiểm tra việc truyền tin nhắn và lịch sử khác nhau, không có phản hồi cố định khi gặp lỗi. Báo cáo: `小绘-v0.6.2-聊天检查.json`, `小绘-v0.6.2-模型列表与真实转发检查.json`.

Đợt này không gọi nhà cung cấp AI thật. Ký ức thủ công và phong cách trò chuyện đã được xác nhận là được đưa vào yêu cầu; chất lượng phản hồi thực tế, độ trễ và giới hạn của nhà cung cấp vẫn cần thử nghiệm với API thật; việc cập nhật trên `D:\Jiuguan`, tác vụ cơ sở dữ liệu thực tế và bàn phím điện thoại thật chưa được xác thực. Kết quả kiểm thử không thể thay thế cho việc nghiệm thu của người dùng.

Cả 6 bản SillyTavern cách ly 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0 đều đã tải v0.6.2 để kiểm tra yêu cầu gốc của API hiện tại / riêng biệt, dừng độc lập, duy trì cài đặt trò chuyện gốc và API toàn cục, cũng như việc lưu cài đặt gốc và khôi phục sau khi làm mới đối với bản nháp, phong cách, ký ức thủ công và thời gian tin nhắn. Báo cáo: `小绘-v0.6.2-聊天-酒馆兼容检查.json`. Kết quả AI được thay thế bằng phản hồi thử nghiệm ở phía trình duyệt; đây là bằng chứng chạy thực tế trên host, không phải chứng minh chất lượng AI thực tế.

## v0.7.0 Kiểm thử lịch sử

Lối chơi đời sống (life) sử dụng tính năng lưu cài đặt tiện ích mở rộng sẵn có cùng khả năng thời gian, DOM, hình ảnh, thanh tiến trình của trình duyệt, không thêm API nội bộ SillyTavern, thư viện phụ thuộc bên ngoài hay dịch vụ backend mới nào. Đi làm / ăn uống được tính theo mốc thời gian (timestamp), trang web chỉ thăm dò (polling) để làm mới hiển thị; tiền lương tan làm phải nhận thủ công, nhật ký ăn uống chỉ thanh toán một lần.

Mô hình độc lập kiểm tra thời gian / tiền lương của 3 công việc, giá cả / thời lượng của 4 loại thức ăn, giới hạn một hoạt động duy nhất, số dư vàng không đủ, nhận trùng / mua trùng, tan làm sớm, khôi phục đi làm và ăn uống ngoại tuyến (offline) cùng giới hạn của sổ cái chi tiêu. Báo cáo: thư mục làm việc `小绘-v0.7.0-生活逻辑检查.json`.

Trình duyệt độc lập ở độ rộng 1280 / 375 / 320 đã kiểm tra ranh giới cửa sổ đời sống, tranh minh họa đi làm / ăn uống, đếm ngược thực tế, lưu / làm mới / khôi phục ngoại tuyến, xác nhận tan làm sớm, ưu tiên tác vụ cơ sở dữ liệu và nút dừng gốc, duy trì tọa độ Desktop Pet, dọn dẹp tài nguyên. Kích thước máy tính còn chờ thực tế 8 giây để ăn hết bánh pudding; công việc thời gian dài được kiểm tra bằng độ lệch thời gian thử nghiệm, không làm thay đổi thời lượng thực tế. Báo cáo: `小绘-v0.7.0-生活界面检查.json`. Lối chơi đời sống không phát ra yêu cầu API nào.

Tính năng nâng cao trò chuyện cũ, dừng tác vụ / cuốn sổ nhỏ đã hồi quy trên kích thước máy tính và điện thoại, báo cáo: `小绘-v0.7.0-聊天增强检查.json`, `小绘-v0.7.0-任务停止与小本子检查.json`. Đồ họa được tạo bằng ImageGen tích hợp; độ trong suốt, kích thước và dung lượng của 4 ảnh WebP mới xem tại `小绘-v0.7.0-生活插图检查.json`.

Mục tiêu vẫn là 1.14.0–1.19.0. Các bài kiểm tra chạy thực tế về trò chuyện và điểm khởi chạy trên 6 phiên bản trước đây được giữ lại làm dữ liệu lịch sử, không coi như tính năng đời sống đợt này đã được kiểm tra lại trên toàn bộ 6 bản. Môi trường `D:\Jiuguan`, tác vụ cơ sở dữ liệu thật và điện thoại thật vẫn cần xác nhận sau khi cập nhật.

Đợt này dùng 2 phiên bản cách ly chính thức là 1.14.0 và 1.19.0 để tải thực tế v0.7.0, kiểm tra việc lưu cài đặt gốc, khôi phục trạng thái làm việc khi làm mới, nhận lương, trừ tiền mua đồ ăn, ăn xong, duy trì cài đặt văn bản chính / API toàn cục / trò chuyện riêng. Báo cáo: `小绘-v0.7.0-生活-酒馆兼容检查.json`. Việc hoàn thành công việc và ăn uống sử dụng độ lệch thời gian thử nghiệm; không thay đổi thời lượng sản xuất hay gọi nhà cung cấp AI thực tế.

## v0.7.1 Các thay đổi và phạm vi kiểm tra lần này

Lần này chỉ bổ sung liên kết hình ảnh cho 4 loại thức ăn, hình thu nhỏ khi gọi món và đổi tên điểm truy cập, không thêm API SillyTavern mới. Hoạt động tiếp tục lưu các trường `kind/id/startedAt/uid` cũ, các bản ghi thức ăn của phiên bản cũ sẽ lấy hình ảnh tương ứng từ cùng một bảng danh mục, không cần phải đặt lại tiền vàng hay hoạt động.

Tiếp tục sử dụng bằng chứng kiểm tra thực tế trên host 1.14.0 / 1.19.0 của v0.7.0 và bằng chứng về điểm khởi chạy / trò chuyện của 6 bản trước; việc chuyển đổi hình ảnh và đổi tên đợt này được kiểm tra trên trình duyệt độc lập, không xem kết quả lịch sử là đã kiểm tra lại trên tất cả các host. SillyTavern thực tế, cơ sở dữ liệu và điện thoại thật của người dùng vẫn cần xác nhận sau khi cài đặt cập nhật.

Trình duyệt độc lập ở độ rộng 1280 / 375 / 320 đã mua lần lượt 4 món ăn, xác nhận ảnh trên menu, ảnh trên sổ tay và ảnh Desktop Pet lơ lửng đều khớp và tải bình thường; kiểm tra việc món ăn đang ăn ở phiên bản cũ vẫn giữ nguyên `uid / tiền vàng / tổng chi tiêu`, khi kết thúc không trừ tiền nữa; lối vào "Sổ tay sinh hoạt" trong cuốn sổ nhỏ và cài đặt tiện ích mở rộng đều mở thành công. Báo cáo: `小绘-v0.7.1-四种吃饭界面检查.json`.

Quy trình đời sống cũ, thời gian ăn bánh pudding thực tế 8 giây, làm mới / khôi phục ngoại tuyến, ưu tiên tác vụ và nút dừng cơ sở dữ liệu gốc cũng đã vượt qua kiểm thử hồi quy trên cả 3 độ rộng: `小绘-v0.7.1-生活界面检查.json`; quy tắc mô hình xem tại `小绘-v0.7.1-生活逻辑检查.json`. Không gửi yêu cầu API trò chuyện nào. Đã kiểm tra 4 ảnh trong suốt, kích thước và dung lượng tệp 768×768 xem tại `小绘-v0.7.1-四种吃饭插图检查.json`.

## v0.8.0 Các thay đổi và phạm vi kiểm tra lần này

Lần này không bổ sung phụ thuộc vào API nội bộ của SillyTavern, vẫn dùng `SillyTavern.getContext()`, `extensionSettings`, `saveSettingsDebounced` và phương thức yêu cầu trò chuyện ban đầu. Về phía cơ sở dữ liệu, bổ sung 3 vị trí đọc hoặc gọi hàm, tất cả đều có phương án dự phòng:

- **Mở cơ sở dữ liệu**: Ưu tiên gọi API công khai `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()`, nếu không có sẽ quay về nhấp vào mục cơ sở dữ liệu trong menu tiện ích mở rộng.
- **Chuyển tới giao diện chỉ định**: Gọi hành động chuyển trang của kho định tuyến giao diện cơ sở dữ liệu `acu-v2-router`, tương đương với việc nhấp vào thanh bên của nó, chỉ chuyển đổi trang; khi không tìm thấy sẽ quay về nhấp nút thanh bên, nếu vẫn không được thì chỉ mở cơ sở dữ liệu và hiển thị thông báo.
- **Hình ảnh của Nãi Đán (Naidan)**: Chỉ đọc bảng hình ảnh hiện đang được tải bởi component Desktop Pet của cơ sở dữ liệu (`POSE_IMAGES` và ảnh ló đầu `peekSrc`), không sao chép, không phân phối; khi không đọc được thì không thể chuyển sang Nãi Đán, nếu đang ở Nãi Đán thì để Desktop Pet gốc của cơ sở dữ liệu xuất hiện.

Kiểm tra:

- Kiểm thử đơn vị (unit test) trong thư mục làm việc gồm 32 hạng mục: thông tin nhân vật và địa chỉ ảnh (địa chỉ của Tiểu Hội trùng khớp từng chữ với bản 0.7.1), lựa chọn lời thoại, quy tắc nuôi dưỡng (giới hạn hàng ngày, tăng cấp, suy giảm và đóng băng chỉ số nhu cầu, độ ưu tiên tâm trạng, quy đổi người dùng cũ), lưu trữ đời sống (đọc nguyên vẹn dữ liệu lưu của bản 0.7.1, nhiều nhân vật cùng hoạt động đồng thời, trợ cấp tối thiểu, chỉ nhận lương một lần).
- Trang xem trước độc lập (mô phỏng ngữ cảnh SillyTavern và cấu trúc giao diện cơ sở dữ liệu, trên máy tính và độ rộng 375): chuyển đổi giữa 3 nhân vật, ngôi nhà Desktop Pet, cuốn sổ nhỏ, bong bóng thoại tác vụ (đã nhận / đang xử lý / thành công / lỗi / dừng), sổ tay sinh hoạt, trò chuyện (interface mô phỏng cục bộ), cài đặt tiện ích mở rộng, thông báo khi không có cơ sở dữ liệu.
- Môi trường máy chủ thực tế: Trên bản SillyTavern 1.17.0 của máy người dùng, mở thêm một phiên bản cách ly (thư mục dữ liệu riêng, cổng khác, không chạm vào dữ liệu SillyTavern người dùng đang dùng), dùng script toàn cục của 酒馆助手 (SillyTavern Assistant) để tải cơ sở dữ liệu `naiv1.2.3`. Xác nhận tiện ích mở rộng tải bản 0.8.0, nhận diện được cơ sở dữ liệu và nhận thông báo thực tế, đọc được 24 ảnh cùng ảnh ló đầu của Nãi Đán, chuyển đổi sang Nãi Đán và ló đầu bám viền, nút tắt mở bảng "Thúc đẩy cốt truyện" và bảng biểu trực quan hóa, trò chuyện được backend SillyTavern chuyển tiếp tới interface mô phỏng cục bộ và trả lời theo đúng thiết lập nhân vật của Nãi Đán, ngăn kéo dưới đáy của cuốn sổ nhỏ trên giao diện điện thoại.

*Chưa kiểm tra:* Tác vụ điền bảng / thúc đẩy cốt truyện do AI điều khiển trên máy chủ thực tế (cần gọi dịch vụ trả phí, lời thoại tác vụ và nút dừng đã được xác thực mô phỏng trong trang xem trước theo cấu trúc dữ liệu giao diện gốc của cơ sở dữ liệu); các bản 1.14.0, 1.15.0, 1.16.0, 1.18.0, 1.19.0 đợt này không kiểm tra lại; bản 1.2.4 trên nhánh chính của kho cơ sở dữ liệu chưa được kiểm tra (sử dụng bản 1.2.3); phản hồi xúc giác và việc bật bàn phím trên điện thoại thật.

## v0.9.0 Các thay đổi và phạm vi kiểm tra lần này

Lần này bổ sung 2 tính năng có đọc văn bản hội thoại chính, trong đó có một tính năng sẽ ghi vào cơ sở dữ liệu. Về phía SillyTavern, sử dụng thêm `eventSource` / `eventTypes` của `getContext()` (chỉ lắng nghe `MESSAGE_SENT`, `MESSAGE_RECEIVED`, `MESSAGE_DELETED`, `CHAT_CHANGED` để đếm số tầng tin nhắn), `chat` (đọc `mes` của vài tầng gần nhất, bỏ qua các tầng ẩn có `is_system`) và `getCurrentChatId()`; mã nguồn chính thức của `st-context.js` từ bản 1.14.0 đến 1.19.0 đều cung cấp các định danh này (đã đối chiếu từng phiên bản trong mã nguồn), đợt này chỉ kiểm tra thực tế trên bản 1.17.0. Yêu cầu trò chuyện vẫn thực hiện theo cách cũ.

Về phía cơ sở dữ liệu, chỉ gọi các API công khai của `AutoCardUpdaterAPI`, tất cả đều kiểm tra phương thức có tồn tại hay không trước khi gọi:

- **Đọc:** `exportTableAsJson`, `getPlotPresetNames`, `getCurrentPlotPreset`.
- **Ghi** (chỉ trong chế độ kiểm tu, sau khi người dùng tích chọn và bấm "Áp dụng mục đã chọn"): `updateCell`, `updateRow`, `insertRow`, `deleteRow`, `switchPlotPreset`, `manualUpdate`. Tham số truyền theo chuẩn viết của `naiv1.2.3`: bảng dùng tên, hàng dùng số thứ tự hàng (1 là hàng dữ liệu đầu tiên), cột dùng tên trong tiêu đề cột; trước khi thực thi sẽ định vị lại theo `row_id` và đối chiếu giá trị gốc chưa bị thay đổi.
- **Hoàn tác:** `importTableAsJson(bản sao lưu)`. Trong `naiv1.2.3`, thao tác này mặc định lưu vĩnh viễn, sẽ được ghi vào cuộc trò chuyện như một lần lưu mới (trong lịch sử thao tác của cơ sở dữ liệu giá trị cũ vẫn còn, giao diện và các lần đọc sau sẽ lấy theo giá trị sau khi khôi phục).
- **Không sử dụng `importPlotPresetFromData`:** Trong `naiv1.2.3`, hàm này sẽ tiện tay chuyển cuộc trò chuyện hiện tại sang chế độ LLM Recall, trong khi API công khai lại không có phương thức xóa preset hoặc chuyển đổi ngược lại chế độ, dẫn đến việc không thể hoàn tác.

Kiểm tra:

- Kiểm thử đơn vị trong thư mục làm việc gồm 56 hạng mục (thêm mới 24 mục): sắp xếp và rút gọn dữ liệu bảng biểu, dọn dẹp các tầng văn bản chính, phân tích danh sách chỉnh sửa (khối code, thừa dấu phẩy, bị cắt cụt, vượt quá 12 mục), đối chiếu từng mục (bảng / hàng / cột không tồn tại, giá trị không đổi, xung đột cùng một vị trí, xung đột giữa xóa hàng và sửa hàng, điền lại bảng chỉ thực hiện một lần), thứ tự thực thi, định vị theo `row_id`, đối chiếu giá trị gốc trước khi ghi, từ chối khi bị khóa, từ chối khi đổi chat, hoàn tác và xác nhận lại khi "về sau đã từng thay đổi", chuyển lại preset, xuất mã sao lưu trước khi ghi, sao lưu vào bộ nhớ tạm khi không có IndexedDB; đếm số tầng của chế độ quan sát trò chuyện (đổi chat, tầng ẩn, lướt tin nhắn, xóa tầng), thời điểm đưa ra bình luận (4 giây, 60 giây, cơ sở dữ liệu bận trong 30 giây), tâm trạng "tủi thân" và hỏi han định kỳ 1 tiếng một lần, nội dung câu lệnh prompt.
- Bản xem trước độc lập (mô phỏng API công khai của cơ sở dữ liệu và sự kiện SillyTavern, trên máy tính, độ rộng 375 và 320): chuyển đổi chế độ kiểm tu, thanh phạm vi dữ liệu, tích chọn danh sách sửa đổi (không làm nhảy tiêu điểm), chọn tất cả chỉ chọn các mục hợp lệ, hủy chọn toàn bộ, áp dụng, hoàn tác, xác nhận lại khi bảng có thay đổi sau đó, khôi phục từ bản sao lưu trình duyệt sau khi làm mới trang, tải xuống file sao lưu; công tắc và tần suất của chế độ quan sát trò chuyện, bình luận sau mỗi 2 tầng tin nhắn mới, bong bóng "Đáp lại cô ấy", đánh dấu "Quan sát" trong lịch sử trò chuyện, xóa đếm sau khi trả lời, tâm trạng "tủi thân" và lời hỏi han sau 3 tin nhắn liên tiếp không ai phản hồi.
- Môi trường máy chủ thực tế: Cùng một phiên bản SillyTavern 1.17.0 cách ly + cơ sở dữ liệu `naiv1.2.3`, interface chính của hội thoại và trò chuyện Desktop Pet đều trỏ tới interface mô phỏng cục bộ (không gửi yêu cầu trả phí thực tế). Trong cuộc trò chuyện có tầng của người dùng và nhân vật: prompt kiểm tu đã mang theo bảng biểu thực tế, preset và 3 tầng văn bản chính gần nhất; sau khi tích chọn 3 mục và ghi thông qua API công khai (sửa ô, thêm một hàng, đổi preset), làm mới trang dữ liệu vẫn còn; sau khi hoàn tác, bảng và preset được khôi phục, làm mới trang vẫn giữ nguyên trạng thái đã khôi phục. Chế độ quan sát trò chuyện sau khi có thêm 2 tầng mới từ `/send`, `/sendas` khoảng 5 giây sẽ đưa ra bình luận, bong bóng hiển thị "Đáp lại nó".
- Hành vi tự thân của cơ sở dữ liệu quan sát được (không liên quan đến tiện ích mở rộng này, đã tái hiện trong trường hợp tiện ích không ghi dữ liệu): Trong cuộc trò chuyện mới chỉ có lời mở đầu, khi cơ sở dữ liệu mở lại đoạn chat sẽ xóa các trường bảng biểu trên tầng mở đầu rồi mới lưu, nội dung bảng được giữ lại trong runtime của chính nó, lần ghi tiếp theo sẽ lưu ngược trở lại. Do đó, khuyến nghị sử dụng tính năng kiểm tu trong các cuộc trò chuyện đã có hội thoại phát sinh.

*Chưa kiểm tra:* Chất lượng danh sách chỉnh sửa do mô hình thực tế đưa ra; việc điền lại toàn bộ bảng bằng `manualUpdate` trên máy chủ thực tế (cần gọi dịch vụ trả phí, chỉ mô phỏng trong bản xem trước); việc ghi dữ liệu dưới các chế độ lưu trữ khác nhau của cơ sở dữ liệu (JSON / SQLite) chưa được kiểm tra phân tách; các bản 1.14.0, 1.15.0, 1.16.0, 1.18.0, 1.19.0 và cơ sở dữ liệu 1.2.4; điện thoại thật.

## v0.9.1 Các thay đổi và phạm vi kiểm tra lần này

Lần này chỉ bổ sung khung thay đổi trang phục (wardrobe framework), không thêm phụ thuộc mới vào API của SillyTavern hay cơ sở dữ liệu: vẫn dùng `SillyTavern.getContext()`, `extensionSettings`, `saveSettingsDebounced`. Trạng thái sở hữu và đang mặc trang phục được ghi vào trường `skins` trong cài đặt của tiện ích này (`{ schema, owned, equipped, bought, spent }`, tách biệt theo từng nhân vật); tiền mua trang phục sử dụng ví tiền đời sống cũ (`life.coins`), nhật ký sổ cái dùng loại `spent` sẵn có, do đó khi hạ cấp về v0.9.0 thì trường `skins` sẽ bị bỏ qua, tiền vàng và sổ cái vẫn giữ nguyên mà không cần đặt lại. Địa chỉ hình ảnh vẫn sử dụng `import.meta.url` tương đối so với thư mục gốc của tiện ích, ảnh trang phục đặt tại `assets/skins/<skin_id>/`.

Kiểm tra:

- Dưới Node 22, đã kiểm tra cú pháp từng module được sửa đổi, cùng 7 nhóm kiểm tra logic thuần túy: khi danh mục trống chỉ có trang phục mặc định; xác thực các mục trong danh mục (định dạng ID, giá cả, phạm vi nhân vật, trùng lặp, bỏ qua mục viết sai); mua đồ (không trừ tiền khi số dư không đủ, ghi sổ khi thành công, từ chối mua lặp lại, trang phục độc quyền của nhân vật thì người khác không mua được, trang phục gắn nhãn "Tất cả nhân vật" thì ai cũng mua được); mặc vào / đổi về mặc định và "trả về false khi không có thay đổi"; làm sạch dữ liệu lưu (dữ liệu rác, giữ lại trang phục đã gỡ bỏ, hiển thị mặc định khi đang mặc trang phục đã gỡ); trang phục chỉ ghi đè các tư thế có hình ảnh, chủ đề chỉ ghi đè một phần; `LifeModel.spend` không trừ tiền khi số dư không đủ.
- Headless Chromium (2 độ rộng 1280 và 375) tải file `index.js` thực tế cùng ngữ cảnh SillyTavern mô phỏng: phiên bản tiện ích 0.9.1; sổ tay sinh hoạt có 4 tab, tab thay đồ có thẻ trang phục mặc định hiển thị "Đang sử dụng" và vô hiệu hóa nút bấm, nội dung thông báo khi danh mục trống; sau khi nạp 2 trang phục thử nghiệm thì thực hiện trọn vẹn quy trình — hiển thị giá và nhắc nhở "còn thiếu bao nhiêu", sau khi mua ví tiền từ 130 đổi thành 10, sổ cái xuất hiện dòng "Đã tiêu 120 tiền vàng mua trang phục「Yukata mùa hè」", ghi `skins.owned` vào cài đặt; sau khi mặc, `data-skin` của Desktop Pet và sổ tay sinh hoạt, ảnh Desktop Pet lơ lửng, ảnh minh họa trong sổ tay đều chuyển sang ảnh trang phục, bong bóng thoại xuất hiện, ghi nhận `skins.equipped`; sau khi đổi lại mặc định thì ảnh và thuộc tính khôi phục lại; khi chuyển sang Zero chỉ nhìn thấy trang phục mặc định và trang phục có nhãn "Tất cả nhân vật"; nút "Thay đồ cho cô ấy" trong ngôi nhà Desktop Pet sẽ mở đúng trang thay đồ của nhân vật đó; không còn node DOM thừa sau khi hủy giao diện. Console chỉ có cảnh báo hiệu năng phần mềm WebGL của môi trường headless (từ hiệu ứng ánh sáng trong căn phòng, không liên quan đến thay đổi lần này).

*Chưa kiểm tra:* Máy chủ SillyTavern thật (cả 1.14.0–1.19.0 đợt này đều chưa tải), cơ sở dữ liệu thật, điện thoại thật; do trong danh mục chưa có trang phục thực tế nên hiệu ứng hiển thị thực tế của trang phục có đầy đủ tài nguyên (gồm các tư thế ló đầu, làm việc, ăn uống) chưa được kiểm nghiệm thực tế.

## v0.9.2 Các bản vá và phạm vi kiểm tra lần này

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Sử dụng định danh đoạn chat sẵn có, sự kiện `CHAT_CHANGED`, cài đặt và AbortController, không thêm module hay phụ thuộc nội bộ mới của SillyTavern.

Các bản sửa lỗi: Yêu cầu kiểm tu cố định snapshot tài liệu, chuyển đổi cuộc trò chuyện sẽ làm vô hiệu hóa yêu cầu cũ; kiểm tra lại quyền sở hữu/trạng thái bận sau khi chờ sao lưu và trước khi ghi từng mục, đối chiếu đoạn chat sao lưu khi hoàn tác; xóa hàng phải đối chiếu toàn bộ hàng và tiêu đề cột, chuyển preset phải đối chiếu preset gốc; quyết toán chính xác khi tắt chỉ số nhu cầu; cấm hoàn tác thông thường/cưỡng chế khi đang bận; hủy bỏ phản hồi trễ sau khi tắt bình luận quan sát hoặc chuyển đoạn chat.

Bằng chứng đợt này:

- Dưới môi trường Node có 25 nhóm kiểm tra logic thuần: chuyển đổi chat, chờ sao lưu, ngắt quãng hàng loạt, từ chối xung đột đồng thời, thay thế nguồn, quyền sở hữu sao lưu, áp dụng/hoàn tác thông thường, xung đột giá trị gốc, thay đổi ở cuối hàng dài, từ chối danh sách xóa hàng cũ, đóng băng/bật/khởi động lại chỉ số nhu cầu, cùng các hành vi sẵn có như ví tiền/hoạt động đời sống, lưu trữ trang phục, đổi mẩu truyện, danh sách mô hình và tham số tin nhắn.
- Trang thử nghiệm cách ly trên Edge tải các module thực tế của tiện ích, 15 nhóm kịch bản: yêu cầu chuyển chat và quay lại, sắp xếp lại hàng và thay đổi giá trị gốc, hoàn tác/hoàn tác cưỡng chế khi bận, phản hồi trễ sau khi tắt bạn đồng hành (bao gồm bỏ qua tín hiệu hủy), mở lại sau khi tắt, chuyển chat, bình luận thông thường và trò chuyện thông thường độc lập với nhau, thứ tự thực thi thực tế của các công tắc cài đặt; kéo thả, giữ nguyên tọa độ trong 7 giây tại chỗ, dừng tác vụ gốc; nhấp chuột phải bật/tắt, nhấn giữ cảm ứng, biên cửa sổ nổi, ngữ cảnh lịch sử, dọn dẹp tài nguyên ở độ rộng 1280/375/320. Lỗi trang bằng 0.
- Vượt qua 29 bài kiểm tra cú pháp JavaScript, kiểm tra manifest tiện ích; 53 ảnh WebP giải mã được và có kênh trong suốt, 54 liên kết tư thế cục bộ tồn tại. Dữ liệu byte của tài nguyên không đổi, không thẩm định lại từng ảnh về giải phẫu/tách nền.

*Chưa kiểm tra:* SillyTavern 1.14.0–1.19.0 thực tế đợt này chưa kiểm tra lại, việc chờ nội bộ API công khai của cơ sở dữ liệu thật và việc lưu vĩnh viễn JSON/SQLite, chất lượng danh sách sửa đổi AI thật, điền bảng trả phí, điện thoại thật. Các bản ghi máy chủ thực tế phía trước đều là bằng chứng lịch sử của các phiên bản cũ tương ứng. Dịch vụ chỉ kiểm tra lại trước và giữa các lần gọi phương thức công khai, không thể ngắt quãng hoặc rollback thao tác đã bắt đầu bên trong phương thức cơ sở dữ liệu; không cam kết toàn bộ lô chỉnh sửa là một transaction nguyên tử không thể chia cắt.

Khi danh sách xóa hàng của bản cũ thiếu trường hàng gốc sẽ từ chối áp dụng và nhắc tạo lại; tiếp tục đọc các dữ liệu lưu đời sống/nuôi dưỡng/trang phục/trò chuyện hiện có. Chưa đẩy lên GitHub, chưa sửa đổi bản cài đặt `D:\Jiuguan` của người dùng, không dùng tự động hóa để thay thế nghiệm thu của người dùng.

## v0.9.3 Trang phục và Phiếu hoa: Phạm vi kiểm tra lần này

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Đợt này tiếp tục dùng `extensionSettings`, `saveSettingsDebounced` cùng cơ chế phân tích hình ảnh, cửa sổ và tương tác sẵn có, không thêm API máy chủ hay phụ thuộc bên thứ ba nào mới.

Di chuyển dữ liệu lưu về phía trước: Tiền vàng cũ, làm việc/ăn uống, nhật ký và bản ghi sở hữu trang phục tiếp tục được đọc. `life.schema=3` bổ sung 3 trường phiếu hoa, `skins.schema=2` bổ sung chi tiêu phiếu hoa; các trường mới trong bản lưu cũ sẽ có giá trị bằng 0. Phiên bản cũ không nhận diện phiếu hoa, việc hạ cấp về bản cũ rồi lưu lại có thể làm mất các trường và nhật ký mới này, do đó nên sao lưu trước.

Bằng chứng đợt này:

- 9 nhóm kiểm tra mô hình thay trang phục: giá cả/tỷ lệ quy đổi, chưa sở hữu ban đầu, di chuyển bản lưu cũ, bảo vệ khi không đủ số dư/số lượng bất hợp pháp/tràn số, mua trùng lặp, mặc và khôi phục, trang phục tiền vàng cũ, tương thích công việc/thức ăn, ánh xạ 27 động tác.
- Edge tải các module chính thức, 10 nhóm kịch bản thay trang phục: nhấp chuột thực tế đổi/mua/mặc, điền thử không trừ tiền, đổi một phần, phiếu hoa còn lại, lưu khi làm mới, cách ly nhân vật, giải mã lần lượt 27 hình ảnh, tiền lương làm việc và ảnh ghép 4 bữa ăn, không tràn ngang ở các kích thước 1280/375/320, dọn dẹp tài nguyên, kéo thả khi mặc đồ mới và nút dừng cơ sở dữ liệu gốc. Lỗi trang và thiếu ảnh đều bằng 0.
- Đã kiểm tra lại trên mã nguồn đợt này đối với 25 nhóm mô hình và 15 nhóm hồi quy trình duyệt sẵn có, bao quát 6 bản sửa lỗi của v0.9.2, nhấn giữ trên điện thoại, chuột phải trên máy tính, giữ nguyên tọa độ 7 giây tại chỗ, dừng tác vụ và dọn dẹp cửa sổ. API và cơ sở dữ liệu đều là mô phỏng, không đại diện cho lệnh gọi interface thực tế.
- Kiểm tra cú pháp JavaScript, manifest tiện ích, manifest truyền thông/mã băm của trang phục, kích thước và độ trong suốt của 27 ảnh WebP mới, giữ nguyên byte của 53 ảnh WebP cũ cùng sự khớp nối giữa file nén và file nguồn. Ảnh mới kích thước 960×960, tổng cộng 6.766.248 byte; 8 động tác thường dùng được tải trước (preload), các động tác khác tải theo nhu cầu.

*Chưa kiểm tra:* Đợt này chưa tải từng phiên bản trên SillyTavern 1.14.0–1.19.0 thật, cũng chưa cập nhật `D:\Jiuguan` của người dùng, chưa kết nối cơ sở dữ liệu hoặc API thật, chưa thử nghiệm trên điện thoại thật, ví tiền đồng thời đa thiết bị hoặc lưu trữ lâu dài ở chế độ ẩn danh. Các thử nghiệm host nói trên được giữ lại làm bằng chứng lịch sử của các phiên bản tương ứng. Ví tiền trong bản xem trước hiện tại là dữ liệu thử nghiệm độc lập, tiện ích mở rộng chính thức sẽ không tặng số dư thử nghiệm. Chưa đẩy lên GitHub, quá trình cài đặt và nghiệm thu của người dùng vẫn chưa hoàn thành.

## v0.9.4 Cửa hàng độc lập: Phạm vi kiểm tra lần này

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Bổ sung `mall-window.js`, sử dụng ví tiền, danh mục trang phục, lưu cài đặt tài khoản và bố cục cửa sổ sẵn có; không thêm API máy chủ, thư viện phụ thuộc hay lệnh gọi mạng mới. Dữ liệu lưu đời sống tiếp tục là schema 3, trang phục là schema 2, tỷ lệ quy đổi và giá cả không thay đổi. Toàn bộ 80 ảnh WebP có cấu trúc byte đồng nhất với v0.9.3.

Bằng chứng đợt này:

- Edge tải điểm khởi chạy và style chính thức, 11 nhóm kiểm tra cửa hàng: bố cục 1280/375/320, nút bấm phía dưới luôn hiển thị, xem trước 4 tư thế, 3 lối vào thực tế, định vị quy đổi không trừ tiền, bảo vệ quy đổi không hợp lệ, quy đổi theo đợt và vé dư, mua không tự động mặc, không trừ tiền trùng lặp, thay đồ trong tủ quần áo, làm mới vẫn giữ nguyên key lưu của v0.9.3, quyền sở hữu nhân vật, đi làm và nhận lương, mô phỏng dừng tác vụ gốc.
- Kiểm tra cảm ứng độc lập lối vào từ tủ đồ sang cửa hàng; mô phỏng kéo xuống để đóng; giảm hiệu ứng động và dọn dẹp hủy bỏ; thu nhỏ trang hiển thị trên điện thoại về 320×360 để kiểm tra header thu gọn, thanh cuộn khu vực quy đổi và nút bấm phía dưới. Lỗi trang và thiếu file bằng 0. Cảm ứng tổng hợp và thu nhỏ trang không thể thay thế cho điện thoại vật lý và bàn phím thật.
- Vượt qua 9 nhóm mô hình phiếu hoa/trang phục, 25 nhóm mô hình sẵn có, 15 nhóm hồi quy trình duyệt cũ. Tiếp tục giữ lại 6 bản sửa lỗi gốc, trò chuyện thông thường và dừng tác vụ; cơ sở dữ liệu và API đều là mô phỏng.
- Vượt qua 30 kiểm tra cú pháp JavaScript, manifest tiện ích, manifest truyền thông 27 ảnh; 80 ảnh WebP trong suốt và giải mã được; ví tiền, mô hình trang phục và 5 module sửa lỗi hoàn toàn đồng nhất với trước khi tích hợp cửa hàng.
- Gói hoàn chỉnh có 122 tệp, gói cập nhật GitHub có 46 tệp, đều được so sánh từng byte với nguồn bảo trì. Gói cập nhật dựa trên nền tảng bảo trì v0.9.1 gốc, bao gồm các bản sửa lỗi của v0.9.2 và ảnh mới của v0.9.3, không thể dùng độc lập để cài đặt hoàn chỉnh.

*Chưa kiểm tra:* Đợt này chưa chạy trên SillyTavern thật hay cơ sở dữ liệu thật, chưa thử nghiệm trên điện thoại thật và bàn phím nhập liệu thật, cũng chưa thử nghiệm API trả phí, ví tiền đa thiết bị hay lưu trữ ẩn danh. Bản xem trước cục bộ vẫn dùng ví thử nghiệm độc lập, tiện ích chính thức không tặng tiền vàng. Chưa đẩy lên GitHub, chưa chỉnh sửa `D:\Jiuguan`; việc cài đặt thực tế và nghiệm thu của người dùng vẫn chưa hoàn tất. Các bằng chứng máy chủ thực tế nói trên được lưu lại cho các phiên bản lịch sử tương ứng, không mạo nhận là kết quả của đợt này.

## v1.0.0 Skin mật ngữ, đa hội thoại và thu gọn suy nghĩ: Phạm vi kiểm tra lịch sử

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Không bổ sung API nội bộ SillyTavern hay phụ thuộc vận hành bên thứ ba mới nào. Trò chuyện vẫn dùng bộ điều hợp kết nối cũ và kiểm soát hủy bỏ độc lập cho mỗi yêu cầu.

- Cuộc trò chuyện cũ giữ nguyên các trường ban đầu, cuộc trò chuyện mới được lưu trong `conversations` của từng nhân vật. Mỗi bản ghi chép, bản nháp, chế độ và yêu cầu đều độc lập; khi chuyển đổi Desktop Pet sẽ đóng cửa sổ và giữ lại lịch sử. Khi chuyển đổi bảng điều khiển trên điện thoại vẫn giữ lại yêu cầu chạy ngầm, chủ động đóng cửa sổ vẫn sẽ hủy yêu cầu của cửa sổ đó.
- Suy nghĩ có cấu trúc của interface cùng các thẻ `think/thinking/analysis/reasoning` được lưu độc lập, mặc định thu gọn. Chỉ hiển thị nội dung thực tế do interface trả về dưới dạng văn bản; ngữ cảnh trò chuyện thông thường chỉ mang theo văn bản chính. Suy nghĩ bị giới hạn tối đa 32.000 ký tự mỗi mục, cùng tính vào hạn mức lưu trữ với văn bản chính.
- Bổ sung tính năng nhập JSON của tiện ích này và mặc định xuất JSON, giữ lại định dạng TXT; hỗ trợ JSONL của SillyTavern, mảng tin nhắn và file TXT cũ có thể nhận diện được. Xác nhận trước khi nhập, lưu thành cuộc trò chuyện mới; không nhập API key, kết nối, ký ức thủ công hay danh sách chỉnh sửa có thể thao tác.
- Tích hợp 27 ảnh WebP của Zero, việc xác thực mật ngữ hoàn thành cục bộ, không gửi đến mô hình, không trừ tiền, không thống kê mua hàng. Giữ nguyên `skins schema 2`, `life schema 3`. 80 ảnh WebP gốc không chỉnh sửa nét vẽ.
- Báo cáo mô hình và trình duyệt đợt này xem tại thư mục làm việc `test-erii-0100-*`; hồ sơ kiểm tra bàn giao cuối cùng tập trung tại `outputs/小绘-v1.0.0-接入验证.json`. Bao quát các trường hợp: gửi đồng thời / phản hồi ngược thứ tự / dừng và đến muộn / khôi phục bản nháp / xuất nhập khứ hồi / tệp hỏng / cách ly nhân vật / mở khóa skin / độ rộng 375 và 320 / chiều cao hiển thị 320×360 / giải mã và hủy tài nguyên.

Trong quá trình sửa lỗi đã phát hiện và xử lý: lỗi biến cục bộ trùng tên trong tính năng xuất JSON mới; cột mới thêm vào làm tràn nút gửi ở chiều cao hiển thị thấp; cửa hàng đa nhân vật vẫn dùng tông màu tím của Tiểu Hội. Bằng chứng cuối cùng lấy theo báo cáo của phiên bản này.

Đợt này vẫn là kiểm tra trên Edge bằng mã nguồn chính thức kết hợp SillyTavern, cơ sở dữ liệu và API mô phỏng. Chưa kiểm tra lại từng phiên bản trên SillyTavern thật, chưa kết nối mô hình thật, chưa thử nghiệm bàn phím điện thoại thật, đồng thời lưu trữ trên nhiều thiết bị. Chưa đẩy lên GitHub, sửa đổi `D:\Jiuguan` hay cài đặt; cập nhật thực tế và nghiệm thu của người dùng còn chờ hoàn thành. Các thử nghiệm host thật ở trên thuộc về các phiên bản lịch sử tương ứng.

## v1.0.0 Tự kiểm tra và hiệu chỉnh (Lịch sử, số hiệu phiên bản thời điểm đó không đổi)

Đợt tự kiểm tra toàn diện này lấy phạm vi ranh giới là 32 tệp JS nguồn bảo trì, style chính thức, manifest, hướng dẫn và ánh xạ 107 ảnh WebP. Bổ sung các ca kiểm thử tái hiện lỗi: đóng mở nhanh 3 loại cửa sổ, chuyển đổi tiêu điểm cửa sổ, khôi phục khi làm mới đối với các kết nối khác nhau và cùng một kết nối nhưng khác key, hủy ghi nhớ, di chuyển key cũ, co về độ rộng điện thoại, phân bổ phản hồi quan sát, hoạt động tiếp theo tranh thanh toán thức ăn trước, một phần dữ liệu nuôi dưỡng bị trống, thiếu mốc thời gian tin nhắn, độ dài phản hồi dạng số thập phân và màn hình hiển thị chiều cao chỉ 200px.

Việc sửa chữa chỉ sử dụng interface lưu trữ tài khoản và trình duyệt ban đầu, cầu nối cơ sở dữ liệu gốc; không thêm API máy chủ hay phụ thuộc vận hành mới. Key vẫn không đưa vào `extensionSettings` hoặc xuất ra ngoài, khi việc di chuyển không rõ quyền sở hữu sẽ yêu cầu điền lại. Callback thanh toán thức ăn một lần thuộc về mô hình nội bộ của tiện ích, không liên quan đến API cơ sở dữ liệu.

Kiểm tra cuối cùng và bảng lỗi đầy đủ xem tại kết quả đầu ra trong thư mục làm việc `小绘-v1.0.0-全面自检报告.md/json`. 107 ảnh WebP gốc được giữ nguyên từng byte, dịch vụ kiểm tu và cơ chế sao lưu không đổi; các kiểm thử hồi quy JS/mô hình/trò chuyện/cửa hàng/tác vụ cũ tiếp tục được xác thực. CSS chỉ tập trung thẩm định bố cục và các quy tắc của đợt này cùng việc kiểm tra trên trình duyệt, không rà soát thủ công từng dòng khai báo trang trí.

SillyTavern 1.14.0–1.19.0 thật, cơ sở dữ liệu/mô hình thật, bàn phím điện thoại thật, tương tranh đa thiết bị vẫn chưa được xác thực. Trình duyệt cục bộ sử dụng dữ liệu mô phỏng, không thể thay thế cho nghiệm thu cài đặt thực tế; số hiệu phiên bản giữ nguyên 1.0.0, cần ghi đè hoàn toàn các tệp cập nhật đợt này và làm mới trang. GitHub chưa đẩy, `D:\Jiuguan` chưa sửa, `driverAccepted=false`.

## v1.0.1 Trò chuyện cùng cửa sổ và kích thước Desktop Pet (16-10-2026)

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0, không thêm interface nội bộ SillyTavern hay phụ thuộc bên thứ ba mới. Trò chuyện vẫn do bộ điều hợp cũ gửi đi, cấu trúc bản ghi không đổi, nhiều bản ghi của bản 1.0.0 gốc được đọc trực tiếp.

Không gian làm việc chỉ giữ lại một khung trò chuyện hiển thị duy nhất và một bộ vị trí kéo thả/thu phóng. Khi chuyển đổi sẽ thu cất bản nháp cũ, gắn nội dung hiện tại vào; mỗi yêu cầu và key vẫn thuộc về cuộc trò chuyện ban đầu. Phản hồi chạy ngầm sẽ không làm chuyển cửa sổ hiện tại hoặc ghi đè bản nháp hiện tại. Đóng toàn bộ cửa sổ trò chuyện sẽ dừng tất cả các yêu cầu đang chờ phản hồi; dừng phản hồi hiện tại không ảnh hưởng đến các cuộc hội thoại khác.

Điện thoại và máy tính dùng chung cài đặt kích thước 56–112px, hủy bỏ giới hạn tối đa 72px trước đây trên điện thoại; khi vùng hiển thị của màn hình/bàn phím quá nhỏ sẽ tạm thời giới hạn kích thước thực tế, không ghi đè lên giá trị đã lưu. Kéo thanh trượt được gộp sắp xếp lại theo khung hình động (animation frame), hiển thị số pixel hiện tại và nút khôi phục về 88px.

Đợt này dùng module và style chính thức, SillyTavern/API/cơ sở dữ liệu mô phỏng để kiểm tra cùng một cửa sổ DOM, chuyển đổi sau khi kéo/mở rộng, nhập/xóa, chỉnh sửa/làm mới bản nháp, vị trí đọc, xác nhận đặt lại, phản hồi ngược thứ tự ngầm, hủy khi đóng, cách ly key, màn hình hẹp 375/320 và chiều cao hiển thị 360/200. Kích thước bao quát các mức 56/72/88/96/112, bàn phím, cảm ứng tổng hợp, xoay màn hình ngang dọc, bám viền và khôi phục khi làm mới; phạm vi thực tế lấy theo ghi nhận trong `小绘-v1.0.1-接入验证.json`. 107 ảnh WebP được đối chiếu từng byte với gói cài đặt 1.0.0 trước khi sửa.

SillyTavern 1.14.0–1.19.0 thật chưa được kiểm tra lại từng bản trong đợt này, mô hình/cơ sở dữ liệu thật, thanh trượt điện thoại vật lý và bàn phím hệ thống, tương tranh đa thiết bị vẫn chờ người dùng xác nhận sau khi cập nhật. Chưa cài đặt, chưa đẩy lên GitHub hay sửa `D:\Jiuguan`; `driverAccepted=false`. Các bằng chứng host thật trước đây chỉ thuộc về các phiên bản lịch sử tương ứng.

## v1.0.2 Desktop Pet thứ tư: Tiểu Khắc (21-10-2026)

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0, không thêm interface nội bộ SillyTavern, phụ thuộc bên thứ ba hay trường lưu trữ mới nào. Nhân vật mới chỉ thêm một mục trong bảng đăng ký nhân vật (ID `claude`), thân Desktop Pet, cuốn sổ nhỏ, cửa sổ trò chuyện, sổ tay sinh hoạt, ngôi nhà Desktop Pet đều đọc tên, lời thoại, hình ảnh và thiết lập tính cách của cô ấy theo đối tượng nhân vật sẵn có; Tiểu Khắc không có trang phục phụ, không đưa vào cửa hàng.

Trò chuyện, độ thân mật, chỉ số nhu cầu, hoạt động của Tiểu Khắc được lưu tách biệt theo ID nhân vật, cấu trúc giống với Zero. Khi hạ cấp về v1.0.1, phiên bản cũ không nhận diện `claude`, Desktop Pet hiện tại sẽ tự động quay về Tiểu Hội; các bản ghi của Tiểu Khắc vẫn nằm trong tệp lưu, khi nâng cấp trở lại vẫn còn nguyên.

Kiểm tra đợt này: 58 hạng mục kiểm thử đơn vị trong thư mục làm việc đều vượt qua (bao gồm "mỗi ảnh Tiểu Khắc sử dụng đều có trong kho lưu trữ", "slot đổi tên ánh xạ tới đúng tệp của mình", "lời thoại không sao chép nguyên xi nhân vật khác"). Mở thêm một phiên bản SillyTavern 1.17.0 cách ly trên máy (thư mục dữ liệu độc lập, cổng 8123, interface chính trỏ về interface mô phỏng cục bộ, không phát yêu cầu trả phí thực tế), tải cơ sở dữ liệu `naiv1.2.3`: chuyển sang Tiểu Khắc từ cài đặt, lời chào đầu tiên, trạng thái chờ, nhấp chuột vẫy tay, kéo sang mép trái và mép dưới để ló đầu, động tác thư giãn trong cuốn sổ nhỏ (uống hồng trà), ngôi nhà Desktop Pet, gửi một tin nhắn trong cửa sổ trò chuyện (yêu cầu mang theo thiết lập nhân vật của Tiểu Khắc và mối quan hệ mặc định "chấp sự riêng"), duy trì Tiểu Khắc sau khi làm mới, bố cục điện thoại rộng 375px; 27 địa chỉ ảnh trả về qua SillyTavern đều là định dạng WebP. Ba giai đoạn động tác và lời thoại của tác vụ cơ sở dữ liệu gồm nhận việc, đang xử lý, hoàn thành được xác thực mô phỏng trên trang xem trước độc lập theo cấu trúc giao diện gốc của cơ sở dữ liệu.

*Chưa kiểm tra:* Phản ứng của Tiểu Khắc khi thực hiện tác vụ cơ sở dữ liệu thực tế (cần gọi dịch vụ trả phí), chất lượng câu trả lời khi mô hình thật đóng vai Tiểu Khắc, điện thoại thật, tải từng phiên bản trên SillyTavern 1.14–1.16 và 1.18–1.19. 107 ảnh WebP cũ không có sự thay đổi.