// 選擇場地
import { STAGES } from '../stages.js';
import { txt, pixelText, blink, Hotspots } from '../ui.js';
import { menuBg } from './common.js';
import { pick } from '../util.js';

export class StageSelectScene {
  constructor(g) {
    this.g = g;
    this.t = 0;
    this.sel = 0;
    this.hot = new Hotspots();
  }
  get opts() {
    return [...STAGES.map((s) => ({ id: s.id, name: s.name, s })), { id: 'random', name: '隨機' }];
  }
  confirm() {
    const g = this.g;
    const o = this.opts[this.sel];
    g.flow.stage = o.id === 'random' ? pick(STAGES).id : o.id;
    g.audio.sfx('confirm');
    g.goVS({ ...g.flow });
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if (c.back) {
      this.g.audio.sfx('back');
      return this.g.goCharSelect();
    }
    const n = this.opts.length;
    if (c.pressed('left') || c.pressed('up')) {
      this.sel = (this.sel - 1 + n) % n;
      this.g.audio.sfx('move');
    }
    if (c.pressed('right') || c.pressed('down')) {
      this.sel = (this.sel + 1) % n;
      this.g.audio.sfx('move');
    }
    if (c.confirm) this.confirm();
  }
  onPointer(x, y) {
    this.hot.hit(x, y);
  }
  draw() {
    const g = this.g;
    const cur = this.opts[this.sel];
    const p = g.beginPix();
    menuBg(p, this.t, cur.s ? cur.id : 'studio', cur.s ? 0.15 : 0.6);
    g.flushPix();
    const ctx = g.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, 960, 80);
    ctx.fillRect(0, 330, 960, 210);
    pixelText(ctx, '選擇場地', 480, 42, { size: 44, scale: 3, color: '#8CFF5B', color2: '#2fbf2f', outline: '#062006' });
    this.hot.clear();
    this.opts.forEach((o, i) => {
      const x = 36 + i * 228, y = 360, w = 204, h = 115;
      const sel = i === this.sel;
      if (o.s) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(o.s.thumb(), x, y, w, h);
        ctx.restore();
      } else {
        ctx.fillStyle = '#222';
        ctx.fillRect(x, y, w, h);
        pixelText(ctx, '?', x + w / 2, y + h / 2, { size: 60, scale: 4, font: 'px', color: '#ffd84a', outline: '#000' });
      }
      ctx.strokeStyle = sel ? (blink(this.t, 3) ? '#ffd84a' : '#fff') : '#555';
      ctx.lineWidth = sel ? 5 : 2;
      ctx.strokeRect(x, y, w, h);
      txt(ctx, o.name, x + w / 2, y + h + 20, { size: 17, weight: 900, color: sel ? '#ffd84a' : '#ccc', align: 'center' });
      this.hot.add(x, y, w, h + 30, () => (this.sel === i ? this.confirm() : ((this.sel = i), this.g.audio.sfx('move'))));
    });
    txt(ctx, '← → 選擇　Enter 開打！　Esc 返回', 480, 525, { size: 14, color: '#bbb', align: 'center' });
  }
}
