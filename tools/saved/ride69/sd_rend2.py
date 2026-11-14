"""해룡 탈것(옆 · 앞 · 자는 모습)을 게임 그리기로: python3 sd_rend2.py <훅 페이지> <seadragon.json> <출력.png>
RIDE65.wyv['seaA'…]에 모습을 통째로 끼워 실제 rideComp(탈것 + 용기수) · rideMSpr(sleep)로 찍는다 (게임 데이터는 안 바꾼다).
줄마다: 탈것만 · 서 있기 · 달리기 · 앞모습 둘 · 자는 모습 둘."""
import json, base64, sys, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
PAGE, JS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SD = json.load(open(JS))
INJ = r"""((SD) => {
  const rows = g => { const r = g.split('\n').filter(Boolean); const w = Math.max(...r.map(x => x.length)); return r.map(x => x.padEnd(w, '.')); };
  const fr = o => Object.fromEntries(Object.entries(o).map(([f, g]) => [f, rows(g)]));
  for (const [k, S] of Object.entries(SD)) {
    const F = S.front.frames, Z = S.sleep.frames;
    RIDE65.wyv[k] = { name: S.label.split(' ').slice(2).join(' '), desc: S.desc, pal: S.pal, float: S.float,
      side: { ax: S.ax, fr: fr(S.frames), seat: S.seat },
      front: { ax: S.front.ax, fr: { front0: rows(F.front0), front1: rows(F.front1) }, over: { front0: rows(F.front0_f), front1: rows(F.front1_f) }, seat: S.front.seat },
      sleep: { ax: S.sleep.ax, fr: fr(Z) } };
  }
  PXC.clear();
  return Object.keys(SD).join(',');
})"""
DRAW = r"""((look) => {
  const a = makeAdv({ cls: 'dragoon', lv: 120, name: '용기수' }); a.ride = { wyv: { look } }; a.wxt = null;
  const cell = (s, lift, sh) => { const c = document.createElement('canvas'); c.width = 140; c.height = 120; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    if (sh) { x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(70 - sh, 111, sh * 2, 2); }
    x.drawImage(s.cv, 70 - s.ax, 110 - s.ay - (lift || 0)); return c.toDataURL(); };
  const out = [];
  out.push(cell(rideMSpr('wyv', look, 'side', 'idle0'), 0, 18));
  for (const [p, f] of [['idle', 0], ['walk', 1]]) { const s = rideComp(a, p, f, true); out.push(cell(s, s.lift, 18)); }
  for (const f of [0, 1]) { const s = rideComp(a, 'idle', f, false); out.push(cell(s, 0, 18)); }
  for (const f of [0, 1]) out.push(cell(rideMSpr('wyv', look, 'sleep', 'sleep' + f), 0, 0));
  return out;
})"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1000)
    print(pg.evaluate("s => window.__EV(s)", f"{INJ}({json.dumps(SD)})"))
    rowsimg = []
    for lk in SD:
        urls = pg.evaluate("s => window.__EV(s)", f"{DRAW}({json.dumps(lk)})")
        rowsimg.append((SD[lk]['label'], [Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA') for u in urls]))
    print('errors', errs[:3]); br.close()
z = 3; cw, ch = 140 * z, 120 * z
FS = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 26, index=2)
heads = ['탈것만', '서 있기', '달리기', '앞모습', '앞모습 (숨)', '자는 모습', '자는 모습 (숨)']
sheet = Image.new('RGB', (cw * 7 + 40, (ch + 40) * len(rowsimg) + 60), (40, 44, 56)); d = ImageDraw.Draw(sheet)
for i, h in enumerate(heads): d.text((20 + i * cw + 10, 14), h, font=FS, fill=(220, 214, 200))
for r, (lab, ims) in enumerate(rowsimg):
    y = 60 + r * (ch + 40)
    d.text((24, y), lab, font=FS, fill=(240, 196, 90))
    for i, im in enumerate(ims):
        big = im.resize((140 * z, 120 * z), Image.NEAREST)
        sheet.paste(big, (20 + i * cw, y + 30), big)
sheet.save(OUT); print(sheet.size)
