"""해룡 탈것 시안 (빌드 69, 11-13 21:22 사용자 「용기수 푸른 용 탈것을 해마 꼴 해룡으로」 · 11-14 00:42 「해상왕국이 배로 올 때 가져와서 판매」 · 12:18 「ㄱㄱ」).
용기수(dragoon 계열)가 타는 해마 꼴 용 — 곧게 선 S자 몸 · 앞으로 내민 가슴의 마디 · 말린 꼬리 · 잎사귀 지느러미 · 뒤로 뻗은 뿔. 공중에 떠서 헤엄친다(와이번처럼 float).
푸른 몸 + 크림색 배 + 대롱 주둥이(유명한 해마 용 캐릭터)와 겹치지 않게: 주둥이는 짧은 용 주둥이(턱 · 이빨), 푸른 몸에 크림 배는 쓰지 않는다.
A 산호 해룡(산호빛 몸 · 가지 친 산호 뿔 · 청록 지느러미) · B 해초 해룡(올리브 몸 · 잎사귀 해초 지느러미가 늘어짐) ·
C 심해 해룡(남보라 몸 · 빛나는 청록 점 · 빛 테 지느러미) · D 진주 해룡(진주빛 몸 · 분홍 지느러미 · 이마에 진주)
그림 꼴은 ../ride65(g/wyv.py · export_ride.py)와 같다: 오른쪽을 보는 반 해상도 칸 · 장 idle0 · idle1 · run0~3 · seat(기수 엉덩이 칸) · float.
python3 seadragon.py <출력.json>  → {seaA: {frames, pal, ax, seat, label, desc, float}, …}"""
import json, math, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ride65', 'g'))
from cv import Cv, ell, poly, path, thin, thins, frames   # noqa: E402
from blunt import blunt                                     # noqa: E402

W, H = 48, 44
TILT = 0.36   # 몸을 앞으로 기울인 각 (라디안)


def rell(c0, rx, ry, a):
    """기운 타원"""
    cx, cy = c0; out = set(); ca, sa = math.cos(a), math.sin(a)
    for y in range(int(cy - max(rx, ry)) - 2, int(cy + max(rx, ry)) + 3):
        for x in range(int(cx - max(rx, ry)) - 2, int(cx + max(rx, ry)) + 3):
            dx, dy = x + 0.5 - cx, y + 0.5 - cy; u = dx * ca + dy * sa; v = -dx * sa + dy * ca
            if (u / rx) ** 2 + (v / ry) ** 2 <= 1: out.add((x, y))
    return out
POSE = {   # bob 몸 높이(칸, + = 위) · fin 지느러미 흔들림 · tc 꼬리 말림 · nk 고개
    'idle0': dict(bob=0.0, fin=0.0, tc=0.0, nk=0.0),
    'idle1': dict(bob=0.8, fin=1.0, tc=0.4, nk=0.4),
    'run0': dict(bob=0.0, fin=0.0, tc=-0.4, nk=-0.3),
    'run1': dict(bob=0.6, fin=1.0, tc=0.0, nk=0.0),
    'run2': dict(bob=1.0, fin=0.0, tc=0.5, nk=0.4),
    'run3': dict(bob=0.6, fin=1.0, tc=0.0, nk=0.0),
}


POSE_MON = {   # 몬스터 해룡 장: 물기(고개를 앞으로 · 입 벌림) · 뿜기 준비(고개를 젖힘) · 뿜기(입을 크게)
    'bite': dict(bob=0.2, fin=1.0, tc=0.0, nk=-0.6, mouth=1.0),
    'swell': dict(bob=0.8, fin=0.0, tc=0.4, nk=1.4),
    'spit': dict(bob=0.4, fin=1.0, tc=0.2, nk=0.6, mouth=1.5),
}
POSE.update({})   # (POSE는 탈것 장만)


def leaf(a, b, w):
    """잎사귀 꼴 (두 끝이 뾰족)"""
    dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1; px, py = -dy / L * w, dx / L * w
    m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    return poly([a, (m[0] + px, m[1] + py), b, (m[0] - px * 0.6, m[1] - py * 0.6)])


def seahorse(S, fr):
    P = POSE[fr] if fr in POSE else POSE_MON[fr]; c = Cv(W, H); bob = P['bob']; fin = P['fin']; nk = P['nk']
    a0 = S.get('tilt', TILT)   # 앞으로 기울인 몸 (등이 눕게 — 기수가 앉을 자리)
    def T(p):
        x, y = p[0] - 21.0, p[1] - 24.0; ca, sa = math.cos(a0), math.sin(a0)
        return (21.0 + x * ca - y * sa, 24.0 + x * sa + y * ca - bob)
    FIN, FIN2 = S.get('finch', ('F', 'f'))
    # ── 꼬리: 몸통 밑에서 내려와 앞(오른쪽)으로 말린다 ──
    tc = P['tc']
    # 꼬리: 몸통 밑에서 내려와 고리로 말린다 (가운데는 비게 — 해마 꼬리로 읽히게)
    cx0, cy0 = 22.6, 37.2 + tc * 0.3
    spiral = [(cx0 + math.cos(math.radians(a)) * r, cy0 + math.sin(math.radians(a)) * r) for a, r in ((180, 3.0), (225, 3.0), (270, 2.9), (315, 2.7), (360, 2.5), (405, 2.2), (450, 1.8), (500, 1.2))]
    tpts = [T(p) for p in [(20.6, 29.6), (19.4, 32.6)]] + [T(p) for p in spiral]
    c.fill(path(tpts[:3], 2.6, 1.5), 'C'); c.fill(path(tpts[2:], 1.7, 0.9), 'C')
    # 꼬리 지느러미 잎 (뒤쪽)
    for (a, b, w) in S.get('tleaf', []):
        c.under(leaf(T(a), T((b[0], b[1] + fin * 0.4)), w), FIN2)
    # 등 지느러미 (부채꼴, 몸 뒤 왼쪽) — 살 줄 3개
    dorsal = poly([T((17.6, 18.0)), T((12.6 - fin * 0.4, 17.2)), T((11.8 - fin * 0.6, 21.6)), T((13.6 - fin * 0.3, 25.4)), T((17.4, 25.4))])
    c.fill(dorsal, FIN)
    for k in range(3):
        a = T((17.4, 19.6 + k * 2.2)); b = T((12.8 - fin * 0.5, 18.4 + k * 3.2))
        for (x, y) in thin(a, b):
            if (x, y) in dorsal: c.set(x, y, FIN2)
    # ── 몸통: 앞으로 내민 가슴(오른쪽) · 굽은 등(왼쪽) ──
    trunk = rell(T((21.6, 22.0)), 5.8, 8.4, a0) | rell(T((24.2, 21.4)), 4.4, 6.6, a0) | rell(T((20.4, 27.4)), 3.8, 3.8, a0)
    c.fill(trunk, 'C')
    # 목 · 머리
    neck = [T((23.8, 15.6)), T((25.6, 11.6 + nk * 0.3)), T((27.2, 8.6 + nk * 0.5))]
    c.fill(path(neck, 3.0, 2.5), 'C')
    hx, hy = neck[-1][0] + 1.6, neck[-1][1] - 1.0 + nk * 0.4
    ha = a0 * 0.35
    Hh = lambda p: (hx + p[0] * math.cos(ha) - p[1] * math.sin(ha), hy + p[0] * math.sin(ha) + p[1] * math.cos(ha))
    c.fill(ell(hx, hy, 3.4, 2.8), 'C')
    # 짧은 용 주둥이 (대롱 아님) + 턱
    c.fill(poly([Hh(p) for p in [(1.4, -1.6), (5.6, -0.6), (6.4, 0.8), (5.6, 1.6), (1.2, 1.8)]]), 'C')
    mo = P.get('mouth', 0)
    if mo:   # 몬스터 장: 턱을 경첩(0.6, 1.6)에서 아래로 벌린다
        ang = 0.6 * mo; hg = (0.6, 1.6)
        R = lambda q: (hg[0] + (q[0] - hg[0]) * math.cos(ang) - (q[1] - hg[1]) * math.sin(ang), hg[1] + (q[0] - hg[0]) * math.sin(ang) + (q[1] - hg[1]) * math.cos(ang))
        jaw = [R(q) for q in [(1.0, 1.6), (5.4, 2.0), (5.0, 3.0), (0.6, 3.2)]]
        c.fill(poly([Hh(q) for q in [(0.8, 1.4), (5.6, 1.6)] + [jaw[1], jaw[0]]]), 'K')   # 입 안
        c.fill(poly([Hh(q) for q in jaw]), 'C')
    else:
        c.fill(poly([Hh(p) for p in [(1.0, 1.4), (5.0, 1.8), (4.6, 2.8), (0.6, 3.0)]]), 'C')
    # 뿔
    for (a, b, ch, r0, r1) in S['horns']:
        c.fill(path([Hh(a), Hh(((a[0] + b[0]) / 2 - 0.2, (a[1] + b[1]) / 2 - 0.5)), Hh(b)], r0, r1), ch)
    if S.get('hornfx'): S['hornfx'](c, Hh)
    # 뺨 지느러미 (머리 뒤 · 작은 부채)
    cheek = leaf(Hh((-1.4, 0.6)), Hh((-4.4 - fin * 0.4, 2.4)), 1.3)
    c.fill(cheek, FIN)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    # 배 마디: 가슴 앞쪽 가장자리를 따라 띠를 번갈아 (A · a)
    bel = set()
    for (x, y) in trunk:
        xs = [q[0] for q in trunk if q[1] == y]
        if xs and x >= max(xs) - 2 and y >= T((24, 14.0))[1] and y <= T((20, 30.0))[1]: bel.add((x, y))
    for (a, b) in zip(neck, neck[1:]):
        for (x, y) in path([a, b], 1.4):
            if c.get(x, y) in 'CQc' and (x + 1, y) not in path([a, b], 1.4) | trunk and c.get(x + 1, y) == '.': bel.add((x, y))
    for (x, y) in bel:
        if c.get(x, y) in 'CQc': c.set(x, y, 'A' if (y % 2 == 0) else 'a')
    # 등 · 목 · 꼬리를 따라 잎 지느러미 (앞)
    for (a, b, w) in S.get('leaves', []):
        L = leaf(T(a), T((b[0] - fin * 0.4, b[1] + fin * 0.3)), w)
        for (x, y) in L:
            if c.get(x, y) in '.Cc': c.set(x, y, FIN if (x + y) % 3 else FIN2)
    # 얼굴
    ex, ey = Hh(S.get('eye', (0.8, -0.6))); c.set(ex, ey, 'e'); c.set(ex - 1, ey, 'K')
    for i in range(3): c.set(*Hh((-0.4 + i, -1.6)), 'c')
    c.set(*Hh((5.2, -0.4)), 'K')                     # 콧구멍
    if mo:
        for q in ((5.0, 1.9), (3.6, 1.9), (2.2, 1.9)): c.set(*Hh(q), 'w')   # 윗니
        c.set(*Hh((0.6 + 3.6 * math.cos(0.6 * mo), 1.6 + 3.6 * math.sin(0.6 * mo) - 0.2)), 'w')   # 아랫니
    else:
        for i in range(4): c.set(*Hh((5.0 - i, 1.6)), 'K')   # 입 줄
        c.set(*Hh((4.2, 2.2)), 'w'); c.set(*Hh((2.6, 2.2)), 'w')   # 작은 이빨 둘
    if S.get('post'): S['post'](c, T, Hh, P)
    if S.get('wild'): return c, T((21.4, 12.4))   # 야생 해룡(몬스터 · 펫): 안장 없음
    # 안장: 목 밑동 뒤 등 위 (기수 엉덩이 칸 = 안장 가운데 위)
    sad = poly([T(p) for p in [(18.2, 13.8), (23.8, 13.4), (24.2, 16.2), (18.6, 16.6)]])
    for (x, y) in sad:
        if c.get(x, y) not in '.': c.set(x, y, S.get('cloth', 'R'))
    for (x, y) in poly([T(p) for p in [(18.4, 16.0), (24.2, 15.6), (24.3, 16.6), (18.6, 17.0)]]):
        if c.get(x, y) not in '.': c.set(x, y, S.get('trim', 'G'))
    c.fill(poly([T(p) for p in [(19.0, 12.6), (23.4, 12.2), (23.6, 14.2), (19.2, 14.6)]]), 'W')
    c.fill(poly([T(p) for p in [(18.2, 11.2), (19.6, 11.6), (19.8, 13.6), (18.4, 13.8)]]), 'V')
    c.fill(poly([T(p) for p in [(22.8, 11.4), (24.0, 11.0), (24.4, 13.2), (23.0, 13.4)]]), 'V')
    for (x, y) in thin(T((24.2, 15.0)), T((26.2, 17.0))):   # 가슴 끈
        if c.get(x, y) in 'CQcAa': c.set(x, y, 'U')
    return c, T((21.4, 12.4))


def emit(S, pal, label, desc):
    fs, seats = {}, {}
    for fr in POSE:
        c, seat = seahorse(S, fr); fs[fr] = c; seats[fr] = seat
    outs, top = frames([fs[k] for k in POSE])
    return {'frames': dict(zip(POSE, outs)), 'pal': pal, 'ax': S.get('ax', 21), 'seat': {k: [round(v[0]), round(v[1]) - top] for k, v in seats.items()},
            'label': label, 'desc': desc, 'float': S.get('lift', 5)}


LEAVES = [((26.0, 10.6), (22.8, 9.0), 1.1), ((24.8, 13.4), (21.4, 11.0), 1.0), ((17.8, 26.6), (14.6, 29.0), 1.2), ((19.0, 31.0), (15.8, 33.6), 1.1)]
TLEAF = [((18.8, 35.6), (15.4, 37.4), 1.1), ((20.6, 38.6), (18.6, 41.6), 1.0)]


def coral_horns(c, Hh):   # A: 가지 친 산호 뿔 (곁가지 하나씩)
    for (a, b) in (((-2.6, -3.0), (-3.6, -5.2)), ((-1.0, -3.6), (-0.6, -5.6))):
        c.fill(path([Hh(a), Hh(b)], 0.6, 0.35), 'Z')


S_A = dict(horns=[((-0.8, -1.8), (-4.4, -4.8), 'Z', 1.0, 0.5), ((0.4, -2.2), (-2.0, -5.8), 'z', 0.9, 0.45)], hornfx=coral_horns, leaves=LEAVES, tleaf=TLEAF)
PAL_A = {'C': '#e0704a', 'Q': '#f4a07a', 'c': '#b04a32', 'd': '#7a3020', 'A': '#f8d8c4', 'a': '#e4b49a', 'F': '#3ab0a8', 'f': '#22807a',
         'Z': '#c8303a', 'z': '#8a1e28', 'e': '#1a2a3a', 'K': '#2a1410', 'w': '#ffffff', 'R': '#2a5a8a', 'G': '#e8c070', 'W': '#5a3a22', 'V': '#3e2616', 'U': '#3a2418'}


def kelp_post(c, T, Hh, P):   # B: 몸 곳곳에서 늘어진 해초 잎 (더 길게)
    for (a, b, w) in [((22.6, 29.6), (24.6, 33.6), 0.9), ((16.6, 21.0), (13.0, 23.6), 1.0), ((27.4, 6.6), (25.0, 3.0), 0.9)]:
        for (x, y) in leaf(T(a), T(b), w):
            if c.get(x, y) in '.Cc': c.set(x, y, 'F')


S_B = dict(horns=[((-0.8, -1.8), (-4.0, -4.0), 'Z', 0.9, 0.5), ((0.4, -2.2), (-1.6, -5.0), 'z', 0.8, 0.45)], leaves=LEAVES + [((22.6, 18.0), (25.8, 15.2), 0.9)], tleaf=TLEAF, post=kelp_post)
PAL_B = {'C': '#6a8a3a', 'Q': '#94b45e', 'c': '#4a6428', 'd': '#34481c', 'A': '#c8d088', 'a': '#a8b06a', 'F': '#a8c040', 'f': '#6e8a26',
         'Z': '#a87a4a', 'z': '#6e4e2e', 'e': '#e8b030', 'K': '#1a1e10', 'w': '#ffffff', 'R': '#8a3a2a', 'G': '#d8b060', 'W': '#5a3a22', 'V': '#3e2616', 'U': '#3a2418'}


def glow_post(c, T, Hh, P):   # C: 몸에 빛나는 점 · 지느러미 끝 빛 · 뿔 끝 빛
    for q in [(19.6, 20.0), (18.8, 23.6), (20.6, 26.8), (22.0, 18.6), (19.4, 32.0), (21.4, 36.4), (24.4, 37.6)]:
        x, y = T(q)
        if c.get(x, y) in 'CQc': c.set(x, y, 'L')
    for q in [(12.6, 17.4), (11.8, 21.6), (13.6, 25.2)]:
        x, y = T(q)
        if c.get(x, y) in 'Ff': c.set(x, y, 'L')
    x, y = Hh((-4.4, -4.8)); c.set(x, y, 'L')


S_C = dict(horns=[((-0.8, -1.8), (-4.4, -4.8), 'Z', 0.9, 0.4), ((0.4, -2.2), (-2.0, -5.8), 'z', 0.8, 0.35)], leaves=LEAVES[:2], tleaf=TLEAF[:1], post=glow_post, cloth='R', trim='L')
PAL_C = {'C': '#3a3a7a', 'Q': '#5a5aa8', 'c': '#262656', 'd': '#18183a', 'A': '#4a4a8e', 'a': '#383872', 'F': '#2a5a8a', 'f': '#1a3a60',
         'Z': '#c8e0f0', 'z': '#8aa8c0', 'e': '#7af0e8', 'K': '#0c0c1e', 'w': '#ffffff', 'L': '#6af0e0', 'R': '#5a2a6a', 'G': '#e8c070', 'W': '#3a2a3a', 'V': '#241a26', 'U': '#1e1626'}


def pearl_post(c, T, Hh, P):   # D: 이마에 진주 하나
    x, y = Hh((-0.2, -2.6)); c.set(x, y, 'P'); c.set(x + 1, y, 'p')


S_D = dict(horns=[((-0.8, -1.8), (-4.2, -4.2), 'Z', 0.9, 0.5), ((0.4, -2.2), (-1.8, -5.4), 'z', 0.8, 0.45)], leaves=LEAVES, tleaf=TLEAF, post=pearl_post)
PAL_D = {'C': '#e4e0f0', 'Q': '#ffffff', 'c': '#b8b0d0', 'd': '#8a82a8', 'A': '#f4e8f4', 'a': '#d8c8e0', 'F': '#f0a0c0', 'f': '#c87098',
         'Z': '#d8c8a0', 'z': '#a8986e', 'e': '#5a3a7a', 'K': '#2a2238', 'w': '#ffffff', 'P': '#fff8f0', 'p': '#d8c8d8', 'R': '#4a7ab8', 'G': '#e8c070', 'W': '#5a3a22', 'V': '#3e2616', 'U': '#3a2418'}

LOOKS = {
    'seaA': (S_A, PAL_A, '시안 A 산호 해룡', '산호빛 몸 · 가지 친 산호 뿔 · 청록 잎 지느러미 · 크림빛 배 마디'),
    'seaB': (S_B, PAL_B, '시안 B 해초 해룡', '올리브 몸 · 몸 곳곳에서 늘어진 해초 잎 · 나무빛 뿔 · 금빛 눈'),
    'seaC': (S_C, PAL_C, '시안 C 심해 해룡', '남보라 몸 · 빛나는 청록 점 · 빛 테 지느러미 · 은빛 뿔 · 깊은 바다의 빛'),
    'seaD': (S_D, PAL_D, '시안 D 진주 해룡', '진주빛 몸 · 분홍 잎 지느러미 · 이마에 진주 · 연한 금빛 뿔'),
}

if __name__ == '__main__':
    out = {k: emit(S, pal, lab, desc) for k, (S, pal, lab, desc) in LOOKS.items()}
    json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, indent=0)
    print(out['seaA']['frames']['idle0'])
    print({k: (v['seat'], v['ax']) for k, v in out.items()})
