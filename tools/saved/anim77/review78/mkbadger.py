# 둑굴 오소리(7번) 동작 판 — 가만히 · 걷기 · 발톱 할퀴기 s11/s12 · 땅 파고 덮치기 s11/s12 (게임 크기 ×2)
import os
from PIL import Image, ImageDraw, ImageFont
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
F = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 14)
R = [('가만히', 'idle_s11'), ('걷기', 'walk_s11'), ('할퀴기 1', 'claw_s11'), ('할퀴기 2', 'claw_s12'), ('덮치기 1', 'dig_s11'), ('덮치기 2', 'dig_s12')]
S = []
for lab, d in R:
    fs = sorted(f for f in os.listdir(f'clean/badger/{d}') if f.endswith('.png'))
    S.append((lab, [Image.open(f'clean/badger/{d}/{f}').convert('RGBA') for f in fs]))
w = S[0][1][0].width; C = w + 8; W = len(R) * C; H = w + 30; out = []
for t in range(48):
    im = Image.new('RGB', (W, H), (44, 48, 60)); d = ImageDraw.Draw(im)
    for i, (lab, fr) in enumerate(S):
        f = fr[t % len(fr)]; im.paste(f, (i * C + 4, 26), f); d.text((i * C + 8, 4), lab, font=F, fill=(240, 200, 120))
    out.append(im)
out[0].save('review78/badger_anim.gif', save_all=True, append_images=out[1:], duration=90, loop=0, optimize=True); print(W, H)
