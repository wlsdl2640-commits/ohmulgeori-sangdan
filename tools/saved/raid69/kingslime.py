"""킹슬라임 새 그림 시안 (빌드 69, 11-13 21:22 사용자 「킹슬라임 디자인은 기본 슬라임의 거대화」).
평원 초록 슬라임(pxplains.js PXU.slime — 12×9 반 해상도)을 그대로 키운 꼴(32×24 반 해상도 → 64×48)에, 몸속에 삼킨 것들이 비친다(원천물 「슬라임의 위장」).
A 왕관 없음 · B 머리 위 작은 왕관 · C 왕관도 삼켜서 몸속에. 게임에는 아직 넣지 않는다 (사용자가 고른 뒤).
python3 kingslime.py <출력.json>  → {A: 격자 글, B: …, C: …, pal: {…}}"""
import json
import math
import sys

W, H = 32, 24
CX = 15.5


def body_cells():
    out = {}
    for y in range(3, H):
        if y <= 15: hw = 15.2 * math.sqrt(max(0.0, 1 - ((15.4 - y) / 12.6) ** 2))
        elif y <= 21: hw = 15.2 + (y - 15) * 0.1
        else: hw = 15.6 - (y - 21) * 0.9
        for x in range(W):
            if abs(x + 0.5 - CX) <= hw: out[(x, y)] = 'C'
    return out


def shade(B):
    """평원 슬라임과 같은 결: 왼쪽 위 테 = Q, 오른쪽 · 아래 = c, 맨 아랫줄 = d, 왼쪽 위 하얀 윤 w"""
    xs = {}
    for (x, y) in B:
        xs.setdefault(y, []).append(x)
    top = min(y for _, y in B)
    for (x, y) in list(B):
        L, R = min(xs[y]), max(xs[y])
        up = (x, y - 1) not in B or (x, y - 2) not in B
        if y >= H - 1: B[(x, y)] = 'd'
        elif x >= R - 1 or y >= H - 3 and x >= L + 2: B[(x, y)] = 'c'
        elif x <= L + 1 and y < 18 or up and x < CX + 2: B[(x, y)] = 'Q'
    for (x, y) in B:   # 오른쪽 끝 맨 아래 두 줄은 더 짙게
        if y >= H - 3 and x >= max(xs[y]) - 1: B[(x, y)] = 'd'
    for q in [(7, 6), (8, 6), (6, 7), (7, 7), (5, 8), (6, 9), (9, 5), (10, 5)]:   # 하얀 윤: 평원 슬라임의 「QwwQ」를 키운 꼴
        if q in B: B[q] = 'w'
    for q in [(8, 7), (7, 8), (11, 5)]:
        if q in B: B[q] = 'Q'
    return B


def face(B):
    for x in (11, 12, 19, 20):
        for y in (10, 11, 12, 13): B[(x, y)] = 'K'
    for x in range(13, 19): B[(x, 17)] = 'K'
    B[(12, 16)] = 'K'; B[(19, 16)] = 'K'
    for q in [(11, 10), (19, 10)]: B[q] = 'e'   # 눈 위 칸에 빛 한 점 (게임 슬라임 눈은 K뿐 — 덩치가 커서 눈빛을 넣음)
    return B


def swallowed(B, crown_inside=False):
    """몸속에 비치는 것: 녹빛으로 물든 장검(코등이 · 자루) · 보물 상자 · 금화 무더기 (+ C안은 삼킨 왕관)"""
    def put(cells, c):
        for q in cells:
            if q in B: B[q] = c
    put([(x, 24 - x) for x in range(5, 11)] + [(x, 25 - x) for x in range(5, 11)], 'N')     # 오른쪽 위로 비스듬한 칼날 두 칸 굵기 (눈에 닿지 않게)
    put([(x, 24 - x) for x in range(6, 11, 2)], 'x'); put([(x, 26 - x) for x in range(6, 11)], 'n')
    put([(3, 19), (4, 20), (5, 21), (6, 22)], 'O'); put([(3, 22), (2, 23)], 'O')              # 코등이 · 자루
    chest = {(x, y): 'O' for x in range(20, 27) for y in range(16, 21)}                        # 보물 상자: 뚜껑 둘 · 금테 · 몸통 둘 · 자물쇠
    for x in range(20, 27): chest[(x, 18)] = 'G'
    chest[(23, 18)] = 'y'; chest[(23, 19)] = 'g'
    for x in range(20, 27): chest[(x, 20)] = 'n'
    for y in range(16, 21): chest[(26, y)] = 'n'
    chest[(20, 16)] = 'x'; chest[(21, 16)] = 'x'
    for q, c in chest.items():
        if q in B: B[q] = c
    coins = [(14, 21), (15, 21), (16, 21), (13, 22), (14, 22), (15, 22), (16, 22), (17, 22), (15, 20)]
    put(coins, 'G'); put([(15, 21), (13, 22), (17, 22)], 'g'); put([(15, 20)], 'y')
    for q in [(27, 12), (4, 13), (14, 7), (25, 8), (9, 20)]:
        if B.get(q) in ('C', 'c'): B[q] = 'Q'   # 공기 방울
    if crown_inside:   # C안: 삼킨 왕관 — 칼과 금화 사이에 기울어 걸려 있다 (세 봉우리 · 붉은 보석, 입과 겹치지 않게 아래쪽)
        put([(9, 18), (11, 18), (12, 18), (14, 18)], 'G')
        put([(x, 19) for x in range(9, 15)], 'G'); put([(x, 20) for x in range(9, 15)], 'G'); put([(11, 20), (12, 20)], 'r'); put([(x, 21) for x in range(9, 15)], 'g')
    return B


def crown_top(B):
    """B안: 머리 위 작은 왕관 (세 봉우리 · 붉은 보석) — 몸 위 테에 걸친다"""
    rows = {0: [(12, 'G'), (15, 'G'), (16, 'G'), (19, 'G')],
            1: [(12, 'G'), (13, 'G'), (15, 'G'), (16, 'G'), (18, 'G'), (19, 'G')],
            2: [(12, 'G'), (13, 'G'), (14, 'G'), (15, 'r'), (16, 'r'), (17, 'G'), (18, 'G'), (19, 'G')],
            3: [(12, 'g'), (13, 'G'), (14, 'G'), (15, 'G'), (16, 'G'), (17, 'G'), (18, 'G'), (19, 'g')]}
    for y, cells in rows.items():
        for x, c in cells: B[(x, y)] = c
    return B


def grid(B):
    return '\n'.join(''.join(B.get((x, y), '.') for x in range(W)) for y in range(H))


PAL = {'C': '#5fbf5a', 'c': '#3f8f3c', 'd': '#2a6836', 'Q': '#9fd192', 'w': '#ffffff', 'K': '#143a14', 'e': '#e8ffe0',
       'N': '#a8cca6', 'x': '#eef8e8', 'O': '#9a7a3e', 'M': '#b0d0ac', 'n': '#3a5e40', 'G': '#e8e070', 'g': '#a8a040', 'y': '#fffbd0', 'r': '#d05a4a'}


def make(opt):
    B = face(shade(body_cells()))
    B = swallowed(B, crown_inside=(opt == 'C'))
    if opt == 'B': B = crown_top(B)
    return grid(B)


if __name__ == '__main__':
    out = {k: make(k) for k in 'ABC'}; out['pal'] = PAL
    json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, indent=0)
    print(out['A'])
