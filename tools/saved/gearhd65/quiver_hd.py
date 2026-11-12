"""화살통 16단계 (Lv1 ~ 150) — 큰 도트 시안. python3 quiver_hd.py <출력 폴더> [번호,…]"""
import sys, math, os
import numpy as np
from hd2 import *
K = 0.42
FE = {   # 깃 색 띠
    'white': ramp('#5a5660', '#8a8690', '#b6b2b8', '#d8d5d6', '#f0eeec', '#ffffff'),
    'grey':  ramp('#2c2c34', '#484852', '#686872', '#8c8c96', '#b2b2ba', '#dcdce2'),
    'brown': M['tan'], 'red': M['red'], 'green': M['green'], 'blue': M['blue'], 'yellow': M['yellow'], 'purple': M['purple'],
    'black': M['black'], 'cyan': M['cyan'], 'orange': M['orange'], 'gold': M['gold'], 'pink': M['pink'], 'jade': M['jade'], 'ice': M['ice'], 'vine': M['vine'],
}
def prof(s, style):
    s = np.clip(s, 0, 1.4)
    if style == 'shield': return np.minimum(s / 0.62, 1) * np.where(s < 0.92, 1, np.clip((1 - s) / 0.08, 0, 1))
    if style == 'swept': return np.minimum(s / 0.55, 1) * (s <= 1.22)
    if style == 'dia': return np.clip(1 - np.abs(2 * s - 1), 0, 1) ** 0.8
    if style == 'leaf': return np.sin(np.pi * np.clip(s, 0, 1)) ** 0.75
    if style == 'flame': return np.sin(np.pi * np.clip(s, 0, 1) ** 0.8) ** 0.6 * (0.78 + 0.22 * np.sin(s * 15))
    return np.sin(np.pi * np.clip(1 - s, 0, 1) ** 0.6) ** 0.7 * (s <= 1)   # para: 뒤쪽이 넓다
def arrow(A, P0, d, L, fe, clip, style='para', fl=11.5, fw=4.2, shaft='tan', nock='dleather', tip=None, lum=False, glow=None, band=None, notch=False):
    P1 = (P0[0] + d[0] * L, P0[1] + d[1] * L); G = Frame(P0, P1); al = G.t * G.L; au = np.abs(G.u)
    R = FE[fe] if isinstance(fe, str) else fe; oc = R[0] * 0.7 if lum else None
    A.part((al >= -1) & (al <= L + 1.4) & (au <= 2.0), 0.0, 'black', edge=False, rim=0, ao=0, clip=clip)        # 살대 둘레 검은 테
    A.part((al >= 0) & (al <= L) & (au <= 1.0), 0.70 - 0.22 * G.u, shaft, edge=False, rim=0, ao=0, clip=clip)
    s = (al - (L - fl - 1.8)) / fl; w = prof(s, style) * fw
    ext = (au / fw) * 0.22 if style == 'swept' else 0
    fm = (s >= 0) & (s <= 1 + ext) & (au <= w) & (w > 0.3)
    if notch: fm &= ~(((np.abs(s - 0.36 - 0.05 * au / fw) < 0.04) | (np.abs(s - 0.68 - 0.05 * au / fw) < 0.04)) & (au > w * 0.5))
    sh = np.where(G.u < 0, 0.80, 0.52) + 0.08 * (au / fw) - 0.05 * (((al + au * 1.2) % 2.6) < 0.9)
    m = A.part(fm, sh, R, clip=clip, rim=0.10, ao=0.10, lum=lum, outc=oc, ecol=R[0] * 0.45)
    if tip: A.part(fm & (s > 0.58), sh, FE[tip] if isinstance(tip, str) else tip, edge=False, clip=clip, lum=lum, outc=oc)
    if band: A.part(fm & (s > 0.26) & (s < 0.42), sh - 0.05, FE[band] if isinstance(band, str) else band, edge=False, clip=clip, lum=lum, outc=oc)
    A.part(fm & (au < 0.8), 0.22, R, edge=False, rim=0, ao=0, clip=clip, lum=lum, outc=oc)           # 깃대
    A.part((al > L - 1.9) & (al <= L + 0.4) & (au <= 1.0), 0.6 - 0.2 * G.u, nock, edge=False, rim=0.1, ao=0.1, clip=clip)
    if glow: A.glow(m, glow, 2.0, 0.6)
def quiver(o):
    A = Art(o.get('seed', 1)); B = o.get('B', (15.0, 50.0)); T = o.get('T', (41.0, 24.0)); rt = o.get('rt', 9.4); rb = o.get('rb', 7.6)
    F = Frame(B, T); mid = o.get('bulge', 0.0)
    def rad(t, k=1.0): return (rb + (rt - rb) * np.clip(t, -0.3, 1.3) + mid * np.sin(np.pi * np.clip(t, 0, 1))) * k
    def surf(k=1.0):
        r = rad(F.t, k); v = F.u / r; return F.t + K * r / F.L * np.sqrt(np.clip(1 - v * v, 0, 1)), v, r
    def S(tw_, th_, k=1.0):
        t_ = tw_
        for _ in range(3):
            rr = float(rad(t_, k)); t_ = tw_ - K * rr / F.L * math.cos(th_)
        return F.P(t_, math.sin(th_) * rr)
    tw, v, r = surf(); th = np.arcsin(np.clip(v, -1, 1)); body = (tw >= 0) & (tw <= 1) & (np.abs(v) <= 1)
    al = tw * F.L; ar = th * (rt + rb) / 2          # 몸 겉 자리(px): 세로 · 둘레
    C = dict(A=A, F=F, S=S, surf=surf, tw=tw, v=v, th=th, body=body, al=al, ar=ar, rt=rt, rb=rb, rad=rad, o=o)
    def band(a, b, R, k=1.05, riv=0, rivR='iron', top=None, bot=None, tex=0.05, rr=1.0, bright=1.0, grain=None, lum=False, met=False):
        twk, vk, rk = surf(k); thk = np.arcsin(np.clip(vk, -1, 1))
        lo = a - (bot(thk) if bot else 0); hi = b + (top(thk) if top else 0)
        m = (twk >= lo) & (twk <= hi) & (np.abs(vk) <= 1)
        sd = (twk >= lo - 1.6 / F.L) & (twk < lo) & (np.abs(vk) <= 1) & A.on & ~m
        A.tint(sd, [8, 3, 4], 0.42)                                   # 띠 아래 그림자
        A.part(m, (met_shade(vk) if met else cyl_shade(vk)) * bright, R, tex=0.02 if met else tex, grain=grain, lum=lum)
        for i in range(riv):
            q = S((a + b) / 2, -1.05 + 2.1 * (i + 0.5) / riv, k); rivet(A, (q[0] - 1, q[1] - 1), rivR, rr)
        return m
    C['band'] = band
    for f in o.get('back', []): f(C)
    # ── 끈(몸 뒤)
    st = o.get('strap')
    if st:
        a, b = st.get('a', 0.80), st.get('b', 0.20); p0 = F.P(a, -float(rad(a)) * 0.85); p1 = F.P(b, -float(rad(b)) * 0.85)
        mdl = (p0 + p1) / 2 - F.nx * st.get('bulge', 13) + F.ax * st.get('lift', 0)
        P = curve([p0, mdl, p1]); d, bt, bs = cdist(P); w = st.get('w', 3.0)
        sm = d <= w / 2
        if st.get('chain'):
            sm &= ((bt * len(P) * 0.5) % 3.2) < 2.3
        A.part(sm, 0.60 + 0.10 * bs, st.get('R', 'dleather'), tex=0.06)
        C['strapP'] = P
        if st.get('stitch'): stitch(A, P, M[st['R']][5] * 0.9 if isinstance(st['R'], str) else st['R'][5], step=3, on=1.4)
        if st.get('buckle'):
            q = P[int(len(P) * st.get('bat', 0.45))]; R = M[st['buckle']]
            bm = (np.abs(XX - q[0]) <= 2.6) & (np.abs(YY - q[1]) <= 2.6); inner = (np.abs(XX - q[0]) <= 1.2) & (np.abs(YY - q[1]) <= 1.2)
            A.part(bm & ~inner, 0.72 - 0.2 * ((XX - q[0]) + (YY - q[1])) / 3, R, rim=0.2, ao=0.15)
    # ── 몸
    sh = cyl_shade(v) * (0.90 + 0.10 * np.clip(tw / 0.35, 0, 1)) - 0.12 * np.clip(1 - tw / 0.10, 0, 1)
    sh = sh + o.get('sheen', 0.10) * np.exp(-((v + 0.50) / 0.13) ** 2) * (vnoise(XX, YY, 5.0, 91) > 0.38)
    A.part(body, sh * o.get('bk', 0.95), o['body'], tex=o.get('tex', 0.10), grain=o['pat'](C) if o.get('pat') else None)
    C['sh'] = sh
    for f in o.get('skin', []): f(C)
    # ── 밑동 · 띠
    cp = o.get('cap')
    if cp:
        m = band(0.0, cp.get('h', 0.14), cp['R'], cp.get('k', 1.05), riv=cp.get('riv', 0), rivR=cp.get('rivR', 'iron'), top=cp.get('top'), tex=cp.get('tex', 0.05), met=cp.get('met', False))
        A.tint(m, [0, 0, 0], 0.22 * np.clip(1 - tw / 0.07, 0, 1))
        if cp.get('knob'):
            q = F.P(-K * rb * cp.get('k', 1.05) / F.L - 0.035); A.part(disk(q, cp.get('kr', 2.3)), ball_shade(XX - q[0], YY - q[1], cp.get('kr', 2.3)), cp['knob'])
    for bd in o.get('bands', []): band(**bd)
    for f in o.get('mid', []): f(C)
    # ── 목 테 · 아가리
    co = o.get('collar', {}); kc = co.get('k', 1.08); rc = rt * kc
    if co.get('R'):
        band(co.get('a', 0.84), 1.0, co['R'], kc, riv=co.get('riv', 0), rivR=co.get('rivR', 'iron'), bot=co.get('bot'), top=co.get('top'), tex=co.get('tex', 0.05), rr=co.get('rr', 1.0), met=co.get('met', False))
    rimR = co.get('rimR', co.get('R') or o['body'])
    eo = ((F.t - 1) * F.L / (K * rc)) ** 2 + (F.u / rc) ** 2; ri = rc - co.get('lip', 1.9); ei = ((F.t - 1) * F.L / (K * ri)) ** 2 + (F.u / ri) ** 2
    mo = eo <= 1; mi = ei <= 1
    A.part(mo & ~mi, np.where(F.t > 1, 0.86, 0.70) - 0.16 * F.u / rc, rimR, rim=0.10, ao=0.06)
    A.part(mi, 0.04 + 0.26 * np.clip((F.t - 1) * F.L / (K * ri) * 0.5 + 0.5, 0, 1) - 0.08 * F.u / ri, o.get('inner', 'dleather'), rim=0, ao=0)
    clip = mi | (F.t > 1); C['clip'] = clip; C['mi'] = mi; C['mo'] = mo
    for f in o.get('pre', []): f(C)
    for ar_ in o.get('arrows', []):
        u0, ang, L = ar_[0], ar_[1], ar_[2]; kw = ar_[3] if len(ar_) > 3 else {}
        c, s_ = math.cos(math.radians(ang)), math.sin(math.radians(ang)); d = (F.ax[0] * c - F.ax[1] * s_, F.ax[0] * s_ + F.ax[1] * c)
        P0 = F.P(1 - 0.06, u0 * rt * 0.62)
        arrow(A, P0, d, L + 2, clip=clip, **{**o.get('akw', {}), **kw})
    for f in o.get('front', []): f(C)
    return A
# ── 무늬(몸 겉)
def seam(v0=0.42, thread='#d8b888', step=3.2):
    def f(C):
        A = C['A']; d = np.abs(C['v'] - v0) * C['surf']()[2]
        A.tint(C['body'] & (d < 0.6), [12, 6, 4], 0.8)
        A.tint(C['body'] & (C['v'] > v0) & (d < 2.4) & (d >= 1.2) & ((C['al'] % step) < 1.3), thread, 0.8)
    return f
def patch(a, b, t0, t1, R, thread='#e0c090'):
    def f(C):
        A = C['A']; m = C['body'] & (C['tw'] >= a) & (C['tw'] <= b) & (C['th'] >= t0) & (C['th'] <= t1)
        A.part(m, C['sh'] * 0.95, R, tex=0.12)
        e = m & nb4(C['body'] & ~m); inner = m & ~e; e2 = inner & nb4(e)
        A.tint(e2 & (((XX + YY) % 3) < 1.2), thread, 0.8)
    return f
def p_wrap(pitch=5.0, slope=0.8, amp=0.10):
    def f(C):
        q = (C['al'] + C['ar'] * slope) / pitch; fr = q - np.floor(q)
        return -0.26 * (fr < 0.16) + amp * (fr > 0.2) * (fr < 0.55) - 0.04 * (np.floor(q) % 2)
    return f
def p_scales(sw=4.6, sl=4.2):
    def f(C):
        b = C['al'] / sl; row = np.floor(b); a = C['ar'] / sw + 0.5 * (row % 2); fx = a - np.floor(a) - 0.5; fy = b - row
        edge = 0.5 - 0.5 * np.sqrt(np.clip(1 - (2 * fx) ** 2, 0, 1))
        d = fy - edge
        return -0.34 * (np.abs(d) < 0.17) + 0.16 * ((d > 0.17) & (d < 0.50)) - 0.08 * (d < -0.17)
    return f
def p_grain(k=1.9):
    def f(C):
        w = np.sin(C['ar'] * k + 1.6 * np.sin(C['al'] * 0.31) + 0.8 * np.sin(C['al'] * 0.13 + 2))
        return 0.07 * w - 0.14 * (w < -0.86)
    return f
def p_facets(sz=6.5, amp=0.16):
    def f(C):
        a = np.floor((C['al'] + C['ar'] * 1.4) / sz); b = np.floor((C['al'] - C['ar'] * 1.4) / sz)
        return (h01(a, b, 5) - 0.5) * 2 * amp
    return f
def p_plates(h=7.5):
    def f(C):
        q = C['al'] / h; fr = q - np.floor(q)
        return -0.30 * (fr < 0.12) + 0.14 * ((fr > 0.12) & (fr < 0.26))
    return f
def p_quilt(sz=5.5):
    def f(C):
        a = (C['al'] + C['ar'] * 1.2) / sz; b = (C['al'] - C['ar'] * 1.2) / sz
        fa = a - np.floor(a); fb = b - np.floor(b)
        return -0.24 * ((fa < 0.14) | (fb < 0.14)) + 0.08 * ((fa > 0.3) & (fb > 0.3) & (fa < 0.7) & (fb < 0.7))
    return f

# ── 덧붙이는 것
def tri(A, p, d, ln, w, R, sh=0.62, lum=False, outc=None):
    d = np.array(d, float); d /= np.hypot(*d); G = Frame(p, (p[0] + d[0] * ln, p[1] + d[1] * ln))
    m = (G.t >= 0) & (G.t <= 1) & (np.abs(G.u) <= w * (1 - G.t) + 0.35)
    return A.part(m, sh - 0.28 * G.u / max(w, 1) + 0.12 * (1 - G.t), R, lum=lum, outc=outc)
def leaf(A, p, d, ln, w, R, lum=False, clip=None):
    d = np.array(d, float); d /= np.hypot(*d); G = Frame(p, (p[0] + d[0] * ln, p[1] + d[1] * ln))
    m = (G.t >= 0) & (G.t <= 1) & (np.abs(G.u) <= w * np.sin(np.pi * np.clip(G.t, 0, 1)) ** 0.7 + 0.3)
    A.part(m, np.where(G.u < 0, 0.80, 0.50), R, lum=lum, clip=clip); A.part(m & (np.abs(G.u) < 0.6) & (G.t < 0.85), 0.28, R, edge=False, rim=0, ao=0, clip=clip)
    return m
def fur(a, b, R='fur', k=1.14):
    def f(C):
        A = C['A']; twk, vk, rk = C['surf'](k); j = vnoise(XX, YY, 1.5, 31); j2 = vnoise(XX, YY, 1.4, 47)
        m = (twk >= a - 0.07 * j) & (twk <= b + 0.05 * j2) & (np.abs(vk) <= 1 + 0.10 * j)
        A.tint((twk >= a - 0.12) & (twk < a) & (np.abs(vk) <= 0.98) & A.on & ~m, [8, 3, 4], 0.40)
        A.part(m, cyl_shade(vk) * 0.82 + 0.10 + (vnoise(XX, YY, 1.2, 53) - 0.5) * 0.42, R, rim=0.14, ao=0.14)
    return f
def emb(tw0, th0, w, h, R, shape='shield', sym=None, symR='gold', rim=0.2):
    def f(C):
        A = C['A']; y = -(C['al'] - tw0 * C['F'].L) / h; x = (C['ar'] - th0 * (C['rt'] + C['rb']) / 2) / w
        if shape == 'shield': m = (np.abs(x) <= 1) & (y >= -1) & (y <= 1 - np.abs(x) ** 1.7)
        elif shape == 'dia': m = np.abs(x) + np.abs(y) <= 1
        elif shape == 'rect': m = (np.abs(x) <= 1) & (np.abs(y) <= 1)
        else: m = x * x + y * y <= 1
        m &= C['body']; A.part(m, 0.66 - 0.26 * x - 0.06 * y, R, rim=rim, ao=0.14)
        if sym:
            X = x * w; Y = y * h
            if sym == 'leaf': k = (X * X / 2.2 + Y * Y / 9.0 <= 1) & ~(np.abs(X) < 0.5)
            elif sym == 'flame': k = (np.abs(X) <= (1.9 - np.abs(Y + 0.6) * 0.75) * (Y < 2.4)) & (Y > -3.2)
            elif sym == 'drop': k = (X * X + (Y - 0.8) ** 2 <= 3.2) | ((np.abs(X) <= (Y + 3.2) * 0.45) & (Y < 0.8) & (Y > -3.2))
            elif sym == 'bolt': k = (np.abs(X + 0.9 - (Y < 0) * 1.8 + Y * 0.35) <= 0.8) & (np.abs(Y) < 3.4)
            elif sym == 'sun': k = (X * X + Y * Y <= 2.4) | ((np.abs(np.hypot(X, Y) - 3.4) < 0.6) & (((np.arctan2(Y, X) * 4 / np.pi) % 1) < 0.45))
            elif sym == 'paw': k = (X * X + (Y - 1) ** 2 <= 2.4) | ((np.abs(np.abs(X) - 1.6) < 0.75) & (np.abs(Y + 1.6) < 0.75)) | ((np.abs(X) < 0.7) & (np.abs(Y + 2.6) < 0.7))
            else: k = np.abs(X) + np.abs(Y) <= 1.8
            A.part(m & k, 0.74 - 0.2 * x, symR, edge=False, rim=0.1, ao=0.1)
        return m
    return f
def hang(th0, tw0=0.84, cord=5, kind='feather', R='red', R2=None, k=1.08, dx=0.0):
    """목 테에서 아래로 늘어진 장식(그림 좌표로 똑바로 아래)"""
    def f(C):
        A = C['A']; q = C['S'](tw0, th0, k); x0, y0 = q[0] + dx, q[1]
        A.part((np.abs(XX - x0) <= 0.75) & (YY >= y0) & (YY <= y0 + cord), 0.35, R2 or 'dleather', rim=0, ao=0)
        p = (x0, y0 + cord)
        if kind == 'feather': leaf(A, p, (0.25, 1), 10, 2.6, FE[R] if isinstance(R, str) and R in FE else R)
        elif kind == 'fang': tri(A, p, (0.2, 1), 7.5, 2.0, R)
        elif kind == 'tassel':
            A.part(disk((p[0], p[1] + 1), 1.9), 0.7, R2 or 'gold'); G = (np.abs(XX - p[0]) <= 1.2 + (YY - p[1] - 2) * 0.22) & (YY > p[1] + 2) & (YY <= p[1] + 9.5)
            A.part(G, 0.62 - 0.14 * (XX - p[0]) - 0.10 * ((XX.astype(int) % 2) == 0), R)
        elif kind == 'gem': gem(A, (p[0], p[1] + 2.5), 2.4, R, 'dia', ring=R2, glow=None)
        elif kind == 'ring': 
            d = np.hypot(XX - p[0], YY - p[1] - 2.2); A.part((d <= 2.6) & (d >= 1.2), 0.7 - 0.2 * (XX - p[0] + YY - p[1] - 2.2) / 3, R)
    return f
def spikes(tw0, ths, ln=4.5, w=1.7, R='bone', k=1.1):
    def f(C):
        A = C['A']; F = C['F']
        for th0 in ths:
            q = C['S'](tw0, th0, k); out = math.sin(th0); d = F.nx * out * 1.0 + F.ax * 0.35 + np.array([0, 0.0])
            if abs(out) < 0.75: rivet(A, (q[0] - 1, q[1] - 1), R, 1.6)
            else: tri(A, q - F.nx * out * 0.8, d, ln, w, R)
    return f
def wing(side=-1, n=4, R='white', ln=15, tw0=0.9, lum=False, k=1.05):
    def f(C):
        A = C['A']; F = C['F']; q = C['S'](tw0, side * 1.25, k) - F.nx * side * 1.5
        for i in range(n):
            a = math.radians(-18 + i * 26); base = F.nx * side
            d = base * math.cos(a) + F.ax * math.sin(a) * 1.0
            leaf(A, q - F.ax * i * 1.2, d, ln * (1 - 0.14 * i), 2.9, FE[R] if isinstance(R, str) and R in FE else M[R] if isinstance(R, str) else R, lum=lum)
    return f
def bolt(pts, R='yellow', w=0.95, glow='#ffe060'):
    def f(C):
        A = C['A']; P = curve([C['S'](a, b) for a, b in pts]); d, bt, bs = cdist(P)
        m = (d <= w) & C['body']; A.part(m, 0.9, R, edge=False, rim=0, ao=0, lum=True, outc=M[R][1]); A.glow(m, glow, 1.6, 0.55)
    return f
def vine(pitch=9.0, slope=1.1, R='vine', w=0.16, a0=0.16, a1=0.84):
    def f(C):
        A = C['A']; q = (C['al'] + C['ar'] * slope) / pitch; fr = q - np.floor(q)
        m = C['body'] & (fr < w) & (C['tw'] > a0) & (C['tw'] < a1); A.part(m, C['sh'] * 0.9 + 0.1, R, rim=0.12, ao=0.1)
    return f
def stars(n=22, seed=3, c='#fff8d0', c2='#9cc8ff'):
    def f(C):
        A = C['A']; rs = np.random.RandomState(seed); ys, xs = np.nonzero(C['body'] & (C['tw'] > 0.18) & (C['tw'] < 0.80) & (np.abs(C['v']) < 0.9))
        for i in rs.choice(len(ys), min(n, len(ys)), replace=False):
            A.px(xs[i], ys[i], c if rs.rand() < 0.55 else c2)
    return f
def crystal(A, p, d, ln, w, R='ice', lum=False, glow=None):
    d = np.array(d, float); d /= np.hypot(*d); G = Frame(p, (p[0] + d[0] * ln, p[1] + d[1] * ln))
    m = (G.t >= 0) & (G.t <= 1) & (np.abs(G.u) <= w * np.minimum(1, (1 - G.t) / 0.38) + 0.3)
    m = A.part(m, np.where(G.u < -0.2, 0.86, 0.52) - 0.12 * (G.t < 0.2), R, lum=lum, outc=M[R][1] if lum else None)
    if glow: A.glow(m, glow, 1.6, 0.5)
    return m
