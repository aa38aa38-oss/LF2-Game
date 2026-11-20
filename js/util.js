// 共用小工具
export const W = 960, H = 540;
export const FONT_TC = "'Noto Sans TC','PingFang TC','Microsoft JhengHei','Heiti TC',sans-serif";
export const FONT_PX = "'Press Start 2P',monospace";

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a, b) => a + Math.random() * (b - a);
export const randi = (a, b) => Math.floor(rand(a, b + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const sign = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const easeIn = (t) => Math.pow(clamp(t, 0, 1), 3);
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// localStorage 可能被封鎖（無痕模式等），一律包 try/catch
export const store = {
  get(key, def) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? def : JSON.parse(v);
    } catch (e) {
      return def;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      /* ignore */
    }
  },
};

export function inRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

// 2.5D 場地：x 左右、z 前後（越大越靠近鏡頭）、y 高度
export const ARENA = { xMin: 34, xMax: 926, zMin: 0, zMax: 186, floorY: 322 };
