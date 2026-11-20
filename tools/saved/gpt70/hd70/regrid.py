# 받은 몬스터 판을 줄 · 칸마다 떼어 넉넉한 격자에 다시 놓는다 (11-20 — 장끼리 닿거나 옆 칸으로 넘어간 판을 extract_mon.py가 읽을 수 있게)
#   칸 경계 = 줄 너비를 n으로 나눈 자리에서 ±R 안의 가장 빈 세로줄. 경계에 걸친 그림은 거기서 자르고, 잘려서 생긴 작은 조각(옆 칸으로 넘어온 채찍 끝 같은 것)은 버린다.
#   python3 regrid.py <받은 판(들 — 위아래로 붙임)> <출력> <줄마다 장 수, 쉼표> [tight]
import sys, numpy as np
from PIL import Image
from scipy import ndimage
MAG = (255, 0, 255)
def bgmask(a, tight):
    R, G, B = [a[..., i].astype(int) for i in range(3)]
    hue = (R - G > 45) & (B - G > 45) & (np.abs(R - B) < 80)   # 마젠타 빛깔 (밝기와 상관없이 — 검은 테두리와 섞인 어두운 자주 테도)
    core = (R > 185) & (B > 185) & (G < 115)
    if not tight: return hue
    return core | (hue & ndimage.binary_dilation(core, iterations=2))   # tight: 몸 안의 분홍(날개 · 혀)은 두고, 바탕에 닿은 두 칸의 자주 테만 뺀다
def rows_of(fg):
    r = fg.mean(1) > 0.004; segs = []; s = None
    for y, v in enumerate(r):
        if v and s is None: s = y
        if not v and s is not None:
            if y - s > 40: segs.append((s, y - 1))
            s = None
    if s is not None and len(r) - s > 40: segs.append((s, len(r) - 1))
    return segs
def regrid(srcs, out, ns, tight=False, R=40, drop=()):
    cells = []; rep = []
    for src in srcs:
        a = np.array(Image.open(src).convert('RGB')); fg = ~bgmask(a, tight); W = a.shape[1]
        for (y0, y1) in rows_of(fg):
            n = ns[len(cells)]; sub = fg[y0:y1 + 1].copy(); dens = sub.sum(0); cuts = []
            for i in range(1, n):
                c = int(round(i * W / n)); lo, hi = max(0, c - R), min(W - 1, c + R); x = lo + int(np.argmin(dens[lo:hi + 1] + np.abs(np.arange(lo, hi + 1) - c) * 0.02)); cuts.append(x)
                if dens[x] > 0: sub[:, x:x + 2] = False
            lb, nb = ndimage.label(sub, structure=np.ones((3, 3))); objs = ndimage.find_objects(lb); bounds = [0] + cuts + [W]; slots = [[] for _ in range(n)]; areas = []
            for k, sl in enumerate(objs):
                m = lb[sl] == k + 1; ar = int(m.sum()); xs = np.where(m.any(0))[0] + sl[1].start; cx = float((m.sum(0) * (np.arange(m.shape[1]) + sl[1].start)).sum() / ar)
                j = min(n - 1, max(0, int(np.searchsorted(bounds, cx) - 1))); touch = any(abs(xs[0] - (c + 2)) <= 1 or abs(xs[-1] - (c - 1)) <= 1 for c in cuts if dens[c] > 0)
                slots[j].append((k + 1, ar, touch)); areas.append(ar)
            row = []
            for j in range(n):
                tot = sum(ar for _, ar, _ in slots[j]); keep = [k for k, ar, t in slots[j] if not (t and ar < 0.22 * tot)] if tot else []
                if not keep: rep.append('빈 칸 %d/%d' % (len(cells), j)); row.append(None); continue
                m = np.isin(lb, keep); ys, xs = np.where(m); x0, x1 = xs.min(), xs.max(); im = np.zeros((y1 - y0 + 1, x1 - x0 + 1, 3), np.uint8); im[:] = MAG; mm = m[:, x0:x1 + 1]; im[mm] = a[y0:y1 + 1, x0:x1 + 1][mm]; row.append(im)
            row = [r for j, r in enumerate(row) if r is not None and (len(cells), j) not in drop]
            cells.append(row); rep.append('줄 %d: %d장 (자른 경계 %d)' % (len(cells) - 1, len(row), sum(1 for c in cuts if dens[c] > 0)))
    cw = max(r.shape[1] for row in cells for r in row) + 44; ch = [max(r.shape[0] for r in row) + 44 for row in cells]; nmax = max(len(r) for r in cells)
    S = np.zeros((sum(ch), cw * nmax, 3), np.uint8); S[:] = MAG; y = 0
    for row, h in zip(cells, ch):
        for j, r in enumerate(row): x = j * cw + (cw - r.shape[1]) // 2; S[y + 22:y + 22 + r.shape[0], x:x + r.shape[1]] = r
        y += h
    Image.fromarray(S).save(out, lossless=True); return rep, [len(r) for r in cells]
if __name__ == '__main__':
    srcs = sys.argv[1].split(','); print(regrid(srcs, sys.argv[2], [int(v) for v in sys.argv[3].split(',')], len(sys.argv) > 4))
