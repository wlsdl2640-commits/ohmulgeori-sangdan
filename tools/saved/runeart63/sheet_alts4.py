"""강인 근육 상체 다시 (배빗근까지) + 최상급 19종 한눈에 (빌드 64, 사용자 11-11 22:49)
python3 sheet_alts4.py [출력.png]  (기본: 이 폴더의 runes_top_glyph_alts4.png)"""
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
    if k == 'str': return G.variant4('str', 0)
    return X.make(k, COL[k], 3)


W = 640
im = Image.new('RGBA', (W, 1100), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '강인의 룬 — 근육 상체 다시 (가슴 · 배빗근 · 복근)', font=b18, fill=GOLD)
notes = ['가슴: 위 두 판 + 가운데 짧은 홈 + 아래 곡선 / 배빗근: 옆구리 톱니 사선 / 복근: 2 × 3 칸 / 양옆에 팔을 붙여 몸으로 보이게.',
         '테 안쪽 어두운 줄까지 넓혀 11칸으로 그렸어요. 흰 바탕 + 붉은 줄이 가운데서 십자로 만나면 적십자 표장처럼 보여서 줄은 갈색으로 바꿨어요.']
y = 42
for t in notes:
    for ln in wrap(t, f12, W - 48): d.text((24, y), ln, font=f12, fill=INK2); y += 17
y += 8
S = 7; IW = 20 * S
x = 24
d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(G.variant3('str', 0), S), (x, y))
d.text((x + 2, y + IW + 4), '지금 A (배빗근 없음)', font=f11, fill=INK2)
for i in range(3):
    x = 24 + (i + 1) * (IW + 12)
    px = G.variant4('str', i)
    d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(px, S), (x, y))
    nm = ['흰 상체 · 갈색 줄', '금빛 상체', '금빛 상체 + 빛'][i]
    d.text((x + 2, y + IW + 4), f'{"ABC"[i]} {nm}', font=f11, fill=INK)
    im.alpha_composite(cell(px), (x, y + IW + 36))
im.alpha_composite(cell(G.variant3('str', 0)), (24, y + IW + 36))
y += IW + 100
d.text((24, y), '생명의 룬 = C 두 겹 하트 (확정)', font=b14, fill=R.hx(COL['hp'])); y += 22
d.rectangle([24, y, 24 + 79, y + 79], fill=CELL); im.alpha_composite(img(G.variant3('hp', G.HP_PICK), 4), (24, y))
im.alpha_composite(cell(G.variant3('hp', G.HP_PICK)), (24 + 92, y + 34))
y += 100
d.text((24, y), '최상급 19종 한눈에 (정한 것 모두 반영 · 강인은 A로 임시)', font=b14, fill=INK); y += 24
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
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_top_glyph_alts4.png')
im.save(out); print(out, im.size)
