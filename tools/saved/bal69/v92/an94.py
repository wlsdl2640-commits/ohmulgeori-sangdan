"""파티 치유 고침 전 · 뒤: python3 an94.py → 대주교 · 퇴마사 · 심판관이 든 조합의 평균 (swo = 지금, swo94 = 고친 페이지) → an94.json"""
import json, glob, os, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
ns = {'__file__': f'{D}/an92.py'}; exec(open(f'{D}/an92.py', encoding='utf-8').read().split('LV = {')[0], ns)
NAME, HEAL = ns['NAME'], ns['HEAL']
LV = {'t80': 80, 't100': 100, 't120': 120, 't146': 146}
def rows(d, pat):
    out = []
    for f in sorted(glob.glob(f'{D}/{d}/{pat}')):
        try: out += json.loads(open(f).read())
        except Exception: pass
    return out
out = {}
for t, who in (('t80', 'exorcist'), ('t100', 'archbishop'), ('t120', 'archbishop'), ('t146', 'archbishop'), ('t146', 'inquisitor')):
    new = [r for r in rows('swo94', f'{t}_*.json') if who in r['c']]
    if not new: continue
    old = {tuple(r['c']): r for r in rows('swo', f'{t}_*.json')}
    pairs = [(old[tuple(r['c'])], r) for r in new if tuple(r['c']) in old]
    if not pairs: continue
    o = [a['flv'] - LV[t] for a, b in pairs]; n = [b['flv'] - LV[t] for a, b in pairs]
    one = [(a['flv'] - LV[t], b['flv'] - LV[t]) for a, b in pairs if sum(1 for c in a['c'] if c in HEAL) == 1]
    k = f'{t}_{who}'
    out[k] = {'n': len(pairs), 'old': round(st.mean(o), 2), 'new': round(st.mean(n), 2), 'one_old': round(st.mean([x for x, y in one]), 2) if one else None, 'one_new': round(st.mean([y for x, y in one]), 2) if one else None,
              'tk_old': round(st.mean([a['tk'] / max(1, a['t']) for a, b in pairs]), 1), 'tk_new': round(st.mean([b['tk'] / max(1, b['t']) for a, b in pairs]), 1),
              'better': sum(1 for x, y in zip(o, n) if y > x), 'worse': sum(1 for x, y in zip(o, n) if y < x),
              'x4': [(a['flv'] - LV[t], b['flv'] - LV[t]) for a, b in pairs if a['c'] == [who] * 4]}
    if t == 't146': out[k]['pass'] = (sum(1 for a, b in pairs if a['flv'] > 145), sum(1 for a, b in pairs if b['flv'] > 145))
    print(k, out[k])
json.dump(out, open(f'{D}/an94.json', 'w'), ensure_ascii=False)
