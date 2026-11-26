# 받은 후보를 한 장에 모아 보기(검사용): python sheet.py → _sheet.png (몬스터마다 한 줄, 체크 무늬 위 2배)
import os, json
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__))
rows = []
for d in sorted(os.listdir(H)):
    p = os.path.join(H, d)
    if not os.path.isdir(p) or d.startswith('bg_'): continue
    fs = []
    for root, _, files in os.walk(p):
        fs += [os.path.join(root, f) for f in sorted(files) if f.endswith('.png')]
    if fs: rows.append((d, sorted(fs)))
S = 2; cell = 260
W = cell * max(len(f) for _, f in rows); out = Image.new('RGBA', (W, cell * len(rows)), (40, 44, 52, 255))
for y, (d, fs) in enumerate(rows):
    for x, f in enumerate(fs):
        im = Image.open(f).convert('RGBA'); k = min(S, (cell - 4) / max(im.size)); im = im.resize((int(im.width * k), int(im.height * k)), Image.NEAREST)
        bg = Image.new('RGBA', (cell - 4, cell - 4), (110, 138, 100, 255)); bg.alpha_composite(im, ((cell - 4 - im.width) // 2, (cell - 4 - im.height) // 2))
        out.alpha_composite(bg, (x * cell + 2, y * cell + 2))
out.save(os.path.join(H, '_sheet.png')); print([d for d, _ in rows])
