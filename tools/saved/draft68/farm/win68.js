// 재배소 창 시안 (게임 창 틀에 내용만 바꿔 넣음)
S.bld.kitchen = 1; S.modals = []; { const m = document.querySelector('#modal'); if (m) m.style.display = 'none'; }
openWin('b', { b: 'kitchen' }); document.querySelector('#win-title').textContent = '재배소';
const HN = k => ITEMS[k].name, tierOf = k => ({ herb: 0, waterherb: 0, snowherb: 0, fireherb: 0, ethermoss: 1, boltbranch: 1, bloodshroom: 1, moonflower: 2, mandrake: 2 })[k];
const TN = ['하급', '중급', '최상급'], DAYS = [1, 2, 4], GET = ['3개', '2~3개', '1~2개'];
const plots = [['herb', 1, 0], ['herb', 0.6, '내일 아침'], ['waterherb', 0.5, '12시간'], ['fireherb', 1, 0], ['snowherb', 0.1, '1일'], [null]];
const cell = (k, g) => `<span class="cell rq${g}" style="width:30px;height:30px;display:inline-block;flex:none">${rqArt(iconURL(k), g, 1)}</span>`;
const bar = (f, ok) => `<span style="display:block;height:6px;margin-top:3px;background:#1a1410;border:1px solid #4a3a2a"><i style="display:block;height:100%;width:${Math.round(f * 100)}%;background:${ok ? '#e8c040' : '#5aa83a'}"></i></span>`;
const rows = plots.map(([k, f, left], i) => {
  if (!k) return `<div class="li"><span class="cell empty" style="width:30px;height:30px;display:inline-block;flex:none">${rqEmpty(1)}</span><div class="grow stack"><span>밭 ${i + 1} · 빈 밭</span><span class="sub muted">창고의 약초 하나를 모종으로 심어요</span></div><button type="button" class="btn sm">심기</button></div>`;
  const t = tierOf(k), ok = f >= 1;
  return `<div class="li">${cell(k, itemGrade(k))}<div class="grow stack"><span>밭 ${i + 1} · ${HN(k)} <span class="muted">${TN[t]}</span></span><span class="sub ${ok ? 'gold-t' : ''}">${ok ? `다 자랐어요 · ${GET[t]} 거둠` : f < 0.2 ? `새싹 · ${left} 남음` : `자라는 중 · ${left} 남음`}</span>${bar(f, ok)}</div>${ok ? '<button type="button" class="btn sm gold">거두기</button>' : '<button type="button" class="btn sm" disabled>기다림</button>'}</div>`;
}).join('');
const pick = ['herb', 'waterherb', 'snowherb', 'fireherb', 'ethermoss', 'boltbranch', 'bloodshroom', 'moonflower', 'mandrake'].map((k, i) => {
  const t = tierOf(k), lock = t > 1, n = [6, 2, 1, 3, 1, 0, 1, 0, 0][i];
  return `<button type="button" class="cell rq${itemGrade(k)}${n ? '' : ' zero'}" style="${lock ? 'opacity:.45' : ''}">${rqArt(iconURL(k), itemGrade(k), 2)}<b class="qty">${lock ? 'Lv3' : n}</b></button>`;
}).join('');
document.querySelector('#panel-in').innerHTML = `
<div class="card"><div class="row"><div class="grow"><div class="h">재배소 1 <small>Lv2</small></div><div class="sub">비닐하우스에서 약초를 기른다 · 밭 6칸 · 중급 약초까지</div></div><button type="button" class="btn sm">강화 30,000G</button></div>
<div class="sub muted">Lv3: 밭 8칸 · 최상급 약초(달빛꽃 · 만드라고라)도 심는다</div></div>
<div class="sec"><b>밭</b><span>6칸 · 다 자람 2</span></div>
<div class="list">${rows}</div>
<div class="row" style="gap:6px;margin:6px 0"><button type="button" class="btn gold" style="flex:1">모두 거두기 (2)</button><button type="button" class="btn on" style="flex:1">✓ 거두면 다시 심기</button></div>
<div class="sec"><b>심을 약초</b><span>모종 = 창고의 그 약초 하나</span></div>
<div class="igrid">${pick}</div>
<div class="sub muted">하급 1일 → 3개 · 중급 2일 → 2~3개 (Lv2) · 최상급 4일 → 1~2개 (Lv3) · 상단에 둔 약초 펫은 수확 +%</div>
<div class="row" style="gap:6px;margin-top:10px;justify-content:center"><button type="button" class="pchip on"><i class="dot go"></i>재배소 1</button><button type="button" class="pchip"><i class="dot go"></i>재배소 2</button><button type="button" class="pchip" style="opacity:.72;border-style:dashed">＋ 3동 짓기 50,000G · A랭크</button></div>`;
1
