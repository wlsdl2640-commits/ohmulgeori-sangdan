"""빌드 39 그림 → 게임 데이터
 src/data-officon.js : 부장비 7종(offhand.py) + 속성 화살 3종(elemarrows.py, 고른 꼴 EL_STYLE)
 src/data-gearicon.js: 무기·갑옷·장신구·가방·투기장 장비 19종(gear.py) → OFFICON에 합친다 (그리는 길이 하나)
확정 그림: ../final_snap_off/{종류}_{모습}.png (20×20)
python3 export_v39.py"""
import sys, json, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import offhand, elemarrows, gear, cell
from export_off import enc, snap, SNAP
EL_STYLE = 'B'      # 속성 화살 그림: A 촉 효과 / B 빛 테두리 (시안에서 고르면 바꾼다)
GEAR_GLOW = True    # 장비 '그 위' 단계 금빛 테두리
SRC = pathlib.Path('/home/claude/game/src')
def run(fn):
    a = offhand.item(); fn(a); return a
rows = []
for k, name, who, fns, labels in offhand.OFF:
    vals = []
    for i in range(4): a = run(fns[i]); vals.append(enc(a)); snap(a).save(SNAP / f'{k}_{i}.png')
    rows.append((k, vals))
for el, base in (('fire', 'firearrows'), ('ice', 'icearrows'), ('thunder', 'boltarrows')):
    vals = []
    for i in range(4): a = run(lambda a, i=i: elemarrows.elem_arrow(a, el, i, EL_STYLE)); vals.append(enc(a)); snap(a).save(SNAP / f'{base}_{i}.png')
    rows.append((base, vals))
js = ['/* 부장비 그림 (빌드 38~): 종류마다 [견습·숲지기, 강철·폭풍, 서리·사막왕, 그 위] 넷, 16×20칸 — 칸 색 꼴은 data-skicon.js와 같고 #ff00ff는 빈칸.',
      '   만든 곳: drafts/skill-icons/dot/export_v39.py (offhand.py · elemarrows.py) — 손으로 고치지 않는다 */', 'const OFFICON = {']
js += [f'  {k}: {json.dumps(v)},' for k, v in rows]; js[-1] = js[-1].rstrip(','); js += ['};', '']
(SRC / 'data-officon.js').write_text('\n'.join(js), encoding='utf-8')
if not GEAR_GLOW: gear.GLOW[:] = [None] * 4
GID = {'장검': 'sword', '단검': 'dagger', '글라디우스*': 'gladius', '도끼': 'axe', '철퇴': 'mace', '몽둥이': 'club', '지팡이': 'staff', '창': 'lance', '삼지창*': 'trident',
       '활': 'bow', '류트': 'lute', '판금 갑옷': 'plate', '가죽 갑옷': 'leather', '로브': 'robe', '투기장 흉갑*': 'arenamail', '반지': 'ring', '부적': 'amulet', '챔피언의 반지*': 'champring', '가방': 'bag'}
grows = []
for nm, fn in gear.GEAR:
    k = GID[nm]; vals = []
    for i in range(4): a = run(lambda a, i=i, fn=fn: fn(a, i)); vals.append(enc(a)); snap(a).save(SNAP / f'{k}_{i}.png')
    grows.append((k, vals))
js = ['/* 장비 그림 (빌드 39~): 무기·갑옷·장신구·가방·투기장 장비, 종류마다 단계 모습 넷 — 꼴은 data-officon.js와 같다. OFFICON에 합쳐 한 길로 그린다.',
      '   만든 곳: drafts/skill-icons/dot/export_v39.py (gear.py) — 손으로 고치지 않는다 */', 'const GEARICON = {']
js += [f'  {k}: {json.dumps(v)},' for k, v in grows]; js[-1] = js[-1].rstrip(','); js += ['};', 'Object.assign(OFFICON, GEARICON);', '']
(SRC / 'data-gearicon.js').write_text('\n'.join(js), encoding='utf-8')
print('부장비', len(rows), '장비', len(grows), (SRC / 'data-officon.js').stat().st_size, (SRC / 'data-gearicon.js').stat().st_size)
