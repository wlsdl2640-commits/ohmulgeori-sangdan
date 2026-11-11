"""최상급 문양 셋째 시안 + 지금까지 정한 최상급 19종 (빌드 64, 사용자 11-11 22:42)
python3 sheet_alts3.py [출력.png]  (기본: 이 폴더의 runes_top_glyph_alts3.png)"""
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


def cell(px):
    im = Image.new('RGBA', (46, 46), (70, 50, 26, 255)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 45, 45], outline=(220, 160, 50), width=2)
    im.alpha_composite(img(px, 1).resize((40, 40), Image.NEAREST), (3, 3))
    return im


def top_of(k):
    """지금까지 정한 최상급 그림 (강인 · 생명은 고르는 중이라 셋째 시안 A로 임시)"""
    if k in G.CHOSEN: return G.chosen(k)
    if k == 'coldres': return G.ice_mix(G.ICE_PICK)
    if k == 'fireres': return G.fire_pick(3)
    if k in ('str', 'hp'): return G.variant3(k, 0)
    return X.make(k, G.COL_ALL[k], 3)


G.COL_ALL = {k: col for (k, nm, col, *_ ) in X.MERGED}
W = 640; H = 1300
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '최상급 문양 셋째 시안 + 지금까지 정한 것', font=b18, fill=GOLD)
d.text((24, 40), '강인 = 근육 상체(가슴 · 옆구리 사선 · 복근) 셋, 생명 = 하트 안에 하트 셋. 화염 · 냉기는 말씀대로 정했어요.', font=f12, fill=INK2)
y = 66
for k, title in (('str', '강인의 룬 — 근육 상체 (최상급)'), ('hp', '생명의 룬 — 하트 안에 하트 (최상급)')):
    d.text((24, y), title, font=b14, fill=R.hx(G.COL_ALL[k])); y += 22
    S = 6; IW = 20 * S
    for i in range(3):
        x = 24 + i * (IW + 14)
        px = G.variant3(k, i)
        d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(px, S), (x, y))
        d.text((x + 2, y + IW + 4), f'{"ABC"[i]} {G.ALTS3[k][i][0]}', font=f12, fill=INK)
        im.alpha_composite(cell(px), (x, y + IW + 22))
        d.text((x + 52, y + IW + 38), '← 실제 크기', font=f11, fill=INK2)
    y += IW + 80
d.text((24, y), '화염의 룬 — A 불꽃 돌 + B 불꽃 문양 (확정 · 하급 ~ 최상급)', font=b14, fill=R.hx(G.COL_ALL['fireres'])); y += 22
for lv in range(4):
    x = 24 + lv * 98
    d.rectangle([x, y, x + 79, y + 79], fill=CELL); im.alpha_composite(img(G.fire_pick(lv), 4), (x, y))
    d.text((x + 2, y + 83), GN[lv], font=f11, fill=INK2)
y += 110
d.text((24, y), '최상급 19종 한눈에 (정한 문양 반영 · 강인 · 생명은 A로 임시)', font=b14, fill=INK); y += 24
for i, (k, nm, col, *_ ) in enumerate(X.MERGED):
    x = 24 + (i % 7) * 86; yy = y + (i // 7) * 100
    d.rectangle([x, yy, x + 59, yy + 59], fill=CELL); im.alpha_composite(img(top_of(k), 3), (x, yy))
    d.text((x, yy + 64), nm, font=f12, fill=R.hx(col))
y += ((len(X.MERGED) + 6) // 7) * 100 + 4
d.text((24, y), '창고 칸에 놓으면 (실제 크기)', font=b14, fill=INK); y += 24
x = 24
for (k, *_ ) in X.MERGED:
    im.alpha_composite(cell(top_of(k)), (x, y)); x += 50
    if x > W - 60: x = 24; y += 52
im = im.crop((0, 0, W, y + 70))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_top_glyph_alts3.png')
im.save(out); print(out, im.size)
