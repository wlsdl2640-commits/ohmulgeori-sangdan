"""타락한 대천사 (fallenarch · 무너진 천계의 성소 주인 · 악마 · 악 · 마법 · 광역 · 약화 · 저주) 시안 — 큰 사람꼴 ms 1.5 · 떠 있음 · 지팡이
A 여섯 검은 날개: 위 · 가운데 · 아래로 겹친 검은 깃털 날개 셋(뒤쪽에 짝 셋) · 은보라 테 먹빛 갑주 · 뒤로 솟은 검은 뿔 넷 · 긴 보랏빛 머리 · 보랏빛 불꽃 수정 지팡이
B 녹슨 금빛 갑주: 빛바랜 금 갑주에 번진 보랏빛 타락 줄기 · 끝이 검게 물든 잿빛 날개 넷 · 붉은 눈 · 찢어진 검붉은 망토 · 보랏빛 수정 창
C 검은 불꽃 날개: 검은 보랏빛 불꽃 혀로 된 날개 · 검붉은 긴 옷 · 창백한 가면 같은 얼굴 · 검은 머리 · 손 위 검은 불꽃 구슬
피한 것: 머리 위 · 뒤의 고리(깨진 고리도) · 흰 옷 · 십자 · 흰 머리"""
from kit import *
from feath import fwing

ACT = {'mag': ['spush', 'sjab'], 'atk': ['spush'], 'skl': ['scharge'], 'tk': 1.1,
       'fx': {'mag': {'pal': 'evil', 'hit': 'flash', 'p': 'orb', 'big': 1}, 'atk': {'pal': 'evil', 'hit': 'flash', 'p': 'orb'},
              'skl': {'pal': 'dark', 'hit': 'vortex', 'big': 2, 'after': 'feathers', 'shake': 2}}}
B = Batch('arch1', 'fallenarch', ACT, 'ruins', 'dungeon', show=[['spush', 4], ['scharge', 6]], ms=1.5, mx=20, my=20, float=1)
B.extra = head_js('vscep', """
..P..
.PoP.
.PoP.
PPoPP
.PPP.
..g..
.ggg.
""", '보랏빛 불꽃 수정 지팡이 (타락한 대천사 A): 먹빛 자루 끝 은 받침 위 보랏빛 수정 · 속 흰 불꽃', L=7.0, shaft='J') + head_js('dspear', """
..p..
..P..
.PoP.
.PoP.
.PPP.
.PP..
gg.gg
.ggg.
""", '보랏빛 수정 창 (타락한 대천사 B): 빛바랜 금 받침 위 길쭉한 보랏빛 수정 날', L=7.0, shaft='J')
CX = 27.0


def face(c, x, y, eye='e'):
    c.fill(ell(x, y, 3.6, 3.8), 'S'); c.only(ell(x - 1.0, y + 1.8, 2.8, 1.4), 's', 'S')
    c.fill(box(x + 0.4, y - 0.2, x + 1.4, y - 0.2), eye); c.fill(box(x + 2.6, y - 0.2, x + 3.0, y - 0.2), eye)


def robe(c, top, hem, x0, x1, ch):
    cells = poly([(x0 + 2.0, top), (x1, top), (x1 + 2.4, hem), (x0 - 2.6, hem)])
    for i, xx in enumerate(range(int(x0 - 3), int(x1 + 3))):
        if i % 3 == 1: cells -= {(xx, int(hem) - 1), (xx, int(hem) - 2), (xx, int(hem) - 3)}
        if i % 3 == 2: cells -= {(xx, int(hem) - 1)}
    c.fill(cells, ch)


def flame_wing(c, root, ang, L, n, base, edge, core, ph):
    """검은 불꽃 날개: 뿌리에서 뻗는 불꽃 혀 n개 (끝이 위로 휘어 일렁임)"""
    for i in range(n):
        a = math.radians(ang[0] + (ang[1] - ang[0]) * i / max(1, n - 1)); l = L * (0.75 + 0.25 * math.sin(i * 1.7 + ph))
        tip = (root[0] + math.cos(a) * l, root[1] + math.sin(a) * l - 2.0)
        mid = (root[0] + math.cos(a) * l * 0.55 + math.sin(i + ph) * 1.2, root[1] + math.sin(a) * l * 0.55)
        c.fill(path([root, mid, tip], 2.6 - i * 0.12, 0.6), base)
        c.only(path([root, mid, tip], 0.6), core, base)
    for (x, y) in [(x, y) for y in range(c.H) for x in range(c.W) if c.g[y][x] == base]:
        if c.get(x, y - 1) == '.' and c.get(x, y + 1) != '.': c.set(x, y, edge)


def arch(mode, opt):
    c = Cv(56, 60); fl = 1.6 if mode == 'idle1' else 0.0
    if opt == 'A':
        P = [((22.0, 18.0), (16.0, 6.0), [(6.0, 0.0), (3.0, 4.0), (2.0, 9.0)], [(9.0, 13.0)]),
             ((21.0, 21.0), (13.0, 16.0), [(2.0, 13.0), (0.6, 18.0), (1.6, 23.0)], [(7.0, 25.0)]),
             ((21.6, 24.0), (15.0, 28.0), [(5.0, 30.0), (5.6, 35.0), (8.4, 39.0)], [(12.0, 38.0)])]
        for k, (r, w, t, s) in enumerate(P):                                                                                  # 뒤쪽 짝 셋 (어둡게, 위로 비켜)
            fwing(c, (r[0] + 2, r[1] - 2), (w[0] + 2, w[1] - 2 - fl), [(x + 2, y - 2 - fl * 1.4) for (x, y) in t], [(x + 2, y - 2) for (x, y) in s], 'f', 'F', 'f')
        for k, (r, w, t, s) in enumerate(P):                                                                                  # 앞 날개 셋
            fwing(c, r, (w[0], w[1] - fl), [(x, y - fl * 1.4) for (x, y) in t], s, 'F', 'V', 'f')
        c.fill(poly([(23.0, 13.0), (26.0, 10.0), (29.0, 11.0), (25.0, 18.0), (23.4, 27.0), (20.4, 25.0)]), 'H')              # 뒤로 흐르는 긴 보랏빛 머리
        robe(c, 30.0, 52.0, 21.0, 33.4, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.fill(rbox(21.6, 16.6, 33.4, 31.0, 2.0), 'M'); blunt(c.g, 'M', 'x', 'N', bottom=1, side=0)                          # 먹빛 갑주
        c.fill(thins([(22.0, 23.6), (33.0, 23.6)]), 'x'); c.fill(box(21.4, 30.0, 33.6, 31.2), 'x')                           # 은보라 테
        c.fill(ell(31.6, 17.6, 3.6, 2.4), 'M'); c.only(thins([(28.6, 16.4), (34.4, 16.4)]), 'x', 'M')                         # 어깨받이
        face(c, 29.0, 10.6)
        c.fill(poly([(25.4, 12.6), (25.4, 7.4), (28.0, 5.8), (32.0, 6.2), (32.8, 8.4), (29.0, 8.0), (27.4, 10.0), (27.0, 15.0)]), 'H')
        for (a, b, cc) in (((27.0, 6.6), (24.6, 1.6), (22.6, 0.6)), ((28.6, 6.0), (27.6, 1.0), (26.0, -0.6)), ((30.4, 6.0), (30.6, 1.6), (29.6, 0.0)), ((25.6, 7.6), (22.4, 4.4), (20.4, 4.0))):
            c.fill(path([a, b, cc], 0.8, 0.4), 'k')                                                                           # 뒤로 솟은 검은 뿔 넷
    elif opt == 'B':
        for (dx, dy, base, lite) in ((2.0, -2.4, 'f', 'F'), (0.0, 0.0, 'F', 'W')):
            for (r, w, t, s) in (((22.0, 19.0), (14.0, 8.0), [(4.0, 4.0), (1.6, 9.0), (1.4, 14.0), (3.0, 19.0)], [(8.0, 21.0), (12.0, 22.0)]),
                                 ((22.0, 24.0), (14.4, 27.6), [(4.4, 27.0), (4.0, 32.0), (6.4, 36.6)], [(10.0, 37.0)])):
                fwing(c, (r[0] + dx, r[1] + dy), (w[0] + dx, w[1] + dy - fl), [(x + dx, y + dy - fl * 1.3) for (x, y) in t], [(x + dx, y + dy) for (x, y) in s], base, lite, 'f')
        for (x, y) in [(x, y) for y in range(c.H) for x in range(c.W) if c.g[y][x] in 'FWf']:                                 # 깃 끝부터 검게
            if math.hypot(x - 22, (y - 21) * 1.1) > 15.0: c.set(x, y, 'k')
        c.fill(poly([(21.0, 18.0), (26.0, 17.0), (24.0, 40.0), (17.0, 50.0), (14.0, 47.0)]), 'U'); blunt(c.g, 'U', 'U', 'u', bottom=1, side=0)   # 찢어진 검붉은 망토 (뒤)
        robe(c, 30.0, 52.0, 21.4, 33.0, 'G'); blunt(c.g, 'G', 'o', 'g', bottom=1, side=0)                                     # 빛바랜 금 갑주 자락
        c.fill(rbox(21.6, 16.6, 33.4, 31.0, 2.0), 'G'); blunt(c.g, 'G', 'o', 'g', bottom=1, side=0)
        c.fill(ell(31.6, 17.6, 3.6, 2.4), 'G'); c.fill(box(21.4, 29.6, 33.6, 30.8), 'g')
        for pts in ([(24.0, 18.6), (25.6, 22.0), (24.4, 25.6), (26.6, 29.0)], [(30.6, 20.0), (29.4, 23.4), (31.0, 26.0)], [(25.0, 33.0), (24.0, 37.0), (25.6, 41.0)], [(31.0, 34.0), (32.6, 38.6)]):
            c.only(thins(pts), 'P', 'Gog')                                                                                    # 번진 보랏빛 타락 줄기
        face(c, 29.0, 10.6)
        c.fill(poly([(25.6, 12.4), (25.4, 7.2), (28.0, 5.6), (32.0, 6.0), (32.8, 8.2), (29.0, 7.8), (27.4, 9.8), (27.0, 13.0)]), 'H')
        c.fill(rbox(25.0, 5.0, 32.6, 7.4, 1.0), 'G'); c.fill(thins([(25.4, 7.4), (32.4, 7.4)]), 'g')                         # 금 머리 테 (이마 위 · 둥글게 두르지 않음)
    else:
        for (dx, dy, base) in ((2.0, -2.4, 'f'), (0.0, 0.0, 'F')):                                                              # 검은 날개 둘 (먼 · 앞)
            fwing(c, (22.0 + dx, 20.0 + dy), (14.0 + dx, 9.0 + dy - fl), [(3.6 + dx, 6.0 + dy - fl), (1.6 + dx, 11.4 + dy - fl), (2.0 + dx, 17.0 + dy - fl), (4.6 + dx, 22.0 + dy - fl)], [(9.0 + dx, 25.0 + dy), (13.0 + dx, 25.6 + dy)], base, 'P', 'f')
        W = [(x, y) for y in range(c.H) for x in range(c.W) if c.g[y][x] in 'fFP']
        for (x, y) in W:                                                                                                      # 날개 둘레에서 위로 일렁이는 보랏빛 불꽃 혀
            if c.get(x, y - 1) == '.' and (x * 7 + y * 3 + int(fl * 3)) % 4 == 0:
                h = 2 + (x + y + int(fl)) % 3
                for k in range(1, h + 1): c.set(x - (k // 2), y - k, 'p' if k == h else 'P')
        for (x, y) in W:
            if c.g[y][x] == 'F' and (x + 2 * y) % 9 == 0: c.set(x, y, 'P')
        c.fill(poly([(23.0, 13.0), (26.0, 10.0), (29.0, 11.0), (25.0, 18.0), (23.4, 24.0), (21.0, 22.0)]), 'H')
        robe(c, 17.0, 52.0, 21.4, 33.0, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)                                     # 검붉은 긴 옷
        c.fill(box(21.8, 27.0, 33.0, 28.0), 'k'); c.fill(thins([(27.0, 17.4), (27.0, 26.6)]), 'c')
        c.fill(rbox(24.6, 15.6, 32.6, 18.4, 1.0), 'C')
        face(c, 29.0, 10.6, eye='k')
        c.fill(box(29.0, 10.0, 30.4, 10.4), 'P'); c.fill(box(31.4, 10.0, 32.2, 10.4), 'P')                                   # 가면 같은 얼굴의 보랏빛 눈
        c.fill(poly([(25.4, 12.6), (25.4, 7.0), (28.0, 5.4), (32.0, 5.8), (32.8, 8.0), (29.0, 7.6), (27.4, 9.6), (27.0, 16.0)]), 'H')
    return c


PAL = {
    'A': {'F': '#3a3048', 'V': '#6a5a82', 'f': '#1c1624', 'H': '#4a3268', 'h': '#2a1c40', 'C': '#2e2440', 'Q': '#463a5e', 'c': '#1a1428',
          'M': '#2a2236', 'N': '#16121e', 'x': '#b8a8d8', 'S': '#dcd4e4', 's': '#aca0b8', 'e': '#ff3a4a', 'k': '#120e16',
          'J': '#2a2236', 'g': '#b8a8d8', 'P': '#9a5af0', 'o': '#f0d8ff'},
    'B': {'F': '#7a7484', 'W': '#a8a2b4', 'f': '#4a4652', 'k': '#16121c', 'U': '#5a1a24', 'u': '#3a0e16', 'G': '#b8963a', 'o': '#e0c070', 'g': '#6e5420',
          'P': '#a050e8', 'p': '#5a2a90', 'S': '#d8d0dc', 's': '#a89cb0', 'e': '#ff3a4a', 'H': '#3a2a30', 'J': '#2a2026'},
    'C': {'f': '#1e1228', 'F': '#2c1a3a', 'P': '#6a34a0', 'p': '#c088ff', 'H': '#16101a', 'C': '#4a1424', 'Q': '#6a2436', 'c': '#2a0a14', 'k': '#120a10',
          'S': '#e4dee8', 's': '#b4aabc', 'X': '#f0d8ff', 'Y': '#9a5af0', 'O': '#3a1a50', 'R': '#120a16'},
}
LAB = {'A': ('A 여섯 검은 날개', '위 · 가운데 · 아래로 겹친 검은 깃털 날개 셋과 뒤쪽 짝 셋 · 은보라 테를 두른 먹빛 갑주와 어깨받이 · 뒤로 솟은 검은 뿔 넷 · 뒤로 흐르는 긴 보랏빛 머리 · 붉은 눈 · 보랏빛 불꽃 수정 지팡이 · 찢어진 긴 옷자락', 'vscep'),
       'B': ('B 녹슨 금빛 갑주', '빛바랜 금 갑주에 번진 보랏빛 타락 줄기 · 끝이 검게 물든 잿빛 날개 넷 · 이마 위 금 머리 테 · 붉은 눈 · 등 뒤 찢어진 검붉은 망토 · 보랏빛 수정 창', 'dspear'),
       'C': ('C 검은 불꽃 날개', '불타는 검은 깃털 날개 둘 — 둘레에서 위로 일렁이는 보랏빛 불꽃 혀 · 검붉은 긴 옷 · 창백한 가면 같은 얼굴에 보랏빛 눈 · 검은 머리 · 손 위 검은 불꽃 구슬', 'forb')}
for opt in 'ABC':
    wm = {'X': 'X', 'Y': 'Y', 'O': 'O', 'R': 'R'} if opt == 'C' else None
    e = B.add('fallenarch' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [arch('idle0', opt), arch('idle1', opt)], PAL[opt], (32, 18), 27, pad=4,
              arm=['M', 'N'] if opt == 'A' else (['G', 'g'] if opt == 'B' else ['C', 'c']), hand='S', wpn=LAB[opt][2], idle={'h': [3, 4], 'a': -75})
    if wm: e['wmap'] = wm
B.dump()
