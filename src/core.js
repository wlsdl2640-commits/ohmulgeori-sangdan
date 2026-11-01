/* ───────── 게임 상태 ───────── */
let S = null;
const HOOKS = { changed() {}, toast() {}, modal() {} };   // 화면 쪽에서 덮어쓴다
const rnd = Math.random;
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pickOne = a => a[Math.floor(rnd() * a.length)];
const nid = () => S.seq++;

const dayOf = t => Math.floor(t / DAY_SEC);
function dateParts(t) {
  const d = dayOf(t), m0 = START.month - 1 + Math.floor(d / MONTH_DAYS);
  return { y: START.year + Math.floor(m0 / 12), m: (m0 % 12) + 1, d: (d % MONTH_DAYS) + 1 };
}
function dateStr(t) { const p = dateParts(t); return `${p.y}.${p.m}.${p.d}`; }
const today = () => dayOf(S.t);
const dayLabel = k => { const p = dateParts(k * DAY_SEC); return `${p.m}월 ${p.d}일`; };

function changed() { HOOKS.changed(); }
function log(text, kind = '') {
  const p = dateParts(S.t);
  S.log.unshift({ d: `${p.m}.${p.d}`, text, kind });
  if (S.log.length > 80) S.log.length = 80;
}
function queueModal(m) { S.modals.push(m); HOOKS.modal(); }

/* 연구·후원 단계 */
const rlv = k => (S.research && S.research.lv[k]) || 0;
const spn = k => (S.spons && S.spons[k]) || 0;

/* ───────── 모험가 능력치 ───────── */
function expNeed(lv) { return Math.round(30 * Math.pow(lv, 1.8)); }
function growStats(a, n) {
  const g = CLASSES[a.cls].grow, mul = a.hero ? 1.2 : 1;
  for (let i = 0; i < n; i++) for (const [k] of STATS) { const v = g[k] * mul, f = Math.floor(v); a.st[k] += f + (rnd() < v - f ? 1 : 0); }
}
function makeAdv(o = {}) {
  const cls = o.cls || pickOne(CLASS_IDS), C = CLASSES[cls], lv = o.lv || 1;
  const a = {
    id: nid(), name: o.name || (pickOne(NAME_A) + pickOne(NAME_B)), cls, lv, exp: 0, hero: !!o.hero,
    look: { hair: pickOne(HAIRS), skin: pickOne(SKINS) }, bio: o.bio || pickOne(BIOS[cls]),
    status: 'idle', kills: 0, trips: 0, quit: false,
    st: Object.assign({}, C.base), tr: { str: 0, vit: 0, agi: 0, int: 0 },
    eq: { weapon: null, armor: null, acc: null, bag: null }, skills: [C.innate],
    salary: o.salary != null ? o.salary : Math.round(C.salary * (1 + 0.09 * (lv - 1)) / 5) * 5
  };
  growStats(a, lv - 1);
  const d = derive(a);
  a.hp = d.maxHp; a.mp = d.maxMp;
  return a;
}
function gearSum(a) {
  const s = {};
  for (const [slot] of SLOTS) { const g = a.eq && a.eq[slot]; if (!g) continue; const gs = gearStats(g); for (const k in gs) s[k] = (s[k] || 0) + gs[k]; }
  return s;
}
function passives(a) {
  const p = {};
  for (const id of a.skills || []) { const P = SKILLS[id] && SKILLS[id].passive; if (P) for (const k in P) p[k] = (p[k] || 0) + P[k]; }
  return p;
}
function derive(a) {
  const C = CLASSES[a.cls], G = gearSum(a), P = passives(a), L = a.lv, T = {};
  for (const [k] of STATS) T[k] = Math.max(0, a.st[k] + a.tr[k] + (G[k] || 0));
  let atk = a.cls === 'archer' ? T.str * 0.5 + T.agi * 0.75 : a.cls === 'rogue' ? T.str * 0.8 + T.agi * 0.45 : T.str * 1.1;
  atk += L * 0.4 + (G.atk || 0);
  return {
    T, atk,
    matk: (T.int * 1.2 + L * 0.4 + (G.matk || 0)) * (1 + rlv('power') * 0.1),
    def: (T.vit * 0.35 + L * 0.2 + (G.def || 0)) * (1 + (P.defPct || 0) + rlv('ward') * 0.08),
    maxHp: Math.round(40 + T.vit * 7 + L * 4 + (G.hp || 0)),
    maxMp: Math.round(8 + T.int * 4 + L + (G.mp || 0)),
    eva: Math.min(0.45, T.agi * 0.004 + (G.eva || 0)),
    crit: Math.min(0.6, C.crit + T.agi * 0.0015 + (G.crit || 0)),
    spd: C.spd * (1 + T.agi * 0.004),
    carry: Math.round((C.carry + T.str * 0.4 + (G.carry || 0)) * (1 + (P.carryPct || 0))),
    move: (6 + T.agi * 0.06) * (1 + (P.movePct || 0)),
    mpRegen: 1 + (P.mpRegen || 0) + rlv('mana') * 0.3
  };
}
function clampVitals(a) { const d = derive(a); a.hp = Math.min(a.hp, d.maxHp); a.mp = Math.min(a.mp == null ? d.maxMp : a.mp, d.maxMp); }
function addExp(a, n) {
  a.exp += n;
  let up = false;
  while (a.exp >= expNeed(a.lv)) {
    const before = derive(a);
    a.exp -= expNeed(a.lv); a.lv++; up = true;
    growStats(a, 1);
    const after = derive(a);
    a.hp = Math.min(after.maxHp, a.hp + (after.maxHp - before.maxHp));
    a.mp = Math.min(after.maxMp, a.mp + (after.maxMp - before.maxMp));
  }
  return up;
}
const advById = id => S.advs.find(a => a.id === id);
const living = () => S.advs.filter(a => a.status !== 'dead');
const partyOf = aid => S.parties.find(p => p.members.includes(aid));
const beds = () => 2 + S.bld.inn * 2;
const teamOf = p => p.members.map(advById).filter(a => a && a.status !== 'dead');
const avgLvOf = p => { const t = teamOf(p); return t.length ? t.reduce((s, a) => s + a.lv, 0) / t.length : 0; };

/* ───────── 짐 ───────── */
const wOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].w * q : 0), 0);
const vOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].v * q : 0), 0);
const gW = list => (list || []).reduce((s, g) => s + GTYPES[g.base].w, 0);
function capOf(p) { return Math.round(teamOf(p).reduce((s, a) => s + derive(a).carry, 0) * (1 + rlv('carry') * 0.1)); }
function usedOf(p) { return p.exp ? wOf(p.exp.bag) + wOf(p.exp.sup) + gW(p.exp.gbag) : wOf(p.sup); }
function moveOf(p) { return Math.max(4, ...teamOf(p).map(a => derive(a).move)); }
function addTo(bag, k, q) { bag[k] = (bag[k] || 0) + q; if (bag[k] <= 0) delete bag[k]; }

/* ───────── 장비 만들기 ───────── */
function rollQuality(boost = 0) {
  const r = rnd(), rare = 0.05 + boost * 0.5 + (spn('dwarves') >= 3 ? 0.06 : 0), fine = 0.25 + boost + (spn('dwarves') >= 2 ? 0.08 : 0);
  return r < rare ? 2 : r < rare + fine ? 1 : 0;
}
function makeGear(base, t, q) {
  const g = { id: nid(), base, t, q: q || 0, bonus: null };
  if (g.q === 2) { const k = pickOne(['str', 'vit', 'agi', 'int']); g.bonus = { [k]: Math.max(1, Math.round(0.6 * GTIERS[t].p)) }; }
  return g;
}
function randomBook(lo, hi) {
  const pool = BOOK_IDS.filter(id => SKILLS[id].lv >= lo && SKILLS[id].lv <= hi);
  return pool.length ? 'book_' + pickOne(pool) : null;
}

/* ───────── 원정 ───────── */
const mHp = (m, L) => m.mh * (25 + 18 * L + 1.15 * L * L);
const mAtk = (m, L) => m.ma * (2.5 + 1.5 * L + 0.035 * L * L);
const mDef = (m, L) => (m.md || 0) * (1 + 0.6 * L);
const red = def => 60 / (60 + Math.max(0, def) * 1.5);

function areaDef(e) { const F = FIELDS[e.field]; return e.area === 'dungeon' ? F.dungeon : F; }
function makeEncs(e) {
  if (e.mode === 'return') return rnd() < 0.4 ? [ri(30, 70)] : [];
  if (e.area === 'dungeon') return e.stage === DUNGEON_FLOORS ? [35, 80] : [30, 70];
  return [25 + ri(-4, 4), 55 + ri(-4, 4), 85 + ri(-4, 4)];
}
function foeFrom(id, lv) {
  const m = MONS[id], hp = Math.round(mHp(m, lv));
  return { uid: nid(), id, lv, hp, maxHp: hp, atk: mAtk(m, lv), def: mDef(m, lv), spd: m.spd, eva: m.eva || 0, cd: 0.6 + rnd() * 0.8, boss: !!m.boss, dot: null, dotT: 0, slow: 0 };
}
function rollFoes(e, idx) {
  const F = FIELDS[e.field], A = areaDef(e);
  const boss = e.area === 'dungeon' && e.stage === DUNGEON_FLOORS && e.mode === 'advance' && idx === e.encs.length - 1;
  const lv = e.area === 'dungeon' ? F.lv + 8 + e.stage : F.lv + e.stage - 1;
  const pool = A.mons.filter(id => e.area === 'dungeon' || (MONS[id].minS || 1) <= e.stage);
  const out = [];
  if (boss) { out.push(foeFrom(A.boss, F.lv + 14)); out.push(foeFrom(pickOne(pool), lv)); }
  else {
    const n = e.mode === 'return' ? 1 : Math.min(4, 1 + ri(0, Math.floor(e.stage / 4)) + (e.area === 'dungeon' ? 1 : 0));
    for (let i = 0; i < n; i++) out.push(foeFrom(pickOne(pool), lv));
  }
  return out;
}
function spawn(p, e) {
  e.foes = e.next || rollFoes(e, e.ei - 1);
  e.next = null;
  e.cd = {}; e.buffs = []; e.taunt = null;
  ev(e, 'spawn', { boss: e.foes.some(f => f.boss) });
}
function ev(e, type, data) { e.ev.push(Object.assign({ n: ++e.evN, type }, data)); if (e.ev.length > 50) e.ev.shift(); }

function newExp(fid, sup) {
  const F = FIELDS[fid];
  const e = { field: fid, area: F.raid ? 'dungeon' : 'field', mode: 'advance', stage: 1, pos: 0, ei: 0, encs: [], foes: [], next: null,
    bag: {}, gbag: [], sup, cd: {}, scd: {}, buffs: [], taunt: null, potCd: 0, mpCd: 0,
    kills: 0, c10: false, goDungeon: false, full: false, ev: [], evN: 0, why: '' };
  e.encs = makeEncs(e);
  return e;
}
function startExp(p, fid) {
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 보낼 수 있어요.';
  if (!isUnlocked(fid)) return '아직 갈 수 없는 곳이에요.';
  const sup = {};
  for (const [k, q] of Object.entries(p.sup)) { const take = Math.min(S.inv[k] || 0, q); if (take > 0) { sup[k] = take; addTo(S.inv, k, -take); } }
  p.exp = newExp(fid, sup);
  team.forEach(a => { a.status = 'away'; a.mp = derive(a).maxMp; });
  S.stats.trips++;
  log(`${p.name}이(가) ${FIELDS[fid].name}(으)로 출발했다.`);
  changed();
  return '';
}
function recall(p, why = '') {
  const e = p.exp;
  if (!e || e.mode !== 'advance') return;
  e.mode = 'return'; e.why = why; e.goDungeon = false;
  e.encs = rnd() < 0.5 ? [Math.max(5, Math.floor(e.pos) - ri(15, 30))] : []; e.ei = 0; e.next = null;
  ev(e, 'turn', {});
  if (why === 'full') log(`${p.name}의 짐이 가득 차서 상단으로 돌아온다.`);
  if (why === 'danger') { log(`${p.name}은(는) 물약이 떨어지고 부상자가 생겨 발길을 돌렸다.`); HOOKS.toast(`${p.name}: 위험해서 복귀합니다`); }
  if (why === 'loss') log(`${p.name}은(는) 동료를 잃고 발길을 돌렸다.`);
  if (why === 'ahead') log(`${p.name}은(는) 앞쪽 몬스터가 너무 강해 보여 발길을 돌렸다.`);
  changed();
}
function enterDungeon(p) {
  const e = p.exp;
  if (!e || !e.c10 || e.area !== 'field' || e.mode !== 'advance') return;
  if (e.foes.length) { e.goDungeon = true; return; }
  e.area = 'dungeon'; e.stage = 1; e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.goDungeon = false; e.next = null;
  log(`${p.name}이(가) ${FIELDS[e.field].dungeon.name}에 들어갔다.`);
  ev(e, 'enter', {});
  changed();
}

function stepExp(p, dt) {
  const e = p.exp;
  const team = teamOf(p);
  if (!team.length) { wipe(p); return; }
  e.potCd = Math.max(0, e.potCd - dt);
  e.mpCd = Math.max(0, e.mpCd - dt);
  const dm = {};
  team.forEach(a => { dm[a.id] = derive(a); });
  usePotions(p, e, team, dm);
  if (p.safe && e.mode === 'advance' && !e.foes.length && !hpPotions(e) && team.some(a => a.hp < dm[a.id].maxHp * 0.5)) recall(p, 'danger');
  if (e.foes.length) { battle(p, e, team, dm, dt); return; }
  team.forEach(a => { const d = dm[a.id]; a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.008 * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  if (e.goDungeon) { enterDungeon(p); return; }
  if (!e.next && e.encs[e.ei] != null) e.next = rollFoes(e, e.ei);
  const v = moveOf(p) * (e.mode === 'return' ? 1.15 : 1);
  if (e.mode === 'advance') {
    const next = e.encs[e.ei], np = e.pos + v * dt;
    if (next != null && np >= next) { e.pos = next; e.ei++; spawn(p, e); return; }
    e.pos = np;
    if (e.pos >= STAGE_LEN) stageClear(p, e);
  } else {
    const next = e.encs[e.ei], np = e.pos - v * dt;
    if (next != null && np <= next) { e.pos = next; e.ei++; spawn(p, e); return; }
    e.pos = np;
    if (e.pos <= 0) stageBack(p, e);
  }
}
function stageClear(p, e) {
  const fs = S.fields[e.field];
  if (e.area === 'field') {
    if (e.stage > fs.best) { fs.best = e.stage; S.fame += 1; log(`${p.name}이(가) ${FIELDS[e.field].no}-${e.stage}까지 처음으로 진출했다. 명성 +1`, 'good'); }
    if (e.stage >= 10) { if (!e.c10) { e.c10 = true; HOOKS.toast(`${p.name}: ${FIELDS[e.field].dungeon.name} 입구를 찾았다`); } }
    else if (p.safe && FIELDS[e.field].lv + e.stage > avgLvOf(p) + 3) { e.stage++; e.pos = 0; e.ei = 0; e.encs = []; e.next = null; recall(p, 'ahead'); return; }
    else e.stage++;
  } else if (e.stage < DUNGEON_FLOORS) e.stage++;
  e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}
function stageBack(p, e) {
  if (e.area === 'dungeon') {
    if (e.stage > 1) e.stage--;
    else if (FIELDS[e.field].raid) { arrive(p); return; }
    else { e.area = 'field'; e.stage = 10; }
  } else if (e.stage > 1) e.stage--;
  else { arrive(p); return; }
  e.pos = STAGE_LEN; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}

/* ───────── 전투 ───────── */
const buffMul = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.mult ? m * b.mult : m), 1);
const buffAdd = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.add ? m + b.add : m), 0);
const lowestFoe = foes => foes.reduce((x, f) => (f.hp < x.hp ? f : x), foes[0]);
function hitFoe(e, f, atk, crit, magic) {
  const v = Math.max(1, Math.round(atk * (0.85 + rnd() * 0.3) * red(magic ? f.def * 0.5 : f.def) * (crit ? 1.75 : 1)));
  f.hp -= v;
  return v;
}
function pickSkill(a, d, team, dm, foes, e) {
  const sc = e.scd[a.id] || (e.scd[a.id] = {});
  let best = null, bp = 0;
  for (const id of a.skills) {
    const s = SKILLS[id];
    if (!s || s.passive || (sc[id] || 0) > 0) continue;
    if (s.cost.mp && a.mp < s.cost.mp) continue;
    if (s.cost.hp && a.hp < d.maxHp * (s.cost.hp + 0.35)) continue;
    let pr = 0;
    if (s.kind === 'heal') {
      const hurt = team.filter(x => x.hp > 0 && x.hp < dm[x.id].maxHp * (s.tgt === 'party' ? 0.7 : 0.6));
      if (s.tgt === 'party' ? hurt.length >= 2 : hurt.length >= 1) pr = s.tgt === 'party' ? 11 : 10;
    } else if (s.kind === 'buff') {
      if (!e.buffs.some(b => b.sid === id)) pr = foes.some(f => f.boss) || foes.length >= 2 ? 7 : 4;
    } else if (s.kind === 'taunt') {
      if (team.length > 1 && !(e.taunt && e.taunt.t > 0)) pr = 7;
    } else if (s.kind === 'dot') {
      if (foes[0] && !foes[0].dot && foes[0].hp > foes[0].maxHp * 0.4) pr = 5;
    } else pr = s.tgt === 'all' ? (foes.length >= 2 ? 8 : 2) : (foes.some(f => f.boss) ? 6 : 5);
    if (pr > bp) { bp = pr; best = id; }
  }
  return best;
}
function cast(e, a, d, id, team, dm, foes) {
  const s = SKILLS[id];
  if (s.cost.mp) a.mp -= s.cost.mp;
  if (s.cost.hp) a.hp -= Math.round(d.maxHp * s.cost.hp);
  e.scd[a.id][id] = s.cd;
  ev(e, 'skill', { s: a.id, id });
  if (s.kind === 'dmg' || s.kind === 'mdmg') {
    const magic = s.kind === 'mdmg';
    const tg = s.tgt === 'all' ? foes.slice() : [s.tgt === 'low' ? lowestFoe(foes) : foes[0]];
    for (const f of tg) for (let h = 0; h < (s.hits || 1); h++) {
      if (f.hp <= 0) break;
      let atk = (magic ? d.matk : d.atk * buffMul(e, a.id, 'atk')) * s.mult;
      if (s.boss && f.boss) atk *= s.boss;
      const crit = s.crit === 1 || rnd() < d.crit + (s.crit || 0);
      const v = hitFoe(e, f, atk, crit, magic);
      ev(e, 'hit', { s: a.id, d: f.uid, v, c: crit, k: s.fx || (magic ? 'magic' : CLASSES[a.cls].act === 'arrow' ? 'arrow' : 'melee') });
      if (s.slow) f.slow = s.slow;
    }
  } else if (s.kind === 'dot') {
    const f = foes[0];
    f.dot = { dps: d.atk * buffMul(e, a.id, 'atk') * s.mult, t: s.dur }; f.dotT = 0;
    ev(e, 'hit', { s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', dot: 1 });
  } else if (s.kind === 'heal') {
    const pow = d.matk * s.mult;
    const alive = team.filter(x => x.hp > 0);
    const tg = s.tgt === 'party' ? alive : [alive.sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0]];
    tg.forEach(x => { const h = Math.round(pow * (0.9 + rnd() * 0.2)); x.hp = Math.min(dm[x.id].maxHp, x.hp + h); ev(e, 'heal', { s: a.id, d: x.id, v: h }); });
  } else if (s.kind === 'buff') {
    const to = s.tgt === 'party' ? 'party' : a.id;
    e.buffs = e.buffs.filter(b => b.sid !== id);
    e.buffs.push({ sid: id, to, stat: s.stat, mult: s.mult || 0, add: s.add || 0, t: s.dur });
    ev(e, 'buff', { s: a.id, id, party: to === 'party' });
  } else if (s.kind === 'taunt') {
    e.taunt = { aid: a.id, t: s.dur };
    ev(e, 'buff', { s: a.id, id });
  }
}
function basicAct(e, a, d, team, dm, foes) {
  const act = CLASSES[a.cls].act;
  if (act === 'magic') {
    const f = foes[0], v = hitFoe(e, f, d.matk * 0.9, rnd() < d.crit, true);
    ev(e, 'hit', { s: a.id, d: f.uid, v, c: false, k: 'magic' });
    return;
  }
  const f = act === 'arrow' ? lowestFoe(foes) : foes[0];
  if (rnd() < f.eva) { ev(e, 'fmiss', { s: a.id, d: f.uid }); return; }
  const crit = rnd() < d.crit;
  const v = hitFoe(e, f, d.atk * buffMul(e, a.id, 'atk'), crit, false);
  ev(e, 'hit', { s: a.id, d: f.uid, v, c: crit, k: act === 'arrow' ? 'arrow' : 'melee' });
}
function battle(p, e, team, dm, dt) {
  const foes = e.foes;
  e.buffs.forEach(b => { b.t -= dt; });
  e.buffs = e.buffs.filter(b => b.t > 0);
  if (e.taunt) { e.taunt.t -= dt; if (e.taunt.t <= 0) e.taunt = null; }
  for (const a of team) {
    const d = dm[a.id];
    a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.02 * d.mpRegen * dt);
    const sc = e.scd[a.id] || (e.scd[a.id] = {});
    for (const k in sc) sc[k] = Math.max(0, sc[k] - dt);
    e.cd[a.id] = (e.cd[a.id] ?? (0.3 + rnd() * 0.6)) - dt;
    if (e.cd[a.id] > 0 || a.hp <= 0) continue;
    e.cd[a.id] = 1 / d.spd * (0.9 + rnd() * 0.2);
    const alive = foes.filter(f => f.hp > 0);
    if (!alive.length) break;
    const sk = pickSkill(a, d, team, dm, alive, e);
    if (sk) cast(e, a, d, sk, team, dm, alive); else basicAct(e, a, d, team, dm, alive);
  }
  for (const f of foes) {
    if (f.hp <= 0) continue;
    if (f.dot) {
      f.dotT += dt; f.dot.t -= dt;
      if (f.dotT >= 1) { const v = Math.max(1, Math.round(f.dot.dps * f.dotT * red(f.def * 0.3))); f.hp -= v; f.dotT = 0; ev(e, 'hit', { s: 0, d: f.uid, v, k: 'poison' }); }
      if (f.dot.t <= 0) f.dot = null;
    }
    if (f.slow > 0) f.slow -= dt;
    if (f.hp <= 0) continue;
    f.cd -= dt;
    if (f.cd > 0) continue;
    f.cd = 1 / f.spd * (0.9 + rnd() * 0.25) * (f.slow > 0 ? 1.6 : 1);
    const live = team.filter(x => x.hp > 0);
    if (!live.length) break;
    const m = MONS[f.id];
    if (m.aoe && rnd() < 0.3) { ev(e, 'aoe', { s: f.uid }); live.forEach(x => hitAdv(p, e, f, x, 0.7, dm)); continue; }
    let tgt = null;
    if (e.taunt) tgt = live.find(x => x.id === e.taunt.aid) || null;
    if (!tgt) { const tank = live.find(x => x.cls === 'warrior'); tgt = tank && rnd() < 0.7 ? tank : live[0]; }
    hitAdv(p, e, f, tgt, 1, dm);
  }
  for (let i = foes.length - 1; i >= 0; i--) if (foes[i].hp <= 0) { const f = foes[i]; foes.splice(i, 1); kill(p, e, f); }
  if (!foes.length) { e.cd = {}; e.buffs = []; e.taunt = null; ev(e, 'clear', {}); }
}
function hitAdv(p, e, f, x, mult, dm) {
  if (x.hp <= 0 || x.status === 'dead') return;
  const d = dm[x.id], m = MONS[f.id];
  if (rnd() < Math.min(0.6, d.eva + buffAdd(e, x.id, 'eva'))) { ev(e, 'miss', { s: f.uid, d: x.id }); return; }
  const def = d.def * buffMul(e, x.id, 'def') * (m.magic ? 0.5 : 1);
  const crit = rnd() < (f.boss ? 0.08 : 0.04);
  const v = Math.max(1, Math.round(f.atk * mult * (0.85 + rnd() * 0.3) * red(def) * (crit ? 1.6 : 1)));
  x.hp -= v;
  ev(e, 'hurt', { s: f.uid, d: x.id, v, c: crit, k: m.magic ? 'magic' : '' });
  if (x.hp <= 0) die(p, e, x);
}
function kill(p, e, f) {
  const m = MONS[f.id], F = FIELDS[e.field];
  e.kills++; S.stats.kills++;
  const team = teamOf(p);
  team.forEach(a => { a.kills = (a.kills || 0) + 1; });
  const xp = Math.round(f.lv * 3 * (f.boss ? 15 : 1) * (1 + (spn('elves') >= 2 ? 0.1 : 0) + (spn('elves') >= 3 ? 0.15 : 0)));
  team.forEach(a => { if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
  ev(e, 'kill', { d: f.uid, id: f.id });
  const dropMul = 1 + (spn('elves') >= 1 ? 0.1 : 0);
  for (const [it, ch, q] of m.drops) if (rnd() < Math.min(1, ch * dropMul)) loot(p, e, it, q || 1);
  const ap = 1 + rlv('appraise') * 0.25;
  const inD = e.area === 'dungeon';
  if (f.boss || rnd() < (inD ? 0.025 : 0.006) * ap) lootGear(p, e, makeGear(pickOne(GTYPE_IDS), F.tier, rollQuality(f.boss ? 0.25 : 0)));
  if (rnd() < (f.boss ? 0.6 : (inD ? 0.015 : 0.004) * ap)) { const b = randomBook(Math.max(1, f.lv - 14), f.lv + 2); if (b) loot(p, e, b, 1); }
  if (f.boss) dungeonClear(p, e);
}
function loot(p, e, it, q) {
  const room = capOf(p) - usedOf(p);
  const fit = Math.min(q, Math.floor(room / ITEMS[it].w));
  if (fit > 0) { addTo(e.bag, it, fit); ev(e, 'loot', { id: it }); }
  if (fit < q) e.full = true;
  if (e.full && p.auto && e.mode === 'advance' && e.area === 'field') recall(p, 'full');
}
function lootGear(p, e, g) {
  if (capOf(p) - usedOf(p) >= GTYPES[g.base].w) {
    e.gbag.push(g);
    ev(e, 'gear', { base: g.base, t: g.t });
    if (g.q >= 1) log(`${p.name}이(가) ${QUALITY[g.q].name} 장비 「${gearName(g)}」을(를) 주웠다.`, 'good');
  } else e.full = true;
}
const hpPotions = e => ['pot_l', 'pot_m', 'pot_s'].reduce((s, k) => s + (e.sup[k] || 0), 0);
function potionHeal(k) { return ITEMS[k].heal * (1 + rlv('potion') * 0.25 + (spn('clinic') >= 3 ? 0.2 : 0)); }
function usePotions(p, e, team, dm) {
  if (e.potCd <= 0) {
    const low = team.filter(a => a.hp > 0 && a.hp < dm[a.id].maxHp * 0.4).sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0];
    if (low) {
      const miss = dm[low.id].maxHp - low.hp;
      const order = ['pot_s', 'pot_m', 'pot_l'].filter(k => (e.sup[k] || 0) > 0);
      const use = order.find(k => potionHeal(k) >= miss * 0.6) || order[order.length - 1];
      if (use) {
        addTo(e.sup, use, -1);
        const v = Math.round(potionHeal(use));
        low.hp = Math.min(dm[low.id].maxHp, low.hp + v);
        e.potCd = 1.5;
        ev(e, 'pot', { d: low.id, v });
      }
    }
  }
  if (e.mpCd <= 0) {
    const dry = team.find(a => a.hp > 0 && (a.cls === 'mage' || a.cls === 'cleric') && a.mp < dm[a.id].maxMp * 0.2);
    const use = dry && ['mp_s', 'mp_m'].find(k => (e.sup[k] || 0) > 0);
    if (use) {
      addTo(e.sup, use, -1);
      dry.mp = Math.min(dm[dry.id].maxMp, dry.mp + ITEMS[use].mana * (1 + rlv('potion') * 0.25));
      e.mpCd = 2;
      ev(e, 'mana', { d: dry.id, v: ITEMS[use].mana });
    }
  }
}
function die(p, e, a) {
  a.hp = 0; a.status = 'dead';
  p.members = p.members.filter(id => id !== a.id);
  const F = FIELDS[e.field];
  S.graves.unshift({ name: a.name, cls: a.cls, lv: a.lv, hero: a.hero, date: dateStr(S.t), where: `${F.name} ${e.area === 'dungeon' ? '던전 ' + e.stage + '층' : F.no + '-' + e.stage}` });
  S.stats.deaths++;
  ev(e, 'die', { d: a.id, cls: a.cls });
  log(`${a.name}(${CLASSES[a.cls].name}, Lv${a.lv})이(가) ${F.name}에서 쓰러졌다.`, 'bad');
  HOOKS.toast(`${a.name}이(가) 전사했다`);
  S.advs = S.advs.filter(x => x.id !== a.id);
  // 남은 동료가 들 수 있는 만큼 장비를 챙긴다
  const gear = SLOTS.map(([s]) => a.eq[s]).filter(Boolean).sort((x, y) => gearValue(y) - gearValue(x));
  const kept = [], left = [];
  if (p.members.length) for (const g of gear) { if (capOf(p) - usedOf(p) >= GTYPES[g.base].w) { e.gbag.push(g); kept.push(gearName(g)); } else left.push(gearName(g)); }
  if (kept.length) log(`${p.name}은(는) ${a.name}의 장비 ${kept.join(', ')}을(를) 챙겼다.${left.length ? ` ${left.join(', ')}은(는) 무거워서 두고 왔다.` : ''}`);
  else if (gear.length && p.members.length) log(`${p.name}은(는) 짐이 가득 차 ${a.name}의 장비를 챙기지 못했다.`, 'bad');
  let over = usedOf(p) - capOf(p);
  if (over > 0 && p.members.length) {
    const keys = Object.keys(e.bag).sort((x, y) => ITEMS[x].v / ITEMS[x].w - ITEMS[y].v / ITEMS[y].w);
    for (const k of keys) { while (over > 0 && e.bag[k] > 0) { addTo(e.bag, k, -1); over -= ITEMS[k].w; } if (over <= 0) break; }
    log(`${p.name}은(는) 짐이 넘쳐 일부 부속품을 버렸다.`);
  }
  if (p.safe && p.members.length && e.mode === 'advance') recall(p, 'loss');
  changed();
}
function wipe(p) {
  const F = FIELDS[p.exp.field];
  log(`${p.name}이(가) ${F.name}에서 전멸했다. 가져오던 짐과 장비도 모두 잃었다.`, 'bad');
  queueModal({ title: `${p.name} 전멸`, body: [`${F.name}에서 원정대가 전멸했다. 가져오던 부속품과 장비도 모두 잃었다.`, '모험가는 한 번 쓰러지면 돌아오지 않는다. 물약을 넉넉히 챙기고, 무리하지 말자.'] });
  p.exp = null;
  changed();
}
function arrive(p) {
  const e = p.exp;
  const got = Object.assign({}, e.bag), val = vOf(got);
  for (const [k, q] of Object.entries(e.bag)) addTo(S.inv, k, q);
  for (const [k, q] of Object.entries(e.sup)) addTo(S.inv, k, q);
  e.gbag.forEach(g => S.gear.push(g));
  const team = p.members.map(advById).filter(Boolean);
  team.forEach(a => { a.status = 'idle'; a.trips++; });
  team.filter(a => a.quit).forEach(a => leave(a, '밀린 봉급 때문에 상단을 떠났다.'));
  const n = Object.values(got).reduce((s, q) => s + q, 0);
  log(`${p.name}이(가) 돌아왔다. 부속품 ${n}개(약 ${val}G어치)${e.gbag.length ? `, 장비 ${e.gbag.length}개` : ''}, 처치 ${e.kills}마리.`, 'good');
  HOOKS.toast(`${p.name} 귀환 · 부속품 ${n}개${e.gbag.length ? ` · 장비 ${e.gbag.length}개` : ''}`);
  p.last = { got, gear: e.gbag.length, kills: e.kills, field: e.field };
  p.exp = null;
  if (!S.flags.firstReturn) { S.flags.firstReturn = 1; queueModal({ title: '첫 원정', body: STORY.firstReturn }); }
  changed();
}
function leave(a, why) {
  const p = partyOf(a.id);
  if (p) p.members = p.members.filter(id => id !== a.id);
  SLOTS.forEach(([s]) => { if (a.eq[s]) { S.gear.push(a.eq[s]); a.eq[s] = null; } });
  S.advs = S.advs.filter(x => x.id !== a.id);
  log(`${a.name}이(가) ${why}`, 'bad');
}
function dungeonClear(p, e) {
  const fs = S.fields[e.field], F = FIELDS[e.field];
  const first = !fs.cleared;
  fs.cleared = true;
  if (F.raid) {
    S.flags.guildDown = 1;
    S.fame += 50; S.gold += 5000; S.stats.earned += 5000;
    log(`${p.name}이(가) 암살자 길드장을 쓰러뜨렸다! 길드 금고에서 5,000G, 명성 +50`, 'good');
    queueModal({ title: '암살자 길드 토벌', body: STORY.guild });
  } else {
    S.fame += first ? 25 : 5;
    log(`${p.name}이(가) ${F.dungeon.name}의 주인 ${MONS[F.dungeon.boss].name}을(를) 쓰러뜨렸다! 명성 +${first ? 25 : 5}`, 'good');
    if (first) {
      if (HEROES[e.field]) { S.heroQueue.push(e.field); syncHeroes(); }
      queueModal({ title: `${F.dungeon.name} 공략`, body: STORY[e.field] || [] });
    }
  }
  e.mode = 'return'; e.why = 'boss'; e.ei = 0; e.encs = []; e.next = null;
  changed();
}
const raidReady = () => S.fame >= GUILD_RAID.fame && living().length >= GUILD_RAID.advs && spn(GUILD_RAID.sponsor) >= GUILD_RAID.tier;
function isUnlocked(fid) {
  if (fid === 'plains') return true;
  if (fid === 'alley') return !S.flags.guildDown && raidReady();
  const prev = FIELD_IDS.find(k => FIELDS[k].next === fid);
  return !!(prev && S.fields[prev] && S.fields[prev].cleared);
}
