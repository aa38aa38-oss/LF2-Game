// 操作說明
import { txt, pixelText, panel, blink } from '../ui.js';
import { menuBg } from './common.js';

const KEYS = [
  ['方向鍵 / WASD', '移動（可前後走）；連按兩下 ← → 奔跑'],
  ['J / Z', '攻擊（連按三下打出連段）'],
  ['K / 空白鍵', '跳躍（空中可再按攻擊）'],
  ['L / X', '防禦（按住；擋不住大絕）'],
  ['U / C', '特技（耗氣力，每個角色不同）'],
  ['I / V', '大絕（氣力滿時）'],
  ['P / Esc', '暫停'],
  ['M', '靜音'],
];
const TIPS = [
  '• 打人和被打都會累積氣力，氣力滿了 HUD 會閃「大絕 OK」',
  '• 大絕會先跳出角色海報和金句，期間全場時間暫停',
  '• 倒地時短暫無敵，趁機拉開距離；被暈眩時會冒星星',
  '• 跑步中按攻擊是衝刺攻擊，可以直接把人撞倒',
];

export class HowToScene {
  constructor(g) {
    this.g = g;
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    const c = this.g.input.p1;
    if (c.pressed('pause')) return this.g.goTitle();
    if (c.confirm) {
      this.g.audio.sfx('confirm');
      this.g.goMode();
    }
  }
  onPointer() {
    this.g.audio.sfx('confirm');
    this.g.goMode();
  }
  draw() {
    const g = this.g;
    const p = g.beginPix();
    menuBg(p, this.t, 'rally', 0.55);
    g.flushPix();
    const ctx = g.ctx;
    pixelText(ctx, '操作說明', 480, 50, { size: 48, scale: 3, color: '#8CFF5B', color2: '#2fbf2f', outline: '#062006' });
    panel(ctx, 140, 84, 680, 300);
    KEYS.forEach(([k, d], i) => {
      const y = 116 + i * 34;
      txt(ctx, k, 360, y, { size: 21, weight: 900, color: '#ffd84a', align: 'right' });
      txt(ctx, d, 390, y, { size: 20, weight: 700, color: '#fff' });
    });
    TIPS.forEach((s, i) => txt(ctx, s, 160, 408 + i * 26, { size: 17, weight: 700, color: '#fff', stroke: '#000', sw: 4 }));
    if (blink(this.t, 1.2)) pixelText(ctx, 'PRESS ENTER', 480, 515, { size: 24, scale: 2, font: 'px', color: '#ffd84a', color2: '#ff9a1a', outline: '#2a1000' });
    if (document.body.classList.contains('touch')) txt(ctx, '手機：左邊十字鍵移動，右邊按鈕「攻／跳／防／特／絕」', 480, 490, { size: 14, color: '#ccc', align: 'center' });
  }
}
