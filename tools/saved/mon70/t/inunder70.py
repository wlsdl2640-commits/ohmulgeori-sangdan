"""넣은 것 확인 판 (빌드 70 하르겐 지하 — 시험 묶음 아님): python3 t/inunder70.py <훅 페이지> <출력 폴더> [DPR=2]
실제 게임 전투 창(#bcv)을 찍는다 — 옛 제국 수로(물이 찬 스테이지) · 대저수조 수문장 · 지하미궁 통로 조직 두목 셋 · 암살자 길드 본부 길드장(패턴 1 그림자 분신 · 패턴 2 독 안개).
훅 페이지 = dist/play.html의 "(() => {\\n'use strict';\\n" 뒤에 "window.__EV = s => eval(s);\\n"을 넣은 사본. 파티는 Lv에 맞는 3차 넷(성기사 · 챔피언 · 대마도사 · 대주교, 희귀 장비),
그림이 잘 보이게 스킬은 끄고(기본 공격만) 보스 HP는 문턱 근처에 붙잡아 둔다. 패턴 장면은 그 사건(따라 베기 · 독 안개)이 그려지기 시작한 뒤에 찍는다."""
import json, sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
HOOK, OUT = sys.argv[1], sys.argv[2]
DPR = int(sys.argv[3]) if len(sys.argv) > 3 else 2
ONLY = set(sys.argv[4].split(',')) if len(sys.argv) > 4 else None   # 몇 장만 다시 찍기 (판은 안 만든다)
os.makedirs(OUT, exist_ok=True)
FR = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; FBD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
fnt = lambda n, b=False: ImageFont.truetype(FBD if b else FR, n, index=2)

ADV = r"""(cls, lv, name) => {   // 시안 도구용 모험가: 그 레벨 단계의 희귀 장비를 낄 수 있는 만큼 · 숙련 · 스킬 없음
  const a = makeAdv({ cls, lv, name }); a.wxt = null; a.fat = 0; a.sleep = 0; a.skills = []; S.advs.push(a);
  let t = 0; GTIERS.forEach((G, i) => { if (G.lv <= lv && G.lv >= GTIERS[t].lv) t = i; });
  const keep = S.gear; S.gear = [];
  for (const b of [...new Set(CRAFT_IDS.concat(GTYPE_IDS))]) { const G = GTYPES[b]; if (!G || G.old || G.el || G.arena) continue; let tt = t; while (tt > 0 && !tierOk(b, tt)) tt--; if (!tierOk(b, tt)) continue; let g; try { g = gearFor(b, tt, 2, lv); } catch (e) { continue; } if (g && gearFits(a, g)) S.gear.push(g); }
  a.status = 'idle'; autoEquip(a.id); S.gear = keep;
  a.mast = {}; MAST_IDS.forEach(k => { if (!canMast(a, k)) return; const n = MAST_TIERS.filter(T => a.lv >= T.lv && jobTier(a.cls) >= T.job).length; if (n) a.mast[k] = n; });
  const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; return a;
}"""
SETUP = r"""(() => {
  S.gold = 9e9; S.rank = 8; S.fame = 9999; S.flags.guildDown = 1;
  ALL_FIELDS.forEach(f => { if (S.fields[f]) { S.fields[f].found = true; S.fields[f].best = 50; } });
  S.fields.sewer.cleared = true; S.fields.aqueduct.cleared = true;
  window.__ADV = %s; return 'ok';
})()""" % ADV
def scene(fid, area, st, lv, boss, walk=False):
    return r"""(() => {
  const p = S.parties[0];
  if (p.exp) { teamOf(p).forEach(a => { a.status = 'idle'; }); p.exp = null; }
  S.advs = [];
  const team = [['paladin', '테오'], ['champion', '루카'], ['archmage', '미라'], ['archbishop', '세라']].map(([c, n]) => window.__ADV(c, %d, n));
  p.members = team.map(a => a.id); p.safe = false; p.auto = false; p.campNight = false; p.sup = {}; formParty(p);
  const e = newExp('%s', {}, %d); p.exp = e;
  team.forEach(a => { refillAmmo(a); a.status = 'away'; });
  if ('%s' === 'dungeon') { e.area = 'dungeon'; e.stage = %d; e.encs = makeEncs(e); }
  if (%d) { const k = e.encs.length - 1; e.ei = k; e.pos = e.encs[k] - 1; }
  if (%d) { e.encs = [99]; e.ei = 0; e.pos = 5; }
  return e.area + ' ' + e.stage;
})()""" % (lv, fid, st if area == 'field' else 50, area, st, 1 if boss else 0, 1 if walk else 0)
HOLD = r"""(() => { const e = S.parties[0].exp; if (!e) return 0; const f = e.foes.find(o => o.boss || o.fb); if (f) { const hi = %s, lo = %s; if (f.hp > f.maxHp * hi) f.hp = Math.round(f.maxHp * (hi - 0.005)); if (f.hp < f.maxHp * lo) f.hp = Math.round(f.maxHp * lo); }
  S.parties[0].members.forEach(id => { const a = advById(id); if (a) { const d = derive(a); a.hp = Math.max(a.hp, d.maxHp * 0.7); a.down = false; } }); return 1; })()"""

# (파일, 제목, 땅, 구역, 스테이지, 레벨, 보스, 걷기, HP 문턱 hi · lo, 기다릴 사건(JS 조건) · 찍을 때(효과 조건), 그냥 기다릴 ms)
SHOTS = [
    ('u70_1_flood', '옛 제국 수로 Lv100 · 물이 찬 스테이지 (걸음 ×0.7)', 'aqueduct', 'field', 6, 110, 0, 1, None, None, 1800),
    ('u70_2_aqueduct', '옛 제국 수로 · 수로 히드라 · 석상 파수꾼 · 독이끼 덩굴', 'aqueduct', 'field', 24, 112, 0, 0, None, None, 2600),
    ('u70_3_cistern', '옛 제국의 대저수조 · 주인 수문장 (수도교 거인)', 'aqueduct', 'dungeon', 5, 118, 1, 0, ('0.9', '0.6'), None, 2600),
    ('u70_4_ratcrown', '지하미궁 통로 Lv120 · 20 스테이지 우두머리 쥐의 왕관 두목', 'passage', 'field', 20, 132, 1, 0, ('0.9', '0.6'), None, 2600),
    ('u70_5_redhand', '지하미궁 통로 · 40 스테이지 우두머리 붉은 손 두목', 'passage', 'field', 40, 138, 1, 0, ('0.9', '0.6'), None, 2600),
    ('u70_6_greyledger', '지하미궁 통로 · 50 스테이지 통로의 주인 잿빛 장부 두목', 'passage', 'field', 50, 142, 1, 0, ('0.9', '0.6'), None, 2600),
    ('u70_7_guildmaster', '암살자 길드 본부 Lv142 · 길드장 검은 두건', 'passage', 'dungeon', 5, 146, 1, 0, ('0.9', '0.6'), None, 2600),
    ('u70_8_pattern1', '길드장 패턴 1 「그림자 분신」 (HP 50%) — 분신 둘 · 등 뒤 분신이 따라 벤다', 'passage', 'dungeon', 5, 146, 1, 0, ('0.49', '0.3'), ("x.type === 'hurt' && x.echo", "V.fx.some(f => f.k === 'skh' && f.id === 'u:guildmaster:echo' && vt - f.t0 > 0.05 && vt - f.t0 < 0.5)"), 0),
    ('u70_9_pattern2', '길드장 패턴 2 「독 안개」 (HP 25%) — 독 약병 · 맹독 · 눈멂', 'passage', 'dungeon', 5, 146, 1, 0, ('0.24', '0.12'), ("x.type === 'aoe' && x.gas", "V.fx.filter(f => f.k === 'ugas' && vt - f.t0 > f.fl + 0.2 && vt - f.t0 < f.fl + 1.0).length >= 2"), 0),
]

def skip(pg):
    for _ in range(20):
        sk = pg.locator('.skipall')
        if sk.count() and sk.first.is_visible(): sk.first.click(); pg.wait_for_timeout(140); continue
        mb = pg.locator('#m-btns button')
        if mb.count() and mb.first.is_visible(): mb.last.click(); pg.wait_for_timeout(140); continue
        break

got = []
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 412, 'height': 880}, device_scale_factor=DPR)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(HOOK)); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(1200)
    EV = lambda code: pg.evaluate(f"() => window.__EV({json.dumps(code)})")
    print(EV(SETUP)); skip(pg)
    for fn, title, fid, area, st, lv, boss, walk, hold, wait_ev, wait_ms in SHOTS:
        if ONLY and fn not in ONLY: continue
        print(fn, EV(scene(fid, area, st, lv, boss, walk))); skip(pg)
        EV("openBattle()"); pg.wait_for_timeout(300)
        if wait_ev:
            seen = EV("S.parties[0].exp.evN"); ok = False
            for k in range(400):
                if hold: EV(HOLD % hold)
                pg.wait_for_timeout(100)
                n = EV("""(() => { const e = S.parties[0].exp; if (!e) return 0; const h = (e.ev || []).find(x => x.n > %d && (%s)); return h ? 1 : 0; })()""" % (seen, wait_ev[0]))
                if n: ok = True; break
            for k in range(120):   # 그 효과가 그려지는 동안 (화면 시계 vt 기준)
                if EV("(() => (%s) ? 1 : 0)()" % wait_ev[1]): break
                if hold: EV(HOLD % hold)
                pg.wait_for_timeout(50)
            print('  event', ok, 'fx', k)
        else:
            for k in range(wait_ms // 100):
                if hold: EV(HOLD % hold)
                pg.wait_for_timeout(100)
        path = os.path.join(OUT, fn + '.png'); pg.locator('#bcv').screenshot(path=path); got.append((path, title))
        EV("showWin(false)"); pg.wait_for_timeout(200); skip(pg)
    print('page errors:', errs[:8]); br.close()

# 판 두 장 (각 장 아래에 제목)
def sheet(items, out, head):
    ims = [(Image.open(p).convert('RGB'), t) for p, t in items]
    w = max(im.width for im, _ in ims); cap = 44 * DPR // 2; pad = 10
    H = sum(im.height + cap + pad for im, _ in ims) + 60
    S = Image.new('RGB', (w + 2 * pad, H), (18, 16, 22)); d = ImageDraw.Draw(S)
    d.text((pad, 12), head, font=fnt(26, True), fill=(240, 220, 160)); y = 60
    for im, t in ims:
        S.paste(im, (pad, y)); d.text((pad + 4, y + im.height + 6), t, font=fnt(20), fill=(230, 230, 230)); y += im.height + cap + pad
    S.save(out); print('wrote', out, S.size)
allp = [(os.path.join(OUT, x[0] + '.png'), x[1]) for x in SHOTS if os.path.exists(os.path.join(OUT, x[0] + '.png'))]   # 디스크의 장면으로 (몇 장만 다시 찍어도)
if len(allp) == len(SHOTS):
    sheet(allp[:4], os.path.join(OUT, 'under70_in_a.png'), '하르겐 지하 3구역 · 지하미궁 통로 — 게임에 넣은 모습 (1)')
    sheet(allp[4:], os.path.join(OUT, 'under70_in_b.png'), '지하미궁 통로 · 암살자 길드 본부 — 게임에 넣은 모습 (2)')
