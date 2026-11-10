"""단검 원형 D(고리 — 쿠나이 닮음) 대신 쓸 원형 후보 5 (11-10 19:16 사용자) + 침 시안 4.
축 x + y = 19, 자루는 축 위 · 축 대칭 (날은 휘거나 외날이면 비대칭일 수 있음)."""
import math
import g4
g4.AX = 19
from g4 import Sw
from g4d import region, edge_of
from dg import pom3, BALL, rbody, gbody, bl5, P
from wic import N

def d_curve():
    """휜 단검: 양날이 칼끝 쪽에서 그늘 쪽으로 휜다 · 넓은 목테 · 잘록한 손잡이 · 넓게 벌어진 자루 끝"""
    s = Sw(); s.fx = {}
    c = lambda u: 0 if u <= 6 else (u - 6) * 0.32
    hw = lambda u: 2.0 if u <= 5 else max(0, 2.0 * (17 - u) / 12)
    def role(u, v):
        h = hw(u); d = v - c(u)
        if d <= -h + 0.9: return 'w'
        if d >= h - 0.9: return 'n'
        if abs(d) < 0.6: return 'c'
        return 'b' if d < 0 else 'B'
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v - c(u)) <= hw(u) + 1e-6, role)
    region(s, 'guard', lambda u, v: u in (-1, -2) and abs(v) <= (3 if u == -1 else 2), gbody)           # 넓은 목테
    region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= (1 if u in (-5, -6, -7) else 1.5), lambda u, v: ('k' if v <= 0 else 'K') if u in (-4, -8) else rbody(u, v))
    region(s, 'pommel', lambda u, v: u in (-10, -11, -12) and abs(v) <= {-10: 2, -11: 3, -12: 2}[u], lambda u, v: 'p' if v <= -2 else ('O' if v >= 2 else 'x'))   # 넓게 벌어진 끝
    return s
def d_hunt():
    """사냥칼: 외날(위가 곧은 등 · 아래가 날) · 끝이 등 쪽에서 깎인 칼끝 · 놋쇠 코등이 · 나무 손잡이 징 둘 · 납작한 자루 끝"""
    s = Sw(); s.fx = {}
    lo = lambda u: -2 if u <= 11 else -2 + (u - 11) * 0.62          # 등(빛 쪽): 끝에서 깎임
    hi = lambda u: 2 if u <= 9 else 2 - (u - 9) * 0.25               # 날(그늘 쪽): 끝으로 살짝 올라감
    def role(u, v):
        if v <= lo(u) + 0.9: return 'w' if u > 11 else 'c'           # 등 (곧은 면), 깎인 끝은 빛
        if v >= hi(u) - 0.9: return 'w'                               # 날 (벼린 날 끝 밝게)
        return 'b' if v < 0.5 else 'B'
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and lo(u) - 1e-6 <= v <= hi(u) + 1e-6 and hi(u) >= lo(u), role)
    region(s, 'guard', lambda u, v: u in (-1, -2) and abs(v) <= 3, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 3 else gbody(u, v))
    region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= 1.5, lambda u, v: 'm' if (u in (-4, -8) and v == 0) else ('r' if v < 0 else ('R' if v > 0 else 'q')))
    region(s, 'pommel', lambda u, v: u in (-10, -11) and abs(v) <= 2, lambda u, v: 'j' if v < 0 else 'J')
    return s
def d_rondel():
    """원반 단검: 곧고 뻣뻣한 세모 날 · 코등이와 자루 끝이 같은 둥근 원반(옆에서 보아 두꺼운 원판) · 감은 손잡이"""
    s = Sw(); s.fx = {}
    hw = lambda u: 1.6 * (18 - u) / 18
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 0.45, lambda u, v: 'w' if v < 0 else ('B' if v > 0 else 'c'))
    disc = {0: 0, -1: 3, -2: 4, -3: 3}
    region(s, 'guard', lambda u, v: u in (-1, -2, -3) and abs(v) <= disc[u], lambda u, v: 'h' if v <= -2 else ('G' if v >= 2 else 'g'))
    region(s, 'grip', lambda u, v: -10 <= u <= -4 and abs(v) <= 1, lambda u, v: ('k' if v <= 0 else 'K') if (u - v) % 4 in (0, 1) else rbody(u, v))
    pd = {-11: 3, -12: 4, -13: 3}
    region(s, 'pommel', lambda u, v: u in pd and abs(v) <= pd[u], lambda u, v: 'h' if v <= -2 else ('G' if v >= 2 else 'g'))
    return s
def d_katar():
    """주먹 단검(카타르): 넓은 세모 날 · 날 밑에서 내려오는 양쪽 곁대 + 가로 손잡이 두 줄 (H 꼴)"""
    s = Sw(); s.fx = {}
    hw = lambda u: 3.0 * (17 - u) / 15
    region(s, 'blade', lambda u, v: 2 <= u <= 17 and abs(v) <= hw(u) + 1e-6, lambda u, v: bl5()(u, v, hw(u)))
    region(s, 'guard', lambda u, v: u in (0, 1) and abs(v) <= 4, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 4 else gbody(u, v))   # 날 밑 막대
    for u in range(-9, 0):
        for v in (-4, -3, 3, 4):
            P(s, 'guard', u, v, 'h' if v < 0 else 'G')                                                    # 곁대 둘
    region(s, 'grip', lambda u, v: u in (-3, -4, -6, -7) and abs(v) <= 2, lambda u, v: 'r' if v < 0 else ('R' if v > 0 else 'q'))   # 가로 손잡이 두 줄
    region(s, 'pommel', lambda u, v: u in (-10, -11) and abs(v) <= 4, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 3 else gbody(u, v))
    return s
def d_wave():
    """물결 단검: 두 날이 함께 굽이치는 날 · 비대칭 코등이 대신 넓은 목 · 감은 손잡이 · 공 자루 끝"""
    s = Sw(); s.fx = {}
    def hw(u):
        base = 2.0 if u <= 12 else 2.0 * (17 - u) / 5
        return base * (0.78 + 0.22 * math.cos(u * math.pi / 2.6)) if u <= 13 else base
    region(s, 'blade', lambda u, v: 0 <= u <= 17 and abs(v) <= hw(u) + 0.3, lambda u, v: bl5()(u, v, hw(u) + 0.3))
    region(s, 'guard', lambda u, v: (u == -1 and abs(v) <= 3) or (u == -2 and abs(v) <= 2), gbody)
    region(s, 'grip', lambda u, v: -9 <= u <= -3 and abs(v) <= 1, lambda u, v: ('k' if v <= 0 else 'K') if (u + v) % 4 in (0, 1) else rbody(u, v))
    pom3(s, 3, 16, BALL)
    return s

# ───────── 침 시안 ─────────
def line(s, x0, y0, x1, y1, f):
    """칸 선 (끝 쪽일수록 t → 1). f(t) → 글자"""
    n = max(abs(x1 - x0), abs(y1 - y0))
    for i in range(n + 1):
        t = i / n
        x = round(x0 + (x1 - x0) * t); y = round(y0 + (y1 - y0) * t)
        ch = f(t)
        if ch: s.put(x, y, 'blade', ch)
def n_fan():
    """부채 침: 가는 침 셋이 한 점(왼쪽 아래 바깥)에서 부채꼴로 벌어져 날아간다.
    기울기 2:1 · 1:1 · 1:2 깨끗한 칸 선 · 꼬리끼리 닿지 않게 띄움 · 끝 셋은 빛"""
    s = Sw(); s.fx = {}
    steep = [(4, 12), (4, 11), (5, 10), (5, 9), (6, 8), (6, 7), (7, 6), (7, 5), (8, 4), (8, 3), (9, 2), (9, 1)]
    mid = [(6 + i, 13 - i) for i in range(11)]                     # x + y = 19 위
    flat = [(19 - y, 19 - x) for (x, y) in steep]                  # 가운데 침을 축으로 거울
    for ln in (steep, mid, flat):
        n = len(ln)
        for i, (x, y) in enumerate(ln):
            s.put(x, y, 'blade', 'w' if i >= n - 3 else ('B' if i == 0 else 'b'))
    return s
def n_bo():
    """봉 수리검 하나: 가늘고 긴 쇠꼬챙이 · 긴 세모 머리 · 가는 끈 꼬리"""
    s = Sw(); s.fx = {}
    def hw(u):
        if u >= 9: return (17 - u) / 8.0                 # 머리 (점점 뾰족)
        return 0.0                                        # 몸통: 한 칸 굵기 (모서리로 이어진 줄)
    def role(u, v):
        if u >= 9: return 'w' if v < 0 else ('B' if v > 0 else ('w' if u >= 14 else 'c'))
        if u <= -12: return 'k' if v <= 0 else 'K'
        return 'b'
    region(s, 'blade', lambda u, v: -15 <= u <= 17 and abs(v) <= (hw(u) if u > -12 else 1) + 1e-6, role)
    return s
def n_bundle():
    """침 셋 나란히: 가는 쇠침 셋을 넉넉히 띄워 놓았다 · 끝은 빛 · 꼬리는 짙은 한 칸"""
    s = Sw(); s.fx = {}
    for v0, u0, u1 in ((-5, -11, 11), (0, -14, 16), (5, -11, 11)):
        for u in range(u0, u1 + 1):
            if (u + v0) % 2 == 0: continue
            ch = 'w' if u >= u1 - 3 else ('B' if u <= u0 + 1 else 'b')
            P(s, 'blade', u, v0, ch)
    return s
def n_eye():
    """깃 침: 가는 쇠침 꼬리에 종이 깃(두 갈래, 뒤로 갈수록 벌어짐)을 단 다트 둘"""
    s = Sw(); s.fx = {}
    for v0, u0, u1 in ((-4, -11, 13), (4, -11, 13)):
        for u in range(u0, u1 + 1):
            P(s, 'blade', u, v0, 'w' if u >= u1 - 3 else 'b')
        for sg in (-1, 1):                                    # 깃: 쇠침 바로 옆 줄(꼬리 4칸) + 맨 뒤 한 줄 더 벌어짐
            for u in range(u0 - 1, u0 + 4): P(s, 'grip', u, v0 + sg, 'm' if sg < 0 else 'M')
            for u in range(u0 - 2, u0 + 1): P(s, 'grip', u, v0 + 2 * sg, 'm' if sg < 0 else 'M')
    return s
DC = [('D1', '휜 단검', '양날이 칼끝 쪽에서 휘어 내려간다 · 넓은 목테 · 잘록한 손잡이 · 넓게 벌어진 자루 끝', d_curve),
      ('D2', '사냥칼', '외날 — 등은 곧고 칼끝을 등 쪽에서 깎았다 · 놋쇠 코등이 · 징 박은 나무 손잡이', d_hunt),
      ('D3', '원반 단검', '뻣뻣한 세모 날 · 코등이와 자루 끝이 같은 둥근 원반', d_rondel),
      ('D4', '주먹 단검', '넓은 세모 날 · 양쪽 곁대 사이 가로 손잡이를 쥐고 내지른다 (H 꼴 자루)', d_katar),
      ('D5', '물결 단검', '두 날이 함께 굽이치는 날 · 넓은 목 · 감은 손잡이', d_wave)]
NC = [('N1', '부채 침', '가는 침 셋이 한 점에서 부채꼴로 벌어져 날아간다', n_fan),
      ('N2', '봉 수리검', '가늘고 긴 쇠꼬챙이 하나 · 긴 세모 머리 · 가는 끈 꼬리', n_bo),
      ('N3', '침 셋', '가는 쇠침 셋을 넉넉히 띄워 나란히', n_bundle),
      ('N4', '깃 침', '가는 쇠침 꼬리에 종이 깃을 단 다트 둘', n_eye)]
STEEL = dict(w='#ffffff', b='#c8d2e2', c='#eef4fc', B='#8f9db8', n='#566282', h='#a8b0bc', g='#6c7482', G='#3e4450', j='#ffe08a', J='#c8902e',
             r='#8a5a36', q='#64401f', R='#3e2614', k='#c8b89a', K='#6a5a44', m='#f4ecd8', M='#c8b48a', p='#e8eef6', o='#a8b0bc', x='#6c7482', O='#3e4450', Q='#262a32')
if __name__ == '__main__':
    from zoomv import zoomsheet
    zoomsheet([(f().icon(STEEL).render(), k) for k, n, d, f in DC], 'dgc_z.png', z=10)
    zoomsheet([(f().icon(STEEL).render(), k) for k, n, d, f in NC], 'ndl_z.png', z=10)
    for k, n, d, f in DC + NC:
        e = f().sym_err()
        if e and k not in ('D1', 'D2', 'N1'): print(k, 'sym', e[:4])
