"""마나소드 16단계 (Lv50 ~ 200, 마검사 · 마검성) — 큰 도트 시안. python3 msword_hd.py <출력 폴더> [번호,…]
자루(쇠 · 가죽 · 보석)에서 마나 칼날이 뿜어 나온다: 흰 심 → 밝은 몸 → 짙은 가장자리 → 둘레 빛, 칼끝 쪽으로 흩날리는 빛 조각."""
import sys, os, math
import numpy as np
from hd2 import *
E = {   # 마나 빛깔: 짙음 → 흰빛
    'azure':  ramp('#0a1a86', '#1238d0', '#2468f2', '#4a9cfc', '#8accff', '#d2eeff', '#ffffff'),
    'cyan':   ramp('#04406a', '#0870a8', '#10a4d8', '#34ccf0', '#84e6fa', '#d0f8ff', '#ffffff'),
    'teal':   ramp('#04483e', '#087a66', '#12aa8c', '#3cd4b0', '#88ecd0', '#d2fbee', '#ffffff'),
    'frost':  ramp('#2a4a8a', '#4a78c0', '#74a6e4', '#a2ccf6', '#cce6fc', '#ecf7ff', '#ffffff'),
    'violet': ramp('#2a0a7a', '#4a18c0', '#7038ee', '#9a6cfa', '#c2a4ff', '#e6d8ff', '#ffffff'),
    'moon':   ramp('#3a4270', '#6470a8', '#94a2d4', '#bcc8ee', '#dce4fa', '#f2f5ff', '#ffffff'),
    'jade':   ramp('#0a4a14', '#128028', '#22b442', '#54dc6c', '#98f2a4', '#d8fcdc', '#ffffff'),
    'purple': ramp('#42086a', '#7412aa', '#a628dc', '#cc5cf4', '#e49cfc', '#f6d8ff', '#ffffff'),
    'sun':    ramp('#7a2c04', '#b85408', '#e88a10', '#fcbc30', '#ffe070', '#fff6c4', '#ffffff'),
    'abyss':  ramp('#05030c', '#120826', '#2a1050', '#5a1c8c', '#a03cc8', '#e080f0', '#ffd8ff'),
    'aurora': ramp('#0a3a6a', '#0c7a8c', '#18b48c', '#5ce08c', '#b0f4a8', '#e4fcd8', '#ffffff'),
    'crimson':ramp('#5a0410', '#96081c', '#d0182c', '#f44c4c', '#fc8c84', '#ffd0c8', '#ffffff'),
    'rose':   ramp('#6a0a48', '#a41870', '#d83c98', '#f470b8', '#fca8d4', '#ffdcee', '#ffffff'),
    'emerald':ramp('#064a30', '#0a7c4c', '#14b06c', '#44d890', '#90f0b8', '#d8fce4', '#ffffff'),
    'prism':  ramp('#3a1a8a', '#2a50d0', '#20a0e0', '#40e0b0', '#c0f080', '#fff0b0', '#ffffff'),
    'star':   ramp('#6a5410', '#a88a20', '#dcc040', '#f6e478', '#fff6b4', '#fffce0', '#ffffff'),
}
def tp(s, a=3.0, b=0.7): return np.clip(1 - np.clip(s, 0, 1) ** a, 0, 1) ** b
def msword(o):
    A = Art(o.get('seed', 1)); P = o.get('P', (8.5, 55.5)); Q = o.get('Q', (56.0, 8.0)); F = Frame(P, Q); L = F.L; al = F.t * L; u = F.u
    b0 = o.get('b0', 18.0); s = (al - b0) / (L - b0); R = E[o['R']] if isinstance(o['R'], str) else o['R']
    C = dict(A=A, F=F, al=al, u=u, s=s, L=L, b0=b0, R=R, o=o)
    for f in o.get('back', []): f(C)
    # ── 칼날
    bend = o.get('bend'); uu = u - (bend(np.clip(s, 0, 1)) if bend else 0)
    wl, wr = o['prof'](np.clip(s, 0, 1)); w = np.where(uu < 0, wl, wr)
    bm = (s >= 0) & (s <= 1) & (np.abs(uu) <= w)
    if o.get('gap'): bm &= np.abs(uu) >= o['gap'](np.clip(s, 0, 1))
    x = np.abs(uu) / np.maximum(w, 0.6)
    if o.get('dark'): sh = 0.12 + 0.75 * x ** 2.2
    else:
        sh = 1.02 - 0.66 * x ** 1.5 + 0.07 * np.sin(al * 0.62 - np.abs(uu) * 1.5) - 0.10 * (uu > 0) * x
        sh = np.where(w - np.abs(uu) < 1.25, np.minimum(sh, 0.30), sh)          # 가장자리 한 줄은 짙게
        sh += 0.10 * np.clip((s - 0.75) / 0.25, 0, 1)
    if o.get('hue'): sh = sh * 0.55 + 0.45 * (0.25 + 0.75 * np.clip(s, 0, 1)) * (1 - 0.4 * x)
    m = A.part(bm, sh, R, edge=False, rim=0, ao=0, lum=True, outc=R[0]); C['bm'] = bm; C['uu'] = uu; C['w'] = w
    rs = np.random.RandomState(o.get('seed', 1)); ys, xs = np.nonzero(bm & (x < 0.72) & (s > 0.06))
    for i in rs.choice(len(ys), min(o.get('spark', 14), len(ys)), replace=False): A.px(xs[i], ys[i], [255, 255, 255] if not o.get('dark') else R[5], lum=True)
    A.glow(bm, R[3] if not o.get('dark') else R[4], o.get('gr', 2.4), o.get('ga', 0.62))
    for f in o.get('blade', []): f(C)
    # 뿜어 나오는 빛 조각
    for i in range(o.get('wisps', 5)):
        si = 0.18 + 0.74 * (i + rs.rand() * 0.6) / max(1, o.get('wisps', 5)); sd = 1 if i % 2 else -1
        wv = float(np.interp(si, np.linspace(0, 1, 50), (o['prof'](np.linspace(0, 1, 50))[0 if sd < 0 else 1])))
        off = (float(bend(np.array([si]))[0]) if bend else 0) + sd * (wv - 0.6)
        p = F.P((b0 + si * (L - b0)) / L, off); d = F.ax * 1.0 + F.nx * sd * 0.55
        G = Frame(p, p + d / np.hypot(*d) * (3.2 + rs.rand() * 2.2)); k = (G.t >= 0) & (G.t <= 1) & (np.abs(G.u) <= 1.25 * (1 - G.t) + 0.3)
        A.part(k & ~A.on, 0.42 + 0.3 * (1 - G.t), R, edge=False, rim=0, ao=0, lum=True, outc=R[0])
    tipp = F.P(1.0, float(bend(np.array([1.0]))[0]) if bend else 0)
    for j in range(o.get('motes', 4)):
        q = tipp + F.ax * (2.5 + j * 2.4) + F.nx * (rs.rand() - 0.5) * 6
        if 1 <= q[0] < N - 1 and 1 <= q[1] < N - 1 and not A.on[int(q[1]), int(q[0])]:
            A.px(q[0], q[1], R[5 - min(j, 2)], lum=True, free=True)
            if j < 2 and not A.on[int(q[1]) + 1, int(q[0]) - 1]: A.px(q[0] - 1, q[1] + 1, R[3], lum=True, free=True)   # 비스듬한 두 칸 빛 조각
    # ── 자루
    g0, g1 = o.get('grip', (4.5, 14.5)); gw = o.get('gw', 1.9); gR = o.get('gripR', 'dleather')
    gm = (al >= g0) & (al <= g1) & (np.abs(u) <= gw)
    A.part(gm, cyl_shade(u / gw) - 0.16 * (((al + u * 0.9) % 3.0) < 1.0), gR, tex=0.03)
    for f in o.get('hilt', []): f(C)
    return A
# ── 자루 꾸밈
def pommel(R='gold', r=2.7, at=None, gemR=None, shape='ball'):
    def f(C):
        A = C['A']; F = C['F']; g0 = C['o'].get('grip', (4.5, 14.5))[0]; q = F.P(((at if at is not None else g0 - r * 0.55)) / C['L'])
        if shape == 'ring':
            d = np.hypot(XX - q[0], YY - q[1]); A.part((d <= r + 0.8) & (d >= r - 1.1), 0.72 - 0.22 * ((XX - q[0]) + (YY - q[1])) / r, R)
        elif shape == 'spike': tri(A, F.P((g0 + 0.5) / C['L']), -F.ax, r * 2.2, r * 0.8, R)
        else: A.part(disk(q, r), ball_shade(XX - q[0], YY - q[1], r) * 1.05, R)
        if gemR: gem(A, (q[0], q[1]), r * 0.62, gemR, 'round')
    return f
def tri(A, p, d, ln, w, R, sh=0.62, lum=False, outc=None):
    d = np.array(d, float); d /= np.hypot(*d); G = Frame(p, (p[0] + d[0] * ln, p[1] + d[1] * ln))
    m = (G.t >= 0) & (G.t <= 1) & (np.abs(G.u) <= w * (1 - G.t) + 0.35)
    return A.part(m, sh - 0.28 * G.u / max(w, 1) + 0.12 * (1 - G.t), R, lum=lum, outc=outc)
def collar(a0, a1, w, R='gold', riv=0):
    def f(C):
        A = C['A']; m = (C['al'] >= a0) & (C['al'] <= a1) & (np.abs(C['u']) <= w); A.part(m, met_shade(C['u'] / w), R)
    return f
def wings(a, span=7.5, sweep=0.55, w=2.3, R='gold', back=0.0):
    def f(C):
        A = C['A']; F = C['F']
        for sd in (-1, 1): tri(A, F.P(a / C['L'], sd * 1.2), F.nx * sd + F.ax * sweep, span, w, R)
        if back:
            for sd in (-1, 1): tri(A, F.P((a - 1) / C['L'], sd * 1.2), F.nx * sd - F.ax * back, span * 0.6, w * 0.8, R)
    return f
def crescent(a, r=6.0, th=1.5, R='gold', open_=0.55):
    def f(C):
        A = C['A']; F = C['F']; c = F.P((a + r) / C['L']); d = np.hypot(XX - c[0], YY - c[1])
        m = (np.abs(d - r) <= th) & (C['al'] <= a + r * (1 + open_)) & (C['al'] >= a - th)
        A.part(m, 0.70 - 0.26 * C['u'] / r + 0.1 * (C['al'] - a) / r, R)
    return f
def disc(a, w=5.0, h=1.5, R='gold'):
    def f(C):
        A = C['A']; m = ((C['al'] - a) / h) ** 2 + (C['u'] / w) ** 2 <= 1; A.part(m, met_shade(C['u'] / w) + 0.1, R)
    return f
def gemg(a, r, R, shape='round', ring='gold', glow=None, off=0.0):
    def f(C):
        q = C['F'].P(a / C['L'], off); gem(C['A'], (q[0], q[1]), r, R, shape, ring=ring, glow=glow)
    return f
def claws(a, n=3, ln=6.0, R='steeld', spread=3.6):
    def f(C):
        A = C['A']; F = C['F']
        for sd in ((-1, 1) if n == 2 else (-1, 0, 1)):
            tri(A, F.P(a / C['L'], sd * spread), F.ax * 1.0 - F.nx * sd * 0.22, ln * (1.0 if sd else 0.75), 1.5, R)
    return f
def bar(a, w=6.5, h=1.4, R='iron', tipR=None):
    def f(C):
        A = C['A']; m = (np.abs(C['al'] - a) <= h) & (np.abs(C['u']) <= w); A.part(m, met_shade(C['u'] / w) + 0.05, R)
        if tipR:
            for sd in (-1, 1):
                q = C['F'].P(a / C['L'], sd * w); A.part(disk(q, 1.9), ball_shade(XX - q[0], YY - q[1], 1.9), tipR)
    return f
def shards(n=3, R=None, seed=4, dist=5.5, ln=5.0):
    """칼날 옆에 떠 있는 빛 조각(마름모)"""
    def f(C):
        A = C['A']; F = C['F']; RR = R if R is not None else C['R']; rs = np.random.RandomState(seed)
        for i in range(n):
            si = 0.25 + 0.6 * i / max(1, n - 1); sd = -1 if i % 2 else 1
            p = F.P((C['b0'] + si * (C['L'] - C['b0'])) / C['L'], sd * (dist + rs.rand() * 1.5)); G = Frame(p - F.ax * ln / 2, p + F.ax * ln / 2)
            m = (np.abs(G.t - 0.5) * 2 + np.abs(G.u) / 1.5 <= 1) & ~A.on
            A.part(m, np.where(G.u < 0, 0.9, 0.5), RR, edge=False, rim=0, ao=0, lum=True, outc=RR[0]); A.glow(m, RR[3], 1.5, 0.5)
    return f
def ringfx(s0=0.16, r=7.5, th=1.1, R=None):
    """칼날 밑동을 두르는 빛 고리(비스듬히 본 타원)"""
    def f(C):
        A = C['A']; RR = R if R is not None else C['R']; a0 = C['b0'] + s0 * (C['L'] - C['b0'])
        d = np.sqrt(((C['al'] - a0) / (r * 0.36)) ** 2 + (C['u'] / r) ** 2)
        m = (np.abs(d - 1) <= th / r) & ~(C['bm'] & (C['al'] > a0))
        A.part(m, 0.8 - 0.3 * C['u'] / r, RR, edge=False, rim=0, ao=0, lum=True, outc=RR[0]); A.glow(m, RR[3], 1.5, 0.5)
    return f
def core(R2, k=0.34):
    """칼날 속 다른 빛깔 심"""
    def f(C):
        A = C['A']; RR = E[R2] if isinstance(R2, str) else R2; m = C['bm'] & (np.abs(C['uu']) <= C['w'] * k) & (C['s'] > 0.03)
        A.part(m, 0.95 - 0.5 * np.abs(C['uu']) / np.maximum(C['w'] * k, 0.5), RR, edge=False, rim=0, ao=0, lum=True, outc=C['R'][0])
    return f
def facets(amp=0.2, sz=6.0):
    def f(C):
        A = C['A']; a = np.floor((C['al'] + C['uu'] * 1.5) / sz); b = np.floor((C['al'] - C['uu'] * 1.5) / sz); n = h01(a, b, 9) - 0.5
        A.tint(C['bm'] & (n > 0.15), [255, 255, 255], 0.30); A.tint(C['bm'] & (n < -0.15), C['R'][1], 0.30)
    return f
def aurora_cols(cols=('#40e0ff', '#60ffb0', '#c0a0ff', '#ff90d0')):
    def f(C):
        A = C['A']; s = np.clip(C['s'], 0, 1); x = np.abs(C['uu']) / np.maximum(C['w'], 0.6)
        for i, c in enumerate(cols):
            a = np.clip(1 - np.abs(s - (i + 0.5) / len(cols)) * len(cols) * 0.75, 0, 1) * 0.62 * np.clip((x - 0.15) / 0.5, 0, 1)
            A.tint(C['bm'], c, a)
    return f
