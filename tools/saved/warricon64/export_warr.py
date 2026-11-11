"""전사 계열 무기 · 방패 그림 내보내기 (빌드 64 장비 개편 1단계, 11-11 사용자 「3 작업 ㄱㄱ」).
시안 원본은 equip-draft 가지 drafts/equip/icon/ (여기 icon/ 에 같은 사본) — ls(장검) · g16(글라디우스) · gs(대검) · rnd(라운드) · bk(버클러) · cs(십자) · et(에테르).
python3 export_warr.py <출력 src/data-wicon.js>   (손으로 고치지 말 것 — 시안을 고치고 다시 뽑는다)
- WICON[게임 id] = 16 × '팔레트(6자리 이어 붙임)|칸 400' (20×20, 칸 글자 = WICON_ALPH 차례, '.' = 빈칸)
- WNAME · WDESC = 16 이름 · 설명 (시안 그대로 — 이름은 제안, 나중에 다듬는다) · WARCH = 16 원형 글자(A~D, 앞모습 작은 방패 꼴)
- WPROF[방패 id] = { rows: 옆면 뭉툭 칸 줄, pal: 16 × { 글자: 색 } } (원정 옆모습 · 동작에서 든 방패의 두께)
- WFRONT[방패 id] = 16 × { 1 테 · 2 판 · 3 판 그늘 · 4 돌기/보석 · 5 빛 · 6 무늬 } (앞모습 손에 든 작은 방패 색)"""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, 'icon'))
from wic import tohex
import sh
TYPES = [('sword', 'ls', 'w'), ('gladius', 'g16', 'w'), ('great', 'gs', 'w'),
         ('shield', 'rnd', 's'), ('buckler', 'bk', 's'), ('cross', 'cs', 's'), ('ether', 'et', 's')]
PROF_KIND = {'shield': 'round', 'buckler': 'buckler', 'cross': 'cross', 'ether': 'ether'}
ALPH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-/:;<=>?@[]^_{|}~'
def enc(img):
    cols = []; cells = []
    for y in range(20):
        for x in range(20):
            c = img.get((x, y))
            if c is None: cells.append('.'); continue
            h = tohex(tuple(c[:3]))
            if h not in cols: cols.append(h)
            cells.append(ALPH[cols.index(h)])
    assert len(cols) <= len(ALPH), len(cols)
    return ''.join(h[1:] for h in cols) + '|' + ''.join(cells)
def shield_pal(mod, pal):
    f = getattr(mod, 'prof', None)
    p = f(pal) if f else dict(PK=pal.get('c'), PF=pal.get('b'), PE=pal.get('E'), PO=pal.get('x') or pal.get('d'))
    out = {}
    for ch in 'KFEOLz':
        v = p.get('P' + ch) or pal.get(ch)
        if v: out[ch] = v if isinstance(v, str) else tohex(v)
    return out
FRONT_KEYS = {   # 앞모습 작은 방패 글자 1 테 · 2 판 · 3 판 그늘 · 4 돌기/보석/십자 · 5 빛 · 6 무늬 ← 그림 팔레트 글자 (앞 것부터)
    'shield':  {'1': 'E', '2': 'bBa', '3': 'cCb', '4': 'xZzo', '5': 'ep', '6': 'dmsDb'},
    'buckler': {'1': 'E', '2': 'bBa', '3': 'cCb', '4': 'xZzo', '5': 'ep', '6': 'dmkDb'},
    'cross':   {'1': 'E', '2': 'ba', '3': 'cb', '4': 'd', '5': 'eta', '6': 'Dfd'},
    'ether':   {'1': 'Qg', '2': 'x', '3': 'O', '4': 'po', '5': 'L', '6': 'l'},
}
def front_pal(gid, st, pal):
    keys = dict(FRONT_KEYS[gid])
    if gid == 'shield' and st == 'C': keys['6'] = 'mdsDb'      # 쇠띠 방패: 무늬 = 띠
    if gid == 'shield' and st == 'A': keys['6'] = 'sdmDb'      # 판자: 무늬 = 판자 틈
    h = lambda v: v if isinstance(v, str) else tohex(v)
    return {k: h(next((pal[c] for c in ks if pal.get(c)), '#808080')) for k, ks in keys.items()}
out = {'WICON': {}, 'WNAME': {}, 'WDESC': {}, 'WLV': {}, 'WARCH': {}, 'WPROF': {}, 'WFRONT': {}}
for gid, mname, kind in TYPES:
    mod = __import__(mname)
    G = mod.G; assert len(G) == 16, (mname, len(G))
    icons = []; names = []; descs = []; lvs = []; archs = []; profs = []; fronts = []
    for d in G:
        if kind == 'w':
            s, ic = mod.icon(d); img = ic.render()
        else:
            r = d['fn'](); s, pal = (r[0], r[1]) if isinstance(r, tuple) else r
            img = s.icon(pal).render()
            profs.append(shield_pal(mod, pal)); fronts.append(front_pal(gid, d['st'], pal))
        icons.append(enc(img)); names.append(d['name']); descs.append(d['desc']); lvs.append(d['lv']); archs.append(d.get('st', 'A'))
    out['WICON'][gid] = icons; out['WNAME'][gid] = names; out['WDESC'][gid] = descs; out['WLV'][gid] = lvs; out['WARCH'][gid] = ''.join(archs)
    if kind == 's': out['WPROF'][gid] = {'rows': sh.PROF[PROF_KIND[gid]], 'pal': profs}; out['WFRONT'][gid] = fronts
js = ['/* 전사 계열 무기 · 방패 그림 (빌드 64 장비 개편 1단계) — tools/saved/warricon64/export_warr.py로 뽑는다. 손으로 고치지 말 것 */',
      'const WICON_ALPH = ' + json.dumps(ALPH) + ';']
for k in ('WICON', 'WNAME', 'WDESC', 'WLV', 'WARCH', 'WPROF', 'WFRONT'):
    js.append(f'const {k} = ' + json.dumps(out[k], ensure_ascii=False, separators=(',', ':')) + ';')
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(js) + '\n')
print({k: len(v) for k, v in out['WICON'].items()}, os.path.getsize(sys.argv[1]))
print({k: v[:2] for k, v in out['WNAME'].items()})
print({k: v for k, v in out['WLV'].items()})
