// 三個對戰場景（程式繪製的暫時背景；有圖檔時改用圖檔）
import { FONT_TC, FONT_PX, WORLD_W } from './util.js';
import { ASSETS } from './assets.js';

function lin(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
}
function glow(ctx, x, y, r, color, a = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}
function label(ctx, s, x, y, size, color, stroke = '#000', font = FONT_TC) {
  ctx.font = `900 ${size}px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (stroke) {
    ctx.lineWidth = size / 6;
    ctx.strokeStyle = stroke;
    ctx.lineJoin = 'round';
    ctx.strokeText(s, x, y);
  }
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
}
const FLOOR_TOP = 292;

// ───────────── 立法院議場 ─────────────
function legisStatic(ctx) {
  ctx.fillStyle = lin(ctx, 0, FLOOR_TOP, ['#2a1a10', '#5b3a22', '#4a2e1a']);
  ctx.fillRect(0, 0, 960, FLOOR_TOP);
  // 旁聽席
  ctx.fillStyle = '#2a1c14';
  ctx.fillRect(0, 30, 960, 70);
  ctx.fillStyle = '#7a5530';
  ctx.fillRect(0, 96, 960, 8);
  for (let i = 0; i < 48; i++) {
    const x = 10 + i * 20 + (i % 2) * 4;
    ctx.fillStyle = ['#1b1b22', '#2a2230', '#202a2a'][i % 3];
    ctx.beginPath();
    ctx.arc(x, 72, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 9, 78, 18, 18);
  }
  // 木牆直條
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 3;
  for (let x = 0; x < 960; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 104);
    ctx.lineTo(x, FLOOR_TOP);
    ctx.stroke();
  }
  // 主席台
  ctx.fillStyle = '#6b4424';
  ctx.fillRect(320, 150, 320, 110);
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(310, 140, 340, 16);
  ctx.fillStyle = '#4a2c14';
  for (let i = 0; i < 6; i++) ctx.fillRect(335 + i * 52, 170, 36, 76);
  ctx.fillStyle = '#c9a227';
  ctx.fillRect(440, 120, 80, 22);
  label(ctx, '議場', 480, 131, 18, '#3a2410', null);
  // 表決看板
  for (const [x, a, bb] of [[40, 52, 51], [700, 51, 52]]) {
    ctx.fillStyle = '#111';
    ctx.fillRect(x, 128, 220, 110);
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, 128, 220, 110);
    label(ctx, '表決結果', x + 110, 150, 20, '#ffd84a', null);
    label(ctx, `贊成 ${a}`, x + 60, 195, 24, '#59ff6a', null);
    label(ctx, `反對 ${bb}`, x + 160, 195, 24, '#ff5a5a', null);
    label(ctx, '？？？', x + 110, 224, 16, '#aaa', null);
  }
  // 議員座位
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < 14; i++) {
      const x = 14 + i * 68 + r * 34, y = 248 + r * 20;
      ctx.fillStyle = '#3a2412';
      ctx.fillRect(x, y, 56, 16);
      ctx.fillStyle = '#7b4f2a';
      ctx.fillRect(x, y, 56, 5);
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 40, y);
      ctx.lineTo(x + 46, y - 14);
      ctx.stroke();
      ctx.fillStyle = '#c33';
      ctx.fillRect(x + 44, y - 17, 5, 4);
    }
  }
  // 地毯
  ctx.fillStyle = lin(ctx, FLOOR_TOP, 540, ['#1f4a58', '#2b6474', '#1d4350']);
  ctx.fillRect(0, FLOOR_TOP, 960, 248);
  ctx.strokeStyle = 'rgba(255,215,120,0.18)';
  ctx.lineWidth = 2;
  for (let i = -10; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(480 + i * 70, FLOOR_TOP);
    ctx.lineTo(480 + i * 140, 540);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, FLOOR_TOP, 960, 10);
  // 散落文件
  const papers = [[120, 360, 0.3], [300, 470, -0.5], [620, 400, 0.8], [800, 500, -0.2], [520, 330, 0.1], [880, 350, 1.2]];
  for (const [x, y, a] of papers) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = '#f2f0e6';
    ctx.fillRect(-14, -9, 28, 18);
    ctx.fillStyle = '#aab';
    ctx.fillRect(-10, -5, 18, 2);
    ctx.fillRect(-10, 0, 14, 2);
    ctx.restore();
  }
}
function legisAnim(ctx, t) {
  // 記者閃光
  const k = Math.floor(t * 6);
  for (let i = 0; i < 3; i++) {
    const s = Math.sin(k * 12.9898 + i * 78.233) * 43758.5453;
    const r = s - Math.floor(s);
    if (r > 0.82) glow(ctx, (r * 7919 * (i + 1)) % 960, 70, 26, 'rgba(255,255,255,0.9)');
  }
}

// ───────────── 造勢晚會 ─────────────
function rallyStatic(ctx) {
  ctx.fillStyle = lin(ctx, 0, FLOOR_TOP, ['#07051a', '#1d0c36', '#3a1236']);
  ctx.fillRect(0, 0, 960, FLOOR_TOP);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillRect((i * 137) % 960, (i * 53) % 120, 2, 2);
  }
  // LED 大螢幕
  ctx.fillStyle = '#120408';
  ctx.fillRect(250, 66, 460, 176);
  ctx.fillStyle = lin(ctx, 72, 236, ['#a3001b', '#ff2a3d', '#7a0014']);
  ctx.fillRect(258, 74, 444, 160);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let y = 74; y < 234; y += 4) ctx.fillRect(258, y, 444, 1.5);
  for (let x = 258; x < 702; x += 4) ctx.fillRect(x, 74, 1.5, 160);
  label(ctx, '凍蒜！', 480, 140, 74, '#fff6c8', '#5a0010');
  label(ctx, '全場最高潮', 480, 206, 26, '#ffd84a', '#5a0010');
  // 桁架
  ctx.strokeStyle = '#8f96a3';
  ctx.lineWidth = 6;
  ctx.strokeRect(220, 30, 520, 240);
  ctx.lineWidth = 2;
  for (let x = 220; x < 740; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 30);
    ctx.lineTo(x + 20, 46);
    ctx.lineTo(x + 40, 30);
    ctx.stroke();
  }
  for (const x of [220, 740]) {
    for (let y = 30; y < 270; y += 20) {
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y + 20);
      ctx.stroke();
    }
  }
  // 喇叭
  for (const x of [130, 760]) {
    ctx.fillStyle = '#16161c';
    ctx.fillRect(x, 120, 70, 150);
    ctx.fillStyle = '#2c2c36';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + 35, 150 + i * 45, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 舞台地板
  ctx.fillStyle = lin(ctx, FLOOR_TOP, 540, ['#2a1a20', '#3a2028', '#1a0e14']);
  ctx.fillRect(0, FLOOR_TOP, 960, 248);
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 2;
  for (let y = FLOOR_TOP + 20; y < 540; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 8; i++) ctx.fillRect(60 + i * 120, FLOOR_TOP + 10, 50, 230);
  ctx.fillStyle = '#ffd84a';
  ctx.fillRect(0, FLOOR_TOP - 4, 960, 4);
}
function rallyAnim(ctx, t) {
  // 群眾與旗幟
  const flags = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#ffffff', '#fb8c00', '#8e24aa'];
  for (let i = 0; i < 40; i++) {
    const x = i * 24 + 6;
    const bob = Math.sin(t * 6 + i * 1.7) * 4;
    ctx.fillStyle = '#0c0814';
    ctx.beginPath();
    ctx.arc(x, 268 + bob, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 11, 274 + bob, 22, 20);
    if (i % 3 === 0) {
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 6, 270 + bob);
      ctx.lineTo(x + 6, 226 + bob);
      ctx.stroke();
      ctx.fillStyle = flags[(i / 3) % flags.length | 0];
      const w = Math.sin(t * 8 + i) * 4;
      ctx.beginPath();
      ctx.moveTo(x + 6, 226 + bob);
      ctx.lineTo(x + 30, 230 + bob + w);
      ctx.lineTo(x + 6, 242 + bob);
      ctx.fill();
    }
  }
  // 舞台燈
  const cols = ['#ff3355', '#ffd84a', '#33aaff', '#ff3355', '#33ff99', '#ffd84a', '#ff3355', '#33aaff'];
  for (let i = 0; i < 8; i++) {
    const x = 250 + i * 66;
    const on = Math.sin(t * 5 + i) > -0.3;
    ctx.fillStyle = on ? cols[i] : '#333';
    ctx.beginPath();
    ctx.arc(x, 36, 9, 0, Math.PI * 2);
    ctx.fill();
    if (on) glow(ctx, x, 36, 36, cols[i], 0.6);
  }
  // 探照燈
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const [x0, ph, c] of [[200, 0, 'rgba(255,60,90,0.18)'], [760, 2, 'rgba(80,160,255,0.18)']]) {
    const a = Math.sin(t * 0.9 + ph) * 0.5;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x0, 540);
    ctx.lineTo(x0 + Math.sin(a) * 900 - 60, -20);
    ctx.lineTo(x0 + Math.sin(a) * 900 + 60, -20);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ───────────── 政論節目攝影棚 ─────────────
function studioStatic(ctx) {
  ctx.fillStyle = lin(ctx, 0, FLOOR_TOP, ['#050a24', '#0d1a4a', '#0a1236']);
  ctx.fillRect(0, 0, 960, FLOOR_TOP);
  ctx.strokeStyle = 'rgba(80,140,255,0.18)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 960; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, FLOOR_TOP);
    ctx.stroke();
  }
  // 大螢幕
  ctx.fillStyle = '#02040e';
  ctx.fillRect(260, 40, 440, 190);
  ctx.fillStyle = lin(ctx, 48, 222, ['#1a3a9a', '#2c62d8', '#0f2a78']);
  ctx.fillRect(268, 48, 424, 174);
  label(ctx, '政論大爆料', 480, 120, 56, '#ffffff', '#0a1a50');
  label(ctx, '今晚誰會被打倒？', 480, 182, 26, '#ffd84a', '#0a1a50');
  ctx.fillStyle = '#e0001b';
  ctx.fillRect(284, 58, 72, 26);
  label(ctx, 'LIVE', 320, 72, 14, '#fff', null, FONT_PX);
  // 側邊小螢幕
  for (const x of [60, 780]) {
    ctx.fillStyle = '#02040e';
    ctx.fillRect(x, 70, 120, 150);
    ctx.fillStyle = '#163070';
    ctx.fillRect(x + 6, 76, 108, 138);
    label(ctx, x < 480 ? '民調' : '爆料', x + 60, 100, 22, '#ffd84a', null);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = ['#ff5a5a', '#5aa0ff', '#5aff8a', '#ffd84a'][i];
      ctx.fillRect(x + 20 + i * 22, 200 - (30 + ((i * 37) % 60)), 14, 30 + ((i * 37) % 60));
    }
  }
  // 主持台
  ctx.fillStyle = '#0a1a50';
  ctx.fillRect(340, 236, 280, 50);
  ctx.fillStyle = '#2c62d8';
  ctx.fillRect(340, 236, 280, 8);
  label(ctx, '主持人', 480, 266, 18, '#9fc0ff', null);
  // 地板
  ctx.fillStyle = lin(ctx, FLOOR_TOP, 540, ['#0b1440', '#13205a', '#070c2a']);
  ctx.fillRect(0, FLOOR_TOP, 960, 248);
  ctx.fillStyle = 'rgba(120,170,255,0.12)';
  for (let i = 0; i < 6; i++) ctx.fillRect(0, FLOOR_TOP + 30 + i * 40, 960, 3);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 3;
  for (const [x, y] of [[200, 420], [480, 380], [760, 450]]) {
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
  }
}
const TICKER = '【快訊】議場又打起來了！　　【獨家】光頭反光疑似造成全棚停電　　【爆料】有人在後台吃香蕉　　【最新】直播主闖入攝影棚　　【民調】發大財支持度上升　　';
function studioAnim(ctx, t) {
  ctx.fillStyle = '#c4001a';
  ctx.fillRect(0, 252, 960, 30);
  ctx.fillStyle = '#ffd84a';
  ctx.fillRect(0, 252, 110, 30);
  label(ctx, '跑馬燈', 55, 267, 18, '#7a0010', null);
  ctx.save();
  ctx.beginPath();
  ctx.rect(110, 252, 850, 30);
  ctx.clip();
  ctx.font = `900 18px ${FONT_TC}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  const w = ctx.measureText(TICKER).width;
  const off = (t * 90) % w;
  ctx.fillText(TICKER, 960 - off, 268);
  ctx.fillText(TICKER, 960 - off + w, 268);
  ctx.fillText(TICKER, 960 - off - w, 268);
  ctx.restore();
  const a = 0.25 + Math.sin(t * 2) * 0.1;
  glow(ctx, 160, 0, 220, 'rgba(120,170,255,0.6)', a);
  glow(ctx, 800, 0, 220, 'rgba(120,170,255,0.6)', a);
}

function drawFence(ctx, x) {
  ctx.fillStyle = '#3a3a44';
  ctx.fillRect(x - 6, 250, 12, 290);
  ctx.fillStyle = '#ffd84a';
  for (let y = 260; y < 540; y += 40) ctx.fillRect(x - 6, y, 12, 18);
  ctx.strokeStyle = 'rgba(255,216,74,0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 6, 250, 12, 290);
}

function makeStage(id, name, staticFn, animFn) {
  let cache = null;
  const st = {
    id,
    name,
    getCache() {
      if (!cache) {
        cache = document.createElement('canvas');
        cache.width = 480;
        cache.height = 270;
        const c = cache.getContext('2d');
        c.scale(0.5, 0.5);
        staticFn(c);
      }
      return cache;
    },
    // 畫出世界座標 x0~x1 範圍的背景（每 960 一段；場地外畫圍欄與暗區）
    draw(ctx, t, x0 = 0, x1 = 960) {
      const img = ASSETS.stages[id];
      const n = Math.round(WORLD_W / 960);
      for (let k = Math.floor(x0 / 960); k <= Math.floor((x1 - 1) / 960); k++) {
        const ox = k * 960;
        if (k < 0 || k >= n) {
          ctx.fillStyle = '#07060c';
          ctx.fillRect(ox, 0, 960, 540);
          ctx.fillStyle = '#121018';
          ctx.fillRect(ox, 292, 960, 248);
          continue;
        }
        ctx.save();
        ctx.translate(ox, 0);
        if (img) {
          if (k % 2) {
            // 圖檔：奇數段左右翻轉，接縫比較自然
            ctx.translate(960, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(img, 0, 0, 960, 540);
        } else {
          ctx.drawImage(st.getCache(), 0, 0, 960, 540);
          animFn(ctx, t + k * 1.7);
        }
        ctx.restore();
      }
      // 場地邊界的圍欄
      if (x1 > 0 && x0 < 0) drawFence(ctx, 0);
      if (x1 > WORLD_W && x0 < WORLD_W) drawFence(ctx, WORLD_W);
    },
    thumb() {
      return ASSETS.stages[id] || st.getCache();
    },
  };
  return st;
}

export const STAGES = [
  makeStage('legislature', '立法院議場', legisStatic, legisAnim),
  makeStage('rally', '造勢晚會現場', rallyStatic, rallyAnim),
  makeStage('studio', '政論節目攝影棚', studioStatic, studioAnim),
];
export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s]));
