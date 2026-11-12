# 새 무기 손에 든 모습 · 공격 동작 시안 (빌드 65)

사용자(11-12 15:26): 「손에 든 모습과 공격 동작: 아직 옛 무기 그림을 빌려요(채찍은 몽둥이, 정글칼은 장검, 카드는 단검, 완드 · 오브 · 네크로노미콘은 지팡이). 이거 새동작모션 만들고.」

**시안 — 고르기 전에는 게임에 넣지 않는다.** 게임 빌드(dist/play.html) 위에서 함수를 감싸 그린다.

- `_w62.js` — 채찍 · 정글칼(11-11 시안 `porter_chars/mot62.js`의 몸통, cg1.js 의존 없이). 동작 wcrack 내려 후려치기 · wside 옆으로 후려치기 · wflick 올려 채기 · wtwirl 머리 위로 돌려 치기 · wraise 치켜들기 · mchop 덤불 베기(정글칼은 칼 동작 넷도 씀).
- `mot65.js` — 새 무기 넷: 트럼프 카드(cflick 던지기 · cfan 부채 · cshow 펼쳐 보이기) · 완드(vflick 겨눠 쏘기 · vswirl 원 그려 쏘기 · vraise 치켜들기) · 오브(opush 밀어 쏘기 · olift 들어 올리기 · ospin 돌리기) · 네크로노미콘(bkcast 펼쳐 주문 · bkraise 높이 들기 · bkshut 덮어 내리치기). 앞 · 옆 서 있는 그림(PX_WPN), 동작 그림(pxsMWpn), 효과 축(pxsMAxis), 새 팔레트 글자 D · E · e · T · Y.
- `sheet65.js` · `mot65.py <출력 폴더>` — 시안 판(무기마다 동작 × (앞 · 옆 서 있기 + 8장)) · 여섯 무기가 나란히 동작하는 GIF.
- `M65_whip_machete.png` · `M65_new.png` · `M65_all.gif` — 보낸 시안.

넣을 때: PX_WALIAS에서 card · wand · orb · necro · whip · machete를 빼고, 위 함수들을 pxs.js(pxsMWpn · pxsMAxis · pxsMotFx · pxsAdvGrid 옆 그림) · pxa.js(PX_WPN · pxPal 글자) · view.js(MOT_POOL · MOT_OWN · MOT_ROLE · MOT_FAMR — 카드 던지기는 투사체 dart)로 옮긴다.
