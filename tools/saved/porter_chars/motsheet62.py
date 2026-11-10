"""채찍 · 정글칼 동작 장 판 → W_mot.png · M_mot.png (python3 motsheet62.py)"""
import sys, pathlib, base64
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import war
from playwright.sync_api import sync_playwright
D = pathlib.Path(__file__).parent; W = D.parent
(D / '_cg1.js').write_text((W / 'cg1.js').read_text().replace('window.WAR_SHEET', 'window.WAR_SHEET_CG'))
war.build(['rg1.js', 'rg2.js', 'tk1.js', 'tk2.js', 'mot/_cg1.js', 'mot/mot62.js', 'mot/motsheet62.js'])
WHIP = [['내려 후려치기', 'conestoga', 'whip', 'wcrack'], ['옆으로 후려치기', 'conestoga', 'whip', 'wside'], ['올려 채기', 'conestoga', 'whip', 'wflick'],
        ['머리 위로 돌려 치기', 'conestoga', 'whip', 'wtwirl'], ['채찍 치켜들기', 'conestoga', 'whip', 'wraise'], ['캐러밴마스터', 'caravanmaster', 'whip', 'wcrack']]
MACH = [['내려베기', 'scout', 'machete', 'down'], ['올려베기', 'scout', 'machete', 'up'], ['횡베기', 'scout', 'machete', 'side'],
        ['난도질', 'scout', 'machete', 'hack'], ['덤불 베기', 'scout', 'machete', 'mchop'], ['탐험가', 'pathfinder', 'machete', 'mchop']]
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((W / 'war.html').as_uri()); pg.wait_for_timeout(400); pg.evaluate('document.fonts.ready')
    for rows, out in ((WHIP, 'W_mot.png'), (MACH, 'M_mot.png')):
        u = pg.evaluate('([r]) => MOT_SHEET(r, 3)', [rows]); (D / out).write_bytes(base64.b64decode(u.split(',')[1])); print(out)
    print('errors', errs[:5]); b.close()
