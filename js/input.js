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
  Digit1: 'sk1', Digit2: 'sk2', Digit3: 'sk3',
  Numpad1: 'sk1', Numpad2: 'sk2', Numpad3: 'sk3',
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
    this.frame = 0;
    this.log = []; // 最近按過的鍵（給「防→方向→攻」指令用）
  }
  setBtn(b, v) {
    if (v && !this.state[b]) {
      this.hits[b] = true;
      this.log.push({ b, f: this.frame });
      if (this.log.length > 12) this.log.shift();
    }
    this.state[b] = v;
  }
  // 小朋友齊打交式指令：防 → (方向) → 攻，在 0.6 秒內完成。回傳 'fwd' | 'up' | 'down' | null
  command(facing) {
    const now = this.frame;
    const L = this.log.filter((e) => now - e.f <= 36);
    let di = -1;
    for (let i = L.length - 1; i >= 0; i--) if (L[i].b === 'defend') { di = i; break; }
    if (di < 0) return null;
    let dir = null;
    for (let i = di + 1; i < L.length; i++) {
      const b = L[i].b;
      if (b === 'up' || b === 'down') dir = b;
      else if (b === 'left' || b === 'right') dir = b;
    }
    if (!dir) return null;
    this.log = [];
    if (dir === 'up' || dir === 'down') return dir;
    return dir === 'left' ? 'fwdL' : 'fwdR';
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
    this.frame++;
  }
  reset() {
    this.state = {};
    this.hits = {};
    this.wantRun = false;
    this.log = [];
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
  // 浮動虛擬搖桿（類似傳說對決）：左半邊任何地方按下，搖桿底座就出現在手指下
  bindJoystick(zone, base, knob) {
    const R = 52;
    const p1 = this.p1;
    let id = null, cx = 0, cy = 0;
    const home = () => {
      base.style.left = '';
      base.style.top = '';
      base.style.bottom = '';
      base.classList.remove('active');
      knob.style.transform = '';
    };
    const apply = (nx, ny) => {
      const T = 0.38;
      p1.setBtn('left', nx < -T);
      p1.setBtn('right', nx > T);
      p1.setBtn('up', ny < -T);
      p1.setBtn('down', ny > T);
      // 推到底就跑步
      p1.wantRun = Math.abs(nx) > 0.9 && Math.abs(ny) < 0.6;
    };
    zone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.onAny) this.onAny(e);
      if (id !== null) return;
      id = e.pointerId;
      try {
        zone.setPointerCapture(id);
      } catch (err) {
        /* ignore */
      }
      const r = base.offsetParent ? base.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
      cx = e.clientX;
      cy = e.clientY;
      base.style.left = `${cx - r.left - base.offsetWidth / 2}px`;
      base.style.top = `${cy - r.top - base.offsetHeight / 2}px`;
      base.style.bottom = 'auto';
      base.classList.add('active');
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      e.preventDefault();
      let dx = e.clientX - cx, dy = e.clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      apply(dx / R, dy / R);
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      apply(0, 0);
      p1.wantRun = false;
      home();
    };
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
  }
  endFrame() {
    this.p1.endFrame();
  }
}
