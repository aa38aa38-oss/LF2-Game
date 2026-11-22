// 劇情模式：一路打到當選總統。第一關「議員選舉」
// 地圖是「樓層式 2.5D」：每層樓是一段可以前後走的地板，用不同的前後深度（z）表示，
// 所以不同樓層的人自然打不到彼此；樓層之間用鷹架樓梯連接，鏡頭會上下左右跟著走。
import { BattleScene } from './battle.js';
import { AI } from './ai.js';
import { CHARS, CHAR_BY_ID } from './characters.js';
import './npcmoves.js';
import { newItem } from './items.js';
import { ARENA, rand, pick, clamp, easeOut } from './util.js';
import { txt, pixelText, panel, segBar, blink } from './ui.js';
import { drawStage1 } from './story_art.js';

const FY = ARENA.floorY;
const STREET = { zMin: 0, zMax: 186 };

// ───────── 第一關的地圖資料 ─────────
export const STAGE1 = {
  id: 1,
  name: '議員選舉',
  sub: '廟口老街 → 菜市場公寓 → 宮廟廣場',
  goal: 25000,
  worldW: 6000,
  floors: [
    { id: 0, name: '老街', xMin: 40, xMax: 2760, ...STREET },
    { id: 1, name: '二樓陽台', xMin: 2330, xMax: 3720, zMin: -210, zMax: -130 },
    { id: 2, name: '頂樓', xMin: 2960, xMax: 3930, zMin: -470, zMax: -390 },
    { id: 3, name: '宮廟廣場', xMin: 3800, xMax: 5900, ...STREET },
  ],
  apt: { x0: 2300, x1: 3960, roofZ: -470 },
  temple: { x: 5000 },
  // 斜坡：從 bot 樓層後緣的 xb，斜斜走到 top 樓層前緣的 xt
  ramps: [
    { bot: 0, top: 1, xb: 2390, xt: 2580 },
    { bot: 1, top: 2, xb: 3240, xt: 3450 },
    { bot: 3, top: 2, xb: 4020, xt: 3830 },
  ],
  checkpoints: [
    { floor: 0, x: 200, z: 95 },
    { floor: 1, x: 2620, z: -150 },
    { floor: 3, x: 4080, z: 40 },
  ],
  gateX: 4700,
  // 波次：玩家走到 x 就出敵人，並鎖住畫面直到打完
  waves: [
    { floor: 0, x: 480, lock: [60, 1060], cp: 0, spawn: [['gang', 'R'], ['gang', 'R'], ['protester', 'R'], ['gang', 'L'], ['gang', 'R']] },
    { floor: 0, x: 1300, lock: [860, 1860], cp: 0, spawn: [['gang', 'R'], ['protester', 'L'], ['gang', 'R'], ['protester', 'R'], ['gang', 'L'], ['gang', 'R']] },
    { floor: 0, x: 2100, lock: [1760, 2760], cp: 0, spawn: [['gang', 'R'], ['gang', 'R'], ['gang', 'L'], ['protester', 'R'], ['protester', 'L'], ['gang', 'R']], after: '↗ 走到右邊的斜坡，按「上」走上去' },
    { floor: 1, x: 2700, lock: [2330, 3330], cp: 1, spawn: [['gang', 'R'], ['protester', 'R'], ['gang', 'R'], ['gang', 'L'], ['gang', 'R']] },
    { floor: 2, x: 3200, lock: [2960, 3930], cp: 1, spawn: [['paparazzi', 'R', { mid: true }], ['gang', 'L'], ['gang', 'R']], title: '小王登場：偷拍狗仔', after: '↘ 從右邊的斜坡走下去' },
    { floor: 3, x: 4150, lock: [3800, 4700], cp: 2, spawn: [['gang', 'R'], ['protester', 'R'], ['gang', 'R'], ['gang', 'L'], ['protester', 'L'], ['gang', 'R']] },
  ],
  // 得票不夠時，在封鎖線前出現的「拉票」波次（可以重複）
  rally: { floor: 3, lock: [3800, 4700], spawn: [['gang', 'R'], ['protester', 'R'], ['gang', 'L'], ['gang', 'R'], ['gang', 'L']] },
  boss: { floor: 3, x: 4950, lock: [4620, 5620], id: 'kingpin' },
  // 路上的道具：補血（便當、珍奶）、紅包（回血但扣票），走過去就自動吃
  items: [
    ['bento', 0, 760, 150],
    ['redenv', 0, 1640, 160],
    ['bento', 0, 1980, 70],
    ['bento', 1, 2950, -170],
    ['boba', 2, 3150, -440],
    ['redenv', 2, 3600, -420],
    ['bento', 2, 3780, -440],
    ['bento', 3, 4350, 120],
    ['redenv', 3, 4500, 60],
    ['bento', 3, 4620, 150],
    ['boba', 3, 5100, 90],
  ],
  taxi: { floor: 0, from: 1850, to: 2700 },
};

const VOTES = { gang: 1200, protester: 1000, paparazzi: 5000, kingpin: 12000, rival: 6000 };
// 小怪血很少（兩三下就倒，打起來爽）；小王、Boss 才耐打
const HPMUL = { gang: 0.05, protester: 0.05, paparazzi: 0.35, kingpin: 0.6 };

// 環境傷害（計程車）的來源
const ENV = { team: 9, x: 0, facing: 1, state: 'idle', combo: 0, comboT: 0, mp: 0, superDealt: null, char: { id: 'env', mul: { pow: 1 }, color: '#f4c20d' }, stats: { dmg: 0, maxCombo: 0, kos: 0 } };

export class StoryScene extends BattleScene {
  constructor(game, cfg) {
    super(game, { ...cfg, mode: 'story', stage: 'legislature' });
  }

  enter() {
    const cfg = this.cfg;
    super.enter();
    const L = (this.L = STAGE1);
    this.worldW = L.worldW;
    this.noRandomItems = true;
    this.fighters = [];
    this.items = [];
    this.votes = cfg.votes || 0;
    this.cp = cfg.cp || 0;
    // 排行榜看通關時間：從中途點重來也接著算
    this.clock = cfg.clock || 0;
    this.kneels = cfg.kneels || 0;
    this.taxiT = 4;
    this.gateOpen = false;
    this.wavesDone = new Set();
    this.waveActive = null;
    this.bossOn = false;
    this.hint = null;
    this.popups = [];
    this.queue = [];
    this.scandalFx = null;
    this.cpVotes = this.votes;
    // 已經過的波次（從中途點開始時）直接跳過
    L.waves.forEach((w, i) => {
      if (w.cp < this.cp) this.wavesDone.add(i);
    });
    const cp = L.checkpoints[this.cp];
    this.player = this.addFighter(cfg.playerChar, { ctrl: this.g.input.p1, team: 0, x: cp.x, z: cp.z, facing: 1, label: 'P1' });
    this.setFloor(this.player, cp.floor);
    for (const [kind, fl, x, z] of L.items) {
      if (L.checkpoints[this.cp].floor === 3 && fl !== 3) continue;
      const it = newItem(kind, x, z, 0);
      it.floor = fl;
      this.items.push(it);
    }
    this.cam = { x: cp.x - 480, y: 0 };
    this.updateCamera(0, true);
    this.stage = { id: 'story1', name: L.name, draw: (ctx, t, x0, x1) => drawStage1(ctx, t, x0, x1, L, this.cam, this.gateOpen) };
    this.setPhase('intro');
    this.onKO = (t) => this.gainVotes(t);
    this.onScandal = (t, n) => {
      if (t !== this.player) return;
      this.addVotes(-n, '醜聞！');
      this.scandalFx = { t: 0, n };
    };
    this.onVotes = (f, n, msg) => {
      if (f === this.player) this.addVotes(n, msg);
    };
  }

  // 遊戲內計時的延遲動作（暫停時不會跑）
  later(sec, fn) {
    this.queue.push({ at: this.time + sec, fn });
  }
  runQueue() {
    const due = this.queue.filter((q) => this.time >= q.at);
    this.queue = this.queue.filter((q) => this.time < q.at);
    for (const q of due) q.fn();
  }

  // 中途點、Boss 戰前回血
  refill(r, msg) {
    const P = this.player;
    P.heal(P.maxHp * r, P.maxHp * r);
    this.popups.push({ t: 0, text: msg, color: '#5cff7a', x: P.x, z: P.z });
    this.sfx('heal');
  }

  setFloor(f, id) {
    const F = this.L.floors[id];
    f.floor = id;
    f.bounds = { xMin: F.xMin, xMax: F.xMax, zMin: F.zMin, zMax: F.zMax };
  }

  // ───── 敵人 ─────
  spawnEnemy(id, side, floorId, opt = {}) {
    const F = this.L.floors[floorId];
    const lock = this.waveActive ? this.waveActive.lock : [F.xMin, F.xMax];
    const vw = this.viewW || 960;
    const camL = this.cam.x, camR = this.cam.x + vw;
    let x = side === 'L' ? Math.max(F.xMin, Math.min(lock[0] + 30, camL - 40)) : Math.min(F.xMax, Math.max(lock[1] - 30, camR + 40));
    if (opt.x != null) x = opt.x;
    const z = rand(F.zMin + 10, F.zMax - 10);
    const cid = id === 'rival' ? opt.cid : id;
    const f = this.addFighter(cid, {
      cpu: true, team: 1, x, z, facing: side === 'L' ? 1 : -1, label: 'CPU',
      hpMul: id === 'rival' ? 0.55 : HPMUL[id] || 0.4, scale: id === 'kingpin' ? 1.3 : 1, votes: VOTES[id] || 1000,
    });
    // 小怪比較笨、Boss 和對手比較聰明（再依玩家選的難度微調）
    const base = { easy: 0, normal: 1, hard: 2 }[this.cfg.difficulty || 'normal'];
    const lv = (id === 'kingpin' || id === 'rival' || id === 'paparazzi' ? 0.5 : 0) + base - 1;
    const diff = lv >= 1 ? 'hard' : lv >= 0 ? 'normal' : 'easy';
    f.ai = new AI(f, diff);
    f.ctrl = f.ai.ctrl;
    f.npcKind = id;
    f.mob = id === 'gang' || id === 'protester';
    f.mp = id === 'kingpin' ? 40 : 0;
    this.setFloor(f, floorId);

    return f;
  }
  summon(id, n, near) {
    for (let i = 0; i < n; i++) this.spawnEnemy(id, i % 2 ? 'L' : 'R', near.floor);
  }
  enemiesAlive() {
    return this.fighters.filter((f) => f.team !== 0 && !f.dead && f.hp > 0);
  }

  // ───── 得票 ─────
  gainVotes(t) {
    if (t.team === 0) return;
    this.addVotes(t.votes || 1000, '');
    // 越南大戰式的爽快倒地：小怪慘叫著飛出去，偶爾掉補血或武器
    if (t.npcKind !== 'kingpin') {
      const dir = Math.sign(t.x - this.player.x) || 1;
      t.vx = dir * 620;
      t.vy = Math.max(t.vy, 560);
      t.y = Math.max(t.y, 2);
      this.fx.add({ type: 'spark', x: t.x, z: t.z, y: 60, life: 0.35, big: true, color: '#ffffff' });
      this.fx.add({ type: 'ring', x: t.x, z: t.z, y: 0, life: 0.4, r: 140, color: '#ffd84a' });
      this.fx.add({ type: 'text', x: t.x, z: t.z, y: 150, text: pick(['啊～～！', '哇啊！', '救命啊！', '我錯了！', '下次不敢了！']), color: '#ffffff', size: 22, life: 0.9 });
      this.shake(6, 0.15);
      t.hitstop = Math.max(t.hitstop || 0, 0.06);
      if (Math.random() < 0.35) {
        const kind = pick(['bento', 'bento', 'boba']);
        const it = newItem(kind, t.x, t.z, 160);
        it.floor = t.floor;
        this.items.push(it);
      }
    }
  }
  addVotes(n, msg = '') {
    this.votes = Math.max(0, this.votes + n);
    const P = this.player;
    this.popups.push({ t: 0, text: `${msg}${n > 0 ? '+' : ''}${n.toLocaleString()} 票`, color: n > 0 ? '#5cff7a' : '#ff5a5a', x: P.x, z: P.z });
    this.sfx(n > 0 ? 'coin' : 'block');
  }

  // ───── 鏡頭：左右上下都跟著玩家 ─────
  updateCamera(dt, snap = false) {
    const g = this.g;
    const touch = document.body.classList.contains('touch');
    this.zoom = touch ? 1.3 : 1;
    const viewW = g.CW / this.zoom, viewH = 540 / this.zoom;
    this.viewW = viewW;
    this.viewH = viewH;
    const P = this.player;
    if (!P || !this.L) {
      this.cam.y = 540 - viewH;
      return;
    }
    let lo = 0, hi = this.L.worldW - viewW;
    const lk = (this.waveActive && this.waveActive.lock) || (this.bossOn && this.L.boss.lock);
    if (lk) {
      lo = Math.max(lo, lk[0] - 60);
      hi = Math.min(hi, lk[1] + 60 - viewW);
      if (hi < lo) hi = lo = (lk[0] + lk[1]) / 2 - viewW / 2;
    }
    const margin = touch ? viewW * 0.3 : 0;
    const tx = clamp(P.x - viewW / 2, lo - margin, hi + margin);
    const sy = FY + P.z - P.y;
    const ty = clamp(sy - viewH * 0.68, -560, 560 - viewH);
    const k = snap ? 1 : Math.min(1, dt * 6);
    this.cam.x += (tx - this.cam.x) * k;
    this.cam.y += (ty - this.cam.y) * k;
  }

  // ───── 流程 ─────
  updatePhase(dt) {
    const T = this.phaseT;
    const P = this.player;
    if (this.phase === 'intro') {
      if (T > 2.4) {
        this.setPhase('fight');
        this.say('GO!', 0.8, '#5cff7a');
        this.sfx('fight');
      }
      return;
    }
    if (this.phase === 'lost' || this.phase === 'won') return;
    if (this.phase === 'dead') {
      if (T > 1.8) {
        this.setPhase('lost');
        this.lostSel = 0;
      }
      return;
    }
    if (this.phase === 'kneel') return this.updateKneel(dt);
    // fight
    this.clock += dt;
    this.runQueue();
    for (const p of this.popups) p.t += dt;
    this.popups = this.popups.filter((p) => p.t < 1.4);
    if (this.scandalFx) {
      this.scandalFx.t += dt;
      if (this.scandalFx.t > 1.6) this.scandalFx = null;
    }
    // 倒地的敵人過一陣子消失
    for (const f of this.fighters) {
      if (f.team !== 0 && f.dead) {
        f.goneT = (f.goneT || 0) + dt;
      }
    }
    this.fighters = this.fighters.filter((f) => !(f.goneT > 1.3));
    if (P.hp <= 0) {
      this.setPhase('dead');
      this.say('落選…', 1.8, '#ff5a5a');
      this.sfx('ko');
      return;
    }
    this.updateLadders(dt);
    this.updateWaves();
    this.updateTaxi(dt);
    this.hint = this.ladderHint();
  }

  updateWaves() {
    const P = this.player, L = this.L;
    if (this.waveActive) {
      const w = this.waveActive;
      const bossDown = w.boss && this.boss && this.boss.hp <= 0;
      if (bossDown || (!this.enemiesAlive().length && !this.queue.length)) {
        this.waveActive = null;
        this.setFloor(P, P.floor);
        if (w.boss) return this.winStage();
        this.say('GO →', 1.2, '#5cff7a');
        if (w.after) this.popups.push({ t: -1.2, text: w.after, color: '#ffd84a', x: P.x, z: P.z, big: true });
        this.sfx('confirm');
      }
      return;
    }
    // 開新的波次
    L.waves.forEach((w, i) => {
      if (this.waveActive || this.wavesDone.has(i) || P.floor !== w.floor || P.x < w.x) return;
      this.wavesDone.add(i);
      // 走到這裡就記中途點
      if (w.cp > this.cp) {
        this.cp = w.cp;
        this.cpVotes = this.votes;
        this.refill(0.5, '中途點：回血！');
      }
      this.startWave(w);
    });
    if (this.waveActive) return;
    // 中途點
    L.checkpoints.forEach((c, i) => {
      if (i > this.cp && P.floor === c.floor && Math.abs(P.x - c.x) < 200) {
        this.cp = i;
        this.cpVotes = this.votes;
        this.say('中途點', 1, '#9fd4ff');
        this.refill(0.5, '中途點：回血！');
      }
    });
    // 選務封鎖線
    if (!this.gateOpen && P.floor === 3) {
      if (this.votes >= L.goal) {
        this.gateOpen = true;
        this.say('得票過門檻！封鎖線打開', 1.6, '#5cff7a');
        this.sfx('confirm');
      } else if (P.x > L.gateX - 120) {
        P.x = Math.min(P.x, L.gateX - 30);
        this.say(`還差 ${(L.goal - this.votes).toLocaleString()} 票！再去拉票`, 1.6, '#ffd84a');
        this.startWave({ ...L.rally, x: P.x });
      }
    }
    if (this.gateOpen && P.floor === 3 && P.x < L.gateX - 30 && P.bounds.xMax !== L.floors[3].xMax) this.setFloor(P, 3);
    if (!this.gateOpen && P.floor === 3) P.bounds.xMax = Math.min(P.bounds.xMax, L.gateX - 30);
    // Boss
    if (this.gateOpen && !this.bossOn && P.floor === 3 && P.x > L.boss.x - 250) this.startBoss();
  }

  startWave(w) {
    const P = this.player;
    this.waveActive = w;
    P.bounds = { ...P.bounds, xMin: w.lock[0], xMax: w.lock[1] };
    if (w.title) this.say(w.title, 1.6, '#ff9a3a');
    w.spawn.forEach(([id, side, opt], i) => this.later(i * 0.45, () => this.spawnEnemy(id, side, w.floor, opt || {})));
  }

  startBoss() {
    const L = this.L, P = this.player;
    this.bossOn = true;
    const w = { floor: 3, lock: L.boss.lock, boss: true, spawn: [] };
    this.waveActive = w;
    P.bounds = { ...P.bounds, xMin: w.lock[0], xMax: w.lock[1] };
    // 只有一個有長血條的 Boss，打到一半會叫小弟
    this.boss = this.spawnEnemy('kingpin', 'R', 3, { x: Math.min(L.boss.lock[1] - 40, this.cam.x + this.viewW + 60) });
    this.later(3, () => this.boss && !this.boss.dead && this.spawnEnemy('gang', 'L', 3));
    this.say('BOSS：角頭樁腳王', 2, '#ff5a3c');
    this.popups.push({ t: 0, text: `「${CHAR_BY_ID.kingpin.quote}」`, color: '#ff9a3a', x: L.boss.x + 200, z: 20, big: true });
    this.refill(0.4, '支持者應援：回血！');
    this.sfx('cutin');
  }

  winStage() {
    this.setPhase('won');
    this.wonT = 0;
    this.sfx('confirm');
    this.g.audio.playBgm('menu');
    for (const f of this.fighters) if (f !== this.player && !f.dead) f.hp = 0;
    if (!this.player.airborne) this.player.setState('victory');
  }

  // ───── 斜坡 ─────
  nearRamp() {
    const P = this.player;
    for (const r of this.L.ramps) {
      const B = this.L.floors[r.bot], T = this.L.floors[r.top];
      if (P.floor === r.bot && Math.abs(P.x - r.xb) < 55 && P.z <= B.zMin + 30) return { r, dir: 'up', toward: Math.sign(r.xt - r.xb) };
      if (P.floor === r.top && Math.abs(P.x - r.xt) < 55 && P.z >= T.zMax - 30) return { r, dir: 'down', toward: Math.sign(r.xb - r.xt) };
    }
    return null;
  }
  ladderHint() {
    if (this.waveActive || this.player.climb) return null;
    const n = this.nearRamp();
    if (!n) return null;
    const arrow = n.dir === 'up' ? (n.toward > 0 ? '↗' : '↖') : n.toward > 0 ? '↘' : '↙';
    return n.dir === 'up' ? `${arrow} 按「上」走上斜坡` : `${arrow} 按「下」走下斜坡`;
  }
  updateLadders(dt) {
    const P = this.player, c = P.ctrl;
    if (P.climb) {
      // 沿著斜坡斜斜地走過去（x 和前後深度一起變）
      const k = P.climb;
      k.t += dt;
      const p = Math.min(1, k.t / k.dur);
      P.x = k.x0 + (k.x1 - k.x0) * p;
      P.z = k.z0 + (k.z1 - k.z0) * p;
      P.y = 0;
      P.state = 'walk';
      P.facing = Math.sign(k.x1 - k.x0) || P.facing;
      if (p >= 1) {
        P.climb = null;
        this.setFloor(P, k.to);
        P.z = clamp(P.z, P.bounds.zMin, P.bounds.zMax);
        P.setState('idle');
      }
      return;
    }
    if (this.waveActive || !['idle', 'walk', 'run'].includes(P.state)) return;
    const n = this.nearRamp();
    if (!n) return;
    const dx = (c.held('right') ? 1 : 0) - (c.held('left') ? 1 : 0);
    const go = n.dir === 'up' ? c.held('up') : c.held('down');
    if (go || (dx === n.toward && Math.abs(P.vz) < 1 && ((n.dir === 'up' && P.z <= this.L.floors[n.r.bot].zMin + 8) || (n.dir === 'down' && P.z >= this.L.floors[n.r.top].zMax - 8)))) {
      const { r } = n;
      const to = n.dir === 'up' ? r.top : r.bot;
      const T = this.L.floors[to];
      const x0 = P.x, x1 = n.dir === 'up' ? r.xt : r.xb;
      const z1 = n.dir === 'up' ? T.zMax - 10 : T.zMin + 10;
      P.climb = { t: 0, dur: Math.hypot(x1 - x0, z1 - P.z) / 280 + 0.1, x0, x1, z0: P.z, z1, to };
      P.vx = P.vz = P.vy = 0;
    }
  }

  // ───── 計程車（小黃）：在街上橫衝直撞 ─────
  updateTaxi(dt) {
    const tx = this.L.taxi, P = this.player;
    if (P.floor !== tx.floor || P.x < tx.from - 300 || P.x > tx.to + 200) return;
    this.taxiT -= dt;
    if (this.taxiT <= 0) {
      this.taxiT = rand(5, 8);
      const F = this.L.floors[tx.floor];
      const z = clamp(P.z + rand(-30, 30), F.zMin + 20, F.zMax - 20);
      const fromRight = Math.random() < 0.6;
      this.popups.push({ t: 0, text: '叭叭！小黃來了！', color: '#f4c20d', x: P.x + (fromRight ? 260 : -260), z, warn: true });
      this.sfx('cutin');
      this.later(0.9, () => {
        const x = fromRight ? this.cam.x + this.viewW + 150 : this.cam.x - 150;
        this.spawnProj({
          owner: ENV, team: 9, kind: 'taxi', x, z, y: 0, vx: fromRight ? -820 : 820, life: 3.5, w: 64, zr: 26, h: 80,
          dmg: 14, knock: true, launch: 300, kb: 380, unblockable: true, pierce: true, noClash: true,
        });
      });
    }
  }

  // ───── 選前驚天一跪：原地滿血復活（多算 10 秒時間） ─────
  kneel() {
    const P = this.player;
    this.kneels++;
    this.clock += 10;
    this.setPhase('kneel');
    P.dead = false;
    P.hp = 1;
    P.setState('pick');
    P.vx = P.vz = P.vy = 0;
    P.y = 0;
    this.say('選前驚天一跪！', 2, '#ffe14a');
    this.sfx('cutin');
  }
  updateKneel(dt) {
    const P = this.player, T = this.phaseT;
    P.state = 'pick';
    P.stateT = 0.05;
    P.mv.kneelT = T;
    if (Math.random() < 0.035) this.popups.push({ t: 0, text: pick(['拜託！拜託！', '請給我一個機會！', '凍蒜！', '同情票灌進來！', '含淚下跪…']), color: '#ffffff', x: P.x + rand(-160, 160), z: P.z + rand(-20, 20) });
    for (const p of this.popups) p.t += dt;
    this.popups = this.popups.filter((p) => p.t < 1.4);
    if (T > 2) {
      P.hp = P.maxHp;
      P.cap = P.maxHp;
      P.mp = 100;
      P.invuln = 2.5;
      P.setState('idle');
      // 起身震開身邊的敵人
      this.fx.add({ type: 'ring', x: P.x, z: P.z, y: 0, life: 0.6, r: 320, color: '#ffe14a' });
      this.shake(10, 0.4);
      for (const e of this.enemiesOf(P)) {
        if (Math.abs(e.x - P.x) < 260) this.applyHit(P, e, { dmg: 0.1, knock: true, launch: 360, kb: 380, unblockable: true, dir: Math.sign(e.x - P.x) || 1 });
      }
      this.setPhase('fight');
      this.say('滿血復活！', 1.2, '#5cff7a');
      this.sfx('confirm');
    }
  }

  // ───── 接關 ─────
  update(dt) {
    if (this.phase === 'lost') {
      const c = this.g.input.p1;
      if (c.pressed('up') || c.pressed('left')) {
        this.lostSel = (this.lostSel + 2) % 3;
        this.sfx('move');
      }
      if (c.pressed('down') || c.pressed('right')) {
        this.lostSel = (this.lostSel + 1) % 3;
        this.sfx('move');
      }
      if (c.confirm) this.lostChoose(this.lostSel);
      return;
    }
    if (this.phase === 'won') {
      this.wonT += dt;
      this.time += dt;
      this.fx.update(dt);
      for (const f of this.fighters) f.animT += dt;
      if (this.wonT > 2 && this.g.input.p1.confirm) this.finish();
      if (this.wonT > 9) this.finish();
      return;
    }
    super.update(dt);
  }
  lostChoose(i) {
    this.sfx('confirm');
    if (i === 0) this.kneel();
    else if (i === 1) this.restartCp();
    else this.g.goTitle();
  }
  restartCp() {
    this.g.setScene(new StoryScene(this.g, { ...this.cfg, cp: this.cp, votes: this.cpVotes != null ? this.cpVotes : this.cfg.votes || 0, clock: this.clock, kneels: this.kneels }));
  }
  pauseChoose(i) {
    this.sfx('confirm');
    if (i === 0) this.paused = false;
    else if (i === 1) this.restartCp();
    else this.g.goTitle();
  }
  checkEnd() {}
  timeUp() {}

  finish() {
    if (this.done) return;
    this.done = true;
    const P = this.player;
    // 排行榜依通關速度：越快分數越高（5 分鐘破關約 7 萬分）
    this.g.goResult({
      cfg: { ...this.cfg, mode: 'story' }, win: true, score: Math.max(1000, Math.round(100000 - this.clock * 100)), wave: 1, clearTime: this.clock,
      stats: { ...P.stats }, playerChar: P.char, winnerChar: P.char, stage: 'legislature',
    });
  }
  onPointer(x, y) {
    if (this.phase === 'lost') {
      for (let i = 0; i < 3; i++) if (y > 268 + i * 46 && y < 312 + i * 46) this.lostChoose(i);
      return;
    }
    if (this.phase === 'won' && this.wonT > 2) return this.finish();
    super.onPointer(x, y);
  }

  // ───── 畫面 ─────
  draw() {
    super.draw();
    const ctx = this.g.ctx;
    // 世界座標的提示（樓梯、扣票、加票）
    ctx.save();
    const z = this.zoom;
    ctx.setTransform(z, 0, 0, z, -this.cam.x * z, -this.cam.y * z);
    if (this.hint) {
      const P = this.player;
      txt(ctx, this.hint, P.x, FY + P.z - 170, { size: 18, weight: 900, color: '#ffe14a', align: 'center', stroke: '#000', sw: 5, alpha: blink(this.time, 3) ? 1 : 0.6 });
    }
    for (const p of this.popups) {
      if (p.t < 0) continue;
      const a = 1 - Math.max(0, p.t - 0.9) / 0.5;
      txt(ctx, p.text, p.x, FY + p.z - 150 - p.t * 40, { size: p.big ? 22 : p.warn ? 22 : 20, weight: 900, color: p.color, align: 'center', stroke: '#000', sw: 5, alpha: Math.max(0, a) });
    }
    // 敵人頭上的小血條
    for (const f of this.fighters) {
      if (f.team === 0 || f.dead || f === this.boss || f.hp >= f.maxHp) continue;
      const x = f.x - 24, y = FY + f.z - f.y - 150 * (f.scale || 1);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x - 1, y - 1, 50, 7);
      ctx.fillStyle = '#ff5a3c';
      ctx.fillRect(x, y, 48 * Math.max(0, f.hp / f.maxHp), 5);
    }
    ctx.restore();
    if (this.scandalFx) this.drawScandal(ctx, this.scandalFx);
    if (this.phase === 'intro') this.drawIntro(ctx);
    if (this.phase === 'lost') this.drawLost(ctx);
    if (this.phase === 'won') this.drawWon(ctx);
  }

  // 上方 HUD：主角血條＋得票條；Boss 出場後下方再加 Boss 血條
  drawHUD(ctx) {
    const ox = this.g.ox, CW = this.g.CW;
    const g = ctx.createLinearGradient(0, 0, 0, 82);
    g.addColorStop(0, 'rgba(8,8,20,0.96)');
    g.addColorStop(1, 'rgba(20,18,40,0.92)');
    ctx.fillStyle = g;
    ctx.fillRect(-ox, 0, CW, 82);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(-ox, 82, CW, 2);
    this.hudPanel(ctx, this.player, 10, 8, 380, false);
    // 得票
    const L = this.L, gx = 430, gw = 510;
    txt(ctx, `第一關　${L.name}`, gx, 16, { size: 15, weight: 900, color: '#ffd84a' });
    txt(ctx, `得票 ${this.votes.toLocaleString()}`, gx + gw, 16, { size: 15, weight: 900, color: '#fff', align: 'right' });
    const r = Math.min(1, this.votes / L.goal);
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(gx, 30, gw, 18);
    ctx.fillStyle = r >= 1 ? '#5cff7a' : '#3a8cff';
    ctx.fillRect(gx, 30, gw * r, 18);
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 2;
    ctx.strokeRect(gx, 30, gw, 18);
    txt(ctx, r >= 1 ? '過當選門檻！去打倒 Boss' : `當選門檻 ${L.goal.toLocaleString()} 票`, gx + gw / 2, 39, { size: 12, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 3 });
    txt(ctx, `打倒敵人加票；被偷拍、收紅包會扣票`, gx, 64, { size: 11, color: '#9a9ab0' });
    const m = Math.floor(this.clock / 60), sec = Math.floor(this.clock % 60);
    txt(ctx, `⏱ ${m}:${String(sec).padStart(2, '0')}${this.kneels ? `　跪了 ${this.kneels} 次` : ''}`, gx + gw, 64, { size: 13, weight: 900, color: '#ffd84a', align: 'right' });
    // Boss 血條
    const B = this.boss;
    if (B && this.bossOn && this.phase === 'fight') {
      const bw = 520, bx = 480 - bw / 2, by = 96;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(bx - 8, by - 6, bw + 16, 40);
      txt(ctx, `BOSS　${B.char.title}`, bx, by + 4, { size: 14, weight: 900, color: '#ff7a5a' });
      segBar(ctx, bx, by + 14, bw, 12, Math.max(0, B.hp) / B.maxHp, { segs: 30, colors: ['#ff4a3a', '#ff4a3a', '#ff4a3a'] });
      const R = this.rival;
      if (R && !R.dead) txt(ctx, `＋對手陣營：${R.char.title}`, bx + bw, by + 4, { size: 12, weight: 900, color: '#ffd84a', align: 'right' });
    }
  }

  drawScandal(ctx, s) {
    const p = s.t / 1.6;
    const a = p < 0.1 ? p / 0.1 : p > 0.8 ? (1 - p) / 0.2 : 1;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(780, 210);
    ctx.rotate(0.08);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-90, -70, 180, 150);
    const cols = ['#f2b8a0', '#e89a8a', '#d98070', '#f6c8b0', '#c86a6a'];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) {
      ctx.fillStyle = cols[(i * 3 + j * 7) % 5];
      ctx.fillRect(-80 + i * 20, -60 + j * 18, 20, 18);
    }
    ctx.fillStyle = '#ff2a40';
    ctx.font = `900 18px 'Noto Sans TC',sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('緋聞照？！（合成的）', 0, 66);
    ctx.strokeStyle = '#ff2a40';
    ctx.lineWidth = 4;
    ctx.strokeRect(-50, -40, 100, 46);
    ctx.rotate(-0.25);
    txt(ctx, '爆料', 0, -16, { size: 30, weight: 900, color: '#ff2a40', align: 'center' });
    ctx.restore();
    txt(ctx, `-${s.n.toLocaleString()} 票`, 780, 320, { size: 24, weight: 900, color: '#ff5a5a', align: 'center', stroke: '#000', sw: 5, alpha: a });
  }

  drawIntro(ctx) {
    const T = this.phaseT;
    const a = T < 0.3 ? T / 0.3 : T > 2 ? Math.max(0, (2.4 - T) / 0.4) : 1;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-this.g.ox, 170, this.g.CW, 200);
    pixelText(ctx, 'STAGE 1', 480, 205, { size: 24, scale: 2, font: 'px', color: '#ffd84a', outline: '#000' });
    txt(ctx, '議員選舉', 480, 258, { size: 48, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 8 });
    txt(ctx, this.L.sub, 480, 306, { size: 16, weight: 700, color: '#cfd3e6', align: 'center' });
    txt(ctx, `拿下 ${this.L.goal.toLocaleString()} 票，再打倒 Boss 就能當選！`, 480, 336, { size: 16, weight: 900, color: '#5cff7a', align: 'center' });
    ctx.restore();
  }

  drawLost(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    panel(ctx, 260, 130, 440, 310);
    txt(ctx, '落選', 480, 180, { size: 52, weight: 900, color: '#ff5a5a', align: 'center', stroke: '#000', sw: 8 });
    txt(ctx, '要使出選前驚天一跪嗎？', 480, 228, { size: 18, weight: 900, color: '#ffe14a', align: 'center' });
    const opts = [['選前驚天一跪', '原地滿血復活（通關時間 +10 秒）'], ['從中途點重來', '得票回到中途點'], ['回到標題', '']];
    opts.forEach(([o, d], i) => {
      const y = 290 + i * 46;
      const sel = i === this.lostSel;
      if (sel) {
        ctx.fillStyle = 'rgba(255,216,74,0.18)';
        ctx.fillRect(290, y - 21, 380, 42);
      }
      txt(ctx, (sel ? '▶ ' : '　') + o, 300, y - (d ? 6 : 0), { size: 20, weight: 900, color: sel ? '#ffd84a' : '#fff' });
      if (d) txt(ctx, d, 330, y + 13, { size: 11, color: '#aab' });
    });
  }

  drawWon(ctx) {
    const T = this.wonT;
    ctx.fillStyle = `rgba(0,0,0,${Math.min(0.6, T * 0.6)})`;
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    // 紙花
    for (let i = 0; i < 60; i++) {
      const x = ((i * 97) % 1100) - 70 + Math.sin(T * 2 + i) * 20;
      const y = ((T * (120 + (i % 7) * 30) + i * 53) % 640) - 60;
      ctx.fillStyle = ['#ff5a3c', '#ffd84a', '#5cff7a', '#5cc8ff', '#ff7ad8'][i % 5];
      ctx.fillRect(x, y, 8, 12);
    }
    const n = Math.round(Math.min(1, T / 1.5) * this.votes);
    panel(ctx, 250, 110, 460, 300);
    txt(ctx, '開票結果', 480, 150, { size: 20, weight: 900, color: '#cfd3e6', align: 'center' });
    txt(ctx, `${n.toLocaleString()} 票`, 480, 205, { size: 44, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 6 });
    if (T > 1.6) {
      const s = easeOut(Math.min(1, (T - 1.6) / 0.3));
      ctx.save();
      ctx.translate(480, 285);
      ctx.rotate(-0.12);
      ctx.scale(2.2 - s * 1.2, 2.2 - s * 1.2);
      ctx.strokeStyle = '#ff2a2a';
      ctx.lineWidth = 6;
      ctx.strokeRect(-110, -38, 220, 76);
      txt(ctx, '當選！議員', 0, 0, { size: 40, weight: 900, color: '#ff2a2a', align: 'center' });
      ctx.restore();
    }
    if (T > 2.2) {
      txt(ctx, '下一關「立委選舉」製作中，敬請期待！', 480, 360, { size: 16, weight: 900, color: '#ffd84a', align: 'center' });
      if (blink(T, 1.5)) txt(ctx, '按確定繼續', 480, 390, { size: 14, color: '#fff', align: 'center' });
    }
  }
}
