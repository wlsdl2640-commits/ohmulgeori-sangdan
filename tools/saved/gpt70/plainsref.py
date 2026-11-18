"""GPT 그래픽 업그레이드용 참고 판 (11-18 13:58 사용자 「첫 원정지였던 평원지대를 GPT에게 그래픽 업그레이드를 부탁」): python3 plainsref.py <훅 페이지> <출력 폴더>
지금 게임 그림 그대로 — ① 실제 화면(필드 · 던전 주인) ② 배경 겹 다섯(크기 · 흐르는 빠르기) ③ 몬스터 여섯(서 있기 둘 + 동작 장, 칸 크기)
훅 페이지 = dist/play.html에 window.__EV를 넣은 사본 (mon70 README와 같음)"""
import json, base64, io, sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)
GOLD, TXT, SUB, BG = (240, 196, 90), (236, 230, 220), (165, 160, 150), (21, 23, 28)
img = lambda u: Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA')

SCENE = r"""((r) => {
  drawWeather = () => {}; groundWx = () => {};
  S.t = r.hour * DAY_SEC + DAY_SEC * 3;
  const cls = ['warrior', 'mage', 'cleric', 'archer'];
  const team = cls.map((c, i) => { const a = makeAdv({ cls: c, lv: r.lv }); a.id = 900 + i; a.status = 'away'; a.wxt = null; return a; });
  S.advs = team.slice();
  if (!S.parties.length) S.parties.push(newParty('1팀', [])); const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.pet = null; p.sup = p.sup || {};
  const foes = r.ids.map((id, i) => { const f = foeFrom(id, r.lv); f.uid = 50 + i; f.cd = 99; if (r.boss) f.boss = true; return f; });
  const e = { field: r.field, area: r.area, stage: 3, pos: 60, mode: 'advance', encs: [60], ei: 0, foes, next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {}, sup: {} };
  p.exp = e; V.mode = ''; V.fx = []; V.fmot = {}; V.fhit = {}; V.mot = {};
  for (let i = 0; i < 4; i++) drawFrame(10000 + i * 100, 10 + i * 0.1);
  const c = document.createElement('canvas'); c.width = 240 * HI; c.height = 160 * HI;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(V.off, 0, 40 * HI, 240 * HI, 160 * HI, 0, 0, 240 * HI, 160 * HI);
  return c.toDataURL();
})"""
LAYERS = r"""(() => { const b = buildPlains(), out = {};
  for (const k of ['back', 'far', 'mid', 'gr', 'fore']) out[k] = b[k].toDataURL();
  const c = document.createElement('canvas'); c.width = 480; c.height = 128; const g = c.getContext('2d');
  b.props(g, 0, 0.6, 0); out.props = c.toDataURL(); return JSON.stringify(out); })()"""
SPR = r"""((list, Z) => {
  const sp = list.map(([id, mk, f]) => pxuSprite(id, mk, f));
  const up = Math.max(...sp.map(s => s.ay)), dn = Math.max(...sp.map(s => s.h - s.ay));
  const W = sp.reduce((a, s) => a + s.w * Z + 16, 16), H = (up + dn) * Z + 16;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#2a2c36'; g.fillRect(0, 0, W, H); g.fillStyle = '#3a3c48'; g.fillRect(0, 8 + up * Z, W, 2);
  let x = 16; for (const s of sp) { g.drawImage(s.cv, 0, 0, s.w, s.h, x, 8 + (up - s.ay) * Z, s.w * Z, s.h * Z); x += s.w * Z + 16; }
  return c.toDataURL();
})"""
MONS6 = [('rat', '들쥐', [['qbite', 3], ['qpounce', 4]], '물기 · 덮치기'), ('slime', '초록 슬라임', [['sbounce', 2], ['sbounce', 4]], '눌렸다가 튀어 덮치기'),
         ('rabbit', '뿔토끼', [['qcharge', 3], ['qpounce', 4]], '들이받기 · 덮치기'), ('wolf', '들늑대', [['qbite', 3], ['qpounce', 4]], '물기 · 덮치기'),
         ('goblin', '고블린', [['down', 4], ['thrust', 4]], '단검 내려베기 · 찌르기 (앞 팔과 단검은 게임이 그린다)'),
         ('ratking', '들쥐왕 (던전 「버려진 곡물 창고」 주인)', [['down', 4], ['rbite', 4]], '밀 이삭 홀 · 물기 (HP 30% 아래는 찢어진 망토 모습)')]

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
    EV = lambda code: pg.evaluate("s => window.__EV(s)", code)
    shots = [('필드 「평원」 낮', img(EV(f"{SCENE}({json.dumps(dict(ids=['wolf', 'rat', 'rabbit'], field='plains', area='field', lv=6, hour=0.45, boss=False))})"))),
             ('필드 「평원」 저녁', img(EV(f"{SCENE}({json.dumps(dict(ids=['goblin', 'slime'], field='plains', area='field', lv=6, hour=0.72, boss=False))})"))),
             ('던전 「버려진 곡물 창고」 · 주인 들쥐왕', img(EV(f"{SCENE}({json.dumps(dict(ids=['ratking'], field='plains', area='dungeon', lv=9, hour=0.45, boss=True))})")))]
    L = json.loads(EV(LAYERS)); L = {k: img(v) for k, v in L.items()}
    mons = [(nm, how, img(EV(f"{SPR}({json.dumps([[k, 'idle', 0], [k, 'idle', 1]] + [[k, mk, f] for mk, f in fr] + ([['ratking_t', 'idle', 0]] if k == 'ratking' else []))}, 4)"))) for k, nm, fr, how in MONS6]
    sizes = EV("(() => JSON.stringify(Object.fromEntries(['rat','slime','rabbit','wolf','goblin','ratking'].map(id => { const r = PXU[id].g.split('\\n').filter(x => x.length); return [id, [Math.max(...r.map(x => x.length)), r.length]]; }))))()")
    sizes = json.loads(sizes)
    print('page errors:', errs[:5]); br.close()

for k, v in L.items(): v.save(os.path.join(OUT, f'plains_layer_{k}.png'))   # 겹 원본 (1배)

W = max(1000, max(im.width for _, _, im in mons) + 40); parts = []
def text(d, xy, s, n=18, c=TXT, b=False): d.text(xy, s, font=fnt(n, b), fill=c)
# 1) 실제 화면
for title, im in shots: parts.append(('shot', title, im))
H = 90 + sum(im.height + 44 for _, _, im in parts)
# 2) 겹
LZ = 2
H += 60 + sum(L[k].height * LZ + 52 for k in ['back', 'far', 'mid', 'gr', 'fore']) + 128 * LZ + 52
# 3) 몬스터
H += 90 + sum(im.height + 70 for _, _, im in mons)
S = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(S); y = 16
text(d, (20, y), '평원 — 지금 게임 그림 (GPT 그래픽 업그레이드 참고 판)', 28, GOLD, True); y += 44
text(d, (20, y), '① 실제 화면 (2배) — 파티는 왼쪽에서 오른쪽으로 걷고, 몬스터는 오른쪽에서 왼쪽을 본다. 하늘 · 해 · 달 · 구름 · 밤 어둠은 게임이 시간대마다 그린다.', 15, SUB); y += 30
for _, title, im in parts:
    S.paste(im, (20, y)); text(d, (20, y + im.height + 4), title, 16); y += im.height + 44
text(d, (20, y), '② 배경 겹 다섯 (2배로 보임 · 원본 크기 표시) — 좌우 끝이 이어져 끝없이 흐른다. 빈 곳은 투명(하늘은 그리지 않음).', 17, GOLD, True); y += 34
SPD = {'back': '먼 산 · 480×128 · 가장 느리게(×0.08) · 게임이 하늘빛 안개 42%를 덮음', 'far': '먼 언덕 · 480×128 · ×0.2 · 안개 18%', 'mid': '중경 들판(밀밭 · 나무 · 울타리 · 농가 · 풍차 몸통 · 건초) · 480×128 · ×0.5',
       'gr': '땅 띠 · 480×28 · 화면 y100부터 · ×1 (캐릭터가 걷는 길 — 흙길)', 'fore': '앞 풀 · 480×28 · 캐릭터 앞에 그려짐 · ×1.15'}
chk = Image.new('RGBA', (480 * LZ, 128 * LZ))
cd = ImageDraw.Draw(chk)
for yy in range(0, 128 * LZ, 16):
    for xx in range(0, 480 * LZ, 16): cd.rectangle([xx, yy, xx + 15, yy + 15], fill=(58, 62, 74, 255) if (xx // 16 + yy // 16) % 2 else (48, 52, 62, 255))
for k in ['back', 'far', 'mid', 'gr', 'fore']:
    im = L[k]; big = im.resize((im.width * LZ, im.height * LZ), Image.NEAREST)
    base = chk.crop((0, 0, big.width, big.height)).copy(); base.alpha_composite(big)
    S.paste(base.convert('RGB'), (20, y)); text(d, (20, y + big.height + 4), SPD[k], 15); y += big.height + 52
comp = Image.new('RGBA', (480, 128), (150, 190, 230, 255))
for k in ['back', 'far', 'mid']: comp.alpha_composite(L[k])
comp.alpha_composite(L['props']); comp.alpha_composite(L['gr'], (0, 100)); comp.alpha_composite(L['fore'], (0, 100))
S.paste(comp.resize((960, 256), Image.NEAREST).convert('RGB'), (20, y)); text(d, (20, y + 260), '다섯 겹을 겹친 모습 (풍차 날개는 따로 돈다 · 하늘색은 예시)', 15); y += 128 * LZ + 52
text(d, (20, y), '③ 몬스터 여섯 (4배) — 서 있기 두 장(숨쉬기) + 동작 장', 17, GOLD, True); y += 28
text(d, (20, y), '그림은 오른쪽을 본다(게임이 뒤집어 왼쪽을 보게 그림) · 한 칸 = 게임 화면 2×2 픽셀(배경 한 픽셀의 두 배) · 바닥 줄 = 발 높이', 15, SUB); y += 30
for (nm, how, im), (k, *_ ) in zip(mons, MONS6):
    w, h = sizes[k]
    text(d, (20, y), f'{nm} — 칸 {w}×{h} · {how}', 16); y += 26
    S.paste(im.convert('RGB'), (20, y)); y += im.height + 44
S = S.crop((0, 0, W, y + 10)); out = os.path.join(OUT, 'plains_ref.png'); S.save(out); print('wrote', out, S.size)
