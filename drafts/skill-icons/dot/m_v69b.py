"""빌드 69 — 새 숙련 「신성력」 그림 시안 2차: 십자가 + 심장 (11-13 17:41 사용자 「신성력 시안은 이번에는 십자가+심장을 사용해서 디자인 해보고」)
- 틀 · 단계 점은 숙련 B안 그대로(m_v69 · m_v63과 같은 길): 안 배움 · 초급(동) · 중급(은) · 상급(금) · 달인(백금).
- 십자는 모두 금빛 라틴 십자(아래 팔이 긴 꼴). 적십자 표장(흰 바탕 붉은 십자) · 붉은 바탕 흰 정십자 · 흰 테 두른 검은 십자는 쓰지 않는다.
  A 십자가 앞의 심장(큰 금빛 십자 한가운데 붉은 심장 · sky) · B 심장 위의 십자(큰 심장 갈래에서 솟은 작은 십자 · night)
  C 심장 앞의 십자(큰 심장 앞에 선 금빛 십자 · heal) · D 십자를 새긴 심장 + 후광(심장 속 금빛 십자 · 머리 위 후광 · dawn)
python3 m_v69b.py → m_v69b.png"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell, b4
from cell import Art
from lib import *
from spr import *
from mast import TIER, FRAME, FRAME0
from m_v63 import FRAME4
from c_cleric import BIGHEART
from m_v69 import motes, HALO, GLD, GLD2, PALEG
def A_(theme, **k): return bg(Art(), theme, **k)
GOLDP = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1)}
def latin(top, bar, bottom, L, dy=0):
    """라틴 십자 칸: 세로 기둥 x7(밝음) · x8(그늘) top~bottom, 가로 팔은 bar · bar+1 줄, 팔 길이 L칸(양쪽 같게)"""
    cm = {}
    for y in range(top, bottom + 1): cm[(7, y)] = 'y'; cm[(8, y)] = 'Y'
    for x in range(7 - L, 9 + L): cm[(x, bar)] = 'y'; cm[(x, bar + 1)] = 'Y'
    cm[(7, top)] = 'h'
    return shift(cm, 0, dy)
SHEART = (['.11..11.', '11111111', '1w111112', '.111122.', '..1122..', '...22...'], {'1': ('#ee3448', 13), '2': ('#a8182c', 13), 'w': ('#ffd0d8', 1)})
# ── A 십자가 앞의 심장 ──
def g_x_a(a, dy=0):
    glow(a, 7.5, 7.0 + dy, 5.2, ['#2a62c4', '#7ab8f0', '#d8ecff'])
    sp(a, grid(latin(1, 5, 15, 6, dy)), GOLDP)
    sp(a, SHEART, 4, 4 + dy)
    motes(a, [(1, 12 + dy, 2), (2, 10 + dy, 1), (14, 12 + dy, 2), (13, 10 + dy, 1)])
# ── B 심장 위의 십자 ──
def g_x_b(a, dy=0):
    glow(a, 7.5, 4.0 + dy, 3.8, ['#3a3a70', '#a89870', '#fff0b0'])
    sp(a, grid(latin(1, 3, 8, 2, dy)), GOLDP)
    sp(a, BIGHEART, 3, 7 + dy)
    for (x, y, c) in [(7, 9, '#ff9aa0'), (8, 9, '#ff7a80')]: a.set(x, y + dy, c)
    for i in range(3): a.set(3 - i, 4 + i + dy, '#c8b078'); a.set(12 + i, 4 + i + dy, '#c8b078')   # 비스듬한 빛 두 줄
    motes(a, [(1, 13 + dy, 2), (14, 13 + dy, 2)])
# ── C 심장 앞의 십자 ──
HEART12 = (['.1111..1111.',
            '111111111111',
            '1w1111111112',
            '1w1111111122',
            '111111111122',
            '.1111111122.',
            '..11111122..',
            '...111122...',
            '....1122....',
            '.....22.....'], {'1': ('#ee3448', 13), '2': ('#a8182c', 13), 'w': ('#ffd0d8', 1)})
def g_x_c(a, dy=0):
    """큰 심장 앞에 금빛 십자 — 십자는 검은 테 없이(테가 심장을 덮지 않게) 밝은 쪽 · 그늘 쪽 · 오른쪽 아래 그림자로만"""
    glow(a, 7.5, 8.5 + dy, 5.6, ['#1e7430', '#64c66a', '#d8f8c8'])
    sp(a, HEART12, 2, 4 + dy)
    cm = latin(1, 6, 15, 3, dy)
    for (x, y) in list(cm):   # 그림자: 오른쪽 · 아래 한 칸 (심장 위면 짙은 빨강, 바탕 위면 검정)
        for q in ((x + 1, y), (x, y + 1)):
            if q not in cm:
                c = a.get(*q)
                if c: a.set(q[0], q[1], '#5a0a14' if c[0] > 150 and c[1] < 100 else '#1a1414')
    for (x, y), ch in cm.items(): a.set(x, y, {'y': '#ffe070', 'Y': '#d89a28', 'h': '#fff6c8'}[ch])
    for (x, y) in [(7, 0 + dy + 1)]: a.set(x, y, '#fff6c8')
    motes(a, [(1, 3 + dy, 0), (14, 3 + dy, 0), (1, 14 + dy, 2), (14, 14 + dy, 2)], ('#f0fff0', '#b8f0b8', '#6ab06a'))
# ── D 십자를 새긴 심장 + 후광 ──
def g_x_d(a, dy=0):
    sp(a, HALO, 4, 3 + dy)
    sp(a, BIGHEART, 3, 7 + dy)
    cm = {}
    for y in range(8, 14): cm[(7, y)] = '#ffe070'; cm[(8, y)] = '#d8a030'
    for x in range(5, 11): cm[(x, 9)] = '#ffe070' if x < 8 else '#e8b840'
    cm[(7, 8)] = '#fff6c8'
    for (x, y), c in cm.items(): a.set(x, y + dy, c)
    motes(a, [(1, 12 + dy, 2), (1, 9 + dy, 1), (14, 12 + dy, 2), (14, 9 + dy, 1)])
OPTS = [('A', '십자가 앞의 심장', 'sky', g_x_a), ('B', '심장 위의 십자', 'night', g_x_b), ('C', '심장 앞의 십자', 'heal', g_x_c), ('D', '십자를 새긴 심장 + 후광', 'dawn', g_x_d)]
def art_x(k, lit):
    _, _, theme, g = {o[0]: o for o in OPTS}[k]
    a = A_(theme, cy=8.0, rays=12, k=0.3, hole=4)
    g(a, -1)
    if lit == 4: l, d = '#fffbe8', '#d8c070'
    else: l, d = TIER[lit - 1] if lit else ('#3a3440', '#241e28')
    for i in range(3):
        x = 4 + i * 3
        for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)):
            a.set(x + dx, 16 + dy, (l if (dx, dy) == (0, 0) else d) if i < max(lit, 0) or lit == 4 else ('#3a3440' if (dx, dy) == (0, 0) else '#241e28'))
    if lit == 4: a.set(7, 15, '#ffffff'); a.set(8, 15, '#fff0a0')
    return a
def img_x(k, lit):
    art = art_x(k, lit)
    if not lit: return art.img('buff')
    im = art.img('buff'); px = im.load(); hb = b4.hexbase('buff').load()
    fr = FRAME4 if lit == 4 else FRAME[lit - 1]
    m = {b4.rgb(FRAME0[i]): b4.rgb(fr[i]) for i in range(3)}
    for y in range(48):
        for x in range(48):
            c = hb[x, y]
            if c[3] and c[:3] in m: px[x, y] = m[c[:3]] + (255,)
    return im
if __name__ == '__main__':
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
    D = pathlib.Path(__file__).parent
    Z = 2; CW = 48 * Z + 8; LW = 170; BIG = 4; RH = 48 * BIG + 18
    rows = [('now', '신성학 (지금 · 비교)', 'holy')] + [(k, f'{k}  {nm}', th) for k, nm, th, g in OPTS]
    XB = LW + 5 * CW + 20; XR = XB + 48 * BIG + 24
    sh = Image.new('RGB', (XR + 48 + 24, 62 + len(rows) * RH), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 8), '새 숙련 「신성력」 그림 시안 2차 — 십자가 + 심장 (금빛 라틴 십자)', font=fb, fill=(240, 196, 90))
    for t, tt in enumerate(['안 배움', '초급(동)', '중급(은)', '상급(금)', '달인(백금)']): d.text((LW + t * CW + 18, 36), tt, font=f, fill=(170, 165, 155))
    d.text((XB + 60, 36), '상급 4배', font=f, fill=(170, 165, 155)); d.text((XR - 4, 36), '실제', font=f, fill=(170, 165, 155))
    def get(k, t): return Image.open(D / 'final_snap_mast' / f'holy_{t}.png').convert('RGBA') if k == 'now' else img_x(k, t)
    for r, (k, name, th) in enumerate(rows):
        y0 = 58 + r * RH; yc = y0 + (48 * BIG - 48 * Z) // 2
        d.text((10, yc + 30), name, font=fb, fill=(232, 228, 220) if k != 'now' else (170, 165, 155))
        d.text((10, yc + 52), f'바탕 {th}', font=f, fill=(130, 126, 118))
        for t in range(5):
            z = cell.zoom(get(k, t), Z); sh.paste(z, (LW + t * CW, yc), z)
        zb = cell.zoom(get(k, 3), BIG); sh.paste(zb, (XB, y0), zb)
        im1 = get(k, 3); sh.paste(im1, (XR, y0 + (48 * BIG - 48) // 2), im1)
        if r: d.line([(10, y0 - 6), (sh.width - 10, y0 - 6)], fill=(44, 46, 54))
    out = D / 'm_v69b.png'; sh.save(out); print(out.name, sh.size)
