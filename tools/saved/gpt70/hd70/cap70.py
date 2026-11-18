"""곡창지대 평원 시험 장면: 전사 1차 + 마법사 · 성직자 · 궁수를 평원 stage에 보내고, 정한 적을 세워 실제 게임 고리로 돌리며 무대(480×400)를 찍는다
   python3 cap70.py <폴더> <stage> <적 id,id,…> [초] [간격ms] [lv]"""
import sys, os, json, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image
SP = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad'
OUT, STAGE, FOES = sys.argv[1], int(sys.argv[2]), sys.argv[3].split(',')
SEC = float(sys.argv[4]) if len(sys.argv) > 4 else 10; IV = int(sys.argv[5]) if len(sys.argv) > 5 else 200; LV = int(sys.argv[6]) if len(sys.argv) > 6 else 24
os.makedirs(OUT, exist_ok=True)
SETUP = r"""(() => {
  const wait = HD.bg && HD.war && Object.keys(HD.mon).length === 6; if (!wait) return 'notready';
  const mk = (c, i, w) => { const a = makeAdv({ cls: c, lv: %LV% }); a.id = 900 + i; a.status = 'idle'; a.wxt = null; a.eq.weapon = makeGear(w, 2, 1); return a; };
  const war = mk('warrior', 0, 'sword'); war.eq.off = makeGear('shield', 2, 1);
  const team = [war, mk('mage', 1, 'staff'), mk('cleric', 2, 'mace'), mk('archer', 3, 'bow')];
  team.forEach(a => { a.hp = derive(a).maxHp; a.mp = derive(a).maxMp; a.fat = 0; });
  S.advs = team.slice();
  if (!S.parties.length) S.parties.push(newParty('1팀', []));
  const p = S.parties[0]; p.members = team.map(a => a.id); p.pet = null; p.wagon = null; p.safe = false; p.auto = false; S.view = p.id;
  S.fields.plains = S.fields.plains || {}; S.fields.plains.best = 50;
  const r = startExp(p, 'plains'); if (r) return 'start: ' + r;
  const e = p.exp; e.stage = %STAGE%; e.pos = 10; e.encs = [40, 200, 320]; e.ei = 0; e.next = null; e.foes = [];
  const FOES = %FOES%; window.__F = FOES;
  const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? FOES.map(id => foeFrom(id, %LV%)) : ro(e2, idx, ex));
  S.speed = 1; S.t = 0.45 * DAY_SEC + DAY_SEC * 3;
  openBattle();
  return 'ok';
})()"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=2); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + SP + '/hd70/play.html'); pg.wait_for_timeout(1200)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    js = SETUP.replace('%LV%', str(LV)).replace('%STAGE%', str(STAGE)).replace('%FOES%', json.dumps(FOES))
    for _ in range(20):
        r = pg.evaluate("s => window.__EV(s)", js)
        if r != 'notready': break
        pg.wait_for_timeout(300)
    print('setup', r)
    for _ in range(80):   # 싸움이 시작될 때까지
        if pg.evaluate("() => window.__EV('(S.parties[0].exp && S.parties[0].exp.foes.length) || 0')"): break
        pg.wait_for_timeout(100)
    pg.wait_for_timeout(int(os.environ.get('SKIPMS', '200')))
    n = int(SEC * 1000 / IV)
    for i in range(n):
        u = pg.evaluate("() => window.__EV('V.off.toDataURL()')")
        Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).save(f'{OUT}/f{i:03d}.png')
        pg.wait_for_timeout(IV)
    pg.screenshot(path=f'{OUT}/screen.png')
    info = pg.evaluate("() => window.__EV('JSON.stringify({ wide: V.wide, foes: (S.parties[0].exp||{}).foes ? S.parties[0].exp.foes.map(f => [f.id, f.lv, Math.round(f.hp)]) : null, log: V.log.slice(-6).map(x => x.t || x) })')")
    print(info)
    print('errors', errs[:5]); br.close()
