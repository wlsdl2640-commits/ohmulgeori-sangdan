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
def aimed():
    a = A('green', cx=10.5, cy=7.5, r=12)
    sp(a, (grid(target(10.5, 7.5, 4.6)), TGT))
    sp(a, grid(arrow_ur(10, 7, L=6)))
    dot(a, [(13, 4), (14, 7), (8, 3)], '#ffffff')
    return a, 0
def double():
    a = A('teal', rays=10, rot=0.4)
    sp(a, grid(arrow_ur(10, 3, L=6))); sp(a, grid(arrow_ur(14, 8, L=6)))
    speed(a, [(1, 9, 3, 7), (2, 13, 4, 11), (5, 17, 7, 15)], '#c8fff0')
    return a, 0
def poisonarrow():
    a = A('poison', cx=10, cy=7)
    sp(a, grid(recolor(arrow_ur(12, 4, L=7), {'w': 'g', 'm': 'g', 'M': 'G'})), {'g': ('#9af060', 8), 'G': ('#3a9a2a', 8)})
    for (x, y) in [(12, 8), (13, 10), (11, 11), (12, 13)]: a.set(x, y, '#a8f070')
    dot(a, [(12, 9), (13, 11)], '#5ac040')
    return a, 0
def rain():
    a = A('sky', cy=4, r=16)
    for (x, ty) in [(2, 10), (5, 15), (8, 9), (11, 14), (14, 10)]:
        for k in range(1, 4): a.set(x, ty - 6 - k, mix('#9ad4ff', '#ffffff', 1 - k / 4))
        sp(a, grid(arrow_dn(x, ty, L=4)))
    return a, 0
def piercing():
    a = A('amber', cx=12, cy=10)
    for cx_ in (5.0, 9.0):
        for y in range(5, 15):
            for x in range(16):
                d = ((x + 0.5 - cx_) / 1.3) ** 2 + ((y + 0.5 - 10) / 4.2) ** 2
                if 0.55 <= d <= 1.0: a.set(x, y, '#fff0b0' if x + 0.5 < cx_ else '#ffb848')
    sp(a, grid(arrow_r(14, 10, L=10)))
    return a, 0
def eagleeye():
    a = A('sky', cx=9, cy=8, rays=8, rot=0.2, k=0.35)
    sp(a, EAGLE)
    return a, 0
def tripleshot():
    a = A('green', cx=4, cy=14, r=15, rays=9, rot=0.1, k=0.3)
    sp(a, grid(arrow_u(4, 3, L=6))); sp(a, grid(arrow_ur(12, 5, L=4))); sp(a, grid(arrow_r(14, 14, L=6)))
    return a, 0
def stormarrows():
    a = A('wind', cy=8)
    for y in range(2, 18):
        w = 6.6 - (y - 2) * 0.36; c = 7.5 + math.sin(y * 0.8) * 0.9
        for x in range(16):
            u = x + 0.5 - c
            if abs(u) <= w:
                s = (x + y * 1.6) % 4
                a.set(x, y, '#e0fff0' if s < 1.2 else '#7ad89a' if u < 0 else '#3a9a64')
    sp(a, grid(arrow_ur(13, 4, L=3))); sp(a, grid(arrow_l(2, 9, L=3))); sp(a, grid(arrow_ur(14, 12, L=3)))
    return a, 0
def el_arrow():
    a = A('ice', cx=11, cy=6)
    cm = arrow_ur(12, 4, L=7, shaft='c')
    cm.update({(12, 4): 'w', (11, 4): 'a', (12, 5): 'a', (10, 4): 'a', (12, 6): 'A', (11, 5): 'A', (11, 3): 'a', (13, 5): 'A'})
    sp(a, grid(cm), {'c': ('#bff0ff', 12), 'a': ('#9ae4ff', 12), 'A': ('#3a8ad0', 12)})
    dot(a, [(8, 3), (14, 8), (6, 6), (10, 1)], '#ffffff'); dot(a, [(9, 2), (13, 9)], '#9ae4ff')
    return a, 0
def awk_archer():
    a = A('night', cx=4, cy=15, r=16)
    dot(a, [(3, 4), (8, 2), (12, 6), (1, 9), (6, 7)], '#ffffff')
    for (tx, ty, L) in [(4, 12, 3), (9, 16, 3), (12, 9, 3)]:
        cm = arrow_dl(tx, ty, L=L)
        x0, y0 = tx + L + 2, ty - L - 2
        for k in range(5): a.set(x0 + k, y0 - k, ['#ffffff', '#fff0a0', '#ffc040', '#ff8a2a', '#c04a1a'][k]); a.set(x0 + k + 1, y0 - k, ['#fff0a0', '#ffc040', '#ff8a2a', '#c04a1a', '#7a2a10'][k])
        sp(a, grid(cm), {'r': ('#ffc040', 14), 'R': ('#c05a1a', 14)})
    return a, 0
def awk2_archer():
    a = A('dawn', cy=17, r=17, rays=12, k=0.3, hole=5)
    cm = {}
    for x in range(2, 14):
        u = (x + 0.5 - 7.5) / 6.0; yy = 3 + 5.0 * (1 - u * u)
        cm[(x, round(yy))] = 'y'; cm[(x, round(yy) + 1)] = 'Y'
    for x in range(2, 14): cm.setdefault((x, 3), 'w')
    for y in range(2, 13): cm[(7, y)] = 't' if y > 3 else 'r'
    cm.update({(6, 12): 'm', (8, 12): 'M', (7, 13): 'w', (7, 12): 'm'})
    for y in range(9, 12):
        pass
    sp(a, grid(cm), {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 't': ('#fff0b0', 6)})
    for (x, y0) in [(3, 11), (11, 12), (5, 15), (10, 16), (13, 13)]:
        for k in range(3): a.set(x, y0 + k, ['#fff4c0', '#ffe080', '#ffffff'][k])
    return a, 0
def flasharrow():
    a = A('holy', cx=10, cy=7)
    sp(a, grid(arrow_ur(10, 7, L=6)))
    burst(a, 10, 7)
    return a, 0
ICONS = {'aimed': ('조준 사격', 'dmg', aimed), 'double': ('연사', 'dmg', double), 'poisonarrow': ('독화살', 'dot', poisonarrow),
         'rain': ('화살비', 'dmg', rain), 'piercing': ('관통 사격', 'dmg', piercing), 'eagleeye': ('매의 눈', 'none', eagleeye),
         'tripleshot': ('삼연사', 'dmg', tripleshot), 'stormarrows': ('폭풍 화살', 'dmg', stormarrows), 'el_arrow': ('정령의 화살', 'mdmg', el_arrow),
         'awk_archer': ('유성우', 'dmg', awk_archer), 'awk2_archer': ('천궁 강림', 'dmg', awk2_archer), 'flasharrow': ('섬광 화살', 'dmg', flasharrow)}
