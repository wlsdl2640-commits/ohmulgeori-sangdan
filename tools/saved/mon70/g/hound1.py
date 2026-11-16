"""월광 사냥개 (moonhound · 별의 정원 · 짐승 · 얼음 · 2연타 · 맞히면 출혈) 시안 — 네발 짐승 · still · noArm
공격 qbite/qpounce · 스킬 qmaul(덮쳐 물기)
A 은빛 시가하운드: 깊은 가슴 · 잘록한 배 · 길고 가는 다리와 주둥이 · 은푸른 털 · 어깨의 둥근 보름달 무늬 · 얼음빛 눈
B 서리 갈기 사냥개: 다부진 몸 · 짙은 남빛 털 · 목과 등을 따라 솟은 얼음 결정 갈기 · 얼음빛 눈 · 입김
C 그림자 달 사냥개: 보랏빛 검은 몸에 달빛 테두리 · 털에 박힌 별 · 꼬리 끝에 매달린 빛나는 달 구슬
피한 것: 흰 늑대 + 붉은 무늬(유명한 신 늑대) · 초승달과 별(상징) · 더하기 꼴 반짝이"""
from kit import *
from quad import body4

ACT = {'atk': ['qbite', 'qpounce'], 'skl': ['qmaul'], 'tk': 0.9,
       'fx': {'atk': {'pal': 'ice', 'hit': 'bite'}, 'skl': {'pal': 'ice', 'hit': 'claw', 'big': 1, 'after': 'motes'}}}
B = Batch('hound1', 'moonhound', ACT, 'stargarden', show=[['qbite', 4], ['qpounce', 4]], still=1, noArm=1, wpn='none')
MODES = ['idle0', 'idle1', 'bite', 'charge', 'leap']
SS = {'A': dict(gy=26.0, ll=7.4, bl=14.0, bh=6.0, bx=14.0, lw=1.2, nk=(3.2, 4.0), nw=2.0),
      'B': dict(gy=26.0, ll=5.6, bl=14.6, bh=7.4, bx=14.0, lw=1.8, nk=(2.6, 3.4), nw=2.8),
      'C': dict(gy=26.0, ll=6.4, bl=14.0, bh=6.6, bx=14.0, lw=1.5, nk=(2.8, 3.6), nw=2.4)}


def head(c, nk, mode, opt, ch='C', snout=4.2):
    hx, hy = nk[0] + 0.6, nk[1] - 0.8; op = mode in ('bite', 'leap')
    c.fill(ell(hx, hy, 2.6, 2.2), ch)                                                                                         # 머리
    c.fill(poly([(hx + 0.6, hy - 1.4), (hx + snout + 1.0, hy - 0.2), (hx + snout + 1.0, hy + 0.8), (hx + 0.6, hy + 1.2)]), ch)   # 주둥이
    if op:
        c.fill(poly([(hx + 0.4, hy + 1.0), (hx + snout, hy + 2.6), (hx + snout - 0.4, hy + 3.4), (hx - 0.2, hy + 2.0)]), ch)   # 벌린 아래턱
        c.fill(thins([(hx + 1.4, hy + 1.4), (hx + snout, hy + 1.8)]), 'k'); c.set(hx + snout - 0.6, hy + 1.2, 'w'); c.set(hx + 2.4, hy + 1.6, 'w')
    c.fill(poly([(hx - 1.6, hy - 1.4), (hx - 2.6, hy - 5.0 + (0.6 if mode == 'idle1' else 0)), (hx - 0.2, hy - 2.0)]), ch)   # 뾰족한 귀
    c.set(hx + snout + 0.8, hy - 0.2, 'k')                                                                                    # 코
    return hx, hy


def hound(mode, opt):
    c = Cv(36, 30); S = SS[opt]
    shp, hip, nk, fxm, cen = body4(c, mode, S, ch='C', far='c', leg='C', farleg='c')
    if opt == 'A':
        c.fill(ell(shp[0] + 0.4, shp[1] + 1.6, 2.8, 3.4), 'C')                                                              # 깊은 가슴
        tuck = poly([(cen[0] - 3.0, cen[1] + S['bh'] * 0.5), (cen[0] + 1.0, cen[1] + S['bh'] * 0.5), (cen[0] - 1.0, cen[1] + 1.2)])
        c.fill({q for q in tuck if c.get(*q) == 'C'}, '_')                                                                    # 잘록한 배
    flick = {'idle1': 1.2, 'leap': -1.6, 'charge': 0.8}.get(mode, 0.0)
    if opt == 'B':
        c.fill(path([(hip[0] - 0.4, hip[1] - 0.4), (hip[0] - 3.4, hip[1] - 1.8 + flick), (hip[0] - 5.4, hip[1] - 4.0 + flick)], 1.4, 0.9), 'C')   # 굵은 꼬리
    else:
        c.fill(path([(hip[0] - 0.4, hip[1] - 0.4), (hip[0] - 3.6, hip[1] + 0.8 + flick), (hip[0] - 6.4, hip[1] - 0.6 + flick), (hip[0] - 7.6, hip[1] - 3.2 + flick)], 0.7, 0.5), 'C')   # 가늘고 긴 꼬리
    hx, hy = head(c, nk, mode, opt, snout=5.0 if opt == 'A' else 3.6)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(box(hx + 0.6, hy - 0.8, hx + 1.4, hy - 0.8), 'E')                                                                 # 얼음빛 눈
    if opt == 'A':
        c.fill(ell(shp[0] - 1.6, shp[1] - 0.4, 1.8, 1.8), 'Y'); c.only(ell(shp[0] - 1.2, shp[1] - 0.8, 0.8, 0.8), 'y', 'Y')     # 어깨의 둥근 보름달 무늬
    if opt == 'B':
        base = [(nk[0] - 1.0, nk[1] - 1.0), (shp[0] - 0.6, shp[1] - 2.6), (cen[0] + 1.6, cen[1] - S['bh'] * 0.5 - 0.6), (cen[0] - 3.0, cen[1] - S['bh'] * 0.5)]
        for i, (x, y) in enumerate(base):                                                                                      # 목과 등을 따라 솟은 얼음 결정 갈기
            h = 4.4 - i * 0.7; lean = -1.4
            c.fill(poly([(x - 1.0, y + 0.6), (x + lean, y - h), (x + 1.0, y + 0.6)]), 'X'); c.only(thin((x - 0.2, y), (x + lean * 0.8, y - h + 0.8)), 'x', 'X')
        if mode in ('bite', 'charge'): c.fill(ell(hx + 6.4, hy + 0.6, 1.4, 0.8), 'x')                                       # 입김
    if opt == 'C':
        for (x, y) in [(cen[0] - 3, cen[1] - 1), (cen[0] + 2, cen[1] + 1), (cen[0] - 0.6, cen[1] - 2.4), (shp[0] - 1, shp[1] + 2), (hip[0] + 1, hip[1] + 2)]: c.set(x, y, 'L')   # 털에 박힌 별
        tx, ty = hip[0] - 7.6, hip[1] - 3.2 + flick
        c.fill(ell(tx, ty - 1.2, 1.8, 1.8), 'Y'); c.set(tx - 0.4, ty - 1.8, 'y')                                              # 꼬리 끝 달 구슬
    return c


PAL = {
    'A': {'C': '#b8c8e8', 'Q': '#e8f0ff', 'c': '#7a8ab8', 'k': '#141828', 'w': '#ffffff', 'E': '#6ae0ff', 'Y': '#fff0b0', 'y': '#ffffff'},
    'B': {'C': '#3a4a7a', 'Q': '#5a6eaa', 'c': '#222c50', 'k': '#0e1222', 'w': '#ffffff', 'E': '#7af0ff', 'X': '#a8e8ff', 'x': '#effcff'},
    'C': {'C': '#3a2a5a', 'Q': '#9a8ad8', 'c': '#22183a', 'k': '#0e0a18', 'w': '#ffffff', 'E': '#c8b0ff', 'L': '#fff6c0', 'Y': '#fff0b0', 'y': '#ffffff'},
}
LAB = {'A': ('A 은빛 시가하운드', '깊은 가슴 · 잘록한 배 · 길고 가는 다리 · 긴 주둥이 · 은푸른 털 · 어깨의 둥근 보름달 무늬 · 얼음빛 눈 · 가늘고 긴 꼬리'),
       'B': ('B 서리 갈기 사냥개', '다부진 몸과 짙은 남빛 털 · 목과 등을 따라 솟은 얼음 결정 갈기 · 얼음빛 눈 · 물 때 하얀 입김 · 굵은 꼬리'),
       'C': ('C 그림자 달 사냥개', '보랏빛 검은 몸에 달빛 테두리 · 털에 박힌 별 · 연보랏빛 눈 · 꼬리 끝에 매달린 빛나는 달 구슬')}
for opt in 'ABC':
    fr = {m: hound(m, opt) for m in MODES}
    tip = (SS[opt]['bx'] + SS[opt]['bl'] * 0.5 + SS[opt]['nk'][0] + 5.0, SS[opt]['gy'] - SS[opt]['ll'] - SS[opt]['bh'] * 0.75 - SS[opt]['nk'][1])
    B.add('moonhound' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'], fr['idle1']], PAL[opt], tip, SS[opt]['bx'] + 1,
          gm={m: fr[m] for m in ('bite', 'charge', 'leap')})
B.dump()
