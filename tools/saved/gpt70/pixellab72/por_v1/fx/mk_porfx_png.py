# 짐꾼 공격 효과 시안 ①~④를 한 장 PNG로(html이 안 보일 때) — python mk_porfx_png.py <출력.png>
import os, sys
from PIL import Image, ImageDraw, ImageFont
import mk_porfx as P
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 18)
rows = []
for k, v in P.S.items():
    ims = [P.scene(k, Image.open(os.path.join(P.H, f'{k}_{i + 1}', '00.png')).convert('RGBA')) for i in range(4)]
    rows.append((v[0], ims))
w, h = rows[0][1][0].size; sc = 2 if w < 300 else 1
W = 20 + 4 * (w * sc + 10); H = sum(36 + h * sc + 10 for _ in rows) + 10
out = Image.new('RGB', (W, H), (28, 31, 38)); d = ImageDraw.Draw(out); y = 8
for name, ims in rows:
    d.text((12, y), name, font=F, fill=(240, 200, 120)); y += 30
    for i, im in enumerate(ims):
        x = 12 + i * (w * sc + 10); out.paste(im.resize((w * sc, h * sc), Image.NEAREST), (x, y)); d.text((x + 6, y + 4), P.L[i], font=F, fill=(255, 255, 255))
    y += h * sc + 16
out.save(sys.argv[1]); print(out.size)
