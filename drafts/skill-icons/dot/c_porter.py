"""짐꾼 8개 + 전사/짐꾼 3개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
def A(theme, **k): return bg(Art(), theme, **k)
def throwjunk():
    a = A('sky', cx=12, cy=6)
    for i in range(0, 13, 2): a.set(i, 17 - round(i * 1.5 - i * i * 0.05), '#ffffff')
    sp(a, SACK, 1, 11); sp(a, POT, 6, 7); sp(a, CRATE, 9, 2)
    speed(a, [(3, 9, 4, 8), (8, 5, 9, 4), (12, 9, 13, 8)], '#d8f0ff')
    return a, 0
def shout():
    a = A('warm', cy=10)
    arcs(a, 7.5, 10.5, [7.0, 8.6], [(150, 210), (-30, 30)], ['#ffffff', '#ffe0a0'])
    sp(a, BACKPACK, 2, 4)
    return a, 0
def sturdy():
    a = A('earth', cy=9, rays=8, k=0.3)
    sp(a, BACKPACK, 2, 4)
    sp(a, SACK, 11, 12)
    return a, 0
def packmule():
    a = A('green', cy=10)
    sp(a, MULE, 3, 4)
    sp(a, SACK, 1, 13); sp(a, CRATE, 10, 14)
    return a, 0
def shieldbag():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BACKPACK, 2, 4, glow_c='#bfe0ff')
    sp(a, ['bbbbb', 'bwbbB', 'bbbbB', '.bbB.', '..B..'], 5, 9, {'b': ('#6aa0ff', 12), 'B': ('#2a4aa0', 12), 'w': ('#ffffff', 1)})
    return a, 0
def w6_heater(w, h, x0, y0): return {}
def avalanche():
    a = A('earth', cx=4, cy=4, r=16)
    for (x, y) in [(2, 16), (6, 17), (10, 16), (13, 15), (1, 13), (14, 11)]: a.set(x, y, '#e0c090')
    sp(a, CRATE, 8, 2); sp(a, SACK, 3, 4); sp(a, CRATE, 5, 9); sp(a, SACK, 11, 8); sp(a, CRATE, 9, 13); sp(a, POT, 2, 13)
    speed(a, [(13, 2, 14, 5), (1, 8, 1, 11)], '#ffe8c0')
    return a, 0
def awk_porter():
    a = A('gold', rays=12, k=0.35, hole=4)
    glow(a, 7.5, 10.0, 7.0, ['#c08a18', '#ecc650', '#fff0a0'])
    sp(a, BACKPACK, 2, 4, {'l': ('#ffcc4a', 6), 'L': ('#b07a1a', 6), 't': ('#fff0c0', 7), 'T': ('#d0a860', 7)})
    for (x, y) in [(1, 4), (14, 6), (13, 16)]: plus(a, x, y)
    return a, 0
def awk2_porter():
    a = A('dawn', cy=16, r=16, rays=10, k=0.3, hole=5)
    sp(a, WAGON, 1, 9)
    for (x, y) in [(3, 3), (8, 1), (12, 4), (6, 6), (10, 7), (2, 7), (13, 8)]: sp(a, ['yY', 'YY'], x, y, GOLD)
    return a, 0
# 전사/짐꾼
def ironskin():
    a = A('ember', rays=8, k=0.35)
    sp(a, TORSO, 2, 5)
    for (x, y) in [(3, 4), (13, 15), (2, 15)]: plus(a, x, y, '#ffffff', '#e0e8ff')
    return a, 0
def dw_smash():
    a = A('earth', cy=16)
    for (x, y) in [(2, 16), (3, 15), (12, 15), (13, 16), (5, 17), (10, 17)]: a.set(x, y, '#c89050')
    burst(a, 8, 17, big=False, cols=('#ffffff', '#ffe0a0', '#e0a050'))
    sp(a, rot90(DWHAMMER[0]) if False else DWHAMMER[0], 2, 3, DWHAMMER[1])
    sp(a, ['.ss', 'sSS'], 1, 12, {'s': ('#b08050', 9), 'S': ('#7a5030', 9)}); sp(a, ['ss.', 'SSs'], 12, 11, {'s': ('#b08050', 9), 'S': ('#7a5030', 9)})
    return a, 0
def shockwave():
    a = A('earth', cy=15, r=14)
    for (rx, ry, c) in [(7.5, 2.6, '#ffe0a0'), (5.0, 1.7, '#ffffff'), (2.6, 0.9, '#ffffff')]:
        for (x, y) in ring_cells(7.5, 14.5, rx, ry, w=0.45): a.set(x, y, c)
    for (x, y, r) in [(2, 7, ['sS', 'SS']), (12, 6, ['sS', 'SS']), (6, 4, ['s']), (9, 9, ['s'])]:
        sp(a, ['.' * x + rr for rr in r], 0, y, {'s': ('#e0bc8a', 9), 'S': ('#9a7048', 9)})
    speed(a, [(4, 12, 3, 10), (11, 12, 12, 10), (7, 11, 7, 9)], '#fff0c8')
    return a, 0
ICONS = {'throwjunk': ('짐 던지기', 'dmg', throwjunk), 'shout': ('짐꾼의 함성', 'buff', shout), 'sturdy': ('튼튼한 등짐', 'none', sturdy),
         'packmule': ('짐 노새', 'none', packmule), 'shieldbag': ('짐 방패', 'buff', shieldbag), 'avalanche': ('짐 사태', 'dmg', avalanche),
         'awk_porter': ('거인의 등짐', 'buff', awk_porter), 'awk2_porter': ('대상단의 기적', 'buff', awk2_porter),
         'ironskin': ('강철 피부', 'none', ironskin), 'dw_smash': ('브론하임 강타', 'dmg', dw_smash), 'shockwave': ('충격파', 'dmg', shockwave)}
