"""W96 함수들을 훅 페이지에서 돌려 결과를 JSON으로 저장: python3 run96.py <페이지> <출력 폴더>"""
import json, sys, os
from playwright.sync_api import sync_playwright
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'w96.js'), encoding='utf-8').read()
MK = ['down', 'up', 'side', 'thrust', 'bash', 'block', 'raise', 'guard', 'salute', 'taunt', 'parry', 'ready', 'toss']
SK = ['bash', 'taunt', 'ironwall', 'ironskin', 'sweep', 'berserk', 'riposte', 'resolve', 'earthsplit', 'shockwave', 'warcry', 'guardian', 'titanblow']
ACT = ['bash', 'taunt', 'ironwall', 'sweep', 'berserk', 'riposte', 'resolve', 'earthsplit', 'shockwave', 'warcry', 'titanblow']
DT = 0.04; TAUS = [round(-0.12 + i * DT, 3) for i in range(int(1.9 / DT))]
CROP = [60, 200, 410, 200]
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
    pg.evaluate("s => window.__EV(s)", JS)
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    json.dump(ev("JSON.stringify(W96.look(0))") and json.loads(ev("JSON.stringify(W96.look(0))")), open(os.path.join(OUT, 'look.json'), 'w'))
    json.dump(json.loads(ev(f"JSON.stringify(W96.mots({json.dumps(MK)}))")), open(os.path.join(OUT, 'mots.json'), 'w'))
    json.dump(json.loads(ev(f"JSON.stringify(W96.icons({json.dumps(SK)}))")), open(os.path.join(OUT, 'icons.json'), 'w'))
    for sid in ACT:
        r = json.loads(ev(f"JSON.stringify(W96.scene({json.dumps(sid)}, {json.dumps(TAUS)}, {json.dumps(CROP)}))"))
        r['taus'] = TAUS; json.dump(r, open(os.path.join(OUT, f'sk_{sid}.json'), 'w')); print(sid, len(r['frames']), 'hitAt', round(r['hitAt'], 3), r['mk'], 'cast', r['cast'])
    print('errors', errs[:4]); br.close()
