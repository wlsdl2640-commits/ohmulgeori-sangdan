"""hhcmp.py 기준 변형… — 단계 · 파티마다 도달 · 쓰러짐(d) · 힐러 MP % / MP가 모자라 거른 틱 % / 스킬/분 (11-16 「높은 레벨만 조이기」 비교 — 내 측정)"""
import json, glob, os, sys, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
HEALC = {'cleric', 'priest', 'plaguedoc', 'archbishop', 'physician'}
V = sys.argv[1:]
GZ = None if os.path.isdir(f'{D}/out') else json.load(__import__('gzip').open(f'{D}/results101.json.gz', 'rt', encoding='utf-8'))   # out/이 없으면 저장소에 둔 모음
def load(v):
    R = {}
    rows = GZ['reach'].get(v, []) if GZ is not None else [r for f in sorted(glob.glob(f'{D}/out/{v}/t*.json')) for r in json.load(open(f))]
    for r in rows: R[(r['tier'], r['comp'])] = r['runs']
    return R
A = {v: load(v) for v in V}
keys = sorted(A[V[0]])
print('단계 파티 | ' + ' | '.join(V))
for k in keys:
    cells = []
    for v in V:
        runs = A[v].get(k)
        if not runs: cells.append('—'); continue
        reach = st.mean(x['flv'] for x in runs) - k[0]
        hc = sorted({c for x in runs for c in x['mp'] if c in HEALC})
        mp = ','.join(f"{c[:4]} {st.mean(x['mp'].get(c, 0) for x in runs):.0f}%/{st.mean(x.get('mpb', {}).get(c, 0) for x in runs):.1f}/{st.mean(x['casts'].get(c, 0) for x in runs):.1f}" for c in hc)
        down = st.mean(x['downs'] for x in runs)
        cells.append(f"{reach:+.1f} d{down:.1f} {mp}")
    print(f"{k[0]:>3} {k[1]:<5} | " + ' | '.join(cells))
