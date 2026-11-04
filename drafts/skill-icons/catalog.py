"""물건·덧그림 목록 시트 (그리면서 확인용)."""
import pathlib, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import importlib
from art import FIX, PAL, OBJ, ACC
mods = [m for m in sys.argv[1:]] or ['art2']
for m in mods:
    OBJ.update(getattr(importlib.import_module(m), 'OBJ' + m[-1]))
from draft import hexbase, put, grid
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
keys = list(OBJ); COLS = 10; S = 2; CW = 100; CH = 118
sheet = Image.new('RGB', (COLS * CW + 10, ((len(keys) + len(ACC)) // COLS + 2) * CH + 10), (21, 23, 28)); dr = ImageDraw.Draw(sheet)
cols = dict(FIX); cols.update({'1': PAL['none'][0], '2': PAL['none'][1], '3': PAL['none'][2]})
for i, k in enumerate(keys):
    im = hexbase('none'); put(im, grid(OBJ[k]), 11, 12, cols, 2); im = im.resize((48 * S, 48 * S), Image.NEAREST)
    x, y = 5 + (i % COLS) * CW, 5 + (i // COLS) * CH; sheet.paste(im, (x, y), im); dr.text((x + 2, y + 98), k, font=f, fill=(220, 220, 220))
off = (len(keys) // COLS + 1) * COLS
for j, k in enumerate(ACC):
    i = off + j; im = Image.new('RGBA', (16, 16), (60, 50, 44, 255)); put(im, grid(ACC[k]), 2, 2, cols, 2); im = im.resize((64, 64), Image.NEAREST)
    x, y = 5 + (i % COLS) * CW, 5 + (i // COLS) * CH; sheet.paste(im, (x + 16, y + 16)); dr.text((x + 2, y + 98), k, font=f, fill=(220, 220, 220))
sheet.save(pathlib.Path(__file__).parent / 'catalog.png'); print(sheet.size, len(keys))
