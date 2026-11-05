"""의사 5 · 마검사 5 · 별검사 5 · 사제 6 · 대주교 5 · 역병 의사 6 · 퇴마사 5 · 심문관 4 · 섞인 계열 11"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from c_g1 import vsword_up
from c_g2 import note
import w5, w6
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
PSL = ('#ffffff', '#f0d8ff', '#c090ff', '#7a40c0')
def elixir():
    a = A('rose', rays=12, k=0.3)
    sp(a, ELIXIR, 4, 5, {'1': ('#ff8ac0', 16), '2': ('#c04a80', 16)})
    for (x, y) in [(2, 4), (13, 5), (12, 15), (3, 15)]: plus(a, x, y)
    return a, 0
def cureall():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HAND, 1, 9)
    for i in range(9): a.set(6 + i, 9 - i, '#e0e8f4' if i < 7 else '#ffffff')
    for i in range(10): a.set(3 + i, 4 + round(math.sin(i * 0.8) * 1.5), '#ff8a8a')
    return a, 0
def surgeon():
    a = A('heal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, STETHO, 3, 4)
    sp(a, grid(cross_cm(12.0, 15.0, 1.8, 1.2)), {'1': ('#ffffff', 7), '2': ('#c8d0e0', 7)})
    return a, 0
def regenall():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, IVBAG, 4, 3)
    for (x, y) in [(2, 12), (12, 8), (11, 15)]: plus(a, x, y, '#ffffff', '#a8f0c0')
    return a, 0
def blackdeath():
    a = A('poison', cuts=[0.0, 0.15, 0.3, 0.48, 0.66])
    glow(a, 7.5, 12.0, 6.0, ['#58861a', '#80b028', '#b0d860'])
    paint_cm(a, cloud([(4, 4, 2.4), (8, 3, 2.6), (12, 4, 2.2)]), {'1': '#3a5a24', '2': '#2a4418'})
    sp(a, RAT, 2, 9)
    return a, 0
def flameblade():
    a = A('fire', cy=8)
    for y in range(20):
        for x in range(16):
            u = abs(x + 0.5 - 7.5)
            if u < 3.0 - (y - 2) * 0.06 and 1 <= y <= 12 and (x * 5 + y * 3) % 4: a.set(x, y, '#ffc040' if u < 1.6 else '#ff6a1a')
    sp(a, vsword_up(7, 2, 9), {'w': ('#fff0c0', 5), 'M': ('#e08a3a', 5), **GOLD})
    return a, 0
def frostblade():
    a = A('ice', cy=8)
    sp(a, vsword_up(7, 2, 9), {'w': ('#ffffff', 5), 'M': ('#6ab0e8', 5), **GOLD})
    for (x, y) in [(5, 4), (10, 6), (5, 9), (10, 3), (4, 12)]: a.paint(['.c.', 'cwc', '.c.'], {'c': '#bff0ff', 'w': '#ffffff'}, ox=x - 1, oy=y - 1)
    return a, 0
def thunderblade():
    a = A('thunder', cy=8)
    paint_cm(a, bolt([(9, 3), (12, 5), (11, 7), (14, 9)]), {'w': '#ffffff', 'y': '#fff060'})
    paint_cm(a, bolt([(6, 6), (3, 8), (4, 10), (1, 12)]), {'w': '#ffffff', 'y': '#fff060'})
    sp(a, vsword_up(7, 2, 9), {'w': ('#ffffd0', 5), 'M': ('#b0a040', 5), **GOLD})
    return a, 0
def arcaneguard():
    a = A('arcane', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    ring(a, 7.5, 9.5, 6.6, [(0, 360)], '#c0b0ff', w=0.5)
    paint_cm(a, poly_cells(star_poly(7.5, 9.5, 5.8, 2.6, 6, -90), '1'), {'1': '#4a2cc0'})
    sp(a, vsword_up(7, 2, 9))
    return a, 0
def spellsword():
    a = A('purple', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    slash(a, crescent2((8.0, 10.0), 7.2, (9.8, 11.4), 6.9), PSL)
    sp(a, w5.SWORD_UR, 0, 1, w5.HILT)
    return a, 0
def starblade():
    a = A('night', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, vsword_up(7, 2, 9), {'w': ('#e0f0ff', 5), 'M': ('#7a9ad8', 5), **GOLD})
    for (x, y) in [(4, 4), (11, 6), (4, 10), (11, 11), (10, 2)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def manaburst():
    a = A('arcane', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for y in range(20):
        for x in range(16):
            dx, dy = x + 0.5 - 7.5, y + 0.5 - 10.5; d = math.hypot(dx, dy); th = math.atan2(dy, dx)
            if d < 6.5 + 1.2 * math.cos(th * 9): a.set(x, y, '#5a8aff' if d > 4.5 else '#a8d0ff')
    a.paint(['..kk..', '..kk..', '.kkkk.', 'k.kk.k', '..kk..', '.k..k.', '.k..k.'], {'k': '#1a1a4a'}, ox=5, oy=7)
    return a, 0
def starward():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, grid(poly_cells(star_poly(7.5, 10.0, 6.6, 3.0, 5), 'y')), {'y': ('#ffd84a', 6)}, glow_c='#a8c8ff')
    plus(a, 7, 9, '#ffffff', '#fff6c8')
    return a, 0
def dimension():
    a = A('purple', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for y in range(20):
        for x in range(16):
            d = (x - 7.5) + (y - 9.5) * 0.9; t = abs((x - 7.5) - (y - 9.5)) / 12
            w = 2.4 * max(0, 1 - t * t)
            if abs(d) < w * 0.6: a.set(x, y, '#04020a')
            elif abs(d) < w: a.set(x, y, '#e0c0ff')
    for (x, y) in [(7, 9), (6, 11), (9, 8)]: a.set(x, y, '#ffffff')
    return a, 0
def swordsaint():
    a = A('storm', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for k in range(2): slash(a, crescent(7.5, 9.5, 7.0, k * 180, k * 180 + 150, 1.8, fade=0.7), ('#ffffff', '#c8f0ff', '#6ac0e0', '#2a7a9a'))
    paint_cm(a, bolt([(12, 2), (10, 5), (13, 7)]), {'w': '#ffffff', 'y': '#fff060'})
    sp(a, vsword_up(7, 2, 9), {**GOLD})
    return a, 0
def prayer():
    a = A('holy', cy=6, rays=10, k=0.3)
    sp(a, ROSARY, 2, 4)
    return a, 0
def grace():
    a = A('sky', rays=10, k=0.3)
    sp(a, DOVE, 2, 6)
    for (x, y) in [(3, 3), (12, 3), (12, 15)]: plus(a, x, y)
    return a, 0
def restore():
    a = A('heal', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x, y) in ring_cells(7.5, 9.5, 6.4, 6.4, w=0.7): a.set(x, y, '#e8ffd8')
    sp(a, grid(cross_cm(7.5, 9.5, 3.6, 2.4)), {'1': ('#8af07a', 8), '2': ('#2e9a3e', 8)})
    return a, 0
def purify():
    a = A('holy', cy=12)
    FL = ['....1.....', '...11.1...', '..1121.1..', '..12221...', '.1222221..', '.12223221.', '1223333221', '1233333321', '.12333321.', '..122221..']
    a.paint(FL, {'1': '#8ad0ff', '2': '#d8f4ff', '3': '#ffffff'}, ox=3, oy=5)
    return a, 0
def holyshield():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    glow(a, 7.5, 9.5, 6.4, ['#ffd84a', '#fff0a0', '#fff8e0'])
    sp(a, grid(cross_cm(7.5, 9.5, 3.0, 1.8)), {'1': ('#ffd84a', 6), '2': ('#c08a1c', 6)})
    dot(a, [(4, 5), (5, 4)], '#ffffff')
    return a, 0
def sacredsong():
    a = A('dawn', cy=8)
    arcs(a, 7.5, 9.0, [6.4, 7.8], [(150, 210), (-30, 30)], ['#ffffff', '#ffe0a0'])
    sp(a, BELL, 3, 4)
    return a, 0
def miracle():
    a = A('holy', rays=14, k=0.3)
    sp(a, (WING_L[0][1:], WING_L[1]), -1, 8); sp(a, (flip(WING_L[0])[1:], WING_L[1]), 10, 8)
    burst(a, 7, 9)
    return a, 0
def holyland():
    a = A('dawn', cy=6, rays=10, k=0.3)
    sp(a, CATHEDRAL, 1, 6)
    return a, 0
def archangel():
    a = A('holy', rays=14, k=0.3)
    sp(a, ANGEL, 0, 3)
    return a, 0
def resurrect():
    a = A('dawn', cy=14, r=15)
    sp(a, PHOENIX, 0, 4)
    for y in range(15, 20):
        for x in range(16):
            if (x + y) % 3 == 0: a.set(x, y, '#ffc040')
    return a, 0
def dawnlight():
    a = A('dawn', cy=13, r=13, rays=14, k=0.35, hole=3)
    glow(a, 7.5, 13.0, 4.0, ['#ffa030', '#ffd060', '#fff4c0'])
    for y in range(13, 20):
        for x in range(16): a.set(x, y, '#3a2270' if y > 13 else '#ffd060')
    return a, 0
def miasma():
    a = A('poison', cy=8)
    paint_cm(a, cloud([(4, 6, 2.6), (8, 4.5, 3.0), (12, 6, 2.6)]), {'1': '#9ad060', '2': '#5a8a2a'})
    sp(a, FLASK, 4, 9, {'1': ('#8af050', 8), '2': ('#3a8a2a', 8)})
    return a, 0
def remedy():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    import spr as S
    sp(a, S.MAPSCROLL[0], 2, 4, {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'e': ('#f4ecd8', 7), 'k': ('#6a6a7a', 7), 'r': ('#3ab04a', 1), 'g': ('#6a6a7a', 7)})
    sp(a, PILL, 7, 13)
    return a, 0
def quarantine():
    a = A('amber', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(7, 13):
        for x in range(16): a.set(x, y, '#ffd84a' if (x + y) % 4 < 2 else '#1a1414')
    for x in (2, 13):
        for y in range(5, 17): a.set(x, y, '#8a94a8')
    sp(a, ['..rr..', '.rwwr.', 'rwrrwr', 'rwrrwr', '.rwwr.', '..rr..'], 5, 1, {'r': ('#e83a3a', 13), 'w': ('#ffffff', 7)})
    return a, 0
def vaccine():
    a = A('sky', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, SYRINGE, 2, 4)
    for (x, y) in [(3, 4), (12, 14)]: plus(a, x, y)
    return a, 0
def panacea():
    a = A('rose', rays=12, k=0.3)
    import spr as S
    cm = {}
    rows_ = S.POTION[0]
    for y, r in enumerate(rows_):
        for x, ch in enumerate(r):
            if ch in '12': cm[(x, y)] = 'abcd'[min(3, max(0, y - 3))]
    sp(a, POTION, 4, 6, {'1': ('#ff8ac0', 16), '2': ('#8a6aff', 16)})
    for (x, y), ch in cm.items(): a.set(x + 4, y + 6, {'a': '#ff6a6a', 'b': '#ffd060', 'c': '#6ad06a', 'd': '#6aa0ff'}[ch])
    for (x, y) in [(3, 4), (12, 5), (12, 15)]: plus(a, x, y)
    return a, 0
def epidemic():
    a = A('poison', cy=10)
    paint_cm(a, cloud([(3, 15, 2.6), (8, 16, 3.0), (13, 15, 2.6)]), {'1': '#8ab050', '2': '#4a7a2a'})
    sp(a, BEAK, 2, 4)
    return a, 0
def banish():
    a = A('holy', rays=12, k=0.3)
    sp(a, TALISMAN, 5, 4, glow_c='#fff0a0')
    return a, 0
def sealing():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for i in range(18):
        for (x, y) in [(i - 1, round(1 + i * 1.0)), (16 - i, round(1 + i * 1.0))]:
            a.set(x, y, '#d8e0ec' if i % 2 else '#6a7490')
    glow(a, 7.5, 9.5, 4.0, ['#c08a1c', '#ffd84a', '#fff4c0'])
    ring(a, 7.5, 9.5, 3.0, [(0, 360)], '#8a5a10', w=0.45)
    a.paint(['.k.', 'kkk', '.k.', '.k.'], {'k': '#8a5a10'}, ox=6, oy=8)
    return a, 0
def holywater():
    a = A('sky', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, VIAL, 4, 5)
    for (x, y) in [(2, 3), (12, 2), (13, 6), (2, 9), (12, 12)]: a.set(x, y, '#bfe8ff'); a.set(x, y + 1, '#6ab0e8')
    return a, 0
def wardcircle():
    a = A('teal', cy=13)
    for (x, y) in ring_cells(7.5, 14.0, 7.0, 2.6, w=0.6): a.set(x, y, '#bff8f0')
    for (x, y) in ring_cells(7.5, 14.0, 4.8, 1.6, w=0.5): a.set(x, y, '#8ae0d0')
    for (x, y) in ring_cells(7.5, 14.0, 7.0, 10.0, w=0.5):
        if y < 14: a.set(x, y, '#5ac8c4')
    plus(a, 7, 8, '#ffffff', '#bff8f0')
    return a, 0
def exorcism():
    a = A('holy', cx=2, cy=3, r=16)
    for (x0, y0, x1, y1) in [(0, 0, 9, 9), (3, 0, 11, 8), (0, 4, 8, 12)]: line(a, x0, y0, x1, y1, '#fff8d8')
    sp(a, GHOST, 6, 7, {'w': ('#c8e8ff', 7)})
    for (x, y) in [(15, 8), (15, 12), (14, 15)]: a.set(x, y, '#c8e8ff')
    return a, 0
def verdict():
    a = A('holy', cy=14, rays=10, k=0.3)
    sp(a, rot90(GAVEL[0]), 3, 3, GAVEL[1])
    sp(a, ['tttttt', 'TTTTTT'], 5, 15, {'t': ('#a8642e', 3), 'T': ('#6a3a1a', 3)})
    burst(a, 8, 13, big=False)
    return a, 0
def pyre():
    a = A('fire', cy=14)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 6 + 2.5 * abs(math.sin(x * 1.2)) + abs(u) * 0.4: a.set(x, y, '#ffd060' if y > 14 and abs(u) < 3 else '#ff8a2a' if y > 11 else '#d8420e')
    sp(a, ['...tT...', '...tT...', 'tttttTTT', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...', '...tT...'], 4, 3, {'t': ('#7a4c22', 3), 'T': ('#4a2a10', 3)})
    sp(a, ['tttttttttt', 'TTTTTTTTTT'], 3, 16, {'t': ('#8a5a2a', 3), 'T': ('#5a3010', 3)})
    return a, 0
def inquisition():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    book = ['tttttttttt', 'teeeeeeeeT', 'teeeyyeeeT', 'teeyyyyeeT', 'teeeyyeeeT', 'teeeyyeeeT', 'teeeeeeeeT', 'TTTTTTTTTT']
    sp(a, book, 3, 6, {'t': ('#8a2a2a', 13), 'T': ('#4a1010', 13), 'e': ('#5a1a1a', 13), 'y': ('#ffd84a', 6)})
    for i in range(16): a.set(i, round(4 + i * 0.75), '#c8d0e0' if i % 2 else '#6a7490')
    return a, 0
def lastjudgment():
    a = A('dawn', cy=4, rays=12, k=0.3)
    sp(a, SCALES, 1, 6)
    return a, 0
def fr_wit():
    a = A('amber', rays=10, k=0.3)
    for i in range(10):
        t = i / 9; a.set(int(3 + t * 9), int(15 - math.sin(t * math.pi) * 9), '#ffffff' if i % 2 else '#ffe0a0')
    sp(a, ['.yyyy.', 'yhyyyY', 'yyk.yY', 'yykkyY', 'yyyyYY', '.YYYY.'], 5, 3, {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1), 'k': ('#8a5a10', 1)})
    return a, 0
def fr_song():
    a = A('water', cy=13)
    for y in range(15, 20):
        for x in range(16):
            if y > 15 + math.sin(x * 0.9): a.set(x, y, '#2e94dc' if y < 17 else '#1468b4')
    sp(a, CONCH, 2, 7)
    note(a, 10, 2); note(a, 11, 9, True, '#c8f0ff')
    return a, 0
def el_breath():
    a = A('heal', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for i in range(60):
        t = i / 59; ang = t * 6.0; r = 6.2 - t * 3.0
        a.set(int(7.5 + math.cos(ang) * r), int(9.5 + math.sin(ang) * r), '#e8ffd8' if t < 0.5 else '#a8f090')
    big = ['......gg', '....gggG', '..gggggG', '.ggggGG.', 'gggGGG..', 'ggGG....', 'G.......']
    sp(a, big, 4, 6, {'g': ('#7ad05a', 8), 'G': ('#3a8a2a', 8)})
    return a, 0
def dw_grit():
    a = A('earth', rays=8, k=0.3)
    sp(a, PICKAXE, 2, 9)
    sp(a, ['...yy...', '..ywwy..', '.yyyyyy.', 'yyyyyyyY', 'YYYYYYYY'], 4, 3, {'y': ('#e8b830', 6), 'Y': ('#a8801a', 6), 'w': ('#ffffff', 1)})
    return a, 0
def sa_curse():
    a = A('dark', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for i in range(30):
        t = i / 29; x = 10 - t * 5 + math.sin(t * 8) * 1.5; y = 9 - t * 8
        a.set(int(x), int(y), '#c090ff' if i % 2 else '#7a40c0'); a.set(int(x) + 1, int(y), '#9a60e0')
    sp(a, LAMP, 2, 10)
    return a, 0
def weaken():
    a = A('purple', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, ['.......w', '......wM', '.....wM.', '....wM..', '........', '..wM....', '.yM.....', 'y.y.....', '.l......', 'y.......'], 3, 3, GOLD)
    sp(a, ['.ppp.', '.ppp.', 'ppppp', '.ppp.', '..p..'], 10, 11, {'p': ('#c090ff', 10)})
    return a, 0
def ar_sand():
    a = A('sand', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HAND, 1, 9)
    for (x, y) in [(9, 6), (10, 4), (12, 5), (11, 7), (13, 3), (14, 6), (12, 8), (13, 9), (10, 2), (14, 1)]: a.set(x, y, '#f0d8a0' if (x + y) % 2 else '#c8a060')
    return a, 0
def riposte():
    a = A('blood', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, w5.SWORD_DL, 0, 1, w5.HILT)
    for i in range(16):
        t = i / 15; ang = math.radians(-30 + t * 220); a.set(int(8 + math.cos(ang) * 6), int(9 + math.sin(ang) * 6), '#ffffff')
    a.paint(['w.w', '.w.'], {'w': '#ffffff'}, ox=12, oy=4)
    return a, 0
def ar_combo():
    a = A('sand', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, w5.SWORD_DL, 0, 2, w5.HILT)
    for (x, y) in [(10, 13), (13, 9), (12, 16)]: star5(a, x, y)
    return a, 0
def ar_phalanx():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for x in (2, 7, 12):
        for y in range(1, 9): a.set(x, y, '#c08a4a')
        a.set(x, 0, '#ffffff')
    for ox in (0, 5, 10):
        sp(a, grid(w6.heater(6, 9, ox, 8, ('g', 'G'), ('r', 'R'))), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'r': ('#d03a3a', 13), 'R': ('#8a1a1a', 13)})
    return a, 0
def chant():
    a = A('heal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    import c_mage
    sp(a, c_mage.BOOK, 2, 11, {'p': ('#3a9a4a', 8), 'P': ('#1e6a2a', 8)})
    note(a, 4, 2, c='#c8ffc0'); note(a, 9, 4, True, '#ffffff')
    return a, 0
ICONS = {'elixir': ('불사의 영약', 'heal', elixir), 'cureall': ('명의의 손', 'heal', cureall), 'surgeon': ('명의', 'none', surgeon), 'regenall': ('집중 치료', 'buff', regenall), 'blackdeath': ('흑사병', 'dot', blackdeath),
         'flameblade': ('화염검', 'mdmg', flameblade), 'frostblade': ('냉기검', 'mdmg', frostblade), 'thunderblade': ('뇌전검', 'mdmg', thunderblade), 'arcaneguard': ('마력 보호막', 'buff', arcaneguard), 'spellsword': ('마검 일섬', 'dmg', spellsword),
         'starblade': ('별의 검', 'mdmg', starblade), 'manaburst': ('마력 해방', 'buff', manaburst), 'starward': ('별의 보호막', 'buff', starward), 'dimension': ('차원 베기', 'dmg', dimension), 'swordsaint': ('검성의 일격', 'mdmg', swordsaint),
         'prayer': ('기도', 'heal', prayer), 'grace': ('신의 은총', 'buff', grace), 'restore': ('회복의 빛', 'heal', restore), 'purify': ('정화', 'mdmg', purify), 'holyshield': ('축복의 보호막', 'buff', holyshield), 'sacredsong': ('소생의 기도', 'heal', sacredsong),
         'miracle': ('기적', 'heal', miracle), 'holyland': ('성지', 'buff', holyland), 'archangel': ('대천사 강림', 'mdmg', archangel), 'resurrect': ('부활', 'heal', resurrect), 'dawnlight': ('창세의 빛', 'heal', dawnlight),
         'miasma': ('독 플라스크', 'dot', miasma), 'remedy': ('재생 처방', 'buff', remedy), 'quarantine': ('격리', 'buff', quarantine), 'vaccine': ('백신', 'buff', vaccine), 'panacea': ('만병통치약', 'heal', panacea), 'epidemic': ('역병 확산', 'dot', epidemic),
         'banish': ('퇴마', 'mdmg', banish), 'sealing': ('봉인', 'mdmg', sealing), 'holywater': ('성수', 'dot', holywater), 'wardcircle': ('결계', 'buff', wardcircle), 'exorcism': ('대퇴마', 'mdmg', exorcism),
         'verdict': ('심판', 'mdmg', verdict), 'pyre': ('화형', 'dot', pyre), 'inquisition': ('이단 심문', 'mdmg', inquisition), 'lastjudgment': ('최후의 심판', 'mdmg', lastjudgment),
         'fr_wit': ('상인의 재치', 'buff', fr_wit), 'fr_song': ('남해의 노래', 'heal', fr_song), 'el_breath': ('숲의 숨결', 'heal', el_breath), 'dw_grit': ('광부의 끈기', 'buff', dw_grit), 'sa_curse': ('술탄의 저주', 'dot', sa_curse),
         'weaken': ('약화의 저주', 'mdmg', weaken), 'ar_sand': ('모래 뿌리기', 'buff', ar_sand), 'riposte': ('되치기', 'buff', riposte), 'ar_combo': ('투기장 연격', 'dmg', ar_combo), 'ar_phalanx': ('방진', 'buff', ar_phalanx), 'chant': ('치유의 찬가', 'buff', chant)}
