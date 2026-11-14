"""해룡 시안을 게임 그리기로 (RIDE65.wyv에 모습을 끼워 rideComp): python3 rend.py <훅 페이지> <sd.json> <출력 폴더>"""
import json, base64, sys, os, io
from playwright.sync_api import sync_playwright
from PIL import Image
PAGE, JS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
SD = json.load(open(JS))
INJ = r"""((SD) => {
  const rows = g => { const r = g.split('\n').filter(Boolean); const w = Math.max(...r.map(x => x.length)); return r.map(x => x.padEnd(w, '.')); };
  for (const [k, S] of Object.entries(SD)) {
    RIDE65.wyv[k] = { name: S.label.split(' ').slice(2).join(' '), desc: S.desc, pal: S.pal, float: S.float,
      side: { ax: S.ax, fr: Object.fromEntries(Object.entries(S.frames).map(([f, g]) => [f, rows(g)])), seat: S.seat },
      front: RIDE65.wyv.A.front, sleep: RIDE65.wyv.A.sleep };
  }
  PXC.clear();
  return Object.keys(SD).join(',');
})"""
DRAW = r"""((look, rider, fr) => {
  const out = [];
  const a = makeAdv({ cls: 'dragoon', lv: 120, name: '용기수' }); a.ride = { wyv: { look } }; a.wxt = null;
  for (const f of fr) {
    const s = rider ? rideComp(a, f[0], f[1], true) : rideMSpr('wyv', look, 'side', f[0] === 'walk' ? 'run' + (f[1] % 4) : 'idle' + (f[1] % 2));
    const c = document.createElement('canvas'); c.width = 140; c.height = 120; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    const lift = rider ? (s.lift || 0) : 0;
    x.drawImage(s.cv, 70 - s.ax, 110 - s.ay - lift);
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(52, 111, 36, 2);
    out.push(c.toDataURL());
  }
  return out;
})"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1000)
    print(pg.evaluate("s => window.__EV(s)", f"{INJ}({json.dumps(SD)})"))
    looks = ['A', 'D'] + list(SD.keys())
    rowsimg = []
    for lk in looks:
        urls = pg.evaluate("s => window.__EV(s)", f"{DRAW}({json.dumps(lk)}, true, [['idle', 0], ['idle', 1], ['walk', 0], ['walk', 2]])")
        urls2 = pg.evaluate("s => window.__EV(s)", f"{DRAW}({json.dumps(lk)}, false, [['idle', 0]])")
        ims = [Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA') for u in urls2 + urls]
        rowsimg.append((lk, ims))
    print('errors', errs[:3]); br.close()
z = 3
cw, ch = 140 * z, 120 * z
sheet = Image.new('RGB', (cw * 5 + 40, ch * len(rowsimg) + 20), (40, 44, 56))
for r, (lk, ims) in enumerate(rowsimg):
    for i, im in enumerate(ims):
        big = im.resize((140 * z, 120 * z), Image.NEAREST)
        sheet.paste(big, (20 + i * cw, 10 + r * ch), big)
sheet.save(OUT + '/rend.png'); print(sheet.size)
