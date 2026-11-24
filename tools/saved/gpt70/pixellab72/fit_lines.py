# GPT 도트 그림 읽기(칸 줄 찾기 판): GPT는 칸 크기를 조금씩 흘리므로, 색이 바뀌는 자리(세로 · 가로 줄)를 찾아 고르지 않은 격자를 만든 뒤 칸마다 가운데값 색을 읽는다.
#   python3 fit_lines.py <큰 그림> <출력 png> <한 칸 어림 픽셀>
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage, signal
src, out, c = sys.argv[1], sys.argv[2], float(sys.argv[3])
im = Image.open(src).convert('RGB'); f = im.convert('RGBA')
for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]: ImageDraw.floodfill(f, p, (0, 0, 0, 0), thresh=40)
m = np.asarray(f)[:, :, 3] > 0; rgb = np.asarray(im).astype(float)
ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]; y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
lab, nl = ndimage.label(m & (rgb.min(-1) >= 246))
for i, sz in enumerate(ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1)), 1):
    yy, xx = np.where(lab == i)
    if sz >= 2500 or sz >= 300 and (xx.mean() > (x0 + x1) / 2 or yy.mean() > y0 + (y1 - y0) * 0.85): m[lab == i] = False
def lines(prof, a, b):
    g = ndimage.gaussian_filter1d(prof.astype(float), 1.2); pk, _ = signal.find_peaks(g, distance=c * 0.62, prominence=g.max() * 0.03)
    pk = [p for p in pk if a - c <= p <= b + c]; L = [pk[0]]
    for p in pk[1:]:
        gap = p - L[-1]; n = max(1, int(round(gap / c)))
        for k in range(1, n): L.append(L[-1] + gap / n) if False else L.append(pk[pk.index(p) - 1] + gap * k / n)
        L.append(p)
    L = sorted(set(round(v, 2) for v in L))
    while L[0] > a: L.insert(0, L[0] - c)
    while L[-1] < b: L.append(L[-1] + c)
    return L
E = np.abs(np.diff(rgb.sum(2), axis=1)); Ey = np.abs(np.diff(rgb.sum(2), axis=0))
LX = lines(E[y0:y1].sum(0), x0, x1); LY = lines(Ey[:, x0:x1].sum(1), y0, y1)
o = np.zeros((len(LY) - 1, len(LX) - 1, 4), np.uint8)
for j in range(len(LY) - 1):
    for i in range(len(LX) - 1):
        a, b, l, r = LY[j], LY[j + 1], LX[i], LX[i + 1]; ph, pw = (b - a) * 0.22, (r - l) * 0.22
        A, B, Lh, R = int(max(a + ph, 0)), int(b - ph) + 1, int(max(l + pw, 0)), int(r - pw) + 1; mm = m[A:B, Lh:R]
        if mm.size and mm.mean() > 0.5: o[j, i, :3] = np.median(rgb[A:B, Lh:R][mm], axis=0); o[j, i, 3] = 255
S = Image.fromarray(o); S = S.crop(S.getbbox()); S.save(out)
print('칸', S.size, '색', len(S.getcolors(9999)), '칸 너비 %.1f ~ %.1f' % (np.diff(LX).min(), np.diff(LX).max()), '높이 %.1f ~ %.1f' % (np.diff(LY).min(), np.diff(LY).max()))
