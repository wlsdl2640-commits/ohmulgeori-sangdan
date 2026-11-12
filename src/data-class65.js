/* ───────── 빌드 65: 직업 개편 (사용자 11-12 15:26 「이거 다 넣고」 · 「이건 화살스킬 제거」) ─────────
   스킬 시안 문서(「스킬 시안 — 새 직업 · 바뀐 직업」, 11-11)의 표 그대로:
   · 이름: 보물 사냥꾼 → 소매치기 · 괴물사냥꾼 → 트래커 · 드래곤 슬레이어 → 스토커 · 레인저 → 랑기수 · 용기병 → 용기수 (id는 그대로 — 저장이 이어진다)
   · 새 직업: 괴도(3차, 소매치기 → 괴도 → 대도) · 닌자(2차) → 카게닌자(3차) · 코네스토가(3차, 마부 → 코네스토가 → 캐러밴 마스터)
   · 4차 전직: 대도 · 캐러밴 마스터 (Lv150 · 백금 · 3,000,000G · 주인의 혼 4 + 별의 정원 주인의 핵, 4차는 Lv200까지)
   · 정찰가 · 탐험가: 정글칼만 (활 · 화살 · 화살 스킬 없음) · 짐꾼 계열은 방패 · 탱킹 없이 늘 맨 뒤 · 용기수는 창 대신 복합궁
   · 쌍검사 · 검무사: 쌍단검 (단검 + 부장비 칸의 보조 단검)
   data-job64.js(레벨 옮기기) 뒤 · data-store.js(스킬북 표) 앞에서 돈다. 새 장치(sta2 · after · more · 암기/볼트 스킬 · 다음 공격 · 튕겨내기 …)는 core.js cast · basicAct · hitAdv. */
JOB_REQ[4] = { lv: 150, rank: 4, fee: 3000000, souls: 4, item: ['core_15', 1] };
const C65 = (id, o) => Object.assign(CLASSES[id], o);
// ── 이름만 바뀌는 직업
C65('treasure', { name: '소매치기', desc: '혼합. 카드로 눈을 돌리고 지갑을 턴다. 연막으로 파티를 지키고 보물 상자를 잘 연다. 전리품 +15%.' });
C65('mhunter', { name: '트래커', desc: '우두머리 사냥(한방). 표식을 남기고 컴파운드 보우와 손목 석궁으로 쫓는다. 보스 피해 ×1.3, 전리품 +25%.' });
C65('dslayer', { name: '스토커', desc: '숨죽여 쫓는 사냥의 정점. 보스 피해 ×1.6, 방어 20% 무시, 다음 한 발을 두 배로.' });
// 랑기수 전직: 늑대 펫 Lv30 하나를 보낸다 — 그 늑대가 탈것이 된다 (tools/saved/ride65/DECISIONS.md · 사용자 11-12 17:23 「랑기수 전직 때 늑대 펫 보내기」) · 탈것 직업은 전투 대형 맨 뒷줄(row 2 — 늑대 · 와이번이 크다)
CLASSES.ranger.req = Object.assign(CLASSES.ranger.req || {}, { petWolf: PET_EVO_LV });
const wolfMount = lv => (typeof S !== 'undefined' && S && S.pets ? petsAtHome().filter(x => x.kind === 'wolf' && x.lv >= lv).sort((x, y) => x.lv - y.lv)[0] : null) || null;   // 가장 낮은 레벨부터 (파티 · 마차에 맨 펫은 빼고)
C65('ranger', { name: '랑기수', row: 2, desc: '늑대를 탄 지속 딜러. 달리며 쏘고, 늑대가 함께 문다(연계 +6%).' });
C65('dragoon', { name: '용기수', row: 2, act: 'arrow', tr: { pet: 0.5, combo: 0.08, baImm: 1 }, desc: '와이번을 타고 하늘에서 복합궁으로 내리쏜다. 동료가 서 있는 동안 기본 공격에 맞지 않는다(와이번 강하 때 2초는 맞는다). 연계 +8%.' });
// ── 짐꾼 계열: 방패 · 탱킹을 빼고 서포터로 (늘 맨 뒤). 텐트 효과는 정찰가 → 마부 · 코네스토가
C65('coachman', { tr: { wagon: 0.25, wagonSpd: 0.05, tent: 1.5 }, desc: '서포터. 마차를 끌고(짐 +25% · 속도 +5%), 짐칸 보호막과 전속력으로 파티를 돕는다. 야영 때 텐트를 쳐 피로가 1.5배 빨리 풀린다.' });
C65('caravanmaster', { tier: 4, from: 'conestoga', carry: 40, base: { str: 13, vit: 13, agi: 8, int: 4 }, grow: { str: 2.4, vit: 2.3, agi: 1.2, int: 0.5 }, spd: 0.82, crit: 0.07, salary: 380,
  tr: { wagon: 0.5, wagonSpd: 0.15, tent: 2 }, desc: '대상단의 행렬을 이끄는 정점(4차). 짐 +50% · 속도 +15%, 큰 파티 강화와 행렬 돌진.' });
C65('scout', { act: 'melee', row: 2, tr: { scout: 0.25, tank: -0.3 }, desc: '디버퍼 · 길잡이. 정글칼로 표식을 새기고 올가미로 묶는다. 원정 이동 +25%. 서포터라 늘 맨 뒤에 선다.' });
C65('pathfinder', { act: 'melee', row: 2, tr: { scout: 0.4, luck: 0.1, tank: -0.3 }, desc: '미지의 땅을 여는 탐험가. 원정 이동 +40%, 전리품 +10%, 북소리와 위장으로 파티를 이끈다.' });
C65('masterthief', { tier: 4, from: 'phantomthief', carry: 20, base: { str: 10, vit: 9, agi: 15, int: 5 }, grow: { str: 1.9, vit: 1.6, agi: 2.9, int: 0.7 }, spd: 1.35, crit: 0.17, salary: 380,
  tr: { luck: 0.3 }, desc: '훔치지 못한 것이 없는 전설의 도둑(4차). 전리품 +30%, 한탕이 크고 보물고를 통째로 턴다.' });
// ── 새 직업 넷
Object.assign(CLASSES, {
  phantomthief: SP({ name: '괴도', tier: 3, from: 'treasure', carry: 18, base: { str: 8, vit: 7, agi: 12, int: 4 }, grow: { str: 1.6, vit: 1.4, agi: 2.5, int: 0.6 }, spd: 1.3, crit: 0.16, salary: 290, act: 'melee', innate: 'calling',
    tunic: '#2f5a42', trim: '#e0c060', tr: { luck: 0.22 }, desc: '예고장을 보내고 훔치는 중절모의 도박사. 표식 · 대박 · 변장, 전리품 +22%.' }),
  ninja: SP({ name: '닌자', tier: 2, from: 'rogue', carry: 10, base: { str: 7, vit: 6, agi: 10, int: 3 }, grow: { str: 1.4, vit: 1.1, agi: 2.2, int: 0.5 }, spd: 1.3, crit: 0.14, salary: 230, act: 'melee', innate: 'shuriburst',
    tunic: '#2e3a6a', trim: '#d8302a', tr: { thrown: 3 }, desc: '암기와 단검. 표창을 세 통까지 지니고 연달아 던진다. 쓰러질 한 방을 통나무로 바꿔 피한다.' }),
  kageninja: SP({ name: '카게닌자', tier: 3, from: 'ninja', carry: 10, base: { str: 9, vit: 7, agi: 13, int: 5 }, grow: { str: 1.7, vit: 1.3, agi: 2.7, int: 0.8 }, spd: 1.35, crit: 0.16, salary: 300, act: 'melee', innate: 'shadowshuri',
    tunic: '#241c34', trim: '#7a4ab8', tr: { thrown: 3 }, desc: '어둠 속성 환술과 그림자. 검은 표창으로 눈을 멀게 하고, 그림자에서 솟아 베고, 공간째 가른다.' }),
  conestoga: SP({ name: '코네스토가', tier: 3, from: 'coachman', carry: 34, base: { str: 11, vit: 11, agi: 7, int: 3 }, grow: { str: 2.1, vit: 2.0, agi: 1.1, int: 0.4 }, spd: 0.8, crit: 0.06, salary: 290, act: 'melee', innate: 'pioneerwhip',
    tunic: '#3a5aa0', trim: '#e8c870', row: 2, tr: { wagon: 0.35, wagonSpd: 0.1, tent: 2 }, desc: '포장마차를 끄는 개척민. 웨건을 세워 파티를 지키고, 비상식량으로 버티게 하고, 긴 채찍으로 적을 묶는다. 짐 +35% · 속도 +10%, 야영 회복 2배.' })
});
for (const k of Object.keys(JOB_TREE)) delete JOB_TREE[k];
for (const k of Object.keys(JOB_PARENT)) delete JOB_PARENT[k];
Object.entries(CLASSES).forEach(([id, C]) => { if (C.from) { (JOB_TREE[C.from] = JOB_TREE[C.from] || []).push(id); JOB_PARENT[id] = C.from; } });
const NEW_CLASSES65 = ['phantomthief', 'ninja', 'kageninja', 'conestoga'];
NEW_CLASSES65.forEach(c => { if (!ALL_CLASS_IDS.includes(c)) ALL_CLASS_IDS.push(c); });
// 직업 특성 · 소개
Object.assign(JOB_TRAITS, {
  coachman:      { name: '마부의 고삐',     desc: '짐 +4 · 이동 +4%',                 carry: 4, movePct: 0.04 },
  caravanmaster: { name: '대상단의 깃발',   desc: '짐 +8 · 이동 +6% · 전리품 +5%',    carry: 8, movePct: 0.06, luck: 0.05 },
  conestoga:     { name: '개척민의 손',     desc: '짐 +6 · 치유량 +6%',               carry: 6, healPow: 0.06 },
  phantomthief:  { name: '괴도의 예고',     desc: '전리품·금화 +12% · 치명타 +3%p',   luck: 0.12, crit: 0.03 },
  ninja:         { name: '닌자의 발놀림',   desc: '회피 +6%p · 공격 속도 +4%',        eva: 0.06, spdPct: 0.04 },
  kageninja:     { name: '그림자의 주인',   desc: '회피 +8%p · 치명타 +4%p',          eva: 0.08, crit: 0.04 },
  dragoon:       { name: '용기수의 날개',   desc: '공격력 +10% · 회피 +8%p',          atkPct: 0.1, eva: 0.08 },
  dslayer:       { name: '추적자의 심장',   desc: '보스 피해 +15% · 전리품 +10%',     bossDmg: 0.15, luck: 0.1 }
});
['coachman', 'caravanmaster', 'conestoga', 'phantomthief', 'ninja', 'kageninja', 'dragoon', 'dslayer'].forEach(c => { TRAITS['j_' + c] = Object.assign({ job: c }, JOB_TRAITS[c]); });
Object.assign(BIOS, {
  phantomthief: ['훔치기 전날 밤에는 꼭 예고장을 보낸다.'], ninja: ['동쪽 섬나라에서 건너왔다고만 한다.'], kageninja: ['그림자가 본인보다 먼저 움직일 때가 있다.'],
  conestoga: ['포장마차 한 대로 대륙을 가로질렀다.']
});
// ── 스킬. 배우는 레벨: 2차 56 · 64 · 72 · 84 · 92 / 3차 108 · 116 · 126 · 136 · 146 / 4차 158 · 166 · 176 · 186 · 196 (lv0 = 스킬북 값 · 등급용 예전 레벨 자리)
const LV65 = { 56: 22, 64: 28, 72: 36, 84: 42, 92: 48, 108: 55, 116: 65, 126: 75, 136: 85, 146: 95, 158: 100, 166: 110, 176: 120, 186: 130, 196: 140 };
function SK65(id, o) {
  const s = SKILLS[id] = Object.assign(SKILLS[id] || {}, o);
  for (const k of Object.keys(s)) if (s[k] === undefined) delete s[k];
  if (s.lv > 1 && LV65[s.lv] != null) { s.lv0 = LV65[s.lv]; if (!isInnate(id)) s.own = 1; }
  return s;
}
const STUN = (p, d) => ({ k: 'stun', p, d, m: 0 }), PARA = (p, d) => ({ k: 'para', p, d, m: 0 }), MARK = d => ({ k: 'mark', p: 1, d, m: 0 }), BLEED = (p, d) => ({ k: 'bleed', p, d, m: 0.3 });
// 마부 (2차)
SK65('wheelcrush', { lv: 72, wagonMul: 1.3, desc: '마차를 몰아 모든 적을 들이받는다. 기절시킬 수 있다. 마차를 끌고 왔으면 1.3배 세다.' });
SK65('wagonwall', { lv: 84 });
SK65('cargoshield', { name: '여행 채비', lv: 92, passive: { pbuffDur: 0.2, carryPct: 0.1 }, desc: '파티에 거는 강화 스킬이 20% 오래 가고, 짐이 10% 늘어난다.' });
// 코네스토가 (3차 · 새 직업)
SK65('pioneerwhip', { name: '개척자의 채찍', cls: ['conestoga'], lv: 1, cost: { mp: 10 }, cd: 5, kind: 'dmg', mult: 1.6, hits: 2, slow: 3, tgt: 'front', desc: '긴 채찍으로 앞의 적을 두 번 후려쳐 3초 동안 느리게 한다.' });
SK65('wagonfort', { name: '포장마차 진지', cls: ['conestoga'], lv: 108, cost: { mp: 26 }, cd: 18, kind: 'buff', stat: 'guard', add: 0.15, dur: 10, tgt: 'party', desc: '웨건을 세워 10초 동안 파티가 받는 피해를 15% 줄인다.' });
SK65('rations', { name: '비상식량', cls: ['conestoga'], lv: 116, cost: { mp: 28 }, cd: 20, kind: 'regen', pct: 0.015, dur: 10, tgt: 'party', cure1: 1, desc: '10초 동안 파티가 1초마다 최대 HP의 1.5%씩 회복하고, 상태이상을 하나씩 푼다.' });
SK65('lassowhip', { name: '올가미 채찍', cls: ['conestoga'], lv: 126, cost: { mp: 22 }, cd: 11, kind: 'dmg', mult: 2.0, tgt: 'front', sta: PARA(0.6, 3), sta2: MARK(6), desc: '채찍으로 휘감아 마비시키고(60% · 3초) 표식을 남긴다(6초, 받는 피해 +20%).' });
SK65('pioneerwit', { name: '개척민의 지혜', cls: ['conestoga'], lv: 136, passive: { healPow: 0.15, camp: 0.2 }, desc: '회복과 보호막이 15% 세지고, 야영 회복이 20% 빨라진다.' });
SK65('westward', { name: '서부로!', cls: ['conestoga'], lv: 146, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 4.8, tgt: 'all', sta: STUN(0.3, 2), after: { stat: 'spd', mult: 1.15, dur: 8, tgt: 'party' }, desc: '웨건이 모든 적을 들이받고(기절 30%), 8초 동안 파티의 공격 속도가 오른다.' });
// 캐러밴 마스터 (4차로 올림)
SK65('stampede', { cost: { mp: 14 }, mult: 3.0 });
SK65('roadlord', { lv: 158, passive: { atkPct: 0.15, carryPct: 0.2 }, desc: '공격력 15%, 짐 20%가 오른다.' });
SK65('wagonlash', { name: '행렬 채찍', cls: ['caravanmaster'], lv: 166, cost: { mp: 30 }, cd: 9, kind: 'dmg', mult: 1.8, hits: 2, slow: 2, tgt: 'all', desc: '행렬을 몰듯 모든 적을 두 번 후려쳐 2초 동안 느리게 한다.' });
SK65('convoy', { lv: 176, cost: { mp: 32 }, add: 0.15, dur: 12, desc: '12초 동안 파티가 받는 피해가 15% 준다.' });
SK65('caravanflag', { name: '대상단의 깃발', cls: ['caravanmaster'], lv: 186, cost: { mp: 40 }, cd: 22, kind: 'buff', stat: 'atk', mult: 1.25, dur: 12, tgt: 'party', more: [{ stat: 'def', mult: 1.25 }], desc: '깃발을 세워 12초 동안 파티의 공격력과 방어력을 25% 올린다.' });
SK65('grandcaravan', { lv: 196, cost: { mp: 70 }, cd: 24, mult: 7.0, desc: '마차 둘과 웨건, 대상단의 행렬이 전장을 휩쓴다. 기절시킬 수 있다.' });
// 짐꾼 (1차): 탱킹 스킬 → 서포트
SKILLS.ironskin.cls = SKILLS.ironskin.cls.filter(c => c !== 'porter');
SKILLS.dw_grit.cls = SKILLS.dw_grit.cls.filter(c => c !== 'porter');
SK65('medkit', { name: '약상자', cls: ['porter'], lv: 14, cost: { mp: 8 }, cd: 12, kind: 'heal', pct: 0.15, tgt: 'ally', cures: ['bleed', 'poison', 'venom'], desc: '가장 다친 동료의 HP를 최대 HP의 15%만큼 채우고 출혈 · 중독을 푼다.' });
SK65('shieldbag', { name: '보급품 나눠 주기', cost: { mp: 18 }, cd: 16, kind: 'heal', pct: 0.1, tgt: 'party', cure1: 1, stat: undefined, mult: undefined, dur: undefined, desc: '보급품을 돌려 파티의 HP를 최대 HP의 10%씩 채우고 상태이상을 하나씩 푼다.' });
// 정찰가 (2차) · 탐험가 (3차): 화살 스킬 → 정글칼 스킬
SK65('ambush', { name: '기습 베기', fx: undefined, desc: '덤불에서 튀어나와 가장 약한 적을 벤다. 치명타가 잘 나고, 6초 동안 표식을 남긴다(받는 피해 +20%).' });
SK65('pathfind', { passive: { movePct: 0.25, eva: 0.04 }, desc: '이동 속도 25%, 회피 4%p가 오른다.' });
SK65('spotweak', { lv: 84 });
SK65('volley', { name: '덤불 쓸기', lv: 92, fx: undefined, sta: BLEED(0.3, 6), desc: '정글칼을 휘둘러 모든 적을 두 번 벤다. 출혈을 남길 수 있다(30%).' });
SK65('farsight', { name: '급소 가르기', fx: undefined, desc: '가장 약한 적의 급소를 가른다. 치명타가 잘 나고, 8초 동안 표식을 남긴다.' });
SK65('mapmaker', { lv: 108, passive: { crit: 0.08, movePct: 0.2 }, desc: '치명타 8%p, 이동 속도 20%가 오른다.' });
SK65('junglecamo', { name: '밀림 위장', cls: ['pathfinder'], lv: 116, cost: { mp: 20 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.15, dur: 8, tgt: 'party', desc: '8초 동안 파티의 회피율이 15%p 오른다.' });
SK65('vinetrap', { name: '덩굴 덫', cls: ['pathfinder'], lv: 136, cost: { mp: 34 }, cd: 13, kind: 'dmg', mult: 1.6, tgt: 'all', sta: PARA(0.4, 2.5), desc: '땅을 쳐 덩굴 덫을 터뜨린다. 모든 적을 마비시킬 수 있다(40% · 2.5초).' });
SK65('summit', { name: '절벽 낙하', lv: 146, fx: 'jump', desc: '뛰어내리며 모든 적을 두 번 벤다. 치명타가 잘 난다.' });
// 소매치기 (2차) · 괴도 (3차) · 대도 (4차)
SK65('pilfer', { desc: '카드로 눈을 돌리고 지갑을 턴다. 때리면서 금화를 슬쩍한다.' });
SK65('cardfan', { name: '카드 부채', cls: ['treasure'], lv: 56, cost: { mp: 10 }, cd: 6, kind: 'dmg', mult: 0.9, hits: 3, crit: 0.1, tgt: 'front', fx: 'card', desc: '카드 세 장을 부채꼴로 던진다. 치명타가 조금 더 난다.' });
SK65('lockpick', { lv: 64, passive: { carryPct: 0.2, chestGold: 0.15 }, desc: '들 수 있는 짐이 20% 늘고, 보물 상자에서 나오는 돈이 15% 늘어난다.' });
SK65('smokebomb', { lv: 72 });
SK65('goldrush', { lv: 84 });
SK65('bottomdeal', { name: '밑장 빼기', cls: ['treasure'], lv: 92, cost: { mp: 20 }, cd: 18, kind: 'buff', stat: 'crit', add: 0.2, dur: 8, tgt: 'self', more: [{ stat: 'steal', mult: 2 }], desc: '8초 동안 치명타가 20%p 오르고 훔치는 돈이 두 배가 된다.' });
SK65('calling', { name: '예고장', cls: ['phantomthief'], lv: 1, cost: { mp: 10 }, cd: 5, kind: 'dmg', mult: 2.6, steal: 4, tgt: 'front', fx: 'card', sta: MARK(8), desc: '예고장을 꽂아 8초 동안 표식을 남기고(받는 피해 +20%) 금화를 훔친다.' });
SK65('jackpot', { cls: ['phantomthief'], lv: 108, cost: { mp: 26 }, mult: 2.8, steal: 12, fx: 'card', desc: '운을 건 한 방. 30%로 세 배 터지고, 금화가 쏟아진다.' });
SK65('disguise', { name: '변장', cls: ['phantomthief'], lv: 116, cost: { mp: 18 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.4, dur: 6, tgt: 'self', more: [{ stat: 'hide', add: 1 }], desc: '6초 동안 회피율이 40%p 오르고, 그동안 적이 덜 노린다.' });
SK65('cardtrick', { name: '카드 마술', cls: ['phantomthief'], lv: 126, cost: { mp: 36 }, cd: 11, kind: 'dmg', mult: 1.2, hits: 3, crit: 0.15, tgt: 'all', fx: 'card', desc: '카드 폭풍이 모든 적을 세 번 벤다. 치명타가 더 난다.' });
SK65('fortune', { cls: ['phantomthief'], lv: 136, passive: { crit: 0.1, critDmg: 0.15 }, desc: '치명타 확률이 10%p, 치명타 피해가 15% 오른다.' });
SK65('magicshow', { name: '세기의 마술쇼', cls: ['phantomthief'], lv: 146, cost: { mp: 60 }, cd: 20, kind: 'dmg', mult: 5.0, steal: 15, tgt: 'all', fx: 'card', after: { stat: 'eva', add: 0.2, dur: 8, tgt: 'party' }, desc: '카드 비가 모든 적에게 쏟아진다. 금화를 쓸어 담고, 8초 동안 파티의 회피율이 20%p 오른다.' });
SK65('grandheist', { cost: { mp: 14 }, mult: 3.6, steal: 10, fx: 'card' });
SK65('phantom', { lv: 158, cost: { mp: 34 }, mult: 3.0, steal: 6, fx: 'card' });
SK65('safecrack', { name: '금고털이', cls: ['masterthief'], lv: 166, passive: { atkPct: 0.15, chestGold: 0.3 }, desc: '공격력이 15% 오르고, 보물 상자 · 보물고에서 나오는 돈이 30% 늘어난다.' });
SK65('thieveshonor', { name: '도둑의 의리', cls: ['masterthief'], lv: 176, cost: { mp: 36 }, cd: 20, kind: 'buff', stat: 'atk', mult: 1.25, haste: 1.15, dur: 10, tgt: 'party', desc: '10초 동안 파티의 공격력과 공격 속도를 올린다.' });
SK65('nightking', { name: '밤의 왕', cls: ['masterthief'], lv: 186, cost: { mp: 40 }, cd: 14, kind: 'dmg', mult: 6.0, exec: 1.5, steal: 20, tgt: 'low', fx: 'card', desc: '그림자를 밟고 가장 약한 적을 친다. 약해진 적(HP 30% 아래)에게 1.5배, 금화도 크게 턴다.' });
SK65('heist', { lv: 196, cost: { mp: 70 }, cd: 24, mult: 6.5, steal: 30, fx: 'card' });
// 닌자 (2차 · 새 직업) · 카게닌자 (3차 · 새 직업). thrown = 부장비 칸의 암기를 쓴다(화살 스킬처럼 던지는 만큼)
SK65('shuriburst', { name: '표창 연발', cls: ['ninja'], lv: 1, cost: { mp: 6 }, cd: 4, kind: 'dmg', mult: 0.8, hits: 3, tgt: 'front', fx: 'shuri', thrown: 1, desc: '암기 셋을 연달아 던진다.' });
SK65('ambushkill', { name: '암습', cls: ['ninja'], lv: 56, cost: { mp: 14 }, cd: 8, kind: 'dmg', mult: 3.0, crit: 0.5, exec: 1.3, tgt: 'low', desc: '적 등 뒤로 사라졌다가 목을 따고 돌아온다. 치명타가 아주 잘 나고, 약해진 적에게 1.3배.' });
SK65('logswap', { name: '통나무 바꾸기', cls: ['ninja'], lv: 64, passive: { subst: 0.3 }, desc: '싸움마다 한 번, 쓰러질 한 방을 통나무가 대신 맞고 HP 30%로 버틴다.' });
SK65('spinshuri', { name: '회전 표창', cls: ['ninja'], lv: 72, cost: { mp: 22 }, cd: 10, kind: 'dmg', mult: 1.0, hits: 2, tgt: 'all', fx: 'shuri', thrown: 1, desc: '큰 표창이 모든 적을 베고 돌아오며 한 번 더 벤다.' });
SK65('deflect', { name: '튕겨내기', cls: ['ninja'], lv: 84, cost: { mp: 20 }, cd: 18, kind: 'buff', stat: 'deflect', add: 1, dur: 4, tgt: 'self', desc: '4초 동안 모든 기본 공격을 단검으로 튕겨 낸다(스킬 · 광역기는 맞는다).' });
SK65('shurimastery', { name: '표창술', cls: ['ninja'], lv: 92, passive: { thrownPct: 0.2, thrownCap: 0.3 }, desc: '암기 피해가 20% 오르고, 암기를 30% 더 지닌다.' });
SK65('shadowshuri', { name: '그림자 표창', cls: ['kageninja'], lv: 1, cost: { mp: 10 }, cd: 5, kind: 'dmg', mult: 1.5, hits: 2, tgt: 'front', fx: 'shuri', thrown: 1, el: 'dark', sta: { k: 'blind', p: 1, d: 5, m: 0 }, desc: '검은 표창 둘. 맞은 적은 5초 동안 눈이 멀어 잘 빗맞힌다.' });
SK65('shadowcut', { name: '그림자 가르기', cls: ['kageninja'], lv: 108, cost: { mp: 24 }, cd: 9, kind: 'dmg', mult: 4.0, crit: 0.3, tgt: 'front', el: 'dark', desc: '발밑 그림자에서 솟아 벤다. 어둠 속성, 치명타가 잘 난다.' });
SK65('shadowhide', { name: '그림자 숨기', cls: ['kageninja'], lv: 116, cost: { mp: 20 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.4, dur: 8, tgt: 'self', more: [{ stat: 'ncrit', add: 1 }], desc: '8초 동안 회피율이 40%p 오르고, 다음 공격은 반드시 치명타가 된다.' });
SK65('phantomshuri', { name: '환영 표창', cls: ['kageninja'], lv: 126, cost: { mp: 36 }, cd: 11, kind: 'dmg', mult: 1.2, hits: 3, tgt: 'all', fx: 'shuri', thrown: 1, el: 'dark', desc: '분신 둘과 함께 모든 적에게 검은 표창을 세 번 던진다.' });
SK65('spacecut', { name: '공간 가르기', cls: ['kageninja'], lv: 136, cost: { mp: 40 }, cd: 13, kind: 'dmg', mult: 3.6, tgt: 'all', armor: 1, desc: '공간째 갈라 모든 적을 벤다. 방어를 무시한다.' });
SK65('thousandshuri', { name: '천 개의 그림자 표창', cls: ['kageninja'], lv: 146, cost: { mp: 64 }, cd: 20, kind: 'dmg', mult: 0.8, hits: 6, crit: 0.2, tgt: 'all', fx: 'shuri', thrown: 1, el: 'dark', desc: '하늘로 뛰어올라 검은 표창을 비처럼 쏟는다. 모든 적을 여섯 번.' });
// 트래커 (2차) · 스토커 (3차)
SK65('huntmark', { name: '추적 표식', desc: '가장 약한 적에게 표식을 꽂는다(8초, 받는 피해 +20%). 치명타가 잘 난다.' });
SK65('wristshot', { name: '손목 석궁', cls: ['mhunter'], lv: 56, cost: { mp: 8 }, cd: 5, kind: 'dmg', mult: 0.9, hits: 2, tgt: 'front', fx: 'bolt', bolt: 1, armor: 1, desc: '활을 쏘는 사이 손목 석궁으로 볼트 두 발. 방어를 무시한다. (손목 석궁 · 볼트가 있어야 쓴다)' });
SK65('trapnet', { lv: 64 });
SK65('biggame', { lv: 72 });
SK65('skinning', { lv: 84 });
SK65('volleytrap', { lv: 92 });
SK65('dragonpierce', { name: '급소 관통', desc: '급소를 꿰뚫어 8초 동안 표식을 남긴다. 치명타가 잘 난다.' });
SK65('holdbreath', { name: '숨죽이기', cls: ['dslayer'], lv: 108, cost: { mp: 18 }, cd: 16, kind: 'buff', stat: 'eva', add: 0.3, dur: 6, tgt: 'self', more: [{ stat: 'nmul', mult: 2 }], desc: '몸을 낮춰 6초 동안 회피율이 30%p 오르고, 다음 공격이 두 배로 꽂힌다.' });
SK65('wyrmbane', { name: '사냥감의 눈', lv: 116 });
SK65('slayrain', { name: '볼트 소나기', lv: 126, desc: '화살과 볼트를 모든 적에게 두 번 퍼붓는다.' });
SK65('chaintrap', { name: '사슬 덫', cls: ['dslayer'], lv: 136, cost: { mp: 34 }, cd: 14, kind: 'dmg', mult: 1.4, tgt: 'all', slow: 6, sta: PARA(0.4, 3), desc: '사슬 덫을 던져 모든 적을 6초 동안 느리게 하고 마비시킬 수 있다(40% · 3초).' });
SK65('dragonheart', { name: '심장 꿰뚫기', lv: 146, desc: '가장 약한 적의 심장을 꿰뚫는 한 발. 치명타가 잘 난다.' });
// 랑기수 (2차) · 용기수 (3차)
SK65('beastshot', { name: '질주 사격', desc: '늑대가 달리는 사이 가장 약한 적에게 두 발. 치명타가 잘 난다.' });
SK65('trap', { name: '늑대 돌진', lv: 56, cost: { mp: 12 }, cd: 9, kind: 'dmg', mult: 1.9, tgt: 'front', fx: 'melee', sta: STUN(0.3, 1.5), dur: undefined, slow: undefined, dk: undefined, desc: '늑대가 앞의 적을 덮친다. 기절시킬 수 있다(30% · 1.5초).' });
SK65('camouflage', { name: '울부짖음', lv: 72, cost: { mp: 16 }, kind: 'buff', stat: 'atk', mult: 1.2, add: undefined, haste: 1.1, dur: 8, tgt: 'party', desc: '늑대가 고개를 젖혀 운다. 8초 동안 파티의 공격력과 공격 속도가 오른다.' });
SK65('instinct', { name: '늑대와 한 몸', lv: 84, passive: { spdPct: 0.1, eva: 0.05, petDmg: 0.3 }, desc: '공격 속도 10%, 회피 5%p가 오르고 늑대가 무는 피해가 30% 는다.' });
SK65('arrowstorm', { name: '달빛 사냥', lv: 92, mult: 1.0, hits: 3, sta: BLEED(0.3, 6), desc: '늑대와 적 사이를 누비며 모든 적에게 세 번 쏜다. 출혈을 남길 수 있다(30%).' });
SK65('jump', { name: '하늘 사격', cost: { mp: 8 }, mult: 1.7, hits: 2, crit: 0.15, tgt: 'low', fx: 'arrow', desc: '높이서 가장 약한 적에게 두 발 내리쏜다. 치명타가 조금 더 난다.' });
SK65('gale', { name: '돌풍 화살', lv: 108, fx: 'arrow', desc: '날갯바람을 탄 화살이 모든 적을 꿰뚫는다. 바람 속성.' });
SK65('dragonscale', { name: '하늘의 눈', lv: 116, cost: { mp: 22 }, cd: 16, kind: 'dmg', mult: 0.8, tgt: 'all', fx: 'arrow', sta: MARK(8), passive: undefined, desc: '높이 떠올라 내려다보며 모든 적에게 8초 동안 표식을 남긴다(받는 피해 +20%).' });
SKILLS.skyfall.cls = [];   // 하늘 낙하(창): 나중에 창 직업으로. 이미 배운 것은 남는다
SK65('wyvernfall', { lv: 126, mult: 1.8, hits: 2, sta: STUN(0.3, 1.5), after: { stat: 'ground', add: 1, dur: 2, tgt: 'self' }, desc: '와이번이 급강하해 발톱으로 모든 적을 두 번 할퀸다. 기절시킬 수 있다. 내려온 2초 동안은 기본 공격을 맞는다.' });
SK65('dragonblood', { name: '하늘의 주인', lv: 136, passive: { crit: 0.08, spdPct: 0.1, petDmg: 0.3 }, desc: '치명타 8%p, 공격 속도 10%가 오르고 와이번의 공격 피해가 30% 는다.' });
SK65('dragonfall', { name: '불타는 하늘', lv: 146, cost: { mp: 64 }, cd: 20, mult: 1.2, hits: 6, tgt: 'all', fx: 'arrow', el: 'blaze', boss: undefined, sta: { k: 'burn', p: 0.3, d: 8, m: 0.2 }, desc: '와이번이 뿜은 불길 속으로 화살비를 쏟는다. 모든 적을 여섯 번, 화상을 입힐 수 있다.' });
// 저격수: 데드아이(패시브)는 나중에 거너 계열로 — 그 자리에 첫 화살
SKILLS.deadeye.cls = [];
SK65('firstarrow', { name: '첫 화살', cls: ['sniper'], lv: 92, passive: { firstCrit: 1, critDmg: 0.15 }, desc: '싸움마다 첫 공격은 반드시 치명타가 되고, 치명타 피해가 15% 오른다.' });
// ── 장비: 낄 수 있는 직업
GTYPES.sword.cls = GTYPES.sword.cls.filter(c => c !== 'duelist');                    // 쌍검사 · 검무사 = 쌍단검
GTYPES.lance.cls = GTYPES.lance.cls.filter(c => c !== 'ranger');                     // 용기수 = 복합궁 (창은 기사만)
GTYPES.bow.cls = ['archer'];                                                          // 정찰가 · 탐험가 = 정글칼
for (const b of ['quiver', 'arrows', 'firearrows', 'icearrows', 'boltarrows']) if (GTYPES[b]) GTYPES[b].cls = ['archer'];
GTYPES.shield.cls = GTYPES.shield.cls.filter(c => c !== 'coachman');                 // 짐꾼 계열은 방패 없음
WEAPON_LOW.machete = 'club';
GTYPES.card.who = GTYPES.lockpick.who = '소매치기 · 괴도 · 대도';
GTYPES.compbow.who = '랑기수 · 용기수';
for (const b of ['compound', 'wxbow', 'bcase', 'bolt']) GTYPES[b].who = '트래커 · 스토커';
GTYPES.whip.who = '마부 · 코네스토가 · 캐러밴 마스터';
// 보조 단검: 쌍검사 · 검무사의 부장비 칸 (그림 · 이름은 단검 16단계 그대로 — 늪지 단계부터)
GTYPES.dagger2 = { name: '보조 단검', slot: 'off', cls: ['duelist'], st: { atk: 1.9, agi: 0.4, crit: 0.004 }, w: 1, icon: 'dagger', mat: [2, 1, 0], tmin: 6, who: '쌍검사 · 검무사', desc: '왼손에 쥐는 둘째 단검 — 쌍검사 · 검무사가 부장비 칸에 낀다.' };
WICON.dagger2 = WICON.dagger; WLV.dagger2 = WLV.dagger; WDESC.dagger2 = WDESC.dagger; WNAME.dagger2 = WNAME.dagger.map(n => n + ' (왼손)'); UNIQ_T0.dagger2 = 0;
GTYPE_IDS.splice(GTYPE_IDS.indexOf('shuriken') + 1, 0, 'dagger2'); CRAFT_IDS.splice(CRAFT_IDS.indexOf('shuriken') + 1, 0, 'dagger2');
STORY.v65.push(
  '직업 개편: 보물 사냥꾼 → 소매치기 · 괴물사냥꾼 → 트래커 · 드래곤 슬레이어 → 스토커 · 레인저 → 랑기수 · 용기병 → 용기수로 이름이 바뀌었어요(모험가 · 배운 스킬은 그대로).',
  '새 직업: 괴도(소매치기 → 괴도 → 대도) · 닌자 → 카게닌자(도적에서) · 코네스토가(마부 → 코네스토가 → 캐러밴 마스터). 대도 · 캐러밴 마스터는 4차 전직(Lv150 · 백금 · 3,000,000G · 주인의 혼 4 · 별의 정원 주인의 핵)이 되었고, 4차는 Lv200까지 자라요. 이미 전직한 모험가는 그대로예요.',
  '정찰가 · 탐험가는 정글칼만 들어요(활 · 화살 · 화살 스킬 없음, 스킬은 베기로 바뀜). 용기수는 창 대신 복합궁, 쌍검사 · 검무사는 단검 + 보조 단검(부장비)을 써요. 못 끼게 된 장비는 창고로 옮기고 새 무기를 드렸어요.',
  '짐꾼 계열은 방패 · 엄호 없이 늘 맨 뒤에서 돕는 서포터예요(약상자 · 보급품 나눠 주기 · 비상식량). 야영 텐트 효과는 마부 · 코네스토가 · 캐러밴 마스터가 맡아요.',
  '새 스킬 36개 · 바뀐 스킬 35개: 암기를 던지는 스킬(닌자)은 부장비 칸의 암기를, 손목 석궁 스킬은 볼트를 써요. 스킬 그림 · 탈것(늑대 · 와이번) 모습 · 새 숙련은 다음에 넣어요.'
);
