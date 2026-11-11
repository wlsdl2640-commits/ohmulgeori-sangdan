"""도적 스킬북 문양 = 표창 시안 (11-11 14:27 사용자 「이건 표창으로 해달라는 거였는데」 — 「도적 문양 표정」은 「표창」이었다).
표창은 거울 대칭만 (바람개비 꼴 · 위아래좌우 십자 꼴 금지). 가운데 구멍 둘레 네 칸을 따로 칠하면 작은 더하기 꼴이 되니 날 색으로만."""
import sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import books2 as B
from books import Cv, hx, dk

PAL = dict(B.SC)
PAL.update({'d': '#6e7888', 'D': '#8a94a4', 'e': '#454b58', 'p': '#9a6ae8', 'P': '#d8b8ff', 'w': '#7a8494'})

OPTS = {
 'A': ('네 날 표창', '은빛 강철 · 가운데 구멍 · 빛은 왼쪽 위 (창고 표창 원형 A와 같은 꼴)', (5, 8), [
    'B.....b',
    '.Ba.ab.',
    '.aBabb.',
    '..akd..',
    '.bbddd.',
    '.bd.dd.',
    'b.....d']),
 'B': ('고리 표창', '가운데 쇠고리를 밝게 도드라지게 · 날은 어둡게', (5, 8), [
    'a.....d',
    '.bb.dd.',
    '.bBBad.',
    '..Bkb..',
    '.dabbe.',
    '.dd.ee.',
    'd.....e']),
 'C': ('그림자 표창', '검게 벼린 날 · 날 끝과 가운데만 보랏빛', (5, 8), [
    'p.....p',
    '.Bd.db.',
    '.daddd.',
    '..dPd..',
    '.ddddd.',
    '.bd.dd.',
    'p.....p']),
 'D': ('날아가는 표창', '네 날 표창이 오른쪽으로 날아가고 왼쪽에 바람 줄 둘', (4, 7), [
    '.........',
    '..B.....b',
    '...Ba.ab.',
    'ww.aBabb.',
    '....akd..',
    'ww.bbddd.',
    '...bd.dd.',
    '..b.....d',
    '.........']),
}
CUR = ('지금 (두건 그림자 — 잘못 알아들음)', '', (5, 8), ['..bbb..', '.bbbbb.', 'bkkkkkb', 'bkGkGkb', 'bkkkkkb', 'bkfffkb', '.bkkkb.'])


def book(opt, grade, col='#5a5a6a'):
    _, _, (x0, y0), rows = opt
    cv = Cv(); C = hx(col)
    B.base(cv, C)
    R = hx(B.QCOL[grade])
    for x in range(4, 13): cv.set(x, 6, R); cv.set(x, 16, dk(R, .2))
    cv.rect(4, 7, 12, 15, dk(C, .55))
    cv.pat(x0, y0, rows, {k: hx(v) for k, v in PAL.items()})
    for (x, y) in [(4, 5), (12, 5), (4, 17), (12, 17)]: cv.set(x, y, hx('#e8d090'))
    return cv


def check(rows):
    """거울 대칭(모양) 확인: 좌우 · 위아래 모두"""
    S = [[c != '.' for c in r] for r in rows]
    lr = all(r == r[::-1] for r in S); ud = S == S[::-1]
    return lr, ud


if __name__ == '__main__':
    from PIL import Image
    for k, o in OPTS.items(): print(k, o[0], check(o[3]))
    s = 8; n = len(OPTS) + 1; im = Image.new('RGB', (n * (20 * s + 12) + 12, 20 * s + 24 + 60), (19, 22, 30))
    for i, o in enumerate([CUR] + list(OPTS.values())):
        cv = book(o, 3)
        for ss, oy in ((s, 12), (2, 20 * s + 24)):
            for (x, y), c in cv.px.items():
                for yy in range(ss):
                    for xx in range(ss): im.putpixel((12 + i * (20 * s + 12) + x * ss + xx, oy + y * ss + yy), tuple(c[:3]))
    im.save('quick.png'); print(im.size)
