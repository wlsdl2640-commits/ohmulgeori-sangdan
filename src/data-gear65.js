/* ───────── 도적 · 마법사 · 궁수 · 짐꾼 계열 장비 개편 (빌드 65 · 장비 개편 2단계) ─────────
   사용자 11-12 14:15 「이것들 다 적용시켜. 그리고 라운드 실드는 이걸로 적용해」 — 시안만 있던 무기 14종 · 부장비 9종을 게임에 넣는다.
   그림 · 이름 · 설명은 시안 그대로(data-wicon65.js ← tools/saved/gearicon65/export_gear65.py), 쓰는 직업은 11-10 ~ 11-11 결정(CLAUDE.md 「장비 개편 방향」)을 지금 있는 직업에 맞췄다.
   - 1차부터 쓰는 것(견습 Lv1 ~ 성좌 16단계): 단검 · 스태프(옛 지팡이) · 단궁(옛 활) / 암기(옛 표창) · 마법 두루마리(옛 마법서) · 화살 — 종류 id는 그대로(저장 호환), 이름 · 그림만 바뀐다.
   - 2차 직업부터 쓰는 것(늪지 Lv52 단계부터 — UNIQ_T0 6, 그림 16개 가운데 앞 10개가 지금 단계에 쓰인다):
     트럼프 카드 · 락핀(보물 사냥꾼 · 대도) · 완드 · 정령(정령술사 · 정령왕) · 오브(원소술사 · 연금술사) · 네크로노미콘 · 공물(네크로맨서 · 리치)
     복합궁(레인저 · 용기병) · 장궁(저격수 · 신궁) · 대궁(사냥꾼 · 괴수사냥꾼) · 컴파운드 보우 · 손목 석궁 · 볼트통 · 볼트(괴물사냥꾼 · 드래곤 슬레이어)
     채찍(마부 · 캐러밴 마스터) · 정글칼(정찰가 · 탐험가).
   - 그림이 하나뿐인 것: 속성 대검 넷(시안의 룬소드 — 광전사 · 피의 군주의 두 손 대검, Lv50 · 100 · 150 · 200 단계에 하나씩) · 속성 특별 암기 여섯(도적 계열, 대장간에서 — 단계와 상관없이 같은 그림 · 이름).
   새 직업(괴도 · 닌자 · 카게닌자 · 코네스토가) · 직업 이름 바꾸기(소매치기 · 트래커 · 스토커 · 랑기수 · 용기수) · 새 스킬 · 쌍단검 · 무기마다 공격 동작은 직업 개편 때 —
   손에 든 모습 · 동작: 채찍 · 정글칼 · 카드 · 완드 · 오브 · 네크로노미콘은 제 그림과 동작(pxs-wpn65.js — 11-12 17:23 넣음), 새 활 · 속성 대검은 가까운 옛 무기 그림을 빌린다(pxa.js PX_WALIAS). */

// 라운드 실드: 사용자가 준 새 그림(tools/saved/shield_round65 → ARMART.shield 16장). 이름은 그대로, 생김새 설명만 새 그림에 맞춘다
GTYPES.shield.art = 'shield';
WDESC.shield = ['나무 판자를 세로로 이어 붙인 첫 방패. 쇠 테 · 가운데 쇠 돌기', '마을 경비대의 푸른 방패 · 흰 고리 둘 · 쇠 테 · 쇠 돌기', '참나무 판자에 쇠띠 둘을 엇갈려 박았다 · 쇠 테 · 가운데 징', '놋쇠를 두들긴 원판 · 햇살 돋을새김 · 놋쇠 테',
  '붉게 칠한 판자에 쇠띠 둘 · 쇠 테 · 거친 쇠 돌기', '흰 자작나무 판자 · 검은 쇠띠 · 칸마다 징 · 은 돌기', '은을 입힌 원판 · 네 갈래 별 돋을새김 · 푸른 보석', '금빛 햇살 여덟 갈래 · 가운데 붉은 보석 · 금 테',
  '잿빛 늑대 머리 · 금빛 월계 가지 · 은 테', '금을 입힌 원판 · 금빛 별 살 · 가운데 루비', '검은 흑단 판 · 은빛 네 갈래 별 · 자수정 · 은 테', '초록 비늘빛 판에 금 덩굴 띠 · 가운데 에메랄드 · 금 테',
  '푸른 바탕에 금빛 사자 · 돌처럼 굳은 흰 나무 테', '그을린 검붉은 판 · 달아오른 붉은 띠 · 불씨빛 네 갈래 별', '밤하늘빛 판에 금빛 큰 별 · 별 점 · 금 테', '전설의 영웅이 든 금빛 원판 · 흰 날개 한 쌍 · 사파이어'];

// 이름이 바뀌는 옛 종류 (id 그대로): 활 → 단궁 · 지팡이 → 스태프 · 표창 → 암기 · 마법서 → 마법 두루마리
Object.assign(GTYPES.bow, { name: '단궁', bow: 1, desc: '짧고 가벼운 활. 궁수가 처음 드는 활이다.' });
Object.assign(GTYPES.staff, { name: '스태프', desc: '마력을 모으는 긴 지팡이.' });
Object.assign(GTYPES.dagger, { desc: '짧은 칼. 찌르개 · 송곳 · 잎 · 휜 날 · 주먹 단검까지 꼴이 여럿이다.' });
Object.assign(GTYPES.shuriken, { name: '암기', thrown: 1, desc: '던지는 암기 — 표창 · 쿠나이 · 침 · 차크람. 기본 공격마다 하나를 더 던진다.' });
Object.assign(GTYPES.tome, { name: '마법 두루마리', desc: '주문을 적어 말아 둔 두루마리.' });
Object.assign(GTYPES.arrows, { desc: '궁수 계열이 함께 쓰는 화살. 나무 화살에서 카본 화살까지.' });

// 새 무기 (2차 직업부터 · 늪지 단계부터)
Object.assign(GTYPES, {
  card:     { name: '트럼프 카드', slot: 'weapon', cls: ['treasure'], st: { atk: 3.7, agi: 0.7, crit: 0.008 }, w: 1, icon: 'dagger', mat: [1, 1, 1], who: '보물 사냥꾼 · 대도', desc: '칼처럼 날을 세운 카드 한 벌. 벌마다 앞면 그림이 다르다.' },
  wand:     { name: '완드', slot: 'weapon', cls: ['elementalist'], st: { matk: 4.6, int: 1.0, mp: 6 }, w: 1, icon: 'staff', mat: [1, 0, 3], who: '정령술사 · 정령왕', desc: '스태프보다 짧고 가는 지팡이. 정령을 부르는 데 쓴다.' },
  orb:      { name: '오브', slot: 'weapon', cls: ['elemancer'], st: { matk: 5.0, int: 0.7, mp: 4 }, w: 2, icon: 'gem', mat: [0, 1, 3], who: '원소술사 · 연금술사', desc: '원소를 가둔 구슬. 구슬 속 빛깔이 속성이다.' },
  necro:    { name: '네크로노미콘', slot: 'weapon', cls: ['necromancer'], st: { matk: 4.8, int: 0.8, vit: 0.5, mp: 3 }, w: 2, icon: 'book', mat: [0, 2, 2], who: '네크로맨서 · 리치', desc: '죽은 자의 이름이 적힌 금서.' },
  compbow:  { name: '복합궁', slot: 'weapon', cls: ['ranger'], st: { atk: 4.1, agi: 0.9 }, w: 2, icon: 'bow', mat: [2, 2, 0], bow: 1, who: '레인저 · 용기병', desc: '뿔과 힘줄을 덧대 되휜 활. 짧아도 세다.' },
  longbow:  { name: '장궁', slot: 'weapon', cls: ['sniper'], st: { atk: 4.3, agi: 0.5, crit: 0.006 }, w: 3, icon: 'bow', mat: [2, 2, 0], bow: 1, who: '저격수 · 신궁', desc: '사람 키만 한 긴 활. 멀리, 정확하게.' },
  greatbow: { name: '대궁', slot: 'weapon', cls: ['huntsman'], st: { atk: 4.7, str: 0.6 }, w: 4, icon: 'bow', mat: [3, 2, 0], bow: 1, who: '사냥꾼 · 괴수사냥꾼', desc: '큰 짐승을 잡는 굵고 긴 활.' },
  compound: { name: '컴파운드 보우', slot: 'weapon', cls: ['mhunter'], st: { atk: 4.4, agi: 0.6, crit: 0.004 }, w: 3, icon: 'bow', mat: [3, 1, 1], bow: 1, who: '괴물사냥꾼 · 드래곤 슬레이어', desc: '끝에 도르래가 달린 활. 화살은 궁수 공통 화살을 쓴다.' },
  whip:     { name: '채찍', slot: 'weapon', cls: ['coachman'], st: { atk: 4.0, agi: 0.8 }, w: 2, icon: 'club', mat: [0, 3, 1], who: '마부 · 캐러밴 마스터', desc: '마부의 채찍. 가죽 · 쇠사슬 · 가시까지.' },
  machete:  { name: '정글칼', slot: 'weapon', cls: ['scout'], st: { atk: 4.3, str: 0.4, agi: 0.6 }, w: 2, icon: 'sword', mat: [3, 1, 0], melee: 1, who: '정찰가 · 탐험가', desc: '덤불을 쳐내는 넓은 칼 — 정글칼 · 쿠크리 · 볼로. 이 칼을 들면 기본 공격이 근접 베기가 된다.' }
});
// 속성 대검 넷 (사용자 11-12 15:26 「룬소드 전부 전사 대검 계열로 옮기고. 룬소드가 아닌 대검으로 변경하고 속성부여는 일단 그대로 둬. LV은 50 100 150 200으로 설정」):
// 시안의 룬소드 넷을 광전사 · 피의 군주의 두 손 대검으로 — 능력치는 대검과 같고, 검마다 속성 하나(기본 공격이 맞으면 그 속성 추가 피해 = 공격력 × ELEM_SWORD_MUL + 낮은 확률의 상태이상. 독은 속성 표에 없어 무속성 + 중독).
// 검마다 한 단계에만 있다(UNIQ_ONLY): 지옥의 업화 Lv50 · 혹한의 결정 Lv100 · 광휘의 여명 Lv150 · 극독의 어금니 Lv200 — Lv150 · 200 단계는 아직 없어 단계가 생기면 나온다. id rs_*는 그대로
const ELEM_SWORD_MUL = 0.2;
const ELEM_SWORDS = ['rs_fire', 'rs_ice', 'rs_light', 'rs_poison'];
const _rs = (el, sta, txt) => ({ name: '대검', slot: 'weapon', cls: ['berserker', 'bloodlord'], st: { atk: 5.6, str: 1.0, agi: -0.4 }, w: 5, icon: 'sword', mat: [4, 1, 1], two: 1, rune: { el, sta }, who: '광전사 · 피의 군주', desc: `속성이 깃든 대검(두 손) — ${txt}` });
Object.assign(GTYPES, {
  rs_fire:   _rs('fire', { k: 'burn', p: 0.12, d: 6, m: 0.2 }, '기본 공격이 맞으면 불 속성 추가 피해 · 12%로 화상.'),
  rs_ice:    _rs('ice', { k: 'chill', p: 0.12, d: 3 }, '기본 공격이 맞으면 빙결 속성 추가 피해 · 12%로 냉기.'),
  rs_light:  _rs('light', { k: 'blind', p: 0.1, d: 4 }, '기본 공격이 맞으면 빛 속성 추가 피해 · 10%로 눈멂.'),
  rs_poison: _rs('none', { k: 'poison', p: 0.15, d: 8, m: 0.25 }, '기본 공격이 맞으면 추가 피해 · 15%로 중독.')
});
Object.assign(UNIQ_ONLY, { rs_fire: 50, rs_ice: 100, rs_light: 150, rs_poison: 200 });
const wpnRune = a => { const g = a && a.eq && a.eq.weapon; return (g && GTYPES[g.base] && GTYPES[g.base].rune) || null; };
// 마나소드 (사용자 11-12 15:26 「마검사 무기를 룬소드에서 마나오러, 빛등이 사출되는 광선검으로 변경한다. 이름은 마나소드」 · 17:23 「3개안건 전부 넣는데」):
// 마검사 · 마검성의 한 손 검 — 작은 자루에서 마나 날이 뿜어 나온다. 그림 16개(Lv50 ~ 200, 늪지부터 — 지금 단계에는 앞 10개)는 큰 도트(data-hdart65.js HDART.manasword).
// 능력치: 장검(공격 4.2)보다 공격은 조금 위, 마력을 함께 싣는다(마검사의 기본 공격 = 공격 + 마법 공격 × 혼합). 검술 숙련이 켜진다
GTYPES.manasword = { name: '마나소드', slot: 'weapon', cls: ['spellblade'], st: { atk: 4.6, matk: 1.6, int: 0.4 }, w: 2, icon: 'sword', mat: [2, 0, 3], art: 'manasword', who: '마검사 · 마검성', desc: '작은 자루에서 마나 날이 뿜어 나오는 빛의 검. 날마다 빛깔 · 꼴이 다르다.' };
// 화살통: 16단계 큰 도트 그림 · 고유 이름(data-hdart65.js HDART.quiver · WNAME.quiver) — 견습 단계부터
GTYPES.quiver.art = 'quiver';
Object.assign(GTYPES.quiver, { desc: '궁수 계열이 함께 쓰는 화살통. 화살을 25% 더 담는다.' });

// 새 부장비 · 새 칸 둘(볼트통 · 볼트 — 괴물사냥꾼 계열에게만 보인다)
SLOTS.splice(SLOTS.findIndex(s => s[0] === 'ammo') + 1, 0, ['bcase', '볼트통'], ['bolt', '볼트']);
SLOTS65.push('bcase', 'bolt');   // 입을 수 있는 직업에게만 보이는 칸 (slotShown · notes65가 옛 모험가에게 빈 칸을 만든다)
Object.assign(GTYPES, {
  lockpick: { name: '락핀', slot: 'off', cls: ['treasure'], st: { agi: 0.7, crit: 0.005, eva: 0.003 }, w: 1, icon: 'blade', mat: [2, 0, 1], who: '보물 사냥꾼 · 대도', desc: '자물쇠 따개 — 갈고리 · 갈퀴 따개, 머리핀, 만능 열쇠.' },
  offer:    { name: '공물', slot: 'off', cls: ['necromancer'], st: { matk: 2.8, int: 0.5, hp: 3, mp: 4 }, w: 1, icon: 'bone', mat: [0, 1, 3], who: '네크로맨서 · 리치', desc: '죽은 자에게 바치는 공물 — 해골 · 잔 · 초 · 뼈.' },
  spirit:   { name: '정령', slot: 'off', cls: ['elementalist'], st: { matk: 2.6, int: 0.7, mp: 6, mres: 0.002 }, w: 1, icon: 'drop', mat: [0, 0, 4], who: '정령술사 · 정령왕', desc: '곁에 떠 있는 작은 정령 — 불꽃 · 방울 · 날개 · 바위 · 구름.' },
  wxbow:    { name: '손목 석궁', slot: 'off', cls: ['mhunter'], st: { atk: 1.2, crit: 0.004 }, w: 1, icon: 'bow', mat: [2, 1, 0], xbow: 1, who: '괴물사냥꾼 · 드래곤 슬레이어', desc: '손목에 차는 작은 석궁. 볼트 칸에 볼트가 있으면 기본 공격마다 한 발을 더 쏜다.' },
  bcase:    { name: '볼트통', slot: 'bcase', cls: ['mhunter'], st: { agi: 0.5, crit: 0.002 }, w: 1, icon: 'horn', mat: [0, 3, 0], capPct: 0.25, fcat: 'off', who: '괴물사냥꾼 · 드래곤 슬레이어', desc: '허리에 차는 볼트통. 볼트를 25% 더 담는다.' },
  bolt:     { name: '볼트', slot: 'bolt', cls: ['mhunter'], st: { atk: 1.4 }, w: 1, icon: 'feather', mat: [1, 1, 0], ammo: 1, unit: '발', capSlot: 'bcase', who: '괴물사냥꾼 · 드래곤 슬레이어', desc: '손목 석궁에 메기는 짧은 화살.' }
});
// 속성 특별 암기 여섯 (사용자 11-10 19:09 — 속성 화살처럼 따로 얻는다: 대장간에서 만들거나 산다 · 몬스터는 떨어뜨리지 않는다).
// 던지는 한 발이 그 속성이 되고(약점 ×1.5 · 같은 계열 면역), 맞히면 낮은 확률로 상태이상. 담는 양은 보통 암기의 60%, 값은 2배. 자동 장착은 고르지 않는다(속성이 있어서)
const _sk = (el, sta, txt, x) => Object.assign({ name: '특별 암기', slot: 'off', cls: ['rogue'], st: { atk: 1.0, crit: 0.004 }, w: 1, icon: 'blade', mat: [2, 0, 1], ammo: 1, unit: '개', thrown: 1, el, sta, capMul: 0.6, priceMul: 2, desc: txt }, x || {});
Object.assign(GTYPES, {
  sk_ice:    _sk('ice', { k: 'chill', p: 0.12, d: 3 }, '빙결 속성 암기 — 12%로 냉기.'),
  sk_fire:   _sk('fire', { k: 'burn', p: 0.12, d: 6, m: 0.2 }, '불 속성 암기 — 12%로 화상.'),
  sk_bolt:   _sk('thunder', { k: 'shock', p: 0.1, d: 2 }, '번개 속성 암기 — 10%로 감전.'),
  sk_poison: _sk('none', { k: 'poison', p: 0.18, d: 8, m: 0.25 }, '독을 바른 침 — 18%로 중독.'),
  sk_wind:   _sk('wind', null, '바람 속성 암기 — 꿰뚫고 지나가 적 둘을 맞힌다.', { pierce: 1 }),
  sk_dark:   _sk('dark', { k: 'blind', p: 0.12, d: 4 }, '어둠 속성 암기 — 12%로 눈멂(명중 −20%p).')
});
const SPECIAL_THROWN = ['sk_ice', 'sk_fire', 'sk_bolt', 'sk_poison', 'sk_wind', 'sk_dark'];
// 단계마다 고유 이름 · 그림 (data-rpg.js UNIQ_T0 — 0 = 견습부터, 6 = 늪지부터)
Object.assign(UNIQ_T0, { dagger: 0, staff: 0, bow: 0, shuriken: 0, tome: 0, arrows: 0,
  card: 6, wand: 6, orb: 6, necro: 6, compbow: 6, longbow: 6, greatbow: 6, compound: 6, whip: 6, machete: 6, lockpick: 6, offer: 6, spirit: 6, wxbow: 6, bcase: 6, bolt: 6,
  rs_fire: 6, rs_ice: 6, rs_light: 6, rs_poison: 6 /* 고유 그림 표시만 — 나오는 단계는 UNIQ_ONLY */, sk_ice: 0, sk_fire: 0, sk_bolt: 0, sk_poison: 0, sk_wind: 0, sk_dark: 0,
  manasword: 6, quiver: 0 });
// 담는 수: 볼트 · 특별 암기는 암기와 같은 표 (특별 암기는 capMul 0.6)
AMMO_CAP.bolt = AMMO_CAP.shuriken; for (const b of SPECIAL_THROWN) AMMO_CAP[b] = AMMO_CAP.shuriken;
const XBOW_MUL = 0.3;   // 손목 석궁 한 발 = 공격력 × 2.5(기본 공격) × 0.3 (암기와 같다)

// 떨어뜨리는 표 · 대장간 목록: 짝이 되는 옛 종류 다음에. 속성 대검은 제 단계에서만 걸린다(tierOk) · 특별 암기는 대장간에만
{
  const ins = (L, after, ...ids) => L.splice(L.indexOf(after) + 1, 0, ...ids.filter(b => !L.includes(b)));
  for (const L of [GTYPE_IDS, CRAFT_IDS]) {
    const craft = L === CRAFT_IDS;
    ins(L, 'great', ...ELEM_SWORDS);
    ins(L, 'sword', 'manasword');
    ins(L, 'bow', 'compbow', 'longbow', 'greatbow', 'compound');
    ins(L, 'staff', 'wand', 'orb', 'necro');
    ins(L, 'dagger', 'card');
    ins(L, 'axe', 'whip', 'machete');
    ins(L, 'quiver', 'wxbow', 'bcase');
    ins(L, 'tome', 'offer', 'spirit');
    ins(L, 'shuriken', ...(craft ? SPECIAL_THROWN : []), 'lockpick');
    ins(L, 'arrows', 'bolt');
  }
}
// 직업이 처음 받는 무기가 그 단계에 없을 때 드는 무기 (data-warr.js WEAPON_LOW · econ.js WEAPON_OF)
Object.assign(WEAPON_LOW, { card: 'dagger', wand: 'staff', orb: 'staff', necro: 'staff', compbow: 'bow', longbow: 'bow', greatbow: 'bow', compound: 'bow', whip: 'club', manasword: 'sword' });
Object.assign(WEAPON_LOW, { lute: 'club', lance: 'sword', machete: 'club' });   // 빌드 67: 늪지 아래 단계에서 무기 없이 전직하면 — 예전엔 음유시인에게 못 드는 장검을 줬다
// 숙련: 궁술 = 모든 활 · 검술 = 속성 대검까지 (채찍 · 정글칼 · 카드 · 완드 · 오브 · 금서 숙련은 스킬 개편 때)
Object.assign(MASTERY.bow, { w: ['bow', 'compbow', 'longbow', 'greatbow', 'compound'], wn: '활', desc: '단궁 · 복합궁 · 장궁 · 대궁 · 컴파운드 보우 — 활이면 무엇이든.' });
MASTERY.sword.w = MASTERY.sword.w.concat(ELEM_SWORDS, ['manasword']);

/* 부장비가 쏘는 한 발 (core.js basicAct 끝에서 부른다 — 직업 특성은 안 탄다):
   암기(도적 계열 · thrown) = 부장비 칸의 암기를 하나 던진다 / 손목 석궁(xbow) = 볼트 칸의 볼트를 한 발 쏜다. 남은 적 중 가장 약한 적에게.
   특별 암기는 그 속성(el) · 상태이상(sta) · 꿰뚫기(pierce: 적 둘). 다 떨어지면 「암기 없음!」 · 「볼트 없음!」 */
function offShot(e, a, d, foes) {
  const o = a.eq && a.eq.off, T = o && GTYPES[o.base]; if (!T) return;
  const am = T.thrown ? o : T.xbow ? a.eq.bolt : null; if (!isAmmo(am)) return;   // 손목 석궁만 차고 볼트를 안 끼웠으면 아무 일도 없다
  const key = T.thrown ? 'shuri' : 'bolt';
  if (!ammoLeft(am, a)) { noAmmo(e, a, key); return; }
  if (!useAmmo(am, a, 1)) return;
  const live = foes.filter(x => x.hp > 0); if (!live.length) return;
  const first = lowestFoe(live), tgs = T.pierce ? [first].concat(live.filter(x => x !== first).sort((x, y) => x.hp - y.hp).slice(0, 1)) : [first];   // 꿰뚫기: 가장 약한 적과 그다음 적
  const el = (T.thrown && T.el) || 'none', atk = d.atk * buffMul(e, a.id, 'atk');
  const twice = T.thrown ? d.thrown2 : d.bolt2;   // 빌드 65 숙련: 암기술 달인 · 석궁술 상급부터 — 한 번 더
  for (const tg of tgs) {
    const c = rnd() < d.crit + buffAdd(e, a.id, 'crit'), v = hitFoe(e, tg, atk * BASIC_MULT * (T.thrown ? SHURI_MUL * (1 + (d.thrownPct || 0)) : XBOW_MUL * (1 + (d.boltPct || 0))), c, false, null, el, !T.thrown && d.boltPen ? { pen: d.boltPen } : undefined);   // 석궁술: 볼트 피해 · 방어 무시
    ev(e, 'hit', Object.assign({ s: a.id, d: tg.uid, v, c, k: 'arrow', sid: key }, el !== 'none' ? { el } : {}, hitTag()));
    if (v && T.thrown && T.sta && tg.hp > 0 && rnd() < T.sta.p) inflictFoe(e, tg, T.sta, atk, a.id, key);
  }
  if (twice && rnd() < twice && !d.__2) offShot(e, a, Object.assign({}, d, { __2: 1 }), foes);
}

STORY.v65.push(
  '장비 개편 2단계 — 도적 · 마법사 · 궁수 · 짐꾼 계열의 무기와 부장비에도 단계마다 고유 이름과 그림이 생겼다. 활은 「단궁」, 지팡이는 「스태프」, 표창은 「암기」(표창 · 쿠나이 · 침 · 차크람), 마법서는 「마법 두루마리」가 되었고, 단검 · 화살도 단계마다 새 그림이다.',
  '2차 직업 장비(늪지 Lv52 단계부터 — 몬스터 · 대장간 · 합성에서 얻는다): 소매치기 · 괴도 · 대도 = 트럼프 카드 + 락핀 / 정령술사 · 정령왕 = 완드 + 정령 / 원소술사 · 연금술사 = 오브 / 네크로맨서 · 리치 = 네크로노미콘 + 공물 / 랑기수 · 용기수 = 복합궁 / 저격수 · 신궁 = 장궁 / 사냥꾼 · 괴수사냥꾼 = 대궁 / 트래커 · 스토커 = 컴파운드 보우 / 마부 · 코네스토가 · 캐러밴 마스터 = 채찍 / 정찰가 · 탐험가 = 정글칼.',
  '트래커 · 스토커에게는 장비 칸이 둘 더 있다 — 「볼트통」과 「볼트」. 부장비 칸에 손목 석궁을 차고 볼트를 끼우면 기본 공격마다 볼트 한 발을 더 쏜다(암기와 같다). 볼트는 화살처럼 쓴 만큼 상단에서 다시 채운다.',
  '정찰가 · 탐험가는 정글칼로 벤다(활 · 화살을 쓰지 않는다). 궁술 숙련은 모든 활에 켜진다.',
  '속성 대검 넷(광전사 · 피의 군주 · 두 손): 지옥의 업화(불 · 화상, Lv50 단계) · 혹한의 결정(빙결 · 냉기, Lv100 단계) · 광휘의 여명(빛 · 눈멂, Lv150) · 극독의 어금니(중독, Lv200) — 기본 공격이 맞으면 그 속성 추가 피해가 붙는다. 제 단계에서만 나오고, Lv150 · 200 단계는 아직 없다. 속성 특별 암기 여섯(고드름 · 불씨 쿠나이 · 벼락 침 · 독침 · 바람 표창 · 그림자 쿠나이)은 대장간에서 만들거나 산다.',
  '라운드 실드가 새 그림이 되었다(이름 · 능력치는 그대로). 장비 · 물건 칸의 틀이 조금 커져서 그림이 틀을 넘지 않는다.',
  '마검사 · 마검성의 무기는 「마나소드」 — 작은 자루에서 마나 날이 뿜어 나오는 빛의 검(늪지 단계부터, 단계마다 이름 · 그림이 다르다). 들고 있던 늪지 단계 이상 장검은 같은 단계의 마나소드로 바뀌었다. 화살통도 단계마다 새 그림 · 이름이 생겼다.',
  '채찍 · 정글칼 · 트럼프 카드 · 완드 · 오브 · 네크로노미콘을 든 모습과 공격 동작이 새로 생겼다 — 카드는 손끝에 한 장을 사선으로 들고, 펼치면 세 장(가운데 한 장 + 왼쪽 · 오른쪽 사선)을 펼쳤다 접었다 한다. 던진 카드는 적에게 날아간다.'
);
