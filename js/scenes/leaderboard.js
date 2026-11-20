// 排行榜畫面
import { txt, pixelText, panel, blink } from '../ui.js';
import { menuBg } from './common.js';
import { Leaderboard } from '../leaderboard.js';

export class LeaderboardScene {
  constructor(g, highlight) {
    this.g = g;
    this.hl = highlight || null;
    this.t = 0;
    this.rows = null;
  }
  async enter() {
    this.g.audio.playBgm('menu');
    this.rows = await Leaderboard.top(10);
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if (this.t > 0.3 && (c.confirm || c.back || c.pressed('rank'))) {
      this.g.audio.sfx('back');
      this.g.goTitle();
    }
  }
  onPointer() {
    this.g.goTitle();
  }
  draw() {
    const g = this.g;
    const p = g.beginPix();
    menuBg(p, this.t, 'rally', 0.65);
    g.flushPix();
    const ctx = g.ctx;
    pixelText(ctx, '🏆 排行榜', 480, 46, { size: 44, scale: 3, color: '#ffe14a', color2: '#ff9a1a', outline: '#100400' });
    txt(ctx, Leaderboard.isOnline ? '全球排行榜' : '本機排行榜（只存在這台裝置的瀏覽器）', 480, 88, { size: 14, color: '#aaa', align: 'center' });
    panel(ctx, 90, 104, 780, 384);
    const cols = [[130, '名次', 'left'], [210, '名字', 'left'], [400, '角色', 'left'], [550, '模式', 'left'], [830, '分數', 'right']];
    cols.forEach(([x, n, a]) => txt(ctx, n, x, 130, { size: 15, weight: 900, color: '#ffd84a', align: a }));
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(110, 146, 740, 2);
    if (!this.rows) {
      txt(ctx, '讀取中…', 480, 300, { size: 20, color: '#fff', align: 'center' });
    } else if (!this.rows.length) {
      txt(ctx, '還沒有紀錄，快去玩「連戰生存」拿第一！', 480, 300, { size: 20, weight: 900, color: '#fff', align: 'center' });
    } else {
      this.rows.forEach((r, i) => {
        const y = 170 + i * 31;
        const me = this.hl && r.name === this.hl.name && r.score === this.hl.score && r.date === this.hl.date;
        if (me && blink(this.t, 2)) {
          ctx.fillStyle = 'rgba(92,255,122,0.18)';
          ctx.fillRect(110, y - 14, 740, 28);
        }
        const col = i === 0 ? '#ffd84a' : i === 1 ? '#e0e0e0' : i === 2 ? '#e0a060' : '#fff';
        txt(ctx, String(i + 1).padStart(2, '0'), 130, y, { size: 14, font: 'px', color: col });
        txt(ctx, r.name, 210, y, { size: 17, weight: 900, color: col });
        txt(ctx, r.char, 400, y, { size: 15, color: '#ddd' });
        txt(ctx, r.mode, 550, y, { size: 15, color: '#ddd' });
        txt(ctx, String(r.score).padStart(8, '0'), 830, y, { size: 14, font: 'px', color: col, align: 'right' });
      });
    }
    txt(ctx, 'Enter / Esc 返回', 480, 515, { size: 14, color: '#bbb', align: 'center' });
  }
}
