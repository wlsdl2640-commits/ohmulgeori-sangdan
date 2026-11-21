"""export_herbs.py <src/data-herbart.js> [미리보기.png] — 약초 군락지(소 · 중 · 대) · 피어나는 약초(3단계) · 아이콘 (GPT 판, 자홍 바탕). 손으로 고치지 말 것.
   c_<약초>.png = 군락지 셋 · b_<약초>.png = 피는 세 단계 · icons10.png = 가방 그림 5 × 2. 게임 화면 1칸 = 그림 3픽셀(K)로 줄여 넣는다."""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage
D = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(D + '../enh72/export_enh.py', encoding='utf-8').read(); ns = {'__file__': D + '../enh72/export_enh.py'}; exec(src.split('out = {}; prev = {}')[0], ns)
key_magenta, biggest, crop, square, url = ns['key_magenta'], ns['biggest'], ns['crop'], ns['square'], ns['url']
K = 3; SC = 0.062 * K   # 2172칸 너비 판 기준: 대형 군락지 높이 ~500 → 화면 31칸
def three(name):
    im = Image.open(D + name).convert('RGB'); a = biggest(key_magenta(im), 0.0006); col = (a[..., 3] > 0).sum(0) > 0
    # 빈 세로 띠 가운데 가장 넓은 둘로 셋으로 나눈다
    gaps = []; x = 0; W = len(col)
    xs = np.nonzero(col)[0]; x0, x1 = xs.min(), xs.max(); s = None
    for x in range(x0, x1 + 1):
        if not col[x] and s is None: s = x
        if col[x] and s is not None: gaps.append((x - s, s, x)); s = None
    gaps.sort(reverse=True); cuts = sorted([(g[1] + g[2]) // 2 for g in gaps[:2]]); edges = [0] + cuts + [W]; out = []
    for i in range(3):
        part = a[:, edges[i]:edges[i + 1]]; part = crop(part, 1); sc = SC * 2172 / im.width
        pim = Image.fromarray(part); pim = pim.resize((max(1, round(pim.width * sc)), max(1, round(pim.height * sc))), Image.LANCZOS); out.append(pim)
    return out
COL = ['herb', 'mugwort', 'moonflower', 'waterherb', 'wolfsbane', 'bladderlotus', 'ethermoss', 'fairybell', 'wtsprout', 'echoshroom', 'blacktear', 'mandrake', 'inkshroom']; BL = ['bloodshroom', 'cordy']
art = {}; prev = []
for k in COL: ims = three('c_%s.png' % k); art[k] = ims; prev += ims
for k in BL: ims = three('b_%s.png' % k); art[k] = ims; prev += ims
ic = Image.open(D + 'icons10.png').convert('RGB'); cw, ch = ic.width / 5, ic.height / 2; icons = {}
for i, k in enumerate(['bloodshroom', 'moonflower', 'cordy', 'mugwort', 'wolfsbane', 'bladderlotus', 'echoshroom', 'fairybell', 'wtsprout', 'blacktear']):
    c = ic.crop((round((i % 5) * cw), round((i // 5) * ch), round((i % 5 + 1) * cw), round((i // 5 + 1) * ch))); icons[k] = square(crop(biggest(key_magenta(c), 0.004)), 72)
js = '/* 약초 군락지 · 피는 약초 · 아이콘 — tools/saved/herb72/export_herbs.py로 뽑는다(손으로 고치지 말 것). 군락지 [소, 중, 대] · 피는 약초 [싹, 봉오리, 활짝] = [그림, 너비, 높이](화면 칸) */\nconst HERB_ART = {\n'
for k, ims in art.items(): js += '  %s: [%s],\n' % (k, ', '.join("['%s', %s, %s]" % (url(im, 86), round(im.width / K, 1), round(im.height / K, 1)) for im in ims))
js += '};\nObject.assign(ITEM_HD, {\n' + ''.join("  %s: '%s',\n" % (k, url(v, 86)) for k, v in icons.items()) + '});\n'
open(sys.argv[1], 'w', encoding='utf-8').write(js); print('bytes', len(js), {k: [im.size for im in v] for k, v in list(art.items())[:3]})
if len(sys.argv) > 2:
    W = 9; sh = Image.new('RGB', (W * 150, ((len(prev) + W - 1) // W) * 110), '#5a7a4a')
    for i, im in enumerate(prev): sh.paste(im, ((i % W) * 150 + 4, (i // W) * 110 + 106 - im.height), im)
    sh.save(sys.argv[2])
