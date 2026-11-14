"""조합 밀기 조각 만들기: python3 mksw92.py <출력 폴더> → <출력>/sw/<단계>_NNN.js (window.SW) + <출력>/jobs.txt
   단계: t55 · t80 = 2차 직업 열아홉 · 눅눅한 늪지대 Lv55 · 용암 화산 Lv80 1층부터 (t55는 drive93.sh — 독 면역 몬스터가 없는 땅) / t100 · t120 · t146 = 3차 직업 열아홉 · 구름섬 Lv100 · 천둥 봉우리 Lv120 · 별의 정원 Lv146 30층부터.
   직업 넷을 고르는 모든 조합(같은 직업 겹침 포함 — 열아홉에서 넷 = 7,315가지), 조각마다 250조합. 짐꾼 계열은 뺐다(파티 전투원 넷 · 짐꾼은 따로)."""
import json, os, sys, itertools
OUT = sys.argv[1]; os.makedirs(f'{OUT}/sw', exist_ok=True)
F2 = 'gladiator knight berserker spellblade ranger sniper mhunter huntsman assassin duelist treasure ninja elementalist necromancer sorcerer elemancer priest plaguedoc exorcist'.split()
F3 = 'champion paladin bloodlord arcblade dragoon hawkeye dslayer kaijuhunter shadowlord bladedancer phantomthief kageninja elementlord lich archmage alchemist archbishop physician inquisitor'.split()
TIERS = [('t55', 55, 'swamp', 1, F2), ('t80', 80, 'volcano', 1, F2), ('t100', 100, 'sky', 1, F3), ('t120', 120, 'thunder', 1, F3), ('t146', 146, 'stargarden', 30, F3)]
CH, SECS, SLV, SM = 250, 2400, 3, 3
jobs = []
for t, lv, fid, st, F in TIERS:
    combos = [list(c) for c in itertools.combinations_with_replacement(F, 4)]
    for i in range(0, len(combos), CH):
        n = f'{t}_{i // CH:03d}'; jobs.append(n)
        cfg = {'lv': lv, 'fid': fid, 'st': st, 'secs': SECS, 'slv': SLV, 'sm': SM, 'combos': combos[i:i + CH]}
        open(f'{OUT}/sw/{n}.js', 'w').write('window.SW = ' + json.dumps(cfg) + ';\n')
open(f'{OUT}/jobs.txt', 'w').write('\n'.join(jobs) + '\n')
print(len(jobs), 'chunks')
