"""평원 전투 장면을 여러 벌 찍는다: 몬스터 전부 · 몬스터 없음 · 몬스터 하나씩 (자리 · 크기를 재려고)"""
import json, base64, io, sys, os
from playwright.sync_api import sync_playwright
from PIL import Image
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
JS = r"""((r) => {
  drawWeather = () => {}; groundWx = () => {};
  S.t = r.hour * DAY_SEC + DAY_SEC * 3;
  const cls = ['warrior', 'mage', 'cleric', 'archer'];
  const team = cls.map((c, i) => { const a = makeAdv({ cls: c, lv: r.lv }); a.id = 900 + i; a.status = 'away'; a.wxt = null; return a; });
  S.advs = team.slice();
  if (!S.parties.length) S.parties.push(newParty('1팀', [])); const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.pet = null; p.sup = p.sup || {};
  const foes = r.foes.map((x, i) => { const f = foeFrom(x.id, 6); f.uid = 50 + i; f.cd = 99; if (x.fb) { f.boss = true; f.fb = x.fb; f.sc = x.sc; f.name = '우두머리 ' + MONS[x.id].name; } return f; });
  const e = { field: 'plains', area: 'field', stage: 3, pos: 60, mode: 'advance', encs: [60], ei: 0, foes, next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {}, sup: {} };
  p.exp = e;
  const DM = window.__DM || (window.__DM = drawMon), out = {};
  const run = mode => {
    drawMon = mode === 'all' ? DM : mode === 'none' ? (() => {}) : ((ctx, id, t, o) => { if (id === mode) DM(ctx, id, t, o); });
    V.mode = ''; V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {};
    for (let i = 0; i < 4; i++) drawFrame(10000 + i * 100, 10 + i * 0.1);
    return V.off.toDataURL();
  };
  out.all = run('all'); out.none = run('none'); for (const x of r.foes) out[x.id] = run(x.id);
  drawMon = DM;
  return JSON.stringify(out);
})"""
SC = {'reg': dict(hour=0.45, lv=30, foes=[{'id': k} for k in ['rat', 'slime', 'rabbit', 'wolf', 'goblin']]),
      'boss': dict(hour=0.45, lv=30, foes=[{'id': 'rat'}, {'id': 'wolf', 'fb': 1, 'sc': 2}, {'id': 'goblin'}]),
      'boss2': dict(hour=0.45, lv=30, foes=[{'id': 'wolf', 'fb': 1, 'sc': 2}, {'id': 'rat'}, {'id': 'slime'}]),
      'boss3': dict(hour=0.45, lv=30, foes=[{'id': 'rat'}, {'id': 'slime'}, {'id': 'wolf', 'fb': 1, 'sc': 2}])}
import sys as _s
if len(_s.argv) > 3: SC = {k: SC[k] for k in _s.argv[3].split(',')}
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(PAGE)); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    for nm, r in SC.items():
        shots = json.loads(pg.evaluate("s => window.__EV(s)", f"{JS}({json.dumps(r)})"))
        for k, u in shots.items():
            Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA').save(os.path.join(OUT, f'{nm}_{k}.png'))
    print('errors', errs[:3]); br.close()
