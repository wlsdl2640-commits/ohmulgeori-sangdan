"""dan99.py [변형 …] — 허수아비 피해(dout/<변형>.json): 기준(base) 대비 피해 비, 기본 공격 몫, 그리고 공격 스킬 세기 ×pw가 얼마면 기준과 같아지는지"""
import json, os, sys, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
GZ = None if os.path.isdir(f'{D}/dout') else json.load(__import__('gzip').open(f'{D}/results100.json.gz', 'rt', encoding='utf-8'))   # dout/이 없으면 저장소에 둔 모음
def load(v): return {(r['tier'], r['comp']): r for r in (GZ['dummy'][v] if GZ is not None else json.load(open(f'{D}/dout/{v}.json')))}
V = sys.argv[1:]
B = load('base'); A = {v: load(v) for v in V}
BANDS = [('Lv12~45', [12, 20, 30, 45]), ('Lv60~90', [60, 80, 90]), ('Lv100~146', [100, 120, 130, 146])]
def need(b, r):   # 기준 피해 = 기본 몫 + pw × 스킬 몫
    sk = (r.get('skill', 0) + r.get('dot', 0)) * r['dps']; ns = r['dps'] - sk
    return (b['dps'] - ns) / sk if sk > 0 else None
for lab in ('one', 'three'):
    print(f'== {lab} (허수아비 {"한 마리" if lab == "one" else "세 마리"})')
    print('변형 | ' + ' | '.join(b for b, _ in BANDS) + ' | 필요한 pw ' + ' | '.join(b for b, _ in BANDS))
    for v in V:
        cells, pws = [], []
        for bn, ts in BANDS:
            ks = [k for k in B if k[0] in ts and k in A[v]]
            rat = st.mean(A[v][k][lab]['dps'] / max(1, B[k][lab]['dps']) for k in ks)
            bs = st.mean(A[v][k][lab]['basic'] for k in ks)
            nd = [need(B[k][lab], A[v][k][lab]) for k in ks]; nd = [x for x in nd if x]
            cells.append(f'{rat:.2f} (기본 {bs*100:.0f}%)'); pws.append(f'{st.mean(nd):.2f}' if nd else '—')
        print(f'{v} | ' + ' | '.join(cells) + ' | ' + ' | '.join(pws))
