"""조합 밀기 결과 정리: python3 an92.py [단계…] → 표 (마크다운) · an92.json"""
import json, glob, sys, os, statistics as st, collections
D = os.path.dirname(os.path.abspath(__file__))
NAME = {'gladiator': '검투사', 'knight': '기사', 'berserker': '광전사', 'spellblade': '마검사', 'ranger': '랑기수', 'sniper': '저격수', 'mhunter': '트래커', 'huntsman': '사냥꾼',
        'assassin': '암살자', 'duelist': '쌍검사', 'treasure': '소매치기', 'ninja': '닌자', 'elementalist': '정령술사', 'necromancer': '네크로맨서', 'sorcerer': '마도사', 'elemancer': '원소술사',
        'priest': '사제', 'plaguedoc': '역병의사', 'exorcist': '퇴마사',
        'champion': '챔피언', 'paladin': '성기사', 'bloodlord': '피의 군주', 'arcblade': '마검성', 'dragoon': '용기수', 'hawkeye': '신궁', 'dslayer': '스토커', 'kaijuhunter': '괴수사냥꾼',
        'shadowlord': '그림자 군주', 'bladedancer': '검무사', 'phantomthief': '괴도', 'kageninja': '카게닌자', 'elementlord': '정령왕', 'lich': '리치', 'archmage': '대마도사', 'alchemist': '연금술사',
        'archbishop': '대주교', 'physician': '명의', 'inquisitor': '심판관'}
HEAL = {'priest', 'plaguedoc', 'exorcist', 'archbishop', 'physician', 'inquisitor'}
LV = {'t80': 80, 't100': 100, 't120': 120, 't146': 146}
tiers = sys.argv[1:] or ['t80', 't100', 't120', 't146']
R = {}
for t in tiers:
    rows = []
    for f in sorted(glob.glob(f'{D}/swo/{t}_*.json')):
        try: rows += json.loads(open(f).read())
        except Exception as e: print('ERR', f, e)
    for r in rows: r['r'] = r['flv'] - LV[t]
    R[t] = rows
out = {}
for t, rows in R.items():
    if not rows: continue
    cls = sorted({c for r in rows for c in r['c']})
    rs = [r['r'] for r in rows]
    heal = [r for r in rows if HEAL & set(r['c'])]; noh = [r for r in rows if not (HEAL & set(r['c']))]
    per = {}
    for c in cls:
        inc = [r['r'] for r in rows if c in r['c']]
        solo = [r['r'] for r in rows if r['c'] == [c] * 4]
        per[c] = {'avg': round(st.mean(inc), 2), 'n': len(inc), 'x4': solo[0] if solo else None,
                  'top': round(st.mean(sorted(inc, reverse=True)[:50]), 2)}
    top = sorted(rows, key=lambda r: (-r['r'], -r['cl'], r['tk']))[:15]
    noh_top = sorted(noh, key=lambda r: (-r['r'], r['tk']))[:10]
    o = {'n': len(rows), 'mean': round(st.mean(rs), 2), 'median': st.median(rs), 'wipe': sum(r['w'] for r in rows), 'clear': sum(r['cl'] for r in rows),
         'heal': {'n': len(heal), 'mean': round(st.mean(heal), 2) if False else round(st.mean([r['r'] for r in heal]), 2), 'clear': sum(r['cl'] for r in heal)},
         'noheal': {'n': len(noh), 'mean': round(st.mean([r['r'] for r in noh]), 2), 'clear': sum(r['cl'] for r in noh)},
         'per': per, 'top': [[' · '.join(NAME[c] for c in r['c']), r['r'], r['cl']] for r in top],
         'noh_top': [[' · '.join(NAME[c] for c in r['c']), r['r'], r['cl']] for r in noh_top],
         'dist': sorted(collections.Counter(int(r['r']) for r in rows).items())}
    if t == 't146':
        o['pass'] = {'all': sum(1 for r in rows if r['flv'] > 145), 'heal': sum(1 for r in heal if r['flv'] > 145), 'noheal': sum(1 for r in noh if r['flv'] > 145), 'noheal_n': len(noh)}
    out[t] = o
    print(f"== {t}: {o['n']}조합 · 평균 {o['mean']:+} · 가운데 {o['median']} · 전멸 {o['wipe']} · 끝까지 {o['clear']} · 힐러 있음 {o['heal']} · 없음 {o['noheal']}")
    if 'pass' in o: print('   30층 우두머리 넘음', o['pass'])
    print('   직업(들어간 조합 평균 · 넷 다 같은 직업 · 상위 50 평균):', ', '.join(f"{NAME[c]} {per[c]['avg']:+} / {per[c]['x4']:+} / {per[c]['top']:+}" for c in sorted(cls, key=lambda c: -per[c]['avg'])))
    print('   위 15:', ' | '.join(f"{a} {b:+}{'★' if cl else ''}" for a, b, cl in o['top']))
    print('   힐러 없이 위 10:', ' | '.join(f"{a} {b:+}" for a, b, cl in o['noh_top']))
    print('   분포', o['dist'])
json.dump(out, open(f'{D}/an92.json', 'w'), ensure_ascii=False)
