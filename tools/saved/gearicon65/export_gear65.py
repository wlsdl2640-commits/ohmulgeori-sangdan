"""도적 · 마법사 · 궁수 · 짐꾼 계열 무기 · 부장비 그림 내보내기 (빌드 65 · 사용자 11-12 14:15 「이것들 다 적용시켜」 — 시안 23종).
시안 원본은 equip-draft 가지 drafts/equip/icon/ (여기 icon/ 에 같은 사본 — sheet.py의 글꼴 폴더만 환경 변수로 바꿨다).
python3 export_gear65.py <출력 src/data-wicon65.js> [미리보기.png]   (손으로 고치지 말 것 — 시안을 고치고 다시 뽑는다)
시안 모듈(mk*.py)이 판을 만들 때 넘기는 (그림, 꼬리표, 이름, 설명)을 가로채 data-wicon.js(전사 계열, export_warr.py)와 같은 꼴로 더한다:
- WICON[게임 id] = n × '팔레트(6자리 이어 붙임)|칸 400' (20×20, 칸 글자 = WICON_ALPH 차례, '.' = 빈칸) · WNAME · WDESC · WLV
- 16단계 종류(n = 16): 단검 · 트럼프 카드 · 스태프 · 완드 · 오브 · 네크로노미콘 · 단궁 · 복합궁 · 장궁 · 대궁 · 컴파운드 보우 · 채찍 · 정글칼 /
  암기 · 락핀 · 마법 두루마리 · 공물 · 정령 · 손목 석궁 · 볼트통 · 볼트 · 화살
- 그림 하나뿐인 종류(n = 1): 룬소드 넷(rs_*) · 속성 특별 암기 여섯(sk_*) — 단계와 상관없이 같은 그림 · 이름"""
import sys, os, json, re, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(sys.argv[1]); PREV = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else None
sys.path.insert(0, os.path.join(HERE, 'icon'))
os.chdir(tempfile.mkdtemp())   # 시안 모듈이 저장하려는 판은 버린다
import mktype
CAP = {}
def _ts(path, title, sub, frames, items, **kw): CAP[path] = [items]; return (0, 0)
def _ss(path, title, sub, sections, **kw): CAP[path] = [s[1] for s in sections]; return (0, 0)
mktype.type_sheet = _ts; mktype.section_sheet = _ss
_out = sys.stdout; sys.stdout = open(os.devnull, 'w')   # 시안 모듈이 찍는 글은 버린다
import mkrogue, mkmage
for f in ('dagger', 'shuriken', 'card', 'lockpick'): getattr(mkrogue, f)()
for f in ('staff', 'wand', 'orb', 'necro', 'scroll', 'offer', 'spirit'): getattr(mkmage, f)()
import mkbow16, mkcbow16, mkxb16, mkarrow16, mkwm16   # 불러오면 바로 판을 만든다(가로챔)
import rs4
sys.stdout = _out
from wic import tohex
# (게임 id, 판, 구역) — 16단계
TYPES = [('dagger', 'R_dagger.png', 0), ('card', 'R_card.png', 1), ('staff', 'M_staff.png', 0), ('wand', 'M_wand.png', 0), ('orb', 'M_orb.png', 0), ('necro', 'M_necro.png', 0),
         ('bow', 'A_short16.png', 0), ('compbow', 'A_comp16.png', 0), ('longbow', 'A_long16.png', 0), ('greatbow', 'A_great16.png', 0), ('compound', 'C_cbow16.png', 0),
         ('whip', 'P_whip16.png', 0), ('machete', 'P_mach16.png', 0),
         ('shuriken', 'R_shuriken.png', 1), ('lockpick', 'R_lockpick.png', 0), ('tome', 'M_scroll.png', 0), ('offer', 'M_offer.png', 0), ('spirit', 'M_spirit.png', 0),
         ('wxbow', 'A_xbow16.png', 0), ('bcase', 'A_bcase16.png', 0), ('bolt', 'A_bolt16.png', 0), ('arrows', 'A_arrow16.png', 2)]
SPECIAL = ['sk_ice', 'sk_fire', 'sk_bolt', 'sk_poison', 'sk_wind', 'sk_dark']   # 속성 특별 암기 (판 R_shuriken 구역 2 차례: 고드름 · 불씨 쿠나이 · 벼락 침 · 독침 · 바람 표창 · 그림자 쿠나이)
RUNES = ['rs_fire', 'rs_ice', 'rs_light', 'rs_poison']                          # 룬소드 (rs4.R 차례: 지옥의 업화 · 혹한의 결정 · 광휘의 여명 · 극독의 어금니)
ALPH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-/:;<=>?@[]^_{|}~'
def hx(c): return c if isinstance(c, str) else tohex(tuple(c[:3]))
def enc(img):
    cols = []; cells = []
    for y in range(20):
        for x in range(20):
            c = img.get((x, y))
            if c is None: cells.append('.'); continue
            h = hx(c)
            if h not in cols: cols.append(h)
            cells.append(ALPH[cols.index(h)])
    assert len(cols) <= len(ALPH), len(cols)
    return ''.join(h[1:] for h in cols) + '|' + ''.join(cells)
out = {'WICON': {}, 'WNAME': {}, 'WDESC': {}, 'WLV': {}}; imgs = []
def put(gid, items, lvs=None):
    out['WICON'][gid] = [enc(i[0]) for i in items]; out['WNAME'][gid] = [i[2] for i in items]
    out['WDESC'][gid] = [re.sub(r'^\[[^\]]*\]\s*', '', i[3]) for i in items]   # 시안 판의 꼬리표(「[큰 그림]」 같은 카드 앞면 갈래)는 뗀다
    out['WLV'][gid] = lvs if lvs is not None else [int(i[1].split(' · ')[0].replace('Lv', '')) for i in items]
    imgs.extend(i[0] for i in items)
for gid, path, sec in TYPES:
    items = CAP[path][sec]; assert len(items) == 16, (gid, len(items)); put(gid, items)
    assert out['WLV'][gid] in ([1] + list(range(10, 151, 10)), list(range(50, 201, 10))), (gid, out['WLV'][gid])
sp = CAP['R_shuriken.png'][2]; assert len(sp) == len(SPECIAL)
for gid, it in zip(SPECIAL, sp): put(gid, [it], [1])
assert len(rs4.R) == len(RUNES)
for gid, d in zip(RUNES, rs4.R):
    s, pal, fx = d['fn'](); put(gid, [(s.icon(pal, fx=fx).render(), '', d['name'], d['desc'])], [50])
js = ['/* 도적 · 마법사 · 궁수 · 짐꾼 계열 무기 · 부장비 그림 (빌드 65) — tools/saved/gearicon65/export_gear65.py로 뽑는다. 손으로 고치지 말 것. data-wicon.js(전사 계열)에 더한다 */']
for k in ('WICON', 'WNAME', 'WDESC', 'WLV'):
    js.append(f'Object.assign({k}, ' + json.dumps(out[k], ensure_ascii=False, separators=(',', ':')) + ');')
open(OUT, 'w', encoding='utf-8').write('\n'.join(js) + '\n')
print({k: len(v) for k, v in out['WICON'].items()}, os.path.getsize(OUT))
if PREV:
    from PIL import Image
    Z = 3; cols = 16; rows = (len(imgs) + cols - 1) // cols
    sh = Image.new('RGB', (cols * 22 * Z + 6, rows * 22 * Z + 6), (40, 46, 60))
    for k, img in enumerate(imgs):
        for (x, y), c in img.items():
            h = hx(c); rgb = tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
            px, py = 6 + (k % cols) * 22 * Z + x * Z, 6 + (k // cols) * 22 * Z + y * Z
            for dy in range(Z):
                for dx in range(Z): sh.putpixel((px + dx, py + dy), rgb)
    sh.save(PREV)
