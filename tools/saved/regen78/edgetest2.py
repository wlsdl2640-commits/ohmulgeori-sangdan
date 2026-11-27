# 앞 밀 윗선 시험: 곧은 선 대신 이삭 모양 — 여러 식을 같은 장면에 놓고 비교
import math, numpy as np
from PIL import Image
q = 2; LD = 31; W = 300 * q; H = 200 * q
back, mid, gr = [Image.open(f'plains_{k}.png').convert('RGBA') for k in ('back', 'mid', 'gr')]
def row(im, y): c = Image.new('RGBA', (W, H)); c.alpha_composite(im.crop((0, 0, min(W, im.width), im.height)), (0, round(y * q))); return c
def edge_sin(x): return 74 - int(round(4 + 3 * math.sin(x * 0.31) + 2 * math.sin(x * 0.83 + 1.3) + 1.5 * math.sin(x * 1.9 + 0.4)))
def edge_tex(x, m=np.asarray(mid)):   # 중경 밀 무늬를 따라: 74줄에서 위로, 밝은 이삭 칸이 이어지는 만큼 (최대 10줄)
    y = 74
    while y > 64 and m[y - 1, x, 0] > 170 and m[y - 1, x, 1] > 120: y -= 1
    return y + (x % 3 == 0)
def scene(art, ef):
    S = Image.new('RGBA', (W, H), (120, 170, 220, 255)); S.alpha_composite(row(back, 46 + LD)); my = 69.6 + LD; oy = round(my * q); S.alpha_composite(row(mid, my))
    p = Image.open(f'pick_{art}.png').convert('RGBA'); p = p.crop(p.getbbox()); X = 160 - p.width // 2; Y = oy + 90 - p.height; S.alpha_composite(p, (X, Y))
    for x in range(max(0, X - 4), X + p.width + 4):
        y0 = ef(x); S.alpha_composite(mid.crop((x, y0, x + 1, mid.height)), (x, oy + y0))
    S.alpha_composite(row(gr, 111 + LD)); return S.crop((40, 130, 300, 290))
def e_soft(x): return 74 - int(round(3 + 2.5 * math.sin(x * 0.21) + 1.5 * math.sin(x * 0.53 + 1.0)))
def e_tuft(x):   # 완만한 물결 + 5~7칸마다 이삭 하나(가운데 1 ~ 2줄 더 높게)
    b = 3 + 2 * math.sin(x * 0.19) + math.sin(x * 0.47 + 2.0); k = x % 6; tip = 2 if k == 3 else (1 if k in (2, 4) else 0)
    return 74 - int(round(b + tip))
outs = [scene('barn', f) for f in (e_soft, e_tuft)] + [scene('hay', f) for f in (e_soft, e_tuft)]
O = Image.new('RGBA', (2 * 260 * 4 + 10, 2 * 160 * 4 + 10), (30, 30, 36, 255))
for i, o in enumerate(outs): O.alpha_composite(o.resize((1040, 640), Image.NEAREST), ((i % 2) * 1050, (i // 2) * 650))
O.save('edgetest2.png')
