"""레인저 6 · 용기사 7 · 저격수 5 · 신궁 4 · 음유시인 5 · 마에스트로 5"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from c_archer import arrow_u, arrow_dl, arrow_l, arrow_ul
from arrows import ar, arrow, arrow_s, recol, AP, GOLD_ALL, GOLDP
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
def note(a, x, y, two=False, c='#ffffff', out=True):
    s = NOTE2 if two else NOTE1
    if out: sp(a, s[0], x, y, {'1': (c, 1)})
    else: a.paint(s[0], {'1': c}, ox=x, oy=y)
# 레인저
def beastshot():
    a = A('green', cx=11, cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BOAR2, 4, 5)
    for (tx, y) in [(4, 4), (3, 14)]:
        line(a, 0, y, 1, y, '#d8ffd8')
        ar(a, 'r', tx, y, 1, small=True)
    return a, 0
def trap():
    a = A('earth', cy=13)
    sp(a, BEARTRAP, 2, 8)
    for (x, y) in [(3, 6), (12, 6), (7, 4)]: plus(a, x, y, '#ffffff', '#e0e0e8')
    return a, 0
WOLF_SIL = ['.....k..', '....kk..', '...kkk..', 'k.kkkk..', 'kkkkkk..', '.kkkkk..', '.kkkkkk.', '.kkkkkkk', '.kkkkkkk', '.kk.kk.k', 'kkk.kk.k']
def wolfcall():
    a = A('night', cx=9, cy=7)
    glow(a, 8.0, 8.5, 7.0, ['#6a70a8', '#b8bce0', '#e8eaf8', '#ffffff'])
    sp(a, WOLF_SIL, 3, 6, {'k': ('#141a30', 1)})
    return a, 0
def camouflage():
    a = A('green', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    cm = cloud([(4, 9, 3.0), (8, 7.5, 3.4), (12, 9.5, 2.8), (7.5, 11.5, 3.2), (3.5, 13, 2.4), (11.5, 13, 2.6)], 'g', 'G')
    for (x, y), c in list(cm.items()):
        if (x * 3 + y * 2) % 7 == 0: cm[(x, y)] = 'h'
    for p in [(5, 9), (6, 9), (9, 9), (10, 9)]: cm[p] = 'k'
    cm[(5, 9)] = 'e'; cm[(9, 9)] = 'e'
    sp(a, grid(cm), {'g': ('#4ab04a', 8), 'G': ('#2a7a34', 8), 'h': ('#8ae07a', 8), 'k': ('#0e1a0a', 1), 'e': ('#ffe060', 1)})
    return a, 0
def instinct():
    a = A('teal', rays=10, k=0.3)
    sp(a, PAW, 3, 5, {'1': ('#e8e0d0', 7)}, glow_c='#8af0e0')
    return a, 0
def arrowstorm():
    a = A('storm', cy=4)
    sp(a, grid(cloud([(3, 2.2, 2.6), (7.5, 1.4, 3.0), (12, 2.4, 2.6)], 'f', 'F')), {'f': ('#4a5a6e', 11), 'F': ('#2a3442', 11)})
    paint_cm(a, bolt([(9, 4), (8, 6), (10, 7)], w=0), {'w': '#fff060'})
    for (x, y) in [(1, 8), (6, 6), (14, 9), (4, 15), (12, 17)]:
        for k in range(3): a.set(x + k, y - k, mix('#ffffff', '#4a9cb4', k / 3))
    for (tx, ty) in [(3, 12), (8, 15), (13, 12), (6, 18), (11, 9)]: ar(a, 'dl', tx, ty, 2, small=True)
    return a, 0
def spear_dn(x0=0, y0=0): return SPEAR_DN
def jump():
    a = A('sky', cy=15)
    for i in range(12):
        t = i / 11; x = 2 + t * 11; y = 15 - math.sin(t * math.pi) * 11
        if i % 2 == 0: a.set(int(x), int(y), '#ffffff')
    sp(a, SPEAR_DN, 6, 3)
    burst(a, 11, 16, big=False)
    return a, 0
def dragonscale():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    for y in range(3, 17):
        for x in range(2, 14):
            if abs(x + 0.5 - 7.5) > 6 - max(0, y - 11) * 1.3: continue
            r = (y - 3) // 3; off = 2 if r % 2 else 0
            lx = (x + off) % 4; ly = (y - 3) % 3
            cm[(x, y)] = 'G' if ly == 2 or (ly == 1 and lx == 3) else ('h' if ly == 0 and lx == 1 else 'g')
    sp(a, grid(cm), {'g': ('#4ac07a', 8), 'G': ('#1a6a44', 8), 'h': ('#b0ffd0', 8)})
    return a, 0
def gale():
    a = A('wind', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for k in range(3):
        slash(a, crescent(7.5, 9.5, 6.6 - k * 1.6, k * 90, k * 90 + 200, 1.3, fade=0.6), ('#ffffff', '#c8ffe0', '#7ae0a0', '#3a9a64'))
    sp(a, rot90(SPEAR_DN[0]), 2, 4, SPEAR_DN[1])
    return a, 0
def skyfall():
    a = A('sky', cy=17, r=15)
    sp(a, grid(cloud([(2.5, 6.5, 2.2), (5, 5.5, 2.4), (11.5, 6.0, 2.4), (13.5, 7.0, 1.8)], 'w', 'f')), {'w': ('#ffffff', 7), 'f': ('#c8d8f0', 7)})
    for x in (4, 11):
        for y in range(1, 9): a.set(x, y, '#e0f0ff' if y % 2 else '#9ad4ff')
    sp(a, SPEAR_DN, 3, 3)
    burst(a, 8, 17, big=False)
    return a, 0
def wyvernfall():
    a = A('dawn', cy=16, r=16, rays=10, k=0.3, hole=4)
    sp(a, WYVERN, 0, 3)
    for x in (3, 7, 12):
        for y in range(0, 4): a.set(x, y, '#fff4c0')
    return a, 0
def dragonblood():
    a = A('blood', rays=10, k=0.35)
    rows_ = ['.111..111.', '1111111112', '1111111122', '1111111122', '.11111122.', '..111122..', '...1122...', '....22....']
    cm = {}
    for y, r in enumerate(rows_):
        for x, ch in enumerate(r):
            if ch == '.': continue
            lx = (x + (1 if (y // 2) % 2 else 0)) % 2; ly = y % 2
            cm[(x + 3, y + 6)] = 'S' if ly == 1 and lx == 0 else ('h' if ly == 0 and lx == 0 and y < 3 else ch)
    sp(a, grid(cm), {'1': ('#d82a2a', 13), '2': ('#8a0a14', 13), 'S': ('#7a0a10', 13), 'h': ('#ff8a6a', 13)})
    sp(a, ['yy', 'kk', 'yy'], 7, 8, {'y': ('#ffd040', 1), 'k': ('#1a0404', 1)}, fx=False)
    return a, 0
def dragonfall():
    a = A('fire', cy=16, r=15)
    for y in range(20):
        for x in range(16):
            u = abs(x + 0.5 - 7.5)
            if u < 4.6 - y * 0.08 and y < 14 and (x + y) % 2: a.set(x, y, '#ff8a2a' if u > 2 else '#ffc040')
    sp(a, SPEAR_DN, 3, 2, {'m': ('#fff0c0', 5), 'M': ('#e08a3a', 5)})
    burst(a, 8, 16, big=False)
    a.paint(['k...k', '.k.k.'], {'k': '#ffe060'}, ox=5, oy=1)
    return a, 0
# 저격수
def crosshair(a, cx, cy, r, c='#ff4a3a'):
    ring(a, cx, cy, r, [(0, 360)], c, w=0.5)
    for k in range(int(r) - 1, int(r) + 3):
        for (dx, dy) in ((k, 0), (-k, 0), (0, k), (0, -k)): a.set(int(cx + dx), int(cy + dy), c)
def headshot():
    a = A('shadow', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, SKULL, 4, 6)
    crosshair(a, 7.5, 9.5, 5.4)
    return a, 0
def steadyaim():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    disc(a, 7.5, 9.5, 5.6, '#0e2a30'); disc(a, 7.5, 9.5, 4.8, '#1a4a50')
    for x in range(2, 14): a.set(x, 9, '#bff0e8')
    for y in range(4, 16): a.set(7, y, '#bff0e8')
    sp(a, (grid(target(7.5, 9.5, 1.6, '13')), TGT))
    ring(a, 7.5, 9.5, 6.2, [(0, 360)], '#5a6a6e', w=0.6)
    return a, 0
def longshot():
    a = A('sky', cx=12, cy=4, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, (grid(target(12.5, 4.0, 2.2, '123')), TGT))
    for i in range(0, 12, 2):
        t = i / 11; a.set(int(1 + t * 8), int(18 - t * 10 - math.sin(t * math.pi) * 3), '#ffffff')
    ar(a, 'ur', 11, 6, 2, small=True)
    return a, 0
def piercearrow():
    a = A('steelb', cx=9, cy=9)
    cm = {}
    for y in range(4, 16):
        for x in range(6, 10): cm[(x, y)] = 'm' if x < 8 else 'M'
    for p_ in [(6, 5), (9, 5), (6, 14), (9, 14)]: cm[p_] = 'w'
    sp(a, grid(cm))
    for (x, y) in [(7, 8), (8, 8), (7, 10), (8, 10), (6, 7), (9, 11), (6, 11), (9, 7)]: a.set(x, y, '#2a2a34')
    ar(a, 'r', 15, 9, 5)
    for (x, y) in [(5, 6), (10, 12), (5, 12), (10, 6)]: a.set(x, y, '#ffffff')
    return a, 0
def deadeye():
    a = A('blood', rays=10, k=0.3)
    sp(a, EYE, 3, 6, {'1': ('#ff4a3a', 1), '2': ('#a01008', 1), '3': ('#1a0404', 1)})
    crosshair(a, 7.5, 9.5, 2.6, '#ffffff')
    return a, 0
# 신궁
def divinearrow():
    a = A('royal', rays=12, k=0.3)
    for k in range(5): a.set(1 + k, 17 - k, ['#8a8cf4', '#c0c4ff', '#fff4c0', '#ffe890', '#ffffff'][k])
    ar(a, 'ur', 13, 3, 3, GOLD_ALL, GOLDP)
    sp(a, (['..w', '.wf', 'wff'], WING_L[1]), 1, 10); sp(a, (['w..', 'fw.', 'ffw'], WING_L[1]), 5, 14)
    for (x, y) in [(14, 8), (8, 2)]: plus(a, x, y)
    return a, 0
def starfall():
    a = A('purple', cy=4)
    for (tx, ty) in [(3, 13), (8, 17), (12, 10)]:
        tail(a, tx + 3.0, ty - 3.0, tx + 8.0, ty - 8.0, 1.2, 0.3, ['#ffffff', '#fff0a0', '#e0b0ff', '#a060e0'])
        ar(a, 'dl', tx, ty, 1, GOLD_ALL, GOLDP, small=True)
    for (x, y) in [(2, 3), (7, 2), (14, 15), (1, 9)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def godseye():
    a = A('gold', rays=14, k=0.35)
    sp(a, TRI_EYE, 1, 6)
    return a, 0
def lastarrow():
    a = A('dawn', cy=17, r=16)
    for y in range(20):
        for x in range(16):
            u = abs(x + 0.5 - 7.5)
            if u < 2.8: a.set(x, y, '#fff4c0' if u < 1.4 else '#ffd870')
    ar(a, 'd', 7, 16, 7, GOLD_ALL, GOLDP)
    burst(a, 7, 17, big=False)
    return a, 0
def ballad():
    a = A('rose', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, LUTE, 2, 5)
    note(a, 10, 2); note(a, 11, 9, True)
    return a, 0
def lullaby():
    a = A('night', cy=6)
    sp(a, MOON_C, 2, 4, {'1': ('#fff0a0', 6)})
    a.paint(['zzz', '..z', '.z.', 'zzz'], {'z': '#ffffff'}, ox=9, oy=3)
    a.paint(['zz', '.z', 'zz'], {'z': '#c8c8ff'}, ox=12, oy=8)
    note(a, 6, 12, c='#c8d8ff'); note(a, 10, 13, True, '#ffffff')
    return a, 0
def hymn():
    a = A('heal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HARP, 2, 6)
    note(a, 10, 3, c='#c8ffc0'); note(a, 11, 11, c='#ffffff')
    sp(a, (['1.1', '111', '.1.'], {'1': ('#ff6a8a', 13)}), 12, 7)
    return a, 0
def marchsong():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, DRUM, 3, 7)
    note(a, 2, 1); note(a, 10, 2, True)
    return a, 0
def warsong():
    a = A('blood', cy=10)
    sp(a, TRUMPET, 1, 7)
    note(a, 9, 1, c='#ff8a8a'); note(a, 11, 12, True, '#ffffff')
    arcs(a, 14.0, 9.5, [2.2, 3.6], [(-60, 60)], ['#ffffff', '#ffb0a0'])
    return a, 0
# 마에스트로
def symphony():
    a = A('purple', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for i in range(14):
        t = i / 13; x = 2 + t * 12; y = 12 - math.sin(t * 3.2) * 4 - t * 2
        a.set(int(x), int(y), '#e0c0ff'); a.set(int(x), int(y) + 1, '#9a6ad0')
    note(a, 3, 4); note(a, 9, 9, True); note(a, 11, 1)
    sp(a, ['w....', '.w...', '..w..', '...ll', '...lL'], 1, 13, {'w': ('#ffffff', 7), 'l': ('#3a2a1a', 1), 'L': ('#3a2a1a', 1)})
    return a, 0
def requiem():
    a = A('shadow', cy=12)
    glow(a, 7.5, 6.0, 3.0, ['#3e3e60', '#56567c'])
    sp(a, CANDLE, 4, 8)
    note(a, 2, 2, c='#d8d8ff'); note(a, 10, 3, True, '#ffffff')
    return a, 0
def overture():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    cm = {}
    for y in range(4, 16):
        for x in range(2, 14): cm[(x, y)] = 'e' if x < 13 else 'E'
    for y in (6, 8, 10, 12): 
        for x in range(3, 13): cm[(x, y)] = 'f'
    for (x, y) in [(5, 9), (5, 10), (8, 7), (8, 8), (11, 11), (11, 12), (6, 7), (6, 8)]: cm[(x, y)] = 'k'
    for y in range(4, 16): cm[(2, y)] = 't'
    sp(a, grid(cm), {'e': ('#f4ecd8', 7), 'E': ('#c8b898', 7), 'f': ('#8a7a6a', 7), 'k': ('#1a1414', 1), 't': ('#c08a4a', 3)})
    return a, 0
def encore():
    a = A('pink', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (x, y) in ring_cells(7.5, 9.5, 5.6, 5.6, w=0.7):
        ang = math.degrees(math.atan2(y + 0.5 - 9.5, x + 0.5 - 7.5)) % 360
        if not (80 < ang < 110 or 260 < ang < 290): a.set(x, y, '#ffffff')
    a.paint(['w..', 'ww.', 'www'], {'w': '#ffffff'}, ox=8, oy=2); a.paint(['www', '.ww', '..w'], {'w': '#ffffff'}, ox=5, oy=15)
    note(a, 5, 6, True, '#ffd0f0')
    return a, 0
def grandfinale():
    a = A('night', cy=14)
    for (cx, cy, c) in [(3, 4, '#ff6a8a'), (12, 3, '#ffe060'), (12, 11, '#6ad0ff'), (2, 12, '#8af07a')]:
        for ang in range(0, 360, 45):
            for k in (1, 2): a.set(round(cx + math.cos(math.radians(ang)) * k * 1.3), round(cy + math.sin(math.radians(ang)) * k * 1.3), c if k == 2 else '#ffffff')
    sp(a, (['..1111111', '..1.....1', '..1.....1', '..1.....1', '..1.....1', '111...111', '111...111'], {}), 3, 6, {'1': ('#ffd84a', 6)})
    return a, 0
BOAR2 = (['......FF.FF.',
          '.....FFFFFFF',
          '...FFFFFFFFF',
          '..FFFeFFFFFF',
          '.FFFFFFFFFFF',
          'ffffFFFFFFFF',
          'fkffFFFFFFF.',
          'ffffwFFFFF..',
          '...ww.......'], {'F': ('#6a4630', 3), 'f': ('#d89a8a', 2), 'k': ('#3a1a10', 1), 'e': ('#ff4a3a', 1), 'w': ('#fff8f0', 7)})
ICONS = {'beastshot': ('짐승 사냥', 'dmg', beastshot), 'trap': ('덫 놓기', 'dot', trap), 'wolfcall': ('늑대 부르기', 'dmg', wolfcall), 'camouflage': ('위장', 'buff', camouflage), 'instinct': ('사냥꾼의 감', 'none', instinct), 'arrowstorm': ('화살 폭우', 'dmg', arrowstorm),
         'jump': ('도약 찌르기', 'dmg', jump), 'dragonscale': ('용의 비늘', 'none', dragonscale), 'gale': ('창 돌풍', 'dmg', gale), 'skyfall': ('하늘 낙하', 'dmg', skyfall), 'wyvernfall': ('와이번 강하', 'dmg', wyvernfall), 'dragonblood': ('용의 피', 'none', dragonblood), 'dragonfall': ('용의 낙하', 'dmg', dragonfall),
         'headshot': ('헤드샷', 'dmg', headshot), 'steadyaim': ('정조준', 'buff', steadyaim), 'longshot': ('원거리 사격', 'dmg', longshot), 'piercearrow': ('철갑 화살', 'dmg', piercearrow), 'deadeye': ('데드아이', 'none', deadeye),
         'divinearrow': ('신궁의 화살', 'dmg', divinearrow), 'starfall': ('별똥별 화살', 'dmg', starfall), 'godseye': ('신의 눈', 'none', godseye), 'lastarrow': ('심판의 화살', 'dmg', lastarrow),
         'ballad': ('용기의 노래', 'buff', ballad), 'lullaby': ('자장가', 'mdmg', lullaby), 'hymn': ('치유의 세레나데', 'heal', hymn), 'marchsong': ('행진곡', 'buff', marchsong), 'warsong': ('전쟁가', 'buff', warsong),
         'symphony': ('교향곡', 'buff', symphony), 'requiem': ('진혼곡', 'mdmg', requiem), 'overture': ('서곡', 'heal', overture), 'encore': ('앙코르', 'buff', encore), 'grandfinale': ('장엄한 피날레', 'buff', grandfinale)}
