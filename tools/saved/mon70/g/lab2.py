"""지하수로 2구역 「연성 실험실」(Lv70) 몬스터 시안 — 11-17 23:3x 사용자 「지하 길부터 차례로」(2구역 → 3구역 → 통로 → 지하미궁)
일반 다섯은 A · B, 우두머리(던전 주인) 연성술사 「잿빛 장갑」은 A · B · C. 계획 문서 「하르겐 지하」 절의 몬스터 제안을 바탕으로.
- 호문쿨루스: A 플라스크 속 호문쿨루스(떠다님) · B 진흙 연금 인형(통통 뜀)
- 봉합 골렘: A 가죽 기운 골렘 · B 유리병 골렘(구리관 팔다리)
- 실패한 연성체: A 눈 여럿 살덩이 · B 녹아내린 연성체(붉은 핵)
- 실험실 간수: A 가죽 앞치마 간수(쇠가면 · 철퇴) · B 쇠 투구 간수(갈고리 장대)
- 연성술사 조수: A 고글 조수(초록 약병) · B 입마개 조수(약병 띠 · 보라 약병)
- 연성술사 「잿빛 장갑」: A 잿빛 외투 · B 연성 갑주(등의 유리 통) · C 하얀 가면(떠 있는 약병 셋)
피한 것: 목에 볼트 박힌 납작머리 괴물(유명한 봉합 괴물) · 큰 검은 눈 잿빛 외계인 · 꼽추 조수 · 십자 · 더하기 꼴 바느질(바늘땀은 지그재그 · 짧은 사선) · 별꼴 마법진(동그라미만)
python3 lab2.py → ../t/lab2.json"""
from kit import *

MODES = ['idle0', 'idle1', 'bite', 'swell', 'spit']

# ═══════════ 1. 호문쿨루스 (떠다니는 작은 것 · noArm) ═══════════
ACT1 = {'mag': ['wspit'], 'atk': ['bswoop'], 'skl': ['wspit'], 'tk': 0.9,
        'fx': {'mag': {'pal': 'poison', 'hit': 'poison', 'p': 'orb'}, 'atk': {'pal': 'poison', 'hit': 'star'},
               'skl': {'pal': 'poison', 'hit': 'poison', 'p': 'flask', 'big': 1, 'after': 'bubbles'}}}
B1 = Batch('lab2_homun', 'imp', ACT1, 'sewer', show=[['wspit', 4], ['bswoop', 4]], still=1, noArm=1, wpn='none', float=1)
P1A = {'g': '#d8f4f4', 'G': '#9ad8e0', 'L': '#6ad070', 'l': '#a8f08a', 'D': '#3a8a4a', 'O': '#a8743e', 'o': '#6e4822', 'S': '#f0c8c0', 's': '#c89890',
       'k': '#1a1420', 'w': '#ffffff', 'E': '#ffe070'}


def flask(mode):
    c = Cv(24, 28); t = {'idle0': 0.0, 'idle1': 0.6, 'bite': -0.2, 'swell': 0.0, 'spit': 0.4}[mode]
    cx, cy = 11.5, 15.4
    bulb = ell(cx, cy, 6.6, 6.2); neck = box(10.0, 5.4, 13.0, 9.6)
    c.fill(bulb | neck, 'g')                                                                                  # 유리 (옅은 빛)
    liquid = {(x, y) for (x, y) in bulb if y >= cy - 1.6 + (0.6 if t > 0.3 else 0) + (x - cx) * (0.12 if mode == 'idle1' else 0)}
    c.fill(liquid, 'L' if mode != 'swell' else 'l')                                                         # 초록 연성액
    c.only({(x, y) for (x, y) in liquid if y >= cy + 3.4}, 'D', 'Ll')
    for (x, y) in bulb | neck:                                                                              # 유리 테두리
        if any((x + a, y + b) not in (bulb | neck) for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))): c.set(x, y, 'G')
    c.fill(box(9.4, 3.0, 13.6, 5.4), 'O'); c.only(box(9.4, 3.0, 13.6, 3.6), 'o', 'O')                         # 코르크 마개
    if mode == 'spit':
        c.fill(box(9.4, 1.0, 13.6, 2.6), 'O'); c.fill(box(9.4, 3.0, 13.6, 5.4), '_'); c.fill(ell(14.6, 3.6, 1.6, 1.4), 'L')   # 마개가 튀고 연성액이 솟음
    # 속의 호문쿨루스 (웅크린 작은 몸 · 큰 머리)
    hx, hy = cx + 0.6, cy - 0.2 + (0.4 if mode == 'idle1' else 0)
    c.fill(ell(hx, hy, 3.0, 2.8), 'S'); c.fill(ell(hx - 1.0, hy + 3.4, 2.4, 1.6), 'S'); c.only(ell(hx - 1.4, hy + 4.0, 2.0, 1.0), 's', 'S')
    c.fill(box(hx - 0.4, hy - 0.4, hx + 0.4, hy + 0.4), 'k'); c.fill(box(hx + 1.6, hy - 0.4, hx + 2.2, hy + 0.4), 'k')   # 두 눈
    if mode in ('swell', 'spit'): c.set(hx - 0.4, hy - 0.4, 'E'); c.set(hx + 1.6, hy - 0.4, 'E')
    for (x, y) in ((cx - 3.6, cy + 1.0), (cx + 3.4, cy + 2.6), (cx - 1.6, cy + 4.6)): c.set(x, y + (0.6 if mode == 'idle1' else 0), 'w')   # 거품
    c.set(cx - 4.4, cy - 3.0, 'w'); c.set(cx - 3.6, cy - 4.0, 'w')                                          # 유리 반짝
    return c


P1B = {'C': '#b8744a', 'Q': '#d8996a', 'c': '#8a4e2e', 'd': '#5e321c', 'Y': '#ffd040', 'y': '#e89a20', 'k': '#2a140c', 'w': '#fff4d8', 'E': '#ffe070'}


def claydoll(mode):
    c = Cv(22, 24); sq = {'idle0': 0, 'idle1': 1, 'bite': 0, 'swell': 0, 'spit': 1}[mode]
    cx = 10.0; gy = 21.0
    c.fill(rbox(cx - 2.6, gy - 3.0, cx - 0.6, gy, 0.4), 'c'); c.fill(rbox(cx + 1.0, gy - 3.0, cx + 3.0, gy, 0.4), 'C')   # 짧은 다리
    body = ell(cx, gy - 6.4 + sq * 0.4, 4.6 + sq * 0.4, 4.2 - sq * 0.4)
    c.fill(body, 'C'); c.fill(ell(cx - 4.4, gy - 6.6, 1.4, 2.0), 'c'); c.fill(ell(cx + 4.6, gy - 6.0, 1.4, 2.0), 'C')   # 몽당 팔
    head = ell(cx + 0.6, gy - 13.4 + sq * 0.6, 5.0, 4.6)
    c.fill(head, 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    ring = ell(cx, gy - 6.4, 2.6, 2.6) - ell(cx, gy - 6.4, 1.6, 1.6)                                             # 가슴의 빛나는 연성 고리 (동그라미)
    c.fill(ring, 'Y' if mode != 'swell' else 'w'); c.set(cx, gy - 6.4, 'y')
    for (x, y) in ((cx + 2.0, gy - 13.8), (cx + 4.4, gy - 13.8)): c.fill(box(x, y + sq * 0.6, x + 0.8, y + 1.2 + sq * 0.6), 'k')   # 동그란 두 눈
    c.only(thins([(cx + 1.8, gy - 11.0 + sq * 0.6), (cx + 4.8, gy - 11.0 + sq * 0.6)]), 'd', 'CQc')                              # 입 (금 간 한 줄)
    c.only(thins([(cx - 3.4, gy - 15.6), (cx - 1.6, gy - 13.0)]) | thins([(cx - 2.0, gy - 5.0), (cx - 3.0, gy - 3.6)]), 'd', 'CQc')   # 마른 진흙 금
    if mode == 'spit': c.fill(box(cx + 6.0, gy - 12.0, cx + 7.0, gy - 11.0), 'Y')   # 뱉는 빛 (네모 — 둥근 작은 점은 더하기 꼴이 된다)
    return c


for opt, fn, pal, lab, desc, sh, ax, pad in (
        ('A', flask, P1A, 'A 플라스크 호문쿨루스', '코르크 막은 둥근 유리 플라스크 속 초록 연성액에 웅크린 분홍빛 작은 몸 · 큰 머리와 두 눈 · 거품 · 둥둥 떠다니다 마개를 튀기며 연성액을 쏜다', (17, 10), 12, 5),
        ('B', claydoll, P1B, 'B 진흙 연금 인형', '구운 진흙으로 빚은 머리 큰 꼬마 인형 · 가슴에 노랗게 빛나는 연성 고리(동그라미) · 동그란 두 눈 · 마른 진흙 금 · 몽당 팔다리로 통통 뛴다', (15, 9), 10, 0)):
    fr = {m: fn(m) for m in MODES}
    kw = {} if opt == 'A' else {'float': 0}
    B1.add('homunculus' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, sh, ax, pad=pad, gm={m: fr[m] for m in ('bite', 'swell', 'spit')}, **kw)
B1.dump()

# ═══════════ 2. 봉합 골렘 (사람꼴 · ms 1.25 · 돌주먹) ═══════════
ACT2 = {'atk': ['side', 'down'], 'skl': ['smash'], 'tk': 1.3,
        'fx': {'atk': {'pal': 'earth', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'poison', 'hit': 'quake', 'big': 1, 'after': 'dust', 'shake': 3}}}
B2 = Batch('lab2_golem', 'flesh', ACT2, 'sewer', show=[['side', 4], ['smash', 5]], ms=1.25, wpn='rfist')
GY2 = 39


def legs2(c, xf, xn, top, w, far='c', near='C', foot=2.6):
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, GY2 - 1.4, 0.6), ch); c.fill(rbox(x - w / 2 - 0.4, GY2 - 2.2, x + w / 2 + foot, GY2, 0.5), ch)


P2A = {'C': '#a07a50', 'Q': '#c89e70', 'c': '#6e5034', 'd': '#4a3420', 'P': '#7e8a5a', 'p': '#56603c', 'R': '#9a5a4a', 'r': '#6a3a30',
       'T': '#e8dcb8', 'M': '#a8a8b4', 'k': '#1a1410', 'E': '#ffd040', 'A': '#8a6644', 'a': '#5e4430'}


def seam(c, pts, on='CQcPpRr'):
    """바늘땀: 이음 줄(짙은 색) 위로 두 칸마다 짧은 사선 땀 (십자 · 더하기 꼴이 안 되게 가로 · 세로 땀은 안 씀)"""
    c.only(thins(pts), 'd', on)
    for i in range(len(pts) - 1):
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]; L = max(1, int(math.hypot(x1 - x0, y1 - y0)))
        for k in range(0, L, 2):
            t = k / L; x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t
            c.only({(int(x + 1), int(y - 1))}, 'T', on)


def leather():
    c = Cv(32, 40)
    legs2(c, 11.6, 18.4, 26.0, 4.2)
    c.fill(path([(9.0, 14.0), (7.0, 20.0), (6.6, 25.0)], 2.4, 2.2), 'c'); c.fill(rbox(4.0, 24.4, 10.0, 29.6, 1.6), 'c')   # 먼 팔 (가죽 장갑 주먹)
    c.fill(poly([(7.6, 12.0), (22.4, 11.0), (24.0, 17.0), (22.6, 27.4), (9.4, 27.4), (7.4, 18.0)]), 'C')                 # 큰 가죽 몸통
    c.fill(rbox(12.6, 3.0, 21.0, 11.4, 2.4), 'C')                                                                          # 자루 같은 작은 머리
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.only(poly([(8.0, 12.2), (14.6, 11.6), (13.6, 19.6), (8.0, 19.6)]), 'P', 'CQc')                                        # 덧댄 가죽 조각 (빛바랜 초록)
    c.only(poly([(16.4, 19.0), (23.0, 18.6), (22.6, 26.8), (17.0, 26.8)]), 'R', 'CQc')                                      # 덧댄 가죽 조각 (붉은 갈색)
    c.only(box(9.0, 18.0, 13.0, 19.4), 'p', 'P'); c.only(box(17.0, 25.6, 22.4, 26.8), 'r', 'R')
    seam(c, [(14.6, 11.6), (13.6, 19.6)]); seam(c, [(8.0, 19.6), (13.6, 19.6)]); seam(c, [(16.4, 19.0), (23.0, 18.6)]); seam(c, [(16.4, 19.0), (17.0, 26.8)])
    seam(c, [(12.8, 7.4), (16.4, 5.0)])                                                                                   # 머리의 이음
    c.fill(poly([(15.4, 3.4), (16.6, 0.8), (18.0, 3.2)]), 'c'); c.fill(box(15.6, 3.0, 17.8, 3.6), 'T')                  # 자루 머리 위를 묶은 매듭
    c.fill(box(17.4, 7.4, 18.6, 8.4), 'E'); c.fill(box(20.0, 7.0, 20.8, 8.2), 'E')                                        # 크기가 다른 두 눈
    for k in range(4): c.set(16.8 + k * 1.0, 9.8 + (k % 2) * 0.8, 'T')                                                  # 지그재그로 꿰맨 입
    for (x, y) in ((9.0, 12.6), (22.0, 12.0), (10.0, 26.0), (21.6, 26.4)): c.fill(box(x, y, x + 0.8, y + 0.8), 'M')     # 놋쇠 징
    c.fill(rbox(8.4, 25.6, 23.4, 27.6, 0.4), 'a')                                                                          # 허리 가죽띠
    return c


P2B = {'C': '#b87a3a', 'Q': '#e0a860', 'c': '#7e4e22', 'd': '#4a2c12', 'G': '#c8f0f0', 'g': '#8ad0d8', 'L': '#7ad86a', 'l': '#c8ff9a', 'D': '#3a8a3a',
       'M': '#9a9aa8', 'N': '#5e5e6c', 'O': '#ffe070', 'k': '#1a1410', 'w': '#ffffff', 'A': '#a8743e', 'a': '#6e4822'}


def jar():
    c = Cv(32, 40)
    for (x, ch) in ((11.6, 'c'), (18.6, 'C')):                                                                            # 구리관 다리 (마디 고리)
        c.fill(rbox(x - 1.8, 26.0, x + 1.8, GY2 - 1.4, 0.6), ch); c.fill(rbox(x - 2.4, GY2 - 2.2, x + 3.6, GY2, 0.5), 'N')
        for y in (29.0, 33.0): c.only(box(x - 1.8, y, x + 1.8, y + 0.6), 'd', 'Cc')
    c.fill(path([(8.6, 14.0), (6.6, 20.0), (6.4, 25.0)], 1.8, 1.6), 'c'); c.fill(rbox(4.0, 24.2, 9.4, 28.6, 1.4), 'N')   # 먼 팔 (구리관 · 쇠 주먹)
    jarb = rbox(8.0, 11.0, 22.6, 27.0, 3.0)
    c.fill(jarb, 'g')                                                                                                       # 큰 유리병 몸통
    liq = {(x, y) for (x, y) in jarb if y >= 15.6}
    c.fill(liq, 'L'); c.only({(x, y) for (x, y) in liq if y >= 23.0}, 'D', 'L')
    for (x, y) in jarb:
        if any((x + a, y + b) not in jarb for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))): c.set(x, y, 'G')
    c.fill(ell(15.4, 20.4, 2.6, 2.6), 'O'); c.fill(ell(15.4, 20.4, 1.4, 1.4), 'w')                                         # 연성액 속에 뜬 빛나는 핵
    for (x, y) in ((11.0, 22.0), (19.6, 18.0), (12.6, 17.0), (18.0, 24.4)): c.set(x, y, 'l')                              # 거품
    c.set(9.6, 12.6, 'w'); c.set(9.6, 13.6, 'w')
    c.fill(rbox(7.0, 9.0, 23.6, 11.6, 0.6), 'C'); c.fill(rbox(7.6, 26.4, 23.0, 28.6, 0.6), 'C')                           # 구리 뚜껑 · 밑받침
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(rbox(12.0, 2.4, 20.6, 9.4, 2.0), 'M'); blunt(c.g, 'M', 'M', 'N', bottom=1, side=0)                              # 쇠 투구 머리
    c.fill(ell(17.6, 5.8, 2.0, 2.0), 'N'); c.fill(ell(17.6, 5.8, 1.2, 1.2), 'O')                                           # 둥근 창 눈 하나
    c.fill(path([(21.6, 10.0), (24.4, 7.0), (24.6, 3.6)], 0.6), 'N'); c.fill(box(23.6, 2.4, 25.4, 3.6), 'O')                # 머리 위 김 빠지는 관
    for x in (9.0, 13.0, 17.0, 21.0): c.set(x, 10.2, 'O')                                                                   # 뚜껑 볼트 빛
    return c


for opt, fn, pal, lab, desc, sh, hip, ax, arm, hand in (
        ('A', leather, P2A, 'A 가죽 기운 골렘', '여러 빛깔 가죽 조각을 굵은 실로 기워 만든 큰 몸(바늘땀은 짧은 사선) · 자루 같은 작은 머리 · 크기가 다른 노란 두 눈 · 지그재그로 꿰맨 입 · 놋쇠 징 · 가죽 장갑 주먹', (22, 13), 26, 15, ['A', 'a'], 'C'),
        ('B', jar, P2B, 'B 유리병 골렘', '몸통이 초록 연성액이 찬 큰 유리병(속에 뜬 빛나는 핵 · 거품) · 구리 뚜껑과 밑받침 · 구리관 팔다리 · 쇠 투구 머리의 둥근 창 눈 하나 · 머리 위 김 빠지는 관 · 쇠 주먹', (22, 13), 26, 15, ['C', 'c'], 'N')):
    B2.add('stitchgolem' + ('' if opt == 'A' else '_b'), lab, desc, fn(), pal, sh, ax, hip, arm=arm, hand=hand, idle={'h': [1, 4], 'a': 78})
B2.dump()

# ═══════════ 3. 실패한 연성체 (덩이 · noArm · 슬라임 동작) ═══════════
ACT3 = {'atk': ['sbounce'], 'skl': ['sslam'], 'tk': 1.0,
        'fx': {'atk': {'pal': 'poison', 'hit': 'star'}, 'skl': {'pal': 'poison', 'hit': 'poison', 'big': 1, 'after': 'bubbles'}}}
B3 = Batch('lab2_fail', 'sludge', ACT3, 'sewer', show=[['sbounce', 3], ['sslam', 4]], still=1, noArm=1, wpn='none')
P3A = {'C': '#8a6a8e', 'Q': '#b494b6', 'c': '#5e4462', 'd': '#3e2a42', 'w': '#f4f0e8', 'k': '#1a0e1c', 'E': '#e8c040', 'R': '#c84a5a', 'L': '#9ad86a', 'l': '#c8f09a'}


def fleshblob(mode):
    c = Cv(28, 24); sq = {'idle0': 0.0, 'idle1': 0.6, 'squash': 1.6, 'stretch': -1.6}[mode]
    cx, gy = 13.0, 21.0
    blob = ell(cx, gy - 6.0 + sq * 0.6, 8.6 + sq, 6.2 - sq * 0.9) | ell(cx - 4.0, gy - 3.0, 4.6 + sq * 0.6, 3.0) | ell(cx + 5.0, gy - 3.4, 4.0 + sq * 0.6, 3.0)
    c.fill(blob, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    for (x, l) in ((cx - 7.4, 2.0), (cx + 8.6, 1.6), (cx - 2.0, 1.4)): c.fill(path([(x, gy - 1.6), (x + 0.6, gy + 0.4)], 0.8, 0.5), 'c')   # 짧은 촉수 발
    oy = sq * 0.5
    for (x, y, r) in ((cx + 2.4, gy - 8.6 + oy, 1.8), (cx - 2.8, gy - 7.0 + oy, 1.3), (cx + 5.6, gy - 5.6 + oy, 1.1), (cx - 5.8, gy - 9.2 + oy, 0.9)):   # 크기가 다른 눈 넷
        c.fill(ell(x, y, r, r), 'w'); c.fill(box(x + 0.1, y - 0.3, x + 0.6, y + 0.3), 'k')
    mouth = ell(cx + 1.0, gy - 3.4 + oy, 3.4, 1.0 + (0.6 if mode == 'squash' else 0))
    c.fill(mouth, 'd'); c.only({(x, y) for (x, y) in mouth if y == min(yy for (_, yy) in mouth)}, 'w', 'd')                # 이빨 난 입
    for (x, y) in ((cx - 6.0, gy - 4.0), (cx + 7.6, gy - 7.0)): c.only(ell(x, y, 1.2, 0.8), 'L', 'CQc')                   # 초록 연성액 물집
    return c


P3B = {'C': '#6a8a5a', 'Q': '#98c080', 'c': '#466636', 'd': '#2c4422', 'R': '#e83a3a', 'r': '#ff9a8a', 'k': '#101a0c', 'E': '#ff5040', 'w': '#f0ffe8'}


def melting(mode):
    c = Cv(26, 26); sq = {'idle0': 0.0, 'idle1': 0.6, 'squash': 1.6, 'stretch': -1.6}[mode]
    cx, gy = 12.0, 23.0
    pool = ell(cx, gy - 1.6, 9.6 + sq, 2.2)
    c.fill(pool, 'c')                                                                                                          # 녹아 퍼진 웅덩이
    torso = poly([(cx - 6.0, gy - 2.0), (cx - 6.4, gy - 9.0 + sq), (cx - 5.0, gy - 12.0 + sq), (cx + 5.4, gy - 12.0 + sq), (cx + 6.8, gy - 9.0 + sq), (cx + 6.6, gy - 2.0)])
    c.fill(torso, 'C')                                                                                                         # 처진 어깨 · 넓은 몸
    head = ell(cx + 0.6, gy - 15.6 + sq * 1.2, 4.6, 4.0 - max(0, sq) * 0.3)
    c.fill(head, 'C')
    c.fill(path([(cx - 3.0, gy - 12.4 + sq), (cx - 4.0, gy - 10.0 + sq)], 1.0), 'C')                                      # 머리에서 어깨로 흘러내림
    for (x, y0, L) in ((cx - 7.2, gy - 9.0, 6.6), (cx + 7.6, gy - 9.0, 6.0)): c.fill(path([(x, y0 + sq), (x + 0.4, y0 + L)], 1.4, 0.8), 'C')   # 흘러내리는 팔
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    for (x, y) in ((cx - 2.0, gy - 12.6), (cx + 2.4, gy - 13.0), (cx + 4.4, gy - 6.0), (cx - 3.4, gy - 4.0)): c.only(path([(x, y + sq), (x, y + 3.0 + sq)], 0.5), 'c', 'CQ')   # 흘러내리는 자국
    c.fill(ell(cx + 0.6, gy - 7.6 + sq * 0.6, 2.2, 2.4), 'R'); c.set(cx, gy - 8.6 + sq * 0.6, 'r')                           # 가슴의 붉은 핵
    c.fill(box(cx + 0.6, gy - 16.6 + sq * 1.2, cx + 1.6, gy - 15.8 + sq * 1.2), 'E'); c.fill(box(cx + 3.0, gy - 16.6 + sq * 1.2, cx + 3.8, gy - 15.8 + sq * 1.2), 'E')   # 붉은 두 눈
    c.only(thins([(cx + 0.4, gy - 13.8 + sq * 1.2), (cx + 4.0, gy - 13.4 + sq * 1.2)]), 'd', 'CQc')                     # 처진 입
    return c


SL = ['idle0', 'idle1', 'squash', 'stretch']
for opt, fn, pal, lab, desc, sh, ax in (
        ('A', fleshblob, P3A, 'A 눈 여럿 살덩이', '울퉁불퉁한 보랏빛 살덩이 · 크기가 다른 눈 넷 · 이빨 난 넓은 입 · 초록 연성액 물집 · 짧은 촉수 발로 꿈틀대며 튀어 덮친다', (20, 8), 13),
        ('B', melting, P3B, 'B 녹아내린 연성체', '사람꼴이 반쯤 녹아 웅덩이로 퍼진 초록빛 연성체 · 가슴의 붉은 핵 · 붉은 두 눈 · 흘러내리는 팔 · 몸을 타고 흐르는 자국', (18, 9), 12)):
    fr = {m: fn(m) for m in SL}
    B3.add('failedhomun' + ('' if opt == 'A' else '_b'), lab, desc, [fr['idle0'], fr['idle1']], pal, sh, ax, gm={'squash': fr['squash'], 'stretch': fr['stretch']})
B3.dump()

# ═══════════ 4. 실험실 간수 (사람꼴 · 보통 크기) ═══════════
ACT4 = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.15,
        'fx': {'atk': {'pal': 'steel', 'hit': 'star'}, 'skl': {'pal': 'steel', 'hit': 'stun', 'big': 1, 'after': 'sparks'}}}
B4 = Batch('lab2_warden', 'ratman', ACT4, 'sewer', show=[['down', 4], ['smash', 5]])
B4.extra = head_js('hookpole', """
.MM.
M..M
...M
..MM
..M.
""", '갈고리 장대 (실험실 간수 B): 장대 끝에 휜 쇠 갈고리', L=6.0, shaft='J', fxw='pole')
GY4 = 27


def legs4(c, xf, xn, top, w, far='c', near='C', boot='K', foot=1.8):
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, GY4 - 1.2, 0.4), ch); c.fill(rbox(x - w / 2 - 0.2, GY4 - 2.4, x + w / 2 + foot, GY4, 0.4), boot)


P4A = {'C': '#6e7280', 'Q': '#9498a6', 'c': '#4a4e5a', 'd': '#30323c', 'J': '#8a5a34', 'j': '#5a3820', 'I': '#b07a48', 'S': '#d8a080', 's': '#a87058',
       'M': '#8a8e9a', 'N': '#565a66', 'G': '#7ae0c0', 'K': '#2a2420', 'k': '#141014', 'Y': '#e8c050'}


def warden_a():
    c = Cv(26, 28)
    legs4(c, 10.4, 14.4, 19.6, 2.6)
    c.fill(rbox(7.4, 10.2, 17.6, 20.6, 1.0), 'C')                                                                           # 회색 셔츠 몸통 (넓은 어깨)
    c.fill(ell(8.0, 11.4, 2.0, 1.6), 'c')
    c.fill(rbox(10.8, 3.0, 16.8, 10.6, 1.8), 'S')                                                                            # 머리
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0); blunt(c.g, 'S', 'S', 's', bottom=1, side=0)
    c.fill(rbox(12.0, 4.6, 17.2, 9.6, 0.8), 'M'); blunt(c.g, 'M', 'M', 'N', bottom=1, side=0)                              # 얼굴 덮은 쇠가면
    c.fill(ell(15.2, 6.4, 0.9, 0.9), 'G'); c.fill(ell(16.8, 6.4, 0.7, 0.9), 'G')                                             # 둥근 유리 눈구멍 둘
    c.only(thins([(12.4, 8.4), (17.0, 8.4)]), 'N', 'MN')
    c.fill(rbox(10.6, 2.4, 16.0, 4.2, 0.8), 'd')                                                                              # 짧게 깎은 머리
    apron = poly([(10.6, 12.2), (17.2, 12.2), (17.6, 23.6), (10.0, 23.6)])
    c.fill(apron, 'J'); blunt(c.g, 'J', 'I', 'j', bottom=1, side=0)                                                        # 두꺼운 가죽 앞치마
    c.only(thins([(10.4, 16.6), (17.4, 16.6)]), 'j', 'JIj')
    c.fill(box(7.4, 17.0, 17.6, 17.8), 'j')                                                                                    # 허리끈
    c.fill(path([(8.4, 18.4), (7.6, 20.4), (8.8, 21.6), (9.8, 20.4), (9.2, 18.4)], 0.4), 'Y'); c.set(8.2, 22.4, 'Y'); c.set(9.4, 22.6, 'Y')   # 허리의 열쇠 꾸러미
    return c


P4B = {'C': '#7a2a2a', 'Q': '#a84a40', 'c': '#541818', 'd': '#360e0e', 'M': '#9498a4', 'N': '#5c606c', 'n': '#3a3c46', 'S': '#d8a080', 's': '#a87058',
       'K': '#2a2420', 'k': '#141014', 'J': '#7a5232', 'j': '#4e3420', 'E': '#ffd040'}


def warden_b():
    c = Cv(26, 28)
    legs4(c, 10.4, 14.4, 19.6, 2.6, far='j', near='J')
    c.fill(rbox(7.6, 10.6, 17.4, 21.0, 1.0), 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                             # 누빈 붉은 겉옷
    for y in (13.0, 15.6, 18.2): c.only(thins([(7.8, y), (17.2, y)]), 'c', 'CQ')                                          # 누빔 줄 (가로만)
    c.fill(ell(8.0, 11.6, 2.2, 1.8), 'n')
    c.fill(rbox(10.4, 2.0, 17.2, 10.8, 1.0), 'M'); blunt(c.g, 'M', 'M', 'N', bottom=1, side=0)                             # 쇠 투구 (통)
    c.fill(box(13.2, 5.6, 17.2, 6.6), 'k'); c.fill(box(14.4, 5.8, 15.2, 6.4), 'E'); c.fill(box(16.2, 5.8, 16.8, 6.4), 'E')   # 가로 틈 하나 · 두 눈
    for (x, y) in ((11.2, 3.0), (11.2, 9.6), (16.6, 3.0)): c.set(x, y, 'n')                                                 # 리벳
    c.fill(path([(8.0, 10.6), (11.0, 13.6), (14.0, 16.6), (17.0, 19.6)], 0.5), 'N')                                          # 어깨에 비스듬히 건 쇠사슬
    for k in range(0, 10, 2): c.set(8.4 + k * 0.9, 11.0 + k * 0.9, 'n')
    c.fill(box(7.6, 19.4, 17.4, 20.4), 'j')
    return c


for opt, fn, pal, lab, desc, wpn, hand in (
        ('A', warden_a, P4A, 'A 가죽 앞치마 간수', '얼굴을 덮은 쇠가면(둥근 유리 눈구멍 둘) · 짧게 깎은 머리 · 두꺼운 가죽 앞치마 · 회색 셔츠 · 허리에 찬 열쇠 꾸러미 · 철퇴', 'mace', 'S'),
        ('B', warden_b, P4B, 'B 쇠 투구 간수', '통 쇠 투구(가로 틈 하나 · 노란 두 눈 · 리벳) · 가로로 누빈 붉은 겉옷 · 어깨에 비스듬히 건 쇠사슬 · 가죽 바지 · 끝이 휜 쇠 갈고리 장대', 'hookpole', 'S')):
    B4.add('labwarden' + ('' if opt == 'A' else '_b'), lab, desc, fn(), pal, (17, 11), 12, 19, wpn=wpn, arm=['C', 'c'], hand=hand, idle={'h': [2, 3], 'a': 70})
B4.dump()

# ═══════════ 5. 연성술사 조수 (사람꼴 · 약병 던지기) ═══════════
ACT5 = {'mag': ['spush', 'sjab'], 'skl': ['scharge'], 'tk': 0.95,
        'fx': {'mag': {'pal': 'poison', 'hit': 'poison', 'p': 'flask'}, 'skl': {'pal': 'fire', 'hit': 'burst', 'p': 'flask', 'big': 1, 'after': 'smoke'}}}
B5 = Batch('lab2_assist', 'ratman', ACT5, 'sewer', show=[['spush', 4], ['scharge', 6]])
B5.extra = head_js('gflask', """
.O.
.g.
gLg
LLL
.L.
""", '초록 약병 (연성술사 조수 A): 둥근 병 · 코르크', L=0.5, shaft='S', below=0.5, fxw='staff') + head_js('pflask', """
.O.
.g.
gVg
VVV
.V.
""", '보라 약병 (연성술사 조수 B)', L=0.5, shaft='S', below=0.5, fxw='staff')
GY5 = 25


def legs5(c, xf, xn, top, w, far='c', near='C', boot='K', foot=1.6):
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, GY5 - 1.2, 0.4), ch); c.fill(rbox(x - w / 2 - 0.2, GY5 - 2.2, x + w / 2 + foot, GY5, 0.4), boot)


P5A = {'C': '#c8b890', 'Q': '#e8dcb8', 'c': '#968660', 'd': '#6a5e40', 'H': '#8a5a30', 'h': '#5e3a1a', 'S': '#f0c8a0', 's': '#c89870', 'M': '#c8963a', 'm': '#8a6420',
       'G': '#9ae8ff', 'L': '#6ad070', 'l': '#a8f08a', 'g': '#d8f4f4', 'O': '#a8743e', 'K': '#3a2a20', 'k': '#1a1410', 'J': '#7a5232', 'j': '#4e3420'}


def assist_a():
    c = Cv(24, 26)
    legs5(c, 10.0, 13.4, 19.0, 2.2)
    robe = poly([(8.6, 10.4), (15.6, 10.4), (16.6, 21.6), (7.6, 21.6)])
    c.fill(robe, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                          # 얼룩진 연성 가운
    c.only(ell(12.6, 16.0, 1.6, 1.0) | ell(9.6, 19.6, 1.2, 0.8), 'L', 'CQc')                                                   # 초록 연성액 얼룩
    c.fill(path([(8.4, 11.0), (14.6, 18.4)], 0.5), 'J'); c.fill(rbox(13.4, 17.6, 16.6, 20.6, 0.6), 'J'); c.only(box(13.4, 17.6, 16.6, 18.2), 'j', 'J')   # 비스듬한 끈 · 가방
    c.fill(ell(12.6, 6.2, 3.4, 3.6), 'S'); blunt(c.g, 'S', 'S', 's', bottom=1, side=0)                                       # 앳된 얼굴
    hair = poly([(9.0, 6.4), (9.4, 3.0), (11.6, 1.6), (15.0, 1.8), (16.6, 3.6), (15.6, 4.4), (12.0, 4.2), (10.6, 6.0), (10.0, 8.2)])
    c.fill(hair, 'H'); c.only(thins([(10.0, 3.0), (12.4, 2.2)]), 'h', 'H')                                                   # 부스스한 갈색 머리
    for x in (12.6, 15.0): c.fill(ell(x, 4.0, 1.1, 1.0), 'M'); c.set(x, 4.0, 'G')                                          # 이마 위로 올린 놋쇠 고글
    c.fill(box(11.4, 3.8, 14.2, 4.2), 'm')
    c.fill(box(14.2, 6.4, 14.8, 7.0), 'k')                                                                                    # 눈
    return c


P5B = {'C': '#4a4a6a', 'Q': '#6e6e90', 'c': '#30304a', 'd': '#1e1e30', 'W': '#d8d0c0', 'w': '#ffffff', 'S': '#e8c0a0', 's': '#b88e70',
       'R': '#e84a4a', 'Y': '#ffd040', 'V': '#a868e0', 'B': '#4ab0e8', 'g': '#d8f4f4', 'O': '#a8743e', 'K': '#2a2020', 'k': '#141018', 'E': '#ffe0a0'}


def assist_b():
    c = Cv(24, 26)
    legs5(c, 10.0, 13.4, 19.0, 2.2)
    robe = poly([(8.4, 10.4), (15.8, 10.4), (16.8, 21.6), (7.4, 21.6)])
    c.fill(robe, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                          # 남빛 두건 옷
    c.fill(path([(8.6, 11.4), (15.4, 17.8)], 0.6), 'J' if False else 'd')                                                  # 비스듬한 약병 띠
    for k, ch in enumerate('RYVB'): x = 9.6 + k * 1.6; y = 12.6 + k * 1.5; c.fill(box(x, y - 0.8, x + 0.8, y + 0.4), ch)    # 띠에 꽂힌 약병 넷
    hood = ell(12.4, 5.8, 4.4, 4.6)
    c.fill(hood, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                          # 두건
    c.fill(ell(13.4, 6.4, 2.6, 2.8), 'S')                                                                                       # 얼굴
    c.fill(box(11.6, 7.2, 15.8, 9.4), 'W'); c.only(thins([(11.6, 8.4), (15.8, 8.4)]), 'w', 'W')                             # 입을 가린 천 입마개
    c.fill(box(14.0, 5.4, 14.6, 6.0), 'k'); c.fill(box(15.4, 5.4, 15.8, 6.0), 'k')                                         # 두 눈
    return c


for opt, fn, pal, lab, desc, wpn in (
        ('A', assist_a, P5A, 'A 고글 조수', '이마 위로 올린 놋쇠 고글 · 부스스한 갈색 머리 · 초록 연성액 얼룩이 진 베이지 가운 · 비스듬히 멘 가죽 가방 · 손에 든 초록 약병을 던진다', 'gflask'),
        ('B', assist_b, P5B, 'B 입마개 조수', '남빛 두건 옷 · 입을 가린 흰 천 입마개 · 가슴에 비스듬한 띠와 꽂힌 빨강 · 노랑 · 보라 · 파랑 약병 넷 · 손에 든 보라 약병을 던진다', 'pflask')):
    B5.add('labassist' + ('' if opt == 'A' else '_b'), lab, desc, fn(), pal, (15, 11), 11, 18, wpn=wpn, arm=['C', 'c'], hand='S', idle={'h': [2, 2], 'a': 40})
B5.dump()

# ═══════════ 6. 연성술사 「잿빛 장갑」 (던전 주인 · ms 1.5 · 큰 잿빛 장갑 주먹) ═══════════
ACT6 = {'atk': ['side', 'down'], 'skl': ['smash'], 'mag': ['spush'], 'tk': 1.25,
        'fx': {'atk': {'pal': 'steel', 'hit': 'star', 'big': 1}, 'mag': {'pal': 'poison', 'hit': 'poison', 'p': 'flask'},
               'skl': {'pal': 'poison', 'hit': 'burst', 'big': 2, 'after': 'smoke', 'aoe': 'pillar', 'shake': 3}}}
B6 = Batch('lab2_boss', 'sewertroll', ACT6, 'sewer', 'dungeon', show=[['side', 4], ['smash', 5]], ms=1.5, mx=20, my=20, wpn='ashfist')
B6.extra = head_js('ashfist', """
.NNNN.
NxxNNN
NNNNNn
NNYNNn
NNNNNn
.nnnn.
""", '커다란 잿빛 쇠 장갑 (연성술사 잿빛 장갑): 손등의 노란 연성 빛 한 점', L=0.5, shaft='N', below=0.5, fxw='heavy')
GY6 = 51


def legs6(c, xf, xn, top, w, far='c', near='C', boot='K', foot=3.2):
    for (x, ch) in ((xf, far), (xn, near)):
        c.fill(rbox(x - w / 2, top, x + w / 2, GY6 - 1.6, 0.6), ch); c.fill(rbox(x - w / 2 - 0.4, GY6 - 2.6, x + w / 2 + foot, GY6, 0.6), boot)


def flask6(c, x, y, liq='L', glass='g', rim='G'):
    b = ell(x, y, 2.4, 2.2); c.fill(b, liq); c.fill(box(x - 0.8, y - 4.0, x + 0.8, y - 2.0), glass); c.fill(box(x - 1.0, y - 4.8, x + 1.0, y - 4.0), 'O')
    for (a, bb) in b:
        if a < x - 1.2 or bb < y - 1.4: c.set(a, bb, rim)


P6A = {'C': '#8a8a90', 'Q': '#b4b4ba', 'c': '#5e5e66', 'd': '#3c3c44', 'N': '#7a7a84', 'n': '#4a4a54', 'x': '#c8c8d0', 'H': '#e8e8ec', 'h': '#a8a8b0',
       'S': '#e0c0a8', 's': '#b08e78', 'G': '#c8f0f0', 'g': '#e0f8f8', 'L': '#7ad86a', 'O': '#a8743e', 'Y': '#ffd040', 'K': '#2a2a30', 'k': '#141418', 'E': '#9af0a0', 'J': '#6e4a2c'}


def ashglove_a():
    c = Cv(48, 56)
    coat = poly([(15.0, 16.0), (31.0, 16.0), (35.0, 44.0), (30.0, 48.0), (16.0, 48.0), (11.0, 44.0)])
    legs6(c, 20.0, 27.0, 38.0, 4.6)
    c.fill(coat, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                          # 땅에 닿는 잿빛 긴 외투
    c.only(thins([(23.0, 22.0), (23.0, 48.0)]), 'd', 'CQc')                                                                    # 외투 앞섶
    c.fill(poly([(15.0, 16.0), (19.0, 11.0), (21.0, 17.0)]), 'c'); c.fill(poly([(31.0, 16.0), (28.0, 11.0), (26.0, 17.0)]), 'C')   # 높이 세운 깃
    c.fill(ell(15.0, 18.0, 3.4, 2.4), 'c')                                                                                      # 먼 어깨
    c.fill(path([(14.4, 19.0), (12.4, 25.0), (14.0, 29.0)], 2.2, 2.0), 'c'); c.fill(rbox(13.6, 27.6, 17.6, 30.6, 1.0), 'S')   # 먼 팔 · 손
    flask6(c, 18.6, 28.4)                                                                                                      # 가슴 앞에 든 초록 약병
    c.fill(ell(24.0, 9.6, 4.6, 5.0), 'S'); blunt(c.g, 'S', 'S', 's', bottom=1, side=0)                                       # 얼굴
    hair = poly([(19.0, 9.0), (19.6, 4.6), (23.0, 3.0), (27.6, 3.6), (28.6, 6.0), (24.0, 5.6), (21.4, 7.4), (20.6, 12.6), (17.0, 16.0), (17.6, 11.0)])
    c.fill(hair, 'H'); c.only(thins([(20.0, 5.0), (23.0, 3.6)]), 'h', 'H')                                                  # 뒤로 묶은 흰 머리
    for x in (24.6, 27.4): c.fill(ell(x, 9.4, 1.4, 1.4), 'G'); c.set(x - 0.4, 9.0, 'E')                                     # 둥근 초록 렌즈 안경 가면
    c.fill(box(23.8, 11.6, 28.6, 13.0), 'n'); c.only(thins([(24.0, 12.2), (28.4, 12.2)]), 'd', 'n')                          # 입을 가린 쇠 입마개
    c.fill(box(15.0, 31.0, 31.6, 32.4), 'J')
    for k, ch in enumerate('LYLE'): c.fill(box(17.0 + k * 3.2, 32.6, 17.8 + k * 3.2, 34.4), ch)                             # 허리띠 약병
    return c


P6B = {'C': '#6a6a74', 'Q': '#9494a0', 'c': '#46464e', 'd': '#2c2c34', 'N': '#7a7a84', 'n': '#4a4a54', 'x': '#c8c8d0', 'M': '#b8863a', 'm': '#7e5a22',
       'G': '#c8f0f0', 'g': '#e0f8f8', 'L': '#7ad86a', 'l': '#c8ff9a', 'D': '#3a8a3a', 'O': '#a8743e', 'Y': '#ffd040', 'K': '#2a2a30', 'k': '#141418', 'E': '#9af0a0'}


def ashglove_b():
    c = Cv(48, 56)
    for (x, top) in ((13.0, 10.0), (17.6, 9.0)):                                                                              # 등의 유리 통 둘 (초록 연성액)
        t = rbox(x - 2.6, top, x + 2.6, top + 15.0, 1.6); c.fill(t, 'g'); c.fill({(a, b) for (a, b) in t if b >= top + 4.0}, 'L')
        for (a, b) in t:
            if any((a + p, b + q) not in t for p, q in ((1, 0), (-1, 0), (0, 1), (0, -1))): c.set(a, b, 'G')
        c.fill(box(x - 2.8, top - 1.0, x + 2.8, top + 0.4), 'M'); c.set(x - 1.0, top + 7.0, 'l')
    legs6(c, 20.0, 27.4, 37.0, 5.6)
    c.fill(poly([(15.0, 18.0), (32.0, 17.0), (34.0, 26.0), (31.0, 37.0), (17.0, 37.0), (14.0, 26.0)]), 'C')                 # 두꺼운 연성 갑주 몸
    c.fill(rbox(15.0, 35.0, 32.0, 40.6, 1.0), 'c')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(ell(14.6, 19.4, 4.4, 3.4), 'c'); c.fill(ell(32.0, 19.0, 4.6, 3.6), 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)   # 둥근 어깨받이
    c.fill(path([(14.0, 21.0), (11.6, 27.0), (12.0, 31.0)], 2.4, 2.2), 'c'); c.fill(rbox(9.6, 29.4, 15.4, 34.0, 1.2), 'N')   # 먼 팔
    c.fill(path([(18.0, 26.0), (24.0, 30.0), (30.0, 28.0)], 0.7), 'M'); c.only(thins([(18.0, 26.0), (24.0, 30.0), (30.0, 28.0)]), 'm', 'M')   # 통에서 장갑으로 가는 놋쇠 관
    c.fill(rbox(19.0, 4.0, 30.0, 16.6, 2.4), 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                             # 각진 연성 투구
    c.fill(box(19.6, 3.0, 29.6, 4.6), 'M'); c.fill(box(23.0, 9.2, 30.0, 11.0), 'd'); c.fill(box(24.4, 9.6, 26.0, 10.4), 'E'); c.fill(box(27.6, 9.6, 29.0, 10.4), 'E')   # 놋쇠 테 · 가로 눈 틈 하나 · 초록빛 두 눈
    c.fill(rbox(25.0, 12.6, 30.4, 15.6, 0.8), 'M'); c.fill(box(26.6, 13.4, 28.8, 14.6), 'm')                               # 입 앞의 놋쇠 숨통
    for (x, y) in ((20.4, 6.0), (20.4, 14.6)): c.set(x, y, 'm')
    c.fill(box(16.0, 30.0, 31.0, 31.4), 'M')
    return c


P6C = {'C': '#3a3a48', 'Q': '#5e5e70', 'c': '#26262e', 'd': '#18181e', 'N': '#7a7a84', 'n': '#4a4a54', 'x': '#c8c8d0', 'Y': '#ffd040', 'W': '#f0ece4', 'w': '#ffffff', 'v': '#b8b0a4',
       'G': '#c8f0f0', 'g': '#e0f8f8', 'L': '#7ad86a', 'V': '#b878e8', 'R': '#e85a5a', 'O': '#a8743e', 'K': '#1e1e26', 'k': '#0e0e12', 'E': '#ffd040', 'H': '#2a2a34'}


def ashglove_c():
    c = Cv(48, 56)
    legs6(c, 20.6, 26.6, 40.0, 4.0)
    robe = poly([(17.0, 15.0), (30.0, 15.0), (33.0, 30.0), (36.0, 48.0), (12.0, 48.0), (15.0, 30.0)])
    c.fill(robe, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                                          # 땅에 끌리는 먹빛 긴 옷
    c.only(thins([(24.0, 20.0), (24.0, 48.0)]), 'd', 'CQc')
    c.fill(ell(17.0, 17.0, 3.0, 2.2), 'c')
    c.fill(path([(16.6, 18.0), (14.6, 24.0), (15.4, 28.0)], 2.0, 1.8), 'c'); c.fill(rbox(14.0, 26.6, 18.0, 29.6, 1.0), 'N')
    head = ell(24.0, 8.6, 4.4, 5.2)
    c.fill(poly([(18.6, 8.0), (20.0, 2.6), (24.0, 1.0), (28.4, 2.6), (30.0, 9.0), (28.6, 14.0), (19.6, 14.0)]), 'H')        # 두건
    c.fill(head - {(x, y) for (x, y) in head if x < 21}, 'W'); blunt(c.g, 'W', 'w', 'v', bottom=1, side=0)                   # 매끈한 하얀 가면
    c.fill(box(24.6, 7.6, 26.4, 8.2), 'k'); c.fill(box(27.6, 7.6, 28.6, 8.2), 'k')                                          # 가는 눈 틈 둘 (그 밖엔 아무것도 없는 얼굴)
    for (x, y, ch) in ((11.0, 24.0, 'L'), (9.6, 34.0, 'V'), (37.4, 30.0, 'R')):                                            # 몸 둘레에 떠 있는 약병 셋
        flask6(c, x, y, ch)
    c.fill(box(17.0, 29.0, 31.0, 30.2), 'n')
    return c


for opt, fn, pal, lab, desc, sh, hip, ax in (
        ('A', ashglove_a, P6A, 'A 잿빛 외투 연성술사', '땅에 닿는 잿빛 긴 외투와 높이 세운 깃 · 뒤로 묶은 흰 머리 · 둥근 초록 렌즈 안경과 쇠 입마개 · 가슴 앞에 든 초록 약병 · 허리띠의 약병 넷 · 한쪽 팔이 커다란 잿빛 쇠 장갑', (33, 19), 36, 24),
        ('B', ashglove_b, P6B, 'B 연성 갑주 연성술사', '두꺼운 잿빛 연성 갑주와 둥근 어깨받이 · 놋쇠 테 각진 투구(가로 눈 틈 · 초록빛 두 눈 · 입 앞 숨통) · 등에 진 초록 연성액 유리 통 둘 · 통에서 장갑으로 가는 놋쇠 관 · 커다란 잿빛 쇠 장갑', (34, 20), 36, 24),
        ('C', ashglove_c, P6C, 'C 하얀 가면 연성술사', '땅에 끌리는 먹빛 긴 옷 · 두건 속 매끈한 하얀 가면(가는 눈 틈 둘뿐) · 몸 둘레에 떠 있는 초록 · 보라 · 붉은 약병 셋 · 커다란 잿빛 쇠 장갑', (31, 18), 38, 24)):
    B6.add('ashglove' + ('' if opt == 'A' else '_' + opt.lower()), lab, desc, fn(), pal, sh, ax, hip, arm=['N', 'n'], hand='N', idle={'h': [1, 4], 'a': 78})
B6.dump()
