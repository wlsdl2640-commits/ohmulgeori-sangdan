import json, glob, os, sys
D = os.path.dirname(os.path.abspath(__file__))
def load(v):
    out = {}
    for f in glob.glob(f'{D}/r_{v}/t*.json'):
        try: rows = json.load(open(f))
        except Exception: continue
        for r in rows:
            runs = r['runs']; n = len(runs)
            out[(r['tier'], r['comp'], r['slv'])] = {
                'reach': sum(x['flv'] for x in runs) / n - r['tier'],
                'clear': sum(1 for x in runs if x['cleared']), 'wipe': sum(1 for x in runs if x['wiped']),
                'taken': sum(x['taken'] for x in runs) / max(1, sum(x['fightT'] for x in runs)), 'fsec': sum(x['fightT'] for x in runs) / max(1, sum(x['fights'] for x in runs)),
                'downs': sum(x['downs'] for x in runs) / n}
    return out
old = {}
for r in json.load(open('/home/claude/game62/tools/saved/bal69/compare.json')):
    old[(r['tier'], r['comp'], r['slv'])] = {'reach': r['b_reach'] - r['tier'], 'clear': r['b_clear'], 'taken': r['b_taken']}
for k, v in load('old').items(): old[k] = v
V = {v: load(v) for v in sys.argv[1:]}
keys = sorted(set().union(*[set(x) for x in V.values()]))
print('tier comp slv | old | ' + ' | '.join(V))
for k in keys:
    o = old.get(k)
    cells = [f"{o['reach']:+.1f}" if o else '  — ']
    for v in V:
        x = V[v].get(k)
        cells.append(f"{x['reach']:+.1f} c{x['clear']} t{x['taken']:.0f}" if x else '—')
    print(k[0], k[1], k[2], '|', ' | '.join(cells))
