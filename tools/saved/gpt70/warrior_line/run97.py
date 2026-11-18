import json, sys, os
from playwright.sync_api import sync_playwright
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'w97.js'), encoding='utf-8').read()
GEAR = ['sword', 'club', 'axe', 'gladius', 'dagger', 'trident', 'mace', 'lance', 'great', 'rs_fire', 'rs_ice', 'rs_light', 'rs_poison', 'manasword',
        'shield', 'kite', 'tower', 'buckler', 'cross', 'ether',
        'larmor', 'lpants', 'hvarmor', 'hvpants', 'plate', 'ppants', 'leather', 'arenamail', 'pgloves', 'pboots']
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(PAGE)); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    ev(JS)
    json.dump(json.loads(ev("JSON.stringify(W97.jobs())")), open(os.path.join(OUT, 'jobs.json'), 'w'), ensure_ascii=False)
    G = {b: json.loads(ev(f"JSON.stringify(W97.gear({json.dumps(b)}))")) for b in GEAR}
    json.dump(G, open(os.path.join(OUT, 'gear.json'), 'w'), ensure_ascii=False)
    for b, g in G.items(): print(b, g['name'], len(g['items']), 'nImg', g['nImg'], 'big', sum(1 for i in g['items'] if i['big']), [(i['name'], i['lv'], i['note']) for i in g['items'][:2]], [(i['name'], i['lv'], i['note']) for i in g['items'][-2:]])
    print('errors', errs[:4]); br.close()
