"""눕힌 카드 무늬를 모양 함수로 칸에 찍는다(칸마다 4×4 표본, 덮인 몫이 th 넘으면 칠함). 카드 좌표 X = 오른쪽(화면 오른쪽 아래) · Y = 위(화면 오른쪽 위)."""
import math
R2 = math.sqrt(2)
def heart(X, Y):
    for cx in (-0.5, 0.5):
        if (X - cx) ** 2 + (Y - 0.42) ** 2 <= 0.56 ** 2: return True
    return -1.05 <= Y <= 0.5 and abs(X) <= 1.06 * (Y + 1.05) / 1.47
def spade(X, Y):
    if heart(X, -Y + 0.3): return True
    return -1.45 <= Y <= -0.4 and abs(X) <= 0.14 + 0.62 * max(0.0, -0.95 - Y)
def club(X, Y):
    for cx, cy in ((0, 0.55), (-0.56, -0.12), (0.56, -0.12)):
        if (X - cx) ** 2 + (Y - cy) ** 2 <= 0.44 ** 2: return True
    if abs(X) <= 0.3 and -0.2 <= Y <= 0.5: return True
    return -1.45 <= Y <= -0.1 and abs(X) <= 0.12 + 0.6 * max(0.0, -0.95 - Y)
def diamond(X, Y): return abs(X) / 0.72 + abs(Y) / 1.12 <= 1
def star4(X, Y):
    a, b = abs(X), abs(Y)
    return (a <= 0.16 and b <= 1.1) or (b <= 0.16 and a <= 1.1) or (a + b <= 0.55)
def raster(fn, k, cx=10.0, cy=9.0, th=0.45, keep=None):
    out = set()
    for y in range(20):
        for x in range(20):
            n = 0
            for sy in range(4):
                for sx in range(4):
                    dx = x + (sx + 0.5) / 4 - cx; dy = y + (sy + 0.5) / 4 - cy
                    X = (dx + dy) / (R2 * k); Y = (dx - dy) / (R2 * k)
                    if fn(X, Y): n += 1
            if n / 16 > th and (keep is None or (x, y) in keep): out.add((x, y))
    return out
def shade(px, fn, k, cx=10.0, cy=9.0):
    """빛(왼쪽 위 = 화면) 3 · 그늘 2 · 몸 1: 칸의 위·왼쪽이 비면 빛, 아래·오른쪽이 비면 그늘"""
    d = {}
    for (x, y) in px:
        up = (x, y - 1) not in px or (x - 1, y) not in px
        dn = (x, y + 1) not in px or (x + 1, y) not in px
        d[(x, y)] = '3' if (up and not dn) else ('2' if (dn and not up) else '1')
    return d
if __name__ == '__main__':
    import cdt3
    for name, fn, k in (('heart', heart, 3.3), ('spade', spade, 3.0), ('club', club, 3.0), ('diamond', diamond, 3.4), ('star4', star4, 3.6)):
        px = raster(fn, k, keep=cdt3.IN1)
        print(name, len(px))
        for y in range(1, 18):
            print(''.join('#' if (x, y) in px else ('-' if (x, y) in cdt3.CARD else '.') for x in range(1, 19)))
