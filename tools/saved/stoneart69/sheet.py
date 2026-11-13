"""시안판: python3 sheet.py maseok|jeongsu|origin <출력.png>"""
import importlib
import os
import sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
FT = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 17, index=2)
BG = (21, 23, 28); CARD = (34, 31, 40); LINE = (52, 50, 60)


def tile(px, z, bg=CARD):
    im = Image.new('RGB', (20, 20), bg); p = im.load()
    for (x, y), c in px.items():
        if 0 <= x < 20 and 0 <= y < 20: p[x, y] = tuple(c)
    return im.resize((20 * z, 20 * z), Image.NEAREST)


def wrap(d, text, font, width):
    out, cur = [], ''
    for word in text.split(' '):
        t = (cur + ' ' + word).strip()
        if d.textlength(t, font=font) > width and cur: out.append(cur); cur = word
        else: cur = t
    if cur: out.append(cur)
    return out


def sheet_rows(title, sub, rows, out, grades=('하급', '중급', '상급', '최상급'), z=4):
    """rows: [(그림 함수 lv → px, 이름, 갈래, 효과 글, 덧말)]"""
    LW = 250; GW = 20 * z + 14; TW = 520
    RH = 20 * z + 34
    Wd = 20 + LW + len(grades) * GW + 20 + TW + 20
    tmp = ImageDraw.Draw(Image.new('RGB', (10, 10))); subl = wrap(tmp, sub, F, Wd - 40); top0 = 74 + 19 * len(subl)
    Hd = top0 + 24 + len(rows) * RH + 20
    sh = Image.new('RGB', (Wd, Hd), BG); d = ImageDraw.Draw(sh)
    d.text((20, 14), title, font=FT, fill=(240, 196, 90))
    for j, ln in enumerate(subl): d.text((20, 42 + 19 * j), ln, font=F, fill=(160, 155, 145))
    for i, g in enumerate(grades): d.text((20 + LW + i * GW + 24, top0), g, font=F, fill=(170, 165, 155))
    d.text((20 + LW + len(grades) * GW + 20, top0), '효과 (하급 · 중급 · 상급 · 최상급)', font=F, fill=(170, 165, 155))
    for r, (fn, name, kind, eff, note) in enumerate(rows):
        y0 = top0 + 24 + r * RH
        if r: d.line([(20, y0 - 8), (Wd - 20, y0 - 8)], fill=LINE)
        d.text((20, y0 + 18), name, font=FB, fill=(236, 230, 220))
        d.text((20, y0 + 42), kind, font=F, fill=(200, 176, 120))
        for i in range(len(grades)):
            sh.paste(tile(fn(i), z), (20 + LW + i * GW, y0))
        tx = 20 + LW + len(grades) * GW + 20; ty = y0 + 6
        for ln in wrap(d, eff, FB, TW):
            d.text((tx, ty), ln, font=FB, fill=(232, 228, 220)); ty += 22
        for ln in wrap(d, note, F, TW):
            d.text((tx, ty), ln, font=F, fill=(150, 146, 138)); ty += 19
    sh.save(out); print(out, sh.size)


if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    if which == 'maseok':
        M = importlib.import_module('maseok')
        rows = [((lambda i: (lambda lv: M.icon(i, lv)))(i), st[2], f'마석 · {st[3]}', st[4], f'여러 장비에 박으면 더해지되 합쳐서 {st[5]}까지') for i, st in enumerate(M.STONES)]
        sheet_rows('마석 시안 — 모든 장비에 한 칸 (일반 레어도부터)', '보석 모양 · 마법 이름 · 회피 · 방어 · 반격 같은 지키는 효과. 몬스터가 떨어뜨리고(우두머리 · 던전 주인 · 레이드일수록 높은 등급), 마탑에서 박고 9개로 합성한다 (제안).', rows, out)
    if which == 'jeongsu':
        J = importlib.import_module('jeongsu')
        rows = [((lambda i: (lambda lv: J.icon(i, lv)))(i), e[1], f'정수 · {J.KIND[e[0]]}', e[4], e[5] or '같은 정수는 여러 장비에 박아도 가장 높은 것 하나만') for i, e in enumerate(J.ESS)]
        sheet_rows('정수 시안 — 특화 (정수 하나 = 효과 하나)', '받침이 갈래: 칼날 판 = 무기용(무기 · 부장비) · 방패 판 = 방어구용(갑옷 · 하의 · 장갑 · 신발 · 벨트 · 가방) · 금 고리 = 장식용(반지 · 귀걸이). 제 갈래에만 박히고, 같은 정수는 가장 높은 것 하나만 친다 (제안).', rows, out)
