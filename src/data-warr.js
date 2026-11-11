/* ───────── 전사 계열 장비 개편 (빌드 64 · 장비 개편 1단계) ─────────
   무기 · 방패는 단계마다 고유 이름 · 그림이 있다 (data-wicon.js — tools/saved/warricon64/export_warr.py로 뽑는다).
   1차부터 쓰는 장검 · 라운드 실드는 견습(Lv1)~성좌 16단계, 2차 직업 장비(글라디우스 · 대검 · 버클러 · 십자 방패 · 에테르 실드)는
   늪지(Lv52) 단계부터 — 그 아래 단계로는 떨어지지도, 만들어지지도 않는다(UNIQ_T0 · tierOk, data-rpg.js). 그림 16개(Lv50~200) 가운데 앞 10개가 지금 단계에 쓰인다.
   검투사 · 챔피언 = 버클러 + 글라디우스 · 기사 · 성기사 = 십자 방패 + 장검 · 광전사 · 피의 군주 = 대검(두 손 — 부장비 없음) · 마검사 · 마검성 = 에테르 실드 + 장검(룬소드는 나중에).
   무기 · 방패는 세트 효과(같은 단계 3 · 4점)에 세지 않는다 — 방어구만 세트 (setInfo). */

// 글라디우스: 빌드 63까지 투기장 상단 전용(전사 · 쌍검사도 들었다) → 검투사 · 챔피언 무기. 떨어지고 만들 수 있고, 투기장 상단도 계속 판다(늪지 단계부터)
Object.assign(GTYPES.gladius, { cls: ['gladiator', 'champion'], st: { atk: 4.8, agi: 0.6, crit: 0.006 } });
delete GTYPES.gladius.arena;
// 대검: 광전사 · 피의 군주 (두 손 — 부장비를 함께 끼지 못한다)
GTYPES.great = { name: '대검', slot: 'weapon', cls: ['berserker', 'bloodlord'], st: { atk: 5.6, str: 1.0, agi: -0.4 }, w: 5, icon: 'sword', mat: [4, 1, 0], two: 1 };
GTYPE_IDS.splice(GTYPE_IDS.indexOf('sword') + 1, 0, 'gladius', 'great');
CRAFT_IDS.splice(0, CRAFT_IDS.length, ...GTYPE_IDS.flatMap(b => (b === 'shield' ? SHIELDS : [b])).concat(ELEM_ARROWS));   // 대장간 목록 (단계에 없는 종류는 smithyBox가 뺀다)
MASTERY.sword.w = ['sword', 'gladius', 'great']; MASTERY.sword.wn = '검'; MASTERY.sword.desc = '장검 · 글라디우스 · 대검을 쥐는 법부터 베는 각도까지.';
MASTERY.shield.w = SHIELDS.slice();
const twoHand = g => !!(g && GTYPES[g.base] && GTYPES[g.base].two);
// 두 손 무기를 들면 부장비는 창고로 (창고가 가득 차도 넣는다 — 전직 · 옛 저장처럼 받을 수밖에 없는 경우)
function dropOffFor(a) { if (a && a.eq && twoHand(a.eq.weapon) && a.eq.off) { S.gear.push(a.eq.off); a.eq.off = null; return 1; } return 0; }
// 직업이 처음 받는 무기 (그 단계에 없는 2차 무기는 아래 무기로)
const WEAPON_LOW = { gladius: 'sword', great: 'axe' };
const weaponOf = (c, t = 0) => { const b = WEAPON_OF[c] || 'sword'; return tierOk(b, t) ? b : WEAPON_LOW[b] || 'sword'; };   // WEAPON_OF는 econ.js (쓸 때는 다 읽힌 뒤)
// 장비 창 · 대장간에 보이는 한 줄 설명 (고유 장비만)
const uniqDesc = g => (isUniq(g) && typeof WDESC !== 'undefined' && WDESC[g.base] ? WDESC[g.base][uniqIdx(g)] : '');
