"""레이드 보스 시안판: python3 rsheet70.py <훅 페이지> <시안.json> <몬스터 id> <레이드 열쇠> <출력.png> <제목> [<부제>]
시안.json = { 'A': 격자, 'B': …, 'pal': {키: 팔레트}, 'label': {키: 이름}, 'desc': {키: 설명} }
PXRAID[id]를 잠깐 바꿔 끼워(게임 데이터는 안 바꿈) 실제 굽기(pxGiantSprite)로 가까이 ×2 + 실제 레이드 싸움(네 파티, 레이드 원정대 창)을 찍는다."""
import json, base64, sys, os, io, textwrap
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

PAGE, JS, MID, RK, OUT, TITLE = sys.argv[1:7]
SUBT = sys.argv[7] if len(sys.argv) > 7 else '실제 게임 굽기(pxGiantSprite)로 찍음 · 가까이 2배 · 레이드 보스는 한 장 그림(동작 없이 흔들림 · 번쩍임). 게임에는 아직 안 넣음.'
TB = json.load(open(JS)); KEYS = [k for k in TB if k not in ('pal', 'label', 'desc')]
H83 = open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/h83.js', encoding='utf-8').read()
SETUP = H83 + r'''
;((rk) => {
  H.fresh(); S.rank = 6; S.bld.airfield = 3; S.speed = 1;
  Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; });
  const comps = [['paladin', 'bloodlord', 'hawkeye', 'archbishop'], ['champion', 'shadowlord', 'archmage', 'physician'], ['arcblade', 'bladedancer', 'kaijuhunter', 'archbishop'], ['paladin', 'kageninja', 'elementlord', 'inquisitor']];
  S.parties = comps.map((L, i) => { const p = newParty(`${i + 1}팀`, L.map(c => H.adv(c, 192, { slv: 3, sm: 3 }).id)); p.sup = {}; p.auto = false; p.safe = false; return p; });
  S.raid = { list: [newRaid(rk)], from: today() };
  S.modals = []; S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  S.view = S.parties[0].id; UI.dirty = true; renderChips();
  return 'ok';
})'''
SWAP = r"""((id, g, pal) => {
  PXRAID[id] = { g, pal };
  const rows = pxRows(g); PXG_DIM[id] = [Math.max(...rows.map(r => r.length)) * 2, rows.length * 2];
  MONS[id].W = PXG_DIM[id][0]; MONS[id].H = PXG_DIM[id][1]; delete MON_DIM[id]; PXC.clear(); return PXG_DIM[id];
})"""
CLOSE = r"""((id, Z) => { const s = pxGiantSprite(id); const c = document.createElement('canvas'); c.width = s.w * Z + 16; c.height = s.h * Z + 16;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#2a2c36'; g.fillRect(0, 0, c.width, c.height); g.drawImage(s.cv, 0, 0, s.w, s.h, 8, 8, s.w * Z, s.h * Z); return c.toDataURL(); })"""
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
GOLD, TXT, SUB, BG = (240, 196, 90), (236, 230, 220), (160, 155, 145), (21, 23, 28)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=2)
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
    cur = img(EV(f"{CLOSE}({json.dumps(MID)}, 2)"))
    closes = {}
    for k in KEYS:
        dim = EV(f"{SWAP}({json.dumps(MID)}, {json.dumps(chr(10) + TB[k] + chr(10))}, {json.dumps(TB['pal'][k])})")
        closes[k] = (img(EV(f"{CLOSE}({json.dumps(MID)}, 2)")), dim)
    print(EV(f"{SETUP}({json.dumps(RK)})")); EV("S.modals = []; S.achv = S.achv || {}; ACHV.forEach(A => { S.achv[A.id] = S.achv[A.id] || 1; }); 'ok'"); pg.wait_for_timeout(300); skip()
    k0 = KEYS[0]; EV(f"{SWAP}({json.dumps(MID)}, {json.dumps(chr(10) + TB[k0] + chr(10))}, {json.dumps(TB['pal'][k0])})")
    print(EV(f"(UI.raidSel = {{ [{json.dumps(RK)}]: S.parties.slice(0, 4).map(p => p.id) }}, raidLaunch({json.dumps(RK)})) || 'go'"))
    print(EV("for (let i = 0; i < 900 && !S.parties.slice(0,4).every(p => p.exp && p.exp.foes.length); i++) step(0.1); for (let i = 0; i < 30; i++) step(0.1); S.parties.slice(0,4).map(p => p.exp ? p.exp.mode + ':' + p.exp.foes.length : '-').join(' ')"))
    EV("showWin(false); UI.stack = []; S.view = S.parties[0].id; openBattle(); 'ok'"); pg.wait_for_timeout(900); skip()
    scenes = {}
    for k in KEYS:
        EV(f"{SWAP}({json.dumps(MID)}, {json.dumps(chr(10) + TB[k] + chr(10))}, {json.dumps(TB['pal'][k])})"); pg.wait_for_timeout(700)
        pg.locator('#bcv').screenshot(path='/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v70/d/_scene.png')
        scenes[k] = Image.open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v70/d/_scene.png').convert('RGB')
    print('errors:', errs[:5]); b.close()

sc = {k: im.resize((im.width * 9 // 20, im.height * 9 // 20)) for k, im in scenes.items()}
W = max([cur.width + 60] + [closes[k][0].width + 60 for k in KEYS] + [sum(i.width for i in sc.values()) + 20 * len(sc) + 40, 1100])
H = 110 + cur.height + 60
for k in KEYS: H += 40 + 22 * len(textwrap.wrap(TB['desc'][k], 70)) + closes[k][0].height + 20
H += 50 + max(i.height for i in sc.values()) + 40
sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh)
d.text((30, 18), TITLE, font=fnt(28, True), fill=GOLD)
d.text((30, 62), SUBT, font=fnt(16), fill=SUB)
y = 100; d.text((30, y), '지금 그림', font=fnt(18, True), fill=SUB); sh.paste(cur, (30, y + 30)); y += cur.height + 50
for k in KEYS:
    d.text((30, y), TB['label'][k] + f"   ({closes[k][1][0] // 2}×{closes[k][1][1] // 2}칸)", font=fnt(22, True), fill=TXT); y += 36
    for ln in textwrap.wrap(TB['desc'][k], 70): d.text((30, y), ln, font=fnt(16), fill=SUB); y += 22
    sh.paste(closes[k][0], (30, y + 4)); y += closes[k][0].height + 20
d.text((30, y + 4), '실제 레이드 싸움 (레이드 원정대 창 — 네 파티, 전투 창)', font=fnt(20, True), fill=TXT); y += 44
x = 30
for k in KEYS:
    d.text((x, y), TB['label'][k].split(' ')[0], font=fnt(16), fill=SUB); sh.paste(sc[k], (x, y + 22)); x += sc[k].width + 20
sh.save(OUT); print('sheet', OUT, sh.size)
