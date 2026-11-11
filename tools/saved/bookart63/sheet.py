"""시안판: 스킬북 단계 A·B (크게 · 게임 크기) + 직업별 스킬북 A·B + 창고 칸에 놓은 모습"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, '.')
import books as B
FONT = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/Galmuri11.ttf'
FONTB = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/Galmuri11-Bold.ttf'
f12 = ImageFont.truetype(FONT, 12); f14 = ImageFont.truetype(FONTB, 14); f18 = ImageFont.truetype(FONTB, 18); f11 = ImageFont.truetype(FONT, 11)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)

def render(cv, s):
    im = Image.new('RGBA', (B.W * s, B.H * s), (0, 0, 0, 0))
    if cv.glow:
        g = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(g)
        c = cv.glow['c']; r = cv.glow['r']
        cx, cy = 9.5 * s, 9.5 * s
        d.ellipse([cx - 10 * s, cy - 10 * s, cx + 10 * s, cy + 10 * s], fill=c + (int(150 * r),))
        g = g.filter(ImageFilter.GaussianBlur(3 * s))
        im = Image.alpha_composite(im, g)
    d = ImageDraw.Draw(im)
    for (x, y), c in cv.px.items():
        d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=c + (255,))
    return im

RQ = [((26, 32, 48), (44, 52, 70)), ((38, 60, 34), (74, 138, 62)), ((30, 56, 88), (60, 118, 184)), ((64, 36, 90), (147, 86, 204)),
      ((87, 64, 18), (224, 160, 50)), ((98, 32, 26), (255, 106, 90)), ((122, 102, 40), (255, 244, 176))]
def cell(im, x, y, size, g, icon):
    d = ImageDraw.Draw(im)
    inner, border = RQ[g]
    d.rectangle([x, y, x + size - 1, y + size - 1], fill=inner, outline=border, width=2)
    ic = icon.resize((30, 30), Image.NEAREST) if size >= 34 else icon
    im.alpha_composite(ic, (x + (size - ic.width) // 2, y + (size - ic.height) // 2))

S = 7
colw = B.W * S + 40
W = 780
rows = len(B.TIERS)
H1 = 70 + rows * (B.H * S + 60)
H2 = 60 + 2 * (B.H * 4 + 44)
H = H1 + H2 + 150
im = Image.new('RGBA', (W, H), BG + (255,))
d = ImageDraw.Draw(im)
d.text((24, 18), '스킬북 그림 시안 · 빌드 63 (게임에는 아직 안 넣음 — 골라 주세요)', font=f18, fill=GOLD)
d.text((24, 44), '20×20 도트 · 단계마다 A / B · 오른쪽은 창고 칸 크기(30px)와 레어도 칸', font=f12, fill=INK2)
y = 70
for (name, sub, fa, fb, notes) in B.TIERS:
    d.text((24, y), f'{name}', font=f14, fill=INK); d.text((24 + 9 * 14 + 10, y + 2), sub, font=f12, fill=INK2)
    for i, fn in enumerate((fa, fb)):
        cv = fn(); ic = render(cv, S)
        x0 = 24 + i * colw
        d.rectangle([x0 - 2, y + 20, x0 + B.W * S + 1, y + 22 + B.H * S], fill=(12, 14, 20))
        im.alpha_composite(ic, (x0, y + 21))
        nt = notes[i]
        if len(nt) > 15:
            cut = nt.rfind(' · ', 0, 16)
            if cut < 0: cut = 15
            d.text((x0, y + 24 + B.H * S), nt[:cut], font=f11, fill=INK2); d.text((x0, y + 38 + B.H * S), nt[cut:].lstrip(' ·'), font=f11, fill=INK2)
        else: d.text((x0, y + 24 + B.H * S), nt, font=f11, fill=INK2)
    # 게임 크기 미리보기
    gx = 24 + 2 * colw + 20
    g = ['찢어진 스킬북', '낡은 스킬북', '빛바랜 스킬북', '신비한 스킬북', '고대의 스킬북', '신화 속 스킬북'].index(name)
    for i, fn in enumerate((fa, fb)):
        cv = fn(); ic1 = render(cv, 1); ic2 = render(cv, 2)
        cell(im, gx + i * 120, y + 30, 46, g, ic2.resize((30, 30), Image.NEAREST))
        im.alpha_composite(ic2, (gx + i * 120 + 54, y + 33))
        d.text((gx + i * 120 + 2, y + 82), ('A' if i == 0 else 'B') + ' 칸 · 2배', font=f11, fill=INK2)
    y += B.H * S + 60
# 직업별 스킬북
d.text((24, y + 4), '펼쳐서 나오는 스킬북 (직업 색 · 문장 · 끈/띠 = 그 스킬북의 레어도)', font=f14, fill=INK)
y += 30
S2 = 4
for r, fn in enumerate((B.skill_a, B.skill_b)):
    d.text((24, y), 'A 아래로 늘어진 책갈피 끈' if r == 0 else 'B 위·아래 레어도 띠 + 문장 창', font=f12, fill=INK2)
    for i, (cls, nm, col) in enumerate(B.CLS):
        grade = [1, 2, 3, 4, 5, 3, 1][i]
        ic = render(fn(cls, col, grade), S2)
        x0 = 24 + i * (B.W * S2 + 26)
        d.rectangle([x0 - 2, y + 16, x0 + B.W * S2 + 1, y + 18 + B.H * S2], fill=(12, 14, 20))
        im.alpha_composite(ic, (x0, y + 17))
        d.text((x0, y + 20 + B.H * S2), f'{nm} · {"일반 고급 희귀 영웅 전설 신화 신성".split()[grade]}', font=f11, fill=INK2)
    y += B.H * S2 + 44
# 창고 한 줄 모습
d.text((24, y + 4), '창고 스킬북 칸에 놓으면 (A끼리 · 실제 크기)', font=f14, fill=INK)
y += 30
x = 24
for g, (name, sub, fa, fb, notes) in enumerate(B.TIERS[:4]):
    cell(im, x, y, 46, g, render(fa(), 2).resize((30, 30), Image.NEAREST)); x += 50
for i, (cls, nm, col) in enumerate(B.CLS[:5]):
    grade = [1, 2, 3, 4, 2][i]
    cell(im, x, y, 46, grade, render(B.skill_a(cls, col, grade), 2).resize((30, 30), Image.NEAREST)); x += 50
im.save('book_drafts.png')
print(im.size)
