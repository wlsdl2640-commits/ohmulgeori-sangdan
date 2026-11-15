"""mpan.py <기준> [변형 …] — 마법사 · 성직자 계열의 싸움 중 MP % · MP가 모자라 스킬을 건너뛴 시간 % · 스킬 수/분 · 파티 피해 비 (기준 대비)"""
import json, glob, os, sys, statistics as st, collections
D = os.path.dirname(os.path.abspath(__file__))
CAST = {'mage', 'cleric', 'sorcerer', 'priest', 'plaguedoc', 'necromancer', 'archmage', 'archbishop', 'physician', 'lich'}
GZ = None if os.path.isdir(f'{D}/out') else json.load(__import__('gzip').open(f'{D}/results101.json.gz', 'rt', encoding='utf-8'))   # out/이 없으면 저장소에 둔 모음
def load(v):
    R = {}
    rows = GZ['reach'].get(v, []) if GZ is not None else [r for f in sorted(glob.glob(f'{D}/out/{v}/t*.json')) for r in json.load(open(f))]
    for r in rows: R[(r['tier'], r['comp'])] = r['runs']
    return R
V = sys.argv[1:]; A = {v: load(v) for v in V}; base = A[V[0]]
for v in V:
    print('==', v)
    rows = collections.defaultdict(lambda: collections.defaultdict(list))
    for k, runs in A[v].items():
        for x in runs:
            for c in x['mp']:
                if c not in CAST: continue
                rows[k[0]][c + ' mp'].append(x['mp'][c]); rows[k[0]][c + ' blk'].append((x.get('mpb') or {}).get(c, 0)); rows[k[0]][c + ' cast'].append(x['casts'].get(c, 0))
        b = base.get(k)
        if b:
            d0 = st.mean(sum(x['dmg'].values()) / max(1, x['fightT']) for x in b); d1 = st.mean(sum(x['dmg'].values()) / max(1, x['fightT']) for x in runs)
            rows[k[0]]['dps'].append(d1 / max(1, d0))
    for t in sorted(rows):
        R = rows[t]; cs = sorted({c.split(' ')[0] for c in R if c != 'dps'})
        print(f'{t:>3} dps×{st.mean(R["dps"]):.2f} | ' + ' · '.join(f'{c} MP {st.mean(R[c + " mp"]):.0f}% 막힘 {st.mean(R[c + " blk"]):.1f}% 스킬 {st.mean(R[c + " cast"]):.1f}/분' for c in cs))
