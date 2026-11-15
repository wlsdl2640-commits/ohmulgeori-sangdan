"""기본 공격 실행(휘두르기 붙잡기) 화면 확인 — 내 확인, 시험 묶음 아님: python3 swing.py <출력 폴더>
   전사 · 궁수 · 마법사 · 성직자 Lv30 파티를 평원에 보내고 1배속으로 그대로 돌리며 전투 창을 0.1초마다 찍는다 + swing · hit 사건 때를 남긴다"""
import json, sys, os
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
h = open('/home/claude/game62/dist/play.html', encoding='utf-8').read()
BOOT = "if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();\n"
HOOK = OUT + '/play_vis.html'; open(HOOK, 'w', encoding='utf-8').write(h.replace(BOOT, BOOT + "window.__EV = s => eval(s);\n"))
def skip(pg):
    for _ in range(16):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(140); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(140); continue
        break
SETUP = r"""(() => {
  S.gold = 9e7; S.speed = 1;
  const mk = (cls, lv, name, eq) => { const a = makeAdv({ cls, lv, name }); for (const [sl, b, t, q] of eq) a.eq[sl] = makeGear(b, t, q == null ? 3 : q); a.rank = 2; S.advs.push(a); return a.id; };
  const ids = [mk('warrior', 6, '전사', [['weapon', 'sword', 0]]), mk('archer', 6, '궁수', [['weapon', 'bow', 0], ['ammo', 'arrows', 0]]), mk('mage', 6, '마법', [['weapon', 'staff', 0]]), mk('cleric', 6, '성직', [['weapon', 'mace', 0]])];
  window.__LOGV = []; const ev0 = ev; ev = function (e, k, x) { if (k === 'swing' || (k === 'hit' && x.b)) window.__LOGV.push([k, x.s, Math.round(V.lastF), x.w || 0]); return ev0.apply(this, arguments); };
  const p = S.parties[0]; p.members = ids; const r = startExp(p, 'plains'); S.modals = []; return { ids, r, exp: !!p.exp };
})()"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + HOOK); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
    print(EV(SETUP)); skip(pg)
    EV("typeof openBattle === 'function' ? openBattle(S.parties[0].id) : 0"); pg.wait_for_timeout(500)
    print(EV("(() => { const p = S.parties[0]; let i = 0; for (; i < 600 && p.exp && !(p.exp.foes && p.exp.foes.length); i++) step(0.2); S.modals = []; return { i, exp: !!p.exp, foes: p.exp ? p.exp.foes.length : -1, area: p.exp && p.exp.area }; })()")); skip(pg)
    T = []
    for k in range(260):
        pg.wait_for_timeout(40)
        T.append(EV("Math.round(V.lastF)")); pg.locator('#bcv').screenshot(path=f'{OUT}/f{k:03d}.png')
    json.dump(T, open(f'{OUT}/times.json', 'w'))
    print(json.dumps(EV("({ n: window.__LOGV.length, evs: S.parties[0].exp ? S.parties[0].exp.ev.slice(-12).map(x => [x.type, x.s, x.w || 0, x.b || 0]) : [], evsrc: String(ev).slice(0, 60), log: window.__LOGV.slice(0, 60) })")))
    print('page errors:', errs[:8]); br.close()
