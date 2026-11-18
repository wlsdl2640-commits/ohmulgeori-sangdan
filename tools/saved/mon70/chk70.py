"""빌드 70 새 그림 확인 (시험 묶음 아님 · 내 확인): python3 chk70.py <훅 페이지> <출력 폴더>
1) 새 그림 id마다 pxuSprite: 서 있기 두 장 + PXU_ACT 갈래(atk · mag · skl)의 모든 동작을 장마다 — 오류 · 빈 그림 없나
2) 모습 여럿(PXU_SKIN): 이름표(MONS) · 그림 · uid마다 고르는 몫
3) 실제 싸움: h83.js 파티(성기사 · 대주교 · 신궁)를 그 땅(필드 · 던전)에 보내 stepExp 0.1초씩 + drawFrame — 사건 → 몬스터 동작 · 효과 그리기에서 오류 없나, 장면 찍기"""
import sys, json, base64, io, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
H83 = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'bal69', 'h83.js'), encoding='utf-8').read()
IDS = ['ruinguard', 'fallenangel', 'fallenangel_b', 'fallenangel_c', 'sphinx', 'sphinx_b', 'ophan', 'ophan_b', 'colossus', 'colossus_b', 'fallenarch',
       'starsprite', 'moonhound', 'nebula', 'nebula_b', 'constellation', 'startreant', 'starwhale', 'starwhale_b', 'starqueen', 'mimic', 'mimic_b', 'goldgolem', 'treasureguard']
SPR = r"""((ids) => {
  const out = {}, bad = [];
  for (const id of ids) {
    const base = MONS[id] && MONS[id].plan === 'pet' ? Object.keys(PXU_SKIN).find(k => PXU_SKIN[k].includes(id)) : id;
    const A = PXU_ACT[base] || {}, mks = [...new Set([].concat(A.atk || [], A.mag || [], A.skl || []))];
    let n = 0;
    for (const [mk, f] of [['idle', 0], ['idle', 1]].concat(...mks.map(mk => [0, 1, 2, 3, 4, 5, 6, 7].map(f => [mk, f])))) {
      try { const s = pxuSprite(id, mk, f); if (!s || !s.w || !s.h) bad.push(id + ':' + mk + ':' + f + ' 빈 그림'); n++; }
      catch (err) { bad.push(id + ':' + mk + ':' + f + ' ' + err.message); }
    }
    out[id] = { base, mks, n, mon: !!MONS[id], name: MONS[id] && MONS[id].name };
  }
  const skins = {};
  for (const [k, L] of Object.entries(PXU_SKIN)) if (ids.includes(k)) {
    const cnt = {}; for (let u = 0; u < 600; u++) { const s = pxuSkin({ id: k, uid: u }); cnt[s] = (cnt[s] || 0) + 1; }
    skins[k] = { looks: L, names: PXU_SKIN_NAME[k], cnt, ok: L.every(x => PXU[x] && MONS[x]) };
  }
  return { out, bad, skins };
})"""
FIGHT = r"""((r) => {
  drawWeather = () => {}; groundWx = () => {};
  S.t = r.hour * DAY_SEC + DAY_SEC * 3;
  S.advs = []; const team = r.cls.map(c => H.adv(c, r.lv));
  const p = newParty('시험대', team.map(a => a.id)); S.parties = [p]; S.view = p.id;
  p.sup = {}; p.safe = false; p.auto = false; p.campNight = false; p.dmode = 'enter'; p.autoBuy = false; p.pet = null;
  team.forEach(a => { a.status = 'idle'; a.inj = null; a.down = false; const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; });
  formParty(p); p.exp = newExp(r.fid, {}, r.stage); team.forEach(a => { refillAmmo(a); a.status = 'away'; });
  const e = p.exp; if (r.area) e.area = r.area;
  const errs = [], shots = [], seen = {}; let t = 0, now = 20000, k = 0;
  const put = () => { e.foes = r.ids.map((id, i) => { const f = foeFrom(id, r.flv); f.uid = 700 + k * 10 + i; if (r.boss) f.boss = true; if (r.fb) f.fb = true; return f; }); k++; };
  put(); V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {};
  while (t < r.secs && p.exp) {
    try { if (!e.foes.length) put(); stepExp(p, 0.1); } catch (err) { errs.push('step ' + err.message); break; }
    t += 0.1; now += 100;
    team.forEach(a => { const d = derive(a); if (a.hp < d.maxHp * 0.5) a.hp = d.maxHp; a.down = false; });   // 오래 찍으려고 파티는 쓰러지지 않게
    try { drawFrame(now, now / 1000); } catch (err) { errs.push('draw ' + err.message); break; }
    for (const f of e.foes) seen[pxuSkin(f)] = 1;
    if (r.at.some(x => Math.abs(x - t) < 0.05)) {
      const [cx, cy, cw, ch] = r.crop, c = document.createElement('canvas'); c.width = cw * HI; c.height = ch * HI;
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(V.off, cx * HI, cy * HI, cw * HI, ch * HI, 0, 0, cw * HI, ch * HI); shots.push(c.toDataURL());
    }
  }
  const evs = (e.ev || []).slice(-400).map(x => x.t).filter(Boolean), kinds = {}; evs.forEach(x => kinds[x] = (kinds[x] || 0) + 1);
  return { errs, shots, seen: Object.keys(seen), t: Math.round(t), kinds, waves: k };
})"""
RUNS = [
    ('ruins', 'ruins', 'field', ['ruinguard', 'fallenangel', 'sphinx'], 130, 0, 0),
    ('ruins2', 'ruins', 'field', ['ophan', 'fallenangel', 'sphinx'], 130, 0, 0),
    ('colossus', 'ruins', 'field', ['colossus'], 135, 0, 1),
    ('fallenarch', 'ruins', 'dungeon', ['fallenarch'], 140, 1, 0),
    ('star', 'stargarden', 'field', ['starsprite', 'nebula', 'startreant'], 140, 0, 0),
    ('star2', 'stargarden', 'field', ['moonhound', 'constellation', 'nebula'], 140, 0, 0),
    ('starwhale', 'stargarden', 'field', ['starwhale'], 145, 0, 1),
    ('starqueen', 'stargarden', 'dungeon', ['starqueen'], 150, 1, 0),
    ('vault', 'treasure', 'dungeon', ['mimic', 'goldgolem', 'mimic'], 120, 0, 0),
    ('treasureguard', 'treasure', 'dungeon', ['treasureguard'], 125, 1, 0),
]
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    EV = lambda code: pg.evaluate("s => window.__EV(s)", code)
    EV(H83 + "\nwindow.H = H; 'h'")
    R = EV(f"{SPR}({json.dumps(IDS)})")
    print('그림', sum(v['n'] for v in R['out'].values()), '장 ·', len(R['out']), 'id · 문제', R['bad'][:8])
    for k, v in R['skins'].items(): print('모습', k, v['ok'], v['names'], v['cnt'])
    for id_, v in R['out'].items(): print(' ', id_, v['base'], v['mks'], v['name'])
    strips = []
    for (nm, fid, area, ids, flv, boss, fb) in RUNS:
        r = dict(cls=['paladin', 'archbishop', 'hawkeye'], lv=150, fid=fid, stage=5, area=area, ids=ids, flv=flv, boss=boss, fb=fb, secs=30, hour=0.45, at=[2.0, 6.5, 11.0, 17.5, 24.0], crop=[20, 40, 220, 150])
        F = EV(f"{FIGHT}({json.dumps(r)})")
        print('싸움', nm, '오류', F['errs'], '본 모습', F['seen'], f"{F['t']}초 · 무리 {F['waves']}", F['kinds'])
        ims = [img(u) for u in F['shots']]
        if ims:
            W = sum(i.width for i in ims) + 8 * (len(ims) + 1); s = Image.new('RGB', (W, ims[0].height + 16), (21, 23, 28)); x = 8
            for i in ims: s.paste(i, (x, 8)); x += i.width + 8
            s.save(os.path.join(OUT, f'fight_{nm}.png')); strips.append(s)
    print('page errors', errs[:5]); br.close()
