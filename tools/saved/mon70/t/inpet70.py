"""넣은 새끼 펫 · 말 확인 판 (게임 데이터 그대로 — 시안을 끼우지 않는다): python3 inpet70.py <훅 페이지> <출력.png>
새끼 펫 16(슬라임은 옛 그림) ×3 · 펫 칸 그림(petQURL) · 전투에서 따라오는 새끼 펫 · 사육장 / 말 7 ×2 · 마구간 · 마차를 끄는 원정."""
import json, base64, sys, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

PAGE, OUT = sys.argv[1:3]
KS = ['slime', 'wolf', 'spider', 'golem', 'griffon', 'harpy', 'icesprite', 'scorpion', 'sewerrat', 'kelpie', 'imp', 'vbat', 'goat', 'wyvern', 'redhare', 'pegasus']
HS = ['old', 'donkey', 'gray', 'black', 'white', 'war', 'noble']
LIB = r"""
window.__IP = {
  spr(id, f) { return PXU[id] ? pxuSprite(id, 'idle', f) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', f); },
  url(s, z) { const c = document.createElement('canvas'); c.width = s.w * z; c.height = s.h * z; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s.cv, 0, 0, s.w, s.h, 0, 0, s.w * z, s.h * z); return c.toDataURL(); },
  cv(c, z) { const d = document.createElement('canvas'); d.width = c.width * z; d.height = c.height * z; const g = d.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, d.width, d.height); return d.toDataURL(); },
  scene(r) {
    drawWeather = () => {}; groundWx = () => {};
    S.t = 0.45 * DAY_SEC + DAY_SEC * 3;
    const team = r.cls.map((c, i) => { const a = makeAdv({ cls: c, lv: 60 }); a.id = 900 + i; a.status = 'away'; a.wxt = null; return a; });
    S.advs = team.slice();
    const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.sup = p.sup || {}; p.pet = null; p.wagon = null; p.horse = null; p.wagon2 = null; p.horse2 = null;
    if (r.pet) { S.pets = [{ id: 777, kind: r.pet, stage: 0, name: '새끼', lv: 3, exp: 0, q: 0 }]; p.pet = 777; }
    if (r.horse) { p.wagon = 'wagon'; p.horse = 'h:' + r.horse; }
    const foes = (r.ids || []).map((id, i) => { const f = foeFrom(id, 60); f.uid = 50 + i; f.cd = 99; return f; });
    p.exp = { field: 'plains', area: 'field', stage: 12, pos: 60, mode: 'advance', encs: [60], ei: 0, foes, next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {} };
    V.mode = ''; V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {};
    for (let i = 0; i < 4; i++) drawFrame(10000 + i * 100, 10 + i * 0.1);
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
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    def skip():
        for _ in range(25):
            sk = pg.locator('.skipall')
            if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
            mb = pg.locator('#m-btns button')
            if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
            break
    skip(); EV = lambda code: pg.evaluate("s => window.__EV(s)", code); EV(LIB)
    EV("S.gold = 9e7; S.rank = 8; Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; }); S.bld.pen = 3; S.bld.stable = 3; S.modals = []; 'ok'"); skip()
    pets = EV(f"{json.dumps(KS)}.map(k => [PETS[k].name, __IP.url(__IP.spr('pet_' + k, 0), 3), __IP.url(__IP.spr('pet_' + k, 1), 3), __IP.cv(URL_CV.get(petQURL({{ kind: k, q: 0 }})) || document.createElement('canvas'), 3), !!PXU['pet_' + k]])")
    horses = EV(f"{json.dumps(HS)}.map(k => [HORSES[k].name, __IP.url(__IP.spr('horse_' + k, 0), 2), __IP.url(__IP.spr('horse_' + k, 1), 2)])")
    battles = [(k, img(EV(f"__IP.scene({json.dumps(dict(cls=['paladin', 'archbishop', 'hawkeye'], pet=k, ids=['wolf'], crop=[0, 118, 160, 82]))})"))) for k in ('wolf', 'griffon', 'imp', 'pegasus')]
    walks = [(k, img(EV(f"__IP.scene({json.dumps(dict(cls=['coachman', 'knight', 'archbishop'], horse=k, ids=[], crop=[0, 104, 200, 96]))})"))) for k in ('gray', 'war')]
    places = {}
    EV(f"(() => {{ S.parties.forEach(p => {{ p.pet = null; p.exp = null; }}); S.pets = {json.dumps(KS[1:8])}.map((k, i) => ({{ id: 800 + i, kind: k, stage: 0, name: k, lv: 3, exp: 0, q: 0 }})); S.t = 0.45 * DAY_SEC + DAY_SEC * 4; HQ.cur = null; hqGo('pen0', true); return 1; }})()"); skip(); pg.wait_for_timeout(900)
    im = Image.open(io.BytesIO(pg.locator('#hq').screenshot())).convert('RGBA'); places['pen'] = im.crop((0, int(im.height * 0.6), im.width, int(im.height * 0.9)))
    EV(f"(() => {{ S.parties.forEach(p => {{ p.horse = null; p.horse2 = null; p.exp = null; }}); S.pets = []; S.stable = {{ horses: {json.dumps({k: 1 for k in HS})} }}; S.advs = S.advs.filter(a => !rideKind(a)); HQ.cur = null; hqGo('stable0', true); return 1; }})()"); skip(); pg.wait_for_timeout(900)
    im = Image.open(io.BytesIO(pg.locator('#hq').screenshot())).convert('RGBA'); places['stable'] = im.crop((0, int(im.height * 0.5), im.width, int(im.height * 0.9)))
    print('errors', errs[:5]); br.close()

W = 1360; sh = Image.new('RGB', (W, 4000), BG); d = ImageDraw.Draw(sh)
d.text((30, 18), '새끼 펫 15 · 말 7 새 그림 — 게임에 넣음', font=fnt(28, True), fill=GOLD)
d.text((30, 62), '게임 데이터 그대로(src/pxpet70.js) 찍음 · 새끼 펫 ×3 + 펫 칸 그림 · 말 ×2 · 슬라임 새끼는 지금 그림 그대로.', font=fnt(16), fill=SUB)
y = 100; x = 30; rowh = 0
for nm, a, b, ic, new in pets:
    ims = [img(a), img(b), img(ic)]; w = sum(i.width for i in ims) + 24 + 10
    if x + w > W - 20: x = 30; y += rowh + 40; rowh = 0
    d.text((x, y), nm + ('' if new else ' (그대로)'), font=fnt(14), fill=TXT if new else SUB)
    h = max(i.height for i in ims); xx = x
    for i, im in enumerate(ims):
        bx = Image.new('RGB', (im.width, h), CELL); bx.paste(im, (0, h - im.height), im); sh.paste(bx, (xx, y + 20)); xx += im.width + (12 if i == 1 else 8)
    x += w + 26; rowh = max(rowh, h)
y += rowh + 50
d.text((30, y), '전투에서 파티 뒤를 따라오는 새끼 펫 · 상단 사육장', font=fnt(20, True), fill=TXT); y += 34; x = 30
for k, im in battles: sh.paste(im.convert('RGB'), (x, y)); x += im.width + 14
y += battles[0][1].height + 14
pn = places['pen'].resize((int(places['pen'].width * 0.75), int(places['pen'].height * 0.75)), Image.NEAREST); sh.paste(pn.convert('RGB'), (30, y)); y += pn.height + 40
d.text((30, y), '마구간 말 일곱 (A 날씬한 준마)', font=fnt(20, True), fill=TXT); y += 34; x = 30; rowh = 0
for nm, a, b in horses:
    ims = [img(a), img(b)]; w = sum(i.width for i in ims) + 10
    if x + w > W - 20: x = 30; y += rowh + 40; rowh = 0
    d.text((x, y), nm, font=fnt(14), fill=TXT); h = max(i.height for i in ims); xx = x
    for im in ims:
        bx = Image.new('RGB', (im.width, h), CELL); bx.paste(im, (0, h - im.height), im); sh.paste(bx, (xx, y + 20)); xx += im.width + 8
    x += w + 26; rowh = max(rowh, h)
y += rowh + 50
d.text((30, y), '마차를 끄는 원정 · 상단 마구간', font=fnt(20, True), fill=TXT); y += 34; x = 30
for k, im in walks: sh.paste(im.convert('RGB'), (x, y)); x += im.width + 14
y += walks[0][1].height + 14
st = places['stable'].resize((int(places['stable'].width * 0.75), int(places['stable'].height * 0.75)), Image.NEAREST); sh.paste(st.convert('RGB'), (30, y)); y += st.height + 30
sh.crop((0, 0, W, y)).save(OUT); print('sheet', OUT)
