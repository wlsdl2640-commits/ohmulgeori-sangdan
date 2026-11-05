"""도적 12개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
def A(theme, **k): return bg(Art(), theme, **k)
DAG_DL = (rot180(DAGGER_UR[0], {'w': 'M', 'M': 'w'}), DAGGER_UR[1])
def dagger_at(a, x, y, d='ur', pal=None):
    rw = {'ur': DAGGER_UR[0], 'dl': DAG_DL[0], 'ul': flip(DAGGER_UR[0]), 'dr': flip(DAG_DL[0])}[d]
    sp(a, (rw, DAGGER_UR[1]), x, y, pal)
def backstab():
    a = A('shadow', cx=4, cy=12)
    burst(a, 4, 13, cols=('#ffffff', '#ff8a8a', '#e83a3a'))
    dagger_at(a, 4, 4, 'dl')
    dot(a, [(2, 9), (7, 15), (1, 15)], '#ff6a6a')
    return a, 0
def smoke():
    a = A('shadow', cx=6, cy=12)
    paint_cm(a, cloud([(10, 6, 3.2), (6.5, 7.5, 2.6), (12.5, 9, 2.4), (8.5, 3.8, 2.2)]), {'1': '#9a9aa8', '2': '#6a6a7a'})
    paint_cm(a, cloud([(10, 5.6, 2.0), (7, 7, 1.4)]), {'1': '#c8c8d4', '2': '#9a9aa8'})
    sp(a, BOMB, 2, 10)
    dot(a, [(7, 10)], '#ffffff'); dot(a, [(8, 9), (6, 10), (7, 9)], '#ffd860')
    return a, 0
def venom():
    a = A('poison', cx=8, cy=8)
    dagger_at(a, 3, 3, 'ur', {'w': ('#c8ff9a', 5), 'M': ('#4aa030', 5)})
    for (x, y, c) in [(10, 7, '#9af060'), (10, 8, '#5ac040'), (8, 10, '#9af060'), (8, 11, '#9af060'), (8, 12, '#5ac040'), (11, 11, '#9af060')]: a.set(x, y, c)
    return a, 0
def shadow():
    a = A('dark', cx=8, cy=10)
    for i, (cx, cy) in enumerate([(5.5, 7.5), (8.5, 10.5), (11.5, 13.5)]):
        slash(a, crescent2((cx, cy), 4.6, (cx + 1.2, cy + 1.0), 4.4), ('#f0d8ff', '#c090ff', '#7a40c0', '#4a2080'))
    dagger_at(a, 6, 2, 'ur', {'w': ('#d8c0ff', 5), 'm': ('#9a70d0', 5), 'M': ('#5a3a90', 5)})
    return a, 0
def quickstep():
    a = A('teal', cx=9, cy=10)
    speed(a, [(0, 8, 2, 8), (0, 11, 3, 11), (0, 14, 3, 14)], '#d8fff8')
    sp(a, (['..w', '.wf', 'wff', '.ff'], WING_L[1]), 3, 4)
    sp(a, BOOT, 6, 5)
    return a, 0
def deadlyvenom():
    a = A('poison', cx=7.5, cy=8)
    sp(a, SKULL, 4, 4, {'e': ('#b8f080', 7), 'E': ('#5aa040', 7), 'k': ('#0e1a06', 1)})
    for (x, y) in [(5, 13), (5, 14), (9, 14), (9, 15), (10, 16), (7, 15)]: a.set(x, y, '#9af060')
    return a, 0
def blades():
    a = A('shadow', cx=7.5, cy=9.5, rays=8, rot=0.3, k=0.3)
    ring(a, 7.5, 9.5, 5.6, [(0, 360)], '#8a8ab0', w=0.5)
    dagger_at(a, 8, 1, 'ur'); dagger_at(a, 8, 10, 'dr'); dagger_at(a, -1, 10, 'dl'); dagger_at(a, -1, 1, 'ul')
    return a, 0
def vital():
    a = A('blood', cx=7.5, cy=10)
    sp(a, (grid(target(7.5, 10.5, 5.2)), TGT))
    dagger_at(a, 7, 2, 'ur')
    return a, 0
def parasting():
    a = A('thunder', cx=6, cy=12)
    cm = {}
    for i in range(10): cm[(3 + i, 15 - i)] = 'm' if i < 8 else 'w'
    cm[(2, 16)] = 'y'; cm[(1, 17)] = 'Y'
    paint_cm(a, bolt([(14, 1), (11, 4), (13, 5), (10, 8)]), {'w': '#ffffff', 'y': '#fff060'})
    paint_cm(a, bolt([(8, 3), (10, 6), (8, 7)]), {'w': '#ffffff', 'y': '#fff060'})
    sp(a, grid(cm), GOLD)
    dot(a, [(14, 4), (8, 2), (14, 9)], '#ffffff')
    return a, 0
def awk_rogue():
    a = A('evil', cx=7.5, cy=9.5)
    for y in range(20):
        for x in range(16):
            for d in ((x - y + 2.5), (x + y - 16.5)):
                if abs(d) < 0.8: a.set(x, y, '#ffffff')
                elif abs(d) < 1.8 and a.get(x, y) != (255, 255, 255): a.set(x, y, '#ff5a5a')
    sp(a, SKULL, 4, 6, {'e': ('#f0e8e0', 7), 'E': ('#a89890', 7), 'k': ('#3a0408', 1)})
    return a, 0
def awk2_rogue():
    a = A('shadow', cx=7.5, cy=9.5, cuts=[0.0, 0.3, 0.55, 0.8, 0.95])
    for (x0, y0) in [(2, 5), (11, 13), (4, 14), (12, 4)]:
        dot(a, [(x0, y0)], '#3a3a5a')
    for x in range(16):
        t = abs(x - 7.5) / 8
        a.set(x, 9, '#ffffff' if t < 0.75 else '#a8a8d0')
        if t < 0.45: a.set(x, 10, '#c8c8f0')
        if t < 0.2: a.set(x, 8, '#c8c8f0')
    dagger_at(a, 9, 1, 'ur', {'w': ('#e0e0ff', 5), 'M': ('#6a6a90', 5)})
    return a, 0
def voltstab():
    a = A('thunder', cx=8, cy=8)
    paint_cm(a, bolt([(1, 6), (4, 8), (2, 10), (5, 12)], w=0), {'w': '#fff060'})
    paint_cm(a, bolt([(14, 9), (11, 11), (13, 13), (10, 15)], w=0), {'w': '#fff060'})
    dagger_at(a, 3, 3, 'ur', {'w': ('#ffffb0', 5), 'M': ('#a0a060', 5)})
    dot(a, [(12, 3), (13, 5), (7, 12)], '#ffffff')
    return a, 0
ICONS = {'backstab': ('급소 찌르기', 'dmg', backstab), 'smoke': ('연막탄', 'buff', smoke), 'venom': ('독 바르기', 'dot', venom),
         'shadow': ('그림자 칼날', 'dmg', shadow), 'quickstep': ('잰걸음', 'none', quickstep), 'deadlyvenom': ('맹독', 'dot', deadlyvenom),
         'blades': ('칼날 폭풍', 'dmg', blades), 'vital': ('급소 노리기', 'none', vital), 'parasting': ('마비 침', 'dmg', parasting),
         'awk_rogue': ('그림자 처형', 'dmg', awk_rogue), 'awk2_rogue': ('무영참', 'dmg', awk2_rogue), 'voltstab': ('뇌전 찌르기', 'dmg', voltstab)}
