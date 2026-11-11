"""빌드 63: 고른 스킬북 · 룬 그림(20×20)을 게임 데이터 src/data-itemart.js로 내보낸다. 손으로 고치지 말고 이것으로 다시 뽑는다.
  python3 export_itemart.py <bookart 폴더(books2.py)> <runeart 폴더(runes.py)> <출력 data-itemart.js>
고른 것(사용자 11-11 13:03 그림에 동그라미): 찢어진 A · 낡은 A · 빛바랜 A · 신비한 A · 고대 B · 신화 A (신화 B = 신성용으로 보관 bk_holy)
  직업 스킬북 = B(레어도 띠 + 문양 창) — 전사 비스듬한 검 · 궁수 활 · 마법사 반짝이는 지팡이 · 성직자 해 · 짐꾼 바퀴 · 공용 마름모 · 도적 두건 그림자(빛나는 눈 · 웃는 입, 「도적 문양 표정」)
  룬 17종 × 하급 · 중급 · 상급 (시안 그대로)"""
import sys
sys.path.insert(0, sys.argv[1]); sys.path.insert(0, sys.argv[2])
import books2 as B, runes as R
ALPH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-/:;<=>?@[]^_{}~'


def enc(px):
    pal, idx = [], {}
    cells = []
    for y in range(20):
        for x in range(20):
            c = px.get((x, y))
            if c is None: cells.append('.'); continue
            c = tuple(c[:3])
            if c not in idx: idx[c] = len(pal); pal.append(c)
            cells.append(ALPH[idx[c]])
    assert len(pal) <= len(ALPH), len(pal)
    return ''.join('%02x%02x%02x' % c for c in pal) + '|' + ''.join(cells)


out = {}
for key, fn in [('bk_torn', B.torn_a), ('bk_old', B.old_a), ('bk_faded', B.faded_a), ('bk_myst', B.myst_a), ('bk_ancient', B.ancient_b), ('bk_myth', B.myth_a), ('bk_holy', B.myth_b)]:
    out[key] = enc(fn().px)
B.SIGIL['mage'] = B.SIGIL_B['mage']
B.SIGIL['rogue'] = ['..bbb..', '.bbbbb.', 'bkkkkkb', 'bkGkGkb', 'bkkkkkb', 'bkfffkb', '.bkkkb.']
for cls, _, col in B.CLS:
    for g in range(6):
        out[f'jb_{cls}_{g}'] = enc(B.skill_b(cls, col, g).px)
for k, _, col in R.RUNES:
    for lv in range(3):
        out[f'rn_{k}_{lv}'] = enc(R.make(k, col, lv))
lines = ['/* 빌드 63: 스킬북 · 룬 그림 (20×20, 「팔레트(6자리 이어 붙임)|칸 400글자」, . = 빈칸)',
         '   tools/saved/itemart63/export_itemart.py로 뽑는다 — 손으로 고치지 말 것. 시안: tools/saved/bookart63 · runeart63 */',
         'const ITEMART = {']
lines += [f"  {k!r}: {v!r}," for k, v in out.items()]
lines[-1] = lines[-1].rstrip(',')
lines += ['};', 'const ITEMART_ALPH = ' + repr(ALPH) + ';', '']
open(sys.argv[3], 'w').write('\n'.join(lines))
print(len(out), 'icons', sum(len(v) for v in out.values()), 'chars')
