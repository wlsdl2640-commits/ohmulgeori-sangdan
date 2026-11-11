"""빌드 63: 고른 스킬북 · 룬 그림(20×20)을 게임 데이터 src/data-itemart.js로 내보낸다. 손으로 고치지 말고 이것으로 다시 뽑는다.
  python3 export_itemart.py <bookart 폴더(books2.py)> <runeart 폴더(runes.py)> <출력 data-itemart.js>
고른 것(사용자 11-11 13:03 그림에 동그라미): 찢어진 A · 낡은 A · 빛바랜 A · 신비한 A · 고대 B · 신화 A (신화 B = 신성용으로 보관 bk_holy)
  직업 스킬북 = B(레어도 띠 + 문양 창) — 전사 비스듬한 검 · 궁수 활 · 마법사 반짝이는 지팡이 · 성직자 해 · 짐꾼 바퀴 · 공용 마름모 · 도적 네 날 표창(「도적 문양 표창」 — 11-11 14:50 시안 A, 두건 그림자는 잘못 알아들은 것)
  룬 17종 × 하급 · 중급 · 상급 (시안 그대로)
빌드 64 룬 개편(사용자 11-11 22:02 ~ 11-12 02:08): 합친 19종 × 하급 · 중급 · 상급 · 최상급 — runes_ext.py(MERGED · make_top) · glyph_alts.py(고른 최상급 문양).
  하급 ~ 상급은 빌드 63 그림 그대로(공방 = 수호 돌 + 공격 검 문양, 새 6종 = runes_ext 그림), 화염은 돌 모양까지 새로(불꽃 돌 + 불꽃 · 하급 ~ 최상급).
  최상급 문양: 강인 C 엄지 띠 + 접힌 금 · 금빛(옆 주먹 팔) · 마력 C 마법진 · 신속 D 번개 화살 · 마나 C 마나 결정 · 폭풍 B 바람 세 줄 · 냉기 합침 2 · 생명 C 두 겹 하트 · 나머지는 make_top 기본"""
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
B.SC['d'] = '#6e7888'   # 표창 그늘 쪽 강철
B.SIGIL['rogue'] = ['B.....b', '.Ba.ab.', '.aBabb.', '..akd..', '.bbddd.', '.bd.dd.', 'b.....d']   # 네 날 표창 (11-11 14:50 사용자 「A로」, 시안 rogue_shuri.py A)
for cls, _, col in B.CLS:
    for g in range(6):
        out[f'jb_{cls}_{g}'] = enc(B.skill_b(cls, col, g).px)
import runes_final as RF   # 빌드 64: 게임 룬 id → 그림 (19종 × 4등급)
for gid in RF.RUNE_ART:
    for lv in range(4):
        out[f'rn_{gid}_{lv}'] = enc(RF.final(gid, lv))
lines = ['/* 빌드 63: 스킬북 · 룬 그림 (20×20, 「팔레트(6자리 이어 붙임)|칸 400글자」, . = 빈칸) · 빌드 64: 룬 19종 × 하급 ~ 최상급',
         '   tools/saved/itemart63/export_itemart.py로 뽑는다 — 손으로 고치지 말 것. 시안: tools/saved/bookart63 · runeart63 */',
         'const ITEMART = {']
lines += [f"  {k!r}: {v!r}," for k, v in out.items()]
lines[-1] = lines[-1].rstrip(',')
lines += ['};', 'const ITEMART_ALPH = ' + repr(ALPH) + ';', '']
open(sys.argv[3], 'w').write('\n'.join(lines))
print(len(out), 'icons', sum(len(v) for v in out.values()), 'chars')
