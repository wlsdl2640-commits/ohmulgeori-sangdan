# GPT 그림을 픽(픽셀랩)에 넣을 크기로: 격자에 맞춰 읽지 않고(GPT 그림에는 고른 격자가 없다) 그대로 줄인 뒤, 원본에서 뽑은 색(56)에 맞춰 흐린 색을 없앤다.
#   python3 fit_scale.py <큰 그림> <출력 png> <키 칸> <캔버스 한 변>   (발 줄 = 캔버스 아래에서 4칸 위)
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, out, H, C = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src).convert('RGB'); f = im.convert('RGBA')
for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]: ImageDraw.floodfill(f, p, (0, 0, 0, 0), thresh=40)
m = np.asarray(f)[:, :, 3] > 0; rgb = np.asarray(im)
ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]; y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
lab, nl = ndimage.label(m & (rgb.min(-1) >= 246))          # 그림 안에 갇힌 흰 바탕(활과 시위 사이 · 두 발 사이)
for i, sz in enumerate(ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1)), 1):
    yy, xx = np.where(lab == i)
    if sz >= 2500 or sz >= 300 and (xx.mean() > (x0 + x1) / 2 or yy.mean() > y0 + (y1 - y0) * 0.85): m[lab == i] = False
S = Image.fromarray(np.dstack([rgb, (m * 255).astype(np.uint8)])).crop((x0, y0, x1, y1))
pal = S.convert('RGB').quantize(56, method=Image.MAXCOVERAGE, dither=Image.NONE)
W = round(S.width * H / S.height); pm = S.convert('RGBa').resize((W, H), Image.BOX).convert('RGBA'); al = pm.getchannel('A').point(lambda v: 255 if v >= 128 else 0)
q = pm.convert('RGB').quantize(palette=pal, dither=Image.NONE).convert('RGBA'); q.putalpha(al)
o = Image.new('RGBA', (C, C), (0, 0, 0, 0)); o.alpha_composite(q, ((C - W) // 2, C - 4 - H)); o.save(out); print('그림', (W, H), '캔버스', C, '색', len(o.getcolors(999)))
