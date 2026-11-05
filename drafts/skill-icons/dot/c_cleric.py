"""성직자 12개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
def A(theme, **k): return bg(Art(), theme, **k)
GCROSS = {'1': ('#8af07a', 8), '2': ('#2e9a3e', 8)}
WCROSS = {'1': ('#ffffff', 7), '2': ('#c8d0e0', 7)}
def wings(a, y=5, pal=None):
    sp(a, WING_L, 0, y, pal); sp(a, (flip(WING_L[0]), WING_L[1]), 9, y, pal)
def heal():
    a = A('heal')
    sp(a, grid(cross_cm(7.5, 9.5, 5.0, 3.4)), GCROSS)
    dot(a, [(2, 3), (13, 4), (12, 15)], '#ffffff'); plus(a, 3, 15, '#ffffff', '#c8ffc0')
    return a, 0
def bless():
    a = A('holy', cy=6)
    for y in range(7, 19):
        for x in range(16):
            if abs(x + 0.5 - 7.5) <= 1.2 + (y - 7) * 0.32 and (x + y) % 3: a.set(x, y, mix(a.get(x, y), '#fff4c0', 0.35))
    cm = {}
    for (x, y) in ring_cells(7.5, 5.0, 4.6, 1.6): cm[(x, y)] = 'y' if y <= 4 else 'Y'
    sp(a, grid(cm), GOLD)
    for (x, y) in [(3, 12), (12, 11), (7, 15)]: plus(a, x, y)
    return a, 0
def massheal():
    a = A('heal', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    ring(a, 7.5, 10.0, 6.6, [(0, 360)], '#b8f0a8', w=0.5)
    for (cx, cy) in [(7.5, 5.5), (3.5, 12.5), (11.5, 12.5)]: sp(a, grid(cross_cm(cx, cy, 2.2, 1.6)), GCROSS)
    return a, 0
def holy():
    a = A('holy', cy=3, r=16)
    for y in range(20):
        for x in range(16):
            u = abs(x + 0.5 - 7.5)
            if u < 2.2: a.set(x, y, '#fff8d8' if u < 1.1 else '#ffe890')
    sp(a, grid(cross_cm(7.5, 10.0, 4.4, 2.2)), {'1': ('#ffd84a', 6), '2': ('#c08a1c', 6)})
    return a, 0
def sanctuary():
    a = A('teal', cy=12)
    for (x, y) in ring_cells(7.5, 12.0, 7.4, 7.4):
        if y <= 12: a.set(x, y, '#bff8f0')
    sp(a, SHRINE, 3, 8)
    return a, 0
BIGHEART = (['.111..111.', '11w11111112'[:10], '1w11111112', '1111111122', '.11111122.', '..111122..', '...1122...', '....22....'], HEART[1])
def greatheal():
    a = A('rose', cuts=[0.0, 0.2, 0.4, 0.62, 0.84])
    ring(a, 7.5, 9.5, 7.0, [(0, 360)], '#ffc0d0', w=0.5)
    sp(a, BIGHEART, 3, 6)
    sp(a, grid(cross_cm(7.5, 9.0, 1.8, 1.2)), WCROSS)
    return a, 0
def smite():
    a = A('dawn', cy=17, r=16)
    sp(a, grid(cloud([(4.5, 4.0, 2.6), (8, 3.0, 3.0), (11.5, 4.5, 2.4)], 'w', 'f')), {'w': ('#ffffff', 7), 'f': ('#d8d0b0', 7)})
    paint_cm(a, bolt([(8, 7), (6, 10), (9, 11), (7, 15), (8, 18)]), {'w': '#ffffff', 'y': '#ffd040'})
    for (x, y) in [(3, 14), (12, 13), (2, 9), (13, 8)]: plus(a, x, y, '#ffffff', '#ffe890')
    return a, 0
def revival():
    a = A('heal', cy=12)
    glow(a, 7.5, 11.0, 5.2, ['#3a9a4a', '#5ac060', '#a8f090'])
    sp(a, SPROUT, 3, 8)
    for (x, y) in [(3, 5), (12, 4), (13, 12), (2, 13)]: plus(a, x, y, '#ffffff', '#d8ffc8')
    return a, 0
def cure():
    a = A('teal')
    sp(a, POTION, 4, 7, {'1': ('#7af0a0', 8), '2': ('#2a9a5a', 8)})
    for (x, y) in [(5, 4), (9, 3), (7, 2)]: plus(a, x, y, '#ffffff', '#c8fff0')
    dot(a, [(12, 8), (2, 10), (12, 14)], '#e0fff4')
    return a, 0
def awk_cleric():
    a = A('holy', rays=12, rot=0.1, k=0.25)
    wings(a, 7)
    cm = {}
    for (x, y) in ring_cells(7.5, 4.0, 3.4, 1.1): cm[(x, y)] = 'y'
    sp(a, grid(cm), GOLD)
    glow(a, 7.5, 11.0, 2.8, ['#ffe890', '#fff8d8', '#ffffff'])
    return a, 0
def awk2_cleric():
    a = A('dawn', cy=8, r=13)
    cm = {}
    for y in range(3, 18):
        for x in range(3, 13):
            dx = x + 0.5 - 7.5
            top = 3 + 4 - math.sqrt(max(0, 16 - dx * dx))
            if y >= top: cm[(x, y)] = 'e' if (x in (3, 12) or y < top + 1) else 'q'
    sp(a, grid(cm), {'e': ('#f4ecd8', 7), 'q': ('#fff4c0', 1)})
    for y in range(6, 18):
        for x in range(5, 11):
            if (x, y) in cm and cm[(x, y)] == 'q': a.set(x, y, '#ffffff' if abs(x + 0.5 - 7.5) < 1.2 else '#fff0a0')
    sp(a, (WING_L[0][1:], WING_L[1]), -2, 9); sp(a, (flip(WING_L[0])[1:], WING_L[1]), 11, 9)
    return a, 0
def holyhammer():
    a = A('holy', cy=6, rays=10, k=0.3)
    glow(a, 7.5, 5.5, 5.0, ['#ffe890', '#fff4c0'])
    sp(a, HAMMER, 3, 3)
    for (x, y) in [(2, 14), (13, 13), (12, 3)]: plus(a, x, y)
    return a, 0
ICONS = {'heal': ('치유', 'heal', heal), 'bless': ('축복', 'buff', bless), 'massheal': ('광역 치유', 'heal', massheal),
         'holy': ('신성한 빛', 'mdmg', holy), 'sanctuary': ('성역', 'buff', sanctuary), 'greatheal': ('대치유', 'heal', greatheal),
         'smite': ('천벌', 'mdmg', smite), 'revival': ('생명의 축복', 'heal', revival), 'cure': ('해독', 'buff', cure),
         'awk_cleric': ('신의 기적', 'heal', awk_cleric), 'awk2_cleric': ('천상의 기적', 'heal', awk2_cleric), 'holyhammer': ('성스러운 철퇴', 'mdmg', holyhammer)}
