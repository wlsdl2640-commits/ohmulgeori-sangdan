"""고른 새끼 펫 · 말 시안 → 게임 그림 파일 (손으로 고치지 말고 이것으로 다시 뽑는다): python3 emitpet70.py
11-17 23:23 사용자 「슬라임은 지금 그대로 유지 · 늑대 A … 산양 B … 페가수스 A · 노쇠 A … 명마 A」 → src/pxpet70.js (build.py에서 pxvault.js 뒤)
새끼 펫: PXU['pet_종류'] (서 있기 두 장 g · g2) + MONS['pet_종류'] 색(body · dark)을 다 자란 모습(시안 base)에 맞춘다 — 이름 · plan 'pet' · 드랍 없음은 그대로.
말: PXU['horse_종류'] (pxmon3.js 옛 그림 PXM3는 남겨 둔다 — drawMon은 PXU를 먼저 본다). MONS['horse_종류'] 색은 옛 HORSE_LOOK과 같다."""
import json, pathlib

D = pathlib.Path(__file__).resolve().parent; SRC = D.parent.parent.parent / 'src'
PETS = json.load(open(D / 't' / 'pets1.json'))['pets']; HORSES = json.load(open(D / 't' / 'horses1.json'))['pets']
PICK_PET = {'wolf': 'A', 'spider': 'A', 'golem': 'A', 'griffon': 'A', 'harpy': 'A', 'icesprite': 'A', 'scorpion': 'A', 'sewerrat': 'A', 'kelpie': 'A',
            'imp': 'A', 'vbat': 'A', 'goat': 'B', 'wyvern': 'A', 'redhare': 'A', 'pegasus': 'A'}   # 슬라임은 지금 그림 그대로 (사용자)
PICK_HORSE = {k: 'A' for k in ('old', 'donkey', 'gray', 'black', 'white', 'war', 'noble')}


def jv(v):
    if isinstance(v, dict): return '{ ' + ', '.join(f"{k}: {jv(x)}" for k, x in v.items()) + ' }'
    return json.dumps(v, ensure_ascii=False).replace('"', "'")


def grid(s): return '`\n' + s.strip('\n') + '\n`'


def entry(key, d, x, note):
    pal = dict(d.get('pal', {}), **x.get('pal', {}))
    o = [f"  {key}: {{   // {note}", f"    pal: {jv(pal)},", f"    g: {grid(x['g'])},", f"    g2: {grid(x['g2'])},"]
    extra = {'sh': [4, 2], 'hip': 99, 'ax': x['ax'], 'noArm': 1, 'still': 1, 'wpn': 'none'}
    if x.get('float'): extra['float'] = 1
    if x.get('ifr'): extra['ifr'] = x['ifr']
    o.append('    ' + ', '.join(f"{k}: {jv(v)}" for k, v in extra.items()) + ' },')
    return '\n'.join(o)


L = ["/* ───────── 새끼 펫 15 · 마구간 말 7 새 그림 (빌드 70 시안 · 11-17 23:23 사용자가 고른 모습) ─────────",
     "   옛 그림(pxpet.js · pxmon3.js PXPET3 새끼 · HORSE_GRID 말)은 남겨 두고 PXU가 먼저 쓰인다(drawMon · monIconURL · petQURL). 슬라임 새끼는 사용자 결정으로 옛 그림 그대로.",
     "   새끼 펫은 다 자란 모습(PXU 새 그림)의 색 · 글자를 빌린 반 해상도 손그림 — 서 있기 두 장(꼬리 · 귀 · 날개 · 숨쉬기, ifr = 두 장을 바꾸는 빠르기).",
     "   말은 적토마 · 켈피 · 페가수스 펫 말과 같은 뼈대(A 날씬한 준마) + 종류마다 색 · 손질.",
     "   원본은 tools/saved/mon70 (g/pets1.py · g/horses1.py → t/pets1.json · t/horses1.json → emitpet70.py) — 손으로 고치지 말고 다시 뽑는다. */",
     "Object.assign(PXU, {"]
for k, v in PICK_PET.items():
    d = PETS[k]; x = d[v]
    L.append(entry('pet_' + k, d, x, f"{d['name']} — 시안 {x['label']}: {x['desc']}"))
for k, v in PICK_HORSE.items():
    d = HORSES[k]; x = d[v]
    L.append(entry('horse_' + k, d, x, f"{d['name']} — 시안 {x['label']}: {x['desc']}"))
L[-1] = L[-1].rstrip(',')
L.append('});')
L.append("// 새끼 펫 색: 다 자란 모습의 몸 색(C Q c d)을 빌린다 (이름 · plan 'pet' · 드랍 없음은 그대로)")
L.append('[' + ', '.join(f"['{k}', '{PETS[k]['base']}']" for k in PICK_PET) + "].forEach(([k, b]) => { const m = MONS[b] || {}; Object.assign(MONS['pet_' + k], { body: m.body, dark: m.dark, skin: m.skin }); });")
L.append("// 말 색: 옛 HORSE_LOOK과 같은 값 (시안과 맞춘다)")
L.append('[' + ', '.join(f"['{k}', '{HORSES[k][PICK_HORSE[k]]['body']}', '{HORSES[k][PICK_HORSE[k]]['dark']}']" for k in PICK_HORSE) + "].forEach(([k, b, d]) => Object.assign(MONS['horse_' + k], { body: b, dark: d }));")
out = SRC / 'pxpet70.js'; out.write_text('\n'.join(L) + '\n', encoding='utf-8'); print('wrote', out, len(PICK_PET), len(PICK_HORSE))
