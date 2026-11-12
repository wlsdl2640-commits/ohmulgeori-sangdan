"""탈것이 엎드려 자는 모습 (야영 · 상단 마구간). 기본은 오른쪽을 보고 그리고, 시안판은 왼쪽을 보게 뒤집어 보인다.
늑대: 엎드려 앞발을 뻗고 그 위에 턱 · 귀를 눕힘 · 꼬리를 몸 앞으로 감음.
와이번: 엎드려 날개를 접고, 긴 목을 등 위로 활처럼 꺾어 머리를 엉덩이 쪽(누운 방향의 반대)에 얹는다.
하늘뱀: 똬리를 두 겹 틀고 그 위에 머리.  장: sleep0 · sleep1(숨쉬기)
python3 sleep.py → ../t/sleep.json"""
import json, math
from cv import Cv, ell, poly, path, box, blunt, frames, thin, thins, wing, bone_cells
import wolf as WO
import wyv as WY

W, H, GY = 46, 36, 31


def closed_eye(c, x, y): c.set(x, y, 'K'); c.set(x + 1, y, 'K')


# ───────────── 늑대: 몸을 둥글게 말고 엎드림 — 둥근 둔덕 + 둥근 엉덩이, 앞쪽에 고개를 숙인 머리(귀는 세움), 꼬리가 배 앞을 돌아 코 밑까지
def sep(c, region, others, ch='d'):
    """region 칸 중 others 칸과 맞닿은 가장자리를 ch로 (부위 사이 선)"""
    for (x, y) in region:
        if any((x + dx, y + dy) in others and (x + dx, y + dy) not in region for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1))): c.set(x, y, ch)


def wolf_sleep(opt, fr):
    c = Cv(W, H); br = 1 if fr == 'sleep1' else 0
    up = lambda y, k=1.0: y - br * k
    big = opt == 'B'
    body = ell(18.6, up(26.2, 0.5), 8.6 if not big else 9.0, 4.4 if not big else 4.9) | ell(14.6, up(25.0), 4.4, 4.0)   # 둔덕 + 엉덩이
    if big: body |= poly([(16.0, up(22.6)), (17.0, up(19.6)), (18.4, up(21.4)), (19.6, up(18.6)), (21.0, up(20.8)), (22.4, up(18.8)), (23.6, up(21.4)), (25.4, up(21.8)), (26.0, 24.0), (16.0, 24.0)])   # 갈기
    for (x, y) in body: c.set(x, y, 'C')
    hx, hy = 26.2, up(25.4, 0.3)
    hr = (3.4, 2.8) if not big else (3.8, 3.1)
    mz = [(0.8, -0.8), (5.0, 1.6), (4.4, 3.0), (0.2, 2.4)]
    head = ell(hx, hy, *hr) | poly([(hx + x, hy + y) for (x, y) in mz])
    ears = [[(-2.8, -1.6), (-2.8, -5.2), (-1.0, -2.4)], [(-1.2, -2.2), (-0.6, -5.8), (1.2, -2.4)]]
    if big: ears = [[(-3.0, -1.8), (-4.0, -4.8), (-1.2, -2.6)], [(-1.4, -2.4), (-2.0, -5.4), (1.0, -2.8)]]
    earc = [poly([(hx + x, hy + y) for (x, y) in e]) for e in ears]
    for (x, y) in earc[0]: c.set(x, y, 'd')
    for (x, y) in head | earc[1]: c.set(x, y, 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    sep(c, head, body, 'c')                 # 머리와 몸 사이 선
    # 꼬리: 엉덩이 뒤에서 아래로 돌아 배 앞을 지나 코 밑까지 (몸 위에 얹힘)
    tpts = [(10.4, up(24.0, 0.5)), (9.4, 28.6), (14.0, 30.6), (21.0, 30.8), (27.4, 30.2), (30.8, 28.2)]
    tail = path(tpts, 2.2 if not big else 2.5, 2.0)
    for (x, y) in tail: c.set(x, y, 'C' if not big else 'C')
    for (x, y) in tail:
        if (x, y - 1) not in tail and (x, y - 1) not in head: c.set(x, y, 'Q')
        if (x, y + 1) not in tail: c.set(x, y, 'c')
    sep(c, tail, body | head, 'd')
    tip = path(tpts[-2:], 2.2, 2.2) & tail
    for (x, y) in tip: c.set(x, y, {'A': 'A', 'B': 'c', 'C': 'd', 'D': 'A'}[opt])
    # 밝은 털: 주둥이 아래 · 가슴 (다이어울프 제외)
    for (x, y) in head:
        if y >= hy + 1.6 and c.get(x, y) in 'Cc': c.set(x, y, 'A' if not big else 'c')
    closed_eye(c, round(hx + 0.6), round(hy - 0.2))
    c.set(hx + mz[1][0] - 0.4, hy + mz[1][1] - 0.2, 'K')   # 코
    if opt == 'C':   # 깃털 굴레 · 볼 무늬
        bx, by = hx - 2.0, hy + 0.2
        for k, (dx, dy) in enumerate(((-1.6, 3.0), (-2.8, 2.0))):
            pts = sorted(thins([(bx - 0.4 * k, by), (bx + dx * 0.5 - 0.4 * k, by + dy * 0.5), (bx + dx - 0.4 * k, by + dy)]), key=lambda p: (p[1], -p[0]))
            for i, (x, y) in enumerate(pts): c.set(x, y, 'R' if i < len(pts) - 1 else 'Z')
        c.set(bx, by, 'G')
        for p in ((0.6, 1.2), (1.6, 1.6)): c.set(hx + p[0], hy + p[1], 'Z')
    if opt == 'D':   # 쇠 투구 (머리 위 · 주둥이 위) · 목 판
        helm = poly([(hx + x, hy + y) for (x, y) in [(-2.6, -2.2), (0.4, -2.8), (2.8, -1.4), (4.8, 1.0), (4.2, 1.6), (2.0, 0.6), (0.2, 0.8), (-1.6, 1.0), (-2.8, 0.0)]])
        for (x, y) in helm: c.set(x, y, 'M')
        for (x, y) in helm:
            if (x, y + 1) not in helm: c.set(x, y, 'n')
            elif (x, y - 1) not in helm: c.set(x, y, 'x')
        c.set(hx + 0.6, hy - 3.2, 'x'); c.set(hx + 0.6, hy - 4.2, 'M')
        closed_eye(c, round(hx + 0.6), round(hy - 0.2))
        for (a, b) in (((19.2, up(21.8)), (21.8, up(22.0))), ((22.2, up(22.2)), (24.2, up(23.0)))):
            cells = path([a, b], 0.9)
            for (x, y) in cells: c.set(x, y, 'M')
            for (x, y) in cells:
                if (x, y + 1) not in cells: c.set(x, y, 'N')
    return c


# ───────────── 와이번: 엎드려 날개를 접고(등 위 지붕 꼴), 긴 목을 앞에서 아래로 꺾어 땅을 따라 뒤로 — 머리는 접은 뒷다리 옆에서 꼬리 끝을 향해 누움
def wyv_sleep(opt, fr):
    S = {'A': WY.S_A, 'B': WY.S_B, 'C': WY.S_C}[opt]; c = Cv(W + 8, H); br = 1 if fr == 'sleep1' else 0
    up = lambda y, k=1.0: y - br * k
    # 꼬리: 엉덩이에서 뒤로 땅을 따라 → 끝을 앞으로 말아 머리 쪽으로
    tpts = [(16.4, 28.6), (10.0, 30.4), (5.6, 29.4), (5.4, 26.6), (8.4, 25.4)]
    c.fill(path(tpts, 2.4, 0.8), 'C')
    if S.get('tailtip'): S['tailtip'](c, tpts)
    # 먼 날개 (접힘, 조금 위로 비침)
    def folded(off, mem, bone):
        sh, wr = (27.4 + off[0], up(23.6) + off[1]), (23.4 + off[0], up(17.6) + off[1])
        back = (12.0 + off[0], up(25.0, 0.5) + off[1])
        m = poly([sh, wr, back, (14.0 + off[0], 27.0 + off[1]), (25.6 + off[0], 26.8 + off[1])])
        for (x, y) in m: c.set(x, y, mem)
        for (x, y) in m:
            if (x, y + 1) not in m: c.set(x, y, 'f' if mem == 'F' else 'd')
        for (x, y) in thins([sh, wr, back]): c.set(x, y, bone)
        for tx in (15.6, 19.6):
            for (x, y) in thin(wr, (tx + off[0], 26.4 + off[1])):
                if (x, y) in m and c.get(x, y) == mem: c.set(x, y, 'f' if mem == 'F' else 'd')
        c.set(wr[0], wr[1] - 1, 'Z')
    folded((1.2, -1.2), 'f', 'd')
    # 몸통 · 접은 뒷다리
    c.fill(ell(23.0, up(27.2, 0.5), 8.4, 3.9), 'C')
    c.fill(ell(17.8, 28.0, 3.2, 2.8), 'C')
    for dx in (0, 1, 2): c.set(20.4 + dx, 31.0, 'Z')
    # 목: 가슴에서 앞으로 나와 아래로 꺾이고 땅을 따라 뒤로 (몸 앞을 지남)
    npts = [(30.2, up(25.4, 0.5)), (32.4, up(21.2)), (30.0, up(17.2)), (25.2, up(16.0)), (20.6, up(17.4))]
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=0, top=1)
    for (x, y) in ell(23.0, up(27.2, 0.5), 8.4, 3.9):
        if y >= up(28.8, 0.5) and c.get(x, y) in 'CQc': c.set(x, y, 'A' if y % 2 == 0 else 'a')
    folded((0, 0), 'F', 'C')
    neck = path(npts, 2.3, 1.9)
    for (x, y) in neck: c.set(x, y, 'C')
    # 머리: 땅에 턱을 대고 왼쪽(뒤 · 꼬리 끝 쪽)을 봄
    hx, hy = 16.8, up(19.4)
    sn = [(-x, y) for (x, y) in S['snout']]; jw = [(-x, y) for (x, y) in S['jaw']]
    hd = ell(hx, hy, 2.9, 2.2) | poly([(hx + x, hy + y) for (x, y) in sn]) | poly([(hx + x, hy + y - 0.4) for (x, y) in jw])
    for (x, y) in hd: c.set(x, y, 'C')
    part = neck | hd
    for (x, y) in part:
        if (x, y - 1) not in part: c.set(x, y, 'Q')
        elif (x, y + 1) not in part: c.set(x, y, 'a')
    for (x, y) in neck:   # 목 안쪽(아래) 배 비늘
        if (x, y + 1) not in part and (x, y - 1) in part and c.get(x, y + 1) == '.': c.set(x, y, 'A')
    for (x, y) in part:   # 목 · 머리와 몸 사이 선
        if any((x + dx, y + dy) not in part and c.get(x + dx, y + dy) not in '.' for dx, dy in ((0, -1), (1, 0), (-1, 0))) and (x, y - 1) not in part:
            c.set(x, y, 'c')
    for (a, b, ch, r0, r1) in S['horns']:
        a2, b2 = (-a[0] * 0.8, a[1] * 0.7), (-b[0] * 0.8, b[1] * 0.6)
        c.fill(path([(hx + a2[0], hy + a2[1]), (hx + (a2[0] + b2[0]) / 2 + 0.2, hy + (a2[1] + b2[1]) / 2 - 0.3), (hx + b2[0], hy + b2[1])], r0, r1), ch)
    closed_eye(c, round(hx - 1.8), round(hy - 0.4))
    c.set(hx - S['nostril'][0], hy + S['nostril'][1], 'K')
    if opt == 'B':   # 볏 지느러미 (머리 뒤 = 오른쪽)
        for (a, b) in (((1.6, -1.2), (4.6, -2.8)), ((1.8, -0.2), (5.0, -0.4))):
            for (x, y) in path([(hx + a[0], hy + a[1]), (hx + b[0], hy + b[1])], 0.7, 0.4):
                if c.get(x, y) in '.CQcFf': c.set(x, y, 'J')
    if opt == 'C':   # 등 · 꼬리 뼈 가시
        for xx in (14.0, 18.0, 22.0):
            c.set(xx, up(21.0) + (xx - 14) * -0.3, 'Z')
        for k in (1, 2):
            x, y = tpts[k]; c.set(x, y - 1.8, 'Z')
    return c


# ───────────── 하늘뱀 용: 똬리 두 겹 + 위에 머리
def serp_sleep(fr):
    S = WY.S_D; c = Cv(W + 6, H); br = 1 if fr == 'sleep1' else 0
    bands = [(8.4, 33.0, 28.8, 2.6), (11.0, 30.4, 24.8 - br * 0.5, 2.4), (14.2, 27.0, 21.2 - br, 2.1)]   # 아래 · 가운데 · 위 겹
    cells = []
    for (x0, x1, y, r) in bands:
        b_ = path([(x0, y), (x1, y)], r); cells.append(b_)
        for (x, y_) in b_: c.set(x, y_, 'C')
        for (x, y_) in b_:   # 겹 맨 아래 줄은 짙게(앞 겹과 갈라 보이게) · 둥근 끝 아래만 배 빛
            if (x, y_ + 1) not in b_: c.set(x, y_, 'd')
            elif (x, y_ + 2) not in b_ and (x < x0 + 1.6 or x > x1 - 1.6): c.set(x, y_, 'A')
            elif (x, y_ - 1) not in b_: c.set(x, y_, 'Q')
    # 꼬리 끝: 아래 겹 앞으로 빠져나와 위로 · 지느러미
    c.fill(path([(33.0, 28.8), (36.2, 28.0), (37.8, 25.4)], 2.0, 0.8), 'C')
    for (x, y) in poly([(37.8, 25.8), (37.2, 22.2), (39.8, 22.8), (40.0, 25.2)]):
        if c.get(x, y) == '.': c.set(x, y, 'D')
    # 등줄기 톱니 (겹마다 위)
    for (x0, x1, y, r) in bands:
        for xx in range(int(x0) + 2, int(x1) - 1, 3):
            if c.get(xx, y - r - 0.6) == '.': c.set(xx, y - r - 0.6, 'D')
    # 목 · 머리: 위 겹 오른쪽 끝에서 솟아 왼쪽(뒤)을 보고 위 겹 위에 턱
    npts = [(26.4, 20.4 - br), (28.8, 17.4 - br), (26.6, 14.8 - br), (22.4, 15.4 - br)]
    c.fill(path(npts, 2.2, 1.9), 'C')
    hx, hy = 19.0, 17.0 - br
    hd = ell(hx, hy, 3.0, 2.4) | poly([(hx - x, hy + y) for (x, y) in S['snout']]) | poly([(hx - x, hy + y) for (x, y) in S['jaw']])
    for (x, y) in hd: c.set(x, y, 'C')
    for (x, y) in set(path(npts, 2.2, 1.9)) | hd:
        if c.get(x, y) == 'C' and c.get(x, y - 1) == '.': c.set(x, y, 'Q')
        elif c.get(x, y) == 'C' and c.get(x, y + 1) == '.': c.set(x, y, 'c')
    for (a, b, r0, r1) in (((1.6, -1.6), (5.4, -0.2), 1.0, 0.5), ((1.8, 0.2), (5.6, 2.4), 0.9, 0.5)):
        for (x, y) in path([(hx + a[0], hy + a[1]), (hx + b[0], hy + b[1])], r0, r1):
            if c.get(x, y) in '.CQc': c.set(x, y, 'J')
    for (a, b, ch, r0, r1) in S['horns']:
        a2, b2 = (-a[0], a[1]), (-b[0], b[1])
        c.fill(path([(hx + a2[0], hy + a2[1]), (hx + (a2[0] + b2[0]) / 2 + 0.2, hy + (a2[1] + b2[1]) / 2 - 0.4), (hx + b2[0], hy + b2[1])], r0, r1), ch)
    closed_eye(c, round(hx - 2.2), round(hy - 0.4))
    c.set(hx - S['nostril'][0], hy + S['nostril'][1], 'K')
    for i in range(3): c.set(hx - S['mouth'][0] + i, hy + S['mouth'][1], 'K')
    fw = poly([(25.4, 19.6 - br), (22.4, 16.8 - br), (18.2, 18.8 - br), (21.0, 20.4 - br)])   # 접은 지느러미 날개
    for (x, y) in fw:
        if c.get(x, y) in '.CQcdA': c.set(x, y, 'F')
    for (x, y) in thin((25.4, 19.6 - br), (22.4, 16.8 - br)): c.set(x, y, 'j')
    return c


def emit(key, fn, pal, label, ax):
    fs = [fn('sleep0'), fn('sleep1')]
    outs, top = frames(fs)
    return {'frames': {'sleep0': outs[0], 'sleep1': outs[1]}, 'pal': pal, 'ax': ax, 'seat': {'sleep0': [0, 0], 'sleep1': [0, 0]}, 'label': label}


OUT = {}
for k, pal, lab in (('A', WO.PAL_A, 'A 은빛 늑대'), ('B', WO.PAL_B, 'B 검은 다이어울프'), ('C', WO.PAL_C, 'C 갈색 늑대'), ('D', WO.PAL_D, 'D 갑주 늑대')):
    OUT['sleepW' + k] = emit('sleepW' + k, lambda f, k=k: wolf_sleep(k, f), pal, lab, 20)
for k, pal, lab in (('A', WY.PAL_A, 'A 올리브 뿔 와이번'), ('B', WY.PAL_B, 'B 황금 와이번'), ('C', WY.PAL_C, 'C 먹빛 와이번')):
    OUT['sleepY' + k] = emit('sleepY' + k, lambda f, k=k: wyv_sleep(k, f), pal, lab, 22)
OUT['sleepYD'] = emit('sleepYD', serp_sleep, WY.PAL_D, 'D 푸른 하늘뱀 용', 22)

if __name__ == '__main__':
    json.dump(OUT, open('../t/sleep.json', 'w'), ensure_ascii=False, indent=1)
    print(list(OUT))
