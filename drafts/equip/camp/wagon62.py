"""코네스토가 웨건 (옆모습, 앞이 오른쪽) — 짐꾼 계열 3차 코네스토가의 웨건 (11-11 00:34 사용자, 사진은 꼴만 참고).
흰 천 덮개(양 끝이 높이 들린 활꼴 · 테 줄) · 배꼴 푸른 짐칸(가운데가 처진 위 띠) · 붉은 바퀴(뒤가 크다) · 바퀴살 · 쇠 테 · 앞 끌채.
글자: 덮개 C c(그늘) d(테) e(끝 구멍) · 짐칸 B b(널빤지 틈) k(위 띠) K · 바퀴 R r(살) T(쇠 테) h(통) · 받침 v V · 끌채 w W
python3 wagon62.py → wagon62.json (rows)"""
import math, json
W, H = 80, 50
g = [['.'] * W for _ in range(H)]
def put(x, y, ch):
    x, y = int(round(x)), int(round(y))
    if 0 <= x < W and 0 <= y < H: g[y][x] = ch
def lerp(a, b, t): return a + (b - a) * t
# 짐칸 위 띠 · 바닥 (가운데가 처진 배꼴): x 6..72
def top_rail(x): return 20 + 3.2 * math.sin(math.pi * (x - 6) / 66)          # 가운데가 낮다(값이 크다)
def floor(x): return 29 + 1.6 * math.sin(math.pi * (x - 8) / 62)
# 덮개 윗줄: 끝이 높고 가운데가 살짝 처짐 · 양 끝이 바깥으로 더 나간다
def cover_top(x): return 2.0 + 6.0 * math.sin(math.pi * (x - 2) / 74) ** 0.8
X0, X1 = 2, 76                     # 덮개 끝 (짐칸보다 바깥)
# 받침(바퀴 사이 굴대 · 들보)
for x in range(14, 62):
    put(x, 31, 'V'); put(x, 32, 'v')
# 덮개
for x in range(X0, X1 + 1):
    yt = cover_top(x)
    # 끝은 비스듬히: 덮개 아래끝 = 짐칸 위 띠, 끝에서는 바깥으로 기울어 올라간다
    if x < 7: yb = lerp(top_rail(7) - 7, top_rail(7), (x - X0) / 5.0)        # 끝이 짐칸 밖으로 비스듬히 나온다
    elif x > 71: yb = lerp(top_rail(71), top_rail(71) - 7, (x - 71) / 5.0)
    else: yb = top_rail(x)
    for y in range(int(math.floor(yt)), int(math.ceil(yb))):
        k = (y - yt) / max(1.0, yb - yt)
        ch = 'C' if k < 0.72 else 'c'
        put(x, y, ch)
    put(x, int(math.floor(yt)), 'c' if x in (X0, X1) else 'C')
# 테(활꼴 막대) 줄: 덮개를 가로지르는 짙은 줄 — 끝으로 갈수록 기운다
for bx in (10, 19, 28, 38, 48, 57, 66):
    lean = (bx - 38) / 38.0
    for y in range(0, 26):
        x = bx + lean * (y - 18) * 0.25
        if (int(round(x)), y) and 0 <= y < H and g[y][int(round(x))] in 'Cc': put(x, y, 'd')
# 끝 구멍(뒤 · 앞 덮개를 오므린 구멍)
for (cx, cy) in ((4.6, 13.0), (73.4, 12.6)):
    for y in range(H):
        for x in range(W):
            if ((x + .5 - cx) / 1.8) ** 2 + ((y + .5 - cy) / 4.2) ** 2 <= 1.0 and g[y][x] in 'Ccd': g[y][x] = 'e'
# 짐칸: 위 띠(붉은 갈색 두 줄) · 푸른 판 · 판 틈 · 바닥 띠
for x in range(6, 73):
    yt, yb = top_rail(x), floor(x)
    for y in range(int(math.floor(yt)), int(math.ceil(yb)) + 1):
        if y < yt + 1.6: ch = 'k' if y < yt + 0.8 else 'K'
        elif y >= yb - 0.6: ch = 'K'
        else: ch = 'b' if (x - 6) % 6 == 0 else 'B'
        put(x, y, ch)
# 바퀴: 뒤(왼쪽, 큰) · 앞(오른쪽, 작은)
def wheel(cx, cy, r, n):
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + .5 - cx, y + .5 - cy)
            if d <= r + 0.2:
                if d > r - 1.0: g[y][x] = 'T'
                elif d > r - 2.2: g[y][x] = 'R'
                elif d < 1.6: g[y][x] = 'h'
                else:
                    a = math.atan2(y + .5 - cy, x + .5 - cx)
                    on = min(abs(((a * n / (2 * math.pi)) % 1) - 0), abs(((a * n / (2 * math.pi)) % 1) - 1)) < 0.18
                    if on: g[y][x] = 'r'
wheel(17.5, 38.5, 10.0, 12)
wheel(59.5, 40.5, 8.0, 10)
# 앞 끌채: 앞 굴대에서 오른쪽 아래 땅으로
for i in range(0, 15):
    x = 64 + i; y = 37 + i * 0.6
    put(x, y, 'w'); put(x, y + 1, 'W')
rows = [''.join(r) for r in g]
# 비어 있는 위 · 오른쪽 줄 자르기는 하지 않는다 (닻: 아래 가운데)
json.dump({'rows': rows, 'w': W, 'h': H}, open(__file__.replace('.py', '.json'), 'w'), indent=0)
print('\n'.join(rows))
