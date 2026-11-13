"""킹슬라임 시안 찍기: 지금 · A · B · C를 가까이(그림만) + 레이드 무대(네 파티)로"""
import json, base64
from playwright.sync_api import sync_playwright
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v87/ks/'
KS = json.load(open(D + 'ks.json'))
PAGE = SP + '/v87/form/play_form.html'
MOCK = open(SP + '/v87/raid/raidmock.js', encoding='utf-8').read()
def skip(pg):
    for _ in range(16):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
SET = r"""((g, pal) => {
  if (!window.__KS0) window.__KS0 = { g: PXRAID.kingslime.g, pal: PXRAID.kingslime.pal, W: MONS.kingslime.W, H: MONS.kingslime.H };
  const o = g ? { g, pal } : window.__KS0;
  PXRAID.kingslime = { g: o.g, pal: o.pal };
  const rows = pxRows(o.g); PXG_DIM.kingslime = [rows[0].length * 2, rows.length * 2];
  MONS.kingslime.W = g ? 70 : window.__KS0.W; MONS.kingslime.H = g ? rows.length * 2 : window.__KS0.H;   // W 70: 화면 너비를 지금(91px)과 비슷하게
  PXC.clear();
  const c = document.createElement('canvas'); c.width = 200; c.height = 150; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.translate(100, 140); drawMon(x, 'kingslime', 0, { z: 1 });
  return c.toDataURL();
})"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
    EV(MOCK); EV("RMOCK.setup()"); skip(pg); EV("S.modals = []")
    EV("RMOCK.raid()"); pg.wait_for_timeout(400); EV("openBattle()"); pg.wait_for_timeout(600)
    for key in ('cur', 'A', 'B', 'C'):
        g = None if key == 'cur' else KS[key]
        url = EV(f"{SET}({json.dumps(g)}, {json.dumps(KS['pal'])})")
        open(D + f'close_{key}.png', 'wb').write(base64.b64decode(url.split(',')[1]))
        EV("RMOCK.raid()"); pg.wait_for_timeout(700)
        pg.locator('#bcv').screenshot(path=D + f'scene_{key}.png')
    print('errors', errs[:5]); br.close()
