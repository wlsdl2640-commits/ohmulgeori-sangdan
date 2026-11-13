"""대형 넣은 뒤 찍기: 시안 shot3.py와 같은 파티 넷 · 한낮 걷기 장면 (게임 빌드 69 훅 페이지)"""
import json, sys
from playwright.sync_api import sync_playwright
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
D = SP + '/v89/form/'
PAGE = SP + '/v89/play_ev89.html'
COMPS = {
    'A': ['knight', 'gladiator', 'assassin', 'sniper', 'coachman'],
    'B': ['berserker', 'duelist', 'archmage', 'priest', 'conestoga'],
    'C': ['knight', 'berserker', 'assassin', 'ninja', 'coachman'],
    'D': ['ranger', 'sorcerer', 'archbishop', 'hawkeye', 'bard'],
    'E': ['knight', 'hawkeye', 'archbishop', 'coachman'],
    'F': ['gladiator', 'berserker', 'sorcerer', 'priest'],
}
def skip(pg):
    for _ in range(16):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
SETUP = r"""(() => {
  S.gold = 9e7; S.rank = 5; S.fame = 99999; Object.keys(S.flags).forEach(k => S.flags[k] = 1); Object.assign(S.flags, { v65: 1, v64: 1, v63: 1, v63b: 1, v63c: 1, wh63: 1, v67: 1, v68: 1, v68b: 1, v69: 1, v69b: 1, v69c: 1 });
  ALL_FIELDS.forEach(f => { if (S.fields[f]) { S.fields[f].cleared = true; S.fields[f].found = true; S.fields[f].best = 40; } });
  S.advs = []; const out = {};
  for (const [k, list] of Object.entries(%COMPS%)) out[k] = list.map((cls, i) => { const a = makeAdv({ cls, lv: 112, name: CLASSES[cls].name }); a.wxt = null; S.advs.push(a); return a.id; });
  const p = S.parties[0]; p.members = out.A.slice(); startExp(p, 'desert');
  step = () => {};
  const e = p.exp; e.foes = []; e.next = null; e.encs = [9999]; e.ei = 0; e.pos = 40; e.mode = 'advance'; e.camp = null; e.wait = null;
  S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  return out;
})()"""
meta = {}
with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(800)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
    EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
    ids = EV(SETUP.replace('%COMPS%', json.dumps(COMPS))); skip(pg); EV("S.modals = []")
    EV("openBattle()"); pg.wait_for_timeout(400)
    for key in COMPS:
        EV(f"(() => {{ const p = S.parties[0]; p.members = {json.dumps(ids[key])}; p.members.forEach(id => advById(id).status = 'away'); formParty(p); }})()")
        pg.wait_for_timeout(500); skip(pg); EV("S.modals = []")
        pg.locator('#bcv').screenshot(path=D + f'z_cur_{key}.png')
        meta[f'cur_{key}'] = EV("V.hitA.map(([id, x, y, ru]) => [CLASSES[advById(id).cls].name, advById(id).cls, x, y, ru])")
    # 펫 하나 붙여 (B)
    print('errors', errs[:4]); br.close()
json.dump(meta, open(D + 'z_meta.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
for k, v in meta.items(): print(k, [(m[0], m[2], m[3]) for m in v])
