"""2단계 고치기 D: 결투가·칼춤꾼·보물 사냥꾼·대도·정령사·정령왕·리치 · 용 사냥꾼·사냥꾼·괴수 사냥꾼 · 연금술사 19개 (사용자 표시)"""
import math
import cell
from cell import Art, mix, W, H, dsword, sword
from lib import *
from spr import *
from arrows import ar, arrow, recol, AP
from spear import spear, SPP
import w5, w6
def A(theme, **k): return bg(Art(), theme, **k)
def eyes2(a, x, y, gap=3, c='#1a1414', g='#ffffff'):
    """2×2 눈 두 개 (왼쪽 위 반짝)"""
    for ex in (x, x + gap + 2):
        for dx in (0, 1):
            for dy in (0, 1): a.set(ex + dx, y + dy, c)
        a.set(ex, y, g)
def big_arrow(tx, ty, ang, Lh=5.5, hw=2.4, Ls=9.0):
    cm = spear(tx, ty, ang, Lh=Lh, hw=hw, Ls=Ls, sw=0.85, collar=0.0, cw=0.0, tassel=False)
    ux, uy = math.cos(math.radians(ang)), math.sin(math.radians(ang)); nx, ny = -uy, ux
    for k in range(4):
        u = Lh + Ls - 3.2 + k * 0.9
        for s in (-1, 1):
            for d in (1.0, 1.9):
                x, y = tx + ux * (u + d * 0.6) + nx * s * d, ty + uy * (u + d * 0.6) + ny * s * d
                q = (int(math.floor(x)), int(math.floor(y)))
                if 0 <= q[0] < W and 0 <= q[1] < H: cm.setdefault(q, 'r' if d < 1.5 else 'f')
    return cm
def flame_cm(ox, oy, cols):
    F = ['.1..', '.11.', '1221', '1231', '.11.']
    return [(ox + i, oy + j, cols[int(c) - 1]) for j, r in enumerate(F) for i, c in enumerate(r) if c != '.']
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
COIN4 = (['.yy.', 'yhyY', 'yyYY', '.YY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff8d0', 1)})
DANCER = (['....ssss....', '...s....s...', '...s.hh.s...', '....shhs....', '.....ss.....', '....pppp....', '.....pp.....',
           '..uuuuuuuu..', '.uUuuuuuuUu.', '...uUuuUu...', '.....ss.....', '.....s.ss...', '.....s..s...', '.....s.s....', '.....s......', '.....s......', '.....p......'],
          {'s': ('#f8d0a8', 2), 'h': ('#5a2a1a', 3), 'p': ('#e8508a', 16), 'u': ('#ffc0dc', 7), 'U': ('#e890b8', 7)})
SACK2 = (['...yhy...', '..tyyYt..', '...tTt...', '..eeeee..', '.eeeeeEe.', 'eeeeeeeEE', 'eeeyeeeEE', 'eeyyyeeEE', '.eeyeeEE.', '..EEEEE..'],
         {'e': ('#e0c08a', 9), 'E': ('#9a7a4a', 9), 't': ('#c8402a', 3), 'T': ('#8a2a1a', 3), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff8d0', 1)})
COIN5 = (['.yyy.', 'yhyyY', 'yyhYY', 'yyYYY', '.YYY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff8d0', 1)})
FLK = ['....1.....', '...11.1...', '..1121.1..', '..12221...', '.1222221..', '.12223221.', '1223333221', '1233333321', '1233333321', '.12333321.', '..122221..']
TOMB = (['.ffff.', 'ffkfFF', 'fkkkFF', 'ffkfFF', 'ffkfFF', 'ffffFF'], {'f': ('#a8a8b8', 11), 'F': ('#6a6a7a', 11), 'k': ('#4a4a58', 11)})
DEYE = (['....RRRRRR....', '..RRooooooRR..', '.RooyyyyyyooR.', 'Roohyyykyyyyor', 'Royyyyykyyyyor', 'Rooyyyykyyyoor', '.RooyyyyyyooR.', '..RRooooooRR..', '....RRRRRR....'],
        {'R': ('#8a1a18', 13), 'o': ('#ff8a2a', 14), 'y': ('#ffd84a', 6), 'h': ('#fff8d0', 1), 'k': ('#1a1414', 1)})
KAIJU2 = (['.....kkk......', '....kkkkkk....', '...kkrkkkkkk..', '...kkkkk.kkk..', '.k.kkkk.......', 'kk.kkkkk......', '.kkkkkkkkk....', '.kkkkkkk.kk...', 'kkkkkkkk......',
           'kkkkkkkkk.....', '.kkkkkkkkk....', '..kkkk.kkk....', '..kkk...kk....', '.kkkk...kkk...'], {'k': ('#2a1e3a', 4), 'r': ('#ffd040', 1)})
DOG = (['...........ee...', '..........kkkk..', 'ww........kekkkn', '.kw......kkkkkk.', '..kkkkkkrrkkk...', '..kkkkkkkrkkw...', '...kkkkkkkkw....', '..kk.......kk...', '.kk.........kk..', 'kw...........kw.'],
       {'k': ('#c8843a', 3), 'w': ('#f4ecd8', 7), 'e': ('#5a3418', 3), 'n': ('#1a1414', 1), 'r': ('#e83a3a', 13)})
TNT = (['.kkkkk.', 'rRrRrRR', 'rRrRrRR', 'yyyyyyy', 'rRrRrRR', 'rRrRrRR'], {'r': ('#e8483a', 13), 'R': ('#a82a22', 13), 'y': ('#e0c070', 7), 'k': ('#3a3036', 11)})
GP = {'w': ('#ffffff', 6), 'm': ('#ffe890', 6), 'M': ('#c08a1c', 6), 't': ('#ffd84a', 6), 'T': ('#c08a1c', 6), 'r': ('#ff5a3a', 13), 'f': ('#fff4ec', 7), 'R': ('#a82a22', 13)}
FALLEN = (['......k.k.k.k...', '...kkkkkkkkkkk..', '.kkkkkkkkkkkkkk.', 'kkxkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk', 'wkwkk.kkkkkkk.kk', '.kk...kk..kk....'],
          {'k': ('#5a2e3e', 4), 'x': ('#ffd040', 1), 'w': ('#f4ecd8', 1)})
def parrying():
    a = A('steelb', cy=8, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    ring(a, 7.5, 7.0, 5.6, [(150, 330)], '#d8f0ff', w=0.55)
    ring(a, 7.5, 7.0, 4.7, [(170, 310)], '#7ab8f0', w=0.4)
    a.paint(['w..', 'ww.', 'www', 'ww.'], {'w': '#ffffff'}, ox=12, oy=6)   # 화살촉
    cm = {}
    for y in range(1, 11): cm[(7, y)] = 'w'; cm[(8, y)] = 'M'
    cm[(8, 1)] = None
    HILT = ['..yyyyyy..', 'yyyyYYYYYY', 'y..ylLY..Y', '...ylLY.Y.', '....yYYY..', '.....YY...']
    for j, r in enumerate(HILT):
        for i, c in enumerate(r):
            if c != '.': cm[(3 + i, 11 + j)] = c
    cm = {k: v for k, v in cm.items() if v}
    sp(a, grid(cm), dict(GOLD, w=('#ffffff', 5), M=('#8a94a8', 5)))
    flash(a, 7, 4, big=True)
    return a, 0
def swordrain():
    a = A('thunder', cy=2, r=16, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for (x, y0, y1) in [(3, 0, 4), (12, 1, 6), (7, 0, 2)]:
        for y in range(y0, y1): a.set(x, y, '#c8b8ff' if y % 2 else '#8a78e0')
    pal = dict(GOLD, w=('#ffffff', 5), m=('#d4dcea', 5), M=('#7a849a', 5), l=('#7a4a2a', 9), L=('#4a2a18', 9))
    for (tx, ty, bl, bw, gd) in [(3.5, 13.6, 6.0, 2.0, 4.0), (12.5, 16.6, 6.0, 2.0, 4.0), (8.0, 18.6, 8.0, 2.6, 5.0)]:
        sp(a, grid(sword(tx, ty, -90, blade=bl, bw=bw, tip=1.6, guard=gd, gt=1.0, grip=2.0, gw=1.0, pom=0.8)), pal)
    return a, 0
def dancemaster():
    a = A('rose', cy=9, rays=10, k=0.3, hole=4)
    ring(a, 7.5, 10.5, 6.6, [(200, 340)], '#ffe0f0', w=0.5)
    ring(a, 7.5, 10.5, 6.6, [(20, 120)], '#ff9ac8', w=0.5)
    sp(a, DANCER, 2, 2)
    for (x, y) in [(2, 4), (13, 6), (12, 15)]: plus(a, x, y, '#ffffff', '#ffd0e8')
    return a, 0
def smokebomb():
    a = A('pink', cx=11, cy=13, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    pts = [(10.5, 13.0, 2.2), (7.5, 11.5, 2.4), (5.0, 9.0, 2.6), (4.5, 5.8, 2.4), (7.0, 3.8, 2.2), (10.0, 4.6, 1.8), (2.5, 12.5, 1.8), (12.5, 9.0, 1.7)]
    for (cx, cy, r) in pts:
        paint_cm(a, cloud([(cx, cy, r)]), {'1': '#f4d0ec', '2': '#c890bc'})
        paint_cm(a, cloud([(cx - r * 0.35, cy - r * 0.35, r * 0.5)]), {'1': '#ffffff', '2': '#f4d0ec'})
    sp(a, ['..yy...', '...Y...', '.kkkkk.', 'kkuukkk', 'kuukkkk', 'kkkkkkk', '.kkkkk.'], 8, 12, {'k': ('#3a2a50', 11), 'u': ('#ff7ac0', 16), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
    burst(a, 10, 11, big=False)
    for (x, y) in [(13, 3), (2, 16)]: plus(a, x, y, '#ffffff', '#ffd0f0')
    return a, 0
def goldrush():
    a = A('royal', rays=12, k=0.35, hole=3)
    w5.slash(a, w5.crescent(7.5, 10.0, 7.2, 200, 340, 2.8, fade=0.9), cols=('#ffffff', '#fff0a0', '#ffc040', '#d08a20'))
    for (x, y, big) in [(1, 9, 1), (11, 10, 1), (6, 13, 1), (3, 15, 0), (12, 15, 0), (7, 8, 0)]:
        sp(a, COIN5 if big else COIN4, x, y)
    for (x0, y0, x1, y1) in [(0, 14, 0, 15), (15, 9, 15, 8), (10, 18, 10, 19)]: line(a, x0, y0, x1, y1, '#fff0a0')
    return a, 0
def grandheist():
    a = A('royal', cx=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for k, c in ((5, '#4a44a0'), (3, '#6a64c8')):
        for j, r in enumerate(SACK2[0]):
            for i, ch in enumerate(r):
                if ch != '.': a.set(i + 6 - k, j + 5, c)
    speed(a, [(0, 7, 2, 7), (0, 11, 1, 11), (0, 14, 2, 14)], '#c8c0ff')
    sp(a, SACK2, 6, 5)
    for (x, y) in [(4, 17), (2, 16)]: sp(a, ['yY', 'YY'], x, y, GOLD)
    plus(a, 14, 4, '#ffffff', '#fff0a0')
    return a, 0
def windspirit():
    a = A('wind', cy=11, cuts=[0.0, 0.3, 0.55, 0.78, 0.97])
    ring(a, 7.5, 11.0, 6.4, [(150, 250)], '#c8ffe0', w=0.5)
    ring(a, 7.5, 11.0, 6.4, [(-30, 60)], '#c8ffe0', w=0.5)
    FL = ['......1111...', '.....12221...', '....1222.1...', '....1221.....', '...12221.....', '..1222221....', '.122233221...', '1223333221...', '1233333321...', '1233333321...', '.12333321....', '..122221.....']
    sk = [5, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2]
    rows = [' ' * s + r for s, r in zip(sk, FL)]
    a.paint(rows, {'1': '#3ab07a', '2': '#a8f4d0', '3': '#ffffff'}, ox=-1, oy=4)
    a.paint(['k..k', 'k..k'], {'k': '#0e4a30'}, ox=4, oy=11)
    for (x, y) in [(14, 4), (1, 6)]: plus(a, x, y, '#ffffff', '#c8ffe0')
    return a, 0
def earthward():
    a = A('earth', rays=12, k=0.35, hole=4)
    pts = [(1.5, 3.5), (14.5, 3.5), (14.5, 10.0), (12.0, 14.8), (7.5, 18.4), (3.0, 14.8), (1.5, 10.0)]
    inside = poly_cells(pts, 'x'); cm = {}
    for (x, y) in inside:
        edge = any((x + dx, y + dy) not in inside for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        if edge: cm[(x, y)] = 'g' if y < 6 else ('m' if x + y < 18 else 'M'); continue
        r = (y - 4) // 3; ly = (y - 4) % 3; lx = (x + 2 * (r % 2)) % 5
        cm[(x, y)] = 'd' if (ly == 2 or lx == 0) else ('f' if (ly == 0 and lx in (1, 2)) else 'F')
    for (x, y) in [(2, 3), (3, 3), (5, 3), (6, 3), (9, 3), (10, 3), (12, 3), (13, 3), (4, 6), (11, 6), (2, 7)]: cm[(x, y)] = 'g'
    sp(a, grid(cm), {'f': ('#c8c0b0', 11), 'F': ('#9a9284', 11), 'd': ('#5a544c', 11), 'm': ('#b8b0a0', 11), 'M': ('#7a7266', 11), 'g': ('#5ac04a', 8)})
    SPR = ['...gg', '..gGg', '.g.G.', 'gg.k.', 'gG.k.', '...k.']
    sp(a, ['..gg..', '.gGgg.', 'gGg.gg', '.g..Gg', '...k..', '...k..'], 5, 8, {'g': ('#7ae05a', 8), 'G': ('#2e8a2a', 8), 'k': ('#4a8a2a', 8)})
    for (x, y) in [(1, 2), (14, 2), (0, 13), (15, 12)]: a.set(x, y, '#fff0c0')
    return a, 0
def waterspirit():
    a = A('water', cy=11, cuts=[0.0, 0.3, 0.55, 0.78, 0.97])
    for (x, y) in [(2, 5), (13, 8), (1, 13), (14, 15)]:
        a.paint(['.c.', 'c.c', '.c.'], {'c': '#c8f0ff'}, ox=x - 1, oy=y - 1)
    DR = ['.......11.', '......1221', '.....1221.', '....1221..', '...12221..', '..1222221.', '.122333221', '.123333321', '12333333321', '12333333321', '12333333321', '.123333321.', '..1233321..', '...11111...']
    a.paint(DR, {'1': '#2a7ad8', '2': '#7ac8ff', '3': '#e8f8ff'}, ox=2, oy=4)
    a.paint(['k..k', 'k..k'], {'k': '#0a2a5a'}, ox=5, oy=12)
    a.set(4, 11, '#ffffff'); a.set(5, 10, '#ffffff')
    return a, 0
def spiritking():
    a = A('storm', rays=14, k=0.4, hole=3, cy=11)
    for (x, y, cols) in [(1, 8, ('#c8401a', '#ff8a2a', '#fff0a0')), (12, 8, ('#2a6ac8', '#7ac8ff', '#ffffff')), (1, 14, ('#2a9a54', '#8ae8a8', '#ffffff')), (12, 14, ('#8a5a1a', '#e0a040', '#fff0c0'))]:
        a.paint(['.1.', '121', '232', '.2.'], {'1': cols[0], '2': cols[1], '3': cols[2]}, ox=x, oy=y)
    a.paint(FLK, {'1': '#d0a030', '2': '#ffe890', '3': '#ffffff'}, ox=3, oy=6)
    a.paint(['k...k', '.k.k.'], {'k': '#5a2a0a'}, ox=5, oy=11)
    a.paint(['k..k', 'k..k'], {'k': '#3a1a0a'}, ox=5, oy=12)
    a.paint(['.kk.', 'k..k'], {'k': '#3a1a0a'}, ox=5, oy=15)
    sp(a, ['y.y.y', 'yyyyy', 'yrYbY'], 5, 3, dict(GOLD, r=('#e83a3a', 13), b=('#4a8aff', 12)))
    return a, 0
def deathplague():
    a = A('dark', cy=5, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(3.5, 6.0, 2.8), (7.5, 4.6, 3.4), (12.0, 6.2, 2.8), (6.0, 8.0, 2.4), (10.0, 8.2, 2.4)]), {'1': '#7aa03a', '2': '#4a6a22'})
    paint_cm(a, cloud([(6.5, 3.8, 1.6), (10.0, 4.8, 1.2)]), {'1': '#b0d860', '2': '#7aa03a'})
    for (x, y) in [(2, 3), (12, 3)]: a.paint(['g.g', '.g.'], {'g': '#2a3a12'}, ox=x + 1, oy=y + 2)
    for (x, y0) in [(3, 11), (6, 12), (9, 11), (12, 12), (5, 15), (11, 15)]:
        a.set(x, y0, '#9ad040'); a.set(x, y0 + 1, '#6a9a2a')
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#2a2238')
    sp(a, TOMB, 1, 12); sp(a, TOMB, 9, 13)
    return a, 0
def wyrmbane():
    a = A('blood', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(H):
        for x in range(W):
            r = y // 3; lx = (x + 2 * (r % 2)) % 4
            if y % 3 == 2 or lx == 0: a.set(x, y, mix(a.get(x, y), '#000000', 0.35))
    sp(a, DEYE, 1, 6)
    for (x, y, p) in [(1, 3, ['ww.', 'w..']), (12, 3, ['.ww', '..w']), (1, 16, ['w..', 'ww.']), (12, 16, ['..w', '.ww'])]:
        a.paint(p, {'w': '#ffffff'}, ox=x, oy=y)
    return a, 0
def houndpack():
    a = A('green', cy=12, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, DOG, -3, 2, {'k': ('#7a5030', 3), 'w': ('#b8ae98', 7), 'e': ('#3a2010', 3), 'r': ('#a82a22', 13)})
    sp(a, DOG, 0, 8)
    for (x, y) in [(13, 18), (10, 19)]: a.paint(['k.k', '.k.'], {'k': '#2a5a2a'}, ox=x, oy=y)
    return a, 0
def wildsense():
    a = A('green', cy=9, cuts=[0.0, 0.3, 0.55, 0.78, 0.96])
    for (cx, cy) in [(4.5, 9.0), (11.5, 9.0)]:
        glow(a, cx, cy, 2.8, ['#1a5a24', '#2e8e48'])
    for (x, y) in [(2, 8), (10, 8)]:
        L = x < 8
        a.paint(['gg...' if L else '...gg', 'hggkg' if L else 'gkggh', '.gggg' if L else 'gggg.'][:3], {'g': '#9aff5a', 'h': '#ffffff', 'k': '#0a1a04'}, ox=x, oy=y)
    LEAF = {'l': '#0e3a16', 'L': '#082a10'}
    a.paint(['ll....ll..llll..', 'lLl..lLLl.lLLl.l', '.lLllLl.llLl.lLl', '..llll...lll..ll'], LEAF, ox=0, oy=13)
    a.paint(['.ll...lll...ll..', 'lLLl.lLLLl.lLLl.', '.lll..lll...lll.'], LEAF, ox=0, oy=3)
    return a, 0
def giantslayer():
    a = A('ember', cx=9, cy=5, r=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for (x, y) in [(13, 13), (14, 15), (12, 16)]: a.set(x, y, '#ffd0a0')
    sp(a, KAIJU2, 1, 4)
    a.paint(['.r.', 'rwr', '.r.'], {'r': '#ff3a2a', 'w': '#ffffff'}, ox=4, oy=10)
    ar(a, 'ul', 6, 12, L=3, small=True)
    return a, 0
def anatomy():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(H):
        for x in range(W):
            if x % 3 == 0 or y % 3 == 0: a.set(x, y, mix(a.get(x, y), '#9ad4ff', 0.28))
    SK = (['....eee.......', '..eeeeeeee....', '.eeekkeeeee...', 'eeekkkeeeeeeee', 'eeeekeeeeeeeeE', '.eeeeeeeeEEEE.', '..eEeEeEeE....', '...eeeeeeee...', '....eEeEeEe...'],
          {'e': ('#f4f0e4', 7), 'E': ('#b8b0a0', 7), 'k': ('#1a1414', 1)})
    sp(a, SK, 1, 5)
    for (x, y) in [(10, 7), (5, 13)]:
        a.paint(['r.r', '.r.', 'r.r'], {'r': '#ff4a3a'}, ox=x, oy=y)
    for i in range(0, 5, 2): a.set(12 + (i // 2), 3 + i // 2, '#ffffff')
    line(a, 11, 8, 13, 4, '#ffffff')
    return a, 0
def quaketrap():
    a = A('sand', cy=3, r=12, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for y in range(10, 20):
        for x in range(16): a.set(x, y, '#7a4a22' if y < 13 else '#5a3418' if y < 17 else '#3e2410')
    for x in range(16): a.set(x, 10, '#5a9a3a')
    for (x0, y0, x1, y1) in [(7, 10, 5, 13), (8, 10, 10, 12), (5, 13, 3, 15), (10, 12, 12, 11), (12, 11, 14, 12)]: line(a, x0, y0, x1, y1, '#1e1008')
    glow(a, 7.5, 15.5, 3.4, ['#8a3a10', '#e07a20'])
    sp(a, TNT, 4, 13)
    w5.slash(a, w5.crescent(7.5, 12.0, 5.6, 200, 340, 2.0, fade=0.7), cols=('#ffffff', '#ffe080', '#ff9a2a', '#c85a1a'))
    burst(a, 7, 6, big=True, cols=('#ffffff', '#ffe080', '#ff9a2a'))
    for (x, y) in [(1, 6), (13, 4), (3, 2), (11, 1)]:
        sp(a, ['tT', 'TT'], x, y, {'t': ('#a87a4a', 3), 'T': ('#6a4a2a', 3)})
    return a, 0
def titanfall():
    a = A('evil', cx=8, cy=6, r=13, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    tail(a, 8.0, 0.0, 8.0, 10.0, 2.2, 1.0, ['#fff0a0', '#ffc040', '#e07a20'])
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#2a0a10')
    sp(a, FALLEN, 0, 11)
    burst(a, 8, 12, big=True)
    sp(a, grid(big_arrow(8.5, 13.0, -90, Lh=5.0, hw=2.2, Ls=6.5)), GP)
    paint_cm(a, cloud([(1.5, 17.6, 1.6), (14.0, 17.4, 1.8)]), {'1': '#c88a6a', '2': '#8a5a4a'})
    return a, 0
def transmute():
    a = A('arcane', cy=13, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x, y) in ring_cells(7.5, 14.5, 7.0, 3.2, 0.5): a.set(x, y, '#ffd84a')
    for (x, y) in ring_cells(7.5, 14.5, 4.8, 2.0, 0.45): a.set(x, y, '#c8a0ff')
    for (x0, y0, x1, y1) in [(7, 12, 3, 16), (8, 12, 12, 16), (3, 16, 12, 16)]: line(a, x0, y0, x1, y1, '#e8d0ff')
    CUBE = ['...mmyy...', '.mmmmyyyy.', 'mmmmmyyyyy', 'MMMMmyhYYY', 'MfMMMyYYYY', 'MMMfMYYhYY', 'MMfMMYYYYY', '.MMMMYYYY.', '...MMYY...']
    sp(a, CUBE, 3, 3, {'m': ('#c8c0b8', 11), 'M': ('#8a8278', 11), 'f': ('#5a544c', 11), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#ffffff', 1)})
    for (x, y, c) in [(1, 9, '#c8d0e0'), (14, 9, '#ff6a3a'), (1, 3, '#9ad8ff'), (14, 3, '#fff060')]:
        plus(a, x, y, '#ffffff', c)
    return a, 0
ICONS = {'parrying': ('받아넘기기', 'buff', parrying), 'swordrain': ('칼비', 'dmg', swordrain), 'dancemaster': ('무희의 발놀림', 'none', dancemaster), 'smokebomb': ('연막 폭탄', 'buff', smokebomb), 'goldrush': ('골드러시', 'dmg', goldrush), 'grandheist': ('대도의 손놀림', 'dmg', grandheist), 'windspirit': ('바람 정령', 'mdmg', windspirit), 'earthward': ('대지의 가호', 'buff', earthward), 'waterspirit': ('물의 정령', 'heal', waterspirit), 'spiritking': ('정령왕의 분노', 'mdmg', spiritking), 'deathplague': ('죽음의 역병', 'dot', deathplague), 'wyrmbane': ('용살자의 눈', 'none', wyrmbane), 'houndpack': ('사냥개 풀기', 'dmg', houndpack), 'wildsense': ('야생의 감', 'none', wildsense), 'giantslayer': ('거대 사냥', 'dmg', giantslayer), 'anatomy': ('괴수 해부학', 'none', anatomy), 'quaketrap': ('지진 덫', 'dmg', quaketrap), 'titanfall': ('거신 낙하', 'dmg', titanfall), 'transmute': ('금속 변성', 'mdmg', transmute)}
