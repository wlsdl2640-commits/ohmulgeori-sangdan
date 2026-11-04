/* ───────── 빌드 31: 편의 기능 ─────────
   모두 자동 장착 · 파티 편성 저장/불러오기 · 반복 출발 횟수 · 부속품·장비 한꺼번에 팔기 · 파티 모두 출발/복귀.
   파티 인원: 짐꾼 계열을 빼고 넷까지, 짐꾼 계열 한 명을 더해 모두 다섯. */
const fightersOf = p => teamOf(p).filter(a => !isPorter(a));
function partyWhy(p) {
  if (portersOf(p).length > 1) return '짐꾼 계열은 파티당 한 명만 넣을 수 있어요.';
  if (fightersOf(p).length > PARTY_FIGHTERS) return `파티는 짐꾼 계열을 빼고 ${PARTY_FIGHTERS}명까지예요. ${fightersOf(p).length - PARTY_FIGHTERS}명을 빼야 출발해요.`;
  return '';
}
// 인원을 넘는 파티: 레벨이 낮은 쪽부터 뺀다 (대기 중일 때만)
function trimParty(p) {
  if (p.exp) return 0;
  let n = 0;
  const f = fightersOf(p).sort((a, b) => b.lv - a.lv);
  f.slice(PARTY_FIGHTERS).forEach(a => { p.members = p.members.filter(id => id !== a.id); n++; });
  const ps = portersOf(p).sort((a, b) => b.lv - a.lv);
  ps.slice(1).forEach(a => { p.members = p.members.filter(id => id !== a.id); n++; });
  return n;
}
/* 모두 자동 장착: 대기 중인 모험가 모두 (레벨 높은 사람이 먼저 고른다) */
function autoEquipAll(list) {
  const advs = (list || S.advs.filter(a => a.status === 'idle')).slice().sort((a, b) => b.lv - a.lv);
  let n = 0;
  for (const a of advs) if (a.status === 'idle' && !autoEquip(a.id)) n++;
  changed();
  return n ? `${n}명이 더 좋은 장비로 바꿨어요.` : '바꿀 장비가 없어요.';
}
/* 편성 저장·불러오기 */
const PRESET_MAX = 8;
function savePreset(pid) {
  const p = findP(pid); if (!p || !p.members.length) return '파티원이 없어요.';
  S.presets = S.presets || [];
  if (S.presets.length >= PRESET_MAX) return `편성은 ${PRESET_MAX}개까지 저장해요. 하나를 지워 주세요.`;
  const names = p.members.map(advById).filter(Boolean).map(a => a.name);
  S.presets.push({ id: nid(), name: `${p.name} · ${names.slice(0, 2).join('·')}${names.length > 2 ? ` 외 ${names.length - 2}` : ''}`, members: p.members.slice(), dest: p.dest, sup: Object.assign({}, p.sup), food: p.food || null, start: p.start || 1, autoCook: !!p.autoCook });
  changed();
  return '';
}
function loadPreset(pid, prid) {
  const p = findP(pid), pr = (S.presets || []).find(x => x.id === prid);
  if (!p || !pr) return '';
  if (p.exp) return '원정 중인 파티예요.';
  const out = [], skip = [];
  for (const id of pr.members) {
    const a = advById(id);
    if (!a) { skip.push('떠난 모험가'); continue; }
    const o = partyOf(id);
    if (a.status !== 'idle' || (o && o !== p && o.exp)) { skip.push(a.name); continue; }
    if (o && o !== p) o.members = o.members.filter(x => x !== id);
    out.push(id);
  }
  p.members = out;
  trimParty(p);
  if (pr.dest && FIELDS[pr.dest]) p.dest = pr.dest;
  p.sup = Object.assign({}, pr.sup || {}); p.food = pr.food || null; p.start = pr.start || 1; p.autoCook = !!pr.autoCook;
  changed();
  return skip.length ? `불러왔어요. ${skip.join(', ')}은(는) 지금 넣을 수 없어 뺐어요.` : '';
}
function delPreset(prid) { S.presets = (S.presets || []).filter(x => x.id !== prid); changed(); return ''; }
function presetBox(p) {
  const list = S.presets || [];
  return `<details class="card"${UI.presetOpen ? ' open' : ''}><summary>편성 저장 · 불러오기 <small class="muted">${list.length}/${PRESET_MAX}</small></summary>
    <div class="btns"><button type="button" class="btn sm gold" data-act="psave" data-id="${p.id}"${p.members.length && list.length < PRESET_MAX ? '' : ' disabled'}>지금 편성 저장</button></div>
    <div class="list">${list.map(pr => `<div class="li"><div class="grow stack"><span>${esc(pr.name)}</span><span class="sub muted">${pr.members.map(advById).filter(Boolean).map(a => `${esc(a.name)} Lv${a.lv}`).join(', ') || '모두 떠남'}${pr.dest && FIELDS[pr.dest] ? ` · ${FIELDS[pr.dest].name}` : ''}${pr.food ? ` · ${FOODS[pr.food].name}` : ''}</span></div><div class="btns"><button type="button" class="btn sm" data-act="pload" data-id="${p.id}" data-p="${pr.id}">불러오기</button><button type="button" class="btn sm red" data-act="pdel" data-p="${pr.id}">지우기</button></div></div>`).join('') || '<div class="sub muted">저장한 편성이 없어요. 파티원·목적지·보급품·도시락을 한꺼번에 저장해요.</div>'}</div></details>`;
}
/* 반복 출발 횟수 */
const REPEAT_N = [0, 3, 5, 10];
function repeatChips(p) {
  if (!p.repeat) return '';
  const cur = p.repeatLeft == null ? 0 : (p.repeatSet || 0);
  return `<div class="row sub"><span class="grow">다시 출발 · ${p.repeatLeft == null ? '계속' : `${p.repeatLeft}번 남음`}</span></div><div class="chips">${REPEAT_N.map(k => `<button type="button" class="chip${cur === k ? ' on' : ''}" data-act="prep" data-id="${p.id}" data-n="${k}">${k ? `${k}번` : '계속'}</button>`).join('')}</div>`;
}
/* 한꺼번에 팔기 */
const bulkMats = () => Object.keys(S.inv).filter(k => ITEMS[k] && S.inv[k] > 0 && itemCat(k) === 'mat' && !ITEMS[k].boss && !ITEMS[k].trade && !k.startsWith('egg_') && k !== 'tmap').map(k => [k, Math.max(0, S.inv[k] - reqNeed(k))]).filter(([, q]) => q > 0);
const bulkMatValue = () => Math.round(bulkMats().reduce((t, [k, q]) => t + ITEMS[k].v * guildRate() * q, 0));
function sellAllMats() {
  const list = bulkMats(); if (!list.length) return '팔 부속품이 없어요.';
  let g = 0, n = 0;
  for (const [k, q] of list) { const v = Math.round(ITEMS[k].v * guildRate() * q); addTo(S.inv, k, -q); g += v; n += q; }
  S.gold += g; S.stats.earned += g; S.stats.soldG = (S.stats.soldG || 0) + g;
  log(`부속품 ${n}개를 모험가 길드에 한꺼번에 ${g$(g)}에 팔았다. (의뢰품·보스 부속품·교역품·알은 남겼다)`);
  HOOKS.toast(`부속품 ${n}개 · ${g$(g)}`);
  changed();
  return '';
}
const bulkGears = () => S.gear.filter(g => (g.q || 0) <= 1 && !g.plus && !(g.runes || []).some(Boolean) && !g.lock);
function sellLowGear() {
  const list = bulkGears(); if (!list.length) return '팔 장비가 없어요.';
  let g = 0;
  for (const x of list) { g += Math.round(gearValue(x) * GEAR_SELL); }
  S.gear = S.gear.filter(x => !list.includes(x));
  S.gold += g; S.stats.earned += g; S.stats.soldG = (S.stats.soldG || 0) + g;
  log(`일반·고급 장비 ${list.length}점을 ${g$(g)}에 한꺼번에 팔았다. (강화·룬 붙은 것은 남겼다)`);
  HOOKS.toast(`장비 ${list.length}점 · ${g$(g)}`);
  changed();
  return '';
}
/* 파티 모두 출발 · 모두 복귀 */
function departAll() {
  let n = 0; const why = [];
  for (const p of S.parties) { if (p.exp || !p.members.length) continue; const m = startExp(p, p.dest && isUnlocked(p.dest) ? p.dest : 'plains'); if (m) why.push(`${p.name}: ${m}`); else n++; }
  return n ? (why.length ? `${n}팀 출발 · ${why[0]}` : `${n}팀이 출발했어요.`) : why[0] || '출발할 파티가 없어요.';
}
function recallAll() { let n = 0; for (const p of S.parties) if (p.exp && p.exp.mode === 'advance' && p.exp.area !== 'raid' && p.exp.area !== 'arena') { recall(p, ''); n++; } return n ? `${n}팀을 불러들였어요.` : '불러들일 파티가 없어요.'; }
Object.assign(ACT, {
  autoeqall: () => say(autoEquipAll()),
  psave: d => { UI.presetOpen = 1; say(savePreset(+d.id)); renderPanel(true); },
  pload: d => { UI.presetOpen = 1; say(loadPreset(+d.id, +d.p)); renderPanel(true); },
  pdel: d => { UI.presetOpen = 1; say(delPreset(+d.p)); renderPanel(true); },
  prep: d => { const p = findP(+d.id); if (!p) return; const k = +d.n; p.repeatSet = k; p.repeatLeft = k ? k : null; changed(); renderPanel(true); },
  sellallmat: () => confirmBox('부속품 모두 팔기', `부속품을 모두 모험가 길드에 팔까요? 약 ${g$(bulkMatValue())}. 의뢰에 쓸 몫·보스 부속품(증표·핵·혼)·교역품·알·보물 지도는 남겨요.`, '모두 팔기', () => { say(sellAllMats()); renderPanel(true); }),
  selllowgear: () => confirmBox('장비 한꺼번에 팔기', `일반·고급 장비 ${bulkGears().length}점을 팔까요? 약 ${g$(bulkGears().reduce((t, g) => t + Math.round(gearValue(g) * GEAR_SELL), 0))}. 강화했거나 룬을 끼운 장비는 남겨요.`, '팔기', () => { say(sellLowGear()); renderPanel(true); }),
  allgo: () => { say(departAll()); renderPanel(true); },
  allback: () => { say(recallAll()); renderPanel(true); }
});
