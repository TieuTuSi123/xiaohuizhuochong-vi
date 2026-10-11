# Hướng dẫn tương thích phiên bản SillyTavern

Phiên bản tiện ích mở rộng hiện tại: **v0.9.3**

Tệp này giải thích phạm vi tương thích host của v0.9.3. Nó không có nghĩa là các gói thử nghiệm ban đầu v0.1.x vẫn còn tương thích, cũng không đồng nghĩa với việc sau này giao diện cơ sở dữ liệu thay đổi sẽ không cần điều chỉnh thích ứng.

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

Nếu plugin cơ sở dữ liệu thay đổi cấu trúc giao diện của `DeskPetLayer`, `DeskPet` hoặc `NoticeBubble` trong tương lai, Tiểu Erii sẽ báo rằng giao diện cơ sở dữ liệu hiện tại không tương thích, đồng thời giữ lại pet màn hình gốc của cơ sở dữ liệu.

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
- Ảnh của Naidan: Chỉ đọc bảng hình ảnh hiện đã tải của thành phần (component) pet màn hình cơ sở dữ liệu (`POSE_IMAGES` và ảnh ló đầu `peekSrc`), không sao chép, không phân phối; khi không đọc được thì không thể chuyển sang Naidan, nếu đang ở Naidan rồi thì cho pet màn hình gốc của cơ sở dữ liệu hiện ra.

Kiểm tra:

- Thử nghiệm đơn vị (Unit test) ở không gian làm việc gồm 32 hạng mục: Dữ liệu nhân vật và địa chỉ hình ảnh (địa chỉ của Tiểu Erii giống y hệt từng chữ với bản 0.7.1), chọn lọc lời thoại, quy tắc nuôi dưỡng (giới hạn hàng ngày, thăng cấp, suy giảm và đóng băng giá trị nhu cầu, ưu tiên tâm trạng, quy đổi cho người dùng cũ), lưu trữ sinh hoạt (đọc nguyên bản lưu của 0.7.1, nhiều nhân vật hoạt động cùng lúc, trợ cấp cơ bản, chỉ nhận lương một lần).
- Trang xem trước độc lập (mô phỏng ngữ cảnh SillyTavern và cấu trúc giao diện cơ sở dữ liệu, ở chiều rộng màn hình máy tính và 375): Chuyển đổi qua lại giữa 3 nhân vật, nhà của pet màn hình, sổ tay nhỏ, bong bóng lời thoại nhiệm vụ (nhận được / đang xử lý / thành công / lỗi / dừng), sổ tay sinh hoạt, trò chuyện (API mô phỏng cục bộ), thiết lập tiện ích, thông báo khi không có cơ sở dữ liệu.
- Host thực tế: Trên chính máy người dùng chạy SillyTavern 1.17.0 mở thêm một bản (instance) cách ly (thư mục dữ liệu riêng, cổng riêng, không đụng đến dữ liệu SillyTavern người dùng đang dùng), dùng global script của trợ lý SillyTavern tải cơ sở dữ liệu naiv1.2.3. Xác nhận tiện ích tải v0.8.0, nhận diện được cơ sở dữ liệu và nhận thông báo thực, đọc được 24 ảnh và ảnh ló đầu của Naidan, chuyển sang Naidan và ló đầu sát viền màn hình, sử dụng nút tắt mở bảng "Thúc đẩy cốt truyện" và bảng biểu trực quan, chat qua backend SillyTavern chuyển tiếp đến API mô phỏng cục bộ và trả lời theo nhân thiết Naidan, hiển thị ngăn kéo phía dưới của sổ tay nhỏ ở chiều rộng điện thoại.

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

Chưa xác minh: Chất lượng phiếu chỉnh sửa do mô hình thực tế đưa ra; việc `manualUpdate` điền lại toàn bộ bảng trong host thực tế (cần gọi có phí, chỉ được mô phỏng trong bản xem trước); việc ghi dữ liệu dưới các chế độ lưu trữ khác nhau của cơ sở dữ liệu (JSON / SQLite) chưa được kiểm thử phân tách trong vòng này; các phiên bản 1.14.0, 1.15.0, 1.16.0, 1.18.0, 1.19.0 và cơ sở dữ liệu 1.2.4; điện thoại thật.

## v0.9.1 Phạm vi sửa đổi và kiểm tra lần này

Lần này chỉ bổ sung khung thay trang phục (skin), không thêm phụ thuộc mới vào API của SillyTavern hay cơ sở dữ liệu: vẫn sử dụng `SillyTavern.getContext()`, `extensionSettings`, `saveSettingsDebounced`. Trạng thái sở hữu và đang mặc của skin được ghi vào trường `skins` trong cài đặt của tiện ích này (`{ schema, owned, equipped, bought, spent }`, tách riêng theo từng nhân vật); tiền mua skin đi qua ví sinh hoạt ban đầu (`life.coins`), bản ghi sổ tay nhỏ sử dụng loại `spent` sẵn có, do đó khi hạ cấp về v0.9.0 thì trường `skins` sẽ bị bỏ qua, tiền vàng và sổ tay vẫn giữ nguyên như cũ mà không cần phải đặt lại. Đường dẫn hình ảnh vẫn dùng `import.meta.url` để phân giải tương đối từ thư mục gốc của tiện ích, ảnh skin được đặt trong `assets/skins/<id skin>/`.

Kiểm tra:

- Kiểm tra cú pháp từng module đã chỉnh sửa trên Node 22, cùng với 7 nhóm kiểm tra thuần logic: Khi thư mục trống chỉ hiển thị trang phục mặc định; xác thực các mục trong danh mục (định dạng id, giá cả, phạm vi nhân vật, trùng lặp, bỏ qua mục bị lỗi chính tả); mua (số dư không đủ thì không trừ, ghi sổ thành công, từ chối mua trùng lặp, skin độc quyền thì người khác không mua được, skin đánh dấu "Tất cả nhân vật" thì ai cũng mua được); mặc vào / đổi về mặc định cùng với điều kiện "trả về false khi không có thay đổi"; làm sạch dữ liệu lưu (dữ liệu rác, giữ lại skin đã gỡ khỏi kệ, hiển thị theo mặc định khi đang mặc skin đã gỡ); skin chỉ ghi đè lên các tư thế có ảnh, ghi đè một phần chủ đề giao diện; `LifeModel.spend` không trừ tiền khi số dư không đủ.
- Trình duyệt Chromium không đầu (headless) ở cả hai độ rộng 1280 và 375 tải tệp `index.js` thực tế, mô phỏng ngữ cảnh SillyTavern: Tiện ích mở rộng phiên bản 0.9.1; sổ tay sinh hoạt có 4 tab, thẻ trang phục mặc định ở tab thay đồ hiển thị "Đang sử dụng" và nút bị vô hiệu hóa, hiển thị văn bản nhắc nhở khi danh mục trống; chèn 2 skin thử nghiệm rồi chạy toàn bộ quy trình — hiển thị giá và lời nhắc "Còn thiếu bao nhiêu", sau khi mua ví đổi từ 130 thành 10, sổ tay nhỏ xuất hiện dòng "Đã tiêu 120 tiền vàng mua skin「Yukata Mùa Hè」", ghi `skins.owned` vào cài đặt; sau khi mặc vào, thuộc tính `data-skin` của pet màn hình và sổ tay sinh hoạt, ảnh pet màn hình trôi nổi, ảnh minh họa sổ tay đều chuyển sang ảnh của skin, bong bóng lời thoại xuất hiện, ghi `skins.equipped`; sau khi đổi về mặc định thì ảnh và các thuộc tính được khôi phục; chuyển sang Zero chỉ nhìn thấy trang phục mặc định và trang phục đánh dấu "Tất cả nhân vật"; nút "Thay đồ cho cô ấy" trong phòng nhỏ của pet màn hình mở đúng trang thay đồ của nhân vật đó; không còn node DOM rác sau khi hủy (destroy). Bảng điều khiển console chỉ ghi nhận cảnh báo hiệu năng WebGL phần mềm của môi trường không đầu (từ hiệu ứng luồng sáng của phòng nhỏ, không liên quan đến thay đổi lần này).

Chưa xác minh: Host SillyTavern thực tế (vòng này không tải trên bất kỳ bản nào từ 1.14.0–1.19.0), cơ sở dữ liệu thực tế, điện thoại thật; trong danh mục chưa có skin thực sự hoàn chỉnh nên hiệu ứng hiển thị thực tế của skin có đủ asset (gồm tư thế ló đầu, làm việc, ăn uống) chưa được kiểm thử thực tế.

## v0.9.2 Bản vá lỗi và phạm vi kiểm tra lần này

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Tiếp tục sử dụng định danh cuộc trò chuyện hiện có, sự kiện CHAT_CHANGED, hệ thống cài đặt và AbortController, không thêm module nội bộ hay phụ thuộc mới của SillyTavern.

Khắc phục: Yêu cầu kiểm tu cố định ảnh chụp nhanh dữ liệu (snapshot), chuyển đổi cuộc trò chuyện sẽ vô hiệu hóa yêu cầu cũ; kiểm tra lại quyền sở hữu / trạng thái bận sau khi chờ sao lưu và trước khi ghi từng mục, hoàn tác đối chiếu đúng cuộc trò chuyện đã sao lưu; xóa dòng đối chiếu toàn bộ dòng và tiêu đề bảng, đổi preset đối chiếu preset gốc; quyết toán chính xác khi các giá trị nhu cầu bị tắt; cấm hoàn tác thông thường / cưỡng chế khi đang bận; loại bỏ phản hồi trễ của bình luận quan sát sau khi đóng hoặc chuyển đổi cuộc trò chuyện.

Bằng chứng vòng này:

- 25 nhóm kiểm tra thuần logic trên Node: Chuyển đổi cuộc trò chuyện, chờ sao lưu, ngắt quãng hàng loạt, từ chối khi đồng thời xử lý, thay thế nguồn, quyền sở hữu bản sao lưu, áp dụng / hoàn tác bình thường, xung đột giá trị gốc, thay đổi ở cuối dòng dài, từ chối phiếu xóa dòng cũ, đóng băng / kích hoạt / khởi động lại giá trị nhu cầu, cũng như các hành vi sẵn có như ví / hoạt động sinh hoạt, dữ liệu lưu thay trang phục, đổi câu chuyện, danh sách model và tham số tin nhắn.
- Trang thử nghiệm cách ly trên Edge tải các module tiện ích mở rộng thực tế, kiểm tra 15 kịch bản: Yêu cầu chuyển đổi cuộc trò chuyện và chuyển ngược lại, sắp xếp lại dòng và biến động giá trị gốc, hoàn tác / hoàn tác cưỡng chế khi bận, phản hồi trễ sau khi tắt tính năng bầu bạn (bao gồm cả việc bỏ qua tín hiệu hủy bỏ), mở lại sau khi đóng, chuyển cuộc trò chuyện, bình luận bình thường và trò chuyện thông thường độc lập với nhau, thứ tự thực thi thực tế của các công tắc cài đặt; kéo thả, giữ nguyên tọa độ 7 giây tại chỗ, dừng nhiệm vụ gốc; bật tắt chuột phải, nhấn giữ cảm ứng, biên giới cửa sổ nổi, ngữ cảnh lịch sử, dọn dẹp ở các độ rộng 1280 / 375 / 320. Số lỗi trang bằng 0.
- Vượt qua 29 bài kiểm tra cú pháp JavaScript và kiểm tra tệp kê khai tiện ích mở rộng; 53 ảnh WebP giải mã được và giữ nguyên độ trong suốt, 54 liên kết tư thế cục bộ tồn tại bình thường. Dung lượng byte của asset không bị thay đổi, không rà soát lại giải phẫu nhân vật hay tách nền cho từng bức ảnh.

Chưa xác minh: Chưa kiểm tra lại trên SillyTavern 1.14.0–1.19.0 thực tế trong vòng này, cơ chế chờ bên trong các giao diện công khai của cơ sở dữ liệu thực tế và việc lưu trữ vĩnh viễn trên JSON / SQLite, chất lượng phiếu chỉnh sửa của AI thực tế, tác vụ điền bảng trả phí, điện thoại thật. Các bản ghi host thực tế trước đây đều là bằng chứng lịch sử tương ứng của các phiên bản cũ. Dịch vụ thực hiện kiểm tra lại trước và giữa các lần gọi phương thức public, không thể ngắt quãng hoặc khôi phục lại các thao tác đã được khởi chạy bên trong phương thức cơ sở dữ liệu; không tuyên bố toàn bộ đợt sửa đổi là một transaction không thể phân tách.

Phiếu sửa đổi xóa dòng của phiên bản cũ khi thiếu các trường của dòng gốc sẽ từ chối áp dụng và nhắc tạo lại; dữ liệu đã lưu về sinh hoạt / nuôi dưỡng / trang phục / trò chuyện tiếp tục được đọc bình thường. Chưa đẩy lên GitHub, chưa chỉnh sửa bản cài đặt `D:\Jiuguan` của người dùng, không để quá trình tự động hóa thay thế việc nghiệm thu của người dùng.

## v0.9.3 Trang phục và vé hoa: Phạm vi kiểm tra lần này

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Vòng này tiếp tục kế thừa `extensionSettings`, `saveSettingsDebounced` cùng cơ chế phân giải hình ảnh, cửa sổ và tương tác sẵn có, không bổ sung thêm API của host hay phụ thuộc từ bên thứ ba.

Di chuyển dữ liệu lưu về trước: Các bản ghi tiền vàng gốc, công việc / ăn uống, nhật ký và quyền sở hữu trang phục tiếp tục được đọc bình thường. `life.schema=3` bổ sung 3 trường vé hoa, `skins.schema=2` bổ sung chi tiêu vé hoa; các trường mới trong dữ liệu lưu cũ mặc định mang giá trị 0. Phiên bản cũ không nhận diện vé hoa, nếu quay về phiên bản cũ rồi lưu lại có thể làm mất các trường mới và nhật ký mới này, cần sao lưu trước khi thực hiện.

Bằng chứng vòng này:

- 9 nhóm kiểm tra mô hình thay trang phục: Giá cả / tỷ lệ quy đổi, trạng thái ban đầu chưa sở hữu, di chuyển dữ liệu lưu cũ, bảo vệ khi không đủ số dư / số lượng không hợp lệ / tràn số, mua trùng lặp, mặc vào và khôi phục, trang phục tiền vàng gốc, tương thích công việc / thức ăn, ánh xạ 27 động tác.
- Edge tải các module chính thức, kiểm tra 10 nhóm kịch bản thay trang phục: Nhấp chuột thực tế để quy đổi / mua / mặc, điền số không trừ tiền, quy đổi từng phần, số vé hoa còn lại, làm mới để lưu, cách ly giữa các nhân vật, giải mã lần lượt 27 hình ảnh, ảnh minh họa tiền lương làm việc và 4 bữa ăn, không tràn màn hình theo chiều ngang ở độ rộng 1280 / 375 / 320, dọn dẹp tài nguyên, kéo thả khi mặc trang phục mới và dừng cơ sở dữ liệu gốc. Lỗi trang và thiếu ảnh đều bằng 0.
- 25 nhóm kiểm tra mô hình và 15 nhóm kiểm tra hồi quy trình duyệt hiện có được kiểm tra lại trên mã nguồn vòng này, bao phủ 6 hạng mục sửa đổi của v0.9.2, nhấn giữ trên điện thoại, nhấp chuột phải trên máy tính, giữ nguyên tọa độ 7 giây tại chỗ, dừng nhiệm vụ và dọn dẹp cửa sổ. API mô phỏng và cơ sở dữ liệu mô phỏng, không đại diện cho các lệnh gọi giao diện thực tế.
- Kiểm tra cú pháp JavaScript, tệp kê khai tiện ích mở rộng, danh mục tệp đa phương tiện của trang phục / mã băm, kích thước và độ trong suốt của 27 ảnh WebP mới, bảo toàn nguyên vẹn dung lượng byte của 53 ảnh WebP cũ và kiểm tra độ khớp giữa tệp nén với tệp nguồn. Ảnh mới có kích thước 960×960, tổng dung lượng 6.766.248 byte; 8 động tác thường dùng được tải trước (preload), các ảnh còn lại tải theo nhu cầu (on-demand).

Chưa xác minh: Vòng này chưa tải từng bản trên SillyTavern 1.14.0–1.19.0 thực tế, cũng chưa cập nhật thư mục `D:\Jiuguan` của người dùng, chưa kết nối cơ sở dữ liệu hoặc API thật, chưa kiểm tra điện thoại thật, ví tiền xử lý đồng thời trên nhiều thiết bị hay lưu trữ bền vững ở chế độ ẩn danh. Các thử nghiệm host nêu trên được giữ lại làm bằng chứng lịch sử cho phiên bản tương ứng. Ví tiền trong bản xem trước hiện tại là dữ liệu thử nghiệm độc lập, tiện ích mở rộng chính thức sẽ không tặng số dư thử nghiệm. Chưa đẩy lên GitHub, quá trình cài đặt và nghiệm thu của người dùng vẫn chưa hoàn thành.