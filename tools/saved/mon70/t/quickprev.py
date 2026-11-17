"""시안 격자 빠른 미리보기 (게임 굽기 아님): python3 quickprev.py <json> <키> <출력.png> [배율]  — 칸 2×2 + 바깥 검은 테"""
import json, sys
from PIL import Image
d = json.load(open(sys.argv[1])); k = sys.argv[2]; Z = int(sys.argv[4]) if len(sys.argv) > 4 else 3
rows = d[k].split('\n'); pal = d['pal'][k]; H = len(rows); W = max(map(len, rows))
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
im = Image.new('RGB', ((W + 2) * 2, (H + 2) * 2), (42, 44, 54)); px = im.load()
fill = lambda x, y, c: [px.__setitem__(((x + 1) * 2 + i, (y + 1) * 2 + j), c) for i in (0, 1) for j in (0, 1)]
at = lambda x, y: rows[y][x] if 0 <= y < H and 0 <= x < len(rows[y]) else '.'
for y in range(-1, H + 1):
    for x in range(-1, W + 1):
        ch = at(x, y)
        if ch != '.': fill(x, y, hx(pal.get(ch, '#ff00ff')))
        elif any(at(x + a, y + b) != '.' for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))): fill(x, y, (20, 14, 40))
im.resize((im.width * Z, im.height * Z), Image.NEAREST).save(sys.argv[3]); print(sys.argv[3], W, H)
# 갇힌 빈 칸(구멍) 세기
seen = set(); st = [(x, y) for x in range(-1, W + 1) for y in (-1, H)] + [(x, y) for y in range(-1, H + 1) for x in (-1, W)]
while st:
    q = st.pop()
    if q in seen or not (-1 <= q[0] <= W and -1 <= q[1] <= H) or at(*q) != '.': continue
    seen.add(q); x, y = q; st += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
holes = [(x, y) for y in range(H) for x in range(W) if at(x, y) == '.' and (x, y) not in seen]
print('holes', len(holes), holes[:12])
