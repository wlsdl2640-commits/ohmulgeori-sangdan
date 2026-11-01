/* ───────── 새 게임 ───────── */
function newGame(company) {
  S = {
    v: 1, seq: 1, t: 0, lastSeen: Date.now(),
    company: (company || '').trim().slice(0, 12) || '등불 상단',
    gold: 800, fame: 0,
    inv: { pot_s: 6 },
    advs: [], graves: [], parties: [],
    fields: { plains: { best: 0, cleared: false }, forest: { best: 0, cleared: false }, mountain: { best: 0, cleared: false } },
    cands: [], reqs: [], heroQueue: [],
    shop: { slots: [] }, sold: { day: 0, n: 0, g: 0 },
    bld: { shop: 1, inn: 1, alchemy: 0, training: 0 },
    settleDay: MONTH_DAYS,
    log: [], modals: [], flags: {},
    stats: { earned: 0, kills: 0, deaths: 0, trips: 0, sales: 0 },
    view: null
  };
  const w = makeAdv({ cls: 'warrior', name: '브람', bio: '오물거리에서 나고 자란 덩치. 당신의 첫 직원이다.' });
  const ar = makeAdv({ cls: 'archer', name: '리네', bio: '평원 마을에서 올라온 궁수. 빚을 갚을 때까지 일하기로 했다.' });
  const cl = makeAdv({ cls: 'cleric', name: '테오', bio: '오물거리 무료 진료소에서 일하던 성직자. 당신을 따라왔다.' });
  S.advs.push(w, ar, cl);
  S.parties.push({ id: nid(), name: '1팀', members: [w.id, ar.id, cl.id], sup: { pot_s: 3 }, auto: true, safe: true, repeat: false, dest: 'plains', exp: null, last: null });
  S.view = S.parties[0].id;
  rollCands(); genReq(); genReq();
  log(`${S.company}이(가) ${WORLD.street} 입구에 문을 열었다.`);
  queueModal({ title: '검은 두건의 손님', body: STORY.assassin });
}

/* ───────── 여관 손님 (고용 후보) ───────── */
function giftPool() {
  const out = [];
  FIELD_IDS.filter(isUnlocked).forEach(fid => FIELDS[fid].mons.forEach(mid => MONS[mid].drops.forEach(([it]) => { if (!out.includes(it)) out.push(it); })));
  return out;
}
function makeCand() {
  const top = Math.max(1, Math.min(40, 1 + Math.floor(S.fame / 12)));
  const a = makeAdv({ lv: ri(Math.max(1, top - 3), top) });
  a.fee = a.salary;
  const r = rnd();
  if (r < 0.25) {
    a.cond = { type: 'gift', item: pickOne(giftPool()), qty: ri(1, 3) };
    addExp(a, expNeed(a.lv));
    a.salary = Math.round(CLASSES[a.cls].salary * (1 + 0.09 * (a.lv - 1)) / 5) * 5; a.fee = a.salary;
  } else if (r < 0.35) {
    a.cond = { type: 'fame', min: S.fame + ri(5, 15) };
    addExp(a, expNeed(a.lv) + expNeed(a.lv + 1));
    a.salary = Math.round(CLASSES[a.cls].salary * (1 + 0.09 * (a.lv - 1)) / 5) * 5; a.fee = a.salary;
  }
  a.exp = 0; a.hp = a.maxHp;
  return a;
}
function syncHeroes() {
  for (const fid of S.heroQueue) {
    if (S.cands.some(c => c.heroOf === fid)) continue;
    const H = HEROES[fid];
    const a = makeAdv({ cls: H.cls, lv: H.lv, name: H.name, bio: H.bio, hero: true });
    a.salary = Math.round(a.salary * 1.2 / 5) * 5; a.fee = 0; a.heroOf = fid;
    a.cond = { type: 'fame', min: H.fame };
    S.cands.unshift(a);
  }
}
function rollCands() {
  S.cands = S.cands.filter(c => c.heroOf);
  for (let i = 0; i < 3; i++) S.cands.push(makeCand());
  if (!living().length) {
    const a = makeAdv({ cls: pickOne(['warrior', 'archer', 'cleric']), lv: 1, bio: '모험가 길드가 보낸 견습생. 계약금 없이 일하겠다고 한다.' });
    a.fee = 0; a.salary = 60; S.cands.unshift(a);
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
  const p = { id: nid(), name: `${n}팀`, members: [], sup: { pot_s: 2 }, auto: true, safe: true, repeat: false, dest: 'plains', exp: null, last: null };
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
  else { const other = partyOf(aid); if (other) { if (other.exp) return; other.members = other.members.filter(x => x !== aid); } p.members.push(aid); }
  changed();
}
function setSup(pid, it, d) {
  const p = S.parties.find(x => x.id === pid);
  if (!p || p.exp) return;
  p.sup[it] = Math.max(0, Math.min(30, (p.sup[it] || 0) + d));
  if (!p.sup[it]) delete p.sup[it];
  changed();
}

/* ───────── 판매·구매·제작 ───────── */
function sellGuild(it, q) {
  q = Math.min(q, S.inv[it] || 0);
  if (q <= 0) return;
  const g = Math.round(ITEMS[it].v * GUILD_RATE * q);
  addTo(S.inv, it, -q); S.gold += g; S.stats.earned += g;
  HOOKS.toast(`${ITEMS[it].name} ${q}개를 ${g}G에 팔았다`);
  changed();
}
const slotCount = () => S.bld.shop + 2;
function setSlot(i, it, tier) {
  while (S.shop.slots.length < slotCount()) S.shop.slots.push(null);
  S.shop.slots[i] = it ? { item: it, tier: tier || 0, tm: 0 } : null;
  changed();
}
function stepShop(dt) {
  const n = slotCount();
  for (let i = 0; i < n; i++) {
    const s = S.shop.slots[i];
    if (!s || !(S.inv[s.item] > 0)) continue;
    s.tm += dt;
    const iv = TIERS[s.tier].iv / (1 + S.fame / 150) / (1 + 0.1 * (S.bld.shop - 1));
    if (s.tm < iv) continue;
    s.tm -= iv;
    const g = Math.round(ITEMS[s.item].v * TIERS[s.tier].m);
    addTo(S.inv, s.item, -1); S.gold += g; S.stats.earned += g; S.stats.sales++;
    if (S.sold.day !== today()) S.sold = { day: today(), n: 0, g: 0 };
    S.sold.n++; S.sold.g += g;
  }
}
function buy(it, q) {
  const cost = ITEMS[it].buy * q;
  if (S.gold < cost) return '돈이 모자라요.';
  S.gold -= cost; addTo(S.inv, it, q);
  changed();
  return '';
}
function canCraft(r) { return Object.entries(r.need).every(([k, q]) => (S.inv[k] || 0) >= q) && S.gold >= r.fee; }
function craft(i) {
  const r = RECIPES[i];
  if (!S.bld.alchemy) return '연금술 공방이 필요해요.';
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
  log(`${B.name}을(를) ${lv ? 'Lv' + (lv + 1) + '로 확장했다' : '지었다'}.`, 'good');
  changed();
  return '';
}
const trainCost = a => 40 + 25 * a.lv;
function train(aid) {
  const a = advById(aid);
  if (!S.bld.training) return '훈련소가 필요해요.';
  if (!a || a.status !== 'idle') return '대기 중인 모험가만 훈련할 수 있어요.';
  if (S.gold < trainCost(a)) return '돈이 모자라요.';
  S.gold -= trainCost(a);
  if (addExp(a, Math.round(expNeed(a.lv) * 0.4))) log(`${a.name}이(가) 훈련 끝에 Lv${a.lv}이 되었다.`, 'good');
  changed();
  return '';
}

/* ───────── 의뢰 ───────── */
function genReq() {
  if (S.reqs.length >= 3) return;
  const pool = giftPool();
  if (rnd() < 0.15) pool.push('pot_s');
  const it = pickOne(pool), v = ITEMS[it].v;
  const qty = Math.max(1, Math.round(ri(2, 6) * (v > 30 ? 0.5 : 1)));
  S.reqs.push({ id: nid(), client: pickOne(CLIENTS), item: it, qty,
    reward: Math.round(v * qty * (1.7 + rnd() * 0.6) / 5) * 5,
    fame: Math.min(6, 1 + Math.floor(v * qty / 70)), due: today() + ri(4, 7) });
}
function fulfill(id) {
  const r = S.reqs.find(x => x.id === id);
  if (!r) return;
  if ((S.inv[r.item] || 0) < r.qty) return `${ITEMS[r.item].name}이(가) 모자라요.`;
  addTo(S.inv, r.item, -r.qty); S.gold += r.reward; S.fame += r.fame; S.stats.earned += r.reward;
  S.reqs = S.reqs.filter(x => x !== r);
  log(`${r.client}의 의뢰를 끝냈다. ${r.reward}G, 명성 +${r.fame}`, 'good');
  HOOKS.toast(`의뢰 완료 · ${r.reward}G · 명성 +${r.fame}`);
  changed();
  return '';
}

/* ───────── 월말 정산 ───────── */
const rent = () => 300 + 50 * Math.floor(S.fame / 20);
const payroll = () => living().reduce((s, a) => s + a.salary, 0);
function settle() {
  const pm = dateParts(S.t - DAY_SEC).m;
  const lines = [], r = rent();
  if (S.gold >= r) { S.gold -= r; lines.push(`암살자 길드에 자릿세 ${r}G를 냈다.`); }
  else {
    const paid = S.gold; S.gold = 0;
    let lost = 0;
    for (const k of Object.keys(S.inv)) { const q = Math.ceil(S.inv[k] * 0.3); addTo(S.inv, k, -q); lost += q; }
    S.fame = Math.max(0, S.fame - 3);
    lines.push(`자릿세 ${r}G 중 ${paid}G밖에 못 냈다. 두건 쓴 자들이 창고를 뒤져 물건 ${lost}개를 가져갔다. 명성 -3`);
  }
  let n = 0, sum = 0;
  const unpaid = [];
  for (const a of living()) { if (S.gold >= a.salary) { S.gold -= a.salary; n++; sum += a.salary; a.unpaid = 0; } else unpaid.push(a); }
  if (n) lines.push(`모험가 ${n}명에게 봉급 ${sum}G를 줬다.`);
  const gone = [], warned = [];
  unpaid.forEach(a => {
    a.unpaid = (a.unpaid || 0) + 1;
    if (a.unpaid < 2) { warned.push(a.name); return; }
    gone.push(a.name);
    if (a.status === 'idle') leave(a, '두 달째 봉급을 받지 못해 상단을 떠났다.'); else a.quit = true;
  });
  if (warned.length) lines.push(`${warned.join(', ')}에게 봉급을 주지 못했다. 다음 달에도 밀리면 떠난다.`);
  if (gone.length) lines.push(`두 달째 봉급을 못 받은 ${gone.join(', ')}은(는) 상단을 떠난다. 원정 중이면 돌아온 뒤에 떠난다.`);
  lines.push(`다음 달 자릿세는 ${rent()}G다.`);
  log(`${pm}월 정산을 마쳤다.`, unpaid.length ? 'bad' : '');
  queueModal({ title: `${pm}월 정산`, body: lines });
}

/* ───────── 시간 흐름 ───────── */
function onNewDay(k) {
  if (k % 2 === 0) rollCands();
  S.reqs = S.reqs.filter(r => { if (r.due < k) { log(`${r.client}의 의뢰가 기한을 넘겨 취소됐다.`); return false; } return true; });
  if (k % 2 === 1 || S.reqs.length < 2) genReq();
  if (k >= S.settleDay) { settle(); S.settleDay += MONTH_DAYS; }
  changed();
}
function autoDepart(p) {
  const team = p.members.map(advById).filter(Boolean);
  if (!team.length || team.some(a => a.status !== 'idle' || a.hp < a.maxHp * 0.85)) return;
  startExp(p, p.dest && isUnlocked(p.dest) ? p.dest : 'plains');
}
function stepHome(dt) {
  for (const a of S.advs) if (a.status === 'idle' && a.hp < a.maxHp) a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.006 * dt);
}
function step(dt) {
  const d0 = today();
  S.t += dt;
  for (const p of S.parties) if (p.exp) stepExp(p, dt); else if (p.repeat) autoDepart(p);
  stepShop(dt);
  stepHome(dt);
  const d1 = today();
  for (let k = d0 + 1; k <= d1; k++) onNewDay(k);
}
function catchUp(sec) {
  const b = { gold: S.gold, kills: S.stats.kills, deaths: S.stats.deaths, sales: S.stats.sales, t: S.t, fame: S.fame };
  const toast = HOOKS.toast, ch = HOOKS.changed;
  HOOKS.toast = () => {}; HOOKS.changed = () => {};
  let left = sec;
  while (left > 0) { const dt = Math.min(0.5, left); step(dt); left -= dt; }
  HOOKS.toast = toast; HOOKS.changed = ch;
  return { sec, gold: S.gold - b.gold, kills: S.stats.kills - b.kills, deaths: S.stats.deaths - b.deaths, sales: S.stats.sales - b.sales, days: dayOf(S.t) - dayOf(b.t), fame: S.fame - b.fame };
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
    if (!v || v.v !== 1 || !Array.isArray(v.advs)) return false;
    S = v;
    S.modals = S.modals || []; S.flags = S.flags || {}; S.heroQueue = S.heroQueue || [];
    S.sold = S.sold || { day: 0, n: 0, g: 0 };
    FIELD_IDS.forEach(f => { S.fields[f] = S.fields[f] || { best: 0, cleared: false }; });
    S.parties.forEach(p => { if (p.safe == null) p.safe = true; if (p.repeat == null) p.repeat = false; });
    return true;
  } catch (_) { return false; }
}
function resetGame() { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} S = null; }
