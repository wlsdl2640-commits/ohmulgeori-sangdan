"""룬 정리판 (빌드 64, 사용자 11-11 22:02): 한 룬에 두 효과(무기 · 방어구) 19종 × 하급 ~ 최상급
python3 sheet_merge.py [출력.png]  (기본: 이 폴더의 runes_merged_drafts.png)"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import runes as R
import runes_ext as X
FD = os.environ.get('FONT_DIR', '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/')
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
b14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); b18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); CELL = (30, 36, 52); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
GCOL = [INK2, (122, 214, 106), (106, 176, 255), (240, 180, 60)]
GNAME = ['하급', '중급', '상급', '최상급']
WCOL = (255, 168, 110); ACOL = (130, 190, 255)


def fmt(v, u):
    if u == '': return f'+{v:g}'
    if u == 'pp': return f'+{v:g}%p'
    if u == '-%': return f'-{v:g}%'
    return f'+{v:g}%'


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


S = 4; IW = 20 * S; CW = IW + 8; BW = 4 * CW + 22; COLS = 2
E = X.MERGED; ROWS = (len(E) + COLS - 1) // COLS; BH = 22 + IW + 20 + 36 + 14
W = 24 + COLS * BW
notes = ['룬 하나에 효과 둘 — 무기에 새기면 「무기」 효과, 부장비 · 방어구 · 장신구 · 가방에 새기면 「방어구」 효과. 때리는 쪽은 무기, 막는 쪽은 방어구로 나눴어요.',
         '지금 룬 17종은 13종으로 합치고(힘 + 체력 → 강인 · 지능 + 민첩 → 영민 · 공격 + 수호 → 공방 · 마력 + 결계 → 마력 · 정결 → 어둠 …), 새 효과 룬 6종(섬광 · 치유 · 마나 · 폭풍 · 대지 · 성광)을 더해 모두 19종이에요.',
         '그림: 13종은 지금 게임 그림 그대로(공방만 수호 돌 + 공격 검 문양), 새 6종은 같은 결로 새로 그림. 정결의 해 그림은 성광(빛)으로, 어둠은 초승달 그림으로.',
         '값: 하급 · 중급 · 상급은 지금 값, 최상급은 상급의 1.7~1.8배(제안). 가진 룬 · 끼운 룬은 같은 등급의 합친 룬으로 바꿔 드려요.']
lines = [ln for t in notes for ln in wrap(t, f12, W - 48)]
TOP = 44 + 18 * len(lines) + 14; H = TOP + ROWS * BH + 150
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '룬 정리 — 한 룬에 무기 · 방어구 두 효과, 19종 × 하급 · 중급 · 상급 · 최상급 (시안)', font=b18, fill=GOLD)
for i, t in enumerate(lines): d.text((24, 44 + i * 18), t, font=f12, fill=INK2)
for i, (k, nm, col, src, (wf, wv, wu), (af, av, au), art) in enumerate(E):
    bx = 24 + (i % COLS) * BW; by = TOP + (i // COLS) * BH
    c = R.hx(col)
    d.text((bx, by), f'{nm}의 룬', font=b14, fill=c)
    x0 = bx + b14.getlength(f'{nm}의 룬') + 8
    d.text((x0, by + 2), f'← {src}', font=f11, fill=INK2)
    for lv in range(4):
        x = bx + lv * CW; y = by + 20
        d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL)
        im.alpha_composite(img(X.make(k, col, lv), S), (x, y))
        d.text((x + 1, y + IW + 3), GNAME[lv], font=f11, fill=GCOL[lv])
    ty = by + 20 + IW + 20
    d.text((bx, ty), '무기', font=f12, fill=WCOL); d.text((bx + 44, ty), f'{wf}  ' + ' · '.join(fmt(v, wu) for v in wv), font=f12, fill=INK)
    d.text((bx, ty + 18), '방어구', font=f12, fill=ACOL); d.text((bx + 44, ty + 18), f'{af}  ' + ' · '.join(fmt(v, au) for v in av), font=f12, fill=INK)
y = TOP + ROWS * BH + 2
d.text((24, y), '창고 칸에 놓으면 (실제 크기 · 최상급)', font=b14, fill=INK); y += 22
x = 24
for (k, nm, col, *_ ) in E:
    d.rectangle([x, y, x + 45, y + 45], fill=(70, 50, 26), outline=(220, 160, 50), width=2)
    im.alpha_composite(img(X.make(k, col, 3), 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 50
    if x > W - 60: x = 24; y += 52
im = im.crop((0, 0, W, y + 60))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'runes_merged_drafts.png')
im.save(out); print(out, im.size)
