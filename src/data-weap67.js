/* ───────── 무기 그림 20종 (빌드 67, 사용자 11-13 11:54 「우선 이장비들 적용시켜서」 — 무기 판 20장) ─────────
   그림 · 이름은 data-wart67.js(← tools/saved/weapart67/export_wart.py, 판에서 그대로 오린 큰 그림). 여기서는 종류에 달기만 한다(data-class65.js 다음 — 보조 단검이 있어야).
   - 그림을 다는 종류: 장검 · 철퇴 · 몽둥이 · 단검(보조 단검도) · 도끼 · 창 · 단궁 · 복합궁 · 장궁 · 대궁 · 컴파운드 보우 · 손목 석궁 · 스태프 · 완드 · 오브 · 네크로노미콘 · 트럼프 카드 · 류트 · 채찍 · 정글칼.
     칸에는 도트로 굽지 않고 얹는다(sprites.js armArtURL → rarity.js · panels.js gImg, 경갑 · 화살통과 같은 길). 진열대 10×10 작은 그림 · 손에 든 모습은 예전 그대로.
   - 새로 고유 이름이 생기는 종류: 철퇴 · 몽둥이 · 도끼(견습 단계부터, 단계마다) · 창 · 류트(2차 직업 — 착용 레벨마다, 옛 장비 g.lv 없음은 늪지 = 0번).
   - 그림이 새로 바뀐 종류(단궁 · 장궁 · 컴파운드 보우 · 스태프 · 오브 · 트럼프 카드)는 예전 그림을 그린 한 줄 설명(WDESC)을 지운다 — 종류 설명(GTYPES.desc)은 그대로. */
for (const b of Object.keys(GEARART)) if (GTYPES[b]) GTYPES[b].art = b;
GTYPES.dagger2.art = 'dagger';   // 보조 단검 = 단검 그림 (착용 레벨 차례: Lv50 = 녹슨 단검 (왼손))
Object.assign(UNIQ_T0, { mace: 0, club: 0, axe: 0, lance: 6, lute: 6 });
for (const b of ['bow', 'longbow', 'compound', 'staff', 'orb', 'card']) delete WDESC[b];
