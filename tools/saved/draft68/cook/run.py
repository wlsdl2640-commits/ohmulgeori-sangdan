"""요리 화면 시안 찍기 — python3 run.py <출력 폴더> [still|gif] [dpr]"""
import json, sys, os
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v68/'
SRC = '/home/claude/game62/dist/play.html'; HOOK = D + 'play_ev68.html'
h = open(SRC, encoding='utf-8').read()
BOOT = "if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();\n"
open(HOOK, 'w', encoding='utf-8').write(h.replace(BOOT, BOOT + "window.__EV = s => eval(s);\n"))
out = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else 'still'; dpr = float(sys.argv[3]) if len(sys.argv) > 3 else 1
os.makedirs(out, exist_ok=True)
ico = json.load(open(D + 'ing/icons68.json'))
code = open(D + 'cook/cook68.js', encoding='utf-8').read()
TL = """D68.EV.push({t:0.5,a:'add',k:'hg_potato'},{t:1.35,a:'add',k:'hg_carrot'},{t:2.2,a:'add',k:'raw_meat'},{t:3.05,a:'add',k:'raw_meat'},{t:4.0,a:'rem',i:1},{t:5.0,a:'add',k:'hg_carrot'},
{t:6.0,a:'cook',out:'food_stew',name:'고기 스튜',need:'날고기 2 · 하르겐 감자 · 하르겐 당근',fx:'공격력 +12% · 최대 HP +5%'});"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=dpr)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + HOOK); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    pg.evaluate("ico => { window.__ICO68 = ico; }", ico)
    pg.evaluate(f"async () => {{ window.__EV({json.dumps(code)}); await D68.prep(); D68.setup(); {TL} }}")
    pg.wait_for_timeout(300)
    clip = {'x': 0, 'y': 186, 'width': 412, 'height': 660}
    if mode == 'still':
        for t in (0.3, 0.86, 1.06, 3.3, 4.2, 4.55, 6.7, 7.9):
            pg.evaluate(f"D68.render({t})"); pg.wait_for_timeout(60)
            pg.screenshot(path=f'{out}/s_{t:.2f}.png', clip=clip)
    elif mode == 'fail':
        pg.evaluate("D68.EV.length = 0; D68.EV.push({t:0.2,a:'add',k:'raw_meat'},{t:0.25,a:'add',k:'egg_none'},{t:0.3,a:'add',k:'sr_chili'},{t:1.4,a:'cook',out:'food_sus',name:'',need:'날고기 · 무정란 · 모래 고추',fx:'효과 없음 · 펫 먹이로 줄 수 있어요'})")
        pg.evaluate("D68.render(3.6)"); pg.wait_for_timeout(80)
        pg.evaluate("(() => { const r = document.querySelector('.d68res'); r.querySelector('.rib').textContent = '레시피에 없는 조합…'; r.querySelector('.rib').style.background = '#5a5a66'; r.querySelector('.sub.muted').innerHTML = '솥에서 낯익은 냄새가 나요 — <b>어떤 요리와 재료 2가지가 같아요</b>'; })()")
        pg.screenshot(path=f'{out}/fail.png', clip=clip)
    else:
        fps = 15; n = int(9.4 * fps)
        for i in range(n):
            pg.evaluate(f"D68.render({i / fps})"); pg.wait_for_timeout(15)
            pg.screenshot(path=f'{out}/f_{i:03d}.png', clip=clip)
    print('errors:', errs[:5])
    br.close()
