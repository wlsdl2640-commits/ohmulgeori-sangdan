"""룬 개편 시안판 (빌드 64): 15종 × 하급 · 중급 · 상급 · 최상급 + 무기 · 방어구 효과 + 창고 칸 크기
python3 sheet64.py [출력.png]  (기본: 이 폴더의 rune_drafts64.png)"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import runes64 as R
from kit import hx, mix
FD = os.environ.get('FONT_DIR', '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/')
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
b14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); b18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); CELL = (30, 36, 52); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)


def img(px, s):
    im = Image.new('RGBA', (20 * s, 20 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=tuple(c) + (255,))
    return im


def rng(a, b, m):
    lo, hi = a * m, b * m
    f = (lambda v: f'{v:.0f}') if hi >= 10 else (lambda v: f'{v:.1f}'.rstrip('0').rstrip('.'))
    return f'{f(lo)}~{f(hi)}%'


S = 4; IW = 20 * S; CW = IW + 14; BW = 4 * CW + 18
COLS = 2; ROWS = (len(R.FAMS) + COLS - 1) // COLS; BH = 22 + IW + 36 + 36 + 14
W = 24 + COLS * BW; TOPH = 132; FOOT = 196
H = TOPH + ROWS * BH + FOOT
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '룬 개편 시안 — 원초적인 자연의 조각 15종 × 4등급 (게임에는 아직 안 넣음)', font=b18, fill=GOLD)
lines = ['무기에 새기면 「무기」 효과, 방어구 · 방패 · 장신구에 새기면 「방어구」 효과. 수치는 새길 때 범위 안에서 무작위로 정해진다.',
         '아래 수치는 최상급. 하급 = 최상급의 15% · 중급 30% · 상급 60%  (예: 만년빙 20~50% → 하급 3~8% · 중급 6~15% · 상급 12~30%)',
         '그림: 하급 작고 흐리게 → 중급 또렷하게 → 상급 크고 짙게 + 빛 한 점 → 최상급 깊은 색 + 둘레에 은은한 빛 + 기운 점',
         '세계수의 씨앗 · 만년빙은 말씀하신 최상급. 나머지 이름 · 그림 · 효과는 제안이에요 — 빼거나 바꿀 것을 골라 주세요.']
for i, t in enumerate(lines): d.text((24, 44 + i * 20), t, font=f12, fill=INK2 if i < 3 else INK)
for i, F in enumerate(R.FAMS):
    k, nm, col, wfx, afx, (wr, ar), items = F
    c = hx(col)
    bx = 24 + (i % COLS) * BW; by = TOPH + (i // COLS) * BH
    d.rectangle([bx - 8, by - 6, bx + BW - 22, by + BH - 14], outline=(40, 46, 62), width=1)
    d.text((bx, by), f'{nm}의 룬', font=b14, fill=c)
    for lv in range(4):
        cx = bx + lv * CW; cy = by + 22
        d.rectangle([cx, cy, cx + IW - 1, cy + IW - 1], fill=CELL)
        im.alpha_composite(img(R.icon(i, lv), S), (cx, cy))
        d.text((cx + 1, cy + IW + 4), R.GRADES[lv], font=f11, fill=[INK2, (122, 214, 106), (106, 176, 255), (240, 180, 60)][lv])
        d.text((cx + 1, cy + IW + 19), items[lv][1], font=f11, fill=INK)
    ey = by + 22 + IW + 40
    d.text((bx, ey), '무기', font=f12, fill=(255, 168, 110)); d.text((bx + 44, ey), f'{wfx} +{wr[0]}~{wr[1]}%' if not wfx.endswith('−') else f'{wfx}{wr[0]}~{wr[1]}%', font=f12, fill=INK)
    d.text((bx, ey + 18), '방어구', font=f12, fill=(130, 190, 255)); d.text((bx + 44, ey + 18), f'{afx} +{ar[0]}~{ar[1]}%' if not afx.endswith('−') else f'{afx}{ar[0]}~{ar[1]}%', font=f12, fill=INK)
y = TOPH + ROWS * BH + 4
d.text((24, y), '창고 칸에 놓으면 (실제 크기 · 칸 테 색은 등급: 하급 · 중급 · 상급 · 최상급)', font=b14, fill=INK); y += 24
RQ = [((26, 32, 48), (60, 68, 88)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((70, 50, 26), (220, 160, 50))]
x = 24
for i in (0, 1):
    for lv in range(4):
        inner, border = RQ[lv]
        d.rectangle([x, y, x + 45, y + 45], fill=inner, outline=border, width=2)
        im.alpha_composite(img(R.icon(i, lv), 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 50
    x += 16
y += 56
x = 24
for i in range(len(R.FAMS)):
    inner, border = RQ[3]
    d.rectangle([x, y, x + 45, y + 45], fill=inner, outline=border, width=2)
    im.alpha_composite(img(R.icon(i, 3), 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 50
    if x > W - 60: x = 24; y += 52
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'rune_drafts64.png')
im.save(out); print(out, im.size)
