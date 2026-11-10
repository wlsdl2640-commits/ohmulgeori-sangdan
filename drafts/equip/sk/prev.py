"""새 그림 몇 개만 빠르게: python3 prev.py name1 name2 … → prev.png (4배 + 옛 그림 2배)"""
import sys, pathlib, importlib
D = pathlib.Path('/home/claude/skicons/drafts/skill-icons/dot'); sys.path.insert(0, str(D))
import cell, catalog, c_v63
from PIL import Image, ImageDraw, ImageFont
OLD = catalog.collect()
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
pairs = [a.split('=') for a in sys.argv[1:]]   # fn=oldid
Z = 4; CW = 48 * Z + 110
sh = Image.new('RGB', (len(pairs) * CW + 8, 48 * Z + 30), (21, 23, 28)); d = ImageDraw.Draw(sh)
for i, p in enumerate(pairs):
    fn = getattr(c_v63, p[0]); kind = p[2] if len(p) > 2 else 'dmg'
    im = cell.zoom(fn()[0].img(kind), Z); sh.paste(im, (8 + i * CW, 4), im)
    if len(p) > 1 and p[1] in OLD:
        o = OLD[p[1]]; oi = cell.zoom(o[2]()[0].img(o[1]), 2); sh.paste(oi, (8 + i * CW + 48 * Z + 6, 4), oi)
    d.text((8 + i * CW, 48 * Z + 8), p[0], font=F, fill=(220, 220, 220))
out = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/war/sk/prev.png'; sh.save(out); print(out, sh.size)
