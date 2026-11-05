"""뭉툭 시안 시트: 지금 게임 · 지난 시안 · 새 뭉툭(크게) · 새 뭉툭(실제 크기)."""
import json, pathlib, sys, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import b4
from art import PAL
from draft import old_icon, old_glyph, kind_of
from full import icon as draft_icon
from spec import SPEC
SK = {s['id']: s for s in json.load(open(D.parent / 'skills_dump.json'))}
CLS = json.load(open(D / 'clsnames.json')); CLS['all'] = '공용'
def load(mods):
    out = {}
    for m in mods: out.update(getattr(importlib.import_module(m), m.upper()))
    return out
def check(icons):
    bad = []
    for k, (rows, pal) in icons.items():
        g = b4.grid(rows)
        if not 1 <= len(g) <= 12 or any(len(r) > 12 for r in g): bad.append((k, len(g), [len(r) for r in g]))
        u = set(''.join(g)) - set('. ') - set(b4.FIX) - set('123')
        if u: bad.append((k, 'chars', u))
        if pal not in PAL: bad.append((k, 'pal', pal))
    return bad
def sheet(icons, out, title, cols=4):
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
    keys = list(icons); CW, CH = 330, 118; rows = (len(keys) + cols - 1) // cols
    sh = Image.new('RGB', (cols * CW + 16, rows * CH + 56), (21, 23, 28)); dr = ImageDraw.Draw(sh)
    dr.text((10, 10), title, font=f, fill=(242, 190, 60))
    for i, sid in enumerate(keys):
        s = SK[sid]; kind = kind_of(s); rows_, pal = icons[sid]; pips = 2 if sid == 'provoke' else 1 if sid == 'taunt' else 0
        x0 = 8 + (i % cols) * CW; y0 = 48 + (i // cols) * CH
        o = old_icon(old_glyph(s), kind); d = draft_icon(SPEC[sid], kind)
        n = b4.hex_icon(b4.grid(rows_), PAL[pal], kind, pips); n2 = n.resize((96, 96), Image.NEAREST)
        sh.paste(o, (x0, y0 + 8), o); sh.paste(d, (x0 + 52, y0 + 8), d); sh.paste(n2, (x0 + 104, y0 - 6), n2); sh.paste(n, (x0 + 204, y0 + 8), n)
        dr.text((x0 + 256, y0 + 14), s['name'][:6], font=f, fill=(230, 230, 230))
        dr.text((x0 + 256, y0 + 36), '·'.join(CLS.get(c, c) for c in s['cls'].split('/'))[:8], font=fs, fill=(140, 140, 150))
        dr.text((x0 + 2, y0 + 60), '지금', font=fs, fill=(110, 110, 120)); dr.text((x0 + 54, y0 + 60), '지난 시안', font=fs, fill=(110, 110, 120)); dr.text((x0 + 206, y0 + 60), '실제 크기', font=fs, fill=(110, 110, 120))
    sh.save(out); return sh.size
if __name__ == '__main__':
    mods = sys.argv[1:] or ['n1']
    icons = load(mods); bad = check(icons)
    if bad:
        for b in bad: print('BAD', b)
        raise SystemExit
    print(sheet(icons, D / ('ns_' + '_'.join(mods) + '.png'), '뭉툭 스킬 아이콘 표본 — 지금 · 지난 시안 · 새 뭉툭(크게) · 새 뭉툭(실제 크기)'))
