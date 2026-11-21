// 對戰場景：1v1、四人亂鬥、連戰生存
import { ARENA, WORLD_W, rand, pick, shuffle, sign, easeOut, easeIn, clamp } from './util.js';
import { Fighter, ATK } from './fighter.js';
import { CHARS, CHAR_BY_ID } from './characters.js';
import { MOVES, specialDef, specialCD } from './moves.js';
import { AI } from './ai.js';
import { FX } from './fx.js';
import { STAGES, STAGE_BY_ID } from './stages.js';
import { drawFighter, drawShadow, drawBanana, drawPortrait, portrait, rrect } from './sprites.js';
import { ASSETS } from './assets.js';
import { ITEM_DEFS, spawnRandomItem, newItem, drawItem } from './items.js';
import { txt, pixelText, segBar, panel, blink, Hotspots } from './ui.js';

export const MODE_NAME = { '1v1': '單挑模式', brawl: '四人大亂鬥', survival: '連戰生存' };
const DIFF_MUL = { easy: 0.8, normal: 1, hard: 1.3 };

export class BattleScene {
  constructor(game, cfg) {
    this.g = game;
    this.cfg = cfg;
    this.hot = new Hotspots();
  }

  enter() {
    const cfg = this.cfg;
    this.stage = STAGE_BY_ID[cfg.stage] || STAGES[0];
    this.fx = new FX();
    this.projs = [];
    this.items = [];
    this.itemTimer = 5;
    this.fighters = [];
    this.time = 0;
    this.hitstop = 0;
    this.shakeAmt = 0;
    this.shakeT = 0;
    this.cutin = null;
    this.paused = false;
    this.pauseSel = 0;
    this.slow = 1;
    this.bank = 0;
    this.wave = 0;
    this.timer = 99;
    this.announce = null;
    this.player = this.addFighter(cfg.playerChar, { ctrl: this.g.input.p1, team: 0, x: 760, z: 95, facing: 1, label: 'P1' });
    if (cfg.mode === '1v1') {
      this.addFighter(cfg.cpuChars[0], { cpu: true, team: 1, x: 1160, z: 95, facing: -1, label: 'CPU' });
      this.setPhase('intro');
    } else if (cfg.mode === 'brawl') {
      this.player.x = 760;
      this.player.z = 50;
      const pos = [[1160, 50], [1160, 150], [760, 150]];
      cfg.cpuChars.slice(0, 3).forEach((id, i) => this.addFighter(id, { cpu: true, team: i + 1, x: pos[i][0], z: pos[i][1], facing: pos[i][0] > 960 ? -1 : 1, label: 'CPU' }));
      this.setPhase('intro');
    } else {
      this.pool = shuffle(CHARS.map((c) => c.id).filter((id) => id !== cfg.playerChar));
      this.nextWave();
    }
    this.cam = { x: 0, y: 0 };
    this.updateCamera(0, true);
    this.g.audio.playBgm('battle');
  }

  // 跟隨玩家的鏡頭（手機會放大，並允許鏡頭超出場地邊界，讓角色保持在畫面中間、不被按鈕擋住）
  updateCamera(dt, snap = false) {
    const g = this.g;
    const touch = document.body.classList.contains('touch');
    this.zoom = touch ? 1.3 : 1;
    const viewW = g.CW / this.zoom, viewH = 540 / this.zoom;
    const P = this.player;
    const focus = !P.dead ? P : this.fighters.find((f) => !f.dead) || P;
    const margin = touch ? viewW * 0.5 : 0;
    let tx = focus.x - viewW / 2;
    tx = clamp(tx, -margin, WORLD_W + margin - viewW);
    this.cam.x = snap ? tx : this.cam.x + (tx - this.cam.x) * Math.min(1, dt * 7);
    this.cam.y = 540 - viewH;
    this.viewW = viewW;
  }

  addFighter(cid, o) {
    const f = new Fighter(CHAR_BY_ID[cid], o);
    if (o.cpu) {
      f.ai = new AI(f, this.cfg.difficulty, o.boost || 0);
      f.ctrl = f.ai.ctrl;
    }
    this.fighters.push(f);
    return f;
  }

  nextWave() {
    this.wave++;
    const n = this.wave;
    this.fighters = this.fighters.filter((f) => f === this.player);
    this.projs = [];
    if (n > 1) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + this.player.maxHp * 0.35);
      this.player.setState('idle');
      this.player.x = 760;
      this.player.z = 95;
      this.player.y = 0;
      this.player.vx = this.player.vz = this.player.vy = 0;
      this.player.invuln = 0;
      this.stage = STAGES[(STAGES.indexOf(this.stage) + 1) % STAGES.length];
    }
    const count = n >= 7 ? 3 : n >= 4 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const id = this.pool[(n - 1 + i * 2) % this.pool.length];
      this.addFighter(id, {
        cpu: true, team: 1, x: 1160 - i * 30, z: [95, 40, 160][i], facing: -1, label: 'CPU',
        boost: n - 1, hpMul: 0.8 + (n - 1) * 0.06 - (count - 1) * 0.12,
      });
    }
    this.timer = 99;
    this.setPhase('intro');
  }

  setPhase(p) {
    this.phase = p;
    this.phaseT = 0;
  }
  get fightOn() {
    return this.phase === 'fight';
  }

  // ───── 給招式用的 API ─────
  sfx(n) {
    this.g.audio.sfx(n);
  }
  shake(a, t) {
    this.shakeAmt = Math.max(this.shakeT > 0 ? this.shakeAmt : 0, a);
    this.shakeT = Math.max(this.shakeT, t);
  }
  enemiesOf(f) {
    return this.fighters.filter((e) => e !== f && e.team !== f.team && !e.dead && e.hp > 0);
  }
  nearestEnemy(f) {
    let best = null, bd = 1e9;
    for (const e of this.enemiesOf(f)) {
      const d = Math.abs(e.x - f.x) + Math.abs(e.z - f.z) * 1.5;
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }
  meleeHit(f, a) {
    const W = f.hold && f.hold.def.type === 'light' && !a.air ? f.hold : null;
    const reach = (f.char.look.prop === 'gavel' ? 1.12 : 1) + (W ? W.def.reach / a.x1 : 0);
    const h = { ...a, dmg: (a.dmg + (W ? W.def.dmg : 0)) * f.char.mul.pow };
    for (const t of this.fighters) {
      if (t === f || t.team === f.team || t.dead || f.hitList.has(t)) continue;
      const dx = (t.x - f.x) * f.facing;
      if (dx < a.x0 || dx > a.x1 * reach) continue;
      if (Math.abs(t.z - f.z) > a.zr) continue;
      if (Math.abs(t.y - f.y) > 70) continue;
      f.hitList.add(t);
      const r = this.applyHit(f, t, h);
      if (r && W) {
        W.dur--;
        if (W.dur <= 0) {
          f.hold = null;
          this.fx.add({ type: 'text', x: f.x, z: f.z, y: 110, text: `${W.def.name}壞了！`, color: '#ccc', size: 18, life: 0.8 });
          this.sfx('block');
        }
      }
    }
  }
  // ───── 道具 ─────
  tryPickup(f) {
    let best = null, bd = 1e9;
    for (const it of this.items) {
      if (it.y > 5) continue;
      const d = Math.abs(it.x - f.x) + Math.abs(it.z - f.z) * 1.5;
      if (Math.abs(it.x - f.x) < 38 && Math.abs(it.z - f.z) < 20 && d < bd) {
        bd = d;
        best = it;
      }
    }
    if (!best) return false;
    this.items.splice(this.items.indexOf(best), 1);
    const D = best.def;
    f.setState('pick');
    f.vx = f.vz = 0;
    if (D.type === 'food') {
      if (D.hp) f.heal(D.hp, D.cap);
      if (D.mp) f.mp = Math.min(100, f.mp + D.mp);
      this.sfx('heal');
      this.fx.add({ type: 'text', x: f.x, z: f.z, y: 120, text: D.hp ? `${D.name} +${D.hp}` : `${D.name} 氣+${D.mp}`, color: D.hp ? '#5cff7a' : '#6ab8ff', size: 20, life: 0.9 });
    } else {
      f.hold = best;
      this.sfx('coin');
      this.fx.add({ type: 'text', x: f.x, z: f.z, y: 120, text: D.name, color: '#ffd84a', size: 18, life: 0.7 });
    }
    return true;
  }
  throwHeld(f, dash = false) {
    const it = f.hold;
    if (!it) return;
    f.hold = null;
    const heavy = it.def.type === 'heavy';
    this.spawnProj({
      owner: f, kind: 'item', item: it, x: f.x + f.facing * 24, z: f.z, y: f.y + (heavy ? 110 : 70),
      vx: f.facing * (heavy ? 430 : dash ? 720 : 620), vy: heavy ? 220 : 90, gravity: heavy ? 1300 : 700,
      life: 3, w: heavy ? 34 : 22, h: 50, dmg: it.def.throwDmg, knock: heavy || it.def.type === 'light', launch: 300, kb: heavy ? 260 : 180, stun: 0.4, fall: heavy ? 80 : 50,
    });
    f.setState('a2');
    f.stateT = 0.18;
    this.sfx('throw');
  }
  dropHeld(f) {
    const it = f.hold;
    if (!it) return;
    f.hold = null;
    it.x = f.x;
    it.z = f.z;
    it.y = Math.max(20, f.y + 40);
    it.vy = 200;
    this.items.push(it);
  }
  landItem(it, x, z) {
    if (it.def.type === 'throw') {
      this.fx.add({ type: 'text', x, z, y: 10, text: '啪', color: '#fff6c0', size: 18, life: 0.5 });
      return;
    }
    if (it.def.type === 'light' && it.dur <= 0) return;
    it.x = Math.max(ARENA.xMin, Math.min(ARENA.xMax, x));
    it.z = z;
    it.y = 30;
    it.vy = 150;
    this.items.push(it);
  }
  updateItems(dt) {
    if (this.fightOn) {
      this.itemTimer -= dt;
      if (this.itemTimer <= 0) {
        this.itemTimer = rand(6, 11);
        if (this.items.length < 3) {
          const it = spawnRandomItem();
          it.x = clamp(this.player.x + rand(-380, 380), ARENA.xMin + 40, ARENA.xMax - 40);
          this.items.push(it);
        }
      }
    }
    for (const it of this.items) {
      it.t += dt;
      if (it.y > 0 || it.vy > 0) {
        it.vy -= 1500 * dt;
        it.y += it.vy * dt;
        if (it.y <= 0) {
          it.y = 0;
          if (it.vy < -300) this.fx.add({ type: 'dust', x: it.x, z: it.z, y: 0, life: 0.3 });
          it.x = clamp(it.x, ARENA.xMin, ARENA.xMax);
          it.vy = 0;
        }
      }
    }
  }
  areaHit(f, box) {
    const h = { ...box, dmg: box.dmg * f.char.mul.pow };
    for (const t of this.fighters) {
      if (t === f || t.team === f.team || t.dead || f.hitList.has(t)) continue;
      const dx = (t.x - f.x) * f.facing;
      if (dx < box.x0 || dx > box.x1) continue;
      if (Math.abs(t.z - f.z) > box.zr) continue;
      if (t.y > 120) continue;
      f.hitList.add(t);
      this.applyHit(f, t, h);
    }
  }
  applyHit(src, t, h) {
    const before = t.hp;
    const r = t.takeHit(src, h, this);
    if (!r) return null;
    const hy = t.y + 58;
    if (r === 'block' || r === 'break') {
      this.fx.add({ type: 'block', x: t.x - sign(t.x - src.x) * 10, z: t.z, y: hy, life: 0.18 });
      this.sfx(r === 'break' ? 'heavy' : 'block');
      if (r === 'break') this.hitstop = Math.max(this.hitstop, 0.08);
      return r;
    }
    const dealt = before - t.hp;
    const heavy = h.heavy || h.knock || dealt >= 18;
    src.stats.dmg += dealt;
    src.combo++;
    src.comboT = 1.0;
    src.stats.maxCombo = Math.max(src.stats.maxCombo, src.combo);
    if (src.superDealt != null) src.superDealt += dealt;
    else src.mp = Math.min(100, src.mp + 4 + dealt * 0.1);
    this.fx.add({ type: 'spark', x: t.x, z: t.z, y: hy, life: heavy ? 0.28 : 0.18, big: heavy, color: src.char.color });
    this.fx.add({ type: 'num', x: t.x + rand(-10, 10), z: t.z, y: t.y + 105, text: String(Math.round(dealt)), life: 0.7, color: heavy ? '#ffd84a' : '#fff', size: heavy ? 20 : 15 });
    this.sfx(heavy ? 'heavy' : 'hit');
    if (h.slip) this.sfx('slip');
    this.hitstop = Math.max(this.hitstop, heavy ? 0.09 : 0.05);
    if (heavy) this.shake(5, 0.12);
    if (before > 0 && t.hp <= 0) {
      src.stats.kos++;
      t.killer = src;
    }
    return r;
  }
  spawnProj(o) {
    const p = Object.assign({ vx: 0, vy: 0, vz: 0, t: 0, w: 20, h: 30, zr: 20, life: 1, hits: new Set(), team: o.owner.team }, o);
    this.projs.push(p);
    return p;
  }

  startSuper(f) {
    f.mp = 0;
    f.setState('superwait');
    f.vx = f.vz = 0;
    // 全場只停頓 0.3 秒（變暗＋閃光），之後頭像與金句橫幅在上方滑過，不影響其他人繼續打
    this.cutin = { f, t: 0, dur: 0.3 };
    this.banner = { f, t: 0, dur: 1.7, lines: Array.from({ length: 12 }, () => ({ y: rand(92, 190), l: rand(80, 260), s: rand(1500, 3000), o: rand(0, 1000) })) };
    this.sfx('cutin');
  }
  beginSuper(f) {
    f.setState('super');
    f.mv = {};
    const def = MOVES[f.char.id].super;
    f.armor = def.dur + 0.2;
    // 大絕命中統計：完全打空會返還一半的氣（避免辛苦集滿卻白放）
    f.superDealt = 0;
    f.superEndT = null;
    if (def.start) def.start(f, this);
    this.sfx('super');
  }

  // ───── 更新 ─────
  update(dt) {
    const c = this.g.input.p1;
    if (this.phase !== 'end' && c.pressed('pause')) {
      this.paused = !this.paused;
      this.pauseSel = 0;
      this.sfx('move');
      return;
    }
    if (this.paused) {
      if (c.pressed('up') || c.pressed('down')) {
        this.pauseSel = (this.pauseSel + (c.pressed('up') ? 2 : 1)) % 3;
        this.sfx('move');
      }
      if (c.confirm) this.pauseChoose(this.pauseSel);
      return;
    }
    this.time += dt;
    this.updateCamera(dt);
    if (this.banner) {
      this.banner.t += dt;
      if (this.banner.t >= this.banner.dur) this.banner = null;
    }
    if (this.cutin) {
      this.cutin.t += dt;
      if (this.cutin.t >= this.cutin.dur) {
        const f = this.cutin.f;
        this.cutin = null;
        this.beginSuper(f);
      }
      return;
    }
    this.fx.update(dt);
    if (this.hitstop > 0) {
      this.hitstop -= dt;
      return;
    }
    if (this.shakeT > 0) this.shakeT -= dt;
    const sdt = dt * this.slow;
    this.phaseT += dt;
    this.updatePhase(dt);
    for (const f of this.fighters) {
      if (f.superDealt != null && f.state !== 'super') {
        // 大絕結束後再等飛行道具落地 1.5 秒，才結算有沒有打中
        if (f.superEndT == null) f.superEndT = this.time + 1.5;
        if (this.time > f.superEndT) {
          if (f.superDealt <= 0 && !f.dead) {
            f.mp = Math.min(100, f.mp + 50);
            this.fx.add({ type: 'text', x: f.x, z: f.z, y: 140, text: '落空！返還一半氣', color: '#9fd4ff', size: 18, life: 1.2 });
          }
          f.superDealt = null;
        }
      }
      if (f.ai && this.fightOn) f.ai.update(sdt, this);
      f.update(sdt, this);
      if (f.ai) f.ai.ctrl.endFrame();
    }
    this.updateProjs(sdt);
    this.updateItems(sdt);
    if (this.announce) {
      this.announce.t += dt;
      if (this.announce.t > this.announce.life) this.announce = null;
    }
  }

  say(text, life = 1.2, color = '#ffd84a') {
    this.announce = { text, t: 0, life, color };
  }

  updatePhase(dt) {
    const T = this.phaseT;
    switch (this.phase) {
      case 'intro':
        if (T < dt * 1.5) this.say(this.cfg.mode === 'survival' ? `WAVE ${this.wave}` : 'READY', 1.2);
        if (T >= 1.25 && !this.saidFight) {
          this.saidFight = true;
          this.say('FIGHT!', 0.8, '#ff5a3c');
          this.sfx('fight');
        }
        if (T >= 1.7) {
          this.saidFight = false;
          this.setPhase('fight');
        }
        break;
      case 'fight':
        this.timer -= dt;
        if (this.timer <= 0) {
          this.timer = 0;
          this.timeUp();
        } else this.checkEnd();
        break;
      case 'ko':
        if (T > 1.1) this.slow = 1;
        if (T > 1.6 && !this.posed) {
          this.posed = true;
          for (const f of this.winners || []) if (!f.dead && !f.airborne) f.setState('victory');
        }
        if (T > 3.2) this.finish();
        break;
      case 'waveclear':
        if (T > 1.6 && !this.posed) {
          this.posed = true;
          if (!this.player.airborne) this.player.setState('victory');
        }
        if (T > 2.6) {
          this.posed = false;
          this.nextWave();
        }
        break;
    }
  }

  checkEnd() {
    const P = this.player;
    const alive = this.fighters.filter((f) => f.hp > 0);
    if (this.cfg.mode === 'survival') {
      if (P.hp <= 0) return this.endFight(false, alive);
      if (!alive.some((f) => f.team !== P.team)) {
        const bonus = 1000 * this.wave + Math.floor(this.timer) * 20;
        this.bank += bonus;
        this.fx.add({ type: 'text', x: 480, z: 0, y: 140, text: `過關獎勵 +${bonus}`, color: '#ffd84a', size: 28, life: 2 });
        this.say('WAVE CLEAR!', 1.6, '#5cff7a');
        this.setPhase('waveclear');
        this.posed = false;
        this.sfx('confirm');
      }
      return;
    }
    if (P.hp <= 0) return this.endFight(false, alive);
    const teams = new Set(alive.map((f) => f.team));
    if (teams.size <= 1) this.endFight(true, alive);
  }

  timeUp() {
    const alive = this.fighters.filter((f) => f.hp > 0);
    const best = Math.max(...alive.map((f) => f.hp / f.maxHp));
    const winners = alive.filter((f) => f.hp / f.maxHp >= best - 0.001);
    const win = this.cfg.mode !== 'survival' && winners.includes(this.player) && winners.length === 1;
    this.say('TIME UP', 1.6, '#ffffff');
    this.endFight(win, winners, true);
  }

  endFight(win, winners, timeUp = false) {
    this.win = win;
    this.winners = win ? [this.player] : winners.filter((f) => f !== this.player);
    this.setPhase('ko');
    this.posed = false;
    if (!timeUp) {
      this.slow = 0.3;
      this.say('K.O.!', 1.6, '#ff3b3b');
      this.sfx('ko');
    }
  }

  liveScore() {
    const s = this.player.stats;
    return Math.round(this.bank + s.dmg * 10 + s.kos * 3000 + s.maxCombo * 150);
  }

  finish() {
    if (this.done) return;
    this.done = true;
    const P = this.player;
    let score = this.liveScore();
    if (this.cfg.mode !== 'survival' && this.win) score += 5000 + Math.floor(this.timer) * 50;
    score = Math.round(score * DIFF_MUL[this.cfg.difficulty || 'normal']);
    const winnerChar = this.win ? P.char : (this.winners && this.winners[0] ? this.winners[0].char : null);
    this.g.goResult({
      cfg: this.cfg, win: this.win, score, wave: this.wave, stats: { ...P.stats }, playerChar: P.char, winnerChar,
      stage: this.stage.id,
    });
  }

  pauseChoose(i) {
    this.sfx('confirm');
    if (i === 0) this.paused = false;
    else if (i === 1) this.g.startBattle(this.cfg);
    else this.g.goTitle();
  }

  updateProjs(dt) {
    for (const p of this.projs) {
      p.t += dt;
      if (p.t >= p.life) p.dead = true;
      if (p.dead) continue;
      if (p.boomerang) {
        p.vx -= p.boomerang * 1250 * dt;
        if (p.t > 0.5 && !p.back) {
          p.back = true;
          p.hits.clear();
        }
        if (p.back && Math.abs(p.x - p.owner.x) < 20 && Math.abs(p.z - p.owner.z) < 30) p.dead = true;
      }
      if (p.homing) {
        const tg = p.homing;
        if (!tg.dead && tg.hp > 0) {
          const dx = tg.x - p.x, dz = tg.z - p.z, d = Math.hypot(dx, dz) || 1;
          const k = Math.min(1, dt * 3.5);
          p.vx += ((dx / d) * 460 - p.vx) * k;
          p.vz += ((dz / d) * 300 - p.vz) * k;
        }
        p.y += (50 - p.y) * Math.min(1, dt * 4);
      }
      if (p.gravity && !p.landed) p.vy -= p.gravity * dt;
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.y += p.vy * dt;
      if (p.gravity && p.y <= 0 && !p.landed) {
        p.y = 0;
        if (p.trap) {
          p.landed = true;
          p.vx = p.vy = p.vz = 0;
        } else if (p.kind === 'item') {
          p.dead = true;
          this.landItem(p.item, p.x, p.z);
          continue;
        } else if (p.vanishOnGround) {
          p.dead = true;
          this.fx.add({ type: 'spark', x: p.x, z: p.z, y: 4, life: 0.15, color: '#ffd84a' });
          continue;
        }
      }
      if (p.kind !== 'wave' && (p.x < -50 || p.x > WORLD_W + 50)) {
        p.dead = true;
        if (p.kind === 'item') this.landItem(p.item, p.x, p.z);
        continue;
      }
      if (p.trap && !p.landed) continue;
      for (const f of this.fighters) {
        if (f.team === p.team || f.dead || f.hp <= 0 || p.hits.has(f)) continue;
        if (Math.abs(f.x - p.x) > p.w) continue;
        if (Math.abs(f.z - p.z) > (p.zr || 20)) continue;
        if (p.trap) {
          if (f.y > 4 || f.state === 'down' || f.state === 'getup') continue;
        } else if (p.y < f.y - 10 || p.y > f.y + p.h + 70) continue;
        const dir = p.dir || sign(p.vx) || sign(f.x - p.x) || 1;
        const h = { dmg: p.dmg * p.owner.char.mul.pow, kb: p.kb, stun: p.stun, knock: p.knock, launch: p.launch, unblockable: p.unblockable, dizzy: p.dizzy, slip: p.slip, fall: p.fall, dir: p.slip ? f.facing : dir };
        const r = this.applyHit(p.owner, f, h);
        if (r) {
          p.hits.add(f);
          if (!p.pierce) {
            p.dead = true;
            if (p.kind === 'item') this.landItem(p.item, p.x, p.z);
            break;
          }
        }
      }
    }
    // 飛行道具互撞抵銷（大絕的不會）
    const live = this.projs.filter((p) => !p.dead && !p.trap && !p.noClash && !['wave', 'coin', 'ingot'].includes(p.kind));
    for (let i = 0; i < live.length; i++) {
      for (let j = i + 1; j < live.length; j++) {
        const a = live[i], c = live[j];
        if (a.dead || c.dead || a.team === c.team) continue;
        if (Math.abs(a.x - c.x) < 26 && Math.abs(a.z - c.z) < 20 && Math.abs(a.y - c.y) < 50) {
          a.dead = c.dead = true;
          if (a.kind === 'item') this.landItem(a.item, a.x, a.z);
          if (c.kind === 'item') this.landItem(c.item, c.x, c.z);
          this.fx.add({ type: 'spark', x: (a.x + c.x) / 2, z: a.z, y: a.y, life: 0.25, big: true, color: '#fff' });
          this.sfx('block');
        }
      }
    }
    // 被丟出去的人會撞倒路上的人
    for (const t of this.fighters) {
      if (!t.thrownBy || t.state !== 'fall') continue;
      for (const o of this.fighters) {
        if (o === t || o.dead || t.thrownHits.has(o)) continue;
        if (Math.abs(o.x - t.x) < 36 && Math.abs(o.z - t.z) < 18 && Math.abs(o.y - t.y) < 70) {
          t.thrownHits.add(o);
          this.applyHit(t.thrownBy, o, { dmg: 16, knock: true, launch: 300, kb: 220, dir: sign(t.vx) || 1, unblockable: true });
        }
      }
    }
    this.projs = this.projs.filter((p) => !p.dead);
  }

  onPointer(x, y) {
    if (this.paused) this.hot.hit(x, y);
  }

  // ───── 繪製 ─────
  draw() {
    const g = this.g;
    const p = g.beginPix(true);
    let sx = 0, sy = 0;
    if (this.shakeT > 0 && !this.paused) {
      sx = rand(-this.shakeAmt, this.shakeAmt);
      sy = rand(-this.shakeAmt, this.shakeAmt) * 0.6;
    }
    const z = this.zoom, cam = this.cam, vw = this.viewW;
    const worldT = (c, k) => c.setTransform(k * z, 0, 0, k * z, k * (-cam.x * z + sx), k * (-cam.y * z + sy));
    worldT(p, g.pixScale);
    this.stage.draw(p, this.time, cam.x - 10, cam.x + vw + 10);
    for (const f of this.fighters) drawShadow(p, f.x, f.z, f.y);
    for (const pr of this.projs) if (pr.trap || pr.gravity) drawShadow(p, pr.x, pr.z, pr.y, 10);
    for (const it of this.items) drawShadow(p, it.x, it.z, it.y, 14);
    const list = [...this.fighters.map((f) => ({ z: f.z, f })), ...this.projs.map((pr) => ({ z: pr.z + 0.5, pr })), ...this.items.map((it) => ({ z: it.z - 0.5, it }))];
    list.sort((a, b) => a.z - b.z);
    const superOn = this.fighters.some((f) => f.state === 'super');
    if (superOn) {
      p.fillStyle = 'rgba(0,0,10,0.35)';
      p.fillRect(cam.x - 50, 0, vw + 100, 540);
    }
    for (const d of list) {
      if (d.f) {
        const f = d.f;
        if (f.invuln > 0 && ['idle', 'walk', 'run'].includes(f.state) && Math.floor(this.time * 20) % 2) continue;
        if (f.state === 'super') {
          p.save();
          p.globalCompositeOperation = 'lighter';
          const gr = p.createRadialGradient(f.x, ARENA.floorY + f.z - f.y - 50, 5, f.x, ARENA.floorY + f.z - f.y - 50, 80);
          gr.addColorStop(0, f.char.color);
          gr.addColorStop(1, 'rgba(0,0,0,0)');
          p.globalAlpha = 0.55 + Math.sin(this.time * 30) * 0.15;
          p.fillStyle = gr;
          p.fillRect(f.x - 80, ARENA.floorY + f.z - f.y - 130, 160, 160);
          p.restore();
        }
        drawFighter(p, f);
      } else if (d.it) {
        const it = d.it;
        const bob = it.y <= 0 ? Math.sin(this.time * 4 + it.x) * 1.5 : 0;
        drawItem(p, it.kind, it.x, ARENA.floorY + it.z - it.y + bob, 0, 1.15);
      } else this.drawProj(p, d.pr);
    }
    this.fx.draw(p);
    if (this.cutin) {
      // 大絕發動瞬間：其他東西變暗，只有發動者亮著
      const f = this.cutin.f;
      p.fillStyle = 'rgba(0,0,12,0.6)';
      p.fillRect(cam.x - 50, 0, vw + 100, 540);
      const fy = ARENA.floorY + f.z - f.y - 55;
      p.save();
      p.globalCompositeOperation = 'lighter';
      const gr = p.createRadialGradient(f.x, fy, 5, f.x, fy, 120);
      gr.addColorStop(0, '#ffffff');
      gr.addColorStop(0.3, f.char.color);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      p.globalAlpha = 0.8;
      p.fillStyle = gr;
      p.fillRect(f.x - 120, fy - 120, 240, 240);
      p.restore();
      drawFighter(p, f);
    }
    g.flushPix();

    const ctx = g.ctx;
    ctx.save();
    worldT(ctx, 1);
    this.fx.drawUI(ctx, 'world');
    this.drawPlayerTag(ctx);
    ctx.restore();
    this.drawOffscreen(ctx);
    this.fx.drawUI(ctx, 'screen');
    this.drawHUD(ctx);
    this.drawSkillBar(ctx);
    this.drawCombo(ctx);
    if (this.banner) this.drawBanner(ctx, this.banner);
    if (this.announce) this.drawAnnounce(ctx);
    if (this.paused) this.drawPause(ctx);
  }

  // 畫面外的角色：在畫面邊緣顯示箭頭
  drawOffscreen(ctx) {
    const z = this.zoom, cam = this.cam, CW = this.g.CW, ox = this.g.ox;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const f of this.fighters) {
      if (f.dead) continue;
      const x = (f.x - cam.x) * z;
      if (x > -10 && x < CW + 10) continue;
      const left = x < 0;
      const ex = left ? 18 : CW - 18;
      const ey = clamp((ARENA.floorY + f.z - 60 - cam.y) * z, 120, 500);
      ctx.fillStyle = f === this.player ? '#5cff7a' : f.char.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left ? ex - 10 : ex + 10, ey);
      ctx.lineTo(left ? ex + 8 : ex - 8, ey - 11);
      ctx.lineTo(left ? ex + 8 : ex - 8, ey + 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      txt(ctx, f.char.title, left ? ex + 12 : ex - 12, ey + 22, { size: 11, weight: 900, color: '#fff', align: left ? 'left' : 'right', stroke: '#000', sw: 3 });
    }
    ctx.restore();
    void ox;
  }

  drawProj(ctx, p) {
    const x = p.x, y = ARENA.floorY + p.z - p.y;
    ctx.save();
    switch (p.kind) {
      case 'sound': {
        const d = sign(p.vx);
        ctx.strokeStyle = '#ffd84a';
        ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          ctx.globalAlpha = 1 - i * 0.28;
          ctx.lineWidth = 5 - i;
          ctx.beginPath();
          const r = 10 + i * 9 + (p.t * 40) % 9;
          ctx.arc(x - d * 20, y, r, d > 0 ? -0.9 : Math.PI - 0.9, d > 0 ? 0.9 : Math.PI + 0.9);
          ctx.stroke();
        }
        break;
      }
      case 'wave': {
        const a = 1 - p.t / p.life;
        ctx.globalCompositeOperation = 'lighter';
        const gr = ctx.createLinearGradient(0, y - 150, 0, y);
        gr.addColorStop(0, 'rgba(255,220,80,0)');
        gr.addColorStop(1, `rgba(255,220,80,${0.9 * a})`);
        ctx.fillStyle = gr;
        ctx.fillRect(x - 36, y - 150, 72, 150);
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(x, y, 40, 12, 0, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(255,240,180,${a})`;
          ctx.fillRect(x - 30 + i * 14, y - 20 - ((p.t * 300 + i * 37) % 120), 4, 14);
        }
        break;
      }
      case 'coin':
        ctx.fillStyle = '#ffd84a';
        ctx.strokeStyle = '#8a5a00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y - 8, 8 * Math.abs(Math.cos(p.t * 12)) + 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'ingot':
        ctx.translate(x, y - 14);
        ctx.fillStyle = '#ffcf33';
        ctx.strokeStyle = '#7a4a00';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-26, -8);
        ctx.quadraticCurveTo(0, 6, 26, -8);
        ctx.lineTo(18, 12);
        ctx.lineTo(-18, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, -6, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'banana':
        drawBanana(ctx, x, y - 4, 1.6, p.landed ? 0 : p.t * 12);
        break;
      case 'boomerang':
      case 'homing':
        drawBanana(ctx, x, y, 2, p.t * 20);
        break;
      case 'item':
        drawItem(ctx, p.item.kind, x, y + 10, p.item.def.type === 'heavy' ? p.t * 4 : p.t * 14 * sign(p.vx), 1.15);
        break;
      case 'crate':
        ctx.translate(x, y - 16);
        ctx.rotate(p.t * 5);
        ctx.fillStyle = '#b07a3a';
        ctx.fillRect(-18, -18, 36, 36);
        ctx.strokeStyle = '#4a2c10';
        ctx.lineWidth = 3;
        ctx.strokeRect(-18, -18, 36, 36);
        ctx.beginPath();
        ctx.moveTo(-18, -18);
        ctx.lineTo(18, 18);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '900 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('高雄', 0, 4);
        break;
      case 'dumbbell':
        ctx.translate(x, y - 10);
        ctx.rotate(p.t * 9);
        ctx.fillStyle = '#333';
        ctx.fillRect(-16, -2.5, 32, 5);
        ctx.fillStyle = '#555';
        ctx.fillRect(-20, -9, 8, 18);
        ctx.fillRect(12, -9, 8, 18);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-20, -9, 8, 18);
        ctx.strokeRect(12, -9, 8, 18);
        break;
      case 'scalpel': {
        const d = sign(p.vx);
        ctx.strokeStyle = '#e8eef5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - d * 12, y);
        ctx.lineTo(x + d * 10, y);
        ctx.stroke();
        ctx.strokeStyle = '#4ad';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - d * 16, y);
        ctx.lineTo(x - d * 8, y);
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }

  drawPlayerTag(ctx) {
    const f = this.player;
    if (f.dead) return;
    const x = f.x, y = ARENA.floorY + f.z - f.y - 140;
    txt(ctx, '1P', x, y, { size: 12, font: 'px', color: '#5cff7a', align: 'center', stroke: '#000', sw: 4 });
    ctx.fillStyle = '#5cff7a';
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 9);
    ctx.lineTo(x + 5, y + 9);
    ctx.lineTo(x, y + 15);
    ctx.fill();
  }

  drawHUD(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 82);
    g.addColorStop(0, 'rgba(8,8,20,0.96)');
    g.addColorStop(1, 'rgba(20,18,40,0.92)');
    ctx.fillStyle = g;
    const ox = this.g.ox;
    ctx.fillRect(-ox, 0, this.g.CW, 82);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(-ox, 82, this.g.CW, 2);
    const fs = this.fighters;
    if (fs.length === 2) {
      this.hudPanel(ctx, fs[0], 10, 8, 400, false);
      this.hudPanel(ctx, fs[1], 550, 8, 400, true);
    } else {
      const w = 228;
      fs.forEach((f, i) => this.hudPanel(ctx, f, 10 + i * (w + 8), 8, w, false));
    }
    // 計時
    ctx.fillStyle = 'rgba(8,8,20,0.92)';
    ctx.fillRect(440, 84, 80, 34);
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 2;
    ctx.strokeRect(440, 84, 80, 34);
    const tt = Math.ceil(this.timer);
    txt(ctx, String(tt).padStart(2, '0'), 480, 102, { size: 20, font: 'px', align: 'center', color: tt <= 10 ? '#ff5a5a' : '#fff' });
    // 場地名 / 模式
    txt(ctx, `${this.stage.name}　${MODE_NAME[this.cfg.mode]}${this.cfg.mode === 'survival' ? `　第 ${this.wave} 波` : ''}`, 14, 100, { size: 15, color: '#e8e2c8', stroke: '#000', sw: 3, weight: 700 });
    txt(ctx, 'SCORE', 760, 100, { size: 10, font: 'px', color: '#ffd84a', align: 'right', stroke: '#000', sw: 3 });
    txt(ctx, String(this.liveScore()).padStart(8, '0'), 948, 100, { size: 16, font: 'px', color: '#fff', align: 'right', stroke: '#000', sw: 4 });
  }

  hudPanel(ctx, f, x, y, w, mirror) {
    const ps = 62;
    const px = mirror ? x + w - ps : x;
    drawPortrait(ctx, f.char, px, y, ps, f === this.player ? '#5cff7a' : '#c9a227');
    if (f.dead) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(px, y, ps, ps);
      txt(ctx, 'KO', px + ps / 2, y + ps / 2, { size: 16, font: 'px', align: 'center', color: '#ff3b3b', stroke: '#000', sw: 4 });
    }
    const bx = mirror ? x : x + ps + 8;
    const bw = w - ps - 8;
    const al = mirror ? 'right' : 'left';
    const nx = mirror ? bx + bw : bx;
    txt(ctx, f.char.title, nx, y + 8, { size: 15, weight: 900, color: '#fff', align: al, stroke: '#000', sw: 3 });
    txt(ctx, f === this.player ? 'P1' : 'CPU', mirror ? bx : bx + bw, y + 8, { size: 9, font: 'px', color: f === this.player ? '#5cff7a' : '#ff8a8a', align: mirror ? 'left' : 'right' });
    segBar(ctx, bx, y + 20, bw, 15, f.hp / f.maxHp, { segs: w > 300 ? 22 : 14, colors: ['#46e04a', '#ffd84a', '#ff4a3a'], mirror, ghost: f.cap / f.maxHp });
    if (f.hold) txt(ctx, `持：${f.hold.def.name}`, mirror ? bx + bw : bx + bw, y + 60, { size: 10, weight: 900, color: '#ffd84a', align: 'right', stroke: '#000', sw: 3 });
    const full = f.mp >= 100;
    const mc = full ? (blink(this.time, 4) ? '#ffe14a' : '#ff9a2a') : '#3a8cff';
    segBar(ctx, bx, y + 42, bw * 0.78, 8, f.mp / 100, { segs: 10, color: mc, mirror });
    const lx = mirror ? bx + bw : bx + bw * 0.78 + 6;
    if (full) txt(ctx, '大絕 OK', mirror ? bx + bw * 0.22 - 6 : lx, y + 46, { size: 11, weight: 900, color: '#ffe14a', align: mirror ? 'right' : 'left', stroke: '#000', sw: 3 });
    else txt(ctx, '氣', mirror ? bx + bw * 0.22 - 6 : lx, y + 46, { size: 11, weight: 900, color: '#8ab8ff', align: mirror ? 'right' : 'left' });
  }

  drawCombo(ctx) {
    const P = this.player;
    if (P.combo >= 2 && P.comboT > 0) {
      const a = Math.min(1, P.comboT * 2);
      pixelText(ctx, `${P.combo}`, 70, 200, { size: 48, scale: 3, color: '#ffd84a', color2: '#ff6a2a', outline: '#2a0a00', alpha: a });
      txt(ctx, 'HITS!', 110, 200, { size: 14, font: 'px', color: '#fff', stroke: '#000', sw: 4, alpha: a });
    }
  }

  drawAnnounce(ctx) {
    const a = this.announce;
    const p = a.t / a.life;
    const s = p < 0.15 ? easeOut(p / 0.15) : 1;
    const alpha = p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;
    ctx.save();
    ctx.translate(480, 270);
    ctx.scale(0.6 + s * 0.4, 0.6 + s * 0.4);
    pixelText(ctx, a.text, 0, 0, { size: 72, scale: 4, font: 'px', color: a.color, color2: '#ff7a1a', outline: '#200800', alpha });
    ctx.restore();
  }

  // 大絕橫幅：頭像＋金句，暫時蓋在最上面的血條區，完全不擋中間的打鬥
  bannerOffset(ci) {
    const p = ci.t / ci.dur;
    if (p < 0.1) return -(1 - easeOut(p / 0.1)) * 1300;
    if (p > 0.85) return easeIn((p - 0.85) / 0.15) * 1300;
    return 0;
  }
  drawBanner(ctx, ci) {
    const f = ci.f, ch = f.char;
    const ox = this.g.ox, CW = this.g.CW;
    const H0 = 96;
    ctx.save();
    ctx.translate(this.bannerOffset(ci), 0);
    ctx.beginPath();
    ctx.moveTo(-ox - 20, 0);
    ctx.lineTo(CW - ox + 20, 0);
    ctx.lineTo(CW - ox + 20, H0 - 8);
    ctx.lineTo(-ox - 20, H0);
    ctx.closePath();
    const gr = ctx.createLinearGradient(0, 0, 0, H0);
    gr.addColorStop(0, ch.color);
    gr.addColorStop(1, ch.color2);
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#fff';
    for (const l of ci.lines) ctx.fillRect(1100 - ((ci.t * l.s + l.o) % 1500), l.y - 86, l.l, 3);
    ctx.restore();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(CW - ox + 20, H0 - 8);
    ctx.lineTo(-ox - 20, H0);
    ctx.stroke();
    // 有 Gemini 的「大絕特寫圖」（posters，4:1 橫幅）就用它；沒有就用圓形頭像
    const tx = document.body.classList.contains('touch') ? 64 : 0; // 手機左上有暫停鍵
    const cut = ASSETS.posters[ch.id];
    let textX = 120 + tx;
    if (cut) {
      const w = (cut.width * H0) / cut.height;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-ox - 20, 0);
      ctx.lineTo(CW - ox + 20, 0);
      ctx.lineTo(CW - ox + 20, H0 - 8);
      ctx.lineTo(-ox - 20, H0);
      ctx.clip();
      ctx.drawImage(cut, tx, 0, w, H0);
      ctx.restore();
      textX = tx + w - 30;
    } else {
      const px = 22 + tx, py = 8, ps = 80;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px + ps / 2, py + ps / 2, ps / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.imageSmoothingEnabled = !!ASSETS.portraits[ch.id];
      ctx.drawImage(portrait(ch, 96), px, py, ps, ps);
      ctx.restore();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(px + ps / 2, py + ps / 2, ps / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 文字
    const p = ci.t / ci.dur;
    const pop = p < 0.2 ? 1.3 - easeOut((p - 0.08) / 0.12) * 0.3 : 1;
    txt(ctx, `大絕・${ch.superMove.name}`, textX, 22, { size: 15, weight: 900, color: '#ffe14a', align: 'left', stroke: '#000', sw: 5 });
    const q = `「${ch.quote}」`;
    const room = CW - ox - textX - 24;
    const size = Math.max(20, Math.min(38, Math.floor(room / Math.max(6, q.length * (/[a-z]/i.test(q) ? 0.55 : 1)))));
    ctx.translate(textX, 58);
    ctx.scale(pop, pop);
    txt(ctx, q, 0, 0, { size, weight: 900, color: '#fff', align: 'left', stroke: '#000', sw: 8, shadow: ch.color2 });
    ctx.restore();
    if (ci.t < 0.08) {
      ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - ci.t / 0.08)})`;
      ctx.fillRect(-ox, 0, CW, 540);
    }
  }

  // 電腦版：畫面左下顯示三個技能的冷卻倒數（手機版直接顯示在按鈕上）
  drawSkillBar(ctx) {
    const P = this.player;
    if (!P || P.dead || document.body.classList.contains('touch')) return;
    const keys = [['1', 'fwd', '防→攻'], ['2', 'up', '防↑攻'], ['3', 'down', '防↓攻']];
    const x0 = 10 - this.g.ox, y = 496, w = 176;
    keys.forEach(([key, k, cmd], i) => {
      const def = specialDef(P.char.id, k);
      if (!def) return;
      const x = x0 + i * (w + 6);
      const left = P.cd[k], ready = left <= 0;
      ctx.fillStyle = 'rgba(8,8,20,0.78)';
      ctx.fillRect(x, y, w, 36);
      if (!ready) {
        ctx.fillStyle = 'rgba(60,140,255,0.35)';
        ctx.fillRect(x, y + 32, w * (1 - left / specialCD(def)), 4);
      } else {
        ctx.fillStyle = 'rgba(60,140,255,0.9)';
        ctx.fillRect(x, y + 32, w, 4);
      }
      ctx.strokeStyle = ready ? '#7fc0ff' : '#444';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, 36);
      txt(ctx, key, x + 12, y + 17, { size: 14, font: 'px', align: 'center', color: '#ffd84a' });
      txt(ctx, P.char.specials[i].name, x + 26, y + 12, { size: 14, weight: 900, color: ready ? '#fff' : '#888' });
      txt(ctx, cmd, x + 26, y + 26, { size: 10, color: '#9aa' });
      txt(ctx, ready ? 'OK' : left.toFixed(1), x + w - 8, y + 17, { size: ready ? 12 : 16, font: 'px', align: 'right', color: ready ? '#7fffa0' : '#fff' });
    });
  }

  drawPause(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    panel(ctx, 330, 160, 300, 240);
    pixelText(ctx, 'PAUSE', 480, 200, { size: 32, scale: 2, font: 'px', color: '#ffd84a', outline: '#000' });
    const opts = ['繼續戰鬥', '重新開始', '回到標題'];
    this.hot.clear();
    opts.forEach((o, i) => {
      const y = 260 + i * 44;
      const sel = i === this.pauseSel;
      if (sel) {
        ctx.fillStyle = 'rgba(255,216,74,0.18)';
        ctx.fillRect(360, y - 18, 240, 36);
      }
      txt(ctx, (sel ? '▶ ' : '　') + o, 480, y, { size: 22, weight: 900, align: 'center', color: sel ? '#ffd84a' : '#fff' });
      this.hot.add(360, y - 18, 240, 36, () => this.pauseChoose(i));
    });
  }
}
