# 도적 · 마법사 · 궁수 · 짐꾼 계열 무기 · 부장비 그림 (빌드 65 · 장비 개편 2단계)

사용자 11-12 14:15 「이것들 다 적용시켜」 — 시안만 있던 무기 14종 · 부장비 9종을 게임에 넣는다(전사 계열은 빌드 64 `../warricon64`).

- `icon/` — 시안 원본 사본(equip-draft 가지 `drafts/equip/icon/`와 같다 · `sheet.py`의 글꼴 폴더만 환경 변수 `GALMURI_DIR`로 바꿨다). 시안을 고치면 equip-draft에도 올린다.
- `export_gear65.py <출력 src/data-wicon65.js> [미리보기.png]` — 시안 모듈(mk*.py)이 판을 만들 때 넘기는 (그림, 꼬리표, 이름, 설명)을 가로채 `WICON` · `WNAME` · `WDESC` · `WLV`에 더한다(전사 계열 data-wicon.js와 같은 꼴 — 20 × 20, 손으로 고치지 말 것).
  - 16단계(Lv1 ~ 150): dagger 단검 · staff 스태프 · bow 단궁 · shuriken 암기 · tome 마법 두루마리 · arrows 화살
  - 16단계(Lv50 ~ 200, 게임은 늪지 단계부터 앞 10개): card 트럼프 카드 · wand 완드 · orb 오브 · necro 네크로노미콘 · compbow 복합궁 · longbow 장궁 · greatbow 대궁 · compound 컴파운드 보우 · whip 채찍 · machete 정글칼 · lockpick 락핀 · offer 공물 · spirit 정령 · wxbow 손목 석궁 · bcase 볼트통 · bolt 볼트
  - 그림 하나: rs_fire · rs_ice · rs_light · rs_poison(룬소드 넷, `rs4.py`) · sk_ice · sk_fire · sk_bolt · sk_poison · sk_wind · sk_dark(속성 특별 암기 여섯, `sk2.py`)
- 게임 쪽: `src/data-gear65.js`(종류 · 쓰는 직업 · 능력치 · 떨어뜨리는 표 · 대장간 목록 · 볼트통 · 볼트 칸 · 손목 석궁 · 특별 암기 · 룬소드).
- 아직 안 쓴 시안: 원형(틀) 판 · 예전 카드 한 장 · 세 장 그림(스킬 그림으로 돌림) · 화살통 16단계(아직 안 그림).
