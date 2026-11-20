// 遊戲主程式：畫布、迴圈、場景切換
import { W, H, store } from './util.js';
import { Input } from './input.js';
import { Sound } from './audio.js';
import { loadAssets } from './assets.js';
import { clearTextCache, txt } from './ui.js';
import { BattleScene } from './battle.js';
import { IntroScene } from './scenes/intro.js';
import { TitleScene } from './scenes/title.js';
import { HowToScene } from './scenes/howto.js';
import { ModeScene } from './scenes/mode.js';
import { CharSelectScene } from './scenes/charselect.js';
import { StageSelectScene } from './scenes/stageselect.js';
import { VSScene } from './scenes/vs.js';
import { ResultScene } from './scenes/result.js';
import { LeaderboardScene } from './scenes/leaderboard.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext('2d');
    this.pixCanvas = document.createElement('canvas');
    this.pixCanvas.width = W / 2;
    this.pixCanvas.height = H / 2;
    this.pix = this.pixCanvas.getContext('2d');
    this.input = new Input();
    this.audio = new Sound();
    this.hi = store.get('tpb_hiscore', 0);
    this.flow = { mode: '1v1', difficulty: 'normal' };
    this.scene = null;
    this.fade = 0;
    this.input.onAny = () => this.audio.unlock();
    this.canvas.addEventListener('pointerdown', (e) => {
      this.audio.unlock();
      const r = this.canvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * W;
      const y = ((e.clientY - r.top) / r.height) * H;
      if (this.scene && this.scene.onPointer) this.scene.onPointer(x, y);
    });
    const touch = document.getElementById('touch');
    this.input.bindTouch(touch);
    document.getElementById('fs').addEventListener('click', () => this.toggleFullscreen());
  }

  toggleFullscreen() {
    const el = document.getElementById('wrap');
    if (!document.fullscreenElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el);
    } else document.exitFullscreen && document.exitFullscreen();
  }

  beginPix() {
    const p = this.pix;
    p.setTransform(1, 0, 0, 1, 0, 0);
    p.clearRect(0, 0, W / 2, H / 2);
    p.setTransform(0.5, 0, 0, 0.5, 0, 0);
    return p;
  }
  flushPix() {
    const c = this.ctx;
    c.save();
    c.imageSmoothingEnabled = false;
    c.drawImage(this.pixCanvas, 0, 0, W, H);
    c.restore();
  }

  setScene(s) {
    if (this.scene && this.scene.exit) this.scene.exit();
    this.scene = s;
    this.fade = 1;
    if (s.enter) s.enter();
  }
  setHi(score) {
    if (score > this.hi) {
      this.hi = score;
      store.set('tpb_hiscore', score);
      return true;
    }
    return false;
  }

  // 流程
  goIntro() { this.setScene(new IntroScene(this)); }
  goTitle() { this.setScene(new TitleScene(this)); }
  goHowTo() { this.setScene(new HowToScene(this)); }
  goMode() { this.setScene(new ModeScene(this)); }
  goCharSelect() { this.setScene(new CharSelectScene(this)); }
  goStageSelect() { this.setScene(new StageSelectScene(this)); }
  goVS(cfg) { this.setScene(new VSScene(this, cfg)); }
  startBattle(cfg) { this.setScene(new BattleScene(this, cfg)); }
  goResult(data) { this.setScene(new ResultScene(this, data)); }
  goLeaderboard(highlight) { this.setScene(new LeaderboardScene(this, highlight)); }

  loop() {
    let last = performance.now();
    let acc = 0;
    const STEP = 1 / 60;
    const frame = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      while (acc >= STEP) {
        const p1 = this.input.p1;
        if (p1.pressed('mute')) this.audio.toggleMute();
        this.scene.update(STEP);
        this.input.endFrame();
        if (this.fade > 0) this.fade = Math.max(0, this.fade - STEP * 4);
        acc -= STEP;
      }
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, W, H);
      this.scene.draw();
      if (this.audio.muted) txt(this.ctx, '🔇', 940, 528, { size: 14, align: 'right', alpha: 0.7 });
      if (this.fade > 0) {
        this.ctx.fillStyle = `rgba(0,0,0,${this.fade})`;
        this.ctx.fillRect(0, 0, W, H);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

function fit() {
  const wrap = document.getElementById('wrap');
  const c = document.getElementById('game');
  const vw = wrap.clientWidth, vh = wrap.clientHeight;
  const s = Math.min(vw / W, vh / H);
  c.style.width = `${Math.floor(W * s)}px`;
  c.style.height = `${Math.floor(H * s)}px`;
}

async function boot() {
  fit();
  window.addEventListener('resize', fit);
  document.addEventListener('fullscreenchange', () => setTimeout(fit, 50));
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (coarse || 'ontouchstart' in window) document.body.classList.add('touch');
  const game = new Game();
  window.__game = game;
  try {
    await Promise.race([
      Promise.all([document.fonts.load("900 20px 'Noto Sans TC'"), document.fonts.load("20px 'Press Start 2P'")]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch (e) {
    /* 字型載入失敗就用系統字 */
  }
  await loadAssets();
  clearTextCache();
  document.fonts && document.fonts.ready.then(() => clearTextCache());
  game.goIntro();
  game.loop();
  document.getElementById('loading').style.display = 'none';
}
boot();
