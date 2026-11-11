"""창고 칸 레어도 테 시안 (빌드 63, 11-11 사용자: 「레어도 표현 2D 도트 강화」)
지금 칸은 CSS 둥근 빛(radial-gradient) · 흐린 그림자 · 가로지르는 빛줄기라 도트가 아니다 → 24×24 도트 판(2배로 48px)에 테 · 바탕 · 보석 · 반짝이를 칸으로 그린다.
움직임은 장(프레임)을 끊어 바꾼다(흐림 · 부드러운 이동 없음). 게임에는 아직 넣지 않는다."""
N = 24
K = (12, 14, 20)
GR = [  # 바탕, 밝음, 어두움, 배경
    ((70, 78, 96), (100, 108, 128), (44, 50, 64), (26, 30, 42)),
    ((74, 138, 62), (123, 211, 106), (38, 78, 32), (22, 38, 24)),
    ((60, 118, 184), (106, 176, 255), (28, 60, 104), (20, 32, 54)),
    ((147, 86, 204), (196, 132, 244), (78, 42, 118), (38, 22, 56)),
    ((224, 160, 50), (255, 222, 132), (126, 82, 18), (50, 36, 12)),
    ((240, 92, 76), (255, 182, 160), (130, 36, 30), (58, 18, 16)),
    ((246, 232, 160), (255, 255, 236), (164, 144, 72), (64, 56, 28)),
]
NAMES = ['일반', '고급', '희귀', '영웅', '전설', '신화', '신성']
GEM = [None, None, None, (224, 176, 255), (255, 230, 140), (255, 176, 160), (255, 252, 230)]


def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def bg_steps(px, g, lo=3, hi=N - 4):
    """둥근 빛 대신 계단 세 겹 + 이음매 바둑무늬 (도트 그러데이션)"""
    base, L, D, B = GR[g]
    c0, c1, c2 = B, mix(B, base, .16), mix(B, base, .3)
    m = (N - 1) / 2
    for y in range(lo, hi + 1):
        for x in range(lo, hi + 1):
            r = max(abs(x - m), abs(y - m + 1)) + 0.5 * min(abs(x - m), abs(y - m + 1)) / 2
            if r < 4.2: c = c2
            elif r < 5.2: c = c2 if (x + y) % 2 else c1
            elif r < 7.2: c = c1
            elif r < 8.2: c = c1 if (x + y) % 2 else c0
            else: c = c0
            px[(x, y)] = c


def sparkle(px, x, y, c, big=False):
    px[(x, y)] = (255, 255, 255)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if big else ((1, 1), (-1, -1), (1, -1), (-1, 1)):
        if 0 <= x + dx < N and 0 <= y + dy < N: px[(x + dx, y + dy)] = c


def gem(px, x, y, c):
    """2×2 보석 + 테 (빛 칸 하나)"""
    for dx in range(-1, 3):
        for dy in range(-1, 3):
            if (dx in (-1, 2)) != (dy in (-1, 2)) or (dx in (-1, 2) and dy in (-1, 2)): px[(x + dx, y + dy)] = K
    px[(x, y)] = mix(c, (255, 255, 255), .6); px[(x + 1, y)] = c; px[(x, y + 1)] = c; px[(x + 1, y + 1)] = mix(c, (0, 0, 0), .35)
    for dx, dy in ((-1, -1), (2, -1), (-1, 2), (2, 2)): px.pop((x + dx, y + dy), None)


# ───────── A안: 도트 테 + 모서리 보석 ─────────
def frame_a(g, t=0):
    base, L, D, B = GR[g]; px = {}
    bg_steps(px, g)
    for i in range(N):
        for (x, y) in ((i, 0), (i, N - 1), (0, i), (N - 1, i)): px[(x, y)] = K
    th = 2 if g < 4 else 3
    for k in range(1, th + 1):
        for i in range(k, N - k):
            px[(i, k)] = L if k < th or g < 4 else base; px[(k, i)] = L if k < th or g < 4 else base
            px[(i, N - 1 - k)] = D; px[(N - 1 - k, i)] = D
        px[(N - 1 - k, k)] = base; px[(k, N - 1 - k)] = base
    for i in range(th + 1, N - th - 1):     # 안쪽 그늘 한 줄
        px[(i, th + 1)] = mix(px.get((i, th + 1), B), (0, 0, 0), .35); px[(th + 1, i)] = mix(px.get((th + 1, i), B), (0, 0, 0), .35)
    if g >= 2:   # 모서리 따기
        for (x, y) in ((1, 1), (N - 2, 1), (1, N - 2), (N - 2, N - 2)): px[(x, y)] = K
    if g >= 4:   # 금 테 안쪽 가는 줄
        for i in range(th + 2, N - th - 2):
            for (x, y) in ((i, th + 1), (th + 1, i)): px[(x, y)] = mix(L, base, .5) if i % 2 == 0 else px[(x, y)]
    if g >= 3:
        for (x, y) in ((1, 1), (N - 3, 1), (1, N - 3), (N - 3, N - 3)): gem(px, x, y, GEM[g])
    if g >= 4:   # 위 가운데 장식 (작은 날개 판)
        cx = N // 2 - 1
        for (dx, dy, c) in ((-3, 0, D), (-2, -1, L), (-1, -1, L), (0, -1, L), (1, -1, L), (2, -1, L), (3, -1, L), (4, 0, D),
                            (-2, 0, base), (-1, 0, GEM[g]), (0, 0, (255, 255, 255)), (1, 0, GEM[g]), (2, 0, GEM[g]), (3, 0, base)):
            px[(cx + dx, 1 + dy + 1)] = c
    if g >= 4:   # 반짝이 (장마다 자리가 바뀜)
        spots = [(6, 6), (17, 8), (8, 17), (16, 16), (12, 5), (5, 12)]
        n = 1 if g == 4 else (2 if g == 5 else 3)
        for j in range(n):
            s = spots[(t + j * 2) % len(spots)]
            if (t + j) % 3 != 2: sparkle(px, s[0], s[1], L, big=(g == 6 and (t + j) % 2 == 0))
    if g == 6:   # 신성: 모서리에서 퍼지는 빛살 (계단 줄, 장마다 한 칸씩 옮김)
        for k in range(4, 12, 3):
            for (x, y) in ((k + t % 3, 4), (4, k + t % 3), (N - 1 - k - t % 3, N - 5), (N - 5, N - 1 - k - t % 3)):
                if 3 < x < N - 4 and 3 < y < N - 4: px[(x, y)] = mix(px.get((x, y), B), L, .45)
    if g == 5:   # 신화: 테가 장마다 밝은 칸이 한 바퀴 돈다
        ring = [(i, 1) for i in range(2, N - 2)] + [(N - 2, i) for i in range(2, N - 2)] + [(i, N - 2) for i in range(N - 3, 1, -1)] + [(1, i) for i in range(N - 3, 1, -1)]
        for j in range(3):
            q = ring[(t * 5 + j) % len(ring)]
            px[q] = (255, 236, 220)
    return px


# ───────── B안: 금속 틀 + 리벳 + 위 보석 ─────────
METAL = [((92, 92, 100), (130, 130, 140), (56, 56, 64)),        # 쇠
         ((88, 128, 84), (136, 182, 120), (48, 76, 46)),       # 푸른 녹 청동
         ((96, 138, 186), (156, 196, 236), (52, 80, 120)),      # 푸른 강철
         ((150, 120, 190), (204, 180, 240), (86, 64, 118)),     # 자수정 은
         ((220, 168, 60), (255, 228, 140), (130, 90, 24)),      # 금
         ((210, 80, 70), (255, 170, 150), (118, 34, 30)),       # 붉은 금
         ((236, 232, 214), (255, 255, 250), (150, 146, 128))]   # 백금


def frame_b(g, t=0):
    base, L, D, B = GR[g]; mb, ml, md = METAL[g]; px = {}
    bg = mix(B, (0, 0, 0), .2)
    for y in range(N):
        for x in range(N):
            px[(x, y)] = bg if (x - y) % 4 else mix(bg, base, .22)     # 비스듬한 가는 줄 (도트)
    for i in range(N):
        for (x, y) in ((i, 0), (i, N - 1), (0, i), (N - 1, i)): px[(x, y)] = K
    for k in (1, 2, 3):
        for i in range(k, N - k):
            c_top = ml if k == 1 else (mb if k == 2 else md)
            c_bot = md if k == 1 else (mb if k == 2 else ml)
            px[(i, k)] = c_top; px[(k, i)] = c_top; px[(i, N - 1 - k)] = c_bot; px[(N - 1 - k, i)] = c_bot
    for i in range(4, N - 4):
        px[(i, 4)] = K; px[(4, i)] = K; px[(i, N - 5)] = mix(bg, (0, 0, 0), .3); px[(N - 5, i)] = mix(bg, (0, 0, 0), .3)
    for (x, y) in ((2, 2), (N - 3, 2), (2, N - 3), (N - 3, N - 3)):     # 리벳
        px[(x, y)] = ml; px[(x + 1, y + 1)] = md if (x + 1, y + 1) in px else None
        px[(x + 1, y)] = mb; px[(x, y + 1)] = mb
    px = {k: v for k, v in px.items() if v is not None}
    if g >= 1:   # 위 가운데 보석 (레어도가 오를수록 크다)
        w = [0, 2, 2, 4, 4, 6, 6][g]
        cx = N // 2 - w // 2
        for dx in range(w):
            px[(cx + dx, 1)] = K; px[(cx + dx, 4)] = K
            px[(cx + dx, 2)] = mix(L, (255, 255, 255), .4) if dx < w // 2 else base
            px[(cx + dx, 3)] = base if dx < w // 2 else D
        px[(cx - 1, 2)] = K; px[(cx - 1, 3)] = K; px[(cx + w, 2)] = K; px[(cx + w, 3)] = K
        if g >= 4 and t % 4 == 0: px[(cx, 2)] = (255, 255, 255); px[(cx - 1, 1)] = L; px[(cx + 1, 0)] = L
    if g >= 5:   # 아래 가운데도 보석
        cx = N // 2 - 1
        for dx in range(2):
            px[(cx + dx, N - 4)] = base; px[(cx + dx, N - 3)] = D
    if g >= 4:
        spots = [(7, 8), (16, 15), (15, 7), (8, 16)]
        for j in range(1 if g == 4 else 2):
            if (t + j) % 2 == 0:
                s = spots[(t // 2 + j * 2) % 4]; sparkle(px, s[0], s[1], L)
    if g == 6:
        for (x, y) in ((1, 1), (N - 2, 1), (1, N - 2), (N - 2, N - 2)): px[(x, y)] = (255, 255, 255) if t % 2 == 0 else ml
    return px


# ───────── C안: 카드 틀 (모서리 꺾쇠) ─────────
def frame_c(g, t=0):
    base, L, D, B = GR[g]; px = {}
    for y in range(N):
        for x in range(N):
            band = 0 if y < 8 else (1 if y < 15 else 2)
            c = [mix(B, base, .14), B, mix(B, (0, 0, 0), .25)][band]
            if band == 1 and (x + y) % 2 == 0 and y in (8, 14): c = [mix(B, base, .14), mix(B, (0, 0, 0), .25)][y == 14]
            px[(x, y)] = c
    for i in range(N):
        for (x, y) in ((i, 0), (i, N - 1), (0, i), (N - 1, i)): px[(x, y)] = K
    for i in range(1, N - 1):
        for (x, y) in ((i, 1), (1, i), (i, N - 2), (N - 2, i)): px[(x, y)] = mix(B, base, .4)
    arm = 6 + (g >= 3) + (g >= 5)
    cl = L if (g < 4 or t % 2 == 0) else base
    for (sx, sy, dx, dy) in ((1, 1, 1, 1), (N - 2, 1, -1, 1), (1, N - 2, 1, -1), (N - 2, N - 2, -1, -1)):
        for i in range(arm):
            for th in range(2):
                px[(sx + dx * i, sy + dy * th)] = cl if th == 0 else base
                px[(sx + dx * th, sy + dy * i)] = cl if th == 0 else base
        px[(sx + dx * arm, sy)] = D; px[(sx, sy + dy * arm)] = D
    if g >= 2:   # 테 가운데 징
        for (x, y) in ((N // 2 - 1, 1), (N // 2, 1), (N // 2 - 1, N - 2), (N // 2, N - 2), (1, N // 2 - 1), (1, N // 2), (N - 2, N // 2 - 1), (N - 2, N // 2)):
            px[(x, y)] = base
    if g >= 3:
        for (x, y) in ((N // 2 - 1, 2), (N // 2, 2)): px[(x, y)] = GEM[g]
    if g >= 4:   # 바탕 점 무늬 (작은 별 셋) · 반짝이
        spots = [(6, 18), (17, 6), (18, 18), (5, 6)]
        for j in range(g - 3):
            s = spots[(t + j) % 4]
            if t % 3 != 2: sparkle(px, s[0], s[1], L)
    if g == 6:
        for i in range(3, N - 3, 2):
            if (i // 2 + t) % 3 == 0: px[(i, 3)] = L; px[(i, N - 4)] = L
    return px


OPTS = [('A', '도트 테 + 모서리 보석', frame_a, '테를 2~3칸 도트 경사(위 · 왼쪽 밝음, 아래 · 오른쪽 어두움)로. 바탕은 둥근 빛 대신 계단 세 겹 + 바둑 무늬 이음. 희귀부터 모서리를 따고, 영웅부터 네 모서리 보석, 전설부터 위 장식 + 반짝이, 신화는 테를 도는 빛 칸, 신성은 빛살 줄.'),
        ('B', '금속 틀 + 리벳 + 위 보석', frame_b, '레어도마다 틀 쇠붙이가 바뀐다(쇠 · 청동 · 강철 · 자수정 은 · 금 · 붉은 금 · 백금). 네 모서리 리벳, 위 가운데 보석이 레어도만큼 커진다. 바탕은 비스듬한 가는 줄.'),
        ('C', '카드 틀 (모서리 꺾쇠)', frame_c, '얇은 테에 모서리 꺾쇠만 레어도 색. 바탕은 위가 밝은 띠 셋. 희귀부터 테 가운데 징, 영웅부터 보석, 전설부터 꺾쇠가 깜빡이고 반짝이.')]
