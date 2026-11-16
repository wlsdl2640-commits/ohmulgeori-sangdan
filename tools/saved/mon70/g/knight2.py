"""성좌 기사 (constellation · 별의 정원 · 인간 · 강철 · 맞히면 출혈) 시안 2 — 11-16 22:15 사용자 「다시」
첫 시안(가는 몸 · 가는 나무 창)보다 큰 몸(ms 1.25) · 새 무기 「별빛 창」(slance — 긴 금 자루 끝 별 수정 날)
A 별자리 그림 기사: 속이 비친 듯한 짙은 남보랏빛 몸 · 마디마다 빛나는 별과 별을 잇는 빛 줄(몸이 별자리 그림) · 가로 틈 투구
B 천구 방패 기사: 두꺼운 남빛 판금에 금빛 별 지도 새김 · 먼 팔의 큰 둥근 방패(별 길 고리와 별) · 투구 위 짧은 하늘빛 술 볏
C 유성 망토 기사: 먹빛 은 갑주 · 어깨에서 뒤로 타오르는 푸르고 흰 유성 불꽃 망토 · 빛나는 투구 틈
D 은하 망토 기사: 날씬한 은청 갑주 · 땅에 끌리는 은하 망토(분홍 · 보라 소용돌이 · 별) · 투구 이마의 작은 다섯 꼭지 별
피한 것: 투구 틈의 세로 콧대(십자) · 짐승 꼴 화려한 갑옷(유명한 별자리 전사) · 날개 투구 · 후광 · 방패의 십자 · 더하기 꼴 반짝이"""
from kit import *

ACT = {'atk': ['thrust', 'side'], 'skl': ['pjump'], 'tk': 1.1,
       'fx': {'atk': {'pal': 'star', 'hit': 'pierce'}, 'skl': {'pal': 'star', 'hit': 'star', 'big': 1, 'after': 'motes'}}}
B = Batch('knight2', 'constellation', ACT, 'stargarden', show=[['thrust', 4], ['pjump', 5]], ms=1.25, mx=20, my=20, wpn='slance')
B.extra = head_js('slance', """
..y..
.yYy.
.YLY.
.YLY.
.YLY.
.yYy.
..Y..
GGYGG
""", '별빛 창 (성좌 기사): 긴 금 자루 끝 길쭉한 별 수정 날 · 날 가운데 흰 빛 · 금 날밑', L=9.0, shaft='G', fxw='pole')


def star5(cx, cy, R, r, rot=-90):
    return poly([(cx + math.cos(math.radians(rot + k * 36)) * (R if k % 2 == 0 else r), cy + math.sin(math.radians(rot + k * 36)) * (R if k % 2 == 0 else r)) for k in range(10)])


def knight(c, plate='C', far='c', heavy=1.0):
    """큰 기사 몸 (앞팔 없음): 다리 · 먼 팔 · 갑옷 자락 · 가슴 · 어깨 · 투구"""
    w = heavy
    c.fill(rbox(11.6, 24.0, 15.4, 33.4, 0.8), far); c.fill(rbox(10.6, 32.4, 16.6, 34.4, 0.6), far)                           # 먼 다리
    c.fill(rbox(17.4, 24.0, 21.4, 33.4, 0.8), plate); c.fill(rbox(16.6, 32.4, 23.4, 34.4, 0.6), plate)                       # 가까운 다리
    c.fill(rbox(16.8, 27.2, 22.0, 29.2, 0.6), plate)                                                                          # 무릎 판
    c.fill(path([(11.6, 14.2), (9.6, 19.6), (9.4, 23.0)], 2.2, 1.9), far)                                                   # 먼 팔
    c.fill(poly([(10.6, 21.4), (21.4, 21.4), (23.0, 27.0), (9.4, 27.0)]), plate)                                            # 갑옷 자락
    c.fill(poly([(10.4 - w, 11.8), (21.8 + w, 11.8), (22.4 + w, 15.6), (21.0, 22.4), (11.4, 22.4), (10.0 - w, 15.6)]), plate)   # 가슴 판금
    c.fill(ell(21.0, 12.8, 3.4 + w, 2.4), plate); c.fill(ell(11.4, 12.8, 2.8, 2.2), far)                                   # 어깨받이
    c.fill(rbox(12.8, 2.6, 20.6, 11.0, 2.8), plate)                                                                          # 둥근 투구
    c.fill(rbox(13.8, 10.2, 19.8, 12.2, 0.4), far)


def visor(c, eye='E'):
    c.fill(box(16.2, 6.0, 20.6, 7.2), 'k'); c.fill(box(17.2, 6.2, 18.0, 6.8), eye); c.fill(box(19.4, 6.2, 20.0, 6.8), eye)


# ── A 별자리 그림 기사 ─────────────────────────────
PA = {'C': '#2c2a66', 'Q': '#4a46a0', 'c': '#1a1844', 'k': '#08081c', 'E': '#c8f4ff', 'L': '#ffffff', 'l': '#8ac8ff', 'G': '#c8d8ff', 'g': '#7a8ac8',
      'Y': '#c8f4ff', 'y': '#7ad8ff'}


def figure():
    c = Cv(34, 40)
    knight(c)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    visor(c)
    J = {'head': (16.4, 3.6), 'neck': (16.6, 11.6), 'sf': (11.4, 12.6), 'sn': (21.0, 12.4), 'ef': (9.8, 18.6), 'hf': (9.4, 23.0),
         'hip': (16.0, 22.6), 'kf': (13.4, 28.4), 'kn': (19.6, 28.4), 'ff': (13.0, 33.6), 'fn': (20.0, 33.6), 'ch': (16.4, 17.0)}
    for a, b in (('head', 'neck'), ('neck', 'sf'), ('neck', 'sn'), ('sf', 'ef'), ('ef', 'hf'), ('neck', 'ch'), ('ch', 'hip'), ('hip', 'kf'), ('hip', 'kn'), ('kf', 'ff'), ('kn', 'fn')):
        c.only(thin(J[a], J[b]), 'l', 'CQck')                                                                                # 별을 잇는 빛 줄
    for k in J.values(): c.set(k[0], k[1], 'L')                                                                              # 마디마다 빛나는 별
    for k in ('sn', 'ch', 'hip'): x, y = J[k]; c.set(x + 1, y, 'L'); c.set(x, y + 1, 'L'); c.set(x + 1, y + 1, 'L')         # 큰 별 셋 (2칸)
    return c


B.add('constellation', 'A 별자리 그림 기사', '속이 비친 듯한 짙은 남보랏빛 몸 · 투구 · 어깨 · 팔꿈치 · 가슴 · 허리 · 무릎 · 발의 빛나는 별과 별을 잇는 하늘빛 줄(몸이 별자리 그림) · 가로 틈 투구의 하늘빛 눈 · 하늘빛 별빛 창',
      figure(), PA, [21, 13], 17, 22, arm=['C', 'c'], hand='C', wmap={'G': 'G', 'g': 'g', 'Y': 'Y', 'y': 'y', 'L': 'L'}, idle={'h': [2, 3], 'a': -70})


# ── B 천구 방패 기사 ─────────────────────────────
PB = {'C': '#2a3c8a', 'Q': '#4a62b8', 'c': '#18245a', 'k': '#080c1e', 'E': '#9ae8ff', 'G': '#e8c050', 'g': '#a8842a', 'L': '#fff6c0', 'Y': '#ffe070', 'y': '#c8a440',
      'V': '#141a4a', 'v': '#3a4a9a', 'P': '#9ad8ff', 'p': '#e8f8ff'}


def orrery():
    c = Cv(34, 40)
    knight(c, heavy=1.4)
    c.fill(path([(15.0, 2.0), (12.0, 1.8), (9.6, 3.4)], 1.4, 0.8), 'P'); c.only(path([(15.0, 2.0), (12.6, 1.8)], 0.5), 'p', 'P')   # 투구 위 짧은 술 볏 (앞에서 뒤로)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    visor(c)
    for pts in ([(12.4, 15.0), (15.0, 13.6), (18.6, 15.6), (20.4, 14.0)], [(12.6, 19.6), (16.0, 18.0), (19.8, 19.6)]): c.only(thins(pts), 'g', 'CQc')
    for (x, y) in ((15.0, 13.6), (18.6, 15.6), (16.0, 18.0), (12.6, 19.6)): c.set(x, y, 'G')                                # 금빛 별 지도 새김
    sh = ell(9.0, 19.4, 5.6, 6.6)
    c.fill(sh, 'V'); c.only({q for q in sh if (q[0] + 1, q[1]) not in sh or (q[0], q[1] - 1) not in sh or (q[0] - 1, q[1]) not in sh or (q[0], q[1] + 1) not in sh}, 'G', 'V')   # 큰 둥근 방패 · 금테
    c.only(set((int(9.0 + 3.6 * math.cos(math.radians(a))), int(19.6 + 2.0 * math.sin(math.radians(a)))) for a in range(0, 360, 12)), 'v', 'V')   # 별 길 고리 (비스듬한 타원 하나)
    for (x, y) in ((7.0, 17.0), (11.0, 20.6), (8.4, 22.6), (10.4, 16.0)): c.set(x, y, 'L')
    c.fill(ell(9.0, 19.6, 1.2, 1.2), 'Y')
    return c


B.add('constellation_b', 'B 천구 방패 기사', '두꺼운 남빛 판금에 금빛 별 지도 새김 · 먼 팔의 큰 둥근 방패(금테 · 비스듬한 별 길 고리 · 별 넷 · 가운데 금빛 해) · 투구 위 앞에서 뒤로 난 짧은 하늘빛 술 볏 · 금 별빛 창',
      orrery(), PB, [22, 13], 17, 22, arm=['C', 'c'], hand='C', idle={'h': [2, 3], 'a': -70})


# ── C 유성 망토 기사 ─────────────────────────────
PC = {'C': '#5a6078', 'Q': '#8a90aa', 'c': '#363a4e', 'k': '#0a0c16', 'E': '#9ae8ff', 'G': '#c8d8ff', 'g': '#7a8ac8', 'Y': '#c8f4ff', 'y': '#7ad8ff', 'L': '#ffffff',
      'F': '#5ab8ff', 'f': '#2a6ad0', 'w': '#e8f8ff'}


def meteor(mode):
    c = Cv(40, 40); ph = 1.2 if mode == 'idle1' else 0.0
    for i in range(6):                                                                                                       # 어깨에서 뒤로 타오르는 유성 불꽃 망토
        r0 = (14.0 - i * 0.4, 11.0 + i * 3.0); L = 10.0 - abs(i - 2) * 1.2 + (ph if i % 2 else -ph * 0.5)
        tip = (r0[0] - L, r0[1] - 2.4 - i * 0.3)
        c.fill(path([r0, ((r0[0] + tip[0]) / 2, (r0[1] + tip[1]) / 2 + 1.0), tip], 2.4, 0.4), 'F')
    for (x, y) in [(x, y) for y in range(c.H) for x in range(c.W) if c.g[y][x] == 'F']:
        if c.get(x, y - 1) == '.': c.set(x, y, 'w')
        elif (x + y) % 5 == 0: c.set(x, y, 'f')
    c.move((0, 0, 39, 39), 6, 0)
    k2 = Cv(40, 40); knight(k2); blunt(k2.g, 'C', 'Q', 'c', bottom=1, side=0); visor(k2)
    k2.move((0, 0, 39, 39), 6, 0)
    comp(c, k2)
    return c


B.add('constellation_c', 'C 유성 망토 기사', '먹빛 은 갑주 · 어깨에서 뒤로 타오르는 푸르고 흰 유성 불꽃 망토(일렁임) · 빛나는 투구 틈 · 하늘빛 별빛 창',
      [meteor('idle0'), meteor('idle1')], PC, [27, 13], 23, 22, arm=['C', 'c'], hand='C', wmap={'G': 'G', 'g': 'g', 'Y': 'Y', 'y': 'y', 'L': 'L'}, idle={'h': [2, 3], 'a': -70})


# ── D 은하 망토 기사 ─────────────────────────────
PD = {'C': '#a8b8dc', 'Q': '#dce6fa', 'c': '#6a7aa6', 'k': '#121a2e', 'E': '#3a8ae8', 'G': '#e8c050', 'g': '#a8842a', 'Y': '#ffe070', 'y': '#c8a440', 'L': '#fff6c0',
      'U': '#1e1e5a', 'u': '#121238', 'R': '#e07ac8', 'r': '#9a4ac0', 'B': '#6ab8ff', 'w': '#ffffff'}


def galaxy(mode):
    c = Cv(40, 40); ph = 1.0 if mode == 'idle1' else 0.0
    cape = poly([(16.0, 11.0), (12.0, 13.0), (6.0, 22.0), (2.0 - ph, 33.0), (4.0, 34.6), (14.0, 34.6), (15.0, 22.0)])
    c.fill(cape, 'U')                                                                                                        # 땅에 끌리는 은하 망토
    sw = [(9.0 + 3.0 * math.cos(k * 0.5 + ph) * (k / 14), 25.0 + 2.2 * math.sin(k * 0.5 + ph) * (k / 14)) for k in range(15)]
    c.only(path(sw, 0.9), 'r', 'U'); c.only(path(sw[:7], 0.6), 'R', 'Ur')                                                   # 분홍 · 보라 소용돌이
    for (x, y) in ((8, 18), (5, 28), (11, 31), (12, 22), (7, 33), (10, 15)): c.only({(x, y)}, 'w', 'U')
    c.move((0, 0, 39, 39), 4, 0)
    k2 = Cv(40, 40); knight(k2, heavy=0.4); blunt(k2.g, 'C', 'Q', 'c', bottom=1, side=0); visor(k2)
    k2.fill(star5(18.8, 4.0, 2.0, 0.9), 'Y')                                                                                 # 투구 이마의 작은 다섯 꼭지 별
    k2.fill(thins([(10.6, 12.0), (21.4, 12.0)]), 'G')
    k2.move((0, 0, 39, 39), 4, 0)
    comp(c, k2)
    return c


B.add('constellation_d', 'D 은하 망토 기사', '날씬한 은청 갑주와 금테 · 땅에 끌리는 짙은 남빛 은하 망토(분홍 · 보라 소용돌이 · 별) · 투구 이마의 작은 다섯 꼭지 노란 별 · 파란 눈 · 금 별빛 창',
      [galaxy('idle0'), galaxy('idle1')], PD, [25, 13], 21, 22, arm=['C', 'c'], hand='C', idle={'h': [2, 3], 'a': -70})
B.dump()
