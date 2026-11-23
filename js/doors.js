// 四人大亂鬥：暗門（成對）。走到門前（靠後牆）按「上」，就會從另一扇門出來，可以繞到對手背後偷襲。
// CPU 追的對手在場地另一頭時，也會利用暗門抄近路。
import { ARENA, sign } from './util.js';
import { txt } from './ui.js';

const FY = ARENA.floorY;
// [門A代號, x, 門B代號, x, 顏色]
const PAIRS = [
  ['A', 200, 'B', 1720, '#e8402a'],
  ['C', 640, 'D', 1280, '#2a8ae8'],
];
const RANGE = 44; // 離門多近算「站在門前」
const ZBACK = 36; // 要靠後牆多近（z 越小越靠後）
const DW = 66, DH = 118; // 門的寬、高

export function makeDoors() {
  const doors = [];
  for (const [a, xa, b, xb, color] of PAIRS) {
    const da = { id: a, x: xa, color }, db = { id: b, x: xb, color };
    da.to = db;
    db.to = da;
    doors.push(da, db);
  }
  return doors;
}

const nearDoor = (doors, f) => doors.find((d) => Math.abs(d.x - f.x) < RANGE && f.z <= ARENA.zMin + ZBACK);

export function updateDoors(b, dt) {
  const doors = b.doors;
  for (const d of doors) d.glow = Math.max(0, (d.glow || 0) - dt);
  for (const f of b.fighters) {
    if (f.doorCD > 0) f.doorCD -= dt;
    if (f.dead || f.hp <= 0) continue;
    // CPU：追的人在另一頭很遠時，走去最近的暗門抄近路
    if (f.ai && f.ai.target && !(f.doorCD > 0) && ['idle', 'walk', 'run'].includes(f.state)) {
      const t = f.ai.target;
      if (Math.abs(t.x - f.x) > 620) {
        const d = doors
          .filter((d) => Math.abs(d.to.x - t.x) + 200 < Math.abs(f.x - t.x) && Math.abs(d.x - f.x) < 360)
          .sort((p, q) => Math.abs(p.x - f.x) - Math.abs(q.x - f.x))[0];
        if (d) {
          f.ai.mx = Math.abs(d.x - f.x) > 14 ? sign(d.x - f.x) : 0;
          f.ai.mz = -1;
          f.ai.t = Math.max(f.ai.t, 0.25);
        }
      }
    }
    const d = nearDoor(doors, f);
    if (d) d.glow = 0.3;
    if (!d || f.y > 2 || f.doorCD > 0 || !['idle', 'walk', 'run'].includes(f.state)) continue;
    const c = f.ctrl;
    if (!(c && c.held && c.held('up'))) continue;
    // 穿越！
    const to = d.to;
    b.fx.add({ type: 'ring', x: d.x, z: ARENA.zMin + 10, y: 50, life: 0.35, r: 70, color: d.color });
    f.x = to.x;
    f.z = ARENA.zMin + 16;
    f.vx = f.vz = 0;
    f.facing = to.x < 960 ? 1 : -1;
    f.doorCD = 1.2;
    f.invuln = Math.max(f.invuln || 0, 0.35);
    to.glow = 0.6;
    b.fx.add({ type: 'ring', x: to.x, z: ARENA.zMin + 10, y: 50, life: 0.4, r: 80, color: to.color });
    b.fx.add({ type: 'text', x: to.x, z: f.z, y: 150, text: `暗門 ${d.id} → ${to.id}！`, color: '#ffffff', size: 20, life: 0.8 });
    b.sfx('move');
  }
}

// 門本體（畫在像素層，跟背景一起）
export function drawDoors(p, doors, t) {
  for (const d of doors) {
    const x = d.x - DW / 2, y = FY + ARENA.zMin - DH;
    p.fillStyle = '#2a2230';
    p.fillRect(x - 8, y - 8, DW + 16, DH + 8);
    p.fillStyle = d.color;
    p.fillRect(x - 4, y - 4, DW + 8, DH + 4);
    // 門板＋旋渦
    p.fillStyle = '#120c1a';
    p.fillRect(x, y, DW, DH);
    p.save();
    p.globalCompositeOperation = 'lighter';
    const a = 0.35 + (d.glow > 0 ? 0.45 : 0) + Math.sin(t * 4 + d.x) * 0.1;
    for (let i = 0; i < 3; i++) {
      p.strokeStyle = d.color;
      p.globalAlpha = a * (1 - i * 0.25);
      p.lineWidth = 4;
      p.beginPath();
      p.ellipse(d.x, y + DH / 2, 10 + i * 9 + ((t * 30) % 9), 20 + i * 14, 0, 0, Math.PI * 2);
      p.stroke();
    }
    p.restore();
    // 地上的提示圈
    p.strokeStyle = d.color;
    p.globalAlpha = 0.6;
    p.lineWidth = 3;
    p.beginPath();
    p.ellipse(d.x, FY + ARENA.zMin + 14, 44, 10, 0, 0, Math.PI * 2);
    p.stroke();
    p.globalAlpha = 1;
  }
}

// 門上的說明文字（畫在清楚的主畫面層）
export function drawDoorLabels(ctx, doors, t) {
  for (const d of doors) {
    const y = FY + ARENA.zMin - DH - 14;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(d.x - 62, y - 44, 124, 48);
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(d.x - 62, y - 44, 124, 48);
    txt(ctx, `暗門 ${d.id} ⇄ 通往 ${d.to.id}`, d.x, y - 30, { size: 14, weight: 900, color: '#ffffff', align: 'center' });
    txt(ctx, '靠牆按「上」穿越', d.x, y - 11, { size: 11, weight: 900, color: d.glow > 0 && Math.floor(t * 6) % 2 ? '#ffe14a' : '#cfd3e6', align: 'center' });
  }
}
