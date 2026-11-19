"""시험 화면: 전사 모험가 창(영웅 · 스킬 탭) · 길드 앞 · 야영 · 도감 — python3 ui70.py <폴더>"""
import sys, os, json
from playwright.sync_api import sync_playwright
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'; OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + SP + '/hd70/play.html'); pg.wait_for_timeout(1200)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    def skip():
        for _ in range(25):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
            break
    skip()
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    for _ in range(20):
        if ev("!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6)"): break
        pg.wait_for_timeout(300)
    # 전사 하나 만들어 스킬 몇 개 배운 채로
    aid = ev(r"""(() => { const a = makeAdv({ cls: 'warrior', lv: 30 }); a.id = 990; a.status = 'idle'; a.eq.weapon = makeGear('sword', 2, 1); a.eq.off = makeGear('shield', 2, 1);
      a.skills = ['bash', 'taunt', 'ironwall', 'sweep', 'berserk']; S.advs.push(a); return a.id; })()""")
    ev(f"openAdv({aid})"); pg.wait_for_timeout(500); pg.screenshot(path=f'{OUT}/adv_sum.png')
    t = pg.locator('[data-mact="atab"][data-t="skill"]')
    if t.count(): t.first.click(); pg.wait_for_timeout(500); pg.screenshot(path=f'{OUT}/adv_skill.png', full_page=False)
    ev("closeAllWins ? closeAllWins() : null") if ev("typeof closeAllWins === 'function'") else None
    # 길드 앞 (모험가가 앞모습으로 선다)
    ev("(() => { while (winTop()) closeWin(); return 1; })()") if ev("typeof closeWin === 'function'") else None
    pg.wait_for_timeout(600); pg.screenshot(path=f'{OUT}/town.png')
    # 도감 (몬스터 그림)
    print('errors', errs[:5]); br.close()
