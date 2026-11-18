"""쓰는 법: python3 scenes.py <훅 페이지> sc reg,boss2 → python3 monmock.py <출력.png> (같은 폴더에서 — sc/에 장면이 있어야 함)
사용자가 보낸 몬스터 리마스터 1(기본) · 2(디테일)를 실제 평원 전투 화면(지금 해상도)에 넣어 본 목업"""
import sys
import numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw, ImageFont
import os
HERE = os.path.dirname(os.path.abspath(__file__))
V1, V2 = os.path.join(HERE, 'plains_mon_v1.png'), os.path.join(HERE, 'plains_mon_v2.png')   # 사용자가 GPT로 만든 리마스터 1(기본) · 2(디테일) — 받은 그대로
IDS = ['rat', 'slime', 'rabbit', 'wolf', 'goblin']
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FB = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FB if b else FR, n, index=2)
GOLD, TXT, SUB, BG = (240, 196, 90), (236, 230, 220), (165, 160, 150), (21, 23, 28)

def seg(path, thresh, shadow=False):
    im = Image.open(path).convert('RGB'); W, H = im.size; bgc = im.getpixel((2, 2)); SEN = (255, 0, 254)
    for x in range(0, W, 16):
        for y in (0, H - 1):
            if sum(abs(p - q) for p, q in zip(im.getpixel((x, y)), bgc)) <= thresh: ImageDraw.floodfill(im, (x, y), SEN, thresh=thresh)
    for y in range(0, H, 16):
        for x in (0, W - 1):
            if sum(abs(p - q) for p, q in zip(im.getpixel((x, y)), bgc)) <= thresh: ImageDraw.floodfill(im, (x, y), SEN, thresh=thresh)
    a = np.array(im).astype(int); fg = ~((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 254))
    if shadow:   # 바닥 그림자(푸른 기가 도는 짙은 회색)를 바탕과 이어진 것만 걷어 낸다 — 테두리(따뜻한 검정)는 남김
        o = np.array(Image.open(path).convert('RGB')).astype(int); R, G, B = o[..., 0], o[..., 1], o[..., 2]
        cand = (R >= 20) & (R <= 50) & (G >= 20) & (G <= 50) & (B >= 26) & (B <= 58) & (B - R >= 3) & (np.abs(R - G) <= 5)
        lab, n = ndimage.label(cand | ~fg)
        edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        fg &= ~np.isin(lab, list(edge))
    near = np.abs(a - np.array(bgc)).sum(axis=2) <= thresh               # 갇힌 바탕 (다리 사이 같은 곳)
    lab, n = ndimage.label(near & fg)
    for i, sz in enumerate(ndimage.sum(near & fg, lab, range(1, n + 1)), 1):
        if sz > 60: fg[lab == i] = False
    holes = ndimage.binary_fill_holes(fg) & ~fg                          # 털 사이 작은 구멍은 그림으로 되돌림
    lab, n = ndimage.label(holes)
    for i, sz in enumerate(ndimage.sum(holes, lab, range(1, n + 1)), 1):
        if sz < 150: fg[lab == i] = True
    lab, n = ndimage.label(fg)                                           # 떨어진 부스러기 떼기
    for i, sz in enumerate(ndimage.sum(fg, lab, range(1, n + 1)), 1):
        if sz < 30: fg[lab == i] = False
    cols = np.where(fg.any(axis=0))[0]; runs = []; s = p = cols[0]
    for x in cols[1:]:
        if x > p + 12: runs.append((s, p)); s = x
        p = x
    runs.append((s, p)); assert len(runs) == 5, runs
    rgba = np.dstack([np.array(Image.open(path).convert('RGB')), (fg * 255).astype(np.uint8)])
    out = []
    for x0, x1 in runs:
        sub = rgba[:, x0:x1 + 1]; ys = np.where(sub[..., 3].any(axis=1))[0]
        out.append(Image.fromarray(sub[ys.min():ys.max() + 1]).transpose(Image.FLIP_LEFT_RIGHT))   # 게임에서는 왼쪽을 본다
    return dict(zip(IDS, out))
S1, S2 = seg(V1, 12), seg(V2, 40, shadow=True)

def bbox(nm, k):
    base = np.array(Image.open(f'sc/{nm}_none.png').convert('RGB')).astype(int)
    a = np.array(Image.open(f'sc/{nm}_{k}.png').convert('RGB')).astype(int)
    ys, xs = np.where(np.abs(a - base).sum(axis=2) > 0); return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

def fit(spr, box):   # 지금 그림과 넓이가 같게 · 논리 픽셀(화면 2×2) 도트로 줄인 뒤 2배
    x0, y0, x1, y1 = box; tw, th = x1 - x0, y1 - y0
    k = ((tw * th) / (spr.width * spr.height)) ** 0.5
    lw, lh = max(1, round(spr.width * k / 2)), max(1, round(spr.height * k / 2))
    small = spr.resize((lw, lh), Image.LANCZOS)
    al = np.array(small)[..., 3]; arr = np.array(small); arr[..., 3] = np.where(al > 110, 255, 0); small = Image.fromarray(arr)
    big = small.resize((lw * 2, lh * 2), Image.NEAREST)
    cx = (x0 + x1) / 2; return big, (round(cx - big.width / 2), y1 - big.height)

def scene(nm, use):
    S = Image.open(f'sc/{nm}_none.png').convert('RGBA')
    items = [(bbox(nm, k), k) for k in use]
    for box, k in sorted(items, key=lambda t: t[0][3]):                  # 먼 것부터
        spr, at = fit(use[k], box); S.alpha_composite(spr, at)
    return S
crop = lambda im: im.crop((0, 200, 480, 400)).resize((960, 400), Image.NEAREST).convert('RGB')
P1 = crop(Image.open('sc/reg_all.png').convert('RGBA'))
P2 = crop(scene('reg', {k: S1[k] for k in IDS}))
P3 = crop(scene('boss2', {'wolf': S2['wolf'], 'rat': S1['rat'], 'slime': S1['slime']}))
def lineup(S, mul, rows):   # 게임 해상도(화면 2×2 = 도트 한 칸)로 줄 세우기
    lines = []
    for row in rows:
        sp = []
        for k in row:
            x0, y0, x1, y1 = bbox('reg', k); spr, _ = fit(S[k], (0, 0, round((x1 - x0) * mul), round((y1 - y0) * mul))); sp.append(spr)
        w = sum(t.width for t in sp) + 10 * (len(sp) + 1); h = max(t.height for t in sp) + 14
        L = Image.new('RGBA', (max(w, 480), h), (40, 44, 54, 255)); x = 10
        for t in sp: L.alpha_composite(t, (x, h - 6 - t.height)); x += t.width + 10
        lines.append(L.crop((0, 0, 480, h)))
    H = sum(l.height for l in lines); out = Image.new('RGBA', (480, H)); y = 0
    for l in lines: out.alpha_composite(l, (0, y)); y += l.height
    return out.resize((960, H * 2), Image.NEAREST).convert('RGB')
L1 = lineup(S1, 1.0, [IDS])
L2 = lineup(S2, 1.5, [['rat', 'slime', 'rabbit'], ['wolf', 'goblin']])

SW = 1000; sh = Image.new('RGB', (SW, 3200), BG); d = ImageDraw.Draw(sh); y = 18
d.text((20, y), '몬스터 리마스터를 지금 평원 전투 화면에 넣으면', font=fnt(30, True), fill=GOLD); y += 48
d.text((20, y), '지금 화면 해상도 그대로 · 몬스터 크기도 지금과 같게 · 도트 한 칸 = 배경 도트 한 칸 · 폰에서 보이는 크기', font=fnt(16), fill=SUB); y += 34
for title, P in [('① 지금 게임 (뭉툭 도트)', P1), ('② 리마스터 1 — 보통 몬스터 다섯 (게임처럼 겹쳐 선다)', P2),
                 ('③ 리마스터 1 하나씩 — 지금 크기 · 같은 해상도', L1),
                 ('④ 우두머리는 리마스터 2 — 우두머리 들늑대(1.5배) 뒤로 들쥐 · 슬라임(리마스터 1)', P3),
                 ('⑤ 리마스터 2 다섯 — 우두머리 크기(1.5배) · 같은 해상도', L2)]:
    d.text((20, y), title, font=fnt(18, True), fill=TXT); y += 30; sh.paste(P, (20, y)); y += P.height + 22
sh = sh.crop((0, 0, SW, y)); sh.save(sys.argv[1]); print(sys.argv[1], sh.size)
for k in IDS: print(k, S1[k].size, S2[k].size)
