// 結算畫面 + 輸入名字上排行榜
import { drawChar } from '../sprites.js';
import { txt, pixelText, panel, Hotspots, blink } from '../ui.js';
import { menuBg, poseOf } from './common.js';
import { Leaderboard } from '../leaderboard.js';
import { MODE_NAME } from '../battle.js';
import { store } from '../util.js';

const OPTS = ['再戰一場', '重新選角', '回到標題'];

export class ResultScene {
  constructor(g, d) {
    this.g = g;
    this.d = d;
    this.t = 0;
    this.sel = 0;
    this.hot = new Hotspots();
    this.entering = false;
    this.submitted = false;
  }
  async enter() {
    const g = this.g, d = this.d;
    g.audio.playBgm(d.win ? 'title' : 'menu');
    this.newHi = g.setHi(d.score);
    if (await Leaderboard.qualifies(d.score)) this.openInput();
  }
  exit() {
    this.closeInput();
  }
  openInput() {
    this.entering = true;
    const el = document.getElementById('nameInput');
    const box = document.getElementById('nameBox');
    box.style.display = 'flex';
    el.value = store.get('tpb_lastname', '');
    setTimeout(() => el.focus(), 50);
    this.onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submit();
      } else if (e.key === 'Escape') {
        this.closeInput();
      }
    };
    el.addEventListener('keydown', this.onKey);
    this.onBtn = () => this.submit();
    document.getElementById('nameOk').addEventListener('click', this.onBtn);
  }
  closeInput() {
    this.entering = false;
    const el = document.getElementById('nameInput');
    document.getElementById('nameBox').style.display = 'none';
    if (this.onKey) el.removeEventListener('keydown', this.onKey);
    if (this.onBtn) document.getElementById('nameOk').removeEventListener('click', this.onBtn);
    this.onKey = this.onBtn = null;
    el.blur();
  }
  async submit() {
    if (this.submitted) return;
    const el = document.getElementById('nameInput');
    const name = (el.value || '').trim().slice(0, 10) || '無名氏';
    store.set('tpb_lastname', name);
    this.submitted = true;
    const d = this.d;
    const entry = { name, score: d.score, char: d.playerChar.title, mode: MODE_NAME[d.cfg.mode], date: new Date().toISOString().slice(0, 10) };
    this.closeInput();
    this.g.audio.sfx('confirm');
    await Leaderboard.submit(entry);
    this.g.goLeaderboard(entry);
  }
  choose(i) {
    const g = this.g;
    g.audio.sfx('confirm');
    const cfg = this.d.cfg;
    if (i === 0) cfg.mode === 'shaft' ? g.startShaft({ ...cfg, rivals: null }) : cfg.mode === 'story' ? g.startStory({ playerChar: cfg.playerChar, difficulty: cfg.difficulty }) : g.goVS({ ...cfg });
    else if (i === 1) g.goCharSelect();
    else g.goTitle();
  }
  update(dt) {
    this.t += dt;
    if (this.entering) return;
    const c = this.g.input.p1;
    if (this.t < 0.8) return;
    if (c.pressed('up') || c.pressed('left')) {
      this.sel = (this.sel + 2) % 3;
      this.g.audio.sfx('move');
    }
    if (c.pressed('down') || c.pressed('right')) {
      this.sel = (this.sel + 1) % 3;
      this.g.audio.sfx('move');
    }
    if (c.confirm) this.choose(this.sel);
  }
  onPointer(x, y) {
    if (!this.entering) this.hot.hit(x, y);
  }
  draw() {
    const g = this.g, d = this.d, t = this.t;
    const hero = d.win ? d.playerChar : d.winnerChar || d.playerChar;
    const p = g.beginPix();
    menuBg(p, t, d.stage || 'studio', 0.5);
    const gr = p.createRadialGradient(240, 420, 10, 240, 420, 260);
    gr.addColorStop(0, hero.color);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    p.globalAlpha = 0.55;
    p.fillStyle = gr;
    p.fillRect(0, 140, 500, 400);
    p.globalAlpha = 1;
    drawChar(p, hero, poseOf(hero, 'victory', t), 240, 520, 1, 3.2, 1, false, t);
    if (!d.win && d.playerChar !== hero) drawChar(p, d.playerChar, poseOf(d.playerChar, 'ko', t), 430, 525, 1, 1.6, 1, false, t);
    g.flushPix();
    const ctx = g.ctx;
    const title = d.cfg.mode === 'story' ? '當選！' : d.cfg.mode === 'survival' ? 'GAME OVER' : d.win ? 'YOU WIN!' : 'YOU LOSE…';
    pixelText(ctx, title, 480, 48, { size: 56, scale: 3, font: 'px', color: d.win ? '#ffe14a' : '#ff6a5a', color2: d.win ? '#ff9a1a' : '#a0201a', outline: '#100400' });
    // 勝利台詞
    ctx.save();
    ctx.translate(250, 130);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-200, -32, 400, 64, 14) : ctx.rect(-200, -32, 400, 64);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-20, 30);
    ctx.lineTo(10, 60);
    ctx.lineTo(20, 30);
    ctx.fill();
    txt(ctx, `「${hero.quote}」`, 0, 0, { size: hero.quote.length > 12 ? 22 : 26, weight: 900, color: '#111', align: 'center' });
    ctx.restore();
    panel(ctx, 520, 100, 400, 300);
    const s = d.stats;
    const rows = [
      ['模式', MODE_NAME[d.cfg.mode] + (d.cfg.mode === 'survival' ? `（撐到第 ${d.wave} 波）` : '')],
      ['使用角色', d.playerChar.title],
      ['造成傷害', Math.round(s.dmg)],
      ['擊倒數', s.kos],
      ['最高連段', `${s.maxCombo} HITS`],
    ];
    if (d.clearTime != null) rows.splice(1, 0, ['通關時間', `${Math.floor(d.clearTime / 60)} 分 ${(d.clearTime % 60).toFixed(1)} 秒`]);
    rows.forEach(([k, v], i) => {
      txt(ctx, k, 548, 136 + i * 34, { size: 17, weight: 900, color: '#aaa' });
      txt(ctx, String(v), 892, 136 + i * 34, { size: 18, weight: 900, color: '#fff', align: 'right' });
    });
    txt(ctx, 'SCORE', 548, 324, { size: 14, font: 'px', color: '#ffd84a' });
    pixelText(ctx, String(d.score).padStart(8, '0'), 892, 360, { size: 34, scale: 2, font: 'px', color: '#fff', outline: '#000', align: 'right' });
    if (this.newHi && blink(t, 2)) txt(ctx, 'NEW HI-SCORE!', 548, 362, { size: 11, font: 'px', color: '#ff5a5a' });
    this.hot.clear();
    OPTS.forEach((o, i) => {
      const x = 540 + i * 130, y = 440, w = 120, h = 44;
      const sel = i === this.sel;
      ctx.fillStyle = sel ? 'rgba(255,216,74,0.25)' : 'rgba(0,0,0,0.6)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = sel ? '#ffd84a' : '#666';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      txt(ctx, o, x + w / 2, y + h / 2, { size: 18, weight: 900, color: sel ? '#ffd84a' : '#fff', align: 'center' });
      this.hot.add(x, y, w, h, () => this.choose(i));
    });
    if (this.entering) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, 960, 540);
      pixelText(ctx, '登上排行榜！', 480, 190, { size: 44, scale: 3, color: '#ffe14a', color2: '#ff9a1a', outline: '#100400' });
      txt(ctx, `SCORE ${d.score}　輸入名字後按 Enter（Esc 跳過）`, 480, 240, { size: 18, weight: 900, color: '#fff', align: 'center' });
    }
  }
}
