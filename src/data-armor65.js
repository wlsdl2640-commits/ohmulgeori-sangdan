/* ───────── 전사 경갑 · 하의 칸 (빌드 65) ─────────
   사용자 11-12 10:29 「전사 경갑 디자인이야 이걸 그대로 게임에 넣어서 레어도넣고 적용할거니까」 · 10:35 「나중에 200까지 늘릴거니까 다 넣어두고
   몬스터가 더 늘어나면 그때 바로 추가하면되」 · 10:50 「다시찍지말고 그대로 사용」.
   - 경갑(상의, 방어구 칸) · 경갑 하의(새 하의 칸): 전사 · 검투사 · 챔피언. 기사 · 광전사 · 마검사 계열은 중갑 · 판금이 나오면 그쪽이라 뺀다(cx).
   - 그림은 사용자가 준 디자인 그대로(ARMART, data-armart.js ← tools/saved/armor_light65/export_armart.py) — 칸에 도트로 굽지 않고 위에 얹는다(sprites.js armArtURL · rarity.js).
   - 디자인 Lv1 · 10 · … · 200 = 21개를 게임 단계 차례대로: 지금 단계 16개(견습 ~ 성좌)에 앞 16개, 나머지 5개는 단계가 늘면 바로 쓴다.
   - 레어도 · 룬 칸 · 합성 · 대장간 · 드랍은 다른 방어구와 같다. 판금 · 가죽 갑옷도 전사 계열이 그대로 입을 수 있다. */
SLOTS.splice(SLOTS.findIndex(s => s[0] === 'armor') + 1, 0, ['legs', '하의']);
const LARMOR_CX = ['knight', 'berserker', 'spellblade'];   // 이 직업과 그 3차(성기사 · 피의 군주 · 마검성)는 못 입는다
GTYPES.larmor = { name: '경갑', slot: 'armor', cls: ['warrior'], cx: LARMOR_CX, st: { def: 3.2, hp: 7, agi: 0.4 }, w: 4, icon: 'vest', mat: [1, 3, 0], art: 'larmor', who: '전사 · 검투사 계열',
  desc: '민첩성을 중시한 가벼운 갑옷. 전사 · 검투사 계열의 기본 방어구.' };
GTYPES.lpants = { name: '경갑 하의', slot: 'legs', cls: ['warrior'], cx: LARMOR_CX, st: { def: 1.4, hp: 3, agi: 0.3 }, w: 2, icon: 'vest', mat: [1, 2, 0], art: 'lpants', who: '전사 · 검투사 계열',
  desc: '가볍고 활동성이 높은 경갑 계열의 하의.' };
GTYPE_IDS.splice(GTYPE_IDS.indexOf('leather') + 1, 0, 'larmor', 'lpants');
CRAFT_IDS.splice(CRAFT_IDS.indexOf('leather') + 1, 0, 'larmor', 'lpants');
// 하의 칸을 쓰는 모험가 (입을 수 있는 하의가 있을 때만 창에 칸이 보인다)
const hasLegs = a => !!a && GTYPE_IDS.some(b => GTYPES[b].slot === 'legs' && gearFits(a, { base: b, t: 0 }));
