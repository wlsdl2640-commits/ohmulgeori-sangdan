"""시안판 2: 두께가 보이는 스킬북 단계 A·B + 직업 스킬북(문양 고침, 궁수 · 마법사 · 도적은 문양 둘)"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, '.')
import books2 as B
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
f14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); f18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)

def render(cv, s):
    im = Image.new('RGBA', (B.W * s, B.H * s), (0, 0, 0, 0))
    if cv.glow and False:   # 흐린 빛은 도트가 아니라 뺀다 (빛은 반짝이 칸으로만)
        g = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(g)
        c = cv.glow['c']; r = cv.glow['r']; cx, cy = 9.5 * s, 10 * s
        d.ellipse([cx - 10 * s, cy - 10 * s, cx + 10 * s, cy + 10 * s], fill=c + (int(150 * r),))
        im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(3 * s)))
    d = ImageDraw.Draw(im)
    for (x, y), c in cv.px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=c + (255,))
    return im

RQ = [((26, 32, 48), (44, 52, 70)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((64, 36, 90), (147, 86, 204)), ((87, 64, 18), (224, 160, 50)), ((98, 32, 26), (255, 106, 90)), ((122, 102, 40), (255, 244, 176))]
def cell(im, x, y, g, icon):
    d = ImageDraw.Draw(im); inner, border = RQ[g]
    d.rectangle([x, y, x + 45, y + 45], fill=inner, outline=border, width=2)
    ic = icon.resize((30, 30), Image.NEAREST); im.alpha_composite(ic, (x + 8, y + 8))

def wrap(d, x, y, txt, w):
    line = ''
    for ch in txt:
        if f11.getlength(line + ch) > w and line:
            d.text((x, y), line, font=f11, fill=INK2); y += 13; line = ch.lstrip()
        else: line += ch
    if line: d.text((x, y), line, font=f11, fill=INK2)

S = 6; colw = B.W * S + 30
W = 820; H = 70 + len(B.TIERS) * (B.H * S + 66) + 3 * (B.H * 4 + 52) + 160
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 16), '스킬북 그림 시안 2 — 책 두께가 보이게 · 문양 고침 (게임에는 아직 안 넣음)', font=f18, fill=GOLD)
d.text((24, 42), '옆 하얀 테 대신 윗면 · 옆면 3칸(앞표지 모서리 · 책장 · 뒤표지)으로 두께를 보인다. 빛은 흐림 없이 반짝이 칸으로만. 오른쪽은 창고 칸 크기', font=f12, fill=INK2)
y = 70
for gi, (name, sub, fa, fb, notes) in enumerate(B.TIERS):
    d.text((24, y), name, font=f14, fill=INK); d.text((150, y + 2), sub, font=f12, fill=INK2)
    for i, fn in enumerate((fa, fb)):
        x0 = 24 + i * colw; ic = render(fn(), S)
        d.rectangle([x0 - 2, y + 20, x0 + B.W * S + 1, y + 22 + B.H * S], fill=(12, 14, 20)); im.alpha_composite(ic, (x0, y + 21))
        wrap(d, x0, y + 26 + B.H * S, notes[i], colw - 10)
        cell(im, 24 + 2 * colw + 20 + i * 70, y + 40, gi, render(fn(), 2))
    d.text((24 + 2 * colw + 20, y + 92), 'A 칸        B 칸', font=f11, fill=INK2)
    y += B.H * S + 66
d.text((24, y + 2), '펼쳐서 나오는 스킬북 — 직업 문장 (끈 · 띠 색 = 그 스킬북의 레어도)', font=f14, fill=INK); y += 28
S2 = 4
rows = [('A 책갈피 끈 · 문양 1 (전사 비스듬한 검 · 궁수 활과 화살 · 마법사 뾰족 모자 · 도적 가면)', lambda c, col, g: B.skill_a(c, col, g)),
        ('A 책갈피 끈 · 문양 2 (전사 깃 장식 투구 · 궁수 나는 화살 · 마법사 반짝이는 지팡이 · 도적 엇갈린 단검)', lambda c, col, g: B.skill_a(c, col, g, True)),
        ('B 레어도 띠 + 문장 창 · 문양 1', lambda c, col, g: B.skill_b(c, col, g))]
for label, fn in rows:
    d.text((24, y), label, font=f12, fill=INK2)
    for i, (cls, nm, col) in enumerate(B.CLS):
        grade = [1, 2, 3, 4, 5, 3, 1][i]; x0 = 24 + i * (B.W * S2 + 30)
        d.rectangle([x0 - 2, y + 17, x0 + B.W * S2 + 1, y + 19 + B.H * S2], fill=(12, 14, 20)); im.alpha_composite(render(fn(cls, col, grade), S2), (x0, y + 18))
        d.text((x0, y + 22 + B.H * S2), nm, font=f11, fill=INK2)
    y += B.H * S2 + 52
d.text((24, y), '창고 칸에 놓으면 (실제 크기)', font=f14, fill=INK); y += 24
x = 24
for gi, (name, sub, fa, fb, notes) in enumerate(B.TIERS[:4]): cell(im, x, y, gi, render(fa(), 2)); x += 52
for i, (cls, nm, col) in enumerate(B.CLS):
    grade = [1, 2, 3, 4, 2, 3, 1][i]; cell(im, x, y, grade, render(B.skill_a(cls, col, grade), 2)); x += 52
im.save('book_drafts2.png'); print(im.size)
