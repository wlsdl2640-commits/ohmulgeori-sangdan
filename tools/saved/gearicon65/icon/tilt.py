"""바로 선 그림(격자)을 45° 눕힌 카드 위 칸으로 옮긴다 — 격자 한 칸 = 화면 한 칸(격자점), 사이 칸은 이웃 넷 중 셋 이상(또는 마주 보는 둘)이 차면 채운다.
카드 위쪽 = 화면 오른쪽 위 · 카드 오른쪽 = 화면 오른쪽 아래. cu, cv = 그림 가운데의 (u, v) — 짝이 맞게 (cu + cv 홀수)."""
from collections import Counter
def XY(u, v): return (u + v + 19) // 2, (v - u + 17) // 2
def tilt(rows, cu=1, cv=0, keep=None, strict=False):
    rows = [r.replace(' ', '') for r in rows]
    h = len(rows); w = len(rows[0])
    if (cu + cv + h - w) % 2 == 0: cu += 1                  # 격자점이 칸(u + v 홀수)에 오게 반 칸 옮김
    lat = {}
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch == '.': continue
            v = cv + 2 * i - (w - 1); u = cu + (h - 1) - 2 * j
            lat[(u, v)] = ch
    out = {XY(u, v): ch for (u, v), ch in lat.items()}
    us = [u for u, v in lat]; vs = [v for u, v in lat]
    for u in range(min(us) - 1, max(us) + 2):
        for v in range(min(vs) - 1, max(vs) + 2):
            if (u + v) % 2 == 0 or (u, v) in lat: continue
            nb = [lat.get(q) for q in ((u + 1, v + 1), (u - 1, v - 1), (u - 1, v + 1), (u + 1, v - 1))]
            got = [c for c in nb if c]
            opp = (nb[0] and nb[1]) or (nb[2] and nb[3])
            if len(got) >= 3 or (len(got) == 2 and opp and not strict):
                out[XY(u, v)] = Counter(got).most_common(1)[0][0]
    if keep: out = {p: c for p, c in out.items() if p in keep}
    return out
