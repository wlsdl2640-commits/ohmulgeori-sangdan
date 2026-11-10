import sys, pathlib
D = pathlib.Path('/home/claude/skicons/drafts/skill-icons/dot'); sys.path.insert(0, str(D))
import cell, catalog
from PIL import Image, ImageDraw, ImageFont
OLD = catalog.collect()
ids = ['beastshot', 'trap', 'wolfcall', 'camouflage', 'instinct', 'arrowstorm', 'jump', 'gale', 'dragonscale', 'skyfall', 'wyvernfall', 'dragonblood', 'dragonfall']
F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
sh = Image.new('RGB', (len(ids) * 104 + 8, 130), (21, 23, 28)); d = ImageDraw.Draw(sh)
for i, k in enumerate(ids):
    if k not in OLD: d.text((8 + i * 104, 40), k + ' 없음', font=F, fill=(200, 80, 80)); continue
    name, kind, fn = OLD[k]
    im = cell.zoom(fn()[0].img(kind), 2); sh.paste(im, (8 + i * 104, 6), im)
    d.text((8 + i * 104, 106), f'{k}', font=F, fill=(200, 200, 200))
out = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/war/sk/oldride.png'; sh.save(out); print(out)
