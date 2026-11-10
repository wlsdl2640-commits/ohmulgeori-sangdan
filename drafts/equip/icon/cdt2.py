"""사선 덱 시안 셋 (두께 2칸): ① 무기처럼 45° 눕힌 카드 · ② 비스듬히 돌려 세운 카드(위아래 변이 사선) · ③ 탁자에 놓인 덱을 비스듬히(옆 변이 사선)"""
from sh import Sh
import cdt
HEART_T = [".11...", "1111..", "11111.", "111111", "111111", "11111."]          # 45° 눕힌 하트: 끝이 왼쪽 아래 · 두 볼이 위 · 오른쪽
HEART = [".11.11.", "1311111", "1311111", ".11111.", "..112..", "...1..."]   # 바로 선 하트
def rim_face(s, pts, lit):
    """pts = 앞 카드 칸 집합. 화면 4이웃이 바깥이면 테(빛 쪽 e · 그늘 쪽 E)"""
    for (x, y) in pts:
        edge = any((x + dx, y + dy) not in pts for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        s.put(x, y, ('e' if lit(x, y) else 'E') if edge else 'a')
def v1():
    """① 45° 눕힌 카드: 긴 쪽이 무기 축 · 뒤 카드 두 장이 아래로 비친다"""
    s = Sh(); cdt.stack(s, 2, (0, 1))
    pts = set(cdt.XY(u, v) for u, v in cdt.cells())
    rim_face(s, pts, lambda x, y: cdt.UVt(x, y)[1] <= 0)
    for j, r in enumerate(HEART_T):
        for i, ch in enumerate(r):
            if ch != '.': s.put(6 + i, 6 + j, ch)
    return s
def v2():
    """② 돌려 세운 카드: 앞면은 평행사변형(위아래 변이 오른쪽으로 올라감) · 오른쪽에 두께 두 줄"""
    s = Sh(); x0, W, H, yb = 4, 10, 13, 6
    top = lambda x: yb - (x - x0) // 2
    pts = set()
    for x in range(x0, x0 + W):
        for y in range(top(x), top(x) + H): pts.add((x, y))
    for k in (2, 1):                                                   # 두께: 오른쪽 두 줄 (같은 기울기)
        x = x0 + W - 1 + k
        for y in range(top(x) + 1, top(x) + H - 1 + (1 if k == 1 else 0)): s.put(x, y, 'D' if k == 1 else 'd')
    pts -= {(x0, top(x0)), (x0, top(x0) + H - 1), (x0 + W - 1, top(x0 + W - 1)), (x0 + W - 1, top(x0 + W - 1) + H - 1)}
    rim_face(s, pts, lambda x, y: x == x0 or y == top(x))
    for j, r in enumerate(HEART):
        for i, ch in enumerate(r):
            if ch != '.':
                x = x0 + 2 + i; s.put(x, top(x) + 4 + j, ch)
    return s
def v3():
    """③ 탁자에 놓인 덱: 앞면이 오른쪽으로 기운 평행사변형(옆 변이 사선) · 앞쪽에 두께 두 줄"""
    s = Sh(); y0, H, W, xb = 3, 12, 11, 2
    left = lambda y: xb + (y0 + H - 1 - y) // 3
    pts = set()
    for y in range(y0, y0 + H):
        for x in range(left(y), left(y) + W): pts.add((x, y))
    for k in (2, 1):                                                   # 두께: 아래 두 줄
        y = y0 + H - 1 + k
        for x in range(left(y0 + H - 1) + 1 - (1 if k == 1 else 0) * 0, left(y0 + H - 1) + W - 1): s.put(x, y, 'D' if k == 1 else 'd')
    pts -= {(left(y0), y0), (left(y0) + W - 1, y0), (left(y0 + H - 1), y0 + H - 1), (left(y0 + H - 1) + W - 1, y0 + H - 1)}
    rim_face(s, pts, lambda x, y: y == y0 or x == left(y))
    for j, r in enumerate(HEART):
        for i, ch in enumerate(r):
            if ch != '.':
                y = y0 + 3 + j; s.put(left(y) + 2 + i, y, ch)
    return s
PAL = dict(cdt.PAPER, **cdt.RED)
if __name__ == '__main__':
    from zoomv import zoomsheet
    zoomsheet([(f().icon(PAL).render(), k) for f, k in ((v1, '1'), (v2, '2'), (v3, '3'))], 'cdt2_proto.png', z=12)
