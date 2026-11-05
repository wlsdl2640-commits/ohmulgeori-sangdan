"""참고 그림 느낌의 스킬 아이콘: 육각 틀(지금 쓰는 틀) 안을 속성 색 빛살·소용돌이·불꽃으로 채우고, 가운데에 뭉툭 상징을 얹는다."""
import math, hashlib, colorsys
from PIL import Image
import b4
RAMP = {   # 어둠 → 밝음 6단
    'fire':    ['#3a0a06', '#7a1a0a', '#c0380e', '#f07a1a', '#ffc040', '#fff4b0'],
    'blaze':   ['#2a0404', '#6a0c06', '#b0200a', '#e8501a', '#ffa030', '#ffe890'],
    'ice':     ['#0a1a4a', '#1a3a8a', '#2a70d0', '#60b0f8', '#b0e8ff', '#ffffff'],
    'water':   ['#06143a', '#0c2a70', '#1a58b8', '#30a0e8', '#80dcff', '#e0f8ff'],
    'wind':    ['#062a1a', '#0e5030', '#1a8a50', '#50c070', '#a0e8a0', '#f0fff0'],
    'storm':   ['#04202a', '#0a4050', '#10707a', '#30b0b0', '#80e8d8', '#e8fff8'],
    'earth':   ['#2a1406', '#5a2e10', '#8a5020', '#c08040', '#e8b878', '#fff0d0'],
    'thunder': ['#2a1a04', '#6a4a08', '#b08010', '#e8c020', '#fff060', '#ffffe0'],
    'steel':   ['#141a2a', '#283452', '#43598a', '#7a94c0', '#bcd0ec', '#f4f8ff'],
    'none':    ['#2a1008', '#5a240e', '#9a4418', '#d87a30', '#f8b860', '#fff0c8'],
    'holy':    ['#3a2a06', '#7a5a10', '#c09020', '#f0c840', '#fff090', '#ffffff'],
    'light':   ['#3a3010', '#7a6a20', '#c0a840', '#f0e070', '#fff8b8', '#ffffff'],
    'dark':    ['#12042a', '#300a5a', '#5a1a9a', '#9040d0', '#d090f0', '#ffe0ff'],
    'evil':    ['#200410', '#500a24', '#901a3a', '#d03a5a', '#f890a0', '#ffe0e8'],
    'heal':    ['#06200a', '#0e4a1a', '#1a8a30', '#50c050', '#a8f080', '#f4ffe0'],
    'poison':  ['#101e04', '#2a4a08', '#4a8010', '#80c020', '#c0f060', '#f4ffc0'],
    'blood':   ['#200404', '#500808', '#901010', '#d02a2a', '#f87a7a', '#ffe0e0'],
    'music':   ['#2a0624', '#5a0e50', '#a0288a', '#e050c0', '#ffa0e0', '#fff0fa'],
    'gold':    ['#2a1a04', '#6a4008', '#a87010', '#e0a820', '#ffe060', '#fffbe0'],
    'shadow':  ['#0e0e1e', '#20203a', '#3a3a64', '#6a6a9a', '#a8a8d0', '#e8e8ff'],
    'wood':    ['#201006', '#4a2a10', '#7a4a20', '#b07838', '#e0b070', '#fff0d0'],
    'arcane':  ['#0a0630', '#20106a', '#3a28b0', '#7060e0', '#b0a8ff', '#f0f0ff'],
}
PATTERN = {'fire': 'flame', 'blaze': 'swirl', 'ice': 'burst', 'water': 'swirl', 'wind': 'swirl', 'storm': 'swirl', 'earth': 'rays',
           'thunder': 'burst', 'steel': 'burst', 'none': 'rays', 'holy': 'rays', 'light': 'burst', 'dark': 'swirl', 'evil': 'rays',
           'heal': 'glow', 'poison': 'swirl', 'blood': 'rays', 'music': 'burst', 'gold': 'rays', 'shadow': 'swirl', 'wood': 'rays', 'arcane': 'burst'}
rgb = b4.rgb
def h01(s, k):
    return int(hashlib.md5(f'{s}|{k}'.encode()).hexdigest()[:8], 16) / 0xffffffff
def _mask():
    im = b4.hexbase('none'); px = im.load(); t = rgb(b4.HEX_TINT['none'])
    return {(x, y) for y in range(48) for x in range(48) if px[x, y][:3] == t}
MASK = _mask()
def noise(x, y, seed):
    # 값 잡음 (부드러운 덩어리)
    def r(i, j): return h01(seed, f'{i},{j}')
    i, j = math.floor(x), math.floor(y); fx, fy = x - i, y - j
    sx, sy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b, c, d = r(i, j), r(i + 1, j), r(i, j + 1), r(i + 1, j + 1)
    return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy
def value(pat, u, v, seed):
    r = math.hypot(u, v); th = math.atan2(v, u); rr = min(1, r)
    base = 1 - rr ** 1.1                       # 가운데 밝고 가장자리 어둡게
    ph = h01(seed, 'ph') * 2 * math.pi
    if pat == 'rays':                         # 굵은 빛살
        n = 6 + int(h01(seed, 'n') * 3)
        s = math.cos(th * n + ph)
        return 0.08 + base * 0.78 + (0.20 if s > 0.25 else -0.06) * (0.3 + 0.7 * rr)
    if pat == 'burst':                        # 별 모양 터짐
        n = 6 + int(h01(seed, 'n') * 3)
        s = abs(math.cos((th * n + ph) / 2)) ** 10
        return 0.06 + base * 0.62 + s * (1 - rr) ** 0.6 * 0.5
    if pat == 'swirl':                        # 두 갈래 소용돌이
        tw = (1.6 + h01(seed, 'tw') * 1.0) * (1 if h01(seed, 'd') > 0.5 else -1)
        w = (th / (2 * math.pi) * 2 + rr * tw + ph / math.pi) % 1
        band = 1 if w < 0.5 else 0
        return 0.08 + base * 0.62 + band * 0.26 * (0.25 + 0.75 * rr)
    if pat == 'flame':                        # 일렁이는 불꽃
        n = noise(u * 1.8 + 9, (v + 1.2) * 1.1 + h01(seed, 'o') * 5, seed)
        up = 0.55 - v * 0.4
        return 0.06 + base * 0.6 + (n - 0.35) * 0.55 * up
    return 0.06 + base * 0.94                 # 둥근 빛
KIND_PAT = {'heal': 'glow', 'regen': 'glow', 'cure': 'glow', 'revive': 'glow', 'dot': 'swirl', 'taunt': 'rays'}
SPARK = {'heal', 'holy', 'light', 'arcane', 'music', 'ice'}
def pick_pattern(theme, kind):
    return KIND_PAT.get(kind) or PATTERN.get(theme, 'rays')
def render_bg(theme, seed, grid=24, pat=None, kind=None, dim=0.0):
    pat = pat or pick_pattern(theme, kind); ramp = [rgb(c) for c in RAMP[theme]]
    im = Image.new('RGBA', (48, 48), (0, 0, 0, 0)); px = im.load(); sc = 48 // grid
    cx, cy, R = 23, 23.5, 20.5
    for gy in range(grid):
        for gx in range(grid):
            x, y = gx * sc + sc / 2, gy * sc + sc / 2
            u, v = (x - cx) / R, (y - cy) / R
            val = value(pat, u, v, seed) * (1 - dim)
            # 4×4 정돈된 디더링으로 단계 사이를 섞는다
            k = max(0, min(5, int(min(0.999, val) * 6)))
            col = ramp[k] + (255,)
            for yy in range(gy * sc, gy * sc + sc):
                for xx in range(gx * sc, gx * sc + sc):
                    if (xx, yy) in MASK: px[xx, yy] = col
    if theme in SPARK:   # 작은 반짝이 셋
        for i in range(3):
            a = h01(seed, f'sa{i}') * 2 * math.pi; d = 0.55 + h01(seed, f'sd{i}') * 0.3
            gx, gy = int((cx + math.cos(a) * d * R) // sc), int((cy + math.sin(a) * d * R) // sc)
            for dx, dy in ((0, 0), (1, 0), (-1, 0), (0, 1), (0, -1)):
                for yy in range((gy + dy) * sc, (gy + dy) * sc + sc):
                    for xx in range((gx + dx) * sc, (gx + dx) * sc + sc):
                        if (xx, yy) in MASK: px[xx, yy] = ramp[5 if (dx, dy) == (0, 0) else 4] + (255,)
    return im
def lighten(rgbc, f):
    h, l, s = colorsys.rgb_to_hls(*[c / 255 for c in rgbc])
    l = l + (1 - l) * f
    return tuple(round(c * 255) for c in colorsys.hls_to_rgb(h, l, s))
def icon(rows, pal3, theme, seed, kind='none', pips=0, grid=24, sym='orig', ol='k', pat=None, lift=False, dim=0.0):
    im = b4.hexbase(kind)
    bg = render_bg(theme, seed, grid, pat=pat, kind=kind, dim=dim); im.alpha_composite(bg)
    if sym == 'ramp':   # 상징의 속성 색 칸(1·2·3)은 배경보다 한 단 밝게
        pal3 = (RAMP[theme][5], RAMP[theme][4], RAMP[theme][3]); sym = 'orig'
    ic = b4.bake(rows, pal3)
    ramp = [rgb(c) for c in RAMP[theme]]
    if lift:   # 배경과 같은 색 계열인 칸은 흰빛 쪽으로 올려 떠 보이게 (참고 그림처럼 밝은 상징)
        th = colorsys.rgb_to_hls(*[v / 255 for v in ramp[3]])[0] * 360; p = ic.load()
        for y in range(ic.height):
            for x in range(ic.width):
                c = p[x, y]
                if not c[3] or c[:3] == rgb(b4.OUT): continue
                h, l, sat = colorsys.rgb_to_hls(*[v / 255 for v in c[:3]])
                d = abs(h * 360 - th) % 360; d = min(d, 360 - d)
                if d < 36 and sat > 0.3 and l < 0.7: p[x, y] = tuple(round(v + (255 - v) * 0.14) for v in c[:3]) + (255,)
    if ol != 'k':
        p = ic.load()
        for y in range(ic.height):
            for x in range(ic.width):
                if p[x, y][3] and p[x, y][:3] == rgb(b4.OUT): p[x, y] = ramp[0] + (255,)
    if sym != 'orig':
        p = ic.load()
        for y in range(ic.height):
            for x in range(ic.width):
                c = p[x, y]
                if not c[3]: continue
                if c[:3] == rgb(b4.OUT): p[x, y] = ramp[0] + (255,) if sym == 'tint' else c; continue
                if sym == 'bright': p[x, y] = lighten(c[:3], 0.25) + (255,)
                elif sym == 'tint':
                    lum = (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) / 255
                    k = 5 if lum > 0.72 else 4 if lum > 0.45 else 3
                    p[x, y] = ramp[k] + (255,)
    ic2 = ic.resize((ic.width * 2, ic.height * 2), Image.NEAREST)
    ox, oy = (48 - ic2.width + 1) // 2, (48 - ic2.height) // 2 + 1
    # 상징 뒤에 1칸 그늘 (빛살 위에서 떠 보이게)
    sh = Image.new('RGBA', ic2.size, (0, 0, 0, 0)); sp = sh.load(); ip = ic2.load()
    for y in range(ic2.height):
        for x in range(ic2.width):
            if ip[x, y][3]: sp[x, y] = (0, 0, 0, 90)
    im.alpha_composite(sh, (ox + 2, oy + 2)); im.alpha_composite(ic2, (ox, oy))
    if pips:
        x0 = 24 - (pips * 5 + (pips - 1)) // 2; px = im.load()
        for i in range(pips):
            for yy, row in enumerate(b4.PIP):
                for xx, ch in enumerate(row): px[x0 + i * 6 + xx, 4 + yy] = rgb(b4.FIX[ch]) + (255,)
    return im
