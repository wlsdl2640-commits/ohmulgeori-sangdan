"""빌드 65 시안 v67 합격분 → 게임 데이터 (11-12 19:57 사용자 「스킬시안은 용기수의 하늘의 눈 빼고 다 합격」)
- 스킬: 지금 SKICON 307개(export_game.py · final_snap) + v67 53개 + 하늘의 눈(dragonscale)은 skyeye68.py D안 「과녁 무늬 와이번 눈」(11-12 20:26).
  v67의 같은 id(짐 방패 · 매복 · 하늘 사격 …)는 새 그림으로 바뀐다. 확정 그림 final_snap_v67/{id}.png
- 숙련: 27개 × 다섯 단계 [안 배움, 초급, 중급, 상급, 달인] — 지금 12개는 0~3 그대로 + 달인, 새 15개는 m_v63.art63.
  확정 그림 final_snap_mast/{id}_{단계}.png (지금 12개 0~3은 그 자리 그림과 같아야 한다)
python3 export_v67.py <data-skicon.js> <data-masticon.js>"""
import sys, json, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import catalog, cell, mast, m_v63   # v67icons는 반짝이 그리기를 바꿔 놓으므로 옛 307개를 다 뽑은 뒤에 부른다
from PIL import Image
A = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
OUT_S, OUT_M = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
SKIP = {'dragonscale'}   # 하늘의 눈은 v67 시안 대신 skyeye68 D안 (11-12 20:26 사용자 「D안으로」)
def enc(art):
    seen = {}
    for (x, y) in cell.MASK: c = art.c[y][x]; seen[c] = seen.get(c, 0) + 1
    pal = sorted(seen, key=lambda c: -seen[c]); common = pal[0]; w = 1 if len(pal) <= 64 else 2; idx = []
    for y in range(cell.H):
        for x in range(cell.W):
            k = pal.index(art.c[y][x] if (x, y) in cell.MASK else common)
            idx.append(A[k] if w == 1 else A[k // 64] + A[k % 64])
    return ''.join('%02x%02x%02x' % c for c in pal) + '|' + ''.join(idx)
# ── 스킬 ──
ic = catalog.collect(); rows = {}; bad = []
for s in catalog.SK:
    sid = s['id']; name, kind, fn = ic[sid]; art, _ = fn()
    if art.img(kind).tobytes() != Image.open(D / 'final_snap' / f'{sid}.png').convert('RGBA').tobytes(): bad.append(sid)
    rows[sid] = enc(art)
import v67icons as V
SNAP = D / 'final_snap_v67'; SNAP.mkdir(exist_ok=True)
new, rep = [], []
for _, keys in V.GROUPS:
    for gid in keys:
        if gid in SKIP: continue
        art, im, kind = V.skill_img(gid); im.save(SNAP / f'{gid}.png')
        (rep if gid in rows else new).append(gid); rows[gid] = enc(art)
import skyeye68
art = skyeye68.v_d(); im = art.img('dmg'); im.save(SNAP / 'dragonscale.png'); rows['dragonscale'] = enc(art); rep.append('dragonscale(D안)')
js = ['/* 스킬 아이콘 (뭉툭 도트): 육각 틀 안쪽 16×20칸의 색.',
      '   "팔레트(6자리 색 이어 붙임)|칸 글자 320개" — 팔레트가 64색을 넘으면 칸마다 두 글자.',
      '   만든 곳: 시안 저장소 drafts/skill-icons/dot/export_v67.py (export_game.py 307개 + 빌드 65 시안 v67 53개 + 하늘의 눈 skyeye68 D안) — 손으로 고치지 않는다 */',
      'const SKICON = {'] + [f'  {k}: {json.dumps(v)},' for k, v in rows.items()]
js[-1] = js[-1].rstrip(','); js += ['};', '']
OUT_S.write_text('\n'.join(js), encoding='utf-8')
print('스킬', len(rows), '새로', len(new), '바뀜', rep, '옛 그림 다름', bad)
# ── 숙련 ──
MS = D / 'final_snap_mast'; MS.mkdir(exist_ok=True); mrows = []; mbad = []
for k, name, theme, g in mast.MAST:
    vals = []
    for lit in range(5):
        art = mast.mast_art(k, lit) if lit < 4 else V.old_art(k, 4)
        im, _ = V.mast_img(k, lit, False)
        if lit < 4 and (MS / f'{k}_{lit}.png').exists() and Image.open(MS / f'{k}_{lit}.png').convert('RGBA').tobytes() != im.convert('RGBA').tobytes(): mbad.append(f'{k}_{lit}')
        im.save(MS / f'{k}_{lit}.png'); vals.append(enc(art))
    mrows.append((k, vals))
for k, name, theme, g in m_v63.MAST63:
    vals = []
    for lit in range(5):
        im, art = V.mast_img(k, lit, True); im.save(MS / f'{k}_{lit}.png'); vals.append(enc(art))
    mrows.append((k, vals))
js = ['/* 숙련 아이콘 (B안: 단계 점 + 틀 색): 숙련마다 [안 배움, 초급, 중급, 상급, 달인] 다섯, 칸 색은 data-skicon.js와 같은 꼴.',
      '   틀 색은 hero.js HEX_FR (기본 · 동 · 은 · 금 · 백금). 만든 곳: 시안 저장소 drafts/skill-icons/dot/export_v67.py — 손으로 고치지 않는다 */',
      'const MASTICON = {'] + [f'  {k}: {json.dumps(v)},' for k, v in mrows]
js[-1] = js[-1].rstrip(','); js += ['};', '']
OUT_M.write_text('\n'.join(js), encoding='utf-8')
print('숙련', len(mrows), '예전 그림 다름', mbad, '틀 백금', m_v63.FRAME4)
