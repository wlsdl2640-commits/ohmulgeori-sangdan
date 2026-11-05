"""마부 6 · 대상단장 4 · 정찰병 6 · 개척자 4 · 암살자 6 · 그림자 군주 6"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from c_archer import arrow_u, arrow_dl, arrow_l, arrow_ul
from c_rogue import dagger_at
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
# 마부
def whipcrack():
    a = A('steelb', cx=12, cy=5)
    for i in range(30):
        t = i / 29; x = 5 + t * 8; y = 13 - t * 9 + math.sin(t * 6.3) * 2.2
        a.set(int(x), int(y), '#e8b878' if t < 0.8 else '#ffffff')
    sp(a, ['l....', 'lL...', '.lL..', '..lL.', '...tT'], 1, 9, {'l': ('#7a4a2a', 9), 'L': ('#4a2a10', 9), 't': ('#a8743a', 3), 'T': ('#6a4a2a', 3)})
    burst(a, 13, 4, big=False)
    return a, 0
def horsecare():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HORSESHOE, 3, 4)
    sp(a, HEART[0][:5], 5, 13, HEART[1])
    return a, 0
def gallop():
    a = A('sky', cx=11, cy=8)
    speed(a, [(0, 5, 3, 5), (0, 9, 2, 9), (0, 13, 3, 13), (1, 16, 4, 16)], '#d8f0ff')
    import spr as S
    sp(a, S.HORSE, 4, 4, {'F': ('#f4f0e8', 7), 'w': ('#c8c0b0', 7), 'k': ('#a89878', 7)})
    for (x, y) in [(3, 17), (5, 18), (7, 17)]: a.set(x, y, '#e8f4ff')
    return a, 0
def wheelcrush():
    a = A('steelb', cx=11, cy=13)
    for (x, y) in [(1, 14), (2, 15), (1, 16), (3, 17), (4, 16)]: a.set(x, y, '#e0c090')
    speed(a, [(0, 6, 2, 6), (0, 9, 2, 9)], '#ffe8c0')
    sp(a, WHEEL, 4, 5)
    burst(a, 14, 14, big=False)
    return a, 0
def wagonwall():
    a = A('steelb', cy=12)
    for (x, y) in ring_cells(7.5, 13.0, 7.4, 7.0):
        if y <= 13: a.set(x, y, '#bfe0ff')
    sp(a, WAGON, 1, 8)
    return a, 0
def cargoshield():
    a = A('warm', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    big = ['tttttttttT', 'tTtttttTTT', 'ttTttttTtT', 'tttTttTttT', 'ttttTTtttT', 'ttttTTtttT', 'tttTttTttT', 'ttTttttTtT', 'tTtttttTTT', 'TTTTTTTTTT']
    sp(a, big, 1, 6, CRATE[1])
    sp(a, ['bbbbb', 'bwbbB', 'bbbbB', '.bbB.', '..B..'], 9, 3, {'b': ('#6aa0ff', 12), 'B': ('#2a4aa0', 12), 'w': ('#ffffff', 1)})
    return a, 0
# 대상단장
def stampede():
    a = A('sand', cy=6)
    for (x, y) in [(2, 13), (6, 15), (10, 13), (13, 16), (4, 9), (11, 9)]:
        sp(a, ['m.m', 'm.m', 'mmm'], x - 1, y - 1, {'m': ('#5a3a1a', 1)})
    paint_cm(a, cloud([(3, 4, 2.2), (6, 3, 2.4), (10, 4, 2.2), (13, 5, 1.8)]), {'1': '#f0d8a8', '2': '#d0b080'})
    return a, 0
def roadlord():
    a = A('sky', cy=6, r=14)
    for y in range(9, 20):
        for x in range(16):
            w = (y - 8) * 0.75
            if abs(x + 0.5 - 7.5) <= w: a.set(x, y, '#8a7a6a' if abs(x + 0.5 - 7.5) > w - 1 else '#b8a890')
            if abs(x + 0.5 - 7.5) < 0.6 and y % 3 != 0: a.set(x, y, '#ffffff')
    for x in range(16):
        if a.get(x, 9) and abs(x + 0.5 - 7.5) > 1: a.set(x, 9, '#5a9a4a')
    sp(a, ['y..y..y', 'yy.y.yy', 'yyyyyyy', 'yrYyYry', 'YYYYYYY'], 4, 2, {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'r': ('#e83a3a', 1)})
    return a, 0
def convoy():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for k in range(6):
        ang = math.radians(k * 60 + 30); cx, cy = 7.5 + math.cos(ang) * 5.2, 9.5 + math.sin(ang) * 5.6
        sp(a, ['ee', 'tt'], int(cx) - 1, int(cy) - 1, {'e': ('#f4ecd8', 7), 't': ('#a8743a', 3)})
    sp(a, ['bbbb', 'bwbB', 'bbbB', '.bB.'], 6, 8, {'b': ('#6aa0ff', 12), 'B': ('#2a4aa0', 12), 'w': ('#ffffff', 1)})
    return a, 0
def grandcaravan():
    a = A('warm', cy=12, r=12)
    glow(a, 7.5, 11.0, 3.6, ['#ff8a3a', '#ffc060', '#fff0b0'])
    for y in range(13, 20):
        for x in range(16): a.set(x, y, '#5a2a10' if y == 13 else '#3a1a08')
    CAMEL = ['..kk.....', '.kkkk..kk', 'kk.kkkkk.', '...kkkkk.', '...k.k.k.', '...k.k.k.']
    for ox in (0, 6, 11):
        a.paint(CAMEL, {'k': '#2a1408'}, ox=ox - 1, oy=8)
    return a, 0
# 정찰병
def ambush():
    a = A('green', cx=12, cy=6, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, (grid(target(12.5, 5.5, 2.2, '123')), TGT))
    sp(a, grid(arrow_ur(11, 7, L=5)))
    cm = cloud([(3, 14, 3.0), (6.5, 15.5, 2.6), (2, 17, 2.2), (8.5, 17.5, 2.2)], 'g', 'G')
    for (x, y), c in list(cm.items()):
        if (x * 3 + y * 2) % 7 == 0: cm[(x, y)] = 'h'
    sp(a, grid(cm), {'g': ('#4ab04a', 8), 'G': ('#2a7a34', 8), 'h': ('#8ae07a', 8)})
    return a, 0
def pathfind():
    a = A('teal', rays=8, k=0.3)
    sp(a, COMPASS, 3, 5)
    return a, 0
def snare():
    a = A('green', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, NOOSE, 3, 3)
    dot(a, [(2, 15), (13, 14), (12, 16)], '#c8a070')
    return a, 0
def campcraft():
    a = A('night', cy=15, r=12)
    dot(a, [(2, 3), (7, 2), (12, 4), (4, 6)], '#ffffff')
    sp(a, TENT, 0, 8)
    sp(a, ['.o.', 'oyo', 'tTt'], 12, 13, {'o': ('#ff8a2a', 14), 'y': ('#ffe060', 1), 't': ('#7a4c22', 3), 'T': ('#4a2a10', 3)})
    for y in range(16, 20):
        for x in range(16): a.set(x, y, '#1a2a1a')
    return a, 0
def spotweak():
    a = A('amber', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, MAGNIFY, 3, 4)
    a.paint(['r..r', '.rr.', '.rr.', 'r..r'], {'r': '#e83a3a'}, ox=5, oy=6)
    return a, 0
def volley():
    a = A('sky', cx=4, cy=14, r=14)
    for (tx, ty, L) in [(14, 6, 4), (12, 3, 4), (14, 11, 4)]: sp(a, grid(arrow_ur(tx, ty, L=L)))
    for (tx, ty) in [(8, 4), (14, 15)]: sp(a, grid(arrow_ur(tx, ty, L=3)))
    return a, 0
# 개척자
def farsight():
    a = A('teal', cx=12, cy=4)
    sp(a, SPYGLASS, 2, 5)
    plus(a, 13, 4)
    return a, 0
def mapmaker():
    a = A('sand', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, MAPSCROLL, 2, 5)
    return a, 0
def drumbeat():
    a = A('warm', cy=12)
    arcs(a, 7.5, 9.0, [6.0, 7.4], [(190, 350)], ['#ffffff', '#ffd090'])
    sp(a, TDRUM, 3, 8)
    sp(a, ['t...', '.t..', '..tT'], 1, 4, {'t': ('#e8d0a0', 3), 'T': ('#a87a4a', 3)}); sp(a, ['...t', '..t.', 'Tt..'], 11, 4, {'t': ('#e8d0a0', 3), 'T': ('#a87a4a', 3)})
    return a, 0
def summit():
    a = A('sky', cy=4, r=15)
    for y in range(20):
        for x in range(16):
            u = abs(x + 0.5 - 7.5)
            if y >= 6 + u * 1.3: a.set(x, y, '#f4f8ff' if y < 8 + u * 1.3 and y < 10 else '#6a7a8a' if x < 8 else '#4a5a6a')
    sp(a, ['.rrr', '.rr.', '.r..', 't...', 't...'], 7, 1, {'r': ('#e83a3a', 13), 't': ('#7a4c22', 3)})
    for (x, ty) in [(3, 14), (12, 15)]: sp(a, grid(arrow_dn(x, ty, L=3)))
    return a, 0
# 암살자
def assassinate():
    a = A('shadow', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, HOOD, 2, 3)
    dagger_at(a, 7, 9, 'ur')
    return a, 0
def poisonblade():
    a = A('poison', cx=9, cy=7)
    sp(a, KRIS, 3, 3)
    for (x, y) in [(10, 8), (10, 9), (8, 11), (8, 12), (11, 12)]: a.set(x, y, '#9af060')
    return a, 0
def vanish():
    a = A('shadow', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    paint_cm(a, cloud([(4, 15, 2.6), (8, 16, 2.8), (12, 15, 2.4)]), {'1': '#6a6a8a', '2': '#4a4a6a'})
    for (y, r) in enumerate(NINJA[0]):
        for x, ch in enumerate(r):
            if ch != '.' and (x + y) % 2 == 0: a.set(x + 3, y + 3, '#8a8ab8')
    return a, 0
def throatcut():
    a = A('evil', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    slash_line(a, 0, 8, 16, 11, 1.8, '#ffffff', '#ff3a4a')
    for (x, y) in [(5, 12), (6, 13), (9, 13), (9, 14), (11, 12)]: a.set(x, y, '#e8283a')
    return a, 0
def shadowclone():
    a = A('purple', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (ox, c) in [(0, '#a080d8'), (8, '#a080d8')]:
        for (y, r) in enumerate(NINJA[0]):
            for x, ch in enumerate(r):
                if ch != '.' and (x + y) % 2 == 0: a.set(x + ox - 1, y + 5, c)
    sp(a, NINJA, 3, 4)
    return a, 0
def killer():
    a = A('blood', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, MASK, 2, 5)
    return a, 0
# 그림자 군주
def shadowstep():
    a = A('dark', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x, y) in [(2, 14), (5, 11), (3, 8)]: sp(a, FOOT[0], x, y, {'1': ('#9a6ad0', 10)})
    slash(a, crescent2((10.0, 6.0), 4.6, (11.2, 7.0), 4.4), ('#f0d8ff', '#c090ff', '#7a40c0', '#4a2080'))
    return a, 0
def nightfall():
    a = A('night', cy=4)
    for y in range(20):
        for x in range(16):
            if y < 12 + 2 * math.sin(x * 0.8): pass
            else: a.set(x, y, '#0a0612' if (x + y) % 3 else '#160a24')
    sp(a, MOON_C, 4, 2, {'1': ('#e8e0ff', 7)})
    dot(a, [(10, 3), (12, 6), (2, 8), (13, 9)], '#ffffff')
    return a, 0
def shadowstorm():
    a = A('dark', cuts=[0.0, 0.3, 0.5, 0.7, 0.9])
    for k in range(3):
        slash(a, crescent(7.5, 9.5, 6.8 - k * 1.9, k * 100, k * 100 + 220, 1.5, fade=0.6), ('#f0d8ff', '#c090ff', '#7a40c0', '#4a2080'))
    for (x, y, d) in [(10, 1, 'ur'), (-1, 10, 'dl')]: dagger_at(a, x, y, d, {'w': ('#d8c0ff', 5), 'M': ('#5a3a90', 5)})
    return a, 0
def soulreap():
    a = A('evil', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, SCYTHE, 2, 3)
    a.paint(['.ww.', 'wqqw', 'wwww', 'w.w.'], {'w': '#c8f0ff', 'q': '#4a6a9a'}, ox=10, oy=9)
    for (x, y) in [(11, 13), (12, 14), (13, 13)]: a.set(x, y, '#8ad0f0')
    return a, 0
def darkness():
    a = A('purple', rays=12, k=0.4)
    glow(a, 7.5, 9.5, 5.6, ['#8434b4', '#b464dc'])
    sp(a, CROWN_D, 3, 7, {'p': ('#2a1a3a', 10), 'P': ('#140a1e', 10), 'q': ('#e0c0ff', 1), 'r': ('#ff4a8a', 1)})
    for (x, y) in [(3, 4), (12, 4), (7, 2)]: plus(a, x, y, '#e0c0ff', '#8a5ac0')
    return a, 0
def eclipse():
    a = A('night', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    glow(a, 7.5, 9.5, 7.4, ['#3a2a6a', '#c86a3a', '#ffc060', '#fff4d0'])
    disc(a, 7.5, 9.5, 4.2, '#0a0612')
    a.set(5, 7, '#2a1a3a')
    return a, 0
ICONS = {'whipcrack': ('채찍질', 'dmg', whipcrack), 'horsecare': ('말 돌보기', 'none', horsecare), 'gallop': ('전속력', 'buff', gallop), 'wheelcrush': ('마차 돌진', 'dmg', wheelcrush), 'wagonwall': ('짐칸 보호막', 'buff', wagonwall), 'cargoshield': ('짐칸 방패', 'none', cargoshield),
         'stampede': ('마차 질주', 'dmg', stampede), 'roadlord': ('길의 주인', 'none', roadlord), 'convoy': ('호위 대형', 'buff', convoy), 'grandcaravan': ('대상단의 행진', 'dmg', grandcaravan),
         'ambush': ('기습 사격', 'dmg', ambush), 'pathfind': ('길잡이', 'none', pathfind), 'snare': ('올가미', 'dot', snare), 'campcraft': ('야영 기술', 'none', campcraft), 'spotweak': ('약점 간파', 'buff', spotweak), 'volley': ('연속 사격', 'dmg', volley),
         'farsight': ('원거리 저격', 'dmg', farsight), 'mapmaker': ('지도 제작', 'none', mapmaker), 'drumbeat': ('탐험대의 북소리', 'buff', drumbeat), 'summit': ('정상 등반', 'dmg', summit),
         'assassinate': ('암살', 'dmg', assassinate), 'poisonblade': ('독날', 'dot', poisonblade), 'vanish': ('은신', 'buff', vanish), 'throatcut': ('목 긋기', 'dmg', throatcut), 'shadowclone': ('분신술', 'dmg', shadowclone), 'killer': ('살수의 본능', 'none', killer),
         'shadowstep': ('그림자 걸음', 'dmg', shadowstep), 'nightfall': ('밤의 장막', 'buff', nightfall), 'shadowstorm': ('그림자 폭풍', 'dmg', shadowstorm), 'soulreap': ('영혼 수확', 'dmg', soulreap), 'darkness': ('어둠의 군주', 'none', darkness), 'eclipse': ('일식', 'dmg', eclipse)}
