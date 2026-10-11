# Hướng dẫn tương thích phiên bản SillyTavern

当前扩展版本：**v0.9.3**

本文件说明的是 v0.9.3 的宿主兼容范围。它不代表早期 v0.1.x 实验包仍然兼容，也不代表未来数据库界面改动后无需适配。

Tiện ích mở rộng này nhắm đến việc tương thích với SillyTavern 1.14.0–1.19.0.

- 1.14.0–1.16.0 tải module ES nhưng không gọi `activate`, điểm đầu vào sẽ tự động đợi `SillyTavern.getContext()` và giao diện thiết lập.
- 1.17.0–1.19.0 sẽ gọi `activate`, `enable`, `disable`, điểm đầu vào có bảo vệ đơn bản thể (single-instance), việc gọi lại nhiều lần sẽ không tạo ra pet màn hình thứ hai.
- Vòng đời và thiết lập của pet màn hình sử dụng `SillyTavern.getContext()`, `extensionSettings` và `saveSettingsDebounced`. Tính năng trò chuyện của v0.6.0 sẽ nhập trình tạo tham số `openai.js` native của phiên bản tương ứng khi người dùng yêu cầu; tính năng hoàn thiện văn bản sử dụng riêng `script.js` và `textgen-settings.js`, cả hai đều kiểm tra API khả dụng trước.
- Giữ lại pet màn hình khi trình duyệt trả về bộ nhớ cache; các thao tác rời đi thông thường, vô hiệu hóa và dọn dẹp sẽ gỡ bỏ pet màn hình, observer, bộ đếm thời gian và bảng thiết lập.
- Không ẩn pet màn hình gốc của cơ sở dữ liệu trước khi hình ảnh được giải mã thành công. Khi tải ảnh thất bại, giữ lại pet màn hình gốc và cho phép các hành động tiếp theo thử tải lại.

## Đối chiếu phiên bản chính thức

Đã đối chiếu trình tải tiện ích mở rộng, giao diện ngữ cảnh, vùng chứa thiết lập và thông tin phiên bản của các thẻ Git chính thức 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0. Các commit cố định và mã băm (hash) của tệp được ghi lại trong không gian làm việc `work/erii-host-contracts/sources.json`, không đưa vào gói phát hành.

## Kiểm tra host lịch sử v0.5.8

Dưới đây là phạm vi kiểm tra thực tế của các phiên bản lịch sử. Kiểm tra hiện tại của phiên bản mới nhất xem ở cuối văn bản.

1.14.0 và 1.19.0 sử dụng image Docker chính thức để tải tiện ích này; pet màn hình, bảng thiết lập, kéo thả để lưu, làm mới để khôi phục, click, click chuột phải, sổ tay, kích thước điện thoại và mô phỏng nhiệm vụ cơ sở dữ liệu đều vượt qua.

1.15.0–1.18.0 khởi động bằng image chính thức và xác nhận tiện ích mở rộng, bảng thiết lập cùng số phiên bản 0.5.8 xuất hiện, tính tương thích của điểm đầu vào đã vượt qua; việc vô hiệu hóa hoàn toàn, kích hoạt lại và kiểm tra hồi quy tương tác được thực hiện lấy 1.14.0 / 1.19.0 làm đại diện.

Đây là các bản (instance) SillyTavern cách ly sạch sẽ, không phải bản `D:\Jiuguan` của bạn; nhiệm vụ cơ sở dữ liệu sử dụng cấu trúc dữ liệu Vue gốc được mô phỏng dưới dạng chỉ đọc. Việc cài đặt cập nhật thực tế, nhiệm vụ cơ sở dữ liệu thực tế và phần cứng điện thoại thật vẫn cần được xác nhận trên môi trường của bạn.

Nếu plugin cơ sở dữ liệu thay đổi cấu trúc giao diện của `DeskPetLayer`, `DeskPet` hoặc `NoticeBubble` trong tương lai, Tiểu Hội sẽ báo rằng giao diện cơ sở dữ liệu hiện tại không tương thích, đồng thời giữ lại pet màn hình gốc của cơ sở dữ liệu.

## Kiểm tra lịch sử v0.5.11

Tính năng mới sử dụng các API trình duyệt hiện có, không thêm phụ thuộc vào các module nội bộ của SillyTavern. Tính năng ló đầu, câu chuyện, khoảng cách dấu chữ X, dừng nhiệm vụ mô phỏng và chiều rộng màn hình máy tính / điện thoại được kiểm tra ở trang độc lập; hồ sơ kiểm tra thực tế ở các phiên bản chính thức trước đó được giữ lại làm bằng chứng lịch sử. Biểu hiện cuối cùng của v0.5.11 trên SillyTavern thực tế, cơ sở dữ liệu thực tế và phần cứng điện thoại thật của bạn vẫn chờ được xác nhận.

## Kiểm tra lịch sử v0.5.12

Lần này chỉ điều chỉnh thời điểm kích hoạt hiển thị sát rìa và chuyển cảnh cục bộ, không thêm phụ thuộc API SillyTavern nào mới. Ở chiều rộng máy tính và điện thoại đã kiểm tra việc bám sát rìa lập tức ló đầu, giữ nguyên khi di chuột, kéo thả và ưu tiên nhiệm vụ. Bản SillyTavern thực tế và điện thoại thật vẫn cần được xác nhận sau khi cập nhật.

## Kiểm tra lịch sử v0.5.13

Lần này khắc phục việc đồng bộ nhiệm vụ hiện tại với thao tác dừng, thông báo lỗi khi dừng thất bại và sổ tay độc lập sau khi ẩn pet màn hình. Không thêm phụ thuộc API nội bộ SillyTavern nào mới; vẫn đọc các nhiệm vụ do giao diện cơ sở dữ liệu gốc cung cấp và gọi thao tác dừng gốc khi người dùng nhấp chuột. Nhiệm vụ quan sát được gần đây chỉ dùng để ghi vào sổ tay, không lấy làm mục tiêu dừng.

Các lỗi nhiệm vụ mô phỏng ở kích thước máy tính và điện thoại, chuyển đổi nhiệm vụ, cập nhật thao tác dừng, ngắt kết nối nguồn, mở sổ tay sau khi ẩn và kiểm tra hồi quy tương tác được tiến hành trong trang xem trước độc lập. Các kiểm tra trên các phiên bản SillyTavern chính thức trước đây được giữ làm bằng chứng lịch sử, không có nghĩa là v0.5.13 đã được kiểm tra thực tế lại trên tất cả các phiên bản. Bản `D:\Jiuguan` thực tế, cơ sở dữ liệu thực tế và điện thoại thật vẫn chờ xác nhận sau khi cập nhật.

## Kiểm tra lịch sử v0.5.14

Lần này chỉ sửa đổi hành vi khi bong bóng câu chuyện cục bộ hết giờ: từ việc thu gọn đổi thành đổi bài mỗi 30 giây, đồng thời giữ lại thao tác đổi bài thủ công, tạm dừng đọc, đóng và ưu tiên nhiệm vụ cơ sở dữ liệu. Không thêm API hoặc phụ thuộc SillyTavern nào mới.

Việc kiểm tra quy tắc câu chuyện, đổi bài liên tục ở chiều rộng máy tính / điện thoại, tạm dừng khi di chuột / focus / chạm, đóng, công tắc tự động đổi câu chuyện và dừng nhiệm vụ được thực hiện ở trang xem trước độc lập; ngoài ra, sử dụng đồng hồ bấm giờ thực của trình duyệt để kiểm tra thao tác đổi bài 30 giây một lần. Kiểm tra các phiên bản SillyTavern lịch sử không có nghĩa là v0.5.14 đã được thử nghiệm thực tế lại trong `D:\Jiuguan` thực tế hoặc điện thoại thật, kết quả cuối cùng vẫn chờ xác nhận sau khi cập nhật.

## Kiểm tra lịch sử v0.6.0

Bổ sung tính năng trò chuyện độc lập và công tắc chi tiết nhiệm vụ. Đối chiếu `openai.js` chính thức từ 1.14.0–1.19.0: 1.14.0 dùng `sendOpenAIRequest('quiet', messages, signal)`; 1.15.0–1.19.0 dùng bản sao thiết lập của `createGenerationParameters`, sau đó gửi yêu cầu đến backend trò chuyện native. Cấu hình riêng sử dụng `custom_url` / `custom_include_headers` của các phiên bản này; khóa trống cũng ghi đè rõ ràng khóa CUSTOM của máy chủ, tránh sử dụng nhầm khóa của các kết nối khác.

Mỗi yêu cầu có AbortController độc lập, không gửi sự kiện tạo hoặc dừng toàn cục. Yêu cầu sử dụng tin nhắn tự tổ chức, không thực thi việc lắp ráp câu chuyện của preset hiện tại, không tạo các tầng chính văn của SillyTavern. Khi 1.14.0 sử dụng lời gọi `quiet` native của nó thì sẽ đi qua sự kiện `CHAT_COMPLETION_SETTINGS_READY` sẵn có; tính năng hoàn thiện văn bản sử dụng sự kiện `TEXT_COMPLETION_SETTINGS_READY` native. Khi cài đặt các tiện ích mở rộng khác có sửa đổi tham số yêu cầu, vẫn cần kiểm tra xác nhận trên máy thực.

Kiểm tra trình duyệt độc lập bao phủ các chiều rộng 1280 / 375 / 320, thu nhỏ màn hình hiển thị, lưu lịch sử, dừng / thử lại, công tắc lưu khóa, lỗi API, an toàn văn bản và dọn dẹp; chuyển đổi chế độ xem nhiệm vụ tóm tắt / đầy đủ, chi tiết vượt quá 600 chữ, dừng nhiệm vụ gốc, và các cử chỉ / ló đầu hiện có đã được kiểm tra hồi quy thành công.

Các bản SillyTavern cách ly chính thức 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0 đều vượt qua bài kiểm tra trò chuyện lần này: cấu trúc yêu cầu module native thực tế, chuyển đổi giữa kết nối hiện tại / kết nối riêng, dừng độc lập, lưu thiết lập tiện ích mở rộng và khôi phục sau khi làm mới; thiết lập kết nối toàn cục của SillyTavern và trò chuyện chính văn được giữ nguyên. Ngoài ra, trên các backend SillyTavern thực tế của 6 phiên bản này, sử dụng API mô phỏng cục bộ để kiểm tra địa chỉ API riêng, model, tin nhắn và chuyển tiếp có khóa / không khóa. Không kết nối với nhà cung cấp AI thật. Hoàn thiện văn bản lần này chỉ đối chiếu API và thực hiện kiểm tra logic độc lập, chưa gửi yêu cầu hoàn thiện văn bản thực tế từng cái một trong 6 phiên bản này.

Báo cáo trong không gian làm việc: `小绘-v0.6.0-聊天-酒馆兼容检查.json`, `小绘-v0.6.0-本地接口转发检查.json`, `小绘-v0.6.0-聊天检查.json`. Các báo cáo và kịch bản thử nghiệm này không đưa vào gói cài đặt.

Yêu cầu đến nhà cung cấp AI thực tế được chặn lại trong quá trình thử nghiệm dưới dạng phản hồi mô phỏng, chưa gửi yêu cầu trả phí. API người dùng thật, nhiệm vụ thực tế của cơ sở dữ liệu v1.2, cập nhật cài đặt `D:\Jiuguan` và bàn phím điện thoại thật vẫn chờ người dùng xác nhận. Chưa cài đặt hay đẩy lên kho lưu trữ của người dùng.


## Kiểm tra lịch sử v0.6.1

Danh sách model sử dụng `POST /api/backends/chat-completions/status`, truyền vào `chat_completion_source: custom`, `custom_url` và `custom_include_headers`. Backend sẽ gọi tới `/models` theo địa chỉ cơ sở đã điền. Giữ lại việc điền thủ công tên model, nếu thất bại không làm thay đổi kết nối toàn cục, khóa trống cũng ghi đè rõ ràng khóa CUSTOM của máy chủ.

Tại chiều rộng 1280 / 375 / 320, đã kiểm tra việc chọn từ danh sách, dự phòng thao tác thủ công, che giấu khóa, hủy bỏ, thay đổi địa chỉ, đóng / dọn dẹp, chọn rồi lưu và bố cục giao diện. Bản xem trước mặc định mới được truyền tải qua HTTP thực tế đến API mô phỏng cục bộ, kiểm tra hai tin nhắn khác nhau nhận được kết quả khác nhau từ phía upstream, mang theo lịch sử gần nhất, không có phản hồi cố định hoặc báo thành công giả khi chưa thiết lập hoặc xảy ra lỗi. Quá trình kiểm tra không gọi nhà cung cấp AI thật.

Các bản SillyTavern cách ly chính thức từ 1.14.0–1.19.0 giữ nguyên điểm đầu vào danh sách model, chuyển tiếp backend thực, chuyển tiếp có khóa / không khóa và cài đặt toàn cục của SillyTavern, kết quả xem tại không gian làm việc `小绘-v0.6.1-模型列表-酒馆兼容检查.json`. Việc gửi trò chuyện / dừng / thử lại và hiển thị nhiệm vụ được kiểm tra hồi quy trên trang độc lập.

Dịch vụ xem trước chỉ dùng cho quá trình phát triển trên máy cá nhân, không đưa vào gói cài đặt; tiện ích chính thức vẫn dùng backend nguyên bản của SillyTavern. Quyền API của tài khoản thật, tính khả dụng thực tế của model, chất lượng phản hồi và hành vi trên điện thoại thật vẫn chờ người dùng dùng thử.


## Kiểm tra lịch sử v0.6.2

Lần này không bổ sung API nội bộ nào của SillyTavern. Thiết lập trò chuyện thêm các mục phong cách, ghi nhớ thủ công, bản nháp và thời gian của tin nhắn cũ, tiếp tục sử dụng hệ thống lưu thiết lập của tiện ích tài khoản hiện tại; khóa tiếp tục được lưu riêng trên bộ nhớ thiết bị. Việc sao chép và xuất file TXT sử dụng tính năng mặc định của trình duyệt, không thêm dịch vụ từ xa mới nào.

Ở kích thước 1280 / 375 / 320, kiểm tra tính năng sao chép, xuất file thật, trả lời lại và sửa rồi gửi lại với các kết quả thành công / hủy / thất bại, khôi phục bản nháp và sau khi sửa, truyền phong cách và ghi nhớ thủ công vào yêu cầu, lịch sử cũ không bị dán thời gian giả, vị trí đọc và thu hẹp màn hình hiển thị. Báo cáo: không gian làm việc `小绘-v0.6.2-聊天增强检查.json`.

Các tính năng gửi / dừng / thử lại hiện có, chế độ xem nhiệm vụ tóm tắt / đầy đủ và nút dừng gốc của cơ sở dữ liệu đã vượt qua kiểm tra hồi quy. Danh sách model và bản xem trước mặc định tiếp tục chuyển tiếp HTTP thật tới API mô phỏng cục bộ, kiểm tra việc truyền các tin nhắn và lịch sử khác nhau, không có phản hồi cố định khi xảy ra lỗi. Báo cáo: `小绘-v0.6.2-聊天检查.json`, `小绘-v0.6.2-模型列表与真实转发检查.json`.

Vòng kiểm tra này chưa gọi tới nhà cung cấp AI thật. Ghi nhớ thủ công và phong cách trò chuyện đã được xác nhận đi vào yêu cầu, nhưng chất lượng phản hồi thực tế, độ trễ và giới hạn của nhà cung cấp vẫn chờ quá trình dùng thử API thật; cập nhật cài đặt trong `D:\Jiuguan`, nhiệm vụ thật của cơ sở dữ liệu và bàn phím điện thoại thật chưa được xác minh. Kết quả thử nghiệm không thể thay thế việc nghiệm thu của người dùng.

Sáu bản SillyTavern cách ly chính thức 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0 vòng này đều tải v0.6.2, kiểm tra yêu cầu native của kết nối hiện tại / kết nối riêng, dừng độc lập, giữ nguyên cấu hình trò chuyện gốc và API toàn cục, cùng với việc lưu vào thiết lập native và khôi phục sau khi làm mới đối với bản nháp, phong cách, ghi nhớ thủ công, thời gian tin nhắn. Báo cáo: `小绘-v0.6.2-聊天-酒馆兼容检查.json`. Kết quả từ AI đã được thay bằng phản hồi thử nghiệm phía trình duyệt; đây là bằng chứng hoạt động thực tế trên host, không phải bằng chứng chất lượng AI thực tế.


## Kiểm tra lịch sử v0.7.0

Tính năng sinh hoạt (cuộc sống) sử dụng cơ chế lưu thiết lập tiện ích hiện có và năng lực về thời gian, DOM, hình ảnh, thanh tiến trình của trình duyệt, không thêm API nội bộ SillyTavern, phụ thuộc ngoại vi hoặc dịch vụ backend nào. Thời gian làm việc / ăn uống tính theo dấu thời gian (timestamp), trình duyệt chỉ hỏi vòng (polling) để làm mới giao diện; lương tan làm phải nhận thủ công, và hồ sơ sau khi ăn xong chỉ thanh toán một lần.

Việc kiểm tra model độc lập bao gồm thời gian / tiền lương của ba công việc, giá cả / thời lượng của bốn loại thức ăn, giới hạn một hoạt động diễn ra tại một thời điểm, báo không đủ tiền vàng, nhận / mua lại nhiều lần, tan làm sớm, khôi phục trạng thái làm việc và ăn uống khi ngoại tuyến, và giới hạn tối đa của sổ tay sinh hoạt. Báo cáo: không gian làm việc `小绘-v0.7.0-生活逻辑检查.json`.

Bài kiểm tra trình duyệt độc lập với kích thước 1280 / 375 / 320 xác nhận đường viền cửa sổ sinh hoạt, minh họa làm việc / ăn uống, đếm ngược thời gian thực, khôi phục khi lưu / làm mới / ngoại tuyến, xác nhận tan làm sớm, ưu tiên nhiệm vụ cơ sở dữ liệu và nút dừng gốc, giữ nguyên tọa độ của pet màn hình, dọn dẹp. Đối với màn hình máy tính còn trực tiếp chờ hết 8 giây ăn xong bánh pudding; công việc dài được kiểm tra bằng cách hiệu chỉnh thời gian (offset), không làm thay đổi thời lượng sản xuất. Báo cáo: `小绘-v0.7.0-生活界面检查.json`. Tính năng sinh hoạt không gửi bất kỳ yêu cầu API nào.

Tính năng nâng cao trò chuyện vốn có, tính năng dừng nhiệm vụ / sổ tay đã vượt qua kiểm tra hồi quy trên màn hình máy tính và điện thoại, báo cáo: `小绘-v0.7.0-聊天增强检查.json`, `小绘-v0.7.0-任务停止与小本子检查.json`. Quá trình tạo hình ảnh mỹ thuật sử dụng ImageGen tích hợp; độ trong suốt, kích thước và dung lượng của 4 bức ảnh WebP mới xem tại `小绘-v0.7.0-生活插图检查.json`.

Mục tiêu vẫn là 1.14.0–1.19.0. Các kiểm tra chạy thực tế về phần trò chuyện và điểm đầu vào trên 6 phiên bản trước đây được giữ làm bằng chứng lịch sử, không nên coi là tính năng sinh hoạt vòng này đã được kiểm tra lại toàn bộ trên cả 6 phiên bản. `D:\Jiuguan` của người dùng, nhiệm vụ cơ sở dữ liệu thực tế và điện thoại thật vẫn chờ xác nhận sau khi cập nhật.

Vòng này dùng 2 bản (instance) cách ly chính thức là 1.14.0 và 1.19.0, tiến hành tải thực tế v0.7.0, và kiểm tra việc lưu cấu hình native, khôi phục làm mới trạng thái công việc, nhận lương, trừ tiền mua cơm, ăn xong, giữ nguyên các cấu hình API chính văn / toàn cục / trò chuyện độc lập. Báo cáo: `小绘-v0.7.0-生活-酒馆兼容检查.json`. Việc hoàn thành công việc và ăn cơm dùng hiệu chỉnh thời gian thử nghiệm; không sửa thời lượng sản xuất hay gọi tới nhà cung cấp AI thật.


## v0.7.1 Phạm vi sửa đổi và kiểm tra lần này

Lần này chỉ gắn 4 loại ảnh ăn uống, ảnh thu nhỏ gọi món và đổi tên điểm đầu vào, không thêm API SillyTavern nào. Hoạt động tiếp tục được lưu theo kind/id/startedAt/uid gốc, hồ sơ món ăn của phiên bản cũ sẽ tự động lấy ảnh minh họa tương ứng từ cùng bảng danh mục, không cần phải đặt lại tiền vàng hay hoạt động.

Tiếp tục sử dụng bằng chứng kiểm tra host thực tế 1.14.0 / 1.19.0 và bằng chứng về điểm đầu vào / trò chuyện của 6 phiên bản trước đây từ v0.7.0; việc chuyển đổi ảnh và đổi tên ở vòng này được kiểm tra trên trình duyệt độc lập, không coi kết quả lịch sử là vòng này đã kiểm tra lại toàn bộ host. SillyTavern thật, cơ sở dữ liệu và điện thoại thật của người dùng vẫn chờ xác nhận sau khi cài đặt bản cập nhật.

Trình duyệt độc lập ở các kích thước 1280 / 375 / 320 đã kiểm tra việc mua từng phần cơm trong 4 loại, xác nhận ảnh menu, ảnh sổ tay và ảnh pet màn hình nổi tương ứng và tải bình thường; kiểm tra bữa cơm đang ăn dở từ phiên bản cũ vẫn giữ lại uid / tiền vàng / tổng chi phí tích lũy, khi kết thúc không trừ tiền lần nữa; sổ tay nhỏ và điểm đầu vào "Sổ tay sinh hoạt" trong thiết lập tiện ích đều mở thành công trên thực tế. Báo cáo: `小绘-v0.7.1-四种吃饭界面检查.json`.

Quy trình sinh hoạt ban đầu, bánh pudding 8 giây thực tế, khôi phục khi làm mới / ngoại tuyến, ưu tiên nhiệm vụ và dừng cơ sở dữ liệu gốc cũng vượt qua kiểm tra hồi quy trên 3 kích thước chiều rộng: `小绘-v0.7.1-生活界面检查.json`; quy tắc model xem tại `小绘-v0.7.1-生活逻辑检查.json`. Không phát ra yêu cầu API trò chuyện nào. Bốn hình ảnh trong suốt đã được xem qua, kích thước và dung lượng tài nguyên 768×768 xem tại `小绘-v0.7.1-四种吃饭插图检查.json`.


## v0.8.0 Phạm vi sửa đổi và kiểm tra lần này

Lần này không có thêm phụ thuộc API nội bộ nào của SillyTavern, vẫn sử dụng `SillyTavern.getContext()`, `extensionSettings`, `saveSettingsDebounced` và phương thức yêu cầu trò chuyện gốc. Về phía cơ sở dữ liệu, có thêm 3 chỗ đọc hoặc gọi, tất cả đều có phương án dự phòng (fallback):

- Mở cơ sở dữ liệu: Ưu tiên gọi các hàm public `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()`, nếu không có thì lùi về thao tác nhấp vào điểm đầu vào cơ sở dữ liệu trong menu tiện ích mở rộng.
- Nhảy đến bảng (panel) chỉ định: Gọi thao tác chuyển trang từ repository định tuyến giao diện cơ sở dữ liệu `acu-v2-router`, tương đương với việc nhấp vào thanh bên của nó, chỉ đổi trang; nếu không tìm thấy thì lùi về thao tác bấm nút thanh bên, nếu vẫn không được thì chỉ mở cơ sở dữ liệu và hiện thông báo.
- Ảnh của Nai Dan: Chỉ đọc bảng hình ảnh hiện đã tải của thành phần (component) pet màn hình cơ sở dữ liệu (`POSE_IMAGES` và ảnh ló đầu `peekSrc`), không sao chép, không phân phối; khi không đọc được thì không thể chuyển sang Nai Dan, nếu đang ở Nai Dan rồi thì cho pet màn hình gốc của cơ sở dữ liệu hiện ra.

Kiểm tra:

- Thử nghiệm đơn vị (Unit test) ở không gian làm việc gồm 32 hạng mục: Dữ liệu nhân vật và địa chỉ hình ảnh (địa chỉ của Tiểu Hội giống y hệt từng chữ với bản 0.7.1), chọn lọc lời thoại, quy tắc nuôi dưỡng (giới hạn hàng ngày, thăng cấp, suy giảm và đóng băng giá trị nhu cầu, ưu tiên tâm trạng, quy đổi cho người dùng cũ), lưu trữ sinh hoạt (đọc nguyên bản lưu của 0.7.1, nhiều nhân vật hoạt động cùng lúc, trợ cấp cơ bản, chỉ nhận lương một lần).
- Trang xem trước độc lập (mô phỏng ngữ cảnh SillyTavern và cấu trúc giao diện cơ sở dữ liệu, ở chiều rộng màn hình máy tính và 375): Chuyển đổi qua lại giữa 3 nhân vật, nhà của pet màn hình, sổ tay nhỏ, bong bóng lời thoại nhiệm vụ (nhận được / đang xử lý / thành công / lỗi / dừng), sổ tay sinh hoạt, trò chuyện (API mô phỏng cục bộ), thiết lập tiện ích, thông báo khi không có cơ sở dữ liệu.
- Host thực tế: Trên chính máy người dùng chạy SillyTavern 1.17.0 mở thêm một bản (instance) cách ly (thư mục dữ liệu riêng, cổng riêng, không đụng đến dữ liệu SillyTavern người dùng đang dùng), dùng global script của trợ lý SillyTavern tải cơ sở dữ liệu naiv1.2.3. Xác nhận tiện ích tải v0.8.0, nhận diện được cơ sở dữ liệu và nhận thông báo thực, đọc được 24 ảnh và ảnh ló đầu của Nai Dan, chuyển sang Nai Dan và ló đầu sát viền màn hình, sử dụng nút tắt mở bảng "Thúc đẩy cốt truyện" và bảng biểu trực quan, chat qua backend SillyTavern chuyển tiếp đến API mô phỏng cục bộ và trả lời theo nhân thiết Nai Dan, hiển thị ngăn kéo phía dưới của sổ tay nhỏ ở chiều rộng điện thoại.

Chưa xác minh: Nhiệm vụ điền bảng / thúc đẩy cốt truyện do AI điều khiển trong host thật (cần trả phí để gọi, lời thoại nhiệm vụ và nút dừng chỉ được mô phỏng kiểm tra theo cấu trúc dữ liệu của giao diện cơ sở dữ liệu gốc trong phần xem trước); 1.14.0, 1.15.0, 1.16.0, 1.18.0, 1.19.0 không được kiểm tra lại trong vòng này; nhánh chính 1.2.4 của kho cơ sở dữ liệu không được kiểm tra (vì đang dùng 1.2.3); phản hồi xúc giác và khả năng nảy bàn phím trên điện thoại thật.

## v0.9.0 Phạm vi sửa đổi và kiểm tra lần này

Lần này bổ sung hai tính năng sẽ đọc chính văn, một trong số đó sẽ ghi vào cơ sở dữ liệu. Phía SillyTavern bổ sung việc sử dụng `eventSource` / `eventTypes` của `getContext()` (chỉ lắng nghe `MESSAGE_SENT`, `MESSAGE_RECEIVED`, `MESSAGE_DELETED`, `CHAT_CHANGED` dùng để đếm số tầng), `chat` (đọc `mes` của vài tầng gần đây, bỏ qua các tầng ẩn của `is_system`) và `getCurrentChatId()`; mã nguồn chính thức 1.14.0–1.19.0 của `st-context.js` đều cung cấp các tên này (đã kiểm tra chéo mã nguồn của từng phiên bản), vòng này chỉ kiểm tra thực tế trên 1.17.0. Các yêu cầu trò chuyện vẫn đi theo cách cũ.

Phía cơ sở dữ liệu chỉ gọi các `AutoCardUpdaterAPI` public, tất cả đều phải kiểm tra xem phương thức có tồn tại hay không trước:

- Đọc: `exportTableAsJson`, `getPlotPresetNames`, `getCurrentPlotPreset`.
- Ghi (chỉ trong chế độ kiểm tra, sau khi người dùng tick chọn và nhấn "Áp dụng mục đã chọn"): `updateCell`, `updateRow`, `insertRow`, `deleteRow`, `switchPlotPreset`, `manualUpdate`. Tham số điền theo cách viết của naiv1.2.3: bảng dùng tên, dòng dùng "dòng thứ mấy" (1 là dòng dữ liệu đầu tiên), cột dùng tên trong tiêu đề bảng; trước khi thực thi sẽ định vị lại dựa trên `row_id`, và kiểm tra đối chiếu đảm bảo giá trị gốc không thay đổi.
- Hoàn tác: `importTableAsJson(bản_sao_lưu)`. Trong naiv1.2.3, hàm này mặc định lưu trữ vĩnh viễn (persist), sẽ ghi vào trò chuyện như một lần lưu mới (trong bản ghi thao tác của cơ sở dữ liệu, giá trị cũ vẫn còn, giao diện và những lần đọc sau đó sẽ dựa vào kết quả đã được khôi phục).
- Không sử dụng `importPlotPresetFromData`: Trong naiv1.2.3, hàm này sẽ tiện tay chuyển luôn cuộc trò chuyện hiện tại về chế độ thu hồi LLM, mà API public lại không có phương thức để xóa preset hoặc chuyển lại chế độ, do đó không thể hoàn tác.

Kiểm tra:

- Thử nghiệm đơn vị ở không gian làm việc gồm 56 hạng mục (thêm mới 24 hạng mục): Tổ chức lại và rút gọn dữ liệu bảng biểu, dọn dẹp các tầng chính văn, phân tích phiếu chỉnh sửa (khối mã block code, dấu phẩy thừa, bị cắt cụt, vượt quá 12 mục), đối chiếu từng mục (bảng / dòng / cột không tồn tại, giá trị không đổi, xung đột tại cùng một chỗ, xung đột giữa xóa dòng và sửa dòng, chỉ điền lại bảng một lần), thứ tự thực thi, định vị theo `row_id`, đối chiếu giá trị gốc trước khi ghi, từ chối khi bị khóa, từ chối khi đổi chat, xác nhận lại khi hoàn tác và "thay đổi sau đó", chuyển lại preset, trả mã số bản sao lưu trước khi ghi, dùng sao lưu trên bộ nhớ trong (RAM) khi không có IndexedDB; việc đếm tầng khi đứng xem trò chuyện (đổi trò chuyện, tầng ẩn, trượt, xóa tầng), thời điểm bình luận (4 giây, 60 giây, cơ sở dữ liệu bận 30 giây), tủi thân và hỏi thăm mỗi giờ một lần, nội dung prompt.
- Trang xem trước độc lập (mô phỏng các giao diện API public của cơ sở dữ liệu và sự kiện SillyTavern, với chiều rộng màn hình máy tính, 375 và 320): Chuyển đổi chế độ kiểm tra, thanh phạm vi tài liệu, tick phiếu chỉnh sửa (tiêu điểm focus không bị nhảy), chọn tất cả chỉ chọn các mục hợp lệ, không chọn gì cả, áp dụng, hoàn tác, yêu cầu xác nhận lại đối với những thay đổi bảng sau đó, khôi phục từ bản sao lưu trình duyệt sau khi làm mới trang, tải xuống tệp sao lưu; công tắc và tần suất đứng xem trò chuyện, bình luận sau khi có thêm hai tầng mới, bong bóng "Trả lời cô ấy", đánh dấu "Đứng xem" trong lịch sử trò chuyện, xóa đếm về không sau khi phản hồi, tâm trạng "tủi thân" và hỏi thăm khi bị lơ 3 tin nhắn liên tiếp.
- Host thực tế: Cùng một bản (instance) cách ly SillyTavern 1.17.0 + cơ sở dữ liệu naiv1.2.3, API chính văn chính và trò chuyện của pet màn hình đều trỏ đến API mô phỏng cục bộ (không phát sinh yêu cầu trả phí thực tế). Trong cuộc trò chuyện có chứa tầng người dùng và tầng nhân vật: Prompt kiểm tra đã mang theo các bảng biểu thật, preset thật và 3 tầng chính văn gần nhất; sau khi tick chọn 3 mục thì sẽ ghi qua API public (sửa ô, thêm dòng, chuyển preset), sau khi làm mới trang dữ liệu vẫn còn đó; sau khi hoàn tác thì bảng biểu và preset được khôi phục, sau khi làm mới thì vẫn là trạng thái đã khôi phục. Khi đứng xem trò chuyện, sau khi `/send` và `/sendas` có thêm 2 tầng mới, sẽ có bình luận trong khoảng 5 giây, bong bóng hiển thị "Trả lời nó".
- Hành vi tự thân của cơ sở dữ liệu quan sát được (không liên quan đến tiện ích này, đã tái hiện khi tiện ích này không thực hiện thao tác ghi): Chỉ trong các cuộc trò chuyện mới có lời chào mở đầu, khi cơ sở dữ liệu mở lại trò chuyện sẽ xóa các trường dữ liệu bảng trên tầng lời chào mở đầu rồi mới lưu lại, nội dung bảng biểu nằm lại trong runtime riêng của nó, và sẽ lưu trở lại trong lần ghi tiếp theo. Khuyến nghị thao tác kiểm tra nên dùng trong các cuộc trò chuyện đã có đối thoại.

没有验证：真实模型给出的修改单质量；`manualUpdate` 在真实宿主里的完整重新填表（需要付费调用，只在预览里模拟）；数据库不同存储模式（JSON / SQLite）下的写入，本轮没有区分测试；1.14.0、1.15.0、1.16.0、1.18.0、1.19.0 和数据库 1.2.4；实体手机。

## v0.9.1 本次修改与检查范围

本次只增加换装框架，没有新增酒馆或数据库接口依赖：仍用 `SillyTavern.getContext()`、`extensionSettings`、`saveSettingsDebounced`。皮肤的拥有和穿着状态写在本扩展设置的 `skins` 字段（`{ schema, owned, equipped, bought, spent }`，按角色分开）；买皮肤的钱走原来的生活钱包（`life.coins`），小账本记录用已有的 `spent` 类型，所以退回 v0.9.0 时 `skins` 字段被忽略、金币与账本照旧，不需要重置。图片地址仍用 `import.meta.url` 相对扩展根目录解析，皮肤图放在 `assets/skins/<皮肤 id>/`。

检查：

- Node 22 下对改动过的模块逐个做语法检查，另有 7 组纯逻辑检查：空目录时只有默认装扮；目录条目校验（id 格式、价格、角色范围、重复、写错跳过）；买（余额不足不扣、成功记账、重复购买拒绝、角色专属皮肤别人买不了、标“所有角色”的皮肤谁都能买）；换上 / 换回默认与“没有变化返回 false”；存档清洗（脏数据、下架皮肤保留、穿着下架皮肤时按默认显示）；皮肤只覆盖有图的姿势、主题部分覆盖；`LifeModel.spend` 余额不足不扣。
- 无头 Chromium（1280 和 375 两种宽度）加载真实 `index.js`、模拟酒馆上下文：扩展版本 0.9.1；生活手帐四个页签，换装页默认装扮卡片“使用中”且按钮禁用，空目录提示文案；注入两条测试皮肤后走完整流程——价格与“还差多少”提示、买下后钱包从 130 变 10、小账本出现“花 120 金币买了皮肤「夏日浴衣」”、设置里写入 `skins.owned`；换上后桌宠和生活手帐的 `data-skin`、浮动桌宠图、手帐插图都切到皮肤图，台词气泡出现，`skins.equipped` 写入；换回默认后图和属性恢复；切到零只看到默认装扮和标“所有角色”的那条；桌宠小屋的“给她换装”按钮打开该角色的换装页；销毁后没有残留节点。控制台只有无头环境软件 WebGL 的性能警告（来自小屋流光，与本次改动无关）。

没有验证：真实酒馆宿主（1.14.0–1.19.0 本轮都没有加载）、真实数据库、实体手机；目录里还没有真正的皮肤，所以带完整素材的皮肤（含探头、打工、吃饭姿势）的实际显示效果未实测。

## v0.9.2 修复与本次检查范围

目标仍为 SillyTavern 1.14.0–1.19.0。使用既有的聊天标识、CHAT_CHANGED 事件、设置与 AbortController，没有新增酒馆内部模块或依赖。

修复：检修请求固定资料快照，聊天切换使旧请求失效；备份等待后和逐条写入前复查归属/忙状态，撤销核对备份聊天；删行核对完整行和表头，切预设核对原预设；需求值关闭时正确结算；忙时禁止普通/强制撤销；旁观评论关闭或切聊天后丢弃晚响应。

本轮证据：

- Node 下 25 组纯逻辑检查：聊天切换、等待备份、批次中断、并发拒绝、来源替换、备份归属、正常应用/撤销、原值冲突、长行末尾变更、旧删行单拒绝、需求值冻结/开启/重启，以及生活钱包/活动、换装存档、故事换篇、模型列表与消息参数等既有行为。
- Edge 隔离测试页加载实际扩展模块，15 组场景：请求切聊天及切回、行重排与原值变化、忙时撤销/强制撤销、关陪聊后晚响应（包括忽略取消信号）、关后重开、切聊天、正常评论与普通聊天相互独立、设置开关的实际执行顺序；拖动、原地 7 秒坐标保持、原任务停止；1280/375/320 宽度下右键开关、触摸长按、浮窗边界、历史上下文、清理。页面错误为 0。
- 29 个 JavaScript 语法检查、扩展清单检查通过；53 张 WebP 可解码且含透明度，54 个本地姿势绑定存在。素材字节没有改动，没有逐张重新做人体/抠图审查。

未验证：真实 SillyTavern 1.14.0–1.19.0 本轮未重测，真实数据库公开接口内部等待与 JSON/SQLite 持久保存、真实 AI 修改单质量、付费填表、实体手机。前面的真实宿主记录均是对应旧版的历史证据。服务在公开方法调用之前及调用之间复查，无法中断或回滚已由数据库方法内部开始的操作；不声称整批修改是一个不可分割的事务。

旧版删行修改单缺原行字段时会拒绝应用并提示重新生成；已有生活/养成/换装/聊天存档继续读取。未推送 GitHub，未修改用户 D:\Jiuguan 安装，未由自动化代替用户验收。


## v0.9.3 皮肤与花票：本次检查范围

目标仍为 SillyTavern 1.14.0–1.19.0。本轮沿用 `extensionSettings`、`saveSettingsDebounced` 与既有图片解析、窗口和互动机制，没有新增宿主 API 或第三方依赖。

存档向前迁移：原金币、工作/吃饭、日记和服装拥有记录继续读取。`life.schema=3` 新增花票三字段，`skins.schema=2` 新增花票支出；旧存档新字段为 0。旧版不认识花票，退回旧版再保存可能丢掉这些新字段和新日志，应先备份。

本轮证据：

- 9 组换装模型检查：价格/兑换率、初始未拥有、旧存档迁移、余额不足/非法数量/溢出保护、重复购买、穿着和恢复、原金币皮肤、工作/食物兼容、27 动作映射。
- Edge 加载正式模块，10 组换装场景：实际点击兑换/购买/穿着、填入不扣款、部分兑换、剩余花票、刷新保存、角色隔离、27 图逐一解码、工作工资和四餐配图、1280/375/320 无横向溢出、清理、穿新衣拖动和数据库原停止。页面错误和缺图均为 0。
- 既有 25 组模型与 15 组浏览器回归在本轮源码复测，覆盖 v0.9.2 六项修复、手机长按、电脑右键、7 秒原地坐标保持、任务停止和窗口清理。模拟 API 与模拟数据库，不代表真实接口调用。
- JavaScript 语法、扩展清单、皮肤媒体清单/哈希、27 新 WebP 的尺寸与透明度、旧 53 张 WebP 字节保留及压缩包与源文件匹配检查。新图片 960×960，合计 6766248 字节；常用 8 动作预加载，其余按需。

未验证：本轮没有在真实 SillyTavern 1.14.0–1.19.0 逐版加载，也没有更新用户 D:\Jiuguan、连接真实数据库或 API、测试实体手机、跨设备并发钱包或私密模式持久存储。前述宿主测试保留为对应版本的历史证据。当前预览的钱包是独立的测试数据，正式扩展不会赠送测试余额。GitHub 未推送，安装与用户验收尚未完成。
