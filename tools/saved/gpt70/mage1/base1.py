"""마법사 기준 자세 판(GPT · 마젠타 바탕 · 한 줄 5장) 확인: 장 나누기 · 전사와 크기 견주기 · 40칸으로 찍어 보기
   python3 base1.py <판 webp> <출력 폴더>      (작업 폴더에 mid_prep/ · out_mid40/ 이 있어야 한다 — 전사 기준)
   → <출력>/m1b_<i>.png(40칸 · 장마다) · meas.json(재 본 값) · 화면에 견준 값"""
import json, os, sys, colorsys
import numpy as np
from PIL import Image
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'mid70'))
from mid_core import Palette, flat_pixels, down, to_rgba, LUM
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
NAMES = ['side', 'front', 'sit', 'sleep', 'hurt']


def key(rgb):   # ../hd70/extract_war16.py load와 같은 바탕 빼기 (마젠타 + 번짐)
    rgb = rgb.astype(int); R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    bg = ((R > 150) & (B > 150) & (G < 120) & (abs(R - B) < 110)) | ((R - G > 55) & (B - G > 55))
    mx = rgb.max(-1); mn = rgb.min(-1); v = mx / 255; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    rc, gc, bc = [(mx - c) / np.maximum(mx - mn, 1) for c in (R, G, B)]
    h = np.where(R == mx, bc - gc, np.where(G == mx, 2 + rc - bc, 4 + gc - rc)); h = (h / 6 % 1) * 360
    fr = (~bg) & (h >= 265) & (h < 330) & (s > 0.3) & (v > 0.15)
    bg |= fr & (v >= 0.45); dk = fr & (v < 0.45); g = rgb[dk].min(axis=1); rgb[dk] = np.stack([g + 6, g, g + 4], axis=1)
    return rgb.astype(np.uint8), ~bg


def poses(fg, n=5):   # 세로 띠 없는 열로 나눈다 (조각이 떨어진 장 — 자는 모자 — 도 한 장으로)
    col = fg.any(0); runs = []; x = 0; W = len(col)
    while x < W:
        if col[x]:
            x0 = x
            while x < W and col[x]: x += 1
            runs.append([x0, x])
        else: x += 1
    while len(runs) > n:   # 가장 좁은 틈을 메운다
        gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]; i = int(np.argmin(gaps)); runs[i][1] = runs[i + 1][1]; del runs[i + 1]
    return runs


def parts(rgb, m):
    """얼굴(살색 덩어리 가운데 가장 높은 것) · 눈(얼굴 안 어두운 칸) · 키"""
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]
    skin = m & (r > 190) & (g > 130) & (g < 215) & (b > 90) & (b < 175) & (r - b > 45)
    lab, n = ndimage.label(skin); sz = ndimage.sum(skin, lab, range(1, n + 1)); big = [i + 1 for i in range(n) if sz[i] > 0.08 * sz.max()]
    tops = {i: np.where(lab == i)[0].min() for i in big}; face = min(tops, key=tops.get); fm = lab == face
    ys, xs = np.where(fm); f0, f1, fx0, fx1 = ys.min(), ys.max(), xs.min(), xs.max()
    L = rgb.astype(float) @ LUM; box = np.zeros_like(m); box[f0:f1 + 1, fx0:fx1 + 1] = True
    eye = box & m & (L < 70) & ndimage.binary_dilation(fm, iterations=3)
    ey = np.where(eye)[0]; Y = np.where(m.any(1))[0]
    return dict(top=int(Y.min()), bot=int(Y.max()), face=[int(f0), int(f1), int(fx0), int(fx1)], eye=float(np.median(ey)) if len(ey) else None)


rgb, fg = key(np.array(Image.open(SRC).convert('RGB')))
lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1)); fg = np.isin(lab, [i + 1 for i in range(n) if sz[i] > 40])   # 잡티 떼기
R = poses(fg); assert len(R) == 5, R
P = []
for k, (x0, x1) in enumerate(R):
    m = fg[:, x0:x1]; ys = np.where(m.any(1))[0]; y0, y1 = ys.min(), ys.max()
    P.append(dict(name=NAMES[k], x=[int(x0), int(x1)], y=[int(y0), int(y1)], rgb=rgb[y0:y1 + 1, x0:x1], m=m[y0:y1 + 1]))
# 전사 기준 (같은 GPT 판 크기 · 서 있기 0번)
REF = json.load(open('mid_prep/ref.json'))['h']; cw = REF / 40
z = np.load('mid_prep/idle.npz'); W0 = parts(z['rgb0'], z['m0'])
wh, we = W0['bot'] - W0['top'] + 1, W0['bot'] - W0['eye']; wfh = W0['face'][1] - W0['face'][0] + 1
print('전사(서 있기): 키 %d · 눈 높이 %d · 얼굴 높이 %d (판 픽셀)  →  40칸에서 키 %.1f · 눈 %.1f칸 (한 칸 = %.2f픽셀)' % (wh, we, wfh, wh / cw, we / cw, cw))
meas = {'warrior': dict(W0, h=int(wh), cell=cw)}
for p in P:
    q = parts(p['rgb'], p['m']) if p['name'] in ('side', 'front', 'hurt') else None
    h = p['y'][1] - p['y'][0] + 1; p['h'] = h
    if q:
        e = q['bot'] - q['eye']; fh = q['face'][1] - q['face'][0] + 1
        print('%-5s 키 %d · 눈 높이 %d · 얼굴 높이 %d  — 전사 눈 높이의 %.2f배 · 얼굴 %.2f배 · 키 %.2f배' % (p['name'], h, e, fh, e / we, fh / wfh, h / wh))
        meas[p['name']] = dict(q, h=int(h))
    else: print('%-5s 키 %d · 너비 %d' % (p['name'], h, p['x'][1] - p['x'][0]))
json.dump(meas, open(f'{OUT}/meas.json', 'w'), indent=1)
# 40칸으로: 한 칸 크기는 「눈 높이를 전사와 같게」(몸 길이를 맞춘다)와 「판 크기 그대로」 둘을 찍어 본다
side = meas['side']; ce = (side['bot'] - side['eye']) / (we / cw)
samp = np.vstack([flat_pixels(p['rgb'], p['m']) for p in P]); rs = np.random.RandomState(1)
PAL = Palette(samp[rs.choice(len(samp), min(len(samp), 150000), replace=False)], groups=10)
for tag, c in (('eye', ce), ('same', cw)):
    for k, p in enumerate(P):
        out, a = down(p['rgb'], p['m'], (0, -p['h']), c, PAL)      # 그림 왼쪽 위 = (0, −키) → 땅 줄 = 칸 경계
        Image.fromarray(to_rgba(out, PAL.pal), 'RGBA').save(f'{OUT}/m1b_{tag}_{k}.png')
    print('%-4s 한 칸 = 판 %.2f픽셀 → 옆 서 있기 %.1f칸 (전사 40칸)' % (tag, c, P[0]['h'] / c))
json.dump({'eye': ce, 'same': cw, 'pal': len(PAL.pal)}, open(f'{OUT}/scale.json', 'w'))
