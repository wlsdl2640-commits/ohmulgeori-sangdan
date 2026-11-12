"""하늘 지도 — 대륙 지도 A(양피지 고지도)와 같은 결: python3 sky_a.py <출력.png> [배율]
게임 하늘 지도는 240×150 논리 픽셀. 노드 자리(map.js MAP_NODES_SKY · dun)는 그대로.
240×240 판(geo66 · map_b 도구)에 그리고 위 150줄만 잘라 쓴다."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from geo66 import hx, vnoise, fbm, blob, disk, catmull, bend, XX, YY, W, H
from map_b import Cv, tones, poisson, BY
from map_a import INK, INK2, INK3, wash, outline, tri, TREE_A

HS = 150
NODES = dict(sky=(118, 84), thunder=(196, 44), ruins=(198, 118), stargarden=(50, 40))
DUN = dict(sky=(144, 70), thunder=(214, 28), ruins=(176, 112), stargarden=(70, 26))
IN = YY < HS


def keep_clear():
    m = np.zeros((H, W), bool)
    for (x, y) in NODES.values():
        m |= (np.abs(XX - x) <= 8) & (YY >= y - 7) & (YY <= y + 13)
    return m


def puffs(cx, cy, w, h, seed, n=None):
    """뭉게구름 꼴: 위가 둥근 덩이 여럿 + 평평한 아래"""
    r = np.random.default_rng(seed)
    n = n or max(3, int(w / 6))
    m = np.zeros((H, W), bool)
    for i in range(n):
        t = (i + 0.5) / n
        x = cx - w / 2 + t * w + (r.random() - 0.5) * 3
        rr = h * (0.55 + 0.45 * np.sin(np.pi * t)) * (0.85 + r.random() * 0.3)
        m |= disk(x, cy - rr * 0.35, rr)
    m &= YY <= cy + h * 0.25
    m |= (np.abs(XX - cx) <= w / 2) & (YY >= cy - h * 0.2) & (YY <= cy + h * 0.25)
    return m


def cloud(cv, m, fill='#fbf7ee', a=0.85, line=INK3, folds=0, seed=0):
    wash(cv, m, fill, a)
    bot = m & ~np.roll(m, -1, 0)   # 아래 끝 줄
    wash(cv, m & np.roll(bot, -1, 0), '#e6dccb', 0.5)
    e = m & ~ndi.binary_erosion(m)
    cv.fill(e, line)
    r = np.random.default_rng(seed)
    ys, xs = np.nonzero(m & ndi.binary_erosion(m, iterations=3))
    for _ in range(folds):   # 안쪽 주름 (짧은 활꼴)
        if not len(xs): break
        k = r.integers(len(xs)); x, y = xs[k], ys[k]
        for t in range(-2, 3):
            cv.px(x + t, y - (1 if abs(t) < 2 else 0), line)


def island(cv, cx, cy, rx, ry, depth, seed, top='#9ab86a', rock='#dcccac', hatch=INK2, tip=0.8):
    """떠 있는 섬: 풀 덮인 윗면 + 거꾸로 선 바위 밑동(빗금 · 줄무늬 · 늘어진 뿌리)"""
    topm = blob(cx, cy, rx, ry, seed, 0.22, 4) & IN
    r = np.random.default_rng(seed)
    cols = np.nonzero(topm.any(axis=0))[0]
    jag = vnoise(3, seed + 5)[0]
    under = np.zeros((H, W), bool)
    bottom = {}
    for x in cols:
        ys = np.nonzero(topm[:, x])[0]
        y0 = ys.max()
        u = (x - cx) / rx
        d = depth * max(0.0, 1 - abs(u) ** 1.6) ** tip * (0.78 + 0.44 * jag[x])
        y1 = int(round(y0 + max(1.0, d)))
        under[y0 - 1:y1 + 1, x] = True
        bottom[x] = y1
    under &= ~topm
    # 바위: 왼쪽 밝게 · 오른쪽 빗금 · 가로 줄무늬
    cv.fill(under, rock)
    sh = under & (XX > cx + rx * 0.05) & ((XX + YY).astype(int) % 2 == 0)
    cv.fill(sh, hatch)
    for k, y in enumerate(range(int(cy + ry * 0.4), int(cy + ry + depth), 4)):
        st = under & (YY == y) & ((XX.astype(int) + k * 3) % 7 < 4)
        cv.fill(st, INK3)
    outline(cv, under, INK, out=False)
    # 늘어진 뿌리
    for x in r.choice(cols, size=max(2, len(cols) // 9), replace=False):
        L = int(r.integers(2, 5))
        for t in range(1, L + 1):
            if (x + t) % 3: cv.px(x + (1 if t > 2 and x % 2 else 0), bottom[x] + t, INK2)
    # 윗면: 풀 물감 · 위 가장자리 밝은 띠 · 테
    wash(cv, topm, top, 0.6)
    hi = topm & ~np.roll(topm, 2, 0)
    wash(cv, hi, '#f4f0d8', 0.35)
    outline(cv, topm, INK, out=False)
    cv.occ |= topm | under
    return topm, under, bottom


def stamp_star(cv, x, y, big=False, c='#fff4c0'):
    """별: 작은 점 / 큰 별은 속이 빈 마름모 (더하기 꼴 피함)"""
    if not big:
        cv.px(x, y, c); return
    for (dx, dy) in [(0, -2), (-1, -1), (1, -1), (-2, 0), (2, 0), (-1, 1), (1, 1), (0, 2)]:
        cv.px(x + dx, y + dy, c)


def draw():
    cv = Cv(); clear = keep_clear()
    # ── 양피지 바탕 (대륙 지도 A와 같은 결) ──
    tones(cv, np.ones((H, W), bool), ['#d6bc88', '#e0c898', '#ead6aa', '#f2e2bc'], fbm(301, ((40, 0.5), (14, 0.3), (5, 0.2))), [0.36, 0.5, 0.64])
    # 하늘 물감: 위는 옅은 쪽빛, 아래로 갈수록 옅게
    for y in range(HS):
        a = 0.30 - 0.14 * (y / HS)
        cv.a[y] = cv.a[y] * (1 - a) + hx('#a9c2cc') * a
    sr = np.random.default_rng(17)
    for _ in range(5):   # 얼룩
        x, y, r_ = sr.integers(20, 220), sr.integers(10, 140), sr.integers(5, 11)
        m = blob(x, y, r_, r_ * 0.7, 400 + _, 0.4, 3) & IN
        wash(cv, m & (BY < 0.5), '#b89868', 0.2)
    # ── 별의 정원: 밤하늘 물감과 별 ──
    night = blob(48, 30, 40, 25, 311, 0.3, 8) & IN & (YY > 4) & (XX > 4)
    wash(cv, night, '#2e3466', 0.62)
    wash(cv, night & ~ndi.binary_erosion(night, iterations=3) & (BY < 0.5), '#d6bc88', 0.45)   # 가장자리는 바둑 무늬로 흐리게
    edge = night & ~ndi.binary_erosion(night)
    cv.fill(edge & ((XX + YY).astype(int) % 2 == 0), '#4a4a7a')
    inner = ndi.binary_erosion(night, iterations=3)
    for i, (x, y) in enumerate(poisson(inner & ~clear & (YY < 38), 4.2, 312, 3000)):
        stamp_star(cv, x, y, c='#fff4c0' if i % 3 else '#ffffff')
    for (x, y) in [(24, 16), (38, 10), (62, 12), (84, 24), (20, 36)]:
        if night[y, x]: stamp_star(cv, x, y, True, '#ffe890'); cv.px(x, y, '#fffbe8')
    # 별자리 (점선)
    cst = [(24, 16), (32, 22), (38, 10), (50, 15), (62, 12)]
    for a_, b_ in zip(cst[:-1], cst[1:]):
        for i, (x, y) in enumerate(catmull([a_, b_], 6)):
            if i % 3 == 1: cv.px(x, y, '#c8b878')
    # ── 바닥 구름 바다 ──
    sea = np.zeros((H, W), bool)
    rr = np.random.default_rng(321)
    for x in range(-6, W + 8, 11):
        r_ = 6 + rr.random() * 5
        sea |= disk(x + rr.random() * 4, 134 - r_ * 0.3 + rr.random() * 3, r_)
    sea |= (YY >= 134)
    sea &= IN
    cloud(cv, sea, folds=14, seed=322)
    for (x0, y0, w_) in [(40, 141, 16), (120, 143, 20), (196, 142, 18)]:   # 앞 구름 주름 (긴 활꼴)
        for t in range(w_):
            if t % 5 != 4: cv.px(x0 + t, y0 - int(round(1.5 * np.sin(np.pi * t / w_))), INK3)
    # 위 구름 몇 덩이
    for i, (cx, cy, w_, h_) in enumerate([(110, 22, 22, 7), (152, 34, 14, 5), (22, 94, 18, 6), (228, 86, 14, 5), (92, 116, 14, 4)]):
        m = puffs(cx, cy, w_, h_, 330 + i) & IN
        cloud(cv, m, folds=1, seed=340 + i)
    # 바람 줄기 (끝이 말리는 잉크 선)
    for (x0, y0, L, s) in [(80, 58, 22, 1), (150, 112, 18, -1), (222, 112, 12, 1), (100, 40, 14, -1)]:
        for t in range(L):
            if t % 6 != 5: cv.px(x0 + t, y0 - int(round(1.5 * np.sin(t / L * np.pi * 2))) * s, INK3)
        for k in range(5):
            a = k / 5 * np.pi * 1.4
            cv.px(x0 + L + np.cos(a - np.pi / 2) * 2, y0 + s * (np.sin(a - np.pi / 2) * 2 + 2), INK3)
    for (x, y) in [(92, 66), (98, 63), (160, 102), (234, 60)]:   # 나는 새
        cv.px(x - 1, y - 1, INK2); cv.px(x, y, INK2); cv.px(x + 1, y - 1, INK2); cv.px(x - 2, y - 1, INK3); cv.px(x + 2, y - 1, INK3)
    # ── 하늘길 (붉은 잉크 점선) ──
    routes = [
        [(36, 112), (52, 104), (70, 94)],                 # 상단 비행 마차 → 구름섬
        [(152, 76), (166, 62), (178, 54)],                # 구름섬 → 천둥 봉우리
        [(210, 60), (216, 84), (208, 106)],               # 천둥 봉우리 → 유적 폐허
        [(170, 126), (128, 124), (86, 112), (62, 82), (52, 52)],   # 유적 폐허 → 별의 정원 (구름섬 아래로 돌아)
    ]
    road = np.zeros((H, W), bool)
    for pts in routes:
        for i, (x, y) in enumerate(catmull(pts, 14)):
            if 0 <= x < W and 0 <= y < HS:
                road[y, x] = True
                if i % 4 < 2: cv.px(x, y, '#9a3a24')
    # ── 작은 섬 둘 ──
    for k, (ix, iy, irx) in enumerate([(60, 120, 11), (150, 128, 8)]):
        topm, _, _ = island(cv, ix, iy, irx, 3, irx * 0.9, 350 + k)
        cv.stamp(ix - 2, iy - 1, TREE_A, dict(o=INK, G='#6a9a48', g='#4e7a38', t=INK), mark=False)
    # ── 구름섬 (가운데 큰 섬) ──
    cx, cy = NODES['sky']
    topm, under, bot = island(cv, cx, cy + 2, 46, 11, 28, 361, tip=0.9)
    # 폭포 (섬 오른쪽 끝 → 구름 바다)
    fx = 152
    y0 = max(y for y in range(HS) if topm[y, fx]) if topm[:, fx].any() else 96
    for y in range(y0, 132):
        if not under[y, fx] or y > y0 + 1:
            cv.px(fx, y, '#3a5a7a'); cv.px(fx + 1, y, '#8aaac0' if y % 3 else '#f4f8fa'); cv.px(fx + 2, y, '#3a5a7a' if y % 4 == 0 else '#6a8aa0')
    for (dx, dy) in [(-3, 0), (-1, -1), (2, -1), (4, 0), (0, 1), (5, 1), (-4, 1)]:
        cv.px(fx + dx, 132 + dy, '#ffffff')
    # 나무 (노드 · 신전 자리 피해서)
    tm = topm & ~clear & (YY < cy + 9) & ~disk(*DUN['sky'], 11) & ndi.binary_erosion(topm, iterations=2)
    for (x, y) in sorted(poisson(tm, 6.5, 362, 3000), key=lambda p: p[1]):
        cv.stamp(x, y + 2, TREE_A, dict(o=INK, G='#6a9a48', g='#4e7a38', t=INK), mark=False)
    # 구름 위 신전 (던전 자리)
    tx, ty = DUN['sky'][0], DUN['sky'][1] + 6
    cv.rect(tx - 9, ty - 1, 19, 3, '#f0e8d4'); cv.rect(tx - 9, ty - 1, 19, 1, INK); cv.rect(tx - 9, ty + 2, 19, 1, INK)
    for i in range(5):
        px_ = tx - 7 + i * 4
        cv.rect(px_, ty - 9, 2, 8, '#fbf6ea'); cv.px(px_ + 1, ty - 8, '#c8bca0'); cv.px(px_ + 1, ty - 5, '#c8bca0'); cv.rect(px_ - 1, ty - 9, 1, 8, INK); cv.rect(px_ + 2, ty - 9, 1, 8, INK)
    cv.rect(tx - 10, ty - 11, 21, 2, '#f0e8d4'); cv.rect(tx - 10, ty - 11, 21, 1, INK); cv.rect(tx - 10, ty - 10, 1, 1, INK); cv.rect(tx + 10, ty - 10, 1, 1, INK)
    for j in range(5):   # 박공 (세모 지붕)
        w2 = 10 - j * 2
        cv.rect(tx - w2, ty - 12 - j, w2 * 2 + 1, 1, '#f0e8d4'); cv.px(tx - w2, ty - 12 - j, INK); cv.px(tx + w2, ty - 12 - j, INK)
    cv.px(tx, ty - 17, INK); cv.rect(tx - 1, ty - 14, 3, 1, '#e0b040')
    # ── 천둥 봉우리 ──
    nx, ny = NODES['thunder']
    topm, under, _ = island(cv, nx, ny + 4, 27, 6, 22, 371, top='#a8a8b0', rock='#c8c0b4', hatch='#5a5a6a')
    for (x, h, w) in [(176, 22, 11), (184, 14, 9), (208, 12, 9), (172, 12, 8)]:
        tri(cv, x, ny + 5, w, h, '#c4c0c4', '#5a5a6a', INK, '#ecebee', 0.18)
    # 뇌신의 첨탑 (던전 자리): 돌탑 · 창 · 난간 · 뾰족 지붕 · 끝에 푸른 수정
    sx, sy = DUN['thunder']
    top_y, base = sy - 4, ny + 5
    cv.rect(sx - 2, top_y, 5, base - top_y, '#b4b0b8'); cv.rect(sx - 2, top_y, 1, base - top_y, INK); cv.rect(sx + 2, top_y, 1, base - top_y, INK)
    cv.rect(sx + 1, top_y + 1, 1, base - top_y - 1, '#8a8a98')
    for y in (top_y + 4, top_y + 11): cv.rect(sx - 1, y, 2, 2, '#2a2a3a')
    cv.rect(sx - 3, top_y + 8, 7, 1, INK); cv.rect(sx - 3, base - 6, 7, 1, INK)
    for j in range(7):   # 뾰족 지붕
        hw = j // 2
        cv.rect(sx - hw, top_y - 7 + j, hw * 2 + 1, 1, '#4a5a8a'); cv.px(sx - hw, top_y - 7 + j, INK); cv.px(sx + hw, top_y - 7 + j, INK)
    cv.rect(sx - 4, top_y, 9, 1, INK)
    cv.px(sx, top_y - 8, '#8ad8ff'); cv.px(sx, top_y - 9, '#d8f4ff'); cv.px(sx - 1, top_y - 8, INK); cv.px(sx + 1, top_y - 8, INK)
    # 먹구름 · 번개
    sc = puffs(190, 15, 40, 8, 372) & IN
    cloud(cv, sc, fill='#5a6076', a=0.85, line=INK, folds=3, seed=373)
    wash(cv, sc & (YY < 12) & (BY < 0.5), '#7a8098', 0.6)
    bolt = [(180, 20), (178, 24), (182, 25), (179, 30), (181, 31), (178, 35)]
    for a_, b_ in zip(bolt[:-1], bolt[1:]):
        for (x, y) in catmull([a_, b_], 4):
            cv.px(x, y, '#f8d040'); cv.px(x + 1, y, INK)
    for (x, y) in [(198, 22), (202, 24), (196, 25)]:   # 빗줄기
        for t in range(3): cv.px(x - t // 2, y + t, '#6a7a90')
    # ── 천계의 유적 폐허 ──
    rx_, ry_ = NODES['ruins']
    topm, under, _ = island(cv, rx_, ry_ + 3, 29, 6, 15, 381, top='#d8d0b4', rock='#d4c4a4')
    for (x, h) in [(210, 11), (218, 7), (226, 9)]:   # 부러진 기둥
        y1 = ry_ + 2
        cv.rect(x - 1, y1 - h, 3, h, '#fbf6ea'); cv.rect(x - 2, y1 - h, 1, h, INK); cv.rect(x + 2, y1 - h, 1, h, INK)
        cv.rect(x - 2, y1 - h - 1, 5, 1, INK)
        cv.px(x + 1, y1 - h - 1, '#d4c4a4'); cv.px(x, y1 - h - 2, INK)   # 부러진 끝
        for y in range(y1 - h + 2, y1, 3): cv.px(x, y, '#c8bca0')
    for t in range(13):   # 무너진 아치 (기둥 210 ↔ 218 위)
        a = np.pi * t / 12
        cv.px(214 - np.cos(a) * 5, ry_ - 9 - np.sin(a) * 4, INK if t not in (8, 9) else '#d8d0b4')
    cv.rect(213, ry_ + 1, 6, 2, '#ece4d0'); cv.rect(213, ry_ + 1, 6, 1, INK)   # 쓰러진 돌
    # 무너진 천계의 성소 (던전 자리): 왼쪽 반만 남은 박공 · 기둥 넷 · 어두운 문
    dx_, dy_ = DUN['ruins']
    SANC = ['.......k.......', '.....kkWkk.....', '...kkWWWWWkk...', '.kkWWWWWWWW.k..', 'kkkkkkkkkk..kk.', '.kWk.kdddk.kWk.', '.kWk.kdddk.kWk.', '.kWk.kdddk.kWk.', '.kWk.kdddk..k..', 'kkkkkkkkkkkkkkk', 'kWWWWWWWWWWWWWk', 'kkkkkkkkkkkkkkk']
    cv.stamp(dx_, dy_ + 8, SANC, dict(k=INK, W='#f4eedc', d='#3a2a20'), mark=False)
    for (x, y) in [(dx_ + 10, dy_ + 7), (dx_ + 13, dy_ + 7)]: cv.rect(x, y, 2, 1, '#ece4d0'); cv.px(x, y - 1, INK); cv.px(x + 1, y - 1, INK)   # 떨어진 돌
    # ── 별의 정원 ──
    gx, gy = NODES['stargarden']
    topm, under, _ = island(cv, gx, gy + 4, 25, 5, 17, 391, top='#8a88c0', rock='#b8b0c8', hatch='#4a4a72')
    STAR_T = ['..ooo..', '.oGyGo.', 'oGGgGgo', 'oyGgggo', 'oGgygGo', '.oggo..', '..oto..', '...t...', '..ttt..']
    for (x, y) in [(32, gy + 5), (41, gy + 3), (60, gy + 5)]:   # 별꽃 나무
        cv.stamp(x, y, STAR_T, dict(o=INK, G='#7a6ac0', g='#54489a', y='#ffe890', t=INK), mark=False)
    # 별의 왕좌 (던전 자리): 정원 위에 뜬 작은 바위 · 받침 · 둥근 등받이 · 금빛 보석
    wx_, wy_ = DUN['stargarden']
    island(cv, wx_ + 1, wy_ + 9, 8, 2, 5, 392, top='#8a88c0', rock='#b8b0c8', hatch='#4a4a72')
    THRONE = ['...kkk...', '..kPyPk..', '.kPPPPPk.', '.kPpppPk.', '.kPpppPk.', '.kPPPPPk.', 'kkkkkkkkk', 'kSSSSSSSk', 'kSk...kSk', 'kkkkkkkkk', 'kDDDDDDDk', 'kkkkkkkkk']
    cv.stamp(wx_ + 1, wy_ + 9, THRONE, dict(k=INK, y='#ffe890', P='#a89ad8', p='#c8bcf0', S='#e8e0f8', D='#c8c0e0'), mark=False)
    # ── 비행 마차 (상단 → 구름섬) ──
    bx, by = 28, 116
    cv.rect(bx - 5, by - 2, 11, 4, '#a07848'); cv.rect(bx - 5, by - 2, 11, 1, INK); cv.rect(bx - 5, by + 1, 11, 1, INK); cv.rect(bx - 5, by - 2, 1, 4, INK); cv.rect(bx + 5, by - 2, 1, 4, INK)
    for wx2 in (bx - 3, bx + 3):
        cv.px(wx2 - 1, by + 2, INK); cv.px(wx2, by + 3, INK); cv.px(wx2 + 1, by + 2, INK); cv.px(wx2, by + 2, '#8a6238')
    for j in range(5):   # 날개 둘
        cv.rect(bx - 6 + j, by - 3 - j, 5 - j, 1, '#fbf8f0'); cv.px(bx - 7 + j, by - 3 - j, INK)
        cv.rect(bx + 2, by - 3 - j, 5 - j, 1, '#fbf8f0'); cv.px(bx + 7 - j, by - 3 - j, INK)
    cv.px(bx + 7, by - 1, INK); cv.px(bx + 8, by - 2, INK)   # 끄는 줄
    # ── 나침반 (왼쪽 아래) ──
    ox, oy = 13, 136
    ring = (np.abs(np.hypot(XX - ox, YY - oy) - 7) < 0.6) & IN
    wash(cv, disk(ox, oy, 6.4), '#f4ecd8', 0.6)
    cv.fill(ring, INK)
    for j in range(7): cv.rect(ox - (j // 2), oy - 7 + j, 1 + 2 * (j // 2), 1, '#9a3a24')
    for j in range(6): cv.rect(ox - (2 - j // 2), oy + j, 1 + 2 * (2 - j // 2), 1, '#f2e6c8'); cv.px(ox - (2 - j // 2), oy + j, INK); cv.px(ox + (2 - j // 2), oy + j, INK)
    for (x, y) in [(ox - 2, oy - 13), (ox - 2, oy - 12), (ox - 2, oy - 11), (ox - 2, oy - 10), (ox + 1, oy - 13), (ox + 1, oy - 12), (ox + 1, oy - 11), (ox + 1, oy - 10), (ox - 1, oy - 12), (ox, oy - 11)]: cv.px(x, y, INK)   # N
    # ── 가장자리 그을림 · 겹테두리 · 마름모 모서리 ──
    ed = np.minimum(np.minimum(XX, W - 1 - XX), np.minimum(YY, HS - 1 - YY))
    for d_, a in [(0, 0.55), (1, 0.4), (2, 0.28), (3, 0.18), (4, 0.1)]:
        m = (ed <= d_ + 0.5) & (ed >= d_ - 0.5) & IN
        wash(cv, m, '#8a6a42', a)
    for d_ in (1, 3):
        cv.rect(d_, d_, W - 2 * d_, 1, INK); cv.rect(d_, HS - 1 - d_, W - 2 * d_, 1, INK); cv.rect(d_, d_, 1, HS - 2 * d_, INK); cv.rect(W - 1 - d_, d_, 1, HS - 2 * d_, INK)
    for (x, y) in [(3, 3), (W - 4, 3), (3, HS - 4), (W - 4, HS - 4)]:
        for (dx, dy) in [(0, -2), (-1, -1), (1, -1), (-2, 0), (2, 0), (-1, 1), (1, 1), (0, 2), (0, 0)]: cv.px(x + dx, y + dy, '#9a3a24' if (dx, dy) == (0, 0) else INK)
    return cv.img().crop((0, 0, W, HS))


if __name__ == '__main__':
    im = draw(); z = int(sys.argv[2]) if len(sys.argv) > 2 else 2
    im.resize((W * z, HS * z), Image.NEAREST).save(sys.argv[1])
