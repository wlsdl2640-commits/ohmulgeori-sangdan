# GPT 도트 그림을 「제 도트 칸」 그대로 읽는다(줄이지 않음): 같은 색이 이어지는 길이들로 한 칸 크기를 재고, 칸 가운데 색(가운데값)을 한 칸으로.
#   python3 fit_native.py <큰 그림> <출력 png> [한 칸 픽셀]
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); f = im.convert('RGBA')
for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]: ImageDraw.floodfill(f, p, (0, 0, 0, 0), thresh=40)
m = np.asarray(f)[:, :, 3] > 0; rgb = np.asarray(im).astype(float)
ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]; y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
lab, nl = ndimage.label(m & (rgb.min(-1) >= 246))          # 그림 안에 갇힌 흰 바탕(활과 시위 사이 · 두 발 사이) — 뒤쪽 작은 흰 칸(화살 깃)은 그림
for i, sz in enumerate(ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1)), 1):
    yy, xx = np.where(lab == i)
    if sz >= 2500 or sz >= 300 and (xx.mean() > (x0 + x1) / 2 or yy.mean() > y0 + (y1 - y0) * 0.85): m[lab == i] = False
def runs(a):          # 같은 색이 이어지는 길이(가로 · 세로)
    r = []
    for line in a:
        d = np.where(np.abs(np.diff(line, axis=0)).sum(1) > 60)[0]
        r += list(np.diff(d))
    return np.array([v for v in r if v >= 6])
if len(sys.argv) > 3: c = float(sys.argv[3])
else:
    R = np.r_[runs(rgb[y0:y1:3, x0:x1]), runs(rgb[y0:y1, x0:x1:3].transpose(1, 0, 2))]
    cs = np.arange(10, 26, 0.02); sc = [np.cos(2 * np.pi * R / k).mean() for k in cs]; c = cs[int(np.argmax(sc))]
def phase(g):          # 칸 경계가 색이 바뀌는 자리에 오게
    ph = np.arange(0, c, 0.25); return ph[int(np.argmax([g[np.round(np.arange(p, len(g) - 1, c)).astype(int)].sum() for p in ph]))]
px = phase(np.abs(np.diff(rgb.sum(2), axis=1)).sum(0)[x0:x1]) + 1; py = phase(np.abs(np.diff(rgb.sum(2), axis=0)).sum(1)[y0:y1]) + 1
cx = np.arange(x0 + px - c * 2 + c / 2, x1 + c, c); cy = np.arange(y0 + py - c * 2 + c / 2, y1 + c, c)
o = np.zeros((len(cy), len(cx), 4), np.uint8); q = c * 0.28
for j, yy in enumerate(cy):
    for i, xx in enumerate(cx):
        a, b, l, r = int(max(yy - q, 0)), int(yy + q) + 1, int(max(xx - q, 0)), int(xx + q) + 1; mm = m[a:b, l:r]
        if mm.size and mm.mean() > 0.5: o[j, i, :3] = np.median(rgb[a:b, l:r][mm], axis=0); o[j, i, 3] = 255
S = Image.fromarray(o); S = S.crop(S.getbbox()); S.save(out); print('한 칸 = %.2f픽셀' % c, '칸', S.size, '색', len(S.getcolors(9999)))
