"""지하미궁 B1 ~ B10 「돌 미로」 층 보스 둘째 묶음 B2 ~ B8 (Lv150.5 ~ 153.5) — 11-18 11:26 사용자 「… 다음도 ㄱㄱ」
첫 묶음(lab1.py)에서 고른 것: 미궁 쥐 A · 망령 A · 돌 파수꾼 B(골렘 변종) · B1 깃발 대장 A · B9 문짝 방패 문지기 A.
층 보스는 「다 새로 그려」(계획 문서) — 일곱 모두 새 그림, A · B 둘씩.
- B2 돌 파수견: A 사암 석상 사냥개(새긴 갈기 · 청동 목걸이 · 호박 구슬) · B 이끼 낀 옛 석상견(깨진 귀 · 옆구리 깨진 틈의 불씨 심장 · 부러진 꼬리)
- B3 실타래 거미: A 금실 실타래 거미(배가 감긴 실타래 · 끌리는 금실) · B 실패 거미(등에 진 나무 실패 · 붉은 실 · 바늘 다리)
- B4 벽 갉는 굴착 벌레: A 돌 갉는 굼벵이(큰 턱 · 비치는 배 속 돌 부스러기) · B 송곳머리 굴착충(원뿔 송곳 머리 · 쇠빛 마디 갑각)
- B5 메아리 박쥐: A 큰귀 메아리 박쥐(나팔 같은 큰 귀 · 잎 코 · 금빛 목털) · B 종유석 박쥐(석회 껍질 · 날개 끝 종유석 · 흐린 눈)
- B6 미궁 석공: A 망치 석공(먼지 두건 · 입 가리개 · 벽돌 지게 · 돌 메) · B 돌 가면 석공(가로 눈 틈 돌 가면 · 앞 어깨 마름돌 어깨받이 · 허리의 정 · 긴 쇠 끌)
- B7 갈림길 양끝뱀: A 이끼 비늘 양끝뱀(양 끝 머리 · 띠 무늬) · B 두 빛깔 양끝뱀(앞 머리 불빛 · 뒤 머리 얼음빛)
- B8 뼈 무덤지기: A 뼈 자루 무덤지기(찢긴 넓은 챙 모자 · 마른 얼굴 · 등의 뼈 자루 · 삽) · B 뼈 갑주 무덤지기(거인 머리뼈 투구 · 옆에서 본 갈비 셋 · 해골 어깨받이 · 넓적다리뼈 몽둥이)
피한 것: 십자 · 더하기 꼴(엇갈린 뼈 · 엇갈린 연장 · 거미줄 바퀴살 · 실타래의 엇갈린 실 — 실은 한 방향 띠만 · 지게 기둥은 선반에서 끝) · 가면의 가로 줄 둘(二) · 흰 옷 · 너울 · 후광 · 유명한 괴물 · 인물(꽃잎 입 모래벌레 · 세 머리 개 · 검은 자칼 신 · 갈색 두건에 눈만 빛나는 작은 상인 · 염소 해골 · 새부리 가면) · 석공 표식(직각자와 컴퍼스) · 낫 든 저승사자
python3 lab1b.py → ../t/lab1b_*.json"""
from kit import *

K = 1.0


def rotp(pts, cx, cy, a):
    ca, sa = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * ca - (y - cy) * sa, cy + (x - cx) * sa + (y - cy) * ca) for (x, y) in pts]


# ═══════════ B2 돌 파수견 ═══════════
ACT2 = {'atk': ['qbite', 'qpounce'], 'skl': ['qmaul'], 'tk': 1.15,
        'fx': {'atk': {'pal': 'earth', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'earth', 'hit': 'claw', 'big': 2, 'after': 'dust', 'shake': 2}}}
B2 = Batch('lab1b_hound', 'huntdog', ACT2, 'passage', show=[['qbite', 4], ['qpounce', 4]], still=1, noArm=1, wpn='none', ms=1.5)
HPOSE = {'idle0': dict(t=0.0, up=0.0, ff=(0, 0), hf=(0, 0), hd=0.0, hx=0.0, op=0, tl=0.0),
         'idle1': dict(t=0.0, up=-0.4, ff=(0, 0), hf=(0, 0), hd=-0.5, hx=0.0, op=0, tl=1.2),
         'bite': dict(t=0.07, up=0.6, ff=(1.4, 0), hf=(-0.6, 0), hd=2.6, hx=1.8, op=1, tl=0.6),
         'charge': dict(t=0.08, up=0.8, ff=(3.6, -0.4), hf=(-3.2, 0), hd=1.6, hx=1.4, op=0, tl=1.0),
         'leap': dict(t=-0.16, up=-3.2, ff=(4.0, -3.6), hf=(-4.8, -1.0), hd=-0.6, hx=0.6, op=1, tl=-1.4)}
GYH = 39.0


def zig(c, pts, ch, on):
    """빛나는 금: 꺾인 한 줄 (엇갈리지 않게)"""
    c.only(thins(pts), ch, on)


def stonehound(mode, opt):
    c = Cv(66, 44); P = HPOSE[mode]; up = P['up']; pv = (27.0, 21.0)
    R = lambda pts: rotp([(x, y + up) for (x, y) in pts], pv[0], pv[1] + up, P['t'])
    g = GYH - 1.0; lift = min(0, up)
    fx_, fy_ = P['ff']; hx_, hy_ = P['hf']

    def leg(pts, ch, w0, w1, paw=3.0):
        c.fill(path(pts, w0, w1), ch); f = pts[-1]; c.fill(ell(f[0] + 1.0, f[1] - 0.3, paw, 1.5), ch)
        return f

    # 먼 다리 둘
    leg([R([(34.4, 19.0)])[0], (34.8 + fx_ * 0.45, 29.0 + fy_ * 0.45 + up * 0.3), (35.0 + fx_, g + fy_ + lift)], 'c', 2.8, 2.3)
    leg([R([(17.4, 19.0)])[0], (15.0 + hx_ * 0.35, 27.4 + hy_ * 0.35 + up * 0.3), (16.0 + hx_ * 0.6, 32.4 + hy_ * 0.5 + up * 0.3), (16.8 + hx_, g + hy_ + lift)], 'c', 3.4, 2.3)
    # 꼬리
    tl = P['tl']
    if opt == 'A':
        tail = R([(13.0, 16.4), (9.6, 13.6 + tl * 0.3), (7.8, 9.6 + tl * 0.6), (8.4, 6.0 + tl)])
        c.fill(path(tail, 2.4, 1.9), 'H')
        tp = tail[-1]
        for (dx, dy, r) in ((-0.4, -1.2, 2.0), (1.8, -2.0, 1.5), (-2.2, 0.4, 1.5), (1.6, 0.6, 1.3)):              # 꼬리 끝 새긴 털 다발
            c.fill(ell(tp[0] + dx, tp[1] + dy, r, r * 1.1), 'H')
    else:
        tail = R([(13.0, 16.4), (10.2, 14.4 + tl * 0.2), (8.8, 12.4 + tl * 0.4)])                                 # 부러진 꼬리 토막
        c.fill(path(tail, 2.0, 1.9), 'C')
    # 몸통: 높은 어깨 · 깊고 넓은 가슴 · 짧고 굵은 몸
    body = R([(12.0, 18.4), (14.6, 15.0), (21.0, 14.4), (28.0, 13.6), (34.0, 12.0), (38.6, 12.6), (42.0, 16.6), (41.4, 24.4), (37.0, 27.0),
              (30.0, 26.6), (23.0, 25.6), (17.0, 26.0), (12.8, 24.2)])
    c.fill(poly(body), 'C')
    hd, hxo = P['hd'], P['hx']; hx, hy = R([(46.4 + hxo, 10.6 + hd)])[0]
    c.fill(poly(R([(35.0, 12.4), (40.0, 9.4)]) + [(hx - 2.6, hy - 3.6), (hx + 0.8, hy + 3.8)] + R([(41.6, 21.0), (37.0, 20.4)])), 'C')   # 굵은 목
    c.fill(rbox(hx - 5.0, hy - 4.6, hx + 3.4, hy + 4.0, 2.4), 'C')                                                # 크고 네모난 머리
    c.fill(rbox(hx + 1.6, hy - 1.8, hx + 8.4, hy + 3.8, 1.1), 'C')                                                # 짧고 굵은 주둥이
    if opt == 'B': c.fill(ell(hx + 2.6, hy + 4.2, 2.6, 1.8), 'C')                                                 # 늘어진 볼살
    if P['op']:
        c.fill(poly([(hx + 0.6, hy + 3.0), (hx + 7.8, hy + 4.8), (hx + 7.4, hy + 6.6), (hx - 0.4, hy + 5.2)]), 'C')    # 벌린 아래턱
        c.fill(poly([(hx + 1.6, hy + 2.6), (hx + 8.2, hy + 2.8), (hx + 7.6, hy + 4.6), (hx + 1.6, hy + 4.2)]), 'm')
        for (dx, dy) in ((7.4, 2.8), (4.4, 2.8), (6.8, 4.4), (3.8, 4.2)): c.set(hx + dx, hy + dy, 'w')
    # 귀
    if opt == 'A':
        c.fill(poly([(hx - 4.0, hy - 3.2), (hx - 3.4, hy - 8.8 + (0.6 if mode == 'idle1' else 0)), (hx - 0.6, hy - 4.0)]), 'C')
    else:
        c.fill(poly([(hx - 4.2, hy - 3.0), (hx - 4.4, hy - 6.0), (hx - 2.4, hy - 6.6), (hx - 0.6, hy - 4.0)]), 'C')    # 끝이 깨진 귀
    # 가까운 다리 둘
    fp = leg([R([(37.8, 19.6)])[0], (38.2 + fx_ * 0.45, 29.4 + fy_ * 0.45 + up * 0.3), (38.6 + fx_, g + fy_ + lift)], 'C', 3.4, 2.8, 3.2)
    hp = leg([R([(15.8, 19.6)])[0], (12.8 + hx_ * 0.35, 28.0 + hy_ * 0.35 + up * 0.3), (14.0 + hx_ * 0.6, 32.8 + hy_ * 0.5 + up * 0.3), (14.8 + hx_, g + hy_ + lift)], 'C', 3.8, 2.6, 3.2)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    for f in (fp, hp):                                                                                           # 발가락 새김 (세로 금 둘)
        for dx in (0.6, 2.2): c.only(box(f[0] + dx, f[1] - 0.6, f[0] + dx, f[1] + 0.4), 'd', 'CQc')
    eye = (hx + 0.4, hy - 2.0)
    c.fill(box(hx + 7.8, hy - 1.6, hx + 8.4, hy - 0.6), 'k')                                                    # 코
    if not P['op']: c.fill(thins([(hx + 2.0, hy + 2.6), (hx + 8.0, hy + 2.2)]), 'd')                           # 다문 입 금
    c.fill(box(hx - 1.4, hy - 3.2, hx + 2.4, hy - 3.2), 'c')                                                    # 굵은 눈두덩
    if opt == 'A':
        # 목 · 가슴을 덮은 새긴 갈기 (반달 덩이를 겹친 띠 · 덩이마다 같은 쪽으로 기운 결 둘)
        locks = [(-4.4, -5.6, 3.4, 2.8), (-7.0, -2.6, 3.8, 3.2), (-8.0, 1.2, 3.8, 3.4), (-7.6, 5.0, 3.8, 3.4), (-5.6, 8.6, 3.6, 3.0), (-2.4, 10.0, 3.2, 2.6), (-1.6, 6.2, 2.8, 2.6)]
        mane = set()
        for (dx, dy, rx, ry) in locks: mane |= ell(hx + dx, hy + dy, rx, ry)
        mane = {(x, y) for (x, y) in mane if c.get(x, y) != '.' or y > hy - 2}
        c.fill(mane, 'H'); blunt(c.g, 'H', 'L', 'h', bottom=1, side=0)
        for (dx, dy, rx, ry) in locks:
            cx_, cy_ = hx + dx, hy + dy
            c.only(thin((cx_ - 1.2, cy_ - 0.8), (cx_ + 0.2, cy_ + 1.4)), 'h', 'HL')
        pg = (hx - 0.6, hy + 12.4); c.fill(ell(pg[0], pg[1] - 1.2, 1.0, 0.8), 'G')                                   # 청동 고리 + 호박 구슬
        c.fill(ell(pg[0], pg[1] + 0.4, 1.5, 1.5), 'O'); c.set(pg[0] - 0.4, pg[1] - 0.2, 'Y')
        for (x0, y0, x1, y1) in ((20.0, 17.6, 25.0, 17.0), (27.0, 17.0, 32.0, 16.2)):                         # 옆구리 새긴 결 (가로만)
            q = R([(x0, y0), (x1, y1)]); c.only(thin(q[0], q[1]), 'c', 'C')
    else:
        core = R([(25.0, 20.0)])[0]                                                                               # 옆구리 깨진 틈 + 불씨 심장
        hole = ell(core[0], core[1], 3.6, 2.8) | ell(core[0] + 2.4, core[1] - 0.8, 2.0, 1.6)
        c.fill({(x, y) for (x, y) in hole if c.get(x, y) != '.'}, 'd')
        c.fill(ell(core[0] + 0.6, core[1] + 0.2, 2.0, 1.6), 'l'); c.fill(ell(core[0] + 0.6, core[1] + 0.2, 1.1, 0.9), 'L'); c.set(core[0] + 0.4, core[1] - 0.2, 'Y')
        for pts in (((29.4, 18.4), (31.0, 17.0), (31.4, 15.2), (33.4, 14.0)), ((21.4, 21.6), (20.4, 23.0), (18.6, 23.6))):   # 틈에서 뻗은 빛나는 금 (꺾인 한 줄)
            zig(c, R(list(pts)), 'l', 'CQc')
        for (x0, y0, x1, y1) in ((16.0, 14.6, 25.0, 15.2), (29.0, 13.6, 36.0, 12.0)):                         # 등을 덮은 이끼
            q = R([(x0, y0), (x1, y1)]); c.fill(path(q, 1.2), 'v'); c.only(thin((q[0][0], q[0][1] - 0.6), (q[1][0], q[1][1] - 0.6)), 'A', 'v')
        c.fill(path([(hx - 3.8, hy - 4.4), (hx + 0.8, hy - 4.8)], 1.0), 'v')                                       # 머리 위 이끼
        c.fill(box(hx + 7.6, hy - 2.0, hx + 8.6, hy - 1.2), '_')                                                    # 깨진 코끝
        ring = (hx - 3.4, hy + 6.4)                                                                               # 목의 끊어진 쇠사슬 (고리 셋 — 구멍 난 네모 고리 + 이음)
        c.fill(path([(hx - 6.0, hy + 3.4), (hx - 1.0, hy + 6.8)], 1.0), 'N')
        for k, (dx, dy) in enumerate(((0.0, 0.0), (0.6, 2.6), (0.2, 5.2))):
            x0, y0 = ring[0] + dx, ring[1] + dy
            if k % 2 == 0: c.fill(box(x0 - 1, y0 - 1, x0 + 1, y0 + 1), 'N'); c.set(x0, y0, '_')
            else: c.fill(box(x0, y0 - 1, x0, y0 + 1), 'n')
    c.fill(box(eye[0], eye[1], eye[0] + 1.4, eye[1] + 0.5), 'E')
    return c


PAL2 = {'A': {'C': '#a89a7a', 'Q': '#d2c6a4', 'c': '#6e6450', 'd': '#4a4234', 'H': '#7e6a48', 'L': '#a8946c', 'h': '#4e4230',
              'G': '#b8843a', 'O': '#ffb040', 'Y': '#fff0b0', 'E': '#ffd27a', 'k': '#1a140e', 'w': '#f0e8d0', 'm': '#4a1e14'},
        'B': {'C': '#5c6068', 'Q': '#848a94', 'c': '#3a3d44', 'd': '#1e1f24', 'v': '#4e7a32', 'A': '#86b04e', 'L': '#ffd060', 'l': '#ff8a2a', 'Y': '#fff6c0',
              'N': '#7a7468', 'n': '#4e4a42', 'E': '#ff9a40', 'k': '#121316', 'w': '#e8e4d8', 'm': '#3a1410'}}
LAB2 = {'A': ('A 사암 석상 사냥개', 'B2 층 보스 · 미로 입구를 지키던 사암 석상 사냥개가 깨어났다 · 굵은 다리 · 크고 네모난 머리와 굵은 눈두덩 · 목과 가슴을 덮은 새긴 갈기 · 가슴에 청동 고리로 건 호박 구슬 · 꼬리 끝 새긴 털 다발 · 누런 눈'),
        'B': ('B 이끼 낀 옛 석상견', 'B2 층 보스 · 미로보다 오래된 검은 현무암 석상견 · 늘어진 볼살 · 끝이 깨진 귀와 코 · 등과 머리를 덮은 이끼 · 목에 끊어진 쇠사슬 · 옆구리 깨진 틈 속에서 불씨 심장이 타고 금으로 빛이 샌다 · 부러진 꼬리 · 주황 눈')}
for opt in 'AB':
    fr = {m: stonehound(m, opt) for m in HPOSE}
    B2.add('stonehound' + ('' if opt == 'A' else '_b'), LAB2[opt][0], LAB2[opt][1], [fr['idle0'], fr['idle1']], PAL2[opt], (54, 13), 27,
           gm={m: fr[m] for m in ('bite', 'charge', 'leap')})
B2.dump()


# ═══════════ B3 실타래 거미 ═══════════
ACT3 = {'atk': ['qbite', 'sleap'], 'skl': ['sspit'], 'tk': 1.0,
        'fx': {'atk': {'pal': 'shadow', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'gold', 'hit': 'trap', 'p': 'dart', 'big': 1, 'after': 'motes'}}}
B3 = Batch('lab1b_spider', 'spider', ACT3, 'passage', show=[['qbite', 4], ['sspit', 4]], still=1, noArm=1, wpn='none', ms=1.5)
SPOSE = {'idle0': dict(dx=0.0, dy=0.0, t=0.0, raise_=0.0, lift=0.0, op=0),
         'idle1': dict(dx=0.0, dy=-0.6, t=0.0, raise_=0.0, lift=0.0, op=0),
         'bite': dict(dx=2.0, dy=1.0, t=0.08, raise_=0.0, lift=0.0, op=1),
         'rear': dict(dx=-1.0, dy=-1.0, t=-0.20, raise_=1.0, lift=0.0, op=1),
         'leap': dict(dx=1.0, dy=-4.0, t=-0.08, raise_=0.4, lift=1.0, op=1)}
GYS = 38.0


def spider(mode, opt):
    c = Cv(64, 44); P = SPOSE[mode]; pv = (31.0, 23.0)
    R = lambda pts: rotp([(x + P['dx'], y + P['dy']) for (x, y) in pts], pv[0] + P['dx'], pv[1] + P['dy'], P['t'])
    g = GYS - 0.6
    lift = P['lift'] * 3.0

    def leg(pts, ch, w0, w1):
        c.fill(path(pts, w0, w1), ch)

    # 다리 자리 (가까운 쪽 넷 = 둥근 아치가 겹겹이 — 엇갈리지 않게 앞 · 뒤 가장 바깥 다리가 가장 높다)
    ra = P['raise_']
    near = [  # 붙는 곳(몸) · 무릎 · 정강이 · 발
        (R([(35.0, 21.6)])[0], (45.0 + P['dx'], 6.0 + P['dy'] - ra * 6.0), (53.0 + P['dx'] * 0.5, 25.0 - ra * 10.0 - lift), (55.0 + P['dx'] * 0.3, g - ra * 14.0 - lift)),
        (R([(33.6, 24.2)])[0], (40.8 + P['dx'], 15.0 + P['dy'] - ra * 4.0), (45.6 + P['dx'] * 0.5, 28.0 - ra * 5.0 - lift), (47.0 + P['dx'] * 0.3, g - ra * 6.0 - lift)),
        (R([(29.6, 24.4)])[0], (23.4 + P['dx'], 15.0 + P['dy']), (19.4 + P['dx'] * 0.3, 28.0 - lift), (18.0, g - lift)),
        (R([(28.4, 21.6)])[0], (18.6 + P['dx'], 5.6 + P['dy']), (9.6 + P['dx'] * 0.3, 25.0 - lift), (7.6, g - lift))]
    farl = [(R([(31.4, 26.0)])[0], (34.6 + P['dx'] * 0.5, 31.0 - lift), (36.4 + P['dx'] * 0.4, g - ra * 3.0 - lift)),   # 먼 쪽 다리 둘 (몸 밑 짧은 정강이만)
            (R([(28.8, 26.0)])[0], (27.0 + P['dx'] * 0.3, 31.0 - lift), (26.0, g - lift))]
    for pts in farl: leg(pts, 'd', 0.9, 0.7)
    LW = (1.3, 1.0, 0.9, 0.5) if opt == 'A' else (1.0, 0.8, 0.7, 0.4)

    def nearleg(i):
        a, k, s, f = near[i]; ch = 'N' if opt == 'B' else 'C'
        leg([a, k], ch, LW[0], LW[1]); leg([k, s], ch, LW[1], LW[2]); leg([s, f], ch, LW[2], LW[3])
        if opt == 'B':
            c.fill(ell(k[0], k[1], 1.1, 1.1), 'G'); c.fill(ell(s[0], s[1], 0.9, 0.9), 'G')                         # 놋쇠 마디
            c.only(thin((s[0] + (f[0] - s[0]) * 0.55, s[1] + (f[1] - s[1]) * 0.55), f), 'x', 'N')                     # 바늘 끝 빛
        else:
            c.fill(ell(k[0], k[1], 1.3, 1.3), 'A'); c.fill(ell(s[0], s[1], 1.1, 1.1), 'A')                         # 마디 띠 (금빛)
    for i in (3, 2): nearleg(i)                                                                                 # 뒤 다리 둘은 배 뒤로 (배가 가린다)
    if opt == 'A': blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    # 배 (A 실타래 · B 작은 배 + 실패)
    if opt == 'A':
        ab = R([(13.6, 14.0)])[0]; ball = ell(ab[0], ab[1], 10.4, 9.4)
        c.fill(ball, 'G')
        u = (math.cos(math.radians(-58)), math.sin(math.radians(-58)))
        for (x, y) in ball:                                                                                        # 한 방향으로 감긴 실 (비스듬한 띠 — 엇갈리는 실 없음)
            d = (x + 0.5 - ab[0]) * u[0] + (y + 0.5 - ab[1]) * u[1] + 0.05 * ((x + 0.5 - ab[0]) ** 2 + (y + 0.5 - ab[1]) ** 2) ** 0.5
            if int(math.floor(d)) % 3 == 0: c.set(x, y, 'g')
        rimc = {(x, y) for (x, y) in ball if (x, y - 1) not in ball or (x - 1, y) not in ball}
        c.only({(x, y) for (x, y) in rimc if y < ab[1] - 1 and x < ab[0] + 3}, 'Y', 'Gg')                          # 위 왼쪽 빛
        c.only({(x, y) for (x, y) in ball if (x, y + 1) not in ball or (x + 1, y) not in ball}, 'g', 'GY')           # 아래 그늘
        tail = [R([(4.4, 19.0)])[0], (2.6 + P['dx'] * 0.2, 27.0), (4.6, 32.0), (2.0, g + 0.2)]                    # 끌리는 금실 (땅까지)
        if mode == 'leap': tail = tail[:2] + [(1.6, 30.0)]
        c.under(thins(tail), 'G')
        c.fill(path([R([(22.6, 19.6)])[0], R([(25.6, 21.4)])[0]], 2.2), 'C')                                         # 허리 (배와 머리가슴을 잇는 곳)
    else:
        ab = R([(17.0, 19.0)])[0]; c.fill(ell(ab[0], ab[1], 7.4, 6.0), 'C')                                      # 작은 배
        sp = R([(14.6, 9.0)])[0]                                                                                  # 등에 진 나무 실패 (선 채)
        core = rbox(sp[0] - 4.6, sp[1] - 4.6, sp[0] + 4.6, sp[1] + 5.4, 0.6)
        c.fill(core, 'R')
        for (x, y) in core:
            if int(y - sp[1] + 10) % 2 == 0: c.set(x, y, 'r')                                                   # 감긴 붉은 실 (가로 줄만)
        for fy in (-6.0, 6.6):                                                                                    # 위 · 아래 나무 테
            c.fill(rbox(sp[0] - 6.2, sp[1] + fy - 1.0, sp[0] + 6.2, sp[1] + fy + 1.0, 0.8), 'O')
            c.only(box(sp[0] - 6.2, sp[1] + fy + 1.0, sp[0] + 6.2, sp[1] + fy + 1.0), 'o', 'O')
        c.fill(box(sp[0] - 0.6, sp[1] - 8.0, sp[0] + 0.6, sp[1] - 7.0), 'o')                                       # 굴대 머리
        c.fill(thins([(sp[0] - 5.4, sp[1] + 8.0), (ab[0] - 1.0, ab[1] - 3.0)]), 'b'); c.fill(thins([(sp[0] + 5.4, sp[1] + 8.0), (ab[0] + 4.0, ab[1] - 2.4)]), 'b')   # 배에 묶은 가죽끈
        tail = [(sp[0] - 4.8, sp[1] + 2.0), (sp[0] - 9.0, sp[1] + 6.0), (sp[0] - 10.4, 26.0), (sp[0] - 8.6, 31.0), (sp[0] - 11.0, g + 0.2)]   # 실패에서 풀려 끌리는 붉은 실
        if mode == 'leap': tail = tail[:3]
        c.under(thins(tail), 'R')
    # 머리가슴
    ct = R([(31.0, 22.6)])[0]; c.fill(ell(ct[0], ct[1], 7.0, 5.2), 'C')
    hd = R([(36.8, 21.4)])[0]; c.fill(ell(hd[0], hd[1], 3.6, 3.4), 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    # 엄니: 머리 밑 짧은 턱 둘 + 끝만 흰 갈고리
    fo = 1.0 if P['op'] else 0.0
    ch0 = R([(38.0, 24.4)])[0]; c.fill(ell(ch0[0], ch0[1], 1.6, 1.3), 'c')
    for dx in (-0.6, 1.0):
        f0 = (ch0[0] + dx, ch0[1] + 0.8); c.fill(thins([f0, (f0[0] + 0.2 + fo * 0.6, f0[1] + 1.6 + fo)]), 'w')
    # 앞 다리 둘 (몸 앞으로)
    for i in (1, 0): nearleg(i)
    if opt == 'A': blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    # 눈 (넷 — 큰 둘 · 작은 둘)
    e0 = R([(38.0, 19.4)])[0]
    c.fill(box(e0[0], e0[1], e0[0] + 1.0, e0[1] + 0.4), 'e'); c.fill(box(e0[0] - 2.6, e0[1] - 0.6, e0[0] - 1.6, e0[1] - 0.2), 'e')
    c.set(e0[0] + 1.6, e0[1] + 1.8, 'e'); c.set(e0[0] - 0.8, e0[1] + 1.4, 'e')
    return c


PAL3 = {'A': {'C': '#4e3c2e', 'Q': '#76604a', 'c': '#30241a', 'd': '#1e150e', 'G': '#d8aa48', 'g': '#9c7428', 'Y': '#fff0b0', 'A': '#b88a3c',
              'e': '#ff7a3a', 'w': '#f0e6d0'},
        'B': {'C': '#3c3450', 'Q': '#5e5476', 'c': '#262034', 'd': '#18141f', 'R': '#c83a3a', 'r': '#8a2428', 'O': '#b07a44', 'o': '#6e4a26',
              'b': '#5a3a22', 'N': '#aab4be', 'n': '#6e7680', 'x': '#f2f8ff', 'G': '#c8a050', 'e': '#ffd040', 'w': '#efe6d6'}}
LAB3 = {'A': ('A 금실 실타래 거미', 'B3 층 보스 · 미로에 금실을 늘어뜨려 길 잃은 이를 끌어들이는 큰 거미 · 배가 통째로 금실 실타래(한 방향으로 감긴 실) · 땅까지 끌리는 금실 · 무릎과 정강이의 금빛 마디 띠 · 붉은 눈 넷 · 흰 엄니 · 금실을 뿜어 묶는다'),
        'B': ('B 실패 거미', 'B3 층 보스 · 등에 큰 나무 실패를 가죽끈으로 묶어 지고 다니는 거미 · 실패에 감긴 붉은 실이 풀려 땅에 끌린다 · 바늘처럼 뾰족한 은빛 다리와 놋쇠 마디 · 짙은 보랏빛 몸 · 노란 눈 넷')}
for opt in 'AB':
    fr = {m: spider(m, opt) for m in SPOSE}
    B3.add('threadspider' + ('' if opt == 'A' else '_b'), LAB3[opt][0], LAB3[opt][1], [fr['idle0'], fr['idle1']], PAL3[opt], (39, 25), 31,
           gm={m: fr[m] for m in ('bite', 'rear', 'leap')})
B3.dump()


# ═══════════ B4 벽 갉는 굴착 벌레 ═══════════
ACT4 = {'atk': ['qbite', 'qcharge'], 'skl': ['qgnaw'], 'tk': 1.2,
        'fx': {'atk': {'pal': 'earth', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'earth', 'hit': 'shatter', 'big': 2, 'after': 'dust', 'shake': 2}}}
B4 = Batch('lab1b_borer', 'sandworm', ACT4, 'passage', show=[['qbite', 4], ['qgnaw', 5]], still=1, noArm=1, wpn='none', ms=1.5)
WPOSE = {'idle0': dict(ar=0.0, lean=0.0, op=0, hx=0.0),
         'idle1': dict(ar=0.8, lean=0.0, op=0, hx=0.0),
         'bite': dict(ar=-0.6, lean=0.16, op=1, hx=2.0),
         'charge': dict(ar=-2.4, lean=0.06, op=0, hx=4.0)}
GYW = 34.0


def bez(p0, p1, p2, p3, n):
    return [((1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t * t * p2[0] + t ** 3 * p3[0],
             (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t * t * p2[1] + t ** 3 * p3[1]) for t in (i / n for i in range(n + 1))]


def grub(mode):
    """A 돌 갉는 굼벵이: C자로 굽은 통통한 마디 몸 (꼬리 왼쪽 아래 → 등 위 → 머리 오른쪽 아래)"""
    c = Cv(64, 40); P = WPOSE[mode]; ar = P['ar']
    pts = bez((7.0, GYW - 4.0), (6.0, 6.0 - ar), (40.0, 4.0 - ar), (42.0 + P['hx'], GYW - 9.0 + P['lean'] * 10), 12)
    rs = [3.2, 4.4, 5.6, 6.6, 7.2, 7.4, 7.4, 7.2, 6.8, 6.4, 6.0, 5.6, 5.2]
    segs = []
    for i, (p, r) in enumerate(zip(pts, rs)):
        e = ell(p[0], p[1], r, r * 0.96); segs.append(e)
    body = set().union(*segs)
    c.fill(body, 'C')
    for i in range(1, len(segs)):                                                                              # 마디 사이 주름 (앞 마디 둘레)
        c.only({(x, y) for (x, y) in segs[i] if any((x + dx, y + dy) not in segs[i] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))) and (x, y) in segs[i - 1]}, 'c', 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    # 비치는 배 속 돌 부스러기 (가운데 마디 아래쪽)
    for (k, dx, dy, r) in ((3, 1.0, 2.6, 1.3), (4, -0.6, 3.6, 1.6), (5, 1.8, 3.4, 1.3), (6, -0.8, 4.4, 1.7), (7, 1.4, 3.6, 1.4), (8, -0.4, 3.0, 1.5)):
        p = pts[k]; c.only(ell(p[0] + dx, p[1] + dy, r, r * 0.8), 'N', 'CQc')
        c.only({(int(p[0] + dx - 0.4), int(p[1] + dy - 0.5))}, 'x', 'N')
    # 다리 셋 (앞 마디 밑 — 짧은 갈색 다리, 땅에 닿는다)
    for k in (9, 10, 11):
        p = pts[k]; f0 = (p[0] - 0.6, p[1] + rs[k] * 0.7)
        c.fill(path([f0, (f0[0] + 1.8, f0[1] + 2.4), (f0[0] + 1.2, GYW - 0.6)], 0.8, 0.6), 'b')
    # 머리 (갈색 껍질) · 큰 턱
    hp = (pts[-1][0] + 4.6, pts[-1][1] + 0.6)
    c.fill(ell(hp[0], hp[1], 6.4, 5.6), 'B'); blunt(c.g, 'B', 'U', 'b', bottom=1, side=0, top=1)
    c.only(thin((hp[0] - 4.0, hp[1] - 4.0), (hp[0] - 1.0, hp[1] - 5.4)), 'U', 'Bb')
    op = 2.0 if P['op'] else 0.0
    for (sy, d) in ((-1.6, -1), (2.4, 1)):                                                                      # 위 · 아래 턱 (위아래로 벌어진다 — 엇갈리지 않게)
        y0 = hp[1] + sy + d * op * 0.4
        jaw = path([(hp[0] + 4.4, y0), (hp[0] + 9.0, y0 + d * (0.6 + op)), (hp[0] + 11.4, y0 + d * (-0.8 + op * 0.6))], 1.5, 0.7)
        c.fill(jaw, 'k')
        c.set(hp[0] + 11.0, y0 + d * (-0.8 + op * 0.6), 'w'); c.set(hp[0] + 7.0, y0 + d * (0.4 + op * 0.8) - d * 1.0, 'w')
    c.fill(box(hp[0] + 1.4, hp[1] - 2.8, hp[0] + 2.6, hp[1] - 2.2), 'E')                                       # 작은 눈
    if P['op']:
        for i in range(4): c.set(hp[0] + 11.0 + (i % 2) * 1.6, hp[1] - 1.0 + i * 1.0, 'N')                       # 갉아 낸 돌 부스러기
    return c


def driller(mode):
    """B 송곳머리 굴착충: 땅을 따라 누운 꼬리 → 앞으로 갈수록 솟은 쇠빛 마디 갑각 → 원뿔 송곳 머리"""
    c = Cv(72, 40); P = WPOSE[mode]; ar = P['ar']
    pts = bez((3.0, GYW - 2.6), (22.0, GYW - 0.6), (26.0, 9.0 - ar), (40.0 + P['hx'], 9.0 - ar + P['lean'] * 14), 10)
    rs = [2.4, 3.0, 3.6, 4.2, 4.8, 5.2, 5.6, 5.8, 6.0, 6.0, 6.0]
    segs = [ell(p[0], p[1], r, r * 1.05) for p, r in zip(pts, rs)]
    for i, e in enumerate(segs):                                                                                # 마디마다 갑각 판 (뒤에서 앞으로 겹쳐 그린다)
        c.fill(e, 'N')
        c.only({(x, y) for (x, y) in e if (x, y - 1) not in e}, 'x', 'N')                                     # 판 윗가장자리 빛
        nxt = segs[i + 1] if i + 1 < len(segs) else set()
        c.only({(x, y) for (x, y) in e if (x + 1, y) not in e and (x, y) not in nxt}, 'n', 'Nx')                # 판 앞 가장자리 그늘 (마디 사이 틈)
        c.only({(x, y) for (x, y) in e if (x + 2, y) not in e and (x + 1, y) in e and (x, y) not in nxt}, 'n', 'Nx')
        if i % 2 == 0: c.only({(x, y) for (x, y) in e if (x, y + 1) not in e}, 'R', 'Nxn')                   # 판 아래 녹
    # 마디 밑 짧은 다리 (땅에 닿은 마디만 — 비스듬한 갈고리, 빗살처럼 촘촘하지 않게)
    for k in (2, 4):
        p = pts[k]; c.fill(thins([(p[0], p[1] + rs[k] - 0.4), (p[0] + 1.4, GYW - 0.6)]), 'n')
    # 원뿔 송곳 머리
    hp = pts[-1]; dx, dy = hp[0] - pts[-2][0], hp[1] - pts[-2][1]; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    base = (hp[0] + ux * 3.4, hp[1] + uy * 3.4); TL = 15.0; tip = (base[0] + ux * TL, base[1] + uy * TL)
    cone = poly([(base[0] + nx * 6.4, base[1] + ny * 6.4), tip, (base[0] - nx * 6.4, base[1] - ny * 6.4)])
    c.fill(cone, 'G')
    for (x, y) in cone:                                                                                         # 비스듬한 홈 (한 방향 줄만 — 나사처럼)
        t = (x + 0.5 - base[0]) * ux + (y + 0.5 - base[1]) * uy; s = (x + 0.5 - base[0]) * nx + (y + 0.5 - base[1]) * ny
        if int(math.floor((t + s * 0.7) / 2.2)) % 2 == 0: c.set(x, y, 'g')
    c.only({(x, y) for (x, y) in cone if (x + 0.5 - base[0]) * nx + (y + 0.5 - base[1]) * ny < -2.0 and c.get(x, y) == 'G'}, 'Y', 'G')   # 위쪽 빛
    c.only({(x, y) for (x, y) in cone if (x + 0.5 - base[0]) * ux + (y + 0.5 - base[1]) * uy > TL - 4.6}, 'L', 'GgY')        # 달궈진 끝
    c.only({(x, y) for (x, y) in cone if (x + 0.5 - base[0]) * ux + (y + 0.5 - base[1]) * uy > TL - 2.4}, 'Y', 'L')
    ring = ell(hp[0] + ux * 2.0, hp[1] + uy * 2.0, 4.6, 6.6) - cone                                               # 송곳 받침 (두꺼운 쇠 고리)
    c.fill(ring, 'n'); c.only({(x, y) for (x, y) in ring if (x, y - 1) not in ring}, 'N', 'n')
    c.fill(box(hp[0] - 2.4, hp[1] - 3.0, hp[0] - 1.2, hp[1] - 2.4), 'E'); c.fill(box(hp[0] - 4.6, hp[1] - 1.6, hp[0] - 3.6, hp[1] - 1.0), 'E')   # 작은 눈 둘
    if P['op']:
        for i in range(4): c.set(min(c.W - 1, tip[0] + 0.6 + (i % 2) * 1.2), tip[1] - 1.6 + i * 1.1, 'Y' if i % 2 else 'L')      # 튀는 불티
    return c


PAL4 = {'A': {'C': '#e0d0ae', 'Q': '#f6ead0', 'c': '#a8946e', 'd': '#7a6a4c', 'N': '#7c7c86', 'x': '#c8e0ff', 'b': '#6a4220',
              'B': '#9a6430', 'U': '#c88a4a', 'k': '#2a1a10', 'w': '#f4ecd8', 'E': '#ffc860'},
        'B': {'N': '#6a6e78', 'x': '#9ea4b0', 'n': '#3c3f46', 'R': '#9a5a2e', 'G': '#c8a050', 'g': '#7a5a28', 'L': '#ff9a3a', 'Y': '#fff0a0', 'E': '#ff7a3a'}}
LAB4 = {'A': ('A 돌 갉는 굼벵이', 'B4 층 보스 · 미로 벽을 갉아 먹으며 자란 커다란 굼벵이 · C자로 굽은 통통한 마디 몸 · 비치는 배 속에 삼킨 돌 부스러기와 반짝이는 결정 · 갈색 머리 껍질 · 위아래로 벌어지는 큰 검은 턱 · 짧은 다리 셋'),
        'B': ('B 송곳머리 굴착충', 'B4 층 보스 · 머리 끝이 원뿔 송곳인 굴착충 · 비스듬한 홈을 판 송곳은 끝이 벌겋게 달궈져 있다 · 꼬리는 땅에 눕고 앞으로 갈수록 솟는 쇠빛 마디 갑각(아래 끝에 녹) · 작은 눈 둘 · 송곳을 박아 벽을 뚫는다')}
for opt, fn in (('A', grub), ('B', driller)):
    fr = {m: fn(m) for m in WPOSE}
    B4.add('wallborer' + ('' if opt == 'A' else '_b'), LAB4[opt][0], LAB4[opt][1], [fr['idle0'], fr['idle1']], PAL4[opt], (58, 24) if opt == 'A' else (60, 10), 28,
           gm={m: fr[m] for m in ('bite', 'charge')})
B4.dump()


# ═══════════ B5 메아리 박쥐 ═══════════
ACT5 = {'atk': ['bswoop'], 'skl': ['bswoop'], 'tk': 0.95,
        'fx': {'atk': {'pal': 'shadow', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'music', 'hit': 'wave', 'big': 2, 'after': 'motes', 'aoe': 'nova', 'shake': 2}}}
B5 = Batch('lab1b_bat', 'bat', ACT5, 'passage', show=[['bswoop', 4], ['bswoop', 5]], noArm=1, wpn='none', float=1, ms=1.5)
BPOSE = {'idle0': dict(wy=0.0, wx=0.0, tip=0.0, op=0, hy=0.0), 'idle1': dict(wy=5.0, wx=1.0, tip=3.0, op=0, hy=0.6),
         'bite': dict(wy=2.0, wx=-3.0, tip=1.0, op=1, hy=1.6)}
CX5 = 28.0   # 가운데 줄 (그림 너비 57 → 0 ~ 56)


def mirror(c):
    """왼쪽 반(0 ~ 28)을 오른쪽에 그대로 비춘다 (가운데 줄 28은 그대로)"""
    for y in range(c.H):
        for x in range(0, 28):
            ch = c.g[y][x]
            if ch != '.': c.g[y][56 - x] = ch


def bat(mode, opt):
    c = Cv(57, 46); P = BPOSE[mode]; wy, wx, tp = P['wy'], P['wx'], P['tip']; hy = P['hy']
    # 왼쪽 날개 (날개막 + 팔뼈 하나 — 손가락 뼈는 그리지 않는다: 바퀴살처럼 보여서)
    sh = (23.0, 21.0); wr = (9.0 - wx, 9.0 + wy)
    tips = [(1.0 - wx * 0.5, 17.0 + wy * 0.8 + tp), (3.4, 26.0 + wy * 0.5 + tp), (9.6, 31.0 + wy * 0.3 + tp * 0.6), (16.6, 31.4 + tp * 0.4)]
    mem, _ = wing(sh, wr, tips, (22.0, 29.0), depth=1.4)
    c.fill(mem, 'P')
    c.only({(x, y) for (x, y) in mem if (x, y + 1) not in mem}, 'p', 'P')                                       # 날개막 아랫가장자리 그늘
    c.fill(path([sh, ((sh[0] + wr[0]) / 2, (sh[1] + wr[1]) / 2 - 1.0), wr], 1.3, 1.0), 'q')                        # 팔뼈
    c.fill(box(wr[0] - 1.0, wr[1] - 2.0, wr[0], wr[1] - 1.0), 'w')                                             # 엄지 발톱
    if opt == 'B':
        for (x, y) in tips[1:]:                                                                                  # 날개 끝에 매달린 종유석
            c.fill(poly([(x - 1.2, y - 0.6), (x + 1.2, y - 0.6), (x, y + 3.4)]), 'L'); c.set(x, y + 2.4, 'l')
        c.fill(poly([(wr[0] - 1.6, wr[1] - 1.0), (wr[0] + 2.4, wr[1] - 1.6), (wr[0] + 1.0, wr[1] + 1.6)]), 'L')     # 손목 석회 껍질
    # 귀 (A 나팔처럼 큰 귀 · B 작고 깨진 귀)
    hc = (CX5, 14.0 + hy)
    if opt == 'A':
        ear = poly([(hc[0] - 2.4, hc[1] - 2.4), (hc[0] - 9.6, hc[1] - 13.6), (hc[0] - 11.4, hc[1] - 11.4), (hc[0] - 8.6, hc[1] - 3.0), (hc[0] - 5.0, hc[1] + 0.6)])
        c.fill(ear, 'C')
        inner = poly([(hc[0] - 3.6, hc[1] - 2.4), (hc[0] - 9.2, hc[1] - 11.2), (hc[0] - 9.6, hc[1] - 9.4), (hc[0] - 7.6, hc[1] - 3.0), (hc[0] - 5.0, hc[1] - 0.6)])
        c.fill(inner, 'S')
        for k in range(3):                                                                                       # 귓속 주름 (비스듬한 줄 셋 — 같은 쪽으로)
            y0 = hc[1] - 3.4 - k * 2.4; c.only(thin((hc[0] - 6.4 - k * 0.9, y0), (hc[0] - 4.6 - k * 0.9, y0 - 1.0)), 's', 'S')
    else:
        ear = poly([(hc[0] - 2.4, hc[1] - 2.4), (hc[0] - 6.6, hc[1] - 8.4), (hc[0] - 7.8, hc[1] - 6.8), (hc[0] - 6.8, hc[1] - 4.6), (hc[0] - 7.6, hc[1] - 2.8), (hc[0] - 4.4, hc[1] + 0.6)])
        c.fill(ear, 'C'); c.fill(poly([(hc[0] - 3.4, hc[1] - 2.2), (hc[0] - 6.0, hc[1] - 6.6), (hc[0] - 5.8, hc[1] - 2.6)]), 'S')
    # 몸 · 발
    c.fill(ell(CX5, 26.0 + hy * 0.5, 6.0, 8.4), 'C')
    for fx_ in (CX5 - 3.0,): c.fill(thins([(fx_, 33.6), (fx_ - 0.6, 36.0), (fx_ - 1.4, 37.0)]), 'q'); c.fill(thins([(fx_, 36.0), (fx_ + 0.6, 37.2)]), 'q')   # 발 (발톱)
    # 머리
    c.fill(ell(hc[0], hc[1], 5.4, 4.8), 'C')
    if opt == 'A':
        col = ell(CX5, 20.6 + hy * 0.6, 7.2, 3.6)                                                                # 금빛 목털
        c.fill(col, 'H'); c.only({(x, y) for (x, y) in col if (x, y + 1) not in col and x % 2 == 0}, 'h', 'H')
    mirror(c)
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    if opt == 'B':                                                                                               # 석회 껍질은 짝이 안 맞게 (띠 · 테로 안 보이게)
        for (cx_, cy_, rx, ry) in ((CX5 - 2.2, hc[1] - 3.2, 2.4, 1.5), (CX5 + 2.8, hc[1] - 2.0, 1.4, 1.1), (CX5 - 1.8, 21.6 + hy * 0.6, 3.0, 1.7), (CX5 + 2.6, 24.2 + hy * 0.6, 1.6, 1.2)):
            cr = ell(cx_, cy_, rx, ry); c.only(cr, 'L', 'CQc'); c.only({(x, y) for (x, y) in cr if (x, y + 1) not in cr}, 'l', 'L')
    # 얼굴 (가운데)
    ey = hc[1] - 0.6
    c.fill(box(CX5 - 3.0, ey, CX5 - 2.0, ey), 'e'); c.fill(box(CX5 + 2.0, ey, CX5 + 3.0, ey), 'e')
    if opt == 'A':
        c.fill(poly([(CX5 - 0.9, hc[1] + 1.6), (CX5, hc[1] - 0.8), (CX5 + 0.9, hc[1] + 1.6)]), 'S')                # 작은 잎 코 (세모)
    else:
        c.fill(box(CX5 - 0.6, hc[1] + 0.8, CX5 + 0.6, hc[1] + 1.2), 'k')
    if P['op']:
        c.fill(rbox(CX5 - 2.4, hc[1] + 2.2, CX5 + 2.4, hc[1] + 4.6, 0.8), 'm')
        for x in (CX5 - 1.6, CX5 + 1.6): c.fill(box(x, hc[1] + 2.2, x, hc[1] + 3.2), 'w')
    else:
        c.fill(box(CX5 - 1.6, hc[1] + 2.6, CX5 + 1.6, hc[1] + 2.6), 'k')
        for x in (CX5 - 1.6, CX5 + 1.6): c.set(x, hc[1] + 3.2, 'w')
    return c


PAL5 = {'A': {'C': '#5a4258', 'Q': '#7e6280', 'c': '#3a2a3c', 'P': '#6e4e6a', 'p': '#4a3248', 'q': '#2a1c2c', 'S': '#d898a8', 's': '#a86478',
              'H': '#d8b468', 'h': '#9c7a3a', 'e': '#ff5a3a', 'w': '#f0ece0', 'm': '#3a1020', 'k': '#140c16'},
        'B': {'C': '#4e5664', 'Q': '#727c8c', 'c': '#323844', 'P': '#5a6474', 'p': '#3c4452', 'q': '#252a34', 'S': '#a89aa8',
              'L': '#c8c2ae', 'l': '#94907e', 'e': '#c8f0ff', 'w': '#f0ece0', 'm': '#20141e', 'k': '#141820'}}
LAB5 = {'A': ('A 큰귀 메아리 박쥐', 'B5 층 보스 · 미로의 메아리로 길을 보는 큰 박쥐 · 나팔처럼 큰 두 귀(귓속 주름) · 작은 세모 잎 코 · 금빛 목털 · 짙은 보랏빛 날개막 · 붉은 눈 · 큰 울음(메아리 파동)으로 파티를 흔든다'),
        'B': ('B 종유석 박쥐', 'B5 층 보스 · 천장에 오래 매달려 석회 껍질이 앉은 잿빛 박쥐 · 날개 끝마다 매달린 종유석 · 머리 · 가슴 · 손목의 석회 껍질 · 앞을 못 보는 흐린 눈 · 메아리로 노린다')}
for opt in 'AB':
    fr = {m: bat(m, opt) for m in BPOSE}
    B5.add('echobat' + ('' if opt == 'A' else '_b'), LAB5[opt][0], LAB5[opt][1], [fr['idle0'], fr['idle1']], PAL5[opt], (28, 18), 28, gm={'bite': fr['bite']}, pad=0)
B5.dump()


# ═══════════ B6 미궁 석공 (사람꼴 · 앞 팔과 무기는 게임이 그린다) ═══════════
ACT6A = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.35,
         'fx': {'atk': {'pal': 'earth', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'earth', 'hit': 'quake', 'big': 2, 'after': 'dust', 'aoe': 'slam', 'shake': 3}}}
ACT6B = {'atk': ['pthrust', 'plow'], 'skl': ['pjump'], 'tk': 1.25,
         'fx': {'atk': {'pal': 'steel', 'hit': 'pierce', 'big': 1}, 'skl': {'pal': 'earth', 'hit': 'quake', 'big': 2, 'after': 'dust', 'shake': 2}}}
B6 = Batch('lab1b_mason', 'manhunter', ACT6A, 'passage', show=[['down', 4], ['smash', 5]], ms=1.5)
B6.extra = head_js('stonemallet', """
NNNNNNN
NNNNNNN
NNNNNNN
NNNNNNN
nnnnnnn
""", '돌 메 (미궁 석공 A): 자루 끝의 큰 네모 돌덩이 (큰 메)', L=7.0, shaft='o', below=2.5, fxw='club') + head_js('longchisel', """
.x.
NNN
NNN
NNN
nNn
.n.
""", '긴 쇠 끌 (미궁 석공 B): 끝이 납작한 날인 긴 쇠 끌을 창처럼', L=8.0, shaft='n', below=3.0, fxw='lance')


def mason(opt):
    c = Cv(50, 62); GY = 58.0
    # 다리 (먼 다리 → 가까운 다리) · 장화
    c.fill(path([(20.6, 38.0), (20.0, 47.0), (19.4, GY - 2.6)], 3.0, 2.5), 'u'); c.fill(rbox(16.4, GY - 3.8, 24.0, GY - 0.6, 1.0), 'b')
    c.fill(path([(25.4, 38.0), (26.6, 47.0), (27.0, GY - 2.6)], 3.2, 2.7), 'U'); c.fill(rbox(24.0, GY - 3.8, 32.4, GY - 0.6, 1.0), 'b')
    # 등짐
    if opt == 'A':
        for x in (9.6, 14.0): c.fill(box(x, 10.0, x + 1.0, 33.0), 'O')                                         # 벽돌 지게 기둥 둘 (선반에서 끝 — 선반과 엇갈리지 않게)
        c.fill(box(4.0, 33.0, 15.0, 34.2), 'O')                                                                    # 지게 선반
        brick = box(3.0, 12.0, 14.0, 32.0); c.fill(brick, 'R')                                                     # 쌓은 벽돌 (엇갈린 이음 — T자만)
        for y in range(14, 33, 3): c.only(box(3, y, 14, y), 'r', 'R')
        for j, y in enumerate(range(12, 32, 3)):
            for x in range(3 + (j % 2) * 2 + 1, 15, 4): c.only(box(x, y + 1, x, y + 2), 'r', 'R')
        c.fill(thins([(10.0, 10.0), (17.0, 22.0)]), 'b')                                                           # 지게 멜빵
    # 먼 팔 (늘어뜨림 · 굵은 팔)
    c.fill(path([(17.6, 24.0), (15.4, 30.6), (15.6, 36.4)], 2.8, 2.4), 'c'); c.fill(ell(15.8, 37.6, 2.4, 2.0), 's')
    # 몸통 (굽은 등 · 넓은 어깨)
    torso = poly([(13.0, 24.0), (19.6, 19.4), (28.4, 19.0), (33.6, 23.0), (34.0, 38.6), (16.4, 40.0), (12.0, 31.4)])
    c.fill(torso, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
    c.fill(poly([(24.0, 26.0), (33.6, 25.0), (35.4, 49.0), (25.4, 49.8)]), 'B')                                    # 앞치마 (가죽)
    c.only({(x, y) for (x, y) in poly([(24.0, 26.0), (33.6, 25.0), (35.4, 49.0), (25.4, 49.8)]) if x >= 34}, 'b', 'B')
    c.fill(box(15.6, 37.0, 34.0, 38.2), 'b')                                                                       # 허리띠
    for (x, y) in ((27.0, 41.0), (30.6, 45.4), (28.6, 33.0), (31.4, 29.0)): c.fill(box(x, y, x + 1, y), 'P')       # 앞치마에 묻은 회반죽
    if opt == 'B':
        c.fill(box(19.0, 38.2, 19.0, 42.6), 'n'); c.fill(box(21.0, 38.2, 21.0, 43.4), 'n')                         # 허리에 찬 정 둘 (나란히)
        c.fill(box(18.4, 42.6, 19.6, 43.6), 'N'); c.fill(box(20.4, 43.4, 21.6, 44.4), 'N')
        c.only(box(24, 21, 34, 21), 'm', 'Mx')
    # 머리 · 두건
    hood = poly([(20.4, 21.0), (19.4, 12.6), (22.6, 6.6), (28.6, 4.8), (33.6, 7.6), (35.6, 13.0), (34.6, 20.0), (29.6, 22.4)])
    c.fill(hood, 'H'); blunt(c.g, 'H', 'L', 'h', bottom=1, side=0, top=1)
    c.fill(poly([(20.4, 20.0), (16.8, 25.0), (22.0, 24.4)]), 'H')                                                  # 두건 자락
    if opt == 'A':
        c.fill(poly([(29.0, 9.6), (35.2, 9.6), (35.2, 18.6), (29.2, 18.2)]), 'K')                                  # 두건 속 어둠
        eyes(c, [(31.2, 11.6)], 'E'); c.set(33.8, 11.6, 'E')
        c.fill(poly([(29.0, 14.4), (35.8, 14.0), (35.4, 19.0), (29.4, 19.0)]), 'P')                                # 입 가리개 (천)
        c.only(thin((29.4, 16.4), (35.2, 16.0)), 'p', 'P')
    else:
        mk = poly([(28.6, 8.6), (35.0, 8.6), (36.2, 14.4), (35.0, 19.4), (28.8, 19.2)])                           # 새긴 돌 가면
        c.fill(mk, 'M'); c.only({(x, y) for (x, y) in mk if (x + 1, y) not in mk}, 'm', 'M'); c.only({(x, y) for (x, y) in mk if (x, y - 1) not in mk}, 'x', 'M')
        c.fill(box(30.4, 11.6, 34.8, 12.4), 'K'); c.fill(box(31.4, 11.6, 32.4, 12.4), 'E'); c.fill(box(33.4, 11.6, 34.4, 12.4), 'E')   # 가로 눈 틈 · 빛
        pd = rbox(23.6, 19.4, 34.6, 26.0, 1.4)                                                                     # 앞 어깨의 미로 마름돌 어깨받이 (두건 아래에 얹힌다)
        c.fill(pd, 'M'); c.only({(x, y) for (x, y) in pd if (x, y - 1) not in pd}, 'x', 'M'); c.only({(x, y) for (x, y) in pd if (x, y + 1) not in pd or (x + 1, y) not in pd}, 'm', 'M')
        c.only(box(29, 20, 29, 22), 'm', 'M'); c.only(box(24, 23, 34, 23), 'm', 'Mx')                            # 돌 이음 (T자)
    return c


PAL6 = {'A': {'C': '#6e6a64', 'Q': '#94908a', 'c': '#4a4744', 'U': '#5a5048', 'u': '#3e3630', 'b': '#2e241c', 'B': '#7a5232', 'O': '#8a6236',
              'R': '#9a4e36', 'r': '#6a3424', 'H': '#7c7062', 'L': '#a4987e', 'h': '#544a40', 'K': '#141210', 'E': '#ffc860', 'P': '#b8ae98', 'p': '#8a8270', 's': '#8a7a68',
              'N': '#8a8a90', 'n': '#5a5a62', 'o': '#6e4a26', 'x': '#e8eef4'},
        'B': {'C': '#5e5a6a', 'Q': '#827e90', 'c': '#3e3a48', 'U': '#4e4840', 'u': '#36302a', 'b': '#2a201a', 'B': '#6e4a2e', 'H': '#8a6e4a', 'L': '#b09068', 'h': '#5e4a30',
              'K': '#141210', 'E': '#9af0ff', 'M': '#9c968a', 'm': '#5e5a50', 'P': '#c8c0aa', 's': '#8a7a68', 'N': '#a8b0b8', 'n': '#5e6670', 'x': '#f0f6ff', 'o': '#6e4a26'}}
LAB6 = {'A': ('A 망치 석공', 'B6 층 보스 · 무너진 벽을 밤새 다시 쌓는 미궁의 석공 · 먼지 앉은 잿빛 두건 · 두건 속 누런 눈 · 천 입 가리개 · 가죽 앞치마의 회반죽 · 등의 벽돌 지게(엇갈린 이음) · 큰 돌 메를 내리친다'),
        'B': ('B 돌 가면 석공', 'B6 층 보스 · 미로의 돌로 깎은 가면을 쓴 석공 · 가면의 가로 눈 틈에 푸른 빛 둘 · 황토빛 두건 · 앞 어깨에 미로 마름돌 어깨받이 · 허리에 찬 정 둘 · 긴 쇠 끌을 창처럼 찌른다')}
for opt, act, wpn, show, idle in (('A', ACT6A, 'stonemallet', [['down', 4], ['smash', 5]], {'h': [3, 3], 'a': -60}),
                                   ('B', ACT6B, 'longchisel', [['pthrust', 4], ['pjump', 5]], {'h': [3, 3], 'a': -75})):
    B6.add('mazemason' + ('' if opt == 'A' else '_b'), LAB6[opt][0], LAB6[opt][1], mason(opt), PAL6[opt], (30, 23), 24, 37,
           wpn=wpn, arm=['C', 'c'], hand='s', idle=idle, act=act, show=show)
B6.dump()


# ═══════════ B7 갈림길 양끝뱀 ═══════════
ACT7 = {'atk': ['qbite', 'qcharge'], 'skl': ['qmaul'], 'tk': 1.2,
        'fx': {'atk': {'pal': 'poison', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'poison', 'hit': 'bite', 'big': 2, 'after': 'bubbles', 'aoe': 'coil', 'shake': 2}}}
ACT7B = {'atk': ['qbite', 'qcharge'], 'skl': ['qmaul'], 'tk': 1.2,
         'fx': {'atk': {'pal': 'fire', 'hit': 'bite', 'big': 1}, 'skl': {'pal': 'ice', 'hit': 'shatter', 'big': 2, 'after': 'motes', 'aoe': 'coil', 'shake': 2}}}
B7 = Batch('lab1b_snake', 'anaconda', ACT7, 'passage', show=[['qbite', 4], ['qmaul', 5]], still=1, noArm=1, wpn='none', ms=1.5)
NPOSE = {'idle0': dict(f=(0.0, 0.0), r=(0.0, 0.0), hump=0.0, op=0, rop=0),
         'idle1': dict(f=(0.0, -0.8), r=(0.0, 0.9), hump=0.6, op=0, rop=0),
         'bite': dict(f=(4.0, 2.6), r=(-0.6, -1.2), hump=-1.0, op=1, rop=1),
         'charge': dict(f=(5.4, 1.2), r=(0.6, 0.0), hump=-2.4, op=0, rop=0)}
GYN = 34.0


def catmull(pts, n=10):
    out = []
    P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(pts[-1])
    return out


def snakehead(c, hx, hy, d, op, big, opt, front):
    """뱀 머리: d = 1 오른쪽 · -1 왼쪽. 쐐기꼴 머리 · 눈두덩 뿔 · 눈 · 입"""
    L, Hh = 7.4 * big, 2.8 * big
    pts = [(hx - d * 1.0, hy - Hh), (hx + d * L * 0.7, hy - Hh * 0.8), (hx + d * L, hy - 0.2), (hx + d * L * 0.85, hy + Hh * 0.55), (hx - d * 0.6, hy + Hh * 0.9)]
    ch = 'C' if (opt == 'A' or front) else 'D'
    head = poly(pts); c.fill(head, ch)
    if op:
        jaw = poly([(hx - d * 0.4, hy + 0.6), (hx + d * L * 0.9, hy + 2.6 + op), (hx + d * L * 0.8, hy + 4.0 + op), (hx - d * 0.8, hy + Hh * 1.1)])
        c.fill(jaw, ch); c.fill(poly([(hx + d * 0.8, hy + 0.8), (hx + d * L * 0.95, hy + 0.4), (hx + d * L * 0.85, hy + 2.6 + op), (hx + d * 0.8, hy + 1.8)]), 'm')
        for k in (0.55, 0.85): c.fill(box(hx + d * L * k, hy + 0.4, hx + d * L * k, hy + 1.4), 'w')
    else:
        c.fill(thins([(hx + d * 0.4, hy + 0.9), (hx + d * L * 0.95, hy + 0.6)]), 'k')
    horn = poly([(hx + d * 1.4, hy - Hh + 0.4), (hx - d * 2.4, hy - Hh - 2.0 * big), (hx + d * 3.2, hy - Hh + 0.2)])   # 눈두덩 뿔 (뒤로 누운 하나)
    c.fill(horn, 'N' if opt == 'A' else ('Y' if front else 'x'))
    ex = hx + d * L * 0.45; c.fill(box(min(ex, ex + d * 1.2), hy - Hh * 0.45, max(ex, ex + d * 1.2), hy - Hh * 0.45), 'E' if (opt == 'A' or front) else 'e')


def forkserpent(mode, opt):
    c = Cv(74, 40); P = NPOSE[mode]; fx_, fy_ = P['f']; rx_, ry_ = P['r']; hm = P['hump']
    ctrl = [(11.0 + rx_, 12.0 + ry_), (12.0 + rx_ * 0.5, 19.6), (15.0, 27.6), (21.0, GYN - 3.2), (27.0, GYN - 3.4), (32.0, 25.0 - hm), (37.0, GYN - 3.4),
            (45.0 + fx_ * 0.2, GYN - 3.2), (51.0 + fx_ * 0.5, 25.0 + fy_ * 0.4), (53.0 + fx_ * 0.8, 17.0 + fy_ * 0.7), (53.6 + fx_, 10.6 + fy_)]
    sp = catmull(ctrl, 8)
    n = len(sp); rad = [2.4 + 2.0 * math.sin(math.pi * min(1.0, max(0.0, i / (n - 1)))) for i in range(n)]   # 가운데가 굵고 양 끝(목)이 가늘다
    tube = {}
    for i, (p, r) in enumerate(zip(sp, rad)):
        for q in ell(p[0], p[1], r, r):
            d = (q[0] + 0.5 - p[0]) ** 2 + (q[1] + 0.5 - p[1]) ** 2
            if q not in tube or d < tube[q][1]: tube[q] = (i, d)
    for (x, y), (i, d) in tube.items():
        p = sp[i]; band = (i // 5) % 2 == 1                                                                          # 마디 띠 (몸을 가로지르는 띠 — 비늘 격자 없음)
        if opt == 'A': ch = 'c' if band else 'C'
        else:
            t = i / (n - 1); front = t > 0.5
            ch = ('r' if band else 'R') if front else ('b' if band else 'D')
            if 0.485 < t < 0.515: ch = 'V'                                                                         # 두 빛깔이 만나는 곳 (가는 띠)
        if y + 0.5 > p[1] + rad[i] * 0.45: ch = 'S' if opt == 'A' else ('s' if i / (n - 1) > 0.5 else 'z')       # 밝은 배 비늘 (아래쪽)
        c.set(x, y, ch)
    if opt == 'A':
        for (x, y), (i, d) in tube.items():
            if (i // 5) % 2 == 0 and (x + y) % 7 == 0 and y < sp[i][1]: c.set(x, y, 'v')                            # 띠 사이 이끼 점
    snakehead(c, sp[-1][0] + 0.4, sp[-1][1] - 0.6, 1, 1.6 if P['op'] else 0, 1.35, opt, True)
    snakehead(c, sp[0][0] - 0.4, sp[0][1] - 0.6, -1, 1.2 if P['rop'] else 0, 1.1, opt, False)
    return c


PAL7 = {'A': {'C': '#6e7a58', 'c': '#3e4a32', 'S': '#b8b48a', 'v': '#8ab04e', 'N': '#a89c80', 'E': '#ffc040', 'k': '#141a10', 'w': '#f0ecd8', 'm': '#5a1a20'},
        'B': {'C': '#c8462e', 'R': '#c8462e', 'r': '#7a2418', 's': '#f0a860', 'Y': '#ffd060', 'E': '#ffe080',
              'D': '#3e7ab8', 'b': '#24487a', 'z': '#b8e0f0', 'x': '#e8f8ff', 'e': '#c8f4ff', 'V': '#7a4a8a', 'k': '#140c10', 'w': '#f6f0e0', 'm': '#4a1020'}}
LAB7 = {'A': ('A 이끼 비늘 양끝뱀', 'B7 층 보스 · 갈림길에 사는 양 끝에 머리가 달린 큰 뱀 — 어느 길로 가도 한쪽 머리와 마주친다 · 이끼 앉은 올리브빛 비늘과 짙은 띠 · 밝은 배 비늘 · 머리마다 뒤로 누운 눈두덩 뿔 · 누런 눈 · 몸 가운데가 솟은 고리'),
        'B': ('B 두 빛깔 양끝뱀', 'B7 층 보스 · 앞 머리 쪽 반은 붉은 불빛, 뒤 머리 쪽 반은 푸른 얼음빛인 양끝뱀 — 가운데에서 두 빛깔이 보랏빛으로 만난다 · 앞 머리는 금빛 뿔 · 불을 머금은 입, 뒤 머리는 흰 뿔 · 서리 낀 흰 눈 · 앞 머리가 물고 뒤 머리가 얼린다')}
for opt in 'AB':
    fr = {m: forkserpent(m, opt) for m in NPOSE}
    B7.add('forkserpent' + ('' if opt == 'A' else '_b'), LAB7[opt][0], LAB7[opt][1], [fr['idle0'], fr['idle1']], PAL7[opt], (63, 10), 34,
           gm={m: fr[m] for m in ('bite', 'charge')}, act=ACT7 if opt == 'A' else ACT7B)
B7.dump()


# ═══════════ B8 뼈 무덤지기 (사람꼴) ═══════════
ACT8A = {'atk': ['down', 'side'], 'skl': ['smash'], 'tk': 1.3,
         'fx': {'atk': {'pal': 'dark', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'evil', 'hit': 'quake', 'big': 2, 'after': 'smoke', 'aoe': 'slam', 'shake': 2}}}
ACT8B = {'atk': ['down', 'side', 'up'], 'skl': ['smash'], 'tk': 1.35,
         'fx': {'atk': {'pal': 'dark', 'hit': 'star', 'big': 1}, 'skl': {'pal': 'evil', 'hit': 'shatter', 'big': 2, 'after': 'shards', 'aoe': 'slam', 'shake': 3}}}
B8 = Batch('lab1b_bone', 'manhunter', ACT8A, 'passage', show=[['down', 4], ['smash', 5]], ms=1.5)
B8.extra = head_js('graveshovel', """
.NNN.
NNNNN
NNNNN
NNNNN
.NNN.
..n..
""", '무덤 삽 (뼈 무덤지기 A): 끝이 둥근 쇠 삽날', L=7.0, shaft='o', below=2.5, fxw='club') + head_js('boneclub', """
PP.PP
PPPPP
.PPP.
..P..
""", '넓적다리뼈 몽둥이 (뼈 무덤지기 B): 끝이 두 혹으로 갈린 큰 뼈', L=6.0, shaft='P', below=2.0, fxw='club')


def bonekeeper(opt):
    c = Cv(52, 62); GY = 58.0
    if opt == 'A':
        sack = ell(10.4, 25.0, 8.0, 9.2) | rbox(4.6, 17.0, 16.0, 23.0, 2.0)                                     # 등에 멘 뼈 자루
        bones = ((5.8, 18.0, 2.6, 8.0), (9.0, 18.0, 6.6, 10.6))                                                    # 자루 위로 삐져나온 뼈 둘 (같은 쪽으로 나란히 기움 — 엇갈리지 않게)
        for (x0, y0, x1, y1) in bones:
            c.fill(path([(x0, y0), (x1, y1)], 0.9), 'P')
            ux, uy = (x1 - x0), (y1 - y0); L = math.hypot(ux, uy); ux, uy = ux / L, uy / L
            for sgn in (-1, 1): c.fill(ell(x1 + uy * sgn * 1.0, y1 - ux * sgn * 1.0, 1.0, 1.0), 'P')              # 뼈 끝 두 혹
            c.only({(x, y) for (x, y) in path([(x0, y0), (x1, y1)], 0.9) if (x + 1, y) not in path([(x0, y0), (x1, y1)], 0.9)}, 'q', 'P')
        sk = (13.0, 14.2); c.fill(ell(sk[0], sk[1], 3.2, 2.8), 'P'); c.fill(box(sk[0] - 1.6, sk[1] + 1.8, sk[0] + 1.8, sk[1] + 3.0), 'P')   # 아가리의 해골 (뼈 옆)
        c.only({(x, y) for (x, y) in ell(sk[0], sk[1], 3.2, 2.8) if (x, y + 1) not in ell(sk[0], sk[1], 3.2, 2.8)}, 'q', 'P')
        c.fill(box(sk[0] - 1.6, sk[1] - 0.2, sk[0] - 0.6, sk[1] + 0.8), 'K'); c.fill(box(sk[0] + 1.0, sk[1] - 0.2, sk[0] + 2.0, sk[1] + 0.8), 'K')
        c.fill(sack, 'B'); blunt(c.g, 'B', 'A', 'b', bottom=1, side=0)
        c.fill(box(5.0, 18.4, 16.0, 19.4), 'b')                                                                   # 자루 아가리 끈
        for (x, y) in ((7.0, 27.0), (13.0, 30.0), (9.0, 33.0)): c.fill(box(x, y, x + 1, y), 'b')                # 기운 자국
        c.fill(thins([(14.0, 18.6), (21.0, 25.0)]), 'b')                                                           # 어깨에 건 끈
    # 다리 (먼 → 가까운) · 발
    c.fill(path([(20.6, 38.0), (20.0, 47.0), (19.6, GY - 2.0)], 2.2, 1.6), 'u'); c.fill(rbox(16.6, GY - 2.8, 23.0, GY - 0.6, 0.8), 'b')
    c.fill(path([(24.6, 38.0), (25.4, 47.0), (25.6, GY - 2.0)], 2.4, 1.8), 'U'); c.fill(rbox(23.0, GY - 2.8, 30.0, GY - 0.6, 0.8), 'b')
    # 먼 팔 (가는 팔 · 늘어뜨림)
    c.fill(path([(18.6, 24.0), (17.6, 30.6), (18.0, 36.0)], 1.8, 1.5), 'c'); c.fill(ell(18.2, 37.0, 1.8, 1.6), 's')
    if opt == 'A':
        # 누더기 외투 (길게 · 아랫단이 찢김) · 넓은 챙 모자 (챙 끝이 찢김) · 챙 밑에 보이는 마른 얼굴
        cloak = poly([(16.4, 22.0), (21.0, 19.0), (28.0, 19.4), (32.4, 23.6), (33.0, 34.0), (34.6, 47.0), (16.6, 47.6), (14.6, 36.0)])
        cloak = hem(cloak, 47, [19.0, 24.6, 30.4], 1.6)
        c.fill(cloak, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        c.fill(box(16.0, 34.4, 33.4, 35.4), 'b')                                                                   # 허리 끈
        c.fill(poly([(21.6, 19.6), (23.0, 14.0), (27.0, 11.0), (31.6, 12.0), (33.0, 16.0), (31.4, 20.6), (25.0, 21.0)]), 'S')   # 마른 머리 (잿빛 살)
        blunt(c.g, 'S', 'S', 't', bottom=1, side=0)
        c.fill(box(28.4, 14.6, 30.0, 15.6), 'K'); c.set(29.2, 15.0, 'E'); c.fill(box(31.0, 14.6, 31.8, 15.6), 'K'); c.set(31.4, 15.0, 'E')   # 꺼진 눈 · 초록 빛
        c.fill(box(29.6, 18.4, 32.4, 18.4), 'k'); c.set(31.6, 17.6, 't')                                              # 입 · 코
        c.fill(poly([(21.6, 19.0), (19.6, 24.0), (24.6, 22.6)]), 'C')                                                # 깃 (외투)
        brim = poly([(16.0, 12.4), (36.6, 11.2), (37.4, 12.6), (16.4, 14.0)])                                        # 넓은 챙
        crown = poly([(20.4, 12.6), (21.4, 6.8), (24.6, 5.0), (30.4, 5.2), (32.0, 7.4), (32.4, 12.0)])               # 모자 꼭대기 (눌린)
        c.fill(crown, 'H'); c.fill(brim, 'H'); blunt(c.g, 'H', 'L', 'h', bottom=1, side=0, top=1)
        c.fill(box(20.8, 10.6, 32.2, 11.4), 'b')                                                                    # 모자 띠
        for x in (17.0, 34.0): c.fill(box(x, 13.4, x + 1, 14.0), '_')                                              # 찢긴 챙 끝
    else:
        # 뼈 갑주: 짙은 가죽 몸 + 옆에서 본 갈비 셋 (앞이 아래로 휜 뼈 — 가운데 세로 뼈 없음) · 등뼈 마디 · 해골 어깨받이 · 짐승 해골 투구
        torso = poly([(14.4, 23.0), (20.6, 18.6), (29.0, 18.4), (34.6, 22.6), (35.0, 38.4), (16.4, 40.0), (13.0, 31.0)])
        c.fill(torso, 'C'); blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0)
        for k in range(3):                                                                                        # 갈비 셋
            y0 = 27.4 + k * 3.6
            rib = path([(24.6, y0 - 1.0), (29.0, y0 - 0.8), (32.6, y0 + 0.2), (34.0, y0 + 2.0)], 0.75)
            c.fill(rib, 'P'); c.only({(x, y) for (x, y) in rib if (x, y + 1) not in rib}, 'q', 'P')
        for k in range(6): c.fill(rbox(13.4 + k * 0.2, 21.0 + k * 3.0, 15.6 + k * 0.2, 22.8 + k * 3.0, 0.6), 'P')   # 등뼈 마디 (등을 따라 한 줄)
        c.fill(box(15.0, 37.0, 34.6, 38.4), 'b')                                                                   # 허리띠
        skirt = hem(poly([(16.0, 38.4), (34.6, 38.0), (36.0, 47.0), (16.4, 47.4)]), 47, [20.0, 26.0, 32.0], 1.4)   # 허리 가리개
        c.fill(skirt, 'u')
        c.fill(poly([(22.4, 21.0), (22.6, 13.4), (27.0, 12.0), (32.6, 13.4), (33.0, 21.0)]), 'K')                    # 투구 밑 얼굴 어둠
        eyes(c, [(29.4, 16.2)], 'E')
        hm = ell(27.6, 10.4, 7.6, 6.0) | poly([(20.4, 12.0), (35.2, 12.0), (35.0, 14.0), (20.6, 15.6)])           # 거인 해골 투구 (둥근 머리뼈 — 위턱 밑으로 얼굴이 보인다)
        hm = {(x, y) for (x, y) in hm if y <= 14}
        c.fill(hm, 'P'); c.only({(x, y) for (x, y) in hm if (x, y + 1) not in hm or (x + 1, y) not in hm}, 'q', 'P')
        c.fill(rbox(29.6, 8.0, 32.6, 10.8, 0.8), 'K'); c.set(31.0, 9.4, 'e')                                         # 큰 눈구멍 · 속 빛
        c.fill(box(33.6, 10.4, 34.4, 11.4), 'K')                                                                    # 코 구멍 (하나)
        for x in (24.6, 26.6, 28.6, 30.6, 32.6): c.fill(box(x, 14.0, x + 0.8, 15.0), 'P')                          # 위턱 이빨 줄
        sk = (31.6, 24.6); skc = ell(sk[0], sk[1], 4.0, 3.2); c.fill(skc, 'P'); c.only({(x, y) for (x, y) in skc if (x, y + 1) not in skc}, 'q', 'P')   # 앞 어깨 해골 받이
        c.fill(box(sk[0] - 1.4, sk[1] - 0.4, sk[0] - 0.4, sk[1] + 0.8), 'K'); c.fill(box(sk[0] + 1.2, sk[1] - 0.4, sk[0] + 2.2, sk[1] + 0.8), 'K')
    return c


PAL8 = {'A': {'C': '#3e4a44', 'Q': '#5a6a62', 'c': '#26302c', 'H': '#4a3a2c', 'L': '#6a5642', 'h': '#2e241a', 'K': '#0e0c0e', 'E': '#9aff7a', 'S': '#9aa48e', 't': '#6a7462', 'k': '#1a1e18',
              'U': '#3e3a36', 'u': '#2a2724', 'b': '#2a201a', 's': '#8a9a80', 'B': '#8a7a5a', 'A': '#a8986e', 'P': '#d8d0b4', 'q': '#9c9478',
              'N': '#8a8e94', 'n': '#4e5258', 'o': '#6e4a26'},
        'B': {'C': '#3a3436', 'Q': '#56504e', 'c': '#242022', 'K': '#0e0c0e', 'E': '#ff6a3a', 'e': '#ff9a6a', 'U': '#3e3a36', 'u': '#2e2a28', 'b': '#2a201a', 's': '#8a9a80',
              'P': '#dcd4b8', 'q': '#9c9478'}}
LAB8 = {'A': ('A 뼈 자루 무덤지기', 'B8 층 보스 · 미로에서 쓰러진 이들의 뼈를 주워 담는 무덤지기 · 누더기 두건 속 초록 눈과 잿빛 마른 턱 · 찢긴 아랫단 외투 · 등에 멘 뼈 자루(자루 위로 같은 쪽으로 기운 뼈 셋 · 아가리의 해골) · 끝이 둥근 무덤 삽을 내리친다'),
        'B': ('B 뼈 갑주 무덤지기', 'B8 층 보스 · 주운 뼈로 갑주를 지어 입은 무덤지기 · 거인의 머리뼈를 통째로 쓴 투구(큰 눈구멍 속 빛 · 위턱 이빨 줄) · 투구 밑 어둠 속 붉은 눈 · 옆에서 본 갈비 셋(앞이 아래로 휜 뼈) · 등을 따라 이어진 등뼈 마디 · 앞 어깨의 해골 받이 · 끝이 두 혹인 넓적다리뼈 몽둥이')}
for opt, act, wpn, show, idle in (('A', ACT8A, 'graveshovel', [['down', 4], ['smash', 5]], {'h': [3, 3], 'a': -65}),
                                   ('B', ACT8B, 'boneclub', [['down', 4], ['smash', 5]], {'h': [3, 3], 'a': -55})):
    B8.add('bonekeeper' + ('' if opt == 'A' else '_b'), LAB8[opt][0], LAB8[opt][1], bonekeeper(opt), PAL8[opt], (29, 23), 24, 37,
           wpn=wpn, arm=['C', 'c'], hand='s', idle=idle, act=act, show=show)
B8.dump()
