// 首頁
import { CHARS } from '../characters.js';
import { drawChar } from '../sprites.js';
import { ASSETS } from '../assets.js';
import { txt, pixelText, blink, Hotspots } from '../ui.js';
import { poseOf } from './common.js';

function titleArt(p, t) {
  const sky = p.createLinearGradient(0, 0, 0, 540);
  sky.addColorStop(0, '#070b26');
  sky.addColorStop(0.6, '#1d1850');
  sky.addColorStop(1, '#2c1a4a');
  p.fillStyle = sky;
  p.fillRect(0, 0, 960, 540);
  for (let i = 0; i < 90; i++) {
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
    p.fillStyle = `rgba(255,255,255,${tw * 0.7})`;
    p.fillRect((i * 173) % 960, (i * 71) % 300, 2, 2);
  }
  // 雲
  p.fillStyle = 'rgba(60,50,120,0.55)';
  for (let i = 0; i < 7; i++) {
    const x = ((i * 190 + t * 12) % 1200) - 120;
    p.beginPath();
    p.ellipse(x, 120 + (i % 3) * 50, 120, 26, 0, 0, Math.PI * 2);
    p.fill();
  }
  // 光芒
  p.save();
  p.translate(480, 250);
  p.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) {
    p.rotate(Math.PI / 7);
    p.fillStyle = 'rgba(255,200,80,0.06)';
    p.beginPath();
    p.moveTo(0, 0);
    p.lineTo(600, -40 - Math.sin(t + i) * 10);
    p.lineTo(600, 40 + Math.sin(t + i) * 10);
    p.fill();
  }
  p.restore();
  // 國會殿堂（虛構）
  p.fillStyle = '#1a1838';
  p.fillRect(330, 170, 300, 260);
  p.fillStyle = '#26224a';
  p.beginPath();
  p.ellipse(480, 170, 110, 70, 0, Math.PI, 0);
  p.fill();
  p.fillRect(474, 80, 12, 30);
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      const on = Math.sin(r * 7 + c * 3 + Math.floor(t)) > -0.2;
      p.fillStyle = on ? '#ffd27a' : '#3a3260';
      p.fillRect(350 + c * 36, 190 + r * 38, 18, 22);
    }
  }
  // 城市
  for (let i = 0; i < 24; i++) {
    const w = 30 + ((i * 37) % 40), h = 60 + ((i * 53) % 110);
    const x = i * 42 - 10;
    if (x > 300 && x < 640) continue;
    p.fillStyle = '#100e26';
    p.fillRect(x, 430 - h, w, h + 110);
    p.fillStyle = 'rgba(255,210,120,0.6)';
    for (let k = 0; k < h / 18; k++) if ((i + k) % 3) p.fillRect(x + 6, 440 - h + k * 18, 5, 6);
  }
  p.fillStyle = '#0a0918';
  p.fillRect(0, 430, 960, 110);
}

export class TitleScene {
  constructor(g) {
    this.g = g;
    this.t = 0;
    this.hot = new Hotspots();
  }
  enter() {
    this.g.audio.playBgm('title');
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if (c.pressed('rank')) return this.g.goLeaderboard();
    if (c.confirm) {
      this.g.audio.sfx('confirm');
      this.g.goHowTo();
    }
  }
  onPointer(x, y) {
    if (this.hot.hit(x, y)) return;
    this.g.audio.sfx('confirm');
    this.g.goHowTo();
  }
  draw() {
    const g = this.g, t = this.t;
    const p = g.beginPix();
    if (ASSETS.stages.title) p.drawImage(ASSETS.stages.title, 0, 0, 960, 540);
    else {
      titleArt(p, t);
      // 角色陣容：中間主角輪播
      const hero = Math.floor(t / 3) % CHARS.length;
      const others = CHARS.filter((_, i) => i !== hero);
      const pos = [[110, 440], [230, 455], [730, 455], [850, 440], [960, 999]];
      others.slice(0, 4).forEach((ch, i) => {
        drawChar(p, ch, poseOf(ch, 'idle', t + i), pos[i][0], pos[i][1], i < 2 ? 1 : -1, 1.9, 1, false, t);
      });
      const H = CHARS[hero];
      const sp = p.createRadialGradient(480, 470, 10, 480, 470, 160);
      sp.addColorStop(0, 'rgba(255,230,150,0.5)');
      sp.addColorStop(1, 'rgba(0,0,0,0)');
      p.fillStyle = sp;
      p.fillRect(320, 320, 320, 200);
      drawChar(p, H, poseOf(H, 'victory', t), 480, 478, 1, 2.6, 1, false, t);
    }
    g.flushPix();
    const ctx = g.ctx;
    pixelText(ctx, '政壇大亂鬥', 480, 82, { size: 96, scale: 4, color: '#8CFF5B', color2: '#2fbf2f', outline: '#062006' });
    pixelText(ctx, 'TAIWAN POLITICS BRAWL', 480, 150, { size: 26, scale: 2, font: 'px', color: '#ffd84a', color2: '#ff9a1a', outline: '#2a1000' });
    const hero = Math.floor(t / 3) % CHARS.length;
    if (!ASSETS.stages.title) {
      txt(ctx, CHARS[hero].title, 480, 200, { size: 22, weight: 900, color: CHARS[hero].color, align: 'center', stroke: '#000', sw: 5 });
    }
    txt(ctx, '法案卡關、協商破裂……剩下的，只能用拳頭解決！', 480, 392, { size: 20, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 5 });
    if (blink(t, 1.2)) pixelText(ctx, 'PRESS ENTER', 480, 432, { size: 28, scale: 2, font: 'px', color: '#ffd84a', color2: '#ff9a1a', outline: '#2a1000' });
    txt(ctx, '方向鍵 移動　A 普攻　Q W E 技能　R 大絕　D 跳　F 防禦　P 暫停（按鍵參考英雄聯盟）', 480, 470, { size: 15, weight: 700, color: '#fff', align: 'center', stroke: '#000', sw: 4 });
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 490, 960, 50);
    txt(ctx, `HI-SCORE ${String(g.hi).padStart(8, '0')}　|　搞笑二創同人作品，角色與劇情純屬虛構，與真實人物無關`, 480, 507, { size: 13, color: '#9a9ab0', align: 'center' });
    txt(ctx, 'Music & SFX：8-bit 程式產生', 480, 527, { size: 12, color: '#77778a', align: 'center' });
    // 右上按鈕
    this.hot.clear();
    const btn = (x, y, w, label, fn) => {
      ctx.fillStyle = 'rgba(20,16,10,0.85)';
      ctx.fillRect(x, y, w, 36);
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, w - 2, 34);
      txt(ctx, label, x + w / 2, y + 18, { size: 16, weight: 900, color: '#ffd84a', align: 'center' });
      this.hot.add(x, y, w, 36, fn);
    };
    btn(806, 14, 140, '🏆 排行榜 (R)', () => g.goLeaderboard());
    btn(806, 56, 140, g.audio.muted ? '🔇 靜音中 (M)' : '🔊 聲音 (M)', () => g.audio.toggleMute());
    if (!g.audio.ready) txt(ctx, '🔊 點一下畫面開啟聲音', 946, 110, { size: 13, color: '#fff', align: 'right', stroke: '#000', sw: 3 });
  }
}
