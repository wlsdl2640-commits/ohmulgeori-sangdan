# 픽이 뽑은 궁수 동작 띠에서 화살 앞끝을 모두 같은 쇠 마름모 화살촉으로 바꿔 그린다(가로 · 비스듬한 화살 모두). 몸 · 활 · 화살대 · 뒤끝 깃은 건드리지 않는다.
#   python3 fix_arrowhead.py <띠 png> <출력 png>   → 고친 장 번호(장, 촉 수)를 찍는다
# 찾는 법: 화살대 색(주황 · 붉은 줄)에서 곧은 선분을 찾는다(cv2 HoughLinesP · 길이 12+). 오른쪽을 향한 방향이 위로 65° ~ 아래로 42° 사이인 것만(활대는 화살과 직각이라 빠진다).
#          같은 화살의 겹친 선분은 하나로 묶고, 오른쪽 끝 앞쪽의 밝은 칸 · 검은 테(옛 촉 · 잘못 붙은 깃)를 지운 뒤 화살 방향으로 놓인 마름모를 그린다.
import sys, math
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage
src, out = sys.argv[1], sys.argv[2]; MULTI = 'multi' in sys.argv; C = 156          # multi = 화살 여러 발이 나란히 붙은 띠(세 발 동시에 쏘기)
K, L, W, Dk = (6, 6, 8, 255), (200, 208, 216, 255), (255, 255, 255, 255), (132, 142, 156, 255)
HL, HW = 5.2, 3.2          # 마름모 반 길이(화살 방향) · 반 너비
def head(a, px, py, ux, uy):          # (px, py) = 화살대 끝, (ux, uy) = 화살 방향 → 끝에서 앞으로 HL만큼이 마름모 가운데
    cx, cy = px + ux * HL, py + uy * HL; ins = {}
    for y in range(int(cy - 8), int(cy + 9)):
        for x in range(int(cx - 8), int(cx + 9)):
            if not (0 <= x < C and 0 <= y < C): continue
            dx, dy = x + 0.5 - cx - 0.5, y + 0.5 - cy - 0.5; al = dx * ux + dy * uy; pe = -dx * uy + dy * ux
            if abs(al) / HL + abs(pe) / HW <= 1.0: ins[(x, y)] = (al, pe)
    for (x, y), (al, pe) in ins.items():
        edge = any((x + i, y + j) not in ins for i, j in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        a[y, x] = K if edge else (W if pe < -0.4 and al < 0.5 and abs(al) < 1.6 else (Dk if pe > 0.9 else L))
im = Image.open(src).convert('RGBA'); A = np.asarray(im).copy(); n = A.shape[1] // C; fixed = []
for f in range(n):
    a = A[:, f * C:(f + 1) * C]; op = a[..., 3] > 0; R, G, B = (a[..., i].astype(int) for i in range(3))
    shaft = op & (((R >= 200) & (G >= 60) & (G <= 150) & (B <= 70)) | ((R >= 140) & (G <= 70) & (B <= 70)))
    lite = op & (((R >= 200) & (G >= 180) & (B >= 140)) | ((G >= 180) & (R >= 100) & (B >= 140)))
    dark = op & (R + G + B < 70)
    ln = cv2.HoughLinesP(shaft.astype(np.uint8) * 255, 1, np.pi / 180, threshold=7, minLineLength=10, maxLineGap=6)
    arrows = []; llab, _ = ndimage.label(lite, structure=np.ones((3, 3))); lsz = np.bincount(llab.ravel())
    for x1, y1, x2, y2 in ([] if ln is None else ln.reshape(-1, 4).tolist()):
        if x2 < x1: x1, y1, x2, y2 = x2, y2, x1, y1
        d = math.hypot(x2 - x1, y2 - y1); ux, uy = (x2 - x1) / d, (y2 - y1) / d; ang = math.degrees(math.atan2(uy, ux))
        if not -65 <= ang <= 42: continue
        # 가는 줄인지: 선분 가운데쯤에서 직각 방향으로 화살대 색이 3칸 넘게 이어지면 활대 · 옷
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2; th = sum(1 for t in range(-2, 3) if 0 <= int(round(my + ux * t)) < C and 0 <= int(round(mx - uy * t)) < C and shaft[int(round(my + ux * t)), int(round(mx - uy * t))])
        if th > 4: continue
        for o in arrows:          # 같은 화살(방향이 비슷하고 한 줄 위)이면 더 오른쪽 끝을 남김
            if abs(o[4] - ang) < 12 and abs(-(x2 - o[0]) * o[3] + (y2 - o[1]) * o[2]) < 2.6:
                if x2 * ux + y2 * uy > o[0] * ux + o[1] * uy: o[0], o[1] = x2, y2
                o[5] = max(o[5], d)
                break
        else: arrows.append([x2, y2, ux, uy, ang, d])
    cxs = np.where(op.any(0))[0]; bodyx = np.average(np.arange(C), weights=op.sum(0)) if len(cxs) else 0          # 몸 가운데 x — 화살 앞끝은 그보다 앞(오른쪽)
    good = []
    for x2, y2, ux, uy, ang, d in sorted(arrows, key=lambda o: -o[5]):          # 끝을 화살대 색이 이어지는 데까지 밀고, 앞쪽에 밝은 칸(옛 촉)이 있어야 화살 앞끝
        px, py = float(x2), float(y2)
        for _ in range(14):
            qx, qy = int(round(px + ux)), int(round(py + uy))
            if 0 <= qx < C and 0 <= qy < C and shaft[max(qy - 1, 0):qy + 2, max(qx - 1, 0):qx + 2].any(): px, py = px + ux, py + uy
            else: break
        ahead = [(int(round(px + ux * t - uy * s)), int(round(py + uy * t + ux * s))) for t in range(1, 15) for s in range(-4, 5)]
        ahead = [(x, y) for x, y in ahead if 0 <= x < C and 0 <= y < C]
        if sum(lite[y, x] for x, y in ahead) < 3 or px < bodyx + 8: continue
        if any(abs(px - g[0]) + abs(py - g[1]) < 4 for g in good): continue
        good.append((px, py, ux, uy, ahead))
        if not MULTI: break          # 화살 한 발짜리 동작은 가장 긴 선분 하나만
    if MULTI and len(good) < 2 and len(cxs):          # 나란히 붙은 화살: 맨 오른쪽 밝은 뭉치를 통째로 지우고 화살대 줄마다 찍는다
        xm = cxs[-1]; rows = np.where(lite[:, max(xm - 12, 0):xm + 1].any(1))[0]
        if len(rows) and 8 <= rows[-1] - rows[0] <= 26 and xm >= 30:
            r0, r1 = rows[0], rows[-1]; ys = np.where(shaft[r0 - 1:r1 + 2, xm - 16:xm - 12].any(1))[0] + r0 - 1
            cs = [int(round(g.mean())) for g in np.split(ys, np.where(np.diff(ys) > 1)[0] + 1)] if len(ys) else []
            if 2 <= len(cs) <= 3:
                reg = (slice(r0 - 1, r1 + 2), slice(xm - 12, xm + 1)); a[reg][lite[reg] | dark[reg]] = 0
                for y in cs:
                    pat = a[y - 1:y + 2, xm - 14].copy()
                    for x in range(xm - 13, xm - 10): a[y - 1:y + 2, x] = pat
                    head(a, xm - 10.5, y, 1.0, 0.0)
                fixed.append((f, len(cs))); continue
    for px, py, ux, uy, ahead in good:          # 먼저 다 지우고
        for x, y in ahead:
            if lite[y, x] or dark[y, x]: a[y, x] = 0
        for t in range(-12, 1):          # 화살대 끝 둘레에 잘못 붙은 깃(작은 밝은 덩어리)도 지우고 화살대 테를 다시 그림
            for s_ in range(-4, 5):
                x, y = int(round(px + ux * t - uy * s_)), int(round(py + uy * t + ux * s_))
                if 0 <= x < C and 0 <= y < C and lite[y, x] and lsz[llab[y, x]] < 70:
                    a[y, x] = K if abs(s_) == 1 else (0, 0, 0, 0)
    for px, py, ux, uy, ahead in good: head(a, px, py, ux, uy)          # 그다음 찍는다
    if good: fixed.append((f, len(good)))
Image.fromarray(A).save(out); print(src.split('/')[-1], '고친 장(장, 촉 수):', fixed)
