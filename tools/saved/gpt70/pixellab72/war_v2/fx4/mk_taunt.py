# 도발 v4: 효과 도구로 만든 붉은 몸 감싸기(taunt_v4.png 시트) 위에 폰트 키트 B2 큰 진홍 「!」(excl_b2big_crimson.png)를 머리 위에 띄운다.
#   python mk_taunt.py → taunt_v4x.gif · taunt_v4x.png(가로 띠) · taunt_v4x_frames/NN.png
import json, os
from PIL import Image
J = json.load(open('taunt_v4.json', encoding='utf-8')); sh = Image.open('taunt_v4.png').convert('RGBA')
F = [sh.crop((f['frame']['x'], f['frame']['y'], f['frame']['x'] + f['frame']['w'], f['frame']['y'] + f['frame']['h'])) for f in J['frames']]
EX = Image.open('excl_b2big_crimson.png').convert('RGBA')
# 머리 위 자리: 원래 동작 띠(taunt 21장 + 서 있기)에서 장마다 머리 꼭대기를 재어 캔버스 자리로(발 70,148 · 보이는 부분 x 26..135, y ..123)
G = Image.open('taunt32_g5.png').convert('RGBA'); DX, DY = 70 - 81, 148 - 124
def head(i):
    c = G.crop(((i % 5) * 192, (i // 5) * 132, (i % 5) * 192 + 192, (i // 5) * 132 + 132)); a = c.getchannel('A').point(lambda v: 255 if v else 0)
    b = a.getbbox(); top = b[1]; row = [x for x in range(192) if a.getpixel((x, top + 3))]
    return (sum(row) // len(row) + DX, top + DY)
T0 = 5                                   # 외치기 시작(6번째 장)
RISE = [(10, 0.35), (5, 0.7), (-2, 1.0), (1, 1.0), (0, 1.0)]   # 아래에서 솟아 조금 넘쳤다 자리 잡기 (y 밀기, 진하기)
FADE0, FADE1 = 23, 30                    # 천천히 옅어짐
hx, hy = head(T0 + 4)                    # 외치는 자세 머리 위 한 자리에 고정
out = []
for i, f in enumerate(F):
    c = f.copy(); k = i - T0
    if 0 <= k < FADE1 - T0:
        dy, al = RISE[k] if k < len(RISE) else ((-1 if (k // 4) % 2 else 0), 1.0)
        if i >= FADE0: al *= max(0.0, 1 - (i - FADE0 + 1) / (FADE1 - FADE0 + 1))
        e = EX.copy(); e.putalpha(e.getchannel('A').point(lambda v: int(v * al)))
        c.alpha_composite(e, (hx - EX.width // 2 + 3, hy - EX.height - 4 + dy))
    out.append(c)
os.makedirs('taunt_v4x_frames', exist_ok=True)
for i, c in enumerate(out): c.save(f'taunt_v4x_frames/{i:02d}.png')
strip = Image.new('RGBA', (out[0].width * len(out), out[0].height))
for i, c in enumerate(out): strip.alpha_composite(c, (i * c.width, 0))
strip.save('taunt_v4x.png')
bg = [Image.alpha_composite(Image.new('RGBA', c.size, (40, 46, 40, 255)), c).convert('RGB').quantize(64, dither=Image.NONE) for c in out]
bg[0].save('taunt_v4x.gif', save_all=True, append_images=bg[1:], duration=71, loop=0)
print(len(out), (hx, hy), EX.size)
