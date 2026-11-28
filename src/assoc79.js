/* ───────── 빌드 79: 모험가 협회 창 (11-28 대표님 — 회의 e12 · ai-meeting decisions.md) ─────────
   · 메뉴판 「모험가 협회」 칸 · 미궁탑 협회 로비 → 이 창. 탭 넷: 의뢰 · 수배(처음 여는 메인) / 심사 · 등록 / 매입 · 상점 / 기록 · 랭킹. 키트 B 양피지
   · 현상 수배(데모 5건 · 한 번씩): 1 · 2 · 3층 주인 · 1층 리젠보스 둘. 잡고 전멸 없이 돌아오면 완료 → 「받기」. 리젠보스는 만나기 전엔 「???」
   · 개척 일지: 층마다 한 장 — 돌파 전 안내 · 첫 돌파(날짜 · 원정대 · 구성원) 자동 기록. 명성은 주지 않는다(수배에서만)
   · 날마다 도는 수배 없음 · 소문은 협회 로비 대사로만 · 자격증 승급은 한 명씩 · 견습생 없음 */
const B79 = [
  { id: 'own_plains', field: 'plains', name: '1층 주인 갑옷 멧돼지', gold: 200, fame: 8 },
  { id: 'own_canyon', field: 'canyon', name: '2층 점토 협곡 주인', gold: 350, fame: 12 },
  { id: 'own_antnest', field: 'antnest', name: '3층 개미굴 주인', gold: 500, fame: 18 },
  { id: 'rg_c1', regen: 'c1', name: '마법 걸린 허수아비', gold: 100, fame: 0 },
  { id: 'rg_c2', regen: 'c2', name: '저주 걸린 허수아비', gold: 150, fame: 0 }
];
const PLOG79 = {
  plains: ['1층 곡창지대 평원', '권장 Lv1 ~ 12 · 밤에는 호박등 허수아비가 나온다. 1-4 ~ 1-10 밭둑의 광맥 콩벌레는 대장간에서 주괴로 바꿀 조각을 떨어뜨린다.'],
  canyon: ['2층 점토 협곡', '권장 Lv13 ~ 27 · 무너진 옛 제국 수로를 따라간다. 단단한 갑각 몬스터가 많아 방어를 깨는 공격을 챙길 것.'],
  antnest: ['3층 개미굴', '권장 Lv28 ~ 40 · 굴턱 마을에서 정비한 뒤 들어간다. 무리로 덤비는 개미와 여왕의 부름에 대비할 것.']
};
const b79 = () => { if (!S.b79) S.b79 = { got: {}, done: {}, seen: {}, log: {} }; return S.b79; };
const b79Open = b => b.regen ? !!b79().seen[b.id] || !!b79().done[b.id] || !!b79().got[b.id] : !!FIELDS[b.field];
const b79Ready = () => B79.filter(b => b79().done[b.id] && !b79().got[b.id]).length;

// 처치 · 만남 · 돌아옴
const _kill79 = kill;
kill = function (p, e, f) {   // eslint-disable-line no-func-assign
  const r = _kill79(p, e, f);
  if (e && f && !f.pvp && !f.sum) {
    if (f.fb >= 5) (e.b79 = e.b79 || {})['own_' + e.field] = 1;
    if (f.regen) (e.b79 = e.b79 || {})['rg_' + f.regen] = 1;
  }
  return r;
};
const _regenFoe79 = regenFoe;
regenFoe = function (k, lv) { b79().seen['rg_' + k] = 1; return _regenFoe79(k, lv); };   // eslint-disable-line no-func-assign
const _arrive79 = arrive;
arrive = function (p) {   // eslint-disable-line no-func-assign
  const e = p.exp, hit = e && e.b79;
  if (hit) {
    const B = b79();
    for (const id in hit) {
      if (B79.some(b => b.id === id) && !B.got[id] && !B.done[id]) { B.done[id] = 1; log(`협회 현상 수배 「${B79.find(b => b.id === id).name}」 완료 — 협회에서 보상을 받을 수 있다.`, 'good'); }
      if (id.startsWith('own_')) { const fid = id.slice(4); if (!B.log[fid]) B.log[fid] = { day: today(), party: p.name, mem: teamOf(p).map(a => [a.name, CLASSES[a.cls].name, a.lv]) }; }
    }
  }
  return _arrive79(p);
};
function b79Claim(id) {
  const b = B79.find(x => x.id === id), B = b79(); if (!b || !B.done[id] || B.got[id]) return '';
  B.got[id] = 1; S.gold += b.gold; S.fame += b.fame; S.stats.earned = (S.stats.earned || 0) + b.gold;
  log(`협회 현상금 「${b.name}」 ${g$(b.gold)}${b.fame ? ` · 명성 +${b.fame}` : ''}을(를) 받았다.`, 'good'); changed(); return `현상금 ${g$(b.gold)}을(를) 받았다`;
}

// 창
const ASSOC79_TABS = [['req', '의뢰 · 수배'], ['rank', '심사 · 등록'], ['shop', '매입 · 상점'], ['log', '기록 · 랭킹']];
function b79Box() {
  const rows = B79.filter(b => FIELDS[b.field || 'plains']).map(b => {
    const B = b79(), open = b79Open(b), st = B.got[b.id] ? '<span class="sub muted">받음</span>' : B.done[b.id] ? `<button type="button" class="btn sm gold" data-act="b79get" data-id="${b.id}">받기</button>` : '<span class="sub muted">대상을 잡고 무사히 돌아오면 완료</span>';
    return `<div class="li"><div class="grow stack"><span>${open ? esc(b.name) : '???'}</span><span class="sub">${open ? `${g$(b.gold)}${b.fame ? ` · 명성 +${b.fame}` : ''}` : '아직 소문만 무성한 무언가'}</span></div>${open ? st : ''}</div>`;
  }).join('');
  return `<div class="sec"><b>현상 수배</b><span>한 번씩 · 기한 없음</span></div><div class="list">${rows}</div>`;
}
function lic79Box() {
  const L = S.advs.filter(a => licNext(a)).map(a => { const N = licNext(a), miss = licReqs(a).find(r => !r.ok), idle = a.status === 'idle';
    return `<div class="li"><div class="grow stack"><span>${esc(a.name)} <span class="muted">· ${CLASSES[a.cls].name} Lv${a.lv}</span></span><span class="sub">다음 자격증 ${esc(N.name || '')}${miss ? ` · ${esc(miss.label)} ${miss.cur}/${miss.need}` : ' · 심사를 받을 수 있어요'}</span></div>
      <button type="button" class="btn sm${miss ? '' : ' gold'}" data-act="b79lic" data-id="${a.id}"${miss || !idle ? ' disabled' : ''}>심사</button></div>`; });
  L.sort((x, y) => (y.includes('btn sm gold') ? 1 : 0) - (x.includes('btn sm gold') ? 1 : 0));
  return `<div class="sec"><b>자격증 심사</b><span>한 명씩 · 길드에 있을 때</span></div><div class="list">${L.join('') || '<div class="li"><span class="sub muted">길드원이 없어요.</span></div>'}</div>
    <div class="sec"><b>협회 시설</b><span>미궁탑 · 무료</span></div><div class="sub muted">대장간 · 도서관 · 대신전 · 마탑은 협회 시설이라 길드가 짓지 않고 무료로 써요.</div>`;
}
function plog79Box() {
  return Object.keys(PLOG79).filter(f => FIELDS[f]).map(f => { const [nm, tip] = PLOG79[f], L = b79().log[f];
    return `<div class="card"><div class="h">${esc(nm)}</div><div class="sub">${esc(tip)}</div>${L ? `<div class="sub">첫 돌파: ${L.day + 1}일째 · ${esc(L.party)} — ${L.mem.map(m => `${esc(m[0])}(${esc(m[1])} Lv${m[2]})`).join(', ')}</div>` : '<div class="sub muted">아직 우리 길드의 돌파 기록이 없어요.</div>'}</div>`; }).join('');
}
PANELS.assoc = () => {
  const t = ASSOC79_TABS.some(x => x[0] === UI.assocTab) ? UI.assocTab : 'req';
  const tabs = `<div class="tabs as79">${ASSOC79_TABS.map(([k, n]) => `<button type="button" class="tab${t === k ? ' on' : ''}" data-act="as79tab" data-t="${k}">${n}${k === 'req' && b79Ready() ? ` (${b79Ready()})` : ''}</button>`).join('')}</div>`;
  let body = '';
  if (t === 'req') body = b79Box() + `<div class="sec"><b>협회 의뢰</b><span>날마다 06:00</span></div>` + PANELS.req();
  else if (t === 'rank') body = rankCard() + lic79Box();
  else if (t === 'shop') body = `<div class="card"><div class="h">부속품 매입</div><div class="sub">부속품을 협회에 한꺼번에 팔아요(의뢰 몫 · 보스 부속품은 빼고). 약 ${g$(bulkMatValue())}.</div><div class="btns"><button type="button" class="btn sm gold" data-act="sellallmat">모두 팔기</button></div></div>`
    + `<div class="card">${eggShopBox()}</div><div class="card"><div class="h">협회 상점</div><div class="btns"><button type="button" class="btn sm" data-act="as79go" data-w="gearshop">장비 상점 ›</button><button type="button" class="btn sm" data-act="as79go" data-w="potshop">물약 상점 ›</button></div></div>`;
  else body = `<div class="sec"><b>개척 일지</b><span>층마다 한 장</span></div>` + plog79Box() + (PANELS.co_league ? `<div class="sec"><b>길드 랭킹</b><span>이웃 길드 다섯</span></div>` + PANELS.co_league() : '');
  return `<div class="card"><div class="h">라비린토스 모험가 협회</div><div class="sub">오래전 이 도시에 처음 생긴 열세 길드가 뭉쳐 세운 기관. 모든 모험가 길드는 협회에 가입한다.</div></div>` + tabs + body;
};
Object.assign(ACT, {
  as79tab: d => { UI.assocTab = d.t; const w = winTop(); if (w) w.tab = d.t; renderPanel(true); },
  b79get: d => say(b79Claim(d.id)),
  b79lic: d => say(licenseUp(d.id) || '심사를 통과했어요'),
  as79go: d => openWin(d.w)
});
// 메뉴판 협회 칸 알림: 받을 현상금 + 심사를 받을 수 있는 자격증 인원 + 랭크 심사 가능
const _updateHud79 = updateHud;
updateHud = function () {   // eslint-disable-line no-func-assign
  const r = _updateHud79.apply(this, arguments);
  try {
    const t = document.querySelector('.mtile[data-open="assoc"]'); if (!t || !S) return r;
    let b = t.querySelector('.badge'); if (!b) { b = document.createElement('span'); b.className = 'badge'; t.appendChild(b); }
    const lic = S.advs.filter(a => a.status === 'idle' && licNext(a) && !licReqs(a).some(x => !x.ok)).length, rk = typeof rankReqs === 'function' && rankReqs() && rankReqs().every(x => x.ok) ? 1 : 0;
    const n = b79Ready() + lic + rk; b.hidden = !n; b.textContent = n;
  } catch (_) {}
  return r;
};
