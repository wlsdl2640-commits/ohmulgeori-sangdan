"""원천물 후보판 (빌드 64): 15종 그림 · 분류 · 등급 · 능력 둘 · 게임에서 붙는 값 · 나오는 곳 + 창고 칸 크기
python3 sheet_orig.py [출력.png]  (기본: 이 폴더의 origin_drafts64.png)"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import orig64 as O
from kit import hx
FD = os.environ.get('FONT_DIR', '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/')
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
b14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); b18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); CELL = (30, 36, 52); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
GC = {'상급': (106, 176, 255), '최상급': (240, 180, 60)}


def img(px, s):
    im = Image.new('RGBA', (20 * s, 20 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=tuple(c) + (255,))
    return im


def wrap(t, font, w):
    out, cur = [], ''
    for word in t.split(' '):
        nx = (cur + ' ' + word).strip()
        if font.getlength(nx) > w and cur: out.append(cur); cur = word
        else: cur = nx
    if cur: out.append(cur)
    return out


S = 4; IW = 20 * S; COLW = 430; TXW = COLW - IW - 34
COLS = 2; ROWS = (len(O.CANDS) + COLS - 1) // COLS; BH = 124
W = 24 + COLS * COLW; TOPH = 178; FOOT = 150
H = TOPH + ROWS * BH + FOOT
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '원천물 후보 15종 — 정해진 곳에서만 아주 드물게 (게임에는 아직 안 넣음)', font=b18, fill=GOLD)
rules = ['무기 · 방어구에 새기면 두 능력 가운데 하나가 무작위로 붙고, 수치도 새길 때 무작위 — 상급 20~30 · 최상급 20~50.',
         '%로 크는 능력(HP · MP · 공격력 · 방어력 · 속성 피해 · 저항 · 회복 · 이동)은 그 숫자 그대로 %.',
         '확률 능력(치명타 · 방어 확률 · 명중 · 눈멂)은 10분의 1(%p) · 공격 속도 · 재사용 대기 · 마법 저항은 0.4배 · 흡혈 0.2배 · HP 재생은 초당 100분의 1.',
         '나오는 곳(제안): 지정 몬스터 0.02% · 반짝이는 개체 3% · 그 땅 던전 주인 1.5% · 레이드 1등 20%. 다른 몬스터는 안 떨군다.',
         '상급 = 검은바위산 ~ 메마른 땅 · 최상급 = 백작의 성부터와 레이드. 장비 하나에 원천물 한 칸(다시 새기면 덮어씀).',
         '세계수의 씨앗 · 빙해의 물결 · 그리폰의 뿔 · 미노타우로스의 우각 · 심해 켈프 · 심해아귀의 등불 · 공허의 그림자 · 시간선의 초침 · 미스릴 · 오리하르콘 = 말씀하신 것, 나머지 다섯은 제안.']
y = 44
for i, t in enumerate(rules):
    for ln in wrap(t, f12, W - 48): d.text((24, y), ln, font=f12, fill=INK if i == 5 else INK2); y += 17
for i, (fn, nm, cat, gr, ab, game, src, col) in enumerate(O.CANDS):
    bx = 24 + (i % COLS) * COLW; by = TOPH + (i // COLS) * BH
    d.rectangle([bx - 8, by - 8, bx + COLW - 22, by + BH - 16], outline=(40, 46, 62), width=1)
    d.rectangle([bx, by, bx + IW - 1, by + IW - 1], fill=CELL)
    im.alpha_composite(img(O.icon(i), S), (bx, by))
    tx = bx + IW + 12
    d.text((tx, by), nm, font=b14, fill=hx(col))
    nw = b14.getlength(nm)
    d.text((tx + nw + 8, by + 2), gr, font=f12, fill=GC[gr]); d.text((tx + nw + 8 + f12.getlength(gr) + 8, by + 2), cat, font=f12, fill=INK2)
    ly = by + 22
    d.text((tx, ly), '능력', font=f12, fill=(255, 168, 110)); d.text((tx + 34, ly), ab, font=f12, fill=INK); ly += 17
    for k, ln in enumerate(wrap(game, f12, TXW - 34)):
        if k == 0: d.text((tx, ly), '게임', font=f12, fill=(130, 190, 255))
        d.text((tx + 34, ly), ln, font=f12, fill=INK); ly += 17
    for k, ln in enumerate(wrap(src, f12, TXW - 34)):
        if k == 0: d.text((tx, ly), '출처', font=f12, fill=(150, 220, 140))
        d.text((tx + 34, ly), ln, font=f12, fill=INK2); ly += 17
y = TOPH + ROWS * BH + 2
d.text((24, y), '창고 칸에 놓으면 (실제 크기 · 칸 테: 상급 파랑 · 최상급 금)', font=b14, fill=INK); y += 24
x = 24
for i, c in enumerate(O.CANDS):
    inner, border = ((30, 56, 88), (60, 118, 184)) if c[3] == '상급' else ((70, 50, 26), (220, 160, 50))
    d.rectangle([x, y, x + 45, y + 45], fill=inner, outline=border, width=2)
    im.alpha_composite(img(O.icon(i), 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 52
    if x > W - 60: x = 24; y += 52
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'origin_drafts64.png')
im.save(out); print(out, im.size)
