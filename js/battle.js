// 對戰場景：1v1、四人亂鬥、連戰生存
import { ARENA, rand, pick, shuffle, sign, easeOut, easeIn, clamp } from './util.js';
import { Fighter, ATK } from './fighter.js';
import { CHARS, CHAR_BY_ID } from './characters.js';
import { MOVES } from './moves.js';
import { AI } from './ai.js';
import { FX } from './fx.js';
import { STAGES, STAGE_BY_ID } from './stages.js';
import { drawFighter, drawShadow, drawChar, drawBanana, drawPortrait, POSTER_POSE, rrect } from './sprites.js';
import { ASSETS } from './assets.js';
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
    this.player = this.addFighter(cfg.playerChar, { ctrl: this.g.input.p1, team: 0, x: 220, z: 95, facing: 1, label: 'P1' });
    if (cfg.mode === '1v1') {
      this.addFighter(cfg.cpuChars[0], { cpu: true, team: 1, x: 740, z: 95, facing: -1, label: 'CPU' });
      this.setPhase('intro');
    } else if (cfg.mode === 'brawl') {
      this.player.x = 200;
      this.player.z = 50;
      const pos = [[760, 50], [760, 150], [200, 150]];
      cfg.cpuChars.slice(0, 3).forEach((id, i) => this.addFighter(id, { cpu: true, team: i + 1, x: pos[i][0], z: pos[i][1], facing: pos[i][0] > 480 ? -1 : 1, label: 'CPU' }));
      this.setPhase('intro');
    } else {
      this.pool = shuffle(CHARS.map((c) => c.id).filter((id) => id !== cfg.playerChar));
      this.nextWave();
    }
    this.g.audio.playBgm('battle');
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
      this.player.x = 220;
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
        cpu: true, team: 1, x: 740 - i * 30, z: [95, 40, 160][i], facing: -1, label: 'CPU',
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
    const reach = f.char.look.prop === 'gavel' ? 1.12 : 1;
    const h = { ...a, dmg: a.dmg * f.char.mul.pow };
    for (const t of this.fighters) {
      if (t === f || t.team === f.team || t.dead || f.hitList.has(t)) continue;
      const dx = (t.x - f.x) * f.facing;
      if (dx < a.x0 || dx > a.x1 * reach) continue;
      if (Math.abs(t.z - f.z) > a.zr) continue;
      if (Math.abs(t.y - f.y) > 70) continue;
      f.hitList.add(t);
      this.applyHit(f, t, h);
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
    if (r === 'block') {
      this.fx.add({ type: 'block', x: t.x - sign(t.x - src.x) * 10, z: t.z, y: hy, life: 0.18 });
      this.sfx('block');
      return r;
    }
    const dealt = before - t.hp;
    const heavy = h.heavy || h.knock || dealt >= 18;
    src.stats.dmg += dealt;
    src.combo++;
    src.comboT = 1.0;
    src.stats.maxCombo = Math.max(src.stats.maxCombo, src.combo);
    src.mp = Math.min(100, src.mp + 4 + dealt * 0.15);
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
    this.cutin = { f, t: 0, dur: 1.7, lines: Array.from({ length: 26 }, () => ({ y: rand(80, 470), l: rand(80, 300), s: rand(1500, 3200), o: rand(0, 1000) })) };
    this.sfx('cutin');
  }
  beginSuper(f) {
    f.setState('super');
    f.mv = {};
    const def = MOVES[f.char.id].super;
    f.armor = def.dur + 0.2;
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
      if (f.ai && this.fightOn) f.ai.update(sdt, this);
      f.update(sdt, this);
      if (f.ai) f.ai.ctrl.endFrame();
    }
    this.updateProjs(sdt);
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
      if (p.gravity && !p.landed) p.vy -= p.gravity * dt;
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.y += p.vy * dt;
      if (p.gravity && p.y <= 0 && !p.landed) {
        p.y = 0;
        if (p.trap) {
          p.landed = true;
          p.vx = p.vy = p.vz = 0;
        } else if (p.vanishOnGround) {
          p.dead = true;
          this.fx.add({ type: 'spark', x: p.x, z: p.z, y: 4, life: 0.15, color: '#ffd84a' });
          continue;
        }
      }
      if (p.kind !== 'wave' && (p.x < -50 || p.x > 1010)) p.dead = true;
      if (p.trap && !p.landed) continue;
      for (const f of this.fighters) {
        if (f.team === p.team || f.dead || f.hp <= 0 || p.hits.has(f)) continue;
        if (Math.abs(f.x - p.x) > p.w) continue;
        if (Math.abs(f.z - p.z) > (p.zr || 20)) continue;
        if (p.trap) {
          if (f.y > 4 || f.state === 'down' || f.state === 'getup') continue;
        } else if (p.y < f.y - 10 || p.y > f.y + p.h + 70) continue;
        const dir = p.dir || sign(p.vx) || sign(f.x - p.x) || 1;
        const h = { dmg: p.dmg * p.owner.char.mul.pow, kb: p.kb, stun: p.stun, knock: p.knock, launch: p.launch, unblockable: p.unblockable, dizzy: p.dizzy, slip: p.slip, dir: p.slip ? f.facing : dir };
        const r = this.applyHit(p.owner, f, h);
        if (r) {
          p.hits.add(f);
          if (!p.pierce) {
            p.dead = true;
            break;
          }
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
    const p = g.beginPix();
    let ox = 0, oy = 0;
    if (this.shakeT > 0 && !this.paused) {
      ox = rand(-this.shakeAmt, this.shakeAmt);
      oy = rand(-this.shakeAmt, this.shakeAmt) * 0.6;
    }
    p.save();
    p.translate(ox, oy);
    this.stage.draw(p, this.time);
    for (const f of this.fighters) drawShadow(p, f.x, f.z, f.y);
    for (const pr of this.projs) if (pr.trap || pr.kind === 'coin' || pr.kind === 'ingot') drawShadow(p, pr.x, pr.z, pr.y, 10);
    const list = [...this.fighters.map((f) => ({ z: f.z, f })), ...this.projs.map((pr) => ({ z: pr.z + 0.5, pr }))];
    list.sort((a, b) => a.z - b.z);
    const superOn = this.fighters.some((f) => f.state === 'super');
    if (superOn) {
      p.fillStyle = 'rgba(0,0,10,0.35)';
      p.fillRect(0, 0, 960, 540);
    }
    for (const d of list) {
      if (d.f) {
        const f = d.f;
        if (f.invuln > 0 && f.state === 'idle' && Math.floor(this.time * 20) % 2) continue;
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
      } else this.drawProj(p, d.pr);
    }
    this.fx.draw(p);
    p.restore();
    if (this.cutin) this.drawCutinArt(p, this.cutin);
    g.flushPix();

    const ctx = g.ctx;
    this.fx.drawUI(ctx, ox, oy);
    this.drawPlayerTag(ctx, ox, oy);
    this.drawHUD(ctx);
    this.drawCombo(ctx);
    if (this.cutin) this.drawCutinText(ctx, this.cutin);
    if (this.announce) this.drawAnnounce(ctx);
    if (this.paused) this.drawPause(ctx);
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

  drawPlayerTag(ctx, ox, oy) {
    const f = this.player;
    if (f.dead) return;
    const x = f.x + ox, y = ARENA.floorY + f.z - f.y - 140 + oy;
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
    ctx.fillRect(0, 0, 960, 82);
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(0, 82, 960, 2);
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
    segBar(ctx, bx, y + 20, bw, 15, f.hp / f.maxHp, { segs: w > 300 ? 22 : 14, colors: ['#46e04a', '#ffd84a', '#ff4a3a'], mirror });
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

  drawCutinArt(ctx, ci) {
    const f = ci.f, ch = f.char;
    const p = ci.t / ci.dur;
    let ox = 0;
    if (p < 0.14) ox = -(1 - easeOut(p / 0.14)) * 1200;
    else if (p > 0.86) ox = easeIn((p - 0.86) / 0.14) * 1200;
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${Math.min(0.65, p * 5)})`;
    ctx.fillRect(0, 0, 960, 540);
    ctx.translate(ox, 0);
    // 斜帶
    ctx.beginPath();
    ctx.moveTo(-120, 150);
    ctx.lineTo(1080, 70);
    ctx.lineTo(1080, 400);
    ctx.lineTo(-120, 480);
    ctx.closePath();
    const gr = ctx.createLinearGradient(0, 70, 0, 480);
    gr.addColorStop(0, ch.color);
    gr.addColorStop(1, ch.color2);
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    for (const l of ci.lines) {
      const lx = 1100 - ((ci.t * l.s + l.o) % 1600);
      ctx.fillRect(lx, l.y, l.l, 3);
    }
    ctx.globalAlpha = 1;
    const img = ASSETS.posters[ch.id];
    if (img) {
      const h = 420, w = (img.width * h) / img.height;
      ctx.drawImage(img, 300 - w / 2, 80, w, h);
    } else {
      const zoom = 1 + p * 0.06;
      drawChar(ctx, ch, { ...POSTER_POSE[ch.id] }, 290, 640, 1, 5.3 * zoom, 1, false, ci.t);
    }
    ctx.restore();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-120, 150);
    ctx.lineTo(1080, 70);
    ctx.moveTo(1080, 400);
    ctx.lineTo(-120, 480);
    ctx.stroke();
    ctx.restore();
    if (p < 0.06) {
      ctx.fillStyle = `rgba(255,255,255,${1 - p / 0.06})`;
      ctx.fillRect(0, 0, 960, 540);
    }
  }

  drawCutinText(ctx, ci) {
    const f = ci.f, ch = f.char;
    const p = ci.t / ci.dur;
    let ox = 0;
    if (p < 0.14) ox = -(1 - easeOut(p / 0.14)) * 1200;
    else if (p > 0.86) ox = easeIn((p - 0.86) / 0.14) * 1200;
    const pop = p < 0.25 ? 1.4 - easeOut((p - 0.1) / 0.15) * 0.4 : 1;
    ctx.save();
    ctx.translate(ox, 0);
    txt(ctx, `大絕・${ch.superMove.name}`, 900, 130, { size: 26, weight: 900, color: '#fff', align: 'right', stroke: '#000', sw: 6 });
    ctx.translate(650, 290);
    ctx.rotate(-0.07);
    ctx.scale(pop, pop);
    const q = `「${ch.quote}」`;
    const lines = q.length > 10 ? splitQuote(q) : [q];
    const size = lines.length > 1 ? 50 : 60;
    lines.forEach((ln, i) => {
      const yy = (i - (lines.length - 1) / 2) * (size * 1.15);
      txt(ctx, ln, 0, yy, { size, weight: 900, color: '#fff', align: 'center', stroke: '#000', sw: 10, shadow: ch.color2 });
    });
    ctx.restore();
  }

  drawPause(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 960, 540);
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

function splitQuote(q) {
  const m = q.slice(0, -2).match(/[，,！!]/);
  if (m) return [q.slice(0, m.index + 1), q.slice(m.index + 1)];
  const sp = q.lastIndexOf(' ', Math.ceil(q.length / 2) + 2);
  if (sp > 0) return [q.slice(0, sp), q.slice(sp + 1)];
  const mid = Math.ceil(q.length / 2);
  return [q.slice(0, mid), q.slice(mid)];
}
