// 角色本體：狀態機 + 物理
import { ARENA, clamp } from './util.js';
import { MOVES } from './moves.js';

export const GRAV = 1900;

// 一般攻擊資料（時間單位：秒；x0~x1 是前方距離）
export const ATK = {
  a1: { dur: 0.26, on: 0.06, off: 0.16, x0: -5, x1: 56, zr: 18, dmg: 7, kb: 70, stun: 0.3, lunge: 70 },
  a2: { dur: 0.28, on: 0.07, off: 0.18, x0: -5, x1: 58, zr: 18, dmg: 8, kb: 80, stun: 0.32, lunge: 80 },
  a3: { dur: 0.48, on: 0.14, off: 0.27, x0: -5, x1: 66, zr: 20, dmg: 13, kb: 230, knock: true, launch: 340, lunge: 120, heavy: true },
  jatk: { dur: 9, on: 0.05, off: 0.6, x0: -8, x1: 56, zr: 20, dmg: 11, kb: 120, stun: 0.38, air: true },
  ratk: { dur: 0.5, on: 0.06, off: 0.36, x0: -5, x1: 62, zr: 20, dmg: 15, kb: 300, knock: true, launch: 300, heavy: true },
};
const NEXT = { a1: 'a2', a2: 'a3' };
const NO_FRICTION = new Set(['walk', 'run', 'jump', 'jatk', 'ratk', 'fall', 'special', 'super', 'grabbed']);

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
    this.mp = o.mp != null ? o.mp : 20;
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
    this.stun = 0;
    this.dizzyDur = 0;
    this.dead = false;
    this.grabber = null;
    this.combo = 0;
    this.comboT = 0;
    this.stats = { dmg: 0, kos: 0, maxCombo: 0 };
  }

  get spd() {
    return this.char.mul.spd;
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

  update(dt, b) {
    this.time += dt;
    this.stateT += dt;
    this.animT += dt;
    if (this.invuln > 0) this.invuln -= dt;
    if (this.armor > 0) this.armor -= dt;
    if (this.flash > 0) this.flash -= dt;
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) this.combo = 0;
    }
    if (!this.dead && b.fightOn) this.mp = Math.min(100, this.mp + dt * 2.5);
    const st = this.state;
    if (st === 'idle' || st === 'walk' || st === 'run') this.groundControl(dt, b);
    else if (st === 'jump') this.airControl(dt, b);
    else if (ATK[st]) this.attackUpdate(dt, b);
    else this.otherUpdate(dt, b);
    if (this.state !== 'grabbed') this.physics(dt, b);
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

    const mv = MOVES[this.char.id];
    if (c.pressed('super') && this.mp >= 100) {
      b.startSuper(this);
      return;
    }
    if (c.pressed('special') && this.mp >= mv.special.cost) {
      this.startSpecial(b);
      return;
    }
    if (c.pressed('attack')) {
      if (this.state === 'run') {
        this.setState('ratk');
        this.vx = this.facing * 360 * this.spd;
      } else this.startAttack('a1', b);
      b.sfx('whiff');
      return;
    }
    if (c.pressed('jump')) {
      this.setState('jump');
      this.vy = 640;
      const sp = this.running ? 340 : 170;
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
    const sp = this.running ? 330 : 170;
    this.vx = dx * sp * this.spd;
    this.vz = dz * 115 * this.spd;
    this.setMove(dx || dz ? (this.running && dx ? 'run' : 'walk') : 'idle');
  }

  airControl(dt, b) {
    const c = this.ctrl;
    if (b.fightOn && c.pressed('attack') && !this.mv.airAtk) {
      this.mv.airAtk = true;
      this.state = 'jatk';
      this.stateT = 0;
      this.hitList.clear();
      b.sfx('whiff');
    }
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
    if (this.state === 'jatk') return; // 落地時結束
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
    if (st === 'defend') {
      if (!this.ctrl.held('defend') || !b.fightOn) this.setState('idle');
    } else if (st === 'hurt') {
      if (T >= this.stun) this.setState('idle');
    } else if (st === 'down') {
      this.invuln = 0.3;
      if (T >= 0.75) {
        this.setState('getup');
      }
    } else if (st === 'getup') {
      this.invuln = 0.45;
      if (T >= 0.35) this.setState('idle');
    } else if (st === 'dizzy') {
      if (T >= this.dizzyDur) this.setState('idle');
    } else if (st === 'land') {
      if (T >= 0.08) this.setState('idle');
    } else if (st === 'special' || st === 'super') {
      const mv = MOVES[this.char.id];
      const def = st === 'special' ? mv.special : mv.super;
      def.update(this, b, dt);
      if (this.mv.done || this.stateT >= def.dur) {
        if (st === 'super') this.armor = 0;
        this.vx = this.vz = 0;
        this.setState('idle');
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

  startSpecial(b) {
    const def = MOVES[this.char.id].special;
    this.mp -= def.cost;
    this.setState('special');
    this.mv = {};
    this.vx = this.vz = 0;
    if (def.start) def.start(this, b);
    b.sfx('special');
  }

  physics(dt, b) {
    const wasAir = this.airborne;
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
    if (st === 'jump' || st === 'jatk') {
      this.vx = this.vz = 0;
      this.setState('land');
      b.sfx('land');
    } else if (st === 'fall') {
      this.vx *= 0.3;
      this.vz = 0;
      b.fx.add({ type: 'dust', x: this.x, z: this.z, y: 0, life: 0.4, big: true });
      b.sfx('land');
      if (this.hp <= 0) this.die(b);
      else this.setState('down');
    }
  }

  die(b) {
    this.setState('ko');
    this.dead = true;
    this.vx = this.vz = 0;
  }

  // 被打到。回傳 'hit' | 'block' | 'armor' | null
  takeHit(src, h, b) {
    if (this.dead || this.invuln > 0 || this.state === 'down' || this.state === 'getup' || this.state === 'ko') return null;
    if (this.state === 'grabbed' && src !== this.grabber) return null;
    const dir = h.dir || Math.sign(this.x - src.x) || src.facing;
    if (this.state === 'defend' && this.facing === -dir && !h.unblockable && !this.airborne) {
      const d = h.dmg * 0.12;
      this.hp = Math.max(1, this.hp - d);
      this.vx = dir * 140;
      this.mp = Math.min(100, this.mp + 3);
      return 'block';
    }
    const dmg = h.dmg / this.char.mul.def;
    this.hp = Math.max(0, this.hp - dmg);
    this.flash = 0.12;
    this.mp = Math.min(100, this.mp + 5);
    if (this.armor > 0 && this.hp > 0) return 'armor';
    if (this.state === 'special' && this.mv.t && this.mv.t.state === 'grabbed') {
      this.mv.t.grabber = null;
    }
    if (h.dizzy && this.hp > 0 && !this.airborne) {
      this.setState('dizzy');
      this.dizzyDur = h.dizzy;
      this.vx = this.vz = 0;
    } else if (h.knock || this.hp <= 0 || this.airborne) {
      this.setState('fall');
      this.vy = h.launch || 320;
      this.vx = dir * (h.kb || 200);
      this.vz = 0;
      this.y = Math.max(this.y, 1);
    } else {
      this.setState('hurt');
      this.stun = h.stun || 0.3;
      this.vx = dir * (h.kb || 80);
    }
    if (!h.slip) this.facing = -dir;
    return 'hit';
  }
}
