"""2단계 고치기 B: 짐꾼·공통·검투사·챔피언·기사·성기사·광전사·피의 군주 18개"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from arrows import ar
import w5, w6
def A(theme, **k): return bg(Art(), theme, **k)
WSL = ('#ffffff', '#fff0a0', '#ffb040', '#f07a20')
MULE_BODY = (['............F.F.',
              '...........FFFF.',
              '...........FeFF.',
              '..sSSsS...FFFFff',
              '.sSSSSSs.FFFF.ff',
              '.sSllSSFFFFF....',
              'FFFllFFFFFF.....',
              'FFFFFFFFFFF.....',
              '.FFFFFFFFF......',
              '.F.F...F.F......',
              '.F.F...F.F......',
              '.k.k...k.k......'], {'F': ('#8a6a50', 3), 'f': ('#c8b098', 3), 'e': ('#1a1414', 1), 's': ('#e0c08a', 9), 'S': ('#a07a4a', 9), 'l': ('#6a3a1a', 9), 'k': ('#2a1a10', 1)})
def packmule():
    a = A('green', cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(16, 20):
        for x in range(16): a.set(x, y, '#3a6a2a' if y == 16 else '#2a4a1e')
    sp(a, MULE_BODY, 0, 5)
    return a, 0
DWHAM45 = ['........tT..',
           '.......tT...',
           '......tT....',
           '.....tT.....',
           '..mmmmmm....',
           '.mwyymmmM...',
           'mmmmmmmmMM..',
           'mmyymmmmMM..',
           'mmmmmmmMMn..',
           '.MMMMMMMn...']
def dw_smash():
    a = A('earth', cy=16, r=13, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(15, 20):
        for x in range(16): a.set(x, y, '#5a3418' if y > 15 else '#8e5c2a')
    for (rx, ry, c) in [(7.6, 2.2, '#ffe0a0'), (5.2, 1.4, '#ffffff')]:
        for (x, y) in ring_cells(7.5, 15.5, rx, ry, w=0.45):
            if y >= 15: a.set(x, y, c)
    sp(a, DWHAMV, 1, 3, {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
    for (x, y, r) in [(0, 9, ['sS', 'SS']), (14, 8, ['sS', 'SS']), (12, 4, ['s']), (2, 5, ['s'])]:
        sp(a, ['.' * x + rr for rr in r], 0, y, {'s': ('#e0bc8a', 9), 'S': ('#9a7048', 9)})
    return a, 0
RUN2 = (['......ww..',
         '......ww..',
         '....wwww..',
         '...ww.wwww',
         '..ww..ww..',
         '.w...www..',
         '.....w.ww.',
         '....ww..w.',
         '...ww...ww',
         '..ww......',
         '.ww.......'], {'w': ('#ffffff', 7)})
def sprint():
    a = A('sky', cx=10, cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (y, x0, x1) in [(5, 0, 4), (8, 0, 3), (11, 0, 5), (14, 1, 4)]: speed(a, [(x0, y, x1, y)], '#d8f0ff')
    for y, r in enumerate(RUN2[0]):
        for x, ch in enumerate(r):
            if ch != '.': a.set(x + 2, y + 5, '#6aa8e8')
    sp(a, RUN2, 5, 4)
    paint_cm(a, cloud([(4, 16, 1.4), (2, 16.4, 1.0)]), {'1': '#e0f0ff', '2': '#a8c8f0'})
    return a, 0
def focus():
    a = A('teal', rays=12, k=0.3)
    for (x, y) in [(1, 4), (2, 4), (1, 5), (14, 4), (13, 4), (14, 5), (1, 15), (2, 15), (1, 14), (14, 15), (13, 15), (14, 14)]: a.set(x, y, '#ffffff')
    sp(a, EYE, 3, 6, {'1': ('#3ad0a0', 1), '2': ('#1a7a60', 1), '3': ('#0e2a24', 1)})
    for (x, y) in ring_cells(7.5, 9.5, 2.6, 2.6, w=0.45):
        if (x + y) % 2: a.set(x, y, '#ffffff')
    plus(a, 12, 7)
    return a, 0
HG2 = (['yyyyyyy', '.c111c.', '.c111c.', '..c1c..', '...c...', '..c1c..', '.c.1.c.', '.c111c.', 'yyyyyyy'], {'y': ('#ffd84a', 6), 'c': ('#d8f4ff', 12), '1': ('#ffe0a0', 7)})
def haste():
    a = A('amber', rays=10, k=0.35)
    speed(a, [(0, 7, 1, 7), (0, 12, 1, 12)], '#fff0c8')
    sp(a, (WING_L[0][1:6], WING_L[1]), 0, 6); sp(a, (flip(WING_L[0])[1:6], WING_L[1]), 9, 6)
    sp(a, HG2, 4, 5)
    return a, 0
def tactics():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(13, 20):
        for x in range(16):
            if (x // 2 + y // 2) % 2: a.set(x, y, '#2a1e84')
            else: a.set(x, y, '#5a5ad8')
    for i in range(10):
        t = i / 9; a.set(int(11 + math.cos(math.radians(-60 + t * 150)) * 3.6), int(6 + math.sin(math.radians(-60 + t * 150)) * 3.6), '#ffe060')
    a.paint(['y.', 'yy', 'y.'], {'y': '#ffe060'}, ox=12, oy=1)
    sp(a, KNIGHT, 2, 4)
    return a, 0
def ar_cheer():
    a = A('sand', cy=4, rays=12, k=0.3)
    for (x, y, c) in [(2, 3, '#ff6a8a'), (6, 2, '#ffe060'), (10, 3, '#6ad0ff'), (13, 2, '#8af07a'), (4, 6, '#ffffff'), (12, 6, '#ff9a3a'), (8, 5, '#ff6a8a')]: a.set(x, y, c)
    CROWD = ['.s.....s......s.', 'sss...sss....sss', '.s.s.s.s.s..s.s.', '.sss.sss.sss.sss', 'sssssssssssssss.', 'kkkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk']
    for y, r in enumerate(CROWD):
        for x, ch in enumerate(r):
            if ch == 's': a.set(x, y + 12, '#3a2210' if y < 5 else '#2a1608')
            elif ch == 'k': a.set(x, y + 12, '#2a1608')
    sp(a, HEART[0], 4, 6, HEART[1])
    return a, 0
def ar_finish():
    a = A('blood', cy=14, rays=14, k=0.4, hole=2)
    burst(a, 7, 15)
    for (x0, y0, x1, y1) in [(2, 11, 4, 13), (13, 11, 11, 13), (1, 16, 3, 16), (14, 16, 12, 16)]: line(a, x0, y0, x1, y1, '#ffe0a0')
    sp(a, ['......yY......', '......yY......', '....yyyyYY....', '......mM......', '......mM......', '......mM......', '......mM......', '......mM......', '......wM......', '.......M......'], 1, 2, w5.HILT if False else {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
    return a, 0
BANDAID = (['.........eE.',
            '........eeeE',
            '.......eekeE',
            '......eeeeE.',
            '.....wwwwE..',
            '....wwwwwE..',
            '...wwwwwE...',
            '..eeeeeE....',
            '.eekeeE.....',
            'eeeeeE......',
            'eeeEE.......',
            '.EE.........'], {'e': ('#e8c090', 9), 'E': ('#b08050', 9), 'w': ('#f8f4ec', 7), 'k': ('#a87040', 1)})
def bandage():
    a = A('rose', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, BANDAID, 2, 4)
    sp(a, DROP, 11, 12, {'1': ('#e8283a', 13), '2': ('#8a0a1a', 13)})
    a.paint(['w...w', '.w.w.', '..w..', '.w.w.', 'w...w'], {'w': '#ffffff'}, ox=10, oy=12)
    return a, 0
def roar():
    a = A('sand', cy=12, rays=12, k=0.35, hole=4)
    arcs(a, 7.5, 9.0, [3.4, 5.0, 6.6], [(205, 335)], ['#ffffff', '#fff0b0', '#ffc860'])
    big = ['..ssssssssss....', '.sdsdsdsdsdsds..', 'ssssssssssssssss', 'sdsdsdsdsdsdsdsd', 'sdsdsdsdsdsdsdsd', 'ssssssssssssssss', 'sdsdsdsdsdsdsdsd', 'sdsdsdsdsdsdsdsd', 'SSSSSSSSSSSSSSSS']
    sp(a, big, 0, 10, COLOSSEUM[1])
    for x in (2, 13):
        sp(a, ['r', 'r', 'r', 't'], x, 6, {'r': ('#e83a3a', 13), 't': ('#7a4c22', 3)})
    return a, 0
def colosseum():
    a = A('warm', cy=6, rays=10, k=0.3)
    big = ['..ssssssssss....', '.sdsdsdsdsdsds..', 'ssssssssssssssss', 'sdsdsdsdsdsdsdsd', 'sdsdsdsdsdsdsdsd', 'ssssssssssssssss', 'sdsdsdsdsdsdsdsd', 'sdsdsdsdsdsdsdsd', 'SSSSSSSSSSSSSSSS']
    sp(a, big, 0, 9, COLOSSEUM[1])
    slash(a, crescent2((7.5, 6.5), 8.4, (7.5, 8.6), 8.4), WSL)
    star5(a, 2, 9); star5(a, 13, 8)
    return a, 0
def shieldbash():
    a = A('steelb', cx=13, cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    speed(a, [(0, 5, 2, 5), (0, 9, 2, 9), (0, 13, 2, 13), (1, 16, 3, 16)], '#d8e8ff')
    cm = {}
    for y in range(3, 17):
        for x in range(3, 12):
            t = (y - 3) / 13; skew = (x - 3) * 0.25
            half = 4.5 if t < 0.55 else 4.5 * (1 - ((t - 0.55) / 0.45) ** 1.6)
            cx = 7.0 + skew * 0.0
            if abs(x + 0.5 - 7.5) <= half:
                edge = abs(x + 0.5 - 7.5) > half - 1 or y == 3
                cm[(x, y + round(-(x - 7) * 0.3))] = ('g' if x < 8 else 'G') if edge else ('b' if x < 8 else 'B')
    for y in range(5, 14): cm[(7, y)] = 'y'
    sp(a, grid(cm), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12), 'y': ('#ffe070', 6)})
    burst(a, 13, 8)
    a.paint(['y.y', '.y.', 'y.y'], {'y': '#ffe060'}, ox=12, oy=13)
    return a, 0
HORSE2 = (['....FF......',
           '...FFF......',
           '..kFFFF.....',
           '.kkFFwFFr...',
           '.kkFeFwFFr..',
           'kkkFFFFwFFr.',
           'kkFFFFFFwFF.',
           'kkFFrFFFFwFF',
           'kkFF..rrFFwF',
           'kFF.....FFFF',
           'kF......FkFF',
           '.F.......FF.'], {'F': ('#8a5a3a', 3), 'k': ('#1e140c', 1), 'w': ('#f4ecd8', 7), 'e': ('#1a1414', 1), 'r': ('#d8b040', 6)})
def lancecharge():
    a = A('steelb', cx=12, cy=8, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    speed(a, [(0, 6, 1, 6), (0, 10, 2, 10), (0, 14, 2, 14)], '#d8e8ff')
    sp(a, KHELM, 2, 4)
    sp(a, grid(spike((15.6, 9.5), (13.0, 9.5), 1.2, 'm', 'M', 'w')))
    burst(a, 14, 9, big=False)
    return a, 0
def devotion():
    a = A('teal', cy=8, rays=12, k=0.25)
    glow(a, 7.5, 8.0, 5.8, ['#167078', '#5ac8c4', '#c8fff4'])
    sp(a, PRAY, 4, 6)
    sp(a, ['1.1', '111', '.1.'], 6, 2, {'1': ('#ff5a7a', 13)})
    return a, 0
def divinity():
    a = A('dawn', cy=8, rays=14, k=0.3, hole=4)
    for x in (4, 7, 8, 11):
        for y in range(12, 20): a.set(x, y, '#fff4c0' if (y + x) % 2 else '#ffe890')
    sp(a, WING_L, 0, 5); sp(a, (flip(WING_L[0]), WING_L[1]), 9, 5)
    glow(a, 7.5, 8.0, 3.8, ['#ff8a30', '#ffd84a', '#fff8d0', '#ffffff'])
    for (x, y) in ring_cells(7.5, 2.5, 2.8, 0.9): a.set(x, y, '#ffd84a')
    return a, 0
HORNHELM = (['e..........e', 'ee........ee', '.ee.mmmm.ee.', '..emmmmmmMe.', '..mmmmmmmMM.', '..nnnnnnnnn.', '..mrrmmrrMM.', '..mmmmmmmMM.', '..mmkkkkmMM.', '...mmmmmMM..'], {'e': ('#f0e0c0', 7), 'r': ('#ff3a1a', 1)})
def rampage():
    a = A('fire', cy=10, rays=12, k=0.4)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y < 9 and abs(u) < 3.2 - (9 - y) * 0.35 + 1.2 * math.sin(x * 2.1 + y): a.set(x, y, '#ffd060' if abs(u) < 1.2 else '#ff7a1a')
    big = ['.111..111.', '1111111112', '1h11111122', '1111111122', '.11111122.', '..111122..', '...1122...', '....22....']
    cm = {}
    for y, r in enumerate(big):
        for x, ch in enumerate(r):
            if ch != '.': cm[(x + 3, y + 8)] = ch
    for (x, y) in [(7, 8), (8, 9), (7, 10), (8, 11), (7, 12), (8, 13)]: cm[(x, y)] = 'k'
    sp(a, grid(cm), {'1': ('#b01828', 13), '2': ('#5a0a14', 13), 'h': ('#ff6a6a', 1), 'k': ('#ffc040', 1)})
    return a, 0
def frenzy():
    a = A('fire', cy=13, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 11 + 2.5 * abs(math.sin(x * 1.1)) + abs(u) * 0.3: a.set(x, y, '#ffa030' if y > 16 else '#e04a10')
    sp(a, AXE, 0, 3); sp(a, flip(AXE[0]), 6, 3, AXE[1])
    for (x, y) in [(7, 2), (8, 4), (6, 16), (9, 15)]: a.set(x, y, '#e8283a')
    return a, 0
FANGS2 = (['..rrrrrrrr..', '.rRrrrrrrRr.', 'rwwwwwwwwwwr', 'rwkwkkkkwkwr', 'rkwkkkkkkwkr', 'rkkkkuukkkkr', 'rkwkkkkkkwkr', 'rwkwkkkkwkwr', 'rwwwwwwwwwwr', '.rRrrrrrrRr.', '..rrrrrrrr..'], {'r': ('#c01828', 13), 'R': ('#ff4a5a', 13), 'k': ('#3a0408', 1), 'w': ('#fff8f0', 7), 'u': ('#e85a7a', 1)})
def bloodfeast():
    a = A('evil', cy=9, rays=10, k=0.35)
    sp(a, FANGS2, 2, 4)
    for (x, y) in [(4, 15), (4, 16), (11, 15), (11, 16), (11, 17), (7, 16)]: a.set(x, y, '#e8283a')
    return a, 0
DWHAMV = ['......tT......',
          '......tT......',
          '......tT......',
          '......tT......',
          '......yY......',
          '......tT......',
          'yyyyyyyyyyyyyY',
          'ymwmmmmmmmmMMY',
          'ymmmmmrrmmmMMY',
          'ymmmmmmmmmmMMY',
          'yYYYYYYYYYYYYY']
HORSE3 = (['..F.F.......',
           '..FFFF......',
           '.kFFFFF.....',
           'kkFFwFFF....',
           'kkFFFFFFF...',
           'kkFFFFFFFF..',
           'kkFFF.dFFFF.',
           'kkFF...dFFFF',
           'kFF.....FFFn',
           'kF......FFF.'], {'F': ('#b0683a', 3), 'k': ('#1e140c', 1), 'w': ('#ffffff', 1), 'd': ('#4a2a10', 1), 'n': ('#3a1a0a', 1)})
KHELM = (['.rr.........',
          'rrrr........',
          'rRrrr.......',
          '..rRrmmmmm..',
          '...mmmmmmmMM',
          '..mwmmmmmmMM',
          '..mmmkkkkkkM',
          '..mmmmmmkmMM',
          '..mmmmmkmkMM',
          '..MmmmmmmMMn',
          '...MMMMMMMn.',
          '...nnnnnnn..'], {'r': ('#e83a3a', 13), 'R': ('#9a1a1a', 13)})
ICONS = {'packmule': ('짐 노새', 'none', packmule), 'dw_smash': ('브론하임 강타', 'dmg', dw_smash), 'sprint': ('질주', 'none', sprint), 'focus': ('집중', 'none', focus),
         'haste': ('신속', 'none', haste), 'tactics': ('전술', 'none', tactics), 'ar_cheer': ('관중의 응원', 'heal', ar_cheer), 'ar_finish': ('피니시', 'dmg', ar_finish),
         'bandage': ('붕대 감기', 'buff', bandage), 'roar': ('관중의 함성', 'buff', roar), 'colosseum': ('콜로세움', 'dmg', colosseum), 'shieldbash': ('방패 치기', 'dmg', shieldbash),
         'lancecharge': ('돌격', 'dmg', lancecharge), 'devotion': ('헌신', 'none', devotion), 'divinity': ('신의 강림', 'mdmg', divinity), 'rampage': ('폭주', 'buff', rampage),
         'frenzy': ('광란', 'none', frenzy), 'bloodfeast': ('피의 만찬', 'dmg', bloodfeast)}
