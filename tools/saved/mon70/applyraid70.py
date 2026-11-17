"""레이드 거인 그림 넣기: python3 applyraid70.py <src/pxraid.js> <t/raid_이름.json> <PXRAID 열쇠> <시안 키>
시안 json(raidk · raidt · raidb.py가 내보낸 것)의 격자 · 팔레트로 PXRAID[열쇠] 한 줄을 바꾼다(그 앞 · 뒤 항목은 그대로).
게임은 PXG_DIM을 격자에서 재므로 MONS[id].W/H(도감 · 자리)는 data-raid69.js에서 격자 × 2로 맞춘다."""
import json, re, sys

JS, TB, KEY, VAR = sys.argv[1:5]
d = json.load(open(TB)); g = d[VAR].strip('\n'); pal = d['pal'][VAR]
rows = g.split('\n'); assert len({len(r) for r in rows}) == 1, '줄 너비가 다르다'
used = {ch for r in rows for ch in r if ch != '.'}; miss = used - set(pal)
assert not miss, f'팔레트에 없는 글자 {miss}'
pal = {k: pal[k] for k in sorted(used)}
s = open(JS, encoding='utf-8').read()
m = re.search(r'\n  ' + re.escape(KEY) + r': \{ pal: \{[^\n]*\}, g: `\n.*?\n` \},', s, re.S)
assert m, f'PXRAID.{KEY} 항목을 못 찾음'
new = '\n  ' + KEY + ': { pal: ' + json.dumps(pal, ensure_ascii=False) + ', g: `\n' + g + '\n` },'
s = s[:m.start()] + new + s[m.end():]
open(JS, 'w', encoding='utf-8').write(s)
print(KEY, VAR, f'{len(rows[0])}×{len(rows)}칸 → {len(rows[0]) * 2}×{len(rows) * 2}', len(pal), '색')
