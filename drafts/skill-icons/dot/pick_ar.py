"""화살 스킬 고른 것 (사용자 2026-11-05 23:57: 동그라미 친 번호로 확정). catalog MODS 맨 끝에 둔다."""
import var_ar as V
PICK = {'stormarrows': 1, 'beastshot': 4, 'arrowstorm': 2, 'divinearrow': 1, 'summit': 2, 'dragonpierce': 2, 'driveshot': 1, 'giantslayer': 2, 'piercing': 1}
NAMES = {'stormarrows': '폭풍 화살', 'beastshot': '짐승 사냥', 'arrowstorm': '화살 폭우', 'divinearrow': '신궁의 화살', 'summit': '정상 등반', 'dragonpierce': '용 관통',
         'driveshot': '몰이 사격', 'giantslayer': '거대 사냥', 'piercing': '관통 사격'}
ICONS = {k: (NAMES[k], 'dmg', getattr(V, f'{k}_{n}')) for k, n in PICK.items()}
