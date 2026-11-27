// 劇情模式：一路打到當選總統。三關：立委選舉 → 市長選舉 → 總統選舉（最終關難度大幅提升）
// 地圖是「樓層式 2.5D」：每層樓是一段可以前後走的地板，用不同的前後深度（z）表示，
// 所以不同樓層的人自然打不到彼此；樓層之間用鷹架樓梯連接，鏡頭會上下左右跟著走。
import { CHEAT, readCheat } from './cheat.js';
import { BattleScene } from './battle.js';
import { AI } from './ai.js';
import { CHARS, CHAR_BY_ID } from './characters.js';
import './npcmoves.js';
import { newItem, WEAPONS } from './items.js';
import { ARENA, rand, pick, clamp, easeOut } from './util.js';
import { txt, pixelText, panel, segBar, blink } from './ui.js';
import { drawStoryStage } from './story_art.js';
import { ShaftScene } from './shaft.js';
import { EndingScene } from './scenes/ending.js';

// 劇情模式各關的場景：第二關是「政見發表會・下樓梯 PK」，其他關是橫向清版
export function storyScene(g, cfg) {
  return (cfg.storyStage || 0) === 1 ? new ShaftScene(g, cfg) : new StoryScene(g, cfg);
}

const FY = ARENA.floorY;
const STREET = { zMin: 0, zMax: 186 };

// ───────── 第一關的地圖資料 ─────────
export const STAGE1 = {
  id: 1,
  name: '立委選舉',
  sub: '廟口老街 → 菜市場公寓 → 宮廟廣場',
  art: 's1',
  winTitle: '立委',
  mobs: ['gang', 'protester'],
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
  boss: { floor: 3, x: 4950, lock: [4620, 5620], id: 'kingpin', minion: 'gang' },
  // 路上的道具：補血（便當、珍奶）、紅包（回血但扣票），走過去就自動吃
  items: [
    ['bento', 0, 760, 150],
    ['bat', 0, 1100, 120],
    ['redenv', 0, 1640, 160],
    ['wrench', 0, 2200, 90],
    ['bento', 0, 1980, 70],
    ['bento', 1, 2950, -170],
    ['boba', 2, 3150, -440],
    ['redenv', 2, 3600, -420],
    ['bento', 2, 3780, -440],
    ['chain', 2, 3400, -430],
    ['bento', 3, 4350, 120],
    ['fchair', 3, 4250, 60],
    ['redenv', 3, 4500, 60],
    ['bento', 3, 4620, 150],
    ['boba', 3, 5100, 90],
  ],
  hazard: { kind: 'taxi', floor: 0, from: 1850, to: 2700, warn: '叭叭！圍事計程車來了！' },
};

// ───────── 第二關「市長選舉」：夜市大街 → 捷運高架月台（很長的一段高處）→ 市府廣場 ─────────
const R = 'R', Lf = 'L';
export const STAGE2 = {
  id: 2,
  // 注意：第二關現在改成「政見發表會・下樓梯 PK」（js/shaft.js）；這份橫向清版的地圖資料先留著備用
  name: '市長選舉',
  sub: '政見發表會・下樓梯 PK',
  winTitle: '市長',
  goal: 40000,
  worldW: 6800,
  diff: 0.5, // AI 聰明程度加成
  hpMul: 1.3, // 敵人血量倍率
  floors: [
    { id: 0, name: '夜市大街', xMin: 40, xMax: 2300, ...STREET },
    { id: 1, name: '捷運高架月台', xMin: 1950, xMax: 4350, zMin: -330, zMax: -250 },
    { id: 2, name: '市府廣場', xMin: 4150, xMax: 6700, ...STREET },
  ],
  ramps: [
    { bot: 0, top: 1, xb: 2080, xt: 2280 },
    { bot: 2, top: 1, xb: 4400, xt: 4200 },
  ],
  checkpoints: [
    { floor: 0, x: 200, z: 95 },
    { floor: 1, x: 2400, z: -290 },
    { floor: 2, x: 4500, z: 60 },
  ],
  gateX: 5500,
  waves: [
    { floor: 0, x: 480, lock: [60, 1060], cp: 0, spawn: [['vendor', R], ['canvasser', R], ['vendor', Lf], ['canvasser', R], ['vendor', R]] },
    { floor: 0, x: 1400, lock: [960, 1960], cp: 0, spawn: [['canvasser', R], ['vendor', R], ['bodyguard', R], ['canvasser', Lf], ['vendor', R], ['canvasser', R]], after: '↗ 從右邊的捷運站樓梯，按「上」走上月台' },
    { floor: 1, x: 2500, lock: [2050, 3050], cp: 1, spawn: [['troll', R, { mid: true }], ['canvasser', Lf], ['vendor', R], ['canvasser', R]], title: '小王登場：網軍小編' },
    { floor: 1, x: 3500, lock: [3100, 4100], cp: 1, spawn: [['bodyguard', R], ['canvasser', R], ['vendor', Lf], ['bodyguard', R], ['canvasser', Lf]], after: '↘ 從右邊的樓梯，按「下」走到市府廣場' },
    { floor: 2, x: 4650, lock: [4250, 5250], cp: 2, spawn: [['tycoon', R, { mid: true }], ['bodyguard', Lf], ['canvasser', R]], title: '財團董事長擋路！' },
  ],
  rally: { floor: 2, lock: [4250, 5250], spawn: [['vendor', R], ['canvasser', R], ['bodyguard', Lf], ['canvasser', R], ['vendor', Lf]] },
  // Boss：玩家沒選到的另一位候選人（一起競選）
  boss: { floor: 2, x: 6000, lock: [5650, 6650], rivals: [0], minion: 'bodyguard' },
  items: [
    ['bento', 0, 800, 150],
    ['redenv', 0, 1200, 60],
    ['boba', 0, 1800, 120],
    ['bento', 1, 2700, -290],
    ['redenv', 1, 3300, -280],
    ['bento', 1, 3900, -300],
    ['bento', 2, 4500, 120],
    ['redenv', 2, 4900, 60],
    ['bento', 2, 5300, 150],
    ['boba', 2, 6100, 90],
  ],
  hazard: { kind: 'scooter', floor: 0, from: 700, to: 2200, warn: '嗶嗶！夜市機車暴衝！' },
  // 背景（有 Gemini 圖就用圖，沒有就畫簡單的樓房）
  scene: {
    sky: 's2_sky', skyColor: ['#0a1030', '#3a2a6a'],
    strips: [{ key: 's2_street', a: 0, b: 2350, h: 430, color: '#5a3a3a', win: '#ffcf6a' }],
    boxes: [
      { key: 's2_station', x: 1900, w: 2500, top: 322 - 330 - 300, color: '#8a96a8', win: '#d8f0ff' },
      { key: 's2_cityhall', x: 5450, w: 1250, top: 322 - 470, color: '#e8e0d0', win: '#ffe9a0' },
    ],
    fill: [{ a: 4400, b: 5450, h: 360, color: '#4a5068', win: '#ffd86a' }],
    streets: [[0, 4150, false], [4150, 6800, true]],
    slabs: [{ f: 1, color: '#9aa0aa', pillars: true }],
  },
};

// ───────── 第三關「總統選舉」：從造勢舞台上開始 → 下到凱道人潮 → 上貴賓看台 → 下到總統府前（最終關，難度大幅提升）─────────
export const STAGE3 = {
  id: 3,
  name: '總統選舉',
  sub: '造勢舞台 → 凱道人潮 → 貴賓看台 → 總統府前廣場',
  winTitle: '總統',
  goal: 60000,
  final: true,
  // 第二關改成下樓梯 PK 之後，原本第二關的 NPC（夜市攤販、發傳單工讀生、黑衣保鑣、網軍小編）都搬到這一關；
  // 凱道那段拉長 900，多兩波敵人（網軍小編當小王）和一個中途點
  worldW: 8300,
  diff: 1.5,
  hpMul: 1.5,
  bossHpMul: 1.3,
  floors: [
    { id: 0, name: '造勢舞台', xMin: 40, xMax: 1650, zMin: -170, zMax: -90 },
    { id: 1, name: '凱道人潮', xMin: 1350, xMax: 4550, ...STREET },
    { id: 2, name: '貴賓看台', xMin: 4250, xMax: 5750, zMin: -310, zMax: -230 },
    { id: 3, name: '總統府前廣場', xMin: 5450, xMax: 8200, ...STREET },
  ],
  ramps: [
    { bot: 1, top: 0, xb: 1700, xt: 1500 },
    { bot: 1, top: 2, xb: 4350, xt: 4550 },
    { bot: 3, top: 2, xb: 5800, xt: 5600 },
  ],
  checkpoints: [
    { floor: 0, x: 200, z: -130 },
    { floor: 1, x: 1900, z: 95 },
    { floor: 1, x: 3250, z: 95 },
    { floor: 3, x: 5900, z: 60 },
  ],
  gateX: 6900,
  waves: [
    { floor: 0, x: 400, lock: [60, 1100], cp: 0, spawn: [['reporter', R], ['vendor', R], ['cheerleader', R], ['canvasser', Lf], ['votebuyer', R]] },
    { floor: 0, x: 1150, lock: [700, 1650], cp: 0, spawn: [['reporter', R], ['canvasser', R], ['votebuyer', R], ['vendor', Lf], ['cheerleader', R], ['reporter', R]], after: '↘ 從舞台右邊的樓梯，按「下」走到凱道' },
    { floor: 1, x: 2000, lock: [1550, 2550], cp: 1, spawn: [['influencer', R, { mid: true }], ['reporter', Lf], ['cheerleader', R], ['canvasser', R]], title: '小王登場：直播網紅' },
    { floor: 1, x: 2900, lock: [2450, 3450], cp: 1, spawn: [['reporter', R], ['votebuyer', Lf], ['bodyguard', R], ['cheerleader', Lf], ['vendor', R], ['reporter', R]] },
    { floor: 1, x: 3600, lock: [3150, 4150], cp: 2, spawn: [['troll', R, { mid: true }], ['canvasser', Lf], ['bodyguard', R], ['reporter', R]], title: '小王登場：網軍小編' },
    { floor: 1, x: 4150, lock: [3650, 4550], cp: 2, spawn: [['bodyguard', R], ['vendor', Lf], ['votebuyer', R], ['bodyguard', R], ['canvasser', Lf], ['reporter', R]], after: '↗ 從右邊的樓梯，按「上」走上貴賓看台' },
    { floor: 2, x: 4650, lock: [4300, 5300], cp: 2, spawn: [['mastermind', R, { mid: true }], ['bodyguard', Lf], ['reporter', R]], title: '幕後藏鏡人現身！', after: '↘ 從右邊的樓梯，按「下」走到總統府前' },
    { floor: 3, x: 6050, lock: [5600, 6600], cp: 3, spawn: [['tycoon', R, { mid: true }], ['bodyguard', Lf], ['cheerleader', R], ['votebuyer', R], ['vendor', Lf]], title: '財團董事長也來了！' },
  ],
  rally: { floor: 3, lock: [5600, 6600], spawn: [['reporter', R], ['votebuyer', R], ['bodyguard', Lf], ['canvasser', R], ['vendor', Lf]] },
  // 最終 Boss：另外兩位候選人同時上場
  boss: { floor: 3, x: 7500, lock: [7150, 8150], rivals: [1, 2], minion: 'bodyguard' },
  items: [
    ['bento', 0, 700, -130],
    ['flag', 0, 550, -110],
    ['redenv', 0, 1000, -110],
    ['bento', 1, 2300, 120],
    ['bat', 1, 2100, 60],
    ['redenv', 1, 2700, 60],
    ['boba', 1, 3200, 150],
    ['wrench', 1, 3450, 90],
    ['bento', 1, 3800, 120],
    ['redenv', 1, 4000, 60],
    ['bento', 2, 4800, -270],
    ['redenv', 2, 5200, -260],
    ['chain', 2, 4600, -260],
    ['bento', 3, 5900, 120],
    ['fchair', 3, 5800, 60],
    ['redenv', 3, 6300, 60],
    ['redenv', 3, 6350, 150],
    ['bento', 3, 6650, 150],
    ['boba', 3, 7300, 90],
  ],
  hazard: { kind: 'truck', floor: 1, from: 1500, to: 4400, warn: '宣傳車開過來了！快閃！' },
  scene: {
    sky: 's3_sky', skyColor: ['#1a0610', '#7a2a2a'],
    strips: [{ key: 's3_street', a: 1300, b: 6950, h: 430, color: '#6a5a50', win: '#ffd86a' }],
    boxes: [
      { key: 's3_stage', x: 0, w: 1700, top: 322 - 170 - 330, color: '#3a1a4a', win: '#ff7ad8' },
      { key: 's3_stand', x: 4200, w: 1600, top: 322 - 310 - 230, color: '#5a5f6a', win: '#ffe9a0' },
      { key: 's3_palace', x: 6900, w: 1350, top: 322 - 520, color: '#b8603a', win: '#ffe9a0' },
    ],
    streets: [[0, 5450, false], [5450, 8300, true]],
    slabs: [{ f: 0, color: '#4a2a5a' }, { f: 2, color: '#8a8f9a', pillars: true }],
  },
};

export const STAGES = [STAGE1, STAGE2, STAGE3];
const NUM = ['一', '二', '三'];

const VOTES = {
  gang: 1200, protester: 1000, vendor: 1200, canvasser: 1000, bodyguard: 1500, reporter: 1200, cheerleader: 1500, votebuyer: 1500,
  paparazzi: 5000, troll: 5000, influencer: 5000, kingpin: 12000, tycoon: 12000, mastermind: 15000, rival: 15000,
};
// 小怪血很少（兩三下就倒，打起來爽）；小王、Boss 才耐打
const HPMUL = {
  gang: 0.05, protester: 0.05, vendor: 0.05, canvasser: 0.04, bodyguard: 0.09, reporter: 0.05, cheerleader: 0.04, votebuyer: 0.05,
  paparazzi: 0.35, troll: 0.3, influencer: 0.3, kingpin: 0.6, tycoon: 0.5, mastermind: 0.55, rival: 0.8,
};
const MOBS = new Set(['gang', 'protester', 'vendor', 'canvasser', 'bodyguard', 'reporter', 'cheerleader', 'votebuyer']);
const MIDS = new Set(['paparazzi', 'troll', 'influencer']);
const BOSSES = new Set(['kingpin', 'tycoon', 'mastermind']);
// 路上危險物的大小和速度
const HAZARD = {
  taxi: { v: 820, w: 64, zr: 26, h: 80, dmg: 14 },
  scooter: { v: 760, w: 44, zr: 20, h: 70, dmg: 10 },
  truck: { v: 600, w: 100, zr: 30, h: 110, dmg: 16 },
};
// 紅包上的暗示標語：讓玩家一看就知道收了會掉票
const DIRTY = ['不法利益', '官商勾結', '黑金', '利益輸送', '政治獻金？', '圖利廠商'];
// 紅包在畫面上放著沒人拿：幾秒後自動消失（最後 3 秒閃爍），過一陣子再從天上掉下來
const REDENV_TTL = 10;
const REDENV_BACK = [9, 15];

// 環境傷害（計程車）的來源
const ENV = { team: 9, x: 0, facing: 1, state: 'idle', combo: 0, comboT: 0, mp: 0, superDealt: null, char: { id: 'env', mul: { pow: 1 }, color: '#f4c20d' }, stats: { dmg: 0, maxCombo: 0, kos: 0 } };

// ───────── 測試模式（只給開發者用）─────────
// 開啟：網址加 ?tester=lf2god（之後同一個瀏覽器都會記住）；關閉：網址加 ?tester=off
// 效果：主角無敵、攻擊力 ×20、氣永遠滿；熱鍵：1/2/3 換關、B 直接打 Boss、G 清掉場上敵人、
//       H 加 1 萬票、N 跳到下一個中途點、W 直接過關（避開遊戲本來用的 K、V 等按鍵）
const GOD = (() => {
  try {
    const q = new URLSearchParams(location.search).get('tester');
    if (q === 'lf2god') localStorage.setItem('tpb_god', '1');
    if (q === 'off') localStorage.removeItem('tpb_god');
    return localStorage.getItem('tpb_god') === '1';
  } catch (e) {
    return false;
  }
})();
if (GOD && typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const s = window.__game && window.__game.scene;
    if (s && s.debugKey && !e.repeat) s.debugKey(e.key.toLowerCase());
  });
}

export class StoryScene extends BattleScene {
  // 測試模式：主角打人傷害 ×20；密技：主角不受傷
  applyHit(src, t, h) {
    if (CHEAT.on && t === this.player) return false;
    if ((GOD || CHEAT.on) && src === this.player && t !== this.player) h = { ...h, dmg: h.dmg * 20 };
    return super.applyHit(src, t, h);
  }

  // 每幀讀取按鍵，比對密技順序（共用 cheat.js）
  readCheat(dt) {
    this.cheatSt = this.cheatSt || {};
    if (readCheat(this.cheatSt, this.player.ctrl, dt)) {
      this.say('密技啟動！無敵模式', 2, '#ff5adc');
      this.sfx('super');
    }
  }

  // 密技效果：無敵、氣滿、碰到的敵人直接打倒
  applyCheat() {
    const P = this.player;
    P.hp = P.maxHp;
    P.cap = P.maxHp;
    P.mp = 100;
    for (const f of this.enemiesAlive()) {
      if (Math.abs(f.x - P.x) < 70 && Math.abs(f.z - P.z) < 34 && Math.abs((f.y || 0) - (P.y || 0)) < 90) {
        super.applyHit(P, f, { dmg: 99999, knock: true, launch: 360, kb: 320, unblockable: true, dir: Math.sign(f.x - P.x) || P.facing });
      }
    }
  }

  debugKey(k) {
    if (!GOD || this.phase === 'won' || this.phase === 'lost') return;
    const P = this.player, L = this.L;
    if (k === '1' || k === '2' || k === '3') {
      this.g.setScene(storyScene(this.g, { ...this.cfg, storyStage: +k - 1, cp: 0, votes: 0, round: 0 }));
    } else if (k === 'g') {
      for (const f of this.enemiesAlive()) this.applyHit(P, f, { dmg: 99999, knock: true, launch: 300, kb: 300, unblockable: true, dir: Math.sign(f.x - P.x) || 1 });
      this.queue = [];
    } else if (k === 'h') {
      this.addVotes(10000, '測試：');
    } else if (k === 'w') {
      this.winStage();
    } else if (k === 'n' || k === 'b') {
      // 清掉現在的波次，再瞬移
      for (const f of this.enemiesAlive()) {
        f.hp = 0;
        f.dead = true;
      }
      this.queue = [];
      this.waveActive = null;
      if (k === 'b') {
        L.waves.forEach((w, i) => this.wavesDone.add(i));
        this.votes = Math.max(this.votes, L.goal);
        this.gateOpen = true;
        this.setFloor(P, L.boss.floor);
        P.x = L.boss.x - 240;
        P.z = 60;
      } else {
        const i = Math.min(L.checkpoints.length - 1, this.cp + 1);
        const c = L.checkpoints[i];
        L.waves.forEach((w, j) => w.cp < i && this.wavesDone.add(j));
        this.cp = i;
        this.setFloor(P, c.floor);
        P.x = c.x;
        P.z = c.z;
      }
      P.climb = null;
      this.updateCamera(0, true);
    }
  }

  constructor(game, cfg) {
    super(game, { ...cfg, mode: 'story', stage: 'legislature' });
  }

  enter() {
    const cfg = this.cfg;
    super.enter();
    this.stageIdx = Math.min(STAGES.length - 1, cfg.storyStage || 0);
    const L = (this.L = STAGES[this.stageIdx]);
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
    this.boss = null;
    this.rival = null;
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
    // 對手候選人：從玩家沒選的角色裡，整趟劇情固定挑三位（第二關 Boss 一位、最終關兩位）
    if (!cfg.rivals) {
      const pool = CHARS.map((c) => c.id).filter((id) => id !== this.player.char.id);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      cfg.rivals = pool.slice(0, 4);
    }
    this.minionT = 8;
    for (const [kind, fl, x, z] of L.items) {
      // 從中途點重來時，已經走過的地方的道具不用再放
      if (this.cp > 0 && x < cp.x - 300) continue;
      const it = newItem(kind, x, z, 0);
      it.floor = fl;
      if (kind === 'redenv') {
        it.label = DIRTY[this.items.filter((i) => i.kind === 'redenv').length % DIRTY.length];
        it.ttl = REDENV_TTL;
      }
      this.items.push(it);
    }
    this.respawns = [];
    this.cam = { x: cp.x - 480, y: 0 };
    this.updateCamera(0, true);
    this.stage = { id: `story${L.id}`, name: L.name, draw: (ctx, t, x0, x1) => drawStoryStage(ctx, t, x0, x1, L, this.cam, this.gateOpen) };
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
    const L = this.L;
    const isBoss = BOSSES.has(id);
    // 被叫出來的手下（opt.minion）一律當小怪：血很少、比較笨，兩三下就倒
    const minion = !!opt.minion;
    // 關卡越後面越耐打；最終 Boss（對手候選人）再額外加血
    let hpMul = (minion ? 0.05 : HPMUL[id] || 0.4) * (L.hpMul || 1);
    if (opt.finalBoss) hpMul *= L.bossHpMul || 1;
    const f = this.addFighter(cid, {
      cpu: true, team: 1, x, z, facing: side === 'L' ? 1 : -1, label: 'CPU',
      hpMul, scale: isBoss && !minion ? 1.3 : id === 'rival' ? 1.15 : 1, votes: minion ? 500 : VOTES[id] || 1000,
    });
    // 小怪比較笨、Boss 和對手比較聰明（再依玩家選的難度、關卡微調）
    const base = { easy: 0, normal: 1, hard: 2 }[this.cfg.difficulty || 'normal'];
    const smart = !minion && (isBoss || id === 'rival' || MIDS.has(id));
    const lv = (smart ? 0.5 : minion ? -1 : 0) + base - 1 + (L.diff || 0) * (MOBS.has(id) || minion ? 0.5 : 1);
    const diff = lv >= 1 ? 'hard' : lv >= 0 ? 'normal' : 'easy';
    f.ai = new AI(f, diff);
    f.ctrl = f.ai.ctrl;
    f.npcKind = id;
    f.mob = MOBS.has(id) || minion;
    // 小王、Boss 一開始就有一些氣，打一陣子就會放大絕
    f.mp = (isBoss || id === 'rival') && !minion ? 40 : MIDS.has(id) && !minion ? 30 : 0;
    // 劇情模式的敵人撿不到道具：不要讓 AI 跑去追地上的便當、紅包（以前 Boss 會因此一直往左走）
    f.ai.p.item = 0;
    this.setFloor(f, floorId);
    // 打鬥中（畫面鎖住）：敵人也只能在鎖住的範圍內活動，不會跑到畫面外打不到
    this.lockBounds(f);

    return f;
  }
  lockBounds(f) {
    const lk = this.waveActive && this.waveActive.lock;
    if (!lk || f.floor !== this.waveActive.floor) return;
    f.bounds = { ...f.bounds, xMin: Math.max(f.bounds.xMin, lk[0]), xMax: Math.min(f.bounds.xMax, lk[1]) };
  }
  summon(id, n, near, keep = false) {
    // 「叫小弟」：沒指定的話叫出這一關的手下；叫出來的一律是血很少的小怪，場上最多 6 隻
    if (!keep && id === 'gang' && this.L.boss.minion) id = this.L.boss.minion;
    for (let i = 0; i < n; i++) {
      if (this.enemiesAlive().length >= 7) break;
      this.spawnEnemy(id, i % 2 ? 'L' : 'R', near.floor, { minion: true });
    }
  }
  enemiesAlive() {
    return this.fighters.filter((f) => f.team !== 0 && !f.dead && f.hp > 0);
  }

  // ───── 得票 ─────
  gainVotes(t) {
    if (t.team === 0) return;
    this.addVotes(t.votes || 1000, '');
    // 越南大戰式的爽快倒地：小怪慘叫著飛出去，偶爾掉補血或武器
    if (!BOSSES.has(t.npcKind) && t.npcKind !== 'rival') {
      const dir = Math.sign(t.x - this.player.x) || 1;
      t.vx = dir * 620;
      t.vy = Math.max(t.vy, 560);
      t.y = Math.max(t.y, 2);
      this.fx.add({ type: 'spark', x: t.x, z: t.z, y: 60, life: 0.35, big: true, color: '#ffffff' });
      this.fx.add({ type: 'ring', x: t.x, z: t.z, y: 0, life: 0.4, r: 140, color: '#ffd84a' });
      this.fx.add({ type: 'text', x: t.x, z: t.z, y: 150, text: pick(['啊～～！', '哇啊！', '救命啊！', '我錯了！', '下次不敢了！']), color: '#ffffff', size: 22, life: 0.9 });
      this.shake(6, 0.15);
      t.hitstop = Math.max(t.hitstop || 0, 0.06);
      const P = this.player;
      const weaponsOut = this.items.filter((i) => i.def.weapon).length + (P.hold ? 1 : 0);
      if (Math.random() < 0.12 && weaponsOut < 2) {
        // 小怪偶爾掉武器（場上最多 2 把，不然一直有武器就沒意思了）
        const it = newItem(pick(WEAPONS), t.x, t.z, 160);
        it.floor = t.floor;
        this.items.push(it);
      } else if (Math.random() < 0.35) {
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
    // 密技：按鍵比對＋無敵、碰到就打倒
    this.readCheat(dt);
    if (CHEAT.on) this.applyCheat();
    // 測試模式：無敵、氣永遠滿
    if (GOD) {
      P.hp = P.maxHp;
      P.cap = P.maxHp;
      P.mp = 100;
    }
    if (P.hp <= 0) {
      this.setPhase('dead');
      this.say('落選…', 1.8, '#ff5a5a');
      this.sfx('ko');
      return;
    }
    this.updateRedEnvelopes(dt);
    this.updateLadders(dt);
    this.updateWaves();
    this.updateTaxi(dt);
    this.updateBossMinions(dt);
    this.hint = this.ladderHint();
  }

  // 紅包：在畫面裡放太久沒被拿走就消失，之後再從天上掉回原來的地方（換一個標語）
  updateRedEnvelopes(dt) {
    const x0 = this.cam.x, x1 = this.cam.x + (this.viewW || 960);
    for (const it of this.items) {
      if (it.kind !== 'redenv' || it.ttl == null || it.y > 5) continue;
      if (it.x > x0 && it.x < x1 && it.floor === this.player.floor) it.ttl -= dt;
      it.hide = it.ttl < 3 && Math.floor(this.time * 8) % 2 === 0;
      if (it.ttl <= 0) {
        it.gone = true;
        this.fx.add({ type: 'text', x: it.x, z: it.z, y: 60, text: '咻～', color: '#ffd84a', size: 16, life: 0.6 });
        this.respawns.push({ at: this.time + rand(...REDENV_BACK), floor: it.floor, x: it.x, z: it.z });
      }
    }
    this.items = this.items.filter((it) => !it.gone);
    const due = this.respawns.filter((r) => this.time >= r.at);
    this.respawns = this.respawns.filter((r) => this.time < r.at);
    for (const r of due) {
      const it = newItem('redenv', r.x + rand(-60, 60), r.z, 420);
      it.floor = r.floor;
      it.ttl = REDENV_TTL;
      it.label = pick(DIRTY);
      this.items.push(it);
    }
  }

  // 對手候選人（第二、三關 Boss）不會自己叫小弟：每隔一段時間由場外支持者補上手下
  updateBossMinions(dt) {
    const B = this.boss, L = this.L;
    if (!this.bossOn || !B || B.hp <= 0 || !L.boss.rivals) return;
    this.minionT -= dt;
    if (this.minionT > 0) return;
    this.minionT = L.final ? 9 : 12;
    this.popups.push({ t: 0, text: `${B.char.title}陣營的支持者來了！`, color: '#ff9a3a', x: this.player.x, z: this.player.z });
    this.summon(L.boss.minion, L.final ? 2 : 1, B, true);
  }

  updateWaves() {
    const P = this.player, L = this.L;
    if (this.waveActive) {
      const w = this.waveActive;
      // 最終關：Boss 和對手候選人都要打倒
      const bossDown = w.boss && this.boss && this.boss.hp <= 0 && (!this.rival || this.rival.hp <= 0);
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
    // 選務封鎖線（在 Boss 那一層）
    const BF = L.boss.floor;
    if (!this.gateOpen && P.floor === BF) {
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
    if (this.gateOpen && P.floor === BF && P.x < L.gateX - 30 && P.bounds.xMax !== L.floors[BF].xMax) this.setFloor(P, BF);
    if (!this.gateOpen && P.floor === BF) P.bounds.xMax = Math.min(P.bounds.xMax, L.gateX - 30);
    // Boss
    if (this.gateOpen && !this.bossOn && P.floor === BF && P.x > L.boss.x - 250) this.startBoss();
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
    const BF = L.boss.floor;
    const w = { floor: BF, lock: L.boss.lock, boss: true, spawn: [] };
    this.waveActive = w;
    P.bounds = { ...P.bounds, xMin: w.lock[0], xMax: w.lock[1] };
    const xR = Math.min(L.boss.lock[1] - 40, this.cam.x + this.viewW + 60);
    let B;
    if (L.boss.rivals) {
      // 第二、三關：Boss 是玩家沒選到的其他候選人（一起競選）
      const ids = L.boss.rivals.map((i) => this.cfg.rivals[i % this.cfg.rivals.length]);
      this.boss = this.spawnEnemy('rival', 'R', BF, { cid: ids[0], x: xR, finalBoss: true });
      B = this.boss.char;
      if (ids[1]) {
        this.rival = this.spawnEnemy('rival', 'L', BF, { cid: ids[1], x: L.boss.lock[0] + 40, finalBoss: true });
        this.later(1.2, () => this.popups.push({ t: 0, text: `另一位候選人：${this.rival.char.title}`, color: '#ffd84a', x: this.rival.x, z: this.rival.z, big: true }));
      }
      this.minionT = 6;
    } else {
      // 第一關：角頭樁腳王，打到一半會叫小弟
      B = CHAR_BY_ID[L.boss.id];
      this.boss = this.spawnEnemy(L.boss.id, 'R', BF, { x: xR, finalBoss: true });
      this.later(3, () => this.boss && !this.boss.dead && this.spawnEnemy(L.boss.minion || 'gang', 'L', BF, { minion: true }));
    }
    const label = L.boss.rivals ? `${L.name}對手：${B.title}` : B.title;
    this.say(`${L.final ? '最終 BOSS' : 'BOSS'}：${label}`, 2, '#ff5a3c');
    if (B.quote) this.popups.push({ t: 0, text: `「${B.quote}」`, color: '#ff9a3a', x: L.boss.x + 200, z: 20, big: true });
    this.refill(L.final ? 1 : 0.4, '支持者應援：回血！');
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
  // 各關的路上危險：第一關圍事計程車、第二關夜市暴衝機車、第三關宣傳車
  updateTaxi(dt) {
    const tx = this.L.hazard, P = this.player;
    if (!tx || P.floor !== tx.floor || P.x < tx.from - 300 || P.x > tx.to + 200) return;
    this.taxiT -= dt;
    if (this.taxiT <= 0) {
      this.taxiT = rand(5, 8);
      const F = this.L.floors[tx.floor];
      const z = clamp(P.z + rand(-30, 30), F.zMin + 20, F.zMax - 20);
      const fromRight = Math.random() < 0.6;
      const S = HAZARD[tx.kind];
      this.popups.push({ t: 0, text: tx.warn, color: '#f4c20d', x: P.x + (fromRight ? 260 : -260), z, warn: true });
      this.sfx('cutin');
      this.later(0.9, () => {
        const x = fromRight ? this.cam.x + this.viewW + 150 : this.cam.x - 150;
        this.spawnProj({
          owner: ENV, team: 9, kind: tx.kind, x, z, y: 0, vx: fromRight ? -S.v : S.v, life: 3.5, w: S.w, zr: S.zr, h: S.h,
          dmg: S.dmg, knock: true, launch: 300, kb: 380, unblockable: true, pierce: true, noClash: true,
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
    // 還有下一關：接著打（通關時間、下跪次數累計；得票每關重新算）
    if (this.stageIdx < STAGES.length - 1) {
      this.g.setScene(storyScene(this.g, { ...this.cfg, storyStage: this.stageIdx + 1, cp: 0, votes: 0, round: 0, clock: this.clock, kneels: this.kneels }));
      return;
    }
    // 全破：先演結局（升旗典禮 → 俯視落敗的對手 → 全劇終），再到結算畫面
    // 排行榜依通關速度：越快分數越高（5 分鐘破關約 7 萬分）
    const result = {
      cfg: { ...this.cfg, mode: 'story' }, win: true, score: Math.max(1000, Math.round(100000 - this.clock * 100)), wave: 1, clearTime: this.clock,
      stats: { ...P.stats }, playerChar: P.char, winnerChar: P.char, stage: 'legislature',
    };
    this.g.setScene(new EndingScene(this.g, { player: P.char.id, rivals: (this.cfg.rivals || []).slice(0, 4), result }));
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
    // 地上的紅包：頭上掛暗示標語，一看就知道「收了會掉票」
    // 主角旁邊的武器：提示「走過去就能拿」
    {
      const P = this.player;
      const w = !P.hold && this.items.find((it) => it.def.weapon && it.y <= 5 && it.floor === P.floor && Math.abs(it.x - P.x) < 52 && Math.abs(it.z - P.z) < 28);
      if (w) txt(ctx, `走過去拿起「${w.def.name}」`, w.x, FY + w.z - 70, { size: 14, weight: 900, color: '#ffffff', align: 'center', stroke: '#000', sw: 4, alpha: blink(this.time, 3) ? 1 : 0.7 });
    }
    for (const it of this.items) {
      if (it.kind !== 'redenv' || it.y > 5 || it.hide) continue;
      const bx = it.x, by = FY + it.z - 12 - Math.sin(this.time * 3 + it.x) * 3;
      const label = it.label || '不法利益';
      ctx.save();
      ctx.font = `900 15px 'Noto Sans TC',sans-serif`;
      const w = Math.max(70, ctx.measureText(label).width + 18);
      // 掛牌
      ctx.fillStyle = 'rgba(20,0,0,0.85)';
      ctx.fillRect(bx - w / 2, by - 40, w, 38);
      ctx.strokeStyle = blink(this.time, 2.5) ? '#ff3a3a' : '#ffd84a';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - w / 2, by - 40, w, 38);
      ctx.restore();
      txt(ctx, label, bx, by - 28, { size: 15, weight: 900, color: '#ffd84a', align: 'center' });
      txt(ctx, '收了掉票！', bx, by - 11, { size: 11, weight: 900, color: '#ff6a6a', align: 'center' });
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
    const B = this.boss;
    const bossFight = B && this.bossOn && (this.phase === 'fight' || this.phase === 'kneel');
    txt(ctx, `第${NUM[this.stageIdx]}關　${L.name}`, gx, 16, { size: 15, weight: 900, color: '#ffd84a' });
    txt(ctx, `得票 ${this.votes.toLocaleString()}`, gx + gw, 16, { size: 15, weight: 900, color: '#fff', align: 'right' });
    if (bossFight) {
      // Boss 戰：右上角的得票條換成 Boss 血條，不擋住打鬥畫面
      const Rv = this.rival;
      const hasRival = Rv && Rv.hp > 0 && !Rv.dead;
      const bw = hasRival ? gw * 0.62 : gw;
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(gx, 30, gw, 18);
      segBar(ctx, gx, 30, bw, 18, Math.max(0, B.hp) / B.maxHp, { segs: 24, colors: ['#ff4a3a', '#ff4a3a', '#ff4a3a'] });
      txt(ctx, `BOSS　${B.char.title}`, gx + bw / 2, 39, { size: 12, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 3 });
      if (hasRival) {
        const rx = gx + bw + 8, rw = gw - bw - 8;
        segBar(ctx, rx, 30, rw, 18, Math.max(0, Rv.hp) / Rv.maxHp, { segs: 12, colors: ['#ffb020', '#ffb020', '#ffb020'] });
        txt(ctx, `對手 ${Rv.char.title}`, rx + rw / 2, 39, { size: 12, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 3 });
      }
      ctx.strokeStyle = '#ff5a3c';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx, 30, gw, 18);
    } else {
      const r = Math.min(1, this.votes / L.goal);
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(gx, 30, gw, 18);
      ctx.fillStyle = r >= 1 ? '#5cff7a' : '#3a8cff';
      ctx.fillRect(gx, 30, gw * r, 18);
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx, 30, gw, 18);
      txt(ctx, r >= 1 ? '過當選門檻！去打倒 Boss' : `當選門檻 ${L.goal.toLocaleString()} 票`, gx + gw / 2, 39, { size: 12, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 3 });
    }
    txt(ctx, bossFight ? '打倒 Boss 就當選！' : `打倒敵人加票；被偷拍、收紅包（不法利益）會扣票`, gx, 64, { size: 11, color: bossFight ? '#ff9a7a' : '#9a9ab0' });
    const m = Math.floor(this.clock / 60), sec = Math.floor(this.clock % 60);
    txt(ctx, `⏱ ${m}:${String(sec).padStart(2, '0')}${this.kneels ? `　跪了 ${this.kneels} 次` : ''}`, gx + gw, 64, { size: 13, weight: 900, color: '#ffd84a', align: 'right' });
    if (CHEAT.on) {
      ctx.fillStyle = 'rgba(120,0,90,0.8)';
      ctx.fillRect(10, GOD ? 114 : 90, 250, 22);
      txt(ctx, '密技：無敵中・碰到就打倒・氣全滿', 18, GOD ? 125 : 101, { size: 12, weight: 900, color: '#ffd0f4' });
    }
    if (GOD) {
      ctx.fillStyle = 'rgba(120,0,0,0.8)';
      ctx.fillRect(10, 90, 600, 22);
      txt(ctx, '測試模式：無敵＋攻擊×20　1/2/3 換關　B 打 Boss　G 清怪　H +1萬票　N 下個中途點　W 過關', 18, 101, { size: 12, weight: 900, color: '#ffe14a' });
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
    pixelText(ctx, this.L.final ? 'FINAL STAGE' : `STAGE ${this.L.id}`, 480, 205, { size: 24, scale: 2, font: 'px', color: this.L.final ? '#ff5a3c' : '#ffd84a', outline: '#000' });
    txt(ctx, this.L.name, 480, 258, { size: 48, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 8 });
    txt(ctx, this.L.sub, 480, 306, { size: 16, weight: 700, color: '#cfd3e6', align: 'center' });
    txt(ctx, this.L.final ? `最終關！拿下 ${this.L.goal.toLocaleString()} 票，打倒另外兩位總統候選人！` : this.L.boss.rivals ? `拿下 ${this.L.goal.toLocaleString()} 票，打敗對手候選人就能當選${this.L.winTitle}！` : `拿下 ${this.L.goal.toLocaleString()} 票，再打倒 Boss 就能當選${this.L.winTitle}！`, 480, 336, { size: 16, weight: 900, color: this.L.final ? '#ff9a3a' : '#5cff7a', align: 'center' });
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
      txt(ctx, `當選！${this.L.winTitle}`, 0, 0, { size: 40, weight: 900, color: '#ff2a2a', align: 'center' });
      ctx.restore();
    }
    if (T > 2.2) {
      const next = STAGES[this.stageIdx + 1];
      txt(ctx, next ? `下一關：第${NUM[this.stageIdx + 1]}關「${next.name}」` : '恭喜！從立委一路當選總統！', 480, 360, { size: 16, weight: 900, color: '#ffd84a', align: 'center' });
      if (blink(T, 1.5)) txt(ctx, '按確定繼續', 480, 390, { size: 14, color: '#fff', align: 'center' });
    }
  }
}
