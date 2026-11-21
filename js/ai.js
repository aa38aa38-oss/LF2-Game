// 電腦對手 AI：輸出和玩家一樣的 Controller 訊號
import { Controller } from './input.js';
import { specialDef } from './moves.js';
import { rand, sign } from './util.js';

const DIFF = {
  easy: { react: 0.5, aggr: 0.45, block: 0.08, special: 0.25, flip: 0.15, item: 0.3 },
  normal: { react: 0.3, aggr: 0.65, block: 0.22, special: 0.45, flip: 0.45, item: 0.6 },
  hard: { react: 0.16, aggr: 0.85, block: 0.42, special: 0.7, flip: 0.8, item: 0.85 },
};
const ATTACKING = new Set(['a1', 'a2', 'a3', 'jatk', 'djatk', 'ratk', 'special', 'super']);
const KINDS = ['fwd', 'up', 'down'];

export class AI {
  constructor(f, diff = 'normal', boost = 0) {
    this.f = f;
    const d = DIFF[diff] || DIFF.normal;
    this.p = {
      react: Math.max(0.1, d.react - boost * 0.02),
      aggr: Math.min(0.95, d.aggr + boost * 0.03),
      block: Math.min(0.6, d.block + boost * 0.03),
      special: Math.min(0.85, d.special + boost * 0.03),
      flip: Math.min(0.9, d.flip + boost * 0.05),
      item: d.item,
    };
    this.ctrl = new Controller();
    this.t = rand(0.2, 0.6);
    this.target = null;
    this.retarget = 0;
    this.mx = 0;
    this.mz = 0;
    this.def = false;
    this.jz = rand(-8, 8);
    this.flipTried = false;
  }

  pickTarget(b) {
    const foes = b.enemiesOf(this.f);
    if (!foes.length) return null;
    const d = (e) => Math.abs(e.x - this.f.x) + Math.abs(e.z - this.f.z) * 2;
    foes.sort((a, c) => d(a) - d(c));
    return Math.random() < 0.75 ? foes[0] : foes[Math.floor(Math.random() * foes.length)];
  }

  update(dt, b) {
    const f = this.f, c = this.ctrl;
    if (f.dead) {
      c.reset();
      return;
    }
    // 被打飛時嘗試翻身
    if (f.state === 'fall') {
      if (!this.flipTried && f.stateT > 0.2) {
        this.flipTried = true;
        if (Math.random() < this.p.flip) c.tap('jump');
      }
    } else this.flipTried = false;
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

  moveTo(x, z, stop = 8) {
    const f = this.f;
    this.mx = Math.abs(x - f.x) > stop ? sign(x - f.x) : 0;
    this.mz = Math.abs(z - f.z) > 6 ? sign(z - f.z) : 0;
  }

  useSpecial(kind) {
    const c = this.ctrl;
    this.mz = 0;
    c.state.up = kind === 'up';
    c.state.down = kind === 'down';
    // 特技鍵＋方向：在下一幀前先把方向設好
    this.mzForce = kind === 'up' ? -1 : kind === 'down' ? 1 : 0;
    this.mz = this.mzForce;
    c.tap('special');
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

    // 抓到人：揍兩下再丟
    if (f.state === 'catch') {
      this.mx = f.mv.punches >= 2 ? f.facing : 0;
      this.mz = 0;
      c.tap('attack');
      return;
    }
    // 手上有東西
    if (f.hold) {
      const type = f.hold.def.type;
      if ((type === 'heavy' || type === 'throw') && adz < 18 && adx < 420) {
        this.mx = sign(dx) !== f.facing ? sign(dx) : 0;
        this.mz = 0;
        c.tap('attack');
        return;
      }
      if (type === 'light' && adz < 16 && adx > 200 && adx < 450 && Math.random() < 0.25) {
        this.mx = sign(dx);
        c.wantRun = true;
        if (f.state === 'run') c.tap('attack');
        return;
      }
      if (type === 'heavy' || type === 'throw') {
        this.moveTo(f.x, t.z);
        return;
      }
    }
    // 撿道具
    if (!f.hold && b.items.length && Math.random() < this.p.item) {
      const low = f.hp < f.maxHp * 0.5;
      let best = null, bd = 1e9;
      for (const it of b.items) {
        if (it.y > 5) continue;
        const want = it.def.type === 'food' ? low || (it.kind === 'boba' && f.mp < 60) : adx > 120;
        if (!want) continue;
        const d = Math.abs(it.x - f.x) + Math.abs(it.z - f.z) * 2;
        if (d < bd && d < 360) {
          bd = d;
          best = it;
        }
      }
      if (best) {
        if (Math.abs(best.x - f.x) < 30 && Math.abs(best.z - f.z) < 16) {
          this.mx = this.mz = 0;
          c.tap('attack');
        } else this.moveTo(best.x, best.z, 12);
        return;
      }
    }
    if (t.state === 'down' || t.state === 'getup' || t.dead) {
      this.mx = adx < 90 ? -sign(dx) : 0;
      this.mz = 0;
      return;
    }
    // 暈眩的人：走過去抓
    if (t.state === 'dizzy' && adx < 70 && adz < 14 && !f.hold) {
      this.mx = sign(dx);
      this.mz = 0;
      return;
    }
    if (f.mp >= 100 && adx < 420 && Math.random() < this.p.special) {
      c.tap('super');
      return;
    }
    // 特技
    if (Math.random() < this.p.special * 0.7) {
      const ok = [];
      for (const k of KINDS) {
        const sp = specialDef(f.char.id, k);
        if (!sp || f.cd[k] > 0) continue;
        let good = false;
        if (sp.ai === 'proj') good = adz < 22 && adx > 90 && adx < 480;
        else if (sp.ai === 'close') good = adx < (sp.range || 120) && adz < 26;
        else if (sp.ai === 'mid') good = adx > 60 && adx < (sp.range || 250) && adz < 18;
        else if (sp.ai === 'grab') good = adx < 52 && adz < 18;
        else if (sp.ai === 'trap') good = adx > 70 && adx < 240 && adz < 30;
        else if (sp.ai === 'heal') good = f.hp < f.maxHp * 0.45;
        else if (sp.ai === 'crowd') good = b.enemiesOf(f).filter((e) => Math.abs(e.x - f.x) < 110 && Math.abs(e.z - f.z) < 40).length >= (b.fighters.length > 2 ? 2 : 1) && adx < 90;
        else if (sp.ai === 'escape') good = f.hp < f.maxHp * 0.4 && adx < 80 && ATTACKING.has(t.state);
        else if (sp.ai === 'defensive') good = ATTACKING.has(t.state) && adx < 100 && adz < 20;
        if (good) ok.push(k);
      }
      if (ok.length) {
        const k = ok[Math.floor(Math.random() * ok.length)];
        const sp = specialDef(f.char.id, k);
        this.mx = sp.ai === 'escape' ? -sign(dx) : sign(dx);
        f.facing = this.mx || f.facing;
        this.useSpecial(k);
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
    if (adx < 160 && adx > 70 && adz < 15 && Math.random() < 0.15) {
      c.wantRun = true;
      this.mx = sign(dx);
      if (Math.random() < 0.3) c.tap('jump');
    }
  }
}
