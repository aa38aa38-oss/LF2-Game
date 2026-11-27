// 選單共用：背景、角色展示
import { STAGE_BY_ID } from '../stages.js';
import { CHARS } from '../characters.js';
import { drawChar, poseFor } from '../sprites.js';
import { ARENA } from '../util.js';

export function menuBg(p, t, stageId = 'studio', dark = 0.6) {
  STAGE_BY_ID[stageId].draw(p, t);
  p.fillStyle = `rgba(4,4,16,${dark})`;
  p.fillRect(0, 0, 960, 540);
}

// 用「假角色」呼叫 poseFor，取得某狀態的姿勢
export function poseOf(ch, state, t, stateT = t) {
  // _state／_t：讓 drawChar 在有動作圖時直接畫圖
  return { ...poseFor({ char: ch, state, animT: t, stateT, mv: {}, facing: 1 }), _state: state, _t: t };
}

export function drawLineup(p, t, y = 470, scale = 1.6, gap = 140, opts = {}) {
  const n = CHARS.length;
  // 人數多時縮小間距與大小，整排塞進畫面
  const k = Math.min(1, 860 / ((n - 1) * gap));
  gap *= k;
  scale *= Math.max(0.7, k);
  const x0 = 480 - ((n - 1) * gap) / 2;
  CHARS.forEach((ch, i) => {
    const st = opts.state || 'idle';
    drawChar(p, ch, poseOf(ch, st, t + i * 0.7), x0 + i * gap, y, i < n / 2 ? 1 : -1, scale, 1, false, t);
  });
}

export function silhouette(p, fn) {
  if ('filter' in p) {
    p.save();
    p.filter = 'brightness(0)';
    fn();
    p.restore();
  } else fn();
}

export { ARENA };
