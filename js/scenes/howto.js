// 操作說明
import { txt, pixelText, panel, blink } from '../ui.js';
import { menuBg } from './common.js';

const KEYS = [
  ['方向鍵', '移動；連按兩下 ← → 奔跑'],
  ['X（攻）', '連按＝三段連招'],
  ['→ ＋ X', '前衝攻擊（往前衝，路上的人全撞倒）'],
  ['跳 → 空中 X', '從天而降（落地一圈衝擊波）'],
  ['按著 ↓ ＋ X', '迴旋攻擊（前後一圈都打）'],
  ['空白鍵（跳）', '跳躍；被打飛時按＝空中翻身'],
  ['C（大絕）', '氣集滿時放大絕'],
  ['P / Esc　M', '暫停　靜音'],
];
const TIPS = [
  '• 每個角色的指令招式範圍、效果都一樣，只是外觀不同；大招才是各自的絕招',
  '• 連續挨打會「搖搖晃晃」，這時走過去就能抓住他，連揍幾拳再按方向＋攻擊丟出去！',
  '• 地上的便當、珍奶走過去就會自動吃，補血又補氣',
  '• 打中人、被打都會集氣；血越少回氣越快，絕地大反攻！大招完全打空會返還一半的氣',
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
    panel(ctx, 130, 80, 700, 300);
    KEYS.forEach(([k, d], i) => {
      const y = 116 + i * 34;
      txt(ctx, k, 370, y, { size: 19, weight: 900, color: '#ffd84a', align: 'right' });
      txt(ctx, d, 395, y, { size: 18, weight: 700, color: '#fff' });
    });
    TIPS.forEach((s, i) => txt(ctx, s, 70, 402 + i * 24, { size: 15, weight: 700, color: '#fff', stroke: '#000', sw: 4 }));
    if (blink(this.t, 1.2)) pixelText(ctx, 'PRESS ENTER', 480, 515, { size: 24, scale: 2, font: 'px', color: '#ffd84a', color2: '#ff9a1a', outline: '#2a1000' });
    if (document.body.classList.contains('touch')) txt(ctx, '手機：左半邊任意處按住拖曳＝搖桿（推到底奔跑），右邊「攻／跳／防／特／絕」', 480, 494, { size: 14, color: '#ccc', align: 'center' });
  }
}
