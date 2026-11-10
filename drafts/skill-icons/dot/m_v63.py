"""빌드 63 후보 — 새 숙련 15개 그림 시안 (B안: 아래 단계 점 셋 + 틀 색 동 · 은 · 금) + 달인(4차) 단계 제안
python3 m_v63.py → m_v63.png"""
import math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import cell, b4
from cell import Art, mix, W, H
from lib import *
from spr import *
import mast
from mast import TIER, FRAME, FRAME0, closed_tome, RING_A, GOLD
import c_v63 as V
from c_ride63 import g_ride
def A(theme, **k): return bg(Art(), theme, **k)
# ── 상징 ──
def g_whip(a, dy=0):   # 채찍술: 감아 쥔 채찍
    cm = V.whip_cm([(7, 9), (4, 7), (4.5, 3.5), (8, 2), (11.5, 3.5), (12, 7), (9, 9.5), (6.5, 8), (8, 5)], ((5, 14 + dy), (6, 10 + dy)))
    cm = {(x, y + (dy if y < 12 else 0)): c for (x, y), c in cm.items()}
    sp(a, grid(cm), V.WHIPP)
def g_wagon(a, dy=0):   # 마차 몰기: 마차 바퀴 + 고삐
    sp(a, WHEEL, 3, 3 + dy, {'y': ('#ffd84a', 6)})
    for (x, y) in [(1, 2), (2, 3), (13, 2), (14, 3)]: a.set(x, y + dy, '#c08a4a')
def g_machete(a, dy=0): sp(a, V.MACHETE, 2, 1 + dy)
def g_cards(a, dy=0):
    sp(a, V.CARD_K, 2, 3 + dy); sp(a, V.CARD, 7, 2 + dy)
def g_lockpick(a, dy=0):   # 따개 솜씨: 자물쇠 + 따개
    sp(a, PADLOCK, 3, 3 + dy)
    sp(a, (['.......mw', '......mM.', '.....mM..', '....mM...', 'yyymM....', 'yY.......'], {}), 7, 8 + dy)
def g_shuri(a, dy=0): sp(a, V.SHURI, 2, 1 + dy)
def g_twin(a, dy=0):   # 쌍수술: 두 단검이 V로 (자루끼리 모인다)
    from c_rogue import dagger_at
    dagger_at(a, 7, 4 + dy, 'ur'); dagger_at(a, 0, 4 + dy, 'ul')
GLAD = ['...wM...', '..wmmM..', '..wmmM..', '.wmmmmM.', '.wmmmmM.', '..wmmM..', '..wmmM..', 'yyyyyyYY', '...lL...', '...lL...', '..yyYY..', '..yyYY..']
def g_gladius(a, dy=0): sp(a, GLAD, 4, 2 + dy, GOLD)
GREAT = ['....wM....', '...wmmM...', '...wmmM...', '...wmmM...', '...wmmM...', '...wmmM...', '...wmmM...', '...wmmM...', '...wmmM...', 'yyyyyyyyYY', '....lL....', '....lL....', '...yyYY...']
def g_great(a, dy=0): sp(a, GREAT, 3, 1 + dy, GOLD)
def g_ether(a, dy=0):   # 마력 방패술: 작은 구슬이 펼친 마력 막 (육각)
    cy = 7.5 + dy
    for (x, y) in hex_ring(7.5, cy, 6.2, w=0.6): a.set(x, y, '#bfe8ff')
    for (x, y) in hex_ring(7.5, cy, 5.0, w=0.45): a.set(x, y, '#6ab0ff')
    sp(a, (grid(orb(7.5, cy, 2.4, '123')), {'1': ('#e8fcff', 12), '2': ('#6ac0ff', 12), '3': ('#2a6ad0', 12)}))
def g_xbow(a, dy=0): sp(a, V.WXBOW, 0, 1 + dy)
def g_wand(a, dy=0):   # 완드술: 짧은 완드 + 끝 빛
    sp(a, (['.........gG', '........gGG', '.......tGG.', '......tT...', '.....tT....', '....tT.....', '...tT......', '..yY.......', '.tT........', 'tT.........'], {'t': ('#c08a4a', 3), 'T': ('#7a4c22', 3), 'g': ('#a0ffb0', 8), 'G': ('#3ac06a', 8), 'y': ('#ffd84a', 6), 'Y': ('#c08a1c', 6)}), 2, 3 + dy)
    star5(a, 13, 3 + dy)
def g_orb(a, dy=0):   # 구슬술: 발톱 받침 위 원소 구슬
    sp(a, (grid(orb(7.5, 6.5 + dy, 3.6, '123')), {'1': ('#ffe0f0', 12), '2': ('#c070ff', 12), '3': ('#5a2ab0', 12)}))
    sp(a, (['y.....y', 'yy...yy', '.yyyyy.', '..YYY..'], GOLD), 4, 10 + dy)
RING_BLOOD = ['..rr..', '.r..r.', 'r.rr.r', 'r.rr.r', '.r..r.', '..rr..']
def g_tome(a, dy=0):   # 금서 해독: 검은 살가죽 표지 · 피의 고리
    closed_tome(a, dy, '#4a2a2a', '#2e1818', '#1a0c0c', '#c8c0a8', '#7a7262', ring=RING_BLOOD, rz='#e83a3a', rw='#ff9a8a', ribbon='#8a1a1a', rx='#e83a3a')
MAST63 = [
  ('whip', '채찍술', 'sky', g_whip), ('wagon', '마차 몰기', 'earth', g_wagon), ('machete', '정글칼술', 'green', g_machete), ('cards', '카드술', 'royal', g_cards),
  ('lockpick', '따개 솜씨', 'purple', g_lockpick), ('shuriken', '암기술', 'shadow', g_shuri), ('twin', '쌍수술', 'dark', g_twin), ('gladius', '글라디우스술', 'blood', g_gladius),
  ('great', '대검술', 'ember', g_great), ('ether', '마력 방패술', 'arcane', g_ether), ('xbow', '석궁술', 'steelb', g_xbow), ('wand', '완드술', 'wind', g_wand),
  ('orb', '구슬술', 'thunder', g_orb), ('tome', '금서 해독', 'evil', g_tome), ('ride', '기승술', 'teal', g_ride)]
# 달인(4차, 제안): 틀 백금 · 점 셋 금빛 흰색 · 점 위 작은 별
FRAME4 = ('#f4f8ff', '#a8b8d8', '#5a6a8a')
def art63(k, lit):
    theme, g = {m[0]: (m[2], m[3]) for m in MAST63}[k]
    a = A(theme, cy=8.0, rays=12, k=0.3, hole=4)
    g(a, -1)
    if lit == 4: l, d = '#fffbe8', '#d8c070'
    else: l, d = TIER[lit - 1] if lit else ('#3a3440', '#241e28')
    for i in range(3):
        x = 4 + i * 3
        for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)):
            a.set(x + dx, 16 + dy, (l if (dx, dy) == (0, 0) else d) if i < max(lit, 0) or lit == 4 else ('#3a3440' if (dx, dy) == (0, 0) else '#241e28'))
    if lit == 4: a.set(7, 15, '#ffffff'); a.set(8, 15, '#fff0a0')
    return a
def img63(k, lit):
    art = art63(k, lit)
    if not lit: return art.img('buff')
    im = art.img('buff'); px = im.load(); hb = b4.hexbase('buff').load()
    fr = FRAME4 if lit == 4 else FRAME[lit - 1]
    m = {b4.rgb(FRAME0[i]): b4.rgb(fr[i]) for i in range(3)}
    for y in range(48):
        for x in range(48):
            c = hb[x, y]
            if c[3] and c[:3] in m: px[x, y] = m[c[:3]] + (255,)
    return im
if __name__ == '__main__':
    from PIL import Image, ImageDraw, ImageFont
    f = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 13, index=2)
    fb = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', 15, index=2)
    Z = 2; CW = 48 * Z + 8; LW = 104; COLS = 2
    per = (len(MAST63) + COLS - 1) // COLS; RH = 48 * Z + 10
    sh = Image.new('RGB', (COLS * (LW + 5 * CW + 20) + 10, 56 + per * RH), (21, 23, 28)); d = ImageDraw.Draw(sh)
    d.text((10, 8), '새 숙련 15개 — B안(아래 점 셋 + 틀 색). 칸: 안 배움 · 초급(동) · 중급(은) · 상급(금) · 달인(백금, 4차 제안)', font=fb, fill=(240, 196, 90))
    for c in range(COLS):
        for t, tt in enumerate(['안 배움', '초급', '중급', '상급', '달인']): d.text((10 + c * (LW + 5 * CW + 20) + LW + t * CW + 24, 32), tt, font=f, fill=(170, 165, 155))
    for i, (k, name, theme, g) in enumerate(MAST63):
        c, r = i // per, i % per; x0 = 10 + c * (LW + 5 * CW + 20); y0 = 52 + r * RH
        d.text((x0, y0 + 40), name, font=fb, fill=(232, 228, 220))
        for t in range(5):
            im = cell.zoom(img63(k, t), Z); sh.paste(im, (x0 + LW + t * CW, y0), im)
    out = pathlib.Path(__file__).parent / 'm_v63.png'; sh.save(out); print(out.name, sh.size)
