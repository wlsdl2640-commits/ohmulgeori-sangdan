"""숙련 아이콘 (B안) → 게임 데이터 src/data-masticon.js + 확정 그림 ../final_snap_mast/{id}_{단계}.png
python3 export_mast.py [출력 경로]"""
import sys, json, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import mast, cell
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('/home/claude/game/src/data-masticon.js')
SNAP = D.parent / 'final_snap_mast'; SNAP.mkdir(exist_ok=True)
A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
def enc(art):
    seen = {}
    for (x, y) in cell.MASK: c = art.c[y][x]; seen[c] = seen.get(c, 0) + 1
    pal = sorted(seen, key=lambda c: -seen[c]); common = pal[0]; w = 1 if len(pal) <= 64 else 2; idx = []
    for y in range(cell.H):
        for x in range(cell.W):
            k = pal.index(art.c[y][x] if (x, y) in cell.MASK else common)
            idx.append(A[k] if w == 1 else A[k // 64] + A[k % 64])
    return ''.join('%02x%02x%02x' % c for c in pal) + '|' + ''.join(idx)
rows, skip = [], []
for k, name, theme, g in mast.MAST:
    if k == 'magic' and not mast.MAGIC_PICK: skip.append(k); continue
    vals = []
    for lit in range(4):
        vals.append(enc(mast.mast_art(k, lit))); mast.mast_img(k, lit).save(SNAP / f'{k}_{lit}.png')
    rows.append((k, vals))
js = ['/* 숙련 아이콘 (B안: 단계 점 + 틀 색): 숙련마다 [안 배움, 초급, 중급, 상급] 넷, 칸 색은 data-skicon.js와 같은 꼴.',
      '   만든 곳: drafts/skill-icons/dot/export_mast.py (mast.py) — 손으로 고치지 않는다 */',
      'const MASTICON = {']
js += [f'  {k}: {json.dumps(v)},' for k, v in rows]
js[-1] = js[-1].rstrip(',')
js += ['};', '']
OUT.write_text('\n'.join(js), encoding='utf-8')
print('숙련', len(rows), '빠짐', skip, '크기', OUT.stat().st_size)
