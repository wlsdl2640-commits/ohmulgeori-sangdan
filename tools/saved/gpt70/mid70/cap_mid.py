"""사이 값 시안 5단계: 같은 장면 · 같은 때를 그림 자료만 바꿔 가며 찍는다 (시험 묶음 아님 — 게임 고리를 멈추고 손으로 한 걸음씩)
   python3 cap_mid.py <시험 페이지> <폴더> <장면> [장 수] [간격 초] [미리 돌릴 장 수]      환경 OLD=1 이면 리마스터 전사 · 몬스터 그림을 끄고 옛 뭉툭 도트로 · TEAM=warrior,mage,mage 처럼 파티 직업(기본 전사만)
   장면: walk 전사 셋이 평원을 걷는다 · solo 전사 하나가 걷는다 · fight 전사 셋이 들늑대 · 들쥐 · 뿔토끼와 싸운다 · mons 전사 하나와 허수아비 · 멧돼지 · 갑옷 멧돼지
         boss · boss2 우두머리(2배) 들늑대 · 허수아비 / 멧돼지 · 갑옷 멧돼지
   시뮬레이션(step)과 그리기(drawFrame)에 씨앗이 다른 난수를 따로 물려서, 그림이 달라도 싸움은 똑같이 흘러간다. 날씨도 맑은 날로 고정.
   → <폴더>/<장면>_<i>.png (무대 480×400 그대로) · <장면>.json (장마다 전사 · 몬스터 자리)"""
import sys, os, json, base64, io
from playwright.sync_api import sync_playwright
PAGE, OUT, SCN = sys.argv[1], sys.argv[2], sys.argv[3]
N = int(sys.argv[4]) if len(sys.argv) > 4 else 60; DT = float(sys.argv[5]) if len(sys.argv) > 5 else 1 / 15; PRE = int(sys.argv[6]) if len(sys.argv) > 6 else 0
OLD = os.environ.get('OLD'); os.makedirs(OUT, exist_ok=True)
RNG = "const mb = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; window.__r0 = Math.random; window.__rs = mb(20261119); window.__rd = mb(777); Math.random = window.__rs;"   # 화면 갱신 타이머 같은 다른 코드는 원래 난수(__r0)를 쓴다
BASE = RNG + r"""
  const CL = %CLS%, mk = (i, lv) => { const c = CL[i % CL.length], a = makeAdv({ cls: c, lv }); a.id = 900 + i; a.status = 'idle'; a.wxt = null; a.traits = []; a.eq.weapon = makeGear(c === 'mage' ? 'staff' : c === 'archer' ? 'bow' : c === 'cleric' ? 'mace' : c === 'rogue' ? 'dagger' : c === 'porter' ? 'club' : 'sword', 2, 1); a.eq.off = c === 'mage' ? null : makeGear('shield', 2, 1); a.name = ['브람', '한스', '도윤'][i]; return a; };
  const lv = %LV%, team = [0, 1, 2].slice(0, %TEAM%).map(i => mk(i, lv));
  team.forEach(a => { a.hp = derive(a).maxHp; a.mp = derive(a).maxMp; a.fat = 0; a.skills = []; });
  S.advs = team.slice(); if (!S.parties.length) S.parties.push(newParty('1팀', []));
  const p = S.parties[0]; p.members = team.map(a => a.id); p.pet = null; p.wagon = null; p.safe = false; p.auto = false; S.view = p.id;
  S.fields.plains = S.fields.plains || {}; S.fields.plains.best = 50;
  S.speed = 1; S.t = 0.45 * DAY_SEC + DAY_SEC * 3;
  for (let sd = 1; sd < 400; sd++) { S.wx = { seed: sd }; const w = wxDay(Math.floor(S.t / DAY_SEC)); if (w.sky === 'clear' && !w.wind && !w.heat && !w.cold) break; }   // 맑은 날
  const r = startExp(p, 'plains'); if (r) return 'start: ' + r;
  const e = p.exp; e.stage = %STAGE%; e.pos = 10; e.encs = [%ENC%, 400, 500]; e.ei = 0; e.next = null; e.foes = [];
  openBattle(); window.__team = team; window.__p = p; acc = 0; vt = 60; V.scroll = routePos(e) * 1.6; V.tail = false;
"""
FOES = lambda ids, lv, hp: "const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? %s.map(id => { const f = foeFrom(id, %d); f.maxHp = f.hp = %d; return f; }) : ro(e2, idx, ex));" % (json.dumps(ids), lv, hp)
TOUGH = " const d0 = derive; derive = a => { const d = d0(a); if (team.includes(a)) d.maxHp = 99999; return d; }; team.forEach(a => { a.hp = 99999; });"
SC = {   # 이름: (stage, lv, 전사 수, 첫 싸움 자리, 더 할 것)
    'walk':  (5, 12, 3, 300, ''),
    'fight': (12, 14, 3, 14, FOES(['wolf', 'rat', 'rabbit'], 12, 6000) + TOUGH),
    'mons':  (12, 14, 1, 14, FOES(['scarecrow', 'boar', 'aboar'], 12, 60000) + TOUGH),
    'solo':  (5, 12, 1, 300, ''),
    'boss':  (12, 14, 3, 14, "const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? [10, 20].map(st => { const f = fieldBoss(FIELDS.plains, st, 12); f.maxHp = f.hp = 60000; return f; }) : ro(e2, idx, ex));" + TOUGH),   # 우두머리 들늑대 · 허수아비 (2배)
    'boss2': (12, 14, 3, 14, "const ro = rollFoes; rollFoes = (e2, idx, ex) => (e2 === e ? [30, 40].map(st => { const f = fieldBoss(FIELDS.plains, st, 12); f.maxHp = f.hp = 60000; return f; }) : ro(e2, idx, ex));" + TOUGH),   # 우두머리 멧돼지 · 갑옷 멧돼지
}
stage, lv, nteam, enc, extra = SC[SCN]
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=1); errs = []
    pg.on('pageerror', lambda e: errs.append(str(getattr(e, 'stack', e))[:900]))
    h = open(PAGE, encoding='utf-8').read(); RN = 'const rnd = Math.random;'; assert h.count(RN) == 1   # core.js는 난수 함수를 처음에 잡아 둔다 → 찍는 사본에서만 그때그때 Math.random을 부르게 바꿔 씨앗 난수가 먹게 한다
    tmp = os.path.abspath(PAGE) + '.cap.html'; open(tmp, 'w', encoding='utf-8').write(h.replace(RN, 'const rnd = () => Math.random();'))
    pg.goto('file://' + tmp); pg.wait_for_timeout(1200)
    pg.locator('button', has_text='문 열기').first.click(); pg.wait_for_timeout(1500)
    for _ in range(25):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(120); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(120); continue
        break
    ev = lambda s: pg.evaluate("s => window.__EV(s)", s)
    for _ in range(40):
        if ev("!!(HD.bg && HD.war && Object.keys(HD.mon).length === 6)"): break
        pg.wait_for_timeout(300)
    if OLD: print('옛 그림으로', ev("(() => { HD.war = null; for (const id of ['rat', 'rabbit', 'wolf']) { delete HD.mon[id]; delete MON_DIM[id]; delete MON_BACK[id]; } HD.spr.clear(); return Object.keys(HD.mon).join(' '); })()"))
    if os.environ.get('LINE'):   # 시안: 예전처럼 한 줄로 세우기 (11-20 사용자 「화면을 길게 … 일직선으로」) — 풍경을 55칸 내려 땅을 얇은 띠로, 모두 y 192에 한 줄. 찍은 뒤 아래 100칸(480×200)만 오려 본다
        print('line', ev("""(() => { const B = HD70_DATA.bg.plains, D = 55; B.gr.y += D; B.mid.y += D; B.back.y += D; B.blades.y += D; B.skyOy += D; delete BG.plains_hd;
          formSlots = team => { const o = team.map((a, i) => [a.down ? 4 : formRank(a.cls), i]).sort((p, q) => p[0] - q[0] || p[1] - q[1]), n = o.length, gap = Math.min(24, 96 / Math.max(1, n - 1)), out = [];
            o.forEach(([r, i], k) => { out[i] = [Math.round(108 - gap * k), 192]; }); out.petX = Math.max(6, Math.round(108 - gap * n)); return out; };
          [[100, 192], [74, 192], [48, 192], [22, 192], [10, 192], [4, 192]].forEach((q, i) => { SLOT_PW[i] = q; SLOT_P[i] = q; }); return 'ok'; })()"""))
    js = '(() => {' + BASE.replace('%CLS%', json.dumps(os.environ.get('TEAM', 'warrior').split(','))).replace('%LV%', str(lv)).replace('%STAGE%', str(stage)).replace('%TEAM%', str(nteam)).replace('%ENC%', str(enc)) + extra + " Math.random = window.__r0; return 'ok ' + wxDay(Math.floor(S.t / DAY_SEC)).sky + ' seed ' + S.wx.seed; })()"
    ev("window.requestAnimationFrame = () => 0"); pg.wait_for_timeout(200)   # 게임 고리를 먼저 멈춘다 (걸려 있던 한 장이 지나가게 기다린 뒤 장면을 차린다 — 그 사이에 고리가 돌면 싸움이 달라진다)
    print(SCN, ev(js))
    ev("""(() => {
      window.__tick = dt => { acc += dt; vt += dt; let n = 0; Math.random = window.__rs; while (acc >= 0.1 && n < 60) { step(0.1); acc -= 0.1; n++; } Math.random = window.__rd; drawFrame(vt * 1000, vt); Math.random = window.__r0;
        const e = window.__p.exp, T = window.__team;
        return JSON.stringify({ u: V.off.toDataURL(), a: T.map(a => { const m = e ? motNow(a, vt, 1) : null, q = V.last['a' + a.id]; return { q: q ? [q[0], q[1]] : null, m: m ? [m.mk, m.f] : null, hp: Math.round(a.hp) }; }), f: e ? e.foes.map(f => { const q = V.last['f' + f.uid]; return { id: f.id, q: q ? [q[0], q[1]] : null, hp: Math.round(f.hp) }; }) : [], sc: +V.scroll.toFixed(2) }); };
      return 1; })()""")
    for _ in range(PRE): ev(f"window.__tick({DT})")
    info = []
    for i in range(N):
        r = json.loads(ev(f"window.__tick({DT})")); open(f'{OUT}/{SCN}_{i}.png', 'wb').write(base64.b64decode(r.pop('u').split(',')[1])); info.append(r)
    json.dump({'dt': DT, 'pre': PRE, 'frames': info}, open(f'{OUT}/{SCN}.json', 'w'))
    runs = []
    for i, r in enumerate(info):
        k = '/'.join((a['m'][0] if a['m'] else '-') for a in r['a'])
        if runs and runs[-1][0] == k: runs[-1][2] = i
        else: runs.append([k, i, i])
    print('motions', ' '.join('%s[%d-%d]' % tuple(r) for r in runs)[:1500])
    print('last', info[-1], 'errors', errs[:4])
    br.close(); os.remove(tmp)
