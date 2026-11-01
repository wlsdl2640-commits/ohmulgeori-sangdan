/* ───────── 탭 화면 ───────── */
const PANELS = {};
const qTag = g => `<span class="q q${g.q}">${QUALITY[g.q].name}</span>`;
const gImg = (g, cls = 'ico') => `<img class="${cls}" src="${gearIconURL(g)}" alt="">`;
function statLine(st) {
  return Object.entries(st).map(([k, v]) => `${STAT_NAMES[k]} ${PCT_STATS.includes(k) ? '+' + (Math.round(v * 1000) / 10) + '%' : (v > 0 ? '+' : '') + v}`).join(' · ');
}
const clsList = cls => (cls.includes('all') ? '모든 직업' : cls.map(c => CLASSES[c].name).join('·'));
const costStr = s => (s.passive ? '지속 효과' : s.cost.hp ? `HP ${Math.round(s.cost.hp * 100)}%` : `MP ${s.cost.mp}`);
const needStr = need => Object.entries(need).map(([k, q]) => { const h = S.inv[k] || 0; return `<span class="${h >= q ? '' : 'red-t'}">${ITEMS[k].name} ${h}/${q}</span>`; }).join(' · ');
const dots = (n, max) => '●'.repeat(n) + '○'.repeat(Math.max(0, max - n));

/* 상단 */
PANELS.co = () => {
  const p = dateParts(S.t), dd = S.settleDay - today(), cost = rent() + payroll(), sp = dateParts(S.settleDay * DAY_SEC);
  const dueDeps = S.bank.deps.filter(d => d.due - today() <= 5);
  const sponsors = Object.entries(SPONSORS).map(([k, P]) => {
    const t = spn(k), open = sponsorOpen(k);
    if (!open) return `<div class="card dim"><div class="h">${P.name}</div><div class="sub">${FIELDS[P.need].name}이(가) 열리면 후원할 수 있어요.</div></div>`;
    const next = t < 3 ? `<div class="row"><span class="sub grow">다음: ${P.perks[t]} · 명성 +${P.fame[t]}</span><button type="button" class="btn sm gold" data-act="sponsor" data-id="${k}"${S.gold < P.cost[t] ? ' disabled' : ''}>후원 ${fmt(P.cost[t])}G</button></div>` : '<div class="sub ok-t">모든 후원을 마쳤어요.</div>';
    return `<div class="card${t ? ' hl' : ''}"><div class="row"><div class="grow"><div class="h">${P.name} <small class="gold-t">${dots(t, 3)}</small></div><div class="sub">${P.desc}</div></div></div>
      ${t ? `<div class="sub ok-t">받는 혜택: ${P.perks.slice(0, t).join(' · ')}</div>` : ''}${next}</div>`;
  }).join('');
  const R = GUILD_RAID, rd = S.flags.guildDown;
  const raid = rd ? '<div class="card hl"><div class="h">암살자 길드 토벌 <small class="ok-t">완료</small></div><div class="sub">오물거리에 더는 자릿세가 없다. 손님도 늘었다.</div></div>'
    : `<div class="card${raidReady() ? ' hl' : ''}"><div class="h">암살자 길드 토벌</div>
      <div class="sub">매달 자릿세를 뜯어 가는 그들을 쓸어버리면 자릿세가 사라져요. 길드 은신처는 Lv28 이상 파티를 권해요.</div>
      <div class="stats"><span class="${S.fame >= R.fame ? 'ok-t' : ''}">명성 ${S.fame}/${R.fame}</span><span class="${living().length >= R.advs ? 'ok-t' : ''}">모험가 ${living().length}/${R.advs}명</span><span class="${spn(R.sponsor) >= R.tier ? 'ok-t' : ''}">시민회 후원 ${spn(R.sponsor)}/${R.tier}단계</span></div>
      ${raidReady() ? '<div class="sub gold-t">준비 완료! 원정 탭에서 7번가 뒷골목을 목적지로 고르세요.</div>' : ''}</div>`;
  return `
  <div class="card hl">
    <div class="h">${esc(S.company)}</div>
    <div class="sub">${WORLD.capital} ${WORLD.street} 입구 · 제국력 ${p.y}년 · v${VERSION}</div>
    <div class="stats"><span>모험가 <b>${living().length}/${beds()}</b></span><span>파티 <b>${S.parties.length}</b></span><span>처치 <b>${fmt(S.stats.kills)}</b></span><span>전사자 <b>${S.graves.length}</b></span></div>
  </div>
  <div class="sec"><b>월말 정산</b><span>D-${dd} · ${sp.m}월 ${sp.d}일</span></div>
  <div class="card">
    <div class="row"><span class="grow">암살자 길드 자릿세</span><span class="num ${rent() ? 'red-t' : 'ok-t'}">${rent() ? fmt(rent()) + 'G' : '없음'}</span></div>
    <div class="row"><span class="grow">모험가 봉급 ${living().length}명</span><span class="num">${fmt(payroll())}G</span></div>
    <div class="row"><span class="grow"><b>합계</b></span><span class="num ${S.gold >= cost ? 'ok-t' : 'red-t'}">${fmt(cost)}G</span></div>
    <div class="sub">${S.gold >= cost ? '지금 가진 돈으로 낼 수 있어요.' : '돈이 모자라요. 자릿세를 못 내면 창고가 털리고, 봉급이 두 달 밀리면 모험가가 떠나요.'} 날짜는 게임을 켜 둔 동안에만 흘러요.</div>
    ${dueDeps.length ? `<div class="sub red-t">곧 돌려줄 예금: ${dueDeps.map(d => `${esc(d.who)} ${dayLabel(d.due)} ${fmt(Math.round(d.amount * (1 + d.rate / 100)))}G`).join(', ')}</div>` : ''}
  </div>
  <div class="sec"><b>후원</b><span>명성과 혜택</span></div>
  ${sponsors}
  <div class="sec"><b>목표</b></div>
  ${raid}
  <div class="card dim"><div class="h">마왕의 봉인 <small>${FIELD_IDS.filter(f => S.fields[f].cleared).length}/${FIELD_IDS.length}</small></div><div class="sub">던전의 주인을 쓰러뜨릴 때마다 이야기가 이어지고 용사가 여관에 나타난다.</div></div>
  <div class="sec"><b>소식</b></div>
  <div class="card"><div class="log">${S.log.slice(0, 16).map(l => `<div class="${l.kind}"><span class="d">${l.d}</span>${esc(l.text)}</div>`).join('') || '<div>아직 소식이 없어요.</div>'}</div></div>
  <div class="sec"><b>설정</b></div>
  <div class="card"><div class="sub">진행 상황은 이 기기에 자동 저장돼요. 앱을 닫아도 최대 ${Math.round(offlineCap() / 3600)}시간까지 원정과 판매가 계속되고, 날짜는 그대로예요.</div><div class="btns"><button type="button" class="btn sm red" data-act="reset">처음부터 다시 하기</button></div></div>`;
};

/* 시설 */
function smithyBox() {
  const maxT = GTIERS.reduce((m, T, i) => (S.bld.smithy >= T.smith ? i : m), 0);
  if (UI.smithT == null || UI.smithT > maxT) UI.smithT = maxT;
  const t = UI.smithT;
  const chips = GTIERS.map((T, i) => `<button type="button" class="btn sm${i === t ? ' on' : ''}" data-act="smithT" data-i="${i}"${S.bld.smithy >= T.smith ? '' : ' disabled'}>${T.name}</button>`).join('');
  const rows = GTYPE_IDS.map(b => {
    const g = { base: b, t, q: 0 }, ok = canSmith(b, t);
    return `<div class="li">${gImg(g)}<div class="grow"><span>${gearName(g)} <span class="muted">· ${clsList(GTYPES[b].cls)} · Lv${GTIERS[t].lv}+</span></span><span class="sub">${statLine(gearStats(g))}</span><span class="sub">${needStr(recipeNeed(b, t))} · ${fmt(smithFee(t))}G</span></div><button type="button" class="btn sm gold" data-act="smith" data-b="${b}" data-t="${t}"${ok ? '' : ' disabled'}>제작</button></div>`;
  }).join('');
  return `<div class="btns">${chips}</div><div class="sub muted">만들 때마다 일반·고급·희귀 품질이 정해져요. 대장간을 넓힐수록 좋은 품질이 잘 나와요.</div><div class="list">${rows}</div>`;
}
function bankBox() {
  const deals = S.bank.deps.map(d => `<div class="li"><div class="grow"><span>예금 · ${esc(d.who)}</span><span class="sub">${fmt(d.amount)}G 맡음 · <span class="${d.due - today() <= 3 ? 'red-t' : ''}">${dayLabel(d.due)}(D-${d.due - today()})</span>에 ${fmt(Math.round(d.amount * (1 + d.rate / 100)))}G 돌려줌</span></div></div>`)
    .concat(S.bank.loans.map(l => `<div class="li"><div class="grow"><span>대출 · ${esc(l.who)} <span class="muted">신용 ${BANK.grades[l.grade].name}</span></span><span class="sub">${fmt(l.amount)}G 빌려줌 · ${dayLabel(l.due)}(D-${l.due - today()})에 ${fmt(Math.round(l.amount * (1 + l.rate / 100)))}G 받을 예정</span></div></div>`)).join('');
  const offers = S.bank.offers.map(o => o.type === 'dep'
    ? `<div class="li"><div class="grow"><span>예금 제안 · ${esc(o.who)}</span><span class="sub">${fmt(o.amount)}G를 맡기고 ${o.days}일 뒤 이자 ${o.rate}%와 함께 찾아가요. 그동안 이 돈을 쓸 수 있어요.</span></div><button type="button" class="btn sm gold" data-act="bankok" data-id="${o.id}">받기</button></div>`
    : `<div class="li"><div class="grow"><span>대출 요청 · ${esc(o.who)} <span class="muted">신용 ${BANK.grades[o.grade].name}</span></span><span class="sub">${fmt(o.amount)}G를 ${o.days}일 빌리고 이자 ${o.rate}%를 주겠대요. 못 갚을 수도 있어요.</span></div><button type="button" class="btn sm" data-act="bankok" data-id="${o.id}"${S.gold < o.amount ? ' disabled' : ''}>빌려주기</button></div>`).join('');
  return `<div class="sec" style="margin-top:2px"><b>진행 중인 거래</b><span>${S.bank.deps.length + S.bank.loans.length}/${bankCap()}건</span></div>
    <div class="list">${deals || '<div class="li"><span class="sub">진행 중인 거래가 없어요.</span></div>'}</div>
    <div class="sec"><b>들어온 제안</b><span>이틀마다 새 제안</span></div>
    <div class="list">${offers || '<div class="li"><span class="sub">지금은 제안이 없어요.</span></div>'}</div>`;
}
function towerBox() {
  const cur = S.research.cur;
  const rows = Object.entries(RESEARCH).map(([k, Rr]) => {
    const lv = rlv(k), c = researchCost(k);
    return `<div class="li"><div class="grow"><span>${Rr.name} <small class="gold-t">${dots(lv, Rr.max)}</small></span><span class="sub">${lv ? '지금: ' + Rr.desc(lv) + ' · ' : ''}${c ? '다음: ' + Rr.desc(lv + 1) : '최고 단계'}</span>${c ? `<span class="sub">${fmt(c[0])}G · ${needStr(c[1])} · ${Rr.days[lv]}일</span>` : ''}</div>${c ? `<button type="button" class="btn sm gold" data-act="research" data-id="${k}"${canResearch(k) ? '' : ' disabled'}>연구</button>` : ''}</div>`;
  }).join('');
  return `${cur ? `<div class="sub gold-t">연구 중: ${RESEARCH[cur.k].name} ${rlv(cur.k) + 1}단계 · ${dayLabel(cur.done)} 완료</div>` : '<div class="sub">한 번에 하나씩 연구할 수 있어요. 연구 기간은 게임 속 날짜로 셉니다.</div>'}<div class="list">${rows}</div>`;
}
PANELS.fac = () => BUILD_ORDER.map(id => {
  const B = BUILDINGS[id], lv = S.bld[id], max = lv >= B.max, c = B.cost[lv];
  const btn = max ? '<span class="sub muted">최고 단계</span>' : `<button type="button" class="btn sm${lv ? '' : ' gold'}" data-act="build" data-id="${id}"${S.gold < c ? ' disabled' : ''}>${lv ? '확장' : '건설'} ${fmt(c)}G</button>`;
  let body = '';
  if (lv && id === 'smithy') body = smithyBox();
  if (lv && id === 'alchemy') body = `<div class="list">${RECIPES.map((r, i) => `<div class="li">${iconImg(r.out)}<div class="grow"><span>${ITEMS[r.out].name}</span><span class="sub">${S.bld.alchemy >= r.lv ? needStr(r.need) + ` · ${r.fee}G` : '공방 2단계 필요'}</span></div><button type="button" class="btn sm gold" data-act="craft" data-i="${i}"${canCraft(r) ? '' : ' disabled'}>만들기</button></div>`).join('')}</div>`;
  if (lv && id === 'training') body = '<div class="sub">모험가 탭에서 모험가를 누르면 능력치를 훈련하고, 가진 스킬북으로 스킬을 배울 수 있어요.</div>';
  if (lv && id === 'bank') body = bankBox();
  if (lv && id === 'tower') body = towerBox();
  if (id === 'shop' && lv) body = `<div class="sub">손님 수 ×${traffic().toFixed(2)} · 진열은 창고 탭에서 해요.</div>`;
  return `<div class="card${lv ? '' : ' dim'}"><div class="row"><div class="grow"><div class="h">${B.name} <small>${lv ? 'Lv' + lv : '미건설'}</small></div><div class="sub">${B.desc}${lv ? ' · 지금: ' + B.eff(lv) : ''}</div></div>${btn}</div>${body}</div>`;
}).join('');

/* 모험가 */
function eqIcons(a) { return SLOTS.map(([s, n]) => (a.eq[s] ? gImg(a.eq[s], 'ico q-b q' + a.eq[s].q) : `<span class="ico empty" title="${n}"></span>`)).join(''); }
function advCard(a) {
  const p = partyOf(a.id), d = derive(a);
  const st = a.status === 'away' ? `<span class="warn">${esc(p ? p.name : '')} 원정 중</span>` : p ? `대기 · ${esc(p.name)}` : '대기 · 파티 없음';
  return `<button type="button" class="card advc" data-act="advopen" data-id="${a.id}">
    <div class="row"><img class="por" src="${portrait(a)}" alt=""><div class="grow"><div class="h">${esc(a.name)} <small>${CLASSES[a.cls].name} Lv${a.lv}</small>${a.hero ? ' <span class="tag gold-t">용사</span>' : ''}${a.quit ? ' <span class="tag red-t">퇴사 예정</span>' : ''}</div><div class="sub">${st}</div></div><div class="eqs">${eqIcons(a)}</div></div>
    <div class="bar hp"><i data-hp="${a.id}"></i></div><div class="bar mp"><i data-mp="${a.id}"></i></div>
    <div class="stats"><span>힘 <b>${d.T.str}</b></span><span>체력 <b>${d.T.vit}</b></span><span>민첩 <b>${d.T.agi}</b></span><span>지능 <b>${d.T.int}</b></span><span class="muted">${a.skills.map(s => SKILLS[s].name).join(' · ')}</span></div>
  </button>`;
}
function candCard(c) {
  let cond = '', why = '';
  if (c.cond && c.cond.type === 'gift') { const have = S.inv[c.cond.item] || 0; cond = `<div class="row sub">${iconImg(c.cond.item)}<span class="grow">조건: ${ITEMS[c.cond.item].name} ${c.cond.qty}개 선물 (보유 ${have})</span></div>`; if (have < c.cond.qty) why = '선물이 모자라요'; }
  if (c.cond && c.cond.type === 'fame') { cond = `<div class="sub">조건: 명성 ${c.cond.min} 이상 (지금 ${S.fame})</div>`; if (S.fame < c.cond.min) why = '명성이 모자라요'; }
  if (!why && living().length >= beds()) why = '여관 방이 없어요';
  if (!why && S.gold < c.fee) why = '계약금이 모자라요';
  const C = CLASSES[c.cls], d = derive(c);
  return `<div class="card${c.hero ? ' hl' : ''}">
    <div class="row"><img class="por" src="${portrait(c)}" alt=""><div class="grow"><div class="h">${esc(c.name)} <small>${C.name} Lv${c.lv}</small>${c.hero ? ' <span class="tag gold-t">용사</span>' : ''}</div><div class="sub">${C.desc}</div></div><div class="eqs">${eqIcons(c)}</div></div>
    <div class="stats"><span>힘 <b>${d.T.str}</b></span><span>체력 <b>${d.T.vit}</b></span><span>민첩 <b>${d.T.agi}</b></span><span>지능 <b>${d.T.int}</b></span><span>HP <b>${d.maxHp}</b></span><span>MP <b>${d.maxMp}</b></span><span>봉급 <b>${fmt(c.salary)}G/월</b></span></div>
    <div class="sub muted">${esc(c.bio)}</div>${cond}
    <div class="row"><span class="sub grow">${why ? `<span class="red-t">${why}</span>` : '고용할 수 있어요'}</span><button type="button" class="btn sm gold" data-act="hire" data-id="${c.id}"${why ? ' disabled' : ''}>고용 · 계약금 ${fmt(c.fee)}G</button></div>
  </div>`;
}
PANELS.adv = () => `
  <div class="sec"><b>소속 모험가</b><span>${living().length}/${beds()}명 · 눌러서 자세히</span></div>
  ${living().map(advCard).join('') || '<div class="card"><div class="sub">모험가가 없어요. 아래 여관 손님 중에서 고용하세요.</div></div>'}
  <div class="sec"><b>여관 손님</b><span>이틀마다 새 손님</span></div>
  ${S.cands.map(candCard).join('')}
  ${S.graves.length ? `<details class="card"><summary>묘지 · ${S.graves.length}명</summary><div class="log">${S.graves.slice(0, 30).map(g => `<div><span class="d">${g.date}</span>${esc(g.name)} (${CLASSES[g.cls].name} Lv${g.lv}) · ${esc(g.where)}</div>`).join('')}</div></details>` : ''}`;

/* 모험가 상세 창 */
function advDetail(a) {
  const d = derive(a), G = gearSum(a), idle = a.status === 'idle', canTr = S.bld.training && idle && trainedTotal(a) < trainCap(a);
  const stats = STATS.map(([k, n]) => `<div class="li flat"><span class="grow">${n} <b class="num">${d.T[k]}</b> <span class="sub muted">· 기본 ${a.st[k]}${a.tr[k] ? ` · 훈련 +${a.tr[k]}` : ''}${G[k] ? ` · 장비 ${G[k] > 0 ? '+' : ''}${G[k]}` : ''}</span></span>${S.bld.training ? `<button type="button" class="btn sm" data-mact="train" data-k="${k}"${canTr && S.gold >= trainCost(a) ? '' : ' disabled'}>+1 · ${fmt(trainCost(a))}G</button>` : ''}</div>`).join('');
  const derived = [['HP', `${Math.ceil(a.hp)}/${d.maxHp}`], ['MP', `${Math.ceil(a.mp)}/${d.maxMp}`], ['공격', d.atk.toFixed(1)], ['마법', d.matk.toFixed(1)], ['방어', d.def.toFixed(1)], ['회피', Math.round(d.eva * 1000) / 10 + '%'], ['치명', Math.round(d.crit * 1000) / 10 + '%'], ['공격속도', d.spd.toFixed(2) + '/초'], ['이동속도', d.move.toFixed(1)], ['짐', d.carry]]
    .map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join('');
  const slots = SLOTS.map(([s, n]) => {
    const g = a.eq[s];
    const pool = S.gear.filter(x => GTYPES[x.base].slot === s && gearFits(a, x) && (!g || gearScore(x) >= gearScore(g))).sort((x, y) => gearScore(y) - gearScore(x)).slice(0, 4);
    return `<div class="li col"><div class="row">${g ? gImg(g, 'ico q-b q' + g.q) : '<span class="ico empty"></span>'}<div class="grow stack"><span>${n} · ${g ? gearName(g) + ' ' + qTag(g) : '<span class="muted">비어 있음</span>'}</span>${g ? `<span class="sub">${statLine(gearStats(g))}</span>` : ''}</div>${g && idle ? `<button type="button" class="btn sm" data-mact="uneq" data-s="${s}">빼기</button>` : ''}</div>
      ${idle ? pool.map(x => `<div class="row sub swap">${gImg(x)}<span class="grow">${gearName(x)} ${qTag(x)} · ${statLine(gearStats(x))}</span><button type="button" class="btn sm" data-mact="eq" data-g="${x.id}">끼우기</button></div>`).join('') : ''}</div>`;
  }).join('');
  const learned = a.skills.map(id => { const s = SKILLS[id]; return `<div class="li"><div class="grow"><span>${s.name} <span class="muted">· ${costStr(s)}</span></span><span class="sub">${s.desc}</span></div>${id !== CLASSES[a.cls].innate && idle ? `<button type="button" class="btn sm" data-mact="forget" data-s="${id}">잊기</button>` : ''}</div>`; }).join('');
  const books = Object.keys(S.inv).filter(k => ITEMS[k].book && S.inv[k] > 0 && !a.skills.includes(ITEMS[k].book) && canLearn(a, ITEMS[k].book));
  const learnable = books.map(k => { const id = ITEMS[k].book, s = SKILLS[id]; return `<div class="li">${iconImg(k)}<div class="grow"><span>${s.name} <span class="muted">· ${costStr(s)}</span></span><span class="sub">${s.desc}</span></div><button type="button" class="btn sm gold" data-mact="learn" data-s="${id}"${S.bld.training && idle && a.skills.length < MAX_SKILLS && S.gold >= s.lv * 30 ? '' : ' disabled'}>배우기 ${s.lv * 30}G</button></div>`; }).join('');
  const table = SKILL_IDS.filter(id => SKILLS[id].cls.includes(a.cls) || SKILLS[id].cls.includes('all')).sort((x, y) => SKILLS[x].lv - SKILLS[y].lv)
    .map(id => { const s = SKILLS[id], has = a.skills.includes(id); return `<div class="${has ? 'ok-t' : a.lv >= s.lv ? '' : 'muted'}">Lv${s.lv} ${s.name} · ${costStr(s)} · ${has ? '배움' : id === CLASSES[a.cls].innate ? '기본' : '스킬북 필요'}${s.cls.includes('all') ? ' · 공용' : ''}</div>`; }).join('');
  return `
    <div class="row"><img class="por" src="${portrait(a)}" alt=""><div class="grow"><div class="h">${CLASSES[a.cls].name} Lv${a.lv}${a.hero ? ' <span class="tag gold-t">용사</span>' : ''}</div><div class="sub">경험치 ${fmt(a.exp)}/${fmt(expNeed(a.lv))} · 봉급 ${fmt(a.salary)}G/월 · 처치 ${a.kills || 0}</div><div class="bar xp"><i style="width:${pct(a.exp, expNeed(a.lv))}%"></i></div></div></div>
    ${idle ? '' : '<div class="sub red-t">원정 중에는 보기만 할 수 있어요.</div>'}
    <div class="sec"><b>능력치</b><span>${S.bld.training ? `훈련 ${trainedTotal(a)}/${trainCap(a)}번` : '훈련소를 지으면 훈련할 수 있어요'}</span></div>
    <div class="list">${stats}</div>
    <div class="stats boxed">${derived}</div>
    <div class="sec"><b>장비</b>${idle ? '<button type="button" class="btn sm" data-mact="autoeq">가장 좋은 장비 끼우기</button>' : ''}</div>
    <div class="list">${slots}</div>
    <div class="sec"><b>스킬</b><span>${a.skills.length}/${MAX_SKILLS}개</span></div>
    <div class="list">${learned}</div>
    ${learnable ? `<div class="sec"><b>배울 수 있는 스킬북</b><span>${S.bld.training ? '훈련소에서 배워요' : '훈련소가 필요해요'}</span></div><div class="list">${learnable}</div>` : ''}
    <details class="card"><summary>${CLASSES[a.cls].name}이(가) 배울 수 있는 스킬 전체</summary><div class="log">${table}</div></details>
    <div class="sub muted">${esc(a.bio)}</div>
    ${idle ? '<div class="btns"><button type="button" class="btn sm red" data-mact="fire">내보내기</button></div>' : ''}`;
}
function openAdv(aid) {
  const a = advById(aid);
  if (!a) return;
  UI.advHtml = advDetail(a);
  openModal(a.name, UI.advHtml, [{ label: '닫기', cls: 'gold' }]);
  UI.advOpen = aid;
  $('m-body').onclick = e => {
    const b = e.target.closest('[data-mact]');
    if (!b || b.disabled) return;
    const k = b.dataset.mact, x = advById(aid);
    if (!x) return;
    let m = '';
    if (k === 'train') m = trainStat(aid, b.dataset.k);
    if (k === 'eq') m = equip(aid, +b.dataset.g);
    if (k === 'uneq') m = unequip(aid, b.dataset.s);
    if (k === 'autoeq') m = autoEquip(aid);
    if (k === 'learn') m = learnSkill(aid, b.dataset.s);
    if (k === 'forget') { forgetSkill(aid, b.dataset.s); }
    if (k === 'fire') { confirmBox('모험가 내보내기', `${x.name}을(를) 내보낼까요? 끼고 있던 장비는 창고로 돌아와요.`, '내보내기', () => { say(fire(aid)); renderPanel(true); saveGame(); }, true); return; }
    say(m);
    refreshAdv(true);
    renderPanel(true); updateHud(); saveGame();
  };
}
// 열려 있는 모험가 창을 최신 상태로 (펼친 목록은 그대로 둔다)
function refreshAdv(force) {
  if (!UI.advOpen || !UI.modal || (UI.mhold && !force)) return;
  const a = advById(UI.advOpen);
  if (!a) return;
  const html = advDetail(a);
  if (!force && html === UI.advHtml) return;
  const body = $('m-body'), det = body.querySelector('details'), open = det && det.open;
  body.innerHTML = html; UI.advHtml = html;
  if (open) body.querySelector('details').open = true;
}

/* 원정 */
function partyCard(p) {
  const e = p.exp, on = S.view === p.id;
  const head = `<div class="row"><div class="grow"><div class="h">${esc(p.name)} <small>${p.members.length}명</small></div><div class="sub" data-pst="${p.id}"></div></div>${on ? '<span class="tag gold-t">화면에 표시 중</span>' : `<button type="button" class="btn sm" data-act="view" data-id="${p.id}">화면 보기</button>`}</div>`;
  const toggles = `<button type="button" class="btn sm${p.auto ? ' on' : ''}" data-act="auto" data-id="${p.id}">짐 차면 복귀 ${p.auto ? '켬' : '끔'}</button><button type="button" class="btn sm${p.safe ? ' on' : ''}" data-act="safe" data-id="${p.id}">위험하면 복귀 ${p.safe ? '켬' : '끔'}</button><button type="button" class="btn sm${p.repeat ? ' on' : ''}" data-act="repeat" data-id="${p.id}">돌아오면 다시 출발 ${p.repeat ? '켬' : '끔'}</button>`;
  if (e) {
    const team = teamOf(p);
    const canD = e.c10 && e.area === 'field' && e.mode === 'advance';
    return `<div class="card${on ? ' hl' : ''}">${head}
      <div class="sub" data-pwhere="${p.id}"></div>
      <div class="bar big load"><i data-prog="${p.id}"></i></div>
      ${team.map(a => `<div class="row"><span class="sub" style="width:7.5em">${esc(a.name)} <span class="muted">Lv${a.lv}</span></span><div class="grow"><div class="bar hp"><i data-hp="${a.id}"></i></div><div class="bar mp"><i data-mp="${a.id}"></i></div></div></div>`).join('')}
      <div class="row sub"><span class="grow">짐 <b data-load="${p.id}"></b> · 처치 <b data-kills="${p.id}"></b></span><span data-sup="${p.id}"></span></div>
      <div class="btns">${e.mode === 'advance' ? `<button type="button" class="btn sm" data-act="recall" data-id="${p.id}">복귀</button>` : ''}${canD ? `<button type="button" class="btn sm gold" data-act="dungeon" data-id="${p.id}">${FIELDS[e.field].dungeon.name} 입장</button>` : ''}${toggles}</div></div>`;
  }
  const pool = S.advs.filter(a => a.status === 'idle');
  const dest = p.dest && isUnlocked(p.dest) ? p.dest : 'plains';
  const team = teamOf(p);
  const cap = Math.round(team.reduce((s, a) => s + derive(a).carry, 0) * (1 + rlv('carry') * 0.1)), supW = wOf(p.sup);
  const fast = team.length ? team.slice().sort((x, y) => derive(y).move - derive(x).move)[0] : null;
  const hurt = team.some(a => a.hp < derive(a).maxHp * 0.7);
  const avg = Math.round(avgLvOf(p));
  const fields = ALL_FIELDS.filter(f => f !== 'alley' || isUnlocked('alley')).map(fid => {
    const F = FIELDS[fid], ok = isUnlocked(fid), fs = S.fields[fid];
    const sub = F.raid ? '암살자 길드 토벌 · Lv28+ 권장' : ok ? `권장 Lv${F.lv + 3}+ · 최고 ${F.no}-${fs.best || 0}${fs.cleared ? ' ★' : ''}` : '이전 던전 공략 필요';
    return `<button type="button" class="fbtn${dest === fid ? ' on' : ''}${F.raid ? ' raid' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>${F.name}</span><small>${sub}</small></button>`;
  }).join('');
  const last = p.last ? `<div class="sub muted">지난 원정: ${FIELDS[p.last.field].name}, 처치 ${p.last.kills}마리, 부속품 ${Object.values(p.last.got).reduce((s, q) => s + q, 0)}개${p.last.gear ? `, 장비 ${p.last.gear}개` : ''}</div>` : '';
  return `<div class="card${on ? ' hl' : ''}">${head}
    <div class="sec" style="margin-top:2px"><b>파티원</b><span>눌러서 넣고 빼기</span></div>
    <div class="list">${pool.map(a => { const o = partyOf(a.id), inP = p.members.includes(a.id), d = derive(a); return `<button type="button" class="pick${inP ? ' on' : ''}" data-act="member" data-id="${p.id}" data-a="${a.id}"><i class="chk"></i><img class="ico" src="${portrait(a)}" alt="" style="width:20px;height:24px"><span class="grow">${esc(a.name)} <span class="muted">${CLASSES[a.cls].name} Lv${a.lv}${o && o !== p ? ' · ' + esc(o.name) : ''}</span></span><span class="sub num">HP ${pct(a.hp, d.maxHp)}%</span></button>`; }).join('') || '<div class="sub">대기 중인 모험가가 없어요.</div>'}</div>
    <div class="sec"><b>보급품</b><span>가져간 물약만 쓸 수 있어요</span></div>
    ${POTIONS.filter(k => (S.inv[k] || 0) > 0 || (p.sup[k] || 0) > 0 || k === 'pot_s').map(k => `<div class="row">${iconImg(k)}<span class="grow sub">${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="step"><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="-1">−</button><span>${p.sup[k] || 0}</span><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="1">+</button></span></div>`).join('')}
    <div class="sec"><b>목적지</b><span>파티 평균 Lv${avg}</span></div>
    <div class="fields">${fields}</div>
    <div class="sub">짐 한도 ${cap} · 물약이 ${supW} 차지${fast ? ` · 이동속도 ${derive(fast).move.toFixed(1)} (가장 민첩한 ${esc(fast.name)} 기준)` : ''}</div>
    ${hurt ? '<div class="sub red-t">다친 모험가가 있어요. 상단에 두면 체력이 서서히 차요.</div>' : ''}
    ${last}
    <div class="btns">${toggles}</div>
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
    const q = stockOf(s.item), gk = isGearKey(s.item);
    const [, b, t] = gk ? s.item.split(':') : [];
    const name = gk ? `${GTIERS[+t].name} ${GTYPES[b].name}` : ITEMS[s.item].name;
    const icon = gk ? gImg({ base: b, t: +t }, 'ico lg') : iconImg(s.item, 'ico lg');
    const base = gk ? (gearsOfKey(s.item)[0] ? gearValue(gearsOfKey(s.item)[0]) : gearValue({ base: b, t: +t, q: 0 })) : ITEMS[s.item].v;
    return `<div class="card"><div class="row">${icon}<div class="grow"><div class="h">${name}</div><div class="sub">${q ? `재고 ${q}개` : '<span class="red-t">품절 · 창고에 들어오면 다시 팔려요</span>'}</div></div><button type="button" class="btn sm" data-act="unslot" data-i="${i}">내리기</button></div>
      <div class="btns">${TIERS.map((T, k) => `<button type="button" class="btn sm${s.tier === k ? ' on' : ''}" data-act="tier" data-i="${i}" data-t="${k}">${T.name} ${fmt(Math.round(base * T.m))}G</button>`).join('')}</div></div>`;
  }).join('');
  const parts = Object.keys(S.inv).filter(k => !ITEMS[k].potion && !ITEMS[k].book && S.inv[k] > 0).sort((a, b) => ITEMS[b].v - ITEMS[a].v);
  const total = parts.reduce((s, k) => s + ITEMS[k].v * S.inv[k], 0), rate = guildRate();
  const rows = parts.map(k => { const it = ITEMS[k], q = S.inv[k], one = Math.round(it.v * rate); return `<div class="li">${iconImg(k)}<div class="grow"><span>${it.name} <b class="num">×${q}</b></span><span class="sub muted">무게 ${it.w} · 기준가 ${it.v}G</span></div><div class="btns"><button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="1">${one}G</button>${q > 1 ? `<button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="${q}">모두 ${fmt(one * q)}G</button>` : ''}</div></div>`; }).join('');
  const gear = S.gear.slice().sort((x, y) => gearScore(y) - gearScore(x)).map(g => `<div class="li">${gImg(g, 'ico q-b q' + g.q)}<div class="grow"><span>${gearName(g)} ${qTag(g)}</span><span class="sub">${statLine(gearStats(g))}</span><span class="sub muted">${clsList(GTYPES[g.base].cls)} · Lv${GTIERS[g.t].lv}+ · 무게 ${GTYPES[g.base].w}</span></div><button type="button" class="btn sm" data-act="sellgear" data-id="${g.id}">${fmt(Math.round(gearValue(g) * GEAR_SELL))}G</button></div>`).join('');
  const books = Object.keys(S.inv).filter(k => ITEMS[k].book && S.inv[k] > 0).map(k => { const s = SKILLS[ITEMS[k].book]; return `<div class="li">${iconImg(k)}<div class="grow"><span>${s.name} <b class="num">×${S.inv[k]}</b></span><span class="sub muted">${clsList(s.cls)} · Lv${s.lv}+ · ${costStr(s)}</span></div><button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="1">${fmt(Math.round(ITEMS[k].v * rate))}G</button></div>`; }).join('');
  return `
  <div class="sec"><b>상점 진열대</b><span>오늘 ${sold.n}개 · ${fmt(sold.g)}G 판매</span></div>
  <div class="sub">진열한 부속품과 장비는 손님이 조금씩 사 가요. 비싸게 걸수록 천천히 팔려요.</div>
  ${slots}
  <div class="sec"><b>부속품</b><span>${parts.length}종 · 기준가 ${fmt(total)}G어치</span></div>
  <div class="sub">버튼을 누르면 모험가 길드가 기준가의 ${Math.round(rate * 100)}%에 바로 사 가요.</div>
  <div class="list">${rows || '<div class="li"><span class="sub">창고가 비어 있어요. 원정을 보내 부속품을 모아 오세요.</span></div>'}</div>
  <div class="sec"><b>장비 보관함</b><span>${S.gear.length}개 · 모험가 탭에서 끼워요</span></div>
  <div class="list">${gear || '<div class="li"><span class="sub">보관 중인 장비가 없어요. 대장간에서 만들거나 원정에서 주워 와요.</span></div>'}</div>
  ${books ? `<div class="sec"><b>스킬북</b><span>모험가 탭에서 배워요</span></div><div class="list">${books}</div>` : ''}
  <div class="sec"><b>물약</b><span>원정 보급품${spn('clinic') >= 1 ? ' · 진료소 할인' : ''}</span></div>
  ${POTIONS.map(k => `<div class="li">${iconImg(k)}<div class="grow"><span>${ITEMS[k].name} <b class="num">×${S.inv[k] || 0}</b></span><span class="sub muted">${ITEMS[k].heal ? `HP ${ITEMS[k].heal} 회복` : `MP ${ITEMS[k].mana} 회복`}</span></div><div class="btns"><button type="button" class="btn sm" data-act="buy" data-it="${k}" data-q="1"${S.gold < buyPrice(k) ? ' disabled' : ''}>${buyPrice(k)}G</button><button type="button" class="btn sm" data-act="buy" data-it="${k}" data-q="5"${S.gold < buyPrice(k) * 5 ? ' disabled' : ''}>5개 ${buyPrice(k) * 5}G</button></div></div>`).join('')}`;
};

/* 의뢰 */
PANELS.req = () => `
  <div class="sec"><b>의뢰 게시판</b><span>이틀마다 새 의뢰</span></div>
  ${S.reqs.map(r => { const have = reqHave(r), ok = have >= r.qty, dd = r.due - today();
    const icon = r.gear ? gImg({ base: r.gear.split(':')[0], t: +r.gear.split(':')[1] }, 'ico lg') : iconImg(r.item, 'ico lg');
    return `<div class="card${ok ? ' hl' : ''}${r.special ? ' special' : ''}">
    <div class="row"><div class="grow"><div class="h">${esc(r.client)}${r.special ? ' <span class="tag gold-t">특별</span>' : ''}</div><div class="sub">기한 <span class="${dd <= 1 ? 'red-t' : ''}">D-${dd}</span></div></div><div class="sub num"><span class="gold-t">${fmt(r.reward)}G</span> · <span class="fame-t">명성 +${r.fame}</span></div></div>
    <div class="row">${icon}<span class="grow">${reqName(r)} ${r.qty}개${r.gear ? ' <span class="muted">(품질 상관없음)</span>' : ''} <span class="sub ${ok ? 'ok-t' : 'muted'}">보유 ${have}</span></span><button type="button" class="btn sm gold" data-act="fulfill" data-id="${r.id}"${ok ? '' : ' disabled'}>전달하기</button></div>
  </div>`; }).join('') || '<div class="card"><div class="sub">지금은 의뢰가 없어요.</div></div>'}
  <div class="sub muted">의뢰를 끝내면 길드에 파는 것보다 많이 받고 명성도 올라요. 대장간을 지으면 장비 주문도 들어오고, 후원을 늘리면 특별 의뢰가 와요.</div>`;

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
  const D = {};
  const dOf = a => D[a.id] || (D[a.id] = derive(a));
  box.querySelectorAll('[data-hp]').forEach(el => { const a = advById(+el.dataset.hp); if (!a) return; const mx = dOf(a).maxHp; el.style.width = pct(a.hp, mx) + '%'; el.classList.toggle('low', a.hp < mx * 0.35); });
  box.querySelectorAll('[data-mp]').forEach(el => { const a = advById(+el.dataset.mp); if (a) el.style.width = pct(a.mp, dOf(a).maxMp) + '%'; });
  box.querySelectorAll('[data-pst]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.pst); if (p) el.textContent = expStatus(p); });
  box.querySelectorAll('[data-pwhere]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.pwhere); if (p && p.exp) el.textContent = whereStr(p.exp); });
  box.querySelectorAll('[data-prog]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.prog); if (p && p.exp) el.style.width = pct(routePos(p.exp), 15 * STAGE_LEN) + '%'; });
  box.querySelectorAll('[data-load]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.load); if (p) el.textContent = `${usedOf(p)}/${capOf(p)}`; });
  box.querySelectorAll('[data-kills]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.kills); if (p && p.exp) el.textContent = p.exp.kills; });
  box.querySelectorAll('[data-sup]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.sup); if (p && p.exp) el.textContent = `물약 ${wOf(p.exp.sup)}개 남음${p.exp.gbag.length ? ` · 장비 ${p.exp.gbag.length}` : ''}`; });
}

/* ───────── 누르기 ───────── */
const findP = id => S.parties.find(p => p.id === +id);
const ACT = {
  build: d => say(upgrade(d.id)),
  sponsor: d => say(sponsor(d.id)),
  smithT: d => { UI.smithT = +d.i; },
  smith: d => { const r = smith(d.b, +d.t); if (typeof r === 'string') say(r); else say(`${QUALITY[r.q].name} ${gearName(r)} 완성`); },
  craft: d => say(craft(+d.i) || '물약을 만들었어요'),
  bankok: d => say(bankAccept(+d.id)),
  research: d => say(startResearch(d.id)),
  hire: d => say(hire(+d.id) || '고용했어요'),
  advopen: d => openAdv(+d.id),
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
  sellgear: d => sellGear(+d.id),
  buy: d => say(buy(d.it, +d.q)),
  slot: d => pickForSlot(+d.i),
  unslot: d => setSlot(+d.i, null),
  tier: d => { const s = S.shop.slots[+d.i]; if (s) { s.tier = +d.t; changed(); } },
  fulfill: d => say(fulfill(+d.id)),
  reset: () => confirmBox('처음부터 다시', '저장된 진행 상황이 모두 지워져요. 되돌릴 수 없어요.', '모두 지우기', () => { resetGame(); showTitle(); }, true)
};
function pickForSlot(i) {
  const used = S.shop.slots.filter(Boolean).map(s => s.item);
  const parts = Object.keys(S.inv).filter(k => !ITEMS[k].potion && !ITEMS[k].book && S.inv[k] > 0 && !used.includes(k));
  const gks = [...new Set(S.gear.map(g => `g:${g.base}:${g.t}`))].filter(k => !used.includes(k));
  if (!parts.length && !gks.length) { say('진열할 물건이 없어요'); return; }
  const rows = parts.map(k => `<button type="button" class="pick" data-slotpick="${k}">${iconImg(k)}<span class="grow">${ITEMS[k].name} <span class="muted">×${S.inv[k]}</span></span><span class="sub">정가 ${Math.round(ITEMS[k].v * TIERS[1].m)}G</span></button>`)
    .concat(gks.map(k => { const [, b, t] = k.split(':'), g = gearsOfKey(k)[0]; return `<button type="button" class="pick" data-slotpick="${k}">${gImg(g)}<span class="grow">${gearName(g)} <span class="muted">×${gearsOfKey(k).length}</span></span><span class="sub">정가 ${fmt(Math.round(gearValue(g) * TIERS[1].m))}G</span></button>`; })).join('');
  openModal(`${i + 1}번 진열대`, `<div class="list">${rows}</div>`, [{ label: '닫기' }]);
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
  const mb = $('m-box');
  mb.addEventListener('pointerdown', () => { UI.mhold = true; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => mb.addEventListener(t, () => setTimeout(() => { UI.mhold = false; }, 180)));
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
