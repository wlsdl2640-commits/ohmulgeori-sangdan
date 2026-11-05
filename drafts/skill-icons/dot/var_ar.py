"""체크한 화살 스킬 시안 4개씩 (사용자: "화살은 크기를 좀더 줄여서, 짐승·용·철갑 등을 스킬 이름에 맞게 더 잘 그려서").
이름: <id>_1 … <id>_4. 아직 게임에 넣지 않음."""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar, arx, arrow, arrow_s, arrow_xs, recol, AP, GOLD_ALL, GOLDP
import crit as C
import w5, w6, fix_d
def A(theme, **k): return bg(Art(), theme, **k)
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
FIRE = {'r': 'o', 'R': 'O', 'f': 'h'}; FIREP = {'o': ('#ffb040', 14), 'O': ('#c0501a', 14), 'h': ('#fff0a0', 1)}
def mark(a, x, y):
    a.paint(['.r.', 'rwr', '.r.'], {'r': '#ff3a2a', 'w': '#ffffff'}, ox=x - 1, oy=y - 1)
def streak(a, x0, y0, x1, y1, cols=('#ffffff', '#c8e8ff', '#7ab8f0')):
    n = max(abs(x1 - x0), abs(y1 - y0))
    for i in range(n + 1):
        t = i / max(n, 1); a.set(round(x0 + (x1 - x0) * t), round(y0 + (y1 - y0) * t), cols[min(len(cols) - 1, int(t * len(cols)))])
def grass(a, y=17, c='#2e7a2a', c2='#4aa03a'):
    for x in range(16):
        for yy in range(y, 20): a.set(x, yy, c)
        if x % 3 == 0: a.set(x, y - 1, c2)
def stormcloud(a, y=2.0):
    sp(a, grid(cloud([(2.5, y + 0.8, 2.6), (7.0, y, 3.2), (11.5, y + 0.6, 2.8), (14.5, y + 1.4, 2.0)], 'f', 'F')), {'f': ('#4a5a6e', 11), 'F': ('#2a3442', 11)})
def flat_arrow(a, d, tx, ty, L=2, cols=('#ffffff', '#c8d8e8', '#8aa0b8'), F=2):
    """테두리 없는 먼 화살 (배경용): 촉·자루·깃 3색"""
    cm = arrow_xs(d, tx, ty, L, F)
    for (x, y), c in cm.items():
        a.set(x, y, cols[0] if c in 'wm' else cols[1] if c in 'tTM' else cols[2])
STAR5 = ['..y..', '.yhy.', 'yhwhy', '.yhy.', '.y.y.']
# ───────── 폭풍 화살: 하늘을 덮는 화살 ─────────
def stormarrows_1():
    a = A('storm', cy=4)
    stormcloud(a)
    paint_cm(a, bolt([(11, 4), (9, 7), (12, 8), (10, 11)], w=0), {'w': '#fff060'})
    for (tx, ty) in [(2, 9), (6, 8), (1, 13), (5, 12), (13, 12), (9, 16), (3, 17), (14, 16)]:
        flat_arrow(a, 'dl', tx, ty, 2, ('#e0f0ff', '#7ab0d0', '#4a7a9a'))
    ar(a, 'dl', 6, 16, 1, small=True); ar(a, 'dl', 11, 12, 1, small=True)
    return a, 0
def stormarrows_2():
    a = A('wind', cy=10, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for y in range(2, 19):
        t = (y - 2) / 16; cx = 7.5 + math.sin(t * 5.0) * 1.2; w = 6.5 - t * 5.0
        for x in range(16):
            d = abs(x + 0.5 - cx)
            if d < w: a.set(x, y, ('#ffffff' if (y + int(x * 0.4)) % 3 == 0 else '#c8f0dc') if d < w - 0.8 else '#8ad0b0')
    ar(a, 'r', 15, 5, 1, small=True); ar(a, 'l', 0, 9, 1, small=True); ar(a, 'r', 13, 13, 0, small=True)
    for (x, y) in [(1, 15), (13, 17)]: a.paint(['gG', 'G.'], {'g': '#8ae07a', 'G': '#3a9a3a'}, ox=x, oy=y)
    return a, 0
def stormarrows_3():
    a = A('night', cx=8, cy=9, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    disc(a, 8.0, 9.5, 6.6, '#c8c0a0'); disc(a, 8.0, 9.5, 6.0, '#fff4d0')
    for (x, y) in [(10, 6), (5, 12), (11, 13)]: a.set(x, y, '#e8dcb0')
    for (tx, ty) in [(7, 5), (13, 7), (6, 11), (12, 13), (9, 17)]:
        for (x, y), c in arrow_s('ur', tx, ty, 0).items(): a.set(x, y, '#1a1424' if c not in 'rRf' else '#4a2030')
    return a, 0
def stormarrows_4():
    a = A('wind', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for i in range(120):
        t = i / 119; ang = t * 10.0; r = 7.0 - t * 5.6
        x, y = 7.5 + math.cos(ang) * r, 10.0 + math.sin(ang) * r
        for (dx, dy) in ((0, 0), (1, 0)): a.set(int(x) + dx, int(y) + dy, '#ffffff' if t < 0.45 else '#a8f0c0')
    ar(a, 'r', 12, 3, 1, small=True); ar(a, 'l', 3, 17, 1, small=True); ar(a, 'u', 1, 6, 1, small=True)
    for (x, y) in [(13, 13), (11, 16)]: a.paint(['gG', 'G.'], {'g': '#8ae07a', 'G': '#3a9a3a'}, ox=x, oy=y)
    return a, 0
# ───────── 유성우: 별똥별처럼 쏟아지는 화살 ─────────
def awk_archer_1():
    a = A('night', cx=4, cy=16, r=16)
    dot(a, [(3, 3), (8, 1), (12, 7), (1, 9), (6, 6), (14, 13), (10, 3)], '#ffffff')
    for (tx, ty) in [(2, 11), (6, 15), (10, 12), (12, 18)]:
        streak(a, tx + 2, ty - 2, tx + 7, ty - 7, ('#ffffff', '#fff0a0', '#ffc040', '#a05a2a'))
        arx(a, 'dl', tx, ty, 1, FIRE, FIREP)
    return a, 0
def awk_archer_2():
    a = A('night', cx=4, cy=15, r=16)
    dot(a, [(3, 3), (8, 1), (1, 9), (14, 13)], '#ffffff')
    tail(a, 7.0, 10.0, 16.0, 1.0, 3.2, 0.8, ['#fff8d0', '#ffd040', '#ff8a2a', '#c8401a'])
    sp(a, grid(orb(6.0, 11.0, 2.8, 'abc')), {'a': ('#ffb060', 14), 'b': ('#c8501a', 14), 'c': ('#6a2a10', 14)})
    for (tx, ty) in [(2, 16), (9, 17), (12, 14)]: arx(a, 'dl', tx, ty, 1, FIRE, FIREP)
    return a, 0
def awk_archer_3():
    a = A('night', cy=16, r=15)
    for y in range(15, 20):
        for x in range(16):
            if y >= 15 + 1.6 * math.sin(x * 0.7) + 1: a.set(x, y, '#141428')
    sp(a, grid({k: 'm' for k, v in crescent2((12.5, 3.5), 2.4, (13.6, 2.8), 2.0).items()}), {'m': ('#fff4c8', 1)})
    dot(a, [(3, 2), (7, 1), (9, 4), (2, 7)], '#ffffff')
    for (tx, ty) in [(2, 12), (5, 15), (8, 12), (11, 15), (13, 11)]:
        streak(a, tx + 1, ty - 1, tx + 4, ty - 4, ('#ffffff', '#fff0a0', '#ff9a3a'))
        arx(a, 'dl', tx, ty, 0, FIRE, FIREP)
        a.set(tx - 1, ty + 1, '#ffe080')
    return a, 0
def awk_archer_4():
    a = A('royal', cx=13, cy=2, r=16, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    glow(a, 13.0, 2.0, 3.4, ['#c8b0ff', '#ffffff'])
    for (tx, ty) in [(2, 9), (4, 14), (8, 17), (11, 13), (7, 10)]:
        streak(a, tx + 1, ty - 1, 12, 3, ('#ffffff', '#e0d0ff', '#a890ff'))
        arx(a, 'dl', tx, ty, 1, FIRE, FIREP)
    return a, 0
# ───────── 짐승 사냥: 숨통을 노린 두 발 ─────────
def beastshot_1():
    a = A('green', cx=10, cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    grass(a, 17)
    sp(a, C.BOAR, 0, 7)
    arx(a, 'r', 4, 9, 1); arx(a, 'r', 5, 12, 1)
    a.set(13, 3, '#ffffff'); a.set(2, 4, '#ffffff')
    return a, 0
def beastshot_2():
    a = A('green', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x, y0) in [(1, 4), (14, 6), (12, 2)]:
        for y in range(y0, 18): a.set(x, y, '#1a3a18')
    grass(a, 18)
    sp(a, C.STAG, 1, 4)
    arx(a, 'ur', 6, 11, 1); arx(a, 'ur', 7, 13, 1)
    return a, 0
def beastshot_3():
    a = A('amber', cx=4, cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(13.5, 16.5, 2.2), (11.0, 17.5, 1.8), (15.0, 13.8, 1.4)]), {'1': '#e8c890', '2': '#b89060'})
    for y in range(18, 20):
        for x in range(16): a.set(x, y, '#6a4a22')
    sp(a, C.BOAR, 0, 8)
    speed(a, [(13, 6, 15, 6), (14, 9, 15, 9)], '#fff0d0')
    arx(a, 'r', 3, 9, 0); arx(a, 'r', 4, 11, 1)
    return a, 0
def beastshot_4():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x, y) in ring_cells(7.5, 9.5, 6.6, 6.6, 0.5): a.set(x, y, '#e8283a')
    for x in range(16): a.set(x, 9, '#e8283a') if not (3 <= x <= 12) else None
    for y in range(20): a.set(7, y, '#e8283a') if not (5 <= y <= 14) else None
    sp(a, C.DEERRUN, 1, 5)
    arx(a, 'ur', 5, 9, 1); arx(a, 'ur', 6, 11, 1)
    return a, 0
# ───────── 화살 폭우: 두 차례 쏟아지는 화살비 ─────────
def arrowstorm_1():
    a = A('storm', cy=4)
    stormcloud(a, 1.6)
    paint_cm(a, bolt([(12, 4), (10, 6), (13, 7)], w=0), {'w': '#fff060'})
    for (x, ty) in [(1, 9), (4, 11), (10, 9), (13, 11), (2, 15), (8, 13), (14, 16), (11, 17), (5, 18)]:
        flat_arrow(a, 'd', x, ty, 2, ('#e0f0ff', '#7ab0d0', '#4a7a9a'))
    ar(a, 'd', 7, 18, 1, small=True); ar(a, 'd', 4, 15, 0, small=True)
    return a, 0
def arrowstorm_2():
    a = A('storm', cy=4)
    stormcloud(a, 1.6)
    for (x, ty) in [(1, 8), (3, 10), (5, 7), (8, 9), (10, 7), (12, 10), (14, 8), (2, 13), (6, 12), (13, 14)]:
        flat_arrow(a, 'd', x, ty, 1, ('#a8c8e0', '#4a7a9a', '#2a5a7a'))
    for (x, ty) in [(4, 17), (9, 18), (12, 16)]:
        ar(a, 'd', x, ty, 1, small=True)
    return a, 0
def arrowstorm_3():
    a = A('storm', cy=3)
    stormcloud(a, 1.4)
    for (x, ty) in [(3, 9), (12, 8), (8, 6)]: flat_arrow(a, 'd', x, ty, 2, ('#e0f0ff', '#7ab0d0', '#4a7a9a'))
    for (tx, ty) in [(3, 17), (7, 18), (11, 17), (14, 16), (5, 15)]:
        cm = arrow_xs('dr', tx, ty, 1, 2)
        for (x, y), c in cm.items(): a.set(x, y, {'w': '#ffffff', 'm': '#c8d0e0', 'M': '#8a94a8', 't': '#e8b878', 'T': '#9a6a34', 'r': '#ff5a4a', 'R': '#a82a22'}[c])
    for y in range(16, 20):
        for x in range(16):
            if y >= 16 + (1 if x % 5 == 0 else 0): a.set(x, y, '#4a3a2a' if y > 16 else '#5a4a34')
    ar(a, 'd', 9, 14, 1, small=True)
    return a, 0
def arrowstorm_4():
    a = A('storm', cy=4)
    stormcloud(a, 1.6)
    for (x0, y0) in [(15, 5), (13, 9), (15, 12), (10, 6), (6, 5), (12, 15), (4, 9), (8, 12)]:
        line(a, x0, y0, x0 - 2, y0 + 2, '#5a8ab0')
    for (tx, ty) in [(1, 10), (5, 8), (9, 10), (13, 9), (3, 15), (11, 15)]:
        flat_arrow(a, 'dl', tx, ty, 2, ('#e0f0ff', '#7ab0d0', '#4a7a9a'))
    ar(a, 'dl', 6, 17, 1, small=True)
    paint_cm(a, bolt([(13, 3), (11, 6), (13, 7), (12, 9)], w=0), {'w': '#fff060'})
    return a, 0
# ───────── 신궁의 화살: 빗나가지 않는 신의 화살 ─────────
WINGS = (['......ww', '....wwwf', '..wwwwff', 'wwwwwff.', '.wwfff..', '..ff....'], {'w': ('#ffffff', 7), 'f': ('#c8d0e0', 7)})
def divinearrow_1():
    a = A('royal', rays=14, k=0.4, hole=3)
    for (x, y) in ring_cells(7.5, 3.0, 3.2, 1.1, 0.45): a.set(x, y, '#ffe060')
    WL = (['......w', '....wwf', '..wwwff', 'wwwwff.', '.wff...'], {'w': ('#ffffff', 7), 'f': ('#c8d0e0', 7)})
    sp(a, WL, 0, 7); sp(a, (flip(WL[0]), WL[1]), 9, 7)
    sp(a, grid(recol(arrow('d', 7, 17, 4), GOLD_ALL)), GOLDP, glow_c='#fff4c0')
    return a, 0
def divinearrow_2():
    a = A('holy', cy=2, rays=16, k=0.4, hole=3)
    from c_archer import BOW
    sp(a, BOW, 0, 3)
    sp(a, grid(recol(arrow('u', 7, 2, 4), GOLD_ALL)), GOLDP, glow_c='#ffffff')
    return a, 0
def divinearrow_3():
    a = A('royal', cy=4, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for y in range(4, 20):
        w = 0.8 + (y - 4) * 0.1
        for x in range(16):
            if abs(x + 0.5 - 7.5) < w: a.set(x, y, '#fff4c0')
    sp(a, (grid(target(7.5, 15.5, 3.4, '1213')), TGT))
    sp(a, ['..y..', '.yhy.', 'yhkhy', '.yhy.'], 5, 1, {'y': ('#ffd84a', 6), 'h': ('#fff8d0', 1), 'k': ('#3a8ad0', 1)})
    ar(a, 'd', 7, 15, 1, GOLD_ALL, GOLDP)
    return a, 0
EAGLE = (['ww...........ww', '.www.......www.', '..wwww...wwww..', '...wwwwhwwww...', '....wwwhhww....', '......hhh......', '.....yhhh......', '......hhh......', '.......E.......'],
         {'w': ('#ffffff', 7), 'h': ('#e8dcc0', 7), 'y': ('#ffb040', 14), 'E': ('#c8b088', 7)})
def divinearrow_4():
    a = A('holy', rays=16, k=0.45, hole=3)
    sp(a, EAGLE, 0, 3)
    ar(a, 'r', 13, 14, 1, GOLD_ALL, GOLDP, glow_c='#ffffff', small=True)
    return a, 0
# ───────── 별똥별 화살: 별처럼 쏟아지는 화살 ─────────
def star_arrow(a, tx, ty, L=1):
    arx(a, 'dl', tx, ty, L, GOLD_ALL, GOLDP)
    a.paint(['.y.', 'yhy', '.y.'], {'y': '#ffd84a', 'h': '#ffffff'}, ox=tx - 1, oy=ty - 1)
def starfall_1():
    a = A('purple', cy=4)
    for (x, y) in [(2, 3), (7, 2), (14, 15), (1, 9), (12, 3)]: plus(a, x, y, '#ffffff', '#fff0a0')
    for (tx, ty) in [(3, 12), (8, 16), (11, 10)]:
        streak(a, tx + 3, ty - 3, tx + 7, ty - 7, ('#fff0a0', '#e0b0ff', '#a060e0'))
        star_arrow(a, tx, ty, 1)
    return a, 0
def starfall_2():
    a = A('purple', cx=12, cy=3)
    tail(a, 11.0, 5.0, 16.0, 0.0, 2.2, 0.6, ['#ffffff', '#fff0a0', '#e0b0ff'])
    sp(a, STAR5, 9, 3, {'y': ('#ffd84a', 6), 'h': ('#fff8d0', 6), 'w': ('#ffffff', 1)})
    for (tx, ty) in [(3, 13), (6, 17), (10, 15)]:
        streak(a, tx + 2, ty - 2, 10, 7, ('#fff0a0', '#c890ff'))
        arx(a, 'dl', tx, ty, 1, GOLD_ALL, GOLDP)
    return a, 0
def starfall_3():
    a = A('night', cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    pts = [(3, 15), (6, 12), (9, 9), (12, 6), (10, 4), (14, 8)]
    for (p0, p1) in [(0, 1), (1, 2), (2, 3), (3, 4), (3, 5)]:
        line(a, *pts[p0], *pts[p1], '#6a70c8')
    for (x, y) in pts: plus(a, x, y, '#ffffff', '#fff0a0')
    for (x, y) in [(2, 4), (5, 6), (13, 14), (8, 17)]: a.set(x, y, '#ffffff')
    return a, 0
def starfall_4():
    a = A('purple', cx=3, cy=3, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, grid({k: 'm' for k in crescent2((3.5, 4.0), 2.6, (4.8, 3.2), 2.2)}), {'m': ('#fff4c8', 1)})
    for (tx, ty) in [(6, 11), (9, 16), (13, 12), (11, 8)]:
        star_arrow(a, tx + 2, ty, 0) if False else None
        arx(a, 'dr', tx, ty, 1, GOLD_ALL, GOLDP)
        a.paint(['.y.', 'yhy', '.y.'], {'y': '#ffd84a', 'h': '#ffffff'}, ox=tx - 1, oy=ty - 1)
    for (x, y) in [(13, 3), (9, 2), (14, 7)]: a.set(x, y, '#ffffff')
    return a, 0
# ───────── 정상 등반: 높은 곳에서 퍼붓는 화살 ─────────
MPAL = {'S': ('#f4f8ff', 7), 's': ('#c8d4e8', 7), 'm': ('#7a8a9a', 11), 'M': ('#4a5a6a', 11)}
FLAG = (['.rrrr', '.rrr.', '.rr..', 't....', 't....', 't....'], {'r': ('#e83a3a', 13), 't': ('#7a4c22', 3)})
def summit_1():
    a = A('sky', cy=3, r=15)
    sp(a, grid(C.mountain(7.5, 6.0, 1.3, 3.0)), MPAL, fx=False)
    sp(a, FLAG, 7, 1)
    for (x0, y0, x1, y1) in [(6, 7, 2, 11), (9, 7, 13, 11)]:
        for i in range(0, 5, 2): a.set(x0 + (x1 - x0) * i // 4, y0 + (y1 - y0) * i // 4, '#ffffff')
    arx(a, 'dl', 1, 13, 1); arx(a, 'dr', 14, 13, 1)
    return a, 0
def summit_2():
    a = A('warm', cy=3, r=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, grid(C.mountain(7.5, 6.0, 1.3, 2.0)), {'S': ('#ffe8c8', 7), 's': ('#e0b890', 7), 'm': ('#6a4a5a', 11), 'M': ('#3a2a40', 11)}, fx=False)
    sp(a, FLAG, 7, 1)
    for (x0, y0, x1, y1) in [(6, 6, 1, 11), (9, 6, 14, 11)]:
        for i in range(0, 6, 2): a.set(x0 + (x1 - x0) * i // 5, y0 + (y1 - y0) * i // 5, '#ffffff')
    ar(a, 'dl', 1, 15, 0, small=True); ar(a, 'dr', 14, 15, 0, small=True)
    return a, 0
def summit_3():
    a = A('sky', cy=2, r=15)
    sp(a, grid(C.mountain(4.5, 9.0, 1.5, 2.0)), MPAL, fx=False)
    sp(a, grid(C.mountain(10.5, 4.0, 1.2, 3.0)), MPAL, fx=False)
    for i, (x, y) in enumerate([(7, 18), (8, 16), (9, 14), (10, 12), (9, 10), (10, 8)]): a.set(x, y, '#c8a070')
    sp(a, FLAG, 10, 0)
    arx(a, 'dl', 4, 7, 1); arx(a, 'dl', 2, 12, 1); arx(a, 'dr', 14, 12, 1)
    return a, 0
def summit_4():
    a = A('sky', cy=4, r=14)
    paint_cm(a, cloud([(1.5, 15.0, 2.6), (5.0, 16.0, 2.6), (9.5, 15.5, 2.8), (14.0, 15.0, 2.4)]), {'1': '#ffffff', '2': '#c8dcf4'})
    ROCK = ['....mm....', '...mmmM...', '..mmmmMM..', '.mmmmmMMM.', 'mmmmmmMMMM']
    sp(a, ROCK, 3, 9, {'m': ('#8a9aaa', 11), 'M': ('#5a6a7a', 11)})
    sp(a, FLAG, 7, 3)
    arx(a, 'dl', 3, 17, 1); arx(a, 'dr', 12, 17, 1)
    return a, 0
# ───────── 용 관통: 비늘도 뚫는 한 발 ─────────
def dragonpierce_1():
    a = A('fire', cx=10, cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, C.DRAGONH, 1, 4)
    arx(a, 'r', 14, 14, 2)
    burst(a, 11, 14, big=False)
    mark(a, 9, 3)
    return a, 0
def dragonpierce_2():
    a = A('blood', cx=9, cy=7, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    disc(a, 9.5, 7.0, 6.0, '#e84a2a'); disc(a, 9.5, 7.0, 5.4, '#ff8a4a')
    a.paint(C.DRAGONH[0], {k: '#1a0606' for k in 'rRhyw'}, ox=1, oy=4)
    a.set(7, 8, '#ffe040')
    arx(a, 'r', 14, 14, 3, None, None, '#ffe0a0')
    mark(a, 12, 13)
    return a, 0
def dragonpierce_3():
    a = A('teal', cx=6, cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    rows_ = flip(C.DRAGONH[0])
    sp(a, (rows_, {'r': ('#3ab07a', 8), 'R': ('#1a5a3a', 8), 'h': ('#f0e0c0', 7), 'y': ('#ffe040', 1), 'w': ('#ffffff', 7)}), 1, 4)
    arx(a, 'l', 2, 14, 3)
    burst(a, 5, 14, big=False)
    mark(a, 7, 3)
    return a, 0
def dragonpierce_4():
    a = A('blood', rays=12, k=0.35, hole=3)
    SC = {}
    for (x, y) in poly_cells([(7.5, 2.5), (14.0, 6.0), (13.0, 13.0), (7.5, 18.0), (2.0, 13.0), (1.0, 6.0)], 'x'):
        edge = any((x + dx, y + dy) not in SC and (x + dx, y + dy) not in poly_cells([(7.5, 2.5), (14.0, 6.0), (13.0, 13.0), (7.5, 18.0), (2.0, 13.0), (1.0, 6.0)], 'x') for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        SC[(x, y)] = 'y' if edge and x + y < 18 else ('Y' if edge else ('h' if x + y < 12 else 'g' if x + y < 19 else 'G'))
    for (x0, y0, x1, y1) in [(8, 10, 5, 6), (8, 10, 12, 7), (8, 10, 6, 15), (8, 10, 11, 14)]:
        for i in range(5):
            q = (round(x0 + (x1 - x0) * i / 4), round(y0 + (y1 - y0) * i / 4))
            if q in SC: SC[q] = 'k'
    sp(a, grid(SC), dict(GOLD, g=('#d83a2a', 13), G=('#8a1a14', 13), h=('#ff8a6a', 13), k=('#2a0404', 1)))
    glow(a, 8.0, 10.0, 1.4, ['#ffe040', '#ffffff'])
    arx(a, 'ur', 13, 5, 2)
    return a, 0
# ───────── 몰이 사격: 사냥감을 몰아 쏘기 ─────────
def driveshot_1():
    a = A('green', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    grass(a, 17)
    sp(a, C.DEERRUN, 0, 6)
    speed(a, [(13, 7, 15, 7), (14, 10, 15, 10)], '#c8f0c0')
    arx(a, 'l', 12, 4, 2); arx(a, 'l', 14, 15, 2)
    return a, 0
def driveshot_2():
    a = A('green', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(14.0, 16.0, 2.4), (11.5, 17.5, 1.8), (15.0, 12.5, 1.6)]), {'1': '#e8dcb0', '2': '#b8a878'})
    for y in range(18, 20):
        for x in range(16): a.set(x, y, '#3a5a22')
    sp(a, C.BOAR, 3, 2, {'k': ('#8a6a4a', 3), 'K': ('#5a4430', 3)})
    sp(a, C.BOAR, 0, 9, {'k': ('#b0743e', 3), 'K': ('#7a4c2a', 3)})
    arx(a, 'l', 13, 1, 1); arx(a, 'l', 15, 7, 1)
    return a, 0
HORN = (['..........yy', '........yyY.', '......yyYY..', 'Y...yyyYY...', 'YyyyyyYY....', 'yYYYYYY.....', '.YYYY.......'], GOLD)
def driveshot_3():
    a = A('green', cy=12, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HORN, 1, 11)
    arcs(a, 13.0, 11.0, [2.5, 4.5], [(160, 250)], ['#ffffff', '#c8ffc0'])
    sp(a, C.DEERRUN, 2, 1, {'t': ('#8a5a2a', 3), 'T': ('#5a3a1a', 3)})
    arx(a, 'l', 15, 9, 1)
    return a, 0
def driveshot_4():
    import fix_d as FD
    a = A('green', cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    grass(a, 18)
    sp(a, FD.DOG, 0, 7)
    speed(a, [(0, 4, 2, 4), (0, 16, 1, 16)], '#c8f0c0')
    arx(a, 'r', 14, 3, 1); arx(a, 'r', 12, 5, 1)
    return a, 0
# ───────── 거대 사냥: 거대한 적의 급소 ─────────
def giantslayer_1():
    a = A('ember', cx=9, cy=5, r=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, C.KAIJU3, 1, 4)
    glow(a, 6.5, 12.0, 1.8, ['#ff6a3a', '#ffe080'])
    mark(a, 6, 12)
    arx(a, 'ul', 9, 14, 2)
    return a, 0
def giantslayer_2():
    a = A('amber', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, C.CYCLOPS, 1, 4)
    for (x, y) in ring_cells(7.5, 9.5, 3.4, 3.4, 0.4): a.set(x, y, '#ff3a2a') if (x + y) % 2 == 0 else None
    arx(a, 'ur', 4, 15, 2)
    return a, 0
FOOT = (['...ssssss.....', '...ssssss.....', '...ssssss.....', '...ssssss.....', '..sssssss.....', '.ssssssssss...', 'sssssssssssss.', 'snsnsnsssssss.', '.SSSSSSSSSSSS.'], {'s': ('#a88a6a', 2), 'S': ('#6a5040', 2), 'n': ('#e8d8c0', 7)})
def giantslayer_3():
    a = A('sky', cy=16, r=15)
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#5a8a3a')
    sp(a, FOOT, 1, 8)
    mark(a, 12, 13)
    arx(a, 'l', 12, 13, 1) if False else arx(a, 'ul', 13, 14, 1)
    for (x, y) in [(2, 3), (12, 2)]: a.set(x, y, '#ffffff')
    return a, 0
def giantslayer_4():
    a = A('night', cx=9, cy=6, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    disc(a, 9.0, 6.5, 5.4, '#e8e0c0'); disc(a, 9.0, 6.5, 4.8, '#fff8e0')
    for (x, y) in [(10, 4), (11, 8), (7, 5)]: a.set(x, y, '#e0d4b0')
    a.paint(C.KAIJU3[0], {'k': '#1a1424', 'b': '#1a1424', 's': '#1a1424', 'y': '#ff4a3a', 'w': '#e8e0c0'}, ox=1, oy=5)
    for (x, y) in ring_cells(6.5, 12.0, 2.0, 2.0, 0.35): a.set(x, y, '#ff3a2a')
    a.set(6, 12, '#ff3a2a')
    return a, 0
# ───────── 거신 낙하: 거신도 쓰러뜨리는 한 발 ─────────
def titanfall_1():
    a = A('evil', cx=4, cy=4, r=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    sp(a, grid(C.rot_rows(C.TITAN[0], 24, 6.0, 13.5, 8.5, 17.0)), C.TITAN[1])
    paint_cm(a, cloud([(3.5, 18.0, 2.0), (8.5, 18.6, 2.2), (13.0, 18.0, 2.0)]), {'1': '#c8a0a0', '2': '#8a6a6a'})
    arx(a, 'r', 9, 5, 2, GOLD_ALL, GOLDP)
    burst(a, 9, 5, big=False)
    return a, 0
def titanfall_2():
    a = A('evil', cy=8, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    KNEEL = C.TITAN[0][:10] + ['..ffffffff..', '.fffFFffff..', 'FFFF....FFFF']
    sp(a, KNEEL, 2, 5, C.TITAN[1])
    for (x, y) in [(6, 11), (7, 12), (8, 11), (9, 12)]: a.set(x, y, '#ff9a3a')
    arx(a, 'ur', 8, 11, 2, GOLD_ALL, GOLDP)
    for (x, y) in [(1, 4), (14, 6), (13, 2)]: sp(a, ['fF', 'FF'], x, y, {'f': ('#9a948a', 11), 'F': ('#5e5850', 11)})
    return a, 0
def titanfall_3():
    a = A('evil', cy=8, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    HEADB = ['..ffffffffff..', '.ffffffffffff.', 'ffffffkfffffff', 'FFFFFFkFFFFFFF', 'fdoodfkfdoodff', 'ffddffkffddfff', 'fffffkffFffFff', 'fffffkfFFfffff', 'ffdkkkkkkkdfff', '.ffffffffffff.', '..FFFFFFFFFF..']
    sp(a, grid(C.rot_rows(HEADB, 28, 7.0, 5.5, 8.0, 10.5)), {'f': ('#9a948a', 11), 'F': ('#5e5850', 11), 'd': ('#3a3630', 11), 'k': ('#1a1614', 1), 'o': ('#ff9a3a', 1)})
    paint_cm(a, cloud([(2.5, 17.6, 2.0), (7.5, 18.4, 2.2), (12.5, 17.8, 2.0)]), {'1': '#b89090', '2': '#7a5a5a'})
    arx(a, 'r', 7, 6, 2, GOLD_ALL, GOLDP)
    speed(a, [(12, 1, 14, 3), (14, 6, 15, 8)], '#ffe0c0')
    return a, 0
def titanfall_4():
    a = A('evil', rays=12, k=0.4, hole=3)
    HEADB = ['..ffffffffff..', '.ffffffffffff.', 'ffffffkfffffff', 'FFFFFFkFFFFFFF', 'fdoodfkfdoodff', 'ffddffkffddfff', 'fffffkffFffFff', 'fffffkfFFfffff', 'ffdkkkkkkkdfff', '.ffffffffffff.', '..FFFFFFFFFF..']
    sp(a, HEADB, 1, 5, {'f': ('#9a948a', 11), 'F': ('#5e5850', 11), 'd': ('#3a3630', 11), 'k': ('#1a1614', 1), 'o': ('#ff9a3a', 1)})
    arx(a, 'dl', 7, 7, 2, GOLD_ALL, GOLDP)
    burst(a, 7, 7, big=False)
    for (x, y) in [(1, 3), (13, 2), (14, 17), (0, 16)]: sp(a, ['fF', 'FF'], x, y, {'f': ('#9a948a', 11), 'F': ('#5e5850', 11)})
    return a, 0
# ───────── (애매) 관통 사격: 모든 적을 꿰뚫는 화살 ─────────
def piercing_1():
    a = A('amber', cx=12, cy=10, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (cx_, r_) in [(3.5, 3.2), (8.0, 2.6), (12.0, 2.0)]:
        sp(a, (grid(target(cx_, 9.5, r_, '1213')), TGT))
    arx(a, 'r', 15, 9, 4)
    return a, 0
SLIME = (['..ggg..', '.ggggg.', 'gkgggkg', 'ggggggg', '.ggggg.'], {'g': ('#6ad04a', 8), 'k': ('#1a1414', 1)})
def piercing_2():
    a = A('amber', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x, y, c) in [(0, 8, '#6ad04a'), (5, 7, '#4ab0e0'), (10, 8, '#c070ff')]:
        sp(a, SLIME, x, y, {'g': (c, 8)})
    arx(a, 'r', 15, 10, 8)
    return a, 0
def piercing_3():
    a = A('steelb', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x0) in (3, 9):
        sp(a, grid(w6.heater(4, 9, x0, 5, ('m', 'M'), ('b', 'B'))), {'m': ('#d4dcea', 5), 'M': ('#7a849a', 5), 'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12)})
    for i in range(10): a.set(1 + i, 9 + (1 if i % 2 else -1) * 0, '#c8f0ff')
    arx(a, 'r', 15, 9, 8)
    return a, 0
def piercing_4():
    a = A('night', cx=12, cy=9, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    BAT = (['k.....k', 'kk.k.kk', 'kkkkkkk', '.kkrkk.', '..k.k..'], {'k': ('#3a2a4a', 4), 'r': ('#ff3a2a', 1)})
    for (x, y) in [(0, 7), (5, 8), (10, 7)]: sp(a, BAT, x, y)
    arx(a, 'r', 15, 9, 8)
    return a, 0
IDS = ['stormarrows', 'awk_archer', 'beastshot', 'arrowstorm', 'divinearrow', 'starfall', 'summit', 'dragonpierce', 'driveshot', 'giantslayer', 'titanfall', 'piercing']
ICONS = {}
for _id in IDS:
    for _k in range(1, 5):
        ICONS[f'{_id}_{_k}'] = (f'{_id} {_k}', 'dmg', globals()[f'{_id}_{_k}'])
