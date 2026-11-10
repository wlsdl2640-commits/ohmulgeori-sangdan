"""야영 장면 시안 (11-11 00:34 사용자): 실제 drawFrame 길(풍경 · 밤 어둠 · 불빛)에 fieldScene의 야영만 갈아 끼운다.
  mode fire  = 짐꾼 계열이 마부 아래뿐 → 모닥불만 (모두 불가에서 잔다, 짐꾼이 먼저 불침번)
  mode tent  = 마부(2차) → 작은 텐트 (자는 사람은 텐트 안, 불침번 한 명만 밖)
  mode wagon = 코네스토가(3차) → 텐트 대신 코네스토가 웨건 (안에 불이 켜진 덮개, 자는 사람은 웨건 안)
  불침번: 짐꾼 계열이 먼저 → 모험가와 한 명씩 교대 (교대 때 다음 사람이 나와 걸어가고, 앞 사람은 들어간다)
python3 camp62.py → camp62_*.png · camp62_*.gif"""
import sys, pathlib, base64, io, json
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import war
from playwright.sync_api import sync_playwright
from PIL import Image
D = pathlib.Path(__file__).parent; W = D.parent
WAGON = json.load(open(D / 'wagon62.json'))
(D / '_cg1.js').write_text((W / 'cg1.js').read_text().replace('window.WAR_SHEET', 'window.WAR_SHEET_CG'))
(D / '_wag.js').write_text('const WAGON62 = ' + json.dumps(WAGON['rows']) + ';\n')
war.build(['rg1.js', 'rg2.js', 'tk1.js', 'tk2.js', 'camp/_cg1.js', 'camp/_wag.js', 'camp/camp62.js'])
p = W / 'war.html'
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
CROP = [0, 96, 240, 104]
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.goto(p.as_uri()); pg.wait_for_timeout(300); print('load errors', errs[:3])
    stills = []
    for mode in ('fire', 'tent', 'wagon'):
        taus = [round(0.5 + i * 0.1, 2) for i in range(64)]
        U = pg.evaluate('([m, ts, cr]) => CAMP_RUN(m, ts, cr)', [mode, taus, CROP])
        fr = [img(u) for u in U]
        fr[0].save(str(D / ('camp62_' + mode + '.gif')), save_all=True, append_images=fr[1:], duration=100, loop=0)
        stills.append(fr[6]); stills.append(fr[24])
        print(mode, len(fr), fr[0].size)
    w0, h0 = stills[0].size
    sheet = Image.new('RGB', (w0 * 2 + 10, (h0 + 10) * 3), (26, 24, 32))
    for i, im in enumerate(stills): sheet.paste(im, ((i % 2) * (w0 + 10), (i // 2) * (h0 + 10)))
    sheet.save(str(D / 'camp62_sheet.png')); print('sheet', sheet.size)
    b.close()
print('errors', errs[:3])
