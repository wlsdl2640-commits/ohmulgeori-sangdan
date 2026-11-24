# 픽셀랩 후보 판: 폴더의 00.png ~ NN.png를 번호 붙여 한 장에(3배, 체크무늬 바탕)
# python sheet.py <폴더> <출력.png> [배율]
import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
z = int(sys.argv[3]) if len(sys.argv) > 3 else 3
fs = sorted(f for f in os.listdir(d) if f[:2].isdigit() and f.endswith('.png'))
ims = [Image.open(os.path.join(d, f)).convert('RGBA') for f in fs]
w = max(i.width for i in ims) * z; h = max(i.height for i in ims) * z
cols = 5; rows = (len(ims) + cols - 1) // cols; pad = 18
sheet = Image.new('RGBA', (cols * (w + 8) + 8, rows * (h + pad + 8) + 8), (40, 44, 52, 255))
dr = ImageDraw.Draw(sheet)
for n, (f, im) in enumerate(zip(fs, ims)):
    x = 8 + (n % cols) * (w + 8); y = 8 + (n // cols) * (h + pad + 8)
    bg = Image.new('RGBA', (w, h))
    bd = ImageDraw.Draw(bg)
    for yy in range(0, h, 12):
        for xx in range(0, w, 12):
            bd.rectangle([xx, yy, xx + 11, yy + 11], fill=(120, 150, 110) if (xx // 12 + yy // 12) % 2 else (106, 135, 95))
    bg.alpha_composite(im.resize((im.width * z, im.height * z), Image.NEAREST))
    sheet.paste(bg, (x, y + pad))
    dr.text((x + 2, y + 3), f[:2], fill=(255, 255, 255))
sheet.save(out)
print(out, len(ims))
