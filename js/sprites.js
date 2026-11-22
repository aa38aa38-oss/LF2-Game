// 程式繪製的暫時角色素材（Q 版骨架人偶）。
// 之後放入 Gemini 生成的圖檔時，drawFighter 會自動改用圖檔。
import { ARENA } from './util.js';
import { charFrame, ASSETS } from './assets.js';
import { MOVES, specialDef } from './moves.js';
import { drawItem } from './items.js';

export const SC = 1.3;
const OL = '#15121a';
const FILTER_OK = typeof CanvasRenderingContext2D !== 'undefined' && 'filter' in CanvasRenderingContext2D.prototype;

export function shade(hex, f) {
  if (!hex || hex[0] !== '#') return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
  return `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
}

function seg(x, y, a, len) {
  return [x + Math.sin(a) * len, y + Math.cos(a) * len];
}
function poly(ctx, pts, w, color, outline = true) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (outline) {
    ctx.strokeStyle = OL;
    ctx.lineWidth = w + 3;
    ctx.stroke();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.stroke();
}
function circ(ctx, x, y, r, fill, lw = 1.6) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw) {
    ctx.strokeStyle = OL;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}
export function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- 道具 ----------
function drawProp(ctx, prop, hx, hy, ang) {
  const dx = Math.sin(ang), dy = Math.cos(ang);
  ctx.save();
  if (prop === 'gavel') {
    const tx = hx + dx * 13, ty = hy + dy * 13;
    poly(ctx, [[hx - dx * 3, hy - dy * 3], [tx, ty]], 2.6, '#8a5a2b');
    ctx.translate(tx, ty);
    ctx.rotate(-ang);
    rrect(ctx, -7, -3.5, 14, 7, 2);
    ctx.fillStyle = '#b8862f';
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#e8c35a';
    ctx.fillRect(-7, -1, 14, 1.6);
  } else if (prop === 'finger') {
    poly(ctx, [[hx, hy], [hx + dx * 7, hy + dy * 7]], 2.2, '#f0c29a');
  } else if (prop === 'phone') {
    ctx.translate(hx + dx * 3, hy + dy * 3);
    ctx.rotate(-ang);
    rrect(ctx, -3.5, -2, 7, 11, 1.5);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ff3b5c';
    ctx.fillRect(-2.3, -0.5, 4.6, 7);
  } else if (prop === 'scalpel') {
    poly(ctx, [[hx, hy], [hx + dx * 10, hy + dy * 10]], 1.6, '#dfe6ee');
  } else if (prop === 'banana') {
    ctx.translate(hx + dx * 4, hy + dy * 4);
    drawBanana(ctx, 0, 0, 1, -ang);
  } else if (prop === 'mic') {
    poly(ctx, [[hx, hy], [hx + dx * 8, hy + dy * 8]], 2.4, '#333');
    circ(ctx, hx + dx * 10, hy + dy * 10, 3, '#9aa', 1.2);
  } else if (prop === 'sign') {
    ctx.translate(hx, hy);
    ctx.rotate(Math.PI - ang);
    drawItem(ctx, 'sign', 0, 6, 0, 0.75);
  } else if (prop === 'egg') {
    ctx.translate(hx + dx * 3, hy + dy * 3);
    drawItem(ctx, 'egg', 0, 6, 0, 0.7);
  } else if (prop === 'bowl') {
    ctx.translate(hx, hy - 2);
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#f4f4f4';
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = '#7a3e12';
    ctx.fillRect(-5, -2, 10, 2.5);
  }
  ctx.restore();
}

export function drawBanana(ctx, x, y, s = 1, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-7, -2);
  ctx.quadraticCurveTo(0, 7, 8, -3);
  ctx.quadraticCurveTo(0, 3, -7, -2);
  ctx.closePath();
  ctx.fillStyle = '#ffd93b';
  ctx.fill();
  ctx.strokeStyle = '#5a4300';
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.fillStyle = '#4a3a10';
  ctx.fillRect(7, -4, 2, 2);
  ctx.restore();
}

// ---------- 身體部位 ----------
function drawLeg(ctx, L, x, y, leg, dark) {
  const [h, k] = leg;
  const kn = seg(x, y, h, 13);
  const ft = seg(kn[0], kn[1], h + k, 13);
  const f = dark ? 0.78 : 1;
  if (L.shorts) {
    poly(ctx, [[x, y], kn, ft], 6.2, shade(L.skin, f));
    const mid = [x + (kn[0] - x) * 0.8, y + (kn[1] - y) * 0.8];
    poly(ctx, [[x, y], mid], 9, shade(L.shorts, f));
  } else {
    poly(ctx, [[x, y], kn, ft], L.muscle ? 8.5 : 7, shade(L.bottom, f));
  }
  ctx.save();
  ctx.translate(ft[0], ft[1]);
  ctx.rotate(-(h + k));
  ctx.beginPath();
  ctx.ellipse(2.8, 0.8, 5.6, 3.1, 0, 0, Math.PI * 2);
  ctx.fillStyle = shade(L.shoes, f);
  ctx.fill();
  ctx.strokeStyle = OL;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
}

function drawArm(ctx, L, x, y, arm, prop, dark) {
  const [a, b] = arm;
  const el = seg(x, y, a, 11);
  const hd = seg(el[0], el[1], a + b, 10.5);
  const f = dark ? 0.78 : 1;
  const w = L.muscle ? 8.6 : 6.2;
  if (L.top === 'tank') {
    poly(ctx, [[x, y], el, hd], w, shade(L.skin, f));
  } else if (L.top === 'tee') {
    poly(ctx, [[x, y], el, hd], w, shade(L.skin, f));
    const m = [x + (el[0] - x) * 0.55, y + (el[1] - y) * 0.55];
    poly(ctx, [[x, y], m], w + 2, shade(L.topColor, f));
  } else if (L.top === 'shirt') {
    poly(ctx, [[x, y], el, hd], w, shade(L.skin, f));
    poly(ctx, [[x, y], el], w + 1.5, shade(L.topColor, f));
  } else {
    poly(ctx, [[x, y], el, hd], w, shade(L.topColor, f));
  }
  if (prop) drawProp(ctx, prop, hd[0], hd[1], a + b);
  circ(ctx, hd[0], hd[1], L.muscle ? 4.8 : 3.7, shade(L.skin, f), 1.4);
}

function drawTorso(ctx, L, hipY, shY) {
  const tw = L.tw || 20;
  const x0 = -tw / 2 + 1;
  const bottom = L.top === 'coat' ? hipY + 12 : hipY + 3;
  // 脖子
  ctx.fillStyle = L.skin;
  ctx.fillRect(-1, shY - 5, 6, 7);
  if (L.top === 'tank') {
    rrect(ctx, x0, shY, tw, bottom - shY, 6);
    ctx.fillStyle = L.skin;
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    // 胸肌線
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0 + tw * 0.5, shY + 4);
    ctx.quadraticCurveTo(x0 + tw * 0.75, shY + 10, x0 + tw - 1, shY + 7);
    ctx.stroke();
    rrect(ctx, x0 + 1, shY + 8, tw - 2, bottom - shY - 8, 4);
    ctx.fillStyle = L.topColor;
    ctx.fill();
    ctx.fillRect(x0 + tw * 0.55, shY, 4, 9);
    ctx.fillRect(x0 + 3, shY, 4, 9);
  } else {
    rrect(ctx, x0, shY, tw, bottom - shY, 5);
    ctx.fillStyle = L.topColor;
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
  if (L.belly) {
    ctx.beginPath();
    ctx.ellipse(tw / 2 - 2, hipY - 8, 7.5, 9, 0, -1.6, 1.8);
    ctx.fillStyle = L.topColor;
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
  const cx = 4;
  if (L.top === 'suit' || L.top === 'coat') {
    ctx.beginPath();
    ctx.moveTo(cx - 4, shY + 0.5);
    ctx.lineTo(cx + 5, shY + 0.5);
    ctx.lineTo(cx + 1, shY + 13);
    ctx.closePath();
    ctx.fillStyle = L.shirt;
    ctx.fill();
    if (L.tie) poly(ctx, [[cx + 0.5, shY + 2], [cx + 0.8, shY + 15]], 2.6, L.tie, false);
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 4, shY + 1);
    ctx.lineTo(cx - 1, shY + 15);
    ctx.stroke();
    if (L.top === 'coat') {
      ctx.strokeStyle = '#b9c0c8';
      ctx.beginPath();
      ctx.moveTo(cx - 1, shY + 15);
      ctx.lineTo(cx - 1, bottom - 1);
      ctx.stroke();
      ctx.strokeRect(cx + 1, hipY - 6, 5, 4);
    }
  } else if (L.top === 'shirt') {
    ctx.fillStyle = '#e2e2dc';
    ctx.beginPath();
    ctx.moveTo(cx - 4, shY);
    ctx.lineTo(cx, shY + 5);
    ctx.lineTo(cx + 5, shY);
    ctx.fill();
    ctx.fillStyle = '#9aa';
    for (let i = 0; i < 3; i++) ctx.fillRect(cx + 1, shY + 8 + i * 6, 1.6, 1.6);
    ctx.fillStyle = '#3b2716';
    ctx.fillRect(x0, hipY - 1, tw, 3);
  } else if (L.top === 'tee') {
    ctx.fillStyle = L.trim;
    ctx.fillRect(x0 + 1, bottom - 4, tw - 2, 2.5);
    ctx.strokeStyle = L.trim;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, shY, 3.5, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }
}

export function drawHead(ctx, L, hx, hy, r, expr = 'normal', t = 0) {
  // 長髮（後面那片）
  if (L.hair === 'long') {
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.1, hy - r * 1.05);
    ctx.quadraticCurveTo(hx - r * 1.55, hy - r * 0.7, hx - r * 1.3, hy + r * 1.35);
    ctx.lineTo(hx - r * 0.15, hy + r * 1.15);
    ctx.lineTo(hx + r * 0.1, hy);
    ctx.closePath();
    ctx.fillStyle = L.hairColor;
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }
  circ(ctx, hx, hy, r, L.skin, 2);
  // 頭髮
  ctx.fillStyle = L.hairColor;
  if (L.hair === 'baldSides') {
    ctx.beginPath();
    ctx.ellipse(hx - r * 0.6, hy + r * 0.05, r * 0.45, r * 0.55, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (L.hair === 'long') {
    ctx.beginPath();
    ctx.arc(hx, hy, r + 1, Math.PI * 0.92, Math.PI * 1.96);
    ctx.quadraticCurveTo(hx + r * 0.7, hy - r * 0.45, hx + r * 0.15, hy - r * 0.4);
    ctx.quadraticCurveTo(hx - r * 0.4, hy - r * 0.15, hx - r * 0.95, hy + r * 0.35);
    ctx.closePath();
    ctx.fill();
  } else if (L.hair === 'side') {
    ctx.beginPath();
    ctx.arc(hx, hy, r + 1.2, Math.PI * 0.9, Math.PI * 1.97);
    ctx.lineTo(hx + r * 0.92, hy - r * 0.36);
    ctx.quadraticCurveTo(hx + r * 0.2, hy - r * 0.58, hx - r * 0.35, hy - r * 0.32);
    ctx.lineTo(hx - r * 0.85, hy + r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx - r * 0.3, hy - r * 1.0);
    ctx.lineTo(hx + r * 0.35, hy - r * 0.78);
    ctx.stroke();
  } else if (L.hair === 'short') {
    ctx.beginPath();
    ctx.arc(hx, hy, r + 0.8, Math.PI * 0.88, Math.PI * 1.98);
    ctx.lineTo(hx + r * 0.88, hy - r * 0.42);
    ctx.quadraticCurveTo(hx, hy - r * 0.62, hx - r * 0.55, hy - r * 0.22);
    ctx.lineTo(hx - r * 0.85, hy + r * 0.25);
    ctx.closePath();
    ctx.fill();
  }
  if (L.hair === 'bald' || L.hair === 'baldSides') {
    ctx.save();
    ctx.globalAlpha *= 0.8;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(hx - r * 0.12, hy - r * 0.62, r * 0.32, r * 0.13, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // 頭帶
  if (L.headband) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(hx, hy, r + 0.5, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = L.headband;
    ctx.fillRect(hx - r - 2, hy - r * 0.68, r * 2 + 4, r * 0.3);
    ctx.fillStyle = '#fff';
    ctx.fillRect(hx - r - 2, hy - r * 0.56, r * 2 + 4, r * 0.07);
    ctx.restore();
  }
  // 耳朵
  circ(ctx, hx - r * 0.5, hy + r * 0.12, r * 0.22, L.skin, 1.3);
  // 鬍子
  if (L.beard) {
    ctx.beginPath();
    ctx.arc(hx, hy, r + 0.6, 0.05, Math.PI * 0.72);
    ctx.arc(hx + r * 0.15, hy + r * 0.05, r * 0.62, Math.PI * 0.7, 0.15, true);
    ctx.closePath();
    ctx.fillStyle = L.beard;
    ctx.fill();
  }
  // 眼睛
  const ex = [hx + r * 0.2, hx + r * 0.63];
  const ey = hy - r * 0.02;
  ctx.fillStyle = '#15121a';
  ctx.strokeStyle = '#15121a';
  for (const x of ex) {
    if (expr === 'hurt') {
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x - 1.8, ey - 1.8);
      ctx.lineTo(x + 1.8, ey + 1.8);
      ctx.moveTo(x + 1.8, ey - 1.8);
      ctx.lineTo(x - 1.8, ey + 1.8);
      ctx.stroke();
    } else if (expr === 'dizzy') {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, ey, 2.2, t * 8, t * 8 + 5);
      ctx.stroke();
    } else if (expr === 'smile') {
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, ey + 1, 1.9, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else if (expr === 'flat') {
      ctx.fillRect(x - 1.6, ey - 0.6, 3.2, 1.6);
    } else {
      ctx.fillRect(x - 1.1, ey - 1.8, 2.3, 3.4);
    }
  }
  // 眉毛
  ctx.lineWidth = L.brows === 'intense' ? 2 : 1.4;
  ctx.beginPath();
  for (const x of ex) {
    if (L.brows === 'angry' || L.brows === 'intense' || expr === 'shout') {
      ctx.moveTo(x - 2.4, ey - 5);
      ctx.lineTo(x + 2.2, ey - 3.4);
    } else if (L.brows === 'soft') {
      ctx.moveTo(x - 2.2, ey - 4);
      ctx.quadraticCurveTo(x, ey - 5.5, x + 2.2, ey - 4);
    } else {
      ctx.moveTo(x - 2.2, ey - 4.2);
      ctx.lineTo(x + 2.2, ey - 4.2);
    }
  }
  ctx.stroke();
  // 眼鏡
  if (L.glasses) {
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.1;
    for (const x of ex) {
      ctx.beginPath();
      if (L.glasses === 'round') ctx.arc(x, ey, 3.3, 0, Math.PI * 2);
      else ctx.rect(x - 3.1, ey - 2.6, 6.2, 5);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(ex[0] + 3, ey - 0.5);
    ctx.lineTo(ex[1] - 3, ey - 0.5);
    ctx.moveTo(ex[0] - 3, ey - 0.5);
    ctx.lineTo(hx - r * 0.45, ey);
    ctx.stroke();
  }
  // 鼻子
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.arc(hx + r * 0.9, hy + r * 0.25, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
  // 嘴巴 / 口罩
  if (L.mask) {
    rrect(ctx, hx + r * 0.0, hy + r * 0.2, r * 1.02, r * 0.62, 3);
    ctx.fillStyle = L.mask;
    ctx.fill();
    ctx.strokeStyle = OL;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.1, hy + r * 0.42);
    ctx.lineTo(hx + r * 0.95, hy + r * 0.42);
    ctx.moveTo(hx + r * 0.1, hy + r * 0.6);
    ctx.lineTo(hx + r * 0.95, hy + r * 0.6);
    ctx.stroke();
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(hx + r * 0.02, hy + r * 0.3);
    ctx.lineTo(hx - r * 0.45, hy + r * 0.1);
    ctx.stroke();
  } else {
    const mx = hx + r * 0.55, my = hy + r * 0.55;
    if (L.beard) {
      ctx.fillStyle = L.beard;
      ctx.fillRect(mx - 3, my - 3.2, 7, 2);
    }
    if (expr === 'smile') {
      ctx.beginPath();
      ctx.arc(mx, my - 1.5, 3.4, 0.1, Math.PI - 0.1);
      ctx.closePath();
      ctx.fillStyle = '#7a1f1f';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,120,120,0.35)';
      ctx.beginPath();
      ctx.ellipse(hx + r * 0.25, hy + r * 0.35, 2.6, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (expr === 'shout' || expr === 'hurt') {
      ctx.beginPath();
      ctx.ellipse(mx, my, 2.6, expr === 'shout' ? 3.8 : 2.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#5a1010';
      ctx.fill();
    } else {
      ctx.strokeStyle = '#3a1a1a';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(mx - 2.2, my);
      ctx.lineTo(mx + 2.4, my - (expr === 'flat' ? 0 : 0.6));
      ctx.stroke();
    }
  }
}

// ---------- 姿勢 ----------
export function poseFor(f) {
  const t = f.animT, st = f.state, T = f.stateT;
  const L = f.char.look;
  const p = {
    aF: [0.5, 1.7], aB: [0.3, 1.8], lF: [0.18, -0.18], lB: [-0.22, -0.05],
    tilt: 0.05, bob: 0, expr: L.expr || 'normal', prop: L.prop || null,
  };
  const H = f.hold;
  if (H) {
    if (H.def.type === 'heavy') {
      p.aF = [2.95, 0.15];
      p.aB = [2.85, 0.15];
      p.prop = null;
    } else p.prop = H.kind === 'mic' ? 'mic' : H.kind;
  }
  switch (st) {
    case 'idle': {
      const s = Math.sin(t * 4);
      p.bob = s * 0.8;
      p.aF = [0.5 + s * 0.05, 1.7];
      break;
    }
    case 'walk': {
      const s = Math.sin(t * 11);
      p.lF = [s * 0.55, -Math.max(0, -s) * 0.9 - 0.1];
      p.lB = [-s * 0.55, -Math.max(0, s) * 0.9 - 0.1];
      p.aF = [0.4 - s * 0.35, 1.5];
      p.aB = [0.3 + s * 0.35, 1.5];
      p.bob = Math.abs(s) * 1.2;
      break;
    }
    case 'run': {
      const s = Math.sin(t * 17);
      p.lF = [s * 0.9 + 0.2, -Math.max(0, -s) * 1.4 - 0.2];
      p.lB = [-s * 0.9 + 0.2, -Math.max(0, s) * 1.4 - 0.2];
      p.aF = [0.2 - s * 0.9, 1.9];
      p.aB = [0.2 + s * 0.9, 1.9];
      p.tilt = 0.32;
      p.bob = Math.abs(s) * 2;
      break;
    }
    case 'jump':
      p.lF = [0.9, -1.5];
      p.lB = [-0.1, -1.1];
      p.aF = [2.3, 0.5];
      p.aB = [1.8, 0.6];
      p.tilt = 0.1;
      break;
    case 'a1': {
      const on = T > 0.04 && T < 0.19;
      p.aF = on ? [1.57, 0.05] : [0.6, 1.6];
      if (L.prop === 'gavel') p.aF = on ? [1.3, 0.2] : [2.8, 0.2];
      p.tilt = on ? 0.18 : 0.08;
      p.lF = [0.35, -0.3];
      p.lB = [-0.4, 0];
      break;
    }
    case 'a2': {
      const on = T > 0.05 && T < 0.21;
      p.aB = on ? [1.6, 0.05] : [0.4, 1.6];
      p.aF = [0.4, 1.8];
      p.tilt = on ? 0.28 : 0.1;
      p.lF = [0.4, -0.35];
      p.lB = [-0.45, 0];
      break;
    }
    case 'a3': {
      const on = T > 0.12 && T < 0.32;
      if (L.prop === 'gavel') {
        p.aF = on ? [1.2, 0.1] : [3.0, 0.1];
        p.aB = on ? [1.0, 0.4] : [2.8, 0.2];
        p.tilt = on ? 0.35 : -0.15;
        p.lF = [0.5, -0.5];
        p.lB = [-0.4, 0];
      } else if (on) {
        p.lF = [1.65, -0.05];
        p.lB = [-0.15, -0.05];
        p.tilt = -0.3;
        p.aF = [0.9, 1.2];
        p.aB = [-0.6, 0.8];
      } else {
        p.lF = [0.8, -1.4];
        p.tilt = -0.1;
      }
      break;
    }
    case 'djatk':
      p.lF = [1.5, -0.05];
      p.lB = [-0.6, -0.4];
      p.aF = [0.6, 1.6];
      p.aB = [-0.9, 0.6];
      p.tilt = -0.35;
      p.expr = 'shout';
      break;
    case 'roll':
      p.rot = T * 15;
      p.lF = [1.2, -2.2];
      p.lB = [1.0, -2.0];
      p.aF = [1.2, 1.4];
      p.aB = [1.0, 1.4];
      p.prop = null;
      break;
    case 'flip':
      p.rot = -T * 14;
      p.lF = [1.2, -2.0];
      p.lB = [1.0, -1.8];
      p.aF = [1.5, 1.2];
      p.aB = [1.3, 1.2];
      p.prop = null;
      break;
    case 'pick':
      p.tilt = 0.6;
      p.aF = [0.3, 0];
      p.lF = [0.7, -1.2];
      break;
    case 'catch': {
      const punch = f.mv.punchShow > 0;
      p.aF = punch ? [1.6, 0] : [1.4, 0.3];
      p.aB = punch ? [1.4, 0.4] : [1.3, 0.4];
      p.tilt = 0.12;
      p.expr = punch ? 'shout' : p.expr;
      break;
    }
    case 'caught':
      p.tilt = -0.25;
      p.aF = [-0.2, 0.3];
      p.aB = [-0.4, 0.3];
      p.expr = 'hurt';
      p.prop = null;
      break;
    case 'jatk':
      p.lF = [1.2, -0.15];
      p.lB = [-0.3, -1.3];
      p.aF = [1.0, 1.2];
      p.aB = [-0.8, 0.6];
      p.tilt = -0.15;
      break;
    case 'ratk':
      p.aF = [1.6, 0];
      p.aB = [1.4, 0.3];
      p.tilt = 0.55;
      p.lF = [0.3, -1.2];
      p.lB = [-0.9, -0.5];
      p.expr = 'shout';
      break;
    case 'defend':
      p.aF = [1.0, 2.0];
      p.aB = [0.9, 2.1];
      p.tilt = -0.05;
      p.lF = [0.45, -0.7];
      p.lB = [-0.35, -0.4];
      break;
    case 'hurt':
      p.tilt = -0.4;
      p.aF = [-0.4, 0.6];
      p.aB = [-0.7, 0.4];
      p.expr = 'hurt';
      p.lF = [0.3, -0.3];
      p.prop = null;
      break;
    case 'fall':
      p.rot = -(0.5 + Math.min(1, T * 2.2) * 1.0);
      p.aF = [2.4, 0.4];
      p.aB = [2.0, 0.6];
      p.lF = [0.5, -0.4];
      p.lB = [0.9, -0.6];
      p.expr = 'hurt';
      p.prop = null;
      break;
    case 'down':
    case 'ko':
      p.lying = true;
      p.aF = [2.6, 0.2];
      p.aB = [2.2, 0.4];
      p.lF = [0.2, 0];
      p.lB = [0.4, -0.3];
      p.expr = st === 'ko' ? 'dizzy' : 'hurt';
      p.prop = null;
      break;
    case 'getup':
      p.lF = [1.2, -2.2];
      p.lB = [-0.5, -1.2];
      p.tilt = 0.45;
      p.aF = [0.9, 0.5];
      p.aB = [0.4, 0.3];
      break;
    case 'dizzy': {
      const s = Math.sin(t * 5);
      p.tilt = s * 0.18;
      p.aF = [-0.1 + s * 0.2, 0.2];
      p.aB = [0.1 - s * 0.2, 0.2];
      p.expr = 'dizzy';
      break;
    }
    case 'victory': {
      const s = Math.abs(Math.sin(t * 5));
      p.aF = [2.9, 0.15];
      p.aB = [-0.3, -1.5];
      p.bob = s * 3;
      p.expr = 'smile';
      break;
    }
    case 'grabbed':
      p.rot = -1.4;
      p.aF = [2.5, 0.6];
      p.aB = [2.0, 0.5];
      p.expr = 'hurt';
      p.prop = null;
      break;
    case 'superwait':
      p.aF = [2.6, 0.3];
      p.aB = [2.2, 0.3];
      p.expr = 'shout';
      break;
    case 'special':
    case 'super': {
      const def = st === 'special' ? specialDef(f.char.id, f.spKind) : MOVES[f.char.id].super;
      if (def && def.pose) Object.assign(p, def.pose(f, T, t));
      break;
    }
  }
  return p;
}

// 大絕海報用的姿勢
export const POSTER_POSE = {
  su: { aF: [1.7, 0.1], aB: [-0.6, 1.6], lF: [0.6, -0.4], lB: [-0.5, 0], tilt: 0.25, expr: 'shout' },
  wang: { aF: [1.57, 0], aB: [-0.3, -1.2], lF: [0.4, -0.2], lB: [-0.4, 0], tilt: 0.1, expr: 'shout', prop: 'finger' },
  han: { aF: [2.9, 0.2], aB: [2.4, 0.3], lF: [0.5, -0.3], lB: [-0.4, 0], tilt: -0.05, expr: 'smile', prop: 'gavel' },
  ma: { aF: [0.4, 1.9], aB: [-0.8, 1.9], lF: [0.9, -1.2], lB: [-0.7, -0.4], tilt: 0.2, expr: 'smile', prop: 'banana' },
  ko: { aF: [1.2, 1.2], aB: [0.2, 1.4], lF: [0.3, -0.2], lB: [-0.3, 0], tilt: 0.05, expr: 'flat', prop: 'scalpel' },
  guan: { aF: [2.8, 0.2], aB: [1.2, 1.8], lF: [0.5, -0.3], lB: [-0.5, 0], tilt: 0.1, expr: 'shout', prop: 'phone' },
};

// ---------- 主要繪製 ----------
const ext = (l) => 13 * Math.cos(l[0]) + 13 * Math.cos(l[0] + l[1]);

export function drawChar(ctx, ch, pose, x, y, facing, sc = SC, alpha = 1, flash = false, t = 0) {
  const L = ch.look;
  const p = pose;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * sc, sc);
  if (alpha < 1) ctx.globalAlpha *= alpha;
  if (flash && FILTER_OK) ctx.filter = 'brightness(2.4)';
  if (p.lying) {
    ctx.translate(38, -9);
    ctx.rotate(-Math.PI / 2);
  } else if (p.rot) {
    ctx.translate(0, -40);
    ctx.rotate(p.rot);
    ctx.translate(0, 40);
  }
  const hipY = (p.bike ? -20 : -Math.max(ext(p.lF), ext(p.lB), 8) - 3) - (p.bob || 0);
  const shY = hipY - 26;
  const hr = L.hr || 13.5;
  const hx = 1.5, hy = shY - hr + 4;
  const tilt = p.tilt || 0;
  const upper = () => {
    ctx.translate(0, hipY);
    ctx.rotate(tilt);
    ctx.translate(0, -hipY);
  };
  if (p.bike) {
    for (const wx of [-16, 18]) {
      ctx.beginPath();
      ctx.arc(wx, -9, 9, 0, Math.PI * 2);
      ctx.strokeStyle = OL;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    poly(ctx, [[-16, -9], [0, -20], [18, -9]], 2.4, '#2ec4b6');
    poly(ctx, [[0, -20], [14, -30]], 2.2, '#2ec4b6');
  }
  drawLeg(ctx, L, -3, hipY, p.lB, true);
  ctx.save();
  upper();
  drawArm(ctx, L, -2, shY + 4, p.aB, p.propB || null, true);
  ctx.restore();
  drawLeg(ctx, L, 3, hipY, p.lF, false);
  ctx.save();
  upper();
  drawTorso(ctx, L, hipY, shY);
  drawHead(ctx, L, hx, hy, hr, p.expr, t);
  drawArm(ctx, L, 3, shY + 4, p.aF, p.prop, false);
  ctx.restore();
  ctx.restore();
}

const ANIM_MAP = {
  idle: 'idle', walk: 'walk', run: 'run', jump: 'jump', a1: 'attack1', a2: 'attack2', a3: 'attack3',
  jatk: 'jump_attack', ratk: 'run_attack', defend: 'defend', hurt: 'hurt', fall: 'fall', down: 'down',
  ko: 'down', getup: 'getup', dizzy: 'dizzy', victory: 'victory', grabbed: 'fall', special: 'special',
  djatk: 'jump_attack', roll: 'roll', flip: 'roll', pick: 'getup', catch: 'catch', caught: 'hurt', land: 'idle',
  super: 'super', superwait: 'super',
};
const LOOP_ANIMS = new Set(['idle', 'walk', 'run', 'dizzy', 'victory', 'defend']);

export function drawFighter(ctx, f, alpha = 1) {
  const sx = f.x, sy = ARENA.floorY + f.z - f.y;
  const anim = ANIM_MAP[f.state] || 'idle';
  const loop = LOOP_ANIMS.has(anim);
  // 三招技能可以各有一組圖（special_fwd / special_up / special_down），沒有就用共用的 special
  let img = f.state === 'special' ? charFrame(f.char.id, 'special_' + (f.spKind || 'fwd'), f.stateT, 10, false) : null;
  if (!img) img = charFrame(f.char.id, anim, loop ? f.animT : f.stateT, 10, loop);
  if (img) {
    const sH = ASSETS.spriteH || 128, st = ASSETS.standH[f.char.id];
    // 有站立高度：所有動作用同一個比例（腳底對齊）；沒有就整格縮成固定高度
    const h = st ? img.height * (sH / st) : sH, w = (img.width * h) / img.height;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(f.facing, 1);
    ctx.globalAlpha *= alpha;
    if (f.flash > 0 && FILTER_OK) ctx.filter = 'brightness(2.2)';
    ctx.drawImage(img, -w / 2, -h, w, h);
    ctx.restore();
  } else {
    drawChar(ctx, f.char, poseFor(f), sx, sy, f.facing, SC, alpha, f.flash > 0, f.animT);
  }
  if (f.hold && f.hold.def && f.hold.def.type === 'heavy') drawItem(ctx, f.hold.kind, sx, sy - 112, 0, 1.2);
  if (f.state === 'dizzy') {
    for (let i = 0; i < 3; i++) {
      const a = f.animT * 5 + (i * Math.PI * 2) / 3;
      drawStar(ctx, sx + Math.cos(a) * 16, sy - 112 + Math.sin(a) * 5, 4, '#ffe14a');
    }
  }
}

export function drawStar(ctx, x, y, r, color) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawShadow(ctx, x, z, y, w = 26) {
  const sy = ARENA.floorY + z;
  const s = Math.max(0.4, 1 - y / 300);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x, sy, w * s, 7 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

// 選角／VS 畫面的全身立繪（有登記 select 圖才會用），腳底對齊 (x, y)
export function drawArt(ctx, ch, x, y, h, facing = 1) {
  // 沒有選角立繪時，用 Gemini 生的站立動作圖頂替（畫風才會一致）
  const img = ASSETS.select[ch.id] || charFrame(ch.id, 'idle', 0, 8, true);
  if (!img) return false;
  const w = (img.width * h) / img.height;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
  return true;
}

// ---------- 頭像 ----------
const pcache = new Map();
export function portrait(ch, size = 64) {
  if (ASSETS.portraits[ch.id]) return ASSETS.portraits[ch.id];
  const key = ch.id + size;
  if (pcache.has(key)) return pcache.get(key);
  const s = Math.max(16, Math.round(size / 2));
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d');
  x.scale(s / 64, s / 64);
  const g = x.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, ch.color);
  g.addColorStop(1, ch.color2);
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const L = ch.look;
  rrect(x, 8, 50, 50, 30, 10);
  x.fillStyle = L.top === 'tank' ? L.skin : L.topColor;
  x.fill();
  x.strokeStyle = OL;
  x.lineWidth = 2;
  x.stroke();
  drawHead(x, L, 30, 32, 21, L.expr || 'normal', 0);
  pcache.set(key, c);
  return c;
}

export function drawPortrait(ctx, ch, x, y, size, border = '#c9a227') {
  const img = portrait(ch, size);
  ctx.save();
  ctx.imageSmoothingEnabled = !!ASSETS.portraits[ch.id];
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
}
