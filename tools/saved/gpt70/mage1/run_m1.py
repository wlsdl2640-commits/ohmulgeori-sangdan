"""마법사 1차 지금 그림을 훅 페이지에서 뽑는다: python3 run_m1.py <훅 페이지> <출력 폴더>  → look.json · mots.json · info.json"""
import json, sys, os
from playwright.sync_api import sync_playwright
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'm1.js'), encoding='utf-8').read()
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860}); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(PAGE)); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200)
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    if len(sys.argv) > 4: ev('window.M1CFG = ' + json.dumps({'cls': sys.argv[3], 'wpn': sys.argv[4]}))   # 다른 직업: python3 run_m1.py <페이지> <폴더> archer bow
    ev(JS)
    for k in ('look', 'mots', 'info'): json.dump(json.loads(ev(f"JSON.stringify(M1.{k}())")), open(os.path.join(OUT, k + '.json'), 'w'), ensure_ascii=False)
    print('errors', errs[:4]); br.close()
