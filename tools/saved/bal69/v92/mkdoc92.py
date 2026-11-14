"""조합 밀기 결과 → 계획 문서 마크다운: python3 mkdoc92.py > doc92.md (an92.py · an92b.py를 먼저 돌려 an92.json · an92b.json)"""
import json, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
A = json.load(open(f'{D}/an92.json')); B = json.load(open(f'{D}/an92b.json'))
ns = {'__file__': f'{D}/an92.py'}; exec(open(f'{D}/an92.py', encoding='utf-8').read().split('LV = {')[0], ns)
NAME, HEAL = ns['NAME'], ns['HEAL']
f = lambda x: '—' if x is None else ('0' if abs(x) < 0.05 else f"{x:+.1f}".replace('-', '−'))
TN = {'t55': 'Lv55 눅눅한 늪지대 (2차)', 't80': 'Lv80 용암 화산 (2차)', 't100': 'Lv100 구름섬 (3차)', 't120': 'Lv120 천둥 봉우리 (3차)', 't146': 'Lv146 별의 정원 30층 (3차)'}
T = [t for t in ('t55', 't80', 't100', 't120', 't146') if t in A]
L = []
L.append('| 땅 | 조합 | 평균 | 힐러 없음 | 힐러 1 | 힐러 2 | 힐러 3 | 힐러 4 | 끝까지 깬 조합 |')
L.append('|---|---|---|---|---|---|---|---|---|')
for t in T:
    a, b = A[t], B[t]
    L.append(f"| {TN[t]} | {a['n']:,} | {f(a['mean'])} | " + ' | '.join(f"{f(b['byh'][str(h)][1])} ({b['byh'][str(h)][0]:,})" for h in range(5)) + f" | {a['clear']:,} |")
print('\n'.join(L)); print()
# 직업 표
for grp, ts in (('2차', [t for t in T if t in ('t55', 't80')]), ('3차', [t for t in T if t not in ('t55', 't80')])):
    if not ts: continue
    cls = sorted(A[ts[0]]['per'], key=lambda c: -st.mean([B[t]['per'][c]['w1'] for t in ts]))
    hdr = '| 직업 | ' + ' | '.join(f"{TN[t].split(' (')[0]}" for t in ts) + ' |'
    print(hdr); print('|---|' + '---|' * len(ts))
    for c in cls:
        cells = []
        for t in ts:
            p, q = A[t]['per'][c], B[t]['per'][c]
            if t == 't146': cells.append(f"{q['p1']}% · {q['p2'] if q['p2'] is not None else '—'}% · {'넘음' if (p['x4'] or -1) > -1 else '못 넘음'}")
            else: cells.append(f"{f(q['w1'])} · {f(q['k2'])} · {f(p['x4'])}")
        print(f"| {NAME[c]}{' (힐러)' if c in HEAL else ''} | " + ' | '.join(cells) + ' |')
    print()
for t in T:
    a = A[t]
    print(f"**{TN[t]}** 위 8: " + ' / '.join(f"{n} {f(r)}{' (끝까지)' if cl else ''}" for n, r, cl in a['top'][:8]))
    print(f"힐러 없이 위 5: " + ' / '.join(f"{n} {f(r)}" for n, r, cl in a['noh_top'][:5]))
    print(f"아래 5: " + ' / '.join(f"{n} {f(r)}" for n, r in B[t]['bottom'][:5]))
    print(f"한 계열 넷: " + ' · '.join(f"{k} {f(v[1])}" for k, v in sorted(B[t]['fam4'].items(), key=lambda x: -x[1][1])))
    if t == 't146': print('30층 우두머리를 넘은 조합(힐러 수 → 넘은 / 전체):', B[t]['pass_byh'], ' 힐러 없이 넘은 것:', B[t]['pass_noh'][:10])
    print()
