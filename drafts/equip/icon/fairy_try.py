import math, sys
def ell(cx, cy, ux, uy, a, b, xs=range(10)):
    S = set(); n = math.hypot(ux, uy); ux, uy = ux / n, uy / n
    for y in range(20):
        for x in xs:
            px, py = x + .5 - cx, y + .5 - cy
            p = px * ux + py * uy; q = -px * uy + py * ux
            if (p / a) ** 2 + (q / b) ** 2 <= 1: S.add((x, y))
    return S
def disc(cx, cy, r):
    return {(x, y) for y in range(20) for x in range(20) if math.hypot(x + .5 - cx, y + .5 - cy) <= r}
def adj8(p, S):
    x, y = p
    return any((x + dx, y + dy) in S for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy)
def adj4(p, S):
    x, y = p
    return any((x + dx, y + dy) in S for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
def build(hc=(10.0, 7.0), hr=3.0, up=(4.3, 6.8, -5.5, -7, 4.5, 2.4), lo=(4.6, 13.3, -5.5, 4, 3.2, 1.7)):
    head = disc(*hc, hr)
    ant = {(9, 3), (8, 2), (10, 3), (11, 2)}
    dress = set()
    for y, (x0, x1) in {10: (9, 10), 11: (8, 11), 12: (8, 11), 13: (7, 12), 14: (7, 12), 15: (6, 13)}.items():
        for x in range(x0, x1 + 1): dress.add((x, y))
    U = {p for p in ell(*up) if p not in head and not adj8(p, head | ant)}
    L = {p for p in ell(*lo) if p not in U and not adj4(p, U) and p not in dress}
    U -= dress
    mir = lambda S: S | {(19 - x, y) for x, y in S}
    return head, ant, dress, mir(U), mir(L)
def show(parts):
    head, ant, dress, U, L = parts
    for y in range(20):
        row = ''
        for x in range(20):
            p = (x, y)
            row += 'H' if p in head else 'a' if p in ant else 'D' if p in dress else 'U' if p in U else 'L' if p in L else '.'
        print(row)
if __name__ == '__main__':
    show(build())
