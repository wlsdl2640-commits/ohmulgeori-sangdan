"""검토 시트: python3 review.py 출력.png 모듈[:키,키] ... — 한 줄 6개, 3배 + 이름"""
import sys, pathlib, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell
out = sys.argv[1]; items = []
for spec in sys.argv[2:]:
    m, _, ks = spec.partition(':'); mod = importlib.import_module(m)
    for k in (ks.split(',') if ks else list(mod.ICONS)): items.append((k,) + tuple(mod.ICONS[k]))
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
PER, CW, RH = 6, 156, 172
nrow = (len(items) + PER - 1) // PER
sh = Image.new('RGB', (PER * CW + 8, nrow * RH + 6), (21, 23, 28)); dr = ImageDraw.Draw(sh)
for i, (k, name, kind, fn) in enumerate(items):
    art, _ = fn(); im = art.img(kind)
    x0 = 6 + (i % PER) * CW; y0 = 4 + (i // PER) * RH
    z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y0), z3)
    dr.text((x0 + 2, y0 + 146), name, font=f, fill=(225, 225, 225))
sh.save(D / out); print(sh.size, len(items))
