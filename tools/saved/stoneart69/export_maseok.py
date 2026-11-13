"""빌드 69: 고른 마석 그림(시안 2 — 11-14 00:42 사용자 「마석은 아까 나온 시안2로」) 여덟(20×20)을 게임 데이터로 내보낸다.
손으로 고치지 말고 이것으로 다시 뽑는다:  python3 export_maseok.py <출력 src/data-maseokart.js>
그림 = maseok2.py icon(i) 그대로 (판 maseok2_drafts.png와 같은 픽셀). 꼴은 data-itemart.js ITEMART와 같다(「팔레트(6자리 이어 붙임)|칸 400글자」, . = 빈칸),
열쇠는 ms_<종류> = 게임 아이템 id (data-maseok69.js · sprites.js itemArtKey)."""
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import maseok2 as M   # noqa: E402
ALPH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-/:;<=>?@[]^_{}~'


def enc(px):
    pal, idx, cells = [], {}, []
    for y in range(20):
        for x in range(20):
            c = px.get((x, y))
            if c is None: cells.append('.'); continue
            c = tuple(c[:3])
            if c not in idx: idx[c] = len(pal); pal.append(c)
            cells.append(ALPH[idx[c]])
    assert len(pal) <= len(ALPH), len(pal)
    return ''.join('%02x%02x%02x' % c for c in pal) + '|' + ''.join(cells)


out = {f'ms_{st[1]}': enc(M.icon(i)) for i, st in enumerate(M.STONES)}
lines = ['/* 빌드 69: 마석 여덟 그림 (20×20, ITEMART와 같은 꼴) — tools/saved/stoneart69/export_maseok.py로 뽑는다, 손으로 고치지 말 것.',
         '   시안 2(maseok2.py · maseok2_drafts.png) 그대로: 문스톤 · 사파이어 · 가넷 · 다이아몬드 · 오팔 · 아쿠아마린 · 호박(속에 발톱) · 흑요석 */',
         'Object.assign(ITEMART, {']
lines += [f'  {k}: {v!r},' for k, v in out.items()]
lines[-1] = lines[-1].rstrip(',')
lines += ['});', '']
open(sys.argv[1], 'w').write('\n'.join(lines))
print(len(out), 'icons')
