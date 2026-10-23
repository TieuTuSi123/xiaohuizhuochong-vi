# Link gốc: https://github.com/dzsks/xiaohuizhuochong

# Erii · Desktop Pet Cơ Sở Dữ Liệu (Database Desktop Pet)

Đây là tiện ích mở rộng (extension) độc lập được cài đặt vào SillyTavern. Nó sẽ đọc trạng thái tác vụ và thông báo kết quả đang hiển thị từ tiện ích **「Long Huyết Huyền Hoàng · Cơ sở dữ liệu」** (Longxue Xuanhuang Database), sau đó điều khiển Desktop Pet phản ứng thông qua các động tác, tương tác nhấp chuột, bong bóng tác vụ và câu thoại riêng. Bạn có thể tự do chuyển đổi giữa **Erii (Tiểu Hội), Zero, Naidan (Nãi Đán) và Claude (Tiểu Khắc)**; mỗi nhân vật đều sở hữu tính cách, lời thoại, nhật ký nuôi dưỡng và lịch sử trò chuyện độc lập. Ngoài ra, bạn cũng có thể mở cửa sổ riêng để trò chuyện cùng pet bằng API hiện tại của SillyTavern hoặc một API được cấu hình riêng.

---

## Phiên bản hiện tại: v1.0.2

**21-10-2026: Bổ sung nhân vật Desktop Pet thứ tư —「Tiểu Khắc」(Claude).**  
Cô ấy là một nàng đại tiểu thư tri thức tóc cam được nhân hóa dựa trên nguyên mẫu AI Claude của Anthropic, mê đọc sách, thích hồng trà, hễ nghiêm túc là viết rất dài, trong lòng thường ôm một chú gấu bông ngôi sao nhỏ màu cam (Tiểu Tinh Mang). Khác với phong cách Chibi của 3 nhân vật trước, Tiểu Khắc được vẽ theo tỷ lệ cơ thể chuẩn. Cô có 26 ảnh động tác và sinh hoạt riêng, khoảng 150 câu thoại cục bộ, 5 bậc danh hiệu, 4 mẩu truyện ngắn độc quyền và thiết lập tính cách trò chuyện, mối quan hệ mặc định là "Chấp sự riêng". Chỉ cần mở "Ngôi nhà Desktop Pet", lật đến trang của cô ấy và bấm **Đổi cô ấy sang bầu bạn** là xong. Hình ảnh, lời thoại, dữ liệu lưu và trang phục của 3 nhân vật trước hoàn toàn không thay đổi.

- **Thiết lập tính cách khi trò chuyện**: Tiểu Khắc biết mình là Desktop Pet lấy Claude làm nguyên mẫu, thỉnh thoảng sẽ trêu đùa nhẹ nhàng; khi được hỏi "Bạn có phải là Claude thật không?", cô sẽ giải thích rằng câu trả lời thực tế đến từ mô hình bạn kết nối trong khung chat, không mạo nhận.
- **Trang phục**: Phiên bản này chỉ có trang phục mặc định, chưa có trang phục trong Cửa hàng.

---

**v1.0.1 (16-10-2026) tiếp tục duy trì: Trò chuyện được gom chung trong một cửa sổ duy nhất để tạo mới, chuyển đổi và nhập file; kích thước pet trên điện thoại không còn bị giới hạn ở 72px.**  
Vị trí cửa sổ, kích thước mở rộng, các bản nháp và vị trí đọc được giữ nguyên. Bổ sung hiển thị số pixel kích thước và nút khôi phục kích thước mặc định, thao tác kéo thanh trượt liên tục được tối ưu xử lý gộp theo khung hình làm mới. Các bản sửa lỗi tự kiểm tra của v1.0.0 tiếp tục được giữ nguyên.

---

**Tiếp tục duy trì: Trang phục「Hoàng nữ Zero · Băng Lam Tường Vi」mở khóa bằng mật ngữ; khung chat bổ sung vùng suy nghĩ mặc định thu gọn, hỗ trợ nhiều cuộc hội thoại độc lập và nhập/xuất dữ liệu. Bản ghi cũ được bảo toàn.**

- **Trang phục mới của Zero**: Mở Cửa hàng → Chọn Zero → Nhập mật ngữ → Xác nhận mở khóa → Vào Tủ đồ để thay. Không tốn vàng hay phiếu hoa, không tự động mặc vào. Mật ngữ là: **`这一路上我们不会彼此抛弃，不彼此出卖，直到死亡的尽头`** *(Xin giữ nguyên dấu phẩy tiếng Trung giữa câu, không thêm dấu chấm ở cuối)*.
- **Nhiều cuộc trò chuyện**: Bấm nút「Cuộc trò chuyện mới」ở đầu khung chat. Cả máy tính và điện thoại đều chuyển đổi ngay trong một cửa sổ duy nhất, không mở nhiều cửa sổ hay nhảy vị trí; cuộc trò chuyện được chuyển đi vẫn có thể tiếp tục chờ phản hồi chạy ngầm. Lịch sử, bản nháp, cài đặt, trả lời lại và dừng phản hồi của mỗi cuộc trò chuyện đều độc lập.
- **Thu gọn suy nghĩ (Reasoning)**: Nội dung suy nghĩ do interface trả về được đặt trong「Quá trình suy nghĩ · Bấm để mở rộng」, mặc định thu gọn. Thẻ suy nghĩ trong bản ghi cũ cũng được dọn dẹp; nội dung interface không trả về sẽ không bị bịa đặt thêm. Lượt chat kế tiếp chỉ mang theo nội dung văn bản chính, không mang phần suy nghĩ này.
- **Nhập / Xuất dữ liệu**: Mặc định xuất file JSON có thể nhập lại; trong mục「Quản lý」có thể đổi sang xuất TXT. Bấm「Nhập」để chọn file JSON, JSONL của SillyTavern hoặc TXT phiên bản cũ, xem trước số lượng tin nhắn rồi xác nhận, luôn được lưu thành một cuộc trò chuyện mới.

---

**Mua quần áo**: Nhấp chuột phải (máy tính) / Nhấn giữ khoảng 1.4 giây (điện thoại) để mở Cuốn sổ nhỏ → **Cửa hàng · Mua quần áo mới** → **Đi đổi phiếu hoa** → Nhập số lượng vàng → **Đổi phiếu hoa** → **Mua quần áo** → **Vào Tủ đồ để thay**. Nút mua đồ luôn hiển thị cố định ở đáy Cửa hàng.

Trang phục **Tsukuyomi · Dạ Lễ Phục Tím** của Tiểu Hội vẫn có giá **10.320 phiếu hoa**, tỷ lệ **1 vàng đổi 40 phiếu hoa**, tích lũy từ 0 phiếu hoa cần **258 vàng**. Trang phục mới của Zero không cần mua hay đổi phiếu. Cả hai bộ trang phục đều có 27 ảnh động tác và sinh hoạt riêng; ví tiền, hoạt động, trò chuyện và dữ liệu nuôi dưỡng cũ tiếp tục được sử dụng.

---

**Sáu bản sửa lỗi từ v0.9.2 tiếp tục được duy trì:**

- Gợi ý kiểm tu được tạo dựa trên snapshot bảng tại thời điểm gửi yêu cầu; chuyển đổi đoạn chat khi đang chờ phản hồi sẽ vô hiệu hóa yêu cầu cũ. Trong cùng một đoạn chat nếu chỉ chèn/sắp xếp lại hàng, hệ thống vẫn định vị đúng hàng cũ theo `row_id`, nếu giá trị gốc đã thay đổi sẽ từ chối ghi đè.
- Sau khi sao lưu hoàn tất, trước khi ghi từng mục và trước khi hoàn tác nhập liệu, hệ thống sẽ kiểm tra lại phiên chat, nguồn cơ sở dữ liệu và trạng thái bận; trên cùng một trang tại một thời điểm chỉ thực hiện một tác vụ ghi/hoàn tác kiểm tu. Khi thành công một phần, hệ thống sẽ giữ lại kết quả từng mục và bản sao lưu.
- Trước khi xóa hàng phải đối chiếu toàn bộ nội dung hàng và tiêu đề cột, trước khi chuyển preset phải đối chiếu preset gốc. Danh sách xóa hàng tạo từ bản cũ thiếu giá trị gốc hoàn chỉnh sẽ nhắc tạo lại; sau khi nâng cấp khuyến nghị kiểm tra lại các gợi ý cũ chưa áp dụng.
- Khi cơ sở dữ liệu đang bận, tính năng hoàn tác thông thường và "Vẫn muốn hoàn tác" tạm thời bị vô hiệu hóa; hoàn tác cưỡng chế chỉ có thể bỏ qua xác nhận "bảng đã thay đổi về sau", không thể bỏ qua bước kiểm tra nguồn chat và trạng thái bận.
- Khi tắt tính năng chỉ số nhu cầu, hệ thống sẽ đóng băng mức no/sạch tại đúng thời điểm tắt, khi bật lại sẽ bắt đầu tính thời gian từ mốc mới.
- Tắt chế độ quan sát trò chuyện, ẩn Desktop Pet hoặc đổi cuộc trò chuyện sẽ hủy bỏ bình luận quan sát đang chờ; dù interface có phản hồi muộn cũng không lưu vào lịch sử và không hiện bong bóng cũ. Yêu cầu trò chuyện thông thường vẫn hoàn toàn độc lập.

Khung thay đồ của v0.9.1 tiếp tục được giữ lại: Erii có Dạ Lễ Phục Tím, Zero có trang phục Hoàng nữ mở khóa bằng mật ngữ, Naidan vẫn dùng trang phục mặc định.

Chế độ kiểm tu cơ sở dữ liệu và bạn đồng hành quan sát từ v0.9.0; ba nhân vật (Erii / Zero / Naidan), Ngôi nhà Desktop Pet, hệ thống nuôi dưỡng, lời thoại tác vụ, mở nhanh bảng cơ sở dữ liệu và giao diện sổ tay bìa cứng từ v0.8.0 đều được giữ nguyên vẹn.

- **Chỉ có 2 trường hợp hệ thống đọc văn bản chính của SillyTavern, và cả hai đều cần bạn chủ động bật**: Chế độ kiểm tu (mỗi lần gửi tin nhắn sẽ đính kèm từ 0～10 tầng gần nhất, có thể tùy chỉnh) và Chế độ quan sát (sau khi bật chỉ đọc các tầng mới xuất hiện). Nội dung đọc được chỉ gửi riêng cho interface trò chuyện của Desktop Pet.
- **Chỉ có Chế độ kiểm tu mới có quyền sửa đổi cơ sở dữ liệu**: Từng mục đều cần bạn tích chọn và nhấn **Áp dụng mục đã chọn** mới được ghi; việc ghi chỉ thông qua API công khai `AutoCardUpdaterAPI`, luôn sao lưu toàn bộ trước khi ghi và có thể hoàn tác. Hoàn toàn không có cơ chế tự động áp dụng.
- Ngoài ra, mọi hoạt động khác đều là đồng bộ chỉ đọc: Không sao chép, không thay thế cơ sở dữ liệu, bình thường không đọc/ghi bảng biểu.
- Vị trí của Desktop Pet chỉ thay đổi khi người dùng kéo thả thủ công; không khôi phục tính năng tự động di chuyển.
- Hình ảnh của Naidan được đọc trực tiếp từ cơ sở dữ liệu đang chạy trong runtime, không phân phối kèm tiện ích mở rộng này; không thể đổi sang Naidan khi chưa bật cơ sở dữ liệu.
- Phiếu hoa được đổi thủ công từ tiền vàng trong Sổ tay sinh hoạt, mua trang phục sẽ trừ phiếu hoa. Lối chơi đời sống không gọi API, không đọc/ghi cơ sở dữ liệu hay văn bản chính SillyTavern.

*Lưu ý: Các phiên bản cũ từng bổ sung tính năng tự di chuyển, chạy nhảy và đi dạo. Những logic đó đã được loại bỏ hoàn toàn từ **v0.5.8**, không nên nhầm lẫn hành vi của bản cũ với phiên bản hiện tại.*

---

## Cách kiểm tra xem kho GitHub đã là bản mới nhất chưa

Đối chiếu 4 vị trí dưới đây, tất cả đều hiển thị `1.0.2` mới chứng minh mã nguồn bảo trì đã được cập nhật hoàn chỉnh:

1. Mở file [`manifest.json`](manifest.json) ở thư mục gốc của kho lưu trữ, kiểm tra xem `version` có phải là `1.0.2` không.
2. Kiểm tra dòng "Phiên bản hiện tại" ở đầu tệp README này có phải là **v1.0.2** hay không.
3. Kiểm tra commit gần nhất trên GitHub có chứa các file được chỉnh sửa lần này không; v1.0.2 bắt buộc phải có `characters/claude.js`, `characters.js` đã cập nhật, `index.js`, `style.css`, cùng 19 ảnh dưới `assets/claude/`, 7 ảnh WebP dưới `assets/claude/life/` và `assets/claude/NOTICE.md`; đồng thời vẫn giữ lại `chat-workspace.js`, `chat-history.js`, `mall-window.js` của v1.0.1, các file cập nhật từ v1.0.1 gồm `notebook.js`, `icons.js`, `life-model.js`, `life-window.js`, `skin-model.js`, `index.js`, `style.css`, cùng **27 ảnh WebP, hướng dẫn tài nguyên và manifest** của mỗi trang phục trong `assets/skins/erii-purple-night/` và `assets/skins/zero-ice-rose/`; giữ lại các file từ v0.9.0 (`repair.js`, `repair-ticket.js`, `database-repair.js`, `backup-store.js`, `watch.js`), thư mục `characters/` từ v0.8.0, `characters.js`, `care-model.js`, `lines.js`, `notebook.js`, `pet-house.js`, `sheet.js`, `effects.js`, `icons.js`, `database-shortcuts.js`, cùng 19 ảnh dưới `assets/zero/`, 7 ảnh WebP dưới `assets/zero/life/`; các file `assets/run-*.webp` đã bị xóa bỏ.
4. Nếu dùng file nén zip, tên file phải là `绘梨衣桌宠-独立扩展-v1.0.2.zip`, sau khi giải nén file `manifest.json` bên trong vẫn phải ghi `1.0.2`.

Phiên bản hiển thị trong danh sách tiện ích mở rộng của SillyTavern là phiên bản thực tế đang được tải. Chỉ nhìn thấy README trên GitHub cập nhật thì chưa chứng minh SillyTavern đã nạp bản mới; hãy cập nhật tiện ích, làm mới trang rồi đối chiếu số phiên bản bên trong SillyTavern.

---

## Cài đặt trực tiếp trong SillyTavern

1. Mở menu **Extensions (Tiện ích mở rộng)** ở trên cùng SillyTavern → **Install Extension (Cài đặt tiện ích mở rộng)**.
2. Dán đường dẫn kho lưu trữ: `https://github.com/dzsks/xiaohuizhuochong`.
3. Sau khi cài đặt hoặc cập nhật hoàn tất, hãy làm mới (F5) trang SillyTavern.
4. Trong danh sách tiện ích, xác nhận phiên bản của **Erii · Database Desktop Pet** là `1.0.2`.
5. Nhấp chuột phải vào pet (máy tính) hoặc nhấn giữ khoảng 1.4 giây (điện thoại) để mở Cuốn sổ nhỏ; nếu thấy chữ "Đã kết nối cơ sở dữ liệu" hoặc "Cơ sở dữ liệu đang xử lý tác vụ", nghĩa là đã tìm thấy nguồn dữ liệu.

*Thư mục gốc của kho lưu trữ phải chứa trực tiếp các tệp `manifest.json`, `index.js`, `style.css`, không được lồng thêm một thư mục cha bên ngoài. Hình ảnh nằm bên trong thư mục `assets/` tại gốc.*

---

## Cập nhật bản cài đặt hiện có

### Cập nhật qua kho lưu trữ GitHub

1. Giải nén gói zip mới, tải đè các tệp bên trong lên cùng thư mục gốc của kho lưu trữ GitHub của bạn, giữ nguyên cấu trúc thư mục của `assets/`. Hãy tải lên các tệp đã giải nén, đừng chỉ up mỗi file ZIP vào kho.
2. Commit các thay đổi lên GitHub.
3. Quay lại trang Quản lý tiện ích mở rộng của SillyTavern, bấm nút cập nhật của tiện ích này.
4. Làm mới trang SillyTavern, xác nhận phiên bản trong danh sách là `1.0.2`.
5. Nếu hành vi hoặc hình ảnh vẫn là bản cũ, trước tiên hãy tải lại tiện ích mở rộng; nếu vẫn chưa đổi, hãy dùng tổ hợp phím `Ctrl + F5` để xóa sạch cache trình duyệt.

### Kiểm tra qua tệp nén

Gói bảo trì hiện tại: `绘梨衣桌宠-独立扩展-v1.0.2.zip`.

Sau khi giải nén kiểm tra:
- `manifest.json` có `version` là `1.0.2`;
- Đánh dấu phiên bản pet trong `index.js` là `1.0.2`;
- Thư mục gốc có `mall-window.js` và `skin-model.js`, giá Dạ Lễ Phục Tím là 10320, loại thanh toán là `tickets`;
- `assets/skins/erii-purple-night/` và `assets/skins/zero-ice-rose/` mỗi thư mục đều có đủ 27 ảnh WebP, nếu thiếu ảnh không được chỉ tải lên mỗi code;
- Trong `assets/` không có frame chạy trái/phải, các thư mục `assets/zero/`, `assets/zero/life/`, `assets/claude/` và `assets/claude/life/` đều tồn tại đầy đủ, trong `characters/` có `claude.js`;
- Đầu file README và mục mới nhất trong lịch sử phiên bản đều là `v1.0.2`.

### Cách xử lý khi GitHub báo tải lên quá nhiều tệp

- **Nếu đã cập nhật hoàn chỉnh lên v1.0.1**: Hãy dùng gói **`绘梨衣桌宠-v1.0.1到v1.0.2-更新包.zip`**. Gói này gồm 38 tệp: 8 tệp chỉnh sửa (`README.md`, `COMPATIBILITY.md`, `manifest.json`, `index.js`, `characters.js`, `style.css` ở thư mục gốc, cùng `assets/NOTICE.md`, `tools/slice-pose-sheet.py`), bổ sung mới `characters/claude.js`, 2 danh sách tên cắt ảnh, 26 ảnh WebP dưới `assets/claude/` và thuyết minh tài nguyên. Sau khi giải nén, kéo cả tệp và thư mục thả vào trang tải lên ở thư mục gốc của kho lưu trữ, giữ nguyên các tệp sẵn có. Nếu vẫn đang ở v1.0.0 hoặc cũ hơn, trước tiên hãy cập nhật lên v1.0.1 theo hướng dẫn dưới đây, rồi mới tải gói này.
- **Nếu đã cập nhật hoàn chỉnh lên v1.0.0**: Ưu tiên dùng gói **`绘梨衣桌宠-v1.0.0到v1.0.1-更新包.zip`**, chỉ cần tải lên 9 tệp ở thư mục gốc là xong, đợt này hình ảnh không thay đổi.
- **Nếu đã có sẵn kho lưu trữ hoàn chỉnh v0.9.1–v0.9.4**: Có thể dùng gói **`绘梨衣桌宠-GitHub更新包-v1.0.1.zip`**. Gói này có 82 tệp, chứa toàn bộ các bổ sung/sửa đổi từ nền tảng bảo trì v0.9.1: 6 bản sửa lỗi, 2 bộ trang phục mới, Cửa hàng và Đa hội thoại. Sau khi giải nén, kéo tệp và thư mục `assets` vào trang tải lên của thư mục gốc, giữ nguyên tệp cũ, commit rồi vào SillyTavern bấm cập nhật tiện ích. Gói này cần các file sẵn có khác trong kho, không thể dùng độc lập để cài mới hoàn toàn.
- **Tạo kho mới hoặc kho cũ không đầy đủ**: Dùng gói đầy đủ **`绘梨衣桌宠-独立扩展-v1.0.2.zip`** (183 tệp). Khi tải lên web có thể chia thành 3 đợt: Đợt 1 gồm 2 bộ trang phục trong `assets/skins/` (58 tệp); Đợt 2 gồm các tài nguyên khác trong `assets` (bao gồm cả Tiểu Khắc, 82 tệp); Đợt 3 gồm thư mục gốc, `characters/` và `tools/` (43 tệp); mỗi đợt đều dưới 100 tệp. Tải và commit từng đợt một, cuối cùng đảm bảo thư mục gốc có trực tiếp `manifest.json`, `index.js`, `mall-window.js` và `assets`.

---

## Các tính năng khả dụng hiện tại

### Thao tác chạm và tương tác

| Thao tác | Phản ứng của Desktop Pet (lấy Tiểu Hội làm ví dụ) |
| --- | --- |
| Chạm nhẹ một lần | Vẫy tay đáp lại |
| Nhấp đúp nhanh | Ôm vịt vàng nhỏ lắc lư nhẹ |
| Nhấp 3 lần trở lên trong 1.2 giây | Ôm cuốn sổ nhỏ trốn đi |
| Nhấp 6 lần trong 2.6 giây | Ló đầu → Ôm vịt → Vẫy tay, phát xong trở lại bình thường |
| Nhấn giữ khoảng 0.5 giây | Bắt đầu chợp mắt nghỉ ngơi; thả tay ra nghỉ tiếp khoảng 12 giây |
| Chạm nhẹ khi đang nghỉ | Đánh thức dậy sớm |
| Kéo thả | Bị nhấc bổng lên, thả tay ra sẽ ngồi vững và lưu lại vị trí mới |
| Nhấp chuột phải (máy tính) | Mở / Đóng Cuốn sổ nhỏ |

Zero, Naidan và Tiểu Khắc có phương thức tương tác tương tự, chỉ thay bằng động tác đặc trưng của riêng mình: Zero ôm thiên nga đen nhỏ, gấp thiên nga giấy, uống cacao nóng; Tiểu Khắc ôm ngôi sao nhỏ, gấp hoa giấy, uống hồng trà; Naidan nhấp đúp sẽ sợ nhột, nhấp liên tục sẽ xù lông thở phì phò, nhấn giữ sẽ ngồi ngáy ngủ. Nhấp chuột, tặng hoa, cùng điền bảng đều giúp tăng độ thân mật (xem mục "Nuôi dưỡng"). Thỉnh thoảng chạm nhẹ, pet sẽ đáp lại một câu trong bong bóng thoại.

Tiêu đề Cuốn sổ nhỏ mang tên nhân vật hiện tại, ví dụ: **Cuốn sổ nhỏ của Erii**, **Cuốn sổ nhỏ của Zero**, **Cuốn sổ nhỏ của Claude**, không hiển thị số phiên bản. Nhấp chuột thông thường sẽ không mở trang; trên máy tính cũng có thể mở Cuốn sổ nhỏ từ cài đặt tiện ích mở rộng. Sau khi tắt "Hiển thị Desktop Pet", vẫn có thể mở Cuốn sổ nhỏ từ cài đặt để xem tác vụ và mở cơ sở dữ liệu; trong thời gian ẩn, các nút hành động thư giãn bị vô hiệu hóa. Khi focus vào pet, phím Enter / Space để tương tác, Shift + Enter để mở sổ, các phím mũi tên để vi chỉnh vị trí, Home để đặt lại vị trí ban đầu.

### Thao tác trên điện thoại

Điện thoại không có chuột phải, hãy sử dụng các thao tác sau:

- **Chạm nhẹ hoặc nhấn nhanh**: Tương tác;
- **Nhấn giữ khoảng 0.5 giây**: Chợp mắt nghỉ ngơi;
- **Tiếp tục nhấn giữ khoảng 1.4 giây**: Mở Cuốn sổ nhỏ;
- **Nhấn giữ và di chuyển**: Kéo thả pet đi nơi khác.

Khi khung nhập văn bản mở rộng, bàn phím bật lên, xoay màn hình hoặc cửa sổ bị thu hẹp, Desktop Pet sẽ tự động giới hạn vị trí trong vùng hiển thị khả dụng và chủ động tránh che khuất khung nhập liệu. Trên điện thoại, Cuốn sổ nhỏ, Khung chat, Sổ tay sinh hoạt và Ngôi nhà pet đều kéo trượt từ đáy màn hình lên, chỉ cần vuốt từ thanh trên cùng xuống là đóng; trên máy tính chúng là các cửa sổ nổi có thể kéo thanh tiêu đề, Cuốn sổ nhỏ luôn nằm sát cạnh pet và cố gắng không che khuất nhân vật.

### Kích thước Desktop Pet (Điện thoại và Máy tính)

Trong mục "Extensions" của SillyTavern, mở rộng phần cài đặt của tiện ích này, kéo thanh trượt **Kích thước Desktop Pet**. Phạm vi từ **56–112 pixel**, mỗi nấc 4px, bên cạnh hiển thị giá trị thực tế; nhấn **Khôi phục kích thước mặc định** để quay về **88 pixel**. Cả điện thoại và máy tính dùng chung giá trị lưu trữ này, giữ nguyên sau khi làm mới trang. Vùng hiển thị quá nhỏ sẽ tạm thời giới hạn kích thước để không tràn màn hình, cài đặt gốc không bị thay đổi.

Bản v1.0.1 đã gỡ bỏ giới hạn cố định 72px trên điện thoại, khắc phục triệt để lỗi chỉnh thanh trượt to lên nhưng hình không đổi. Vùng cảm ứng của thanh trượt được mở rộng, trên máy tính có thể focus vào thanh trượt rồi dùng phím mũi tên để vi chỉnh, Home/End để chỉnh về mức nhỏ nhất/lớn nhất. Thao tác kéo liên tục chỉ kích hoạt tái bố cục tối đa 1 lần mỗi khung hình làm tươi. Đổi kích thước không kích hoạt tự động di chuyển.

### Phản ứng với tác vụ cơ sở dữ liệu

- **Nhận tác vụ**: Giơ cao cuốn sổ nhỏ;
- **Đang xử lý tác vụ**: Chăm chú viết ghi chép;
- **Thành công**: Giơ bản ghi chép hoàn thành ra khoe;
- **Lỗi hoặc cảnh báo**: Kiểm tra lại ghi chép;
- **Trạng thái rảnh (Idle)**: Uống trà, đọc sách, gấp giấy, ôm vịt vàng, vươn vai, chợp mắt...

Bên cạnh động tác, pet còn nói một câu ở phía trên bong bóng tác vụ: Khi nhận việc, đang xử lý (khoảng 15 giây đổi câu khác), hoàn thành, gặp lỗi, hoặc khi bị bạn dừng lại đều có một bộ câu thoại riêng; các tác vụ điền bảng, thúc đẩy cốt truyện và tác vụ khác nhau cũng có câu thoại khác nhau. Lời thoại biến đổi theo tính cách nhân vật, độ thân mật và tâm trạng, ví dụ khi đói bụng pet sẽ càu nhàu một câu rồi mới làm tiếp. Toàn bộ lời thoại đều là văn bản có sẵn trong code cục bộ, không gọi API, không tốn tiền. Dòng chữ nhỏ bên dưới vẫn là tiến độ thực tế do cơ sở dữ liệu trả về (cài đặt bản tóm tắt / bản đầy đủ vẫn giữ nguyên). Mục "Nói chuyện khi làm tác vụ" trong cài đặt có thể tắt tính năng thoại này.

Khi gặp lỗi hoặc cảnh báo, bong bóng sẽ dừng lại lâu hơn một chút (khoảng 9 giây), kèm thêm nút **Đi xem thử**: Lỗi dạng interface (API, key, hạn mức quota, timeout...) sẽ mở bảng API của cơ sở dữ liệu; các lỗi khác sẽ mở nhật ký vận hành trong "Công cụ nâng cao".

Phản ứng khi đang xử lý tác vụ và thông báo thành công/lỗi luôn được ưu tiên hơn các động tác thư giãn cục bộ. Khi bong bóng cung cấp nút dừng tác vụ gốc của cơ sở dữ liệu, Tiểu Hội sẽ hiển thị nút **Dừng tác vụ**, bấm vào sẽ kích hoạt quy trình dừng gốc của cơ sở dữ liệu; nếu cơ sở dữ liệu không có tính năng dừng thì sẽ không hiển thị nút giả mạo. Mục tiêu dừng luôn bám sát tác vụ hiện tại, hệ thống sẽ đối chiếu lại trước khi bấm; nếu tác vụ đã chuyển đổi thì sẽ hiện cảnh báo xác nhận chứ không dừng nhầm tác vụ cũ. Thông báo dừng thất bại hiển thị khoảng 8 giây, thông báo lỗi của cơ sở dữ liệu luôn được ưu tiên hiển thị trước tiến độ thông thường. Khi bong bóng gốc chuyển sang truyện cười hoặc thông báo và tạm thời không có tác vụ nào, Tiểu Hội sẽ hiển thị trạng thái chờ đồng bộ tiến độ, sau khi tác vụ xuất hiện lại sẽ khôi phục nút dừng.

### Ló đầu ở mép màn hình và Kể chuyện chữa lành

- **Cách kích hoạt ló đầu**: Kéo Tiểu Hội chạm sát mép trái, phải, trên hoặc dưới màn hình, buông tay ra pet sẽ lập tức nép mình vào mép và ló đầu ra, không cần phải đợi 6 giây hay di chuột ra chỗ khác. Nếu vị trí mặc định đã sát mép cũng sẽ trực tiếp ló đầu. Mép dưới sẽ tự động tránh thanh nhập liệu, xuất hiện ở cạnh dưới của vùng khả dụng.
- **Vị trí có bị đổi không**: Ló đầu chỉ thay đổi tư thế và khẽ đung đưa tại chỗ, hoàn toàn không làm đổi vị trí đã lưu, cũng không kích hoạt tự động đi bộ. Khi nhấp chuột, nhấn giữ, kéo thả, mở sổ hoặc nhận tác vụ sẽ khôi phục động tác tương ứng; rê chuột qua (hover) sẽ không làm mất trạng thái ló đầu. Sau khi tương tác kết thúc, nếu vị trí vẫn ở sát mép, pet sẽ lập tức tiếp tục ló đầu.
- **Cách nghe kể chuyện**: Trong Cuốn sổ nhỏ, bấm "Nghe một mẩu truyện ngắn". Sau khi bong bóng mở ra, cứ mỗi 30 giây sẽ tự động đổi một câu chuyện mới, luân phiên 12 câu chuyện, không trùng lặp trong một vòng; bạn cũng có thể bấm "Đổi câu chuyện khác" để chuyển ngay lập tức, hoặc bấm dấu X để đóng. Đóng bong bóng sẽ kết thúc chuỗi đổi truyện liên tục.
- **Chủ động kể chuyện**: Tự động kích hoạt sau khi pet rảnh rỗi khoảng 5 phút; trong lúc đang hiển thị cứ 30 giây đổi truyện một lần. Rê chuột hoặc focus bàn phím vào bong bóng sẽ tạm dừng đếm ngược đổi bài, rời ra sẽ đếm tiếp thời gian còn lại; trên điện thoại chạm vào câu chuyện sẽ giữ nguyên trạng thái đọc, đọc xong có thể chủ động đổi bài hoặc đóng lại.
- **Ưu tiên tác vụ**: Khi cơ sở dữ liệu bắt đầu xử lý, gửi thông báo kết quả hoặc khi bạn tắt hiển thị pet, câu chuyện sẽ tự thu lại. Bong bóng tác vụ và nút dừng tác vụ gốc luôn được ưu tiên cao nhất; tính năng kể chuyện không gọi mô hình chat, không gửi tin nhắn, không ghi dữ liệu.
- **Công tắc bật/tắt**: Trong cài đặt tiện ích mở rộng có thể tắt riêng lẻ "Ló đầu khi kéo sát mép" và "Tự động kể chuyện chữa lành khi rảnh rỗi". Sau khi tắt tự động kể chuyện lúc rảnh, bạn vẫn có thể bấm nghe truyện thủ công trong sổ, lúc này cơ chế đổi truyện 30 giây và tạm dừng đọc vẫn hoạt động bình thường.

---

## Đổi Desktop Pet: Ngôi nhà Desktop Pet

Cách mở: Bấm vào **Ngôi nhà Desktop Pet** ở đáy Cuốn sổ nhỏ, hoặc vào **Cài đặt tiện ích mở rộng → Database Desktop Pet**, chọn nút nhân vật và "Ngôi nhà Desktop Pet". Ngôi nhà được thiết kế như một cuốn bách khoa mở ra: Trang trái là hình vẽ đứng (tachi-e), trang phải là hồ sơ nuôi dưỡng của nhân vật đó. Bấm vào các thẻ đánh dấu sách phía trên để lật sang nhân vật khác, nhấn **Đổi cô ấy sang bầu bạn** là xong, nhân vật cũ sẽ vẫy tay chào tạm biệt, nhân vật mới đáp xuống chào bạn.

| Nhân vật | Giới thiệu | Thuyết minh |
| --- | --- | --- |
| **Erii (Tiểu Hội)** | Vu nữ tóc đỏ trầm lặng, thích vịt vàng nhỏ, bánh pudding và chơi game | Nhân vật mặc định, tài nguyên và hành vi tương tự bản 0.7.1 |
| **Zero** | Thiếu nữ tóc vàng mắt xanh băng giá, ít nói, làm việc tỉ mỉ, trên đầu đội một chú thiên nga đen nhỏ | Bản này bổ sung 26 ảnh (19 ảnh chính, 7 ảnh sinh hoạt) |
| **Naidan (Nãi Đán)** | Sinh vật nhỏ màu vàng sữa có sẵn của cơ sở dữ liệu, háu ăn, thích lăn lộn | Ảnh đọc trong thời gian chạy từ cơ sở dữ liệu; không thể chuyển đổi nếu cơ sở dữ liệu chưa bật hoặc đã tắt pet tích hợp của nó, Ngôi nhà sẽ ghi rõ lý do |
| **Tiểu Khắc (Claude)** | Đại tiểu thư tri thức tóc cam lấy nguyên mẫu từ Claude, mê sách, thích hồng trà, thường ôm ngôi sao nhỏ màu cam | v1.0.2 thêm mới 26 ảnh (19 ảnh chính, 7 ảnh sinh hoạt), tỷ lệ cơ thể chuẩn không làm chibi; quan hệ mặc định "Chấp sự riêng"; hiện chỉ có trang phục mặc định |

Sau khi đổi nhân vật:
- **Dùng chung**: Vị trí và kích thước Desktop Pet, các công tắc cài đặt, ví tiền chung của gia đình.
- **Tách biệt riêng**: Lịch sử trò chuyện, cách xưng hô và thiết lập tính cách, độ thân mật, chỉ số nhu cầu, nhật ký trưởng thành, biệt danh, công việc đang làm dở hoặc bữa ăn đang ăn, trang phục sở hữu và đang mặc.
- Lần đầu trò chuyện với nhân vật mới sẽ kế thừa cài đặt kết nối của Tiểu Hội (URL interface, mô hình, độ dài phản hồi...); API key của cấu hình riêng được lưu độc lập theo từng nhân vật, từng phiên chat và từng địa chỉ URL, cần điền ở phiên chat tương ứng khi có nhu cầu. Sử dụng API hiện tại của SillyTavern vẫn dùng theo kết nối sẵn có của SillyTavern.
- Nhân vật đang đi làm dở nếu bị đổi ra sau cánh gà vẫn tiếp tục làm việc ngầm, khi hết giờ làm việc, bong bóng thoại của pet hiện tại sẽ nhắc bạn đi nhận lương.

---

## Nuôi dưỡng

Mọi cơ chế nuôi dưỡng đều **không có hình phạt**: Độ thân mật chỉ tăng không giảm, chỉ số nhu cầu tụt thấp chỉ ảnh hưởng đến tâm trạng và câu thoại, pet không bao giờ bị ốm, không bỏ nhà đi, cũng không bị cấm đi làm.

- **Độ thân mật**: Chia làm 5 bậc: *Mới quen, Quen thuộc, Thân thiết, Tin cậy, Tri kỷ*, tính riêng cho từng nhân vật. Xoa đầu +1 (tối đa 20/ngày), tặng hoa +5 (tối đa 3 lần/ngày), mời ăn cơm +3～+8, nhận lương +3, trò chuyện một lượt +2 (tối đa 20/ngày), lần đầu gặp mặt mỗi ngày +5, cùng bạn hoàn thành 1 tác vụ cơ sở dữ liệu +2 (tối đa 20/ngày), tắm gội chải chuốt +2. Mỗi khi lên một bậc sẽ mở khóa một bộ lời thoại mới, một mẩu truyện ngắn độc quyền và một danh hiệu mới.
- **Chỉ số nhu cầu**: Độ no từ đầy đến cạn khoảng 12 tiếng, Độ sạch khoảng 24 tiếng, khi bạn rời đi chỉ số vẫn giảm từ từ. Độ no tăng lên khi mời ăn cơm (pudding +15, cơm nắm +25, cơm cuộn trứng +40, ramen +50), Độ sạch tăng lên bằng cách bấm **Tắm gội** trong sổ hoặc trong Ngôi nhà (miễn phí, hồi chiêu 30 phút). Trong cài đặt tiện ích có thể tắt chỉ số nhu cầu, sau khi tắt chỉ số sẽ đóng băng và ẩn đi.
- **Tâm trạng**: Lo lắng (cơ sở dữ liệu vừa báo lỗi), Đói bụng, Muốn tắm gội, Nhớ bạn (lâu ngày không tương tác), Vui vẻ, Bình yên. Tâm trạng chỉ quyết định câu thoại và con dấu tâm trạng trong Ngôi nhà.
- **Nhật ký trưởng thành**: Ghi lại các cột mốc trong mục **Nhật ký trưởng thành** ở Ngôi nhà, ví dụ: Ngày đầu tiên gặp gỡ, lần đầu ăn ramen, cùng bạn hoàn thành tác vụ cơ sở dữ liệu thứ 100; các mẩu truyện ngắn mở khóa cũng được đọc tại đây.
- **Biệt danh**: Trong Ngôi nhà, bấm vào cây bút cạnh tên để đặt biệt danh cho nhân vật, cách gọi trên giao diện và trong lời thoại sẽ đổi theo, để trống sẽ khôi phục tên gốc.
- **Lời chào hàng ngày**: Lần đầu gặp mặt mỗi ngày, pet sẽ chào hỏi tùy theo buổi sáng/trưa/tối và mức độ thân mật của hai người, đồng thời ghi nhận thêm 1 ngày vào "Số ngày đồng hành".
- **Trợ cấp khó khăn (Tiền cứu tế)**: Khi ví tiền chung dưới 5 vàng, mỗi ngày có thể nhận trợ cấp 1 lần nhận 8 vàng trong Sổ tay sinh hoạt, vừa đủ để mua một nắm cơm.

*Người dùng cũ khi nâng cấp sẽ được Tiểu Hội quy đổi một lượng thân mật ban đầu dựa trên số lần chat, đi làm và ăn uống sẵn có (tối đa đạt bậc "Quen thuộc"), mốc "Ngày đầu tiên gặp gỡ" lấy theo bản ghi chat hoặc sổ cái chi tiêu sớm nhất.*

---

## Mở nhanh giao diện cơ sở dữ liệu bằng một nút bấm

Mục "Cơ sở dữ liệu" trong Cuốn sổ nhỏ có sẵn một nhóm nút bấm nhanh: **Mở cơ sở dữ liệu chính** (Dashboard), **Bàn làm việc điền bảng**, **Thúc đẩy cốt truyện**, **Quản lý dữ liệu**, **API**, **Xem bảng biểu** (Bảng trực quan hóa). Trong khung chat và thanh tác vụ của Sổ tay sinh hoạt cũng có nút **Mở cơ sở dữ liệu**.

Việc mở cơ sở dữ liệu sử dụng các API công khai `AutoCardUpdaterAPI.openSettings()` / `openVisualizer()`; chuyển sang phân mục chỉ định tương đương với việc bấm hộ bạn mục đó trên thanh bên, chỉ đổi trang hiển thị chứ không đọc/ghi dữ liệu hay can thiệp tác vụ. Nếu phân mục nào không có trong gói cơ sở dữ liệu hiện tại của bạn, nút bấm sẽ chỉ mở cơ sở dữ liệu kèm thông báo lý do; nếu không tìm thấy lối vào cơ sở dữ liệu, sổ sẽ nhắc bạn bật tiện ích cơ sở dữ liệu lên trước.

---

## Ngoại quan và Hiệu ứng đặc biệt

Giao diện mang phong cách "Sổ tay bìa cứng cao cấp": Vân giấy cổ điển, viền chỉ mạ vàng, băng keo giấy washi và con dấu, mỗi nhân vật mang một bảng màu riêng biệt. Mục **Hiệu ứng đặc biệt** trong cài đặt có 4 lựa chọn: *Tự động (Máy tính lộng lẫy, Điện thoại tối giản), Lộng lẫy, Tối giản, Tắt*. Mức lộng lẫy sẽ thả cánh hoa, bông tuyết hoặc ánh sao khi tặng hoa, lên cấp, đổi nhân vật; trang tranh vẽ của Ngôi nhà pet có luồng sáng chảy chầm chậm; mức tối giản chỉ giữ lại một ít hạt hiệu ứng; khi hệ thống bật chế độ "Giảm hiệu ứng động" (prefers-reduced-motion) sẽ tự động tắt. Khi chuyển tab trình duyệt ra sau hoặc đóng bảng điều khiển, mọi hiệu ứng động đều lập tức dừng lại.

---

## Đi làm, Kiếm tiền và Ăn uống

Nhấp chuột phải (máy tính) / Nhấn giữ (điện thoại) để mở Cuốn sổ nhỏ, bấm vào **Sổ tay sinh hoạt**; cũng có thể mở từ cài đặt tiện ích mở rộng. Phía trên cùng cửa sổ có thể chọn cử nhân vật nào đi: Ví tiền là "Ví tiền của gia đình" dùng chung cho tất cả các nhân vật, còn việc đi làm, ăn uống và thay đồ tính riêng cho từng người, các nhân vật khác nhau có thể đồng thời đi làm ở các nơi khác nhau. Sổ tay gồm 4 trang: **Đi làm kiếm tiền**, **Ăn món ngon**, **Tủ đồ (Thay trang phục)**, **Sổ cái chi tiêu**.

### Công việc và Tiền lương

| Công việc | Nhiệm vụ | Thời gian | Tiền lương |
| --- | --- | --- | --- |
| **Tiệm sách** | Xếp sách mới lên kệ | 1 phút | 10 vàng |
| **Tiệm bánh ngọt**| Chuẩn bị điểm tâm nhỏ | 2 phút | 18 vàng |
| **Tiệm hoa** | Cắt tỉa bó hoa, thay nước | 3 phút | 25 vàng |

1. Chọn công việc trong tab **Đi làm kiếm tiền**. Mỗi nhân vật chỉ thực hiện 1 hoạt động tại một thời điểm.
2. Sổ tay và bong bóng thoại của pet hiển thị thời gian còn lại, pet đổi sang hình minh họa làm việc tương ứng và nhẹ nhàng hô hấp tại chỗ.
3. Hết giờ làm việc, bấm **Nhận lương**. Bạn cũng có thể đóng sổ lại và bấm nhận lương trực tiếp trên bong bóng báo tan làm của pet.
4. Một nhân vật phải nhận xong tiền lương thì mới có thể bắt đầu công việc tiếp theo hoặc đi ăn cơm. Lương chưa nhận sẽ được lưu mãi mãi, không có thời hạn hết hạn.

**Tan làm sớm**: Cần bấm xác nhận lần thứ hai để dừng công việc này; tan làm sớm sẽ không có lương nhưng cũng không bị trừ số vàng hiện có. Công việc đã làm xong thì bấm nhận trực tiếp, không sợ bấm nhầm hủy bỏ.

### Mời Desktop Pet ăn cơm

| Món ăn | Giá | Thời gian ăn |
| --- | --- | --- |
| **Bánh pudding** | 5 vàng | 8 giây |
| **Cơm nắm** | 8 vàng | 9 giây |
| **Cơm cuộn trứng (Omurice)** | 15 vàng | 10 giây |
| **Mì Ramen** | 20 vàng | 12 giây |

Mua đồ ăn trong tab **Ăn món ngon**, sau khi xác nhận sẽ trừ tiền vàng và bắt đầu ăn, ăn xong độ no sẽ tăng lên. Khi số dư không đủ hoặc nhân vật đang bận hoạt động khác, nút mua sẽ bị vô hiệu hóa. Ăn xong sẽ được ghi vào sổ cái; 4 món ăn đều có hình ảnh ăn uống riêng: Pudding dùng thìa nhỏ xúc caramen, Cơm nắm cầm tay ăn cơm bọc rong biển, Cơm cuộn trứng dùng thìa ăn trứng vàng ươm, Ramen dùng đũa gắp mì. Thẻ chọn món, hình minh họa trong sổ tay và pet lơ lửng đều dùng chung hình ảnh tương ứng. Chỉ số nhu cầu chỉ ảnh hưởng đến tâm trạng và câu thoại, hoàn toàn không có hình phạt bỏ đói hay ép ăn.

### Cửa hàng và Thay trang phục (Skins)

**Cửa hàng** dùng để xem trước trang phục, nhập mật ngữ hoặc đổi phiếu hoa để mua. Có thể mở bằng một trong các cách:
- Mục **Cửa hàng · Mua quần áo mới** trong Cuốn sổ nhỏ;
- **Cài đặt tiện ích mở rộng → Database Desktop Pet → Cửa hàng · Mua quần áo**;
- **Sổ tay sinh hoạt → Thay trang phục → Đến Cửa hàng mua quần áo**.

Trên đầu Cửa hàng có thể chọn Erii hoặc Zero. Dạ Lễ Phục Tím của Tiểu Hội mua bằng phiếu hoa, Trang phục Hoàng nữ của Zero mở khóa bằng mật ngữ; trang phục của Zero không hiện khu vực đổi tiền và không trừ bất kỳ loại tiền nào. Cả hai đều có thể xem trước 4 tư thế: Ngồi, Vẫy tay, Ôm vịt/thiên nga và Ăn pudding. Sau khi nhận được trang phục, hãy vào Tủ đồ của nhân vật đó để mặc thủ công.

**Tủ đồ** nằm ở trang thứ ba **Thay trang phục** của Sổ tay sinh hoạt; cũng có thể vào trực tiếp từ nút **Thay đồ cho cô ấy** trong Ngôi nhà pet. Nơi đây hiển thị trang phục mặc định và các bộ đồ đã sở hữu. Mỗi nhân vật luôn có một bộ trang phục mặc định miễn phí trọn đời.

Bộ trang phục mới của Tiểu Hội trong phiên bản này là **Tsukuyomi · Dạ Lễ Phục Tím**, chỉ dành riêng cho Erii:

| Nội dung | Chi tiết |
| --- | --- |
| Giá trang phục | 10.320 phiếu hoa |
| Tỷ lệ quy đổi | 1 vàng → 40 phiếu hoa |
| Tích đủ từ 0 phiếu hoa | 258 vàng |
| Sở hữu ban đầu | Chưa, cần phải mua |

1. Đi làm kiếm tiền, kết thúc bấm nhận lương thủ công.
2. Mở Cửa hàng, bấm **Đi đổi phiếu hoa** ở đáy để cuộn đến khu vực đổi tiền, nhập số nguyên dương tiền vàng. Bên cạnh sẽ hiện số phiếu hoa đổi được; bạn cũng có thể bấm **Điền số vàng cần để mua**, nút này chỉ điền sẵn số chứ chưa trừ tiền.
3. Bấm **Đổi phiếu hoa** thì mới chính thức trừ vàng và tăng phiếu hoa. Không đủ vàng hoặc số lượng không hợp lệ sẽ không đổi được; phiếu hoa không thể đổi ngược lại thành vàng, số phiếu thừa được bảo lưu.
4. Khi đủ phiếu hoa, bấm **Mua quần áo · 10320 phiếu hoa** ở đáy Cửa hàng. Chỉ mua một lần duy nhất, không tự động mặc vào và không bao giờ trừ tiền trùng lặp.
5. Bấm **Vào Tủ đồ để thay**, trong tủ đồ tìm bộ này và bấm **Mặc vào**. Sau đó có thể đổi lại trang phục mặc định miễn phí bất cứ lúc nào.

- Trang phục mới bao phủ toàn bộ 16 động tác chờ/tác vụ/tương tác, 4 góc ló đầu, 3 ảnh đi làm, 4 ảnh ăn uống độc lập, tổng cộng 27 ảnh. Desktop Pet, Cuốn sổ nhỏ, avatar khung chat, tranh minh họa sinh hoạt, menu gọi món, tranh vẽ trong Ngôi nhà đều đồng bộ đổi theo; bong bóng thoại và sổ tay chuyển sang tông màu tím nhạt.
- Tạo hình giữ lại găng tay ren mỏng, nơ bướm màu tím ở cổ và giày. Động tác ôm vịt chỉ ôm vịt trong lòng, các động tác khác vẫn giữ chú vịt vàng nhỏ trên đầu; ảnh trang phục mặc định không bị thay đổi.
- Vàng và phiếu hoa là ví tiền chung của gia đình; quần áo thuộc quyền sở hữu riêng của từng nhân vật, mua cho Tiểu Hội sẽ không dùng được cho Zero hay Naidan. Đổi nhân vật, làm mới trang, đóng cửa sổ dữ liệu vẫn được bảo toàn nguyên vẹn.
- Thay đồ không làm gián đoạn việc đi làm hay ăn uống; lúc cơ sở dữ liệu đang bận vẫn có thể đổi vé và thay đồ. Không phát sinh yêu cầu API mới, không có tính năng tự di chuyển.
- Danh mục trang phục thanh toán bằng vàng kiểu cũ vẫn tương thích; trong danh mục nếu có `currency: 'tickets'` nghĩa là thanh toán bằng phiếu hoa, không ghi thì mặc định thanh toán bằng vàng.

### Cơ chế lưu trữ và Tác vụ cơ sở dữ liệu

- Ví tiền ban đầu có 0 vàng, 0 phiếu hoa, quần áo mới chưa sở hữu. Công việc do bạn bấm bắt đầu thủ công, không tự động nhận việc tiếp theo hay treo máy kiếm tiền vô hạn; khi sắp hết tiền có thể nhận trợ cấp khó khăn.
- Vàng, phiếu hoa, lịch sử đổi/chi tiêu phiếu hoa, hoạt động hiện tại, tổng số lần đi làm/ăn uống và 20 bản ghi sổ cái gần nhất được lưu trong cài đặt tiện ích mở rộng của tài khoản SillyTavern hiện tại; trang phục sở hữu và đang mặc cũng lưu tại đó (trường `skins`), tách biệt theo từng nhân vật.
- Công việc đã bắt đầu tính giờ theo thời gian thực của thiết bị. Khi đóng cửa sổ, làm mới hoặc tạm rời đi, khi quay lại sẽ tính tiếp thời gian hoặc hiện sẵn nút nhận lương; bữa ăn ăn xong lúc ngoại tuyến chỉ quyết toán đúng một lần, không trừ tiền trùng lặp.
- Khi tác vụ cơ sở dữ liệu xuất hiện, động tác, bong bóng và nút dừng của tác vụ gốc luôn được ưu tiên hàng đầu; Sổ tay sinh hoạt và Cửa hàng cũng cung cấp thao tác dừng của cơ sở dữ liệu gốc. Hoạt động đi làm đã bắt đầu vẫn tính giờ bình thường, sau khi tác vụ cơ sở dữ liệu kết thúc bạn mới có thể bắt đầu việc mới hoặc mua đồ ăn.
- Khung chat, Sổ tay sinh hoạt, Cửa hàng, Ngôi nhà pet và Cuốn sổ nhỏ mở độc lập với nhau. Lối chơi đời sống không gọi API, không sửa cơ sở dữ liệu hay văn bản chính SillyTavern. Không khôi phục tự động di chuyển.
- Phiên bản này là lối chơi đơn nhẹ nhàng lưu trong cài đặt tài khoản, chống nhận lương / trừ tiền trùng lặp trên cùng một trang; không hỗ trợ dịch vụ giao dịch ví tiền đồng thời trên nhiều thiết bị.

---

## Trò chuyện cùng Desktop Pet

Mỗi nhân vật có lịch sử trò chuyện, cách xưng hô và thiết lập tính cách riêng, đổi nhân vật không làm xáo trộn tin nhắn. Tính cách của Zero được thiết lập bám sát nguyên tác tiểu thuyết *《Long Tộc》*, Naidan là người bạn nhỏ hoạt bát mê ăn uống (quan hệ mặc định "Bạn thân"), bạn hoàn toàn có thể tự do chỉnh sửa theo ý mình trong thư mục `characters/`.

1. Nhấp chuột phải vào pet (máy tính) hoặc nhấn giữ khoảng 1.4 giây (điện thoại) để mở Cuốn sổ nhỏ, bấm **Trò chuyện cùng Tiểu Hội** (đổi sang Zero hoặc Naidan nút sẽ đổi tên theo). Cũng có thể mở trực tiếp từ cài đặt tiện ích mở rộng.
2. Mặc định **Sử dụng API hiện tại của SillyTavern**, kế thừa kết nối, mô hình và API key sẵn có của SillyTavern. Hãy chắc chắn SillyTavern đã cấu hình sẵn kết nối chat completion hoặc text completion khả dụng.
3. Nhập tin nhắn, bấm **Gửi**. Trên máy tính bấm Enter để gửi, Shift+Enter để xuống dòng; trên điện thoại phím Enter để xuống dòng, dùng nút Gửi trên màn hình.
4. **Dừng phản hồi**: Hủy bỏ yêu cầu lần này của pet; **Thử lại**: Gửi lại nội dung chưa nhận được phản hồi. Đóng cửa sổ hoặc tắt tiện ích cũng sẽ hủy các yêu cầu đang xử lý dở.
5. Bấm vào **Cài đặt kết nối** để chỉnh sửa cách xưng hô, mối quan hệ, phong cách trò chuyện, độ dài câu trả lời và những điều muốn pet ghi nhớ, hoặc chuyển sang **Cấu hình API riêng (Tương thích OpenAI)**.

### Cấu hình API riêng

Điền URL cơ sở của API (ví dụ: `https://api-cua-ban.com/v1`) và API Key, bấm **Lấy danh sách mô hình**, chọn trong mục **Mô hình khả dụng**, xác nhận **Tên mô hình** bên dưới rồi bấm **Lưu cài đặt**.

Bạn vẫn có thể tự tay gõ tên mô hình; một số nhà cung cấp không hỗ trợ endpoint lấy danh sách mô hình, việc lấy danh sách thất bại không có nghĩa là API không hoạt động. Trong lúc đang lấy danh sách có thể bấm **Hủy lấy**. Đổi URL hoặc key sẽ hủy yêu cầu cũ và xóa danh sách cũ; đóng cửa sổ hoặc tắt tiện ích cũng hủy tiến trình này. Danh sách được sắp xếp và loại bỏ trùng lặp theo ID mô hình, việc chọn trong danh sách không làm ảnh hưởng đến mô hình toàn cục của SillyTavern.

Chế độ **Sử dụng API hiện tại của SillyTavern** sẽ luôn đi theo mô hình hiện tại của SillyTavern; nếu muốn chọn mô hình riêng biệt, hãy đổi sang **Cấu hình API riêng**.

Nếu bạn điền đường dẫn đầy đủ dạng `/chat/completions`, hệ thống sẽ tự động nhận diện URL cơ sở. Kết nối riêng hỗ trợ các interface chat completion tương thích OpenAI; nếu muốn dùng interface thuần Claude / Gemini hãy sử dụng thông qua kết nối hiện tại của SillyTavern.

Yêu cầu được chuyển tiếp qua thiết bị chạy SillyTavern, trình duyệt chỉ kết nối với SillyTavern. Nếu điền `localhost`, nó ám chỉ thiết bị đang chạy SillyTavern backend. Nút **Kiểm tra kết nối** sẽ gửi một yêu cầu ngắn, có thể bị tính phí API; nội dung thử nghiệm không bị lưu vào lịch sử trò chuyện.

API Key mặc định chỉ lưu trong bộ nhớ RAM của cửa sổ hội thoại hiện tại; khi làm mới trang, tắt tiện ích hoặc đổi pet sẽ cần nhập lại. Nếu tích chọn **Ghi nhớ khóa trên thiết bị này**, key sẽ được lưu vào bộ nhớ trình duyệt tách biệt theo từng nhân vật, từng cuộc trò chuyện và từng URL API; bỏ tích rồi bấm lưu sẽ chỉ xóa key đã lưu của cuộc trò chuyện này với URL hiện tại, không xóa key của các cuộc hội thoại khác. API Key tuyệt đối không bị ghi vào cài đặt tiện ích mở rộng, prompt chat, bản xuất dữ liệu hay gói cài đặt.

Phiên bản cũ dùng chung một khóa API key. Nếu các URL đã lưu trùng khớp, hệ thống sẽ tự di chuyển về vị trí lưu riêng tương ứng và gỡ bỏ khóa dùng chung cũ; nếu bản ghi cũ có nhiều địa chỉ khác nhau không xác định được nguồn, hệ thống sẽ nhắc bạn điền lại ở cuộc trò chuyện tương ứng chứ không gửi bừa khóa không rõ nguồn gốc lên API. Các khóa đã bị ghi đè ở bản cũ không thể khôi phục lại.

### Thao tác tin nhắn và Bản nháp

- **Sao chép**: Mọi tin nhắn đều có thể sao chép. Nếu trình duyệt chặn sao chép tự động, bạn có thể bôi đen văn bản để chép thủ công.
- **Trả lời lại**: Nằm dưới tin nhắn phản hồi thành công cuối cùng, nhằm trả lời lại cùng một câu hỏi. Chỉ khi câu trả lời mới thành công thì mới thay thế câu cũ; hủy bỏ hoặc phát sinh lỗi sẽ giữ nguyên bản ghi ban đầu. Không lưu trữ nhiều nhánh rẽ.
- **Sửa và gửi lại**: Chỉnh sửa tin nhắn gần nhất của người dùng rồi sinh lại lượt phản hồi này. Tương tự, chỉ khi thành công mới cập nhật bản ghi cũ. Bấm "Hủy sửa" sẽ khôi phục lại nội dung nháp trước khi sửa.
- **Lưu bản nháp**: Cả bản nháp thông thường và bản nháp đang sửa dở đều được tự động lưu. Đóng cửa sổ mở lại hoặc làm mới trang vẫn có thể viết tiếp.
- **Xuất dữ liệu**: Mặc định xuất file JSON chứa đầy đủ văn bản chính, mốc thời gian và suy nghĩ của interface, có thể nhập lại vào hệ thống. Trong「Quản lý → Định dạng xuất」có thể đổi sang file TXT để đọc. Cả hai định dạng đều không chứa cấu hình kết nối, API key hay ký ức thủ công. Lịch sử kiểm tu luôn xuất dạng TXT.
- **Nhập dữ liệu**: Bấm「Nhập」ở trên cùng, chọn file, đối chiếu số lượng tin nhắn rồi bấm「Lưu thành cuộc trò chuyện mới」. Không bao giờ ghi đè lên cuộc trò chuyện hiện tại, cũng không tự động gửi tin nhắn hay kích hoạt danh sách sửa đổi cơ sở dữ liệu có trong file.
- **Xóa sạch lịch sử**: Cần bấm xác nhận lần thứ hai. Xóa sạch tin nhắn không làm mất cấu hình kết nối và ký ức thủ công; hai mục này có thể tự sửa trong cài đặt kết nối.

Tin nhắn hiển thị avatar và thời gian; tin nhắn cũ không có thời gian vẫn đọc bình thường và không bị bịa đặt mốc thời gian gửi. Khi chờ interface phản hồi sẽ hiện dòng chữ "Tiểu Hội đang viết câu trả lời...", sau khi có kết quả mới hiển thị đầy đủ; phiên bản này vẫn là phản hồi dạng không stream (non-streaming).

Khi đang xem lại tin nhắn cũ, câu trả lời mới xuất hiện sẽ không tự động cuộn xuống đáy làm phiền bạn, chỉ cần bấm "Về tin nhắn mới nhất" là được. Máy tính có thể dùng nút ↔ trên thanh tiêu đề để mở rộng cửa sổ hoặc kéo thanh tiêu đề; ô nhập liệu trên điện thoại tự co giãn theo độ dài văn bản và chừa khoảng trống cho bàn phím ảo.

Ba nút gợi ý chủ đề khi khung chat trống chỉ có tác dụng điền sẵn vào ô nháp, do bạn xác nhận gửi mới phát yêu cầu chứ không tự động gửi đi.

### Nhiều cuộc trò chuyện độc lập

- Nút「Cuộc trò chuyện mới」trên cùng sẽ mở ra một đoạn chat trắng tinh, chỉ kế thừa kết nối, xưng hô, quan hệ và ký ức thủ công tại thời điểm tạo, không sao chép lịch sử hay bản nháp cũ. Sau đó, việc sửa cài đặt ở mỗi bên sẽ lưu riêng biệt.
- Danh sách thả xuống trên cùng cho phép chuyển đổi giữa các cuộc trò chuyện ngay trong một cửa sổ duy nhất, việc tạo mới hay nhập file cũng dùng chung cửa sổ này. Vị trí kéo thả và kích thước mở rộng của cửa sổ được giữ nguyên, khi chuyển lại vẫn giữ nguyên vị trí đọc và bản nháp dở; cuộc trò chuyện không hiển thị vẫn tiếp tục chờ phản hồi ngầm.
- Nút「Dừng phản hồi」chỉ dừng cuộc trò chuyện hiện tại; khi đóng toàn bộ cửa sổ chat hoặc mở giao diện chính khác, hệ thống sẽ dừng toàn bộ các yêu cầu đang chờ phản hồi của nhân vật đó. Đổi nhân vật sẽ dừng yêu cầu của nhân vật cũ nhưng vẫn giữ nguyên tin nhắn; đổi lại vẫn chat tiếp được.
- Trong mục「Quản lý」có thể đổi tên hoặc bấm xác nhận để xóa cuộc trò chuyện mới tạo; cuộc trò chuyện gốc ban đầu được giữ lại và có thể xóa trắng tin nhắn. Mỗi nhân vật được tạo tối đa 20 cuộc trò chuyện, mỗi cuộc trò chuyện lưu tối đa 100 tin nhắn, khoảng 128.000 ký tự (tổng văn bản chính + suy nghĩ).
- Khi chiều cao màn hình khả dụng trên điện thoại quá nhỏ, thanh công cụ kết nối, chế độ chat và phạm vi kiểm tu sẽ được thu gọn vào mục「Quản lý」để nhường chỗ cho khung chat và nút gửi; khi chiều cao màn hình hồi phục sẽ tự động trở về chỗ cũ.

### Nội dung suy nghĩ và Định dạng tệp nhập

Hệ thống mặc định thu gọn các trường `reasoning_content`, `reasoning`, khối nội dung suy nghĩ do interface trả về, cùng các thẻ `<think>`, `<thinking>`, `<analysis>`, `<reasoning>` trong văn bản chính. Bấm vào「Quá trình suy nghĩ」để mở ra xem dưới dạng text thuần. Nếu mô hình chỉ trả về suy nghĩ mà không có văn bản chính, hệ thống sẽ nhắc bạn tăng độ dài tối đa của phản hồi rồi thử lại.

Hỗ trợ tệp JSON của chính tiện ích này, tệp JSONL của SillyTavern chứa tin nhắn văn bản, hoặc mảng tin nhắn `user`, `assistant`. File JSON nhận diện thuộc về nhân vật pet khác sẽ nhắc bạn chuyển đổi nhân vật tương ứng. Định dạng TXT cũ phụ thuộc vào tên nhân vật và dòng thời gian xuất ra trước đây, nếu định dạng bị mơ hồ hoặc qua chỉnh sửa nhiều có thể không nhận diện được; khi sao lưu mới nên ưu tiên chọn JSON. File TXT xuất từ chế độ kiểm tu không phải là định dạng hợp lệ để nhập vào chat.

Mỗi file giới hạn tối đa 2 MB, 100 tin nhắn, tổng cộng 128.000 ký tự, mỗi tin nhắn văn bản chính tối đa 16.000 ký tự, suy nghĩ tối đa 32.000 ký tự. Vượt quá giới hạn, file hỏng hoặc không rõ loại nhân vật sẽ báo lỗi cụ thể chứ không âm thầm cắt bỏ một nửa dữ liệu. Thao tác nhập file không tiếp nhận cấu hình kết nối, API key, ký ức hay danh sách chỉnh sửa cơ sở dữ liệu.

### Phong cách trò chuyện và Ký ức thủ công

Tùy chỉnh trong **Cài đặt kết nối → Bạn và Tiểu Hội**:

- **Trò chuyện tự nhiên**: Độ dài câu trả lời linh hoạt theo chủ đề, phản hồi đúng trọng tâm nội dung.
- **Bầu bạn ngắn gọn**: Thường từ 1 đến 3 câu, tránh diễn giải lan man không liên quan.
- **Trao đổi chi tiết**: Giải thích cặn kẽ khi người dùng hỏi nghiêm túc, trò chuyện hàng ngày vẫn giữ nét tự nhiên.
- **Điều muốn Tiểu Hội ghi nhớ**: Tối đa 2.000 ký tự, có thể viết thói quen xưng hô, sở thích và tình trạng gần đây; sau khi lưu, mỗi yêu cầu gửi đi đều sẽ mang theo thông tin này, có thể sửa hoặc xóa bất cứ lúc nào.

Đây là dữ liệu do bạn tự tay quản lý, hệ thống không tự động bóc tách từ đoạn chat, không gọi mô hình tóm tắt tốn kém, không đọc lén cơ sở dữ liệu hay văn bản chính của SillyTavern. Phong cách được truyền đạt qua câu lệnh prompt, câu trả lời thực tế phụ thuộc vào mô hình bạn dùng; mục "Giới hạn độ dài phản hồi" vẫn dùng để khống chế token đầu ra.

### Prompt và Lịch sử trò chuyện

Prompt tích hợp sẵn được tổng hợp từ các mục `opt_mode_chat`, tính cách khí chất trong preset Erii do người dùng cung cấp, mối quan hệ mặc định là người yêu, có thể tự chỉnh thành bạn bè hoặc quan hệ khác. Sử dụng văn bản thuần túy, không phụ thuộc vào macro preset của SillyTavern, World Info, Regex hay script cốt truyện trong preset. File duy trì là `chat-prompt.js`.

Lịch sử trò chuyện được lưu riêng trong cài đặt tiện ích mở rộng của tài khoản SillyTavern hiện tại, tối đa 100 tin nhắn, khoảng 128.000 ký tự. Mỗi yêu cầu gửi đi sẽ mang theo tối đa 40 tin nhắn gần nhất, khoảng 24.000 ký tự; tuyệt đối không tự ý mang theo văn bản chính SillyTavern, character card, World Info hay bảng biểu cơ sở dữ liệu. Nút **Xóa sạch lịch sử** yêu cầu bấm xác nhận lần thứ hai.

Cửa sổ chat hiển thị độc lập, trên máy tính có thể kéo thanh tiêu đề, trên điện thoại tự co giãn theo màn hình. Tiểu Hội trong lúc chờ phản hồi sẽ làm động tác viết ghi chép tại chỗ, nhận được phản hồi sẽ vẫy tay; trong lúc đang chat sẽ tạm dừng tự động kể chuyện. Tác vụ cơ sở dữ liệu hiển thị phía trên khung chat và có nút **Dừng tác vụ** độc lập.

### Phạm vi hỗ trợ của API hiện tại

- Kết nối Chat Completion của SillyTavern: Kế thừa nhà cung cấp, mô hình và backend key hiện tại, bao gồm các nguồn Claude, Gemini, OpenRouter... đã cấu hình trong SillyTavern; phiên bản này dùng phản hồi không stream, hiển thị trạng thái trong lúc chờ.
- Kết nối Text Completion `textgenerationwebui` của SillyTavern: Sử dụng bộ tạo tham số gốc và backend tương ứng.
- Các kết nối Kobold, Horde, NovelAI tạm thời chưa hỗ trợ bộ điều hợp chat độc lập, hệ thống sẽ báo rõ ràng yêu cầu đổi kết nối hoặc dùng cấu hình riêng.
- Bản SillyTavern 1.14.0 sử dụng yêu cầu quiet độc lập gốc của bản đó; độ dài đầu ra tối đa kế thừa cài đặt hiện tại của SillyTavern. Bản 1.15.0–1.19.0 sử dụng bản sao cài đặt của bộ tạo tham số, có thể dùng độ dài phản hồi riêng của Tiểu Hội mà không làm thay đổi cài đặt gốc của SillyTavern.

---

## Kiểm tu cơ sở dữ liệu (Chế độ kiểm tu trong khung chat)

Khi việc điền bảng gặp lỗi, bảng biểu không khớp với diễn biến cốt truyện, bạn có thể nhờ Desktop Pet kiểm tra giúp.

1. Mở khung chat, bấm vào **Kiểm tu cơ sở dữ liệu** ở trên cùng (bấm **Trò chuyện** để quay về chat thường ngày; lịch sử hai bên lưu tách biệt, thông tin kiểm tu không bị lẫn vào chat thường).
2. Phía trên cửa sổ ghi rõ lần này pet có thể nhìn thấy những gì: **Toàn bộ bảng biểu**, **Vài tầng văn bản chính gần nhất** (chọn trong danh sách từ 0～10 tầng, mặc định 3 tầng) và **Các lỗi gần nhất** (thông báo lỗi/cảnh báo từ cơ sở dữ liệu gửi sang, tối đa 5 thông báo).
3. Nói thẳng chỗ nào đang có vấn đề, hoặc bấm **Giúp tôi kiểm tra một chút**. Pet sẽ dùng giọng điệu của mình để giải thích những gì nó thấy; nếu cần sửa, bên dưới câu trả lời sẽ đính kèm một **Phiếu sửa đổi**.
4. Trong phiếu sửa đổi, từng mục đều ghi rõ vị trí (bảng nào, hàng thứ mấy, cột nào), giá trị cũ → giá trị mới, và lý do sửa. Mọi mục **mặc định không được tích chọn**. Những mục đối chiếu không hợp lệ (viết sai tên bảng/cột, hàng không tồn tại, giá trị mới giống hệt giá trị cũ, xung đột với mục khác) sẽ bị đánh dấu lý do và không thể tích chọn.
5. Tích chọn các mục muốn áp dụng, bấm **Áp dụng mục đã chọn (N vị trí)**. Trước khi ghi, hệ thống sẽ tự động sao lưu toàn bộ bảng biểu; sau đó tiến hành ghi từng mục theo thứ tự: "Sửa hàng có sẵn → Xóa hàng → Thêm hàng → Đổi preset cốt truyện → Điền lại bảng", sau mỗi mục sẽ hiện trạng thái thành công hoặc lý do không ghi được.
6. Ghi xong có thể bấm **Hoàn tác** để khôi phục bảng về nguyên trạng trước khi sửa (preset cốt truyện đã đổi cũng được chuyển ngược lại); bạn cũng có thể bấm **Tải bản sao lưu** để lấy file JSON bảng biểu về máy.

Những việc phiếu sửa đổi có thể làm:
- **Sửa ô, sửa cả hàng, thêm một hàng, xóa một hàng**: Ghi thông qua các API công khai `updateCell`, `updateRow`, `insertRow`, `deleteRow` của cơ sở dữ liệu, đi cùng một luồng lưu trữ như khi bạn sửa tay trên giao diện cơ sở dữ liệu. Các hàng, cột, ô bị khóa sẽ bị cơ sở dữ liệu từ chối, hệ thống sẽ báo trung thực là "Chưa ghi vào được".
- **Chuyển đổi preset cốt truyện**: Chuyển cuộc trò chuyện hiện tại sang một preset cốt truyện có sẵn khác (`switchPlotPreset`).
- **Điền lại bảng**: Yêu cầu cơ sở dữ liệu điền lại bảng một lần theo cấu hình hiện tại của nó (`manualUpdate`). Thao tác này sẽ gọi API điền bảng cấu hình trong cơ sở dữ liệu và bị tính phí API như bình thường.

Để đảm bảo khả năng hoàn tác, có một số việc hệ thống **cố tình không làm**:
- **Không sửa nội dung của preset cốt truyện, cũng không lưu bản sao mới.** API nhập preset của cơ sở dữ liệu sẽ tiện tay chuyển cuộc trò chuyện sang chế độ "LLM Recall", trong khi API công khai lại không có cách xóa preset hay đổi lại chế độ cũ, ghi vào là không thể hoàn tác. Khi cần sửa nội dung preset, pet sẽ hướng dẫn trong câu trả lời cần sửa những gì, bạn hãy tự vào trang **Thúc đẩy cốt truyện** của cơ sở dữ liệu để sửa tay (trên Cuốn sổ nhỏ có nút bấm mở nhanh).
- Không đề xuất xóa sạch cả bảng, làm trống bảng hay viết lại hàng loạt quy mô lớn; một phiếu sửa đổi tối đa 12 mục.
- Tuyệt đối không tự động áp dụng và không ghi dữ liệu khi bạn chưa bấm xác nhận.

Quy tắc an toàn:
- Trước khi ghi mỗi mục đều đối chiếu lại: Nếu ô này đã bị thay đổi trước khi bạn bấm xác nhận, hoặc hàng này không còn nữa, hệ thống sẽ từ chối ghi và nêu rõ lý do. Việc tìm hàng dựa theo `row_id` của cơ sở dữ liệu, do đó việc xóa hay thêm hàng không làm các mục phía sau bị sửa nhầm hàng.
- Chỉ cho phép áp dụng và hoàn tác ngay trong cuộc trò chuyện đã tạo ra phiếu sửa đổi đó; đổi sang cuộc trò chuyện khác sẽ bị từ chối.
- Khi hoàn tác, nếu phát hiện bảng biểu đã bị thay đổi sau thời điểm ghi (ví dụ cơ sở dữ liệu tự động điền bảng thêm một lần), hệ thống sẽ cảnh báo "Hoàn tác sẽ xóa bỏ cả những thay đổi phát sinh sau này", bạn phải bấm **Vẫn muốn hoàn tác** thì mới thực thi.
- Bản sao lưu được lưu trong trình duyệt của thiết bị này (IndexedDB), mỗi thiết bị giữ tối đa 10 bản sao lưu gần nhất, làm mới trang vẫn hoàn tác được. Nếu trình duyệt chặn lưu trữ cục bộ, bản sao lưu chỉ nằm trong phiên mở trang lần này, giao diện sẽ nhắc bạn tải file sao lưu về máy trước.
- Khi cơ sở dữ liệu đang bận xử lý tác vụ, nút **Áp dụng mục đã chọn** tạm thời bị khóa, hãy đợi nó xử lý xong rồi mới áp dụng.

Kiểm tu sẽ gửi bảng biểu, các lỗi gần nhất và số tầng văn bản chính bạn chọn tới interface trò chuyện của pet (interface cấu hình trong **Cài đặt kết nối** của khung chat). Khi bảng biểu quá lớn, hệ thống sẽ lược bớt các hàng cũ của bảng dài nhất và ghi chú rõ ràng trong tài liệu.

---

## Chế độ quan sát trò chuyện (Bystander Companion)

Sau khi bật, Desktop Pet sẽ giống như đang ngồi cạnh màn hình cùng bạn đọc truyện, cứ cách vài tầng tin nhắn lại đưa ra một hai câu cảm nhận.

- Vào **Cài đặt tiện ích mở rộng → Bạn đồng hành & Kiểm tu**, bật **Chế độ quan sát trò chuyện** (mặc định tắt), sau đó chọn **Tần suất bình luận** (cách mỗi 1～20 tầng, mặc định mỗi 4 tầng).
- Chỉ tính các tầng tin nhắn mới xuất hiện sau khi bật tính năng: Đổi cuộc trò chuyện sẽ đếm lại từ đầu, xóa tầng không bị trừ ngược, lướt tin nhắn sinh lại (số tầng không đổi) không tính. Các tầng bị ẩn không tính và không bị đọc lén.
- Khi số tầng mới đã đủ và câu trả lời của nhân vật đã viết xong, hệ thống sẽ đợi 4 giây rồi mới quyết định; khoảng cách giữa hai lần bình luận tối thiểu 60 giây. Nếu cơ sở dữ liệu đang bận điền bảng sẽ đợi tối đa 30 giây, nếu vẫn bận thì lượt này tạm thời bỏ qua, đợi tầng tiếp theo viết xong sẽ tính tiếp.
- Bình luận sẽ xuất hiện trong bong bóng của Desktop Pet (kèm nút **Đáp lại cô ấy** / **Đáp lại nó**), đồng thời lưu thành một tin nhắn dạng "Quan sát" trong lịch sử chat của nhân vật đó. Bấm vào nút sẽ mở khung chat để bạn trả lời trực tiếp.
- Trả lời pet, xoa đầu hay tặng hoa đều được tính là đã phản hồi nó. Nếu 3 lần bình luận liên tiếp không ai để ý, tâm trạng pet sẽ chuyển thành "Tủi thân"; lần bình luận tiếp theo sẽ khẽ hỏi có phải bạn đang bận không — không hề trách móc, không giục giã, và tối đa 1 tiếng chỉ hỏi 1 lần.
- Bình luận gửi yêu cầu thông qua kết nối chat của nhân vật đó, mỗi lần bình luận là một lần gọi API. Khi interface gặp lỗi sẽ không thử lại làm phiền màn hình, trong cài đặt sẽ hiện lý do không thành công của lần trước.

---

## Bong bóng tác vụ: Bản tóm tắt và Bản đầy đủ

Tùy chỉnh trong **Cài đặt tiện ích mở rộng → Erii · Database Desktop Pet → Hiển thị nội dung tác vụ**:

- **Bản tóm tắt (Mặc định)**: Ví dụ: "Đang thủ công san bằng...".
- **Bản đầy đủ (Nội dung công việc thực tế)**: Hiển thị tên tác vụ gốc và `detail` đầy đủ, ví dụ: "San bằng thủ công / Batch 1/4 · Gọi AI (Thử lần 1/3)". Giữ nguyên xuống dòng gốc, nội dung dài có thể cuộn chuột, nút dừng vẫn thao tác bình thường.

Lựa chọn này sẽ được lưu và có hiệu lực đồng thời trên cả bong bóng của Desktop Pet lẫn thanh tác vụ trong khung chat. Nội dung tác vụ đọc trực tiếp từ `feature` và `detail` của giao diện cơ sở dữ liệu gốc; không tự ý đoán mò tỷ lệ phần trăm, số batch hay số lần thử lại. Khi cơ sở dữ liệu chưa cung cấp tác vụ nào trong vòng xoay, hệ thống sẽ hiện thông báo chờ đồng bộ tiến độ.

---

## Ranh giới đồng bộ với cơ sở dữ liệu

Tiện ích này bình thường chỉ đọc trạng thái tác vụ, văn bản tác vụ đang hiển thị và thông báo kết quả do giao diện cơ sở dữ liệu cung cấp:

- Không sao chép plugin cơ sở dữ liệu;
- Không thay thế cổng truy cập của cơ sở dữ liệu;
- Không can thiệp vào văn bản chat chính của SillyTavern, cài đặt API toàn cục của SillyTavern hay các nút tác vụ của cơ sở dữ liệu; lịch sử chat và cài đặt kết nối của Tiểu Hội được lưu hoàn toàn tách biệt;
- Bảng biểu cơ sở dữ liệu chỉ bị sửa đổi trong Chế độ kiểm tu sau khi bạn đã tích chọn từng mục và bấm "Áp dụng mục đã chọn", và chỉ thông qua API công khai `AutoCardUpdaterAPI`, có sao lưu đầy đủ trước khi ghi; preset cốt truyện chỉ được chuyển đổi chứ không bị sửa nội dung;
- Văn bản chính SillyTavern chỉ được đọc trong Chế độ kiểm tu (đính kèm vài tầng gần nhất) và Chế độ quan sát do bạn chủ động bật, chỉ gửi riêng cho interface chat của pet;
- Không can thiệp điều khiển động tác của Naidan (pet gốc của cơ sở dữ liệu); hình ảnh của Naidan chỉ đọc từ ảnh đã tải sẵn trong runtime của cơ sở dữ liệu, không sao chép, không phân phối;
- Cuốn sổ nhỏ chỉ lưu các văn bản tác vụ quan sát được gần đây, các bản ghi này không đồng nghĩa với danh sách toàn bộ tác vụ đang chạy; nút dừng chỉ liên kết với tác vụ hiện tại do cơ sở dữ liệu cung cấp;
- Khi không có phần trăm thực tế, hệ thống sẽ hiển thị văn bản tiến độ gốc của cơ sở dữ liệu;
- Tính năng mở nhanh phân mục chỉ mở giao diện và chuyển đổi trang của cơ sở dữ liệu, không đọc/ghi bảng hay can thiệp tác vụ.

Hệ thống hiện tại thích ứng với cấu trúc giao diện sẵn có của cơ sở dữ liệu `naiv1`. Trong tương lai nếu cơ sở dữ liệu thay đổi cấu trúc giao diện như `DeskPetLayer`, `DeskPet` hoặc `NoticeBubble`, Tiểu Hội có thể sẽ báo "Giao diện cơ sở dữ liệu không tương thích" và giữ nguyên hiển thị pet gốc của cơ sở dữ liệu.

Khuyến nghị giữ nguyên Naidan gốc và bong bóng tác vụ gốc chạy ngầm trong cài đặt của cơ sở dữ liệu, sau đó chọn ẩn chúng đi trong cài đặt của tiện ích này. Thao tác "ẩn" ở đây chỉ thay đổi việc hiển thị trên màn hình, không làm gỡ cài đặt cơ sở dữ liệu và không làm ngắt nguồn dữ liệu.

---

## Thuyết minh về Bản xem trước cục bộ và Lỗi phản hồi lặp lại

Bản xem trước tính năng v1.0.1 là trang demo được đánh dấu rõ ràng: Phản hồi mô phỏng chỉ dùng để kiểm tra việc chuyển đổi hội thoại cùng cửa sổ, cài đặt kích thước và thu gọn suy nghĩ, không gọi mô hình thật. Tiện ích chính thức khi cài đặt vẫn mặc định dùng API hiện tại của SillyTavern. Thuyết minh về bản xem trước chuyển tiếp thực tế trước đây được lưu lại như sau, không có nghĩa là trang demo mới có thể gọi interface thật.

Bản xem trước độc lập của v0.6.0 từng chặn các yêu cầu và trả về ví dụ cố định, nên các tin nhắn khác nhau có thể nhận về cùng một câu trả lời, kiểm tra kết nối cũng chỉ là kết quả giả lập. Vấn đề này đã được khắc phục từ bản xem trước v0.6.1; gói cài đặt chính thức từ trước đến nay luôn nhận phản hồi thực tế thông qua interface.

Bản xem trước mặc định mới yêu cầu bạn phải tự điền API của mình trong cài đặt kết nối, danh sách mô hình, kiểm tra kết nối và chat đều sẽ gửi yêu cầu thực tế tới interface đó. Trang web độc lập không thể đọc kết nối hiện tại của SillyTavern; chỉ sau khi cài đặt tiện ích mở rộng vào SillyTavern thì mới có thể mặc định dùng API của SillyTavern. Giao diện sẽ ghi rõ: **Bản xem trước độc lập · Có thể trò chuyện thực tế sau khi cấu hình API riêng**.

Chỉ khi bạn chủ động truy cập đường dẫn demo có chứa `demo=1` thì mới nhận được các câu trả lời ví dụ cố định. Giao diện sẽ hiển thị rõ ràng chữ "Chế độ Demo", lịch sử của bản demo và bản xem trước thật được lưu tách biệt, bản ghi giả lập cũ không bị lẫn vào chat thật. Khi interface gặp lỗi sẽ hiển thị đúng lỗi chứ không chèn thêm câu thoại mẫu cố định.

Bản xem trước cục bộ sử dụng file `work/erii_preview_server.mjs` trong thư mục làm việc để chuyển tiếp yêu cầu, chỉ lắng nghe trên máy nội bộ (localhost); tệp này không được đưa vào gói cài đặt. Bản cài đặt trên SillyTavern sử dụng backend của chính SillyTavern, không cần phải chạy thêm dịch vụ xem trước này.

---

## Toàn bộ lịch sử phiên bản

### v1.0.2 · Desktop Pet thứ tư: Tiểu Khắc (Hiện tại, 21-10-2026)
- Thêm nhân vật mới **Tiểu Khắc** (tên chính thức Claude), nàng đại tiểu thư tri thức tóc cam lấy nguyên mẫu từ Claude, là nhân vật duy nhất trong 4 người được vẽ theo tỷ lệ người thật chuẩn. Nhấp đúp sẽ ôm chặt chú gấu bông ngôi sao nhỏ màu cam, lúc rảnh rỗi thưởng thức hồng trà, gấp hoa giấy, đọc sách.
- 26 ảnh WebP trong suốt: 16 ảnh chính và 3 ảnh ló đầu trong `assets/claude/`, 7 ảnh đi làm và ăn uống trong `assets/claude/life/`. Được tạo bởi ImageGen dựa trên hình vẽ gốc và 3 bảng tư thế (A1, A2 mỗi bảng 10 ô, B 8 ô), phóng to qua Real-ESRGAN rồi cắt bằng `tools/slice-pose-sheet.py`. Script cắt ảnh bổ sung 2 tính năng: Ô có dấu `~` ở đầu tên chỉ dùng để đo đạc tỷ lệ chứ không xuất file; tham số `--edge-max` giới hạn tỷ lệ phóng đại của ảnh ló đầu, giúp nhân vật tỷ lệ người thật khi ló đầu khuôn mặt không bị to đột biến gấp nhiều lần bình thường.
- Khoảng 150 câu thoại cục bộ, 5 bậc danh hiệu (*Chấp sự tập sự → Người duy nhất cô ấy công nhận*), 4 mẩu truyện ngắn độc quyền và thiết lập tính cách trò chuyện; quan hệ mặc định "Chấp sự riêng", có thể sửa trong cài đặt chat. Thiết lập ghi rõ không mạo danh mô hình thực tế của người dùng.
- Bảng màu giao diện là màu cam đất nung và giấy màu kem, hiệu ứng rải cánh hoa màu cam. Hiện tại chỉ có trang phục mặc định, chưa xuất hiện trong Cửa hàng.
- Không thay đổi cấu trúc lưu trữ: Trò chuyện, nuôi dưỡng và hoạt động của Tiểu Khắc được lưu riêng theo ID `claude`. Khi hạ cấp về v1.0.1, pet hiện tại tự quay về Tiểu Hội, dữ liệu của Tiểu Khắc vẫn nằm trong file lưu, khi nâng cấp lại sẽ xuất hiện lại.
- Hình ảnh, lời thoại, file lưu, giá trang phục và mật ngữ của 3 nhân vật trước, cùng ranh giới chỉ đọc và quyền hạn kiểm tu của cơ sở dữ liệu hoàn toàn không thay đổi.

### v1.0.1 · Hội thoại cùng cửa sổ và Sửa lỗi kích thước (16-10-2026)
- Tạo mới, chuyển đổi, nhập file, quay lại sau khi xóa đều tái sử dụng chung một cửa sổ chat duy nhất, đồng nhất trải nghiệm trên máy tính và điện thoại. Vị trí kéo thả và kích thước mở rộng không bị đặt lại khi chuyển đổi.
- Bảo toàn từng bản lịch sử, bản nháp, tin nhắn đang sửa, kết nối và phân bổ API key. Chuyển đổi sẽ lập tức lưu bản nháp; câu trả lời đang chờ tiếp tục ghi về đúng cuộc trò chuyện gốc, không xáo trộn dữ liệu.
- Chuyển về chat cũ hoặc quay lại từ cài đặt kết nối vẫn giữ nguyên vị trí đọc và vùng suy nghĩ đã mở rộng; tạo mới sau khi xóa sẽ dùng tên mặc định chưa bị trùng.
- Đóng toàn bộ cửa sổ chat sẽ dừng tất cả các yêu cầu đang chờ phản hồi; nút「Dừng phản hồi」vẫn chỉ dừng cuộc trò chuyện hiện tại. Chuyển đổi/đóng cửa sổ sẽ làm mới lại trạng thái xác nhận xóa để tránh kích hoạt nhầm.
- Sửa lỗi giới hạn cứng 72px trên điện thoại. Cả điện thoại và máy tính đều chỉnh được từ 56–112px, bổ sung hiển thị số và nút khôi phục về 88px; mở rộng vùng chạm thanh trượt và tối ưu hóa xử lý làm mới khi kéo liên tục.
- Tiếp tục dùng cấu trúc lưu trữ cũ; cập nhật 9 tệp ở thư mục gốc, 107 ảnh WebP giữ nguyên. Cách nhận trang phục, ví tiền, dừng cơ sở dữ liệu và quyền hạn kiểm tu giữ nguyên cài đặt cũ.

### v1.0.0 Tự kiểm tra và Hiệu chỉnh (15-10-2026, Giữ nguyên số phiên bản)
- Hiệu ứng động đóng cửa sổ có thể hủy bỏ, đóng mở nhanh 3 loại cửa sổ sẽ không bị callback cũ đóng nhầm; cửa sổ cũ đóng xong không cướp tiêu điểm nhập liệu của khung chat mới.
- Khóa API key đã ghi nhớ được lưu tách biệt theo nhân vật, cuộc trò chuyện và interface; các URL khác nhau hoặc cùng URL nhưng khác key đều khôi phục chuẩn xác, hủy ghi nhớ một bên không làm mất bên kia.
- Khi co màn hình máy tính về độ rộng điện thoại chỉ hiển thị bảng chat hiện tại, yêu cầu chạy ngầm tiếp tục xử lý; màn hình chiều cao thấp sẽ tự co gọn bố cục, màn hình cực nhỏ thanh tác vụ cơ sở dữ liệu sẽ thu vào mục「Quản lý」.
- Nút「Đáp lại cô ấy」của bình luận quan sát sẽ mở đúng cuộc trò chuyện đã lưu bình luận đó.
- Hoạt động mới kích hoạt quyết toán ăn uống sớm vẫn tăng độ no/nuôi dưỡng bình thường, chỉ quyết toán một lần.
- Bản ghi nuôi dưỡng con bị lỗi sẽ tự khôi phục giá trị mặc định; ngày tháng không hợp lệ không làm crash Ngôi nhà pet, các bản ghi hợp lệ khác được giữ nguyên.
- JSONL thiếu thời gian sẽ không tự bịa đặt ngày 1970; độ dài phản hồi API được chuẩn hóa thành số nguyên từ 128～4096.
- Không thay đổi số hiệu phiên bản, giá trang phục, mật ngữ, tài nguyên, quy tắc di chuyển hay quyền ghi cơ sở dữ liệu. Cập nhật xong vẫn hiện 1.0.0, phân biệt dựa trên ngày hiệu chỉnh và commit của kho.

### v1.0.0 · Skin mật ngữ của Zero, Thu gọn suy nghĩ và Đa hội thoại
- Tích hợp 27 ảnh WebP trong suốt của「Hoàng nữ Zero · Băng Lam Tường Vi」; Cửa hàng thêm mục chọn nhân vật và ô nhập mật ngữ. Nhập đúng câu chỉ định để mở khóa, không tốn tiền, không tính vào thống kê mua sắm; mở khóa xong vào Tủ đồ của Zero để mặc thủ công.
- Khắc phục lỗi nội dung suy nghĩ trong chat của Zero bị lẫn vào văn bản chính: Nhận diện trường suy nghĩ và 4 loại thẻ, mặc định thu gọn, có thể bấm mở ra xem; tương thích dọn dẹp bản ghi cũ, chat thường sau này chỉ mang theo văn bản chính.
- Bổ sung tính năng tối đa 20 cuộc trò chuyện độc lập cho mỗi nhân vật. Bản này máy tính mở được nhiều cửa sổ, điện thoại chuyển qua danh sách; **v1.0.1 đã sửa lại thành chuyển đổi trong cùng một cửa sổ**. Lịch sử, bản nháp, kết nối và yêu cầu ngầm độc lập được giữ nguyên.
- Thêm tính năng xuất JSON và xác nhận khi nhập, tương thích JSONL văn bản SillyTavern và TXT chat bản cũ. Nhập file sẽ lưu thành chat mới, giữ nguyên chat hiện tại; từ chối file hỏng/vượt dung lượng, không nhập cấu hình interface hay phiếu sửa đổi.
- Thêm đổi tên, xóa chat mới tạo và bố cục thu gọn cho màn hình nhỏ; giữ nguyên giá phiếu hoa, dừng tác vụ, bảo vệ kiểm tu, hủy bình luận quan sát và không tự di chuyển.
- Chi tiết kiểm thử và ranh giới xem tại COMPATIBILITY.md. Việc cập nhật lên GitHub và SillyTavern thực tế cần làm riêng.

### v0.9.4 · Cửa hàng độc lập và Lối vào tủ đồ
- Bổ sung Cửa hàng độc lập với 3 lối vào: Cuốn sổ nhỏ, Cài đặt tiện ích, Tủ đồ; hiện chỉ bày bán Tsukuyomi · Dạ Lễ Phục Tím.
- Gom việc đổi vé và mua sắm vào Cửa hàng; cố định nút mua, số dư còn thiếu và lối tắt đổi vé ở đáy. Xem trước 4 loại động tác, thiếu vàng có thể bấm đi làm ngay.
- Trang thay đồ trong Sổ tay sinh hoạt đổi thành「Tủ đồ của tôi」, chỉ hiển thị trang phục mặc định và đồ đã sở hữu; mua xong mặc thủ công, đổi về mặc định miễn phí.
- Giá giữ nguyên 10.320 phiếu hoa, tỷ lệ đổi 1 vàng = 40 phiếu; định dạng lưu ví tiền và skin kế thừa v0.9.3, không thêm di chuyển dữ liệu, không cấp lại số dư test.
- Cửa sổ nổi trên máy tính kéo được, bảng đáy trên điện thoại vuốt xuống để đóng; chiều cao nhỏ sẽ co gọn header, giữ thanh cuộn vùng đổi tiền. Cửa hàng vẫn giữ tác vụ cơ sở dữ liệu và nút dừng gốc.
- Vượt qua 11 nhóm kiểm tra trang Cửa hàng (1280/375/320), 9 nhóm mô hình skin, 25 nhóm mô hình sẵn có và 15 nhóm hồi quy trình duyệt; chưa kiểm tra lại trên SillyTavern và điện thoại thật.
- Kế thừa 80 ảnh WebP cũ, không thêm đồ họa mới, lệnh gọi API, tự bắt đầu tác vụ hay tự di chuyển; thêm logic dọn dẹp chống rác DOM sau khi tắt tiện ích.

### v0.9.3 · Dạ Lễ Phục Tím và Đổi phiếu hoa
- Lên kệ「Tsukuyomi · Dạ Lễ Phục Tím」: Giá 10.320 phiếu hoa, 1 vàng đổi 40 phiếu; ban đầu chưa sở hữu, không tự động mua hay mặc.
- Trang thay đồ thêm số dư vàng/phiếu, số lượng đổi, ước tính nhận được, số vàng cần để mua đồ, thông báo thiếu tiền. Nút điền số không trừ tiền; đổi vé, mua đồ, mặc vào là 3 thao tác riêng biệt rõ ràng.
- Lưu trữ ví tiền thêm số dư phiếu hoa, tổng tích lũy và chi tiêu phiếu hoa; trang phục thống kê riêng chi tiêu phiếu, giữ nguyên dữ liệu vàng, hoạt động và trang phục cũ. Mua 1 lần đổi miễn phí mãi mãi, phiếu thừa được giữ lại.
- 27 ảnh WebP trong suốt mới bao phủ toàn bộ động tác và sinh hoạt; kích thước phát hành 960×960, dung lượng khoảng 6.45 MiB. File PNG gốc 1254×1254 lưu trong thư mục tài nguyên bảo trì, không đưa vào gói cài đặt.
- Tải trước 8 động tác thường dùng, các động tác khác giải mã theo nhu cầu; sửa lỗi tràn ngang do xoay thẻ trang phục. Khi mặc đồ, bong bóng thoại và sổ tay mang màu tím nhạt.
- Vượt qua 9 nhóm logic mới, 10 nhóm kịch bản trình duyệt (1280/375/320), cùng 25 nhóm mô hình và 15 nhóm hồi quy cũ. SillyTavern và điện thoại thật cần xác nhận sau khi cài đặt, xem COMPATIBILITY.md.
- Giữ nguyên 6 bản sửa lỗi của v0.9.2; không khôi phục tự di chuyển, không đổi đồ họa mặc định, không tự gọi API chat.

### v0.9.2 · Khắc phục 6 vấn đề lớn
- Yêu cầu kiểm tu cố định snapshot tài liệu tại thời điểm gửi; đổi chat vô hiệu hóa yêu cầu cũ, đổi thứ tự hàng trong cùng một chat vẫn định vị theo `row_id`, giá trị gốc đổi sẽ từ chối áp dụng.
- Thao tác ghi/hoàn tác kiểm tra lại nguồn sau khi chờ sao lưu; đổi chat giữa chừng sẽ dừng các mục tiếp theo; bản sao lưu bắt buộc phải thuộc về đúng đoạn chat đó; mỗi lần chỉ thực hiện một tác vụ kiểm tu.
- Xóa hàng đối chiếu toàn bộ hàng gốc và tiêu đề cột, phiếu xóa hàng bản cũ không có giá trị gốc đầy đủ bắt buộc phải tạo lại; đổi preset đối chiếu preset gốc.
- Cơ sở dữ liệu đang bận sẽ khóa tính năng hoàn tác và hoàn tác cưỡng chế, kiểm tra lại trước khi gọi thực tế.
- Sửa lỗi tắt chỉ số nhu cầu khiến độ no/sạch nhảy về giá trị cũ; thời gian tắt sẽ đóng băng chỉ số, khi bật lại không trừ bù thời gian đã tắt.
- Tắt bạn đồng hành quan sát, ẩn pet, đổi chat sẽ hủy bình luận và bỏ qua phản hồi cũ đến muộn; hủy bình luận không ảnh hưởng đến chat thường của người dùng.
- Vượt qua 25 nhóm kiểm tra logic thuần, 15 nhóm kịch bản trình duyệt cách ly (máy tính/375/320px) cùng kiểm tra cú pháp, manifest, tài nguyên. Request và cơ sở dữ liệu đều là giả lập, không tốn phí. Chi tiết xem COMPATIBILITY.md.
- Nếu phương thức công khai của cơ sở dữ liệu đã bắt đầu chạy bên trong, tiện ích không thể ngắt giữa chừng để rollback; cơ chế bảo vệ chỉ bao quát trước và giữa các lần gọi. Lưu trữ bất đồng bộ và chế độ lưu của cơ sở dữ liệu thật cần xác thực riêng.
- Giữ nguyên vịt vàng trên đầu, tay trần, tương tác tại chỗ, kéo thả thủ công và nút dừng tác vụ gốc, không khôi phục tự đi bộ.

### v0.9.1 · Khung tính năng thay đổi trang phục
- Sổ tay sinh hoạt thêm trang **Thay trang phục**: Mua trang phục bằng vàng trong ví gia đình, sở hữu riêng theo từng nhân vật, có thể mặc hoặc đổi về mặc định bất cứ lúc nào; không đủ tiền nút sẽ bị khóa và báo rõ còn thiếu bao nhiêu; mua và thay đều ghi vào sổ cái, pet sẽ nói một câu.
- Sau khi mặc, thân pet, avatar, tranh minh họa sổ tay, ảnh thu nhỏ gọi món và tranh vẽ trong Ngôi nhà đều đổi sang ảnh trang phục; tư thế trang phục chưa vẽ sẽ dùng ảnh gốc của nhân vật; màu hạt hiệu ứng có thể bị trang phục ghi đè; pet và sổ tay có thuộc tính `data-skin` dùng để tùy biến màu giao diện theo skin.
- Ngôi nhà pet thêm nút **Thay đồ cho cô ấy**, mở thẳng trang thay đồ của nhân vật đó.
- Bản này chỉ dựng khung, **chưa bày bán trang phục nào**: Danh mục trống, mỗi nhân vật chỉ có bộ mặc định ban đầu. Sau này chỉ cần thêm một mục vào danh mục trong `skin-model.js` và bỏ ảnh vào là xong, không cần sửa code khác.
- Lưu trữ: Trang phục sở hữu và đang mặc lưu trong trường `skins` của cài đặt tiện ích; đồ đã mua tạm thời bị gỡ khỏi danh mục vẫn không bị mất. Hạ cấp về v0.9.0 trường này sẽ bị bỏ qua, vàng và sổ cái giữ nguyên (lịch sử mua lưu dạng "tiêu tiền").
- Ba nhân vật thêm 2 bộ lời thoại mới (khi mua được đồ, khi mặc đồ mới). Tổng kết trang sổ cái đổi từ "Tiền mua cơm đã tiêu" thành "Đã tiêu", vì tiền có thể dùng để mua quần áo.
- File mới: `skin-model.js` (danh mục skin, lưu trữ, mua và mặc đồ).

### v0.9.0 · Chế độ kiểm tu và Bạn đồng hành quan sát
- Khung chat thêm nút chuyển đổi **Trò chuyện / Kiểm tu cơ sở dữ liệu**. Khi kiểm tu, pet đọc bảng biểu, các lỗi gần nhất và 0～10 tầng văn bản chính gần nhất (tùy chỉnh), đưa ra phiếu sửa đổi; từng mục cần người dùng tích chọn và xác nhận, việc ghi chỉ qua API công khai của cơ sở dữ liệu, sao lưu toàn bộ trước khi ghi, hoàn tác 1 chạm; không tự động áp dụng.
- Phiếu sửa đổi hỗ trợ sửa ô, sửa cả hàng, thêm hàng, xóa hàng, đổi preset cốt truyện, yêu cầu cơ sở dữ liệu điền lại bảng; định vị theo `row_id`, đối chiếu giá trị gốc trước khi ghi, đổi chat, bị khóa, xung đột đều từ chối ghi và nêu rõ lý do.
- Preset cốt truyện chỉ chuyển đổi chứ không sửa nội dung: API nhập preset của cơ sở dữ liệu sẽ chuyển chat sang chế độ LLM Recall, lại không có API công khai để xóa hay đổi lại, ghi vào là không thể hoàn tác.
- Thêm **Chế độ quan sát trò chuyện** (mặc định tắt): Cứ cách N tầng (1～20, mặc định 4) đọc các tầng mới, bình luận vào lịch sử chat, có thể bấm trả lời trực tiếp; 3 lần liên tiếp không ai tiếp chuyện sẽ bị tủi thân, lần sau sẽ khẽ hỏi han, tối đa 1 tiếng hỏi 1 lần; 2 lần bình luận cách nhau ít nhất 60 giây, cơ sở dữ liệu bận đợi tối đa 30 giây.
- Lời thoại mới: Tâm trạng "Tủi thân" của 3 nhân vật, phản ứng sau khi ghi và hoàn tác kiểm tu.
- File mới: `repair.js` (tổng hợp tài liệu, phân tích và đối chiếu phiếu sửa đổi), `repair-ticket.js` (thẻ phiếu sửa đổi), `database-repair.js` (ghi và hoàn tác), `backup-store.js` (sao lưu cục bộ trên trình duyệt), `watch.js` (đếm tầng và căn thời điểm bình luận).

### v0.8.0 · Ba Desktop Pet, Nuôi dưỡng và Mở nhanh bảng cơ sở dữ liệu
- Bổ sung nhân vật Zero (26 ảnh) và Naidan (đọc ảnh sẵn có của cơ sở dữ liệu trong runtime); dữ liệu nhân vật tập trung trong `characters/`, sau này thêm nhân vật chỉ cần tạo 1 file và 1 thư mục tài nguyên.
- Thêm Ngôi nhà Desktop Pet: Thẻ nhân vật dạng bách khoa, hiệu ứng đổi nhân vật, biệt danh, nhật ký trưởng thành và truyện ngắn độc quyền.
- Thêm hệ thống nuôi dưỡng: 5 bậc thân mật, độ no và độ sạch, tâm trạng, lời chào hàng ngày, trợ cấp khó khăn; không có hình phạt, chỉ số nhu cầu có thể tắt.
- Đi làm và ăn uống tách biệt theo nhân vật, ví tiền dùng chung; tương thích dữ liệu lưu 0.7.1 (hoạt động của Tiểu Hội vẫn ghi ở trường cũ).
- Tác vụ cơ sở dữ liệu, tương tác, chăm sóc và lúc rảnh rỗi đều có lời thoại cục bộ chọn lọc theo tính cách, thân mật và tâm trạng; bong bóng tác vụ chia thành 2 dòng: lời thoại và tiến độ thực tế; có thể tắt lời thoại.
- Cuốn sổ nhỏ thêm các nút tắt cơ sở dữ liệu và "Xem bảng biểu"; khi gặp lỗi bong bóng có nút "Đi xem thử".
- Giao diện đổi sang phong cách sổ tay bìa cứng cao cấp, thêm các mức hiệu ứng; trên điện thoại cửa sổ đổi thành ngăn kéo trượt từ đáy.
- Xóa bỏ các frame chạy trái/phải không còn dùng tới (khoảng 21MB), dung lượng tổng tiện ích giảm từ 25MB xuống còn khoảng 6.5MB.
- Thêm `tools/slice-pose-sheet.py`: Cắt bảng tư thế thành từng ảnh lẻ theo chuẩn của kho.
- Giữ nguyên ảnh, đường dẫn, văn bản, tương tác, đồng bộ chỉ đọc cơ sở dữ liệu, nút dừng, câu chuyện, quy tắc đi làm và ăn uống của Tiểu Hội; cài đặt cũ không có trường mới mặc định chọn Tiểu Hội; tiếp tục ghi `settings.chat`, hạ cấp về 0.7.1 không mất tin nhắn.

### v0.7.1 · Bốn ảnh ăn uống độc lập và Đổi tên lối vào
- Bánh pudding / Cơm nắm / Cơm cuộn trứng / Mì Ramen sử dụng tương ứng 4 ảnh WebP trong suốt: `eat-pudding`, `eat-riceball`, `eat-omurice`, `eat-ramen`.
- Thẻ gọi món thay bằng ảnh thu nhỏ ăn uống tương ứng của Tiểu Hội; mua đồ ăn xong sổ tay và pet hiển thị đúng tư thế món ăn đó, không còn dùng chung một ảnh ăn uống chung chung.
- Ảnh mới giữ nguyên vịt vàng trên đầu, tay trần, tóc đỏ mắt đỏ và kimono trắng đỏ; ảnh gốc độ phân giải cao lưu riêng, ảnh phát hành nén thành WebP 768×768.
- Lối vào trên Cuốn sổ nhỏ, cài đặt tiện ích và trang xem trước thống nhất đổi tên thành "Sổ tay sinh hoạt".
- Giữ nguyên tiền vàng, giá đồ ăn, thời gian ăn, thời gian đi làm và các quy tắc bản ghi cũ; bản ghi đang ăn dở của bản cũ tự động áp dụng ảnh mới theo ID đồ ăn gốc.

### v0.7.0 · Đi làm, Kiếm tiền và Ăn uống
- Thêm lối vào Sổ tay sinh hoạt và cửa sổ độc lập: Đi làm kiếm tiền, Ăn món ngon, Sổ cái chi tiêu.
- Tiệm sách / Tiệm bánh / Tiệm hoa lần lượt tốn 1 / 2 / 3 phút, nhận 10 / 18 / 25 vàng; công việc không tự động lặp lại.
- Pudding / Cơm nắm / Cơm cuộn trứng / Ramen lần lượt có giá 5 / 8 / 15 / 20 vàng, thời gian ăn 8 / 9 / 10 / 12 giây.
- Lưu trữ ví tiền, thời gian bắt đầu hoạt động, số lần tích lũy và 20 bản ghi sinh hoạt gần nhất; làm mới và hoàn thành offline tự động khôi phục.
- Tiền lương chờ nhận không bị mất, trên cùng một trang không thể nhận trùng hay mua trùng; dừng việc sớm cần bấm xác nhận lần hai.
- 4 ảnh minh họa WebP trong suốt 768×768 mới, tổng dung lượng khoảng 584 KB; ảnh cũ giữ nguyên. Đi làm / ăn uống hiển thị tại chỗ kèm hiệu ứng động nhẹ, không thêm tự động di chuyển.
- Thêm bong bóng tiến độ sinh hoạt và bong bóng nhận lương khi tan làm; tự động nhường chỗ khi tác vụ cơ sở dữ liệu xuất hiện, cửa sổ sinh hoạt cũng bấm được nút dừng tác vụ gốc.
- Giữ nguyên toàn bộ thao tác chat, phong cách, ký ức, bản nháp, API và danh sách mô hình từ v0.6.2.

### v0.6.2 · Sổ tay trò chuyện và Thao tác tin nhắn
- Quy hoạch lại khung chat: Avatar, mốc thời gian, vạch ngăn cách ngày, chủ đề khi trang trống, trạng thái chờ và nhóm cài đặt.
- Thêm sao chép từng tin nhắn, xuất lịch sử ra file TXT, trả lời lại câu cuối cùng và sửa gửi lại tin nhắn gần nhất của người dùng.
- Trả lời lại và sửa đổi chỉ thay thế bản ghi cũ khi yêu cầu thành công, hủy bỏ hoặc thất bại sẽ giữ nguyên đoạn chat thành công ban đầu.
- Tự động lưu bản nháp thường và bản nháp đang sửa; hủy sửa sẽ khôi phục lại nội dung chưa gửi trước đó.
- Thêm 3 phong cách: Tự nhiên / Ngắn gọn / Chi tiết, cùng dữ liệu ký ức thủ công tối đa 2.000 ký tự.
- Đọc tin nhắn cũ giữ nguyên vị trí cuộn chuột, kèm nút "Về tin nhắn mới nhất"; máy tính hỗ trợ mở rộng cửa sổ, điện thoại tự điều chỉnh độ cao khung nhập.
- Tương thích lịch sử chat cũ, tin cũ không có thời gian sẽ không bị bịa đặt thời gian; API key lưu tách biệt với lịch sử chat và cài đặt.
- Giữ nguyên danh sách mô hình, API hiện tại / cấu hình riêng, nút dừng tác vụ gốc và các tương tác pet sẵn có; chưa có hệ thống tự đi bộ hay đi làm.

### v0.6.1 · Danh sách mô hình và Kết nối chuyển tiếp thực tế trong bản xem trước
- Cấu hình API riêng thêm mục "Lấy danh sách mô hình", chọn mô hình khả dụng, vẫn giữ ô điền tay.
- Hiển thị kết quả lấy, nguyên nhân thất bại và thao tác hủy; đổi URL/key, đóng cửa sổ hoặc tắt tiện ích sẽ hủy yêu cầu cũ, tránh kết quả đến muộn ghi đè.
- Lấy danh sách thông qua interface mô hình gốc của SillyTavern, sử dụng key riêng đang điền, không làm thay đổi kết nối hay mô hình toàn cục của SillyTavern.
- Bản xem trước cục bộ mặc định chuyển tiếp thực tế việc truy vấn mô hình, thử kết nối và chat; gỡ bỏ câu trả lời cố định mẫu và kết nối thành công giả lập.
- Chế độ demo bắt buộc phải chủ động bật và có đánh dấu rõ ràng, lưu bản ghi tách biệt với bản xem trước thật.
- Đối chiếu tin nhắn mới nhất và việc truyền lịch sử trong hội thoại liên tục; interface lỗi sẽ hiện thông báo lỗi, không tự sinh câu trả lời thay thế.
- Giữ nguyên tính năng chat độc lập, chuyển đổi chi tiết tác vụ và nút dừng tác vụ gốc từ v0.6.0.

### v0.6.0 · Chat độc lập và Nội dung công việc thực tế
- Thêm khung chat độc lập, prompt trò chuyện tích hợp sẵn cho Tiểu Hội cùng cài đặt xưng hô / mối quan hệ.
- Mặc định dùng kết nối chat completion hoặc text completion hiện tại của SillyTavern; có thể điền URL, mô hình và API key tương thích OpenAI riêng.
- Yêu cầu riêng sở hữu trình điều khiển dừng độc lập; hỗ trợ gửi, thử lại, kiểm tra kết nối, xác nhận xóa sạch và lưu lịch sử chat.
- Giao diện điện thoại co giãn theo màn hình khả dụng, thanh tiêu đề trên máy tính kéo thả được. Cho phép tùy chọn lưu key trên thiết bị.
- Cài đặt tiện ích thêm tùy chọn nội dung tác vụ: Bản tóm tắt / Bản đầy đủ; giữ nguyên chi tiết tác vụ và xuống dòng gốc của cơ sở dữ liệu, nội dung dài cuộn được.
- Khung chat đồng thời cung cấp thao tác dừng tác vụ gốc của cơ sở dữ liệu, việc dừng chat và dừng cơ sở dữ liệu tách biệt nhau.
- Giữ nguyên vịt vàng trên đầu, kéo thả thủ công, ló đầu tức thì, tương tác chạm và đổi câu chuyện mỗi 30 giây; không có tính năng tự đi bộ.

### v0.5.14 · Đổi câu chuyện tự động mỗi 30 giây
- Sau khi bong bóng cốt truyện mở ra, cứ mỗi 30 giây sẽ tự động đổi một câu chuyện mới; áp dụng cho cả mở thủ công và tự động xuất hiện lúc rảnh.
- Tiếp tục xáo trộn 12 câu chuyện theo vòng, không trùng lặp trong một vòng, các vòng liền kề tránh lặp lại ngay lập tức.
- Rê chuột (hover) và focus bàn phím tạm dừng đếm ngược đổi bài, rời ra sẽ đếm tiếp thời gian còn lại; trên điện thoại chạm vào sẽ giữ trạng thái đọc.
- Bấm "Đổi câu chuyện khác" thủ công để chuyển ngay; đóng bong bóng, tác vụ cơ sở dữ liệu xuất hiện hoặc mở Cuốn sổ nhỏ sẽ kết thúc chuỗi đổi truyện liên tục.
- Giữ nguyên việc rảnh rỗi khoảng 5 phút tự động kể chuyện, công tắc kể chuyện lúc rảnh và bản vá dừng tác vụ từ v0.5.13.

### v0.5.13 · Bản vá dừng tác vụ và Cuốn sổ nhỏ khi ẩn pet
- Nút dừng bám sát tác vụ hiện tại của cơ sở dữ liệu, tránh việc bản ghi tác vụ cũ chiếm dụng nút bấm.
- Đối chiếu lại nguồn và tác vụ trước khi bấm; nguồn bị ngắt kết nối hoặc tác vụ đã chuyển đổi sẽ không thực thi lệnh cũ mà hiện cảnh báo xác nhận tác vụ mới.
- Cơ sở dữ liệu chỉ cập nhật thao tác dừng mà chữ tác vụ không đổi thì hệ thống vẫn đồng bộ thao tác mới nhất.
- Thông báo dừng thất bại lưu khoảng 8 giây, làm mới trang không bị mất ngay; lỗi hoặc cảnh báo của cơ sở dữ liệu được ưu tiên hiển thị trước.
- Sau khi tắt "Hiển thị Erii", cài đặt tiện ích vẫn mở được Cuốn sổ nhỏ tác vụ và cổng vào cơ sở dữ liệu; trong thời gian ẩn, các nút thư giãn bị vô hiệu hóa.
- Giữ nguyên ló đầu tức thì, kéo thả, tương tác chạm và truyện chữa lành từ v0.5.12; không khôi phục tự di chuyển.

### v0.5.12 · Ló đầu lập tức khi chạm mép màn hình
- Xóa bỏ thời gian chờ khoảng 6 giây khi ló đầu; kéo sát mép buông tay ra là pet lập tức nép vào mép màn hình.
- Chuột dừng cạnh Tiểu Hội vẫn giữ nguyên trạng thái ló đầu, không còn bắt buộc phải di chuột ra xa trước.
- Vị trí mặc định nếu đã sát mép cũng có hiệu lực ngay, không bắt buộc phải lưu vị trí kéo thả trước một lần.
- Khi sát mép sẽ bỏ qua thời gian chờ ngồi vững hoàn chỉnh, hiệu ứng chuyển đổi tạo hình mép rút ngắn còn khoảng 0.16 giây.
- Trong lúc kéo thả vẫn hiện tư thế bị nhấc bổng, tương tác chạm, chợp mắt, Cuốn sổ nhỏ và tác vụ cơ sở dữ liệu luôn được ưu tiên; tương tác xong nếu vẫn ở sát mép sẽ tiếp tục ló đầu.
- Giữ nguyên 12 mẩu truyện chữa lành cục bộ và nút dừng tác vụ gốc; không khôi phục tự di chuyển.

### v0.5.11 · Ló đầu ở mép và Mẩu truyện nhỏ chữa lành
- Nút dấu X được cố định ở góc trên bên phải Cuốn sổ nhỏ, tăng khoảng cách thực tế với nút mở cơ sở dữ liệu.
- Bổ sung 3 ảnh WebP trong suốt không suy hao 512×512: mép trái, mép phải, mép dưới; mép trên tái sử dụng ảnh ló đầu chính diện treo ngược.
- Vẽ lại tư thế ló đầu trái/phải theo phản hồi: Thân hình giấu tự nhiên sau mép viền, chỉ để lộ đầu và một bàn tay trần vịn mép, sửa lỗi hai tay chen chúc cùng một ống tay áo và tư thế gượng gạo.
- Kéo sát mép để rảnh rỗi khoảng 6 giây sẽ kích hoạt ló đầu; chuột lại gần, nhấp chuột, nhấn giữ, kéo thả hoặc bắt đầu tác vụ sẽ trở lại bình thường.
- Thêm 12 mẩu truyện chữa lành nguyên tác cục bộ; rảnh rỗi khoảng 5 phút sẽ tự động xuất hiện, hoặc mở thủ công từ Cuốn sổ nhỏ.
- Thêm tính năng đổi bài, đóng, hover tạm dừng, focus bàn phím tạm dừng và chạm điện thoại giữ nguyên trạng thái đọc.
- Tác vụ và kết quả của cơ sở dữ liệu luôn ưu tiên hơn câu chuyện, nút dừng tiếp tục gọi quy trình tác vụ gốc.
- Thêm 2 công tắc độc lập; tài nguyên chuyên dụng bị lỗi sẽ tự quay về tư thế thông thường.
- Giữ nguyên trạng thái không tự đi lại từ bản v0.5.8, chuột phải bật/tắt và phương thức truy cập của SillyTavern 1.14.0–1.19.0.

### v0.5.10 · Sửa bố cục nút bấm Cuốn sổ nhỏ
- Nút "Tặng cô ấy một bông hoa" chuyển vào nhóm nút hành động thư giãn, đồng bộ font chữ, viền, nền và trạng thái vô hiệu hóa với các hành động khác.
- Thứ tự nút bấm đổi thành "Vươn vai → Chợp mắt → Tặng cô ấy một bông hoa", không còn chiếm riêng một hàng bên dưới.
- Dấu X ở góc trên bên phải sổ được tinh chỉnh chếch lên trên một chút, tạo khoảng cách rõ ràng với nút "Mở cơ sở dữ liệu chính", giảm thiểu bấm nhầm.
- Giữ nguyên tính năng chuột phải bật/tắt sổ và mở cơ sở dữ liệu chính từ v0.5.9.

### v0.5.9 · Chuột phải bật/tắt và Cổng vào cơ sở dữ liệu
- Máy tính nhấp chuột phải vào Tiểu Hội: Lần đầu mở Cuốn sổ nhỏ, nhấp chuột phải lần nữa sẽ đóng sổ ngay, không bắt buộc phải bấm dấu X.
- Xóa bỏ nút "Về vị trí mặc định" và "Đổi bên ngồi" trong sổ để giảm diện tích các thao tác ít dùng.
- Thêm nút "Mở cơ sở dữ liệu chính" ở đầu Cuốn sổ nhỏ, gọi trực tiếp cổng vào của tiện ích cơ sở dữ liệu.
- Tương thích với cổng vào bản mới `acu-v2-menu-item` và cổng vào bản cũ `shujuku_v120-menu-item`; nếu không tìm thấy tiện ích cơ sở dữ liệu sẽ nhắc bật nó lên trước.
- Tiếp tục duy trì hành vi từ v0.5.8: Tiểu Hội không tự ý di chuyển, chỉ di chuyển khi bạn kéo thả thủ công.

### v0.5.8 · Loại bỏ tính năng tự động di chuyển
- Gỡ bỏ việc gọi các frame chạy bộ trái/phải.
- Gỡ bỏ hoàn toàn logic tự động đi dạo và tự động đổi vị trí.
- Tiểu Hội sẽ không tự chạy nhảy hay đổi vị trí, chỉ di chuyển khi người dùng kéo thả thủ công.
- Giữ lại động tác chờ (idle), tương tác nhấp chuột, nhấn giữ, kéo thả, đồng bộ cơ sở dữ liệu và nút dừng tác vụ.
- Xóa bỏ tài nguyên chạy bộ khỏi gói cài đặt để giảm dung lượng và dọn sạch code cũ.

*(Các phiên bản v0.5.7 trở về trước có chứa tính năng tự di chuyển đã bị loại bỏ hoàn toàn từ v0.5.8 nên được lược bớt ở đây để đảm bảo tài liệu tập trung vào phiên bản hiện hành).*

---

## Nâng cấp dữ liệu lưu và Hạ cấp về bản cũ

- Bản v0.9.3 sử dụng `life.schema = 3`, bổ sung thêm `tickets`, `ticketsEarned`, `ticketsSpent` vào ví tiền cũ; hệ thống thay đồ dùng `skins.schema = 2`, bổ sung `spentTickets`. Dữ liệu lưu cũ tự động đọc được, phiếu hoa mới mặc định bằng 0, không làm mất vàng, hoạt động, chat, nuôi dưỡng hay quần áo đã sở hữu.
- Bản v1.0.0 giữ nguyên hội thoại cũ trong các trường `history` / `repair`, bổ sung `conversationSchema = 1`, `conversations`, `mainTitle` và `activeConversation`; các cuộc trò chuyện mới tạo được lưu độc lập. Trang phục mở khóa bằng mật ngữ của Zero lưu trong trường `skins.owned.zero` sẵn có, không lưu chuỗi mật ngữ người dùng nhập. Khi hạ cấp về bản cũ rồi bấm lưu, bản cũ có thể làm mất các cuộc trò chuyện mới và trường suy nghĩ; trước khi hạ cấp hãy xuất từng cuộc trò chuyện ra file JSON.
- Bản cũ không nhận diện trường phiếu hoa, **hạ cấp về bản cũ rồi lưu lại có thể làm mất số dư phiếu hoa mới, giá trị tích lũy và nhật ký đổi vé**. Trước khi hạ cấp hãy sao lưu toàn bộ dữ liệu tài khoản SillyTavern. Việc chỉ tắt tiện ích mở rộng hoặc đổi lại quần áo mặc định sẽ không làm mất số dư và trang phục.

---

## Cài đặt và Khôi phục

Trong Cài đặt tiện ích mở rộng của SillyTavern có thể tùy chỉnh:
- Desktop Pet hiện tại (Erii / Zero / Naidan / Claude) và lối vào Ngôi nhà pet;
- Công tắc hiển thị Desktop Pet;
- Kích thước Desktop Pet;
- Động tác lúc rảnh rỗi;
- Ló đầu ở mép màn hình;
- Tự động kể chuyện chữa lành (nghe truyện thủ công vẫn dùng bình thường);
- Ẩn/Hiện Naidan gốc và bong bóng gốc của cơ sở dữ liệu;
- Hiển thị nội dung tác vụ: Bản tóm tắt / Bản đầy đủ;
- Nói chuyện khi đang thực hiện tác vụ;
- Công tắc chỉ số nhu cầu (Độ no, Độ sạch);
- Hiệu ứng đặc biệt: Tự động / Lộng lẫy / Tối giản / Tắt;
- Công tắc Chế độ quan sát trò chuyện và tần suất bình luận (mỗi 1～20 tầng);
- Số tầng văn bản chính đính kèm khi kiểm tu (0～10 tầng);
- Mở chat và cấu hình kết nối, cách xưng hô, mối quan hệ trong khung chat;
- Đặt lại vị trí ban đầu của Desktop Pet.

Sau khi tắt hoặc gỡ bỏ tiện ích này, chỉ cần làm mới trang SillyTavern là Desktop Pet gốc của cơ sở dữ liệu sẽ hiển thị trở lại bình thường. Bản thân cơ sở dữ liệu không cần phải rollback, tuyệt đối không dùng các gói thử nghiệm cũ để ghi đè lên cổng vào của cơ sở dữ liệu.

---

## Phạm vi tương thích và Ranh giới xác thực

- Phiên bản SillyTavern mục tiêu: **1.14.0–1.19.0**.
- 1.14.0–1.16.0: Điểm khởi chạy tự động đợi giao diện cài đặt của SillyTavern sẵn sàng.
- 1.17.0–1.19.0: Sử dụng các lifecycle callback do SillyTavern cung cấp, có cơ chế bảo vệ đơn phiên bản (singleton).
- Chi tiết tương thích xem tại [`COMPATIBILITY.md`](COMPATIBILITY.md).

Việc kiểm tra file và kiểm tra trên trình duyệt cách ly chỉ chứng minh mã nguồn, manifest, tác vụ mô phỏng và bố cục đạt chuẩn dự kiến, không thể thay thế cho việc nghiệm thu trên môi trường SillyTavern thực tế của bạn. Những yếu tố sau vẫn cần bạn trực tiếp xác nhận trên máy:
- Sau khi cập nhật GitHub, SillyTavern có thực sự tải đúng bản `1.0.2` hay chưa;
- Phiên bản cơ sở dữ liệu của bạn có còn cung cấp cấu trúc giao diện tương thích hay không;
- Các tác vụ thúc đẩy cốt truyện, điền bảng, thành công, lỗi và dừng tác vụ trên thực tế;
- Khi dùng mô hình AI thật, phiếu sửa đổi do chế độ kiểm tu đưa ra có chuẩn xác không (trước khi ghi hãy đọc kỹ từng dòng rồi mới tích chọn);
- Cảm giác chạm vuốt và việc bật bàn phím ảo trên điện thoại vật lý.

---

## Các câu hỏi thường gặp (FAQ)

### Tại sao có quần áo mới mà không mặc được trực tiếp?
Dạ Lễ Phục Tím của Tiểu Hội bắt buộc phải mua, tích từ 0 phiếu hoa cần 258 vàng để đổi vé. Trang phục Hoàng nữ của Zero cần vào Cửa hàng chọn Zero rồi nhập mật ngữ để mở khóa, không tốn tiền. Cả hai sau khi nhận được đều phải bấm「Vào Tủ đồ để thay」rồi tự tay bấm mặc vào.

### Cập nhật xong không thấy quần áo, hoặc thay đồ bị thiếu hình ảnh?
Xác nhận SillyTavern đã tải đúng bản 1.0.1 trở lên, và kiểm tra xem kho lưu trữ GitHub đã tải lên đủ 27 ảnh WebP của mỗi bộ trang phục hay chưa. Việc chỉ cập nhật README, manifest hay code sẽ không tự sinh ra ảnh. Sau khi tải đủ ảnh lên kho, hãy cập nhật tiện ích trong SillyTavern rồi bấm `Ctrl + F5` để làm mới bộ nhớ đệm.

### Cập nhật xong tại sao Tiểu Hội vẫn tự ý chạy nhảy?
Trước tiên hãy kiểm tra phiên bản trong danh sách tiện ích của SillyTavern. Nếu không phải bản mới mà vẫn là bản cũ, nghĩa là SillyTavern vẫn đang chạy code cũ; hãy bấm cập nhật lại và làm mới trang. Bản `v0.5.7` trở về trước có chứa code tự di chuyển, từ `v0.5.8` trở đi đã loại bỏ hoàn toàn.

### GitHub báo phiên bản mới nhưng SillyTavern vẫn chạy hành vi cũ?
Tệp trên GitHub cập nhật không đồng nghĩa với việc SillyTavern đã nạp lại code mới. Hãy thực hiện tuần tự: Vào Quản lý tiện ích bấm Cập nhật → Làm mới trang (F5) → Bấm `Ctrl + F5`. Sau đó kiểm tra số phiên bản trong danh sách tiện ích của SillyTavern chứ đừng chỉ nhìn tiêu đề Cuốn sổ nhỏ; tiêu đề sổ từ bản v0.4.0 đã không còn hiện số phiên bản.

### Desktop Pet đã hiện nhưng báo chưa kết nối cơ sở dữ liệu?
Hãy kiểm tra xem tiện ích cơ sở dữ liệu gốc có đang bật không, và có bị thay thế bằng cổng thử nghiệm cục bộ nào không. Khuyến nghị giữ nguyên Naidan gốc và bong bóng tác vụ gốc chạy ngầm trong cơ sở dữ liệu, chỉ ẩn chúng đi trong cài đặt của tiện ích này. Khi cấu hình giao diện cơ sở dữ liệu bị đổi, pet sẽ ở trạng thái chờ hoặc báo không tương thích chứ không bao giờ làm giả trạng thái "Đã kết nối".

### Tại sao không đổi sang Naidan được?
Hình ảnh của Naidan được lấy trực tiếp từ cơ sở dữ liệu đang chạy. Hãy kiểm tra xem cơ sở dữ liệu đã bật chưa, và pet tích hợp sẵn của nó có bị tắt đi không; chừng nào chưa đọc được ảnh, Ngôi nhà pet sẽ nêu rõ nguyên nhân và nhân vật hiện tại vẫn sẽ tiếp tục ở bên bạn.

### Kiểm tu lỡ bấm sửa nhầm thì phải làm sao?
Ở dưới phiếu sửa đổi đó hãy bấm **Hoàn tác**, bảng biểu sẽ lập tức quay về nguyên trạng trước khi sửa. Dù trang web đã bị làm mới vẫn hoàn tác được (bản sao lưu nằm trong bộ nhớ trình duyệt); nếu trình duyệt chặn lưu trữ, hệ thống sẽ cảnh báo để bạn bấm **Tải bản sao lưu** về máy trước. Trước khi hoàn tác, nếu bảng biểu lại bị cơ sở dữ liệu sửa đổi thêm lần nữa, hệ thống sẽ hiện cảnh báo nhắc nhở bạn.

### Tại sao Chế độ quan sát trò chuyện mãi không lên tiếng?
Hãy kiểm tra xem trong cài đặt tiện ích đã bật **Chế độ quan sát trò chuyện** chưa, và số tầng tin nhắn mới xuất hiện sau khi bật đã đủ định mức tần suất bình luận chưa; hai lần bình luận cách nhau tối thiểu 60 giây, lúc cơ sở dữ liệu đang điền bảng pet sẽ tạm chờ. Trong cài đặt mục **Bạn đồng hành & Kiểm tu** sẽ hiển thị mốc thời gian của lần bình luận trước hoặc lý do chưa bình luận thành công.

### Trên điện thoại không có chuột phải, làm sao mở Cuốn sổ nhỏ?
Chạm nhanh để tương tác, nhấn giữ khoảng 0.5 giây để chợp mắt nghỉ ngơi, tiếp tục nhấn giữ đến khoảng 1.4 giây sẽ mở Cuốn sổ nhỏ; bạn cũng có thể mở từ Cài đặt tiện ích mở rộng của SillyTavern bằng cách bấm vào "Xem Cuốn sổ nhỏ tác vụ".

---

## Tài nguyên và Giấy phép bản quyền

Tạo hình của Erii tham khảo từ [Cardwright Erii Desktop Pet Assets](https://github.com/1798547983tt/Cardwright/tree/359019715afc60813384964b023a09c6dd6ed326/assets/pets/erii). Ảnh động tác do ImageGen tạo ra và được chỉnh sửa cục bộ, ảnh động tác gốc là định dạng WebP trong suốt không suy hao, ảnh minh họa sinh hoạt v0.7.0 là ảnh WebP nén chất lượng cao giữ nguyên kênh trong suốt. Tài nguyên đồ họa là sản phẩm đồng nhân (fan-made) phi chính thức từ tác phẩm *《Long Tộc》*, sử dụng theo điều kiện phi thương mại và ghi công tác giả nêu trong [`assets/NOTICE.md`](assets/NOTICE.md); mã nguồn chương trình phát hành theo giấy phép MIT, giấy phép MIT không bao gồm tài nguyên đồ họa. Trang phục Dạ Lễ Phục Tím tham khảo từ ảnh trang phục Erii Tsukuyomi trong *《Long Tộc》* do người dùng cung cấp, được tạo bởi ImageGen; chi tiết và phạm vi sử dụng xem tại [`Thuyết minh tài nguyên trang phục`](assets/skins/erii-purple-night/NOTICE.md).

Ảnh động tác của Zero do ImageGen tạo từ 2 bảng tư thế, phóng to bằng Real-ESRGAN (Anime model) rồi cắt bằng `tools/slice-pose-sheet.py`, ghi công và giấy phép xem tại [`assets/zero/NOTICE.md`](assets/zero/NOTICE.md). Ảnh động tác của Tiểu Khắc tạo dựa trên hình vẽ gốc và 3 bảng tư thế, phóng to rồi cắt nhỏ, ghi công và giấy phép xem tại [`assets/claude/NOTICE.md`](assets/claude/NOTICE.md); Claude là tên sản phẩm của Anthropic, dự án này là sản phẩm đồng nhân phi chính thức, không liên quan đến Anthropic. Hình ảnh của Naidan thuộc bản quyền của tiện ích cơ sở dữ liệu, tiện ích mở rộng này chỉ đọc ảnh đã tải trong thời gian chạy (runtime), không sao chép hay phân phối.

Tham khảo cơ sở dữ liệu: [AlbusKen/shujuku](https://github.com/AlbusKen/shujuku).