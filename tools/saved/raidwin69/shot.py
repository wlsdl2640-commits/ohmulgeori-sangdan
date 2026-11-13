"""레이드 원정대 창 시안 찍기 (시안 전용)"""
import json
from playwright.sync_api import sync_playwright
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v87/raid/'
PAGE = SP + '/v87/form/play_form.html'
MOCK = open(D + 'raidmock.js', encoding='utf-8').read()
def skip(pg):
    for _ in range(16):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
    EV(MOCK); print('setup', EV("RMOCK.setup()")); skip(pg); EV("S.modals = []"); pg.wait_for_timeout(700); skip(pg)
    pg.screenshot(path=D + 'ui_field.png', clip={'x': 0, 'y': 0, 'width': 412, 'height': 300})
    print('raid', EV("RMOCK.raid()")); pg.wait_for_timeout(900); skip(pg)
    pg.screenshot(path=D + 'ui_raid.png', clip={'x': 0, 'y': 0, 'width': 412, 'height': 300})
    print('pip box', EV("(() => { const r = $('pip').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; })()"))
    EV("(() => { const st = document.createElement('style'); st.id = 'wide'; st.textContent = '.pip{width:330px !important}'; document.head.appendChild(st); sizeView && sizeView(); })()"); pg.wait_for_timeout(700)
    pg.screenshot(path=D + 'ui_raid_wide.png', clip={'x': 0, 'y': 0, 'width': 412, 'height': 300})
    print('pip wide', EV("(() => { const r = $('pip').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; })()"))
    EV("document.getElementById('wide').remove(); sizeView && sizeView()"); pg.wait_for_timeout(300)
    EV("openBattle()"); pg.wait_for_timeout(800)
    pg.locator('#bcv').screenshot(path=D + 'b_raid.png')
    for i in range(4):
        EV(f"RMOCK.solo({i})"); pg.wait_for_timeout(500)
        pg.locator('#bcv').screenshot(path=D + f'b_solo{i}.png')
    print('errors', errs[:5]); br.close()
