"""an99.py [변형 …] — out/<변형>/t*.json을 모아 단계 · 파티마다 도달(필드 레벨 − 파티 레벨) · 쓰러짐 · 피해 갈래 · 회복 · 스킬 수 · MP를 견준다 (첫 변형이 기준)"""
import json, glob, os, sys, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
LV = {12: 12, 20: 20, 30: 30, 45: 45, 60: 60, 80: 80, 90: 90, 100: 100, 120: 120, 130: 130, 146: 146}
HEALC = {'cleric', 'priest', 'plaguedoc', 'archbishop', 'physician'}
GZ = None if os.path.isdir(f'{D}/out') else json.load(__import__('gzip').open(f'{D}/results100.json.gz', 'rt', encoding='utf-8'))   # out/이 없으면 저장소에 둔 모음
def load(v):
    R = {}
    chunks = [GZ['reach'].get(v, [])] if GZ is not None else []
    for f in ([] if GZ is not None else sorted(glob.glob(f'{D}/out/{v}/t*.json'))):
        try: chunks.append(json.load(open(f)))
        except Exception as e: print('ERR', f, e)
    for rows in chunks:
        for r in rows:
            runs = r['runs']; k = (r['tier'], r['comp'])
            dm = {g: st.mean(x['dmg'][g] for x in runs) for g in ('basic', 'skill', 'dot', 'extra')}; tot = sum(dm.values())
            ft = st.mean(max(1, x['fightT']) for x in runs)
            cls = sorted({c for x in runs for c in x['casts']})
            R[k] = {'reach': st.mean(x['flv'] for x in runs) - LV[r['tier']], 'wipe': st.mean(1 if x['wiped'] else 0 for x in runs), 'down': st.mean(x['downs'] for x in runs),
                    'dps': tot / ft, 'basic': dm['basic'] / max(1, tot), 'hps': st.mean(x['heff'] / max(1, x['fightT']) for x in runs), 'tps': st.mean(x['taken'] / max(1, x['fightT']) for x in runs),
                    'casts': {c: st.mean(x['casts'].get(c, 0) for x in runs) for c in cls}, 'mp': {c: st.mean(x['mp'].get(c, 0) for x in runs) for c in cls},
                    'ammo': st.mean(x['ammo'] / max(1, x['fightT']) * 60 for x in runs), 'n': len(runs), 'clear': st.mean(1 if x['cleared'] else 0 for x in runs), 't': st.mean(x['t'] for x in runs)}
    return R
if __name__ == '__main__':
    V = sys.argv[1:] or ['base', 'c0']
    A = {v: load(v) for v in V}
    base = A[V[0]]
    keys = sorted(base)
    print('도달 (필드 레벨 − 파티 레벨) · 괄호: 전멸 몫')
    print('단계 파티 | ' + ' | '.join(V))
    for k in keys:
        cells = []
        for v in V:
            r = A[v].get(k)
            cells.append('—' if not r else f"{r['reach']:+.1f} ({r['wipe']:.2f})")
        print(f'{k[0]:>3} {k[1]:<5} | ' + ' | '.join(cells))
    print()
    print('피해/초 (기준 대비) · 기본 공격 몫')
    for k in keys:
        cells = []
        for v in V:
            r = A[v].get(k)
            cells.append('—' if not r else f"{r['dps'] / max(1, base[k]['dps']):.2f} b{r['basic']*100:.0f}%")
        print(f'{k[0]:>3} {k[1]:<5} | ' + ' | '.join(cells))
    print()
    print('회복/초 · 받은 피해/초 · 힐러 MP · 스킬/분')
    for k in keys:
        cells = []
        for v in V:
            r = A[v].get(k)
            if not r: cells.append('—'); continue
            hc = [c for c in r['mp'] if c in HEALC]
            cells.append(f"h{r['hps']:.0f} t{r['tps']:.0f} mp{','.join(str(round(r['mp'][c])) for c in hc) or '-'} c{','.join(str(round(r['casts'][c])) for c in r['casts'])}")
        print(f'{k[0]:>3} {k[1]:<5} | ' + ' | '.join(cells))
