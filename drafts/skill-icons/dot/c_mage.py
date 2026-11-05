"""마법사 13개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
def A(theme, **k): return bg(Art(), theme, **k)
FIREP = {'1': ('#fff0a0', 14), '2': ('#ffa030', 14), '3': ('#d8420e', 14)}
def fireball():
    a = A('fire', cx=10, cy=8)
    for (y0, ph) in [(6, 0.0), (8, 1.4), (10, 2.6)]:
        for x in range(1, 10):
            a.set(x, y0 + round(math.sin(x * 0.9 + ph) * 0.8), ['#7a1a0a', '#a02a0a', '#d8420e', '#ff8a2a', '#ffb040'][min(4, x // 2)])
    tail(a, 10.0, 8.5, 1.0, 7.0, 3.2, 0.8, ['#fff0a0', '#ffc040', '#ff8a2a', '#e04a10'])
    glow(a, 10.8, 8.5, 4.0, ['#c02a0a', '#ff6a1a', '#ffa030', '#ffe070', '#fff8d0'])
    return a, 0
def icelance():
    a = A('ice', cx=11, cy=6)
    sp(a, grid(spike((13.5, 3.5), (2.5, 15.5), 2.0)), {'a': ('#bff0ff', 12), 'A': ('#4a9ae0', 12), 'w': ('#ffffff', 1)})
    dot(a, [(5, 8), (8, 15), (11, 11), (3, 11)], '#ffffff'); dot(a, [(6, 7), (12, 12)], '#9ad8ff')
    return a, 0
def chain():
    a = A('thunder', cy=10)
    paint_cm(a, bolt([(3, 3), (5, 6), (4, 8), (8, 10)]), {'w': '#ffffff', 'y': '#fff060'})
    paint_cm(a, bolt([(8, 10), (11, 9), (10, 12), (13, 14)]), {'w': '#ffffff', 'y': '#fff060'})
    paint_cm(a, bolt([(8, 10), (7, 13), (5, 15)]), {'w': '#ffffff', 'y': '#fff060'})
    for (x, y) in [(3, 3), (8, 10), (13, 14), (5, 15)]: plus(a, x, y, '#ffffff', '#c0a8ff')
    return a, 0
def mburst():
    a = A('blood', cuts=[0.0, 0.3, 0.5, 0.7, 0.9])
    for y in range(20):
        for x in range(16):
            dx, dy = x + 0.5 - 7.5, y + 0.5 - 9.5; d = math.hypot(dx, dy); th = math.atan2(dy, dx)
            e = 6.2 + 1.6 * math.cos(th * 10)
            if d < e: a.set(x, y, '#e8401a' if d > e - 1.6 else '#ffa030' if d > 3.4 else '#fff0a0' if d > 1.8 else '#ffffff')
    return a, 0
def meteor():
    a = A('fire', cx=5, cy=14, r=14)
    tail(a, 6.0, 12.5, 15.5, 1.5, 3.4, 1.0, ['#fff0a0', '#ffc040', '#ff8a2a', '#d8420e', '#8a1a0a'])
    cm = orb(5.5, 13.0, 3.6, 'fFd')
    for p in [(4, 12), (5, 13), (6, 12), (3, 14), (6, 15)]: cm[p] = 'o'
    sp(a, grid(cm), {'f': ('#a87a5a', 11), 'F': ('#6a4a34', 11), 'd': ('#3a261a', 11), 'o': ('#ff8a2a', 1)})
    return a, 0
def manashield():
    a = A('arcane', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x, y) in hex_ring(7.5, 9.5, 7.0, 0.55): a.set(x, y, '#bfe8ff')
    for (x, y) in hex_ring(7.5, 9.5, 5.6, 0.45): a.set(x, y, '#6a8aff')
    paint_cm(a, poly_cells(star_poly(7.5, 9.5, 3.6, 1.5, 6, -90), '1'), {'1': '#e0f0ff'})
    plus(a, 7, 9, '#ffffff', '#ffffff')
    return a, 0
def blizzard():
    a = A('ice', cy=8)
    speed(a, [(0, 5, 5, 2), (3, 12, 9, 8), (8, 17, 14, 13), (9, 6, 13, 3)], '#e8f8ff')
    sp(a, SNOW, 2, 5); sp(a, SNOW, 8, 9); sp(a, (['.w.', 'wcw', '.w.'], SNOW[1]), 11, 3); sp(a, (['.w.', 'wcw', '.w.'], SNOW[1]), 3, 13)
    return a, 0
BOOK = (['.wwww..wwww.',
         'wwwwwwwwwwww',
         'wffffwwffffw',
         'wwwwwwwwwwww',
         'wffffwwffffw',
         'wwwwwwwwwwww',
         'ppppppwppppp',
         '.PPPPPPPPPP.'], {'w': ('#f4ecd8', 7), 'f': ('#a89878', 7), 'p': ('#8a4ad0', 10), 'P': ('#4a2480', 10)})
def arcane():
    a = A('arcane', cy=6)
    ring(a, 7.5, 6.0, 3.6, [(0, 360)], '#c0b0ff', w=0.5)
    paint_cm(a, poly_cells(star_poly(7.5, 6.0, 2.8, 1.2, 5), '1'), {'1': '#ffffff'})
    sp(a, BOOK, 2, 10)
    return a, 0
def sa_mirage():
    a = A('sand', cy=6, r=13)
    glow(a, 7.5, 6.0, 4.2, ['#ff9a3a', '#ffc860', '#fff0b0'])
    for (y, ph) in [(10, 0), (12, 1.6)]:
        for x in range(16): a.set(x, y + round(math.sin(x * 0.9 + ph) * 0.6), '#ffe0a0')
    for y in range(14, 20):
        for x in range(16):
            if y >= 14 + 1.8 * math.sin(x * 0.45 + 0.5) + 1.2: a.set(x, y, '#d8a050' if (x + y) % 5 else '#b07a30')
    return a, 0
def iceprison():
    a = A('ice', cy=9)
    cm = {}
    for y in range(3, 17):
        for x in range(3, 14):
            top = y < 6 and x >= 3 + (6 - y) and x <= 11 + (6 - y) - 1
            front = y >= 6 and x <= 10
            side = x >= 11 and y >= 6 - (x - 11) and y <= 16 - (x - 11) * 0
            if y < 6 and 3 + (6 - y) <= x <= 13 - (y - 3) * 0: cm[(x, y)] = 'c'
            elif y >= 6 and x <= 10: cm[(x, y)] = 'a'
            elif y >= 6 - (x - 10) and y <= 16 and x >= 11: cm[(x, y)] = 'A'
    for (x, y) in [(5, 9), (6, 8), (7, 8), (8, 9), (5, 10), (6, 10), (7, 10), (8, 10), (5, 11), (6, 11), (7, 11), (8, 11), (6, 12), (7, 12), (5, 13), (8, 13), (6, 9), (7, 9)]: cm[(x, y)] = 'q'
    cm[(6, 9)] = 'r'; cm[(7, 9)] = 'r'
    for (x, y) in [(4, 7), (4, 8), (9, 14)]: cm[(x, y)] = 'w'
    sp(a, grid(cm), {'c': ('#e0f8ff', 12), 'a': ('#9ad8f4', 12), 'A': ('#4a90c8', 12), 'q': ('#2a3a6a', 1), 'r': ('#ff4a3a', 1)})
    return a, 0
def awk_mage():
    a = A('blood', cy=12)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5; top = 3 + 2.2 * abs(math.sin(x * 1.3)) + abs(u) * 0.5
            if y >= top: a.set(x, y, '#fff0a0' if y > top + 5 and abs(u) < 3 else '#ffa030' if y > top + 2 else '#e04a10')
    sp(a, SKULL, 4, 7, {'e': ('#3a0a06', 1), 'E': ('#1e0404', 1), 'k': ('#ffd040', 1)})
    return a, 0
def awk2_mage():
    a = A('night', cx=5, cy=14)
    dot(a, [(2, 3), (6, 1), (13, 12), (1, 8), (11, 16)], '#ffffff')
    tail(a, 7.0, 10.5, 15.5, 1.0, 3.2, 0.8, ['#ffffff', '#fff0a0', '#ffc860', '#ff8a4a', '#a04aa0'])
    sp(a, grid(poly_cells(star_poly(6.5, 11.0, 4.4, 2.0, 5, -100), 'y')), {'y': ('#fff4a0', 6)})
    for x in range(16):
        for y in range(17, 20): a.set(x, y, '#3a2a6a' if y == 17 else '#24184a')
    return a, 0
def thunderclap():
    a = A('thunder', cy=14)
    sp(a, grid(cloud([(4.5, 4.5, 2.6), (8, 3.5, 3.0), (11.5, 5.0, 2.4), (7.5, 5.5, 2.5)], 'f', 'F')), {'f': ('#6a6a8a', 11), 'F': ('#3a3a5a', 11)})
    paint_cm(a, bolt([(8, 8), (6, 11), (9, 12), (6, 16), (8, 18)]), {'w': '#ffffff', 'y': '#fff060'})
    burst(a, 8, 17, big=False)
    return a, 0
ICONS = {'fireball': ('화염구', 'mdmg', fireball), 'icelance': ('얼음 창', 'mdmg', icelance), 'chain': ('연쇄 번개', 'mdmg', chain),
         'burst': ('마나 폭주', 'mdmg', mburst), 'meteor': ('운석 낙하', 'mdmg', meteor), 'manashield': ('마나 보호막', 'buff', manashield),
         'blizzard': ('눈보라', 'mdmg', blizzard), 'arcane': ('비전 숙련', 'none', arcane), 'sa_mirage': ('사막의 신기루', 'mdmg', sa_mirage),
         'iceprison': ('얼음 감옥', 'mdmg', iceprison), 'awk_mage': ('종말의 불꽃', 'mdmg', awk_mage), 'awk2_mage': ('별의 종언', 'mdmg', awk2_mage),
         'thunderclap': ('뇌격', 'mdmg', thunderclap)}
