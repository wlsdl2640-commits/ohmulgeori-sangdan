"""레이드 원정대 창(R2 네 칸) 확인 그림 (빌드 69 실제 게임): python3 shot69r2.py <훅 페이지> <출력 폴더> [너비] [DPR] — H83 경로는 세션 작업 폴더 v83/h83.js (새 세션은 경로만 바꿔 쓴다)"""
import sys, os
from playwright.sync_api import sync_playwright
page, out = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 412; DPR = float(sys.argv[4]) if len(sys.argv) > 4 else 2
os.makedirs(out, exist_ok=True)
H83 = open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/h83.js', encoding='utf-8').read()
SETUP = H83 + r'''
;(() => {
  H.fresh(); S.rank = 6; S.bld.airfield = 1; S.flags.v69c = 1; S.speed = 1;
  Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; });
  const comps = [
    ['paladin', 'bloodlord', 'hawkeye', 'archbishop', 'conestoga'],
    ['champion', 'shadowlord', 'archmage', 'physician', 'maestro'],
    ['arcblade', 'bladedancer', 'kaijuhunter', 'archbishop', 'pathfinder'],
    ['paladin', 'kageninja', 'elementlord', 'inquisitor', 'caravanmaster'],
    ['knight', 'gladiator', 'sniper', 'priest'],
  ];
  S.parties = comps.map((L, i) => { const p = newParty(`${i + 1}팀`, L.map(c => H.adv(c, 152, { slv: 3, sm: 3 }).id)); p.sup = {}; p.auto = false; p.safe = false; return p; });
  S.raid = { list: [newRaid('kingslime'), newRaid('behemoth')], from: today() };
  S.modals = [];
  S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  S.view = S.parties[0].id; UI.dirty = true; renderChips();
  return 'ok';
})()
'''
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': W, 'height': 860}, device_scale_factor=DPR)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(page)); pg.wait_for_timeout(900)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    def skip():
        for _ in range(20):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
            break
    skip()
    print(pg.evaluate("s => window.__EV(s)", SETUP))
    pg.evaluate("s => window.__EV(s)", "S.modals = []; S.achv = S.achv || {}; ACHV.forEach(A => { S.achv[A.id] = S.achv[A.id] || 1; }); 'ok'")
    pg.wait_for_timeout(500); skip()
    # 1) 원정대 창 · 레이드 탭
    pg.evaluate("s => window.__EV(s)", "UI.expTab = 'raid'; menuOpen('exp'); 'ok'"); pg.wait_for_timeout(600)
    pg.screenshot(path=f'{out}/1_raidtab.png')
    pg.evaluate("s => window.__EV(s)", "UI.raidSel = { kingslime: S.parties.slice(0, 4).map(p => p.id) }; renderPanel(true); 'ok'"); pg.wait_for_timeout(400)
    pg.screenshot(path=f'{out}/2_raidtab_sel.png')
    skip(); pg.locator('[data-act="raidgo"][data-r="kingslime"]').first.click(); pg.wait_for_timeout(500)
    pg.screenshot(path=f'{out}/3_launched.png')
    # 싸움이 붙을 때까지 밀기
    print(pg.evaluate("s => window.__EV(s)", "for (let i = 0; i < 400 && !S.parties.slice(0,4).every(p => p.exp && p.exp.foes.length); i++) step(0.1); for (let i = 0; i < 60; i++) step(0.1); S.parties.slice(0,4).map(p => p.exp ? p.exp.mode + ':' + p.exp.foes.length : '-').join(',')"))
    pg.evaluate("s => window.__EV(s)", "showWin(false); UI.stack = []; renderPanel(true); 'ok'"); pg.wait_for_timeout(300)
    pg.wait_for_timeout(900)
    pg.locator('#pip').screenshot(path=f'{out}/4_page0.png')
    pg.screenshot(path=f'{out}/4_full_page0.png')
    # 밀어 넘기기 (마우스로 끌기)
    bb = pg.locator('#pip').bounding_box()
    x0, y0 = bb['x'] + bb['width'] * 0.7, bb['y'] + bb['height'] * 0.5
    pg.mouse.move(x0, y0); pg.mouse.down(); 
    for k in range(1, 9): pg.mouse.move(x0 - k * 12, y0 + k); pg.wait_for_timeout(16)
    pg.screenshot(path=f'{out}/5_dragging.png')
    pg.mouse.up(); pg.wait_for_timeout(1200)
    print('page', pg.evaluate("s => window.__EV(s)", "RP.page + ' n=' + RP.n + ' ' + $('rh-t').textContent"))
    pg.locator('#pip').screenshot(path=f'{out}/6_page1.png')
    pg.screenshot(path=f'{out}/6_full_page1.png')
    pg.wait_for_timeout(1500)
    pg.locator('#pip').screenshot(path=f'{out}/7_page1_later.png')
    # 칸 누르기 → 전투 창
    bb = pg.locator('#rcv').bounding_box()
    pg.mouse.click(bb['x'] + bb['width'] * 0.75, bb['y'] + bb['height'] * 0.75); pg.wait_for_timeout(800)
    print('view', pg.evaluate("s => window.__EV(s)", "S.view + ' ' + viewParty().name + ' bopen=' + V.bopen"))
    pg.screenshot(path=f'{out}/8_battle_from_quad.png')
    print('errors:', errs[:5]); b.close()
