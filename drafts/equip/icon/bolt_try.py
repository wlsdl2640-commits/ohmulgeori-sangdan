"""볼트 묶음 시험: 화면 칸에서 획으로 (각도 자유)"""
import math
from g4 import Sw
def stroke(s, part, a, b, w, role):
    (x0, y0), (x1, y1) = a, b
    dx, dy = x1 - x0, y1 - y0; L2 = dx * dx + dy * dy
    for y in range(20):
        for x in range(20):
            px, py = x + .5, y + .5
            t = max(0.0, min(1.0, ((px - x0) * dx + (py - y0) * dy) / L2))
            qx, qy = x0 + t * dx, y0 + t * dy
            d = math.hypot(px - qx, py - qy)
            side = (px - qx) * (-dy) + (py - qy) * dx                                 # +: 진행 방향 왼쪽
            if d <= w(t) + 1e-6:
                ch = role(t, side, d)
                if ch: s.put(x, y, part, ch)
def bolt_s(s, tail, ang, L=13.0, head='bodkin', sh=('a', 'b'), fl=('f', 'F'), hd=('h', 'g', 'G')):
    """tail(꼬리 끝, 화면) · ang(도, 화면 위쪽이 −y) 방향으로 길이 L"""
    ux, uy = math.cos(math.radians(ang)), -math.sin(math.radians(ang))
    hx, hy = tail[0] + ux * L, tail[1] + uy * L
    sx, sy = tail[0] + ux * (L - 3.2), tail[1] + uy * (L - 3.2)
    stroke(s, 'blade', tail, (sx, sy), lambda t: 0.75, lambda t, side, d: sh[0] if side > 0 else sh[1])
    HW = {'bodkin': lambda t: 1.3 * (1 - t) + 0.3, 'broad': lambda t: 2.0 * (1 - t) + 0.2, 'chisel': lambda t: 1.2}[head]
    stroke(s, 'head', (sx, sy), (hx, hy), HW, lambda t, side, d: hd[0] if side > 0.3 else (hd[2] if side < -0.3 else hd[1]))
    fx_, fy_ = tail[0] + ux * 3.0, tail[1] + uy * 3.0
    stroke(s, 'grip', tail, (fx_, fy_), lambda t: 1.6 * (1 - 0.4 * t), lambda t, side, d: (fl[0] if side > 0 else fl[1]) if d > 0.6 else None)
def tie(s, c, ang, w=4.2, ch=('r', 'R')):
    ux, uy = math.cos(math.radians(ang)), -math.sin(math.radians(ang)); px, py = -uy, ux
    stroke(s, 'pommel', (c[0] - px * w, c[1] - py * w), (c[0] + px * w, c[1] + py * w), lambda t: 0.8, lambda t, side, d: ch[0] if t < 0.5 else ch[1])
PAL = dict(a='#d8b070', b='#8a6438', h='#e8eef6', g='#a8b0bc', G='#5a6270', f='#e8dcc0', F='#a89c80', r='#8a5a34', R='#4a2e18')
def two():
    s = Sw(); s.fx = {}
    for off in (-2.2, 2.2):
        tail = (3.2 + off * 0.7071, 16.8 + off * 0.7071); bolt_s(s, tail, 45, 14.0)
    tie(s, (8.0, 12.0), 45, 3.6)
    return s
def fan():
    s = Sw(); s.fx = {}
    pv = (5.2, 14.8)
    for ang in (57, 45, 33):
        bolt_s(s, (pv[0] - 1.6 * math.cos(math.radians(ang)), pv[1] + 1.6 * math.sin(math.radians(ang))), ang, 14.0 if ang == 45 else 12.5)
    tie(s, (7.8, 12.2), 45, 3.0)
    return s
def three():
    s = Sw(); s.fx = {}
    for off, L in ((-3.0, 12.5), (0, 14.0), (3.0, 12.5)):
        tail = (3.0 + off * 0.7071, 17.0 + off * 0.7071); bolt_s(s, tail, 45, L)
    tie(s, (7.6, 12.4), 45, 4.6)
    return s
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(f().icon(PAL).render(), n) for f, n in ((two, '둘 나란히'), (fan, '셋 부채'), (three, '셋 나란히(넓게)'))]
    zoomsheet(out, 'bolt_try.png', z=12)
