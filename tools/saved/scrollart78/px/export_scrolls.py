"""강화 주문서 25장 + 망각의 주문서(빈 것 · 기억 담은 것) → src/data-scrollart78.js (ITEM_HD) — 손으로 고치지 말 것
   python export_scrolls.py <src/data-scrollart78.js>
   · scrart_<갈래>_<확률> = cat/<갈래>_<확률>.png (11-27 대표님 확정)
   · lethe0 = 80% 바탕(e_80_0)을 은청색으로 — 마른 양피지 · lethe1 = 같은 것에 푸른 물빛을 더 짙게 (레테의 강물, 기억을 담은 것)"""
import sys, io, base64, colorsys
import numpy as np
from PIL import Image
SZ = 96


def square(im):
    bb = im.getbbox(); c = im.crop(bb); s = max(c.size) + 4
    out = Image.new('RGBA', (s, s), (0, 0, 0, 0)); out.paste(c, ((s - c.width) // 2, (s - c.height) // 2)); return out.resize((SZ, SZ), Image.LANCZOS)


def tint(im, hue, sat, val):
    a = np.array(im).astype(float); out = a.copy()
    for y, x in zip(*np.where(a[..., 3] > 0)):
        h, s, v = colorsys.rgb_to_hsv(*(a[y, x, :3] / 255))
        if v < 0.2: continue   # 테두리(검은 선)는 그대로
        r, g, b = colorsys.hsv_to_rgb(hue, min(1, s * 0.4 + sat), min(1, v * val)); out[y, x, :3] = (r * 255, g * 255, b * 255)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def url(im):
    buf = io.BytesIO(); im.save(buf, 'WEBP', lossless=True); return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


lines = []
for c in ['weapon', 'off', 'armor', 'acc', 'bag']:
    for r in [100, 80, 60, 30, 10]:
        lines.append(f"  scrart_{c}_{r}: '{url(square(Image.open(f'cat/{c}_{r}.png').convert('RGBA')))}',")
base = Image.open('raw/e_80_0.png').convert('RGBA')
lines.append(f"  lethe0: '{url(square(tint(base, 0.56, 0.12, 0.98)))}',")
lines.append(f"  lethe1: '{url(square(tint(base, 0.55, 0.38, 0.92)))}',")
js = ('/* 빌드 78 넷째: 강화 주문서 25장 · 망각의 주문서 그림 — tools/saved/scrollart78/px/export_scrolls.py로 뽑는다(손으로 고치지 말 것). scroll78.js가 쓴다 */\n'
      'Object.assign(ITEM_HD, {\n' + '\n'.join(lines) + '\n});\n')
open(sys.argv[1], 'w', encoding='utf-8').write(js); print(round(len(js) / 1024), 'KB')
