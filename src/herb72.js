/* ───────── 새 약초 · 계층별 약초 · 피는 약초 (빌드 72 · 11-21 14:10 ~ 14:15 사용자) ─────────
   · 겹치는 것은 합쳤다: 핏빛 버섯 → 「핏빛꽃」(id bloodshroom 그대로) · 달빛꽃 → 「보름달꽃」(id moonflower 그대로, 밤에만 발견).
   · 새 약초 아홉: 충혼초(동충하초) · 은엽쑥(쑥) · 망령투구꽃(투구꽃) · 부레연꽃 · 메아리버섯 · 요정방울꽃 · 세계수 새순 · 검은눈물이끼 (+ 이름을 바꾼 둘). 이름 · 생김새는 내 안을 사용자가 받아들임(「너가 추천한 것도 다 넣고」).
   · 계층마다 나오는 약초(FIELDS[..].herbs): 히포크리초는 마나가 풍부한 곳이면 어디든(메마른 뿌리굴만 뺌).
   · 피는 약초(HERB_BLOOM): 군락지로 안 나오고, 몬스터를 갈무리한 바로 뒤에만 확률을 굴려 핀다 — 핏빛꽃(피를 빨아들여 개화, 5% · 우두머리 30%) · 충혼초(곤충형(갑각 · 거미줄 갈래) 몬스터의 사체에서만, 8% · 우두머리 30%). 약초꾼(짐꾼 계열)이 있어야 캔다.
   · 아직 없는 지역의 약초는 기억만(넣지 않음): 개미정원버섯(3계층 개미굴) · 바람민들레(바람계곡) · 쇠뿌리고사리(바위산) · 가시단꿀선인장(사막) — 지역 표는 CLAUDE.md.
   · 재배소에는 넣지 않았다(HERB_TIER에 안 넣음 → farmable 아님). 새 약초를 쓰는 조제법 · 요리도 아직. */
Object.assign(ITEMS.bloodshroom, { name: '핏빛꽃', icon: 'flower', desc: '몬스터의 피를 빨아들인 자리에서 곧바로 피어나는 붉은 꽃. 피를 만든다.' });
Object.assign(ITEMS.moonflower, { name: '보름달꽃', desc: '밤에만 달처럼 빛나며 피는 둥근 흰 꽃. 낮에는 봉오리로 닫혀 보이지 않는다. 상급 물약의 재료.' });
Object.assign(ITEMS, {
  cordy:        { name: '충혼초',     v: 55, w: 1, icon: 'root',   c: '#e8903a', herb: 1, desc: '벌레 마물의 껍데기에서 솟는 주황빛 자루. 죽은 벌레의 기운을 먹고 자란다. 기력과 체력을 돋운다.' },
  mugwort:      { name: '은엽쑥',     v: 14, w: 1, icon: 'leaf',   c: '#b8d0c0', herb: 1, desc: '잎 뒷면이 은빛인 쑥. 태우면 나는 향이 저주와 언데드를 쫓는다.' },
  wolfsbane:    { name: '망령투구꽃', v: 46, w: 1, icon: 'flower', c: '#7a4ac8', herb: 1, desc: '투구 꼴의 짙은 보랏빛 꽃. 뿌리에 맹독이 있어 독과 마비약의 재료가 된다.' },
  bladderlotus: { name: '부레연꽃',   v: 80, w: 1, icon: 'flower', c: '#f0a8c8', herb: 1, desc: '연잎 아래 공기주머니가 주렁주렁 달린 연꽃. 달여 마시면 물속에서 숨을 쉴 수 있다.' },
  echoshroom:   { name: '메아리버섯', v: 20, w: 1, icon: 'blob',   c: '#8ac8e8', herb: 1, desc: '나팔 꼴 갓이 소리를 되울리는 동굴 버섯. 잠 · 혼란 · 공포를 깨운다.' },
  fairybell:    { name: '요정방울꽃', v: 44, w: 1, icon: 'flower', c: '#c8f0ff', herb: 1, desc: '흔들리면 빛가루가 떨어지는 방울 꼴 꽃. 마나를 되돌린다.' },
  wtsprout:     { name: '세계수 새순', v: 160, w: 1, icon: 'leaf',  c: '#c8f070', herb: 1, desc: '금빛 테를 두른 세계수의 연둣빛 새순. 가장 귀한 회복 재료.' },
  inkshroom:    { name: '저주먹물버섯', v: 48, w: 1, icon: 'blob',  c: '#6a3a9a', herb: 1, desc: '타락한 수액을 빨아 갓에서 검보라 먹물을 뚝뚝 흘리는 버섯. 독과 저주의 재료가 된다.' },   // 11-21 14:39 사용자가 그림을 먼저 가져옴 — 이름은 내가 지음(먹물버섯 바탕)
  blacktear:    { name: '검은눈물이끼', v: 52, w: 1, icon: 'blob',  c: '#5a3a7a', herb: 1, desc: '타락한 수액이 굳은 자리에 끼는 검보라 이끼. 저주의 재료이자 저주를 푸는 약이 된다.' }
});
const HERB72_TIER = { herb: 0, mugwort: 0, waterherb: 0, ethermoss: 0, echoshroom: 0, snowherb: 0, fireherb: 0, wolfsbane: 1, fairybell: 1, blacktear: 1, inkshroom: 1, boltbranch: 1, bloodshroom: 1, cordy: 1, moonflower: 2, bladderlotus: 2, wtsprout: 2, mandrake: 2 };
const HERB_BLOOM = { bloodshroom: { p: 0.05, boss: 0.3, txt: '피를 빨아들인 자리에 핏빛꽃이 피었다' }, cordy: { p: 0.08, boss: 0.3, fam: ['shell', 'web'], txt: '벌레 껍데기에서 충혼초가 솟았다' } };
const HERB_NIGHT = { moonflower: 1 };
const HERB_ONLY = { wtsprout: (F, e) => e.field === 'deepforest' && e.stage >= 41 };   // 세계수 밑동 구간
Object.assign(FIELDS.plains, { herbs: ['herb', 'mugwort', 'bloodshroom', 'moonflower'] });
Object.assign(FIELDS.forest, { herbs: ['herb', 'waterherb', 'wolfsbane', 'bloodshroom', 'bladderlotus'] });
if (FIELDS.deepforest) FIELDS.deepforest.herbs = ['herb', 'ethermoss', 'fairybell', 'cordy', 'wtsprout'];
if (FIELDS.rootcave) FIELDS.rootcave.herbs = ['echoshroom', 'blacktear', 'inkshroom', 'mandrake'];
// 군락지 후보: 피는 약초 · 밤에만 · 구간 조건을 뺀 그 땅의 약초
function herbCands(F, e) { return [...new Set(F.herbs || [])].filter(h => ITEMS[h] && !HERB_BLOOM[h] && (!HERB_NIGHT[h] || isNight()) && (!HERB_ONLY[h] || HERB_ONLY[h](F, e))); }
const herbW = h => HERB72.tierW[HERB72_TIER[h] != null ? HERB72_TIER[h] : 1] || 0.1;
// 갈무리가 끝난 사체 하나마다 (job72.js j1Hold): 피는 약초
function herbBloom(p, e, C, team) {
  if (!HERB72.on || !C || !C.mon || !team.some(isPorter)) return; const F = FIELDS[e.field]; if (!F || !F.herbs) return;
  for (const h of F.herbs) { const B = HERB_BLOOM[h]; if (!B) continue; if (B.fam && !matsOf(C.mon).some(k => B.fam.includes(k))) continue;
    if (rnd() < (C.big ? B.boss : B.p)) { loot(p, e, h, 1); e.note = { t: 1.5, txt: `${ITEMS[h].name} 채취` }; e.hold = Math.max(e.hold || 0, HERB_BLOOM_T); e.bloomShow = h; log(`${p.name}: ${B.txt}. 약초꾼이 캤다.`, 'good'); HOOKS.toast(`${p.name}: ${ITEMS[h].name}!`); } }
}

/* 화면: 군락지는 파티 앞 길 위에 선다(캐는 동안), 피는 약초는 멈춰 있는 동안 싹 → 봉오리 → 활짝. 그림 HERB_ART(data-herbart.js) [소, 중, 대] / [싹, 봉오리, 활짝] = [그림, 너비, 높이] */
const HERB_BLOOM_T = 1.5, HERB_X = 172, HERB_Y = 197, HERB_Z = 1.25, HERB_IMG = {};   // HERB_Z: 대형 군락지가 캐릭터 가슴 높이쯤
function herbImg(u) { let m = HERB_IMG[u]; if (!m) { m = HERB_IMG[u] = new Image(); m.src = u; } return m.complete && m.naturalWidth ? m : null; }
function herbDraw(draws, e) {
  if (typeof HERB_ART === 'undefined' || !e) return; let A = null;
  if (e.herbJob && HERB_ART[e.herbJob.id]) A = HERB_ART[e.herbJob.id][{ 소형: 0, 중형: 1, 대형: 2 }[e.herbJob.size] || 0];
  else if (e.bloomShow && e.hold > 0 && HERB_ART[e.bloomShow]) A = HERB_ART[e.bloomShow][e.hold > HERB_BLOOM_T * 0.66 ? 0 : e.hold > HERB_BLOOM_T * 0.33 ? 1 : 2];
  if (!A) return; const m = herbImg(A[0]); if (!m) return;
  draws.push({ y: HERB_Y + 1, f: g => { const s = g.imageSmoothingEnabled; g.imageSmoothingEnabled = true; const W = A[1] * HERB_Z, H = A[2] * HERB_Z; g.drawImage(m, Math.round(HERB_X - W / 2), Math.round(HERB_Y - H + 3), W, H); g.imageSmoothingEnabled = s; } });
}

/* 짐꾼 작업 자세 (PORTER_WORK — data-porterwork.js: 갈무리 harv · 약초 캐기 herb, 8장 띠): 일하는 짐꾼(e.workA — job72.js j1Hold)은 군락지 왼쪽 / 파티 앞에 쪼그려 앉아 일한다.
   그림은 1차 짐꾼 것이라 짐꾼(porter) 직업만 — 다른 짐꾼 계열은 서 있는 그림 그대로. */
const WORK_X = 150, WORK_FPS = 7, WORK_Z = 0.66;   // WORK_Z: 서 있는 동료와 머리 크기가 같게
function workDraw(draws, e, a, t) {
  if (typeof PORTER_WORK === 'undefined' || !e || e.workA !== a.id || a.cls !== 'porter' || a.down || (e.foes || []).some(f => f.hp > 0)) return false;
  const m = herbImg(PORTER_WORK[e.workK]); if (!m) return false;
  const P = PORTER_WORK, fi = Math.floor(t * WORK_FPS) % 8, A = e.herbJob && typeof HERB_ART !== 'undefined' && HERB_ART[e.herbJob.id] ? HERB_ART[e.herbJob.id][{ 소형: 0, 중형: 1, 대형: 2 }[e.herbJob.size] || 0] : null;
  const fw = P.fw * WORK_Z, fh = P.fh * WORK_Z, x = A ? HERB_X - A[1] * HERB_Z / 2 - fw * 0.42 : WORK_X, y = HERB_Y + 1;
  draws.push({ y: y + 1, f: g => { const s = g.imageSmoothingEnabled; g.imageSmoothingEnabled = true; g.drawImage(m, fi * P.fw * 2, 0, P.fw * 2, P.fh * 2, Math.round(x - fw / 2), Math.round(y - fh + 1), fw, fh); g.imageSmoothingEnabled = s; } });
  return true;
}
