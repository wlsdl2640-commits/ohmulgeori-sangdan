"""빌드 70 저장 → 새 빌드 불러오기 확인 (시험 묶음 아님): 예전 빌드에서 전사가 낀 파티를 평원에 보내 싸우는 중에 저장하고, 그 저장을 새 빌드에서 불러와 오류 · 알림 · 그리기를 본다"""
import sys, json
from playwright.sync_api import sync_playwright
OLD, NEW, OUT = sys.argv[1], sys.argv[2], sys.argv[3]; KEY = 'paros-sangdan:v1'
def boot(pg):
    pg.wait_for_timeout(1200)
    b = pg.locator('button', has_text='문 열기')
    if b.count() and b.first.is_visible(): b.first.click(); pg.wait_for_timeout(1500)
def skip(pg, titles):
    for _ in range(30):
        t = pg.locator('#m-title')
        if t.count() and t.first.is_visible(): titles.append(t.first.inner_text())
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(150); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(150); continue
        break
with sync_playwright() as pw:
    br = pw.chromium.launch()
    # ── 1. 예전 빌드에서 저장 만들기
    cx = br.new_context(viewport={'width': 412, 'height': 880}); pg = cx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(getattr(e, 'stack', e))[:600]))
    pg.goto('file://' + OLD); boot(pg); skip(pg, [])
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    r = ev(r"""(() => {
      const mk = (c, i, w, lv) => { const a = makeAdv({ cls: c, lv }); a.status = 'idle'; a.eq.weapon = makeGear(w, 2, 1); S.advs.push(a); return a; };
      const war = mk('warrior', 0, 'sword', 12); war.eq.off = makeGear('shield', 2, 1); war.skills = ['bash', 'taunt', 'sweep'];
      const team = [war, mk('mage', 1, 'staff', 12), mk('cleric', 2, 'mace', 12), mk('archer', 3, 'bow', 12)];
      team.forEach(a => { a.hp = derive(a).maxHp; a.mp = derive(a).maxMp; });
      if (!S.parties.length) S.parties.push(newParty('1팀', []));
      const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id;
      const r = startExp(p, 'plains'); if (r) return 'start: ' + r;
      for (let i = 0; i < 3000 && !(p.exp && p.exp.foes.length); i++) step(0.1);      // 첫 싸움이 붙을 때까지
      for (let i = 0; i < 15; i++) step(0.1);
      S.day = Math.max(S.day || 1, 3);
      saveGame();
      const e = p.exp; return JSON.stringify({ v: S.v, stage: e && e.stage, foes: e && e.foes.map(f => f.id), field: FIELDS.plains.name, flags71: S.flags.v71 || 0, day: today() });
    })()""")
    print('old:', r, 'errors', errs[:3])
    save = pg.evaluate("k => localStorage.getItem(k)", KEY); print('save', len(save) // 1024, 'KB'); cx.close()
    # ── 2. 새 빌드에서 불러오기
    cx = br.new_context(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    cx.add_init_script("(() => { try { if (!localStorage.getItem(%s)) localStorage.setItem(%s, %s); } catch (_) {} })()" % (json.dumps(KEY), json.dumps(KEY), json.dumps(save)))
    pg = cx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(getattr(e, 'stack', e))[:600]))
    pg.goto('file://' + NEW); pg.wait_for_timeout(1500)
    names = [b.inner_text() for b in pg.locator('button').all() if b.is_visible()][:8]; print('first screen buttons:', names)
    for label in ['이어하기', '계속', '문 열기']:
        b = pg.locator('button', has_text=label)
        if b.count() and b.first.is_visible(): b.first.click(); pg.wait_for_timeout(1500); print('clicked', label); break
    titles = []; skip(pg, titles); print('modals:', titles)
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    for _ in range(30):
        if ev("!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6)"): break
        pg.wait_for_timeout(300)
    print('new:', ev(r"""(() => { const p = S.parties[0], e = p.exp; return JSON.stringify({ v: S.v, v71: S.flags.v71, field: FIELDS.plains.name, exp: !!e, stage: e && e.stage, foes: e && e.foes.map(f => f.id + ':' + Math.round(f.hp)), team: teamOf(p).map(a => a.cls + ' ' + Math.round(a.hp)), war: hdWarOn(teamOf(p)[0]) }); })()"""))
    ev("openBattle()"); pg.wait_for_timeout(2500); pg.screenshot(path=OUT + '/upg_battle.png')
    pg.wait_for_timeout(6000); pg.screenshot(path=OUT + '/upg_battle2.png')
    print('after 8s:', ev(r"""(() => { const p = S.parties[0], e = p.exp; return JSON.stringify({ exp: !!e, stage: e && e.stage, pos: e && Math.round(e.pos), foes: e && e.foes.length, log: V.log.slice(-3).map(x => (x.t || x) + '').join(' / ').slice(0, 200) }); })()"""))
    print('errors', errs[:5]); br.close()
