/* ───────── 창 화면 ───────── */
const PANELS = {};
const qTag = g => `<span class="q q${g.q}">${QUALITY[g.q].name}</span>`;
const gImg = (g, cls = 'ico') => `<img class="${cls}${g.plus >= 10 ? ' p10' : g.plus >= 7 ? ' p7' : g.plus >= 4 ? ' p4' : ''}" src="${gearIconURL(g)}" alt="">`;
function statLine(st) {
  return Object.entries(st).map(([k, v]) => `${STAT_NAMES[k] || k} ${PCT_STATS.includes(k) || k === 'spdPct' || k === 'cdr' ? (k === 'cdr' ? '-' : '+') + (Math.round(v * 1000) / 10) + '%' : (v > 0 ? '+' : '') + v}`).join(' · ');
}
const clsList = cls => (cls.includes('all') ? '모든 직업' : cls.map(c => CLASSES[c].name + (jobTier(c) === 1 ? ' 계열' : '')).join('·'));
// 직업 특성을 글로
const TR_TXT = {
  critMul: v => `치명타 피해 ×${v}`, guard: v => (v < 0 ? `받는 피해 +${Math.round(-v * 100)}%` : `받는 피해 -${Math.round(v * 100)}%`), tank: v => (v < 0 ? '적이 덜 노린다' : v >= 2 ? '적이 아주 자주 노린다' : '적이 자주 노린다'),
  lifesteal: v => `준 피해의 ${Math.round(v * 100)}% 흡혈`, rage: v => `체력이 줄수록 공격력 최대 +${Math.round(v * 100)}%`, pet: () => '동물 동료가 함께 공격',
  pen: v => `방어 ${Math.round(v * 100)}% 무시`, first: v => `싸움 첫 공격 ×${v}`, double: v => `${Math.round(v * 100)}% 확률로 두 번 공격`,
  luck: v => `전리품·금화 +${Math.round(v * 100)}%`, aoe: v => `마법이 다른 적에게 ${Math.round(v * 100)}% 번짐`, mdrain: v => `마법 피해의 ${Math.round(v * 100)}% 흡수`,
  hybrid: v => `기본 공격에 마법 피해 ${Math.round(v * 100)}%`, healPow: v => `치유량 ×${v}`, dot: v => `지속 피해 ×${v}`, bossDmg: v => `보스 피해 ×${v}`, aura: v => `파티 공격력 +${Math.round(v * 100)}%`,
  combo: v => `연계: 기본 공격을 맞힐 때마다 피해 +${Math.round(v * 100)}% (${COMBO_MAX}중첩, 빗나가거나 기절하면 끊김)`, exec: v => `처형: HP ${Math.round(EXEC_HP * 100)}% 아래 적에게 ×${v}`, cover: v => `엄호: 동료가 노려지면 ${Math.round(v * 100)}%로 대신 맞음`,
  pdrain: v => `성스러운 흡수: 마법 피해의 ${Math.round(v * 100)}%만큼 가장 다친 동료 회복`, wagon: v => `마차 짐 +${Math.round(v * 100)}%`, wagonSpd: v => `마차 속도 +${Math.round(v * 100)}%`, scout: v => `파티 이동 속도 +${Math.round(v * 100)}%`, tent: v => `야영은 텐트 (피로 회복 ×${v})`, drop: v => `전리품 +${Math.round(v * 100)}%`
};
Object.assign(TR_TXT, {
  vs: v => Object.entries(v).map(([t, x]) => `${MTYPES[t] ? MTYPES[t].name : t}에게 주는 피해 +${Math.round(x * 100)}%`).join(' · '),
  elw: v => `약점 속성 피해 +${Math.round(v * 100)}%`, immPierce: v => `면역인 적에게도 피해 ${Math.round(v * 100)}%`
});
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
    b('herb', `히포크리초 ${HERB_USE}개 +${HERB_PTS}`, !done && (S.inv.herb || 0) >= HERB_USE),
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
    <div class="row"><span class="rk">${RANKS[S.rank || 0].name}</span><div class="grow"><div class="h">${esc(S.company)}${S.league && S.league.last && S.league.last.rank === 1 ? ' <small class="gold-t">이달의 상단</small>' : ''}</div><div class="sub">${RANKS[S.rank || 0].title} · ${WORLD.capital} ${WORLD.street} 입구 · 제국력 ${p.y}년</div></div></div>
    <div class="stats"><span>모험가 <b>${living().length}/${beds()}</b></span><span>파티 <b>${regularParties().length}/${partyMax()}${raidParty() ? ' + 레이드대' : ''}</b></span><span>처치 <b>${fmt(S.stats.kills)}</b></span><span>부상 <b class="${patients().length ? 'red-t' : ''}">${patients().length}</b></span><span>던전 <b>${TIER_FIELDS.filter(f => S.fields[f].cleared).length}/${TIER_FIELDS.length}</b></span></div>
  </div>
  <div class="submenu">
    ${subBtn('co_rank', '상단 랭크', q ? `다음 ${RANKS[(S.rank || 0) + 1].name}랭크 조건 ${done}/${q.length}` : '가장 높은 랭크', rankReady())}
    ${subBtn('co_money', '월말 정산', `D-${dd} · <span class="${S.gold >= cost ? '' : 'red-t'}">${fmt(cost)}G</span>`, dd <= 3)}
    ${subBtn('co_spon', '후원', `${Object.values(S.spons).reduce((s2, v) => s2 + v, 0)}/${Object.keys(SPONSORS).length * 3}단계`)}
    ${subBtn('co_king', '왕국 교역', S.king && S.king.visit ? `<span class="gold-t">${KINGDOMS[S.king.visit.k].name} 방문 중 · D-${S.king.visit.until - today()}</span>` : '이웃 왕국 상단이 물건을 사러 와요', !!(S.king && S.king.visit))}
    ${subBtn('co_wx', '날씨', (() => { const w = wxNow(null); return `${SEASONS[w.se].name} · ${wxLabel(w)} · 예보와 원정지 날씨`; })())}
    ${subBtn('co_league', '상단 랭킹', (() => { const st = leagueStand(), my = st.findIndex(x => x.me); return `이달 ${my + 1}위 · ${fmt(leagueScore())}점 · 1위 ${esc(st[0].n)}`; })(), leagueStand()[0].me)}
    ${subBtn('dex', '도감', dexSub())}
    ${subBtn('achv', '업적', `${achvDone()}/${ACHV.length} 달성 · 돈·명성·마법사의 돌`)}
    ${subBtn('hall', '명예의 전당', `동상 ${(S.hall || []).length}/${HALL_MAX} · Lv${MAX_LV} 모험가 은퇴${S.advs.some(a => a.lv >= MAX_LV) ? ' · <span class="gold-t">은퇴할 수 있는 모험가가 있어요</span>' : ''}`, S.advs.some(a => a.lv >= MAX_LV))}
    ${subBtn('co_relic', '유물', `${(S.relics || []).length}/${TIER_FIELDS.length}개 · 던전 공략 보상`)}
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
    const rows = v.order.map(o => { const have = S.inv[o.it] || 0, left = o.n - o.got, one = Math.round(ITEMS[o.it].v * v.m * festSellMul(v.k)); return `<div class="li">${iconImg(o.it)}<div class="grow"><span>${ITEMS[o.it].name} <b class="num">${o.got}/${o.n}</b></span><span class="sub">하나에 ${fmt(one)}G (기준가 ${ITEMS[o.it].v}G) · 창고 ${have}</span></div><button type="button" class="btn sm gold" data-act="kingsell" data-it="${o.it}"${left > 0 && have > 0 ? '' : ' disabled'}>${left <= 0 ? '다 채움' : have ? `${Math.min(left, have)}개 팔기` : '창고에 없음'}</button></div>`; }).join('');
    return `<div class="card hl" style="--kc:${D.c}"><div class="row"><span class="kbadge" style="background:${D.c};color:${D.c2}">${D.race}</span><div class="grow"><div class="h">${D.name} 상단</div><div class="sub">${D.desc}</div></div></div>
      <div class="sub gold-t">${festOf(v.k) ? '🎉 축제 중: 사 가는 값 두 배, 파는 물건 30% 할인 · ' : ''}${dayLabel(v.until)}까지 머물러요 (D-${v.until - today()}) · 기준가의 ${Math.round(v.m * 100 * festSellMul(v.k))}% · 지금까지 ${fmt(v.earned)}G${v.full ? ' · <span class="ok-t">주문 완료</span>' : ''}</div>
      <div class="list">${rows}</div>
      ${v.goods && v.goods.length ? `<div class="sec"><b>가져온 물건</b><span>여기서만 파는 스킬북도 있어요</span></div><div class="list">${v.goods.map((o, i) => `<div class="li">${iconImg(o.it)}<div class="grow"><span>${ITEMS[o.it].name} <span class="muted">· 남은 ${o.n}</span></span><span class="sub">${ITEMS[o.it].book ? `${SKILLS[ITEMS[o.it].book].desc} · Lv${SKILLS[ITEMS[o.it].book].lv} ${clsList(SKILLS[ITEMS[o.it].book].cls)}<br>${skillSpecLine(ITEMS[o.it].book)}` : `창고 ${S.inv[o.it] || 0}`}</span></div><button type="button" class="btn sm gold" data-act="kingbuy" data-i="${i}"${o.n > 0 && S.gold >= o.price ? '' : ' disabled'}>${o.n > 0 ? fmt(o.price) + 'G' : '다 팔림'}</button></div>`).join('')}</div>` : ''}</div>`;
  })() : `<div class="card"><div class="sub">지금은 찾아온 왕국 상단이 없어요. ${S.king ? `${dayLabel(S.king.next)}쯤 다음 상단이 올 거예요.` : ''}</div></div>`;
  const list = KINGDOM_IDS.map(k => { const D = KINGDOMS[k], open = kingOpen(k), f = favorOf(k), t = favorTier(f), nx = FAVOR[t + 1];
    return `<div class="card${open ? '' : ' dim'}"><div class="row"><span class="kbadge" style="background:${D.c};color:${D.c2}">${D.race}</span><div class="grow"><div class="h">${D.name} <small>${FAVOR[t].name}</small></div><div class="sub">${open ? `호감 ${Math.floor(f)}${nx ? `/${nx.at}` : ''} · 값 ${Math.round(FAVOR[t].m * 100)}%` : `${FIELDS[D.need].name}에 가 보면 교역을 시작해요`}</div></div></div>
    ${open ? `<div class="sub muted">찾는 물건: ${D.wants.map(i => ITEMS[i].name).join(', ')}</div>` : ''}</div>`; }).join('');
  return `${visit}<div class="sec"><b>이웃 왕국</b><span>주문을 채울수록 값을 더 쳐줘요</span></div>${list}`;
};
PANELS.co_relic = () => {
  const own = S.relics || [];
  return `<div class="sub">던전을 공략하면 그 주인이 지키던 유물을 하나씩 얻어요. 유물은 상단 전체에 힘을 줘요.</div>` + TIER_FIELDS.map(f => { const R = RELICS[f], on = own.includes(f);
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
  ${ledgerBox()}
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
  return `${raid}<div class="card dim"><div class="h">마왕의 봉인 <small>${TIER_FIELDS.filter(f => S.fields[f].cleared).length}/${TIER_FIELDS.length}</small></div><div class="sub">필드마다 10 스테이지마다 필드 보스가 있고, 1-50의 주인을 쓰러뜨리면 던전 입구가 열린다. 던전은 한 번만 공략할 수 있고, 공략하면 큰 보상과 함께 상단 랭크업 조건 하나가 채워진다.</div></div>`;
};
PANELS.co_log = () => `<div class="card"><div class="log">${S.log.slice(0, 40).map(l => `<div class="${l.kind}"><span class="d">${l.d}</span>${esc(l.text)}</div>`).join('') || '<div>아직 소식이 없어요.</div>'}</div></div>`;
PANELS.co_set = () => `<div class="card"><div class="sub">진행 상황은 이 기기에 자동 저장돼요. 앱을 닫아도 최대 ${Math.round(offlineCap() / 3600)}시간까지 원정과 판매가 계속되고, 날짜와 시각은 그대로예요.</div>
    <div class="sec"><b>저장 코드</b><span>다른 기기로 옮기기</span></div>
    <div class="sub">저장 코드를 복사·공유·파일로 두면 다른 기기나 새로 설치한 앱으로 진행 상황을 옮길 수 있어요. 코드는 압축되어 짧고, 붙여 넣을 때 앞뒤 공백이나 줄바꿈은 알아서 지워요.</div>
    <div class="btns"><button type="button" class="btn sm gold" data-act="export">저장 코드 만들기</button><button type="button" class="btn sm" data-act="import">저장 코드로 불러오기</button>${isApp() ? '<button type="button" class="btn sm" data-act="update">업데이트 확인</button>' : ''}</div>
    <div class="sec"><b>백업 슬롯</b><span>이 기기에 ${SLOT_N}개</span></div>
    <div class="sub">지금 진행 상황을 슬롯에 넣어 두고, 잘못됐을 때 되돌릴 수 있어요. 자동 저장과는 따로예요.</div>
    <div class="list">${slotRows()}</div>
    <div class="sec"><b>소리</b><span>효과음과 배경음</span></div>
    <div class="btns"><button type="button" class="btn sm${AU.sfx ? ' on' : ''}" data-act="ausfx">효과음 ${AU.sfx ? '켬' : '끔'}</button><button type="button" class="btn sm${AU.bgm ? ' on' : ''}" data-act="aubgm">배경음 ${AU.bgm ? '켬' : '끔'}</button><span class="step"><button type="button" class="btn sm" data-act="auvol" data-d="-0.1">−</button><span>음량 ${Math.round(AU.vol * 100)}%</span><button type="button" class="btn sm" data-act="auvol" data-d="0.1">+</button></span></div>
    <div class="sub muted">배경음은 상단 앞·필드·던전·보스·투기장·마계마다 달라요. 소리는 화면을 한 번 누른 뒤부터 나요.</div>
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
  const tabs = `<div class="tabs"><button type="button" class="tab${UI.smithTab !== 'enh' ? ' on' : ''}" data-act="smithTab" data-t="make">제작</button><button type="button" class="tab${UI.smithTab === 'enh' ? ' on' : ''}" data-act="smithTab" data-t="enh">강화</button></div>`;
  if (UI.smithTab === 'enh') return tabs + enhanceBox();
  return `${tabs}<div class="btns">${chips}</div><div class="btns">${qchips}</div>${note}<div class="list">${rows}</div>`;
}
// 강화: 창고와 끼고 있는 장비 중 하나를 골라 +1씩
function enhanceBox() {
  const all = gearsAll().sort((x, y) => gearScore(y.g) - gearScore(x.g));
  if (!all.length) return '<div class="card"><div class="sub muted">강화할 장비가 없어요.</div></div>';
  const sel = all.find(x => x.g.id === UI.enhG) || all[0]; UI.enhG = sel.g.id;
  const g = sel.g, why = plusWhy(g), next = Object.assign({}, g, { plus: Math.min(PLUS_MAX, (g.plus || 0) + 1) }), now = gearStats(g), nx = gearStats(next);
  const diff = Object.keys(nx).map(k => { const a = now[k] || 0, b = nx[k] || 0; if (a === b) return ''; return `${STAT_NAMES[k] || k} ${PCT_STATS.includes(k) ? (a * 100).toFixed(1) + '%→' + (b * 100).toFixed(1) + '%' : a + '→' + b}`; }).filter(Boolean).join(' · ');
  const cells = all.map(x => `<button type="button" class="cell${x.g.id === g.id ? ' on' : ''}" data-act="enhsel" data-id="${x.g.id}">${gImg(x.g, 'ico lg q-b q' + x.g.q)}${x.g.plus ? `<b class="qty">+${x.g.plus}</b>` : ''}${x.owner ? '<i class="own"></i>' : ''}</button>`).join('');
  const fill = (6 - (all.length % 6)) % 6; const pad = Array.from({ length: fill }, () => '<span class="cell empty"></span>').join('');
  const need = plusNeed(g);
  return `<div class="sub muted">+1씩 올라가요. 능력치 +6%/단계, +4·+7·+10에서 테두리가 빛나요. 실패해도 단계는 내려가지 않지만 재료와 돈은 잃어요.</div>
    <div class="igrid gear">${cells}${pad}</div>
    <div class="card hl idet"><div class="row">${gImg(g, 'ico lg q-b q' + g.q)}<div class="grow stack"><span>${gearName(g)} ${qTag(g)}${runeDots(g)}${sel.owner ? ` <span class="tag">${esc(sel.owner.name)} 착용</span>` : ''}</span><span class="sub">${statLine(now)}</span>${(g.plus || 0) < PLUS_MAX ? `<span class="sub ok-t">+${(g.plus || 0) + 1}: ${diff || '변화 없음'}</span><span class="sub muted">재료 ${needStr(need)} · ${fmt(plusFee(g))}G · 성공 ${Math.round(plusRate(g) * 100)}%</span>` : '<span class="sub gold-t">최고 강화 +10</span>'}${why && (g.plus || 0) < PLUS_MAX ? `<span class="sub red-t">${why}</span>` : ''}</div></div>
    <div class="btns"><button type="button" class="btn gold grow" data-act="enhance" data-id="${g.id}"${why ? ' disabled' : ''}>${(g.plus || 0) >= PLUS_MAX ? '완료' : `+${(g.plus || 0) + 1} 강화 · ${fmt(plusFee(g))}G`}</button></div></div>`;
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
const careFoot = () => `<div class="row sub"><span class="grow">히포크리초 ${S.inv.herb || 0}개 · 처치는 환자마다 하루 한 번</span><button type="button" class="btn sm" data-act="buy" data-it="herb" data-q="6"${S.gold < buyPrice('herb') * 6 ? ' disabled' : ''}>히포크리초 6개 ${buyPrice('herb') * 6}G</button><button type="button" class="btn sm${S.autoTreat ? ' on' : ''}" data-act="autotreat">자동 처치 ${S.autoTreat ? '켬' : '끔'}</button></div>`;
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
  const crests = TIER_FIELDS.map((f, t) => 'crest_' + t).filter(k => (S.inv[k] || 0) > 0);
  const carve = crests.map(k => `<div class="li">${iconImg(k)}<div class="grow"><span>${ITEMS[k].name} <b class="num">×${S.inv[k]}</b></span><span class="sub">${RUNE_CARVE.crest}개와 ${RUNE_CARVE.fee}G로 무작위 하급 룬을 새겨요</span></div><button type="button" class="btn sm" data-act="carve" data-t="${k.split('_')[1]}"${S.inv[k] >= RUNE_CARVE.crest && S.gold >= RUNE_CARVE.fee ? '' : ' disabled'}>새기기</button></div>`).join('');
  return `${cur ? `<div class="sub gold-t">연구 중: ${RESEARCH[cur.k].name} ${rlv(cur.k) + 1}단계 · ${dayLabel(cur.done)} 완료</div>` : '<div class="sub">한 번에 하나씩 연구할 수 있어요. 연구 기간은 게임 속 날짜로 셉니다.</div>'}<div class="list">${rows}</div>
    <div class="sec"><b>룬 공방</b><span>룬은 장비 창에서 끼워요</span></div>
    <div class="list">${carve || '<div class="li"><span class="sub">필드 보스가 떨어뜨리는 「우두머리의 증표」로 룬을 새길 수 있어요.</span></div>'}${fuse}</div>`;
}
const BLD_INNER = { smithy: '대장간에서 장비 만들기', alchemy: '물약 만들기', temple: '치료와 치유사', bank: '예금과 대출', tower: '마법 연구', pen: '알 품기와 펫 돌보기', stable: '말과 마차', library: '스킬북 만들기', airfield: '비행 마차와 구름섬 원정' };
const BLD_BOX = {}, BLD_SUM = {};   // 새 시설의 안쪽 창·요약 (world30.js)
function bldCard(id, full) {
  const B = BUILDINGS[id], lv = S.bld[id], max = lv >= B.max, c = B.cost[lv], need = BUILD_RANK[id] || 0;
  if (!lv && (S.rank || 0) < need) return `<div class="card dim"><div class="row"><div class="grow"><div class="h">${B.name} <small>잠김</small></div><div class="sub">${B.desc}</div></div><span class="sub muted">${RANKS[need].name}랭크에 열림</span></div></div>`;
  const btn = max ? '<span class="sub muted">최고 단계</span>' : `<button type="button" class="btn sm${lv ? '' : ' gold'}" data-act="build" data-id="${id}"${S.gold < c ? ' disabled' : ''}>${lv ? '확장' : '건설'} ${fmt(c)}G</button>`;
  let body = '';
  if (full && lv && id === 'smithy') body = smithyBox();
  if (full && lv && id === 'alchemy') body = `<div class="list">${RECIPES.map((r, i) => `<div class="li">${iconImg(r.out)}<div class="grow"><span>${ITEMS[r.out].name} <span class="muted">창고 ${S.inv[r.out] || 0}</span></span><span class="sub">${S.bld.alchemy >= r.lv ? needStr(r.need) + ` · ${craftFee(r)}G` : '공방 2단계 필요'}</span></div><button type="button" class="btn sm gold" data-act="craft" data-i="${i}"${canCraft(r) ? '' : ' disabled'}>만들기</button></div>`).join('')}</div>`;
  if (lv && id === 'training') body = '<div class="sub">모험가 창에서 능력치를 훈련하고, 스킬을 배우고, 전직할 수 있어요.</div>';
  if (full && lv && id === 'bank') body = bankBox();
  if (full && lv && id === 'pen') body = penBox();
  if (!full && lv && id === 'pen') body = `<div class="sub">펫 ${S.pets.length}/${penCap()}마리 · 품는 알 ${(S.pen && S.pen.inc.length) || 0}개 · 상단에 남은 펫 ${petsAtHome().length}마리</div>`;
  if (full && lv && id === 'tower') body = towerBox();
  if (full && lv && BLD_BOX[id]) body = BLD_BOX[id]();
  if (!full && lv && BLD_SUM[id]) body = BLD_SUM[id]();
  if (id === 'temple' && (full || !lv)) body = lv ? templeBox() : innCare();
  if (id === 'shop' && lv) body = `<div class="sub">진열대 ${slotCount()}칸 · 손님 수 ×${traffic().toFixed(2)} · 진열은 창고 창에서 해요.</div>`;
  if (id === 'inn' && lv) body = `<div class="sub">방 ${living().length}/${beds()} · 모험가는 자기 방에서 자며 숙면 피로를 풀어요. 하루 ${Math.round(SLEEP.rest(lv) * DAY_SEC)}씩, 밤에는 더 빨리.</div><div class="btns"><button type="button" class="btn sm gold" data-act="advguest">여관 손님 ${S.cands.length}명 보기 ›</button></div>`;
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
    <div class="row"><img class="por" src="${portrait(a)}" alt=""><div class="grow"><div class="h">${esc(a.name)} <small>${CLASSES[a.cls].name} Lv${a.lv}</small> ${licTag(a)}${heroTag(a)}${tierTag(a.cls)}${injTag(a)}${a.quit ? ' <span class="tag red-t">퇴사 예정</span>' : ''}</div><div class="sub">${advState(a, p)}</div></div><div class="eqs">${eqIcons(a)}</div></div>
    <div class="bar hp"><i data-hp="${a.id}"></i></div><div class="bar mp"><i data-mp="${a.id}"></i></div><div class="bar fat"><i data-fat="${a.id}"></i></div><div class="bar slp"><i data-slp="${a.id}"></i></div>
    ${a.inj ? `<div class="bar inj"><i data-inj="${a.id}"></i></div>` : ''}
    <div class="stats"><span>힘 <b>${d.T.str}</b></span><span>체력 <b>${d.T.vit}</b></span><span>민첩 <b>${d.T.agi}</b></span><span>지능 <b>${d.T.int}</b></span><span>명성 <b>${Math.floor(a.pf || 0)}</b></span><span>피로 <b data-fatn="${a.id}">${Math.round(a.fat || 0)}</b></span><span>숙면 <b data-slpn="${a.id}">${Math.round(a.sleep || 0)}</b></span><span class="muted">${a.skills.map(s => SKILLS[s].name).join(' · ')}</span></div>
  </button>`;
}
// 특성 칩: 이름 + 효과
const traitChips = (a, stone) => (a.traits || []).map(id => TRAITS[id] ? `<span class="trait${TRAITS[id].job ? ' job' : ''}${TRAITS[id].neg ? ' neg' : ''}" title="${esc(TRAITS[id].desc)}"><b>${TRAITS[id].name}</b> <small>${esc(TRAITS[id].desc)}${TRAITS[id].job ? ' · 직업 특성' : ''}</small>${stone && !TRAITS[id].job ? `<button type="button" class="btn xs" data-mact="stone" data-t="${id}">돌로 바꾸기</button>` : ''}</span>` : '').join('');
// 타고난 특성의 빈 자리 (3개까지). bloom이면 개화석 단추
const emptyTraitChips = (a, bloom) => { let out = ''; for (let i = innateTraits(a).length; i < TRAIT_MAX; i++) out += `<span class="trait empty"><b>빈 자리</b> <small>개화석으로 피워요</small>${bloom && !out ? '<button type="button" class="btn xs gold" data-mact="bloom">개화석 쓰기</button>' : ''}</span>`; return out; };
function candCard(c) {
  let cond = '', why = '';
  if (c.cond && c.cond.type === 'gift') { const have = S.inv[c.cond.item] || 0; cond = `<div class="row sub">${iconImg(c.cond.item)}<span class="grow">조건: ${ITEMS[c.cond.item].name} ${c.cond.qty}개 선물 (보유 ${have})</span></div>`; if (have < c.cond.qty) why = '선물이 모자라요'; }
  if (c.cond && c.cond.type === 'fame') { cond = `<div class="sub">조건: 명성 ${c.cond.min} 이상 (지금 ${S.fame})</div>`; if (S.fame < c.cond.min) why = '명성이 모자라요'; }
  if (!why && living().length >= beds()) why = '여관 방이 없어요';
  if (!why && S.gold < c.fee) why = '계약금이 모자라요';
  const C = CLASSES[c.cls], d = derive(c);
  return `<div class="card">
    <div class="row"><img class="por" src="${portrait(c)}" alt=""><div class="grow"><div class="h">${esc(c.name)} <small>${C.name} Lv${c.lv}</small> ${licTag(c)}</div><div class="sub">${C.desc}</div></div><div class="eqs">${eqIcons(c)}</div></div>
    <div class="traits">${traitChips(c)}${emptyTraitChips(c)}${wxtChip(c)}</div>
    <div class="stats"><span>힘 <b>${d.T.str}</b></span><span>체력 <b>${d.T.vit}</b></span><span>민첩 <b>${d.T.agi}</b></span><span>지능 <b>${d.T.int}</b></span><span>HP <b>${d.maxHp}</b></span><span>MP <b>${d.maxMp}</b></span><span>봉급 <b>${fmt(c.salary)}G/월</b></span></div>
    <div class="sub muted">${esc(c.bio)}</div>${cond}
    <div class="row"><span class="sub grow">${why ? `<span class="red-t">${why}</span>` : '고용할 수 있어요'}</span><button type="button" class="btn sm gold" data-act="hire" data-id="${c.id}"${why ? ' disabled' : ''}>고용 · 계약금 ${fmt(c.fee)}G</button></div>
  </div>`;
}
function jobTreeList() {
  return ['warrior', 'archer', 'rogue', 'mage', 'cleric'].map(b => `<div><b>${CLASSES[b].name}</b> → ${nextJobs(b).map(c => `${CLASSES[c].name}(${nextJobs(c).map(x => CLASSES[x].name).join('')})`).join(' · ')}</div>`).join('') + '<div class="muted">짐꾼은 짐꾼 그대로예요.</div>';
}
// 모험가 창 탭: 기본 직업 계열(2·3차 전직도 계열을 따른다) + 여관 손님
const ADV_CATS = [['warrior', '전사'], ['archer', '궁수'], ['mage', '마법사'], ['cleric', '성직자'], ['rogue', '도적'], ['porter', '짐꾼'], ['guest', '여관']];
const advCatOf = a => jobBase(a.cls);
const advCatN = k => (k === 'guest' ? S.cands.length : living().filter(a => advCatOf(a) === k).length);
function advCatCur() {
  if (UI.advCat && ADV_CATS.some(([k]) => k === UI.advCat)) return UI.advCat;
  const first = ADV_CATS.find(([k]) => k !== 'guest' && advCatN(k) > 0);
  return first ? first[0] : 'guest';
}
const advCatBar = cur => `<div class="tabs advcat">${ADV_CATS.map(([k, n]) => { const c = advCatN(k); return `<button type="button" class="tab${cur === k ? ' on' : ''}${c ? '' : ' none'}" data-act="advcat" data-id="${k}">${n}<small>${k === 'guest' ? `손님 ${c}` : `${c}명`}</small></button>`; }).join('')}</div>`;
const ADV_GUIDE = () => `
  <details class="card"><summary>라이선스와 전직 안내</summary><div class="log">
    <div>모험가는 원정에서 몬스터를 잡고, 필드 보스와 던전을 쓰러뜨리고, 무사히 돌아올 때마다 개인 명성을 쌓아요. 레벨·개인 명성·처치 수·우두머리 처치 수·던전 공략 수가 차면 모험가 길드 심사를 받아 ${LICENSE.map(L => L.name).join(' → ')}로 올라가요 (${LICENSE_UP.map((L, i) => `${LICENSE[i + 1].name} Lv${L.lv}·명성 ${L.pf}·처치 ${fmt(L.kills)}·우두머리 ${L.bosses}${L.dungeons ? '·던전 ' + L.dungeons : ''}·${fmt(L.fee)}G`).join(', ')}). 라이선스가 오를수록 능력이 강해지고 봉급도 올라요.</div>
    <div>전투에서 기본 공격은 ${BASIC_CD}초 ÷ 공격 속도마다 한 번 나가고(공격력 ×${BASIC_MULT}), 스킬은 저마다의 재사용 대기시간이 돌면 따로 나가요. 공격 속도는 민첩·특성 「재빠름」·지속 스킬 「신속」·신속의 룬·강화 스킬로, 스킬 재사용 감소는 지속 스킬 「전술」·특성 「전술가」·시간의 룬·숙련도로 모여요. 스킬 창에서 모든 스킬의 계수·피해·확률·대기시간을 볼 수 있어요.</div>
    <div>2차 전직은 Lv${JOB_REQ[2].lv}·${LICENSE[JOB_REQ[2].rank].name} 라이선스·${fmt(JOB_REQ[2].fee)}G, 3차 전직은 Lv${JOB_REQ[3].lv}·${LICENSE[JOB_REQ[3].rank].name} 라이선스·${fmt(JOB_REQ[3].fee)}G가 들어요. 훈련소에서 전직하면 모습도 직업에 맞게 바뀌어요. 계열마다 맨 앞 2차 직업(검투사·레인저·정령술사·사제·암살자·음유시인)은 레벨만 맞으면 되고, 나머지는 저마다 추가 조건이 있어요.</div>
    <div>2차·3차 직업은 역할이 갈려요. 전사: 기사=탱커(도발·엄호·받는 피해 감소) · 검투사=지속딜(연계) · 광전사=한방딜(분노·처형) · 마검사=브루저(마법 검+보호막). 마법사: 네크로맨서=지속딜(저주·역병) · 마도사=한방딜(긴 쿨 큰 한 방·처형) · 정령술사=혼합(광역+치유·방어). 궁수: 레인저=지속딜(연사·늑대) · 저격수=한방딜(선공·관통·처형) · 괴물사냥꾼=혼합(표식·보스). 도적: 쌍검사=지속딜 · 암살자=한방딜 · 보물 사냥꾼=혼합(금화·연막·대박). 성직자: 사제=치유·보호막·부활(3차) · 역병의사=재생+지속 딜 · 퇴마사=전투 사제(때리면 파티가 회복). 짐꾼: 음유시인=공격 버퍼 · 마부=방어 버퍼(보호막·엄호) · 정찰가=디버퍼(표식·약점 간파).</div>
    <div>장치: 연계 — 기본 공격을 맞힐 때마다 피해가 쌓이고(5중첩) 빗나가거나 기절하면 끊겨요. 처형 — HP 30% 아래 적에게 더 큰 피해. 표식 — 걸린 적이 받는 피해 +20%. 보호막 — 피해를 대신 받는 임시 HP(HP 막대 위 하늘색). 엄호 — 동료가 노려지면 탱커가 대신 맞아요. 재생 — 초당 회복이 이어져요.</div>${jobTreeList()}
    <div>스킬 칸은 기본 ${MAX_SKILLS}칸이고 Lv${SKILL_SLOT_LV.join('·')}에 한 칸씩 늘어요. 최고 레벨은 ${MAX_LV}이고, 2차 각성하면 ${MAX_LV2}까지 올라가요.</div>
    <div>숙련은 스킬 칸과 따로 훈련소에서 배워요: ${MAST_IDS.map(k => MASTERY[k].name).join('·')}. ${MAST_TIERS.map(T => `${T.name} Lv${T.lv}${T.job > 1 ? '·' + T.job + '차 전직' : ''}`).join(' → ')}. 무기술(검술·궁술 …)은 그 무기를 들었을 때만 켜져요.</div></div></details>`;
PANELS.adv = () => {
  const cur = advCatCur(), free = Math.max(0, beds() - living().length);
  const head = `<div class="sec"><b>소속 모험가</b><span>${living().length}/${beds()}명${cur === 'guest' ? '' : ' · 눌러서 자세히'}</span></div>${advCatBar(cur)}`;
  if (cur === 'guest') return `${head}
  <div class="sec"><b>여관 손님</b><span>이틀마다 새 손님 · 빈 방 ${free}개</span></div>
  ${free ? '' : '<div class="sub red-t">여관 방이 다 찼어요. 여관을 넓히거나 모험가를 내보내야 고용할 수 있어요.</div>'}
  ${S.cands.map(candCard).join('') || '<div class="card"><div class="sub">지금은 여관에 묵는 손님이 없어요. 이틀마다 새 손님이 와요.</div></div>'}`;
  const list = living().filter(a => advCatOf(a) === cur);
  return `${head}
  ${S.gear.length && S.advs.some(a => a.status === 'idle') ? '<div class="btns"><button type="button" class="btn sm gold" data-act="autoeqall">대기 중인 모험가 모두 가장 좋은 장비 끼우기</button></div>' : ''}
  ${list.map(advCard).join('') || `<div class="card"><div class="sub">${CLASSES[cur].name} 계열 모험가가 없어요. 「여관」 탭의 손님 중에서 고용하세요.</div></div>`}
  ${ADV_GUIDE()}`;
};

/* 숙련 (초급·중급·상급) 줄: 스킬 창 */
const MAST_COL = ['#6a6458', '#c8884a', '#c8d0d8', '#f0c24a'];   // 안 배움 · 초급(동) · 중급(은) · 상급(금)
function mastIconURL(k, t) {
  const key = 'm:' + k + ':' + t; if (ICON_URL[key]) return ICON_URL[key];
  const [c, x] = mkCanvas(10, 10); drawIcon(x, { icon: MASTERY[k].icon, c: MAST_COL[t] || MAST_COL[0] });
  return (ICON_URL[key] = c.toDataURL());
}
const mastPips = t => `<span class="mpips">${MAST_TIERS.map((_, i) => `<i class="${i < t ? 'on t' + t : ''}"></i>`).join('')}</span>`;   // 그림과 같이: 배운 점은 모두 지금 단계 색
function mastRows(a, idle) {
  return MAST_IDS.filter(k => canMast(a, k)).map(k => {
    const M = MASTERY[k], t = mastTier(a, k), nx = MAST_TIERS[t], why = nx ? mastWhy(a, k) : '', on = mastOn(a, k);
    const cond = M.w ? `${mastCond(k)}${t ? (on ? ' · <span class="ok-t">켜짐</span>' : ' · <span class="red-t">꺼짐</span>') : ''}` : '늘 켜짐';
    const now = t ? `지금 ${mastFxText(M.fx[t - 1])}` : '아직 배우지 않았어요';
    return `<div class="li col${t && !on ? ' dim' : ''}"><div class="row">${mastIco(k, t)}<div class="grow stack"><span>${mastName(k, t)} ${mastPips(t)}</span><span class="sub gold-t">${cond}</span><span class="sub">${M.desc}</span><span class="sub">${now}${nx ? ` <span class="muted">→ ${nx.name}: ${mastFxText(M.fx[t])}</span>` : ''}</span>${why ? `<span class="sub muted">다음 단계: ${esc(why)}</span>` : ''}</div>${nx ? `<button type="button" class="btn sm gold" data-mact="mast" data-k="${k}" title="${esc(why)}"${why ? ' disabled' : ''}>${nx.name} ${fmt(nx.fee)}G</button>` : `<span class="tag gold-t">${MAST_TIERS[MAST_MAX - 1].name}</span>`}</div></div>`;
  }).join('');
}
/* 모험가 상세 창 */
function advDetail(a) {
  const d = derive(a), G = gearSum(a), idle = a.status === 'idle', canTr = S.bld.training && idle && trainedTotal(a) < trainCap(a);
  const stats = STATS.map(([k, n]) => `<div class="li flat"><span class="grow">${n} <b class="num">${d.T[k]}</b> <span class="sub muted">· 기본 ${a.st[k]}${a.tr[k] ? ` · 훈련 +${a.tr[k]}` : ''}${G[k] ? ` · 장비 ${G[k] > 0 ? '+' : ''}${G[k]}` : ''}</span></span>${S.bld.training ? `<button type="button" class="btn sm" data-mact="train" data-k="${k}"${canTr && S.gold >= trainCost(a) ? '' : ' disabled'}>+1 · ${fmt(trainCost(a))}G</button>` : ''}</div>`).join('');
  const derived = [['HP', `${Math.ceil(a.hp)}/${d.maxHp}`], ['MP', `${Math.ceil(a.mp)}/${d.maxMp}`], ['피로', `${Math.round(a.fat || 0)}/100`], ['숙면 피로', `${Math.round(a.sleep || 0)}/100`], ['공격', d.atk.toFixed(1)], ['마법', d.matk.toFixed(1)], ['방어', d.def.toFixed(1)], ['회피', Math.round(d.eva * 1000) / 10 + '%'], ['치명', Math.round(d.crit * 1000) / 10 + '%'], ['방어 확률', Math.round(d.block * 100) + '%'], ['반격', Math.round(d.counter * 100) + '%'], ['연타', Math.round(((TR(a).double || 0) + d.double) * 100) + '%'], ['공격 속도', '×' + d.spd.toFixed(2)], ['기본 공격', basicCd(a, d, null).toFixed(1) + '초마다'], ['스킬 재사용', '-' + Math.round(d.cdr * 100) + '%'], ['이동속도', d.move.toFixed(1)], ['짐', d.carry]]
    .map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join('');
  const spdB = speedBreakdown(a);
  const slots = SLOTS.map(([s, n]) => {
    const g = a.eq[s];
    const pool = S.gear.filter(x => GTYPES[x.base].slot === s && gearFits(a, x) && (!g || gearScore(x) >= gearScore(g))).sort((x, y) => gearScore(y) - gearScore(x)).slice(0, 4);
    return `<div class="li col"><div class="row">${g ? gImg(g, 'ico q-b q' + g.q) : '<span class="ico empty"></span>'}<div class="grow stack"><span>${n} · ${g ? gearName(g) + ' ' + qTag(g) : '<span class="muted">비어 있음</span>'}</span>${g ? `<span class="sub">${statLine(gearStats(g))}</span>` : ''}</div>${g && idle ? `<button type="button" class="btn sm" data-mact="uneq" data-s="${s}">빼기</button>` : ''}</div>
      ${g && runeSlots(g) ? `<div class="row sub"><span class="grow">룬 ${(g.runes || []).length}/${runeSlots(g)}${runeDots(g)}</span>${idle ? `<button type="button" class="btn sm" data-mact="rune" data-g="${g.id}">룬 끼우기</button>` : ''}</div>` : ''}
      ${idle ? pool.map(x => `<div class="row sub swap">${gImg(x)}<span class="grow">${gearName(x)} ${qTag(x)} · ${statLine(gearStats(x))}</span><button type="button" class="btn sm" data-mact="eq" data-g="${x.id}">끼우기</button></div>`).join('') : ''}</div>`;
  }).join('');
  const basicRow = `<div class="li basic"><div class="grow stack"><span>기본 공격 <span class="muted">· ${basicIsMagic(a) ? '마법' : CLASSES[a.cls].act === 'arrow' ? '사격' : '근접'} · 스킬과 상관없이 따로 나가요</span></span><span class="sub"><span class="sk-spec">${basicSpec(a).join(' · ')}</span></span></div></div>`;
  const learned = basicRow + a.skills.map(id => { const s = SKILLS[id], lv = skLv(a, id), why = skillUpWhy(a, id), off = a.skoff && a.skoff[id], pri = a.skpri && a.skpri[id];
    const up = lv < SK_LV_MAX ? `<button type="button" class="btn sm gold" data-mact="skup" data-s="${id}" title="${esc(why)}"${why ? ' disabled' : ''}>Lv${lv + 1} · ${skillNeedsBook(id) ? '책 1 + ' : ''}${fmt(skillUpCost(id, lv + 1))}G</button>` : '<span class="tag gold-t">최고</span>';
    const tog = s.passive ? '' : `<button type="button" class="btn sm${off ? ' on' : ''}" data-mact="skoff" data-s="${id}">${off ? '자동 끔' : '자동 켬'}</button><button type="button" class="btn sm${pri ? ' on' : ''}" data-mact="skpri" data-s="${id}"${off ? ' disabled' : ''}>${pri ? '★ 우선' : '우선'}</button>`;
    return `<div class="li col${off ? ' dim' : ''}"><div class="row">${skIco(id)}<div class="grow stack"><span>${s.name} <span class="tag${lv > 1 ? ' gold-t' : ''}">Lv${lv}</span> <span class="muted">· ${costStr(s)}${s.cd ? ` · 재사용 ${s.cd}초` : ''}${off ? ' · <span class="red-t">자동 사용 끔</span>' : pri ? ' · <span class="gold-t">우선 사용</span>' : ''}</span></span><span class="sub">${s.desc}</span><span class="sub">${skillSpecLine(id, a)}</span>${why && lv < SK_LV_MAX ? `<span class="sub muted">다음 단계: ${esc(why)}</span>` : ''}</div></div><div class="btns">${up}${tog}${id !== CLASSES[a.cls].innate && idle ? `<button type="button" class="btn sm" data-mact="forget" data-s="${id}">잊기</button>` : ''}</div></div>`; }).join('');
  const books = Object.keys(S.inv).filter(k => ITEMS[k].book && S.inv[k] > 0 && !a.skills.includes(ITEMS[k].book) && canLearn(a, ITEMS[k].book));
  const room = a.skills.length < skillSlots(a), chain = chainOf(a.cls), mastList = mastRows(a, idle);
  const learnable = books.map(k => { const id = ITEMS[k].book, s = SKILLS[id]; return `<div class="li">${skIco(id)}<div class="grow stack"><span>${s.name} <span class="muted">· ${costStr(s)} · Lv${s.lv} · ${iconImg(k, 'pi')} 스킬북</span></span><span class="sub">${s.desc}</span><span class="sub">${skillSpecLine(id)}</span></div><button type="button" class="btn sm gold" data-mact="learn" data-s="${id}"${S.bld.training && idle && room && S.gold >= s.lv * 30 ? '' : ' disabled'}>배우기 ${s.lv * 30}G</button></div>`; }).join('');
  const owns = SKILL_IDS.filter(id => SKILLS[id].own && chain.some(c => SKILLS[id].cls.includes(c)) && !a.skills.includes(id)).sort((x, y) => SKILLS[x].lv - SKILLS[y].lv);
  const ownRows = owns.map(id => { const s = SKILLS[id], ok = a.lv >= s.lv; return `<div class="li">${skIco(id)}<div class="grow stack"><span>${s.name} <span class="muted">· ${costStr(s)} · Lv${s.lv}${s.cls.includes(a.cls) ? '' : ` · ${s.cls.map(c => CLASSES[c] ? CLASSES[c].name : '').join('')}`}</span></span><span class="sub">${s.desc}</span><span class="sub">${skillSpecLine(id)}</span></div><button type="button" class="btn sm gold" data-mact="learn" data-s="${id}"${ok && S.bld.training && idle && room && S.gold >= ownFee(s) ? '' : ' disabled'}>${ok ? `배우기 ${ownFee(s)}G` : `Lv${s.lv}부터`}</button></div>`; }).join('');
  const table = SKILL_IDS.filter(id => chain.some(c => SKILLS[id].cls.includes(c)) || SKILLS[id].cls.includes('all')).sort((x, y) => SKILLS[x].lv - SKILLS[y].lv)
    .map(id => { const s = SKILLS[id], has = a.skills.includes(id); return `<div class="${has ? 'ok-t' : a.lv >= s.lv ? '' : 'muted'}">Lv${s.lv} ${s.name} · ${costStr(s)} · ${has ? '배움' : id === CLASSES[a.cls].innate ? '기본' : s.own ? '고유 · 책 없이 배움' : '스킬북 필요'}${s.cls.includes('all') ? ' · 공용' : ''}<div class="sub muted">${skillSpec(id).join(' · ')}${!has && !s.own && !s.awk && id !== CLASSES[a.cls].innate ? ` · ${bookFromText(id)}` : ''}</div></div>`; }).join('');
  const L = LICENSE[a.rank || 0], Ln = licNext(a);
  const licR = licReqs(a), licOk = licR.every(r => r.ok);
  const lic = Ln ? `<div class="li"><div class="grow stack"><span>다음: ${LICENSE[a.rank + 1].name} <span class="muted">· 능력 ×${LICENSE[a.rank + 1].mul}</span></span><span class="sub">${licR.map(r => `<span class="${r.ok ? 'ok-t' : 'red-t'}">${r.label} ${fmt(r.cur)}/${fmt(r.need)}</span>`).join(' · ')} · <span class="${S.gold >= Ln.fee ? '' : 'red-t'}">심사비 ${fmt(Ln.fee)}G</span></span><span class="sub muted">우두머리·주인 처치는 필드 보스(1-10·20·30·40·50)와 던전 주인을 함께 센 수예요. 던전·레이드 공략은 던전 주인을 처음 쓰러뜨리거나 레이드를 끝냈을 때예요.</span></div><button type="button" class="btn sm gold" data-mact="lic"${idle && licOk && S.gold >= Ln.fee ? '' : ' disabled'}>심사</button></div>` : '<div class="li"><span class="sub gold-t">가장 높은 라이선스예요.</span></div>';
  const promo = nextJobs(a.cls).map(c => { const why = promoWhy(a, c), Q = JOB_REQ[jobTier(c)]; return `<div class="li job"><img class="por" src="${portrait(Object.assign({}, a, { cls: c }))}" alt=""><div class="grow"><span>${CLASSES[c].name} <span class="muted">· ${jobTier(c)}차 · 기본 스킬 ${SKILLS[CLASSES[c].innate].name}</span></span><span class="sub">${CLASSES[c].desc}</span><span class="sub gold-t">${trText(c)}</span>${jobReqText(c) ? `<span class="sub muted">추가 조건: ${jobReqText(c)}</span>` : ''}${why ? `<span class="sub red-t">${why}</span>` : ''}</div><button type="button" class="btn sm gold" data-mact="promo" data-c="${c}"${why ? ' disabled' : ''}>전직 ${fmt(Q.fee)}G</button></div>`; }).join('');
  const post = isHealer(a.cls) && S.bld.temple ? `<div class="li"><div class="grow"><span>신전 치유사</span><span class="sub">${a.post ? '신전에서 환자를 돌보고 있어요. 원정에는 나가지 않아요.' : `신전에 두면 환자를 하루 +${Math.round(healPow(a))}씩 치료해요.${SURGEONS.includes(a.cls) ? ' 수술도 해요.' : ''}`}</span></div><button type="button" class="btn sm${a.post ? '' : ' gold'}" data-mact="post"${idle && !a.inj && (a.post || healers().length < healerSlots()) ? '' : ' disabled'}>${a.post ? '내리기' : `배치 ${healers().length}/${healerSlots()}`}</button></div>` : '';
  const tab = UI.advTab || 'sum';
  const tabs = [['sum', '개요'], ['stat', '능력치'], ['job', '전직'], ['skill', '스킬'], ['gear', '장비'], ['etc', '관리']];
  const bar = `<div class="tabs adv">${tabs.map(([id, n]) => `<button type="button" class="tab${tab === id ? ' on' : ''}" data-mact="atab" data-t="${id}">${n}</button>`).join('')}</div>`;
  const notes = `${idle ? '' : '<div class="sub red-t">원정 중에는 보기만 할 수 있어요.</div>'}
    ${a.inj ? `<div class="sec"><b>부상</b><span>${S.bld.temple ? '신전' : '여관 방'}에서 치료 중</span></div><div class="list">${careRow(a, healPlan(), 'mact')}</div>` : ''}
    ${(a.sleep || 0) >= SLEEP.block ? `<div class="sub warn">숙면 피로 ${Math.round(a.sleep)} · ${SLEEP.block} 아래로 내려갈 때까지 여관에서 자야 원정에 나갈 수 있어요.</div>` : ''}`;
  let body = '';
  if (tab === 'sum') body = `
    <div class="card"><div class="h">${esc(a.name)} <span class="muted">· ${CLASSES[a.cls].name} Lv${a.lv}</span>${tierTag(a.cls)} ${licTag(a)}${heroTag(a)}${injTag(a)}</div>${trText(a.cls) ? `<div class="sub gold-t">${trText(a.cls)}</div>` : ''}<div class="sub">${a.lv >= lvCap(a) ? `최고 레벨${a.hero2 ? '' : a.hero ? ` (Lv${AWAKEN2.lv} 2차 각성으로 ${MAX_LV2}까지)` : ''}` : `경험치 ${fmt(a.exp)}/${fmt(expNeed(a.lv))}`} · 봉급 ${fmt(a.salary)}G/월 · 처치 ${a.kills || 0} · 개인 명성 ${Math.floor(a.pf || 0)}</div></div>
    <div class="sec"><b>특성</b><span>타고난 ${innateTraits(a).length}/${TRAIT_MAX}${(S.inv.wizstone || 0) ? ` · 마법사의 돌 ${S.inv.wizstone}개` : ''}${(S.inv.bloomstone || 0) ? ` · 개화석 ${S.inv.bloomstone}개` : ''}</span></div>
    <div class="traits">${traitChips(a, idle && (S.inv.wizstone || 0) > 0)}${emptyTraitChips(a, idle && (S.inv.bloomstone || 0) > 0)}</div>
    ${a.wxt ? `<div class="sec"><b>날씨 특성</b><span>모험가마다 하나 · 타고난 특성과 따로</span></div><div class="traits">${wxtChip(a)}</div>` : ''}
    <div class="sub muted">마법사의 돌은 타고난 특성 하나를 다른 것으로 바꾸고, 개화석은 빈 자리에 새 특성을 피워요. 둘 다 필드의 우두머리·주인, 던전 주인, 레이드 등수 보상에서 나와요.</div>
    ${notes}
    <div class="sec"><b>모험가 라이선스</b><span>지금 ${L.name}${L.mul > 1 ? ` · 능력 ×${L.mul}` : ''}</span></div>
    <div class="list">${lic}</div>
    <div class="sub muted">${esc(a.bio)}</div>`;
  else if (tab === 'stat') body = `
    <div class="sec" style="margin-top:0"><b>능력치</b><span>${S.bld.training ? `훈련 ${trainedTotal(a)}/${trainCap(a)}번` : '훈련소를 지으면 훈련할 수 있어요'}</span></div>
    <div class="list">${stats}</div>
    <div class="stats boxed">${derived}</div>
    <div class="sub muted">공격 속도 ${spdB.spd} → 기본 공격은 ${BASIC_CD}초 ÷ 공격 속도마다 한 번(공격력 ×${BASIC_MULT}). 스킬 재사용 감소: ${spdB.cdr}. 숙련도가 오르면 그 스킬의 재사용도 2%씩 줄어요.</div>${notes}`;
  else if (tab === 'job') body = `
    ${promo ? `<div class="sec" style="margin-top:0"><b>${jobTier(a.cls) + 1}차 전직</b><span>${jobTier(a.cls) === 1 ? '하나를 골라요 · 되돌릴 수 없어요' : '훈련소에서'}</span></div><div class="list">${promo}</div>` : `<div class="sub muted" style="margin-top:0">${jobTier(a.cls) >= 3 ? '3차 직업의 끝이에요. 아래에서 각성할 수 있어요.' : '더 전직할 수 없어요.'}</div>`}
    ${jobTier(a.cls) >= 3 || a.hero ? `<div class="sec"><b>각성</b><span>${a.hero ? '용사' : '3차 직업의 끝'}</span></div><div class="card${a.hero ? ' hl' : ''}">${a.hero ? `<div class="h gold-t">용사 ${esc(a.name)}</div><div class="sub">각성기 「${SKILLS[awkSkillOf(a)].name}」 · ${SKILLS[awkSkillOf(a)].desc} 능력 +15%, 성장 ×1.2.</div>` : `<div class="sub">Lv${AWAKEN.lv} 이상, ${LICENSE[AWAKEN.rank].name} 라이선스, 주인의 혼 ${AWAKEN.souls}개, ${fmt(AWAKEN.fee)}G. 각성하면 각성기 「${SKILLS[awkSkillOf(a)].name}」을 받고 능력이 15% 오르며 성장이 빨라져요.</div><div class="row"><span class="sub grow ${awakenWhy(a) ? 'red-t' : 'ok-t'}">${awakenWhy(a) || '각성할 수 있어요'}</span><button type="button" class="btn sm gold" data-mact="awaken"${awakenWhy(a) ? ' disabled' : ''}>각성</button></div>`}</div>` : ''}
    ${a.hero ? `<div class="sec"><b>2차 각성</b><span>${a.hero2 ? '초월 용사' : `Lv${AWAKEN2.lv} 용사의 한계`}</span></div><div class="card${a.hero2 ? ' hl' : ''}">${a.hero2 ? `<div class="h gold-t">초월 용사 ${esc(a.name)}</div><div class="sub">2차 각성기 「${SKILLS[awk2SkillOf(a)].name}」 · ${SKILLS[awk2SkillOf(a)].desc} 레벨 상한 ${MAX_LV2}, 능력 +15% 더, 성장 ×1.35.</div>` : `<div class="sub">Lv${AWAKEN2.lv} 이상, ${LICENSE[AWAKEN2.rank].name} 라이선스, ${ITEMS[AWAKEN2.core].name} ${AWAKEN2.cores}개, 주인의 혼 ${AWAKEN2.souls}개, ${fmt(AWAKEN2.fee)}G. 2차 각성하면 2차 각성기 「${SKILLS[awk2SkillOf(a)].name}」을 받고 레벨 상한이 ${MAX_LV2}까지 풀려요. 능력 +15% 더, 성장 ×1.35, 스킬 칸 +1.</div><div class="row"><span class="sub grow ${awaken2Why(a) ? 'red-t' : 'ok-t'}">${awaken2Why(a) || '2차 각성할 수 있어요'}</span><button type="button" class="btn sm gold" data-mact="awaken2"${awaken2Why(a) ? ' disabled' : ''}>2차 각성</button></div>`}</div>` : ''}
    <details class="card"><summary>전직 길 안내</summary><div class="log">${jobTreeList()}<div class="muted">계열마다 맨 앞 2차 직업은 레벨만 맞으면 되고, 나머지는 저마다 추가 조건이 있어요. 2차 Lv${JOB_REQ[2].lv}·${LICENSE[JOB_REQ[2].rank].name} 라이선스·${fmt(JOB_REQ[2].fee)}G, 3차 Lv${JOB_REQ[3].lv}·${LICENSE[JOB_REQ[3].rank].name} 라이선스·${fmt(JOB_REQ[3].fee)}G.</div></div></details>${notes}`;
  else if (tab === 'skill') body = `
    <div class="sec" style="margin-top:0"><b>스킬</b><span>${a.skills.length}/${skillSlots(a)}칸${SKILL_SLOT_LV.find(l => a.lv < l) ? ` · Lv${SKILL_SLOT_LV.find(l => a.lv < l)}에 한 칸 더` : ''}</span></div>
    <div class="sub muted">스킬은 저마다의 재사용 대기시간이 돌면 바로 나가고, 기본 공격은 그와 상관없이 ${BASIC_CD}초 ÷ 공격 속도마다 한 번 나가요. 피해는 방어 0인 적 기준이고 실제로는 적의 방어력만큼 줄어요. 스킬 레벨은 Lv${SK_LV_MAX}까지, 단계마다 위력 +${Math.round(SK_LV_POW * 100)}%·재사용 -${Math.round(SK_LV_CD * 100)}% (책이 있는 스킬은 같은 책 한 권 더). 「자동 끔」은 그 스킬을 쓰지 않고, 「우선」은 먼저 써요.</div>
    <div class="list">${learned}</div>
    ${mastList ? `<div class="sec"><b>숙련</b><span>스킬 칸과 따로 · ${S.bld.training ? '훈련소에서 한 단계씩' : '훈련소가 필요해요'}</span></div><div class="sub muted">${MAST_TIERS.map(T => `${T.name} Lv${T.lv}${T.job > 1 ? '·' + T.job + '차 전직' : ''}·${fmt(T.fee)}G`).join(' → ')}. 무기술은 그 무기를 들었을 때만 켜지고, 지식·방패·운반 숙련은 늘 켜져 있어요. 「가장 좋은 장비 끼우기」는 숙련한 무기를 조금 더 쳐줘요.</div><div class="list">${mastList}</div>` : ''}
    ${ownRows ? `<div class="sec"><b>${CLASSES[a.cls].name} 계열 고유 스킬</b><span>${S.bld.training ? '스킬북 없이 훈련소에서' : '훈련소가 필요해요'}</span></div><div class="list">${ownRows}</div>` : ''}
    ${learnable ? `<div class="sec"><b>배울 수 있는 스킬북</b><span>${S.bld.training ? '훈련소에서 배워요' : '훈련소가 필요해요'}</span></div><div class="list">${learnable}</div>` : ''}
    <details class="card"><summary>${CLASSES[a.cls].name}이(가) 배울 수 있는 스킬 전체</summary><div class="log">${table}</div></details>${notes}`;
  else if (tab === 'gear') { const SI = setInfo(a); body = `
    <div class="sec" style="margin-top:0"><b>장비</b>${idle ? '<button type="button" class="btn sm" data-mact="autoeq">가장 좋은 장비 끼우기</button>' : ''}</div>
    <div class="card${SI.bonus ? ' hl' : ''}"><div class="sub">세트 효과: ${SI.n >= 3 ? `<b>${GTIERS[SI.t].name} ${SI.bonus.name}</b> (${SI.n}/4) · ${setBonusText(SI.bonus)}` : `같은 단계 장비를 3점 끼면 공격·마법·방어 +5%, 4점이면 +8%와 최대 HP +6%${SI.n > 0 ? ` (지금 ${GTIERS[SI.t].name} ${SI.n}점)` : ''}`}</div></div>
    <div class="list">${slots}</div>
    <div class="sub muted">강화는 대장간 창의 「강화」나 창고의 장비 탭에서, 희귀 이상 장비의 보너스 옵션 재감정은 창고의 장비 탭(마탑 필요)에서 해요.</div>${notes}`; }
  else body = `
    ${post ? `<div class="sec" style="margin-top:0"><b>신전</b><span>치유사 배치</span></div><div class="list">${post}</div>` : ''}
    <div class="sec"><b>이력</b><span>${CLASSES[a.cls].name} Lv${a.lv}</span></div>
    <div class="card"><div class="sub">${esc(a.bio)}</div><div class="stats"><span>처치 <b>${fmt(a.kills || 0)}</b></span><span>개인 명성 <b>${Math.floor(a.pf || 0)}</b></span><span>봉급 <b>${fmt(salaryOf(a))}G/월</b></span><span>훈련 <b>${trainedTotal(a)}</b>번</span></div></div>
    ${a.lv >= MAX_LV ? `<div class="sec"><b>은퇴</b><span>명예의 전당</span></div><div class="row"><span class="sub grow">Lv${MAX_LV}이에요. 명예의 전당에 동상을 세우고 은퇴시킬 수 있어요.</span><button type="button" class="btn sm gold" data-act="sub" data-id="hall">전당 열기</button></div>` : ''}
    ${idle ? '<div class="btns"><button type="button" class="btn sm red" data-mact="fire">내보내기</button></div>' : ''}${notes}`;
  return bar + body;
}
function openAdv(aid) { if (advById(aid)) openWin('advd', { aid }); }
PANELS.advd = w => { const a = advById(w.aid); if (!a) return '<div class="card"><div class="sub">상단을 떠난 모험가예요.</div></div>'; heroStart(); return `<section data-part="hero" class="part">${heroPanel(a)}</section><section data-part="det" class="part">${UI.heroDet === false ? '<div class="sub muted center">돋보기를 누르면 능력치·장비·스킬을 자세히 볼 수 있어요.</div>' : advDetail(a)}</section>`; };
function advAct(aid, b) {
  const k = b.dataset.mact, x = advById(aid);
  if (!x) return;
  if (heroAct(aid, b)) return;
  if (k === 'atab') { UI.advTab = b.dataset.t; renderPanel(true); return; }
  let m = '';
  if (k === 'train') m = trainStat(aid, b.dataset.k);
  if (k === 'eq') m = equip(aid, +b.dataset.g);
  if (k === 'uneq') m = unequip(aid, b.dataset.s);
  if (k === 'autoeq') m = autoEquip(aid);
  if (k === 'learn') m = learnSkill(aid, b.dataset.s);
  if (k === 'forget') forgetSkill(aid, b.dataset.s);
  if (k === 'skup') m = skillUp(aid, b.dataset.s);
  if (k === 'mast') m = learnMast(aid, b.dataset.k);
  if (k === 'skoff') m = skillToggle(aid, b.dataset.s, 'off');
  if (k === 'skpri') m = skillToggle(aid, b.dataset.s, 'pri');
  if (k === 'lic') m = licenseUp(aid);
  if (k === 'awaken2') { confirmBox('2차 각성', `${x.name}을(를) 2차 각성시킬까요? ${fmt(AWAKEN2.fee)}G, ${ITEMS[AWAKEN2.core].name} ${AWAKEN2.cores}개, 주인의 혼 ${AWAKEN2.souls}개가 들어요. 레벨 상한이 ${MAX_LV2}까지 풀려요.`, '2차 각성', () => { say(awaken2(aid)); renderPanel(true); updateHud(); saveGame(); }); return; }
  if (k === 'awaken') { confirmBox('각성', `${x.name}을(를) 용사로 각성시킬까요? ${fmt(AWAKEN.fee)}G와 주인의 혼 ${AWAKEN.souls}개가 들어요.`, '각성', () => { say(awaken(aid)); renderPanel(true); }); return; }
  if (k === 'promo') { const c = b.dataset.c; confirmBox('전직', `${x.name}을(를) ${CLASSES[c].name}(으)로 전직시킬까요? ${fmt(JOB_REQ[jobTier(c)].fee)}G가 들고, 되돌릴 수 없어요.`, '전직', () => { say(promote(aid, c)); renderPanel(true); updateHud(); saveGame(); }, false); return; }
  if (k === 'rune') { openWin('rune', { gid: +b.dataset.g }); return; }
  if (k === 'stone') { const t = b.dataset.t; confirmBox('마법사의 돌', `${x.name}의 「${TRAITS[t].name}」을(를) 무작위 다른 특성으로 바꿀까요? 마법사의 돌 1개를 써요.`, '바꾸기', () => { say(useStone(aid, t)); renderPanel(true); saveGame(); }, false); return; }
  if (k === 'bloom') { confirmBox('개화석', `${x.name}에게 새 특성을 피울까요? 무작위로 하나가 생기고 개화석 1개를 써요. (타고난 특성 ${innateTraits(x).length}/${TRAIT_MAX})`, '피우기', () => { say(useBloom(aid)); renderPanel(true); saveGame(); }, false); return; }
  if (k === 'treat') m = treat(aid, b.dataset.k);
  if (k === 'post') m = postHealer(aid, !x.post);
  if (k === 'fire') { confirmBox('모험가 내보내기', `${x.name}을(를) 내보낼까요? 끼고 있던 장비는 창고로 돌아와요.`, '내보내기', () => { const r = fire(aid); say(r); if (!r) backWin(); renderPanel(true); saveGame(); }, true); return; }
  say(m);
}

/* 원정 */
// 모험가 한 줄 (초상·이름·직업·HP)
function memberRow(a, btns) {
  const d = derive(a), why = cantGo(a) ? (a.inj ? INJ[a.inj.sev].name : a.post ? '신전 근무' : (a.sleep || 0) >= SLEEP.block ? '자는 중' : '') : '';
  return `<div class="li mrow"><img class="por" src="${portrait(a)}" alt=""><div class="grow stack"><span>${esc(a.name)} <span class="muted">${CLASSES[a.cls].name} Lv${a.lv}</span>${why ? ` <span class="red-t">${why}</span>` : ''}</span><span class="sub">HP ${pct(a.hp, d.maxHp)}% · MP ${pct(a.mp, d.maxMp)}%${(a.fat || 0) > 0 ? ` · 피로 ${Math.round(a.fat)}` : ''}</span></div><div class="btns">${btns}</div></div>`;
}
// 어느 파티에도 없는 모험가: 파티에 넣는 단추가 파티마다 하나씩
function freeList(forP) {
  const free = S.advs.filter(a => a.status === 'idle' && !partyOf(a.id) && !a.post);
  const open = forP ? [forP] : S.parties.filter(p => !p.exp);
  const rows = free.map(a => memberRow(a, open.map(p => `<button type="button" class="btn sm${forP ? ' gold' : ''}" data-act="member" data-id="${p.id}" data-a="${a.id}">${forP ? '넣기' : esc(p.name) + '에'}</button>`).join('') || '<span class="sub muted">넣을 파티 없음</span>')).join('');
  return `<div class="sec"><b>대기 중인 모험가</b><span>${free.length}명 · ${forP ? '이 파티에 넣어요' : '파티에 넣어 원정을 보내요'}</span></div>
    <div class="list free">${rows || '<div class="sub muted">모두 파티에 들어가 있어요.</div>'}</div>`;
}
// 대형: 출발할 때 근접 → 원거리 → 짐꾼·마법사·치유사 순으로 선다
const FORM_TXT = ['앞줄', '가운데', '뒷줄'];
const formTag = a => `<span class="tag muted">${FORM_TXT[formRank(a.cls)]}</span>`;
function partyCard(p) {
  const e = p.exp, on = S.view === p.id;
  const head = `<div class="row"><div class="grow"><div class="h">${esc(p.name)} <small>${p.members.length}명 · 전투원 ${fightersOf(p).length}/${fighterCap(p)} · 짐꾼 ${portersOf(p).length}/1${p.raidOnly ? ' · 레이드 전용' : ''}</small></div><div class="sub" data-pst="${p.id}"></div></div>${on ? '<span class="tag gold-t">화면에 표시 중</span>' : `<button type="button" class="btn sm" data-act="view" data-id="${p.id}">화면 보기</button>`}</div>`;
  const DM = { ask: '멈추고 묻기', enter: '바로 들어가기', skip: '지나가기' };
  const toggles = `<button type="button" class="btn sm${p.auto ? ' on' : ''}" data-act="auto" data-id="${p.id}">짐 차면 복귀 ${p.auto ? '켬' : '끔'}</button><button type="button" class="btn sm${p.safe ? ' on' : ''}" data-act="safe" data-id="${p.id}">위험하면 복귀 ${p.safe ? '켬' : '끔'}</button><button type="button" class="btn sm${p.campNight !== false ? ' on' : ''}" data-act="camp" data-id="${p.id}">밤에는 야영 ${p.campNight !== false ? '켬' : '끔'}</button><button type="button" class="btn sm${p.repeat ? ' on' : ''}" data-act="repeat" data-id="${p.id}">돌아오면 다시 출발 ${p.repeat ? '켬' : '끔'}</button><button type="button" class="btn sm${p.autoBuy ? ' on' : ''}" data-act="autobuy" data-id="${p.id}">보급품 모자라면 사기 ${p.autoBuy ? '켬' : '끔'}</button><button type="button" class="btn sm on" data-act="dmode" data-id="${p.id}">던전 앞에서: ${DM[p.dmode || 'ask']}</button>`;
  if (e) {
    const team = teamOf(p), F = FIELDS[e.field];
    const gate = e.wait === 'gate';
    return `<div class="card${on || gate ? ' hl' : ''}">${head}
      <div class="sub" data-pwhere="${p.id}"></div>
      ${(() => { const w = wxNow(e); if (w.indoor) return ''; const weak = teamOf(p).filter(a => wxtHits(a, w, foodFx(e))); return `<div class="row sub">${wxImg(w)}<span class="grow"><span class="${wxTCls(w)}">${wxLabel(w)}</span> · ${wxFxText(w, p)}${weak.length ? ` · <span class="red-t">이 날씨에 약함: ${weak.map(a => esc(a.name)).join('·')} -10% 더</span>` : ''}</span></div>`; })()}
      ${foodOf(e) ? `<div class="sub gold-t">도시락 ${FOODS[foodOf(e)].name} · ${foodFxText(FOODS[foodOf(e)].fx)}</div>` : ''}
      ${e.area === 'trade' ? `<div class="sub">${e.leg === 'back' ? `${KINGDOMS[e.trade.k].name}에서 ${g$(e.trade.sold || 0)}에 팔고 돌아오는 중` : `교역품 ${Object.values(e.cargo || {}).reduce((t, q) => t + q, 0)}개를 싣고 ${KINGDOMS[e.trade.k].name}(으)로`}</div>` : ''}
      <div class="bar big load"><i data-prog="${p.id}"></i></div>
      ${petOfParty(p) ? `<div class="row sub"><img class="peti" src="${monIconURL(petOfParty(p).stage ? PETS[petOfParty(p).kind].mon : 'pet_' + petOfParty(p).kind)}" alt=""><span class="grow">펫 ${esc(petOfParty(p).name)} <span class="muted">· ${petOfParty(p).stage ? PETS[petOfParty(p).kind].evo : PETS[petOfParty(p).kind].name} Lv${petOfParty(p).lv} · ${PET_ACT_NAME[PETS[petOfParty(p).kind].act]}</span></span></div>` : ''}
      ${gate ? `<div class="card special"><div class="h">${F.dungeon.name} 입구</div><div class="sub">던전은 한 번만 공략할 수 있어요. 몬스터 Lv${dungeonLv(F, 1)}~${dungeonLv(F, DUNGEON_FLOORS)}, 주인 Lv${dungeonBossLv(F)}. 파티 평균 Lv${Math.round(avgLvOf(p))}.</div><div class="btns"><button type="button" class="btn sm gold" data-act="gate" data-id="${p.id}" data-c="enter">들어가기</button><button type="button" class="btn sm" data-act="gate" data-id="${p.id}" data-c="skip">지나가기</button></div></div>` : ''}
      ${team.map(a => `<div class="row"><span class="sub" style="width:7.5em">${esc(a.name)} <span class="muted">Lv${a.lv}</span></span><div class="grow">${a.down ? `<span class="sub red-t">쓰러짐 · 들것에 실려 가는 중${a.inj ? ' (' + INJ[a.inj.sev].name + ')' : ''}</span>` : `<div class="bar hp"><i data-hp="${a.id}"></i></div><div class="bar mp"><i data-mp="${a.id}"></i></div><div class="bar fat"><i data-fat="${a.id}"></i></div><div class="bar slp"><i data-slp="${a.id}"></i></div>`}</div></div>`).join('')}
      <div class="row sub"><span class="grow">짐 <b data-load="${p.id}"></b> · 처치 <b data-kills="${p.id}"></b>${p.wagon ? ` · ${rigName(p)}` : ''}${F.treasure ? ` · 상자 ${e.chests || 0}` : ''}</span><span data-sup="${p.id}"></span></div>
      <div class="btns">${e.mode === 'advance' ? `<button type="button" class="btn sm" data-act="recall" data-id="${p.id}">복귀</button>` : ''}${toggles}</div></div>`;
  }
  const dest = p.raidOnly ? raidDestOf(p) : p.dest && isUnlocked(p.dest) ? p.dest : 'plains', DF = FIELDS[dest];
  const team = teamOf(p), block = team.map(cantGo).filter(Boolean);
  const cps = checkpoints(dest), st = cps.includes(p.start) ? p.start : 1;
  const cap = capOf(p), supW = wOf(p.sup);
  const fast = team.length ? team.slice().sort((x, y) => derive(y).move - derive(x).move)[0] : null;
  const tired = team.filter(a => (a.fat || 0) > FATIGUE.depart);
  const wagonList = S.bld.stable ? '' : ['cart'].map(w => { const W = WAGONS[w], own = p.wagon === w, back = wagonBack(p); return `<div class="li${own ? ' on' : ''}"><div class="grow"><span>${W.name} <span class="muted">짐 +${W.cap} · 이동 ×${W.spd}</span></span><span class="sub muted">${W.desc}</span></div>${own ? '<span class="tag gold-t">쓰는 중</span>' : `<button type="button" class="btn sm" data-act="wagon" data-id="${p.id}" data-w="${w}"${S.gold + back >= W.cost ? '' : ' disabled'}>${fmt(W.cost - back)}G</button>`}</div>`; }).join('');
  const hurt = team.some(a => a.hp < derive(a).maxHp * 0.7);
  const avg = Math.round(avgLvOf(p));
  const demon = DEMON_IDS, skyIds = SKY_IDS, dtab = p.raidOnly ? 'raid' : UI.destTab || (demon.includes(dest) ? 'demon' : skyIds.includes(dest) ? 'sky' : FIELDS[dest] && FIELDS[dest].trade ? 'trade' : 'base');
  const raids = dtab === 'base' || dtab === 'raid' ? (S.raid ? S.raid.list.filter(r => !r.done) : []).map(r => { const R = RAIDS[r.id], fid = 'raid_' + r.id, ok = avg >= R.lv - RAID_GAP;
    return `<button type="button" class="fbtn raid giant${dest === fid ? ' on' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>레이드 · ${R.name}</span><small>Lv${R.lv} · 남은 HP ${pct(r.hp, r.max)}%${ok ? '' : ` · 평균 Lv${R.lv - RAID_GAP}+`}</small></button>`; }).join('') : '';
  const fieldIds = dtab === 'trade' || dtab === 'raid' ? [] : dtab === 'demon' ? demon : dtab === 'sky' ? skyIds : ALL_FIELDS.filter(f => !demon.includes(f) && !skyIds.includes(f) && !FIELDS[f].hidden && (f !== 'alley' || isUnlocked('alley')));
  const fields = fieldIds.map(fid => {
    const F = FIELDS[fid], ok = isUnlocked(fid), fs = S.fields[fid];
    const nb = [1, 2, 3, 4, 5].filter(k => fs.boss && fs.boss[k]).length;
    const sub = F.raid ? '암살자 길드 토벌 · Lv28+ 권장' : ok ? `Lv${F.lv}~${fieldLv(F, FIELD_STAGES)} · 최고 ${F.no}-${fs.best || 0} · ${fs.cleared ? '던전★' : fs.found ? '던전 열림' : `보스 ${nb}/5`}${F.region === 'sky' ? (wagonFly(p) ? ` · ${rigName(p)}` : ' · 비행 마차 필요') : ''}` : (F.unlock || `상단 ${RANKS[Math.min(F.no - 1, RANKS.length - 1)].name}랭크에 열림`);
    return `<button type="button" class="fbtn${dest === fid ? ' on' : ''}${F.raid ? ' raid' : ''}${F.demon ? ' demon' : ''}${F.frontier ? ' front' : ''}${F.region === 'sky' ? ' skyf' : ''}" data-act="dest" data-id="${p.id}" data-f="${fid}"${ok ? '' : ' disabled'}><span>${F.name}</span><small>${sub}</small></button>`;
  }).join('') + (dtab === 'trade' ? tradeDestButtons(p, dest) : '') + (dtab === 'base' && !p.raidOnly ? (() => { const n = S.inv.tmap || 0, T = FIELDS.treasure; return `<button type="button" class="fbtn treasure${dest === 'treasure' ? ' on' : ''}" data-act="dest" data-id="${p.id}" data-f="treasure"${n ? '' : ' disabled'}><span>${T.name}</span><small>${n ? `보물 지도 ${n}장 · 파티 Lv${avg} 기준 ${TREASURE_FLOORS}층 · 상자와 수호자` : '보물 지도가 있어야 가요 (우두머리 4%·주인 8%)'}</small></button>`; })() : '');
  const destTabs = `<div class="tabs dest"><button type="button" class="tab${dtab === 'base' ? ' on' : ''}" data-act="desttab" data-t="base">필드</button><button type="button" class="tab${dtab === 'demon' ? ' on' : ''}" data-act="desttab" data-t="demon">${DEMON_NAME}${isUnlocked('swamp') ? '' : ' <small>잠김</small>'}</button><button type="button" class="tab${dtab === 'sky' ? ' on' : ''}" data-act="desttab" data-t="sky">${SKY_NAME}${isUnlocked('sky') ? '' : ' <small>잠김</small>'}</button><button type="button" class="tab${dtab === 'trade' ? ' on' : ''}" data-act="desttab" data-t="trade">교역</button></div>`;
  const last = p.last ? `<div class="sub muted">지난 원정: ${FIELDS[p.last.field] ? FIELDS[p.last.field].name : '?'}, 처치 ${p.last.kills}마리, 부속품 ${Object.values(p.last.got).reduce((s, q) => s + q, 0)}개${p.last.gear ? `, 장비 ${p.last.gear}개` : ''}</div>${p.last.stats && Object.keys(p.last.stats).length ? `<details class="card"><summary>지난 원정 전투 통계 <span class="muted">준 피해 · 받은 피해 · 치유 · 스킬 비중</span></summary><div class="bstats">${bstatRows(p.last.stats, p.last.names)}</div></details>` : ''}` : '';
  return `<div class="card${on ? ' hl' : ''}">${head}
    <div class="sec" style="margin-top:2px"><b>파티원</b><span>${team.length ? `${team.length}명 · 출발하면 앞줄·가운데·뒷줄 순` : '아래 대기 목록에서 넣어요'}</span></div>
    ${team.length ? '<div class="sub muted">근접은 앞줄, 원거리 딜러는 가운데, 짐꾼·마법사·치유사는 뒷줄에 서요. 앞줄이 적의 공격을 더 자주 받아요.</div>' : ''}
    <div class="list members">${team.slice().sort((x, y) => formRank(x.cls) - formRank(y.cls)).map(a => memberRow(a, `${formTag(a)}<button type="button" class="btn sm" data-act="member" data-id="${p.id}" data-a="${a.id}">빼기</button>`)).join('') || '<div class="sub muted">아직 아무도 없어요. 아래 대기 목록에서 모험가를 넣어 주세요.</div>'}</div>
    ${freeList(p)}
    ${S.bld.pen || S.pets.length ? petRow(p) : ''}
    <div class="sec"><b>보급품</b><span>물약과 치료 소모품 · 가져간 것만 써요</span></div>
    ${SUPPLY_IDS.filter(k => (S.inv[k] || 0) > 0 || (p.sup[k] || 0) > 0 || k === 'pot_s').map(k => `<div class="row">${iconImg(k)}<span class="grow sub">${ITEMS[k].name} <span class="muted">창고 ${S.inv[k] || 0}</span></span><span class="step"><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="-1">−</button><span>${p.sup[k] || 0}</span><button type="button" class="btn sm" data-act="sup" data-id="${p.id}" data-it="${k}" data-d="1">+</button></span></div>`).join('')}
    <div class="sec"><b>${p.raidOnly ? '도전할 레이드' : '목적지'}</b><span>파티 평균 Lv${avg}</span></div>
    ${p.raidOnly ? '' : destTabs}<div class="fields">${fields}${raids || (p.raidOnly ? '<div class="sub muted">이번 달에 도전할 수 있는 레이드가 없어요.</div>' : '')}</div>
    ${dtab === 'demon' && !isUnlocked('swamp') ? '<div class="sub muted">마계는 사라크 사막의 왕릉을 공략하면 열려요. 늪지대 → 메마른 땅 → 백작의 성 차례로 열려요.</div>' : ''}
    ${dtab === 'sky' ? `<div class="sub muted">${isUnlocked('sky') ? `구름섬은 비행 마차(비행장에서 제작)에 그리폰·와이번·페가수스를 맨 파티만 가요. ${wagonFly(p) ? `이 파티: ${rigName(p)} ✓` : `이 파티: ${p.wagon ? rigName(p) : '마차 없음'} ✗`}` : '구름섬은 세계수의 심장을 공략하고 비행장을 지으면 열려요. 비행 마차에 그리폰·와이번·페가수스를 매야 날아갈 수 있어요.'}</div>` : ''}
    ${dtab === 'trade' ? (DF.trade ? tradeInfo(p, dest) : '<div class="sub muted">교역: 말이 끄는 마차에 그 나라가 원하는 물건을 창고에서 싣고 가서 다 팔고, 그 나라 특산물을 싸게 사 와요. 위에서 나라를 골라요.</div>') : ''}
    ${DF.raid || DF.giant || DF.trade ? '' : `<div class="sec"><b>출발 거점</b><span>필드 보스를 쓰러뜨린 구간 다음부터</span></div><div class="btns">${[1, 11, 21, 31, 41].map(x => `<button type="button" class="btn sm${x === st ? ' on' : ''}" data-act="start" data-id="${p.id}" data-s="${x}"${cps.includes(x) ? '' : ' disabled'}>${DF.no}-${x} <span class="muted">Lv${fieldLv(DF, x)}</span></button>`).join('')}</div>`}
    <div class="sub">짐 한도 ${cap} · 물약이 ${supW} 차지${fast ? ` · 이동속도 ${(moveOf(p)).toFixed(1)} (가장 민첩한 ${esc(fast.name)} 기준${wagonOf(p) ? ', 마차 포함' : ''}${scoutMove(p) ? `, 정찰가 +${Math.round(scoutMove(p) * 100)}%` : ''})` : ''}${tentOf(p) > 1 ? ` · 야영은 텐트 (피로 회복 ×${tentOf(p)})` : ''}</div>
    ${wagonWhy(p) ? `<div class="sub red-t">${rigName(p)}: ${wagonWhy(p)}.</div>` : coachOf(p) && wagonOf(p) ? `<div class="sub ok-t">마부 ${esc(coachOf(p).name)}이(가) ${rigName(p)}을(를) 몰아요 · 마차 짐 +${Math.round((TR(coachOf(p)).wagon || 0) * 100)}%${TR(coachOf(p)).wagonSpd ? ` · 마차 속도 +${Math.round(TR(coachOf(p)).wagonSpd * 100)}%` : ''}</div>` : ''}
    ${portersOf(p).length > 1 ? '<div class="sub red-t">짐꾼 계열은 파티당 한 명만 넣을 수 있어요. 한 명을 빼야 출발해요.</div>' : ''}
    ${p.raidOnly ? '' : `<div class="row sub"><span class="grow">마차 · ${p.wagon ? `${rigName(p)} (짐 +${wagonCap(p) || WAGONS[p.wagon].cap} · 이동 ×${wagonSpd(p).toFixed(2)}${wagonWhy(p) ? ', 못 끎' : ''})${horseOf(p) ? ` · 끄는 ${horseOf(p).petName ? `펫 ${esc(horseOf(p).petName)}(${horseOf(p).name})` : horseOf(p).name}` : ''}` : '없음'}</span>${S.bld.stable ? `<button type="button" class="btn sm" data-act="bopen" data-id="stable" data-p="${p.id}">마구간 ›</button>` : ''}</div>`}
    ${S.bld.stable || p.raidOnly ? '' : `<details class="card"><summary>마차 · 손수레만 살 수 있어요 · 말이 끄는 마차는 마구간에서</summary><div class="sub muted">손수레는 파티가 직접 끌어요. 짐수레부터는 마구간을 짓고 말을 매야 하고, 짐꾼 계열이 파티에 있어야 끌어요.</div><div class="list">${wagonList}</div></details>`}
    ${hurt ? '<div class="sub red-t">다친 모험가가 있어요. 상단에 두면 체력이 서서히 차요.</div>' : ''}
    ${tired.length ? `<div class="sub warn">${tired.map(a => esc(a.name)).join(', ')}이(가) 지쳐 있어요. 상단에서 쉬면 피로가 풀려요.</div>` : ''}
    ${block.length ? `<div class="sub red-t">${block.map(esc).join('<br>')}</div>` : ''}
    <div class="sec"><b>도시락</b><span>출발할 때 하나를 들고 가요 · 원정 내내</span></div>
    ${foodPick(p)}
    ${last}
    ${partyWhy(p) ? `<div class="sub red-t">${partyWhy(p)}</div>` : ''}
    <div class="btns">${toggles}</div>${repeatChips(p)}
    ${presetBox(p)}
    <div class="btns"><button type="button" class="btn gold grow" data-act="go" data-id="${p.id}"${team.length && !block.length && isUnlocked(dest) && !partyWhy(p) ? '' : ' disabled'}>${DF.giant ? `${DF.name} 레이드 도전` : DF.trade ? `${KINGDOMS[DF.trade].name}(으)로 교역 출발` : `${DF.name}${DF.raid ? '' : ` ${DF.no}-${st}`}(으)로 출발`}</button><button type="button" class="btn" data-act="delparty" data-id="${p.id}">파티 삭제</button></div>
  </div>`;
}
function raidCard(r, full, send) {
  const R = RAIDS[r.id], st = raidStand(r), my = st.findIndex(x => x.me), dd = S.settleDay - today();
  const state = r.done === 1 ? '<span class="ok-t">쓰러짐</span>' : r.done === 2 ? '<span class="muted">떠남</span>' : `D-${dd} · 남은 HP ${pct(r.hp, r.max)}%`;
  const rows = (r.final || st.map(x => ({ n: x.n, d: Math.round(x.d), me: x.me }))).slice(0, full ? 8 : 3).map((x, i) => `<div class="row sub${x.me ? ' gold-t' : ''}"><span class="rkn">${i + 1}</span><span class="grow">${esc(x.n)}</span><span class="num">${fmt(x.d)}</span></div>`).join('');
  const mine = r.me > 0 ? `우리 상단 ${my + 1}위 · ${fmt(r.me)}` : '아직 도전하지 않았어요';
  return `<div class="card raidc" style="--rc:${R.c}"><div class="row"><span class="rbadge">Lv${R.lv}</span><div class="grow"><div class="h">${R.name}</div><div class="sub">${state} · ${mine}</div></div>${full ? '' : `<button type="button" class="btn sm" data-act="raidopen" data-id="${r.id}">순위</button>`}</div>
    <div class="bar big raid"><i style="width:${pct(r.hp, r.max)}%"></i></div>${rows}
    ${full ? `<div class="sub muted">${R.desc}</div>` : ''}${send ? raidSendRows(r) : ''}</div>`;
}
// 레이드 탭에서 바로 보내기: 파티마다 「도전」 단추 (원정 중·레벨 부족·못 가는 사람이 있으면 막힘)
function raidSendRows(r) {
  const R = RAIDS[r.id], fid = 'raid_' + r.id, need = R.lv - RAID_GAP;
  if (r.done) return '';
  const rows = S.parties.slice().sort((a, b) => (b.raidOnly ? 1 : 0) - (a.raidOnly ? 1 : 0)).map(p => {
    const team = teamOf(p), avg = Math.round(avgLvOf(p)), block = team.map(cantGo).filter(Boolean);
    const why = p.exp ? `원정 중 · ${whereStr(p.exp)}` : !team.length ? '파티원이 없어요' : avg < need ? `평균 Lv${need}+ 필요` : block.length ? block[0] : '';
    return `<div class="row sub rsend"><span class="grow">${esc(p.name)} <span class="muted">· ${team.length}명 · 평균 Lv${avg}</span>${why ? `<br><span class="red-t">${esc(why)}</span>` : ''}</span><button type="button" class="btn sm gold" data-act="raidgo" data-id="${p.id}" data-f="${fid}"${why ? ' disabled' : ''}>도전</button></div>`;
  }).join('');
  return `<div class="sec" style="margin-top:6px"><b>보낼 파티</b><span>평균 Lv${need}+ · 보급품은 파티 탭에서</span></div>${rows || '<div class="sub muted">파티가 없어요. 「+ 새 파티」로 만들어요.</div>'}`;
}
PANELS.raid = w => {
  const r = raidRec(w.r);
  if (!r) return '<div class="card"><div class="sub">이번 달 레이드가 아니에요.</div></div>';
  const R = RAIDS[r.id];
  const rew = RAID_REWARD.map((W, i) => `<div class="row sub"><span class="rkn">${i < 3 ? i + 1 + '위' : '참가'}</span><span class="grow">${fmt(Math.round(raidGold(R.lv) * W.gold))}G · 명성 ${W.fame} · 부속품 ${W.part}${W.heart ? ' · ' + ITEMS['rh_' + r.id].name : ''}${W.gear ? ` · ${QUALITY[W.gear].name} 장비` : ''}${W.rune >= 0 ? ` · ${RUNE_LV[W.rune]} 룬` : ''}${STONE_DROP.bloomstone.raidN[i] ? ` · 개화석 ${STONE_DROP.bloomstone.raidN[i]}` : ''} · 마법사의 돌 ${stonePct(STONE_DROP.wizstone.raidP[i])}</span></div>`).join('');
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
PANELS.exp = () => {
  raidPartyEnsure();
  const regs = regularParties(), rp = raidParty(), ids = regs.map(p => p.id);
  let tab = UI.expTab;
  if (rp && tab === rp.id) tab = 'raid';   // 레이드대는 레이드 탭에서 꾸린다
  if (tab !== 'raid' && !ids.includes(tab)) tab = ids.includes(S.view) ? S.view : ids[0] || 'raid';
  UI.expTab = tab; const top = winTop(); if (top && top.id === 'exp') top.tab = tab;
  const tabTxt = p => (p.exp ? esc(whereStr(p.exp)) : p.members.length ? `대기 · ${p.members.length}명` : '비어 있음');
  const bar = `<div class="tabs exp">${regs.map(p => `<button type="button" class="tab${tab === p.id ? ' on' : ''}" data-act="exptab" data-id="${p.id}">${esc(p.name)}<small>${tabTxt(p)}</small></button>`).join('')}${regs.length < partyMax() ? '<button type="button" class="tab add" data-act="newparty">+ 새 파티</button>' : ''}<button type="button" class="tab${tab === 'raid' ? ' on' : ''}" data-act="exptab" data-id="raid">레이드<small>${rp ? `레이드대 · ${rp.exp ? '도전 중' : `${rp.members.length}명`}` : S.raid ? `${S.raid.list.filter(r => !r.done).length}개` : '없음'}</small></button></div>`;
  if (tab === 'raid') {
    const rpBox = rp ? `<div class="sec" style="margin-top:0"><b>레이드 전용 파티</b><span>짐꾼 포함 ${RAID_FIGHTERS + 1}명까지 · 레이드에만 나가요</span></div>${partyCard(rp)}`
      : `<div class="card dim"><div class="h">레이드 전용 파티 <small>잠김</small></div><div class="sub">일반 파티 ${PARTY_MAX[RAID_PARTY_RANK]}개가 다 열린 뒤 상단이 ${RANKS[RAID_PARTY_RANK].name}랭크가 되면, 레이드에만 나가는 큰 파티 하나가 더 열려요. 짐꾼 계열을 빼고 ${RAID_FIGHTERS}명, 짐꾼 한 명을 더해 모두 ${RAID_FIGHTERS + 1}명까지.</div></div>`;
    return `${bar}${rpBox}<div class="sec"><b>이번 달 레이드</b><span>${S.raid ? `D-${S.settleDay - today()} · 파티를 골라 바로 보내요` : '없음'}</span></div>${S.raid ? S.raid.list.map(r => raidCard(r, false, true)).join('') : '<div class="card"><div class="sub">이번 달 레이드가 없어요.</div></div>'}${S.parties.length ? '' : '<div class="sub muted">파티를 먼저 만들어 주세요.</div>'}`;
  }
  const p = regs.find(x => x.id === tab);
  if (!p) return `${bar}<div class="card"><div class="sub">파티가 없어요. 「+ 새 파티」를 눌러 만들고 모험가를 넣어 주세요.</div></div>`;
  const allBtns = regs.length > 1 ? `<div class="btns"><button type="button" class="btn sm" data-act="allgo"${regs.some(x => !x.exp && x.members.length) ? '' : ' disabled'}>대기 파티 모두 출발</button><button type="button" class="btn sm" data-act="allback"${S.parties.some(x => x.exp && x.exp.mode === 'advance') ? '' : ' disabled'}>원정 파티 모두 복귀</button></div>` : '';
  return `${bar}${allBtns}${partyCard(p)}${regs.length >= partyMax() ? `<div class="sub muted">파티는 ${partyMax()}개까지${partyMax() >= PARTY_MAX[PARTY_MAX.length - 1] ? (rp ? ' · 레이드 전용 파티는 레이드 탭에서 꾸려요' : ` · ${RANKS[RAID_PARTY_RANK].name}랭크가 되면 레이드 전용 파티가 하나 더 열려요`) : ' · 상단 랭크가 오르면 더 만들 수 있어요'}.</div>` : ''}`;
};

/* 창고 */
PANELS.inv = () => {
  while (S.shop.slots.length < slotCount()) S.shop.slots.push(null);
  const tab = UI.invTab || 'mat', rate = guildRate();
  const keys = cat => Object.keys(S.inv).filter(k => ITEMS[k] && S.inv[k] > 0 && itemCat(k) === cat);
  const count = Object.assign(Object.fromEntries(INV_CATS.map(([id]) => [id, id === 'gear' ? S.gear.length : keys(id).length])), { stand: S.shop.slots.filter(Boolean).length });
  const bar = `<div class="tabs inv">${[['stand', '진열대']].concat(INV_CATS).map(([id, n]) => `<button type="button" class="tab${tab === id ? ' on' : ''}" data-act="invtab" data-id="${id}">${n}${count[id] ? `<small>${count[id]}</small>` : ''}</button>`).join('')}</div>`;
  if (tab === 'stand') return bar + invStands();
  // 칸 격자
  let cells = [], sel = UI.invSel, detail = '';
  const cell = (k, inner, q, on) => `<button type="button" class="cell${on ? ' on' : ''}${q === 0 ? ' zero' : ''}" data-act="invsel" data-id="${k}">${inner}${q != null ? `<b class="qty">${q}</b>` : ''}</button>`;
  if (tab === 'gear') {
    const gear = S.gear.slice().sort((x, y) => gearScore(y) - gearScore(x));
    cells = gear.map(g => cell('g' + g.id, gImg(g, 'ico lg q-b q' + g.q), null, sel === 'g' + g.id));
    const g = gear.find(x => 'g' + x.id === sel) || gear[0];
    if (g) { if (sel !== 'g' + g.id) cells[0] = cell('g' + g.id, gImg(g, 'ico lg q-b q' + g.q), null, true);
      detail = `<div class="card hl idet"><div class="row">${gImg(g, 'ico lg q-b q' + g.q)}<div class="grow stack"><span>${gearName(g)} ${qTag(g)}${runeDots(g)}</span><span class="sub">${statLine(gearStats(g))}</span><span class="sub muted">${clsList(GTYPES[g.base].cls)} · Lv${GTIERS[g.t].lv}+ · 무게 ${GTYPES[g.base].w} · 모험가 창에서 끼워요</span></div></div>
        ${(g.q || 0) >= 2 ? `<div class="sub">보너스 옵션: ${statLine(g.bonus || {}) || '없음'} <span class="muted">· 마탑에서 재감정 (${fmt(REAPPRAISE.fee(g.t))}G${ITEMS['crest_' + g.t] ? ` + ${ITEMS['crest_' + g.t].name} ${REAPPRAISE.crest}` : ''})${reappraiseWhy(g) ? ` · <span class="red-t">${reappraiseWhy(g)}</span>` : ''}</span></div>` : ''}
        <div class="btns">${S.bld.smithy ? `<button type="button" class="btn sm gold" data-act="enhopen" data-id="${g.id}">강화${g.plus ? ' +' + g.plus : ''}</button>` : ''}${(g.q || 0) >= 2 ? `<button type="button" class="btn sm" data-act="reapp" data-id="${g.id}"${reappraiseWhy(g) ? ' disabled' : ''}>재감정</button>` : ''}${runeSlots(g) ? `<button type="button" class="btn sm" data-act="runewin" data-g="${g.id}">룬 새기기</button>` : ''}<button type="button" class="btn sm" data-act="sellgear" data-id="${g.id}">팔기 ${fmt(Math.round(gearValue(g) * GEAR_SELL))}G</button></div></div>`; }
    else detail = '<div class="card"><div class="sub">보관 중인 장비가 없어요. 대장간에서 만들거나 원정에서 주워 와요.</div></div>';
  } else {
    const list = tab === 'sup' ? SUPPLY_IDS.concat(keys('sup').filter(k => !SUPPLY_IDS.includes(k))) : keys(tab).sort((a, b) => (tab === 'book' ? SKILLS[ITEMS[a].book].lv - SKILLS[ITEMS[b].book].lv : ITEMS[b].v - ITEMS[a].v));
    cells = list.map(k => cell(k, iconImg(k, 'ico lg'), S.inv[k] || 0, sel === k));
    const k = list.includes(sel) ? sel : list[0];
    if (k && sel !== k) cells[0] = cell(k, iconImg(k, 'ico lg'), S.inv[k] || 0, true);
    detail = k ? invDetail(k, rate) : `<div class="card"><div class="sub">${{ mat: '창고가 비어 있어요. 원정을 보내 부속품을 모아 오세요.', herb: '아직 약초가 없어요. 필드에서 싸운 뒤 가끔 주워 와요.', book: '스킬북이 없어요. 전리품·암시장·왕국 상단에서 얻어요.', rune: '룬이 없어요. 필드 보스와 던전에서 떨어져요.', food: '도시락이 없어요. 주방을 지으면 재료로 만들 수 있어요.', trade: '교역품이 없어요. 교역로로 이웃 나라에 가면 특산물을 싸게 사 와요.' }[tab] || ''}</div></div>`;
  }
  const minCells = 24, fill = Math.max(0, minCells - cells.length) + ((6 - (Math.max(cells.length, minCells) % 6)) % 6);
  for (let i = 0; i < fill; i++) cells.push('<span class="cell empty"></span>');
  const head = { mat: `부속품 ${count.mat}종 · 기준가 ${fmt(keys('mat').reduce((t, k) => t + ITEMS[k].v * S.inv[k], 0))}G어치 · 길드는 ${Math.round(rate * 100)}%에 사요`, herb: `약초 ${count.herb}종 · 처치와 연금술 공방 조제에 써요`, sup: `물약·치료 소모품 · 원정 보급품으로 가져가면 저절로 써요`, book: `스킬북 ${count.book}권 · 모험가 창에서 배워요 · 책마다 떨어뜨리는 몬스터가 정해져 있어요 (도감)`, rune: `룬 ${count.rune}종 · 장비의 룬 칸에 새겨요`, gear: `장비 ${count.gear}개 · 모험가 창에서 끼워요`, food: `도시락과 요리 재료 · 주방에서 만들고 원정대 창에서 골라요`, trade: `교역품 ${count.trade}종 · 상점에 진열하거나 원하는 나라에 팔면 남아요` }[tab];
  const bulk = tab === 'mat' && bulkMats().length ? `<div class="btns"><button type="button" class="btn sm" data-act="sellallmat">부속품 모두 팔기 · 약 ${g$(bulkMatValue())}</button></div>` : tab === 'gear' && bulkGears().length ? `<div class="btns"><button type="button" class="btn sm" data-act="selllowgear">일반·고급 장비 ${bulkGears().length}점 모두 팔기</button><button type="button" class="btn sm" data-act="autoeqall">모두 자동 장착</button></div>` : '';
  return `${bar}<div class="sub muted">${head || ''}</div>${bulk}<div class="igrid ${tab}">${cells.join('')}</div>${detail}`;
};
// 상점 진열대 탭
function invStands() {
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
  return `<div class="sec" style="margin-top:0"><b>상점 진열대</b><span>오늘 ${sold.n}개 · ${fmt(sold.g)}G 판매</span></div>
  <div class="sub">진열한 부속품과 장비는 손님이 조금씩 사 가요. 비싸게 걸수록 천천히 팔려요.</div>${slots}`;
}
// 고른 물건의 설명과 단추
function invDetail(k, rate) {
  const I = ITEMS[k], q = S.inv[k] || 0, cat = itemCat(k), one = Math.round(I.v * rate);
  let desc = I.desc || '', extra = '', btns = '';
  if (cat === 'mat') {
    const from = typeof itemFrom === 'function' ? itemFrom(k) : [];
    desc = desc || (from.length ? `떨어뜨리는 몬스터: ${from.join(', ')}` : I.boss === 1 ? '우두머리(필드 보스)가 남긴다' : I.boss === 2 ? '필드의 주인이 남긴다' : I.boss === 3 ? '던전 주인이 남긴다' : I.raid ? '레이드 등수 보상' : '');
    const mats = GTIERS.filter(T => T.mats.includes(k)).map(T => T.name), wants = KINGDOM_IDS.filter(x => KINGDOMS[x].wants.includes(k)).map(x => KINGDOMS[x].name.replace(/ .*/, ''));
    extra = [mats.length ? `장비 재료 (${mats.join('·')})` : '', wants.length ? `사 가는 왕국: ${wants.join(', ')}` : '', I.med ? `약재 처방 +${I.med * MED_MUL}` : ''].filter(Boolean).join(' · ');
  } else if (cat === 'herb') {
    const where = herbFields(k);
    extra = [where.length ? `자라는 곳: ${where.join(', ')}` : '', RECIPES.filter(r => r.need[k]).map(r => ITEMS[r.out].name).length ? `조제: ${RECIPES.filter(r => r.need[k]).map(r => ITEMS[r.out].name).join(', ')}` : '', k === 'herb' ? `부상 처치 ${HERB_USE}개 +${HERB_PTS}` : ''].filter(Boolean).join(' · ');
  } else if (cat === 'sup' && I.egg) {
    desc = I.desc; extra = `${FIELDS[PETS[I.egg].field] ? FIELDS[PETS[I.egg].field].name : ''}의 우두머리·던전 주인이 남겨요 · 상단에 두면 ${petHomeText(I.egg)}`;
    btns += `<button type="button" class="btn sm gold" data-act="bopen" data-id="pen">사육장에서 품기</button>`;
  } else if (cat === 'sup' && I.use) {
    desc = I.desc; extra = `${stoneFromText(k)} · 모험가 창의 특성에서 써요`;
  } else if (cat === 'sup') {
    desc = I.heal ? `HP ${Math.round(potionHeal(k))} 회복 (기본 ${I.heal}) · 다친 동료에게 저절로 써요` : I.mana ? `MP ${I.mana} 회복 · 마나가 바닥난 시전자에게 저절로 써요` : `${cureName(I.cure)} 치료 · ${I.desc || ''}`;
    const r = RECIPES.find(x => x.out === k);
    extra = r ? `연금술 공방 조제: ${Object.entries(r.need).map(([m, n]) => `${ITEMS[m].name} ${n}`).join(' · ')} · ${r.fee}G${S.bld.alchemy < r.lv ? ` (공방 ${r.lv}단계)` : ''}` : '';
    if (I.buy) btns += `<button type="button" class="btn sm gold" data-act="buy" data-it="${k}" data-q="1"${S.gold < buyPrice(k) ? ' disabled' : ''}>사기 ${buyPrice(k)}G</button><button type="button" class="btn sm gold" data-act="buy" data-it="${k}" data-q="5"${S.gold < buyPrice(k) * 5 ? ' disabled' : ''}>5개 ${buyPrice(k) * 5}G</button>`;
    if (r) btns += `<button type="button" class="btn sm" data-act="bopen" data-id="alchemy">공방에서 만들기</button>`;
  } else if (cat === 'book') {
    const s = SKILLS[I.book];
    desc = `${s.desc} · ${clsList(s.cls)} · Lv${s.lv}+ · ${costStr(s)}<br>${skillSpecLine(I.book)}`; extra = `${bookFromText(I.book)} · 모험가 창 → 스킬에서 배워요 (수업료 ${s.lv * 30}G)`;
  } else if (cat === 'rune') extra = `장비 탭 → 룬 새기기 · ${I.desc || ''}`;
  else if (cat === 'food' && I.dish) { const F = FOODS[I.dish]; desc = `${F.desc} · ${foodFxText(F.fx)}`; extra = `원정대 창에서 파티 도시락으로 골라요 · 주방 ${F.lv}단계: ${needStr(F.need)}`; if (S.bld.kitchen) btns += `<button type="button" class="btn sm" data-act="bopen" data-id="kitchen">주방에서 만들기</button>`; }
  else if (cat === 'food') { const uses = FOOD_IDS.filter(id => FOODS[id].need[k]).map(id => FOODS[id].name); extra = uses.length ? `들어가는 요리: ${uses.join(', ')}` : ''; if (KITCHEN_BUY[k] && S.bld.kitchen) btns += `<button type="button" class="btn sm gold" data-act="fbuy" data-k="${k}" data-n="5"${S.gold < KITCHEN_BUY[k] * 5 ? ' disabled' : ''}>주방에서 5개 ${KITCHEN_BUY[k] * 5}G</button>`; }
  if (I.trade) extra = `${KINGDOMS[I.trade].name} 특산물(교역품) · 그 나라에서 ${g$(tradeBuyPrice(I.trade, k))}에 산다${extra ? ' · ' + extra : ''}`;
  if (q > 0) btns += `<button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="1">길드에 팔기 ${one}G</button>${q > 1 ? `<button type="button" class="btn sm" data-act="sell" data-it="${k}" data-q="${q}">모두 ${fmt(one * q)}G</button>` : ''}`;
  if (cat === 'mat' || cat === 'herb') { const AS = S.autoSell || {}, on = AS[k] != null; btns += `<button type="button" class="btn sm${on ? ' on' : ''}" data-act="autosell" data-it="${k}">자동 판매 ${on ? '켬' : '끔'}</button>${on ? `<span class="step"><button type="button" class="btn sm" data-act="autokeep" data-it="${k}" data-d="-10">−</button><span>${AS[k]}개 남김</span><button type="button" class="btn sm" data-act="autokeep" data-it="${k}" data-d="10">+</button></span>` : ''}`; }
  return `<div class="card hl idet"><div class="row">${iconImg(k, 'ico lg')}<div class="grow stack"><span>${I.name} <b class="num">×${q}</b> <span class="muted">· 무게 ${I.w} · 기준가 ${I.v}G</span></span>${desc ? `<span class="sub">${desc}</span>` : ''}${extra ? `<span class="sub muted">${extra}</span>` : ''}</div></div>${btns ? `<div class="btns">${btns}</div>` : ''}</div>`;
}

/* 의뢰 */
PANELS.req = () => `
  <div class="sec"><b>의뢰 게시판</b><span>이틀마다 새 의뢰</span></div>
  <div class="card${autoReqOn() ? ' hl' : ''}"><div class="row"><div class="grow stack"><span>의뢰품 자동 전달 <span class="tag ${autoReqOn() ? 'ok-t' : 'muted'}">${autoReqOn() ? '켬' : '끔'}</span></span><span class="sub">창고에 의뢰품이 다 있으면 원정대가 돌아올 때와 날이 바뀔 때 저절로 전달해요. 장비 의뢰는 일반·고급의 강화 안 한 것만 내주고, 좋은 장비뿐이면 직접 전달해야 해요.</span></div><button type="button" class="btn sm${autoReqOn() ? ' on' : ''}" data-act="autoreq">${autoReqOn() ? '끄기' : '켜기'}</button></div></div>
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
  const html = (PANELS[top.id] || (() => ''))(top), key = top.id + ':' + (top.b || '') + ':' + (top.aid || '') + ':' + (top.tab || '') + ':' + UI.stack.length;
  if (force || html !== UI.html) {
    // 같은 창을 다시 그릴 때는 펼쳐 둔 목록을 그대로 둔다
    const box = $('panel-in'), open = key === UI.winKey ? [...box.querySelectorAll('details')].map(d => d.open) : [];
    if (!(key === UI.winKey && !force && patchParts(box, html))) { box.innerHTML = html; UI.parts = Object.fromEntries([...box.children].filter(e => e.dataset.part).map(e => [e.dataset.part, e.outerHTML])); }
    UI.html = html; UI.winKey = key;
    box.querySelectorAll('details').forEach((d, i) => { if (open[i]) d.open = true; });
    if (top.id === 'advd') $('win-title').textContent = winTitle(top);
  }
  live();
}
// 조각(data-part)으로 나뉜 창은 바뀐 조각만 갈아 끼운다 (애니메이션 캔버스·가로 스크롤을 지킨다). 못 하면 false
function patchParts(box, html) {
  const olds = [...box.children].filter(e => e.dataset.part);
  if (!olds.length || olds.length !== box.children.length) return false;
  const tpl = document.createElement('template'); tpl.innerHTML = html;
  const news = [...tpl.content.children].filter(e => e.dataset.part);
  if (news.length !== tpl.content.children.length || news.length !== olds.length || news.some((e, i) => e.dataset.part !== olds[i].dataset.part)) return false;
  // 살아 있는 조각은 그 사이 바뀌었을 수 있으니(캔버스 크기 등) 지난번 글자와 견준다
  const was = UI.parts || {}, now = {};
  news.forEach((e, i) => { const h = e.outerHTML; now[e.dataset.part] = h; if (h !== was[e.dataset.part]) olds[i].replaceWith(e); });
  UI.parts = now;
  return true;
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
  smithTab: d => { UI.smithTab = d.t; const top = winTop(); if (top) top.tab = d.t; renderPanel(true); },
  enhsel: d => { UI.enhG = +d.id; renderPanel(true); },
  enhance: d => { say(enhance(+d.id)); renderPanel(true); },
  enhopen: d => { UI.smithTab = 'enh'; UI.enhG = +d.id; openWin('b', { b: 'smithy', tab: 'enh' }); },
  reapp: d => { const r = gearAnyById(+d.id); if (!r) return; const g = r.g; confirmBox('옵션 재감정', `「${gearName(g)}」의 보너스 옵션(${statLine(g.bonus || {}) || '없음'})을 다시 뽑을까요? ${fmt(REAPPRAISE.fee(g.t))}G${ITEMS['crest_' + g.t] ? `와 ${ITEMS['crest_' + g.t].name} ${REAPPRAISE.crest}개` : ''}가 들고, 더 나빠질 수도 있어요.`, '재감정', () => { say(reappraise(+d.id)); renderPanel(true); saveGame(); }, false); },
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
  bopen: d => { if (d.p) UI.stableP = +d.p; openWin('b', { b: d.id }); if (BLD_FLOOR[d.id]) hqGo(BLD_FLOOR[d.id], true); },
  member: d => toggleMember(+d.id, +d.a),
  mapopen: d => { UI.mapP = +d.id; openWin('map'); },
  desttab: d => { UI.destTab = d.t; renderPanel(true); },
  sup: d => setSup(+d.id, d.it, +d.d),
  dest: d => { const p = findP(d.id); if (p) p.dest = d.f; },
  go: d => { const p = findP(d.id); if (!p) return; const m = startExp(p, p.raidOnly ? (p.dest = raidDestOf(p)) : p.dest && isUnlocked(p.dest) ? p.dest : 'plains'); if (m) say(m); else { S.view = p.id; renderChips(); say(`${p.name} 출발!`); } },
  raidgo: d => { const p = findP(d.id); if (!p || p.exp) return; p.dest = d.f; const m = startExp(p, d.f); if (m) say(m); else { S.view = p.id; renderChips(); say(`${p.name} 레이드 출발!`); } },
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
  newparty: () => { const r = createParty(); if (typeof r === 'string') say(r); else if (r && r.id) UI.expTab = r.id; else { const last = S.parties[S.parties.length - 1]; if (last) UI.expTab = last.id; } },
  exptab: d => { UI.expTab = d.id === 'raid' ? 'raid' : +d.id; const top = winTop(); if (top) top.tab = UI.expTab; renderPanel(true); $('panel') && ($('panel').scrollTop = 0); },
  delparty: d => { const p = findP(d.id); if (p) confirmBox('파티 삭제', `${p.name}을(를) 지울까요? 모험가는 상단에 남아요.`, '삭제', () => { deleteParty(p.id); renderPanel(true); renderChips(); }, true); },
  sell: d => sellGuild(d.it, +d.q),
  advcat: d => { UI.advCat = d.id; const top = winTop(); if (top) top.tab = d.id; renderPanel(true); $('panel') && ($('panel').scrollTop = 0); },
  advguest: () => { UI.advCat = 'guest'; openWin('adv'); },
  invtab: d => { UI.invTab = d.id; UI.invSel = null; const top = winTop(); if (top) top.tab = d.id; renderPanel(true); },
  ausfx: () => { auSet('sfx', !AU.sfx); renderPanel(true); },
  aubgm: () => { auSet('bgm', !AU.bgm); renderPanel(true); },
  auvol: d => { auSet('vol', Math.max(0, Math.min(1, Math.round((AU.vol + (+d.d)) * 10) / 10))); sfx('coin'); renderPanel(true); },
  autosell: d => { S.autoSell = S.autoSell || {}; if (S.autoSell[d.it] != null) delete S.autoSell[d.it]; else S.autoSell[d.it] = 0; changed(); renderPanel(true); },
  autokeep: d => { S.autoSell = S.autoSell || {}; S.autoSell[d.it] = Math.max(0, (S.autoSell[d.it] || 0) + (+d.d)); changed(); renderPanel(true); },
  autobuy: d => { const p = findP(d.id); if (p) { p.autoBuy = !p.autoBuy; renderPanel(true); } },
  hatch: d => say(hatch(d.k)),
  feed: d => say(feed(+d.id, d.it)),
  release: d => { const pt = petById(+d.id); if (pt) confirmBox('놓아주기', `${pt.name}을(를) 들판에 놓아줄까요? 되돌릴 수 없어요.`, '놓아주기', () => { say(releasePet(+d.id)); renderPanel(true); }, true); },
  setpet: d => { const m = setPartyPet(+d.id, +d.pet); if (m) say(m); renderPanel(true); },
  unpet: d => { setPartyPet(+d.id, 0); renderPanel(true); },
  invsel: d => { UI.invSel = d.id; renderPanel(true); },
  sellgear: d => sellGear(+d.id),
  buy: d => say(buy(d.it, +d.q)),
  slot: d => pickForSlot(+d.i),
  unslot: d => setSlot(+d.i, null),
  tier: d => { const s = S.shop.slots[+d.i]; if (s) { s.tier = +d.t; changed(); } },
  fulfill: d => say(fulfill(+d.id)),
  autoreq: () => { S.autoReq = !autoReqOn(); if (S.autoReq) { const n = autoFulfill(); if (n) say(`의뢰 ${n}개를 바로 전달했어요.`); } },
  export: () => openExport(),
  import: () => openImport(),
  slotsave: d => { const i = +d.i; if (slotInfo(i)) confirmBox('슬롯 덮어쓰기', `슬롯 ${i}의 저장을 지금 진행 상황으로 바꿀까요?`, '저장', () => { say(slotSave(i) || `슬롯 ${i}에 저장했어요`); renderPanel(true); }, false); else say(slotSave(i) || `슬롯 ${i}에 저장했어요`); },
  slotload: d => { const i = +d.i, o = slotInfo(i); if (!o) return; confirmBox('슬롯 불러오기', `지금 진행 상황을 슬롯 ${i}(${o.sum})으로 바꿀까요? 되돌릴 수 없어요.`, '불러오기', () => { const r = slotLoad(i); if (r) say(r); renderPanel(true); renderChips(); updateHud(); }, true); },
  slotclear: d => { const i = +d.i; confirmBox('슬롯 비우기', `슬롯 ${i}을(를) 비울까요?`, '비우기', () => { slotClear(i); renderPanel(true); }, true); },
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

const ACT_SFX = { sell: 'coin', sellgear: 'coin', buy: 'buy', bmbuy: 'buy', arbuy: 'buy', kingbuy: 'buy', merbuy: 'buy', kingsell: 'coin', craft: 'pot', smith: 'forge', enhance: 'forge', build: 'forge', hatch: 'buff', feed: 'pot', go: 'open', wavego: 'warn', retire: 'win', train: 'buff', learn: 'buff', promo: 'win', awaken: 'win', stone: 'buff', fulfill: 'coin', dest: 'ui', desttab: 'ui', invtab: 'ui', dextab: 'ui' };
function bindUI() {
  $('panel-in').addEventListener('click', e => {
    const b = e.target.closest('[data-act],[data-mact]');
    if (!b || b.disabled || !S) return;
    if (b.dataset.mact) { const top = winTop(); if (top && top.id === 'advd') advAct(top.aid, b); sfx(ACT_SFX[b.dataset.mact] || 'ui'); }
    else { ACT[b.dataset.act](b.dataset); sfx(ACT_SFX[b.dataset.act] || 'ui'); }
    achvTick();
    renderPanel(true); renderChips(); updateHud(); renderFloors(); saveGame();
  });
  $('menu').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b && S) menuOpen(b.dataset.open); });
  $('win-back').addEventListener('click', backWin);
  $('win-x').addEventListener('click', closeWins);
  $('floors').addEventListener('click', e => { const b = e.target.closest('[data-floor]'); if (b) { hqGo(b.dataset.floor); renderFloors(); } });
  $('pip').addEventListener('click', () => { if (S) openBattle(); });
  $('pip').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && S) { e.preventDefault(); openBattle(); } });
  // 전투 창: 뒤로·닫기, 복귀·던전 입구 단추
  $('bw-back').addEventListener('click', backWin);
  $('bw-x').addEventListener('click', backWin);
  $('bw-close').addEventListener('click', backWin);
  $('bw-stats').addEventListener('click', () => { V.bstats = !V.bstats; $('bw-stats').classList.toggle('on', V.bstats); $('bw-stats').textContent = V.bstats ? '기록' : '통계'; renderBattle(); });
  $('bwin').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled || !S) return;
    ACT[b.dataset.act](b.dataset);
    renderBattle(); renderChips(); updateHud(); saveGame();
  });
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

/* ───────── 펫: 사육장 창과 파티 칸 ───────── */
const petIcon = pet => `<img class="peti" src="${monIconURL(pet.stage ? PETS[pet.kind].mon : 'pet_' + pet.kind)}" alt="">`;
function petCard(pet, inParty) {
  const K = PETS[pet.kind], party = S.parties.find(x => x.pet === pet.id), need = petNeed(pet.lv), fedToday = pet.fed === today();
  const feeds = K.likes.map(it => `<button type="button" class="btn sm" data-act="feed" data-id="${pet.id}" data-it="${it}"${fedToday || !(S.inv[it] || 0) ? ' disabled' : ''}>${ITEMS[it].name} <span class="muted">${S.inv[it] || 0}</span></button>`).join('');
  return `<div class="card petc"><div class="row">${petIcon(pet)}<div class="grow stack"><span>${esc(pet.name)} <span class="muted">· ${pet.stage ? K.evo : K.name} Lv${pet.lv}${pet.lv >= PET_MAX_LV ? ' (최고)' : ''}</span>${pet.trait ? ` <span class="tag gold-t" title="${PET_TRAITS[pet.trait].desc}">${PET_TRAITS[pet.trait].name}</span>` : ''}</span><span class="sub">${PET_ACT_NAME[K.act]} · ${K.desc}${pet.stage ? '' : ` · Lv${PET_EVO_LV}에 ${K.evo}(으)로 진화`}</span><span class="sub muted">${party ? `${esc(party.name)}과 함께${party.exp ? ' 원정 중' : ''}` : `상단에서 ${petHomeText(pet.kind)}`} · 처치 ${fmt(pet.kills || 0)}</span></div></div>
    <div class="row sub"><span style="width:4em">경험치</span><div class="bar grow"><i style="width:${pet.lv >= PET_MAX_LV ? 100 : Math.round(pet.exp / need * 100)}%"></i></div><span class="num">${pet.lv >= PET_MAX_LV ? '—' : `${fmt(pet.exp)}/${fmt(need)}`}</span></div>
    <div class="row sub"><span style="width:4em">호감도</span><div class="bar grow aff"><i style="width:${Math.round((pet.aff || 0) / PET_AFF_MAX * 100)}%"></i></div><span class="num">${pet.aff || 0}/${PET_AFF_MAX}${pet.trait ? '' : ' · 가득 차면 특성'}</span></div>
    <div class="row wrap"><span class="sub muted">먹이${fedToday ? ' (오늘은 먹었어요)' : ' · 하루 한 번'}:</span>${feeds}${party && party.exp ? '' : `<button type="button" class="btn sm" data-act="release" data-id="${pet.id}">놓아주기</button>`}</div></div>`;
}
function penBox() {
  const P = petState(), eggs = Object.keys(S.inv).filter(k => ITEMS[k] && ITEMS[k].egg && S.inv[k] > 0);
  const inc = P.inc.map(x => `<div class="li">${iconImg('egg_' + x.kind)}<div class="grow stack"><span>${ITEMS['egg_' + x.kind].name}</span><span class="sub">${x.done - today() <= 0 ? '곧 태어나요' : `D-${x.done - today()} · 새벽에 태어나요`}</span></div></div>`).join('');
  const eggRows = eggs.map(k => { const why = hatchWhy(ITEMS[k].egg); return `<div class="li">${iconImg(k)}<div class="grow stack"><span>${ITEMS[k].name} <b class="num">×${S.inv[k]}</b></span><span class="sub">${PETS[ITEMS[k].egg].desc}</span>${why ? `<span class="sub red-t">${why}</span>` : ''}</div><button type="button" class="btn sm gold" data-act="hatch" data-k="${ITEMS[k].egg}"${why ? ' disabled' : ''}>품기</button></div>`; }).join('');
  const home = petsAtHome();
  return `<div class="sub">펫 ${S.pets.length}/${penCap()}마리 · 한 번에 ${S.bld.pen}개 품기 · ${PET_HATCH_DAYS}일이면 태어나요. 알은 필드 우두머리와 던전 주인이 가끔 남겨요.</div>
    <div class="sec"><b>품는 알</b><span>${P.inc.length}/${S.bld.pen}</span></div><div class="list">${inc || '<div class="sub muted">품고 있는 알이 없어요.</div>'}</div>
    <div class="sec"><b>창고의 알</b><span>${eggs.length}종</span></div><div class="list">${eggRows || '<div class="sub muted">알이 없어요. 필드 보스를 잡아 보세요.</div>'}</div>
    <div class="sec"><b>펫</b><span>상단에 남은 ${home.length}마리는 ${home.length ? home.map(x => petHomeText(x.kind)).filter((v, i, a) => a.indexOf(v) === i).join(', ') : '효과 없음'}</span></div>
    ${S.pets.map(pt => petCard(pt)).join('') || '<div class="card"><div class="sub muted">아직 펫이 없어요.</div></div>'}`;
}
function petRow(p) {
  const pet = petOfParty(p), free = S.pets.filter(x => !S.parties.some(q => q.pet === x.id));
  return `<div class="sec"><b>펫</b><span>파티마다 한 마리 · 상단에 남으면 집에서 돕는다</span></div>
    ${pet ? `<div class="li">${petIcon(pet)}<div class="grow stack"><span>${esc(pet.name)} <span class="muted">· ${pet.stage ? PETS[pet.kind].evo : PETS[pet.kind].name} Lv${pet.lv}</span></span><span class="sub">${PET_ACT_NAME[PETS[pet.kind].act]} · ${PETS[pet.kind].desc}</span></div><button type="button" class="btn sm" data-act="unpet" data-id="${p.id}">빼기</button></div>` : '<div class="sub muted">함께 가는 펫이 없어요.</div>'}
    ${free.length ? `<div class="btns">${free.map(x => `<button type="button" class="btn sm" data-act="setpet" data-id="${p.id}" data-pet="${x.id}">${petIcon(x)} ${esc(x.name)} Lv${x.lv}</button>`).join('')}</div>` : ''}`;
}

/* ───────── 수입 그래프: 최근 14일 수입·지출 ───────── */
function ledgerRows() {
  const L = (S.ledger || []).slice(), k = today();
  L.push({ day: k + 1, gold: S.gold, earned: S.stats.earned || 0, now: 1 });
  const out = [];
  for (let i = 1; i < L.length; i++) { const a = L[i - 1], b = L[i]; const inc = Math.max(0, b.earned - a.earned), net = b.gold - a.gold; out.push({ day: a.day, inc, out: Math.max(0, inc - net), net, now: !!b.now }); }
  return out.slice(-14);
}
function ledgerChartURL(rows) {
  const W = 352, H = 110, [cv, g] = mkCanvas(W, H);
  R(g, 0, 0, W, H, '#121620');
  const mx = Math.max(1, ...rows.map(r => Math.max(r.inc, r.out))), base = 92, n = rows.length, bw = Math.floor((W - 24) / Math.max(n, 7)), left = 18;
  for (let i = 1; i <= 3; i++) { const y = base - Math.round(i / 3 * 70); R(g, left, y, W - left - 4, 1, '#1e2634'); }
  rows.forEach((r, i) => {
    const x = left + i * bw, hi = Math.round(r.inc / mx * 70), ho = Math.round(r.out / mx * 70);
    R(g, x + 2, base - hi, Math.max(2, Math.floor(bw / 2) - 2), hi, r.now ? '#9ad8a0' : '#7bd36a');
    R(g, x + 2 + Math.floor(bw / 2), base - ho, Math.max(2, Math.floor(bw / 2) - 3), ho, r.now ? '#f08a8a' : '#e0503f');
    const p = dateParts(r.day * DAY_SEC); g.fillStyle = '#747d8e'; g.font = '9px sans-serif'; g.fillText(`${p.d}`, x + 3, H - 6);
  });
  R(g, left, base, W - left - 4, 1, '#46526a');
  g.fillStyle = '#747d8e'; g.font = '9px sans-serif'; g.fillText(fmt(mx), 2, 24); g.fillText('0', 6, base + 3);
  return cv.toDataURL();
}
function ledgerBox() {
  const rows = ledgerRows();
  if (!rows.length) return '';
  const inc = rows.reduce((s, r) => s + r.inc, 0), out = rows.reduce((s, r) => s + r.out, 0), net = rows.reduce((s, r) => s + r.net, 0);
  return `<div class="sec"><b>수입과 지출</b><span>최근 ${rows.length}일</span></div><div class="card"><img class="chart" src="${ledgerChartURL(rows)}" alt="수입 그래프"><div class="row sub"><span class="grow"><span class="ok-t">■</span> 수입 ${fmt(inc)}G · <span class="red-t">■</span> 지출 ${fmt(out)}G</span><span class="num ${net >= 0 ? 'ok-t' : 'red-t'}">순 ${net >= 0 ? '+' : ''}${fmt(net)}G</span></div><div class="sub muted">하루 평균 ${fmt(Math.round(inc / rows.length))}G 벌고 ${fmt(Math.round(out / rows.length))}G 써요${(S.stats.autoG || 0) ? ` · 자동 판매로 지금까지 ${fmt(S.stats.autoG)}G` : ''}. 마지막 막대는 오늘(진행 중).</div></div>`;
}
