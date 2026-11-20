from playwright.sync_api import sync_playwright
SP='/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
with sync_playwright() as pw:
    br=pw.chromium.launch()
    for name,(w,h) in (('land',(915,412)),('port',(412,880))):
        pg=br.new_page(viewport={'width':w,'height':h}, device_scale_factor=1); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
        pg.goto('file://'+SP+'/hd70/play.html'); pg.wait_for_timeout(1000); pg.locator('button',has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
        for _ in range(25):
            sk=pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
            mb=pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
            break
        ev=lambda s: pg.evaluate("s => window.__EV(s)", s)
        ev("""(() => { const team=[0,1,2].map(i=>{const a=makeAdv({cls:['warrior','archer','cleric'][i],lv:14}); a.status='idle'; return a;}); S.advs=team.slice(); if(!S.parties.length) S.parties.push(newParty('1팀',[])); const p=S.parties[0]; p.members=team.map(a=>a.id); S.fields.plains.best=23; menuOpen('map'); })()""")
        pg.wait_for_timeout(600); pg.screenshot(path=SP+'/lab_%s.png'%name)
        if name=='land':
            pg.locator('.lfl', has_text='5층').first.click(); pg.wait_for_timeout(300)
            box=pg.locator('#lfls'); bb=box.bounding_box(); pg.mouse.move(bb['x']+50,bb['y']+50); pg.mouse.wheel(0,400); pg.wait_for_timeout(300)
            print('scroll', ev("document.getElementById('lfls').scrollTop"), ev("UI.labFloor")); pg.screenshot(path=SP+'/lab_land2.png')
            pg.locator('[data-act=labgo]').click(); pg.wait_for_timeout(500); print('dest', ev("JSON.stringify([S.parties[0].dest, S.parties[0].start, labStart('plains', 40), labStart('plains', 9)])")); pg.screenshot(path=SP+'/lab_exp.png')
        print(name, errs); pg.close()
    br.close()
