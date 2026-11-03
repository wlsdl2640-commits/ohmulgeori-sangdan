/* ───────── 명예의 전당: Lv100 모험가를 은퇴시켜 동상을 세운다 ─────────
   동상마다 상단 전체에 영구 보너스(직업 계열별)와 경험치 +1%. 용사(각성)의 동상은 두 배. 은퇴한 모험가는 「스승」으로 남아 같은 계열 새 모험가의 봉급을 깎아 준다. */
const HALL_MAX = 12;
const HALL_LINE = {
  warrior: { name: '수호의 동상',  desc: 'HP +2% · 방어력 +2%',          hpPct: 0.02, defPct: 0.02 },
  archer:  { name: '명궁의 동상',  desc: '치명타 +1% · 회피 +1%',         crit: 0.01, eva: 0.01 },
  mage:    { name: '현자의 동상',  desc: '마법 공격력 +3%',                matkPct: 0.03 },
  cleric:  { name: '성자의 동상',  desc: '회복량 +3% · 받는 회복량 +2%',  healPow: 0.03, rheal: 0.02 },
  rogue:   { name: '대도의 동상',  desc: '전리품 +2% · 치명타 +1%',       luck: 0.02, crit: 0.01 },
  porter:  { name: '거인의 동상',  desc: '짐 +2 · 이동 속도 +2%',         carry: 2, movePct: 0.02 }
};
const hallList = () => (S && S.hall) || [];
// 동상들의 보너스 합 (traitSum에 더해진다)
function hallBonus(k) {
  let v = 0;
  for (const h of hallList()) { const L = HALL_LINE[h.base] || {}, m = h.hero ? 2 : 1; v += ((L[k] || 0) + (k === 'expPct' ? 0.01 : 0)) * m; }
  return v;
}
// 스승: 같은 계열 동상 수만큼 봉급 -3% (최대 -15%)
const mentorCut = cls => Math.min(0.15, 0.03 * hallList().filter(h => h.base === jobBase(cls)).length);
function retireWhy(a) {
  if (!a) return '';
  if (a.lv < MAX_LV) return `Lv${MAX_LV}이 되어야 은퇴할 수 있어요`;
  if (a.status !== 'idle' || a.post) return '상단에서 쉬고 있을 때만';
  if (a.inj) return '다 나은 뒤에';
  if (hallList().length >= HALL_MAX) return `전당이 가득 찼어요 (${HALL_MAX}개)`;
  return '';
}
function retire(id) {
  const a = advById(id), why = retireWhy(a);
  if (!a) return '';
  if (why) return why + '.';
  S.hall = S.hall || [];
  const h = { id: nid(), name: a.name, cls: a.cls, base: jobBase(a.cls), lv: a.lv, hero: !!a.hero, kills: a.kills || 0, traits: (a.traits || []).slice(0, 5), look: a.look, aid: a.id, day: today() };
  S.hall.push(h);
  S.parties.forEach(p => { p.members = p.members.filter(m => m !== a.id); });
  SLOTS.forEach(([sl]) => { const g = a.eq[sl]; if (g) { S.gear.push(g); a.eq[sl] = null; } });
  S.advs = S.advs.filter(x => x.id !== a.id);
  S.fame += h.hero ? 60 : 30;
  const L = HALL_LINE[h.base];
  log(`${a.name}이(가) 은퇴해 명예의 전당에 ${L.name}이(가) 세워졌다. ${L.desc}${h.hero ? ' (용사: 두 배)' : ''} · 명성 +${h.hero ? 60 : 30}`, 'good');
  queueModal({ title: '명예의 전당', body: [`${a.name}(${CLASSES[a.cls].name} Lv${a.lv}${h.hero ? ', 용사' : ''})이(가) 모험을 마치고 상단 앞뜰의 전당에 모셔졌다.`, `${L.name}: ${L.desc}${h.hero ? ' — 용사의 동상은 효과가 두 배다.' : ''} 동상마다 모든 모험가의 경험치도 1%씩 더 오른다.`, `${a.name}은(는) 스승으로 남아 ${CLASSES[h.base].name} 계열 모험가의 봉급을 3%씩 깎아 준다. 함께한 ${fmt(h.kills)}마리의 기록은 전당에 남는다.`] });
  changed();
  return '';
}
Object.assign(WIN_TITLE, { hall: '명예의 전당' });
function hallCard(h) {
  const L = HALL_LINE[h.base], fake = { id: h.aid, cls: h.cls, look: h.look || {}, eq: { weapon: { base: WEAPON_OF[h.cls] || 'sword', t: 8, q: 0 } }, hero: h.hero };
  return `<div class="card hallc${h.hero ? ' hl' : ''}"><div class="row"><img class="por" src="${portrait(fake)}" alt=""><div class="grow stack"><span>${esc(h.name)} <span class="muted">· ${CLASSES[h.cls].name} Lv${h.lv}</span>${h.hero ? ' <span class="tag gold-t">용사</span>' : ''}</span><span class="sub gold-t">${L.name} · ${L.desc}${h.hero ? ' ×2' : ''}</span><span class="sub muted">처치 ${fmt(h.kills)} · ${dayLabel(h.day)} 은퇴 · 특성 ${(h.traits || []).map(t => TRAITS[t] ? TRAITS[t].name : '').filter(Boolean).join('·') || '없음'}</span></div></div></div>`;
}
PANELS.hall = () => {
  const list = hallList(), cands = S.advs.filter(a => a.lv >= MAX_LV);
  const sum = {};
  for (const h of list) { const L = HALL_LINE[h.base], m = h.hero ? 2 : 1; for (const k in L) if (typeof L[k] === 'number') sum[k] = (sum[k] || 0) + L[k] * m; sum.expPct = (sum.expPct || 0) + 0.01 * m; }
  const HN = { hpPct: 'HP', defPct: '방어력', matkPct: '마법 공격력', expPct: '경험치', crit: '치명타', eva: '회피', healPow: '회복량', rheal: '받는 회복', luck: '전리품', carry: '짐', movePct: '이동 속도', atkPct: '공격력' };
  const sumTxt = Object.entries(sum).map(([k, v]) => `${HN[k] || STAT_NAMES[k] || k} ${k === 'carry' ? '+' + v : '+' + (Math.round(v * 1000) / 10) + '%'}`).join(' · ');
  return `<div class="card hl"><div class="h">명예의 전당 <small>${list.length}/${HALL_MAX}</small></div><div class="sub">Lv${MAX_LV} 모험가를 은퇴시키면 동상이 서고, 상단 전체가 영구히 강해져요. 은퇴한 모험가는 스승으로 남아 같은 계열의 봉급을 깎아 줘요.</div>${list.length ? `<div class="sub gold-t">지금 효과: ${sumTxt}</div>` : ''}</div>
    ${list.map(hallCard).join('') || '<div class="card"><div class="sub muted">아직 동상이 없어요.</div></div>'}
    <div class="sec"><b>은퇴할 수 있는 모험가</b><span>Lv${MAX_LV}</span></div>
    ${cands.map(a => { const why = retireWhy(a); return `<div class="li"><img class="por" src="${portrait(a)}" alt=""><div class="grow stack"><span>${esc(a.name)} <span class="muted">· ${CLASSES[a.cls].name} Lv${a.lv}</span>${a.hero ? ' <span class="tag gold-t">용사</span>' : ''}</span><span class="sub">${HALL_LINE[jobBase(a.cls)].name} · ${HALL_LINE[jobBase(a.cls)].desc}${a.hero ? ' ×2' : ''}</span>${why ? `<span class="sub red-t">${why}</span>` : ''}</div><button type="button" class="btn sm gold" data-act="retire" data-id="${a.id}"${why ? ' disabled' : ''}>은퇴</button></div>`; }).join('') || `<div class="sub muted">Lv${MAX_LV}에 닿은 모험가가 아직 없어요.</div>`}`;
};
Object.assign(ACT, {
  retire: d => { const a = advById(+d.id); if (!a) return; confirmBox('은퇴', `${a.name}을(를) 은퇴시켜 동상을 세울까요? 모험가는 상단을 떠나고, 장비는 창고로 돌아와요. 되돌릴 수 없어요.`, '은퇴', () => { say(retire(+d.id)); renderPanel(true); renderChips(); saveGame(); }, true); }
});
