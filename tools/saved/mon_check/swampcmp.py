# 늪 몬스터 색 비교판: 원본 | 필터 약 | 필터 강(어두운 칸 끌어올림) — 늪 배경 위 게임 크기 ×2, 맨 앞은 기준(전사 · 멧돼지)
#   python swampcmp.py <출력.png>
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from scipy import ndimage
R = 'D:/work/ohmulgeori-sangdan/tools/saved/'
bg = Image.open(R + 'plx73/bg_swamp/00.png').convert('RGBA')
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 15)
M = [('barkmoth', '나무껍질 나방'), ('vinecoil', '뿌리감개'), ('witch', '늪 주술사'), ('leafwitch', '잎 주술사'), ('caiman', '진흙등 악어'),
     ('salamander', '물도마뱀'), ('swampbrute0', '이끼털 괴물'), ('kelpie', '켈피')]
def filt(im, vb, sb, gam):
    a = np.asarray(im)[:, :, 3] > 0
    rgb = np.asarray(im.convert('RGB')).astype(float) / 255
    if gam != 1: rgb = rgb ** gam   # 어두운 칸을 끌어올림
    x = Image.fromarray((rgb * 255).clip(0, 255).astype(np.uint8))
    x = ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(x).enhance(vb)).enhance(1.08)).enhance(sb)
    o = np.dstack([np.asarray(x), np.asarray(im)[:, :, 3]]).copy()
    ring = ndimage.binary_dilation(a) & ~a; o[ring] = (24, 16, 20, 255)
    return Image.fromarray(o)
V = [('원본', lambda m: m), ('필터 약', lambda m: filt(m, 1.18, 1.25, 1)), ('필터 강', lambda m: filt(m, 1.25, 1.4, 0.72))]
def crop(m): return m.crop(m.getbbox())
cw, ch = 170, 150
ref = [crop(Image.open(R + 'gpt70/pixellab72/war_v2/anim/final/idle/v2/00.png').convert('RGBA')), crop(Image.open(R + 'anim77/first/boar.png').convert('RGBA'))]
W = 150 + len(V) * cw; H = 40 + (len(M) + 1) * ch
c = Image.new('RGBA', (W, H), (28, 31, 38, 255)); d = ImageDraw.Draw(c)
for j, (n, _) in enumerate(V): d.text((150 + j * cw + 60, 12), n, font=F, fill=(240, 200, 120))
def cell(x, y, ims):
    t = bg.crop((40, bg.height - ch, 40 + cw - 6, bg.height)); c.alpha_composite(t, (x, y)); xx = x + 4
    for im in ims:
        c.alpha_composite(im, (xx, y + ch - 12 - im.height)); xx += im.width + 2
y = 36; d.text((8, y + 60), '기준: 전사 · 멧돼지', font=F, fill=(236, 228, 208))
for j in range(len(V)): cell(150 + j * cw, y, ref)
for i, (k, n) in enumerate(M):
    y = 36 + (i + 1) * ch; m = Image.open(R + f'anim74/first/{k}.png').convert('RGBA')
    d.text((8, y + 60), n, font=F, fill=(236, 228, 208))
    for j, (_, f) in enumerate(V):
        im = crop(f(m)); s = min(1, (cw - 10) / im.width, (ch - 16) / im.height)
        if s < 1: im = im.resize((round(im.width * s), round(im.height * s)), Image.NEAREST)
        cell(150 + j * cw, y, [im])
c.resize((W * 2, H * 2), Image.NEAREST).save(sys.argv[1]); print(c.size)
