// 劇情模式第一關「議員選舉」的程式繪圖背景（之後可換成 Gemini 圖）
// 世界座標：畫面 y = 322 + z - 高度。一樓街道 z 0～186，二樓陽台 z -210～-130，頂樓 z -470～-390
import { FONT_TC } from './util.js';
import { ASSETS } from './assets.js';

const FY = 322;
const hash = (i) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function sky(ctx, x0, x1, cam) {
  const g = ctx.createLinearGradient(0, -700, 0, 330);
  g.addColorStop(0, '#120c33');
  g.addColorStop(0.55, '#3b2466');
  g.addColorStop(0.85, '#b4507a');
  g.addColorStop(1, '#f08a4b');
  ctx.fillStyle = g;
  ctx.fillRect(x0, -800, x1 - x0, 1200);
  // 遠方城市剪影（視差）
  const off = cam.x * 0.55;
  const i0 = Math.floor((x0 - off) / 120) - 1, i1 = Math.ceil((x1 - off) / 120) + 1;
  for (let i = i0; i <= i1; i++) {
    const h = 120 + hash(i) * 260, bx = off + i * 120;
    ctx.fillStyle = '#2a1f4e';
    ctx.fillRect(bx, FY - 40 - h, 112, h + 60);
    ctx.fillStyle = 'rgba(255,214,120,0.55)';
    for (let wy = FY - 30 - h; wy < FY - 40; wy += 22) for (let wx = 8; wx < 104; wx += 18) if (hash(i * 31 + wx + wy) > 0.62) ctx.fillRect(bx + wx, wy, 7, 9);
  }
}

const SIGNS = ['金紙香舖', '檳榔', '當舖', '麵店', '選舉服務處', '彩券行', '機車行', '自助餐', '五金', '手搖飲', '宮廟用品', '卡拉OK'];
const WALLS = ['#d9c7a6', '#c9d3c2', '#e0b8a0', '#b8c4d4', '#d4c0d0', '#c8b890'];

// 騎樓街屋
function shophouses(ctx, x0, x1, a, b, t) {
  const W = 240;
  for (let i = Math.floor(Math.max(a, x0) / W); i * W < Math.min(b, x1); i++) {
    const bx = i * W, top = -60 - Math.floor(hash(i) * 3) * 60;
    ctx.fillStyle = WALLS[i % WALLS.length];
    ctx.fillRect(bx, top, W - 4, FY - top);
    // 窗戶＋鐵窗
    for (let wy = top + 30; wy < 200; wy += 80) {
      for (const wx of [30, 140]) {
        ctx.fillStyle = '#3a4660';
        ctx.fillRect(bx + wx, wy, 70, 46);
        ctx.strokeStyle = '#8a8f98';
        ctx.lineWidth = 2;
        for (let k = 0; k <= 70; k += 10) {
          ctx.beginPath();
          ctx.moveTo(bx + wx + k, wy - 4);
          ctx.lineTo(bx + wx + k, wy + 50);
          ctx.stroke();
        }
        if (hash(i * 7 + wy) > 0.5) {
          ctx.fillStyle = 'rgba(255,220,140,0.5)';
          ctx.fillRect(bx + wx + 2, wy + 2, 66, 42);
        }
      }
    }
    // 騎樓（一樓走廊）
    ctx.fillStyle = 'rgba(30,22,30,0.55)';
    ctx.fillRect(bx, 228, W - 4, FY - 228);
    ctx.fillStyle = WALLS[(i + 2) % WALLS.length];
    ctx.fillRect(bx, 222, W - 4, 10);
    ctx.fillRect(bx, 222, 16, FY - 222);
    // 直式招牌
    const s = SIGNS[i % SIGNS.length];
    const sc = ['#d8202a', '#f4c20d', '#2a64c8', '#18a058'][i % 4];
    ctx.fillStyle = sc;
    ctx.fillRect(bx + W - 52, top + 40, 34, Math.min(170, s.length * 30 + 16));
    ctx.fillStyle = sc === '#f4c20d' ? '#c81a20' : '#fff';
    ctx.font = `900 22px ${FONT_TC}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    [...s].slice(0, 5).forEach((ch, k) => ctx.fillText(ch, bx + W - 35, top + 62 + k * 30));
    // 選舉旗
    if (i % 3 === 1) {
      ctx.fillStyle = '#ff5a3c';
      ctx.fillRect(bx + 60, 160, 42, 58);
      ctx.fillStyle = '#fff';
      ctx.font = `900 13px ${FONT_TC}`;
      ctx.fillText('凍蒜', bx + 81, 178);
      ctx.fillText('拜託', bx + 81, 198);
    }
    // 紅燈籠
    const sw = Math.sin(t * 2 + i) * 2;
    for (const lx of [60, 170]) {
      ctx.fillStyle = '#e8262b';
      ctx.beginPath();
      ctx.ellipse(bx + lx + sw, 246, 11, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(bx + lx - 4 + sw, 230, 8, 3);
    }
  }
}

function street(ctx, x0, x1, a, b, tiles = false) {
  const l = Math.max(a, x0), r = Math.min(b, x1);
  if (r <= l) return;
  if (tiles) {
    // 廟埕石板
    ctx.fillStyle = '#b8866a';
    ctx.fillRect(l, FY, r - l, 186);
    ctx.strokeStyle = 'rgba(80,40,20,0.35)';
    ctx.lineWidth = 2;
    for (let y = FY + 30; y < FY + 186; y += 30) {
      ctx.beginPath();
      ctx.moveTo(l, y);
      ctx.lineTo(r, y);
      ctx.stroke();
    }
    for (let x = Math.ceil(l / 60) * 60; x < r; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, FY);
      ctx.lineTo(x - 40, FY + 186);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#cfc6b0';
    ctx.fillRect(l, FY, r - l, 30);
    ctx.fillStyle = '#4a4a52';
    ctx.fillRect(l, FY + 30, r - l, 156);
    ctx.fillStyle = '#e8e0c8';
    for (let x = Math.ceil(l / 120) * 120; x < r; x += 120) ctx.fillRect(x, FY + 104, 60, 6);
    ctx.fillStyle = '#d8202a';
    ctx.fillRect(l, FY + 28, r - l, 4);
  }
  ctx.fillStyle = '#1e1a22';
  ctx.fillRect(l, FY + 186, r - l, 300);
}

// 公寓（二樓陽台走廊＋頂樓）
function apartment(ctx, x0, x1, A) {
  const a = A.x0, b = A.x1;
  if (b < x0 || a > x1) return;
  // 公寓本體只到頂樓地板（上面是天空）
  const roof = FY + A.roofZ;
  ctx.fillStyle = '#a9a296';
  ctx.fillRect(a, roof, b - a, FY - roof);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let y = roof; y < FY; y += 12) ctx.fillRect(a, y, b - a, 1);
  // 一樓市場攤位
  for (let x = a + 20; x < b - 60; x += 150) {
    ctx.fillStyle = ['#d8202a', '#2a64c8', '#18a058', '#f4c20d'][Math.floor(x / 150) % 4];
    ctx.beginPath();
    ctx.moveTo(x, 260);
    ctx.lineTo(x + 130, 260);
    ctx.lineTo(x + 115, 236);
    ctx.lineTo(x + 15, 236);
    ctx.fill();
    ctx.fillStyle = '#6a4a2a';
    ctx.fillRect(x + 14, 290, 102, 30);
  }
  // 二樓：走廊後牆的門窗；三樓以上的窗戶
  for (let x = a + 40; x < b - 80; x += 180) {
    ctx.fillStyle = '#5a4030';
    ctx.fillRect(x, 20, 54, 92);
    ctx.fillStyle = '#3a4660';
    ctx.fillRect(x + 80, 36, 70, 46);
    for (let y = roof + 110; y < -10; y += 90) ctx.fillRect(x + 20, y, 70, 46);
  }
  // 頂樓加蓋的鐵皮屋與水塔
  ctx.fillStyle = '#8b95a0';
  ctx.fillRect(a + 120, -300, 360, 152);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let x = a + 120; x < a + 480; x += 12) ctx.fillRect(x, -300, 4, 152);
  ctx.fillStyle = '#2a64c8';
  ctx.beginPath();
  ctx.ellipse(b - 200, -200, 46, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#555';
  ctx.fillRect(b - 240, -152, 6, 40);
  ctx.fillRect(b - 166, -152, 6, 40);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  for (const ax of [a + 560, a + 820]) {
    ctx.beginPath();
    ctx.moveTo(ax, -148);
    ctx.lineTo(ax, -260);
    ctx.moveTo(ax - 24, -240);
    ctx.lineTo(ax + 24, -240);
    ctx.moveTo(ax - 16, -222);
    ctx.lineTo(ax + 16, -222);
    ctx.stroke();
  }
}

// 樓層地板（上面兩層要畫出樓板厚度與欄杆）
function slab(ctx, x0, x1, F, color) {
  const l = Math.max(F.xMin - 30, x0), r = Math.min(F.xMax + 30, x1);
  if (r <= l) return;
  const top = FY + F.zMin, bot = FY + F.zMax;
  ctx.fillStyle = color;
  ctx.fillRect(l, top, r - l, bot - top);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let x = Math.ceil(l / 40) * 40; x < r; x += 40) ctx.fillRect(x, top, 2, bot - top);
  ctx.fillStyle = '#6a645a';
  ctx.fillRect(l, bot, r - l, 26);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(l, bot + 26, r - l, 10);
}
function railing(ctx, x0, x1, F) {
  const l = Math.max(F.xMin - 30, x0), r = Math.min(F.xMax + 30, x1);
  if (r <= l) return;
  const bot = FY + F.zMax;
  ctx.strokeStyle = 'rgba(60,60,70,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(l, bot - 2);
  ctx.lineTo(r, bot - 2);
  ctx.stroke();
}

// 斜坡（樓梯式）：從下層後緣 (xb, yb) 斜斜通到上層前緣 (xt, yt)
export function ramp(ctx, xb, yb, xt, yt) {
  const w = 46;
  ctx.fillStyle = '#9a948a';
  ctx.beginPath();
  ctx.moveTo(xb - w, yb + 16);
  ctx.lineTo(xb + w, yb + 16);
  ctx.lineTo(xt + w, yt);
  ctx.lineTo(xt - w, yt);
  ctx.closePath();
  ctx.fill();
  // 斜坡側面（厚度）
  ctx.fillStyle = '#6a645a';
  const side = Math.sign(xt - xb) > 0 ? 1 : -1;
  ctx.beginPath();
  ctx.moveTo(xb - side * w, yb + 16);
  ctx.lineTo(xt - side * w, yt);
  ctx.lineTo(xt - side * w, yt + 22);
  ctx.lineTo(xb - side * w, yb + 30);
  ctx.closePath();
  ctx.fill();
  // 階梯線
  ctx.strokeStyle = 'rgba(60,55,50,0.6)';
  ctx.lineWidth = 2;
  const n = Math.max(6, Math.round(Math.abs(yb - yt) / 14));
  for (let i = 1; i < n; i++) {
    const k = i / n, x = xb + (xt - xb) * k, y = yb + 16 + (yt - yb - 16) * k;
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  }
  // 扶手
  ctx.strokeStyle = '#d8d8d8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xb + side * w, yb - 22);
  ctx.lineTo(xt + side * w, yt - 38);
  ctx.stroke();
  for (let i = 0; i <= 4; i++) {
    const k = i / 4, x = xb + side * w + (xt - xb) * k, y = yb + 16 + (yt - yb - 16) * k;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 38 + 0 * k);
    ctx.stroke();
  }
}

// 鷹架樓梯（舊版，保留備用）
export function ladder(ctx, x, yTop, yBot, hi = false) {
  ctx.strokeStyle = hi ? '#ffe14a' : '#c9c9c9';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 16, yTop);
  ctx.lineTo(x - 16, yBot);
  ctx.moveTo(x + 16, yTop);
  ctx.lineTo(x + 16, yBot);
  ctx.stroke();
  ctx.lineWidth = 3;
  for (let y = yTop + 10; y < yBot; y += 18) {
    ctx.beginPath();
    ctx.moveTo(x - 16, y);
    ctx.lineTo(x + 16, y);
    ctx.stroke();
  }
}

// 宮廟
function temple(ctx, x0, x1, tx, t) {
  if (tx + 900 < x0 || tx - 200 > x1) return;
  ctx.fillStyle = '#9a1a1a';
  ctx.fillRect(tx, 60, 760, FY - 60);
  ctx.fillStyle = '#c8a030';
  ctx.fillRect(tx - 20, 40, 800, 24);
  // 屋頂＋燕尾脊
  ctx.fillStyle = '#1f6a4a';
  ctx.beginPath();
  ctx.moveTo(tx - 60, 44);
  ctx.lineTo(tx + 380, -40);
  ctx.lineTo(tx + 820, 44);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f2c94c';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(tx - 80, 30);
  ctx.quadraticCurveTo(tx + 380, -60, tx + 840, 30);
  ctx.stroke();
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(tx - 80, 30);
  ctx.lineTo(tx - 110, 0);
  ctx.moveTo(tx + 840, 30);
  ctx.lineTo(tx + 870, 0);
  ctx.stroke();
  // 門與龍柱
  ctx.fillStyle = '#5a0e0e';
  ctx.fillRect(tx + 300, 160, 160, FY - 160);
  ctx.fillStyle = '#c8a030';
  for (const dx of [0, 80]) ctx.fillRect(tx + 300 + dx + 36, 200, 8, 8);
  for (const px of [tx + 220, tx + 520]) {
    ctx.fillStyle = '#b0a080';
    ctx.fillRect(px, 100, 26, FY - 100);
    ctx.strokeStyle = '#4a8a6a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let y = 100; y < FY; y += 6) ctx.lineTo(px + 13 + Math.sin(y / 14) * 10, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(tx + 320, 90, 120, 40);
  ctx.fillStyle = '#9a1a1a';
  ctx.font = `900 24px ${FONT_TC}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('福德宮', tx + 380, 111);
  // 燈籠串
  for (let k = 0; k < 14; k++) {
    const lx = tx - 300 + k * 90, ly = 120 + Math.sin(k * 0.8) * 14 + Math.sin(t * 2 + k) * 2;
    ctx.fillStyle = '#e8262b';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // 香爐
  ctx.fillStyle = '#8a6a2a';
  ctx.fillRect(tx + 340, 270, 80, 46);
  ctx.fillRect(tx + 330, 262, 100, 10);
  ctx.fillStyle = 'rgba(220,220,220,0.35)';
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.arc(tx + 370 + Math.sin(t * 1.5 + k) * 10, 250 - k * 26 - ((t * 20) % 26), 10 + k * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 封路障礙（一樓過不去，逼玩家爬上鷹架）
function roadblock(ctx, x) {
  ctx.fillStyle = '#6a4a2a';
  ctx.fillRect(x - 10, 250, 90, 260);
  ctx.fillStyle = '#f4c20d';
  ctx.fillRect(x - 60, 380, 170, 60);
  ctx.fillStyle = '#222';
  ctx.font = `900 18px ${FONT_TC}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('違停＋攤販', x + 25, 398);
  ctx.fillText('過不去！', x + 25, 422);
  ctx.fillStyle = '#ff7a1a';
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.moveTo(x - 50 + k * 40, 508);
    ctx.lineTo(x - 36 + k * 40, 470);
    ctx.lineTo(x - 22 + k * 40, 508);
    ctx.fill();
  }
}

// 選務封鎖線（得票不夠就過不去）
export function gateLine(ctx, x, open, t) {
  if (open) return;
  for (let k = 0; k < 6; k++) {
    ctx.fillStyle = k % 2 ? '#111' : '#f4c20d';
    ctx.fillRect(x - 6, FY + k * 31, 12, 31);
  }
  ctx.fillStyle = '#f4c20d';
  ctx.fillRect(x - 70, FY - 70, 140, 52);
  ctx.fillStyle = '#111';
  ctx.font = `900 15px ${FONT_TC}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('選務封鎖線', x, FY - 54);
  ctx.fillText('得票不足禁止通行', x, FY - 32);
}

// ───── Gemini 背景圖（有圖就用圖，沒有就用上面程式畫的） ─────
// s1_sky：天空＋遠方城市（視差捲動，左右重複）
// s1_street：騎樓街屋立面（左右重複，底部＝地面）
// s1_apartment：老公寓立面＋頂樓加蓋（底部＝地面，樓頂高度對齊頂樓地板）
// s1_temple：宮廟正面（底部＝地面）
function imgSky(ctx, x0, x1, cam, img) {
  const H = 1100, W = (img.width * H) / img.height, off = cam.x * 0.55;
  for (let i = Math.floor((x0 - off) / W) - 1; i * W + off < x1; i++) ctx.drawImage(img, off + i * W, FY + 40 - H, W + 1, H);
}
function imgStrip(ctx, x0, x1, a, b, img, h) {
  const W = (img.width * h) / img.height;
  for (let x = a; x < b; x += W) {
    if (x + W < x0 || x > x1) continue;
    const w = Math.min(W, b - x);
    ctx.drawImage(img, 0, 0, (img.width * w) / W, img.height, x, FY - h, w, h);
  }
}
function imgBox(ctx, x0, x1, img, x, w, top) {
  if (x + w < x0 || x > x1) return;
  ctx.drawImage(img, x, top, w, FY - top);
}

export function drawStage1(ctx, t, x0, x1, L, cam, gateOpen) {
  const S = ASSETS.scenery;
  if (S.s1_sky) imgSky(ctx, x0, x1, cam, S.s1_sky);
  else sky(ctx, x0, x1, cam);
  if (S.s1_street) {
    imgStrip(ctx, x0, x1, 0, L.apt.x0 + 20, S.s1_street, 470);
    imgStrip(ctx, x0, x1, L.apt.x1 - 10, L.temple.x - 120, S.s1_street, 470);
  } else {
    shophouses(ctx, x0, x1, 0, L.apt.x0 + 20, t);
    shophouses(ctx, x0, x1, L.apt.x1 - 10, L.temple.x - 120, t);
  }
  // 公寓：圖的上緣 = 頂樓加蓋的屋頂（頂樓地板往上 150）
  if (S.s1_apartment) imgBox(ctx, x0, x1, S.s1_apartment, L.apt.x0, L.apt.x1 - L.apt.x0, FY + L.apt.roofZ - 150);
  else apartment(ctx, x0, x1, L.apt);
  if (S.s1_temple) imgBox(ctx, x0, x1, S.s1_temple, L.temple.x - 160, 1080, FY - 470);
  else temple(ctx, x0, x1, L.temple.x, t);
  street(ctx, x0, x1, 0, L.floors[0].xMax + 60);
  street(ctx, x0, x1, L.floors[0].xMax + 60, L.floors[3].xMin, false);
  street(ctx, x0, x1, L.floors[3].xMin, L.worldW, true);
  slab(ctx, x0, x1, L.floors[1], '#8c867c');
  slab(ctx, x0, x1, L.floors[2], '#7d776d');
  railing(ctx, x0, x1, L.floors[1]);
  for (const r of L.ramps) ramp(ctx, r.xb, FY + L.floors[r.bot].zMin, r.xt, FY + L.floors[r.top].zMax);
  if (x0 < L.floors[0].xMax + 200 && x1 > L.floors[0].xMax - 200) roadblock(ctx, L.floors[0].xMax + 40);
  gateLine(ctx, L.gateX, gateOpen, t);
}
