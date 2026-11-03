/* ───────── 게임 상태 ───────── */
let S = null;
const HOOKS = { changed() {}, toast() {}, modal() {}, sale() {}, floor() {} };   // 화면 쪽에서 덮어쓴다
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
const blessed = id => !!(S && S.bless && S.bless.id === id);
const isNight = () => phaseOf(S.t) === 3;

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
    look: { hair: pickOne(HAIRS), skin: pickOne(SKINS) }, bio: o.bio || pickOne(BIOS[cls] || BIOS[jobBase(cls)]),
    status: 'idle', kills: 0, trips: 0, quit: false, fat: 0, sleep: 0, pf: 0, rank: 0, inj: null, post: null, down: false,
    st: Object.assign({}, C.base), tr: { str: 0, vit: 0, agi: 0, int: 0 },
    eq: { weapon: null, armor: null, acc: null, bag: null }, skills: [C.innate], sm: {}, skin: null,
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
  const C = CLASSES[a.cls], jb = jobBase(a.cls), G = gearSum(a), P = passives(a), L = a.lv, T = {};
  for (const [k] of STATS) T[k] = Math.max(0, a.st[k] + a.tr[k] + (G[k] || 0));
  let atk = jb === 'archer' ? T.str * 0.5 + T.agi * 0.75 : jb === 'rogue' ? T.str * 0.8 + T.agi * 0.45 : T.str * 1.1;
  atk += L * 0.4 + (G.atk || 0);
  const war = blessed('war') ? 1.15 : 1, earth = blessed('earth'), wind = blessed('wind'), lic = (LICENSE[a.rank || 0] || LICENSE[0]).mul;
  return {
    T, atk: atk * war * lic * (1 + (P.atkPct || 0)),
    matk: (T.int * 1.2 + L * 0.4 + (G.matk || 0)) * (1 + rlv('power') * 0.1 + (P.matkPct || 0)) * war * lic,
    def: (T.vit * 0.35 + L * 0.2 + (G.def || 0)) * (1 + (P.defPct || 0) + rlv('ward') * 0.08) * (earth ? 1.1 : 1) * lic,
    maxHp: Math.round((40 + T.vit * 7 + L * 4 + (G.hp || 0)) * (earth ? 1.15 : 1) * lic * (1 + (P.hpPct || 0))),
    maxMp: Math.round(8 + T.int * 4 + L + (G.mp || 0)),
    eva: Math.min(0.5, T.agi * 0.004 + (G.eva || 0) + (P.eva || 0) + (wind ? 0.05 : 0)),
    crit: Math.min(0.75, C.crit + T.agi * 0.0015 + (G.crit || 0) + (P.crit || 0)),
    spd: C.spd * (1 + T.agi * 0.004) * (1 + (P.spdPct || 0)),
    carry: Math.round((C.carry + T.str * 0.4 + (G.carry || 0)) * (1 + (P.carryPct || 0))),
    move: (6 + T.agi * 0.06) * (1 + (P.movePct || 0) + relic('move')) * (wind ? 1.15 : 1),
    mpRegen: 1 + (P.mpRegen || 0) + rlv('mana') * 0.3
  };
}
function clampVitals(a) { const d = derive(a); a.hp = Math.min(a.hp, d.maxHp); a.mp = Math.min(a.mp == null ? d.maxMp : a.mp, d.maxMp); }
function addExp(a, n) {
  if (a.lv >= MAX_LV) { a.exp = 0; return false; }
  a.exp += n;
  let up = false;
  while (a.lv < MAX_LV && a.exp >= expNeed(a.lv)) {
    const before = derive(a);
    a.exp -= expNeed(a.lv); a.lv++; up = true;
    growStats(a, 1);
    const after = derive(a);
    a.hp = Math.min(after.maxHp, a.hp + (after.maxHp - before.maxHp));
    a.mp = Math.min(after.maxMp, a.mp + (after.maxMp - before.maxMp));
  }
  if (a.lv >= MAX_LV) a.exp = 0;
  return up;
}
const advById = id => S.advs.find(a => a.id === id);
const living = () => S.advs.filter(a => a.status !== 'dead');
const partyOf = aid => S.parties.find(p => p.members.includes(aid));
const beds = () => 2 + S.bld.inn * 2 + rankBeds(S.rank || 0);
const teamOf = p => p.members.map(advById).filter(a => a && a.status !== 'dead');
const standing = p => teamOf(p).filter(a => !a.down);
const avgLvOf = p => { const t = teamOf(p); return t.length ? t.reduce((s, a) => s + a.lv, 0) / t.length : 0; };

/* ───────── 짐 ───────── */
const wOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].w * q : 0), 0);
const vOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].v * q : 0), 0);
const gW = list => (list || []).reduce((s, g) => s + GTYPES[g.base].w, 0);
const wagonOf = p => (p.wagon && WAGONS[p.wagon]) || null;
// 쓰러진 동료는 짐을 못 들고, 들것이 자리를 차지한다
function capOf(p) { const w = wagonOf(p), all = teamOf(p), st = all.filter(a => !a.down); return Math.max(0, Math.round((st.reduce((s, a) => s + derive(a).carry, 0) + (w ? w.cap : 0)) * (1 + rlv('carry') * 0.1)) - (all.length - st.length) * STRETCHER); }
function usedOf(p) { return p.exp ? wOf(p.exp.bag) + wOf(p.exp.sup) + gW(p.exp.gbag) : wOf(p.sup); }
// 파티 이동속도 = 가장 빠른(민첩한) 모험가의 속도 × 피로 × 마차
function moveOf(p) { const w = wagonOf(p), all = teamOf(p), st = all.filter(a => !a.down); if (!st.length) return 4; return Math.max(4, ...st.map(a => derive(a).move * fatMul(a.fat || 0))) * (w ? w.spd : 1) * (st.length < all.length ? 0.8 : 1); }
const tire = (team, v) => team.forEach(a => { a.fat = Math.max(0, Math.min(100, (a.fat || 0) + v)); });
function addTo(bag, k, q) { bag[k] = (bag[k] || 0) + q; if (bag[k] <= 0) delete bag[k]; }

/* ───────── 장비 만들기 ───────── */
// 품질: 일반·고급·희귀는 무작위, 보스에게서는 가끔 영웅. 전설 이상은 보스 부속품으로 만들거나 던전·레이드 보상
function rollQuality(boost = 0) {
  const r = rnd(), dw = spn('dwarves'), hero = boost >= 0.2 ? 0.01 + boost * 0.08 : 0;
  const rare = 0.05 + boost * 0.5 + (dw >= 3 ? 0.06 : 0), fine = 0.25 + boost + (dw >= 2 ? 0.08 : 0);
  return r < hero ? 3 : r < hero + rare ? 2 : r < hero + rare + fine ? 1 : 0;
}
// 희귀 이상은 보너스 능력치가 붙는다 (등급이 높을수록 여러 개, 더 크게)
const BONUS_Q = [null, null, [1, 0.6], [1, 1.0], [2, 1.0], [2, 1.4], [3, 1.6]];
function makeGear(base, t, q) {
  const g = { id: nid(), base, t, q: q || 0, bonus: null, runes: [] }, B = BONUS_Q[g.q];
  if (B) { g.bonus = {}; const ks = STAT_KEYS.slice().sort(() => rnd() - 0.5).slice(0, B[0]); ks.forEach(k => { g.bonus[k] = Math.max(1, Math.round(B[1] * GTIERS[t].p)); }); }
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
const DIFF = { hp: 1.22, atk: 1.16 };   // v0.5: 더 어렵게

function areaDef(e) { const F = FIELDS[e.field]; return e.area === 'dungeon' ? F.dungeon : F; }
function makeEncs(e) {
  const night = e.area === 'field' && isNight();
  if (e.mode === 'return') return rnd() < (night ? 0.55 : 0.4) ? [ri(30, 70)] : [];
  if (e.area === 'dungeon') return e.stage === DUNGEON_FLOORS ? [35, 80] : [30, 70];
  return [25 + ri(-4, 4), 55 + ri(-4, 4), 85 + ri(-4, 4)];
}
function foeFrom(id, lv) {
  const m = MONS[id], hp = Math.round(mHp(m, lv) * DIFF.hp);
  return { uid: nid(), id, lv, hp, maxHp: hp, atk: mAtk(m, lv) * DIFF.atk, def: mDef(m, lv), spd: m.spd, eva: m.eva || 0, cd: 0.6 + rnd() * 0.8, boss: !!m.boss, dot: null, dotT: 0, slow: 0 };
}
// 필드 보스: 10 스테이지마다. k = 1~5 (1-50은 그 필드의 주인)
function fieldBoss(F, stage, lv) {
  const k = Math.round(stage / BOSS_EVERY), pool = F.mons.filter(id => minStage(MONS[id]) <= stage);
  const id = pool[(k * 7 + F.no * 3) % pool.length];
  const f = foeFrom(id, lv + 1);
  f.hp = f.maxHp = Math.round(f.maxHp * (3 + 0.9 * k));
  f.atk *= 1.25 + 0.06 * k; f.def *= 1.25;
  f.boss = true; f.fb = k; f.aoe = k >= 3;
  f.sc = Math.min(3, Math.max(1, Math.round(MONS[id].scale || 1)) + (k >= 5 ? 2 : 1));
  f.name = k >= 5 ? `${F.name}의 주인 ${MONS[id].name}` : `우두머리 ${MONS[id].name}`;
  return f;
}
// 어두워질수록 몬스터가 더 몰려온다 (던전 안은 상관없음)
function nightMore(e) {
  if (e.area !== 'field') return 0;
  const m = PHASES[phaseOf(S.t)].more * (blessed('moon') ? 0.5 : 1);
  return Math.floor(m) + (rnd() < m % 1 ? 1 : 0);
}
function rollFoes(e, idx, extra = 0) {
  const F = FIELDS[e.field], A = areaDef(e);
  const last = e.mode === 'advance' && idx === e.encs.length - 1;
  const dboss = e.area === 'dungeon' && e.stage === DUNGEON_FLOORS && last;
  const fboss = e.area === 'field' && e.stage % BOSS_EVERY === 0 && last;
  const lv = e.area === 'dungeon' ? (F.raid ? F.lv + 8 + e.stage : dungeonLv(F, e.stage)) : fieldLv(F, e.stage);
  const pool = A.mons.filter(id => e.area === 'dungeon' || minStage(MONS[id]) <= e.stage);
  const out = [];
  if (dboss) { out.push(foeFrom(A.boss, F.raid ? F.lv + 14 : dungeonBossLv(F))); out.push(foeFrom(pickOne(pool), lv)); }
  else if (fboss) { out.push(fieldBoss(F, e.stage, lv)); for (let i = 0; i < (e.stage >= 30 ? 2 : 1); i++) out.push(foeFrom(pickOne(pool), lv)); }
  else {
    let n = e.mode === 'return' ? 1 : 1 + ri(0, Math.min(2, Math.floor(e.stage / 5))) + (e.area === 'dungeon' ? 1 : 0);
    n = Math.min(5, n + nightMore(e) + extra);
    for (let i = 0; i < n; i++) out.push(foeFrom(pickOne(pool), lv));
  }
  return out;
}
function spawn(p, e) {
  e.foes = e.next || rollFoes(e, e.ei - 1);
  e.next = null;
  e.cd = {}; e.buffs = []; e.taunt = null;
  const fb = e.foes.find(f => f.fb);
  ev(e, 'spawn', { boss: e.foes.some(f => f.boss), name: fb ? fb.name : '' });
}
function ev(e, type, data) { e.ev.push(Object.assign({ n: ++e.evN, type }, data)); if (e.ev.length > 50) e.ev.shift(); }

// 거점: 필드 보스를 쓰러뜨린 구간 다음부터 출발할 수 있다 (1-11, 1-21 …)
function checkpoints(fid) {
  const F = FIELDS[fid], fs = S.fields[fid];
  if (!F || F.raid || !fs) return [1];
  return [1].concat([1, 2, 3, 4].filter(k => fs.boss && fs.boss[k]).map(k => k * BOSS_EVERY + 1));
}
function newExp(fid, sup, start = 1) {
  const F = FIELDS[fid];
  const e = { field: fid, area: F.giant ? 'raid' : F.raid ? 'dungeon' : 'field', raid: F.giant || null, rt: 0, dealt: 0, mode: 'advance', stage: start, home: start, pos: 0, ei: 0, encs: [], foes: [], next: null,
    bag: {}, gbag: [], sup, cd: {}, scd: {}, buffs: [], taunt: null, potCd: 0, mpCd: 0,
    kills: 0, full: false, ev: [], evN: 0, why: '', camp: null, wait: null };
  e.encs = F.giant ? [] : makeEncs(e);
  return e;
}
// 원정에 못 나가는 이유 (없으면 '')
function cantGo(a) {
  if (!a || a.status !== 'idle') return '원정 중이에요';
  if (a.inj) return `${a.name}이(가) 다쳐서 치료가 필요해요`;
  if (a.post) return `${a.name}은(는) 신전에서 일하고 있어요`;
  if ((a.sleep || 0) >= SLEEP.block) return `${a.name}이(가) 너무 피곤해요. 여관에서 더 자야 해요`;
  return '';
}
function startExp(p, fid) {
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 보낼 수 있어요.';
  if (!isUnlocked(fid)) return FIELDS[fid] && FIELDS[fid].giant ? '이번 달에는 열리지 않은 레이드예요.' : '아직 갈 수 없는 곳이에요.';
  const why = team.map(cantGo).find(Boolean);
  if (why) return why + '.';
  const GR = FIELDS[fid].giant && RAIDS[FIELDS[fid].giant];
  if (GR && avgLvOf(p) < GR.lv - RAID_GAP) return `${GR.name} 레이드는 파티 평균 Lv${GR.lv - RAID_GAP} 이상이어야 도전할 수 있어요.`;
  const sup = {};
  for (const [k, q] of Object.entries(p.sup)) { const take = Math.min(S.inv[k] || 0, q); if (take > 0) { sup[k] = take; addTo(S.inv, k, -take); } }
  p.exp = newExp(fid, sup, checkpoints(fid).includes(p.start) ? p.start : 1);
  team.forEach(a => { a.status = 'away'; a.down = false; a.mp = derive(a).maxMp; });
  S.stats.trips++;
  log(`${p.name}이(가) ${FIELDS[fid].name}(으)로 출발했다.`);
  changed();
  return '';
}
function recall(p, why = '') {
  const e = p.exp;
  if (!e || e.mode !== 'advance') return;
  e.mode = 'return'; e.why = why; e.wait = null;
  e.encs = rnd() < 0.5 ? [Math.max(5, Math.floor(e.pos) - ri(15, 30))] : []; e.ei = 0; e.next = null;
  ev(e, 'turn', {});
  if (why === 'full') log(`${p.name}의 짐이 가득 차서 상단으로 돌아온다.`);
  if (why === 'danger') { log(`${p.name}은(는) 물약이 떨어지고 부상자가 생겨 발길을 돌렸다.`); HOOKS.toast(`${p.name}: 위험해서 복귀합니다`); }
  if (why === 'loss') log(`${p.name}은(는) 쓰러진 동료를 들것에 싣고 발길을 돌렸다.`);
  if (why === 'ahead') log(`${p.name}은(는) 앞쪽 몬스터가 너무 강해 보여 발길을 돌렸다.`);
  if (why === 'sleep') log(`${p.name}은(는) 며칠째 제대로 못 자 상단으로 돌아간다.`);
  if (why === 'end') log(`${p.name}이(가) ${FIELDS[e.field].name}의 끝에 닿아 발길을 돌렸다.`, 'good');
  changed();
}
// 던전 입구 앞에서: 들어간다 / 지나간다(돌아간다)
function enterDungeon(p) {
  const e = p.exp;
  if (!e || e.wait !== 'gate' || e.area !== 'field' || S.fields[e.field].cleared) return;
  e.wait = null; e.area = 'dungeon'; e.stage = 1; e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  log(`${p.name}이(가) ${FIELDS[e.field].dungeon.name}에 들어갔다.`);
  ev(e, 'enter', {});
  changed();
}
function gateChoice(p, choice) {
  const e = p.exp;
  if (!e || e.wait !== 'gate') return;
  if (choice === 'enter') { enterDungeon(p); return; }
  e.wait = null;
  log(`${p.name}은(는) ${FIELDS[e.field].dungeon.name}에 들어가지 않고 돌아섰다.`);
  if (e.stage >= FIELD_STAGES) { recall(p, 'end'); return; }
  e.stage++; e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}

/* ───────── 야영: 지치면 모닥불을 피우고 잔다 ───────── */
function startCamp(p, e) {
  e.camp = { t: 0, night: isNight(), amb: isNight() && e.area === 'field' && rnd() < (blessed('moon') ? 0.11 : 0.22) ? 4 + rnd() * 10 : 0 };
  ev(e, 'camp', {});
}
function stepCamp(p, e, team, dm, dt) {
  const c = e.camp;
  c.t += dt;
  team.forEach(a => { const d = dm[a.id]; a.fat = Math.max(0, (a.fat || 0) - FATIGUE.sleep * dt); a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.02 * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  if (c.amb && c.t >= c.amb) {
    c.amb = 0;
    e.foes = rollFoes(e, -1, 1); e.cd = {}; e.buffs = []; e.taunt = null;
    ev(e, 'spawn', { boss: false, amb: 1 });
    log(`${p.name}의 야영지에 몬스터가 밤습격을 해 왔다!`, 'bad');
    return;
  }
  const f = team.map(a => a.fat || 0);
  if (c.t >= (c.night ? FATIGUE.nightRest : 6) && Math.max(...f) <= 15 && f.reduce((s, v) => s + v, 0) / f.length <= FATIGUE.wake) { e.camp = null; ev(e, 'wake', {}); }
}

function stepExp(p, dt) {
  const e = p.exp;
  const all = teamOf(p);
  if (!all.length) { p.exp = null; changed(); return; }
  const team = all.filter(a => !a.down);
  if (!team.length) { wipe(p); return; }
  e.potCd = Math.max(0, e.potCd - dt);
  e.mpCd = Math.max(0, e.mpCd - dt);
  // 숙면 피로: 원정 내내 쌓이고 여관에서만 풀린다
  const sl = (SLEEP.field + (e.foes.length ? SLEEP.fight : 0)) * dt;
  all.forEach(a => { a.sleep = Math.min(100, (a.sleep || 0) + sl); });
  const dm = {};
  team.forEach(a => { const d = derive(a), m = fatMul(a.fat || 0); if (m < 1) { d.atk *= m; d.matk *= m; d.def *= m; } dm[a.id] = d; });
  // 음유시인·마에스트로의 노래: 파티 전체 공격력과 마법 피해
  const aura = Math.max(0, ...team.map(a => TR(a).aura || 0));
  if (aura) team.forEach(a => { dm[a.id].atk *= 1 + aura; dm[a.id].matk *= 1 + aura; });
  // 광전사: 체력이 줄수록 공격력이 오른다
  team.forEach(a => { const r = TR(a).rage; if (r) dm[a.id].atk *= 1 + r * Math.max(0, 1 - a.hp / dm[a.id].maxHp); });
  usePotions(p, e, team, dm);
  const fr = blessed('moon') ? 0.75 : 1;
  if (e.area === 'raid') { stepRaid(p, e, team, dm, dt, fr); return; }
  if (e.foes.length) { tire(team, FATIGUE.fight * fr * dt); battle(p, e, team, dm, dt); return; }
  if (e.camp) { stepCamp(p, e, team, dm, dt); return; }
  team.forEach(a => { const d = dm[a.id]; a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.008 * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  if (e.wait === 'gate') return;   // 던전 입구 앞에서 결정을 기다린다
  if (p.safe && e.mode === 'advance' && !hpPotions(e) && team.some(a => a.hp < dm[a.id].maxHp * 0.7)) recall(p, 'danger');
  if (p.safe && e.mode === 'advance' && e.area === 'field' && all.some(a => (a.sleep || 0) >= SLEEP.max)) recall(p, 'sleep');
  const fats = team.map(a => a.fat || 0), maxF = Math.max(...fats), avgF = fats.reduce((s, v) => s + v, 0) / fats.length;
  if (maxF >= FATIGUE.camp || (isNight() && p.campNight !== false && avgF >= FATIGUE.nightCamp)) { startCamp(p, e); return; }
  tire(team, FATIGUE.walk * fr * dt);
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
  const fs = S.fields[e.field], F = FIELDS[e.field];
  if (e.area === 'field') {
    if (e.stage > fs.best) { fs.best = e.stage; if (e.stage % 5 === 0) { S.fame += 1; log(`${p.name}이(가) ${F.no}-${e.stage}까지 처음으로 진출했다. 명성 +1`, 'good'); } }
    if (e.stage >= FIELD_STAGES) {
      e.pos = STAGE_LEN;
      // 1-50의 주인을 쓰러뜨려 던전 입구가 열렸다 (한 번 공략한 던전은 봉인된다)
      if (!fs.cleared) {
        if (!fs.found) { fs.found = true; log(`${p.name}이(가) ${F.no}-${FIELD_STAGES}에서 ${F.dungeon.name} 입구를 열었다!`, 'good'); }
        const mode = p.dmode || 'ask';
        if (mode !== 'skip') {
          e.wait = 'gate';
          if (mode === 'enter') { enterDungeon(p); return; }
          HOOKS.toast(`${p.name}: ${F.dungeon.name} 입구에 도착`);
          queueModal({ title: `${F.dungeon.name} 입구`, gate: p.id, body: [`${p.name}이(가) ${F.name}의 주인을 쓰러뜨리고 ${F.dungeon.name} 입구 앞에 섰다.`, `던전은 한 번만 공략할 수 있다. 안에는 Lv${dungeonLv(F, 1)}~${dungeonLv(F, DUNGEON_FLOORS)} 몬스터와 주인 ${MONS[F.dungeon.boss].name}(Lv${dungeonBossLv(F)})이 기다린다. 파티 평균 Lv${Math.round(avgLvOf(p))}.`] });
          changed();
          return;
        }
      }
      recall(p, 'end');
      return;
    }
    if (p.safe && fieldLv(F, e.stage + 1) + ((e.stage + 1) % BOSS_EVERY === 0 ? 2 : 0) > avgLvOf(p) + 3) { e.stage++; e.pos = 0; e.ei = 0; e.encs = []; e.next = null; recall(p, 'ahead'); return; }
    e.stage++;
  } else if (e.stage < DUNGEON_FLOORS) e.stage++;
  e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}
function stageBack(p, e) {
  if (e.area === 'dungeon') {
    if (e.stage > 1) e.stage--;
    else if (FIELDS[e.field].raid) { arrive(p); return; }
    else { e.area = 'field'; e.stage = FIELD_STAGES; }
  } else if (e.stage > (e.home || 1)) e.stage--;
  else { arrive(p); return; }   // 출발한 거점에 닿으면 마차를 타고 상단으로
  e.pos = STAGE_LEN; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}

/* ───────── 전투 ───────── */
const buffMul = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.mult ? m * b.mult : m), 1);
const buffAdd = (e, aid, stat) => e.buffs.reduce((m, b) => (b.stat === stat && (b.to === aid || b.to === 'party') && b.add ? m + b.add : m), 0);
const lowestFoe = foes => foes.reduce((x, f) => (f.hp < x.hp ? f : x), foes[0]);
const up = x => x.hp > 0 && !x.down;
// 직업 특성: 방어 관통·치명 배율·첫 공격·보스 피해
function hitFoe(e, f, atk, crit, magic, a) {
  const T = a ? TR(a) : {};
  let def = magic ? f.def * 0.5 : f.def, m = crit ? T.critMul || 1.75 : 1;
  if (T.pen) def *= 1 - T.pen;
  if (T.first && f.hp >= f.maxHp) m *= T.first;
  if (T.bossDmg && f.boss) m *= T.bossDmg;
  const v = Math.max(1, Math.round(atk * (0.85 + rnd() * 0.3) * red(def) * m));
  f.hp -= v;
  return v;
}
// 흡혈 (물리·마법)
function leech(e, a, d, v, magic) {
  const T = TR(a), k = magic ? T.mdrain : T.lifesteal;
  if (!k || a.hp >= d.maxHp) return;
  const h = Math.max(1, Math.round(v * k));
  a.hp = Math.min(d.maxHp, a.hp + h);
  ev(e, 'heal', { s: a.id, d: a.id, v: h });
}
function stealGold(s, hits) { if (!s.steal) return; const g = Math.round(s.steal * hits); S.gold += g; S.stats.earned += g; }
function pickSkill(a, d, team, dm, foes, e) {
  const sc = e.scd[a.id] || (e.scd[a.id] = {});
  let best = null, bp = 0;
  for (const id of a.skills) {
    const s = SKILLS[id];
    if (!s || s.passive || (sc[id] || 0) > 0) continue;
    if (s.cost.mp && a.mp < s.cost.mp) continue;
    if (s.cost.hp && a.hp < d.maxHp * (s.cost.hp + 0.35)) continue;
    let pr = 0;
    if (s.kind === 'heal' && s.tgt === 'self') {
      if (a.hp < d.maxHp * 0.5) pr = 10;
    } else if (s.kind === 'heal') {
      const hurt = team.filter(x => up(x) && x.hp < dm[x.id].maxHp * (s.tgt === 'party' ? 0.7 : 0.6));
      if (s.tgt === 'party' ? hurt.length >= 2 : hurt.length >= 1) pr = s.tgt === 'party' ? 11 : 10;
    } else if (s.kind === 'buff') {
      if (!e.buffs.some(b => b.sid === id)) pr = foes.some(f => f.boss) || foes.length >= 2 ? 7 : 4;
    } else if (s.kind === 'taunt') {
      if (team.filter(up).length > 1 && !(e.taunt && e.taunt.t > 0)) pr = 7;
    } else if (s.kind === 'dot') {
      const tg = s.tgt === 'all' ? foes : [foes[0]];
      if (tg.some(f => !f.dot && f.hp > f.maxHp * 0.4)) pr = s.tgt === 'all' && foes.length >= 2 ? 7 : 5;
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
  // 숙련도: 쓸수록 위력이 조금씩 오른다 (단계가 오르면 알린다)
  const sm = smLv(a, id), M = smMul(a, id);
  a.sm = a.sm || {}; a.sm[id] = (a.sm[id] || 0) + 1;
  if (smLv(a, id) > sm) ev(e, 'mastery', { s: a.id, id, lv: smLv(a, id) });
  if (s.kind === 'dmg' || s.kind === 'mdmg') {
    const magic = s.kind === 'mdmg';
    const tg = s.tgt === 'all' ? foes.slice() : [s.tgt === 'low' ? lowestFoe(foes) : foes[0]];
    for (const f of tg) for (let h = 0; h < (s.hits || 1); h++) {
      if (f.hp <= 0) break;
      let atk = (magic ? d.matk : d.atk * buffMul(e, a.id, 'atk')) * s.mult * M;
      if (s.boss && f.boss) atk *= s.boss;
      const crit = s.crit === 1 || rnd() < d.crit + (s.crit || 0);
      const v = hitFoe(e, f, atk, crit, magic, a);
      ev(e, 'hit', { s: a.id, d: f.uid, v, c: crit, k: s.fx || (magic ? 'magic' : CLASSES[a.cls].act === 'arrow' ? 'arrow' : 'melee') });
      if (s.slow) f.slow = s.slow;
      if (s.drain) { const h = Math.round(v * s.drain); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: a.id, d: a.id, v: h }); }
      else leech(e, a, d, v, magic);
    }
    stealGold(s, tg.length * (s.hits || 1));
  } else if (s.kind === 'dot') {
    const tg = s.tgt === 'all' ? foes : [foes[0]];
    tg.forEach(f => { f.dot = { dps: (s.magic ? d.matk : d.atk * buffMul(e, a.id, 'atk')) * s.mult * M * (TR(a).dot || 1), t: s.dur, magic: !!s.magic }; f.dotT = 0; if (s.slow) f.slow = s.slow; ev(e, 'hit', { s: a.id, d: f.uid, v: 0, k: s.fx || 'melee', dot: 1 }); });
  } else if (s.kind === 'heal' && s.tgt === 'self') {
    const h = Math.round(d.maxHp * s.pct * M); a.hp = Math.min(d.maxHp, a.hp + h); ev(e, 'heal', { s: a.id, d: a.id, v: h });
  } else if (s.kind === 'heal') {
    const pow = d.matk * s.mult * M * (TR(a).healPow || 1);
    const alive = team.filter(up);
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
  const act = CLASSES[a.cls].act, T = TR(a);
  if (act === 'magic') {
    const f = foes[0], v = hitFoe(e, f, d.matk * 0.9, rnd() < d.crit, true, a);
    ev(e, 'hit', { s: a.id, d: f.uid, v, c: false, k: 'magic' });
    leech(e, a, d, v, true);
    // 정령술사: 다른 적에게도 번진다
    if (T.aoe) foes.slice(1).forEach(o => { if (o.hp > 0) { const w = hitFoe(e, o, d.matk * 0.9 * T.aoe, false, true, a); ev(e, 'hit', { s: a.id, d: o.uid, v: w, c: false, k: 'fire' }); } });
    return;
  }
  const f = act === 'arrow' ? lowestFoe(foes) : foes[0];
  const k = act === 'arrow' ? (a.eq && a.eq.weapon && a.eq.weapon.base === 'lute' ? 'note' : 'arrow') : 'melee';
  const swings = 1 + (T.double && rnd() < T.double ? 1 : 0);
  for (let i = 0; i < swings; i++) {
    if (f.hp <= 0) break;
    if (rnd() < f.eva) { ev(e, 'fmiss', { s: a.id, d: f.uid }); continue; }
    const crit = rnd() < d.crit;
    const atk = d.atk * buffMul(e, a.id, 'atk') + (T.hybrid ? d.matk * T.hybrid : 0);
    const v = hitFoe(e, f, atk, crit, false, a);
    ev(e, 'hit', { s: a.id, d: f.uid, v, c: crit, k: T.hybrid ? 'spell' : k });
    leech(e, a, d, v, false);
  }
  // 레인저·용기병: 동물 동료가 함께 문다
  if (T.pet && f.hp > 0 && rnd() < 0.5 + T.pet) { const v = hitFoe(e, f, d.atk * (0.35 + T.pet), false, false, null); ev(e, 'hit', { s: a.id, d: f.uid, v, c: false, k: 'pet' }); }
}
// 적이 노릴 상대: 앞줄과 방패를 든 직업이 더 자주 맞는다
function tankW(a) { const t = TR(a).tank; return t != null ? t : jobBase(a.cls) === 'warrior' ? 1 : 0; }
function pickTarget(live) {
  const w = live.map((x, i) => 1 + (i === 0 ? 1 : 0) + tankW(x) * 2), sum = w.reduce((s2, v) => s2 + v, 0);
  let r = rnd() * sum;
  for (let i = 0; i < live.length; i++) { r -= w[i]; if (r <= 0) return live[i]; }
  return live[0];
}
function battle(p, e, team, dm, dt) {
  const foes = e.foes;
  if (e.flee) {
    e.flee -= dt;
    if (e.flee <= 0) {
      e.flee = 0; e.foes = []; e.next = null; e.cd = {}; e.buffs = []; e.taunt = null;
      ev(e, 'flee', {});
      log(`${p.name}은(는) 쓰러진 동료를 들쳐 메고 싸움에서 빠져나왔다.`, 'bad');
      return;
    }
  }
  e.buffs.forEach(b => { b.t -= dt; });
  e.buffs = e.buffs.filter(b => b.t > 0);
  if (e.taunt) { e.taunt.t -= dt; if (e.taunt.t <= 0) e.taunt = null; }
  for (const a of team) {
    if (!up(a)) continue;
    const d = dm[a.id];
    a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.02 * d.mpRegen * dt);
    const sc = e.scd[a.id] || (e.scd[a.id] = {});
    for (const k in sc) sc[k] = Math.max(0, sc[k] - dt);
    e.cd[a.id] = (e.cd[a.id] ?? (0.3 + rnd() * 0.6)) - dt;
    if (e.cd[a.id] > 0) continue;
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
      if (f.dotT >= 1) { const v = Math.max(1, Math.round(f.dot.dps * f.dotT * red(f.def * (f.dot.magic ? 0.15 : 0.3)))); f.hp -= v; f.dotT = 0; ev(e, 'hit', { s: 0, d: f.uid, v, k: f.dot.magic ? 'curse' : 'poison' }); }
      if (f.dot.t <= 0) f.dot = null;
    }
    if (f.slow > 0) f.slow -= dt;
    if (f.hp <= 0) continue;
    f.cd -= dt;
    if (f.cd > 0) continue;
    f.cd = 1 / f.spd * (0.9 + rnd() * 0.25) * (f.slow > 0 ? 1.6 : 1);
    const live = team.filter(up);
    if (!live.length) break;
    if ((MONS[f.id].aoe || f.aoe) && rnd() < 0.3) { ev(e, 'aoe', { s: f.uid }); live.forEach(x => hitAdv(p, e, f, x, 0.7, dm)); continue; }
    let tgt = null;
    if (e.taunt) tgt = live.find(x => x.id === e.taunt.aid) || null;
    if (!tgt) tgt = pickTarget(live);
    hitAdv(p, e, f, tgt, 1, dm);
  }
  for (let i = foes.length - 1; i >= 0; i--) if (foes[i].hp <= 0) { const f = foes[i]; foes.splice(i, 1); kill(p, e, f); }
  if (!foes.length) { e.cd = {}; e.buffs = []; e.taunt = null; ev(e, 'clear', {}); }
}
function hitAdv(p, e, f, x, mult, dm) {
  if (!up(x)) return;
  const d = dm[x.id], m = MONS[f.id];
  if (rnd() < Math.min(0.6, d.eva + buffAdd(e, x.id, 'eva'))) { ev(e, 'miss', { s: f.uid, d: x.id }); return; }
  const def = d.def * buffMul(e, x.id, 'def') * (m.magic ? 0.5 : 1);
  const crit = rnd() < (f.boss ? 0.08 : 0.04);
  const guard = Math.min(0.5, (TR(x).guard || 0) + relic('guard'));
  const v = Math.max(1, Math.round(f.atk * mult * (0.85 + rnd() * 0.3) * red(def) * (crit ? 1.6 : 1) * (1 - guard)));
  x.hp -= v;
  ev(e, 'hurt', { s: f.uid, d: x.id, v, c: crit, k: m.magic ? 'magic' : '' });
  if (x.hp <= 0) down(p, e, x, f);
}
function kill(p, e, f) {
  const m = MONS[f.id], F = FIELDS[e.field];
  e.kills++; S.stats.kills++;
  if (f.giant) { ev(e, 'kill', { d: f.uid, id: f.id, sc: 0 }); e.giantDown = 1; return; }   // 레이드 몬스터는 stepRaid가 마무리한다
  const team = teamOf(p).filter(a => !a.down);
  team.forEach(a => { a.kills = (a.kills || 0) + 1; a.pf = (a.pf || 0) + (e.area === 'dungeon' ? 0.08 : 0.04); });
  const harvest = blessed('harvest') ? 1.15 : 1;
  const xp = Math.round(f.lv * 3 * (f.fb ? 8 : f.boss ? 15 : 1) * (1 + (spn('elves') >= 2 ? 0.1 : 0) + (spn('elves') >= 3 ? 0.15 : 0)) * harvest);
  team.forEach(a => { if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
  ev(e, 'kill', { d: f.uid, id: f.id, sc: f.sc || 0 });
  const luck = Math.max(0, ...team.map(a => TR(a).luck || 0));
  const dropMul = (1 + (spn('elves') >= 1 ? 0.1 : 0) + relic('drop') + luck) * harvest, fbm = f.fb ? 3 : 1;
  for (const [it, ch, q] of m.drops) if (rnd() < Math.min(1, ch * dropMul * fbm)) loot(p, e, it, (q || 1) * (f.fb ? 2 : 1));
  if (e.area === 'field' && rnd() < 0.12 * harvest) loot(p, e, 'herb', 1);
  const ap = 1 + rlv('appraise') * 0.25;
  const inD = e.area === 'dungeon';
  if ((f.boss && !f.fb) || (f.fb && rnd() < 0.6) || rnd() < (inD ? 0.025 : 0.006) * ap) lootGear(p, e, makeGear(pickOne(GTYPE_IDS), F.tier, rollQuality(f.boss ? 0.25 : 0)));
  if (rnd() < (f.fb ? 0.3 : f.boss ? 0.6 : (inD ? 0.015 : 0.004) * ap)) { const b = randomBook(Math.max(1, f.lv - 14), f.lv + 2); if (b) loot(p, e, b, 1); }
  bossParts(p, e, f, inD);
  if (luck && rnd() < luck) { const g = Math.round(f.lv * (2 + rnd() * 3)); S.gold += g; S.stats.earned += g; }
  if (f.fb) fieldBossDown(p, e, f);
  else if (f.boss) dungeonClear(p, e);
}
// 보스 전용 부속품: 우두머리(1-10~1-40)는 증표, 필드의 주인(1-50)은 핵, 던전을 공략한 뒤에는 가끔 혼까지
function bossParts(p, e, f, inD) {
  if (!FIELD_IDS.includes(e.field)) return;
  const t = FIELDS[e.field].tier, fs = S.fields[e.field];
  if (f.fb) {
    if (f.fb < 5) loot(p, e, 'crest_' + t, 1 + (rnd() < 0.35 ? 1 : 0));
    else { loot(p, e, 'core_' + t, 1); loot(p, e, 'crest_' + t, 2); if (fs.cleared && rnd() < 0.12 + relic('drop')) loot(p, e, 'soul_' + t, 1); }
    if (rnd() < (f.fb >= 5 ? 0.5 : 0.25)) loot(p, e, runeId(pickOne(RUNE_IDS), f.fb >= 5 && rnd() < 0.3 ? 1 : 0), 1);
  } else if (inD && rnd() < (f.boss ? 1 : 0.02)) loot(p, e, runeId(pickOne(RUNE_IDS), f.boss ? 1 : 0), 1);
}
function fieldBossDown(p, e, f) {
  const fs = S.fields[e.field], F = FIELDS[e.field], k = f.fb;
  fs.boss = fs.boss || {};
  const first = !fs.boss[k];
  fs.boss[k] = (fs.boss[k] || 0) + 1;
  const fame = first ? 4 + k * 3 : 1;
  S.fame += fame;
  teamOf(p).filter(a => !a.down).forEach(a => { a.pf = (a.pf || 0) + (first ? 6 : 3); });
  log(`${p.name}이(가) ${F.no}-${e.stage}의 필드 보스 ${f.name}을(를) 쓰러뜨렸다! 명성 +${fame}`, 'good');
  if (first) HOOKS.toast(`필드 보스 격파 · ${f.name}`);
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
const isCaster = a => ['mage', 'cleric'].includes(jobBase(a.cls)) || a.cls === 'paladin' || CLASSES[a.cls].act === 'magic';
const hpPotions = e => ['pot_l', 'pot_m', 'pot_s'].reduce((s, k) => s + (e.sup[k] || 0), 0);
function potionHeal(k) { return ITEMS[k].heal * (1 + rlv('potion') * 0.25 + (spn('clinic') >= 3 ? 0.2 : 0)); }
function usePotions(p, e, team, dm) {
  if (e.potCd <= 0) {
    const low = team.filter(a => up(a) && a.hp < dm[a.id].maxHp * 0.4).sort((x, y) => x.hp / dm[x.id].maxHp - y.hp / dm[y.id].maxHp)[0];
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
    const dry = team.find(a => up(a) && isCaster(a) && a.mp < dm[a.id].maxMp * 0.2);
    const use = dry && ['mp_s', 'mp_m'].find(k => (e.sup[k] || 0) > 0);
    if (use) {
      addTo(e.sup, use, -1);
      dry.mp = Math.min(dm[dry.id].maxMp, dry.mp + ITEMS[use].mana * (1 + rlv('potion') * 0.25));
      e.mpCd = 2;
      ev(e, 'mana', { d: dry.id, v: ITEMS[use].mana });
    }
  }
}
/* ───────── 쓰러짐: 죽지 않고 들것에 실려 돌아온다 ───────── */
function hurtRoll(f) {
  const r = rnd();
  let sev = r < 0.45 ? 1 : r < 0.86 ? 2 : 3;
  if (f && f.boss && sev < 3 && rnd() < 0.5) sev++;
  return sev;
}
function injure(a, sev) {
  if (a.inj && a.inj.sev >= sev) return;
  a.inj = { sev, need: INJ[sev].need, done: a.inj ? a.inj.done : 0, at: today() };
}
function dropOver(p, e) {
  let over = usedOf(p) - capOf(p);
  if (over <= 0) return;
  const keys = Object.keys(e.bag).sort((x, y) => ITEMS[x].v / ITEMS[x].w - ITEMS[y].v / ITEMS[y].w);
  for (const k of keys) { while (over > 0 && e.bag[k] > 0) { addTo(e.bag, k, -1); over -= ITEMS[k].w; } if (over <= 0) break; }
  e.gbag.sort((x, y) => gearValue(x) - gearValue(y));
  while (over > 0 && e.gbag.length) { const g = e.gbag.shift(); over -= GTYPES[g.base].w; }
  log(`${p.name}은(는) 들것을 싣느라 짐 일부를 버렸다.`);
}
function down(p, e, a, f) {
  a.hp = 0; a.down = true;
  const sev = hurtRoll(f);
  injure(a, sev);
  S.stats.downs = (S.stats.downs || 0) + 1;
  ev(e, 'down', { d: a.id });
  log(`${a.name}이(가) ${FIELDS[e.field].name}에서 쓰러졌다 (${INJ[sev].name}). 동료들이 들것에 싣는다.`, 'bad');
  HOOKS.toast(`${a.name} 쓰러짐 · ${INJ[sev].name}`);
  dropOver(p, e);
  if (p.safe && e.mode === 'advance') recall(p, 'loss');
  if (p.safe && e.foes.length && !e.flee) e.flee = 2.5;   // 조심스러운 파티는 들것을 메고 싸움에서 빠져나온다
  changed();
}
// 모두 쓰러지면: 길드 구조대가 데려오지만 짐은 잃는다
function wipe(p) {
  const e = p.exp, F = FIELDS[e.field];
  teamOf(p).forEach(a => {
    injure(a, Math.max(2, a.inj ? a.inj.sev : 2));
    if (rnd() < 0.25 && a.inj.sev < 3) injure(a, a.inj.sev + 1);
    a.down = false; a.status = 'idle'; a.hp = 1; a.trips++;
  });
  S.stats.wipes = (S.stats.wipes || 0) + 1;
  log(`${p.name}이(가) ${F.name}에서 전멸했다. 길드 구조대가 모두를 데려왔지만 가져오던 짐과 장비는 잃었다.`, 'bad');
  S.flags.firstInj = 1;
  queueModal({ title: `${p.name} 전멸`, body: [`${F.name}에서 원정대가 모두 쓰러졌다. 지나가던 길드 구조대 덕분에 목숨은 건졌지만 모두 크게 다쳤고, 가져오던 부속품과 장비, 물약은 잃었다.`, '다친 모험가는 신전에서 치료해야 다시 원정에 나갈 수 있다. 무리하지 말자.'] });
  p.last = { got: {}, gear: 0, kills: e.kills, field: e.field, wiped: 1 };
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
  const hurt = team.filter(a => a.down || a.inj);
  team.forEach(a => { if (!a.down) a.pf = (a.pf || 0) + 1; a.down = false; a.hp = Math.max(1, a.hp); a.status = 'idle'; a.trips++; });
  team.filter(a => a.quit).forEach(a => leave(a, '밀린 봉급 때문에 상단을 떠났다.'));
  const n = Object.values(got).reduce((s, q) => s + q, 0);
  log(`${p.name}이(가) 돌아왔다. 부속품 ${n}개(약 ${val}G어치)${e.gbag.length ? `, 장비 ${e.gbag.length}개` : ''}, 처치 ${e.kills}마리.`, 'good');
  if (hurt.length) log(`부상자 ${hurt.map(a => a.name).join(', ')}이(가) ${S.bld.temple ? '신전 치료실로 옮겨졌다' : '여관 방에 눕혀졌다. 신전이 있으면 훨씬 빨리 낫는다'}.`, 'bad');
  if (hurt.length && !S.flags.firstInj) { S.flags.firstInj = 1; queueModal({ title: '첫 부상자', body: STORY.firstInj }); }
  HOOKS.toast(`${p.name} 귀환 · 부속품 ${n}개${e.gbag.length ? ` · 장비 ${e.gbag.length}개` : ''}${hurt.length ? ` · 부상 ${hurt.length}명` : ''}`);
  p.last = { got, gear: e.gbag.length, kills: e.kills, field: e.field, hurt: hurt.length };
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
  const team = teamOf(p).filter(a => !a.down);
  if (F.raid) {
    S.flags.guildDown = 1;
    S.fame += 50; S.gold += 5000; S.stats.earned += 5000;
    team.forEach(a => { a.pf = (a.pf || 0) + 25; });
    log(`${p.name}이(가) 암살자 길드장을 쓰러뜨렸다! 길드 금고에서 5,000G, 명성 +50`, 'good');
    queueModal({ title: '암살자 길드 토벌', body: STORY.guild });
  } else if (first) {
    const gold = DUNGEON_GOLD[F.tier] || 3000, fame = 60 + F.tier * 25;
    S.gold += gold; S.fame += fame; S.stats.earned += gold; S.stats.dungeons = (S.stats.dungeons || 0) + 1;
    team.forEach(a => { a.pf = (a.pf || 0) + 20; });
    // 보물 상자: 전설·영웅 장비와 장비 한 점, 스킬북 두 권, 주인의 혼 둘, 중급 룬 둘. 그리고 유물
    e.gbag.push(makeGear(pickOne(GTYPE_IDS), F.tier, 4), makeGear(pickOne(GTYPE_IDS), F.tier, 3), makeGear(pickOne(GTYPE_IDS), F.tier, Math.max(1, rollQuality(0.4))));
    const b1 = randomBook(F.lv, F.lv + 16), b2 = randomBook(F.lv, F.lv + 20);
    if (b1) addTo(e.bag, b1, 1); if (b2) addTo(e.bag, b2, 1);
    addTo(e.bag, 'soul_' + F.tier, 2);
    addTo(e.bag, runeId(pickOne(RUNE_IDS), 1), 1); addTo(e.bag, runeId(pickOne(RUNE_IDS), 1), 1);
    const RL = RELICS[e.field], newRelic = RL && !(S.relics || []).includes(e.field);
    if (newRelic) (S.relics = S.relics || []).push(e.field);
    log(`${p.name}이(가) ${F.dungeon.name}의 주인 ${MONS[F.dungeon.boss].name}을(를) 쓰러뜨렸다! 보물 ${g$(gold)}, 명성 +${fame}${newRelic ? `, 유물 「${RL.name}」` : ''}`, 'good');
    queueModal({ title: `${F.dungeon.name} 공략`, body: (STORY[e.field] || []).concat([`보물 상자에서 ${g$(gold)}과 전설·영웅 장비, 스킬북, ${ITEMS['soul_' + F.tier].name} 둘, 룬을 찾았다. 명성 +${fame}. 함께 싸운 모험가들의 개인 명성도 크게 올랐다.`], newRelic ? [`유물 「${RL.name}」을(를) 얻었다. ${RL.desc}. 상단 창의 유물에서 볼 수 있다.`] : []) });
  } else {
    S.fame += 3;
    log(`${p.name}이(가) ${MONS[F.dungeon.boss].name}을(를) 또 쓰러뜨렸다. 명성 +3`, 'good');
  }
  e.mode = 'return'; e.why = 'boss'; e.ei = 0; e.encs = []; e.next = null;
  changed();
}
const raidReady = () => S.fame >= GUILD_RAID.fame && living().length >= GUILD_RAID.advs && spn(GUILD_RAID.sponsor) >= GUILD_RAID.tier;
// 필드는 상단 랭크가 오르면 하나씩 열린다 (랭크 F = 평원, E = 원시림 …)
function isUnlocked(fid) {
  if (fid === 'alley') return !S.flags.guildDown && raidReady();
  const F = FIELDS[fid];
  if (F && F.giant) { const r = raidRec(F.giant); return !!(r && !r.done); }
  return !!F && !F.raid && (S.rank || 0) >= F.no - 1;
}

/* ───────── 초대형 레이드: 다른 상단·왕국 원정대와 같은 몬스터를 두고 겨룬다 ───────── */
const RAID_FIGHT = 90;      // 한 번 도전하면 이만큼(게임 속 초) 싸우고 물러난다
const RAID_GAP = 10;        // 레이드 레벨보다 이만큼 낮은 파티까지 도전할 수 있다
const raidRec = id => (S && S.raid ? S.raid.list.find(r => r.id === id) : null);
const raidHp = L => Math.round(600 * (25 + 18 * L + 1.15 * L * L) * DIFF.hp / 1000) * 1000;
function giantFoe(id) {
  const R = RAIDS[id], rec = raidRec(id), f = foeFrom(R.mon, R.lv + 4);
  Object.assign(f, { maxHp: rec.max, hp: rec.hp, giant: id, boss: true, aoe: true, name: R.name, atk: f.atk * 0.55, spd: Math.min(f.spd, 0.8) });   // 파티 전체를 자주 치니 한 방은 약하게
  return f;
}
function raidLeave(p, e, why) {
  e.mode = 'return'; e.why = why; e.foes = []; e.next = null; e.wait = null; e.flee = 0; e.left = 1;
  const team = teamOf(p).filter(a => !a.down), xp = Math.round(e.dealt / 20);
  if (e.dealt > 0 && !e.paid) {
    e.paid = 1;
    team.forEach(a => { a.pf = (a.pf || 0) + 3; if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
    log(`${p.name}이(가) ${RAIDS[e.raid].name}에게 ${Math.round(e.dealt).toLocaleString('ko-KR')} 피해를 주고 물러났다.`, 'good');
  }
  changed();
}
function stepRaid(p, e, team, dm, dt, fr) {
  const rec = raidRec(e.raid);
  if (e.foes.length) {
    const f = e.foes[0];
    if (!rec || rec.done) { raidLeave(p, e, 'over'); return; }
    if (e.mode === 'return' && !e.flee) { raidLeave(p, e, e.why || 'order'); return; }   // 복귀 명령
    f.hp = rec.hp;                      // 다른 파티와 경쟁자가 깎은 만큼 반영
    const before = f.hp;
    tire(team, FATIGUE.fight * fr * dt);
    battle(p, e, team, dm, dt);
    if (!p.exp) return;                 // 전멸
    const dealt = Math.max(0, before - Math.max(0, f.hp));
    if (dealt) { rec.hp = Math.max(0, rec.hp - dealt); rec.me += dealt; e.dealt += dealt; }
    if (rec.hp <= 0) { raidEnd(rec, 'kill'); raidLeave(p, e, 'raid'); return; }
    e.rt += dt;
    if (e.foes.length && e.rt >= RAID_FIGHT) raidLeave(p, e, 'time');
    return;
  }
  if (e.fought && !e.left) { raidLeave(p, e, e.why || 'retreat'); return; }   // 들것을 메고 빠져나왔다
  team.forEach(a => { const d = dm[a.id]; a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.008 * dt); a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  tire(team, FATIGUE.walk * fr * dt);
  const v = moveOf(p) * (e.mode === 'return' ? 1.15 : 1);
  if (e.mode === 'advance') {
    if (!rec || rec.done) { raidLeave(p, e, 'over'); return; }
    e.pos = Math.min(STAGE_LEN * 0.6, e.pos + v * dt);
    if (e.pos >= STAGE_LEN * 0.6) { e.foes = [giantFoe(e.raid)]; e.fought = 1; e.cd = {}; e.buffs = []; e.taunt = null; ev(e, 'spawn', { boss: true, name: RAIDS[e.raid].name }); }
  } else {
    e.pos -= v * dt;
    if (e.pos <= 0) arrive(p);
  }
}
