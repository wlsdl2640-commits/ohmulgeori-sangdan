"""뭉툭 시안 전체 시트 (스킬 307개, 3장): 지금(작게) · 새 뭉툭(크게) · 새 뭉툭(실제 크기) · 이름."""
import json, pathlib, sys, importlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import b4
from art import PAL
from draft import old_icon, old_glyph, kind_of
ICONS = {}
for m in ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']: ICONS.update(getattr(importlib.import_module(m), m.upper()))
SK = json.load(open(D.parent / 'skills_dump.json'))
CLS = json.load(open(D / 'clsnames.json')); CLS['all'] = '공용'
def new_icon(sid, kind):
    rows, pal = ICONS[sid]; pips = 2 if sid == 'provoke' else 1 if sid == 'taunt' else 0
    return b4.hex_icon(b4.grid(rows), PAL[pal], kind, pips)
if __name__ == '__main__':
    COLS, CW, CH = 6, 236, 106
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
    N = 108; pages = [SK[i:i + N] for i in range(0, len(SK), N)]
    for pi, page in enumerate(pages):
        rows = (len(page) + COLS - 1) // COLS
        sh = Image.new('RGB', (COLS * CW + 16, rows * CH + 52), (21, 23, 28)); dr = ImageDraw.Draw(sh)
        dr.text((10, 10), f'뭉툭 스킬 아이콘 {pi + 1}/{len(pages)} — 맨 왼쪽: 지금 · 가운데: 새 그림(크게) · 오른쪽: 실제 게임 크기  (도발 1·2만 같은 그림, 위 흰 점 1·2개)', font=f, fill=(242, 190, 60))
        for i, s in enumerate(page):
            x0 = 8 + (i % COLS) * CW; y0 = 44 + (i // COLS) * CH; kind = kind_of(s)
            o = old_icon(old_glyph(s), kind).resize((32, 32), Image.LANCZOS); n = new_icon(s['id'], kind); n2 = n.resize((96, 96), Image.NEAREST)
            sh.paste(o, (x0, y0 + 32), o); sh.paste(n2, (x0 + 34, y0), n2); sh.paste(n, (x0 + 132, y0 + 4), n)
            dr.text((x0 + 132, y0 + 56), s['name'][:7], font=f, fill=(230, 230, 230))
            dr.text((x0 + 132, y0 + 78), '·'.join(CLS.get(c, c) for c in s['cls'].split('/'))[:9], font=fs, fill=(140, 140, 150))
        sh.save(D / f'nfull{pi + 1}.png'); print(sh.size)
