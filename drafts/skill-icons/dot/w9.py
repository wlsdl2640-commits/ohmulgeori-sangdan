"""전사 나머지 스킬 10개 — 뭉툭 도트 시안 (고친 것 모음)."""
import math
import cell
from cell import Art, radial, mix
from w5 import slash, crescent, flash, rays_bg, ring, HILT, FL, BLOOD
import w6, w7, w8
from w6 import blank, rows, put, mirror, cm_rows, heater
# 6. 대지 가르기
GROUND = ['....sS....Ss....',
          'ttttSkhhhhkStttt',
          'vvvvvyvhhvyvvvvv',
          'vvvvyvvvyvvyvvvv',
          'vvvyvvvyvvvvyvvv',
          'vvyvvvvyvvvvvyvv',
          'vyvvvvvvyvvvvvyv',
          'vvvvvvvvyvvvvvvv']
GP = {'t': '#8e5c2a', 'v': '#3a200e', 'y': '#ffc848', 'h': '#fff4c0', 's': '#e0b880', 'S': '#9a6c3c', 'k': '#2a1408'}
DUST = ['#3e2008', '#6e3c10', '#a8641c', '#d89038', '#f4bc66', '#ffe8b0']
ROCK = {'s': ('#e0bc8a', 9), 'S': ('#9a7048', 9)}
def earthsplit():
    a = Art().bg(radial(DUST, 7.5, 13.0, 13, [0.0, 0.22, 0.42, 0.62, 0.82]))
    for (x, y) in [(0, 12), (1, 11), (2, 12), (13, 12), (14, 11), (15, 12)]: a.set(x, y, '#fff4d0')
    a.sym(w6.VSWORD_DOWN, HILT)
    a.paint(GROUND, GP, oy=12)
    for (x, y, r) in [(2, 7, ['sS', 'SS']), (12, 5, ['sS', 'SS']), (4, 4, ['s']), (11, 9, ['s'])]:
        a.sym(['................'] * y + ['.' * x + rr for rr in r], ROCK)
    return a, 0
# 11. 왕국 방패술: 세 방패 + 위에 왕관
CROWN = ['....w..ww..w....',
         '....1..11..1....',
         '....11111111....',
         '....1Y1rr1Y1....',
         '....11111111....']
def kn_wall():
    a = Art().bg(rays_bg(w6.ROYAL, 7.5, 6.0, 12, [0.0, 0.2, 0.42, 0.64, 0.86], 8, '#0a0626', rot=0.2, w=0.4, k=0.4))
    side = {'b': ('#3a64c8', 12), 'B': ('#26408a', 12)}
    a.sym(cm_rows(w6.heater(6, 9, 0, 9, ('n', 'n'), ('b', 'B'))), side)
    a.sym(cm_rows(w6.heater(6, 9, 10, 9, ('n', 'n'), ('b', 'B'))), side)
    cm = w6.heater(8, 11, 4, 8, ('g', 'G'), ('b', 'B'))
    for y in range(9, 14): cm[(7, y)] = 'y'; cm[(8, y)] = 'Y'
    for x in range(5, 11): cm[(x, 11)] = 'y' if x < 8 else 'Y'
    a.sym(cm_rows(cm), {'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'b': ('#4a7ae8', 12), 'B': ('#2e4ea8', 12), 'y': ('#ffe070', 6), 'Y': ('#d0a02a', 6)})
    a.sym(['................'] * 2 + CROWN, {'1': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'r': ('#ff3a4a', 1), 'w': ('#fff6d0', 1)})
    return a, 0
# 14. 용사의 일격: 어두운 남빛 하늘에 금빛 칼 + 아래 빛 터짐
DAWN = ['#0a0626', '#1c1050', '#3a2278', '#7a4a7a', '#c88a4a', '#ffd070']
def awk_warrior():
    a = Art().bg(rays_bg(DAWN, 7.5, 16.5, 17, [0.0, 0.22, 0.42, 0.6, 0.78], 14, '#0a0626', rot=0.0, w=0.45, k=0.35, hole=5))
    for x, y0, y1 in [(2, 5, 11), (13, 5, 11), (4, 0, 3), (11, 0, 3)]:
        for y in range(y0, y1): a.set(x, y, '#fff4c0' if y > y0 else '#ffffff')
    a.sym(w6.HERO, w6.HEROP)
    a.paint(['....y....', '...yhy...', '.yyhwhyy.', 'yhhwwwhhy', '.yyhwhyy.', '...yhy...', '....y....'],
            {'y': '#ffc040', 'h': '#fff0a0', 'w': '#ffffff'}, ox=3, oy=13)
    return a, 0
# 15. 천지개벽: 별 밤하늘과 갈라진 땅을 가르는 빛
def awk2_warrior():
    a = Art()
    SKYC = ['#06041e', '#120a3e', '#22146a', '#3a2496']
    EAR = ['#3a1404', '#5a2208', '#843410', '#b85014', '#f08a24']
    for y in range(20):
        for x in range(16):
            v = x + y - 16
            if v < 0:
                d = math.hypot(x - 1, y - 1); a.set(x, y, SKYC[min(3, int(d / 4.2))])
            else:
                k = 4 if v <= 1 else 3 if v <= 3 else 2 if v <= 6 else 1 if v <= 10 else 0
                a.set(x, y, EAR[k])
    # 땅의 갈라진 틈 (가른 줄에서 뻗어 나감)
    for (x, y) in [(10, 9), (11, 10), (11, 11), (12, 12), (7, 13), (7, 14), (8, 15), (13, 8), (14, 9), (5, 16), (6, 17)]:
        a.set(x, y, '#ffb040' if x + y - 16 < 8 else '#d06a1a')
    for (x, y) in [(2, 7), (6, 2), (9, 1), (1, 11), (4, 9), (8, 4)]: a.set(x, y, '#ffffff')
    a.paint(['.h.', 'hwh', '.h.'], {'h': '#a8b8ff', 'w': '#ffffff'}, ox=4, oy=4)
    a.paint(['.mm', 'm..', 'm..', '.mm'], {'m': '#fff4c0'}, ox=1, oy=3)
    for x in range(16):
        for y in range(20):
            v = x + y - 16; t = abs((x - y) + 1) / 18
            w = 1.7 * (1 - t ** 2)
            if abs(v + 0.5) <= w * 0.45: a.set(x, y, '#ffffff')
            elif abs(v + 0.5) <= w * 0.95: a.set(x, y, '#fff0a0')
            elif abs(v + 0.5) <= w * 1.5: a.set(x, y, '#ffb040' if v >= 0 else '#c0a0ff')
    for (x, y, c) in [(12, 2, '#ffffff'), (13, 1, '#fff0a0'), (2, 13, '#ffffff'), (1, 14, '#fff0a0')]: a.set(x, y, c)
    return a, 0
# 12. 검투사의 함성: 고함 물결 더 밝게
def ar_roar():
    a = Art().bg(rays_bg(w7.SAND, 7.5, 9.5, 11.5, [0.0, 0.2, 0.42, 0.64, 0.86], 10, '#2a1404', rot=0.31, k=0.45, hole=3.5))
    ring(a, 7.5, 10.5, 7.0, [(150, 210), (-30, 30)], '#ffffff')
    ring(a, 7.5, 10.5, 8.6, [(155, 205), (-25, 25)], '#fff0b0')
    a.sym(w7.GLAD, w7.GLADP)
    return a, 0
# 10. 기사단 돌격: 은빛 창 + 붉은 창 깃발 + 큰 손 보호판 + 속도 줄
PURPLE = ['#10041e', '#24083e', '#3e1066', '#5e1e8e', '#8434b4', '#b464dc']
LANCE = ['................',
         '................',
         '................',
         '.............w..',
         '.........ppPwM..',
         '........pPPwmM..',
         '.......p.PwmM...',
         '.........wmM....',
         '........wmmM....',
         '.......wmmM.....',
         '..gg..wmmM......',
         '..ggGwmmM.......',
         '...gGGG.........',
         '....GGGG........',
         '...r..GG........',
         '..R.............',
         '.y..............']
LANCEP = {'w': ('#ffffff', 5), 'm': ('#d0dcf0', 5), 'M': ('#8a9ab8', 5), 'p': ('#ff4a3a', 13), 'P': ('#b01a1a', 13),
          'g': ('#ffd84a', 6), 'G': ('#c08a1c', 6), 'r': ('#b0682a', 9), 'R': ('#7a4220', 9), 'y': ('#ffd84a', 6)}
def kn_charge():
    a = Art().bg(rays_bg(PURPLE, 12.0, 4.0, 16, [0.0, 0.2, 0.4, 0.6, 0.8], 14, '#10041e', rot=0.0, k=0.35, hole=3))
    for (x0, y0, n) in [(1, 10, 4), (9, 13, 4), (7, 16, 2)]:
        for i in range(n): a.set(x0 + i, y0 - i, '#ffffff' if i == n - 1 else '#d8b0ff')
    a.sym(LANCE, LANCEP)
    flash(a, 14, 2, big=True)
    return a, 0
ICONS = {'earthsplit': ('대지 가르기', 'dmg', earthsplit), 'warcry': ('전쟁의 함성', 'buff', w8.warcry_flag), 'guardian': ('수호자', 'none', w6.guardian),
         'titanblow': ('거인의 일격', 'dmg', w7.titanblow), 'kn_charge': ('기사단 돌격', 'dmg', kn_charge), 'kn_wall': ('왕국 방패술', 'buff', kn_wall),
         'ar_roar': ('검투사의 함성', 'buff', ar_roar), 'resolve': ('결의', 'buff', w6.resolve), 'awk_warrior': ('용사의 일격', 'dmg', awk_warrior),
         'awk2_warrior': ('천지개벽', 'dmg', awk2_warrior)}
