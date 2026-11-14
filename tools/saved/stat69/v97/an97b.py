"""v97 비교 정리 (10번 평균): python3 an97b.py → an97b.txt · an97b.json"""
import json, glob, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
R = {}
if os.path.isdir(D + '/out2'):
    for f in sorted(glob.glob(D + '/out2/*.json')):
        try: R[os.path.basename(f)[:-5]] = json.loads(open(f).read())
        except Exception as e: print('ERR', f, e)
else:
    import gzip; R = json.load(gzip.open(D + '/results97.json.gz', 'rt', encoding='utf-8'))
A = {}
def avg(L, k=2): return round(st.mean(L), k) if L else None
for n, runs in R.items():
    cls = [x['cls'] for x in runs[0]['rows']]
    rows = []
    for i, c in enumerate(cls):
        g = [r['rows'][i] for r in runs]
        lz = [x['leech'] for x in g if x['leech']]
        rows.append({'n': avg([x['leech']['n'] for x in g if x['leech']]) if any(x['leech'] for x in g) else None, 'cls': c, 'maxMp': round(avg([x['maxMp'] for x in g])), 'mp': avg([x['mp'] for x in g if x['mp'] is not None]), 'mpLow': avg([x['mpLow'] for x in g]), 'casts': avg([x['casts'] for x in g]), 'dps': round(avg([x['dps'] for x in g])), 'downs': avg([x['downs'] for x in g]),
                     'leech': {'perSec': avg([l['perSec'] for l in lz]), 'top': avg([l['top'] for l in lz]), 'cut': round(avg([l['cut'] for l in lz]))} if lz else None})
    A[n] = {'n': len(runs), 't': avg([r['t'] for r in runs]), 'stage': avg([r['stage'] + (r['dun'] or 0) for r in runs]), 'cleared': sum(r['cleared'] for r in runs), 'wiped': sum(r['wiped'] for r in runs),
            'walk': avg([r['walk'] for r in runs], 4), 'fight': avg([r['fight'] for r in runs], 4), 'camp': avg([r['camp'] for r in runs], 4), 'dps': round(avg([sum(x['dps'] for x in r['rows']) for r in runs])), 'downs': avg([sum(x['downs'] for x in r['rows']) for r in runs]), 'rows': rows}
out = []
def P(*a): out.append(' '.join(str(x) for x in a))
P('== MP (600초 · 10번 평균, cd50 = 쿨감 30% → 50%만큼 재사용 ×0.71)')
for lvn in ('L100', 'L150'):
    for v in ('M0', 'M1', 'M2', 'M3', 'M4', 'G1', 'G2', 'G3'):
        a, b = A.get(f'mp_{lvn}_{v}_cd'), A.get(f'mp_{lvn}_{v}_cd50')
        if not a or not b: continue
        P(f"{lvn} {v}: 스테이지 {a['stage']} → 쿨50 {b['stage']} · 피해/초 {a['dps']:,} → {b['dps']:,} ({(b['dps']/a['dps']-1)*100:+.0f}%) · 쓰러짐 {a['downs']} → {b['downs']}")
        for x, y in zip(a['rows'], b['rows']): P(f"    {x['cls']}: 최대 MP {x['maxMp']:,} · MP {x['mp']}% → {y['mp']}% · 바닥(10% 아래) {x['mpLow']}% → {y['mpLow']}% · 스킬 {x['casts']} → {y['casts']}/초 · 피해/초 {x['dps']:,} → {y['dps']:,}")
P('== 흡혈 (600초 · 10번 평균; heal = 피의 군주 · 리치 · 성기사 · 대주교 별의 정원 / noheal = 피의 군주 · 리치 · 성기사 · 대마도사 천둥 봉우리)')
for s in ('heal', 'noheal'):
    for v in ('L0', 'L1', 'L2', 'L3', 'L4'):
        a = A.get(f'ls_{s}_{v}')
        if not a: continue
        ls = ' · '.join(f"{x['cls']} 흡혈 {x['n']}번 · 초당 {x['leech']['perSec']}% · 한 번 최대 {x['leech']['top']}% · 피해/초 {x['dps']:,} · 쓰러짐 {x['downs']}" for x in a['rows'] if x['leech'])
        P(f"{s} {v}: {a['t']}초 · 스테이지 {a['stage']} · 전멸 {a['wiped']}/{a['n']} · 피해/초 {a['dps']:,} · 쓰러짐 {a['downs']} | {ls}")
P('== 걷기 (900초 · 10번 평균; W1 걷기 ×2.5 · W2 ×2.5 + 이동 속도 ×3)')
for pn in ('L100', 'L150', 'farm'):
    for v in ('W0', 'W1', 'W2'):
        a = A.get(f'walk_{pn}_{v}')
        if not a: continue
        P(f"{pn} {v}: {a['t']}초 · 걷기 {a['walk']*100:.1f}% · 싸움 {a['fight']*100:.1f}% · 야영 {a['camp']*100:.1f}% · 스테이지(던전 포함) {a['stage']} · 다 깸 {a['cleared']}/{a['n']}")
open(D + '/an97b.txt', 'w').write('\n'.join(out) + '\n'); json.dump(A, open(D + '/an97b.json', 'w'), ensure_ascii=False)
print('\n'.join(out))
