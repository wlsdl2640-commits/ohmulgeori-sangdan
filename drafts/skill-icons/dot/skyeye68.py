"""하늘의 눈 (용기수 · dragonscale 자리: 모든 적 표식) 다시 그린 시안 넷 — 11-12 19:57 사용자 「용기수의 하늘의 눈 빼고 다 합격」
python3 skyeye68.py <출력 판.png> → 낱장 skyeye68/{A~D}.png"""
import sys, pathlib
D = pathlib.Path(__file__).parent; sys.path.insert(0, str(D))
import cell, lib
from lib import sp, bg, dot
from cell import Art
import c_ride63 as R
import v67icons   # 반짝이를 비스듬한 꼴로 바꿔 둔다
from PIL import Image, ImageDraw, ImageFont

def A_(theme, **k): return bg(Art(), theme, **k)
# 세로 동공 와이번 눈 (14×10): h 밝은 비늘 · g 비늘 · y 홍채 테 · Y 홍채 · k 동공 · w 빛
EYE = ['....hhhhhh....',
       '..hhgggggghh..',
       '.hgyyykkyyygh.',
       'hgyYYYkkYYYygh',
       'gyYwYYkkYYYYyg',
       'gyYYYYkkYYYYyg',
       'hgyYYYkkYYYygh',
       '.hgyyykkyyygh.',
       '..hhgggggghh..',
       '....hhhhhh....']
EYEP = {'h': ('#5ab0a0', 8), 'g': ('#2a7a6a', 8), 'y': ('#e08a18', 6), 'Y': ('#ffd040', 6), 'k': ('#140c04', 1), 'w': ('#ffffff', 1)}
MARK5 = ['..r..', '.rRr.', 'rR.Rr', '.rRr.', '..r..']
MARKP = {'r': ('#ff4a3a', 13), 'R': ('#a01a1a', 13)}
def v_a():   # A 와이번 눈 — 하늘빛 바탕에 크게
    a = A_('sky', cy=9.5, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    sp(a, EYE, 1, 5, EYEP)
    for x in (3, 7, 11): sp(a, ['.h.', 'hgh'], x, 2, EYEP)   # 눈두덩 비늘 뿔
    return a
def v_b():   # B 높이 나는 와이번 + 아래 적 셋에 표식
    a = A_('sky', cy=2, r=16, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    R.rs(a, R.WYV_V, R.WYV, s=0.6, dx=3.4, dy=1.0)
    for x0 in (4, 8, 12):   # 시선 줄 (점선)
        for i, y in enumerate(range(10, 14)):
            if i % 2 == 0: a.set(round(8 + (x0 - 8) * (y - 9) / 5), y, '#e8f4ff')
    for x in (3, 7, 11): sp(a, ['.r.', 'rRr', '.r.'], x, 14, MARKP)
    return a
def v_c():   # C 과녁 홍채 눈 — 흰자 + 붉은 과녁 눈동자
    a = A_('sky', cy=9.5, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    E = ['....wwwwww....',
         '..wwWWWWWWww..',
         '.wWWrrrrrrWWw.',
         'wWWrrWWWWrrWWw',
         'wWrrWWkkWWrrWw',
         'wWrrWWkkWWrrWw',
         'wWWrrWWWWrrWWw',
         '.wWWrrrrrrWWw.',
         '..wwWWWWWWww..',
         '....wwwwww....']
    sp(a, E, 1, 5, {'w': ('#c8d4e0', 6), 'W': ('#ffffff', 6), 'r': ('#ff4a3a', 13), 'k': ('#a01a1a', 13)})
    for (x, y) in ((2, 2), (13, 2), (1, 17), (14, 17)): v67icons.XPLUS(a, x, y, '#ffffff', '#c8e4ff')
    return a
def v_d():   # D 과녁 무늬 와이번 눈 — 세로 동공 둘레에 붉은 고리
    a = A_('teal', cy=9.5, cuts=[0.0, 0.22, 0.42, 0.62, 0.84])
    E = ['....hhhhhh....',
         '..hhgggggghh..',
         '.hgyrrkkrrygh.',
         'hgyrYYkkYYrygh',
         'gyrYwYkkYYYryg',
         'gyrYYYkkYYYryg',
         'hgyrYYkkYYrygh',
         '.hgyrrkkrrygh.',
         '..hhgggggghh..',
         '....hhhhhh....']
    sp(a, E, 1, 5, dict(EYEP, r=('#ff4a3a', 13)))
    for x in (3, 7, 11): sp(a, ['.h.', 'hgh'], x, 2, EYEP)
    return a
VARS = [('A', '와이번 눈', v_a), ('B', '높이 나는 와이번 + 표식 셋', v_b), ('C', '과녁 눈동자', v_c), ('D', '과녁 무늬 와이번 눈', v_d)]
if __name__ == '__main__':
    out = pathlib.Path(sys.argv[1]); (D / 'skyeye68').mkdir(exist_ok=True)
    FB = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
    F = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
    CW = 200; sh = Image.new('RGB', (CW * 5 + 16, 260), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((8, 8), '하늘의 눈 (용기수 · 모든 적 표식) — 다시 그린 시안 넷 · 맨 왼쪽은 뺀 그림', font=FB, fill=(240, 196, 90))
    old = Image.open(D / 'v67' / 'dragonscale.png'); z = cell.zoom(old, 3); sh.paste(z, (8, 44), z); d.text((8, 196), '뺀 그림', font=FB, fill=(150, 140, 130))
    for i, (k, nm, fn) in enumerate(VARS):
        im = fn().img('dmg'); im.save(D / 'skyeye68' / f'{k}.png'); z = cell.zoom(im, 3); x0 = 8 + (i + 1) * CW
        sh.paste(z, (x0, 44), z); sm = cell.zoom(im, 1); sh.paste(sm, (x0 + 150, 44), sm)
        d.text((x0, 196), f'{k} {nm}', font=FB, fill=(232, 228, 220))
    sh.save(out); print(out, sh.size)
