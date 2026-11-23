#!/usr/bin/env python3
"""把 Gemini 生的圖整理成遊戲用的素材，並更新 assets/manifest.json。

用法：
  python3 tools/prep_assets.py <解壓後的資料夾> [<資料夾2> ...]

資料夾裡要是 assets/characters/<id>/<動作>.png、assets/portraits/<id>.png、
assets/posters/<id>.png、assets/select/<id>.png、assets/stages/<名稱>.png 這種結構
（跟 docs/GEMINI_PROMPTS.md 的「存檔」路徑一樣）。

角色動作條會：
  1. 綠幕去背（含去綠邊）
  2. 依原圖寬度平均切格（每格 512 寬）
  3. 每格用「腳底＋身體中心」對齊，所有動作放進同樣比例的格子
  4. 縮成一半大小，存成 WebP（有透明背景）
並在 manifest 記下角色站立時的高度（standH），遊戲用它把所有動作縮放成一樣大。
"""
import json, sys, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets'
CELL = 512          # Gemini 原圖每格寬
SCALE = 0.5         # 沒有站立圖可參考時的輸出縮放
STAND_PX = 250      # 輸出時角色站立的高度（像素）；不管 Gemini 原圖多大，都縮成這個大小
PAD = 6             # 每格邊緣留白（輸出像素）
# 各動作預設格數（跟 docs/GEMINI_PROMPTS.md 一樣）；Gemini 畫的格數不同時，用 FRAMES_HINT 指定
EXPECTED = {'idle': 4, 'walk': 6, 'run': 6, 'jump': 2, 'attack1': 3, 'attack2': 3, 'attack3': 4, 'jump_attack': 2,
            'run_attack': 3, 'defend': 1, 'hurt': 2, 'fall': 3, 'down': 1, 'getup': 2, 'dizzy': 3, 'roll': 4,
            'catch': 2, 'victory': 4, 'spin': 4, 'special': 4, 'special_fwd': 4, 'special_up': 4, 'special_down': 4, 'super': 6}
FRAMES_HINT = {'guan/walk': 8, 'guan/run': 8, 'guan/super': 8}
# 只用其中幾格（原圖有幾格人形疊在一起、切不開時用）
FRAME_PICK = {'guan/run': [0, 1, 2, 3, 6, 7]}
STRIP_SCALE = {}    # 某條動作畫得特別大／小時，可手動縮放，例如 {'han/roll': 0.8}


def key_green(img):
    """RGB → RGBA，綠幕去背並去綠邊。"""
    a = np.asarray(img.convert('RGB')).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.maximum(r, b)
    ex = g - m
    alpha = np.full(r.shape, 255, np.int16)
    hard, soft = 80, 20
    alpha[ex > hard] = 0
    mid = (ex > soft) & (ex <= hard)
    alpha[mid] = (255 * (1 - (ex[mid] - soft) / (hard - soft))).astype(np.int16)
    g2 = np.where(ex > 0, m, g)
    out = np.dstack([r, g2, b, alpha]).clip(0, 255).astype(np.uint8)
    return out


def quant(rgb):
    q = (rgb[..., 0] >> 4).astype(np.int32) * 256 + (rgb[..., 1] >> 4) * 16 + (rgb[..., 2] >> 4)
    return q


def build_palette(rgba):
    """從站立圖取得角色本身的顏色（衣服、皮膚、頭髮），用來分辨身體和特效、道具。"""
    m = rgba[..., 3] > 200
    q = quant(rgba[..., :3].astype(np.int32))[m]
    cnt = np.bincount(q, minlength=4096)
    return cnt > max(30, m.sum() * 0.0015)


def body_mask(rgba, pal):
    m = rgba[..., 3] > 200
    if pal is None:
        return m
    return m & pal[quant(rgba[..., :3].astype(np.int32))]


def split_frames(alpha_mask, n):
    """依人形之間的空白欄切格；切不出來就平均切。回傳 [(x0, x1)]。"""
    W = alpha_mask.shape[1]
    cw = W / n
    cnt0 = alpha_mask.sum(axis=0)
    # 先試平均切：每條格線附近幾乎沒有東西，代表 Gemini 是照等寬格子排的，直接平均切最準
    if n > 1:
        peak = max(1, cnt0.max())
        ok = all(cnt0[max(0, int(i * cw) - 3):int(i * cw) + 4].max() < peak * 0.08 for i in range(1, n))
        if ok:
            return [(int(round(i * cw)), int(round((i + 1) * cw))) for i in range(n)], True
    col = alpha_mask.sum(axis=0) > 1
    runs, x = [], 0
    while x < W:
        if col[x]:
            s0 = x
            while x < W and col[x]:
                x += 1
            runs.append([s0, x])
        else:
            x += 1
    # 太小的雜點（星星、汗滴）先不算一個人
    big = [r for r in runs if r[1] - r[0] > W / n * 0.12]
    cnt = alpha_mask.sum(axis=0)
    groups = [list(r) for r in big]
    # 人形黏在一起（中間沒空白）：從最寬的那塊、人形最細的地方切開
    while 0 < len(groups) < n:
        i = max(range(len(groups)), key=lambda k: groups[k][1] - groups[k][0])
        g0, g1 = groups[i]
        if g1 - g0 < W / n * 1.4:
            break
        lo, hi = g0 + int((g1 - g0) * 0.3), g0 + int((g1 - g0) * 0.7)
        cut = lo + int(np.argmin(cnt[lo:hi]))
        groups[i:i + 1] = [[g0, cut], [cut, g1]]
    if len(groups) >= n:
        while len(groups) > n:
            gaps = [groups[i + 1][0] - groups[i][1] for i in range(len(groups) - 1)]
            i = int(np.argmin(gaps))
            groups[i] = [groups[i][0], groups[i + 1][1]]
            del groups[i + 1]
        # 每格的範圍延伸到相鄰兩格中間，把附近的小特效也包進來
        bounds = []
        for i, g in enumerate(groups):
            l = 0 if i == 0 else (groups[i - 1][1] + g[0]) // 2
            r = W if i == len(groups) - 1 else (g[1] + groups[i + 1][0]) // 2
            bounds.append((l, r))
        return bounds, True
    cw = W / n
    return [(int(round(i * cw)), int(round((i + 1) * cw))) for i in range(n)], False


def frame_info(mask, body):
    ys, xs = np.nonzero(mask)
    if len(xs) == 0:
        return None
    rows = mask.sum(axis=1)
    feet = int(np.nonzero(rows > 2)[0].max())
    top = int(ys.min())
    bys, bxs = np.nonzero(body)
    # 身體中心：只看角色本身顏色的像素（道具、特效不算）
    cx = float(np.median(bxs)) if len(bxs) > 50 else float(np.median(xs))
    return dict(left=int(xs.min()), right=int(xs.max()), top=top, feet=feet, cx=cx, area=int(body.sum()))


def process_strip(path, cid, anim, pal, ref_area, base=None, abs_ref=None):
    img = Image.open(path)
    rgba = key_green(img)
    H, W = rgba.shape[:2]
    n = FRAMES_HINT.get(f'{cid}/{anim}') or EXPECTED.get(anim) or max(1, round(W / CELL))
    full = rgba[..., 3] > 24
    bounds, smart = split_frames(body_mask(rgba, pal) if pal is not None else full, n)
    frames = []
    for x0, x1 in bounds:
        sub = rgba[:, x0:x1].copy()
        info = frame_info(sub[..., 3] > 24, body_mask(sub, pal))
        if info is None:
            continue
        frames.append((sub, info))
    pick = FRAME_PICK.get(f'{cid}/{anim}')
    if pick:
        frames = [frames[i] for i in pick if i < len(frames)]
    if not frames:
        return None
    # 依身體面積把這條動作縮放成跟站立時一樣大
    auto = 1.0
    if ref_area and anim != 'idle':
        med = float(np.median([f['area'] for _, f in frames]))
        if med > 0:
            auto = float(np.clip((ref_area / med) ** 0.5, 0.4, 2.5))
            if abs(auto - 1) < 0.06:
                auto = 1.0
    if abs_ref:
        # 這批沒有站立圖：直接跟遊戲裡已經有的站立圖比身體面積，算出縮放
        med = float(np.median([f['area'] for _, f in frames])) or 1
        base, auto = float(np.clip((abs_ref / med) ** 0.5, 0.05, 5)), 1.0
    if base is None:
        # 站立圖：依第一格的身高決定這個角色的縮放，讓站立高度＝STAND_PX
        h0 = frames[0][1]['feet'] - frames[0][1]['top']
        base = STAND_PX / h0 if anim == 'idle' and h0 > 0 else SCALE
    sc = base * auto * STRIP_SCALE.get(f'{cid}/{anim}', 1.0)
    half = max(max(f['cx'] - f['left'], f['right'] - f['cx']) for _, f in frames)
    up = max(f['feet'] - f['top'] for _, f in frames)
    ow = int(np.ceil((2 * half + 2) * sc)) + 2 * PAD
    oh = int(np.ceil((up + 2) * sc)) + PAD
    strip = Image.new('RGBA', (ow * len(frames), oh), (0, 0, 0, 0))
    for k, (sub, f) in enumerate(frames):
        crop = Image.fromarray(sub[f['top']:f['feet'] + 1, f['left']:f['right'] + 1])
        cwid, chei = crop.size
        crop = crop.resize((max(1, round(cwid * sc)), max(1, round(chei * sc))), Image.LANCZOS)
        px = k * ow + round(ow / 2 - (f['cx'] - f['left']) * sc)
        py = oh - crop.size[1]
        strip.alpha_composite(crop, (px, py))
    stand = None
    if anim == 'idle':
        stand = (frames[0][1]['feet'] - frames[0][1]['top']) * sc
    area = float(np.median([f['area'] for _, f in frames]))
    return strip, len(frames), stand, auto, smart, area, base


def crop_transparent(im, pad=8):
    bb = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    if not bb:
        return im
    l, t, r, b = bb
    return im.crop((max(0, l - pad), 0, min(im.width, r + pad), im.height))


def main(dirs):
    man_path = OUT / 'manifest.json'
    man = json.loads(man_path.read_text(encoding='utf-8'))
    man.setdefault('characters', {})
    for g in ('posters', 'portraits', 'select', 'stages'):
        man.setdefault(g, {})
    for d in dirs:
        src = pathlib.Path(d)
        src = src / 'assets' if (src / 'assets').is_dir() else src
        # 角色動作
        for cdir in sorted((src / 'characters').glob('*')) if (src / 'characters').is_dir() else []:
            cid = cdir.name
            entry = man['characters'].get(cid, {})
            outdir = OUT / 'characters' / cid
            outdir.mkdir(parents=True, exist_ok=True)
            files = sorted(cdir.glob('*.png'), key=lambda p: (p.stem != 'idle', p.stem))
            pal, ref_area, base, abs_ref = None, None, None, None
            if files and files[0].stem == 'idle':
                pal = build_palette(key_green(Image.open(files[0])))
            elif files and (outdir / 'idle.webp').exists() and 'idle' in entry:
                # 只補幾個動作：拿遊戲裡現有的站立圖當大小基準
                arr = np.asarray(Image.open(outdir / 'idle.webp').convert('RGBA'))
                pal = build_palette(arr)
                k = entry['idle']['frames']
                fw = arr.shape[1] // k
                abs_ref = float(np.median([body_mask(arr[:, i * fw:(i + 1) * fw], pal).sum() for i in range(k)]))
            for f in files:
                anim = f.stem
                res = process_strip(f, cid, anim, pal, ref_area, base, abs_ref)
                if not res:
                    print('  略過（沒有內容）', f)
                    continue
                strip, n, stand, auto, smart, area, base = res
                if anim == 'idle':
                    ref_area = area
                print(f'    縮放 {auto:.2f}' + ('' if smart else '（平均切格）'), end='')
                outp = outdir / f'{anim}.webp'
                strip.save(outp, 'WEBP', quality=88, method=4)
                entry[anim] = {'sheet': f'assets/characters/{cid}/{anim}.webp', 'frames': n}
                if stand:
                    entry['_standH'] = round(stand, 1)
                print(f'  {cid}/{anim}: {n} 格 → {strip.size}')
            man['characters'][cid] = entry
        # 大絕橫幅：去背後裁掉右邊空白
        for f in sorted((src / 'posters').glob('*.png')) if (src / 'posters').is_dir() else []:
            im = crop_transparent(Image.fromarray(key_green(Image.open(f))))
            im = im.resize((round(im.width * 240 / im.height), 240), Image.LANCZOS)
            (OUT / 'posters').mkdir(exist_ok=True)
            im.save(OUT / 'posters' / f'{f.stem}.webp', 'WEBP', quality=88, method=4)
            man['posters'][f.stem] = f'assets/posters/{f.stem}.webp'
            print('  poster', f.stem, im.size)
        # 頭像（有背景，不去背）
        for f in sorted((src / 'portraits').glob('*.png')) if (src / 'portraits').is_dir() else []:
            im = Image.open(f).convert('RGB').resize((256, 256), Image.LANCZOS)
            (OUT / 'portraits').mkdir(exist_ok=True)
            im.save(OUT / 'portraits' / f'{f.stem}.webp', 'WEBP', quality=88, method=4)
            man['portraits'][f.stem] = f'assets/portraits/{f.stem}.webp'
            print('  portrait', f.stem)
        # 選角立繪：去背、裁切
        for f in sorted((src / 'select').glob('*.png')) if (src / 'select').is_dir() else []:
            im = Image.fromarray(key_green(Image.open(f)))
            bb = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
            if bb:
                im = im.crop(bb)
            im = im.resize((round(im.width * 640 / im.height), 640), Image.LANCZOS)
            (OUT / 'select').mkdir(exist_ok=True)
            im.save(OUT / 'select' / f'{f.stem}.webp', 'WEBP', quality=88, method=4)
            man['select'][f.stem] = f'assets/select/{f.stem}.webp'
            print('  select', f.stem)
        # 劇情關卡的背景元件（街屋、公寓、宮廟有綠幕：去背；天空不去背）
        for f in sorted((src / 'scenery').glob('*.png')) if (src / 'scenery').is_dir() else []:
            if f.stem.endswith('_sky'):
                im = Image.open(f).convert('RGB')
            else:
                im = Image.fromarray(key_green(Image.open(f)))
            if im.width > 2400:
                im = im.resize((2400, round(im.height * 2400 / im.width)), Image.LANCZOS)
            (OUT / 'scenery').mkdir(exist_ok=True)
            im.save(OUT / 'scenery' / f'{f.stem}.webp', 'WEBP', quality=86, method=4)
            man.setdefault('scenery', {})[f.stem] = f'assets/scenery/{f.stem}.webp'
            print('  scenery', f.stem, im.size)
        # 場景、首頁、開場（不去背）
        for f in sorted((src / 'stages').glob('*.png')) if (src / 'stages').is_dir() else []:
            im = Image.open(f).convert('RGB').resize((1920, 1080), Image.LANCZOS)
            (OUT / 'stages').mkdir(exist_ok=True)
            im.save(OUT / 'stages' / f'{f.stem}.jpg', 'JPEG', quality=85, optimize=True, progressive=True)
            man['stages'][f.stem] = f'assets/stages/{f.stem}.jpg'
            print('  stage', f.stem)
    man_path.write_text(json.dumps(man, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('manifest 已更新')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1:])
