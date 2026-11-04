/* ───────── 지도 이벤트: 하르겐 몬스터 웨이브 방어전 · 왕국 축제 · 떠돌이 상인 ─────────
   S.events = [{ id, type: 'wave'|'fest'|'merchant', ... }], S.evNext = { wave, fest, merchant } (다음에 뜨는 날) */
const EV_GAP = { wave: [9, 14], fest: [10, 16], merchant: [6, 10], nest: [7, 12] };
const WAVE_FIELD = 'wave';
FIELDS[WAVE_FIELD] = { no: 0, name: '하르겐 성문', lv: 1, bg: 'front', tier: 0, mons: [], raid: 1, dungeon: null, next: null, event: 1, desc: '제도 하르겐의 성문 앞. 몰려오는 몬스터를 막는다.' };
Object.assign(WIN_TITLE, { merchant: '떠돌이 상인' });
function evState() { if (!S.events) S.events = []; if (!S.evNext) S.evNext = {}; return S.events; }
const evOf = id => evState().find(x => x.id === id);
const evActive = type => evState().filter(x => x.type === type && !x.done);
const cityDamaged = () => !!(S.flags && S.flags.damaged && S.flags.damaged > today());

/* 날마다 */
function eventsDay(k) {
  const E = evState(), N = S.evNext;
  if ((S.rank || 0) < 1) return;
  // 끝난 것 치우기
  for (const ev0 of E) {
    if (ev0.type === 'wave' && !ev0.done && k >= ev0.arrive && !ev0.party) waveFail(ev0, '막는 파티가 없어');
    if ((ev0.type === 'fest' || ev0.type === 'merchant') && k >= ev0.end) ev0.done = 1;
    if (ev0.type === 'nest' && !ev0.done && k >= ev0.end) { ev0.done = 1; log(`${FIELDS[ev0.at].name}의 몬스터 둥지가 흩어졌다. (${ev0.got}/${ev0.need})`); }
  }
  S.events = E.filter(x => !x.done || (x.type === 'wave' && k < x.arrive + 2));
  for (const type of ['wave', 'fest', 'merchant', 'nest']) {
    if (N[type] == null) N[type] = k + ri(2, EV_GAP[type][1]);
    if (k < N[type] || evActive(type).length) continue;
    const made = type === 'wave' ? newWave(k) : type === 'fest' ? newFest(k) : type === 'nest' ? newNest(k) : newMerchant(k);
    if (made) { if (!S.events.includes(made)) S.events.push(made); N[type] = k + ri(EV_GAP[type][0], EV_GAP[type][1]); }
  }
}
/* 몬스터 웨이브: 열린 필드 하나에서 몬스터가 하르겐으로 몰려온다 */
function newWave(k) {
  const pool = TIER_FIELDS.filter(f => isUnlocked(f) && FIELDS[f].mons.length);
  if (!pool.length) return null;
  const from = pickOne(pool), F = FIELDS[from], n = 3 + Math.min(2, Math.floor(F.tier / 2));
  const ev0 = { id: nid(), type: 'wave', from, born: k, arrive: k + ri(3, 5), n, lv: F.lv + 8, party: null, done: 0 };
  log(`${F.name} 쪽에서 몬스터 떼가 하르겐으로 몰려온다! ${ev0.arrive - k}일 뒤 성문에 닿는다. 지도에서 방어전 파티를 보내자.`, 'warn');
  queueModal({ title: '몬스터 웨이브', body: [`${F.name}의 몬스터들이 떼를 지어 제도 하르겐으로 몰려오고 있다. 성문에 닿기까지 ${ev0.arrive - k}일.`, `모험가 길드가 상단에 방어를 청했다. 지도에서 웨이브를 누르고 파티를 보내면 성문 앞에서 ${n}차례 밀려오는 몬스터를 막는다(Lv${ev0.lv}쯤, 마지막엔 우두머리).`, '막으면 명성과 상금, 전리품을 얻는다. 막지 못하거나 내버려 두면 도시가 어지러워져 사흘 동안 손님이 줄고 명성이 깎인다.'] });
  return ev0;
}
function waveReward(ev0) { const F = FIELDS[ev0.from]; return { gold: Math.round((F.lv * 60 + 800) * ev0.n / 3 / 10) * 10, fame: 15 + F.tier * 5 }; }
function waveWhy(ev0, p) {
  if (!ev0 || ev0.done) return '끝난 이벤트예요';
  if (ev0.party) return '이미 파티가 나가 있어요';
  if (!p) return '보낼 파티를 고르세요';
  if (p.exp) return '원정 중인 파티예요';
  if (p.raidOnly) return '레이드 전용 파티는 레이드에만 나가요';
  const team = p.members.map(advById).filter(a => a && a.status === 'idle');
  if (!team.length || team.length !== p.members.length) return '대기 중인 모험가만 보낼 수 있어요';
  const why = team.map(cantGo).find(Boolean);
  return why || '';
}
function startWave(pid, evId) {
  const p = findP(pid), ev0 = evOf(evId), why = waveWhy(ev0, p);
  if (why) return why + '.';
  const team = p.members.map(advById);
  const sup = {};
  for (const [k, q] of Object.entries(p.sup || {})) { const take = Math.min(S.inv[k] || 0, q); if (take > 0) { sup[k] = take; addTo(S.inv, k, -take); } }
  const e = newExp(WAVE_FIELD, sup, 1);
  e.area = 'wave'; e.encs = []; e.wave = { id: ev0.id, from: ev0.from, n: ev0.n, cur: 0, lv: ev0.lv }; e.done = 0; e.gap = 1.5; e.pos = STAGE_LEN * 0.3;
  formParty(p);
  p.exp = e; ev0.party = p.id;
  team.forEach(a => { a.status = 'away'; a.down = false; a.mp = derive(a).maxMp; });
  S.view = p.id;
  log(`${p.name}이(가) 하르겐 성문으로 나가 몬스터 웨이브를 막는다.`);
  changed();
  return '';
}
function waveFoes(e) {
  const W = e.wave, F = FIELDS[W.from], pool = F.mons, last = W.cur === W.n - 1, lv = W.lv + W.cur * 2, out = [];
  if (last) out.push(fieldBoss(F, 30, lv));
  const n = Math.min(5, 2 + W.cur + (last ? 0 : 1));
  for (let i = 0; i < n; i++) out.push(foeFrom(pickOne(pool), lv));
  return out;
}
function stepWave(p, e, team, dm, dt, fr) {
  const W = e.wave;
  if (e.foes.length) {
    tire(team, FATIGUE.fight * fr * dt);
    battle(p, e, team, dm, dt);
    if (!p.exp) return;
    if (!e.foes.length && !e.done) { W.cur++; if (W.cur >= W.n) waveEnd(p, e, true); else { e.gap = 2.5; ev(e, 'wave', { cur: W.cur, n: W.n }); } }
    return;
  }
  if (e.done) { e.pos -= moveOf(p) * 1.2 * dt; if (e.pos <= 0) arrive(p); return; }
  team.forEach(a => { const d = dm[a.id]; a.mp = Math.min(d.maxMp, a.mp + d.maxMp * 0.05 * d.mpRegen * dt); });
  e.gap -= dt;
  if (e.gap <= 0) {
    e.foes = waveFoes(e); e.cd = {}; e.buffs = []; e.taunt = null;
    ev(e, 'spawn', { boss: W.cur === W.n - 1, name: `${W.cur + 1}번째 무리` });
    log(`${W.cur + 1}번째 몬스터 무리가 성문으로 밀려온다!${W.cur === W.n - 1 ? ' 우두머리가 보인다.' : ''}`);
  }
}
function waveEnd(p, e, win) {
  const ev0 = evOf(e.wave.id), F = FIELDS[e.wave.from];
  if (win) {
    const R = waveReward(ev0 || e.wave);
    S.gold += R.gold; S.stats.earned += R.gold; S.fame += R.fame;
    if (ev0) { ev0.done = 1; ev0.won = 1; }
    S.stats.waves = (S.stats.waves || 0) + 1;
    log(`${p.name}이(가) 하르겐 성문에서 ${F.name}의 몬스터 웨이브를 모두 막아 냈다! 상금 ${g$(R.gold)}, 명성 +${R.fame}`, 'good');
    HOOKS.toast(`방어전 승리 · ${g$(R.gold)} · 명성 +${R.fame}`);
    queueModal({ title: '방어전 승리', body: [`${p.name}이(가) 성문 앞에서 ${e.wave.n}차례 밀려온 몬스터를 모두 쓰러뜨렸다. 시민들이 환호한다.`, `모험가 길드의 상금 ${g$(R.gold)}과 명성 +${R.fame}. 전리품은 창고로.`] });
  } else if (ev0 && !ev0.done) waveFail(ev0, `${p.name}이(가) 밀려나`);
  ev(e, 'arena', { win: win ? 1 : 0 });
  e.done = 1; e.mode = 'return'; e.why = 'wave'; e.foes = []; e.cd = {}; e.buffs = []; e.taunt = null;
  changed();
}
function waveFail(ev0, how) {
  ev0.done = 1; ev0.won = 0;
  S.fame = Math.max(0, S.fame - 10); S.flags.damaged = today() + 3;
  log(`${how} 몬스터가 하르겐 거리로 들어왔다. 명성 -10, 사흘 동안 손님이 준다.`, 'bad');
  queueModal({ title: '방어 실패', body: [`${how} 몬스터 떼가 하르겐 성문을 넘었다. 거리가 어지러워 사흘 동안 상점 손님이 30% 준다. 명성 -10.`] });
}
function waveWipe(p) {
  const e = p.exp;
  waveEnd(p, e, false);
  teamOf(p).forEach(a => { const d = derive(a); a.down = false; a.hp = Math.max(1, Math.round(d.maxHp * 0.3)); });
  e.pos = Math.min(e.pos, STAGE_LEN * 0.2);
}
/* 왕국 축제: 사흘 동안 그 왕국이 사 가는 값 두 배, 파는 값 30% 할인. 축제 시작에 상단이 찾아온다 */
function newFest(k) {
  const open = KINGDOM_IDS.filter(kingOpen); if (!open.length) return null;
  const kid = pickOne(open), D = KINGDOMS[kid], ev0 = { id: nid(), type: 'fest', k: kid, born: k, end: k + 3, done: 0 };
  log(`${D.name}에서 축제가 열렸다! 사흘 동안 ${D.name} 상단이 물건을 두 배로 쳐주고, 가져온 물건은 30% 싸다.`, 'good');
  queueModal({ title: `${D.name} 축제`, body: [`${D.name}의 축제 기간이다. 축제에 쓸 물건을 구하러 상단이 찾아왔다.`, `사흘 동안 ${D.name} 상단이 사 가는 값이 두 배, 가져온 물건과 스킬북은 30% 싸다. 상단 창의 왕국 교역에서 거래하자.`] });
  S.events.push(ev0);
  if (!S.king.visit || S.king.visit.k !== kid) { S.king.visit = null; kingArriveFor(kid, 3); }
  else S.king.visit.until = Math.max(S.king.visit.until, k + 3);
  return ev0;
}
const festOf = kid => evActive('fest').find(x => x.k === kid);
const festSellMul = kid => (festOf(kid) ? 2 : 1);
const festBuyMul = kid => (festOf(kid) ? 0.7 : 1);
/* 떠돌이 상인: 필드 하나 옆에 이틀 머물며 귀한 것을 비싸게 판다 */
function newMerchant(k) {
  const pool = TIER_FIELDS.filter(isUnlocked); if (!pool.length) return null;
  const at = pickOne(pool), stock = [];
  const eggs = PET_IDS.filter(x => isUnlocked(PETS[x].field)).sort(() => rnd() - 0.5).slice(0, 2);
  eggs.forEach(x => stock.push({ it: 'egg_' + x, n: 1, price: Math.round(ITEMS['egg_' + x].v * 2.2 / 10) * 10 }));
  const b = pickOne(BOOK_IDS); if (ITEMS['book_' + b]) stock.push({ it: 'book_' + b, n: 1, price: Math.round(ITEMS['book_' + b].v * 2.5 / 10) * 10 });
  const r = runeId(pickOne(RUNE_IDS), 1); if (ITEMS[r]) stock.push({ it: r, n: 2, price: Math.round(ITEMS[r].v * 2 / 10) * 10 });
  HERB_IDS.filter(h => h !== 'herb').sort(() => rnd() - 0.5).slice(0, 2).forEach(h => stock.push({ it: h, n: 8, price: Math.round(ITEMS[h].v * 1.8) }));
  const ev0 = { id: nid(), type: 'merchant', at, born: k, end: k + 2, stock, done: 0 };
  log(`떠돌이 상인이 ${FIELDS[at].name} 근처에 천막을 쳤다. 이틀 동안 머문다. 지도에서 만나자.`, 'good');
  HOOKS.toast(`떠돌이 상인 · ${FIELDS[at].name} 근처 · 이틀`);
  return ev0;
}
function merchantBuy(evId, i) {
  const ev0 = evOf(evId), o = ev0 && ev0.stock[i];
  if (!o || o.n <= 0) return '다 팔렸어요.';
  if (ev0.done) return '상인이 떠났어요.';
  if (S.gold < o.price) return '돈이 모자라요.';
  S.gold -= o.price; o.n--; S.stats.spent = (S.stats.spent || 0) + o.price;
  addTo(S.inv, o.it, 1);
  log(`떠돌이 상인에게서 ${ITEMS[o.it].name}을(를) ${g$(o.price)}에 샀다.`);
  changed();
  return `${ITEMS[o.it].name}을(를) 샀어요.`;
}
/* 몬스터 둥지: 열린 필드 하나에 사흘 동안 둥지가 생긴다. 둥지 몬스터를 NEST.need마리 잡으면 치운 보상 */
function newNest(k) {
  const pool = TIER_FIELDS.filter(f => isUnlocked(f) && FIELDS[f].mons.length && (S.fields[f].best || 0) >= 5); if (!pool.length) return null;
  const at = pickOne(pool), F = FIELDS[at];
  const ev0 = { id: nid(), type: 'nest', at, born: k, end: k + NEST.days, need: NEST.need, got: 0, done: 0 };
  log(`${F.name}에 몬스터 둥지가 생겼다! ${NEST.days}일 동안 둥지 몬스터(강하고 전리품 두 배)가 섞여 나온다. ${NEST.need}마리 잡으면 둥지를 치운 보상을 받는다.`, 'warn');
  HOOKS.toast(`몬스터 둥지 · ${F.name} · ${NEST.days}일`);
  queueModal({ title: '몬스터 둥지', body: [`${F.name}에 몬스터 둥지가 생겼다. ${NEST.days}일 동안 그 필드에서 둥지 몬스터가 섞여 나온다. 보통 개체보다 체력 ${Math.round((NEST.hp - 1) * 100)}%·공격 ${Math.round((NEST.atk - 1) * 100)}% 강하고, 전리품을 두 배로 떨어뜨린다.`, `둥지 몬스터를 ${NEST.need}마리 잡으면 둥지를 치운 것으로 보고 모험가 길드가 상금과 명성, 그리고 그 필드의 알을 준다. 원정대 창에서 ${F.name}(으)로 파티를 보내자.`] });
  return ev0;
}
function nestReward(ev0) { const F = FIELDS[ev0.at]; return { gold: Math.round((F.lv * 90 + 1200) / 10) * 10, fame: 12 + F.tier * 3 }; }
// 둥지 몬스터를 잡을 때 (kill에서 부른다)
function nestKill(p, e, f) {
  const ev0 = nestAt(e.field); if (!ev0 || ev0.done) return;
  ev0.got++;
  if (ev0.got < ev0.need) { if (ev0.got % 4 === 0) log(`${p.name}이(가) ${FIELDS[ev0.at].name}의 둥지 몬스터를 ${ev0.got}/${ev0.need}마리 잡았다.`); return; }
  ev0.done = 1; ev0.won = 1;
  const R = nestReward(ev0), F = FIELDS[ev0.at], kinds = petsOfField(ev0.at), egg = kinds.length ? 'egg_' + pickOne(kinds) : null;
  S.gold += R.gold; S.stats.earned += R.gold; S.fame += R.fame; S.stats.nests = (S.stats.nests || 0) + 1;
  if (egg) addTo(S.inv, egg, 1);
  teamOf(p).filter(a => !a.down).forEach(a => { a.pf = (a.pf || 0) + 4; });
  log(`${p.name}이(가) ${F.name}의 몬스터 둥지를 치웠다! 상금 ${g$(R.gold)}, 명성 +${R.fame}${egg ? `, ${ITEMS[egg].name}` : ''}`, 'good');
  HOOKS.toast(`둥지 소탕 · ${g$(R.gold)} · 명성 +${R.fame}`);
  queueModal({ title: '둥지 소탕', body: [`${p.name}이(가) ${F.name}의 둥지 몬스터 ${ev0.need}마리를 잡아 둥지를 치웠다.`, `모험가 길드의 상금 ${g$(R.gold)}과 명성 +${R.fame}${egg ? `. 둥지에서 ${ITEMS[egg].name}을(를) 찾아 창고에 넣었다` : ''}.`] });
}
/* 지도 노드와 카드 */
function eventNodes(sel) {
  const out = [], k = today();
  for (const ev0 of evActive('wave')) {
    const A = MAP_NODES[ev0.from], C = MAP_ORGS.city, u = Math.max(0, Math.min(1, 1 - (ev0.arrive - k) / Math.max(1, ev0.arrive - ev0.born)));
    const x = A.x + (C.x - A.x) * (0.15 + 0.7 * u), y = A.y + (C.y - A.y) * (0.15 + 0.7 * u);
    out.push(mapNodeHtml('event', ev0.id, x, y, `evn wave${sel.k === 'event' && sel.id === ev0.id ? ' on' : ''}`, '<i class="mn">⚔</i>', `웨이브 D-${Math.max(0, ev0.arrive - k)}`));
  }
  for (const ev0 of evActive('merchant')) { const A = MAP_NODES[ev0.at]; out.push(mapNodeHtml('event', ev0.id, A.x - 18, A.y + 14, `evn mer${sel.k === 'event' && sel.id === ev0.id ? ' on' : ''}`, '<i class="mn">$</i>', '떠돌이 상인')); }
  for (const ev0 of evActive('fest')) { const P = MAP_KINGS[ev0.k]; out.push(mapNodeHtml('event', ev0.id, P.x + 14, P.y - 6, `evn fest${sel.k === 'event' && sel.id === ev0.id ? ' on' : ''}`, '<i class="mn">★</i>', '축제')); }
  for (const ev0 of evActive('nest')) { const A = MAP_NODES[ev0.at]; if (!A || FIELDS[ev0.at].region === 'sky') continue; out.push(mapNodeHtml('event', ev0.id, A.x + 16, A.y - 12, `evn nest${sel.k === 'event' && sel.id === ev0.id ? ' on' : ''}`, '<i class="mn">◉</i>', `둥지 ${ev0.got}/${ev0.need}`)); }
  return out.join('');
}
function eventCard(id) {
  const ev0 = evOf(id), k = today();
  if (!ev0 || ev0.done) return '<div class="card"><div class="sub muted">끝난 이벤트예요.</div></div>';
  if (ev0.type === 'wave') {
    const F = FIELDS[ev0.from], R = waveReward(ev0), parties = S.parties.filter(p => !p.exp && !p.raidOnly), sp = parties.find(p => p.id === UI.mapP) || parties[0], why = waveWhy(ev0, sp);
    const picker = parties.length ? `<div class="btns">${parties.map(p => `<button type="button" class="btn sm${sp && sp.id === p.id ? ' on' : ''}" data-act="mapparty" data-id="${p.id}">${esc(p.name)} · ${p.members.length}명 · Lv${Math.round(avgLvOf(p))}</button>`).join('')}</div>` : '<div class="sub red-t">대기 중인 파티가 없어요.</div>';
    return `<div class="card hl"><div class="h">몬스터 웨이브 <small>성문까지 D-${Math.max(0, ev0.arrive - k)}</small></div><div class="sub">${F.name}의 몬스터 떼가 하르겐으로 몰려온다. ${ev0.n}차례 밀려오고(Lv${ev0.lv}~${ev0.lv + ev0.n * 2}), 마지막엔 우두머리가 온다.</div><div class="sub muted">몬스터: ${F.mons.map(m => MONS[m].name).join(', ')}</div><div class="sub gold-t">막으면 상금 ${fmt(R.gold)}G · 명성 +${R.fame} · 전리품</div></div>
      ${ev0.party ? `<div class="sub ok-t">${esc((findP(ev0.party) || {}).name || '파티')}이(가) 성문에서 싸우는 중</div>` : `<div class="sec"><b>방어전 파티</b><span>보급품은 원정대 창의 설정대로</span></div>${picker}${why ? `<div class="sub red-t">${esc(why)}</div>` : ''}<button type="button" class="btn gold block" data-act="wavego" data-id="${ev0.id}" data-p="${sp ? sp.id : 0}"${why ? ' disabled' : ''}>${sp ? `${esc(sp.name)} 방어전 시작` : '방어전 시작'}</button>`}`;
  }
  if (ev0.type === 'nest') {
    const F = FIELDS[ev0.at], R = nestReward(ev0), kinds = petsOfField(ev0.at);
    return `<div class="card hl"><div class="h">몬스터 둥지 <small>${F.name} · D-${Math.max(0, ev0.end - k)}</small></div><div class="sub">${F.name}에 둥지 몬스터(체력 ×${NEST.hp}·공격 ×${NEST.atk}, 전리품 두 배)가 섞여 나온다. 잡은 수 <b class="num">${ev0.got}/${ev0.need}</b></div><div class="sub muted">몬스터: ${F.mons.map(m => MONS[m].name).join(', ')}</div><div class="sub gold-t">치우면 상금 ${fmt(R.gold)}G · 명성 +${R.fame}${kinds.length ? ` · ${kinds.map(x => ITEMS['egg_' + x].name).join('/')}` : ''}</div></div>
      <button type="button" class="btn gold block" data-act="mapexp" data-f="${ev0.at}" data-d="0">원정대 창에서 보내기</button>`;
  }
  if (ev0.type === 'fest') {
    const D = KINGDOMS[ev0.k], v = S.king && S.king.visit && S.king.visit.k === ev0.k;
    return `<div class="card hl"><div class="h">${D.name} 축제 <small>D-${Math.max(0, ev0.end - k)}</small></div><div class="sub">축제 동안 ${D.name} 상단이 사 가는 값이 <b>두 배</b>, 가져온 물건과 스킬북은 <b>30% 할인</b>.</div><div class="sub muted">${v ? '지금 상단이 와 있어요 · 상단 창 → 왕국 교역' : '상단이 곧 찾아와요'}</div></div><button type="button" class="btn gold block" data-act="sub" data-id="co_king">왕국 교역 열기</button>`;
  }
  const rows = ev0.stock.map((o, i) => `<div class="li">${iconImg(o.it)}<div class="grow stack"><span>${ITEMS[o.it].name} <span class="muted">· 남은 ${o.n}</span></span><span class="sub">${ITEMS[o.it].desc || (ITEMS[o.it].book ? `${SKILLS[ITEMS[o.it].book].desc}<br>${skillSpecLine(ITEMS[o.it].book)}` : '')}</span></div><button type="button" class="btn sm gold" data-act="merbuy" data-id="${ev0.id}" data-i="${i}"${o.n > 0 && S.gold >= o.price ? '' : ' disabled'}>${fmt(o.price)}G</button></div>`).join('');
  return `<div class="card hl"><div class="h">떠돌이 상인 <small>${FIELDS[ev0.at].name} 근처 · D-${Math.max(0, ev0.end - k)}</small></div><div class="sub">"어디서도 못 구하는 것들이지. 값은 좀 나가네." 알, 스킬북, 룬, 약초를 판다.</div></div><div class="list">${rows}</div>`;
}
Object.assign(ACT, {
  wavego: d => { const m = startWave(+d.p, +d.id); if (m) say(m); else { say('방어전 시작!'); showWin(false); } },
  merbuy: d => say(merchantBuy(+d.id, +d.i))
});
