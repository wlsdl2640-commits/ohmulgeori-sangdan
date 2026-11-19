"""전사 1차 16장 동작 확인 (시험 묶음 아님): 게임 고리를 멈추고 정한 간격으로 한 걸음씩 돌리며(시뮬레이션 + 그리기) 전사 둘레를 잘라 판으로 만든다
   python3 cap71.py <훅 페이지> <폴더> <장면> [장 수] [간격 초] [배율]
   장면: walk 걷기 · fight 싸움(들쥐 · 멧돼지) · skill 스킬을 배운 채 싸움 · block 맞음 · 막기 · die 쓰러짐 · back 돌아오는 길(달리기) · camp 야영"""
import sys, os, json, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
PAGE, OUT, SCN = sys.argv[1], sys.argv[2], sys.argv[3]
N = int(sys.argv[4]) if len(sys.argv) > 4 else 90; DT = float(sys.argv[5]) if len(sys.argv) > 5 else 1 / 30; Z = int(sys.argv[6]) if len(sys.argv) > 6 else 1
os.makedirs(OUT, exist_ok=True)
BASE = r"""
  const mk = (c, i, w, lv) => { const a = makeAdv({ cls: c, lv }); a.id = 900 + i; a.status = 'idle'; a.wxt = null; a.eq.weapon = makeGear(w, 2, 1); return a; };
  const lv = %LV%, war = mk('warrior', 0, 'sword', lv); war.eq.off = makeGear('shield', 2, 1); war.name = '브람';
  const team = %SOLO% ? [war] : [war, mk('mage', 1, 'staff', lv), mk('cleric', 2, 'mace', lv), mk('archer', 3, 'bow', lv)];
  team.forEach(a => { a.hp = derive(a).maxHp; a.mp = derive(a).maxMp; a.fat = 0; });
  S.advs = team.slice(); if (!S.parties.length) S.parties.push(newParty('1팀', []));
  const p = S.parties[0]; p.members = team.map(a => a.id); p.pet = null; p.wagon = null; p.safe = false; p.auto = false; S.view = p.id;
  S.fields.plains = S.fields.plains || {}; S.fields.plains.best = 50;
  const r = startExp(p, 'plains'); if (r) return 'start: ' + r;
  const e = p.exp; e.stage = %STAGE%; e.pos = 10; e.encs = [%ENC%, 400, 500]; e.ei = 0; e.next = null; e.foes = [];
  S.speed = 1; S.t = 0.45 * DAY_SEC + DAY_SEC * 3; openBattle();
  window.__war = war; window.__p = p;
"""
FOES = lambda ids, lv: "const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? %s.map(id => foeFrom(id, %d)) : ro(e2, idx, ex));" % (json.dumps(ids), lv)
SC = {   # 이름: (stage, lv, 혼자, 첫 싸움 자리, 더 할 것)
    'walk':  (5, 12, 0, 300, ''),
    'fight': (12, 14, 1, 14, FOES(['rat', 'boar'], 12)),
    'skill': (12, 24, 1, 14, FOES(['boar', 'boar', 'wolf'], 20) + " war.skills = ['bash', 'taunt', 'ironwall', 'sweep', 'berserk', 'earthsplit', 'warcry']; war.sl = {}; war.mp = 9999;"),
    'block': (12, 24, 1, 14, FOES(['wolf', 'wolf', 'rat'], 18) + " war.skills = ['ironwall']; const d0 = derive; derive = a => { const d = d0(a); if (a === war) { d.block = 0.9; d.maxHp = 9999; } return d; }; war.hp = 9999;"),   # 거의 다 막는다
    'die':   (30, 8, 0, 14, FOES(['aboar', 'aboar'], 30) + " war.hp = 1; team.slice(1).forEach(a => { a.hp = 1e6; });"),   # 전사만 쓰러진다 (다 쓰러지면 바로 길드 앞으로 돌아와 쓰러지는 장이 안 보인다)
    'back':  (5, 12, 0, 900, " e.mode = 'return'; e.pos = 80;"),
    'camp':  (20, 20, 0, 900, " S.t = 0.92 * DAY_SEC + DAY_SEC * 3; team.forEach(a => { a.fat = 70; }); S.wx = S.wx || {}; startCamp(p, e); e.foes = []; e.next = null;"),
}
stage, lv, solo, enc, extra = SC[SCN]
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2); errs = []
    pg.on('pageerror', lambda e: errs.append(str(getattr(e, 'stack', e))[:900]))
    pg.goto('file://' + PAGE); pg.wait_for_timeout(1200)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    for _ in range(30):
        if ev("!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6)"): break
        pg.wait_for_timeout(300)
    js = '(() => {' + BASE.replace('%LV%', str(lv)).replace('%STAGE%', str(stage)).replace('%SOLO%', str(solo)).replace('%ENC%', str(enc)) + extra + " return 'ok'; })()"
    print(SCN, ev(js))
    # 게임 고리를 멈추고 손으로 돌린다 (vt · acc는 main.js 변수)
    ev("(() => { window.requestAnimationFrame = () => 0; window.__tick = dt => { acc += dt; vt += dt; let n = 0; while (acc >= 0.1 && n < 60) { step(0.1); acc -= 0.1; n++; } drawFrame(vt * 1000, vt); const a = window.__war, e = window.__p.exp, m = e ? motNow(a, vt, 1) : null, q = V.last['a' + a.id] || [60, 180]; return JSON.stringify({ u: V.off.toDataURL(), m: m ? [m.mk, m.f, +m.p.toFixed(2), m.sk || ''] : null, q, hp: Math.round(a.hp), down: !!a.down, sc: +V.scroll.toFixed(1), foes: e ? e.foes.length : 0 }); }; return 1; })()")
    pre = int(os.environ.get('PRE', '0'))
    for _ in range(pre): ev(f"window.__tick({DT})")
    frames = []; info = []
    for i in range(N):
        r = json.loads(ev(f"window.__tick({DT})")); im = Image.open(io.BytesIO(base64.b64decode(r['u'].split(',')[1]))).convert('RGB')
        frames.append(im); info.append(r)
    # 전사 둘레를 자른다 (무대는 480×400 = 논리 240×200의 두 배)
    FULL = os.environ.get('FULL'); CW, CH = (480, 400) if FULL else (200, 150)
    cols = int(os.environ.get('COLS', '2' if FULL else '6')); per = cols * (3 if FULL else 5); sheets = 0
    for s0 in range(0, N, per):
        part = frames[s0:s0 + per]; S = Image.new('RGB', (cols * CW * Z, ((len(part) + cols - 1) // cols) * (CH * Z + 12)), (20, 20, 24)); d = ImageDraw.Draw(S)
        for k, im in enumerate(part):
            r = info[s0 + k]; qx, qy = r['q']
            c = im if FULL else im.crop((int(qx * 2 - 70), int(qy * 2 - 125), int(qx * 2 - 70) + CW, int(qy * 2 - 125) + CH))
            if Z > 1: c = c.resize((CW * Z, CH * Z), Image.NEAREST)
            x, y = (k % cols) * CW * Z, (k // cols) * (CH * Z + 12); S.paste(c, (x, y + 12))
            d.text((x + 2, y), '%d %s sc%s' % (s0 + k, '' if not r['m'] else '%s f%d %.2f %s' % tuple(r['m']), r['sc']), fill=(255, 255, 255))
        S.save(f'{OUT}/{SCN}_{sheets}.png'); sheets += 1
    runs = []   # 동작 이름이 이어진 구간 (장 번호)
    for i, r in enumerate(info):
        k = r['m'][0] + (':' + r['m'][3] if r['m'][3] else '') if r['m'] else '-'
        if runs and runs[-1][0] == k: runs[-1][2] = i
        else: runs.append([k, i, i])
    print('motions', ' '.join('%s[%d-%d]' % tuple(r) for r in runs))
    print('sheets', sheets, 'last', {k: v for k, v in info[-1].items() if k != 'u'}, 'errors', errs[:4])
    br.close()
