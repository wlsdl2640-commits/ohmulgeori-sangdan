"""확률 색 입히기 시안: python rates.py <출력.png>
리본(· 끈 · 술) 칸만 색을 바꾼 것과 양피지 전체를 물들인 것. 색 1안 = 100 회갈 · 80 초록 · 60 파랑 · 30 보라 · 10 금"""
import sys, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
FD = 'C:/Windows/Fonts/'
f12 = ImageFont.truetype(FD + 'malgun.ttf', 12); f14 = ImageFont.truetype(FD + 'malgunbd.ttf', 14); f18 = ImageFont.truetype(FD + 'malgunbd.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
RATE = [(100, (0.08, 0.12)), (80, (0.33, 0.6)), (60, (0.6, 0.65)), (30, (0.77, 0.6)), (10, (0.12, 0.85))]   # (확률, (색상, 채도))
RQ = [((26, 32, 48), (70, 78, 96)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((64, 36, 90), (147, 86, 204)), ((87, 64, 18), (224, 160, 50))]


def hsv(a):
    f = a[..., :3] / 255.0; mx = f.max(-1); mn = f.min(-1); d = mx - mn + 1e-9
    h = np.where(mx == f[..., 0], ((f[..., 1] - f[..., 2]) / d) % 6, np.where(mx == f[..., 1], (f[..., 2] - f[..., 0]) / d + 2, (f[..., 0] - f[..., 1]) / d + 4)) / 6
    return h, (mx - mn) / (mx + 1e-9), mx


def recolor(src, mask_fn, hue, sat, keep_v=True):
    a = np.array(src).astype(float); h, s, v = hsv(a); m = mask_fn(h, s, v) & (a[..., 3] > 0)
    out = a.copy()
    for y, x in zip(*np.where(m)):
        r, g, b = colorsys.hsv_to_rgb(hue, min(1, sat * (0.6 + s[y, x] * 0.6)), v[y, x]); out[y, x, :3] = (r * 255, g * 255, b * 255)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def tint(src, hue, sat):   # 양피지(누런 칸)를 그 색으로
    return recolor(src, lambda h, s, v: (h > 0.05) & (h < 0.17) & (s > 0.15) & (s < 0.75) & (v > 0.35), hue, sat * 0.8)


ribbon_green = lambda h, s, v: (h > 0.2) & (h < 0.48) & (s > 0.2)
ribbon_blue = lambda h, s, v: (h > 0.52) & (h < 0.72) & (s > 0.3)
ribbon_purple = lambda h, s, v: (h > 0.72) & (h < 0.95) & (s > 0.25)
ROWS = [('s_seal_0', ribbon_green, '주문서 A1 · 리본만 확률 색'),
        ('s_open_3', ribbon_blue, '주문서 B4 · 리본만 확률 색'), ('s_open_1', ribbon_blue, '주문서 B2 · 리본만 확률 색'),
        ('s_rods_3', ribbon_purple, '주문서 C4 · 끈 · 술만 확률 색'), ('s_seal_0', None, '주문서 A1 · 양피지 전체를 물들임')]
S = 2; cw = 128 * S + 14
W = 40 + 5 * cw + 5 * 80; RH = 128 * S + 50
im = Image.new('RGBA', (W, 70 + len(ROWS) * RH), BG + (255,)); d = ImageDraw.Draw(im)
d.text((20, 12), '주문서 확률 색 시안 — 픽셀랩 그림에 색만 입힘', font=f18, fill=GOLD)
d.text((20, 40), '100% 회갈 · 80% 초록 · 60% 파랑 · 30% 보라 · 10% 금 (레어도 칸 색과 같은 결)  · 오른쪽 = 게임 칸 72px', font=f12, fill=INK2)
y = 70
for key, mfn, name in ROWS:
    d.text((20, y), name, font=f14, fill=INK); src = Image.open(f'raw/{key}.png').convert('RGBA')
    for i, (r, (hu, sa)) in enumerate(RATE):
        o = recolor(src, mfn, hu, sa) if mfn else tint(src, hu, sa)
        x = 20 + i * cw; d.rectangle([x - 2, y + 20, x + 128 * S + 1, y + 22 + 128 * S], fill=(40, 44, 56))
        im.alpha_composite(o.resize((128 * S, 128 * S), Image.NEAREST), (x, y + 21)); d.text((x + 4, y + 24), f'{r}%', font=f14, fill=GOLD)
        cx = 30 + 5 * cw + i * 80; inner, border = RQ[i]
        d.rectangle([cx, y + 60, cx + 75, y + 135], fill=inner, outline=border, width=2); im.alpha_composite(o.resize((72, 72), Image.LANCZOS), (cx + 2, y + 62))
    y += RH
im.save(sys.argv[1]); print(im.size)
