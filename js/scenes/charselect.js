// 選角（單挑模式會再選一次對手）
import { specialDef, specialCD } from '../moves.js';
const KINDS = ['fwd', 'up', 'down'];
import { CHARS } from '../characters.js';
import { drawChar, drawPortrait, drawArt } from '../sprites.js';
import { txt, pixelText, panel, segBar, blink, Hotspots } from '../ui.js';
import { menuBg, poseOf } from './common.js';
import { shuffle } from '../util.js';

export class CharSelectScene {
  constructor(g) {
    this.g = g;
    this.t = 0;
    this.step = 0; // 0 = 選自己, 1 = 選對手
    this.sel = Math.max(0, CHARS.findIndex((c) => c.id === g.flow.playerChar));
    this.picked = null;
    this.hot = new Hotspots();
    this.flashT = 0;
  }
  enter() {
    this.g.audio.playBgm('menu');
  }
  confirm() {
    const g = this.g;
    const ch = CHARS[this.sel];
    if (this.step === 1 && ch.id === this.picked) {
      g.audio.sfx('back');
      return;
    }
    g.audio.sfx('confirm');
    this.flashT = 0.3;
    if (this.step === 0) {
      this.picked = ch.id;
      g.flow.playerChar = ch.id;
      if (g.flow.mode === 'story') {
        return g.startStory({ playerChar: ch.id, difficulty: g.flow.difficulty });
      }
      if (g.flow.mode === 'shaft') {
        return g.startShaft({ playerChar: ch.id, difficulty: g.flow.difficulty, mode: 'shaft', standalone: true });
      }
      if (g.flow.mode === '1v1') {
        this.step = 1;
        this.sel = (this.sel + 1) % CHARS.length;
        return;
      }
      const others = shuffle(CHARS.map((c) => c.id).filter((id) => id !== ch.id));
      g.flow.cpuChars = others.slice(0, 3);
    } else {
      g.flow.cpuChars = [ch.id];
    }
    g.goStageSelect();
  }
  update(dt) {
    this.t += dt;
    if (this.flashT > 0) this.flashT -= dt;
    const c = this.g.input.p1;
    if (c.back) {
      this.g.audio.sfx('back');
      if (this.step === 1) {
        this.step = 0;
        this.sel = CHARS.findIndex((x) => x.id === this.picked);
        return;
      }
      return this.g.goMode();
    }
    if (c.pressed('left')) this.move(-1);
    if (c.pressed('right')) this.move(1);
    if (c.confirm) this.confirm();
  }
  move(d) {
    this.sel = (this.sel + d + CHARS.length) % CHARS.length;
    this.g.audio.sfx('move');
  }
  onPointer(x, y) {
    this.hot.hit(x, y);
  }
  draw() {
    const g = this.g, t = this.t;
    const ch = CHARS[this.sel];
    const p = g.beginPix();
    menuBg(p, t, 'studio', 0.55);
    // 大立繪
    const gr = p.createRadialGradient(205, 440, 10, 205, 440, 200);
    gr.addColorStop(0, ch.color);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    p.globalAlpha = 0.5;
    p.fillStyle = gr;
    p.fillRect(0, 240, 420, 300);
    p.globalAlpha = 1;
    p.fillStyle = 'rgba(0,0,0,0.5)';
    p.beginPath();
    p.ellipse(205, 505, 90, 16, 0, 0, Math.PI * 2);
    p.fill();
    const st = this.flashT > 0 ? 'victory' : 'idle';
    if (!drawArt(p, ch, 205, 515, 300, 1)) drawChar(p, ch, poseOf(ch, st, t), 205, 505, 1, 3.0, 1, this.flashT > 0.2, t);
    if (this.step === 1 && this.picked) {
      const me = CHARS.find((c) => c.id === this.picked);
      drawChar(p, me, poseOf(me, 'idle', t), 60, 520, 1, 1.4, 0.8, false, t);
    }
    g.flushPix();
    const ctx = g.ctx;
    pixelText(ctx, this.step === 0 ? '選擇你的角色' : '選擇你的對手', 480, 36, { size: 40, scale: 3, color: this.step === 0 ? '#8CFF5B' : '#ff7a5a', color2: this.step === 0 ? '#2fbf2f' : '#c0301a', outline: '#060606' });
    // 角色卡
    this.hot.clear();
    // 角色卡：人數多時自動縮小，一排排完（6 人時跟原本一樣大）
    const N = CHARS.length, step = Math.min(152, 940 / N), s = Math.round(step * 0.78);
    const cx0 = 480 - (N * step) / 2 + (step - s) / 2;
    CHARS.forEach((c, i) => {
      const x = cx0 + i * step, y = 66;
      const sel = i === this.sel;
      const taken = this.step === 1 && c.id === this.picked;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(x - 4, y - 4, s + 8, s + 36);
      drawPortrait(ctx, c, x, y, s, sel ? (this.step === 0 ? '#5cff7a' : '#ff5a5a') : '#555');
      if (taken) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(x, y, s, s);
        txt(ctx, '1P', x + s / 2, y + s / 2, { size: 20, font: 'px', color: '#5cff7a', align: 'center' });
      }
      txt(ctx, c.title, x + s / 2, y + s + 15, { size: N > 6 ? 13 : 16, weight: 900, color: sel ? '#ffd84a' : '#ddd', align: 'center' });
      if (sel && blink(t, 3)) {
        ctx.strokeStyle = this.step === 0 ? '#5cff7a' : '#ff5a5a';
        ctx.lineWidth = 4;
        ctx.strokeRect(x - 5, y - 5, s + 10, s + 38);
      }
      this.hot.add(x - 4, y - 4, s + 8, s + 36, () => (this.sel === i ? this.confirm() : ((this.sel = i), this.g.audio.sfx('move'))));
    });
    // 資訊面板
    panel(ctx, 420, 226, 520, 300);
    txt(ctx, ch.title, 444, 254, { size: 30, weight: 900, color: ch.color, stroke: '#000', sw: 5 });
    txt(ctx, ch.type, 920, 254, { size: 15, weight: 700, color: '#aaa', align: 'right' });
    const stats = [['力量', ch.stats.pow], ['速度', ch.stats.spd], ['防禦', ch.stats.def]];
    stats.forEach(([n, v], i) => {
      const y = 290 + i * 22;
      txt(ctx, n, 444, y, { size: 14, weight: 900, color: '#ddd' });
      segBar(ctx, 486, y - 6, 120, 12, v / 5, { segs: 5, color: ['#ff6a4a', '#5cc8ff', '#7cff7a'][i] });
    });
    // 共用指令招式（每個角色都一樣）
    [['連按攻', '三段連招'], ['→＋攻', '前衝攻擊'], ['跳中攻', '從天而降'], ['S／旋踢', '迴旋踢']].forEach(([k, n], i) => {
      const y = 284 + i * 26;
      txt(ctx, k, 630, y, { size: 13, weight: 900, color: '#8ab8ff' });
      txt(ctx, n, 700, y, { size: 15, weight: 900, color: '#fff' });
    });
    txt(ctx, '大招', 630, 400, { size: 13, weight: 900, color: '#ffd84a' });
    txt(ctx, ch.superMove.name, 686, 400, { size: 15, weight: 900, color: '#ffd84a' });
    txt(ctx, ch.superMove.desc, 686, 417, { size: 12, color: '#aaa' });
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(436, 362, 180, 72);
    txt(ctx, '金句', 446, 376, { size: 12, weight: 900, color: '#aaa' });
    const q = `「${ch.quote}」`;
    const qs = q.length > 9 ? [q.slice(0, Math.ceil(q.length / 2)), q.slice(Math.ceil(q.length / 2))] : [q];
    qs.forEach((l, i) => txt(ctx, l, 526, 400 + i * 22 - (qs.length - 1) * 8, { size: 16, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 4 }));
    txt(ctx, '指令招式每人都一樣；大招是各自的絕招', 680, 456, { size: 13, color: '#8ab8ff', align: 'center' });
    txt(ctx, '← → 選擇　Enter 確定　Esc 返回', 680, 500, { size: 13, color: '#999', align: 'center' });
    if (this.flashT > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.flashT})`;
      ctx.fillRect(0, 0, 960, 540);
    }
  }
}
