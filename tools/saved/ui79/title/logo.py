"""첫 화면 제목 글자 시안 셋 (게임 글꼴 갈무리11 굵게를 작은 칸으로 찍어 키운 도트) — python logo.py"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FB = ImageFont.truetype('C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/Galmuri11-Bold.ttf', 22); FS = ImageFont.truetype('C:/Users/wlsdl/AppData/Local/Temp/claude/bf0cecbd3cd9607d/7c79a6ea-5ef1-47ef-8d7e-b2f3accec304/scratchpad/Galmuri11-Bold.ttf', 11)
def mask(txt, f):
    w, h = f.getbbox(txt)[2] + 4, f.getbbox(txt)[3] + 4; im = Image.new('L', (w, h)); ImageDraw.Draw(im).text((2, 1), txt, font=f, fill=255)
    return np.array(im) > 110
def grow(m, r=1):
    o = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1): o |= np.roll(np.roll(m, dy, 0), dx, 1)
    return o
def paint(m, pal, out_r=2, shade=True):
    H, W = m.shape; P = np.zeros((H + 8, W + 8, 4), np.uint8); M = np.zeros((H + 8, W + 8), bool); M[4:4 + H, 4:4 + W] = m
    o2 = grow(M, out_r); o1 = grow(M, 1)
    P[o2] = pal['out']; P[o1 & ~M] = pal['rim']
    ys = np.arange(H + 8)[:, None] * np.ones((1, W + 8)); top = ys.min(); 
    rows = np.where(M.any(1))[0]; y0, y1 = rows.min(), rows.max()
    for y in range(y0, y1 + 1):
        t = (y - y0) / max(1, y1 - y0); c = pal['hi'] if t < .3 else pal['mid'] if t < .65 else pal['lo']
        P[y][M[y]] = c
    if shade:   # 글자 왼쪽 위 테에 빛
        edge = M & ~np.roll(M, 1, 0); P[edge] = pal['spark']
    return Image.fromarray(P, 'RGBA')
def up(im, k): return im.resize((im.width * k, im.height * k), Image.NEAREST)
GOLD = dict(out=(30, 12, 6, 255), rim=(120, 40, 20, 255), hi=(255, 236, 150, 255), mid=(246, 190, 70, 255), lo=(200, 120, 40, 255), spark=(255, 255, 230, 255))
STONE = dict(out=(10, 12, 20, 255), rim=(60, 66, 84, 255), hi=(214, 220, 230, 255), mid=(150, 160, 178, 255), lo=(96, 104, 124, 255), spark=(240, 246, 255, 255))
IRONR = dict(out=(20, 8, 6, 255), rim=(90, 20, 16, 255), hi=(255, 200, 160, 255), mid=(220, 70, 40, 255), lo=(150, 30, 20, 255), spark=(255, 240, 210, 255))
big = mask('라비린토스', FB); small = mask('미 궁 도 시', FS)
def logoA():   # 금 글자 + 진홍 리본(작은 글)
    L = up(paint(big, GOLD), 4); s = up(paint(small, dict(GOLD, hi=(255, 244, 210, 255), mid=(255, 230, 170, 255), lo=(230, 190, 120, 255))), 3)
    W = L.width + 40; im = Image.new('RGBA', (W, L.height + s.height + 30)); d = ImageDraw.Draw(im)
    rw = s.width + 80; rx = (W - rw) // 2; d.rectangle((rx, 4, rx + rw, s.height + 12), fill=(140, 28, 24, 255), outline=(40, 8, 6, 255), width=4)
    d.polygon([(rx, 4), (rx - 24, s.height // 2 + 8), (rx, s.height + 12)], fill=(110, 20, 18, 255)); d.polygon([(rx + rw, 4), (rx + rw + 24, s.height // 2 + 8), (rx + rw, s.height + 12)], fill=(110, 20, 18, 255))
    im.alpha_composite(s, ((W - s.width) // 2, 8)); im.alpha_composite(L, ((W - L.width) // 2, s.height + 18)); return im
def logoB():   # 돌 글자 + 금 룬 밑줄
    L = up(paint(big, STONE), 4); s = up(paint(small, GOLD), 3); W = L.width + 40; im = Image.new('RGBA', (W, L.height + s.height + 40)); d = ImageDraw.Draw(im)
    im.alpha_composite(L, ((W - L.width) // 2, 0)); y = L.height + 6
    d.rectangle((20, y, W - 20, y + 4), fill=(246, 190, 70, 255)); [d.rectangle((x, y - 4, x + 8, y + 8), fill=(255, 220, 120, 255)) for x in (20, W // 2 - 4, W - 28)]
    im.alpha_composite(s, ((W - s.width) // 2, y + 14)); return im
def logoC():   # 달군 쇠 글자 + 쇠 판
    L = up(paint(big, IRONR), 4); s = up(paint(small, STONE), 3); W = L.width + 60; H = L.height + s.height + 50
    im = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W - 1, H - 1), fill=(52, 58, 66, 255), outline=(14, 16, 20, 255), width=6); d.rectangle((10, 10, W - 11, H - 11), outline=(120, 130, 140, 255), width=2)
    for x, y in ((18, 18), (W - 28, 18), (18, H - 28), (W - 28, H - 28)): d.rectangle((x, y, x + 10, y + 10), fill=(160, 170, 180, 255), outline=(14, 16, 20, 255), width=2)
    im.alpha_composite(s, ((W - s.width) // 2, 18)); im.alpha_composite(L, ((W - L.width) // 2, s.height + 30)); return im
for k, f in (('A', logoA), ('B', logoB), ('C', logoC)): f().save(f'logo_{k}.png')
print('ok')
