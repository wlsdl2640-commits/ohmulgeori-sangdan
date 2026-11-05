"""화살 스킬 고른 것 (사용자가 시트에 동그라미 친 번호로 확정). catalog MODS 맨 끝에 둔다.
2026-11-05 23:57: pick_arrow_1·2 → 9개 / 2026-11-06 00:04: pick_arrow_redo_1 → 별똥별 화살 3, 거신 낙하 3 (= var_ar2 의 _7)
2026-11-06 00:13: 유성우 = var_ar5 3번 (_19, 위를 겨눈 별자리 활)"""
import var_ar as V, var_ar2 as V2, var_ar5 as V5
PICK = {'stormarrows': (V, 1), 'beastshot': (V, 4), 'arrowstorm': (V, 2), 'divinearrow': (V, 1), 'summit': (V, 2), 'dragonpierce': (V, 2), 'driveshot': (V, 1),
        'giantslayer': (V, 2), 'piercing': (V, 1), 'starfall': (V2, 7), 'titanfall': (V2, 7), 'awk_archer': (V5, 19)}
NAMES = {'stormarrows': '폭풍 화살', 'beastshot': '짐승 사냥', 'arrowstorm': '화살 폭우', 'divinearrow': '신궁의 화살', 'summit': '정상 등반', 'dragonpierce': '용 관통',
         'driveshot': '몰이 사격', 'giantslayer': '거대 사냥', 'piercing': '관통 사격', 'starfall': '별똥별 화살', 'titanfall': '거신 낙하', 'awk_archer': '유성우'}
ICONS = {k: (NAMES[k], 'dmg', getattr(m, f'{k}_{n}')) for k, (m, n) in PICK.items()}
