"""새 뭉툭 아이콘 몇 개를 4배로: python3 nzoom.py n1 bash taunt ..."""
import sys, pathlib, importlib, json
from PIL import Image
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import b4
from art import PAL
from draft import kind_of
SK = {s['id']: s for s in json.load(open(D.parent / 'skills_dump.json'))}
mods = [a for a in sys.argv[1:] if a.startswith('n') and a[1:].isdigit()]; keys = [a for a in sys.argv[1:] if a not in mods]
icons = {}
for m in mods: icons.update(getattr(importlib.import_module(m), m.upper()))
S = 4; sh = Image.new('RGB', (len(keys) * (48 * S + 8) + 8, 48 * S + 16), (21, 23, 28))
for i, k in enumerate(keys):
    rows, pal = icons[k]; pips = 2 if k == 'provoke' else 1 if k == 'taunt' else 0
    im = b4.hex_icon(b4.grid(rows), PAL[pal], kind_of(SK[k]), pips).resize((48 * S, 48 * S), Image.NEAREST)
    sh.paste(im, (8 + i * (48 * S + 8), 8), im)
sh.save(D / 'nzoom.png'); print(sh.size)
