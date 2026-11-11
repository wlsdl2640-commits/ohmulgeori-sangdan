"""최상급 문양 둘째 시안판 (빌드 64, 사용자 11-11 22:29): 고른 넷 · 강인 · 생명 새 문양 넷 · 화염 돌 모양까지 넷 · 냉기 합침 둘
python3 sheet_alts2.py [출력.png]  (기본: 이 폴더의 runes_top_glyph_alts2.png)"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import runes as R
import runes_ext as X
import glyph_alts as G
FD = os.environ.get('FONT_DIR', '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/')
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
b14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); b18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); CELL = (30, 36, 52); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
GN = ['하급', '중급', '상급', '최상급']


def img(px, s):
    im = Image.new('RGBA', (20 * s, 20 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=tuple(c) + (255,))
    return im


S = 4; IW = 20 * S; CW = IW + 10; W = 24 + 150 + 4 * CW + 40
sections = []
sections.append(('고른 문양 (확정)', [(f'{G.NAME[k]} · {"ABCD"[G.CHOSEN[k]]} {G.ALTS[k][G.CHOSEN[k]][0]}', [G.chosen(k)], k) for k in G.CHOSEN], 'one'))
for k in ('str', 'hp'):
    sections.append((f'{G.NAME[k]}의 룬 — 새 문양 넷 (최상급)', [('지금 최상급', [X.make(k, G.COL[k], 3)], k)] + [(f'{"ABCD"[i]} {G.ALTS2[k][i][0]}', [G.variant2(k, i)], k) for i in range(4)], 'row'))
sections.append(('화염의 룬 — 돌 모양까지 새로 넷 (하급 ~ 최상급 모두 이 모양)', [(f'{"ABCD"[i]} {G.FIRE_ALTS[i][0]}', [G.fire_variant(i, lv) for lv in range(4)], 'fireres') for i in range(4)], 'grades'))
sections.append(('냉기의 룬 — 동그라미 둘(지금 최상급 · C 눈꽃 점)을 합침', [('지금 최상급', [X.make('coldres', G.COL['coldres'], 3)], 'coldres'), ('C 눈꽃 점', [G.variant('coldres', 2)], 'coldres')]
                 + [(G.ICE_MIX[i][0], [G.ice_mix(i)], 'coldres') for i in range(2)], 'row'))
H = 76
for title, items, mode in sections:
    H += 26 + (len(items) * (IW + 26) if mode == 'grades' else IW + 30) + 10
H += 40 + 2 * 54
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '최상급 문양 둘째 시안', font=b18, fill=GOLD)
d.text((24, 40), 'X 친 강인 · 생명은 새 문양 넷, 화염은 돌 모양까지 넷, 냉기는 동그라미 둘을 합침.', font=f12, fill=INK2)
y = 80
d.text((24, 56), '하급 ~ 상급 문양은 그대로(화염만 함께 바뀜). 고르실 때 「강인 B」처럼 알려 주세요.', font=f12, fill=INK2)
for title, items, mode in sections:
    d.text((24, y), title, font=b14, fill=INK); y += 24
    if mode == 'grades':
        for lab, pics, k in items:
            d.text((24, y + IW // 2 - 6), lab, font=f12, fill=INK)
            for lv, px in enumerate(pics):
                x = 24 + 150 + lv * CW
                d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(px, S), (x, y))
                d.text((x + 1, y + IW + 3), GN[lv], font=f11, fill=INK2)
            y += IW + 26
    else:
        for j, (lab, pics, k) in enumerate(items):
            x = 24 + j * CW
            d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(pics[0], S), (x, y))
            for n, ln in enumerate([lab[i:i + 7] for i in range(0, len(lab), 7)][:2]): d.text((x + 1, y + IW + 3 + n * 13), ln, font=f11, fill=INK if j else INK2)
        y += IW + 30
    y += 10
d.text((24, y), '창고 칸에 놓으면 (실제 크기 · 최상급)', font=b14, fill=INK); y += 24
cells = [px for title, items, mode in sections for lab, pics, k in items for px in (pics[-1:] if mode == 'grades' else pics)]
x = 24
for px in cells:
    d.rectangle([x, y, x + 45, y + 45], fill=(70, 50, 26), outline=(220, 160, 50), width=2)
    im.alpha_composite(img(px, 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 50
    if x > W - 60: x = 24; y += 52
im = im.crop((0, 0, W, y + 70))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_top_glyph_alts2.png')
im.save(out); print(out, im.size)
