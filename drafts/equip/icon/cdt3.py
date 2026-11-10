"""사선 덱 (무기처럼 45°로 눕힌 카드 한 벌) 시안 — 11-10 19:45 "너무 두껍다 · 사선은 저게 아냐" 뒤.
카드: 긴 변이 무기 축(왼쪽 아래 → 오른쪽 위). 꼭짓점 위 (11,1) · 오른쪽 (17,7) · 아래 (8,16) · 왼쪽 (2,10).
두께: 뒤 카드 두 장이 한 칸씩 아래로 비친다(왼쪽 아래 짧은 변 밑 L l · 오른쪽 아래 긴 변 밑 D d).
앞면 고리: 바깥 테(#) · 둘째 고리(+, 화려한 테 띠) · 안(o). 그림은 화면 칸에 손으로 그린다(눕힌 모양)."""
from sh import Sh
def inside(u, v, lu=9, lv=6): return (u + v) % 2 == 1 and abs(u) <= lu and abs(v) <= lv
def XY(u, v): return (u + v + 19) // 2, (v - u + 17) // 2
def UV(x, y): return x - y + 1, x + y - 18
CARD = set(XY(u, v) for u in range(-9, 10) for v in range(-6, 7) if inside(u, v))
def ring(S):
    return set(p for p in S if all((p[0] + dx, p[1] + dy) in S for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))))
IN1 = ring(CARD); IN2 = ring(IN1)
RIM = CARD - IN1; BAND = IN1 - IN2
def lit(x, y):
    u, v = UV(x, y); return v < 0 or (u > 0 and v <= 0)
def stack(s, n=2):
    for k in range(n, 0, -1):
        for (x, y) in CARD:
            q = (x, y + k)
            if q in CARD: continue
            u, v = UV(*q)
            side = 'D' if v >= 5 else 'L'                       # 긴 변 밑(오른쪽 아래) = 그늘 · 짧은 변 밑(왼쪽 아래) = 빛
            s.put(q[0], q[1], side if k == 1 else side.lower())
def base(s, paper='a', inner=None):
    for (x, y) in CARD:
        if (x, y) in RIM: s.put(x, y, 'e' if lit(x, y) else 'E')
        else: s.put(x, y, inner if (inner and (x, y) in IN2) else paper)
def art(s, rows, x0, y0, only=None):
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            p = (x0 + i, y0 + j)
            if ch != '.' and p in (only or IN1): s.put(p[0], p[1], ch)
def band(s):
    """화려한 테: 둘째 고리를 보석 띠로 — 띠 q · 점 Q(한 칸 걸러) · 네 꼭짓점 보석 Y"""
    corners = {(11, 3), (15, 7), (8, 14), (4, 10)}
    for (x, y) in BAND:
        if (x, y) in corners: s.put(x, y, 'Y')
        else: s.put(x, y, 'Q' if (x + y) % 2 == 0 and (x - y) % 4 == 0 else 'q')
def gold_in(s):
    """띠 안쪽 금줄"""
    for p in IN2 - ring(IN2): s.put(p[0], p[1], 'g' if lit(*p) else 'G')
HEART = ["..111..",        # 눕힌 하트: 끝이 왼쪽 아래 · 두 볼이 위 · 오른쪽 · 오목한 데가 오른쪽 위
         ".13111.",
         ".131111",
         ".111111",
         ".111111",
         ".11111.",
         ".1111.."]
SPADE = ["...1111",        # 눕힌 스페이드: 뾰족한 끝이 오른쪽 위 · 두 볼이 왼쪽 · 아래 · 자루가 왼쪽 아래로
         "..13111",
         ".131111",
         ".111111",
         "1111111",
         ".1.111.",
         "1..11.."]
DIAMOND = ["....11",       # 눕힌 다이아: 긴 축이 사선
           "...131",
           "..1311",
           ".1111.",
           "1111..",
           "11...."]
MOON = ["....33",          # 초승달 · 별 (밤하늘)
        "...3..",
        "..3...",
        "..3...",
        "...3..",
        "....33"]
def heart_deck():
    s = Sh(); stack(s); base(s); art(s, HEART, 6, 5); return s
def spade_deck():
    s = Sh(); stack(s); base(s); art(s, SPADE, 6, 5); return s
def ornate_deck():
    s = Sh(); stack(s); base(s); band(s); gold_in(s); art(s, DIAMOND, 7, 6, only=ring(ring(IN2)) | (IN2 - ring(IN2))); return s
def moon_deck():
    s = Sh(); stack(s); base(s, inner='0')
    for p in BAND: s.put(p[0], p[1], '0')
    art(s, ["..77", ".79.", "79..", "79..", ".79.", "..77"], 8, 5)
    for p in ((12, 5), (13, 8), (6, 9), (11, 11), (14, 6)): s.put(p[0], p[1], '3')
    return s
PAPER = dict(L='#efe6d2', l='#9a8e76', D='#b8ac94', d='#6e6450', e='#d0c8bc', E='#8a8278', a='#fbf8f0', b='#e2dacb')
BLACK = dict(L='#a8323e', l='#5a1a24', D='#6a1a24', d='#2a0c12', e='#5a5464', E='#1e1a24', a='#2e2a36')
GILT = dict(L='#ffe890', l='#c89028', D='#d8a838', d='#8a5a10', e='#f0c860', E='#a87018', a='#fffbea')
ORN = dict(q='#8a1a2a', Q='#f0c040', Y='#ff4a5a', g='#f0c040', G='#a87018')
RED = {'1': '#d8302e', '2': '#8a1a1a', '3': '#ff9a8a'}
SIL = {'1': '#e8eef6', '2': '#8a94a8', '3': '#ffffff'}
if __name__ == '__main__':
    from zoomv import zoomsheet
    V = [(heart_deck(), dict(PAPER, **RED), 'heart'), (spade_deck(), dict(BLACK, **SIL), 'spade'),
         (ornate_deck(), dict(GILT, **ORN, **RED), 'ornate'), (moon_deck(), dict(PAPER, **{'0': '#26307a', '7': '#f0c040', '9': '#fff2a0', '3': '#fffbd0'}), 'moon')]
    zoomsheet([(s.icon(p).render(), k) for s, p, k in V], 'cdt3_proto.png', z=12)
