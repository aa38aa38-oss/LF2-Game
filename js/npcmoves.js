// 劇情模式敵人的招式（格式跟 moves.js 一樣：start / update / pose / dur / ai）
import { MOVES } from './moves.js';
import { rand, sign } from './util.js';

const firecracker = (f, b, vx, vy = 300, extra = {}) =>
  b.spawnProj({
    owner: f, kind: 'firecracker', x: f.x + f.facing * 24, z: f.z + rand(-6, 6), y: f.y + 80, vx, vy, gravity: 1300,
    life: 3, w: 18, zr: 20, h: 30, dmg: 5, stun: 0.3, kb: 40, vanishOnGround: true,
    landBlast: { r: 62, zr: 30, dmg: 7, knock: true, launch: 260, kb: 140 }, ...extra,
  });

Object.assign(MOVES, {
  // 陣頭小弟：丟鞭炮
  gang: {
    special: {
      cost: 0, cd: 8, dur: 0.5, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.22) {
          f.mv.fired = true;
          b.sfx('throw');
          firecracker(f, b, f.facing * rand(300, 380));
        }
      },
      pose: (f, T) => ({ aF: T < 0.22 ? [-0.6, 1.4] : [1.7, 0], aB: [0.4, 1.6], tilt: 0.15, expr: 'shout' }),
    },
  },

  // 抗議群眾：大聲公（近距離音波，會定住人）
  protester: {
    special: {
      cost: 0, cd: 6, dur: 0.6, ai: 'close', range: 110,
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.25) {
          f.mv.fired = true;
          b.sfx('sound');
          b.fx.add({ type: 'text', x: f.x + f.facing * 40, z: f.z, y: 130, text: f.mv.say || '司法不公！', color: '#ffffff', size: 20, life: 0.9 });
          b.spawnProj({
            owner: f, kind: 'sound', x: f.x + f.facing * 36, z: f.z, y: f.y + 66, vx: f.facing * 380,
            life: 0.45, w: 26, h: 50, dmg: 6, stun: 0.55, kb: 90,
          });
        }
      },
      start(f) {
        f.mv.say = ['司法不公！', '司法迫害！', '還我公道！', '下台！下台！'][Math.floor(Math.random() * 4)];
      },
      pose: () => ({ aF: [1.6, 0.2], aB: [0.6, 1.5], tilt: 0.1, expr: 'shout', prop: 'mic' }),
    },
  },

  // 偷拍狗仔（小王）：閃光偷拍（扣票）、緋聞合成照（扣票）、開溜
  paparazzi: {
    special: {
      cost: 0, cd: 4.5, dur: 0.7, ai: 'close', range: 190,
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.35) {
          f.mv.fired = true;
          b.sfx('camera');
          b.fx.add({ type: 'headflash', x: f.x + f.facing * 26, z: f.z, y: 100, dir: f.facing, life: 0.3 });
          b.fx.add({ type: 'text', x: f.x, z: f.z, y: 140, text: '喀嚓！', color: '#ffffff', size: 24, life: 0.7 });
          b.areaHit(f, { x0: -5, x1: 200, zr: 40, dmg: 5, dizzy: 1.0, kb: 0, fall: 0, unblockable: true, scandal: 1200 });
        }
      },
      pose: (f, T) => ({ aF: [1.6, 0.2], aB: [1.3, 0.4], prop: 'phone', tilt: T < 0.35 ? -0.05 : 0.1, expr: 'smile' }),
    },
    specialUp: {
      name: '緋聞合成照', cost: 0, cd: 6, dur: 0.5, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.2) {
          f.mv.fired = true;
          b.sfx('throw');
          b.spawnProj({
            owner: f, kind: 'photo', x: f.x + f.facing * 30, z: f.z, y: f.y + 70, vx: f.facing * 420,
            life: 1.6, w: 22, h: 44, dmg: 6, stun: 0.45, kb: 60, scandal: 900,
          });
        }
      },
      pose: (f, T) => ({ aF: T < 0.2 ? [-0.4, 1.3] : [1.6, 0], aB: [0.5, 1.5], tilt: 0.1, expr: 'smile' }),
    },
    specialDown: {
      name: '開溜', cost: 0, cd: 5, dur: 0.45, ai: 'escape',
      start(f) {
        f.invuln = 0.45;
      },
      update(f) {
        f.vx = -f.facing * 520;
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 24);
        return { tilt: -0.2, lF: [s + 0.2, -1.2], lB: [-s + 0.2, -1.2], aF: [0.3, 1.9], aB: [0.3, 1.9], expr: 'smile', prop: 'phone' };
      },
    },
  },

  // 角頭樁腳王（第一關 Boss）
  kingpin: {
    special: {
      // 鞭炮陣：一次丟三串鞭炮
      cost: 0, cd: 5, dur: 0.65, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.3) {
          f.mv.fired = true;
          b.sfx('throw');
          for (const [v, dz] of [[300, -40], [390, 0], [480, 40]]) firecracker(f, b, f.facing * v, 320, { vz: dz });
        }
      },
      pose: (f, T) => ({ aF: T < 0.3 ? [-0.6, 1.4] : [1.9, 0], aB: [1.2, 0.6], tilt: 0.1, expr: 'shout' }),
    },
    specialUp: {
      name: '角頭衝撞', cost: 0, cd: 6, dur: 0.75, ai: 'mid', range: 360,
      update(f, b) {
        if (f.stateT < 0.2) {
          f.vx = 0;
          return;
        }
        if (f.stateT < 0.62) {
          f.vx = f.facing * 640;
          b.areaHit(f, { x0: -10, x1: 70, zr: 30, dmg: 16, knock: true, launch: 360, kb: 320, heavy: true });
          f.mv.d = (f.mv.d || 0) - 1 / 60;
          if (f.mv.d <= 0) {
            f.mv.d = 0.06;
            b.fx.add({ type: 'dust', x: f.x - f.facing * 20, z: f.z, y: 0, life: 0.4 });
          }
        } else f.vx *= 0.7;
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 22);
        return { tilt: 0.55, lF: [s + 0.3, -1.2], lB: [-s + 0.3, -1.2], aF: [0.4, 0.5], aB: [0.2, 0.5], expr: 'shout' };
      },
    },
    specialDown: {
      name: '叫小弟', cost: 0, cd: 14, dur: 0.8, ai: 'summon',
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.4) {
          f.mv.fired = true;
          b.fx.add({ type: 'text', x: f.x, z: f.z, y: 150, text: '小弟們！給我上！', color: '#ffd84a', size: 22, life: 1.2 });
          b.sfx('cutin');
          if (b.summon) b.summon('gang', 2, f);
        }
      },
      pose: () => ({ aF: [2.8, 0.2], aB: [0.6, 1.5], expr: 'shout', tilt: -0.1 }),
    },
    super: {
      // 鞭炮雨：對手附近一直下鞭炮
      dur: 2.2, aiRange: 700,
      update(f, b) {
        f.vx = f.vz = 0;
        f.mv.c = (f.mv.c || 0) - 1 / 60;
        if (f.mv.c <= 0 && f.stateT > 0.3 && f.stateT < 1.9) {
          f.mv.c = 0.16;
          for (const e of b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 800)) {
            b.spawnProj({
              owner: f, kind: 'firecracker', x: e.x + rand(-60, 60), z: e.z + rand(-16, 16), y: 420, vy: -200, gravity: 1300,
              life: 3, w: 16, zr: 18, h: 30, dmg: 3, stun: 0.25, kb: 20, vanishOnGround: true, unblockable: true,
              landBlast: { r: 48, zr: 24, dmg: 4, stun: 0.3, kb: 40, fall: 10 },
            });
          }
          b.sfx('coin');
        }
      },
      pose: (f, T, t) => ({ aF: [2.6 + Math.sin(t * 12) * 0.3, 0.2], aB: [2.4, 0.2], expr: 'shout', bob: Math.abs(Math.sin(t * 8)) * 3 }),
    },
  },
});
