"""조합 밀기 결과 더 보기: python3 an92b.py [단계…] → an92b.json + 표 글
   (an92.py에 더해) 힐러 수마다 평균 · 직업마다 「힐러가 있는 조합에서의 평균」(힐러 몫을 뺀 직업 세기) · 아래 10 · 계열 몫"""
import json, glob, sys, os, statistics as st, collections
D = os.path.dirname(os.path.abspath(__file__))
src = open(f'{D}/an92.py', encoding='utf-8').read()
ns = {'__file__': f'{D}/an92.py'}; exec(src.split("LV = {")[0], ns)   # NAME · HEAL
NAME, HEAL = ns['NAME'], ns['HEAL']
LV = {'t55': 55, 't80': 80, 't100': 100, 't120': 120, 't146': 146}
FAM = {'gladiator': '전사', 'knight': '전사', 'berserker': '전사', 'spellblade': '전사', 'champion': '전사', 'paladin': '전사', 'bloodlord': '전사', 'arcblade': '전사',
       'ranger': '궁수', 'sniper': '궁수', 'mhunter': '궁수', 'huntsman': '궁수', 'dragoon': '궁수', 'hawkeye': '궁수', 'dslayer': '궁수', 'kaijuhunter': '궁수',
       'assassin': '도적', 'duelist': '도적', 'treasure': '도적', 'ninja': '도적', 'shadowlord': '도적', 'bladedancer': '도적', 'phantomthief': '도적', 'kageninja': '도적',
       'elementalist': '마법사', 'necromancer': '마법사', 'sorcerer': '마법사', 'elemancer': '마법사', 'elementlord': '마법사', 'lich': '마법사', 'archmage': '마법사', 'alchemist': '마법사',
       'priest': '성직자', 'plaguedoc': '성직자', 'exorcist': '성직자', 'archbishop': '성직자', 'physician': '성직자', 'inquisitor': '성직자'}
tiers = sys.argv[1:] or ['t55', 't80', 't100', 't120', 't146']
out = {}
for t in tiers:
    rows = []
    for f in sorted(glob.glob(f'{D}/swo/{t}_*.json')):
        try: rows += json.loads(open(f).read())
        except Exception as e: print('ERR', f, e)
    if not rows: continue
    for r in rows: r['r'] = r['flv'] - LV[t]; r['h'] = sum(1 for c in r['c'] if c in HEAL)
    cls = sorted({c for r in rows for c in r['c']})
    byh = {h: [r['r'] for r in rows if r['h'] == h] for h in range(5)}
    o = {'n': len(rows), 'byh': {h: (len(v), round(st.mean(v), 2) if v else None, sum(1 for r in rows if r['h'] == h and r['cl'])) for h, v in byh.items()}}
    per = {}
    for c in cls:
        w1 = [r['r'] for r in rows if c in r['c'] and r['h'] >= 1]
        w1x = [r['r'] for r in rows if c in r['c'] and r['h'] == 1 and (c in HEAL or True)]
        nh = [r['r'] for r in rows if c in r['c'] and r['h'] == 0]
        k2 = [r['r'] for r in rows if r['c'].count(c) >= 2 and r['h'] >= 1]
        if t == 't146':
            P1 = [r for r in rows if c in r['c'] and r['h'] >= 1]; P2 = [r for r in rows if r['c'].count(c) >= 2 and r['h'] >= 1]; PN = [r for r in rows if c in r['c'] and r['h'] == 0]
            pp = lambda L: round(100 * sum(1 for r in L if r['flv'] > 145) / len(L)) if L else None
            pas = {'p1': pp(P1), 'p2': pp(P2), 'pn': pp(PN)}
        else: pas = {}
        per[c] = {**pas, 'k2': round(st.mean(k2), 2) if k2 else None, 'w1': round(st.mean(w1), 2) if w1 else None, 'h1': round(st.mean(w1x), 2) if w1x else None, 'nh': round(st.mean(nh), 2) if nh else None,
                  'cl': sum(1 for r in rows if c in r['c'] and r['cl']), 'w': round(sum(r['w'] for r in rows if c in r['c']) / max(1, sum(1 for r in rows if c in r['c'])), 3),
                  'tk': round(st.mean([r['tk'] / max(1, r['t']) for r in rows if c in r['c']]), 1)}
    o['per'] = per
    o['bottom'] = [[' · '.join(NAME[c] for c in r['c']), r['r']] for r in sorted(rows, key=lambda r: (r['r'], -r['tk']))[:10]]
    # 같은 계열 넷 (전사 넷 · 도적 넷 …)
    fam = collections.defaultdict(list)
    for r in rows:
        fs = {FAM[c] for c in r['c']}
        if len(fs) == 1: fam[fs.pop()].append(r['r'])
    o['fam4'] = {k: (len(v), round(st.mean(v), 2)) for k, v in fam.items()}
    # 계열 구성 (힐러 1 + 나머지 셋의 계열 묶음)
    comp = collections.defaultdict(list)
    for r in rows:
        if r['h'] != 1: continue
        k = ' + '.join(sorted(FAM[c] for c in r['c'] if c not in HEAL)); comp[k].append(r['r'])
    o['comp1h'] = sorted([(k, len(v), round(st.mean(v), 2)) for k, v in comp.items()], key=lambda x: -x[2])
    if t == 't146':
        o['pass_noh'] = [[' · '.join(NAME[c] for c in r['c']), r['r']] for r in sorted(rows, key=lambda r: -r['r']) if r['h'] == 0 and r['flv'] > 145][:20]
        o['pass_byh'] = {h: (sum(1 for r in rows if r['h'] == h and r['flv'] > 145), len(byh[h])) for h in range(5)}
    out[t] = o
    print(f"== {t} ({o['n']}) 힐러 수 → (조합, 평균, 끝까지):", o['byh'])
    print('   힐러가 있는 조합에서 직업 평균:', ', '.join(f"{NAME[c]} {per[c]['w1']:+}" for c in sorted(cls, key=lambda c: -(per[c]['w1'] or -9))))
    print('   힐러 없는 조합에서 직업 평균:', ', '.join(f"{NAME[c]} {per[c]['nh']:+}" for c in sorted([c for c in cls if per[c]['nh'] is not None], key=lambda c: -per[c]['nh'])))
    print('   아래 10:', ' | '.join(f"{a} {b:+}" for a, b in o['bottom']))
    print('   한 계열 넷:', o['fam4'])
    print('   힐러 1 + 계열 셋:', o['comp1h'][:6], '…', o['comp1h'][-4:])
    if t == 't146': print('   30층 넘은 힐러 없는 조합:', o['pass_noh'][:10], o['pass_byh'])
json.dump(out, open(f'{D}/an92b.json', 'w'), ensure_ascii=False)
