"""고른 시안 → 게임 그림 파일 (손으로 고치지 말고 이것으로 다시 뽑는다): python3 emitunder70.py
하르겐 지하: 3구역 「옛 제국 수로」(11-18 01:38 사용자 고름) · 지하미궁 통로 · 암살자 길드 본부(11-18 09:05 · 09:19 사용자 고름)
고른 모습 하나를 기본 id로(시안 B를 골랐어도 id 꼬리 없이) · PXU_ACT는 기본 id에만 · 그림만 쓰는 id(길드장 패턴 모습)는 pxuLook 이름표
src/pxaqueduct.js · src/pxpassage.js — build.py에서 pxvault.js 뒤"""
import json, re, pathlib

D = pathlib.Path(__file__).resolve().parent; SRC = D.parent.parent.parent / 'src'
FILES = [
    ('pxaqueduct.js', '하르겐 지하 3구역 「옛 제국 수로」 · 「옛 제국의 대저수조」 몬스터 (빌드 70 시안 · 11-18 01:38 사용자가 고른 모습): 수로 히드라 A · 동굴 거머리 A · 독이끼 덩굴 A · 눈먼 동굴어 B(더듬이 메기) · 석상 파수꾼 B(기둥 짊어진 석상) · 우두머리 수문장 B(수도교 거인)', [
        ('aqhydra', 'aq3_hydra', 'aqhydra'),
        ('caveleech', 'aq3_leech', 'caveleech'),
        ('poisonvine', 'aq3_vine', 'poisonvine'),
        ('blindfish', 'aq3_fish', 'blindfish_b'),
        ('aqsentinel', 'aq3_statue', 'aqsentinel_b'),
        ('sluicewarden', 'aq3_boss', 'sluicewarden_b'),
    ], []),
    ('pxpassage.js', '하르겐 지하 「지하미궁 통로」 · 「암살자 길드 본부」 몬스터 (빌드 70 시안 · 11-18 09:05 · 09:19 사용자가 고른 모습): 쥐인간 금고털이 A · 사람 사냥꾼 B(사슬잡이 — 사슬 손질) · 형제단 사냥개 A · 밀수꾼 A · 그림자 분신 B(누런 매연) · 조직 두목 쥐 기수 A · 붉은 장갑 사냥꾼 B · 장부지기 A · 길드장 검은 두건 A(B · C는 패턴)', [
        ('ratburglar', 'pass4_rat', 'ratburglar'),
        ('manhunter', 'pass4_hunter', 'manhunter_b'),
        ('huntdog', 'pass4_dog', 'huntdog'),
        ('smuggler', 'pass4_smug', 'smuggler'),
        ('shadeclone', 'pass4_shade', 'shadeclone_b'),
        ('ratcrown', 'pass4_ratboss', 'ratcrown'),
        ('redhand', 'pass4_redboss', 'redhand_b'),
        ('greyledger', 'pass4_greyboss', 'greyledger'),
        ('guildmaster', 'pass4_guild', 'guildmaster'),
    ], [   # 그림만 쓰는 모습 (PXU.guildmaster.low — 패턴 1 · 2)
        ('guildmaster_p1', 'pass4_guild', 'guildmaster_p1', 'guildmaster', '그림자 분신을 두른 검은 두건'),
        ('guildmaster_p2', 'pass4_guild', 'guildmaster_p2', 'guildmaster', '독 안개를 두른 검은 두건'),
    ]),
]
# 파일 끝에 덧붙이는 것 (게임 장치와 잇는 줄 — 그림은 위에서 뽑는다)
POST = {
    'pxpassage.js': '''// 길드장 패턴 (11-18 09:05 「B, C는 패턴으로 승화」 — data-under70.js MONS.guildmaster.pat · core.js fPhase):
//   HP 50% 아래 패턴 1 그림(등 뒤 매연 분신) · 25% 아래 패턴 2 그림(독 약병 · 발밑 독 안개) — pxund.js pxuLow가 문턱 여럿을 본다, 바뀌는 순간 fx(under70.js)
//   fx.gas = 패턴 2 광역기 「독 안개」(fmot.js 'gas' — 약병이 포물선으로 날아가 사람마다 초록 안개) · fx.echo = 등 뒤 분신이 따라 베기
PXU.guildmaster.low = [{ hp: 0.5, id: 'guildmaster_p1', fx: 'u:low:smog' }, { hp: 0.25, id: 'guildmaster_p2', fx: 'u:low:gas' }];
Object.assign(PXU_ACT.guildmaster.fx, { gas: { pal: 'poison', hit: 'poison', big: 2, after: 'smoke', aoe: 'gas', shake: 2, nm: '독 안개' }, echo: { pal: 'smog', hit: 'slashes', big: 1, after: 'smoke' } });''',
}
KEEP = ['sh', 'hip', 'ax', 'ms', 'mx', 'my', 'arm', 'hand', 'wpn', 'wmap', 'idle', 'float', 'still', 'noArm']


def js(v):
    return json.dumps(v, ensure_ascii=False).replace('"', "'") if not isinstance(v, dict) else '{ ' + ', '.join(f"{k}: {js(x)}" for k, x in v.items()) + ' }'


def grid(s):
    return '`' + ('' if s.startswith('\n') else '\n') + s + ('' if s.endswith('\n') else '\n') + '`'


def weapons(extra):
    """head_js · 손으로 쓴 무기 덩어리를 무기 이름마다 나눈다 (// 설명 줄부터 PXU_FXW 줄까지)"""
    out = {}
    for m in re.finditer(r"(// [^\n]*\nPXU_WPN\.(\w+) = [\s\S]*?\nPXU_FXW\.\2 = '[a-z]+';\n)", extra):
        out[m.group(2)] = m.group(1)
    return out


def entry(nid, d, note):
    parts = [f"    pal: {js(d['pal'])},", f"    g: {grid(d['g'])}"]
    if 'g2' in d: parts[-1] += f", g2: {grid(d['g2'])}"
    if 'gm' in d: parts[-1] += ', gm: { ' + ', '.join(f"{k}: {grid(v)}" for k, v in d['gm'].items()) + ' }'
    parts[-1] += ', ' + ', '.join(f"{k}: {js(d[k])}" for k in KEEP if k in d) + ' }'
    return f"  {nid}: {{   // {note}\n" + '\n'.join(parts)


for fn, title, mons, extras in FILES:
    ent, acts, looks, wpn_js = [], [], [], []
    for base, jf, pk in mons:
        J = json.load(open(D / 't' / (jf + '.json'))); W = weapons(J.get('extra', ''))
        d = J['defs'][pk]; letter, name = d['label'].split(' ', 1)
        ent.append(entry(base, d, f"시안 {letter} {name} (사용자가 고른 것): {d['desc']}"))
        w = d.get('wpn')
        if w in W and W[w] not in wpn_js: wpn_js.append(W[w])
        acts.append(f"  {base}: {js(d['act'])}")
    for nid, jf, pk, base, nm in extras:
        J = json.load(open(D / 't' / (jf + '.json'))); d = J['defs'][pk]
        ent.append(entry(nid, d, f"{d['label']}: {d['desc']}"))
        looks.append(f"pxuLook('{nid}', '{base}', '{nm}');")
    out = [f"/* ───────── {title} ─────────", "   그림체는 빌드 55~61과 같은 「뭉툭」(큰 면 한 색 · 윗가장자리 빛 · 아래 그늘 · 부위마다 다른 글자로 PX_FX가 선을 긋는다).",
           "   원본은 tools/saved/mon70 (g/aq3.py · g/pass4.py 시안 도구 → t/*.json → emitunder70.py) — 손으로 고치지 말고 다시 뽑는다. */"]
    if wpn_js: out.append('// 새 무기 (빌드 70 시안)\n' + ''.join(wpn_js).rstrip('\n'))
    out.append('Object.assign(PXU, {\n' + ',\n'.join(ent) + '\n});')
    out.append('Object.assign(PXU_ACT, {\n' + ',\n'.join(acts) + '\n});')
    if looks: out.append('// 그림만 쓰는 모습 (드랍 없는 이름표)\n' + '\n'.join(looks))
    if fn in POST: out.append(POST[fn])
    (SRC / fn).write_text('\n'.join(out) + '\n', encoding='utf-8')
    print('wrote', fn, len(mons), 'ids', len(extras), 'extra', len(wpn_js), 'weapons')
