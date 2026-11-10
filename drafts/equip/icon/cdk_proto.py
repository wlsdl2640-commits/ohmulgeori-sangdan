"""카드 덱 투영 시험: 앞 카드는 똑바로(그림이 읽히게), 뒤 카드 n장이 사선으로 쌓여 두께가 보인다."""
from sh import Sh
from cd import MOTIF
def rr(x, y, x0, y0, w, h):
    """둥근 모서리 사각형 안인가"""
    if not (x0 <= x < x0 + w and y0 <= y < y0 + h): return False
    return not ((x in (x0, x0 + w - 1)) and (y in (y0, y0 + h - 1)))
def stack(s, x0, y0, w, h, n, d):
    """d = (-1, +1): 뒤 카드가 왼쪽 아래로 · (+1, -1): 오른쪽 위로"""
    dx, dy = d
    for k in range(n, 0, -1):
        ax, ay = x0 + dx * k, y0 + dy * k
        g = 'l' if k % 2 else 'L'; G = 'd' if k % 2 else 'D'
        for y in range(ay, ay + h):
            for x in range(ax, ax + w):
                if not rr(x, y, ax, ay, w, h): continue
                if dx < 0: ch = G if y == ay + h - 1 else g          # 왼쪽 면(빛) · 아래 면(그늘)
                else: ch = G if x == ax + w - 1 else g               # 위 면(빛) · 오른쪽 면(그늘)
                s.put(x, y, ch)
def face(s, x0, y0, w, h, motif):
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if not rr(x, y, x0, y0, w, h): continue
            if x in (x0, x0 + w - 1) or y in (y0, y0 + h - 1):
                s.put(x, y, 'e' if (x == x0 or y == y0) else 'E')
            else:
                s.put(x, y, 'b' if (x == x0 + w - 2 or y == y0 + h - 2) else 'a')
    g = MOTIF[motif]; mx = x0 + w // 2 - 3; my = y0 + (h - 7) // 2
    for j, r in enumerate(g):
        for i, ch in enumerate(r):
            if ch != '.': s.put(mx + i, my + j, ch)
    s.put(x0 + 1, y0 + 1, 'm'); s.put(x0 + w - 2, y0 + h - 2, 'm')
PAL = dict(a='#fbf8f0', b='#d8d0c0', E='#8a8278', e='#c8c0b4', m='#2a2630',
           L='#efe6d2', l='#b8ac94', D='#a89c84', d='#6e6450',
           **{'1': '#2a2630', '2': '#14121a', '3': '#8a8494'})
def v(x0, y0, w, h, n, d, motif='club'):
    s = Sh(); stack(s, x0, y0, w, h, n, d); face(s, x0, y0, w, h, motif); return s
if __name__ == '__main__':
    from zoomv import zoomsheet
    V = [(v(7, 1, 11, 14, 4, (-1, 1)), 'DL4'), (v(7, 1, 11, 13, 5, (-1, 1)), 'DL5'),
         (v(2, 5, 11, 14, 4, (1, -1)), 'UR4'), (v(2, 6, 11, 13, 5, (1, -1)), 'UR5')]
    zoomsheet([(s.icon(PAL).render(), k) for s, k in V], 'cdk_proto.png', z=10)
