/* ───────── 7번가 지하수로: 투기장 · 투기장 상단 · 암시장 · 경매장 · 암살자 길드 본부 ─────────
   상태는 S.under = { arena, bm, au }. 날이 바뀌면 underDay(k)가 상대·물건·경매품을 새로 뽑는다. */

// 투기장 상대 모험가는 전투 엔진 안에서 '몬스터'로 다뤄진다 (그림은 모험가로)
Object.assign(MONS, {
  pvp:  { name: '모험가', plan: 'human', body: '#8a8a8a', dark: '#5a5a5a', mh: 1, ma: 1, md: 1, spd: 1, minS: 1, drops: [] },
  pvpm: { name: '모험가', plan: 'human', body: '#8a8a8a', dark: '#5a5a5a', mh: 1, ma: 1, md: 1, spd: 1, minS: 1, magic: 1, drops: [] },
  pvph: { name: '모험가', plan: 'human', body: '#8a8a8a', dark: '#5a5a5a', mh: 1, ma: 1, md: 1, spd: 1, minS: 1, magic: 1, drops: [] }
});
MON_DIM.pvp = MON_DIM.pvpm = MON_DIM.pvph = [18, 26];
['pvp', 'pvpm', 'pvph'].forEach(id => { MONS[id].ty = ['human']; MONS[id].el = []; });   // 투기장 상대: 인간 (속성 상성은 받지 않는다)
FIELDS.arena = { no: 0, name: '지하 투기장', lv: 1, bg: 'arena', tier: 3, arena: 1, mons: [], dungeon: null, desc: '' };

const underOpen = () => (S.rank || 0) >= UNDER_RANK;
const arenaScore = () => (S.under && S.under.arena ? S.under.arena.score : 0);
function migrateU() {
  S.under = S.under || {};
  const U = S.under;
  U.arena = U.arena || { score: 0, coins: 0, wins: 0, losses: 0, day: -1, fights: 0, opps: [], best: 0 };
  U.bm = U.bm || { day: -1, stock: [] };
  U.au = U.au || { day: -1, g: null };
  if (!U.arena.season) seasonReset();
}
/* 시즌 랭킹판: 한 달 동안 다른 상단들과 점수를 겨루고 월말에 등수 보상 */
const SEASON_REWARD = [[300, 20, '투기장의 왕'], [200, 12, '모래판의 검'], [120, 8, '관중의 총아'], [60, 4, ''], [60, 4, ''], [30, 2, ''], [30, 2, ''], [30, 2, '']];
function seasonReset() {
  const A = S.under.arena, names = ARENA_NAMES.slice().sort(() => rnd() - 0.5).slice(0, 7);
  A.season = { score: 0, wins: 0, rivals: names.map((n, i) => ({ name: n, score: ri(80, 400) * (i < 3 ? 2 : 1) })), title: A.season ? A.season.title : '' };
}
function seasonDay() {
  const Sn = S.under.arena.season; if (!Sn) return;
  Sn.rivals.forEach((r, i) => { r.score += ri(30, 120) + (i < 2 ? ri(40, 160) : 0); });
}
function seasonStand() {
  const Sn = S.under.arena.season, rows = Sn.rivals.map(r => ({ name: r.name, score: r.score, me: 0 })).concat([{ name: S.company, score: Sn.score, me: 1 }]);
  rows.sort((x, y) => y.score - x.score);
  return rows;
}
function seasonEnd() {
  const A = S.under && S.under.arena, Sn = A && A.season; if (!Sn) return;
  const rows = seasonStand(), rank = rows.findIndex(r => r.me) + 1, R = SEASON_REWARD[Math.min(rank, SEASON_REWARD.length) - 1];
  if (Sn.wins > 0) {
    A.coins += R[0]; S.fame += R[1]; if (R[2]) Sn.title = R[2];
    log(`투기장 시즌이 끝났다. ${rank}위 · 코인 +${R[0]}, 명성 +${R[1]}${R[2] ? ` · 칭호 「${R[2]}」` : ''}`, 'good');
    queueModal({ title: '투기장 시즌 결산', body: [`이번 달 시즌 ${rank}위 (시즌 점수 ${fmt(Sn.score)}, ${Sn.wins}승).`, `보상: 투기장 코인 ${R[0]}, 명성 +${R[1]}${R[2] ? `, 칭호 「${R[2]}」` : ''}.`].concat(rows.slice(0, 3).map((r, i) => `${i + 1}위 ${r.name} ${fmt(r.score)}`)) });
  }
  const title = Sn.title; seasonReset(); S.under.arena.season.title = title;
}
// 열렸는지 살피고, 날이 바뀌었으면 새로 뽑는다 (매 틱 싸게)
function underTick() {
  if (!S.under) migrateU();
  if (!underOpen()) return;
  const k = today();
  if (!S.flags.under) { S.flags.under = 1; log('7번가 지하수로 입구가 열렸다. 시설 창에서 내려갈 수 있다.', 'good'); queueModal({ title: '지하수로', body: STORY.under }); }
  if (S.under.arena.day !== k) { arenaRefresh(k); seasonDay(); }
  if (S.under.bm.day !== k) bmRefresh(k);
  if (S.under.au.day !== k) { auClose(); auRefresh(k); }
  auStep();
}

/* ───────── 투기장 ───────── */
const arenaTier = () => Math.max(2, ...TIER_FIELDS.filter(isUnlocked).map(f => FIELDS[f].tier));
function arenaLvBase() { const lv = S.parties.length ? Math.max(...S.parties.map(p => avgLvOf(p))) : 1; return Math.max(6, Math.round(lv)); }
// 상대 모험가 한 명: 급에 맞는 직업과 장비
function fakeAdv(lv, tier) {
  let pool = CLASS_IDS.slice();
  if (tier >= 1 && lv >= JOB_REQ[2].lv) pool = pool.concat(Object.keys(CLASSES).filter(c => jobTier(c) === 2));
  if (tier >= 2 && lv >= JOB_REQ[3].lv) pool = pool.concat(Object.keys(CLASSES).filter(c => jobTier(c) === 3));
  const a = makeAdv({ cls: pickOne(pool), lv });
  let gt = 0; GTIERS.forEach((T, i) => { if (lv >= T.lv) gt = i; });
  gt = Math.min(gt, arenaTier());   // 우리가 갈 수 있는 필드 단계까지만
  const q = tier;   // 일반 · 고급 · 희귀
  for (const [slot] of SLOTS) {
    if (slot === 'bag') continue;
    const bases = GTYPE_IDS.filter(b => GTYPES[b].slot === slot && tierOk(b, gt) && gearFits(a, { base: b, t: UNIQ_T0[b] || 0 }));   // 빌드 64: 그 단계에 있는 종류만
    if (bases.length) { const b = pickOne(bases); a.eq[slot] = makeGear(b === 'shield' ? shieldOf(a.cls, gt) : dropKind(b, gt), gt, q); }
  }
  if (twoHand(a.eq.weapon)) a.eq.off = null;   // 대검은 두 손
  const d = derive(a); a.hp = d.maxHp; a.mp = d.maxMp;
  return a;
}
function arenaRefresh(k) {
  const A = S.under.arena;
  A.day = k; A.fights = 0;
  const base = arenaLvBase(), names = ARENA_NAMES.slice().sort(() => rnd() - 0.5);
  A.opps = [0, 1, 2].map(tier => {
    const lv = Math.max(1, base + [-4, 0, 5][tier] + ri(-1, 1)), n = Math.min(6, 3 + tier + (rnd() < 0.5 ? 1 : 0));
    const members = []; for (let i = 0; i < n; i++) members.push(fakeAdv(lv, tier));
    return { tier, lv, name: names[tier], members };
  });
}
const arenaFee = opp => 20 * opp.lv;
// 상대 모험가 → 전투용 적
function pvpFoe(a) {
  const d = derive(a), base = jobBase(a.cls), caster = base === 'mage' || base === 'cleric', healer = base === 'cleric';
  // 몬스터 잣대에 맞춘다: 방어는 낮게(몬스터처럼 맞고), 체력은 넉넉히
  const atk = caster ? Math.max(d.matk, d.atk) : d.atk, hp = Math.round(d.maxHp * 1.6);
  return { uid: nid(), id: healer ? 'pvph' : caster ? 'pvpm' : 'pvp', adv: a, name: `${a.name}(${CLASSES[a.cls].name})`, lv: a.lv, hp, maxHp: hp, atk, def: d.def * 0.45, spd: d.spd, eva: Math.min(0.35, d.eva),
    cd: 0.6 + rnd() * 0.8, boss: false, dot: null, dotT: 0, slow: 0, pvp: 1, heal: healer ? d.matk * 0.4 : 0, aoe: caster && !healer && a.lv >= 20 };
}
function startArena(pid, oi) {
  const p = S.parties.find(x => x.id === pid), U = S.under && S.under.arena, opp = U && U.opps[oi];
  if (!p || !opp) return '';
  if (p.raidOnly) return '레이드 전용 파티는 레이드에만 나가요.';
  if (!underOpen()) return '아직 지하수로에 갈 수 없어요.';
  if (p.exp) return '원정 중인 파티예요.';
  if (U.fights >= ARENA_PER_DAY) return `오늘은 더 싸울 수 없어요 (하루 ${ARENA_PER_DAY}판).`;
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 내보낼 수 있어요.';
  const why = team.map(cantGo).find(Boolean);
  if (why) return why + '.';
  const fee = arenaFee(opp);
  if (S.gold < fee) return `입장료 ${fmt(fee)}G가 모자라요.`;
  S.gold -= fee; U.fights++;
  const e = newExp('arena', {}, 1);
  e.area = 'arena'; e.encs = []; e.opp = oi; e.oppName = opp.name; e.oppTier = opp.tier; e.oppLv = opp.lv; e.done = 0;
  formParty(p);
  p.exp = e;
  team.forEach(a => { refillAmmo(a); a.status = 'away'; a.down = false; a.mp = derive(a).maxMp; });
  S.view = p.id;
  log(`${p.name}이(가) 지하 투기장에서 ${opp.name}에 도전한다. (입장료 ${fmt(fee)}G)`);
  changed();
  return '';
}
function stepArena(p, e, team, dm, dt, fr) {
  const opp = S.under.arena.opps[e.opp];
  if (e.foes.length) {
    tire(team, FATIGUE.fight * fr * dt);
    battle(p, e, team, dm, dt);
    if (!p.exp) return;
    if (!e.foes.length) arenaEnd(p, e, true);
    return;
  }
  const v = moveOf(p);
  if (e.done) { e.pos -= v * 1.15 * dt; if (e.pos <= 0) arrive(p); return; }
  team.forEach(a => { const d = dm[a.id]; a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  e.pos += v * dt;
  if (e.pos >= STAGE_LEN * 0.35 && opp) {
    e.foes = opp.members.map(pvpFoe); e.cd = {}; e.buffs = []; e.taunt = null;
    ev(e, 'spawn', { boss: true, name: `${opp.name} 원정대` });
    log(`${opp.name} 원정대가 모래판 반대편에 섰다. 싸움이 시작됐다!`);
  }
}
function arenaEnd(p, e, win) {
  const U = S.under.arena, tier = e.oppTier || 0, avg = avgLvOf(p);
  if (win) {
    const gain = Math.round((ARENA_SCORE_WIN[tier] + Math.max(-30, Math.min(30, Math.round(((e.oppLv || avg) - avg) * 3)))) * (1 + Math.max(0, ...teamOf(p).map(a => passives(a).arenaFame || 0))));   // 글라디우스술 상급: 랭킹 점수 +10%
    U.coins += ARENA_COIN.win; U.score += gain; U.wins++; U.best = Math.max(U.best || 0, U.score); S.fame += 1;
    if (U.season) { U.season.score += gain; U.season.wins++; }
    log(`${p.name}이(가) 투기장에서 ${e.oppName}을(를) 이겼다! 랭킹 점수 +${gain}, 투기장 코인 +${ARENA_COIN.win}, 명성 +1`, 'good');
    HOOKS.toast(`투기장 승리 · 점수 +${gain} · 코인 +${ARENA_COIN.win}`);
    if (U.score >= GLADIATOR_SCORE && !S.flags.gladOK) { S.flags.gladOK = 1; queueModal({ title: '투기장의 이름', body: [`${S.company}의 이름이 투기장 명판 맨 위에 올랐다. 랭킹 점수 ${fmt(GLADIATOR_SCORE)}.`, '이제 전사를 검투사로 전직시킬 수 있다 (훈련소, Lv20·라이선스 조건은 그대로).'] }); }
  } else {
    U.coins += ARENA_COIN.lose; U.score = Math.max(0, U.score - ARENA_SCORE_LOSE); U.losses++;
    if (U.season) U.season.score = Math.max(0, U.season.score - ARENA_SCORE_LOSE);
    log(`${p.name}이(가) 투기장에서 ${e.oppName}에게 졌다. 랭킹 점수 -${ARENA_SCORE_LOSE}, 투기장 코인 +${ARENA_COIN.lose}`, 'bad');
    HOOKS.toast(`투기장 패배 · 코인 +${ARENA_COIN.lose}`);
  }
  ev(e, 'arena', { win: win ? 1 : 0 });
  e.done = 1; e.mode = 'return'; e.why = 'arena'; e.foes = []; e.cd = {}; e.buffs = []; e.taunt = null;
  changed();
}
// 전멸: 투기장에서는 다치지 않고 들려 나온다
function arenaWipe(p) {
  const e = p.exp;
  arenaEnd(p, e, false);
  teamOf(p).forEach(a => { const d = derive(a); a.down = false; a.hp = Math.max(1, Math.round(d.maxHp * 0.3)); });
  e.pos = Math.min(e.pos, STAGE_LEN * 0.2);
}
// 투기장 상단: 코인으로만 산다
function arenaShop() {
  const t = arenaTier();
  const gear = ARENA_GEAR.filter(b => tierOk(b, t)).map(b => ({ kind: 'gear', base: b, t, q: 3, price: GTYPES[b].slot === 'acc' ? 150 : 100 + t * 30 }));   // 빌드 64: 글라디우스는 늪지 단계부터
  const excl = exclOf('arena').map(id => ({ kind: 'item', id, price: EXCL[id].coins }));   // 빌드 63: 스킬북 대신 투기장 상단 전용 물건 (깃발 · 월계관)
  return gear.concat(excl);   // 마법사의 돌은 빌드 28부터 팔지 않는다 (우두머리·던전 주인·레이드에서만)
}
function arenaBuy(kind, id) {
  const U = S.under.arena, o = arenaShop().find(x => x.kind === kind && (x.base === id || x.id === id));
  if (!o) return '';
  if (U.coins < o.price) return `투기장 코인이 모자라요 (${o.price} 필요).`;
  if (kind === 'gear' ? !roomGear() : !roomItem(kind === 'item' ? o.id : 'book_' + o.id)) return WH_FULL;
  U.coins -= o.price;
  if (kind === 'gear') { const g = makeGear(o.base, o.t, o.q); S.gear.push(g); log(`투기장 상단에서 ${gearName(g)}을(를) 샀다. (코인 ${o.price})`); return `${gearName(g)}을(를) 창고에 넣었어요.`; }
  const it = kind === 'item' ? o.id : 'book_' + o.id;
  addTo(S.inv, it, 1); log(`투기장 상단에서 ${ITEMS[it].name}을(를) 샀다. (코인 ${o.price})`);
  return `${ITEMS[it].name}을(를) 창고에 넣었어요.`;
}

/* ───────── 암시장: 날마다 바뀌는 장비 · 룬 · 암시장 전용 물건 (빌드 63부터 스킬북은 안 판다) ───────── */
function bmRefresh(k) {
  const B = S.under.bm, t0 = arenaTier();
  B.day = k; B.stock = [];
  for (let i = 0; i < 3; i++) { const t = Math.max(0, t0 - (rnd() < 0.4 ? 1 : 0)), q = pickOne([2, 2, 2, 3, 3]); const g = makeGear(dropBase(t), t, q);   /* 빌드 63 다섯째 묶음: 전설부터는 드랍으로만 */ B.stock.push({ kind: 'gear', g, price: Math.round(gearValue(g) * 3 / 10) * 10 }); }
  { const k = pickOne(exclOf('bm')); B.stock.push({ kind: 'item', it: k, price: exclPrice(k) }); if (rnd() < 0.25) B.stock.push({ kind: 'item', it: 'tmap', price: Math.round(ITEMS.tmap.v * 3 / 10) * 10 }); }   // 빌드 63: 스킬북 대신 암시장 전용 물건 (부적 · 미끼) · 가끔 밀거래 보물 지도   // 빌드 63: 스킬북 단계 — 가끔 한 권, 아주 비싸게
  const r = runeId(pickOne(RUNE_IDS), rnd() < 0.3 ? 1 : 0); if (ITEMS[r]) B.stock.push({ kind: 'item', it: r, price: Math.round(ITEMS[r].v * 2 / 10) * 10 });
}
function bmBuy(i) {
  const B = S.under.bm, o = B.stock[i];
  if (!o || o.sold) return '';
  if (S.gold < o.price) return '돈이 모자라요.';
  if (o.kind === 'gear' ? !roomGear() : !roomItem(o.it)) return WH_FULL;
  S.gold -= o.price; o.sold = 1; S.stats.spent = (S.stats.spent || 0) + o.price;
  if (o.kind === 'gear') { S.gear.push(o.g); log(`암시장에서 ${gearName(o.g)}을(를) ${fmt(o.price)}G에 샀다.`); return `${gearName(o.g)}을(를) 창고에 넣었어요.`; }
  addTo(S.inv, o.it, 1); log(`암시장에서 ${ITEMS[o.it].name}을(를) ${fmt(o.price)}G에 샀다.`);
  return `${ITEMS[o.it].name}을(를) 창고에 넣었어요.`;
}

/* ───────── 경매장: 날마다 한 점, 새벽 4시에 낙찰 ───────── */
function auRefresh(k) {
  const A = S.under.au, t = Math.min(GTIERS.length - 1, arenaTier() + (rnd() < 0.3 ? 1 : 0)), q = 3;   // 빌드 63 다섯째 묶음: 신화 · 신성 → 영웅 (전설부터는 드랍으로만)
  const g = makeGear(dropBase(t), t, q), start = Math.round(gearValue(g) * 4 / 100) * 100;
  A.day = k; A.g = g; A.start = start; A.price = start; A.top = null; A.held = 0; A.bids = 0;
  A.npc = pickOne(ARENA_NAMES); A.npcMax = Math.round(start * (2.2 + rnd() * 1.6) / 100) * 100;
  A.will = 0.8; A.out = 0;   // 되칠 마음: 부를 때마다 줄고, 한 번 물러서면 끝
  A.next = S.t + 20 + rnd() * 40;
}
const auBidNext = A => (A.top ? Math.ceil(A.price * 1.12 / 10) * 10 : A.price);
function auBid() {
  const A = S.under && S.under.au;
  if (!A || !A.g) return '';
  if (A.top === 'me') return '지금 최고 입찰자는 우리예요.';
  const bid = auBidNext(A);
  if (S.gold < bid) return `${fmt(bid)}G가 필요해요.`;
  S.gold -= bid; A.held = bid; A.price = bid; A.top = 'me'; A.bids++;
  A.next = S.t + 15 + rnd() * 45;
  log(`경매장에 ${gearName(A.g)} ${fmt(bid)}G를 불렀다.`);
  changed();
  return `${fmt(bid)}G를 불렀어요. 새벽 4시까지 아무도 더 부르지 않으면 우리 것이에요.`;
}
function auStep() {
  const A = S.under && S.under.au;
  if (!A || !A.g || S.t < A.next) return;
  if (A.top === null) { A.top = 'npc'; A.bids++; A.next = S.t + 60 + rnd() * 60; return; }
  if (A.top === 'me' && !A.out && A.price < A.npcMax) {
    if (rnd() > A.will) { A.out = 1; log(`경매장: ${A.npc}이(가) ${gearName(A.g)} 입찰에서 물러섰다. 새벽 4시까지 아무도 더 부르지 않으면 우리 것이다.`, 'good'); HOOKS.toast(`경매장 · ${A.npc}이(가) 물러섰어요`); A.next = S.t + 999999; return; }
    A.will *= 0.72;
    const bid = Math.min(A.npcMax, Math.ceil(A.price * (1.1 + rnd() * 0.12) / 10) * 10);
    S.gold += A.held; A.held = 0; A.price = bid; A.top = 'npc'; A.bids++;
    log(`경매장: ${A.npc}이(가) ${gearName(A.g)}에 ${fmt(bid)}G를 불렀다. 우리 돈은 돌려받았다.`, 'warn');
    HOOKS.toast(`경매장 · ${A.npc}이(가) ${fmt(bid)}G를 불렀어요`);
  }
  A.next = S.t + 60 + rnd() * 60;
}
function auClose() {
  const A = S.under && S.under.au;
  if (!A || !A.g) return;
  if (A.top === 'me') {
    stashGear(A.g); A.held = 0;   // 낙찰: 넘치면 창고 1~10, 그래도 없으면 잃는다
    log(`경매장에서 ${gearName(A.g)}을(를) ${fmt(A.price)}G에 낙찰받았다!`, 'good');
    queueModal({ title: '낙찰', body: [`경매장의 ${gearName(A.g)}(${QUALITY[A.g.q].name})이(가) ${fmt(A.price)}G에 우리 것이 됐다. 창고에 들어 있다.`] });
  } else if (A.bids) log(`경매장의 ${gearName(A.g)}은(는) ${A.npc}에게 ${fmt(A.price)}G에 넘어갔다.`);
  A.g = null;
}

/* ───────── 왕국 상단이 팔러 온 것 ───────── */
function kingGoods(D) {
  const goods = (D.sells || []).filter(it => ITEMS[it]).sort(() => rnd() - 0.5).slice(0, 2).map(it => ({ it, n: ri(6, 12), price: Math.round(ITEMS[it].v * 1.3) }));
  const kid = KINGDOM_IDS.find(x => KINGDOMS[x] === D);
  exclOf(kid).forEach(it => goods.push({ it, n: ri(1, 3), price: exclPrice(it) }));   // 빌드 63: 스킬북 대신 그 나라 상단 전용 물건 스킬북 한 권 — 아주 비싸게
  return goods;
}
function kingBuy(i) {
  const v = S.king && S.king.visit, o = v && v.goods && v.goods[i];
  if (!o) return '';
  if (o.n <= 0) return '다 팔렸어요.';
  if (S.gold < o.price) return '돈이 모자라요.';
  if (!roomItem(o.it)) return WH_FULL;
  S.gold -= o.price; o.n--; addTo(S.inv, o.it, 1); S.stats.spent = (S.stats.spent || 0) + o.price;
  S.king.favor[v.k] = favorOf(v.k) + o.price / 800;
  log(`${KINGDOMS[v.k].name} 상단에서 ${ITEMS[o.it].name}을(를) ${fmt(o.price)}G에 샀다.`);
  changed();
  return `${ITEMS[o.it].name}을(를) 창고에 넣었어요.`;
}

/* ───────── 화면 ───────── */
Object.assign(WIN_TITLE, { under: '7번가 지하수로', ar: '투기장', arshop: '투기장 상단', bm: '암시장', au: '경매장', ag: '암살자 길드 본부' });
const coinTag = n => `<b class="coin">${fmt(n)}</b> 코인`;
function underCard() {
  const open = underOpen();
  return `<button type="button" class="card under${open ? '' : ' dim'}" data-act="sub" data-id="under"${open ? '' : ' disabled'}><div class="row"><span class="ubadge">↓</span><div class="grow"><div class="h">7번가 지하수로</div><div class="sub">${open ? '투기장 · 암시장 · 경매장 · 암살자 길드 본부 · 지하수로 던전' : `상단 ${RANKS[UNDER_RANK].name}랭크가 되면 내려갈 수 있어요.`}</div></div></div></button>`;
}
const facPanel0 = PANELS.fac;
PANELS.fac = () => facPanel0() + underCard();
PANELS.under = () => {
  const U = S.under, A = U.arena, au = U.au;
  return `<div class="card hl"><div class="h">등불 없는 도시</div><div class="sub">하수도를 따라 내려가면 범죄자들이 세운 또 하나의 거리가 나온다. 이곳에선 이름표도, 영수증도 없다.</div></div>
  <div class="submenu">
    ${subBtn('ar', '투기장', `랭킹 점수 <b>${fmt(A.score)}</b> · 코인 ${fmt(A.coins)} · 오늘 ${A.fights}/${ARENA_PER_DAY}판`, A.fights < ARENA_PER_DAY)}
    ${subBtn('arshop', '투기장 상단', `코인으로만 사는 장비와 전용 물건 · 코인 ${fmt(A.coins)}`)}
    ${subBtn('bm', '암시장', `오늘 물건 ${U.bm.stock.filter(o => !o.sold).length}개 · 새벽 4시에 바뀌어요`)}
    ${subBtn('au', '경매장', au.g ? `<span class="gold-t">${esc(gearName(au.g))}</span> · 지금 ${fmt(au.price)}G${au.top === 'me' ? ' · 우리가 최고' : ''}` : '오늘 경매는 끝났어요', au.g && au.top !== 'me')}
    ${subBtn('ag', '암살자 길드 본부', S.flags.guildDown ? '토벌 완료 · 자릿세 없음' : `매달 자릿세 ${fmt(rent())}G`)}
    ${subBtn('exp', '지하수로 던전', `원정 창에서 「지하수로」로 · Lv${FIELDS.sewer.lv}~ · 최고 8-${(S.fields.sewer && S.fields.sewer.best) || 0}`)}
  </div>`;
};
PANELS.ar = () => {
  const A = S.under.arena, parties = S.parties.filter(p => !p.exp && !p.raidOnly), sel = parties.find(p => p.id === UI.arP) || parties[0];
  const prog = Math.min(100, A.score / GLADIATOR_SCORE * 100);
  const head = `<div class="card hl"><div class="row"><div class="grow"><div class="h">${esc(S.company)} <small>${A.wins}승 ${A.losses}패</small></div><div class="sub">랭킹 점수 <b class="gold-t">${fmt(A.score)}</b> · ${coinTag(A.coins)} · 오늘 ${A.fights}/${ARENA_PER_DAY}판</div></div></div>
    <div class="sub">검투사 전직 조건: 랭킹 점수 ${fmt(GLADIATOR_SCORE)} <span class="${A.score >= GLADIATOR_SCORE ? 'ok-t' : 'muted'}">(${fmt(A.score)}/${fmt(GLADIATOR_SCORE)})</span></div><div class="bar xp big"><i style="width:${prog.toFixed(1)}%"></i></div>
    <div class="sub muted">이기면 코인 +${ARENA_COIN.win}·점수 +${ARENA_SCORE_WIN.join('/')}, 지면 코인 +${ARENA_COIN.lose}·점수 -${ARENA_SCORE_LOSE}. 투기장에서는 다치지 않아요.</div></div>`;
  const pick = parties.length ? `<div class="sec"><b>내보낼 파티</b><span>대기 중인 파티만</span></div><div class="btns">${parties.map(p => `<button type="button" class="btn sm${sel && sel.id === p.id ? ' on' : ''}" data-act="arparty" data-id="${p.id}">${esc(p.name)} · ${p.members.length}명 · 평균 Lv${Math.round(avgLvOf(p))}</button>`).join('')}</div>` : '<div class="sub red-t">대기 중인 파티가 없어요. 원정에서 돌아오면 도전할 수 있어요.</div>';
  const opps = A.opps.map((o, i) => { const fee = arenaFee(o), ok = sel && A.fights < ARENA_PER_DAY && S.gold >= fee;
    return `<div class="card"><div class="row"><span class="tag ${['', 'gold-t', 'red-t'][o.tier]}">${ARENA_TIERS[o.tier]}</span><div class="grow"><div class="h">${esc(o.name)}</div><div class="sub">${o.members.length}명 · Lv${o.lv} · 이기면 점수 +${ARENA_SCORE_WIN[o.tier]}</div></div><button type="button" class="btn sm gold" data-act="arfight" data-p="${sel ? sel.id : 0}" data-i="${i}"${ok ? '' : ' disabled'}>도전 ${fmt(fee)}G</button></div>
      <div class="row wrap">${o.members.map(m => `<span class="mem"><img src="${portrait(m)}" alt=""><span>${esc(m.name)}<br><small>${CLASSES[m.cls].name} ${m.lv}</small></span></span>`).join('')}</div></div>`; }).join('');
  const Sn = A.season, rows = Sn ? seasonStand() : [], dd = S.settleDay - today();
  const season = Sn ? `<div class="sec"><b>시즌 랭킹판</b><span>월말 정산 D-${dd} · 등수 보상</span></div><div class="card">${Sn.title ? `<div class="sub gold-t">칭호 「${esc(Sn.title)}」</div>` : ''}${rows.map((r, i) => `<div class="row sub${r.me ? ' gold-t' : ''}"><span class="rkn">${i + 1}</span><span class="grow">${esc(r.name)}</span><b class="num">${fmt(r.score)}</b></div>`).join('')}<div class="sub muted">1위 코인 300·명성 20·칭호, 2위 200·12, 3위 120·8, 4~5위 60, 그 아래 30 (한 판이라도 이겨야 받아요)</div></div>` : '';
  return head + pick + `<div class="sec"><b>오늘의 상대</b><span>새벽 4시에 바뀌어요</span></div>` + opps + season;
};
PANELS.arshop = () => {
  const A = S.under.arena, list = arenaShop();
  const rows = list.map(o => o.kind === 'item'
    ? `<div class="li">${iconImg(o.id)}<div class="grow stack"><span>${ITEMS[o.id].name}${(S.inv[o.id] || 0) ? ` <span class="tag ok-t">${S.inv[o.id]}</span>` : ''}</span><span class="sub">${ITEMS[o.id].desc}${EXCL[o.id] ? `<br><span class="gold-t">전용 · ${exclEffText(o.id)}</span>` : ''}</span></div><button type="button" class="btn sm gold" data-act="arbuy" data-k="item" data-id="${o.id}"${A.coins >= o.price ? '' : ' disabled'}>${o.price} 코인</button></div>`
    : o.kind === 'gear'
    ? `<div class="li">${gArt({ base: o.base, t: o.t, q: o.q, runes: [] }, 1)}<div class="grow stack"><span>${gearNameOf(o.base, o.t)} <span class="tag" style="color:${QUALITY[o.q].c}">${QUALITY[o.q].name}</span></span><span class="sub">${statLine(gearStats({ base: o.base, t: o.t, q: o.q, runes: [] }))} · ${GTYPES[o.base].cls.includes('all') ? '누구나' : GTYPES[o.base].cls.map(c => CLASSES[c] ? CLASSES[c].name : c).join('·')}</span></div><button type="button" class="btn sm gold" data-act="arbuy" data-k="gear" data-id="${o.base}"${A.coins >= o.price ? '' : ' disabled'}>${o.price} 코인</button></div>`
    : `<div class="li">${iconImg('book_' + o.id)}<div class="grow stack"><span>${ITEMS['book_' + o.id].name} <span class="muted">· Lv${SKILLS[o.id].lv} · ${SKILLS[o.id].cls.map(c => CLASSES[c] ? CLASSES[c].name : '누구나').join('·')}</span></span><span class="sub">${SKILLS[o.id].desc}<br>${skillSpecLine(o.id)}</span></div><button type="button" class="btn sm gold" data-act="arbuy" data-k="book" data-id="${o.id}"${A.coins >= o.price ? '' : ' disabled'}>${o.price} 코인</button></div>`).join('');
  return `<div class="card hl"><div class="h">투기장 상단</div><div class="sub">투기장 코인으로만 거래해요. 가진 코인 ${coinTag(A.coins)}. 여기 장비와 깃발 · 월계관은 어디서도 떨어지지 않아요. 스킬북은 몬스터에게서만 나와요.</div></div><div class="list">${rows}</div>`;
};
PANELS.bm = () => {
  const B = S.under.bm;
  const rows = B.stock.map((o, i) => o.kind === 'gear'
    ? `<div class="li${o.sold ? ' dim' : ''}">${gArt(o.g, 1)}<div class="grow stack"><span>${gearName(o.g)} ${qTag(o.g)}</span><span class="sub">${statLine(gearStats(o.g))}</span></div><button type="button" class="btn sm gold" data-act="bmbuy" data-i="${i}"${!o.sold && S.gold >= o.price ? '' : ' disabled'}>${o.sold ? '팔림' : fmt(o.price) + 'G'}</button></div>`
    : `<div class="li${o.sold ? ' dim' : ''}">${iconImg(o.it)}<div class="grow stack"><span>${ITEMS[o.it].name}</span><span class="sub">${ITEMS[o.it].book ? `${SKILLS[ITEMS[o.it].book].desc} · Lv${SKILLS[ITEMS[o.it].book].lv}<br>${skillSpecLine(ITEMS[o.it].book)}` : ITEMS[o.it].desc || '룬'}${EXCL[o.it] ? `<br><span class="gold-t">전용 · ${exclEffText(o.it)}</span>` : ''}</span></div><button type="button" class="btn sm gold" data-act="bmbuy" data-i="${i}"${!o.sold && S.gold >= o.price ? '' : ' disabled'}>${o.sold ? '팔림' : fmt(o.price) + 'G'}</button></div>`).join('');
  return `<div class="card hl"><div class="h">암시장</div><div class="sub">출처를 묻지 않는 물건들. 값은 비싸지만 날마다 새 장비 · 룬 · 암시장 전용 물건(금서 사냥꾼의 부적 · 희귀종 미끼)이 올라오고, 가끔 밀거래 보물 지도도 있어요. 새벽 4시에 바뀌어요.</div></div><div class="list">${rows || '<div class="sub">오늘은 물건이 없어요.</div>'}</div>`;
};
PANELS.au = () => {
  const A = S.under.au;
  if (!A.g) return `<div class="card"><div class="sub">오늘 경매는 끝났어요. 새벽 4시에 새 경매품이 올라와요.</div></div>`;
  const g = A.g, next = auBidNext(A), mine = A.top === 'me';
  return `<div class="card hl"><div class="h">오늘의 경매품</div>
    <div class="row">${gArt(g, 1)}<div class="grow stack"><span>${gearName(g)} ${qTag(g)}</span><span class="sub">${statLine(gearStats(g))}${g.bonus ? ' · 보너스 ' + Object.entries(g.bonus).map(([k, v]) => `${STAT_NAMES[k]} +${v}`).join(', ') : ''}</span><span class="sub muted">룬 칸 ${runeSlots(g)}개 · 시작가 ${fmt(A.start)}G</span></div></div>
    <div class="stats boxed"><span>지금 값 <b class="gold-t">${fmt(A.price)}G</b></span><span>최고 입찰 <b>${A.top === 'me' ? '우리 상단' : A.top === 'npc' ? esc(A.npc) : '아직 없음'}</b></span><span>입찰 ${A.bids}번</span></div>
    <div class="sub">${mine ? (A.out ? `<span class="ok-t">${esc(A.npc)}이(가) 물러섰어요.</span> 새벽 4시에 낙찰돼요.` : '지금은 우리가 최고 입찰자예요. 새벽 4시까지 아무도 더 부르지 않으면 낙찰돼요. 다른 상단이 더 부르면 돈은 돌려받아요.') : `다음 입찰은 ${fmt(next)}G. 돈은 입찰할 때 맡겨 두고, 밀리면 돌려받아요.`}</div>
    <button type="button" class="btn gold block" data-act="aubid"${!mine && S.gold >= next ? '' : ' disabled'}>${mine ? '최고 입찰 중' : `${fmt(next)}G 부르기`}</button></div>
    <div class="sub muted">경매품은 날마다 한 점, 영웅 장비가 올라와요. 전설부터는 높은 단계 땅의 드랍으로만 나와요.</div>`;
};
PANELS.ag = () => `<div class="card hl"><div class="h">암살자 길드 본부</div><div class="sub">지하수로 가장 깊은 곳, 등불 하나 없는 문 뒤에 길드장 검은 두건이 앉아 있다. 7번가의 모든 상단은 이들에게 자릿세를 낸다.</div></div>
  <div class="card"><div class="row"><span class="grow">매달 자릿세</span><span class="num ${S.flags.guildDown ? 'ok-t' : 'red-t'}">${S.flags.guildDown ? '없음 (토벌 완료)' : fmt(rent()) + 'G'}</span></div>
  <div class="sub">${S.flags.guildDown ? '길드를 토벌한 뒤로 자릿세를 받으러 오지 않는다.' : `길드를 토벌하면 자릿세가 사라진다. 토벌은 명성 ${GUILD_RAID.fame}, 모험가 ${GUILD_RAID.advs}명, 후원 조건을 채운 뒤 원정 창의 「7번가 뒷골목」에서.`}</div></div>
  <div class="sub muted">길드원들은 투기장과 암시장도 손에 쥐고 있다. 투기장 코인의 일부는 이들 주머니로 들어간다.</div>`;
Object.assign(ACT, {
  arparty: d => { UI.arP = +d.id; renderPanel(true); },
  arfight: d => { const m = startArena(+d.p, +d.i); if (m) say(m); else { showWin(false); } },
  arbuy: d => say(arenaBuy(d.k, d.id)),
  bmbuy: d => say(bmBuy(+d.i)),
  aubid: () => say(auBid()),
  kingbuy: d => say(kingBuy(+d.i))
});
