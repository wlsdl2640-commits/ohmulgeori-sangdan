"""방패 그림판 — 앞 그림(장비 그림 20×20, 좌우 대칭: 가운데 (10, 10)) + 옆면(원정 옆모습, 뭉툭 칸).
옆면: 캐릭터가 오른쪽(원정 진행 방향)을 볼 때 왼팔에 든 방패를 옆에서 본 두께 — 왼쪽 = 몸 쪽(방패 뒤), 오른쪽 = 적 쪽(방패 앞).
글자(앞 그림): 테 E e(빛) · 얼굴 a b c(빛 → 그늘) · 무늬 d D · 판자 틈 s · 징 t · 돌기 p o x O Q · 보석 z Z u · 띠 m M
옆면 글자: K 뒤(나무/안감) · F 얼굴 가장자리 · E 테 · O 돌기 · z 보석 · L 막(에테르)"""
import math
from wic import Ico, N
CX = CY = 10.0
def d_of(x, y, cx=CX, cy=CY): return math.hypot(x + .5 - cx, y + .5 - cy)
def t_of(x, y, cx=CX, cy=CY, r=9.0): return ((x + .5 - cx) + (y + .5 - cy)) / r     # −: 왼쪽 위(빛) · +: 오른쪽 아래
def sh3(t, a, b, c, lo=-0.45, hi=0.55): return a if t < lo else (c if t > hi else b)
class Sh:
    def __init__(s):
        s.body = {}; s.fx = {}
    def put(s, x, y, ch):
        if 0 <= x < N and 0 <= y < N: s.body[(x, y)] = ch
    def fill(s, test, role):
        for y in range(N):
            for x in range(N):
                if test(x, y):
                    ch = role(x, y)
                    if ch: s.body[(x, y)] = ch
    def icon(s, pal):
        ic = Ico(pal); ic.body = dict(s.body); ic.fx = dict(s.fx); return ic
    def sym_err(s):
        return [(x, y) for (x, y) in s.body if (19 - x, y) not in s.body]
def dome(s, cx, cy, r, ring=True):
    """돌기(둥근 쇠): 하이라이트 p · 빛 o · 가운데 x · 그늘 O · 둘레 그림자 Q"""
    def role(x, y):
        d = d_of(x, y, cx, cy)
        dx, dy = x + .5 - cx, y + .5 - cy
        if ring and d > r - 0.85: return 'Q' if dx + dy > -0.6 else 'O'
        if -1.3 * r / 2.6 < dx < -0.1 and -1.3 * r / 2.6 < dy < -0.1 and d < r * 0.62: return 'p'
        return sh3((dx + dy) / r, 'o', 'x', 'O', -0.35, 0.45)
    s.fill(lambda x, y: d_of(x, y, cx, cy) <= r, role)
def rivets(s, cx, cy, r, n, ch='t', phase=0.0):
    """징 n개 — 왼쪽 반을 찍고 좌우로 비춘다 (늘 대칭)"""
    for k in range(n):
        a = phase + 2 * math.pi * k / n
        x = int(math.floor(cx + r * math.cos(a) + .5)); y = int(math.floor(cy + r * math.sin(a) + .5))
        if x <= 9: s.put(x, y, ch); s.put(19 - x, y, ch)
def mirror_fix(s):
    """좌우 대칭이 아닌 칸은 왼쪽 것을 오른쪽에 비춘다 (명암 글자는 둔다)"""
    for (x, y), ch in list(s.body.items()):
        if (19 - x, y) not in s.body: s.body[(19 - x, y)] = ch

# ───────── 옆면 (뭉툭 칸 격자, 한 칸 = 게임 2×2 픽셀) ─────────
PROF = {
    # 라운드: 뒤(나무) · 얼굴 가장자리 두 칸 두께 + 위아래 테 · 가운데 돌기가 앞(적 쪽)으로 볼록
    'round': [".E.",
              "KF.",
              "KF.",
              "KFO",
              "KF.",
              "KF.",
              ".E."],
    # 버클러: 작고 돌기가 크게 솟는다
    'buckler': [".E..",
                "KFO.",
                "KFOO",
                "KFO.",
                ".E.."],
    # 십자(히터): 키가 크고 아래로 갈수록 좁아져 뾰족
    'cross': ["EE",
              "KF",
              "KF",
              "KF",
              "KF",
              "KF",
              ".F",
              ".E"],
    # 에테르: 구슬(2×2) + 적 쪽에 세운 마나 막 — 옆에서 보면 얇은 활 ')'
    'ether': ["..L.",
              "...L",
              "OO.L",
              "OO.L",
              "...L",
              "..L."],
}
def prof_img(kind, pal, z=3, chunk=2, extra=None):
    """옆면 그림 → {(x, y): rgb} (뭉툭 칸 × chunk 픽셀). 테두리는 검정 1픽셀"""
    from wic import hexc, OUT
    rows = PROF[kind]
    cells = {}
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch == '.': continue
            col = pal.get('P' + ch) or pal.get(ch)
            for a in range(chunk):
                for b in range(chunk): cells[(i * chunk + a, j * chunk + b)] = hexc(col)
    glow = {k for k in cells if rows[k[1] // chunk][k[0] // chunk] == 'L'}     # 막은 테두리 없이 빛처럼
    out = {}
    for (x, y) in cells:
        if (x, y) in glow: continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in cells: out[q] = hexc(OUT)
    out.update(cells)
    return {(x + 1, y + 1): c for (x, y), c in out.items()}
