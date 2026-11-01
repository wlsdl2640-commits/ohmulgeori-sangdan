/* ───────── 탭 화면 ───────── */
const PANELS = {};

/* 상단 */
PANELS.co = () => {
  const p = dateParts(S.t), dd = S.settleDay - today(), cost = rent() + payroll();
  const sp = dateParts(S.settleDay * DAY_SEC);
  const blds = Object.entries(BUILDINGS).map(([id, B]) => {
    const lv = S.bld[id], max = lv >= B.max, c = B.cost[lv];
    const btn = max ? '<span class="sub muted">최고 단계</span>'
      : `<button type="button" class="btn sm${lv ? '' : ' gold'}" data-act="build" data-id="${id}"${S.gold < c ? ' disabled' : ''}>${lv ? '확장' : '건설'} ${fmt(c)}G</button>`;
    return `<div class="card${lv ? '' : ' dim'}"><div class="row"><div class="grow"><div class="h">${B.name} <small>${lv ? 'Lv' + lv : '미건설'}</small></div><div class="sub">${B.desc}${lv ? ' · 지금: ' + B.eff(lv) : ''}</div></div>${btn}</div></div>`;
  }).join('');
  const future = FUTURE_BUILDINGS.map(b => `<div class="card dim"><div class="h">${b.name} <small>다음 업데이트</small></div><div class="sub">${b.desc}</div></div>`).join('');
  return `
  <div class="card hl">
    <div class="h">${esc(S.company)}</div>
    <div class="sub">${WORLD.capital} ${WORLD.street} 입구 · 제국력 ${p.y}년</div>
    <div class="stats"><span>모험가 <b>${living().length}/${beds()}</b></span><span>파티 <b>${S.parties.length}</b></span><span>처치 <b>${fmt(S.stats.kills)}</b></span><span>전사자 <b>${S.graves.length}</b></span></div>
  </div>
  <div class="sec"><b>월말 정산</b><span>D-${dd} · ${sp.m}월 ${sp.d}일</span></div>
  <div class="card">
    <div class="row"><span class="grow">암살자 길드 자릿세</span><span class="num red-t">${fmt(rent())}G</span></div>
    <div class="row"><span class="grow">모험가 봉급 ${living().length}명</span><span class="num">${fmt(payroll())}G</span></div>
    <div class="row"><span class="grow"><b>합계</b></span><span class="num ${S.gold >= cost ? 'ok-t' : 'red-t'}">${fmt(cost)}G</span></div>
    <div class="sub">${S.gold >= cost ? '지금 가진 돈으로 낼 수 있어요.' : '돈이 모자라요. 자릿세를 못 내면 창고가 털리고, 봉급이 두 달 밀리면 모험가가 떠나요.'}</div>
  </div>
  <div class="sec"><b>건물</b></div>
  ${blds}${future}
  <div class="sec"><b>목표</b></div>
  <div class="card dim"><div class="h">암살자 길드 토벌 <small>다음 업데이트</small></div><div class="sub">상단이 커지고 모험가가 늘면 매달 자릿세를 뜯어 가는 그들을 쓸어버릴 수 있다.</div></div>
  <div class="card dim"><div class="h">마왕의 봉인 <small>${FIELD_IDS.filter(f => S.fields[f].cleared).length}/${FIELD_IDS.length}</small></div><div class="sub">던전의 주인을 쓰러뜨릴 때마다 이야기가 이어지고 용사가 여관에 나타난다.</div></div>
  <div class="sec"><b>소식</b></div>
  <div class="card"><div class="log">${S.log.slice(0, 14).map(l => `<div class="${l.kind}"><span class="d">${l.d}</span>${esc(l.text)}</div>`).join('') || '<div>아직 소식이 없어요.</div>'}</div></div>
  <div class="sec"><b>설정</b></div>
  <div class="card"><div class="sub">진행 상황은 이 기기에 자동 저장돼요. 앱을 닫아도 최대 2시간까지는 원정이 계속돼요.</div><div class="btns"><button type="button" class="btn sm red" data-act="reset">처음부터 다시 하기</button></div></div>`;
};

/* 모험가 */
function advCard(a) {
  const p = partyOf(a.id);
  const st = a.status === 'away' ? `<span class="warn">${esc(p ? p.name : '')} 원정 중</span>` : p ? `대기 · ${esc(p.name)}` : '대기 · 파티 없음';
  const tr = S.bld.training && a.status === 'idle' ? `<button type="button" class="btn sm" data-act="train" data-id="${a.id}"${S.gold < trainCost(a) ? ' disabled' : ''}>훈련 ${trainCost(a)}G</button>` : '';
  const fi = a.status === 'idle' ? `<button type="button" class="btn sm" data-act="fire" data-id="${a.id}">내보내기</button>` : '';
  return `<div class="card">
    <div class="row"><img class="por" src="${portrait(a)}" alt=""><div class="grow"><div class="h">${esc(a.name)} <small>${CLASSES[a.cls].name} Lv${a.lv}</small>${a.hero ? ' <span class="tag gold-t">용사</span>' : ''}${a.quit ? ' <span class="tag red-t">퇴사 예정</span>' : ''}</div><div class="sub">${st}</div></div><div class="sub num">${fmt(a.salary)}G/월</div></div>
    <div class="bar hp"><i data-hp="${a.id}"></i></div>
    <div class="bar xp"><i data-xp="${a.id}"></i></div>
    <div class="stats"><span>체력 <b data-hpt="${a.id}"></b></span><span>공격 <b>${a.atk}</b></span><span>방어 <b>${a.def}</b></span><span>짐 <b>${a.carry}</b></span><span>처치 <b>${a.kills || 0}</b></span></div>
    <div class="sub muted">${esc(a.bio)}</div>
    ${tr || fi ? `<div class="btns">${tr}${fi}</div>` : ''}
  </div>`;
}
function candCard(c) {
  let cond = '', why = '';
  if (c.cond && c.cond.type === 'gift') { const have = S.inv[c.cond.item] || 0; cond = `<div class="row sub">${iconImg(c.cond.item)}<span class="grow">조건: ${ITEMS[c.cond.item].name} ${c.cond.qty}개 선물 (보유 ${have})</span></div>`; if (have < c.cond.qty) why = '선물이 모자라요'; }
  if (c.cond && c.cond.type === 'fame') { cond = `<div class="sub">조건: 명성 ${c.cond.min} 이상 (지금 ${S.fame})</div>`; if (S.fame < c.cond.min) why = '명성이 모자라요'; }
  if (!why && living().length >= beds()) why = '여관 방이 없어요';
  if (!why && S.gold < c.fee) why = '계약금이 모자라요';
  const C = CLASSES[c.cls];
  return `<div class="card${c.hero ? ' hl' : ''}">
    <div class="row"><img class="por" src="${portrait(c)}" alt=""><div class="grow"><div class="h">${esc(c.name)} <small>${C.name} Lv${c.lv}</small>${c.hero ? ' <span class="tag gold-t">용사</span>' : ''}</div><div class="sub">${C.desc}</div></div></div>
    <div class="stats"><span>체력 <b>${c.maxHp}</b></span><span>공격 <b>${c.atk}</b></span><span>방어 <b>${c.def}</b></span><span>짐 <b>${c.carry}</b></span><span>봉급 <b>${fmt(c.salary)}G/월</b></span></div>
    <div class="sub muted">${esc(c.bio)}</div>${cond}
    <div class="row"><span class="sub grow">${why ? `<span class="red-t">${why}</span>` : '고용할 수 있어요'}</span><button type="button" class="btn sm gold" data-act="hire" data-id="${c.id}"${why ? ' disabled' : ''}>고용 · 계약금 ${fmt(c.fee)}G</button></div>
  </div>`;
}
PANELS.adv = () => `
  <div class="sec"><b>소속 모험가</b><span>${living().length}/${beds()}명 · 여관 방</span></div>
  ${living().map(advCard).join('') || '<div class="card"><div class="sub">모험가가 없어요. 아래 여관 손님 중에서 고용하세요.</div></div>'}
  <div class="sec"><b>여관 손님</b><span>이틀마다 새 손님</span></div>
  ${S.cands.map(candCard).join('')}
  ${S.graves.length ? `<details class="card"><summary>묘지 · ${S.graves.length}명</summary><div class="log">${S.graves.slice(0, 30).map(g => `<div><span class="d">${g.date}</span>${esc(g.name)} (${CLASSES[g.cls].name} Lv${g.lv}) · ${esc(g.where)}</div>`).join('')}</div></details>` : ''}`;

/* 원정 */
function partyCard(p) {
  const e = p.exp, on = S.view === p.id;
  const head = `<div class="row"><div class="grow"><div class="h">${esc(p.name)} <small>${p.members.length}명</small></div><div class="sub" data-pst="${p.id}"></div></div>${on ? '<span class="tag gold-t">화면에 표시 중</span>' : `<button type="button" class="btn sm" data-act="view" data-id="${p.id}">화면 보기</button>`}</div>`;
  if (e) {
    const team = p.members.map(advById).filter(Boolean);
    const canD = e.c10 && e.area === 'field' && e.mode === 'advance';
    return `<div class="card${on ? ' hl' : ''}">${head}
      <div class="sub" data-pwhere="${p.id}"></div>
      <div class="bar big load"><i data-prog="${p.id}"></i></div>
      ${team.map(a => `<div class="row"><span class="sub" style="width:7.5em">${esc(a.name)} <span class="muted">Lv${a.lv}</span></span><div class="bar hp grow"><i data-hp="${a.id}"></i></div></div>`).join('')}
      <div class="row sub"><span class="grow">짐 <b data-load="${p.id}"></b> · 처치 <b data-kills="${p.id}"></b></span><span data-sup="${p.id}"></span></div>
      <div class="btns">
        ${e.mode === 'advance' ? `<button type="button" class="btn sm" data-act="recall" data-id="${p.id}">복귀</button>` : ''}
        ${canD ? `<button type="button" class="btn sm gold" data-act="dungeon" data-id="${p.id}">${FIELDS[e.field].dungeon.name} 입장</button>` : ''}
        <button type="button" class="btn sm${p.auto ? ' on' : ''}" data-act="auto" data-id="${p.id}">짐 차면 복귀 ${p.auto ? '켬' : '끔'}</button>
        <button type="button" class="btn sm${p.safe ? ' on' : ''}" data-act="safe" data-id="${p.id}">위험하면 복귀 ${p.safe ? '켬' : '끔'}</button>
        <button type="button" class="btn sm${p.repeat ? ' on' : ''}" data-act="repeat" data-id="${p.id}">돌아오면 다시 출발 ${p.repeat ? '켬' : '끔'}</button>
      </div></div>`;
  }
  const pool = S.advs.filter(a => a.status === 'idle');
  const dest = p.dest && isUnlocked(p.dest) ? p.dest : 'plains';
  const team = p.members.map(advById).filter(Boolean);
  const cap = team.reduce((s, a) => s + a.carry, 0), supW = wOf(p.sup);
  const hurt = team.some(a => a.hp < a.maxHp * 0.7);
  const avg = team.length ? Math.round(team.reduce((s, a) => s + a.lv, 0) / team.length) : 0;
  const fields = FIELD_IDS.map(fid => {
    const F = FIELDS[fid], ok = isUnlocked(fid), fs = S.fields[fid];
    return `<button type="button" class="fbtn${dest === fid ? ' on' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>${F.name}</span><small>${ok ? `권장 Lv${F.lv}+ · 최고 ${F.no}-${fs.best || 0}${fs.cleared ? ' ★' : ''}` : '이전 던전 공략 필요'}</small></button>`;
  }).join('') + LOCKED_FIELDS.map(L => `<button type="button" class="fbtn" disabled><span>${L.name}</span><small>다음 업데이트</small></button>`).join('');
  const last = p.last ? `<div class="sub muted">지난 원정: ${FIELDS[p.last.field].name}, 처치 ${p.last.kills}마리, 부속품 ${Object.values(p.last.got).reduce((s, q) => s + q, 0)}개</div>` : '';
  return `<div class="card${on ? ' hl' : ''}">${head}
    <div class="sec" style="margin-top:2px"><b>파티원</b><span>눌러서 넣고 빼기</span></div>
    <div class="list">${pool.map(a => { const o = partyOf(a.id), inP = p.members.includes(a.id); return `<button type="button" class="pick${inP ? ' on' : ''}" data-act="member" data-id="${p.id}" data-a="${a.id}"><i class="chk"></i><img class="ico" src="${portrait(a)}" alt="" style="width:20px;height:24px"><span class="grow">${esc(a.name)} <span class="muted">${CLASSES[a.cls].name} Lv${a.lv}${o && o !== p ? ' · ' + esc(o.name) : ''}</span></span><span class="sub num">체력 ${pct(a.hp, a.maxHp)}%</span></button>`; }).join('') || '<div class="sub">대기 중인 모험가가 없어요.</div>'}</div>
    <div class="sec"><b>보급품</b><span>가져간 물약만 쓸 수 있어요</span></div>
    ${POTIONS.map(k => `<div class="row">${iconImg(k)}<span class="grow sub">${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="step"><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="-1">−</button><span>${p.sup[k] || 0}</span><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="1">+</button></span></div>`).join('')}
    <div class="sec"><b>목적지</b><span>파티 평균 Lv${avg}</span></div>
    <div class="fields">${fields}</div>
    <div class="sub">짐 한도 ${cap} · 물약이 ${supW} 차지 · 남는 칸에 부속품을 담아 와요.</div>
    ${hurt ? '<div class="sub red-t">다친 모험가가 있어요. 상단에 두면 체력이 서서히 차요.</div>' : ''}
    ${last}
    <div class="btns"><button type="button" class="btn sm${p.repeat ? ' on' : ''}" data-act="repeat" data-id="${p.id}">돌아오면 다시 출발 ${p.repeat ? '켬' : '끔'}</button><span class="sub muted grow">체력이 차면 같은 곳으로 자동 출발해요</span></div>
    <div class="btns"><button type="button" class="btn gold grow" data-act="go" data-id="${p.id}"${team.length ? '' : ' disabled'}>${FIELDS[dest].name}(으)로 출발</button><button type="button" class="btn" data-act="delparty" data-id="${p.id}">파티 삭제</button></div>
  </div>`;
}
PANELS.exp = () => `
  <div class="sec"><b>원정대</b><span>${S.parties.length}/${MAX_PARTIES}개</span></div>
  ${S.parties.map(partyCard).join('')}
  ${S.parties.length < MAX_PARTIES ? '<button type="button" class="btn block" data-act="newparty">+ 새 파티 만들기</button>' : ''}`;

/* 창고 */
PANELS.inv = () => {
  while (S.shop.slots.length < slotCount()) S.shop.slots.push(null);
  const sold = S.sold.day === today() ? S.sold : { n: 0, g: 0 };
  const slots = S.shop.slots.slice(0, slotCount()).map((s, i) => {
    if (!s) return `<div class="card dim"><div class="row"><span class="grow sub">${i + 1}번 진열대 · 비어 있음</span><button type="button" class="btn sm" data-act="slot" data-i="${i}">물건 고르기</button></div></div>`;
    const it = ITEMS[s.item], q = S.inv[s.item] || 0;
    return `<div class="card"><div class="row">${iconImg(s.item, 'ico lg')}<div class="grow"><div class="h">${it.name}</div><div class="sub">${q ? `재고 ${q}개` : '<span class="red-t">품절 · 창고에 들어오면 다시 팔려요</span>'}</div></div><button type="button" class="btn sm" data-act="unslot" data-i="${i}">내리기</button></div>
      <div class="btns">${TIERS.map((T, k) => `<button type="button" class="btn sm${s.tier === k ? ' on' : ''}" data-act="tier" data-i="${i}" data-t="${k}">${T.name} ${fmt(Math.round(it.v * T.m))}G</button>`).join('')}</div></div>`;
  }).join('');
  const items = Object.keys(S.inv).filter(k => !ITEMS[k].potion && S.inv[k] > 0).sort((a, b) => ITEMS[b].v - ITEMS[a].v);
  const total = items.reduce((s, k) => s + ITEMS[k].v * S.inv[k], 0);
  const rows = items.map(k => { const it = ITEMS[k], q = S.inv[k], one = Math.round(it.v * GUILD_RATE); return `<div class="li">${iconImg(k)}<div class="grow"><span>${it.name} <b class="num">×${q}</b></span><span class="sub muted">무게 ${it.w} · 기준가 ${it.v}G</span></div><div class="btns"><button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="1">${one}G</button>${q > 1 ? `<button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="${q}">모두 ${fmt(one * q)}G</button>` : ''}</div></div>`; }).join('');
  const alch = S.bld.alchemy ? `<div class="sec"><b>연금술 공방</b></div>${RECIPES.map((r, i) => `<div class="card"><div class="row">${iconImg(r.out, 'ico lg')}<div class="grow"><div class="h">${ITEMS[r.out].name}</div><div class="sub">${Object.entries(r.need).map(([k, q]) => `${ITEMS[k].name} ${q} (보유 ${S.inv[k] || 0})`).join(' + ')} + ${r.fee}G</div></div><button type="button" class="btn sm gold" data-act="craft" data-i="${i}"${canCraft(r) ? '' : ' disabled'}>만들기</button></div></div>`).join('')}` : '';
  return `
  <div class="sec"><b>상점 진열대</b><span>오늘 ${sold.n}개 · ${fmt(sold.g)}G 판매</span></div>
  <div class="sub">진열한 부속품은 손님이 조금씩 사 가요. 비싸게 걸수록 천천히 팔리고, 명성이 높을수록 손님이 많아요.</div>
  ${slots}
  <div class="sec"><b>창고</b><span>${items.length}종 · 기준가 ${fmt(total)}G어치</span></div>
  <div class="sub">버튼을 누르면 모험가 길드가 기준가의 ${Math.round(GUILD_RATE * 100)}%에 바로 사 가요.</div>
  <div class="list">${rows || '<div class="li"><span class="sub">창고가 비어 있어요. 원정을 보내 부속품을 모아 오세요.</span></div>'}</div>
  <div class="sec"><b>물약</b><span>원정 보급품</span></div>
  ${POTIONS.map(k => `<div class="li">${iconImg(k)}<div class="grow"><span>${ITEMS[k].name} <b class="num">×${S.inv[k] || 0}</b></span><span class="sub muted">체력 ${ITEMS[k].heal} 회복</span></div><div class="btns"><button type="button" class="btn sm" data-act="buy" data-it="${k}" data-q="1"${S.gold < ITEMS[k].buy ? ' disabled' : ''}>${ITEMS[k].buy}G</button><button type="button" class="btn sm" data-act="buy" data-it="${k}" data-q="5"${S.gold < ITEMS[k].buy * 5 ? ' disabled' : ''}>5개 ${ITEMS[k].buy * 5}G</button></div></div>`).join('')}
  ${alch}`;
};

/* 의뢰 */
PANELS.req = () => `
  <div class="sec"><b>의뢰 게시판</b><span>이틀마다 새 의뢰</span></div>
  ${S.reqs.map(r => { const have = S.inv[r.item] || 0, ok = have >= r.qty, dd = r.due - today(); return `<div class="card${ok ? ' hl' : ''}">
    <div class="row"><div class="grow"><div class="h">${esc(r.client)}</div><div class="sub">기한 <span class="${dd <= 1 ? 'red-t' : ''}">D-${dd}</span></div></div><div class="sub num"><span class="gold-t">${fmt(r.reward)}G</span> · <span class="fame-t">명성 +${r.fame}</span></div></div>
    <div class="row">${iconImg(r.item, 'ico lg')}<span class="grow">${ITEMS[r.item].name} ${r.qty}개 <span class="sub ${ok ? 'ok-t' : 'muted'}">보유 ${have}</span></span><button type="button" class="btn sm gold" data-act="fulfill" data-id="${r.id}"${ok ? '' : ' disabled'}>전달하기</button></div>
  </div>`; }).join('') || '<div class="card"><div class="sub">지금은 의뢰가 없어요.</div></div>'}
  <div class="sub muted">의뢰를 끝내면 길드에 파는 것보다 많이 받고, 명성도 올라요. 명성이 오르면 손님이 늘고 더 강한 모험가가 찾아와요.</div>`;

/* ───────── 그리기 ───────── */
function renderPanel(force) {
  if (!S) return;
  if (UI.hold && !force) return;
  const html = PANELS[UI.tab]();
  if (force || html !== UI.html) { $('panel-in').innerHTML = html; UI.html = html; }
  live();
}
function live() {
  const box = $('panel-in');
  box.querySelectorAll('[data-hp]').forEach(el => { const a = advById(+el.dataset.hp); if (!a) return; const f = a.hp / a.maxHp; el.style.width = pct(a.hp, a.maxHp) + '%'; el.classList.toggle('low', f < 0.35); });
  box.querySelectorAll('[data-hpt]').forEach(el => { const a = advById(+el.dataset.hpt); if (a) el.textContent = `${Math.ceil(a.hp)}/${a.maxHp}`; });
  box.querySelectorAll('[data-xp]').forEach(el => { const a = advById(+el.dataset.xp); if (a) el.style.width = pct(a.exp, expNeed(a.lv)) + '%'; });
  box.querySelectorAll('[data-pst]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.pst); if (p) el.textContent = expStatus(p); });
  box.querySelectorAll('[data-pwhere]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.pwhere); if (p && p.exp) el.textContent = whereStr(p.exp); });
  box.querySelectorAll('[data-prog]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.prog); if (p && p.exp) el.style.width = pct(routePos(p.exp), 15 * STAGE_LEN) + '%'; });
  box.querySelectorAll('[data-load]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.load); if (p) el.textContent = `${usedOf(p)}/${capOf(p)}`; });
  box.querySelectorAll('[data-kills]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.kills); if (p && p.exp) el.textContent = p.exp.kills; });
  box.querySelectorAll('[data-sup]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.sup); if (p && p.exp) el.textContent = `물약 ${(p.exp.sup.pot_s || 0) + (p.exp.sup.pot_m || 0)}개 남음`; });
}

/* ───────── 누르기 ───────── */
const findP = id => S.parties.find(p => p.id === +id);
const ACT = {
  build: d => say(upgrade(d.id)),
  train: d => say(train(+d.id)),
  fire: d => { const a = advById(+d.id); if (a) confirmBox('모험가 내보내기', `${a.name}을(를) 내보낼까요? 다시 데려올 수 없어요.`, '내보내기', () => { say(fire(a.id)); renderPanel(true); }, true); },
  hire: d => { const m = hire(+d.id); say(m || '고용했어요'); },
  view: d => { S.view = +d.id; renderChips(); },
  member: d => toggleMember(+d.id, +d.a),
  sup: d => setSup(+d.id, d.it, +d.d),
  dest: d => { const p = findP(d.id); if (p) p.dest = d.f; },
  go: d => { const p = findP(d.id); if (!p) return; const m = startExp(p, p.dest && isUnlocked(p.dest) ? p.dest : 'plains'); if (m) say(m); else { S.view = p.id; renderChips(); $('panel').scrollTop = 0; } },
  recall: d => { const p = findP(d.id); if (p) recall(p, 'order'); },
  dungeon: d => { const p = findP(d.id); if (p) { enterDungeon(p); S.view = p.id; } },
  auto: d => { const p = findP(d.id); if (p) p.auto = !p.auto; },
  safe: d => { const p = findP(d.id); if (p) p.safe = !p.safe; },
  repeat: d => { const p = findP(d.id); if (p) p.repeat = !p.repeat; },
  newparty: () => { const r = createParty(); if (typeof r === 'string') say(r); },
  delparty: d => { const p = findP(d.id); if (p) confirmBox('파티 삭제', `${p.name}을(를) 지울까요? 모험가는 상단에 남아요.`, '삭제', () => { deleteParty(p.id); renderPanel(true); renderChips(); }, true); },
  sell: d => sellGuild(d.it, +d.q),
  buy: d => say(buy(d.it, +d.q)),
  craft: d => say(craft(+d.i) || '물약을 만들었어요'),
  slot: d => pickForSlot(+d.i),
  unslot: d => setSlot(+d.i, null),
  tier: d => { const s = S.shop.slots[+d.i]; if (s) { s.tier = +d.t; changed(); } },
  fulfill: d => say(fulfill(+d.id)),
  reset: () => confirmBox('처음부터 다시', '저장된 진행 상황이 모두 지워져요. 되돌릴 수 없어요.', '모두 지우기', () => { resetGame(); showTitle(); }, true)
};
function pickForSlot(i) {
  const used = S.shop.slots.filter(Boolean).map(s => s.item);
  const items = Object.keys(S.inv).filter(k => !ITEMS[k].potion && S.inv[k] > 0 && !used.includes(k));
  if (!items.length) { say('진열할 부속품이 없어요'); return; }
  openModal(`${i + 1}번 진열대`, `<div class="list">${items.map(k => `<button type="button" class="pick" data-slotpick="${k}">${iconImg(k)}<span class="grow">${ITEMS[k].name} <span class="muted">×${S.inv[k]}</span></span><span class="sub">정가 ${Math.round(ITEMS[k].v * TIERS[1].m)}G</span></button>`).join('')}</div>`, [{ label: '닫기' }]);
  $('m-body').onclick = e => { const b = e.target.closest('[data-slotpick]'); if (!b) return; setSlot(i, b.dataset.slotpick, 1); $('m-body').onclick = null; closeModal(); renderPanel(true); };
}

function bindUI() {
  $('panel-in').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled || !S) return;
    ACT[b.dataset.act](b.dataset);
    renderPanel(true); renderChips(); updateHud(); saveGame();
  });
  const panel = $('panel');
  panel.addEventListener('pointerdown', () => { UI.hold = true; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => panel.addEventListener(t, () => setTimeout(() => { UI.hold = false; }, 180)));
  $('pchips').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (!b) return; S.view = +b.dataset.view; renderChips(); if (UI.tab === 'exp') renderPanel(true); });
  $('tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    UI.tab = b.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('on', t === b));
    $('panel').scrollTop = 0; renderPanel(true);
  });
  $('modal').addEventListener('click', e => { if (e.target === $('modal') && $('m-btns').children.length === 1) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && UI.modal && $('m-btns').children.length === 1) closeModal(); });
  $('t-form').addEventListener('submit', e => {
    e.preventDefault();
    newGame($('t-name').value);
    $('title-scr').hidden = true;
    cancelAnimationFrame(titleRaf);
    saveGame();
    startGame();
  });
}
