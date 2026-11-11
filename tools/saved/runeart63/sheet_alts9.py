"""강인 최상급 주먹 다시(손가락 넷 + 엄지) 넷 + 지난번 비교 + 최상급 19종 한눈에 (빌드 64, 사용자 11-11 23:46 「주먹이 너무 주먹이 아닌것 같아」)
python3 sheet_alts9.py [출력.png]  (기본: 이 폴더의 runes_top_glyph_alts9.png)"""
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
    if k == 'str': return G.variant9('str', 0)
    return X.make(k, COL[k], 3)


W = 640
im = Image.new('RGBA', (W, 1100), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '강인의 룬 — 주먹 다시 (손가락 넷 + 엄지) A · B · C · D', font=b18, fill=GOLD)
notes = ['주먹을 손가락 넷이 보이게 다시 그렸어요 — 손가락 사이 세로 금 셋, 아래에 엄지가 가로질러 감싸요. 윗모서리는 둥글게.',
         '팔(팔뚝 · 알통 · 접힌 금 · 아래 곡선 · 삼두 그늘)은 지난번 9칸 그대로이고, 주먹만 한 줄 늘었어요.',
         'A · C 흰빛, B · D 금빛, C는 팔뚝에 금 팔찌, D는 알통 반짝임 · 삼두 결. 고르실 때 「강인 B」처럼 알려 주세요.']
y = 42
for t in notes:
    for ln in wrap(t, f12, W - 48): d.text((24, y), ln, font=f12, fill=INK2); y += 17
y += 8
S = 7; IW = 20 * S
for i in range(4):
    x = 24 + i * (IW + 12)
    px = G.variant9('str', i)
    d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL); im.alpha_composite(img(px, S), (x, y))
    nm = G.ALTS9['str'][i][0]
    d.text((x + 2, y + IW + 4), f'{"ABCD"[i]} {nm}', font=f11, fill=INK)
    im.alpha_composite(cell(px), (x, y + IW + 22))
    d.text((x + 52, y + IW + 38), '← 실제 크기', font=f11, fill=INK2)
y += IW + 84
d.text((24, y), '지난번 주먹(갈고리)과 비교', font=b14, fill=INK); y += 22
row = (('지난번 A', G.variant8('str', 0)), ('이번 A', G.variant9('str', 0)), ('지난번 B', G.variant8('str', 1)), ('이번 B', G.variant9('str', 1)))
for j, (lab, px) in enumerate(row):
    x = 24 + j * 96 + (12 if j >= 2 else 0)
    d.rectangle([x, y, x + 79, y + 79], fill=CELL); im.alpha_composite(img(px, 4), (x, y))
    d.text((x + 2, y + 83), lab, font=f11, fill=INK if '이번' in lab else INK2)
y += 106
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
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_top_glyph_alts9.png')
im.save(out); print(out, im.size)
