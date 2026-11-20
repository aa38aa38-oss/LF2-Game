// 各角色的「特技」與「大絕」。
// 每招都有：start（開始）、update（每幀）、pose（姿勢）、dur（持續秒數）、ai（電腦使用時機）
import { ARENA, rand, pick, sign } from './util.js';

const afterimage = (b, f, every = 0.04) => {
  f.mv.ai = (f.mv.ai || 0) - 1 / 60;
  if (f.mv.ai <= 0) {
    f.mv.ai = every;
    b.fx.add({ type: 'ghost', fighter: f, snap: snapshot(f), life: 0.25 });
  }
};
const snapshot = (f) => ({ x: f.x, z: f.z, y: f.y, facing: f.facing, state: f.state, stateT: f.stateT, animT: f.animT, char: f.char, spKind: f.spKind, mv: { ...f.mv } });

export const MOVES = {
  // ───────── 衝衝院長 ─────────
  su: {
    special: {
      cost: 25, dur: 0.55, ai: 'close', range: 160,
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.18) {
          f.mv.fired = true;
          b.sfx('flash');
          b.fx.add({ type: 'headflash', x: f.x + f.facing * 4, z: f.z, y: f.y + 108, life: 0.45, dir: f.facing });
          b.areaHit(f, { x0: -10, x1: 175, zr: 46, dmg: 7, dizzy: 1.5, kb: 0 });
        }
      },
      pose: (f, T) => ({ tilt: 0.45, aF: [0.2, 0.9], aB: [0.1, 0.9], lF: [0.4, -0.5], lB: [-0.3, 0], expr: T > 0.18 ? 'shout' : 'normal' }),
    },
    super: {
      dur: 3.2,
      start(f) {
        f.mv.dir = f.facing;
        f.mv.pass = 0;
      },
      update(f, b) {
        const sp = 980;
        f.facing = f.mv.dir;
        f.vx = f.mv.dir * sp;
        const tgt = b.nearestEnemy(f);
        f.vz = tgt ? sign(tgt.z - f.z) * 140 : 0;
        if ((f.x <= ARENA.xMin + 4 && f.mv.dir < 0) || (f.x >= ARENA.xMax - 4 && f.mv.dir > 0)) {
          f.mv.dir *= -1;
          f.hitList.clear();
          f.mv.pass++;
          b.shake(7, 0.18);
          b.sfx('heavy');
          if (f.mv.pass >= 3) f.mv.done = true;
        }
        b.areaHit(f, { x0: -25, x1: 60, zr: 56, dmg: 32, knock: true, kb: 380, launch: 430, unblockable: true });
        afterimage(b, f);
        f.mv.dust = (f.mv.dust || 0) - 1 / 60;
        if (f.mv.dust <= 0) {
          f.mv.dust = 0.05;
          b.fx.add({ type: 'dust', x: f.x - f.facing * 20, z: f.z, y: 0, life: 0.4 });
        }
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 22);
        return { tilt: 0.55, lF: [s * 1.0 + 0.3, -1.3], lB: [-s * 1.0 + 0.3, -1.3], aF: [1.2, 0.4], aB: [1.0, 0.6], expr: 'shout' };
      },
    },
  },

  // ───────── 堅哥 ─────────
  wang: {
    special: {
      cost: 20, dur: 0.5, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.18) {
          f.mv.fired = true;
          b.sfx('sound');
          b.spawnProj({
            owner: f, kind: 'sound', x: f.x + f.facing * 40, z: f.z, y: f.y + 66, vx: f.facing * 470,
            life: 1.3, w: 24, h: 46, dmg: 13, stun: 0.45, kb: 140,
          });
        }
      },
      pose: (f, T) => ({ aF: T > 0.12 ? [1.57, 0] : [2.2, 0.6], prop: 'finger', tilt: 0.15, expr: 'shout', lF: [0.45, -0.4], lB: [-0.4, 0] }),
    },
    super: {
      dur: 2.2,
      update(f, b) {
        f.vx = 0;
        f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.35) {
          f.mv.fired = true;
          b.sfx('wave');
          b.shake(12, 0.7);
          for (const d of [-1, 1]) {
            b.spawnProj({
              owner: f, kind: 'wave', x: f.x + d * 20, z: f.z, y: 0, vx: d * 620, life: 1.6, w: 44, zr: 999,
              h: 140, dmg: 42, knock: true, launch: 480, kb: 320, pierce: true, unblockable: true, dir: d,
            });
          }
          b.fx.add({ type: 'ring', x: f.x, z: f.z, y: 0, life: 0.6, r: 260, color: '#ffd84a' });
        }
      },
      pose: (f, T) =>
        T < 0.35
          ? { aF: [2.8, 0.2], aB: [2.6, 0.2], expr: 'shout', tilt: -0.1 }
          : { aF: [1.0, -0.3], aB: [0.8, -0.3], expr: 'shout', tilt: 0.35, prop: 'finger', lF: [0.6, -0.9], lB: [-0.5, -0.1] },
    },
  },

  // ───────── 發大財議長 ─────────
  han: {
    special: {
      cost: 25, dur: 0.8, ai: 'close', range: 120,
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.38) {
          f.mv.fired = true;
          b.sfx('heavy');
          b.shake(9, 0.25);
          b.fx.add({ type: 'ring', x: f.x + f.facing * 55, z: f.z, y: 0, life: 0.45, r: 110, color: '#ffe08a' });
          b.fx.add({ type: 'text', x: f.x + f.facing * 55, z: f.z, y: 60, text: '咚！', color: '#ffe08a', size: 30, life: 0.7 });
          b.areaHit(f, { x0: -40, x1: 135, zr: 56, dmg: 20, knock: true, launch: 380, kb: 220 });
        }
      },
      pose: (f, T) =>
        T < 0.36
          ? { aF: [3.0, 0.1], aB: [2.8, 0.2], prop: 'gavel', tilt: -0.2, expr: 'shout' }
          : { aF: [1.15, 0], aB: [1.0, 0.3], prop: 'gavel', tilt: 0.4, expr: 'shout', lF: [0.6, -0.8], lB: [-0.5, 0] },
    },
    super: {
      dur: 2.8,
      update(f, b) {
        f.vx = 0;
        f.vz = 0;
        f.mv.c = (f.mv.c || 0) - 1 / 60;
        const foes = b.enemiesOf(f);
        if (f.mv.c <= 0 && f.stateT < 2.3 && foes.length) {
          f.mv.c = 0.045;
          const e = pick(foes);
          b.spawnProj({
            owner: f, kind: 'coin', x: e.x + rand(-45, 45), z: Math.max(ARENA.zMin, Math.min(ARENA.zMax, e.z + rand(-22, 22))),
            y: 520, vy: -250, gravity: 1300, life: 3, w: 18, h: 30, dmg: 5, stun: 0.22, kb: 20, vanishOnGround: true, unblockable: true,
          });
        }
        if (!f.mv.big && f.stateT > 2.3) {
          f.mv.big = true;
          for (const e of foes) {
            b.spawnProj({
              owner: f, kind: 'ingot', x: e.x, z: e.z, y: 560, vy: -500, gravity: 1800, life: 3, w: 30, h: 40,
              dmg: 18, knock: true, launch: 350, kb: 120, vanishOnGround: true, unblockable: true,
            });
          }
        }
        if (Math.random() < 0.3) b.sfx('coin');
      },
      pose: (f, T, t) => ({ aF: [2.6 + Math.sin(t * 10) * 0.2, 0.2], aB: [2.4 - Math.sin(t * 10) * 0.2, 0.2], expr: 'smile', bob: Math.abs(Math.sin(t * 8)) * 3, prop: null }),
    },
  },

  // ───────── 慢跑總統 ─────────
  ma: {
    special: {
      cost: 18, dur: 0.45, ai: 'trap',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.2) {
          f.mv.fired = true;
          b.sfx('banana');
          const mine = b.projs.filter((p) => p.owner === f && p.kind === 'banana' && !p.fromSuper);
          if (mine.length >= 3) mine[0].dead = true;
          b.spawnProj({
            owner: f, kind: 'banana', x: f.x + f.facing * 20, z: f.z, y: 60, vx: f.facing * 270, vy: 260, gravity: 1400,
            trap: true, life: 8, w: 20, h: 30, dmg: 12, knock: true, launch: 300, kb: 60, slip: true,
          });
        }
      },
      pose: (f, T) => ({ aF: T < 0.2 ? [2.9, 0.3] : [1.4, 0], prop: T < 0.2 ? 'banana' : null, tilt: 0.15, expr: 'smile' }),
    },
    super: {
      dur: 4.5,
      start(f) {
        const X0 = ARENA.xMin + 40, X1 = ARENA.xMax - 40, Z0 = ARENA.zMin + 12, Z1 = ARENA.zMax - 12;
        const pts = [[X1, Z1], [X1, Z0], [X0, Z0], [X0, Z1], [X1, Z1]];
        if (f.x > 480) pts.reverse();
        f.mv.pts = pts;
        f.mv.i = 0;
      },
      update(f, b) {
        const [tx, tz] = f.mv.pts[f.mv.i];
        const dx = tx - f.x, dz = tz - f.z;
        const d = Math.hypot(dx, dz);
        const sp = 820;
        if (d < 18) {
          f.mv.i++;
          f.hitList.clear();
          if (f.mv.i >= f.mv.pts.length) {
            f.mv.done = true;
            f.vx = f.vz = 0;
            return;
          }
        } else {
          f.vx = (dx / d) * sp;
          f.vz = (dz / d) * sp;
          if (Math.abs(dx) > 4) f.facing = sign(dx);
        }
        b.areaHit(f, { x0: -30, x1: 55, zr: 46, dmg: 26, knock: true, kb: 260, launch: 380, unblockable: true });
        afterimage(b, f, 0.035);
        f.mv.drop = (f.mv.drop || 0) - 1 / 60;
        if (f.mv.drop <= 0) {
          f.mv.drop = 0.22;
          b.spawnProj({
            owner: f, kind: 'banana', x: f.x, z: f.z, y: 10, vy: 120, gravity: 1400, trap: true, life: 5, w: 20, h: 30,
            dmg: 10, knock: true, launch: 300, kb: 60, slip: true, fromSuper: true,
          });
        }
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 20);
        return { tilt: 0.25, lF: [s * 0.9 + 0.2, -1.2], lB: [-s * 0.9 + 0.2, -1.2], aF: [0.3 - s * 0.8, 1.9], aB: [0.3 + s * 0.8, 1.9], expr: 'smile' };
      },
    },
  },

  // ───────── 阿北 ─────────
  ko: {
    special: {
      cost: 20, dur: 0.5, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.2) {
          f.mv.fired = true;
          b.sfx('special');
          for (const vz of [-95, 0, 95]) {
            b.spawnProj({
              owner: f, kind: 'scalpel', x: f.x + f.facing * 30, z: f.z, y: f.y + 62, vx: f.facing * 560, vz,
              life: 0.95, w: 18, h: 40, dmg: 9, stun: 0.32, kb: 70,
            });
          }
        }
      },
      pose: (f, T) => ({ aF: T < 0.2 ? [2.6, 0.6] : [1.5, 0], prop: T < 0.2 ? 'scalpel' : null, tilt: 0.1, expr: 'flat' }),
    },
    super: {
      dur: 2.6,
      start(f, b) {
        b.sfx('heal');
      },
      update(f, b, dt) {
        f.vx = f.vz = 0;
        if (f.stateT < 1.3) {
          f.hp = Math.min(f.maxHp, f.hp + f.maxHp * 0.15 * dt);
          f.mv.p = (f.mv.p || 0) - dt;
          if (f.mv.p <= 0) {
            f.mv.p = 0.08;
            b.fx.add({ type: 'plus', x: f.x + rand(-25, 25), z: f.z, y: rand(20, 100), life: 0.7 });
          }
        }
        if (!f.mv.zapped && f.stateT > 1.45) {
          f.mv.zapped = true;
          b.sfx('zap');
          b.shake(10, 0.4);
          b.fx.add({ type: 'screenflash', color: '#bff8ff', life: 0.25 });
          for (const e of b.enemiesOf(f)) {
            b.fx.add({ type: 'bolt', x: e.x, z: e.z, y: e.y, life: 0.5 });
            b.applyHit(f, e, { dmg: 32, knock: true, launch: 420, kb: 160, unblockable: true });
          }
        }
      },
      pose: (f, T, t) =>
        T < 1.4
          ? { aF: [1.3, 1.1], aB: [1.1, 1.2], expr: 'flat', bob: Math.sin(t * 6) }
          : { aF: [2.9, 0], aB: [2.7, 0], expr: 'shout', tilt: -0.1 },
    },
  },

  // ───────── 館長 ─────────
  guan: {
    special: {
      cost: 25, dur: 0.75, ai: 'grab',
      start(f, b) {
        const t = b.enemiesOf(f).find((e) => {
          const dx = (e.x - f.x) * f.facing;
          return dx > -5 && dx < 62 && Math.abs(e.z - f.z) < 24 && e.y < 10 && !['down', 'getup', 'fall', 'grabbed', 'caught', 'roll', 'flip'].includes(e.state) && e.invuln <= 0;
        });
        if (t) {
          f.mv.t = t;
          t.setState('grabbed');
          t.grabber = f;
          t.vx = t.vz = t.vy = 0;
          b.sfx('throw');
        } else {
          f.mv.whiff = true;
          b.sfx('whiff');
        }
      },
      update(f, b) {
        f.vx = f.vz = 0;
        if (f.mv.whiff) {
          if (f.stateT > 0.35) f.mv.done = true;
          return;
        }
        const t = f.mv.t;
        if (!t || t.state !== 'grabbed') {
          f.mv.done = true;
          return;
        }
        const p = Math.min(1, f.stateT / 0.5);
        t.x = f.x + f.facing * (24 - 52 * p);
        t.z = f.z;
        t.y = 30 + Math.sin(p * Math.PI) * 70;
        t.facing = -f.facing;
        if (p >= 1 && !f.mv.thrown) {
          f.mv.thrown = true;
          t.grabber = null;
          t.setState('idle');
          t.y = 1;
          b.shake(10, 0.3);
          b.fx.add({ type: 'text', x: t.x, z: t.z, y: 40, text: '碰！', color: '#ff5a5a', size: 32, life: 0.8 });
          b.applyHit(f, t, { dmg: 24, knock: true, launch: 260, kb: 180, unblockable: true, dir: -f.facing, heavy: true });
        }
      },
      pose: (f, T) => (f.mv.whiff ? { aF: [1.6, 0.3], aB: [1.4, 0.4], tilt: 0.2 } : { aF: [2.9, 0.3], aB: [2.8, 0.3], tilt: -0.25 - Math.min(1, T * 2) * 0.3, expr: 'shout' }),
    },
    super: {
      dur: 2.7,
      start(f, b) {
        b.fx.add({ type: 'live', life: 2.7 });
        b.sfx('camera');
      },
      update(f, b) {
        const T = f.stateT;
        f.mv.cm = (f.mv.cm || 0) - 1 / 60;
        if (f.mv.cm <= 0) {
          f.mv.cm = 0.09;
          b.fx.add({ type: 'comment', text: pick(['RRR！', '館長加油！', '+1', '讚讚讚', '開直播啦', '777', '揪甘心', '衝啊！', '健身！']), y: rand(120, 300), life: 2.2 });
          if (Math.random() < 0.5) b.fx.add({ type: 'heart', x: f.x + rand(-20, 20), z: f.z, y: 110, life: 1.2 });
        }
        if (T < 0.55) {
          f.vx = f.vz = 0;
          return;
        }
        const e = b.nearestEnemy(f);
        if (T < 2.15) {
          if (e) {
            const dx = e.x - f.x, dz = e.z - f.z;
            f.facing = sign(dx) || f.facing;
            f.vx = Math.abs(dx) > 48 ? sign(dx) * 720 : 0;
            f.vz = Math.abs(dz) > 6 ? sign(dz) * 300 : 0;
          } else f.vx = f.vz = 0;
          f.mv.pt = (f.mv.pt || 0) - 1 / 60;
          if (f.mv.pt <= 0) {
            f.mv.pt = 0.08;
            f.hitList.clear();
            b.areaHit(f, { x0: -5, x1: 75, zr: 36, dmg: 3.2, stun: 0.3, kb: 15, unblockable: true });
          }
        } else {
          f.vx = f.vz = 0;
          if (!f.mv.up) {
            f.mv.up = true;
            f.hitList.clear();
            b.areaHit(f, { x0: -10, x1: 85, zr: 40, dmg: 24, knock: true, launch: 560, kb: 260, unblockable: true, heavy: true });
            b.shake(10, 0.3);
          }
        }
      },
      pose: (f, T, t) => {
        if (T < 0.55) return { aF: [2.8, 0.2], prop: 'phone', aB: [0.6, 1.6], expr: 'shout' };
        if (T < 2.15) {
          const k = Math.floor(t * 14) % 2;
          return { aF: k ? [1.6, 0] : [0.6, 1.6], aB: k ? [0.4, 1.6] : [1.6, 0], tilt: 0.25, expr: 'shout', lF: [0.5, -0.5], lB: [-0.5, 0] };
        }
        return { aF: [2.9, 0], aB: [0.4, 1.6], tilt: -0.2, expr: 'shout', lF: [0.2, -0.1], lB: [-0.3, -0.6] };
      },
    },
  },
};

// ═════════ 方向特技（防→上→攻 / 防→下→攻；或 特技鍵＋↑／↓） ═════════
const EXTRA = {
  su: {
    specialUp: {
      name: '衝天頭槌', cost: 20, dur: 0.7, ai: 'close', range: 70,
      start(f) {
        f.vy = 560;
        f.y = 1;
        f.vx = f.facing * 120;
      },
      update(f, b) {
        if (f.stateT < 0.35) b.areaHit(f, { x0: -10, x1: 52, zr: 22, dmg: 16, knock: true, launch: 460, kb: 120, fall: 80 });
        if (f.stateT > 0.1 && f.y <= 0) f.mv.done = true;
      },
      pose: () => ({ tilt: -0.2, aF: [2.9, 0.2], aB: [2.5, 0.3], lF: [0.9, -1.4], lB: [-0.2, -0.6], expr: 'shout' }),
    },
    specialDown: {
      name: '衝刺頭槌', cost: 18, dur: 0.6, ai: 'mid', range: 230,
      update(f, b) {
        f.vx = f.stateT < 0.4 ? f.facing * 640 : f.vx * 0.85;
        if (f.stateT < 0.42) b.areaHit(f, { x0: -5, x1: 48, zr: 22, dmg: 14, knock: true, launch: 280, kb: 280, fall: 80 });
        afterimage(b, f, 0.05);
      },
      pose: () => ({ tilt: 0.85, aF: [-0.4, 0.4], aB: [-0.6, 0.4], lF: [0.6, -0.8], lB: [-0.8, -0.3], expr: 'shout' }),
    },
  },
  wang: {
    specialUp: {
      name: '拍案而起', cost: 22, dur: 0.6, ai: 'crowd',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.25) {
          f.mv.fired = true;
          b.sfx('heavy');
          b.shake(6, 0.2);
          b.fx.add({ type: 'ring', x: f.x, z: f.z, y: 0, life: 0.45, r: 150, color: '#ffd84a' });
          b.fx.add({ type: 'text', x: f.x, z: f.z, y: 120, text: '砰！', color: '#ffd84a', size: 30, life: 0.7 });
          for (const e of b.enemiesOf(f)) {
            if (Math.abs(e.x - f.x) < 120 && Math.abs(e.z - f.z) < 40 && e.y < 60) b.applyHit(f, e, { dmg: 11, knock: true, launch: 300, kb: 240, dir: sign(e.x - f.x) || 1 });
          }
        }
      },
      pose: (f, T) => (T < 0.25 ? { aF: [2.9, 0.2], aB: [2.8, 0.2], expr: 'shout' } : { aF: [0.9, 0], aB: [0.7, 0], tilt: 0.3, expr: 'shout', lF: [0.6, -0.9] }),
    },
    specialDown: {
      name: '躺地抗議', cost: 18, dur: 1.6, ai: 'defensive',
      start(f, b) {
        f.armor = 1.6;
        b.fx.add({ type: 'text', x: f.x, z: f.z, y: 120, text: '除非踏過我！', color: '#fff', size: 22, life: 1.2 });
      },
      update(f, b) {
        f.vx = f.vz = 0;
        for (const e of b.enemiesOf(f)) {
          if (f.hitList.has(e) || e.y > 6) continue;
          if (Math.abs(e.x - f.x) < 46 && Math.abs(e.z - f.z) < 18) {
            f.hitList.add(e);
            b.applyHit(f, e, { dmg: 12, knock: true, launch: 260, kb: 120, slip: true, dir: e.facing });
          }
        }
      },
      pose: () => ({ lying: true, aF: [2.6, 0.3], aB: [2.4, 0.2], lF: [0.1, 0], lB: [0.2, 0], expr: 'shout' }),
    },
  },
  han: {
    specialUp: {
      name: '貨出得去', cost: 25, dur: 0.55, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.25) {
          f.mv.fired = true;
          b.sfx('throw');
          b.spawnProj({
            owner: f, kind: 'crate', x: f.x + f.facing * 30, z: f.z, y: 90, vx: f.facing * 400, vy: 260, gravity: 1300,
            life: 2, w: 30, h: 50, dmg: 22, knock: true, launch: 320, kb: 200, vanishOnGround: true,
          });
        }
      },
      pose: (f, T) => (T < 0.25 ? { aF: [2.9, 0.1], aB: [2.8, 0.1], tilt: -0.2, prop: null } : { aF: [1.5, 0], aB: [1.4, 0], tilt: 0.3, prop: null }),
    },
    specialDown: {
      name: '滷肉飯補血', cost: 30, dur: 0.9, ai: 'heal',
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.5) {
          f.mv.fired = true;
          b.sfx('heal');
          f.heal(50, 30);
          b.fx.add({ type: 'text', x: f.x, z: f.z, y: 130, text: '+50 呷飽', color: '#5cff7a', size: 22, life: 1 });
          for (let i = 0; i < 6; i++) b.fx.add({ type: 'plus', x: f.x + rand(-20, 20), z: f.z, y: rand(30, 100), life: 0.7 });
        }
      },
      pose: (f, T, t) => ({ aF: [2.2 + Math.sin(t * 20) * 0.2, 1.3], aB: [1.2, 1.4], prop: 'bowl', expr: 'smile' }),
    },
  },
  ma: {
    specialUp: {
      name: '香蕉迴力鏢', cost: 20, dur: 0.45, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.2) {
          f.mv.fired = true;
          b.sfx('banana');
          b.spawnProj({
            owner: f, kind: 'boomerang', x: f.x + f.facing * 30, z: f.z, y: f.y + 60, vx: f.facing * 560, boomerang: f.facing,
            life: 1.25, w: 22, h: 40, dmg: 10, stun: 0.35, kb: 60, pierce: true,
          });
        }
      },
      pose: (f, T) => ({ aF: T < 0.2 ? [-0.5, 1.5] : [1.6, 0], prop: T < 0.2 ? 'banana' : null, tilt: 0.1, expr: 'smile' }),
    },
    specialDown: {
      name: '慢跑閃避', cost: 10, dur: 0.5, ai: 'escape',
      start(f) {
        f.invuln = 0.5;
      },
      update(f, b) {
        f.vx = f.facing * 560;
        afterimage(b, f, 0.035);
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 24);
        return { tilt: 0.3, lF: [s + 0.2, -1.2], lB: [-s + 0.2, -1.2], aF: [0.3 - s * 0.8, 1.9], aB: [0.3 + s * 0.8, 1.9], expr: 'smile' };
      },
    },
  },
  ko: {
    specialUp: {
      name: '電擊器', cost: 22, dur: 0.55, ai: 'close', range: 75,
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.2) {
          f.mv.fired = true;
          b.sfx('zap');
          b.fx.add({ type: 'spark', x: f.x + f.facing * 45, z: f.z, y: 60, life: 0.3, big: true, color: '#9ff8ff' });
          b.areaHit(f, { x0: -5, x1: 78, zr: 24, dmg: 12, dizzy: 1.8 });
        }
      },
      pose: (f, T) => ({ aF: T < 0.2 ? [0.8, 1.6] : [1.57, 0], aB: T < 0.2 ? [0.6, 1.6] : [1.5, 0.1], tilt: 0.2, expr: 'flat' }),
    },
    specialDown: {
      name: '單車環島', cost: 24, dur: 0.95, ai: 'mid', range: 300,
      start(f, b) {
        b.fx.add({ type: 'text', x: f.x, z: f.z, y: 130, text: '叮叮！', color: '#2ec4b6', size: 22, life: 0.7 });
      },
      update(f, b) {
        f.vx = f.facing * (f.stateT < 0.75 ? 700 : 200);
        if (f.stateT < 0.8) b.areaHit(f, { x0: -10, x1: 55, zr: 24, dmg: 16, knock: true, launch: 300, kb: 300, fall: 80 });
        afterimage(b, f, 0.05);
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 26);
        return { bike: true, tilt: 0.35, lF: [1.0 + s * 0.4, -1.4], lB: [1.0 - s * 0.4, -1.4], aF: [1.3, 0.3], aB: [1.2, 0.3], expr: 'flat' };
      },
    },
  },
  guan: {
    specialUp: {
      name: '館長上勾拳', cost: 20, dur: 0.55, ai: 'close', range: 70,
      start(f) {
        f.vy = 300;
        f.y = 1;
      },
      update(f, b) {
        if (f.stateT > 0.05 && f.stateT < 0.3) b.areaHit(f, { x0: -5, x1: 62, zr: 22, dmg: 20, knock: true, launch: 580, kb: 110, fall: 80, heavy: true });
        if (f.stateT > 0.1 && f.y <= 0) f.mv.done = true;
      },
      pose: () => ({ aF: [2.9, 0], aB: [0.4, 1.6], tilt: -0.2, expr: 'shout', lF: [0.2, -0.1], lB: [-0.3, -0.6] }),
    },
    specialDown: {
      name: '啞鈴投擲', cost: 22, dur: 0.55, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.25) {
          f.mv.fired = true;
          b.sfx('throw');
          b.spawnProj({
            owner: f, kind: 'dumbbell', x: f.x + f.facing * 30, z: f.z, y: 80, vx: f.facing * 430, vy: 280, gravity: 1400,
            life: 2, w: 26, h: 50, dmg: 22, knock: true, launch: 300, kb: 180, vanishOnGround: true,
          });
        }
      },
      pose: (f, T) => (T < 0.25 ? { aF: [-0.6, 1.4], aB: [0.4, 1.6], tilt: -0.2 } : { aF: [1.7, 0], aB: [0.4, 1.6], tilt: 0.3 }),
    },
  },
};
for (const [id, ex] of Object.entries(EXTRA)) Object.assign(MOVES[id], ex);

// 依方向取得特技定義
export function specialDef(id, kind) {
  const m = MOVES[id];
  return kind === 'up' ? m.specialUp : kind === 'down' ? m.specialDown : m.special;
}
