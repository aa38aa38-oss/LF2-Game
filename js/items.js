// 場上道具：補血品（走過去自動吃）、武器（主要角色走過去就直接拿起來）
// food：撿到立即使用；light：輕武器（拿在手上揮、跳躍中按攻擊丟出；dur＝能打中幾下，用完會爆掉）；
// throw：只能丟（雞蛋）；heavy：重物（舉在頭上，按攻擊丟出）
import { ARENA, rand, pick } from './util.js';
import { ASSETS } from './assets.js';

// 武器有 Gemini 圖（assets/scenery/prop_w_<種類>.webp）就用圖；這是圖在遊戲裡的高度
const PROP_H = { bat: 60, wrench: 46, chain: 56, fchair: 54, sign: 62, flag: 70 };

export const ITEM_DEFS = {
  bento: { name: '便當', type: 'food', hp: 70, cap: 40, weight: 3 },
  boba: { name: '珍奶', type: 'food', hp: 45, cap: 30, mp: 40, weight: 2 },
  // ───── 武器（台灣選舉場合常見的東西）─────
  // 平衡：拿武器每下多 4～9 點傷害（×1.5），小怪一下就倒；約 10 下爆掉 ≒ 清掉 1～1.5 波小怪，
  //       或打掉 Boss 約 1/4 血。太耐打（20 下）會整關都拿著、Boss 太好打；太少（5 下）撿了沒感覺。
  bat: { name: '棒球棒', type: 'light', dur: 10, dmg: 7, reach: 30, throwDmg: 16, weight: 2, weapon: true },
  wrench: { name: '修車扳手', type: 'light', dur: 12, dmg: 5, reach: 14, throwDmg: 18, weight: 2, weapon: true },
  chain: { name: '鐵鍊', type: 'light', dur: 9, dmg: 5, reach: 46, throwDmg: 12, weight: 2, weapon: true },
  fchair: { name: '鐵折疊椅', type: 'light', dur: 7, dmg: 9, reach: 24, throwDmg: 22, weight: 2, weapon: true },
  sign: { name: '抗議標語', type: 'light', dur: 10, dmg: 6, reach: 22, throwDmg: 16, weight: 1, weapon: true },
  mic: { name: '麥克風', type: 'light', dur: 8, dmg: 4, reach: 10, throwDmg: 14, weight: 0 },
  egg: { name: '雞蛋', type: 'throw', throwDmg: 9, weight: 0 },
  chair: { name: '議場椅子', type: 'heavy', throwDmg: 28, weight: 0 },
  flag: { name: '競選旗', type: 'light', dur: 12, dmg: 4, reach: 50, throwDmg: 14, weight: 1, weapon: true },
  broom: { name: '掃把', type: 'light', dur: 10, dmg: 7, reach: 32, throwDmg: 12, weight: 0 },
  slipper: { name: '藍白拖', type: 'throw', throwDmg: 10, weight: 0 },
  stool: { name: '塑膠椅', type: 'heavy', throwDmg: 22, weight: 0 },
  // 劇情模式：紅包（政治獻金）。回很多血，但會被爆料扣票
  redenv: { name: '紅包', type: 'food', hp: 120, cap: 80, votes: -2500, weight: 0 },
};

export function randomItemKind() {
  const list = [];
  for (const [k, d] of Object.entries(ITEM_DEFS)) for (let i = 0; i < d.weight; i++) list.push(k);
  return pick(list);
}

export const WEAPONS = Object.keys(ITEM_DEFS).filter((k) => ITEM_DEFS[k].weapon);

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
  const im = PROP_H[kind] && ASSETS.scenery['prop_w_' + kind];
  if (im) {
    const h = PROP_H[kind], w = (im.width * h) / im.height;
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();
    return;
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#15121a';
  switch (kind) {
    case 'redenv':
      ctx.fillStyle = '#d8202a';
      ctx.fillRect(-11, -26, 22, 26);
      ctx.strokeRect(-11, -26, 22, 26);
      ctx.fillStyle = '#ffd84a';
      ctx.beginPath();
      ctx.arc(0, -15, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d8202a';
      ctx.font = "900 9px 'Noto Sans TC',sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, -15);
      break;
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
    case 'flag':
      ctx.fillStyle = '#c8c8c8';
      ctx.fillRect(-1.5, -62, 3, 62);
      ctx.fillStyle = '#ff5a3c';
      ctx.fillRect(1, -62, 26, 34);
      ctx.strokeRect(1, -62, 26, 34);
      ctx.fillStyle = '#fff';
      ctx.font = "900 11px 'Noto Sans TC',sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('凍', 14, -52);
      ctx.fillText('蒜', 14, -38);
      break;
    case 'broom':
      ctx.fillStyle = '#c89a5a';
      ctx.fillRect(-1.5, -58, 3, 44);
      ctx.fillStyle = '#e2c46a';
      ctx.beginPath();
      ctx.moveTo(-3, -16);
      ctx.lineTo(3, -16);
      ctx.lineTo(10, 0);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 'slipper':
      ctx.fillStyle = '#2a64c8';
      ctx.beginPath();
      ctx.ellipse(0, -4, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillRect(-4, -9, 9, 4);
      break;
    case 'stool':
      ctx.fillStyle = '#d8202a';
      ctx.fillRect(-14, -26, 28, 6);
      ctx.strokeRect(-14, -26, 28, 6);
      ctx.fillRect(-12, -20, 4, 20);
      ctx.fillRect(8, -20, 4, 20);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(-10, -25, 20, 2);
      break;
    case 'bat':
      // 棒球棒（木頭色，握把纏膠帶）
      ctx.fillStyle = '#d8a860';
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(2, 0);
      ctx.lineTo(5.5, -50);
      ctx.quadraticCurveTo(0, -58, -5.5, -50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#222';
      ctx.fillRect(-2.5, -12, 5, 12);
      break;
    case 'wrench':
      // 修車扳手
      ctx.fillStyle = '#b8c0cc';
      ctx.fillRect(-3, -34, 6, 34);
      ctx.strokeRect(-3, -34, 6, 34);
      ctx.beginPath();
      ctx.arc(0, -38, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#15121a';
      ctx.fillRect(-3, -48, 6, 9);
      ctx.fillStyle = '#e8eef6';
      ctx.fillRect(-1, -30, 2, 24);
      break;
    case 'chain': {
      // 鐵鍊（一節一節的環）
      ctx.strokeStyle = '#9aa2ae';
      ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.ellipse(Math.sin(i * 0.9) * 3, -4 - i * 7, i % 2 ? 2.5 : 4, 4.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#222';
      ctx.fillRect(-3, -2, 6, 6);
      break;
    }
    case 'fchair':
      // 鐵折疊椅（摺起來拿）
      ctx.fillStyle = '#7a8696';
      ctx.fillRect(-12, -46, 4, 46);
      ctx.fillRect(8, -46, 4, 46);
      ctx.strokeRect(-12, -46, 4, 46);
      ctx.strokeRect(8, -46, 4, 46);
      ctx.fillStyle = '#4a5a70';
      ctx.fillRect(-12, -46, 24, 14);
      ctx.strokeRect(-12, -46, 24, 14);
      ctx.fillStyle = '#5a6a80';
      ctx.fillRect(-10, -24, 20, 6);
      ctx.strokeRect(-10, -24, 20, 6);
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
