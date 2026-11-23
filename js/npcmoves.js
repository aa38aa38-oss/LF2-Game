// 劇情模式敵人的招式（格式跟 moves.js 一樣：start / update / pose / dur / ai）
import { MOVES } from './moves.js';
import { rand, sign, pick } from './util.js';
import { newItem } from './items.js';

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

// ───────── 第二、三關的新敵人：每個都有一招「特別」的攻擊模式 ─────────
const say = (f, b, text, color = '#ffffff') => b.fx.add({ type: 'text', x: f.x, z: f.z, y: 150, text, color, size: 20, life: 0.9 });
// 往前飛的「聲波」類飛行道具（大聲公、帶風向）
const wave = (f, b, o = {}) =>
  b.spawnProj({ owner: f, kind: 'sound', x: f.x + f.facing * 36, z: f.z, y: f.y + 66, vx: f.facing * (o.v || 380), life: o.life || 0.5, w: 26, h: 50, dmg: o.dmg || 5, stun: o.stun || 0.45, kb: 80, ...o.extra });

Object.assign(MOVES, {
  // 夜市攤販：丟塑膠椅（拋物線、落地會彈開人）
  vendor: {
    special: {
      cost: 0, cd: 6, dur: 0.55, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.28) {
          f.mv.fired = true;
          b.sfx('throw');
          say(f, b, pick(['來喔！坐啦！', '椅子給你！', '別擋路！']));
          b.spawnProj({ owner: f, kind: 'item', item: newItem('stool', 0, 0, 0), x: f.x + f.facing * 24, z: f.z, y: f.y + 90, vx: f.facing * rand(330, 420), vy: 330, gravity: 1200,
            life: 2.5, w: 26, zr: 22, h: 40, dmg: 9, knock: true, launch: 240, kb: 200, vanishOnGround: true });
        }
      },
      pose: (f, T) => ({ aF: T < 0.28 ? [-1.2, 2.2] : [2.0, 0.2], aB: T < 0.28 ? [-1.0, 2.2] : [1.6, 0.2], tilt: 0.1, expr: 'shout' }),
    },
  },
  // 發傳單工讀生：一次撒三張傳單（扇形、會定住人一下）
  canvasser: {
    special: {
      cost: 0, cd: 5, dur: 0.5, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.22) {
          f.mv.fired = true;
          b.sfx('throw');
          say(f, b, '請支持我們候選人！');
          for (const dz of [-0.35, 0, 0.35])
            b.spawnProj({ owner: f, kind: 'flyer', x: f.x + f.facing * 26, z: f.z, y: f.y + 70, vx: f.facing * 430, vz: dz * 430, life: 1.1, w: 18, zr: 14, h: 30, dmg: 4, stun: 0.35, kb: 50 });
        }
      },
      pose: (f, T) => ({ aF: T < 0.22 ? [-0.4, 1.3] : [1.7, 0.4], aB: [0.6, 1.2], tilt: 0.05, expr: 'smile' }),
    },
  },
  // 黑衣保鑣：熊抱衝撞（短距離衝刺，撞到就倒）
  bodyguard: {
    special: {
      cost: 0, cd: 6, dur: 0.6, ai: 'mid', range: 280,
      update(f, b) {
        if (f.stateT < 0.18) {
          f.vx = 0;
          if (!f.mv.said) {
            f.mv.said = true;
            say(f, b, '老闆說不准過！', '#ffd84a');
          }
          return;
        }
        if (f.stateT < 0.5) {
          f.vx = f.facing * 560;
          b.areaHit(f, { x0: -10, x1: 60, zr: 28, dmg: 10, knock: true, launch: 280, kb: 260 });
        } else f.vx *= 0.7;
      },
      pose: (f, T, t) => {
        const s = Math.sin(t * 22);
        return { tilt: 0.45, lF: [s + 0.3, -1.2], lB: [-s + 0.3, -1.2], aF: [1.4, 0.3], aB: [1.3, 0.3], expr: 'shout' };
      },
    },
  },
  // 政論名嘴：爆料大聲公（比抗議群眾的音波更遠、會讓人頭暈）
  reporter: {
    special: {
      cost: 0, cd: 6, dur: 0.6, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.25) {
          f.mv.fired = true;
          b.sfx('sound');
          say(f, b, pick(['獨家爆料！', '我有內線消息！', '據可靠消息指出…']), '#ffd84a');
          wave(f, b, { v: 460, life: 0.8, dmg: 6, extra: { dizzy: 0.8 } });
        }
      },
      pose: (f, T) => ({ aF: [1.6, 0.4], aB: [0.4, 1.6], prop: 'phone', tilt: -0.05, expr: 'shout' }),
    },
  },
  // 造勢啦啦隊：幫身邊的敵人回血（要先打她！）
  cheerleader: {
    special: {
      cost: 0, cd: 7, dur: 0.8, ai: 'mid', range: 520,
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.35) {
          f.mv.fired = true;
          b.sfx('heal');
          say(f, b, '凍蒜！凍蒜！', '#ff7ad8');
          for (const e of b.fighters) {
            if (e.team !== f.team || e.dead || e.hp <= 0 || Math.abs(e.x - f.x) > 320) continue;
            e.heal(e.maxHp * 0.3, e.maxHp * 0.3);
            for (let i = 0; i < 4; i++) b.fx.add({ type: 'heart', x: e.x + rand(-20, 20), z: e.z, y: rand(60, 130), life: 0.9 });
          }
        }
      },
      pose: (f, T, t) => ({ aF: [2.8, Math.sin(t * 16) * 0.4], aB: [2.8, -Math.sin(t * 16) * 0.4], expr: 'smile', bob: Math.abs(Math.sin(t * 14)) * 6 }),
    },
  },
  // 買票樁腳：在地上撒「買票」紅包誘惑主角（撿了會掉票）
  votebuyer: {
    special: {
      cost: 0, cd: 8, dur: 0.6, ai: 'mid', range: 420,
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.3) {
          f.mv.fired = true;
          b.sfx('coin');
          say(f, b, pick(['來，一票五百！', '拿去喝茶啦～', '這是一點心意']), '#ff9a3a');
          for (let i = 0; i < 2; i++) {
            const it = newItem('redenv', f.x + f.facing * rand(70, 170), f.z + rand(-25, 25), 140);
            it.floor = f.floor;
            it.label = pick(['買票', '賄選', '走路工']);
            b.items.push(it);
          }
        }
      },
      pose: (f, T) => ({ aF: T < 0.3 ? [0.6, 1.6] : [1.8, -0.2], aB: [0.6, 1.2], expr: 'smile' }),
    },
  },
  // 網軍小編（小王）：帶風向（三連音波）、假新聞（照片）、下線（瞬移到主角背後）
  troll: {
    special: {
      cost: 0, cd: 4.5, dur: 0.7, ai: 'proj',
      update(f, b) {
        for (const [k, at] of [['a', 0.15], ['b', 0.32], ['c', 0.49]]) {
          if (!f.mv[k] && f.stateT > at) {
            f.mv[k] = true;
            b.sfx('sound');
            wave(f, b, { v: 520, life: 0.6, dmg: 3, stun: 0.25 });
          }
        }
        if (!f.mv.said) {
          f.mv.said = true;
          say(f, b, pick(['帶風向！', '已截圖', '真的假的？']), '#9fd4ff');
        }
      },
      pose: (f, T, t) => ({ aF: [1.5, 0.3 + Math.sin(t * 30) * 0.1], aB: [1.2, 0.5], prop: 'phone', expr: 'smile' }),
    },
    specialUp: {
      name: '假新聞', cost: 0, cd: 7, dur: 0.5, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.2) {
          f.mv.fired = true;
          b.sfx('throw');
          b.spawnProj({ owner: f, kind: 'photo', x: f.x + f.facing * 30, z: f.z, y: f.y + 70, vx: f.facing * 420, life: 1.6, w: 22, h: 44, dmg: 5, stun: 0.4, kb: 60, scandal: 600 });
        }
      },
      pose: (f, T) => ({ aF: T < 0.2 ? [-0.4, 1.3] : [1.6, 0], aB: [0.5, 1.5], tilt: 0.1, expr: 'smile' }),
    },
    specialDown: {
      name: '下線', cost: 0, cd: 7, dur: 0.4, ai: 'mid', range: 400,
      start(f) {
        f.invuln = 0.4;
      },
      update(f, b) {
        if (!f.mv.done && f.stateT > 0.15) {
          f.mv.done = true;
          const t = b.enemiesOf(f)[0];
          if (t) {
            b.fx.add({ type: 'ring', x: f.x, z: f.z, y: 60, life: 0.3, r: 60, color: '#9fd4ff' });
            f.x = t.x - (t.facing || 1) * 90;
            f.z = t.z;
            f.facing = sign(t.x - f.x) || 1;
            say(f, b, '我在你後面', '#9fd4ff');
          }
        }
      },
      pose: () => ({ aF: [0.3, 1.9], aB: [0.3, 1.9], prop: 'phone', expr: 'smile' }),
    },
  },
  // 直播網紅（第三關小王）：直播閃光（定住）、留言轟炸、叫粉絲（啦啦隊）
  influencer: {
    special: {
      cost: 0, cd: 5, dur: 0.7, ai: 'close', range: 200,
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.35) {
          f.mv.fired = true;
          b.sfx('camera');
          b.fx.add({ type: 'headflash', x: f.x + f.facing * 26, z: f.z, y: 100, dir: f.facing, life: 0.3 });
          say(f, b, '大家好～我正在直播！', '#ff7ad8');
          b.areaHit(f, { x0: -5, x1: 200, zr: 40, dmg: 5, dizzy: 0.8, kb: 0, fall: 0, unblockable: true });
        }
      },
      pose: (f, T) => ({ aF: [1.8, 0.4], aB: [0.6, 1.4], prop: 'phone', expr: 'smile' }),
    },
    specialUp: {
      name: '留言轟炸', cost: 0, cd: 6, dur: 0.9, ai: 'proj',
      update(f, b) {
        for (const [k, at] of [['a', 0.1], ['b', 0.3], ['c', 0.5], ['d', 0.7]]) {
          if (!f.mv[k] && f.stateT > at) {
            f.mv[k] = true;
            b.sfx('throw');
            b.spawnProj({ owner: f, kind: 'flyer', x: f.x + f.facing * 26, z: f.z + rand(-20, 20), y: f.y + rand(50, 100), vx: f.facing * 500, life: 1, w: 18, zr: 14, h: 30, dmg: 3, stun: 0.2, kb: 40 });
          }
        }
      },
      pose: (f, T, t) => ({ aF: [1.6, 0.3 + Math.sin(t * 30) * 0.15], aB: [1.2, 0.5], prop: 'phone', expr: 'smile' }),
    },
    specialDown: {
      name: '叫粉絲', cost: 0, cd: 14, dur: 0.8, ai: 'summon',
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.4) {
          f.mv.fired = true;
          say(f, b, '粉絲們！來幫我！', '#ff7ad8');
          b.sfx('cutin');
          if (b.summon) b.summon('cheerleader', 1, f, true);
        }
      },
      pose: (f, T, t) => ({ aF: [2.6 + Math.sin(t * 12) * 0.3, 0.2], aB: [2.4, 0.2], expr: 'shout' }),
    },
  },
  // 財團董事長（第二關小王）：撒鈔票（扇形硬幣）、推土機衝撞、叫保鑣
  tycoon: {
    special: {
      cost: 0, cd: 5, dur: 0.6, ai: 'proj',
      update(f, b) {
        if (!f.mv.fired && f.stateT > 0.3) {
          f.mv.fired = true;
          b.sfx('coin');
          say(f, b, '有錢能使鬼推磨！', '#ffd84a');
          for (const dz of [-0.4, -0.15, 0.15, 0.4])
            b.spawnProj({ owner: f, kind: 'coin', x: f.x + f.facing * 26, z: f.z, y: f.y + 80, vx: f.facing * 420, vz: dz * 420, life: 1.2, w: 16, zr: 14, h: 24, dmg: 5, stun: 0.3, kb: 60 });
        }
      },
      pose: (f, T) => ({ aF: T < 0.3 ? [-0.6, 1.4] : [1.9, 0], aB: [1.2, 0.6], tilt: 0.1, expr: 'smile' }),
    },
    specialUp: MOVES.kingpin.specialUp,
    specialDown: {
      name: '叫保鑣', cost: 0, cd: 14, dur: 0.8, ai: 'summon',
      update(f, b) {
        f.vx = f.vz = 0;
        if (!f.mv.fired && f.stateT > 0.4) {
          f.mv.fired = true;
          say(f, b, '保鑣！給我處理掉！', '#ffd84a');
          b.sfx('cutin');
          if (b.summon) b.summon('bodyguard', 2, f, true);
        }
      },
      pose: (f, T, t) => ({ aF: [2.6 + Math.sin(t * 12) * 0.3, 0.2], aB: [2.4, 0.2], expr: 'shout' }),
    },
    super: MOVES.kingpin.super,
  },
});
// 幕後藏鏡人（第三關小王）沿用角頭樁腳王的招式（叫小弟會依關卡換成該關的小弟）
MOVES.mastermind = MOVES.kingpin;
