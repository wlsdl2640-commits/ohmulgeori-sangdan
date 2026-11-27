# 빛 구슬 ② 하얗게 · 작게.  python mk_holyw.py
from PIL import Image
import numpy as np
im = Image.open('holy/00.png').convert('RGBA'); a = np.array(im).astype(float)
L = (a[..., 0] * .3 + a[..., 1] * .59 + a[..., 2] * .11) / 255
# 밝기 → 흰 단계(어두운 테는 은회색, 가운데는 흰색)
ramp = np.array([[118, 128, 148], [176, 184, 198], [222, 226, 234], [246, 247, 250], [255, 255, 255]], float)
x = np.clip(L * 1.35, 0, 1) * (len(ramp) - 1); i = np.floor(x).astype(int).clip(0, len(ramp) - 2); f = (x - i)[..., None]
rgb = ramp[i] * (1 - f) + ramp[i + 1] * f
out = np.dstack([rgb, a[..., 3]]).round().clip(0, 255).astype('uint8')
w = Image.fromarray(out, 'RGBA'); w.save('holy_w/full.png')
bb = w.getbbox(); c = w.crop(bb)
for s in (0.6, 0.45):
    r = c.resize((max(1, round(c.width * s)), max(1, round(c.height * s))), Image.NEAREST)
    r.save(f'holy_w/s{int(s * 100)}.png'); print(s, r.size)
