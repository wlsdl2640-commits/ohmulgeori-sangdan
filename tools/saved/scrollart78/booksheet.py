"""스킬북 계열 시안 판: python booksheet.py <출력.png>"""
import sys
from PIL import Image, ImageDraw, ImageFont
import books78 as B
FD = 'C:/Windows/Fonts/'
f11 = ImageFont.truetype(FD + 'malgun.ttf', 11); f12 = ImageFont.truetype(FD + 'malgun.ttf', 12)
f14 = ImageFont.truetype(FD + 'malgunbd.ttf', 14); f18 = ImageFont.truetype(FD + 'malgunbd.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
RQ = [((26, 32, 48), (70, 78, 96)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((64, 36, 90), (147, 86, 204)), ((87, 64, 18), (224, 160, 50))]


def render(cv, s):
    im = Image.new('RGBA', (20 * s, 20 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in cv.px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=c + (255,))
    return im


def cell(im, x, y, g, icon):
    d = ImageDraw.Draw(im); inner, border = RQ[g]
    d.rectangle([x, y, x + 59, y + 59], fill=inner, outline=border, width=3)
    im.alpha_composite(icon.resize((40, 40), Image.NEAREST), (x + 10, y + 10))

S6 = 5; cw = 20 * S6 + 20
W = 40 + 7 * cw + 20
H = 110 + 2 * (20 * S6 + 70) + 60 + 4 * 76 + 60 + 7 * 0 + 40
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((20, 12), '스킬북 그림 시안 — 1차 계열마다 다른 책 (2 · 3 · 4차 책도 그 계열 모습, 게임에는 아직 안 넣음)', font=f18, fill=GOLD)
d.text((20, 42), '책 꼴 · 크기 · 두께부터 다르게: 전사 두껍고 쇠 덧댐 · 궁수 얇은 수첩 · 마법사 잠금쇠 마도서 · 성직자 흰 경전 · 도적 작은 검은 책 · 짐꾼 두툼한 장부', font=f12, fill=INK2)
d.text((20, 60), '레어도는 칸 테가 보여 준다(책 색은 계열 고정). 차수는 아래 줄처럼 모서리 · 끈 쇠붙이 색(1차 구리 · 2차 은 · 3차 금 · 4차 백금)으로 나눌 수 있다', font=f12, fill=INK2)
y = 100
for vi, lab in ((4, 'A'), (5, 'B')):
    d.text((20, y - 4), f'{lab}안', font=f14, fill=INK)
    for i, L in enumerate(B.LINES):
        fn = L[vi]; x = 20 + i * cw
        if not fn: continue
        d.rectangle([x - 2, y + 16, x + 20 * S6 + 1, y + 18 + 20 * S6], fill=(12, 14, 20)); im.alpha_composite(render(fn(), S6), (x, y + 17))
        d.text((x, y + 22 + 20 * S6), L[1], font=f14, fill=INK)
        txt = L[2] if vi == 4 else L[3]
        d.text((x, y + 40 + 20 * S6), txt[:13], font=f11, fill=INK2); d.text((x, y + 53 + 20 * S6), txt[13:26], font=f11, fill=INK2)
    y += 20 * S6 + 80
d.text((20, y), '차수 쇠붙이 색 (A안, 창고 칸 60px · 칸 테 = 예시 레어도)', font=f14, fill=INK); y += 26
for tr, nm in ((0, '1차(기본)'), (1, '2차 은'), (2, '3차 금'), (3, '4차 백금')):
    d.text((20, y + 20), nm, font=f12, fill=INK2)
    x = 100
    for i, L in enumerate(B.LINES):
        cell(im, x, y, [1, 2, 3, 4][tr], render(L[4](tr), 2)); x += 64
    y += 76
im = im.crop((0, 0, W, y + 20)); im.save(sys.argv[1]); print(im.size)
