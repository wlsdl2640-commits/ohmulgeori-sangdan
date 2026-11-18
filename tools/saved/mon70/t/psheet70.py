"""새끼 펫 · 말 시안판: python3 psheet70.py <훅 페이지> <시안.json> <출력.png> <제목> --mode pet|horse [--keys a,b] [--z 4]
시안.json = pets1.json / horses1.json ({'pets': {종류: {'base', 'name', 'pal', 'A': {g, g2, ax, ifr, float, label, desc, body?, dark?}, 'B': …}}})
게임 데이터는 안 바꾸고 PXU[pet_종류 | horse_종류]를 시안마다 잠깐 바꿔 끼워 실제 굽기 · 실제 장면으로 찍는다.
줄마다: 이름 · 지금 그림 · 시안마다 서 있기 두 장(×z) · 다 자란 모습 / 장면: 펫은 전투(파티 뒤를 따라오는 새끼 펫) · 사육장, 말은 마차를 끄는 원정 걷기 · 마구간."""
import json, base64, sys, io, textwrap
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

A = sys.argv[1:]
def opt(k, d):
    if k in A: i = A.index(k); v = A[i + 1]; del A[i:i + 2]; return v
    return d
MODE = opt('--mode', 'pet'); KEYS = opt('--keys', ''); Z = int(opt('--z', '4' if MODE == 'pet' else '3'))
PAGE, JS, OUT, TITLE = A[:4]
P = json.load(open(JS))['pets']; KS = [k for k in P if not KEYS or k in KEYS.split(',')]
VS = sorted({v for k in KS for v in P[k] if len(v) == 1 and v.isupper()})
PFX = 'pet_' if MODE == 'pet' else 'horse_'

JSLIB = r"""
// 새끼 펫을 전투 · 사육장에서 조금 크게 (넣을 때 view.js · hq.js도 이렇게 바꿀 것: 전투 1.1 × 너비 18 → 너비 26, 사육장 너비 22 → 26)
fieldScene = eval('(' + fieldScene.toString().replace('1.1 * monFit(petLook(pet), 18)', 'monFit(petLook(pet), 26)') + ')');
A3_PEN.live = eval('(function ' + A3_PEN.live.toString().replace('monFit(id, 22)', 'monFit(id, 26)') + ')');
window.__PS = {
  entry(d, x) { return Object.assign({ noArm: 1, still: 1, wpn: 'none', hip: 99, sh: [4, 2] }, { pal: Object.assign({}, d.pal || {}, x.pal || {}), g: x.g, g2: x.g2 || x.g, ax: x.ax, float: x.float || 0, ifr: x.ifr }); },
  put(id, d, x) {
    PXU[id] = this.entry(d, x);
    const m = MONS[d.base] || MONS[id] || {};
    MONS[id] = Object.assign({}, MONS[id] || { plan: 'pet', drops: [] }, { body: x.body || m.body, dark: x.dark || m.dark });
    delete MON_DIM[id]; if (typeof MON_BACK !== 'undefined') delete MON_BACK[id]; PXC.clear();
  },
  spr(id, f) { return PXU[id] ? pxuSprite(id, 'idle', f) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', f); },
  url(s, z) { const c = document.createElement('canvas'); c.width = s.w * z; c.height = s.h * z; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s.cv, 0, 0, s.w, s.h, 0, 0, s.w * z, s.h * z); return c.toDataURL(); },
  scene(r) {
    drawWeather = () => {}; groundWx = () => {};
    S.t = r.hour * DAY_SEC + DAY_SEC * 3;
    const team = r.cls.map((c, i) => { const a = makeAdv({ cls: c, lv: r.lv }); a.id = 900 + i; a.status = 'away'; a.wxt = null; return a; });
    S.advs = team.slice();
    if (!S.parties.length) S.parties.push(newParty('1팀', []));
    const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.sup = p.sup || {}; p.pet = null; p.wagon = null; p.horse = null; p.wagon2 = null; p.horse2 = null;
    if (r.pet) { S.pets = [{ id: 777, kind: r.pet, stage: 0, name: '새끼', lv: 3, exp: 0, q: 0 }]; p.pet = 777; }
    if (r.horse) { p.wagon = r.wagon || 'wagon'; p.horse = 'h:' + r.horse; }
    const foes = (r.ids || []).map((id, i) => { const f = foeFrom(id, r.lv); f.uid = 50 + i; f.cd = 99; return f; });
    const e = { field: r.field, area: 'field', stage: 12, pos: 60, mode: 'advance', encs: [60], ei: 0, foes, next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {} };
    p.exp = e; V.mode = ''; V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {};
    for (let i = 0; i < 4; i++) drawFrame(10000 + i * 100 + r.t0, 10 + i * 0.1 + r.t0);
    const [cx, cy, cw, ch] = r.crop, c = document.createElement('canvas'); c.width = cw * HI; c.height = ch * HI;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(V.off, cx * HI, cy * HI, cw * HI, ch * HI, 0, 0, cw * HI, ch * HI);
    p.exp = null; return c.toDataURL();
  }
};
'lib'"""

def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
GOLD, TXT, SUB, BG, CELL = (240, 196, 90), (236, 230, 220), (160, 155, 145), (21, 23, 28), (42, 44, 54)

with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(900)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200)
    def skip():
        for _ in range(25):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
            break
    skip()
    EV = lambda code: pg.evaluate("s => window.__EV(s)", code)
    EV(JSLIB)
    EV("S.gold = 9e7; S.rank = 8; Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.bld.pen = 3; S.bld.stable = 3; S.modals = []; 'ok'"); skip()
    D = json.dumps({k: P[k] for k in KS})
    # 가까이: 지금 · 시안 · 다 자람
    close = EV(f"""(() => {{ const P = {D}, out = {{}};
      for (const k of Object.keys(P)) {{ const d = P[k], r = {{ old: [], vars: {{}}, adult: null }}, oid = d.old || ('{PFX}' + k);
        r.old = [__PS.url(__PS.spr(oid, 0), {Z}), __PS.url(__PS.spr(oid, 1), {Z})];
        const ad = d.adult === null ? null : (d.adult || (PETS[k] ? (PETS[k].adult || PETS[k].mon) : null)); if (ad) r.adult = __PS.url(__PS.spr(ad, 0), 2);
        for (const v of Object.keys(d)) {{ if (!/^[A-Z]$/.test(v)) continue; const id = '__ps_' + k + '_' + v; __PS.put(id, d, d[v]);
          r.vars[v] = [__PS.url(__PS.spr(id, 0), {Z}), __PS.url(__PS.spr(id, 1), {Z}), __PS.spr(id, 0).w, __PS.spr(id, 0).h]; }}
        out[k] = r; }} return out; }})()""")
    scenes = {v: {} for v in VS}; places = {}
    for v in VS:
        EV(f"(() => {{ const P = {D}; for (const k of Object.keys(P)) if (P[k]['{v}']) __PS.put('{PFX}' + k, P[k], P[k]['{v}']); return 1; }})()")
        for k in KS:
            if v not in P[k]: continue
            if MODE == 'pet':
                r = dict(cls=['paladin', 'archbishop', 'hawkeye'], lv=60, hour=0.45, pet=k, ids=['wolf'], field='plains', crop=[0, 118, 160, 82], t0=0)
            else:
                r = dict(cls=['coachman', 'knight', 'archbishop'], lv=60, hour=0.45, horse=k, wagon='wagon', ids=[], field='plains', crop=[0, 104, 200, 96], t0=0)
            scenes[v][k] = img(EV(f"__PS.scene({json.dumps(r)})"))
        # 사육장 · 마구간 (상단 본부)
        if MODE == 'pet':
            EV(f"(() => {{ S.parties.forEach(p => {{ p.pet = null; p.exp = null; }}); S.pets = {json.dumps(KS[:7])}.map((k, i) => ({{ id: 800 + i, kind: k, stage: 0, name: k, lv: 3, exp: 0, q: 0 }})); S.t = 0.45 * DAY_SEC + DAY_SEC * 4; HQ.cur = null; hqGo('pen0', true); return 1; }})()")
        else:
            EV(f"(() => {{ S.parties.forEach(p => {{ p.horse = null; p.horse2 = null; p.exp = null; }}); S.pets = []; S.stable = {{ horses: {json.dumps({k: 1 for k in KS})} }}; S.advs = S.advs.filter(a => !rideKind(a)); S.t = 0.45 * DAY_SEC + DAY_SEC * 4; HQ.cur = null; hqGo('stable0', true); return 1; }})()")
        skip(); pg.wait_for_timeout(900)
        im = Image.open(io.BytesIO(pg.locator('#hq').screenshot())).convert('RGBA')
        places[v] = im.crop((0, int(im.height * (0.6 if MODE == 'pet' else 0.5)), im.width, int(im.height * 0.9)))
    print('errors', errs[:5]); br.close()

# 판
rows = []
for k in KS:
    c = close[k]; parts = [('지금', [img(u) for u in c['old']])]
    for v in VS:
        if v in c['vars']: parts.append((P[k][v]['label'] + f"  {c['vars'][v][2]}×{c['vars'][v][3]}", [img(u) for u in c['vars'][v][:2]]))
    if c['adult']: parts.append(('다 자란 모습', [img(c['adult'])]))
    h = max(max(i.height for i in ims) for _, ims in parts)
    rows.append((k, parts, h))
sc_w = max(im.width for v in VS for im in scenes[v].values()); sc_h = max(im.height for v in VS for im in scenes[v].values())
SCZ = 1 if sc_w > 400 else 2
pl_w = max(im.width for im in places.values()); pl_h = max(im.height for im in places.values()); PZ = 0.72
W = max(1240, max(sum(sum(i.width + 8 for i in ims) + 30 for _, ims in parts) + 40 for k, parts, h in rows), 40 + len(VS) * (sc_w // (3 - SCZ) + 20))
W = max(W, 60 + len(VS) * (int(pl_w * 0.72) + 20))
H = 140
for k, parts, h in rows: H += 40 + h + 26 + 22 * len(VS) + sc_h + 40
H += 60 + int(pl_h * PZ) + 40
sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh)
d.text((30, 18), TITLE, font=fnt(28, True), fill=GOLD)
sub = '실제 게임 굽기(뭉툭 도트 B4)로 찍음 · 가까이 ×%d(지금 그림도 같은 배율) · 장면은 시안을 잠깐 끼워 찍은 실제 게임 화면' % Z + (' (새끼 펫은 전투 · 사육장에서 지금보다 조금 크게 — 너비 26픽셀까지)' if MODE == 'pet' else '') + '. 게임에는 아직 안 넣음.'
yy = 62
for ln in textwrap.wrap(sub, 92): d.text((30, yy), ln, font=fnt(16), fill=SUB); yy += 22
y = yy + 16
for k, parts, h in rows:
    d.text((30, y), f"{P[k]['name']} ({k})", font=fnt(22, True), fill=TXT); y += 36
    x = 30
    for lab, ims in parts:
        d.text((x, y), lab, font=fnt(14), fill=SUB)
        for im in ims:
            bx = Image.new('RGB', (im.width, h), CELL); bx.paste(im, (0, h - im.height), im); sh.paste(bx, (x, y + 22)); x += im.width + 8
        x += 30
    y += h + 30
    for v in VS:
        if v in P[k]: d.text((30, y), f"{v} — {P[k][v]['desc']}", font=fnt(15), fill=SUB); y += 22
    x = 30
    for v in VS:
        im = scenes[v].get(k)
        if im is None: continue
        d.text((x, y + 2), ('전투에서 파티 뒤를 따라오는 ' if MODE == 'pet' else '마차를 끄는 원정 걷기 ') + v, font=fnt(14), fill=SUB)
        sh.paste(im.convert('RGB'), (x, y + 22)); x += im.width + 20
    y += sc_h + 40
d.text((30, y), '상단 본부 ' + ('사육장 (새끼 펫이 뛰어논다)' if MODE == 'pet' else '마구간 (산 말)'), font=fnt(20, True), fill=TXT); y += 34
x = 30
for v in VS:
    im = places[v]; im2 = im.resize((int(im.width * PZ), int(im.height * PZ)), Image.NEAREST)
    d.text((x, y), v, font=fnt(16), fill=SUB); sh.paste(im2.convert('RGB'), (x, y + 22)); x += im2.width + 20
sh = sh.crop((0, 0, W, y + 22 + int(pl_h * PZ) + 20)); sh.save(OUT); print('sheet', OUT, sh.size)
