"""광맥 콩벌레 동작 판: 줄마다 두 벌(s11 · s12), 장 8개씩 2배 — python anim_sheet.py"""
import os
from PIL import Image, ImageDraw, ImageFont
B = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'anim77', 'clean', 'orebug'); OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'anim_sheet.png')
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 15); rows = ['idle', 'walk', 'bite', 'curl']; NAME = {'idle': '숨쉬기', 'walk': '기어가기', 'bite': '물기', 'curl': '몸 말기'}
C = 132 * 2; im = Image.new('RGB', (110 + 8 * C, len(rows) * 2 * (C + 6) + 10), (40, 44, 56)); d = ImageDraw.Draw(im); y = 6
for r in rows:
    for s in (11, 12):
        p = f'{B}/{r}_s{s}'; fs = sorted(f for f in os.listdir(p) if f.endswith('.png')); sel = [fs[round(i * (len(fs) - 1) / 7)] for i in range(8)]
        d.text((8, y + C // 2 - 10), f'{NAME[r]}\n{"A" if s == 11 else "B"}', font=F, fill=(240, 200, 120))
        for i, f in enumerate(sel):
            a = Image.open(f'{p}/{f}').convert('RGBA').resize((C, C), Image.NEAREST); im.paste(a, (110 + i * C, y), a)
        y += C + 6
im.save(OUT); print(OUT, im.size)
