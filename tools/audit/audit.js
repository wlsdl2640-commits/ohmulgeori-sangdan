// 데모(1층 곡창지대 평원)에서 얻을 수 있는 것 / 쓰는 곳 맞대기
const c = require('./load.js'), E = c.__E;
const I = E('ITEMS'), M = E('MONS'), DEMO = ['plains', 'canyon'].filter(f => E('FIELDS')[f]), F = { mons: [], bosses: [], herbs: [] };   // 데모 층(11-28: 1 · 2층 — 3층은 넣으면 더함)
DEMO.forEach(f => { const X = E('FIELDS')[f]; F.mons.push(...X.mons); F.bosses.push(...(X.bosses || []).filter(Boolean)); F.herbs.push(...(X.herbs || [])); });
const F1 = [...new Set([...F.mons, ...F.bosses, ...Object.values(E('REGEN78')).map(R => R.mon)])];
const src = {}; const add = (it, w) => { if (I[it]) (src[it] = src[it] || new Set()).add(w); };
for (const id of F1) { const m = M[id]; (m.drops || []).forEach(d => add(d[0], id)); add('mm_' + (m.mm || id), id); E('matsOf')(id).forEach(k => { add(`${k}_0`, id); add(`${k}_1`, id); }); }
(F.herbs || []).forEach(h => add(h, '약초'));
['mj_0', 'mj_1', 'whetstone', 'cat_str', 'cat_int', 'cat_vit', 'cat_agi'].forEach(k => add(k, '드롭'));
for (const k in I) if (I[k].scr) add(k, '주문서 드롭');
const market = k => I[k] && (I[k].buy || I[k].season || I[k].from === 'hargen' || /라비린토스 시장에서 판다/.test(I[k].desc || ''));
for (const k in I) if (market(k)) add(k, '시장');
if (E('OREBUG79')) add(E('OREBUG79').out, '광맥 조각 거래');
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
// ── 장비 단계별 (1층 레벨 Lv1 ~ 30 안의 단계 전부) · 에테르 주괴 ──
const GT = E('GTIERS');
GT.forEach((T, t) => { if (t === 0 || T.lv > 30) return; report(`장비 제작 ${t}단계 (${T.name} · Lv${T.lv})`, CR.filter(b => G[b] && E('tierOk')(b, t)).map(b => [G[b].name || b, E('forgeNeed')(b, t)])); });
report('에테르 주괴 (0등급)', [['에테르 주괴', E('etherNeed')(0, 1)]]);
console.log('\n에테르 빛가루 출처:', whoDrops('ether_dust') || '몬스터 없음', '· 시장', !!market('ether_dust'));
