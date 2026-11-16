"""미믹 (mimic · 보물 던전 · 괴물 · 2연타 · 맞히면 기절) 시안 — 보물 상자 · noArm · still (다리 · 손 없음)
공격 qbite(뚜껑을 활짝 열고 덥석) · 스킬 qmaul(뛰어올라 통째로 삼키기)
A 나무 보물 상자 미믹: 쇠 띠 두른 나무 상자 · 금 자물쇠 · 뚜껑 틈의 노란 눈 · 열면 톱니 이빨과 긴 붉은 혀
B 쇠 금고 미믹: 리벳 박힌 먹빛 쇠 상자 · 열쇠 구멍이 빛나는 눈 하나 · 열면 쇠못 같은 이빨과 보랏빛 혀
C 황금 상자 미믹: 보석 박힌 금 상자 · 뚜껑 틈으로 흘러넘친 금화 · 열면 송곳니와 붉은 혀 · 뚜껑 안쪽의 두 눈
피한 것: 다리 · 손이 달린 상자(유명한 것) · 십자 무늬 띠"""
from kit import *

ACT = {'atk': ['qbite'], 'skl': ['qmaul'], 'tk': 0.9,
       'fx': {'atk': {'pal': 'gold', 'hit': 'bite'}, 'skl': {'pal': 'gold', 'hit': 'coins', 'big': 1, 'after': 'dust'}}}
B = Batch('mimic1', 'mimic', ACT, 'treasure', show=[['qbite', 4], ['qmaul', 4]], still=1, noArm=1, wpn='none')
MODES = ['idle0', 'idle1', 'bite', 'leap']
X0, X1, YT, YB = 4.0, 22.0, 13.0, 24.0   # 상자 몸 (뚜껑 아래)


def rot(pts, cx, cy, a):
    ca, sa = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * ca - (y - cy) * sa, cy + (x - cx) * sa + (y - cy) * ca) for (x, y) in pts]


def chest(mode, opt):
    c = Cv(30, 30); ang = {'idle0': -0.12, 'idle1': -0.24, 'bite': -0.72, 'leap': -0.62}[mode]; lift = 3.0 if mode == 'leap' else 0.0
    yt, yb = YT - lift, YB - lift
    hx, hy = X0, yt                                                                                                          # 경첩 (뒤 위 모서리)
    lid = rot([(X0 - 0.4, yt), (X0 - 0.4, yt - 3.2), (X0 + 1.6, yt - 5.6), (X1 - 1.6, yt - 5.6), (X1 + 0.4, yt - 3.2), (X1 + 0.4, yt)], hx, hy, ang)
    inner = poly([(X0, yt), lid[-1], (X1, yt + 0.6)]) if ang < -0.2 else set()
    c.fill(inner, 'm'); c.only(ell(X0 + 3.0, yt - 2.0, 3.6, 3.0), 'k', 'm')                                                 # 입 속 (붉은 잇몸 · 안쪽 목구멍)
    body = rbox(X0, yt, X1, yb, 0.6); c.fill(body, 'C')
    c.fill(poly(lid), 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    # 이빨: 몸 위 가장자리 · 뚜껑 앞 가장자리
    if ang < -0.2:
        for k in range(6):
            x = X0 + 2.4 + k * 2.6
            c.fill(poly([(x, yt + 0.2), (x + 1.4, yt + 0.2), (x + 0.7, yt - 1.6)]), 'w')
        lx0, ly0 = lid[0]; lx1, ly1 = lid[-1]; L = math.hypot(lx1 - lx0, ly1 - ly0); ux, uy = (lx1 - lx0) / L, (ly1 - ly0) / L; nx, ny = -uy, ux   # 뚜껑 아래 가장자리 · 입 쪽 수직
        if ny < 0: nx, ny = -nx, -ny
        for k in range(5):
            t = (k + 0.8) / 6; x, y = lx0 + (lx1 - lx0) * t, ly0 + (ly1 - ly0) * t
            c.fill(poly([(x - ux * 0.8, y - uy * 0.8), (x + ux * 0.8, y + uy * 0.8), (x + nx * 2.0, y + ny * 2.0)]), 'w')       # 뚜껑 이빨
    if ang < -0.5:                                                                                                          # 앞으로 길게 늘어진 혀
        c.fill(path([(X0 + 6.0, yt - 0.4), (X1 - 1.0, yt - 1.2), (X1 + 3.0, yt + 1.6), (X1 + 3.0, yt + 6.4)], 1.4, 1.0), 'T'); c.only(path([(X0 + 7.0, yt - 0.8), (X1, yt - 1.0), (X1 + 2.4, yt + 2.0)], 0.4), 't', 'T')
    # 띠 · 자물쇠 · 장식
    if opt == 'A':
        for x in (X0 + 3.0, X1 - 3.4): c.only(box(x, yt, x + 1, yb), 'M', 'CQc')                                           # 세로 쇠 띠 (가로 띠 없음)
        c.only({(int(x), int(y)) for (x, y) in rot([(X0 + 3.0, yt - 4.0), (X0 + 4.0, yt - 4.0), (X1 - 3.4, yt - 4.0), (X1 - 2.4, yt - 4.0)], hx, hy, ang)}, 'M', 'CQc')
        c.fill(rbox(X1 - 1.2, yt - 1.0, X1 + 1.4, yt + 2.6, 0.4), 'G'); c.set(X1 + 0.2, yt + 1.0, 'k')                     # 금 자물쇠
        if ang > -0.2: c.fill(box(X0 + 8.0, yt - 0.6, X0 + 9.0, yt - 0.2), 'E'); c.fill(box(X0 + 11.4, yt - 0.6, X0 + 12.0, yt - 0.2), 'E')   # 뚜껑 틈의 눈
        else: c.fill(box(X0 + 6.0, yt + 2.0, X0 + 7.0, yt + 2.6), 'E')
    elif opt == 'B':
        for (x, y) in ((X0 + 1.4, yt + 1.6), (X1 - 1.6, yt + 1.6), (X0 + 1.4, yb - 1.4), (X1 - 1.6, yb - 1.4), (X0 + 9.0, yb - 1.4)): c.set(x, y, 'x')   # 리벳
        c.fill(rbox(X0 + 7.0, yt + 3.0, X0 + 11.0, yt + 7.4, 1.2), 'N'); c.fill(box(X0 + 8.4, yt + 4.4, X0 + 9.6, yt + 5.6), 'E'); c.set(X0 + 8.4, yt + 4.4, 'w')   # 빛나는 열쇠 구멍 눈
    else:
        c.fill(box(X0, yb - 1.2, X1, yb), 'g'); c.fill(box(X0, yt, X1, yt + 0.8), 'g')
        for (x, y, ch) in ((X0 + 4.0, yt + 4.6, 'R'), (X0 + 9.0, yt + 5.0, 'B'), (X0 + 14.0, yt + 4.6, 'A')): c.fill(rbox(x - 1.0, y - 1.0, x + 1.0, y + 1.0, 0.4), ch); c.set(x - 0.4, y - 0.6, 'w')   # 박힌 보석
        if ang > -0.2:
            for (x, y) in ((X0 + 3, yt - 0.6), (X0 + 7, yt - 1.0), (X1 - 2, yt - 0.6), (X1 + 0.6, yt + 1.0), (X1 + 1.0, yt + 3.0)): c.fill(ell(x, y, 1.0, 0.7), 'o'); c.set(x, y - 0.4, 'O')   # 흘러넘친 금화
        lx, ly = rot([(X0 + 9.0, yt - 2.6)], hx, hy, ang)[0]
        if ang < -0.2: c.fill(box(lx - 1.0, ly, lx + 0.4, ly + 0.6), 'E'); c.fill(box(lx + 2.0, ly + 1.4, lx + 3.0, ly + 2.0), 'E')   # 뚜껑 안쪽 두 눈
    return c


PAL = {
    'A': {'m': '#6a1420', 'C': '#a8743e', 'Q': '#d09a5a', 'c': '#6e4822', 'M': '#6a6a76', 'G': '#f0c444', 'k': '#1a0a0a', 'w': '#fff8e8', 'T': '#d83a4a', 't': '#ff8a9a', 'E': '#ffe040'},
    'B': {'m': '#3a1440', 'C': '#4a4e5c', 'Q': '#7a7e8e', 'c': '#2a2c36', 'x': '#c8ccd8', 'N': '#1a1c24', 'k': '#120814', 'w': '#e8ecf4', 'T': '#9a4ad0', 't': '#d0a0ff', 'E': '#ff5a3a'},
    'C': {'m': '#6a1420', 'C': '#e8b840', 'Q': '#fff0a0', 'c': '#a87a20', 'g': '#c89428', 'R': '#e83a4a', 'B': '#3a8ae8', 'A': '#3ac870', 'o': '#ffd860', 'O': '#fff6c0',
          'k': '#1a0a0a', 'w': '#fff8e8', 'T': '#d83a4a', 't': '#ff8a9a', 'E': '#ff5a3a'},
}
LAB = {'A': ('A 나무 보물 상자 미믹', '세로 쇠 띠 두른 나무 상자 · 금 자물쇠 · 뚜껑 틈으로 엿보는 노란 눈 · 뚜껑을 열면 위아래 톱니 이빨과 길게 늘어진 붉은 혀'),
       'B': ('B 쇠 금고 미믹', '리벳 박힌 먹빛 쇠 상자 · 열쇠 구멍이 붉게 빛나는 눈 하나 · 열면 쇠못 같은 흰 이빨과 보랏빛 혀'),
       'C': ('C 황금 상자 미믹', '빨강 · 파랑 · 초록 보석이 박힌 금 상자 · 뚜껑 틈으로 흘러넘친 금화 · 열면 송곳니와 붉은 혀 · 뚜껑 안쪽에서 빛나는 두 눈')}
for opt in 'ABC':
    fr = {m: chest(m, opt) for m in MODES}
    B.add('mimic' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], (X1 + 1, YT), (X0 + X1) / 2,
          gm={m: fr[m] for m in ('bite', 'leap')})
B.dump()
