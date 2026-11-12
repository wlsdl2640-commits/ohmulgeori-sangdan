import json, sys, os
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v68/'
out = D + 'port/sh'; os.makedirs(out, exist_ok=True)
code = open(D + 'port/port68.js', encoding='utf-8').read()
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + D + 'play_ev68.html'); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    EV = lambda js: pg.evaluate("s => window.__EV(s)", js)
    EV("S.modals = []; { const m = document.querySelector('#modal'); if (m) m.style.display = 'none'; } 1")
    print(EV(code))
    for name, dp, ship in (('day', 0.42, 'true'), ('night', 0.93, 'true'), ('empty', 0.5, 'false')):
        EV(f"S.t = Math.floor(S.t / 180) * 180 + 180 + {dp} * 180; window.PORT68.ship = {ship}; hqGo('port0', true); if (HQ.shells && HQ.shells.clear) HQ.shells.clear(); 1")
        pg.wait_for_timeout(900)
        if ship == 'false':
            EV("""(() => { let el = document.querySelector('#d68sign'); if (!el) { el = document.createElement('div'); el.id = 'd68sign'; document.body.appendChild(el); }
              const cv = document.querySelector('#hq').getBoundingClientRect(), K = HQS.port.geo(hqGeo(1.25)), sc = cv.width / K.W;
              el.style.cssText = `position:fixed;left:${cv.left + 99 * sc}px;top:${cv.top + (K.FB + 8) * sc}px;transform:translate(-50%,-50%);font:bold 12px Galmuri11,sans-serif;color:#4a2a10;white-space:nowrap;text-align:center;line-height:1.2`;
              el.innerHTML = '다음 배<br>D-3'; })(); 1""")
        else: EV("(() => { const el = document.querySelector('#d68sign'); if (el) el.remove(); })(); 1")
        pg.wait_for_timeout(200); pg.screenshot(path=f'{out}/{name}.png')
    print('errors:', errs[:5]); br.close()
