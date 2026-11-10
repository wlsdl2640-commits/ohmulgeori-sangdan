"""게임 직업 · 스킬 · 숙련 표를 뽑는다 → dump.json"""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import war
from playwright.sync_api import sync_playwright
war.build([])
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((war.T / 'war.html').as_uri()); pg.wait_for_timeout(300)
    out = pg.evaluate("""W(`(() => {
      const C = {}; for (const [k, c] of Object.entries(CLASSES)) C[k] = { name: c.name, tier: c.tier, from: c.from || null, act: c.act, innate: c.innate, row: c.row, tr: c.tr, desc: c.desc, spd: c.spd, crit: c.crit, req: c.req || null };
      const SK = {}; for (const [k, s] of Object.entries(SKILLS)) SK[k] = s;
      const M = {}; for (const [k, m] of Object.entries(MASTERY)) M[k] = { name: m.name, w: m.w, job: m.job, fx: m.fx, wn: m.wn, desc: m.desc, tier: m.tier };
      return { C, SK, M, MT: MAST_TIERS, WOF: WEAPON_OF, GT: Object.fromEntries(Object.entries(GTYPES).map(([k, g]) => [k, { name: g.name, slot: g.slot, cls: g.cls, st: g.st }])) };
    })()`)""")
    print('errors', errs[:3])
    json.dump(out, open(pathlib.Path(__file__).parent / 'dump.json', 'w'), ensure_ascii=False, indent=1)
    b.close()
