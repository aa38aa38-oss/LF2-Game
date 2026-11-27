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
// 找最近的對手（大絕自動鎖定用）
const nearestFoe = (f, b, range) => {
  let best = null, bd = range;
  for (const e of b.enemiesOf(f)) {
    if (e.dead || e.hp <= 0) continue;
    const d = Math.abs(e.x - f.x) + Math.abs(e.z - f.z) * 2;
    if (d < bd) {
      bd = d;
      best = e;
    }
  }
  return best;
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
      // 鎖定衝撞（參考大亂鬥「先撞到才進入大招」）：自動衝向最近的對手，撞到就連續頭槌三下再頂飛
      dur: 2.0, aiRange: 650,
      start(f, b) {
        f.mv.tgt = nearestFoe(f, b, 750);
      },
      update(f, b) {
        const T = f.stateT, m = f.mv;
        if (!m.lock) {
          let t = m.tgt;
          if (t && (t.dead || ['down', 'getup', 'roll'].includes(t.state))) t = m.tgt = nearestFoe(f, b, 750);
          if (T > 0.75 || !t) {
            f.vx *= 0.8;
            f.vz = 0;
            if (T > 0.9) m.done = true;
            return;
          }
          f.facing = sign(t.x - f.x) || f.facing;
          f.vx = f.facing * 950;
          f.vz = Math.max(-320, Math.min(320, (t.z - f.z) * 9));
          afterimage(b, f, 0.04);
          if (Math.abs(t.x - f.x) < 60 && Math.abs(t.z - f.z) < 26 && t.y < 40) {
            m.lock = t;
            m.lt = T;
            f.x = t.x - f.facing * 44;
          }
          return;
        }
        const t = m.lock;
        f.vx = f.vz = 0;
        t.vx = t.vz = 0;
        const k = Math.floor((T - m.lt) / 0.2);
        if (k < 3 && k !== m.k) {
          m.k = k;
          b.applyHit(f, t, { dmg: 10, stun: 0.5, kb: 0, fall: 0, unblockable: true, dir: f.facing });
          b.fx.add({ type: 'headflash', x: f.x + f.facing * 20, z: f.z, y: 100, dir: f.facing, life: 0.15 });
        }
        if (k >= 3 && !m.fin) {
          m.fin = true;
          b.applyHit(f, t, { dmg: 28, knock: true, launch: 620, kb: 340, unblockable: true, heavy: true, dir: f.facing });
          b.shake(12, 0.4);
        }
        if (k >= 5) m.done = true;
      },
      pose: (f, T, t) => {
        if (!f.mv.lock) {
          const s = Math.sin(t * 24);
          return { tilt: 0.7, lF: [s * 1.0 + 0.3, -1.3], lB: [-s * 1.0 + 0.3, -1.3], aF: [-0.4, 0.4], aB: [-0.6, 0.4], expr: 'shout' };
        }
        const k = Math.floor((T - f.mv.lt) / 0.1) % 2;
        return { tilt: k ? 0.6 : 0.1, aF: [0.4, 0.6], aB: [0.3, 0.6], expr: 'shout' };
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
            life: 1.3, w: 24, h: 46, dmg: 15, stun: 0.5, kb: 140, fall: 45,
          });
        }
      },
      pose: (f, T) => ({ aF: T > 0.12 ? [1.57, 0] : [2.2, 0.6], prop: 'finger', tilt: 0.15, expr: 'shout', lF: [0.45, -0.4], lB: [-0.4, 0] }),
    },
    super: {
      // 全場震波（範圍型，類似小朋友齊打交的範圍大招）：左右兩邊各一道，前後範圍有限
      dur: 1.6, aiRange: 480, aiZ: 70,
      update(f, b) {
        f.vx = 0;
        f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.35) {
          f.mv.fired = true;
          b.sfx('wave');
          b.shake(12, 0.7);
          for (const d of [-1, 1]) {
            b.spawnProj({
              owner: f, kind: 'wave', x: f.x + d * 20, z: f.z, y: 0, vx: d * 640, life: 0.85, w: 44, zr: 80,
              h: 140, dmg: 40, knock: true, launch: 480, kb: 320, pierce: true, unblockable: true, dir: d,
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
      // 金幣雨：畫面上每個對手頭上都下 10 枚金幣（會定住），最後再砸一個金元寶
      dur: 2.2, aiRange: 800,
      update(f, b) {
        f.vx = 0;
        f.vz = 0;
        const m = f.mv;
        m.c = (m.c || 0) - 1 / 60;
        m.n = m.n || new Map();
        const foes = b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 850);
        if (m.c <= 0 && f.stateT > 0.2 && f.stateT < 1.6) {
          m.c = 0.13;
          for (const e of foes) {
            const n = m.n.get(e) || 0;
            if (n >= 9) continue;
            m.n.set(e, n + 1);
            b.spawnProj({
              owner: f, kind: 'coin', x: e.x + rand(-12, 12), z: Math.max((e.bounds || ARENA).zMin, Math.min((e.bounds || ARENA).zMax, e.z + rand(-8, 8))),
              y: 420, vy: -300, gravity: 1300, life: 3, w: 22, zr: 24, h: 30, dmg: 3.2, stun: 0.32, kb: 10, fall: 0, vanishOnGround: true, unblockable: true,
            });
          }
          b.sfx('coin');
        }
        if (!m.big && f.stateT > 1.6) {
          m.big = true;
          for (const e of foes) {
            b.spawnProj({
              owner: f, kind: 'ingot', x: e.x, z: e.z, y: 480, vy: -500, gravity: 1800, life: 3, w: 30, zr: 26, h: 40,
              dmg: 18, knock: true, launch: 350, kb: 120, vanishOnGround: true, unblockable: true,
            });
          }
        }
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
      // 追蹤香蕉：6 根會追人的香蕉，前 4 根打中會定住，最後 2 根把人打倒（類似小朋友齊打交的追蹤氣功）
      dur: 1.3, aiRange: 800,
      update(f, b) {
        f.vx = f.vz = 0;
        const n = f.mv.n || 0;
        if (n < 6 && f.stateT > 0.25 + n * 0.12) {
          f.mv.n = n + 1;
          const foes = b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 900);
          foes.sort((a, c) => Math.abs(a.x - f.x) - Math.abs(c.x - f.x));
          const tgt = foes.length ? foes[n % foes.length] : null;
          const last = n >= 4;
          b.spawnProj({
            owner: f, kind: 'homing', homing: tgt, x: f.x + f.facing * 20, z: f.z, y: f.y + 90,
            vx: f.facing * rand(260, 360), vz: rand(-160, 160), life: 2.8, w: 26, zr: 26, h: 40, unblockable: true, noClash: true,
            ...(last ? { dmg: 12, knock: true, launch: 320, kb: 160, fall: 80 } : { dmg: 7, stun: 0.4, kb: 30, fall: 0 }),
          });
          b.sfx('banana');
        }
      },
      pose: (f, T, t) => {
        const k = Math.floor(t * 10) % 2;
        return { aF: k ? [2.6, 0.3] : [1.4, 0], aB: k ? [1.4, 0] : [2.6, 0.3], prop: k ? 'banana' : null, expr: 'smile', tilt: 0.1 };
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
      // 先回一點血，再對畫面上所有對手放電（範圍型）
      dur: 2.0, aiRange: 700,
      start(f, b) {
        b.sfx('heal');
      },
      update(f, b, dt) {
        f.vx = f.vz = 0;
        if (f.stateT < 1.0) {
          f.heal(f.maxHp * 0.06 * dt, f.maxHp * 0.06 * dt);
          f.mv.p = (f.mv.p || 0) - dt;
          if (f.mv.p <= 0) {
            f.mv.p = 0.08;
            b.fx.add({ type: 'plus', x: f.x + rand(-25, 25), z: f.z, y: rand(20, 100), life: 0.7 });
          }
        }
        if (!f.mv.zapped && f.stateT > 1.1) {
          f.mv.zapped = true;
          b.sfx('zap');
          b.shake(10, 0.4);
          b.fx.add({ type: 'screenflash', color: '#bff8ff', life: 0.25 });
          for (const e of b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 750)) {
            b.fx.add({ type: 'bolt', x: e.x, z: e.z, y: e.y, life: 0.5 });
            b.applyHit(f, e, { dmg: 38, knock: true, launch: 420, kb: 160, unblockable: true });
          }
        }
      },
      pose: (f, T, t) =>
        T < 1.05
          ? { aF: [1.3, 1.1], aB: [1.1, 1.2], expr: 'flat', bob: Math.sin(t * 6) }
          : { aF: [2.9, 0], aB: [2.7, 0], expr: 'shout', tilt: -0.1 },
    },
  },

  // ───────── 館長 ─────────
  guan: {
    special: {
      // 撲抓過肩摔：往前撲 0.22 秒，途中碰到對手就抓起來摔（被打到搖晃的人也抓得到）
      cost: 25, cd: 7, dur: 0.95, ai: 'grab', range: 110,
      start(f, b) {
        f.mv.lunge = true;
      },
      update(f, b) {
        if (f.mv.lunge) {
          const t = b.enemiesOf(f).find((e) => {
            const dx = (e.x - f.x) * f.facing;
            return dx > -5 && dx < 70 && Math.abs(e.z - f.z) < 30 && e.y < 20 && !['down', 'getup', 'fall', 'grabbed', 'caught', 'roll', 'flip'].includes(e.state) && e.invuln <= 0;
          });
          if (t) {
            f.mv.lunge = false;
            f.mv.t = t;
            f.mv.t0 = f.stateT;
            t.setState('grabbed');
            t.grabber = f;
            t.vx = t.vz = t.vy = 0;
            b.sfx('throw');
          } else if (f.stateT < 0.22) {
            f.vx = f.facing * 520;
            f.vz = 0;
            afterimage(b, f, 0.05);
            return;
          } else {
            f.mv.lunge = false;
            f.mv.whiff = true;
            b.sfx('whiff');
          }
        }
        f.vx = f.vz = 0;
        if (f.mv.whiff) {
          if (f.stateT > 0.45) f.mv.done = true;
          return;
        }
        const t = f.mv.t;
        if (!t || t.state !== 'grabbed') {
          f.mv.done = true;
          return;
        }
        const p = Math.min(1, (f.stateT - f.mv.t0) / 0.45);
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
          b.applyHit(f, t, { dmg: 25, knock: true, launch: 260, kb: 180, unblockable: true, dir: -f.facing, heavy: true });
        }
      },
      pose: (f, T) => (f.mv.whiff ? { aF: [1.6, 0.3], aB: [1.4, 0.4], tilt: 0.2 } : { aF: [2.9, 0.3], aB: [2.8, 0.3], tilt: -0.25 - Math.min(1, T * 2) * 0.3, expr: 'shout' }),
    },
    super: {
      // 開直播狂打（近身型，打中傷害最高）：先往最近的對手撲過去，再連打，連打中可以移動，最後上勾拳
      dur: 2.1, aiRange: 380,
      start(f, b) {
        b.fx.add({ type: 'live', life: 2.1 });
        b.sfx('camera');
        f.mv.tgt = nearestFoe(f, b, 420);
      },
      update(f, b) {
        const T = f.stateT, m = f.mv;
        m.cm = (m.cm || 0) - 1 / 60;
        if (m.cm <= 0) {
          m.cm = 0.09;
          b.fx.add({ type: 'comment', text: pick(['RRR！', '館長加油！', '+1', '讚讚讚', '開直播啦', '777', '揪甘心', '衝啊！', '健身！']), y: rand(120, 300), life: 2.2 });
          if (Math.random() < 0.5) b.fx.add({ type: 'heart', x: f.x + rand(-20, 20), z: f.z, y: 110, life: 1.2 });
        }
        if (T < 0.25) {
          f.vx = f.vz = 0;
          return;
        }
        if (T < 0.42) {
          // 撲向對手
          const t = m.tgt;
          if (t && Math.abs(t.x - f.x) > 50) {
            f.facing = sign(t.x - f.x) || f.facing;
            f.vx = f.facing * 900;
            f.vz = Math.max(-300, Math.min(300, (t.z - f.z) * 9));
          } else f.vx = f.vz = 0;
          afterimage(b, f, 0.04);
          return;
        }
        if (T < 1.75) {
          const c = f.ctrl;
          const dx = (c.held('right') ? 1 : 0) - (c.held('left') ? 1 : 0);
          const dz = (c.held('down') ? 1 : 0) - (c.held('up') ? 1 : 0);
          if (dx) f.facing = dx;
          f.vx = dx * 170;
          f.vz = dz * 120;
          m.pt = (m.pt || 0) - 1 / 60;
          if (m.pt <= 0) {
            m.pt = 0.08;
            f.hitList.clear();
            b.areaHit(f, { x0: -5, x1: 90, zr: 40, dmg: 2.8, stun: 0.34, kb: 0, fall: 0, unblockable: true });
          }
        } else {
          f.vx = f.vz = 0;
          if (!m.up) {
            m.up = true;
            f.hitList.clear();
            b.areaHit(f, { x0: -10, x1: 95, zr: 42, dmg: 26, knock: true, launch: 560, kb: 260, unblockable: true, heavy: true });
            b.shake(10, 0.3);
          }
        }
      },
      pose: (f, T, t) => {
        if (T < 0.25) return { aF: [2.8, 0.2], prop: 'phone', aB: [0.6, 1.6], expr: 'shout' };
        if (T < 1.75) {
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
            if (Math.abs(e.x - f.x) < 150 && Math.abs(e.z - f.z) < 44 && e.y < 60) b.applyHit(f, e, { dmg: 16, knock: true, launch: 320, kb: 260, dir: sign(e.x - f.x) || 1 });
          }
        }
      },
      pose: (f, T) => (T < 0.25 ? { aF: [2.9, 0.2], aB: [2.8, 0.2], expr: 'shout' } : { aF: [0.9, 0], aB: [0.7, 0], tilt: 0.3, expr: 'shout', lF: [0.6, -0.9] }),
    },
    specialDown: {
      name: '躺地抗議', cost: 18, dur: 1.6, ai: 'defensive',
      start(f, b) {
        // 躺地期間無敵，周圍金色光圈＝有攻擊判定，誰踩進來就跌倒
        f.invuln = 1.6;
        b.fx.add({ type: 'text', x: f.x, z: f.z, y: 120, text: '除非踏過我！', color: '#ffe14a', size: 24, life: 1.2 });
      },
      update(f, b) {
        f.vx = f.vz = 0;
        f.invuln = Math.max(f.invuln, 0.05);
        f.mv.r = (f.mv.r || 0) - 1 / 60;
        if (f.mv.r <= 0) {
          f.mv.r = 0.28;
          b.fx.add({ type: 'ring', x: f.x, z: f.z, y: 0, life: 0.4, r: 120, color: '#ffd84a' });
          b.fx.add({ type: 'spark', x: f.x + rand(-40, 40), z: f.z, y: 14, life: 0.2, color: '#ffd84a' });
        }
        for (const e of b.enemiesOf(f)) {
          if (f.hitList.has(e) || e.y > 6) continue;
          if (Math.abs(e.x - f.x) < 62 && Math.abs(e.z - f.z) < 24) {
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
      name: '滷肉飯補血', cost: 30, cd: 12, dur: 0.9, ai: 'heal',
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
      name: '館長上勾拳', cost: 20, dur: 0.55, ai: 'close', range: 120,
      start(f) {
        f.vy = 320;
        f.y = 1;
      },
      update(f, b) {
        // 往前衝的上勾拳
        if (f.stateT < 0.25) f.vx = f.facing * 300;
        if (f.stateT > 0.04 && f.stateT < 0.32) b.areaHit(f, { x0: -10, x1: 84, zr: 30, dmg: 21, knock: true, launch: 600, kb: 130, fall: 80, heavy: true });
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
            owner: f, kind: 'dumbbell', x: f.x + f.facing * 30, z: f.z, y: 80, vx: f.facing * 560, vy: 200, gravity: 1100,
            life: 2, w: 30, zr: 26, h: 60, dmg: 22, knock: true, launch: 300, kb: 180, vanishOnGround: true,
            landBlast: { r: 75, zr: 34, dmg: 12, knock: true, launch: 280, kb: 160 },
          });
        }
      },
      pose: (f, T) => (T < 0.25 ? { aF: [-0.6, 1.4], aB: [0.4, 1.6], tilt: -0.2 } : { aF: [1.7, 0], aB: [0.4, 1.6], tilt: 0.3 }),
    },
  },
};
for (const [id, ex] of Object.entries(EXTRA)) Object.assign(MOVES[id], ex);

// ═════════ 第二批主角：黑熊教授、帥氣市長、辣台妹總統、龍介仙 ═════════
// 投射物丟出時機共用：stateT 過了 at 秒就發射一次
const fireOnce = (f, at, fn) => {
  if (!f.mv.fired && f.stateT > at) {
    f.mv.fired = true;
    fn();
  }
};
const throwPose = (T, at) => (T < at ? { aF: [2.9, 0.2], aB: [2.6, 0.3], tilt: -0.2 } : { aF: [1.5, 0], aB: [1.3, 0.2], tilt: 0.3 });

Object.assign(MOVES, {
  // ───────── 黑熊教授 ─────────
  shen: {
    special: {
      name: '演講音波', cost: 20, dur: 0.55, ai: 'proj',
      update(f, b) {
        fireOnce(f, 0.2, () => {
          b.sfx('sound');
          b.spawnProj({
            owner: f, kind: 'sound', color: '#8fd4ff', x: f.x + f.facing * 40, z: f.z, y: f.y + 70, vx: f.facing * 480,
            life: 1.3, w: 26, h: 50, dmg: 15, stun: 0.5, kb: 150, fall: 45,
          });
        });
      },
      pose: (f, T) => ({ aF: [1.6, 0.4], aB: [1.2, 0.5], prop: 'mic', tilt: 0.15, expr: 'shout' }),
    },
    specialUp: {
      name: '黑熊撲擊', cost: 22, dur: 0.6, ai: 'mid', range: 260,
      update(f, b) {
        fireOnce(f, 0.18, () => {
          b.sfx('throw');
          b.spawnProj({
            owner: f, kind: 'bear', x: f.x + f.facing * 40, z: f.z, y: 0, vx: f.facing * 560,
            life: 0.75, w: 40, zr: 30, h: 80, dmg: 17, knock: true, launch: 320, kb: 240,
          });
        });
      },
      pose: (f, T) => ({ aF: [1.57, 0], aB: [0.8, 0.6], tilt: 0.2, expr: 'shout' }),
    },
    specialDown: {
      name: '丟防衛手冊', cost: 22, dur: 0.55, ai: 'proj',
      update(f, b) {
        fireOnce(f, 0.25, () => {
          b.sfx('throw');
          b.spawnProj({
            owner: f, kind: 'book', x: f.x + f.facing * 30, z: f.z, y: 80, vx: f.facing * 520, vy: 180, gravity: 1100,
            life: 2, w: 30, zr: 26, h: 44, dmg: 20, knock: true, launch: 300, kb: 180, vanishOnGround: true,
          });
        });
      },
      pose: (f, T) => throwPose(T, 0.25),
    },
    super: {
      // 洋流：三道大浪接連往前橫掃，前兩道把人捲住，最後一道打飛
      dur: 1.9, aiRange: 700, aiZ: 90,
      update(f, b) {
        f.vx = f.vz = 0;
        const n = f.mv.n || 0;
        if (n < 3 && f.stateT > 0.35 + n * 0.3) {
          f.mv.n = n + 1;
          const last = n === 2;
          b.sfx('wave');
          b.shake(8, 0.3);
          b.spawnProj({
            owner: f, kind: 'sea', x: f.x + f.facing * 30, z: f.z, y: 0, vx: f.facing * 700, life: 1.1, w: 60, zr: 95, h: 170,
            pierce: true, unblockable: true, dir: f.facing,
            ...(last ? { dmg: 30, knock: true, launch: 480, kb: 360 } : { dmg: 10, stun: 0.5, kb: 120, fall: 0 }),
          });
        }
      },
      pose: (f, T) => (T < 0.35 ? { aF: [2.8, 0.2], aB: [2.6, 0.2], prop: 'mic', expr: 'shout' } : { aF: [1.57, 0], aB: [1.4, 0.2], prop: 'mic', tilt: 0.25, expr: 'shout' }),
    },
  },

  // ───────── 帥氣市長 ─────────
  chiang: {
    special: {
      name: '帥氣閃光', cost: 22, dur: 0.55, ai: 'close', range: 160,
      update(f, b) {
        fireOnce(f, 0.18, () => {
          b.sfx('flash');
          b.fx.add({ type: 'headflash', x: f.x + f.facing * 30, z: f.z, y: f.y + 96, life: 0.45, dir: f.facing });
          b.fx.add({ type: 'text', x: f.x + f.facing * 40, z: f.z, y: 140, text: '帥！', color: '#bfe4ff', size: 26, life: 0.7 });
          b.areaHit(f, { x0: -10, x1: 170, zr: 46, dmg: 7, dizzy: 1.5, kb: 0 });
        });
      },
      pose: (f, T) => ({ aF: [2.2, 0.3], aB: [0.6, 1.4], tilt: 0.05, expr: 'smile' }),
    },
    specialUp: {
      name: '白皮書連發', cost: 20, dur: 0.5, ai: 'proj',
      update(f, b) {
        fireOnce(f, 0.2, () => {
          b.sfx('throw');
          for (const vz of [-95, 0, 95]) {
            b.spawnProj({
              owner: f, kind: 'paper', x: f.x + f.facing * 30, z: f.z, y: f.y + 62, vx: f.facing * 540, vz,
              life: 0.95, w: 20, h: 40, dmg: 9, stun: 0.32, kb: 70,
            });
          }
        });
      },
      pose: (f, T) => throwPose(T, 0.2),
    },
    specialDown: {
      name: '晨跑衝刺', cost: 18, dur: 0.6, ai: 'mid', range: 230,
      update(f, b) {
        f.vx = f.stateT < 0.4 ? f.facing * 660 : f.vx * 0.85;
        if (f.stateT < 0.42) b.areaHit(f, { x0: -5, x1: 50, zr: 24, dmg: 14, knock: true, launch: 280, kb: 280, fall: 80 });
        afterimage(b, f, 0.05);
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 24);
        return { tilt: 0.35, lF: [s + 0.2, -1.2], lB: [-s + 0.2, -1.2], aF: [0.3 - s * 0.8, 1.9], aB: [0.3 + s * 0.8, 1.9], expr: 'smile' };
      },
    },
    super: {
      // 團結向前：煙火落在每個對手頭上，最後一發大煙火炸飛
      dur: 2.1, aiRange: 800,
      update(f, b) {
        f.vx = f.vz = 0;
        const m = f.mv;
        m.c = (m.c || 0) - 1 / 60;
        m.n = m.n || new Map();
        const foes = b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 850);
        if (m.c <= 0 && f.stateT > 0.25 && f.stateT < 1.5) {
          m.c = 0.16;
          for (const e of foes) {
            const k = m.n.get(e) || 0;
            if (k >= 7) continue;
            m.n.set(e, k + 1);
            b.spawnProj({
              owner: f, kind: 'firework', hue: (k * 57) % 360, x: e.x + rand(-14, 14), z: Math.max((e.bounds || ARENA).zMin, Math.min((e.bounds || ARENA).zMax, e.z + rand(-8, 8))),
              y: 420, vy: -340, gravity: 1200, life: 3, w: 22, zr: 24, h: 30, dmg: 3.5, stun: 0.32, kb: 10, fall: 0, vanishOnGround: true, unblockable: true,
            });
          }
          b.sfx('coin');
        }
        if (!m.big && f.stateT > 1.6) {
          m.big = true;
          b.sfx('zap');
          b.shake(10, 0.4);
          b.fx.add({ type: 'screenflash', color: '#ffe9a8', life: 0.25 });
          for (const e of foes) {
            b.fx.add({ type: 'ring', x: e.x, z: e.z, y: 80, life: 0.6, r: 90, color: pick(['#ff5a5a', '#ffd84a', '#5cc8ff', '#7cff7a']) });
            b.applyHit(f, e, { dmg: 22, knock: true, launch: 400, kb: 160, unblockable: true });
          }
        }
      },
      pose: (f, T, t) => ({ aF: [2.9, 0.1], aB: [0.6, 1.4], expr: 'shout', bob: Math.abs(Math.sin(t * 8)) * 3 }),
    },
  },

  // ───────── 辣台妹總統 ─────────
  tsai: {
    special: {
      name: '貓咪出擊', cost: 20, dur: 0.5, ai: 'proj',
      update(f, b) {
        fireOnce(f, 0.18, () => {
          b.sfx('special');
          b.spawnProj({
            owner: f, kind: 'cat', x: f.x + f.facing * 36, z: f.z, y: 0, vx: f.facing * 520,
            life: 1.1, w: 30, zr: 26, h: 40, dmg: 13, stun: 0.45, kb: 110, fall: 45,
          });
        });
      },
      pose: (f, T) => ({ aF: [1.57, 0], aB: [0.6, 1.2], tilt: 0.1, expr: 'smile' }),
    },
    specialUp: {
      name: '辣椒火焰', cost: 22, dur: 0.6, ai: 'close', range: 200,
      update(f, b) {
        fireOnce(f, 0.2, () => {
          b.sfx('wave');
          b.spawnProj({
            owner: f, kind: 'chili', x: f.x + f.facing * 40, z: f.z, y: f.y + 60, vx: f.facing * 420,
            life: 0.6, w: 40, zr: 30, h: 60, dmg: 16, knock: true, launch: 260, kb: 200, pierce: true,
          });
        });
      },
      pose: (f, T) => ({ aF: [1.57, 0], aB: [1.4, 0.2], tilt: 0.25, expr: 'shout' }),
    },
    specialDown: {
      name: '眼鏡閃光', cost: 22, dur: 0.55, ai: 'close', range: 150,
      update(f, b) {
        fireOnce(f, 0.2, () => {
          b.sfx('flash');
          b.fx.add({ type: 'headflash', x: f.x + f.facing * 8, z: f.z, y: f.y + 110, life: 0.45, dir: f.facing });
          for (const e of b.enemiesOf(f)) {
            if (Math.abs(e.x - f.x) < 160 && Math.abs(e.z - f.z) < 46 && e.y < 60) b.applyHit(f, e, { dmg: 6, dizzy: 1.6, kb: 0, dir: sign(e.x - f.x) || 1 });
          }
        });
      },
      pose: () => ({ aF: [2.6, 1.6], aB: [0.6, 1.2], expr: 'smile' }),
    },
    super: {
      // 巨貓衝鋒：兩隻巨貓前後衝過全場
      dur: 1.6, aiRange: 650, aiZ: 90,
      update(f, b) {
        f.vx = f.vz = 0;
        const n = f.mv.n || 0;
        if (n < 2 && f.stateT > 0.35 + n * 0.3) {
          f.mv.n = n + 1;
          b.sfx('heavy');
          b.shake(9, 0.35);
          b.spawnProj({
            owner: f, kind: 'bigcat', tabby: n === 0, x: f.x - f.facing * 20, z: f.z + (n ? 22 : -22), y: 0, vx: f.facing * 760, life: 1.3, w: 70, zr: 70, h: 150,
            dmg: 26, knock: true, launch: 460, kb: 340, pierce: true, unblockable: true, dir: f.facing,
          });
        }
      },
      pose: () => ({ aF: [1.57, 0], aB: [0.6, 1.2], tilt: 0.05, expr: 'smile' }),
    },
  },

  // ───────── 龍介仙 ─────────
  hsieh: {
    special: {
      name: '布袋戲掌', cost: 20, dur: 0.5, ai: 'proj',
      update(f, b) {
        fireOnce(f, 0.18, () => {
          b.sfx('special');
          b.spawnProj({
            owner: f, kind: 'palm', x: f.x + f.facing * 40, z: f.z, y: f.y + 66, vx: f.facing * 500,
            life: 1.2, w: 30, h: 50, dmg: 15, stun: 0.5, kb: 160, fall: 45,
          });
        });
      },
      pose: (f, T) => ({ aF: [1.57, 0], aB: [1.2, 0.6], tilt: 0.2, expr: 'shout' }),
    },
    specialUp: {
      name: '台語大聲公', cost: 22, dur: 0.6, ai: 'crowd',
      update(f, b) {
        fireOnce(f, 0.25, () => {
          b.sfx('sound');
          b.shake(6, 0.2);
          b.fx.add({ type: 'ring', x: f.x, z: f.z, y: 60, life: 0.45, r: 160, color: '#ffb02e' });
          b.fx.add({ type: 'text', x: f.x, z: f.z, y: 130, text: '恁聽乎清楚！', color: '#ffb02e', size: 24, life: 0.8 });
          for (const e of b.enemiesOf(f)) {
            if (Math.abs(e.x - f.x) < 160 && Math.abs(e.z - f.z) < 44 && e.y < 60) b.applyHit(f, e, { dmg: 16, knock: true, launch: 320, kb: 260, dir: sign(e.x - f.x) || 1 });
          }
        });
      },
      pose: (f, T) => (T < 0.25 ? { aF: [2.4, 0.4], aB: [2.2, 0.4], expr: 'shout' } : { aF: [1.57, 0], aB: [1.4, 0.3], tilt: 0.3, expr: 'shout' }),
    },
    specialDown: {
      name: '丟虱目魚', cost: 22, dur: 0.55, ai: 'proj',
      update(f, b) {
        fireOnce(f, 0.25, () => {
          b.sfx('throw');
          b.spawnProj({
            owner: f, kind: 'fish', x: f.x + f.facing * 30, z: f.z, y: 80, vx: f.facing * 560, vy: 160, gravity: 1000,
            life: 2, w: 34, zr: 24, h: 40, dmg: 20, knock: true, launch: 300, kb: 180, vanishOnGround: true,
          });
        });
      },
      pose: (f, T) => throwPose(T, 0.25),
    },
    super: {
      // 金龍出海：五道金龍追著對手咬，最後兩道把人打倒
      dur: 1.4, aiRange: 800,
      update(f, b) {
        f.vx = f.vz = 0;
        const n = f.mv.n || 0;
        if (n < 5 && f.stateT > 0.3 + n * 0.14) {
          f.mv.n = n + 1;
          const foes = b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 900);
          foes.sort((a, c) => Math.abs(a.x - f.x) - Math.abs(c.x - f.x));
          const tgt = foes.length ? foes[n % foes.length] : null;
          const last = n >= 3;
          b.spawnProj({
            owner: f, kind: 'dragon', homing: tgt, x: f.x + f.facing * 20, z: f.z, y: f.y + 90,
            vx: f.facing * rand(260, 360), vz: rand(-160, 160), life: 2.8, w: 30, zr: 28, h: 44, unblockable: true, noClash: true,
            ...(last ? { dmg: 14, knock: true, launch: 340, kb: 170, fall: 80 } : { dmg: 8, stun: 0.4, kb: 30, fall: 0 }),
          });
          b.sfx('special');
        }
      },
      pose: (f, T, t) => {
        const k = Math.floor(t * 10) % 2;
        return { aF: k ? [2.6, 0.3] : [1.57, 0], aB: k ? [1.57, 0] : [2.6, 0.3], expr: 'shout', tilt: 0.1 };
      },
    },
  },
});

// 技能冷卻秒數：沒特別指定就依原本的耗氣換算（耗 25 氣 ≈ 6 秒）
// 可選角色的技能冷卻整體縮短（敵人的招式 cost 是 0，不受影響）
export const CD_SCALE = 0.65;
export function specialCD(def) {
  const base = def.cd != null ? def.cd : def.cost * 0.24;
  return Math.round((def.cost > 0 ? base * CD_SCALE : base) * 2) / 2;
}

// 依方向取得特技定義
export function specialDef(id, kind) {
  const m = MOVES[id];
  return kind === 'up' ? m.specialUp : kind === 'down' ? m.specialDown : m.special;
}
