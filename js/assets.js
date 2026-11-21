// 外部美術素材載入器。
// assets/manifest.json 有列出的圖就用圖，沒有就用程式畫的暫時素材。
// 素材規格與命名請看 docs/GEMINI_PROMPTS.md

export const ASSETS = { chars: {}, posters: {}, portraits: {}, stages: {}, select: {}, standH: {} };

function chroma(img, hex, tol) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  try {
    const d = x.getImageData(0, 0, c.width, c.height);
    const kr = parseInt(hex.slice(1, 3), 16), kg = parseInt(hex.slice(3, 5), 16), kb = parseInt(hex.slice(5, 7), 16);
    const p = d.data;
    const green = kg > 200 && kr < 80 && kb < 80;
    for (let i = 0; i < p.length; i += 4) {
      if (green) {
        // 綠幕去背：看「綠色比紅藍多多少」，邊緣半透明，再把殘留的綠色壓掉（去綠邊）
        const m = Math.max(p[i], p[i + 2]);
        const ex = p[i + 1] - m;
        const hard = 40 + tol / 3; // tol 120 → 80
        if (ex > hard) p[i + 3] = 0;
        else if (ex > 20) {
          p[i + 3] = Math.round(p[i + 3] * (1 - (ex - 20) / (hard - 20)));
          p[i + 1] = m;
        } else if (ex > 0) p[i + 1] = m;
      } else {
        const dist = Math.abs(p[i] - kr) + Math.abs(p[i + 1] - kg) + Math.abs(p[i + 2] - kb);
        if (dist < tol) p[i + 3] = 0;
      }
    }
    x.putImageData(d, 0, 0);
  } catch (e) {
    return img;
  }
  return c;
}

function loadImg(src, key, tol) {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => res(key ? chroma(im, key, tol) : im);
    im.onerror = () => {
      console.warn('[assets] 找不到圖檔：', src);
      res(null);
    };
    im.src = src;
  });
}

export async function loadAssets() {
  let man;
  try {
    const r = await fetch('assets/manifest.json', { cache: 'no-cache' });
    if (!r.ok) return;
    man = await r.json();
  } catch (e) {
    return;
  }
  // 有 Gemini 角色圖時，世界層改用全解析度，插畫風的圖才不會糊掉
  ASSETS.hiRes = man.hiRes != null ? !!man.hiRes : Object.keys(man.characters || {}).length + Object.keys(man.select || {}).length > 0;
  ASSETS.spriteH = man.spriteHeight || 128; // 角色圖在遊戲裡的高度
  const key = man.chromaKey || null;
  const tol = man.chromaTolerance || 120;
  const jobs = [];
  for (const [cid, anims] of Object.entries(man.characters || {})) {
    ASSETS.chars[cid] = {};
    // _standH：整理工具算出的「站立高度」，用來讓所有動作縮放比例一致
    if (anims._standH) ASSETS.standH[cid] = anims._standH;
    for (const [anim, spec] of Object.entries(anims)) {
      if (anim.startsWith('_')) continue;
      if (typeof spec === 'object' && spec.sheet) {
        // 一張橫向排列的動作條（sprite sheet），自動等分切格
        const n = spec.frames || 1;
        const arr = (ASSETS.chars[cid][anim] = new Array(n).fill(null));
        jobs.push(
          loadImg(spec.sheet, key, tol).then((im) => {
            if (!im) return;
            const fw = Math.floor(im.width / n), fh = im.height;
            for (let i = 0; i < n; i++) {
              const c = document.createElement('canvas');
              c.width = fw;
              c.height = fh;
              c.getContext('2d').drawImage(im, i * fw, 0, fw, fh, 0, 0, fw, fh);
              arr[i] = c;
            }
          })
        );
        continue;
      }
      const n = spec;
      const arr = (ASSETS.chars[cid][anim] = new Array(n).fill(null));
      for (let i = 1; i <= n; i++) {
        jobs.push(loadImg(`assets/characters/${cid}/${anim}_${i}.png`, key, tol).then((im) => (arr[i - 1] = im)));
      }
    }
  }
  for (const group of ['posters', 'portraits', 'stages', 'select']) {
    for (const [id, path] of Object.entries(man[group] || {})) {
      const ck = group === 'stages' || group === 'portraits' ? null : key;
      jobs.push(loadImg(path, ck, tol).then((im) => im && (ASSETS[group][id] = im)));
    }
  }
  await Promise.all(jobs);
}

export function charFrame(cid, anim, t, fps = 8, loop = true) {
  const arr = ASSETS.chars[cid] && ASSETS.chars[cid][anim];
  if (!arr || !arr.length || arr.some((x) => !x)) return null;
  let i = Math.floor(t * fps);
  i = loop ? i % arr.length : Math.min(i, arr.length - 1);
  return arr[i];
}
