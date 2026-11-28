import json, os
from PIL import Image, ImageDraw, ImageFont
L = json.load(open('shots/list.json', encoding='utf-8')); F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 22)
os.makedirs('sheets', exist_ok=True); per, cols, sc = 10, 5, 0.5
for si in range(0, len(L), per):
    part = L[si:si + per]; ims = [Image.open(f).convert('RGB') for f, _ in part]
    w, h = int(ims[0].width * sc), int(ims[0].height * sc); rows = (len(part) + cols - 1) // cols
    S = Image.new('RGB', (cols * (w + 12) + 12, rows * (h + 46) + 12), (30, 32, 40)); d = ImageDraw.Draw(S)
    for i, (im, (f, lb)) in enumerate(zip(ims, part)):
        x = 12 + (i % cols) * (w + 12); y = 12 + (i // cols) * (h + 46)
        d.text((x, y), f'{si + i + 1}. {lb}', font=F, fill=(240, 200, 120)); S.paste(im.resize((w, h), Image.LANCZOS), (x, y + 34))
    S.save(f'sheets/sheet_{si // per + 1:02d}.png'); print(f'sheets/sheet_{si // per + 1:02d}.png', S.size)
