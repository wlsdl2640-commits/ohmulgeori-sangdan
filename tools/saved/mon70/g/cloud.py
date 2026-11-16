"""구름 덩이 (빌드 59 시안 공용)"""
import math
from cv import ell


def puffs(c, circles, ch, sh, sq=0.9, crease=True, light=None, low=0.6):
    """뭉게구름 (흔한 도트 구름 꼴): 동그라미를 합친 울퉁불퉁한 덩이 · 위쪽은 흰 털, 아래쪽(높이의 low부터)은 물결 줄로 갈린 그늘 ·
    윗가장자리가 움푹 들어간 자리마다 짧은 주름(덩이 사이) · 윗가장자리 빛"""
    cells = set()
    for (x, y, r) in circles: cells |= ell(x, y, r, r * sq)
    c.fill(cells, ch)
    xs = sorted({x for (x, y) in cells})
    yt = {x: min(y for (xx, y) in cells if xx == x) for x in xs}; yb = {x: max(y for (xx, y) in cells if xx == x) for x in xs}
    for (x, y) in cells:
        if y > yt[x] + (yb[x] - yt[x]) * low + 0.9 * math.sin(x * 1.25): c.set(x, y, sh)
    if crease:
        for x in xs[1:-1]:
            if yt.get(x - 1, 99) < yt[x] and yt.get(x + 1, 99) <= yt[x] or yt.get(x - 1, 99) <= yt[x] and yt.get(x + 1, 99) < yt[x]:   # 윗가장자리 움푹한 자리
                for d in (1, 2): 
                    if (x, yt[x] + d) in cells and c.get(x, yt[x] + d) == ch: c.set(x - (d - 1) * 0.0, yt[x] + d, sh)
    for (x, y) in cells:   # 이 덩이 칸만: 윗가장자리 빛 · 아랫가장자리 그늘 (여러 번 불러도 흰 털이 깎이지 않게)
        if c.get(x, y) != ch: continue
        if (x, y + 1) not in cells: c.set(x, y, sh)
        elif light and (x, y - 1) not in cells: c.set(x, y, light)
    return cells


