"""2단계 고치기 F: 앞서 손봤지만 전과 거의 같아 보이던 19개를 새로 (광폭화·기사단 돌격·비전 숙련·별의 종언·잰걸음·질주·집중·전술·관중의 함성·콜로세움·헌신·광란·피의 만찬·해독·신의 기적·천상의 기적·마비 침·신속)"""
import math
import cell
from cell import Art, mix, W, H, dsword, dsword_ur, sword
from lib import *
from spr import *
from spear import spear, SPP
import w5, w6
def A(theme, **k): return bg(Art(), theme, **k)
GOLD = {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
# ── 광폭화: 핏줄 선 붉은 팔 + 불길 + 떨어지는 피 (HP를 깎아 힘을) ──
def berserk():
    a = A('blood', cy=9, rays=12, k=0.45, hole=3)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 9 + 3 * abs(math.sin(x * 1.25)) + abs(u) * 0.15: a.set(x, y, '#ff7a1a' if y > 15 else '#d0400e')
    sp(a, ARMFLEX[0], 2, 3, {'m': ('#f06a4a', 2), 'w': ('#ffc0a0', 2), 'M': ('#b02a22', 2), 'n': ('#7a1414', 2)})
    for (x, y) in [(5, 11), (6, 12), (7, 11), (11, 7), (11, 9), (12, 8)]: a.set(x, y, '#8a1414')
    for (x, y) in [(3, 16), (4, 17), (8, 17), (8, 18)]: a.set(x, y, '#e8283a')
    for (x, y) in [(1, 3), (14, 2), (14, 12)]: plus(a, x, y, '#ffffff', '#ffb080')
    return a, 0
# ── 기사단 돌격: 나란히 내지르는 기사 창 셋 + 깃발 ──
LANCE_P = {'w': ('#ffffff', 5), 'm': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#e8e0d0', 7), 'T': ('#a8a090', 7), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'r': ('#3a6ae8', 12), 'R': ('#ffffff', 12)}
def kn_charge():
    a = A('steelb', cx=12, cy=6, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    speed(a, [(0, 12, 3, 9), (1, 16, 4, 13), (5, 18, 7, 16)], '#c8e0ff')
    LP = {'w': ('#ffffff', 5), 'm': ('#d4dcea', 5), 'M': ('#7a849a', 5), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}
    for (tx, ty, dark) in [(15.4, 9.6, 0), (10.4, 2.6, 0)]:
        sp(a, grid(spear(tx, ty, 135, Lh=6.0, hw=1.5, Ls=8, sw=0.8, collar=1.0, cw=2.0, tassel=False, apex=1.0, sharp=1.0)), LP)
    for (x, y) in [(6, 9), (7, 9), (6, 10), (5, 10)]: a.set(x, y, '#3a6ae8')
    for (x, y) in [(11, 16), (12, 16), (11, 17), (10, 17)]: a.set(x, y, '#3a6ae8')
    burst(a, 13, 4, big=False)
    return a, 0
# ── 비전 숙련: 펼친 마법책 위로 떠오른 마법진 ──
def arcane():
    a = A('arcane', rays=12, k=0.35, hole=4)
    TOME = ['yYpppppppppyY', 'Ypppppppppppye', 'ppppppzzpppppe', 'pppppzwwzppppe', 'ppppzwzzwzpppe', 'pppzwzzzzwzppe', 'ppppzwzzwzpppe', 'pppppzwwzppppe', 'ppppppzzpppppe', 'Ypppppppppppye', 'yYPPPPPPPPPyYe', '.eeeeeeeeeeee.']
    sp(a, TOME, 1, 4, dict(GOLD, p=('#7a4ad0', 9), P=('#4a2a90', 9), z=('#c8a8ff', 1), w=('#ffffff', 1), e=('#f4ecd8', 7)), glow_c='#b890ff')
    for (x, y) in [(2, 2), (13, 2), (14, 17), (1, 17)]: star5(a, x, y, '#ffffff', '#e0d0ff', '#a890ff')
    sp(a, ['r', 'r', 'r', 'R'], 10, 15, {'r': ('#e83a3a', 13), 'R': ('#a02020', 13)})
    return a, 0
# ── 별의 종언: 불꼬리 달고 땅으로 떨어지는 큰 별 ──
def awk2_mage():
    a = A('night', cx=4, cy=15, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    for (x, y) in [(2, 3), (6, 1), (13, 14), (3, 8)]: a.set(x, y, '#ffffff')
    tail(a, 6.0, 11.0, 17.0, 0.0, 3.6, 1.0, ['#fff8d0', '#ffd040', '#ff8a2a', '#c8401a'])
    for y in range(17, 20):
        for x in range(16): a.set(x, y, '#3a1a0a' if y > 17 else '#e07a20')
    glow(a, 5.5, 18.5, 4.0, ['#ff8a2a', '#ffd040'])
    sp(a, grid(poly_cells(star_poly(5.5, 11.5, 5.0, 2.2, rot=-100), 's')), {'s': ('#fff0a0', 6)}, glow_c='#ffffff')
    a.set(4, 10, '#ffffff'); a.set(5, 10, '#ffffff')
    return a, 0
# ── 잰걸음: 잔상 남기며 발끝으로 딛는 도적 장화 ──
RBOOT = (['..kkkk...', '..kkkk...', '..kkkk...', '..kkkK...', '..kkkkk..', '.kkkkkkkk', 'kkkkkkkkK', 'KKKKKKKK.'], {'k': ('#4a3a6a', 9), 'K': ('#2a2040', 9)})
def quickstep():
    a = A('teal', cy=11, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for k, c in ((6, '#2e7a82'), (3, '#4aa8a8')):
        for j, r in enumerate(RBOOT[0]):
            for i, ch in enumerate(r):
                if ch != '.': a.set(i + 6 - k, j + 7 - k // 3, c)
    sp(a, RBOOT, 6, 7)
    for (x, y) in [(6, 2), (7, 2)]: pass
    speed(a, [(0, 8, 2, 8), (0, 12, 1, 12)], '#c8fff8')
    paint_cm(a, cloud([(14.0, 15.6, 1.4), (12.0, 16.4, 1.1)]), {'1': '#e0fff8', '2': '#a8e0d8'})
    sp(a, ['y.', 'yy'], 9, 12, GOLD)
    return a, 0
# ── 질주: 날개 달린 금 장화 ──
WBOOT = (['..yyyy...', '..yyyY...', '..yyyY...', '..yyyY...', '..yyyyy..', '.yyyyyyyy', 'yyyyyyyyY', 'YYYYYYYY.'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)})
def sprint():
    a = A('sky', cy=9, rays=12, k=0.35, hole=4)
    speed(a, [(0, 6, 2, 6), (0, 10, 1, 10), (0, 14, 2, 14)], '#ffffff')
    sp(a, flip(WING_L[0]), 9, 4, {'w': ('#ffffff', 5), 'f': ('#c8d4f0', 5)})
    sp(a, flip(WING_L[0]), 10, 7, {'w': ('#ffffff', 5), 'f': ('#c8d4f0', 5)})
    sp(a, WBOOT, 3, 7)
    sp(a, ['hhhh'], 5, 6, {'h': ('#fff8d0', 6)})
    return a, 0
# ── 전술: 작전 지도 위 화살표 + 기사 말 ──
def tactics():
    a = A('royal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    MAP = {}
    for y in range(4, 16):
        for x in range(1, 15):
            MAP[(x, y)] = 'e' if (x + y) % 5 else 'E'
    sp(a, grid(MAP), {'e': ('#f0dcaa', 7), 'E': ('#d8c08a', 7)})
    for (x, y) in [(3, 13), (4, 12), (5, 11), (6, 11), (7, 10), (8, 9), (9, 8), (10, 7)]: a.set(x, y, '#d8322a')
    a.paint(['rrr', '.rr', 'r.r'], {'r': '#d8322a'}, ox=10, oy=5)
    for (x, y) in [(3, 6), (12, 12)]: a.paint(['b.', 'bb', 'b.'], {'b': '#2e5ad0'}, ox=x, oy=y)
    sp(a, KNIGHT, 7, 9)
    return a, 0
# ── 관중의 함성: 두 손 든 관중 + 크게 퍼지는 함성 ──
def roar():
    a = A('amber', rays=14, k=0.4, hole=3)
    arcs(a, 7.5, 10.0, [7.6], [(150, 210), (-30, 30)], ['#ffffff'])
    LION = ['...M.MM.MM.M...', '..MMMMMMMMMMM..', '.MMMmmmmmmmMMM.', 'MMMmmmmmmmmmMMM', '.MmmkmmmmmkmmM.', 'MMmmmmmmmmmmmMM', '.MmmmmnnnmmmmM.', 'MMmmmkkkkkmmmMM', '.MmmkwrrrwkmmM.', 'MMmmkwrrrwkmmMM', '.MMmmkkkkkmmMM.', '..MMMmmmmmMMM..', '...MMMMMMMMM...', '.....M.M.M.....']
    sp(a, LION, 0, 3, {'M': ('#a8501a', 3), 'm': ('#f0b860', 2), 'k': ('#2a1206', 1), 'n': ('#5a2a10', 2), 'w': ('#ffffff', 1), 'r': ('#c8283a', 13)})
    return a, 0
# ── 콜로세움: 경기장을 통째로 휩쓰는 금빛 초승달 베기 ──
def colosseum():
    a = A('dawn', cy=17, r=16, cuts=[0.0, 0.2, 0.42, 0.64, 0.86])
    big = ['..dddddddddddd..', '.dkdkdkdkdkdkdd.', 'dddddddddddddddd', 'dkdkdkdkdkdkdkdk', 'dkdkdkdkdkdkdkdk', 'dddddddddddddddd', 'dkdkdkdkdkdkdkdk']
    for j, r in enumerate(big):
        for i, c in enumerate(r):
            if c != '.': a.set(i, 13 + j, {'d': '#e0b070', 'k': '#3a1a0a'}[c])
    w5.slash(a, w5.crescent(7.5, 13.0, 8.4, 185, 355, 2.6, fade=0.85), cols=('#ffffff', '#fff0a0', '#ffc040', '#e07a20'))
    star5(a, 7, 2); flash(a, 1, 12); flash(a, 14, 11)
    return a, 0
# ── 헌신: 땅에 꽂은 칼 + 뒤에서 빛나는 하트 ──
def devotion():
    a = A('royal', cy=8, rays=14, k=0.4, hole=3)
    HB = (['.rrr....rrr.', 'rrhrr..rrrrr', 'rhrrrrrrrrrR', 'rrrrrrrrrrRR', 'rrrrrrrrrrRR', '.rrrrrrrrRR.', '..rrrrrrRR..', '...rrrrRR...', '....rrRR....', '.....RR.....'],
          {'r': ('#ff5a6a', 13), 'R': ('#b02a40', 13), 'h': ('#ffd0d8', 1)})
    sp(a, HB, 2, 3, glow_c='#ffb8d0')
    sp(a, grid(sword(7.5, 18.6, -90, blade=10.0, bw=2.2, tip=1.6, guard=7.0, gt=1.2, grip=2.4, gw=1.2, pom=1.0)), dict(GOLD, l=('#5a3a8a', 9), L=('#3a2460', 9), w=('#ffffff', 5), m=('#d4dcea', 5), M=('#8a94a8', 5)))
    return a, 0
# ── 광란: 붉은 눈이 이글거리는 뿔 투구 ──
HORNH = (['h..........h', 'hh........hh', '.hh.mmmm.hh.', '..hmmmmmmh..', '..mmmmmmmmM.', '.mmmmmmmmmMM', '.MkkkMMkkkMM', '.MkrrkkrrkMM', '.MMkkMMkkMMM', '.MMMMkMMMMM.', '..MMMkMMMM..', '...MMMMMM...'],
         {'h': ('#f0e8d0', 7), 'm': ('#9aa0b0', 5), 'M': ('#5a6070', 5), 'k': ('#1a1414', 1), 'r': ('#ff3a1a', 1)})
def frenzy():
    a = A('fire', cy=12, rays=14, k=0.45, hole=3)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 12 + 2.5 * abs(math.sin(x * 1.3)) + abs(u) * 0.25: a.set(x, y, '#ffa030' if y > 17 else '#e04a10')
    sp(a, HORNH, 2, 3)
    for (x, y) in [(1, 15), (14, 15), (3, 18), (12, 18)]: a.set(x, y, '#fff0a0')
    return a, 0
# ── 피의 만찬: 피 흘리는 송곳니 입 + 붉은 베기 ──
LIPS = (['..RRR..RRR..', '.RrrrRRrrrR.', 'RrrrrrrrrrrR', 'Rwwwwwwwwwwr', 'kkkwkkkkwkkk', 'kkkwkkkkwkkk', '.kkrkkkkrkk.', '.RkkkkkkkkR.', '..RrrrrrrR..', '...RRRRRR...'],
        {'R': ('#7a0a14', 13), 'r': ('#c01828', 13), 'w': ('#fff8f0', 7), 'k': ('#2a0206', 1)})
def bloodfeast():
    a = A('evil', cy=8, rays=12, k=0.4, hole=3)
    w5.slash(a, w5.crescent(7.5, 2.0, 9.0, 30, 150, 2.2, fade=0.8), cols=('#ffffff', '#ffb0b0', '#ff4a4a', '#a01020'))
    sp(a, LIPS, 2, 3)
    for (x, y0, n) in [(5, 13, 3), (10, 13, 4), (7, 13, 2)]:
        for i in range(n): a.set(x, y0 + i, '#e8283a')
        a.set(x, y0 + n, '#ff6a6a')
    return a, 0

# ── 덧붙임: 한 번 더 손봐도 전과 비슷하던 6개 ──
def focus():
    a = A('amber', rays=20, k=0.55, hole=4.5)
    for ang in range(0, 360, 30):
        r0, r1 = 5.6, 9.5
        x0, y0 = 7.5 + math.cos(math.radians(ang)) * r0, 9.5 + math.sin(math.radians(ang)) * r0
        x1, y1 = 7.5 + math.cos(math.radians(ang)) * r1, 9.5 + math.sin(math.radians(ang)) * r1
        line(a, int(x1), int(y1), int(x0), int(y0), '#ffe080', '#ffffff')
    EY = (['...kkkkk...', '.kkwwwwwkk.', 'kwwwwkkwwwk', 'kwwwk1kkwwk', 'kwwwkkkkwwk', '.kkwwwwwkk.', '...kkkkk...'], {'k': ('#2a1206', 1), 'w': ('#fff8ec', 7), '1': ('#ffffff', 1)})
    EY = (['...kkkkk...', '.kkwwwwwkk.', 'kwwwoookwwk', 'kwwoo1okkwk', 'kwwookkokwk', '.kkwwoowkk.', '...kkkkk...'], {'k': ('#2a1206', 1), 'w': ('#fff8ec', 7), 'o': ('#e07a20', 14), '1': ('#ffffff', 1)})
    sp(a, EY, 2, 6)
    return a, 0
def cure():
    a = A('teal', rays=12, k=0.35, hole=4)
    STAFF = {}
    for y in range(2, 19): STAFF[(7, y)] = 't'; STAFF[(8, y)] = 'T'
    STAFF[(7, 1)] = 'y'; STAFF[(8, 1)] = 'Y'
    sp(a, grid(STAFF), dict(GOLD, t=('#d8a060', 3), T=('#8a5a2a', 3)))
    SN = {}
    for i in range(60):
        t = i / 59; y = 16.5 - t * 12.0; x = 7.5 + math.sin(t * math.pi * 3.0) * 3.2
        for dx in (-0.5, 0.5):
            SN[(int(x + dx), int(y))] = 'g' if math.cos(t * math.pi * 3.0) > 0 else 'G'
    for (x, y) in [(10, 3), (11, 3), (10, 4), (11, 4), (12, 4)]: SN[(x, y)] = 'g'
    SN[(11, 3)] = 'k'
    sp(a, grid(SN), {'g': ('#6ae05a', 8), 'G': ('#2e8a2a', 8), 'k': ('#1a1414', 1)})
    a.set(13, 5, '#e83a3a')
    for (x, y) in [(2, 3), (13, 15), (2, 15)]: plus(a, x, y, '#ffffff', '#c8fff0')
    return a, 0
def awk_cleric():
    a = A('holy', cy=10, rays=16, k=0.45, hole=3)
    WL = (['......ww', '....wwwf', '..wwwwff', 'wwwwwfff', '.wwwfff.', 'wwwfff..', '.wff....', '..f.....'], {'w': ('#ffffff', 7), 'f': ('#c8d0e0', 7)})
    sp(a, WL, 0, 6); sp(a, (flip(WL[0]), WL[1]), 8, 6)
    for (x, y) in ring_cells(7.5, 3.4, 3.0, 1.1, 0.45): a.set(x, y, '#ffe060')
    sp(a, grid(cross_cm(7.5, 11.0, 3.4, 2.6, 'g', 'G')), {'g': ('#7aff6a', 8), 'G': ('#2e9a2a', 8)})
    for (x, y) in [(2, 16), (13, 16), (7, 18)]: plus(a, x, y, '#ffffff', '#c8ffc0')
    return a, 0
def awk2_cleric():
    a = A('sky', cy=9, r=14, rays=14, k=0.35, hole=3)
    GATE = (['....yyyyyy....', '..yyhhhhhhyy..', '.yhhhhhhhhhhy.', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yhhhhhhhhhhhhy', 'yyyyyyyyyyyyyy'],
            dict(GOLD, h=('#ffffff', 1)))
    DOOR = (['yy', 'Yy', 'YY', 'Yy', 'YY', 'Yy', 'YY', 'YY'], GOLD)
    sp(a, GATE, 1, 3)
    sp(a, DOOR, 0, 6); sp(a, (flip(DOOR[0]), GOLD), 14, 6)
    for (x, y) in [(7, 5), (7, 6), (6, 7), (8, 7), (7, 8)]: a.set(x, y, '#ffe060')
    for y in range(15, 20):
        for x in range(16):
            if (x + 0.5 - 7.5) ** 2 / 64 + (y - 20) ** 2 / 25 <= 1: a.set(x, y, '#ffffff' if y < 17 else '#d8e4f4')
    for (x, y) in [(0, 2), (15, 3), (7, 1)]: plus(a, x, y, '#ffffff', '#fff0a0')
    return a, 0
def parasting():
    a = A('purple', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, bolt([(12, 2), (10, 5), (13, 7), (11, 10)], w=1), {'w': '#ffffff', 'y': '#fff060'})
    paint_cm(a, bolt([(4, 11), (2, 14), (5, 15), (3, 18)], w=1), {'w': '#ffffff', 'y': '#fff060'})
    DART = ['..........yy', '.........yYy', '........mYY.', '.......mM...', '......mM....', '.....mM.....', '....mM......', '...mM.......', '..mM........', '.wM.........', 'w...........']
    sp(a, DART, 2, 3, dict(GOLD, m=('#d4dcea', 5), M=('#7a849a', 5), w=('#ffffff', 5)))
    burst(a, 3, 14, big=False, cols=('#ffffff', '#fff8a0', '#ffe040'))
    return a, 0
def haste():
    a = A('sky', rays=12, k=0.35, hole=4)
    speed(a, [(0, 7, 2, 7), (0, 11, 1, 11), (0, 15, 2, 15)], '#ffffff')
    W_ = {}
    for (x, y) in ellipse(8.5, 11.0, 5.4, 5.4, 'x'):
        d = math.hypot(x + 0.5 - 8.5, y + 0.5 - 11.0)
        W_[(x, y)] = ('y' if x + y < 19 else 'Y') if d > 4.4 else 'e'
    for (x, y) in [(8, 3), (9, 3), (8, 4), (9, 4)]: W_[(x, y)] = 'y'
    for (x, y) in [(7, 2), (8, 2), (9, 2), (10, 2)]: W_[(x, y)] = 'Y'
    for (x, y) in [(13, 5), (14, 6)]: W_[(x, y)] = 'Y'
    sp(a, grid(W_), dict(GOLD, e=('#fff8ec', 7)))
    paint_cm(a, bolt([(10, 7), (8, 10), (10, 11), (7, 15)], w=0), {'w': '#ffc020'})
    for (x, y) in [(8, 7), (8, 14), (5, 11), (12, 11)]: a.set(x, y, '#5a4a3a')
    return a, 0
ICONS = {'berserk': ('광폭화', 'buff', berserk), 'kn_charge': ('기사단 돌격', 'dmg', kn_charge), 'arcane': ('비전 숙련', 'none', arcane), 'awk2_mage': ('별의 종언', 'mdmg', awk2_mage),
         'quickstep': ('잰걸음', 'none', quickstep), 'sprint': ('질주', 'none', sprint), 'focus': ('집중', 'none', focus), 'tactics': ('전술', 'none', tactics),
         'roar': ('관중의 함성', 'buff', roar), 'colosseum': ('콜로세움', 'dmg', colosseum), 'devotion': ('헌신', 'none', devotion), 'frenzy': ('광란', 'none', frenzy), 'bloodfeast': ('피의 만찬', 'dmg', bloodfeast),
         'cure': ('해독', 'cure', cure), 'awk_cleric': ('신의 기적', 'heal', awk_cleric), 'awk2_cleric': ('천상의 기적', 'heal', awk2_cleric), 'parasting': ('마비 침', 'dmg', parasting), 'haste': ('신속', 'none', haste)}
