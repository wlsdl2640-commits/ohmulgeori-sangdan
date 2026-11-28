"""부품 판(partsA/B/C.png, 341칸 · 512 격자 좌표로 그림)을 부품 PNG로 오린다 → kitA/… — python cut.py"""
import os, json
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
P = {'frame': (8, 8, 300, 300), 'title': (326, 8, 178, 52), 'btn1': (326, 76, 178, 46), 'btn2': (326, 136, 178, 46), 'btn3': (326, 196, 178, 46),
     'tab1': (326, 258, 84, 40), 'tab2': (420, 258, 84, 40), 'slot1': (8, 326, 84, 84), 'slot2': (104, 326, 84, 84), 'round': (206, 328, 80, 80),
     'row': (300, 326, 204, 60), 'popup': (8, 424, 496, 80)}
k = 341 / 512; meta = {}
for K in 'ABCDE':
    im = Image.open(f'parts{K}.png').convert('RGBA'); os.makedirs(f'kit{K}', exist_ok=True); meta[K] = {}
    for n, (x, y, w, h) in P.items():
        box = (max(0, int(x * k) - 4), max(0, int(y * k) - 4), min(im.width, int((x + w) * k) + 5), min(im.height, int((y + h) * k) + 5))
        c = im.crop(box); b = c.getbbox(); c = c.crop(b); c.save(f'kit{K}/{n}.png'); meta[K][n] = c.size
json.dump(meta, open('kit_sizes.json', 'w'), indent=1); print(json.dumps(meta))
