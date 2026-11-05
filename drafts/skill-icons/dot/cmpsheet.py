"""고치기 전 → 뒤 비교 시트: python3 cmpsheet.py"""
import sys, json, pathlib
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; C = D.parent / 'cmp'
ids = (C / 'ids.txt').read_text().strip().split(',')
sk = {s['id']: s for s in json.load(open(D / 'data' / 'skills.json'))}
import catalog
ic = catalog.collect()
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
fs = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 12, index=2)
PER_ROW, ROWS = 4, 8; Z = 3; IW = 48 * Z
PW = IW * 2 + 34; CW = PW + 26; RH = IW + 34
per = PER_ROW * ROWS; files = []
for pi in range(0, len(ids), per):
    chunk = ids[pi:pi + per]; nr = (len(chunk) + PER_ROW - 1) // PER_ROW
    sh = Image.new('RGB', (PER_ROW * CW + 10, nr * RH + 34), (21, 23, 28)); dr = ImageDraw.Draw(sh)
    dr.text((10, 6), '왼쪽: 전 (체크한 것)   →   오른쪽: 새로 그린 것', font=f, fill=(242, 190, 60))
    for i, sid in enumerate(chunk):
        x0 = 10 + (i % PER_ROW) * CW; y0 = 30 + (i // PER_ROW) * RH
        a = Image.open(C / 'old' / f'{sid}.png').resize((IW, IW), Image.NEAREST)
        b = Image.open(C / 'new' / f'{sid}.png').resize((IW, IW), Image.NEAREST)
        sh.paste(a, (x0, y0), a); sh.paste(b, (x0 + IW + 34, y0), b)
        dr.text((x0 + IW + 8, y0 + IW // 2 - 10), '→', font=f, fill=(160, 160, 170))
        dr.text((x0 + 2, y0 + IW + 6), ic[sid][0], font=f, fill=(225, 225, 225))
    p = D / f'cmp_{pi // per + 1:02d}.png'; sh.save(p); files.append(p.name)
print(files)
