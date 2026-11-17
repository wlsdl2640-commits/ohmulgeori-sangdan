"""고른 시안 → 게임 그림 파일 (손으로 고치지 말고 이것으로 다시 뽑는다): python3 emit70.py
11-16 22:13 · 22:15 · 11-17 18:46 사용자 고름 — 고른 순서대로 기본 id · _b · _c (PXU 항목 통째 + pxuLook + PXU_SKIN/PXU_SKIN_NAME, PXU_ACT는 기본 id에만)
src/pxruins.js(천계의 유적 폐허 · 성소) · src/pxstar.js(별의 정원 · 별의 왕좌) · src/pxvault.js(보물 던전 · 보물고) — build.py에서 pxsea69.js 뒤"""
import json, re, pathlib

D = pathlib.Path(__file__).resolve().parent; SRC = D.parent.parent.parent / 'src'
FILES = [
    ('pxruins.js', '천계의 유적 폐허 · 무너진 천계의 성소 몬스터 (빌드 70 시안 · 사용자가 고른 모습): 유적 수호상 · 타락 천사 · 스핑크스 · 오파님 · 우두머리 천계의 거상 · 두목 타락한 대천사', [
        ('ruinguard', 'ruin2', ['ruinguard_b']),
        ('fallenangel', 'angel1', ['fallenangel', 'fallenangel_b', 'fallenangel_c']),
        ('sphinx', 'sphinx1', ['sphinx', 'sphinx_b']),
        ('ophan', 'ophan1', ['ophan', 'ophan_c']),
        ('colossus', 'colossus1', ['colossus', 'colossus_c']),
        ('fallenarch', 'arch1', ['fallenarch']),
    ]),
    ('pxstar.js', '별의 정원 · 별의 왕좌 몬스터 (빌드 70 시안 · 사용자가 고른 모습): 별빛 요정 · 월광 사냥개 · 성운 해파리 · 성좌 기사 · 별꽃 트렌트 · 우두머리 별고래 · 두목 별의 여왕 아스테리아', [
        ('starsprite', 'sprite1', ['starsprite']),
        ('moonhound', 'hound2', ['moonhound']),
        ('constellation', 'knight2', ['constellation_b']),
        ('nebula', 'jelly1', ['nebula', 'nebula_b']),
        ('startreant', 'tree1', ['startreant_b']),
        ('starwhale', 'whale1', ['starwhale', 'starwhale_c']),
        ('starqueen', 'queen1', ['starqueen_b']),
    ]),
    ('pxvault.js', '보물 던전 · 보물고 몬스터 (빌드 70 시안 · 사용자가 고른 모습): 미믹 · 황금 골렘 · 두목 보물 수호자', [
        ('mimic', 'mimic1', ['mimic', 'mimic_b']),
        ('goldgolem', 'gold1', ['goldgolem']),
        ('treasureguard', 'guard2', ['treasureguard']),
    ]),
]
KEEP = ['sh', 'hip', 'ax', 'ms', 'mx', 'my', 'arm', 'hand', 'wpn', 'wmap', 'idle', 'float', 'still', 'noArm']
SUF = ['', '_b', '_c', '_d']


def js(v):
    return json.dumps(v, ensure_ascii=False).replace('"', "'") if not isinstance(v, dict) else '{ ' + ', '.join(f"{k}: {js(x)}" for k, x in v.items()) + ' }'


def grid(s):
    return '`' + ('' if s.startswith('\n') else '\n') + s + ('' if s.endswith('\n') else '\n') + '`'


def weapons(extra):
    """head_js 덩어리를 무기 이름마다 나눈다 (// 설명 줄부터 PXU_FXW 줄까지)"""
    out = {}
    for m in re.finditer(r"(// [^\n]*\nPXU_WPN\.(\w+) = [\s\S]*?\nPXU_FXW\.\2 = '[a-z]+';\n)", extra):
        out[m.group(2)] = m.group(1)
    return out


for fn, title, mons in FILES:
    ent, acts, looks, skins, names, wpn_js = [], [], [], {}, {}, []
    for base, jf, picks in mons:
        J = json.load(open(D / 't' / (jf + '.json'))); W = weapons(J.get('extra', ''))
        ids = [base + SUF[i] for i in range(len(picks))]
        for i, (pk, nid) in enumerate(zip(picks, ids)):
            d = J['defs'][pk]; lab = d['label']; letter, name = lab.split(' ', 1)
            note = f"시안 {letter} {name}" + (' (사용자가 고른 것 중 첫째 = 기본 모습)' if i == 0 and len(picks) > 1 else (' (사용자가 고른 것)' if len(picks) == 1 else '')) + ': ' + d['desc']
            parts = [f"    pal: {js(d['pal'])},", f"    g: {grid(d['g'])}"]
            if 'g2' in d: parts[-1] += f", g2: {grid(d['g2'])}"
            if 'gm' in d: parts[-1] += ', gm: { ' + ', '.join(f"{k}: {grid(v)}" for k, v in d['gm'].items()) + ' }'
            parts[-1] += ', ' + ', '.join(f"{k}: {js(d[k])}" for k in KEEP if k in d) + ' }'
            ent.append(f"  {nid}: {{   // {note}\n" + '\n'.join(parts))
            w = d.get('wpn')
            if w in W and W[w] not in wpn_js: wpn_js.append(W[w])
            if i == 0: acts.append(f"  {base}: {js(d['act'])}")
            else: looks.append(f"pxuLook('{nid}', '{base}', MONS.{base}.name);")
            names.setdefault(base, []).append(name)
        if len(ids) > 1: skins[base] = ids
    out = [f"/* ───────── {title} ─────────", "   그림체는 빌드 55~61과 같은 「뭉툭」(큰 면 한 색 · 윗가장자리 빛 · 아래 그늘 · 부위마다 다른 글자로 PX_FX가 선을 긋는다).",
           "   원본은 tools/saved/mon70 (g/*.py 시안 도구 → t/*.json → emit70.py) — 손으로 고치지 말고 다시 뽑는다. */"]
    if wpn_js: out.append('// 새 무기 (빌드 70 시안)\n' + ''.join(wpn_js).rstrip('\n'))
    out.append('Object.assign(PXU, {\n' + ',\n'.join(ent) + '\n});')
    out.append('Object.assign(PXU_ACT, {\n' + ',\n'.join(acts) + '\n});')
    if looks:
        out.append('// 만날 때마다 모습 하나: 기본 모습이 아닌 것은 드랍 없는 이름표 (pxuLook) · PXU_ACT는 기본 id에만\n' + '\n'.join(looks))
        out.append('Object.assign(PXU_SKIN, ' + js(skins) + ');')
        out.append('Object.assign(PXU_SKIN_NAME, ' + js({k: v for k, v in names.items() if k in skins}) + ');')
    (SRC / fn).write_text('\n'.join(out) + '\n', encoding='utf-8')
    print('wrote', fn, sum(len(p) for _, _, p in mons), 'ids')
