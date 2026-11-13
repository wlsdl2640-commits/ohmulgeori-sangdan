"""원정 창 · 레이드 원정 창 시안판 (시안 전용)"""
from PIL import Image, ImageDraw, ImageFont
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v87/raid/'
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
f = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
GOLD, INK, QUIET, BG = (240, 196, 90), (236, 230, 220), (160, 155, 145), (21, 23, 28)
uf, ur, uw = Image.open(D + 'ui_field.png').convert('RGB'), Image.open(D + 'ui_raid.png').convert('RGB'), Image.open(D + 'ui_raid_wide.png').convert('RGB')
PS = (12, 106, 440, 334)      # 작은 창 (2배 화면 좌표)
PW = (12, 106, 672, 458)      # 넓은 창 330px
PCOL = [(240, 194, 74), (74, 208, 200), (255, 122, 154), (176, 138, 255)]

def tab(d, x, y, w, h, text, on, dot=False):
    d.rectangle([x, y, x + w, y + h], fill=(58, 40, 26) if on else (34, 26, 20), outline=(200, 160, 80) if on else (90, 70, 50), width=3)
    d.text((x + w / 2, y + h / 2), text, font=f(22, True), fill=(255, 230, 160) if on else (170, 150, 120), anchor='mm')
    if dot: d.rectangle([x + w - 18, y + 8, x + w - 8, y + 18], fill=(230, 70, 60))

def dots(d, cx, y, n, cur):
    for i in range(n):
        x = cx + (i - (n - 1) / 2) * 26
        d.rectangle([x - 7, y - 7, x + 7, y + 7], fill=(240, 196, 90) if i == cur else (60, 50, 40), outline=(20, 14, 10), width=2)

def chev(d, x, y, left):
    pts = [(x + 10, y - 14), (x - 4, y), (x + 10, y + 14)] if left else [(x - 10, y - 14), (x + 4, y), (x - 10, y + 14)]
    d.line(pts, fill=(255, 240, 200), width=5); d.line(pts, fill=(255, 240, 200), width=5)

# ── 넘기기 방식 ──
def t1():
    im = uf.copy(); d = ImageDraw.Draw(im)
    tab(d, 12, 338, 200, 40, '원정대', True); tab(d, 216, 338, 224, 40, '레이드 원정대', False, True)
    return im

def t2():
    a = uf.copy(); d = ImageDraw.Draw(a); dots(d, (PS[0] + PS[2]) / 2, 354, 2, 0); chev(d, PS[2] - 26, (PS[1] + PS[3]) / 2, False)
    b = uf.copy()
    fp = uf.crop(PS); rp = ur.crop(PS); w = PS[2] - PS[0]; k = int(w * 0.42)
    mid = Image.new('RGB', fp.size); mid.paste(fp.crop((k, 0, w, fp.size[1])), (0, 0)); mid.paste(rp.crop((0, 0, k, rp.size[1])), (w - k, 0))
    b.paste(mid, PS[:2]); d = ImageDraw.Draw(b); d.line([(PS[0] + w - k, PS[1]), (PS[0] + w - k, PS[3])], fill=(10, 8, 6), width=4)
    dots(d, (PS[0] + PS[2]) / 2, 354, 2, 1)
    c = raidbar(uw.copy(), PW[0], PW[1], PW[2] - PW[0]); d = ImageDraw.Draw(c); dots(d, (PW[0] + PW[2]) / 2, 478, 2, 1); chev(d, PW[0] + 26, (PW[1] + PW[3]) / 2, True)
    return a, b, c

def t3():
    im = raidbar(uw.copy(), PW[0], PW[1], PW[2] - PW[0]); d = ImageDraw.Draw(im)
    th = uf.crop(PS).resize((214, 114), Image.NEAREST)
    x, y = PW[0] + 10, PW[3] - 114 - 10
    d.rectangle([x - 4, y - 4, x + 214 + 4, y + 114 + 4], fill=(10, 8, 6), outline=(200, 160, 80), width=3); im.paste(th, (x, y))
    d.text((x + 8, y + 6), '1파티', font=f(18, True), fill=(255, 255, 255), stroke_width=3, stroke_fill=(0, 0, 0))
    return im

# ── 레이드 원정대 창 배치 ──
def r1(): return raidbar(uw.copy(), PW[0], PW[1], PW[2] - PW[0]).crop(PW)

def r2():
    W, H = PW[2] - PW[0], PW[3] - PW[1]; TB = 44; out = Image.new('RGB', (W, H), (10, 8, 6)); qw, qh = (W - 6) // 2, (H - TB - 6) // 2
    for i in range(4):
        s = Image.open(D + f'b_solo{i}.png').convert('RGB')
        band = s.crop((0, int(64 * 752 / 240), 752, int(192 * 752 / 240)))   # 작은 창이 보여 주는 가운데 띠
        q = band.resize((qw, qh), Image.NEAREST); dq = ImageDraw.Draw(q)
        dq.rectangle([6, 6, 70, 34], fill=PCOL[i], outline=(10, 8, 6), width=2); dq.text((38, 20), f'{i + 1}파티', font=f(18, True), fill=(20, 14, 10), anchor='mm')
        dq.rectangle([6, qh - 16, 150, qh - 8], fill=(20, 14, 10)); dq.rectangle([8, qh - 14, 8 + int(140 * [0.86, 0.64, 0.92, 0.48][i]), qh - 10], fill=(224, 80, 63))
        out.paste(q, ((i % 2) * (qw + 6), TB + (i // 2) * (qh + 6)))
    return raidbar(out, 0, 0, W)

def raidbar(im, rx, ry, rw):
    """레이드 창 위 띠: 이름표 + 거인 HP 막대 (rx, ry = 창 왼쪽 위, rw = 창 너비 — 2배 화면 좌표)"""
    d = ImageDraw.Draw(im)
    lab = '레이드 원정대 · 킹슬라임 · 4파티 · 38초'; tw = d.textlength(lab, font=f(18, True))
    d.rectangle([rx + 4, ry + 4, rx + 22 + tw, ry + 42], fill=(20, 22, 36))
    d.text((rx + 14, ry + 20), lab, font=f(18, True), fill=(236, 230, 220), anchor='lm')
    bx0, bx1, by = rx + 34 + tw, rx + rw - 16, ry + 14
    d.rectangle([bx0, by, bx1, by + 14], fill=(20, 14, 10), outline=(240, 196, 90), width=2)
    d.rectangle([bx0 + 3, by + 3, bx0 + 3 + int((bx1 - bx0 - 6) * 0.62), by + 11], fill=(224, 80, 63))
    d.text((bx1 - 6, by + 30), '62%', font=f(16, True), fill=(255, 230, 160), anchor='rm', stroke_width=3, stroke_fill=(0, 0, 0))
    return im


def frame(im):
    d = ImageDraw.Draw(im); d.rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], outline=(200, 160, 80), width=4); return im

parts = {'t1': t1(), 't2': t2(), 't3': t3(), 'r1': frame(r1()), 'r2': frame(r2())}
S = 0.5   # 판에 넣을 때 줄임 (휴대폰 화면 2배 → 1배)
def small(im): return im.resize((int(im.size[0] * S), int(im.size[1] * S)), Image.LANCZOS)
cols = 3; pw_, ph_ = int(824 * S), int(600 * S)
Wd = 40 + cols * pw_ + (cols - 1) * 24 + 40
Hd = 1400
sh = Image.new('RGB', (Wd, Hd), BG); d = ImageDraw.Draw(sh)
d.text((40, 26), '원정대 창 · 레이드 원정대 창 시안', font=f(30, True), fill=GOLD)
d.text((40, 70), '작은 창을 둘로 나눈다: 원정대 창(지금 그대로, 파티 하나) · 레이드 원정대 창(레이드가 있을 때만, 네 파티를 한 무대에). 그림은 실제 게임 화면에 시안 그림을 얹은 것.', font=f(19), fill=QUIET)
y = 118
d.text((40, y), '넘기기 방식', font=f(24, True), fill=INK); y += 40
a, b, c = parts['t2']
row = [('T1  탭 — 창 아래 탭 둘', parts['t1']), ('T2  밀어 넘기기 — 점 둘 (추천)', a), ('T2  밀고 있는 중', b)]
for i, (lab, im) in enumerate(row):
    x = 40 + i * (pw_ + 24); sh.paste(small(im), (x, y + 32)); d.text((x, y), lab, font=f(20, True), fill=GOLD if '추천' in lab else INK)
y += 32 + ph_ + 30
row = [('T2  넘긴 뒤 — 레이드 원정대 창', c), ('T3  레이드가 시작되면 저절로 · 원정대 창은 작은 칸으로', parts['t3'])]
for i, (lab, im) in enumerate(row):
    x = 40 + i * (pw_ + 24); sh.paste(small(im), (x, y + 32)); d.text((x, y), lab, font=f(20, True), fill=INK)
x = 40 + 2 * (pw_ + 24)
note = ['추천: T2 + T3의 저절로', '· 평소엔 원정대 창 하나', '· 레이드가 시작되면 한 번', '  저절로 레이드 창으로 넘어감', '· 좌우로 밀거나 점을 눌러 오감', '· 레이드 창은 330px로 넓게', '  (메뉴 단추는 안 가림)']
for j, ln in enumerate(note): d.text((x, y + 40 + j * 30), ln, font=f(20, j == 0), fill=GOLD if j == 0 else INK)
y += 32 + ph_ + 36
d.text((40, y), '레이드 원정대 창 — 네 파티를 한 화면에', font=f(24, True), fill=INK); y += 40
k = 0.8
r1i, r2i = [im.resize((int(im.size[0] * k), int(im.size[1] * k)), Image.LANCZOS) for im in (parts['r1'], parts['r2'])]
d.text((40, y), 'R1  한 무대 네 줄 (추천)', font=f(20, True), fill=GOLD); d.text((40, y + 28), '가까운 줄부터 1~4파티 · 줄 끝 깃발과 파티 HP 막대 하나씩', font=f(18), fill=QUIET); sh.paste(r1i, (40, y + 60))
x2 = 40 + r1i.size[0] + 40
d.text((x2, y), 'R2  네 칸', font=f(20, True), fill=INK); d.text((x2, y + 28), '파티마다 따로 크게 · 거인이 네 번 나온다', font=f(18), fill=QUIET); sh.paste(r2i, (x2, y + 60))
y += 60 + r1i.size[1] + 24
sh = sh.crop((0, 0, Wd, y)); sh.save(D + 'event_window_drafts.png'); print(sh.size)
