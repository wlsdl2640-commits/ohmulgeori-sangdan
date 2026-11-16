"""별고래 (starwhale · 별의 정원 필드 우두머리 · 괴수+짐승 · 물 · 광역 · 냉기 · 수면) 시안 — 떠 있는 큰 고래 · noArm · still · ms 1.5
공격 bswoop(몸을 굴려 부딪치기) · 스킬 wspit(숨을 들이켰다가 별빛 물거품)
A 별무늬 남빛 고래: 짙은 남빛 몸 · 줄무늬 진 밝은 배 · 등에 흩뿌린 별 · 하늘빛으로 빛나는 긴 가슴지느러미 테와 꼬리 끝
B 성운 지느러미 고래: 보랏빛 몸 · 날개처럼 긴 분홍 · 하늘빛 성운 구름 가슴지느러미 · 옆구리를 잇는 금빛 별자리 줄
C 유리 별고래: 하늘빛 유리 테두리 안에 비치는 별밭 몸(짙은 남빛 속에 별) · 빛나는 배 줄무늬
피한 것: 등에 도시를 진 우주 고래(유명한 것) · 촉수 · 섬을 진 거북(아스피도켈론 몫)"""
from kit import *
from cloud import puffs

ACT = {'atk': ['bswoop'], 'skl': ['wspit'], 'tk': 1.3,
       'fx': {'atk': {'pal': 'water', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'water', 'hit': 'vortex', 'p': 'orb', 'big': 2, 'after': 'bubbles', 'shake': 3}}}
B = Batch('whale1', 'starwhale', ACT, 'stargarden', show=[['wspit', 4], ['bswoop', 4]], ms=1.5, mx=20, my=20, still=1, noArm=1, wpn='none', float=1)
MODES = ['idle0', 'idle1', 'bite', 'swell', 'spit']


def whale(mode, opt):
    c = Cv(70, 40); up = {'idle0': 0, 'idle1': 3.12, 'bite': 1.56, 'swell': 2.34, 'spit': -0.78}[mode]; pf = 0.78 if mode == 'swell' else 0.00
    op = mode in ('bite', 'spit'); cy = 14.04
    fl = [(10.92, cy - 0.78), (4.68, cy - 5.46 - up * 0.47), (1.56, cy - 7.02 - up), (3.59, cy - 3.12 - up * 0.31), (7.02, cy + 0.47),
          (3.59, cy + 3.59 - up * 0.31), (1.87, cy + 7.33 - up), (5.15, cy + 5.93 - up * 0.47), (10.92, cy + 1.25)]
    body = ell(35.88, cy, 11.70, 7.49 + pf) | ell(24.18, cy + 0.31, 11.70, 6.55 + pf) | poly([(13.26, cy - 3.90), (15.60, cy - 5.15), (15.60, cy + 4.99), (10.14, cy + 1.09)]) | poly(fl)
    if op: body -= poly([(47.89, cy + 1.87), (37.44, cy + 3.28), (47.89, cy + 4.99)])                                              # 벌린 입
    c.fill(body, 'C')
    if op: c.fill(poly([(47.27, cy + 4.84), (37.91, cy + 3.59), (45.55, cy + 7.49)]), 'C')                                         # 아래턱
    belly = {(x, y) for (x, y) in ell(34.32, cy + 4.68, 12.48, 3.90 + pf) if (x, y) in body and y > cy + 1.87}
    c.fill(belly, 'P')
    for k in range(5): c.only(thins([(24.96 + k * 0.47, cy + 4.68 + k * 0.55), (45.24 - k * 0.94, cy + 3.43 + k * 0.70)]), 'p', 'P')   # 배 줄무늬
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    fin = poly([(31.20, cy + 3.12), (35.88, cy + 3.90), (31.20, cy + 11.70 - up * 0.23), (26.21, cy + 15.29 - up * 0.23), (27.30, cy + 9.36)])   # 긴 가슴지느러미
    if opt == 'B':
        puffs(c, [(28.08, cy + 7.80 - up * 0.16, 2.65), (24.96, cy + 10.92 - up * 0.23, 2.34), (21.84, cy + 13.26 - up * 0.23, 2.03), (31.20, cy + 5.46, 2.18)], 'R', 'r', light='o')   # 성운 구름 지느러미
        c.only(ell(24.18, cy + 12.01 - up * 0.23, 2.03, 1.25), 'B', 'Rro')
    else:
        c.fill(fin, 'C'); c.only({q for q in fin if (q[0] + 1, q[1] + 1) not in fin or (q[0] - 1, q[1] + 1) not in fin}, 'B', 'C')   # 빛나는 지느러미 테
    c.fill(box(40.56, cy - 2.03, 41.50, cy - 1.40), 'k'); c.set(40.56, cy - 2.03, 'w')                                              # 눈
    if not op: c.fill(thins([(47.27, cy + 2.03), (39.00, cy + 2.81), (37.44, cy + 2.03)]), 'c')                                   # 입 줄
    if opt == 'A':
        for (x, y) in ((24, -6), (30, -8), (36, -8.6), (42, -8.6), (48, -7.6), (27, -3), (39, -5), (45, -5), (33, -4)): c.only({(int(x * 0.78), int(cy + y * 0.78 + 1.5))}, 'L', 'CQc')   # 등에 흩뿌린 별
        c.only({q for q in poly(fl) if q[0] < 5.5}, 'B', 'CQc')                                                                  # 꼬리 끝 빛
    if opt == 'B':
        pts = [(18.72, cy - 1.56), (23.40, cy - 3.90), (28.86, cy - 2.34), (33.54, cy - 4.68), (39.00, cy - 3.43)]
        for a, b in zip(pts, pts[1:]): c.only(thin(a, b), 'y', 'CQc')
        for (x, y) in pts: c.set(x, y, 'Y')
    if opt == 'C':
        inner = {(x, y) for (x, y) in body if all((x + dx, y + dy) in body for dx in (-2, 0, 2) for dy in (-2, 0, 2)) and (x, y) not in belly}
        c.fill(inner, 'V')
        for (x, y) in list(inner):
            if (x * 7 + y * 13) % 23 == 0: c.set(x, y, 'L')
            elif (x * 5 + y * 11) % 31 == 0: c.set(x, y, 'l')
        c.fill(box(40.56, cy - 2.03, 41.50, cy - 1.40), 'k'); c.set(40.56, cy - 2.03, 'w')
    if mode == 'spit': c.fill(ell(49.92, cy + 3.12, 1.87, 1.87), 'B'); c.fill(ell(49.45, cy + 2.65, 0.78, 0.78), 'w')                # 별빛 물거품
    return c


PAL = {
    'A': {'C': '#24306a', 'Q': '#3c4c9e', 'c': '#141c46', 'P': '#c8d0f0', 'p': '#8e98c8', 'B': '#6ae8ff', 'L': '#fff6c0', 'k': '#060816', 'w': '#ffffff'},
    'B': {'C': '#4a2a7a', 'Q': '#6e48a6', 'c': '#2c184c', 'P': '#d8c8f0', 'p': '#a898cc', 'R': '#ff9ad0', 'r': '#c06aa8', 'o': '#ffe0f0', 'B': '#7ad8ff',
          'Y': '#ffe070', 'y': '#c8a440', 'k': '#0c0618', 'w': '#ffffff'},
    'C': {'C': '#8ac8ff', 'Q': '#d0ecff', 'c': '#4a8ad0', 'V': '#1a2a6a', 'L': '#fff6c0', 'l': '#9ad0ff', 'P': '#c0e4ff', 'p': '#7ab4e8', 'B': '#c0f0ff', 'k': '#060816', 'w': '#ffffff'},
}
LAB = {'A': ('A 별무늬 남빛 고래', '짙은 남빛 몸 · 줄무늬 진 밝은 배 · 등에 흩뿌린 별 · 하늘빛으로 빛나는 긴 가슴지느러미 테와 꼬리 끝 · 숨을 들이켜 부풀었다가 별빛 물거품'),
       'B': ('B 성운 지느러미 고래', '보랏빛 몸 · 날개처럼 긴 분홍 성운 구름 가슴지느러미(하늘빛 빛) · 옆구리를 잇는 금빛 별자리 줄 · 연보랏빛 배 줄무늬'),
       'C': ('C 유리 별고래', '하늘빛 유리 테두리 안에 비치는 별밭 몸(짙은 남빛 속 별) · 빛나는 하늘빛 배 줄무늬 · 빛나는 지느러미 테')}
for opt in 'ABC':
    fr = {m: whale(m, opt) for m in MODES}
    B.add('starwhale' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], (48, 16), 30, pad=4,
          gm={m: fr[m] for m in ('bite', 'swell', 'spit')})
B.dump()
