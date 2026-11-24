# 픽이 뽑은 궁수 동작 띠에서, 가로로 놓인 화살(활에 걸렸거나 날아가는)의 앞끝을 쇠 마름모 화살촉으로 바꿔 그린다. 몸 · 활 · 화살대는 건드리지 않는다.
#   python3 fix_arrowhead.py <띠 png> <출력 png> [한 장 너비 156]   → 고친 장 번호를 찍는다
# 찾는 법: 화살대 = 주황 · 붉은 한 줄이 가로로 10칸 넘게 이어지고 위아래가 검은 테(또는 빈 칸)인 줄(활대는 휘어 있어 걸리지 않는다).
#          그 오른쪽 끝에서 밝은 칸(흰 · 크림 · 옅은 청록)이 이어지는 데까지가 지금의 촉 → 밝은 칸과 검은 테만 지우고 촉 도장을 찍는다.
import sys
import numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; MULTI = 'multi' in sys.argv; C = 156          # multi = 화살 여러 발이 붙어 나란한 띠(세 발 동시에 쏘기)
K, L, W, Dk = (6, 6, 8, 255), (200, 208, 216, 255), (255, 255, 255, 255), (132, 142, 156, 255)
STAMP = ['....KK....', '...KWLK...', '.KKWLLLKK.', 'KDLLLLLLLK', '.KKDDDDKK.', '...KDDK...', '....KK....']          # 오른쪽 끝이 촉 끝 · 가운데 줄이 화살대 줄
COL = {'K': K, 'L': L, 'W': W, 'D': Dk}
im = Image.open(src).convert('RGBA'); A = np.asarray(im).copy(); n = A.shape[1] // C; fixed = []
for f in range(n):
    a = A[:, f * C:(f + 1) * C]; op = a[..., 3] > 0; R, G, B = (a[..., i].astype(int) for i in range(3))
    shaft = op & (((R >= 200) & (G >= 60) & (G <= 150) & (B <= 70)) | ((R >= 140) & (G <= 70) & (B <= 70)))
    dark = ~op | (R + G + B < 70)
    lite = op & (((R >= 200) & (G >= 180) & (B >= 140)) | ((G >= 180) & (R >= 100) & (B >= 140)))
    if MULTI:          # 맨 오른쪽 밝은 덩어리(촉 뭉치)를 통째로 지우고, 그 왼쪽에서 화살대 줄들을 찾아 줄마다 촉을 찍는다
        xs = np.where(op.any(0))[0]
        if not len(xs): continue
        xm = xs[-1]; zone = lite[:, max(xm - 12, 0):xm + 1]; rows = np.where(zone.any(1))[0]
        if not len(rows) or rows[-1] - rows[0] > 26 or rows[-1] - rows[0] < 8 or xm < 30: continue
        r0, r1 = rows[0], rows[-1]; col = shaft[r0 - 1:r1 + 2, xm - 16:xm - 12].any(1); ys = np.where(col)[0] + r0 - 1
        if not len(ys): continue
        groups = np.split(ys, np.where(np.diff(ys) > 1)[0] + 1); cs = [int(round(g.mean())) for g in groups]
        if not 2 <= len(cs) <= 3: continue
        reg = (slice(r0 - 1, r1 + 2), slice(xm - 12, xm + 1)); kill = lite[reg] | (op[reg] & (R[reg] + G[reg] + B[reg] < 70)); a[reg][kill] = 0
        for y in cs:
            pat = a[y - 1:y + 2, xm - 14].copy()
            for x in range(xm - 13, xm - 9): a[y - 1:y + 2, x] = pat
            for r, row in enumerate(STAMP):
                for c, ch in enumerate(row):
                    if ch != '.' and (ch != 'K' or a[y - 3 + r, xm - 9 + c, 3] == 0 or r in (2, 3, 4)): a[y - 3 + r, xm - 9 + c] = COL[ch]
        fixed.append((f, len(cs))); continue
    runs = []
    for y in range(5, C - 5):
        x = 0
        while x < C:
            if shaft[y, x]:
                e = x
                while e + 1 < C and (shaft[y, e + 1] or (e + 2 < C and shaft[y, e + 2])): e += 1
                if e - x >= 10 and (dark[y - 1, x:e + 1] | shaft[y - 1, x:e + 1]).mean() >= 0.8 and (dark[y + 1, x:e + 1] | shaft[y + 1, x:e + 1]).mean() >= 0.8 and (dark[y - 2, x:e + 1].mean() >= 0.6 or dark[y - 1, x:e + 1].mean() >= 0.6) and (dark[y + 2, x:e + 1].mean() >= 0.6 or dark[y + 1, x:e + 1].mean() >= 0.6): runs.append((y, x, e))
                x = e + 1
            else: x += 1
    done = []
    for y, x0, e in runs:
        if any(abs(y - yy) <= 3 for yy in done): continue
        while True:                                                            # 활 · 손에 가려 끊긴 화살대를 오른쪽으로 이어 본다
            nx = [x for x in range(e + 1, min(e + 14, C)) if shaft[y - 1:y + 2, x].any()]
            if not nx: break
            e = nx[0]
            while e + 1 < C and shaft[y - 1:y + 2, e + 1].any(): e += 1
        h = e
        while h + 1 < C and h - e < 15 and (lite[y - 3:y + 4, h + 1].any() or (op[y - 1:y + 2, h + 1] & dark[y - 1:y + 2, h + 1]).any()): h += 1          # 밝은 칸이나 검은 테가 이어지는 데까지
        tip = min(h + 1, C - 1)
        if tip - 9 < 0: continue
        reg = (slice(y - 3, y + 4), slice(e + 1, tip + 1)); kill = lite[reg] | (op[reg] & (R[reg] + G[reg] + B[reg] < 70))
        a[reg][kill] = 0
        pat = a[y - 1:y + 2, max(e - 2, x0)].copy()
        for x in range(e + 1, tip - 9): a[y - 1:y + 2, x] = pat                 # 촉이 짧아진 만큼 화살대를 이어 줌
        for r, row in enumerate(STAMP):
            for c, ch in enumerate(row):
                if ch != '.': a[y - 3 + r, tip - 9 + c] = COL[ch]
        aft = (slice(y - 3, y + 4), slice(tip + 1, min(tip + 15, C)))          # 촉 너머에 남은 옛 촉 조각(밝은 칸 · 검은 테만 있을 때)
        if aft[1].start < C and not (op[aft] & ~lite[aft] & ~(R[aft] + G[aft] + B[aft] < 70)).any(): a[aft] = 0
        done.append(y)
    if done: fixed.append((f, len(done)))
Image.fromarray(A).save(out); print(src.split('/')[-1], '고친 장(장 번호, 촉 수):', fixed)
