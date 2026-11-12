import json
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v68/'
code = open(D + 'port/win68.js', encoding='utf-8').read(); ico = json.load(open(D + 'ing/icons68.json'))
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + D + 'play_ev68.html'); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    pg.evaluate("ico => { window.__ICO68 = ico; }", ico)
    EV = lambda js: pg.evaluate("s => window.__EV(s)", js)
    EV("(async () => { for (const k of Object.keys(window.__ICO68)) { const im = new Image(); await new Promise(r => { im.onload = r; im.src = window.__ICO68[k].url; }); const [c, x] = mkCanvas(20, 20); x.drawImage(im, 0, 0); URL_CV.set(window.__ICO68[k].url, c); } })()")
    pg.wait_for_timeout(400); EV(code); pg.wait_for_timeout(400)
    pg.screenshot(path=D + 'port/sh/win1.png')
    pg.evaluate("() => document.querySelector('#panel').scrollTo(0, 9999)"); pg.wait_for_timeout(200)
    pg.screenshot(path=D + 'port/sh/win2.png'); print('errors:', errs[:3]); br.close()
