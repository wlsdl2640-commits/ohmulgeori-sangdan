/* ───────── 새 게임과 저장 이전 ───────── */
const g$ = n => Math.round(n).toLocaleString('ko-KR') + 'G';
const WEAPON_OF = { warrior: 'sword', archer: 'bow', mage: 'staff', cleric: 'mace', rogue: 'dagger', porter: 'club' };

function blankState(company) {
  return {
    v: 2, seq: 1, t: 0, lastSeen: Date.now(),
    company: (company || '').trim().slice(0, 12) || '등불 상단',
    gold: 1000, fame: 0,
    inv: { pot_s: 6, mp_s: 2 },
    advs: [], graves: [], parties: [], gear: [],
    fields: Object.fromEntries(ALL_FIELDS.map(f => [f, { best: 0, cleared: false }])),
    cands: [], reqs: [], heroQueue: [],
    shop: { slots: [] }, sold: { day: -1, n: 0, g: 0 },
    bld: { shop: 1, inn: 1, alchemy: 0, training: 0, smithy: 0, bank: 0, tower: 0 },
    settleDay: MONTH_DAYS,
    bank: { offers: [], deps: [], loans: [] },
    research: { lv: {}, cur: null },
    spons: {},
    log: [], modals: [], flags: { v02: 1 },
    stats: { earned: 0, kills: 0, deaths: 0, trips: 0, sales: 0 },
    view: null
  };
}
function newParty(name, members) {
  return { id: nid(), name, members, sup: { pot_s: 3 }, auto: true, safe: true, repeat: false, dest: 'plains', exp: null, last: null };
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
  log(`${S.company}이(가) ${WORLD.street} 입구에 문을 열었다.`);
  queueModal({ title: '검은 두건의 손님', body: STORY.assassin });
}
function migrate(v) {
  const s = blankState(v.company);
  S = s;
  Object.assign(s, { seq: v.seq || 1, t: v.t || 0, lastSeen: v.lastSeen || Date.now(), gold: v.gold || 0, fame: v.fame || 0, inv: v.inv || {},
    graves: v.graves || [], log: v.log || [], settleDay: v.settleDay || MONTH_DAYS, heroQueue: v.heroQueue || [], view: v.view, shop: v.shop || { slots: [] } });
  Object.assign(s.stats, v.stats || {});
  Object.assign(s.flags, v.flags || {}, { v02: 0 });
  Object.assign(s.bld, v.bld || {});
  for (const f of Object.keys(v.fields || {})) if (s.fields[f]) s.fields[f] = v.fields[f];
  // 모험가는 지금 레벨에 맞춰 능력치를 새로 만든다
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

/* ───────── 여관 손님 ───────── */
function giftPool() {
  const out = [];
  FIELD_IDS.filter(isUnlocked).forEach(fid => FIELDS[fid].mons.forEach(mid => MONS[mid].drops.forEach(([it]) => { if (!out.includes(it)) out.push(it); })));
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
function syncHeroes() {
  for (const fid of S.heroQueue) {
    if (S.cands.some(c => c.heroOf === fid)) continue;
    const H = HEROES[fid];
    const a = makeAdv({ cls: H.cls, lv: H.lv, name: H.name, bio: H.bio, hero: true });
    a.salary = Math.round(a.salary * 1.2 / 5) * 5; a.fee = 0; a.heroOf = fid;
    a.cond = { type: 'fame', min: H.fame };
    starterGear(a);
    S.cands.unshift(a);
  }
}
function rollCands() {
  S.cands = S.cands.filter(c => c.heroOf);
  const n = 3 + (spn('guild') >= 3 ? 1 : 0);
  for (let i = 0; i < n; i++) S.cands.push(makeCand());
  if (!living().length) {
    const a = makeAdv({ cls: pickOne(['warrior', 'archer', 'cleric']), lv: 1, bio: '모험가 길드가 보낸 견습생. 계약금 없이 일하겠다고 한다.' });
    a.fee = 0; a.salary = 60; starterGear(a); S.cands.unshift(a);
  }
  syncHeroes();
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
  if (c.heroOf) S.heroQueue = S.heroQueue.filter(f => f !== c.heroOf);
  const a = Object.assign({}, c);
  delete a.fee; delete a.cond; delete a.heroOf;
  a.status = 'idle';
  S.advs.push(a);
  log(`${a.name}(${CLASSES[a.cls].name}, Lv${a.lv})을(를) 고용했다.`, 'good');
  changed();
  return '';
}
function fire(id) {
  const a = advById(id);
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 내보낼 수 있어요.';
  leave(a, '상단을 떠났다.');
  changed();
  return '';
}

/* ───────── 파티 ───────── */
function createParty() {
  if (S.parties.length >= MAX_PARTIES) return `파티는 ${MAX_PARTIES}개까지 만들 수 있어요.`;
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
  if (!p || p.exp) return;
  S.parties = S.parties.filter(x => x !== p);
  if (S.view === pid) S.view = S.parties[0] ? S.parties[0].id : null;
  changed();
}
function toggleMember(pid, aid) {
  const p = S.parties.find(x => x.id === pid), a = advById(aid);
  if (!p || !a || p.exp || a.status !== 'idle') return;
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
  if (!gearFits(a, g)) return `${a.name}은(는) 이 장비를 쓸 수 없어요.`;
  const slot = GTYPES[g.base].slot;
  S.gear.splice(i, 1);
  if (a.eq[slot]) S.gear.push(a.eq[slot]);
  a.eq[slot] = g;
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
const gearScore = g => (g ? g.t * 10 + g.q * 3.5 : -1);
function autoEquip(aid) {
  const a = advById(aid);
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 장비를 바꿀 수 있어요.';
  let n = 0;
  for (const [slot] of SLOTS) {
    const best = S.gear.filter(g => GTYPES[g.base].slot === slot && gearFits(a, g)).sort((x, y) => gearScore(y) - gearScore(x))[0];
    if (best && gearScore(best) > gearScore(a.eq[slot])) { equip(aid, best.id); n++; }
  }
  return n ? '' : '더 좋은 장비가 없어요.';
}
function sellGear(gid) {
  const i = S.gear.findIndex(g => g.id === gid);
  if (i < 0) return;
  const g = S.gear[i], price = Math.round(gearValue(g) * GEAR_SELL);
  S.gear.splice(i, 1); S.gold += price; S.stats.earned += price;
  HOOKS.toast(`${gearName(g)}을(를) ${g$(price)}에 팔았다`);
  changed();
}
const smithFee = t => Math.round(recipeFee(t) * (spn('dwarves') >= 1 ? 0.7 : 1));
const canSmith = (base, t) => S.bld.smithy >= GTIERS[t].smith && Object.entries(recipeNeed(base, t)).every(([k, q]) => (S.inv[k] || 0) >= q) && S.gold >= smithFee(t);
function smith(base, t) {
  if (S.bld.smithy < GTIERS[t].smith) return '대장간을 더 넓혀야 해요.';
  if (!canSmith(base, t)) return '재료나 돈이 모자라요.';
  Object.entries(recipeNeed(base, t)).forEach(([k, q]) => addTo(S.inv, k, -q));
  S.gold -= smithFee(t);
  const g = makeGear(base, t, rollQuality(0.03 * S.bld.smithy));
  S.gear.push(g);
  log(`대장간에서 ${QUALITY[g.q].name} 「${gearName(g)}」을(를) 만들었다.`, g.q ? 'good' : '');
  changed();
  return g;
}

/* ───────── 스킬과 훈련 ───────── */
function learnSkill(aid, sid) {
  const a = advById(aid), s = SKILLS[sid];
  if (!S.bld.training) return '훈련소가 있어야 스킬을 배울 수 있어요.';
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 배울 수 있어요.';
  if (a.skills.includes(sid)) return '이미 배운 스킬이에요.';
  if (!canLearn(a, sid)) return `${s.name}은(는) ${s.cls.includes('all') ? '' : s.cls.map(c => CLASSES[c].name).join('·') + ' '}Lv${s.lv} 이상만 배울 수 있어요.`;
  if (a.skills.length >= MAX_SKILLS) return `스킬은 ${MAX_SKILLS}개까지예요. 하나를 잊어야 배울 수 있어요.`;
  if (!((S.inv['book_' + sid] || 0) > 0)) return '스킬북이 없어요.';
  const fee = s.lv * 30;
  if (S.gold < fee) return '수업료가 모자라요.';
  addTo(S.inv, 'book_' + sid, -1); S.gold -= fee;
  a.skills.push(sid); clampVitals(a);
  log(`${a.name}이(가) 스킬 「${s.name}」을(를) 배웠다.`, 'good');
  changed();
  return '';
}
function forgetSkill(aid, sid) {
  const a = advById(aid);
  if (!a || sid === CLASSES[a.cls].innate) return;
  a.skills = a.skills.filter(x => x !== sid);
  clampVitals(a); changed();
}
const trainedTotal = a => Object.values(a.tr).reduce((s, v) => s + v, 0);
const trainCap = a => a.lv * 2;
const trainCost = a => Math.round((60 + 30 * trainedTotal(a)) * (1 + a.lv / 20) / 5) * 5;
function trainStat(aid, k) {
  const a = advById(aid);
  if (!S.bld.training) return '훈련소가 필요해요.';
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 훈련할 수 있어요.';
  if (trainedTotal(a) >= trainCap(a)) return `지금 레벨에서는 ${trainCap(a)}번까지 훈련할 수 있어요. 레벨을 올리세요.`;
  if (S.gold < trainCost(a)) return '훈련비가 모자라요.';
  S.gold -= trainCost(a); a.tr[k]++;
  changed();
  return '';
}

/* ───────── 판매·구매·제작 ───────── */
const guildRate = () => GUILD_RATE + (spn('guild') >= 1 ? 0.1 : 0);
function sellGuild(it, q) {
  q = Math.min(q, S.inv[it] || 0);
  if (q <= 0) return;
  const g = Math.round(ITEMS[it].v * guildRate() * q);
  addTo(S.inv, it, -q); S.gold += g; S.stats.earned += g;
  HOOKS.toast(`${ITEMS[it].name} ${q}개를 ${g$(g)}에 팔았다`);
  changed();
}
const slotCount = () => S.bld.shop + 2;
const isGearKey = k => typeof k === 'string' && k.startsWith('g:');
function gearsOfKey(k) { const [, b, t] = k.split(':'); return S.gear.filter(g => g.base === b && g.t === +t).sort((x, y) => x.q - y.q); }
const stockOf = k => (isGearKey(k) ? gearsOfKey(k).length : S.inv[k] || 0);
function slotPrice(s) { return isGearKey(s.item) ? (gearsOfKey(s.item)[0] ? gearValue(gearsOfKey(s.item)[0]) : 0) * TIERS[s.tier].m : ITEMS[s.item].v * TIERS[s.tier].m; }
function setSlot(i, it, tier) {
  while (S.shop.slots.length < slotCount()) S.shop.slots.push(null);
  S.shop.slots[i] = it ? { item: it, tier: tier || 0, tm: 0 } : null;
  changed();
}
const traffic = () => (1 + S.fame / 150) * (1 + 0.1 * (S.bld.shop - 1)) * (1 + (spn('citizens') >= 1 ? 0.15 : 0) + (spn('citizens') >= 3 ? 0.15 : 0)) * (S.flags.guildDown ? 1.2 : 1);
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
    S.gold += g; S.stats.earned += g; S.stats.sales++;
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
const canCraft = r => S.bld.alchemy >= r.lv && Object.entries(r.need).every(([k, q]) => (S.inv[k] || 0) >= q) && S.gold >= r.fee;
function craft(i) {
  const r = RECIPES[i];
  if (S.bld.alchemy < r.lv) return r.lv > 1 ? '연금술 공방을 넓혀야 해요.' : '연금술 공방이 필요해요.';
  if (!canCraft(r)) return '재료나 돈이 모자라요.';
  Object.entries(r.need).forEach(([k, q]) => addTo(S.inv, k, -q));
  S.gold -= r.fee; addTo(S.inv, r.out, 1);
  changed();
  return '';
}
function upgrade(bid) {
  const B = BUILDINGS[bid], lv = S.bld[bid];
  if (lv >= B.max) return '더 올릴 수 없어요.';
  const cost = B.cost[lv];
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; S.bld[bid] = lv + 1;
  if (bid === 'bank' && lv === 0) bankRoll();
  log(`${B.name}을(를) ${lv ? 'Lv' + (lv + 1) + '로 넓혔다' : '지었다'}.`, 'good');
  changed();
  return '';
}

/* ───────── 의뢰 ───────── */
function maxGearTier() { let m = 0; GTIERS.forEach((T, i) => { if (S.bld.smithy >= T.smith && isUnlocked(FIELD_IDS[i])) m = i; }); return m; }
function genReq() {
  if (S.reqs.length >= 4) return;
  const special = (Object.values(S.spons).some(v => v >= 2) && rnd() < 0.25) || (spn('citizens') >= 3 && rnd() < 0.15);
  const client = special ? pickOne(SPECIAL_CLIENTS) : pickOne(CLIENTS);
  const mult = special ? 2.3 : 1;
  if (S.bld.smithy && rnd() < 0.3) {
    const t = ri(0, maxGearTier()), base = pickOne(GTYPE_IDS), v = gearValue({ base, t, q: 0 });
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
function fulfill(id) {
  const r = S.reqs.find(x => x.id === id);
  if (!r) return '';
  if (reqHave(r) < r.qty) return `${reqName(r)}이(가) 모자라요.`;
  if (r.gear) { const it = gearsOfKey('g:' + r.gear)[0]; S.gear = S.gear.filter(x => x !== it); }
  else addTo(S.inv, r.item, -r.qty);
  S.gold += r.reward; S.fame += r.fame; S.stats.earned += r.reward;
  S.reqs = S.reqs.filter(x => x !== r);
  log(`${r.client}의 의뢰를 끝냈다. ${g$(r.reward)}, 명성 +${r.fame}`, 'good');
  HOOKS.toast(`의뢰 완료 · ${g$(r.reward)} · 명성 +${r.fame}`);
  changed();
  return '';
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

/* ───────── 마탑 ───────── */
const researchCost = k => (rlv(k) >= RESEARCH[k].max ? null : RESEARCH[k].cost[rlv(k)]);
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
  S.research.cur = { k, done: today() + RESEARCH[k].days[rlv(k)] };
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
const payroll = () => living().reduce((s, a) => s + a.salary, 0);
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
  log(`${pm}월 정산을 마쳤다.`, unpaid.length ? 'bad' : '');
  queueModal({ title: `${pm}월 정산`, body: lines });
}

/* ───────── 시간 흐름 ───────── */
function onNewDay(k) {
  if (k % 2 === 0) rollCands();
  S.reqs = S.reqs.filter(r => { if (r.due < k) { log(`${r.client}의 의뢰가 기한을 넘겨 취소됐다.`); return false; } return true; });
  if (k % 2 === 1 || S.reqs.length < 2) genReq();
  if (S.bld.bank) bankDay(k);
  researchDay(k);
  if (k >= S.settleDay) { settle(); S.settleDay += MONTH_DAYS; }
  if (!S.flags.guildDown && !S.flags.raidTold && raidReady()) { S.flags.raidTold = 1; queueModal({ title: '시민회의 부탁', body: STORY.guildReady }); }
  changed();
}
function autoDepart(p) {
  const team = p.members.map(advById).filter(Boolean);
  if (!team.length || team.some(a => a.status !== 'idle' || a.hp < derive(a).maxHp * 0.85)) return;
  startExp(p, p.dest && isUnlocked(p.dest) ? p.dest : 'plains');
}
function stepHome(dt) {
  const m = spn('clinic') >= 2 ? 2 : 1;
  for (const a of S.advs) {
    if (a.status !== 'idle') continue;
    const d = derive(a);
    if (a.hp < d.maxHp) a.hp = Math.min(d.maxHp, a.hp + d.maxHp * 0.006 * m * dt);
    if (a.mp < d.maxMp) a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * dt);
  }
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
  const d1 = today();
  for (let k = d0 + 1; k <= d1; k++) onNewDay(k);
}
// 자리를 비운 동안: 원정과 판매만 진행되고 날짜는 그대로
const offlineCap = () => OFFLINE_CAP + rlv('time') * 3600;
function catchUp(sec) {
  sec = Math.min(sec, offlineCap());
  const b = { gold: S.gold, kills: S.stats.kills, deaths: S.stats.deaths, sales: S.stats.sales, fame: S.fame, gear: S.gear.length };
  const toast = HOOKS.toast, ch = HOOKS.changed;
  HOOKS.toast = () => {}; HOOKS.changed = () => {};
  let left = sec;
  while (left > 0) { const dt = Math.min(0.5, left); stepWorld(dt); left -= dt; }
  HOOKS.toast = toast; HOOKS.changed = ch;
  return { sec, gold: S.gold - b.gold, kills: S.stats.kills - b.kills, deaths: S.stats.deaths - b.deaths, sales: S.stats.sales - b.sales, fame: S.fame - b.fame, gear: Math.max(0, S.gear.length - b.gear) };
}

/* ───────── 저장 ───────── */
const SAVE_KEY = 'paros-sangdan:v1';
function saveGame() {
  if (!S) return;
  S.lastSeen = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (_) {}
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const v = JSON.parse(raw);
    if (!v || !Array.isArray(v.advs)) return false;
    if (v.v === 1) { migrate(v); saveGame(); return true; }
    if (v.v !== 2) return false;
    S = v;
    S.modals = S.modals || []; S.flags = S.flags || {}; S.heroQueue = S.heroQueue || []; S.gear = S.gear || [];
    S.bank = S.bank || { offers: [], deps: [], loans: [] };
    S.research = S.research || { lv: {}, cur: null }; S.spons = S.spons || {};
    ALL_FIELDS.forEach(f => { S.fields[f] = S.fields[f] || { best: 0, cleared: false }; });
    ['smithy', 'bank', 'tower'].forEach(b => { S.bld[b] = S.bld[b] || 0; });
    return true;
  } catch (_) { return false; }
}
function resetGame() { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} S = null; }
