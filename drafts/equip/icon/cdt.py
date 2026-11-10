"""트럼프 카드 덱 — 사선(무기처럼 45°로 눕힌 카드) 시안. 11-10 19:45 사용자: "너무 두껍다 · 내가 말한 사선은 저게 아냐".
카드 긴 쪽이 무기 축(왼쪽 아래 → 오른쪽 위)을 따라 눕고, 뒤 카드 한두 장이 아래로 비쳐 얇은 두께가 보인다.
좌표: u = 카드 위쪽(오른쪽 위로 +) · v = 카드 오른쪽(오른쪽 아래로 +). 화면 x = (u + v + 19) / 2 · y = (v − u + 17) / 2 (u + v 홀수).
그림은 카드 좌표에서 정한 모양을 칸마다 뽑는다 (눕힌 하트 · 다이아 · 스페이드 · 클로버)."""
import math
from sh import Sh
LU, LV = 9, 6
def XY(u, v): return (u + v + 19) // 2, (v - u + 17) // 2
def UVt(x, y): return x - y + 1, x + y - 18
def inside(u, v, lu=LU, lv=LV):
    if (u + v) % 2 == 0 or abs(u) > lu or abs(v) > lv: return False
    return not (abs(u) == lu and abs(v) == lv)
def cells(lu=LU, lv=LV):
    for u in range(-lu, lu + 1):
        for v in range(-lv, lv + 1):
            if inside(u, v, lu, lv): yield u, v
def stack(s, n, d=(0, 1)):
    """뒤 카드 n장: 화면에서 d만큼씩 물러난다. 보이는 칸이 어느 변 밑인지에 따라 L(짧은 변 · 빛) / D(긴 변 · 그늘)"""
    dx, dy = d
    for k in range(n, 0, -1):
        for u, v in cells():
            x, y = XY(u, v); x += dx * k; y += dy * k
            ub, vb = UVt(x, y)
            if inside(ub, vb): continue
            side = 'D' if vb > LV - 1 or ub > LU - 1 else 'L'
            s.put(x, y, side if k == 1 else side.lower())
def face(s, motif=None, mfn=None):
    for u, v in cells():
        x, y = XY(u, v)
        if abs(u) >= LU - 1 or abs(v) >= LV - 1:
            s.put(x, y, 'e' if (u >= LU - 1 or v <= -LV + 1) else 'E')
        else:
            s.put(x, y, 'b' if v >= LV - 2 else 'a')
    if mfn:
        for u, v in cells(LU - 2, LV - 2):
            ch = mfn(v / 3.2, u / 3.2)                 # 카드 좌표 X = 오른쪽 · Y = 위
            if ch: s.put(*XY(u, v), ch)
def heart(X, Y):
    Y = Y + 0.15
    f = (X * X + Y * Y - 1) ** 3 - X * X * Y ** 3
    if f > 0: return None
    return '3' if (X < -0.35 and Y > 0.25) else ('2' if (X > 0.45 and Y < -0.1) else '1')
def diamond(X, Y):
    t = abs(X) / 0.72 + abs(Y) / 1.18
    if t > 1: return None
    return '3' if (X < 0 and Y > 0 and t > 0.45) else ('2' if (X > 0 and Y < 0) else '1')
def spade(X, Y):
    h = heart(X, -Y + 0.35)
    stem = (-1.35 <= Y <= -0.55 and abs(X) <= 0.18 + 0.5 * max(0, -0.95 - Y))
    if h or stem: return '3' if (X < -0.35 and Y > 0.25) else '1'
    return None
def club(X, Y):
    for cx, cy in ((0, 0.62), (-0.6, -0.05), (0.6, -0.05)):
        if (X - cx) ** 2 + (Y - cy) ** 2 <= 0.36: return '3' if (X - cx < -0.15 and Y - cy > 0.1) else '1'
    if -1.35 <= Y <= 0.1 and abs(X) <= 0.18 + 0.5 * max(0, -0.85 - Y): return '1'
    return None
PAPER = dict(L='#efe6d2', l='#9a8e76', D='#b8ac94', d='#6e6450', e='#d0c8bc', E='#8a8278', a='#fbf8f0', b='#e2dacb')
RED = {'1': '#d8302e', '2': '#8a1a1a', '3': '#ff9a8a'}
BLK = {'1': '#2a2630', '2': '#14121a', '3': '#8a8494'}
def deck(n, d, mfn):
    s = Sh(); stack(s, n, d); face(s, mfn=mfn); return s
if __name__ == '__main__':
    from zoomv import zoomsheet
    V = [(deck(2, (0, 1), heart), dict(PAPER, **RED), 'T2 heart'), (deck(1, (0, 1), spade), dict(PAPER, **BLK), 'T1 spade'),
         (deck(2, (0, 1), diamond), dict(PAPER, **RED), 'T2 dia'), (deck(2, (0, 1), club), dict(PAPER, **BLK), 'T2 club'),
         (deck(2, (1, 1), heart), dict(PAPER, **RED), 'R2 heart')]
    zoomsheet([(s.icon(p).render(), k) for s, p, k in V], 'cdt_proto.png', z=10)
