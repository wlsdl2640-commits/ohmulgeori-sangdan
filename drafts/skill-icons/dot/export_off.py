"""부장비 그림 → 게임 데이터 src/data-officon.js + 확정 그림 ../final_snap_off/{종류}_{모습}.png (20×20, 1칸 = 1픽셀)
종류마다 모습 넷 [견습·숲지기, 강철·폭풍, 서리·사막왕, 그 위]. PICK으로 종류별 그림 함수 순서를 바꿀 수 있다.
python3 export_off.py [출력 경로]"""
import sys, json, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import offhand, cell
from PIL import Image
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('/home/claude/game/src/data-officon.js')
SNAP = D.parent / 'final_snap_off'; SNAP.mkdir(exist_ok=True)
A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
PICK = {}   # 예: {'shield': [0, 1, 2, 3]} — 고른 뒤 바꾸면 여기
def enc(art):
    seen = {}
    for y in range(cell.H):
        for x in range(cell.W): c = art.c[y][x]; seen[c] = seen.get(c, 0) + 1
    pal = sorted(seen, key=lambda c: -seen[c]); w = 1 if len(pal) <= 64 else 2; idx = []
    for y in range(cell.H):
        for x in range(cell.W):
            k = pal.index(art.c[y][x]); idx.append(A[k] if w == 1 else A[k // 64] + A[k % 64])
    return ''.join('%02x%02x%02x' % c for c in pal) + '|' + ''.join(idx)
def snap(art):
    im = Image.new('RGBA', (20, 20), (0, 0, 0, 0)); px = im.load()
    for y in range(cell.H):
        for x in range(cell.W):
            c = art.c[y][x]
            if c != offhand.KEY: px[2 + x, y] = c + (255,)
    return im
rows = []
for k, name, who, fns, labels in offhand.OFF:
    order = PICK.get(k, [0, 1, 2, 3]); vals = []
    for i, j in enumerate(order):
        a = offhand.item(); fns[j](a); vals.append(enc(a)); snap(a).save(SNAP / f'{k}_{i}.png')
    rows.append((k, vals))
js = ['/* 부장비 그림 (빌드 38~): 종류마다 [견습·숲지기, 강철·폭풍, 서리·사막왕, 그 위] 넷, 16×20칸 — 칸 색 꼴은 data-skicon.js와 같고 #ff00ff는 빈칸.',
      '   만든 곳: drafts/skill-icons/dot/export_off.py (offhand.py) — 손으로 고치지 않는다 */',
      'const OFFICON = {']
js += [f'  {k}: {json.dumps(v)},' for k, v in rows]
js[-1] = js[-1].rstrip(','); js += ['};', '']
OUT.write_text('\n'.join(js), encoding='utf-8')
print('부장비', len(rows), '크기', OUT.stat().st_size)
