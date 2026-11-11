"""룬 더하기 시안판 (빌드 64): ① 지금 룬 17종 + 최상급 ② 새 효과 룬 19종 × 하급 ~ 최상급
python3 sheet_ext.py [출력 폴더]  (기본: 이 폴더) → runes_top_drafts.png · runes_new_drafts.png"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import runes as R
import runes_ext as X
FD = os.environ.get('FONT_DIR', '/tmp/claude-0/-home-claude/4368c869-ae47-5efb-8102-510605121dd4/scratchpad/design/')
f11 = ImageFont.truetype(FD + 'Galmuri11.ttf', 11); f12 = ImageFont.truetype(FD + 'Galmuri11.ttf', 12)
b14 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 14); b18 = ImageFont.truetype(FD + 'Galmuri11-Bold.ttf', 18)
BG = (19, 22, 30); CELL = (30, 36, 52); INK = (236, 228, 208); INK2 = (169, 176, 189); GOLD = (240, 180, 60)
GCOL = [INK2, (122, 214, 106), (106, 176, 255), (240, 180, 60)]
GNAME = ['하급', '중급', '상급', '최상급']
# 지금 룬: 효과 이름 · 단위 (게임 RUNES 값)
OLD = {'str': ('힘', [2, 5, 10], ''), 'vit': ('체력', [2, 5, 10], ''), 'agi': ('민첩', [2, 5, 10], ''), 'int': ('지능', [2, 5, 10], ''),
       'atk': ('공격', [4, 10, 20], ''), 'matk': ('마법', [4, 10, 20], ''), 'def': ('방어', [3, 8, 16], ''), 'hp': ('HP', [20, 50, 100], ''),
       'crit': ('치명', [1, 2, 4], 'pp'), 'eva': ('회피', [1, 2, 4], 'pp'), 'haste': ('공격 속도', [3, 6, 10], '%'), 'time': ('재사용 대기', [2, 4, 7], '-%'),
       'barrier': ('마법 저항', [2, 4, 7], '%'), 'fireres': ('불·화염 저항', [4, 8, 14], '%'), 'coldres': ('물·빙결 저항', [4, 8, 14], '%'),
       'boltres': ('번개 저항', [4, 8, 14], '%'), 'darkres': ('어둠·악 저항', [4, 8, 14], '%')}


def fmt(v, u):
    if u == '': return f'+{v:g}'
    if u == 'pp': return f'+{v:g}%p'
    if u == '-%': return f'-{v:g}%'
    if u == '/s': return f'{v:g}%/초'
    return f'+{v:g}%'


def wrap(t, font, w):
    out, cur = [], ''
    for word in t.split(' '):
        nx = (cur + ' ' + word).strip()
        if font.getlength(nx) > w and cur: out.append(cur); cur = word
        else: cur = nx
    if cur: out.append(cur)
    return out


def img(px, s):
    im = Image.new('RGBA', (20 * s, 20 * s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x, y), c in px.items(): d.rectangle([x * s, y * s, x * s + s - 1, y * s + s - 1], fill=tuple(c) + (255,))
    return im


def sheet(title, notes, entries, out, groups=None):
    S = 4; IW = 20 * S; CW = IW + 8; BW = 4 * CW + 22; COLS = 2
    ROWS = (len(entries) + COLS - 1) // COLS; BH = 22 + IW + 26
    W = 24 + COLS * BW
    lines = [(ln, t.startswith('·')) for t in notes for ln in wrap(t, f12, W - 48)]
    TOP = 44 + 18 * len(lines) + 14; H = TOP + ROWS * BH + 140
    im = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(im)
    d.text((24, 14), title, font=b18, fill=GOLD)
    for i, (t, hl) in enumerate(lines): d.text((24, 44 + i * 18), t, font=f12, fill=INK if hl else INK2)
    for i, (k, nm, col, fx, vals, unit, tag) in enumerate(entries):
        bx = 24 + (i % COLS) * BW; by = TOP + (i // COLS) * BH
        c = R.hx(col)
        d.text((bx, by), f'{nm}의 룬', font=b14, fill=c)
        x0 = bx + b14.getlength(f'{nm}의 룬') + 8
        d.text((x0, by + 2), fx, font=f12, fill=INK2)
        if tag: d.text((x0 + f12.getlength(fx) + 8, by + 2), tag, font=f11, fill=(240, 150, 110))
        for lv in range(4):
            x = bx + lv * CW; y = by + 20
            d.rectangle([x, y, x + IW - 1, y + IW - 1], fill=CELL)
            im.alpha_composite(img(X.make(k, col, lv), S), (x, y))
            d.text((x + 1, y + IW + 4), GNAME[lv], font=f11, fill=GCOL[lv])
            d.text((x + 1 + f11.getlength(GNAME[lv]) + 5, y + IW + 4), fmt(vals[lv], unit), font=f11, fill=INK)
    y = TOP + ROWS * BH + 4
    d.text((24, y), '창고 칸에 놓으면 (실제 크기 · 최상급)', font=b14, fill=INK); y += 22
    x = 24
    for (k, nm, col, *_ ) in entries:
        d.rectangle([x, y, x + 45, y + 45], fill=(70, 50, 26), outline=(220, 160, 50), width=2)
        im.alpha_composite(img(X.make(k, col, 3), 1).resize((40, 40), Image.NEAREST), (x + 3, y + 3)); x += 50
        if x > W - 60: x = 24; y += 52
    im = im.crop((0, 0, W, y + 60)); im.save(out); print(out, im.size)


outdir = sys.argv[1] if len(sys.argv) > 1 else HERE
olds = [(k, nm, col, OLD[k][0], OLD[k][1] + [X.TOP_VAL[k] * (100 if OLD[k][2] else 1)], OLD[k][2], '') for k, nm, col in R.RUNES]
sheet('지금 룬 17종 + 최상급 (시안 — 게임에는 아직 안 넣음)',
      ['하급 · 중급 · 상급은 지금 게임 그림 · 값 그대로이고, 오른쪽 끝이 새 최상급이에요.',
       '최상급 그림: 깊은 룬 색 수정 · 백금 테(안쪽 어두운 룬 색 줄) · 흰빛 문양과 두 겹 빛 · 테 바깥 은은한 룬 색 빛 · 반짝이 셋.',
       '최상급 값(제안): 상급의 1.7~1.8배. 얻는 법(제안): 상급 3개 → 최상급(마탑 · 10,000G), 드랍은 아주 드물게(드랍 개편 때).'],
      olds, os.path.join(outdir, 'runes_top_drafts.png'))
EXAMPLE = {'iceatk', 'darkatk', 'heal', 'grace', 'regen', 'mana', 'spring', 'acc', 'flash', 'block', 'move'}
news = [(k, nm, col, fx, vals, unit, '' if k in EXAMPLE else '제안') for (k, nm, col, fx, vals, unit) in X.NEW_RUNES]
sheet('새 효과 룬 19종 × 하급 · 중급 · 상급 · 최상급 (시안 — 게임에는 아직 안 넣음)',
      ['말씀하신 예시(세계수의 씨앗 · 만년빙 · 원천물 예시)에 나온 효과 가운데 지금 룬에 없는 것 11종 —',
       '· 혹한(냉기 공격) · 암흑(암흑 공격) · 치유(주는 회복) · 가호(받는 회복) · 재생(생명력 재생) · 마나(마나) · 샘(마나 회복) · 명중 · 섬광(눈멂) · 방벽(기본 공격 방어 확률) · 질주(이동 속도)',
       '「제안」 8종은 속성마다 공격 · 저항 짝을 맞춘 것 — 작열 · 폭풍 · 지진 · 뇌격 · 성광(공격) · 내풍 · 내진 · 차광(저항). 강철은 쓰는 스킬이 거의 없어 뺐어요.',
       '그림 결은 지금 룬과 같아요: 룬마다 다른 돌 모양 + 문양, 하급 거친 돌 → 중급 매끈한 돌 · 은 테 → 상급 수정 · 금 테 → 최상급 백금 테 · 빛.'],
      news, os.path.join(outdir, 'runes_new_drafts.png'))
