"""텐트 교대 한 바퀴 (11-11 01:38 사용자 「텐트가 셋일 필요는 없어 … 자리교대까지 이어지는 거야」)
5명(마부 + 4) → 텐트 둘 · 불침번 한 명: 다섯 번 교대가 한 바퀴. python3 camp62r.py → camp62_rot5.gif · camp62_rot4.gif · ROT_sheet.png"""
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
FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 13, index=2)
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
CROP = [0, 132, 240, 68]; SH = 1.7
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((W / 'war.html').as_uri()); pg.wait_for_timeout(300); print('load errors', errs[:3])
    out = {}
    for n in (4, 5):
        taus = [round(0.2 + i * 0.1, 2) for i in range(int(n * SH / 0.1) + 4)]
        U = pg.evaluate('([m, ts, cr, n, sh]) => CAMP_RUN(m, ts, cr, n, sh)', ['tent', taus, CROP, n, SH])
        fr = [img(u) for u in U]; out[n] = (taus, fr)
        fr[0].save(str(D / f'camp62_rot{n}.gif'), save_all=True, append_images=fr[1:], duration=100, loop=0)
        print(n, len(fr))
    # 판: 5명 — 교대마다 (교대 한가운데 장) 다섯 줄
    taus, fr = out[5]; w0, h0 = fr[0].size
    rows = []
    for k in range(5):
        mid = (k + 1) * SH - 0.62   # 교대 걸음 한가운데쯤 (둘이 엇갈릴 때)
        i = min(range(len(taus)), key=lambda j: abs(taus[j] - mid)); i0 = min(range(len(taus)), key=lambda j: abs(taus[j] - (k * SH + SH * 0.4)))
        rows.append((k, fr[i0], fr[i]))
    sheet = Image.new('RGB', (w0 * 2 + 30, 40 + len(rows) * (h0 + 26)), (26, 24, 32)); d = ImageDraw.Draw(sheet); d.fontmode = '1'
    d.text((10, 10), '5명(마부 + 4) · 텐트 둘 · 한 바퀴 — 왼쪽: 불침번이 앉아 있을 때 · 오른쪽: 다음 사람이 나오고 앞 불침번이 그 빈자리로', font=FB, fill=(240, 196, 90))
    for k, a, c in rows:
        y = 40 + k * (h0 + 26); d.text((10, y), f'교대 {k + 1}', font=FB, fill=(232, 224, 208))
        sheet.paste(a, (10, y + 18)); sheet.paste(c, (20 + w0, y + 18))
    sheet.save(str(D / 'ROT_sheet.png')); print('sheet', sheet.size)
    b.close()
print('errors', errs[:3])
