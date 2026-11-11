"""강인 최상급 팔 근육 더 작게(9칸) 넷 + 크기 비교(11 · 10 · 9 · 8칸) + 최상급 19종 한눈에 (빌드 64, 사용자 11-11 23:43 「좀더 작게」)
python3 sheet_alts8.py [출력.png]  (기본: 이 폴더의 runes_top_glyph_alts8.png)"""
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
COL = {k: col for (k, nm, col, *_ ) in X.MERGED}


def wrap(t, font, w):
    out, cur = [], ''
    for word in t.split(' '):
        nx = (cur + ' ' + word).strip()
        if font.getlength(nx) > w and cur: out.append(cur); cur = word
        else: cur = nx
    if cur: out.append(cur)
    return out


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
    if k in G.CHOSEN: return G.chosen(k)
    if k == 'coldres': return G.ice_mix(G.ICE_PICK)
    if k == 'fireres': return G.fire_pick(3)
    if k == 'hp': return G.variant3('hp', G.HP_PICK)
    if k == 'str': return G.variant8('str', 0)
    return X.make(k, COL[k], 3)


W = 640
im = Image.new('RGBA', (W, 1100), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '강인의 룬 — 팔 근육 더 작게 (9칸) A · B · C · D', font=b18, fill=GOLD)
notes = ['팔을 10칸 → 9칸으로 한 번 더 줄이고, 돌의 넓은 아래쪽에 앉혔어요. 위쪽은 붉은 빛이 감싸요.',
         '결은 그대로: 주먹 마디 빛 · 손끝 금, 접힌 금, 알통 꼭대기 빛 · 둥근 그늘 · 아래 곡선, 삼두 그늘. D는 알통 반짝임 · 삼두 결을 더 넣었어요.',
         'A · C 흰빛, B · D 금빛, C는 팔뚝에 금 팔찌. 8칸까지 더 줄일 수 있어요(아래 비교) — 다만 주먹이 2~4칸이라 결은 거의 안 보여요. 고르실 때 「강인 B」 · 「8칸 B」처럼 알려 주세요.']
y = 42
for t in notes:
    for ln in wrap(t, f12, W - 48): d.text((24, y), ln, font=f12, fill=INK2); y += 17
y += 8
S = 7; IW = 20 * S
for i in range(4):
    x = 24 + i * (IW + 12)
    px = G.variant8('str', i)
    d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(px, S), (x, y))
    nm = G.ALTS8['str'][i][0]
    d.text((x + 2, y + IW + 4), f'{"ABCD"[i]} {nm}', font=f11, fill=INK)
    im.alpha_composite(cell(px), (x, y + IW + 22))
    d.text((x + 52, y + IW + 38), '← 실제 크기', font=f11, fill=INK2)
y += IW + 84
d.text((24, y), '크기 비교 (11칸 → 10칸 → 이번 9칸 → 더 작게 8칸)', font=b14, fill=INK); y += 22
row = (('11칸', G.variant6('str', 0)), ('10칸', G.variant7('str', 0)), ('9칸 (이번)', G.variant8('str', 0)), ('8칸', G.variant8('str', 4)),
       ('11칸', G.variant6('str', 1)), ('10칸', G.variant7('str', 1)), ('9칸 (이번)', G.variant8('str', 1)), ('8칸', G.variant8('str', 5)))
for j, (lab, px) in enumerate(row):
    x = 24 + (j % 4) * 70 + (j // 4) * 300
    d.rectangle([x, y, x + 59, y + 59], fill=CELL); im.alpha_composite(img(px, 3), (x, y))
    d.text((x + 1, y + 63), lab, font=f11, fill=INK if '이번' in lab else INK2)
y += 86
d.text((24, y), '최상급 19종 한눈에 (강인은 A로 임시)', font=b14, fill=INK); y += 24
for i, (k, nm, col, *_ ) in enumerate(X.MERGED):
    x = 24 + (i % 7) * 86; yy = y + (i // 7) * 92
    d.rectangle([x, yy, x + 59, yy + 59], fill=CELL); im.alpha_composite(img(top_of(k), 3), (x, yy))
    d.text((x, yy + 64), nm, font=f12, fill=R.hx(col))
y += ((len(X.MERGED) + 6) // 7) * 92 + 4
d.text((24, y), '창고 칸에 놓으면 (실제 크기)', font=b14, fill=INK); y += 24
x = 24
for (k, *_ ) in X.MERGED:
    im.alpha_composite(cell(top_of(k)), (x, y)); x += 50
    if x > W - 60: x = 24; y += 52
im = im.crop((0, 0, W, y + 66))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_top_glyph_alts8.png')
im.save(out); print(out, im.size)
