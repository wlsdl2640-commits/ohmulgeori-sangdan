"""최상급 문양 시안판 (빌드 64, 사용자 11-11 22:17): 동그라미 친 8종 × 문양 A~D + 지금 상급 · 최상급 + 창고 칸 실제 크기
python3 sheet_alts.py [출력.png]  (기본: 이 폴더의 runes_top_glyph_alts.png)"""
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
EFX = {k: (w[0], a[0]) for (k, nm, col, src, w, a, art) in X.MERGED}


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


S = 4; IW = 20 * S; CW = IW + 8; GAP = 18
keys = list(G.ALTS)
W = max(24 + 6 * CW + GAP + 24, 24 + 2 * 310 + 10); BH = 20 + IW + 20 + 14
NOTES = ['돌 모양 · 최상급 재질은 그대로, 안의 문양만 바꿨어요. 왼쪽 둘은 지금(상급 · 최상급), 오른쪽 넷이 새 문양.',
         '흰 테두리 + 룬 색 속을 많이 써서 작은 칸에서도 모양이 뭉개지지 않게 했어요. 하급 ~ 상급 문양은 지금 그대로(최상급만 바뀜).',
         '고르실 때 「강인 B」처럼 알려 주세요. 맨 아래는 창고 칸 실제 크기예요.']
LINES = [ln for t in NOTES for ln in wrap(t, f12, W - 48)]
TOP = 44 + 18 * len(LINES) + 10; FOOT = 30 + ((len(keys) + 1) // 2) * 54 + 20
H = TOP + len(keys) * BH + FOOT
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '최상급 문양 시안 — 동그라미 친 8종 × A · B · C · D', font=b18, fill=GOLD)
for i, t in enumerate(LINES): d.text((24, 44 + i * 18), t, font=f12, fill=INK2)
for r, k in enumerate(keys):
    by = TOP + r * BH; col = G.COL[k]; c = R.hx(col)
    d.text((24, by), f'{G.NAME[k]}의 룬', font=b14, fill=c)
    wf, af = EFX[k]
    d.text((24 + b14.getlength(f'{G.NAME[k]}의 룬') + 8, by + 2), f'무기 {wf} · 방어구 {af}', font=f12, fill=INK2)
    pics = [('지금 상급', X.make(k, col, 2)), ('지금 최상급', X.make(k, col, 3))] + [(f'{"ABCD"[i]} {G.ALTS[k][i][0]}', G.variant(k, i)) for i in range(4)]
    for j, (lab, px) in enumerate(pics):
        x = 24 + j * CW + (GAP if j >= 2 else 0); y = by + 20
        d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL)
        im.alpha_composite(img(px, S), (x, y))
        d.text((x + 1, y + IW + 3), lab, font=f11, fill=INK if j >= 2 else INK2)
y0 = TOP + len(keys) * BH + 4
d.text((24, y0), '창고 칸에 놓으면 (실제 크기 · 지금 최상급 → A · B · C · D)', font=b14, fill=INK)
for r, k in enumerate(keys):
    col = G.COL[k]
    x = 24 + (r % 2) * 310; y = y0 + 26 + (r // 2) * 54
    d.text((x, y + 16), G.NAME[k], font=f12, fill=R.hx(col))
    pics = [X.make(k, col, 3)] + [G.variant(k, i) for i in range(4)]
    for j, px in enumerate(pics):
        cx = x + 44 + j * 50
        d.rectangle([cx, y, cx + 45, y + 45], fill=(70, 50, 26), outline=(220, 160, 50), width=2)
        im.alpha_composite(img(px, 1).resize((40, 40), Image.NEAREST), (cx + 3, y + 3))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_top_glyph_alts.png')
im.save(out); print(out, im.size)
