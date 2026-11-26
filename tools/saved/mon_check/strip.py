# 동작 띠: python strip.py <출력> <폴더 …>  (장을 모두 나란히, 폴더마다 한 줄)
import os, sys
from PIL import Image
rows = sys.argv[2:]
ims = [[Image.open(f'{d}/{f}').convert('RGBA') for f in sorted(os.listdir(d)) if f.endswith('.png')] for d in rows]
w = max(i[0].width for i in ims); h = max(i[0].height for i in ims); n = max(len(i) for i in ims)
S = Image.new('RGBA', (n * w, len(rows) * h), (60, 64, 72, 255))
for r, fr in enumerate(ims):
    for k, im in enumerate(fr): S.alpha_composite(im, (k * w, r * h))
sc = min(1.0, 2400 / S.width); S = S.resize((int(S.width * sc), int(S.height * sc)), Image.NEAREST) if sc < 1 else S
S.save(sys.argv[1]); print(S.size)
