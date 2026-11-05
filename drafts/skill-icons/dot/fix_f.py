"""2단계 고치기 F: 앞서 손봤지만 전과 거의 같아 보이던 13개를 새로 (광폭화·기사단 돌격·비전 숙련·별의 종언·잰걸음·질주·집중·전술·관중의 함성·콜로세움·헌신·광란·피의 만찬)"""
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
# ── 집중: 안쪽을 가리키는 네 화살촉에 둘러싸인 눈 ──
def focus():
    a = A('teal', cuts=[0.0, 0.25, 0.48, 0.7, 0.9])
    for (x, y) in ring_cells(7.5, 10.0, 6.4, 6.4, 0.45): a.set(x, y, '#5ac8c4')
    sp(a, EYE, 3, 6, {'k': ('#1a1414', 1), 'w': ('#ffffff', 7), '1': ('#9af0e0', 12), '2': ('#2a9a8a', 12), '3': ('#0a2a2a', 1)})
    for rows_, (x, y) in [(['www', '.w.'], (6, 1)), (['.w.', 'www'], (6, 17)), (['w.', 'ww', 'w.'], (0, 9)), (['.w', 'ww', '.w'], (14, 9))]:
        a.paint(rows_, {'w': '#ffffff'}, ox=x, oy=y)
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
ICONS = {'berserk': ('광폭화', 'buff', berserk), 'kn_charge': ('기사단 돌격', 'dmg', kn_charge), 'arcane': ('비전 숙련', 'none', arcane), 'awk2_mage': ('별의 종언', 'mdmg', awk2_mage),
         'quickstep': ('잰걸음', 'none', quickstep), 'sprint': ('질주', 'none', sprint), 'focus': ('집중', 'none', focus), 'tactics': ('전술', 'none', tactics),
         'roar': ('관중의 함성', 'buff', roar), 'colosseum': ('콜로세움', 'dmg', colosseum), 'devotion': ('헌신', 'none', devotion), 'frenzy': ('광란', 'none', frenzy), 'bloodfeast': ('피의 만찬', 'dmg', bloodfeast)}
