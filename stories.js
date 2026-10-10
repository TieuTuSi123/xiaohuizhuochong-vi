// Các câu chuyện nhỏ nguyên bản; hoàn toàn cục bộ, không gọi API hay ghi vào cơ sở dữ liệu.
export const IDLE_STORY_MS = 5 * 60 * 1000;
export const STORY_READ_MS = 30000;
export const stories = [
  { title: 'Dành cho người về muộn', text: 'Tiệm bánh mì ở góc phố sắp đóng cửa, nhưng ông chủ vẫn để lại ngọn đèn cuối cùng. Một người ướt sũng bước vào, nói rằng hôm nay chẳng làm tốt được việc gì. Ông chủ đưa cho anh một chiếc bánh mì ấm nóng: "Cậu đã mang bản thân mình về bình an rồi." Người đó ôm chiếc túi giấy, chậm rãi đi hết quãng đường còn lại.' },
  { title: 'Chiếc thuyền nhỏ', text: 'Một chiếc thuyền giấy bị kẹt bên vũng nước, cô bé ngồi xổm xuống, nhẹ nhàng gạt những chiếc lá rụng xung quanh ra. Chiếc thuyền giấy chỉ trôi được một đoạn rất ngắn, nhưng cô bé đã nhìn nó rất lâu. Lúc về nhà, mũi giày hơi ướt một chút, nhưng trong túi lại có thêm một chiếc lá rất đẹp. Hôm nay cũng có một thứ đáng để mang về.' },
  { title: 'Giữ lại một chiếc ghế', text: 'Quầy trà của Gấu nhỏ ngày nào cũng bày hai chiếc ghế, có khi cả ngày chẳng có người khách nào. Chập tối, Cáo nhỏ chạy đến mồ hôi nhễ nhại, ngồi xuống chiếc ghế trống. Gấu nhỏ rót một tách trà, chẳng ai vội vàng lên tiếng. Hóa ra, một chiếc ghế trống cũng có thể là đang đợi một người đến nghỉ ngơi.' },
  { title: 'Hạt giống bên bậu cửa sổ', text: 'Hạt giống vùi vào chậu hoa, mấy ngày liền chẳng có động tĩnh gì. Thỏ nhỏ mỗi ngày đều tưới cho nó một chút nước, tiện tay lau sạch bậu cửa sổ. Một buổi sáng nọ, hai chiếc lá nhỏ cuối cùng cũng đâm chồi lên khỏi mặt đất. Chúng rất nhỏ, nhưng Thỏ nhỏ đã xoay chậu hoa sang hướng khác, để cả hai cùng được tắm nắng.' },
  { title: 'Sau khi mưa tạnh', text: 'Mưa rơi rả rích suốt cả một buổi chiều, Mèo nhỏ vẫn luôn ngồi dưới hiên nhà. Khi mưa tạnh, nó không rời đi ngay, mà nhìn ngắm bầu trời in trong vũng nước một lúc. Đám mây chầm chậm trôi qua trên mặt nước. Mèo nhỏ vươn vai một cái, đi vòng qua vũng nước, quay về nhà ăn tối. Chờ đợi một chút, cũng sẽ không bỏ lỡ tất cả mọi thứ.' },
  { title: 'Chiếc khăn quàng không ngay ngắn', text: 'Lần đầu tiên bà nội đan khăn quàng, mép khăn hơi lệch, còn bị sót một mũi. Nai nhỏ quàng lên, quấn đoạn thừa ra quanh cổ, vừa vặn che được gió. Nó chạy đến bên cửa sổ cho bà xem. Bà cười và cầm kim lên: "Lần sau bà sẽ đan tốt hơn." Chiếc khăn này cũng đã rất ấm rồi.' },
  { title: 'Bức thư gửi mặt trăng', text: 'Cô bé viết những muộn phiền của ngày hôm nay lên giấy viết thư, gập lại rồi đặt bên cửa sổ. Nửa đêm trời nổi gió, cô bé tìm một viên sỏi tròn chặn lên đó. Hôm sau, bức thư vẫn còn đó, trời đã sáng rồi. Cô bé luộc cho mình một quả trứng, quyết định ăn xong bữa sáng rồi mới đi giải quyết những rắc rối trong bức thư.' },
  { title: 'Một ngụm súp nóng', text: 'Cún con muốn làm một bữa tối thật thịnh soạn, nhưng cuối cùng chỉ nấu được một nồi súp. Bạn bè đến nơi, ngồi sát cạnh nhau, mỗi người bưng một chiếc bát. Người thì thêm muối, người thì bẻ bánh mì. Súp rất nhanh đã uống cạn, nhưng trong phòng lúc nào cũng rộn rã tiếng cười. Cún con lại châm thêm nước vào nồi.' },
  { title: 'Chú ốc sên chậm chạp', text: 'Ốc sên vội vã đi ngắm hoa, dọc đường gặp một giọt sương rất tròn, lại gặp một chiếc lá ngát hương thơm. Khi nó đến nơi, khu vườn đã trở nên tĩnh lặng. Bông hoa nhỏ màu trắng nằm sâu tít bên trong vẫn đang nở. Ốc sên dừng lại bên cạnh, mang theo tâm trạng vui vẻ thu thập được dọc đường, cùng bông hoa ngắm nhìn hoàng hôn một lúc.' },
  { title: 'Kẹo trong túi áo', text: 'Cáo nhỏ mua hai viên kẹo, định tặng một viên cho người khác, một viên giữ lại cho mình. Dọc đường không gặp ai quen, nó liền mang cả hai viên về nhà. Hôm sau, Gấu nhỏ đến mượn ô, Cáo nhỏ sực nhớ ra viên kẹo trong túi áo. Hóa ra, sự dịu dàng chưa trao đi, có thể đợi thêm một thời điểm thích hợp khác.' },
  { title: 'Chiếc bát nhỏ được sửa lại', text: 'Thỏ nhỏ không nỡ vứt đi chiếc bát nhỏ bị mẻ góc, lại sợ dùng nó đựng súp sẽ bị bỏng tay. Nó rửa sạch bát, đổ đất vào, trồng một nhánh bạc hà. Bên bậu cửa sổ dần dần có thêm một chút sắc xanh. Sau này mỗi lần pha trà, Thỏ nhỏ đều hái một chiếc lá, thả vào một chiếc cốc lành lặn khác.' },
  { title: 'Cùng nhau đếm sao', text: 'Gấu nhỏ đếm sao, đếm đến ngôi thứ mười bảy thì quên mất những ngôi phía trước. Cáo nhỏ cũng đếm sai. Chúng dứt khoát nằm ườn ra bãi cỏ, chỉ cho đối phương xem ngôi sao sáng nhất. Gió đêm thổi hơi se lạnh, Gấu nhỏ kéo tấm chăn về phía bạn mình một chút. Những ngôi sao đêm nay, chẳng cần đếm rõ cũng đã rất đẹp rồi.' },
];

export class StoryCarousel {
  constructor(now = () => Date.now(), random = Math.random) {
    this.now = now; this.random = random;
    this.current = null; this.last = -1; this.bag = [];
    this.pauses = new Set(); this.remaining = STORY_READ_MS;
    this.due = this.now() + IDLE_STORY_MS;
  }
  show(origin = 'manual') {
    if (!this.bag.length) {
      this.bag = stories.map((_, i) => i);
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
      if (this.bag[this.bag.length - 1] === this.last) this.bag.reverse();
    }
    this.last = this.bag.pop();
    this.current = { ...stories[this.last], origin, id: this.last };
    this.remaining = STORY_READ_MS; this.until = this.now() + STORY_READ_MS;
    this.due = this.now() + IDLE_STORY_MS;
    return this.current;
  }
  dismiss() {
    this.current = null; this.pauses.clear();
    this.due = this.now() + IDLE_STORY_MS;
  }
  pause(reason) {
    if (!this.current || this.pauses.has(reason)) return;
    if (!this.pauses.size) this.remaining = Math.max(0, this.until - this.now());
    this.pauses.add(reason);
  }
  resume(reason) {
    if (!this.pauses.delete(reason) || this.pauses.size || !this.current) return;
    this.until = this.now() + Math.max(5000, this.remaining);
  }
  tick({ blocked, automatic = true }) {
    if (blocked) { this.dismiss(); return; }
    if (!automatic && this.current?.origin === 'automatic') this.dismiss();
    if (this.current && !this.pauses.size && this.now() >= this.until) this.show(this.current.origin);
    if (!this.current && automatic && this.now() >= this.due) this.show('automatic');
  }
}
