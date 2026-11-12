"""방어구 시안 그림판 2 (빌드 64, 사용자 11-12 08:57 「우리 스타일로 디자인 해봐」 + 09:06 추가 자료 — 참고: 사용자가 ChatGPT와 만든 갑옷 · 로브 · 후드 · 망토 그림, 저장소에 안 넣음).
우리 장비 그림 결: 20×20 · 1칸 = 1픽셀 · 검은 테(#1a1414, wic.Ico — 무기 · 방패와 같다) · 왼쪽 위 빛 · 좌우 대칭.
왼쪽 반(10칸)을 손으로 명암까지 칠하고 비춘다. 오른쪽 반은 빛 색을 한 칸 어둡게(RMAP) + 바깥 가장자리를 그늘로(RIM).
글자 = 팔레트 칸: 쇠 1 a b c (반짝 · 빛 · 가운데 · 그늘) · 둘째 쇠 A B C · 금 테 g h i · 천 d e f · 안감 p q r · 털 m n o · 어둠 k l · 보석 v w x · 무늬 s t u
십자 모양 문장은 쓰지 않는다(사용자 규칙) — 참고 그림의 십자는 해 · 초승달 · 왕관 · 날개 · 불꽃 · 잎 · 별로 바꾼다."""
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'warricon64', 'icon'))
from wic import Ico, hexc, tohex, mix   # noqa: E402
N = 20
FAMLET = {'M': '1abc', 'A': 'ABC', 'T': 'ghi', 'S': 'def', 'L': 'pqr', 'F': 'mno', 'K': 'kl', 'J': 'vwx', 'X': 'stu'}
FAM = {ch: f for f, s in FAMLET.items() for ch in s}
# 오른쪽 반: 빛 → 한 칸 어둡게 (보석 · 무늬 · 어둠은 그대로 — 보석은 덧그림에서 따로 칠한다)
RMAP = {}
for f, s in FAMLET.items():
    if f in 'KJX': continue
    for i, ch in enumerate(s[:-1]):
        if i < len(s) - 2: RMAP[ch] = s[i + 1]
RIMF = set('MASLFT')   # 오른쪽 바깥 가장자리를 그늘로 칠하는 부위


def dark_of(ch):
    f = FAM.get(ch)
    return FAMLET[f][-1] if f else ch


def mirror(half, rim=True):
    """왼쪽 반 10칸 → {(x, y): 글자} (20칸)"""
    body = {}
    for y, r in enumerate(half):
        r = r.ljust(10, '.')[:10]
        for x, ch in enumerate(r):
            if ch in '. ': continue
            body[(x, y)] = ch
            body[(19 - x, y)] = RMAP.get(ch, ch)
    if rim:
        for (x, y), ch in list(body.items()):
            if x >= 10 and (x + 1, y) not in body and FAM.get(ch) in RIMF: body[(x, y)] = dark_of(ch)
    return body


def ramp3(base, hi=0.4, lo=0.4):
    return (mix(base, '#ffffff', hi), tohex(hexc(base)), mix(base, '#000000', lo))


def ramp4(base, sp=0.75, hi=0.38, lo=0.42):
    return (mix(base, '#ffffff', sp), mix(base, '#ffffff', hi), tohex(hexc(base)), mix(base, '#000000', lo))


def pal(**kw):
    """부위=(색들) → Ico 팔레트 {글자: 색}. 덜 준 부위는 비슷한 부위 색을 빌린다."""
    p = {}
    for f, cols in kw.items():
        if f in FAMLET:
            for ch, col in zip(FAMLET[f], cols): p[ch] = col
        else: p[f] = cols
    return p


def put(body, pts, ch=None):
    """덧그림: {(x, y): 글자} 또는 [(x, y, 글자)] — '_' 는 지움"""
    items = pts.items() if isinstance(pts, dict) else [((x, y), c) for x, y, c in pts]
    for (x, y), c in items:
        if c == '_': body.pop((x, y), None)
        else: body[(x, y)] = c


def grid(rows, ox=0, oy=0):
    """손그림 조각 → {(x, y): 글자} ('.' 건너뜀)"""
    out = {}
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch in '. ': continue
            out[(ox + i, oy + j)] = ch
    return out


def render(body, pals, glow=None):
    ic = Ico(pals); ic.body = dict(body)
    if glow: ic.glow = glow
    return ic.render()
