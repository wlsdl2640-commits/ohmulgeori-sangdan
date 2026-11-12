"""지도 시안 A — 양피지 고지도 (잉크 선 · 옅은 물감 · 그림 기호): python3 map_a.py <출력.png> [배율]"""
import sys
import numpy as np
from PIL import Image
from geo66 import *
from map_b import Cv, tones, poisson, BY

INK, INK2, INK3 = '#4a3420', '#7a5a3a', '#9a7e5a'


def wash(cv, m, c, a):
    cv.a[m] = cv.a[m] * (1 - a) + hx(c) * a


def outline(cv, m, c, out=True):
    e = (ndi.binary_dilation(m) & ~m) if out else (m & ~ndi.binary_erosion(m))
    cv.fill(e, c)


def tri(cv, x, y, w, h, fill, hatch, ink=INK, cap=None, capH=0.0):
    """잉크 산: 테두리 · 왼쪽 밝게 · 오른쪽 빗금"""
    for j in range(h):
        yy = y - h + 1 + j
        hw = (j + 1) * w / (2 * h)
        xl, xr = int(round(x - hw)), int(round(x + hw))
        for xx in range(xl, xr + 1):
            c = fill
            if xx > x and (xx + yy) % 2 == 0: c = hatch
            if cap and j < h * capH: c = cap if xx <= x else (hatch if (xx + yy) % 2 == 0 else cap)
            if xx in (xl, xr): c = ink
            cv.px(xx, yy, c); cv.occ[max(0, min(H - 1, yy)), max(0, min(W - 1, xx))] = True
    cv.px(x, y - h, ink)


TREE_A = ['.ooo.', 'oGGgo', 'oGggo', '.ooo.', '..t..', '.ttt.']
TOMB_A = ['.oo.', 'oPPo', 'oPPo', 'oooo']
DEAD_A = ['o.o.o', '.ooo.', '..o..', '..o..']
REED = ['o.o', 'o.o', '.o.']


def draw():
    cv = Cv(); clear = keep_clear()
    # ── 양피지 바탕: 얼룩 · 가장자리 그을림 ──
    tones(cv, np.ones((H, W), bool), ['#d6bc88', '#e0c898', '#ead6aa', '#f2e2bc'], fbm(101, ((40, 0.5), (14, 0.3), (5, 0.2))), [0.36, 0.5, 0.64])
    ed = np.minimum(np.minimum(XX, W - 1 - XX), np.minimum(YY, H - 1 - YY))
    for d_, a in [(0, 0.55), (1, 0.4), (2, 0.28), (3, 0.18), (4, 0.1)]:
        m = (ed <= d_ + 0.5) & (ed >= d_ - 0.5)
        wash(cv, m, '#8a6a42', a)
    sr = np.random.default_rng(7)
    for _ in range(6):   # 얼룩
        x, y, r_ = sr.integers(20, 220), sr.integers(10, 200), sr.integers(5, 12)
        m = blob(x, y, r_, r_ * 0.7, 200 + _, 0.4, 3)
        wash(cv, m & (BY < 0.5), '#b89868', 0.25)
    # ── 바다: 옅은 물감 + 가로 빗금 + 바닷가 물결 선 ──
    wash(cv, SEA, '#9ab4b0', 0.55)
    dl = ndi.distance_transform_edt(SEA)
    hatch = SEA & (YY.astype(int) % 3 == 0) & (((XX + YY * 2).astype(int) % 7) < 4) & (dl > 2)
    cv.fill(hatch, '#7a9690')
    for d_, c in [(3, INK3), (6, '#a89a7a')]:
        rip = SEA & (np.abs(dl - d_) < 0.5) & ((XX.astype(int) + YY.astype(int)) % 3 != 0)
        cv.fill(rip, c)
    # ── 땅 물감 ──
    wash(cv, FOREST, '#7a9a56', 0.45); wash(cv, MOUNT, '#b0a080', 0.35); wash(cv, SNOW, '#fbf8f0', 0.75); wash(cv, DESERT, '#e8cc84', 0.45)
    wash(cv, CANYON, '#d0905e', 0.45); wash(cv, GRAVE, '#9a968c', 0.4); wash(cv, LAND & ~(FOREST | MOUNT | SNOW | DESERT | CANYON | GRAVE), '#b8c47a', 0.22)
    wash(cv, DEMON, '#3a2a28', 0.72)
    for m in (SEA,):
        outline(cv, m, INK, out=False)
    for m, c in [(FOREST, '#5a6a3a'), (DESERT, '#9a7a4a'), (CANYON, '#8a5a3a'), (SNOW, '#8a8a8a'), (GRAVE, '#6a6a6a')]:
        e = m & ~ndi.binary_erosion(m) & ((XX.astype(int) + YY.astype(int)) % 2 == 0)
        cv.fill(e, c)
    # ── 강 (파란 잉크) · 길 (붉은 잉크 점선) ──
    riv = np.zeros((H, W), bool)
    for cells in (RIVER1, RIVER2):
        for (x, y) in cells:
            if 0 <= x < W and 0 <= y < H and not SEA[y, x]: cv.px(x, y, '#3a5a7a'); cv.px(x + 1, y, '#6a8aa0'); riv[y, x] = True
    road = np.zeros((H, W), bool)
    for cells in road_cells():
        for i, (x, y) in enumerate(cells):
            if 0 <= x < W and 0 <= y < H:
                road[y, x] = True
                if i % 4 < 2 and not SEA[y, x]: cv.px(x, y, '#9a3a24' if not DEMON[y, x] else '#c8a888')
    for i, (x, y) in enumerate(FRAMA_BRIDGE):
        if i % 2 == 0: cv.px(x, y, INK)
    cv.occ |= road | riv | clear
    # ── 숲: 둥근 나무 기호 ──
    for (x, y) in sorted(poisson(FOREST & ~road & ~riv & ~clear, 5.2, 11, 6000), key=lambda p: p[1]):
        cv.stamp(x, y + 2, TREE_A, dict(o=INK, G='#6a9a48', g='#4e7a38', t=INK))
    # ── 산 · 눈 산 ──
    for i, (x, y) in enumerate(sorted(poisson(MOUNT & ~road & ~clear, 9, 21, 4000), key=lambda p: p[1])):
        h = 7 + (i * 5) % 6; tri(cv, x, y + 3, int(h * 1.6), h, '#e4d2a8', INK2, INK, '#f8f2e4' if h >= 11 else None, 0.3)
    for i, (x, y) in enumerate(sorted(poisson(SNOW & ~road & ~clear & (YY < 70), 11, 31, 3000), key=lambda p: p[1])):
        h = 9 + (i * 3) % 6; tri(cv, x, y + 3, int(h * 1.5), h, '#fffcf4', '#8a9ab0', '#4a5a70', '#ffffff', 0.4)
    # ── 화산 ──
    tri(cv, 158, 28, 30, 18, '#6a5a50', '#3a2e2a', INK)
    cv.rect(156, 10, 5, 2, '#d8482a'); cv.rect(157, 9, 3, 1, '#f0a040')
    for k in range(10): cv.px(157 + int(2 * np.sin(k * 0.8)), 7 - k // 2 * 1 - (k % 2), INK2)
    # ── 사막: 모래 언덕 줄 · 점 ──
    for (x, y) in poisson(DESERT & ~road & ~clear, 9, 41, 3000):
        if cv.occ[y, x]: continue
        for k in range(-3, 4): cv.px(x + k, y - int(round(1.6 * (1 - (k / 3.5) ** 2))), INK2)
    st = DESERT & ~cv.occ & (np.random.default_rng(42).random((H, W)) < 0.05)
    cv.fill(st, INK3)
    oas = blob(188, 172, 6, 3.5, 44, 0.15, 3); wash(cv, oas, '#6a9ab8', 0.8); outline(cv, oas, INK)
    # ── 협곡: 등고선 ──
    rms = np.random.default_rng(64)   # 잉크 메사: 평평한 꼭대기 · 오른쪽 빗금 벼랑
    for (x, y) in sorted(poisson(CANYON & ~road & ~clear & (ndi.distance_transform_edt(CANYON) > 4), 12, 65, 2000), key=lambda p: p[1]):
        if cv.occ[y, x]: continue
        w = int(rms.integers(7, 12)); fh = int(rms.integers(4, 6))
        for j in range(fh + 1):
            xl, xr = x - w // 2 - j // 2, x - w // 2 + w - 1 + j // 2
            for xx in range(xl, xr + 1):
                c = INK if (j == 0 or j == fh or xx in (xl, xr)) else ('#e8c090' if j == 1 else ('#c88a5a' if (xx + j) % 2 or xx < x else INK2))
                cv.px(xx, y - fh + j, c)
        cv.occ[max(0, y - fh - 1):y + 1, max(0, x - w // 2 - 3):x + w // 2 + 4] = True
    for (wx, wy, L) in [(160, 82, 10), (186, 100, 12), (168, 108, 8)]:   # 바람 줄기
        for t in range(L):
            if t % 4 != 3: cv.px(wx + t, wy - int(round(2 * np.sin(t / L * np.pi))), INK2)
    for (x, y) in RIVER2:
        if 0 <= x < W and 0 <= y < H and CANYON[y, x]: cv.px(x, y - 1, INK); cv.px(x, y + 2, INK)
    # ── 묘지: 비석 · 죽은 나무 ──
    for (x, y) in poisson(GRAVE & ~road & ~clear, 6, 51, 1500):
        if cv.occ[y, x]: continue
        if (x + y) % 4 == 0: cv.stamp(x, y + 1, DEAD_A, dict(o=INK))
        else: cv.stamp(x, y + 1, TOMB_A, dict(o=INK, P='#d8d4c8'))
    # ── 세계수 ──
    tx, ty = 76, 34
    for k in range(7):
        a = -0.1 + k / 6 * (np.pi + 0.2)
        for t in range(12): cv.px(tx + np.cos(a) * t * 1.2, ty + 1 + np.sin(a) * t * 0.5, INK)
    cv.rect(tx - 2, ty - 18, 5, 19, '#a07a4a'); cv.rect(tx - 3, ty - 18, 1, 19, INK); cv.rect(tx + 3, ty - 18, 1, 19, INK)
    can = (((XX - tx) / 18) ** 2 + ((YY - 12) / 10) ** 2 + (fbm(62) - 0.5) * 0.5 < 1)
    wash(cv, can, '#5a8a40', 0.85); outline(cv, can, INK)
    for (x, y) in poisson(can, 4, 63, 400): cv.stamp(x, y, ['.o.', 'ogo'], dict(o=INK, g='#3e6a30'), mark=False)
    # ── 하르겐 ──
    cx, cy = CITY
    wallm = (((XX - cx) / 16) ** 2 + ((YY - cy) / 10) ** 2 <= 1)
    wash(cv, wallm, '#e8dcc0', 0.6); outline(cv, wallm, INK, out=False)
    for (x, y) in poisson(wallm & ~ndi.binary_erosion(wallm, iterations=2), 3.5, 71, 300): cv.rect(x - 1, y - 1, 3, 3, INK)
    for (x, y) in poisson(ndi.binary_erosion(wallm, iterations=3), 3.4, 72, 500):
        cv.rect(x - 1, y - 1, 3, 1, '#b8482a'); cv.px(x - 1, y, INK); cv.px(x + 1, y, INK)
    # ── 뒷골목 · 지하수로 · 길드 ──
    ax_, ay_ = NODES['alley']
    for (x, y) in poisson(disk(ax_, ay_ + 2, 9) & LAND & ~road, 3.2, 81, 400):
        cv.rect(x - 1, y - 1, 3, 1, INK2); cv.px(x - 1, y, INK); cv.px(x + 1, y, INK)
    sx_, sy_ = NODES['sewer']
    cv.rect(sx_ - 4, sy_ - 2, 8, 4, INK); cv.rect(sx_ - 3, sy_ - 1, 6, 2, '#2a1e14')
    gx, gy = GUILD; cv.rect(gx - 4, gy - 3, 8, 5, '#3a2a2a'); cv.rect(gx - 5, gy - 4, 10, 1, INK)
    # ── 왕국 성 (잉크 성 + 왕국 깃발) ──
    for k, (x, y) in KINGS.items():
        c, c2 = KCOL[k]
        if k == 'frama': wash(cv, FRAMA_I & ~SEA, '#e8d8b0', 0.7); outline(cv, FRAMA_I & ~SEA, INK, out=False)
        cv.rect(x - 7, y - 4, 14, 8, '#f0e4c8'); cv.rect(x - 9, y - 9, 4, 13, '#f0e4c8'); cv.rect(x + 5, y - 9, 4, 13, '#f0e4c8'); cv.rect(x - 1, y - 12, 3, 16, '#f0e4c8')
        for (rx_, ry_, rw, rh) in [(x - 7, y - 4, 14, 8), (x - 9, y - 9, 4, 13), (x + 5, y - 9, 4, 13), (x - 1, y - 12, 3, 16)]:
            cv.rect(rx_, ry_, rw, 1, INK); cv.rect(rx_, ry_ + rh - 1, rw, 1, INK); cv.rect(rx_, ry_, 1, rh, INK); cv.rect(rx_ + rw - 1, ry_, 1, rh, INK)
        for tx_ in (x - 9, x + 5): cv.px(tx_ + 1, y - 10, INK); cv.px(tx_ + 2, y - 10, INK)
        cv.rect(x - 2, y, 4, 4, INK)
        cv.rect(x, y - 18, 1, 6, INK); cv.rect(x + 1, y - 18, 5, 3, c); cv.px(x + 6, y - 17, c); cv.rect(x + 1, y - 16, 5, 1, c2)
    # ── 바다 위 배 · 바다뱀 ──
    for (bx, by) in [(30, 172), (8, 190)]:
        cv.rect(bx - 4, by, 9, 1, INK); cv.rect(bx - 3, by + 1, 7, 1, INK); cv.rect(bx, by - 6, 1, 6, INK)
        for j in range(5): cv.rect(bx + 1, by - 6 + j, 4 - j, 1, '#f4ecd8'); cv.px(bx + 5 - j, by - 6 + j, INK)
    for k in range(14):   # 물결 위 바다뱀 등
        x = 40 + k; y = 196 - int(round(2 * np.sin(k * 0.9)))
        if SEA[y, x]: cv.px(x, y, '#3a5a4a'); cv.px(x, y + 1, INK)
    # ── 마계: 들쭉날쭉한 잉크 선 · 붉은 잉크 ──
    for x in range(W):
        y0 = int(RIDGE[x]); cv.px(x, y0, INK); cv.px(x, y0 - 1, INK2)
        if x % 5 == 0 and not (82 <= x <= 96): cv.px(x, y0 - 2, INK)
    sw = blob(44, 224, 34, 12, 91, 0.3, 6) & DEMON; wash(cv, sw, '#2e4a34', 0.5)
    for (x, y) in poisson(sw & ~clear, 5, 92, 800): cv.stamp(x, y + 1, REED, dict(o='#8a9a7a'))
    ba = blob(122, 226, 36, 11, 93, 0.3, 6) & DEMON; wash(cv, ba, '#5a3a2a', 0.5)
    lr = np.random.default_rng(94)
    for _ in range(12):
        x, y = lr.integers(92, 154), lr.integers(214, 236)
        if ba[y, x] and not clear[y, x]:
            for t in range(lr.integers(3, 7)): cv.px(x + t, y + (t // 2) % 2, '#c8482a')
    kx, ky = 200, 230
    for (tx_, th, tw) in [(186, 12, 4), (192, 17, 5), (199, 22, 5), (206, 16, 5), (213, 11, 4)]:
        cv.rect(tx_, ky - th, tw, th, '#1e1614'); cv.rect(tx_ + tw // 2, ky - th - 3, 1, 3, '#1e1614'); cv.px(tx_ + tw // 2, ky - th + 3, '#d84a2a')
    # ── 나침반 · 테두리 장식 ──
    ox, oy = 13, 14
    ring = np.abs(np.hypot(XX - ox, YY - oy) - 7) < 0.6
    cv.fill(ring, INK)
    for j in range(7): cv.rect(ox - (j // 2), oy - 7 + j, 1 + 2 * (j // 2), 1, '#9a3a24')
    for j in range(6): cv.rect(ox - (2 - j // 2), oy + j, 1 + 2 * (2 - j // 2), 1, '#f2e6c8'); cv.px(ox - (2 - j // 2), oy + j, INK); cv.px(ox + (2 - j // 2), oy + j, INK)
    for (x, y) in [(ox - 2, oy - 13), (ox - 2, oy - 12), (ox - 2, oy - 11), (ox - 2, oy - 10), (ox + 1, oy - 13), (ox + 1, oy - 12), (ox + 1, oy - 11), (ox + 1, oy - 10), (ox - 1, oy - 12), (ox, oy - 11)]: cv.px(x, y, INK)   # N
    for d_ in (1, 3):
        cv.rect(d_, d_, W - 2 * d_, 1, INK); cv.rect(d_, H - 1 - d_, W - 2 * d_, 1, INK); cv.rect(d_, d_, 1, H - 2 * d_, INK); cv.rect(W - 1 - d_, d_, 1, H - 2 * d_, INK)
    for (x, y) in [(3, 3), (W - 4, 3), (3, H - 4), (W - 4, H - 4)]:
        for (dx, dy) in [(0, -2), (-1, -1), (1, -1), (-2, 0), (2, 0), (-1, 1), (1, 1), (0, 2), (0, 0)]: cv.px(x + dx, y + dy, '#9a3a24' if (dx, dy) == (0, 0) else INK)   # 마름모 (십자 꼴 피함)
    return cv.img()


if __name__ == '__main__':
    im = draw(); z = int(sys.argv[2]) if len(sys.argv) > 2 else 2
    im.resize((W * z, H * z), Image.NEAREST).save(sys.argv[1])
