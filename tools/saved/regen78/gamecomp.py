"""게임과 같은 계산으로 평원 겹을 쌓아 리젠 자리를 확인 (빌드 없이) — python gamecomp.py
   hd70.js buildWideHD: LD = 55 − HD_LD_UP(24) = 31 · back y = 46 + LD · mid y = 69.6 + LD · 땅 gy = 111 + LD · hs 2 (그림 1픽셀 = 논리 0.5칸)
   scene.js drawLand 차례: back → mid → props(리젠 자리 + 앞줄 다시) → gr.  regen78.js와 같은 REGEN_FR 88 · REGEN_BASE 103"""
import os
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
q = 2; LD = 55 - 24; W = 480 * q; H = 200 * q
back, mid, gr = [Image.open(f'plains_{k}.png').convert('RGBA') for k in ('back', 'mid', 'gr')]
def row(im, y): c = Image.new('RGBA', (W, H)); c.alpha_composite(im.crop((0, 0, min(W, im.width), im.height)), (0, round(y * q))); return c
def scene(art, xs=80):
    S = Image.new('RGBA', (W, H), (120, 170, 220, 255))
    S.alpha_composite(row(back, 46 + LD)); my = 69.6 + LD; S.alpha_composite(row(mid, my))
    if art:
        p = Image.open(f'pick_{art}.png').convert('RGBA'); p = p.crop(p.getbbox())
        X = xs * q - p.width // 2; Y = round(my * q) + 90 - p.height; S.alpha_composite(p, (X, Y))
        clip = Image.new('RGBA', (W, H)); oy = round(my * q)
        import math
        for x in range(0, min(W, mid.width)):   # regen78.js와 같은 앞 밀 윗선(물결 + 이삭)
            k = x % 6; y0 = 74 - round(3 + 2 * math.sin(x * 0.19) + math.sin(x * 0.47 + 2) + (2 if k == 3 else 1 if k in (2, 4) else 0)); clip.alpha_composite(mid.crop((x, y0, x + 1, mid.height)), (x, oy + y0))
        box = (X - 4, Y, X + p.width + 4, H); S.alpha_composite(clip.crop(box), box[:2])
    S.alpha_composite(row(gr, 111 + LD))
    return S
out = Image.new('RGBA', (W, H * 3 + 20), (30, 32, 40, 255))
for i, a in enumerate((None, 'hay', 'barn')): out.alpha_composite(scene(a), (0, i * (H + 10)))
out.crop((0, 0, W, H * 3 + 20)).save('regen_ingame.png'); print(out.size)
