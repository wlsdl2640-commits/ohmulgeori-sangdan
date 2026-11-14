"""해룡 몬스터 · 새끼 펫 시안을 게임 그리기로: python3 mon_rend.py <훅 페이지> <seadragon_mon.json> <출력 폴더>
PXU · MONS에 잠깐 끼워(게임 데이터는 안 바꿈) pxuSprite로 가까이(×4) + 실제 전투 화면(늪지대, 적 둘씩)을 찍는다.
→ close.png(줄마다 모습: 서 있기 둘 · 물기 · 뿜기 준비 · 뿜기) · pets.png(새끼 넷 서 있기 둘) · scene1.png(A · B) · scene2.png(C · D)"""
import json, base64, sys, os, io
from playwright.sync_api import sync_playwright
from PIL import Image
PAGE, JS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
M = json.load(open(JS))
H83 = open('/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/v83/h83.js', encoding='utf-8').read()
INJ = r"""((M) => {
  const ids = [];
  for (const L of ['A', 'B', 'C', 'D']) {
    const m = M['mon' + L], p = M['pet' + L], base = { noArm: 1, still: 1, wpn: 'none', _rows: null, _rows2: null, _gm: null };
    const add = (id, g, g2, o) => { PXU[id] = Object.assign({}, base, { g: '\n' + g + '\n', g2: '\n' + (g2 || g) + '\n', pal: o.pal, ax: o.ax, sh: o.sh || [10, 6], hip: o.hip || 10 });
      MONS[id] = Object.assign({}, MONS.wyvern, { name: o.label, plan: 'pet', drops: [], scale: 1 }); ids.push(id); };
    add('sdm' + L, m.g, m.g2, m);
    for (const k of ['bite', 'swell', 'spit']) add('sdm' + L + '_' + k, m.gm[k], m.gm[k], m);
    add('sdp' + L, p.g, p.g2, p);
  }
  PXC.clear();
  return ids.join(',');
})"""
CLOSE = r"""((ids, Z) => {
  const sp = ids.map(([id, f]) => pxuSprite(id, 'idle', f));
  const W = sp.reduce((a, s) => a + s.w * Z + 12, 12), H = Math.max(...sp.map(s => s.h)) * Z + 16;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#2a2c36'; g.fillRect(0, 0, W, H);
  let x = 12; for (const s of sp) { g.drawImage(s.cv, 0, 0, s.w, s.h, x, H - 8 - s.h * Z, s.w * Z, s.h * Z); x += s.w * Z + 12; } return c.toDataURL();
})"""
SETUP = H83 + r'''
;(() => {
  H.fresh(); S.speed = 1; S.rank = 6; Object.values(S.fields).forEach(f => { f.cleared = f.cleared || 1; });
  Object.keys(S.flags).forEach(k => { S.flags[k] = S.flags[k] || 1; });
  const L = ['paladin', 'hawkeye', 'archmage', 'archbishop'];
  S.parties = [newParty('1팀', L.map(c => H.adv(c, 150, { slv: 3, sm: 3 }).id))]; const p = S.parties[0]; p.sup = {}; p.auto = false; p.safe = false;
  S.modals = []; S.t = Math.floor(S.t / DAY_SEC) * DAY_SEC + DAY_SEC * 0.45;
  p.dest = 'swamp'; const why = startExp(p, 'swamp'); if (why) return why;
  S.view = p.id; UI.dirty = true; renderChips();
  return 'ok';
})()
'''
def img(u): return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 860}, device_scale_factor=2)
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
    print(EV(f"{INJ}({json.dumps(M)})"))
    rows = []
    for L in 'ABCD':
        rows.append(img(EV(f"{CLOSE}({json.dumps([['sdm' + L, 0], ['sdm' + L, 1], ['sdm' + L + '_bite', 0], ['sdm' + L + '_swell', 0], ['sdm' + L + '_spit', 0]])}, 3)")))
    W = max(r.width for r in rows); Hh = sum(r.height for r in rows)
    sh = Image.new('RGB', (W, Hh), (42, 44, 54)); y = 0
    for r in rows: sh.paste(r, (0, y)); y += r.height
    sh.save(OUT + '/close.png')
    pets = img(EV(f"{CLOSE}({json.dumps([[f'sdp{L}', f] for L in 'ABCD' for f in (0, 1)])}, 4)")); pets.save(OUT + '/pets.png')
    print(EV(SETUP)); skip()
    print(EV("const p = S.parties[0]; for (let i = 0; i < 900 && !(p.exp && p.exp.foes && p.exp.foes.length); i++) step(0.1); (p.exp && p.exp.foes || []).length"))
    for n, pair in enumerate((['sdmA', 'sdmB'], ['sdmC', 'sdmD'])):
        print(EV(f"""const p = S.parties[0], e = p.exp; const ids = {json.dumps(pair)};
          while (e.foes.length < 2) e.foes.push(Object.assign({{}}, e.foes[0], {{ uid: nid() }}));
          e.foes.length = 2; e.foes.forEach((f, i) => {{ f.id = ids[i]; f.name = MONS[ids[i]].name; f.hp = f.maxHp; }});
          const hold = () => {{ e.foes.forEach(f => {{ f.cd = 99; }}); S.parties[0].members.forEach(id => {{ e.cd = e.cd || {{}}; e.cd[id] = 99; e.gcd = e.gcd || {{}}; e.gcd[id] = 99; if (e.scd && e.scd[id]) Object.keys(e.scd[id]).forEach(k => {{ e.scd[id][k] = 99; }}); }}); }};
          hold(); window.__HOLD = hold; 'swapped'"""))
        EV("for (let i = 0; i < 30; i++) { window.__HOLD(); step(0.05); } 'held'")
        EV("S.modals = []; showWin(false); UI.stack = []; S.view = S.parties[0].id; 'ok'"); skip()
        EV("openBattle(); 'ok'"); pg.wait_for_timeout(2500); skip(); pg.wait_for_timeout(600)
        pg.locator('#bcv').screenshot(path=OUT + f'/scene{n + 1}.png')
    print('errors', errs[:5]); br.close()
