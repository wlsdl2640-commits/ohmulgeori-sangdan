"""큰 도트 그림판 2 (빌드 65 — 사용자가 준 방어구 · 신발 · 벨트 그림 수준에 맞추는 방식).
배운 것: ① 64칸쯤의 판을 96px로(한 칸 1.5px — 살짝 부드러운 도트) ② 굵은 검은 바깥 테
③ 재질마다 여섯 톤을 부드럽게 잇는 명암(빛은 왼쪽 위) · 둥근 몸은 띠 명암 + 그늘 쪽 가장자리 되비침
④ 부위가 겹치는 곳은 그 부위의 짙은 색 테 · 위 · 왼쪽 가장자리는 한 줄 빛, 아래 · 오른쪽은 한 줄 그늘
⑤ 가죽 얼룩 · 나뭇결 · 털 같은 잔 무늬 ⑥ 죔쇠 · 징 · 박음질 · 보석 · 털 같은 작은 것으로 단계 차이
⑦ 높은 단계는 색이 화려해지고 빛 · 반짝이.
numpy 판: 부위 = (칸 가림판, 밝기 0~1, 재질 색 띠)."""
import math
import numpy as np
from PIL import Image, ImageFilter
N = 64
YY, XX = np.mgrid[0:N, 0:N].astype(float) + 0.5
OUT = np.array([10, 4, 6], float)
def hx(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def ramp(*hs): return np.array([hx(h) for h in hs], float)   # 짙음 → 빛
M = {
    'leather':  ramp('#140804', '#2e150a', '#4b2613', '#6e3c20', '#96582f', '#c88248', '#eab078'),
    'worn':     ramp('#150c08', '#2c1c12', '#46301f', '#62462f', '#806044', '#a4825e', '#c8a680'),
    'dleather': ramp('#0c0604', '#1c0f09', '#301b10', '#472a1a', '#623d26', '#845838', '#aa7a52'),
    'tan':      ramp('#22120a', '#422614', '#684022', '#926234', '#bc8a4a', '#deb26a', '#f6d894'),
    'red':      ramp('#1c0406', '#3c0a0e', '#621216', '#8c1e20', '#b8342c', '#de5a40', '#f89468'),
    'green':    ramp('#06140a', '#102812', '#1c401c', '#2e5e28', '#467e38', '#68a24e', '#98c870'),
    'blue':     ramp('#060c22', '#0e1a40', '#182c64', '#24468c', '#3466b4', '#508cd8', '#8cbcf6'),
    'navy':     ramp('#030510', '#080c22', '#101636', '#1a2250', '#283270', '#3c4a94', '#6070bc'),
    'purple':   ramp('#10061e', '#22103a', '#381a5a', '#522a80', '#7242a8', '#9866d0', '#c8a0f4'),
    'white':    ramp('#2e2a36', '#56505e', '#827c88', '#aca6ae', '#d0cbce', '#ece8e6', '#ffffff'),
    'black':    ramp('#030305', '#0a0a10', '#14141c', '#20202c', '#30303f', '#48485c', '#70708a'),
    'iron':     ramp('#0c0e18', '#1e2232', '#383e54', '#5a627c', '#868ea6', '#b8c0d2', '#f2f5fc'),
    'steeld':   ramp('#06080e', '#10141e', '#1e2432', '#30384c', '#48526a', '#6c7892', '#a0acc6'),
    'gold':     ramp('#2a1004', '#54280a', '#864a10', '#b87418', '#e0a42c', '#f8d254', '#fff8b4'),
    'bronze':   ramp('#1e0c06', '#40200e', '#683a1a', '#905a28', '#b8803c', '#dcaa5a', '#f8d894'),
    'silver':   ramp('#1c2232', '#3c4458', '#626c86', '#8e98b0', '#b8c0d4', '#dee4f0', '#ffffff'),
    'wood':     ramp('#160a04', '#30190c', '#4e2e18', '#704828', '#94683a', '#b88c52', '#dcb47a'),
    'dwood':    ramp('#0c0604', '#1e100a', '#341e12', '#4c2e1c', '#68432a', '#885e3c', '#ac8258'),
    'fur':      ramp('#3c3028', '#685a4c', '#948672', '#bcb09a', '#dcd2be', '#f2ecdc', '#ffffff'),
    'furd':     ramp('#0e0906', '#22180f', '#3a2a1c', '#56402c', '#745a3e', '#967a58', '#bca07a'),
    'ice':      ramp('#08204a', '#123e78', '#2468aa', '#4898d4', '#82c8f0', '#c0ecfc', '#ffffff'),
    'scale':    ramp('#180406', '#34080c', '#560e14', '#7e181c', '#aa2a28', '#d44a36', '#f48658'),
    'jade':     ramp('#041810', '#0a3022', '#124e38', '#1e7452', '#349c70', '#62c896', '#aef2c8'),
    'bone':     ramp('#342c20', '#5c523e', '#867a60', '#aea284', '#d0c6a8', '#eae2c8', '#fffcee'),
    'dark':     ramp('#020204', '#06050a', '#0e0c16', '#181624', '#262436', '#3a3852', '#5a5878'),
    'vine':     ramp('#081a06', '#122e0e', '#224c1a', '#386e26', '#549438', '#7ebc50', '#b6e884'),
    'cyan':     ramp('#042430', '#083e50', '#10647c', '#1c90a8', '#3cbcd0', '#80e4ee', '#dcfdff'),
    'yellow':   ramp('#3a2204', '#64400a', '#946a12', '#c4981e', '#eac638', '#fce870', '#fffdcc'),
    'orange':   ramp('#2c0c04', '#541a08', '#84300c', '#b85016', '#e27a26', '#faaa4a', '#ffdc92'),
    'pink':     ramp('#2c081a', '#50122e', '#7c2248', '#ac3a68', '#d65e8e', '#f290b6', '#ffcce0'),
    'star':     ramp('#02030e', '#060a20', '#0c143a', '#162058', '#24327e', '#3a4ca8', '#6880d8'),
    'plat':     ramp('#20283a', '#444e66', '#6e7a94', '#9aa6be', '#c4cede', '#e6ecf5', '#ffffff'),
}
def rcol(R, s):
    k = len(R) - 1; f = np.clip(s, 0, 1) * k; i = np.minimum(f.astype(int), k - 1); w = (f - i)[..., None]
    return R[i] * (1 - w) + R[i + 1] * w
def h01(ix, iy, seed=0):
    n = (ix.astype(np.int64) * 374761393 + iy.astype(np.int64) * 668265263 + int(seed) * 1442695041) & 0xffffffff
    n = ((n ^ (n >> 13)) * 1274126177) & 0xffffffff
    return ((n ^ (n >> 16)) & 0xffff) / 65536.0
def vnoise(x, y, sc, seed=0):
    x = x / sc; y = y / sc; ix = np.floor(x).astype(np.int64); iy = np.floor(y).astype(np.int64); fx = x - ix; fy = y - iy
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy)
    a = h01(ix, iy, seed); b = h01(ix + 1, iy, seed); c = h01(ix, iy + 1, seed); d = h01(ix + 1, iy + 1, seed)
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
def shift(m, dy, dx, fill=False):
    r = np.full_like(m, fill)
    ys = slice(max(dy, 0), N + min(dy, 0)); yd = slice(max(-dy, 0), N + min(-dy, 0))
    xs = slice(max(dx, 0), N + min(dx, 0)); xd = slice(max(-dx, 0), N + min(-dx, 0))
    r[ys, xs] = m[yd, xd]; return r
def nb4(m): return shift(m, 1, 0) | shift(m, -1, 0) | shift(m, 0, 1) | shift(m, 0, -1)
def nb8(m): return nb4(m) | shift(m, 1, 1) | shift(m, -1, -1) | shift(m, 1, -1) | shift(m, -1, 1)
# ── 꼴
def disk(c, r): return (XX - c[0]) ** 2 + (YY - c[1]) ** 2 <= r * r
def ell(c, a, b, ang=0.0):
    ca, sa = math.cos(ang), math.sin(ang); px = XX - c[0]; py = YY - c[1]
    u = (px * ca + py * sa) / a; w = (-px * sa + py * ca) / b
    return u * u + w * w <= 1, u, w
def poly(pts):
    m = np.zeros((N, N), bool); n = len(pts)
    for i in range(n):
        x0, y0 = pts[i]; x1, y1 = pts[(i + 1) % n]
        if y0 == y1: continue
        c = ((y0 <= YY) != (y1 <= YY)) & (XX < (x1 - x0) * (YY - y0) / (y1 - y0) + x0)
        m ^= c
    return m
def segdist(p0, p1):
    """점에서 선분까지: (거리, t 0~1, 부호 있는 옆 거리 — 진행 방향 오른쪽이 +)"""
    x0, y0 = p0; x1, y1 = p1; dx, dy = x1 - x0, y1 - y0; L2 = dx * dx + dy * dy or 1e-9
    t = np.clip(((XX - x0) * dx + (YY - y0) * dy) / L2, 0, 1)
    d = np.hypot(XX - (x0 + t * dx), YY - (y0 + t * dy)); L = math.sqrt(L2)
    u = ((XX - x0) * -dy + (YY - y0) * dx) / L
    return d, t, u
def curve(pts, n=80):
    """2차 베지어(점 셋) 또는 꺾은선 → 촘촘한 점 줄"""
    pts = [np.array(p, float) for p in pts]
    if len(pts) == 3:
        t = np.linspace(0, 1, n)[:, None]; return (1 - t) ** 2 * pts[0] + 2 * t * (1 - t) * pts[1] + t * t * pts[2]
    out = []
    for a, b in zip(pts, pts[1:]):
        for t in np.linspace(0, 1, max(2, int(np.hypot(*(b - a)) * 2))): out.append(a + (b - a) * t)
    return np.array(out)
def cdist(P):
    """점 줄에서의 거리 · 가장 가까운 점 번호(0~1) · 옆 부호"""
    best = np.full((N, N), 1e9); bt = np.zeros((N, N)); bs = np.zeros((N, N)); n = len(P)
    for i in range(n):
        d = np.hypot(XX - P[i][0], YY - P[i][1]); k = d < best
        j = min(i + 1, n - 1); j0 = max(i - 1, 0); tx, ty = P[j] - P[j0]
        sgn = (XX - P[i][0]) * -ty + (YY - P[i][1]) * tx
        best = np.where(k, d, best); bt = np.where(k, i / (n - 1), bt); bs = np.where(k, np.sign(sgn), bs)
    return best, bt, bs
class Frame:
    """축 B → T: t 0(B) ~ 1(T), u = 옆 거리(px, 오른쪽 아래가 +)"""
    def __init__(s, B, T):
        s.B = np.array(B, float); s.T = np.array(T, float); d = s.T - s.B; s.L = float(np.hypot(*d)); s.ax = d / s.L
        s.nx = np.array([-s.ax[1], s.ax[0]])
        if s.nx[0] < 0: s.nx = -s.nx
        px = XX - s.B[0]; py = YY - s.B[1]
        s.t = (px * s.ax[0] + py * s.ax[1]) / s.L; s.u = px * s.nx[0] + py * s.nx[1]
    def P(s, t, u=0.0): return s.B + s.ax * (t * s.L) + s.nx * u
# ── 명암
def cyl_shade(v, amb=0.10, lx=-0.62, g=1.45):
    nz = np.sqrt(np.clip(1 - v * v, 0, 1)); lz = math.sqrt(1 - lx * lx)
    d = np.clip(lx * v + lz * nz, 0, 1); s = amb + (1 - amb) * d ** g
    return s + 0.12 * np.clip((v - 0.66) / 0.34, 0, 1) * np.clip((1 - v) / 0.1, 0, 1)
def met_shade(v, amb=0.10):
    """쇠 · 금: 좁고 센 빛 띠 + 그늘 쪽 둘째 빛"""
    s = cyl_shade(v, amb, g=1.9) * 0.80
    return s + 0.34 * np.exp(-((v + 0.52) / 0.16) ** 2) + 0.16 * np.exp(-((v - 0.58) / 0.10) ** 2)
def ball_shade(dx, dy, r, amb=0.14):
    x = dx / r; y = dy / r; z = np.sqrt(np.clip(1 - x * x - y * y, 0, 1))
    d = np.clip(-0.50 * x - 0.56 * y + 0.66 * z, 0, 1); s = amb + (1 - amb) * d ** 1.2
    return s + 0.10 * np.clip((x + y) * 0.7 - 0.55, 0, 1)
class Art:
    def __init__(s, seed=1):
        s.rgb = np.zeros((N, N, 3)); s.on = np.zeros((N, N), bool); s.pid = np.zeros((N, N), int); s.k = 0
        s.lum = np.zeros((N, N), bool); s.outc = np.zeros((N, N, 3)) + OUT; s.glows = []; s.seed = seed; s.free = np.zeros((N, N), bool)
    def part(s, m, sh, R, edge=True, rim=0.13, ao=0.10, tex=0.0, grain=None, lum=False, outc=None, ecol=None, clip=None):
        R = M[R] if isinstance(R, str) else R
        m = m & clip if clip is not None else m.copy()
        if not m.any(): return m
        s.k += 1
        sh = np.broadcast_to(np.asarray(sh, float), (N, N)).copy()
        if tex: sh += (vnoise(XX, YY, 4.2, s.seed * 7 + s.k) - .5) * tex + (vnoise(XX, YY, 1.7, s.seed * 3 + s.k) - .5) * tex * .5
        if grain is not None: sh += grain
        up = ~shift(m, 1, 0); lf = ~shift(m, 0, 1); dn = ~shift(m, -1, 0); rt = ~shift(m, 0, -1)
        if rim: sh[m & (up | lf)] += rim
        if ao: sh[m & (dn | rt) & ~(up | lf)] -= ao
        s.rgb[m] = rcol(R, sh)[m]
        if edge:
            e = m & nb4(s.on & ~m)
            s.rgb[e] = ecol if ecol is not None else R[0] * 0.82
        s.on |= m; s.pid[m] = s.k; s.lum[m] = lum
        s.outc[m] = OUT if outc is None else np.array(outc, float)
        return m
    def px(s, x, y, c, lum=False, free=False):
        x = int(x); y = int(y)
        if 0 <= x < N and 0 <= y < N:
            s.rgb[y, x] = hx(c) if isinstance(c, str) else c; s.on[y, x] = True; s.lum[y, x] = lum; s.free[y, x] = free   # free = 테 없는 빛 점
    def tint(s, m, c, a):
        """이미 칠한 칸에 색을 섞는다(빛 번짐 · 무늬)"""
        m = m & s.on; c = np.array(hx(c) if isinstance(c, str) else c, float)
        a = np.broadcast_to(np.asarray(a, float), (N, N))[m][:, None]
        s.rgb[m] = s.rgb[m] * (1 - a) + c * a
    def glow(s, m, c, r=2.2, a=0.75): s.glows.append((m.copy(), hx(c) if isinstance(c, str) else list(c), r, a))
    def rgba(s):
        im = np.zeros((N, N, 4))
        for m, c, r, a in s.glows:   # 테 바깥 빛(뒤에 깔린다)
            g = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), float) / 255
            g = np.clip(g * 2.2, 0, 1) * a; k = g > im[..., 3]
            im[k, :3] = c; im[k, 3] = g[k]
        o = ~s.on & (nb8(s.on & ~s.lum & ~s.free) | nb4(s.on & ~s.free))
        sil = s.on & ~s.lum & (~shift(s.on, -1, 0) | ~shift(s.on, 0, -1)) & shift(s.on, 1, 0, True) & shift(s.on, 0, 1, True)
        rgb = s.rgb.copy(); rgb[sil] = rgb[sil] * 0.55
        # 테 색: 이웃한 칸의 테 색(빛나는 부위는 제 짙은 빛깔)
        oc = np.zeros((N, N, 3)); cnt = np.zeros((N, N))
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            k = shift(s.on, dy, dx); c = np.zeros((N, N, 3)); c[max(dy, 0):N + min(dy, 0), max(dx, 0):N + min(dx, 0)] = s.outc[max(-dy, 0):N + min(-dy, 0), max(-dx, 0):N + min(-dx, 0)]
            # 검은 테가 먼저(어두운 쪽을 고른다)
            first = k & (cnt == 0); darker = k & (cnt > 0) & (c.sum(-1) < oc.sum(-1))
            oc[first | darker] = c[first | darker]; cnt += k
        im[o, :3] = oc[o]; im[o, 3] = 1
        im[s.on, :3] = rgb[s.on]; im[s.on, 3] = 1
        im[..., :3] = np.clip(im[..., :3], 0, 255); im[..., 3] *= 255
        return im.astype(np.uint8)
    def image(s, size=96, trim=True):
        a = s.rgba(); im = Image.fromarray(a, 'RGBA')
        if trim:
            ys, xs = np.nonzero(a[..., 3] > 24); im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        k = size / max(im.size); big = im.resize((im.width * 6, im.height * 6), Image.NEAREST)
        return big.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
# ── 작은 것
def rivet(A, p, R='iron', r=1.0):
    R = M[R] if isinstance(R, str) else R; x, y = int(p[0]), int(p[1])
    if r >= 1.4:
        m = disk((x + 1, y + 1), r); A.part(m, ball_shade(XX - x - 1, YY - y - 1, r) * 1.1, R, rim=0, ao=0)
    else:
        A.px(x, y, R[-1]); A.px(x + 1, y, R[-3]); A.px(x, y + 1, R[-3]); A.px(x + 1, y + 1, R[1])
def gem(A, c, r, R, shape='dia', ring=None, glow=None):
    """보석: 마름모 · 둥근 · 길쭉. ring = 테 재질"""
    R = M[R] if isinstance(R, str) else R; cx, cy = c
    dx = XX - cx; dy = YY - cy
    if shape == 'dia': d = np.abs(dx) / r + np.abs(dy) / (r * 1.25)
    elif shape == 'oval': d = np.hypot(dx / r, dy / (r * 1.3))
    else: d = np.hypot(dx, dy) / r
    if ring:
        k = (r + 1.6) / r; A.part(d <= k, 0.62 - 0.25 * (dx + dy) / (r + 2), ring, rim=0.2, ao=0.12)
    m = d <= 1
    sh = 0.50 - 0.34 * (dx + dy) / (r * 1.6) + 0.18 * (np.abs(dx) < 0.6) * (dy < 0) - 0.16 * ((dx > 0) & (dy > 0))
    A.part(m, sh, R, rim=0.16, ao=0.12, lum=bool(glow))
    A.px(cx - r * 0.35, cy - r * 0.55, [255, 255, 255], lum=bool(glow))
    if glow: A.glow(m, glow, 1.8, 0.7)
    return m
def stitch(A, P, c1, c2=None, step=3, on=2):
    """점 줄을 따라 박음질(밝은 실 · 그 아래 짙은 구멍)"""
    acc = 0.0; last = None; seen = set()
    for p in P:
        if last is not None: acc += float(np.hypot(*(p - last)))
        last = p
        if acc % step < on:
            k = (int(p[0]), int(p[1]))
            if k in seen or not (0 <= k[0] < N and 0 <= k[1] < N) or not A.on[k[1], k[0]]: continue
            seen.add(k); A.px(k[0], k[1], c1)
def sheet(items, path, title, sub, cols=4, z=2, font_dir=None, bgs=((40, 47, 68),)):
    """items: [(PIL 96px 그림, 레벨 글, 이름, 설명)] — 크게(z배) + 게임 칸 크기(40px)"""
    from PIL import ImageDraw, ImageFont
    import os
    FD = font_dir or os.environ.get('GALMURI_DIR', './')   # Galmuri11.ttf · Galmuri11-Bold.ttf가 있는 폴더(끝에 /)
    F = lambda px, b=False: ImageFont.truetype(FD + ('Galmuri11-Bold.ttf' if b else 'Galmuri11.ttf'), px)
    W = 1000; Mg = 22; cw = (W - 2 * Mg - (cols - 1) * 8) // cols
    tmp = ImageDraw.Draw(Image.new('RGB', (4, 4)))
    def wrap(t, f, w):
        ls, cur = [], ''
        for word in t.split(' '):
            q = (cur + ' ' + word).strip()
            if tmp.textlength(q, font=f) <= w: cur = q
            else:
                if cur: ls.append(cur)
                cur = word
        if cur: ls.append(cur)
        return ls
    cells = [(im, lv, wrap(nm, F(16, True), cw - 16), wrap(ds, F(13), cw - 16)) for im, lv, nm, ds in items]
    sq = 96 * z
    ch = 14 + sq + 10 + 24 + max(len(c[2]) for c in cells) * 21 + 6 + max(len(c[3]) for c in cells) * 17 + 12
    rows = (len(cells) + cols - 1) // cols; head = Mg + 44 + 26 + 10
    H = head + rows * (ch + 8) + Mg
    out = Image.new('RGB', (W, H), (16, 19, 28)); d = ImageDraw.Draw(out)
    d.text((Mg, Mg - 4), title, font=F(33, True), fill=(242, 196, 68)); d.text((Mg, Mg + 44), sub, font=F(15), fill=(150, 158, 178))
    for i, (im, lv, nl, dl) in enumerate(cells):
        x = Mg + (i % cols) * (cw + 8); y = head + (i // cols) * (ch + 8)
        d.rectangle([x, y, x + cw - 1, y + ch - 1], fill=(26, 31, 46), outline=(52, 60, 84))
        sx = x + (cw - sq) // 2; bg = bgs[i % len(bgs)]
        d.rectangle([sx - 4, y + 8, sx + sq + 3, y + 8 + sq + 5], fill=bg)
        big = im.resize((im.width * z, im.height * z), Image.NEAREST)
        out.paste(big, (sx + (sq - big.width) // 2, y + 11 + (sq - big.height) // 2), big)
        k = 40 / max(im.size); sm = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        d.rectangle([x + 5, y + 7, x + 50, y + 52], fill=bg, outline=(70, 80, 108)); out.paste(sm, (x + 8 + (40 - sm.width) // 2, y + 10 + (40 - sm.height) // 2), sm)
        ty = y + 14 + sq + 10
        d.text((x + (cw - d.textlength(lv, font=F(18, True))) // 2, ty), lv, font=F(18, True), fill=(242, 196, 68)); ty += 24
        for t in nl: d.text((x + (cw - d.textlength(t, font=F(16, True))) // 2, ty), t, font=F(16, True), fill=(236, 230, 212)); ty += 21
        ty += 6
        for t in dl: d.text((x + (cw - d.textlength(t, font=F(13))) // 2, ty), t, font=F(13), fill=(150, 158, 178)); ty += 17
    out.save(path); return out.size
