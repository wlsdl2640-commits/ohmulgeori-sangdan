// 사육장 · 알 · 펫 레어도 시안 + 도감 요리 탭 시안 (창 틀에 내용만 바꿔 넣음)
S.modals = []; { const m = document.querySelector('#modal'); if (m) m.style.display = 'none'; }
const ICO = window.__ICO68;
for (const k of Object.keys(ICO)) if (!URL_CV.has(ICO[k].url)) { const im = new Image(); im.src = ICO[k].url; }
const petIco = {};
function petURL(kind) {
  if (petIco[kind]) return petIco[kind];
  const id = 'pet_' + kind, s = PXU[id] ? pxuSprite(id, 'idle', 0) : pxMonSprite(PXM[id] || PXG[id] ? id : 'rat', 0), [c, x] = mkCanvas(20, 20);
  x.drawImage(s.cv, Math.round((20 - s.w) / 2), 20 - s.h - 1); return (petIco[kind] = keepCv(c));
}
const QN = g => `<b style="color:${QUALITY[g].c}">${QUALITY[g].name}</b>`;
const css = document.createElement('style'); css.textContent = `
 .d68q{position:absolute;left:4px;top:2px;font:bold 22px Galmuri11,sans-serif;color:#fff8d8;text-shadow:2px 0 0 #3a1a0a,-2px 0 0 #3a1a0a,0 2px 0 #3a1a0a,0 -2px 0 #3a1a0a}
 .cell{position:relative}
 .d68lad{display:flex;gap:3px;margin:6px 0 2px}.d68lad span{flex:1;text-align:center;padding:3px 0;border:2px solid #4a3a2a;background:#1e1814;color:#a89a88;font-size:12px}
 .d68lad span.on{border-color:#e8c040;color:#ffe9a0;background:#3a2c14}.d68lad span.past{color:#d8ccb8}
 .d68pets .li{align-items:center}.d68pets .cell{width:60px;height:60px;flex:none}
 .d68bar{display:block;height:6px;margin-top:3px;background:#1a1410;border:1px solid #4a3a2a}.d68bar i{display:block;height:100%;background:#5aa83a}
`; document.head.appendChild(css);
const egg = (k, n, q) => `<button type="button" class="cell rq3">${rqArt(iconURL('egg_' + k), 3, 2)}${q ? '<b class="d68q">?</b>' : ''}${n != null ? `<b class="qty">${n}</b>` : ''}</button>`;
window.D68PEN = {
  win() {
    S.bld.pen = 3; openWin('b', { b: 'pen' }); document.querySelector('#win-title').textContent = '사육장';
    const lad = [30, 40, 50, 60, 70].map((p, i) => `<span class="${i === 2 ? 'on' : i < 2 ? 'past' : ''}">Lv${i + 1}<br>${p}%</span>`).join('');
    const inc = [['wyvern', 0.5, '내일 아침 판정'], ['wolf', 0.85, '오늘 밤 판정']].map(([k, f, w]) => `<div class="li">${egg(k, null, 1)}<div class="grow stack"><span>${MONS[PETS[k].mon].name} 알 (?)</span><span class="sub">품는 중 · ${w}</span><span class="d68bar"><i style="width:${f * 100}%"></i></span></div></div>`).join('')
      + `<div class="li"><span class="cell empty" style="width:60px;height:60px;flex:none">${rqEmpty(2)}</span><div class="grow stack"><span>빈 둥지</span><span class="sub muted">창고의 알을 품어요 · 2일 뒤 판정</span></div><button type="button" class="btn sm gold">알 품기</button></div>`;
    const store = [['slime', 2], ['wolf', 1], ['golem', 1], ['griffon', 1]].map(([k, n]) => egg(k, n, 1)).join('') + `<button type="button" class="cell rq1">${rqArt(ICO.egg_none.url, 1, 2)}<b class="qty">3</b></button>`;
    const pets = [['wyvern', '보리', 3, 30, '폭풍 와이번 (진화)'], ['griffon', '별이', 4, 6, '아기 그리폰'], ['wolf', '콩이', 2, 24, '늑대 (진화)'], ['golem', '두두', 1, 15, '골렘 조각'], ['slime', '모모', 0, 12, '슬라임 새끼']].map(([k, nm, g, lv, what]) => {
      const pw = Math.round((10 + 6 * lv) * (lv >= 20 ? 1.8 : 1) * PETS[k].pow * [1, 1.1, 1.25, 1.45, 1.7, 2][g]);
      return `<div class="li"><span class="cell rq${g}">${rqArt(petURL(k), g, 2)}</span><div class="grow stack"><span>${QN(g)} ${nm} <span class="muted">${what}</span></span><span class="sub">Lv ${lv}/30 · 힘 ${pw} · 상단: ${petHomeText(k)} ×${[1, 1.1, 1.25, 1.45, 1.7, 2][g]}</span><span class="d68bar"><i style="width:${lv / 30 * 100}%;background:${lv >= 30 ? '#e8c040' : '#5aa83a'}"></i></span></div></div>`;
    }).join('');
    document.querySelector('#panel-in').innerHTML = `
      <div class="card"><div class="row"><div class="grow"><div class="h">사육장 <small>Lv3</small></div><div class="sub">알을 품어 펫을 기른다 · 한 번에 3개 · 펫 8칸</div></div><button type="button" class="btn sm">강화 30,000G</button></div>
      <div class="d68lad">${lad}</div><div class="sub muted">부화 확률 = 품은 알이 유정란일 확률 · 무정란이면 요리 재료 「무정란」이 된다</div></div>
      <div class="sec"><b>품는 알</b><span>2/3</span></div><div class="list">${inc}</div>
      <div class="sec"><b>창고의 알</b><span>유정란인지는 품어 봐야 알아요</span></div><div class="igrid">${store}</div>
      <div class="sec"><b>펫</b><span>5/8 · 만렙 30 · 진화 Lv20</span></div><div class="list d68pets">${pets}</div>`;
  },
  modal(kind) {
    const m = document.querySelector('#modal'); m.style.display = 'grid';
    if (kind === 'ok') {
      document.querySelector('#m-title').textContent = '유정란이었어요!';
      document.querySelector('#m-body').innerHTML = `<div style="display:flex;justify-content:center;margin:4px 0 8px"><span class="cell rq3" style="width:60px;height:60px">${rqArt(petURL('wyvern'), 3, 2)}</span></div><p style="text-align:center">${QN(3)} 아기 와이번 「보리」가 태어났어요.</p><p class="sub" style="text-align:center">레어도 영웅 — 힘과 상단 효과 ×1.45 · Lv20에 폭풍 와이번으로 진화 · Lv30이면 용기수 전직에 데려갈 수 있다</p>`;
    } else {
      document.querySelector('#m-title').textContent = '무정란이었어요…';
      document.querySelector('#m-body').innerHTML = `<div style="display:flex;justify-content:center;margin:4px 0 8px"><span class="cell rq1" style="width:60px;height:60px">${rqArt(ICO.egg_none.url, 1, 2)}</span></div><p style="text-align:center">늑대 알은 깨어나지 않았어요. 요리 재료 「무정란」 1개를 창고에 넣었어요.</p><p class="sub" style="text-align:center">사육장 Lv3 부화 확률 50% · 강화하면 Lv5에서 70%</p>`;
    }
    document.querySelector('#m-btns').innerHTML = '<button type="button" class="btn gold">확인</button>';
  },
  sheet() {
    openWin('b', { b: 'pen' }); document.querySelector('#win-title').textContent = '식재료 · 요리 그림 시안';
    const cellL = k => `<div style="width:62px;text-align:center"><span class="cell rq${ICO[k].grade}" style="width:60px;height:60px;display:inline-block">${rqArt(ICO[k].url, ICO[k].grade, 2)}</span><div class="sub" style="font-size:11px;line-height:1.2;margin-top:1px;word-break:keep-all">${ICO[k].name}</div></div>`;
    const grp = (src, t, w) => { const ks = Object.keys(ICO).filter(k => ICO[k].src === src); return `<div style="${w ? 'width:' + w + 'px;' : ''}margin:4px 0"><div class="sub" style="color:#e8c870;font-size:12px;margin:2px 0">${t}</div><div style="display:flex;flex-wrap:wrap;gap:4px 2px">${ks.map(cellL).join('')}</div></div>`; };
    const row = h => `<div style="display:flex;flex-wrap:wrap;gap:0 6px">${h}</div>`;
    document.querySelector('#panel-in').innerHTML = `<div class="sec"><b>하르겐 시장</b><span>늘 · 일반 · 기본 재료 넷은 새 그림</span></div>${row(grp('hargen', '', 0))}
      <div class="sec"><b>나라 특산 채소</b><span>왕국 마차가 상단에 올 때 · 고급</span></div>${row(grp('inglisia', '잉그리시아', 128) + grp('frama', '프라마', 128) + grp('elves', '엘프 실바레아', 128) + grp('dwarves', '드워프 브론하임', 128) + grp('sarak', '사라크 술탄국', 128))}
      <div class="sec"><b>해상왕국 해산물</b><span>교역 원정으로만 · 희귀</span></div>${row(grp('sea', '', 0))}
      <div class="sec"><b>무정란 · 요리</b><span>사육장 판정 · 새 요리 그림</span></div>${row(grp('pen', '사육장', 70) + grp('kitchen', '요리 (고기 스튜 · 감자 오믈렛 · 해물 수프 · 수상한 죽)', 270))}`;
  },
  hide() { document.querySelector('#modal').style.display = 'none'; },
  dex() {
    openWin('dex'); const pi = document.querySelector('#panel-in');
    const tabs = pi.querySelector('.tabs'); const tabHTML = tabs ? tabs.outerHTML.replace(/ on"/g, '"').replace('</div>', '<button type="button" class="tab on">요리<small>3</small></button></div>') : '';
    const found = [['food_stew', '고기 스튜', ['raw_meat', 'raw_meat', 'hg_potato', 'hg_carrot'], '공격 +12% · 최대 HP +5%', 1, 3], ['food_omelet', '감자 오믈렛', ['egg_none', 'egg_none', 'hg_potato', 'hg_onion'], '최대 HP +10% · 피로 10% 덜', 1, 1], ['food_seasoup', '해물 수프', ['sea_mackerel', 'sea_shrimp', 'sea_clam', 'hg_onion'], '마법 공격 +10% · 최대 HP +5%', 3, 2]];
    const mini = k => `<img src="${ICO[k] ? ICO[k].url : iconURL(k)}" style="width:20px;height:20px;image-rendering:pixelated;vertical-align:middle">`;
    const cards = found.map(([k, nm, need, fx, lv, n]) => `<div class="li"><span class="cell rq${ICO[k].grade}" style="width:60px;height:60px;flex:none">${rqArt(ICO[k].url, ICO[k].grade, 2)}</span><div class="grow stack"><span>${nm} <span class="muted">주방 Lv${lv} · ${n}번 만듦</span></span><span class="sub">${need.map(mini).join(' ')}</span><span class="sub gold-t">${fx}</span></div><button type="button" class="btn sm">레시피로 넣기</button></div>`).join('')
      + [[4, 2], [5, 3], [3, 1], [6, 3]].map(([n, lv]) => `<div class="li" style="opacity:.8"><span class="cell" style="width:60px;height:60px;flex:none">${rqArt(ICO.food_stew.url.replace(/.*/, '') || null, 0, 2).replace('class="rqa', 'style="filter:brightness(0.25)" class="rqa')}</span><div class="grow stack"><span>??? <span class="muted">주방 Lv${lv}</span></span><span class="sub">${'<b style="display:inline-block;width:14px;height:14px;margin-right:4px;border:2px solid #6a5a48;background:#1a1410"></b>'.repeat(n)}재료 ${n}가지</span><span class="sub muted">솥에 직접 넣어 찾아요</span></div></div>`).join('');
    pi.innerHTML = `${tabHTML}<div class="sec"><b>요리 레시피</b><span>3/26 찾음 · 수상한 죽 1번</span></div><div class="sub muted">요리 화면의 구리솥에 재료를 넣어 맞는 조합을 찾으면 여기에 적혀요. 못 찾은 칸은 재료 수와 주방 레벨만 보여요.</div><div class="list">${cards}</div>`;
  }
};
1
