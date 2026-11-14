/* ───────── 새 게임과 저장 이전 ───────── */
const g$ = n => Math.round(n).toLocaleString('ko-KR') + 'G';
const WEAPON_OF = { warrior: 'sword', archer: 'bow', mage: 'staff', cleric: 'mace', rogue: 'dagger', porter: 'club',
  gladiator: 'gladius', champion: 'gladius', knight: 'sword', paladin: 'sword', berserker: 'great', bloodlord: 'great',   // 빌드 64: 2차 무기는 늪지 단계부터 (weaponOf, data-warr.js)
  // 빌드 65 장비 개편 2단계: 2차 직업 무기(늪지 단계부터 — 그 아래 단계는 WEAPON_LOW의 옛 무기). 빌드 65 직업 개편: 정찰가 · 탐험가 = 정글칼 · 용기수 = 복합궁 · 쌍검사 · 검무사 = 단검(+ 보조 단검)
  ranger: 'compbow', dragoon: 'compbow', sniper: 'longbow', hawkeye: 'longbow', bard: 'lute', maestro: 'lute', coachman: 'whip', conestoga: 'whip', caravanmaster: 'whip', scout: 'machete', pathfinder: 'machete', mhunter: 'compound', dslayer: 'compound', huntsman: 'greatbow', kaijuhunter: 'greatbow', sorcerer: 'staff', archmage: 'staff', elemancer: 'orb', alchemist: 'orb',
  assassin: 'dagger', shadowlord: 'dagger', duelist: 'dagger', bladedancer: 'dagger', treasure: 'card', phantomthief: 'card', masterthief: 'card', ninja: 'dagger', kageninja: 'dagger',
  elementalist: 'wand', elementlord: 'wand', necromancer: 'necro', lich: 'necro', spellblade: 'manasword', arcblade: 'manasword',
  priest: 'staff', archbishop: 'staff', plaguedoc: 'mace', physician: 'mace', exorcist: 'mace', inquisitor: 'mace' };
const newField = () => ({ best: 0, cleared: false, found: false, boss: {} });

function blankState(company) {
  return {
    v: SAVE_V, seq: 1, t: 0, lastSeen: Date.now(),
    company: (company || '').trim().slice(0, 12) || '등불 상단',
    gold: 1000, fame: 0, rank: 0, unlocked: [],
    inv: { pot_s: 6, mp_s: 2, herb: 6 },
    advs: [], parties: [], gear: [], pets: [], pen: { inc: [] }, wh: Array.from({ length: WH_N }, () => ({ inv: {}, gear: [] })),
    fields: Object.fromEntries(ALL_FIELDS.map(f => [f, newField()])),
    cands: [], reqs: [], bless: null, autoTreat: true,
    shop: { slots: [] }, sold: { day: -1, n: 0, g: 0 },
    bld: { shop: 1, inn: 1, alchemy: 0, training: 0, smithy: 0, tower: 0, temple: 0, pen: 0, stable: 0, library: 0, airfield: 0, kitchen: 0, salvage: 0, farm: 0 },
    stable: { horses: {} }, league: null, presets: [], wx: { seed: Math.floor(Math.random() * 1e9) },
    settleDay: MONTH_DAYS,
    research: { lv: {}, cur: null },
    spons: {},
    log: [], modals: [], flags: { v02: 1, v03: 1, v04: 1, v05: 1, v06: 1, v07: 1, bview: 1, v22: 1, v23: 1, v25: 1, v28: 1, v29: 1, v30: 1, v31: 1, v34: 1, v36: 1, v37: 1, v38: 1, v39: 1, v40: 1, v41: 1, v42: 1, v43: 1, v44: 1, v45: 1, v46: 1, v48: 1, v49: 1, v50: 1, v51: 1, v52: 1, v53: 1, v55: 1, v56: 1, v57: 1, v58: 1, v59: 1, v60: 1, v61: 1, v62: 1, v63: 1, v63b: 1, v63c: 1, wh63: 1, v64: 1, v65: 1, v67: 1, v68: 1, v68b: 1, v69: 1, v69b: 1, v69c: 1, v69d: 1, v69e: 1 }, speed: 1,
    relics: [], raid: null, king: { favor: {}, visit: null, next: 4 },
    cook: { known: {}, made: {}, pot: [], sus: 0 }, farm: { cur: 0, auto: 1, houses: [] }, port: { next: 3, ship: null },
    stats: { earned: 0, kills: 0, downs: 0, wipes: 0, trips: 0, sales: 0, reqs: 0, soldG: 0, dungeons: 0 },
    view: null
  };
}
function newParty(name, members) {
  return { id: nid(), name, members, sup: { pot_s: 3 }, auto: true, safe: true, repeat: false, dest: 'plains', exp: null, last: null, wagon: null, horse: null, wagonPlus: 0, dmode: 'ask', campNight: true, start: 1, pet: null };
}
function starterGear(a) { a.eq.weapon = makeGear(weaponOf(a.cls, 0), 0, 0); const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; }
function newGame(company) {
  S = blankState(company);
  const w = makeAdv({ cls: 'warrior', name: '브람', bio: '오물거리에서 나고 자란 덩치. 당신의 첫 직원이다.' });
  const ar = makeAdv({ cls: 'archer', name: '리네', bio: '평원 마을에서 올라온 궁수. 빚을 갚을 때까지 일하기로 했다.' });
  const cl = makeAdv({ cls: 'cleric', name: '테오', bio: '오물거리 무료 진료소에서 일하던 성직자. 당신을 따라왔다.' });
  [w, ar, cl].forEach(starterGear);
  S.advs.push(w, ar, cl);
  S.parties.push(newParty('1팀', [w.id, ar.id, cl.id]));
  S.view = S.parties[0].id;
  rollCands(); genReq(); genReq();
  raidMonth(true);
  log(`${S.company}이(가) ${WORLD.street} 입구에 문을 열었다.`);
  queueModal({ title: '검은 두건의 손님', body: STORY.assassin });
}
function migrate(v) {
  const s = blankState(v.company);
  S = s;
  Object.assign(s, { seq: v.seq || 1, t: v.t || 0, lastSeen: v.lastSeen || Date.now(), gold: v.gold || 0, fame: v.fame || 0, inv: v.inv || {},
    graves: v.graves || [], log: v.log || [], settleDay: v.settleDay || MONTH_DAYS, view: v.view, shop: v.shop || { slots: [] } });
  Object.assign(s.stats, v.stats || {});
  Object.assign(s.flags, v.flags || {}, { v02: 0, v03: 0, v04: 0, v05: 0, v06: 0, v07: 0 });
  Object.assign(s.bld, v.bld || {});
  for (const f of Object.keys(v.fields || {})) if (s.fields[f]) s.fields[f] = v.fields[f];
  // 모험가는 지금 레벨에 맞춰 능력치를 새로 만든다
  s.v = 1;
  s.advs = (v.advs || []).filter(a => a.status !== 'dead').map(o => {
    const a = makeAdv({ cls: o.cls, lv: o.lv || 1, name: o.name, bio: o.bio, hero: o.hero, salary: o.salary });
    Object.assign(a, { id: o.id, look: o.look || a.look, kills: o.kills || 0, trips: o.trips || 0, quit: !!o.quit, unpaid: o.unpaid || 0 });
    starterGear(a);
    return a;
  });
  // 원정 중이던 파티는 짐을 들고 바로 돌아온 것으로 한다
  s.parties = (v.parties || []).map(p => {
    if (p.exp) { for (const [k, q] of Object.entries(p.exp.bag || {})) addTo(s.inv, k, q); for (const [k, q] of Object.entries(p.exp.sup || {})) addTo(s.inv, k, q); }
    const np = newParty(p.name, (p.members || []).filter(id => s.advs.some(a => a.id === id)));
    Object.assign(np, { id: p.id, sup: p.sup || np.sup, auto: p.auto !== false, safe: p.safe !== false, repeat: !!p.repeat, dest: p.dest || 'plains' });
    return np;
  });
  s.seq = Math.max(s.seq, ...s.advs.map(a => a.id + 1), ...s.parties.map(p => p.id + 1));
  s.modals = [{ title: 'v0.2 업데이트', body: STORY.v02 }];
  rollCands(); genReq(); genReq();
  return s;
}
// v0.2 → v0.3: 필드 50단계, 피로, 마차, 신전 (옛 던전 입구 위치는 v0.5에서 없어졌다)
function migrate3() {
  S.v = Math.max(S.v || 0, 3);
  S.bld.temple = S.bld.temple || 0;
  S.bless = S.bless || null;
  S.graves = S.graves || [];
  ALL_FIELDS.forEach(f => { const fs = S.fields[f] || (S.fields[f] = newField()); if (fs.found == null) fs.found = !!fs.cleared; });
  S.advs.forEach(a => { if (a.fat == null) a.fat = 0; });
  S.parties.forEach(p => {
    if (p.wagon === undefined) p.wagon = null;
    if (!p.dmode) p.dmode = 'ask';
    if (p.campNight == null) p.campNight = true;
    const e = p.exp;
    if (e) { e.camp = e.camp || null; e.wait = e.wait || null; delete e.c10; delete e.goDungeon; if (e.area === 'dungeon' && !FIELDS[e.field].raid && S.fields[e.field].cleared) e.mode = 'return'; }
  });
  if (!S.flags.v03) { S.flags.v03 = 1; S.modals.push({ title: 'v0.3 업데이트', body: STORY.v03 }); }
  if (!S.flags.v04) { S.flags.v04 = 1; S.modals.push({ title: 'v0.4 업데이트', body: STORY.v04 }); }
  if (!speedList().includes(S.speed)) S.speed = 1;
}
// v0.4 → v0.5: 죽음 대신 부상, 필드 보스와 거점, 상단 랭크, 라이선스, 전직, 숙면 피로
function migrate4() {
  if (S.v >= 4) return;
  S.v = 4;
  let r = 0;
  while (FIELD_IDS[r] && S.fields[FIELD_IDS[r]] && S.fields[FIELD_IDS[r]].cleared && r < RANKS.length - 1) r++;
  S.rank = r;                                   // 지금까지 연 필드는 그대로 열려 있도록
  S.autoTreat = true;
  S.stats = Object.assign({ downs: 0, wipes: 0, reqs: Math.round(S.fame / 8), soldG: Math.round((S.stats.earned || 0) * 0.6), dungeons: FIELD_IDS.filter(f => S.fields[f].cleared).length }, S.stats);
  ALL_FIELDS.forEach(f => {
    const fs = S.fields[f] || (S.fields[f] = newField());
    delete fs.gate; delete fs.spec;
    fs.found = !!fs.cleared;
    fs.boss = fs.boss || {};
    for (let k = 1; k <= 4; k++) if ((fs.best || 0) >= k * BOSS_EVERY && !fs.boss[k]) fs.boss[k] = 1;   // 이미 지나온 구간은 거점으로 쓴다
  });
  S.advs.forEach(a => { a.pf = a.pf != null ? a.pf : Math.round((a.kills || 0) / 25 + a.lv * 1.5); a.rank = a.rank || 0; a.sleep = 0; a.inj = null; a.post = null; a.down = false; });
  // 묘지에 있던 모험가: 사실 오물거리 진료소에 누워 있었다
  const back = [];
  for (const g of S.graves || []) {
    if (living().length >= beds()) break;
    let a;
    if (g.adv) { a = JSON.parse(JSON.stringify(g.adv)); a.id = nid(); }
    else a = makeAdv({ cls: g.cls, lv: g.lv, name: g.name, hero: g.hero });
    Object.assign(a, { status: 'idle', quit: false, unpaid: 0, fat: 0, sleep: 0, post: null, down: false, rank: a.rank || 0 });
    if (a.pf == null) a.pf = Math.round((a.kills || 0) / 25 + a.lv * 1.5);
    a.eq = a.eq || { weapon: null, armor: null, acc: null, bag: null };
    const d = derive(a); a.hp = Math.round(d.maxHp * 0.2); a.mp = d.maxMp;
    a.inj = { sev: 3, need: INJ[3].need, done: 0, at: today() };
    S.advs.push(a); back.push(a.name);
  }
  delete S.graves; delete S.heroQueue; delete S.specQueue;
  S.cands = (S.cands || []).filter(c => !c.heroOf && !c.specOf);
  S.unlocked = [];
  S.parties.forEach(p => {
    p.start = 1;
    const e = p.exp;
    if (e) { e.home = 1; if (e.wait === 'gate' && e.area === 'field' && e.stage < FIELD_STAGES) e.wait = null; }
  });
  if (S.parties.filter(p => !p.raidOnly).length > partyMax()) S.flags.overParty = 1;
  if (!S.flags.v05) {
    S.flags.v05 = 1;
    const body = STORY.v05.slice();
    if (back.length) body.push(`묘지에 이름을 올렸던 ${back.join(', ')}은(는) 사실 오물거리 진료소에 누워 있었다. 크게 다친 채로 상단에 돌아왔으니 신전에서 치료해 주자.`);
    body.push(`지금까지 공략한 던전에 맞춰 상단은 ${RANKS[S.rank].name}랭크 「${RANKS[S.rank].title}」(으)로 시작한다.`);
    S.modals.push({ title: 'v0.5 업데이트', body });
  }
}

// v0.6 → v0.7: 2차·3차 전직, Lv100, 보스 장비·룬·유물, 왕국 교역, 레이드, 배속 1·5·10·20
function migrate5() {
  if (S.v >= 5) return;
  S.v = 5;
  if (!speedList().includes(S.speed)) S.speed = S.speed > 1 ? 5 : 1;
  S.relics = TIER_FIELDS.filter(f => S.fields[f] && S.fields[f].cleared);
  S.king = { favor: {}, visit: null, next: today() + 2 };
  S.raid = null;
  S.advs.concat(S.cands || []).forEach(a => {
    if (!CLASSES[a.cls]) a.cls = 'warrior';
    a.skills = (a.skills || []).filter(id => SKILLS[id] && canLearn(a, id));
    const inn = CLASSES[a.cls].innate;
    if (!a.skills.includes(inn)) a.skills.unshift(inn);
    a.skills = a.skills.slice(0, skillSlots(a));
    if (a.post && !isHealer(a.cls)) a.post = null;
    SLOTS.forEach(([sl]) => { const g = a.eq && a.eq[sl]; if (g) g.runes = g.runes || []; });
  });
  S.gear.forEach(g => { g.runes = g.runes || []; });
  S.flags.job2 = S.fame >= JOB_FAME[2] ? 1 : 0; S.flags.job3 = S.fame >= JOB_FAME[3] ? 1 : 0;
  S.unlocked = [];
  raidMonth(true);
  if (!S.flags.v07) {
    S.flags.v07 = 1;
    const body = STORY.v07.slice();
    if (S.relics.length) body.push(`지금까지 공략한 던전에서 유물 ${S.relics.length}개(${S.relics.map(f => RELICS[f].name).join(', ')})를 찾아 상단에 모셔 두었다.`);
    S.modals.push({ title: 'v0.7 업데이트', body });
  }
}

/* ───────── 선술집 손님 (고용 후보) ───────── */
function giftPool() {
  const out = [];
  TIER_FIELDS.filter(isUnlocked).forEach(fid => FIELDS[fid].mons.forEach(mid => MONS[mid].drops.forEach(([it]) => { if (!out.includes(it)) out.push(it); })));
  return out;
}
function makeCand() {
  const top = Math.max(1, Math.min(55, 1 + Math.floor(S.fame / 10) + (spn('guild') >= 2 ? 2 : 0)));
  let lv = ri(Math.max(1, top - 4), top), cond = null;
  const r = rnd();
  if (r < 0.25) { cond = { type: 'gift', item: pickOne(giftPool()), qty: ri(1, 3) }; lv += 1; }
  else if (r < 0.35) { cond = { type: 'fame', min: S.fame + ri(5, 15) }; lv += 2; }
  const a = makeAdv({ lv });   // 봉급(길드 후원 3단계 −10% 포함)은 salaryCalc (빌드 69)
  a.fee = a.salary; a.cond = cond;
  if (rnd() < 0.35) { const t = Math.max(0, GTIERS.reduce((m, T, i) => (a.lv >= T.lv ? i : m), 0) - 1); a.eq.weapon = gearFor(weaponOf(a.cls, t), t, 0, a.lv); if (twoHand(a.eq.weapon)) a.eq.off = null; }
  const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp;
  return a;
}
function rollCands() {
  S.cands = [];
  const n = 3 + (spn('guild') >= 3 ? 1 : 0);
  for (let i = 0; i < n; i++) S.cands.push(makeCand());
  if (!living().length) {
    const a = makeAdv({ cls: pickOne(['warrior', 'archer', 'cleric']), lv: 1, bio: '모험가 길드가 보낸 견습생. 계약금 없이 일하겠다고 한다.' });
    a.fee = 0; a.salK = 0.5; salaryNew(a); starterGear(a); S.cands.unshift(a);   // 견습생은 봉급 절반 (빌드 69: 예전엔 60G로 고정)
  }
}
function hire(id) {
  const c = S.cands.find(x => x.id === id);
  if (!c) return '이미 떠난 손님이에요.';
  if (living().length >= beds()) return '여관에 빈 방이 없어요. 여관을 넓혀 주세요.';
  if (c.cond && c.cond.type === 'gift' && (S.inv[c.cond.item] || 0) < c.cond.qty) return `${ITEMS[c.cond.item].name} ${c.cond.qty}개를 선물해야 해요.`;
  if (c.cond && c.cond.type === 'fame' && S.fame < c.cond.min) return `명성이 ${c.cond.min} 이상이어야 해요.`;
  if (S.gold < c.fee) return '계약금이 모자라요.';
  if (c.cond && c.cond.type === 'gift') addTo(S.inv, c.cond.item, -c.cond.qty);
  S.gold -= c.fee;
  S.cands = S.cands.filter(x => x !== c);
  const a = Object.assign({}, c);
  delete a.fee; delete a.cond; delete a.heroOf; delete a.specOf;
  a.status = 'idle';
  S.advs.push(a);
  log(`${a.name}(${CLASSES[a.cls].name}, Lv${a.lv})을(를) 고용했다.`, 'good');
  changed();
  return '';
}
function fire(id) {
  const a = advById(id);
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 내보낼 수 있어요.';
  if (a.inj) return '다친 모험가를 내보낼 수는 없어요. 다 나을 때까지 돌봐 주세요.';
  leave(a, '상단을 떠났다.');
  changed();
  return '';
}

/* ───────── 파티 ───────── */
function createParty() {
  if (regularParties().length >= partyMax()) return partyMax() >= PARTY_MAX[PARTY_MAX.length - 1] ? `파티는 ${partyMax()}개까지예요.` : `지금 상단 랭크에서는 파티를 ${partyMax()}개까지 만들 수 있어요.`;
  let n = 1;
  while (S.parties.some(p => p.name === `${n}팀`)) n++;
  const p = newParty(`${n}팀`, []);
  p.sup = { pot_s: 2 };
  S.parties.push(p);
  changed();
  return p;
}
function deleteParty(pid) {
  const p = S.parties.find(x => x.id === pid);
  if (!p || p.exp || p.raidOnly) return;   // 레이드대는 지우지 않는다
  S.parties = S.parties.filter(x => x !== p);
  if (S.view === pid) S.view = S.parties[0] ? S.parties[0].id : null;
  changed();
}
function toggleMember(pid, aid) {
  const p = S.parties.find(x => x.id === pid), a = advById(aid);
  if (!p || !a || p.exp || a.status !== 'idle') return;
  if (!p.members.includes(aid) && a.post) { HOOKS.toast(`${a.name}은(는) 신전에서 일하는 중이에요`); return; }
  if (!p.members.includes(aid) && isPorter(a) && portersOf(p).length >= 1) { HOOKS.toast('짐꾼 계열은 파티당 한 명만 넣을 수 있어요'); return; }
  if (!p.members.includes(aid) && !isPorter(a) && fightersOf(p).length >= fighterCap(p)) { HOOKS.toast(`${p.raidOnly ? '레이드대는' : '파티는'} 짐꾼 계열을 빼고 ${fighterCap(p)}명까지예요`); return; }
  if (p.members.includes(aid)) p.members = p.members.filter(x => x !== aid);
  else { const o = partyOf(aid); if (o) { if (o.exp) return; o.members = o.members.filter(x => x !== aid); } p.members.push(aid); }
  changed();
}
function setSup(pid, it, d) {
  const p = S.parties.find(x => x.id === pid);
  if (!p || p.exp) return;
  p.sup[it] = Math.max(0, Math.min(30, (p.sup[it] || 0) + d));
  if (!p.sup[it]) delete p.sup[it];
  changed();
}

/* ───────── 장비 ───────── */
function equip(aid, gid) {
  const a = advById(aid), i = S.gear.findIndex(g => g.id === gid);
  if (!a || i < 0) return '장비를 찾을 수 없어요.';
  if (a.status !== 'idle') return '원정 중에는 장비를 바꿀 수 없어요.';
  const g = S.gear[i];
  if (!gearFits(a, g) || (GTYPES[g.base].slot === 'ammo' && !needsArrows(a))) return `${a.name}은(는) 이 장비를 쓸 수 없어요.`;
  const slot = GTYPES[g.base].slot;
  if (slot === 'off' && twoHand(a.eq.weapon)) return `${jo(GTYPES[a.eq.weapon.base].name, '은', '는')} 두 손으로 들어서 부장비를 함께 낄 수 없어요.`;   // 빌드 64
  if (slot === 'weapon' && twoHand(g) && a.eq.off && a.eq.weapon && !roomGear()) return WH_FULL;   // 두 손 무기: 무기와 부장비가 함께 창고로
  S.gear.splice(i, 1);
  if (a.eq[slot]) S.gear.push(a.eq[slot]);
  a.eq[slot] = g; if (isAmmo(g)) g.n = null;   // 상단에서 끼우면 가득
  if (slot === 'weapon') dropOffFor(a);
  clampVitals(a); changed();
  return '';
}
function unequip(aid, slot) {
  const a = advById(aid);
  if (!a || !a.eq[slot]) return '';
  if (a.status !== 'idle') return '원정 중에는 장비를 바꿀 수 없어요.';
  if (!roomGear()) return WH_FULL;   // 빌드 63: 창고가 가득 차면 못 뺀다
  S.gear.push(a.eq[slot]); a.eq[slot] = null;
  clampVitals(a); changed();
  return '';
}
const gearScore = g => (g ? g.t * 10 + (LADDER_B[g.base] && g.lv ? ladderIdx(g) * 0.1 : 0) + g.q * 3.5 : -1);   // 빌드 67: 같은 단계의 중갑 · 판금은 착용 레벨이 높은 쪽
/* 빌드 64: 장비 강화(+1~+10)는 없앴다. 옛 저장의 강화 단계는 migrate12가 지우고, 성공한 단계만큼 재료 · 돈을 돌려준다 (예전 값 표 PLUS_NEED_OF · PLUS_FEE_OF) */
const PLUS_NEED_OF = (n, t) => (n <= 3 ? { ['crest_' + t]: 2 } : n <= 6 ? { ['core_' + t]: 1 } : n <= 9 ? { ['soul_' + t]: 1 } : { ['soul_' + t]: 2 });   // +n으로 올릴 때 든 재료
const PLUS_FEE_OF = (n, t) => Math.round(recipeFee(t) * n * 1.2 / 10) * 10;   // +n으로 올릴 때 든 돈 (유물 할인 없이)
function gearsAll() {   // 창고 + 끼고 있는 장비 (owner 표시)
  const out = S.gear.map(g => ({ g, owner: null }));
  S.advs.forEach(a => SLOTS.forEach(([sl]) => { if (a.eq[sl]) out.push({ g: a.eq[sl], owner: a }); }));
  return out;
}
const gearAnyById = id => { const r = gearsAll().find(x => x.g.id === id); return r || null; };
// 옵션 재감정 (마탑): 희귀 이상 장비의 보너스 능력치를 다시 뽑는다. 돈 + 그 단계 증표
function reappraiseWhy(g) {
  if (!g) return '그 장비가 없어요';
  if (!S.bld.tower) return '마탑이 필요해요';
  if ((g.q || 0) < 2) return '희귀 등급부터 보너스 능력치가 있어요';
  const owner = (gearAnyById(g.id) || {}).owner; if (owner && owner.status !== 'idle') return `${owner.name}이(가) 원정에서 돌아온 뒤에`;
  const crest = 'crest_' + g.t;
  if (ITEMS[crest] && (S.inv[crest] || 0) < REAPPRAISE.crest) return `${ITEMS[crest].name} ${REAPPRAISE.crest}개가 필요해요`;
  if (S.gold < REAPPRAISE.fee(g.t)) return `${fmt(REAPPRAISE.fee(g.t))}G가 필요해요`;
  return '';
}
function reappraise(id) {
  const r = gearAnyById(id); if (!r) return '그 장비가 없어요.';
  const g = r.g, why = reappraiseWhy(g); if (why) return why + '.';
  const crest = 'crest_' + g.t; if (ITEMS[crest]) addTo(S.inv, crest, -REAPPRAISE.crest);
  S.gold -= REAPPRAISE.fee(g.t); S.stats.spent = (S.stats.spent || 0) + REAPPRAISE.fee(g.t);
  const before = statLine(g.bonus || {});
  g.bonus = rollBonus(g.t, g.q);
  if (r.owner) clampVitals(r.owner);
  log(`마탑에서 「${gearName(g)}」의 옵션을 다시 감정했다: ${before || '없음'} → ${statLine(g.bonus || {})}`, 'good');
  changed();
  return '';
}
// 대장간: 화살·표창은 재료 없이 돈으로도 산다 (대장간이 만들 수 있는 단계까지)
function buyAmmoWhy(base, t, lv = 0) {
  if (!GTYPES[base] || !GTYPES[base].ammo) return '화살 · 암기 · 볼트만 살 수 있어요';
  if (!GTIERS[t] || !smithTierOk(base, t, lv)) return '그 단계에는 없는 장비예요';   // 빌드 65: 볼트는 늪지 단계부터 · 빌드 67: 볼트는 착용 레벨마다(사막왕 칩 = Lv50)
  if (!S.bld.smithy) return '대장간이 필요해요';
  if (!GTIERS[t] || S.bld.smithy < GTIERS[t].smith) return `대장간 Lv${GTIERS[t] ? GTIERS[t].smith : '?'}부터`;
  if (!roomGear()) return '메인 창고에 빈 칸이 없어요';
  if (S.gold < ammoPrice(base, t, lv)) return `${fmt(ammoPrice(base, t, lv))}G가 필요해요`;
  return '';
}
function buyAmmo(base, t, lv = 0) {
  const why = buyAmmoWhy(base, t, lv); if (why) return why + '.';
  const fee = ammoPrice(base, t, lv), g = makeGear(base, t, 0, lv);
  S.gold -= fee; S.stats.spent = (S.stats.spent || 0) + fee; S.gear.push(g);
  log(`대장간에서 ${gearName(g)}(${fmt(ammoMax(g))}${ammoUnit(g)})을(를) ${fmt(fee)}G에 샀다.`, 'good');
  changed();
  return '';
}
function autoEquip(aid) {
  const a = advById(aid);
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 장비를 바꿀 수 있어요.';
  let n = 0;
  for (const [slot] of SLOTS) {
    const sc = g => gearScore(g) + mastGearBonus(a, g);   // 숙련한 무기·갑옷을 조금 더 쳐준다
    if (slot === 'ammo' && !needsArrows(a)) continue;   // 화살 칸은 활을 쏘는 직업만
    if (slot === 'off' && twoHand(a.eq.weapon)) continue;   // 빌드 64: 두 손 무기(대검)를 들면 부장비 칸은 비운다
    const best = S.gear.filter(g => GTYPES[g.base].slot === slot && gearFits(a, g) && !GTYPES[g.base].el).sort((x, y) => sc(y) - sc(x))[0];   // 속성 화살은 출발할 때 고른다
    if (best && sc(best) > (a.eq[slot] ? sc(a.eq[slot]) : -1)) { equip(aid, best.id); n++; }
  }
  return n ? '' : '더 좋은 장비가 없어요.';
}
function sellGear(gid) {
  const i = S.gear.findIndex(g => g.id === gid);
  if (i < 0) return;
  const g = S.gear[i], price = Math.round(gearValue(g) * GEAR_SELL);
  S.gear.splice(i, 1); S.gold += price; S.stats.earned += price; S.stats.soldG = (S.stats.soldG || 0) + price;
  HOOKS.toast(`${gearName(g)}을(를) ${g$(price)}에 팔았다`);
  changed();
}
// 대장간: 일반 제작은 품질이 무작위, 영웅 이상은 보스 부속품을 넣어 그 등급을 반드시 만든다
const smithFee = (t, q = 0) => Math.round(recipeFee(t) * (spn('dwarves') >= 1 ? 0.7 : 1) * (1 - relic('smith')) * (q >= 3 ? BOSS_RECIPE[q].fee : 1));
const smithNeed = (base, t, q = 0) => (q >= 3 ? bossNeed(base, t, q) : recipeNeed(base, t));
const smithLv = (t, q = 0) => Math.max(GTIERS[t].smith, q >= 3 ? BOSS_RECIPE[q].smith : 0);
const smithTierOk = (base, t, lv) => (LADDER_B[base] ? ladderSteps(t).includes(lv) : tierOk(base, t));   // 빌드 67: 2차 직업 방어구는 그 단계 칩의 착용 레벨마다 (사막왕 = Lv50 — 막 전직한 기사 · 광전사 · 마검사용)
const canSmith = (base, t, q = 0, lv = 0) => smithTierOk(base, t, lv) && S.bld.smithy >= smithLv(t, q) && Object.entries(smithNeed(base, t, q)).every(([k, n]) => (S.inv[k] || 0) >= n) && S.gold >= smithFee(t, q) && roomGear(1, freedBy(smithNeed(base, t, q)));
function smith(base, t, q = 0, lv = 0) {
  if (!GTYPES[base] || !smithTierOk(base, t, lv)) return `${GTIERS[t] ? GTIERS[t].name : '그'} 단계에는 없는 장비예요.`;   // 빌드 64: 2차 직업 장비는 늪지 단계부터
  if (S.bld.smithy < smithLv(t, q)) return `대장간 Lv${smithLv(t, q)}이 있어야 해요.`;
  if (!roomGear(1, freedBy(smithNeed(base, t, q)))) return WH_FULL;
  if (!canSmith(base, t, q, lv)) return '재료나 돈이 모자라요.';
  Object.entries(smithNeed(base, t, q)).forEach(([k, n]) => addTo(S.inv, k, -n));
  S.gold -= smithFee(t, q);
  const g = makeGear(base, t, q >= 3 ? q : rollQuality(0.03 * S.bld.smithy + (relic('smith') ? 0.05 : 0)), lv);
  S.gear.push(g);
  log(`대장간에서 ${QUALITY[g.q].name} 「${gearName(g)}」을(를) 만들었다.`, g.q ? 'good' : '');
  changed();
  return g;
}

/* ───────── 룬: 장비 등급마다 한 칸씩 열린 룬 칸에 끼운다 ───────── */
function findGear(gid) {
  const g = S.gear.find(x => x.id === gid);
  if (g) return { g, a: null };
  for (const a of S.advs) for (const [sl] of SLOTS) if (a.eq[sl] && a.eq[sl].id === gid) return { g: a.eq[sl], a };
  return null;
}
const RUNE_OUT = [100, 400, 1500, 6000];   // 룬을 빼는 값 (빼낸 룬은 창고로 · 빌드 64: 최상급)
function runeIn(gid, rid) {
  const f = findGear(gid);
  if (!f) return '장비를 찾을 수 없어요.';
  if (f.a && f.a.status !== 'idle') return '원정 중인 모험가의 장비예요.';
  const g = f.g; g.runes = g.runes || [];
  if (!runeSlots(g)) return '화살 · 표창에는 룬 칸이 없어요.';
  if (g.runes.length >= runeSlots(g)) return '룬 칸이 꽉 찼어요.';
  if (!ITEMS[rid] || !ITEMS[rid].rune || !(S.inv[rid] > 0)) return '그 룬이 없어요.';
  addTo(S.inv, rid, -1); g.runes.push(rid);
  if (f.a) clampVitals(f.a);
  log(`${gearName(g)}에 ${ITEMS[rid].name}을(를) 끼웠다.`);
  changed();
  return '';
}
function runeOut(gid, i) {
  const f = findGear(gid);
  if (!f || !f.g.runes || !f.g.runes[i]) return '';
  if (f.a && f.a.status !== 'idle') return '원정 중인 모험가의 장비예요.';
  const rid = f.g.runes[i], fee = RUNE_OUT[ITEMS[rid].rune[1]];
  if (S.gold < fee) return `룬을 빼려면 ${g$(fee)}이 들어요.`;
  if (!roomItem(rid)) return WH_FULL;
  S.gold -= fee; f.g.runes.splice(i, 1); addTo(S.inv, rid, 1);
  if (f.a) clampVitals(f.a);
  changed();
  return '';
}
// 빌드 69 마석: 영웅 이상 장비의 마석 칸(영웅 1 · 전설 2 · 신화부터 3칸)에 끼운다 — 같은 마석을 여럿 껴도 되지만 효과는 모험가마다 여섯 개 몫까지 (data-maseok69.js)
function msIn(gid, iid) {
  const f = findGear(gid);
  if (!f) return '장비를 찾을 수 없어요.';
  if (f.a && f.a.status !== 'idle') return '원정 중인 모험가의 장비예요.';
  const g = f.g; g.ms = g.ms || [];
  if (!msSlots(g)) return '마석 칸은 영웅 장비부터 열려요 (영웅 1 · 전설 2 · 신화부터 3칸).';
  if (g.ms.length >= msSlots(g)) return '마석 칸이 꽉 찼어요.';
  if (!ITEMS[iid] || !ITEMS[iid].maseok || !(S.inv[iid] > 0)) return '그 마석이 없어요.';
  addTo(S.inv, iid, -1); g.ms.push(iid);
  if (f.a) clampVitals(f.a);
  log(`${gearName(g)}에 마석 「${ITEMS[iid].name}」을(를) 끼웠다.`);
  changed();
  return '';
}
function msOut(gid, i) {
  const f = findGear(gid);
  if (!f || !f.g.ms || !f.g.ms[i]) return '';
  if (f.a && f.a.status !== 'idle') return '원정 중인 모험가의 장비예요.';
  const iid = f.g.ms[i];
  if (S.gold < MASEOK_OUT) return `마석을 빼려면 ${g$(MASEOK_OUT)}이 들어요.`;
  if (!roomItem(iid)) return WH_FULL;
  S.gold -= MASEOK_OUT; f.g.ms.splice(i, 1); addTo(S.inv, iid, 1);
  if (f.a) clampVitals(f.a);
  changed();
  return '';
}
// 마탑: 우두머리의 증표 둘로 하급 룬 새기기 (룬 합성은 빌드 67부터 9칸 — store.js rfDo)
function runeCarve(t) {
  if (!S.bld.tower) return '마탑이 필요해요.';
  const k = 'crest_' + t;
  if ((S.inv[k] || 0) < RUNE_CARVE.crest) return `${ITEMS[k].name} ${RUNE_CARVE.crest}개가 필요해요.`;
  if (S.gold < RUNE_CARVE.fee) return '돈이 모자라요.';
  if (!roomGear(1, (S.inv[k] || 0) === RUNE_CARVE.crest ? 1 : 0)) return WH_FULL;   // 무작위 룬이라 빈 칸 하나를 둔다
  S.gold -= RUNE_CARVE.fee; addTo(S.inv, k, -RUNE_CARVE.crest);
  const out = runeId(pickOne(RUNE_IDS), 0); addTo(S.inv, out, 1);
  log(`마탑에서 ${ITEMS[k].name}에 ${ITEMS[out].name}을(를) 새겼다.`, 'good');
  changed();
  return out;
}

/* ───────── 스킬과 훈련 ───────── */
const learnFee = s => (s.own ? ownFee(s) : s.lv * 30);   // 수업료: 고유 스킬은 예전 고유 수련비, 그 밖은 Lv × 30
function learnSkill(aid, sid) {
  const a = advById(aid), s = SKILLS[sid];
  if (!S.bld.training) return '훈련소가 있어야 스킬을 배울 수 있어요.';
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 배울 수 있어요.';
  if (a.skills.includes(sid)) return '이미 배운 스킬이에요.';
  if (s.tier && jobTier(a.cls) < s.tier) return `${s.name}은(는) ${s.tier}차 전직 후에 배울 수 있어요.`;
  if (!canLearn(a, sid)) return `${s.name}은(는) ${skJobTxt(sid)} · Lv${s.lv} 이상만 배울 수 있어요.`;   // 빌드 68: 계열 · 직업 글
  if (a.skills.length >= skillSlots(a)) { const nx = SKILL_SLOT_LV.find(l => a.lv < l); return `스킬 칸 ${skillSlots(a)}개가 꽉 찼어요. 하나를 잊거나${nx ? ` Lv${nx}에 칸이 늘어나면` : ''} 배울 수 있어요.`; }
  if (skillNeedsBook(sid) && !((S.inv['book_' + sid] || 0) > 0)) return `스킬북 「${s.name}」이 없어요.${s.own ? ' 2차 · 3차 고유 스킬도 이제 스킬북으로 배워요 (빛바랜 · 신비한 스킬북).' : ''}`;   // 빌드 63
  const fee = learnFee(s);
  if (S.gold < fee) return '수업료가 모자라요.';
  if (skillNeedsBook(sid)) addTo(S.inv, 'book_' + sid, -1);
  S.gold -= fee;
  a.skills.push(sid); clampVitals(a);
  log(`${a.name}이(가) 스킬 「${s.name}」을(를) 배웠다. (${skTag(sid)})`, 'good');
  changed();
  return '';
}
// 스킬 레벨 올리기: 책이 있는 스킬은 같은 책 한 권 + 돈, 고유·기본·각성 스킬은 돈만. 훈련소에서
function skillUpWhy(a, id) {
  const s = SKILLS[id]; if (!a || !s) return '';
  if (!S.bld.training) return '훈련소가 필요해요';
  if (!a.skills.includes(id)) return '배운 스킬만';
  if (a.status !== 'idle') return '상단에 있을 때만';
  const lv = skLv(a, id);
  if (lv >= SK_LV_MAX) return `최고 단계(Lv${SK_LV_MAX})예요`;
  if (skillNeedsBook(id) && !((S.inv['book_' + id] || 0) > 0)) return `스킬북 「${s.name}」이 한 권 더 필요해요`;
  if (S.gold < skillUpCost(id, lv + 1)) return `${fmt(skillUpCost(id, lv + 1))}G가 필요해요`;
  return '';
}
function skillUp(aid, id) {
  const a = advById(aid), why = skillUpWhy(a, id);
  if (!a) return '';
  if (why) return why + '.';
  const lv = skLv(a, id) + 1;
  if (skillNeedsBook(id)) addTo(S.inv, 'book_' + id, -1);
  S.gold -= skillUpCost(id, lv);
  a.sl = a.sl || {}; a.sl[id] = lv;
  log(`${a.name}의 「${SKILLS[id].name}」이(가) Lv${lv}이 됐다. (위력 +${Math.round(SK_LV_POW * (lv - 1) * 100)}% · 재사용 -${Math.round(SK_LV_CD * (lv - 1) * 100)}%)`, 'good');
  clampVitals(a); changed();
  return '';
}
// 자동 사용 끄기 · 우선 사용
function skillToggle(aid, id, what) {
  const a = advById(aid); if (!a || !a.skills.includes(id)) return '';
  const key = what === 'pri' ? 'skpri' : 'skoff';
  a[key] = a[key] || {};
  if (a[key][id]) delete a[key][id]; else a[key][id] = 1;
  if (what === 'pri' && a.skpri[id] && a.skoff) delete a.skoff[id];
  if (what === 'off' && a.skoff[id] && a.skpri) delete a.skpri[id];
  changed();
  return '';
}
function forgetSkill(aid, sid) {
  const a = advById(aid);
  if (!a || sid === CLASSES[a.cls].innate) return;
  a.skills = a.skills.filter(x => x !== sid);
  if (a.sl) delete a.sl[sid]; if (a.skoff) delete a.skoff[sid]; if (a.skpri) delete a.skpri[sid];
  clampVitals(a); changed();
}
/* ───────── 숙련 (초급 → 중급 → 상급): 훈련소에서 한 단계씩, 스킬 칸과 따로 ───────── */
function mastWhy(a, k) {
  const M = MASTERY[k]; if (!a || !M) return '없는 숙련이에요';
  if (!canMast(a, k)) return `${CLASSES[a.cls].name} 계열은 배울 수 없어요`;
  const t = mastTier(a, k); if (t >= MAST_MAX) return `${MAST_TIERS[MAST_MAX - 1].name}까지 다 배웠어요`;
  const T = MAST_TIERS[t];
  if (!S.bld.training) return '훈련소가 필요해요';
  if (a.lv < T.lv) return `${T.name}은 Lv${T.lv}부터`;
  if (jobTier(a.cls) < T.job) return `${T.name}은 ${T.job}차 전직 뒤에`;
  if (a.status !== 'idle') return '상단에 있을 때만';
  if (S.gold < T.fee) return `${fmt(T.fee)}G가 필요해요`;
  return '';
}
function learnMast(aid, k) {
  const a = advById(aid); if (!a) return '';
  const why = mastWhy(a, k); if (why) return why + '.';
  const t = mastTier(a, k) + 1, T = MAST_TIERS[t - 1];
  S.gold -= T.fee; S.stats.spent = (S.stats.spent || 0) + T.fee;
  a.mast = a.mast || {}; a.mast[k] = t;
  clampVitals(a);
  log(`${a.name}이(가) 훈련소에서 「${mastName(k, t)}」을(를) 익혔다. (${mastFxText(MASTERY[k].fx[t - 1])}${MASTERY[k].w ? ' · ' + mastCond(k) : ''})`, 'good');
  changed();
  return '';
}
const trainedTotal = a => Object.values(a.tr).reduce((s, v) => s + v, 0);
const trainCap = a => a.lv * 2;
const trainCost = a => Math.round((60 + 30 * trainedTotal(a)) * (1 + a.lv / 20) * (1 - Math.max(0, (S.bld.training || 1) - 1) * 0.12) / 5) * 5;
function trainStat(aid, k) {
  const a = advById(aid);
  if (!S.bld.training) return '훈련소가 필요해요.';
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 훈련할 수 있어요.';
  if (a.inj) return '다친 몸으로는 훈련할 수 없어요.';
  if (trainedTotal(a) >= trainCap(a)) return `지금 레벨에서는 ${trainCap(a)}번까지 훈련할 수 있어요. 레벨을 올리세요.`;
  if (S.gold < trainCost(a)) return '훈련비가 모자라요.';
  S.gold -= trainCost(a); a.tr[k]++;
  changed();
  return '';
}

/* ───────── 신전 ───────── */
function blessRoll() {
  if (!S.bld.temple) return;
  const last = S.bless && S.bless.id;
  const id = pickOne(BLESS_IDS.filter(k => k !== last));
  S.bless = { id, from: today() };
  S.advs.forEach(clampVitals);
  log(`신전에서 이번 달 「${BLESSINGS[id].name}」을(를) 내려 주었다. ${BLESSINGS[id].desc}`, 'good');
}
// 다친 모험가: 신전(없으면 여관 방)에서 시간이 지나면 낫고, 처치·치유사·수술로 앞당긴다
const patients = () => S.advs.filter(a => a.inj);
const healers = () => S.advs.filter(a => a.post === 'temple');
const healerSlots = () => Math.min(4, S.bld.temple || 0);
const healRate = () => (S.bld.temple ? 4 + 4 * S.bld.temple : 3) * (spn('clinic') >= 2 ? 1.5 : 1) * (1 + relic('rest'));   // 하루 자연 치료
const healPow = h => (2 + h.lv * 0.4 + derive(h).T.int * 0.15) * careMul(h.cls);
const injLeft = a => (a.inj ? Math.max(0, a.inj.need - a.inj.done) : 0);
const treatedToday = a => !!(a.inj && a.inj.day === today());
const canOp = () => !!S.bld.temple && healers().some(h => SURGEONS.includes(h.cls));
const opCost = a => Math.round(injLeft(a) * SURGERY.gold);
function healPlan() {   // 치유사가 누구를 돌보는지 (한 명이 환자 둘까지, 심한 환자부터)
  const pats = patients().sort((x, y) => injLeft(y) - injLeft(x)), plan = new Map();
  if (!S.bld.temple) return plan;
  let i = 0;
  for (const h of healers()) { const pw = healPow(h); for (let j = 0; j < 2 && i < pats.length; j++, i++) plan.set(pats[i].id, (plan.get(pats[i].id) || 0) + pw); }
  return plan;
}
const dayHeal = (a, plan) => healRate() + ((plan || healPlan()).get(a.id) || 0);
function postHealer(aid, on) {
  const a = advById(aid);
  if (!a) return '';
  if (!on) { if (a.post) { a.post = null; log(`${a.name}이(가) 신전 일을 마쳤다.`); changed(); } return ''; }
  if (!S.bld.temple) return '신전이 있어야 해요.';
  if (!isHealer(a.cls)) return '성직자 계열과 성기사만 신전에서 환자를 돌볼 수 있어요.';
  if (a.status !== 'idle') return '원정 중이에요.';
  if (a.inj) return '다친 모험가는 일할 수 없어요.';
  if (healers().length >= healerSlots()) return `치유사 자리는 ${healerSlots()}명까지예요. 신전을 넓혀 주세요.`;
  const p = partyOf(a.id);
  if (p) { if (p.exp) return '원정 중인 파티에 있어요.'; p.members = p.members.filter(x => x !== a.id); }
  a.post = 'temple';
  log(`${a.name}이(가) 신전에서 환자를 돌보기 시작했다.`);
  changed();
  return '';
}
function medPick(rem) {
  const ks = Object.keys(S.inv).filter(k => S.inv[k] > 0 && ITEMS[k] && ITEMS[k].med && !ITEMS[k].herb).sort((x, y) => ITEMS[x].med - ITEMS[y].med);
  return ks.find(k => ITEMS[k].med * MED_MUL >= rem) || ks[ks.length - 1] || null;
}
function potPick(rem) {
  const ks = Object.keys(POT_TREAT).filter(k => (S.inv[k] || 0) > 0);
  return ks.find(k => POT_TREAT[k] >= rem) || ks[ks.length - 1] || null;
}
function recover(a, by) {
  a.inj = null;
  a.hp = Math.max(a.hp, derive(a).maxHp * 0.6);
  log(`${a.name}이(가) ${by ? by + ' 덕분에 ' : ''}다 나았다.`, 'good');
  HOOKS.toast(`${a.name} 회복 · 다시 원정에 나갈 수 있어요`);
}
function healInj(a, pts, by) { a.inj.done += pts; if (a.inj.done >= a.inj.need) recover(a, by); }
function treat(aid, kind) {
  const a = advById(aid);
  if (!a || !a.inj) return '';
  const rem = injLeft(a);
  if (kind === 'op') {
    if (!canOp()) return '신전에 역병의사나 명의가 있어야 수술할 수 있어요.';
    if (a.inj.op) return '이미 수술을 받았어요.';
    const c = opCost(a);
    if (S.gold < c) return '수술비가 모자라요.';
    S.gold -= c; a.inj.op = 1;
    log(`역병의사가 ${a.name}을(를) 수술했다. (${g$(c)})`);
    healInj(a, Math.ceil(rem * SURGERY.pct), '수술');
    changed();
    return '';
  }
  if (treatedToday(a)) return '오늘은 이미 처치를 받았어요. 내일 다시 할 수 있어요.';
  let k = null, pts = 0;
  if (kind === 'herb') { if ((S.inv.herb || 0) < HERB_USE) return `히포크리초가 ${HERB_USE}개 필요해요.`; k = 'herb'; pts = HERB_PTS; addTo(S.inv, 'herb', -HERB_USE); }
  else if (kind === 'med') { if (!S.bld.temple) return '약재 처방은 신전에서만 할 수 있어요.'; k = medPick(rem); if (!k) return '쓸 수 있는 약재가 없어요.'; pts = ITEMS[k].med * MED_MUL; addTo(S.inv, k, -1); }
  else if (kind === 'pot') { k = potPick(rem); if (!k) return '회복 물약이 없어요.'; pts = POT_TREAT[k]; addTo(S.inv, k, -1); }
  else return '';
  a.inj.day = today();
  healInj(a, pts, ITEMS[k].name);
  changed();
  return '';
}
const treatPreview = a => {   // 버튼에 보여 줄 처치 효과
  const rem = injLeft(a), m = medPick(rem), pt = potPick(rem);
  return { herb: HERB_PTS, med: m ? { k: m, v: ITEMS[m].med * MED_MUL } : null, pot: pt ? { k: pt, v: POT_TREAT[pt] } : null };
};
// 하루 단위가 아니라 조금씩 낫는다 (자리를 비운 동안에도)
function stepCare(dt) {
  const pats = patients().filter(a => a.status === 'idle');
  if (!pats.length) return;
  const plan = healPlan(), k = dt / DAY_SEC;
  for (const a of pats) {
    if (S.autoTreat && !treatedToday(a) && (S.inv.herb || 0) >= HERB_USE) { a.inj.day = today(); addTo(S.inv, 'herb', -HERB_USE); healInj(a, HERB_PTS, '히포크리초'); if (!a.inj) continue; }
    healInj(a, dayHeal(a, plan) * k, '');
  }
  if (!S.bld.temple) return;
  for (const h of healers()) {
    const n = pats.filter(a => plan.has(a.id)).length;
    if (n && addExp(h, h.lv * 0.12 * Math.min(2, n) * dt)) log(`${h.name}이(가) 환자를 돌보며 Lv${h.lv}이 되었다.`, 'good');
  }
}

/* ───────── 마차 몸체 (말은 마구간 world30.js) ───────── */
const wagonOpen = w => (!WAGONS[w].need || spn(WAGONS[w].need) >= WAGONS[w].tier) && (!WAGONS[w].bld || (S.bld[WAGONS[w].bld] || 0) > 0);
const wagonOpenWhy = w => (WAGONS[w].need && spn(WAGONS[w].need) < WAGONS[w].tier ? '드워프 광산 조합 후원 2단계가 필요해요' : WAGONS[w].bld && !(S.bld[WAGONS[w].bld] || 0) ? `${BUILDINGS[WAGONS[w].bld].name}이(가) 있어야 만들어요` : '');
// 마차 되팔기: 몸값의 절반 + 강화에 든 돈의 절반
const wagonBack = p => (p.wagon && WAGONS[p.wagon] ? Math.round(WAGONS[p.wagon].cost * 0.5) + Math.round(Array.from({ length: p.wagonPlus || 0 }, (_, i) => wagonPlusCost(p.wagon, i).gold).reduce((a, b) => a + b, 0) * 0.5) : 0);
function buyWagon(pid, w, sl) {
  const p = S.parties.find(x => x.id === pid), W = WAGONS[w];
  if (!p || !W) return '';
  if (p.exp) return '원정 중에는 마차를 바꿀 수 없어요.';
  if (!wagonOpen(w)) return wagonOpenWhy(w) + '.';
  const RF = RIG_F(sl), q = rigAt(p, sl);   // 빌드 65: sl 2 = 둘째 마차 (캐러밴 마스터 · 말이 끄는 마차만)
  if (sl === 2 && !caravanOf(p)) return '둘째 마차는 캐러밴 마스터가 있는 파티만 끌어요.';
  if (sl === 2 && !W.horse) return '둘째 마차는 말이 끄는 마차로 골라요.';
  if (q.wagon === w) return '이미 이 마차를 쓰고 있어요.';
  const back = wagonBack(q);
  if (S.gold + back < W.cost) return '돈이 모자라요.';
  S.gold += back - W.cost; S.stats.spent = (S.stats.spent || 0) + W.cost;
  log(`${p.name}에게 ${sl === 2 ? '둘째 마차로 ' : ''}${W.name}을(를) 마련했다.${back ? ` 쓰던 ${rigName(q)}은(는) ${g$(back)}에 넘겼다.` : ''}`, 'good');
  p[RF.w] = w; p[RF.n] = 0;
  if (!W.horse && p[RF.h]) unhitch(p, sl);
  changed();
  return '';
}

/* ───────── 판매·구매·제작 ───────── */
const guildRate = () => GUILD_RATE + (spn('guild') >= 1 ? 0.1 : 0) + 0.02 * (S.rank || 0);
// 자동 판매: 표시해 둔 부속품은 원정대가 돌아올 때 남길 수만 남기고 길드에 판다
function autoSellRun(who) {
  const A = S.autoSell || {}; let total = 0, n = 0;
  for (const k in A) { if (!ITEMS[k] || A[k] == null) continue; const q = (S.inv[k] || 0) - A[k]; if (q > 0) { const g = Math.round(ITEMS[k].v * guildRate() * q); addTo(S.inv, k, -q); S.gold += g; S.stats.earned += g; S.stats.soldG = (S.stats.soldG || 0) + g; total += g; n += q; } }
  if (n) { log(`자동 판매: 부속품 ${n}개를 모험가 길드에 ${g$(total)}에 팔았다.`); S.stats.autoG = (S.stats.autoG || 0) + total; }
}
function sellGuild(it, q) {
  q = Math.min(q, S.inv[it] || 0);
  if (q <= 0) return;
  const g = Math.round(ITEMS[it].v * guildRate() * q);
  addTo(S.inv, it, -q); S.gold += g; S.stats.earned += g; S.stats.soldG = (S.stats.soldG || 0) + g;
  HOOKS.toast(`${ITEMS[it].name} ${q}개를 ${g$(g)}에 팔았다`);
  changed();
}
const slotCount = () => shopStands(S.bld.shop) + rankStands(S.rank || 0);
const isGearKey = k => typeof k === 'string' && k.startsWith('g:');
function gearsOfKey(k) { const [, b, t] = k.split(':'); return S.gear.filter(g => g.base === b && g.t === +t).sort((x, y) => x.q - y.q); }
const stockOf = k => (isGearKey(k) ? gearsOfKey(k).length : S.inv[k] || 0);
function slotPrice(s) { return (isGearKey(s.item) ? (gearsOfKey(s.item)[0] ? gearValue(gearsOfKey(s.item)[0]) : 0) * TIERS[s.tier].m : ITEMS[s.item].v * TIERS[s.tier].m) * (1 + relic('price') + Math.max(0, S.bld.shop - 5) * 0.02 + (S.salePlus || 0)); }   // 상인 길드 인장
function setSlot(i, it, tier) {
  while (S.shop.slots.length < slotCount()) S.shop.slots.push(null);
  S.shop.slots[i] = it ? { item: it, tier: tier || 0, tm: 0 } : null;
  changed();
}
const traffic = () => (1 + S.fame / 150) * (1 + 0.1 * (S.bld.shop - 1)) * (1 + (spn('citizens') >= 1 ? 0.15 : 0) + (spn('citizens') >= 3 ? 0.15 : 0)) * (S.flags.guildDown ? 1.2 : 1) * (1 + 0.08 * (S.rank || 0)) * (1 + petHome('traffic')) * (cityDamaged() ? 0.7 : 1);
function stepShop(dt) {
  const n = slotCount(), tr = traffic();
  for (let i = 0; i < n; i++) {
    const s = S.shop.slots[i];
    if (!s || !(stockOf(s.item) > 0)) continue;
    s.tm += dt;
    const iv = TIERS[s.tier].iv / tr;
    if (s.tm < iv) continue;
    s.tm -= iv;
    const g = Math.round(slotPrice(s));
    if (isGearKey(s.item)) { const it = gearsOfKey(s.item)[0]; S.gear = S.gear.filter(x => x !== it); }
    else addTo(S.inv, s.item, -1);
    S.gold += g; S.stats.earned += g; S.stats.sales++; S.stats.soldG = (S.stats.soldG || 0) + g;
    HOOKS.sale(i, g);
    if (S.sold.day !== today()) S.sold = { day: today(), n: 0, g: 0 };
    S.sold.n++; S.sold.g += g;
    S.salesM = (S.salesM || 0) + g;   // 빌드 69: 이달 상점(진열대) 판매액 — 자릿세 3%
  }
}
const buyPrice = it => Math.round(ITEMS[it].buy * (spn('clinic') >= 1 ? 0.8 : 1));
function buy(it, q) {
  const cost = buyPrice(it) * q;
  if (S.gold < cost) return '돈이 모자라요.';
  if (!roomItem(it)) return WH_FULL;
  S.gold -= cost; addTo(S.inv, it, q);
  changed();
  return '';
}
const craftFee = r => Math.round(r.fee * (1 - Math.max(0, S.bld.alchemy - 2) * 0.1));
const canCraft = r => S.bld.alchemy >= r.lv && Object.entries(r.need).every(([k, q]) => (S.inv[k] || 0) >= q) && S.gold >= craftFee(r) && roomItem(r.out, freedBy(r.need));
function craft(i) {
  const r = RECIPES[i];
  if (S.bld.alchemy < r.lv) return r.lv > 1 ? '연금술 공방을 넓혀야 해요.' : '연금술 공방이 필요해요.';
  if (!roomItem(r.out, freedBy(r.need))) return WH_FULL;
  if (!canCraft(r)) return '재료나 돈이 모자라요.';
  Object.entries(r.need).forEach(([k, q]) => addTo(S.inv, k, -q));
  S.gold -= craftFee(r); addTo(S.inv, r.out, 1);
  if (rnd() < Math.max(0, S.bld.alchemy - 2) * 0.15 + petHome('craft')) { addTo(S.inv, r.out, 1); HOOKS.toast(`${ITEMS[r.out].name}이(가) 하나 더 나왔다!`); }   // 넓은 공방의 덤
  changed();
  return '';
}
function upgrade(bid) {
  const B = BUILDINGS[bid], lv = S.bld[bid];
  if (lv >= B.max) return '더 올릴 수 없어요.';
  if (!lv && (S.rank || 0) < (BUILD_RANK[bid] || 0)) return `상단이 ${RANKS[BUILD_RANK[bid]].name}랭크가 되어야 지을 수 있어요.`;
  if (bid === 'farm' && lv && (S.rank || 0) < FARM.rank[lv]) return `상단이 ${RANKS[FARM.rank[lv]].name}랭크가 되어야 재배소 ${lv + 1}동을 지을 수 있어요.`;
  const cost = B.cost[lv];
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; S.bld[bid] = lv + 1;
  if (bid === 'temple' && lv === 0) { blessRoll(); queueModal({ title: '신전', body: STORY.temple.concat([`이번 달에는 「${BLESSINGS[S.bless.id].name}」: ${BLESSINGS[S.bless.id].desc}`]) }); }
  if (bid === 'airfield' && lv === 0) queueModal({ title: '비행장', body: S.fields.roots && S.fields.roots.cleared ? STORY.skyOpen : STORY.airfield });
  if (bid === 'stable' && lv === 0) queueModal({ title: '마구간', body: STORY.stable });
  if (bid === 'library' && lv === 0) queueModal({ title: '도서관', body: STORY.library });
  if (bid === 'kitchen' && lv === 0) queueModal({ title: '주방', body: STORY.kitchen });
  if (bid === 'salvage' && lv === 0) queueModal({ title: '던전 수거소', body: STORY.salvage });
  if (bid === 'farm') { farmState(); if (lv === 0) queueModal({ title: '재배소', body: STORY.farm }); }
  log(bid === 'farm' ? `재배소 ${lv + 1}동(비닐하우스)을 지었다.` : `${B.name}을(를) ${lv ? 'Lv' + (lv + 1) + '로 넓혔다' : '지었다'}.`, 'good');
  changed();
  return '';
}

/* ───────── 의뢰 ───────── */
function maxGearTier() { let m = 0; GTIERS.forEach((T, i) => { if (S.bld.smithy >= T.smith && isUnlocked(TIER_FIELDS[i])) m = i; }); return m; }
function genReq() {
  if (S.reqs.length >= 4) return;
  const special = (Object.values(S.spons).some(v => v >= 2) && rnd() < 0.25) || (spn('citizens') >= 3 && rnd() < 0.15);
  const client = special ? pickOne(SPECIAL_CLIENTS) : pickOne(CLIENTS);
  const mult = (special ? 2.3 : 1) * (1 + 0.06 * (S.rank || 0));
  if (S.bld.smithy && rnd() < 0.3) {
    const t = ri(0, maxGearTier()), base = dropBase(t), v = gearValue({ base, t, q: 0 });
    S.reqs.push({ id: nid(), client, gear: `${base}:${t}`, qty: 1, reward: Math.round(v * (1.8 + rnd() * 0.5) * mult / 5) * 5, fame: Math.round((2 + t) * (special ? 3 : 1)), due: today() + ri(5, 9), special });
    return;
  }
  const pool = giftPool();
  if (rnd() < 0.15) pool.push('pot_s');
  const it = pickOne(pool), v = ITEMS[it].v;
  const qty = Math.max(1, Math.round(ri(2, 6) * (v > 30 ? 0.5 : 1) * (special ? 1.5 : 1)));
  S.reqs.push({ id: nid(), client, item: it, qty, reward: Math.round(v * qty * (1.7 + rnd() * 0.6) * mult / 5) * 5,
    fame: Math.round(Math.min(6, 1 + Math.floor(v * qty / 70)) * (special ? 3 : 1)), due: today() + ri(4, 7), special });
}
const reqHave = r => (r.gear ? gearsOfKey('g:' + r.gear).length : S.inv[r.item] || 0);
const reqName = r => (r.gear ? gearNameOf(r.gear.split(':')[0], r.gear.split(':')[1]) : ITEMS[r.item].name);
// 장비 의뢰에 내줄 것: 가장 싼 것부터 (등급 낮고, 룬 없는 것)
const reqGearPick = r => gearsOfKey('g:' + r.gear).slice().sort((a, b) => ((a.q || 0) - (b.q || 0)) || ((a.runes || []).length - (b.runes || []).length))[0];
const reqGearCheap = g => !!g && (g.q || 0) <= 1 && !(g.runes || []).length;
function fulfill(id, auto) {
  const r = S.reqs.find(x => x.id === id);
  if (!r) return '';
  if (reqHave(r) < r.qty) return `${reqName(r)}이(가) 모자라요.`;
  if (r.gear) { const it = reqGearPick(r); if (auto && !reqGearCheap(it)) return '좋은 장비뿐이라 자동으로는 내주지 않아요.'; S.gear = S.gear.filter(x => x !== it); }
  else addTo(S.inv, r.item, -r.qty);
  S.gold += r.reward; S.fame += r.fame; S.stats.earned += r.reward; S.stats.reqs = (S.stats.reqs || 0) + 1;
  S.reqs = S.reqs.filter(x => x !== r);
  log(`${auto ? '창고에 있던 의뢰품을 저절로 전달해 ' : ''}${r.client}의 의뢰를 끝냈다. ${g$(r.reward)}, 명성 +${r.fame}`, 'good');
  HOOKS.toast(`의뢰 완료 · ${g$(r.reward)} · 명성 +${r.fame}`);
  changed();
  return '';
}
// 자동 전달: 창고에 의뢰품이 다 있으면 저절로 전달한다 (장비는 일반·고급의 미강화품만). 원정대가 돌아올 때·날이 바뀔 때
const autoReqOn = () => !S || S.autoReq !== false;
function autoFulfill() {
  if (!S || !autoReqOn()) return 0;
  let n = 0;
  for (const r of S.reqs.slice()) if (reqHave(r) >= r.qty && !fulfill(r.id, true)) n++;
  return n;
}

/* ───────── 상단 랭크 ───────── */
const partyMax = () => PARTY_MAX[Math.min(S.rank || 0, PARTY_MAX.length - 1)];
function rankReqs(r = S.rank || 0) {
  const R = RANK_UP[r];
  if (!R) return null;
  const fs = S.fields[R.dungeon], licN = S.advs.filter(a => (a.rank || 0) >= R.lic[0]).length;
  return [
    { label: `${FIELDS[R.dungeon].dungeon.name} 공략`, ok: !!fs.cleared, cur: fs.cleared ? 1 : 0, need: 1, flag: 1 },
    { label: '상단 명성', ok: S.fame >= R.fame, cur: S.fame, need: R.fame },
    { label: '끝낸 의뢰', ok: (S.stats.reqs || 0) >= R.reqs, cur: S.stats.reqs || 0, need: R.reqs },
    { label: '누적 판매액', ok: (S.stats.soldG || 0) >= R.sold, cur: S.stats.soldG || 0, need: R.sold, gold: 1 },
    { label: '소속 모험가', ok: living().length >= R.advs, cur: living().length, need: R.advs },
    { label: `${LICENSE[R.lic[0]].name} 이상 모험가`, ok: licN >= R.lic[1], cur: licN, need: R.lic[1] }
  ];
}
const rankReady = () => { const q = rankReqs(); return !!q && q.every(x => x.ok); };
function rankUp() {
  if (!rankReady()) return '아직 랭크업 조건을 다 채우지 못했어요.';
  S.rank = (S.rank || 0) + 1;
  const R = RANKS[S.rank], fame = 5 * S.rank;
  S.fame += fame;
  log(`${S.company}이(가) ${R.name}랭크 「${R.title}」(으)로 올라섰다! 명성 +${fame}`, 'good');
  queueModal({ title: `상단 랭크 ${R.name}`, body: [`상인 조합 심사를 통과했다. 이제 ${S.company}은(는) ${R.name}랭크 「${R.title}」이다. 명성 +${fame}`].concat(rankGifts(S.rank).map(g => '· ' + g)) });
  changed();
  return '';
}

/* ───────── 모험가 라이선스 ───────── */
const licNext = a => LICENSE_UP[a.rank || 0] || null;
function licenseUp(aid) {
  const a = advById(aid), L = a && licNext(a);
  if (!a || !L) return '';
  if (a.status !== 'idle') return '상단에 있을 때만 심사를 받을 수 있어요.';
  const miss = licReqs(a).find(r => !r.ok);
  if (miss) return `${miss.label} ${miss.need} 이상이어야 해요. (지금 ${miss.cur})`;
  if (S.gold < L.fee) return '심사비가 모자라요.';
  S.gold -= L.fee;
  a.rank = (a.rank || 0) + 1;
  salaryNew(a);   // 라이선스마다 ×1.2 (빌드 69: salaryCalc가 다시 셈한다)
  const N = LICENSE[a.rank];
  if (a.rank >= LICENSE.length - 1) {
    S.fame += 15;
    log(`${a.name}이(가) 백금 라이선스를 받았다! 상단 명성 +15`, 'good');
    HOOKS.toast(`${a.name} · 백금 라이선스`);
  } else {
    log(`${a.name}이(가) 모험가 길드 심사를 통과해 ${N.name} 라이선스를 받았다.`, 'good');
    HOOKS.toast(`${a.name} · ${N.name} 라이선스`);
  }
  changed();
  return '';
}

/* ───────── 전직 ───────── */
const jobOpen = () => true;   // 전직은 명성으로 열리지 않는다. 직업마다 조건(레벨·라이선스·돈·추가 조건)만 본다
function checkUnlocks() { S.flags.job2 = 1; S.flags.job3 = 1; }   // 빌드 69: S랭크 레이드대는 없앴다
function promoWhy(a, cls) {
  const t = jobTier(cls), Q = JOB_REQ[t];
  const R = CLASSES[cls].req || {};
  if (!S.bld.training) return '훈련소가 필요해요';
  if (a.lv < Math.max(Q.lv, R.lv || 0)) return `Lv${Math.max(Q.lv, R.lv || 0)}부터`;
  const rw = jobReqWhy(a, cls); if (rw) return rw;
  if ((a.rank || 0) < Q.rank) return `${LICENSE[Q.rank].name} 라이선스 필요`;
  if (a.status !== 'idle' || a.inj) return '상단에서 쉬고 있을 때만';
  if (S.gold < Q.fee) return '돈이 모자라요';
  if (Q.souls && soulCount() < Q.souls) return `주인의 혼 ${Q.souls}개 필요 (지금 ${soulCount()})`;   // 빌드 64: 3차 전직
  if (Q.item && (S.inv[Q.item[0]] || 0) < Q.item[1]) return `${ITEMS[Q.item[0]].name} ${Q.item[1]}개 필요`;   // 빌드 65: 4차 전직 (별의 정원 주인의 핵)
  const mv = promoMoves(a, cls); if (mv > whFree(-1)) return `메인 창고에 빈 칸이 ${mv}개 있어야 해요 (새 직업에 안 맞는 장비를 넣을 자리)`;
  return '';
}
// 전직하면 창고로 빠지는 장비 수 (안 맞는 장비 · 활을 안 쏘게 되면 화살)
function promoMoves(a, cls) { const b = Object.assign({}, a, { cls }); return SLOTS.filter(([sl]) => { const g = a.eq[sl]; return g && (!gearFits(b, g) || (sl === 'ammo' && !needsArrows(b))); }).length; }
function useStone(aid, tid) {
  const a = advById(aid);
  if (!a) return '';
  if ((S.inv.wizstone || 0) < 1) return '마법사의 돌이 없어요.';
  if (!(a.traits || []).includes(tid)) return '그 특성이 없어요.';
  if (isJobTrait(tid)) return '직업 특성은 바꿀 수 없어요.';
  const r = rerollTrait(a, tid);
  if (!r) return '바꿀 수 없어요.';
  addTo(S.inv, 'wizstone', -1);
  log(`마법사의 돌: ${a.name}의 「${TRAITS[r[0]].name}」이(가) 「${TRAITS[r[1]].name}」(으)로 바뀌었다.`, 'good');
  queueModal({ title: '마법사의 돌', adv: a.id, body: [`돌이 빛나며 ${a.name}의 특성이 바뀌었다.`, `「${TRAITS[r[0]].name}」 → 「${TRAITS[r[1]].name}」 (${TRAITS[r[1]].desc})`] });
  changed();
  return '';
}
// 개화석: 타고난 특성이 3개가 안 되는 모험가에게 새 특성 하나
function useBloom(aid) {
  const a = advById(aid);
  if (!a) return '';
  if ((S.inv.bloomstone || 0) < 1) return '개화석이 없어요.';
  if (!canBloom(a)) return `타고난 특성이 이미 ${TRAIT_MAX}개예요.`;
  const nt = bloomTrait(a);
  if (!nt) return '피울 수 있는 특성이 없어요.';
  addTo(S.inv, 'bloomstone', -1);
  log(`개화석: ${a.name}에게 「${TRAITS[nt].name}」 특성이 피어났다.`, 'good');
  queueModal({ title: '개화석', adv: a.id, body: [`개화석이 녹아들며 ${a.name}의 숨어 있던 재능이 피어났다.`, `새 특성 「${TRAITS[nt].name}」 (${TRAITS[nt].desc}) · 타고난 특성 ${innateTraits(a).length}/${TRAIT_MAX}`] });
  changed();
  return '';
}
function promote(aid, cls) {
  const a = advById(aid);
  if (!a || !nextJobs(a.cls).includes(cls)) return '';
  const why = promoWhy(a, cls);
  if (why) return why + '.';
  const C0 = CLASSES[a.cls], C1 = CLASSES[cls], wasT = a.eq.weapon ? a.eq.weapon.t : 0, Q = JOB_REQ[jobTier(cls)];
  S.gold -= Q.fee;
  if (Q.souls) useSouls(Q.souls);   // 빌드 64: 3차 전직에 주인의 혼
  if (Q.item) addTo(S.inv, Q.item[0], -Q.item[1]);   // 빌드 65: 4차 전직 재료
  if (C1.req && C1.req.item) addTo(S.inv, C1.req.item[0], -C1.req.item[1]);   // 전직 재료(피눈물 등)
  let wolf = null;
  if (C1.req && C1.req.petWolf) { wolf = wolfMount(C1.req.petWolf); if (wolf) { S.pets = S.pets.filter(x => x !== wolf); a.ride = Object.assign(a.ride || {}, { wolf: { look: 'A', name: wolf.name, lv: wolf.lv } }); } }   // 빌드 65: 랑기수 = 늑대 펫을 탈것으로 데려간다 (pxride65.js — 모습 A가 기본)
  if (C1.req && C1.req.petWyv) { const wy = wyvMount(C1.req.petWyv); if (wy) { S.pets = S.pets.filter(x => x !== wy); a.ride = Object.assign(a.ride || {}, { wyv: { look: 'A', name: wy.name, lv: wy.lv } }); log(`${a.name}이(가) 와이번 펫 「${wy.name}」을(를) 타고 용기수가 되었다.`, 'good'); } }   // 빌드 65 넷째 묶음
  STAT_KEYS.forEach(k => { a.st[k] += Math.max(0, C1.base[k] - C0.base[k]) + 1; });
  a.cls = cls;
  rideEnsure(a);   // 빌드 65: 용기수가 되면 와이번 (모습 A)
  const jt = jobTraitOf(cls); if (jt) { a.traits = (a.traits || []).filter(t => !(TRAITS[t] && TRAITS[t].job && jobTier(TRAITS[t].job) === jobTier(cls))); a.traits.push(jt); }   // 직업 특성
  a.skills = [C1.innate, ...a.skills.filter(id => id !== C1.innate)].slice(0, skillSlots(a));
  if (a.post && !isHealer(cls)) a.post = null;
  SLOTS.forEach(([sl]) => { const g = a.eq[sl]; if (g && !gearFits(a, g)) { S.gear.push(g); a.eq[sl] = null; } });
  if (needsArrows(a) && !a.eq.ammo) { a.eq.ammo = makeGear('arrows', arrowTierOf(a.lv), 0); log(`${a.name}이(가) 활을 쏘게 되어 화살을 받았다.`); }
  if (!needsArrows(a) && a.eq.ammo) { S.gear.push(a.eq.ammo); a.eq.ammo = null; }   // 창을 드는 용기병처럼 활을 안 쏘면 화살은 창고로   // 정찰가처럼 새로 활을 쏘는 직업
  if (!a.eq.weapon) a.eq.weapon = gearFor(weaponOf(cls, wasT), wasT, 0, a.lv);   // 길드가 새 직업에 맞는 무기를 준다 (빌드 67: 2차 직업 무기는 낄 수 있는 착용 레벨로)
  dropOffFor(a);   // 빌드 64: 두 손 무기(대검)를 들면 부장비는 창고로
  offGift65(a, wasT);   // 빌드 65: 쌍검사 = 보조 단검 · 닌자 = 암기 (부장비 칸이 비어 있으면)
  salaryNew(a);   // 전직마다 ×1.3 (빌드 69: salaryCalc가 다시 셈한다)
  clampVitals(a);
  log(`${a.name}이(가) ${C0.name}에서 ${C1.name}(으)로 전직했다!`, 'good');
  if (wolf) log(`${a.name}이(가) 늑대 「${wolf.name}」(Lv${wolf.lv})을(를) 타고 길을 나선다. 늑대는 이제 ${a.name}의 탈것이다.`, 'good');
  queueModal({ title: `${jobTier(cls)}차 전직 · ${C1.name}`, adv: a.id, body: [`${a.name}이(가) 훈련소에서 ${C1.name}(으)로 다시 태어났다.`, C1.desc, `기본 스킬 「${SKILLS[C1.innate].name}」을(를) 익혔고, 배워 둔 스킬은 그대로 남았다. 새 직업에 맞지 않는 장비는 창고로 옮겼다.`].concat(wolf ? [`늑대 펫 「${wolf.name}」(Lv${wolf.lv})이(가) ${a.name}의 탈것이 되었다 — 사육장에서는 떠난다.`] : []).concat(jt ? [`직업 특성 「${TRAITS[jt].name}」(${TRAITS[jt].desc})이 생겼다. 직업 특성은 마법사의 돌로 바꿀 수 없다.`] : []) });
  changed();
  return '';
}

/* ───────── 이웃 왕국의 상단 ───────── */
const kingOpen = k => { const n = KINGDOMS[k].need; return !n || isUnlocked(n) || ((S.fields[n] && S.fields[n].best) || 0) > 0; };
const favorOf = k => (S.king && S.king.favor[k]) || 0;
const kingArriveFor = (id, days) => kingArrive(id, days);
function kingArrive(forId, days) {
  const open = KINGDOM_IDS.filter(kingOpen);
  if (!open.length) return;
  const id = forId || pickOne(open), D = KINGDOMS[id], fv = favorTier(favorOf(id));
  const known = new Set(giftPool());
  let wants = D.wants.filter(it => ITEMS[it] && (known.has(it) || (S.inv[it] || 0) > 0));
  if (wants.length < 2) wants = D.wants.filter(it => ITEMS[it] && !ITEMS[it].raid).slice(0, 3);
  const pick = wants.sort(() => rnd() - 0.5).slice(0, 3);
  const order = pick.map(it => ({ it, n: Math.max(1, Math.round(Math.min(40, Math.max(2, 700 / ITEMS[it].v)) * (1 + fv * 0.2))), got: 0 }));
  S.king.visit = { k: id, until: today() + (days || 3), order, m: FAVOR[fv].m, earned: 0, goods: kingGoods(D).map(o => Object.assign(o, { price: Math.round(o.price * festBuyMul(id)) })) };
  log(`${D.name}의 상단이 오물거리를 찾아왔다. 사흘 동안 물건을 사 간다.`, 'good');
  HOOKS.toast(`${D.name} 상단 방문 · 상단 창의 교역에서 팔 수 있어요`);
  queueModal({ title: `${D.name} 상단 방문`, body: [D.desc, `이번에 사 가려는 것: ${order.map(o => `${ITEMS[o.it].name} ${o.n}개`).join(', ')}. 기준가의 ${Math.round(FAVOR[fv].m * 100)}%를 쳐준다.`, '사흘 안에 상단 창의 「왕국 교역」에서 팔 수 있다. 주문을 다 채우면 왕국과 더 가까워진다.'] });
  changed();
}
function kingSell(it) {
  const v = S.king && S.king.visit, o = v && v.order.find(x => x.it === it);
  if (!o) return '';
  const q = Math.min(o.n - o.got, S.inv[it] || 0);
  if (q <= 0) return o.got >= o.n ? '이미 다 채웠어요.' : `${ITEMS[it].name}이(가) 창고에 없어요.`;
  const g = Math.round(ITEMS[it].v * v.m * festSellMul(v.k)) * q;
  addTo(S.inv, it, -q); o.got += q; v.earned += g;
  S.gold += g; S.stats.earned += g; S.stats.soldG = (S.stats.soldG || 0) + g;
  S.king.favor[v.k] = favorOf(v.k) + g / 500;
  HOOKS.toast(`${KINGDOMS[v.k].name}에 ${ITEMS[it].name} ${q}개 · ${g$(g)}`);
  if (v.order.every(x => x.got >= x.n) && !v.full) {
    v.full = 1; S.king.favor[v.k] += 8; S.fame += 3;
    log(`${KINGDOMS[v.k].name}의 주문을 모두 채웠다. 왕국과 가까워졌다. 명성 +3`, 'good');
  }
  changed();
  return '';
}
function kingLeave() {
  const v = S.king.visit;
  if (!v) return;
  const D = KINGDOMS[v.k];
  log(v.earned ? `${D.name} 상단이 ${g$(v.earned)}어치를 사서 돌아갔다.` : `${D.name} 상단이 빈손으로 돌아갔다.`, v.earned ? 'good' : '');
  if (!v.earned) S.king.favor[v.k] = Math.max(0, favorOf(v.k) - 3);
  S.king.visit = null;
  S.king.next = today() + ri(4, 7);
}
function kingDay(k) {
  if (!S.king) S.king = { favor: {}, visit: null, next: k + 2 };
  if (S.king.visit && k > S.king.visit.until) kingLeave();
  if (!S.king.visit && k >= S.king.next) kingArrive();
}

/* ───────── 초대형 레이드: 매달 둘이 열린다 ───────── */
function newRaid(id) {
  const R = RAIDS[id], max = raidMaxHp(id);   // 빌드 69: Lv150+ 레이드는 따로 정한 HP (data-raid69.js)
  const rv = RIVALS.slice().sort(() => rnd() - 0.5).slice(0, 5).map(r => ({ n: r.name, c: r.c, pw: 0.5 + rnd() * 0.9, d: 0 }));
  return { id, max, hp: max, me: 0, rivals: rv, done: 0, rank: 0 };
}
function raidMonth(fresh) {
  if (S.raid) for (const rec of S.raid.list) if (!rec.done) raidEnd(rec, 'escape');
  const a = pickOne(['kingslime', 'kaishar', 'griffon']), b = pickOne(RAID_IDS.filter(x => x !== a));
  S.raid = { list: [newRaid(a), newRaid(b)], from: today() };
  const names = S.raid.list.map(r => `${RAIDS[r.id].name}(Lv${RAIDS[r.id].lv})`).join('와(과) ');
  log(`이번 달 레이드: ${names}`, 'good');
  if (!fresh) queueModal({ title: '이번 달 레이드', body: [`${names} 레이드가 열렸다.`, '다른 상단과 왕국 원정대가 함께 몬스터를 두드린다. 쓰러뜨리면 피해를 많이 준 순서대로 보상을 받고, 달이 바뀔 때까지 못 쓰러뜨리면 몬스터가 떠나 보상이 절반이 된다.', `원정대 창의 「레이드」 탭에서 전투원 ${PARTY_FIGHTERS}명이 다 찬 파티 ${RAID_MIN_PARTIES}개 이상을 골라 함께 보내자.`] });   // 빌드 69
}
const raidStand = rec => rec.rivals.map(r => ({ n: r.n, d: r.d, c: r.c })).concat([{ n: S.company, d: rec.me, me: 1 }]).sort((x, y) => y.d - x.d);
const raidTier = L => GTIERS.reduce((m, T, i) => (T.lv <= L ? i : m), 0);
function raidReward(rec, i, half) {
  const R = RAIDS[rec.id], W = RAID_REWARD[Math.min(i, RAID_REWARD.length - 1)], k = half ? 0.5 : 1, got = [];
  const gold = Math.round(raidGold(R.lv) * W.gold * k / 10) * 10, fame = Math.round(W.fame * k);
  S.gold += gold; S.stats.earned += gold; S.fame += fame;
  got.push(g$(gold), `명성 +${fame}`);
  const np = Math.max(1, Math.round(W.part * k)); stashItem('rp_' + rec.id, np); got.push(`${ITEMS['rp_' + rec.id].name} ${np}개`);   // 보상: 넘치면 창고 1~10 → 길드 (store.js)
  if (W.heart && !half) { stashItem('rh_' + rec.id, W.heart); got.push(ITEMS['rh_' + rec.id].name); }
  if (W.gear) { const t = raidTier(R.lv), q = Math.max(Math.max(2, W.gear - (half ? 1 : 0)), rollGrade(t, 'raid')), g = makeGear(dropBase(t), t, q); stashGear(g); got.push(`${QUALITY[q].name} ${gearName(g)}`); }   // 1등 영웅 · 2등 희귀 + 아주 드물게 그 위 (빌드 63 다섯째 묶음)
  const rl = W.rune - (half ? 1 : 0);
  if (rl >= 0) { const id = runeId(pickOne(RUNE_IDS), rl); stashItem(id, 1); got.push(ITEMS[id].name); }
  // 특성 돌: 개화석은 등수별 개수(몬스터가 떠나면 절반), 마법사의 돌은 등수별 낮은 확률
  const ri4 = Math.min(i, 3), bn = STONE_DROP.bloomstone.raidN[ri4], bq = half ? Math.floor(bn / 2) : bn;
  if (bq > 0) { stashItem('bloomstone', bq); got.push(`개화석 ${bq}개`); }
  if (rnd() < STONE_DROP.wizstone.raidP[ri4] * k) { stashItem('wizstone', 1); got.push('마법사의 돌'); }
  return `우리 상단 ${i + 1}위! 보상: ${got.join(', ')}`;
}
function raidEnd(rec, how) {
  if (rec.done) return;
  rec.done = how === 'kill' ? 1 : 2; rec.hp = Math.max(0, rec.hp);
  const R = RAIDS[rec.id], st = raidStand(rec), my = st.findIndex(x => x.me);
  rec.rank = rec.me > 0 ? my + 1 : 0;
  rec.final = st.map(x => ({ n: x.n, d: Math.round(x.d), me: x.me ? 1 : 0 }));
  const body = [how === 'kill' ? `${R.name}이(가) 쓰러졌다!` : `달이 바뀌자 ${R.name}이(가) 모습을 감췄다. 보상은 절반이다.`,
    '순위 · ' + st.slice(0, 6).map((x, i) => `${i + 1}. ${x.n} ${Math.round(x.d).toLocaleString('ko-KR')}`).join(' · ')];
  body.push(rec.me > 0 ? raidReward(rec, my, how !== 'kill') : '우리 상단은 이번 레이드에 나서지 않았다.');
  log(`${R.name} 레이드가 끝났다.${rec.rank ? ` 우리 상단 ${rec.rank}위.` : ''}`, rec.rank ? 'good' : '');
  queueModal({ title: `레이드 종료 · ${R.name}`, body });
  changed();
}
// 경쟁자들은 날마다 몬스터를 두드린다
function raidDay() {
  if (!S.raid) return;
  for (const rec of S.raid.list) {
    if (rec.done) continue;
    for (const r of rec.rivals) { const v = Math.round(rec.max * r.pw / 110 * (0.6 + rnd() * 0.8)); r.d += v; rec.hp -= v; }
    if (rec.hp <= 0) { rec.hp = 0; raidEnd(rec, 'kill'); }
  }
}

/* ───────── 마탑 ───────── */
const researchCost = k => { if (rlv(k) >= RESEARCH[k].max) return null; const c = RESEARCH[k].cost[rlv(k)]; return [Math.round(c[0] * (1 - Math.max(0, (S.bld.tower || 1) - 1) * 0.1)), c[1]]; };
function canResearch(k) {
  const c = researchCost(k);
  return !!(S.bld.tower && !S.research.cur && c && S.gold >= c[0] && Object.entries(c[1]).every(([i, q]) => (S.inv[i] || 0) >= q));
}
function startResearch(k) {
  if (!S.bld.tower) return '마탑이 필요해요.';
  if (S.research.cur) return '이미 연구 중이에요.';
  const c = researchCost(k);
  if (!c) return '더 연구할 수 없어요.';
  if (!canResearch(k)) return '돈이나 재료가 모자라요.';
  S.gold -= c[0];
  Object.entries(c[1]).forEach(([i, q]) => addTo(S.inv, i, -q));
  S.research.cur = { k, done: today() + Math.max(1, RESEARCH[k].days[rlv(k)] - Math.max(0, S.bld.tower - 1)) };
  log(`마탑에서 「${RESEARCH[k].name}」 연구를 시작했다. ${dayLabel(S.research.cur.done)}에 끝난다.`);
  changed();
  return '';
}
function researchDay(k) {
  const c = S.research.cur;
  if (!c || k < c.done) return;
  S.research.lv[c.k] = rlv(c.k) + 1;
  S.research.cur = null;
  log(`마탑 연구 「${RESEARCH[c.k].name}」 ${rlv(c.k)}단계를 마쳤다. ${RESEARCH[c.k].desc(rlv(c.k))}`, 'good');
  HOOKS.toast(`연구 완료 · ${RESEARCH[c.k].name}`);
}

/* ───────── 후원 ───────── */
const sponsorOpen = k => !SPONSORS[k].need || isUnlocked(SPONSORS[k].need);
function sponsor(k) {
  const P = SPONSORS[k], t = spn(k);
  if (t >= 3 || !sponsorOpen(k)) return '';
  if (S.gold < P.cost[t]) return '돈이 모자라요.';
  S.gold -= P.cost[t];
  S.spons[k] = t + 1;
  S.fame += P.fame[t];
  log(`${P.name}에 ${g$(P.cost[t])}을 후원했다. 명성 +${P.fame[t]} · ${P.perks[t]}`, 'good');
  changed();
  return '';
}

/* ───────── 월말 정산 ───────── */
// 빌드 69 (11-14 사용자 「이걸로」 — 계획 문서 남은 물음 1): 자릿세 = 300G + 명성 25마다 50G + 그달 상점(진열대) 판매액의 3%
const RENT_SALES = 0.03;
const rentBase = () => (S.flags.guildDown ? 0 : 300 + 50 * Math.floor(S.fame / 25));
const rentSales = () => (S.flags.guildDown ? 0 : Math.round((S.salesM || 0) * RENT_SALES));
const rent = () => rentBase() + rentSales();
const salaryOf = a => Math.round(salaryCalc(a) * (1 - mentorCut(a.cls)) / 5) * 5;   // 스승(명예의 전당) 할인 · 빌드 69: 지금 레벨로 셈한다 (data-sal69.js)
const payroll = () => living().reduce((s, a) => s + salaryOf(a), 0);
function settle() {
  const pm = dateParts(S.t - DAY_SEC).m, lines = [], r = rent();
  if (S.flags.guildDown) lines.push('암살자 길드가 무너져 이제 자릿세는 없다.');
  else if (S.gold >= r) { S.gold -= r; lines.push(`암살자 길드에 자릿세 ${g$(r)}을 냈다.${rentSales() ? ` (기본 ${g$(rentBase())} + 이달 상점 판매액 ${g$(S.salesM)}의 3% ${g$(rentSales())})` : ''}`); }
  else {
    const paid = S.gold; S.gold = 0;
    let lost = 0;
    for (const k of Object.keys(S.inv)) { const q = Math.ceil(S.inv[k] * 0.3); addTo(S.inv, k, -q); lost += q; }
    const g = S.gear.splice(0, Math.ceil(S.gear.length * 0.3)).length;
    S.fame = Math.max(0, S.fame - 3);
    lines.push(`자릿세 ${g$(r)} 중 ${g$(paid)}밖에 못 냈다. 두건 쓴 자들이 창고에서 물건 ${lost}개${g ? `와 장비 ${g}개` : ''}를 가져갔다. 명성 -3`);
  }
  let n = 0, sum = 0;
  const unpaid = [];
  for (const a of living()) { salaryNew(a); const pay = salaryOf(a); if (S.gold >= pay) { S.gold -= pay; n++; sum += pay; a.unpaid = 0; } else unpaid.push(a); }   // 빌드 69: 스승 할인도 실제로 깎는다
  if (n) lines.push(`모험가 ${n}명에게 봉급 ${g$(sum)}을 줬다.`);
  const gone = [], warned = [];
  unpaid.forEach(a => {
    a.unpaid = (a.unpaid || 0) + 1;
    if (a.unpaid < 2) { warned.push(a.name); return; }
    gone.push(a.name);
    if (a.status === 'idle') leave(a, '두 달째 봉급을 받지 못해 상단을 떠났다.'); else a.quit = true;
  });
  if (warned.length) lines.push(`${warned.join(', ')}에게 봉급을 주지 못했다. 다음 달에도 밀리면 떠난다.`);
  if (gone.length) lines.push(`두 달째 봉급을 못 받은 ${gone.join(', ')}은(는) 상단을 떠난다. 원정 중이면 돌아온 뒤에 떠난다.`);
  S.salesLast = S.salesM || 0; S.salesM = 0;   // 빌드 69: 상점 판매액은 달마다 새로 센다
  if (!S.flags.guildDown) lines.push(`다음 달 자릿세는 ${g$(rentBase())}에 그달 상점 판매액의 3%를 더한 값이다.`);
  if (S.bld.temple) { blessRoll(); lines.push(`신전: 이번 달에는 「${BLESSINGS[S.bless.id].name}」. ${BLESSINGS[S.bless.id].desc}`); }
  leagueMonth(lines);
  log(`${pm}월 정산을 마쳤다.`, unpaid.length ? 'bad' : '');
  queueModal({ title: `${pm}월 정산`, body: lines });
  raidMonth(false);
}

/* ───────── 시간 흐름 ───────── */
function onNewDay(k) {
  checkUnlocks();
  if (typeof achvTick === 'function') achvTick();
  S.ledger = (S.ledger || []).filter(x => x.day > k - 16); S.ledger.push({ day: k, gold: S.gold, earned: S.stats.earned || 0 });   // 수입 그래프용 하루 기록
  if (k % 2 === 0) rollCands();
  S.reqs = S.reqs.filter(r => { if (r.due < k) { log(`${r.client}의 의뢰가 기한을 넘겨 취소됐다.`); return false; } return true; });
  if (k % 2 === 1 || S.reqs.length < 2) genReq();
  const salv = salvageDay(k);   // 던전 수거소: 새벽에 수거꾼이 돌아온다 (의뢰 자동 전달보다 먼저)
  autoFulfill();
  if (salv) autoSellRun('수거소');
  researchDay(k);
  raidDay();
  kingDay(k);
  portDay(k);   // 빌드 65: 해상왕국 배 (항구)
  underTick();
  penDay(k);
  eventsDay(k);
  leagueDay();
  if (k >= S.settleDay) { settle(); seasonEnd(); S.settleDay += MONTH_DAYS; leagueState(); }
  if (!S.flags.guildDown && !S.flags.raidTold && raidReady()) { S.flags.raidTold = 1; queueModal({ title: '시민회의 부탁', body: STORY.guildReady }); }
  changed();
}
function autoDepart(p) {
  if (p.dest && FIELDS[p.dest] && FIELDS[p.dest].treasure && !isUnlocked(p.dest)) return;   // 보물 지도를 다 썼으면 다시 떠나지 않는다
  const team = p.members.map(advById).filter(Boolean);
  if (!team.length || team.some(a => a.status !== 'idle' || a.inj || a.post || (a.sleep || 0) > SLEEP.ready || a.hp < derive(a).maxHp * 0.85 || (a.fat || 0) > FATIGUE.depart)) return;
  if (p.repeatLeft != null && p.repeatLeft <= 0) { p.repeat = false; p.repeatLeft = null; log(`${p.name}의 반복 출발이 정한 횟수를 다 채웠다.`); return; }
  if (!startExp(p, partyDest(p)) && p.repeatLeft != null) p.repeatLeft--;   // 빌드 69: 레이드는 목적지로 두지 않는다
}
function stepHome(dt) {
  const m = (spn('clinic') >= 2 ? 2 : 1) * (1 + relic('rest') + petHome('rest')), rest = SLEEP.rest(S.bld.inn) * (isNight() ? 1.6 : 0.8) * (1 + relic('rest') + petHome('rest')) * dt;
  for (const a of S.advs) {
    if (a.status !== 'idle') continue;
    const d = derive(a);
    if (a.hp < d.maxHp) a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.006 * m * dt);
    if (a.mp < d.maxMp) a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * dt);
    if (a.fat) a.fat = Math.max(0, a.fat - FATIGUE.home * dt);
    if (a.sleep) a.sleep = Math.max(0, a.sleep - rest);   // 여관 방에서 푹 잔다 (밤에 더 잘 잔다)
  }
  stepCare(dt);
}
function stepWorld(dt) {
  for (const p of S.parties) if (p.exp) stepExp(p, dt); else if (p.repeat) autoDepart(p);
  stepShop(dt);
  stepHome(dt);
}
// 게임을 켜 둔 동안: 날짜가 흐른다
function step(dt) {
  const d0 = today();
  S.t += dt;
  stepWorld(dt);
  checkUnlocks();
  underTick();
  const d1 = today();
  for (let k = d0 + 1; k <= d1; k++) onNewDay(k);
}
// 자리를 비운 동안: 원정과 판매만 진행되고 날짜는 그대로
const offlineCap = () => OFFLINE_CAP + rlv('time') * 3600;
function catchUp(sec) {
  sec = Math.min(sec, offlineCap());
  const b = { gold: S.gold, kills: S.stats.kills, downs: S.stats.downs || 0, sales: S.stats.sales, fame: S.fame, gear: S.gear.length };
  const toast = HOOKS.toast, ch = HOOKS.changed;
  HOOKS.toast = () => {}; HOOKS.changed = () => {};
  let left = sec;
  while (left > 0) { const dt = Math.min(0.5, left); stepWorld(dt); left -= dt; }
  HOOKS.toast = toast; HOOKS.changed = ch;
  return { sec, gold: S.gold - b.gold, kills: S.stats.kills - b.kills, downs: (S.stats.downs || 0) - b.downs, sales: S.stats.sales - b.sales, fame: S.fame - b.fame, gear: Math.max(0, S.gear.length - b.gear) };
}

/* ───────── 저장 ───────── */
const SAVE_KEY = 'paros-sangdan:v1';
const SAVE_V = 16;   // 지금 저장 판 (migrate16까지 옮긴 상태)
function saveGame() {
  if (!S) return;
  S.lastSeen = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (_) {}
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    return loadFrom(JSON.parse(raw));
  } catch (_) { return false; }
}
// 저장 객체를 지금 판으로 (옛 저장은 차례로 옮긴다)
function loadFrom(v) {
  try {
    if (!v || !Array.isArray(v.advs)) return false;
    if (v.v === 1) { migrate(v); runeRename(); cut69(); heal69(); raid69(); sal69(); slot69(); migrate3(); migrate4(); notes6(); migrate5(); migrateS(); notesB(); notes22(); notes23(); notes25(); notes28(); notes29(); migrate6(); notes30(); migrate7(); notes31(); notes34(); migrate8(); notes36(); notes37(); migrate9(); migrate10(); migrate11(); migrate12(); migrate13(); notes38(); notes39(); notes40(); notes41(); notes42(); notes43(); notes44(); notes45(); notes46(); notes48(); notes49(); notes50(); notes51(); notes52(); notes53(); notes55(); notes56(); notes57(); notes58(); notes59(); notes60(); notes61(); notes62(); notes63(); notes63b(); notes63c(); notes64(); refit65(); migrate14(); notes65(); migrate15(); lowJob66(); migrate16(); notes68(); notes67(); notes68b(); notes69(); notes69b(); notes69c(); notes69d(); notes69e(); saveGame(); return true; }
    if (typeof v.v !== 'number' || v.v < 2 || v.v > SAVE_V) return false;   // 판을 올릴 때는 SAVE_V만 올린다
    S = v;
    S.modals = S.modals || []; S.flags = S.flags || {}; S.gear = S.gear || []; S.stats = S.stats || {}; S.pets = S.pets || []; S.pen = S.pen || { inc: [] }; S.bld.pen = S.bld.pen || 0;
    S.research = S.research || { lv: {}, cur: null }; S.spons = S.spons || {};
    ALL_FIELDS.forEach(f => { S.fields[f] = S.fields[f] || newField(); });
    ['smithy', 'tower', 'temple', 'stable', 'library', 'airfield', 'kitchen', 'salvage', 'farm'].forEach(b => { S.bld[b] = S.bld[b] || 0; });
    S.stable = S.stable || { horses: {} };
    const old = S.v;
    if (old < 13) runeRename();   // 빌드 64 룬 개편: 옛 룬 이름 → 합친 룬 (창고 정리보다 먼저)
    if (old < 14) refit65();      // 빌드 65 직업 개편: 못 끼게 된 무기를 같은 단계 새 무기로 (migrateS의 unfitGear보다 먼저)
    if (old < 16) lowJob66();     // 빌드 66: 늪지대 아래 단계의 2차 직업 전용 장비 → 같은 단계 1차 장비 (migrateS의 unfitGear보다 먼저)
    cut69();                      // 빌드 69: 왕국 · 투기장 스킬 빼기 — 배운 모험가 · 스킬북 정리 (불러올 때마다, 남은 게 없으면 아무것도 안 함)
    heal69();                     // 빌드 69 회복 개편: 이제 못 배우는 응급 처치 · 치유의 찬가 · 재기를 지우고 스킬북 · 수업료를 돌려준다 (불러올 때마다)
    raid69();                     // 빌드 69 레이드 개편: 레이드대를 풀고(원정 중이면 돌아온 뒤) 레이드를 목적지로 둔 파티는 평원으로 (불러올 때마다)
    sal69();                      // 빌드 69: 봉급을 지금 레벨 · 차수 · 라이선스로 다시 매긴다 (불러올 때마다)
    slot69();                     // 빌드 69 장비 9칸: 룬은 3칸까지 — 넘친 룬(· 마석)을 빼서 창고로 (불러올 때마다, 넘친 게 없으면 아무것도 안 함)
    if (old < 4) { migrate3(); migrate4(); saveGame(); }
    S.unlocked = S.unlocked || []; S.rank = S.rank || 0;
    notes6();
    if (old < 5) { migrate5(); saveGame(); }
    S.relics = S.relics || []; S.king = S.king || { favor: {}, visit: null, next: today() + 2 };
    if (!S.raid) raidMonth(true);
    migrateS();
    notesB();
    notes22();
    notes23();
    notes25();
    notes28();
    notes29();
    if (old < 6) { migrate6(); saveGame(); }
    notes30();
    if (old < 7) { migrate7(); saveGame(); }
    notes31();
    notes34();
    if (old < 8) { migrate8(); saveGame(); }
    notes36();
    notes37();
    if (old < 9) { migrate9(); saveGame(); }
    notes38();
    if (old < 10) { migrate10(); saveGame(); }
    if (old < 11) { migrate11(); saveGame(); }
    if (old < 12) { migrate12(); saveGame(); }
    if (old < 13) { migrate13(); saveGame(); }
    if (old < 14) { migrate14(); saveGame(); }
    if (old < 15) { migrate15(); saveGame(); }
    if (old < 16) { migrate16(); saveGame(); }
    notes39();
    notes40();
    notes41();
    notes42();
    notes43();
    notes44();
    notes45();
    notes46();
    notes48();
    notes49();
    notes50();
    notes51();
    notes52();
    notes53();
    notes55();
    notes56();
    notes57();
    notes58();
    notes59();
    notes60();
    notes61();
    notes62();
    notes63();
    notes63b();
    notes63c();
    notes64(); notes65(); notes68(); notes67(); notes68b(); notes69(); notes69b(); notes69c(); notes69d(); notes69e();
    return true;
  } catch (_) { return false; }
}
// 빌드 30: 마차에 말을 맨다. 말이 끌던 마차를 가진 파티에는 그에 맞는 말을 마구간에 넣어 주고(짐수레=당나귀, 짐마차=갈마, 대형 마차=흑마), 드워프 강철 마차에는 다 자란 산양 펫을 매어 준다
function migrate6() {
  S.stable = S.stable || { horses: {} };
  const give = { donkey: 'donkey', wagon: 'gray', caravan: 'black' };
  let n = 0;
  for (const p of S.parties) {
    if (p.wagonPlus == null) p.wagonPlus = 0;
    if (p.horse === undefined) p.horse = null;
    const w = p.wagon && WAGONS[p.wagon];
    if (!w || !w.horse || p.horse) continue;
    if (p.wagon === 'steel') {
      const pet = Object.assign(newPet('goat'), { lv: PET_EVO_LV, stage: 1, aff: 50 });
      S.pets.push(pet); p.horse = 'p:' + pet.id; n++;
    } else { const k = give[p.wagon] || 'donkey'; S.stable.horses[k] = (S.stable.horses[k] || 0) + 1; p.horse = 'h:' + k; n++; }
  }
  S.v = 6;
  if (n) log(`마구간이 생겼다. 마차를 끌던 말 ${n}마리를 마구간 장부에 올렸다.`);
}
// 빌드 31: 날씨 씨앗, 주방, 편성, 파티 인원(짐꾼 계열 빼고 넷), 체질 특성 (자리가 있는 모험가 셋 중 하나꼴)
function migrate7() {
  S.wx = S.wx || { seed: Math.floor(Math.random() * 1e9) };
  S.bld.kitchen = S.bld.kitchen || 0; S.presets = S.presets || [];
  let cut = 0;
  for (const p of S.parties) cut += trimParty(p);
  S.v = 7;
  if (cut) log(`파티 인원 규칙이 바뀌었다 (짐꾼 계열을 빼고 ${PARTY_FIGHTERS}명까지). 넘치던 ${cut}명을 대기로 돌렸다.`);
}
// 빌드 36: 날씨 특성은 타고난 특성과 따로, 모험가마다 하나(약함만). 특성 칸에 있던 체질(약함·강함)을 빼고,
// 약한 체질이 있었으면 그것을, 없으면 무작위 하나를 a.wxt로 준다 (그만큼 특성 칸이 빈다)
// 빌드 38: 부장비·화살 칸. 활을 쏘는 모험가(손님 포함)에게 무기 단계(없으면 레벨)에 맞는 화살을 준다 — 없으면 기본 공격을 못 하니까
function migrate9() {
  let n = 0;
  const fix = a => {
    if (!a || !a.eq) return;
    if (a.eq.off === undefined) a.eq.off = null;
    if (a.eq.ammo === undefined) a.eq.ammo = null;
    if (needsArrows(a) && !a.eq.ammo) { a.eq.ammo = makeGear('arrows', a.eq.weapon ? Math.min(a.eq.weapon.t, arrowTierOf(a.lv)) : arrowTierOf(a.lv), 0); n++; }
  };
  S.advs.forEach(fix); (S.cands || []).forEach(fix);
  S.v = 9;
  if (n) log(`부장비 칸이 생겼다. 활을 쏘는 모험가 ${n}명에게 화살을 나눠 주었다.`);
}
// 빌드 39: 방패가 네 종류(원형·히터·카이트·탑). 옛 방패는 그때 보이던 모양 그대로(단계 모습 → 종류)로 바꾸고, 방패가 없는 전사·마부 계열에게 방패를 준다
function migrate10() {
  const KIND = ['buckler', 'shield', 'kite', 'tower'], kind = t => KIND[offLook(t)];
  const conv = g => { if (g && g.base === 'shield') g.base = kind(g.t); };
  (S.gear || []).forEach(conv);
  const all = [...(S.advs || []), ...(S.cands || [])];
  all.forEach(a => a && a.eq && conv(a.eq.off));
  (S.parties || []).forEach(q => { if (q.exp && q.exp.gbag) q.exp.gbag.forEach(conv); });
  ((S.shop && S.shop.slots) || []).forEach(sl => { if (sl && typeof sl.item === 'string' && sl.item.startsWith('g:shield:')) { const t = +sl.item.split(':')[2]; sl.item = `g:${kind(t)}:${t}`; } });
  (S.reqs || []).forEach(r => { if (r.gear && r.gear.startsWith('shield:')) { const t = +r.gear.split(':')[1]; r.gear = `${kind(t)}:${t}`; } });
  let n = 0;
  all.forEach(a => {
    if (!a || !a.eq || a.eq.off || !CLASSES[a.cls] || !gearFits(a, { base: 'shield', t: 0 })) return;
    const t = a.eq.weapon ? Math.min(a.eq.weapon.t, arrowTierOf(a.lv)) : arrowTierOf(a.lv);
    a.eq.off = gearFor(shieldOf(a.cls, t), t, 0, a.lv); if ((S.advs || []).includes(a)) n++;   // 빌드 67: 2차 직업 방패는 낄 수 있는 착용 레벨로
  });
  S.v = 10;
  if (n) log(`방패가 네 종류(원형·히터·카이트·탑)가 되었다. 방패가 없던 전사·마부 계열 ${n}명에게 방패를 나눠 주었다.`);
}
function notes42() { if (!S.flags.v42) { S.flags.v42 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '모든 직업 공격 동작 · 스킬 효과', body: STORY.v42 }); } }
function notes57() { if (!S.flags.v57) { S.flags.v57 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '용암 화산 몬스터 새 그림', body: STORY.v57 }); } }
// 빌드 62: 은행을 없앴다. 은행을 지은 값은 돌려주고, 맡아 둔 예금은 원금을 돌려주고(가진 돈에서 빠진다), 빌려준 돈은 원금을 돌려받는다(이자는 없음)
const BANK_PAID = [3000, 7000, 15000, 30000, 60000, 110000, 200000, 350000];   // 은행 단계마다 냈던 값
function migrate11() {
  const lv = Math.max(0, Math.min(BANK_PAID.length, (S.bld && S.bld.bank) || 0)), bk = S.bank || {};
  const refund = BANK_PAID.slice(0, lv).reduce((a, b) => a + b, 0), dep = (bk.deps || []).reduce((a, d) => a + (d.amount || 0), 0), loan = (bk.loans || []).reduce((a, l) => a + (l.amount || 0), 0);
  const before = S.gold || 0;
  S.gold = Math.max(0, before + refund + loan - dep);
  if (S.bld) delete S.bld.bank;
  delete S.bank;
  S.v = 11;
  if (!lv && !dep && !loan) return;
  const body = ['상단 본부를 새로 꾸미면서 은행을 닫았다.'];
  if (refund) body.push(`은행을 지은 값 ${fmt(refund)}G를 돌려받았다.`);
  if (loan) body.push(`빌려준 돈의 원금 ${fmt(loan)}G를 돌려받았다. (이자는 없음)`);
  if (dep) body.push(`맡아 둔 예금의 원금 ${fmt(dep)}G를 주인들에게 돌려주었다.${before + refund + loan < dep ? ' 돈이 모자라 가진 돈을 모두 내주었다.' : ''}`);
  body.push(`정리한 뒤 가진 돈: ${fmt(S.gold)}G`);
  S.modals.push({ title: '은행 정리', body });
  log(`은행을 닫았다. 돌려받은 돈 ${fmt(refund + loan)}G · 돌려준 예금 ${fmt(dep)}G`);
}
// 빌드 64 장비 개편 1단계: 카이트 · 탑 방패는 라운드 실드로, 그 단계에 없는 2차 직업 장비(늪지 단계 아래의 글라디우스 · 버클러 · 십자 방패)는 장검 · 라운드 실드로.
// 옛 방패는 모양만 다른 같은 방패였으니, 모험가가 든 방패는 그 직업의 새 방패로(검투사 버클러 · 기사 십자 · 마검사 에테르, 그 단계에 없으면 라운드 실드) — 등급 · 룬은 그대로.
// 들고 있던 장비를 더는 못 쓰게 된 모험가(글라디우스를 든 전사 · 쌍검사 등)는 같은 단계 장검으로 바꿔 준다.
function migrate12() {
  const OLD = { kite: 'shield', tower: 'shield' }, LOW = { gladius: 'sword', great: 'axe', buckler: 'shield', cross: 'shield', ether: 'shield' };
  const baseFix = (b, t) => OLD[b] || (GTYPES[b] && !tierOk(b, t) ? LOW[b] || b : b);
  let n = 0, m = 0;
  const fix = g => { if (!g || !GTYPES[g.base]) return; const nb = baseFix(g.base, g.t); if (nb !== g.base) { g.base = nb; n++; } };
  (S.gear || []).forEach(fix);
  (S.wh || []).forEach(w => ((w && w.gear) || []).forEach(fix));
  (S.parties || []).forEach(q => { if (q.exp && q.exp.gbag) q.exp.gbag.forEach(fix); });
  const U = S.under || {};
  if (U.bm && U.bm.stock) U.bm.stock.forEach(o => { if (o && o.kind === 'gear') fix(o.g); });
  if (U.au && U.au.g) fix(U.au.g);
  if (U.arena && U.arena.opps) U.arena.opps.forEach(o => ((o && o.members) || []).forEach(x => { if (x && x.eq) Object.values(x.eq).forEach(fix); }));
  const key = (b, t) => `${baseFix(b, +t)}:${t}`;
  ((S.shop && S.shop.slots) || []).forEach(sl => { if (sl && typeof sl.item === 'string' && sl.item.startsWith('g:')) { const [, b, t] = sl.item.split(':'); sl.item = 'g:' + key(b, t); } });
  (S.reqs || []).forEach(r => { if (r && r.gear) { const [b, t] = r.gear.split(':'); r.gear = key(b, t); } });
  const SH_OLD = ['shield', 'buckler', 'kite', 'tower', 'cross'];
  [...(S.advs || []), ...(S.cands || [])].forEach(a => {
    if (!a || !a.eq || !CLASSES[a.cls]) return;
    const o = a.eq.off, mine = (S.advs || []).includes(a);
    if (o && SH_OLD.includes(o.base)) { const nb = shieldOf(a.cls, o.t); if (nb !== o.base) { o.base = nb; if (mine) m++; } }
    Object.values(a.eq).forEach(fix);
    const w = a.eq.weapon;
    if (w && GTYPES[w.base] && !gearFits(a, w) && gearFits(a, { base: 'sword', t: w.t })) { w.base = 'sword'; if (mine) m++; }
    if (o && GTYPES[o.base] && GTYPES[o.base].slot === 'off' && SHIELDS.includes(o.base) && !gearFits(a, o)) o.base = 'shield';
    if (twoHand(a.eq.weapon) && a.eq.off) { S.gear.push(a.eq.off); a.eq.off = null; }
  });
  // 빌드 64: 각성(용사) · 2차 각성(초월 용사)을 없앴다 — 표시를 지우고 각성기는 스킬 칸에서 뺀다 (이미 오른 능력치 · 레벨은 그대로, 이미 전직한 모험가도 그대로)
  let h = 0;
  const AWK = id => /^awk2?_/.test(id);
  [...(S.advs || []), ...(S.cands || []), ...((S.graves || []).map(g => g && g.adv).filter(Boolean))].forEach(a => {
    if (!a) return;
    if (a.hero || a.hero2) h++;
    delete a.hero; delete a.hero2;
    if (Array.isArray(a.skills)) a.skills = a.skills.filter(id => !AWK(id) && SKILLS[id]);
    for (const k of ['sl', 'skoff', 'skpri']) if (a[k]) for (const id of Object.keys(a[k])) if (AWK(id)) delete a[k][id];
    if (Array.isArray(a.skills) && CLASSES[a.cls] && a.skills.length > skillSlots(a)) a.skills = a.skills.slice(0, skillSlots(a));
  });
  (S.hall || []).forEach(x => { delete x.hero; delete x.hero2; });   // 명예의 전당 용사 배율도 없앴다
  // 빌드 64: 장비 강화(+1~+10)를 없앴다 — 내 장비(창고 · 창고 1~10 · 모험가 · 원정 짐)의 강화 단계를 지우고 성공한 단계만큼 재료 · 돈을 돌려준다. 남의 것(암시장 · 경매 · 투기장 상대 · 손님)은 지우기만
  const back = {}; let bg = 0, bn = 0;
  const unplus = (g, mine) => { if (!g || !(g.plus > 0)) { if (g) delete g.plus; return; }
    if (mine && GTIERS[g.t]) { for (let k = 1; k <= Math.min(10, g.plus); k++) { for (const [it, q] of Object.entries(PLUS_NEED_OF(k, g.t))) if (ITEMS[it]) back[it] = (back[it] || 0) + q; bg += PLUS_FEE_OF(k, g.t); } bn++; }
    delete g.plus; };
  (S.gear || []).forEach(g => unplus(g, 1));
  (S.wh || []).forEach(w => ((w && w.gear) || []).forEach(g => unplus(g, 1)));
  (S.advs || []).forEach(x => { if (x && x.eq) Object.values(x.eq).forEach(g => unplus(g, 1)); });
  (S.parties || []).forEach(q => { if (q.exp && q.exp.gbag) q.exp.gbag.forEach(g => unplus(g, 1)); });
  (S.graves || []).forEach(x => { if (x && x.adv && x.adv.eq) Object.values(x.adv.eq).forEach(g => unplus(g, 1)); });
  (S.cands || []).forEach(x => { if (x && x.eq) Object.values(x.eq).forEach(g => unplus(g, 0)); });
  if (U.bm && U.bm.stock) U.bm.stock.forEach(o => { if (o && o.g) unplus(o.g, 0); });
  if (U.au && U.au.g) unplus(U.au.g, 0);
  if (U.arena && U.arena.opps) U.arena.opps.forEach(o => ((o && o.members) || []).forEach(x => { if (x && x.eq) Object.values(x.eq).forEach(g => unplus(g, 0)); }));
  if (bn) {
    for (const [it, q] of Object.entries(back)) addTo(S.inv, it, q);
    S.gold = (S.gold || 0) + bg;
    const mats = Object.entries(back).map(([it, q]) => `${ITEMS[it].name} ${q}`).join(' · ');
    S.modals.push({ title: '장비 강화 정리', body: ['장비 강화(+1~+10)가 없어졌다. 강화한 장비는 강화 전 능력치로 돌아갔다.', `강화한 장비 ${bn}점에 들인 재료와 돈(성공한 단계만큼)을 돌려받았다: ${mats || '재료 없음'} · ${fmt(bg)}G`] });
    log(`장비 강화 정리: ${bn}점 · 돌려받은 돈 ${fmt(bg)}G${mats ? ' · ' + mats : ''}`, 'good');
  }
  (S.graves || []).forEach(g => { if (g) { delete g.hero; delete g.hero2; } });
  S.v = 12;
  unfitGear();
  if (n || m) log(`장비 개편: 옛 방패 · 투기장 글라디우스 ${fmt(n + m)}점을 새 장비로 바꾸었다 (등급 · 룬은 그대로).`);
  if (h) log(`각성이 없어졌다: 용사 ${h}명의 각성기를 스킬 칸에서 뺐다 (능력치 · 레벨은 그대로).`);
}
// 빌드 64 룬 개편: 17종 → 합친 19종 (무기 · 방어구 두 효과 · 하급 ~ 최상급). 옛 룬은 같은 등급의 합친 룬으로 바꾼다 —
// 창고 · 창고 1~10 · 원정 짐 · 장비에 끼운 룬 · 암시장 · 손님 · 진열대 어디에 있든 저장 전체를 훑어 이름(값 · 열쇠)을 바꾼다 (같은 칸에 겹치면 개수를 더한다)
// migrateSkillIds가 ITEMS에 없는 물건을 창고에서 지우므로, 이름 바꾸기(runeRename)는 불러오자마자 먼저 하고 migrate13은 판만 올린다
const RUNE_OLD = { vit: 'str', agi: 'int', def: 'atk', barrier: 'matk', fireres: 'fire', coldres: 'cold', boltres: 'bolt', darkres: 'dark' };
let RUNE_RENAMED = 0;
function runeRename() {
  const re = /^rune_(vit|agi|def|barrier|fireres|coldres|boltres|darkres)_(\d)$/;
  const map = x => { const m = re.exec(x); return m ? `rune_${RUNE_OLD[m[1]]}_${m[2]}` : x; };
  let n = 0;
  const walk = o => {
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { const w = map(v); if (w !== v) { o[i] = w; n++; } } else if (v && typeof v === 'object') walk(v); } return; }
    for (const k of Object.keys(o)) {
      let v = o[k];
      if (typeof v === 'string') { const w = map(v); if (w !== v) { o[k] = v = w; n++; } } else if (v && typeof v === 'object') walk(v);
      const nk = map(k);
      if (nk !== k) { if (typeof o[nk] === 'number' && typeof v === 'number') o[nk] += v; else if (o[nk] === undefined) o[nk] = v; delete o[k]; n++; }
    }
  };
  walk(S);
  RUNE_RENAMED += n;
}
function migrate13() {
  S.v = 13;
  if (RUNE_RENAMED) log(`룬 개편: 옛 룬 ${fmt(RUNE_RENAMED)}개를 같은 등급의 합친 룬으로 바꾸었다 (체력 → 강인 · 민첩 → 영민 · 수호 → 공방 · 결계 → 마력 · 내화 · 내한 · 피뢰 → 화염 · 냉기 · 번개 · 정결 → 어둠).`);
  RUNE_RENAMED = 0;
}
// 빌드 65 직업 개편: 정찰가 · 탐험가(활 → 정글칼 · 화살은 창고로) · 용기수(창 → 복합궁 + 화살) · 쌍검사 · 검무사(장검 → 단검 + 보조 단검).
// 못 끼게 된 무기는 창고로 옮기고 같은 단계의 새 무기를 준다. 방패를 든 마부 계열 · 화살통을 든 정찰가의 부장비는 unfitGear가 창고로 옮긴다.
let REFIT65 = 0, MANA65 = 0;
function refit65() {
  const fix = (a, keep) => {
    if (!a || !a.eq || !CLASSES[a.cls]) return;
    const ch = chainOf(a.cls), w = a.eq.weapon, aff = ch.includes('scout') || a.cls === 'dragoon' || ch.includes('duelist');
    if (ch.includes('spellblade') && w && w.base === 'sword' && tierOk('manasword', w.t || 0)) { w.base = 'manasword'; if (keep) MANA65++; }   // 마검사 · 마검성의 무기 = 마나소드 (늪지 단계부터 — 같은 단계 · 레어도 · 룬 · 옵션 그대로)
    if (!aff) return;
    if (w && !gearFits(a, w)) { const t = w.t || 0; if (keep) S.gear.push(w); a.eq.weapon = gearFor(weaponOf(a.cls, t), t, 0, a.lv); REFIT65++; }
    if (ch.includes('scout') && a.eq.ammo) { if (keep) S.gear.push(a.eq.ammo); a.eq.ammo = null; }
    if (a.cls === 'dragoon' && !a.eq.ammo) a.eq.ammo = makeGear('arrows', arrowTierOf(a.lv), 0);
    offGift65(a, (a.eq.weapon && a.eq.weapon.t) || 0);
  };
  (S.advs || []).forEach(a => fix(a, true)); (S.cands || []).forEach(a => fix(a, false));
}
function offGift65(a, t) {
  if (!a || !a.eq || a.eq.off || twoHand(a.eq.weapon)) return;
  const ch = chainOf(a.cls), b = ch.includes('duelist') ? 'dagger2' : ch.includes('ninja') ? 'shuriken' : null;
  if (b && (LADDER_B[b] ? ladderFor(a.lv, t) : tierOk(b, t))) a.eq.off = gearFor(b, t, 0, a.lv);   // 빌드 67: 보조 단검은 Lv50부터(막 전직한 쌍검사도)
}
function migrate14() {
  S.v = 14;
  if (REFIT65) log(`직업 개편: 정찰가 · 탐험가 · 용기수 · 쌍검사 · 검무사 ${fmt(REFIT65)}명의 무기를 새 무기로 바꾸었다 (예전 무기는 창고에).`);
  if (MANA65) log(`마검사 · 마검성 ${fmt(MANA65)}명이 들던 장검을 같은 단계의 마나소드로 바꾸었다 (레어도 · 룬 · 옵션은 그대로).`);
  REFIT65 = 0; MANA65 = 0;
}
function migrate15() {   // 빌드 65 넷째 묶음: 펫 만렙 30 · 레어도(옛 펫은 일반) · 옛 요리 14가지는 레시피를 아는 것으로 · 재배소 · 항구
  S.v = 15;
  (S.pets || []).forEach(p => { if (p.lv > PET_MAX_LV) { p.lv = PET_MAX_LV; p.exp = 0; } if (p.lv >= PET_EVO_LV && !p.stage) p.stage = 1; if (p.q == null) p.q = 0; });
  const C = cookState(); OLD_FOODS.forEach(id => { if (!C.known[id]) C.known[id] = 1; });
  petState().lucky = petState().lucky || {};
  S.bld.farm = S.bld.farm || 0;
  if (!S.port) S.port = { next: today() + 1, ship: null };
}
// 빌드 66: 2차 직업만 입는 장비(data-armor65.js JOB2_LOW — 중갑 · 중갑 하의 · 판금 · 판금 하의 · 창 · 류트)는 늪지대 단계부터. 그 아래 단계로 갖고 있던 것은
// 같은 단계 · 레어도 · 룬 · 옵션 그대로 1차 장비로 (loadFrom에서 migrateS의 unfitGear보다 먼저 — 끼고 있던 것은 그 모험가가 입을 수 있는 같은 칸 장비로)
let LOW66 = 0, TRI67 = 0;
function lowJob66() {
  const low = g => !!g && !!JOB2_LOW[g.base] && (LADDER_B[g.base] ? (g.t || 0) < 5 : !tierOk(g.base, g.t));   // 빌드 67: 중갑 · 판금은 사막왕 단계(Lv50 그림)부터 쓴다
  const fix = g => { if (low(g)) { g.base = JOB2_LOW[g.base]; LOW66++; } };
  (S.gear || []).forEach(fix);
  (S.wh || []).forEach(w => ((w && w.gear) || []).forEach(fix));
  (S.parties || []).forEach(q => { if (q.exp && q.exp.gbag) q.exp.gbag.forEach(fix); });
  const U = S.under || {};
  if (U.bm && U.bm.stock) U.bm.stock.forEach(o => { if (o && o.kind === 'gear') fix(o.g); });
  if (U.au && U.au.g) fix(U.au.g);
  if (U.arena && U.arena.opps) U.arena.opps.forEach(o => ((o && o.members) || []).forEach(x => { if (x && x.eq) Object.values(x.eq).forEach(fix); }));
  const key = (b, t) => `${JOB2_LOW[b] && (LADDER_B[b] ? +t < 5 : !tierOk(b, +t)) ? JOB2_LOW[b] : b}:${t}`;
  ((S.shop && S.shop.slots) || []).forEach(sl => { if (sl && typeof sl.item === 'string' && sl.item.startsWith('g:')) { const [, b, t] = sl.item.split(':'); sl.item = 'g:' + key(b, t); } });
  (S.reqs || []).forEach(r => { if (r && r.gear) { const [b, t] = r.gear.split(':'); r.gear = key(b, t); } });
  // 빌드 67: 삼지창(투기장)을 든 랑기수 · 용기수(이제 활 직업) — 삼지창은 창고로(낮은 단계면 장검으로), 같은 단계 직업 무기를 준다(refit65와 같은 길 · 후보는 바꾸기만)
  [...(S.advs || []).map(a => [a, 1]), ...(S.cands || []).map(a => [a, 0])].forEach(([a, mine]) => {
    const w = a && a.eq && a.eq.weapon; if (!w || w.base !== 'trident' || !CLASSES[a.cls] || clsFits(a, 'trident')) return;
    if (mine) { fix(w); (S.gear = S.gear || []).push(w); TRI67++; }
    a.eq.weapon = gearFor(weaponOf(a.cls, w.t || 0), w.t || 0, 0, a.lv);
  });
  [...(S.advs || []), ...(S.cands || [])].forEach(a => {
    if (!a || !a.eq || !CLASSES[a.cls]) return;
    for (const sl of Object.keys(a.eq)) {
      const g = a.eq[sl]; if (!low(g)) continue;
      const opts = [JOB2_LOW[g.base], ...(GTYPES[g.base].slot === 'armor' ? ['leather', 'robe', 'cloth'] : [])];   // 기사가 입던 중갑 → 경갑은 못 입으니 가죽 갑옷
      g.base = opts.find(b => gearFits(a, { base: b, t: g.t })) || JOB2_LOW[g.base]; LOW66++;
    }
  });
}
function migrate16() {   // 빌드 66 (lowJob66이 먼저 바꿔 둔다)
  S.v = 16;
  log(`장비 점검: 2차 직업만 입는 장비(중갑 · 판금 상의 · 하의와 무기 · 부장비 · 볼트 — 창 · 류트 · 투기장 삼지창 포함)는 이제 그림마다 착용 레벨이 Lv50 · 55 · 60 … 95 · 100 · 110 …이다. Lv50은 대장간 사막왕 단계에서 만들고, 늪지대부터는 떨어진다. 갖고 있던 것은 예전 레벨 그대로. 삼지창은 이제 검투사 · 기사 계열만 낀다(랑기수 · 용기수는 활 직업).${TRI67 ? ` 삼지창을 들던 랑기수 · 용기수 ${fmt(TRI67)}명은 삼지창을 창고에 넣고 같은 단계 활을 받았다.` : ''}${LOW66 ? ` 그보다 낮은 단계로 갖고 있던 ${fmt(LOW66)}점은 같은 단계 · 레어도 · 룬 · 옵션 그대로 경갑 · 경갑 하의 · 장검 · 몽둥이로 바꾸었다(기사 · 마검사 계열이 입던 갑옷은 가죽 갑옷).` : ''}`);   // 빌드 67: 바꾼 것이 없어도 한 줄
  LOW66 = 0; TRI67 = 0;
}
function notes67() { if (!S.flags.v67) { S.flags.v67 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '장비 착용 레벨 · 무기 그림 · 룬 합성', body: STORY.v67 }); } }   // 빌드 67
function notes68() { if (!S.flags.v68) { S.flags.v68 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '펫 · 알 · 재배소 · 식재료 · 요리 · 항구', body: STORY.v68 }); } }
// 빌드 69: 왕국 · 투기장 스킬 빼기 (data-cut69.js CUT_SK) — 불러올 때마다 (남은 게 없으면 아무것도 안 한다)
//  배운 모험가에게서 지우고 배울 때 쓴 책 1권 + 스킬 단계마다 1권을 같은 차수 스킬북 단계(찢어진 · 낡은 · 빛바랜)로, 수업료 · 단계 올린 값은 돈으로 돌려준다.
//  고용 후보 · 그 밖에 모험가 꼴을 든 곳(명예의 전당 · 투기장 상대 …)에서는 그냥 지운다.
//  그 스킬북은 어디에 있든(창고 · 창고 1~10 · 진열대 · 원정 짐 · 의뢰 · 암시장 …) 같은 차수 스킬북 단계로 바꾼다 (runeRename과 같은 길 — 열쇠 · 값, 겹치면 개수를 더함)
let CUT69 = null;   // 불러올 때 정리한 것 (notes69가 알림으로 내보내고 비운다)
function cut69() {
  if (!S || typeof CUT_SK === 'undefined' || !CUT_SK.length) return;
  const cut = new Set(CUT_SK), tb = id => TIER_BOOK_IDS[CUT_SK_TIER[id]];
  const R = { who: [], books: {}, gold: 0, conv: 0 };
  const strip = (a, refund) => {
    if (!a || !Array.isArray(a.skills) || !a.skills.some(id => cut.has(id))) return;
    const gone = a.skills.filter(id => cut.has(id));
    a.skills = a.skills.filter(id => !cut.has(id));
    for (const id of gone) {
      const lv = Math.max(1, (a.sl && a.sl[id]) || 1);
      if (refund) {
        R.books[tb(id)] = (R.books[tb(id)] || 0) + lv;
        R.gold += learnFee(SKILLS[id]); for (let l = 2; l <= lv; l++) R.gold += skillUpCost(id, l);
        R.who.push(`${a.name} 「${SKILLS[id].name}」${lv > 1 ? ` Lv${lv}` : ''}`);
      }
      ['sl', 'skoff', 'skpri', 'sm'].forEach(k => { if (a[k] && typeof a[k] === 'object') delete a[k][id]; });
    }
  };
  (S.advs || []).forEach(a => strip(a, true));
  const walkA = o => { if (Array.isArray(o)) { o.forEach(walkA); return; } if (!o || typeof o !== 'object') return; if (Array.isArray(o.skills) && o.cls) strip(o, false); for (const k of Object.keys(o)) { const v = o[k]; if (v && typeof v === 'object') walkA(v); } };
  walkA(S);
  // 스킬북 → 같은 차수 스킬북 단계
  const map = x => (typeof x === 'string' && x.startsWith('book_') && cut.has(x.slice(5)) ? tb(x.slice(5)) : x);
  const cnt = inv => Object.keys(inv || {}).reduce((n, k) => n + (map(k) !== k && typeof inv[k] === 'number' ? inv[k] : 0), 0);
  R.conv = cnt(S.inv) + (Array.isArray(S.wh) ? S.wh.reduce((n, W) => n + cnt(W && W.inv), 0) : 0);
  const walk = o => {
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') o[i] = map(v); else if (v && typeof v === 'object') walk(v); } return; }
    for (const k of Object.keys(o)) {
      let v = o[k];
      if (typeof v === 'string') o[k] = v = map(v); else if (v && typeof v === 'object') walk(v);
      const nk = map(k);
      if (nk !== k) { if (typeof o[nk] === 'number' && typeof v === 'number') o[nk] += v; else if (o[nk] === undefined) o[nk] = v; delete o[k]; }
    }
  };
  walk(S);
  // 돌려주기 (메인 창고 — 스킬북 단계는 쌓인다)
  for (const k in R.books) addTo(S.inv, k, R.books[k]);
  S.gold += R.gold;
  if (R.who.length || R.conv) {
    const C = CUT69 || (CUT69 = { who: [], books: {}, gold: 0, conv: 0 });
    C.who.push(...R.who); for (const k in R.books) C.books[k] = (C.books[k] || 0) + R.books[k]; C.gold += R.gold; C.conv += R.conv;
  }
}
// 정리한 것 알림 (빌드 69 알림과 함께 — 이미 본 저장이면 정리한 것만)
function notes69() {
  const R = CUT69; CUT69 = null;
  const lines = [];
  if (R) {
    const cut = L => (L.length > 8 ? `${L.slice(0, 8).join(' · ')} 외 ${L.length - 8}개` : L.join(' · '));
    if (R.who.length) lines.push(`배운 스킬을 지웠다(그만큼 스킬 칸이 빈다): ${cut(R.who)}.`);
    const back = Object.entries(R.books).map(([k, n]) => `${ITEMS[k].name} ${n}권`).concat(R.gold ? [`${fmt(R.gold)}G`] : []);
    if (back.length) lines.push(`돌려받은 것: ${back.join(' · ')} — 배울 때 쓴 스킬북 · 수업료와 스킬 단계를 올린 책 · 값.`);
    if (R.conv) lines.push(`창고에 있던 그 스킬북 ${fmt(R.conv)}권은 같은 차수 스킬북 단계로 바꿨다 — 펼치면 다른 스킬북이 나온다.`);
    if (lines.length) log(`왕국 · 투기장 스킬 정리: ${R.who.length ? `배운 스킬 ${R.who.length}개를 지우고 ` : ''}${back.length ? `${back.join(' · ')}를 돌려받았다` : ''}${R.conv ? `${back.length ? ' · ' : ''}스킬북 ${fmt(R.conv)}권을 스킬북 단계로 바꿨다` : ''}.`, 'good');
  }
  const first = !S.flags.v69; S.flags.v69 = 1;
  if (first && (lines.length || today() > 1 || S.advs.some(a => a.lv > 2))) S.modals.push({ title: '왕국 · 투기장 스킬을 뺐어요', body: STORY.v69.concat(lines) });
  else if (lines.length) S.modals.push({ title: '왕국 · 투기장 스킬 정리', body: lines });
}
// 빌드 69 회복 개편 (data-heal69.js): 이제 못 배우는 응급 처치(성직자 계열만) · 치유의 찬가(성직자 계열 Lv50부터) · 재기(Lv150부터)를 지운다.
// 모험가에게는 그 스킬북(배울 때 1권 + 스킬 단계마다 1권)과 수업료 · 단계 값(예전 배우는 레벨로 셈)을 돌려준다 — 숙련도(sm)는 남겨 다시 배우면 이어진다.
// 손님 · 투기장 상대 · 전당 같은 다른 모험가 꼴은 그냥 지운다. 불러올 때마다 (남은 게 없으면 아무것도 안 한다)
let HEAL69R = null;
function heal69() {
  if (!S || typeof HEAL69_LEARN === 'undefined') return;
  const R = { who: [], books: {}, gold: 0 };
  const L0 = id => (HEAL69_OLD[id] && HEAL69_OLD[id].lv) || SKILLS[id].lv;
  const strip = (a, refund) => {
    if (!a || !Array.isArray(a.skills) || !a.cls || !CLASSES[a.cls] || typeof a.lv !== 'number') return;
    const gone = a.skills.filter(id => HEAL69_LEARN.includes(id) && SKILLS[id] && !canLearn(a, id));
    if (!gone.length) return;
    a.skills = a.skills.filter(id => !gone.includes(id));
    for (const id of gone) {
      const lv = Math.max(1, (a.sl && a.sl[id]) || 1);
      if (refund) {
        const k = 'book_' + id; R.books[k] = (R.books[k] || 0) + lv;
        R.gold += L0(id) * 30; for (let l = 2; l <= lv; l++) R.gold += Math.round(Math.max(60, L0(id) * 30) * l);   // learnFee · skillUpCost와 같은 식 (예전 배우는 레벨)
        R.who.push(`${a.name} 「${SKILLS[id].name}」${lv > 1 ? ` Lv${lv}` : ''}`);
      }
      ['sl', 'skoff', 'skpri'].forEach(q => { if (a[q] && typeof a[q] === 'object') delete a[q][id]; });
    }
  };
  (S.advs || []).forEach(a => strip(a, true));
  const seen = new Set(S.advs || []);
  const walk = o => { if (!o || typeof o !== 'object' || seen.has(o)) return; seen.add(o); if (Array.isArray(o)) { o.forEach(walk); return; } if (Array.isArray(o.skills) && o.cls) strip(o, false); for (const k of Object.keys(o)) { const v = o[k]; if (v && typeof v === 'object') walk(v); } };
  walk(S);
  for (const k in R.books) if (ITEMS[k]) addTo(S.inv, k, R.books[k]);
  S.gold += R.gold;
  if (R.who.length) { const C = HEAL69R || (HEAL69R = { who: [], books: {}, gold: 0 }); C.who.push(...R.who); for (const k in R.books) C.books[k] = (C.books[k] || 0) + R.books[k]; C.gold += R.gold; }
}
// 회복 개편 알림 (처음이면 STORY.v69b + 정리한 것, 이미 본 저장이면 정리한 것만)
function notes69b() {
  const R = HEAL69R; HEAL69R = null;
  const lines = [];
  if (R && R.who.length) {
    const cut = L => (L.length > 8 ? `${L.slice(0, 8).join(' · ')} 외 ${L.length - 8}개` : L.join(' · '));
    const back = Object.entries(R.books).map(([k, n]) => `${ITEMS[k].name} ${n}권`).concat(R.gold ? [`${fmt(R.gold)}G`] : []);
    lines.push(`이제 못 배우는 스킬을 지웠다(그만큼 스킬 칸이 빈다): ${cut(R.who)}.`);
    lines.push(`돌려받은 것: ${back.join(' · ')} — 배울 때 쓴 스킬북 · 수업료와 스킬 단계를 올린 책 · 값. 응급 처치는 성직자 계열, 치유의 찬가는 성직자 계열 Lv50, 재기는 Lv150이 되면 다시 배울 수 있다.`);
    log(`회복 개편 정리: 배운 스킬 ${R.who.length}개를 지우고 ${back.join(' · ')}를 돌려받았다.`, 'good');
  }
  const first = !S.flags.v69b; S.flags.v69b = 1;
  if (first && (lines.length || today() > 1 || S.advs.some(a => a.lv > 2))) S.modals.push({ title: '회복 스킬 개편 · 새 숙련 신성력', body: STORY.v69b.concat(lines) });
  else if (lines.length) S.modals.push({ title: '회복 스킬 정리', body: lines });
}
/* ───────── 빌드 69 레이드 개편 · 봉급 (data-raid69.js · data-sal69.js) ───────── */
let RAID69R = null, SAL69R = null;
// 레이드대(빌드 36 레이드 전용 파티)를 푼다: 쉬고 있으면 바로, 원정 중이면 돌아온 뒤(arrive) — 모험가는 대기 중으로
function raidDissolve(p) {
  if (!p || !p.raidOnly || p.exp) return false;
  S.parties = S.parties.filter(x => x !== p);
  if (S.view === p.id) S.view = S.parties[0] ? S.parties[0].id : null;
  (RAID69R || (RAID69R = { n: 0, who: 0 })).n++; RAID69R.who += p.members.length;
  log(`레이드 전용 파티 「${p.name}」을(를) 풀었다. 모험가 ${p.members.length}명이 대기 중으로 돌아왔다. 이제 레이드는 일반 파티 ${RAID_MIN_PARTIES}개 이상이 함께 나간다.`);
  return true;
}
function raid69() {
  if (!S || !S.parties) return;
  S.parties.filter(p => p.raidOnly).forEach(raidDissolve);
  S.parties.forEach(p => { if (p.dest && FIELDS[p.dest] && FIELDS[p.dest].giant) p.dest = 'plains'; });   // 레이드는 레이드 탭에서 함께만 — 한 파티의 목적지로는 두지 않는다
}
function sal69() {
  if (!S || !S.advs) return;
  const first = !S.flags.v69c, before = first ? S.advs.filter(a => a.status !== 'dead').reduce((s, a) => s + (a.salary || 0), 0) : 0;
  if (first) S.advs.concat(S.cands || []).forEach(a => { if (a && a.salK == null && a.bio && a.bio.startsWith('모험가 길드가 보낸 견습생')) a.salK = 0.5; });
  S.advs.forEach(salaryNew); (S.cands || []).forEach(a => { salaryNew(a); if (a.fee) a.fee = a.salary; });
  if (first) SAL69R = { before, after: payroll(), n: living().length };
}
function notes69c() {
  const R = RAID69R, P = SAL69R; RAID69R = null; SAL69R = null;
  const lines = [];
  if (R && R.n) lines.push(`레이드대를 풀었다: 모험가 ${R.who}명이 대기 중으로 돌아왔다.`);
  if (P && P.n) lines.push(`봉급: 모험가 ${P.n}명의 한 달 봉급이 ${fmt(P.before)}G → ${fmt(P.after)}G가 되었다 (명예의 전당 스승 할인을 깎은 값).`);
  const first = !S.flags.v69c; S.flags.v69c = 1;
  if (first && (lines.length || today() > 1 || S.advs.some(a => a.lv > 2))) S.modals.push({ title: '누구나 Lv200 · 레이드 개편 · 봉급', body: STORY.v69c.concat(lines) });
  else if (R && R.n) S.modals.push({ title: '레이드대 정리', body: lines });
}
// 빌드 69 장비 9칸 (data-rpg.js runeSlots · msSlots): 룬은 레어도마다 3칸까지(예전엔 0 ~ 8칸) — 넘친 룬 · 마석을 빼서 메인 창고로 (불러올 때마다).
//  우리 것(창고 · 창고 1~10 · 원정 짐 · 모험가)은 돌려주고, 고용 후보 · 암시장 · 경매 · 투기장 상대의 장비는 그냥 줄인다.
let SLOT69 = null;
function slot69() {
  if (!S) return;
  let n = 0, gn = 0;
  const cut = (g, k, max, mine) => { if (!g[k] || g[k].length <= max) return 0; const out = g[k].splice(max); if (mine) out.forEach(id => { if (ITEMS[id]) { addTo(S.inv, id, 1); n++; } }); return 1; };
  const fix = (g, mine) => { if (!g || typeof g !== 'object' || !g.base) return; const a = cut(g, 'runes', runeSlots(g), mine), b = cut(g, 'ms', msSlots(g), mine); if (mine && (a || b)) gn++; };
  (S.gear || []).forEach(g => fix(g, 1));
  (S.wh || []).forEach(w => ((w && w.gear) || []).forEach(g => fix(g, 1)));
  (S.parties || []).forEach(q => { if (q.exp && q.exp.gbag) q.exp.gbag.forEach(g => fix(g, 1)); });
  (S.advs || []).forEach(a => { if (a && a.eq) Object.values(a.eq).forEach(g => fix(g, 1)); });
  (S.cands || []).forEach(a => { if (a && a.eq) Object.values(a.eq).forEach(g => fix(g, 0)); });
  const U = S.under || {};
  if (U.bm && U.bm.stock) U.bm.stock.forEach(o => { if (o && o.kind === 'gear') fix(o.g, 0); });
  if (U.au && U.au.g) fix(U.au.g, 0);
  if (U.arena && U.arena.opps) U.arena.opps.forEach(o => ((o && o.members) || []).forEach(x => { if (x && x.eq) Object.values(x.eq).forEach(g => fix(g, 0)); }));
  if (n) { SLOT69 = SLOT69 || { n: 0, g: 0 }; SLOT69.n += n; SLOT69.g += gn; log(`장비 9칸: 룬은 레어도마다 3칸까지라 장비 ${gn}점에서 넘친 룬 ${n}개를 빼서 창고에 넣었다.`); }
}
function notes69d() {
  const R = SLOT69; SLOT69 = null;
  const lines = R && R.n ? [`룬을 넷 이상 새긴 장비 ${R.g}점에서 넘친 룬 ${R.n}개를 빼서 창고에 넣었다.`] : [];
  const first = !S.flags.v69d; S.flags.v69d = 1;
  if (first && (lines.length || today() > 1 || S.advs.some(a => a.lv > 2))) S.modals.push({ title: '장비 9칸 · 마석 · 대형', body: STORY.v69d.concat(lines) });
  else if (lines.length) S.modals.push({ title: '룬 칸 정리', body: lines });
}
function notes69e() { if (!S.flags.v69e) { S.flags.v69e = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '능력치 상한 · 몬스터 강화', body: STORY.v69e }); } }   // 빌드 69 (11-14 12:18 — data-cap69.js · data-monup69.js)
function notes68b() { if (!S.flags.v68b) { S.flags.v68b = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '스킬북 계열 · 직업 표시 · 스킬 칸 나누기', body: STORY.v68b }); } }   // 빌드 68 (data-skjob68.js)
function notes65() {   // 빌드 65: 세트 효과 없앰 · 전사 방어구(경갑 · 중갑 · 판금) · 하의 칸
  const U = S.under || {}, opps = ((U.arena && U.arena.opps) || []).flatMap(o => (o && o.members) || []);
  [...(S.advs || []), ...(S.cands || []), ...opps].forEach(a => { if (a && a.eq) for (const sl of SLOTS65) if (a.eq[sl] === undefined) a.eq[sl] = null; });   // 옛 모험가 · 손님 · 투기장 상대에게 빈 하의 · 장갑 · 신발 · 벨트 · 귀걸이 칸
  const n = (S.advs || []).reduce((k, a) => k + plate65(a), 0); [...(S.cands || []), ...opps].forEach(plate65);
  const nm = (S.advs || []).reduce((k, a) => k + mast65(a), 0); (S.cands || []).forEach(mast65);   // 새 숙련: 이미 배운 검술 · 방패술 단계를 투기장식검술 · 대검술 · 마력 방패술로
  if (nm) log(`숙련 개편: 검투사 · 광전사 · 마검사 계열 ${fmt(nm)}명이 배운 검술 · 방패술 단계를 투기장식검술 · 대검술 · 마력 방패술로도 옮겼다.`);   // 판금을 못 입게 된 전사 계열의 판금 → 경갑 · 중갑
  if (n) log(`전사 방어구 개편: 판금 갑옷은 이제 마검사 계열 갑옷이다. 기사 · 광전사 계열이 입던 판금 갑옷은 중갑으로, 전사 · 검투사 계열은 경갑으로 바꾸었다 — ${n}명 (단계 · 레어도 · 룬은 그대로).`);
  if (!S.flags.v65) { S.flags.v65 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '세트 효과 없앰 · 새 방어구 · 장비 개편 2단계 · 직업 개편 · 새 숙련 · 탈것 · 야영', body: STORY.v65 }); }
}
function notes64() { if (!S.flags.v64) { S.flags.v64 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '전사 장비 개편 · 룬 개편 · 전직 레벨', body: STORY.v64 }); } }
function notes63() { if (!S.flags.v63) { S.flags.v63 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '전투 개편 · 몬스터 스킬 · 새 상태이상', body: STORY.v63 }); } }
function notes62() { if (!S.flags.v62) { S.flags.v62 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '상단 본부 새 단장 · 선술집', body: STORY.v62 }); } }
function notes61() { if (!S.flags.v61) { S.flags.v61 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '뇌수 · 폭풍 골렘 새 그림', body: STORY.v61 }); } }
function notes60() { if (!S.flags.v60) { S.flags.v60 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '천둥 봉우리 몬스터 새 그림', body: STORY.v60 }); } }
function notes59() { if (!S.flags.v59) { S.flags.v59 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '구름섬 몬스터 새 그림', body: STORY.v59 }); } }
function notes58() { if (!S.flags.v58) { S.flags.v58 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '세계수 뿌리 몬스터 새 그림', body: STORY.v58 }); } }
function notes56() { if (!S.flags.v56) { S.flags.v56 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '백작의 성 몬스터 새 그림', body: STORY.v56 }); } }
function notes55() { if (!S.flags.v55) { S.flags.v55 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '메마른 땅 몬스터 새 그림', body: STORY.v55 }); } }
function notes53() { if (!S.flags.v53) { S.flags.v53 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '늪지대 몬스터 새 그림', body: STORY.v53 }); } }
function notes52() { if (!S.flags.v52) { S.flags.v52 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '지하수로 몬스터 새 그림', body: STORY.v52 }); } }
function notes51() { if (!S.flags.v51) { S.flags.v51 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '뒷골목 암살자 길드 몬스터 새 그림', body: STORY.v51 }); } }
function notes50() { if (!S.flags.v50) { S.flags.v50 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '사라크 사막 몬스터 새 그림', body: STORY.v50 }); } }
function notes49() { if (!S.flags.v49) { S.flags.v49 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '만년설산 몬스터 새 그림', body: STORY.v49 }); } }
function notes48() { if (!S.flags.v48) { S.flags.v48 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '바람계곡 몬스터 새 그림', body: STORY.v48 }); } }
function notes46() { if (!S.flags.v46) { S.flags.v46 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '검은바위산 몬스터 새 그림', body: STORY.v46 }); } }
function notes45() { if (!S.flags.v45) { S.flags.v45 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '원시림 몬스터 새 그림', body: STORY.v45 }); } }
function notes44() { if (!S.flags.v44) { S.flags.v44 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '평원 몬스터 새 그림 · 새 펫', body: STORY.v44 }); } }
function notes43() { if (!S.flags.v43) { S.flags.v43 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '언데드 새 그림 · 몬스터 동작', body: STORY.v43 }); } }
function notes41() { if (!S.flags.v41) { S.flags.v41 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '스킬 효과 · 강화 스킬 동작', body: STORY.v41 }); } }
function notes40() { if (!S.flags.v40) { S.flags.v40 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '공격 동작 · 십자 방패', body: STORY.v40 }); } }
function notes39() { if (!S.flags.v39) { S.flags.v39 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '부장비 그림 · 방패 종류 · 균형', body: STORY.v39 }); } }
function notes38() { if (!S.flags.v38) { S.flags.v38 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '부장비 · 화살', body: STORY.v38 }); } }
function migrate8() {
  let moved = 0;
  const fix = a => {
    if (!a) return;
    const had = (a.traits || []).find(t => WEAK_TRAIT_IDS.includes(t));
    const before = (a.traits || []).length;
    a.traits = (a.traits || []).filter(t => !WX_OLD_TRAITS.includes(t));
    if (a.traits.length < before) moved++;
    if (!WEAK_TRAIT_IDS.includes(a.wxt)) a.wxt = had || rollWxt();
  };
  S.advs.forEach(fix); (S.cands || []).forEach(fix);
  S.v = 8;
  if (moved) log(`날씨 특성이 따로 생겼다. 모험가 ${moved}명의 체질을 특성 칸에서 날씨 특성으로 옮겼다.`);
}
function notes37() { if (!S.flags.v37) { S.flags.v37 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '숙련 · 새 스킬 그림', body: STORY.v37 }); } }
function notes36() { if (!S.flags.v36) { S.flags.v36 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '날씨 특성', body: STORY.v36 }); } }
function notes34() { if (!S.flags.v34) { S.flags.v34 = 1; S.bld.salvage = S.bld.salvage || 0; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '던전 수거소', body: STORY.v34 }); } }
function notes31() { if (!S.flags.v31) { S.flags.v31 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '날씨 · 요리 · 교역 · 2차 각성', body: STORY.v31 }); } }
function notes30() { if (!S.flags.v30) { S.flags.v30 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '북쪽 변경 · 하늘 · 마구간', body: STORY.v30 }); } }
// 의상·숙련도 칸 (없으면 만든다)
function migrateS() { delete S.skins; S.advs.forEach(a => { a.sm = a.sm || {}; delete a.skin; if (!a.traits) a.traits = rollTraits(); }); (S.cands || []).forEach(c => { if (!c.traits) c.traits = rollTraits(); }); migrateU(); dexMigrate(); S.advs.forEach(a => { chainOf(a.cls).forEach(c => { const jt = jobTraitOf(c); if (jt && !(a.traits || []).includes(jt)) a.traits.push(jt); }); }); if ((S.v || 0) >= 12) unfitGear(); migrateSkillIds(); }   // 빌드 64: 옛 저장은 migrate12가 장비를 새 종류로 바꾼 뒤에 본다
// 모험가가 더는 못 쓰는 장비는 창고로 (불러올 때마다)
function unfitGear() { S.advs.forEach(a => { SLOTS.forEach(([sl]) => { const g = a.eq[sl]; if (g && !gearFits(a, g)) { S.gear.push(g); a.eq[sl] = null; } }); }); }
// 겹치던 스킬 id를 갈랐다: 결의(resolve)·치유의 찬가(chant)·유성 낙하(meteorfall). 옛 저장의 스킬·스킬북·숙련도를 옮기고, 라이선스 심사용 처치 수를 어림한다
function migrateSkillIds() {
  const ren = (a, from, to) => { if (!a.skills) return; a.skills = a.skills.map(id => (id === from ? to : id)); if (a.sm && a.sm[from] != null) { a.sm[to] = (a.sm[to] || 0) + a.sm[from]; delete a.sm[from]; } };
  S.advs.concat(S.cands || []).forEach(a => {
    const chain = CLASSES[a.cls] ? chainOf(a.cls) : [];
    if (!chain.includes('knight')) ren(a, 'rally', 'resolve');
    if (!chain.includes('bard')) ren(a, 'hymn', 'chant');
    if (chain.includes('sorcerer')) ren(a, 'meteor', 'meteorfall');
    if (a.skills) a.skills = a.skills.filter((id, i) => SKILLS[id] && a.skills.indexOf(id) === i);
    if (a.bosses == null) a.bosses = Math.round((a.kills || 0) / 60);
    if (a.dungeons == null) a.dungeons = Math.min(S.stats.dungeons || 0, Math.floor((a.trips || 0) / 15));
  });
  const inv = S.inv || {};
  [['book_rally', 'book_resolve'], ['book_hymn', 'book_chant']].forEach(([f, t]) => { if (inv[f]) { inv[t] = (inv[t] || 0) + inv[f]; delete inv[f]; } });
  for (const k in inv) if (!ITEMS[k]) delete inv[k];
}
// 새 전투 화면 안내 (한 번만)
function notesB() { if (!S.flags.bview) { S.flags.bview = 1; S.modals.push({ title: '전투 화면이 새로워졌어요', body: STORY.bview }); } }
// 빌드 22: 기본 공격 5초·스킬 수치·스킬북 드랍표·라이선스 심사 (한 번만, 새 게임은 건너뛴다)
function notes29() { if (!S.flags.v29) { S.flags.v29 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '직업 역할 개편', body: STORY.v29 }); } }
function notes28() { if (!S.flags.v28) { S.flags.v28 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '개화석·레이드 탭·왕국 마차', body: STORY.v28 }); } }
function notes25() { if (!S.flags.v25) { S.flags.v25 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '원정대 탭·대형·마부·정찰가', body: STORY.v25 }); } }
function notes23() { if (!S.flags.v23) { S.flags.v23 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '스킬 레벨·업적·전투 통계', body: STORY.v23 }); } }
function notes22() { if (!S.flags.v22) { S.flags.v22 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '전투와 길드 심사가 바뀌었어요', body: STORY.v22 }); } }
// v0.6: 본부 화면 안내 (한 번만)
function notes6() { if (!S.flags.v06) { S.flags.v06 = 1; S.modals.push({ title: 'v0.6 업데이트', body: STORY.v06 }); } }
function resetGame() { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} S = null; }
