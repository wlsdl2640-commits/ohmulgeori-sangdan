"""2단계 고치기 A: 광폭화 · 기사단 돌격 · 마법사 5 · 성직자 6 · 도적 4"""
import math
import cell
from cell import Art, mix
from lib import *
from spr import *
from arrows import ar, arrow, arrow_s, recol, AP, GOLD_ALL, GOLDP
import w5
def A(theme, **k): return bg(Art(), theme, **k)
def sym2(left, swap=None):
    """왼쪽 반(8칸)을 그리고 오른쪽은 뒤집어 붙이기. swap: 오른쪽에서 바꿀 글자 (밝음→어둠)"""
    sw = swap or {}
    return [l.ljust(8, '.') + ''.join(sw.get(c, c) for c in reversed(l.ljust(8, '.'))) for l in left]
# 광폭화: 불타는 머리칼, 성난 눈, 벌린 입, 두 주먹을 치켜든 근육질 몸 + 불길
BERS = sym2(['......y.',
             '.....yoy',
             '.HH..ooo',
             'HHoH.Hoo',
             'HooO.Hwo',
             '.HoO.Hoo',
             '.Ho..oRw',
             '.Ho...oo',
             '.HoO..Ho',
             '..HooHHo',
             '...HoHoo',
             '....HoOO',
             '.....Hoo',
             '......Ho',
             '.....Hoo',
             '....Hoo.',
             '....Ho..',
             '...HHo..'], {'H': 'O'})
BERSP = {'H': ('#ffe070', 14), 'o': ('#ff9a2a', 14), 'O': ('#c8481a', 14), 'y': ('#fff0a0', 1), 'w': ('#ffffff', 1), 'R': ('#5a0a04', 1)}
def berserk():
    a = A('blood', cy=10, r=11.5, cuts=[0.0, 0.18, 0.38, 0.6, 0.82], rays=12, rot=0.1, k=0.5, hole=3.0)
    for y in range(20):
        for x in range(16):
            u = x + 0.5 - 7.5
            if y > 8 + 3 * abs(math.sin(x * 1.25)) + abs(u) * 0.2 and abs(u) > 3: a.set(x, y, '#ff6a1a' if y > 13 else '#c0300e')
    sp(a, BERS, 0, 1, BERSP)
    return a, 0
# 기사단 돌격: 가늘고 긴 창 + 큰 손 보호판 + 왕국 창 깃발 + 속도 줄 + 창끝 번쩍
def kn_charge():
    a = A('royal', cx=13, cy=3, r=16, rays=12, k=0.3)
    speed(a, [(0, 9, 3, 6), (1, 14, 4, 11), (6, 17, 9, 14)], '#c0c8ff')
    cm = spike((14.6, 2.4), (4.0, 14.0), 1.5, 'm', 'M', 'w')
    for (x, y) in list(ellipse(4.2, 14.3, 2.6, 2.6, 'y')):
        if abs((x + 0.5 - 4.2) - (y + 0.5 - 14.3)) < 1.6: cm[(x, y)] = 'y' if (x + y) < 18 else 'Y'
    for (x, y, c) in [(9, 3, 'b'), (10, 3, 'b'), (11, 3, 'b'), (8, 4, 'b'), (9, 4, 'w2'), (10, 4, 'w2'), (11, 4, 'B'), (7, 5, 'b'), (8, 5, 'B'), (10, 5, 'B'), (6, 6, 'b'), (9, 6, 'B')]:
        cm[(x, y)] = 'q' if c == 'w2' else c
    sp(a, grid(cm), {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'b': ('#4a8aff', 12), 'B': ('#2a4aa0', 12), 'q': ('#ffffff', 12)})
    burst(a, 14, 2, big=False)
    return a, 0
# 화염구: 하얀 속 · 노란 · 주황 · 붉은 불꽃 혀 + 흩날리는 불티 + 불꼬리
def fireball():
    a = A('fire', cx=10, cy=7, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    for (y0, ph, n) in [(4, 0.0, 9), (7, 1.2, 10), (10, 2.4, 9)]:
        for x in range(0, n):
            yy = y0 + round(math.sin(x * 0.8 + ph) * 0.9) + (x // 3)
            a.set(x, yy, ['#7a1a0a', '#a02a0a', '#d8420e', '#ff8a2a', '#ffb040', '#ffd060'][min(5, x * 6 // n)])
    tail(a, 9.5, 8.0, 1.5, 12.5, 3.4, 0.8, ['#fff0a0', '#ffc040', '#ff8a2a', '#e04a10'])
    for y in range(20):
        for x in range(16):
            dx, dy = x + 0.5 - 10.5, y + 0.5 - 7.5; d = math.hypot(dx, dy); th = math.atan2(dy, dx)
            e = 4.0 + 0.8 * math.cos(th * 7 + 0.5)
            if d < e: a.set(x, y, '#ffffff' if d < 1.3 else '#fff0a0' if d < 2.2 else '#ffb040' if d < 3.2 else '#ff6a1a' if d < e - 0.5 else '#c8300e')
    dot(a, [(3, 14), (6, 16), (1, 10), (14, 13), (13, 2)], '#ffd060')
    return a, 0
# 연쇄 번개: 세 적(작은 그림자)을 차례로 꿰는 굵은 번개 + 맞은 자리 번쩍
def chain():
    a = A('thunder', cuts=[0.0, 0.3, 0.52, 0.74, 0.92])
    thick_bolt(a, [(0, 0), (1, 2), (3, 4)])
    thick_bolt(a, [(3, 4), (6, 6), (8, 4), (10, 7), (12, 8)])
    thick_bolt(a, [(12, 8), (10, 10), (11, 12), (7, 13), (4, 15)])
    for (x, y) in [(3, 4), (12, 8), (4, 15)]: burst(a, x, y, big=False, cols=('#ffffff', '#fff060', '#ffb040'))
    return a, 0
GRIMOIRE = (['.pp........pp.',
             'pwwwwwwwwwwwwP',
             'pwffffwwffffwP',
             'pwwwwwwwwwwwwP',
             'pwffffwwffffwP',
             'pwwwwwwwwwwwwP',
             'PPPPPPkkPPPPPP',
             '.PPPPPPPPPPPP.'], {'p': ('#8a4ad0', 10), 'P': ('#4a2480', 10), 'w': ('#f4ecd8', 7), 'f': ('#a89878', 7), 'k': ('#2a1440', 1)})
def arcane():
    a = A('arcane', cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(0, 12):
        for x in range(16):
            if abs(x + 0.5 - 7.5) < 1.0 + (11 - y) * 0.28 and (x + y) % 2: a.set(x, y, mix(a.get(x, y), '#d8c8ff', 0.45))
    ring(a, 7.5, 5.0, 3.4, [(0, 360)], '#ffffff', w=0.5)
    paint_cm(a, poly_cells(star_poly(7.5, 5.0, 2.6, 1.1, 5), '1'), {'1': '#e0d0ff'})
    sp(a, GRIMOIRE, 1, 11)
    for (x, y) in [(2, 8), (13, 7), (12, 2), (3, 2), (10, 9)]: plus(a, x, y, '#ffffff', '#c0b0ff')
    return a, 0
def iceprison():
    a = A('ice', cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    pts = [(7.5, 1.0), (13.0, 4.5), (13.0, 14.0), (7.5, 17.5), (2.0, 14.0), (2.0, 4.5)]
    cm = poly_cells(pts, 'a')
    for (x, y) in list(cm):
        if x + 0.5 < 7.5 and y < 9: cm[(x, y)] = 'c'
        elif x + 0.5 > 7.5 and y > 9: cm[(x, y)] = 'A'
    for (x, y) in [(4, 3), (3, 4), (5, 2), (3, 6)]: cm[(x, y)] = 'w'
    sp(a, grid(cm), {'c': ('#e0f8ff', 12), 'a': ('#a0dcf4', 12), 'A': ('#5aa0d0', 12), 'w': ('#ffffff', 1)})
    a.paint(['..kk..', '.kkkk.', 'krkkrk', 'kkkkkk', '.kkkk.', 'k.kk.k', 'k....k'], {'k': '#2a3a6a', 'r': '#ff4a3a'}, ox=5, oy=7)
    for (x, y) in [(1, 16), (3, 17), (12, 17), (14, 16)]: a.set(x, y, '#e0f8ff'); a.set(x, y - 1, '#a0dcf4')
    return a, 0
# 별의 종언: 커다란 별이 긴 빛꼬리를 끌며 행성에 떨어지는 순간
def awk2_mage():
    a = A('night', cx=6, cy=14, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    dot(a, [(2, 2), (5, 1), (11, 13), (1, 7), (14, 9), (9, 3)], '#ffffff')
    for y in range(20):
        for x in range(16):
            d = math.hypot(x + 0.5 - 7.5, y + 0.5 - 30.0)
            if d < 13.5: a.set(x, y, '#5a3a9a' if d > 12.8 else '#2a1a5a' if d > 11.0 else '#1a1040')
    tail(a, 7.5, 11.0, 15.5, 1.0, 3.6, 0.8, ['#ffffff', '#fff0a0', '#ffc860', '#ff8a4a', '#a04aa0'])
    sp(a, grid(poly_cells(star_poly(6.8, 11.2, 4.6, 2.1, 5, -100), 'y')), {'y': ('#fff4a0', 6)})
    burst(a, 6, 16, big=False, cols=('#ffffff', '#fff0a0', '#ff9a4a'))
    return a, 0
# 성역: 기둥 신전 + 빛 결계 돔 + 위에서 내리는 빛
TEMPLE = (['......y......',
           '....yyyyy....',
           '..yyyyyyyyY..',
           'eeeeeeeeeeeeE',
           '.e.e.e.e.e.E.',
           '.e.e.e.e.e.E.',
           '.e.e.e.e.e.E.',
           '.e.e.e.e.e.E.',
           'eeeeeeeeeeeEE',
           'EEEEEEEEEEEEE'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'e': ('#f4ecd8', 7), 'E': ('#b8a888', 7)})
def sanctuary():
    a = A('teal', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for y in range(0, 9):
        for x in range(16):
            if abs(x + 0.5 - 7.5) < 1.5 + y * 0.3 and (x + y) % 2 == 0: a.set(x, y, mix(a.get(x, y), '#fff4c0', 0.45))
    for (x, y) in ring_cells(7.5, 15.0, 7.4, 9.0, w=0.6):
        if y <= 15: a.set(x, y, '#bff8f0')
    sp(a, TEMPLE, 1, 7)
    for (x, y) in [(2, 4), (13, 5)]: plus(a, x, y)
    return a, 0
# 대치유: 크게 빛나는 하트 + 흰 십자 + 위로 떠오르는 작은 하트
def greatheal():
    a = A('rose', cuts=[0.0, 0.2, 0.4, 0.62, 0.84], rays=12, k=0.3)
    glow(a, 7.5, 10.0, 6.8, ['#ba3c62', '#e86488', '#ffb0c8'])
    big = (['.111...111.', '11111.11112', '1h111111112', '11111111122', '11111111122', '.111111122.', '..1111122..', '...11122...', '....122....', '.....2.....'], {'1': ('#ff3a5a', 13), '2': ('#a8182c', 13), 'h': ('#ffd0d8', 1)})
    sp(a, big, 2, 5)
    for (x, y) in [(2, 3), (13, 4), (13, 16), (2, 15), (12, 1)]: plus(a, x, y)
    sp(a, grid(cross_cm(13.0, 9.5, 1.6, 1.0)), {'1': ('#ffffff', 7), '2': ('#e0e0f0', 7)})
    return a, 0
def cure():
    a = A('teal', cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    paint_cm(a, cloud([(12, 5, 2.4), (14, 7, 1.8)]), {'1': '#9a6ad0', '2': '#6a4aa0'})
    a.paint(['kk', '..'], {'k': '#3a2a5a'}, ox=11, oy=4)
    for (x, y) in [(10, 8), (13, 10), (9, 3), (15, 4)]: a.set(x, y, '#c090ff')
    sp(a, POTION, 2, 8, {'1': ('#7af0a0', 8), '2': ('#2a9a5a', 8)})
    for (x, y) in [(4, 5), (6, 3), (5, 1)]: sp(a, ['.w.', 'w.w', '.w.'], x - 1, y - 1, {'w': ('#e0fff4', 1)}, fx=False)
    plus(a, 9, 14, '#ffffff', '#c8fff0')
    return a, 0
# 신의 기적: 크게 펼친 흰 날개 + 금빛 후광 + 가운데 빛기둥
WING_BIG = (['.......w',
             '.....wwf',
             '...wwwff',
             '..wwwfff',
             '.wwwffff',
             'wwwffff.',
             'wwfff...',
             '.wff....',
             '..f.....'], {'w': ('#ffffff', 7), 'f': ('#c8d4f0', 7)})
def awk_cleric():
    a = A('holy', rays=14, rot=0.1, k=0.25)
    for y in range(20):
        for x in range(16):
            if abs(x + 0.5 - 7.5) < 1.6: a.set(x, y, '#fff8e0' if abs(x + 0.5 - 7.5) < 0.8 else '#ffe890')
    sp(a, WING_BIG, -1, 6); sp(a, (flip(WING_BIG[0]), WING_BIG[1]), 9, 6)
    for (x, y) in ring_cells(7.5, 3.5, 3.6, 1.2): a.set(x, y, '#ffd84a')
    for (x, y) in ring_cells(7.5, 3.5, 2.6, 0.7, w=0.4): a.set(x, y, '#fff6c8')
    burst(a, 7, 11, big=False)
    return a, 0
# 천상의 기적: 구름 위 금빛 하늘 문이 열리며 쏟아지는 빛 + 양옆 날개
def awk2_cleric():
    a = A('dawn', cy=8, r=13)
    cm = {}
    for y in range(2, 16):
        for x in range(3, 13):
            dx = x + 0.5 - 7.5; top = 2 + 5 - math.sqrt(max(0, 25 - dx * dx))
            if y >= top:
                edge = x in (3, 4, 11, 12) or y < top + 1.2
                cm[(x, y)] = ('y' if x < 8 else 'Y') if edge else 'q'
    sp(a, grid(cm), {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'q': ('#fff4c0', 1)})
    for y in range(4, 16):
        for x in range(5, 11):
            if cm.get((x, y)) == 'q': a.set(x, y, '#ffffff' if abs(x + 0.5 - 7.5) < 1.3 else '#fff0a0')
    paint_cm(a, cloud([(2, 17, 2.4), (6, 17.5, 2.6), (10, 17.5, 2.6), (14, 17, 2.4)]), {'1': '#ffffff', '2': '#d8d0f0'})
    sp(a, (WING_BIG[0][2:], WING_BIG[1]), -2, 8); sp(a, (flip(WING_BIG[0])[2:], WING_BIG[1]), 10, 8)
    return a, 0
# 성스러운 철퇴: 날 달린 금빛 철퇴 머리(십자 새김) + 내리치는 빛
MACE = (['...yyyy...',
         '.yyYyyYyy.',
         'yyhyyyyyYY',
         'yYyyrryyYY',
         'yyyrrrryYY',
         'yYyyrryyYY',
         '.yyYyyYYY.',
         '...YYYY...',
         '....tT....',
         '....tT....',
         '....tT....',
         '....lL....',
         '....lL....',
         '....yY....'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'h': ('#fff6c8', 1), 'r': ('#ffffff', 1), 't': ('#c08a4a', 3), 'T': ('#7a4c22', 3)})
def holyhammer():
    a = A('holy', cy=6, rays=12, k=0.3)
    glow(a, 7.5, 5.5, 5.4, ['#ffe890', '#fff4c0', '#ffffff'])
    sp(a, MACE, 3, 1)
    burst(a, 13, 13, big=False); plus(a, 2, 13)
    return a, 0
# 잰걸음: 잔상 두 개를 남기며 내딛는 장화 + 먼지
def quickstep():
    a = A('teal', cx=10, cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for ox, c in [(0, '#3a8a8a'), (3, '#5ab0b0')]:
        for y, r in enumerate(BOOT[0]):
            for x, ch in enumerate(r):
                if ch != '.': a.set(x + ox, y + 7, c)
    sp(a, BOOT, 7, 7)
    sp(a, (['..w', '.wf', 'wff', '.ff'], WING_L[1]), 4, 4)
    paint_cm(a, cloud([(5, 16, 1.4), (3, 16.5, 1.0)]), {'1': '#e0f4f0', '2': '#a8d8d0'})
    return a, 0
# 마비 침: 술 달린 침이 꽂힌 자리에서 퍼지는 노란 마비 물결
def parasting():
    a = A('purple', cx=11, cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for r in (2.4, 4.0, 5.6):
        for k in range(24):
            ang = k * 15
            if k % 2 == 0: a.set(int(11.5 + math.cos(math.radians(ang)) * r), int(5.5 + math.sin(math.radians(ang)) * r), '#fff060' if r < 5 else '#c8b040')
    cm = {}
    for i in range(9): cm[(3 + i, 14 - i)] = 'm' if i < 7 else 'w'
    for (x, y) in [(1, 15), (2, 16), (1, 16), (2, 15), (0, 17), (3, 16)]: cm[(x, y)] = 'r'
    sp(a, grid(cm), {'r': ('#ff4a6a', 13)})
    burst(a, 11, 5, big=False, cols=('#ffffff', '#fff060', '#c8b040'))
    return a, 0
# 무영참: 어둠 속 그림자를 비스듬히 가른 한 줄 빛 (위쪽이 미끄러짐)
def awk2_rogue():
    a = A('shadow', cuts=[0.0, 0.3, 0.55, 0.8, 0.95])
    FIG = ['...kk...', '..kkkk..', '..kkkk..', '...kk...', '.kkkkkk.', 'kkkkkkkk', 'k.kkkk.k', '..kkkk..', '..k..k..', '.kk..kk.']
    for y, r in enumerate(FIG):
        for x, ch in enumerate(r):
            if ch == '.': continue
            X, Y = x + 4, y + 6
            if X + Y < 16: a.set(X - 1, Y - 1, '#0a0a14')
            else: a.set(X, Y, '#0a0a14')
    for x in range(16):
        y = 15 - x
        a.set(x, y, '#ffffff'); a.set(x, y + 1, '#a8a8e0') if 3 < x < 13 else None
    burst(a, 8, 7, big=False, cols=('#ffffff', '#e0e0ff', '#8a8ac0'))
    return a, 0
# 뇌전 찌르기: 푸른 번개를 두른 큰 단검 + 찌른 끝 번쩍
def voltstab():
    a = A('thunder', cx=11, cy=5, cuts=[0.0, 0.25, 0.45, 0.65, 0.85])
    import w5
    paint_cm(a, bolt([(2, 4), (4, 7), (2, 9), (5, 11)]), {'w': '#ffffff', 'y': '#80d0ff'})
    paint_cm(a, bolt([(9, 14), (11, 12), (12, 15), (15, 13)]), {'w': '#ffffff', 'y': '#80d0ff'})
    sp(a, w5.SWORD_UR, 0, 0, dict(w5.HILT, **{'w': ('#e0f4ff', 5), 'm': ('#a0d0ff', 5), 'M': ('#4a7ac0', 5)}))
    burst(a, 13, 4, big=False, cols=('#ffffff', '#c0e8ff', '#4a9aff'))
    return a, 0
def thick_bolt(a, pts):
    cm = bolt(pts)
    for (x, y), c in list(cm.items()):
        for dx, dy in ((0, 1), (0, -1)):
            if (x + dx, y + dy) not in cm: a.set(x + dx, y + dy, '#8a60e0')
    paint_cm(a, cm, {'w': '#ffffff', 'y': '#fff060'})
ICONS = {'berserk': ('광폭화', 'buff', berserk), 'kn_charge': ('기사단 돌격', 'dmg', kn_charge), 'fireball': ('화염구', 'mdmg', fireball),
         'chain': ('연쇄 번개', 'mdmg', chain), 'arcane': ('비전 숙련', 'none', arcane), 'iceprison': ('얼음 감옥', 'mdmg', iceprison),
         'awk2_mage': ('별의 종언', 'mdmg', awk2_mage), 'sanctuary': ('성역', 'buff', sanctuary), 'greatheal': ('대치유', 'heal', greatheal),
         'cure': ('해독', 'buff', cure), 'awk_cleric': ('신의 기적', 'heal', awk_cleric), 'awk2_cleric': ('천상의 기적', 'heal', awk2_cleric),
         'holyhammer': ('성스러운 철퇴', 'mdmg', holyhammer), 'quickstep': ('잰걸음', 'none', quickstep), 'parasting': ('마비 침', 'dmg', parasting),
         'awk2_rogue': ('무영참', 'dmg', awk2_rogue), 'voltstab': ('뇌전 찌르기', 'dmg', voltstab)}
