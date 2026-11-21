// 角色本體：狀態機 + 物理
// 參考小朋友齊打交（LF2）的核心機制：
//  - 倒地值（fall）：連續被打會累積，超過門檻就暈眩（可被抓）或被打倒
//  - 破防值（bdefend）：防禦能擋，但連續擋太多下會被破防
//  - 可回復血量：受傷時一部分血（深紅色）會慢慢回來；血越少回氣越快
//  - 防→方向→攻 指令技、跑步翻滾、被打飛時按跳可翻身、抓暈眩的人、撿道具
import { ARENA, clamp, sign } from './util.js';
import { MOVES, specialDef } from './moves.js';
import { ITEM_DEFS } from './items.js';

export const GRAV = 1900;
export const FALL_KO = 60; // 倒地值超過就倒
export const FALL_DIZZY = 40; // 超過就暈眩（可被抓）
export const BDEF_MAX = 60; // 破防門檻

// 一般攻擊（時間單位：秒；x0~x1 是前方距離；fall 倒地值；bdef 破防值）
export const ATK = {
  a1: { dur: 0.26, on: 0.06, off: 0.16, x0: -5, x1: 56, zr: 18, dmg: 7, kb: 70, stun: 0.3, lunge: 70, fall: 22, bdef: 16 },
  a2: { dur: 0.28, on: 0.07, off: 0.18, x0: -5, x1: 58, zr: 18, dmg: 8, kb: 80, stun: 0.32, lunge: 80, fall: 22, bdef: 16 },
  a3: { dur: 0.48, on: 0.14, off: 0.27, x0: -5, x1: 66, zr: 20, dmg: 13, kb: 230, launch: 340, lunge: 120, heavy: true, fall: 70, bdef: 45 },
  jatk: { dur: 9, on: 0.05, off: 0.6, x0: -8, x1: 56, zr: 20, dmg: 11, kb: 120, stun: 0.38, air: true, fall: 40, bdef: 25 },
  djatk: { dur: 9, on: 0.05, off: 0.7, x0: -8, x1: 62, zr: 22, dmg: 16, kb: 260, launch: 300, air: true, heavy: true, fall: 75, bdef: 50 },
  ratk: { dur: 0.5, on: 0.06, off: 0.36, x0: -5, x1: 62, zr: 20, dmg: 15, kb: 300, launch: 300, heavy: true, fall: 75, bdef: 60 },
  cpunch: { dur: 0.26, on: 0.08, off: 0.14, x0: -5, x1: 60, zr: 20, dmg: 8, fall: 0, bdef: 0 },
};
const NEXT = { a1: 'a2', a2: 'a3' };
const AIR_STATES = new Set(['fall', 'jump', 'jatk', 'djatk', 'flip']);
const NO_FRICTION = new Set(['walk', 'run', 'jump', 'jatk', 'djatk', 'ratk', 'fall', 'special', 'super', 'grabbed', 'roll', 'flip', 'caught']);

export class Fighter {
  constructor(char, o) {
    this.char = char;
    this.team = o.team;
    this.ctrl = o.ctrl;
    this.cpu = !!o.cpu;
    this.label = o.label || '';
    this.x = o.x;
    this.z = o.z;
    this.y = 0;
    this.vx = this.vz = this.vy = 0;
    this.facing = o.facing || 1;
    this.maxHp = Math.round(420 * (o.hpMul || 1));
    this.hp = this.maxHp;
    this.cap = this.maxHp; // 可回復上限（深紅色那段）
    this.mp = o.mp != null ? o.mp : 30;
    this.state = 'idle';
    this.stateT = 0;
    this.animT = Math.random() * 3;
    this.time = 0;
    this.invuln = 0;
    this.armor = 0;
    this.flash = 0;
    this.hitList = new Set();
    this.queue = false;
    this.running = false;
    this.lastTap = { dir: 0, t: -1 };
    this.mv = {};
    this.spKind = 'fwd';
    this.stun = 0;
    this.dizzyDur = 0;
    this.dead = false;
    this.grabber = null;
    this.caughtBy = null;
    this.catchT = null;
    this.hold = null; // 手上的道具
    this.fallPts = 0;
    this.bdef = 0;
    this.sinceHit = 99;
    this.combo = 0;
    this.comboT = 0;
    this.stats = { dmg: 0, kos: 0, maxCombo: 0 };
  }

  get spd() {
    return this.char.mul.spd * (this.hold && this.hold.def.type === 'heavy' ? 0.7 : 1);
  }
  get airborne() {
    return this.y > 0.5 || this.vy > 0;
  }

  setState(s) {
    this.state = s;
    this.stateT = 0;
    this.hitList.clear();
    if (s !== 'special' && s !== 'super') this.mv = {};
  }
  setMove(s) {
    if (this.state !== s) {
      this.state = s;
      this.stateT = 0;
    }
  }
  heal(hp, cap = 0) {
    this.cap = Math.min(this.maxHp, this.cap + cap);
    this.hp = Math.min(this.cap, this.hp + hp);
  }

  update(dt, b) {
    this.time += dt;
    this.stateT += dt;
    this.animT += dt;
    this.sinceHit += dt;
    if (this.invuln > 0) this.invuln -= dt;
    if (this.armor > 0) this.armor -= dt;
    if (this.flash > 0) this.flash -= dt;
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) this.combo = 0;
    }
    if (this.sinceHit > 0.5) this.fallPts = Math.max(0, this.fallPts - 45 * dt);
    this.bdef = Math.max(0, this.bdef - 22 * dt);
    if (!this.dead && b.fightOn) {
      // 血越少，回氣越快
      this.mp = Math.min(100, this.mp + dt * (2.5 + (1 - this.hp / this.maxHp) * 5));
      if (this.sinceHit > 2 && this.hp < this.cap && this.hp > 0) this.hp = Math.min(this.cap, this.hp + 5 * dt);
    }
    const st = this.state;
    if (st === 'idle' || st === 'walk' || st === 'run') this.groundControl(dt, b);
    else if (st === 'jump') this.airControl(dt, b);
    else if (ATK[st]) this.attackUpdate(dt, b);
    else this.otherUpdate(dt, b);
    if (this.state !== 'grabbed' && this.state !== 'caught') this.physics(dt, b);
  }

  // 嘗試發特技。kind: 'fwd' | 'up' | 'down'
  trySpecial(b, kind) {
    const def = specialDef(this.char.id, kind);
    if (!def || this.mp < def.cost) return false;
    this.startSpecial(b, kind);
    return true;
  }
  // 讀取「防→方向→攻」或「特技鍵＋方向」
  readSpecial(b) {
    const c = this.ctrl;
    if (c.pressed('special')) {
      const k = c.held('up') ? 'up' : c.held('down') ? 'down' : 'fwd';
      return this.trySpecial(b, k);
    }
    if (c.pressed('attack')) {
      const cmd = c.command(this.facing);
      if (!cmd) return false;
      if (cmd === 'fwdL') this.facing = -1;
      if (cmd === 'fwdR') this.facing = 1;
      return this.trySpecial(b, cmd.startsWith('fwd') ? 'fwd' : cmd);
    }
    return false;
  }

  groundControl(dt, b) {
    const c = this.ctrl;
    if (!b.fightOn) {
      this.vx = this.vz = 0;
      this.setMove('idle');
      return;
    }
    const dx = (c.held('right') ? 1 : 0) - (c.held('left') ? 1 : 0);
    const dz = (c.held('down') ? 1 : 0) - (c.held('up') ? 1 : 0);
    for (const [btn, d] of [['left', -1], ['right', 1]]) {
      if (c.pressed(btn)) {
        if (this.lastTap.dir === d && this.time - this.lastTap.t < 0.28) this.running = true;
        this.lastTap = { dir: d, t: this.time };
      }
    }
    if (c.wantRun && dx) this.running = true;
    if (!dx || (this.running && dx !== this.facing && this.state === 'run')) this.running = false;
    if (dx) this.facing = dx;

    if (c.pressed('super') && this.mp >= 100) {
      b.startSuper(this);
      return;
    }
    if (this.readSpecial(b)) return;
    if (c.pressed('defend') && this.state === 'run') {
      // 跑步中按防禦：翻滾（無敵閃避）
      this.setState('roll');
      this.invuln = 0.42;
      this.vx = this.facing * 430;
      b.sfx('jump');
      return;
    }
    if (c.pressed('attack')) {
      const H = this.hold;
      if (H && (H.def.type === 'heavy' || H.def.type === 'throw' || this.state === 'run')) {
        b.throwHeld(this, this.state === 'run');
        return;
      }
      if (!H && b.tryPickup(this)) return;
      if (this.tryCatch(b)) return;
      if (this.state === 'run') {
        this.setState('ratk');
        this.vx = this.facing * 360 * this.spd;
      } else this.startAttack('a1');
      b.sfx('whiff');
      return;
    }
    if (c.pressed('jump')) {
      this.setState('jump');
      this.mv.dash = this.running;
      this.vy = this.running ? 560 : 640;
      const sp = this.running ? 400 : 170;
      this.vx = dx * sp * this.spd;
      this.vz = dz * 110 * this.spd;
      this.y = 1;
      b.sfx('jump');
      return;
    }
    if (c.held('defend')) {
      this.setState('defend');
      this.vx = this.vz = 0;
      return;
    }
    // 走進暈眩的人 → 抓住
    if (dx && this.tryCatch(b, true)) return;
    const sp = this.running ? 330 : 170;
    this.vx = dx * sp * this.spd;
    this.vz = dz * 115 * this.spd;
    this.setMove(dx || dz ? (this.running && dx ? 'run' : 'walk') : 'idle');
  }

  tryCatch(b, walking = false) {
    if (this.hold && this.hold.def.type === 'heavy') return false;
    const t = b.enemiesOf(this).find((e) => {
      const d = (e.x - this.x) * this.facing;
      return e.state === 'dizzy' && !e.airborne && d > 0 && d < (walking ? 40 : 52) && Math.abs(e.z - this.z) < 16;
    });
    if (!t) return false;
    this.setState('catch');
    this.catchT = t;
    this.mv.punches = 0;
    this.vx = this.vz = 0;
    t.setState('caught');
    t.caughtBy = this;
    t.vx = t.vz = t.vy = 0;
    t.y = 0;
    return true;
  }
  releaseCatch(toState = 'idle') {
    const t = this.catchT;
    this.catchT = null;
    if (t && t.state === 'caught') {
      t.caughtBy = null;
      t.setState(toState);
      t.fallPts = 0;
    }
  }

  airControl(dt, b) {
    const c = this.ctrl;
    if (!b.fightOn || !c.pressed('attack') || this.mv.airAtk) return;
    this.mv.airAtk = true;
    if (this.hold && this.hold.def.type !== 'food') {
      b.throwHeld(this, true);
      this.state = 'jump';
      return;
    }
    const dash = this.mv.dash;
    this.state = dash ? 'djatk' : 'jatk';
    this.stateT = 0;
    this.hitList.clear();
    b.sfx('whiff');
  }

  startAttack(name) {
    this.setState(name);
    this.queue = false;
    this.vx = 0;
    this.vz = 0;
  }

  attackUpdate(dt, b) {
    const a = ATK[this.state];
    const T = this.stateT;
    if (a.lunge && T < a.off) this.vx = this.facing * a.lunge * (1 - T / a.off);
    if (this.state === 'ratk') this.vx *= Math.exp(-4 * dt);
    if (T >= a.on && T <= a.off) b.meleeHit(this, a);
    if (a.air) return; // 落地時結束
    if (b.fightOn && NEXT[this.state] && this.ctrl.pressed('attack') && T > a.on * 0.5) this.queue = true;
    if (T >= a.dur) {
      if (this.queue && NEXT[this.state]) {
        const c = this.ctrl;
        const dx = (c.held('right') ? 1 : 0) - (c.held('left') ? 1 : 0);
        if (dx) this.facing = dx;
        this.startAttack(NEXT[this.state]);
        b.sfx('whiff');
      } else this.setState('idle');
    }
  }

  otherUpdate(dt, b) {
    const st = this.state;
    const T = this.stateT;
    const c = this.ctrl;
    if (st === 'defend') {
      if (b.fightOn && this.readSpecial(b)) return;
      if (b.fightOn && c.pressed('super') && this.mp >= 100) return b.startSuper(this);
      if (!c.held('defend') || !b.fightOn) this.setState('idle');
    } else if (st === 'hurt') {
      if (T >= this.stun) this.setState('idle');
    } else if (st === 'fall') {
      // 保險：被打飛太久（例如卡在牆角）就強制落地
      if (T > 2.5) {
        this.y = 0;
        this.vy = 0;
        this.onLand(b);
        return;
      }
      // 被打飛時按跳：空中翻身，直接站著落地
      if (b.fightOn && c.pressed('jump') && this.hp > 0 && T > 0.15 && !this.mv.noFlip && !this.thrownBy) {
        this.setState('flip');
        this.vy = Math.max(this.vy, 220);
        this.vx *= 0.35;
        this.invuln = 0.6;
        b.sfx('jump');
      }
    } else if (st === 'down') {
      // 倒地：時間到自動起身；按任何鍵可以提早起身
      this.invuln = 0.3;
      const quick = T > 0.2 && b.fightOn && (c.pressed('attack') || c.pressed('jump') || c.pressed('defend') || c.pressed('special'));
      if (T >= 0.6 || quick) this.setState('getup');
    } else if (st === 'getup') {
      this.invuln = 0.45;
      if (T >= 0.3) {
        this.setState('idle');
        this.invuln = 0.8; // 起身後短暫無敵（角色會閃爍）
      }
    } else if (st === 'dizzy') {
      if (T >= this.dizzyDur) this.setState('idle');
    } else if (st === 'land' || st === 'pick') {
      if (T >= (st === 'pick' ? 0.18 : 0.08)) this.setState('idle');
    } else if (st === 'roll') {
      if (T >= 0.42) {
        this.vx = 0;
        this.setState('idle');
      }
    } else if (st === 'catch') {
      const t = this.catchT;
      this.vx = this.vz = 0;
      if (!t || t.state !== 'caught' || t.dead) {
        this.catchT = null;
        return this.setState('idle');
      }
      t.x = this.x + this.facing * 34;
      t.z = this.z;
      t.facing = -this.facing;
      if (this.mv.punchT > 0) this.mv.punchT -= dt;
      if (b.fightOn && c.pressed('attack') && !(this.mv.punchT > 0)) {
        const dx = (c.held('right') ? 1 : 0) - (c.held('left') ? 1 : 0);
        if (dx || this.mv.punches >= 3) {
          // 丟出去：被丟的人會撞倒路上的人
          if (dx) this.facing = dx;
          this.catchT = null;
          t.caughtBy = null;
          t.setState('idle');
          t.x = this.x + this.facing * 20;
          b.applyHit(this, t, { dmg: 14, knock: true, launch: 330, kb: 430, dir: this.facing, unblockable: true, heavy: true });
          t.thrownBy = this;
          t.thrownHits = new Set([this]);
          b.sfx('throw');
          this.setState('a2');
          this.stateT = 0.2;
          return;
        }
        this.mv.punches++;
        this.mv.punchT = 0.22;
        this.mv.punchShow = 0.15;
        b.applyHit(this, t, { dmg: 8 * this.char.mul.pow, fall: 0, unblockable: true });
        b.sfx('hit');
      }
      if (this.mv.punchShow > 0) this.mv.punchShow -= dt;
      if (T > 2.2) {
        this.releaseCatch('hurt');
        this.setState('idle');
      }
    } else if (st === 'caught') {
      const g = this.caughtBy;
      if (!g || g.state !== 'catch' || g.dead) {
        this.caughtBy = null;
        this.setState('idle');
      }
    } else if (st === 'special' || st === 'super') {
      const def = st === 'special' ? specialDef(this.char.id, this.spKind) : MOVES[this.char.id].super;
      def.update(this, b, dt);
      if (this.mv.done || this.stateT >= def.dur) {
        if (st === 'super') this.armor = 0;
        this.vx = this.vz = 0;
        if (this.airborne) {
          this.state = 'jump';
          this.mv = { airAtk: true };
        } else this.setState('idle');
      }
    } else if (st === 'grabbed') {
      const g = this.grabber;
      if (!g || g.state !== 'special' || g.dead) {
        this.grabber = null;
        this.setState('fall');
        this.vy = 150;
        this.y = Math.max(1, this.y);
      }
    } else if (st === 'superwait') {
      this.vx = this.vz = 0;
    }
  }

  startSpecial(b, kind = 'fwd') {
    const def = specialDef(this.char.id, kind);
    this.mp -= def.cost;
    this.spKind = kind;
    this.setState('special');
    this.mv = {};
    this.vx = this.vz = 0;
    if (def.start) def.start(this, b);
    b.sfx('special');
  }

  physics(dt, b) {
    // 在空中類狀態一律套用重力（避免高度剛好很小時卡在半空中）
    const wasAir = this.airborne || AIR_STATES.has(this.state);
    if (wasAir) this.vy -= GRAV * dt;
    this.x += this.vx * dt;
    this.z += this.vz * dt;
    this.y += this.vy * dt;
    if (wasAir && this.y <= 0 && this.vy <= 0) {
      this.y = 0;
      this.vy = 0;
      this.onLand(b);
    }
    if (this.y < 0) this.y = 0;
    this.x = clamp(this.x, ARENA.xMin, ARENA.xMax);
    this.z = clamp(this.z, ARENA.zMin, ARENA.zMax);
    if (!this.airborne && !NO_FRICTION.has(this.state)) {
      const k = Math.exp(-9 * dt);
      this.vx *= k;
      this.vz *= k;
    }
  }

  onLand(b) {
    const st = this.state;
    if (st === 'jump' || st === 'jatk' || st === 'djatk' || st === 'flip') {
      this.vx = this.vz = 0;
      this.setState('land');
      b.sfx('land');
    } else if (st === 'fall') {
      this.vx *= 0.3;
      this.vz = 0;
      this.thrownBy = null;
      b.fx.add({ type: 'dust', x: this.x, z: this.z, y: 0, life: 0.4, big: true });
      b.sfx('land');
      if (this.hp <= 0) this.die(b);
      else this.setState('down');
    }
  }

  die() {
    this.setState('ko');
    this.dead = true;
    this.vx = this.vz = 0;
  }

  // 被打到。回傳 'hit' | 'block' | 'break' | 'armor' | null
  takeHit(src, h, b) {
    if (this.dead || this.invuln > 0 || ['down', 'getup', 'ko', 'roll'].includes(this.state)) return null;
    // 空中追打上限：被打飛後最多再被打中 2 下，之後到落地前都打不到（避免一直爬不起來）
    const wasFall = this.state === 'fall';
    if (wasFall && (this.juggle || 0) >= 2) return null;
    if (this.state === 'grabbed' && src !== this.grabber) return null;
    if (this.state === 'caught' && src !== this.caughtBy && !h.knock) return null;
    const dir = h.dir || Math.sign(this.x - src.x) || src.facing;
    // 防禦（只擋正面）
    if (this.state === 'defend' && this.facing === -dir && !h.unblockable && !this.airborne) {
      this.bdef += h.bdef != null ? h.bdef : h.knock ? 45 : 20;
      const d = h.dmg * 0.12;
      this.hp = Math.max(1, this.hp - d);
      this.cap = Math.max(this.hp, this.cap - d * 0.3);
      this.mp = Math.min(100, this.mp + 3);
      if (this.bdef >= BDEF_MAX) {
        this.bdef = 0;
        this.setState('hurt');
        this.stun = 0.6;
        this.vx = dir * 160;
        b.fx.add({ type: 'text', x: this.x, z: this.z, y: 120, text: '破防！', color: '#ff6a4a', size: 26, life: 0.8 });
        return 'break';
      }
      this.vx = dir * 140;
      return 'block';
    }
    const dmg = h.dmg / this.char.mul.def;
    this.hp = Math.max(0, this.hp - dmg);
    this.cap = Math.max(this.hp, this.cap - dmg * 0.35);
    this.sinceHit = 0;
    this.flash = 0.12;
    this.mp = Math.min(100, this.mp + 5);
    // 被抓著的時候：只扣血，不改狀態
    if (this.state === 'caught' && src === this.caughtBy && !h.knock && this.hp > 0) return 'hit';
    if (this.state === 'caught' && this.caughtBy) {
      this.caughtBy.catchT = null;
      this.caughtBy = null;
    }
    if (this.armor > 0 && this.hp > 0) return 'armor';
    if (this.state === 'catch') this.releaseCatch('idle');
    if (this.state === 'special' && this.mv.t && this.mv.t.state === 'grabbed') this.mv.t.grabber = null;
    this.fallPts += h.fall != null ? h.fall : h.knock ? 80 : 25;
    const knock = h.knock || this.fallPts >= FALL_KO || this.hp <= 0 || this.airborne;
    if (knock && this.hold) b.dropHeld(this);
    if (h.dizzy && this.hp > 0 && !this.airborne) {
      this.setState('dizzy');
      this.dizzyDur = h.dizzy;
      this.vx = this.vz = 0;
    } else if (knock) {
      this.juggle = wasFall ? (this.juggle || 0) + 1 : 0;
      this.setState('fall');
      this.fallPts = 0;
      this.vy = h.launch || 320;
      this.vx = dir * (h.kb || 200);
      this.vz = 0;
      this.y = Math.max(this.y, 1);
      this.mv.noFlip = !!h.noFlip;
    } else if (this.fallPts >= FALL_DIZZY) {
      // 搖搖晃晃：這時候走過去就能抓住他
      this.setState('dizzy');
      this.dizzyDur = 1.0;
      this.vx = dir * 60;
    } else {
      this.setState('hurt');
      this.stun = h.stun || 0.3;
      this.vx = dir * (h.kb || 80);
    }
    if (!h.slip) this.facing = -dir;
    return 'hit';
  }
}

export { sign, ITEM_DEFS };
