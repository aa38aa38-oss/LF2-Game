// 場上道具（參考小朋友齊打交：天上掉東西，撿起來用或丟人）
// food：撿到立即使用；light：輕武器（拿在手上揮、跑步/跳躍中按攻擊丟出）；
// throw：只能丟（雞蛋）；heavy：重物（舉在頭上，按攻擊丟出）
import { ARENA, rand, pick } from './util.js';

export const ITEM_DEFS = {
  bento: { name: '便當', type: 'food', hp: 70, cap: 40, weight: 3 },
  boba: { name: '珍奶', type: 'food', mp: 60, weight: 2 },
  sign: { name: '抗議標語', type: 'light', dur: 10, dmg: 6, reach: 22, throwDmg: 16, weight: 3 },
  mic: { name: '麥克風', type: 'light', dur: 8, dmg: 4, reach: 10, throwDmg: 14, weight: 2 },
  egg: { name: '雞蛋', type: 'throw', throwDmg: 9, weight: 3 },
  chair: { name: '議場椅子', type: 'heavy', throwDmg: 28, weight: 2 },
};

export function randomItemKind() {
  const list = [];
  for (const [k, d] of Object.entries(ITEM_DEFS)) for (let i = 0; i < d.weight; i++) list.push(k);
  return pick(list);
}

export function newItem(kind, x, z, y = 520) {
  const d = ITEM_DEFS[kind];
  return { kind, def: d, x, z, y, vy: 0, dur: d.dur || 0, t: 0 };
}

export function spawnRandomItem() {
  return newItem(randomItemKind(), rand(ARENA.xMin + 60, ARENA.xMax - 60), rand(ARENA.zMin + 10, ARENA.zMax - 10));
}

// 畫在 (x, y)；y 為物品底部
export function drawItem(ctx, kind, x, y, rot = 0, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#15121a';
  switch (kind) {
    case 'bento':
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(-15, -14, 30, 14);
      ctx.strokeRect(-15, -14, 30, 14);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-12, -12, 15, 8);
      ctx.fillStyle = '#e8a33a';
      ctx.fillRect(4, -12, 8, 8);
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(-15, -16, 30, 3);
      break;
    case 'boba':
      ctx.fillStyle = '#d9a66b';
      ctx.beginPath();
      ctx.moveTo(-8, -22);
      ctx.lineTo(8, -22);
      ctx.lineTo(6, 0);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2a1608';
      for (let i = 0; i < 5; i++) ctx.fillRect(-5 + (i % 3) * 4, -6 + Math.floor(i / 3) * 3, 2.5, 2.5);
      ctx.strokeStyle = '#ff3b6b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(2, -22);
      ctx.lineTo(5, -32);
      ctx.stroke();
      break;
    case 'sign':
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(-2, -36, 4, 36);
      ctx.strokeRect(-2, -36, 4, 36);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-16, -56, 32, 22);
      ctx.strokeRect(-16, -56, 32, 22);
      ctx.fillStyle = '#d0001c';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('抗議', 0, -45);
      break;
    case 'mic':
      ctx.fillStyle = '#222';
      ctx.fillRect(-2.5, -20, 5, 20);
      ctx.fillStyle = '#aab';
      ctx.beginPath();
      ctx.arc(0, -23, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case 'egg':
      ctx.fillStyle = '#fff6e0';
      ctx.beginPath();
      ctx.ellipse(0, -7, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case 'chair':
      ctx.fillStyle = '#7b4f2a';
      ctx.fillRect(-14, -40, 5, 40);
      ctx.fillRect(9, -22, 5, 22);
      ctx.fillRect(-14, -24, 28, 6);
      ctx.fillRect(-14, -42, 7, 20);
      ctx.strokeRect(-14, -24, 28, 6);
      ctx.strokeRect(-14, -42, 5, 42);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(-12, -26, 24, 3);
      break;
  }
  ctx.restore();
}
