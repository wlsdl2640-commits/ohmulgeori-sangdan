"""지도 시안을 게임 지도 창에 넣어 찍는다 — python3 preview.py <출력.png> <시안.png(2배 480)|current> [DPR]"""
import sys, base64, os
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v70/'
HOOK = D + 'play_ev70.html'
src = sys.argv[2]; dpr = float(sys.argv[3]) if len(sys.argv) > 3 else 2
url = None if src == 'current' else 'data:image/png;base64,' + base64.b64encode(open(src, 'rb').read()).decode()
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=dpr)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + HOOK); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    EV = lambda js: pg.evaluate("s => window.__EV(s)", js)
    EV("S.modals = []; closeModal(); S.rank = 5; ['forest','mountain','valley','snow','desert','grave','volcano','roots','swamp','barren'].forEach(f => { S.fields[f].best = 10; }); S.fields.plains.found = true; S.fields.forest.cleared = true; S.unlocked = ALL_FIELDS.slice(); 1")
    if url: pg.evaluate("u => window.__EV('MAP_CV = ' + JSON.stringify(u) + '; 1')", url)
    EV("menuOpen('map'); renderPanel(true); 1"); pg.wait_for_timeout(600)
    for _ in range(3):
        EV("S.modals = []; closeModal(); 1"); pg.wait_for_timeout(350)
    pg.evaluate("() => document.querySelector('#panel').scrollTo(0, 0)"); pg.wait_for_timeout(200)
    el = pg.locator('.map-wrap').first
    el.screenshot(path=sys.argv[1])
    print('errors', errs[:3]); br.close()
