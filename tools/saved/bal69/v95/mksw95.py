"""도적 · 궁수 아이디어 시험 조각 만들기: python3 mksw95.py [출력 폴더]  (기본: 이 폴더)

sets.json(11-14 20:03에 한 번 뽑은 표본, 무작위 시드 95)을 조각으로 나눈다.
- rog: 도적 3차(그림자 군주 · 검무사 · 괴도 · 카게닌자)가 하나 이상 + 3차 힐러(대주교 · 명의 · 심판관)가 하나 이상인 네 명 조합 240가지(겹치는 조합 없음)
- arc: 궁수 3차(용기수 · 신궁 · 스토커 · 괴수사냥꾼)가 하나 이상 + 3차 힐러가 하나 이상인 조합 240가지
나머지 자리는 v92와 같은 3차 열아홉(짐꾼 계열 뺌)에서.

→ <출력>/sw/<계열>_<단계>_<0|1>.js (window.SW, 조각마다 120조합) + <출력>/jobs.txt(변형 · 조각 줄)
단계: t100 = 구름섬 Lv100 1층부터 · t146 = 별의 정원 Lv146 30층부터 (둘 다 2400초 · 스킬 3단계 · 숙련도 3 — v92 mksw92.py와 같은 값)
"""
import json, os, sys

D = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else D
TIERS = {'t100': {'lv': 100, 'fid': 'sky', 'st': 1}, 't146': {'lv': 146, 'fid': 'stargarden', 'st': 30}}
VARS = {'rog': ['base', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'], 'arc': ['base', 'A1', 'A2', 'A3', 'A4', 'A5']}
CHUNK = 120

sets = json.load(open(os.path.join(D, 'sets.json')))
os.makedirs(os.path.join(OUT, 'sw'), exist_ok=True)
jobs = []
for fam, combos in sets.items():
    for t, cfg in TIERS.items():
        for i in range(0, len(combos), CHUNK):
            n = f'{fam}_{t}_{i // CHUNK}'
            sw = dict(cfg, secs=2400, slv=3, sm=3, combos=combos[i:i + CHUNK])
            open(os.path.join(OUT, 'sw', n + '.js'), 'w').write('window.SW = ' + json.dumps(sw, ensure_ascii=False) + ';\n')
            jobs += [f'{v} {n}' for v in VARS[fam]]
open(os.path.join(OUT, 'jobs.txt'), 'w').write('\n'.join(jobs) + '\n')
print(len(jobs), 'jobs')
