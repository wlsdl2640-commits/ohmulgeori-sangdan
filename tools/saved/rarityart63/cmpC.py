"""저장소 빌드의 홀로그램이 사용자가 고른 시안 C(sandbox2 RQH 'fsC')와 픽셀까지 같은지 (시험 묶음 아님)"""
import os, base64, io
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright
def sheets(path, mode):
    s = open(path, encoding='utf-8').read(); m = "(() => {\n'use strict';\n"
    open('cmp_tmp.html', 'w', encoding='utf-8').write(s.replace(m, m + "window.__RQ = () => ({ rqArt, gearIconURL, iconURL });\n"))
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(); pg.goto('file://' + os.path.abspath('cmp_tmp.html')); pg.wait_for_timeout(1200)
        out = pg.evaluate("""(mode) => { window.RQH = mode; window.RQD = { 8: 'B' }; const R = window.__RQ(), res = [];
          for (const [u, g] of [[R.gearIconURL({ base: 'sword', t: 12, q: 0 }), 3], [R.gearIconURL({ base: 'robe', t: 13, q: 0 }), 4], [R.iconURL('rune_atk_2'), 5], [R.iconURL('book_taunt'), 6], [R.gearIconURL({ base: 'bow', t: 14, q: 0 }), 7], [R.gearIconURL({ base: 'sword', t: 12, q: 0 }), 7], [R.gearIconURL({ base: 'sword', t: 12, q: 0 }), 8], [R.iconURL('rune_atk_2'), 8], [R.gearIconURL({ base: 'robe', t: 13, q: 0 }), 8]]) {
            const cls = R.rqArt(u, g, 2, 0).match(/k\\d+/)[0];
            const rule = [...document.getElementById('rq-sheets').sheet.cssRules].find(r => r.selectorText === '.rqa.' + cls);
            res.push(rule.style.backgroundImage.slice(5, -2)); }
          return res; }""", mode)
        b.close(); return out
A = sheets('sandbox2/dist/play.html', 'fsC'); B = sheets('/home/claude/game62/dist/play.html', None)
same = []
for a, b in zip(A, B):
    ia = Image.open(io.BytesIO(base64.b64decode(a.split(',', 1)[1]))).convert('RGBA'); ib = Image.open(io.BytesIO(base64.b64decode(b.split(',', 1)[1]))).convert('RGBA')
    same.append(ia.size == ib.size and ImageChops.difference(ia, ib).getbbox() is None)
print('같은가 (영웅 · 전설 · 신화 · 신성 · 우주 ×2 · 창조 ×3):', same)
