"""랑기수 탈것 시안: 늑대 넷 (오른쪽을 봄, 반 해상도 칸). 장: idle0 · idle1 · run0~3 (질주 네 장)
python3 wolf.py → ../t/wolf.json  (ride.js RIDE.reg 꼴: frames · pal · ax · seat)
A 회색 늑대(날렵 · 꼬리 늘어뜨림) · B 검은 다이어울프(등 혹 · 갈기 · 머리를 낮춤) · C 황갈색 늑대(깃털 굴레 · 치켜든 꼬리) · D 갑주 늑대(쇠 투구 · 목 판 · 긴 마의)"""
import json, math, sys
from cv import Cv, ell, poly, path, box, blunt, frames, thin, thins, rbox

W, H, GY = 54, 36, 32

# 다리 자세: 관절에서 (팔꿈치/무릎, 손목/발목, 발끝) 상대 칸 (×lk). 앞다리는 팔꿈치가 뒤로, 뒷다리는 무릎이 앞 · 발목이 뒤. 발끝 y 10 = 땅
LEGS = {
    'idle':  {'f': [(0, 4), (0.4, 8), (1.4, 10)], 'b': [(2, 3.6), (-0.6, 7.2), (0.4, 10)], 'ff': [(-0.4, 4), (-0.6, 8), (0.2, 10)], 'bf': [(1.4, 3.6), (-1.4, 7.2), (-0.6, 10)]},
    'run0':  {'f': [(2.2, 2.6), (5.2, 4.2), (7.4, 5.0)], 'b': [(-1.2, 3.0), (-4.6, 4.6), (-7.2, 5.4)], 'ff': [(1.6, 3.0), (4.0, 5.2), (6.0, 6.4)], 'bf': [(-0.6, 3.2), (-3.6, 5.4), (-6.0, 6.6)]},
    'run1':  {'f': [(0.4, 4), (0.9, 8), (2.0, 10)], 'b': [(0.2, 3.6), (-3.2, 5.6), (-5.6, 7.2)], 'ff': [(1.8, 3.2), (4.2, 5.4), (5.6, 7.2)], 'bf': [(-0.6, 3.4), (-3.8, 5.0), (-6.4, 6.2)]},
    'run2':  {'f': [(-1.0, 3.8), (-2.8, 6.8), (-3.6, 9.0)], 'b': [(3.0, 3.0), (5.0, 6.0), (6.8, 8.2)], 'ff': [(-0.4, 4.0), (-1.8, 7.4), (-2.4, 9.4)], 'bf': [(2.4, 3.2), (4.0, 6.6), (5.4, 8.8)]},
    'run3':  {'f': [(1.6, 3.4), (4.0, 5.8), (5.4, 7.6)], 'b': [(1.0, 3.6), (-0.4, 7.2), (0.6, 10)], 'ff': [(-0.6, 3.8), (-2.0, 7.0), (-2.8, 9.2)], 'bf': [(2.0, 3.4), (3.4, 6.8), (4.6, 9.0)]},
}
POSE = {   # lift 몸 높이 · tilt 기울기(라디안, + = 머리 쪽이 아래) · hd 머리 (dx, dy) · ear 귀 젖힘 · tail 꼬리 꼴 · mouth 입
    'idle0': dict(leg='idle', lift=0, tilt=0, hd=(0, 0), ear=0, tail='idle', mouth=0),
    'idle1': dict(leg='idle', lift=0, tilt=0, hd=(0, 0.6), ear=0, tail='idle2', mouth=0),
    'run0': dict(leg='run0', lift=1.6, tilt=0.0, hd=(1.2, 1.2), ear=1, tail='run', mouth=1),
    'run1': dict(leg='run1', lift=0.4, tilt=0.05, hd=(1.0, 1.6), ear=1, tail='run2', mouth=1),
    'run2': dict(leg='run2', lift=1.0, tilt=-0.05, hd=(0.6, 0.8), ear=1, tail='run', mouth=1),
    'run3': dict(leg='run3', lift=0.2, tilt=0.0, hd=(1.0, 1.2), ear=1, tail='run2', mouth=1),
}


def rot(p, c, a):
    ca, sa = math.cos(a), math.sin(a); x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * ca - y * sa, c[1] + x * sa + y * ca)


def wolf(S, fr):
    P = POSE[fr]; L = LEGS[P['leg']]; c = Cv(W, H)
    lift, tilt = P['lift'], P['tilt']
    BC = S['bc']
    T = lambda p: rot((p[0], p[1] - lift), (BC[0], BC[1] - lift), tilt)
    lw, lw2 = S['lw'], S['lw'] * 0.78
    hx, hy = T(S['head']); hx += P['hd'][0]; hy += P['hd'][1]
    H_ = lambda p: (hx + p[0], hy + p[1])   # 머리 기준 칸

    def leg(J, offs, ch, r0, r1, paw):
        J = T(J); k = S['lk']; pts = [J] + [(J[0] + dx * k, J[1] + dy * k) for (dx, dy) in offs]
        if abs(offs[-1][1] - 10) < 0.01: pts[-1] = (pts[-1][0], GY - 0.4)
        c.fill(path(pts, r0, r1), ch)
        px, py = pts[-1]
        c.fill(ell(px + 0.6, py - 0.1, S['paw'], 0.8), paw)
        return pts
    # 먼 다리
    leg((S['jf'][0] - S['far'], S['jf'][1]), L['ff'], 'd', lw * 0.9, lw2 * 0.9, 'd')
    leg((S['jb'][0] - S['far'], S['jb'][1]), L['bf'], 'd', lw * 1.1, lw2 * 0.9, 'd')
    # 꼬리
    tb = T(S['tail0']); tp = S['tails'][P['tail']]
    tpts = [tb] + [(tb[0] + dx, tb[1] + dy) for (dx, dy) in tp]
    c.fill(path(tpts, S['tw'][0], S['tw'][1]), 'C')
    tipc = path(tpts[-2:], S['tw'][1] * 1.05, S['tw'][1] * 1.05)
    # 몸통 · 목
    c.fill(poly([T(p) for p in S['body']]), 'C')
    c.fill(poly([T(p) for p in S['neck']]), 'C')
    if S.get('hump'): c.fill(poly([T(p) for p in S['hump']]), 'C')
    # 머리
    c.fill(ell(hx, hy, S['hr'][0], S['hr'][1]), 'C')
    mz = S['muzzle']
    c.fill(poly([H_(p) for p in mz]), 'C')
    if P['mouth']:
        c.fill(poly([H_((mz[3][0], mz[3][1] + 0.2)), H_((mz[2][0] - 0.8, mz[2][1] + 1.4)), H_((mz[2][0] - 2.8, mz[2][1] + 1.7)), H_((0.2, mz[3][1] + 0.6))]), 'C')
    for (e, ch) in ((S['earf'], 'd'), (S['ear'], 'C')):
        pts = [H_((x + (P['ear'] * S.get('earback', -1.4) if i == 1 else 0), y + (P['ear'] * 1.2 if i == 1 else 0))) for i, (x, y) in enumerate(e)]
        c.fill(poly(pts), ch)
    # 가까운 다리 · 넓적다리 · 어깨
    fpts = leg(S['jf'], L['f'], 'C', lw, lw2, 'C')
    bpts = leg(S['jb'], L['b'], 'C', lw * 1.25, lw2, 'C')
    c.fill(ell(*T((S['jb'][0] + 0.6, S['jb'][1] + 0.6)), S['thigh'][0], S['thigh'][1]), 'C')
    c.fill(ell(*T((S['jf'][0], S['jf'][1] - 0.2)), S['arm'][0], S['arm'][1]), 'C')
    if S.get('pre'): S['pre'](c, T, H_, P)
    # 명암
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    # 밝은 털: 배 · 목 아래 · 주둥이 아래
    body_c = poly([T(p) for p in S['body']]) | poly([T(p) for p in S['neck']]) | ell(hx, hy, S['hr'][0], S['hr'][1]) | poly([H_(p) for p in mz])
    for y in range(H):
        for x in range(W):
            if c.g[y][x] in 'Cc' and S['belly'](x, y, lift, hx, hy) and (S.get('legA', True) or (x, y) in body_c): c.g[y][x] = 'A'
    for (x, y) in tipc:
        if c.get(x, y) in 'CQc': c.set(x, y, S['tipch'])
    # 가슴 털 (톱니 앞가장자리)
    if S.get('ruff'):
        for (x, y) in poly([T(p) for p in S['ruff']]):
            if c.get(x, y) in '.CcQ': c.set(x, y, 'A')
    for (p, ch) in S.get('tufts', []):
        X, Y = T(p); c.set(X, Y, ch)
    # 얼굴
    ex, ey = H_(S['eye']); c.set(ex, ey, 'e'); c.set(ex - 1, ey, 'K')
    if S.get('brow'): c.set(ex - 1, ey - 1, 'K'); c.set(ex, ey - 1, 'K')
    nx, ny = H_((mz[1][0] - 0.6, mz[1][1] + 0.4)); c.set(nx, ny, 'K')
    if P['mouth']:
        for i in range(3): c.set(*H_((mz[2][0] - 1 - i, mz[2][1] + 0.6)), 'K')
        c.set(*H_((mz[2][0] - 1.5, mz[2][1] + 0.0)), 'w')
    else:
        for i in range(2): c.set(*H_((mz[2][0] - 1 - i, mz[2][1] - 0.2)), 'K')
        if S.get('fang'): c.set(*H_((mz[2][0] - 2.0, mz[2][1] + 0.6)), 'w')
    if S.get('post'): S['post'](c, T, H_, P)
    seat = S['saddle'](c, T, P)
    for pts in (fpts, bpts):
        px, py = pts[-1]
        if py >= GY - 1: c.set(px + 1.6, py, 'K')
    return c, seat


def emit(S, pal, label, desc, rider):
    fs = {}; seats = {}
    for fr in POSE:
        c, seat = wolf(S, fr); fs[fr] = c; seats[fr] = seat
    outs, top = frames([fs[k] for k in POSE])
    return {'frames': dict(zip(POSE, outs)), 'pal': pal, 'ax': S['ax'], 'seat': {k: [round(v[0]), round(v[1]) - top] for k, v in seats.items()}, 'label': label, 'desc': desc, 'rider': rider}


def fill_on(c, cells, ch, on='CcQAdF'):
    for (x, y) in cells:
        if c.get(x, y) in on: c.set(x, y, ch)


BASE = dict(
    bc=(19, 20), lw=1.4, paw=1.7, far=1.8, ax=19, lk=0.84,
    body=[(11.4, 18.0), (17, 17.6), (23.6, 16.6), (28.0, 17.8), (29.4, 21.2), (27.6, 24.4), (23.6, 24.8), (18.6, 24.0), (14.8, 23.6), (11.4, 24.0), (9.4, 22.4), (9.6, 19.6)],
    neck=[(22.8, 17.0), (26.4, 14.2), (30.0, 13.0), (32.4, 16.4), (31.2, 21.4), (27.2, 21.4)],
    head=(32.0, 15.2), hr=(3.4, 3.0), muzzle=[(1.0, -1.2), (6.4, 0.8), (6.0, 2.4), (0.6, 2.8)],
    ear=[(-1.6, -2.2), (-0.8, -5.6), (1.0, -2.6)], earf=[(-3.4, -1.6), (-2.8, -5.0), (-1.2, -2.2)],
    eye=(1.6, -0.4),
    jf=(26.2, 21.6), jb=(13.0, 21.2), thigh=(2.8, 2.8), arm=(2.1, 2.5),
    tail0=(10.4, 18.8), tw=(2.3, 1.9),
    tails={'idle': [(-2.0, 1.8), (-3.6, 4.6), (-4.0, 7.6)], 'idle2': [(-2.2, 1.6), (-4.0, 4.4), (-4.8, 7.2)],
           'run': [(-3.2, 0.0), (-6.4, 0.8), (-9.2, 2.0)], 'run2': [(-3.2, 0.6), (-6.4, 1.8), (-9.0, 3.4)]},
    tipch='A',
    belly=lambda x, y, lift, hx, hy: y >= 23.4 - lift or (x >= 28.6 and y >= 18 - lift and x <= hx) or (x > hx and y >= hy + 1.6),
    ruff=[(28.4, 18.6), (30.6, 19.0), (30.0, 20.0), (31.0, 20.8), (30.0, 21.8), (30.6, 22.8), (29.0, 23.6), (27.8, 21.0)],
)


def saddle_cloth(c, T, cloth, trim, top, lip):
    """안장 받침 천 cloth(글자 R) · 아래 테 trim(G) · 안장 top(W) · 뒤 받침/앞 손잡이 lip(V). 돌려주는 값: 앉는 자리"""
    for (x, y) in poly([T(p) for p in cloth[0]]):
        if c.get(x, y) != '.': c.set(x, y, cloth[1])
    if trim:
        for (x, y) in poly([T(p) for p in trim[0]]):
            if c.get(x, y) != '.': c.set(x, y, trim[1])
    c.fill(poly([T(p) for p in top]), 'W')
    for q in lip: c.fill(poly([T(p) for p in q]), 'V')


# ───────────── A 회색 늑대
def saddle_A(c, T, P):
    saddle_cloth(c, T, ([(13.6, 17.2), (22.4, 16.4), (23.0, 21.2), (14.0, 21.8)], 'R'), ([(13.8, 20.8), (23.0, 20.2), (23.1, 21.3), (14.0, 21.9)], 'G'),
                 [(14.6, 16.0), (21.6, 15.4), (21.8, 17.6), (14.8, 18.2)],
                 [[(14.0, 14.4), (15.6, 14.8), (15.8, 16.8), (14.2, 17.0)], [(20.8, 14.4), (22.0, 14.0), (22.4, 16.2), (21.0, 16.4)]])
    return T((18.0, 16.0))


S_A = dict(BASE, saddle=saddle_A, tufts=[((24, 15), 'Q'), ((25, 14), 'Q'), ((27, 13), 'Q'), ((28, 12), 'Q')])
PAL_A = {'C': '#9aa0aa', 'Q': '#cdd1d8', 'c': '#6c7280', 'd': '#525866', 'A': '#e6e4de', 'e': '#f0b030', 'K': '#1a1820', 'w': '#f4f0e4',
         'R': '#3f6e3a', 'G': '#d8a838', 'W': '#7a4e2e', 'V': '#5a3820', 'U': '#4a3424'}


# ───────────── B 검은 다이어울프: 어깨 혹 · 굵은 목 · 등 갈기 · 머리를 등 높이로 낮춘다 · 굵고 곧은 꼬리 · 송곳니
def pre_B(c, T, H_, P):
    # 갈기: 귀 뒤에서 어깨 혹까지 뒤로 누운 털 뭉치 — 몸과 같은 C로 그려 명암(윗가장자리 빛)이 털끝을 살린다
    mane = [(21.4, 16.6), (22.0, 13.6), (23.6, 15.0), (24.4, 12.0), (26.0, 13.6), (27.0, 10.8), (28.4, 12.8), (29.6, 10.4), (30.6, 12.6), (32.2, 11.6),
            (32.4, 15.2), (30.0, 17.8), (26.0, 18.2), (22.4, 18.4)]
    if P['tail'].startswith('run'): mane = [(x - 0.8 * (x - 21) / 11, y + 0.9 * (x - 21) / 11) for (x, y) in mane]
    c.fill(poly([T(p) for p in mane]), 'C')


def post_B(c, T, H_, P):
    # 갈기 결: 짙은 줄 몇 개
    for (a, b) in (((24.4, 15.6), (25.6, 14.2)), ((27.0, 15.0), (28.2, 13.4)), ((29.4, 14.6), (30.4, 13.2))):
        for (x, y) in thin(T(a), T(b)):
            if c.get(x, y) in 'CQ': c.set(x, y, 'c')
    x, y = H_((0.4, -1.8)); c.set(x, y, 'A')   # 이마 흉터


def saddle_B(c, T, P):
    # 털가죽 받침(톱니 아래끝) + 검은 가죽 안장 + 쇠고리
    pelt = poly([T(p) for p in [(13.0, 17.4), (22.0, 16.8), (22.6, 20.6), (21.4, 22.0), (20.2, 20.8), (18.8, 22.2), (17.4, 21.0), (16.0, 22.2), (14.6, 21.0), (13.2, 21.8)]])
    for (x, y) in pelt:
        if c.get(x, y) != '.' or y < T((0, 21))[1]: c.set(x, y, 'O')
    for (x, y) in pelt:
        if (x, y + 1) not in pelt: c.set(x, y, 'o')
    c.fill(poly([T(p) for p in [(14.4, 16.0), (21.4, 15.4), (21.6, 17.8), (14.6, 18.4)]]), 'W')
    c.fill(poly([T(p) for p in [(13.6, 14.0), (15.4, 14.6), (15.6, 16.8), (13.8, 17.0)]]), 'V')
    c.fill(poly([T(p) for p in [(20.8, 14.6), (21.8, 14.2), (22.2, 16.4), (21.0, 16.6)]]), 'V')
    x, y = T((22.4, 19.0)); c.set(x, y, 'M'); c.set(x, y + 1, 'N')
    return T((17.4, 16.2))


S_B = dict(BASE,
    body=[(11.4, 19.4), (15.8, 18.6), (20.0, 15.4), (24.8, 14.6), (28.8, 16.6), (30.6, 21.0), (28.8, 25.8), (23.4, 26.2), (18.2, 25.0), (14.4, 24.4), (11.4, 24.6), (9.6, 23.2), (9.8, 20.8)],
    neck=[(23.0, 15.0), (27.4, 13.4), (31.4, 14.4), (33.6, 18.4), (31.8, 23.2), (27.4, 22.6)],
    head=(34.2, 18.2), hr=(4.0, 3.4), muzzle=[(1.4, -1.0), (6.4, 0.8), (6.2, 3.0), (0.8, 3.4)],
    ear=[(-2.0, -2.6), (-2.8, -5.4), (0.0, -3.0)], earf=[(-3.8, -2.0), (-4.6, -4.8), (-2.0, -2.6)], earback=-0.8,
    eye=(1.8, -0.6), brow=1, fang=1,
    jf=(27.0, 22.6), jb=(13.4, 22.0), thigh=(3.2, 3.2), arm=(2.7, 3.1), lw=1.75, paw=2.1, lk=0.72,
    tail0=(10.6, 20.0), tw=(2.7, 2.3),
    tails={'idle': [(-3.0, 0.8), (-5.6, 2.2), (-7.6, 4.2)], 'idle2': [(-3.0, 1.0), (-5.6, 2.6), (-7.4, 4.8)],
           'run': [(-3.4, -0.2), (-6.8, 0.2), (-9.8, 1.0)], 'run2': [(-3.4, 0.4), (-6.8, 1.2), (-9.6, 2.4)]},
    tipch='c',
    belly=lambda x, y, lift, hx, hy: y >= 25.6 - lift or (x > hx and y >= hy + 2.2),
    ruff=[(29.4, 19.8), (31.6, 20.4), (30.8, 21.4), (31.8, 22.4), (30.6, 23.2), (31.0, 24.4), (29.2, 25.2), (28.6, 22.0)],
    pre=pre_B, post=post_B, saddle=saddle_B, tufts=[], legA=False)
PAL_B = {'C': '#58565f', 'Q': '#807e8a', 'c': '#3c3a44', 'd': '#2a2830', 'A': '#a29ea8', 'e': '#f0d040', 'K': '#121016', 'w': '#f4f0e4',
         'F': '#2a2830', 'f': '#1c1a20', 'O': '#a08060', 'o': '#7a5c40', 'W': '#3a2c24', 'V': '#2a1e18', 'M': '#b0b4c0', 'N': '#7a7e8a'}


# ───────────── C 황갈색 늑대: 귀를 세우고 꼬리를 치켜든다 · 깃털 굴레 · 무늬 담요 · 뒤에 말아 묶은 깔개
def post_C(c, T, H_, P):
    # 굴레: 귀 뒤에서 늘어진 깃털 둘 (R 붉은 · Z 흰 끝) + 구슬 G
    bx, by = H_((-2.2, 0.6))
    run = P['tail'].startswith('run')
    for k, (dx, dy) in enumerate(((-1.2, 3.2), (-2.4, 2.4))):
        if run: dx, dy = dx - 1.6, dy - 1.4
        pts = thins([(bx - 0.4 * k, by), (bx + dx * 0.5 - 0.4 * k, by + dy * 0.5), (bx + dx - 0.4 * k, by + dy)])
        for i, (x, y) in enumerate(sorted(pts, key=lambda p: (p[1], -p[0]))):
            c.set(x, y, 'R' if i < len(pts) - 1 else 'Z')
    c.set(bx, by, 'G')
    # 볼 무늬 (흰 줄 둘)
    for p in ((0.6, 1.4), (1.6, 1.6)):
        x, y = H_(p); c.set(x, y, 'Z')
    # 귀 끝 짙게
    x, y = H_((-0.8 + (P['ear'] * -1.4), -5.0 + P['ear'] * 1.2)); c.set(x, y, 'd')


def saddle_C(c, T, P):
    # 무늬 담요(붉은 바탕 · 크림 톱니) + 안장 + 뒤에 말아 묶은 깔개(초록 원통)
    cl = poly([T(p) for p in [(13.4, 17.0), (22.6, 16.2), (23.2, 22.0), (13.8, 22.6)]])
    for (x, y) in cl:
        if c.get(x, y) != '.': c.set(x, y, 'R')
    zz = set()
    for i in range(14, 23):
        X, Y = T((i, 20.6 + (0.8 if i % 2 else 0)))
        zz.add((round(X), round(Y)))
    for (x, y) in zz:
        if c.get(x, y) == 'R': c.set(x, y, 'Z')
    for (x, y) in poly([T(p) for p in [(13.6, 21.8), (23.2, 21.2), (23.3, 22.4), (13.8, 22.9)]]):
        if c.get(x, y) != '.': c.set(x, y, 'r')
    c.fill(poly([T(p) for p in [(14.6, 16.0), (21.6, 15.4), (21.8, 17.6), (14.8, 18.2)]]), 'W')
    c.fill(poly([T(p) for p in [(20.8, 14.4), (22.0, 14.0), (22.4, 16.2), (21.0, 16.4)]]), 'V')
    roll = ell(*T((12.6, 15.6)), 2.0, 1.7); c.fill(roll, 'J')
    for (x, y) in roll:
        if (x, y + 1) not in roll: c.set(x, y, 'j')
    x, y = T((12.6, 15.6)); c.set(x, y - 1, 'U'); c.set(x, y, 'U'); c.set(x, y + 1, 'U')
    return T((18.2, 16.0))


S_C = dict(BASE,
    head=(32.4, 13.8), neck=[(22.8, 17.0), (26.2, 13.4), (30.2, 11.6), (32.8, 15.0), (31.2, 21.0), (27.2, 21.4)],
    ear=[(-1.6, -2.2), (-1.0, -6.4), (1.2, -2.4)], earf=[(-3.4, -1.6), (-3.2, -5.8), (-1.2, -2.0)],
    tail0=(10.8, 18.4), tw=(2.2, 2.0),
    tails={'idle': [(-3.0, -0.4), (-6.0, -0.4), (-8.6, -1.4)], 'idle2': [(-3.0, -0.2), (-6.0, 0.2), (-8.6, -0.6)],
           'run': [(-3.2, -0.6), (-6.6, -0.6), (-9.6, -0.2)], 'run2': [(-3.2, -0.2), (-6.6, 0.2), (-9.6, 0.8)]},
    tipch='d',
    post=post_C, saddle=saddle_C, tufts=[((24, 15), 'Q'), ((26, 13), 'Q'), ((27, 12), 'Q')])
PAL_C = {'C': '#76583e', 'Q': '#9c7a58', 'c': '#523c2a', 'd': '#3a2a1e', 'A': '#dccdae', 'e': '#e8c040', 'K': '#1c1410', 'w': '#f4f0e4',
         'R': '#b8402e', 'r': '#7a2418', 'Z': '#f0e8d4', 'G': '#40a0b0', 'W': '#5a3a22', 'V': '#3e2616', 'J': '#4a6e3a', 'j': '#2e4a24', 'U': '#7a5a3a'}


# ───────────── D 갑주 늑대: 쇠 투구(이마 판 · 귀 구멍) · 목 판 셋 · 가슴 판 · 무릎까지 늘어진 마의(푸른 천 · 금 테)
def post_D(c, T, H_, P):
    # 투구: 머리 위 · 주둥이 윗면 · 볼 판
    helm = poly([H_(p) for p in [(-2.6, -2.4), (0.6, -3.0), (3.4, -1.6), (6.0, 0.2), (5.6, 0.9), (2.6, 0.4), (0.4, 0.8), (-1.4, 1.4), (-2.8, 0.4)]])
    for (x, y) in helm: c.set(x, y, 'M')
    for (x, y) in helm:
        if (x, y + 1) not in helm: c.set(x, y, 'n')
        elif (x, y - 1) not in helm: c.set(x, y, 'x')
    x, y = H_((1.0, -3.4)); c.set(x, y, 'x'); c.set(x, y - 1, 'M')   # 이마 뿔
    x, y = H_((1.6, -0.4)); c.set(x, y, 'K'); c.set(x + 1, y, 'e')   # 눈구멍
    # 목 판 셋 (목덜미를 따라)
    for (a, b) in (((23.6, 16.2), (26.0, 14.2)), ((26.2, 14.0), (28.4, 12.8)), ((28.6, 12.6), (30.4, 12.4))):
        cells = path([T(a), T(b)], 1.0)
        for (x, y) in cells: c.set(x, y, 'M')
        for (x, y) in cells:
            if (x, y + 1) not in cells: c.set(x, y, 'N')
    # 가슴 판
    cp = poly([T(p) for p in [(28.0, 18.4), (30.0, 19.0), (30.4, 22.4), (28.6, 23.4), (27.4, 21.0)]])
    for (x, y) in cp: c.set(x, y, 'M')
    for (x, y) in cp:
        if (x + 1, y) not in cp or (x, y + 1) not in cp: c.set(x, y, 'N')
    x, y = T((29.0, 20.6)); c.set(x, y, 'G')


def saddle_D(c, T, P):
    # 마의: 안장 밑에서 무릎 높이까지 늘어진 푸른 천(J · 그늘 j) · 금 테 G · 가운데 금 표식
    run = P['tail'].startswith('run')
    hem = 26.6 if not run else 25.4
    cap = poly([T(p) for p in [(12.4, 17.6), (23.4, 16.4), (24.4, hem - 0.6), (22.6, hem), (13.6, hem), (11.8, hem - 0.8)]])
    for (x, y) in cap: c.set(x, y, 'J')
    for (x, y) in cap:
        if (x, y + 1) not in cap: c.set(x, y, 'G')
        elif (x + 1, y) not in cap: c.set(x, y, 'j')
    for p in ((18.0, 20.8), (17.0, 21.8), (19.0, 21.8), (18.0, 22.8)):
        x, y = T(p); c.set(x, y, 'G')
    c.fill(poly([T(p) for p in [(14.4, 16.0), (21.6, 15.4), (21.8, 17.6), (14.6, 18.2)]]), 'W')
    c.fill(poly([T(p) for p in [(13.6, 14.2), (15.4, 14.6), (15.6, 16.8), (13.8, 17.0)]]), 'V')
    c.fill(poly([T(p) for p in [(20.8, 14.4), (22.0, 14.0), (22.4, 16.2), (21.0, 16.4)]]), 'V')
    return T((18.0, 16.0))


S_D = dict(BASE, post=post_D, saddle=saddle_D, tufts=[], ruff=None,
           ear=[(-1.4, -2.2), (-0.6, -5.4), (0.8, -2.6)], earf=[(-3.2, -1.6), (-2.6, -4.8), (-1.2, -2.2)],
           tails={'idle': [(-2.4, 1.2), (-4.4, 3.6), (-5.0, 6.6)], 'idle2': [(-2.6, 1.0), (-4.8, 3.4), (-5.8, 6.2)],
                  'run': [(-3.2, 0.0), (-6.4, 0.8), (-9.2, 2.0)], 'run2': [(-3.2, 0.6), (-6.4, 1.8), (-9.0, 3.4)]})
PAL_D = {'C': '#8a7c6c', 'Q': '#aea08e', 'c': '#62574a', 'd': '#4a4036', 'A': '#d6cebe', 'e': '#f0b030', 'K': '#16141a', 'w': '#f4f0e4',
         'M': '#c4cad6', 'N': '#8a90a0', 'n': '#5a6070', 'x': '#f0f4fa', 'J': '#2f4e94', 'j': '#1e3466', 'G': '#e0b040', 'W': '#5a3a22', 'V': '#3e2616'}

OUT = {
    'wolfA': emit(S_A, PAL_A, 'A 은빛 늑대', '늑대 펫이 다 자란 은빛 늑대 · 날렵 · 꼬리를 늘어뜨린다 · 초록 안장 천', 'rA'),
    'wolfB': emit(S_B, PAL_B, 'B 검은 다이어울프', '어깨 혹 · 등 갈기 · 머리를 낮춘 큰 늑대 · 송곳니 · 털가죽 받침', 'rB'),
    'wolfC': emit(S_C, PAL_C, 'C 갈색 늑대', '꼬리를 뒤로 곧게 · 깃털 굴레 · 볼 무늬 · 무늬 담요 · 말아 묶은 깔개', 'rC'),
    'wolfD': emit(S_D, PAL_D, 'D 갑주 늑대', '쇠 투구 · 목 판 · 가슴 판 · 무릎까지 늘어진 푸른 마의', 'rD'),
}

if __name__ == '__main__':
    json.dump(OUT, open('../t/wolf.json', 'w'), ensure_ascii=False, indent=1)
    for k, v in OUT.items(): print(k, v['seat'], len(v['frames']['idle0'].split('\n')))
