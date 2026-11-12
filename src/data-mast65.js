/* ───────── 새 숙련 15개 · 달인 단계 (빌드 65, 사용자 11-12 17:23 「새 숙련 15개 … 다 추가」) ─────────
   스킬 시안 문서 「스킬 시안 — 새 직업 · 바뀐 직업」의 숙련 표 그대로(무기 9 · 부장비 4 · 직업 2). 단계는 초급 Lv10 · 중급 Lv50 · 상급 Lv100 · 달인 Lv150(4차 전직),
   값 1,000 · 10,000 · 100,000 · 1,000,000G(data-mast.js MAST_TIERS). 2차부터 쓰는 무기(채찍 · 카드 · 완드 …)는 초급 · 중급을 Lv50에 함께 배울 수 있다.
   바뀐 것: 검술 = 장검 · 마나소드(글라디우스 · 대검은 제 숙련으로) · 방패술 = 라운드 · 버클러 · 십자(에테르 실드는 마력 방패술) — 이미 배운 단계는 새 숙련으로 옮긴다(mast65).
   그림: 시안(skill-icons-draft v67 m_v67.png)을 고르기 전까지 임시 아이템 그림(panels.js mastIconURL).
   새 효과 글자(core.js · data-gear65.js offShot · data-elem.js elemMul가 쓴다):
     slowHit 기본 공격에 맞은 적이 1.5초 느려질 확률 · bleedHit 기본 공격 출혈 확률 · stealPct 훔치는 돈 + · chestExtra 보물고 상자 하나 더 확률
     thrownTwice 암기를 한 번 더 던질 확률 · comboMax 연계 한도 + · offDmg 둘째 칼(보조 단검) 피해 + · arenaFame 투기장 랭킹 점수 +
     shieldPow 거는 보호막 세기 + · boltPct 볼트 피해 + · boltPierce 볼트 방어 무시 · boltTwice 볼트 한 발 더 확률 · petTwice 탈것이 한 번 더 공격할 확률
     spiritPct 정령 스킬 피해 + · weakPct 약점 피해 + · immPierce 면역 꿰뚫기 · mdrain 마법 피해 흡수 · dotPct 지속 피해 + · wagonSpd · wagonCap 마차 속도 · 짐 + */
Object.assign(MASTERY, {
  whip:     { name: '채찍술', w: ['whip'], icon: 'club', fx: [{ atkPct: 0.04 }, { atkPct: 0.08, slowHit: 0.2 }, { atkPct: 0.12, slowHit: 0.3 }, { atkPct: 0.16, slowHit: 0.35, crit: 0.03 }], desc: '끈 끝으로 때리고 휘감는다. 중급부터 기본 공격에 맞은 적이 가끔 1.5초 느려진다.' },
  wagon:    { name: '마차 몰기', job: ['coachman'], icon: 'bag', fx: [{ wagonSpd: 0.04 }, { wagonSpd: 0.08, wagonCap: 0.1 }, { wagonSpd: 0.12, wagonCap: 0.2 }, { wagonSpd: 0.16, wagonCap: 0.3 }], desc: '고삐를 잡는 요령. 이 모험가가 모는 파티 마차가 빨라지고 짐을 더 싣는다.' },
  machete:  { name: '정글칼술', w: ['machete'], icon: 'sword', fx: [{ atkPct: 0.03, movePct: 0.03 }, { atkPct: 0.06, movePct: 0.05, bleedHit: 0.1 }, { atkPct: 0.1, movePct: 0.08, bleedHit: 0.15 }, { atkPct: 0.14, movePct: 0.1, bleedHit: 0.2 }], desc: '덤불을 쳐내며 길을 낸다. 중급부터 기본 공격이 가끔 출혈을 남긴다.' },
  cards:    { name: '카드술', w: ['card'], icon: 'dagger', fx: [{ crit: 0.03 }, { crit: 0.05, stealPct: 0.2 }, { crit: 0.08, spdPct: 0.06, stealPct: 0.4 }, { crit: 0.1, spdPct: 0.1, stealPct: 0.6 }], desc: '손끝으로 카드를 날리고 바꿔 친다. 중급부터 훔치는 돈이 늘어난다.' },
  lockpick: { name: '따개 솜씨', w: ['lockpick'], wn: '락핀', icon: 'blade', fx: [{ chestGold: 0.1 }, { chestGold: 0.2, eva: 0.02 }, { chestGold: 0.3, eva: 0.04, chestExtra: 0.15 }, { chestGold: 0.4, eva: 0.06, chestExtra: 0.25 }], desc: '자물쇠를 따는 손. 보물 상자 · 보물고에서 돈을 더 챙기고, 상급부터 보물고 상자를 하나 더 찾는다.' },
  shuriken: { name: '암기술', w: ['shuriken'], wn: '암기', icon: 'blade', fx: [{ thrownPct: 0.08 }, { thrownPct: 0.15, thrownCap: 0.2 }, { thrownPct: 0.25, thrownCap: 0.4 }, { thrownPct: 0.35, thrownCap: 0.6, thrownTwice: 0.1 }], desc: '던지는 암기를 다루는 법. 암기 피해가 오르고 더 많이 지닌다.' },
  twin:     { name: '쌍수술', w: ['dagger2'], wn: '보조 단검', icon: 'dagger', fx: [{ spdPct: 0.04 }, { spdPct: 0.07, comboMax: 1 }, { spdPct: 0.1, comboMax: 1, offDmg: 0.2 }, { spdPct: 0.13, comboMax: 2, offDmg: 0.2 }], desc: '두 손에 단검을 쥐고 엇갈려 벤다. 중급부터 연계가 더 쌓이고, 상급부터 둘째 칼이 세진다.' },
  gladius:  { name: '글라디우스술', w: ['gladius'], icon: 'sword', fx: [{ atkPct: 0.04 }, { atkPct: 0.07, counter: 0.04 }, { atkPct: 0.1, counter: 0.06, arenaFame: 0.1 }, { atkPct: 0.14, counter: 0.08, arenaFame: 0.1 }], desc: '투기장의 짧은 칼. 찌르고 받아친다. 상급부터 투기장 랭킹 점수를 더 얻는다.' },
  great:    { name: '대검술', w: ['great'], icon: 'sword', fx: [{ atkPct: 0.05 }, { atkPct: 0.1 }, { atkPct: 0.15, exec: 0.1 }, { atkPct: 0.2, exec: 0.15 }], desc: '두 손 대검의 무게를 실어 벤다. 상급부터 약해진 적을 끝낸다.' },
  ether:    { name: '마력 방패술', w: ['ether'], wn: '에테르 실드', icon: 'gem', fx: [{ shieldPow: 0.06 }, { shieldPow: 0.12, mpPct: 0.05 }, { shieldPow: 0.18, mpPct: 0.08, block: 0.03 }, { shieldPow: 0.24, mpPct: 0.1, block: 0.05 }], desc: '작은 구슬로 마나 막을 편다. 거는 보호막이 세진다.' },
  xbow:     { name: '석궁술', w: ['wxbow'], wn: '손목 석궁', icon: 'bow', fx: [{ boltPct: 0.08 }, { boltPct: 0.15, boltPierce: 0.1 }, { boltPct: 0.25, boltPierce: 0.2, boltTwice: 0.15 }, { boltPct: 0.35, boltPierce: 0.3, boltTwice: 0.25 }], desc: '손목 석궁을 다루는 법. 볼트가 세지고 방어를 뚫는다. 상급부터 볼트를 한 발 더 쏜다.' },
  ride:     { name: '기승술', job: ['ranger'], icon: 'feather', fx: [{ petDmg: 0.08 }, { petDmg: 0.15, eva: 0.02 }, { petDmg: 0.25, eva: 0.04, petTwice: 0.15 }, { petDmg: 0.35, eva: 0.06, petTwice: 0.25 }], desc: '늑대 · 와이번과 한 몸이 된다. 탈것의 공격이 세지고, 상급부터 탈것이 한 번 더 문다.' },
  wand:     { name: '완드술', w: ['wand'], icon: 'staff', fx: [{ matkPct: 0.03, cdr: 0.02 }, { matkPct: 0.06, cdr: 0.02, spiritPct: 0.1 }, { matkPct: 0.1, cdr: 0.04, spiritPct: 0.1 }, { matkPct: 0.14, cdr: 0.06, spiritPct: 0.1 }], desc: '짧은 완드로 정령을 부른다. 중급부터 정령술사 · 정령왕 스킬 피해가 오른다.' },
  orb:      { name: '구슬술', w: ['orb'], icon: 'gem', fx: [{ matkPct: 0.04 }, { matkPct: 0.08, weakPct: 0.1 }, { matkPct: 0.12, weakPct: 0.15, immPierce: 0.05 }, { matkPct: 0.16, weakPct: 0.2, immPierce: 0.1 }], desc: '원소를 가둔 구슬을 다룬다. 약점을 더 세게 치고, 상급부터 면역인 적에게도 조금 들어간다.' },
  tome:     { name: '금서 해독', w: ['necro'], icon: 'book', fx: [{ matkPct: 0.04 }, { matkPct: 0.08, mdrain: 0.04 }, { matkPct: 0.12, mdrain: 0.07, dotPct: 0.15 }, { matkPct: 0.16, mdrain: 0.1, dotPct: 0.25 }], desc: '죽은 자의 금서를 읽는다. 마법 피해 일부를 흡수하고, 상급부터 지속 피해가 세진다.' }
});
MAST_IDS.push('whip', 'wagon', 'machete', 'cards', 'lockpick', 'shuriken', 'twin', 'gladius', 'great', 'ether', 'xbow', 'ride', 'wand', 'orb', 'tome');
// 검술 = 장검 · 마나소드 (글라디우스 · 대검 · 속성 대검은 제 숙련) · 방패술 = 라운드 · 버클러 · 십자 (에테르 실드는 마력 방패술) · 대검술 = 대검 · 속성 대검 · 암기술 = 암기 · 속성 특별 암기
MASTERY.sword.w = ['sword', 'manasword']; MASTERY.sword.desc = '장검 · 마나소드를 쥐는 법부터 베는 각도까지.';
MASTERY.shield.w = MASTERY.shield.w.filter(b => b !== 'ether');
MASTERY.great.w = ['great'].concat(ELEM_SWORDS); MASTERY.great.wn = '대검';
MASTERY.shuriken.w = ['shuriken'].concat(SPECIAL_THROWN);
// 정령 스킬(완드술): 정령술사 · 정령왕의 스킬
const SPIRIT_CLS = ['elementalist', 'elementlord'];
const isSpiritSkill = s => !!s && (s.cls || []).some(c => SPIRIT_CLS.includes(c));
// 이미 배운 단계를 새 숙련으로 (econ.js notes65 — 늘 부른다, 이미 옮겼으면 그대로): 검투사 계열의 검술 → 글라디우스술 · 광전사 계열의 검술 → 대검술 · 마검사 계열의 방패술 → 마력 방패술
function mast65(a) {
  if (!a || !a.mast || !CLASSES[a.cls]) return 0;
  const ch = chainOf(a.cls); let n = 0;
  const move = (from, to) => { if (a.mast[from] && !a.mast[to]) { a.mast[to] = a.mast[from]; n++; } };
  if (ch.includes('gladiator')) move('sword', 'gladius');
  if (ch.includes('berserker')) move('sword', 'great');
  if (ch.includes('spellblade')) move('shield', 'ether');
  return n;
}
STORY.v65.push(
  `새 숙련 15개 — 채찍술 · 마차 몰기 · 정글칼술 · 카드술 · 따개 솜씨 · 암기술 · 쌍수술 · 글라디우스술 · 대검술 · 마력 방패술 · 석궁술 · 기승술 · 완드술 · 구슬술 · 금서 해독. 숙련에 넷째 단계 「달인」(Lv150 · 4차 전직)이 생겼다. 값: ${MAST_TIERS.map(T => `${T.name} ${T.fee.toLocaleString('ko-KR')}G`).join(' · ')}.`,
  '검술은 장검 · 마나소드, 방패술은 라운드 · 버클러 · 십자 방패에만 켜진다 — 글라디우스 · 대검 · 에테르 실드는 제 숙련이 생겼고, 이미 배운 단계는 그 숙련으로 옮겨졌다.'
);
