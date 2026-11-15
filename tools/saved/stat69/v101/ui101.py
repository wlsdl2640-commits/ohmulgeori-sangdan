"""빌드 69 밤 화면 글 확인 (내 확인, 시험 묶음 아님): python3 ui101.py <출력 폴더> — 모험가 창 능력치 · 스킬 탭, 도감 직업 카드 글, 스킬 설명"""
import json, sys, os
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
h = open('/home/claude/game62/dist/play.html', encoding='utf-8').read()
BOOT = "if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();\n"
HOOK = OUT + '/play_ui.html'; open(HOOK, 'w', encoding='utf-8').write(h.replace(BOOT, BOOT + "window.__EV = s => eval(s);\n"))
def skip(pg):
    for _ in range(16):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(140); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(140); continue
        break
SETUP = r"""(() => {
  S.gold = 9e7; S.bld.training = 5;
  const mk = (cls, lv, sk) => { const a = makeAdv({ cls, lv }); a.skills = [CLASSES[cls].innate].concat(sk).filter((x, i, L) => SKILLS[x] && L.indexOf(x) === i); a.sl = {}; a.skills.forEach(id => { a.sl[id] = 3; }); S.advs.push(a); return a.id; };
  const w = mk('berserker', 70, ['berserk', 'frenzy', 'bash', 'warcry']), m = mk('sorcerer', 70, ['fireball', 'meteor', 'chain', 'haste']), r = mk('assassin', 90, ['quickstep', 'killer', 'backstab']);
  S.modals = [];
  return { w, m, r, txt: {
    basicW: basicSpec(advById(w)), basicM: basicSpec(advById(m)), spdR: speedBreakdown(advById(r)),
    fire: skillSpec('fireball', advById(m)).join(' · '), fireNo: skillSpec('fireball').join(' · '), berserk: skillSpec('berserk', advById(w)).join(' · '),
    rune: runeLine('haste', 'w'), costM: costStr(SKILLS.meteor, advById(m)), costW: costStr(SKILLS.bash, advById(w)) } };
})()"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 900}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + HOOK); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
    r = EV(SETUP); skip(pg)
    print(json.dumps(r['txt'], ensure_ascii=False, indent=1))
    for key, tab in ((r['m'], 'stat'), (r['m'], 'skill'), (r['r'], 'stat'), (r['w'], 'skill')):
        EV(f"(() => {{ UI.advTab = '{tab}'; openAdv({key}); }})()"); pg.wait_for_timeout(500); skip(pg)
        if tab == 'stat':
            el = pg.locator('.stats.boxed').first; el.scroll_into_view_if_needed(); pg.wait_for_timeout(200)
            box = el.bounding_box(); pg.screenshot(path=f'{OUT}/adv_{key}_{tab}.png', clip={'x': 0, 'y': max(0, box['y'] - 10), 'width': 412, 'height': min(900 - max(0, box['y'] - 10), box['height'] + 120)})
        else:
            el = pg.locator('.li.basic').first
            if el.count(): el.scroll_into_view_if_needed(); pg.wait_for_timeout(200); box = el.bounding_box(); pg.screenshot(path=f'{OUT}/adv_{key}_{tab}.png', clip={'x': 0, 'y': max(0, box['y'] - 10), 'width': 412, 'height': min(880 - max(0, box['y'] - 10), 520)})
        EV("closeWin && closeWin()") if False else None
    print('page errors:', errs[:8]); br.close()
