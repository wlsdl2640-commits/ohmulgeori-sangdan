"""별의 여왕 아스테리아 (starqueen · 별의 왕좌 주인 · 천상 · 빛 · 마법 · 광역 · 냉기 · 빙결) 시안 — 큰 사람꼴 ms 1.5 · 떠 있음 · 별 홀
A 밤하늘 드레스 여왕: 별이 박힌 짙은 남보랏빛 긴 드레스 · 별 반짝이는 긴 남빛 머리 · 보석 하나 박힌 뾰족한 금관 · 금 다섯 꼭지 별 홀
B 별빛 망토 여왕: 옅은 금빛 드레스 · 뒤로 크게 펼친 별밭 망토(속이 밤하늘) · 얼음빛 수정 관 · 금 별 홀
C 성운 머리칼 여왕: 뒤로 흐르는 분홍 · 보라 · 하늘빛 성운 머리칼(별이 박힘) · 짙은 청록 드레스와 은테 · 작은 금 관 · 금 별 홀
피한 것: 흰 드레스 · 베일(신 · 신부) · 머리 뒤 고리(후광) · 별 고리 관(성상) · 이마의 초승달 · 십자"""
from kit import *
from cloud import puffs

ACT = {'mag': ['spush', 'sjab'], 'atk': ['spush'], 'skl': ['scharge'], 'tk': 1.1,
       'fx': {'mag': {'pal': 'star', 'hit': 'shatter', 'p': 'shard', 'big': 1}, 'atk': {'pal': 'star', 'hit': 'shatter', 'p': 'shard'},
              'skl': {'pal': 'ice', 'hit': 'vortex', 'big': 2, 'after': 'motes', 'shake': 2}}}
B = Batch('queen1', 'starqueen', ACT, 'stargarden', 'dungeon', show=[['spush', 4], ['scharge', 6]], ms=1.5, mx=20, my=20, float=1)
B.extra = head_js('sscep', """
....Y....
....Y....
...YYY...
YYYYLYYYY
.YYYLYYY.
..YYYYY..
..YYYYY..
.YYY.YYY.
.YY...YY.
....G....
...GGG...
""", '금 별 홀 (별의 여왕): 금 자루 끝 다섯 꼭지 노란 별(속 흰 빛)', L=7.0, shaft='G')


def star5(cx, cy, R, r, rot=-90):
    return poly([(cx + math.cos(math.radians(rot + k * 36)) * (R if k % 2 == 0 else r), cy + math.sin(math.radians(rot + k * 36)) * (R if k % 2 == 0 else r)) for k in range(10)])


def face(c, x, y):
    c.fill(ell(x, y, 3.4, 3.6), 'S'); c.only(ell(x - 1.0, y + 1.8, 2.6, 1.3), 's', 'S')
    c.fill(box(x + 0.6, y - 0.2, x + 1.4, y + 0.2), 'k'); c.fill(box(x + 2.6, y - 0.2, x + 3.0, y + 0.2), 'k'); c.set(x + 2.0, y + 2.0, 'r')


def gown(c, top, hem, x0, x1, ch):
    c.fill(poly([(x0 + 1.0, top), (x1 - 0.6, top), (x1 + 1.0, top + 7.0), (x1 + 6.0, hem), (x0 - 4.0, hem), (x0 - 11.0, hem + 0.4), (x0 - 6.0, hem - 5.0), (x0 - 0.4, top + 7.0)]), ch)   # 뒤로 끌리는 자락
    for (a, b) in (((x0 + 3.0, top + 10.0), (x0 - 1.0, hem - 0.6)), ((x0 + 6.0, top + 12.0), (x0 + 5.0, hem - 0.6)), ((x1 - 1.0, top + 11.0), (x1 + 2.6, hem - 0.6))):
        c.only(thin(a, b), 'c', ch)                                                                                           # 옷 주름
    c.fill(ell(x0 + 1.6, top + 1.4, 2.8, 2.2), ch)                                                                            # 먼 어깨 부푼 소매


def crown(c, x0, x1, y, n=3, h=2.4, gem='E'):
    c.fill(rbox(x0, y, x1, y + 1.0, 0.2), 'G')
    w = (x1 - x0) / n
    for i in range(n): c.fill(poly([(x0 + i * w, y + 0.2), (x0 + i * w + w / 2, y - h), (x0 + (i + 1) * w, y + 0.2)]), 'G')
    c.set((x0 + x1) / 2, y + 0.4, gem)


def queen(mode, opt):
    c = Cv(52, 60); fl = 1.0 if mode == 'idle1' else 0.0
    if opt == 'A':
        c.fill(poly([(26.0, 10.0), (21.6, 12.0), (19.4, 20.0), (18.0, 30.0 + fl), (21.6, 28.0), (23.4, 18.0)]), 'H')            # 긴 남빛 머리 (뒤)
        gown(c, 14.0, 50.0, 22.0, 31.0, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        for (x, y) in ((24, 22), (28, 27), (22, 33), (30, 36), (19, 42), (26, 44), (33, 46), (23, 39), (29, 31)): c.set(x, y, 'L')   # 드레스의 별
        c.fill(box(22.6, 21.6, 30.8, 22.6), 'G')
        for (x, y) in ((20.6, 16.0), (19.6, 24.0)): c.set(x + fl * 0.2, y, 'L')                                                # 머리의 별 반짝이
    elif opt == 'B':
        cape = poly([(23.0, 13.0), (16.0, 18.0), (8.0, 34.0 + fl), (6.0, 50.0), (24.0, 50.0), (26.0, 16.0)])
        c.fill(cape, 'V'); c.only({q for q in cape if (q[0] - 1, q[1]) not in cape or (q[0], q[1] - 1) not in cape}, 'v', 'V')   # 뒤로 펼친 별밭 망토 (테)
        for (x, y) in ((12, 30), (16, 24), (10, 40), (15, 36), (19, 44), (13, 47), (20, 30), (17, 41)): c.set(x, y, 'L')
        gown(c, 14.0, 50.0, 22.0, 31.0, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.fill(box(22.6, 21.6, 30.8, 22.6), 'G')
        c.fill(poly([(26.0, 10.0), (23.0, 11.6), (22.4, 16.6), (24.6, 15.6)]), 'H')
    else:
        puffs(c, [(20.0, 12.0 + fl * 0.4, 3.6), (15.0, 16.0 + fl, 3.6), (11.0, 21.0 + fl, 3.2), (8.0, 26.0 + fl, 2.8), (17.0, 20.0, 2.8), (23.0, 9.0, 3.0)], 'R', 'r', light='o')   # 성운 머리칼
        c.only(ell(13.0, 19.0 + fl, 2.6, 2.0) | ell(9.0, 25.0 + fl, 1.8, 1.4), 'B', 'Rro')
        for (x, y) in ((18, 11), (12, 17), (9, 24), (15, 22), (21, 14)): c.set(x, y + fl, 'L')
        gown(c, 14.0, 50.0, 22.0, 31.0, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.fill(thins([(17.6, 49.4), (36.0, 49.4)]), 'x'); c.fill(box(22.6, 21.6, 30.8, 22.6), 'x')
    c.fill(rbox(24.0, 12.6, 31.0, 15.0, 1.0), 'C')                                                                            # 깃
    face(c, 28.6, 9.4)
    hair = poly([(24.6, 11.6), (24.6, 6.2), (27.2, 4.6), (31.4, 5.0), (32.4, 7.0), (28.6, 6.6), (26.8, 8.6), (26.6, 13.4)])
    c.fill(hair, 'H' if opt != 'C' else 'R')
    if opt == 'B':
        for i, (x, h) in enumerate(((25.6, 2.6), (27.4, 3.6), (29.2, 3.0), (30.8, 2.0))): c.fill(poly([(x - 0.8, 5.0), (x, 5.0 - h), (x + 0.8, 5.0)]), 'X')   # 얼음빛 수정 관
        c.fill(rbox(25.0, 4.6, 31.6, 5.6, 0.2), 'x')
    else:
        crown(c, 25.2, 31.4, 4.0, n=3, h=2.6 if opt == 'A' else 1.6)
    return c


PAL = {
    'A': {'C': '#2e2a6e', 'Q': '#4a44a0', 'c': '#1a1844', 'H': '#2a3a8a', 'h': '#1a2660', 'L': '#fff6c0', 'G': '#e8c050', 'g': '#a8842a', 'E': '#7ae8ff',
          'S': '#f0dccc', 's': '#c8a898', 'k': '#1a1430', 'r': '#d07a8a', 'Y': '#ffe070'},
    'B': {'C': '#e8d498', 'Q': '#fff0c8', 'c': '#b09a5a', 'V': '#1a1e52', 'v': '#3a4290', 'L': '#fff6c0', 'H': '#4a3a2a', 'G': '#e8c050', 'g': '#a8842a',
          'X': '#9ae8ff', 'x': '#e0fbff', 'S': '#f0dccc', 's': '#c8a898', 'k': '#1a1430', 'r': '#d07a8a', 'Y': '#ffe070'},
    'C': {'C': '#1e5a62', 'Q': '#2e7e88', 'c': '#123a40', 'R': '#d070c0', 'r': '#8a3a98', 'o': '#ffc8f0', 'B': '#6ab8ff', 'L': '#ffffff', 'x': '#d8e0e8',
          'G': '#e8c050', 'g': '#a8842a', 'E': '#ff8ad0', 'S': '#f0dccc', 's': '#c8a898', 'k': '#1a1430', 'r2': '', 'Y': '#ffe070'},
}
PAL['C'].pop('r2')
LAB = {'A': ('A 밤하늘 드레스 여왕', '별이 박힌 짙은 남보랏빛 긴 드레스와 금 허리띠 · 별이 반짝이는 긴 남빛 머리 · 하늘빛 보석 하나 박힌 뾰족한 금관 · 금 다섯 꼭지 별 홀'),
       'B': ('B 별빛 망토 여왕', '옅은 금빛 드레스 · 뒤로 크게 펼친 별밭 망토(속이 밤하늘 · 남빛 테) · 얼음빛 수정 관 · 갈색 머리 · 금 다섯 꼭지 별 홀'),
       'C': ('C 성운 머리칼 여왕', '뒤로 흐르는 분홍 · 보라 · 하늘빛 성운 머리칼(별이 박힘) · 짙은 청록 드레스와 은테 · 분홍 보석 작은 금 관 · 금 다섯 꼭지 별 홀')}
for opt in 'ABC':
    B.add('starqueen' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [queen('idle0', opt), queen('idle1', opt)], PAL[opt], (31, 15), 27, pad=4,
          arm=['C', 'c'], hand='S', wpn='sscep', idle={'h': [3, 4], 'a': -75})
B.dump()
