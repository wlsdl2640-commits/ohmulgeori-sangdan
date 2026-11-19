"""사이 값 시안: 큰 판 그림(전사 16장 판 · 몬스터 판)을 「점이 굵은」 그림으로 줄이는 도구
   평균으로 줄이면 색이 섞여 흐려지므로(= 첫 리마스터 때 「조잡」), 칸마다
     ① 판 픽셀을 재질 묶음(쇠 · 가죽 · 천 …)과 그 묶음 안의 밝기 단계로 나누고
     ② 칸에서 가장 넓은 재질을 고른 뒤(다수결) 그 재질 픽셀 가운데 밝기가 가운데인 픽셀의 색을 쓰고
     ③ 어두운 테(윤곽선)는 따로 세어 살린다 — 바깥 테가 칸 사이에 걸쳐 사라지면 바깥 칸에 되살린다
   닻(발 · 땅 줄)이 칸 경계에 오게 놓으므로 장마다 흔들리지 않는다."""
import numpy as np, cv2
from PIL import Image
LUM = np.array([0.299, 0.587, 0.114])
DARK_L = 30          # 이보다 어두운 판 픽셀 = 테(윤곽선)


def lab(rgb):
    return cv2.cvtColor(np.ascontiguousarray(rgb, np.uint8).reshape(-1, 1, 3), cv2.COLOR_RGB2LAB).reshape(-1, 3).astype(np.float32)


def flat_pixels(rgb, m, rng=22):
    """판의 「진짜 색」 픽셀: 3×3 가운데값으로 잡티를 지우고, 둘레와 색 차이가 작은 자리만(경계의 섞인 색은 뺀다)"""
    med = cv2.medianBlur(np.ascontiguousarray(rgb, np.uint8), 3)
    mx = cv2.dilate(med, np.ones((3, 3), np.uint8)).astype(np.int16); mn = cv2.erode(med, np.ones((3, 3), np.uint8)).astype(np.int16)
    inner = cv2.erode(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    return med[inner & ((mx - mn).max(-1) < rng)]


class Palette:
    """재질 묶음 G개(색상 · 채도로 묶음) × 묶음마다 밝기 단계 → 팔레트. 번호 0 · 1 = 테(가장 어두운 색 둘)"""
    def __init__(self, samples, groups=12, step=7.5, tones=(2, 7), lw=0.08, seed=7):
        from sklearn.cluster import KMeans
        L = samples @ LUM; fill = samples[L >= DARK_L]; dark = samples[L < DARK_L]; fl = lab(fill)
        # 넓은 재질(투구 · 가죽)에 묶음이 몰리지 않게: (a, b) 칸의 밀도가 높을수록 덜 센다
        ab = (fl[:, 1:] // 4).astype(int); key = ab[:, 0] * 64 + ab[:, 1]; dens = np.bincount(key, minlength=4096)[key]
        self.lw = lw; feat = np.c_[fl[:, 0] * lw, fl[:, 1], fl[:, 2]]
        self.km = KMeans(groups, n_init=6, random_state=seed).fit(feat, sample_weight=1 / np.sqrt(dens))
        g = self.km.labels_; pal = [np.median(dark[(dark @ LUM) < 16], 0) if (dark @ LUM < 16).any() else [8, 4, 6], np.median(dark[(dark @ LUM) >= 16], 0) if (dark @ LUM >= 16).any() else [34, 18, 14]]
        self.edges = []; self.base = []           # 묶음마다: 밝기 경계 · 팔레트 첫 번호
        for k in range(groups):
            px = fill[g == k]; l = fl[g == k, 0] / 2.55
            if len(px) < 30: self.edges.append(np.array([])); self.base.append(len(pal)); pal.append(np.median(px, 0) if len(px) else [128, 128, 128]); continue
            lo, hi = np.percentile(l, [2, 98]); n = int(np.clip(round((hi - lo) / step), *tones))
            k1 = KMeans(n, n_init=4, random_state=seed).fit(l[:, None]); order = np.argsort(k1.cluster_centers_[:, 0]); cen = k1.cluster_centers_[order, 0]
            self.edges.append((cen[1:] + cen[:-1]) / 2); self.base.append(len(pal))
            for t in order: pal.append(np.median(px[k1.labels_ == t], 0))
        self.pal = np.array(pal).round().astype(np.uint8); self.groups = groups
        # 빠른 표: rgb(32단계) → 묶음, 묶음 + 밝기 → 번호
        gr = np.arange(4, 256, 8, dtype=np.uint8); grid = np.stack(np.meshgrid(gr, gr, gr, indexing='ij'), -1).reshape(-1, 3); gl = lab(grid)
        gg = self.km.predict(np.c_[gl[:, 0] * lw, gl[:, 1], gl[:, 2]]); ll = gl[:, 0] / 2.55
        idx = np.array([self.base[a] + int(np.searchsorted(self.edges[a], b)) for a, b in zip(gg, ll)])
        self.lut_g = gg.astype(np.int16).reshape(32, 32, 32); self.lut_i = idx.astype(np.int16).reshape(32, 32, 32)
        self.group_of = np.zeros(len(self.pal), int)
        for k in range(groups): self.group_of[self.base[k]:(self.base[k + 1] if k + 1 < groups else len(self.pal))] = k

    def __call__(self, rgb):
        q = np.asarray(rgb, np.uint8) >> 3
        return self.lut_g[q[..., 0], q[..., 1], q[..., 2]], self.lut_i[q[..., 0], q[..., 1], q[..., 2]]


def nb4(a, fill=False):
    P = np.pad(a, 1, constant_values=fill); return P[:-2, 1:-1], P[2:, 1:-1], P[1:-1, :-2], P[1:-1, 2:]


def down(rgb, m, o, c, P, ta=0.5, tb=0.28, ti=0.5, cw=0.45, rescue=(0.2, 0.55), clean=1, extra=None):
    """rgb · m(덮임) = 판 픽셀 그대로, o = 그림 왼쪽 위의 자리(닻 · 땅 줄에서, 판 픽셀), c = 한 칸의 판 픽셀 수, P = Palette
       → [번호 그림(−1 = 빈 칸), 닻의 칸 자리 (ax, ay)(, extra 덮개가 35% 넘게 덮은 칸)]"""
    pad = int(np.ceil(c)) + 1
    rgb = np.pad(rgb, ((pad, pad), (pad, pad), (0, 0))); m = np.pad(m, pad); h, w = m.shape; ox, oy = o[0] - pad, o[1] - pad
    fx = (ox + np.arange(w) + 0.5) / c; fy = (oy + np.arange(h) + 0.5) / c
    ci = np.floor(fx).astype(int); cj = np.floor(fy).astype(int); i0, j0 = ci.min(), cj.min(); ni, nj = ci.max() - i0 + 1, cj.max() - j0 + 1
    II, JJ = np.meshgrid(ci - i0, cj - j0); flat = (JJ * ni + II).ravel(); NC = ni * nj
    ux, uy = np.abs(fx % 1 - 0.5) * 2, np.abs(fy % 1 - 0.5) * 2          # 칸 가운데 0 … 가장자리 1
    wgt = (np.where(uy > 0.6, cw, 1.0)[:, None] * np.where(ux > 0.6, cw, 1.0)[None]).ravel()   # 가장자리 픽셀은 덜 센다(옆 칸 색이 번져 들어오지 않게)
    cnt = lambda v: np.bincount(flat, np.asarray(v).ravel().astype(np.float64), NC).reshape(nj, ni)
    area = cnt(np.ones_like(m)); cov = cnt(m) / area
    L = rgb @ LUM; dk = m & (L < DARK_L); fill = (m & ~dk).ravel()
    nd = cnt(dk); dfr = nd / np.maximum(cnt(m), 1); dark_i = np.where(cnt(dk * L) / np.maximum(nd, 1) < 16, 0, 1)      # 테 두 색 중 어느 쪽
    G, I = P(rgb); G, I = G.ravel(), I.ravel()
    gh = np.zeros((NC, P.groups)); np.add.at(gh, (flat[fill], G[fill]), wgt[fill]); win = gh.argmax(1); has = (gh.sum(1) > 0).reshape(nj, ni)
    # 이긴 재질의 픽셀 가운데 밝기가 가운데인 픽셀의 번호
    sel = fill & (G == win[flat]); cs, ls, isel = flat[sel], L.ravel()[sel], I[sel]; order = np.lexsort((ls, cs)); cs, isel = cs[order], isel[order]
    start = np.searchsorted(cs, np.arange(NC)); end = np.searchsorted(cs, np.arange(NC), 'right'); mid = np.clip((start + end) // 2, 0, max(len(cs) - 1, 0))
    best = (isel[mid] if len(cs) else np.zeros(NC, int)).reshape(nj, ni)
    op = cov >= ta
    edge = op & ~np.logical_and.reduce(nb4(op))
    dark = op & ((edge & (dfr >= tb)) | (~edge & (dfr >= ti)) | ~has)
    out = np.where(op, np.where(dark, dark_i, best), -1)
    if rescue:   # 바깥 테가 빈 칸 쪽에 걸쳐 사라진 자리: 채움 칸과 붙은 빈 칸에 테가 꽤 있으면 그 칸을 테로
        bare = edge & ~dark; near = np.logical_or.reduce(nb4(bare))
        add = ~op & near & (cov >= rescue[0]) & (dfr >= rescue[1]); out[add] = dark_i[add]; op = op | add
    if clean:
        nn = sum(a.astype(int) for a in nb4(op)); out[op & (nn == 0)] = -1        # 홀로 떨어진 칸
        # 둘레 여덟 칸 어디에도 같은 재질이 없는 채움 칸: 둘레 재질 가운데 이 칸에서도 꽤 넓은 것이 있으면 그 재질로(잡티)
        go = np.where(out >= 2, P.group_of[np.maximum(out, 0)], -1); Pd = np.pad(go, 1, constant_values=-1)
        nbs = np.stack([Pd[1 + dy:1 + dy + nj, 1 + dx:1 + dx + ni] for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dy or dx], -1)
        lone = (out >= 2) & ~(nbs == go[..., None]).any(-1); gh2 = gh.reshape(nj, ni, -1); Po = np.pad(out, 1, constant_values=-1)
        for j, i in zip(*np.where(lone)):
            cand = [k for k in set(nbs[j, i].tolist()) if k >= 0]
            if not cand: continue
            k = max(cand, key=lambda k: gh2[j, i, k])
            if gh2[j, i, k] >= 0.3 * gh2[j, i, go[j, i]]:
                px = sel_px(flat, fill, G, L, I, j * ni + i, k)
                if px is not None: out[j, i] = px
    res = [out, (-i0, -j0)]
    if extra is not None: res.append((cnt(np.pad(extra, pad)) / area) > 0.35)
    return res


def sel_px(flat, fill, G, L, I, cell, g):
    s = fill & (flat == cell) & (G == g)
    if not s.any(): return None
    l = L.ravel()[s]; return I[s][np.argsort(l)[len(l) // 2]]


def to_rgba(out, pal):
    o = np.zeros(out.shape + (4,), np.uint8); k = out >= 0; o[k, :3] = pal[out[k]]; o[k, 3] = 255; return o
