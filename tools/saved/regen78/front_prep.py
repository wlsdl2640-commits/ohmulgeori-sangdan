# 앞 밀 그리기 준비: 게임 계산으로 쌓은 장면(앞줄은 74줄부터 곧게)에서 소품 밑동 둘레를 잘라 inpaint 판 · 마스크를 만든다
import json, numpy as np
from PIL import Image, ImageDraw
q = 2; LD = 31; W = 480 * q; H = 200 * q
back, mid, gr = [Image.open(f'plains_{k}.png').convert('RGBA') for k in ('back', 'mid', 'gr')]
def row(im, y): c = Image.new('RGBA', (W, H)); c.alpha_composite(im.crop((0, 0, min(W, im.width), im.height)), (0, round(y * q))); return c
info = {}
for art in ('hay', 'barn'):
    S = Image.new('RGBA', (W, H), (120, 170, 220, 255)); S.alpha_composite(row(back, 46 + LD)); my = 69.6 + LD; oy = round(my * q); S.alpha_composite(row(mid, my))
    p = Image.open(f'pick_{art}.png').convert('RGBA'); p = p.crop(p.getbbox()); X = 160 - p.width // 2; Y = oy + 90 - p.height; S.alpha_composite(p, (X, Y))
    S.alpha_composite(mid.crop((0, 74, W, mid.height)), (0, oy + 74)); S.alpha_composite(row(gr, 111 + LD))
    cx0 = max(0, X - 40); cy0 = Y + p.height - 100; box = (cx0, cy0, cx0 + 200, cy0 + 132)
    src = S.crop(box).convert('RGB'); src.save(f'front_{art}_src.png')
    m = Image.new('RGB', src.size); d = ImageDraw.Draw(m); my0 = oy + 74 - cy0
    d.rectangle([X - cx0 - 6, my0 - 16, X - cx0 + p.width + 6, my0 + 1], fill=(255, 255, 255)); m.save(f'front_{art}_mask.png')
    info[art] = {'box': box, 'X': X, 'Y': Y, 'oy': oy}
json.dump(info, open('front_info.json', 'w'), indent=1); print(info)
