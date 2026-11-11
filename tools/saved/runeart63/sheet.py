"""룬 시안판: 17종 × 하급 · 중급 · 상급 + 지금 게임 그림 + 창고 칸 크기"""
import sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, '.')
import runes as R
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
f14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); f18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
OLD = ['..kkkkkk..', '.kgGGGGgk.', '.kG#GG#Gk.', '.kGG##GGk.', '.kG#ll#Gk.', '.kGG##GGk.', '.kG#GG#Gk.', '.kGGGGGGk.', '.kggggggk.', '..kkkkkk..']


def img(px, s, w=20, h=20):
    im = Image.new('RGBA', (w * s, h * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=tuple(c) + (255,))
    return im


def old(col):
    c = R.hx(col); m = {'#': c, 'l': R.lt(c, .45), 'k': (26, 20, 16), 'g': R.hx('#4a4652'), 'G': R.hx('#6e6a78')}
    return {(x, y): m[ch] for y, row in enumerate(OLD) for x, ch in enumerate(row) if ch != '.'}


S = 4; BW = 3 * (20 * S + 8) + 24
COLS = 3; ROWS = (len(R.RUNES) + COLS - 1) // COLS
W = 24 + COLS * BW; H = 100 + ROWS * (20 * S + 56) + 120
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '룬 그림 시안 — 룬마다 돌 모양 · 문양이 다르게 (게임에는 아직 안 넣음)', font=f18, fill=GOLD)
d.text((24, 40), '왼쪽부터 하급(거친 돌 · 흐린 새김 · 깨진 모서리) · 중급(매끈한 돌 · 은 테) · 상급(룬 색 수정 · 금 테 · 빛나는 문양). 빛은 흐림 없이 도트 칸으로만.', font=f12, fill=INK2)
d.text((24, 58), '지금 게임:', font=f12, fill=INK2)
x = 100
for k, nm, col in R.RUNES[:9]:
    im.alpha_composite(img(old(col), 3, 10, 10), (x, 54)); x += 36
d.text((x + 6, 58), '← 모두 같은 꼴, 색만 다름', font=f12, fill=INK2)
y0 = 100
for i, (k, nm, col) in enumerate(R.RUNES):
    cx = 24 + (i % COLS) * BW; cy = y0 + (i // COLS) * (20 * S + 56)
    d.text((cx, cy), nm + '의 룬', font=f14, fill=INK); d.text((cx + 90, cy + 2), R.NOTE[k], font=f11, fill=INK2)
    for lv in range(3):
        px = R.make(k, col, lv)
        bx = cx + lv * (20 * S + 8)
        d.rectangle([bx - 2, cy + 20, bx + 20 * S + 1, cy + 22 + 20 * S], fill=(12, 14, 20))
        im.alpha_composite(img(px, S), (bx, cy + 21))
        d.text((bx + 2, cy + 26 + 20 * S), ['하급', '중급', '상급'][lv], font=f11, fill=INK2)
y = y0 + ROWS * (20 * S + 56) + 4
d.text((24, y), '창고 칸에 놓으면 (실제 크기 · 칸 테는 지금 것)', font=f14, fill=INK); y += 24
RQ = [((26, 32, 48), (44, 52, 70)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184))]
x = 24
for i, (k, nm, col) in enumerate(R.RUNES):
    lv = i % 3
    inner, border = RQ[lv]
    d.rectangle([x, y, x + 45, y + 45], fill=inner, outline=border, width=2)
    im.alpha_composite(img(R.make(k, col, lv), 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 50
    if x > W - 60: x = 24; y += 52
im.save('rune_drafts.png'); print(im.size)
