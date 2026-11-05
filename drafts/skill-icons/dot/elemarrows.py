"""속성 화살 시안 (빌드 39 예정): 불·얼음·번개 × 단계 4모습. 화살 그림(offhand.arrows)에 촉·깃 색을 바꾸고 촉 둘레에 효과.
A안: 촉 둘레에 불꽃·서리·전기 (단계가 오를수록 커진다) · B안: 화살 전체에 속성 빛 테두리 + 작은 효과
python3 elemarrows.py → elemarrows_sheet.png"""
import math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell
from cell import W, H, mix
from lib import *
import offhand as O
SHAFT = [('#c89a5a', '#7a4c22', '#8a8e98'), ('#e0c08a', '#8a5a2a', '#d0d8e4'), ('#5a3a2a', '#2e1e14', '#ffd84a'), ('#e8eef8', '#8a94a8', None)]
EL = {
    'fire':    {'name': '불화살', 'head': ('#fff4c0', '#ff9a3a', '#c8401a'), 'fl': ('#ff7a3a', '#b02a12'), 'c': '#ff7a3a',
                'fx': ['#a82a0e', '#e8501a', '#ff9a2a', '#ffd060', '#fff4c0'], 'glow': '#ff5a1a'},
    'ice':     {'name': '얼음 화살', 'head': ('#ffffff', '#b8f4ff', '#4aaad8'), 'fl': ('#f0fbff', '#8ad0f0'), 'c': '#9ae8ff',
                'fx': ['#2a6aa8', '#4aaad8', '#9ae8ff', '#e0f8ff', '#ffffff'], 'glow': '#5ac8f0'},
    'thunder': {'name': '번개 화살', 'head': ('#fffbe0', '#ffe04a', '#c89a1c'), 'fl': ('#e8dcff', '#8a6ce6'), 'c': '#ffe04a',
                'fx': ['#6248c0', '#8a6ce6', '#ffe04a', '#fff8b0', '#ffffff'], 'glow': '#ffd030'},
}
HX, HY = 13.0, 4.0        # 촉 가운데쯤 (16×20 판, 촉은 오른쪽 위)
KEY = (255, 0, 255)
def _arrow(a, head, fl_, band, glow_c=None, ss=4):
    """offhand.arrows와 같은 화살 (빛 테두리 glow_c를 넘긴다)"""
    ux, uy = 0.7071, -0.7071; px_, py_ = 0.7071, 0.7071
    tx, ty, L = 15.2, 2.6, 19.6
    cm = {}
    for y in range(H):
        for x in range(W):
            cnt = {}
            for j_ in range(ss):
                for i_ in range(ss):
                    X, Y = x + (i_ + 0.5) / ss, y + (j_ + 0.5) / ss; dx, dy = X - tx, Y - ty
                    s_ = L + (dx * ux + dy * uy); v = dx * px_ + dy * py_
                    if s_ < 0 or s_ > L: continue
                    if s_ >= L - 4.6 and abs(v) <= 2.5 * (L - s_) / 4.6: part = 'H' if v > 0.35 else 'w' if v < -0.35 else 'h'
                    elif L - 5.4 <= s_ < L - 4.6 and abs(v) <= 0.9: part = 'q'
                    elif 0.7 <= s_ <= 4.4 and 0.5 < abs(v) <= 1.55 - (s_ - 0.7) * 0.1: part = 'f' if v < 0 else 'F'
                    elif s_ < 0.9 and abs(v) <= 0.7: part = 'T'
                    elif abs(v) <= 0.72: part = 't'
                    else: continue
                    cnt[part] = cnt.get(part, 0) + 1
            if sum(cnt.values()) >= 0.42 * ss * ss: cm[(x, y)] = max(cnt, key=cnt.get)
    pal = {'w': (head[0], 5), 'h': (head[1], 5), 'H': (head[2], 5), 't': (band[0], 3), 'T': (band[1], 3), 'q': (band[2], 6), 'f': (fl_[0], 1), 'F': (fl_[1], 1)}
    sp(a, grid(cm), pal, glow_c=glow_c)
def _free(a, x, y):
    c = a.get(x, y); return c is not None and (c == KEY or c == cell.OUT)
def _over(a, cm):
    for (x, y), c in sorted(cm.items(), key=lambda kv: kv[1][1]):
        if _free(a, x, y): a.set(x, y, c[0])
def fire_fx(a, look, cols):
    Lf, R0 = 3.0 + 1.3 * look, 1.9 + 0.35 * look; out = {}
    for y in range(H):
        for x in range(W):
            dx, dy = x + 0.5 - HX, y + 0.5 - HY
            s_ = dx * -0.7071 + dy * 0.7071; v = dx * 0.7071 + dy * 0.7071
            v += 0.35 * s_   # 불꽃은 위로 솟는다
            if s_ < -1.8 or s_ > Lf: continue
            w = R0 * (1 - max(0.0, s_) / (Lf + 0.8)) + 0.3 * math.sin(x * 2.1 + y * 1.3)
            if s_ < 0: w *= 1 - (-s_ / 1.8) ** 2
            if w <= 0.2: continue
            k = abs(v) / w
            if k <= 1: out[(x, y)] = (cols[1] if k > 0.68 else cols[2] if k > 0.38 else cols[3], 0 if k > 0.68 else 1 if k > 0.38 else 2)
    _over(a, out)
def frost_fx(a, look, cols):
    out = {}; n = 2 + look // 2 + (look == 3)
    for ang in (0, 90, 150, -60):
        t = math.radians(ang)
        for r in range(2, 2 + n):
            x, y = int(HX + 0.5 + math.cos(t) * r), int(HY - math.sin(t) * r)
            out[(x, y)] = (cols[3] if r < 1 + n else cols[2], 1)
            if r == 2 + n - 1 and look >= 2: out[(x + 1, y)] = (cols[1], 0)
    for (x, y) in [(8, 3), (15, 8), (10, 0)][:look]: out[(x, y)] = (cols[4], 2)
    _over(a, out)
def spark_fx(a, look, cols):
    paths = [[(14, 2), (15, 0)], [(15, 5), (15, 7), (14, 8)], [(11, 3), (10, 1), (9, 2), (8, 0)], [(12, 6), (11, 8), (12, 9)]][:1 + look]
    out = {}
    for pts in paths:
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = max(abs(x1 - x0), abs(y1 - y0), 1)
            for i in range(n + 1): out[(round(x0 + (x1 - x0) * i / n), round(y0 + (y1 - y0) * i / n))] = (cols[2], 1)
        out[pts[-1]] = (cols[4], 2)
    _over(a, out)
def elem_arrow(a, el, look, style='A'):
    E = EL[el]; sh = SHAFT[look]; band = (sh[0], sh[1], sh[2] or E['c'])
    _arrow(a, E['head'], E['fl'], band, glow_c=E['glow'] if style == 'B' else None)
    if style == 'A': (fire_fx if el == 'fire' else frost_fx if el == 'ice' else spark_fx)(a, look, E['fx'])
    else:
        pts = {'fire': [(10, 1), (15, 7), (8, 4)], 'ice': [(10, 2), (15, 7), (12, 0)], 'thunder': [(15, 0), (10, 6), (9, 1)]}[el]
        for (x, y) in pts[:look]:
            if _free(a, x, y): a.set(x, y, E['fx'][-1])
def sheet(out):
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 17, index=2)
    Z = 6; CW, RH, LW = W * Z + 66, H * Z + 30, 170
    rows = [('arrows', '보통 화살 (지금)', None)] + [(el, EL[el]['name'], st) for st in ('A', 'B') for el in EL]
    sh = Image.new('RGB', (LW + CW * 4 + 10, RH * len(rows) + 90), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 10), '속성 화살 시안 · 왼쪽 → 오른쪽 단계 (견습·숲지기 / 강철·폭풍 / 서리·사막왕 / 그 위) · 작은 그림 = 목록 크기', font=fb, fill=(242, 190, 60))
    d.text((10, 36), 'A안: 촉 둘레에 불꽃·서리·전기 (단계가 오를수록 커진다)    B안: 화살 둘레에 속성 빛 테두리', font=f, fill=(200, 200, 200))
    for c, t in enumerate(O.TIER_RANGE): d.text((LW + c * CW + 20, 62), t, font=f, fill=(200, 200, 200))
    for r, (el, name, st) in enumerate(rows):
        y = 86 + r * RH
        d.text((10, y + 40), name, font=fb, fill=(240, 240, 240)); d.text((10, y + 64), '' if st is None else f'{st}안', font=f, fill=(170, 170, 170))
        for c in range(4):
            fn = (lambda a, c=c: [O.arrows_1, O.arrows_2, O.arrows_3, O.arrows_4][c](a)) if st is None else (lambda a, el=el, c=c, st=st: elem_arrow(a, el, c, st))
            x = LW + c * CW
            d.rectangle((x, y, x + W * Z + 8, y + H * Z + 8), fill=(40, 34, 30), outline=(90, 74, 50))
            big = O.render(fn, Z); sh.paste(big, (x + 4, y + 4), big)
            sm = O.render(fn, 2); d.rectangle((x + W * Z + 14, y + 4, x + W * Z + 14 + 36, y + 4 + 44), fill=(40, 34, 30)); sh.paste(sm, (x + W * Z + 16, y + 6), sm)
    sh.save(out)
if __name__ == '__main__':
    sheet(pathlib.Path(__file__).parent / 'elemarrows_sheet.png'); print('ok')
