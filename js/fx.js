// 特效：world 類畫在像素層，UI 類（文字、彈幕、閃光）畫在高解析層
import { ARENA, rand } from './util.js';
import { drawFighter, drawStar } from './sprites.js';
import { txt } from './ui.js';

const UI_TYPES = new Set(['text', 'num', 'comment', 'live', 'screenflash']);
const sy = (e) => ARENA.floorY + (e.z || 0) - (e.y || 0);

export class FX {
  constructor() {
    this.list = [];
  }
  add(e) {
    e.t = 0;
    if (e.type === 'spark' || e.type === 'block') {
      e.rays = Array.from({ length: e.big ? 10 : 7 }, () => ({ a: rand(0, Math.PI * 2), l: rand(0.6, 1.2) }));
    }
    if (e.type === 'dust') e.puffs = Array.from({ length: e.big ? 6 : 3 }, () => ({ dx: rand(-20, 20), r: rand(5, 10) }));
    if (e.type === 'bolt') e.pts = Array.from({ length: 9 }, (_, i) => rand(-14, 14) * (i ? 1 : 0));
    this.list.push(e);
    return e;
  }
  update(dt) {
    for (const e of this.list) e.t += dt;
    this.list = this.list.filter((e) => e.t < e.life);
  }

  draw(ctx) {
    for (const e of this.list) {
      if (UI_TYPES.has(e.type)) continue;
      const p = e.t / e.life;
      const x = e.x, y = sy(e);
      ctx.save();
      switch (e.type) {
        case 'spark':
        case 'block': {
          const col = e.type === 'block' ? '#7fd4ff' : e.color || '#fff27a';
          const R = (e.big ? 34 : 22) * (0.4 + p);
          ctx.globalAlpha = 1 - p;
          ctx.strokeStyle = col;
          ctx.lineWidth = e.big ? 5 : 3.5;
          ctx.lineCap = 'round';
          for (const r of e.rays) {
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(r.a) * R * 0.3, y + Math.sin(r.a) * R * 0.3);
            ctx.lineTo(x + Math.cos(r.a) * R * r.l, y + Math.sin(r.a) * R * r.l);
            ctx.stroke();
          }
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x, y, (e.big ? 12 : 8) * (1 - p), 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'dust':
          ctx.globalAlpha = 0.5 * (1 - p);
          ctx.fillStyle = '#d8d0c0';
          for (const d of e.puffs) {
            ctx.beginPath();
            ctx.arc(x + d.dx * (1 + p), y - 4 - p * 10, d.r * (0.6 + p), 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        case 'ring':
          ctx.globalAlpha = 1 - p;
          ctx.strokeStyle = e.color || '#fff';
          ctx.lineWidth = 6 * (1 - p) + 1;
          ctx.beginPath();
          ctx.ellipse(x, y, e.r * (0.2 + p), e.r * (0.2 + p) * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'headflash': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 1 - p;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 190);
          g.addColorStop(0, 'rgba(255,255,230,1)');
          g.addColorStop(0.3, 'rgba(255,250,170,0.7)');
          g.addColorStop(1, 'rgba(255,240,120,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, 190, e.dir > 0 ? -0.6 : Math.PI - 0.6, e.dir > 0 ? 0.8 : Math.PI + 0.8);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 3;
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + p * 2;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14);
            ctx.lineTo(x + Math.cos(a) * (40 + p * 40), y + Math.sin(a) * (40 + p * 40));
            ctx.stroke();
          }
          break;
        }
        case 'ghost':
          drawFighter(ctx, e.snap, 0.35 * (1 - p));
          break;
        case 'plus':
          ctx.globalAlpha = 1 - p;
          ctx.fillStyle = '#5cff7a';
          ctx.fillRect(x - 2, y - p * 30 - 7, 4, 14);
          ctx.fillRect(x - 7, y - p * 30 - 2, 14, 4);
          break;
        case 'heart': {
          ctx.globalAlpha = 1 - p;
          const hy = y - p * 60, hx = x + Math.sin(p * 10) * 8;
          ctx.fillStyle = '#ff4f8b';
          ctx.beginPath();
          ctx.arc(hx - 4, hy, 5, 0, Math.PI * 2);
          ctx.arc(hx + 4, hy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(hx - 9, hy + 1);
          ctx.lineTo(hx, hy + 11);
          ctx.lineTo(hx + 9, hy + 1);
          ctx.fill();
          break;
        }
        case 'bolt': {
          ctx.globalAlpha = 1 - p;
          const top = 0, bot = y - 40;
          for (const [col, lw] of [['#9ff8ff', 9], ['#ffffff', 3]]) {
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.beginPath();
            for (let i = 0; i < e.pts.length; i++) {
              const yy = top + ((bot - top) * i) / (e.pts.length - 1);
              const xx = x + e.pts[i] * (1 + Math.sin(e.t * 60 + i));
              if (i) ctx.lineTo(xx, yy);
              else ctx.moveTo(xx, yy);
            }
            ctx.stroke();
          }
          drawStar(ctx, x, bot, 22 * (1 - p), '#ffffff');
          break;
        }
      }
      ctx.restore();
    }
  }

  drawUI(ctx, ox = 0, oy = 0) {
    for (const e of this.list) {
      if (!UI_TYPES.has(e.type)) continue;
      const p = e.t / e.life;
      switch (e.type) {
        case 'text':
          txt(ctx, e.text, e.x + ox, sy(e) - p * 40 + oy, { size: e.size || 26, color: e.color || '#fff', align: 'center', weight: 900, stroke: '#000', sw: 5, alpha: 1 - p * p });
          break;
        case 'num':
          txt(ctx, e.text, e.x + ox, sy(e) - p * 36 + oy, { size: e.size || 18, color: e.color || '#fff', align: 'center', font: 'px', stroke: '#000', sw: 4, alpha: 1 - p * p });
          break;
        case 'comment': {
          const x = 980 - p * 1200;
          txt(ctx, e.text, x, e.y, { size: 24, color: '#fff', weight: 900, stroke: '#000', sw: 4 });
          break;
        }
        case 'live': {
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(16, 126, 210, 34);
          ctx.fillStyle = Math.floor(e.t * 3) % 2 ? '#ff2a40' : '#801020';
          ctx.beginPath();
          ctx.arc(34, 143, 7, 0, Math.PI * 2);
          ctx.fill();
          txt(ctx, 'LIVE 直播中', 50, 143, { size: 18, weight: 900, color: '#fff' });
          txt(ctx, `👁 ${Math.floor(1200 + e.t * 48000).toLocaleString()}`, 220, 143, { size: 14, color: '#ffd84a', align: 'right' });
          break;
        }
        case 'screenflash':
          ctx.fillStyle = e.color || '#fff';
          ctx.globalAlpha = 1 - p;
          ctx.fillRect(0, 0, 960, 540);
          ctx.globalAlpha = 1;
          break;
      }
    }
  }
}
