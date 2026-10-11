// Những mẩu chuyện ngắn nguyên tác; hoàn toàn xử lý cục bộ, không gọi API hay ghi vào cơ sở dữ liệu.
export const IDLE_STORY_MS = 5 * 60 * 1000;
export const STORY_READ_MS = 30000;
export const stories = [
  { title: 'Dành cho người về muộn', text: 'Tiệm bánh mì ở góc phố sắp đóng cửa, nhưng ông chủ vẫn để lại ngọn đèn cuối cùng. Một người ướt đẫm nước mưa bước vào, nói rằng hôm nay chẳng làm được việc gì ra hồn. Ông chủ đưa cho anh một chiếc bánh mì ấm nóng: "Cậu đã đưa được bản thân bình an trở về rồi." Người đó ôm túi giấy, chậm rãi bước hết đoạn đường còn lại.' },
  { title: 'Con thuyền bé nhỏ', text: 'Một chiếc thuyền giấy mắc kẹt bên mép vũng nước, cô bé ngồi xổm xuống, nhẹ nhàng gạt những chiếc lá rụng bên cạnh ra. Thuyền giấy chỉ trôi được một đoạn rất ngắn, nhưng cô bé đã ngắm nhìn thật lâu. Khi về nhà, mũi giày bị ướt một chút, trong túi áo có thêm một chiếc lá rất đẹp. Hôm nay cũng có điều đáng để mang về.' },
  { title: 'Để lại một chiếc ghế', text: 'Quầy trà của gấu nhỏ ngày nào cũng đặt hai chiếc ghế, đôi khi cả ngày chẳng có lấy một vị khách. Chiều muộn, cáo nhỏ chạy mồ hôi nhễ nhại, ngồi xuống chiếc ghế trống. Gấu nhỏ rót một chén trà, chẳng ai vội vã lên tiếng. Hóa ra, một chiếc ghế trống cũng có thể là đang đợi một ai đó dừng chân nghỉ ngơi.' },
  { title: 'Hạt mầm bên bậu cửa sổ', text: 'Hạt giống sau khi gieo vào chậu hoa, mấy ngày liền đều không có động tĩnh gì. Thỏ con mỗi ngày đều tưới cho nó một chút nước, tiện tay lau sạch bậu cửa sổ. Vào một buổi sáng nọ, hai chiếc lá non cuối cùng cũng đội đất nhô lên. Chúng rất nhỏ bé, nhưng thỏ con vẫn xoay chậu hoa sang hướng khác, để cả hai cùng được đón ánh mặt trời.' },
  { title: 'Sau khi mưa tạnh', text: 'Mưa rơi suốt cả buổi chiều, mèo con cứ ngồi mãi dưới hiên nhà. Lúc mưa tạnh, nó không rời đi ngay mà ngắm nhìn bầu trời in bóng trong vũng nước trước. Mây chầm chậm trôi qua mặt nước. Mèo con vươn vai một cái, đi vòng qua vũng nước rồi về nhà ăn bữa tối. Chờ đợi một chút, cũng sẽ chẳng bỏ lỡ hết thảy mọi điều.' },
  { title: 'Chiếc khăn choàng không đều mũi', text: 'Lần đầu tiên bà đan khăn choàng, mép khăn hơi lệch, lại còn sót mất một mũi. Hươu con quàng vào, đem phần thừa quấn quanh cổ, vừa vặn chắn gió. Nó chạy tới bên cửa sổ khoe với bà. Bà cười rồi cầm que đan lên: "Lần tới bà sẽ đan khéo hơn." Chiếc khăn này vốn đã rất ấm áp rồi.' },
  { title: 'Lá thư gửi mặt trăng', text: 'Cô bé viết những phiền muộn hôm nay lên giấy thư, gấp lại rồi đặt bên khung cửa sổ. Đêm xuống nổi gió, cô bé tìm một viên sỏi tròn chặn lên trên. Ngày hôm sau, lá thư vẫn còn đó, trời đã sáng rõ. Cô bé luộc cho mình một quả trứng gà, quyết định ăn xong bữa sáng rồi mới đi xử lý những chuyện viết trong thư.' },
  { title: 'Một ngụm canh nóng', text: 'Chó con muốn nấu một bàn ăn thịnh soạn, nhưng cuối cùng chỉ nấu xong một nồi canh. Bạn bè đến nơi, ngồi sát bên nhau, mỗi người bưng một chiếc bát. Người nêm thêm muối, người bẻ bánh mì. Nồi canh nhanh chóng cạn đáy, nhưng gian nhà lúc nào cũng rộn ràng ấm cúng. Chó con lại thêm nước vào nồi.' },
  { title: 'Chú ốc sên chậm rãi', text: 'Ốc sên vội vã đi ngắm hoa, trên đường gặp một giọt sương rất tròn, lại gặp một chiếc lá ngát hương. Khi nó tới nơi, khu vườn đã trở nên yên ắng. Bông hoa trắng nhỏ nằm ở góc trong cùng vẫn còn hé nở. Ốc sên dừng lại bên cạnh, mang theo tâm trạng vui vẻ thu nhặt suốt dọc đường, cùng hoa ngắm hoàng hôn một lát.' },
  { title: 'Viên kẹo trong túi áo', text: 'Cáo nhỏ mua hai viên kẹo, định bụng một viên đem tặng, một viên giữ lại cho mình. Trên đường không gặp người quen nào, nó mang cả hai viên về nhà. Hôm sau, gấu nhỏ tới mượn ô, cáo nhỏ sực nhớ tới viên kẹo trong túi áo. Hóa ra, sự dịu dàng chưa kịp trao đi, vẫn có thể chờ một dịp thích hợp hơn.' },
  { title: 'Chiếc bát nhỏ được sửa lại', text: 'Thỏ con không nỡ vứt chiếc bát nhỏ bị mẻ góc, nhưng lại sợ dùng nó múc canh sẽ bỏng tay. Nó rửa sạch bát, cho đất vào rồi trồng một nhánh bạc hà. Bên khung cửa sổ dần có thêm chút sắc xanh. Về sau mỗi lần pha trà, thỏ con đều hái một chiếc lá, thả vào chiếc tách lành lặn còn lại.' },
  { title: 'Cùng nhau đếm sao', text: 'Gấu nhỏ đếm sao, đếm tới ngôi thứ mười bảy thì quên mất những ngôi phía trước. Cáo nhỏ cũng đếm nhầm. Cả hai dứt khoát nằm xuống bãi cỏ, chỉ cho nhau xem ngôi sao sáng nhất. Gió đêm thổi qua hơi se lạnh, gấu nhỏ kéo tấm chăn về phía bạn một chút. Bầu trời sao đêm nay, chẳng cần đếm rõ ràng cũng đã rất đẹp.' },
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