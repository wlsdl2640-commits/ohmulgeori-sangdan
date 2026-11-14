import json, glob, os
exec(open('an91.py').read().split("V = {v: load(v)")[0])   # load · old
V = {v: load(v) for v in ('now', 'e40', 'e50', 'sg1', 'np', 'ma')}
V['old'] = old
HEAL = {12: ['힐러'], 20: ['힐러'], 30: ['힐러'], 45: ['힐러'], 60: ['사제', '역병의사'], 80: ['사제', '역병의사'], 90: ['사제', '역병의사'], 100: ['대주교', '명의'], 120: ['대주교', '명의'], 130: ['대주교', '명의'], 146: ['대주교', '명의']}
def avg(v, t, comps, slv):
    xs = [V[v].get((t, c, slv)) for c in comps]; xs = [x['reach'] for x in xs if x]
    return sum(xs) / len(xs) if xs else None
f = lambda x: '—' if x is None else ('0' if abs(x) < 0.05 else f"{x:+.1f}".replace('-', '−'))
cell = lambda v, t, comps: f"{f(avg(v, t, comps, 1))} / {f(avg(v, t, comps, 5))}"
print('| 파티 | 힐러 파티 예전 | 지금 (민첩 몫 35%) | 민첩 몫 40% | 민첩 몫 50% | 힐러 + 근접 예전 | 지금 (35%) | 40% | 50% |')
for t in sorted(HEAL):
    H = HEAL[t]; M = ['힐러근접']
    print(f"| Lv{t} | " + ' | '.join(cell(v, t, H) for v in ('old', 'now', 'e40', 'e50')) + ' | ' + ' | '.join(cell(v, t, M) for v in ('old', 'now', 'e40', 'e50')) + ' |')
print()
print('| Lv146 (별의 정원 30층부터) | 예전 | 지금 | 민첩 몫 40% | 50% | 별의 정원 ×1 | 성좌 기사 꿰뚫기 뺌 | 성좌 기사 공격 −20% |')
rows = [('힐러 파티 (대주교 · 명의)', ['대주교', '명의']), ('힐러 + 근접 (그림자 군주)', ['힐러근접']), ('흡혈 (피의 군주 · 리치)', ['흡혈']), ('힐러 없음 (그림자 군주)', ['힐러없음'])]
for lab, comps in rows:
    print(f"| {lab} | " + ' | '.join(cell(v, 146, comps) for v in ('old', 'now', 'e40', 'e50', 'sg1', 'np', 'ma')) + ' |')
# 깬 횟수
for v in ('old', 'now', 'e40', 'e50', 'sg1'):
    print(v, [(c, V[v].get((146, c, 5), {}).get('clear')) for c in ('대주교', '명의', '힐러근접', '힐러없음')])
