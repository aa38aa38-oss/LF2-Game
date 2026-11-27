// 劇情模式密技（測試用）
// 依序按出：攻 攻 攻、跳 跳 跳、攻 攻 攻、旋踢 旋踢 旋踢（每兩下間隔 2 秒內）
// 效果：無敵、氣永遠滿、碰到敵人（含 Boss）直接打倒；開啟後整個遊戲期間（換關也）一直有效，重新整理網頁才關閉
export const CHEAT_SEQ = ['attack', 'attack', 'attack', 'jump', 'jump', 'jump', 'attack', 'attack', 'attack', 'spin', 'spin', 'spin'];
export const CHEAT = { on: false };

// 每幀呼叫一次；st 是存比對進度的物件。剛好按完整串時回傳 true
export function readCheat(st, ctrl, dt) {
  if (CHEAT.on || !ctrl) return false;
  st.t = (st.t || 0) + dt;
  if (st.t > 2) st.buf = [];
  for (const b of ['attack', 'jump', 'spin']) {
    if (!ctrl.pressed(b)) continue;
    st.t = 0;
    st.buf = [...(st.buf || []), b].slice(-CHEAT_SEQ.length);
    if (st.buf.length === CHEAT_SEQ.length && st.buf.every((x, i) => x === CHEAT_SEQ[i])) {
      CHEAT.on = true;
      st.buf = [];
      return true;
    }
  }
  return false;
}
