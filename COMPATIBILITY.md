# Hướng dẫn tương thích phiên bản SillyTavern

Phiên bản tiện ích mở rộng hiện tại: **v1.0.1**

Cập nhật lần này: **16-10-2026**. Manifest và file khởi chạy (entry point) là 1.0.1; các bản ghi tự kiểm tra cùng phiên bản 1.0.0 trước đó được giữ lại làm lịch sử.

Tài liệu này giải thích phạm vi tương thích với môi trường host của v1.0.1. Điều này không đồng nghĩa các gói thử nghiệm v0.1.x trước đây vẫn còn tương thích, cũng không đảm bảo không cần điều chỉnh nếu giao diện cơ sở dữ liệu (CSDL) thay đổi trong tương lai.

Tiện ích mở rộng này đặt mục tiêu tương thích với SillyTavern **1.14.0–1.19.0**.

- **1.14.0–1.16.0**: Tải ES module nhưng không gọi hàm `activate`, file khởi chạy sẽ tự động đợi `SillyTavern.getContext()` và API cài đặt.
- **1.17.0–1.19.0**: Sẽ gọi `activate`, `enable`, `disable`. Điểm khởi chạy có cơ chế bảo vệ đơn thực thể (singleton), các callback lặp lại sẽ không tạo ra pet thứ hai.
- Vòng đời và cài đặt của pet sử dụng `SillyTavern.getContext()`, `extensionSettings` và `saveSettingsDebounced`. Tính năng trò chuyện ở v0.6.0 sẽ import bộ tạo tham số `openai.js` gốc tương ứng với từng phiên bản khi người dùng gửi yêu cầu; tính năng hoàn thành văn bản (text completion) sử dụng thêm `script.js` và `textgen-settings.js`, tất cả đều kiểm tra trước API khả dụng.
- Khi trình duyệt dùng bộ nhớ đệm quay lại (bfcache) vẫn giữ nguyên pet; việc rời trang bình thường, tắt hoặc dọn dẹp tiện ích sẽ gỡ bỏ pet, observer, timer và bảng cài đặt.
- Trước khi hình ảnh được giải mã thành công, pet CSDL gốc sẽ không bị ẩn đi. Khi tải hình ảnh thất bại, pet gốc vẫn được giữ lại và cho phép các thao tác tiếp theo thử tải lại.

## Đối soát phiên bản chính thức

Đã đối soát trình tải tiện ích mở rộng, API ngữ cảnh, vùng chứa cài đặt và thông tin phiên bản trên các Git tag chính thức: 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0. Các commit cố định và mã hash file được lưu tại `work/erii-host-contracts/sources.json` trong workspace, không đưa vào gói phát hành.

## Lịch sử kiểm tra môi trường host v0.5.8

Dưới đây là phạm vi kiểm thử thực tế của các phiên bản lịch sử. Kết quả kiểm tra của phiên bản mới nhất xem ở cuối tài liệu.

- **1.14.0 và 1.19.0**: Dùng Docker image chính thức để tải tiện ích này; các chức năng pet, bảng cài đặt, lưu vị trí kéo thả, khôi phục khi làm mới, nhấp chuột, chuột phải, sổ tay, kích thước điện thoại và nhiệm vụ CSDL mô phỏng đều vượt qua.
- **1.15.0–1.18.0**: Khởi động bằng image chính thức và xác nhận tiện ích, bảng cài đặt và phiên bản 0.5.8 xuất hiện, tính tương thích của điểm khởi chạy đã đạt; quy trình tắt hoàn toàn, bật lại và hồi quy tương tác được thực hiện đại diện trên 1.14.0 / 1.19.0.

Đây là các thực thể SillyTavern độc lập và sạch, không phải thực thể tại `D:\Jiuguan` của bạn; các nhiệm vụ CSDL sử dụng cấu trúc dữ liệu Vue gốc mô phỏng ở chế độ chỉ đọc. Việc cài đặt cập nhật thực tế, nhiệm vụ CSDL thực tế và phần cứng điện thoại thật vẫn cần được xác nhận trong môi trường của bạn.

Nếu plugin CSDL trong tương lai thay đổi cấu trúc giao diện của `DeskPetLayer`, `DeskPet` hoặc `NoticeBubble`, Erii sẽ thông báo giao diện CSDL hiện tại không tương thích và giữ lại pet CSDL gốc.

## Lịch sử kiểm tra v0.5.11

Các tính năng mới sử dụng API sẵn có của trình duyệt, không thêm phụ thuộc vào module nội bộ nào của SillyTavern. Thao tác thò đầu ra mép màn hình, mẩu chuyện, khoảng cách nút X, dừng nhiệm vụ mô phỏng và độ rộng màn hình máy tính / điện thoại đã được kiểm tra trên trang độc lập; các bản ghi kiểm thử thực tế trên các phiên bản chính thức trước đó được giữ làm bằng chứng lịch sử. Hoạt động cuối cùng của v0.5.11 trên SillyTavern thực tế, CSDL thật và phần cứng điện thoại của bạn vẫn cần được kiểm chứng.

## Lịch sử kiểm tra v0.5.12

Lần này chỉ tinh chỉnh thời điểm kích hoạt hiển thị ở cạnh mép và hiệu ứng chuyển cảnh cục bộ, không thêm phụ thuộc API SillyTavern mới. Đã kiểm tra việc thò đầu ngay khi chạm biên, duy trì khi rê chuột, kéo thả và ưu tiên nhiệm vụ ở cả độ rộng máy tính và điện thoại. Cần cập nhật để xác nhận lại trên SillyTavern và điện thoại thật.

## Lịch sử kiểm tra v0.5.13

Lần này sửa lỗi đồng bộ giữa nhiệm vụ hiện tại và thao tác dừng, thông báo lỗi khi dừng thất bại và sổ tay độc lập sau khi ẩn pet. Không thêm phụ thuộc API nội bộ SillyTavern mới; vẫn đọc nhiệm vụ do giao diện CSDL gốc cung cấp và gọi thao tác dừng gốc khi người dùng nhấn. Các nhiệm vụ quan sát được gần đây chỉ dùng để ghi vào sổ tay, không làm mục tiêu để dừng.

Các kịch bản lỗi nhiệm vụ mô phỏng trên kích thước máy tính và điện thoại, chuyển đổi nhiệm vụ, cập nhật thao tác dừng, ngắt kết nối nguồn, mở sổ tay sau khi ẩn và kiểm thử hồi quy tương tác đều được kiểm tra ở trang xem trước độc lập. Các kiểm tra trên phiên bản SillyTavern chính thức trước đây được giữ làm bằng chứng lịch sử, không đại diện cho việc v0.5.13 đã được kiểm thử lại trên toàn bộ phiên bản. Vẫn cần xác nhận trên `D:\Jiuguan`, CSDL thật và điện thoại thật sau khi cập nhật.

## Lịch sử kiểm tra v0.5.14

Lần này chỉ chỉnh sửa hành vi của bong bóng mẩu chuyện cục bộ khi hết giờ: đổi từ thu gọn sang tự động chuyển câu chuyện mỗi 30 giây, đồng thời giữ lại tính năng đổi câu chuyện thủ công, tạm dừng đọc, đóng và ưu tiên nhiệm vụ CSDL. Không thêm API hay phụ thuộc SillyTavern mới.

Đã kiểm tra quy tắc mẩu chuyện và việc chuyển câu chuyện liên tục trên độ rộng máy tính / điện thoại, tạm dừng khi rê chuột / focus / chạm, đóng, công tắc tự động kể chuyện và dừng nhiệm vụ trong trang xem trước độc lập; đồng thời dùng bộ đếm thời gian thực của trình duyệt để kiểm tra chuyển chuyện sau 30 giây một lần. Các bài kiểm tra phiên bản SillyTavern lịch sử không đồng nghĩa v0.5.14 đã được kiểm thử thực tế trên `D:\Jiuguan` hay điện thoại thật, kết quả cuối cùng vẫn chờ xác nhận sau cập nhật.

## Lịch sử kiểm tra v0.6.0

Thêm tính năng trò chuyện độc lập và công tắc chi tiết nhiệm vụ. Đối soát `openai.js` chính thức từ 1.14.0–1.19.0: 1.14.0 dùng `sendOpenAIRequest('quiet', messages, signal)`; 1.15.0–1.19.0 dùng bản sao cài đặt của `createGenerationParameters`, sau đó gửi yêu cầu đến backend trò chuyện gốc. Cấu hình riêng sử dụng `custom_url` / `custom_include_headers` của các phiên bản này; khóa API rỗng cũng ghi đè rõ ràng khóa CUSTOM của host để tránh dùng nhầm khóa của kết nối khác.

Mỗi yêu cầu có AbortController độc lập, không gửi sự kiện tạo hay dừng toàn cục. Yêu cầu sử dụng tin nhắn tự sắp xếp, không thực thi việc ghép chuyện theo preset hiện tại, không tạo tầng bài viết trong nội dung chính của SillyTavern. Bản 1.14.0 khi gọi hàm quiet gốc sẽ đi qua sự kiện `CHAT_COMPLETION_SETTINGS_READY` sẵn có; text completion sử dụng sự kiện `TEXT_COMPLETION_SETTINGS_READY` gốc. Nếu cài các tiện ích mở rộng khác có can thiệp sửa đổi tham số yêu cầu thì vẫn cần kiểm tra trên máy thực tế.

Kiểm tra trình duyệt độc lập bao phủ các độ rộng 1280 / 375 / 320, thu nhỏ màn hình hiển thị, lưu lịch sử, dừng / thử lại, công tắc lưu khóa bí mật, lỗi API, an toàn văn bản và dọn dẹp; chuyển đổi tóm tắt / chi tiết nhiệm vụ, chi tiết vượt quá 600 từ, nút dừng nhiệm vụ gốc và cử chỉ / thò đầu sẵn có đều đã được hồi quy.

Các thực thể SillyTavern cô lập chính thức 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0 đều vượt qua bài kiểm tra trò chuyện lần này: module gốc thực tế tạo yêu cầu, chuyển đổi kết nối hiện tại / kết nối riêng, dừng độc lập, lưu cài đặt tiện ích và khôi phục khi làm mới; cài đặt kết nối toàn cục của SillyTavern được giữ đồng nhất với nội dung trò chuyện chính. Ngoài ra, trên 6 backend SillyTavern thực tế này, đã sử dụng API mô phỏng cục bộ để kiểm tra địa chỉ API riêng, mô hình, tin nhắn và việc chuyển tiếp có khóa / không khóa. Không kết nối với nhà cung cấp AI thực tế. Hoàn thành văn bản (text completion) lần này đã đối soát API và kiểm tra logic độc lập, chưa gửi yêu cầu thực tế tới từng thực thể trong 6 phiên bản này.

Báo cáo trong workspace: `小绘-v0.6.0-聊天-酒馆兼容检查.json`, `小绘-v0.6.0-本地接口转发检查.json`, `小绘-v0.6.0-聊天检查.json`. Các báo cáo và script kiểm thử này không đưa vào gói cài đặt.

Yêu cầu đến nhà cung cấp AI thực tế được chặn thành phản hồi mô phỏng trong kiểm thử, không gửi yêu cầu trả phí. API thực của người dùng, nhiệm vụ thực tế của CSDL v1.2, cài đặt cập nhật trên `D:\Jiuguan` và bàn phím điện thoại thật vẫn chờ người dùng xác nhận. Chưa cài đặt hoặc đẩy lên kho lưu trữ của người dùng.

## Lịch sử kiểm tra v0.6.1

Danh sách mô hình sử dụng `POST /api/backends/chat-completions/status`, truyền vào `chat_completion_source: custom`, `custom_url` và `custom_include_headers`. Backend gửi yêu cầu `/models` tới địa chỉ cơ sở đã điền. Giữ lại tên mô hình nhập thủ công, thất bại không làm thay đổi kết nối toàn cục, khóa rỗng ghi đè rõ ràng khóa CUSTOM của host.

Đã kiểm tra chọn danh sách, quay về nhập thủ công, che khóa bí mật, hủy, thay đổi địa chỉ, đóng / dọn dẹp, lưu lựa chọn và bố cục trên độ rộng 1280 / 375 / 320. Trang xem trước mặc định của phiên bản mới chuyển tiếp qua HTTP thật tới API kiểm thử cục bộ, kiểm tra hai tin nhắn khác nhau nhận được kết quả tương ứng khác nhau từ upstream, mang theo lịch sử gần nhất, khi chưa cấu hình hoặc bị lỗi không có phản hồi cố định hay báo thành công giả. Quá trình kiểm thử không gọi nhà cung cấp AI thực tế.

Cổng lấy danh sách mô hình trên các thực thể SillyTavern cô lập 1.14.0–1.19.0, chuyển tiếp backend thực, có khóa / không khóa và duy trì cài đặt toàn cục của SillyTavern đều đạt kết quả, xem tại `小绘-v0.6.1-模型列表-酒馆兼容检查.json`. Gửi trò chuyện / dừng / thử lại và hiển thị nhiệm vụ đã hồi quy trên trang độc lập.

Dịch vụ xem trước chỉ dùng cho phát triển nội bộ, không đưa vào gói cài đặt; tiện ích chính thức vẫn dùng backend sẵn có của SillyTavern. Quyền hạn tài khoản thực, tính khả dụng thực tế của mô hình, chất lượng phản hồi và hành vi trên điện thoại thật vẫn chờ người dùng trải nghiệm.

## Lịch sử kiểm tra v0.6.2

Lần này không thêm API nội bộ SillyTavern mới. Cài đặt trò chuyện bổ sung phong cách, ghi nhớ thủ công, bản nháp và thời gian của các tin nhắn hiện có, tiếp tục lưu bằng cài đặt tiện ích tài khoản gốc; khóa bí mật tiếp tục lưu trong bộ nhớ riêng của thiết bị. Sao chép và xuất file TXT sử dụng khả năng sẵn có của trình duyệt, không thêm dịch vụ từ xa mới.

Độ rộng 1280 / 375 / 320 kiểm tra sao chép, xuất file thật, trả lời lại và sửa rồi gửi lại thành công / hủy / thất bại, khôi phục bản nháp và chỉnh sửa, truyền phong cách và ghi nhớ thủ công vào yêu cầu, bản ghi cũ không có thời gian giả, vị trí đọc và thu nhỏ màn hình hiển thị. Báo cáo: `小绘-v0.6.2-聊天增强检查.json`.

Các tính năng gửi / dừng / thử lại hiện có, hiển thị tóm tắt / đầy đủ nhiệm vụ và nút dừng CSDL gốc đã được hồi quy. Danh sách mô hình và chuyển tiếp HTTP thật của trang xem trước mặc định tiếp tục kết nối tới API kiểm thử cục bộ, kiểm tra tin nhắn khác nhau cùng lịch sử truyền đi, khi có lỗi không có phản hồi cố định. Báo cáo: `小绘-v0.6.2-聊天检查.json`, `小绘-v0.6.2-模型列表与真实转发检查.json`.

Đợt này không gọi nhà cung cấp AI thực tế. Ghi nhớ thủ công và phong cách trò chuyện đã được xác minh đi vào yêu cầu, chất lượng phản hồi thực tế, độ trễ và giới hạn nhà cung cấp vẫn cần thử nghiệm với API thật; chưa kiểm chứng việc cập nhật cài đặt trên `D:\Jiuguan`, nhiệm vụ CSDL thực tế và bàn phím điện thoại thật. Kết quả kiểm thử không thể thay thế việc nghiệm thu của người dùng.

Cả 6 phiên bản SillyTavern cô lập 1.14.0, 1.15.0, 1.16.0, 1.17.0, 1.18.0, 1.19.0 đều tải v0.6.2 trong đợt này, kiểm tra yêu cầu gốc của API hiện tại / API riêng, dừng độc lập, duy trì cài đặt trò chuyện gốc và API toàn cục, cũng như khôi phục bản nháp, phong cách, ghi nhớ thủ công, thời gian tin nhắn sau khi lưu cài đặt gốc và làm mới trang. Báo cáo: `小绘-v0.6.2-聊天-酒馆兼容检查.json`. Kết quả AI phía trình duyệt được thay bằng phản hồi thử nghiệm; đây là bằng chứng vận hành trên host thực tế, không phải chứng minh chất lượng AI thực tế.

## Lịch sử kiểm tra v0.7.0

Tính năng đời sống (life gameplay) sử dụng cài đặt tiện ích mở rộng sẵn có để lưu và tận dụng thời gian trình duyệt, DOM, hình ảnh, thanh tiến trình, không thêm API nội bộ SillyTavern mới, không có phụ thuộc bên ngoài hay dịch vụ backend. Làm việc / ăn uống được tính toán theo mốc thời gian (timestamp), vòng lặp trang chỉ làm mới hiển thị; tiền lương sau ca làm được nhận thủ công, lịch sử ăn xong chỉ quyết toán một lần.

Kiểm tra mô hình độc lập: thời gian / tiền lương của 3 công việc, giá cả / thời lượng của 4 loại món ăn, giới hạn 1 hoạt động tại một thời điểm, không đủ vàng, nhận lương / mua trùng lặp, kết thúc ca làm sớm, khôi phục làm việc và ăn uống ngoại tuyến, và giới hạn sổ chi tiêu. Báo cáo: `小绘-v0.7.0-生活逻辑检查.json`.

Kiểm tra trình duyệt độc lập ở độ rộng 1280 / 375 / 320: ranh giới cửa sổ đời sống, tranh minh họa làm việc / ăn uống, đếm ngược thời gian thực, lưu / làm mới / khôi phục ngoại tuyến, xác nhận kết thúc ca sớm, ưu tiên nhiệm vụ CSDL và nút dừng gốc, duy trì tọa độ pet, dọn dẹp. Màn hình máy tính đã đợi đủ 8 giây thực tế để ăn xong bánh pudding; công việc dài được kiểm tra bằng độ lệch thời gian thử nghiệm, không thay đổi thời gian sản xuất thực tế. Báo cáo: `小绘-v0.7.0-生活界面检查.json`. Tính năng đời sống không gửi yêu cầu API nào.

Các tính năng nâng cao trò chuyện cũ cùng dừng nhiệm vụ / sổ tay đã hồi quy trên kích thước máy tính và điện thoại, báo cáo: `小绘-v0.7.0-聊天增强检查.json`, `小绘-v0.7.0-任务停止与小本子检查.json`. Tạo tài nguyên đồ họa dùng ImageGen tích hợp; độ trong suốt, kích thước và dung lượng của 4 ảnh WebP mới xem tại `小绘-v0.7.0-生活插图检查.json`.

Mục tiêu vẫn là 1.14.0–1.19.0. Các bài kiểm tra chạy thực tế của tính năng trò chuyện và điểm khởi chạy trên 6 phiên bản trước đây được giữ làm bằng chứng lịch sử, không nên coi là tính năng đời sống đợt này đã được kiểm thử lại toàn bộ trên cả 6 phiên bản. `D:\Jiuguan` của người dùng, nhiệm vụ CSDL thật và điện thoại thật vẫn chờ xác nhận sau cập nhật.

Đợt này dùng 2 thực thể cô lập chính thức 1.14.0 và 1.19.0 để tải v0.7.0 thực tế, kiểm tra lưu cài đặt gốc, khôi phục trạng thái làm việc khi làm mới trang, nhận lương, trừ tiền mua đồ ăn, ăn xong, duy trì cài đặt nội dung chính / API toàn cục / trò chuyện độc lập. Báo cáo: `小绘-v0.7.0-生活-酒馆兼容检查.json`. Hoàn thành làm việc và ăn uống sử dụng độ lệch thời gian thử nghiệm; không sửa thời lượng sản xuất hay gọi nhà cung cấp AI thực tế.

## Phạm vi chỉnh sửa và kiểm tra v0.7.1

Lần này chỉ thêm liên kết 4 ảnh ăn uống, ảnh thu nhỏ khi chọn món và đổi tên điểm khởi chạy, không thêm API SillyTavern mới. Hoạt động tiếp tục lưu `kind/id/startedAt/uid` cũ, bản ghi món ăn bản cũ lấy hình tương ứng từ cùng một bảng danh mục, không cần đặt lại vàng hay hoạt động.

Kế thừa các kiểm tra trên host thực tế 1.14.0 / 1.19.0 của v0.7.0 và bằng chứng 6 phiên bản trước đó; việc đổi ảnh và đổi tên đợt này được kiểm tra trên trình duyệt độc lập, không mạo nhận là đã kiểm thử lại toàn bộ host đợt này. SillyTavern thật, CSDL thật và điện thoại thật của người dùng vẫn chờ xác nhận sau khi cài đặt cập nhật.

Trình duyệt độc lập ở độ rộng 1280 / 375 / 320 đã mua thử lần lượt 4 món ăn, xác nhận ảnh menu, ảnh sổ tay và ảnh pet nổi tương ứng và tải bình thường; kiểm tra món ăn đang ăn ở bản cũ vẫn giữ `uid` / vàng / chi tiêu tích lũy, khi kết thúc không trừ tiền thêm; cả hai cổng "Sổ tay đời sống" ở sổ tay và cài đặt tiện ích đều mở thành công trên thực tế. Báo cáo: `小绘-v0.7.1-四种吃饭界面检查.json`.

Quy trình đời sống cũ, 8 giây ăn pudding thực tế, làm mới / khôi phục ngoại tuyến, ưu tiên nhiệm vụ và nút dừng CSDL gốc cũng đã hồi quy đạt trên 3 độ rộng: `小绘-v0.7.1-生活界面检查.json`; quy tắc mô hình xem tại `小绘-v0.7.1-生活逻辑检查.json`. Không gửi yêu cầu API trò chuyện. Đã kiểm tra 4 ảnh trong suốt, kích thước 768×768 và dung lượng xem tại `小绘-v0.7.1-四种吃饭插图检查.json`.

## Phạm vi chỉnh sửa và kiểm tra v0.8.0

Lần này không thêm phụ thuộc API nội bộ SillyTavern mới, vẫn dùng `SillyTavern.getContext()`, `extensionSettings`, `saveSettingsDebounced` và phương thức yêu cầu trò chuyện cũ. Phía CSDL có thêm 3 điểm đọc hoặc gọi hàm, tất cả đều có phương án dự phòng (fallback):

- **Mở CSDL**: Ưu tiên gọi API công khai `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()`, nếu không có sẽ lùi về nhấn vào mục CSDL trong menu tiện ích.
- **Chuyển tới bảng chỉ định**: Gọi hành động chuyển trang của kho định tuyến giao diện CSDL `acu-v2-router`, tương đương việc bấm vào thanh bên của nó, chỉ đổi trang; nếu không tìm thấy sẽ lùi về bấm nút thanh bên, nếu vẫn không được thì chỉ mở CSDL và đưa ra thông báo.
- **Ảnh của Nono (奶蛋)**: Chỉ đọc bảng ảnh hiện đã tải của component pet CSDL (`POSE_IMAGES` và ảnh thò đầu `peekSrc`), không sao chép, không phân phối; nếu không đọc được sẽ không thể chuyển sang Nono, nếu đang ở Nono thì để pet CSDL gốc xuất hiện.

Kiểm tra:
- 32 bài unit test trong workspace: Dữ liệu nhân vật và địa chỉ ảnh (địa chỉ của Erii giống từng ký tự với 0.7.1), chọn lọc lời thoại, quy tắc nuôi dưỡng (giới hạn ngày, tăng bậc, giảm và đóng băng chỉ số nhu cầu, độ ưu tiên tâm trạng, quy đổi người dùng cũ), lưu trữ đời sống (đọc nguyên vẹn lưu trữ 0.7.1, nhiều nhân vật hoạt động cùng lúc, trợ cấp, chỉ nhận lương một lần).
- Trang xem trước độc lập (mô phỏng ngữ cảnh SillyTavern và cấu trúc giao diện CSDL, máy tính và độ rộng 375): Chuyển đổi giữa 3 nhân vật, ngôi nhà pet, sổ tay, bong bóng lời thoại nhiệm vụ (đã nhận / đang xử lý / thành công / lỗi / dừng), sổ tay đời sống, trò chuyện (API mô phỏng cục bộ), cài đặt tiện ích, thông báo khi không có CSDL.
- Host thực tế: Mở thực thể cô lập riêng trên SillyTavern 1.17.0 của máy người dùng (thư mục dữ liệu riêng, port khác, không đụng tới dữ liệu SillyTavern người dùng đang dùng), dùng script toàn cục của Trợ lý SillyTavern để tải CSDL naiv1.2.3. Xác nhận tiện ích tải bản 0.8.0, nhận diện được CSDL và nhận thông báo thực tế, đọc được 24 ảnh và ảnh thò đầu của Nono, chuyển sang Nono và thò đầu ở mép màn hình, nút tắt mở bảng "Tiến triển cốt truyện" và bảng trực quan, trò chuyện chuyển tiếp qua backend SillyTavern tới API mô phỏng cục bộ và phản hồi theo nhân cách của Nono, ngăn kéo đáy của sổ tay ở độ rộng điện thoại.

Chưa kiểm chứng: Nhiệm vụ điền bảng / tiến triển cốt truyện do AI điều khiển trên host thật (cần gọi API trả phí, lời thoại nhiệm vụ và nút dừng đã được xác minh mô phỏng trong trang xem trước theo cấu trúc dữ liệu giao diện gốc của CSDL); các bản 1.14.0, 1.15.0, 1.16.0, 1.18.0, 1.19.0 đợt này không kiểm thử lại; bản 1.2.4 trên nhánh chính của repo CSDL chưa thử (đang dùng 1.2.3); cảm giác chạm và bật bàn phím trên điện thoại thật.

## Phạm vi chỉnh sửa và kiểm tra v0.9.0

Lần này thêm 2 tính năng có đọc nội dung chính, trong đó 1 tính năng có ghi vào CSDL. Phía SillyTavern sử dụng thêm `eventSource` / `eventTypes` của `getContext()` (chỉ lắng nghe `MESSAGE_SENT`, `MESSAGE_RECEIVED`, `MESSAGE_DELETED`, `CHAT_CHANGED` để đếm số tầng/lượt bài), `chat` (đọc `mes` của các tầng gần nhất, bỏ qua các tầng ẩn `is_system`) và `getCurrentChatId()`; mã nguồn chính thức của `st-context.js` từ 1.14.0–1.19.0 đều cung cấp các thuộc tính này (đã đối soát từng bản), đợt này chỉ kiểm thử thực tế trên 1.17.0. Yêu cầu trò chuyện vẫn đi theo phương thức cũ.

Phía CSDL chỉ gọi các hàm công khai của `AutoCardUpdaterAPI`, đều kiểm tra phương thức có tồn tại trước khi gọi:

- **Đọc**: `exportTableAsJson`, `getPlotPresetNames`, `getCurrentPlotPreset`.
- **Ghi** (chỉ trong chế độ bảo trì, sau khi người dùng tích chọn và bấm "Áp dụng mục đã chọn"): `updateCell`, `updateRow`, `insertRow`, `deleteRow`, `switchPlotPreset`, `manualUpdate`. Tham số truyền theo cách viết của naiv1.2.3: Bảng dùng tên, dòng dùng số thứ tự dòng (1 là dòng dữ liệu đầu tiên), cột dùng tên trong tiêu đề cột; trước khi thực thi sẽ định vị lại theo `row_id` và đối chiếu giá trị gốc không bị thay đổi.
- **Hoàn tác**: `importTableAsJson(bản sao lưu)`. Trong naiv1.2.3 hàm này mặc định lưu bền vững (persistence), sẽ được ghi vào cuộc trò chuyện như một lần lưu mới (trong bản ghi thao tác của CSDL giá trị cũ vẫn còn, giao diện và các lần đọc sau đó sẽ căn cứ theo giá trị sau phục hồi).
- **Không dùng `importPlotPresetFromData`**: Trong naiv1.2.3 nó sẽ tiện tay chuyển đoạn trò chuyện hiện tại sang chế độ gọi LLM, mà API công khai lại không có cách xóa preset hay đổi ngược lại chế độ, dẫn đến không thể hoàn tác.

Kiểm tra:
- 56 bài unit test trong workspace (thêm mới 24 bài): Sắp xếp và rút gọn dữ liệu bảng, dọn dẹp các tầng nội dung chính, phân tích cú pháp phiếu chỉnh sửa (khối code, dấu phẩy thừa, bị cắt cụt, vượt quá 12 mục), đối chiếu từng mục (bảng / dòng / cột không tồn tại, giá trị không đổi, xung đột cùng một vị trí, xung đột xóa dòng và sửa dòng, chỉ điền lại bảng một lần), thứ tự thực thi, định vị theo `row_id`, kiểm tra giá trị gốc trước khi ghi, từ chối khi đang khóa, từ chối khi đổi trò chuyện, hoàn tác và xác nhận lại khi "về sau đã từng thay đổi", chuyển đổi lại preset, cung cấp mã sao lưu trước khi ghi, sao lưu bộ nhớ khi không có IndexedDB; đếm số tầng cho tính năng quan sát đồng hành (đổi trò chuyện, tầng ẩn, trượt, xóa tầng), thời điểm bình luận (4 giây, 60 giây, CSDL bận 30 giây), tâm trạng tủi thân và hỏi han 1 tiếng một lần, nội dung prompt.
- Trang xem trước độc lập (mô phỏng API công khai của CSDL và sự kiện SillyTavern, độ rộng máy tính, 375 và 320): Chuyển đổi chế độ bảo trì, thanh phạm vi tài liệu, tích chọn phiếu chỉnh sửa (focus không bị nhảy), chọn tất cả chỉ chọn các mục hợp lệ, bỏ chọn tất cả, áp dụng, hoàn tác, xác nhận lại khi bảng đã đổi sau đó, hoàn tác từ bản sao lưu trình duyệt sau khi làm mới trang, tải file sao lưu; bật/tắt và tần suất quan sát đồng hành, bình luận sau 2 tầng bài mới, bong bóng "Đáp lời cô ấy", đánh dấu "Quan sát" trong lịch sử trò chuyện, xóa về 0 sau khi trả lời, tâm trạng "Tủi thân" và hỏi han sau 3 tin nhắn liên tiếp không ai trả lời.
- Host thực tế: Cùng một thực thể cô lập SillyTavern 1.17.0 + CSDL naiv1.2.3, API chính của nội dung và trò chuyện pet đều trỏ về API mô phỏng nội bộ (không gửi yêu cầu trả phí thật). Trong cuộc trò chuyện có tầng của người dùng và nhân vật: Prompt bảo trì đã mang theo bảng thực tế, preset và 3 tầng nội dung gần nhất; tích chọn 3 mục và ghi qua API công khai (sửa ô, thêm dòng, đổi preset), sau khi làm mới vẫn còn; sau khi hoàn tác thì bảng và preset được khôi phục, làm mới lại vẫn ở trạng thái sau khôi phục. Tính năng quan sát đồng hành đưa ra bình luận sau khoảng 5 giây khi `/send`, `/sendas` thêm 2 tầng mới, bong bóng hiện "Đáp lời".
- Hành vi tự thân của CSDL được quan sát (không liên quan đến tiện ích này, đã tái hiện khi tiện ích không ghi dữ liệu): Trong cuộc trò chuyện mới chỉ có lời mở đầu, khi CSDL mở lại cuộc trò chuyện sẽ xóa trường bảng trên tầng lời mở đầu rồi mới lưu, nội dung bảng nằm trong runtime của chính nó, lần ghi tiếp theo sẽ lưu ngược trở lại. Khuyến nghị chỉ dùng tính năng bảo trì trong các cuộc trò chuyện đã có nội dung đối thoại.

Chưa kiểm chứng: Chất lượng phiếu chỉnh sửa do mô hình thật đưa ra; `manualUpdate` điền lại toàn bộ bảng trên host thật (cần gọi trả phí, chỉ mô phỏng trong trang xem trước); việc ghi dữ liệu dưới các chế độ lưu trữ khác nhau của CSDL (JSON / SQLite) chưa được kiểm thử phân tách đợt này; các bản 1.14.0, 1.15.0, 1.16.0, 1.18.0, 1.19.0 và CSDL 1.2.4; điện thoại thật.

## Phạm vi chỉnh sửa và kiểm tra v0.9.1

Lần này chỉ thêm khung thay trang phục (skin framework), không thêm phụ thuộc API SillyTavern hay CSDL mới: Vẫn dùng `SillyTavern.getContext()`, `extensionSettings`, `saveSettingsDebounced`. Trạng thái sở hữu và đang mặc trang phục được ghi vào trường `skins` trong cài đặt của tiện ích này (`{ schema, owned, equipped, bought, spent }`, tách riêng theo nhân vật); tiền mua trang phục lấy từ ví đời sống cũ (`life.coins`), nhật ký sổ chi tiêu dùng loại `spent` sẵn có, do đó khi hạ cấp về v0.9.0 thì trường `skins` bị bỏ qua, tiền vàng và sổ sách vẫn bình thường, không cần đặt lại. Địa chỉ hình ảnh vẫn phân giải tương đối theo thư mục gốc của tiện ích bằng `import.meta.url`, ảnh trang phục đặt tại `assets/skins/<skin id>/`.

Kiểm tra:
- Kiểm tra cú pháp từng module đã sửa dưới Node 22, kèm 7 nhóm kiểm tra logic thuần: Khi danh mục rỗng chỉ có trang phục mặc định; kiểm tra hợp lệ mục danh mục (định dạng id, giá cả, phạm vi nhân vật, trùng lặp, bỏ qua mục viết sai); mua (không trừ tiền khi số dư không đủ, ghi sổ khi thành công, từ chối mua trùng lặp, trang phục độc quyền của nhân vật thì người khác không mua được, trang phục đánh dấu "Mọi nhân vật" thì ai cũng mua được); mặc vào / đổi về mặc định và "trả về false khi không có thay đổi"; làm sạch dữ liệu lưu (dữ liệu rác, giữ lại trang phục đã gỡ khỏi kệ, khi đang mặc đồ đã gỡ kệ thì hiển thị theo mặc định); trang phục chỉ ghi đè lên các tư thế có ảnh, chủ đề ghi đè một phần; `LifeModel.spend` không trừ tiền khi thiếu số dư.
- Chromium không đầu (headless, độ rộng 1280 và 375) tải `index.js` thật, mô phỏng ngữ cảnh SillyTavern: Tiện ích phiên bản 0.9.1; 4 tab trong sổ tay đời sống, thẻ trang phục mặc định ở tab đổi đồ hiện "Đang dùng" và nút bị vô hiệu hóa, thông báo khi danh mục rỗng; nạp 2 trang phục thử nghiệm rồi chạy toàn bộ quy trình: giá và nhắc nhở "còn thiếu bao nhiêu", sau khi mua ví từ 130 còn 10, sổ chi tiêu hiện "Chi 120 vàng mua trang phục 「Yukata mùa hè」", cài đặt ghi vào `skins.owned`; sau khi mặc thì `data-skin` của pet và sổ tay, ảnh pet nổi, ảnh minh họa sổ tay đều chuyển sang ảnh trang phục, bong bóng lời thoại xuất hiện, ghi vào `skins.equipped`; sau khi đổi lại mặc định thì ảnh và thuộc tính khôi phục; chuyển sang Zero (零) chỉ thấy trang phục mặc định và bộ đánh dấu "Mọi nhân vật"; nút "Đổi trang phục cho cô ấy" trong ngôi nhà pet mở đúng trang thay đồ của nhân vật đó; không còn node rác sau khi hủy. Console chỉ có cảnh báo hiệu năng phần mềm WebGL của môi trường không đầu (từ ánh sáng phòng, không liên quan đến thay đổi lần này).

Chưa kiểm chứng: Host SillyTavern thật (1.14.0–1.19.0 đợt này đều không tải), CSDL thật, điện thoại thật; trong danh mục chưa có trang phục thật nên hiệu ứng hiển thị thực tế của trang phục đầy đủ tài nguyên (gồm tư thế thò đầu, làm việc, ăn uống) chưa được kiểm thử thực tế.

## Phạm vi sửa lỗi và kiểm tra v0.9.2

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Sử dụng định danh cuộc trò chuyện sẵn có, sự kiện `CHAT_CHANGED`, cài đặt và AbortController, không thêm module hay phụ thuộc nội bộ SillyTavern mới.

Sửa lỗi: Yêu cầu bảo trì cố định ảnh chụp nhanh tài liệu (snapshot), chuyển đổi trò chuyện sẽ làm vô hiệu yêu cầu cũ; kiểm tra lại quyền sở hữu / trạng thái bận sau khi đợi sao lưu và trước khi ghi từng mục, hoàn tác đối chiếu đúng cuộc trò chuyện đã sao lưu; xóa dòng đối chiếu toàn bộ dòng và tiêu đề cột, chuyển preset đối chiếu preset gốc; quyết toán chính xác khi tắt chỉ số nhu cầu; cấm hoàn tác thường / ép buộc hoàn tác khi đang bận; hủy bỏ phản hồi muộn của bình luận quan sát khi đã tắt hoặc đã chuyển cuộc trò chuyện.

Bằng chứng đợt này:
- 25 nhóm kiểm tra logic thuần trên Node: Chuyển cuộc trò chuyện, đợi sao lưu, ngắt quãng hàng loạt, từ chối đồng thời, thay thế nguồn, quyền sở hữu bản sao lưu, áp dụng / hoàn tác bình thường, xung đột giá trị gốc, thay đổi cuối dòng dài, từ chối phiếu xóa dòng cũ, đóng băng / bật / khởi động lại chỉ số nhu cầu, cùng các hành vi sẵn có như ví / hoạt động đời sống, lưu trữ trang phục, đổi câu chuyện, danh sách mô hình và tham số tin nhắn.
- Trang thử nghiệm cô lập trên Edge tải module tiện ích thực tế, 15 nhóm kịch bản: Yêu cầu khi đổi cuộc trò chuyện và quay lại, sắp xếp lại dòng và thay đổi giá trị gốc, hoàn tác / ép buộc hoàn tác khi bận, phản hồi muộn sau khi tắt trò chuyện cùng (bao gồm bỏ qua tín hiệu hủy), mở lại sau khi tắt, đổi cuộc trò chuyện, bình luận bình thường và trò chuyện thông thường độc lập với nhau, thứ tự thực thi thực tế của các công tắc cài đặt; kéo thả, giữ nguyên tọa độ 7 giây tại chỗ, dừng nhiệm vụ gốc; chuột phải bật/tắt, chạm giữ lâu, ranh giới cửa sổ nổi, ngữ cảnh lịch sử, dọn dẹp ở độ rộng 1280 / 375 / 320. Số lỗi trên trang là 0.
- Vượt qua kiểm tra cú pháp 29 file JavaScript, kiểm tra manifest tiện ích; 53 ảnh WebP giải mã được và có độ trong suốt, 54 liên kết tư thế cục bộ tồn tại. Dung lượng tài nguyên không đổi, không kiểm duyệt lại giải phẫu / cắt ảnh từng tấm.

Chưa kiểm chứng: Chưa kiểm thử lại trên SillyTavern 1.14.0–1.19.0 thật đợt này, quá trình chờ nội bộ của API công khai CSDL thật và lưu trữ bền vững JSON/SQLite, chất lượng phiếu chỉnh sửa của AI thật, điền bảng trả phí, điện thoại thật. Các bản ghi host thật trước đây đều là bằng chứng lịch sử của phiên bản cũ tương ứng. Dịch vụ chỉ kiểm tra lại trước và giữa các lần gọi phương thức công khai, không thể ngắt quãng hoặc rollback thao tác đã được bắt đầu bên trong phương thức CSDL; không khẳng định toàn bộ đợt sửa đổi là một transaction không thể phân tách.

Phiếu chỉnh sửa xóa dòng kiểu cũ nếu thiếu trường dòng gốc sẽ bị từ chối áp dụng và yêu cầu tạo lại; các dữ liệu lưu đời sống / nuôi dưỡng / trang phục / trò chuyện hiện có tiếp tục đọc bình thường. Chưa đẩy lên GitHub, chưa sửa đổi bản cài đặt `D:\Jiuguan` của người dùng, không dùng tự động hóa thay thế việc nghiệm thu của người dùng.

## Trang phục và Vé hoa v0.9.3: Phạm vi kiểm tra

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Đợt này tiếp tục dùng `extensionSettings`, `saveSettingsDebounced` cùng cơ chế phân giải ảnh, cửa sổ và tương tác sẵn có, không thêm API host hay phụ thuộc bên thứ ba.

Di chuyển dữ liệu về sau: Vàng, làm việc / ăn uống, nhật ký và bản ghi sở hữu trang phục cũ tiếp tục đọc bình thường. `life.schema=3` thêm 3 trường vé hoa, `skins.schema=2` thêm chi tiêu vé hoa; lưu trữ cũ các trường mới bằng 0. Bản cũ không nhận biết vé hoa, việc hạ cấp về bản cũ rồi lưu lại có thể làm mất các trường mới và nhật ký mới này, nên sao lưu trước.

Bằng chứng đợt này:
- 9 nhóm kiểm tra mô hình trang phục: Giá cả / tỷ lệ đổi, ban đầu chưa sở hữu, di chuyển lưu trữ cũ, bảo vệ thiếu số dư / số lượng không hợp lệ / tràn số, mua lặp lại, mặc và khôi phục, trang phục mua bằng vàng cũ, tương thích làm việc / thức ăn, ánh xạ 27 động tác.
- Edge tải module chính thức, 10 nhóm kịch bản trang phục: Bấm đổi / mua / mặc thực tế, điền vào không trừ tiền, đổi một phần, vé hoa còn lại, lưu khi làm mới, tách biệt nhân vật, giải mã lần lượt 27 ảnh, lương làm việc và ảnh ghép 4 bữa ăn, không tràn ngang ở 1280 / 375 / 320, dọn dẹp, kéo thả khi mặc áo mới và dừng CSDL gốc. Lỗi trang và thiếu ảnh đều bằng 0.
- 25 nhóm mô hình và 15 nhóm hồi quy trình duyệt cũ được kiểm tra lại trên mã nguồn đợt này, bao phủ 6 mục sửa lỗi của v0.9.2, nhấn giữ trên điện thoại, chuột phải trên máy tính, giữ tọa độ 7 giây tại chỗ, dừng nhiệm vụ và dọn dẹp cửa sổ. API và CSDL đều là mô phỏng, không đại diện cho việc gọi API thật.
- Kiểm tra cú pháp JavaScript, manifest tiện ích, manifest / hash media trang phục, kích thước và độ trong suốt của 27 ảnh WebP mới, giữ nguyên byte của 53 ảnh WebP cũ và đối chiếu file nén với file nguồn. Ảnh mới 960×960, tổng cộng 6.766.248 byte; 8 động tác thường dùng được tải trước, số còn lại tải theo yêu cầu.

Chưa kiểm chứng: Đợt này chưa tải từng bản trên SillyTavern 1.14.0–1.19.0 thật, chưa cập nhật `D:\Jiuguan` của người dùng, chưa kết nối CSDL hoặc API thật, chưa thử nghiệm trên điện thoại thật, ví đồng thời đa thiết bị hay lưu trữ bền vững chế độ ẩn danh. Các thử nghiệm host trước đó được giữ làm bằng chứng lịch sử của phiên bản tương ứng. Ví trong bản xem trước hiện tại là dữ liệu thử nghiệm độc lập, tiện ích chính thức sẽ không tặng số dư thử nghiệm. Chưa đẩy lên GitHub, việc cài đặt và nghiệm thu của người dùng chưa hoàn tất.

## Cửa hàng độc lập v0.9.4: Phạm vi kiểm tra

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Bổ sung `mall-window.js`, sử dụng ví, danh mục trang phục, lưu cài đặt tài khoản và bố cục cửa sổ sẵn có; không thêm API host, phụ thuộc bên thứ ba hay lệnh gọi mạng mới. Lưu trữ đời sống tiếp tục là schema 3, trang phục là schema 2, tỷ lệ quy đổi và giá cả không thay đổi. Toàn bộ 80 ảnh WebP khớp từng byte với v0.9.3.

Bằng chứng đợt này:
- Edge tải điểm khởi chạy và style chính thức, 11 nhóm kiểm tra cửa hàng: Bố cục 1280 / 375 / 320, nút dưới đáy luôn nhìn thấy, xem trước 4 tư thế, 3 cổng vào thực tế, định vị đổi vé không trừ tiền, bảo vệ đổi không hợp lệ, đổi từng đợt và vé thừa, mua không tự động mặc, không trừ tiền trùng lặp, đổi đồ trong tủ đồ, làm mới giữ nguyên key lưu của v0.9.3, quyền sở hữu nhân vật, đi làm và nhận lương, dừng nhiệm vụ gốc mô phỏng.
- Đầu vào cảm ứng độc lập kiểm tra cổng vào từ tủ đồ sang cửa hàng; mô phỏng kéo xuống để đóng; giảm hiệu ứng động và dọn dẹp hủy bỏ; thu nhỏ trang hiển thị điện thoại thành 320×360 để kiểm tra header gọn, vùng đổi vé cuộn được và các nút đáy. Lỗi trang và file thiếu bằng 0. Cảm ứng giả lập và thu nhỏ trang không thể thay thế cho việc kiểm thử trên điện thoại thật và bàn phím thực tế.
- Vượt qua 9 nhóm mô hình vé hoa / trang phục, 25 nhóm mô hình sẵn có, 15 nhóm hồi quy trình duyệt sẵn có. 6 mục sửa lỗi ban đầu, trò chuyện thông thường và dừng nhiệm vụ tiếp tục được giữ lại; CSDL và API đều là mô phỏng.
- Vượt qua kiểm tra cú pháp 30 file JavaScript, manifest tiện ích, manifest media 27 ảnh; 80 ảnh WebP trong suốt và giải mã được; ví, mô hình trang phục và 5 module sửa lỗi hoàn toàn trùng khớp với trước khi ghép nối cửa hàng.
- Gói đầy đủ 122 file, gói cập nhật GitHub 46 file, đều được so sánh từng byte với nguồn bảo trì. Gói cập nhật dựa trên nền tảng bảo trì v0.9.1 gốc, bao gồm sửa lỗi v0.9.2 và ảnh mới v0.9.3, không thể dùng độc lập như một bản cài đặt đầy đủ.

Chưa kiểm chứng: Đợt này chưa chạy trên SillyTavern thật hay CSDL thật, chưa có bài test bàn phím nhập liệu thật và điện thoại thật, chưa test API trả phí, ví đa thiết bị hay lưu trữ ẩn danh. Bản xem trước trên máy vẫn dùng ví thử nghiệm độc lập, tiện ích chính thức không tặng vàng. Chưa đẩy lên GitHub, chưa sửa `D:\Jiuguan`; việc cài đặt thực tế và nghiệm thu của người dùng vẫn chưa hoàn thành. Bằng chứng host thật nói trên được giữ lại cho phiên bản lịch sử tương ứng, không mạo danh kết quả đợt này.

## Mật ngữ trang phục, Đa hội thoại và Thu gọn suy nghĩ v1.0.0: Phạm vi kiểm tra lịch sử

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0. Không thêm API nội bộ SillyTavern hay phụ thuộc runtime bên thứ ba mới. Trò chuyện vẫn dùng adapter kết nối cũ và kiểm soát hủy yêu cầu độc lập cho từng lần gửi.

- Cuộc trò chuyện ban đầu giữ nguyên các trường cũ, các cuộc trò chuyện mới thêm được lưu trong `conversations` của từng nhân vật. Mỗi bản ghi, bản nháp, chế độ và yêu cầu là độc lập; khi đổi pet sẽ đóng cửa sổ và giữ lại bản ghi. Khi điện thoại đổi panel sẽ giữ lại yêu cầu chạy ngầm, chủ động đóng vẫn hủy yêu cầu của cửa sổ đó.
- Nội dung suy nghĩ có cấu trúc từ API và các thẻ `think/thinking/analysis/reasoning` được lưu riêng biệt, mặc định thu gọn. Chỉ hiển thị nội dung API thực sự trả về dưới dạng văn bản thuần; ngữ cảnh trò chuyện thông thường chỉ mang theo nội dung chính. Suy nghĩ giới hạn tối đa 32.000 ký tự mỗi tin, tính chung vào ngân sách dung lượng lưu trữ cùng với nội dung chính.
- Bổ sung tính năng nhập JSON của chính plugin này và xuất mặc định dạng JSON, giữ lại định dạng TXT; hỗ trợ JSONL của SillyTavern bản text, mảng tin nhắn và TXT bản cũ có thể nhận diện. Xác nhận trước khi nhập, lưu thành cuộc trò chuyện mới; không nhập khóa bí mật, kết nối, ghi nhớ thủ công hay phiếu chỉnh sửa có thể thao tác.
- Ghép nối 27 ảnh WebP của Zero (零), xác thực mật ngữ hoàn toàn cục bộ, không gửi tới mô hình, không trừ tiền, không thống kê lượt mua. Giữ nguyên `skins` schema 2, `life` schema 3. Giữ nguyên 80 ảnh WebP cũ không vẽ lại.
- Báo cáo mô hình và trình duyệt đợt này xem tại `test-erii-0100-*` trong workspace; biên bản kiểm tra bàn giao cuối cùng tập trung tại `outputs/小绘-v1.0.0-接入验证.json`. Bao phủ gửi đồng thời / phản hồi ngược thứ tự / dừng và phản hồi muộn / khôi phục bản nháp / xuất nhập hai chiều / file hỏng / cách ly nhân vật / mở khóa trang phục / độ rộng 375 và 320 / chiều cao hiển thị 320×360 / giải mã và hủy tài nguyên.

Các vấn đề phát hiện và xử lý trong quá trình sửa lỗi: Lỗi trùng tên biến cục bộ trong trình xuất JSON mới; các trường mới thêm làm tràn nút gửi ở chiều cao hiển thị thấp; cửa hàng đa nhân vật vẫn dùng nhầm tông màu tím của Erii. Bằng chứng cuối cùng căn cứ theo báo cáo của phiên bản này.

Đợt này vẫn là kiểm tra trên Edge với mã nguồn chính thức kết hợp SillyTavern, CSDL và API mô phỏng. Chưa kiểm thử lại từng phiên bản trên SillyTavern thật, chưa kết nối mô hình thật, chưa test bàn phím điện thoại thật, chưa test đồng thời dữ liệu lưu trên nhiều thiết bị. Chưa đẩy lên GitHub, chưa sửa `D:\Jiuguan` hay cài đặt; cập nhật thực tế và nghiệm thu của người dùng đang chờ hoàn thành. Các bài kiểm tra host thật ở trên thuộc về phiên bản lịch sử tương ứng.

## Bản sửa đổi tự kiểm tra v1.0.0 (Lịch sử, số phiên bản khi đó không đổi)

Đợt tự kiểm tra toàn diện này lấy phạm vi ranh giới là 32 file JS nguồn bảo trì, style chính thức, manifest, tài liệu hướng dẫn và ánh xạ 107 ảnh WebP. Thêm mới các ca kiểm tra tái hiện: Đóng mở nhanh 3 loại cửa sổ, chuyển đổi focus giữa các cửa sổ, khôi phục khi làm mới trang với các kết nối khác nhau và cùng kết nối nhưng khác khóa API, hủy ghi nhớ khóa, di chuyển khóa cũ, co lại theo độ rộng điện thoại, phân định phản hồi quan sát, hoạt động tiếp theo quyết toán thức ăn trước hạn, một phần lưu trữ nuôi dưỡng bị rỗng, thiếu thời gian tin nhắn, độ dài phản hồi dạng số thập phân và màn hình hiển thị cao 200px.

Sửa lỗi chỉ sử dụng API lưu trữ trình duyệt và tài khoản cũ, cầu nối CSDL cũ; không thêm API host hay phụ thuộc runtime mới. Khóa bí mật vẫn không đưa vào `extensionSettings` hoặc xuất ra ngoài, yêu cầu điền lại nếu không rõ nguồn gốc khi di chuyển. Callback quyết toán thức ăn một lần thuộc về mô hình nội bộ của plugin, không liên quan đến API của CSDL.

Biên bản kiểm tra cuối cùng và bảng lỗi đầy đủ xem tại file đầu ra của workspace: `小绘-v1.0.0-全面自检报告.md/json`. 107 ảnh WebP cũ giữ nguyên từng byte, dịch vụ bảo trì và cơ chế sao lưu không đổi; các bài hồi quy JS / mô hình / trò chuyện / cửa hàng / nhiệm vụ cũ tiếp tục được xác minh. CSS chỉ tập trung thẩm tra bố cục và các quy tắc của đợt này kèm kiểm tra trên trình duyệt, không rà soát thủ công từng khai báo trang trí.

Chưa kiểm chứng trên SillyTavern 1.14.0–1.19.0 thật, CSDL / mô hình thật, bàn phím điện thoại thật, đồng thời nhiều thiết bị. Trình duyệt trên máy dùng dữ liệu mô phỏng, không thể thay thế việc nghiệm thu cài đặt thực tế; số phiên bản giữ nguyên 1.0.0, cần ghi đè đầy đủ các file cập nhật lần này và làm mới trang. Chưa đẩy GitHub, chưa sửa `D:\Jiuguan`, `driverAccepted=false`.

## Trò chuyện cùng cửa sổ và Kích thước Pet v1.0.1 (16-10-2026)

Mục tiêu vẫn là SillyTavern 1.14.0–1.19.0, không thêm API nội bộ SillyTavern hay phụ thuộc bên thứ ba. Trò chuyện vẫn gửi qua adapter cũ, cấu trúc bản ghi không đổi, đọc trực tiếp nhiều bản ghi của bản 1.0.0 trước đó.

Workspace chỉ giữ lại một khung giao diện trò chuyện hiển thị duy nhất và một bộ vị trí kéo thả / thu phóng. Khi chuyển đổi sẽ cất gọn bản nháp cũ, nạp nội dung hiện tại; mỗi yêu cầu và khóa bí mật vẫn thuộc về cuộc trò chuyện ban đầu của nó. Phản hồi chạy ngầm sẽ không làm chuyển cửa sổ hiện tại hoặc ghi đè lên bản nháp hiện tại. Đóng toàn bộ cửa sổ trò chuyện sẽ dừng tất cả các yêu cầu đang chờ phản hồi; dừng phản hồi hiện tại không ảnh hưởng đến các cuộc trò chuyện khác.

Điện thoại và máy tính dùng chung cài đặt kích thước **56–112px**, hủy bỏ giới hạn trần 72px cũ của điện thoại; khi vùng hiển thị của màn hình / bàn phím quá nhỏ sẽ tạm thời giới hạn kích thước thực tế, không ghi đè lên giá trị đã lưu. Thanh trượt kéo thả được gộp sắp xếp lại theo khung hình động (animation frame), hiển thị số pixel hiện tại và nút khôi phục về 88px.

Đợt này sử dụng module và style chính thức, SillyTavern / API / CSDL mô phỏng để kiểm tra cùng một cửa sổ DOM: Chuyển đổi sau khi kéo thả / mở rộng, nhập và xóa, sửa bản nháp / làm mới, vị trí đọc, xác nhận đặt lại, phản hồi ngược thứ tự ở chế độ chạy ngầm, hủy khi đóng, cách ly khóa bí mật, màn hình hẹp 375 / 320 và chiều cao hiển thị 360 / 200. Kích thước bao phủ 56 / 72 / 88 / 96 / 112, bàn phím, cảm ứng giả lập, xoay màn hình ngang dọc, thò đầu ở mép và khôi phục khi làm mới; phạm vi thực tế căn cứ theo biên bản trong `小绘-v1.0.1-接入验证.json`. 107 ảnh WebP đã được đối soát từng byte với gói cài đặt 1.0.0 trước khi sửa đổi.

SillyTavern 1.14.0–1.19.0 thật chưa được kiểm thử lại từng bản trong đợt này; mô hình / CSDL thật, thanh trượt trên điện thoại thật và bàn phím hệ thống, đồng thời trên nhiều thiết bị vẫn chờ người dùng xác nhận sau khi cập nhật. Chưa cài đặt, chưa đẩy lên GitHub hay sửa `D:\Jiuguan`; `driverAccepted=false`. Bằng chứng host thật nói trên chỉ thuộc về các phiên bản lịch sử tương ứng.