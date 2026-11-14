"""도적 · 궁수 아이디어 표본 정리: python3 an95.py → an95.json + 글
swo/(sw_one.sh가 남긴 조각)가 없으면 저장소에 둔 results95.json.gz(조각 이름 → 줄들)를 읽는다."""
import json, glob, gzip, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
GZ = None if os.path.isdir(f'{D}/swo') else json.load(gzip.open(f'{D}/results95.json.gz', 'rt', encoding='utf-8'))
NAME = {'shadowlord': '그림자 군주', 'bladedancer': '검무사', 'phantomthief': '괴도', 'kageninja': '카게닌자', 'dragoon': '용기수', 'hawkeye': '신궁', 'dslayer': '스토커', 'kaijuhunter': '괴수사냥꾼'}
SETS = {'rog': (['base', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'], ['shadowlord', 'bladedancer', 'phantomthief', 'kageninja']), 'arc': (['base', 'A1', 'A2', 'A3', 'A4', 'A5'], ['dragoon', 'hawkeye', 'dslayer', 'kaijuhunter'])}
LV = {'t100': 100, 't146': 146}
out = {}
for sname, (vars_, cls) in SETS.items():
    for t in ('t100', 't146'):
        res = {}
        for v in vars_:
            rows = []
            if GZ is not None:
                for n in sorted(GZ):
                    if n.startswith(f'{v}_{sname}_{t}_'): rows += GZ[n]
            for f in ([] if GZ is not None else sorted(glob.glob(f'{D}/swo/{v}_{sname}_{t}_*.json'))):
                try: rows += json.loads(open(f).read())
                except Exception as e: print('ERR', f, e)
            if rows: res[v] = {tuple(r['c']): r for r in rows}
        if 'base' not in res: continue
        base = res['base']; o = {}
        for v, R in res.items():
            keys = [k for k in R if k in base]
            if not keys: continue
            reach = [R[k]['flv'] - LV[t] for k in keys]; b = [base[k]['flv'] - LV[t] for k in keys]
            row = {'n': len(keys), 'mean': round(st.mean(reach), 2), 'diff': round(st.mean(reach) - st.mean(b), 2), 'up': sum(1 for x, y in zip(reach, b) if x > y), 'down': sum(1 for x, y in zip(reach, b) if x < y),
                   'pass': sum(1 for k in keys if R[k]['flv'] > 145) if t == 't146' else None,
                   'tk': round(st.mean([R[k]['tk'] / max(1, R[k]['t']) for k in keys]), 1), 'dn': round(st.mean([R[k]['dn'] for k in keys]), 2),
                   'cls': {NAME[c]: round(st.mean([R[k]['flv'] - LV[t] for k in keys if c in k]), 2) for c in cls}}
            if t == 't146': row['cls_pass'] = {NAME[c]: round(100 * sum(1 for k in keys if c in k and R[k]['flv'] > 145) / max(1, sum(1 for k in keys if c in k))) for c in cls}
            o[v] = row
        out[f'{sname}_{t}'] = o
        print(f'== {sname} {t}')
        for v, r in o.items(): print(f"  {v}: n {r['n']} 평균 {r['mean']:+} (차 {r['diff']:+}, 오름 {r['up']} · 내림 {r['down']}) 넘음 {r['pass']} 받은 피해/초 {r['tk']} 쓰러짐 {r['dn']} | {r['cls']} {r.get('cls_pass', '')}")
json.dump(out, open(f'{D}/an95.json', 'w'), ensure_ascii=False)
