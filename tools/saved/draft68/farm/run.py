"""재배소 시안 찍기 — python3 run.py <출력 폴더>"""
import json, sys, os
from playwright.sync_api import sync_playwright
D = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v68/'
HOOK = D + 'play_ev68.html'
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
code = open(D + 'farm/farm68.js', encoding='utf-8').read()
CHIPS = """(cur) => {
  let el = document.querySelector('#d68chips');
  if (!el) { el = document.createElement('div'); el.id = 'd68chips'; document.body.appendChild(el);
    const css = document.createElement('style'); css.textContent = '#d68chips{position:fixed;left:0;right:0;display:flex;gap:6px;justify-content:center;z-index:9;padding:0 8px}#d68chips .pchip.lock{opacity:.72;border-style:dashed}'; document.head.appendChild(css); }
  const pb = document.querySelector('#placebar').getBoundingClientRect(); el.style.top = (pb.top - 40) + 'px';
  const H = FARM68.houses;
  el.innerHTML = [0, 1, 2].map(i => { const h = H[i]; if (!h) return '<button type="button" class="pchip lock">＋ 3동 짓기</button>';
    const ready = h.plots.filter(p => p[0] && p[1] === 2).length; return `<button type="button" class="pchip${i === cur ? ' on' : ''}"><i class="dot ${ready ? 'go' : ''}"></i>재배소 ${i + 1}${ready ? ' · ' + ready : ''}</button>`; }).join('');
}"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + HOOK); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    EV = lambda js: pg.evaluate("s => window.__EV(s)", js)
    EV("S.modals = []; { const m = document.querySelector('#modal'); if (m) m.style.display = 'none'; } S.bld.pen = 3; S.bld.kitchen = 2; S.bld.alchemy = 1; 1")
    print(pg.evaluate(f"() => window.__EV({json.dumps(code)})"))
    for name, dp, cur in (('day1', 0.42, 0), ('night1', 0.93, 0), ('day2', 0.55, 1)):
        EV(f"S.t = Math.floor(S.t / 180) * 180 + 180 + {dp} * 180; FARM68.cur = {cur}; hqGo('farm0', true); if (HQ.shells && HQ.shells.clear) HQ.shells.clear(); 1")
        pg.wait_for_timeout(900)
        EV(f"({CHIPS})({cur}); 1")
        pg.wait_for_timeout(200)
        pg.screenshot(path=f'{out}/{name}.png')
    print('errors:', errs[:5])
    br.close()
