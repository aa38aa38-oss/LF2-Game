// 選擇模式與難度
import { CHARS } from '../characters.js';
import { drawChar } from '../sprites.js';
import { txt, pixelText, panel, Hotspots } from '../ui.js';
import { menuBg, poseOf } from './common.js';

const MODES = [
  { id: 'story', name: '劇情模式', desc: ['立委 → 市長 → 總統，三關打到底！', '打倒對手拉選票。'], chars: [2] },
  { id: '1v1', name: '單挑模式', desc: ['自己挑對手，', '一對一打到剩一個！'], chars: [0, 2] },
  { id: 'brawl', name: '四人大亂鬥', desc: ['四位政治人物同場混戰，', '誰都可以打！'], chars: [1, 3, 4, 5] },
];
const DIFFS = [['easy', '簡單'], ['normal', '普通'], ['hard', '困難']];

export class ModeScene {
  constructor(g) {
    this.g = g;
    this.t = 0;
    this.sel = Math.max(0, MODES.findIndex((m) => m.id === g.flow.mode));
    this.diff = Math.max(0, DIFFS.findIndex((d) => d[0] === g.flow.difficulty));
    this.hot = new Hotspots();
  }
  enter() {
    this.g.audio.playBgm('menu');
  }
  choose() {
    this.g.flow.mode = MODES[this.sel].id;
    this.g.flow.difficulty = DIFFS[this.diff][0];
    this.g.audio.sfx('confirm');
    this.g.goCharSelect();
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if (c.back) {
      this.g.audio.sfx('back');
      return this.g.goTitle();
    }
    if (c.pressed('left')) this.move(-1);
    if (c.pressed('right')) this.move(1);
    if (c.pressed('up')) this.setDiff(this.diff + 1);
    if (c.pressed('down')) this.setDiff(this.diff - 1);
    if (c.confirm) this.choose();
  }
  move(d) {
    this.sel = (this.sel + d + MODES.length) % MODES.length;
    this.g.audio.sfx('move');
  }
  setDiff(d) {
    this.diff = Math.max(0, Math.min(2, d));
    this.g.audio.sfx('move');
  }
  onPointer(x, y) {
    this.hot.hit(x, y);
  }
  draw() {
    const g = this.g;
    const p = g.beginPix();
    menuBg(p, this.t, 'legislature', 0.6);
    MODES.forEach((m, i) => {
      const cx = 180 + i * 300;
      m.chars.forEach((ci, k) => {
        const ch = CHARS[ci];
        const n = m.chars.length;
        const x = cx + (k - (n - 1) / 2) * (n > 2 ? 52 : 80);
        drawChar(p, ch, poseOf(ch, i === this.sel ? 'walk' : 'idle', this.t + k), x, 330, k < n / 2 ? 1 : -1, n > 2 ? 1.25 : 1.6, i === this.sel ? 1 : 0.6, false, this.t);
      });
    });
    g.flushPix();
    const ctx = g.ctx;
    pixelText(ctx, '選擇模式', 480, 46, { size: 48, scale: 3, color: '#8CFF5B', color2: '#2fbf2f', outline: '#062006' });
    this.hot.clear();
    MODES.forEach((m, i) => {
      const x = 40 + i * 300, y = 90, w = 280, h = 340;
      const sel = i === this.sel;
      ctx.strokeStyle = sel ? '#ffd84a' : '#555';
      ctx.lineWidth = sel ? 5 : 2;
      ctx.strokeRect(x, y, w, h);
      if (sel) {
        ctx.fillStyle = 'rgba(255,216,74,0.08)';
        ctx.fillRect(x, y, w, h);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(x + 3, y + 250, w - 6, 87);
      txt(ctx, m.name, x + w / 2, y + 30, { size: 30, weight: 900, color: sel ? '#ffd84a' : '#ddd', align: 'center', stroke: '#000', sw: 6 });
      m.desc.forEach((d, k) => txt(ctx, d, x + w / 2, y + 280 + k * 26, { size: 17, weight: 700, color: '#fff', align: 'center' }));
      this.hot.add(x, y, w, h, () => (this.sel === i ? this.choose() : ((this.sel = i), this.g.audio.sfx('move'))));
    });
    // 難度
    panel(ctx, 300, 448, 360, 50);
    txt(ctx, '難度', 340, 473, { size: 18, weight: 900, color: '#aaa' });
    DIFFS.forEach(([id, name], i) => {
      const x = 430 + i * 80;
      const sel = i === this.diff;
      txt(ctx, name, x, 473, { size: 20, weight: 900, color: sel ? ['#5cff7a', '#ffd84a', '#ff5a5a'][i] : '#666', align: 'center' });
      if (sel) {
        ctx.fillStyle = '#ffd84a';
        ctx.fillRect(x - 22, 488, 44, 3);
      }
      this.hot.add(x - 36, 452, 72, 42, () => this.setDiff(i));
    });
    txt(ctx, '← → 選模式　↑ ↓ 調難度　Enter 確定　Esc 返回', 480, 522, { size: 14, color: '#bbb', align: 'center' });
  }
}
