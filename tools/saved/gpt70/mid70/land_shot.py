import sys
from playwright.sync_api import sync_playwright
SP='/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
with sync_playwright() as pw:
    br=pw.chromium.launch(); pg=br.new_page(viewport={'width':915,'height':412}, device_scale_factor=1); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    pg.goto('file://'+SP+'/hd70/play.html'); pg.wait_for_timeout(1000); pg.locator('button',has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(25):
        sk=pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb=pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    ev=lambda s: pg.evaluate("s => window.__EV(s)", s)
    pg.wait_for_timeout(1500); pg.screenshot(path=SP+'/land_home.png')
    ev("""(() => { const team=[0,1,2].map(i=>{const a=makeAdv({cls:['warrior','archer','cleric'][i],lv:14}); a.status='idle'; return a;}); S.advs=team.slice(); if(!S.parties.length) S.parties.push(newParty('1팀',[])); const p=S.parties[0]; p.members=team.map(a=>a.id); p.safe=false; S.view=p.id; S.t = 0.45 * DAY_SEC + DAY_SEC * 3; startExp(p,'plains'); p.exp.pos=20; })()""")
    pg.wait_for_timeout(5000); pg.screenshot(path=SP+'/land_pip.png')
    ev("openBattle()"); pg.wait_for_timeout(6000); pg.screenshot(path=SP+'/land_battle.png')
    ev("closeWins && closeWins()"); 
    try: ev("V.bopen && $('bw-x').click()")
    except Exception as e: print(e)
    pg.wait_for_timeout(300); pg.locator('#menu-btn').click(); pg.wait_for_timeout(400); pg.screenshot(path=SP+'/land_menu.png')
    pg.locator('.mtile[data-open="adv"]').click(); pg.wait_for_timeout(600); pg.screenshot(path=SP+'/land_win.png')
    print(errs); br.close()
