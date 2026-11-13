"""직업별 장비 도감 자료 뽑기 — python3 extract.py <훅 넣은 play.html> <catalog.json>
훅: dist/play.html의 "(() => {\n'use strict';\n" 뒤에 "window.__EV = s => eval(s);\n"을 넣은 사본 (CLAUDE.md 빌드 67 절)"""
import json, sys
from playwright.sync_api import sync_playwright
HOOK = sys.argv[1]
JS = r"""(() => {
  const out = { slots: SLOTS.map(([k, n]) => [k, n]), icons: [], lines: [], jobs: {}, types: {}, common: [] };
  const IM = new Map(); const icon = u => { if (!u) return -1; if (!IM.has(u)) { IM.set(u, out.icons.length); out.icons.push(u); } return IM.get(u); };
  const reqLv = c => { const t = jobTier(c); return t <= 1 ? 1 : (JOB_REQ[t] && JOB_REQ[t].lv) || 1; };
  const SMAX = BUILDINGS.smithy.max;
  const dropAt = t => { const s = new Set(GTYPE_IDS.filter(x => tierOk(x, t))); if (s.has('shield')) SHIELDS.filter(x => tierOk(x, t)).forEach(x => s.add(x)); return s; };
  const DROP = GTIERS.map((_, t) => dropAt(t));
  const artN = b => { const G = GTYPES[b]; if (G.art && typeof ARMART !== 'undefined' && ARMART[G.art]) return ARMART[G.art].length; if (G.art && typeof HDART !== 'undefined' && HDART[G.art]) return HDART[G.art].length; if (G.art && GEARART[G.art]) return GEARART[G.art].length; if (typeof WICON !== 'undefined' && WICON[b]) return WICON[b].length; return 0; };
  // ── 장비 종류마다 그림 차례(착용 레벨 낮은 순) ──
  const typeIds = Object.keys(GTYPES).filter(b => !GTYPES[b].old && GTYPES[b].slot);
  for (const b of typeIds) {
    const G = GTYPES[b], n = artN(b), list = [];
    const info = (g, on) => {
      const t = g.t, L = gearReqLv(g);
      const craft = CRAFT_IDS.includes(b) && GTIERS[t] && GTIERS[t].smith <= SMAX && (LADDER_B[b] ? ladderSteps(t).includes(g.lv) : tierOk(b, t));
      const drop = !!(GTIERS[t] && DROP[t].has(b)) && (!LADDER_B[b] || ladderSteps(t).includes(g.lv));
      const arena = ARENA_GEAR.includes(b) && t >= 2 && (LADDER_B[b] ? ladderSteps(t).includes(g.lv) : tierOk(b, t));
      const buy = !!G.ammo && craft;
      return { i: icon(gearIconURL(g)), n: gearName(g), lv: L, t, tn: GTIERS[t].name, st: statLine(gearStats(g)), d: (isUniq(g) && uniqDesc(g)) || '', on: on ? 1 : 0, s: [drop ? 'd' : '', craft ? 'c' : '', arena ? 'a' : '', buy ? 'b' : ''].filter(Boolean).join('') };
    };
    if (LADDER_B[b]) {
      ARM_LADDER.forEach((L, k) => {
        const on = ladderOn(L); if (!on && (!n || k >= n)) return;
        const g = { id: 0, base: b, t: lvTier(L), q: 0, lv: L, bonus: null, runes: [] };
        if (on) list.push(info(g, 1)); else list.push({ i: icon(gearIconURL(g)), n: isUniq(g) ? uniqName(g) : `${GTYPES[b].name} Lv${L}`, lv: L, on: 0, fut: 1, s: '' });
      });
    } else if (UNIQ_ONLY[b] != null) {
      const t = uniqOnlyTier(b), g = { id: 0, base: b, t: Math.max(0, t), q: 0, bonus: null, runes: [] };
      if (t >= 0) list.push(info(g, 1)); else list.push({ i: icon(gearIconURL(g)), n: WNAME[b][0], lv: UNIQ_ONLY[b], on: 0, fut: 1, s: '' });
    } else {
      GTIERS.forEach((T, t) => { if (!tierOk(b, t) || (G.arena && t < 2)) return; list.push(info({ id: 0, base: b, t, q: 0, bonus: null, runes: [] }, 1)); });   // 투기장 전용은 강철 단계부터 판다
      const A = G.art && ((typeof ARMART !== 'undefined' && ARMART[G.art]) || (typeof HDART !== 'undefined' && HDART[G.art]) || GEARART[G.art]);   // 단계가 늘면 쓰일 그림 (빌드 67 무기 판: 이름도)
      if (A) for (let k = GTIERS.length; k < A.length; k++) list.push({ i: icon(A[k]), n: (UNIQ_T0[b] != null && WNAME[b] && WNAME[b][k - UNIQ_T0[b]]) || '다음 단계 그림', lv: null, on: 0, fut: 1, s: '' });
    }
    list.sort((x, y) => (x.lv == null) - (y.lv == null) || (x.lv || 0) - (y.lv || 0));
    out.types[b] = { name: G.name, slot: G.slot, who: gearWho(b), w: G.w, two: twoHand({ base: b, t: 0 }) ? 1 : 0, ammo: G.ammo ? 1 : 0, arena: G.arena ? 1 : 0, ladder: LADDER_B[b] ? 1 : 0, all: (G.cls || []).includes('all') ? 1 : 0, desc: G.desc || '', n, list };
  }
  // ── 직업 그림 (그 직업 레벨의 대표 무기 · 부장비를 들고 앞모습 · 탈것은 타고) ──
  const offOf = (a, t) => { const L = typeIds.filter(b => GTYPES[b].slot === 'off' && clsFits(a, b) && !GTYPES[b].el && !(GTYPES[b].cls || []).includes('all') && (LADDER_B[b] ? ladderFor(a.lv, t) : tierOk(b, t)));
    const wn = b => ALL_CLASS_IDS.filter(c => clsFits({ cls: c }, b)).length; return L.sort((x, y) => wn(x) - wn(y))[0]; };
  const sprite = c => {
    const lv = reqLv(c), a = makeAdv({ cls: c, lv, name: '그림' }); a.id = 4; a.look = { hair: HAIRS[1], skin: SKINS[1] };
    const t = lvTier(lv); a.eq.weapon = gearFor(weaponOf(c, t), t, 0, lv);
    const ob = twoHand(a.eq.weapon) ? null : offOf(a, t); a.eq.off = ob ? gearFor(ob, t, 0, lv) : null;
    if (needsArrows(a) && !a.eq.ammo) a.eq.ammo = makeGear('arrows', arrowTierOf(lv), 0);
    if (typeof rideEnsure === 'function') rideEnsure(a);
    const W = 200, H = 170, [cv, x] = mkCanvas(W, H); x.translate(W / 2, H - 8); drawAdv(x, a, 0, {});
    const d = x.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) for (let k = 0; k < W; k++) if (d[(y * W + k) * 4 + 3]) { if (k < x0) x0 = k; if (k > x1) x1 = k; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const w = x1 - x0 + 1, h = y1 - y0 + 1, [c2, x2] = mkCanvas(w, h); x2.drawImage(cv, -x0, -y0);
    return { img: c2.toDataURL(), w, h, weapon: a.eq.weapon ? a.eq.weapon.base : null, off: a.eq.off ? a.eq.off.base : null };
  };
  const roots = ADV_CATS.map(([k, n]) => [k, n]).filter(([k]) => CLASSES[k]);
  const walk = (c, acc, par) => { acc.push([c, par]); (JOB_TREE[c] || []).forEach(k => walk(k, acc, c)); return acc; };
  const slotOrder = out.slots.map(s => s[0]);
  const typeOrder = [...new Set([...GTYPE_IDS, ...CRAFT_IDS, ...ARENA_GEAR, ...SHIELDS, ...typeIds])].filter(b => out.types[b]);
  for (const [root, lname] of roots) {
    const ids = walk(root, [], null);
    out.lines.push({ id: root, name: lname, jobs: ids.map(([c]) => c) });
    for (const [c, par] of ids) {
      const C = CLASSES[c], a0 = { cls: c, lv: 999, eq: {} };
      const slots = slotOrder.map(s => [s, typeOrder.filter(b => out.types[b].slot === s && !out.types[b].all && clsFits(a0, b) && (s !== 'ammo' || hasAmmoSlot(a0)))]).filter(([, L]) => L.length);
      const sp = sprite(c);
      out.jobs[c] = { name: C.name, tier: jobTier(c), lv: reqLv(c), parent: par ? CLASSES[par].name : null, line: lname, desc: C.desc || '', img: icon(sp.img), iw: sp.w, ih: sp.h, sig: [sp.weapon, sp.off].filter(Boolean), slots };
    }
  }
  out.common = slotOrder.map(s => [s, typeOrder.filter(b => out.types[b].slot === s && out.types[b].all)]).filter(([, L]) => L.length);
  out.tiers = GTIERS.map((T, i) => [i, T.name, T.lv]);
  out.ladder = ARM_LADDER.filter(ladderOn); out.ladderAll = ARM_LADDER;
  return JSON.stringify(out);
})()"""
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + HOOK); pg.wait_for_timeout(700)
    pg.locator('button', has_text='상단 문 열기').first.click(); pg.wait_for_timeout(900)
    s = pg.evaluate("s => window.__EV(s)", JS)
    open(sys.argv[2], 'w', encoding='utf-8').write(s)
    print('errors', errs); br.close()
d = json.loads(s)
print('icons', len(d['icons']), 'bytes', sum(len(u) for u in d['icons']))
print('types', len(d['types']), 'entries', sum(len(t['list']) for t in d['types'].values()))
print('jobs', len(d['jobs']), [ (l['name'], len(l['jobs'])) for l in d['lines']])
print('common', d['common'])
for c in ['warrior', 'knight', 'ranger', 'dragoon', 'mhunter', 'duelist', 'bard']:
    j = d['jobs'][c]; print(c, j['name'], j['tier'], j['lv'], j['iw'], j['ih'], j['sig'], [(s, len(L)) for s, L in j['slots']])
