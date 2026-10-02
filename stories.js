// Original miniature stories; entirely local, with no API calls or database writes.
export const IDLE_STORY_MS = 5 * 60 * 1000;
export const STORY_READ_MS = 30000;
export const stories = [
  { title: '给晚归的人', text: '街角的面包店快关门了，老板却留下最后一盏灯。一个淋雨的人走进来，说今天什么也没做好。老板递给他一只温热的面包：“你把自己平安带回来了。”那个人捧着纸袋，慢慢走完了剩下的路。' },
  { title: '小小的船', text: '一只纸船卡在水洼边，小女孩蹲下来，把旁边的落叶轻轻拨开。纸船只漂了很短的一段，她却看了很久。回家时，鞋尖湿了一点，口袋里多了一片很好看的叶子。今天也有值得带回去的东西。' },
  { title: '留一把椅子', text: '小熊的茶摊每天都摆两把椅子，有时整天也没有客人。傍晚，小狐狸跑得满头是汗，在空椅子上坐下。小熊倒了一杯茶，谁也没急着说话。原来，一把空椅子也可以是在等一个人休息。' },
  { title: '窗台的种子', text: '种子埋进花盆后，好几天都没有动静。小兔每天给它浇一点水，顺手擦干净窗台。某个早晨，两片小叶子终于顶开泥土。它们很小，小兔却把花盆转了个方向，让它们一起晒到太阳。' },
  { title: '雨停以后', text: '雨下了整整一下午，小猫一直坐在屋檐下。雨停时，它没有立刻走，先看了看水洼里的天空。云从水面慢慢游过去。小猫伸了个懒腰，绕开水洼，回家吃晚饭。等一等，也不会错过所有东西。' },
  { title: '不整齐的围巾', text: '奶奶第一次织围巾，边缘有些歪，还漏了一针。小鹿戴上后，把长出来的一截绕在脖子上，刚好挡住风。它跑到窗前给奶奶看。奶奶笑着拿起针：“下次我再织好一点。”这条也已经很暖了。' },
  { title: '给月亮的信', text: '小女孩在信纸上写下今天的烦恼，折好放在窗边。夜里起了风，她找了颗圆圆的石子压住它。第二天，信还在，天已经亮了。她给自己煮了一个鸡蛋，决定先把早餐吃完，再去处理信里的事。' },
  { title: '一口热汤', text: '小狗想做一桌丰盛的晚饭，最后只煮好了一锅汤。朋友们到了，挨着坐下，一人捧着一只碗。有人添了盐，有人掰开面包。汤很快喝光了，屋子里却一直热热闹闹。小狗又往锅里加了水。' },
  { title: '慢一点的蜗牛', text: '蜗牛赶去看花，路上遇到一颗很圆的露珠，又遇到一片有香味的叶子。它到达时，花园已经安静下来。最里面的一朵小白花还开着。蜗牛停在旁边，带着一路收集来的好心情，陪它看了一会儿夕阳。' },
  { title: '口袋里的糖', text: '小狐狸买了两颗糖，打算一颗送人，一颗留给自己。路上没有碰见熟人，它就把两颗都带回了家。第二天，小熊来借伞，小狐狸想起口袋里的糖。原来，没送出去的温柔，可以再等一个合适的时候。' },
  { title: '修好的小碗', text: '小兔舍不得扔掉磕缺角的小碗，又怕用它盛汤会烫手。它把碗洗干净，放上泥土，种了一株薄荷。窗边渐渐多了一点绿色。后来每次泡茶，小兔都会摘一片叶子，放进另一只完好的杯子里。' },
  { title: '一起数星星', text: '小熊数星星，数到十七颗就忘了前面的。小狐狸也数错了。它们干脆躺在草地上，指给对方看最亮的那一颗。夜风吹得有点凉，小熊把毯子往朋友那边拉了拉。今晚的星星，不数清楚也很好看。' },
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
    if (this.current && !this.pauses.size && this.now() >= this.until) this.dismiss();
    if (!this.current && automatic && this.now() >= this.due) this.show('automatic');
  }
}
