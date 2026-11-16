"""스핑크스 (sphinx · 천계의 유적 폐허 · 짐승+괴물 · 흙 · 마법 · 맞히면 마비) 시안 — 네발 짐승(사자 몸 · 사람 얼굴) · still · noArm
마법 기본 공격 = wroar(고개를 들어 눈빛을 모았다가 내뿜음 → 구슬) · 스킬 = 눈빛 광선 · 공격 갈래 qpounce/qcharge(앞발)
A 사막 왕관 스핑크스: 황갈색 사자 몸 · 파랑과 금 줄무늬 머릿수건(양 어깨로 늘어진 자락) · 금 목깃 · 구릿빛 얼굴 · 빛나는 눈
B 날개 스핑크스: 금빛 사자 몸 · 등에 접은 크림빛 깃털 날개 · 땋아 내린 검은 머리와 금 머리띠 · 꼬리 술
C 석상 스핑크스: 몸 전체가 금 간 사암 석상 · 새긴 줄 머릿수건(색 없음) · 하늘빛으로 빛나는 눈 · 깨진 귀퉁이 · 이끼
피한 것: 가짜 수염(유명한 석상 그대로) · 십자 · 후광"""
from kit import *
from quad import body4, rot
from feath import layer, wing_feathers

ACT = {'mag': ['wroar'], 'atk': ['qpounce', 'qcharge'], 'skl': ['wroar'], 'tk': 1.0,
       'fx': {'mag': {'pal': 'arcane', 'hit': 'flash', 'p': 'orb'}, 'atk': {'pal': 'earth', 'hit': 'claw'},
              'skl': {'pal': 'arcane', 'hit': 'vortex', 'p': 'beam', 'big': 1, 'after': 'motes'}}}
B = Batch('sphinx1', 'sphinx', ACT, 'ruins', show=[['wroar', 3], ['wroar', 5], ['qpounce', 4]], still=1, noArm=1, wpn='none')
MODES = ['idle0', 'idle1', 'charge', 'leap', 'swell', 'spit']
S0 = dict(gy=30.0, ll=5.2, bl=15.0, bh=9.0, bx=15.0, lw=2.3, nk=(2.2, 4.4), nw=3.4)
K = 1.4


def tail(c, hip, mode, ch, tuft):
    hx, hy = hip
    flick = {'idle1': 1.4, 'leap': -2.0, 'charge': 1.0}.get(mode, 0.0)
    pts = [(hx + -0.6*K, hy + -1.0*K), (hx + -4.0*K, hy + -2.6*K), (hx - 5.6, hy - 6.4 + flick * 0.3), (hx - 4.6 + flick, hy - 9.2 + flick * 0.5)]
    c.fill(path(pts, 0.8, 0.6), ch); c.fill(ell(pts[-1][0], pts[-1][1] - 0.6, 1.4, 1.6), tuft)


def sphinx(mode, opt):
    c = Cv(40, 36); P = {}
    pal_body = 'C'
    shp, hip, nk, fx_, cen = body4(c, mode, S0, ch='C', far='c', leg='C', farleg='c', foot='C')
    c.fill(ell(shp[0] + 0.6, shp[1] + 1.6, 3.6, 4.0), 'C')                                                                   # 넓은 가슴
    tail(c, hip, mode, 'C' if opt != 'C' else 'c', 'h' if opt == 'B' else ('H' if opt == 'A' else 'c'))
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    hx, hy = nk[0] + 1.2, nk[1] - 2.4
    if opt == 'B':                                                                                                                # 등에 접은 깃털 날개
        root = (shp[0] - 0.6, shp[1] - 2.2); wr = (shp[0] - 3.6, shp[1] - 7.2 + (1.6 if mode in ('swell',) else 0) - (2.0 if mode == 'leap' else 0))
        prim, sec = wing_feathers(root, wr, [(wr[0] - 6.6, wr[1] + 0.6), (wr[0] - 7.4, wr[1] + 2.6), (wr[0] - 7.0, wr[1] + 4.6), (wr[0] - 5.6, wr[1] + 6.2)], [(wr[0] - 3.2, wr[1] + 6.6), (wr[0] - 0.6, wr[1] + 6.2)])
        layer(c, sec, 'W', 'w', 'V'); layer(c, prim, 'W', 'w', 'V')
        c.fill(path([root, wr], 1.1, 0.9), 'W'); c.only(thin(root, wr), 'w', 'W')
    # 머리
    if opt in ('A', 'C'):
        cloth = 'N' if opt == 'A' else 'C'
        nem = poly([(hx + -3.6*K, hy + -2.6*K), (hx + 1.4*K, hy + -3.8*K), (hx + 2.6*K, hy + -1.0*K), (hx + 1.0*K, hy + 2.0*K), (hx + 0.6*K, hy + 6.2*K), (hx + -1.6*K, hy + 6.4*K), (hx + -4.8*K, hy + 3.2*K)])
        c.fill(nem, cloth)                                                                                                        # 머릿수건 (뒤로 · 어깨로 늘어진 자락)
        if opt == 'A':
            for k in range(-3, 7, 2): c.only(thins([(hx - 5.0, hy + k), (hx + 2.6, hy + k - 0.6)]), 'G', 'N')                    # 파랑 · 금 줄무늬 (가로 줄만)
        else:
            for k in range(-2, 7, 2): c.only(thins([(hx - 5.0, hy + k), (hx + 2.6, hy + k - 0.6)]), 'd', 'C')                    # 새긴 줄
            blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        face = poly([(hx + -0.4*K, hy + -2.2*K), (hx + 2.4*K, hy + -2.4*K), (hx + 3.4*K, hy + -0.4*K), (hx + 3.2*K, hy + 2.4*K), (hx + 1.6*K, hy + 3.4*K), (hx + -0.4*K, hy + 2.6*K)])
        c.fill(face, 'S' if opt == 'A' else 'C'); c.only(thins([(hx + 0.2*K, hy + 2.6*K), (hx + 1.6*K, hy + 3.2*K)]), 's' if opt == 'A' else 'c', 'SC')
        c.fill(thins([(hx + -0.6*K, hy + -2.6*K), (hx + 2.8*K, hy + -2.8*K)]), 'G' if opt == 'A' else 'Q')                                # 이마 띠
    else:
        hair = poly([(hx + -3.2*K, hy + -2.4*K), (hx + 1.6*K, hy + -3.6*K), (hx + 2.0*K, hy + -1.6*K), (hx + -0.4*K, hy + 0.4*K), (hx + -1.0*K, hy + 7.4*K), (hx + -3.6*K, hy + 6.6*K), (hx + -4.2*K, hy + 1.0*K)])
        c.fill(hair, 'H')                                                                                                        # 땋아 내린 검은 머리
        for k in range(1, 7, 2): c.only({(int(hx - 2.6), int(hy + k)), (int(hx - 1.8), int(hy + k))}, 'h', 'H')
        face = poly([(hx + -0.4*K, hy + -2.0*K), (hx + 2.4*K, hy + -2.4*K), (hx + 3.4*K, hy + -0.4*K), (hx + 3.2*K, hy + 2.4*K), (hx + 1.6*K, hy + 3.4*K), (hx + -0.4*K, hy + 2.6*K)])
        c.fill(face, 'S'); c.only(thins([(hx + 0.2*K, hy + 2.6*K), (hx + 1.6*K, hy + 3.2*K)]), 's', 'S')
        c.fill(thins([(hx + -1.8*K, hy + -2.6*K), (hx + 2.6*K, hy + -2.8*K)]), 'G')                                                       # 금 머리띠
    glow = mode in ('swell', 'spit')
    c.fill(box(hx + 1.4, hy - 0.6, hx + 2.4, hy - 0.6), 'E' if (glow or opt == 'C') else 'k')                                   # 눈 (마법을 모으면 빛남)
    if glow: c.set(hx + 3.4, hy - 0.8, 'L')
    if mode == 'spit': c.fill(box(hx + 2.4, hy + 1.6, hx + 3.0, hy + 1.6), 'k')                                                 # 벌린 입
    if opt == 'A':
        c.fill(poly([(hx + -3.4*K, hy + 3.0*K), (hx + 1.2*K, hy + 3.4*K), (hx + 1.4*K, hy + 5.0*K), (hx + -2.0*K, hy + 5.6*K)]), 'G')            # 금 목깃
    if opt == 'C':
        for pts in ([(cen[0] - 2, cen[1] - 2), (cen[0], cen[1]), (cen[0] - 1, cen[1] + 2)], [(cen[0] + 5, cen[1] - 3), (cen[0] + 6, cen[1] - 1)]):
            c.only(thins(pts), 'd', 'CQc')
        c.only(ell(cen[0] - 5, cen[1] + 3.4, 2.2, 0.8) | ell(shp[0] + 1, S0['gy'] - 0.4, 1.6, 0.6), 'A', 'CQc')                # 이끼
        c.fill(poly([(hip[0] - 3.0, hip[1] - 3.6), (hip[0] - 0.6, hip[1] - 4.4), (hip[0] - 2.0, hip[1] - 2.6)]), '_')           # 깨진 귀퉁이
    P['tip'] = (hx + 3.0*K, hy + -0.6*K)
    return c, P


PAL = {
    'A': {'C': '#e2b264', 'Q': '#f6d28c', 'c': '#a8783a', 'd': '#6e4a22', 'N': '#2e56b0', 'G': '#f0c444', 'g': '#a8842a', 'S': '#c88a56', 's': '#9a6436',
          'H': '#5a3a20', 'h': '#3a2410', 'E': '#7ae8ff', 'L': '#e8ffff', 'k': '#2a1a10'},
    'B': {'C': '#e8b45a', 'Q': '#fbd690', 'c': '#ae7a34', 'd': '#704a1e', 'W': '#ecd8a8', 'w': '#fff4d8', 'V': '#a8885a', 'G': '#f0c444', 'S': '#e0b08a', 's': '#b07e58',
          'H': '#2a1e1a', 'h': '#140e0c', 'E': '#c87aff', 'L': '#f4e0ff', 'k': '#2a1a10'},
    'C': {'C': '#cdb488', 'Q': '#e6d2aa', 'c': '#9a8258', 'd': '#6a5636', 'A': '#6a9a48', 'E': '#6ae8ff', 'L': '#e0ffff', 'k': '#2a2016'},
}
LAB = {'A': ('A 사막 왕관 스핑크스', '황갈색 사자 몸 · 파랑과 금 줄무늬 머릿수건(뒤와 양 어깨로 늘어진 자락 · 가로 줄만) · 금 이마 띠와 금 목깃 · 구릿빛 얼굴 · 마법을 모으면 하늘빛으로 빛나는 눈 · 꼬리 술'),
       'B': ('B 날개 스핑크스', '금빛 사자 몸 · 등에 접은 크림빛 깃털 날개 · 땋아 내린 검은 머리와 금 머리띠 · 밝은 얼굴 · 마법을 모으면 보랏빛으로 빛나는 눈 · 검은 꼬리 술'),
       'C': ('C 석상 스핑크스', '몸 전체가 금 간 사암 석상 · 새긴 줄 머릿수건(색 없음) · 하늘빛으로 늘 빛나는 눈 · 엉덩이의 깨진 귀퉁이 · 발치와 배의 이끼')}
for opt in 'ABC':
    fr = {m: sphinx(m, opt) for m in MODES}
    tip = fr['idle0'][1]['tip']
    B.add('sphinx' + ('' if opt == 'A' else '_' + opt.lower()), LAB[opt][0], LAB[opt][1], [fr['idle0'][0], fr['idle1'][0]], PAL[opt], tip, S0['bx'] + 1,
          gm={m: fr[m][0] for m in ('charge', 'leap', 'swell', 'spit')})
B.dump()
