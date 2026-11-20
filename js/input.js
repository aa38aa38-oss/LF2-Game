// 輸入系統：每位玩家一個 Controller。
// 鍵盤、觸控、電腦 AI、以及之後的「手機搖桿」都只要操作 Controller 就能控制角色。

const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  KeyJ: 'attack', KeyZ: 'attack',
  KeyK: 'jump', Space: 'jump',
  KeyL: 'defend', KeyX: 'defend',
  KeyU: 'special', KeyC: 'special',
  KeyI: 'super', KeyV: 'super',
  Enter: 'start', NumpadEnter: 'start',
  KeyP: 'pause', Escape: 'pause',
  KeyM: 'mute',
  KeyR: 'rank',
};

export class Controller {
  constructor() {
    this.state = {};
    this.hits = {};
    this.wantRun = false;
  }
  setBtn(b, v) {
    if (v && !this.state[b]) this.hits[b] = true;
    this.state[b] = v;
  }
  tap(b) {
    this.hits[b] = true;
  }
  held(b) {
    return !!this.state[b];
  }
  pressed(b) {
    return !!this.hits[b];
  }
  endFrame() {
    this.hits = {};
  }
  reset() {
    this.state = {};
    this.hits = {};
    this.wantRun = false;
  }
  // 選單用
  get confirm() {
    return this.pressed('start') || this.pressed('attack');
  }
  get back() {
    return this.pressed('pause') || this.pressed('defend');
  }
}

export class Input {
  constructor() {
    this.p1 = new Controller();
    this.onAny = null;
    window.addEventListener('keydown', (e) => {
      if (e.target && e.target.tagName === 'INPUT') return;
      const b = KEYMAP[e.code];
      if (b) {
        e.preventDefault();
        if (!e.repeat) this.p1.setBtn(b, true);
      }
      if (this.onAny) this.onAny(e);
    });
    window.addEventListener('keyup', (e) => {
      const b = KEYMAP[e.code];
      if (b) this.p1.setBtn(b, false);
    });
    window.addEventListener('blur', () => this.p1.reset());
  }
  bindTouch(root) {
    root.querySelectorAll('[data-btn]').forEach((el) => {
      const b = el.dataset.btn;
      const on = (e) => {
        e.preventDefault();
        el.classList.add('on');
        this.p1.setBtn(b, true);
        if (this.onAny) this.onAny(e);
      };
      const off = (e) => {
        e.preventDefault();
        el.classList.remove('on');
        this.p1.setBtn(b, false);
      };
      el.addEventListener('pointerdown', on);
      el.addEventListener('pointerup', off);
      el.addEventListener('pointercancel', off);
      el.addEventListener('pointerleave', off);
    });
  }
  endFrame() {
    this.p1.endFrame();
  }
}
