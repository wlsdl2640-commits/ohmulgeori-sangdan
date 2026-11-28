// 데모(1층 곡창지대 평원)에서 얻을 수 있는 것 / 쓰는 곳 맞대기
const c = require('./load.js'), E = c.__E;
const I = E('ITEMS'), M = E('MONS'), F = E('FIELDS.plains');
const F1 = [...new Set([...F.mons, ...F.bosses, 'scare_c1', 'scare_c2'])];
const src = {}; const add = (it, w) => { if (I[it]) (src[it] = src[it] || new Set()).add(w); };
for (const id of F1) { const m = M[id]; (m.drops || []).forEach(d => add(d[0], id)); add('mm_' + (m.mm || id), id); E('matsOf')(id).forEach(k => { add(`${k}_0`, id); add(`${k}_1`, id); }); }
(F.herbs || []).forEach(h => add(h, '약초'));
['mj_0', 'mj_1', 'whetstone', 'cat_str', 'cat_int', 'cat_vit', 'cat_agi'].forEach(k => add(k, '드롭'));
for (const k in I) if (I[k].scr) add(k, '주문서 드롭');
const market = k => I[k] && (I[k].buy || I[k].season || I[k].from === 'hargen' || /라비린토스 시장에서 판다/.test(I[k].desc || ''));
for (const k in I) if (market(k)) add(k, '시장');
for (const k in I) if (I[k].pfam) { const raw = k.replace(/^p_/, ''); if (src[raw]) add(k, '가공'); }
const why = k => { const x = I[k]; if (!x) return '없는 아이템'; if (x.from && x.from !== 'hargen' && x.veg) return '이웃 왕국 상단'; if (x.sea) return '항구'; if (x.from === 'pen') return '사육장'; if (x.herb) return '다른 층 약초'; const raw = k.replace(/^p_/, ''); const d = whoDrops(raw); return d ? '다른 층 몬스터(' + d + ')' : '출처 없음'; };
const flags = k => { const x = I[k]; if (!x) return '없는 아이템'; return ['buy', 'season', 'sup', 'veg', 'trade', 'herb', 'dish', 'ingot', 'egg', 'sea', 'excl', 'boss', 'raid', 'rare', 'book'].filter(f => x[f]).join(',') || '-'; };
const whoDrops = k => Object.keys(M).filter(id => (M[id].drops || []).some(d => d[0] === k) || ('mm_' + (M[id].mm || id)) === k || E('matsOf')(id).some(p => k.startsWith(p + '_'))).slice(0, 4).join(' ');
const report = (title, list) => { // list: [이름, need{}]
  const bad = []; for (const [nm, need] of list) { const miss = Object.keys(need || {}).filter(k => !src[k]); if (miss.length) bad.push([nm, miss]); }
  console.log(`\n## ${title}: ${list.length - bad.length}/${list.length} 가능`);
  bad.forEach(([nm, miss]) => console.log(`- ${nm}: ` + miss.map(k => `${I[k] ? I[k].name : k}(${why(k)})`).join(', ')));
};
const FOODS = E('FOODS'); report('요리', Object.keys(FOODS).map(id => [FOODS[id].name, FOODS[id].need]));
report('물약(연금술)', E('RECIPES').map(r => [I[r.out] ? I[r.out].name : r.out, r.need]));
const CR = E('CRAFT_IDS'), G = E('GTYPES'); report('장비 제작 0단계', CR.filter(b => G[b] && E('tierOk')(b, 0)).map(b => [G[b].name || b, E('forgeNeed')(b, 0)]));
const SK = E('SKILLS'), BI = E('BOOK_IDS'); report('스킬북 만들기(서고) Lv30까지', BI.filter(s => SK[s] && SK[s].lv <= 30 && E('bookRecipe')(s)).map(s => [SK[s].name, E('bookRecipe')(s).need]));
const KG = E('KINGDOMS'); for (const k in KG) report('이웃 왕국 ' + (KG[k].name || k), (KG[k].wants || []).map(w => [I[w] ? I[w].name : w, { [w]: 1 }]));
