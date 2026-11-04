/* ───────── 빌드 34: 던전 수거소 ─────────
   공략한 던전에 수거꾼을 보내 날마다 그 던전 몬스터의 부속품을 조금씩 가져온다(econ.js onNewDay → salvageDay).
   던전 주인의 부속품(왕관·심장·원석…)은 던전마다 몫이 쌓여 1이 되면 하나, 단계 던전은 주인의 혼도 아주 가끔.
   상태 S.salv = { auto, pick[], acc{필드}, sacc{필드}, day, last{day, got{아이템: 수}, boss[], from[]} }. 데이터는 data-salv.js, 본부 지하 층은 iso.js. */
function salvState() {
  if (!S.salv) S.salv = { auto: true, pick: [], acc: {}, sacc: {}, day: -1, last: null };
  const st = S.salv; st.pick = st.pick || []; st.acc = st.acc || {}; st.sacc = st.sacc || {};
  return st;
}
// 수거꾼이 갈 수 있는 던전: 숨은 곳·레이드·보물 던전은 빼고
const salvIds = () => Object.keys(FIELDS).filter(f => { const F = FIELDS[f]; return F.dungeon && !F.hidden && !F.raid && !F.treasure && (F.dungeon.mons || []).length > 0; });
const salvOpen = () => salvIds().filter(f => S.fields[f] && S.fields[f].cleared);
const salvCrew = () => SALV.crew[S.bld.salvage || 0] || 0;
const salvRank = f => FIELDS[f].tier * 1000 + (FIELDS[f].lv || 0);
const salvSort = list => list.slice().sort((a, b) => salvRank(b) - salvRank(a));
// 수거꾼이 들를 던전: 자동이면 높은 단계부터 수거꾼 수만큼, 직접 골랐으면 고른 것만
function salvPicks() {
  const st = salvState(), open = salvOpen(), n = salvCrew();
  if (st.auto) return salvSort(open).slice(0, n);
  return st.pick.filter(f => open.includes(f)).slice(0, n);
}
// 그 던전 몬스터들이 떨어뜨리는 부속품 (확률이 무게)
function salvMatPool(f) {
  const D = FIELDS[f].dungeon, out = [];
  for (const id of D.mons) for (const [k, p] of ((MONS[id] && MONS[id].drops) || [])) if (ITEMS[k] && !ITEMS[k].egg && !ITEMS[k].boss) out.push([k, p]);
  return out;
}
function salvRollMat(pool) {
  const sum = pool.reduce((s, [, p]) => s + p, 0); let r = rnd() * sum;
  for (const [k, p] of pool) { r -= p; if (r <= 0) return k; }
  return pool.length ? pool[pool.length - 1][0] : null;
}
// 던전 주인만 떨어뜨리는 부속품 (졸개들도 떨어뜨리는 것은 빼고)
function salvBossParts(f) {
  const D = FIELDS[f].dungeon, B = MONS[D.boss];
  if (!B || !B.drops || !B.drops.length) return [];
  const common = new Set(D.mons.flatMap(id => ((MONS[id] && MONS[id].drops) || []).map(d => d[0])));
  const own = B.drops.map(d => d[0]).filter(k => ITEMS[k] && !common.has(k));
  return own.length ? own : [B.drops[0][0]].filter(k => ITEMS[k]);
}
const salvSoul = f => (TIER_FIELDS.includes(f) && ITEMS['soul_' + FIELDS[f].tier] ? 'soul_' + FIELDS[f].tier : null);
const salvMatsOf = lv => SALV.mats[lv] * (blessed('harvest') ? 1.15 : 1);   // 풍요신의 축복이면 조금 더
// 날마다 (새벽): 수거꾼이 던전마다 부속품을 가져온다. 가져온 수를 돌려준다
function salvageDay(k) {
  const lv = S.bld.salvage || 0; if (!lv) return 0;
  const st = salvState(); if (st.day === k) return 0;
  st.day = k;
  const picks = salvPicks(), got = {}, boss = [];
  for (const f of picks) {
    const pool = salvMatPool(f), m = salvMatsOf(lv), n = Math.floor(m) + (rnd() < m % 1 ? 1 : 0);
    for (let i = 0; i < n; i++) { const it = salvRollMat(pool); if (it) addTo(got, it, 1); }
    st.acc[f] = (st.acc[f] || 0) + SALV.boss[lv];
    if (st.acc[f] >= 1 - 1e-9) { st.acc[f] = Math.max(0, st.acc[f] - 1); const bp = salvBossParts(f); if (bp.length) { const it = pickOne(bp); addTo(got, it, 1); boss.push(it); } }
    const soul = salvSoul(f);
    if (soul) { st.sacc[f] = (st.sacc[f] || 0) + SALV.soul[lv]; if (st.sacc[f] >= 1 - 1e-9) { st.sacc[f] = Math.max(0, st.sacc[f] - 1); addTo(got, soul, 1); boss.push(soul); } }
  }
  let n = 0;
  for (const [it, q] of Object.entries(got)) { addTo(S.inv, it, q); n += q; }
  st.last = { day: k, got, boss, from: picks };
  S.stats.salvaged = (S.stats.salvaged || 0) + n; S.stats.salvBoss = (S.stats.salvBoss || 0) + boss.length;
  if (n) {
    log(`수거꾼이 던전 ${picks.length}곳에서 부속품 ${n}개를 가져왔다.${boss.length ? ` 주인 부속품: ${boss.map(b => ITEMS[b].name).join(', ')}` : ''}`, boss.length ? 'good' : '');
    if (typeof dexScan === 'function') dexScan();
  }
  return n;
}
// 수거꾼 보내기·빼기 (처음 손대면 자동 고르기를 끄고 지금 고른 것에서 시작한다)
function salvToggle(f) {
  const st = salvState(), open = salvOpen();
  if (!open.includes(f)) return '공략한 던전에만 보낼 수 있어요.';
  const cur = salvPicks();
  let next;
  if (cur.includes(f)) next = cur.filter(x => x !== f);
  else {
    if (cur.length >= salvCrew()) return `수거꾼이 모자라요 (${salvCrew()}명). 수거소를 넓히거나 다른 던전을 빼 주세요.`;
    next = cur.concat([f]);
  }
  st.pick = next; st.auto = false;
  changed();
  return '';
}
function salvAuto() { const st = salvState(); st.auto = true; st.pick = []; changed(); return ''; }
// 본부 벽 선반에 올려 둘 주인 부속품 색 (공략한 던전, 낮은 단계부터)
const salvTrophies = () => salvSort(salvOpen()).reverse().map(f => { const bp = salvBossParts(f)[0]; return bp ? ITEMS[bp].c || '#d0b040' : '#d0b040'; }).slice(0, 12);

/* ───────── 수거소 창 ───────── */
const salvDays = (acc, rate) => Math.max(1, Math.ceil((1 - (acc || 0)) / rate - 1e-9));
function salvRow(f, on, full) {
  const F = FIELDS[f], D = F.dungeon, lv = S.bld.salvage || 0, st = salvState();
  const bp = salvBossParts(f), mats = [...new Set(salvMatPool(f).map(([k]) => k))], soul = salvSoul(f);
  const bossTxt = bp.map(k => ITEMS[k].name).join('·');
  const when = on ? `다음까지 ${salvDays(st.acc[f], SALV.boss[lv])}일` : `${Math.round(1 / SALV.boss[lv])}일에 하나꼴`;
  return `<div class="li${on ? '' : ' dim'}">${iconImg(bp[0] || mats[0])}<div class="grow stack"><span>${esc(D.name)} <span class="muted">${esc(F.name)}</span>${on ? ' <span class="tag gold-t">수거 중</span>' : ''}</span>
    <span class="sub">부속품 ${mats.slice(0, 4).map(k => ITEMS[k].name).join('·')}${mats.length > 4 ? ' 외' : ''} · 하루 ${SALV.mats[lv]}개꼴</span>
    <span class="sub">주인 부속품 ${bossTxt} · ${when}${soul ? ` · ${ITEMS[soul].name} ${on ? `다음까지 ${salvDays(st.sacc[f], SALV.soul[lv])}일` : '아주 가끔'}` : ''}</span></div>
    <button type="button" class="btn sm${on ? '' : ' gold'}" data-act="salvpick" data-f="${f}"${!on && full ? ' disabled' : ''}>${on ? '빼기' : '보내기'}</button></div>`;
}
function salvLastRows() {
  const last = salvState().last; if (!last || !Object.keys(last.got || {}).length) return '';
  const boss = new Set(last.boss || []);
  return Object.entries(last.got).sort((a, b) => (boss.has(b[0]) - boss.has(a[0])) || ITEMS[b[0]].v - ITEMS[a[0]].v).map(([k, q]) =>
    `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name} <b class="num">×${q}</b>${boss.has(k) ? ' <span class="tag gold-t">주인</span>' : ''}</span><span class="sub muted">창고 ${S.inv[k] || 0} · ${ITEMS[k].v}G</span></div></div>`).join('');
}
BLD_INNER.salvage = '수거 현황';
BLD_SUM.salvage = () => {
  const last = salvState().last, picks = salvPicks(), n = last ? Object.values(last.got || {}).reduce((s, v) => s + v, 0) : 0;
  return `<div class="sub">수거꾼 ${picks.length}/${salvCrew()}명 · 공략한 던전 ${salvOpen().length}곳${last && n ? ` · ${dayLabel(last.day)} 새벽 부속품 ${n}개${last.boss.length ? ` · 주인 부속품 ${last.boss.length}개` : ''}` : ''}</div>`;
};
BLD_BOX.salvage = () => {
  const st = salvState(), open = salvSort(salvOpen()), picks = salvPicks(), crew = salvCrew(), full = picks.length >= crew;
  const locked = salvIds().length - open.length, last = st.last, rows = salvLastRows();
  return `<div class="sub">수거꾼은 낮에 던전에 다녀와 새벽에 가져온 것을 창고에 넣어요. 한 사람이 하루에 던전 한 곳씩 돌아요. 가져온 것은 자동 판매 설정을 따라요.</div>
    <div class="sec"><b>보낼 던전</b><span>${picks.length}/${crew}곳 · ${st.auto ? '자동: 높은 단계부터' : '직접 고름'}</span></div>
    ${st.auto ? '' : '<div class="btns"><button type="button" class="btn sm" data-act="salvauto">자동으로 고르기 (높은 단계부터)</button></div>'}
    <div class="list">${open.map(f => salvRow(f, picks.includes(f), full)).join('') || '<div class="sub muted">아직 공략한 던전이 없어요. 던전 주인을 쓰러뜨리면 그 던전에 수거꾼을 보낼 수 있어요.</div>'}</div>
    ${locked > 0 ? `<div class="sub muted">아직 공략하지 않은 던전 ${locked}곳 · 공략하면 여기에 생겨요.</div>` : ''}
    <div class="sec"><b>${last ? `${dayLabel(last.day)} 새벽에 가져온 것` : '가져온 것'}</b><span>모두 ${fmt(S.stats.salvaged || 0)}개 · 주인 부속품 ${S.stats.salvBoss || 0}개</span></div>
    <div class="list">${rows || '<div class="sub muted">아직 가져온 것이 없어요. 하루가 지나면 수거꾼이 돌아와요.</div>'}</div>`;
};
FLOOR_TXT.salvage = () => {
  const n = salvPicks().length, ph = phaseOf(S.t);
  if (!n) return '공략한 던전이 생기면 수거꾼이 나가요';
  return ph === 1 || ph === 2 ? `수거꾼 ${n}명이 던전에 나가 있어요` : `수거꾼 ${n}명 · 던전 ${n}곳을 돌아요`;
};
// 본부 지하 층: 분류대 앞의 장부 담당, 새벽·밤에는 돌아온 수거꾼이 손수레 곁에 (낮·저녁에는 던전에 나가 있다)
const SALVORS = () => [STAFF.salvor, STAFF.salvor2, STAFF.salvor3];
function salvScene(it, t) {
  staffAt(it, STAFF.sorter, 3.6, 2.8, 'read', t, 'f', 0);
  const n = Math.min(3, salvPicks().length), ph = phaseOf(S.t);
  if (ph === 1 || ph === 2) return;
  const spots = [[6.6, 3.1], [5.0, 7.5], [2.4, 6.2]];
  for (let i = 0; i < n; i++) staffAt(it, SALVORS()[i], spots[i][0], spots[i][1], i === 2 ? 'idle' : 'carry', t + i * 0.37, 'f', i % 2);
}
Object.assign(ACT, {
  salvpick: d => { say(salvToggle(d.f)); renderPanel(true); },
  salvauto: () => { say(salvAuto()); renderPanel(true); }
});
