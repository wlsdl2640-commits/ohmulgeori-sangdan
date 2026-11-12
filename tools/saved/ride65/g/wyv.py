"""용기수 탈것 시안: 날아 떠 있는 와이번 셋 + 하늘뱀 용 하나 (오른쪽을 봄, 반 해상도 칸)
장: idle0(날개 위) · idle1(날개 아래) · run0~3(날갯짓 네 장: 위 · 가운데 · 아래 · 가운데)
python3 wyv.py → ../t/wyv.json"""
import json, math
from cv import Cv, ell, poly, path, box, blunt, frames, thin, thins, wing, bone_cells

W, H = 64, 50
POSE = {   # wing 날개 자세 · bob 몸 높이(칸, + = 위) · tilt 기울기 · nk 목 · tl 꼬리 흔들림 · mouth
    'idle0': dict(wing='up', bob=0.0, tilt=0.0, nk=0.0, tl=0.0, mouth=0),
    'idle1': dict(wing='down', bob=1.0, tilt=0.0, nk=0.6, tl=0.8, mouth=0),
    'run0': dict(wing='up', bob=0.0, tilt=0.08, nk=0.4, tl=-0.6, mouth=0),
    'run1': dict(wing='mid', bob=0.6, tilt=0.08, nk=0.6, tl=0.0, mouth=0),
    'run2': dict(wing='down', bob=1.2, tilt=0.08, nk=0.8, tl=0.6, mouth=0),
    'run3': dict(wing='mid', bob=0.6, tilt=0.08, nk=0.6, tl=0.0, mouth=0),
}


def rot(p, c, a):
    ca, sa = math.cos(a), math.sin(a); x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * ca - y * sa, c[1] + x * sa + y * ca)


def wyvern(S, fr):
    P = POSE[fr]; c = Cv(W, H)
    BC = S['bc']; bob = P['bob']
    T = lambda p: rot((p[0], p[1] - bob), (BC[0], BC[1] - bob), P['tilt'])
    WP = S['wings'][P['wing']]

    def draw_wing(off, mem, bone, sh_):
        sh = T(S['shoulder']); wr = T(WP['wrist'])
        tips = [T((x + off[0], y + off[1])) for (x, y) in WP['tips']]
        wr = (wr[0] + off[0] * 0.5, wr[1] + off[1] * 0.5)
        m, bones = wing(sh, wr, tips, T(WP['back']), S.get('depth', 1.6))
        for (x, y) in m: c.set(x, y, mem)
        if mem == 'F':
            for (x, y) in m:
                if (x, y + 1) not in m: c.set(x, y, 'f')
        if S.get('holes'):
            for (hx, hy) in S['holes'](WP, T):
                if (round(hx), round(hy)) in m: c.set(hx, hy, '.')
        for (x, y) in bone_cells([(bones[0][0], bones[0][1])], 1.0): c.set(x, y, bone)
        for (a, b) in bones[1:]:
            for (x, y) in thin(a, b):
                if (x, y) in m or c.get(x, y) == mem: c.set(x, y, sh_)
        # 손목 발톱
        c.set(wr[0], wr[1] - 1, 'Z')
        return m
    # 먼 날개 · 먼 다리 · 꼬리 · 몸 · 목 · 머리 · 가까운 다리 · 가까운 날개 (내린 날개는 몸 뒤)
    draw_wing(S['faroff'], 'f', 'd', 'd')
    if P['wing'] == 'down': draw_wing((0, 0), 'F', 'C', 'c')
    def leg(off, ch, cl):
        th = T((S['thigh'][0] + off[0], S['thigh'][1] + off[1]))
        c.fill(ell(th[0], th[1], S['thr'][0], S['thr'][1]), ch)
        pts = [T((x + off[0], y + off[1])) for (x, y) in S['shin']]
        c.fill(path([th] + pts, S['shw'][0], S['shw'][1]), ch)
        fx, fy = pts[-1]
        for (dx, dy) in ((1.0, 0.8), (0.0, 1.2), (-1.0, 0.8)): c.set(fx + dx, fy + dy, cl)
    leg(S['farleg'], 'd', 'z')
    tl = P['tl']
    tpts = [T((x, y + tl * k * 0.6)) for k, (x, y) in enumerate(S['tail'])]
    tail = path(tpts, S['tw'][0], S['tw'][1]); c.fill(tail, 'C')
    if S.get('tailtip'): S['tailtip'](c, tpts)
    body = ell(*T(S['torso'][:2]), S['torso'][2], S['torso'][3]); c.fill(body, 'C')
    nk = P['nk']
    npts = [T((x, y + nk * k * 0.5)) for k, (x, y) in enumerate(S['neck'])]
    c.fill(path(npts, S['nw'][0], S['nw'][1]), 'C')
    hx, hy = npts[-1][0] + S['hoff'][0], npts[-1][1] + S['hoff'][1]
    Hh = lambda p: (hx + p[0], hy + p[1])
    c.fill(ell(hx, hy, S['hr'][0], S['hr'][1]), 'C')
    c.fill(poly([Hh(p) for p in S['snout']]), 'C')
    c.fill(poly([Hh(p) for p in S['jaw']]), 'C')
    leg((0, 0), 'C', 'Z')
    if S.get('pre'): S['pre'](c, T, Hh, P, npts, tpts)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    # 배 비늘: 몸 아래 · 목 앞 · 꼬리 아래
    bel = set()
    for (x, y) in body:
        if y >= T(S['torso'][:2])[1] + 1.2: bel.add((x, y))
    for (a, b) in zip(npts, npts[1:]):
        for (x, y) in path([a, b], S['nw'][1] * 0.75):
            if (x + 1, y) not in path([a, b], S['nw'][1] * 0.75) and c.get(x, y) in 'Cc': bel.add((x, y))
    for (x, y) in bel:
        if c.get(x, y) in 'CcQ': c.set(x, y, 'A' if (y % 2 == 0) else 'a')
    # 가까운 날개 (몸 앞)
    if P['wing'] != 'down': draw_wing((0, 0), 'F', 'C', 'c')
    # 뿔 · 얼굴
    for (k, (a, b, ch, r0, r1)) in enumerate(S['horns']):
        pts = [Hh(a), Hh(((a[0] + b[0]) / 2 - 0.2, (a[1] + b[1]) / 2 - 0.4)), Hh(b)]
        c.fill(path(pts, r0, r1), ch)
    ex, ey = Hh(S['eye']); c.set(ex, ey, 'e'); c.set(ex - 1, ey, 'K')
    for i in range(3): c.set(*Hh((S['eye'][0] - 1 + i, S['eye'][1] - 1)), 'c')   # 눈썹 뼈
    nx, ny = Hh(S['nostril']); c.set(nx, ny, 'K')
    mx, my = Hh(S['mouth']);
    for i in range(int(S['mouthlen'])): c.set(mx - i, my, 'K')
    c.set(mx - 1, my + 1, 'w')
    if S.get('post'): S['post'](c, T, Hh, P, npts, tpts)
    seat = S['saddle'](c, T, P)
    return c, seat


def emit(S, pal, label, desc, rider):
    fs, seats = {}, {}
    for fr in POSE:
        c, seat = wyvern(S, fr); fs[fr] = c; seats[fr] = seat
    outs, top = frames([fs[k] for k in POSE])
    return {'frames': dict(zip(POSE, outs)), 'pal': pal, 'ax': S['ax'], 'seat': {k: [round(v[0]), round(v[1]) - top] for k, v in seats.items()},
            'label': label, 'desc': desc, 'rider': rider, 'float': S.get('lift', 6)}


def saddle_std(c, T, P, cloth='R', trim='G'):
    # 기수는 목 밑동(날개 뿌리 앞)에 앉는다 — 날개가 기수 뒤로 펼쳐져 가리지 않게
    for (x, y) in poly([T(p) for p in [(21.6, 21.4), (28.6, 21.0), (29.0, 25.0), (22.0, 25.6)]]):
        if c.get(x, y) not in '.Ff': c.set(x, y, cloth)
    for (x, y) in poly([T(p) for p in [(21.8, 24.8), (29.0, 24.4), (29.1, 25.4), (22.0, 25.8)]]):
        if c.get(x, y) not in '.Ff': c.set(x, y, trim)
    c.fill(poly([T(p) for p in [(22.4, 20.2), (27.8, 19.8), (28.0, 22.0), (22.6, 22.4)]]), 'W')
    c.fill(poly([T(p) for p in [(21.6, 18.4), (23.2, 18.8), (23.4, 21.0), (21.8, 21.2)]]), 'V')
    c.fill(poly([T(p) for p in [(27.2, 18.6), (28.4, 18.2), (28.8, 20.4), (27.4, 20.6)]]), 'V')
    for (a, b) in (((28.6, 22.2), (31.0, 23.6)),):   # 가슴 끈
        for (x, y) in thin(T(a), T(b)):
            if c.get(x, y) in 'CQcAa': c.set(x, y, 'U')
    return T((25.4, 20.0))


BASE = dict(
    bc=(22, 26), ax=22, lift=7,
    shoulder=(20.4, 21.8), faroff=(2.6, -1.6),
    wings={'up': dict(wrist=(17.0, 8.6), tips=[(6.6, 4.4), (3.4, 11.0), (6.2, 17.2)], back=(13.4, 23.0)),
           'mid': dict(wrist=(19.4, 13.4), tips=[(6.8, 11.4), (2.8, 17.2), (6.4, 22.2)], back=(13.4, 24.0)),
           'down': dict(wrist=(20.4, 29.6), tips=[(13.6, 35.6), (8.6, 33.6), (6.8, 29.0)], back=(13.6, 26.0))},
    torso=(22.0, 26.0, 7.2, 4.6), neck=[(27.8, 23.0), (30.6, 19.2), (32.0, 15.6)], nw=(2.8, 2.1),
    hoff=(2.2, -1.4), hr=(3.2, 2.6), snout=[(1.0, -1.8), (6.6, -0.2), (6.2, 1.4), (0.8, 1.8)], jaw=[(0.8, 1.4), (5.2, 1.8), (4.8, 2.8), (0.2, 3.2)],
    horns=[((-1.6, -1.8), (-4.6, -3.2), 'z', 0.9, 0.45), ((-0.8, -2.2), (-4.0, -3.8), 'Z', 1.0, 0.5)],
    eye=(1.2, -0.6), nostril=(5.8, -0.6), mouth=(5.6, 1.5), mouthlen=4,
    thigh=(19.6, 29.2), thr=(2.7, 2.5), shin=[(21.2, 31.6), (22.8, 33.6), (23.6, 34.8)], shw=(1.15, 0.95), farleg=(-2.4, -0.6),
    tail=[(15.6, 27.6), (10.2, 29.8), (5.2, 29.4), (1.2, 27.0)], tw=(2.6, 0.7),
)


# ───────────── A 올리브 뿔 와이번: 뒤로 휜 뿔 둘 · 붉은 갈색 날개막 · 스페이드 꼬리 끝
def tip_spade(c, tpts):
    x, y = tpts[-1]
    c.fill(poly([(x + 0.6, y - 0.4), (x - 1.6, y - 2.2), (x - 3.6, y + 0.2), (x - 1.4, y + 1.8)]), 'C')


S_A = dict(BASE, tailtip=tip_spade, saddle=lambda c, T, P: saddle_std(c, T, P))
PAL_A = {'C': '#6a7a40', 'Q': '#93a35e', 'c': '#4a5a2c', 'd': '#3a4622', 'A': '#d8c890', 'a': '#b8a46c', 'F': '#a0563a', 'f': '#6e3626',
         'Z': '#efe6cc', 'z': '#b8ac8e', 'e': '#e8d040', 'K': '#1a1610', 'w': '#f4f0e4', 'R': '#3a5a8a', 'G': '#d8a838', 'W': '#6a4228', 'V': '#4a2c1a', 'U': '#3a2a1e'}


# ───────────── B 황금 와이번: 머리 뒤 지느러미 볏 · 넓은 돛 날개(손가락 넷) · 꼬리 끝 지느러미
def pre_B(c, T, Hh, P, npts, tpts):
    pass


def post_B(c, T, Hh, P, npts, tpts):
    # 볏: 머리 뒤로 펼친 지느러미 셋 (J 청록 · j 그늘)
    for (a, b) in (((-1.6, -1.4), (-5.6, -3.4)), ((-1.8, -0.4), (-6.2, -0.8)), ((-1.6, 0.6), (-5.4, 2.2))):
        cells = path([Hh(a), Hh(b)], 0.7, 0.4)
        for (x, y) in cells:
            if c.get(x, y) in '.CQcFf': c.set(x, y, 'J')
    # 등 지느러미(목을 따라)
    for (x, y) in [(29.4, 18.8), (30.6, 16.4)]:
        X, Y = T((x, y)); c.set(X - 1, Y - 1, 'J'); c.set(X - 2, Y - 1, 'j')


def tip_fin(c, tpts):
    x, y = tpts[-1]
    f = poly([(x + 0.6, y), (x - 2.4, y - 3.4), (x - 4.0, y - 1.0), (x - 3.4, y + 2.2)])
    for (X, Y) in f: c.set(X, Y, 'J')


S_B = dict(BASE,
    wings={'up': dict(wrist=(16.2, 10.4), tips=[(5.0, 6.0), (0.8, 11.0), (0.8, 16.4), (5.4, 20.4)], back=(13.2, 23.0)),
           'mid': dict(wrist=(18.8, 15.0), tips=[(5.6, 13.8), (0.2, 17.6), (1.0, 21.6), (5.8, 24.0)], back=(13.2, 24.0)),
           'down': dict(wrist=(20.0, 28.6), tips=[(11.4, 35.4), (5.8, 33.6), (3.0, 29.8), (5.2, 26.8)], back=(13.6, 26.0))},
    horns=[((-1.4, -1.8), (-3.4, -3.4), 'z', 0.8, 0.45), ((-0.6, -2.0), (-2.6, -3.8), 'Z', 0.9, 0.5)],
    tail=[(15.6, 27.6), (10.2, 30.4), (4.6, 30.6), (0.4, 29.0)], tw=(2.6, 0.8),
    post=post_B, tailtip=tip_fin, depth=0.9, saddle=lambda c, T, P: saddle_std(c, T, P, cloth='R', trim='W'))
PAL_B = {'C': '#c8a040', 'Q': '#ecd078', 'c': '#94722a', 'd': '#6e521c', 'A': '#f4e8c4', 'a': '#d8c898', 'F': '#e08c3a', 'f': '#a85e24',
         'Z': '#f6f0e0', 'z': '#c8bc9c', 'e': '#5ac8f0', 'K': '#1a1408', 'w': '#ffffff', 'J': '#3aa8a0', 'j': '#22706c',
         'R': '#8a2a3a', 'G': '#f0d070', 'W': '#5a3420', 'V': '#3e2214', 'U': '#3e2a1a'}


# ───────────── C 먹빛 와이번: 목 · 등 · 꼬리를 따라 뼈 가시 · 찢어진 날개막(구멍) · 앞으로 굽은 긴 뿔 · 붉은 눈
def post_C(c, T, Hh, P, npts, tpts):
    # 목 · 꼬리 위 뼈 가시
    for (a, b) in zip(npts, npts[1:]):
        for t in (0.3, 0.8):
            x, y = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
            nx, ny = -(b[1] - a[1]), (b[0] - a[0]); L = math.hypot(nx, ny) or 1; nx, ny = nx / L, ny / L
            if ny > 0: nx, ny = -nx, -ny
            c.set(x + nx * 2.2, y + ny * 2.2, 'Z'); c.set(x + nx * 3.0 - 0.6, y + ny * 3.0, 'z')
    for k in range(1, 4):
        x, y = tpts[k]; c.set(x, y - 1.6 - (0.8 if k == 1 else 0), 'Z'); c.set(x - 0.8, y - 2.4 - (0.8 if k == 1 else 0), 'z')
    for (x, y) in [(18.4, 21.6), (16.0, 22.6)]:
        X, Y = T((x, y)); c.set(X, Y - 1, 'Z')


def holes_C(WP, T):
    tips = WP['tips']; wr = WP['wrist']; out = []
    for (tx, ty) in tips[:2]:
        mx, my = (wr[0] * 0.45 + tx * 0.55), (wr[1] * 0.45 + ty * 0.55) + 1.2
        out += [T((mx, my)), T((mx + 1, my))]
    return out


def tip_spikes(c, tpts):
    x, y = tpts[-1]
    for (dx, dy) in ((-2.0, -1.6), (-2.6, 0.2), (-1.8, 1.8)):
        for (X, Y) in thin((x, y), (x + dx, y + dy)): c.set(X, Y, 'Z')


S_C = dict(BASE,
    horns=[((-1.4, -1.8), (-3.6, -5.6), 'z', 0.9, 0.4), ((-0.6, -2.0), (-1.8, -6.4), 'Z', 1.0, 0.45)],
    neck=[(27.8, 23.0), (31.0, 18.6), (32.4, 13.8)], nw=(2.6, 1.9), hr=(3.0, 2.4),
    snout=[(1.0, -1.4), (6.6, 0.2), (6.2, 1.4), (0.8, 1.8)], jaw=[(0.8, 1.4), (5.2, 1.8), (4.8, 2.6), (0.2, 3.0)],
    post=post_C, holes=holes_C, tailtip=tip_spikes, depth=1.8, saddle=lambda c, T, P: saddle_std(c, T, P, cloth='R', trim='Z'))
PAL_C = {'C': '#3e404c', 'Q': '#62667a', 'c': '#2a2c36', 'd': '#20222a', 'A': '#7c8090', 'a': '#5e6272', 'F': '#6a2a3a', 'f': '#4a1a26',
         'Z': '#e8e2d4', 'z': '#a8a294', 'e': '#ff6a3a', 'K': '#0e0e14', 'w': '#f4f0e4', 'R': '#8a1e2a', 'W': '#4a3428', 'V': '#2e2018', 'U': '#2a2018'}

OUT = {
    'wyvA': emit(S_A, PAL_A, 'A 올리브 뿔 와이번', '뒤로 휜 뿔 둘 · 붉은 갈색 날개막 · 스페이드 꼬리', 'wA'),
    'wyvB': emit(S_B, PAL_B, 'B 황금 와이번', '머리 뒤 청록 지느러미 볏 · 넓은 돛 날개 · 꼬리 지느러미', 'wB'),
    'wyvC': emit(S_C, PAL_C, 'C 먹빛 와이번', '목 · 꼬리 뼈 가시 · 찢어진 날개막 · 위로 솟은 긴 뿔 · 붉은 눈', 'wC'),
}



# ───────────── D 푸른 하늘뱀 용 (와이번이 아님 — 사용자 그림 6 계열): 긴 몸이 S자로 떠 있다 · 흰 갈기 · 작은 지느러미 날개 · 등 지느러미
SPOSE = {'idle0': (0.0, 0.0), 'idle1': (1.6, 0.6), 'run0': (0.0, 0.4), 'run1': (1.6, 0.8), 'run2': (3.14, 0.6), 'run3': (4.7, 0.4)}


def serpent(S, fr):
    ph, bob = SPOSE[fr]; c = Cv(W, H)
    base = S['spine']; n = len(base)
    pts = [(x, y - bob + (0 if i < 2 else 1.1 * math.sin(ph + i * 0.9) * min(1, (i - 1) / 3))) for i, (x, y) in enumerate(base)]
    rs = [S['r0'] + (S['r1'] - S['r0']) * i / (n - 1) for i in range(n)]
    # 작은 지느러미 날개 (먼 쪽 → 몸 뒤)
    def fin_wing(off, mem, bone):
        sh = (S['fw']['sh'][0] + off[0], S['fw']['sh'][1] - bob + off[1]); wr = (S['fw']['wr'][0] + off[0], S['fw']['wr'][1] - bob + off[1] - (0.8 if fr in ('idle1', 'run1') else 0))
        tips = [(x + off[0], y - bob + off[1] - (1.0 if fr in ('idle1', 'run1') else 0)) for (x, y) in S['fw']['tips']]
        m, bones = wing(sh, wr, tips, (S['fw']['back'][0] + off[0], S['fw']['back'][1] - bob + off[1]), 1.0)
        for (x, y) in m: c.set(x, y, mem)
        for (a, b) in bones[1:]:
            for (x, y) in thin(a, b): c.set(x, y, bone)
        for (x, y) in thin(bones[0][0], bones[0][1]): c.set(x, y, bone)
    fin_wing((2.0, -1.2), 'f', 'j')
    body = set()
    for i in range(n - 1):
        body |= path([pts[i], pts[i + 1]], rs[i], rs[i + 1])
    for (x, y) in body: c.set(x, y, 'C')
    # 머리
    hx, hy = pts[0][0] + S['hoff'][0], pts[0][1] + S['hoff'][1]
    Hh = lambda p: (hx + p[0], hy + p[1])
    c.fill(ell(hx, hy, S['hr'][0], S['hr'][1]), 'C')
    c.fill(poly([Hh(p) for p in S['snout']]), 'C'); c.fill(poly([Hh(p) for p in S['jaw']]), 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    # 배 비늘 띠: 등뼈 줄 아래 반쪽
    for i in range(n - 1):
        (ax_, ay_), (bx_, by_) = pts[i], pts[i + 1]
        nx, ny = -(by_ - ay_), (bx_ - ax_); L = math.hypot(nx, ny) or 1; nx, ny = nx / L, ny / L
        if ny < 0: nx, ny = -nx, -ny   # 아래쪽 법선
        for t in (0.0, 0.34, 0.67):
            x, y = ax_ + (bx_ - ax_) * t, ay_ + (by_ - ay_) * t; r = rs[i] + (rs[i + 1] - rs[i]) * t
            for k in (0.45, 0.8):
                X, Y = round(x + nx * r * k), round(y + ny * r * k)
                if c.get(X, Y) in 'CcQ': c.set(X, Y, 'a' if (t == 0.0 and k == 0.8) else 'A')
    # 등 지느러미: 몸 위쪽에 작은 세모 (흰 J)
    for i in range(1, n - 2):
        (ax_, ay_), (bx_, by_) = pts[i], pts[i + 1]
        nx, ny = -(by_ - ay_), (bx_ - ax_); L = math.hypot(nx, ny) or 1; nx, ny = nx / L, ny / L
        if ny > 0: nx, ny = -nx, -ny   # 위쪽 법선
        x, y = (ax_ + bx_) / 2, (ay_ + by_) / 2; r = (rs[i] + rs[i + 1]) / 2
        tri = poly([(x + nx * (r - 0.4) - (bx_ - ax_) / L * 1.2, y + ny * (r - 0.4) - (by_ - ay_) / L * 1.2), (x + nx * (r + 1.8) - (bx_ - ax_) / L * 1.4, y + ny * (r + 1.8) - (by_ - ay_) / L * 1.4), (x + nx * (r - 0.4) + (bx_ - ax_) / L * 0.8, y + ny * (r - 0.4) + (by_ - ay_) / L * 0.8)])
        for (X, Y) in tri:
            if c.get(X, Y) in '.': c.set(X, Y, 'D')
    # 꼬리 지느러미
    tx, ty = pts[-1]
    for (X, Y) in poly([(tx, ty + 0.6), (tx - 2.6, ty - 2.6), (tx + 0.4, ty - 3.4), (tx + 1.6, ty - 0.8)]):
        if c.get(X, Y) == '.': c.set(X, Y, 'D')
    # 갈기: 머리 뒤 · 목 위로 흘러내린 흰 털
    for (a, b, r0, r1) in (((-1.6, -1.6), (-5.4, -0.4), 1.1, 0.6), ((-1.8, 0.2), (-5.8, 2.6), 1.0, 0.5), ((-0.8, -2.2), (-4.0, -3.6), 0.9, 0.4)):
        for (X, Y) in path([Hh(a), Hh(b)], r0, r1):
            if c.get(X, Y) in '.CcQ': c.set(X, Y, 'J')
    for (X, Y) in thin(Hh((-2.4, -0.6)), Hh((-5.0, 0.6))): c.set(X, Y, 'j')
    # 뿔
    for (a, b, ch, r0, r1) in S['horns']:
        c.fill(path([Hh(a), Hh(((a[0] + b[0]) / 2 - 0.3, (a[1] + b[1]) / 2 - 0.3)), Hh(b)], r0, r1), ch)
    ex, ey = Hh(S['eye']); c.set(ex, ey, 'e'); c.set(ex - 1, ey, 'K')
    for i in range(3): c.set(*Hh((S['eye'][0] - 1 + i, S['eye'][1] - 1)), 'c')
    c.set(*Hh(S['nostril']), 'K')
    mx, my = Hh(S['mouth'])
    for i in range(4): c.set(mx - i, my, 'K')
    # 가까운 지느러미 날개 (기수 뒤)
    fin_wing((0, 0), 'F', 'j')
    # 안장: 몸통 맨 앞 마디 위
    sx, sy = pts[2][0] + 0.6, pts[2][1] - rs[2] - 0.2
    for (X, Y) in poly([(sx - 3.4, sy + 1.0), (sx + 3.0, sy + 0.6), (sx + 3.4, sy + 3.6), (sx - 3.0, sy + 4.0)]):
        if c.get(X, Y) in 'CcQAa': c.set(X, Y, 'R')
    c.fill(poly([(sx - 2.6, sy - 0.2), (sx + 2.8, sy - 0.6), (sx + 3.0, sy + 1.6), (sx - 2.4, sy + 2.0)]), 'W')
    c.fill(poly([(sx - 3.2, sy - 1.8), (sx - 1.6, sy - 1.4), (sx - 1.4, sy + 0.8), (sx - 3.0, sy + 1.0)]), 'V')
    c.fill(poly([(sx + 2.2, sy - 1.6), (sx + 3.4, sy - 2.0), (sx + 3.8, sy + 0.2), (sx + 2.4, sy + 0.4)]), 'V')
    return c, (sx, sy - 0.4)


def emit_s(S, pal, label, desc, rider):
    fs, seats = {}, {}
    for fr in POSE:
        c, seat = serpent(S, fr); fs[fr] = c; seats[fr] = seat
    outs, top = frames([fs[k] for k in POSE])
    return {'frames': dict(zip(POSE, outs)), 'pal': pal, 'ax': S['ax'], 'seat': {k: [round(v[0]), round(v[1]) - top] for k, v in seats.items()},
            'label': label, 'desc': desc, 'rider': rider, 'float': S.get('lift', 6)}


S_D = dict(ax=20, lift=6,
    spine=[(33.4, 10.6), (30.6, 15.6), (26.8, 19.4), (21.6, 21.0), (16.4, 23.4), (12.0, 27.4), (7.0, 29.2), (3.0, 27.0), (1.4, 22.4), (3.4, 18.2), (7.0, 17.0)],
    r0=3.2, r1=0.9, hoff=(2.6, -1.8), hr=(3.3, 2.7),
    snout=[(1.0, -1.8), (7.4, -0.2), (7.0, 1.4), (0.8, 2.0)], jaw=[(0.8, 1.4), (6.0, 1.8), (5.6, 2.8), (0.2, 3.2)],
    horns=[((-1.4, -2.0), (-5.0, -4.6), 'z', 0.9, 0.45), ((-0.6, -2.2), (-3.8, -5.4), 'Z', 1.0, 0.5)],
    eye=(1.6, -0.6), nostril=(6.8, -0.6), mouth=(6.4, 1.4),
    fw=dict(sh=(23.8, 19.0), wr=(20.4, 13.6), tips=[(15.6, 12.4), (14.4, 15.6), (16.8, 18.4)], back=(19.6, 20.2)))
PAL_D = {'C': '#3a7ac0', 'Q': '#6aa8e0', 'c': '#2a5890', 'd': '#1e4068', 'A': '#eef0e6', 'a': '#c8ccc0', 'F': '#5ab4d8', 'f': '#3a88b0',
         'J': '#f2f6f8', 'j': '#a8c8d8', 'Z': '#f2cc64', 'z': '#b08a34', 'e': '#f0c040', 'K': '#10182a', 'w': '#ffffff', 'D': '#1e3e6e',
         'R': '#c8402e', 'W': '#5a3a22', 'V': '#3e2616'}
OUT['wyvD'] = emit_s(S_D, PAL_D, 'D 푸른 하늘뱀 용', '와이번이 아닌 긴 몸 용(그림 6 계열) · S자로 떠 있다 · 흰 갈기 · 금빛 뿔 · 남빛 등줄기 · 작은 지느러미 날개', 'wD')


if __name__ == '__main__':
    json.dump(OUT, open('../t/wyv.json', 'w'), ensure_ascii=False, indent=1)
    for k, v in OUT.items(): print(k, v['seat'], len(v['frames']['idle0'].split('\n')))
