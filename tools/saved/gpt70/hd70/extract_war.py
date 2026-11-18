"""전사 1차 리마스터 판(951d4114) → 동작 장(논리 픽셀) PNG + 닻 — out_war/<row>_<i>.png, out_war/front.png, out_war/meta.json"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage
from seg import sheet_path, runs
OUT = 'out_war'; os.makedirs(OUT, exist_ok=True)
ROWS = [('idle', 8), ('walk', 8), ('run', 8), ('slash', 8), ('upper', 8), ('thrust', 8), ('guard', 8), ('bash', 8), ('hurt', 8), ('death', 8)]
GRIDROW = {'death'}          # 쓰러지는 줄: 칸 자리 그대로 (몸 맞추기 안 함)
TH = 32                      # 서 있기 첫 장 키 (투구 꼭대기 ~ 발)
rgb = np.array(Image.open(sheet_path('951d4114')).convert('RGB')).astype(int)

def long_runs(M, L):
    out = np.zeros_like(M)
    for y in range(M.shape[0]):
        r = M[y]; d = np.diff(np.concatenate([[0], r.astype(int), [0]])); st = np.where(d == 1)[0]; en = np.where(d == -1)[0]
        for s0, e0 in zip(st, en):
            if e0 - s0 > L: out[y, s0:e0] = True
    return out

def mask_of(rgb, x0, x1, y0, y1):
    fg = np.zeros(rgb.shape[:2], bool); fg[y0:y1, x0:x1] = rgb[y0:y1, x0:x1].sum(axis=2) > 45
    line = long_runs(fg, 300) | long_runs(fg.T, 150).T
    fg &= ~ndimage.binary_dilation(line, iterations=2)
    fg = ndimage.binary_closing(fg, iterations=1)
    lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
    for i, s in enumerate(sz, 1):
        if s < 20: fg[lab == i] = False
    # 안쪽 작은 구멍만 메우기 (큰 구멍 = 칼과 몸 사이 같은 바탕은 둔다)
    holes = ndimage.binary_fill_holes(fg) & ~fg; hl, hn = ndimage.label(holes); hs = ndimage.sum(holes, hl, range(1, hn + 1))
    for i, s in enumerate(hs, 1):
        if s <= 30: fg[hl == i] = True
    return fg

fg = mask_of(rgb, 485, 1498, 175, 905)
B = runs(fg.any(axis=1), 6, 15)
assert len(B) == len(ROWS), B

def frames_of(sub, n, centers=None):
    lab, nl = ndimage.label(sub); objs = ndimage.find_objects(lab)
    if centers is None:
        cols = runs(sub.any(axis=0), 8, 6)
        cols = [c for c in cols if c[1] - c[0] > 10]
        assert len(cols) == n, cols
        centers = [(a + b) / 2 for a, b in cols]
    bounds = [-1e9] + [(centers[i] + centers[i + 1]) / 2 for i in range(n - 1)] + [1e9]
    masks = [np.zeros_like(sub) for _ in range(n)]
    for li, s in enumerate(objs, 1):
        cx = (s[1].start + s[1].stop) / 2
        k = max(0, min(n - 1, int(np.searchsorted(bounds, cx) - 1)))
        masks[k] |= lab == li
    return masks, centers

def main_comp(m):
    lab, n = ndimage.label(m)
    if n <= 1: return m
    sz = ndimage.sum(m, lab, range(1, n + 1)); return lab == (int(np.argmax(sz)) + 1)
def prof_box(m, ylo=None):
    mm = m if ylo is None else m[ylo:]
    xs = np.where(mm.any(axis=0))[0]; return mm[:, xs.min():xs.max() + 1].sum(axis=0).astype(float), xs.min()
def best_off(pr, pf, rng=60):
    best, bo = -1, 0
    for o in range(-rng, rng + 1):
        a0, b0 = max(0, o), min(len(pr), o + len(pf))
        if b0 <= a0: continue
        v = np.minimum(pr[a0:b0], pf[a0 - o:b0 - o]).sum()
        if v > best: best, bo = v, o
    return bo

allf = []; ref = None; idle_c = None
for (rname, n), (y0, y1) in zip(ROWS, B):
    sub = fg[y0:y1 + 1]; brgb = rgb[y0:y1 + 1]
    masks, centers = frames_of(sub, n)
    if idle_c is None: idle_c = centers
    bots = [np.where(m.any(axis=1))[0].max() for m in masks]
    base = int(np.median(bots))
    mains = [main_comp(m) for m in masks]
    if ref is None:
        ref = mains[0]; ys = np.where(ref.any(axis=1))[0]; xs = np.where(ref.any(axis=0))[0]
        ref_cx = (xs.min() + xs.max()) / 2; ref_h = ys.max() - ys.min() + 1
        ref_p, ref_x0 = prof_box(ref)
    for i, (m, mm) in enumerate(zip(masks, mains)):
        if rname in GRIDROW and i > 0:
            dx = allf[-i][4] - (idle_c[i] - idle_c[0])   # 첫 장 맞춘 만큼 + 칸 사이 (그 줄 첫 장 dx)
        else:
            pf, fx0 = prof_box(mm); dx = ref_x0 + best_off(ref_p, pf) - fx0
        allf.append((rname, i, m, brgb, int(round(dx)), base))

k = TH / ref_h
boxes = []
for rname, i, m, brgb, dx, base in allf:
    ys, xs = np.where(m); boxes.append((xs.min() + dx - ref_cx, ys.min() - base, xs.max() + dx - ref_cx, ys.max() - base))
X0 = min(b[0] for b in boxes); Y0 = min(b[1] for b in boxes); X1 = max(b[2] for b in boxes); Y1 = max(b[3] for b in boxes)
W, H = int(np.ceil((X1 - X0 + 1) * k)) + 2, int(np.ceil((Y1 - Y0 + 1) * k)) + 2
ax, ay = int(round(-X0 * k)) + 1, int(round(-Y0 * k)) + 1

def shrink(big, k):
    tw, th2 = max(1, int(round(big.shape[1] * k))), max(1, int(round(big.shape[0] * k)))
    R = np.array(Image.fromarray(big[..., :3].astype(np.uint8)).resize((tw, th2), Image.BOX)).astype(float)
    A = np.array(Image.fromarray(big[..., 3].astype(np.uint8)).resize((tw, th2), Image.BOX)).astype(float)
    col = np.where(A[..., None] > 0, R * 255.0 / np.maximum(A[..., None], 1), 0)
    return np.clip(col, 0, 255), A

outs = []
for (rname, i, m, brgb, dx, base), b in zip(allf, boxes):
    ys, xs = np.where(m); crop = np.zeros((ys.max() - ys.min() + 1, xs.max() - xs.min() + 1, 4), float)
    sub = brgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; mm = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    crop[..., :3] = sub * mm[..., None]; crop[..., 3] = mm * 255.0
    big = np.zeros((int(Y1 - Y0 + 1), int(X1 - X0 + 1), 4), float)
    ox, oy = int(b[0] - X0), int(b[1] - Y0); big[oy:oy + crop.shape[0], ox:ox + crop.shape[1]] = crop
    col, A = shrink(big, k)
    o = np.zeros((H, W, 4), np.uint8); h2, w2 = min(H - 1, col.shape[0]), min(W - 1, col.shape[1])
    o[1:1 + h2, 1:1 + w2, :3] = col[:h2, :w2]; o[1:1 + h2, 1:1 + w2, 3] = (A[:h2, :w2] > 100) * 255
    outs.append(((rname, i), o))

# 앞모습 (디자인 칸 「앞」)
fm = mask_of(rgb, 355, 445, 30, 150); fm = main_comp(fm)
ys, xs = np.where(fm); fb = ys.max(); fcx = (xs.min() + xs.max()) / 2
crop = np.zeros((ys.max() - ys.min() + 1, xs.max() - xs.min() + 1, 4), float)
crop[..., :3] = rgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1] * fm[ys.min():ys.max() + 1, xs.min():xs.max() + 1, None]; crop[..., 3] = fm[ys.min():ys.max() + 1, xs.min():xs.max() + 1] * 255.0
kf = TH / (ys.max() - ys.min() + 1); col, A = shrink(crop, kf)
FW, FH = col.shape[1] + 2, col.shape[0] + 2
fo = np.zeros((FH, FW, 4), np.uint8); fo[1:-1, 1:-1, :3] = col; fo[1:-1, 1:-1, 3] = (A > 100) * 255
fax, fay = int(round((fcx - xs.min()) * kf)) + 1, FH - 2

# 색 줄이기 + 1칸 테두리
stack = np.concatenate([o[..., :3][o[..., 3] > 0] for _, o in outs] + [fo[..., :3][fo[..., 3] > 0]], axis=0)
pal = Image.fromarray(stack.reshape(-1, 1, 3).astype(np.uint8)).quantize(colors=40, method=Image.Quantize.MEDIANCUT)
def fin(o):
    im = Image.fromarray(o[..., :3]).quantize(palette=pal, dither=Image.Dither.NONE).convert('RGB')
    o2 = np.dstack([np.array(im), o[..., 3]]).astype(np.uint8)
    a = o2[..., 3] > 0; edge = ndimage.binary_dilation(a) & ~a; o2[edge] = [24, 18, 22, 255]
    return o2
rows = {}
for (rname, i), o in outs:
    Image.fromarray(fin(o), 'RGBA').save(f'{OUT}/{rname}_{i}.png'); rows[rname] = rows.get(rname, 0) + 1
Image.fromarray(fin(fo), 'RGBA').save(f'{OUT}/front.png')
meta = {'w': W, 'h': H, 'ax': ax, 'ay': ay, 'k': k, 'rows': rows, 'front': {'w': FW, 'h': FH, 'ax': fax, 'ay': fay}}
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
print('canvas', W, H, 'anchor', ax, ay, 'k %.3f' % k, rows, 'front', meta['front'])
