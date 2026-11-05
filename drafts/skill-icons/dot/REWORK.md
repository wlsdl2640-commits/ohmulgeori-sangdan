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
fix_f.py: berserk kn_charge arcane awk2_mage quickstep sprint focus tactics roar colosseum devotion frenzy bloodfeast (A·B에서 손봤지만 전과 거의 같아 보여 새로)
