"""해룡기수 · 해룡 펫 게임 화면 확인: python3 shot_rider.py <훅 페이지> <출력 폴더>
해룡기수(해룡 모습 B · Lv170) + 성기사 · 대주교 · 대마도사 파티에 새끼 해룡(C) 펫을 데리고 용암 화산 전투 · 영웅 창 앞모습 · 다 자란 펫(D) 전투."""
import json, sys, os
from playwright.sync_api import sync_playwright
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
H83 = open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/h83.js', encoding='utf-8').read()
SETUP = H83 + r'''
;((look, petKind, stage) => {
  H.fresh(); S.speed = 1; S.rank = 6; Object.values(S.fields).forEach(f => { f.cleared = f.cleared || 1; });
  Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; });
  const r = H.adv('seadragoon', 170, { sk: ['tidalshot', 'bubbleprison', 'deepblood', 'tsunami', 'abyssroar', 'searoyal'], slv: 3, sm: 3 }); r.name = '마리나'; r.ride = { sea: { look, name: '방울', lv: 30 } };
  const team = [r, H.adv('paladin', 170, { slv: 3, sm: 3 }), H.adv('archbishop', 170, { slv: 3, sm: 3 }), H.adv('archmage', 170, { slv: 3, sm: 3 })];
  S.bld.pen = 3; const pet = newPet(petKind); pet.lv = stage ? 30 : 12; pet.stage = stage; S.pets.push(pet);
  const p = newParty('1팀', team.map(a => a.id)); S.parties = [p]; p.pet = pet.id; p.sup = {}; p.auto = false; p.safe = false;
  S.modals = []; S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  p.dest = 'volcano'; const why = startExp(p, 'volcano'); if (why) return why;
  S.view = p.id; UI.dirty = true; renderChips();
  for (let i = 0; i < 2000 && !(p.exp && p.exp.foes && p.exp.foes.length); i++) step(0.1);
  for (let i = 0; i < 60; i++) step(0.1);
  return 'ok ' + r.id;
})'''
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=2)
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
    for n, (look, pk, stg) in enumerate((('B', 'seadragon_c', 0), ('D', 'seadragon_d', 1))):
        print(EV(f"{SETUP}({json.dumps(look)}, {json.dumps(pk)}, {stg})"))
        EV("S.modals = []; showWin(false); UI.stack = []; 'ok'"); skip()
        EV("openBattle(); 'ok'"); pg.wait_for_timeout(2200); skip(); pg.wait_for_timeout(500)
        pg.locator('#bcv').screenshot(path=f'{OUT}/battle{n + 1}.png')
    EV("showWin(false); UI.stack = []; openAdv(S.advs.find(a => a.cls === 'seadragoon').id); 'ok'"); pg.wait_for_timeout(1500); skip()
    pg.screenshot(path=f'{OUT}/hero.png')
    print('errors', errs[:5]); br.close()
