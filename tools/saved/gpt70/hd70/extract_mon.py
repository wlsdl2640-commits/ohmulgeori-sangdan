"""곡창지대 몬스터 6종: GPT 스프라이트 판 → 맞춘 장(논리 픽셀) PNG + 닻 — out_mon/<id>/<row>_<i>.png, out_mon/meta.json"""
import json, os, io, base64
import numpy as np
from PIL import Image
from scipy import ndimage
from seg import sheet_path, mag_mask, runs
OUT = 'out_mon'; os.makedirs(OUT, exist_ok=True)
CONF = {
 'rat':       dict(src='fb1e9ce5', bg='mag',  rows=[('idle', 8), ('bite', 8), ('leap', 12)], jump={'leap'}, th=19),
 'rabbit':    dict(src='d5946b77', bg='mag',  rows=[('idle', 8), ('charge', 8), ('jump', 10)], jump={'jump'}, th=24),
 'wolf':      dict(src='d7c600ce', bg='mag',  rows=[('idle', 8), ('bite', 8), ('leap', 10)], jump={'leap'}, th=25),
 'scarecrow': dict(src='c3ff3bc8', bg='mag',  rows=[('idle', 8), ('crow1', 8), ('crow2', 8), ('crow3', 8)], jump=set(), th=40, labels=1, grid=(120, 220.5), norm=False),
 'boar':      dict(src='96a7568a', bg='dark', rows=[('idle', 6), ('walk', 8), ('hornup', 6), ('headbutt', 7), ('charge', 8)], jump=set(), th=26),
 'aboar':     dict(src='572486e4', bg='dark', rows=[('idle', 7), ('walk', 8), ('hornup', 6), ('headbutt', 8), ('charge', 8)], jump=set(), th=32, xmin=165),
}

def load(cf):
    rgb = np.array(Image.open(sheet_path(cf['src'])).convert('RGB')).astype(int)
    if cf['bg'] == 'mag':
        fg = mag_mask(rgb)
        if cf.get('labels'):   # 줄 이름표(짙은 보라 둥근 판 + 흰 글자): 판 안에 거의 다 들어가는 조각은 지운다
            R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
            pm = (R > 40) & (R < 150) & (G < 70) & (B > 50) & (B < 160)
            lb, nb = ndimage.label(pm); sb = ndimage.find_objects(lb); zb = ndimage.sum(pm, lb, range(1, nb + 1))
            box = np.zeros_like(fg)
            for i, s0 in enumerate(sb):
                if zb[i] > 2000: box[max(0, s0[0].start - 3):s0[0].stop + 3, max(0, s0[1].start - 3):s0[1].stop + 3] = True
            lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1)); inb = ndimage.sum(fg & box, lab, range(1, n + 1))
            for i in range(n):
                if inb[i] > 0.6 * sz[i]: fg[lab == i + 1] = False
    else:
        fg = rgb.sum(axis=2) > 45
        def long_runs(M, L):   # 한 줄에 L칸 넘게 이어진 칸 (판 테두리)
            out = np.zeros_like(M)
            for y in range(M.shape[0]):
                r = M[y]; d = np.diff(np.concatenate([[0], r.astype(int), [0]])); st = np.where(d == 1)[0]; en = np.where(d == -1)[0]
                for s0, e0 in zip(st, en):
                    if e0 - s0 > L: out[y, s0:e0] = True
            return out
        line = long_runs(fg, 380) | long_runs(fg.T, 150).T
        fg &= ~ndimage.binary_dilation(line, iterations=2)
        fg = ndimage.binary_closing(fg, iterations=2); fg = ndimage.binary_fill_holes(fg)
    # 나눔 줄 (가로 · 세로로 길게 이어진 칸)
    lab, n = ndimage.label(fg)
    if n:
        sl = ndimage.find_objects(lab)
        for i, s in enumerate(sl, 1):
            h, w = s[0].stop - s[0].start, s[1].stop - s[1].start
            if (w > 600 and h < 14) or (h > 300 and w < 14) or (w > 1200) or (h > 600): fg[lab == i] = False
    if cf.get('xmin'): fg[:, :cf['xmin']] = False
    # 작은 부스러기 떼기 · 판 귀퉁이 장식(왼쪽 · 오른쪽 끝의 작은 조각)
    lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1)); sl = ndimage.find_objects(lab); Wd = fg.shape[1]
    for i, s in enumerate(sz, 1):
        x0, x1 = sl[i - 1][1].start, sl[i - 1][1].stop
        if s < 25 or (s < 400 and (x0 < 40 or x1 > Wd - 40)): fg[lab == i] = False
    return rgb, fg

def row_bands(fg, nrows):
    B = runs(fg.any(axis=1), 8, 20)
    while len(B) > nrows:   # 가장 가까운 두 띠를 잇는다 (머리 위 까마귀 같은 떨어진 조각)
        i = min(range(len(B) - 1), key=lambda k: B[k + 1][0] - B[k][1]); B[i] = [B[i][0], B[i + 1][1]]; del B[i + 1]
    return B

def frames_of(fg, y0, y1, n):
    sub = fg[y0:y1 + 1]; lab, nl = ndimage.label(sub); objs = ndimage.find_objects(lab)
    cols = runs(sub.any(axis=0), 10, 1)
    if GRID is not None: centers = [GRID[0] + GRID[1] * i for i in range(n)]
    elif len(cols) == n: centers = [(a + b) / 2 for a, b in cols]
    else:
        xs = np.where(sub.any(axis=0))[0]; a, b = xs.min(), xs.max(); w = (b - a) / n; centers = [a + w * (i + 0.5) for i in range(n)]
    bounds = [-1e9] + [(centers[i] + centers[i + 1]) / 2 for i in range(n - 1)] + [1e9]
    masks = [np.zeros_like(sub) for _ in range(n)]
    for li, s in enumerate(objs, 1):
        cx = (s[1].start + s[1].stop) / 2
        k = max(0, min(n - 1, int(np.searchsorted(bounds, cx) - 1)))
        masks[k] |= lab == li
    return masks, centers

def scale_band(bfg, brgb, f):   # 줄 판을 f배 (프리멀티플 · 알파 0.5 문턱)
    H0, W0 = bfg.shape; W1, H1 = max(1, int(round(W0 * f))), max(1, int(round(H0 * f)))
    A = bfg.astype(np.float32)
    def rs(ch): return np.array(Image.fromarray(ch.astype(np.float32), 'F').resize((W1, H1), Image.LANCZOS))
    A1 = np.clip(rs(A), 0, 1); P = [rs(brgb[..., c] * A) for c in range(3)]
    col = np.dstack([np.clip(p / np.maximum(A1, 1e-3), 0, 255) for p in P])
    return A1 > 0.5, col.astype(int)

def main_comp(m):
    lab, n = ndimage.label(m)
    if n <= 1: return m
    sz = ndimage.sum(m, lab, range(1, n + 1)); return lab == (int(np.argmax(sz)) + 1)

def prof_box(m):
    xs = np.where(m.any(axis=0))[0]; return m[:, xs.min():xs.max() + 1].sum(axis=0).astype(float), xs.min()
def best_off(pr, pf, rng=70):   # pf를 pr 위에 놓을 왼쪽 끝 차이 o (pr 좌표에서 pf가 o에서 시작)
    best, bo = -1, 0
    for o in range(-rng, rng + 1):
        a0, b0 = max(0, o), min(len(pr), o + len(pf))
        if b0 <= a0: continue
        v = np.minimum(pr[a0:b0], pf[a0 - o:b0 - o]).sum()
        if v > best: best, bo = v, o
    return bo

meta = {}
HS = 2
GRID = None
for mid, cf in CONF.items():
    GRID = cf.get('grid')
    rgb, fg = load(cf); B = row_bands(fg, len(cf['rows']))
    assert len(B) == len(cf['rows']), (mid, B)
    allf = []   # (row, i, mask(줄 좌표 bool), 줄 rgb, dx, 발 줄)
    ref = None; cnt0 = None
    for (rname, n), (y0, y1) in zip(cf['rows'], B):
        bfg, brgb = fg[y0:y1 + 1], rgb[y0:y1 + 1]
        masks, centers = frames_of(bfg, 0, y1 - y0, n)
        cnt = float(np.median([main_comp(m).sum() for m in masks]))
        if cnt0 is None: cnt0 = cnt
        r = (cnt / cnt0) ** 0.5
        if cf.get('norm', True) and abs(r - 1) > 0.06:   # 이 줄만 작게(크게) 그려진 판 → 서 있기 줄 크기로
            f = 1 / r; bfg, brgb = scale_band(bfg, brgb, f)
            masks, centers = frames_of(bfg, 0, bfg.shape[0] - 1, n)
            if GRID is not None: centers = [c * f for c in centers]
            print('  ', mid, rname, 'x%.3f' % f)
        bots = [np.where(m.any(axis=1))[0].max() for m in masks]
        base = bots[0] if rname in cf['jump'] else int(np.median(bots))
        mains = [main_comp(m) for m in masks]
        if ref is None:   # 기준 = 서 있기 첫 장의 몸
            ref = mains[0]; xs = np.where(ref.any(axis=0))[0]; ref_cx = (xs.min() + xs.max()) / 2; ref_p, ref_x0 = prof_box(ref)
        cxs = []
        for i, (m, mm) in enumerate(zip(masks, mains)):
            xs = np.where(mm.any(axis=0))[0]; cx = (xs.min() + xs.max()) / 2
            if rname in cf['jump'] and i > 0: dx = cxs[0][1] - (centers[i] - centers[0])   # 뛰는 장: 첫 장 칸으로 옮기기만 (칸 안에서 움직인 만큼은 그대로)
            else: pf, fx0 = prof_box(mm); dx = ref_x0 + best_off(ref_p, pf) - fx0
            cxs.append((cx, dx))
            allf.append((rname, i, m, brgb, int(round(dx)), base))
    # 모든 장을 닻(기준 몸 가운데 · 발)에 맞춘 좌표로
    boxes = []
    for rname, i, m, brgb, dx, base in allf:
        ys, xs = np.where(m); boxes.append((xs.min() + dx - ref_cx, ys.min() - base, xs.max() + dx - ref_cx, ys.max() - base))
    X0 = min(b[0] for b in boxes); Y0 = min(b[1] for b in boxes); X1 = max(b[2] for b in boxes); Y1 = max(b[3] for b in boxes)
    ys_ref = np.where(ref.any(axis=1))[0]; k = cf['th'] * HS * 1.2 / (ys_ref.max() - ys_ref.min() + 1)   # 화면 픽셀 해상도(논리의 2배) · 조금 크게
    W, H = int(np.ceil((X1 - X0 + 1) * k)) + 2, int(np.ceil((Y1 - Y0 + 1) * k)) + 2
    ax, ay = int(round(-X0 * k)) + 1, int(round(-Y0 * k)) + 1
    os.makedirs(f'{OUT}/{mid}', exist_ok=True); frames = {}
    big_list = []
    for (rname, i, m, brgb, dx, base), b in zip(allf, boxes):
        ys, xs = np.where(m); crop = np.zeros((ys.max() - ys.min() + 1, xs.max() - xs.min() + 1, 4), float)
        sub = brgb[ys.min():ys.max() + 1, xs.min():xs.max() + 1]; mm = m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        crop[..., :3] = sub * mm[..., None]; crop[..., 3] = mm * 255.0
        # 프리멀티플 상태로 줄이기
        big = np.zeros((int((Y1 - Y0 + 1)), int((X1 - X0 + 1)), 4), float)
        ox, oy = int(b[0] - X0), int(b[1] - Y0); big[oy:oy + crop.shape[0], ox:ox + crop.shape[1]] = crop
        im = Image.fromarray(big.astype(np.uint8), 'RGBA')
        pm = Image.fromarray(np.dstack([big[..., :3], big[..., 3]]).astype(np.uint8), 'RGBA')
        tw, th2 = max(1, int(round(big.shape[1] * k))), max(1, int(round(big.shape[0] * k)))
        rgbm = Image.fromarray(big[..., :3].astype(np.uint8)).resize((tw, th2), Image.BOX); al = Image.fromarray(big[..., 3].astype(np.uint8)).resize((tw, th2), Image.BOX)
        R = np.array(rgbm).astype(float); A = np.array(al).astype(float)
        col = np.where(A[..., None] > 0, R * 255.0 / np.maximum(A[..., None], 1), 0)
        out = np.zeros((H, W, 4), np.uint8); a2 = (A > 110)
        out[1:1 + th2, 1:1 + tw, :3] = np.clip(col, 0, 255)[:H - 1, :W - 1] if True else 0; out[1:1 + th2, 1:1 + tw, 3] = (a2 * 255)[:H - 1, :W - 1]
        big_list.append(((rname, i), out))
    # 몬스터마다 색 줄이기 (32색) + 검은 바탕 판은 1칸 테두리
    stack = np.concatenate([o[..., :3][o[..., 3] > 0] for _, o in big_list], axis=0)
    pal_img = Image.fromarray(stack.reshape(-1, 1, 3).astype(np.uint8)).quantize(colors=72, method=Image.Quantize.MEDIANCUT)
    for (rname, i), o in big_list:
        im = Image.fromarray(o[..., :3]).quantize(palette=pal_img, dither=Image.Dither.NONE).convert('RGB')
        o2 = np.dstack([np.array(im), o[..., 3]])
        if cf['bg'] == 'dark':
            a = o2[..., 3] > 0; edge = ndimage.binary_dilation(a) & ~a
            o2[edge] = [26, 18, 14, 255]
        Image.fromarray(o2.astype(np.uint8), 'RGBA').save(f'{OUT}/{mid}/{rname}_{i}.png')
        frames.setdefault(rname, []).append(f'{rname}_{i}.png')
    meta[mid] = {'hs': HS, 'w': W, 'h': H, 'ax': ax, 'ay': ay, 'k': k, 'rows': {r: len(v) for r, v in frames.items()}}
    print(mid, 'canvas', W, H, 'anchor', ax, ay, 'k %.3f' % k, meta[mid]['rows'])
json.dump(meta, open(f'{OUT}/meta.json', 'w'), indent=1)
