"""새 물건만 실제 팔레트·덧그림으로 그려 보기: python3 cat.py art3 [art4 ...]"""
import pathlib, sys, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
from art import FIX, PAL, OBJ, ACC
from spec import SPEC
from draft import hexbase, put, grid
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
objs = {}
for m in sys.argv[1:]:
    objs.update(getattr(importlib.import_module(m), 'OBJ' + m[3:]))
use = {v[0]: (k, v) for k, v in SPEC.items()}
bad = []
for k, v in objs.items():
    r = v.strip('\n').split('\n')
    if len(r) != 12 or any(len(x) != 12 for x in r): bad.append((k, len(r), [len(x) for x in r]))
    u = set(''.join(r)) - set('.') - set(FIX) - set('123')
    if u: bad.append((k, 'chars', u))
if bad:
    for b in bad: print('BAD', b)
    raise SystemExit
keys = list(objs); COLS = 8; S = 2; CW = 108; CH = 124
sheet = Image.new('RGB', (COLS * CW + 10, ((len(keys) - 1) // COLS + 1) * CH + 10), (21, 23, 28)); dr = ImageDraw.Draw(sheet)
for i, k in enumerate(keys):
    sid, spec = use.get(k, ('?', (k, None, 'none')))
    cols = dict(FIX); pal = PAL[spec[2]]; cols.update({'1': pal[0], '2': pal[1], '3': pal[2]})
    im = hexbase('none'); put(im, grid(objs[k]), 11, 12, cols, 2)
    if spec[1]: put(im, grid(ACC[spec[1]]), 29, 7, cols, 2)
    im = im.resize((48 * S, 48 * S), Image.NEAREST)
    x, y = 5 + (i % COLS) * CW, 5 + (i // COLS) * CH; sheet.paste(im, (x, y), im); dr.text((x + 2, y + 98), f'{k} {sid}', font=f, fill=(220, 220, 220))
out = D / ('cat_' + '_'.join(sys.argv[1:]) + '.png'); sheet.save(out); print(out, sheet.size, len(keys))
