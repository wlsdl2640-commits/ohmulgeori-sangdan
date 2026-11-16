"""월광 사냥개 (moonhound · 별의 정원 · 짐승 · 얼음 · 2연타 · 맞히면 출혈) 시안 2 — 11-16 22:15 사용자 「다시」
첫 시안(가는 다리 · 작은 머리)보다 굵고 큰 늑대개 틀(헬하운드 · 케르베로스 크기) · still · noArm · 공격 qbite/qpounce · 스킬 qmaul
A 달빛 갈기 늑대개: 은푸른 털 · 목과 어깨에서 뒤로 흩날리는 빛나는 달빛 갈기 · 빛나는 눈 · 꼬리 끝 빛
B 얼음 수정 사냥개: 몸을 덮은 하늘빛 얼음 수정 판 · 등을 따라 솟은 수정 가시 · 가슴 속 흰 빛 · 서리 앉은 발
C 밤하늘 털 사냥개: 별이 박힌 짙은 남빛 털 · 옆구리 별자리 줄 · 은빛 가슴 갈기 · 혜성처럼 흐르는 꼬리
D 달빛 갑주 사냥개: 은빛 갑주(머리 판 · 목 판 · 등 판)를 두른 남빛 군견 · 이마의 월장석 · 빛나는 눈
피한 것: 흰 늑대 + 붉은 무늬(유명한 신 늑대) · 칼을 문 늑대 · 초승달과 별 · 더하기 꼴 반짝이"""
from kit import *

ACT = {'atk': ['qbite', 'qpounce'], 'skl': ['qmaul'], 'tk': 0.9,
       'fx': {'atk': {'pal': 'ice', 'hit': 'bite'}, 'skl': {'pal': 'ice', 'hit': 'claw', 'big': 1, 'after': 'motes'}}}
B = Batch('hound2', 'moonhound', ACT, 'stargarden', show=[['qbite', 4], ['qpounce', 4]], still=1, noArm=1, wpn='none')
MODES = ['idle0', 'idle1', 'bite', 'charge', 'leap']
GY = 21.25


def rotp(pts, cx, cy, a):
    ca, sa = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * ca - (y - cy) * sa, cy + (x - cx) * sa + (y - cy) * ca) for (x, y) in pts]


def pose(mode):
    """자세: 몸 기울기 · 들림 · 앞뒤 다리 끝 · 머리 낮춤 · 입 벌림"""
    return {'idle0': dict(t=0.00, up=0.00, ff=(0, 0), hf=(0, 0), hd=0.00, op=0, tl=0.00),
            'idle1': dict(t=0.00, up=-0.34, ff=(0, 0), hf=(0, 0), hd=-0.34, op=0, tl=1.19),
            'bite': dict(t=0.07, up=0.51, ff=(1.36, 0), hf=(-0.51, 0), hd=1.36, op=1, tl=0.51),
            'charge': dict(t=0.05, up=0.34, ff=(2.55, -0.34), hf=(-2.21, 0), hd=1.02, op=0, tl=0.85),
            'leap': dict(t=-0.14, up=-3.06, ff=(4.25, -3.06), hf=(-4.59, -0.85), hd=-0.51, op=1, tl=-1.36)}[mode]


def hound(mode, opt):
    c = Cv(46, 30); P = pose(mode); up = P['up']
    pv = (17.85, 10.20)                                                                                                         # 몸 돌림 축
    R = lambda pts: rotp([(x, y + up) for (x, y) in pts], pv[0], pv[1] + up, P['t'])
    far, near = 'c', 'C'
    def leg(pts, ch, w0=1.87, w1=1.19):
        c.fill(path(pts, w0, w1), ch); f = pts[-1]; c.fill(ell(f[0] + 0.77, f[1] - 0.26, 1.61, 0.85), ch)
    fx, fy = P['ff']; hx_, hy_ = P['hf']; g = GY - 0.85
    lift = min(0, up)
    # 먼 다리
    leg([R([(22.44, 11.05)])[0], (22.27 + fx * 0.42, 16.15 + fy * 0.42 + up * 0.26), (22.61 + fx, g + fy + lift)], far)
    leg([R([(13.26, 10.71)])[0], (11.22 + hx_ * 0.34, 14.79 + hy_ * 0.34 + up * 0.26), (10.20 + hx_ * 0.59, 17.51 + hy_ * 0.51 + up * 0.26), (11.56 + hx_, g + hy_ + lift)], far)
    # 꼬리 (굵은 털 꼬리가 위로 휨)
    tl = P['tl']; tail = R([(8.67, 7.31), (5.95, 6.46 + tl * 0.34), (4.08, 4.59 + tl), (3.74, 2.04 + tl)])
    c.fill(path(tail, 1.19, 1.53 if opt != 'C' else 0.85), 'C')
    # 몸통: 높은 어깨 · 깊은 가슴 · 올라간 배
    body = R([(8.84, 6.46), (12.75, 5.61), (17.85, 4.93), (22.10, 4.08), (25.84, 5.44), (27.20, 9.01), (26.35, 13.09), (23.29, 14.28), (19.21, 13.26), (15.64, 12.07), (11.90, 12.58), (8.84, 12.41), (7.31, 9.52)])
    c.fill(poly(body), 'C')
    hd = P['hd']; hx, hy = R([(28.05, 4.25 + hd)])[0]
    c.fill(poly(R([(21.25, 4.59), (25.50, 3.40)]) + [(hx - 1.70, hy - 2.21), (hx + 0.85, hy + 2.21)] + R([(26.86, 10.20), (23.46, 9.86)])), 'C')   # 굵은 목
    c.fill(ell(hx, hy, 3.91, 3.31), 'C'); c.fill(ell(hx - 1.70, hy + 2.04, 2.72, 2.21), 'C')                                      # 큰 머리 · 볼 털
    c.fill(poly([(hx + 0.85, hy - 2.04), (hx + 6.97, hy - 0.51), (hx + 7.31, hy + 1.36), (hx + 0.85, hy + 2.55)]), 'C')             # 굵은 주둥이
    if P['op']:
        c.fill(poly([(hx + 0.34, hy + 2.04), (hx + 6.46, hy + 3.40), (hx + 6.12, hy + 4.59), (hx - 0.51, hy + 3.40)]), 'C')          # 벌린 아래턱
        c.fill(poly([(hx + 1.36, hy + 1.70), (hx + 6.80, hy + 1.53), (hx + 6.29, hy + 3.06), (hx + 1.36, hy + 2.89)]), 'm'); c.set(hx + 5.95, hy + 1.70, 'w'); c.set(hx + 3.40, hy + 1.70, 'w'); c.set(hx + 5.44, hy + 2.89, 'w'); c.set(hx + 2.89, hy + 2.72, 'w')
    else:
        c.fill(thins([(hx + 2.04, hy + 2.04), (hx + 6.80, hy + 1.53)]), 'k')
    c.fill(poly([(hx - 2.55, hy - 1.70), (hx - 2.89, hy - 6.80 + (0.68 if mode == 'idle1' else 0)), (hx + 0.34, hy - 2.72)]), 'C')   # 뾰족한 귀
    c.fill(poly([(hx - 0.51, hy - 2.55), (hx + 0.17, hy - 5.95), (hx + 1.70, hy - 2.55)]), 'c')
    # 가까운 다리
    ft = R([(24.65, 11.56)])[0]; ht = R([(11.39, 10.71)])[0]
    leg([ft, (24.99 + fx * 0.42, 16.49 + fy * 0.42 + up * 0.26), (25.33 + fx, g + fy + lift)], near, 2.12, 1.27)
    leg([ht, (9.35 + hx_ * 0.34, 14.96 + hy_ * 0.34 + up * 0.26), (8.16 + hx_ * 0.59, 17.85 + hy_ * 0.51 + up * 0.26), (9.52 + hx_, g + hy_ + lift)], near, 2.29, 1.27)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(box(hx + 6.63, hy - 0.68, hx + 7.31, hy + 0.17), 'k')                                                            # 코
    back = [R([(x, y)])[0] for (x, y) in ((11.05, 5.78), (14.96, 5.27), (18.70, 4.76), (22.10, 4.08))]
    eye = (hx + 1.19, hy - 1.36)
    c.fill(box(eye[0], eye[1], eye[0] + 1.02, eye[1] + 0.34), 'E')                                                              # 눈
    back = [R([(x, y)])[0] for (x, y) in ((10.20, 6.46), (14.45, 5.95), (18.70, 5.78), (22.61, 6.12))]
    if opt == 'A':                                                                                                           # 뒤로 흩날리는 달빛 갈기
        wv = 0.68 if mode == 'idle1' else 0.00
        for i, (dy, L) in enumerate(((-0.85, 7.65), (0.85, 8.50), (2.55, 7.65), (4.25, 6.46), (5.95, 5.10))):           # 뒤로 흩날리는 달빛 갈기 (굵은 다발 다섯)
            r0 = (hx - 1.70 - i * 0.51, hy + dy)
            mid = (r0[0] - L * 0.42, r0[1] - 1.36 + wv * (i % 2)); tip = (r0[0] - L, r0[1] - 0.51 - i * 0.17 + wv)
            c.fill(path([r0, mid, tip], 1.70 - i * 0.13, 0.42), 'L'); c.only(path([r0, mid], 0.51), 'H', 'L')
        c.only(ell(tail[-1][0], tail[-1][1], 1.70, 1.70), 'L', 'CQc')                                                          # 꼬리 끝 빛
    elif opt == 'B':
        for (x, y) in [(x, y) for y in range(c.H) for x in range(c.W) if c.g[y][x] in 'CQc']:                                 # 얼음 수정 판 (비스듬한 면)
            k = (x + 2 * y) % 9
            if k in (0, 1): c.set(x, y, 'X' if c.g[y][x] != 'Q' else 'x')
        for i, b in enumerate(back):                                                                                         # 등을 따라 솟은 수정 가시
            h = 3.06 + (i % 2) * 1.19
            c.fill(poly([(b[0] - 1.02, b[1] + 0.68), (b[0] - 1.36, b[1] - h), (b[0] + 0.85, b[1] + 0.68)]), 'X'); c.only(thin((b[0] - 0.68, b[1]), (b[0] - 1.19, b[1] - h + 1)), 'x', 'X')
        cp = R([(24.31, 11.05)])[0]; c.fill(ell(cp[0], cp[1], 1.36, 1.36), 'L')                                                 # 가슴 속 흰 빛
        for f in ((22.61 + fx, GY - 0.68 + fy + min(0, up)), (25.16 + fx, GY - 0.68 + fy + min(0, up)), (9.86 + hx_, GY - 0.68 + hy_ + min(0, up))):
            c.only(ell(f[0] + 0.51, f[1] - 0.17, 1.36, 0.77), 'x', 'CQcX')                                                     # 서리 앉은 발
    elif opt == 'C':
        for (x, y) in [(x, y) for y in range(c.H) for x in range(c.W) if c.g[y][x] in 'CQc']:
            if (x * 7 + y * 11) % 29 == 0: c.set(x, y, 'L')                                                                 # 털에 박힌 별
        pts = R([(10.20, 9.35), (13.26, 10.71), (16.15, 9.52), (19.21, 11.22)])
        for a, b in zip(pts, pts[1:]): c.only(thin(a, b), 'y', 'CQc')
        for p in pts: c.set(p[0], p[1], 'L')                                                                                # 옆구리 별자리 줄
        c.fill(poly(R([(24.65, 9.01), (27.71, 10.20), (26.86, 13.60), (24.31, 12.75)])), 'L'); c.only(thin(*R([(25.50, 9.86), (26.69, 12.75)])), 'H', 'L')   # 은빛 가슴 갈기
        c.only(path(tail[1:], 0.68), 'P', 'CQc'); c.fill(ell(tail[-1][0], tail[-1][1] - 0.51, 1.36, 1.36), 'L')               # 혜성 꼬리
    else:
        hp = poly([(hx - 1.36, hy - 2.21), (hx + 3.06, hy - 1.87), (hx + 3.91, hy - 0.68), (hx + 0.51, hy - 0.51), (hx - 1.53, hy + 0.17)])
        c.fill(hp, 'N'); c.only(thin((hx - 1.19, hy - 2.04), (hx + 2.89, hy - 1.70)), 'x', 'N')                                # 머리 판
        c.fill(ell(hx + 0.51, hy - 1.87, 0.77, 0.68), 'G')                                                                       # 이마 월장석
        c.fill(box(eye[0], eye[1], eye[0] + 1.02, eye[1] + 0.34), 'E')
        for k in range(3):                                                                                                   # 목 판
            a = R([(24.31 - k * 1.53, 7.31 + k * 0.51)])[0]
            c.fill(poly([(a[0] - 1.19, a[1] - 0.51), (a[0] + 1.02, a[1] - 0.85), (a[0] + 1.36, a[1] + 2.04), (a[0] - 1.02, a[1] + 2.21)]), 'N')
        sad = poly(R([(11.05, 6.12), (19.55, 5.61), (20.23, 10.54), (10.54, 11.05)]))
        c.fill(sad, 'N'); c.only(set(thins(R([(11.05, 6.29), (19.55, 5.78)]))), 'x', 'N'); c.only(set(thins(R([(10.88, 10.71), (20.06, 10.20)]))), 'n', 'N')   # 등 판
        c.only(set(thins(R([(15.30, 5.95), (15.30, 10.54)]))), 'n', 'N')
    return c


PAL = {
    'A': {'C': '#94a2c4', 'Q': '#d0dcf2', 'c': '#5a6690', 'k': '#121626', 'w': '#ffffff', 'E': '#9af4ff', 'L': '#a8eaff', 'H': '#f0fcff', 'm': '#5a1a2a'},
    'B': {'m': '#1a3a6a', 'C': '#7ab4e0', 'Q': '#c8ecff', 'c': '#3e70a8', 'X': '#a8e4ff', 'x': '#effcff', 'L': '#ffffff', 'k': '#0e1a2c', 'w': '#ffffff', 'E': '#ffffff'},
    'C': {'L': '#c8d0e8', 'H': '#ffffff', 'm': '#5a1a2a', 'C': '#26306a', 'Q': '#46549e', 'c': '#141a44', 'L': '#fff6c0', 'y': '#c8b060', 'M': '#c8d0e8', 'P': '#9ad0ff', 'k': '#080a18', 'w': '#ffffff', 'E': '#e8f0ff'},
    'D': {'m': '#5a1a2a', 'C': '#3a4a7a', 'Q': '#5a6ea8', 'c': '#222c50', 'N': '#b8c0d4', 'n': '#6e7690', 'x': '#f0f4ff', 'G': '#c8f0ff', 'k': '#0e1222', 'w': '#ffffff', 'E': '#9af4ff'},
}
LAB = {'A': ('A 달빛 갈기 늑대개', '굵고 큰 은푸른 늑대개 · 목과 어깨에서 뒤로 흩날리는 빛나는 달빛 갈기(불꽃처럼) · 얼음빛 눈 · 꼬리 끝 빛'),
       'B': ('B 얼음 수정 사냥개', '몸을 덮은 하늘빛 얼음 수정 판(비스듬한 결) · 등을 따라 솟은 수정 가시 넷 · 가슴 속 흰 빛 · 서리 앉은 발 · 흰 눈'),
       'C': ('C 밤하늘 털 사냥개', '별이 박힌 짙은 남빛 털 · 옆구리를 잇는 별자리 줄 · 은빛 가슴 갈기 · 혜성처럼 빛이 흐르는 꼬리'),
       'D': ('D 달빛 갑주 사냥개', '은빛 갑주(머리 판 · 목 판 셋 · 등 판)를 두른 남빛 군견 · 이마의 하늘빛 월장석 · 빛나는 눈')}
for opt in 'ABCD':
    fr = {m: hound(m, opt) for m in MODES}
    B.add('moonhound' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], (33, 6), 17,
          gm={m: fr[m] for m in ('bite', 'charge', 'leap')})
B.dump()
