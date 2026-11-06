/* ───────── 새 게임과 저장 이전 ───────── */
const g$ = n => Math.round(n).toLocaleString('ko-KR') + 'G';
const WEAPON_OF = { warrior: 'sword', archer: 'bow', mage: 'staff', cleric: 'mace', rogue: 'dagger', porter: 'club',
  gladiator: 'sword', champion: 'sword', knight: 'sword', paladin: 'sword', berserker: 'axe', bloodlord: 'axe',
  ranger: 'bow', dragoon: 'lance', sniper: 'bow', hawkeye: 'bow', bard: 'lute', maestro: 'lute', coachman: 'club', caravanmaster: 'axe', scout: 'bow', pathfinder: 'bow', mhunter: 'bow', dslayer: 'bow', huntsman: 'bow', kaijuhunter: 'bow', sorcerer: 'staff', archmage: 'staff', elemancer: 'staff', alchemist: 'staff',
  assassin: 'dagger', shadowlord: 'dagger', duelist: 'sword', bladedancer: 'sword', treasure: 'dagger', masterthief: 'dagger',
  elementalist: 'staff', elementlord: 'staff', necromancer: 'staff', lich: 'staff', spellblade: 'sword', arcblade: 'sword',
  priest: 'staff', archbishop: 'staff', plaguedoc: 'mace', physician: 'mace', exorcist: 'mace', inquisitor: 'mace' };
const newField = () => ({ best: 0, cleared: false, found: false, boss: {} });

function blankState(company) {
  return {
    v: SAVE_V, seq: 1, t: 0, lastSeen: Date.now(),
    company: (company || '').trim().slice(0, 12) || '등불 상단',
    gold: 1000, fame: 0, rank: 0, unlocked: [],
    inv: { pot_s: 6, mp_s: 2, herb: 6 },
    advs: [], parties: [], gear: [], pets: [], pen: { inc: [] },
    fields: Object.fromEntries(ALL_FIELDS.map(f => [f, newField()])),
    cands: [], reqs: [], bless: null, autoTreat: true,
    shop: { slots: [] }, sold: { day: -1, n: 0, g: 0 },
    bld: { shop: 1, inn: 1, alchemy: 0, training: 0, smithy: 0, bank: 0, tower: 0, temple: 0, pen: 0, stable: 0, library: 0, airfield: 0, kitchen: 0, salvage: 0 },
    stable: { horses: {} }, league: null, presets: [], wx: { seed: Math.floor(Math.random() * 1e9) },
    settleDay: MONTH_DAYS,
    bank: { offers: [], deps: [], loans: [] },
    research: { lv: {}, cur: null },
    spons: {},
    log: [], modals: [], flags: { v02: 1, v03: 1, v04: 1, v05: 1, v06: 1, v07: 1, bview: 1, v31: 1, v34: 1, v36: 1, v37: 1, v38: 1, v39: 1, v40: 1, v41: 1, v42: 1, v43: 1, v44: 1, v45: 1 }, speed: 1,
    relics: [], raid: null, king: { favor: {}, visit: null, next: 4 },
    stats: { earned: 0, kills: 0, downs: 0, wipes: 0, trips: 0, sales: 0, reqs: 0, soldG: 0, dungeons: 0 },
    view: null
  };
}
function newParty(name, members) {
  return { id: nid(), name, members, sup: { pot_s: 3 }, auto: true, safe: true, repeat: false, dest: 'plains', exp: null, last: null, wagon: null, horse: null, wagonPlus: 0, dmode: 'ask', campNight: true, start: 1, pet: null };
}
function starterGear(a) { a.eq.weapon = makeGear(WEAPON_OF[a.cls], 0, 0); const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp; }
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
  if (!SPEEDS.includes(S.speed)) S.speed = 1;
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
  if (!SPEEDS.includes(S.speed)) S.speed = S.speed > 1 ? 5 : 1;
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

/* ───────── 여관 손님 ───────── */
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
  const a = makeAdv({ lv });
  if (spn('guild') >= 3) a.salary = Math.round(a.salary * 0.9 / 5) * 5;
  a.fee = a.salary; a.cond = cond;
  if (rnd() < 0.35) { const t = Math.max(0, GTIERS.reduce((m, T, i) => (a.lv >= T.lv ? i : m), 0) - 1); a.eq.weapon = makeGear(WEAPON_OF[a.cls], t, 0); }
  const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp;
  return a;
}
function rollCands() {
  S.cands = [];
  const n = 3 + (spn('guild') >= 3 ? 1 : 0);
  for (let i = 0; i < n; i++) S.cands.push(makeCand());
  if (!living().length) {
    const a = makeAdv({ cls: pickOne(['warrior', 'archer', 'cleric']), lv: 1, bio: '모험가 길드가 보낸 견습생. 계약금 없이 일하겠다고 한다.' });
    a.fee = 0; a.salary = 60; starterGear(a); S.cands.unshift(a);
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
  if (regularParties().length >= partyMax()) return partyMax() >= PARTY_MAX[PARTY_MAX.length - 1] ? `파티는 ${partyMax()}개까지예요. 레이드 전용 파티는 원정대 창의 레이드 탭에서 꾸려요.` : `지금 상단 랭크에서는 파티를 ${partyMax()}개까지 만들 수 있어요.`;
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
  S.gear.splice(i, 1);
  if (a.eq[slot]) S.gear.push(a.eq[slot]);
  a.eq[slot] = g; if (isAmmo(g)) g.n = null;   // 상단에서 끼우면 가득
  clampVitals(a); changed();
  return '';
}
function unequip(aid, slot) {
  const a = advById(aid);
  if (!a || !a.eq[slot]) return '';
  if (a.status !== 'idle') return '원정 중에는 장비를 바꿀 수 없어요.';
  S.gear.push(a.eq[slot]); a.eq[slot] = null;
  clampVitals(a); changed();
  return '';
}
const gearScore = g => (g ? g.t * 10 + g.q * 3.5 + (g.plus || 0) * 0.8 : -1);
/* ───────── 장비 강화 (+1 ~ +10) ───────── */
const PLUS_MAX = 10;
const PLUS_RATE = [1, 1, 1, 0.85, 0.8, 0.75, 0.65, 0.6, 0.5, 0.45];   // 지금 +n에서 +n+1 성공 확률
function plusNeed(g) {   // 다음 단계 재료: +1~+3 증표 2, +4~+6 핵 1, +7~+9 혼 1, +10 혼 2
  const n = (g.plus || 0) + 1, t = g.t, need = {};
  if (n <= 3) need['crest_' + t] = 2; else if (n <= 6) need['core_' + t] = 1; else if (n <= 9) need['soul_' + t] = 1; else need['soul_' + t] = 2;
  return need;
}
const plusFee = g => Math.round(recipeFee(g.t) * (1 + (g.plus || 0)) * 1.2 * (1 - relic('smith')) / 10) * 10;
const plusRate = g => Math.min(1, PLUS_RATE[g.plus || 0] + (spn('dwarves') >= 2 ? 0.05 : 0));
function gearsAll() {   // 창고 + 끼고 있는 장비 (owner 표시)
  const out = S.gear.map(g => ({ g, owner: null }));
  S.advs.forEach(a => SLOTS.forEach(([sl]) => { if (a.eq[sl]) out.push({ g: a.eq[sl], owner: a }); }));
  return out;
}
const gearAnyById = id => { const r = gearsAll().find(x => x.g.id === id); return r || null; };
function plusWhy(g) {
  if (!g) return '장비를 고르세요';
  if (isAmmo(g)) return '화살·표창은 강화할 수 없어요';
  if (!S.bld.smithy) return '대장간이 필요해요';
  if ((g.plus || 0) >= PLUS_MAX) return '최고 강화예요';
  const need = plusNeed(g), lack = Object.entries(need).find(([k, n]) => (S.inv[k] || 0) < n);
  if (lack) return `${ITEMS[lack[0]].name} ${lack[1]}개 필요 (창고 ${S.inv[lack[0]] || 0})`;
  if (S.gold < plusFee(g)) return '돈이 모자라요';
  return '';
}
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
function enhance(id) {
  const r = gearAnyById(id); if (!r) return '그 장비가 없어요.';
  const g = r.g, why = plusWhy(g); if (why) return why + '.';
  const need = plusNeed(g), fee = plusFee(g), rate = plusRate(g);
  Object.entries(need).forEach(([k, n]) => addTo(S.inv, k, -n)); S.gold -= fee; S.stats.spent = (S.stats.spent || 0) + fee;
  if (rnd() < rate) {
    g.plus = (g.plus || 0) + 1;
    log(`${gearName(g)} 강화 성공! (${Math.round(rate * 100)}%)`, 'good');
    if (r.owner) clampVitals(r.owner);
    changed();
    return `성공! ${gearName(g)}`;
  }
  log(`${gearName(g)} +${(g.plus || 0) + 1} 강화 실패… 재료와 돈을 잃었다 (${Math.round(rate * 100)}%).`, 'bad');
  changed();
  return `실패… ${gearName(g)}은(는) 그대로예요.`;
}
// 대장간: 화살·표창은 재료 없이 돈으로도 산다 (대장간이 만들 수 있는 단계까지)
function buyAmmoWhy(base, t) {
  if (!GTYPES[base] || !GTYPES[base].ammo) return '화살·표창만 살 수 있어요';
  if (!S.bld.smithy) return '대장간이 필요해요';
  if (!GTIERS[t] || S.bld.smithy < GTIERS[t].smith) return `대장간 Lv${GTIERS[t] ? GTIERS[t].smith : '?'}부터`;
  if (S.gold < ammoPrice(base, t)) return `${fmt(ammoPrice(base, t))}G가 필요해요`;
  return '';
}
function buyAmmo(base, t) {
  const why = buyAmmoWhy(base, t); if (why) return why + '.';
  const fee = ammoPrice(base, t), g = makeGear(base, t, 0);
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
const canSmith = (base, t, q = 0) => S.bld.smithy >= smithLv(t, q) && Object.entries(smithNeed(base, t, q)).every(([k, n]) => (S.inv[k] || 0) >= n) && S.gold >= smithFee(t, q);
function smith(base, t, q = 0) {
  if (S.bld.smithy < smithLv(t, q)) return `대장간 Lv${smithLv(t, q)}이 있어야 해요.`;
  if (!canSmith(base, t, q)) return '재료나 돈이 모자라요.';
  Object.entries(smithNeed(base, t, q)).forEach(([k, n]) => addTo(S.inv, k, -n));
  S.gold -= smithFee(t, q);
  const g = makeGear(base, t, q >= 3 ? q : rollQuality(0.03 * S.bld.smithy + (relic('smith') ? 0.05 : 0)));
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
const RUNE_OUT = [100, 400, 1500];   // 룬을 빼는 값 (빼낸 룬은 창고로)
function runeIn(gid, rid) {
  const f = findGear(gid);
  if (!f) return '장비를 찾을 수 없어요.';
  if (f.a && f.a.status !== 'idle') return '원정 중인 모험가의 장비예요.';
  const g = f.g; g.runes = g.runes || [];
  if (!runeSlots(g)) return '일반 장비에는 룬 칸이 없어요. 고급부터 등급마다 한 칸씩 열려요.';
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
  S.gold -= fee; f.g.runes.splice(i, 1); addTo(S.inv, rid, 1);
  if (f.a) clampVitals(f.a);
  changed();
  return '';
}
// 마탑: 같은 룬 셋을 합쳐 한 단계 위로, 우두머리의 증표 둘로 하급 룬 새기기
function runeFuse(rid) {
  const R = ITEMS[rid] && ITEMS[rid].rune;
  if (!S.bld.tower) return '마탑이 필요해요.';
  if (!R || R[1] >= 2) return '더 합칠 수 없는 룬이에요.';
  if ((S.inv[rid] || 0) < RUNE_FUSE.n) return `같은 룬이 ${RUNE_FUSE.n}개 있어야 해요.`;
  const fee = RUNE_FUSE.fee[R[1]];
  if (S.gold < fee) return '돈이 모자라요.';
  S.gold -= fee; addTo(S.inv, rid, -RUNE_FUSE.n);
  const out = runeId(R[0], R[1] + 1); addTo(S.inv, out, 1);
  log(`마탑에서 룬을 합쳐 ${ITEMS[out].name}을(를) 만들었다.`, 'good');
  changed();
  return '';
}
function runeCarve(t) {
  if (!S.bld.tower) return '마탑이 필요해요.';
  const k = 'crest_' + t;
  if ((S.inv[k] || 0) < RUNE_CARVE.crest) return `${ITEMS[k].name} ${RUNE_CARVE.crest}개가 필요해요.`;
  if (S.gold < RUNE_CARVE.fee) return '돈이 모자라요.';
  S.gold -= RUNE_CARVE.fee; addTo(S.inv, k, -RUNE_CARVE.crest);
  const out = runeId(pickOne(RUNE_IDS), 0); addTo(S.inv, out, 1);
  log(`마탑에서 ${ITEMS[k].name}에 ${ITEMS[out].name}을(를) 새겼다.`, 'good');
  changed();
  return out;
}

/* ───────── 스킬과 훈련 ───────── */
function learnSkill(aid, sid) {
  const a = advById(aid), s = SKILLS[sid];
  if (!S.bld.training) return '훈련소가 있어야 스킬을 배울 수 있어요.';
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 배울 수 있어요.';
  if (a.skills.includes(sid)) return '이미 배운 스킬이에요.';
  if (s.tier && jobTier(a.cls) < s.tier) return `${s.name}은(는) ${s.tier}차 전직 후에 배울 수 있어요.`;
  if (!canLearn(a, sid)) return `${s.name}은(는) ${s.cls.includes('all') ? '' : s.cls.map(c => CLASSES[c] ? CLASSES[c].name : c).join('·') + ' '}Lv${s.lv} 이상만 배울 수 있어요.`;
  if (a.skills.length >= skillSlots(a)) { const nx = SKILL_SLOT_LV.find(l => a.lv < l); return `스킬 칸 ${skillSlots(a)}개가 꽉 찼어요. 하나를 잊거나${nx ? ` Lv${nx}에 칸이 늘어나면` : ''} 배울 수 있어요.`; }
  if (!s.own && !((S.inv['book_' + sid] || 0) > 0)) return '스킬북이 없어요.';
  const fee = s.own ? ownFee(s) : s.lv * 30;
  if (S.gold < fee) return '수업료가 모자라요.';
  if (!s.own) addTo(S.inv, 'book_' + sid, -1);
  S.gold -= fee;
  a.skills.push(sid); clampVitals(a);
  log(`${a.name}이(가) 스킬 「${s.name}」을(를) 배웠다.`, 'good');
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
function buyWagon(pid, w) {
  const p = S.parties.find(x => x.id === pid), W = WAGONS[w];
  if (!p || !W) return '';
  if (p.exp) return '원정 중에는 마차를 바꿀 수 없어요.';
  if (!wagonOpen(w)) return wagonOpenWhy(w) + '.';
  if (p.wagon === w) return '이미 이 마차를 쓰고 있어요.';
  const back = wagonBack(p);
  if (S.gold + back < W.cost) return '돈이 모자라요.';
  S.gold += back - W.cost; S.stats.spent = (S.stats.spent || 0) + W.cost;
  log(`${p.name}에게 ${W.name}을(를) 마련했다.${back ? ` 쓰던 ${rigName(p)}은(는) ${g$(back)}에 넘겼다.` : ''}`, 'good');
  p.wagon = w; p.wagonPlus = 0;
  if (!W.horse && p.horse) unhitch(p);
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
function slotPrice(s) { return (isGearKey(s.item) ? (gearsOfKey(s.item)[0] ? gearValue(gearsOfKey(s.item)[0]) : 0) * TIERS[s.tier].m : ITEMS[s.item].v * TIERS[s.tier].m) * (1 + relic('price') + Math.max(0, S.bld.shop - 5) * 0.02); }
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
  }
}
const buyPrice = it => Math.round(ITEMS[it].buy * (spn('clinic') >= 1 ? 0.8 : 1));
function buy(it, q) {
  const cost = buyPrice(it) * q;
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; addTo(S.inv, it, q);
  changed();
  return '';
}
const craftFee = r => Math.round(r.fee * (1 - Math.max(0, S.bld.alchemy - 2) * 0.1));
const canCraft = r => S.bld.alchemy >= r.lv && Object.entries(r.need).every(([k, q]) => (S.inv[k] || 0) >= q) && S.gold >= craftFee(r);
function craft(i) {
  const r = RECIPES[i];
  if (S.bld.alchemy < r.lv) return r.lv > 1 ? '연금술 공방을 넓혀야 해요.' : '연금술 공방이 필요해요.';
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
  const cost = B.cost[lv];
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; S.bld[bid] = lv + 1;
  if (bid === 'bank' && lv === 0) bankRoll();
  if (bid === 'temple' && lv === 0) { blessRoll(); queueModal({ title: '신전', body: STORY.temple.concat([`이번 달에는 「${BLESSINGS[S.bless.id].name}」: ${BLESSINGS[S.bless.id].desc}`]) }); }
  if (bid === 'airfield' && lv === 0) queueModal({ title: '비행장', body: S.fields.roots && S.fields.roots.cleared ? STORY.skyOpen : STORY.airfield });
  if (bid === 'stable' && lv === 0) queueModal({ title: '마구간', body: STORY.stable });
  if (bid === 'library' && lv === 0) queueModal({ title: '도서관', body: STORY.library });
  if (bid === 'kitchen' && lv === 0) queueModal({ title: '주방', body: STORY.kitchen });
  if (bid === 'salvage' && lv === 0) queueModal({ title: '던전 수거소', body: STORY.salvage });
  log(`${B.name}을(를) ${lv ? 'Lv' + (lv + 1) + '로 넓혔다' : '지었다'}.`, 'good');
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
    const t = ri(0, maxGearTier()), base = dropBase(), v = gearValue({ base, t, q: 0 });
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
const reqName = r => (r.gear ? `${GTIERS[+r.gear.split(':')[1]].name} ${GTYPES[r.gear.split(':')[0]].name}` : ITEMS[r.item].name);
// 장비 의뢰에 내줄 것: 가장 싼 것부터 (등급 낮고, 강화·룬 없는 것)
const reqGearPick = r => gearsOfKey('g:' + r.gear).slice().sort((a, b) => ((a.q || 0) - (b.q || 0)) || ((a.plus || 0) - (b.plus || 0)) || ((a.runes || []).length - (b.runes || []).length))[0];
const reqGearCheap = g => !!g && (g.q || 0) <= 1 && !(g.plus || 0) && !(g.runes || []).length;
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

/* ───────── 은행 ───────── */
const bankCap = () => S.bld.bank * 2 + 1;
function bankRoll() {
  if (!S.bld.bank) return;
  const lv = S.bld.bank;
  S.bank.offers = S.bank.offers.filter(o => o.until >= today());
  while (S.bank.offers.length < 2 + lv) {
    const scale = 0.7 + lv * 0.3;
    if (rnd() < 0.5) {
      S.bank.offers.push({ id: nid(), type: 'dep', who: pickOne(BANK.depositors), amount: Math.round((300 + S.fame * 10 + rnd() * 900) * scale / 50) * 50, rate: ri(3, 7), days: ri(12, 24), until: today() + 3 });
    } else {
      const b = pickOne(BANK.borrowers), G = BANK.grades[b.grade];
      S.bank.offers.push({ id: nid(), type: 'loan', who: b.name, grade: b.grade, amount: Math.round((400 + S.fame * 12 + rnd() * 1500) * scale / 50) * 50, rate: ri(G.rate[0], G.rate[1]), days: ri(6, 14), until: today() + 3 });
    }
  }
}
function bankAccept(oid) {
  const o = S.bank.offers.find(x => x.id === oid);
  if (!o) return '';
  if (S.bank.deps.length + S.bank.loans.length >= bankCap()) return '은행이 맡을 수 있는 거래가 꽉 찼어요. 은행을 넓혀 주세요.';
  const due = today() + o.days;
  if (o.type === 'dep') {
    S.gold += o.amount;
    S.bank.deps.push({ id: o.id, who: o.who, amount: o.amount, rate: o.rate, due, told: false });
    log(`${o.who}의 예금 ${g$(o.amount)}을 맡았다. ${dayLabel(due)}까지 이자 ${o.rate}%를 붙여 돌려줘야 한다.`);
  } else {
    if (S.gold < o.amount) return '빌려줄 돈이 모자라요.';
    S.gold -= o.amount;
    S.bank.loans.push({ id: o.id, who: o.who, grade: o.grade, amount: o.amount, rate: o.rate, due });
    log(`${o.who}에게 ${g$(o.amount)}을 빌려줬다. ${dayLabel(due)}에 이자 ${o.rate}%와 함께 받는다.`);
  }
  S.bank.offers = S.bank.offers.filter(x => x !== o);
  changed();
  return '';
}
function bankDay(k) {
  for (const d of S.bank.deps) {
    const owed = Math.round(d.amount * (1 + d.rate / 100));
    if (!d.told && d.due - k <= 3) { d.told = true; log(`${d.who}이(가) ${dayLabel(d.due)}에 예금 ${g$(owed)}을 찾으러 오겠다고 연락했다.`); HOOKS.toast(`${d.who}: ${dayLabel(d.due)}에 ${g$(owed)} 찾으러 옴`); }
    if (d.due <= k) {
      if (S.gold >= owed) { S.gold -= owed; log(`${d.who}에게 예금과 이자 ${g$(owed)}을 돌려줬다.`); }
      else {
        const paid = S.gold; S.gold = 0; S.fame = Math.max(0, S.fame - 8);
        log(`${d.who}에게 예금을 다 돌려주지 못했다(${g$(paid)} / ${g$(owed)}). 소문이 나서 명성 -8`, 'bad');
        queueModal({ title: '예금 지급 실패', body: [`${d.who}이(가) 맡긴 돈을 찾으러 왔지만 ${g$(owed)} 중 ${g$(paid)}밖에 돌려주지 못했다.`, '은행에 대한 소문이 나빠져 명성이 8 떨어졌다. 예금을 받을 때는 찾으러 오는 날을 꼭 챙기자.'] });
      }
    }
  }
  S.bank.deps = S.bank.deps.filter(d => d.due > k);
  for (const l of S.bank.loans.filter(x => x.due <= k)) {
    if (rnd() < BANK.grades[l.grade].risk) log(`${l.who}이(가) 빌린 ${g$(l.amount)}을 갚지 못하고 자취를 감췄다.`, 'bad');
    else { const back = Math.round(l.amount * (1 + l.rate / 100)); S.gold += back; S.stats.earned += back - l.amount; log(`${l.who}이(가) ${g$(back)}을 갚았다. (이자 ${g$(back - l.amount)})`, 'good'); }
  }
  S.bank.loans = S.bank.loans.filter(x => x.due > k);
  if (k % 2 === 0) bankRoll();
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
  a.salary = Math.round(a.salary * 1.2 / 5) * 5;
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
function checkUnlocks() { S.flags.job2 = 1; S.flags.job3 = 1; if (S.parties && (S.rank || 0) >= RAID_PARTY_RANK) raidPartyEnsure(); }
function promoWhy(a, cls) {
  const t = jobTier(cls), Q = JOB_REQ[t];
  const R = CLASSES[cls].req || {};
  if (!S.bld.training) return '훈련소가 필요해요';
  if (a.lv < Math.max(Q.lv, R.lv || 0)) return `Lv${Math.max(Q.lv, R.lv || 0)}부터`;
  const rw = jobReqWhy(a, cls); if (rw) return rw;
  if ((a.rank || 0) < Q.rank) return `${LICENSE[Q.rank].name} 라이선스 필요`;
  if (a.status !== 'idle' || a.inj) return '상단에서 쉬고 있을 때만';
  if (S.gold < Q.fee) return '돈이 모자라요';
  return '';
}
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
  if (C1.req && C1.req.item) addTo(S.inv, C1.req.item[0], -C1.req.item[1]);   // 전직 재료(피눈물 등)
  STAT_KEYS.forEach(k => { a.st[k] += Math.max(0, C1.base[k] - C0.base[k]) + 1; });
  a.cls = cls;
  const jt = jobTraitOf(cls); if (jt) { a.traits = (a.traits || []).filter(t => !(TRAITS[t] && TRAITS[t].job && jobTier(TRAITS[t].job) === jobTier(cls))); a.traits.push(jt); }   // 직업 특성
  a.skills = [C1.innate, ...a.skills.filter(id => id !== C1.innate)].slice(0, skillSlots(a));
  if (a.post && !isHealer(cls)) a.post = null;
  SLOTS.forEach(([sl]) => { const g = a.eq[sl]; if (g && !gearFits(a, g)) { S.gear.push(g); a.eq[sl] = null; } });
  if (needsArrows(a) && !a.eq.ammo) { a.eq.ammo = makeGear('arrows', arrowTierOf(a.lv), 0); log(`${a.name}이(가) 활을 쏘게 되어 화살을 받았다.`); }
  if (!needsArrows(a) && a.eq.ammo) { S.gear.push(a.eq.ammo); a.eq.ammo = null; }   // 창을 드는 용기병처럼 활을 안 쏘면 화살은 창고로   // 정찰가처럼 새로 활을 쏘는 직업
  if (!a.eq.weapon) a.eq.weapon = makeGear(WEAPON_OF[cls], wasT, 0);   // 길드가 새 직업에 맞는 무기를 준다
  a.salary = Math.round(a.salary * 1.3 / 5) * 5;
  clampVitals(a);
  log(`${a.name}이(가) ${C0.name}에서 ${C1.name}(으)로 전직했다!`, 'good');
  queueModal({ title: `${jobTier(cls)}차 전직 · ${C1.name}`, adv: a.id, body: [`${a.name}이(가) 훈련소에서 ${C1.name}(으)로 다시 태어났다.`, C1.desc, `기본 스킬 「${SKILLS[C1.innate].name}」을(를) 익혔고, 배워 둔 스킬은 그대로 남았다. 새 직업에 맞지 않는 장비는 창고로 옮겼다.`].concat(jt ? [`직업 특성 「${TRAITS[jt].name}」(${TRAITS[jt].desc})이 생겼다. 직업 특성은 마법사의 돌로 바꿀 수 없다.`] : []) });
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
  const R = RAIDS[id], max = raidHp(R.lv);
  const rv = RIVALS.slice().sort(() => rnd() - 0.5).slice(0, 5).map(r => ({ n: r.name, c: r.c, pw: 0.5 + rnd() * 0.9, d: 0 }));
  return { id, max, hp: max, me: 0, rivals: rv, done: 0, rank: 0 };
}
function raidMonth(fresh) {
  if (S.raid) for (const rec of S.raid.list) if (!rec.done) raidEnd(rec, 'escape');
  const a = pickOne(['kingslime', 'kaishar', 'griffon']), b = pickOne(RAID_IDS.filter(x => x !== a));
  S.raid = { list: [newRaid(a), newRaid(b)], from: today() };
  const names = S.raid.list.map(r => `${RAIDS[r.id].name}(Lv${RAIDS[r.id].lv})`).join('와(과) ');
  log(`이번 달 레이드: ${names}`, 'good');
  if (!fresh) queueModal({ title: '이번 달 레이드', body: [`${names} 레이드가 열렸다.`, '다른 상단과 왕국 원정대가 함께 몬스터를 두드린다. 쓰러뜨리면 피해를 많이 준 순서대로 보상을 받고, 달이 바뀔 때까지 못 쓰러뜨리면 몬스터가 떠나 보상이 절반이 된다.', '원정 창에서 파티의 목적지를 레이드로 고르자.'] });
}
const raidStand = rec => rec.rivals.map(r => ({ n: r.n, d: r.d, c: r.c })).concat([{ n: S.company, d: rec.me, me: 1 }]).sort((x, y) => y.d - x.d);
const raidTier = L => GTIERS.reduce((m, T, i) => (T.lv <= L ? i : m), 0);
function raidReward(rec, i, half) {
  const R = RAIDS[rec.id], W = RAID_REWARD[Math.min(i, RAID_REWARD.length - 1)], k = half ? 0.5 : 1, got = [];
  const gold = Math.round(raidGold(R.lv) * W.gold * k / 10) * 10, fame = Math.round(W.fame * k);
  S.gold += gold; S.stats.earned += gold; S.fame += fame;
  got.push(g$(gold), `명성 +${fame}`);
  const np = Math.max(1, Math.round(W.part * k)); addTo(S.inv, 'rp_' + rec.id, np); got.push(`${ITEMS['rp_' + rec.id].name} ${np}개`);
  if (W.heart && !half) { addTo(S.inv, 'rh_' + rec.id, W.heart); got.push(ITEMS['rh_' + rec.id].name); }
  if (W.gear) { const q = Math.max(2, W.gear - (half ? 1 : 0)), g = makeGear(dropBase(), raidTier(R.lv), q); S.gear.push(g); got.push(`${QUALITY[q].name} ${gearName(g)}`); }
  const rl = W.rune - (half ? 1 : 0);
  if (rl >= 0) { const id = runeId(pickOne(RUNE_IDS), rl); addTo(S.inv, id, 1); got.push(ITEMS[id].name); }
  // 특성 돌: 개화석은 등수별 개수(몬스터가 떠나면 절반), 마법사의 돌은 등수별 낮은 확률
  const ri4 = Math.min(i, 3), bn = STONE_DROP.bloomstone.raidN[ri4], bq = half ? Math.floor(bn / 2) : bn;
  if (bq > 0) { addTo(S.inv, 'bloomstone', bq); got.push(`개화석 ${bq}개`); }
  if (rnd() < STONE_DROP.wizstone.raidP[ri4] * k) { addTo(S.inv, 'wizstone', 1); got.push('마법사의 돌'); }
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
const rent = () => (S.flags.guildDown ? 0 : 300 + 50 * Math.floor(S.fame / 25));
const salaryOf = a => Math.round(a.salary * (1 - mentorCut(a.cls)) / 5) * 5;   // 스승(명예의 전당) 할인
const payroll = () => living().reduce((s, a) => s + salaryOf(a), 0);
function settle() {
  const pm = dateParts(S.t - DAY_SEC).m, lines = [], r = rent();
  if (S.flags.guildDown) lines.push('암살자 길드가 무너져 이제 자릿세는 없다.');
  else if (S.gold >= r) { S.gold -= r; lines.push(`암살자 길드에 자릿세 ${g$(r)}을 냈다.`); }
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
  for (const a of living()) { if (S.gold >= a.salary) { S.gold -= a.salary; n++; sum += a.salary; a.unpaid = 0; } else unpaid.push(a); }
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
  if (!S.flags.guildDown) lines.push(`다음 달 자릿세는 ${g$(rent())}이다.`);
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
  if (S.bld.bank) bankDay(k);
  researchDay(k);
  raidDay();
  kingDay(k);
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
  if (!startExp(p, p.dest && isUnlocked(p.dest) ? p.dest : 'plains') && p.repeatLeft != null) p.repeatLeft--;
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
const SAVE_V = 10;   // 지금 저장 판 (migrate10까지 옮긴 상태)
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
    if (v.v === 1) { migrate(v); migrate3(); migrate4(); notes6(); migrate5(); migrateS(); notesB(); notes22(); notes23(); notes25(); notes28(); notes29(); migrate6(); notes30(); migrate7(); notes31(); notes34(); migrate8(); notes36(); notes37(); migrate9(); migrate10(); notes38(); notes39(); notes40(); notes41(); notes42(); notes43(); notes44(); notes45(); saveGame(); return true; }
    if (typeof v.v !== 'number' || v.v < 2 || v.v > SAVE_V) return false;   // 판을 올릴 때는 SAVE_V만 올린다
    S = v;
    S.modals = S.modals || []; S.flags = S.flags || {}; S.gear = S.gear || []; S.stats = S.stats || {}; S.pets = S.pets || []; S.pen = S.pen || { inc: [] }; S.bld.pen = S.bld.pen || 0;
    S.bank = S.bank || { offers: [], deps: [], loans: [] };
    S.research = S.research || { lv: {}, cur: null }; S.spons = S.spons || {};
    ALL_FIELDS.forEach(f => { S.fields[f] = S.fields[f] || newField(); });
    ['smithy', 'bank', 'tower', 'temple', 'stable', 'library', 'airfield', 'kitchen', 'salvage'].forEach(b => { S.bld[b] = S.bld[b] || 0; });
    S.stable = S.stable || { horses: {} };
    const old = S.v;
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
    notes39();
    notes40();
    notes41();
    notes42();
    notes43();
    notes44();
    notes45();
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
    a.eq.off = makeGear(shieldOf(a.cls), t, 0); if ((S.advs || []).includes(a)) n++;
  });
  S.v = 10;
  if (n) log(`방패가 네 종류(원형·히터·카이트·탑)가 되었다. 방패가 없던 전사·마부 계열 ${n}명에게 방패를 나눠 주었다.`);
}
function notes42() { if (!S.flags.v42) { S.flags.v42 = 1; if (today() > 1 || S.advs.some(a => a.lv > 2)) S.modals.push({ title: '모든 직업 공격 동작 · 스킬 효과', body: STORY.v42 }); } }
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
function migrateS() { delete S.skins; S.advs.forEach(a => { a.sm = a.sm || {}; delete a.skin; if (!a.traits) a.traits = rollTraits(); if (a.hero) { const sk = awkSkillOf(a); if (!a.skills.includes(sk)) a.skills.unshift(sk); } }); (S.cands || []).forEach(c => { if (!c.traits) c.traits = rollTraits(); }); migrateU(); dexMigrate(); S.advs.forEach(a => { chainOf(a.cls).forEach(c => { const jt = jobTraitOf(c); if (jt && !(a.traits || []).includes(jt)) a.traits.push(jt); }); }); S.advs.forEach(a => { SLOTS.forEach(([sl]) => { const g = a.eq[sl]; if (g && !gearFits(a, g)) { S.gear.push(g); a.eq[sl] = null; } }); }); migrateSkillIds(); }
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
