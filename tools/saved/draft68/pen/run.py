import json, sys
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v68/'
code = open(D + 'pen/pen68.js', encoding='utf-8').read(); ico = json.load(open(D + 'ing/icons68.json'))
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + D + 'play_ev68.html'); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    pg.evaluate("ico => { window.__ICO68 = ico; }", ico)
    EV = lambda js: pg.evaluate("s => window.__EV(s)", js)
    EV("(async () => { for (const k of Object.keys(window.__ICO68)) { const im = new Image(); await new Promise(r => { im.onload = r; im.src = window.__ICO68[k].url; }); const [c, x] = mkCanvas(20, 20); x.drawImage(im, 0, 0); URL_CV.set(window.__ICO68[k].url, c); } })()")
    pg.wait_for_timeout(500)
    EV(code); EV("D68PEN.win(); 1"); pg.wait_for_timeout(400)
    pg.screenshot(path=D + 'pen/p1.png')
    pg.evaluate("() => document.querySelector('#panel').scrollTo(0, 9999)"); pg.wait_for_timeout(200)
    pg.screenshot(path=D + 'pen/p2.png')
    EV("D68PEN.modal('ok'); 1"); pg.wait_for_timeout(300); pg.screenshot(path=D + 'pen/m_ok.png')
    EV("D68PEN.modal('no'); 1"); pg.wait_for_timeout(300); pg.screenshot(path=D + 'pen/m_no.png')
    EV("D68PEN.hide(); D68PEN.dex(); 1"); pg.wait_for_timeout(400); pg.screenshot(path=D + 'pen/dex.png')
    pg.set_viewport_size({'width': 412, 'height': 1500}); EV("D68PEN.sheet(); 1"); pg.wait_for_timeout(500)
    bb = pg.evaluate("() => { const r = document.querySelector('#panel-in').getBoundingClientRect(); return [r.top, r.height]; }")
    pg.screenshot(path=D + 'pen/sheet.png', clip={'x': 0, 'y': max(0, bb[0] - 60), 'width': 412, 'height': min(1500 - max(0, bb[0] - 60), bb[1] + 70)})
    print('errors:', errs[:3]); br.close()
