"""하늘 판(11-18 20:44 사용자 · 마젠타 바탕): 해 7장 · 보름달 · 구름(작은 · 큰 · 새털) → out_sky/ (화면 픽셀 해상도)"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage
from seg import HERE, mag_mask, runs
OUT = 'out_sky'; os.makedirs(OUT, exist_ok=True)
rgb = np.array(Image.open(os.path.join(HERE, 'sheets/sky_magenta.webp')).convert('RGB')).astype(int)
R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
def cut(mask, y0, y1, x0, x1, gap, k, pre, pick=None):
    m = np.zeros_like(mask); m[y0:y1, x0:x1] = mask[y0:y1, x0:x1]
    lab, n = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, n + 1))
    for i, s in enumerate(sz, 1):
        if s < 40: m[lab == i] = False
    cols = runs(m.any(axis=0), gap, 12); out = []
    for j, (a, b) in enumerate(cols):
        if pick is not None and j not in pick: continue
        sub = m[:, a:b + 1]; ys = np.where(sub.any(axis=1))[0]; t, bt = ys.min(), ys.max() + 1
        big = np.dstack([rgb[t:bt, a:b + 1] * sub[t:bt, :, None], sub[t:bt] * 255]).astype(np.float32)
        tw, th = max(1, round(big.shape[1] * k)), max(1, round(big.shape[0] * k))
        rs = lambda ch: np.array(Image.fromarray(ch, 'F').resize((tw, th), Image.BOX))
        Al = rs(big[..., 3]); C = np.dstack([rs(big[..., c]) for c in range(3)]) * 255 / np.maximum(Al[..., None], 1)
        o = np.dstack([np.clip(C, 0, 255), (Al > 120) * 255]).astype(np.uint8); f = f'{pre}_{len(out)}.png'; Image.fromarray(o, 'RGBA').save(f'{OUT}/{f}'); out.append([f, tw, th])
    return out
sun = (G > 170) & (R - B > 90) & (R > 200)                       # 노란 알맹이 (분홍 빛 번짐은 버린다 — 빛은 게임이 그린다)
moon = (R - G < 28) & (G - B < 60) & (G > 110) & (B - G < 12)         # 크림 · 회색 달 (보랏빛 번짐 빼고)
cl = mag_mask(rgb) & ~((R - G > 25) & (B - G > 10) & (G < 200))   # 구름 밑 자줏빛 번짐도 바탕
def biggest(m):
    lab, n = ndimage.label(m, np.ones((3, 3)))
    out = np.zeros_like(m)
    for sl in ndimage.find_objects(lab):
        sub = lab[sl]; ids, c = np.unique(sub[sub > 0], return_counts=True)
        if c.max() > 300: out[sl] |= ndimage.binary_fill_holes(sub == ids[np.argmax(c)])
    return out
sun = biggest(sun); moon = biggest(moon)
ds = np.where(sun[:110, :760].any(axis=0))[0]; d0 = runs(sun[:110, :760].any(axis=0), 20, 12)[0]
meta = {'sun': cut(sun, 0, 110, 0, 760, 20, 0.62, 'sun', {0, 3}),
        'moon': cut(moon, 0, 110, 780, 1536, 20, 0.5, 'moon', {0}),
        'cloud': cut(cl, 112, 180, 0, 1536, 30, 0.5, 'cs', {0, 2, 4, 6}) + cut(cl, 185, 275, 0, 1536, 20, 0.5, 'cb', {0, 2, 4, 6}) + cut(cl, 280, 345, 0, 1536, 40, 0.5, 'cw', {0, 2, 4})}
json.dump(meta, open(f'{OUT}/meta.json', 'w')); print({k: [(w, h) for _, w, h in v] for k, v in meta.items()})
