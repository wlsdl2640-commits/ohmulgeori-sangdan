"""별빛 요정 (starsprite · 별의 정원 Lv140 · 원소+천상 · 빛 · 마법 · 떠 있음 · 맞히면 냉기) 시안 — 작은 떠 있는 정령 · noArm · still
마법 기본 공격 wspit(빛을 모았다가 쏨 → 별빛 구슬) · 공격 갈래 bswoop · 스킬 = 얼음 별 조각
A 별머리 정령: 다섯 꼭지 별 머리 · 연보라 물방울 몸 · 수정 날개 둘 · 점 눈 · 꼬리처럼 흩어지는 별가루
B 별가루 솜뭉치: 동그란 빛 솜뭉치 몸 · 큰 두 눈 · 작은 수정 날개 · 뒤로 흐르는 별가루 꼬리 · 반짝이
C 유리 날개 꼬마 요정: 남빛 별무늬 옷 · 짧은 푸른 머리 · 유리 날개 넷 · 작은 별 지팡이 (금발 · 초록 옷 · 틀어 올린 머리 없음)
피한 것: 네 꼭지 반짝이(더하기 꼴) · 유명한 요정(금발 · 초록 옷) · 후광"""
from kit import *

ACT = {'mag': ['wspit'], 'atk': ['bswoop'], 'skl': ['wspit'], 'tk': 0.9,
       'fx': {'mag': {'pal': 'star', 'hit': 'flash', 'p': 'orb'}, 'atk': {'pal': 'star', 'hit': 'star'},
              'skl': {'pal': 'ice', 'hit': 'shatter', 'p': 'shard', 'big': 1, 'after': 'motes'}}}
B = Batch('sprite1', 'starsprite', ACT, 'stargarden', show=[['wspit', 4], ['bswoop', 4]], still=1, noArm=1, wpn='none', float=1)
MODES = ['idle0', 'idle1', 'bite', 'swell', 'spit']


def star5(cx, cy, R, r, rot=-90):
    pts = []
    for k in range(10):
        a = math.radians(rot + k * 36); rr = R if k % 2 == 0 else r
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    return poly(pts)


def cwing(c, root, tip, w, ch='W', edge='w'):
    """잎꼴 수정 날개: 뿌리 → 끝 축의 타원 (너비 w)"""
    (rx, ry), (tx, ty) = root, tip; L = math.hypot(tx - rx, ty - ry); ux, uy = (tx - rx) / L, (ty - ry) / L; mx, my = (rx + tx) / 2, (ry + ty) / 2
    cells = set()
    for y in range(int(min(ry, ty) - w - 2), int(max(ry, ty) + w + 2)):
        for x in range(int(min(rx, tx) - w - 2), int(max(rx, tx) + w + 2)):
            px, py = x + 0.5 - mx, y + 0.5 - my; a = px * ux + py * uy; b = -px * uy + py * ux
            if (a / (L / 2)) ** 2 + (b / w) ** 2 <= 1: cells.add((x, y))
    c.fill(cells, ch)
    for (x, y) in cells:
        if (x, y - 1) not in cells or (x - 1, y) not in cells: c.set(x, y, edge)
    c.only(thin((rx + ux, ry + uy), (tx - ux * 1.5, ty - uy * 1.5)), edge, ch)


def sprite(mode, opt):
    c = Cv(26, 26); fl = {'idle0': 0, 'idle1': 1.4, 'bite': -0.6, 'swell': 0.6, 'spit': -1.0}[mode]; gl = mode in ('swell', 'spit')
    cx, cy = 13.0, 12.0
    if opt == 'A':
        cwing(c, (cx - 1.4, cy + 0.6), (cx - 8.6, cy - 5.4 + fl), 2.0, 'V', 'w'); cwing(c, (cx - 1.0, cy + 1.6), (cx - 7.6, cy + 2.6 + fl * 0.5), 1.6)   # 수정 날개 둘
        body = poly([(cx - 2.6, cy + 1.6), (cx + 2.6, cy + 1.6), (cx + 2.0, cy + 6.0), (cx, cy + 8.6), (cx - 2.0, cy + 6.0)])
        c.fill(body, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.fill(star5(cx + 0.4, cy - 2.0, 5.6 if not gl else 6.4, 2.6 if not gl else 3.0, -90 + fl * 3), 'Y'); c.only(star5(cx + 0.4, cy - 2.0, 3.0, 1.4), 'L', 'Y')   # 다섯 꼭지 별 머리
        c.fill(box(cx + 0.6, cy - 2.4, cx + 1.4, cy - 1.8), 'k'); c.fill(box(cx + 2.6, cy - 2.4, cx + 3.0, cy - 1.8), 'k')
        for (x, y) in ((cx - 1.0, cy + 10.6), (cx - 2.6, cy + 12.4), (cx + 0.6, cy + 13.0)): c.set(x + fl * 0.3, y, 'L')   # 흩어지는 별가루
    elif opt == 'B':
        cwing(c, (cx - 2.4, cy - 2.4), (cx - 8.4, cy - 8.0 + fl), 1.8, 'V', 'w'); cwing(c, (cx - 1.6, cy - 1.4), (cx - 7.6, cy - 4.2 + fl), 1.6)
        for i, (dx, dy, r) in enumerate(((-4.6, 2.6, 2.0), (-7.6, 4.4, 1.4), (-10.0, 5.6, 0.9))): c.fill(ell(cx + dx, cy + dy + fl * 0.3 * i, r, r), 'Q' if i == 0 else 'q')   # 별가루 꼬리
        c.fill(ell(cx, cy, 5.6 if not gl else 6.4, 5.2 if not gl else 6.0), 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)   # 동그란 빛 솜뭉치
        for (x, y) in ((cx - 3.0, cy - 4.6), (cx + 1.0, cy - 5.4), (cx + 4.4, cy - 3.0), (cx - 5.4, cy - 0.6)): c.set(x, y, 'L')    # 솜 털 끝 빛
        c.fill(box(cx + 1.0, cy - 1.0, cx + 2.0, cy + 0.6), 'k'); c.fill(box(cx + 3.4, cy - 1.0, cx + 4.0, cy + 0.6), 'k'); c.set(cx + 1.0, cy - 1.0, 'w'); c.set(cx + 3.4, cy - 1.0, 'w')   # 큰 두 눈
    else:
        for (dx, dy, k) in ((-1.2, -0.6, 0), (-0.6, 0.4, 1)):                                                                  # 유리 날개 넷
            cwing(c, (cx + dx, cy + dy), (cx - 7.6 + k * 1.6, cy - 6.0 + k * 1.0 + fl), 1.6, 'V' if k == 0 else 'W', 'w')
            cwing(c, (cx + dx, cy + dy + 1.0), (cx - 6.2 + k * 1.2, cy + 4.0 + k * 0.6 - fl * 0.6), 1.2, 'V' if k == 0 else 'W', 'w')
        dress = poly([(cx - 1.8, cy - 0.4), (cx + 2.0, cy - 0.4), (cx + 3.8, cy + 6.6), (cx - 3.2, cy + 6.6)])
        c.fill(dress, 'N'); c.only(box(cx - 3.2, cy + 6.0, cx + 3.8, cy + 6.6), 'n', 'N')                                      # 남빛 별무늬 옷
        for (x, y) in ((cx - 0.6, cy + 2.0), (cx + 1.6, cy + 4.0), (cx - 2.0, cy + 5.0)): c.set(x, y, 'L')
        c.fill(box(cx - 1.0, cy + 6.8, cx - 0.4, cy + 8.4), 'S'); c.fill(box(cx + 1.0, cy + 6.8, cx + 1.6, cy + 8.0), 'S')     # 다리
        c.fill(ell(cx + 0.6, cy - 3.0, 2.8, 2.8), 'S'); c.only(ell(cx - 0.2, cy - 1.8, 2.0, 1.2), 's', 'S')                     # 얼굴
        c.fill(poly([(cx - 2.4, cy - 2.0), (cx - 2.6, cy - 4.6), (cx - 0.4, cy - 6.4), (cx + 2.8, cy - 6.0), (cx + 3.4, cy - 4.4), (cx + 0.8, cy - 4.6), (cx - 0.6, cy - 3.0), (cx - 1.0, cy - 1.0)]), 'H')   # 짧은 푸른 머리
        c.fill(box(cx + 1.6, cy - 3.2, cx + 2.2, cy - 2.6), 'k')
        c.fill(thins([(cx + 2.6, cy + 1.0), (cx + 4.6, cy - 1.6)]), 'J'); c.fill(star5(cx + 5.2, cy - 2.8, 2.0 if not gl else 2.6, 0.9), 'Y')   # 작은 별 지팡이 (몸에 붙여 그림)
        c.fill(box(cx + 1.8, cy + 0.6, cx + 2.8, cy + 1.6), 'S')
    if mode == 'spit': c.fill(ell(cx + 6.0, cy - 1.0, 1.2, 1.2), 'L')
    return c


PAL = {
    'A': {'Y': '#ffe070', 'L': '#fffbe0', 'C': '#c8a8ff', 'Q': '#e8dcff', 'c': '#8a6ad8', 'V': '#a8d8ff', 'W': '#d8f0ff', 'w': '#ffffff', 'k': '#2a2040'},
    'B': {'C': '#dcd8ff', 'Q': '#f8f6ff', 'c': '#9a94e0', 'q': '#c8c4ff', 'L': '#ffffff', 'V': '#a8d8ff', 'W': '#d8f0ff', 'w': '#ffffff', 'k': '#2a2040', 'p': '#8ab8ff'},
    'C': {'N': '#2e3a8a', 'n': '#1e2660', 'L': '#fff6c0', 'S': '#e8dcff', 's': '#c0aee8', 'H': '#5a8ae0', 'k': '#1a1430', 'J': '#c8a040', 'Y': '#ffe070',
          'V': '#9ad0ff', 'W': '#c8ecff', 'w': '#ffffff'},
}
LAB = {'A': ('A 별머리 정령', '노란 다섯 꼭지 별 머리(속 빛 · 점 눈) · 연보라 물방울 몸 · 하늘빛 수정 날개 둘 · 아래로 흩어지는 별가루 · 마법을 모으면 별 머리가 커짐'),
       'B': ('B 별가루 솜뭉치', '동그란 연보랏빛 솜뭉치 몸(털 끝이 반짝) · 반짝이는 큰 두 눈 · 작은 수정 날개 둘 · 뒤로 흐르는 별가루 꼬리'),
       'C': ('C 유리 날개 꼬마 요정', '남빛 별무늬 옷 · 짧은 푸른 머리 · 연보라 얼굴 · 유리 날개 넷 · 노란 별 지팡이 · 금발 · 초록 옷 · 틀어 올린 머리는 피함')}
for opt in 'ABC':
    fr = {m: sprite(m, opt) for m in MODES}
    B.add('starsprite' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], (18, 11), 13, pad=5,
          gm={m: fr[m] for m in ('bite', 'swell', 'spit')})
B.dump()
