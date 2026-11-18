"""빌드 70 시안판: python3 sheet70.py <훅 페이지> <출력.png> <제목> <시안.json> [시안.json …] [--z 3] [--lv 130] [--per 4] [--hour 0.45] [--note 글] [--scenes 장면.json]
--hide k1,k2: 줄(가까이)을 그리지 않을 시안 (장면에만 쓴다)
--scenes: [{ids: [...], label: 글, post: JS(그린 뒤 V.off에 덧그리기 — g · HI · pos(모험가 발 자리 [x, y] 목록) · t), field?, area?, boss?}, …] — 주면 자동 묶음 대신 이 장면들
시안 PXU 항목을 게임에 잠깐 끼워(게임 데이터는 안 바꿈) 실제 굽기(pxuSprite · 뭉툭 B4)로
줄마다: 이름 · 설명 · 가까이(서 있기 둘 + show 동작 장) / 끝에: 실제 전투 화면(그 땅 배경 · 파티 셋 · 적 per마리씩)"""
import json, base64, sys, os, io, textwrap
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

A = sys.argv[1:]
def opt(k, d):
    if k in A: i = A.index(k); v = A[i + 1]; del A[i:i + 2]; return v
    return d
QUICK = '--quick' in A
if QUICK: A.remove('--quick')
Z = int(opt('--z', '3')); LV = int(opt('--lv', '130')); PER = int(opt('--per', '4')); HOUR = float(opt('--hour', '0.45')); NOTE = opt('--note', ''); OLD = opt('--old', '')
SCNF = opt('--scenes', ''); SCN = json.load(open(SCNF)) if SCNF else None
HIDE = set(v for v in opt('--hide', '').split(',') if v)
CROP = [int(v) for v in opt('--crop', '0,40,240,160').split(',')]
PAGE, OUT, TITLE = A[0], A[1], A[2]; FILES = A[3:]
defs, extra = {}, ''
for fn in FILES:
    j = json.load(open(fn)); j = j if 'defs' in j else {'defs': j}; defs.update(j['defs']); extra += j.get('extra', '')

INJ = r"""((D) => {
  for (const [k, d] of Object.entries(D)) {
    const p = Object.assign({}, d); for (const x of ['act', 'mon', 'label', 'desc', 'field', 'area', 'show']) delete p[x];
    PXU[k] = p; MONS[k] = Object.assign({}, MONS[d.mon.base], d.mon.col || {}, { name: d.label, drops: [] }); PXU_ACT[k] = d.act;   // mon.col: 미궁 변종처럼 몸 색만 바꾼 시안 (빌드 70 지하미궁)
    delete MON_DIM[k]; if (typeof MON_BACK !== 'undefined') delete MON_BACK[k];
  }
  PXC.clear(); return Object.keys(D).length;
})"""
CLOSE = r"""((list, Z) => {
  const sp = list.map(([id, mk, f]) => pxuSprite(id, mk, f));
  const up = Math.max(...sp.map(s => s.ay)), dn = Math.max(...sp.map(s => s.h - s.ay));
  const ws = sp.map(s => s.w), W = ws.reduce((a, w) => a + w * Z + 14, 14), H = (up + dn) * Z + 16;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#2a2c36'; g.fillRect(0, 0, W, H); g.fillStyle = '#3a3c48'; g.fillRect(0, 8 + up * Z, W, 2);
  let x = 14; for (const s of sp) { g.drawImage(s.cv, 0, 0, s.w, s.h, x, 8 + (up - s.ay) * Z, s.w * Z, s.h * Z); x += s.w * Z + 14; }
  return c.toDataURL();
})"""
SCENE = r"""((r) => {
  drawWeather = () => {}; groundWx = () => {};
  S.t = r.hour * DAY_SEC + DAY_SEC * 3;
  const cls = ['paladin', 'archbishop', 'hawkeye'];
  const team = cls.map((c, i) => { const a = makeAdv({ cls: c, lv: r.lv }); a.id = 900 + i; a.status = 'away'; a.wxt = null; return a; });
  S.advs = team.slice();
  if (!S.parties.length) S.parties.push(newParty('1팀', [])); const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.pet = null; p.sup = p.sup || {};
  const foes = r.ids.map((id, i) => { const f = foeFrom(id, r.lv); f.uid = 50 + i; f.cd = 99; if (r.boss) { f.boss = true; } return f; });
  const e = { field: r.field, area: r.area, stage: 12, pos: 60, mode: 'advance', encs: [60], ei: 0, foes, next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {}, sup: {} };
  p.exp = e; V.mode = ''; V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {};
  for (let i = 0; i < 4; i++) drawFrame(10000 + i * 100, 10 + i * 0.1);
  if (r.post) { const g0 = V.off.getContext('2d'); g0.save(); g0.setTransform(1, 0, 0, 1, 0, 0); (new Function('g', 'HI', 'pos', 't', r.post))(g0, HI, (V.hitA || []).map(q => [q[1], q[2]]), 10.3); g0.restore(); }   // 논리 픽셀 × HI로 덧그린다
  const [cx, cy, cw, ch] = r.crop, c = document.createElement('canvas'); c.width = cw * HI; c.height = ch * HI;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(V.off, cx * HI, cy * HI, cw * HI, ch * HI, 0, 0, cw * HI, ch * HI);
  return c.toDataURL();
})"""

def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
GOLD, TXT, SUB, BG = (240, 196, 90), (236, 230, 220), (160, 155, 145), (21, 23, 28)

with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(900)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    EV = lambda code: pg.evaluate("s => window.__EV(s)", code)
    oldim = img(EV(f"(() => {{ const s = pxMonSprite({json.dumps(OLD)}, 0), Z = 3, c = document.createElement('canvas'); c.width = s.w * Z + 16; c.height = s.h * Z + 16; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#2a2c36'; g.fillRect(0, 0, c.width, c.height); g.drawImage(s.cv, 0, 0, s.w, s.h, 8, 8, s.w * Z, s.h * Z); return c.toDataURL(); }})()")) if OLD else None
    if extra: EV(extra + "\n'extra'")
    EV(f"{INJ}({json.dumps(defs)})")
    rows = []
    for k, d in defs.items():
        if k in HIDE: continue
        lst = [[k, 'idle', 0], [k, 'idle', 1]] + [[k, mk, f] for mk, f in d.get('show', [])]
        rows.append((k, d, img(EV(f"{CLOSE}({json.dumps(lst)}, {Z})"))))
    keys = list(defs); scenes = []
    grp = {}
    for k in keys: grp.setdefault((defs[k]['field'], defs[k]['area'], defs[k]['mon']['base']), []).append(k)
    if SCN and not QUICK:
        for q in SCN:
            k0 = q['ids'][0]; d0 = defs.get(k0, {})
            r = dict(ids=q['ids'], field=q.get('field', d0.get('field', 'sewer')), area=q.get('area', d0.get('area', 'field')), lv=LV, hour=HOUR, crop=CROP, boss=q.get('boss', True), post=q.get('post', ''))
            scenes.append((q.get('label', ' · '.join(q['ids'])), img(EV(f"{SCENE}({json.dumps(r)})"))))
    for (fld, area, base), ks in ([] if QUICK or SCN else grp.items()):
        for i in range(0, len(ks), PER):
            ids = ks[i:i + PER]
            r = dict(ids=ids, field=fld, area=area, lv=LV, hour=HOUR, crop=CROP, boss=area == 'dungeon' or PER == 1)
            scenes.append((ids, img(EV(f"{SCENE}({json.dumps(r)})"))))
    print('errors', errs[:5]); br.close()

# 판 짜기
W = max(max(r[2].width for r in rows) + 60, 1100)
sw = scenes[0][1].width if scenes else 0
cols = max(1, (W - 40) // (sw + 20)) if scenes else 1
Hs = 110 + (22 if NOTE else 0) + ((oldim.height + 40) if OLD else 0)
for k, d, im in rows: Hs += 34 + 22 * len(textwrap.wrap(d['desc'], 70)) + im.height + 22
nsr = (len(scenes) + cols - 1) // cols
Hs += 50 + nsr * ((scenes[0][1].height + 46) if scenes else 0) + 20
sh = Image.new('RGB', (W, Hs), BG); dr = ImageDraw.Draw(sh)
dr.text((30, 18), TITLE, font=fnt(28, True), fill=GOLD)
dr.text((30, 62), '실제 게임 굽기(뭉툭 도트 B4)로 찍음 — 줄마다: 서 있기 두 장 · 동작 장(공격 · 스킬). 게임에는 아직 안 넣음.', font=fnt(16), fill=SUB)
y = 92
if NOTE: dr.text((30, y), NOTE, font=fnt(16), fill=SUB); y += 22
y += 14
if OLD:
    dr.text((30, y), '지금 그림 (옛 도트)', font=fnt(18, True), fill=SUB); sh.paste(oldim, (30, y + 30)); y += oldim.height + 40
for k, d, im in rows:
    dr.text((30, y), d['label'], font=fnt(22, True), fill=TXT); y += 34
    for ln in textwrap.wrap(d['desc'], 70): dr.text((30, y), ln, font=fnt(16), fill=SUB); y += 22
    sh.paste(im, (30, y)); y += im.height + 22
dr.text((30, y + 6), '실제 전투 화면 (그 땅 배경 · 낮 · 왼쪽 파티 Lv%d)' % LV, font=fnt(20, True), fill=TXT); y += 46
for i, (ids, im) in enumerate(scenes):
    cx = 30 + (i % cols) * (sw + 20); cy = y + (i // cols) * (im.height + 46)
    dr.text((cx, cy), ids if isinstance(ids, str) else ' · '.join(defs[k]['label'].split(' ')[0] for k in ids), font=fnt(16), fill=SUB); sh.paste(im, (cx, cy + 24))
sh.save(OUT); print('sheet', OUT, sh.size)
