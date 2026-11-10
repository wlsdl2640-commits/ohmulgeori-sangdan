"""전투 보고서용 게임 자료 → dump2.json (직업 · 스킬 · 몬스터 · 필드 · 상태 · 특성 · 펫 · 상수)"""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import war
from playwright.sync_api import sync_playwright
war.build([])
JS = r"""(() => {
  const C = {}; for (const [k, c] of Object.entries(CLASSES)) C[k] = { name: c.name, tier: c.tier, from: c.from || null, act: c.act, innate: c.innate, row: c.row ?? null, tr: c.tr || null, desc: c.desc, spd: c.spd, crit: c.crit, carry: c.carry, req: c.req || null, form: formRank(k) };
  const SK = {}; for (const [k, s] of Object.entries(SKILLS)) SK[k] = s;
  const M = {}; for (const [k, m] of Object.entries(MONS)) { if (m.plan === 'pet') continue; M[k] = { name: m.name, hp: m.hp, atk: m.atk, def: m.def, spd: m.spd, eva: m.eva, magic: m.magic || 0, aoe: m.aoe || 0, heal: m.heal || 0, sta: m.sta || null, ty: m.ty, el: m.el, plan: m.plan, scale: m.scale || 1, lv: m.lv, minStage: m.minStage || m.min || null, boss: m.boss || 0, raid: m.raid || 0, giant: m.giant || 0, keys: Object.keys(m) }; }
  const F = {}; for (const [k, f] of Object.entries(FIELDS)) F[k] = { name: f.name, no: f.no, tier: f.tier, lv: f.lv, region: f.region || null, mons: f.mons || [], bosses: f.bosses || [], dungeon: f.dungeon ? { name: f.dungeon.name, mons: f.dungeon.mons || [], boss: f.dungeon.boss, guards: f.dungeon.guards || [] } : null, raid: f.raid || 0, giant: f.giant || null, hidden: f.hidden || 0, demon: f.demon || 0, frontier: f.frontier || 0 };
  const P = {}; for (const [k, p] of Object.entries(PETS)) P[k] = { name: p.name, evo: p.evo, act: p.act, pow: p.pow, cd: p.cd, magic: p.magic || 0, sta: p.sta || null, fx: p.fx || null, desc: p.desc };
  const RAIDS = typeof RAID_MONS !== 'undefined' ? RAID_MONS : null;
  return { C, SK, M, F, P, STATUS, TRAITS, JOB_TRAITS, ELEMS, MTYPES, TYPE_TR, STUN_ADD, RARE, NEST, CONST: { BASIC_CD, BASIC_MULT, BASIC_MAGIC, COMBO_MAX, EXEC_HP, MARK_BONUS, CAST_GAP, CDR_MAX, BOSS_EVERY, FIELD_STAGES }, PET_FX_EL: typeof PET_FX_EL !== 'undefined' ? PET_FX_EL : null, WEAPON_OF, RAIDS, FOODS: typeof FOODS !== 'undefined' ? FOODS : null, WEAK: typeof WEAK_TRAIT_IDS !== 'undefined' ? WEAK_TRAIT_IDS : null };
})()"""
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((war.T / 'war.html').as_uri()); pg.wait_for_timeout(300)
    out = pg.evaluate("W(" + json.dumps(JS) + ")")
    print('errors', errs[:3])
    json.dump(out, open(pathlib.Path(__file__).parent / 'dump2.json', 'w'), ensure_ascii=False, indent=1)
    print({k: (len(v) if hasattr(v, '__len__') else v) for k, v in out.items()})
    b.close()
