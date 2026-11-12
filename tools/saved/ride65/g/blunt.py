"""뭉툭 명암: 큰 면은 한 색 그대로 · 윗가장자리 한 줄만 빛(Q) · 아랫가장자리 두 줄과 오른쪽 가장자리 한 줄만 그늘(c). 줄무늬 · 점 없이."""
def blunt(g, src='C', light='Q', dark='c', bottom=2, side=1, top=1):
    H, W = len(g), len(g[0]); ins = lambda x, y: 0 <= x < W and 0 <= y < H and g[y][x] == src
    cells = [(x, y) for y in range(H) for x in range(W) if g[y][x] == src]
    out = {}
    for (x, y) in cells:
        if any(not ins(x, y + k) for k in range(1, bottom + 1)) or any(not ins(x + k, y) for k in range(1, side + 1)): out[(x, y)] = dark
        elif top and not ins(x, y - 1): out[(x, y)] = light
    for (x, y), ch in out.items(): g[y][x] = ch
    return g
