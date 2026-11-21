// 遊戲主程式：畫布、迴圈、場景切換
import { specialDef, specialCD } from './moves.js';
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
    this.CW = W; // 畫布寬度：跟著螢幕比例變寬（手機填滿全螢幕），高度固定 540
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
      const x = ((e.clientX - r.left) / r.width) * this.CW - this.ox;
      const y = ((e.clientY - r.top) / r.height) * H;
      if (this.scene && this.scene.onPointer) this.scene.onPointer(x, y);
    });
    const touch = document.getElementById('touch');
    this.input.bindTouch(touch);
    this.input.bindJoystick(document.getElementById('stickZone'), document.getElementById('stickBase'), document.getElementById('stickKnob'));
    this.supBtn = touch.querySelector('.sup');
    this.skBtns = ['fwd', 'up', 'down'].map((k, i) => ({ k, el: touch.querySelector('.sk' + (i + 1)), last: -1, char: null }));
    const fs = document.getElementById('fs');
    if (canFullscreen()) {
      fs.addEventListener('click', () => this.toggleFullscreen());
    } else {
      // iPhone Safari 不支援網頁全螢幕 → 改成說明「加入主畫面」
      fs.textContent = '📲 全螢幕';
      fs.style.display = isStandalone() ? 'none' : '';
      fs.addEventListener('click', () => showTip());
    }
  }

  toggleFullscreen() {
    const el = document.documentElement;
    if (!(document.fullscreenElement || document.webkitFullscreenElement)) {
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      const pr = req && req.call(el);
      const lock = () => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape').catch(() => {});
      if (pr && pr.then) pr.then(lock).catch(() => {});
    } else (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document);
  }

  // 選單畫面置中在 960 寬的區域；對戰畫面用滿整個寬度
  get ox() {
    return Math.round((this.CW - W) / 2);
  }
  setWidth(cw) {
    cw = Math.max(W, Math.min(1280, Math.round(cw / 2) * 2));
    if (cw === this.CW) return;
    this.CW = cw;
    this.canvas.width = cw;
    this.pixCanvas.width = cw / 2;
  }
  beginPix(full = false) {
    const p = this.pix;
    p.setTransform(1, 0, 0, 1, 0, 0);
    p.clearRect(0, 0, this.CW / 2, H / 2);
    p.setTransform(0.5, 0, 0, 0.5, full ? 0 : this.ox / 2, 0);
    return p;
  }
  flushPix() {
    const c = this.ctx;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.imageSmoothingEnabled = false;
    c.drawImage(this.pixCanvas, 0, 0, this.CW, H);
    c.restore();
  }

  setScene(s) {
    if (this.scene && this.scene.exit) this.scene.exit();
    this.scene = s;
    this.fade = 1;
    document.body.dataset.scene = s instanceof BattleScene ? 'battle' : 'menu';
    this.input.p1.reset();
    if (s.enter) s.enter();
  }
  // 觸控技能鍵：顯示技能名稱與冷卻倒數
  updateSkillButtons(P) {
    this.skBtns.forEach((s, i) => {
      if (s.char !== P.char.id) {
        s.char = P.char.id;
        const n = P.char.specials[i].name;
        const cut = n.length > 4 ? 3 : 2;
        s.el.querySelector('.nm').innerHTML = n.slice(0, cut) + '<br>' + n.slice(cut);
        s.last = -1;
      }
      const left = P.cd[s.k];
      const shown = left > 0 ? Math.ceil(left) : 0;
      if (left > 0) s.el.style.setProperty('--p', (left / specialCD(specialDef(P.char.id, s.k))).toFixed(3));
      if (shown !== s.last) {
        if (shown === 0 && s.last > 0) {
          s.el.classList.remove('flashready');
          void s.el.offsetWidth;
          s.el.classList.add('flashready');
        }
        s.el.classList.toggle('cd', shown > 0);
        s.el.querySelector('.cdn').textContent = shown || '';
        s.last = shown;
      }
    });
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
      this.ctx.fillRect(0, 0, this.CW, H);
      this.ctx.setTransform(1, 0, 0, 1, this.ox, 0);
      this.scene.draw();
      this.ctx.setTransform(1, 0, 0, 1, this.ox, 0);
      if (this.supBtn) {
        const P = this.scene.player;
        this.supBtn.classList.toggle('ready', !!(P && P.mp >= 100 && !P.dead));
        if (P && P.cd) this.updateSkillButtons(P);
      }
      if (this.audio.muted) txt(this.ctx, '🔇', 940, 528, { size: 14, align: 'right', alpha: 0.7 });
      if (this.fade > 0) {
        this.ctx.fillStyle = `rgba(0,0,0,${this.fade})`;
        this.ctx.fillRect(-this.ox, 0, this.CW, H);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

function canFullscreen() {
  return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
}
function isStandalone() {
  return window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches);
}
function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function showTip() {
  const t = document.getElementById('tip');
  document.getElementById('tipText').innerHTML = isIOS()
    ? 'iPhone 的 Safari 不支援網頁全螢幕。<br>請點 Safari 下方的「<b>分享</b>」按鈕 →「<b>加入主畫面</b>」，之後從手機桌面的「政壇大亂鬥」圖示開啟，就會是<b>全螢幕、沒有網址列</b>。<br>記得把手機<b>轉成橫向</b>。'
    : '請用瀏覽器選單的「<b>加入主畫面</b>／安裝應用程式」，之後從桌面圖示開啟就是全螢幕。';
  t.classList.add('show');
}

// 防止 iPhone 雙擊／雙指縮放把畫面放大卡住
function noZoom() {
  const vp = document.querySelector('meta[name=viewport]');
  const base = vp.getAttribute('content');
  const reset = () => {
    vp.setAttribute('content', base + ',shrink-to-fit=no');
    setTimeout(() => vp.setAttribute('content', base), 50);
  };
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
  let last = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - last < 350 && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') e.preventDefault();
      last = now;
    },
    { passive: false }
  );
  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 1) e.preventDefault();
    else if (e.target.tagName !== 'INPUT') e.preventDefault();
  }, { passive: false });
  document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
  window.addEventListener('orientationchange', () => setTimeout(() => { reset(); fit(); }, 200));
  window.addEventListener('resize', () => {
    if (window.visualViewport && window.visualViewport.scale > 1.01) reset();
  });
}

function fit() {
  const wrap = document.getElementById('wrap');
  const c = document.getElementById('game');
  const vv = window.visualViewport;
  const vw = vv ? Math.min(vv.width, wrap.clientWidth) : wrap.clientWidth;
  const vh = vv ? Math.min(vv.height, wrap.clientHeight) : wrap.clientHeight;
  const g = window.__game;
  if (g) g.setWidth((H * vw) / vh);
  const CW = g ? g.CW : W;
  const s = Math.min(vw / CW, vh / H);
  c.style.width = `${Math.floor(CW * s)}px`;
  c.style.height = `${Math.floor(H * s)}px`;
}

async function boot() {
  noZoom();
  fit();
  window.addEventListener('resize', fit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
  document.getElementById('tipOk').addEventListener('click', () => document.getElementById('tip').classList.remove('show'));
  document.addEventListener('fullscreenchange', () => setTimeout(fit, 50));
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (coarse || 'ontouchstart' in window) document.body.classList.add('touch');
  const game = new Game();
  window.__game = game;
  fit();
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
