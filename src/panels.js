/* ───────── 창 화면 ───────── */
const PANELS = {};
const qTag = g => `<span class="q q${g.q}">${QUALITY[g.q].name}</span>`;
const gImg = (g, cls = 'ico') => `<img class="${cls}" src="${gearIconURL(g)}" alt="">`;
function statLine(st) {
  return Object.entries(st).map(([k, v]) => `${STAT_NAMES[k]} ${PCT_STATS.includes(k) ? '+' + (Math.round(v * 1000) / 10) + '%' : (v > 0 ? '+' : '') + v}`).join(' · ');
}
const clsList = cls => (cls.includes('all') ? '모든 직업' : cls.map(c => CLASSES[c].name + (jobTier(c) === 1 ? ' 계열' : '')).join('·'));
// 직업 특성을 글로
const TR_TXT = {
  critMul: v => `치명타 피해 ×${v}`, guard: v => `받는 피해 -${Math.round(v * 100)}%`, tank: () => '적이 자주 노린다',
  lifesteal: v => `준 피해의 ${Math.round(v * 100)}% 흡혈`, rage: v => `체력이 줄수록 공격력 최대 +${Math.round(v * 100)}%`, pet: () => '동물 동료가 함께 공격',
  pen: v => `방어 ${Math.round(v * 100)}% 무시`, first: v => `싸움 첫 공격 ×${v}`, double: v => `${Math.round(v * 100)}% 확률로 두 번 공격`,
  luck: v => `전리품·금화 +${Math.round(v * 100)}%`, aoe: v => `마법이 다른 적에게 ${Math.round(v * 100)}% 번짐`, mdrain: v => `마법 피해의 ${Math.round(v * 100)}% 흡수`,
  hybrid: v => `기본 공격에 마법 피해 ${Math.round(v * 100)}%`, healPow: v => `치유량 ×${v}`, dot: v => `지속 피해 ×${v}`, bossDmg: v => `보스 피해 ×${v}`, aura: v => `파티 공격력 +${Math.round(v * 100)}%`
};
const trText = c => Object.entries(CLASSES[c].tr || {}).map(([k, v]) => (TR_TXT[k] ? TR_TXT[k](v) : '')).filter(Boolean).join(' · ');
const tierTag = c => (jobTier(c) > 1 ? ` <span class="tag fame-t">${jobTier(c)}차</span>` : '');
const runeDots = g => (runeSlots(g) ? ` <span class="runes">${Array.from({ length: runeSlots(g) }, (_, i) => { const r = g.runes && g.runes[i]; return r ? `<i style="--c:${ITEMS[r].c}" class="on"></i>` : '<i></i>'; }).join('')}</span>` : '');
const costStr = s => (s.passive ? '지속 효과' : s.cost.hp ? `HP ${Math.round(s.cost.hp * 100)}%` : `MP ${s.cost.mp}`);
const needStr = need => Object.entries(need).map(([k, q]) => { const h = S.inv[k] || 0; return `<span class="${h >= q ? '' : 'red-t'}">${ITEMS[k].name} ${h}/${q}</span>`; }).join(' · ');
const dots = (n, max) => '●'.repeat(n) + '○'.repeat(Math.max(0, max - n));
const licTag = a => { const L = LICENSE[a.rank || 0]; return `<span class="lic" style="--c:${L.c}">${L.name}</span>`; };
const injTag = a => (a.inj ? ` <span class="tag" style="color:${INJ[a.inj.sev].c}">${INJ[a.inj.sev].name}</span>` : '');
const mini = a => `<img class="ico" src="${portrait(a)}" alt="" style="width:20px;height:24px">`;
// 다친 모험가 한 줄: 치료 진행과 처치 버튼 (act: 패널은 data-act, 모험가 창은 data-mact)
function careRow(a, plan, act = 'act') {
  const I = INJ[a.inj.sev], rate = dayHeal(a, plan), days = Math.max(1, Math.ceil(injLeft(a) / rate)), done = treatedToday(a), tp = treatPreview(a);
  const b = (k, label, ok, cls = '') => `<button type="button" class="btn sm ${cls}" data-${act}="treat" data-id="${a.id}" data-k="${k}"${ok ? '' : ' disabled'}>${label}</button>`;
  const btns = [
    b('herb', `약초 ${HERB_USE}개 +${HERB_PTS}`, !done && (S.inv.herb || 0) >= HERB_USE),
    S.bld.temple ? b('med', tp.med ? `${ITEMS[tp.med.k].name} +${tp.med.v}` : '약재 없음', !done && tp.med) : '',
    b('pot', tp.pot ? `${ITEMS[tp.pot.k].name} +${tp.pot.v}` : '물약 없음', !done && tp.pot),
    canOp() ? b('op', a.inj.op ? '수술 받음' : `수술 ${fmt(opCost(a))}G`, !a.inj.op && S.gold >= opCost(a), 'gold') : ''
  ].join('');
  return `<div class="li col"><div class="row">${mini(a)}<div class="grow stack"><span>${esc(a.name)} <span class="muted">${CLASSES[a.cls].name} Lv${a.lv}</span> <span class="tag" style="color:${I.c}">${I.name}</span></span><span class="sub">치료 <b data-injn="${a.id}"></b>/${a.inj.need} · 하루 ${Math.round(rate)}씩 · 약 ${days}일${done ? ' · <span class="ok-t">오늘 처치함</span>' : ''}</span></div></div>
    <div class="bar inj"><i data-inj="${a.id}"></i></div><div class="btns">${btns}</div></div>`;
}

/* 상단 랭크 */
function rankCard() {
  const r = S.rank || 0, Rk = RANKS[r], q = rankReqs();
  const head = `<div class="row"><span class="rk">${Rk.name}</span><div class="grow"><div class="h">${Rk.name}랭크 · ${Rk.title}</div><div class="sub">랭크가 오르면 새 필드와 시설, 더 많은 파티·매대·방, 거래 혜택이 열려요.</div></div></div>`;
  if (!q) return `<div class="card hl">${head}<div class="sub gold-t">가장 높은 랭크에 올랐어요.</div></div>`;
  const N = RANKS[r + 1];
  const rows = q.map(x => `<div class="row sub"><span class="grow${x.ok ? ' ok-t' : ''}">${x.ok ? '✔' : '·'} ${x.label}</span><span class="num${x.ok ? ' ok-t' : ''}">${x.flag ? (x.ok ? '완료' : '아직') : `${fmt(x.cur)}/${fmt(x.need)}${x.gold ? 'G' : ''}`}</span></div>`).join('');
  return `<div class="card${rankReady() ? ' hl' : ''}">${head}
    <div class="sec" style="margin-top:2px"><b>${N.name}랭크 「${N.title}」 심사 조건</b></div><div>${rows}</div>
    <div class="sub gold-t">오르면: ${rankGifts(r + 1).join(' · ')}</div>
    <button type="button" class="btn gold block" data-act="rankup"${rankReady() ? '' : ' disabled'}>${rankReady() ? '랭크업 심사 받기' : '조건을 모두 채우면 심사를 받을 수 있어요'}</button></div>`;
}

/* 상단 */
// 상단: 하위 메뉴 → 창
const subBtn = (id, label, sub, hl) => `<button type="button" class="subbtn${hl ? ' hl' : ''}" data-act="sub" data-id="${id}"><b>${label}</b><span class="sub">${sub}</span></button>`;
PANELS.co = () => {
  const p = dateParts(S.t), dd = S.settleDay - today(), cost = rent() + payroll(), q = rankReqs();
  const done = q ? q.filter(x => x.ok).length : 0;
  return `
  <div class="card hl">
    <div class="row"><span class="rk">${RANKS[S.rank || 0].name}</span><div class="grow"><div class="h">${esc(S.company)}</div><div class="sub">${RANKS[S.rank || 0].title} · ${WORLD.capital} ${WORLD.street} 입구 · 제국력 ${p.y}년</div></div></div>
    <div class="stats"><span>모험가 <b>${living().length}/${beds()}</b></span><span>파티 <b>${S.parties.length}/${partyMax()}</b></span><span>처치 <b>${fmt(S.stats.kills)}</b></span><span>부상 <b class="${patients().length ? 'red-t' : ''}">${patients().length}</b></span><span>던전 <b>${FIELD_IDS.filter(f => S.fields[f].cleared).length}/${FIELD_IDS.length}</b></span></div>
  </div>
  <div class="submenu">
    ${subBtn('co_rank', '상단 랭크', q ? `다음 ${RANKS[(S.rank || 0) + 1].name}랭크 조건 ${done}/${q.length}` : '가장 높은 랭크', rankReady())}
    ${subBtn('co_money', '월말 정산', `D-${dd} · <span class="${S.gold >= cost ? '' : 'red-t'}">${fmt(cost)}G</span>`, dd <= 3)}
    ${subBtn('co_spon', '후원', `${Object.values(S.spons).reduce((s2, v) => s2 + v, 0)}/${Object.keys(SPONSORS).length * 3}단계`)}
    ${subBtn('co_king', '왕국 교역', S.king && S.king.visit ? `<span class="gold-t">${KINGDOMS[S.king.visit.k].name} 방문 중 · D-${S.king.visit.until - today()}</span>` : '이웃 왕국 상단이 물건을 사러 와요', !!(S.king && S.king.visit))}
    ${subBtn('co_relic', '유물', `${(S.relics || []).length}/${FIELD_IDS.length}개 · 던전 공략 보상`)}
    ${subBtn('co_goal', '목표', S.flags.guildDown ? '암살자 길드 토벌 완료' : raidReady() ? '<span class="gold-t">길드 토벌 준비 완료</span>' : '암살자 길드 · 마왕의 봉인', raidReady() && !S.flags.guildDown)}
    ${subBtn('co_log', '소식', esc((S.log[0] && S.log[0].text) || '아직 없어요').slice(0, 22) + '…')}
    ${subBtn('co_set', '설정', `저장 코드 · v${VERSION}`)}
  </div>`;
};
PANELS.co_rank = () => rankCard();
PANELS.co_king = () => {
  const v = S.king && S.king.visit;
  const visit = v ? (() => {
    const D = KINGDOMS[v.k];
    const rows = v.order.map(o => { const have = S.inv[o.it] || 0, left = o.n - o.got, one = Math.round(ITEMS[o.it].v * v.m); return `<div class="li">${iconImg(o.it)}<div class="grow"><span>${ITEMS[o.it].name} <b class="num">${o.got}/${o.n}</b></span><span class="sub">하나에 ${fmt(one)}G (기준가 ${ITEMS[o.it].v}G) · 창고 ${have}</span></div><button type="button" class="btn sm gold" data-act="kingsell" data-it="${o.it}"${left > 0 && have > 0 ? '' : ' disabled'}>${left <= 0 ? '다 채움' : have ? `${Math.min(left, have)}개 팔기` : '창고에 없음'}</button></div>`; }).join('');
    return `<div class="card hl" style="--kc:${D.c}"><div class="row"><span class="kbadge" style="background:${D.c};color:${D.c2}">${D.race}</span><div class="grow"><div class="h">${D.name} 상단</div><div class="sub">${D.desc}</div></div></div>
      <div class="sub gold-t">${dayLabel(v.until)}까지 머물러요 (D-${v.until - today()}) · 기준가의 ${Math.round(v.m * 100)}% · 지금까지 ${fmt(v.earned)}G${v.full ? ' · <span class="ok-t">주문 완료</span>' : ''}</div>
      <div class="list">${rows}</div></div>`;
  })() : `<div class="card"><div class="sub">지금은 찾아온 왕국 상단이 없어요. ${S.king ? `${dayLabel(S.king.next)}쯤 다음 상단이 올 거예요.` : ''}</div></div>`;
  const list = KINGDOM_IDS.map(k => { const D = KINGDOMS[k], open = kingOpen(k), f = favorOf(k), t = favorTier(f), nx = FAVOR[t + 1];
    return `<div class="card${open ? '' : ' dim'}"><div class="row"><span class="kbadge" style="background:${D.c};color:${D.c2}">${D.race}</span><div class="grow"><div class="h">${D.name} <small>${FAVOR[t].name}</small></div><div class="sub">${open ? `호감 ${Math.floor(f)}${nx ? `/${nx.at}` : ''} · 값 ${Math.round(FAVOR[t].m * 100)}%` : `${FIELDS[D.need].name}에 가 보면 교역을 시작해요`}</div></div></div>
    ${open ? `<div class="sub muted">찾는 물건: ${D.wants.map(i => ITEMS[i].name).join(', ')}</div>` : ''}</div>`; }).join('');
  return `${visit}<div class="sec"><b>이웃 왕국</b><span>주문을 채울수록 값을 더 쳐줘요</span></div>${list}`;
};
PANELS.co_relic = () => {
  const own = S.relics || [];
  return `<div class="sub">던전을 공략하면 그 주인이 지키던 유물을 하나씩 얻어요. 유물은 상단 전체에 힘을 줘요.</div>` + FIELD_IDS.map(f => { const R = RELICS[f], on = own.includes(f);
    return `<div class="card${on ? ' hl' : ' dim'}"><div class="row"><span class="relic${on ? ' on' : ''}"></span><div class="grow"><div class="h">${on ? R.name : '???'}</div><div class="sub">${on ? R.desc : `${FIELDS[f].dungeon.name} 공략 보상`}</div></div></div></div>`; }).join('');
};
PANELS.co_money = () => {
  const dd = S.settleDay - today(), cost = rent() + payroll(), sp = dateParts(S.settleDay * DAY_SEC);
  const dueDeps = S.bank.deps.filter(d => d.due - today() <= 5);
  return `<div class="sec" style="margin-top:0"><b>${sp.m}월 ${sp.d}일 정산</b><span>D-${dd}</span></div>
  <div class="card">
    <div class="row"><span class="grow">암살자 길드 자릿세</span><span class="num ${rent() ? 'red-t' : 'ok-t'}">${rent() ? fmt(rent()) + 'G' : '없음'}</span></div>
    <div class="row"><span class="grow">모험가 봉급 ${living().length}명</span><span class="num">${fmt(payroll())}G</span></div>
    <div class="row"><span class="grow"><b>합계</b></span><span class="num ${S.gold >= cost ? 'ok-t' : 'red-t'}">${fmt(cost)}G</span></div>
    <div class="sub">${S.gold >= cost ? '지금 가진 돈으로 낼 수 있어요.' : '돈이 모자라요. 자릿세를 못 내면 창고가 털리고, 봉급이 두 달 밀리면 모험가가 떠나요.'} 날짜는 게임을 켜 둔 동안에만 흘러요.</div>
    ${dueDeps.length ? `<div class="sub red-t">곧 돌려줄 예금: ${dueDeps.map(d => `${esc(d.who)} ${dayLabel(d.due)} ${fmt(Math.round(d.amount * (1 + d.rate / 100)))}G`).join(', ')}</div>` : ''}
  </div>
  ${S.bld.temple && S.bless ? `<div class="sec"><b>신전의 축복</b><span>다음 정산까지</span></div><div class="card hl"><div class="h">${BLESSINGS[S.bless.id].name}</div><div class="sub">${BLESSINGS[S.bless.id].desc}</div></div>` : ''}`;
};
PANELS.co_spon = () => Object.entries(SPONSORS).map(([k, P]) => {
  const t = spn(k), open = sponsorOpen(k);
  if (!open) return `<div class="card dim"><div class="h">${P.name}</div><div class="sub">${FIELDS[P.need].name}이(가) 열리면 후원할 수 있어요.</div></div>`;
  const next = t < 3 ? `<div class="row"><span class="sub grow">다음: ${P.perks[t]} · 명성 +${P.fame[t]}</span><button type="button" class="btn sm gold" data-act="sponsor" data-id="${k}"${S.gold < P.cost[t] ? ' disabled' : ''}>후원 ${fmt(P.cost[t])}G</button></div>` : '<div class="sub ok-t">모든 후원을 마쳤어요.</div>';
  return `<div class="card${t ? ' hl' : ''}"><div class="row"><div class="grow"><div class="h">${P.name} <small class="gold-t">${dots(t, 3)}</small></div><div class="sub">${P.desc}</div></div></div>
    ${t ? `<div class="sub ok-t">받는 혜택: ${P.perks.slice(0, t).join(' · ')}</div>` : ''}${next}</div>`;
}).join('');
PANELS.co_goal = () => {
  const R = GUILD_RAID, rd = S.flags.guildDown;
  const raid = rd ? '<div class="card hl"><div class="h">암살자 길드 토벌 <small class="ok-t">완료</small></div><div class="sub">오물거리에 더는 자릿세가 없다. 손님도 늘었다.</div></div>'
    : `<div class="card${raidReady() ? ' hl' : ''}"><div class="h">암살자 길드 토벌</div>
      <div class="sub">매달 자릿세를 뜯어 가는 그들을 쓸어버리면 자릿세가 사라져요. 길드 은신처는 Lv28 이상 파티를 권해요.</div>
      <div class="stats"><span class="${S.fame >= R.fame ? 'ok-t' : ''}">명성 ${S.fame}/${R.fame}</span><span class="${living().length >= R.advs ? 'ok-t' : ''}">모험가 ${living().length}/${R.advs}명</span><span class="${spn(R.sponsor) >= R.tier ? 'ok-t' : ''}">시민회 후원 ${spn(R.sponsor)}/${R.tier}단계</span></div>
      ${raidReady() ? '<div class="sub gold-t">준비 완료! 원정 창에서 7번가 뒷골목을 목적지로 고르세요.</div>' : ''}</div>`;
  return `${raid}<div class="card dim"><div class="h">마왕의 봉인 <small>${FIELD_IDS.filter(f => S.fields[f].cleared).length}/${FIELD_IDS.length}</small></div><div class="sub">필드마다 10 스테이지마다 필드 보스가 있고, 1-50의 주인을 쓰러뜨리면 던전 입구가 열린다. 던전은 한 번만 공략할 수 있고, 공략하면 큰 보상과 함께 상단 랭크업 조건 하나가 채워진다.</div></div>`;
};
PANELS.co_log = () => `<div class="card"><div class="log">${S.log.slice(0, 40).map(l => `<div class="${l.kind}"><span class="d">${l.d}</span>${esc(l.text)}</div>`).join('') || '<div>아직 소식이 없어요.</div>'}</div></div>`;
PANELS.co_set = () => `<div class="card"><div class="sub">진행 상황은 이 기기에 자동 저장돼요. 앱을 닫아도 최대 ${Math.round(offlineCap() / 3600)}시간까지 원정과 판매가 계속되고, 날짜와 시각은 그대로예요.</div>
    <div class="sub">저장 코드를 복사해 두면 다른 기기나 새로 설치한 앱으로 진행 상황을 옮길 수 있어요.</div>
    <div class="btns"><button type="button" class="btn sm" data-act="export">저장 코드 복사</button><button type="button" class="btn sm" data-act="import">저장 코드로 불러오기</button>${isApp() ? '<button type="button" class="btn sm" data-act="update">업데이트 확인</button>' : ''}</div>
    <div class="btns"><button type="button" class="btn sm red" data-act="reset">처음부터 다시 하기</button></div>
    <div class="sub muted">버전 ${VERSION}${BUILD_NO ? ` · 빌드 ${BUILD_NO}` : ''}</div></div>`;

/* 시설 */
function smithyBox() {
  const maxT = GTIERS.reduce((m, T, i) => (S.bld.smithy >= T.smith ? i : m), 0);
  if (UI.smithT == null || UI.smithT > maxT) UI.smithT = maxT;
  const t = UI.smithT, q = UI.smithQ || 0;
  const chips = GTIERS.map((T, i) => `<button type="button" class="btn sm${i === t ? ' on' : ''}" data-act="smithT" data-i="${i}"${S.bld.smithy >= T.smith ? '' : ' disabled'}>${T.name}</button>`).join('');
  const qchips = [0, 3, 4, 5, 6].map(k => `<button type="button" class="btn sm q${k}${k === q ? ' on' : ''}" data-act="smithQ" data-q="${k}">${k ? QUALITY[k].name : '일반 제작'}</button>`).join('');
  const B = q >= 3 ? BOSS_RECIPE[q] : null;
  const rows = GTYPE_IDS.map(b => {
    const g = { base: b, t, q }, ok = canSmith(b, t, q);
    return `<div class="li">${gImg(g, 'ico q-b q' + q)}<div class="grow"><span>${gearName(g)}${q ? ' ' + qTag(g) : ''} <span class="muted">· ${clsList(GTYPES[b].cls)} · Lv${GTIERS[t].lv}+</span></span><span class="sub">${statLine(gearStats(g))}</span><span class="sub">${needStr(smithNeed(b, t, q))} · ${fmt(smithFee(t, q))}G</span></div><button type="button" class="btn sm gold" data-act="smith" data-b="${b}" data-t="${t}" data-q="${q}"${ok ? '' : ' disabled'}>제작</button></div>`;
  }).join('');
  const note = B ? `<div class="sub ${S.bld.smithy >= smithLv(t, q) ? 'gold-t' : 'red-t'}">${QUALITY[q].name} 장비는 그 등급이 반드시 나와요. 보스 전용 부속품이 들고, 대장간 Lv${smithLv(t, q)}이 필요해요. 룬 칸 ${q}개.${q === 6 ? ' 신성 장비에는 레이드 몬스터의 부속품도 들어가요.' : ''}</div>`
    : '<div class="sub muted">일반 제작은 만들 때마다 일반·고급·희귀 품질이 정해져요. 대장간을 넓힐수록 좋은 품질이 잘 나와요.</div>';
  return `<div class="btns">${chips}</div><div class="btns">${qchips}</div>${note}<div class="list">${rows}</div>`;
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
function templeBox() {
  const B = S.bless && BLESSINGS[S.bless.id], hs = healers(), plan = healPlan(), pats = patients();
  const free = S.advs.filter(a => isHealer(a.cls) && !a.post && a.status === 'idle' && !a.inj);
  const hrows = hs.map(h => `<div class="li">${mini(h)}<div class="grow"><span>${esc(h.name)} <span class="muted">${CLASSES[h.cls].name} Lv${h.lv}</span></span><span class="sub">치료력 하루 +${Math.round(healPow(h))} · 환자 둘까지${SURGEONS.includes(h.cls) ? ' · 수술 가능' : ''}</span></div><button type="button" class="btn sm" data-act="post" data-id="${h.id}" data-on="0">내리기</button></div>`).join('');
  const add = hs.length < healerSlots() ? free.map(a => `<button type="button" class="pick" data-act="post" data-id="${a.id}" data-on="1"><i class="chk"></i>${mini(a)}<span class="grow">${esc(a.name)} <span class="muted">${CLASSES[a.cls].name} Lv${a.lv}${partyOf(a.id) ? ' · ' + esc(partyOf(a.id).name) + '에서 빠짐' : ''}</span></span><span class="sub num">+${Math.round(healPow(a))}/일</span></button>`).join('') : '';
  return `${B ? `<div class="sub gold-t">이번 달: ${B.name} · ${B.desc}</div>` : ''}
    <div class="sec" style="margin-top:2px"><b>치유사</b><span>${hs.length}/${healerSlots()}명</span></div>
    <div class="list">${hrows || '<div class="li"><span class="sub">성직자 계열이나 성기사를 두면 환자가 훨씬 빨리 나아요. 역병의사·명의는 수술도 해요.</span></div>'}${add}</div>
    <div class="sec"><b>환자</b><span>${pats.length}명 · 자연 치료 하루 ${Math.round(healRate())}</span></div>
    <div class="list">${pats.map(a => careRow(a, plan)).join('') || '<div class="li"><span class="sub">다친 모험가가 없어요.</span></div>'}</div>
    ${careFoot()}`;
}
const careFoot = () => `<div class="row sub"><span class="grow">약초 ${S.inv.herb || 0}개 · 처치는 환자마다 하루 한 번</span><button type="button" class="btn sm" data-act="buy" data-it="herb" data-q="6"${S.gold < buyPrice('herb') * 6 ? ' disabled' : ''}>약초 6개 ${buyPrice('herb') * 6}G</button><button type="button" class="btn sm${S.autoTreat ? ' on' : ''}" data-act="autotreat">자동 약초 ${S.autoTreat ? '켬' : '끔'}</button></div>`;
// 신전이 없을 때: 여관 방에서 쉬며 약초·물약으로 응급 처치만
function innCare() {
  const pats = patients();
  if (!pats.length) return '';
  const plan = healPlan();
  return `<div class="sub red-t">다친 모험가 ${pats.length}명이 여관 방에 누워 있어요. 신전을 지으면 하루 ${Math.round(healRate())} → ${(4 + 4) * (spn('clinic') >= 2 ? 1.5 : 1)}씩 낫고 약재·치유사·수술도 쓸 수 있어요.</div>
    <div class="list">${pats.map(a => careRow(a, plan)).join('')}</div>${careFoot()}`;
}
function towerBox() {
  const cur = S.research.cur;
  const rows = Object.entries(RESEARCH).map(([k, Rr]) => {
    const lv = rlv(k), c = researchCost(k);
    return `<div class="li"><div class="grow"><span>${Rr.name} <small class="gold-t">${dots(lv, Rr.max)}</small></span><span class="sub">${lv ? '지금: ' + Rr.desc(lv) + ' · ' : ''}${c ? '다음: ' + Rr.desc(lv + 1) : '최고 단계'}</span>${c ? `<span class="sub">${fmt(c[0])}G · ${needStr(c[1])} · ${Rr.days[lv]}일</span>` : ''}</div>${c ? `<button type="button" class="btn sm gold" data-act="research" data-id="${k}"${canResearch(k) ? '' : ' disabled'}>연구</button>` : ''}</div>`;
  }).join('');
  const runes = Object.keys(S.inv).filter(k => ITEMS[k] && ITEMS[k].rune && S.inv[k] > 0).sort();
  const fuse = runes.map(k => { const R = ITEMS[k].rune, nx = R[1] < 2 ? runeId(R[0], R[1] + 1) : null; return `<div class="li">${iconImg(k)}<div class="grow"><span>${ITEMS[k].name} <b class="num">×${S.inv[k]}</b></span><span class="sub">${statLine({ [RUNES[R[0]].st]: RUNES[R[0]].v[R[1]] })}${nx ? ` · ${RUNE_FUSE.n}개 → ${ITEMS[nx].name} (${fmt(RUNE_FUSE.fee[R[1]])}G)` : ''}</span></div>${nx ? `<button type="button" class="btn sm" data-act="fuse" data-it="${k}"${S.inv[k] >= RUNE_FUSE.n && S.gold >= RUNE_FUSE.fee[R[1]] ? '' : ' disabled'}>합치기</button>` : ''}</div>`; }).join('');
  const crests = FIELD_IDS.map((f, t) => 'crest_' + t).filter(k => (S.inv[k] || 0) > 0);
  const carve = crests.map(k => `<div class="li">${iconImg(k)}<div class="grow"><span>${ITEMS[k].name} <b class="num">×${S.inv[k]}</b></span><span class="sub">${RUNE_CARVE.crest}개와 ${RUNE_CARVE.fee}G로 무작위 하급 룬을 새겨요</span></div><button type="button" class="btn sm" data-act="carve" data-t="${k.split('_')[1]}"${S.inv[k] >= RUNE_CARVE.crest && S.gold >= RUNE_CARVE.fee ? '' : ' disabled'}>새기기</button></div>`).join('');
  return `${cur ? `<div class="sub gold-t">연구 중: ${RESEARCH[cur.k].name} ${rlv(cur.k) + 1}단계 · ${dayLabel(cur.done)} 완료</div>` : '<div class="sub">한 번에 하나씩 연구할 수 있어요. 연구 기간은 게임 속 날짜로 셉니다.</div>'}<div class="list">${rows}</div>
    <div class="sec"><b>룬 공방</b><span>룬은 장비 창에서 끼워요</span></div>
    <div class="list">${carve || '<div class="li"><span class="sub">필드 보스가 떨어뜨리는 「우두머리의 증표」로 룬을 새길 수 있어요.</span></div>'}${fuse}</div>`;
}
const BLD_INNER = { smithy: '대장간에서 장비 만들기', alchemy: '물약 만들기', temple: '치료와 치유사', bank: '예금과 대출', tower: '마법 연구' };
function bldCard(id, full) {
  const B = BUILDINGS[id], lv = S.bld[id], max = lv >= B.max, c = B.cost[lv], need = BUILD_RANK[id] || 0;
  if (!lv && (S.rank || 0) < need) return `<div class="card dim"><div class="row"><div class="grow"><div class="h">${B.name} <small>잠김</small></div><div class="sub">${B.desc}</div></div><span class="sub muted">${RANKS[need].name}랭크에 열림</span></div></div>`;
  const btn = max ? '<span class="sub muted">최고 단계</span>' : `<button type="button" class="btn sm${lv ? '' : ' gold'}" data-act="build" data-id="${id}"${S.gold < c ? ' disabled' : ''}>${lv ? '확장' : '건설'} ${fmt(c)}G</button>`;
  let body = '';
  if (full && lv && id === 'smithy') body = smithyBox();
  if (full && lv && id === 'alchemy') body = `<div class="list">${RECIPES.map((r, i) => `<div class="li">${iconImg(r.out)}<div class="grow"><span>${ITEMS[r.out].name} <span class="muted">창고 ${S.inv[r.out] || 0}</span></span><span class="sub">${S.bld.alchemy >= r.lv ? needStr(r.need) + ` · ${r.fee}G` : '공방 2단계 필요'}</span></div><button type="button" class="btn sm gold" data-act="craft" data-i="${i}"${canCraft(r) ? '' : ' disabled'}>만들기</button></div>`).join('')}</div>`;
  if (lv && id === 'training') body = '<div class="sub">모험가 창에서 능력치를 훈련하고, 스킬을 배우고, 전직할 수 있어요.</div>';
  if (full && lv && id === 'bank') body = bankBox();
  if (full && lv && id === 'tower') body = towerBox();
  if (id === 'temple' && (full || !lv)) body = lv ? templeBox() : innCare();
  if (id === 'shop' && lv) body = `<div class="sub">진열대 ${slotCount()}칸 · 손님 수 ×${traffic().toFixed(2)} · 진열은 창고 창에서 해요.</div>`;
  if (id === 'inn' && lv) body = `<div class="sub">방 ${living().length}/${beds()} · 모험가는 자기 방에서 자며 숙면 피로를 풀어요. 하루 ${Math.round(SLEEP.rest(lv) * DAY_SEC)}씩, 밤에는 더 빨리.</div>`;
  const open = !full && lv && BLD_INNER[id] ? `<button type="button" class="btn sm gold" data-act="bopen" data-id="${id}">${BLD_INNER[id]} ›</button>` : '';
  const sum = !full && lv && id === 'temple' && patients().length ? `<span class="sub red-t">환자 ${patients().length}명</span>` : '';
  return `<div class="card${lv ? '' : ' dim'}"><div class="row"><div class="grow"><div class="h">${B.name} <small>${lv ? 'Lv' + lv : '미건설'}</small></div><div class="sub">${B.desc}${lv ? ' · 지금: ' + B.eff(lv) : ''}</div></div>${btn}</div>${body}${open || sum ? `<div class="row">${sum}<span class="grow"></span>${open}</div>` : ''}</div>`;
}
PANELS.fac = () => BUILD_ORDER.map(id => bldCard(id, false)).join('');
PANELS.b = w => bldCard(w.b, true);

/* 모험가 */
function eqIcons(a) { return SLOTS.map(([s, n]) => (a.eq[s] ? gImg(a.eq[s], 'ico q-b q' + a.eq[s].q) : `<span class="ico empty" title="${n}"></span>`)).join(''); }
function advState(a, p) {
  if (a.status === 'away') return `<span class="warn">${esc(p ? p.name : '')} 원정 중</span>`;
  if (a.inj) return `<span class="red-t">${INJ[a.inj.sev].name} · ${S.bld.temple ? '신전에서' : '여관 방에서'} 치료 중</span>`;
  if (a.post) return '<span class="ok-t">신전에서 환자를 돌보는 중</span>';
  if ((a.sleep || 0) >= SLEEP.block) return `<span class="warn">여관에서 자는 중${p ? ' · ' + esc(p.name) : ''}</span>`;
  return p ? `대기 · ${esc(p.name)}` : '대기 · 파티 없음';
}
function advCard(a) {
  const p = partyOf(a.id), d = derive(a);
  return `<button type="button" class="card advc" data-act="advopen" data-id="${a.id}">
    <div class="row"><img class="por" src="${portrait(a)}" alt=""><div class="grow"><div class="h">${esc(a.name)} <small>${CLASSES[a.cls].name} Lv${a.lv}</small> ${licTag(a)}${a.hero ? ' <span class="tag gold-t">용사</span>' : ''}${tierTag(a.cls)}${injTag(a)}${a.quit ? ' <span class="tag red-t">퇴사 예정</span>' : ''}</div><div class="sub">${advState(a, p)}</div></div><div class="eqs">${eqIcons(a)}</div></div>
    <div class="bar hp"><i data-hp="${a.id}"></i></div><div class="bar mp"><i data-mp="${a.id}"></i></div><div class="bar fat"><i data-fat="${a.id}"></i></div><div class="bar slp"><i data-slp="${a.id}"></i></div>
    ${a.inj ? `<div class="bar inj"><i data-inj="${a.id}"></i></div>` : ''}
    <div class="stats"><span>힘 <b>${d.T.str}</b></span><span>체력 <b>${d.T.vit}</b></span><span>민첩 <b>${d.T.agi}</b></span><span>지능 <b>${d.T.int}</b></span><span>명성 <b>${Math.floor(a.pf || 0)}</b></span><span>피로 <b data-fatn="${a.id}">${Math.round(a.fat || 0)}</b></span><span>숙면 <b data-slpn="${a.id}">${Math.round(a.sleep || 0)}</b></span><span class="muted">${a.skills.map(s => SKILLS[s].name).join(' · ')}</span></div>
  </button>`;
}
function candCard(c) {
  let cond = '', why = '';
  if (c.cond && c.cond.type === 'gift') { const have = S.inv[c.cond.item] || 0; cond = `<div class="row sub">${iconImg(c.cond.item)}<span class="grow">조건: ${ITEMS[c.cond.item].name} ${c.cond.qty}개 선물 (보유 ${have})</span></div>`; if (have < c.cond.qty) why = '선물이 모자라요'; }
  if (c.cond && c.cond.type === 'fame') { cond = `<div class="sub">조건: 명성 ${c.cond.min} 이상 (지금 ${S.fame})</div>`; if (S.fame < c.cond.min) why = '명성이 모자라요'; }
  if (!why && living().length >= beds()) why = '여관 방이 없어요';
  if (!why && S.gold < c.fee) why = '계약금이 모자라요';
  const C = CLASSES[c.cls], d = derive(c);
  return `<div class="card">
    <div class="row"><img class="por" src="${portrait(c)}" alt=""><div class="grow"><div class="h">${esc(c.name)} <small>${C.name} Lv${c.lv}</small> ${licTag(c)}</div><div class="sub">${C.desc}</div></div><div class="eqs">${eqIcons(c)}</div></div>
    <div class="stats"><span>힘 <b>${d.T.str}</b></span><span>체력 <b>${d.T.vit}</b></span><span>민첩 <b>${d.T.agi}</b></span><span>지능 <b>${d.T.int}</b></span><span>HP <b>${d.maxHp}</b></span><span>MP <b>${d.maxMp}</b></span><span>봉급 <b>${fmt(c.salary)}G/월</b></span></div>
    <div class="sub muted">${esc(c.bio)}</div>${cond}
    <div class="row"><span class="sub grow">${why ? `<span class="red-t">${why}</span>` : '고용할 수 있어요'}</span><button type="button" class="btn sm gold" data-act="hire" data-id="${c.id}"${why ? ' disabled' : ''}>고용 · 계약금 ${fmt(c.fee)}G</button></div>
  </div>`;
}
function jobTreeList() {
  return ['warrior', 'archer', 'rogue', 'mage', 'cleric'].map(b => `<div><b>${CLASSES[b].name}</b> → ${nextJobs(b).map(c => `${CLASSES[c].name}(${nextJobs(c).map(x => CLASSES[x].name).join('')})`).join(' · ')}</div>`).join('') + '<div class="muted">짐꾼은 짐꾼 그대로예요.</div>';
}
PANELS.adv = () => `
  <div class="sec"><b>소속 모험가</b><span>${living().length}/${beds()}명 · 눌러서 자세히</span></div>
  ${living().map(advCard).join('') || '<div class="card"><div class="sub">모험가가 없어요. 아래 여관 손님 중에서 고용하세요.</div></div>'}
  <details class="card"><summary>라이선스와 전직 안내 · 2차 ${jobOpen(2) ? '열림' : `명성 ${JOB_FAME[2]}`} · 3차 ${jobOpen(3) ? '열림' : `명성 ${JOB_FAME[3]}`}</summary><div class="log">
    <div>모험가는 원정에서 몬스터를 잡고, 필드 보스와 던전을 쓰러뜨리고, 무사히 돌아올 때마다 개인 명성을 쌓아요. 레벨과 개인 명성이 차면 모험가 길드 심사를 받아 ${LICENSE.map(L => L.name).join(' → ')}로 올라가요. 라이선스가 오를수록 능력이 강해지고 봉급도 올라요.</div>
    <div>2차 전직은 상단 명성 ${JOB_FAME[2]}에 열리고 Lv${JOB_REQ[2].lv}·${LICENSE[JOB_REQ[2].rank].name} 라이선스·${fmt(JOB_REQ[2].fee)}G, 3차 전직은 명성 ${JOB_FAME[3]}에 열리고 Lv${JOB_REQ[3].lv}·${LICENSE[JOB_REQ[3].rank].name} 라이선스·${fmt(JOB_REQ[3].fee)}G가 들어요. 훈련소에서 전직하면 모습도 직업에 맞게 바뀌어요.</div>${jobTreeList()}
    <div>스킬 칸은 기본 ${MAX_SKILLS}칸이고 Lv${SKILL_SLOT_LV.join('·')}에 한 칸씩 늘어요. 최고 레벨은 ${MAX_LV}이에요.</div></div></details>
  <div class="sec"><b>여관 손님</b><span>이틀마다 새 손님</span></div>
  ${S.cands.map(candCard).join('')}`;

/* 모험가 상세 창 */
function advDetail(a) {
  const d = derive(a), G = gearSum(a), idle = a.status === 'idle', canTr = S.bld.training && idle && trainedTotal(a) < trainCap(a);
  const stats = STATS.map(([k, n]) => `<div class="li flat"><span class="grow">${n} <b class="num">${d.T[k]}</b> <span class="sub muted">· 기본 ${a.st[k]}${a.tr[k] ? ` · 훈련 +${a.tr[k]}` : ''}${G[k] ? ` · 장비 ${G[k] > 0 ? '+' : ''}${G[k]}` : ''}</span></span>${S.bld.training ? `<button type="button" class="btn sm" data-mact="train" data-k="${k}"${canTr && S.gold >= trainCost(a) ? '' : ' disabled'}>+1 · ${fmt(trainCost(a))}G</button>` : ''}</div>`).join('');
  const derived = [['HP', `${Math.ceil(a.hp)}/${d.maxHp}`], ['MP', `${Math.ceil(a.mp)}/${d.maxMp}`], ['피로', `${Math.round(a.fat || 0)}/100`], ['숙면 피로', `${Math.round(a.sleep || 0)}/100`], ['공격', d.atk.toFixed(1)], ['마법', d.matk.toFixed(1)], ['방어', d.def.toFixed(1)], ['회피', Math.round(d.eva * 1000) / 10 + '%'], ['치명', Math.round(d.crit * 1000) / 10 + '%'], ['공격속도', d.spd.toFixed(2) + '/초'], ['이동속도', d.move.toFixed(1)], ['짐', d.carry]]
    .map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join('');
  const slots = SLOTS.map(([s, n]) => {
    const g = a.eq[s];
    const pool = S.gear.filter(x => GTYPES[x.base].slot === s && gearFits(a, x) && (!g || gearScore(x) >= gearScore(g))).sort((x, y) => gearScore(y) - gearScore(x)).slice(0, 4);
    return `<div class="li col"><div class="row">${g ? gImg(g, 'ico q-b q' + g.q) : '<span class="ico empty"></span>'}<div class="grow stack"><span>${n} · ${g ? gearName(g) + ' ' + qTag(g) : '<span class="muted">비어 있음</span>'}</span>${g ? `<span class="sub">${statLine(gearStats(g))}</span>` : ''}</div>${g && idle ? `<button type="button" class="btn sm" data-mact="uneq" data-s="${s}">빼기</button>` : ''}</div>
      ${g && runeSlots(g) ? `<div class="row sub"><span class="grow">룬 ${(g.runes || []).length}/${runeSlots(g)}${runeDots(g)}</span>${idle ? `<button type="button" class="btn sm" data-mact="rune" data-g="${g.id}">룬 끼우기</button>` : ''}</div>` : ''}
      ${idle ? pool.map(x => `<div class="row sub swap">${gImg(x)}<span class="grow">${gearName(x)} ${qTag(x)} · ${statLine(gearStats(x))}</span><button type="button" class="btn sm" data-mact="eq" data-g="${x.id}">끼우기</button></div>`).join('') : ''}</div>`;
  }).join('');
  const learned = a.skills.map(id => { const s = SKILLS[id]; return `<div class="li"><div class="grow"><span>${s.name} <span class="muted">· ${costStr(s)}</span></span><span class="sub">${s.desc}</span></div>${id !== CLASSES[a.cls].innate && idle ? `<button type="button" class="btn sm" data-mact="forget" data-s="${id}">잊기</button>` : ''}</div>`; }).join('');
  const books = Object.keys(S.inv).filter(k => ITEMS[k].book && S.inv[k] > 0 && !a.skills.includes(ITEMS[k].book) && canLearn(a, ITEMS[k].book));
  const room = a.skills.length < skillSlots(a), chain = chainOf(a.cls);
  const learnable = books.map(k => { const id = ITEMS[k].book, s = SKILLS[id]; return `<div class="li">${iconImg(k)}<div class="grow"><span>${s.name} <span class="muted">· ${costStr(s)}</span></span><span class="sub">${s.desc}</span></div><button type="button" class="btn sm gold" data-mact="learn" data-s="${id}"${S.bld.training && idle && room && S.gold >= s.lv * 30 ? '' : ' disabled'}>배우기 ${s.lv * 30}G</button></div>`; }).join('');
  const owns = SKILL_IDS.filter(id => SKILLS[id].own && chain.some(c => SKILLS[id].cls.includes(c)) && !a.skills.includes(id)).sort((x, y) => SKILLS[x].lv - SKILLS[y].lv);
  const ownRows = owns.map(id => { const s = SKILLS[id], ok = a.lv >= s.lv; return `<div class="li"><div class="grow"><span>${s.name} <span class="muted">· ${costStr(s)} · Lv${s.lv}${s.cls.includes(a.cls) ? '' : ` · ${s.cls.map(c => CLASSES[c] ? CLASSES[c].name : '').join('')}`}</span></span><span class="sub">${s.desc}</span></div><button type="button" class="btn sm gold" data-mact="learn" data-s="${id}"${ok && S.bld.training && idle && room && S.gold >= ownFee(s) ? '' : ' disabled'}>${ok ? `배우기 ${ownFee(s)}G` : `Lv${s.lv}부터`}</button></div>`; }).join('');
  const table = SKILL_IDS.filter(id => chain.some(c => SKILLS[id].cls.includes(c)) || SKILLS[id].cls.includes('all')).sort((x, y) => SKILLS[x].lv - SKILLS[y].lv)
    .map(id => { const s = SKILLS[id], has = a.skills.includes(id); return `<div class="${has ? 'ok-t' : a.lv >= s.lv ? '' : 'muted'}">Lv${s.lv} ${s.name} · ${costStr(s)} · ${has ? '배움' : id === CLASSES[a.cls].innate ? '기본' : s.own ? '고유 · 책 없이 배움' : '스킬북 필요'}${s.cls.includes('all') ? ' · 공용' : ''}</div>`; }).join('');
  const L = LICENSE[a.rank || 0], Ln = licNext(a);
  const lic = Ln ? `<div class="li"><div class="grow"><span>다음: ${LICENSE[a.rank + 1].name} <span class="muted">· 능력 ×${LICENSE[a.rank + 1].mul}</span></span><span class="sub"><span class="${a.lv >= Ln.lv ? 'ok-t' : ''}">Lv ${a.lv}/${Ln.lv}</span> · <span class="${(a.pf || 0) >= Ln.pf ? 'ok-t' : ''}">개인 명성 ${Math.floor(a.pf || 0)}/${Ln.pf}</span> · 심사비 ${fmt(Ln.fee)}G</span></div><button type="button" class="btn sm gold" data-mact="lic"${idle && a.lv >= Ln.lv && (a.pf || 0) >= Ln.pf && S.gold >= Ln.fee ? '' : ' disabled'}>심사</button></div>` : '<div class="li"><span class="sub gold-t">가장 높은 라이선스예요.</span></div>';
  const promo = nextJobs(a.cls).map(c => { const why = promoWhy(a, c), Q = JOB_REQ[jobTier(c)]; return `<div class="li job"><img class="por" src="${portrait(Object.assign({}, a, { cls: c }))}" alt=""><div class="grow"><span>${CLASSES[c].name} <span class="muted">· ${jobTier(c)}차 · 기본 스킬 ${SKILLS[CLASSES[c].innate].name}</span></span><span class="sub">${CLASSES[c].desc}</span><span class="sub gold-t">${trText(c)}</span>${why ? `<span class="sub red-t">${why}</span>` : ''}</div><button type="button" class="btn sm gold" data-mact="promo" data-c="${c}"${why ? ' disabled' : ''}>전직 ${fmt(Q.fee)}G</button></div>`; }).join('');
  const post = isHealer(a.cls) && S.bld.temple ? `<div class="li"><div class="grow"><span>신전 치유사</span><span class="sub">${a.post ? '신전에서 환자를 돌보고 있어요. 원정에는 나가지 않아요.' : `신전에 두면 환자를 하루 +${Math.round(healPow(a))}씩 치료해요.${SURGEONS.includes(a.cls) ? ' 수술도 해요.' : ''}`}</span></div><button type="button" class="btn sm${a.post ? '' : ' gold'}" data-mact="post"${idle && !a.inj && (a.post || healers().length < healerSlots()) ? '' : ' disabled'}>${a.post ? '내리기' : `배치 ${healers().length}/${healerSlots()}`}</button></div>` : '';
  return `
    <div class="row"><img class="por big" src="${portrait(a)}" alt=""><div class="grow"><div class="h">${CLASSES[a.cls].name} Lv${a.lv}${tierTag(a.cls)} ${licTag(a)}${a.hero ? ' <span class="tag gold-t">용사</span>' : ''}${injTag(a)}</div>${trText(a.cls) ? `<div class="sub gold-t">${trText(a.cls)}</div>` : ''}<div class="sub">경험치 ${fmt(a.exp)}/${fmt(expNeed(a.lv))} · 봉급 ${fmt(a.salary)}G/월 · 처치 ${a.kills || 0} · 개인 명성 ${Math.floor(a.pf || 0)}</div><div class="bar xp"><i style="width:${pct(a.exp, expNeed(a.lv))}%"></i></div></div></div>
    ${idle ? '' : '<div class="sub red-t">원정 중에는 보기만 할 수 있어요.</div>'}
    ${a.inj ? `<div class="sec"><b>부상</b><span>${S.bld.temple ? '신전' : '여관 방'}에서 치료 중</span></div><div class="list">${careRow(a, healPlan(), 'mact')}</div>` : ''}
    ${(a.sleep || 0) >= SLEEP.block ? `<div class="sub warn">숙면 피로 ${Math.round(a.sleep)} · ${SLEEP.block} 아래로 내려갈 때까지 여관에서 자야 원정에 나갈 수 있어요.</div>` : ''}
    <div class="sec"><b>모험가 라이선스</b><span>지금 ${L.name}${L.mul > 1 ? ` · 능력 ×${L.mul}` : ''}</span></div>
    <div class="list">${lic}</div>
    ${promo ? `<div class="sec"><b>${jobTier(a.cls) + 1}차 전직</b><span>${jobTier(a.cls) === 1 ? '셋 중 하나를 골라요 · 되돌릴 수 없어요' : '훈련소에서'}</span></div><div class="list">${promo}</div>` : ''}
    ${post ? `<div class="list">${post}</div>` : ''}
    <div class="sec"><b>능력치</b><span>${S.bld.training ? `훈련 ${trainedTotal(a)}/${trainCap(a)}번` : '훈련소를 지으면 훈련할 수 있어요'}</span></div>
    <div class="list">${stats}</div>
    <div class="stats boxed">${derived}</div>
    <div class="sec"><b>장비</b>${idle ? '<button type="button" class="btn sm" data-mact="autoeq">가장 좋은 장비 끼우기</button>' : ''}</div>
    <div class="list">${slots}</div>
    <div class="sec"><b>스킬</b><span>${a.skills.length}/${skillSlots(a)}칸${SKILL_SLOT_LV.find(l => a.lv < l) ? ` · Lv${SKILL_SLOT_LV.find(l => a.lv < l)}에 한 칸 더` : ''}</span></div>
    <div class="list">${learned}</div>
    ${ownRows ? `<div class="sec"><b>${CLASSES[a.cls].name} 계열 고유 스킬</b><span>${S.bld.training ? '스킬북 없이 훈련소에서' : '훈련소가 필요해요'}</span></div><div class="list">${ownRows}</div>` : ''}
    ${learnable ? `<div class="sec"><b>배울 수 있는 스킬북</b><span>${S.bld.training ? '훈련소에서 배워요' : '훈련소가 필요해요'}</span></div><div class="list">${learnable}</div>` : ''}
    <details class="card"><summary>${CLASSES[a.cls].name}이(가) 배울 수 있는 스킬 전체</summary><div class="log">${table}</div></details>
    <div class="sub muted">${esc(a.bio)}</div>
    ${idle ? '<div class="btns"><button type="button" class="btn sm red" data-mact="fire">내보내기</button></div>' : ''}`;
}
function openAdv(aid) { if (advById(aid)) openWin('advd', { aid }); }
PANELS.advd = w => { const a = advById(w.aid); return a ? advDetail(a) : '<div class="card"><div class="sub">상단을 떠난 모험가예요.</div></div>'; };
function advAct(aid, b) {
  const k = b.dataset.mact, x = advById(aid);
  if (!x) return;
  let m = '';
  if (k === 'train') m = trainStat(aid, b.dataset.k);
  if (k === 'eq') m = equip(aid, +b.dataset.g);
  if (k === 'uneq') m = unequip(aid, b.dataset.s);
  if (k === 'autoeq') m = autoEquip(aid);
  if (k === 'learn') m = learnSkill(aid, b.dataset.s);
  if (k === 'forget') forgetSkill(aid, b.dataset.s);
  if (k === 'lic') m = licenseUp(aid);
  if (k === 'promo') { const c = b.dataset.c; confirmBox('전직', `${x.name}을(를) ${CLASSES[c].name}(으)로 전직시킬까요? ${fmt(JOB_REQ[jobTier(c)].fee)}G가 들고, 되돌릴 수 없어요.`, '전직', () => { say(promote(aid, c)); renderPanel(true); updateHud(); saveGame(); }, false); return; }
  if (k === 'rune') { openWin('rune', { gid: +b.dataset.g }); return; }
  if (k === 'treat') m = treat(aid, b.dataset.k);
  if (k === 'post') m = postHealer(aid, !x.post);
  if (k === 'fire') { confirmBox('모험가 내보내기', `${x.name}을(를) 내보낼까요? 끼고 있던 장비는 창고로 돌아와요.`, '내보내기', () => { const r = fire(aid); say(r); if (!r) backWin(); renderPanel(true); saveGame(); }, true); return; }
  say(m);
}

/* 원정 */
function partyCard(p) {
  const e = p.exp, on = S.view === p.id;
  const head = `<div class="row"><div class="grow"><div class="h">${esc(p.name)} <small>${p.members.length}명</small></div><div class="sub" data-pst="${p.id}"></div></div>${on ? '<span class="tag gold-t">화면에 표시 중</span>' : `<button type="button" class="btn sm" data-act="view" data-id="${p.id}">화면 보기</button>`}</div>`;
  const DM = { ask: '멈추고 묻기', enter: '바로 들어가기', skip: '지나가기' };
  const toggles = `<button type="button" class="btn sm${p.auto ? ' on' : ''}" data-act="auto" data-id="${p.id}">짐 차면 복귀 ${p.auto ? '켬' : '끔'}</button><button type="button" class="btn sm${p.safe ? ' on' : ''}" data-act="safe" data-id="${p.id}">위험하면 복귀 ${p.safe ? '켬' : '끔'}</button><button type="button" class="btn sm${p.campNight !== false ? ' on' : ''}" data-act="camp" data-id="${p.id}">밤에는 야영 ${p.campNight !== false ? '켬' : '끔'}</button><button type="button" class="btn sm${p.repeat ? ' on' : ''}" data-act="repeat" data-id="${p.id}">돌아오면 다시 출발 ${p.repeat ? '켬' : '끔'}</button><button type="button" class="btn sm on" data-act="dmode" data-id="${p.id}">던전 앞에서: ${DM[p.dmode || 'ask']}</button>`;
  if (e) {
    const team = teamOf(p), F = FIELDS[e.field];
    const gate = e.wait === 'gate';
    return `<div class="card${on || gate ? ' hl' : ''}">${head}
      <div class="sub" data-pwhere="${p.id}"></div>
      <div class="bar big load"><i data-prog="${p.id}"></i></div>
      ${gate ? `<div class="card special"><div class="h">${F.dungeon.name} 입구</div><div class="sub">던전은 한 번만 공략할 수 있어요. 몬스터 Lv${dungeonLv(F, 1)}~${dungeonLv(F, DUNGEON_FLOORS)}, 주인 Lv${dungeonBossLv(F)}. 파티 평균 Lv${Math.round(avgLvOf(p))}.</div><div class="btns"><button type="button" class="btn sm gold" data-act="gate" data-id="${p.id}" data-c="enter">들어가기</button><button type="button" class="btn sm" data-act="gate" data-id="${p.id}" data-c="skip">지나가기</button></div></div>` : ''}
      ${team.map(a => `<div class="row"><span class="sub" style="width:7.5em">${esc(a.name)} <span class="muted">Lv${a.lv}</span></span><div class="grow">${a.down ? `<span class="sub red-t">쓰러짐 · 들것에 실려 가는 중${a.inj ? ' (' + INJ[a.inj.sev].name + ')' : ''}</span>` : `<div class="bar hp"><i data-hp="${a.id}"></i></div><div class="bar mp"><i data-mp="${a.id}"></i></div><div class="bar fat"><i data-fat="${a.id}"></i></div><div class="bar slp"><i data-slp="${a.id}"></i></div>`}</div></div>`).join('')}
      <div class="row sub"><span class="grow">짐 <b data-load="${p.id}"></b> · 처치 <b data-kills="${p.id}"></b>${p.wagon ? ` · ${WAGONS[p.wagon].name}` : ''}</span><span data-sup="${p.id}"></span></div>
      <div class="btns">${e.mode === 'advance' ? `<button type="button" class="btn sm" data-act="recall" data-id="${p.id}">복귀</button>` : ''}${toggles}</div></div>`;
  }
  const pool = S.advs.filter(a => a.status === 'idle' && (!a.post || p.members.includes(a.id)));
  const dest = p.dest && isUnlocked(p.dest) ? p.dest : 'plains', DF = FIELDS[dest];
  const team = teamOf(p), block = team.map(cantGo).filter(Boolean);
  const cps = checkpoints(dest), st = cps.includes(p.start) ? p.start : 1;
  const cap = capOf(p), supW = wOf(p.sup);
  const fast = team.length ? team.slice().sort((x, y) => derive(y).move - derive(x).move)[0] : null;
  const tired = team.filter(a => (a.fat || 0) > FATIGUE.depart);
  const wagonList = WAGON_IDS.map(w => { const W = WAGONS[w], own = p.wagon === w, open = wagonOpen(w), back = p.wagon ? Math.round(WAGONS[p.wagon].cost * 0.5) : 0; return `<div class="li${own ? ' on' : ''}"><div class="grow"><span>${W.name} <span class="muted">짐 +${W.cap} · 이동 ×${W.spd}</span></span><span class="sub muted">${W.desc}${open ? '' : ' 드워프 광산 조합 후원 2단계가 필요해요.'}</span></div>${own ? '<span class="tag gold-t">쓰는 중</span>' : `<button type="button" class="btn sm" data-act="wagon" data-id="${p.id}" data-w="${w}"${open && S.gold + back >= W.cost ? '' : ' disabled'}>${fmt(W.cost - back)}G</button>`}</div>`; }).join('');
  const hurt = team.some(a => a.hp < derive(a).maxHp * 0.7);
  const avg = Math.round(avgLvOf(p));
  const raids = (S.raid ? S.raid.list.filter(r => !r.done) : []).map(r => { const R = RAIDS[r.id], fid = 'raid_' + r.id, ok = avg >= R.lv - RAID_GAP;
    return `<button type="button" class="fbtn raid giant${dest === fid ? ' on' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>레이드 · ${R.name}</span><small>Lv${R.lv} · 남은 HP ${pct(r.hp, r.max)}%${ok ? '' : ` · 평균 Lv${R.lv - RAID_GAP}+`}</small></button>`; }).join('');
  const fields = ALL_FIELDS.filter(f => f !== 'alley' || isUnlocked('alley')).map(fid => {
    const F = FIELDS[fid], ok = isUnlocked(fid), fs = S.fields[fid];
    const nb = [1, 2, 3, 4, 5].filter(k => fs.boss && fs.boss[k]).length;
    const sub = F.raid ? '암살자 길드 토벌 · Lv28+ 권장' : ok ? `Lv${F.lv}~${F.lv + 12} · 최고 ${F.no}-${fs.best || 0} · ${fs.cleared ? '던전★' : fs.found ? '던전 열림' : `보스 ${nb}/5`}` : `상단 ${RANKS[F.no - 1].name}랭크에 열림`;
    return `<button type="button" class="fbtn${dest === fid ? ' on' : ''}${F.raid ? ' raid' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>${F.name}</span><small>${sub}</small></button>`;
  }).join('');
  const last = p.last ? `<div class="sub muted">지난 원정: ${FIELDS[p.last.field].name}, 처치 ${p.last.kills}마리, 부속품 ${Object.values(p.last.got).reduce((s, q) => s + q, 0)}개${p.last.gear ? `, 장비 ${p.last.gear}개` : ''}</div>` : '';
  return `<div class="card${on ? ' hl' : ''}">${head}
    <div class="sec" style="margin-top:2px"><b>파티원</b><span>눌러서 넣고 빼기</span></div>
    <div class="list">${pool.map(a => { const o = partyOf(a.id), inP = p.members.includes(a.id), d = derive(a), why = a.inj ? INJ[a.inj.sev].name : (a.sleep || 0) >= SLEEP.block ? '자는 중' : ''; return `<button type="button" class="pick${inP ? ' on' : ''}" data-act="member" data-id="${p.id}" data-a="${a.id}"><i class="chk"></i>${mini(a)}<span class="grow">${esc(a.name)} <span class="muted">${CLASSES[a.cls].name} Lv${a.lv}${o && o !== p ? ' · ' + esc(o.name) : ''}</span>${why ? ` <span class="red-t">${why}</span>` : ''}</span><span class="sub num">HP ${pct(a.hp, d.maxHp)}%</span></button>`; }).join('') || '<div class="sub">대기 중인 모험가가 없어요.</div>'}</div>
    <div class="sec"><b>보급품</b><span>가져간 물약만 쓸 수 있어요</span></div>
    ${POTIONS.filter(k => (S.inv[k] || 0) > 0 || (p.sup[k] || 0) > 0 || k === 'pot_s').map(k => `<div class="row">${iconImg(k)}<span class="grow sub">${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="step"><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="-1">−</button><span>${p.sup[k] || 0}</span><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="1">+</button></span></div>`).join('')}
    <div class="sec"><b>목적지</b><span>파티 평균 Lv${avg}</span></div>
    <div class="fields">${fields}${raids}</div>
    ${DF.raid || DF.giant ? '' : `<div class="sec"><b>출발 거점</b><span>필드 보스를 쓰러뜨린 구간 다음부터</span></div><div class="btns">${[1, 11, 21, 31, 41].map(x => `<button type="button" class="btn sm${x === st ? ' on' : ''}" data-act="start" data-id="${p.id}" data-s="${x}"${cps.includes(x) ? '' : ' disabled'}>${DF.no}-${x} <span class="muted">Lv${fieldLv(DF, x)}</span></button>`).join('')}</div>`}
    <div class="sub">짐 한도 ${cap} · 물약이 ${supW} 차지${fast ? ` · 이동속도 ${(moveOf(p)).toFixed(1)} (가장 민첩한 ${esc(fast.name)} 기준${p.wagon ? ', 마차 포함' : ''})` : ''}</div>
    <details class="card"><summary>마차 · ${p.wagon ? `${WAGONS[p.wagon].name} (짐 +${WAGONS[p.wagon].cap})` : '없음'} · 바꾸면 쓰던 마차는 반값에 넘겨요</summary><div class="list">${wagonList}</div></details>
    ${hurt ? '<div class="sub red-t">다친 모험가가 있어요. 상단에 두면 체력이 서서히 차요.</div>' : ''}
    ${tired.length ? `<div class="sub warn">${tired.map(a => esc(a.name)).join(', ')}이(가) 지쳐 있어요. 상단에서 쉬면 피로가 풀려요.</div>` : ''}
    ${block.length ? `<div class="sub red-t">${block.map(esc).join('<br>')}</div>` : ''}
    ${last}
    <div class="btns">${toggles}</div>
    <div class="btns"><button type="button" class="btn gold grow" data-act="go" data-id="${p.id}"${team.length && !block.length ? '' : ' disabled'}>${DF.giant ? `${DF.name} 레이드 도전` : `${DF.name}${DF.raid ? '' : ` ${DF.no}-${st}`}(으)로 출발`}</button><button type="button" class="btn" data-act="delparty" data-id="${p.id}">파티 삭제</button></div>
  </div>`;
}
function raidCard(r, full) {
  const R = RAIDS[r.id], st = raidStand(r), my = st.findIndex(x => x.me), dd = S.settleDay - today();
  const state = r.done === 1 ? '<span class="ok-t">쓰러짐</span>' : r.done === 2 ? '<span class="muted">떠남</span>' : `D-${dd} · 남은 HP ${pct(r.hp, r.max)}%`;
  const rows = (r.final || st.map(x => ({ n: x.n, d: Math.round(x.d), me: x.me }))).slice(0, full ? 8 : 3).map((x, i) => `<div class="row sub${x.me ? ' gold-t' : ''}"><span class="rkn">${i + 1}</span><span class="grow">${esc(x.n)}</span><span class="num">${fmt(x.d)}</span></div>`).join('');
  const mine = r.me > 0 ? `우리 상단 ${my + 1}위 · ${fmt(r.me)}` : '아직 도전하지 않았어요';
  return `<div class="card raidc" style="--rc:${R.c}"><div class="row"><span class="rbadge">Lv${R.lv}</span><div class="grow"><div class="h">${R.name}</div><div class="sub">${state} · ${mine}</div></div>${full ? '' : `<button type="button" class="btn sm" data-act="raidopen" data-id="${r.id}">순위</button>`}</div>
    <div class="bar big raid"><i style="width:${pct(r.hp, r.max)}%"></i></div>${rows}
    ${full ? `<div class="sub muted">${R.desc}</div>` : ''}</div>`;
}
PANELS.raid = w => {
  const r = raidRec(w.r);
  if (!r) return '<div class="card"><div class="sub">이번 달 레이드가 아니에요.</div></div>';
  const R = RAIDS[r.id];
  const rew = RAID_REWARD.map((W, i) => `<div class="row sub"><span class="rkn">${i < 3 ? i + 1 + '위' : '참가'}</span><span class="grow">${fmt(Math.round(raidGold(R.lv) * W.gold))}G · 명성 ${W.fame} · 부속품 ${W.part}${W.heart ? ' · ' + ITEMS['rh_' + r.id].name : ''}${W.gear ? ` · ${QUALITY[W.gear].name} 장비` : ''}${W.rune >= 0 ? ` · ${RUNE_LV[W.rune]} 룬` : ''}</span></div>`).join('');
  return `${raidCard(r, true)}
    <div class="sec"><b>순위 보상</b><span>달이 바뀌기 전에 쓰러뜨려야 보상을 다 받아요</span></div><div class="card">${rew}</div>
    <div class="sub">원정 창에서 파티 목적지를 이 레이드로 고르세요. 파티 평균 Lv${R.lv - RAID_GAP} 이상이면 도전할 수 있고, 한 번에 ${RAID_FIGHT}초 동안 싸우고 물러나요. 다른 상단과 왕국 원정대는 날마다 몬스터를 두드려요.</div>`;
};
PANELS.rune = w => {
  const f = findGear(w.gid);
  if (!f) return '<div class="card"><div class="sub">장비를 찾을 수 없어요.</div></div>';
  const g = f.g, n = runeSlots(g), idle = !f.a || f.a.status === 'idle';
  const cur = (g.runes || []).map((rid, i) => `<div class="li">${iconImg(rid)}<div class="grow"><span>${ITEMS[rid].name}</span><span class="sub">${statLine({ [RUNES[ITEMS[rid].rune[0]].st]: RUNES[ITEMS[rid].rune[0]].v[ITEMS[rid].rune[1]] })}</span></div><button type="button" class="btn sm" data-act="runeout" data-g="${g.id}" data-i="${i}"${idle && S.gold >= RUNE_OUT[ITEMS[rid].rune[1]] ? '' : ' disabled'}>빼기 ${fmt(RUNE_OUT[ITEMS[rid].rune[1]])}G</button></div>`).join('');
  const inv = Object.keys(S.inv).filter(k => ITEMS[k] && ITEMS[k].rune && S.inv[k] > 0).sort((x, y) => ITEMS[y].v - ITEMS[x].v);
  const add = inv.map(k => `<div class="li">${iconImg(k)}<div class="grow"><span>${ITEMS[k].name} <b class="num">×${S.inv[k]}</b></span><span class="sub">${statLine({ [RUNES[ITEMS[k].rune[0]].st]: RUNES[ITEMS[k].rune[0]].v[ITEMS[k].rune[1]] })}</span></div><button type="button" class="btn sm gold" data-act="runein" data-g="${g.id}" data-it="${k}"${idle && (g.runes || []).length < n ? '' : ' disabled'}>끼우기</button></div>`).join('');
  return `<div class="card hl"><div class="row">${gImg(g, 'ico lg q-b q' + g.q)}<div class="grow"><div class="h">${gearName(g)} ${qTag(g)}</div><div class="sub">${statLine(gearStats(g))}</div><div class="sub">${f.a ? `${esc(f.a.name)}이(가) 쓰는 중` : '창고에 보관 중'} · 룬 ${(g.runes || []).length}/${n}${runeDots(g)}</div></div></div></div>
    ${n ? '' : '<div class="sub red-t">일반 장비에는 룬 칸이 없어요. 고급부터 등급마다 한 칸씩 열려요.</div>'}
    <div class="sec"><b>끼운 룬</b><span>빼면 창고로 돌아와요</span></div><div class="list">${cur || '<div class="li"><span class="sub">끼운 룬이 없어요.</span></div>'}</div>
    <div class="sec"><b>창고의 룬</b><span>마탑에서 새기고 합쳐요</span></div><div class="list">${add || '<div class="li"><span class="sub">룬이 없어요. 필드 보스와 던전, 레이드에서 얻거나 마탑에서 새겨요.</span></div>'}</div>`;
};
PANELS.exp = () => `
  ${S.raid ? `<div class="sec"><b>이번 달 레이드</b><span>D-${S.settleDay - today()}</span></div>${S.raid.list.map(r => raidCard(r, false)).join('')}` : ''}
  <div class="sec"><b>원정대</b><span>${S.parties.length}/${partyMax()}개</span></div>
  ${S.parties.map(partyCard).join('')}
  ${S.parties.length < partyMax() ? '<button type="button" class="btn block" data-act="newparty">+ 새 파티 만들기</button>' : `<div class="sub muted">상단 랭크가 오르면 파티를 더 만들 수 있어요.</div>`}`;

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
  const gear = S.gear.slice().sort((x, y) => gearScore(y) - gearScore(x)).map(g => `<div class="li">${gImg(g, 'ico q-b q' + g.q)}<div class="grow"><span>${gearName(g)} ${qTag(g)}${runeDots(g)}</span><span class="sub">${statLine(gearStats(g))}</span><span class="sub muted">${clsList(GTYPES[g.base].cls)} · Lv${GTIERS[g.t].lv}+ · 무게 ${GTYPES[g.base].w}</span></div><div class="btns">${runeSlots(g) ? `<button type="button" class="btn sm" data-act="runewin" data-g="${g.id}">룬</button>` : ''}<button type="button" class="btn sm" data-act="sellgear" data-id="${g.id}">${fmt(Math.round(gearValue(g) * GEAR_SELL))}G</button></div></div>`).join('');
  const books = Object.keys(S.inv).filter(k => ITEMS[k].book && S.inv[k] > 0).map(k => { const s = SKILLS[ITEMS[k].book]; return `<div class="li">${iconImg(k)}<div class="grow"><span>${s.name} <b class="num">×${S.inv[k]}</b></span><span class="sub muted">${clsList(s.cls)} · Lv${s.lv}+ · ${costStr(s)}</span></div><button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="1">${fmt(Math.round(ITEMS[k].v * rate))}G</button></div>`; }).join('');
  return `
  <div class="sec"><b>상점 진열대</b><span>오늘 ${sold.n}개 · ${fmt(sold.g)}G 판매</span></div>
  <div class="sub">진열한 부속품과 장비는 손님이 조금씩 사 가요. 비싸게 걸수록 천천히 팔려요.</div>
  ${slots}
  <div class="sec"><b>부속품</b><span>${parts.length}종 · 기준가 ${fmt(total)}G어치</span></div>
  <div class="sub">버튼을 누르면 모험가 길드가 기준가의 ${Math.round(rate * 100)}%에 바로 사 가요.</div>
  <div class="list">${rows || '<div class="li"><span class="sub">창고가 비어 있어요. 원정을 보내 부속품을 모아 오세요.</span></div>'}</div>
  <div class="sec"><b>장비 보관함</b><span>${S.gear.length}개 · 모험가 창에서 끼워요</span></div>
  <div class="list">${gear || '<div class="li"><span class="sub">보관 중인 장비가 없어요. 대장간에서 만들거나 원정에서 주워 와요.</span></div>'}</div>
  ${books ? `<div class="sec"><b>스킬북</b><span>모험가 창에서 배워요</span></div><div class="list">${books}</div>` : ''}
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
  const top = winTop();
  if (!top) return;
  if (UI.hold && !force) return;
  const html = (PANELS[top.id] || (() => ''))(top), key = top.id + ':' + (top.b || '') + ':' + (top.aid || '') + ':' + UI.stack.length;
  if (force || html !== UI.html) {
    // 같은 창을 다시 그릴 때는 펼쳐 둔 목록을 그대로 둔다
    const box = $('panel-in'), open = key === UI.winKey ? [...box.querySelectorAll('details')].map(d => d.open) : [];
    box.innerHTML = html; UI.html = html; UI.winKey = key;
    box.querySelectorAll('details').forEach((d, i) => { if (open[i]) d.open = true; });
    if (top.id === 'advd') $('win-title').textContent = winTitle(top);
  }
  live();
}
function live() { liveIn($('panel-in')); if (UI.modal) liveIn($('m-body')); }
function liveIn(box) {
  if (!box) return;
  const D = {};
  const dOf = a => D[a.id] || (D[a.id] = derive(a));
  box.querySelectorAll('[data-hp]').forEach(el => { const a = advById(+el.dataset.hp); if (!a) return; const mx = dOf(a).maxHp; el.style.width = pct(a.hp, mx) + '%'; el.classList.toggle('low', a.hp < mx * 0.35); });
  box.querySelectorAll('[data-mp]').forEach(el => { const a = advById(+el.dataset.mp); if (a) el.style.width = pct(a.mp, dOf(a).maxMp) + '%'; });
  box.querySelectorAll('[data-pst]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.pst); if (p) el.textContent = expStatus(p); });
  box.querySelectorAll('[data-pwhere]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.pwhere); if (p && p.exp) el.textContent = whereStr(p.exp); });
  box.querySelectorAll('[data-prog]').forEach(el => { const p = S.parties.find(x => x.id === +el.dataset.prog); if (p && p.exp) { const e = p.exp, k = e.stage - 1 + e.pos / STAGE_LEN; el.style.width = (e.area === 'dungeon' ? pct(k, DUNGEON_FLOORS) : pct(k, FIELD_STAGES)) + '%'; } });
  box.querySelectorAll('[data-fat]').forEach(el => { const a = advById(+el.dataset.fat); if (a) { el.style.width = Math.round(a.fat || 0) + '%'; el.classList.toggle('low', (a.fat || 0) >= 85); } });
  box.querySelectorAll('[data-fatn]').forEach(el => { const a = advById(+el.dataset.fatn); if (a) el.textContent = Math.round(a.fat || 0); });
  box.querySelectorAll('[data-slp]').forEach(el => { const a = advById(+el.dataset.slp); if (a) { el.style.width = Math.round(a.sleep || 0) + '%'; el.classList.toggle('low', (a.sleep || 0) >= SLEEP.block); } });
  box.querySelectorAll('[data-slpn]').forEach(el => { const a = advById(+el.dataset.slpn); if (a) el.textContent = Math.round(a.sleep || 0); });
  box.querySelectorAll('[data-inj]').forEach(el => { const a = advById(+el.dataset.inj); if (a && a.inj) el.style.width = pct(a.inj.done, a.inj.need) + '%'; });
  box.querySelectorAll('[data-injn]').forEach(el => { const a = advById(+el.dataset.injn); if (a && a.inj) el.textContent = Math.floor(a.inj.done); });
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
  smith: d => { const r = smith(d.b, +d.t, +d.q || 0); if (typeof r === 'string') say(r); else say(`${QUALITY[r.q].name} ${gearName(r)} 완성`); },
  smithQ: d => { UI.smithQ = +d.q; },
  kingsell: d => say(kingSell(d.it)),
  raidopen: d => openWin('raid', { r: d.id }),
  runewin: d => openWin('rune', { gid: +d.g }),
  runein: d => say(runeIn(+d.g, d.it)),
  runeout: d => say(runeOut(+d.g, +d.i)),
  fuse: d => say(runeFuse(d.it)),
  carve: d => { const r = runeCarve(+d.t); say(r && ITEMS[r] ? `${ITEMS[r].name}을(를) 새겼어요` : r); },
  craft: d => say(craft(+d.i) || '물약을 만들었어요'),
  bankok: d => say(bankAccept(+d.id)),
  research: d => say(startResearch(d.id)),
  hire: d => say(hire(+d.id) || '고용했어요'),
  advopen: d => openAdv(+d.id),
  view: d => { S.view = +d.id; renderChips(); },
  sub: d => openWin(d.id),
  bopen: d => { openWin('b', { b: d.id }); if (BLD_FLOOR[d.id]) hqGo(BLD_FLOOR[d.id], true); },
  member: d => toggleMember(+d.id, +d.a),
  sup: d => setSup(+d.id, d.it, +d.d),
  dest: d => { const p = findP(d.id); if (p) p.dest = d.f; },
  go: d => { const p = findP(d.id); if (!p) return; const m = startExp(p, p.dest && isUnlocked(p.dest) ? p.dest : 'plains'); if (m) say(m); else { S.view = p.id; renderChips(); say(`${p.name} 출발!`); } },
  recall: d => { const p = findP(d.id); if (p) recall(p, 'order'); },
  gate: d => { const p = findP(d.id); if (p) { gateChoice(p, d.c); S.view = p.id; } },
  wagon: d => say(buyWagon(+d.id, d.w)),
  camp: d => { const p = findP(d.id); if (p) p.campNight = p.campNight === false; },
  dmode: d => { const p = findP(d.id); if (p) p.dmode = { ask: 'enter', enter: 'skip', skip: 'ask' }[p.dmode || 'ask']; },
  rankup: () => say(rankUp()),
  treat: d => say(treat(+d.id, d.k)),
  post: d => say(postHealer(+d.id, d.on === '1')),
  autotreat: () => { S.autoTreat = !S.autoTreat; },
  start: d => { const p = findP(d.id); if (p) p.start = +d.s; },
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
  export: () => openExport(),
  import: () => openImport(),
  update: () => checkUpdate(true),
  reset: () => confirmBox('처음부터 다시', '저장된 진행 상황이 모두 지워져요. 되돌릴 수 없어요.', '모두 지우기', () => { closeWins(); resetGame(); showTitle(); }, true)
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
    const b = e.target.closest('[data-act],[data-mact]');
    if (!b || b.disabled || !S) return;
    if (b.dataset.mact) { const top = winTop(); if (top && top.id === 'advd') advAct(top.aid, b); }
    else ACT[b.dataset.act](b.dataset);
    renderPanel(true); renderChips(); updateHud(); renderFloors(); saveGame();
  });
  $('menu').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b && S) menuOpen(b.dataset.open); });
  $('win-back').addEventListener('click', backWin);
  $('win-x').addEventListener('click', closeWins);
  $('floors').addEventListener('click', e => { const b = e.target.closest('[data-floor]'); if (b) { hqGo(b.dataset.floor); renderFloors(); } });
  $('pip').addEventListener('click', () => setPip(!UI.pipBig));
  // 본부 화면: 누르면 그 자리의 것, 위아래로 밀면 층 이동
  const hq = $('hq');
  let p0 = null;
  hq.addEventListener('pointerdown', e => { p0 = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  hq.addEventListener('pointerup', e => {
    if (!p0 || !S) return;
    const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
    p0 = null;
    if (Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(dx) * 1.2) { hqStep(dy < 0 ? -1 : 1); renderFloors(); return; }
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) hqOpen(hqHit(e.clientX, e.clientY));
  });
  hq.addEventListener('pointercancel', () => { p0 = null; });
  const panel = $('panel');
  panel.addEventListener('pointerdown', () => { UI.hold = true; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => panel.addEventListener(t, () => setTimeout(() => { UI.hold = false; }, 180)));
  $('pchips').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (!b) return; S.view = +b.dataset.view; renderChips(); const top = winTop(); if (top && top.id === 'exp') renderPanel(true); });
  const mb = $('m-box');
  mb.addEventListener('pointerdown', () => { UI.mhold = true; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => mb.addEventListener(t, () => setTimeout(() => { UI.mhold = false; }, 180)));
  $('modal').addEventListener('click', e => { if (e.target === $('modal') && $('m-btns').children.length === 1) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (UI.modal) { if ($('m-btns').children.length === 1) closeModal(); } else if (winTop()) backWin(); });
  $('speed').addEventListener('click', () => { if (!S) return; const i = SPEEDS.indexOf(S.speed); setSpeed(SPEEDS[(i + 1) % SPEEDS.length]); });
  $('t-import').addEventListener('click', () => openImport(() => { $('title-scr').hidden = true; cancelAnimationFrame(titleRaf); startGame(); }));
  $('t-form').addEventListener('submit', e => {
    e.preventDefault();
    newGame($('t-name').value);
    $('title-scr').hidden = true;
    cancelAnimationFrame(titleRaf);
    saveGame();
    startGame();
  });
}
