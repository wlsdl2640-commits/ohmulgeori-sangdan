"""활 — 궁수 계열 (11-10 22:3x 사용자: 단궁 궁수 · 정찰가 · 탐험가 / 복합궁 레인저 / 장궁 저격수 · 신궁 / 대궁 사냥꾼 · 괴수사냥꾼).
칸 좌표 u = x − y (오른쪽 위 끝 +), v = x + y − 19 (− = 왼쪽 위 빛 쪽). 시위는 v = vs 곧은 줄(효과 층, 테두리 없음),
활대는 시위에서 왼쪽 위(−v)로 휘고, 손잡이(u = 0)를 가운데로 위아래 팔이 똑같다 (u ↔ −u 대칭 = 화면 (x, y) ↔ (y, x)).
활대는 가는 획을 따라 칠한다: 칸 가운데에서 활대 줄까지 거리 ≤ 굵기(손잡이 쪽 굵고 끝으로 가늘게).
글자: 활대 a(빛) b(몸) c(그늘) · 손잡이 k K(감기) m · 끝 t T · 쇠 h g G · 장식 e E · 시위(효과) s · 효과 1 2"""
import math
from g4 import Sw
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
class Bow:
    def __init__(s, L, D, vs, hw0=1.5, hw1=0.8, p=2.0, rc=0.0, rcw=3.0):
        s.L, s.D, s.vs, s.hw0, s.hw1, s.p, s.rc, s.rcw = L, D, vs, hw0, hw1, p, rc, rcw
        s.pts = [(u / 10.0, s.vc(u / 10.0)) for u in range(int(-L * 10), int(L * 10) + 1)]
    def vc(s, u):
        """활대 가운데 줄: 손잡이(v = vs − D)에서 시위 닿는 곳(|u| = Lc, v = vs)까지 D꼴, 되휨이면 그 너머 끝이 앞(−v)으로 젖혀진다"""
        Lc = s.L - (s.rcw if s.rc else 0)
        a = abs(u)
        if a <= Lc:
            if s.p == 'arc':                                                   # 둥근 활꼴 (손잡이 쪽이 덜 뾰족하다)
                R = (Lc * Lc + s.D * s.D) / (2 * s.D)
                return s.vs - s.D + (R - math.sqrt(max(0.0, R * R - a * a)))
            return s.vs - s.D * (1 - (a / Lc) ** s.p)
        k = min(1.0, (a - Lc) / s.rcw)
        return s.vs - s.rc * k ** 1.6
    def tip(s): return s.vc(s.L)
    def lc(s): return s.L - (s.rcw if s.rc else 0)
    flat = 0.0                                                                       # 납작 활: 팔 가운데가 넓다
    def hw(s, u):
        t = abs(u) / s.L
        h = s.hw0 if t < 0.15 else s.hw0 + (s.hw1 - s.hw0) * (t - 0.15) / 0.85
        if s.flat: h += s.flat * max(0.0, 1 - abs(t - 0.5) / 0.3)
        return h
    def near(s, u, v):
        """가장 가까운 활대 점 (u', 거리, 바깥(−)인가)"""
        best = (1e9, 0, 0)
        for (pu, pv) in s.pts:
            d = math.hypot(u - pu, v - pv)
            if d < best[0]: best = (d, pu, v - pv)
        return best
def stave(s, B, role):
    """role(u', off, hw) → 글자 (off < 0: 바깥 · 빛 쪽)"""
    for x, y, (u, v) in s.each():
        if (u + v) % 2 == 0: continue
        d, pu, off = B.near(u, v)
        if d <= B.hw(pu) + 1e-6:
            ch = role(pu, off, B.hw(pu))
            if ch: s.put(x, y, 'blade', ch)
def wood(pu, off, hw, B=None, grip=1.6, tipk=1.6, cols='abc', grip_c='kK', tip_c='tT'):
    if abs(pu) <= grip: return grip_c[0] if int(round(pu)) % 2 == 0 else grip_c[1]
    if B is not None and abs(pu) >= B.L - tipk: return tip_c[0] if off < 0.2 else tip_c[1]
    return cols[0] if off < -hw / 3 else (cols[2] if off > hw / 3 else cols[1])
def string(s, B, ch='s', inset=0.0):
    """시위: 시위 닿는 두 곳 사이 곧은 줄 v = vs (효과 층, 한 칸 굵기 — v는 그대로, u만 두 칸씩)"""
    v = int(round(B.vs)); Lc = B.lc() - inset
    for u in range(-int(Lc) - 1, int(Lc) + 2):
        if (u + v) % 2 == 0 or abs(u) > Lc + 0.5: continue
        x, y = (u + v + 19) // 2, (v - u + 19) // 2
        if (x, y) not in s.part and 0 <= x < 20 and 0 <= y < 20: s.fx[(x, y)] = ch
def tsym(s):
    """u ↔ −u 대칭이 아닌 칸 (화면 (x, y) ↔ (y, x))"""
    return [(x, y) for (x, y) in s.part if (y, x) not in s.part]
def mk(B, role, deco=None, str_ch='s'):
    s = Sw(); s.fx = {}
    stave(s, B, role)
    if deco: deco(s, B)
    string(s, B, str_ch)
    return s
# ── 원형 ──
KIND = {'short': '단궁', 'comp': '복합궁', 'long': '장궁', 'great': '대궁'}
SPEC = {   # L, D, vs, 손잡이 굵기, 끝 굵기, p, 되휨, 되휨 길이 (uv 단위 — 화면 픽셀 × √2)
    'short': dict(L=10.5, D=6.5, vs=4.0, hw0=2.2, hw1=1.2, p='arc'),
    'comp':  dict(L=12.0, D=6.0, vs=4.5, hw0=2.1, hw1=1.1, p='arc', rc=3.0, rcw=3.6),
    'long':  dict(L=13.8, D=5.0, vs=3.0, hw0=1.9, hw1=1.0, p='arc'),
    'great': dict(L=11.6, D=7.0, vs=4.5, hw0=3.0, hw1=1.8, p='arc'),
}
def B_of(kind, **kw):
    d = dict(SPEC[kind]); d.update(kw); return Bow(**d)
def ring(s, B, us, ch=('h', 'G')):
    """활대를 감은 고리 (u = us 줄 안 칸을 쇠로)"""
    for x, y, (u, v) in s.each():
        if (x, y) in s.part and any(abs(u - q) < 0.6 for q in us): s.put(x, y, 'blade', ch[0] if v < B.vc(u) else ch[1])
def bbox(s):
    xs = [x for x, y in list(s.part) + list(s.fx)]; ys = [y for x, y in list(s.part) + list(s.fx)]
    return min(xs), min(ys), max(xs), max(ys)
def spike(s, B, n=2, ch='t'):
    """끝에서 바깥(u 방향)으로 n칸 더 뻗은 가시"""
    for sg in (-1, 1):
        v0 = B.vc(B.L)
        for k in range(1, n + 1):
            u = sg * (B.L + k)
            for vv in (round(v0), round(v0) - 1, round(v0) + 1):
                if (round(u) + vv) % 2: P(s, 'blade', round(u), vv, ch); break
