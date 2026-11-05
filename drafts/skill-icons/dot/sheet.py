"""시안 시트: 크게(3배 = 폰에서 보이는 크기) · 실제 CSS 크기(48px). python3 sheet.py 모듈 출력.png 제목"""
import sys, pathlib, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell
mod = importlib.import_module(sys.argv[1]); out = sys.argv[2]; title = sys.argv[3] if len(sys.argv) > 3 else ''
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 18, index=2)
fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
keys = list(mod.ICONS); CW = 236
sh = Image.new('RGB', (len(keys) * CW + 20, 290), (21, 23, 28)); dr = ImageDraw.Draw(sh)
dr.text((12, 10), title, font=f, fill=(242, 190, 60))
for i, k in enumerate(keys):
    name, kind, fn = mod.ICONS[k]; art, _ = fn(); im = art.img(kind)
    x0 = 14 + i * CW; y0 = 50
    z3 = cell.zoom(im, 3); sh.paste(z3, (x0, y0), z3); sh.paste(im, (x0 + 160, y0 + 48), im)
    dr.text((x0 + 4, y0 + 156), name, font=f, fill=(235, 235, 235)); dr.text((x0 + 156, y0 + 100), '실제 크기', font=fs, fill=(140, 140, 150))
sh.save(D / out); print(sh.size)
