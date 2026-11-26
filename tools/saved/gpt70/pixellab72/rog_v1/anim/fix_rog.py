# 도적 정리 뒤 손보기: 효과가 몸을 덮어 지우면 구멍 · 남은 자국이 생기는 장은 옆 장(정리한 것)으로 바꾼다.  python fix_rog.py  (clean_rog.py 다음)
import shutil
R = {'hurt/v2': {1: 4, 2: 4, 3: 4}, 'backhand/v2': {6: 7}, 'smoke/v7': {11: 12}, 'counter/v1': {11: 12}, 'thunder/v3': {6: 7}, 'stab/v1': {11: 12}, 'needle/k2a': {9: 8, 10: 8, 11: 12}}
for d, m in R.items():
    for f, src in m.items(): shutil.copy(f'clean/{d}/{src:02d}.png', f'clean/{d}/{f:02d}.png')
print('ok')
