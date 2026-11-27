// 劇情模式第二關「市長選舉」：政見發表會・下樓梯 PK（玩法類似小朋友下樓梯）
// - 台階一直往上升，碰到天花板的尖刺會扣血；掉出畫面下面就輸
// - 踩到一般台階 +1 血、踩到釘板 -3 血；輸送帶會把人帶著走、彈簧會彈起來、紙板踩了一下就塌
// - 兩個人碰在一起會互相卡住；按攻擊可以把對方推開，但推人的自己也會扣 1 血
// - 三戰兩勝？不：要連贏三戰。第 1、2 戰 1 對 1，第 3 戰 1 打 2，一戰比一戰難
// - 比賽中得票會一直增加
import { CHEAT, readCheat } from './cheat.js';
import { Fighter } from './fighter.js';
import { CHARS, CHAR_BY_ID } from './characters.js';
import { ARENA, rand, pick, clamp, sign, easeOut } from './util.js';
import { txt, pixelText, panel, segBar, blink } from './ui.js';
import { drawFighter, drawPortrait, drawStar } from './sprites.js';
import { ASSETS } from './assets.js';

const X0 = 150, X1 = 810; // 場地左右邊界
const CEIL = 112; // 天花板尖刺的下緣
const BOT = 560; // 掉到這裡以下就輸
const BODY = 84; // 角色（縮小後）的高度
const HALF = 17; // 角色的半寬
const MAXHP = 10;
const PW = 104; // 台階寬度

// 三戰的難度：上升速度、各種台階的比例、電腦的反應與侵略性
const ROUNDS = [
// daze：電腦每次判斷時「發呆」的機率（會站著不動一下，玩家才有機會贏）
  { opps: 1, speed: 52, accel: 2.0, mix: { spike: 0.14, conv: 0.1, fragile: 0.06, spring: 0.06 }, react: 0.34, aggr: 0.35, err: 0.25, daze: 0.09 },
  { opps: 1, speed: 64, accel: 2.4, mix: { spike: 0.18, conv: 0.16, fragile: 0.1, spring: 0.07 }, react: 0.24, aggr: 0.7, err: 0.15, daze: 0.05 },
  { opps: 2, speed: 74, accel: 2.6, mix: { spike: 0.22, conv: 0.18, fragile: 0.14, spring: 0.07 }, react: 0.18, aggr: 1.0, err: 0.1, daze: 0.045 },
];
const GOAL = 40000;

export class ShaftScene {
  constructor(game, cfg) {
    this.g = game;
    this.cfg = cfg;
  }

  enter() {
    document.body.dataset.scene = 'battle';
    const cfg = this.cfg;
    this.time = 0;
    this.clock = cfg.clock || 0;
    this.kneels = cfg.kneels || 0;
    this.votes = cfg.votes || 0;
    this.round = cfg.round || 0;
    this.paused = false;
    this.pauseSel = 0;
    this.popups = [];
    this.announce = null;
    // 對手候選人：用整趟劇情固定的那幾位（不夠就補）
    const pool = CHARS.filter((c) => !c.npc && c.id !== cfg.playerChar).map((c) => c.id);
    const rv = (cfg.rivals || []).filter((id) => id !== cfg.playerChar);
    for (const id of pool) if (rv.length < 4 && !rv.includes(id)) rv.push(id);
    cfg.rivals = rv;
    this.g.audio.playBgm('battle');
    this.setPhase(this.round === 0 && !cfg.retry ? 'intro' : 'vs');
    this.startRound();
  }
  exit() {}

  // 測試模式（?tester=lf2god）的熱鍵：1/3 換關、W 直接贏這一戰
  debugKey(k) {
    if (k === '1' || k === '3') import('./story.js').then(({ storyScene }) => this.g.setScene(storyScene(this.g, { ...this.cfg, storyStage: +k - 1, cp: 0, votes: 0, round: 0 })));
    if (k === 'w' && this.phase === 'fight') for (const c of this.chars) if (c !== this.P) this.die(c, '');
  }

  get player() {
    return this.P && this.P.f;
  }

  setPhase(p) {
    this.phase = p;
    this.phaseT = 0;
  }
  sfx(n) {
    this.g.audio.sfx(n);
  }
  say(text, life = 1.2, color = '#ffd84a') {
    this.announce = { text, t: 0, life, color };
  }
  pop(c, text, color) {
    this.popups.push({ t: 0, x: c.x, y: c.y - BODY - 10, text, color });
  }

  // ───── 回合 ─────
  startRound() {
    const R = (this.R = ROUNDS[this.round]);
    this.speed = R.speed;
    this.depth = 0;
    this.plats = [];
    this.shakeT = 0;
    // 一開始先鋪滿台階，最上面一排是大家站的起點
    const startY = 330;
    const n = 1 + R.opps;
    const xs = n === 2 ? [X0 + 190, X1 - 190] : [X0 + 120, 480, X1 - 120];
    for (const x of xs) this.plats.push(this.newPlat(x, startY, 'normal'));
    let y = startY + rand(70, 90);
    while (y < BOT + 120) {
      this.addRow(y);
      y += rand(66, 88);
    }
    this.nextY = y;
    const ids = [this.cfg.playerChar];
    if (R.opps === 1) ids.push(this.cfg.rivals[this.round]);
    else ids.push(this.cfg.rivals[2], this.cfg.rivals[3]);
    this.chars = ids.map((id, i) => this.newChar(id, i, xs[i], startY));
    this.P = this.chars[0];
  }
  newChar(id, i, x, y) {
    const f = new Fighter(CHAR_BY_ID[id], { team: i === 0 ? 0 : 1, x, z: 0, facing: x < 480 ? 1 : -1 });
    f.scale = 0.6;
    f.floor = null;
    const c = { f, id, i, x, y, vx: 0, vy: 0, hp: MAXHP, plat: null, push: 0, stun: 0, atkCD: 0, inv: 0, dead: false, stuck: 0, ai: i > 0 ? { t: 0, gx: x, aggr: 0 } : null };
    c.plat = this.plats.find((p) => Math.abs(p.x - x) < 2 && p.y === y);
    return c;
  }
  newPlat(x, y, type) {
    return { x, y, w: PW, type, dir: Math.random() < 0.5 ? -1 : 1, breakT: null, broken: false, seen: new Set() };
  }
  addRow(y) {
    // 每一排 1～2 塊台階，保證至少一塊不是釘板
    const R = this.R;
    const k = Math.random() < 0.35 ? 2 : 1;
    const used = [];
    for (let j = 0; j < k; j++) {
      let x;
      for (let tries = 0; tries < 8; tries++) {
        x = rand(X0 + PW / 2, X1 - PW / 2);
        if (used.every((u) => Math.abs(u - x) > PW + 30)) break;
      }
      used.push(x);
      let type = 'normal';
      const r = Math.random();
      const m = R.mix;
      if (j > 0 || k === 1) {
        if (r < m.spike) type = 'spike';
        else if (r < m.spike + m.conv) type = 'conv';
        else if (r < m.spike + m.conv + m.fragile) type = 'fragile';
        else if (r < m.spike + m.conv + m.fragile + m.spring) type = 'spring';
      }
      if (k === 1 && type === 'spike' && Math.random() < 0.5) type = 'normal';
      this.plats.push(this.newPlat(x, y, type));
    }
  }

  // ───── 更新 ─────
  update(dt) {
    const c = this.g.input.p1;
    if (['fight', 'vs'].includes(this.phase) && c.pressed('pause')) {
      this.paused = !this.paused;
      this.pauseSel = 0;
      this.sfx('move');
      return;
    }
    if (this.paused) {
      if (c.pressed('up') || c.pressed('down')) {
        this.pauseSel = (this.pauseSel + 1) % 2;
        this.sfx('move');
      }
      if (c.confirm) {
        this.sfx('confirm');
        if (this.pauseSel === 0) this.paused = false;
        else this.g.goTitle();
      }
      return;
    }
    this.time += dt;
    this.phaseT += dt;
    // 密技（跟劇情模式共用）：無敵、碰到對手直接打倒
    this.cheatSt = this.cheatSt || {};
    if (readCheat(this.cheatSt, c, dt) && this.P) {
      this.pop(this.P, '密技啟動！無敵', '#ff5adc');
      this.sfx('super');
    }
    if (CHEAT.on && this.phase === 'fight' && this.P && !this.P.dead) {
      this.P.hp = MAXHP;
      for (const o of this.chars) {
        if (o !== this.P && !o.dead && Math.abs(o.x - this.P.x) < 60 && Math.abs(o.y - this.P.y) < 70) {
          o.hp = 0;
          this.die(o, '密技！');
        }
      }
    }
    if (this.announce) {
      this.announce.t += dt;
      if (this.announce.t > this.announce.life) this.announce = null;
    }
    for (const p of this.popups) p.t += dt;
    this.popups = this.popups.filter((p) => p.t < 1.2);
    for (const ch of this.chars) ch.f.animT += dt;
    if (this.shakeT > 0) this.shakeT -= dt;
    const T = this.phaseT;
    switch (this.phase) {
      case 'intro':
        if (T > 3.2 || (T > 0.8 && c.confirm)) this.setPhase('vs');
        return;
      case 'vs':
        if (T > 2.2) {
          this.setPhase('fight');
          this.say('GO!', 0.8, '#5cff7a');
          this.sfx('fight');
        }
        return;
      case 'fight':
        this.clock += dt;
        this.fight(dt);
        return;
      case 'roundwin':
        this.P.f.state = 'victory';
        if (T > 2.6) {
          this.round++;
          if (this.round >= ROUNDS.length) {
            this.setPhase('won');
            this.sfx('confirm');
            this.g.audio.playBgm('menu');
          } else {
            this.setPhase('vs');
            this.startRound();
          }
        }
        return;
      case 'dead':
        this.fallChars(dt);
        if (T > 1.6) {
          this.setPhase('lost');
          this.lostSel = 0;
        }
        return;
      case 'lost':
        if (c.pressed('up') || c.pressed('down') || c.pressed('left') || c.pressed('right')) {
          this.lostSel = (this.lostSel + 1) % 2;
          this.sfx('move');
        }
        if (c.confirm) this.lostChoose(this.lostSel);
        return;
      case 'won':
        if ((T > 2 && c.confirm) || T > 9) this.finish();
        return;
    }
  }
  lostChoose(i) {
    this.sfx('confirm');
    if (i === 0) {
      // 選前驚天一跪：這一戰重來（通關時間 +10 秒）
      this.kneels++;
      this.clock += 10;
      this.say('選前驚天一跪！再來一次！', 1.6, '#ffe14a');
      this.startRound();
      this.setPhase('vs');
    } else this.g.goTitle();
  }
  onPointer(x, y) {
    if (this.phase === 'lost') {
      for (let i = 0; i < 2; i++) if (y > 268 + i * 52 && y < 316 + i * 52) this.lostChoose(i);
    } else if (this.phase === 'won' && this.phaseT > 2) this.finish();
    else if (this.phase === 'intro' && this.phaseT > 0.8) this.setPhase('vs');
  }
  finish() {
    if (this.done) return;
    this.done = true;
    // 從主選單直接玩「下樓梯 PK」：三連勝就到結算畫面
    if (this.cfg.standalone) {
      const P = this.P.f;
      this.g.goResult({
        cfg: { ...this.cfg, mode: 'shaft', round: 0, retry: false }, win: true, score: Math.max(1000, Math.round(this.votes + 60000 - this.clock * 100)), wave: 1, clearTime: this.clock,
        stats: { dmg: this.pushes || 0, kos: 4, maxCombo: 0 }, playerChar: P.char, winnerChar: P.char, stage: 'legislature',
      });
      return;
    }
    // 下一關（總統選舉）回到原本的橫向清版
    import('./story.js').then(({ StoryScene }) => {
      this.g.setScene(new StoryScene(this.g, { ...this.cfg, storyStage: 2, cp: 0, votes: 0, round: 0, retry: false, clock: this.clock, kneels: this.kneels }));
    });
  }

  fight(dt) {
    const R = this.R;
    this.speed += R.accel * dt;
    const up = this.speed * dt;
    this.depth += up;
    // 台階上升；最下面一直補新的
    for (const p of this.plats) {
      p.y -= up;
      if (p.breakT != null && !p.broken) {
        p.breakT -= dt;
        if (p.breakT <= 0) {
          p.broken = true;
          this.sfx('block');
        }
      }
    }
    this.plats = this.plats.filter((p) => p.y > CEIL - 30 && !(p.broken && p.breakT < -0.5));
    for (const p of this.plats) if (p.broken) p.breakT -= dt;
    this.nextY -= up;
    while (this.nextY < BOT + 120) {
      this.addRow(this.nextY);
      this.nextY += rand(66, 90) + this.round * 4;
    }
    // 得票一直增加（越後面的戰加越快）
    this.voteAcc = (this.voteAcc || 0) + dt * (220 + this.round * 120);
    if (this.voteAcc >= 100) {
      const n = Math.floor(this.voteAcc / 100) * 100;
      this.voteAcc -= n;
      this.votes += n;
    }
    for (const c of this.chars) if (c.ai && !c.dead) this.think(c, dt);
    for (const c of this.chars) this.move(c, dt, up);
    this.collide();
    for (const c of this.chars) this.updateAnim(c, dt);
    // 勝負
    if (this.P.dead) {
      this.setPhase('dead');
      this.say('落選…', 1.6, '#ff5a5a');
      this.sfx('ko');
    } else if (this.chars.every((c) => c === this.P || c.dead)) {
      this.setPhase('roundwin');
      const bonus = 5000 + this.round * 2000;
      this.votes += bonus;
      this.say(this.round === ROUNDS.length - 1 ? '三連勝！' : `第 ${this.round + 1} 戰 勝利！`, 2, '#5cff7a');
      this.pop(this.P, `+${bonus.toLocaleString()} 票`, '#5cff7a');
      this.sfx('confirm');
    }
  }

  // 電腦：找下面比較安全的台階，快撞到天花板或站在釘板上就往下跳；靠近玩家時偶爾推人
  think(c, dt) {
    const a = c.ai, R = this.R, P = this.P;
    a.t -= dt;
    if (a.t <= 0) {
      a.t = R.react * rand(0.7, 1.3);
      // 偶爾發呆（看台下觀眾、整理領帶…）
      if (Math.random() < R.daze) {
        a.t = rand(0.6, 1.4);
        a.gx = c.x;
        a.atk = false;
        c.aiDx = 0;
        return;
      }
      const danger = !c.plat || c.plat.type === 'spike' || c.plat.type === 'fragile' || c.y < CEIL + BODY + 110;
      let best = null, bs = 1e9;
      for (const p of this.plats) {
        if (p.broken || p.y < c.y + 20 || p.y > c.y + 320) continue;
        const s = Math.abs(p.x - c.x) + (p.type === 'spike' ? 900 : p.type === 'fragile' ? 120 : 0) + (p.y - c.y) * 0.4;
        if (s < bs) {
          bs = s;
          best = p;
        }
      }
      if (Math.random() < R.err) best = pick(this.plats.filter((p) => p.y > c.y + 20)) || best;
      if (c.plat && !danger && c.y > CEIL + BODY + 190) {
        a.gx = c.plat.x + Math.sin(this.time * 1.3 + c.i) * 20;
      } else if (best) {
        a.gx = best.x;
        // 要的台階就在腳下這塊的範圍裡：先走到邊緣掉下去
        if (c.plat && Math.abs(best.x - c.plat.x) < c.plat.w / 2 + HALF) {
          const side = best.x >= c.plat.x ? 1 : -1;
          a.gx = c.plat.x + side * (c.plat.w / 2 + HALF + 12);
          if (a.gx < X0 + HALF || a.gx > X1 - HALF) a.gx = c.plat.x - side * (c.plat.w / 2 + HALF + 12);
        }
      }
      // 推人：玩家在旁邊、自己血還夠
      const dx = P.x - c.x;
      a.atk = !P.dead && Math.abs(dx) < 62 && Math.abs(P.y - c.y) < 50 && c.hp > 3 && Math.random() < R.aggr * 0.5;
    }
    c.aiDx = Math.abs(a.gx - c.x) > 6 ? sign(a.gx - c.x) : 0;
    if (a.atk) {
      a.atk = false;
      c.f.facing = sign(P.x - c.x) || c.f.facing;
      this.tryPush(c);
    }
  }

  move(c, dt, up) {
    const f = c.f;
    if (c.inv > 0) c.inv -= dt;
    if (c.atkCD > 0) c.atkCD -= dt;
    if (c.stuck > 0) c.stuck -= dt;
    if (c.dead) {
      c.vy += 1500 * dt;
      c.y += c.vy * dt;
      return;
    }
    let dx = 0;
    if (c.stun > 0) c.stun -= dt;
    else if (c === this.P) {
      const ct = this.g.input.p1;
      dx = (ct.held('right') ? 1 : 0) - (ct.held('left') ? 1 : 0);
      if (ct.pressed('attack')) this.tryPush(c);
    } else dx = c.aiDx || 0;
    if (dx) f.facing = dx;
    c.walking = !!dx;
    c.push *= Math.exp(-6 * dt);
    let vx = dx * 210 + c.push;
    if (c.plat && c.plat.type === 'conv' && !c.plat.broken) vx += c.plat.dir * 80;
    c.x = clamp(c.x + vx * dt, X0 + HALF, X1 - HALF);
    // 站在台階上：跟著往上；走出邊緣就掉下去
    if (c.plat) {
      const p = c.plat;
      if (p.broken || Math.abs(c.x - p.x) > p.w / 2 + HALF * 0.6) {
        c.plat = null;
        c.vy = 0;
      } else c.y = p.y;
    }
    if (!c.plat) {
      const before = c.y;
      c.vy = Math.min(720, c.vy + 1500 * dt);
      c.y += c.vy * dt;
      if (c.vy > 0) {
        for (const p of this.plats) {
          if (p.broken || p === c.ignore) continue;
          if (Math.abs(c.x - p.x) > p.w / 2 + HALF * 0.6) continue;
          if (before <= p.y + up + 1 && c.y >= p.y) {
            this.land(c, p);
            break;
          }
        }
      }
    }
    // 頭撞到天花板的尖刺：扣血，並且從台階上掉下去
    if (c.y - BODY < CEIL) {
      c.y = CEIL + BODY;
      if (c.inv <= 0) {
        this.hurt(c, 3, '天花板！-3');
        c.inv = 1;
      }
      if (c.plat) {
        c.ignore = c.plat;
        c.plat = null;
        c.vy = 120;
      }
    }
    if (c.y - BODY > BOT) {
      c.hp = 0;
      this.die(c, '掉下去了！');
    }
  }
  land(c, p) {
    c.plat = p;
    c.y = p.y;
    c.vy = 0;
    c.ignore = null;
    const first = !p.seen.has(c);
    p.seen.add(c);
    if (p.type === 'spike') {
      if (first) this.hurt(c, 3, '釘板！-3');
    } else if (first && c.hp < MAXHP) {
      c.hp++;
      if (c === this.P) this.pop(c, '+1', '#5cff7a');
    }
    if (p.type === 'fragile' && p.breakT == null) p.breakT = 0.45;
    if (p.type === 'spring') {
      c.plat = null;
      c.vy = -560;
      this.sfx('jump');
    } else this.sfx('land');
  }
  hurt(c, n, msg) {
    if (CHEAT.on && c === this.P) return; // 密技：主角不受傷
    c.hp = Math.max(0, c.hp - n);
    c.f.flash = 0.2;
    c.f.setState('hurt');
    c.hurtT = 0.3;
    this.pop(c, msg, '#ff5a5a');
    this.sfx('hit');
    if (c === this.P) this.shakeT = 0.15;
    if (c.hp <= 0) this.die(c, '');
  }
  die(c, msg) {
    if (c.dead) return;
    if (CHEAT.on && c === this.P) {
      // 密技：主角不會死，掉下去就放回最上面的台階
      c.hp = MAXHP;
      const p = this.plats.filter((q) => !q.broken && q.type !== 'spike' && q.y > CEIL + BODY + 40).sort((a, b) => a.y - b.y)[0];
      if (p) {
        c.x = p.x;
        c.y = p.y;
        c.vy = 0;
        c.plat = p;
      }
      return;
    }
    c.dead = true;
    c.plat = null;
    c.vy = -260;
    c.f.setState('fall');
    if (msg) this.pop(c, msg, '#ff5a5a');
    if (c !== this.P) {
      this.votes += 1500;
      this.say(`${c.f.char.title} 出局！`, 1.2, '#ffd84a');
    }
    this.sfx('ko');
  }
  fallChars(dt) {
    for (const c of this.chars) {
      if (!c.dead) continue;
      c.vy += 1500 * dt;
      c.y += c.vy * dt;
    }
  }

  // 推人：把旁邊的人推開（會被推離台階），但推的人自己扣 1 血
  tryPush(c) {
    if (c.atkCD > 0 || c.stun > 0 || c.dead) return;
    c.atkCD = 0.6;
    c.f.setState('a1');
    c.atkT = 0.26;
    this.sfx('whiff');
    // 不分左右：打離自己最近、在範圍內的人，並自動轉身面向他
    const near = this.chars.filter((o) => o !== c && !o.dead && (o === this.P) !== (c === this.P) && Math.abs(o.x - c.x) < 66 && Math.abs(o.y - c.y) < 56);
    near.sort((a, b) => Math.abs(a.x - c.x) - Math.abs(b.x - c.x));
    const t = near[0];
    if (!t) return;
    const dir = sign(t.x - c.x) || c.f.facing;
    c.f.facing = dir;
    t.push = dir * 620;
    t.stun = 0.3;
    t.f.flash = 0.15;
    t.f.setState('hurt');
    t.hurtT = 0.3;
    c.hp = Math.max(0, c.hp - 1);
    this.pop(c, '推人 -1', '#ff9a3a');
    this.sfx('heavy');
    this.shakeT = 0.1;
    if (c === this.P) {
      this.votes += 300;
      this.pushes = (this.pushes || 0) + 1;
    }
    if (c.hp <= 0) this.die(c, '');
  }

  // 兩個人碰在一起：互相卡住（左右推不過去）
  collide() {
    const L = this.chars.filter((c) => !c.dead);
    for (let i = 0; i < L.length; i++) {
      for (let j = i + 1; j < L.length; j++) {
        const a = L[i], b = L[j];
        if (Math.abs(a.y - b.y) > 56) continue;
        const dx = b.x - a.x, d = Math.abs(dx);
        const min = HALF * 2;
        if (d >= min) continue;
        const s = sign(dx) || (a.i < b.i ? 1 : -1);
        const o = (min - d) / 2;
        a.x = clamp(a.x - s * o, X0 + HALF, X1 - HALF);
        b.x = clamp(b.x + s * o, X0 + HALF, X1 - HALF);
        a.push = b.push = 0;
        if (a.walking || b.walking) {
          if (!(a.stuck > 0)) this.popups.push({ t: 0, x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - BODY - 26, text: '卡住了！', color: '#ffffff' });
          a.stuck = b.stuck = 0.8;
        }
      }
    }
  }

  updateAnim(c, dt) {
    const f = c.f;
    f.stateT += dt;
    if (c.flash > 0) c.flash -= dt;
    if (f.flash > 0) f.flash -= dt;
    if (c.dead) return;
    if (c.atkT > 0) {
      c.atkT -= dt;
      return;
    }
    if (c.hurtT > 0) {
      c.hurtT -= dt;
      return;
    }
    const want = !c.plat ? 'jump' : c.walking ? 'walk' : 'idle';
    if (f.state !== want) f.setState(want);
  }

  // ───── 畫面 ─────
  draw() {
    const g = this.g, ctx = g.ctx, ox = g.ox, CW = g.CW;
    ctx.save();
    if (this.shakeT > 0) ctx.translate(rand(-4, 4), rand(-3, 3));
    this.drawBg(ctx, ox, CW);
    for (const p of this.plats) this.drawPlat(ctx, p);
    this.drawCeiling(ctx);
    // 角色（用遊戲本來的角色圖，縮小）
    for (const c of this.chars) {
      const f = c.f;
      if (c.y - BODY > BOT + 40) continue;
      if (c.inv > 0 && !c.dead && Math.floor(this.time * 20) % 2) continue;
      f.x = c.x;
      f.z = c.y - ARENA.floorY;
      f.y = 0;
      drawFighter(ctx, f);
      if (!c.dead) {
        // 頭上的名牌：玩家綠色、對手紅色
        const me = c === this.P;
        txt(ctx, me ? '1P' : c.f.char.title, c.x, c.y - BODY - 12, { size: me ? 13 : 11, weight: 900, color: me ? '#5cff7a' : '#ff8a8a', align: 'center', stroke: '#000', sw: 4 });
        if (c.stun > 0) for (let i = 0; i < 3; i++) {
          const a = this.time * 6 + (i * Math.PI * 2) / 3;
          drawStar(ctx, c.x + Math.cos(a) * 14, c.y - BODY + 4 + Math.sin(a) * 4, 4, '#ffe14a');
        }
      }
    }
    for (const p of this.popups) {
      const a = 1 - Math.max(0, p.t - 0.7) / 0.5;
      txt(ctx, p.text, p.x, p.y - p.t * 40, { size: 16, weight: 900, color: p.color, align: 'center', stroke: '#000', sw: 4, alpha: Math.max(0, a) });
    }
    ctx.restore();
    this.drawHUD(ctx, ox, CW);
    if (this.announce) this.drawAnnounce(ctx);
    const T = this.phaseT;
    if (this.phase === 'intro') this.drawIntro(ctx, T);
    if (this.phase === 'vs') this.drawVS(ctx, T);
    if (this.phase === 'lost') this.drawLost(ctx);
    if (this.phase === 'won') this.drawWon(ctx, T);
    if (this.paused) this.drawPause(ctx);
  }

  // 背景：政見發表會的舞台（有 Gemini 圖 assets/scenery/pk_sky 就用圖）
  drawBg(ctx, ox, CW) {
    const im = ASSETS.scenery.pk_sky;
    if (im) {
      const s = Math.max(CW / im.width, 540 / im.height);
      ctx.drawImage(im, -ox + (CW - im.width * s) / 2, 540 - im.height * s, im.width * s, im.height * s);
    } else {
      const gr = ctx.createLinearGradient(0, 0, 0, 540);
      gr.addColorStop(0, '#1a0a2a');
      gr.addColorStop(1, '#3a1430');
      ctx.fillStyle = gr;
      ctx.fillRect(-ox, 0, CW, 540);
      // 後面的看板（淡一點，不要搶走台階的注意力）
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#0b2a6a';
      ctx.fillRect(X0 + 40, 140, X1 - X0 - 80, 120);
      ctx.strokeStyle = '#ffd84a';
      ctx.lineWidth = 4;
      ctx.strokeRect(X0 + 40, 140, X1 - X0 - 80, 120);
      txt(ctx, '市長候選人　政見發表會', 480, 186, { size: 34, weight: 900, color: '#ffffff', align: 'center', stroke: '#000', sw: 6 });
      txt(ctx, '主辦：選舉委員會　　電視直播中', 480, 228, { size: 16, weight: 700, color: '#ffd84a', align: 'center' });
      ctx.restore();
      // 舞台燈光
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) {
        const x = X0 + 80 + i * 170 + Math.sin(this.time * 0.8 + i) * 40;
        const lg = ctx.createLinearGradient(x, 100, x, 540);
        lg.addColorStop(0, 'rgba(255,240,200,0.18)');
        lg.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(x - 10, 100);
        ctx.lineTo(x + 10, 100);
        ctx.lineTo(x + 90, 540);
        ctx.lineTo(x - 90, 540);
        ctx.fill();
      }
      ctx.restore();
      // 台下觀眾的剪影（會跟著揮手）
      ctx.fillStyle = '#0a0410';
      for (let i = 0; i < 26; i++) {
        const x = X0 - 10 + i * 27, b = Math.sin(this.time * 4 + i * 1.7) * 3;
        ctx.beginPath();
        ctx.arc(x, 520 + b, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - 15, 530 + b, 30, 20);
      }
    }
    // 兩側的紅色布幕（場地邊界）
    for (const [a, b] of [[-ox, X0], [X1, CW - ox]]) {
      const cg = ctx.createLinearGradient(a, 0, b, 0);
      cg.addColorStop(0, '#6a0a14');
      cg.addColorStop(0.5, '#b81a2a');
      cg.addColorStop(1, '#5a0810');
      ctx.fillStyle = cg;
      ctx.fillRect(a, 84, b - a, 456);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 3;
      for (let x = a + 14; x < b; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, 84);
        ctx.lineTo(x + Math.sin(x) * 4, 540);
        ctx.stroke();
      }
    }
    // 兩邊的講台
    for (const [x, d] of [[X0 - 70, 1], [X1 + 70, -1]]) {
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(x - 40, 420, 80, 120);
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(x - 40, 440, 80, 26);
      txt(ctx, d > 0 ? '1號' : '2號', x, 453, { size: 15, weight: 900, color: '#8a1020', align: 'center' });
      ctx.fillStyle = '#222';
      ctx.fillRect(x - 2, 380, 4, 40);
      ctx.beginPath();
      ctx.arc(x, 378, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    txt(ctx, `地下 ${Math.floor(this.depth / 70)} 層`, X1 + 70, 360, { size: 14, weight: 900, color: '#ffe14a', align: 'center', stroke: '#000', sw: 4 });
  }
  drawCeiling(ctx) {
    ctx.fillStyle = '#2a2a34';
    ctx.fillRect(X0, 84, X1 - X0, CEIL - 96);
    ctx.fillStyle = '#c8ccd6';
    ctx.strokeStyle = '#15121a';
    ctx.lineWidth = 1.5;
    for (let x = X0; x < X1; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, CEIL - 14);
      ctx.lineTo(x + 8, CEIL);
      ctx.lineTo(x + 16, CEIL - 14);
      ctx.fill();
      ctx.stroke();
    }
  }
  drawPlat(ctx, p) {
    const x = p.x - p.w / 2, y = p.y, w = p.w;
    if (p.broken) {
      ctx.globalAlpha = Math.max(0, 1 + p.breakT * 2);
      ctx.fillStyle = '#c8a878';
      ctx.fillRect(x, y + 6 - p.breakT * 60, w / 2 - 4, 8);
      ctx.fillRect(x + w / 2 + 4, y + 10 - p.breakT * 80, w / 2 - 4, 8);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.strokeStyle = '#15121a';
    ctx.lineWidth = 2;
    switch (p.type) {
      case 'normal':
        // 講台木板
        ctx.fillStyle = '#c87a3a';
        ctx.fillRect(x, y, w, 14);
        ctx.strokeRect(x, y, w, 14);
        ctx.fillStyle = '#e8a060';
        ctx.fillRect(x + 2, y + 2, w - 4, 3);
        break;
      case 'spike':
        // 釘板（踩到扣血）
        ctx.fillStyle = '#6a6a74';
        ctx.fillRect(x, y, w, 12);
        ctx.strokeRect(x, y, w, 12);
        ctx.fillStyle = '#e8ecf4';
        for (let i = 0; i < w; i += 13) {
          ctx.beginPath();
          ctx.moveTo(x + i, y);
          ctx.lineTo(x + i + 6.5, y - 12);
          ctx.lineTo(x + i + 13, y);
          ctx.fill();
          ctx.stroke();
        }
        break;
      case 'conv': {
        // 輸送帶（箭頭方向）
        ctx.fillStyle = '#3a3a44';
        ctx.fillRect(x, y, w, 14);
        ctx.strokeRect(x, y, w, 14);
        ctx.fillStyle = '#ffd84a';
        const o = ((this.time * 80 * p.dir) % 20 + 20) % 20;
        for (let i = -20; i < w; i += 20) {
          const ax = x + i + o;
          if (ax < x + 2 || ax > x + w - 10) continue;
          ctx.beginPath();
          ctx.moveTo(ax + (p.dir > 0 ? 0 : 8), y + 3);
          ctx.lineTo(ax + (p.dir > 0 ? 8 : 0), y + 7);
          ctx.lineTo(ax + (p.dir > 0 ? 0 : 8), y + 11);
          ctx.fill();
        }
        break;
      }
      case 'fragile': {
        // 紙板看板（踩一下就塌）
        const sh = p.breakT != null ? rand(-2, 2) : 0;
        ctx.fillStyle = '#e8d8b0';
        ctx.fillRect(x + sh, y, w, 12);
        ctx.strokeRect(x + sh, y, w, 12);
        ctx.strokeStyle = '#8a6a3a';
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3 + sh, y);
        ctx.lineTo(x + w * 0.4 + sh, y + 12);
        ctx.moveTo(x + w * 0.7 + sh, y);
        ctx.lineTo(x + w * 0.6 + sh, y + 12);
        ctx.stroke();
        break;
      }
      case 'spring':
        // 彈簧
        ctx.fillStyle = '#5cc85c';
        ctx.fillRect(x, y, w, 8);
        ctx.strokeRect(x, y, w, 8);
        ctx.strokeStyle = '#c8ccd6';
        ctx.lineWidth = 3;
        for (const sx of [x + 18, x + w - 18]) {
          ctx.beginPath();
          for (let k = 0; k < 4; k++) {
            ctx.lineTo(sx - 6, y + 8 + k * 4);
            ctx.lineTo(sx + 6, y + 10 + k * 4);
          }
          ctx.stroke();
        }
        break;
    }
  }

  drawHUD(ctx, ox, CW) {
    const g = ctx.createLinearGradient(0, 0, 0, 82);
    g.addColorStop(0, 'rgba(8,8,20,0.96)');
    g.addColorStop(1, 'rgba(20,18,40,0.92)');
    ctx.fillStyle = g;
    ctx.fillRect(-ox, 0, CW, 82);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(-ox, 82, CW, 2);
    const panelFor = (c, x, mirror) => {
      const ps = 56, px = mirror ? x + 260 - ps : x;
      drawPortrait(ctx, c.f.char, px, 12, ps, c === this.P ? '#5cff7a' : '#ff5a3c');
      if (c.dead) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(px, 12, ps, ps);
        txt(ctx, '出局', px + ps / 2, 40, { size: 15, weight: 900, align: 'center', color: '#ff3b3b', stroke: '#000', sw: 4 });
      }
      const bx = mirror ? x : x + ps + 8, bw = 260 - ps - 8;
      txt(ctx, c.f.char.title, mirror ? bx + bw : bx, 20, { size: 14, weight: 900, color: '#fff', align: mirror ? 'right' : 'left', stroke: '#000', sw: 3 });
      segBar(ctx, bx, 32, bw, 14, c.hp / MAXHP, { segs: MAXHP, colors: ['#46e04a', '#ffd84a', '#ff4a3a'], mirror });
      txt(ctx, `${c.hp} / ${MAXHP}`, mirror ? bx : bx + bw, 58, { size: 11, weight: 900, color: '#cfd3e6', align: mirror ? 'left' : 'right' });
    };
    panelFor(this.P, 10, false);
    const opps = this.chars.slice(1);
    opps.forEach((c, i) => panelFor(c, 690 - i * 270 + (opps.length > 1 ? 0 : 0), true));
    // 中間：第幾戰＋得票
    const cx = opps.length > 1 ? 330 : 480;
    if (opps.length === 1) {
      txt(ctx, this.cfg.standalone ? '下樓梯 PK・政見發表會' : `第二關　市長選舉・政見發表會`, cx, 16, { size: 14, weight: 900, color: '#ffd84a', align: 'center' });
      txt(ctx, `第 ${this.round + 1} 戰 / 3　${this.round === 2 ? '1 打 2' : '1 對 1'}`, cx, 38, { size: 16, weight: 900, color: '#fff', align: 'center' });
      txt(ctx, `得票 ${this.votes.toLocaleString()}`, cx, 60, { size: 15, weight: 900, color: '#5cff7a', align: 'center' });
    } else {
      txt(ctx, `第 3 戰：1 打 2！`, 960 - 10, 98, { size: 15, weight: 900, color: '#ff9a3a', align: 'right', stroke: '#000', sw: 4 });
      txt(ctx, `得票 ${this.votes.toLocaleString()}`, 10, 98, { size: 15, weight: 900, color: '#5cff7a', stroke: '#000', sw: 4 });
    }
    const m = Math.floor(this.clock / 60), sec = Math.floor(this.clock % 60);
    txt(ctx, `⏱ ${m}:${String(sec).padStart(2, '0')}`, 480, 528, { size: 13, weight: 900, color: '#ffd84a', align: 'center', stroke: '#000', sw: 4 });
    // 連勝記號
    for (let i = 0; i < 3; i++) {
      const won = i < this.round || (i === this.round && ['roundwin', 'won'].includes(this.phase));
      ctx.fillStyle = won ? '#ffd84a' : 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.arc(450 + i * 30, 93, 7, 0, Math.PI * 2);
      ctx.fill();
      if (won) txt(ctx, '勝', 450 + i * 30, 93, { size: 10, weight: 900, color: '#8a1020', align: 'center' });
    }
  }

  drawAnnounce(ctx) {
    const a = this.announce;
    const k = easeOut(Math.min(1, a.t / 0.2));
    const al = a.t > a.life - 0.3 ? (a.life - a.t) / 0.3 : 1;
    txt(ctx, a.text, 480, 300, { size: 26 + 26 * k, weight: 900, color: a.color, align: 'center', stroke: '#000', sw: 8, alpha: Math.max(0, al) });
  }
  drawIntro(ctx, T) {
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    pixelText(ctx, this.cfg.standalone ? 'PK MODE' : 'STAGE 2', 480, 130, { size: 24, scale: 2, font: 'px', color: '#ffd84a', outline: '#000' });
    txt(ctx, this.cfg.standalone ? '下樓梯 PK' : '市長選舉', 480, 184, { size: 48, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 8 });
    txt(ctx, '政見發表會・下樓梯 PK', 480, 230, { size: 20, weight: 900, color: '#ff9a3a', align: 'center' });
    const lines = [
      '台階會一直往上升，頭撞到天花板的尖刺會扣血，掉出畫面就輸',
      '踩一般台階 +1 血；釘板 -3 血；輸送帶會帶著你走；紙板踩了就塌；彈簧會彈起來',
      '碰到對手會互相卡住 → 按「攻擊」把他推下去（推人自己會 -1 血）',
      `連贏三戰就${this.cfg.standalone ? '獲勝' : '當選市長'}！第 1、2 戰 1 對 1，第 3 戰要 1 打 2`,
    ];
    lines.forEach((l, i) => txt(ctx, l, 480, 290 + i * 34, { size: 16, weight: 700, color: '#e8ecff', align: 'center' }));
    if (T > 0.8 && blink(T, 1.5)) txt(ctx, '按確定開始', 480, 450, { size: 15, color: '#ffd84a', align: 'center' });
  }
  drawVS(ctx, T) {
    const a = T < 0.2 ? T / 0.2 : T > 1.9 ? Math.max(0, (2.2 - T) / 0.3) : 1;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(-this.g.ox, 170, this.g.CW, 190);
    txt(ctx, `第 ${this.round + 1} 戰${this.round === 2 ? '（最終戰：1 打 2）' : ''}`, 480, 200, { size: 22, weight: 900, color: '#ffd84a', align: 'center' });
    const opp = this.chars.slice(1).map((c) => c.f.char.title).join('＋');
    txt(ctx, `${this.P.f.char.title}　VS　${opp}`, 480, 258, { size: 34, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 7 });
    txt(ctx, ['熱身賽：台階慢慢升', '台階變快了，對手也會主動推人！', '最快的台階＋兩個對手夾攻！'][this.round], 480, 312, { size: 16, weight: 700, color: '#ff9a3a', align: 'center' });
    ctx.restore();
  }
  drawLost(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    panel(ctx, 260, 140, 440, 260);
    txt(ctx, '落選', 480, 190, { size: 52, weight: 900, color: '#ff5a5a', align: 'center', stroke: '#000', sw: 8 });
    txt(ctx, '要使出選前驚天一跪嗎？', 480, 236, { size: 18, weight: 900, color: '#ffe14a', align: 'center' });
    const opts = [['選前驚天一跪', `第 ${this.round + 1} 戰重來（通關時間 +10 秒）`], ['回到標題', '']];
    opts.forEach(([o, d], i) => {
      const y = 292 + i * 52;
      const sel = i === this.lostSel;
      if (sel) {
        ctx.fillStyle = 'rgba(255,216,74,0.18)';
        ctx.fillRect(290, y - 22, 380, 46);
      }
      txt(ctx, (sel ? '▶ ' : '　') + o, 300, y - (d ? 6 : 0), { size: 20, weight: 900, color: sel ? '#ffd84a' : '#fff' });
      if (d) txt(ctx, d, 330, y + 14, { size: 11, color: '#aab' });
    });
  }
  drawWon(ctx, T) {
    ctx.fillStyle = `rgba(0,0,0,${Math.min(0.6, T * 0.6)})`;
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    for (let i = 0; i < 60; i++) {
      const x = ((i * 97) % 1100) - 70 + Math.sin(T * 2 + i) * 20;
      const y = ((T * (120 + (i % 7) * 30) + i * 53) % 640) - 60;
      ctx.fillStyle = ['#ff5a3c', '#ffd84a', '#5cff7a', '#5cc8ff', '#ff7ad8'][i % 5];
      ctx.fillRect(x, y, 8, 12);
    }
    panel(ctx, 250, 110, 460, 300);
    txt(ctx, '開票結果', 480, 150, { size: 20, weight: 900, color: '#cfd3e6', align: 'center' });
    const n = Math.round(Math.min(1, T / 1.5) * Math.max(this.votes, GOAL));
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
      txt(ctx, this.cfg.standalone ? '三連勝！' : '當選！市長', 0, 0, { size: 40, weight: 900, color: '#ff2a2a', align: 'center' });
      ctx.restore();
    }
    if (T > 2.2) {
      txt(ctx, this.cfg.standalone ? '恭喜！政見發表會三連勝！' : '下一關：第三關「總統選舉」', 480, 360, { size: 16, weight: 900, color: '#ffd84a', align: 'center' });
      if (blink(T, 1.5)) txt(ctx, '按確定繼續', 480, 390, { size: 14, color: '#fff', align: 'center' });
    }
  }
  drawPause(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    panel(ctx, 330, 180, 300, 180);
    txt(ctx, '暫停', 480, 220, { size: 30, weight: 900, color: '#fff', align: 'center' });
    ['繼續', '回到標題'].forEach((o, i) => txt(ctx, (i === this.pauseSel ? '▶ ' : '　') + o, 420, 280 + i * 40, { size: 20, weight: 900, color: i === this.pauseSel ? '#ffd84a' : '#fff' }));
  }
}
