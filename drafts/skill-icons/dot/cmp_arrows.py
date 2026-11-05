"""화살 3판 비교: 왼쪽 지난번(2판) → 오른쪽 가늘고 깃 긴 3판. python3 cmp_arrows.py"""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import catalog
from PIL import Image, ImageDraw, ImageFont
import cell
D = pathlib.Path(__file__).parent; S = D.parent / 'final_snap'
users = set(json.load(open(S / 'arrow_users.json'))) | {'titanfall'}
ic = catalog.collect()
ids = [s['id'] for s in catalog.grouped() if s['id'] in users]
f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 14, index=2)
PER_ROW = 4; Z = 3; IW = 48 * Z; PW = IW * 2 + 34; CW = PW + 26; RH = IW + 34
nr = (len(ids) + PER_ROW - 1) // PER_ROW
sh = Image.new('RGB', (PER_ROW * CW + 10, nr * RH + 34), (21, 23, 28)); dr = ImageDraw.Draw(sh)
dr.text((10, 6), '왼쪽: 지난번 화살  →  오른쪽: 더 가늘고 깃 긴 화살', font=f, fill=(242, 190, 60))
for i, sid in enumerate(ids):
    x0 = 10 + (i % PER_ROW) * CW; y0 = 30 + (i // PER_ROW) * RH
    a = Image.open(S / f'{sid}.png').resize((IW, IW), Image.NEAREST)
    name, kind, fn = ic[sid]; art, _ = fn(); b = cell.zoom(art.img(kind), Z)
    sh.paste(a, (x0, y0), a); sh.paste(b, (x0 + IW + 34, y0), b)
    dr.text((x0 + IW + 8, y0 + IW // 2 - 10), '→', font=f, fill=(160, 160, 170))
    dr.text((x0 + 2, y0 + IW + 6), name, font=f, fill=(225, 225, 225))
sh.save(D / 'arrows_v3_cmp.png'); print(sh.size, len(ids))
