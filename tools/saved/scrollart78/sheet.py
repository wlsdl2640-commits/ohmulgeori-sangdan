"""주문서 시안 판: python sheet.py <출력.png>"""
import sys
from PIL import Image, ImageDraw, ImageFont
import scrolls as S
FD = 'C:/Windows/Fonts/'
f11 = ImageFont.truetype(FD + 'malgun.ttf', 11); f12 = ImageFont.truetype(FD + 'malgun.ttf', 12)
f14 = ImageFont.truetype(FD + 'malgunbd.ttf', 14); f18 = ImageFont.truetype(FD + 'malgunbd.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
RQ = [((26, 32, 48), (70, 78, 96)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((64, 36, 90), (147, 86, 204)), ((87, 64, 18), (224, 160, 50))]
RG = {100: 0, 80: 1, 60: 2, 30: 3, 10: 4}


def render(cv, s):
    im = Image.new('RGBA', (20 * s, 20 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in cv.px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=c + (255,))
    return im


def cell(im, x, y, g, icon):
    d = ImageDraw.Draw(im); inner, border = RQ[g]
    d.rectangle([x, y, x + 59, y + 59], fill=inner, outline=border, width=3)
    im.alpha_composite(icon.resize((40, 40), Image.NEAREST), (x + 10, y + 10))


def strip(im, d, x0, y, fn, cat, tint, rc, s):
    cw = 20 * s + 14
    for i, r in enumerate(S.RATES):
        x = x0 + i * cw; ic = render(fn(cat, r, tint, rc), s)
        d.rectangle([x - 2, y, x + 20 * s + 1, y + 2 + 20 * s], fill=(12, 14, 20)); im.alpha_composite(ic, (x, y + 1))
        d.text((x + 30, y + 6 + 20 * s), f'{r}%', font=f12, fill=INK)


S5 = 4; cw = 20 * S5 + 14; half = 5 * cw + 30
W = 40 + 2 * half
n = len(S.SHAPES)
H = 100 + n * (20 * S5 + 62) + 40 + n * 78 + 40 + 2 * (20 * S5 + 62) + 20
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((20, 12), '주문서 그림 시안 — 양피지 두루마리 꼴 다섯 × 확률 색 (게임에는 아직 안 넣음)', font=f18, fill=GOLD)
d.text((20, 42), '왼쪽 「가」 = 양피지는 그대로 두고 끈 · 봉인 · 손잡이 · 테만 확률 색   /   오른쪽 「나」 = 양피지 자체를 확률 색으로 물들임', font=f12, fill=INK2)
d.text((20, 60), '확률 색 1안(레어도와 같은 결): 100 회색 · 80 초록 · 60 파랑 · 30 보라 · 10 금.  30% · 10%는 반짝이 칸을 더함(흐린 빛 없음).  위 표는 모두 「방어구」 갈래 문양', font=f12, fill=INK2)
y = 100
for key, name, fn in S.SHAPES:
    d.text((20, y - 2), f'{key}  {name}', font=f14, fill=INK)
    d.text((20 + half + 220, y), '나 (양피지 물들임)', font=f11, fill=INK2); d.text((240, y), '가 (끈 · 봉인 색)', font=f11, fill=INK2)
    strip(im, d, 20, y + 20, fn, 'armor', False, S.RC1, S5); strip(im, d, 20 + half, y + 20, fn, 'armor', True, S.RC1, S5)
    y += 20 * S5 + 62
d.text((20, y), '갈래 다섯(주무기 칼 · 부장비 방패 · 방어구 갑옷 · 장신구 반지 · 가방 주머니) — 창고 칸 실제 크기 60px, 칸 테는 확률마다 다른 레어도로 가정(100 일반 → 10 전설)', font=f14, fill=INK); y += 30
for key, name, fn in S.SHAPES:
    d.text((20, y + 20), key, font=f18, fill=GOLD)
    x = 50
    for tint in (False, True):
        for ci, (cat, cn) in enumerate(S.CATS):
            r = S.RATES[ci]
            cell(im, x, y, RG[r], render(fn(cat, r, tint), 2)); x += 64
        x += 40
    y += 78
d.text((20, y), '색 2안(우리만의 색: 100 황갈 · 80 청록 · 60 호박 · 30 진홍 · 10 흑금 — 레어도 색과 일부러 다르게) · 「주무기」 문양', font=f14, fill=INK); y += 30
for key, name, fn in (S.SHAPES[0], S.SHAPES[4]):
    d.text((20, y - 4), f'{key}  {name}', font=f12, fill=INK2)
    strip(im, d, 20, y + 14, fn, 'weapon', False, S.RC2, S5); strip(im, d, 20 + half, y + 14, fn, 'weapon', True, S.RC2, S5)
    y += 20 * S5 + 62
im.save(sys.argv[1]); print(im.size)
