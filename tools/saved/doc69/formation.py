"""빌드 69 설명 문서용 대형 장면 (form69/shot89f.py를 인자로): python3 formation.py <훅 페이지> <출력 폴더> → z_cur_A..F.png · z_meta.json · formation.png(넣은 것만, 파티 여섯)"""
import json, sys
from playwright.sync_api import sync_playwright
import os
PAGE, D = sys.argv[1], sys.argv[2].rstrip('/') + '/'; os.makedirs(D, exist_ok=True)
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
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1200); skip(pg)
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

# 판: 넣은 것만 (2열 × 3줄) — 라벨은 Noto Sans CJK KR
from PIL import Image, ImageDraw, ImageFont
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
fb = ImageFont.truetype(F.replace('Regular', 'Bold'), 26, index=1); fr = ImageFont.truetype(F, 21, index=1)
TITLE = {'A': '근접 셋 + 원거리 + 짐꾼', 'B': '근접 둘 + 마법 + 힐러 + 짐꾼', 'C': '근접 넷 — 넷째는 가운데 줄 맨 앞', 'D': '근접 없음 — 줄을 앞으로 당긴다', 'E': '한 줄에 하나씩', 'F': '짐꾼 없이'}
ims = {k: Image.open(D + f'z_cur_{k}.png').convert('RGB') for k in COMPS}
ims = {k: im.crop((0, int(im.height * 0.5), im.width, im.height)) for k, im in ims.items()}   # 하늘을 잘라 땅 쪽만
w, h = ims['A'].size; pad, lab = 24, 74
sheet = Image.new('RGB', (pad + 2 * (w + pad), 70 + 3 * (h + lab + pad)), (24, 26, 33))
dr = ImageDraw.Draw(sheet)
dr.text((pad, 18), '대형 — 오른쪽이 앞(적 쪽): 근접 맨 앞 · 원거리 · 마법 가운데 · 힐러 그 뒤 · 짐꾼 계열 맨 뒤', font=fb, fill=(255, 215, 122))
for i, k in enumerate(COMPS):
    x = pad + (i % 2) * (w + pad); y = 70 + (i // 2) * (h + lab + pad)
    names = ' · '.join(m[0] for m in sorted(meta[f'cur_{k}'], key=lambda m: -m[2]))
    dr.text((x, y), TITLE[k], font=fb, fill=(242, 242, 242)); dr.text((x, y + 34), names + '  (앞 → 뒤)', font=fr, fill=(154, 163, 181))
    sheet.paste(ims[k], (x, y + lab))
sheet.save(D + 'formation.png'); print('sheet', sheet.size)
