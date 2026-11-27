/* ───────── 등급 부속품 · 마물육 (빌드 72 · 11-21 13:21 사용자) ─────────
   부속품은 세 갈래가 된다:
   ① 등급 부속품 — 마정석과 같은 여섯 등급(최하급 ~ 최상급). 장비를 만드는 바탕 재료. 그 재료가 나올 법한 몬스터 모두가 떨어뜨리고, 등급은 몬스터 레벨대로(Lv 30마다 한 등급 — 마정석과 같음).
      사용자가 정한 것: 가죽(짐승) · 비늘 셋(파충류 · 용족 · 어류) · 이끼 · 거미줄. 광물(골렘 · 광물을 품은 몬스터). 내가 더한 것(「너가 더 추천해서 넣어줘」): 뼈 · 갑각 · 목재 · 섬유 · 깃털.
   ② 마물육 — 몬스터마다 하나씩, 먹을 수 있는 부위(들쥐 고기 · 뿔토끼 안심살 …, 슬라임이면 젤리, 내장일 수도). 허수아비는 벼. 사람 꼴(엘프 라헨)은 없음.
   ③ 고유 부속품 — 그 몬스터의 특징을 보여 주는 예전 부속품(쥐꼬리 · 뿔토끼 뿔 …)은 그대로. 나중에 더해질 수 있다.
   · 드랍은 core.js kill의 갈무리 안에서 matDrop — 모두 필수 드랍(짐꾼이 없으면 30% 규칙을 받는다).
   · 아직: 이 재료를 쓰는 제작법(장비 제작 손보기 때) · 마물육을 쓰는 요리(지금 요리는 예전 「날고기」 그대로 — 날고기 드랍도 그대로 둠) · 그림(GPT — tools/saved/gpt70/mats/). */
const MAT72_ON = true;
// 11-21 13:32 사용자 「모든 부속품은 필수 드랍 · 마정석도 필수 드랍 · 스킬북이나 다른 종류의 아이템만 확률 드랍」: 몬스터 고유 부속품(MONS.drops 가운데 부속품 칸 물건) · 등급 부속품 · 마물육은 늘 나온다.
// 약초 · 날고기 · 알 · 스킬북 · 돌 · 지도 같은 것은 예전 확률 그대로. 짐꾼이 없을 때의 30% 규칙(job72.js)은 그대로 받는다(마정석만 빼고).
const partSure = it => { const I = ITEMS[it]; return !!I && itemCat(it) === 'mat' && !I.herb && !I.trade && !it.startsWith('egg_') && it !== 'tmap' && !I.keep; };
const MAT_FAM = {
  hide:    { name: '가죽',        icon: 'hide',    c: ['#b8a890', '#a88c68', '#96703e', '#7e5428', '#643a18', '#4a2410'], desc: '짐승의 가죽. 가죽 갑옷 · 장갑 · 신발 · 벨트의 바탕이 된다.' },
  rscale:  { name: '파충류 비늘', icon: 'hide',    c: ['#b4c0a0', '#98b078', '#789c50', '#588434', '#3c6a20', '#245010'], desc: '뱀 · 도마뱀 같은 파충류의 비늘. 가볍고 질긴 비늘 갑옷의 재료.' },
  dscale:  { name: '용족 비늘',   icon: 'hide',    c: ['#c8a8a0', '#c48474', '#bc5c48', '#a83c2c', '#8c2018', '#6c1010'], desc: '와이번 · 드레이크 · 용의 비늘. 불과 칼을 막아 내는 가장 귀한 갑옷 재료.' },
  fscale:  { name: '어류 비늘',   icon: 'hide',    c: ['#b8c4cc', '#98b8cc', '#70a4c8', '#4888bc', '#2c68a4', '#184888'], desc: '물에 사는 마물의 비늘. 매끄럽고 물과 냉기에 강하다.' },
  bone:    { name: '뼈',          icon: 'bone',    c: ['#d8d0c0', '#d0c4a8', '#c4b48c', '#b4a070', '#a08850', '#887038'], desc: '몬스터의 뼈. 무기 자루 · 활대 · 장신구의 뼈대가 된다.' },
  moss:    { name: '이끼',        icon: 'leaf',    c: ['#a8b498', '#90a878', '#749c58', '#588c3c', '#3c7828', '#246018'], desc: '숲 마물의 몸에 자란 이끼. 은신과 회복을 돕는 옷감 · 속감이 된다.' },
  web:     { name: '거미줄',      icon: 'blob',    c: ['#d4d4d4', '#d0d0e0', '#c4c4e8', '#b0b0ec', '#9898e8', '#7c7ce0'], desc: '거미와 나방 마물의 실. 로브 · 천갑 · 활시위를 짜는 실이 된다.' },
  shell:   { name: '갑각',        icon: 'ore',     c: ['#b0a8a0', '#a09080', '#8c7860', '#786048', '#604834', '#483424'], desc: '곤충 · 갑각 마물의 딱딱한 껍데기. 가벼운 판금과 방패의 재료.' },
  wood:    { name: '목재',        icon: 'branch',  c: ['#c8b898', '#b8a078', '#a48858', '#8c703c', '#745828', '#5c4018'], desc: '나무 마물의 몸에서 얻은 목재. 지팡이 · 활 · 방패 · 자루를 깎는다.' },
  fiber:   { name: '섬유',        icon: 'leaf',    c: ['#d0c8a8', '#c8bc8c', '#bcac6c', '#ac9850', '#988038', '#806824'], desc: '덩굴 · 줄기 · 짚에서 뽑은 식물 섬유. 천과 끈, 속감을 짠다.' },
  ore:     { name: '광물',        icon: 'ore',     c: ['#b0b0b0', '#a0a8b4', '#8c9cb8', '#7088b8', '#5470b0', '#3c58a0'], desc: '골렘이나 광물을 몸에 품은 마물에게서 캐낸 광물 덩이. 녹여서 쇠붙이 장비를 만든다.' },   // 11-21 13:32 사용자 「광물도 추가 — 골렘이나 광물을 몸에 품은 몬스터에게서」
  feather: { name: '깃털',        icon: 'feather', c: ['#d0d0d0', '#c0c8d8', '#a8bce0', '#8ca8e4', '#6c8ce0', '#4c6cd4'], desc: '날짐승 마물의 깃털. 화살 깃과 가벼운 장식, 망토에 쓴다.' }
};
const MAT_FAMS = Object.keys(MAT_FAM), MAT_V = [8, 30, 120, 480, 1900, 7500];
MAT_FAMS.forEach(k => MJ_GRADES.forEach((gn, i) => { const F = MAT_FAM[k]; ITEMS[`${k}_${i}`] = { name: `${gn} ${F.name}`, v: MAT_V[i], w: 1, icon: F.icon, c: F.c[i], g: i, fam: k, desc: F.desc }; }));
// 가공 재료 (11-21 15:20 ~ 15:38): 대장간 「재료 제작」에서 원재료를 가공해 만든다 — 원재료의 등급을 그대로 물려받는다. id p_<갈래>_<등급>. 제작법 · 시간은 대장간 제작을 만들 때
const MAT_PROC = { hide: ['무두질한 가죽', '털을 밀고 무두질해 재단한 가죽. 가죽 갑옷 · 장갑 · 신발 · 벨트를 짓는다.'], bone: ['뼈 손잡이', '뼈를 깎고 갈아 만든 손잡이. 무기 자루와 장신구의 뼈대.'], rscale: ['파충류 비늘판', '비늘을 가죽 끈에 엮은 판. 가볍고 질긴 비늘 갑옷을 짓는다.'], dscale: ['용족 비늘판', '용 비늘을 쇠 고리로 이은 판. 가장 귀한 갑옷 재료.'], fscale: ['어류 비늘판', '둥근 비늘을 실로 엮은 판. 물과 냉기에 강한 갑옷을 짓는다.'], feather: ['다듬은 깃 다발', '깃대를 다듬어 묶은 깃. 화살 깃과 장식에 쓴다.'], moss: ['이끼 솜', '이끼를 말리고 두드린 폭신한 솜. 옷의 속감이 된다.'], fiber: ['직물', '섬유를 짠 천 한 필. 로브와 천갑, 끈을 짓는다.'], web: ['거미 비단실', '거미줄을 자아 실패에 감은 실. 고운 옷감과 활시위가 된다.'], shell: ['갑각판', '등딱지를 갈아 자른 판. 가벼운 판금과 방패를 짓는다.'], wood: ['다듬은 목재', '껍질을 벗기고 켠 각재. 지팡이 · 활 · 방패 · 자루를 깎는다.'], ore: ['주괴', '광물을 녹여 부은 쇳덩이. 무기와 판금, 에테르 주괴의 바탕.'] };
const MAT_PV = [30, 110, 420, 1650, 6500, 25000];
Object.keys(MAT_PROC).forEach(k => MJ_GRADES.forEach((gn, i) => { ITEMS[`p_${k}_${i}`] = { name: `${gn} ${MAT_PROC[k][0]}`, v: MAT_PV[i], w: 1, icon: MAT_FAM[k].icon, c: MAT_FAM[k].c[i], g: i, pfam: k, keep: 1, desc: MAT_PROC[k][1] }; }));
// 몬스터 → 등급 부속품 (리마스터한 땅은 손으로, 나머지는 타입 · 이름으로 어림)
const MAT_OF = {
  rat: ['hide', 'bone'], rabbit: ['hide', 'bone'], wolf: ['hide', 'bone'], scarecrow: ['fiber', 'feather'], scare_a3: ['fiber', 'feather'], scare_b2: ['fiber', 'feather'], scare_c4: ['fiber', 'feather'], scare_c1: ['fiber', 'feather'], scare_c2: ['fiber', 'feather'],   /* 11-21 23:29: 깃털을 주는 몬스터가 하나도 없어 활 · 화살을 못 만들었다 → 허수아비(까마귀) */ boar: ['hide', 'bone'], aboar: ['hide', 'bone'], ratking: ['hide', 'bone'],
  vinesnake: ['rscale', 'fiber'], cflower: ['fiber'], stump: ['wood', 'moss'], spotshroom: ['moss'], ibeetle: ['shell'], mgolem: ['ore', 'moss'], fguard: ['wood', 'moss'], elder: ['wood', 'moss'],
  ewisp: [], mlizard: ['rscale', 'moss'], rcenti: ['shell'], emoth: ['web'], eshroom: ['moss'], cstag: ['shell', 'ore'], sentinel: ['wood', 'moss'], elddragon: ['wood', 'moss'],
  smandrake: ['fiber'], fairies: [], fdryad: ['wood', 'fiber'], rahen: []
};
const MAT_NAME_RULE = [[/거미/, 'web'], [/도마뱀|뱀|바실리스크|악어|샐러맨더|리자드/, 'rscale'], [/와이번|드래곤|드레이크|히드라|해룡|뇌룡/, 'dscale'], [/하피|그리핀|까마귀|독수리|천둥새|페가수스/, 'feather'], [/세이렌|인어|상어|크라켄|물고기/, 'fscale'], [/풍뎅이|지네|벌레|전갈|사마귀|개미|게$/, 'shell'], [/이끼/, 'moss'], [/골렘|수정|광부|바위|거상|가고일/, 'ore']];
function matsOf(id) {
  if (MAT_OF[id]) return MAT_OF[id]; const m = MONS[id]; if (!m || m.plan === 'pet') return [];
  if (m._mats) return m._mats; const ty = m.ty || [], out = [];
  for (const [re, k] of MAT_NAME_RULE) if (re.test(m.name) && !out.includes(k)) out.push(k);
  if (ty.includes('construct') && !out.includes('ore')) out.unshift('ore');
  if (ty.includes('dragon') && !out.includes('dscale')) out.push('dscale');
  if (ty.includes('beast') && !out.length) out.push('hide');
  if (ty.includes('plant') && !out.length) out.push('wood', 'fiber');
  if ((ty.includes('beast') || ty.includes('dragon') || ty.includes('undead')) && !ty.includes('elemental') && !out.includes('bone')) out.push('bone');
  return (m._mats = out.slice(0, 2));
}
// 마물육: 몬스터마다 하나 (id → [이름, 설명])
const MMEAT = {
  rat: ['들쥐 고기', '작고 질기지만 구우면 먹을 만하다.'], rabbit: ['뿔토끼 안심살', '부드럽고 담백한 살코기.'], wolf: ['들늑대 뒷다리살', '기름기 없이 단단한 붉은 살.'], scarecrow: ['벼', '허수아비 속에 채워져 있던 낟알 달린 벼.'],
  boar: ['멧돼지 삼겹살', '비계가 두툼하게 붙은 고소한 살.'], aboar: ['갑옷 멧돼지 갈빗살', '등판 아래 숨은 쫄깃한 갈빗살.'], ratking: ['들쥐왕 등심', '곡식만 먹고 자라 뜻밖에 기름진 등심.'],
  vinesnake: ['덩굴 뱀 몸통살', '가시를 바르면 닭고기 같은 흰 살이 나온다.'], cflower: ['식충 꽃 줄기 속살', '아삭하고 달큰한 줄기 속.'], stump: ['그루터기 새순', '등에서 돋은 연한 새순.'], spotshroom: ['점박이 버섯 기둥살', '독 있는 갓을 떼어 낸 쫄깃한 기둥.'],
  ibeetle: ['철갑 풍뎅이 속살', '껍데기 속의 고소한 흰 살.'], mgolem: ['바위 버섯', '이끼 골렘의 몸에 붙어 자란 식용 버섯.'], fguard: ['수호령의 이슬 열매', '뿔 가지에 맺힌 맑은 열매.'], elder: ['트렌트 수액', '오래 묵어 조청처럼 진한 수액.'],
  ewisp: ['반딧불 꿀주머니', '빛을 내던 배에 든 달콤한 꿀.'], mlizard: ['이끼 도마뱀 꼬리살', '다시 자라는 통통한 꼬리.'], rcenti: ['뿌리 지네 마디살', '마디마다 든 새우 맛 살.'], emoth: ['빛가루 나방 배살', '가루를 털어 내면 버터처럼 녹는다.'],
  eshroom: ['에테르 버섯 기둥살', '씹을수록 은은한 단맛이 도는 기둥.'], cstag: ['수정 사슴벌레 속살', '수정 껍데기 속의 탱탱한 살.'], sentinel: ['고목 수액', '속이 빈 줄기에 고인 맑은 수액.'], elddragon: ['고룡목 열매', '천 년에 한 번 맺는다는 에테르 빛 열매.'],
  smandrake: ['만드라고라 뿌리살', '비명이 멎으면 인삼처럼 쌉쌀한 뿌리.'], fairies: ['요정의 이슬꿀', '요정들이 모아 두던 이슬 섞인 꿀.'], fdryad: ['검은 수액 열매', '타락한 수액이 굳어 맺힌 새콤한 열매.']
};
Object.entries(MMEAT).forEach(([id, [name, desc]]) => { ITEMS['mm_' + id] = { name, v: 12, w: 1, icon: (ITEMS.raw_meat && ITEMS.raw_meat.icon) || 'blob', c: (ITEMS.raw_meat && ITEMS.raw_meat.c) || '#c05848', mmeat: id, desc: `${desc} (마물육 — ${MONS[id] ? MONS[id].name : ''})` }; });
function matDrop(p, e, f) {
  if (e.kq) { e.kq.mon = f.id; e.kq.big = !!(f.boss || f.fb); }   // 사체가 어느 몬스터 것인지 (herb72.js 피는 약초)
  const big = f.boss || f.fb, gr = Math.max(0, Math.min(5, Math.floor((f.lv || 1) / 30)));
  matsOf(f.id).forEach(k => loot(p, e, `${k}_${gr}`, big ? 2 : 1));
  const mmId = (MONS[f.id] && MONS[f.id].mm) || f.id;   // 빌드 78: 마물육을 다른 몬스터 것으로 (허수아비 다섯 → 벼)
  if (ITEMS['mm_' + mmId]) { const it = 'mm_' + mmId; loot(p, e, it, 1); ITEMS[it].v = Math.max(ITEMS[it].v, 8 + (f.lv || 1) * 2); }
}
