// 開場插畫輪播（之後可換成 Gemini 生成的插圖：assets/stages/intro_1.png ~ intro_5.png）
import { STAGE_BY_ID } from '../stages.js';
import { CHARS, CHAR_BY_ID } from '../characters.js';
import { drawChar } from '../sprites.js';
import { ASSETS } from '../assets.js';
import { txt, pixelText, blink } from '../ui.js';
import { FONT_TC, rand } from '../util.js';
import { poseOf, silhouette } from './common.js';

const SLIDES = [
  {
    text: '立法院，一個吵了幾十年的地方。',
    draw(p, t) {
      STAGE_BY_ID.legislature.draw(p, t);
      p.fillStyle = 'rgba(0,0,20,0.25)';
      p.fillRect(0, 0, 960, 540);
    },
  },
  {
    text: '這一天，所有法案同時卡關，表決看板直接當機。',
    draw(p, t) {
      STAGE_BY_ID.legislature.draw(p, t);
      p.fillStyle = `rgba(200,0,20,${0.25 + Math.sin(t * 8) * 0.12})`;
      p.fillRect(0, 0, 960, 540);
      p.save();
      p.translate(480, 230);
      p.rotate(-0.04);
      p.fillStyle = '#d0001c';
      p.fillRect(-330, -50, 260, 90);
      p.fillStyle = '#111';
      p.fillRect(-70, -50, 400, 90);
      p.font = `900 52px ${FONT_TC}`;
      p.textBaseline = 'middle';
      p.textAlign = 'center';
      p.fillStyle = '#fff';
      p.fillText('BREAKING', -200, -5);
      p.fillText('議事全面癱瘓', 130, -5);
      p.restore();
    },
  },
  {
    text: '政壇傳奇們，同時被叫進了議場……',
    draw(p, t) {
      p.fillStyle = '#05040c';
      p.fillRect(0, 0, 960, 540);
      CHARS.forEach((ch, i) => {
        const gap = Math.min(140, 820 / (CHARS.length - 1));
        const x = 480 - ((CHARS.length - 1) * gap) / 2 + i * gap;
        const g = p.createRadialGradient(x, 120, 10, x, 420, 260);
        g.addColorStop(0, 'rgba(255,240,200,0.25)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        p.fillStyle = g;
        p.beginPath();
        p.moveTo(x - 20, 0);
        p.lineTo(x + 20, 0);
        p.lineTo(x + 90, 470);
        p.lineTo(x - 90, 470);
        p.fill();
        const reveal = t > 0.4 + i * (2.1 / CHARS.length);
        const draw = () => drawChar(p, ch, poseOf(ch, 'idle', t + i), x, 470, i < CHARS.length / 2 ? 1 : -1, 2.1 * Math.min(1, 7 / CHARS.length + 0.1), 1, false, t);
        if (reveal) draw();
        else silhouette(p, draw);
      });
    },
  },
  {
    text: '沒有表決，沒有協商——',
    draw(p, t) {
      const L = CHAR_BY_ID.han, R = CHAR_BY_ID.su;
      p.fillStyle = L.color2;
      p.beginPath();
      p.moveTo(0, 0);
      p.lineTo(540, 0);
      p.lineTo(420, 540);
      p.lineTo(0, 540);
      p.fill();
      p.fillStyle = R.color2;
      p.beginPath();
      p.moveTo(540, 0);
      p.lineTo(960, 0);
      p.lineTo(960, 540);
      p.lineTo(420, 540);
      p.fill();
      const z = 1 + t * 0.03;
      drawChar(p, L, { ...poseOf(L, 'idle', t), expr: 'shout', aF: [1.6, 0.3] }, 230, 720, 1, 5 * z, 1, false, t);
      drawChar(p, R, { ...poseOf(R, 'idle', t), expr: 'shout', aF: [1.6, 0.3] }, 730, 720, -1, 5 * z, 1, false, t);
      p.strokeStyle = '#fff';
      p.lineWidth = 8;
      p.beginPath();
      p.moveTo(540, 0);
      p.lineTo(420, 540);
      p.stroke();
    },
    overlay(ctx, t) {
      pixelText(ctx, 'VS', 480, 250, { size: 110, scale: 5, font: 'px', color: '#ffe14a', color2: '#ff5a1a', outline: '#200800' });
    },
  },
  {
    text: '只剩下拳頭！政壇大亂鬥，現在開打！',
    draw(p, t) {
      STAGE_BY_ID.rally.draw(p, t);
      p.fillStyle = 'rgba(0,0,0,0.2)';
      p.fillRect(0, 0, 960, 540);
      p.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 30; i++) {
        const y = (i * 37) % 540;
        p.fillRect(960 - ((t * 1400 + i * 211) % 1300), y, 160, 3);
      }
      CHARS.forEach((ch, i) => {
        const row = i % 2;
        const x = 120 + i * Math.min(135, 720 / (CHARS.length - 1)) + Math.sin(t * 3 + i) * 10;
        drawChar(p, ch, poseOf(ch, 'run', t * 1.2 + i), x, 400 + row * 90, 1, 2.0, 1, false, t);
      });
    },
  },
];

export class IntroScene {
  constructor(g) {
    this.g = g;
    this.i = 0;
    this.t = 0;
  }
  enter() {
    this.g.audio.playBgm('menu');
  }
  get slide() {
    return SLIDES[this.i];
  }
  get shown() {
    return Math.min(this.slide.text.length, Math.floor(this.t * 16));
  }
  next() {
    if (this.shown < this.slide.text.length) {
      this.t = this.slide.text.length / 16 + 0.01;
      return;
    }
    this.i++;
    this.t = 0;
    this.g.audio.sfx('move');
    if (this.i >= SLIDES.length) this.g.goTitle();
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if (c.pressed('pause')) return this.g.goTitle();
    if (c.confirm || c.pressed('jump')) this.next();
    else if (this.t > this.slide.text.length / 16 + 2.6) this.next();
  }
  onPointer(x, y) {
    if (x < 120 && y > 490) this.g.goTitle();
    else this.next();
  }
  draw() {
    if (this.i >= SLIDES.length) return;
    const g = this.g;
    const p = g.beginPix();
    const img = ASSETS.stages['intro_' + (this.i + 1)];
    if (img) p.drawImage(img, 0, 0, 960, 540);
    else this.slide.draw(p, this.t);
    g.flushPix();
    const ctx = g.ctx;
    if (!img && this.slide.overlay) this.slide.overlay(ctx, this.t);
    const grd = ctx.createLinearGradient(0, 400, 0, 540);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 400, 960, 140);
    txt(ctx, this.slide.text.slice(0, this.shown), 480, 470, { size: 26, weight: 900, align: 'center', color: '#fff', stroke: '#000', sw: 5 });
    for (let k = 0; k < SLIDES.length; k++) {
      ctx.fillStyle = k === this.i ? '#ffc61a' : '#666';
      ctx.fillRect(420 + k * 26, 515, 18, 4);
    }
    txt(ctx, 'X 跳過', 22, 516, { size: 14, color: '#bbb' });
    if (this.shown >= this.slide.text.length && blink(this.t, 2)) txt(ctx, '▶▶', 900, 516, { size: 16, color: '#ffc61a' });
    if (!g.audio.ready) txt(ctx, '🔊 點一下畫面開啟聲音', 940, 24, { size: 14, color: '#fff', align: 'right', stroke: '#000', sw: 3 });
  }
}
