"""뭉툭 스킬 아이콘 굽기: 12×12 칸(테두리 없이) → 검은 테두리 + B4 손질(왼쪽 위 빛·부위 사이 선·쇠/가죽 질감) → 2배.
캐릭터(pxa.js pxBake)와 같은 손질을 아이콘에 맞춰 옮긴 것."""
from PIL import Image
FIX = {'k': '#1a1414', 'w': '#ffffff', 'm': '#d0d8e4', 'M': '#8a94a8', 'n': '#4a5266', 't': '#c08a4a', 'T': '#7a4c22', 'y': '#ffd84a',
       'Y': '#c0901c', 's': '#f4c494', 'S': '#c88a5a', 'r': '#e84848', 'R': '#9a2020', 'g': '#6ad04a', 'G': '#2a8a3a', 'p': '#b070ff',
       'P': '#6a34b0', 'b': '#4a8aff', 'B': '#2a4aa0', 'c': '#9aeeff', 'o': '#ff8a2a', 'e': '#f0e8d0', 'E': '#b8a684', 'l': '#b87a48',
       'L': '#7a4a2a', 'f': '#c4c4cc', 'F': '#74747e', 'h': '#fff0a8', 'q': '#4a3460', 'd': '#3a3a44', 'u': '#ff9ac0', 'U': '#c04a80',
       'a': '#9ad8ff', 'A': '#3a8ad0', 'v': '#7a5a3a', 'z': '#e0d0ff'}
OUT = '#1a1414'
# 재질 묶음 (1 = 선·빛을 안 넣는 것: 검정·흰 반짝임)
MAT = {'k': 1, 'w': 1, 'h': 1, 's': 2, 'S': 2, 't': 3, 'T': 3, 'v': 3, 'm': 5, 'M': 5, 'n': 5, 'y': 6, 'Y': 6, 'e': 7, 'E': 7,
       'g': 8, 'G': 8, 'l': 9, 'L': 9, 'p': 10, 'P': 10, 'q': 10, 'z': 10, 'f': 11, 'F': 11, 'd': 11, 'b': 12, 'B': 12, 'c': 12,
       'a': 12, 'A': 12, 'r': 13, 'R': 13, 'o': 14, 'u': 16, 'U': 16, '1': 15, '2': 15, '3': 15}
FX = {'rim': 0.24, 'line': 0.24}
def rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def grid(s): return [r for r in s.strip('\n').split('\n')]
def bake(rows, pal3, fx=True):
    """rows: 12줄 문자열, pal3: 속성 팔레트 (밝음, 중간, 어둠). 돌려주는 것: 1칸 = 1픽셀, 테두리 포함 RGBA."""
    H, W = len(rows), max(len(r) for r in rows)
    cols = dict(FIX); cols.update({'1': pal3[0], '2': pal3[1], '3': pal3[2]})
    im = Image.new('RGBA', (W + 2, H + 2), (0, 0, 0, 0)); px = im.load()
    at = lambda x, y: rows[y][x] if 0 <= y < H and 0 <= x < len(rows[y]) else '.'
    for y in range(H):
        for x in range(W):
            c = at(x, y)
            if c in '. ': continue
            col = rgb(cols[c]); f = 1.0
            if fx:
                m = MAT.get(c, 0); up, lf = at(x, y - 1), at(x - 1, y)
                if m > 1:
                    mu, ml = MAT.get(up, 0), MAT.get(lf, 0)
                    if (up not in '. ' and mu > 1 and mu != m) or (lf not in '. ' and ml > 1 and ml != m): f *= 1 - FX['line']
                    elif up in '. ' or lf in '. ': f *= 1 + FX['rim']
                    if m == 5 and (x + y) % 2: f *= 0.93
                    if m == 9 and x % 3 == 1 and y % 3 == 1: f *= 0.86
            col = tuple(min(255, round(v * f)) for v in col)
            px[x + 1, y + 1] = col + (255,)
    o = rgb(OUT) + (255,); al = [[px[x, y][3] for x in range(W + 2)] for y in range(H + 2)]
    for y in range(H + 2):
        for x in range(W + 2):
            if al[y][x]: continue
            if any(0 <= x + dx < W + 2 and 0 <= y + dy < H + 2 and al[y + dy][x + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): px[x, y] = o
    bb = im.getbbox()
    return im.crop(bb) if bb else im
HEX_TINT = {'dmg': '#4a2a22', 'mdmg': '#2e2246', 'heal': '#1e3a24', 'buff': '#1e2a44', 'dot': '#243a1e', 'taunt': '#4a2e18', 'none': '#241e1a'}
def hexbase(kind):
    W = 48; im = Image.new('RGBA', (W, W), (0, 0, 0, 0)); px = im.load(); cx = cy = W / 2; r = 22
    def span(y):
        dy = abs(y + 0.5 - cy); half = r * 0.866 if dy <= r / 2 else r * 0.866 * (r - dy) / (r / 2)
        return (round(cx - half), round(cx + half)) if half > 0 else None
    def line(y, c0, c1, col):
        for x in range(c0, c1): px[x, y] = rgb(col) + (255,)
    for y in range(W):
        s = span(y)
        if s: line(y, s[0], s[1], '#120e0c')
    for y in range(2, W - 2):
        s = span(y)
        if not s: continue
        t, b = span(y - 2), span(y + 2); edge = not t or not b
        l = max(s[0] + 2, t[0] + 1 if t else s[0] + 2, b[0] + 1 if b else s[0] + 2); rr = min(s[1] - 2, t[1] - 1 if t else s[1] - 2, b[1] - 1 if b else s[1] - 2)
        line(y, s[0] + 1, s[1] - 1, '#c8a870' if y < cy else '#8a6a3c')
        if not edge and l < rr: line(y, l, rr, '#8a6a3c' if y < cy else '#5a4428')
        if not edge and l + 1 < rr - 1: line(y, l + 1, rr - 1, HEX_TINT.get(kind, HEX_TINT['none']))
    return im
PIP = ['kkkkk', 'kwwwk', 'kwwwk', 'kwwwk', 'kkkkk']
def hex_icon(rows, pal3, kind, pips=0, fx=True):
    im = hexbase(kind); ic = bake(rows, pal3, fx); ic2 = ic.resize((ic.width * 2, ic.height * 2), Image.NEAREST)
    ox, oy = (48 - ic2.width + 1) // 2, (48 - ic2.height) // 2 + 1
    im.alpha_composite(ic2, (ox, oy))
    if pips:
        x0 = 24 - (pips * 5 + (pips - 1)) // 2; px = im.load()
        for i in range(pips):
            for yy, row in enumerate(PIP):
                for xx, ch in enumerate(row): px[x0 + i * 6 + xx, 4 + yy] = rgb(FIX[ch]) + (255,)
    return im
