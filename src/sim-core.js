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

function changed() { HOOKS.changed(); }
function log(text, kind = '') {
  const p = dateParts(S.t);
  S.log.unshift({ d: `${p.m}.${p.d}`, text, kind });
  if (S.log.length > 60) S.log.length = 60;
}
function queueModal(m) { S.modals.push(m); HOOKS.modal(); }

/* ───────── 모험가 ───────── */
function expNeed(lv) { return Math.round(22 * Math.pow(lv, 1.72)); }
function statsFor(cls, lv, hero) {
  const C = CLASSES[cls], g = hero ? 1.2 : 1, k = lv - 1;
  return {
    maxHp: Math.round(C.hp * (1 + 0.13 * k * g)),
    atk: Math.round(C.atk * (1 + 0.12 * k * g) * 10) / 10,
    def: Math.round((C.def + 0.45 * k * g) * 10) / 10,
    spd: C.spd, crit: C.crit, carry: C.carry + (cls === 'porter' ? k * 2 : Math.floor(k / 3))
  };
}
function makeAdv(o = {}) {
  const cls = o.cls || pickOne(CLASS_IDS);
  const lv = o.lv || 1;
  const a = {
    id: nid(), name: o.name || (pickOne(NAME_A) + pickOne(NAME_B)), cls, lv, exp: 0, hero: !!o.hero,
    look: { hair: pickOne(HAIRS), skin: pickOne(SKINS) },
    bio: o.bio || pickOne(BIOS[cls]), status: 'idle', kills: 0, trips: 0, quit: false,
    salary: o.salary != null ? o.salary : Math.round(CLASSES[cls].salary * (1 + 0.09 * (lv - 1)) / 5) * 5
  };
  Object.assign(a, statsFor(cls, lv, a.hero));
  a.hp = a.maxHp;
  return a;
}
function addExp(a, n) {
  a.exp += n;
  let up = false;
  while (a.exp >= expNeed(a.lv)) {
    a.exp -= expNeed(a.lv); a.lv++; up = true;
    const st = statsFor(a.cls, a.lv, a.hero);
    const gain = st.maxHp - a.maxHp;
    Object.assign(a, st); a.hp = Math.min(a.maxHp, a.hp + gain);
  }
  return up;
}
const advById = id => S.advs.find(a => a.id === id);
const living = () => S.advs.filter(a => a.status !== 'dead');
const partyOf = aid => S.parties.find(p => p.members.includes(aid));
const beds = () => 2 + S.bld.inn * 2;

/* ───────── 짐 ───────── */
const wOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].w * q : 0), 0);
const vOf = bag => Object.entries(bag).reduce((s, [k, q]) => s + (ITEMS[k] ? ITEMS[k].v * q : 0), 0);
function capOf(p) { return p.members.map(advById).filter(a => a && a.status !== 'dead').reduce((s, a) => s + a.carry, 0); }
function usedOf(p) { return p.exp ? wOf(p.exp.bag) + wOf(p.exp.sup) : wOf(p.sup); }
function addTo(bag, k, q) { bag[k] = (bag[k] || 0) + q; if (bag[k] <= 0) delete bag[k]; }

/* ───────── 원정 ───────── */
function areaDef(e) { const F = FIELDS[e.field]; return e.area === 'dungeon' ? F.dungeon : F; }
function makeEncs(e) {
  if (e.mode === 'return') return rnd() < 0.4 ? [ri(30, 70)] : [];
  if (e.area === 'dungeon') return e.stage === DUNGEON_FLOORS ? [35, 80] : [30, 70];
  return [25 + ri(-4, 4), 55 + ri(-4, 4), 85 + ri(-4, 4)];
}
function foeFrom(id, lv) {
  const m = MONS[id], k = lv - 1;
  const hp = Math.round(m.hp * (1 + 0.16 * k));
  return { uid: nid(), id, lv, hp, maxHp: hp, atk: m.atk * (1 + 0.1 * k), def: m.def + Math.floor(k / 3), spd: m.spd, cd: 0.6 + rnd() * 0.8, boss: !!m.boss };
}
function rollFoes(e, idx) {
  const F = FIELDS[e.field], A = areaDef(e);
  const boss = e.area === 'dungeon' && e.stage === DUNGEON_FLOORS && e.mode === 'advance' && idx === e.encs.length - 1;
  const lv = e.area === 'dungeon' ? F.lv + 7 + e.stage : F.lv + e.stage - 1;
  const pool = A.mons.filter(id => e.area === 'dungeon' || (MONS[id].minS || 1) <= e.stage);
  const out = [];
  if (boss) { out.push(foeFrom(A.boss, F.lv + 13)); out.push(foeFrom(pickOne(pool), lv)); }
  else {
    const n = e.mode === 'return' ? 1 : Math.min(4, 1 + ri(0, Math.floor(e.stage / 4)) + (e.area === 'dungeon' ? 1 : 0));
    for (let i = 0; i < n; i++) out.push(foeFrom(pickOne(pool), lv));
  }
  return out;
}
function spawn(p, e) {
  e.foes = e.next || rollFoes(e, e.ei - 1);
  e.next = null;
  e.cd = {};
  ev(e, 'spawn', { boss: e.foes.some(f => f.boss) });
}
function ev(e, type, data) { e.ev.push(Object.assign({ n: ++e.evN, type }, data)); if (e.ev.length > 40) e.ev.shift(); }

function startExp(p, fid) {
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 보낼 수 있어요.';
  if (!isUnlocked(fid)) return '아직 갈 수 없는 지역이에요.';
  const sup = {};
  for (const [k, q] of Object.entries(p.sup)) { const have = S.inv[k] || 0; const take = Math.min(have, q); if (take > 0) { sup[k] = take; addTo(S.inv, k, -take); } }
  const e = { field: fid, area: 'field', mode: 'advance', stage: 1, pos: 0, ei: 0, encs: [], foes: [], bag: {}, sup, cd: {}, potCd: 0,
    kills: 0, c10: false, goDungeon: false, full: false, ev: [], evN: 0, t0: S.t, why: '' };
  e.encs = makeEncs(e);
  team.forEach(a => { a.status = 'away'; });
  p.exp = e;
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
  const team = p.members.map(advById).filter(a => a && a.status !== 'dead');
  if (!team.length) { wipe(p); return; }
  e.potCd = Math.max(0, e.potCd - dt);
  usePotions(p, e, team);
  if (p.safe && e.mode === 'advance' && !e.foes.length && !wOf(e.sup) && team.some(a => a.hp < a.maxHp * 0.5)) recall(p, 'danger');
  if (e.foes.length) { battle(p, e, team, dt); return; }
  team.forEach(a => { a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.008 * dt); });
  if (e.goDungeon) { enterDungeon(p); return; }
  if (!e.next && e.encs[e.ei] != null) e.next = rollFoes(e, e.ei);
  if (e.mode === 'advance') {
    const next = e.encs[e.ei], np = e.pos + WALK * dt;
    if (next != null && np >= next) { e.pos = next; e.ei++; spawn(p, e); return; }
    e.pos = np;
    if (e.pos >= STAGE_LEN) stageClear(p, e);
  } else {
    const next = e.encs[e.ei], np = e.pos - WALK * 1.2 * dt;
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
    else e.stage++;
  } else if (e.stage < DUNGEON_FLOORS) e.stage++;
  e.pos = 0; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}
function stageBack(p, e) {
  if (e.area === 'dungeon') { if (e.stage > 1) e.stage--; else { e.area = 'field'; e.stage = 10; } }
  else if (e.stage > 1) e.stage--;
  else { arrive(p); return; }
  e.pos = STAGE_LEN; e.ei = 0; e.encs = makeEncs(e); e.next = null;
  changed();
}

/* ───────── 전투 ───────── */
function dmgCalc(atk, def, crit) {
  const c = rnd() < crit;
  const d = Math.max(1, Math.round((atk * (0.85 + rnd() * 0.3) - def * 0.5) * (c ? 1.75 : 1)));
  return [d, c];
}
function battle(p, e, team, dt) {
  const foes = e.foes;
  for (const a of team) {
    e.cd[a.id] = (e.cd[a.id] ?? (0.3 + rnd() * 0.6)) - dt;
    if (e.cd[a.id] > 0) continue;
    e.cd[a.id] = 1 / a.spd * (0.9 + rnd() * 0.2);
    const C = CLASSES[a.cls];
    const alive = foes.filter(f => f.hp > 0);
    if (!alive.length) break;
    if (C.act === 'heal') {
      const hurt = team.filter(x => x.hp > 0 && x.hp < x.maxHp * 0.65).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
      if (hurt) { const h = Math.round(a.atk * 1.7 + a.lv * 2); hurt.hp = Math.min(hurt.maxHp, hurt.hp + h); ev(e, 'heal', { s: a.id, d: hurt.id, v: h }); continue; }
    }
    if (C.act === 'magic') {
      for (const f of alive) { const [d, c] = dmgCalc(a.atk * 0.75, f.def * 0.6, a.crit); f.hp -= d; ev(e, 'hit', { s: a.id, d: f.uid, v: d, c, k: 'magic' }); }
      continue;
    }
    const tgt = C.act === 'arrow' ? alive.slice().sort((x, y) => x.hp - y.hp)[0] : alive[0];
    const [d, c] = dmgCalc(a.atk, tgt.def, a.crit);
    tgt.hp -= d;
    ev(e, 'hit', { s: a.id, d: tgt.uid, v: d, c, k: C.act === 'arrow' ? 'arrow' : 'melee' });
  }
  for (const f of foes) {
    if (f.hp <= 0) continue;
    f.cd -= dt;
    if (f.cd > 0) continue;
    f.cd = 1 / f.spd * (0.9 + rnd() * 0.25);
    const live = team.filter(x => x.hp > 0);
    if (!live.length) break;
    const tank = live.find(x => x.cls === 'warrior');
    const tgt = tank && rnd() < 0.75 ? tank : live[0];
    const [d, c] = dmgCalc(f.atk, tgt.def, f.boss ? 0.08 : 0.04);
    tgt.hp -= d;
    ev(e, 'hurt', { s: f.uid, d: tgt.id, v: d, c });
    if (tgt.hp <= 0) die(p, e, tgt);
  }
  for (let i = foes.length - 1; i >= 0; i--) if (foes[i].hp <= 0) { kill(p, e, foes[i]); foes.splice(i, 1); }
  if (!foes.length) { e.cd = {}; ev(e, 'clear', {}); }
}
function kill(p, e, f) {
  const m = MONS[f.id];
  e.kills++; S.stats.kills++;
  const team = p.members.map(advById).filter(a => a && a.status !== 'dead');
  const xp = Math.round(f.lv * 3 * (f.boss ? 12 : 1));
  team.forEach(a => { if (addExp(a, xp)) { ev(e, 'lvl', { d: a.id }); log(`${a.name}이(가) Lv${a.lv}이 되었다.`, 'good'); } });
  ev(e, 'kill', { d: f.uid, id: f.id });
  for (const [it, ch, q] of m.drops) if (rnd() < ch) loot(p, e, it, q || 1);
  if (f.boss) dungeonClear(p, e);
}
function loot(p, e, it, q) {
  const room = capOf(p) - usedOf(p);
  const fit = Math.min(q, Math.floor(room / ITEMS[it].w));
  if (fit > 0) { addTo(e.bag, it, fit); ev(e, 'loot', { id: it }); }
  if (fit < q) e.full = true;
  if (e.full && p.auto && e.mode === 'advance' && e.area === 'field') recall(p, 'full');
}
function usePotions(p, e, team) {
  if (e.potCd > 0) return;
  const low = team.filter(a => a.hp > 0 && a.hp < a.maxHp * 0.4).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
  if (!low) return;
  const pid = ['pot_m', 'pot_s'].find(k => (e.sup[k] || 0) > 0 && (k === 'pot_s' || low.maxHp - low.hp > 60));
  const use = pid || ((e.sup.pot_s || 0) > 0 ? 'pot_s' : (e.sup.pot_m || 0) > 0 ? 'pot_m' : null);
  if (!use) return;
  addTo(e.sup, use, -1);
  low.hp = Math.min(low.maxHp, low.hp + ITEMS[use].heal);
  e.potCd = 1.5;
  ev(e, 'pot', { d: low.id, v: ITEMS[use].heal });
}
function die(p, e, a) {
  a.hp = 0; a.status = 'dead';
  p.members = p.members.filter(id => id !== a.id);
  S.graves.unshift({ name: a.name, cls: a.cls, lv: a.lv, hero: a.hero, date: dateStr(S.t), where: `${FIELDS[e.field].name} ${e.area === 'dungeon' ? '던전 ' + e.stage + '층' : FIELDS[e.field].no + '-' + e.stage}` });
  S.stats.deaths++;
  ev(e, 'die', { d: a.id, cls: a.cls });
  log(`${a.name}(${CLASSES[a.cls].name}, Lv${a.lv})이(가) ${FIELDS[e.field].name}에서 쓰러졌다.`, 'bad');
  HOOKS.toast(`${a.name}이(가) 전사했다`);
  // 남은 인원이 들 수 있는 만큼만 남긴다 (값싼 것부터 버림)
  let over = usedOf(p) - capOf(p);
  if (over > 0) {
    const keys = Object.keys(e.bag).sort((x, y) => ITEMS[x].v / ITEMS[x].w - ITEMS[y].v / ITEMS[y].w);
    for (const k of keys) { while (over > 0 && e.bag[k] > 0) { addTo(e.bag, k, -1); over -= ITEMS[k].w; } if (over <= 0) break; }
    log(`${p.name}은(는) 짐이 넘쳐 일부 부속품을 버렸다.`);
  }
  S.advs = S.advs.filter(x => x.id !== a.id);
  if (p.safe && p.members.length && e.mode === 'advance') recall(p, 'loss');
  changed();
}
function wipe(p) {
  log(`${p.name}이(가) ${FIELDS[p.exp.field].name}에서 전멸했다. 가져오던 짐도 모두 잃었다.`, 'bad');
  queueModal({ title: `${p.name} 전멸`, body: [`${FIELDS[p.exp.field].name}에서 원정대가 전멸했다. 가져오던 부속품도 모두 잃었다.`, '모험가는 한 번 쓰러지면 돌아오지 않는다. 물약을 넉넉히 챙기고, 무리하지 말자.'] });
  p.exp = null;
  changed();
}
function arrive(p) {
  const e = p.exp;
  const got = Object.assign({}, e.bag), val = vOf(got);
  for (const [k, q] of Object.entries(e.bag)) addTo(S.inv, k, q);
  for (const [k, q] of Object.entries(e.sup)) addTo(S.inv, k, q);
  const team = p.members.map(advById).filter(Boolean);
  team.forEach(a => { a.status = 'idle'; a.trips++; });
  const quitters = team.filter(a => a.quit);
  quitters.forEach(a => leave(a, '밀린 봉급 때문에 상단을 떠났다.'));
  const n = Object.values(got).reduce((s, q) => s + q, 0);
  log(`${p.name}이(가) 돌아왔다. 부속품 ${n}개 (약 ${val}G어치), 처치 ${e.kills}마리.`, 'good');
  HOOKS.toast(`${p.name} 귀환 · 부속품 ${n}개`);
  p.last = { got, kills: e.kills, field: e.field };
  p.exp = null;
  if (!S.flags.firstReturn) { S.flags.firstReturn = 1; queueModal({ title: '첫 원정', body: STORY.firstReturn }); }
  changed();
}
function leave(a, why) {
  const p = partyOf(a.id);
  if (p) p.members = p.members.filter(id => id !== a.id);
  S.advs = S.advs.filter(x => x.id !== a.id);
  log(`${a.name}이(가) ${why}`, 'bad');
}
function dungeonClear(p, e) {
  const fs = S.fields[e.field], F = FIELDS[e.field];
  const first = !fs.cleared;
  fs.cleared = true;
  S.fame += first ? 25 : 5;
  log(`${p.name}이(가) ${F.dungeon.name}의 주인 ${MONS[F.dungeon.boss].name}을(를) 쓰러뜨렸다! 명성 +${first ? 25 : 5}`, 'good');
  if (first) {
    const H = HEROES[e.field];
    if (H) { S.heroQueue.push(e.field); syncHeroes(); }
    queueModal({ title: `${F.dungeon.name} 공략`, body: STORY[e.field] || [] });
  }
  e.mode = 'return'; e.why = 'boss'; e.ei = 0; e.encs = []; e.next = null;
  changed();
}
function isUnlocked(fid) {
  if (fid === 'plains') return true;
  const prev = FIELD_IDS.find(k => FIELDS[k].next === fid);
  return !!(prev && S.fields[prev].cleared);
}
