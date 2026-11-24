# GPT가 그린 큰 그림 한 장을 전사 키(칸 수)에 맞춰 다시 찍는다 — mid70/mid_core.py(재질 다수결 · 테 살리기)를 그대로 씀
#   python3 fit_gpt.py <큰 그림> <키 칸 수> <출력 64×64 png> [재질 묶음 수]
import sys, os
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mid70'))
from mid_core import Palette, flat_pixels, down, to_rgba
src, H, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]; G = int(sys.argv[4]) if len(sys.argv) > 4 else 9
im = Image.open(src).convert('RGB'); f = im.convert('RGBA')
for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]: ImageDraw.floodfill(f, p, (0, 0, 0, 0), thresh=40)
m = np.asarray(f)[:, :, 3] > 0; ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]
y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
rgb = np.asarray(im)[y0:y1, x0:x1]; m = m[y0:y1, x0:x1].copy(); c = (y1 - y0) / H
from scipy import ndimage
lab, nl = ndimage.label(m & (rgb.min(-1) >= 246))          # 그림 안에 갇힌 큰 흰 바탕(활과 시위 사이 같은 곳) — 작은 흰 칸(화살 깃)은 그림
for i, sz in enumerate(ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1)), 1):
    if sz >= 2500 or sz >= 300 and np.where(lab == i)[1].mean() > m.shape[1] * 0.45: m[lab == i] = False     # 앞쪽(오른쪽 반)은 작은 것도 — 뒤쪽은 화살 깃
k = int((y1 - y0) * 0.85); m[k:] &= ~(rgb[k:].min(-1) >= 248)          # 두 발 사이에 갇힌 흰 바탕
P = Palette(flat_pixels(rgb, m), groups=G)
foot = np.where(m[-int(c * 3):].any(0))[0]; axp = (foot[0] + foot[-1] + 1) / 2          # 닻 = 발 가운데 · 땅 줄
o, (ax, ay) = down(rgb, m, (-axp, -(y1 - y0)), c, P)
a = to_rgba(o, P.pal); S = Image.new('RGBA', (64, 64), (0, 0, 0, 0)); S.alpha_composite(Image.fromarray(a, 'RGBA'), (31 - ax, 60 - ay)); S.save(out)
print('칸', a.shape[1], a.shape[0], '색', len(S.getcolors(999)), '한 칸 = 판 %.2f픽셀' % c)
