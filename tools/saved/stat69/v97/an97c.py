"""v97 셋째 묶음(11-15 11:29 답): 계열별 MP · 흡혈 직업 방어 낮추기 · 걷기 ×4 · ×6 — 10번 평균"""
import json, glob, gzip, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
R = {}
if os.path.isdir(D + '/out2'):
    for f in sorted(glob.glob(D + '/out2/*.json')):
        try: R[os.path.basename(f)[:-5]] = json.loads(open(f).read())
        except Exception as e: print('ERR', f, e)
else: R = json.load(gzip.open(D + '/results97.json.gz', 'rt', encoding='utf-8'))
def avg(L, k=2): return round(st.mean(L), k) if L else None
def summ(n):
    runs = R.get(n)
    if not runs: return None
    rows = []
    for i, c in enumerate(x['cls'] for x in runs[0]['rows']):
        g = [r['rows'][i] for r in runs]; lz = [x['leech'] for x in g if x.get('leech')]
        rows.append({'cls': c, 'mp': avg([x['mp'] for x in g if x['mp'] is not None]), 'mpLow': avg([x['mpLow'] for x in g]), 'casts': avg([x['casts'] for x in g]), 'dps': round(avg([x['dps'] for x in g])), 'downs': avg([x['downs'] for x in g]), 'taken': avg([x.get('takenPct', 0) for x in g]),
                     'leech': avg([l['perSec'] for l in lz]) if lz else None, 'top': avg([l['top'] for l in lz]) if lz else None})
    return {'n': len(runs), 't': avg([r['t'] for r in runs]), 'stage': avg([r['stage'] + (r['dun'] or 0) for r in runs]), 'wiped': sum(r['wiped'] for r in runs), 'cleared': sum(r['cleared'] for r in runs),
            'walk': avg([r['walk'] for r in runs], 4), 'fight': avg([r['fight'] for r in runs], 4), 'camp': avg([r['camp'] for r in runs], 4), 'dps': round(avg([sum(x['dps'] for x in r['rows']) for r in runs])), 'downs': avg([sum(x['downs'] for x in r['rows']) for r in runs]), 'rows': rows}
out, A = [], {}
def P(*a): out.append(' '.join(str(x) for x in a))
P('== 계열별 MP (마법사 · 성직자 계열 배 · 그 밖 배; 600초)')
for lvn in ('L100', 'L150'):
    for v in ('C0', 'C1', 'C2', 'C4', 'C5', 'C3'):
        a, b = summ(f'mp_{lvn}_{v}_cd'), summ(f'mp_{lvn}_{v}_cd50'); A[f'{lvn}_{v}'] = (a, b)
        if not a or not b: continue
        P(f"{lvn} {v}: 스테이지 {a['stage']} → 쿨50 {b['stage']} · 피해/초 {a['dps']:,} → {b['dps']:,} ({(b['dps']/a['dps']-1)*100:+.0f}%) · 쓰러짐 {a['downs']} → {b['downs']}")
        for x, y in zip(a['rows'], b['rows']): P(f"    {x['cls']}: MP {x['mp']}% → {y['mp']}% · 바닥 {x['mpLow']}% → {y['mpLow']}% · 스킬 {x['casts']} → {y['casts']}/초 · 피해/초 {x['dps']:,} → {y['dps']:,}")
P('== 흡혈 직업 방어 낮추기 (피의 군주 · 리치 방어 배; 600초)')
for s in ('heal', 'noheal', 'bossheal', 'bossnoheal'):
    for v in ('L0b', 'L1b', 'D1', 'D2', 'D3', 'D4'):
        a = summ(f'ls_{s}_{v}'); A[f'ls_{s}_{v}'] = a
        if not a: continue
        ls = ' · '.join(f"{x['cls']} 흡혈 {x['leech']}%/초 · 한 번 {x['top']}% · 받은 피해 {x['taken']}%/초 · 쓰러짐 {x['downs']} · 피해/초 {x['dps']:,}" for x in a['rows'] if x['leech'] is not None)
        P(f"{s} {v}: {a['t']}초 · 스테이지 {a['stage']} · 전멸 {a['wiped']}/{a['n']} · 쓰러짐 {a['downs']} · 야영 {a['camp']*100:.1f}% | {ls}")
P('== 걷기 (900초)')
for pn in ('L100', 'L150', 'farm'):
    for v in ('W0', 'W1', 'W2', 'W3', 'W4', 'W5'):
        a = summ(f'walk_{pn}_{v}'); A[f'walk_{pn}_{v}'] = a
        if not a: continue
        P(f"{pn} {v}: {a['t']}초 · 걷기 {a['walk']*100:.1f}% · 싸움 {a['fight']*100:.1f}% · 야영 {a['camp']*100:.1f}% · 스테이지(던전 포함) {a['stage']} · 다 깸 {a['cleared']}/{a['n']}")
open(D + '/an97c.txt', 'w').write('\n'.join(out) + '\n'); json.dump(A, open(D + '/an97c.json', 'w'), ensure_ascii=False)
print('\n'.join(out))
