# GPT 그림 → 픽(픽셀랩)용 또렷한 도트: 원본 색을 32색으로 줄이고(흐린 경계의 중간색은 5칸 가운데값으로 걷음) 줄일 때 칸마다 「가장 많은 색」 하나만 쓴다 — 섞인 색이 없어 픽의 「부드럽게 처리된 픽셀 아트」 경고에 안 걸린다.
#   python3 fit_crisp.py <큰 그림> <출력 png> <키 칸> <캔버스 한 변> [색 수 32]   (발 줄 = 캔버스 아래에서 4칸 위)
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, out, H, C = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); NC = int(sys.argv[5]) if len(sys.argv) > 5 else 32
im = Image.open(src).convert('RGB'); f = im.convert('RGBA')
for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]: ImageDraw.floodfill(f, p, (0, 0, 0, 0), thresh=40)
m = np.asarray(f)[:, :, 3] > 0; rgb = np.asarray(im)
ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]; y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
lab, nl = ndimage.label(m & (rgb.min(-1) >= 246))          # 그림 안에 갇힌 흰 바탕(활과 시위 사이 · 두 발 사이)
for i, sz in enumerate(ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1)), 1):
    yy, xx = np.where(lab == i)
    if sz >= 2500 or sz >= 300 and (xx.mean() > (x0 + x1) / 2 or yy.mean() > y0 + (y1 - y0) * 0.85): m[lab == i] = False
crop = im.crop((x0, y0, x1, y1)); M = m[y0:y1, x0:x1]
q = crop.quantize(NC, method=Image.MAXCOVERAGE, dither=Image.NONE); pal = np.array(q.getpalette()[:NC * 3]).reshape(-1, 3)
Q = np.asarray(q).astype(int); Q[~M] = NC; Q = ndimage.median_filter(Q, size=5)
W = round(crop.width * H / crop.height); sy, sx = crop.height / H, crop.width / W; K = np.full((H, W), NC)
for j in range(H):
    for i in range(W):
        K[j, i] = np.bincount(Q[int(j * sy + sy * 0.15):int((j + 1) * sy - sy * 0.15) + 1, int(i * sx + sx * 0.15):int((i + 1) * sx - sx * 0.15) + 1].ravel(), minlength=NC + 1).argmax()
lite = np.append(pal.min(1) >= 170, False)[K]          # 가장자리에 남은 흰 바탕 부스러기: 바깥에 닿고 밝은 이웃이 하나 이하인 밝은 칸
P = np.pad(K, 1, constant_values=NC); Lp = np.pad(lite, 1)
edge = sum(P[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] == NC for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0))) > 0
nb = sum(Lp[1 + dy:H + 1 + dy, 1 + dx:W + 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx)
K[lite & edge & (nb <= 1)] = NC
o = np.zeros((H, W, 4), np.uint8); k = K < NC; o[k, :3] = pal[K[k]]; o[k, 3] = 255
S = Image.fromarray(o); cv = Image.new('RGBA', (C, C), (0, 0, 0, 0)); cv.alpha_composite(S, ((C - W) // 2, C - 4 - H)); cv.save(out); print('그림', (W, H), '캔버스', C, '색', len(cv.getcolors(999)) - 1)
