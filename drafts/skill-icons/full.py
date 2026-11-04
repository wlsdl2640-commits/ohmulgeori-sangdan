"""스킬 307개 전체 시안 시트 (지금 → 새 그림), 직업별로. 겹침 검사도."""
import json, pathlib, sys, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
from art import FIX, PAL, OBJ, ACC
from spec import SPEC
from draft import hexbase, put, grid, old_icon, old_glyph, kind_of
ALL = dict(OBJ)
for m in ['art2', 'art3', 'art4', 'art5', 'art6', 'art7', 'art8']:
    ALL.update(getattr(importlib.import_module(m), 'OBJ' + m[3:]))
SK = json.load(open(D.parent / 'skills_dump.json'))
def icon(spec, kind):
    obj, acc, pal = spec[0], spec[1], spec[2]; pips = spec[3] if len(spec) > 3 else 0
    im = hexbase(kind); cols = dict(FIX); p = PAL[pal]; cols.update({'1': p[0], '2': p[1], '3': p[2]})
    put(im, grid(ALL[obj]), 11, 12, cols, 2)
    if acc: put(im, grid(ACC[acc]), 29, 7, cols, 2)
    x0 = 24 - (pips * 5 + (pips - 1)) // 2
    for i in range(pips): put(im, ['kkkkk', 'kwwwk', 'kwwwk', 'kwwwk', 'kkkkk'], x0 + i * 6, 6, cols, 1)
    return im
if __name__ == '__main__':
    from collections import Counter
    c = Counter(v[0] for v in SPEC.values()); print('obj reuse', [(k, n) for k, n in c.items() if n > 1])
    COLS, CW, CH = 6, 236, 104
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
    CLS = json.load(open(D / 'clsnames.json')); CLS['all'] = '공용'
    N = 108; pages = [SK[i:i + N] for i in range(0, len(SK), N)]
    for pi, page in enumerate(pages):
        rows = (len(page) + COLS - 1) // COLS
        sh = Image.new('RGB', (COLS * CW + 16, rows * CH + 52), (21, 23, 28)); dr = ImageDraw.Draw(sh)
        dr.text((10, 10), f'스킬 아이콘 새 시안 {pi + 1}/{len(pages)} — 작은 것: 지금 · 큰 것: 새 그림 (도발 1·2만 같은 그림에 위쪽 점 1·2개)', font=f, fill=(242, 190, 60))
        for i, s in enumerate(page):
            x0 = 8 + (i % COLS) * CW; y0 = 44 + (i // COLS) * CH; kind = kind_of(s)
            o = old_icon(old_glyph(s), kind); n = icon(SPEC[s['id']], kind).resize((96, 96), Image.NEAREST)
            sh.paste(o, (x0, y0 + 24), o); sh.paste(n, (x0 + 50, y0), n)
            dr.text((x0 + 150, y0 + 30), s['name'][:6], font=f, fill=(230, 230, 230))
            dr.text((x0 + 150, y0 + 52), '·'.join(CLS.get(c, c) for c in s['cls'].split('/'))[:12], font=fs, fill=(140, 140, 150))
        sh.save(D / f'full{pi + 1}.png'); print(sh.size)
