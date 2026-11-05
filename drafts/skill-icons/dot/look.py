"""살펴보기: 아이콘들을 8배(칸 눈금) · 3배(폰) · 1배(실제)로 한 장에. python3 look.py 모듈 [키...] 출력.png"""
import sys, pathlib, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell
mod = importlib.import_module(sys.argv[1]); out = sys.argv[-1]; keys = sys.argv[2:-1] or list(mod.ICONS)
fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
tiles = []
for k in keys:
    name, kind, fn = mod.ICONS[k]; art, pips = fn()
    im = art.img(kind)

    z8 = cell.zoom(im, 8); d = ImageDraw.Draw(z8)
    for i in range(0, 48, 2):
        d.line([(i * 8, 0), (i * 8, 383)], fill=(0, 0, 0, 60)); d.line([(0, i * 8), (383, i * 8)], fill=(0, 0, 0, 60))
    for i in range(OXs := 4, 21, 4):
        pass
    t = Image.new('RGB', (384 + 170, 400), (21, 23, 28)); t.paste(z8, (0, 0), z8)
    z3 = cell.zoom(im, 3); t.paste(z3, (392, 10), z3); t.paste(im, (440, 170), im)
    ImageDraw.Draw(t).text((392, 230), name, font=fs, fill=(230, 230, 230))
    tiles.append(t)
sh = Image.new('RGB', (sum(t.width for t in tiles), 400)); x = 0
for t in tiles: sh.paste(t, (x, 0)); x += t.width
sh.save(D / out); print(sh.size)
