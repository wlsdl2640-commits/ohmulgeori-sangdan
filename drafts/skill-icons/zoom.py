"""물건 몇 개를 크게: python3 zoom.py art3 warhorse impact ..."""
import pathlib, sys, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
from art import FIX, PAL, OBJ, ACC
from spec import SPEC
from draft import hexbase, put, grid
import art2
allobj = dict(OBJ); allobj.update(art2.OBJ2)
for m in ['art3', 'art4', 'art5', 'art6', 'art7', 'art8', 'art9']:
    try: allobj.update(getattr(importlib.import_module(m), 'OBJ' + m[3:]))
    except ModuleNotFoundError: pass
keys = sys.argv[1:]
use = {v[0]: (k, v) for k, v in SPEC.items()}
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
S = 4; CW = 48 * S + 10
sheet = Image.new('RGB', (len(keys) * CW + 10, 48 * S + 40), (21, 23, 28)); dr = ImageDraw.Draw(sheet)
for i, k in enumerate(keys):
    sid, spec = use.get(k, ('?', (k, None, 'none')))
    cols = dict(FIX); pal = PAL[spec[2]]; cols.update({'1': pal[0], '2': pal[1], '3': pal[2]})
    im = hexbase('none'); put(im, grid(allobj[k]), 11, 12, cols, 2)
    if spec[1]: put(im, grid(ACC[spec[1]]), 29, 7, cols, 2)
    im = im.resize((48 * S, 48 * S), Image.NEAREST); sheet.paste(im, (5 + i * CW, 5), im); dr.text((8 + i * CW, 48 * S + 12), k, font=f, fill=(220, 220, 220))
sheet.save(D / 'zoom.png'); print(sheet.size)
