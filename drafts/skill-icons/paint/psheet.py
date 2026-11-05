"""그린 시안 시트: 크게(폰에서 보이는 크기 144px) · 실제 CSS 크기(48px)."""
import sys, pathlib, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import prender
mod = importlib.import_module(sys.argv[1]); out = sys.argv[2]; title = sys.argv[3] if len(sys.argv) > 3 else ''
ICONS = mod.ICONS
big = prender.bake_svgs({k: v[2] for k, v in ICONS.items()}, 288)
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 18, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
keys = list(ICONS); CW, CH = 250, 230
sh = Image.new('RGB', (len(keys) * CW + 20, CH + 60), (21, 23, 28)); dr = ImageDraw.Draw(sh)
dr.text((10, 10), title, font=f, fill=(242, 190, 60))
for i, k in enumerate(keys):
    name, kind, svg = ICONS[k]; x0 = 10 + i * CW; y0 = 48
    pips = getattr(mod, 'PIPS', {}).get(k, 0)
    a144 = prender.compose(big[k], kind, 3, pips); a48 = prender.compose(big[k].resize((48, 48), Image.LANCZOS), kind, 1, pips)
    sh.paste(a144, (x0, y0), a144); sh.paste(a48, (x0 + 160, y0 + 48), a48)
    dr.text((x0 + 4, y0 + 152), name, font=f, fill=(235, 235, 235)); dr.text((x0 + 160, y0 + 100), '실제 크기', font=fs, fill=(140, 140, 150))
sh.save(D / out); print(sh.size)
