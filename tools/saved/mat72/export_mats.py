"""export_mats.py <src/data-matart.js> [미리보기.png] — 등급 부속품 · 마물육 그림(GPT 판, 자홍 바탕) → ITEM_HD. 손으로 고치지 말 것.
   g_<갈래>_<갈래>.png = 원재료 두 줄 × 여섯 등급 · p_<갈래>_<갈래>.png = 그 가공 재료 · m_<지역>.png = 마물육(왼쪽 위부터 차례)."""
import sys, os, importlib.util
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)) + '/'
sp = importlib.util.spec_from_file_location('ee', D + '../enh72/export_enh.py'); src = open(D + '../enh72/export_enh.py', encoding='utf-8').read()
ns = {'__file__': D + '../enh72/export_enh.py'}; exec(src.split('out = {}; prev = {}')[0], ns)   # 도구 함수만 (key_magenta · biggest · crop · square · url)
key_magenta, biggest, crop, square, url = ns['key_magenta'], ns['biggest'], ns['crop'], ns['square'], ns['url']
SZ = 72
def cells(name, cols, rows, n=None):
    im = Image.open(D + name).convert('RGB'); cw, ch = im.width / cols, im.height / rows; out = []
    for i in range(n or cols * rows):
        c = im.crop((round((i % cols) * cw), round((i // cols) * ch), round((i % cols + 1) * cw), round((i // cols + 1) * ch)))
        out.append(square(crop(biggest(key_magenta(c), 0.004)), SZ))
    return out
items = {}
for a, b in [('hide', 'bone'), ('rscale', 'dscale'), ('fscale', 'feather'), ('moss', 'fiber'), ('web', 'shell'), ('wood', 'ore')]:
    cs = cells('g_%s_%s.png' % (a, b), 6, 2)
    for i in range(6): items['%s_%d' % (a, i)] = cs[i]; items['%s_%d' % (b, i)] = cs[6 + i]
    ps = cells('p_%s_%s.png' % (a, b), 6, 2)   # 가공 재료 (같은 자리 나눔)
    for i in range(6): items['p_%s_%d' % (a, i)] = ps[i]; items['p_%s_%d' % (b, i)] = ps[6 + i]
MEAT = { 'm_plains.png': (4, 2, ['rat', 'rabbit', 'wolf', 'scarecrow', 'boar', 'aboar', 'ratking']), 'm_forest.png': (4, 2, ['vinesnake', 'cflower', 'stump', 'spotshroom', 'ibeetle', 'mgolem', 'fguard', 'elder']),
         'm_deep.png': (4, 2, ['ewisp', 'mlizard', 'rcenti', 'emoth', 'eshroom', 'cstag', 'sentinel', 'elddragon']), 'm_rootcave.png': (3, 1, ['smandrake', 'fairies', 'fdryad']) }
for f, (c, r, ids) in MEAT.items():
    for im, k in zip(cells(f, c, r, len(ids)), ids): items['mm_' + k] = im
js = '/* 등급 부속품 · 마물육 그림 — tools/saved/mat72/export_mats.py로 뽑는다(손으로 고치지 말 것) */\nObject.assign(ITEM_HD, {\n' + ''.join("  %s: '%s',\n" % (k, url(v, 86)) for k, v in items.items()) + '});\n'
open(sys.argv[1], 'w', encoding='utf-8').write(js); print('items', len(items), 'bytes', len(js))
if len(sys.argv) > 2:
    ks = list(items); W = 12; sh = Image.new('RGB', (W * SZ, ((len(ks) + W - 1) // W) * SZ), '#3a3f55')
    for i, k in enumerate(ks): sh.paste(items[k], ((i % W) * SZ, (i // W) * SZ), items[k])
    sh.save(sys.argv[2])
