"""빌드 69 — 새 숙련 「신성력」(성직자 계열 · 성기사: 싸우는 동안 자기 HP 재생) 그림 시안 넷 × 다섯 단계
(11-13 16:41 사용자 「신성력 시안 주고」) — 게임에는 고른 뒤에 넣는다.
- 틀 · 단계 점은 숙련 B안 그대로(m_v63.art63 · img63과 같은 길): 안 배움 · 초급(동) · 중급(은) · 상급(금) · 달인(백금).
- 신성학(금빛 성배 · holy 바탕)과 헷갈리지 않게 바탕 색 · 모양을 다르게 하고, 십자 · 더하기 꼴 반짝이는 쓰지 않는다(빛은 점 · 비스듬한 줄만).
  A 빛나는 심장(심장 + 머리 위 후광 + 가슴 속 금빛 · dawn) · B 기도하는 손(모은 손 + 위에서 내리는 빛 · night)
  C 빛의 몸(금빛 후광 원반 앞 흰 몸 + 가슴 속 작은 금빛 심장 · heal) · D 날개 달린 빛 방울(금빛 물방울 + 흰 날개 · water)
python3 m_v69.py → m_v69.png"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell, b4
from cell import Art
from lib import *
from spr import *
import mast, m_v63
from mast import TIER, FRAME, FRAME0
from m_v63 import FRAME4
from c_cleric import BIGHEART
def A_(theme, **k): return bg(Art(), theme, **k)
GLD = '#ffd84a'; GLD2 = '#c08a1c'; PALEG = '#fff6c8'
def motes(a, pts, cols=('#fff6c8', '#ffe890', '#c8a850')):
    """위로 오르는 빛 알갱이: (x, y, 밝기 0~2)"""
    for (x, y, k) in pts: a.set(x, y, cols[k])
# ── A 빛나는 심장 ──
HALO = (['.YYYYYY.', 'Y......y', '.yyyyyy.'], {'y': ('#ffe070', 6), 'Y': ('#c8962c', 6)})   # 뒤쪽 테는 어둡게, 앞쪽은 밝게
def g_div_a(a, dy=0):
    sp(a, HALO, 4, 3 + dy)
    sp(a, BIGHEART, 3, 7 + dy)
    for (x, y, c) in [(7, 8, PALEG), (8, 8, '#fff0a0'), (7, 9, '#fff0a0'), (8, 9, GLD), (6, 9, '#ff9aa0'), (9, 8, '#ff9aa0'), (7, 10, '#ff8a90'), (8, 10, '#ff7a80')]:
        a.set(x, y + dy, c)
    motes(a, [(1, 11 + dy, 2), (1, 8 + dy, 1), (2, 5 + dy, 0), (14, 12 + dy, 2), (14, 9 + dy, 1), (13, 6 + dy, 0)])
# ── B 기도하는 손 ──
HANDS = (['......sS......',
          '.....ssdS.....',
          '.....ssdS.....',
          '....sssdSS....',
          '....sssdSS....',
          '....sssdSS....',
          '...ssstdSSS...',
          '...ssttdSSS...',
          '...sssstSSS...',
          '...bbsssSSB...',
          '..bbbb..BBBB..',
          '.bbbb....BBBB.',
          'bbbb......BBBB'], {'s': ('#f4c494', 2), 'S': ('#c88a5a', 2), 'd': ('#8a5a3a', 2), 't': ('#ffdcb0', 2),
                              'b': ('#8ab4f0', 12), 'B': ('#3a5aa8', 12)})
def g_div_b(a, dy=0):
    glow(a, 7.5, 5.5 + dy, 5.2, ['#2a2a5a', '#6a6488', '#c8b078', '#fff0b0'])
    sp(a, HANDS, 1, 2 + dy)
    motes(a, [(1, 7 + dy, 1), (2, 4 + dy, 0), (14, 7 + dy, 1), (13, 4 + dy, 0)])
# ── C 빛의 몸 (팔을 들어 빛을 받는 사람) ──
FIG = (['s............S',
        'ww..........WW',
        '.ww...ss...WW.',
        '..ww.ssSS.WW..',
        '...wwsSSSWW...',
        '....wwwWWW....',
        '....wwwWWW....',
        '...wwwwWWWW...',
        '...wwwwWWWW...',
        '..wwwwwWWWWW..',
        '..wwwwwWWWWW..',
        '.wwwwwwWWWWWW.'], {'s': ('#f4c494', 2), 'S': ('#c88a5a', 2), 'w': ('#f4f0e6', 7), 'W': ('#c8bea8', 7)})
def g_div_c(a, dy=0):
    glow(a, 7.5, 7.5 + dy, 5.6, ['#2e7a3a', '#6ab868', '#d8f0a0', '#fff8d0'])
    sp(a, (['.yyyy.', 'y....y', '.yyyy.'], {'y': ('#ffe070', 6)}), 5, 1 + dy)   # 머리 위 후광
    sp(a, FIG, 1, 4 + dy)
    for (x, y, c) in [(7, 10, GLD), (8, 10, GLD), (7, 11, PALEG), (8, 11, GLD), (7, 12, GLD2), (8, 12, GLD2)]:   # 가슴 속 금빛
        a.set(x, y + dy, c)
    motes(a, [(1, 11 + dy, 2), (2, 8 + dy, 1), (14, 11 + dy, 2), (13, 8 + dy, 1)], ('#f0fff0', '#b8f0b8', '#6ab06a'))
# ── D 날개 달린 빛 방울 ──
DROP_B = (['...11...',
           '...11...',
           '..1111..',
           '..1111..',
           '.111112.',
           '.1w1112.',
           '1ww11122',
           '1w111122',
           '11111122',
           '.111122.',
           '..1222..'], {'1': ('#ffe890', 6), '2': ('#d8a030', 6), 'w': ('#ffffff', 1)})
WING_D = (['.....ww',
           '...wwwf',
           '.wwwwff',
           'wwwwfff',
           '.wwfff.',
           '..ff...'], {'w': ('#ffffff', 1), 'f': ('#c8d4f0', 5)})
def g_div_d(a, dy=0):
    glow(a, 7.5, 8.0 + dy, 5.0, ['#1e5a9a', '#4a8ad0', '#9ad0f4'])
    sp(a, WING_D, 0, 5 + dy); sp(a, flip(WING_D[0]), 9, 5 + dy, WING_D[1])
    sp(a, DROP_B, 4, 2 + dy)
    motes(a, [(2, 12 + dy, 2), (13, 13 + dy, 2), (3, 2 + dy, 0), (12, 1 + dy, 1)])
OPTS = [('A', '빛나는 심장', 'dawn', g_div_a), ('B', '기도하는 손', 'night', g_div_b), ('C', '빛의 몸', 'heal', g_div_c), ('D', '날개 달린 빛 방울', 'water', g_div_d)]
def art69(k, lit):
    """k = A~D, lit = 0 안 배움 · 1 초급 · 2 중급 · 3 상급 · 4 달인 (m_v63.art63과 같은 단계 점)"""
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
def img69(k, lit):
    art = art69(k, lit)
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
    Z = 2; CW = 48 * Z + 8; LW = 150; BIG = 4; RH = 48 * BIG + 18
    rows = [('now', '신성학 (지금 · 비교)', 'holy')] + [(k, f'{k}  {nm}', th) for k, nm, th, g in OPTS]
    XB = LW + 5 * CW + 20; XR = XB + 48 * BIG + 24
    sh = Image.new('RGB', (XR + 48 + 24, 62 + len(rows) * RH), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 8), '새 숙련 「신성력」 그림 시안 넷 (성직자 계열 · 성기사 — 싸우는 동안 자기 HP 재생)', font=fb, fill=(240, 196, 90))
    for t, tt in enumerate(['안 배움', '초급(동)', '중급(은)', '상급(금)', '달인(백금)']): d.text((LW + t * CW + 18, 36), tt, font=f, fill=(170, 165, 155))
    d.text((XB + 60, 36), '상급 4배', font=f, fill=(170, 165, 155)); d.text((XR - 4, 36), '실제', font=f, fill=(170, 165, 155))
    def get(k, t): return Image.open(D / 'final_snap_mast' / f'holy_{t}.png').convert('RGBA') if k == 'now' else img69(k, t)
    for r, (k, name, th) in enumerate(rows):
        y0 = 58 + r * RH; yc = y0 + (48 * BIG - 48 * Z) // 2
        d.text((10, yc + 30), name, font=fb, fill=(232, 228, 220) if k != 'now' else (170, 165, 155))
        d.text((10, yc + 52), f'바탕 {th}', font=f, fill=(130, 126, 118))
        for t in range(5):
            z = cell.zoom(get(k, t), Z); sh.paste(z, (LW + t * CW, yc), z)
        zb = cell.zoom(get(k, 3), BIG); sh.paste(zb, (XB, y0), zb)
        im1 = get(k, 3); sh.paste(im1, (XR, y0 + (48 * BIG - 48) // 2), im1)
        if r: d.line([(10, y0 - 6), (sh.width - 10, y0 - 6)], fill=(44, 46, 54))
    out = D / 'm_v69.png'; sh.save(out); print(out.name, sh.size)
