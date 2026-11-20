// 對戰前 VS 畫面
import { CHAR_BY_ID } from '../characters.js';
import { drawChar } from '../sprites.js';
import { txt, pixelText } from '../ui.js';
import { poseOf } from './common.js';
import { easeOut } from '../util.js';
import { MODE_NAME } from '../battle.js';

export class VSScene {
  constructor(g, cfg) {
    this.g = g;
    this.cfg = cfg;
    this.t = 0;
  }
  enter() {
    this.g.audio.stopBgm();
    this.g.audio.sfx('cutin');
  }
  go() {
    if (this.started) return;
    this.started = true;
    this.g.startBattle(this.cfg);
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if ((this.t > 0.6 && c.confirm) || this.t > 2.6) this.go();
  }
  onPointer() {
    if (this.t > 0.6) this.go();
  }
  draw() {
    const g = this.g, t = this.t;
    const me = CHAR_BY_ID[this.cfg.playerChar];
    const foes = this.cfg.mode === 'survival' ? [] : this.cfg.cpuChars.map((id) => CHAR_BY_ID[id]);
    const k = easeOut(t / 0.35);
    const p = g.beginPix();
    p.fillStyle = me.color2;
    p.beginPath();
    p.moveTo(0, 0);
    p.lineTo(560, 0);
    p.lineTo(400, 540);
    p.lineTo(0, 540);
    p.fill();
    p.fillStyle = foes.length ? foes[0].color2 : '#222';
    p.beginPath();
    p.moveTo(560, 0);
    p.lineTo(960, 0);
    p.lineTo(960, 540);
    p.lineTo(400, 540);
    p.fill();
    p.fillStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 20; i++) p.fillRect(((i * 97 + t * 900) % 1100) - 100, (i * 53) % 540, 120, 3);
    drawChar(p, me, { ...poseOf(me, 'idle', t), expr: 'shout' }, -200 + k * 440, 600, 1, 4.2, 1, false, t);
    if (foes.length === 1) {
      drawChar(p, foes[0], { ...poseOf(foes[0], 'idle', t), expr: 'shout' }, 1160 - k * 440, 600, -1, 4.2, 1, false, t);
    } else if (foes.length) {
      foes.forEach((f, i) => drawChar(p, f, poseOf(f, 'idle', t + i), 1100 - k * (420 - i * 110), 560 - i * 40, -1, 2.4, 1, false, t));
    }
    p.strokeStyle = '#fff';
    p.lineWidth = 8;
    p.beginPath();
    p.moveTo(560, 0);
    p.lineTo(400, 540);
    p.stroke();
    g.flushPix();
    const ctx = g.ctx;
    const s = t < 0.5 ? 2 - easeOut((t - 0.2) / 0.3) : 1;
    ctx.save();
    ctx.translate(480, 250);
    ctx.scale(s, s);
    pixelText(ctx, 'VS', 0, 0, { size: 120, scale: 5, font: 'px', color: '#ffe14a', color2: '#ff5a1a', outline: '#200800' });
    ctx.restore();
    txt(ctx, me.title, 40, 470, { size: 36, weight: 900, color: '#fff', stroke: '#000', sw: 7 });
    txt(ctx, `「${me.quote}」`, 40, 510, { size: 20, weight: 900, color: me.color, stroke: '#000', sw: 5 });
    if (foes.length === 1) {
      txt(ctx, foes[0].title, 920, 70, { size: 36, weight: 900, color: '#fff', align: 'right', stroke: '#000', sw: 7 });
      txt(ctx, `「${foes[0].quote}」`, 920, 110, { size: 20, weight: 900, color: foes[0].color, align: 'right', stroke: '#000', sw: 5 });
    } else if (foes.length) {
      txt(ctx, foes.map((f) => f.title).join('・'), 920, 70, { size: 26, weight: 900, color: '#fff', align: 'right', stroke: '#000', sw: 6 });
    } else {
      txt(ctx, '？？？', 920, 70, { size: 40, weight: 900, color: '#fff', align: 'right', stroke: '#000', sw: 7 });
      txt(ctx, '一波接一波，撐到最後！', 920, 110, { size: 20, weight: 900, color: '#ffd84a', align: 'right', stroke: '#000', sw: 5 });
    }
    txt(ctx, MODE_NAME[this.cfg.mode], 920, 515, { size: 18, weight: 900, color: '#ffd84a', align: 'right', stroke: '#000', sw: 4 });
  }
}
