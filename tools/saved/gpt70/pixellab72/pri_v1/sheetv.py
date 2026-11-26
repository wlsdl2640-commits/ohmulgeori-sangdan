import os, sys
from PIL import Image
out = sys.argv[1]; rows = sys.argv[2:]
S = Image.new('RGBA', (21 * 100, len(rows) * 88), (60, 64, 72, 255))
for r, d in enumerate(rows):
    for k, f in enumerate(sorted(os.listdir(d))[:21]):
        im = Image.open(d + '/' + f).convert('RGBA')
        if im.width == 132: im = im.crop((6, 6, 126, 126))
        S.alpha_composite(im.crop((14, 16, 114, 104)), (k * 100, r * 88))
S.resize((int(S.width * 1.25), int(S.height * 1.25)), Image.NEAREST).save(out)
