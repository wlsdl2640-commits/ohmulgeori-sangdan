"""시험 장면 여럿: 각 장면 JS(setup)를 돌린 뒤 무대를 n장 찍는다 — python3 scen70.py <폴더>"""
import sys, os, json, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'; OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
BASE = r"""
  const mk = (c, i, w, lv) => { const a = makeAdv({ cls: c, lv }); a.id = 900 + i; a.status = 'idle'; a.wxt = null; a.eq.weapon = makeGear(w, 2, 1); return a; };
  const lv = %LV%, war = mk('warrior', 0, 'sword', lv); war.eq.off = makeGear('shield', 2, 1);
  const team = [war, mk('mage', 1, 'staff', lv), mk('cleric', 2, 'mace', lv), mk('archer', 3, 'bow', lv)];
  team.forEach(a => { a.hp = derive(a).maxHp; a.mp = derive(a).maxMp; a.fat = 0; });
  S.advs = team.slice(); if (!S.parties.length) S.parties.push(newParty('1팀', []));
  const p = S.parties[0]; p.members = team.map(a => a.id); p.pet = null; p.wagon = null; p.safe = false; p.auto = false; S.view = p.id;
  S.fields.plains = S.fields.plains || {}; S.fields.plains.best = 50;
  const r = startExp(p, 'plains'); if (r) return 'start: ' + r;
  const e = p.exp; e.stage = %STAGE%; e.pos = 10; e.encs = [40, 200, 320]; e.ei = 0; e.next = null; e.foes = [];
  S.speed = 1; openBattle();
"""
SC = {
  'boss': (50, 46, r"""const ro = rollFoes; rollFoes = (e2, idx, ex) => { if (e2 !== e) return ro(e2, idx, ex); const f = fieldBoss(FIELDS.plains, 50, 30); return [f, foeFrom('boar', 30)]; }; S.t = 0.45 * DAY_SEC + DAY_SEC * 3;""", 7000, 6),
  'night': (30, 30, r"""const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? ['scarecrow', 'wolf', 'boar'].map(id => foeFrom(id, 18)) : ro(e2, idx, ex)); S.t = 0.95 * DAY_SEC + DAY_SEC * 3;""", 6000, 5),
  'camp': (20, 20, r"""S.t = 0.92 * DAY_SEC + DAY_SEC * 3; startCamp(p, e); e.foes = []; e.next = null;""", 1500, 3),
  'die': (30, 8, r"""const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? ['aboar', 'aboar', 'boar'].map(id => foeFrom(id, 30)) : ro(e2, idx, ex)); S.t = 0.45 * DAY_SEC + DAY_SEC * 3; war.hp = 30;""", 9000, 8),
}
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for name, (stage, lv, extra, ms, n) in SC.items():
        if len(sys.argv) > 2 and name not in sys.argv[2:]: continue
        pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e.stack)[:900]))
        pg.goto('file://' + SP + '/hd70/play.html'); pg.wait_for_timeout(1200)
        pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
        for _ in range(25):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
            break
        for _ in range(20):
            if pg.evaluate("() => window.__EV('!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6)')"): break
            pg.wait_for_timeout(300)
        js = '(() => {' + BASE.replace('%LV%', str(lv)).replace('%STAGE%', str(stage)) + extra + " return 'ok'; })()"
        print(name, pg.evaluate("s => window.__EV(s)", js))
        step = ms // n
        for i in range(n):
            pg.wait_for_timeout(step)
            u = pg.evaluate("() => window.__EV('V.off.toDataURL()')")
            Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).save(f'{OUT}/{name}_{i}.png')
        print('  errors', errs[:4]); pg.close()
    br.close()
