// 文字與 UI 小工具
import { FONT_TC, FONT_PX } from './util.js';

export function txt(ctx, s, x, y, o = {}) {
  const { size = 20, color = '#fff', align = 'left', font = 'tc', weight = 700, stroke = null, sw = 4, base = 'middle', alpha = 1, shadow = null } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = font === 'px' ? `${size}px ${FONT_PX}` : `${weight} ${size}px ${FONT_TC}`;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.lineJoin = 'round';
  if (shadow) {
    if (stroke) {
      ctx.lineWidth = sw;
      ctx.strokeStyle = shadow;
      ctx.strokeText(s, x + 3, y + 3);
    }
    ctx.fillStyle = shadow;
    ctx.fillText(s, x + 3, y + 3);
  }
  if (stroke) {
    ctx.lineWidth = sw;
    ctx.strokeStyle = stroke;
    ctx.strokeText(s, x, y);
  }
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
  ctx.restore();
}

// 像素風大字：先在小畫布上畫，再放大（關閉平滑）→ 方塊感
const pcache = new Map();
export function clearTextCache() {
  pcache.clear();
}
export function pixelText(ctx, s, x, y, o = {}) {
  const { size = 64, scale = 4, color = '#7CFF5B', color2 = null, outline = '#0a1a08', align = 'center', font = 'tc', alpha = 1, shadow = 'rgba(0,0,0,0.6)' } = o;
  const key = [s, size, scale, color, color2, outline, font, shadow].join('|');
  let c = pcache.get(key);
  if (!c) {
    const fs = Math.max(6, Math.round(size / scale));
    const f = font === 'px' ? `${fs}px ${FONT_PX}` : `900 ${fs}px ${FONT_TC}`;
    const m = document.createElement('canvas').getContext('2d');
    m.font = f;
    const w = Math.ceil(m.measureText(s).width) + 6;
    const h = Math.ceil(fs * 1.5) + 4;
    c = document.createElement('canvas');
    c.width = w + 2;
    c.height = h + 2;
    const x2 = c.getContext('2d');
    x2.font = f;
    x2.textBaseline = 'middle';
    x2.textAlign = 'left';
    const draw = (dx, dy, fill) => {
      x2.lineWidth = 2;
      x2.lineJoin = 'round';
      x2.strokeStyle = fill === 'shadow' ? shadow : outline;
      x2.strokeText(s, 3 + dx, h / 2 + dy);
      if (fill === 'shadow') {
        x2.fillStyle = shadow;
      } else if (color2) {
        const g = x2.createLinearGradient(0, h * 0.2, 0, h * 0.8);
        g.addColorStop(0, color);
        g.addColorStop(1, color2);
        x2.fillStyle = g;
      } else x2.fillStyle = color;
      x2.fillText(s, 3 + dx, h / 2 + dy);
    };
    if (shadow) draw(1, 1, 'shadow');
    draw(0, 0, 'main');
    // 去掉半透明邊緣，讓字變成硬邊像素
    try {
      const d = x2.getImageData(0, 0, c.width, c.height);
      const p = d.data;
      for (let i = 3; i < p.length; i += 4) p[i] = p[i] > 110 ? 255 : 0;
      x2.putImageData(d, 0, 0);
    } catch (e) {
      /* ignore */
    }
    pcache.set(key, c);
  }
  const W = c.width * scale, H = c.height * scale;
  let dx = x;
  if (align === 'center') dx = x - W / 2;
  else if (align === 'right') dx = x - W;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(c, Math.round(dx), Math.round(y - H / 2), W, H);
  ctx.restore();
  return W;
}

export function panel(ctx, x, y, w, h, o = {}) {
  const { fill = 'rgba(10,12,30,0.88)', border = '#c9a227', inner = 'rgba(255,255,255,0.08)' } = o;
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = border;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  ctx.strokeStyle = inner;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);
}

export function segBar(ctx, x, y, w, h, ratio, o = {}) {
  const { segs = 20, colors = null, color = '#46e04a', back = '#1a1a1a', mirror = false } = o;
  ctx.fillStyle = '#000';
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = back;
  ctx.fillRect(x, y, w, h);
  const sw = w / segs;
  const n = ratio * segs;
  let col = color;
  if (colors) col = ratio > 0.5 ? colors[0] : ratio > 0.25 ? colors[1] : colors[2];
  for (let i = 0; i < segs; i++) {
    const fillAmt = Math.max(0, Math.min(1, n - i));
    if (fillAmt <= 0) continue;
    const idx = mirror ? segs - 1 - i : i;
    const sx = x + idx * sw + 1;
    const fw = (sw - 2) * fillAmt;
    ctx.fillStyle = col;
    ctx.fillRect(mirror ? sx + (sw - 2) - fw : sx, y + 1, fw, h - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(mirror ? sx + (sw - 2) - fw : sx, y + 1, fw, 2);
  }
}

// 簡單的可點擊區域管理
export class Hotspots {
  constructor() {
    this.list = [];
  }
  clear() {
    this.list = [];
  }
  add(x, y, w, h, fn) {
    this.list.push({ x, y, w, h, fn });
  }
  hit(px, py) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const r = this.list[i];
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        r.fn();
        return true;
      }
    }
    return false;
  }
}

export function blink(t, rate = 2) {
  return Math.floor(t * rate * 2) % 2 === 0;
}
