# 고칠 것 (사용자 체크, 2026-11-05 21:41)

사용자: "부족한 거 체크했고 화살이 그려진 스킬 대부분 수정 부탁 할게 일단 화살이 너무 이상하게 생겼어."
체크 표시 원본: data/*-image.png (sheet_05,04,03,02,01 순서). 체크는 아이콘 오른쪽 위 → 그 아이콘.

체크 113개 + 체크 안 됐지만 화살 그림 8개 = 121개

1단계: 화살 새로 (arrows.py: 2칸 굵기 자루, 뾰족한 촉, 깃털) → 화살 스킬 전부 다시 → 시트 보내기
2단계: 나머지 체크한 것 계열별로 다시 (상징 크게·자세히, 명암, 대비, 움직임)

## 목록 (id)
berserk kn_charge aimed double poisonarrow stormarrows el_arrow awk_archer awk2_archer flasharrow fireball chain arcane iceprison awk2_mage sanctuary greatheal cure awk_cleric awk2_cleric holyhammer quickstep parasting awk2_rogue voltstab packmule dw_smash sprint focus haste tactics ar_cheer ar_finish bandage roar colosseum shieldbash lancecharge devotion divinity rampage frenzy bloodfeast beastshot trap wolfcall instinct arrowstorm jump dragonscale gale skyfall dragonfall longshot piercearrow divinearrow starfall godseye horsecare gallop cargoshield stampede roadlord ambush spotweak farsight summit parrying swordrain dancemaster smokebomb goldrush grandheist windspirit earthward waterspirit spiritking deathplague huntmark dragonpierce wyrmbane trackshot houndpack wildsense driveshot giantslayer anatomy quaketrap titanfall transmute cureall blackdeath frostblade arcaneguard starward swordsaint prayer grace miracle holyland archangel resurrect remedy epidemic holywater exorcism inquisition fr_song el_breath dw_grit weaken riposte ar_combo rain piercing tripleshot lastarrow volley volleytrap slayrain dragonheart

## 다 고친 것
aimed double poisonarrow rain piercing tripleshot stormarrows el_arrow awk_archer awk2_archer flasharrow beastshot arrowstorm longshot piercearrow divinearrow starfall lastarrow ambush volley summit huntmark volleytrap dragonpierce slayrain dragonheart trackshot driveshot (1단계 화살 끝)
fix_a.py: berserk kn_charge fireball chain arcane iceprison awk2_mage sanctuary greatheal cure awk_cleric awk2_cleric holyhammer quickstep parasting awk2_rogue voltstab
fix_b.py: packmule dw_smash sprint focus haste tactics ar_cheer ar_finish bandage roar colosseum shieldbash lancecharge devotion divinity rampage frenzy bloodfeast
fix_c.py: trap wolfcall instinct jump dragonscale gale skyfall dragonfall godseye horsecare gallop cargoshield stampede roadlord spotweak farsight (창은 spear.py 새로)
fix_d.py: parrying swordrain dancemaster smokebomb goldrush grandheist windspirit earthward waterspirit spiritking deathplague wyrmbane houndpack wildsense giantslayer anatomy quaketrap titanfall transmute
fix_e.py: cureall blackdeath frostblade arcaneguard starward swordsaint prayer grace miracle holyland archangel resurrect remedy epidemic holywater exorcism inquisition fr_song el_breath dw_grit weaken riposte ar_combo
fix_f.py: berserk kn_charge arcane awk2_mage quickstep sprint focus tactics roar colosseum devotion frenzy bloodfeast cure awk_cleric awk2_cleric parasting haste (A·B에서 손봤지만 전과 거의 같아 보여 새로)

# 3단계 (2026-11-05 23:08)
사용자: "화살 스킬을 제외한 모든 스킬들은 확정짓고, 화살 스킬의 화살을 더 얇고 가늘게 만들고, 화살깃을 좀더 길게 뽑아봐."
- 화살 아닌 277개 확정: ../final_snap/*.png 가 확정본 (바꾸지 말 것. 바꿨는지 확인: 화살 아닌 것은 지금 그림과 픽셀이 같아야 한다)
- 화살 3판 (arrows.py, 2판은 arrows_v2.py): 1칸 자루, 미늘 달린 가는 촉, 깃 5칸(작은 화살 3칸) + 흰 띠 + 끝이 젖혀짐, 오늬
- 화살 스킬 30개 (arrows.py를 쓰는 29개 + 거신 낙하): 길이·자리 맞춘 것은 fix_ar.py, 비교 시트 arrows_v3_cmp.png

# 4단계 (2026-11-05 23:36)
사용자: (arrows_v3_cmp 에 체크 → data/arrows_v3_marked.png) "체크한 스킬들 각각 시안을 4개씩 새로 만들어봐 화살은 크기를 좀더 줄여서 넣고, 스킬 배경에 들어가는 짐승, 용, 철갑 등의 이미지를 스킬의 이름에 맞게 더 잘 그려서 보여줘 체크 안한 스킬들은 그대로 저장하고"
- 체크 11개: stormarrows awk_archer beastshot arrowstorm divinearrow starfall summit dragonpierce driveshot giantslayer titanfall
- 애매(관통 사격 오른쪽 아래 · 유성우 오른쪽 위 사이의 체크): 유성우로 봤고, 관통 사격(piercing)도 시안만 같이 만듦 — 고르지 않으면 지금 그림 그대로
- 체크 안 한 화살 스킬 19개 + 화살 아닌 277개 = 확정 (../final_snap, pending.json 에 남은 것 적음)
- 아주 작은 화살 arrows.arrow_xs / arx 추가 (기존 화살 함수는 그대로 → 확정본 픽셀 같음 확인)
- 손그림 짐승·용·괴수: crit.py (멧돼지·수사슴·달리는 사슴·용 머리·나는 용·괴수·돌 거신·외눈 거인·산)
- 시안: var_ar.py (<id>_1..4), 고르기 시트 pick_arrow_1.png · pick_arrow_2.png

# 5단계 (2026-11-05 23:57)
사용자: (pick_arrow_1·2 에 동그라미/X → data/pick_arrow_1_marked.png, pick_arrow_2_marked.png) "체크 한걸로 확정하고, x인 것들은 시안 다시 4개 뽑아서 보내줘."
- 확정 (pick_ar.py): 폭풍 화살 1 · 짐승 사냥 4 · 화살 폭우 2 · 신궁의 화살 1 · 정상 등반 2 · 용 관통 2 · 몰이 사격 1 · 거대 사냥 2 · 관통 사격 1 → ../final_snap 에 반영 (304개 확정)
- X: 유성우 · 별똥별 화살 · 거신 낙하 → var_ar2.py (<id>_5..8, 시트에는 1..4로 보임), pick_arrow_redo_1.png

# 6단계 (2026-11-06 00:04)
사용자: (pick_arrow_redo_1 에 표시 → data/pick_arrow_redo_1_marked.png) 별똥별 화살 3 · 거신 낙하 3 동그라미, 유성우 X
- 확정: starfall = var_ar2.starfall_7 (별자리 활), titanfall = var_ar2.titanfall_7 (지평선 거인 그림자) → pick_ar.py, ../final_snap (306개 확정)
- 유성우 셋째 판: var_ar3.py (awk_archer_9..12, 시트에는 1~4) — 사용자가 고른 것처럼 또렷한 그림자 + 밝은 빛줄기. pick_arrow_redo2_1.png
