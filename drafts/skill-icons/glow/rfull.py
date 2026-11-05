"""참고 느낌 시안 전체 307개 (3장): 지금(작게) · 새 그림(크게) · 실제 크기 · 이름. python3 rfull.py [24|48]"""
import json, pathlib, sys
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
from rsheet import make, SK, CLS
from draft import old_icon, old_glyph, kind_of
grid = int(sys.argv[1]) if len(sys.argv) > 1 else 24
ALL = json.load(open(D.parent / 'skills_dump.json'))
COLS, CW, CH = 6, 236, 106
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2); fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
N = 108; pages = [ALL[i:i + N] for i in range(0, len(ALL), N)]
tag = 'A안 (배경도 굵은 픽셀)' if grid == 24 else 'B안 (배경은 고운 픽셀)'
for pi, page in enumerate(pages):
    rows = (len(page) + COLS - 1) // COLS
    sh = Image.new('RGB', (COLS * CW + 16, rows * CH + 52), (21, 23, 28)); dr = ImageDraw.Draw(sh)
    dr.text((10, 10), f'참고 그림 느낌 스킬 아이콘 {tag} {pi + 1}/{len(pages)} — 왼쪽: 지금 · 가운데: 새 그림(크게) · 오른쪽: 실제 게임 크기', font=f, fill=(242, 190, 60))
    for i, s in enumerate(page):
        x0 = 8 + (i % COLS) * CW; y0 = 44 + (i // COLS) * CH
        o = old_icon(old_glyph(s), kind_of(s)).resize((32, 32), Image.LANCZOS); n = make(s['id'], grid); n2 = n.resize((96, 96), Image.NEAREST)
        sh.paste(o, (x0, y0 + 32), o); sh.paste(n2, (x0 + 34, y0), n2); sh.paste(n, (x0 + 132, y0 + 4), n)
        dr.text((x0 + 132, y0 + 56), s['name'][:7], font=f, fill=(230, 230, 230))
        dr.text((x0 + 132, y0 + 78), '·'.join(CLS.get(c, c) for c in s['cls'].split('/'))[:9], font=fs, fill=(140, 140, 150))
    sh.save(D / f'rfull{grid}_{pi + 1}.png'); print(sh.size)
