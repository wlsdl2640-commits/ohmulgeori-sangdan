"""지도 시안 B — 도트 지형 (16비트 RPG 필드 지도처럼): python3 map_b.py <출력.png> [배율]"""
import sys
import numpy as np
from PIL import Image
from geo66 import *

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
BY = BAYER[(YY.astype(int) % 4), (XX.astype(int) % 4)]


class Cv:
    def __init__(s):
        s.a = np.zeros((H, W, 3), float)
        s.occ = np.zeros((H, W), bool)   # 장식이 이미 놓인 칸

    def fill(s, m, c): s.a[m] = hx(c)

    def px(s, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < W and 0 <= y < H: s.a[y, x] = hx(c) if isinstance(c, str) else c

    def rect(s, x, y, w, h, c):
        for yy in range(int(y), int(y + h)):
            for xx in range(int(x), int(x + w)): s.px(xx, yy, c)

    def get(s, x, y): return s.a[int(y), int(x)]

    def stamp(s, x, y, rows, pal, mark=True):
        """rows 아래 가운데를 (x, y)에 — '.'은 비움"""
        h = len(rows); w = max(len(r) for r in rows)
        x0 = int(x) - w // 2; y0 = int(y) - h + 1
        for j, r in enumerate(rows):
            for i, ch in enumerate(r):
                if ch == '.' or ch == ' ': continue
                xx, yy = x0 + i, y0 + j
                if 0 <= xx < W and 0 <= yy < H:
                    s.a[yy, xx] = hx(pal[ch])
                    if mark: s.occ[yy, xx] = True

    def img(s): return Image.fromarray(np.clip(s.a, 0, 255).astype(np.uint8))


def tones(cv, mask, cols, n, cuts):
    """잡음 n을 문턱 cuts로 나눠 cols 색 — 문턱 둘레는 바둑 무늬(Bayer)로 섞는다"""
    v = n + (BY - 0.5) * 0.08
    idx = np.zeros((H, W), int)
    for c in cuts: idx += (v > c)
    for i, c in enumerate(cols): cv.fill(mask & (idx == i), c)


def poisson(mask, r, seed, tries=3000):
    rng = np.random.default_rng(seed)
    ys, xs = np.nonzero(mask)
    if not len(xs): return []
    pts = []
    order = rng.permutation(len(xs))[:tries]
    for k in order:
        x, y = xs[k], ys[k]
        if all((x - a) ** 2 + (y - b) ** 2 >= r * r for a, b in pts): pts.append((int(x), int(y)))
    return pts


TREE = ['.ooo.', 'oLLMo', 'oLMMo', 'oMMDo', '.oDo.', '..t..']
TREE2 = ['.oooo.', 'oLLLMo', 'oLLMMo', 'oLMMDo', 'oMMDDo', '.oDDo.', '..tt..']
PINE = ['..o..', '.oWo.', '.oMo.', 'oWMMo', 'oMMDo', '.ooo.', '..t..']
PINE_G = ['..o..', '.oLo.', '.oMo.', 'oLMMo', 'oMMDo', '.ooo.', '..t..']
BUSH = ['.oo.', 'oLMo', '.oo.']
TOMB = ['.oo.', 'oLLo', 'oLMo', 'oMMo', 'kkkk']
DEADT = ['k.k..', '.k..k', '.kk.k', '..kk.', '..k..', '..k..']
CACT = ['.o...', 'oGo.o', 'oGooG', 'oGGGo', '.oGo.', '.oGo.']


def peak(cv, x, y, w, h, P, snow=0.0, seed=0):
    """산봉우리: 왼쪽 비탈 밝고 오른쪽 어둡게, 테 · 눈 덮인 꼭대기"""
    r = np.random.default_rng(seed)
    ridge = 0
    for j in range(h):
        yy = y - h + 1 + j
        hw = (j + 1) * w / (2 * h)
        ridge += (r.random() - 0.5) * 0.8
        rc = x + max(-hw * 0.4, min(hw * 0.4, ridge))
        xl, xr = int(round(x - hw)), int(round(x + hw))
        for xx in range(xl, xr + 1):
            cap = j < h * snow
            if xx <= rc - 1: c = P['sL'] if cap else (P['L'] if (xx + yy) % 5 else P['M'])
            elif xx <= rc + 0.5: c = P['sL'] if cap else P['M']
            else: c = P['sD'] if cap else (P['D'] if (xx * 3 + yy) % 7 else P['M'])
            if xx == xl or xx == xr: c = P['o']
            cv.px(xx, yy, c); cv.occ[max(0, min(H - 1, yy)), max(0, min(W - 1, xx))] = True
    cv.px(x, y - h, P['o'])


def draw():
    cv = Cv()
    clear = keep_clear()
    # ── 풀밭 ──
    n = fbm(1)
    tones(cv, LAND, ['#5c8c3c', '#6c9e46', '#7cae50', '#8cbe5e'], n, [0.36, 0.5, 0.62])
    r = np.random.default_rng(5)
    for _ in range(420):   # 풀 포기
        x, y = r.integers(1, W - 1), r.integers(1, 204)
        if LAND[y, x]: cv.px(x, y, '#4e7c34' if r.random() < 0.6 else '#9ccc6a')
    # ── 밭 (하르겐 둘레) ──
    fr = np.random.default_rng(8)
    for (fx, fy, fw, fh) in [(98, 126, 9, 6), (108, 124, 10, 5), (134, 128, 9, 6), (140, 136, 8, 6), (100, 156, 8, 5), (134, 162, 10, 5), (110, 170, 9, 4), (62, 122, 10, 6), (70, 130, 8, 5), (58, 132, 9, 5), (88, 98, 8, 5)]:
        c = ['#d8c068', '#c4b050', '#9cc456', '#b08a58'][fr.integers(0, 4)]
        for yy in range(fy, fy + fh):
            for xx in range(fx, fx + fw):
                if LAND[yy, xx] and not FOREST[yy, xx]:
                    cv.px(xx, yy, c if (yy - fy) % 2 == 0 or c == '#9cc456' else (np.clip(hx(c) * 0.9, 0, 255)))
        cv.rect(fx, fy + fh, fw, 1, '#4e7c34')
    # ── 바다 · 바닷가 ──
    dl = ndi.distance_transform_edt(SEA)      # 바다 칸: 땅까지 거리
    dsea = ndi.distance_transform_edt(~SEA)   # 땅 칸: 바다까지 거리
    beach = LAND & (dsea <= 2.0)
    cv.fill(beach, '#e8d8a0'); cv.fill(LAND & (dsea > 1.0) & (dsea <= 2.0), '#d4c088')
    v = dl + (BY - 0.5) * 1.6
    cv.fill(SEA & (v >= 1.5), '#5ea6d8'); cv.fill(SEA & (v >= 4), '#4a8cc4'); cv.fill(SEA & (v >= 9), '#3a74b0'); cv.fill(SEA & (v >= 16), '#2e5e98')
    cv.fill(SEA & (dl < 1.5), '#e4f2f8')
    wr = np.random.default_rng(4)
    for _ in range(70):
        x, y = wr.integers(2, 100), wr.integers(152, 204)
        if SEA[y, x] and SEA[y, min(W - 1, x + 3)] and dl[y, x] > 3: cv.rect(x, y, 3, 1, '#8cc4ec'); cv.px(x + 1, y - 1, '#b8e0f8')
    # ── 눈 ──
    tones(cv, SNOW, ['#c4d4e8', '#dce6f2', '#eef4fa', '#ffffff'], fbm(2), [0.4, 0.52, 0.64])
    edge = SNOW & (ndi.distance_transform_edt(SNOW) <= 2) & (BY < 0.5)
    cv.fill(edge, '#9cc46a')
    # ── 사막 ──
    tones(cv, DESERT, ['#c8a85c', '#dcbe70', '#e8cc80', '#f2dc98'], fbm(3), [0.38, 0.5, 0.62])
    cv.fill(DESERT & (ndi.distance_transform_edt(DESERT) <= 2) & (BY < 0.45), '#a8b058')
    # ── 협곡 (붉은 바위 층) ──
    tones(cv, CANYON, ['#b8844e', '#c8945a', '#d4a468', '#dcb070'], fbm(6), [0.38, 0.5, 0.62])
    cv.fill(CANYON & (ndi.distance_transform_edt(CANYON) <= 2) & (BY < 0.45), '#a0a858')
    # ── 묘지 ──
    tones(cv, GRAVE, ['#4e5450', '#5a605a', '#666c64', '#72786e'], fbm(4), [0.38, 0.5, 0.62])
    cv.fill(GRAVE & (ndi.distance_transform_edt(GRAVE) <= 2) & (BY < 0.45), '#6a8a50')
    # ── 산 밑 바위땅 ──
    tones(cv, MOUNT, ['#6e6a5e', '#7c786a', '#8a8676'], fbm(5), [0.42, 0.58])
    # ── 숲 밑 (어두운 풀) ──
    tones(cv, FOREST, ['#2e5a2e', '#3a6a36', '#467a3e'], fbm(7), [0.42, 0.58])
    # ── 강 ──
    for cells in (RIVER1, RIVER2):
        for (x, y) in cells:
            for dx in (0, 1):
                if 0 <= x + dx < W and 0 <= y < H and not SEA[y, x + dx]: cv.px(x + dx, y, '#4a8cc4')
        for (x, y) in cells[::3]:
            if 0 <= x < W and 0 <= y < H and not SEA[y, x]: cv.px(x, y, '#8cc4ec')
    riv = np.zeros((H, W), bool)
    for cells in (RIVER1, RIVER2):
        for (x, y) in cells:
            for dx in (0, 1):
                if 0 <= x + dx < W and 0 <= y < H: riv[y, x + dx] = True
    # ── 길 ──
    road = np.zeros((H, W), bool)
    for cells in road_cells():
        for (x, y) in cells:
            for dx in (0, 1):
                if 0 <= x + dx < W and 0 <= y < H: road[y, x + dx] = True
    bridge = road & (riv | SEA)
    roadL = road & ~SEA & ~riv
    rim = ndi.binary_dilation(road) & ~road & ~SEA & ~riv
    cv.fill(rim & ~DEMON & (YY % 2 == 0), '#8a6a3a'); cv.fill(rim & ~DEMON & (YY % 2 == 1), '#9a7a48')
    cv.fill(roadL & ~DEMON, '#d0ac6c'); cv.fill(roadL & ~DEMON & (BY < 0.25), '#e0c088')
    cv.fill(rim & DEMON, '#3a3040'); cv.fill(roadL & DEMON, '#6a5a6a')
    for (x, y) in FRAMA_BRIDGE:   # 프라마 섬 다리
        for dx in (0, 1): cv.px(x + dx, y, '#9a6a3a')
        cv.px(x, y + 1, '#5a3a1e')
    cv.fill(bridge, '#9a6a3a'); cv.fill(ndi.binary_dilation(bridge) & ~bridge & (riv | SEA), '#5a3a1e')
    cv.occ |= road | riv | clear
    # ── 숲 나무 ──
    pts = poisson(FOREST & ~road & ~riv, 4.2, 11, 6000)
    PT = dict(o='#1e3a1e', L='#62a84e', M='#44863c', D='#2e6430', t='#5a3a22')
    PT2 = dict(o='#1a341a', L='#56a046', M='#3a7a34', D='#28582a', t='#4a3020')
    for (x, y) in sorted(pts, key=lambda p: p[1]):
        if clear[y, x]: continue
        cv.stamp(x, y + 2, TREE2 if (x * 7 + y) % 3 == 0 else TREE, PT2 if (x + y) % 2 else PT)
    # 평원의 작은 나무 덤불
    for (x, y) in poisson(LAND & ~FOREST & ~MOUNT & ~SNOW & ~DESERT & ~CANYON & ~GRAVE & ~beach & ~DEMON & ~road & ~riv & ~clear & ~disk(*CITY, 22), 14, 13, 2000):
        if cv.occ[y, x]: continue
        cv.stamp(x, y + 1, BUSH if (x + y) % 3 else TREE, dict(o='#2a4a22', L='#78b856', M='#58983e', D='#3a7030', t='#5a3a22'))
    # ── 산봉우리 ──
    PM = dict(L='#b0aa9c', M='#908a7c', D='#6c675c', o='#3a3630', sL='#f4f8fc', sD='#c4d0e0')
    dm = ndi.distance_transform_edt(MOUNT)
    for (x, y) in poisson(MOUNT & (dm <= 5) & ~road & ~clear, 7, 22, 3000):   # 산기슭 언덕
        for k in range(-4, 5):
            hh = int(round(3 * (1 - (k / 4.5) ** 2)))
            for j in range(hh + 1): cv.px(x + k, y - j, '#9a9484' if k < 0 else '#7a7466' if j else '#686254')
            cv.px(x + k, y - hh - 1, '#4a463c')
        cv.occ[max(0, y - 4):y + 1, max(0, x - 4):x + 5] = True
    mp = poisson(MOUNT & (dm > 3) & ~road & ~clear, 8.5, 21, 4000)
    rmh = np.random.default_rng(23)
    for i, (x, y) in enumerate(sorted(mp, key=lambda p: p[1])):
        h = int(6 + min(9, dm[y, x] * 0.55) + rmh.integers(-1, 3)); w = int(h * (1.5 + rmh.random() * 0.4))
        if rmh.random() < 0.3: peak(cv, x - w // 3, y + 2, int(w * 0.7), max(4, h - 3), PM, 0.0, 300 + i)
        peak(cv, x, y + 3, w, h, PM, 0.3 if h >= 11 else 0.0, i)
    PS = dict(L='#e8eef6', M='#cdd8e6', D='#a8b8cc', o='#5a6a80', sL='#ffffff', sD='#dce6f2')
    sp = poisson(SNOW & ~road & ~clear & (YY < 66), 11, 31, 3000)
    for i, (x, y) in enumerate(sorted(sp, key=lambda p: p[1])):
        h = 9 + (i * 3) % 7; peak(cv, x, y + 3, int(h * 1.6), h, PS, 0.45, 50 + i)
    for (x, y) in poisson(SNOW & ~cv.occ & (YY > 30), 7, 33, 2000):
        cv.stamp(x, y + 2, PINE, dict(o='#1e3a2e', W='#ffffff', M='#3e7a5a', D='#2a5a44', t='#4a3020'))
    # ── 사막 모래 언덕 · 선인장 · 오아시스 ──
    for (x, y) in poisson(DESERT & ~road & ~clear, 10, 41, 3000):
        if cv.occ[y, x]: continue
        for k in range(-4, 5):
            yy = y - int(round(2 * (1 - (k / 4.5) ** 2)))
            cv.px(x + k, yy, '#f6e6b0'); cv.px(x + k, yy + 1, '#c4a058' if k > -2 else '#dcbe70')
    for (x, y) in poisson(DESERT & ~road & ~clear & ~cv.occ, 18, 43, 1500):
        cv.stamp(x, y + 1, CACT, dict(o='#2a4a22', G='#58983e'))
    oas = blob(188, 172, 6, 3.5, 44, 0.15, 3)
    cv.fill(oas, '#4a9cd0'); cv.fill(ndi.binary_dilation(oas, iterations=1) & ~oas, '#6aaa4a')
    for (x, y) in [(181, 170), (196, 171), (186, 167)]:
        cv.stamp(x, y, ['o.o.o', '.ooo.', 'ooGoo', '..t..', '..t..', '..t..'], dict(o='#2a5a22', G='#3a7a30', t='#7a5a32'))
    # ── 협곡: 깊은 골짜기 + 메사 (평평한 꼭대기 · 붉은 벼랑) ──
    gorge = np.zeros((H, W), bool)
    for (x, y) in RIVER2:
        if 0 <= x < W and 0 <= y < H and CANYON[y, x]:
            for dx in range(-2, 4):
                for dy in range(-3, 4):
                    if 0 <= x + dx < W and 0 <= y + dy < H: gorge[y + dy, x + dx] = True
    gorge &= CANYON
    cv.fill(gorge, '#7a4428'); cv.fill(gorge & (BY < 0.3), '#8a5030')
    for (x, y) in RIVER2:
        if 0 <= x < W and 0 <= y < H and CANYON[y, x]: cv.px(x, y, '#4a8cc4'); cv.px(x + 1, y, '#4a8cc4'); cv.px(x, y - 3, '#5a2e18')
    cv.occ |= gorge
    rms = np.random.default_rng(64)
    mes = poisson(CANYON & ~gorge & ~road & ~clear & (ndi.distance_transform_edt(CANYON) > 4), 12, 65, 2000)
    for (x, y) in sorted(mes, key=lambda p: p[1]):
        if cv.occ[y, x]: continue
        w = int(rms.integers(7, 13)); th = int(rms.integers(2, 4)); fh = int(rms.integers(4, 7))
        yt = y - fh - th   # 꼭대기 맨 위 줄
        rows = []
        for j in range(th):   # 꼭대기: 둥근 모서리
            ins = 1 if j == 0 else 0
            rows.append((yt + j, x - w // 2 + ins, x - w // 2 + w - 1 - ins, 'top', j))
        for j in range(fh):   # 벼랑: 아래로 갈수록 조금씩 넓어지는 비탈
            sp = j // 2
            rows.append((yt + th + j, x - w // 2 - sp, x - w // 2 + w - 1 + sp, 'cliff', j))
        for (yy, xl, xr, kind, j) in rows:
            for xx in range(xl, xr + 1):
                if kind == 'top': c = '#eebe86' if (j == 0 or xx < x) else '#dca870'
                else:
                    c = '#c47444' if j % 2 == 0 else '#ac5c36'
                    if xx > x + w // 4: c = '#9a5030' if j % 2 == 0 else '#884828'
                    if j == fh - 1: c = '#7a4024'
                if xx in (xl, xr): c = '#5a2e18'
                cv.px(xx, yy, c)
        for xx in range(x - w // 2 + 1, x - w // 2 + w - 1): cv.px(xx, yt - 1, '#5a2e18')
        cv.occ[max(0, yt - 1):y + 1, max(0, x - w // 2 - fh // 2 - 1):x + w // 2 + fh // 2 + 2] = True
    for (wx, wy, L) in [(160, 82, 10), (186, 100, 12), (168, 108, 8)]:   # 바람 줄기 (바람계곡)
        for t in range(L):
            yy = wy - int(round(2 * np.sin(t / L * np.pi)))
            if t % 4 != 3: cv.px(wx + t, yy, '#fff8ec')
        cv.px(wx + L, wy - 1, '#fff8ec'); cv.px(wx + L + 1, wy - 2, '#fff8ec')
    # ── 묘지: 비석 · 죽은 나무 · 안개 ──
    for (x, y) in poisson(GRAVE & ~road & ~clear & (ndi.distance_transform_edt(GRAVE) > 2), 6, 51, 1500):
        if cv.occ[y, x]: continue
        if (x * 3 + y) % 4 == 0: cv.stamp(x, y + 1, DEADT, dict(k='#221e26'))
        else: cv.stamp(x, y + 1, TOMB, dict(o='#2e2c36', L='#c8c8d4', M='#9a9aa8', k='#3a3844'))
    gf = GRAVE & ~ndi.binary_erosion(GRAVE, iterations=1) & ~road   # 낡은 나무 울타리
    cv.fill(gf & ((XX.astype(int) % 3) != 0), '#5a4632'); cv.fill(gf & ((XX.astype(int) % 3) == 0), '#3a2c20')
    for k in range(5):   # 안개 띠 (가로로 길게, 바둑 무늬)
        yb = 104 + k * 4
        fogm = GRAVE & (np.abs(YY - yb - 2 * np.sin(XX * 0.2 + k)) < 0.8) & (BY < 0.55)
        cv.a[fogm] = cv.a[fogm] * 0.45 + hx('#dce4ec') * 0.55
    # ── 세계수 ──
    tx, ty = 76, 34
    rr = np.random.default_rng(61)
    for k in range(9):   # 뿌리
        a = -0.2 + k / 8 * (np.pi + 0.4)
        L = 9 + rr.integers(0, 6)
        for t in range(L):
            x = tx + np.cos(a) * t * 1.3; y = ty + 1 + np.sin(a) * t * 0.55
            cv.px(x, y, '#6a4a2a' if t % 3 else '#8a6a3a'); cv.px(x, y + 1, '#3a2614')
    cv.rect(tx - 3, ty - 18, 7, 19, '#6a4a2a'); cv.rect(tx - 3, ty - 18, 2, 19, '#8a6a3a'); cv.rect(tx + 3, ty - 18, 1, 19, '#3a2614')
    can = np.zeros((H, W), bool)
    for (cx, cy, ax, ay) in [(tx, 13, 20, 9), (tx - 10, 10, 10, 6), (tx + 10, 10, 10, 6), (tx, 6, 13, 5), (tx - 15, 15, 7, 4), (tx + 15, 15, 7, 4)]:
        can |= ((XX - cx) / ax) ** 2 + ((YY - cy) / ay) ** 2 + (fbm(62) - 0.5) * 0.45 < 1
    lit = ((XX - tx + 6) * 0.6 + (YY - 4) * 1.0) + (fbm(63) - 0.5) * 8
    cv.fill(can, '#2e6430'); cv.fill(can & (lit < 12), '#3a7a36'); cv.fill(can & (lit < 6), '#4e9a42'); cv.fill(can & (lit < 1), '#6ab854')
    leaf = can & ((((XX.astype(int) * 3 + YY.astype(int) * 5) % 11) == 0))
    cv.fill(leaf & (lit < 6), '#84cc66'); cv.fill(leaf & (lit >= 6), '#24502a')
    cv.fill(ndi.binary_dilation(can) & ~can & (YY < 28), '#14301a')
    for k in range(14):   # 빛나는 열매
        x, y = tx - 14 + rr.integers(0, 28), 5 + rr.integers(0, 14)
        if can[y, x]: cv.px(x, y, '#fff4b0'); cv.px(x, y + 1, '#c8a040')
    cv.occ |= can
    # ── 화산 ──
    vx, vy = 158, 28
    for j in range(18):
        hw = 2 + j * 0.95; yy = vy - 18 + j
        for xx in range(int(vx - hw), int(vx + hw) + 1):
            c = '#4a3a36' if xx < vx - 1 else '#2e2422' if xx > vx + 1 else '#3a2e2a'
            if xx in (int(vx - hw), int(vx + hw)): c = '#1a1412'
            cv.px(xx, yy, c)
    cv.rect(vx - 2, vy - 18, 5, 2, '#ff6a2a'); cv.rect(vx - 1, vy - 19, 3, 1, '#ffd040')
    for (sx, L) in [(-2, 8), (1, 11), (3, 6)]:
        for t in range(L): cv.px(vx + sx + (t // 4) * (1 if sx > 0 else -1), vy - 16 + t, '#f08a30' if t % 2 else '#ffb040')
    for (sx, sy, r_) in [(vx - 3, vy - 22, 2), (vx + 2, vy - 25, 3), (vx - 1, vy - 29, 2)]:
        cv.fill(disk(sx, sy, r_), '#6a6470'); cv.px(sx - 1, sy - 1, '#8a8490')
    # ── 하르겐 (성벽 · 지붕 · 성) ──
    cx, cy = CITY
    wall = (((XX - cx) / 17) ** 2 + ((YY - cy) / 11) ** 2 <= 1) & (((XX - cx) / 15) ** 2 + ((YY - cy) / 9) ** 2 > 1)
    inside = ((XX - cx) / 15) ** 2 + ((YY - cy) / 9) ** 2 <= 1
    cv.fill(inside, '#b0a088')
    hr = np.random.default_rng(71)
    for (x, y) in poisson(inside, 3.2, 72, 800):
        if abs(x - cx) < 4 and abs(y - cy) < 4: continue
        rc = ['#b8402a', '#a8382a', '#c85a32', '#8a5a3a'][hr.integers(0, 4)]
        cv.rect(x - 1, y - 1, 3, 1, rc); cv.rect(x - 1, y, 3, 1, '#e0d0b0'); cv.px(x, y, '#5a4a3a')
    cv.fill(wall, '#9a9488'); cv.fill(wall & (YY > cy), '#7a7468'); cv.fill(ndi.binary_dilation(wall) & ~wall & ~inside, '#3a3630')
    for k in range(10):
        a = k / 10 * 2 * np.pi; x = cx + np.cos(a) * 16; y = cy + np.sin(a) * 10
        cv.rect(x - 1, y - 2, 3, 3, '#aca69a'); cv.px(x, y - 3, '#3a3630')
    cv.rect(cx - 3, cy - 8, 7, 7, '#c8c0b0'); cv.rect(cx - 3, cy - 8, 7, 1, '#f0e8d8'); cv.rect(cx + 2, cy - 8, 2, 7, '#a09888')
    cv.rect(cx, cy - 13, 1, 5, '#4a3a2a'); cv.rect(cx + 1, cy - 13, 4, 2, '#f0c24a')
    # ── 뒷골목 · 지하수로 · 암살자 길드 ──
    ax_, ay_ = NODES['alley']
    for (x, y) in poisson(disk(ax_, ay_ + 2, 9) & LAND & ~road, 3, 81, 400):
        if clear[y, x] and abs(x - ax_) < 5 and abs(y - ay_) < 5: continue
        cv.rect(x - 1, y - 1, 3, 1, '#5a5058'); cv.rect(x - 1, y, 3, 1, '#7a6e64'); cv.px(x, y, '#2a2228')
    sx_, sy_ = NODES['sewer']
    cv.rect(sx_ - 5, sy_ - 3, 10, 5, '#6a6a64'); cv.rect(sx_ - 3, sy_ - 1, 6, 3, '#1a1a1e'); cv.rect(sx_ - 5, sy_ - 3, 10, 1, '#9a9a90')
    for k in range(-2, 3, 2): cv.px(sx_ + k, sy_, '#4a4a50')
    for t in range(12): cv.px(sx_ - 1 + (t % 2), sy_ + 2 + t, '#4a7a6a')
    gx, gy = GUILD
    cv.rect(gx - 5, gy - 4, 10, 6, '#2e2a36'); cv.rect(gx - 6, gy - 6, 12, 2, '#1e1a24'); cv.px(gx - 2, gy - 2, '#e04a4a'); cv.px(gx + 2, gy - 2, '#e04a4a')
    # ── 왕국 성 ──
    for k, (x, y) in KINGS.items():
        c, c2 = KCOL[k]
        if k == 'frama':   # 섬의 항구 도시
            cv.fill(FRAMA_I & ~SEA, '#cdbb94')
        base, lit, dk = ('#c8b088', '#e8d8b0', '#8a7a5a') if k == 'sarak' else ('#9a9088', '#c8c0b8', '#5a544e')
        cv.rect(x - 7, y - 4, 14, 8, base); cv.rect(x - 7, y - 4, 14, 1, lit); cv.rect(x - 7, y + 3, 14, 1, dk)
        for tx_ in (x - 9, x + 5):
            cv.rect(tx_, y - 9, 4, 13, base); cv.rect(tx_, y - 9, 1, 13, lit); cv.rect(tx_ + 3, y - 9, 1, 13, dk)
            cv.rect(tx_, y - 10, 4, 1, c); cv.px(tx_ + 1, y - 11, c); cv.px(tx_ + 2, y - 11, c)
        cv.rect(x - 1, y - 12, 3, 16, lit); cv.rect(x + 1, y - 12, 1, 16, base)
        if k == 'sarak':
            cv.fill(disk(x, y - 13, 3) & (YY <= y - 12), c); cv.px(x - 1, y - 15, '#f0e0a0')
        else:
            cv.rect(x - 2, y - 14, 5, 2, c); cv.px(x, y - 15, c)
        cv.rect(x - 2, y, 4, 4, '#3a2a1a'); cv.px(x - 1, y - 1, '#3a2a1a'); cv.px(x, y - 1, '#3a2a1a')
        cv.rect(x, y - 19, 1, 5, '#4a3a2a'); cv.rect(x + 1, y - 19, 5, 3, c); cv.rect(x + 1, y - 17, 5, 1, c2)
        for xx in range(x - 10, x + 10): cv.px(xx, y + 4, '#3a3028') if 0 <= xx < W and LAND[min(H - 1, y + 4), xx] else None
    # ── 배 ──
    for (bx, by, d) in [(30, 172, 1), (8, 190, -1)]:
        cv.rect(bx - 4, by, 9, 2, '#7a4a2a'); cv.rect(bx - 3, by + 2, 7, 1, '#4a2a16'); cv.rect(bx, by - 6, 1, 6, '#4a3020')
        for j in range(5): cv.rect(bx + (1 if d > 0 else -1 - (4 - j)), by - 6 + j, 4 - j if d > 0 else 4 - j, 1, '#f0e8d0')
    # ── 마계 ──
    dd = ndi.distance_transform_edt(DEMON)
    tones(cv, DEMON, ['#1e1824', '#262030', '#2e2638', '#382e42'], fbm(9), [0.4, 0.52, 0.64])
    rn = fbm(95, ((10, 0.6), (4, 0.4)))[0]
    for x in range(W):   # 경계 벼랑: 높이가 다른 검은 바위 · 위 끝 빛 · 붉은 금
        y0 = int(RIDGE[x])
        h_ = int(3 + rn[x] * 9 + (3 if x % 17 == 5 else 0))
        if 82 <= x <= 96: h_ = 1
        for j in range(h_):
            yy = y0 - j
            if not (0 <= yy < H): continue
            c = '#2a2230' if (x + j) % 5 else '#322838'
            if x % 3 == 0 and j < h_ - 1: c = '#1e1824'
            if j == h_ - 1: c = '#4a3e56'
            cv.px(x, yy, c)
        cv.px(x, y0 - h_, '#141018')
        if x % 11 == 3 and h_ > 4:
            for j in range(2, h_ - 1): cv.px(x, y0 - j, '#c8402a' if j % 2 else '#f0602a')
    swamp = blob(44, 224, 34, 12, 91, 0.3, 6) & DEMON
    tones(cv, swamp, ['#16281e', '#1e3424', '#284430'], fbm(10), [0.45, 0.6])
    for (x, y) in poisson(swamp & ~clear, 6, 92, 800):
        if (x + y) % 3 == 0: cv.stamp(x, y + 1, DEADT, dict(k='#0e1410'))
        else: cv.rect(x - 2, y, 5, 1, '#3a6a4a'); cv.px(x, y - 1, '#5a8a5a')
    barren = blob(122, 226, 36, 11, 93, 0.3, 6) & DEMON
    tones(cv, barren, ['#3a2a26', '#4a342c', '#5a4034'], fbm(11), [0.45, 0.6])
    lr = np.random.default_rng(94)
    for _ in range(14):
        x, y = lr.integers(90, 156), lr.integers(214, 236)
        if not barren[y, x] or clear[y, x]: continue
        for t in range(lr.integers(3, 8)):
            cv.px(x + t, y + (t // 2) % 2, '#f08a30' if t % 2 else '#ffd040')
    kx, ky = 200, 230
    for (tx_, th, tw) in [(184, 13, 5), (191, 19, 6), (199, 25, 6), (207, 18, 6), (214, 12, 5)]:
        cv.rect(tx_, ky - th, tw, th, '#100c16'); cv.rect(tx_, ky - th, 1, th, '#2a2234')
        for j in range(3): cv.rect(tx_ + j, ky - th - 1 - j, tw - 2 * j, 1, '#100c16')
        cv.px(tx_ + tw // 2, ky - th + 4, '#e03a2a')
    cv.rect(182, ky, 38, 3, '#100c16')
    mist = DEMON & (((YY * 2 + XX // 2).astype(int) % 7) == 0) & (BY < 0.4)
    cv.a[mist] = cv.a[mist] * 0.6 + hx('#7a5a8a') * 0.4
    # ── 나침반 (북쪽 화살 · 고리) ──
    ox, oy = 12, 13
    ring = (np.abs(np.hypot(XX - ox, YY - oy) - 6.5) < 0.8)
    cv.a[ring] = cv.a[ring] * 0.3 + hx('#f0e8c8') * 0.7
    for j in range(6):
        cv.rect(ox - (j // 2), oy - 6 + j, 1 + 2 * (j // 2), 1, '#d84a3a')
    for j in range(5):
        cv.rect(ox - (2 - j // 2), oy + j, 1 + 2 * (2 - j // 2), 1, '#f0e8c8')
    for (x, y) in [(ox - 2, oy - 12), (ox - 2, oy - 11), (ox - 2, oy - 10), (ox - 2, oy - 9), (ox + 1, oy - 12), (ox + 1, oy - 11), (ox + 1, oy - 10), (ox + 1, oy - 9), (ox - 1, oy - 11), (ox, oy - 10)]: cv.px(x, y, '#f0e8c8')   # N
    # ── 테두리 ──
    cv.rect(0, 0, W, 1, '#1a1208'); cv.rect(0, H - 1, W, 1, '#1a1208'); cv.rect(0, 0, 1, H, '#1a1208'); cv.rect(W - 1, 0, 1, H, '#1a1208')
    return cv.img()


if __name__ == '__main__':
    im = draw(); z = int(sys.argv[2]) if len(sys.argv) > 2 else 2
    im.resize((W * z, H * z), Image.NEAREST).save(sys.argv[1])
