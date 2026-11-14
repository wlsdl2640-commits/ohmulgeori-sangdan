"""천둥새 시안을 실제 레이드 싸움(네 파티)에: python3 scene.py <훅 페이지> <tb.json> <출력 폴더> [키…]"""
import json, sys, os
from playwright.sync_api import sync_playwright
PAGE, JS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]; KEYS = sys.argv[4:] or ['A', 'B', 'C']
TB = json.load(open(JS)); os.makedirs(OUT, exist_ok=True)
H83 = open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/h83.js', encoding='utf-8').read()
SETUP = H83 + r'''
;(() => {
  H.fresh(); S.rank = 6; S.bld.airfield = 1; S.speed = 1;
  Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; });
  const comps = [['paladin', 'bloodlord', 'hawkeye', 'archbishop'], ['champion', 'shadowlord', 'archmage', 'physician'], ['arcblade', 'bladedancer', 'kaijuhunter', 'archbishop'], ['paladin', 'kageninja', 'elementlord', 'inquisitor']];
  S.parties = comps.map((L, i) => { const p = newParty(`${i + 1}팀`, L.map(c => H.adv(c, 172, { slv: 3, sm: 3 }).id)); p.sup = {}; p.auto = false; p.safe = false; return p; });
  S.raid = { list: [newRaid('griffon'), newRaid('behemoth')], from: today() };
  S.modals = []; S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  S.view = S.parties[0].id; UI.dirty = true; renderChips();
  return 'ok';
})()
'''
SWAP = r"""((g, pal) => {
  PXRAID.raidgriffon = { g, pal };
  const rows = pxRows(g); PXG_DIM.raidgriffon = [rows[0].length * 2, rows.length * 2];
  MONS.raidgriffon.W = rows[0].length * 2; MONS.raidgriffon.H = rows.length * 2; PXC.clear(); return 'ok';
})"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(900)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    def skip():
        for _ in range(20):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
            break
    skip()
    EV = lambda code: pg.evaluate("s => window.__EV(s)", code)
    print(EV(SETUP)); EV("S.modals = []; S.achv = S.achv || {}; ACHV.forEach(A => { S.achv[A.id] = S.achv[A.id] || 1; }); 'ok'"); pg.wait_for_timeout(300); skip()
    EV(f"{SWAP}({json.dumps(chr(10) + TB[KEYS[0]] + chr(10))}, {json.dumps(TB['pal'][KEYS[0]])})")
    print(EV("raidLaunch && (UI.raidSel = { griffon: S.parties.slice(0, 4).map(p => p.id) }, raidLaunch('griffon')), 'go'"))
    print(EV("for (let i = 0; i < 600 && !S.parties.slice(0,4).every(p => p.exp && p.exp.foes.length); i++) step(0.1); for (let i = 0; i < 30; i++) step(0.1); S.parties.slice(0,4).map(p => p.exp ? p.exp.mode + ':' + p.exp.foes.length : '-').join(',')"))
    EV("showWin(false); UI.stack = []; S.view = S.parties[0].id; openBattle(); 'ok'"); pg.wait_for_timeout(900)
    for k in KEYS:
        EV(f"{SWAP}({json.dumps(chr(10) + TB[k] + chr(10))}, {json.dumps(TB['pal'][k])})"); pg.wait_for_timeout(700)
        pg.locator('#bcv').screenshot(path=f'{OUT}/scene_{k}.png')
    print('errors:', errs[:5]); b.close()
