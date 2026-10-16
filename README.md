# Link gốc: https://github.com/dzsks/xiaohuizhuochong

# Erii · Pet Màn Hình Cơ Sở Dữ Liệu

Đây là tiện ích mở rộng (extension) pet màn hình độc lập cài đặt cho SillyTavern. Tiện ích này đọc trạng thái nhiệm vụ và thông báo kết quả đang hiển thị từ tiện ích «Long Huyết Huyền Hoàng · Cơ Sở Dữ Liệu», từ đó cho phép pet màn hình phản hồi bằng các động tác riêng, tương tác khi nhấp chuột, bong bóng nhiệm vụ và lời thoại. Bạn có thể chuyển đổi giữa Erii (Tiểu Hội), Zero và Naidan; mỗi nhân vật đều sở hữu tính cách, lời thoại, hồ sơ nuôi dưỡng và lịch sử trò chuyện độc lập. Bạn cũng có thể mở cửa sổ độc lập để trò chuyện cùng pet bằng API hiện tại của SillyTavern hoặc API cấu hình riêng.

## Phiên bản hiện tại: v1.0.1

**2026-10-16: Hợp nhất tạo mới, chuyển đổi và nhập cuộc trò chuyện ngay trong cùng một cửa sổ; kích thước pet trên điện thoại không còn bị giới hạn ở 72px.** Vị trí cửa sổ, kích thước mở rộng, các bản nháp và vị trí đọc đều được giữ nguyên. Bổ sung hiển thị chỉ số kích thước và nút khôi phục kích thước mặc định, tối ưu hóa thao tác kéo thanh trượt liên tục theo chu kỳ làm mới màn hình. Các bản vá tự kiểm tra từ v1.0.0 tiếp tục được duy trì.

**Tiếp tục duy trì: Trang phục «Hoàng Nữ Zero · Lam Băng Tường Vi» mở khóa bằng mật ngữ; trò chuyện bổ sung khu vực suy nghĩ mặc định thu gọn, hỗ trợ nhiều hội thoại độc lập và nhập dữ liệu. Lịch sử cũ được bảo toàn.**

- **Trang phục mới của Zero**: Mở Cửa hàng → Chọn Zero → Nhập mật ngữ → Xác nhận mở khóa → Vào Tủ đồ để mặc. Không cần xu vàng hay vé hoa, không tự động mặc lên. Mật ngữ là: **这一路上我们不会彼此抛弃，不彼此出卖，直到死亡的尽头** *(Lưu ý: Giữ nguyên câu tiếng Trung với dấu phẩy tiếng Trung `，`, không thêm dấu chấm ở cuối)*.
- **Nhiều cuộc hội thoại**: Nhấp vào «Hội thoại mới» ở đầu cửa sổ chat. Cả trên máy tính lẫn điện thoại đều chuyển đổi trong cùng một cửa sổ, không mở nhiều cửa sổ hay nhảy đi nơi khác; hội thoại đang chuyển sang tab khác vẫn có thể tiếp tục chờ phản hồi. Lịch sử, bản nháp, cài đặt, trả lời lại và dừng phản hồi của mỗi hội thoại đều độc lập.
- **Thu gọn suy nghĩ (Reasoning)**: Nội dung suy nghĩ trả về từ API được đặt trong mục «Quá trình suy nghĩ · Nhấp để mở rộng», mặc định được thu gọn. Các thẻ suy nghĩ trong lịch sử cũ cũng được chuẩn hóa; API không trả về nội dung này thì sẽ không tự ý bổ sung. Lượt trò chuyện tiếp theo chỉ gửi kèm phần nội dung chính, không gửi kèm phần suy nghĩ này.
- **Nhập / Xuất**: Mặc định xuất file JSON có thể nhập lại; trong mục «Quản lý» có thể đổi sang file TXT. Nhấp «Nhập» để chọn JSON, SillyTavern JSONL hoặc file chat TXT phiên bản cũ, xem trước số lượng tin nhắn trước khi xác nhận, luôn được lưu thành cuộc hội thoại mới.

Mua trang phục: Nhấp chuột phải (máy tính) / Nhấn giữ khoảng 1.4 giây (điện thoại) để mở Sổ tay nhỏ → **Cửa hàng · Mua trang phục mới** → **Đổi vé hoa** → Nhập số lượng xu vàng → **Đổi vé hoa** → **Mua trang phục** → **Vào tủ đồ để mặc**. Nút mua luôn hiển thị ở dưới cùng của Cửa hàng.

Bộ **Tsukuyomi · Dạ Lễ Nguyệt Độc** của Erii vẫn có giá **10.320 vé hoa**, tỷ lệ **1 xu vàng đổi 40 vé hoa**, từ 0 vé hoa sẽ cần **258 xu vàng**. Trang phục mới của Zero không cần mua hay đổi vé. Cả hai bộ trang phục đều sở hữu đầy đủ 27 hình ảnh động tác và sinh hoạt; ví tiền, hoạt động, trò chuyện và hồ sơ nuôi dưỡng ban đầu tiếp tục được kế thừa.

Tiếp tục duy trì 6 bản vá sửa lỗi từ v0.9.2:

- Gợi ý bảo trì được tạo dựa trên ảnh chụp bảng tại thời điểm gửi yêu cầu; chuyển đổi hội thoại khi đang đợi phản hồi sẽ hủy bỏ yêu cầu cũ. Trong cùng một cuộc trò chuyện, việc chèn/sắp xếp lại hàng vẫn tìm đúng hàng gốc theo `row_id`, nếu giá trị gốc đã thay đổi sẽ từ chối ghi đè.
- Sau khi sao lưu hoàn tất, trước mỗi thao tác ghi và trước khi hoàn tác nhập liệu, hệ thống kiểm tra lại cuộc trò chuyện, nguồn cơ sở dữ liệu và trạng thái bận; mỗi trang chỉ thực hiện một thao tác ghi/hoàn tác bảo trì tại một thời điểm. Khi thành công một phần, kết quả từng mục và bản sao lưu vẫn được lưu lại đầy đủ.
- Trước khi xóa hàng, hệ thống đối chiếu toàn bộ nội dung hàng và tiêu đề cột; trước khi đổi preset cốt truyện, hệ thống đối chiếu preset gốc. Gợi ý xóa hàng tạo từ bản cũ thiếu giá trị gốc đầy đủ sẽ thông báo tạo lại; sau khi nâng cấp nên kiểm tra lại các gợi ý cũ chưa áp dụng.
- Khi cơ sở dữ liệu đang bận, cả hoàn tác thông thường và “Vẫn muốn hoàn tác” đều tạm thời bị vô hiệu hóa; hoàn tác bắt buộc chỉ có thể bỏ qua bước xác nhận “bảng đã thay đổi sau đó”, không thể bỏ qua kiểm tra quyền sở hữu hội thoại và trạng thái bận.
- Khi tắt chỉ số nhu cầu, hệ thống sẽ đóng băng độ no/vệ sinh tại đúng thời điểm tắt, khi bật lại sẽ bắt đầu tính thời gian từ thời điểm mới.
- Hủy bỏ các bình luận đang chờ khi tắt tính năng Quan sát đồng hành, ẩn pet hoặc chuyển đổi cuộc trò chuyện; dù API trả về muộn cũng không lưu vào lịch sử, không hiện bong bóng cũ. Yêu cầu trò chuyện thông thường vẫn hoàn toàn độc lập.

Khung thay trang phục từ v0.9.1 tiếp tục được giữ nguyên: Erii có Dạ Lễ Nguyệt Độc, Zero có trang phục Hoàng Nữ mở khóa bằng mật ngữ, Naidan vẫn giữ trang phục mặc định.

Bảo trì cơ sở dữ liệu và Quan sát đồng hành từ v0.9.0, 3 nhân vật (Erii / Zero / Naidan), Ngôi nhà Pet, nuôi dưỡng, lời thoại nhiệm vụ, phím tắt một chạm mở giao diện CSDL và giao diện Sổ tay bìa cứng từ v0.8.0 đều được giữ trọn vẹn.

- Chỉ có hai trường hợp đọc văn bản SillyTavern, và cả hai đều cần bạn chủ động bật: Chế độ bảo trì (mỗi lần gửi tin nhắn sẽ đính kèm 0–10 tầng ngữ cảnh gần nhất, có thể tùy chỉnh) và Quan sát đồng hành (chỉ theo dõi các tầng mới xuất hiện sau khi bật). Nội dung đọc được chỉ gửi đến đúng API dùng để trò chuyện với pet.
- Chỉ có chế độ bảo trì mới sửa đổi cơ sở dữ liệu: Bạn phải tích chọn từng mục và nhấn **Áp dụng mục đã chọn** thì mới tiến hành ghi; việc ghi chỉ thông qua API công khai `AutoCardUpdaterAPI` của CSDL, sao lưu toàn bộ trước khi ghi và có thể hoàn tác. Hoàn toàn không có thao tác tự động áp dụng.
- Ngoài ra, tiện ích hoạt động theo cơ chế đồng bộ chỉ đọc: Không sao chép, không thay thế CSDL, bình thường không đọc/ghi vào bảng dữ liệu.
- Vị trí của pet chỉ thay đổi khi người dùng kéo thả thủ công; không khôi phục hành vi tự do di chuyển.
- Hình ảnh của Naidan được đọc trực tiếp từ CSDL đang chạy tại thời điểm thực thi, không đính kèm phân phối trong tiện ích này; nếu CSDL chưa mở thì không thể chuyển sang Naidan.
- Vé hoa được đổi thủ công từ xu vàng trong Sổ tay đời sống, mua trang phục sẽ trừ vé hoa. Lối chơi đời sống không gọi API, không đọc/ghi CSDL hay văn bản SillyTavern.

Các phiên bản cũ từng thử nghiệm tính năng tự di chuyển, chạy nhảy và đi dạo. Các logic đó đã được loại bỏ hoàn toàn từ **v0.5.8**, không nên nhầm lẫn hành vi bản cũ với phiên bản hiện tại.

## Cách kiểm tra xem kho GitHub đã là bản mới nhất hay chưa

Đối chiếu 4 điểm dưới đây, tất cả phải hiển thị `1.0.1` thì mới xác nhận nguồn duy trì hiện tại đã cập nhật hoàn chỉnh:

1. Mở [`manifest.json`](manifest.json) ở thư mục gốc của kho lưu trữ, kiểm tra `version` có phải là `1.0.1` hay không.
2. Kiểm tra dòng “Phiên bản hiện tại” ở đầu tệp README này có phải là **v1.0.1**.
3. Kiểm tra commit gần nhất trên GitHub có chứa các tệp đã sửa đổi của đợt này hay không; v1.0.1 bắt buộc phải có `chat-workspace.js`, `chat-history.js`, `mall-window.js`, cùng các tệp cập nhật `notebook.js`, `icons.js`, `life-model.js`, `life-window.js`, `skin-model.js`, `index.js`, `style.css`, và mỗi thư mục `assets/skins/erii-purple-night/` cùng `assets/skins/zero-ice-rose/` phải có đủ **27 tệp WebP, bản mô tả chất liệu và danh mục đa phương tiện**; đồng thời giữ nguyên các tệp từ v0.9.0 gồm `repair.js`, `repair-ticket.js`, `database-repair.js`, `backup-store.js`, `watch.js`, từ v0.8.0 gồm thư mục `characters/`, `characters.js`, `care-model.js`, `lines.js`, `notebook.js`, `pet-house.js`, `sheet.js`, `effects.js`, `icons.js`, `database-shortcuts.js`, cùng 19 ảnh WebP dưới `assets/zero/`, 7 ảnh WebP dưới `assets/zero/life/`; các tệp `assets/run-*.webp` đã bị xóa bỏ.
4. Nếu sử dụng tệp nén, tên tệp phải là `绘梨衣桌宠-独立扩展-v1.0.1.zip`, sau khi giải nén `manifest.json` vẫn phải là `1.0.1`.

Phiên bản hiển thị trong danh sách tiện ích mở rộng của SillyTavern là phiên bản thực tế đang được tải. Chỉ nhìn thấy README trên GitHub đã cập nhật chưa chứng minh được SillyTavern đã tải phiên bản mới; hãy cập nhật tiện ích và làm mới trang rồi đối chiếu số phiên bản trong SillyTavern.

## Cài đặt trực tiếp trong SillyTavern

1. Mở **Tiện ích mở rộng (Extensions)** ở đầu SillyTavern → **Cài đặt tiện ích mở rộng (Install Extension)**.
2. Dán địa chỉ kho lưu trữ: `https://github.com/dzsks/xiaohuizhuochong`.
3. Sau khi cài đặt hoặc cập nhật xong, hãy làm mới lại trang SillyTavern.
4. Trong danh sách tiện ích mở rộng, xác nhận phiên bản của **Erii · Pet Màn Hình Cơ Sở Dữ Liệu** là `1.0.1`.
5. Nhấp chuột phải vào pet trên máy tính, hoặc nhấn giữ khoảng 1.4 giây trên điện thoại để mở Sổ tay nhỏ; khi thấy thông báo “Đã kết nối cơ sở dữ liệu” hoặc “Cơ sở dữ liệu đang xử lý nhiệm vụ”, tức là đã kết nối thành công với nguồn dữ liệu của CSDL.

Thư mục gốc của kho lưu trữ phải chứa trực tiếp các tệp như `manifest.json`, `index.js`, `style.css` v.v., không được lồng thêm một thư mục bọc bên ngoài. Hình ảnh nằm bên trong thư mục `assets/` tại thư mục gốc.

## Cập nhật bản cài đặt hiện có

### Cập nhật qua kho lưu trữ GitHub

1. Giải nén gói cập nhật phiên bản mới, tải đè các tệp bên trong lên cùng thư mục gốc của kho lưu trữ, giữ nguyên cấu trúc thư mục của `assets/`. Hãy tải lên các tệp đã giải nén, đừng chỉ đưa mỗi tệp ZIP vào kho lưu trữ.
2. Commit các thay đổi lên GitHub.
3. Quay lại trình quản lý tiện ích mở rộng của SillyTavern, nhấn nút cập nhật của tiện ích này.
4. Làm mới trang SillyTavern, xác nhận phiên bản trong danh sách tiện ích là `1.0.1`.
5. Nếu hành vi hoặc hình ảnh vẫn là bản cũ, hãy tải lại tiện ích mở rộng; nếu vẫn chưa đổi, hãy dùng `Ctrl+F5` để làm mới bộ nhớ đệm (cache) trình duyệt.

### Kiểm tra qua gói nén

Gói duy trì hiện tại: `绘梨衣桌宠-独立扩展-v1.0.1.zip`.

Sau khi giải nén, kiểm tra:

- `version` trong `manifest.json` là `1.0.1`;
- Đánh dấu phiên bản pet trong `index.js` là `1.0.1`;
- Thư mục gốc có `mall-window.js` và `skin-model.js`, giá của Dạ Lễ Nguyệt Độc là 10.320, loại thanh toán là `tickets`;
- Thư mục `assets/skins/erii-purple-night/` và `assets/skins/zero-ice-rose/` mỗi bên có đủ 27 ảnh WebP, không được chỉ tải lên mã nguồn mà thiếu ảnh;
- Trong `assets/` không còn các frame chạy bộ trái/phải, `assets/zero/` và `assets/zero/life/` đều có mặt đầy đủ;
- Dòng đầu README và mục mới nhất trong lịch sử phiên bản đều là `v1.0.1`.

### Phải làm sao nếu GitHub báo tải lên quá nhiều tệp

Nếu đã cập nhật hoàn chỉnh lên v1.0.0, ưu tiên sử dụng **`绘梨衣桌宠-v1.0.0到v1.0.1-更新包.zip`**, chỉ cần tải lên 9 tệp ở thư mục gốc có trong gói, đợt này hình ảnh không thay đổi.

Nếu đã có kho lưu trữ đầy đủ từ v0.9.1–v0.9.4, có thể dùng **`绘梨衣桌宠-GitHub更新包-v1.0.1.zip`**. Gói này gồm 82 tệp, chứa toàn bộ các bổ sung/sửa đổi từ nền tảng duy trì v0.9.1 ban đầu: 6 bản sửa lỗi, 2 bộ trang phục mới, cửa hàng và đa hội thoại. Sau khi giải nén, kéo thả các tệp cùng thư mục `assets` vào trang tải lên ở thư mục gốc của kho, giữ lại các tệp sẵn có, commit rồi vào SillyTavern cập nhật tiện ích. Gói này cần các tệp khác đã có sẵn trong kho, không thể cài đặt độc lập như một tiện ích hoàn chỉnh.

Khi tạo kho mới hoặc kho cũ chưa đầy đủ, hãy dùng gói hoàn chỉnh **`绘梨衣桌宠-独立扩展-v1.0.1.zip`** (153 tệp). Khi tải lên qua web có thể chia làm 3 đợt: một đợt gồm 2 bộ skin trong `assets/skins/`, một đợt gồm các tư liệu gốc khác trong `assets`, và một đợt gồm thư mục gốc cùng `characters/`; mỗi đợt dưới 100 tệp. Sau khi hoàn tất commit mỗi đợt thì tải tiếp đợt sau, đảm bảo thư mục gốc cuối cùng có trực tiếp `manifest.json`, `index.js`, `mall-window.js` và `assets`.

## Các tính năng hiện có

### Nhấp chuột và tương tác

| Thao tác | Phản ứng của pet (lấy Erii làm ví dụ) |
| --- | --- |
| Nhấp nhẹ 1 lần | Vẫy tay đáp lại |
| Nhấp đúp nhanh 2 lần | Ôm vịt vàng lắc lư nhẹ |
| Nhấp 3 lần trở lên trong 1.2 giây | Ôm sổ né tránh |
| Nhấp 6 lần trong 2.6 giây | Nhòm ngó → Ôm vịt → Vẫy tay, phát xong trở lại bình thường |
| Nhấn giữ yên khoảng nửa giây | Đi vào giấc ngủ ngắn; thả tay ra nghỉ ngơi tiếp khoảng 12 giây |
| Nhấp nhẹ khi đang ngủ ngắn | Đánh thức sớm |
| Kéo thả | Bị nhấc bổng lên, thả tay ngồi vững và lưu lại vị trí |
| Nhấp chuột phải (máy tính) | Mở / Thu gọn Sổ tay nhỏ |

Cách thức tương tác của Zero và Naidan tương tự, chỉ thay bằng các động tác đặc trưng: Zero ôm thiên nga đen nhỏ, gấp thiên nga giấy, uống ca cao nóng; Naidan nhấp đúp sẽ nhột, nhấp liên tục sẽ cáu khè khè, nhấn giữ sẽ ngồi ngủ ngáy khò khò. Nhấp chuột, tặng hoa, đồng hành khi bạn điền bảng đều giúp độ thân mật tăng lên một chút (xem phần “Nuôi dưỡng”). Thi thoảng nhấp vào, pet sẽ đáp lại một câu trong bong bóng thoại.

Tiêu đề của Sổ tay nhỏ là tên của nhân vật hiện tại, ví dụ: **Sổ tay của Erii**, **Sổ tay của Zero**, không hiển thị số phiên bản. Nhấp chuột thông thường sẽ không mở trang; trên máy tính cũng có thể mở Sổ tay nhỏ từ cài đặt tiện ích mở rộng. Sau khi tắt “Hiển thị pet”, bạn vẫn có thể mở Sổ tay nhỏ từ cài đặt tiện ích để xem nhiệm vụ và mở CSDL; các nút động tác thư giãn sẽ bị vô hiệu hóa trong thời gian ẩn pet. Khi focus vào pet: phím Enter / Space để tương tác, Shift + Enter để mở Sổ tay nhỏ, các phím mũi tên để tinh chỉnh vị trí, phím Home để đặt lại vị trí ban đầu.

### Thao tác trên điện thoại

Điện thoại không có chuột phải, hãy sử dụng các thao tác sau:

- Nhấp nhẹ hoặc chạm nhanh: Tương tác;
- Nhấn giữ khoảng nửa giây: Ngủ ngắn;
- Tiếp tục nhấn giữ khoảng 1.4 giây: Mở Sổ tay nhỏ;
- Nhấn giữ và di chuyển: Kéo thả Erii.

Khi khung nhập văn bản mở rộng, bàn phím ảo bật lên, xoay màn hình hoặc cửa sổ bị thu hẹp, pet sẽ tự giới hạn trong vùng nhìn thấy được và tránh đè lên khung nhập. Trên điện thoại, Sổ tay nhỏ, cửa sổ chat, Sổ tay đời sống và Ngôi nhà Pet đều kéo lên từ đáy màn hình, vuốt từ cạnh trên xuống để đóng; trên máy tính chúng là các cửa sổ nổi có thể kéo thanh tiêu đề, Sổ tay nhỏ luôn gắn liền bên cạnh pet và cố gắng không che khuất nhân vật.

### Kích thước pet (Điện thoại và Máy tính)

Trong mục «Tiện ích mở rộng» của SillyTavern, mở cài đặt của pet này ra và kéo thanh trượt **Kích thước pet**. Phạm vi từ **56–112 pixel**, mỗi nấc 4 pixel, hiển thị giá trị hiện tại ngay bên cạnh; nhấn **Khôi phục kích thước mặc định** để về **88 pixel**. Điện thoại và máy tính dùng chung một giá trị lưu trữ, được giữ nguyên sau khi làm mới. Những vùng hiển thị quá nhỏ sẽ tạm thời giới hạn kích thước để không bị tràn màn hình, cài đặt gốc sẽ không bị giảm bớt.

v1.0.1 đã loại bỏ giới hạn cố định 72 pixel trên điện thoại, khắc phục tình trạng kéo thanh trượt to lên nhưng hình ảnh không đổi. Vùng cảm ứng của thanh trượt được mở rộng, trên máy tính có thể focus vào thanh trượt rồi dùng phím mũi tên để tinh chỉnh, Home/End để đưa về nhỏ nhất/lớn nhất. Khi kéo liên tục, mỗi khung hình tối đa chỉ thực hiện sắp xếp lại (reflow) một lần. Đổi kích thước không làm kích hoạt tính năng tự động di chuyển.

### Phản hồi nhiệm vụ cơ sở dữ liệu

- Nhận nhiệm vụ: Giơ sổ tay lên;
- Đang xử lý nhiệm vụ: Ghi chép hồ sơ;
- Thành công: Trưng bày hồ sơ hoàn thành;
- Lỗi hoặc cảnh báo: Kiểm tra hồ sơ;
- Rảnh rỗi: Uống trà, đọc sách, gấp giấy, ôm vịt vàng, vươn vai, ngủ ngắn, v.v.

Bên cạnh động tác, pet còn nói một câu ở phía trên bong bóng nhiệm vụ: Nhận nhiệm vụ, đang xử lý (khoảng 15 giây đổi một câu), hoàn thành, gặp lỗi, bị bạn dừng lại đều có các nhóm thoại riêng; điền bảng, thúc đẩy cốt truyện và các nhiệm vụ khác sẽ có lời thoại khác biệt. Lời thoại thay đổi theo tính cách nhân vật, độ thân mật và tâm trạng, ví dụ khi bụng đói sẽ lẩm bẩm một câu rồi mới làm tiếp. Toàn bộ lời thoại đều là văn bản cục bộ định sẵn, không gọi API, không tốn phí. Dòng chữ nhỏ bên dưới vẫn là tiến độ thực tế do CSDL trả về (giữ nguyên cài đặt bản tóm tắt / bản đầy đủ). Mục “Nói chuyện khi làm nhiệm vụ” trong cài đặt tiện ích có thể tắt lời thoại này.

Khi gặp lỗi hoặc cảnh báo, bong bóng sẽ dừng lại lâu hơn một chút (khoảng 9 giây), kèm thêm nút **Đi xem thử**: Lỗi dạng giao tiếp (API, API key, hạn mức, quá thời gian...) sẽ mở mục API của CSDL, các lỗi khác sẽ mở nhật ký vận hành trong “Công cụ nâng cao”.

Phản hồi khi đang xử lý nhiệm vụ và thông báo thành công/lỗi luôn được ưu tiên hơn các động tác thư giãn cục bộ. Khi bong bóng cung cấp nút dừng của nhiệm vụ CSDL gốc, Erii sẽ hiển thị nút **Dừng nhiệm vụ**, nhấp vào sẽ gọi quy trình dừng ban đầu của CSDL; nếu CSDL không có chức năng dừng thì sẽ không hiển thị nút giả mạo. Mục tiêu dừng bám sát theo nhiệm vụ hiện tại của CSDL và được kiểm tra lại trước khi nhấn; nếu nhiệm vụ đã chuyển đổi, hệ thống sẽ nhắc xác nhận trước chứ không gọi thao tác của nhiệm vụ cũ. Thông báo dừng thất bại được giữ lại khoảng 8 giây, thông báo lỗi CSDL luôn ưu tiên hơn văn bản tiến độ thông thường. Khi bong bóng gốc chuyển sang truyện cười hoặc thông báo, tạm thời không có nhiệm vụ hiện hành, Erii sẽ hiển thị trạng thái chờ đồng bộ tiến độ, sau khi nhiệm vụ xuất hiện trở lại sẽ khôi phục nút dừng.

### Nhòm ngó mép màn hình và Câu chuyện chữa lành

- **Cách xuất hiện nhòm ngó:** Kéo Erii sát vào mép trái, phải, trên hoặc dưới màn hình, thả tay ra là nhân vật sẽ thụt vào mép và thò đầu ra nhòm ngó, không cần chờ 6 giây hay di chuột ra chỗ khác. Vị trí mặc định nếu đã sát mép cũng sẽ trực tiếp nhòm ngó. Mép dưới sẽ tự động né tránh thanh nhập liệu và xuất hiện ở phần dưới cùng của vùng khả dụng.
- **Vị trí có bị thay đổi không:** Hành động nhòm ngó chỉ thay đổi dáng vẽ và lắc lư nhẹ tại chỗ, không làm thay đổi vị trí đã lưu, cũng không khôi phục việc tự đi lại. Khi nhấp chuột, nhấn giữ, kéo thả, mở Sổ tay nhỏ hoặc nhận nhiệm vụ sẽ trở lại động tác tương ứng; rê chuột qua sẽ không làm hủy bỏ nhòm ngó. Sau khi tương tác xong nếu vẫn ở sát mép, pet sẽ tiếp tục nhòm ngó ngay.
- **Cách nghe kể chuyện:** Trong Sổ tay nhỏ, nhấp vào “Nghe một câu chuyện ngắn”. Bong bóng mở ra cứ mỗi 30 giây sẽ tự động đổi câu chuyện mới, luân phiên qua 12 câu chuyện, không lặp lại trong cùng một vòng; cũng có thể nhấn “Đổi câu chuyện khác” để đổi ngay, hoặc bấm dấu × để đóng. Sau khi đóng sẽ kết thúc chuỗi tự động đổi chuyện của vòng này.
- **Chủ động kể chuyện:** Tự động bắt đầu sau khi rảnh rỗi khoảng 5 phút; trong lúc hiển thị cứ mỗi 30 giây sẽ đổi một truyện. Khi rê chuột hoặc dùng bàn phím focus vào bong bóng thì thời gian đổi truyện sẽ tạm dừng, rời đi sẽ đếm tiếp thời gian còn lại; trên điện thoại chạm vào câu chuyện sẽ giữ nguyên trạng thái đọc, đọc xong có thể chủ động đổi truyện hoặc đóng lại.
- **Nhiệm vụ là ưu tiên hàng đầu:** Khi CSDL bắt đầu xử lý, gửi thông báo kết quả hoặc khi ẩn hiển thị Erii, câu chuyện sẽ tự thu gọn lại. Bong bóng nhiệm vụ và nút dừng của nhiệm vụ gốc luôn được ưu tiên; câu chuyện không gọi mô hình trò chuyện, không gửi tin nhắn chat và không ghi vào CSDL.
- **Công tắc bật/tắt:** Cài đặt tiện ích có thể tắt riêng biệt tính năng “Kéo sát mép màn hình để nhòm ngó” và “Kể câu chuyện chữa lành khi rảnh rỗi”. Sau khi tắt tự động kể chuyện lúc rảnh rỗi, bạn vẫn có thể nhấp thủ công “Nghe một câu chuyện ngắn”, trong lúc mở vẫn tự đổi truyện mỗi 30 giây như thường; quy tắc tạm dừng đọc vẫn có hiệu lực đầy đủ.

## Đổi Pet màn hình: Ngôi nhà Pet

Cách mở: Mục **Ngôi nhà Pet** ở đáy Sổ tay nhỏ, hoặc nút nhân vật và “Ngôi nhà Pet” trong **Cài đặt tiện ích → Pet Màn Hình CSDL**. Ngôi nhà Pet là một cuốn bách khoa toàn thư mở rộng: Trang trái là tranh vẽ minh họa, trang phải là hồ sơ nuôi dưỡng của nhân vật đó. Nhấp vào các thẻ đánh dấu sách ở phía trên để lật sang nhân vật khác, bấm **Mời cô ấy đồng hành** để đổi sang, nhân vật cũ sẽ vẫy tay rời sân khấu, nhân vật mới sẽ hạ cánh chào bạn.

| Nhân vật | Giới thiệu | Ghi chú |
| --- | --- | --- |
| Erii (Tiểu Hội) | Vu nữ tóc đỏ trầm lặng, thích vịt vàng nhỏ, bánh pudding và chơi game | Nhân vật mặc định, tư liệu và hành vi tương đương bản 0.7.1 |
| Zero | Thiếu nữ tóc vàng mắt lam băng, ít nói, làm việc cẩn trọng tỉ mỉ, trên đầu đội một chú thiên nga đen nhỏ | Phiên bản này bổ sung 26 ảnh (19 ảnh cốt lõi, 7 ảnh đời sống) |
| Naidan | Bé cưng màu vàng sữa đi kèm của CSDL, háu ăn, thích lăn lộn | Ảnh đọc trực tiếp từ CSDL tại thời điểm chạy; nếu CSDL chưa bật hoặc đã tắt pet tích hợp thì không thể chuyển sang, Ngôi nhà Pet sẽ ghi rõ lý do |

Sau khi đổi nhân vật:

- **Dùng chung**: Vị trí và kích thước của pet, các công tắc bật/tắt, ví tiền chung của gia đình.
- **Tách biệt riêng**: Lịch sử trò chuyện, cách xưng hô và thiết lập nhân vật, độ thân mật, chỉ số nhu cầu, nhật ký trưởng thành, biệt danh, công việc làm thêm hoặc bữa ăn đang thực hiện dở dang, trang phục sở hữu và đang mặc.
- Lần đầu trò chuyện với nhân vật mới sẽ kế thừa cài đặt kết nối của Erii (địa chỉ API, mô hình, độ dài phản hồi...); API key của API cấu hình riêng được lưu riêng theo nhân vật, cuộc hội thoại và địa chỉ máy chủ, điền vào hội thoại tương ứng khi cần. Nếu dùng API hiện tại của SillyTavern thì vẫn kế thừa kết nối có sẵn của SillyTavern.
- Nhân vật đang làm việc nếu bị đổi xuống sẽ tiếp tục làm việc ở chế độ chạy ngầm (background), đến giờ tan làm bong bóng của pet sẽ nhắc bạn đến nhận lương.

## Nuôi dưỡng

Mọi cơ chế nuôi dưỡng đều không có hình phạt: Độ thân mật chỉ tăng không giảm, chỉ số nhu cầu thấp chỉ ảnh hưởng đến tâm trạng và lời thoại, pet sẽ không bị ốm, không bỏ nhà đi và không bị hạn chế làm việc.

- **Độ thân mật**: Chia làm 5 cấp bậc: Mới quen, Thân quen, Gần gũi, Tin cậy, Tri kỷ; mỗi nhân vật tính riêng. Xoa đầu +1 (tối đa 20 lần/ngày), tặng hoa +5 (tối đa 3 lần/ngày), mời ăn cơm +3～+8, nhận lương +3, trò chuyện một lượt +2 (tối đa 20 lần/ngày), lần đầu gặp gỡ mỗi ngày +5, đồng hành hoàn thành một nhiệm vụ CSDL +2 (tối đa 20 lần/ngày), tắm rửa chải chuốt +2. Mỗi khi lên cấp sẽ mở khóa một nhóm lời thoại mới, một câu chuyện độc quyền và một danh hiệu.
- **Chỉ số nhu cầu**: Độ no từ đầy đến cạn mất khoảng 12 tiếng, độ vệ sinh mất khoảng 24 tiếng, khi bạn rời đi chỉ số cũng sẽ giảm dần từ từ. Độ no bù đắp bằng cách mời ăn cơm (Pudding +15, Cơm nắm +25, Cơm trứng cuộn +40, Mì ramen +50), độ vệ sinh dựa vào mục **Tắm rửa** trong Sổ tay nhỏ hoặc Ngôi nhà Pet (miễn phí, thời gian hồi chiêu 30 phút). Trong cài đặt tiện ích có thể tắt chỉ số nhu cầu, sau khi tắt chỉ số sẽ đóng băng và không hiển thị nữa.
- **Tâm trạng**: Lo lắng (CSDL vừa gặp lỗi), Đói bụng, Muốn tắm gội, Nhớ bạn (lâu rồi không quan tâm cô ấy), Vui vẻ, Bình yên. Tâm trạng chỉ quyết định lời thoại và con dấu tâm trạng trong Ngôi nhà Pet.
- **Nhật ký trưởng thành**: Mục **Nhật ký trưởng thành** trong Ngôi nhà Pet ghi lại các cột mốc ý nghĩa, ví dụ: Ngày đầu tiên quen nhau, lần đầu tiên ăn mì ramen, đồng hành hoàn thành nhiệm vụ CSDL thứ 100; các mẩu chuyện độc quyền đã mở khóa cũng được đọc tại đây.
- **Biệt danh**: Trong Ngôi nhà Pet, nhấp vào cây bút bên cạnh tên nhân vật để đặt biệt danh, cách xưng hô trên giao diện và trong lời thoại sẽ đổi theo, để trống sẽ khôi phục tên gốc.
- **Lời chào hàng ngày**: Lần đầu gặp nhau mỗi ngày, pet sẽ dựa theo buổi sáng, trưa, tối và mức độ thân mật giữa hai người để cất lời chào, đồng thời ghi nhận thêm 1 “Ngày đồng hành”.
- **Trợ cấp tối thiểu**: Khi ví tiền của gia đình còn dưới 5 xu vàng, mỗi ngày có thể nhận một lần 8 xu vàng trong Sổ tay đời sống, vừa đủ để mua một vắt cơm nắm.

Người dùng cũ khi nâng cấp, Erii sẽ tự động quy đổi số lần trò chuyện, làm việc và ăn uống sẵn có thành một mức độ thân mật ban đầu (tối đa đạt cấp “Thân quen”), mục “Ngày đầu tiên quen nhau” sẽ lấy theo bản ghi trò chuyện hoặc sổ thu chi sớm nhất.

## Một chạm mở giao diện Cơ sở dữ liệu

Cột “Cơ sở dữ liệu” trong Sổ tay nhỏ có một nhóm nút phím tắt: **Mở CSDL chính** (Dashboard), **Bàn làm việc điền bảng**, **Thúc đẩy cốt truyện**, **Quản lý dữ liệu**, **API**, **Xem bảng** (Bảng trực quan hóa của CSDL). Trong thanh nhiệm vụ của cửa sổ chat và Sổ tay đời sống cũng có nút **Mở CSDL**.

Việc mở CSDL sử dụng các hàm công khai `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()` của nó; nhảy đến một giao diện chỉ định tương đương với việc tiện ích nhấp hộ bạn vào mục đó trên thanh bên của CSDL, chỉ đổi trang chứ không đọc/ghi bảng hay gọi thao tác nhiệm vụ. Nếu một giao diện nào đó không hiển thị ở cấp bậc CSDL hiện tại của bạn, nút bấm sẽ chỉ mở CSDL và giải thích nguyên nhân; nếu không tìm thấy lối vào CSDL, Sổ tay nhỏ sẽ nhắc bạn bật CSDL trước.

## Giao diện và Hiệu ứng đặc biệt

Giao diện mang phong cách “Sổ tay bìa cứng thủ công”: Vân giấy, đường kẻ mạ vàng thanh mảnh, băng dính washi và con dấu, ba nhân vật có ba bộ màu sắc riêng. Mục **Hiệu ứng đặc biệt** trong cài đặt tiện ích có 4 tùy chọn: Tự động (máy tính lộng lẫy, điện thoại tối giản), Lộng lẫy, Tối giản, Tắt. Mức lộng lẫy sẽ thả cánh hoa, bông tuyết hoặc ngôi sao khi tặng hoa, lên cấp, đổi nhân vật; trang tranh vẽ của Ngôi nhà Pet sẽ có ánh sáng cực quang chuyển động chậm rãi; mức tối giản chỉ giữ lại một lượng hạt nhỏ; tự động tắt khi hệ thống bật chế độ “Giảm hiệu ứng động”. Khi chuyển trang web xuống nền hoặc đóng bảng điều khiển, tất cả hình ảnh động sẽ dừng lại.

## Làm việc, Kiếm tiền và Ăn uống

Nhấp chuột phải trên máy tính / Nhấn giữ trên điện thoại để mở Sổ tay nhỏ, nhấp vào **Sổ tay đời sống**; cũng có thể mở từ cài đặt tiện ích. Đầu cửa sổ có thể chọn nhân vật nào sẽ tham gia: Ví tiền là “ví tiền gia đình” dùng chung cho tất cả nhân vật; làm việc, ăn uống và đổi trang phục tính riêng theo từng nhân vật, các nhân vật khác nhau có thể đồng thời đến những nơi khác nhau. Sổ tay gồm 4 trang: **Đi làm việc**, **Ăn món ngon**, **Tủ đồ**, **Sổ thu chi nhỏ**.

### Công việc và Tiền lương

| Công việc | Làm gì | Thời gian | Tiền lương |
| --- | --- | --- | --- |
| Hiệu sách | Xếp sách mới về lên kệ | 1 phút | 10 xu vàng |
| Tiệm bánh ngọt | Chuẩn bị món tráng miệng nhỏ | 2 phút | 18 xu vàng |
| Tiệm hoa | Cắm hoa, thay nước cho hoa | 3 phút | 25 xu vàng |

1. Chọn công việc trong trang **Đi làm việc**. Mỗi lần chỉ thực hiện một hoạt động.
2. Sổ tay và bong bóng của pet hiển thị thời gian còn lại, pet đổi sang hình vẽ công việc tương ứng, nhẹ nhàng thở tại chỗ.
3. Sau khi hết giờ làm việc, nhấp **Nhận lương**. Bạn cũng có thể đóng Sổ tay lại và nhận trực tiếp từ bong bóng tan ca của pet.
4. Cùng một nhân vật phải nhận xong tiền lương thì mới có thể bắt đầu công việc tiếp theo hoặc mua thức ăn. Tiền lương chưa nhận sẽ được lưu giữ mãi mãi, không có hạn chót nhận.

**Nghỉ làm sớm** cần nhấp xác nhận thêm một lần nữa: Dừng công việc hiện tại, không có lương nhưng cũng không bị trừ xu vàng sẵn có. Công việc đã hoàn thành có thể nhận trực tiếp, không thể hủy nhầm.

### Mời Pet ăn cơm

| Món ăn | Giá cả | Thời gian ăn |
| --- | --- | --- |
| Pudding | 5 xu vàng | 8 giây |
| Cơm nắm | 8 xu vàng | 9 giây |
| Cơm trứng cuộn | 15 xu vàng | 10 giây |
| Mì Ramen | 20 xu vàng | 12 giây |

Mua trong trang **Ăn món ngon**, xác nhận thao tác sẽ trừ xu vàng và bắt đầu ăn cơm, ăn xong độ no sẽ tăng lên. Khi số dư không đủ hoặc đang bận hoạt động khác, nút mua sẽ bị vô hiệu hóa. Ăn xong sẽ được ghi vào Sổ thu chi nhỏ; 4 loại thức ăn đều có hình ảnh ăn uống độc lập riêng: Pudding dùng thìa nhỏ ăn bánh pudding caramel, cơm nắm dùng tay cầm cơm nắm bọc rong biển, cơm trứng dùng thìa xúc cơm trứng vàng ươm, mì ramen dùng đũa gắp mì. Thẻ gọi món, tranh minh họa trên sổ tay và pet trôi nổi đều sử dụng hình ảnh tương ứng. Chỉ số nhu cầu chỉ ảnh hưởng đến tâm trạng và lời thoại, không có hình phạt bỏ đói hay ép ăn.

### Cửa hàng và Thay trang phục (Skin)

**Cửa hàng** dùng để xem trang phục, nhập mật ngữ hoặc đổi vé hoa để mua. Có thể mở bằng một trong các cách sau:

- Mục **Cửa hàng · Mua trang phục mới** trong Sổ tay nhỏ;
- **Cài đặt tiện ích → Pet Màn Hình CSDL → Cửa hàng · Mua trang phục**;
- **Sổ tay đời sống → Tủ đồ → Đến cửa hàng mua trang phục**.

Phía trên Cửa hàng có thể chọn Erii hoặc Zero. Bộ Dạ Lễ Nguyệt Độc của Erii mua bằng vé hoa, bộ Hoàng Nữ của Zero mở khóa bằng mật ngữ; bộ của Zero không hiển thị khu vực đổi vé và không trừ bất kỳ loại tiền nào. Cả hai đều có thể xem trước 4 dáng điệu: Ngồi, Vẫy tay, Ôm vịt/Ôm thiên nga và Ăn pudding. Sau khi sở hữu, hãy vào Tủ đồ của nhân vật tương ứng để thay thủ công.

**Tủ đồ** nằm ở trang thứ ba **Tủ đồ** của Sổ tay đời sống; nút **Đổi trang phục cho cô ấy** trong Ngôi nhà Pet cũng có thể dẫn thẳng vào đây. Nơi này hiển thị trang phục mặc định và các bộ trang phục đã mua. Mỗi nhân vật luôn vĩnh viễn sở hữu một bộ trang phục mặc định miễn phí.

Trang phục mới của Erii trong phiên bản này là **Tsukuyomi · Dạ Lễ Nguyệt Độc**, chỉ có Erii mới mặc được:

| Nội dung | Số lượng |
| --- | --- |
| Giá trang phục | 10.320 vé hoa |
| Tỷ lệ quy đổi | 1 xu vàng → 40 vé hoa |
| Tích lũy đủ bộ từ 0 vé hoa | 258 xu vàng |
| Sở hữu ban đầu | Chưa, cần mua |

1. Đi làm việc, sau khi kết thúc hãy nhận lương thủ công.
2. Mở Cửa hàng, nhấp vào **Đến đổi vé hoa** ở phía dưới để chuyển đến khu vực quy đổi, nhập số lượng xu vàng nguyên dương. Bên cạnh sẽ hiển thị đổi được bao nhiêu vé hoa; cũng có thể bấm **Điền số xu vàng cần để mua đồ**, nút này chỉ điền số hộ bạn chứ không trừ tiền.
3. Nhấp **Đổi vé hoa**, lúc này mới trừ xu vàng và cộng vé hoa. Không đủ xu hoặc số lượng không hợp lệ sẽ không đổi được; vé hoa không thể đổi ngược lại thành xu vàng, số vé hoa còn dư sẽ được giữ nguyên.
4. Khi đã đủ vé hoa, nhấp vào nút **Mua trang phục · 10320 vé hoa** ở đáy Cửa hàng. Chỉ mua một lần duy nhất, không tự động mặc lên và không trừ tiền lặp lại.
5. Nhấp **Vào tủ đồ để mặc**, trong tủ đồ nhấp vào nút **Mặc lên** của bộ trang phục này. Sau đó bạn có thể đổi về trang phục mặc định miễn phí bất kỳ lúc nào rồi mặc lại bộ này.

- Trang phục mới bao gồm 16 động tác chờ/nhiệm vụ/tương tác, 4 tư thế nhòm ngó mép màn hình, 3 động tác đi làm, 4 hình ảnh ăn uống riêng biệt, tổng cộng 27 ảnh. Pet, ảnh đại diện Sổ tay và trò chuyện, tranh sinh hoạt, menu gọi món, tranh minh họa Ngôi nhà Pet đều đổi ảnh theo; bong bóng của pet và Sổ tay đời sống sẽ dùng tông màu tím nhạt.
- Tạo hình giữ lại găng tay lụa mỏng, nơ bướm màu tím ở cổ và giày. Động tác ôm vịt chỉ giữ lại chú vịt trong lòng, các động tác khác giữ lại chú vịt vàng nhỏ trên đỉnh đầu; hình ảnh trang phục mặc định không bị thay đổi.
- Xu vàng và vé hoa thuộc ví tiền chung của gia đình; trang phục thuộc quyền sở hữu riêng theo từng nhân vật, mua cho Erii sẽ không dùng được cho Zero hay Naidan. Đổi nhân vật, làm mới, đóng cửa sổ đều được lưu lại nguyên vẹn.
- Việc thay trang phục không chiếm dụng thời gian làm việc hay ăn uống; lúc CSDL đang bận vẫn có thể đổi vé và thay đồ bình thường. Không phát sinh thêm yêu cầu API hay việc tự ý đi lại.
- Danh mục trang phục thanh toán bằng xu vàng kiểu cũ vẫn tương thích; trường `currency: 'tickets'` trong danh mục đại diện cho thanh toán bằng vé hoa, nếu không ghi sẽ tiếp tục xử lý theo xu vàng.

### Lưu trữ và Nhiệm vụ Cơ sở dữ liệu

- Ví tiền khởi đầu với 0 xu vàng, 0 vé hoa, chưa sở hữu trang phục mới. Công việc do bạn chủ động bấm bắt đầu, không tự động nhận việc tiếp theo hoặc treo máy kiếm tiền vô hạn; khi sắp hết tiền có thể nhận trợ cấp một lần.
- Xu vàng, vé hoa, lịch sử đổi và chi tiêu vé hoa, hoạt động hiện tại, tổng số lần làm việc / ăn uống tích lũy và 20 bản ghi sổ thu chi gần nhất đều được lưu trong cài đặt tiện ích của tài khoản SillyTavern hiện tại; trang phục sở hữu và đang mặc cũng lưu tại đó (trường `skins`), tách riêng theo từng nhân vật.
- Công việc đã bắt đầu sẽ tính giờ theo thời gian thực của thiết bị. Khi đóng cửa sổ, làm mới hoặc tạm rời đi, lúc quay lại sẽ tiếp tục đếm giờ hoặc hiển thị trạng thái chờ nhận lương; bữa ăn đã hoàn thành khi offline chỉ thanh toán một lần duy nhất, không trừ tiền lặp lại.
- Khi nhiệm vụ CSDL xuất hiện, động tác, bong bóng và nút dừng của nhiệm vụ gốc luôn được ưu tiên; Sổ tay đời sống và Cửa hàng cũng cung cấp thao tác dừng của CSDL gốc. Công việc đã bắt đầu vẫn đếm giờ như thường, sau khi nhiệm vụ CSDL kết thúc mới bắt đầu công việc mới hoặc mua thức ăn.
- Trò chuyện, Sổ tay đời sống, Cửa hàng, Ngôi nhà Pet và Sổ tay nhỏ đều mở độc lập. Lối chơi đời sống không gọi API, không sửa đổi CSDL hay văn bản SillyTavern. Không khôi phục tự động di chuyển.
- Bản này là lối chơi cá nhân nhẹ nhàng lưu trong cài đặt tài khoản, chống việc nhận trùng / trừ tiền trùng lặp trên cùng một trang; không có dịch vụ giao dịch ví tiền đồng thời đa thiết bị.

## Trò chuyện cùng Pet màn hình

Mỗi nhân vật có lịch sử trò chuyện, cách xưng hô và thiết lập tính cách riêng, đổi nhân vật sẽ không làm lẫn lộn lịch sử. Thiết lập của Zero được soạn thảo dựa trên tính cách nguyên tác «Long Tộc», Naidan là người bạn nhỏ tràn đầy năng lượng và háu ăn (mối quan hệ mặc định là “Bạn đồng hành”), bạn hoàn toàn có thể tự chỉnh sửa trong `characters/` theo ý mình.

1. Nhấp chuột phải vào pet trên máy tính, hoặc nhấn giữ khoảng 1.4 giây trên điện thoại để mở Sổ tay nhỏ, nhấp vào **Trò chuyện cùng Tiểu Hội** (đổi sang Zero hay Naidan nút sẽ đổi tên theo). Bạn cũng có thể mở trực tiếp cửa sổ chat trong cài đặt tiện ích.
2. Mặc định là **Sử dụng API hiện tại của SillyTavern**, kế thừa kết nối, mô hình và API key hiện tại. Hãy cấu hình sẵn kết nối Chat Completion hoặc Text Completion khả dụng trong SillyTavern trước.
3. Nhập tin nhắn và nhấn **Gửi**. Trên máy tính: Enter để gửi, Shift+Enter để xuống dòng; trên điện thoại: Enter để xuống dòng, dùng nút Gửi để gửi tin.
4. Nút **Dừng phản hồi** sẽ hủy yêu cầu lần này của pet; nút **Thử lại** để gửi lại nội dung chat chưa nhận được phản hồi. Đóng cửa sổ hoặc tắt tiện ích cũng sẽ hủy bỏ các yêu cầu trò chuyện chưa hoàn thành.
5. Nhấp vào **Cài đặt kết nối** để điều chỉnh cách xưng hô, mối quan hệ, phong cách trò chuyện, độ dài phản hồi và những điều muốn pet ghi nhớ, hoặc chuyển sang **Cấu hình API riêng (Tương thích OpenAI)**.

### Cấu hình API riêng

Điền địa chỉ Base URL của API (ví dụ `https://api-cua-ban/v1`) và API Key, nhấp vào **Lấy danh sách mô hình**, chọn trong danh sách **Mô hình khả dụng**, xác nhận **Tên mô hình** bên dưới rồi nhấp **Lưu cài đặt**.

Bạn vẫn có thể tự điền tên mô hình bằng tay; một số nhà cung cấp không hỗ trợ danh sách mô hình, việc lấy danh sách thất bại không đồng nghĩa với việc cổng chat không dùng được. Trong quá trình lấy danh sách có thể nhấp **Hủy lấy danh sách**. Thay đổi địa chỉ hoặc API key sẽ hủy yêu cầu cũ và xóa danh sách cũ; đóng cửa sổ hoặc tắt tiện ích cũng sẽ hủy bỏ việc lấy danh sách. Danh sách được lọc trùng và sắp xếp theo Model ID, việc chọn trong danh sách này không làm thay đổi mô hình toàn cục của SillyTavern.

Chế độ **Sử dụng API hiện tại của SillyTavern** sẽ bám theo mô hình hiện tại của SillyTavern; khi cần chọn riêng, hãy chuyển sang **Cấu hình API riêng**.

Nếu đã điền đầy đủ cả đuôi `/chat/completions`, hệ thống sẽ tự động nhận diện Base URL. Kết nối riêng biệt của bản này hỗ trợ các API Chat Completion chuẩn tương thích OpenAI; các API gốc của Claude / Gemini có thể sử dụng thông qua kết nối hiện tại của SillyTavern.

Yêu cầu được chuyển tiếp thông qua thiết bị đang chạy SillyTavern, trình duyệt chỉ kết nối với SillyTavern. Nếu điền `localhost`, nó chỉ thiết bị đang chạy máy chủ SillyTavern. Nút **Kiểm tra kết nối** sẽ gửi một yêu cầu ngắn và có thể bị trừ phí; nội dung kiểm tra không được đưa vào lịch sử trò chuyện.

Mặc định API key chỉ lưu trong bộ nhớ tạm của cửa sổ hội thoại hiện tại; khi làm mới trang, tắt tiện ích hoặc đổi pet sẽ cần điền lại. Tích chọn **Ghi nhớ khóa trên thiết bị này** để lưu vào bộ nhớ trình duyệt theo từng nhân vật, từng hội thoại và từng địa chỉ API; nếu bỏ tích và lưu lại, hệ thống chỉ xóa khóa đã lưu của đúng hội thoại này tại địa chỉ này, không xóa khóa của các hội thoại khác. API key không bao giờ bị ghi vào cài đặt tiện ích, prompt trò chuyện, tệp lịch sử xuất ra hay gói cài đặt.

Bản cũ dùng chung một khóa API. Nếu các địa chỉ đã lưu trùng nhau, hệ thống sẽ di chuyển về vị trí lưu tương ứng và xóa mục dùng chung cũ; nếu bản ghi cũ chứa nhiều địa chỉ mà không xác định được thuộc về cái nào, hệ thống sẽ nhắc bạn điền lại trong hội thoại tương ứng chứ không tự động gửi khóa không rõ nguồn gốc đến API. Khóa đã bị ghi đè ở bản cũ không thể khôi phục lại.

### Thao tác tin nhắn và Bản nháp

- **Sao chép**: Mọi tin nhắn đều có thể sao chép. Nếu trình duyệt chặn tự động sao chép, bạn vẫn có thể bôi đen văn bản để sao chép thủ công.
- **Trả lời lại**: Nằm bên dưới tin nhắn phản hồi thành công cuối cùng, nhằm trả lời lại cùng một câu hỏi. Chỉ sau khi phản hồi mới thành công thì mới thay thế phản hồi cũ; nếu hủy hoặc gặp lỗi sẽ giữ nguyên bản ghi ban đầu. Không lưu trữ nhiều nhánh câu trả lời phụ.
- **Sửa để gửi lại**: Chỉnh sửa tin nhắn gần nhất của người dùng, rồi tạo lại phản hồi cho lượt này. Cũng chỉ cập nhật bản ghi cũ sau khi đã thành công. Nhấp “Hủy sửa” sẽ khôi phục lại nội dung nháp trước khi vào chế độ sửa.
- **Lưu bản nháp**: Cả bản nháp thông thường và bản nháp đang chỉnh sửa đều được lưu lại. Đóng cửa sổ rồi mở lại hoặc làm mới trang vẫn có thể viết tiếp.
- **Xuất dữ liệu**: Mặc định xuất file JSON, giữ lại nội dung chính của hội thoại hiện tại, mốc thời gian và phần suy nghĩ do API trả về, có thể nhập lại sau này. Trong mục «Quản lý → Định dạng xuất» có thể đổi sang file TXT để tiện đọc. Cả hai đều không chứa cài đặt kết nối, API key hay ghi nhớ thủ công. Lịch sử bảo trì vẫn xuất dưới dạng TXT.
- **Nhập dữ liệu**: Nhấp «Nhập» ở phía trên, chọn tệp, đối chiếu số lượng tin nhắn rồi bấm «Lưu thành hội thoại mới». Không ghi đè lên bản ghi cũ, cũng không tự động gửi tin nhắn hay thực thi các phiếu sửa đổi CSDL có trong nội dung nhập vào.
- **Xóa sạch lịch sử**: Cần nhấp xác nhận thêm một lần nữa. Xóa lịch sử chat không làm mất cài đặt kết nối và trí nhớ thủ công; hai mục này có thể tự điều chỉnh trong cài đặt kết nối.

Tin nhắn hiển thị ảnh đại diện và thời gian; tin nhắn từ bản cũ không có thời gian vẫn đọc được bình thường, không tự ý bịa đặt thời gian gửi. Khi chờ API sẽ hiển thị “Erii đang viết câu trả lời...”, sau khi có kết quả mới hiển thị đầy đủ; phiên bản này vẫn dùng cơ chế phản hồi không stream (non-streaming).

Khi đang xem lại tin nhắn cũ, phản hồi mới xuất hiện sẽ không bị ép cuộn xuống đáy, nhấp vào “Về tin nhắn mới nhất” là có thể quay lại. Trên máy tính có thể dùng biểu tượng ↔ trên thanh tiêu đề để mở rộng cửa sổ, hoặc kéo thanh tiêu đề; trên điện thoại khung nhập liệu tự tăng chiều cao theo nội dung đến mức giới hạn và chừa khoảng trống cho bàn phím ảo.

Khi lịch sử trống, 3 nút chủ đề gợi ý chỉ điền nội dung vào khung nháp để bạn kiểm tra rồi bấm gửi, không tự động phát yêu cầu.

### Nhiều cuộc hội thoại độc lập

- Nút «Hội thoại mới» ở trên cùng sẽ mở một cuộc trò chuyện trống, chỉ kế thừa kết nối, xưng hô, mối quan hệ và trí nhớ thủ công tại thời điểm tạo, không sao chép lịch sử hay bản nháp. Mọi chỉnh sửa cài đặt sau đó đều được lưu riêng.
- Danh sách ở trên cùng cho phép chuyển đổi qua lại giữa các hội thoại ngay trong cùng một cửa sổ, việc tạo mới và nhập dữ liệu cũng dùng chung cửa sổ này. Vị trí cửa sổ sau khi kéo và kích thước sau khi mở rộng được giữ nguyên, khi chuyển lại vẫn giữ đúng vị trí đang đọc và bản nháp; các hội thoại không hiển thị vẫn tiếp tục chờ nhận phản hồi ngầm.
- Nút «Dừng phản hồi» chỉ dừng hội thoại hiện tại; khi đóng toàn bộ cửa sổ chat hoặc mở giao diện chính khác, hệ thống sẽ dừng tất cả các phản hồi chat đang chờ của nhân vật này. Đổi pet sẽ dừng các yêu cầu của nhân vật cũ nhưng giữ nguyên lịch sử; khi chuyển về có thể trò chuyện tiếp.
- Trong mục «Quản lý» có thể đổi tên, hoặc xác nhận lần nữa để xóa các hội thoại mới thêm; cuộc «Hội thoại ban đầu» được giữ lại và có thể xóa trắng riêng. Mỗi nhân vật tối đa có 20 cuộc hội thoại, mỗi hội thoại lưu tối đa 100 tin nhắn, khoảng 128.000 ký tự (tổng cả nội dung và suy nghĩ).
- Khi chiều cao hiển thị trên điện thoại quá nhỏ, thanh công cụ kết nối, chế độ chat và phạm vi bảo trì sẽ được thu gọn vào mục «Quản lý» để nhường chỗ cho nội dung và khung gửi; khi chiều cao trở lại bình thường sẽ hiển thị về chỗ cũ.

### Nội dung suy nghĩ và Định dạng nhập liệu

Mặc định thu gọn các trường `reasoning_content`, `reasoning`, các khối nội dung suy nghĩ do API trả về, cũng như các thẻ `<think>` / `<thinking>` / `<analysis>` / `<reasoning>` nằm trong nội dung. Nhấp vào «Quá trình suy nghĩ» để mở rộng xem dưới dạng văn bản. Nếu mô hình chỉ trả về suy nghĩ mà không có nội dung chính, hệ thống sẽ nhắc tăng độ dài phản hồi tối đa rồi thử lại.

Hỗ trợ JSON của chính plugin này, cũng như file SillyTavern JSONL / mảng tin nhắn `user`, `assistant` chứa tin nhắn văn bản. File JSON được nhận diện là của pet khác sẽ có thông báo nhắc đổi nhân vật. File TXT bản cũ dựa vào tên nhân vật và dòng thời gian xuất ra ban đầu, nếu định dạng mơ hồ hoặc bị chỉnh sửa nhiều có thể sẽ không nhận diện được; các bản sao lưu mới nên ưu tiên chọn JSON. File TXT xuất từ chế độ bảo trì không phải là định dạng dùng để nhập chat.

Mỗi tệp giới hạn tối đa 2 MB, 100 tin nhắn, tổng cộng 128.000 ký tự, một tin nhắn đơn giới hạn 16.000 ký tự nội dung và 32.000 ký tự suy nghĩ. Nếu vượt quá giới hạn, tệp hỏng hoặc không rõ loại nhân vật, hệ thống sẽ báo thẳng nguyên nhân chứ không âm thầm vứt bỏ một nửa dữ liệu. Nhập dữ liệu không tiếp nhận cài đặt kết nối, API key, trí nhớ hay các phiếu sửa đổi có thể thực thi.

### Phong cách trò chuyện và Trí nhớ thủ công

Điều chỉnh trong **Cài đặt kết nối → Bạn và Tiểu Hội**:

- **Tán gẫu tự nhiên**: Quyết định độ dài theo chủ đề, phản hồi nội dung cụ thể.
- **Đồng hành ngắn gọn**: Thường từ một đến ba câu, tránh mở rộng lan man.
- **Trao đổi chi tiết**: Giải thích đầy đủ khi hỏi nghiêm túc, giữ nét tự nhiên trong giao tiếp hàng ngày.
- **Điều muốn Tiểu Hội ghi nhớ**: Tối đa 2.000 ký tự, có thể viết thói quen xưng hô, sở thích và tình hình gần đây; sau khi lưu, mỗi yêu cầu gửi đi đều sẽ mang theo, có thể sửa đổi hoặc xóa trắng bất cứ lúc nào.

Đây là dữ liệu do bạn tự tay quản lý, không tự động trích xuất từ cuộc trò chuyện, không gọi thêm mô hình tóm tắt và không đọc CSDL hay văn bản SillyTavern. Phong cách được thể hiện qua prompt, phản hồi thực tế vẫn phụ thuộc vào mô hình bạn chọn; “Giới hạn độ dài phản hồi” vẫn dùng để khống chế độ dài đầu ra.

### Prompt và Bản ghi

Prompt tích hợp sẵn được tinh chỉnh từ các mục `opt_mode_chat`, khí chất tính cách trong preset Erii do người dùng cung cấp; mặc định là mối quan hệ người yêu, có thể tự chỉnh thành bạn bè hoặc mối quan hệ khác. Sử dụng văn bản thuần túy, không phụ thuộc vào macro preset, lorebook/world info, regex hay script cốt truyện của SillyTavern. Tệp duy trì là `chat-prompt.js`.

Lịch sử trò chuyện được lưu riêng trong cài đặt tiện ích của tài khoản SillyTavern hiện tại, tối đa 100 tin nhắn, khoảng 128.000 ký tự. Mỗi yêu cầu chỉ mang theo tối đa 40 tin nhắn gần nhất, khoảng 24.000 ký tự; không tự động mang theo văn bản chính của SillyTavern, thẻ nhân vật, lorebook hay bảng CSDL. Thao tác **Xóa sạch lịch sử** cần bấm xác nhận thêm một lần.

Cửa sổ chat hiển thị độc lập, trên máy tính có thể kéo thanh tiêu đề, trên điện thoại tự co giãn theo màn hình nhìn thấy. Khi Erii chờ phản hồi sẽ thực hiện động tác ghi chép tại chỗ, nhận được phản hồi sẽ vẫy tay; trong lúc chat sẽ tạm dừng câu chuyện tự động cục bộ. Nhiệm vụ CSDL hiển thị ở phía trên cửa sổ chat và có nút **Dừng nhiệm vụ** độc lập.

### Phạm vi hỗ trợ của API hiện tại

- Kết nối Chat Completion của SillyTavern: Kế thừa nhà cung cấp, mô hình và khóa máy chủ hiện tại, bao gồm các nguồn Claude, Gemini, OpenRouter đã cấu hình trong SillyTavern; bản này dùng cơ chế phản hồi không stream, hiển thị trạng thái khi chờ đợi.
- Kết nối Text Completion `textgenerationwebui` của SillyTavern: Sử dụng bộ tạo tham số gốc và backend tương ứng.
- Các kết nối Kobold, Horde, NovelAI tạm thời chưa hỗ trợ chuyển đổi chat độc lập, hệ thống sẽ nhắc rõ ràng chuyển đổi kết nối hoặc dùng cấu hình riêng.
- Phiên bản 1.14.0 dùng yêu cầu quiet độc lập gốc của bản đó; độ dài đầu ra tối đa kế thừa theo cài đặt hiện tại của SillyTavern. Phiên bản 1.15.0–1.19.0 dùng bản sao cài đặt của bộ tạo tham số, có thể dùng độ dài phản hồi riêng của Erii mà không làm thay đổi cài đặt hiện tại của SillyTavern.

## Bảo trì cơ sở dữ liệu (Chế độ bảo trì trong cửa sổ Chat)

Khi xảy ra lỗi điền bảng, bảng dữ liệu không khớp với cốt truyện, bạn có thể nhờ pet xem giúp.

1. Mở cửa sổ chat, nhấp vào mục **Bảo trì cơ sở dữ liệu** ở trên cùng (nhấp lại vào **Tán gẫu** để về trò chuyện thường ngày; bản ghi hai bên lưu riêng, dữ liệu bảo trì không bị lẫn vào chat thường ngày).
2. Phía trên cửa sổ ghi rõ lần này pet có thể nhìn thấy những gì: **Toàn bộ bảng dữ liệu**, **Mấy tầng văn bản gần nhất** (chọn trong danh sách thả xuống từ 0～10 tầng, mặc định 3 tầng) và **Các lỗi gần nhất** (thông báo lỗi / cảnh báo do CSDL gửi tới, tối đa 5 thông báo).
3. Nói thẳng chỗ nào chưa đúng, hoặc nhấp vào **Kiểm tra giúp tôi một chút**. Pet sẽ dùng giọng điệu của mình để giải thích những gì nhìn thấy; nếu cần sửa đổi, bên dưới câu trả lời sẽ đính kèm một **Phiếu chỉnh sửa**.
4. Trong phiếu chỉnh sửa, mỗi mục đều ghi rõ vị trí (bảng nào, hàng thứ mấy, cột nào), giá trị cũ → giá trị mới, và lý do. Mọi mục **mặc định đều không tích chọn**. Các mục không vượt qua kiểm tra đối chiếu (viết sai tên bảng, tên cột, hàng không tồn tại, giá trị mới giống hệt cũ, xung đột với mục khác) sẽ được đánh dấu nguyên nhân và không thể tích chọn.
5. Tích chọn các mục muốn áp dụng, bấm **Áp dụng mục đã chọn (N vị trí)**. Trước khi ghi, toàn bộ bảng dữ liệu sẽ được sao lưu; sau đó tiến hành ghi từng mục theo thứ tự: “Sửa hàng sẵn có → Xóa hàng → Thêm hàng → Chuyển đổi preset thúc đẩy cốt truyện → Điền bảng lại”; phía sau mỗi mục sẽ hiển thị thành công hay nguyên nhân không ghi được.
6. Sau khi ghi xong có thể bấm **Hoàn tác** để khôi phục bảng dữ liệu về trạng thái trước khi ghi (preset cốt truyện đã chuyển đổi cũng sẽ được chuyển về lại); cũng có thể bấm **Tải bản sao lưu** để tải về một tệp JSON của bảng dữ liệu.

Những việc Phiếu chỉnh sửa có thể làm:

- **Sửa ô**, **Sửa cả hàng**, **Thêm một hàng**, **Xóa một hàng**: Ghi thông qua các API công khai của CSDL gồm `updateCell`, `updateRow`, `insertRow`, `deleteRow`, cùng chung đường dẫn lưu trữ như khi bạn sửa bảng thủ công trong CSDL. Các hàng, cột, ô bị khóa sẽ bị CSDL từ chối, ở đây sẽ hiển thị trung thực là “Không thể ghi vào”.
- **Chuyển đổi preset cốt truyện**: Chuyển cuộc trò chuyện hiện tại sang một preset thúc đẩy cốt truyện có sẵn khác (`switchPlotPreset`).
- **Điền bảng lại**: Bảo CSDL điền bảng lại một lần nữa theo cài đặt hiện tại của nó (`manualUpdate`). Thao tác này sẽ gọi API điền bảng bạn đã cấu hình trong CSDL, tính phí như lúc điền bảng bình thường.

Để đảm bảo có thể hoàn tác, một số việc cố tình **KHÔNG** làm:

- **Không sửa nội dung của preset cốt truyện, cũng không lưu thành bản sao khác.** Giao diện nhập preset của CSDL sẽ tiện tay chuyển cuộc trò chuyện hiện tại sang “Chế độ gọi lại LLM (LLM Recall Mode)”, trong khi API công khai lại không có cách xóa preset hay chuyển ngược lại chế độ cũ, một khi đã ghi là không thể hoàn tác. Khi cần sửa nội dung preset, pet sẽ giải thích rõ trong câu trả lời cần sửa những gì, bạn hãy tự vào trang **Thúc đẩy cốt truyện** của CSDL để sửa (trên Sổ tay nhỏ có sẵn nút một chạm mở trang này).
- Không đề xuất xóa toàn bộ bảng, làm trống bảng hoặc viết lại hàng loạt quy mô lớn; một phiếu chỉnh sửa tối đa 12 mục.
- Không tự động áp dụng, cũng không tự ý ghi khi bạn chưa bấm xác nhận.

Quy tắc an toàn:

- Trước khi ghi mỗi mục đều sẽ đối chiếu lại lần nữa: Nếu ô đó đã bị thay đổi trước khi bạn xác nhận, hoặc hàng đó không còn nữa thì sẽ không ghi và nêu rõ lý do. Việc tìm hàng dựa theo `row_id` của CSDL, nên việc xóa hàng hay thêm hàng sẽ không làm các mục phía sau sửa nhầm hàng.
- Chỉ áp dụng và hoàn tác trong đúng cuộc trò chuyện đã tạo ra phiếu chỉnh sửa đó; đổi sang cuộc trò chuyện khác sẽ bị từ chối.
- Khi hoàn tác, nếu phát hiện sau khi ghi bảng dữ liệu lại bị thay đổi tiếp (ví dụ CSDL tự điền bảng thêm một lần nữa), hệ thống sẽ cảnh báo trước “Hoàn tác sẽ rút lại cả những thay đổi này”, người dùng phải bấm **Vẫn muốn hoàn tác** thì mới thực thi.
- Bản sao lưu được lưu trữ trong trình duyệt của thiết bị này (IndexedDB), mỗi thiết bị giữ lại 10 bản gần nhất, làm mới trang vẫn có thể hoàn tác. Nếu trình duyệt không cho phép lưu trữ cục bộ, bản sao lưu chỉ nằm trong phiên mở trang lần này, giao diện sẽ nhắc bạn tải về một bản trước.
- Khi CSDL đang bận xử lý nhiệm vụ, nút **Áp dụng mục đã chọn** tạm thời không khả dụng, hãy đợi nó làm xong rồi hãy áp dụng.

Quá trình bảo trì sẽ gửi bảng dữ liệu, các lỗi gần nhất cùng số tầng văn bản bạn đã chọn đến API dùng để trò chuyện với pet (chính là API trong mục **Cài đặt kết nối** của cửa sổ chat). Khi bảng quá lớn, hệ thống sẽ tự động lược bỏ các hàng cũ hơn trong bảng dài nhất và ghi chú rõ trong tư liệu gửi đi.

## Quan sát đồng hành

Sau khi bật, pet sẽ như ngồi bên cạnh màn hình cùng bạn đọc truyện, cứ cách vài tầng lại đưa ra một hai câu cảm nhận.

- Trong **Cài đặt tiện ích → Đồng hành và Bảo trì**, bật mục **Quan sát đồng hành** (mặc định tắt), sau đó chọn **Tần suất bình luận** (mỗi 1～20 tầng, mặc định mỗi 4 tầng).
- Chỉ đếm các tầng mới xuất hiện sau khi bật tính năng: Đổi cuộc trò chuyện sẽ đếm lại từ đầu, xóa bớt tầng không bị trừ ngược, trượt để tạo lại phản hồi (số tầng không đổi) không tính là tầng mới. Các tầng bị ẩn không được tính và không bị đọc.
- Khi số tầng mới đã đủ và nhân vật đã viết xong câu trả lời, hệ thống đợi 4 giây rồi mới quyết định; hai lần bình luận cách nhau tối thiểu 60 giây. Nếu CSDL đang bận điền bảng, hệ thống đợi tối đa 30 giây, nếu vẫn bận thì lượt này tạm thời bỏ qua, đợi tầng tiếp theo hoàn thành sẽ tính tiếp.
- Lời bình luận sẽ xuất hiện trong bong bóng của pet (kèm nút **Đáp lại cô ấy** / **Đáp lại nó**), đồng thời được đưa vào lịch sử chat của nhân vật này dưới dạng tin nhắn “Quan sát”. Nhấp vào nút sẽ mở cửa sổ chat để bạn trực tiếp nhập câu trả lời.
- Trả lời lại pet, xoa đầu hay tặng hoa cho pet đều được tính là đã quan tâm đến pet. Nếu 3 lần bình luận liên tiếp không ai để ý, tâm trạng sẽ đổi thành “Tủi thân”; lần bình luận tiếp theo pet sẽ khẽ hỏi một câu xem có phải bạn đang bận không — không trách móc, không hối thúc, và mỗi giờ tối đa chỉ hỏi một lần.
- Lời bình luận sử dụng kết nối chat của nhân vật này để gửi yêu cầu, mỗi lần bình luận là một lần gọi API. Khi API gặp lỗi sẽ không thử lại làm phiền màn hình, trong cài đặt sẽ hiển thị nguyên nhân lần trước chưa thành công.

## Bong bóng nhiệm vụ: Bản tóm tắt và Bản đầy đủ

Chọn trong **Cài đặt tiện ích → Erii · Pet Màn Hình CSDL → Hiển thị nội dung nhiệm vụ**:

- **Bản tóm tắt (Mặc định)**: Ví dụ: “Đang đuổi kịp tiến độ thủ công…”.
- **Bản đầy đủ (Nội dung công việc thực tế)**: Hiển thị tên nhiệm vụ gốc và toàn bộ trường `detail`, ví dụ: “Đuổi kịp thủ công / Batch 1/4 · Gọi AI (Thử lần 1/3)”. Các dấu xuống dòng gốc được giữ nguyên, nội dung dài có thể cuộn, nút dừng vẫn thao tác bình thường.

Lựa chọn này sẽ được lưu lại và có hiệu lực đồng thời trên cả bong bóng của pet lẫn thanh nhiệm vụ trong cửa sổ chat. Nội dung nhiệm vụ đọc trực tiếp từ `feature` và `detail` trên giao diện gốc của CSDL; không tự suy đoán phần trăm, số batch hay số lần thử lại. Khi CSDL luân phiên tạm thời chưa có nhiệm vụ nào, hệ thống hiển thị chờ đồng bộ tiến độ.

## Ranh giới đồng bộ Cơ sở dữ liệu

Bình thường tiện ích này chỉ đọc trạng thái nhiệm vụ, văn bản nhiệm vụ trong chu kỳ xoay vòng và thông báo kết quả do giao diện hiện tại của CSDL cung cấp:

- Không sao chép tiện ích CSDL;
- Không thay thế lối vào của CSDL;
- Không sửa đổi cuộc trò chuyện chính của SillyTavern, cài đặt API toàn cục của SillyTavern hay các nút nhiệm vụ CSDL; lịch sử trò chuyện và cài đặt kết nối của Erii được lưu hoàn toàn tách biệt;
- Bảng CSDL chỉ được sửa đổi trong chế độ bảo trì, sau khi bạn đã tự tay tích chọn từng mục và nhấn “Áp dụng mục đã chọn”, và chỉ đi qua API công khai `AutoCardUpdaterAPI` của CSDL, sao lưu toàn bộ trước khi ghi; preset thúc đẩy cốt truyện chỉ được chuyển đổi chứ không sửa nội dung;
- Văn bản SillyTavern chỉ được đọc trong chế độ bảo trì (đính kèm vài tầng gần nhất) và trong tính năng Quan sát đồng hành do bạn chủ động bật, chỉ gửi đến API dùng để chat với pet;
- Không gọi hàm điều khiển động tác của Naidan (pet gốc của CSDL); hình ảnh của nhân vật Naidan chỉ được đọc tại thời điểm chạy từ các hình ảnh CSDL đã tải sẵn, không sao chép, không phân phối lại;
- Sổ tay nhỏ lưu giữ các dòng chữ nhiệm vụ quan sát được gần đây, các bản ghi này không đồng nghĩa với danh sách nhiệm vụ đầy đủ vẫn đang chạy; nút dừng chỉ liên kết với nhiệm vụ hiện tại mà CSDL cung cấp;
- Khi không có phần trăm thực tế, hệ thống hiển thị nguyên văn văn bản tiến độ ban đầu của CSDL;
- Nút một chạm mở giao diện chỉ mở giao diện CSDL và chuyển trang của nó, không đọc/ghi bảng và không gọi các thao tác nhiệm vụ.

Hiện tại tiện ích đã tương thích với cấu trúc giao diện hiện có của CSDL phiên bản `naiv1`. Nếu tương lai CSDL thay đổi cấu trúc giao diện như `DeskPetLayer`, `DeskPet` hoặc `NoticeBubble`, Erii có thể sẽ hiển thị cảnh báo “Giao diện CSDL không tương thích” và giữ nguyên hiển thị pet gốc của CSDL.

Khuyến nghị nên giữ nguyên Naidan gốc và bong bóng nhiệm vụ gốc chạy trong cài đặt CSDL, sau đó ẩn chúng đi trong cài đặt của tiện ích này. Thao tác “Ẩn” ở đây chỉ thay đổi việc hiển thị, không gỡ cài đặt CSDL và không làm ngắt nguồn dữ liệu.

## Giải thích về Xem trước cục bộ và Phản hồi trùng lặp

Trang xem trước tính năng của v1.0.1 là trang demo được đánh dấu rõ ràng: Phản hồi mô phỏng chỉ dùng để kiểm tra việc chuyển đổi hội thoại trong cùng cửa sổ, cài đặt kích thước và thu gọn, không gọi mô hình thực tế. Tiện ích chính thức tiếp tục mặc định sử dụng API hiện tại của SillyTavern. Các giải thích trước đây về việc xem trước chuyển tiếp thực tế được giữ lại dưới đây, không đại diện cho việc trang demo mới có thể gọi API thực tế.

Bản xem trước độc lập của v0.6.0 từng chặn các yêu cầu thành ví dụ cố định, do đó các tin nhắn khác nhau có thể nhận về cùng một câu trả lời, kiểm tra kết nối cũng chỉ là kết quả mô phỏng. Vấn đề này đã được khắc phục trong bản xem trước của v0.6.1; gói cài đặt chính thức luôn nhận phản hồi thông qua API.

Bản xem trước mặc định mới cần bạn tự điền API của mình trong cài đặt kết nối, lúc này danh sách mô hình, kiểm tra kết nối và trò chuyện mới thực sự gửi yêu cầu đến API đó. Trang độc lập không thể đọc kết nối hiện tại của SillyTavern; chỉ sau khi cài đặt tiện ích vào SillyTavern thì mới có thể mặc định dùng API của SillyTavern. Giao diện sẽ ghi rõ: **Xem trước độc lập · Có thể trò chuyện thực tế sau khi cấu hình API riêng**.

Chỉ khi chủ động dùng địa chỉ demo có chứa tham số `demo=1` thì mới nhận các ví dụ cố định. Giao diện sẽ hiển thị rõ ràng “Chế độ Demo”, bản ghi giữa bản demo và bản xem trước thực tế được lưu tách biệt, bản ghi mô phỏng cũ không bị lẫn vào chat thực tế. Khi API gặp lỗi sẽ hiển thị thông báo lỗi, không tự chèn thêm một câu thoại cố định.

Bản xem trước cục bộ dùng `work/erii_preview_server.mjs` trong workspace để chuyển tiếp yêu cầu, chỉ lắng nghe trên localhost; tệp này không được đưa vào gói cài đặt. Bản cài đặt cho SillyTavern sử dụng chính backend của SillyTavern nên không cần khởi chạy dịch vụ xem trước này.

## Toàn bộ lịch sử phiên bản

### v1.0.1 · Hội thoại cùng cửa sổ & Sửa lỗi kích thước (Hiện tại, 2026-10-16)

- Tạo mới, chuyển đổi, nhập, quay lại sau khi xóa đều tái sử dụng chung một cửa sổ chat ban đầu, hành vi trên máy tính và điện thoại đồng nhất. Vị trí kéo thả và kích thước mở rộng không bị đặt lại khi chuyển đổi.
- Bảo toàn từng phần lịch sử, bản nháp, tin nhắn đang chỉnh sửa dở, cài đặt kết nối và quyền sở hữu API key. Khi chuyển đổi sẽ lưu ngay bản nháp; phản hồi đang đợi tiếp tục được ghi về đúng hội thoại gốc, không bị lẫn bản ghi.
- Quay lại hội thoại cũ hoặc quay lại từ cài đặt kết nối vẫn giữ nguyên vị trí đang đọc và khu vực suy nghĩ đã mở rộng; tạo mới sau khi xóa sẽ dùng tên mặc định chưa bị trùng.
- Đóng toàn bộ cửa sổ chat sẽ dừng tất cả các phản hồi chat đang chờ; nút «Dừng phản hồi» vẫn chỉ dừng hội thoại hiện tại. Đặt lại trạng thái xác nhận xóa sạch / xóa bỏ sau khi chuyển đổi hoặc đóng cửa sổ, tránh kế thừa trạng thái xác nhận trước đó.
- Sửa lỗi giới hạn cứng 72 pixel trên điện thoại. Cả điện thoại và máy tính đều có thể chỉnh từ 56–112 pixel, bổ sung hiển thị con số và nút khôi phục 88 pixel; cải thiện vùng cảm ứng của thanh trượt và tối ưu hóa xử lý làm mới khi kéo liên tục.
- Tiếp tục sử dụng cấu trúc lưu trữ ban đầu; đợt này cập nhật 9 tệp ở thư mục gốc, giữ nguyên 107 ảnh WebP. Việc nhận trang phục, ví tiền, quyền dừng CSDL và bảo trì đều kế thừa theo cài đặt cũ.

### v1.0.0 Tự kiểm tra sửa đổi · 2026-10-15 (Giữ nguyên số phiên bản)

- Hoạt ảnh đóng có thể hủy ngang, khi mở lại nhanh cửa sổ chat, Sổ tay đời sống và Ngôi nhà Pet sẽ không bị callback cũ đóng nhầm; cửa sổ cũ đóng xong cũng không cướp tiêu điểm nhập liệu của cửa sổ chat mới.
- API key được ghi nhớ sẽ lưu riêng theo từng nhân vật, hội thoại và địa chỉ API; các địa chỉ khác nhau hoặc cùng địa chỉ nhưng khác khóa đều có thể khôi phục riêng, hủy ghi nhớ một bên không làm xóa bên còn lại.
- Khi thu nhỏ từ máy tính về độ rộng điện thoại chỉ hiển thị bảng chat hiện tại, yêu cầu chạy ngầm vẫn tiếp tục; siết chặt bố cục khi chiều cao hiển thị thấp, chiều cao cực nhỏ sẽ thu thanh nhiệm vụ CSDL vào mục «Quản lý».
- Nút «Đáp lại cô ấy» trong bình luận quan sát sẽ đưa về đúng cuộc hội thoại thực tế đã lưu bình luận đó.
- Quyết toán ăn uống kích hoạt sớm do có hoạt động mới cũng sẽ tăng độ no/nuôi dưỡng bình thường, và chỉ quyết toán đúng một lần.
- Khôi phục giá trị mặc định cho các bản ghi nuôi dưỡng con bị lỗi khuyết thiếu; ngày tháng không hợp lệ không còn làm sập Ngôi nhà Pet, các bản ghi hợp lệ khác vẫn được giữ nguyên.
- JSONL khi thiếu thời gian sẽ không tự chế ra ngày năm 1970; độ dài phản hồi API được chuẩn hóa thành số nguyên từ 128～4096.
- Không thay đổi số phiên bản, giá trang phục, mật ngữ, tư liệu, quy tắc di chuyển chủ động hay quyền ghi CSDL. Sau khi cập nhật vẫn hiển thị 1.0.0, vui lòng phân biệt theo ngày sửa đổi này và lịch sử commit của kho lưu trữ.

### v1.0.0 · Trang phục mật ngữ của Zero, Thu gọn suy nghĩ & Đa hội thoại (Lịch sử)

- Tích hợp 27 ảnh WebP trong suốt của «Hoàng Nữ Zero · Lam Băng Tường Vi»; Cửa hàng thêm mục chọn nhân vật và nhập mật ngữ. Nhập câu chỉ định để mở khóa, không trừ tiền, không tăng thống kê mua sắm; sau khi mở khóa hãy vào Tủ đồ của Zero để thay thủ công.
- Sửa lỗi nội dung suy nghĩ trong chat của Zero bị lẫn vào nội dung chính: Tự nhận diện các trường suy nghĩ của API và 4 loại thẻ suy nghĩ, mặc định thu gọn, có thể bấm mở rộng; chuẩn hóa tương thích lịch sử cũ, các lượt chat thông thường tiếp theo chỉ mang theo nội dung chính.
- Bổ sung tối đa 20 cuộc hội thoại độc lập cho mỗi nhân vật. Khi đó máy tính có thể mở nhiều cửa sổ cùng lúc, điện thoại chuyển qua danh sách; **v1.0.1 đã chuyển sang đổi trong cùng một cửa sổ theo yêu cầu của người dùng**. Lịch sử, bản nháp, kết nối và yêu cầu chạy ngầm độc lập vẫn được bảo toàn.
- Bổ sung xuất file JSON và hộp thoại xác nhận khi nhập dữ liệu, tương thích với SillyTavern JSONL dạng chữ và file chat TXT bản cũ. Nhập dữ liệu sẽ lưu thành hội thoại mới, bảo toàn bản ghi hiện tại; từ chối tệp hỏng/quá giới hạn, không nhập cấu hình API hay các phiếu sửa đổi có thể thực thi.
- Bổ sung đổi tên, xóa hội thoại mới tạo và bố cục thu gọn cho màn hình nhỏ; giữ nguyên giá vé hoa ban đầu, chức năng dừng nhiệm vụ, bảo vệ bảo trì, hủy bình luận quan sát và không tự ý di chuyển.
- Các mục kiểm tra và ranh giới chưa xác minh của đợt này xem tại COMPATIBILITY.md. Việc cập nhật lên GitHub và SillyTavern thực tế vẫn cần thực hiện riêng.

### v0.9.4 · Cửa hàng độc lập và Lối vào Tủ đồ (Phiên bản lịch sử)

- Bổ sung Cửa hàng độc lập: 3 lối vào tại Sổ tay nhỏ, Cài đặt tiện ích, Tủ đồ; hiện tại chỉ mở bán Tsukuyomi · Dạ Lễ Nguyệt Độc.
- Quy đổi và mua sắm tập trung vào Cửa hàng; cố định nút mua, số dư chênh lệch và lối tắt quy đổi ở phía dưới. Hiển thị 4 loại động tác xem trước, thiếu xu vàng có thể đi làm việc ngay.
- Trang thay trang phục trong Sổ tay đời sống đổi thành «Tủ đồ của tôi», chỉ hiển thị trang phục mặc định và trang phục đã sở hữu; mua xong thay thủ công, đổi về mặc định hoàn toàn miễn phí.
- Giá vẫn là 10.320 vé hoa, quy đổi vẫn là 1 xu vàng = 40 vé hoa; định dạng lưu trữ ví tiền và trang phục kế thừa từ v0.9.3, không thêm chuyển đổi dữ liệu, không phát lại số dư thử nghiệm.
- Cửa sổ nổi trên máy tính có thể kéo thả, bảng đáy trên điện thoại có thể vuốt xuống để đóng; thu hẹp đầu trang khi chiều cao nhỏ, giữ lại vùng quy đổi có thể cuộn. Trong Cửa hàng vẫn giữ nguyên nhiệm vụ CSDL và nút dừng gốc.
- Đã vượt qua 11 nhóm kiểm tra trang Cửa hàng (1280/375/320, gồm lối vào cảm ứng, vuốt xuống, thu nhỏ chiều cao khả dụng), 9 nhóm mô hình trang phục, 25 nhóm mô hình sẵn có và 15 nhóm hồi quy trình duyệt; SillyTavern thực tế và điện thoại vật lý đợt này chưa kiểm tra lại.
- Kế thừa 80 ảnh WebP gốc, không có đồ họa mới, không gọi thêm API, không tự động bắt đầu nhiệm vụ hay tự ý di chuyển; bổ sung logic dọn dẹp tránh tồn đọng Cửa hàng sau khi tắt tiện ích.

### v0.9.3 · Dạ Lễ Nguyệt Độc và Quy đổi vé hoa (Phiên bản lịch sử)

- Mở bán «Tsukuyomi · Dạ Lễ Nguyệt Độc»: 10.320 vé hoa, 1 xu vàng đổi 40 vé; khởi đầu chưa sở hữu, không tự động mua hay mặc lên.
- Trang thay đồ bổ sung số dư xu vàng/vé hoa, số lượng quy đổi, dự kiến nhận được, số xu vàng cần để mua đồ, thông báo số dư không đủ. Nút điền số không trừ tiền; quy đổi, mua, mặc lên là 3 thao tác riêng biệt rõ ràng.
- Lưu trữ ví tiền bổ sung số dư vé hoa, tổng quy đổi và tổng chi tiêu vé hoa; trang phục thống kê riêng lượng vé hoa đã tiêu, lưu trữ xu vàng, hoạt động và trang phục sẵn có đều được giữ nguyên. Sau khi mua một lần sẽ được đổi trang phục miễn phí, vé hoa còn dư được bảo toàn.
- 27 ảnh WebP trong suốt mới bao phủ toàn bộ động tác và hình ảnh sinh hoạt; ảnh phát hành là 960×960, dung lượng khoảng 6.45 MiB. Bản gốc PNG 1254×1254 được lưu tại thư mục tư liệu duy trì, không đưa vào gói cài đặt nhẹ của tiện ích.
- Tải trước (preload) 8 động tác thường dùng, các động tác còn lại giải mã theo nhu cầu; sửa lỗi tràn ngang do xoay thẻ thay đồ gây ra. Khi mặc trang phục, bong bóng của pet và Sổ tay đời sống sẽ mang tông màu tím nhạt.
- Vượt qua 9 nhóm logic mới, 10 nhóm kịch bản trình duyệt thay đồ (1280/375/320), cùng 25 nhóm mô hình sẵn có và 15 nhóm hồi quy trình duyệt. SillyTavern thực tế và điện thoại vật lý vẫn cần xác nhận sau khi cài đặt, chi tiết xem COMPATIBILITY.md.
- Giữ nguyên 6 bản sửa lỗi từ v0.9.2; không khôi phục tự động di chuyển, không sửa đổi đồ họa mặc định, không tự động gọi API chat.

### v0.9.2 · Sửa chữa 6 vấn đề (Phiên bản lịch sử)

- Yêu cầu bảo trì cố định ảnh chụp dữ liệu tại thời điểm gửi; đổi cuộc trò chuyện sẽ hủy yêu cầu cũ, việc sắp xếp lại hàng trong cùng một cuộc trò chuyện dựa vào `row_id` gốc để định vị, giá trị gốc thay đổi sẽ từ chối áp dụng.
- Thao tác ghi/hoàn tác kiểm tra lại quyền sở hữu sau khi chờ sao lưu; đổi cuộc trò chuyện giữa chừng sẽ dừng các mục tiếp theo; bản sao lưu bắt buộc phải thuộc về đúng cuộc trò chuyện của phiếu sửa đổi đó; mỗi lần chỉ thực hiện một thao tác bảo trì.
- Xóa hàng đối chiếu toàn bộ hàng gốc và tiêu đề cột, phiếu xóa hàng bản cũ không có giá trị gốc đầy đủ sẽ cần tạo lại; đổi preset đối chiếu preset gốc.
- Vô hiệu hóa tính năng hoàn tác và hoàn tác bắt buộc khi CSDL đang bận, đồng thời kiểm tra lại trước khi gọi thực tế.
- Sửa lỗi độ no/vệ sinh nhảy về giá trị cũ sau khi tắt chỉ số nhu cầu; đóng băng trong thời gian tắt, khi bật lại không trừ bù lượng hao hụt trong thời gian tắt.
- Hủy bình luận khi tắt Quan sát đồng hành, ẩn pet, đổi chat; loại bỏ các phản hồi cũ đến muộn; hủy bình luận không làm hủy tin nhắn chat thông thường của người dùng.
- Đã vượt qua 25 nhóm hồi quy logic thuần túy, 15 nhóm kịch bản trình duyệt cô lập (gồm độ rộng máy tính/375/320) cùng kiểm tra cú pháp, danh mục, liên kết tài nguyên. Yêu cầu trình duyệt và CSDL đều là mô phỏng, không tốn phí. Chưa kiểm tra lại trên CSDL thực tế hoặc toàn bộ các phiên bản SillyTavern, chi tiết xem COMPATIBILITY.md.
- Nếu bên trong API công khai của CSDL đã bắt đầu một thao tác, tiện ích không thể đảm bảo rollback nó giữa chừng; cơ chế bảo vệ chỉ bao quát trước khi gọi và giữa các lần gọi. Chế độ lưu trữ và lưu bất đồng bộ bên trong CSDL thực tế vẫn cần xác minh riêng.
- Giữ lại vịt vàng trên đầu, tay trần, tương tác tại chỗ, kéo thả thủ công và nút dừng nhiệm vụ gốc, không khôi phục tự do đi lại.

*Các phiên bản được sắp xếp theo thứ tự thời gian đảo ngược. Hành vi của phiên bản mới nhất căn cứ theo mục trên cùng.*

### v0.9.1 · Khung thay trang phục (Phiên bản lịch sử)

- Sổ tay đời sống thêm trang **Tủ đồ**: Trang phục mua bằng xu vàng trong ví tiền gia đình, sở hữu riêng theo từng nhân vật, có thể mặc lên hoặc đổi về mặc định bất cứ lúc nào; không đủ tiền nút sẽ bị vô hiệu hóa và ghi rõ còn thiếu bao nhiêu; mua và đổi đồ đều ghi vào Sổ thu chi nhỏ, pet sẽ nói một câu.
- Sau khi mặc lên, pet, ảnh đại diện, tranh minh họa Sổ tay đời sống, ảnh thu nhỏ gọi món và tranh vẽ Ngôi nhà Pet đều đổi sang ảnh của trang phục đó; tư thế nào trang phục chưa vẽ sẽ dùng ảnh gốc của nhân vật; màu hạt hiệu ứng có thể bị trang phục ghi đè; pet và Sổ tay đời sống có thuộc tính `data-skin` để tùy biến màu giao diện theo trang phục.
- Ngôi nhà Pet thêm nút **Đổi trang phục cho cô ấy**, mở thẳng trang thay đồ của nhân vật đó.
- Bản này chỉ dựng khung, **chưa mở bán trang phục nào**: Danh mục trống, mỗi nhân vật chỉ có trang phục mặc định có sẵn. Sau này chỉ cần thêm một dòng vào danh mục trong `skin-model.js` và bỏ ảnh vào là xong, không cần sửa mã nguồn khác.
- Lưu trữ: Trang phục sở hữu và đang mặc lưu trong trường `skins` của cài đặt tiện ích; trang phục đã mua nhưng tạm thời chưa có trong danh mục sẽ không bị mất. Khi hạ cấp về v0.9.0 trường này sẽ bị bỏ qua, xu vàng và Sổ thu chi vẫn giữ nguyên (bản ghi mua trang phục được lưu dưới dạng chi tiêu).
- Ba nhân vật mỗi người thêm 2 nhóm lời thoại (khi mua được trang phục, khi mặc trang phục). Tổng kết trong Sổ thu chi đổi từ “Mua cơm hết” thành “Đã chi”, vì tiền có thể dùng để mua trang phục.
- Tệp mới: `skin-model.js` (danh mục trang phục, lưu trữ, mua và mặc).

### v0.9.0 · Chế độ bảo trì & Quan sát đồng hành (Phiên bản lịch sử)

- Cửa sổ chat thêm nút chuyển đổi **Tán gẫu / Bảo trì CSDL**. Khi bảo trì, pet đọc bảng dữ liệu, các lỗi gần nhất và 0～10 tầng văn bản gần nhất (tùy chỉnh), đưa ra phiếu chỉnh sửa; mỗi mục đều cần người dùng tích chọn và xác nhận, việc ghi chỉ qua API công khai của CSDL, sao lưu toàn bộ trước khi ghi, hoàn tác một chạm; không tự động áp dụng.
- Phiếu chỉnh sửa hỗ trợ sửa ô, sửa cả hàng, thêm hàng, xóa hàng, chuyển đổi preset thúc đẩy cốt truyện, yêu cầu CSDL điền bảng lại; định vị theo `row_id`, đối chiếu lại giá trị gốc trước khi ghi, đổi chat, bị khóa, xung đột đều không ghi và nêu rõ lý do.
- Preset cốt truyện chỉ chuyển đổi, không sửa nội dung: API nhập preset của CSDL sẽ chuyển chat hiện tại sang chế độ gọi lại LLM, lại không có API công khai để xóa preset hay chuyển ngược lại, một khi ghi là không hoàn tác được.
- Thêm **Quan sát đồng hành** (mặc định tắt): Cứ cách N tầng (1～20, mặc định 4) đọc các tầng mới xuất hiện, đưa bình luận vào lịch sử chat, có thể trực tiếp trả lời; 3 câu liên tiếp không ai trả lời sẽ tủi thân, lần sau sẽ khẽ hỏi thăm, tối đa 1 lần/giờ; hai lần bình luận cách nhau tối thiểu 60 giây, CSDL bận đợi tối đa 30 giây.
- Thêm lời thoại: Tâm trạng “Tủi thân” của 3 nhân vật, phản ứng sau khi ghi bảo trì và sau khi hoàn tác.
- Tệp mới: `repair.js` (tổng hợp dữ liệu, phân tích và đối chiếu phiếu sửa đổi), `repair-ticket.js` (thẻ phiếu sửa đổi), `database-repair.js` (ghi và hoàn tác), `backup-store.js` (sao lưu cục bộ trên trình duyệt), `watch.js` (đếm tầng và thời điểm bình luận).

### v0.8.0 · Ba nhân vật, Nuôi dưỡng & Một chạm mở giao diện CSDL (Phiên bản lịch sử)

- Thêm nhân vật Zero (26 ảnh) và Naidan (đọc ảnh tích hợp sẵn của CSDL lúc chạy); dữ liệu nhân vật tập trung trong `characters/`, sau này thêm nhân vật chỉ cần thêm một tệp và một thư mục tài nguyên.
- Thêm Ngôi nhà Pet: Thẻ nhân vật dạng bách khoa, hoạt ảnh đổi nhân vật, biệt danh, nhật ký trưởng thành và câu chuyện độc quyền.
- Thêm cơ chế nuôi dưỡng: 5 bậc thân mật, độ no và vệ sinh, tâm trạng, lời chào hàng ngày, trợ cấp tối thiểu; đều không có hình phạt, chỉ số nhu cầu có thể tắt.
- Đi làm và ăn uống tách biệt theo nhân vật, ví tiền dùng chung; lưu trữ tương thích 0.7.1 (hoạt động của Erii vẫn ghi vào trường cũ).
- Nhiệm vụ CSDL, tương tác, chăm sóc và lúc rảnh rỗi đều có lời thoại cục bộ chọn lọc theo tính cách, độ thân mật và tâm trạng; bong bóng nhiệm vụ chia làm 2 dòng gồm lời thoại và tiến độ thực tế; có thể tắt.
- Sổ tay nhỏ thêm các nút phím tắt CSDL và “Xem bảng”; khi gặp lỗi bong bóng có nút “Đi xem thử”.
- Giao diện đổi sang phong cách Sổ tay bìa cứng thủ công, thêm các mức hiệu ứng đặc biệt; cửa sổ trên điện thoại đổi thành ngăn kéo kéo lên từ đáy.
- Xóa các frame chạy bộ trái/phải không còn dùng tới (khoảng 21MB), tổng dung lượng tệp tiện ích giảm từ ~25MB xuống ~6.5MB.
- Thêm `tools/slice-pose-sheet.py`: Cắt bảng dáng điệu đã tạo thành từng ảnh đơn theo đúng quy chuẩn của kho lưu trữ.
- Hình ảnh, đường dẫn, văn bản, tương tác, đồng bộ chỉ đọc CSDL, nút dừng, câu chuyện, quy tắc làm việc/ăn uống của Erii được giữ nguyên; cài đặt cũ không có trường mới sẽ mặc định là Erii; tiếp tục ghi vào `settings.chat`, hạ cấp về 0.7.1 không làm mất lịch sử.

### v0.7.1 · 4 hình ảnh ăn uống riêng biệt & Đổi tên lối vào (Phiên bản lịch sử)

- Pudding / Cơm nắm / Cơm trứng cuộn / Mì Ramen sử dụng riêng 4 ảnh WebP trong suốt gồm eat-pudding / eat-riceball / eat-omurice / eat-ramen.
- Thẻ gọi món thay thế bằng ảnh thu nhỏ ăn uống tương ứng của Erii; sau khi mua cơm thì Sổ tay và pet đều hiển thị cùng tư thế món ăn đó, không còn dùng chung một ảnh ăn uống chung chung.
- Ảnh mới giữ nguyên vịt vàng trên đầu, tay trần, tóc đỏ mắt đỏ và kimono trắng đỏ; ảnh gốc độ nét cao lưu riêng, ảnh phát hành nén thành WebP 768×768.
- Lối vào trong Sổ tay nhỏ, cài đặt tiện ích và trang xem trước thống nhất đổi tên thành “Sổ tay đời sống”.
- Giữ nguyên xu vàng, giá thức ăn, thời gian ăn, thời gian làm việc và các quy tắc lưu trữ sẵn có; bản ghi ăn uống đang diễn ra ở bản cũ tự động khớp ảnh mới theo ID thức ăn ban đầu.

### v0.7.0 · Làm việc, Kiếm tiền & Ăn uống (Phiên bản lịch sử)

- Thêm lối vào và cửa sổ độc lập cho Sổ tay đời sống: Đi làm việc, Ăn món ngon, Sổ thu chi nhỏ.
- Hiệu sách / Tiệm bánh ngọt / Tiệm hoa tương ứng 1 / 2 / 3 phút, nhận 10 / 18 / 25 xu vàng; công việc không tự động lặp lại.
- Pudding / Cơm nắm / Cơm trứng cuộn / Mì Ramen tương ứng 5 / 8 / 15 / 20 xu vàng, ăn trong 8 / 9 / 10 / 12 giây.
- Lưu trữ ví tiền, thời gian bắt đầu hoạt động, số lần tích lũy và 20 bản ghi đời sống gần nhất; làm mới và hoàn thành offline đều được khôi phục.
- Tiền lương chờ nhận không bị mất, trên cùng một trang không thể nhận trùng hay mua trùng; kết thúc công việc sớm cần xác nhận lần hai.
- 4 bức tranh minh họa WebP trong suốt 768×768 mới, tổng cộng khoảng 584 KB; ảnh cũ giữ nguyên. Làm việc / Ăn uống hiển thị tại chỗ kèm hiệu ứng động nhẹ, không thêm việc tự động di chuyển.
- Thêm tiến độ sinh hoạt và bong bóng nhận lương khi tan ca; khi nhiệm vụ CSDL xuất hiện sẽ nhường chỗ, cửa sổ sinh hoạt cũng có thể thực hiện thao tác dừng nhiệm vụ gốc.
- Giữ lại toàn bộ các thao tác tin nhắn, phong cách, trí nhớ, bản nháp, API và tính năng danh sách mô hình từ v0.6.2.

### v0.6.2 · Sổ tay trò chuyện & Thao tác tin nhắn (Phiên bản lịch sử)

- Tinh chỉnh cửa sổ chat: Ảnh đại diện, thời gian, vạch phân cách ngày, chủ đề trang trống, trạng thái chờ và cài đặt phân nhóm.
- Thêm tính năng sao chép từng tin nhắn, xuất lịch sử TXT, trả lời lại tin nhắn phản hồi cuối cùng và sửa gửi lại tin nhắn người dùng gần nhất.
- Trả lời lại và sửa đổi chỉ thay thế bản ghi cũ sau khi yêu cầu thành công, hủy bỏ hoặc thất bại sẽ giữ nguyên cuộc trò chuyện thành công ban đầu.
- Lưu bản nháp thông thường và bản nháp chỉnh sửa; hủy sửa đổi sẽ khôi phục nội dung chưa gửi trước đó.
- Thêm 3 phong cách: Tán gẫu tự nhiên / Đồng hành ngắn gọn / Trao đổi chi tiết, cùng dữ liệu trí nhớ thủ công tối đa 2.000 ký tự.
- Khi xem tin nhắn cũ giữ nguyên vị trí cuộn và cung cấp nút “Về tin nhắn mới nhất”; máy tính hỗ trợ mở rộng cửa sổ, điện thoại tự điều chỉnh độ cao khung nhập.
- Tương thích với lịch sử chat cũ, tin nhắn cũ không có thời gian sẽ không tự bịa thời gian; API key vẫn lưu tách biệt với lịch sử chat và cài đặt.
- Giữ lại danh sách mô hình, API hiện tại / riêng biệt, thao tác dừng CSDL gốc và các tương tác pet có sẵn; không thêm việc tự đi lại hay hệ thống làm việc.

### v0.6.1 · Danh sách mô hình & Kết nối thực tế xem trước (Phiên bản lịch sử)

- Cấu hình API riêng thêm tính năng “Lấy danh sách mô hình”, chọn mô hình khả dụng, vẫn giữ việc tự điền tay.
- Hiển thị kết quả lấy danh sách, nguyên nhân thất bại và thao tác hủy; đổi địa chỉ / API key, đóng cửa sổ hoặc tắt tiện ích sẽ hủy yêu cầu cũ, tránh kết quả đến muộn ghi đè lên.
- Truy vấn danh sách qua cổng mô hình gốc của SillyTavern, sử dụng API key độc lập đang điền, không đổi kết nối hoặc mô hình toàn cục của SillyTavern.
- Bản xem trước cục bộ mặc định chuyển tiếp thực tế các truy vấn mô hình, kiểm tra kết nối và trò chuyện; loại bỏ phản hồi cố định mặc định và mô phỏng kết nối thành công.
- Chế độ demo bắt buộc phải chủ động bật và có đánh dấu rõ ràng, lưu trữ bản ghi riêng biệt với bản xem trước thực tế.
- Đối chiếu tin nhắn mới nhất và lịch sử gửi đi trong hội thoại liên tục; API lỗi hiển thị thông báo lỗi, không tự tạo phản hồi thay thế.
- Giữ lại trò chuyện độc lập, chuyển đổi chi tiết nhiệm vụ và nút dừng CSDL gốc từ v0.6.0.

### v0.6.0 · Trò chuyện độc lập & Nội dung công việc thực tế (Phiên bản lịch sử)

- Thêm cửa sổ chat độc lập, prompt tán gẫu tích hợp sẵn của Erii cùng cài đặt xưng hô / mối quan hệ.
- Mặc định dùng kết nối Chat Completion hoặc Text Completion hiện tại của SillyTavern; có thể điền địa chỉ API chuẩn tương thích OpenAI, mô hình và API key riêng.
- Yêu cầu riêng sở hữu quyền điều khiển dừng độc lập; hỗ trợ gửi, thử lại, kiểm tra kết nối, xác nhận xóa sạch và lưu lịch sử chat.
- Bố cục trên điện thoại tự co giãn theo màn hình nhìn thấy, thanh tiêu đề trên máy tính có thể kéo thả. Tùy chọn lưu API key trên thiết bị là không bắt buộc.
- Cài đặt tiện ích thêm tùy chọn Bản tóm tắt / Bản đầy đủ cho nội dung nhiệm vụ; giữ nguyên đầy đủ chi tiết nhiệm vụ CSDL và dấu xuống dòng, nội dung dài có thể cuộn.
- Cửa sổ chat đồng thời cung cấp thao tác dừng gốc của nhiệm vụ CSDL, việc dừng chat và dừng CSDL tách biệt nhau.
- Tiếp tục dùng vịt vàng trên đầu, kéo thả thủ công, nhòm ngó tức thì, nhấp tương tác và tự đổi truyện sau 30 giây; không thêm việc tự ý đi lại.

### v0.5.14 · Câu chuyện tự động đổi sau mỗi 30 giây (Phiên bản lịch sử)

- Sau khi bong bóng câu chuyện mở ra, cứ mỗi 30 giây tự động đổi một câu chuyện mới; áp dụng cho cả mở thủ công và tự xuất hiện lúc nhàn rỗi.
- Tiếp tục xáo trộn 12 câu chuyện theo vòng, không lặp lại trong một vòng, các vòng liền kề cũng tránh lặp lại ngay lập tức.
- Rê chuột và dùng phím focus sẽ tạm dừng đổi truyện, rời đi sẽ đếm tiếp thời gian còn lại; chạm trên điện thoại sẽ giữ nguyên trạng thái đọc.
- Nút thủ công “Đổi câu chuyện khác” sẽ đổi ngay lập tức; đóng lại, nhiệm vụ CSDL xuất hiện hoặc mở Sổ tay nhỏ sẽ kết thúc chuỗi đổi truyện liên tục của vòng này.
- Giữ lại tính năng tự kể chuyện sau khi rảnh rỗi khoảng 5 phút, công tắc câu chuyện lúc rảnh rỗi và bản vá dừng nhiệm vụ từ v0.5.13.

### v0.5.13 · Sửa lỗi dừng nhiệm vụ & Ẩn Sổ tay nhỏ (Phiên bản lịch sử)

- Nút dừng bám sát theo nhiệm vụ hiện tại của CSDL, tránh việc bản ghi nhiệm vụ cũ chiếm dụng nút bấm.
- Kiểm tra lại nguồn và nhiệm vụ trước khi nhấn; nguồn bị ngắt hoặc nhiệm vụ đã chuyển đổi sẽ không thực thi thao tác đã hết hạn, hiển thị nhắc xác nhận nhiệm vụ mới.
- Khi CSDL chỉ cập nhật thao tác dừng mà văn bản nhiệm vụ không đổi, hệ thống cũng đồng bộ thao tác mới nhất.
- Thông báo dừng thất bại được giữ lại khoảng 8 giây, làm mới không lập tức ghi đè; lỗi hoặc cảnh báo CSDL luôn được ưu tiên hiển thị.
- Sau khi tắt “Hiển thị Erii”, cài đặt tiện ích vẫn có thể mở Sổ tay nhiệm vụ và lối vào CSDL; các nút động tác thư giãn bị vô hiệu hóa trong thời gian ẩn.
- Giữ lại nhòm ngó tức thì, kéo thả, nhấp tương tác và câu chuyện chữa lành từ v0.5.12; không khôi phục tự động di chuyển.

### v0.5.12 · Sát mép màn hình lập tức nhòm ngó (Phiên bản lịch sử)

- Xóa bỏ thời gian chờ nhòm ngó khoảng 6 giây; kéo sát mép thả tay ra là lập tức thụt vào nhòm ngó.
- Chuột dừng bên cạnh Erii vẫn duy trì nhòm ngó, không còn bắt buộc phải rê chuột ra chỗ khác trước.
- Vị trí mặc định nếu đã sát mép cũng có hiệu lực tương tự, không bắt buộc phải lưu vị trí kéo thả một lần trước.
- Khi sát mép sẽ bỏ qua việc chờ ngồi vững hoàn toàn, thời gian chuyển đổi dáng vẻ ở mép rút ngắn xuống còn khoảng 0.16 giây.
- Trong lúc kéo vẫn hiển thị dáng bị nhấc bổng, nhấp tương tác, ngủ ngắn, Sổ tay nhỏ và nhiệm vụ CSDL luôn được ưu tiên; kết thúc nếu vẫn sát mép sẽ trở lại nhòm ngó.
- Giữ lại 12 mẩu chuyện chữa lành cục bộ và nút dừng nhiệm vụ gốc của CSDL; không khôi phục việc tự ý di chuyển.

### v0.5.11 · Nhòm ngó mép màn hình & Câu chuyện chữa lành (Phiên bản lịch sử)

- Dấu × cố định ở góc trên bên phải Sổ tay nhỏ, tăng khoảng cách thực tế với nút mở CSDL.
- Bổ sung 3 ảnh nhòm ngó WebP trong suốt không nén 512×512 cho các mép trái, phải, đáy; mép trên dùng lại ảnh nhòm ngó chính diện treo ngược.
- Dựa theo phản hồi vẽ lại dáng nhòm ngó trái phải: Thân mình giấu tự nhiên sau mép màn hình, chỉ lộ đầu và một bàn tay trần vịn mép, sửa lỗi hai tay chen chúc trong cùng một ống tay áo và tư thế thiếu tự nhiên.
- Sau khi kéo sát mép thủ công, rảnh rỗi khoảng 6 giây sẽ kích hoạt nhòm ngó; chuột lại gần, nhấp chuột, nhấn giữ, kéo thả hoặc khi nhiệm vụ bắt đầu sẽ trở lại bình thường.
- Bổ sung 12 mẩu chuyện chữa lành gốc cục bộ; rảnh rỗi khoảng 5 phút sẽ chủ động xuất hiện, cũng có thể mở thủ công từ Sổ tay nhỏ.
- Thêm các tính năng đổi truyện khác, đóng, tạm dừng khi rê chuột, tạm dừng đọc bằng bàn phím và giữ nguyên trạng thái khi chạm trên điện thoại.
- Nhiệm vụ CSDL và kết quả luôn ưu tiên hơn câu chuyện, nút dừng tiếp tục gọi quy trình nhiệm vụ gốc của CSDL.
- Bổ sung 2 công tắc độc lập; khi tài nguyên chuyên dụng gặp sự cố sẽ trở về dáng vẻ bình thường.
- Duy trì hành vi không tự ý đi lại từ v0.5.8, chuột phải bật tắt và cách thức truy cập của SillyTavern 1.14.0–1.19.0.

### v0.5.10 · Chỉnh sửa bố cục nút trong Sổ tay nhỏ (Phiên bản lịch sử)

- Chuyển nút “Tặng cô ấy một bông hoa” vào nhóm nút động tác thư giãn, thống nhất font chữ, viền, nền và trạng thái vô hiệu hóa với các động tác khác.
- Thứ tự nút được điều chỉnh thành “Vươn vai → Ngủ ngắn → Tặng cô ấy một bông hoa”, không còn chiếm riêng một dòng bên dưới.
- Dấu × ở góc trên bên phải Sổ tay nhỏ tinh chỉnh nhẹ về phía trên bên phải, giữ khoảng cách rõ ràng hơn với nút “Mở CSDL chính”, giảm thiểu việc chạm nhầm.
- Giữ lại tính năng chuột phải bật tắt Sổ tay nhỏ và mở CSDL chính từ v0.5.9.

### v0.5.9 · Chuột phải bật tắt & Lối vào CSDL (Phiên bản lịch sử)

- Chuột phải vào Erii trên máy tính: Lần đầu mở Sổ tay nhỏ, chuột phải lần nữa sẽ thu gọn lại ngay, không bắt buộc phải bấm vào dấu ×.
- Xóa các nút “Về vị trí mặc định” và “Đổi sang ngồi bên kia” trong Sổ tay nhỏ, giảm bớt chiếm dụng chỗ của các thao tác ít dùng.
- Thêm nút “Mở CSDL chính” ở đầu Sổ tay nhỏ, trực tiếp gọi lối vào của chính tiện ích CSDL.
- Tương thích với lối vào CSDL bản mới `acu-v2-menu-item` và lối vào bản cũ `shujuku_v120-menu-item`; nếu không tìm thấy tiện ích CSDL sẽ nhắc bật nó lên trước.
- Tiếp tục duy trì hành vi từ v0.5.8: Erii không tự ý di chuyển, chỉ khi kéo thả thủ công mới thay đổi vị trí.

### v0.5.8 · Loại bỏ tính năng tự di chuyển

- Gỡ bỏ việc gọi các frame chạy bộ trái/phải.
- Gỡ bỏ hoàn toàn logic tự đi dạo và tự thay đổi vị trí.
- Erii không tự chạy nhảy hay đổi vị trí, chỉ khi người dùng kéo thả thủ công mới di chuyển.
- Giữ lại động tác chờ, nhấp tương tác, nhấn giữ tương tác, kéo thả, đồng bộ CSDL và nút dừng nhiệm vụ.
- Xóa bỏ tài nguyên chạy bộ khỏi gói cài đặt hiện tại, giảm dung lượng gói và loại bỏ tàn dư logic cũ.

### v0.5.7 · Sửa lỗi cập nhật vị trí khi đi dạo (Phiên bản lịch sử)

- Sửa lỗi “Frame động tác có thay đổi nhưng vị trí của pet trên màn hình không đổi”.
- Cập nhật tọa độ thực tế theo từng bước, đi một đoạn sang trái hoặc phải trước rồi đi ngược lại điểm xuất phát theo đường cũ.

**Tính năng tự di chuyển của phiên bản này đã bị gỡ bỏ từ v0.5.8.**

### v0.5.6 · Ổn định thời gian hành vi chủ động (Phiên bản lịch sử)

- Điều chỉnh khoảng cách tương tác chủ động thành khoảng 12–20 giây, tránh kích hoạt quá dày đặc.
- Dọn dẹp tham chiếu bộ đếm thời gian các bước đi dạo, giảm tích tụ bộ đếm thời gian khi chạy lâu dài.

**Tính năng tự di chuyển của phiên bản này đã bị gỡ bỏ từ v0.5.8.**

### v0.5.5 · Đi dạo qua lại tốc độ chậm (Phiên bản lịch sử)

- Tham khảo cách đi dạo từng bước của Naidan, mỗi ~260 mili-giây di chuyển khoảng 8 pixel.
- Đi đến gần mục tiêu rồi đi bộ ngược lại theo đường cũ.
- Đi dạo xong trở về vị trí cũ, không lưu vị trí tự động di chuyển.
- Nút trên bảng cài đặt đổi sang phong cách tương phản cao dễ nhìn hơn.

**Tính năng tự di chuyển của phiên bản này đã bị gỡ bỏ từ v0.5.8.**

### v0.5.4 · Hoạt ảnh chạy bộ trái phải (Phiên bản lịch sử)

- Tích hợp 2 bộ hoạt ảnh chạy bộ 8 frame trái/phải.
- Giữ lại chú vịt vàng nhỏ trên đầu.
- Tự di chuyển xong trở về vị trí cũ, không lưu vị trí tự di chuyển.
- Các frame chạy bộ thống nhất khung vẽ trong suốt, đường trục giữa và đường cơ sở chân đế.

**Hoạt ảnh chạy bộ của phiên bản này đã bị gỡ bỏ từ v0.5.8.**

### v0.5.3 · Tương tác chủ động & Tự do di chuyển (Phiên bản lịch sử)

- Khi rảnh rỗi ngẫu nhiên uống trà, đọc sách, gấp giấy, ôm vịt, vươn vai, nhòm ngó và vẫy tay.
- Thi thoảng tự di chuyển một đoạn ngắn trong phạm vi an toàn.
- Đang xử lý nhiệm vụ, đang kéo thả và khi mở Sổ tay nhỏ sẽ không tự di chuyển.

**Tính năng tự do di chuyển của phiên bản này đã bị gỡ bỏ từ v0.5.8. Các động tác lúc rảnh rỗi vẫn được giữ lại.**

### v0.5.2 · Bong bóng nhiệm vụ thêm nút dừng

- Khi thúc đẩy cốt truyện hoặc điền bảng, nếu nhiệm vụ gốc của CSDL có chức năng dừng, bong bóng của Erii sẽ hiển thị nút dừng.
- Nhấp vào sẽ gọi quy trình dừng của nhiệm vụ gốc CSDL.
- Không có chức năng dừng thì không hiển thị nút giả.

### v0.5.1 · Nhấn giữ trên điện thoại để mở Sổ tay nhỏ

- Khi dùng điện thoại không có chuột phải, có thể nhấn giữ khoảng 1.4 giây để mở Sổ tay nhỏ.
- Chạm nhanh, nhấp liên tục, nhấn giữ ngủ ngắn và kéo thả tiếp tục được nhận diện riêng biệt, tránh việc nhả tay sau khi kéo thả bị nhận nhầm thành mở trang.

### v0.5.0 · Tương thích với SillyTavern bản cũ

- Mục tiêu tương thích SillyTavern 1.14.0–1.19.0.
- Tương thích cách tải không có callback khởi động của bản cũ, đồng thời tương thích với callback vòng đời của bản mới.
- Bổ sung cơ chế chống khởi tạo lặp lại, tránh việc callback trùng lặp sinh ra pet thứ hai.
- Hình ảnh chưa giải mã thành công thì chưa ẩn pet CSDL gốc; hình ảnh lỗi sẽ giữ nguyên hiển thị ban đầu.
- Bổ sung xử lý khôi phục khi tắt tiện ích, dọn dẹp và khi trình duyệt quay lại từ bộ nhớ đệm (bfcache).

### v0.4.1 · Kéo dài giấc ngủ ngắn & Nối liền hiệu ứng động

- Nhấn giữ khoảng nửa giây để vào giấc ngủ ngắn, thả tay ra tiếp tục nghỉ ngơi khoảng 12 giây.
- Khi các động tác ngủ ngắn, vẫy tay và nhấp liên tục đang phát sẽ không bị các động tác thư giãn thông thường ngắt quãng.
- Tham khảo nhịp lấy đà, nảy lại, nhịp thở phân tầng và tiết tấu độc lập của Naidan để tinh chỉnh thứ tự thời gian cho vẫy tay, hoàn thành, tiếp đất, ôm vịt và ngủ ngắn.
- Chuyển đổi điểm tựa mượt mà khi nhấc bổng và tiếp đất, giảm hiện tượng xoay chuyển đột ngột.

### v0.4.0 · Nhấp chuột, Nhấp liên tục & Nhấn giữ tương tác

- Nhấp 1 lần vẫy tay, nhấp đúp ôm vịt lắc lư, nhấp 3 lần ôm sổ né tránh, nhấp 6 lần phát chuỗi động tác kết hợp.
- Nhấn giữ vào giấc ngủ ngắn; kéo thả, trạng thái nhiệm vụ và nhấp chuột xử lý riêng biệt, không tính việc kết thúc kéo thả thành cú nhấp bổ sung.
- Sổ tay nhỏ đổi tên thành “Sổ tay của Erii”, bỏ số phiên bản trong tiêu đề trang.
- Trang nhiệm vụ giữ lại chuột phải, cài đặt tiện ích và phím tắt bàn phím.

### v0.3.1 · Giảm tải kéo thả, Dọn dẹp tư liệu & Nối liền động tác

- Khi kéo thả chỉ cập nhật tọa độ và độ lắc lư, không còn lặp lại việc đọc kích thước trang hay viết lại chữ nhiệm vụ ở mỗi frame.
- Bong bóng và Sổ tay nhỏ tách biệt vị trí với pet, giảm rung giật và che khuất khi kéo thả.
- Hoạt ảnh nhịp thở chạy độc lập; chuyển tiếp đổi ảnh, độ lắc khi nhấc bổng và giảm tốc khi ngồi vững được căn chỉnh lại.
- Sửa lỗi mảnh vụn và lẹm viền trong 7 bức ảnh: Viết ghi chép, uống trà, vươn vai, bị nhấc bổng, ngồi vững, vẫy tay, nhòm ngó.
- Thống nhất sử dụng WebP trong suốt không nén 384×384; động tác ôm vịt giữ lại chú vịt trong tay.

### v0.3.0 · Kéo thả, Lưu vị trí & Tư liệu độ nét cao

- Hỗ trợ kéo thả bằng chuột và cảm ứng, giới hạn biên giới, hít mép màn hình và lưu vị trí.
- Tự động né tránh khung nhập khi cửa sổ thu hẹp, xoay ngang dọc hoặc bàn phím ảo bật lên.
- Thêm các tư thế bị nhấc bổng, ngồi vững, chào hỏi và nhòm ngó; Sổ tay nhỏ có thể chọn các động tác thư giãn.
- Tải trước ảnh, chuyển đổi sau khi giải mã và giảm tốc liên tục chạy độc lập với việc thăm dò CSDL.
- Sử dụng 16 bức ảnh WebP trong suốt không nén 384×384, không còn phóng to ảnh nén 192 pixel cũ.

### v0.2.0 · Phiên bản Tiện ích mở rộng độc lập

- Đổi từ giải pháp “thay thế mã nguồn CSDL” thành tiện ích mở rộng SillyTavern độc lập.
- Đọc trạng thái giao diện hiện tại của CSDL thông qua bộ quan sát chỉ đọc (read-only observer).
- Không sao chép CSDL, không sửa đổi logic nghiệp vụ CSDL, không cần tự điền API riêng.
- Bổ sung cài đặt độc lập, vị trí pet, Sổ tay nhỏ và phản hồi nhiệm vụ cơ bản.

### v0.1.1 · Phiên bản thử nghiệm Windows (Đã bãi bỏ)

- Đây là gói thử nghiệm cục bộ Windows thời kỳ đầu, phụ thuộc vào cách kết nối cổng cũ.
- Phiên bản này không phải là gói cài đặt tiện ích độc lập hiện tại trên GitHub, không sử dụng tiếp.

### v0.1.0 · Phiên bản thử nghiệm đầu tiên (Đã bãi bỏ)

- Đây là phiên bản thử nghiệm bản vá giao diện CSDL ban đầu.
- Cần sửa đổi lối vào của CSDL, sau đó đã bị giải pháp tiện ích mở rộng độc lập thay thế hoàn toàn.
- Kho lưu trữ và hướng dẫn cài đặt hiện tại không còn sử dụng phiên bản này nữa.

## Nâng cấp dữ liệu lưu trữ & Quay về bản cũ

v0.9.3 sử dụng `life.schema = 3`, bổ sung thêm `tickets`, `ticketsEarned`, `ticketsSpent` vào ví tiền ban đầu; thay đồ sử dụng `skins.schema = 2`, bổ sung `spentTickets`. Lưu trữ cũ tự động đọc được, vé hoa mới mặc định là 0, không xóa xu vàng, hoạt động, trò chuyện, nuôi dưỡng hay trang phục đã sở hữu.

v1.0.0 bảo toàn hội thoại ban đầu trong các trường `history` / `repair`..., bổ sung thêm `conversationSchema = 1`, `conversations`, `mainTitle` và `activeConversation`; các hội thoại mới thêm được lưu độc lập. Việc mở khóa mật ngữ của Zero lưu vào `skins.owned.zero` sẵn có, không lưu mật ngữ do người dùng nhập. Khi hạ cấp về bản cũ rồi lưu lại, bản cũ có thể làm mất các hội thoại mới thêm cùng các trường suy nghĩ; trước khi hạ cấp vui lòng xuất file JSON của từng hội thoại.

Bản cũ không nhận diện các trường vé hoa, **hạ cấp về bản cũ rồi lưu lại có thể làm mất số dư vé hoa mới, giá trị tích lũy và nhật ký quy đổi**. Trước khi chuẩn bị hạ cấp vui lòng sao lưu dữ liệu tài khoản SillyTavern trước. Việc chỉ tắt tiện ích này hoặc đổi về trang phục mặc định sẽ không làm mất số dư và trang phục.

## Cài đặt và Khôi phục

Trong cài đặt tiện ích mở rộng của SillyTavern có thể điều chỉnh:

- Pet hiện tại (Erii / Zero / Naidan) và lối vào Ngôi nhà Pet;
- Công tắc hiển thị pet;
- Kích thước pet;
- Động tác lúc rảnh rỗi;
- Nhòm ngó mép màn hình;
- Tự động kể chuyện chữa lành (nghe chuyện thủ công vẫn dùng được);
- Có ẩn Naidan gốc và bong bóng gốc hay không;
- Nội dung nhiệm vụ bản tóm tắt / bản đầy đủ;
- Nói chuyện khi làm nhiệm vụ;
- Công tắc chỉ số nhu cầu (độ no, vệ sinh);
- Hiệu ứng đặc biệt: Tự động / Lộng lẫy / Tối giản / Tắt;
- Công tắc Quan sát đồng hành và tần suất bình luận (mỗi 1～20 tầng);
- Số tầng văn bản đính kèm khi bảo trì (0～10 tầng);
- Mở cửa sổ chat và cấu hình kết nối, xưng hô, mối quan hệ trong cửa sổ chat;
- Đặt lại vị trí pet.

Sau khi tắt hoặc gỡ bỏ tiện ích này, chỉ cần làm mới SillyTavern là sẽ khôi phục lại hiển thị pet CSDL gốc ban đầu. Bản thân CSDL không cần rollback, cũng không được dùng gói thử nghiệm cũ để ghi đè lối vào CSDL.

## Phạm vi tương thích và Ranh giới kiểm chứng

- SillyTavern mục tiêu: **1.14.0–1.19.0**.
- 1.14.0–1.16.0: Lối vào tự động chờ giao diện cài đặt của SillyTavern.
- 1.17.0–1.19.0: Sử dụng callback vòng đời do SillyTavern cung cấp, có bảo vệ đơn thực thể (single instance).
- Chi tiết tương thích xem tại [`COMPATIBILITY.md`](COMPATIBILITY.md).

Kiểm tra tệp và kiểm tra trình duyệt cô lập chỉ chứng minh mã nguồn, danh mục, nhiệm vụ mô phỏng và bố cục đạt kỳ vọng, không thể thay thế việc nghiệm thu thực tế trên SillyTavern của bạn. Những điểm sau vẫn cần xác nhận trong môi trường của bạn:

- Sau khi cập nhật GitHub, SillyTavern có thực sự tải phiên bản `1.0.1` hay không;
- Phiên bản CSDL của bạn có còn cung cấp trạng thái giao diện tương thích hay không;
- Thúc đẩy cốt truyện, điền bảng, thành công, lỗi và dừng nhiệm vụ thực tế;
- Khi dùng mô hình thực tế, phiếu chỉnh sửa do chế độ bảo trì đưa ra có hợp lý hay không (vui lòng xem kỹ từng mục trước khi tích chọn ghi vào);
- Cảm giác chạm vuốt và hiệu ứng bật bàn phím trên điện thoại thực tế.

## Câu hỏi thường gặp (FAQ)

### Tại sao có trang phục mới nhưng không mặc được ngay

Bộ Dạ Lễ Nguyệt Độc của Erii cần phải mua, tích lũy từ 0 vé hoa sẽ cần 258 xu vàng để đổi vé. Trang phục Hoàng Nữ của Zero cần vào Cửa hàng chọn Zero và nhập mật ngữ để mở khóa, không tốn tiền. Cả hai trường hợp sau khi sở hữu đều phải nhấn «Vào tủ đồ để mặc» rồi mới đổi đồ thủ công được.

### Sau khi cập nhật không thấy trang phục, hoặc đổi đồ xong bị thiếu ảnh

Xác nhận SillyTavern đã tải đúng bản 1.0.1, và kiểm tra xem kho lưu trữ đã tải lên đầy đủ 27 ảnh WebP của từng bộ trang phục hay chưa. Chỉ cập nhật README, manifest hay mã nguồn code sẽ không tự động bù đắp tài nguyên hình ảnh. Sau khi tải lên đầy đủ, hãy cập nhật lại tiện ích và buộc làm mới cache trình duyệt.

### Sau khi cập nhật Erii vẫn tự ý di chuyển

Trước tiên hãy kiểm tra phiên bản trong danh sách tiện ích mở rộng của SillyTavern. Nếu không phải bản mới nhất `1.0.1`, tức là SillyTavern vẫn đang chạy gói cũ; hãy bấm cập nhật lại và làm mới trang. `v0.5.7` trở về trước có chứa logic tự di chuyển, từ `v0.5.8` trở đi đã loại bỏ hoàn toàn.

### GitHub hiển thị phiên bản mới nhưng SillyTavern vẫn là hành vi cũ

Tệp trên GitHub đã cập nhật không đồng nghĩa với việc SillyTavern đã tải lại. Vui lòng thực hiện tuần tự: Quản lý tiện ích bấm Cập nhật → Làm mới trang → `Ctrl+F5`. Sau đó kiểm tra phiên bản trong danh sách tiện ích của SillyTavern, chứ không chỉ nhìn tiêu đề Sổ tay nhỏ; tiêu đề Sổ tay nhỏ từ v0.4.0 trở đi không còn hiển thị số phiên bản.

### Pet hiển thị rồi nhưng báo chưa kết nối cơ sở dữ liệu

Xác nhận CSDL gốc vẫn đang chạy bình thường và không bị thay thế bằng lối vào thử nghiệm cục bộ. Khuyến nghị giữ nguyên Naidan gốc và bong bóng nhiệm vụ gốc của CSDL chạy ngầm, chỉ ẩn chúng đi trong cài đặt tiện ích này. Khi cấu trúc giao diện CSDL thay đổi, pet sẽ chờ đợi hoặc cảnh báo không tương thích chứ không giả mạo trạng thái “Đã kết nối”.

### Tại sao không đổi sang Naidan được

Hình ảnh của Naidan lấy từ CSDL đang chạy. Vui lòng xác nhận CSDL đã được bật, và pet tích hợp sẵn của nó chưa bị tắt; trước khi đọc được ảnh, Ngôi nhà Pet sẽ ghi rõ nguyên nhân và nhân vật cũ sẽ tiếp tục đồng hành cùng bạn.

### Bảo trì sửa nhầm dữ liệu thì phải làm sao

Bên dưới phiếu chỉnh sửa đó bấm **Hoàn tác**, bảng dữ liệu sẽ trở về trạng thái trước khi ghi. Trang web dù đã làm mới vẫn có thể hoàn tác (bản sao lưu nằm trong bộ nhớ trình duyệt); nếu trình duyệt không cho phép lưu, giao diện sẽ cảnh báo, bạn có thể bấm **Tải bản sao lưu** trước. Trước khi hoàn tác nếu bảng dữ liệu lại bị CSDL sửa tiếp, hệ thống sẽ cảnh báo bạn trước.

### Tại sao tính năng Quan sát đồng hành mãi không lên tiếng

Xác nhận trong cài đặt tiện ích đã bật **Quan sát đồng hành**, và sau khi bật số tầng mới xuất hiện đã đủ tần suất bình luận đã cài đặt; hai lần bình luận cách nhau tối thiểu 60 giây, nếu CSDL đang điền bảng sẽ đợi một chút. Bên dưới mục **Đồng hành và Bảo trì** trong cài đặt sẽ hiển thị thời gian bình luận lần trước hoặc nguyên nhân chưa thành công.

### Trên điện thoại không có chuột phải, làm sao mở Sổ tay nhiệm vụ

Chạm nhanh để tương tác, nhấn giữ khoảng nửa giây để ngủ ngắn, tiếp tục nhấn giữ khoảng 1.4 giây để mở Sổ tay nhỏ; bạn cũng có thể nhấp vào “Xem sổ tay nhiệm vụ” từ cài đặt tiện ích của SillyTavern.

## Tài nguyên & Bản quyền cấp phép

Tạo hình của Erii tham khảo [Tư liệu pet màn hình Erii của Cardwright](https://github.com/1798547983tt/Cardwright/tree/359019715afc60813384964b023a09c6dd6ed326/assets/pets/erii). Các ảnh động tác do ImageGen tạo và chỉnh sửa cục bộ, ảnh động tác gốc là WebP trong suốt không nén, tranh sinh hoạt v0.7.0 là WebP nén chất lượng cao giữ kênh trong suốt. Tư liệu mỹ thuật là nội dung đồng nhân phi chính thức của «Long Tộc», sử dụng theo điều kiện phi thương mại và ghi công tác giả trong [`assets/NOTICE.md`](assets/NOTICE.md); mã nguồn chương trình sử dụng giấy phép MIT, MIT không bao quát tư liệu mỹ thuật. Bộ Dạ Lễ Nguyệt Độc tham khảo tranh trang phục Erii Tsukuyomi trong «Long Tộc» do người dùng cung cấp, được tạo bởi ImageGen; chi tiết và phạm vi sử dụng xem tại [`Mô tả chất liệu trang phục`](assets/skins/erii-purple-night/NOTICE.md).

Ảnh động tác của Zero do ImageGen tạo theo 2 bảng tư thế, phóng to qua Real-ESRGAN (Anime model) rồi cắt bằng `tools/slice-pose-sheet.py`, ghi công và cấp phép xem tại [`assets/zero/NOTICE.md`](assets/zero/NOTICE.md). Hình ảnh của Naidan thuộc về CSDL, tiện ích này chỉ đọc các ảnh đã nạp trong lúc chạy, không sao chép, không phân phối.

Tham khảo Cơ sở dữ liệu: [AlbusKen/shujuku](https://github.com/AlbusKen/shujuku).