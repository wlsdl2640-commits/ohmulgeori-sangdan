"""궁수 12개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
def A(theme, **k): return bg(Art(), theme, **k)
def arrow_u(x, ty, L=5, **kw): return rot_cm(arrow_dn(x, 19 - ty, L, **kw), 2)
def arrow_dl(tx, ty, L=6, **kw): return rot_cm(arrow_ur(15 - tx, 19 - ty, L, **kw), 3)
def arrow_l(tx, y, L=7, **kw): return rot_cm(arrow_r(15 - tx, y, L, **kw), 1)
def arrow_ul(tx, ty, L=6, **kw): return rot_cm(arrow_ur(15 - tx, ty, L, **kw), 1)
EAGLE = (['................',
          '................',
          '................',
          '....eeeee.......',
          '...eeeeeeee.....',
          '..eeeeEEEeee....',
          '..eeeeh1keeyy...',
          '.eeeee11keyyyy..',
          '.eeeeeeeeeyYYYY.',
          '.eeeeeeeeeeYY.Y.',
          '..eeeeeeeeE...Y.',
          '..Feeeeeee......',
          '.FFFeeeeE.......',
          '.FFFFFeE........',
          'FFFFFFF.........'], {'1': ('#ffc828', 1), 'F': ('#7a4a22', 3), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#ffffff', 1)})
from arrows import arrow, arrow_s, recol, AP, GOLD_ALL, GOLDP
def ar(a, d, tx, ty, L=4, m=None, pal=None, glow_c=None, small=False):
    cm = (arrow_s if small else arrow)(d, tx, ty, L)
    if m: cm = recol(cm, m)
    pp = dict(AP); pp.update(pal or {})
    sp(a, grid(cm), pp, glow_c=glow_c)
def aimed():
    a = A('green', cx=10.5, cy=7.0, r=12)
    sp(a, (grid(target(10.5, 7.0, 5.0)), TGT))
    ar(a, 'ur', 10, 7, 2)
    for (x0, y0, x1, y1) in [(14, 2, 15, 1), (15, 7, 15, 7), (10, 1, 10, 0), (5, 3, 4, 2)]: line(a, x0, y0, x1, y1, '#ffffff')
    return a, 0
def double():
    a = A('teal', rays=10, rot=0.4, k=0.3)
    speed(a, [(0, 12, 2, 10), (1, 15, 3, 13), (4, 18, 6, 16)], '#c8fff0')
    ar(a, 'ur', 9, 2, 2); ar(a, 'ur', 14, 7, 2)
    return a, 0
def poisonarrow():
    a = Art().bg(radial(['#040a04', '#0a1a0a', '#122a10', '#1a3a18', '#24502a', '#346838'], 11, 6, 13, [0.0, 0.25, 0.45, 0.65, 0.85]))
    ar(a, 'ur', 12, 3, 3, {'w': 'h', 'm': 'g', 'M': 'G', 'r': 'g', 'R': 'G', 'f': 'h'}, {'g': ('#a8f060', 8), 'G': ('#3a9a2a', 8), 'h': ('#e8ffc0', 8)})
    for (x, y, c) in [(13, 9, '#a8f060'), (13, 10, '#5ac040'), (14, 12, '#a8f060'), (11, 11, '#a8f060'), (11, 12, '#5ac040'), (12, 14, '#a8f060')]: a.set(x, y, c)
    for (x, y) in [(15, 4), (9, 1), (14, 15)]: a.paint(['.g.', 'g.g', '.g.'], {'g': '#a8f060'}, ox=x - 1, oy=y - 1)
    return a, 0
def rain():
    a = A('sky', cy=16, r=16)
    sp(a, grid(cloud([(2.5, 1.5, 2.4), (6.5, 0.8, 2.8), (10.5, 1.2, 2.6), (14.0, 1.8, 2.2)], 'f', 'F')), {'f': ('#5a6a8a', 11), 'F': ('#34405a', 11)})
    for (x, ty, L) in [(2, 12, 4), (5, 16, 5), (8, 11, 4), (11, 15, 5), (14, 12, 4)]:
        for k in range(1, 3): a.set(x, ty - L - 3 - k, ['#c8e8ff', '#7ab8f0'][k - 1])
        ar(a, 'd', x, ty, L, small=True)
    return a, 0
def piercing():
    a = A('amber', cx=12, cy=10, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for cx_ in (4.5, 8.5):
        for y in range(4, 16):
            for x in range(16):
                d = ((x + 0.5 - cx_) / 1.2) ** 2 + ((y + 0.5 - 9.5) / 4.6) ** 2
                if 0.5 <= d <= 1.0: a.set(x, y, '#ffffff' if x + 0.5 < cx_ else '#ffc860')
    ar(a, 'r', 15, 9, 6)
    return a, 0
def eagleeye():
    a = A('sky', cx=9, cy=8, rays=8, rot=0.2, k=0.35)
    sp(a, EAGLE)
    return a, 0
def tripleshot():
    a = A('green', cx=4, cy=10, r=14, rays=9, rot=0.1, k=0.3)
    for (tx, y, L) in [(14, 4, 6), (12, 10, 6), (14, 16, 6)]:
        line(a, tx - 12, y, tx - 10, y, '#d8ffd8')
        ar(a, 'r', tx, y, L, small=True)
    return a, 0
def stormarrows():
    a = A('wind', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for i in range(110):
        t = i / 109; ang = t * 9.0 + 1.0; r = 6.6 - t * 5.0
        x, y = 7.5 + math.cos(ang) * r, 10.0 + math.sin(ang) * r * 1.0
        for (dx, dy) in ((0, 0), (0, 1)): a.set(int(x) + dx, int(y) + dy, '#ffffff' if t < 0.5 else '#a8f0c0')
    ar(a, 'l', 3, 3, 4, small=True); ar(a, 'r', 12, 16, 4, small=True)
    return a, 0
def el_arrow():
    a = A('ice', cx=11, cy=5)
    cm = arrow('ur', 12, 4, 4)
    cm = recol(cm, {'w': 'w', 'm': 'a', 'M': 'A', 't': 'c', 'T': 'C', 'r': 'a', 'R': 'A', 'f': 'w'})
    for (x, y, c) in [(13, 3, 'a'), (12, 2, 'a'), (14, 4, 'A'), (13, 2, 'w'), (14, 3, 'a')]: cm[(x, y)] = c
    sp(a, grid(cm), {'a': ('#a8ecff', 12), 'A': ('#3a8ad0', 12), 'c': ('#d8f8ff', 12), 'C': ('#7ac0e8', 12), 'w': ('#ffffff', 1)})
    for (x, y) in [(8, 3), (15, 8), (5, 9), (10, 12)]: plus(a, x, y, '#ffffff', '#9ae4ff')
    return a, 0
def awk_archer():
    a = A('night', cx=4, cy=16, r=16)
    dot(a, [(3, 3), (8, 1), (12, 7), (1, 9), (6, 6), (14, 13)], '#ffffff')
    for (tx, ty) in [(2, 12), (8, 17), (11, 9)]:
        tail(a, tx + 5.0, ty - 5.0, tx + 10.0, ty - 10.0, 1.6, 0.4, ['#ffffff', '#fff0a0', '#ffc040', '#ff7a2a', '#a03a1a'])
        ar(a, 'dl', tx, ty, 1, {'r': 'o', 'R': 'O', 'f': 'h'}, {'o': ('#ffb040', 14), 'O': ('#c0501a', 14), 'h': ('#fff0a0', 1)})
    return a, 0
BOW = (['yh............hy',
        '.yy..........yy.',
        '..yyy......yyy..',
        '....yyyYYyyy....',
        '......YllY......'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1), 'l': ('#8a4a2a', 9)})
def awk2_archer():
    a = A('dawn', cy=16, r=17, rays=12, k=0.3, hole=5)
    for x in range(1, 15): a.set(x, 1, '#fff8e0')
    sp(a, BOW, 0, 2)
    cm = recol(arrow('d', 7, 12, 4), GOLD_ALL)
    sp(a, grid({k: v for k, v in cm.items() if k[1] >= 1}), GOLDP, glow_c='#fff0a0')
    for (x, y0) in [(2, 10), (13, 11), (4, 15), (11, 16), (14, 15), (1, 15)]:
        for k in range(3): a.set(x, y0 + k, ['#fff4c0', '#ffe080', '#ffffff'][k])
    return a, 0
def flasharrow():
    a = A('holy', cx=10, cy=6, rays=12, k=0.3)
    ar(a, 'ur', 10, 6, 3)
    burst(a, 11, 5)
    for (x, y) in [(15, 2), (14, 9), (7, 1)]: plus(a, x, y)
    return a, 0
ICONS = {'aimed': ('조준 사격', 'dmg', aimed), 'double': ('연사', 'dmg', double), 'poisonarrow': ('독화살', 'dot', poisonarrow),
         'rain': ('화살비', 'dmg', rain), 'piercing': ('관통 사격', 'dmg', piercing), 'eagleeye': ('매의 눈', 'none', eagleeye),
         'tripleshot': ('삼연사', 'dmg', tripleshot), 'stormarrows': ('폭풍 화살', 'dmg', stormarrows), 'el_arrow': ('정령의 화살', 'mdmg', el_arrow),
         'awk_archer': ('유성우', 'dmg', awk_archer), 'awk2_archer': ('천궁 강림', 'dmg', awk2_archer), 'flasharrow': ('섬광 화살', 'dmg', flasharrow)}
