"""검투사 5 · 챔피언 4 · 기사 5 · 성기사 7 · 광전사 5 · 피의 군주 4"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
import w5
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
def vsword_up(cx=7, top=2, L=9, pal=None):
    """끝이 위로 선 칼 (가운데 x=cx,cx+1)"""
    g = blank()
    put(g, cx, top, 'w'); put(g, cx + 1, top, 'M')
    for y in range(top + 1, top + L): put(g, cx, y, 'w'); put(g, cx + 1, y, 'M')
    gy = top + L
    for x in range(cx - 2, cx + 4): put(g, x, gy, 'y' if x <= cx else 'Y')
    put(g, cx, gy + 1, 'l'); put(g, cx + 1, gy + 1, 'L'); put(g, cx, gy + 2, 'l'); put(g, cx + 1, gy + 2, 'L')
    put(g, cx, gy + 3, 'y'); put(g, cx + 1, gy + 3, 'Y')
    return rows(g)
# 검투사
def arena():
    a = A('amber', cuts=[0.0, 0.3, 0.55, 0.78, 0.95])
    slash_line(a, 2, 3, 13, 16, 1.8, '#ffffff', '#ffc040'); slash_line(a, 13, 3, 2, 16, 1.8, '#ffffff', '#ffc040')
    star5(a, 7, 9)
    for (x, y) in [(2, 15), (13, 15), (6, 17), (10, 17)]: a.set(x, y, '#e8c080')
    return a, 0
def parry():
    a = A('steelb', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, w5.SWORD_DL, 0, 1, w5.HILT)
    sp(a, flip(w5.SWORD_DL, {'w': 'w', 'M': 'M'}), 0, 3, w5.HILT)
    burst(a, 7, 11)
    return a, 0
def roar():
    a = A('sand', cy=14)
    arcs(a, 7.5, 6.0, [3.0, 4.6, 6.2], [(200, 340)], ['#ffffff', '#fff0b0', '#ffc860'])
    sp(a, COLOSSEUM, 2, 9)
    return a, 0
def execute():
    a = A('shadow', cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for off in (-5, 0, 5):
        slash_line(a, 5 + off, 4, 10 + off, 15, 1.2, '#ffffff', '#ff4a4a')
    return a, 0
def spinslash():
    a = A('ember', cuts=[0.0, 0.35, 0.6, 0.82, 0.96])
    for k in range(3):
        slash(a, crescent(7.5, 9.5, 6.8 - k * 0.2, k * 120, k * 120 + 100, 2.4, fade=0.8), WSL)
    plus(a, 7, 9, '#ffffff', '#fff0a0')
    return a, 0
# 챔피언
def laurel(a, cx=7.5, cy=10.0, r=6.0):
    cm = {}
    for i in range(14):
        t = i / 13; ang = math.radians(100 + t * 150)
        for s in (1, -1):
            x = cx + s * math.cos(ang) * r * -1; y = cy + math.sin(ang) * r
            cm[(int(x), int(y))] = 'g' if i % 2 else 'G'
            cm[(int(x + s * 0.9), int(y - 0.6))] = 'g'
    sp(a, grid(cm), {'g': ('#7ad05a', 8), 'G': ('#3a8a2a', 8)})
def glory():
    a = A('gold', rays=12, k=0.3)
    laurel(a, 7.5, 9.5, 5.6)
    sp(a, vsword_up(7, 2, 8), GOLD)
    return a, 0
def crowd():
    a = A('royal', rays=10, k=0.3)
    sp(a, TROPHY, 2, 5)
    for (x, y) in [(2, 3), (13, 4), (7, 2)]: plus(a, x, y)
    return a, 0
def finale():
    a = A('night', cy=14)
    for (cx, cy, c) in [(4, 5, '#ff6a8a'), (12, 4, '#6ad0ff'), (10, 10, '#ffe060')]:
        for ang in range(0, 360, 45):
            for k in (1, 2): a.set(round(cx + math.cos(math.radians(ang)) * k * 1.3), round(cy + math.sin(math.radians(ang)) * k * 1.3), c if k == 2 else '#ffffff')
        a.set(cx, cy, '#ffffff')
    sp(a, vsword_up(6, 6, 7), GOLD)
    return a, 0
def colosseum():
    a = A('warm', cy=6, rays=10, k=0.3)
    sp(a, COLOSSEUM, 2, 9)
    slash(a, crescent2((7.5, 13.0), 7.5, (7.5, 15.0), 7.6), WSL)
    return a, 0
# 기사
def shieldbash():
    a = A('steelb', cx=12, cy=9)
    speed(a, [(0, 6, 2, 6), (0, 10, 2, 10), (0, 14, 2, 14)], '#d8e8ff')
    import w6
    sp(a, grid(w6.heater(8, 11, 3, 4, ('g', 'G'), ('b', 'B'))), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12)})
    burst(a, 13, 9)
    return a, 0
def provoke():
    a, _ = w5.taunt()
    w5.pips(a, 2)
    return a, 2
def fortress():
    a = A('sky', cy=6)
    sp(a, TOWER, 3, 3)
    for (x, y) in [(1, 9), (14, 7)]: plus(a, x, y, '#ffffff', '#bfe0ff')
    return a, 0
def rally():
    a = A('royal', cy=14)
    for (x, y) in ring_cells(7.5, 16.0, 6.0, 1.8): a.set(x, y, '#bfd0ff')
    g = blank()
    for y in range(2, 17): put(g, 4, y, 'm')
    put(g, 4, 1, 'y')
    for y in range(3, 10):
        for x in range(5, 13 - (y - 3) // 2 + (0 if y < 9 else -2)):
            put(g, x, y, 'b' if x < 10 else 'B')
    put(g, 7, 5, 'y'); put(g, 6, 6, 'y'); put(g, 7, 6, 'y'); put(g, 8, 6, 'y'); put(g, 7, 7, 'y')
    sp(a, rows(g), {'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12), 'y': ('#ffd84a', 6)})
    return a, 0
def lancecharge():
    a = A('amber', cx=11, cy=8)
    speed(a, [(0, 5, 3, 5), (0, 9, 2, 9), (0, 13, 3, 13), (1, 16, 4, 16)], '#ffe8c0')
    sp(a, HORSE, 4, 4)
    return a, 0
# 성기사
def holystrike():
    a = A('holy', rays=12, k=0.3)
    sw = w5.SWORD_DL
    sp(a, sw, 0, 0, {'w': ('#ffffff', 5), 'm': ('#fff4c0', 5), 'M': ('#d8b860', 5), **{k: v for k, v in w5.HILT.items()}}, glow_c='#fff0a0')
    return a, 0
def guard():
    a = A('royal', rays=12, k=0.3)
    import w6
    cm = w6.heater(10, 13, 3, 3, ('g', 'G'), ('e', 'E'))
    for y in range(5, 13): cm[(7, y)] = 'y'; cm[(8, y)] = 'Y'
    for x in range(5, 11): cm[(x, 7)] = 'y' if x < 8 else 'Y'
    sp(a, grid(cm), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'e': ('#f4f0e8', 7), 'E': ('#c0b8a8', 7), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}, glow_c='#fff0a0')
    return a, 0
def layhands():
    a = A('heal', cy=8)
    glow(a, 7.5, 7.0, 5.0, ['#3a9a4a', '#8ae07a', '#e8ffc8'])
    sp(a, HAND, 3, 8)
    for (x, y) in [(3, 3), (12, 2), (7, 1)]: plus(a, x, y, '#ffffff', '#d8ffc8')
    return a, 0
def judgment():
    a = A('dawn', cy=17, r=16)
    sp(a, grid(cloud([(3.5, 2.5, 2.4), (7.5, 1.8, 2.8), (11.5, 2.5, 2.4)], 'w', 'f')), {'w': ('#ffffff', 7), 'f': ('#d8d0b0', 7)})
    for x0, y0 in [(3, 6), (7, 8), (11, 6)]:
        for y in range(y0, y0 + 7): a.set(x0, y, '#ffffff'); a.set(x0 + 1, y, '#ffe890')
        a.set(x0, y0 + 7, '#ffffff'); a.set(x0 - 1, y0 + 1, '#ffd84a'); a.set(x0 + 2, y0 + 1, '#ffd84a')
    return a, 0
def aegis():
    a = A('holy', rays=12, k=0.3)
    import c_cleric
    sp(a, (WING_L[0], WING_L[1]), 0, 7); sp(a, (flip(WING_L[0]), WING_L[1]), 9, 7)
    import w6
    sp(a, grid(w6.heater(6, 9, 5, 6, ('g', 'G'), ('y', 'Y'))), {'g': ('#fff4c0', 6), 'G': ('#d0a860', 6), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
    for (x, y) in ring_cells(7.5, 3.5, 2.8, 0.9): a.set(x, y, '#fff0a0')
    return a, 0
def devotion():
    a = A('teal', cy=8)
    glow(a, 7.5, 8.5, 5.4, ['#167078', '#5ac8c4', '#c8fff4'])
    sp(a, PRAY, 4, 5)
    return a, 0
def divinity():
    a = A('dawn', cy=9, rays=14, k=0.3, hole=4)
    sp(a, WING_L, 0, 6); sp(a, (flip(WING_L[0]), WING_L[1]), 9, 6)
    glow(a, 7.5, 9.0, 3.4, ['#ffa030', '#ffd84a', '#fff8d0'])
    return a, 0
# 광전사
def bloodstrike():
    a = A('blood', cx=6, cy=8)
    sp(a, AXE, 3, 3)
    for (x, y) in [(2, 9), (1, 11), (3, 12), (11, 5), (12, 7)]: a.set(x, y, '#e8283a')
    dot(a, [(1, 10), (12, 6)], '#ff8a8a')
    return a, 0
def whirl():
    a = A('ember', cuts=[0.0, 0.35, 0.6, 0.82, 0.96])
    for k in range(2):
        slash(a, crescent(7.5, 9.5, 7.2, k * 180 + 20, k * 180 + 160, 2.4, fade=0.8), WSL)
    sp(a, AXE, 4, 3)
    return a, 0
def bloodthirst():
    a = A('evil', cy=8)
    glow(a, 7.5, 8.0, 5.0, ['#6e1230', '#9a1e44'])
    sp(a, GOBLET, 4, 6)
    for (x, y) in [(3, 4), (12, 5)]: a.set(x, y, '#ff4a5a')
    return a, 0
def rampage():
    a = A('fire', cy=10)
    for y in range(20):
        for x in range(16):
            if y > 13 + 2 * math.sin(x * 1.7): a.set(x, y, '#ffa030' if y > 16 else '#e04a10')
    sp(a, EYE, 3, 6, {'w': ('#ffd8c8', 1), '1': ('#ff4a1a', 1), '2': ('#a01008', 1), '3': ('#1a0404', 1)})
    for (x, y) in [(3, 5), (4, 4), (5, 4), (12, 5), (11, 4), (10, 4)]: a.set(x, y, '#1a0404')
    return a, 0
def frenzy():
    a = A('fire', cy=13)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 9 + 2.5 * abs(math.sin(x * 1.1)) + abs(u) * 0.4: a.set(x, y, '#ffa030' if y > 15 else '#e04a10')
    sp(a, AXE, 1, 3); sp(a, flip(AXE[0]), 5, 3, AXE[1])
    return a, 0
# 피의 군주
def bloodfeast():
    a = A('evil', cy=9)
    sp(a, FANGS, 2, 5)
    for (x, y) in [(5, 14), (5, 15), (10, 14), (10, 15), (10, 16)]: a.set(x, y, '#e8283a')
    return a, 0
def bloodlust():
    a = A('evil', cuts=[0.0, 0.25, 0.45, 0.65, 0.85], rays=10, k=0.4)
    big = (['....1....', '....1....', '...111...', '..11112..', '.1111112.', '.1w11112.', '111111122', '111111122', '.1111122.', '..11222..'], {'1': ('#e8283a', 13), '2': ('#8a0a1a', 13)})
    sp(a, big, 3, 5)
    sp(a, DROP, 12, 11, {'1': ('#e8283a', 13), '2': ('#8a0a1a', 13)})
    return a, 0
def bloodmoon():
    a = A('night', cy=8)
    glow(a, 7.5, 8.5, 6.0, ['#3a0610', '#6e1230'])
    cm = orb(7.5, 8.5, 4.6, '123')
    for p in [(6, 7), (9, 10), (8, 6)]: cm[p] = '3'
    sp(a, grid(cm), {'1': ('#ff6a5a', 13), '2': ('#d02a2a', 13), '3': ('#8a1018', 13)})
    sp(a, BAT, 1, 14); sp(a, BAT, 9, 15)
    return a, 0
def ragnarok():
    a = A('fire', cy=16, r=15)
    for y in range(20):
        for x in range(16):
            if y > 13 + 1.5 * math.sin(x * 1.9): a.set(x, y, '#ffd060' if y > 17 else '#ff7a1a' if y > 15 else '#c0300e')
    sp(a, ['.......gG.......', '.......lL.......', '.......lL.......', '....ggggGGGG....', '.......wM.......', '.......wM.......', '.......wM.......', '.......wM.......', '.......wM.......', '.......wM.......', '.......wM.......', '.......wM.......'], 0, 1, {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'w': ('#fff0c0', 5), 'M': ('#e08a3a', 5)})
    a.paint(['.ffff.', 'ffwwff', '.ffff.'], {'f': '#ffc040', 'w': '#ffffff'}, ox=5, oy=12)
    return a, 0
ICONS = {'arena': ('투기장 쌍격', 'dmg', arena), 'parry': ('흘려 받기', 'buff', parry), 'roar': ('관중의 함성', 'buff', roar), 'execute': ('난도질', 'dmg', execute), 'spinslash': ('회전 베기', 'dmg', spinslash),
         'glory': ('영광의 연격', 'dmg', glory), 'crowd': ('관중의 환호', 'none', crowd), 'finale': ('피날레', 'dmg', finale), 'colosseum': ('콜로세움', 'dmg', colosseum),
         'shieldbash': ('방패 치기', 'dmg', shieldbash), 'provoke': ('도발 2', 'taunt', provoke), 'fortress': ('요새', 'buff', fortress), 'rally': ('결집', 'buff', rally), 'lancecharge': ('돌격', 'dmg', lancecharge),
         'holystrike': ('성스러운 일격', 'dmg', holystrike), 'guard': ('수호의 맹세', 'taunt', guard), 'layhands': ('치유의 손길', 'heal', layhands), 'judgment': ('천상의 심판', 'mdmg', judgment), 'aegis': ('신성한 방패', 'buff', aegis), 'devotion': ('헌신', 'none', devotion), 'divinity': ('신의 강림', 'mdmg', divinity),
         'bloodstrike': ('피의 일격', 'dmg', bloodstrike), 'whirl': ('회전 도끼', 'dmg', whirl), 'bloodthirst': ('피의 갈증', 'heal', bloodthirst), 'rampage': ('폭주', 'buff', rampage), 'frenzy': ('광란', 'none', frenzy),
         'bloodfeast': ('피의 만찬', 'dmg', bloodfeast), 'bloodlust': ('끝없는 갈증', 'none', bloodlust), 'bloodmoon': ('핏빛 달', 'buff', bloodmoon), 'ragnarok': ('라그나로크', 'dmg', ragnarok)}
