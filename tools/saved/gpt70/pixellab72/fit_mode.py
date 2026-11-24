# GPT 도트 그림 읽기(가장 많은 색 판): 먼저 원본 색을 줄여 흐린 가장자리를 없애고, 한 칸 크기 · 시작 자리를 「칸마다 한 색이 차지하는 몫」이 가장 큰 값으로 고른 뒤, 칸마다 가장 많은 색을 그 칸으로.
#   python3 fit_mode.py <큰 그림> <출력 png> <한 칸 어림> [색 수 48]
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, out, c0 = sys.argv[1], sys.argv[2], float(sys.argv[3]); NC = int(sys.argv[4]) if len(sys.argv) > 4 else 48
im = Image.open(src).convert('RGB'); f = im.convert('RGBA')
for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]: ImageDraw.floodfill(f, p, (0, 0, 0, 0), thresh=40)
m = np.asarray(f)[:, :, 3] > 0; rgb = np.asarray(im)
ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]; y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
lab, nl = ndimage.label(m & (rgb.min(-1) >= 246))
for i, sz in enumerate(ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1)), 1):
    yy, xx = np.where(lab == i)
    if sz >= 2500 or sz >= 300 and (xx.mean() > (x0 + x1) / 2 or yy.mean() > y0 + (y1 - y0) * 0.85): m[lab == i] = False
pad = 24; box = (x0 - pad, y0 - pad, x1 + pad, y1 + pad); q = im.crop(box).quantize(NC, method=Image.MEDIANCUT, dither=Image.NONE)
pal = np.array(q.getpalette()[:NC * 3]).reshape(-1, 3); Q = np.asarray(q).astype(int); M = m[box[1]:box[3], box[0]:box[2]]; Q[~M] = NC
H, W = Q.shape
def read(c, px, py, score=False):
    nx, ny = int((W - px) // c), int((H - py) // c); xi = (px + (np.arange(nx)[:, None] + np.linspace(0.2, 0.8, 5)[None]) * c).astype(int).ravel(); yi = (py + (np.arange(ny)[:, None] + np.linspace(0.2, 0.8, 5)[None]) * c).astype(int).ravel()
    S = Q[np.ix_(yi, xi)].reshape(ny, 5, nx, 5).transpose(0, 2, 1, 3).reshape(ny, nx, 25)
    cnt = np.stack([(S == k).sum(-1) for k in range(NC + 1)], -1); mode = cnt.argmax(-1); pur = cnt.max(-1) / 25
    return pur[mode < NC].mean() if score else mode
best = max((read(c, px, py, True), c, px, py) for c in np.arange(c0 - 0.5, c0 + 0.5, 0.05) for px in np.arange(0, c0, 1.5) for py in np.arange(0, c0, 1.5))
_, c, px, py = best; best = max((read(c, a, b, True), c, a, b) for a in np.arange(px - 1.5, px + 1.5, 0.5) for b in np.arange(py - 1.5, py + 1.5, 0.5) if a >= 0 and b >= 0)
mode = read(*best[1:]); o = np.zeros(mode.shape + (4,), np.uint8); k = mode < NC; o[k, :3] = pal[mode[k]]; o[k, 3] = 255
S = Image.fromarray(o); S = S.crop(S.getbbox()); S.save(out); print('한 칸 %.2f · 한 색 몫 %.3f' % (best[1], best[0]), '칸', S.size, '색', len(S.getcolors(999)))
