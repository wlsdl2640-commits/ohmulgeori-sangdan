"""평원 한낮 하늘만(풍경 · 사람 없이) + 파티 넷의 옆모습 그림을 게임에서 뽑는다"""
import json, base64, io, sys, os
from playwright.sync_api import sync_playwright
from PIL import Image
PAGE, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
JS = r"""(() => {
  drawWeather = () => {}; groundWx = () => {};
  S.t = 0.45 * DAY_SEC + DAY_SEC * 3;
  const mkA = (c, i, w) => { const a = makeAdv({ cls: c, lv: 30 }); a.id = 900 + i; a.status = 'away'; a.wxt = null; a.look = { hair: ['#5a3a22', '#2a2a32', '#c87a3a', '#6a4a2a'][i], skin: '#e0ac7e' }; a.eq.weapon = makeGear(w, 2, 0); return a; };
  const war = mkA('warrior', 0, 'sword'); war.eq.off = makeGear('shield', 2, 0);
  const team = [war, mkA('mage', 1, 'staff'), mkA('cleric', 2, 'mace'), mkA('archer', 3, 'bow')];
  S.advs = team.slice();
  if (!S.parties.length) S.parties.push(newParty('1팀', [])); const p = S.parties[0]; p.members = team.map(a => a.id); S.view = p.id; p.pet = null; p.sup = p.sup || {};
  p.exp = { field: 'plains', area: 'field', stage: 3, pos: 60, mode: 'advance', encs: [999], ei: 0, foes: [], next: [], ev: [], evN: 0, buffs: [], cd: {}, scd: {}, gcd: {}, sta: {}, kills: 0, bag: {}, gbag: [], log: [], dots: {}, sup: {} };
  const DL = drawLand, DF = drawFore, FSc = fieldScene; drawLand = () => {}; drawFore = () => {}; fieldScene = () => {};
  V.mode = ''; for (let i = 0; i < 3; i++) drawFrame(20000 + i * 40, 20 + i * 0.04);
  const sky = V.off.toDataURL(); drawLand = DL; drawFore = DF; fieldScene = FSc;
  const heroes = team.map(a => { const s = pxsAdvSprite(a, 'idle', 0); return { cls: a.cls, u: s.cv.toDataURL(), w: s.w, h: s.h, ax: s.ax, ay: s.ay }; });
  return JSON.stringify({ sky, heroes, sh: SHADOW_R, zs: ZS });
})()"""
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
    r = json.loads(pg.evaluate("s => window.__EV(s)", JS))
    Image.open(io.BytesIO(base64.b64decode(r['sky'].split(',')[1]))).save(os.path.join(OUT, 'sky.png'))
    json.dump({'heroes': r['heroes'], 'sh': r['sh'], 'zs': r['zs']}, open(os.path.join(OUT, 'heroes.json'), 'w'))
    print('errors', errs[:3], 'sh', r['sh'], 'zs', r['zs']); br.close()
