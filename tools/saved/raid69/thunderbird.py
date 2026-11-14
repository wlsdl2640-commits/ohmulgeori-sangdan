"""천둥새 새 그림 시안 (빌드 69, 11-14 사용자 「대그리폰 → 천둥새」 · 12:18 「ㄱㄱ」) — 레이드에 남는 보스(옛 대그리핀 자리, id raidgriffon 그대로).
오른쪽을 보는 반 해상도 격자 44×32(→ 88×64). 날개를 높이 치켜든 큰 새 — 날개깃은 한 장씩 겹쳐 그린다(뒤 깃부터, 깃마다 위 가장자리 빛).
노란 몸 · 뾰족 깃 번개새(유명한 캐릭터)와 겹치지 않게 노랑은 쓰지 않고 먹구름 · 쪽빛 · 번개 청백으로.
A 먹구름 날개(날개깃 끝이 뭉게구름) · B 번개 깃(지그재그로 갈라진 깃 · 쪽빛 · 빛나는 볏) · C 비바람(날개를 옆으로 넓게 · 긴 꼬리 끝에 빗줄기)
python3 thunderbird.py <출력.json>  → {A: 격자, B: …, C: …, pal: {A: {…}, …}}
그림 도구는 ../ride65/g (cv · shp · blunt) — 게임(pxBake)이 바깥 테 · 부위 사이 선 · 빛을 더한다(확인은 scratchpad v90/tb/rend.py)."""
import json, math, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ride65', 'g'))
from cv import Cv, ell, poly, path, thin, thins   # noqa: E402
from blunt import blunt                            # noqa: E402

W, H = 44, 32


def zig(a, b, n, amp):
    L = math.hypot(b[0] - a[0], b[1] - a[1]) or 1; nx, ny = -(b[1] - a[1]) / L, (b[0] - a[0]) / L
    pts = [a]
    for k in range(1, n):
        t = k / n; s = amp if k % 2 else -amp
        pts.append((a[0] + (b[0] - a[0]) * t + nx * s, a[1] + (b[1] - a[1]) * t + ny * s))
    return pts + [b]


def fpoly(a, b, tip, w, jag=False):
    """깃 한 장: 밑동 두 점 a · b → 둥근(또는 뾰족한) 끝 tip"""
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; dx, dy = tip[0] - mx, tip[1] - my; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L; px, py = -uy, ux
    if jag:   # 번개 깃: 옆으로 한 번 꺾인 뾰족 끝
        k = (mx + dx * 0.62 + px * w * 0.9, my + dy * 0.62 + py * w * 0.9)
        return [a, k, tip, (tip[0] - ux * w * 0.9 - px * w * 0.2, tip[1] - uy * w * 0.9 - py * w * 0.2), (mx + dx * 0.5 - px * w * 0.3, my + dy * 0.5 - py * w * 0.3), b]
    return [a, (tip[0] - ux * w * 0.7 + px * w * 0.55, tip[1] - uy * w * 0.7 + py * w * 0.55), tip, (tip[0] - ux * w * 0.7 - px * w * 0.55, tip[1] - uy * w * 0.7 - py * w * 0.55), b]


def layer(c, feathers, base, lite, dark=None, jag=False):
    """깃을 뒤에서 앞으로 겹쳐 칠한다. 깃마다 위(앞) 가장자리 칸은 lite, 아래 가장자리는 dark"""
    for (a, b, tip, w) in feathers:
        cells = poly(fpoly(a, b, tip, w, jag))
        for q in cells: c.set(*q, base)
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; dx, dy = tip[0] - mx, tip[1] - my; L = math.hypot(dx, dy) or 1
        px, py = dy / L, -dx / L   # 깃 축에서 위쪽(시계 반대) 방향
        for (x, y) in cells:
            up = (int(math.floor(x + 0.5 + px * 1.0)), int(math.floor(y + 0.5 + py * 1.0)))
            dn = (int(math.floor(x + 0.5 - px * 1.0)), int(math.floor(y + 0.5 - py * 1.0)))
            if up not in cells: c.set(x, y, lite)
            elif dark and dn not in cells: c.set(x, y, dark)


def bolt(c, pts, core=True, on=None):
    for (x, y) in thins(pts):
        if c.get(x, y) != '.' and (on is None or c.get(x, y) in on): c.set(x, y, 'L')
    if core:
        for (x, y) in pts[1:-1]:
            if c.get(x, y) == 'L': c.set(x, y, 'x')


def wing_feathers(sh, wr, tips, sec):
    """날개깃(손목 둘레 밑동 → tips) · 둘째날개깃(팔뚝을 따라 → sec)을 뒤(아래) → 앞(위) 순서로"""
    prim = []
    for i, t in enumerate(tips):
        ang = math.atan2(t[1] - wr[1], t[0] - wr[0])
        a = (wr[0] + math.cos(ang + 1.3) * 1.6, wr[1] + math.sin(ang + 1.3) * 1.6)
        b = (wr[0] + math.cos(ang - 1.3) * 1.6, wr[1] + math.sin(ang - 1.3) * 1.6)
        prim.append((a, b, t, 2.4 - 0.15 * i))
    secs = []
    for i, t in enumerate(sec):
        u = (i + 1) / (len(sec) + 1)
        base = (wr[0] + (sh[0] - wr[0]) * u, wr[1] + (sh[1] - wr[1]) * u)
        ang = math.atan2(t[1] - base[1], t[0] - base[0])
        a = (base[0] + math.cos(ang + 1.4) * 1.7, base[1] + math.sin(ang + 1.4) * 1.7)
        b = (base[0] + math.cos(ang - 1.4) * 1.7, base[1] + math.sin(ang - 1.4) * 1.7)
        secs.append((a, b, t, 2.6))
    return list(reversed(prim)), list(reversed(secs))


def bird(opt):
    c = Cv(W, H)
    wide, jg = opt == 'C', opt == 'B'
    if wide:
        sh, wr = (22, 14.5), (14.5, 9.5)
        tips = [(9.4, 4.6), (5.2, 5.6), (2.0, 8.0), (0.6, 11.4)]
        sec = [(2.6, 14.6), (6.0, 16.4), (10.0, 17.6), (14.4, 18.4)]
    else:
        sh, wr = (22, 14.5), (15.4, 6.2)
        tips = [(12.6, 0.4), (8.4, 0.6), (4.6, 2.6), (1.8, 6.0), (0.6, 10.0)]
        sec = [(1.8, 13.4), (4.8, 15.8), (8.6, 17.2), (12.8, 18.0)]
    # ── 먼 날개 (뒤 · 오른쪽 위로 비켜 · 날개깃 끝만 보인다) ──
    off = (4.6, -2.0) if not wide else (6.0, -3.2)
    p2, _ = wing_feathers((sh[0] + off[0], sh[1] + off[1]), (wr[0] + off[0], wr[1] + off[1]), [(t[0] + off[0], t[1] + off[1]) for t in tips[:3]], [])
    layer(c, p2, 'X', 'Z', jag=jg)
    # ── 꼬리 (뒤 왼쪽 아래 — 부채꼴, 깃 넷) ──
    tl = [((19, 22.4), (19.6, 24.6), (6.0, 27.6), 2.4), ((18.8, 23.4), (19.8, 25.6), (8.8, 30.8), 2.4), ((19, 21.6), (19.4, 23.6), (4.4, 24.0), 2.2), ((19.4, 24.4), (20.4, 26.0), (13.2, 31.4), 2.2)] if not wide else \
         [((19, 22.0), (19.6, 24.0), (3.4, 26.0), 2.2), ((18.8, 23.0), (19.8, 25.0), (5.8, 29.8), 2.2), ((19, 21.2), (19.4, 23.0), (3.0, 22.8), 2.0), ((19.4, 24.2), (20.4, 25.8), (10.6, 31.4), 2.0)]
    layer(c, [tl[3], tl[1], tl[0], tl[2]], 'T', 'S', 't', jag=jg)
    # ── 다리 (깃 바지 + 굵은 발 + 흰 발톱) ──
    for lx in (22, 25.6):
        c.fill(path([(lx, 24.5), (lx + 0.2, 28.2)], 1.05), 'Y')
        for (dx, dy, ch) in ((-1.5, 29.3, 'G'), (-0.5, 29.6, 'G'), (0.6, 29.6, 'G'), (1.8, 29.3, 'G'), (-1.6, 28.5, 'Y'), (1.7, 28.4, 'Y')):
            c.set(lx + dx, dy, ch)
    c.fill(ell(23.8, 24.2, 4.0, 2.5), 'H')
    # ── 몸 (곧게 선 가슴) · 목 · 머리 ──
    body = ell(22.4, 19.0, 5.8, 6.4) | ell(25.6, 16.4, 4.2, 4.8)
    c.fill(body, 'C')
    c.fill(path([(26.0, 14.2), (28.0, 11.6)], 3.4, 3.2), 'C')
    head = ell(30.0, 9.6, 4.2, 3.7); c.fill(head, 'C')
    # 부리: 크게 굽은 갈고리
    c.fill(poly([(32.8, 7.4), (36.8, 7.8), (39.2, 9.6), (39.6, 12.8), (38.0, 13.6), (37.6, 11.6), (35.6, 11.4), (33.0, 12.0)]), 'O')
    for q in [(38, 12), (38, 13), (39, 12)]: c.set(*q, 'o')
    for q in [(34, 11), (35, 11), (36, 11)]: c.set(*q, 'o')
    for q in [(33, 8), (34, 8), (35, 8)]: c.set(*q, 'J')
    # 볏: 뒤로 눕힌 깃 (뒤통수에서 등 쪽으로 — 손가락처럼 서지 않게 낮게)
    crest = [((28.6, 6.6), (23.6, 4.6)), ((29.8, 6.4), (25.2, 3.0)), ((27.6, 7.8), (22.8, 7.2))]
    for a, b in crest:
        pts = zig(a, b, 3, 0.4) if jg else [a, b]
        c.fill(path(pts, 1.0, 0.45), 'R')
    # 가슴 깃 (먹구름 아랫면처럼 밝게)
    for (x, y) in body:
        if (x >= 25 and y >= 14) or y >= 22: c.set(x, y, 'H')
    # ── 가까운 날개 (앞, 왼쪽 위): 둘째날개깃 → 날개깃 → 덮깃 ──
    prim, secs = wing_feathers(sh, wr, tips, sec)
    layer(c, secs, 'V', 'F', 'v', jag=jg)
    layer(c, prim, 'P', 'F', 'p', jag=jg)
    cov = poly([sh, (wr[0] + 1.6, wr[1] + 0.2), (wr[0] - 1.2, wr[1] + 1.4)] + [((wr[0] + (sh[0] - wr[0]) * u) - 3.0 + u * 1.2, (wr[1] + (sh[1] - wr[1]) * u) + 3.2 - u * 0.6) for u in (0.0, 0.33, 0.66, 1.0)] + [(sh[0] - 0.6, sh[1] + 2.2)])
    for q in cov: c.set(*q, 'W')
    for (x, y) in cov:
        if (x, y - 1) not in cov or (x - 1, y - 1) not in cov: c.set(x, y, 'U')
        elif (x, y + 1) not in cov: c.set(x, y, 'w')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    blunt(c.g, 'H', 'H', 'h', bottom=1, side=1, top=0)
    if opt == 'A':   # 먹구름 날개: 날개깃 끝 · 먼 날개 끝 · 꼬리 끝에 뭉게구름
        for t in tips + [(tt[2][0], tt[2][1]) for tt in p2]:
            cx, cy = t[0] + 0.6, t[1] + 1.0
            for (x, y) in ell(cx, cy, 1.9, 1.5): c.set(x, y, 'M' if y + 0.5 < cy + 0.1 else 'm')
        for (cx, cy, r) in [(6.4, 27.8, 1.8), (9.0, 30.6, 1.6), (4.8, 24.2, 1.6), (13.2, 31.0, 1.4)]:
            for (x, y) in ell(cx, cy, r, r * 0.85): c.set(x, y, 'M' if y + 0.5 < cy else 'm')
    WING = 'WUwPFpVv'
    if wide:
        bolt(c, [(20, 13), (17, 12), (18, 11), (14, 10), (11, 11), (8, 9), (4, 10)], on=WING)
        bolt(c, [(17, 23), (13, 24), (12, 23), (8, 25), (5, 25)], on='TSt')
        for (x, y) in [(2, 27), (4, 29), (7, 31), (1, 25), (9, 28)]: c.set(x, y, 'L')
        for (x, y) in [(3, 30), (6, 28), (0, 28), (11, 30)]: c.set(x, y, 'l')
    else:
        bolt(c, [(20, 12), (18, 9), (19, 8), (16, 7), (14, 6), (11, 4), (8, 5), (5, 4)], on=WING)
        bolt(c, [(13, 11), (10, 12), (8, 11), (5, 13), (3, 12)], core=False, on=WING)
        bolt(c, [(17, 24), (14, 26), (13, 25), (10, 28), (8, 28)], on='TSt')
    if jg:
        for t in tips + [tt[2] for tt in p2] + sec:
            x, y = int(round(t[0])), int(round(t[1]))
            for (xx, yy) in ((x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)):
                if c.get(xx, yy) != '.': c.set(xx, yy, 'L'); break
    for (x, y) in [(27, 16), (28, 17), (27, 18), (28, 19)]: c.set(x, y, 'L')
    c.set(32, 8, 'e'); c.set(31, 8, 'E'); c.set(33, 8, 'E')
    for q in [(30, 7), (31, 7), (32, 7), (33, 7)]: c.set(*q, 'k')
    return c


PALS = {
    'A': {'C': '#3e4660', 'Q': '#5c6888', 'c': '#2a3046', 'H': '#8a94ae', 'h': '#626c88', 'W': '#4a5474', 'U': '#7480a2', 'w': '#343c58',
          'P': '#2e3656', 'F': '#6a78a0', 'p': '#20263e', 'V': '#3a4466', 'v': '#262e48', 'X': '#262c44', 'Z': '#3e4866',
          'T': '#343c5a', 'S': '#5a6688', 't': '#242a40', 'M': '#c8d0e0', 'm': '#8c96ae', 'R': '#56628a', 'O': '#4a4e5c', 'o': '#2a2c36', 'J': '#7a8090',
          'Y': '#4e5260', 'G': '#e0e4f0', 'L': '#7ae6ff', 'l': '#4aa8d8', 'x': '#ffffff', 'e': '#ffffff', 'E': '#7ae6ff', 'k': '#101018'},
    'B': {'C': '#3a3468', 'Q': '#5a52a4', 'c': '#26214c', 'H': '#7a74ba', 'h': '#544e92', 'W': '#3e3874', 'U': '#6a62bc', 'w': '#2a2554',
          'P': '#28245a', 'F': '#6a62c8', 'p': '#18143a', 'V': '#322e66', 'v': '#201c46', 'X': '#201c46', 'Z': '#4a44a0',
          'T': '#2e2a5c', 'S': '#5a52a8', 't': '#1e1a40', 'M': '#c8d0e0', 'm': '#8c96ae', 'R': '#8ae8ff', 'O': '#5a5468', 'o': '#2e2a38', 'J': '#8a84a0',
          'Y': '#5a5470', 'G': '#e8ecf8', 'L': '#8af0ff', 'l': '#4ab0e0', 'x': '#ffffff', 'e': '#ffffff', 'E': '#8af0ff', 'k': '#0c0a18'},
    'C': {'C': '#4a5468', 'Q': '#6c7890', 'c': '#323a4c', 'H': '#aab2c2', 'h': '#7c8698', 'W': '#56607a', 'U': '#7c88a4', 'w': '#3c4458',
          'P': '#343c54', 'F': '#74809e', 'p': '#222838', 'V': '#3e4862', 'v': '#2a3244', 'X': '#2c3446', 'Z': '#465068',
          'T': '#3a425a', 'S': '#66728e', 't': '#283042', 'M': '#c8d0e0', 'm': '#8c96ae', 'R': '#5e6886', 'O': '#525664', 'o': '#2c2e38', 'J': '#80869a',
          'Y': '#56596a', 'G': '#e0e4f0', 'L': '#7ae6ff', 'l': '#5aa0c8', 'x': '#ffffff', 'e': '#ffffff', 'E': '#7ae6ff', 'k': '#101018'}
}


def grid(c):
    return '\n'.join(''.join(r) for r in c.g)


if __name__ == '__main__':
    out = {k: grid(bird(k)) for k in 'ABC'}
    out['pal'] = PALS
    json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, indent=0)
    print(out['A'])
