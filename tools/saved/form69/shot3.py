"""대형 시안 3 — 시뮬레이션을 멈추고(step 비움) 한낮 걷기 장면에 파티만 세워 찍는다. 지금(play_ev86b) · 새 대형(play_form) × 파티 넷"""
import json
from playwright.sync_api import sync_playwright
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v87/form/'
PAGES = {'old': SP + '/v86/play_ev86b.html', 'new': D + 'play_form.html'}
COMPS = {
    'A': ['knight', 'gladiator', 'assassin', 'sniper', 'coachman'],
    'B': ['berserker', 'duelist', 'archmage', 'priest', 'conestoga'],
    'C': ['knight', 'berserker', 'assassin', 'ninja', 'coachman'],
    'D': ['ranger', 'sorcerer', 'archbishop', 'hawkeye', 'bard'],
}
def skip(pg):
    for _ in range(16):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
SETUP = r"""(() => {
  S.gold = 9e7; S.rank = 5; S.fame = 99999; Object.assign(S.flags, { v65: 1, v64: 1, v63: 1, v63b: 1, v63c: 1, wh63: 1, v67: 1, v68: 1, v68b: 1, v69: 1, v69b: 1 });
  ALL_FIELDS.forEach(f => { if (S.fields[f]) { S.fields[f].cleared = true; S.fields[f].found = true; S.fields[f].best = 40; } });
  S.advs = []; const out = {};
  for (const [k, list] of Object.entries(%COMPS%)) out[k] = list.map((cls, i) => { const a = makeAdv({ cls, lv: 112, name: CLASSES[cls].name }); a.wxt = null; S.advs.push(a); return a.id; });
  const p = S.parties[0]; p.members = out.A.slice(); startExp(p, 'desert');
  step = () => {};   // 시뮬레이션을 멈춘다 (그리기만)
  const e = p.exp; e.foes = []; e.next = null; e.encs = [9999]; e.ei = 0; e.pos = 40; e.mode = 'advance'; e.camp = null; e.wait = null;
  S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  return out;
})()"""
meta = {}
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for tag, page in PAGES.items():
        pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + page); pg.wait_for_timeout(800)
        pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
        EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
        ids = EV(SETUP.replace('%COMPS%', json.dumps(COMPS))); skip(pg); EV("S.modals = []")
        EV("openBattle()"); pg.wait_for_timeout(400)
        for key in COMPS:
            EV(f"(() => {{ const p = S.parties[0]; p.members = {json.dumps(ids[key])}; p.members.forEach(id => advById(id).status = 'away'); formParty(p); }})()")
            pg.wait_for_timeout(500); skip(pg); EV("S.modals = []")
            pg.locator('#bcv').screenshot(path=D + f'z_{tag}_{key}.png')
            meta[f'{tag}_{key}'] = EV("V.hitA.map(([id, x, y, ru]) => [CLASSES[advById(id).cls].name, advById(id).cls, x, y, ru])")
        print(tag, 'errors', errs[:4]); pg.close()
    br.close()
json.dump(meta, open(D + 'z_meta.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(json.dumps(meta['new_D'], ensure_ascii=False))
