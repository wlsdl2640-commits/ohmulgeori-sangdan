S.bld.kitchen = 1; S.modals = []; { const m = document.querySelector('#modal'); if (m) m.style.display = 'none'; }
const ICO = window.__ICO68;
openWin('b', { b: 'kitchen' }); document.querySelector('#win-title').textContent = '항구';
const sea = [['sea_mackerel', 216, 8], ['sea_shrimp', 192, 10], ['sea_clam', 180, 6], ['sea_crab', 270, 4], ['sea_squid', 210, 6], ['sea_kelp', 180, 12]];   // 11-12 20:26 사용자 「식재료들 가격 3배」
const cell = (k, g) => `<span class="cell rq${g}" style="width:60px;height:60px;flex:none">${rqArt(ICO[k].url, g, 2)}</span>`;
const rows = sea.map(([k, p, n]) => `<div class="li">${cell(k, ICO[k].grade)}<div class="grow stack"><span>${ICO[k].name} <span class="muted">해산물 · 희귀</span></span><span class="sub">${ICO[k].desc}</span><span class="sub gold-t">${p}G · 남은 수 ${n}</span></div><div class="stack" style="gap:3px"><button type="button" class="btn sm gold">사기</button><button type="button" class="btn sm">×5</button></div></div>`).join('');
const recs = [['해물 수프', '은빛 고등어 · 붉은 새우 · 가리비 · 하르겐 양파', 0], ['해상왕의 만찬', '꽃게 · 붉은 새우 · 가리비 · 은빛 고등어 · 오징어 · 향신료', 0], ['다시마 국', '다시마 2 · 가리비 · 무정란', 1], ['꽃게 찜', '꽃게 2 · 바위 마늘 · 모래 고추', 0]];
const rrows = recs.map(([nm, need, known]) => `<div class="li" style="${known ? 'opacity:.55' : ''}">${cell('recipe', 3)}<div class="grow stack"><span>${nm} 레시피 <span class="muted">${known ? '이미 앎' : '사면 도감에 적힘'}</span></span><span class="sub">${need}</span><span class="sub gold-t">100,000G</span></div><button type="button" class="btn sm ${known ? '' : 'gold'}" ${known ? 'disabled' : ''}>${known ? '앎' : '사기'}</button></div>`).join('');
document.querySelector('#panel-in').innerHTML = `
<div class="card"><div class="row"><div class="grow"><div class="h">해상왕국 코랄리아의 배 <small>산호호</small></div><div class="sub">오늘 밤 떠나요 · 다음 배는 4 ~ 6일 뒤 (배가 오면 소식에 알려요)</div></div></div>
<div class="sub muted">항구는 처음부터 열려 있는 시설 — 해산물은 이 배에서만 살 수 있어요</div></div>
<div class="sec"><b>해산물</b><span>상하지 않아요</span></div><div class="list">${rows}</div>
<div class="sec"><b>레시피</b><span>해산물이 들어가는 요리 · 하나에 100,000G</span></div><div class="list">${rrows}</div>`;
1
