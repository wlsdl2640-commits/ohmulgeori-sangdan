import sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, '.'); sys.path.insert(0, '../runeart'); sys.path.insert(0, '../bookart')
import frames as F, runes as R, books2 as B2
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
f14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); f18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)


def img(px, s, n=24):
    im = Image.new('RGBA', (n * s, n * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in px.items():
        if 0 <= x < n and 0 <= y < n: d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=tuple(c) + (255,))
    return im


def icon_for(g):
    rk = R.RUNES[[0, 2, 4, 5, 8, 11, 16][g]]
    if g in (3, 5):
        cls = [('warrior', '#c0392b'), ('mage', '#7a4ac8')][g == 5]
        cv = B2.skill_a(cls[0], cls[1], g); return {k: v for k, v in cv.px.items()}
    return R.make(rk[0], rk[2], min(2, g // 2))


def cellimg(fn, g, t, s):
    im = img(fn(g, t), s)
    ic = img(icon_for(g), 1, 20).resize((15 * s, 15 * s), Image.NEAREST) if s % 1 == 0 else None
    # 그림은 게임처럼 30px (24칸 판에서 15칸)
    ic = img(icon_for(g), 1, 20).resize((round(15 * s), round(15 * s)), Image.NEAREST)
    im.alpha_composite(ic, (round(4.5 * s), round(4.5 * s)))
    return im


def old_cell(g, s):
    im = Image.new('RGBA', (24 * s, 24 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    base, L, D, Bc = F.GR[g]
    for r in range(12 * s, 0, -1):     # 지금 CSS처럼 흐린 둥근 빛 (비교용)
        t = r / (12 * s); c = F.mix(F.mix(Bc, base, .35), Bc, t)
        d.ellipse([12 * s - r, 13 * s - r, 12 * s + r, 13 * s + r], fill=c + (255,))
    d.rectangle([0, 0, 24 * s - 1, 24 * s - 1], outline=base, width=s)
    ic = img(icon_for(g), 1, 20).resize((15 * s, 15 * s), Image.NEAREST); im.alpha_composite(ic, (round(4.5 * s), round(4.5 * s)))
    return im


S = 2; Z = 4
W = 24 + 7 * (24 * Z + 14) + 10; H = 1600
im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
d.text((24, 14), '창고 칸 레어도 테 시안 — 2D 도트 (게임에는 아직 안 넣음)', font=f18, fill=GOLD)
d.text((24, 40), '지금 칸: CSS 흐린 둥근 빛 · 그림자 · 빛줄기 → 도트가 아님. 아래 시안은 모두 칸(도트)으로만 그리고, 움직임은 장을 끊어 바꾼다.', font=f12, fill=INK2)
y = 66
d.text((24, y), '지금 (비교용, 흐린 빛)', font=f14, fill=INK); y += 22
for g in range(7):
    x = 24 + g * (24 * S + 12); im.alpha_composite(old_cell(g, S), (x, y)); d.text((x + 4, y + 24 * S + 3), F.NAMES[g], font=f11, fill=INK2)
y += 24 * S + 26
for key, name, fn, desc in F.OPTS:
    d.text((24, y), key + '안 · ' + name, font=f14, fill=INK)
    # 설명 줄 바꿈
    line = ''; yy = y + 20
    for ch in desc:
        if f11.getlength(line + ch) > W - 60 and line: d.text((24, yy), line, font=f11, fill=INK2); yy += 14; line = ch.lstrip()
        else: line += ch
    d.text((24, yy), line, font=f11, fill=INK2); y = yy + 20
    for g in range(7):     # 가까이 (4배)
        x = 24 + g * (24 * Z + 14); im.alpha_composite(cellimg(fn, g, 0, Z), (x, y)); d.text((x + 2, y + 24 * Z + 3), F.NAMES[g], font=f11, fill=INK2)
    y += 24 * Z + 22
    d.text((24, y), '실제 크기 (48px, 2배 칸)', font=f11, fill=INK2); y += 16
    for g in range(7):
        x = 24 + g * (24 * S + 12); im.alpha_composite(cellimg(fn, g, 0, S), (x, y))
    # 장 바뀜 (전설 · 신화 · 신성, 4장)
    x = 24 + 7 * (24 * S + 12) + 20
    d.text((x, y - 16), '움직임 (장 1~4)', font=f11, fill=INK2)
    for g in (4, 5, 6):
        for t in range(4):
            im.alpha_composite(cellimg(fn, g, t, S), (x + t * (24 * S + 4), y + (g - 4) * 0)); 
        x += 4 * (24 * S + 4) + 14
        if x > W - 200: break
    y += 24 * S + 28
im = im.crop((0, 0, W, y + 10)); im.save('frame_drafts.png'); print(im.size)
# 움직임 GIF (실제 크기 2배, 8장)
frames = []
for t in range(8):
    fr = Image.new('RGBA', (3 * 7 * (24 * S + 6) // 3 * 1 + 40, 3 * (24 * S + 8) + 10), BG + (255,))
    for oi, (key, name, fn, desc) in enumerate(F.OPTS):
        for g in range(7): fr.alpha_composite(cellimg(fn, g, t, S), (10 + g * (24 * S + 6), 6 + oi * (24 * S + 8)))
    frames.append(fr.convert('P', palette=Image.ADAPTIVE))
frames[0].save('frame_anim.gif', save_all=True, append_images=frames[1:], duration=220, loop=0)
