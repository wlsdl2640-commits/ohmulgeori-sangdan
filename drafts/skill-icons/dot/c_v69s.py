"""빌드 69 — 해룡기수(용기수 다음 4차) 스킬 그림 시안 (11-14 15:54 사용자 「해룡기수 — 그렇게 넣자」: 제안의 「기수 그림 · 스킬 그림은 시안부터」).
스킬마다 그림 A · B. 게임에는 고른 뒤에 넣는다(지금 게임은 예전 글리프). 반짝이는 비스듬한 점만(십자 · 더하기 꼴 없음) · 해룡 눈동자는 세로 틈만(가로 줄을 더하면 더하기 꼴) · 화살 깃은 물빛(WARR).
  tidalshot    물살 화살      A 물살 꼬리를 끌며 나란히 오르는 화살 셋 · B 물줄기를 타고 나란히 나는 화살 셋(꿰뚫기)
  bubbleprison 거품 감옥      A 큰 거품 속에 갇혀 잠든 적 · B 화살이 꽂힌 거품 송이
  deepblood    깊은 바다의 피  A 깊은 바다빛 핏방울 · B 물결 위 푸른 심장
  tsunami      해일          A 덮쳐 오는 큰 파도 · B 겹친 파도 둘 + 물보라
  abyssroar    심해의 포효    A 입을 벌린 해룡 머리 + 포효 물결 · B 어둠 속 해룡의 눈 + 포효 고리
  searoyal     해룡왕의 화살  A 물기둥을 타고 내리꽂는 큰 화살 · B 왕관 아래 큰 화살
python3 v69ssheet.py → v69_seadragoon.png"""
import math
import cell
from cell import Art, mix, W, H
from lib import *
from spr import *
from arrows import ar
from w5 import ring
from c_ride63 import raster, ell, rs
def A(theme, **k): return bg(Art(), theme, **k)
WARR = {'r': ('#7ccaf4', 12), 'R': ('#2468b4', 12), 'f': ('#ffffff', 7)}   # 물빛 깃 화살
def war(a, d, tx, ty, L=4, small=False): ar(a, d, tx, ty, L, pal=WARR, small=small)
def sparks(a, pts, c1='#ffffff', c2='#cdeeff'):
    for (x, y) in pts:
        a.set(x, y, c1)
        for dx, dy in ((1, 1), (-1, -1), (1, -1), (-1, 1)): a.set(x + dx, y + dy, c2)
def drops(a, pts, c1='#e8f8ff', c2='#5ab0ec'):
    for (x, y) in pts: a.set(x, y, c1); a.set(x, y + 1, c2)
def bubble(a, cx, cy, r, edge='#d8f4ff', hi='#ffffff', w=0.45):
    ring(a, cx, cy, r, [(0, 360)], edge, w=w)
    ring(a, cx, cy, max(0.6, r - 0.9), [(200, 250)], hi, w=0.4)
# 물 (밝음 → 짙음)
WAT = {'w': ('#ffffff', 12), 'c': ('#bfe8ff', 12), 'b': ('#5ab0ec', 12), 'B': ('#2468b4', 12), 'D': ('#123a78', 12)}

# ───────── 1 물살 화살 ─────────
CURL = (['......wwww......',
         '....wwccccww....',
         '...wcccbbbccw...',
         '..wccbBBBBbcw...',
         '..wcbBB..BBbcw..',
         '.wcbB.....wBbc..',
         '.wcB.......Bbc..',
         'wcbB.......Bbcw.',
         'wcbBB.....BBbcw.',
         'cbbBBBBBBBBBbbcw',
         'bbBBBBBBBBBBBbbc',
         'BBDDDDDDDDDDDBBb'], WAT)
def tidal_a():   # 물살 꼬리를 끌며 나란히 오르는 화살 셋
    a = A('water', cx=12, cy=4, r=14, rays=10, k=0.3, hole=3)
    for (tx, ty) in [(15, 1), (15, 8), (8, 1)]:
        tail(a, tx - 8.5, ty + 8.5, tx - 2.0, ty + 2.0, 1.6, 0.6, ['#ffffff', '#bfe8ff', '#5ab0ec'])
        war(a, 'ur', tx, ty, 4, small=True)
    drops(a, [(2, 16), (11, 17), (1, 3)])
    return a, 0
STREAM = (['ww..............',
           'cww.....www.....',
           'bcwwwwwwccwww...',
           'Bbcccccccccccww.',
           'BBbbbbbbbbbbbccw',
           'BBBBBBBBBBBBbbcw',
           'DBBBBBBBBBBBBbc.',
           '.DDDDDDDDDDDBb..'], WAT)
def tidal_b():   # 물줄기를 타고 나란히 나는 화살 셋 (앞의 적과 그 뒤 적을 꿰뚫는다)
    a = A('teal', cx=12, cy=9, r=13, rays=10, k=0.3, hole=3)
    sp(a, STREAM, 0, 8)
    war(a, 'r', 15, 5, 8, small=True); war(a, 'r', 13, 9, 8, small=True); war(a, 'r', 15, 13, 8, small=True)
    sparks(a, [(3, 3), (9, 17)])
    return a, 0

# ───────── 2 거품 감옥 ─────────
FOE = (['..kk..kk..',
        '.kKKkkKKk.',
        'kKKKKKKKKk',
        'kKwKKKKwKk',
        'kKKKKKKKKk',
        '.kKKKKKKk.',
        '..kkkkkk..'], {'k': ('#1a1430', 1), 'K': ('#4a3a6a', 10), 'w': ('#e8e0ff', 1)})
def bubble_a():   # 큰 거품 속에 잠든 적 (Z)
    a = A('water', cy=10, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    disc(a, 7.8, 10.6, 6.0, '#3a88cc')
    sp(a, FOE, 3, 9)
    for (x, y) in [(10, 5), (11, 5), (12, 5), (11, 6), (10, 7), (11, 7), (12, 7)]: a.set(x, y, '#ffffff')   # Z
    bubble(a, 7.8, 10.6, 6.4, edge='#e0f6ff', hi='#ffffff', w=0.5)
    bubble(a, 14.0, 3.0, 1.4); bubble(a, 2.0, 2.6, 1.0); bubble(a, 13.6, 17.4, 1.1)
    return a, 0
def bubble_b():   # 화살이 꽂힌 거품 송이
    a = A('ice', cy=11, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for (cx, cy, r) in [(9.0, 11.5, 4.8), (4.0, 14.5, 2.6), (12.8, 5.0, 2.2), (3.5, 6.0, 1.6), (13.5, 16.5, 1.4)]:
        disc(a, cx, cy, r - 0.5, '#2e7cc4'); bubble(a, cx, cy, r)
    war(a, 'dr', 10, 12, 8)
    return a, 0

# ───────── 3 깊은 바다의 피 ─────────
DROP_V = [('B', [(8.0, 1.0), (12.6, 9.0), (13.2, 12.2), (11.6, 16.0), (8.0, 17.6), (4.4, 16.0), (2.8, 12.2), (3.4, 9.0)]),
          ('b', [(8.0, 3.4), (11.0, 9.2), (11.4, 12.0), (10.2, 14.8), (8.0, 15.8), (5.8, 14.8), (4.6, 12.0), (5.0, 9.2)]),
          ('c', [(5.2, 10.0), (6.4, 7.6), (6.8, 8.2), (5.8, 11.6)]),
          ('w', [(5.4, 12.4), (6.0, 12.2), (6.2, 13.4), (5.6, 13.6)])]
def deep_a():   # 깊은 바다빛 핏방울 (속에 빛)
    a = A('night', cy=11, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    glow(a, 8.0, 11.5, 7.5, ['#1c2a6a', '#24408a'])
    sp(a, grid(raster(DROP_V, dy=0.6)), {'B': ('#1a4aa0', 12), 'b': ('#3a8ae0', 12), 'c': ('#bfe8ff', 12), 'w': ('#ffffff', 12)})
    sparks(a, [(2, 3), (13, 4), (14, 15)])
    return a, 0
HEARTB = (['.11..11.', '11111111', '1w111112', '11111112', '.111122.', '..1122..', '...22...'], {'1': ('#3a8ae0', 12), '2': ('#1a4aa0', 12), 'w': ('#e8f8ff', 12)})
def deep_b():   # 물결 위 푸른 심장 (치명 · 공격 속도 · 물)
    a = A('water', rays=12, k=0.3, cy=8, hole=4)
    sp(a, HEARTB, 4, 3)
    for y, (x0, x1) in ((13, (0, 15)), (15, (0, 15)), (17, (1, 14))):
        for x in range(x0, x1 + 1): a.set(x, y + (1 if (x // 3) % 2 else 0), '#e0f6ff' if y == 13 else '#8acaf4')
    sparks(a, [(2, 2), (13, 1)])
    return a, 0

# ───────── 4 해일 ─────────
WAVE = (['........wwwww...',
         '......wwcccccww.',
         '....wwcccbbbccw.',
         '...wccbbbBBbbcw.',
         '..wcbbBBB..Bbcw.',
         '.wcbBBB.....wBc.',
         '.cbBB........w..',
         'wcbB............',
         'cbBB............',
         'bBBB............',
         'BBBBB...........',
         'BBBBBB..........',
         'DBBBBBB.........',
         'DDBBBBBBB.......',
         'DDDBBBBBBBBB....',
         'DDDDDBBBBBBBBBBB'], WAT)
def tsu_a():   # 덮쳐 오는 큰 파도
    a = A('storm', cx=12, cy=15, r=15, rays=10, k=0.3, hole=4)
    sp(a, WAVE, 0, 3)
    drops(a, [(13, 2), (15, 4), (11, 1)]); sparks(a, [(14, 9)], '#ffffff', '#bfe8ff')
    return a, 0
WAVE2 = (['....wwww....', '..wwccccww..', '.wccbbbbccw.', 'wcbbBBBBbbcw', 'cbBBB..BBBbc', 'bBB......BBb'], WAT)
def tsu_b():   # 겹친 파도 둘 + 물보라 (모든 적을 두 번 · 냉기)
    a = A('ice', cy=6, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, WAVE2, 4, 5); sp(a, WAVE2, 0, 10)
    for x in range(16): a.set(x, 16, '#2468b4'); a.set(x, 17, '#123a78'); a.set(x, 18, '#0c2a5a')
    for x in range(0, 16, 3): a.set(x, 15, '#bfe8ff')
    drops(a, [(14, 2), (2, 5), (12, 9)])
    return a, 0

# ───────── 5 심해의 포효 ─────────
HEAD = (['.hh..h......',
         '..hhh.......',
         '.NNNNNN.....',
         'NNNNNNNNN...',
         'NNNNkyNNNNN.',
         'NNNNNNNNNNNN',
         'NNDDDDDwwwww',
         'NNNmm.......',
         'NNmmm.......',
         'NNNDDwwwww..',
         '.NNNNNNNNNN.',
         '..ddNNNN....',
         '...dd.......'], {'N': ('#e8724a', 8), 'D': ('#a8442a', 8), 'd': ('#f0e0c8', 8), 'h': ('#f6e6c8', 7), 'k': ('#1a0c04', 1), 'y': ('#ffd040', 1), 'w': ('#ffffff', 7), 'm': ('#5a1a1a', 1)})
def roar_a():   # 입을 벌린 해룡 머리 + 포효 물결
    a = A('water', cx=4, cy=9, r=14, rays=12, k=0.3, hole=3)
    sp(a, HEAD, 0, 4)
    ring(a, 9.0, 10.5, 4.0, [(-40, 40)], '#e0f6ff', w=0.5); ring(a, 9.0, 10.5, 6.0, [(-45, 45)], '#bfe8ff', w=0.5); ring(a, 9.0, 10.5, 8.0, [(-48, 48)], '#8acaf4', w=0.5)
    return a, 0
EYEC = (['...yyyyy...', '.yyYYkYYyy.', 'yYYYkkYYYYy', 'yYYYkkYYYYy', 'yYYYkkYYYYy', '.yyYYkYYyy.', '...yyyyy...'], {'y': ('#8af0ff', 12), 'Y': ('#2ab0d0', 12), 'k': ('#04101a', 1)})
def roar_b():   # 어둠 속 해룡의 눈 + 포효 고리 (공포)
    a = A('night', cy=9, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    for r_, c in ((7.6, '#3a5aa8'), (5.8, '#5a8ad8'), (4.2, '#8acaf4')): ring(a, 7.5, 9.5, r_, [(0, 360)], c, w=0.45)
    sp(a, EYEC, 2, 6)
    sparks(a, [(1, 1), (14, 18)], '#cdeeff', '#5a8ad8')
    return a, 0

# ───────── 6 해룡왕의 화살 ─────────
def royal_a():   # 물기둥을 타고 내리꽂는 큰 화살
    a = A('water', cy=17, r=16, rays=10, k=0.3, hole=3)
    tail(a, 7.5, -1.0, 7.5, 13.0, 1.4, 3.4, ['#ffffff', '#bfe8ff', '#5ab0ec'])
    war(a, 'd', 7, 16, 9)
    for (x, y) in [(2, 17), (13, 17), (4, 15), (11, 15)]: a.set(x, y, '#e0f6ff'); a.set(x, y + 1, '#5ab0ec')
    for x in range(1, 15): a.set(x, 19, '#2468b4')
    return a, 0
CROWN = (['y.y.y.y', 'yyyyyyy', 'yRyByRy', 'YYYYYYY'], {'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6), 'R': ('#e8724a', 13), 'B': ('#5ab0ec', 12)})
def royal_b():   # 왕관 아래 큰 화살 (가장 센 적에게)
    a = A('gold', rays=12, k=0.3, cy=11, hole=4)
    sp(a, CROWN, 1, 1)
    tail(a, 2.0, 6.0, 12.0, 16.0, 0.4, 1.6, ['#ffffff', '#bfe8ff', '#5ab0ec'])
    war(a, 'dr', 15, 19, 9)
    return a, 0

ICONS = {
  'tidalshot_a': ('물살 화살 A', 'dmg', tidal_a), 'tidalshot_b': ('물살 화살 B', 'dmg', tidal_b),
  'bubbleprison_a': ('거품 감옥 A', 'dmg', bubble_a), 'bubbleprison_b': ('거품 감옥 B', 'dmg', bubble_b),
  'deepblood_a': ('깊은 바다의 피 A', 'none', deep_a), 'deepblood_b': ('깊은 바다의 피 B', 'none', deep_b),
  'tsunami_a': ('해일 A', 'dmg', tsu_a), 'tsunami_b': ('해일 B', 'dmg', tsu_b),
  'abyssroar_a': ('심해의 포효 A', 'dmg', roar_a), 'abyssroar_b': ('심해의 포효 B', 'dmg', roar_b),
  'searoyal_a': ('해룡왕의 화살 A', 'dmg', royal_a), 'searoyal_b': ('해룡왕의 화살 B', 'dmg', royal_b),
}
