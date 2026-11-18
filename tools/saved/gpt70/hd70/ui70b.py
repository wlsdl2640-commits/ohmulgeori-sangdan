"""시험 화면 2: 지도 · 원정대 창 · 도감(몬스터) · 숲 원정(옛 배치 그대로인지) — python3 ui70b.py <폴더>"""
import sys, os, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'; OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e.stack)[:600]))
    pg.goto('file://' + SP + '/hd70/play.html'); pg.wait_for_timeout(1200)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    for _ in range(20):
        if ev("!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6)"): break
        pg.wait_for_timeout(300)
    ev("openWin('map')"); pg.wait_for_timeout(600); pg.screenshot(path=f'{OUT}/map.png')
    ev("(() => { closeWins(); return 1; })()"); pg.wait_for_timeout(200)
    ev("openWin('exp')"); pg.wait_for_timeout(600); pg.screenshot(path=f'{OUT}/exp.png')
    ev("(() => { closeWins(); return 1; })()"); pg.wait_for_timeout(200)
    ev("(() => { for (const id of ['rat','rabbit','wolf','scarecrow','boar','aboar']) { dexSeen(id); for (let i = 0; i < 30; i++) dexKill(id); } return 1; })()")
    ev("openWin('dex')"); pg.wait_for_timeout(700); pg.screenshot(path=f'{OUT}/dex.png')
    # 숲 원정: 옛 배치
    ev(r"""(() => { closeWins();
      const mk = (c, i, w) => { const a = makeAdv({ cls: c, lv: 14 }); a.id = 950 + i; a.status = 'idle'; a.eq.weapon = makeGear(w, 1, 1); return a; };
      const war = mk('warrior', 0, 'sword'); war.eq.off = makeGear('shield', 1, 1); const team = [war, mk('mage', 1, 'staff'), mk('cleric', 2, 'mace')];
      S.advs = team.slice(); const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; S.fields.plains = S.fields.plains || {}; S.fields.plains.cleared = 1; S.fields.plains.best = 50;
      const r = startExp(p, 'forest'); openBattle(); return r || 'ok'; })()""")
    pg.wait_for_timeout(5000)
    u = ev('V.off.toDataURL()'); Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).save(f'{OUT}/forest.png')
    print('wide in forest:', ev('V.wide'))
    print('errors', errs[:5]); br.close()
