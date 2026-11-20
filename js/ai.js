// 電腦對手 AI：輸出和玩家一樣的 Controller 訊號
import { Controller } from './input.js';
import { MOVES } from './moves.js';
import { rand, sign } from './util.js';

const DIFF = {
  easy: { react: 0.5, aggr: 0.45, block: 0.08, special: 0.25 },
  normal: { react: 0.3, aggr: 0.65, block: 0.22, special: 0.45 },
  hard: { react: 0.16, aggr: 0.85, block: 0.42, special: 0.7 },
};
const ATTACKING = new Set(['a1', 'a2', 'a3', 'jatk', 'ratk', 'special', 'super']);

export class AI {
  constructor(f, diff = 'normal', boost = 0) {
    this.f = f;
    const d = DIFF[diff] || DIFF.normal;
    this.p = {
      react: Math.max(0.1, d.react - boost * 0.02),
      aggr: Math.min(0.95, d.aggr + boost * 0.03),
      block: Math.min(0.6, d.block + boost * 0.03),
      special: Math.min(0.85, d.special + boost * 0.03),
    };
    this.ctrl = new Controller();
    this.t = rand(0.2, 0.6);
    this.target = null;
    this.retarget = 0;
    this.mx = 0;
    this.mz = 0;
    this.def = false;
    this.jz = rand(-8, 8);
  }

  pickTarget(b) {
    const foes = b.enemiesOf(this.f);
    if (!foes.length) return null;
    foes.sort((a, c) => Math.abs(a.x - this.f.x) + Math.abs(a.z - this.f.z) * 2 - (Math.abs(c.x - this.f.x) + Math.abs(c.z - this.f.z) * 2));
    return Math.random() < 0.75 ? foes[0] : foes[Math.floor(Math.random() * foes.length)];
  }

  update(dt, b) {
    const f = this.f, c = this.ctrl;
    if (f.dead) {
      c.reset();
      return;
    }
    this.t -= dt;
    this.retarget -= dt;
    if (!this.target || this.target.dead || this.retarget <= 0) {
      this.target = this.pickTarget(b);
      this.retarget = rand(2, 4);
    }
    if (this.t <= 0) {
      this.t = this.p.react * rand(0.7, 1.3);
      this.decide(b);
    }
    c.state.left = this.mx < 0;
    c.state.right = this.mx > 0;
    c.state.up = this.mz < 0;
    c.state.down = this.mz > 0;
    c.state.defend = this.def;
  }

  decide(b) {
    const f = this.f, c = this.ctrl, t = this.target;
    c.wantRun = false;
    this.def = false;
    if (!t) {
      this.mx = this.mz = 0;
      return;
    }
    const dx = t.x - f.x, dz = t.z - f.z, adx = Math.abs(dx), adz = Math.abs(dz);
    const mv = MOVES[f.char.id];

    if (t.state === 'down' || t.state === 'getup' || t.dead) {
      this.mx = adx < 90 ? -sign(dx) : 0;
      this.mz = 0;
      return;
    }
    if (f.mp >= 100 && adx < 420 && Math.random() < this.p.special) {
      c.tap('super');
      return;
    }
    const sp = mv.special;
    if (f.mp >= sp.cost + 10 && f.mp < 65 && Math.random() < this.p.special * 0.7) {
      let ok = false;
      if (sp.ai === 'proj') ok = adz < 22 && adx > 90 && adx < 480;
      else if (sp.ai === 'close') ok = adx < (sp.range || 120) && adz < 32;
      else if (sp.ai === 'grab') ok = adx < 52 && adz < 18;
      else if (sp.ai === 'trap') ok = adx > 70 && adx < 240 && adz < 30;
      if (ok) {
        this.mx = sign(dx);
        this.mz = 0;
        c.tap('special');
        return;
      }
    }
    if (ATTACKING.has(t.state) && adx < 95 && adz < 26 && Math.random() < this.p.block) {
      this.def = true;
      this.mx = this.mz = 0;
      f.facing = sign(dx) || f.facing;
      return;
    }
    if (adx < 64 && adz < 15) {
      if (Math.random() < this.p.aggr) {
        this.mx = sign(dx) !== f.facing ? sign(dx) : 0;
        this.mz = 0;
        c.tap('attack');
      } else {
        this.mx = -sign(dx);
        this.mz = Math.random() < 0.5 ? 1 : -1;
      }
      return;
    }
    if (Math.random() < 0.08) {
      this.mx = Math.random() < 0.5 ? -1 : 1;
      this.mz = Math.random() < 0.5 ? -1 : 1;
      return;
    }
    const want = t.x - sign(dx || 1) * 46;
    this.mx = Math.abs(want - f.x) > 10 ? sign(want - f.x) : 0;
    this.mz = Math.abs(dz + this.jz * 0.3) > 7 ? sign(dz) : 0;
    if (adx > 280 && Math.random() < 0.5) c.wantRun = true;
    if (Math.random() < 0.04) c.tap('jump');
    if (adx < 140 && adx > 70 && adz < 15 && Math.random() < 0.15) {
      c.wantRun = true;
      this.mx = sign(dx);
    }
  }
}
