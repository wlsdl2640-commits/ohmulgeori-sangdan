"""전사 시안 3 그림 도구: 모양(마스크)을 놓고 3톤 셀 명암(왼쪽 위 빛 띠 · 오른쪽 아래 그늘 띠) + 재질 색 테. 흐림 · 그러데이션 없음."""
import numpy as np
from PIL import Image, ImageDraw
W = H = 72
def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
def ramp(hi, base, sh, line): return [hx(hi), hx(base), hx(sh), hx(line)]
K = hx('#17121c')
M = dict(
 steel=ramp('#f4f8fb', '#aab6c4', '#6c7a8c', '#2c3340'), dsteel=ramp('#b4c0ce', '#74808f', '#48525f', '#1e242d'),
 gold=ramp('#fff0a0', '#e8b83c', '#a8741e', '#4a300c'), red=ramp('#f0685a', '#cc3a30', '#8c2224', '#3c0e14'),
 blue=ramp('#6aa4ec', '#3a6cc0', '#264684', '#101e40'), green=ramp('#8cc060', '#5a9040', '#386228', '#14280e'),
 leather=ramp('#c08a54', '#94603a', '#643c22', '#2a160a'), dleather=ramp('#8a6040', '#5e3e28', '#3e2616', '#1c0e06'),
 cloth=ramp('#e8dcc0', '#c4b48e', '#8e7e5e', '#3c3222'), dark=ramp('#5c5670', '#3e3a50', '#282536', '#100e18'),
 skin=ramp('#ffd8b0', '#f0b488', '#c8845c', '#5a2e1c'), hair=ramp('#b07a44', '#7e5028', '#523216', '#22120a'),
 blond=ramp('#fff0a8', '#e4bc5c', '#a87e30', '#4a3410'), fur=ramp('#e8e0d0', '#b8a890', '#807058', '#342a1e'),
 wood=ramp('#c89858', '#9a6c38', '#6a4622', '#2c1a0a'), white=ramp('#ffffff', '#e4e8ee', '#a8b0be', '#40465a'),
 black=ramp('#6a6478', '#3a3644', '#22202a', '#0c0a10'))
class Cv:
    def __init__(s): s.a = np.zeros((H, W, 4), np.uint8)
    def mask(s, kind, *p):
        im = Image.new('1', (W, H)); d = ImageDraw.Draw(im)
        if kind == 'r': d.rectangle(p, 1)
        elif kind == 'e': d.ellipse(p, 1)
        elif kind == 'p': d.polygon(list(p), 1)
        return np.array(im, bool)
    @staticmethod
    def sh(m, dx, dy):
        o = np.zeros_like(m); h, w = m.shape
        o[max(dy, 0):h + min(dy, 0), max(dx, 0):w + min(dx, 0)] = m[max(-dy, 0):h + min(-dy, 0), max(-dx, 0):w + min(-dx, 0)]; return o
    def put(s, m, mat, rim=1, shade=2, line=True, clip=None):
        r = M[mat] if isinstance(mat, str) else mat
        if clip is not None: m = m & clip
        if line:
            ring = (s.sh(m, 1, 0) | s.sh(m, -1, 0) | s.sh(m, 0, 1) | s.sh(m, 0, -1)) & ~m
            s.a[ring] = (*r[3], 255)
        s.a[m] = (*r[1], 255)
        if shade: s.a[m & ~s.sh(m, -shade, -shade)] = (*r[2], 255)
        if rim: s.a[m & ~s.sh(m, rim, rim) & s.sh(m, -1, -1)] = (*r[0], 255)
        return m
    def R(s, x0, y0, x1, y1, mat, **k): return s.put(s.mask('r', x0, y0, x1, y1), mat, **k)
    def E(s, x0, y0, x1, y1, mat, **k): return s.put(s.mask('e', x0, y0, x1, y1), mat, **k)
    def P(s, pts, mat, **k): return s.put(s.mask('p', *pts), mat, **k)
    def px(s, pts, mat, tone=1):
        c = (M[mat][tone] if isinstance(mat, str) else mat)
        for x, y in pts: s.a[y, x] = (*c, 255)
    def hl(s, x0, x1, y, mat, tone=1): s.px([(x, y) for x in range(x0, x1 + 1)], mat, tone)
    def vl(s, x, y0, y1, mat, tone=1): s.px([(x, y) for y in range(y0, y1 + 1)], mat, tone)
    def outline(s):
        m = s.a[..., 3] > 0; ring = (s.sh(m, 1, 0) | s.sh(m, -1, 0) | s.sh(m, 0, 1) | s.sh(m, 0, -1)) & ~m; s.a[ring] = (*K, 255)
    def img(s): return Image.fromarray(s.a, 'RGBA')
