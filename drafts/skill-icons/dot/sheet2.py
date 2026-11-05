"""시안 시트 (여러 줄): python3 sheet2.py 출력.png "제목" 모듈:키,키 ... — 한 줄에 5개"""
import sys, pathlib, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell
out, title = sys.argv[1], sys.argv[2]
items = []
for spec in sys.argv[3:]:
    m, _, ks = spec.partition(':'); mod = importlib.import_module(m)
    for k in (ks.split(',') if ks else list(mod.ICONS)): items.append(mod.ICONS[k])
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 18, index=2)
fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
CW, RH, PER = 236, 214, 5
nrow = (len(items) + PER - 1) // PER
sh = Image.new('RGB', (PER * CW + 20, 50 + nrow * RH), (21, 23, 28)); dr = ImageDraw.Draw(sh)
dr.text((12, 10), title, font=f, fill=(242, 190, 60))
for i, (name, kind, fn) in enumerate(items):
    art, _ = fn(); im = art.img(kind)
    x0 = 14 + (i % PER) * CW; y0 = 50 + (i // PER) * RH
    z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y0), z3); sh.paste(im, (x0 + 160, y0 + 48), im)
    dr.text((x0 + 4, y0 + 152), name, font=f, fill=(235, 235, 235))
    if i == 0: dr.text((x0 + 156, y0 + 100), '실제 크기', font=fs, fill=(140, 140, 150))
sh.save(D / out); print(sh.size)
