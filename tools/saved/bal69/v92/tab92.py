import json, glob, os
exec(open('an91.py').read().split("V = {v: load(v)")[0])   # load · old
V = {v: load(v) for v in ('now', 'o23', 'o234')}
HEAL = {12: ['힐러'], 20: ['힐러'], 30: ['힐러'], 45: ['힐러'], 60: ['사제', '역병의사'], 80: ['사제', '역병의사'], 90: ['사제', '역병의사'], 100: ['대주교', '명의'], 120: ['대주교', '명의'], 130: ['대주교', '명의'], 146: ['대주교', '명의']}
def avg(v, t, comps, slv, k='reach'):
    xs = [V[v].get((t, c, slv)) for c in comps]; xs = [x[k] for x in xs if x]
    return sum(xs) / len(xs) if xs else None
f = lambda x: '—' if x is None else ('0' if abs(x) < 0.05 else f"{x:+.1f}".replace('-', '−'))
def cell(v, t, comps):
    if v == 'o23' and t < 100: v = 'o234'
    return f"{f(avg(v, t, comps, 1))} / {f(avg(v, t, comps, 5))}"
print('| 파티 | 힐러 파티 지금 | 2 · 3 넣음 | 2 · 3 · 4 넣음 | 힐러 + 근접 지금 | 2 · 3 | 2 · 3 · 4 |')
for t in sorted(HEAL):
    H = HEAL[t]; M = ['힐러근접']
    print(f"| Lv{t} | " + ' | '.join(cell(v, t, H) for v in ('now', 'o23', 'o234')) + ' | ' + ' | '.join(cell(v, t, M) for v in ('now', 'o23', 'o234')) + ' |')
print()
for t in sorted(HEAL):
    print(t, 'taken/s sl5', [round(avg(v if not (v=='o23' and t<100) else 'o234', t, HEAL[t], 5, 'taken') or 0) for v in ('now','o23','o234')], 'fsec', [round(avg(v if not (v=='o23' and t<100) else 'o234', t, HEAL[t], 5, 'fsec') or 0,1) for v in ('now','o23','o234')])
print()
for lab, comps in [('흡혈', ['흡혈']), ('힐러없음', ['힐러없음'])]:
    print(lab, [cell(v, 146, comps) for v in ('now', 'o23', 'o234')])
for v in ('now', 'o23', 'o234'):
    print(v, 'clear146 sl5', [(c, V[v].get((146, c, 5), {}).get('clear')) for c in ('대주교', '명의', '힐러근접', '힐러없음', '흡혈')])
