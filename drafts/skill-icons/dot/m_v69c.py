"""빌드 69 — 새 숙련 「신성력」 그림 시안 3차: 교회(신전)의 색유리 창으로 빛이 들어온다
(11-13 18:49 사용자 「신성력시안 교회시설에 있는 스테인드글라스에 빛 들어오는 걸로 4개 ㄱㄱ」)
- 창은 넷 다 게임 본부 신전(hq.js A3_TEMPLE)의 둥근 꽃잎 색유리 창: 금 테 · 어두운 납 · 꽃잎 여덟
  (오른쪽 · 왼쪽 파랑, 위 · 아래 노랑, 왼쪽 위 · 오른쪽 아래 빨강, 오른쪽 위 · 왼쪽 아래 초록) · 가운데 흰 금빛.
  꽃잎 사이에 납 줄을 두어 위아래 · 좌우 꽃잎이 가운데로 이어지지 않게 했다(이어지면 더하기 꼴로 읽힌다).
  A 빛나는 큰 장미창 (창 둘레가 푸른 보랏빛으로 번짐 + 반짝임)
  B 세 색 빛살 (신전의 파랑 · 빨강 · 노랑 빛살이 바닥까지)
  C 신전 안 · 낮 (흰 대리석 벽 · 기둥 · 붉은 융단 · 바둑 바닥에 떨어진 색 빛)
  D 신전 안 · 어스름 (어두운 안쪽으로 흰 빛살 — 빛이 닿은 바닥 · 융단만 밝다)
- 빛은 흐림 없이 도트로만(섞은 색 두세 단계 · 바둑 무늬). 반짝임은 비스듬한 꼴(더하기 꼴 아님).
- 틀 · 단계 점은 숙련 B안(m_v63 · m_v69 · m_v69b와 같은 길).
- 시험판(구도 열세 가지)은 세션 작업 폴더 v85/proto*.py.
python3 m_v69c.py → m_v69c.png"""
import sys, math, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell, b4
from cell import Art, mix, W, H
from lib import *
from lib import R as RAMP
from mast import TIER, FRAME, FRAME0
from m_v63 import FRAME4
def A_(theme, **k): return bg(Art(), theme, **k)
GL = {'b': '#4a8aff', 'r': '#ff5050', 'y': '#ffd040', 'g': '#40d070', 'w': '#ffffff', 'h': '#fff0a0',
      'k': '#2a2030', 'o': '#f0c050', 'O': '#a87a20'}
HI = {'b': '#8cbcff', 'r': '#ff8c8c', 'y': '#ffe88c', 'g': '#8cf0b0'}
OUTC = '#140c10'
# 큰 창 (12칸): 꽃잎 2×2 여덟 + 가운데
ROSE12 = ['....oooo....',
          '..oo.yy.oo..',
          '.orr.yy.ggo.',
          '.orr....ggO.',
          'o....hh....O',
          'obb.hwwh.bbO',
          'obb.hwwh.bbO',
          'o....hh....O',
          '.ogg....rrO.',
          '.ogg.yy.rrO.',
          '..OO.yy.OO..',
          '....OOOO....']
# 작은 창 (10칸): 꽃잎 두세 칸 + 가운데 (빛살 자리를 남긴다)
ROSE10 = ['...oooo...',
          '.ookyykoo.',
          '.orrkkggO.',
          'okrkhhkgkO',
          'obkhwwhkbO',
          'obkhwwhkbO',
          'okgkhhkrkO',
          '.oggkkrrO.',
          '.oOkyykOO.',
          '...OOOO...']
def window(a, rows, ox, oy, hi=False):
    """창 칠하기: 테 안쪽 '.'은 납, 바깥 한 칸은 검은 테. hi면 꽃잎 왼쪽 위 칸을 밝게(유리 빛). 돌려주는 것 = 창 + 테 칸"""
    cm = set()
    for y, r in enumerate(rows):
        xs = [x for x, ch in enumerate(r) if ch != '.']
        if not xs: continue
        for x in range(min(xs), max(xs) + 1):
            ch = r[x]; c = GL['k'] if ch in '.k' else GL[ch]
            if hi and ch in HI:
                up = rows[y - 1][x] if y else '.'; lf = r[x - 1] if x else '.'
                if up != ch and lf != ch: c = HI[ch]
            a.set(ox + x, oy + y, c); cm.add((ox + x, oy + y))
    ring = {(x + dx, y + dy) for (x, y) in cm for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))} - cm
    for (x, y) in ring: a.set(x, y, OUTC)
    return cm | ring
def screen(c, l, k):
    c = cell.col(c); l = cell.col(l)
    return tuple(round(255 - (255 - c[i]) * (255 - l[i] * k) / 255) for i in range(3))
def inside(x, y): return bool(cell.MASK.get((x, y)))
def xspark(a, x, y, big=False):
    """비스듬한 반짝임 (가운데 흰 칸 + 대각 네 칸)"""
    a.set(x, y, '#ffffff')
    if big:
        for dx, dy in ((1, 1), (-1, 1), (1, -1), (-1, -1)):
            if a.get(x + dx, y + dy) is not None: a.set(x + dx, y + dy, mix(a.get(x + dx, y + dy), '#fff4c0', 0.7))
def trap(y0, y1, xa0, xa1, xb0, xb1):
    """사다리꼴: y0줄 [xa0, xa1] → y1줄 [xb0, xb1] (칸 가운데가 안에 들면) → {(x, y): 위에서부터 몫 t}"""
    out = {}
    for y in range(int(math.floor(y0)), int(math.ceil(y1)) + 1):
        yc = y + 0.5
        if yc < y0 or yc > y1: continue
        t = (yc - y0) / (y1 - y0); l = xa0 + (xb0 - xa0) * t; r = xa1 + (xb1 - xa1) * t
        for x in range(W):
            if l <= x + 0.5 <= r: out[(x, y)] = t
    return out
# ── A 빛나는 큰 장미창: 창 둘레가 계단처럼 번진다 ──
def glow_bg(a, theme, cx, cy, steps, rays=16, k=0.14):
    rp = RAMP[theme]
    for y in range(H):
        for x in range(W):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy); idx = steps[-1][1]
            for lim, i in steps:
                if d < lim: idx = i; break
            c = rp[idx]
            th = (math.atan2(y + 0.5 - cy, x + 0.5 - cx) + math.pi / rays) % (2 * math.pi)
            if (th * rays / (2 * math.pi)) % 1 < 0.5 and d > 7.0: c = mix(c, rp[0], k)   # 다른 숙련 그림 같은 옅은 살
            a.set(x, y, c)
def g_a(a):
    glow_bg(a, 'royal', 8.0, 7.0, ((7.4, 5), (8.6, 4), (9.9, 3), (11.5, 2), (99, 1)))   # 금 테가 묻히지 않게 푸른 보랏빛 (새벽 금빛은 테와 섞였다)
    window(a, ROSE12, 2, 1, hi=True)
    xspark(a, 14, 12, True); xspark(a, 1, 12); xspark(a, 12, 14)
# ── B 세 색 빛살: 창 아래쪽에서 파랑 · 빨강 · 노랑 빛살이 바닥까지 ──
def floor_dark(a, y0, k):
    for y in range(y0, H):
        for x in range(W): a.set(x, y, mix(a.get(x, y), '#000000', k))
def strip(a, y0, y1, x0, slope, w, C, ov, kw=0.55, kf=0.78, fy=13, overk=0.35):
    """빛줄기 하나: y0 → y1, 왼쪽 끝 x0 + slope·(y − y0), 너비 w. 창 위는 화면 섞기, 벽은 kw, 바닥(fy부터)은 kf"""
    for y in range(y0, y1 + 1):
        xs = x0 + slope * (y - y0)
        for i in range(w):
            x = int(math.floor(xs + i + 0.5))
            if not inside(x, y): continue
            c = a.get(x, y)
            if (x, y) in ov: a.set(x, y, screen(c, C, overk)); continue
            a.set(x, y, mix(c, C, kf if y >= fy else kw))
def g_b(a):
    floor_dark(a, 13, 0.3)
    ov = window(a, ROSE10, 3, 1)
    for x0, C in ((5.7, '#80b4ff'), (8.7, '#ff8080'), (11.7, '#ffe47a')): strip(a, 11, 15, x0, 0.34, 2, C, ov, kw=0.7, kf=0.85)   # 창 밑 테에서 시작 (창을 덮지 않음)
    xspark(a, 2, 12)
# ── C · D 신전 안: 벽 · 기둥 · 바둑 대리석 바닥 · 붉은 융단 (게임 신전 색) ──
SC = {'day': {'w0': '#d8d2c8', 'w1': '#b8b0a4', 'pil': '#f0ece4', 'pilD': '#b8b2a8', 'cap': '#f8d870', 'capD': '#c9a04a',
              'fl0': '#e8e4dc', 'fl1': '#a8a298', 'car': '#a8282a', 'carE': '#c9a04a', 'edge': '#8a8478', 'under': '#6a645a'},
      'dim': {'w0': '#3a3440', 'w1': '#28242e', 'pil': '#7a756c', 'pilD': '#4e4a44', 'cap': '#9a8040', 'capD': '#6a5628',
              'fl0': '#4a4642', 'fl1': '#34302e', 'car': '#5e1a1e', 'carE': '#7a6430', 'edge': '#24201e', 'under': '#1a1816'}}
LIT = {'fl0': '#f4f0e8', 'fl1': '#c8c2b8', 'car': '#d03438', 'carE': '#f0c860'}
def temple(a, mode):
    P = SC[mode]; kind = {}
    for y in range(H):
        for x in range(W):
            if y <= 11: a.set(x, y, mix(P['w0'], P['w1'], max(0, y - 2) / 9)); kind[(x, y)] = 'w'
            else: a.set(x, y, P['under']); kind[(x, y)] = 'u'
    for y in range(12, 16):
        j = y - 12
        for x in range(W):
            k = 'fl0' if ((x + j) // 2 + j) % 2 == 0 else 'fl1'; a.set(x, y, P[k]); kind[(x, y)] = k
        l = 6 - (j + 1) // 2; r = 9 + (j + 1) // 2
        for x in range(l, r + 1):
            k = 'car' if l < x < r else 'carE'; a.set(x, y, P[k]); kind[(x, y)] = k
    for x in range(W):
        if kind[(x, 12)] not in ('car', 'carE'): a.set(x, 12, mix(a.get(x, 12), P['edge'], 0.5))
    for x0 in (0, 14):
        for y in range(4, 12):
            a.set(x0, y, P['pil']); a.set(x0 + 1, y, P['pilD']); kind[(x0, y)] = kind[(x0 + 1, y)] = 'p'
        for y in (4, 11): a.set(x0, y, P['cap']); a.set(x0 + 1, y, P['capD'])
    return kind
def g_c(a):
    temple(a, 'day')
    ov = window(a, ROSE10, 3, 1)
    for (x, y), t in trap(10.5, 12.0, 6.5, 10.5, 8.0, 12.5).items():   # 벽에는 더 흰 빛 띠
        if (x, y) not in ov and inside(x, y): a.set(x, y, mix(a.get(x, y), '#fffbf0', 0.55))
    for (x, y, c) in [(10, 13, '#5a8ae0'), (11, 13, '#5a8ae0'), (12, 13, '#4ab870'), (10, 14, '#e8c040'), (11, 14, '#e8c040'),
                      (12, 14, '#e04848'), (13, 14, '#e04848'), (12, 15, '#e8c040'), (13, 15, '#5a8ae0')]:
        if inside(x, y): a.set(x, y, mix(a.get(x, y), c, 0.55))
def g_d(a):
    kind = temple(a, 'dim')
    ov = window(a, ROSE10, 3, 1)
    for (x, y) in {(x + dx, y + dy) for (x, y) in ov for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))} - ov:   # 창 둘레 한 칸 빛
        if kind.get((x, y)) == 'w' and inside(x, y): a.set(x, y, mix(a.get(x, y), '#fff0c8', 0.22))
    for (x, y), t in trap(9.0, 16.0, 6.5, 10.5, 9.5, 16.5).items():
        if (x, y) in ov or not inside(x, y): continue
        k = kind.get((x, y))
        if k in LIT: a.set(x, y, LIT[k])
        elif k == 'p': a.set(x, y, mix(a.get(x, y), '#fff4d0', 0.6))
        else: a.set(x, y, mix(a.get(x, y), '#fff0c8', 0.5 if t < 0.5 else 0.42))
    xspark(a, 11, 10); xspark(a, 12, 11)
OPTS = [('A', '빛나는 큰 장미창', '창 둘레 빛 번짐', g_a, None), ('B', '세 색 빛살', '파랑 · 빨강 · 노랑', g_b, 'night'),
        ('C', '신전 안 · 낮', '흰 대리석', g_c, 'night'), ('D', '신전 안 · 어스름', '흰 빛살', g_d, 'night')]
def art_sg(k, lit):
    _, _, _, g, theme = {o[0]: o for o in OPTS}[k]
    a = A_(theme or 'dawn', cy=6.5, rays=12, k=0.12, hole=4)
    g(a)
    if lit == 4: l, d = '#fffbe8', '#d8c070'
    else: l, d = TIER[lit - 1] if lit else ('#3a3440', '#241e28')
    for i in range(3):
        x = 4 + i * 3
        for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)):
            a.set(x + dx, 16 + dy, (l if (dx, dy) == (0, 0) else d) if i < max(lit, 0) or lit == 4 else ('#3a3440' if (dx, dy) == (0, 0) else '#241e28'))
    if lit == 4: a.set(7, 15, '#ffffff'); a.set(8, 15, '#fff0a0')
    return a
def img_sg(k, lit):
    art = art_sg(k, lit)
    if not lit: return art.img('buff')
    im = art.img('buff'); px = im.load(); hb = b4.hexbase('buff').load()
    fr = FRAME4 if lit == 4 else FRAME[lit - 1]
    m = {b4.rgb(FRAME0[i]): b4.rgb(fr[i]) for i in range(3)}
    for y in range(48):
        for x in range(48):
            c = hb[x, y]
            if c[3] and c[:3] in m: px[x, y] = m[c[:3]] + (255,)
    return im
if __name__ == '__main__':
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
    D = pathlib.Path(__file__).parent
    Z = 2; CW = 48 * Z + 8; LW = 170; BIG = 4; RH = 48 * BIG + 18
    rows = [('now', '신성학 (지금 · 비교)', '')] + [(k, f'{k}  {nm}', sub) for k, nm, sub, g, th in OPTS]
    XB = LW + 5 * CW + 20; XR = XB + 48 * BIG + 24
    sh = Image.new('RGB', (XR + 48 + 24, 62 + len(rows) * RH), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 8), '새 숙련 「신성력」 그림 시안 3차 — 신전 색유리 창으로 들어오는 빛', font=fb, fill=(240, 196, 90))
    for t, tt in enumerate(['안 배움', '초급(동)', '중급(은)', '상급(금)', '달인(백금)']): d.text((LW + t * CW + 18, 36), tt, font=f, fill=(170, 165, 155))
    d.text((XB + 60, 36), '상급 4배', font=f, fill=(170, 165, 155)); d.text((XR - 4, 36), '실제', font=f, fill=(170, 165, 155))
    def get(k, t): return Image.open(D / 'final_snap_mast' / f'holy_{t}.png').convert('RGBA') if k == 'now' else img_sg(k, t)
    for r, (k, name, sub) in enumerate(rows):
        y0 = 58 + r * RH; yc = y0 + (48 * BIG - 48 * Z) // 2
        d.text((10, yc + 30), name, font=fb, fill=(232, 228, 220) if k != 'now' else (170, 165, 155))
        if sub: d.text((10, yc + 52), sub, font=f, fill=(130, 126, 118))
        for t in range(5):
            z = cell.zoom(get(k, t), Z); sh.paste(z, (LW + t * CW, yc), z)
        zb = cell.zoom(get(k, 3), BIG); sh.paste(zb, (XB, y0), zb)
        im1 = get(k, 3); sh.paste(im1, (XR, y0 + (48 * BIG - 48) // 2), im1)
        if r: d.line([(10, y0 - 6), (sh.width - 10, y0 - 6)], fill=(44, 46, 54))
    out = D / 'm_v69c.png'; sh.save(out); print(out.name, sh.size)
