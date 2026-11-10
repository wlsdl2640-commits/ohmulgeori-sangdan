"""텐트 시안 (11-11 01:07 사용자): 텐트 하나에 두 명 · 4명 이상이면 텐트 둘 (6명부터 셋 — 내 해석)
python3 camp62t.py → camp62_tent{3,4,5,6}.gif · TENT_sheet.png (이름 붙은 판)"""
import sys, pathlib, base64, io, json
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import war
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
D = pathlib.Path(__file__).parent; W = D.parent
WAGON = json.load(open(D / 'wagon62.json'))
(D / '_cg1.js').write_text((W / 'cg1.js').read_text().replace('window.WAR_SHEET', 'window.WAR_SHEET_CG'))
(D / '_wag.js').write_text('const WAGON62 = ' + json.dumps(WAGON['rows']) + ';\n')
war.build(['rg1.js', 'rg2.js', 'tk1.js', 'tk2.js', 'camp/_cg1.js', 'camp/_wag.js', 'camp/camp62.js'])
FB = ImageFont.truetype(str(war.GAME / 'fonts' / 'Galmuri11-Bold.ttf'), 12) if (war.GAME / 'fonts' / 'Galmuri11-Bold.ttf').exists() else ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 13, index=2)
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
CROP = [0, 132, 240, 68]
RUNS = [('tent', 3, '마부 + 2명 → 텐트 하나 (둘이 자고 한 명 불침번)'), ('tent', 4, '4명 → 텐트 둘 (2 + 1, 교대하면 2 + 2)'),
        ('tent', 5, '5명 → 텐트 둘 (2 + 2, 한 명 불침번)'), ('tent', 6, '6명 → 텐트 셋 (내 해석: 텐트 하나에 두 명)')]
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((W / 'war.html').as_uri()); pg.wait_for_timeout(300); print('load errors', errs[:3])
    stills = []
    for mode, n, ttl in RUNS:
        taus = [round(0.5 + i * 0.1, 2) for i in range(72)]
        U = pg.evaluate('([m, ts, cr, n]) => CAMP_RUN(m, ts, cr, n)', [mode, taus, CROP, n])
        fr = [img(u) for u in U]
        fr[0].save(str(D / f'camp62_{mode}{n}.gif'), save_all=True, append_images=fr[1:], duration=100, loop=0)
        stills.append((ttl, fr[8], fr[21]))   # 앉아 있을 때 · 교대 걸음
        print(mode, n, len(fr), fr[0].size)
    w0, h0 = stills[0][1].size
    sheet = Image.new('RGB', (w0 * 2 + 30, (h0 + 30) * len(stills) + 40), (26, 24, 32)); d = ImageDraw.Draw(sheet); d.fontmode = '1'
    d.text((10, 10), '텐트 하나에 두 명 · 4명 이상이면 텐트 둘 — 왼쪽: 불침번이 앉아 있을 때 · 오른쪽: 교대(나온 사람 자리로 들어간다)', font=FB, fill=(240, 196, 90))
    for i, (ttl, a, c) in enumerate(stills):
        y = 40 + i * (h0 + 30); d.text((10, y), ttl, font=FB, fill=(232, 224, 208))
        sheet.paste(a, (10, y + 18)); sheet.paste(c, (20 + w0, y + 18))
    sheet.save(str(D / 'TENT_sheet.png')); print('sheet', sheet.size)
    b.close()
print('errors', errs[:3])
