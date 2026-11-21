"""export_work.py <src/data-porterwork.js> [미리보기.png] — 짐꾼 작업 자세(GPT 판 8 × 2, 자홍 바탕: 윗줄 갈무리 · 아랫줄 약초 캐기) → 띠 두 장. 손으로 고치지 말 것.
   16장을 같은 틀(모든 장의 그림을 덮는 한 상자)로 잘라 제자리에서 움직이게 한다. 화면 1칸 = 그림 2픽셀 (걷기 그림 키 ~230칸 = 화면 73칸에 맞춘 0.317 × 2)."""
import sys, os
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(D + '../enh72/export_enh.py', encoding='utf-8').read(); ns = {'__file__': D + '../enh72/export_enh.py'}; exec(src.split('out = {}; prev = {}')[0], ns)
key_magenta, biggest, url = ns['key_magenta'], ns['biggest'], ns['url']
K = 2; SC = 0.317 * K
im = Image.open(D + 'porter_work.png').convert('RGB'); cw, ch = im.width / 8, im.height / 2; cells = []
for i in range(16):
    c = biggest(key_magenta(im.crop((round((i % 8) * cw), round((i // 8) * ch), round((i % 8 + 1) * cw), round((i // 8 + 1) * ch)))), 0.003); cells.append(c)
H = min(c.shape[0] for c in cells); W = min(c.shape[1] for c in cells); cells = [c[:H, :W] for c in cells]
al = np.max([c[..., 3] for c in cells], 0); ys, xs = np.nonzero(al); x0, x1, y0, y1 = xs.min() - 1, xs.max() + 2, ys.min() - 1, ys.max() + 2
fw, fh = round((x1 - x0) * SC), round((y1 - y0) * SC); strips = []
for r in range(2):
    st = Image.new('RGBA', (fw * 8, fh))
    for i in range(8): st.paste(Image.fromarray(cells[r * 8 + i][y0:y1, x0:x1]).resize((fw, fh), Image.LANCZOS), (i * fw, 0))
    strips.append(st)
js = "/* 짐꾼 작업 자세 — tools/saved/porter72/export_work.py로 뽑는다(손으로 고치지 말 것). 띠 = 8장, fw · fh = 한 장 크기(화면 칸) */\nconst PORTER_WORK = { fw: %s, fh: %s, harv: '%s', herb: '%s' };\n" % (fw / K, fh / K, url(strips[0], 88), url(strips[1], 88))
open(sys.argv[1], 'w', encoding='utf-8').write(js); print('frame', fw, fh, 'bytes', len(js))
if len(sys.argv) > 2:
    sh = Image.new('RGB', (fw * 8, fh * 2), '#5a7a4a'); sh.paste(strips[0], (0, 0), strips[0]); sh.paste(strips[1], (0, fh), strips[1]); sh.save(sys.argv[2])
