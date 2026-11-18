"""전사 1차 스킬 판(4ea8aeea) → 스킬 그림 34×40 (육각 안) + 스킬 동작 띠 7장 — out_sk/"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage
from seg import sheet_path, runs
OUT = 'out_sk'; os.makedirs(OUT, exist_ok=True)
rgb = np.array(Image.open(sheet_path('4ea8aeea')).convert('RGB')).astype(int)
L = [84, 150, 215, 280, 342, 403, 470, 535, 598, 660, 722, 788, 853, 922]
IDS = ['bash', 'taunt', 'ironwall', 'ironskin', 'sweep', 'berserk', 'riposte', 'resolve', 'earthsplit', 'shockwave', 'warcry', 'guardian', 'titanblow']
TH = 32
BOX = json.load(open('sk_boxes.json'))
# ── 스킬 그림: 틀 안쪽 → 36줄 높이로 줄여 가운데 34칸 · 위아래는 바탕 색
icons = {}
for sid in IDS:
    x0, y0, x1, y1 = BOX[sid]; ins = 5
    inner = rgb[y0 + ins:y1 - ins, x0 + ins:x1 - ins].astype(np.uint8)
    h, w = inner.shape[:2]; th = 36; tw = int(round(w * th / h))
    im = Image.fromarray(inner).resize((tw, th), Image.LANCZOS)
    cx = (tw - 34) // 2; im = im.crop((cx, 0, cx + 34, th))
    edge = np.concatenate([inner[0], inner[-1], inner[:, 0], inner[:, -1]]); bg = tuple(int(v) for v in np.median(edge, axis=0))
    can = Image.new('RGB', (34, 40), bg); can.paste(im, (0, 2))
    q = can.quantize(colors=48, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    can = q.convert('RGB'); can.save(f'{OUT}/icon_{sid}.png'); icons[sid] = 1
# ── 스킬 동작 띠
mx = rgb.max(axis=2); mn = rgb.min(axis=2); sat = (mx - mn) / np.maximum(mx, 1)
solid = (rgb.sum(axis=2) > 45) & ~((mx < 110) & (sat > 0.45))
def clean(m):
    lab, n = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, n + 1))
    for i, s in enumerate(sz, 1):
        if s < 12: m[lab == i] = False
    holes = ndimage.binary_fill_holes(m) & ~m; hl, hn = ndimage.label(holes); hs = ndimage.sum(holes, hl, range(1, hn + 1))
    for i, s in enumerate(hs, 1):
        if s <= 30: m[hl == i] = True
    return m
def main_comp(m):
    lab, n = ndimage.label(m)
    if n <= 1: return m
    sz = ndimage.sum(m, lab, range(1, n + 1)); return lab == (int(np.argmax(sz)) + 1)
def prof_box(m):
    xs = np.where(m.any(axis=0))[0]; return m[:, xs.min():xs.max() + 1].sum(axis=0).astype(float), xs.min()
def best_off(pr, pf, rng=50):
    best, bo = -1, 0
    for o in range(-rng, rng + 1):
        a0, b0 = max(0, o), min(len(pr), o + len(pf))
        if b0 <= a0: continue
        v = np.minimum(pr[a0:b0], pf[a0 - o:b0 - o]).sum()
        if v > best: best, bo = v, o
    return bo
# 전사 기본 판(951d4114)의 몸 색 — 리마스터 전사 장에서 모은다 (테두리 색 빼고)
import glob
_wc = np.concatenate([np.array(Image.open(f).convert('RGBA')).reshape(-1, 4) for f in glob.glob('out_war/*.png')])
_wc = np.unique(_wc[(_wc[:, 3] > 0) & ~((_wc[:, 0] == 24) & (_wc[:, 1] == 18) & (_wc[:, 2] == 22))][:, :3], axis=0).astype(float)
_wc = np.concatenate([_wc, [[14, 10, 12], [30, 22, 22], [44, 30, 26]]])   # 어두운 선 · 그늘
def WPAL_D(img):
    fl = img.reshape(-1, 3).astype(float); best = np.full(len(fl), 1e9)
    for c in _wc: best = np.minimum(best, np.sqrt(((fl - c) ** 2).sum(axis=1)))
    return best.reshape(img.shape[:2])
allf = []; RH = []
for r, sid in enumerate(IDS):
    y0, y1 = L[r] + 3, L[r + 1] - 2
    sub = clean(solid[y0:y1, 600:1258].copy()); brgb = rgb[y0:y1, 600:1258]
    lab, n = ndimage.label(sub); objs = ndimage.find_objects(lab); sz = ndimage.sum(sub, lab, range(1, n + 1))
    keep = np.isin(lab, [j + 1 for j, s in enumerate(sz) if s > 150])
    cols = runs(keep.any(axis=0), 6, 8); assert len(cols) == 7, (sid, cols)
    centers = [(a + b) / 2 for a, b in cols]
    bounds = [-1e9] + [(centers[i] + centers[i + 1]) / 2 for i in range(6)] + [1e9]
    masks = [np.zeros_like(sub) for _ in range(7)]
    for li, s in enumerate(objs, 1):
        cx = (s[1].start + s[1].stop) / 2; k = max(0, min(6, int(np.searchsorted(bounds, cx) - 1))); masks[k] |= lab == li
    mains = [main_comp(m) for m in masks]
    ref = mains[0]; ys = np.where(ref.any(axis=1))[0]; xs = np.where(ref.any(axis=0))[0]
    ref_cx = (xs.min() + xs.max()) / 2; ref_h = ys.max() - ys.min() + 1; base = ys.max()
    ref_p, ref_x0 = prof_box(ref); RH.append(ref_h)
    for i, (m, mm) in enumerate(zip(masks, mains)):
        pf, fx0 = prof_box(mm); dx = ref_x0 + best_off(ref_p, pf) - fx0 if i else 0
        allf.append([sid, i, m, brgb, dx, base, ref_cx, 0])
KK = TH / float(np.median(RH)); print('ref heights', RH, 'k %.3f' % KK)
for f in allf:
    sid, i, m, brgb, dx, base, rcx, _ = f; f[7] = KK
    # 몸 칸 (닻에서 x −15 ~ +17, y −35 ~ +1 논리 픽셀) 밖: 밝은 빛(가장 밝은 채널 > 130)만 남긴다
    yy, xx = np.mgrid[0:m.shape[0], 0:m.shape[1]]
    lx = (xx + dx - rcx) * KK; ly = (yy - base) * KK
    inb = (lx > -15) & (lx < 17) & (ly > -35) & (ly < 2)
    bright = brgb.max(axis=2) > 130
    # 몸 칸 안: 전사 기본 판의 색과 가까운 칸(몸) 또는 밝은 빛 · 밖: 밝은 빛만
    near = WPAL_D(brgb) < 34
    base_m = brgb.sum(axis=2) > 45
    f[2] = (base_m & inb & (near | bright)) | (m & ~inb & bright)
    f.append(inb)
# 모든 장 → 닻 기준 좌표 (스킬마다 k가 조금 다르다)
boxes = []
for sid, i, m, brgb, dx, base, rcx, k, inb in allf:
    ys, xs = np.where(m); boxes.append(((xs.min() + dx - rcx) * k, (ys.min() - base) * k, (xs.max() + dx - rcx) * k, (ys.max() - base) * k))
X0 = min(b[0] for b in boxes); Y0 = min(b[1] for b in boxes); X1 = max(b[2] for b in boxes); Y1 = max(b[3] for b in boxes)
W, H = int(np.ceil(X1 - X0)) + 4, int(np.ceil(Y1 - Y0)) + 4; ax, ay = int(round(-X0)) + 2, int(round(-Y0)) + 2
outs = []
for (sid, i, m, brgb, dx, base, rcx, k, inb), b in zip(allf, boxes):
    ys, xs = np.where(m); x0, x1, yy0, yy1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    P = (brgb[yy0:yy1, x0:x1] * m[yy0:yy1, x0:x1, None]).astype(np.float32); A = m[yy0:yy1, x0:x1].astype(np.float32)
    # 닻에 맞춘 큰 판에 놓고 한 번에 줄이기: 원래 좌표 (x + dx − rcx, y − base)
    gx0 = int(np.floor((x0 + dx - rcx) )); gy0 = int(yy0 - base)
    big_w, big_h = int(np.ceil((W) / k)) + 4, int(np.ceil((H) / k)) + 4
    big = np.zeros((big_h, big_w, 4), np.float32); ox = int(round(gx0 + ax / k)); oy = int(round(gy0 + ay / k))
    big[oy:oy + P.shape[0], ox:ox + P.shape[1], :3] = P; big[oy:oy + P.shape[0], ox:ox + P.shape[1], 3] = A * 255
    IB = np.zeros((big_h, big_w), np.float32); IB[oy:oy + P.shape[0], ox:ox + P.shape[1]] = inb[yy0:yy1, x0:x1]
    tw, th2 = int(round(big_w * k)), int(round(big_h * k))
    def rs(ch): return np.array(Image.fromarray(ch, 'F').resize((tw, th2), Image.BOX))
    R = np.dstack([rs(big[..., c]) for c in range(3)]); Al = rs(big[..., 3])
    col = np.where(Al[..., None] > 0, R * 255.0 / np.maximum(Al[..., None], 1), 0)
    o = np.zeros((H, W, 4), np.uint8); hh, ww = min(H, th2), min(W, tw)
    o[:hh, :ww, :3] = np.clip(col[:hh, :ww], 0, 255); o[:hh, :ww, 3] = (Al[:hh, :ww] > 100) * 255
    ib = np.zeros((H, W), bool); ib[:hh, :ww] = rs(IB * 255)[:hh, :ww] > 127
    outs.append(((sid, i), o, ib))
stack = np.concatenate([o[..., :3][o[..., 3] > 0] for _, o, _ in outs], axis=0)
pal = Image.fromarray(stack.reshape(-1, 1, 3).astype(np.uint8)).quantize(colors=56, method=Image.Quantize.MEDIANCUT)
for (sid, i), o, ib in outs:
    im = Image.fromarray(o[..., :3]).quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    o2 = np.dstack([np.array(im), o[..., 3]]).astype(np.uint8); a = o2[..., 3] > 0
    body = a & ndimage.binary_dilation(ib, iterations=1)
    e = ndimage.binary_dilation(body) & ~a; o2[e] = [24, 18, 22, 255]
    Image.fromarray(o2, 'RGBA').save(f'{OUT}/{sid}_{i}.png')
json.dump({'w': W, 'h': H, 'ax': ax, 'ay': ay, 'ids': IDS, 'n': 7}, open(f'{OUT}/meta.json', 'w'), indent=1)
print('canvas', W, H, 'anchor', ax, ay)
