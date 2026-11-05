"""결투가 5 · 칼춤꾼 4 · 보물 사냥꾼 5 · 대도 4 · 정령사 5 · 정령왕 4 · 강령술사 5 · 리치 4"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from c_rogue import dagger_at
import w5
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
PSL = ('#ffffff', '#f0d8ff', '#c090ff', '#7a40c0')
def eyes_on(a, x, y, c='#1a1414', g='#ffffff'):
    a.set(x, y, c); a.set(x + 3, y, c); a.set(x, y + 1, c); a.set(x + 3, y + 1, c); a.set(x, y, g); a.set(x + 3, y, g)
# 결투가
def twinslash():
    a = A('teal', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    slash_line(a, 2, 13, 11, 2, 1.5, '#ffffff', '#8af0e0'); slash_line(a, 5, 17, 14, 6, 1.5, '#ffffff', '#8af0e0')
    return a, 0
def crossslash():
    a = A('steelb', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    slash_line(a, 7.5, 1, 8.5, 19, 1.8, '#ffffff', '#8ac0ff'); slash_line(a, 0, 9.5, 16, 10.5, 1.8, '#ffffff', '#8ac0ff')
    star5(a, 8, 10)
    return a, 0
def parrying():
    a = A('royal', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, RAPIER, 1, 6)
    for i in range(12):
        t = i / 11; ang = math.radians(200 + t * 140); a.set(int(9 + math.cos(ang) * 4.5), int(7 + math.sin(ang) * 4.5), '#ffffff')
    a.paint(['w.', 'ww', 'w.'], {'w': '#ffffff'}, ox=13, oy=7)
    burst(a, 7, 8, big=False)
    return a, 0
def blitz():
    a = A('storm', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x0, y0, x1, y1) in [(1, 4, 9, 2), (3, 16, 13, 12), (2, 9, 14, 8), (6, 2, 14, 6), (1, 12, 9, 16)]:
        slash_line(a, x0, y0, x1, y1, 1.0, '#ffffff', '#8ad0e0')
    return a, 0
def twinstorm():
    a = A('steelb', cuts=[0.0, 0.3, 0.5, 0.72, 0.9])
    for k in range(2): slash(a, crescent(7.5, 9.5, 7.2, k * 180 + 10, k * 180 + 170, 2.0, fade=0.8), WSL)
    import w6
    A_ = w6.xsword(); B = w6.mirror(A_)
    sp(a, A_, 0, 0, w5.HILT); sp(a, B, 0, 0, w5.HILT)
    return a, 0
# 칼춤꾼
def bladewaltz():
    a = A('pink', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for i in range(70):
        t = i / 69; ang = t * 9.5; r = 6.4 - t * 4.5
        x, y = 7.5 + math.cos(ang) * r, 9.5 + math.sin(ang) * r * 1.1
        a.set(int(x), int(y), '#ffffff' if t < 0.5 else '#ffc0e0')
    dagger_at(a, 7, 1, 'ur', {'w': ('#ffe0f0', 5), 'M': ('#c06a9a', 5)})
    return a, 0
def swordrain():
    a = A('steelb', cy=3, r=16)
    SW = ['.y.', 'yYY', '.m.', 'wM.'[:2] + '.', 'wM.', 'wM.', '.M.']
    for (x, y) in [(2, 9), (6, 4), (10, 8), (13, 3), (7, 12)]:
        sp(a, ['yY', 'yY', 'wM', 'wM', 'wM', 'wM', 'w.'], x, y, GOLD)
        for k in range(1, 3): a.set(x, y - k, '#a8c8ff')
    return a, 0
def dancemaster():
    a = A('rose', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, DANCESHOE, 3, 8)
    for i in range(10): a.set(3 + i, 6 - round(math.sin(i * 0.8) * 1.5), '#ffffff')
    for (x, y) in [(2, 3), (13, 5), (12, 15)]: plus(a, x, y, '#ffffff', '#ffd0e8')
    return a, 0
def thousandcut():
    a = A('shadow', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (x0, y0, x1, y1) in [(1, 3, 14, 16), (14, 3, 1, 16), (0, 9, 16, 10), (7, 0, 8, 19), (2, 14, 13, 3), (3, 1, 12, 18), (1, 6, 15, 13), (15, 6, 1, 13)]:
        slash_line(a, x0, y0, x1, y1, 0.9, '#ffffff', '#a8a8e0')
    return a, 0
# 보물 사냥꾼
def pilfer():
    a = A('amber', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, HAND, 2, 8)
    sp(a, COIN, 7, 4); sp(a, COIN, 10, 7)
    return a, 0
def lockpick():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, PADLOCK, 3, 5)
    sp(a, ['m....', '.m...', '..m..', '...mm'], 7, 12)
    return a, 0
def smokebomb():
    a = A('pink', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(5, 8, 3.2), (10, 7, 3.0), (7.5, 11.5, 3.4), (3.5, 12, 2.4), (12, 11.5, 2.6)]), {'1': '#f0c0e0', '2': '#c08ab0'})
    paint_cm(a, cloud([(6, 7, 1.8), (10, 6.5, 1.6)]), {'1': '#ffe8f8', '2': '#f0c0e0'})
    sp(a, COIN, 11, 14)
    return a, 0
def goldrush():
    a = A('gold', cy=3, r=17)
    for (x, y) in [(2, 3), (6, 1), (10, 4), (13, 2), (4, 8), (9, 9), (12, 11), (2, 13), (6, 14), (10, 15)]:
        sp(a, ['yY', 'YY'], x, y, GOLD)
    return a, 0
def jackpot():
    a = A('royal', rays=12, k=0.35)
    glow(a, 7.5, 9.0, 4.0, ['#ffd84a', '#fff4c0'])
    sp(a, CHEST, 2, 11)
    for (x, y) in [(3, 5), (7, 3), (11, 5), (5, 8), (10, 8)]: sp(a, ['yY', 'YY'], x, y, GOLD)
    return a, 0
# 대도
def grandheist():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, GLOVE, 3, 5, {'k': ('#f4f0f8', 7), 'q': ('#b8b0c8', 7)})
    for (x, y) in [(3, 3), (12, 2)]: plus(a, x, y)
    return a, 0
def phantom():
    a = A('purple', rays=10, k=0.35)
    glow(a, 7.5, 9.0, 6.0, ['#8434b4', '#c890f0'])
    sp(a, TOPHAT, 2, 5, {'w': ('#ffe060', 1)})
    return a, 0
def fortune():
    a = A('green', rays=10, k=0.3)
    sp(a, CLOVER, 3, 5)
    for (x, y) in [(2, 3), (13, 4), (12, 16)]: plus(a, x, y)
    return a, 0
def heist():
    a = A('arcane', rays=12, k=0.35)
    sp(a, DIAMOND, 3, 7)
    for (x, y) in [(2, 4), (13, 5), (7, 3), (12, 15)]: plus(a, x, y)
    return a, 0
# 정령사
def spirit_swirl(a, cx, cy, cols, eyes=True):
    for i in range(80):
        t = i / 79; ang = t * 9.0; r = 5.6 - t * 4.6
        x, y = cx + math.cos(ang) * r, cy + math.sin(ang) * r
        a.set(int(x), int(y), cols[0] if t > 0.6 else cols[1])
    if eyes: eyes_on(a, int(cx) - 2, int(cy) - 1)
def windspirit():
    a = A('wind', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    spirit_swirl(a, 7.5, 9.5, ('#ffffff', '#8ae0a8'))
    return a, 0
def earthward():
    a = A('earth', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    import w6
    sp(a, grid(w6.heater(10, 13, 3, 3, ('f', 'F'), ('s', 'S'))), {'f': ('#c4b8a0', 11), 'F': ('#74684e', 11), 's': ('#a89070', 11), 'S': ('#6a5a40', 11)})
    sp(a, LEAF, 5, 7)
    return a, 0
def firespirit():
    a = A('fire', cy=12)
    FL = ['....1.....', '...11.1...', '..1121.1..', '..12221...', '.1222221..', '.12223221.', '1223333221', '1233333321', '1233333321', '.12333321.', '..122221..']
    a.paint(FL, {'1': '#e04a10', '2': '#ffa030', '3': '#fff0a0'}, ox=3, oy=4)
    eyes_on(a, 6, 10, '#3a0a04', '#3a0a04')
    return a, 0
def waterspirit():
    a = A('water', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    big = (['....1....', '....1....', '...111...', '..11112..', '.1111112.', '.1w11112.', '111111122', '111111122', '.1111122.', '..11222..'], {'1': ('#6ac8ff', 12), '2': ('#2a6ac8', 12)})
    sp(a, big, 3, 5)
    eyes_on(a, 5, 11, '#0a1a3a', '#0a1a3a')
    a.paint(['k..k', '.kk.'], {'k': '#0a1a3a'}, ox=5, oy=13)
    return a, 0
def storm():
    a = A('storm', cy=14)
    sp(a, grid(cloud([(4, 4.5, 2.8), (8, 3.5, 3.2), (12, 4.8, 2.6)], 'f', 'F')), {'f': ('#5a6a8a', 11), 'F': ('#34405a', 11)})
    paint_cm(a, bolt([(8, 8), (6, 11), (9, 12), (7, 16)]), {'w': '#ffffff', 'y': '#fff060'})
    for (x, y) in [(3, 10), (2, 13), (12, 10), (13, 13), (11, 16), (4, 16)]: a.set(x, y, '#9ad4ff'); a.set(x, y + 1, '#5a8ac8')
    spirit_swirl(a, 12, 14, ('#ffffff', '#8ae0a8'), eyes=False) if False else None
    return a, 0
# 정령왕
def spiritking():
    a = A('storm', rays=12, k=0.35)
    spirit_swirl(a, 7.5, 11.0, ('#ffffff', '#8ae0e0'), eyes=False)
    a.set(5, 10, '#ff4a3a'); a.set(9, 10, '#ff4a3a'); a.set(5, 9, '#ff4a3a'); a.set(9, 9, '#ff4a3a')
    sp(a, ['y..y..y', 'yy.y.yy', 'yyyyyyy', 'YYYYYYY'], 4, 2, GOLD)
    return a, 0
def spiritlink():
    a = A('arcane', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    pts = [(7.5, 4.0), (13.0, 9.5), (7.5, 15.0), (2.0, 9.5)]
    for (p0, p1) in zip(pts, pts[1:] + pts[:1]): line(a, int(p0[0]), int(p0[1]), int(p1[0]), int(p1[1]), '#c0b0ff')
    for (cx, cy), (c1, c2, c3) in zip(pts, [('#ffb080', '#ff6a2a', '#a02a0a'), ('#a0e0ff', '#3a8ad0', '#1a4a8a'), ('#a0f0a0', '#3ab04a', '#1a6a2a'), ('#fff0a0', '#e0b020', '#8a6a10')]):
        sp(a, grid(orb(cx, cy, 2.0)), {'1': (c1, 1), '2': (c2, 1), '3': (c3, 1)})
    return a, 0
def elemental():
    a = A('dark', cuts=[0.0, 0.3, 0.5, 0.7, 0.9])
    for y in range(20):
        for x in range(16):
            dx, dy = x + 0.5 - 7.5, y + 0.5 - 9.5; d = math.hypot(dx, dy); th = math.atan2(dy, dx)
            e = 6.2 + 1.2 * math.cos(th * 8)
            if d < e:
                q = (0 if dx < 0 else 1) + (0 if dy < 0 else 2)
                c = ['#ff6a2a', '#3a9ae8', '#4ac05a', '#f0c020'][q]
                a.set(x, y, '#ffffff' if d < 1.8 else mix(c, '#ffffff', 0.4) if d < 3.4 else c)
    return a, 0
def genesis():
    a = A('night', cuts=[0.0, 0.22, 0.42, 0.62, 0.84], rays=12, k=0.3)
    cm = orb(7.5, 10.0, 4.8, 'bBq')
    for (x, y) in list(cm):
        if (x * 7 + y * 3) % 9 < 3 and cm[(x, y)] != 'w': cm[(x, y)] = 'g'
    sp(a, grid(cm), {'b': ('#5aa8f0', 12), 'B': ('#2a6ac0', 12), 'q': ('#1a3a7a', 12), 'g': ('#5ac05a', 8)})
    for (x, y) in ring_cells(7.5, 10.0, 7.2, 2.0):
        if y >= 10 or abs(x + 0.5 - 7.5) > 4.8: a.set(x, y, '#ffe8a0')
    dot(a, [(2, 3), (12, 2), (14, 15)], '#ffffff')
    return a, 0
# 강령술사
def drain():
    a = A('dark', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for i in range(18):
        t = i / 17; x = 14 - t * 8; y = 3 + t * 6 + math.sin(t * 9) * 1.3
        a.set(int(x), int(y), '#ff4a5a' if i % 3 else '#ffb0b0')
    sp(a, CLAW, 2, 9, {'k': ('#b8c0a8', 7)})
    return a, 0
def curse():
    a = A('purple', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, VOODOO, 3, 5)
    for (x0, y0) in [(9, 6), (2, 11), (11, 12)]:
        a.set(x0, y0, '#ff4a6a'); a.set(x0 + (1 if x0 > 7 else -1), y0 - 1, '#d0d0e0')
    return a, 0
def bonewall():
    a = A('shadow', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for x in (2, 5, 8, 11):
        sp(a, ['ee', 'eE', '.E', '.E', '.E', '.E', '.E', '.E', 'eE', 'EE'], x, 6)
    sp(a, SKULL, 4, 1)
    return a, 0
def raise_():
    a = A('night', cy=15, r=12)
    for y in range(15, 20):
        for x in range(16): a.set(x, y, '#2a1a10' if y > 15 else '#4a3020')
    sp(a, ['e......e', 'Ee....eE', '.EeeeeE.'], 4, 9)
    sp(a, SKULL, 4, 2)
    sp(a, ['.eEeEeE.', '.e.e.e..', '.eEeEeE.', '..e.e...'], 4, 10)
    return a, 0
def deathwave():
    a = A('poison', cuts=[0.0, 0.3, 0.5, 0.7, 0.9])
    for y in range(20):
        for x in range(16):
            top = 10 + 2.5 * math.sin(x * 0.7) - (x * 0.3)
            if y > top: a.set(x, y, '#5a8a2a' if y < top + 1.5 else '#2a4a12' if (x + y) % 4 else '#3a6a1a')
    sp(a, SKULL, 2, 4, {'e': ('#c8f0a0', 7), 'E': ('#6a9a4a', 7)})
    a.paint(['ww', 'kk'], {'w': '#c8f0a0', 'k': '#1a2a0a'}, ox=11, oy=12)
    return a, 0
# 리치
def soulrend():
    a = A('evil', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    L = [r[:5] for r in GHOST[0]]; R = [r[5:] for r in GHOST[0]]
    sp(a, (L, GHOST[1]), 1, 5); sp(a, (R, GHOST[1]), 9, 4)
    for y in range(3, 17): a.set(7 + (y % 2), y, '#ff4a6a')
    return a, 0
def lichmind():
    a = A('ice', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    sp(a, SKULL, 4, 7, {'k': ('#3ac0ff', 1), 'e': ('#e0e8f0', 7), 'E': ('#8a98b0', 7)})
    sp(a, ['y..y..y', 'yy.y.yy', 'yyyyyyy', 'YbYYYbY'], 4, 3, {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'b': ('#3ac0ff', 1)})
    return a, 0
def deathplague():
    a = A('poison', cy=10)
    paint_cm(a, cloud([(4, 8, 3.0), (8, 6.5, 3.4), (12, 8.5, 2.8), (6, 11.5, 3.0), (11, 12, 2.6)]), {'1': '#7a5a8a', '2': '#4a3a5a'})
    for (x, y) in [(5, 8), (9, 7), (11, 11)]: a.paint(['ee', 'kk'], {'e': '#d0f0a0', 'k': '#1a2a0a'}, ox=x, oy=y)
    for (x, y) in [(3, 15), (8, 16), (13, 15)]: a.set(x, y, '#9af060')
    return a, 0
def apocalypse():
    a = A('evil', cy=6, r=13)
    glow(a, 7.5, 7.0, 5.6, ['#c8325e', '#ff6a3a'])
    sp(a, SKULL, 4, 3, {'e': ('#2a0610', 1), 'E': ('#1a0408', 1), 'k': ('#ff4a1a', 1)})
    for y in range(14, 20):
        for x in range(16):
            if y > 14 + math.sin(x * 2.1): a.set(x, y, '#1a0408')
    dot(a, [(3, 15), (9, 16), (12, 15)], '#ff4a1a')
    return a, 0
ICONS = {'twinslash': ('쌍칼 베기', 'dmg', twinslash), 'crossslash': ('십자 베기', 'dmg', crossslash), 'parrying': ('받아넘기기', 'buff', parrying), 'blitz': ('질풍 연격', 'dmg', blitz), 'twinstorm': ('쌍검 폭풍', 'dmg', twinstorm),
         'bladewaltz': ('칼날 왈츠', 'dmg', bladewaltz), 'swordrain': ('칼비', 'dmg', swordrain), 'dancemaster': ('무희의 발놀림', 'none', dancemaster), 'thousandcut': ('천 번의 베기', 'dmg', thousandcut),
         'pilfer': ('슬쩍하기', 'dmg', pilfer), 'lockpick': ('자물쇠 따기', 'none', lockpick), 'smokebomb': ('연막 폭탄', 'buff', smokebomb), 'goldrush': ('골드러시', 'dmg', goldrush), 'jackpot': ('대박', 'dmg', jackpot),
         'grandheist': ('대도의 손놀림', 'dmg', grandheist), 'phantom': ('그림자 도둑', 'dmg', phantom), 'fortune': ('행운의 여신', 'none', fortune), 'heist': ('세기의 대도', 'dmg', heist),
         'windspirit': ('바람 정령', 'mdmg', windspirit), 'earthward': ('대지의 가호', 'buff', earthward), 'firespirit': ('불꽃 정령', 'mdmg', firespirit), 'waterspirit': ('물의 정령', 'heal', waterspirit), 'storm': ('정령 폭풍', 'mdmg', storm),
         'spiritking': ('정령왕의 분노', 'mdmg', spiritking), 'spiritlink': ('정령 교감', 'none', spiritlink), 'elemental': ('4원소 폭발', 'mdmg', elemental), 'genesis': ('천지창조', 'mdmg', genesis),
         'drain': ('생명 흡수', 'mdmg', drain), 'curse': ('저주', 'dot', curse), 'bonewall': ('뼈의 방벽', 'buff', bonewall), 'raise': ('해골 병사', 'mdmg', raise_), 'deathwave': ('부패의 파도', 'dot', deathwave),
         'soulrend': ('영혼 찢기', 'mdmg', soulrend), 'lichmind': ('리치의 지혜', 'none', lichmind), 'deathplague': ('죽음의 역병', 'dot', deathplague), 'apocalypse': ('종말', 'mdmg', apocalypse)}
