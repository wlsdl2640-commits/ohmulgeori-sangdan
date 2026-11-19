"""40칸 전사를 넣은 뒤 화면 확인 (시험 묶음 아님): 모험가 창(영웅 무대) · 모험가 목록 초상 · 원정대 창 · 길드 앞
   python3 ui_mid.py <훅 페이지> <폴더> [기기 배율 = 3]"""
import sys, os
from playwright.sync_api import sync_playwright
PAGE, OUT = os.path.abspath(sys.argv[1]), sys.argv[2]; DPR = float(sys.argv[3]) if len(sys.argv) > 3 else 3; os.makedirs(OUT, exist_ok=True)
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=DPR); errs = []
    pg.on('pageerror', lambda e: errs.append(str(getattr(e, 'stack', e))[:600]))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(1200)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    for _ in range(40):
        if ev("!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6 && ['wolf', 'scarecrow', 'boar', 'aboar'].every(id => !HD70_DATA.mon[id].big || HD.mon[id].f2))"): break
        pg.wait_for_timeout(300)
    print('그림', ev("JSON.stringify({ war: HD70_DATA.war.hs, front: [HD.war.front.m.w, HD.war.front.m.h, HD.war.front.m.ay], mon: Object.keys(HD.mon).map(id => id + ':' + HD.mon[id].m.hs + (HD.mon[id].f2 ? '+big' : '')) })"))
    ids = ev(r"""(() => { const mk = (c, i, w) => { const a = makeAdv({ cls: c, lv: 20 }); a.id = 980 + i; a.status = 'idle'; a.eq.weapon = makeGear(w, 2, 1); S.advs.push(a); return a; };
      const w1 = mk('warrior', 0, 'sword'), w2 = mk('warrior', 1, 'sword'), m = mk('mage', 2, 'staff'), r = mk('archer', 3, 'bow'); w1.eq.off = makeGear('shield', 2, 1); w1.skills = ['bash', 'taunt', 'ironwall'];
      const p = S.parties[0] || (S.parties.push(newParty('1팀', [])), S.parties[0]); p.members = [w1.id, w2.id, m.id, r.id]; return [w1.id, m.id]; })()""")
    pg.wait_for_timeout(900); pg.screenshot(path=f'{OUT}/town.png')
    ev(f"openAdv({ids[0]})"); pg.wait_for_timeout(700); pg.screenshot(path=f'{OUT}/hero_war.png')
    ev("(() => { closeWins(); return 1; })()"); ev(f"openAdv({ids[1]})"); pg.wait_for_timeout(700); pg.screenshot(path=f'{OUT}/hero_mage.png')
    ev("(() => { closeWins(); menuGo('adv'); return 1; })()"); pg.wait_for_timeout(700); pg.screenshot(path=f'{OUT}/list.png')
    ev("(() => { closeWins(); menuGo('exp'); return 1; })()"); pg.wait_for_timeout(700); pg.screenshot(path=f'{OUT}/exp.png')
    print('errors', errs[:5]); br.close()
