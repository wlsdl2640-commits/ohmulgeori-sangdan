/* ───────── 스킬의 계열 · 직업 (빌드 68 — 사용자 11-13 14:14) ─────────
   「각 스킬북에 계열 및 직업(몇 차 — 검투사면 검투사)을 명확하게 · 스킬 배우는 창에도 전사(공통) · 검투사부터 · 챔피언부터 칸을 나눠서 ·
    배우고 나서도 검투사 스킬인지 챔피언 스킬인지 다 표시 · 모든 직업에」
   skJob(id) = { kind, fams, jobs, tier, gate }
     kind 'line' 계열 공통 (cls에 1차 직업 — 그 계열이면 누구나 · 왕국 스킬처럼 s.tier가 있으면 gate = 그 차수 전직 뒤)
          'job'  그 직업 스킬 (2차부터 — 검투사 · 챔피언 … · 그 직업과 그 뒤 직업이 배운다)
          'all'  공용 (모든 직업) · 'none' 배울 직업 없음 (보관 스킬 — 데드아이 · 하늘 낙하)
   skTag(id)    짧은 꼬리표 — 스킬북 이름 「스킬북: 투기장 연격 (검투사 2차)」 · 칩 skChip
   skJobTxt(id) 긴 글 — 「전사 계열 · 검투사 (2차)」 「전사 계열 · 전사 (1차 · 공통)」 「공용 · 모든 직업」 (창고 정보창 · 펼친 결과 · 도감 · 상점)
   skSecOf(a, id) 스킬 탭 칸 — 이 모험가의 직업 길(chainOf)에서 계열 공통 → 2차 → 3차 → 4차 → 공용 → 다른 직업 (panels.js advDetail) */
const SKJ = {};
const skFamName = f => (CLASSES[f] ? CLASSES[f].name : f);
function skJob(id) {
  if (SKJ[id]) return SKJ[id];
  const s = SKILLS[id], cls = (s && s.cls) || [];
  let o;
  if (!s || !cls.length) o = { kind: 'none', fams: [], jobs: [], tier: -1, gate: 0 };
  else if (cls.includes('all')) o = { kind: 'all', fams: [], jobs: [], tier: 0, gate: s.tier || 0 };
  else {
    const known = cls.filter(c => CLASSES[c]), fams = [...new Set(known.map(jobBase))], jobs = known.filter(c => jobTier(c) >= 2);
    // 1차 직업이 하나라도 있으면 그 계열 누구나 배운다 (canLearn은 직업 길에 cls가 있는지만 본다)
    if (known.length && jobs.length === known.length) o = { kind: 'job', fams, jobs, tier: Math.max(...jobs.map(jobTier)), gate: s.tier || 0 };
    else o = { kind: 'line', fams, jobs: [], tier: 1, gate: s.tier || 0 };
  }
  return (SKJ[id] = o);
}
// 칩 색 칸: 공용 0 · 1차(계열 공통) 1 · 2차 2 · 3차 3 · 4차 4 · 5차 5 · 보관 x
const skTierCls = id => { const J = skJob(id); return J.kind === 'none' ? 'tx' : J.kind === 'all' ? 't0' : 't' + Math.min(5, Math.max(J.tier, J.gate || 0)); };
function skTag(id) {
  const J = skJob(id);
  if (J.kind === 'none') return '보관';
  if (J.kind === 'all') return J.gate ? `공용 · ${J.gate}차부터` : '공용';
  if (J.kind === 'job') return J.jobs.map(c => `${CLASSES[c].name} ${jobTier(c)}차`).join(' · ');
  return `${J.fams.map(skFamName).join(' · ')} 공통${J.gate > 1 ? ` · ${J.gate}차부터` : ''}`;
}
function skJobTxt(id) {
  const J = skJob(id);
  if (J.kind === 'none') return '배울 직업 없음 (보관 스킬)';
  if (J.kind === 'all') return `공용 · 모든 직업${J.gate ? ` · ${J.gate}차 전직 뒤` : ''}`;
  const fam = `${J.fams.map(skFamName).join(' · ')} 계열`;
  if (J.kind === 'job') return `${fam} · ${J.jobs.map(c => `${CLASSES[c].name} (${jobTier(c)}차)`).join(' · ')}${J.gate > J.tier ? ` · ${J.gate}차 전직 뒤` : ''}`;
  return `${J.fams.length > 1 ? `${fam} 공통 (1차)` : `${fam} · ${skFamName(J.fams[0])} (1차 · 공통)`}${J.gate > 1 ? ` · ${J.gate}차 전직 뒤` : ''}`;
}
const skChip = id => `<span class="skj ${skTierCls(id)}">${skTag(id)}</span>`;
// 창고 정보창 · 펼친 결과의 한 줄: 왼쪽 띠(차수 색) + 「전사 계열 · 검투사 (2차)」 + 배우는 레벨
const skJobLine = id => `<span class="skjl ${skTierCls(id)}"><b>${skJobTxt(id)}</b> <span class="muted">· Lv${SKILLS[id].lv}부터</span></span>`;
// 그 스킬을 지금 배울 수 있는 모험가 · 이미 배운 모험가 (창고 정보창)
const skCanNames = id => S.advs.filter(a => !a.skills.includes(id) && canLearn(a, id)).map(a => esc(a.name));
const skCanTxt = id => { const L = skCanNames(id); return L.length ? ` · <span class="ok-t">배울 수 있는 모험가: ${L.length > 3 ? `${L.slice(0, 3).join(' · ')} 외 ${L.length - 3}명` : L.join(' · ')}</span>` : ''; };   // 펼친 결과 · 합성 결과 줄 끝
function skWhoTxt(id) {
  const cut = L => (L.length > 4 ? `${L.slice(0, 4).join(' · ')} 외 ${L.length - 4}명` : L.join(' · '));
  const can = skCanNames(id);
  const has = S.advs.filter(a => a.skills.includes(id) && skLv(a, id) < SK_LV_MAX).map(a => esc(a.name));
  return [can.length ? `지금 배울 수 있는 모험가: ${cut(can)}` : '지금 배울 수 있는 모험가가 없어요', has.length ? `배운 모험가(한 권 더 바치면 스킬 단계 ↑): ${cut(has)}` : ''].filter(Boolean).join(' · ');
}

// 스킬 탭 칸: 그 모험가의 직업 길에서 이 스킬이 어느 칸인지 — { k: 'line' | 직업 id | 'all' | 'etc', o: 차례, t: 칩 색 칸 }
function skSecOf(a, id) {
  const J = skJob(id), chain = chainOf(a.cls);
  if (J.kind === 'all') return { k: 'all', o: 8, t: 0 };
  if (J.kind === 'job') { const c = J.jobs.filter(x => chain.includes(x)).sort((x, y) => jobTier(y) - jobTier(x))[0]; if (c) return { k: c, o: jobTier(c), t: jobTier(c) }; }
  if (J.kind === 'line' && J.fams.includes(jobBase(a.cls))) return { k: 'line', o: 1, t: 1 };
  return { k: 'etc', o: 9, t: 'x' };
}
// 칸 이름 — mode 'learn'(배울 스킬북 · 스킬 목록: 「전사 (공통)」 「검투사부터」) | 'have'(배운 스킬: 「전사 공통 스킬」 「검투사 스킬」)
function skSecName(a, sec, mode) {
  const base = CLASSES[jobBase(a.cls)].name;
  if (sec.k === 'line') return mode === 'have' ? [`${base} 공통 스킬`, '1차 · 계열 누구나'] : [`${base} (공통)`, `1차 · ${base} 계열 누구나`];
  if (sec.k === 'all') return mode === 'have' ? ['공용 스킬', '모든 직업'] : ['공용', '모든 직업'];
  if (sec.k === 'etc') return ['다른 직업 스킬', '지금 직업 길 밖'];
  const n = CLASSES[sec.k].name, t = jobTier(sec.k);
  return mode === 'have' ? [`${n} 스킬`, `${t}차`] : [`${n}부터`, `${t}차${(JOB_TREE[sec.k] || []).length ? ` · ${n} → ${nextJobs(sec.k).map(c => CLASSES[c].name).join(' · ')}` : ''}`];
}
// ids를 칸으로 나눈다 (칸 차례대로 · 칸 안은 ids 차례)
function skSecs(a, ids) {
  const M = new Map();
  for (const id of ids) { const sec = skSecOf(a, id); if (!M.has(sec.k)) M.set(sec.k, { sec, ids: [] }); M.get(sec.k).ids.push(id); }
  return [...M.values()].sort((x, y) => x.sec.o - y.sec.o);
}
const skSecHead = (a, sec, mode, more) => { const [n, sub] = skSecName(a, sec, mode); return `<div class="sksec t${sec.t}"><b>${n}</b><span>${sub}${more ? ` · ${more}` : ''}</span></div>`; };

// 빌드 65 직업 개편(SK65)에서 생긴 스킬 36개가 SKILL_IDS에 없어 스킬 탭 「배울 수 있는 스킬 전체」 · 도감에 안 나왔다 (닌자 · 카게닌자 · 코네스토가 · 괴도 …)
Object.keys(SKILLS).forEach(id => { if (!SKILL_IDS.includes(id) && !SKILLS[id].cut) SKILL_IDS.push(id); });   // 빌드 69: 뺀 왕국 · 투기장 스킬(cut — data-cut69.js)은 다시 넣지 않는다
// 스킬북 이름에 꼬리표 (모든 스킬북 — 예전 저장의 책도 같은 물건 id라 그대로 바뀐다)
for (const k of Object.keys(ITEMS)) { const I = ITEMS[k]; if (I.book && SKILLS[I.book]) I.name = `스킬북: ${SKILLS[I.book].name} (${skTag(I.book)})`; }

// 빌드 68 알림 (옛 저장 — econ.js notes68b)
STORY.v68b = [
  '스킬북마다 계열과 직업이 붙었다 — 이름 끝 꼬리표(검투사 2차 · 전사 공통 · 공용)와 창고 정보창의 「전사 계열 · 검투사 (2차)」 줄. 창고 스킬북 칸 왼쪽 아래 글자는 배우는 차수, 위 칩으로 계열마다 골라 볼 수 있다.',
  '모험가 창 → 스킬: 배운 스킬 · 배울 수 있는 스킬북 · 스킬 목록이 「전사 (공통)」 「검투사부터」 「챔피언부터」 「공용」 칸으로 나뉜다. 배운 스킬도 「검투사 스킬」 「챔피언 스킬」 칸에 들어간다.',
  '닌자 · 카게닌자 · 코네스토가 · 괴도 · 대도 · 캐러밴 마스터 같은 새 직업 스킬도 이제 스킬 목록 · 도감에 나온다.'
];
