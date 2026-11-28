# C 디자인 지팡이 2(흰 나무 · 은빛 새장)의 막대를 한 줄로 곧게 — 머리 아래 가운데에서 쥔 손 가운데를 지나 아래로 (11-28 대표님 「위아래 막대가 안 맞물리고 삐뚤어짐」)
from PIL import Image; import numpy as np, sys
src, out = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert('RGBA'))
B = (0, 0, 0, 255); LT = (248, 215, 185, 255); MD = (216, 187, 142, 255); SH = (159, 136, 107, 255); FE = (142, 143, 161, 255)
P = np.array([50, 83, 125])
x0, y0, x1, y1 = 82.0, 59.0, 75.5, 75.0          # 머리 아래 가운데 → 손 가운데
k = (x1 - x0) / (y1 - y0); cx = lambda y: x0 + k * (y - y0)
# 지우기: 위 막대(60~70줄 · 72칸부터) · 아래 막대(80~93줄 · 겉옷 끝 다음 칸부터)
for y in range(60, 70): a[y, 72:90] = 0          # 70 ~ 79줄은 쥔 손 — 건드리지 않는다
for y in range(80, 94):
    ps = [x for x in range(60, 80) if (a[y, x, :3] == P).all()]
    e = (max(ps) + 2) if ps else 68
    a[y, e:80] = 0
def put(y):
    c = int(round(cx(y)))
    a[y, c - 2] = B; a[y, c - 1] = LT; a[y, c] = MD; a[y, c + 1] = SH; a[y, c + 2] = B
    if y % 4 == 0: a[y, c - 1] = MD; a[y, c] = SH          # 나선 홈
for y in list(range(60, 70)) + list(range(80, 99)): put(y)
c = int(round(cx(99))); a[99, c - 2:c + 3] = [B, FE, FE, FE, B]; a[100, c - 1:c + 2] = [B, B, B]   # 아래 쇠 끝
Image.fromarray(a).save(out)
