"""지하수로 3구역 「옛 제국 수로」(Lv100) 몬스터 시안 — 11-18 01:06 사용자 「다음」(2구역 시안 다음 구간)
옛 제국이 판 돌 수로 · 아치 · 청동 · 녹청 · 물이 찬 길. 계획 문서 「하르겐 지하」 절의 제안: 수로 히드라 · 동굴 거머리 · 석상 파수꾼 · 독이끼 덩굴 · 눈먼 동굴어 · 우두머리 수문장(고대 석상 거인).
일반 다섯은 A · B, 우두머리는 A · B · C.
- 수로 히드라: A 세 머리 물뱀(두 겹 똬리) · B 쇠목걸이 두 머리(녹슨 쇠목걸이 · 끊어진 사슬)
- 동굴 거머리: A 창백한 동굴 거머리(물음표처럼 선 몸 · 마디 줄 · 둥근 이빨 빨판) · B 빛 점 거머리
- 독이끼 덩굴: A 독꽃 덩굴(활처럼 휜 줄기 · 끝의 큰 종꽃) · B 덩굴 손(손끝 보라 독 봉오리)
- 눈먼 동굴어: A 창백한 눈먼 물고기(비치는 등뼈 · 내장 그림자) · B 더듬이 메기
- 석상 파수꾼: A 녹청 청동 병사상(앞으로 든 녹청 방패 · 청동 창 aqspear) · B 기둥 짊어진 석상(깨진 기둥머리 · 돌주먹) — 둘 다 발에 깨진 받침돌
- 수문장: A 수문 거인(몸통의 나무 수문 · 아래 틈에서 쏟아지는 물) · B 수도교 거인(기둥 다리 사이 아치 · 작은 아치 셋 · 어깨 물길) · C 청동 수문장(사자 머리 분수 · 삼지창 aqtrident)
피한 것: 늪 거머리(가로로 누운 붉은 거머리) · 늪지 괴물(이끼 덩이) · 가고일(백작의 성) · 흰 옷 석상 · 볏 달린 청동 투구 · 격자 창살(줄이 엇갈리지 않게) · 바퀴살
python3 aq3.py → ../t/aq3_*.json"""
from kit import *


def qb(p0, p1, p2, n=10):
    """2차 베지어 점들"""
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]


def tube(pts, rs):
    """점마다 반지름이 다른 굵은 줄 (rs는 pts와 같은 길이)"""
    out = set()
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        for k in range(4):
            t0, t1 = k / 4, (k + 1) / 4
            pa = (a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0); pb = (a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1)
            out |= cap(pa, pb, rs[i] + (rs[i + 1] - rs[i]) * (t0 + t1) / 2)
    return out


def lerp_r(rs, n):
    """반지름 몇 개를 n+1 점에 고르게 늘인다"""
    out = []
    for i in range(n + 1):
        u = i / n * (len(rs) - 1); j = min(len(rs) - 2, int(u)); f = u - j
        out.append(rs[j] + (rs[j + 1] - rs[j]) * f)
    return out


def at_path(pts, u):
    """줄 위 u(0~1) 자리의 점과 방향(단위)"""
    L = [0.0]
    for a, b in zip(pts, pts[1:]): L.append(L[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    s = u * L[-1]
    for i in range(len(pts) - 1):
        if L[i + 1] >= s or i == len(pts) - 2:
            a, b = pts[i], pts[i + 1]; seg = (L[i + 1] - L[i]) or 1e-9; f = max(0.0, min(1.0, (s - L[i]) / seg))
            dx, dy = (b[0] - a[0]) / seg, (b[1] - a[1]) / seg
            return (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), (dx, dy)


def head2(c, hx, hy, s, ch, dark, eye='E', fin=None, opened=False, teeth='w', tongue='R', mouthc='k', brow='d'):
    """옆을 본 뱀 · 용 머리 (오른쪽을 봄, s배): 머리뼈 · 주둥이 · 아래턱 · 눈두덩 · 눈 · 콧구멍 · 등 지느러미"""
    c.fill(ell(hx, hy, 2.6 * s, 2.3 * s), ch)
    c.fill(poly([(hx + 0.6 * s, hy - 1.9 * s), (hx + 4.6 * s, hy - 1.2 * s), (hx + 5.8 * s, hy - 0.2 * s), (hx + 5.6 * s, hy + 0.8 * s), (hx + 0.6 * s, hy + 1.0 * s)]), ch)
    if opened:
        c.fill(poly([(hx - 0.6 * s, hy + 0.6 * s), (hx + 4.6 * s, hy + 3.4 * s), (hx + 4.0 * s, hy + 4.6 * s), (hx - 0.6 * s, hy + 2.6 * s)]), ch)
        c.fill(poly([(hx + 0.6 * s, hy + 1.0 * s), (hx + 5.4 * s, hy + 1.0 * s), (hx + 4.2 * s, hy + 3.2 * s), (hx + 0.2 * s, hy + 2.0 * s)]), mouthc)
        c.fill(poly([(hx + 1.0 * s, hy + 1.8 * s), (hx + 3.6 * s, hy + 2.6 * s), (hx + 1.0 * s, hy + 2.4 * s)]), tongue)
        for k in range(3): c.set(hx + (1.6 + k * 1.3) * s, hy + 1.2 * s, teeth)
    else:
        c.fill(poly([(hx - 0.6 * s, hy + 0.6 * s), (hx + 5.2 * s, hy + 0.9 * s), (hx + 4.8 * s, hy + 2.0 * s), (hx - 0.4 * s, hy + 2.2 * s)]), ch)
        c.fill(thins([(hx + 1.0 * s, hy + 1.0 * s), (hx + 5.4 * s, hy + 0.9 * s)]), dark)
    if fin:
        c.fill(poly([(hx - 2.4 * s, hy - 0.2 * s), (hx - 2.2 * s, hy - 4.2 * s), (hx - 0.4 * s, hy - 3.0 * s), (hx + 0.2 * s, hy - 1.8 * s)]), fin)
    c.fill(thins([(hx - 0.4 * s, hy - 1.7 * s), (hx + 1.8 * s, hy - 1.5 * s)]), brow)
    c.fill(box(hx + 0.2 * s, hy - 1.0 * s, hx + 1.0 * s + 0.6, hy - 1.0 * s), eye)
    c.set(hx + 5.0 * s, hy - 0.6 * s, dark)


# ═══════════ 1. 수로 히드라 (noArm · 물기 · 물 뿜기) ═══════════
ACT1 = {'atk': ['qbite'], 'skl': ['wspit'], 'tk': 1.15,
        'fx': {'atk': {'pal': 'water', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'water', 'hit': 'burst', 'p': 'orb', 'big': 1, 'after': 'bubbles'}}}
B1 = Batch('aq3_hydra', 'sewercroc', ACT1, 'sewer', show=[['qbite', 4], ['wspit', 4]], still=1, noArm=1, wpn='none')
P1A = {'C': '#3a8a7a', 'Q': '#6ac0a8', 'c': '#246050', 'd': '#163c32', 'P': '#d8e8c0', 'p': '#a8c090', 'F': '#7ad8e8', 'f': '#3a98b0',
       'E': '#ffe060', 'k': '#0c1814', 'R': '#c83a3a', 'W': '#a8e8ff', 'w': '#ffffff'}
P1B = {'C': '#4a5664', 'Q': '#6e7c8c', 'c': '#303844', 'd': '#1c222a', 'P': '#b0ac94', 'p': '#86826e', 'N': '#7a6a5e', 'n': '#463a34', 'x': '#a89482',
       'O': '#b0602e', 'E': '#ff5a3a', 'k': '#140c0c', 'R': '#a83a3a', 'W': '#a8e8ff', 'w': '#ffffff'}


def coil_body(c, gy, opt):
    """똬리: 아래 고리 · 위 고리(사이 어두운 줄) · 말아 올린 꼬리"""
    c.fill(tube([(9.0, gy - 2.8), (4.4, gy - 3.0), (1.8, gy - 5.4), (2.4, gy - 8.6), (4.6, gy - 9.8)], [2.3, 2.0, 1.6, 1.1, 0.6]), 'c')
    low = ell(15.0, gy - 3.7, 11.2, 3.7); up = ell(13.8, gy - 8.4, 8.6, 3.3)
    c.fill(low, 'C'); c.fill(up, 'C')
    return low, up


def coil_seam(c, low, up):
    for (x, y) in up:
        if (x, y + 1) not in up and (x, y + 1) in low: c.only({(x, y)}, 'c', 'CQc')


def hydra(mode, opt):
    c = Cv(42, 36); gy = 34.0
    lunge = {'idle0': 0, 'idle1': 0, 'bite': 1, 'swell': -1, 'spit': 0}[mode]; bob = 0.6 if mode == 'idle1' else 0.0
    low, up = coil_body(c, gy, opt)
    if opt == 'A':
        s = 1.25
        heads = [((9.6, gy - 10.4), (6.0, gy - 21.0), (11.0 + lunge * 1.6, 8.6 + bob + lunge * 2.4), 'c'),
                 ((14.4, gy - 11.0), (14.0, gy - 22.0), (21.6 + lunge * 2.2, 11.0 - bob + lunge * 2.6), 'C'),
                 ((19.0, gy - 9.6), (24.6, gy - 15.6), (29.6 + lunge * 2.6, 18.0 + bob + lunge * 1.8), 'C')]
        R0, R1 = 2.4, 1.7
    else:
        s = 1.45
        heads = [((11.6, gy - 10.6), (9.6, gy - 22.0), (16.0 + lunge * 2.0, 9.4 + bob + lunge * 2.8), 'c'),
                 ((17.6, gy - 9.8), (22.6, gy - 17.6), (28.4 + lunge * 2.6, 15.6 - bob + lunge * 2.2), 'C')]
        R0, R1 = 2.9, 2.1
    necks = []
    for (b, ctl, (hx, hy), ch) in heads:
        pts = qb(b, ctl, (hx - 1.6 * s, hy + 1.0 * s), 10); rs = lerp_r([R0, R1], 10)
        necks.append((pts, rs, ch)); c.fill(tube(pts, rs), ch)
        if ch == 'c': c.fill(ell(hx, hy, 2.6 * s, 2.3 * s), 'c')
    coil_seam(c, low, up)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    for (pts, rs, ch) in necks:                                                                           # 목 앞(목구멍 쪽) 배 비늘
        for i in range(1, len(pts) - 1):
            (x, y), (tx, ty) = pts[i], at_path(pts, i / (len(pts) - 1))[1]
            nx, ny = -ty, tx; r = rs[i] - 0.7
            c.only({(int(x + nx * r), int(y + ny * r))}, 'P', 'CQc')
    for k in range(6): c.only(box(5.0 + k * 3.4, gy - 1.6, 6.4 + k * 3.4, gy - 1.0), 'p' if opt == 'A' else 'd', 'CQc')
    if opt == 'B':
        for (x, y) in ((7.0, gy - 10.6), (10.6, gy - 11.6), (19.0, gy - 11.0)): c.fill(poly([(x - 0.9, y + 0.8), (x + 0.9, y + 0.8), (x - 0.2, y - 1.8)]), 'd')   # 등의 검은 가시
    for i, (b, ctl, (hx, hy), ch) in enumerate(heads):
        opened = mode == 'bite' or (mode == 'spit' and i == len(heads) - 1)
        head2(c, hx, hy, s, 'c' if ch == 'c' else 'C', 'd', fin='F' if opt == 'A' else None, opened=opened)
    if opt == 'A':
        for (pts, rs, ch) in necks:                                                                        # 지느러미 살 (나란히)
            pass
    if opt == 'B':                                                                                           # 옛 제국의 쇠목걸이 · 끊어진 사슬
        for j, (pts, rs, ch) in enumerate(necks):
            u = 0.42 if j == 0 else 0.5
            (x, y), (tx, ty) = at_path(pts, u); nx, ny = -ty, tx; r = rs[int(u * (len(pts) - 1))] + 0.4
            band = {(int(round(x + tx * a + nx * b2)), int(round(y + ty * a + ny * b2))) for a in (-0.9, -0.3, 0.3, 0.9) for b2 in [k * 0.5 - r for k in range(int(r * 4) + 1)]}
            c.fill(band, 'N')
            for (bx, by) in band:
                if (bx - x) * tx + (by - y) * ty < -0.5: c.set(bx, by, 'x')
                elif (bx - x) * tx + (by - y) * ty > 0.5: c.set(bx, by, 'n')
            c.set(x + nx * 0.4, y + ny * 0.4, 'O')
            hx0, hy0 = x + nx * r, y + ny * r                                                                # 목구멍 쪽에 매달린 사슬
            for k in range(5 if j else 4):
                c.set(hx0 - 0.4 * k, hy0 + 1.0 + k * 1.0, 'N' if k % 2 == 0 else 'n')
    if mode == 'swell':
        for (b, ctl, (hx, hy), ch) in heads: c.fill(box(hx + 5.0 * s, hy + 0.2 * s, hx + 5.0 * s + 0.8, hy + 0.2 * s + 0.8), 'W')
    if mode == 'spit':
        hx, hy = heads[-1][2]; c.fill(path([(hx + 5.6 * s, hy + 1.6 * s), (hx + 5.6 * s + 3.4, hy + 1.6 * s + 1.4)], 1.2, 0.6), 'W'); c.set(hx + 5.6 * s + 2.0, hy + 1.6 * s, 'w')
    return c


for opt, pal, lab, desc in (('A', P1A, 'A 세 머리 물뱀 히드라', '두 겹 똬리를 튼 청록 몸에서 솟은 세 목 · 머리마다 물빛 등 지느러미와 노란 눈 · 목 앞의 크림빛 배 비늘 · 말아 올린 꼬리 · 세 머리가 한꺼번에 물고 앞 머리가 물줄기를 뿜는다'),
                            ('B', P1B, 'B 쇠목걸이 히드라', '옛 제국이 수로 파수 짐승으로 묶어 두던 먹빛 두 머리 히드라 · 목마다 녹슨 쇠목걸이와 끊어진 사슬 · 붉은 눈 · 등의 검은 가시 · 큰 머리로 물어뜯고 물줄기를 뿜는다')):
    fr = {m: hydra(m, opt) for m in ('idle0', 'idle1', 'bite', 'swell', 'spit')}
    B1.add('aqhydra' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, (36, 19) if opt == 'A' else (36, 17), 16, gm={m: fr[m] for m in ('bite', 'swell', 'spit')}, ms=1.25)
B1.dump()

# ═══════════ 2. 동굴 거머리 (noArm · 빨기 · 짓누르기) ═══════════
ACT2 = {'atk': ['qbite'], 'skl': ['sslam'], 'tk': 1.05,
        'fx': {'atk': {'pal': 'blood', 'hit': 'bite'}, 'skl': {'pal': 'blood', 'hit': 'bite', 'big': 1, 'after': 'bubbles'}}}
B2 = Batch('aq3_leech', 'leech', ACT2, 'sewer', show=[['qbite', 4], ['sslam', 4]], still=1, noArm=1, wpn='none')
P2A = {'C': '#e0c0c0', 'Q': '#f6e2de', 'c': '#a88282', 'd': '#785656', 'R': '#c85a6a', 'r': '#8a2a3a', 'k': '#2a1018', 'w': '#ffffff'}
P2B = {'C': '#2e3e60', 'Q': '#4e6290', 'c': '#1c2644', 'd': '#101830', 'G': '#7af0ff', 'R': '#3ab8c8', 'r': '#1a5a6a', 'k': '#06080e', 'w': '#e8ffff'}


def leech(mode, opt):
    c = Cv(32, 30); gy = 28.0
    lift = {'idle0': 0.0, 'idle1': 0.8, 'bite': -0.8, 'squash': -3.2, 'stretch': 2.2}[mode]; fw = {'bite': 3.4, 'stretch': 0.8}.get(mode, 0.0)
    pts = [(1.6, gy - 1.0), (5.0, gy - 1.8), (8.8, gy - 2.2), (12.4, gy - 3.0), (15.2, gy - 5.6), (16.4, gy - 9.6 - lift * 0.4),
           (17.0 + fw * 0.3, gy - 13.8 - lift * 0.8), (18.8 + fw * 0.7, gy - 17.4 - lift), (21.4 + fw, gy - 18.8 - lift)]
    rs = [0.6, 1.5, 2.1, 2.5, 2.7, 2.7, 2.6, 2.6, 3.0]
    c.fill(tube(pts, rs), 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    n = 13
    for k in range(1, n):                                                                                   # 마디 줄 (몸을 가로질러)
        u = k / n * 0.9
        (x, y), (tx, ty) = at_path(pts, u); nx, ny = -ty, tx; r = 2.8
        c.only(thins([(x - nx * r, y - ny * r), (x + nx * r, y + ny * r)]), 'c', 'CQ')
    hx, hy = pts[-1]
    big = 0.6 if mode == 'bite' else 0.0
    c.fill(ell(hx + 1.4, hy + 0.2, 1.9 + big * 0.5, 3.4 + big), 'R')                                         # 둥근 빨판 입 (비스듬히 본)
    c.fill(ell(hx + 1.9, hy + 0.2, 1.0 + big * 0.4, 2.2 + big), 'k')
    for (dx, dy) in ((1.6, -2.4 - big), (2.6, -1.0), (2.6, 1.4), (1.6, 2.8 + big)): c.set(hx + dx, hy + dy, 'w')   # 빙 둘린 이빨
    c.only(ell(hx + 0.6, hy + 0.2, 0.8, 3.2), 'r', 'R')
    if opt == 'B':
        for u in (0.12, 0.27, 0.42, 0.55, 0.68, 0.8):                                                         # 빛나는 하늘빛 점 (등을 따라)
            (x, y), (tx, ty) = at_path(pts, u); nx, ny = -ty, tx
            c.only({(int(x - nx * 1.4), int(y - ny * 1.4))}, 'G', 'CQc')
        for u in (0.2, 0.48, 0.74): (x, y), (tx, ty) = at_path(pts, u); c.only({(int(x + (-ty) * 1.2), int(y + tx * 1.2))}, 'G', 'CQc')
    return c


for opt, pal, lab, desc in (('A', P2A, 'A 창백한 동굴 거머리', '빛을 못 본 창백한 분홍빛 몸 · 꼬리로 땅을 짚고 몸을 물음표처럼 세운다 · 몸을 두른 마디 줄 · 둥근 빨판 입에 빙 둘린 하얀 이빨 · 덮쳐 피를 빤다'),
                            ('B', P2B, 'B 빛 점 거머리', '먹빛 남색 몸의 등과 옆구리에 하늘빛으로 빛나는 점 · 몸을 세운 동굴 거머리 · 하늘빛 빨판 입과 이빨')):
    fr = {m: leech(m, opt) for m in ('idle0', 'idle1', 'bite', 'squash', 'stretch')}
    B2.add('caveleech' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, (23, 9), 9, gm={m: fr[m] for m in ('bite', 'squash', 'stretch')})
B2.dump()

# ═══════════ 3. 석상 파수꾼 (사람꼴 · ms 1.25) ═══════════
ACT3 = {'atk': ['thrust', 'side'], 'skl': ['smash'], 'tk': 1.2,
        'fx': {'atk': {'pal': 'earth', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'water', 'hit': 'stun', 'big': 1, 'after': 'bubbles', 'shake': 2}}}
B3 = Batch('aq3_statue', 'ruinguard', ACT3, 'sewer', show=[['thrust', 4], ['smash', 5]], ms=1.25)
B3.extra = head_js('aqspear', """
Q
Q
M
M
m
""", '청동 창 (녹청 청동 병사상): 긴 자루 끝의 가늘고 긴 청동 날', L=7.0, shaft='c', below=3.5, fxw='lance')
OY = 2
def Y(v): return v + OY


def plinth(c, xs, top=30.2):
    """발에 붙은 깨진 받침돌 조각 (석상)"""
    for (x, far) in xs:
        b = rbox(x - 2.8, Y(top), x + 3.2, Y(31.8), 0.4); c.fill(b, 's' if far else 'S')
        if not far:
            c.only(thins([(x - 2.6, Y(top)), (x + 3.0, Y(top))]), 'T', 'S'); c.set(x + 3.2, Y(top + 0.6), '.'); c.set(x - 2.8, Y(31.6), '.')


P3A = {'C': '#9a7e4a', 'Q': '#c8a868', 'c': '#6a5430', 'd': '#46381e', 'P': '#5aa890', 'p': '#3a7a66', 'M': '#d8b45a', 'm': '#a8823a',
       'S': '#8a8478', 's': '#5e5a52', 'T': '#b4ae9e', 'E': '#7af0ff', 'k': '#141210'}


def bronze():
    c = Cv(32, 40)
    plinth(c, ((12.4, True), (17.8, False)))
    for (x, ch) in ((12.4, 'c'), (17.8, 'C')):                                                                   # 다리 · 정강이받이
        c.fill(rbox(x - 1.5, Y(22.6), x + 1.5, Y(30.0), 0.6), ch); c.fill(rbox(x - 1.6, Y(29.0), x + 2.6, Y(30.4), 0.4), ch)
    c.fill(hem(poly([(9.8, Y(19.4)), (20.6, Y(19.4)), (21.2, Y(24.2)), (9.2, Y(24.2))]), Y(23.4), [10.8, 13.0, 15.2, 17.4, 19.6], 0.8), 'C')   # 띠 치마
    c.fill(rbox(10.2, Y(10.4), 20.4, Y(20.0), 1.2), 'C')                                                          # 띠 갑옷 몸통
    c.fill(rbox(12.4, Y(1.8), 19.8, Y(6.4), 2.6), 'C'); c.fill(box(15.4, Y(1.0), 16.4, Y(1.8)), 'C')                  # 둥근 투구 (볏 없이 꼭지 하나)
    c.fill(poly([(12.0, Y(5.0)), (14.6, Y(5.0)), (14.6, Y(8.0)), (11.0, Y(7.6))]), 'C')                             # 목가리개 (뒤로 벌어짐)
    c.fill(rbox(14.8, Y(5.6), 19.6, Y(10.0), 1.0), 'Q')                                                           # 청동 얼굴
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(thins([(12.2, Y(5.4)), (20.2, Y(5.4))]), 'd')                                                         # 투구 챙
    c.fill(box(15.0, Y(6.0), 16.0, Y(9.6)), 'c')                                                                 # 볼가리개
    c.fill(box(17.8, Y(6.8), 18.8, Y(6.8)), 'E'); c.set(19.8, Y(7.6), 'c'); c.fill(thins([(17.6, Y(8.8)), (19.0, Y(8.8))]), 'd')   # 빈 눈의 빛 · 코 · 입
    for y in (12.8, 15.0, 17.2): c.only(thins([(10.4, Y(y)), (20.2, Y(y))]), 'c', 'CQ')                           # 갑옷 띠 (가로)
    c.fill(ell(19.0, Y(11.6), 2.4, 1.6), 'Q'); c.only(thins([(16.8, Y(12.2)), (21.2, Y(12.2))]), 'c', 'Q')           # 어깨받이
    for (x, y0, y1) in ((13.2, 2.0, 4.6), (17.6, 2.2, 4.0), (11.4, 12.0, 15.6), (14.6, 20.2, 23.0), (12.0, 23.4, 27.0)):
        c.only(thins([(x, Y(y0)), (x, Y(y1))]), 'P', 'CQc')                                                      # 흘러내린 녹청 줄
    sh = rbox(14.6, Y(12.4), 22.6, Y(27.4), 1.4)                                                                  # 앞으로 든 긴 방패 (스쿠툼) — 녹청 면 · 청동 테
    c.fill(sh, 'P')
    c.only(rbox(19.8, Y(12.4), 22.6, Y(27.4), 1.0), 'p', 'P')                                                     # 휜 면의 그늘 (오른쪽)
    rimc = {(x, y) for (x, y) in sh if any((x + dx, y + dy) not in sh for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))}
    c.fill(rimc, 'M'); c.only({(x, y) for (x, y) in rimc if x >= 21}, 'm', 'M')
    c.fill(ell(18.4, Y(19.8), 1.9, 1.9), 'M'); c.set(17.8, Y(19.2), 'Q'); c.set(19.2, Y(20.6), 'm')                 # 가운데 둥근 돌기
    for (x, y0, y1) in ((16.6, 14.0, 16.4), (20.6, 22.6, 25.6)): c.only(thins([(x, Y(y0)), (x, Y(y1))]), 'p', 'P')
    return c


P3B = {'C': '#b4a284', 'Q': '#d8c8a8', 'c': '#86765c', 'd': '#5a4e3c', 'L': '#8a6a48', 'l': '#5e4630', 'S': '#9a948a', 'T': '#c8c2b6', 's': '#6a645c',
       'V': '#6a9a5a', 'E': '#7af0ff', 'k': '#141210'}


def telamon():
    c = Cv(34, 42)
    plinth(c, ((12.6, True), (18.4, False)))
    for (x, ch) in ((12.6, 'c'), (18.4, 'C')):                                                                   # 굵은 맨다리
        c.fill(path([(x, Y(20.6)), (x + 0.4, Y(25.0)), (x, Y(29.6))], 2.0, 1.5), ch); c.fill(rbox(x - 1.4, Y(28.8), x + 2.6, Y(30.4), 0.5), ch)
    c.fill(path([(10.0, Y(11.0)), (8.4, Y(7.0)), (9.0, Y(3.0))], 1.5, 1.3), 'c')                                   # 위로 든 먼 팔
    c.fill(rbox(9.4, Y(9.6), 21.6, Y(20.4), 2.4), 'C')                                                            # 맨 가슴
    c.fill(ell(19.4, Y(10.8), 2.8, 2.0), 'C')                                                                     # 앞 어깨
    c.fill(rbox(14.8, Y(3.4), 21.0, Y(9.8), 2.0), 'C')                                                            # 숙인 머리
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(hem(poly([(9.6, Y(18.8)), (21.4, Y(18.8)), (22.0, Y(23.4)), (9.0, Y(23.4))]), Y(22.6), [12.0, 15.4, 18.8], 1.0), 'L')   # 돌 허리천
    c.only(thins([(9.6, Y(19.2)), (21.4, Y(19.2))]), 'l', 'L'); c.only(thins([(15.0, Y(19.6)), (14.6, Y(22.6))]), 'l', 'L')
    c.only(thins([(11.8, Y(13.0)), (14.2, Y(14.0)), (16.6, Y(13.4)), (18.6, Y(14.2))]), 'c', 'CQ')                   # 가슴 근육 줄 (둥글게)
    c.fill(rbox(16.0, Y(7.0), 21.4, Y(11.0), 1.2), 'c')                                                           # 곱슬 돌 수염
    for (x, y) in ((16.8, Y(9.4)), (18.6, Y(10.0)), (20.4, Y(9.2))): c.set(x, y, 'd')
    c.fill(box(18.6, Y(5.6), 19.6, Y(5.6)), 'E'); c.fill(thins([(17.8, Y(4.8)), (20.4, Y(4.8))]), 'd')              # 빈 눈의 빛 · 눈두덩
    slab = rbox(3.6, Y(-1.6), 26.6, Y(0.6), 0.3) | poly([(5.6, Y(0.6)), (24.6, Y(0.6)), (22.0, Y(3.6)), (8.2, Y(3.6))])   # 머리와 먼 손으로 받친 깨진 기둥머리 (넓은 판 · 아래로 좁아짐)
    c.fill(slab, 'S'); c.only(thins([(3.8, Y(-1.6)), (26.4, Y(-1.6))]), 'T', 'S'); c.only(thins([(5.0, Y(0.6)), (25.2, Y(0.6))]), 's', 'S')
    c.only(thins([(7.6, Y(2.2)), (23.0, Y(2.2))]), 's', 'S'); c.only(thins([(8.4, Y(3.4)), (21.8, Y(3.4))]), 's', 'S')
    c.fill(poly([(24.2, Y(-1.8)), (27.2, Y(-1.8)), (27.2, Y(1.6)), (25.4, Y(0.8))]), '.'); c.fill(thins([(23.8, Y(-1.4)), (24.8, Y(0.4)), (23.6, Y(2.4))]), 's')   # 깨진 끝
    for (x, y0, y1) in ((10.0, -1.4, 0.4), (17.0, 1.0, 3.0)): c.only(thins([(x, Y(y0)), (x + 0.6, Y(y1))]), 's', 'ST')   # 금
    for (x, y, rx, ry) in ((7.0, Y(-1.4), 2.0, 0.6), (19.6, Y(3.2), 1.6, 0.5), (11.6, Y(18.0), 1.4, 0.8), (17.4, Y(27.4), 1.2, 1.0)): c.only(ell(x, y, rx, ry), 'V', 'CQcST')   # 이끼
    c.only(thins([(13.0, Y(14.6)), (12.0, Y(17.2))]), 'd', 'CQc')                                                 # 금 간 자리
    return c


for opt, fn, pal, lab, desc, wpn, sh, ax, hip, hand, idle in (
        ('A', bronze, P3A, 'A 녹청 청동 병사상', '옛 제국 병사의 청동상 · 꼭지 하나 달린 둥근 투구(볏 없음)와 뒤로 벌어진 목가리개 · 빈 눈에 남은 희미한 하늘빛 · 앞으로 든 긴 방패(가운데 둥근 돌기) · 띠 갑옷 · 흘러내린 녹청 줄 · 발에 붙은 깨진 받침돌 · 긴 창으로 찌른다',
         'aqspear', (20, Y(12)), 15, Y(22), 'C', {'h': [2, 2], 'a': -75}),
        ('B', telamon, P3B, 'B 기둥 짊어진 석상', '수로 천장을 받치던 사암 석상 · 숙인 머리와 위로 든 먼 팔로 깨진 기둥머리를 받친 채 걷는다 · 곱슬 돌 수염 · 빈 눈의 하늘빛 · 돌 허리천 · 이끼와 금 · 발에 붙은 깨진 받침돌 · 큰 돌주먹',
         'rfist', (21, Y(11)), 16, Y(21), 'C', {'h': [1, 3], 'a': 80})):
    B3.add('aqsentinel' + ('' if opt == 'A' else '_b'), lab, desc, fn(), pal, sh, ax, hip, wpn=wpn, arm=['C', 'c'], hand=hand, idle=idle)
B3.dump()

# ═══════════ 4. 독이끼 덩굴 (noArm · 휘감기 · 포자 뿜기) ═══════════
ACT4 = {'atk': ['qbite'], 'skl': ['wspit'], 'tk': 1.1,
        'fx': {'atk': {'pal': 'nature', 'hit': 'claw'}, 'skl': {'pal': 'poison', 'hit': 'poison', 'p': 'orb', 'big': 1, 'after': 'smoke'}}}
B4 = Batch('aq3_vine', 'swampthing', ACT4, 'sewer', show=[['qbite', 4], ['wspit', 4]], still=1, noArm=1, wpn='none')
P4A = {'C': '#4a7a3a', 'Q': '#7aa85a', 'c': '#2e5226', 'd': '#1c3418', 'L': '#5e9a44', 'l': '#3e6e2e', 'V': '#9a5ac8', 'v': '#6a3a98', 'U': '#d0a0f0',
       'Y': '#e8e070', 'k': '#1a0c22', 'B': '#6a4a2c', 'b': '#46301c'}
P4B = {'C': '#3e6a34', 'Q': '#6a9a52', 'c': '#264a20', 'd': '#163014', 'L': '#5e9a44', 'V': '#9a5ac8', 'v': '#6a3a98', 'U': '#d0a0f0',
       'G': '#b8f04a', 'k': '#0c140a', 'B': '#5a4028', 'b': '#3a2818'}


def bell(c, x, y, s, ang=0.0, open_=0.0, ch='V'):
    """아래로 늘어진 종꽃 (x, y = 꽃자루가 붙는 자리, ang = 기울기 · 오른쪽 +): 둥근 꽃 등 · 벌어진 꽃잎 끝 · 어두운 꽃 입 · 노란 꽃술"""
    ca, sa = math.cos(ang), math.sin(ang)
    T = lambda u, v: (x + u * ca - v * sa, y + u * sa + v * ca)     # u 옆, v 아래
    f = 1.0 + open_ * 0.25
    out = [T(-0.9 * s, 0), T(0.9 * s, 0), T(1.7 * s, 1.2 * s), T(2.1 * s * f, 3.2 * s), T(2.8 * s * f, 4.5 * s), T(1.4 * s * f, 4.1 * s), T(0.0, 4.7 * s),
           T(-1.4 * s * f, 4.1 * s), T(-2.8 * s * f, 4.5 * s), T(-2.1 * s * f, 3.2 * s), T(-1.7 * s, 1.2 * s)]
    c.fill(poly(out), ch)
    c.only(poly([T(-0.7 * s, 0.6 * s), T(-1.6 * s, 1.6 * s), T(-1.9 * s * f, 3.4 * s), T(-1.0 * s, 3.4 * s), T(-0.4 * s, 1.4 * s)]), 'U', ch)   # 왼쪽 빛
    c.only(poly([T(1.1 * s, 1.0 * s), T(1.8 * s * f, 3.4 * s), T(2.4 * s * f, 4.2 * s), T(1.2 * s, 3.4 * s)]), 'v', ch)                      # 오른쪽 그늘
    c.fill(poly([T(-1.8 * s * f, 3.8 * s), T(1.8 * s * f, 3.8 * s), T(1.0 * s * f, 4.3 * s + open_), T(-1.0 * s * f, 4.3 * s + open_)]), 'k')  # 꽃 입
    for u in (-0.7, 0.0, 0.7): c.fill(thin(T(u * s, 4.3 * s), T(u * s * 1.2, 5.4 * s + open_)), 'Y')                                           # 늘어진 꽃술


def vine(mode, opt):
    c = Cv(32, 32); gy = 30.0
    lean = {'idle0': 0.0, 'idle1': 0.6, 'bite': 2.8, 'swell': -0.8, 'spit': 1.2}[mode]
    if opt == 'A':
        c.fill(ell(10.0, gy - 1.2, 7.0, 1.6), 'B'); c.only(ell(10.0, gy - 0.6, 6.0, 0.7), 'b', 'B')                   # 뿌리 덩이
        for (p0, p1) in (((9.0, gy - 2.2), (2.0, gy - 4.6)), ((11.0, gy - 2.2), (17.6, gy - 4.2))):                   # 땅에 누운 넓은 잎 둘
            leaf = path([p0, ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 1.2), p1], 1.6, 0.5)
            c.fill(leaf, 'L'); c.only(thins([p0, ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - 0.9), p1]), 'v', 'L')
        stem = qb((10.0, gy - 2.4), (8.0 + lean * 0.3, gy - 26.0), (20.6 + lean, gy - 19.6), 14)
        c.fill(tube(stem, lerp_r([2.0, 1.6, 1.1], 14)), 'C')
        blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        for u in (0.2, 0.36, 0.52, 0.68):                                                                                # 줄기 가시
            (x, y), (tx, ty) = at_path(stem, u); c.set(x - ty * 2.0, y + tx * 2.0, 'd')
        (x1, y1), _ = at_path(stem, 0.6)                                                                                 # 다문 꽃봉오리
        c.fill(path([(x1, y1 + 1.0), (x1 + 0.2, y1 + 2.4)], 0.4), 'c'); c.fill(ell(x1 + 0.3, y1 + 3.6, 1.0, 1.5), 'V'); c.set(x1, y1 + 3.0, 'U')
        tip = stem[-1]
        bell(c, tip[0] + 0.8, tip[1] + 0.2, 1.55, 0.38 + lean * 0.05, 1.0 if mode in ('bite', 'spit') else 0.0)        # 끝의 큰 종꽃
        cx0, cy0 = at_path(stem, 0.3)[0]; c.fill(thins([(cx0 - 1.6, cy0), (cx0 - 3.6, cy0 - 1.4), (cx0 - 4.0, cy0 - 3.0), (cx0 - 2.8, cy0 - 3.6)]), 'c')   # 덩굴손 한 가닥
        if mode in ('swell', 'spit'):
            for (x, y) in ((tip[0] + 6.4, tip[1] + 7.4), (tip[0] + 4.6, tip[1] + 9.2), (tip[0] + 7.8, tip[1] + 9.4)):
                c.fill(box(x, y, x + 0.8, y + 0.8), 'Y')                                                               # 독 포자
    else:
        c.fill(ell(12.0, gy - 1.2, 9.0, 1.8), 'B'); c.only(ell(12.0, gy - 0.6, 8.0, 0.8), 'b', 'B')                   # 갈라진 땅
        for (x0, x1) in ((4.0, 1.2), (20.0, 23.0)): c.fill(path([(x0, gy - 1.6), (x1, gy - 0.2)], 0.9, 0.5), 'B')        # 뻗은 뿌리
        c.fill(ell(12.0, gy - 5.6, 6.6, 4.6), 'C')                                                                     # 덩굴 손바닥
        fingers = [((7.0, gy - 7.0), (4.4 + lean * 0.3, gy - 14.0), (7.0 + lean, gy - 19.4)),
                   ((10.0, gy - 8.6), (9.0 + lean * 0.3, gy - 17.0), (12.6 + lean, gy - 22.0)),
                   ((13.6, gy - 8.6), (14.6 + lean * 0.3, gy - 16.0), (18.0 + lean, gy - 19.6)),
                   ((17.0, gy - 6.6), (21.0 + lean * 0.3, gy - 10.6), (23.6 + lean, gy - 13.6))]
        F = []
        for (a, m, b) in fingers:
            pts = qb(a, m, b, 8); F.append(pts); c.fill(tube(pts, lerp_r([1.8, 1.3, 0.8], 8)), 'C')                  # 휘어 오르는 덩굴 손가락 넷
        blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        for (x0, y0, x1, y1) in ((6.6, gy - 8.4, 15.6, gy - 3.0), (9.4, gy - 9.6, 17.8, gy - 4.6)):
            c.only(thins([(x0, y0), (x1, y1)]), 'd', 'CQc')                                                            # 꼬인 덩굴 줄 (나란히)
        for pts in F:
            (x, y), (tx, ty) = at_path(pts, 0.45); c.set(x + ty * 1.6, y - tx * 1.6, 'd')                              # 가시
            (x, y), (tx, ty) = at_path(pts, 0.3); lf = path([(x - ty * 0.6, y + tx * 0.6), (x - ty * 2.6, y + tx * 2.6 - 0.6)], 0.8, 0.4); c.under(lf, 'L')   # 작은 잎
            bx, by = pts[-1]
            c.fill(ell(bx, by - 0.6, 1.4, 1.8), 'V'); c.set(bx - 0.6, by - 1.4, 'U'); c.set(bx + 0.6, by - 0.2, 'v')   # 손끝의 보라 독 봉오리
            c.set(bx, by - 2.6, 'G')                                                                                   # 봉오리 끝 빛
            if mode in ('swell', 'spit'): c.fill(box(bx - 0.4, by - 4.4, bx + 0.4, by - 3.6), 'G')
        for (x, y) in ((10.0, gy - 4.0), (14.6, gy - 5.0)): c.set(x, y, 'V')
        c.fill(box(18.4 + lean, gy - 11.6, 18.8 + lean, gy - 10.6), 'G')                                              # 떨어지는 독 즙
    return c


for opt, pal, lab, desc in (('A', P4A, 'A 독꽃 덩굴', '뿌리 덩이에서 솟아 활처럼 휜 가시 덩굴 줄기 · 땅에 누운 보라 잎맥 잎 · 다문 꽃봉오리와 끝의 큰 보라 종꽃(어두운 꽃 입 · 늘어진 노란 꽃술) · 몸을 굽혀 덮치고 독 포자를 뿜는다'),
                            ('B', P4B, 'B 덩굴 손', '갈라진 땅에서 솟은 꼬인 덩굴 손 · 휘어 오르는 덩굴 손가락 넷에 가시와 작은 잎 · 손끝마다 보라 독 봉오리 · 움켜쥐고 독 즙을 튕긴다')):
    fr = {m: vine(m, opt) for m in ('idle0', 'idle1', 'bite', 'swell', 'spit')}
    B4.add('poisonvine' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, (23, 17) if opt == 'A' else (13, 8), 11, gm={m: fr[m] for m in ('bite', 'swell', 'spit')})
B4.dump()

# ═══════════ 5. 눈먼 동굴어 (떠다님 · noArm) ═══════════
ACT5 = {'atk': ['bswoop'], 'mag': ['wspit'], 'skl': ['wspit'], 'tk': 0.95,
        'fx': {'atk': {'pal': 'water', 'hit': 'bite'}, 'mag': {'pal': 'water', 'hit': 'burst', 'p': 'orb'}, 'skl': {'pal': 'ice', 'hit': 'shatter', 'p': 'shard', 'big': 1, 'after': 'bubbles'}}}
B5 = Batch('aq3_fish', 'sewerrat', ACT5, 'sewer', show=[['bswoop', 4], ['wspit', 4]], still=1, noArm=1, wpn='none', float=1)
P5A = {'C': '#ecc8c8', 'Q': '#fae6e4', 'c': '#c09898', 'd': '#8a6a6a', 'g': '#c88a98', 'r': '#d6a2aa', 'F': '#f2e0e0', 'f': '#cfb0b6',
       'k': '#3a1a24', 'R': '#c86a7a', 'w': '#ffffff'}
P5B = {'C': '#5e6654', 'Q': '#808a72', 'c': '#3e4438', 'd': '#2a2e26', 'P': '#a8aa94', 'p': '#868872', 'F': '#4e5446', 'f': '#363a30',
       'V': '#7a9a4a', 'e': '#c0c8c0', 'k': '#141614', 'R': '#a85a5a', 'W': '#a8e8ff', 'w': '#e8ece4'}


def fish_a(mode):
    c = Cv(32, 22); cy = 10.0 + (0.6 if mode == 'idle1' else 0); op = mode in ('bite', 'spit'); sw = 1.0 if mode == 'idle1' else 0.0
    c.fill(poly([(6.4, cy - 0.6), (1.2, cy - 4.8 - sw), (2.8, cy - 0.2), (1.2, cy + 4.6 + sw), (6.4, cy + 0.8)]), 'F')     # 갈라진 꼬리지느러미
    c.fill(poly([(9.6, cy - 3.6), (12.2, cy - 7.0), (16.4, cy - 6.6), (17.6, cy - 3.8)]), 'F')                          # 등지느러미
    c.fill(poly([(8.6, cy + 3.4), (10.4, cy + 6.4), (12.8, cy + 3.8)]), 'F'); c.fill(poly([(15.0, cy + 3.8), (16.8, cy + 6.6), (18.4, cy + 3.6)]), 'F')
    for (a, b) in (((3.6, cy - 1.0), (2.0, cy - 3.8)), ((3.6, cy + 1.0), (2.0, cy + 3.6)), ((13.0, cy - 4.0), (13.6, cy - 6.4)), ((15.4, cy - 4.0), (16.2, cy - 6.2))):
        c.only(thin(a, b), 'f', 'F')                                                                             # 지느러미 살 (나란히)
    body = ell(14.0, cy, 9.2, 4.4) | ell(21.2, cy + 0.2, 4.4, 4.1) | ell(24.4, cy + 0.6, 2.4, 2.8)
    c.fill(body, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.only(ell(13.2, cy + 1.4, 4.2, 1.6), 'g', 'CQc')                                                               # 비치는 속 (내장 그림자)
    c.only(thins([(6.6, cy - 1.0), (18.6, cy - 1.4)]), 'r', 'CQc')                                                  # 비치는 등뼈 (한 줄)
    c.only(thins([(19.4, cy - 2.8), (18.8, cy - 1.0), (18.8, cy + 1.2), (19.6, cy + 3.0)]), 'r', 'CQc')                # 아가미 줄
    c.fill(poly([(20.4, cy + 1.6), (17.6, cy + 3.6), (18.6, cy + 1.2)]), 'F')                                       # 가슴지느러미
    c.only({(23, int(cy - 1.8)), (24, int(cy - 1.8))}, 'Q', 'CQc')                                                 # 눈이 없는 매끈한 자리
    if op:
        c.fill(poly([(23.6, cy + 1.0), (27.4, cy + 0.4), (27.0, cy + 3.4), (23.6, cy + 2.6)]), 'k'); c.fill(box(24.4, cy + 2.0, 25.6, cy + 2.6), 'R')
        for x in (25.0, 26.4): c.set(x, cy + 1.0, 'w')
    else:
        c.fill(thins([(23.6, cy + 1.4), (26.6, cy + 1.2)]), 'd')
    if mode == 'swell': c.fill(box(27.0, cy + 0.6, 27.8, cy + 1.4), 'w')
    if mode == 'spit': c.fill(path([(27.8, cy + 1.6), (30.6, cy + 2.4)], 0.9, 0.5), 'w')
    return c


def fish_b(mode):
    c = Cv(36, 24); cy = 11.0 + (0.6 if mode == 'idle1' else 0); op = mode in ('bite', 'spit'); sw = 1.0 if mode == 'idle1' else 0.0
    c.fill(ell(3.6, cy + 0.2 - sw * 0.4, 2.6, 3.4), 'F')                                                         # 둥근 꼬리지느러미
    c.fill(poly([(15.0, cy - 3.2), (16.6, cy - 6.2), (18.8, cy - 3.6)]), 'F')                                        # 작은 등지느러미
    c.fill(poly([(5.6, cy + 1.8), (14.6, cy + 2.6), (13.2, cy + 5.0), (6.0, cy + 4.0)]), 'F')                          # 긴 뒷지느러미
    body = tube([(4.6, cy + 0.4), (10.0, cy + 0.3), (16.0, cy + 0.2), (20.0, cy + 0.4)], [1.9, 2.8, 3.5, 3.9]) | ell(24.4, cy + 0.8, 5.6, 3.4)
    c.fill(body, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.only({(x, y) for (x, y) in ell(23.6, cy + 2.6, 5.4, 1.4) if x > 18}, 'P', 'CQc')                              # 밝은 턱 밑
    for (x, y) in ((8.0, cy - 1.0), (11.4, cy - 2.0), (14.4, cy - 0.6), (18.0, cy - 2.4), (21.4, cy - 1.0), (11.0, cy + 1.0)): c.only(ell(x, y, 1.0, 0.7), 'd', 'CQc')   # 얼룩
    for (x, y) in ((10.0, cy - 2.4), (19.6, cy - 3.0)): c.only(ell(x, y, 1.2, 0.6), 'V', 'CQc')                    # 이끼
    c.set(25.6, cy - 1.0, 'e')                                                                                    # 작고 흐린 먼 눈
    if op:
        c.fill(poly([(25.0, cy + 1.6), (30.4, cy + 1.0), (29.8, cy + 4.0), (25.0, cy + 3.0)]), 'k'); c.fill(box(26.4, cy + 2.4, 28.0, cy + 3.0), 'R')
    else:
        c.fill(thins([(25.0, cy + 2.0), (29.6, cy + 1.6)]), 'd')
    for (pts, r) in (([(29.2, cy + 0.6), (31.6, cy - 1.4), (31.6, cy - 4.4), (29.6, cy - 6.6), (27.0, cy - 7.4)], 0.5),   # 위로 휘어 올라간 긴 더듬이 수염
                     ([(28.6, cy + 2.4), (31.4, cy + 3.6), (32.8, cy + 6.0), (32.0, cy + 8.0)], 0.45),                      # 앞으로 늘어진 수염
                     ([(26.6, cy + 3.4), (27.2, cy + 5.6), (26.2, cy + 7.2)], 0.4)):                                         # 짧은 턱수염
        c.fill(path(pts, r), 'p')
    if mode == 'swell': c.fill(box(31.0, cy + 1.6, 31.8, cy + 2.4), 'W')
    if mode == 'spit': c.fill(path([(31.4, cy + 2.6), (34.4, cy + 3.4)], 0.9, 0.5), 'W')
    return c


for opt, fn, pal, lab, desc in (('A', fish_a, P5A, 'A 창백한 눈먼 물고기', '눈이 없는 창백한 분홍빛 동굴 물고기 · 속이 비치는 몸에 등뼈 한 줄과 내장 그림자 · 아가미 줄 · 비치는 지느러미 · 물이 찬 길을 헤엄치듯 떠다니며 문다'),
                                ('B', fish_b, P5B, 'B 더듬이 메기', '넓적한 머리의 잿빛 동굴 메기 · 작고 흐린 먼 눈 · 얼룩과 등의 이끼 · 길게 뒤로 휜 수염 셋 · 넓은 입으로 덮치고 물을 뿜는다')):
    fr = {m: fn(m) for m in ('idle0', 'idle1', 'bite', 'swell', 'spit')}
    B5.add('blindfish' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, (25, 11) if opt == 'A' else (29, 13), 14, pad=5, gm={m: fr[m] for m in ('bite', 'swell', 'spit')})
B5.dump()

# ═══════════ 6. 수문장 (구역 주인 · ms 1.5 · 큰 돌주먹 / 삼지창) ═══════════
ACT6 = {'atk': ['side', 'down'], 'skl': ['smash'], 'tk': 1.35,
        'fx': {'atk': {'pal': 'earth', 'hit': 'star', 'big': 2}, 'skl': {'pal': 'water', 'hit': 'quake', 'big': 2, 'after': 'bubbles', 'aoe': 'flood', 'shake': 4}}}
B6 = Batch('aq3_boss', 'sewertroll', ACT6, 'sewer', 'dungeon', show=[['side', 4], ['smash', 5]], ms=1.5, mx=20, my=20, wpn='rfist')
B6.extra = head_js('aqtrident', """
Q...M
M.Q.m
M.M.m
.MMm.
..m..
""", '청동 삼지창 (청동 수문장): 바깥 두 갈래가 휘어 벌어진 세 갈래 날', L=8.0, shaft='c', below=4.0, fxw='trident')
GY6 = 51


def legs6(c, xf, xn, top, w, far='c', near='C', foot=3.4):
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, GY6 - 1.6, 0.8), ch); c.fill(rbox(x - w / 2 - 0.6, GY6 - 2.6, x + w / 2 + foot, GY6, 0.6), ch)


def far_arm6(c, ch='c'):
    c.fill(path([(13.4, 20.4), (10.6, 27.4), (10.2, 33.4)], 3.0, 2.7), ch); c.fill(rbox(6.6, 32.4, 14.0, 39.0, 1.6), ch)


def water(c, pts, r0, r1, hi=True):
    c.fill(path(pts, r0, r1), 'W')
    if hi: c.only(thins(pts[:-1]), 'w', 'W')


P6A = {'C': '#8a8478', 'Q': '#b4ae9e', 'c': '#5e5a50', 'd': '#3c3a34', 'J': '#7a5a3a', 'j': '#4e3a24', 'I': '#a07a52', 'N': '#4a4e56', 'n': '#2e3238',
       'W': '#7ad0f8', 'w': '#e0f8ff', 'V': '#6a9a5a', 'E': '#7af0ff', 'k': '#141210', 'D': '#1e2226'}


def gate_giant():
    c = Cv(50, 56)
    legs6(c, 19.0, 28.6, 37.0, 6.4)
    far_arm6(c)
    c.fill(ell(13.4, 18.6, 5.0, 3.8), 'c'); c.fill(ell(35.0, 18.6, 5.2, 4.0), 'C')                                   # 큰 돌 어깨
    c.fill(rbox(11.6, 14.6, 36.4, 38.4, 1.4), 'C')                                                                 # 돌 수문 틀 몸통
    c.fill(rbox(19.4, 6.6, 29.0, 15.4, 2.2), 'C')                                                                  # 어깨 사이에 묻힌 돌 머리
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(thins([(19.6, 9.6), (28.8, 9.6)]), 'd'); c.fill(box(22.6, 10.6, 24.0, 11.4), 'E'); c.fill(box(26.2, 10.6, 27.6, 11.4), 'E')   # 무거운 눈두덩 · 하늘빛 두 눈
    gate = rbox(15.4, 18.0, 32.6, 30.0, 0.4)
    c.fill(gate, 'J'); blunt(c.g, 'J', 'I', 'j', bottom=1, side=0)                                                 # 반쯤 들린 나무 수문 (가로 널)
    for y in (21.0, 24.0, 27.0): c.only(thins([(17.6, y), (30.4, y)]), 'j', 'JI')
    for x in (16.0, 31.6): c.fill(box(x, 18.0, x + 0.8, 30.0), 'N')                                                # 양옆 쇠 띠 (세로)
    for x in (16.0, 31.6):
        for y in (19.4, 23.0, 26.6): c.set(x + 0.4, y, 'n')                                                        # 리벳
    c.fill(box(15.4, 30.4, 32.6, 34.6), 'D')                                                                       # 수문 아래 열린 틈
    c.fill(box(15.6, 33.0, 32.6, 34.4), 'W'); c.only(thins([(15.6, 33.0), (32.6, 33.0)]), 'w', 'W')                  # 틈 안을 흐르는 물
    water(c, [(32.4, 33.6), (36.4, 34.0), (39.8, 37.4), (41.4, 43.2), (41.8, 50.4)], 2.0, 1.2)                        # 틈에서 쏟아져 나와 앞으로 휘어 떨어지는 물
    for (x, y) in ((33.4, 31.8), (35.2, 32.0), (34.2, 30.8)): c.set(x, y, 'w')                                      # 물거품
    c.fill(ell(41.8, 50.6, 3.2, 0.9), 'W')
    for (x, y) in ((38.4, 49.6), (45.2, 49.8), (44.4, 47.6)): c.set(x, y, 'w')                                       # 물보라
    c.fill(thins([(15.4, 17.6), (32.6, 17.6)]), 'd')                                                               # 수문 위 틀 줄
    for (x, y, rx, ry) in ((19.8, 6.8, 2.0, 0.8), (36.2, 15.8, 2.4, 0.9), (11.0, 16.4, 1.8, 0.8), (28.0, 49.6, 2.6, 0.7), (12.6, 36.6, 1.4, 1.0)): c.only(ell(x, y, rx, ry), 'V', 'CQc')   # 이끼
    for x in (21.0, 27.4): c.fill(path([(x, 38.4), (x + 0.2, 41.0)], 0.4), 'W')                                     # 틀 아래로 떨어지는 물방울 줄
    return c


P6B = {'C': '#a09684', 'Q': '#c8bea8', 'c': '#726a5a', 'd': '#4a4438', 'W': '#7ad0f8', 'w': '#e0f8ff', 'V': '#6a9a5a', 'E': '#7af0ff', 'k': '#141210', 'D': '#24221e'}


def arch_cells(x0, x1, y_top, y_bot):
    """둥근 위 아치 구멍 (x0~x1, 위 끝 y_top, 아래 y_bot)"""
    r = (x1 - x0) / 2; cx = (x0 + x1) / 2; cy = y_top + r
    return {(x, y) for y in range(int(y_top), int(y_bot) + 1) for x in range(int(x0), int(x1) + 1)
            if (y + 0.5 >= cy) or ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r)}


def aqueduct_giant():
    c = Cv(50, 56)
    far_arm6(c)
    for (x0, x1, ch) in ((13.6, 21.4, 'c'), (27.0, 35.0, 'C')):                                                    # 수도교 기둥 다리
        c.fill(rbox(x0, 33.0, x1, GY6, 0.4), ch)
    c.fill(rbox(10.4, 13.4, 38.0, 36.0, 1.0), 'C')                                                                 # 위 단 (몸통)
    c.fill(rbox(20.6, 4.6, 28.6, 12.6, 1.8), 'C')                                                                  # 작은 돌 머리
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(arch_cells(21.6, 26.8, 36.0, GY6), '.')                                                                 # 두 기둥 사이 큰 아치 (가랑이)
    c.fill(arch_cells(20.6, 27.8, 35.0, 36.4) - arch_cells(21.6, 26.8, 36.0, GY6), 'c')
    for (x0, x1) in ((12.6, 16.6), (21.8, 25.8), (31.0, 35.0)): c.fill(arch_cells(x0, x1, 21.0, 30.0), 'D')     # 위 단의 작은 아치 셋
    for y in (18.6, 31.6): c.only(thins([(10.6, y), (37.8, y)]), 'd', 'CQ')                                          # 단 줄 (가로)
    for y in (39.0, 44.0): c.only(thins([(13.8, y), (21.2, y)]) | thins([(27.2, y), (34.8, y)]), 'd', 'Cc')
    c.fill(rbox(8.6, 11.2, 39.8, 14.0, 0.4), 'c'); c.fill(box(9.4, 11.2, 39.0, 12.2), 'W'); c.only(thins([(9.4, 11.2), (39.0, 11.2)]), 'w', 'W')   # 어깨 위 돌 물길 · 흐르는 물
    water(c, [(8.8, 12.4), (7.8, 15.6), (7.4, 22.0), (7.6, 26.0)], 0.9, 0.6, False); water(c, [(39.6, 12.4), (40.8, 15.6), (41.2, 21.0)], 0.9, 0.6, False)   # 물길 양끝으로 떨어지는 물
    c.fill(box(23.2, 7.6, 24.4, 8.6), 'E'); c.fill(box(26.0, 7.6, 27.2, 8.6), 'E'); c.fill(thins([(22.6, 6.6), (27.6, 6.6)]), 'd')
    for (x, y, rx, ry) in ((21.6, 4.8, 1.8, 0.8), (12.6, 33.0, 1.6, 1.2), (36.0, 26.0, 1.4, 1.6), (31.0, 49.6, 2.2, 0.7), (18.0, 15.4, 1.6, 0.8)): c.only(ell(x, y, rx, ry), 'V', 'CQc')
    c.only(thins([(29.6, 16.0), (30.4, 18.4)]), 'd', 'CQ'); c.only(thins([(17.4, 34.4), (16.6, 37.6)]), 'd', 'Cc')       # 금
    return c


P6C = {'C': '#8e7a48', 'Q': '#c0a468', 'c': '#62522e', 'd': '#40361e', 'P': '#5aa890', 'p': '#3a7a66', 'G': '#d8b45a', 'g': '#a8843a', 'W': '#7ad0f8', 'w': '#e0f8ff',
       'E': '#7af0ff', 'k': '#141210', 'U': '#3a4a6a', 'u': '#22304a', 'M': '#b89a5a'}


def bronze_warden():
    c = Cv(50, 56)
    c.fill(poly([(13.0, 16.0), (19.0, 15.6), (17.4, 36.0), (14.6, 49.6), (2.6, 48.6), (4.2, 36.0), (8.0, 21.0)]), 'U'); blunt(c.g, 'U', 'U', 'u', bottom=1, side=0)   # 낡은 남빛 망토 (어깨에서 땅까지)
    for (a, b) in (((7.0, 30.0), (5.0, 46.0)), ((11.6, 34.0), (10.6, 47.6))): c.only(thin(a, b), 'u', 'U')   # 망토 주름 (세로)
    legs6(c, 19.4, 28.0, 37.0, 5.8)
    far_arm6(c)
    c.fill(hem(poly([(14.4, 31.6), (33.0, 31.6), (34.6, 40.6), (12.8, 40.6)]), 39.8, [15.6, 19.4, 23.2, 27.0, 30.8], 1.0), 'C')   # 띠 치마
    c.fill(poly([(13.0, 17.4), (34.8, 17.4), (34.2, 24.0), (31.4, 33.0), (16.2, 33.0), (13.6, 24.0)]), 'C')          # 청동 가슴판
    c.fill(rbox(20.4, 3.6, 30.2, 10.4, 3.4), 'C')                                                                  # 둥근 투구 (볏 없음)
    c.fill(rbox(21.4, 9.0, 29.4, 16.4, 1.4), 'M')                                                                  # 청동 얼굴
    c.fill(ell(13.8, 18.6, 4.6, 3.0), 'c'); c.fill(ell(33.8, 18.4, 5.2, 3.4), 'C')                                   # 어깨받이
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(box(21.4, 9.0, 23.2, 15.2), 'c')                                                                        # 볼가리개
    c.fill(thins([(20.2, 9.0), (30.4, 9.0)]), 'G')                                                                 # 투구 금빛 띠
    c.fill(box(25.4, 11.0, 26.4, 11.6), 'E'); c.fill(box(28.0, 11.0, 29.0, 11.6), 'E'); c.set(29.8, 12.8, 'c'); c.fill(thins([(26.0, 14.6), (28.8, 14.6)]), 'd')   # 빈 눈의 빛 · 코 · 입
    c.only(thins([(29.0, 15.6), (38.6, 15.6)]) | thins([(28.8, 19.6), (38.8, 19.6)]), 'G', 'CQc')                   # 어깨받이 금 테
    lx, ly = 28.4, 25.0
    lion = ell(lx, ly, 4.6, 4.4)                                                                                   # 가슴 앞쪽의 사자 머리 분수: 갈기 테 · 얼굴 · 벌린 입
    c.fill(lion, 'G')
    for k in range(10):
        a = k / 10 * 2 * math.pi; c.set(lx + math.cos(a) * 4.4, ly + math.sin(a) * 4.2, 'g')                       # 갈기 끝 (톱니처럼)
    c.fill(ell(lx + 0.2, ly + 0.2, 2.9, 2.8), 'M'); c.fill(box(lx - 1.4, ly - 1.2, lx - 0.8, ly - 0.6), 'k'); c.fill(box(lx + 1.2, ly - 1.2, lx + 1.8, ly - 0.6), 'k')
    c.fill(ell(lx + 0.2, ly + 1.8, 1.0, 0.6), 'g'); c.fill(ell(lx + 0.6, ly + 2.6, 1.4, 0.8), 'k')
    water(c, [(lx + 1.6, ly + 2.8), (lx + 5.0, ly + 2.4), (lx + 8.4, ly + 4.4), (lx + 10.0, ly + 9.0), (lx + 10.8, ly + 17.0), (lx + 11.0, 50.2)], 1.3, 0.8)   # 입에서 앞으로 솟았다 떨어지는 물줄기
    c.fill(ell(lx + 11.0, 50.4, 2.6, 0.7), 'W')
    for (x, y0, y1) in ((22.0, 4.2, 6.6), (27.0, 4.0, 5.6), (15.6, 22.0, 26.0), (31.6, 21.0, 23.6), (18.0, 34.0, 37.0), (27.0, 40.6, 46.0)):
        c.only(thins([(x, y0), (x, y1)]), 'P', 'CQcM')                                                             # 흘러내린 녹청 줄
    c.only(thins([(13.4, 17.6), (34.4, 17.6)]) | thins([(13.2, 40.2), (34.2, 40.2)]), 'G', 'CQc')                   # 금빛 테
    return c


for opt, fn, pal, lab, desc, wpn, idle in (
        ('A', gate_giant, P6A, 'A 수문 거인', '몸통이 돌 틀에 끼운 나무 수문인 돌 거인 · 가로 널과 양옆 쇠 띠 · 반쯤 들린 수문 아래 틈에서 물이 쏟아져 앞으로 휘어 떨어진다 · 어깨 사이에 묻힌 돌 머리의 하늘빛 눈 · 이끼 · 큰 돌주먹', 'rfist', {'h': [1, 4], 'a': 78}),
        ('B', aqueduct_giant, P6B, 'B 수도교 거인', '옛 수도교를 쌓아 만든 거인 · 두 기둥 다리 사이 큰 아치 · 몸통에 작은 아치 셋 · 어깨 위 돌 물길을 흐르다 양끝으로 떨어지는 물 · 작은 돌 머리 · 이끼와 금 · 큰 돌주먹', 'rfist', {'h': [1, 4], 'a': 78}),
        ('C', bronze_warden, P6C, 'C 청동 수문장', '녹청 낀 청동 갑주 거인 · 둥근 투구(볏 없음)와 청동 얼굴의 빈 눈 · 가슴의 금빛 사자 머리 분수(입에서 앞으로 휘어 떨어지는 물) · 금 테 어깨받이 · 낡은 남빛 망토 · 바깥 갈래가 휜 청동 삼지창', 'aqtrident', {'h': [1, 4], 'a': -72})):
    B6.add('sluicewarden' + ('' if opt == 'A' else '_' + opt.lower()), lab, desc, fn(), pal, (34, 21), 24, 36, arm=['C', 'c'], hand='C', idle=idle, wpn=wpn)
B6.dump()
