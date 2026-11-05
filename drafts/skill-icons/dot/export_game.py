"""확정 아이콘 307개 → 게임 데이터 (src/data-skicon.js)
칸마다 색 (16×20): 아이콘마다 팔레트 + 칸 글자. 팔레트가 64색을 넘으면 칸마다 두 글자.
python3 export_game.py [출력 경로]"""
import sys, json, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import catalog, cell
from PIL import Image
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('/home/claude/game/src/data-skicon.js')
SNAP = D.parent / 'final_snap'
A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
ic = catalog.collect(); ids = [s['id'] for s in catalog.SK]
rows, bad, maxc = [], [], 0
for sid in ids:
    name, kind, fn = ic[sid]; art, _ = fn()
    im = art.img(kind); snap = Image.open(SNAP / f'{sid}.png').convert('RGBA')
    if im.tobytes() != snap.tobytes(): bad.append(sid)
    # 육각 안쪽에 실제로 보이는 칸만 색을 남기고, 나머지는 가장 흔한 색으로 (압축이 잘 되게)
    seen = {}
    for (x, y) in cell.MASK: c = art.c[y][x]; seen[c] = seen.get(c, 0) + 1
    common = max(seen, key=seen.get)
    pal, idx = [], []
    order = sorted(seen, key=lambda c: -seen[c])
    pal = order
    w = 1 if len(pal) <= 64 else 2
    maxc = max(maxc, len(pal))
    for y in range(cell.H):
        for x in range(cell.W):
            c = art.c[y][x] if (x, y) in cell.MASK else common
            k = pal.index(c)
            idx.append(A[k] if w == 1 else A[k // 64] + A[k % 64])
    rows.append((sid, ''.join('%02x%02x%02x' % c for c in pal) + '|' + ''.join(idx)))
js = ['/* 스킬 아이콘 (확정 307개, 뭉툭 도트): 육각 틀 안쪽 16×20칸의 색.',
      '   "팔레트(6자리 색 이어 붙임)|칸 글자 320개" — 팔레트가 64색을 넘으면 칸마다 두 글자. 만든 곳: drafts/skill-icons/dot/export_game.py */',
      'const SKICON = {']
js += [f'  {sid}: {json.dumps(v)},' for sid, v in rows]
js[-1] = js[-1].rstrip(',')
js += ['};', '']
OUT.write_text('\n'.join(js), encoding='utf-8')
print('아이콘', len(rows), '최대 색', maxc, '다름', bad, '크기', OUT.stat().st_size)
