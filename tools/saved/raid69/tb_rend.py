"""천둥새 시안을 게임 그리기(PXRAID → pxBake → drawMon)로: python3 rend.py <훅 페이지> <tb.json> <출력.png> [키…]"""
import json, base64, sys
from playwright.sync_api import sync_playwright
from PIL import Image
PAGE, JS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
KEYS = sys.argv[4:] or ['cur', 'A', 'B', 'C']
TB = json.load(open(JS))
SET = r"""((g, pal) => {
  if (!window.__TB0) window.__TB0 = { g: PXRAID.raidgriffon.g, pal: PXRAID.raidgriffon.pal, W: MONS.raidgriffon.W, H: MONS.raidgriffon.H };
  const o = g ? { g, pal } : window.__TB0;
  PXRAID.raidgriffon = { g: o.g, pal: o.pal };
  const rows = pxRows(o.g); PXG_DIM.raidgriffon = [rows[0].length * 2, rows.length * 2];
  MONS.raidgriffon.W = g ? rows[0].length * 2 : window.__TB0.W; MONS.raidgriffon.H = g ? rows.length * 2 : window.__TB0.H;
  PXC.clear();
  const c = document.createElement('canvas'); c.width = 240; c.height = 170; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.translate(120, 160); drawMon(x, 'raidgriffon', 0, { z: 1 });
  return c.toDataURL();
})"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1000)
    ims = []
    for k in KEYS:
        g = None if k == 'cur' else '\n' + TB[k] + '\n'
        url = pg.evaluate("s => window.__EV(s)", f"{SET}({json.dumps(g)}, {json.dumps(TB['pal'].get(k, {}) if k != 'cur' else {})})")
        im = Image.open(__import__('io').BytesIO(base64.b64decode(url.split(',')[1]))).convert('RGBA')
        ims.append(im)
    print('errors', errs[:3]); br.close()
z = 4
bb = None
for im in ims:
    b = im.getbbox()
    if b: bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
crop = [im.crop(bb) for im in ims]
w, h = crop[0].size
sheet = Image.new('RGB', (len(crop) * (w * z + 20) + 20, h * z + 40), (40, 44, 56))
for i, im in enumerate(crop):
    big = im.resize((w * z, h * z), Image.NEAREST)
    sheet.paste(big, (20 + i * (w * z + 20), 20), big)
sheet.save(OUT); print(sheet.size)
