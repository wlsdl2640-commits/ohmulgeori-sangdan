"""GPT 스프라이트 판 → 장(frame) 나누기"""
import numpy as np
from PIL import Image
from scipy import ndimage
import os
HERE = os.path.dirname(os.path.abspath(__file__))
# 사용자가 보낸 판 (11-18 18:42 · 18:18) — 이 폴더 sheets/ (받은 그대로, 무손실 WebP) · 평원 풍경 둘은 ../plains_wide/
SHEETS = {'fb1e9ce5': 'sheets/mon_rat.webp', 'd5946b77': 'sheets/mon_rabbit.webp', 'd7c600ce': 'sheets/mon_wolf.webp', 'c3ff3bc8': 'sheets/mon_scarecrow.webp',
          '96a7568a': 'sheets/mon_boar.webp', '572486e4': 'sheets/mon_aboar.webp', '951d4114': 'sheets/warrior1.webp', '4ea8aeea': 'sheets/warrior1_skills.webp',
          'gobclub': 'sheets/mon_gobclub.webp', 'goblin': 'sheets/mon_goblin.webp', 'gobarcher': 'sheets/mon_gobarcher.webp',   # 원시림 고블린 셋 (11-20 — 받은 그대로는 raw_goblin_*.webp)
          '38f56457': '../plains_wide/plains_gpt_composite.png', '4b92ccaf': '../plains_wide/plains_gpt_layers.png'}
def sheet_path(k): return os.path.join(HERE, SHEETS[k])
ATT = None   # 예전 첨부 폴더 (세션 작업 때) — 이제는 sheet_path

def mag_mask(a):   # 마젠타 바탕 + 마젠타 그림자 · 번짐 = 바탕
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    bg = ((R > 170) & (B > 170) & (G < 120) & (np.abs(R - B) < 100)) | ((R - G > 60) & (B - G > 60))
    return ~bg

def dark_mask(a, thr=40):   # 검은 바탕: 밝기 합이 thr 넘는 칸 + 안쪽 구멍 메우기
    fg = a.sum(axis=2) > thr
    fg = ndimage.binary_closing(fg, iterations=2)
    return ndimage.binary_fill_holes(fg)

def runs(v, gap=10, minw=1):
    idx = np.where(v)[0]
    if not len(idx): return []
    out = []; s = p = idx[0]
    for x in idx[1:]:
        if x > p + gap: out.append([s, p]); s = x
        p = x
    out.append([s, p]); return [r for r in out if r[1] - r[0] + 1 >= minw]

def bands(fg, gap=6, minh=20):
    frac = fg.mean(axis=1); fg = fg.copy(); fg[frac > 0.95] = False   # 가로 나눔 줄
    return fg, runs(fg.any(axis=1), gap, minh)

def frames_in(fg, y0, y1, x0=0, x1=None, gap=10, expect=None):
    sub = fg[y0:y1 + 1, x0:x1]
    col = sub.sum(axis=0) > 0
    rs = runs(col, gap)
    rs = [[a + x0, b + x0] for a, b in rs]
    # 아주 좁은 조각은 가까운 장에 붙인다 (수염 · 떨어진 털)
    while len(rs) > 1 and min(b - a for a, b in rs) < 18:
        i = min(range(len(rs)), key=lambda k: rs[k][1] - rs[k][0])
        j = i - 1 if i == len(rs) - 1 or (i > 0 and rs[i][0] - rs[i - 1][1] < rs[i + 1][0] - rs[i][1]) else i + 1
        a, b = sorted([i, j]); rs[a] = [min(rs[a][0], rs[b][0]), max(rs[a][1], rs[b][1])]; del rs[b]
    if expect and len(rs) != expect: print('  ! frames', len(rs), 'expected', expect)
    return rs
