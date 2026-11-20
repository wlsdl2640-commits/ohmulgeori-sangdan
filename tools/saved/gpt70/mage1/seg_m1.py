"""마법사 판(GPT · 마젠타 바탕) 나누기 — 바탕 빼기 · 줄 · 장 · 닻 (base1.py · extract_m1.py가 쓴다)
   전사 판의 바탕 빼기(../hd70/extract_war16.py load)는 색상 265 ~ 330°를 번짐으로 봐서 **보라 로브 · 모자까지 지운다** →
   여기서는 마젠타(색상 300° 둘레 · 아주 진함)만 바탕으로, 그 옆 4픽셀 안의 마젠타 빛(색상 287 ~ 318°)만 번짐으로 본다 (로브 보라는 265 ~ 280°)"""
import numpy as np
from PIL import Image
from scipy import ndimage


def hsv(rgb):
    rgb = rgb.astype(float); R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]; mx = rgb.max(-1); mn = rgb.min(-1); d = np.maximum(mx - mn, 1e-6)
    h = np.where(mx == R, (G - B) / d, np.where(mx == G, 2 + (B - R) / d, 4 + (R - G) / d)); h = (h * 60) % 360
    return h, np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0), mx / 255


def key(rgb):
    """→ (rgb 손질본 uint8, 덮임). 번짐 가운데 어두운 것(테 선에 섞인 보라)은 무채색 테로 바꾼다"""
    rgb = rgb.astype(int); h, s, v = hsv(rgb)
    core = (h > 288) & (h < 312) & (s > 0.75) & (v > 0.7)
    near = ndimage.binary_dilation(core, iterations=4)
    fr = near & ~core & (h >= 287) & (h <= 318) & (s > 0.4)
    bg = core | (fr & (v >= 0.45))
    dk = fr & (v < 0.45); g = rgb[dk].min(axis=1); rgb[dk] = np.stack([g + 6, g, g + 4], axis=1)
    fg = ~bg; lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
    fg = np.isin(lab, [i + 1 for i in range(n) if sz[i] > 60])      # 잡티
    return rgb.astype(np.uint8), fg


def runs(v, merge_to=None, min_gap=1):
    out = []; x = 0; W = len(v)
    while x < W:
        if v[x]:
            x0 = x
            while x < W and v[x]: x += 1
            out.append([x0, x])
        else: x += 1
    if merge_to:
        while len(out) > merge_to:
            gaps = [out[i + 1][0] - out[i][1] for i in range(len(out) - 1)]; i = int(np.argmin(gaps)); out[i][1] = out[i + 1][1]; del out[i + 1]
    return out


def split(fg, rows, per):
    """판 → [(덮임 조각, (x0, y0))] — 줄을 먼저(가로로 빈 띠), 줄마다 장(세로로 빈 띠)"""
    R = runs(fg.any(1), rows); assert len(R) == rows, R; F = []
    for y0, y1 in R:
        band = fg[y0:y1]; C = runs(band.any(0), per); assert len(C) == per, (y0, C)
        for x0, x1 in C:
            m = band[:, x0:x1]; ys = np.where(m.any(1))[0]; F.append((m[ys.min():ys.max() + 1], (x0, y0 + ys.min())))
    return F


def face_of(rgb, m):
    """얼굴 = 살색 덩어리 가운데 가장 위에 있는 것 → (위, 아래, 왼, 오른)"""
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]
    skin = m & (r > 190) & (g > 130) & (g < 215) & (b > 90) & (b < 175) & (r - b > 45)
    lab, n = ndimage.label(skin)
    if not n: return None
    sz = ndimage.sum(skin, lab, range(1, n + 1)); big = [i + 1 for i in range(n) if sz[i] > 0.15 * sz.max()]
    tops = {i: np.where(lab == i)[0].min() for i in big}; ys, xs = np.where(lab == min(tops, key=tops.get))
    return int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max())


def heel(m, frac=0.05):
    """뒷발 뒤꿈치: 맨 아래 몇 줄에서 가장 왼쪽 칸 (오른쪽을 보는 그림)"""
    ys = np.where(m.any(1))[0]; y1 = ys.max(); band = m[max(0, y1 - max(3, int(frac * len(ys)))):y1 + 1]
    return int(np.where(band.any(0))[0].min())
