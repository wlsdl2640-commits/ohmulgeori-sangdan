"""메뉴판 시안 (빌드 63, 11-11 사용자: 「2D 뭉툭 디자인으로」)
지금 판: 얇은 테(1.5배 칸) · 작은 아이콘 → 굵은 도트(한 칸 = 3px) 나무 판 · 두꺼운 테 · 쇠 모서리 · 큰 아이콘(9칸 × 4 = 36px).
A안 나무 명패 / B안 양피지 쪽지 + 압정. 같은 배치(칸 일곱 + 바로 가기 다섯). 게임에는 아직 넣지 않는다."""
from PIL import Image, ImageDraw, ImageFont
FD = '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/'
FB = lambda s: ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', s)
FR = lambda s: ImageFont.truetype(FD + 'Galmuri11.ttf', s)
K = (20, 14, 10)
UI_PX = {
  'house':  ['....k....', '...kyk...', '..kyyyk..', '.kyyyyyk.', 'kkkkkkkkk', '.kwwwwwk.', '.kwkkwwk.', '.kwkkwwk.', '.kkkkkkk.'],
  'anvil':  ['.........', 'kkkkkkkk.', 'kwwwwwwwk', '.kwwwwwk.', '..kkwkk..', '...kwk...', '..kwwwk..', '.kwwwwwk.', '.kkkkkkk.'],
  'person': ['...kkk...', '..kssk...', '..kssk...', '...kk....', '..kttk...', '.kttttk..', 'ktttttk..', '.kt.tk...', '.kk.kk...'],
  'sword':  ['.......kk', '......klk', '.....klk.', '....klk..', '.k.klk...', '..kkk....', '..kdk....', '.kdkk....', 'kk.......'],
  'box':    ['.kkkkkkk.', 'kbbbbbbbk', 'kbkkkkkbk', 'kbbbbbbbk', 'kbbkkbbbk', 'kbbbbbbbk', 'kbkkkkkbk', 'kbbbbbbbk', '.kkkkkkk.'],
  'scroll': ['.kkkkkk..', 'kppppppk.', 'kpkkkkpk.', 'kppppppk.', '.kpkkkpk.', '.kppppppk', '.kpkkkkpk', '.kppppppk', '..kkkkkk.'],
  'map':    ['kkkkkkkkk', 'kpppfpppk', 'kppffpppk', 'kpffppppk', 'kpfpppypk', 'kppppyypk', 'kpppyyppk', 'kppppyppk', 'kkkkkkkkk'],
  'menu':   ['.kkkkkkk.', 'kyyyyyyyk', 'kdddddddk', 'kpppppppk', 'kpkkkkppk', 'kpppppppk', 'kpkkkkkpk', 'kpppppppk', '.kkkkkkk.'],
}
UI_PAL = {'k': '#0b0d12', 'y': '#f0b43c', 'l': '#fff2c0', 'd': '#9a6a1c', 'f': '#5fd4c0', 'w': '#c9c3b8', 's': '#f1c9a5', 't': '#4a7ac8', 'b': '#9a6a3c', 'p': '#e8dcb8'}


def hx(s): s = s.lstrip('#'); return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


TILES = [('house', '상단', '랭크 · 정산'), ('anvil', '시설', '짓기 · 대장간'), ('person', '모험가', '전직 · 스킬'), ('map', '지도', '필드 · 왕국'),
         ('sword', '원정대', '파티 · 출발'), ('box', '창고', '창고 1~10'), ('scroll', '의뢰', '의뢰 게시판')]
CHIPS = ['월말 정산', '도감', '업적', '소식', '설정']


class Art:
    """한 칸 = P px 굵은 도트 그리기"""
    def __init__(self, im, P):
        self.im = im; self.d = ImageDraw.Draw(im); self.P = P

    def px(self, x, y, c, ox=0, oy=0):
        P = self.P; self.d.rectangle([ox + x * P, oy + y * P, ox + x * P + P - 1, oy + y * P + P - 1], fill=c)

    def rect(self, x0, y0, x1, y1, c, ox=0, oy=0):
        P = self.P; self.d.rectangle([ox + x0 * P, oy + y0 * P, ox + (x1 + 1) * P - 1, oy + (y1 + 1) * P - 1], fill=c)


def icon(name, s):
    """9칸 아이콘을 s배로 + 왼쪽 위 가장자리 빛 한 칸 (뭉툭 손질)"""
    pat = UI_PX[name]; im = Image.new('RGBA', (9 * s, 9 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for y, row in enumerate(pat):
        for x, ch in enumerate(row):
            if ch == '.': continue
            c = hx(UI_PAL[ch])
            if ch != 'k':
                up = pat[y - 1][x] if y > 0 else '.'; lf = row[x - 1] if x > 0 else '.'
                dn = pat[y + 1][x] if y < 8 else '.'; rt = row[x + 1] if x < 8 else '.'
                if up in 'k.' or lf in 'k.': c = mix(c, (255, 255, 255), .32)
                elif dn in 'k.' or rt in 'k.': c = mix(c, (0, 0, 0), .28)
            d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=c)
    return im


# 색
FW = dict(l=(184, 122, 68), m=(142, 88, 46), d=(98, 60, 30), e=(64, 38, 20))           # 테 나무
PL = dict(l=(112, 74, 44), m=(92, 58, 34), d=(70, 44, 26), s=(44, 28, 16))             # 판 안 널빤지
PQ = dict(l=(240, 208, 152), m=(218, 176, 116), d=(170, 126, 74), g=(196, 152, 96))    # 밝은 명패 나무
IR = dict(l=(150, 150, 162), m=(92, 92, 102), d=(50, 50, 58), h=(210, 210, 220))       # 쇠
RB = dict(l=(238, 100, 82), m=(196, 52, 44), d=(126, 28, 24))                          # 붉은 리본
PA = dict(l=(248, 236, 204), m=(232, 214, 170), d=(196, 168, 118), e=(150, 120, 76))   # 양피지
PN = dict(l=(255, 150, 140), m=(214, 48, 48), d=(122, 20, 20))                          # 압정


def board(opt, P=3):
    BWpx, BHpx = 330, 384
    w, h = BWpx // P, BHpx // P      # 110 × 128 칸
    im = Image.new('RGBA', (w * P, h * P), (0, 0, 0, 0)); A = Art(im, P)
    # 바깥 테 (두께 4칸, 경사)
    A.rect(0, 0, w - 1, h - 1, K)
    for k in range(1, 5):
        c_tl = [None, FW['l'], FW['l'], FW['m'], FW['d']][k]; c_br = [None, FW['d'], FW['e'], FW['m'], FW['d']][k]
        A.rect(k, k, w - 1 - k, k, c_tl); A.rect(k, k, k, h - 1 - k, c_tl)
        A.rect(k, h - 1 - k, w - 1 - k, h - 1 - k, c_br); A.rect(w - 1 - k, k, w - 1 - k, h - 1 - k, c_br)
    for i in range(6, w - 6, 9): A.px(i, 2, FW['d']); A.px(i + 1, h - 3, FW['l'])      # 나뭇결 점
    for i in range(7, h - 6, 11): A.px(2, i, FW['d']); A.px(w - 3, i + 2, FW['l'])
    # 안쪽 널빤지 (세로 판 8칸씩, 이음매 · 결)
    A.rect(5, 5, w - 6, h - 6, K)
    for x in range(6, w - 6):
        col = (x - 6) % 9
        c = PL['s'] if col == 8 else (PL['l'] if col == 0 else PL['m'])
        for y in range(6, h - 6): A.px(x, y, c)
    for x0 in range(6, w - 6, 9):
        for y in range(9 + (x0 * 7) % 13, h - 8, 17):
            A.px(x0 + 3, y, PL['d']); A.px(x0 + 3, y + 1, PL['d']); A.px(x0 + 4, y + 2, PL['d'])
    A.rect(6, 6, w - 7, 6, PL['s'])     # 안쪽 위 그늘
    # 쇠 모서리 (L자 · 리벳)
    for (sx, sy, dx, dy) in ((1, 1, 1, 1), (w - 2, 1, -1, 1), (1, h - 2, 1, -1), (w - 2, h - 2, -1, -1)):
        for i in range(9):
            for t in range(3):
                c = IR['l'] if t == 0 else (IR['m'] if t == 1 else IR['d'])
                A.px(sx + dx * i, sy + dy * t, c); A.px(sx + dx * t, sy + dy * i, c)
        for (rx, ry) in ((sx + dx * 6, sy + dy * 1), (sx + dx * 1, sy + dy * 6)):
            A.px(rx, ry, IR['h'])
    # 제목 리본
    tw = 50; tx = (w - tw) // 2; ty = 8
    if opt == 'A':
        A.rect(tx - 5, ty + 2, tx - 1, ty + 9, RB['d']); A.rect(tx + tw, ty + 2, tx + tw + 4, ty + 9, RB['d'])     # 접힌 끝
        for (x, y) in ((tx - 5, ty + 2), (tx - 5, ty + 9), (tx + tw + 4, ty + 2), (tx + tw + 4, ty + 9)): A.px(x, y, K)
        A.px(tx - 4, ty + 5, K); A.px(tx - 5, ty + 5, (0, 0, 0, 0)); A.px(tx + tw + 3, ty + 5, K)
        A.rect(tx - 1, ty, tx + tw, ty + 8, K); A.rect(tx, ty + 1, tx + tw - 1, ty + 7, RB['m'])
        A.rect(tx, ty + 1, tx + tw - 1, ty + 1, RB['l']); A.rect(tx, ty + 7, tx + tw - 1, ty + 7, RB['d'])
    else:   # 줄에 매단 나무 간판
        for (x0) in (tx + 6, tx + tw - 7):
            for y in range(4, ty + 1): A.px(x0, y, (200, 176, 120) if y % 2 else (150, 126, 80))
        A.rect(tx - 1, ty, tx + tw, ty + 9, K); A.rect(tx, ty + 1, tx + tw - 1, ty + 8, PQ['m'])
        A.rect(tx, ty + 1, tx + tw - 1, ty + 1, PQ['l']); A.rect(tx, ty + 8, tx + tw - 1, ty + 8, PQ['d'])
        A.px(tx + 6, ty + 2, IR['h']); A.px(tx + tw - 7, ty + 2, IR['h'])
    d = ImageDraw.Draw(im)
    ttl = '메뉴판'; f = FB(15)
    tcx = (tx + tw / 2) * P; tcy = (ty + 4.5) * P
    tc = (255, 240, 210) if opt == 'A' else (70, 40, 18)
    sc = (80, 16, 12) if opt == 'A' else (240, 214, 160)
    wtxt = f.getlength(ttl); d.text((tcx - wtxt / 2 + 1, tcy - 9 + 1), ttl, font=f, fill=sc); d.text((tcx - wtxt / 2, tcy - 9), ttl, font=f, fill=tc)
    # 칸
    gx0, gy0 = 8, 21; cw, ch, gap = 45, 19, 2
    for i, (ic, nm, sub) in enumerate(TILES):
        r, c = divmod(i, 2)
        x0 = gx0 + c * (cw + gap); y0 = gy0 + r * (ch + gap)
        ww = cw if i < 6 else 2 * cw + gap
        tile(A, opt, x0, y0, ww, ch)
        IC = icon(ic, 4); im.alpha_composite(IC, ((x0 + 3) * P, (y0 + (ch - 12) // 2 + 1) * P))
        d.text(((x0 + 17) * P, (y0 + 4) * P), nm, font=FB(15), fill=(58, 34, 14))
        d.text(((x0 + 17) * P, (y0 + 11) * P), sub, font=FR(11), fill=(110, 76, 40))
        if nm == '의뢰':
            bx, by = x0 + ww - 7, y0 - 1
            A.rect(bx, by, bx + 6, by + 5, K); A.rect(bx + 1, by + 1, bx + 5, by + 4, PN['m']); A.rect(bx + 1, by + 1, bx + 5, by + 1, PN['l'])
            d.text(((bx + 2.3) * P, (by + 0.6) * P), '1', font=FB(12), fill=(255, 255, 255))
    # 바로 가기 (나무 패)
    cy = gy0 + 4 * (ch + gap) + 3
    A.rect(8, cy - 2, w - 9, cy - 2, PL['s'])
    x = 9
    for nm in CHIPS:
        tw2 = int(FR(12).getlength(nm) / P) + 6
        A.rect(x, cy, x + tw2, cy + 8, K); A.rect(x + 1, cy + 1, x + tw2 - 1, cy + 7, (58, 36, 22))
        A.rect(x + 1, cy + 1, x + tw2 - 1, cy + 1, (122, 84, 52)); A.rect(x + 1, cy + 1, x + 1, cy + 7, (122, 84, 52))
        A.rect(x + 1, cy + 7, x + tw2 - 1, cy + 7, (30, 18, 10))
        d.text(((x + 3.2) * P, (cy + 1.6) * P), nm, font=FR(12), fill=(246, 222, 168))
        x += tw2 + 2
    return im


def tile(A, opt, x0, y0, w, h):
    if opt == 'A':   # 나무 명패: 굵은 테 · 경사 · 결 · 못 둘
        A.rect(x0, y0, x0 + w - 1, y0 + h - 1, K)
        A.rect(x0 + 1, y0 + 1, x0 + w - 2, y0 + h - 2, PQ['m'])
        A.rect(x0 + 1, y0 + 1, x0 + w - 2, y0 + 1, PQ['l']); A.rect(x0 + 1, y0 + 1, x0 + 1, y0 + h - 2, PQ['l'])
        A.rect(x0 + 1, y0 + h - 2, x0 + w - 2, y0 + h - 2, PQ['d']); A.rect(x0 + w - 2, y0 + 1, x0 + w - 2, y0 + h - 2, PQ['d'])
        for k in range(3):
            yy = y0 + 4 + k * 5
            for xx in range(x0 + 15 + (k * 7) % 11, x0 + w - 4, 13): A.px(xx, yy, PQ['g']); A.px(xx + 1, yy, PQ['g'])
        for (nx, ny) in ((x0 + 2, y0 + 2), (x0 + w - 4, y0 + 2)):
            A.rect(nx, ny, nx + 1, ny + 1, IR['m']); A.px(nx, ny, IR['h'])
        A.rect(x0 + 1, y0 + h, x0 + w, y0 + h, (30, 18, 10))     # 아래 그림자
    else:   # 양피지 쪽지: 계단 모서리 · 접힌 귀 · 압정
        A.rect(x0 + 1, y0 + h, x0 + w, y0 + h, (30, 18, 10))
        for y in range(y0, y0 + h):
            cut = 2 if y in (y0, y0 + h - 1) else (1 if y in (y0 + 1, y0 + h - 2) else 0)
            A.rect(x0 + cut, y, x0 + w - 1 - cut, y, K)
        for y in range(y0 + 1, y0 + h - 1):
            cut = 2 if y in (y0 + 1, y0 + h - 2) else (1 if y in (y0 + 2, y0 + h - 3) else 0)
            A.rect(x0 + 1 + cut, y, x0 + w - 2 - cut, y, PA['m'])
        A.rect(x0 + 3, y0 + 1, x0 + w - 4, y0 + 1, PA['l']); A.rect(x0 + 1, y0 + 3, x0 + 1, y0 + h - 4, PA['l'])
        A.rect(x0 + 3, y0 + h - 2, x0 + w - 4, y0 + h - 2, PA['d']); A.rect(x0 + w - 2, y0 + 3, x0 + w - 2, y0 + h - 4, PA['d'])
        for k in range(2):     # 얼룩
            A.px(x0 + w - 9 - k * 11, y0 + h - 5 + k, PA['d'])
        # 오른쪽 아래 접힌 귀
        fx, fy = x0 + w - 5, y0 + h - 5
        for i in range(4):
            for j in range(4 - i): A.px(fx + i + j, fy + 3 - j, PA['d'] if i + j < 3 else PA['e'])
        # 압정
        px_, py_ = x0 + w // 2 - 1, y0 - 1
        A.rect(px_ - 1, py_, px_ + 2, py_ + 3, K); A.rect(px_, py_ + 1, px_ + 1, py_ + 2, PN['m']); A.px(px_, py_ + 1, PN['l'])


if __name__ == '__main__':
    import sys
    cur = Image.open(sys.argv[1]).convert('RGBA').crop((76, 112, 410, 440)) if len(sys.argv) > 1 else None
    a = board('A'); b = board('B')
    W = 24 + (cur.width + 24 if cur else 0) + a.width + 24 + b.width + 24
    im = Image.new('RGBA', (W, 90 + a.height + 40 + 3 * 190), (19, 22, 30, 255)); d = ImageDraw.Draw(im)
    d.text((24, 14), '메뉴판 시안 — 2D 뭉툭 (한 칸 = 3px 굵은 도트, 게임에는 아직 안 넣음)', font=FB(18), fill=(240, 180, 60))
    d.text((24, 40), '두꺼운 나무 테(4칸 경사) · 쇠 모서리와 리벳 · 세로 널빤지 · 큰 아이콘(36px, 가장자리 빛). 배치는 지금과 같다.', font=FR(12), fill=(169, 176, 189))
    x = 24
    for lab, src in (('지금', cur), ('A안 · 나무 명패', a), ('B안 · 양피지 쪽지 + 압정', b)):
        if src is None: continue
        d.text((x, 64), lab, font=FB(14), fill=(236, 228, 208)); im.alpha_composite(src, (x, 88)); x += src.width + 24
    y = 88 + a.height + 24
    d.text((24, y), '가까이 (2배)', font=FB(14), fill=(236, 228, 208)); y += 22
    for i, src in enumerate((a, b)):
        z = src.crop((0, 0, 330, 160)).resize((660, 320), Image.NEAREST)
        im.alpha_composite(z, (24 + i * 690, y))
    im = im.crop((0, 0, W, y + 330)); im.save('menu_drafts.png'); print(im.size)
