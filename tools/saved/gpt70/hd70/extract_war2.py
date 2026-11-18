"""전사 1차 추가 줄 (11-18 20:44 사용자 — 마젠타 바탕 한 줄씩): 걷기 8 · 달리기 8 · 앉기 4 · 눕기 4 → out_war2/<줄>_<i>.png + meta.json (화면 픽셀 해상도, 서 있는 키 64)"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage
from seg import HERE, mag_mask, runs
OUT = 'out_war2'; os.makedirs(OUT, exist_ok=True)
ROWS = [('walk', 'warrior1_walk', 8, 'head'), ('run', 'warrior1_run', 8, 'head'), ('sit', 'warrior1_sit', 4, 'full'), ('sleep', 'warrior1_sleep', 4, 'full')]
def prof(m):
    xs = np.where(m.any(axis=0))[0]; return m[:, xs.min():xs.max() + 1].sum(axis=0).astype(float), xs.min()
def best(pr, pf, rng=60):
    b, bo = -1, 0
    for o in range(-rng, rng + 1):
        a0, b0 = max(0, o), min(len(pr), o + len(pf))
        if b0 <= a0: continue
        v = np.minimum(pr[a0:b0], pf[a0 - o:b0 - o]).sum()
        if v > b: b, bo = v, o
    return bo
meta = {}; K0 = None; outs = []
for name, fn, n, how in ROWS:
    rgb = np.array(Image.open(os.path.join(HERE, 'sheets', fn + '.webp')).convert('RGB')).astype(int)
    fg = mag_mask(rgb); lab, nl = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, nl + 1))
    for i, s in enumerate(sz, 1):
        if s < 60: fg[lab == i] = False
    cols = runs(fg.any(axis=0), {'run': 6, 'walk': 20}.get(name, 40), 30); assert len(cols) == n, (name, cols)
    masks = []
    for a, b in cols: m = np.zeros_like(fg); m[:, a:b + 1] = fg[:, a:b + 1]; masks.append(m)
    base = max(np.where(m.any(axis=1))[0].max() for m in masks)   # 땅 줄 = 가장 낮은 발
    tops = [np.where(m.any(axis=1))[0].min() for m in masks]
    if K0 is None: K0 = 64 / float(np.median([base - t + 1 for t in tops]))   # 걷기 줄의 키 → 64
    K = K0 * {'sit': 0.75, 'sleep': 0.85}.get(name, 1)   # 앉기 · 눕기 판은 몸이 더 크게 그려져 있다 (투구 너비로 맞춤)
    HH = int((base - min(tops)) * 0.33)
    ref = None; fr = []
    for i, m in enumerate(masks):
        top = np.where(m.any(axis=1))[0].min()
        pf, x0 = prof(m[top:top + HH] if how == 'head' else m)
        if ref is None: ref = (pf, x0); dx = 0; xs = np.where(m.any(axis=0))[0]; cx = (xs.min() + xs.max()) / 2
        else: dx = ref[1] + best(ref[0], pf) - x0
        fr.append((m, dx))
    bx = [(np.where(m.any(axis=0))[0].min() + dx - cx, np.where(m.any(axis=0))[0].max() + dx - cx, np.where(m.any(axis=1))[0].min() - base) for m, dx in fr]
    X0, X1, Y0 = min(b[0] for b in bx), max(b[1] for b in bx), min(b[2] for b in bx)
    W, H = int(np.ceil((X1 - X0 + 1) * K)) + 3, int(np.ceil((1 - Y0) * K)) + 3; ax, ay = int(round(-X0 * K)) + 1, int(round(-Y0 * K)) + 1
    for i, (m, dx) in enumerate(fr):
        ys, xs = np.where(m); big = np.zeros((int(1 - Y0), int(X1 - X0 + 1), 4), np.float32)
        oy, ox = ys - base - int(Y0), (xs + dx - cx - X0).astype(int); ok = (oy >= 0) & (oy < big.shape[0]) & (ox >= 0) & (ox < big.shape[1])
        big[oy[ok], ox[ok], :3] = rgb[ys[ok], xs[ok]]; big[oy[ok], ox[ok], 3] = 255
        tw, th = int(round(big.shape[1] * K)), int(round(big.shape[0] * K))
        rs = lambda ch: np.array(Image.fromarray(ch, 'F').resize((tw, th), Image.BOX))
        Al = rs(big[..., 3]); C = np.dstack([rs(big[..., c] * big[..., 3] / 255) for c in range(3)]) * 255 / np.maximum(Al[..., None], 1)
        o = np.zeros((H, W, 4), np.uint8); hh, ww = min(H - 1, th), min(W - 1, tw)
        o[1:1 + hh, 1:1 + ww, :3] = np.clip(C[:hh, :ww], 0, 255); o[1:1 + hh, 1:1 + ww, 3] = (Al[:hh, :ww] > 120) * 255
        outs.append((name, i, o))
    meta[name] = {'hs': 2, 'w': W, 'h': H, 'ax': ax, 'ay': ay, 'n': n}
    print(name, W, H, ax, ay, 'k %.3f' % K)
stack = np.concatenate([o[..., :3][o[..., 3] > 0] for _, _, o in outs])
pal = Image.fromarray(stack.reshape(-1, 1, 3)).quantize(colors=128, method=Image.Quantize.MEDIANCUT)
for name, i, o in outs:
    im = np.array(Image.fromarray(o[..., :3]).quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB'))
    Image.fromarray(np.dstack([im, o[..., 3]]).astype(np.uint8), 'RGBA').save(f'{OUT}/{name}_{i}.png')
json.dump(meta, open(f'{OUT}/meta.json', 'w'))
