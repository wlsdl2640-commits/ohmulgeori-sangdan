"""활 16자루 넷 — 단궁 · 복합궁 · 장궁 · 대궁 (11-10 23:59 사용자 「이 시안들로 무기 더 만들어 ㄱㄱ」). bowf.py 원형 넷을 네 레벨 묶음마다 한 번씩.
단궁 = 궁수 · 정찰가 · 탐험가(1차부터, Lv1 · 10 … 150) · 복합궁 = 레인저 · 장궁 = 저격수 · 신궁 · 대궁 = 사냥꾼 · 괴수사냥꾼(2차부터 → Lv50 · 60 … 200).
자루마다 고유한 이름 · 모습: 나무 · 뿔 · 뼈 · 쇠 색 · 손잡이 · 끝 · 고리 · 깃 · 빛(효과 칸)."""
from bow import B_of, ring, spike, KIND
import bowf
def base(kind, key):
    d = next(f for f in bowf.FR if f['kind'] == kind and f['key'] == key)
    s, pal = d['fn']()
    return s, dict(pal)
def V(kind, key, pal=None, rings=None, rch=('h', 'G'), fx=(), deco=(), spikes=None):
    s, p = base(kind, key)
    if pal: p.update(pal)
    B = B_of(kind, **({'L': 12.0} if (kind == 'great' and key == 'D') else {}))
    if rings: ring(s, B, rings, rch)
    if spikes: spike(s, B, spikes, 'T')
    for (x, y, ch) in deco: s.put(x, y, 'grip', ch)
    s.fx = dict(s.fx)
    for (x, y, ch) in fx:
        if (x, y) not in s.part: s.fx[(x, y)] = ch
    return s, p
G = {'short': [], 'comp': [], 'long': [], 'great': []}
def make(kind, lv, st, name, desc):
    def deco(fn): G[kind].append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
F = lambda **k: {str(a): b for a, b in k.items()}
SP = lambda *c: {'1': c[0], '2': c[1] if len(c) > 1 else c[0]}
# ════ 단궁 (Lv1 ~ 150) ════
@make('short', 1, 'A', '견습 단궁', '나무 한 토막 활 · 가죽 손잡이 — 궁수가 처음 잡는 활')
def s01(): return V('short', 'A')
@make('short', 10, 'B', '뿔끝 사냥 단궁', '끝에 검은 뿔 덮개 · 붉은 끈 손잡이')
def s10(): return V('short', 'B')
@make('short', 20, 'C', '자작나무 단궁', '흰 자작나무 · 팔 가운데가 넓고 납작하다')
def s20(): return V('short', 'C')
@make('short', 30, 'D', '참새깃 단궁', '손잡이에 갈색 참새 깃 장식')
def s30(): return V('short', 'D', dict(e='#a8743e', E='#e8dcc0'))
@make('short', 40, 'C', '버드나무 단궁', '푸른빛 도는 버드나무 · 납작한 팔 · 풀빛 손잡이')
def s40(): return V('short', 'C', dict(a='#d8e8b0', b='#a8c080', c='#6a8a4a', k='#4a6a3a', K='#2a4022'))
@make('short', 50, 'A', '물푸레 단궁', '희고 단단한 물푸레나무 · 검은 가죽 손잡이')
def s50(): return V('short', 'A', dict(a='#f0e0c0', b='#d0b890', c='#9a8060', k='#2a2420', K='#141210'))
@make('short', 60, 'D', '매깃 단궁', '손잡이에 잿빛 매 깃 · 짙은 나무')
def s60(): return V('short', 'D', dict(a='#b8865a', b='#7a5432', c='#4a301a', e='#a8a8b0', E='#f0f0f4'))
@make('short', 70, 'B', '산양뿔 단궁', '끝에 흰 산양 뿔 · 검은 끈 손잡이')
def s70(): return V('short', 'B', dict(k='#2a2a30', K='#141418', t='#f0e8d8', T='#b8ac94'))
@make('short', 80, 'B', '서리뿔 단궁', '얼음빛 뿔 끝 · 흰 나무 · 남빛 손잡이 — 끝에 서리가 앉는다')
def s80(): return V('short', 'B', dict(a='#f0f8ff', b='#c8dcec', c='#7a9ab8', k='#2a4a7a', K='#162a4a', t='#bdeeff', T='#5aa8d8', **SP('#ffffff', '#bdeeff')),
                    fx=[(17, 1, '1'), (1, 17, '2'), (15, 0, '2')])
@make('short', 90, 'D', '불새깃 단궁', '붉은 칠 · 손잡이에 불새 깃(붉은 · 주황) — 불씨가 날린다')
def s90(): return V('short', 'D', dict(a='#e8704a', b='#a8301e', c='#5a140c', k='#3a1a10', K='#1e0c08', e='#ff8a2a', E='#ffd84a', s='#ffe0c0', **SP('#ffd84a', '#ff6a1a')),
                    fx=[(10, 8, '1'), (7, 6, '2'), (12, 11, '2')])
@make('short', 100, 'A', '흑단 단궁', '검은 흑단 · 은 손잡이 · 은빛 시위')
def s100(): return V('short', 'A', dict(a='#5a5060', b='#2e2830', c='#16121a', k='#e8eef6', K='#8a94a8', s='#e8eef6'))
@make('short', 110, 'C', '사막 야자 단궁', '모래빛 야자 · 납작한 팔 · 청록 끈 손잡이')
def s110(): return V('short', 'C', dict(a='#f8e0a0', b='#e0b868', c='#a87a38', k='#2a9a9a', K='#146a6a'))
@make('short', 120, 'A', '은빛 달 단궁', '달빛처럼 흰 나무 · 남빛 손잡이 — 끝에 달빛이 맺힌다')
def s120(): return V('short', 'A', dict(a='#ffffff', b='#d8e0f0', c='#8a98c0', k='#2a3a7a', K='#16204a', s='#e8f0ff', **SP('#ffffff', '#c8d8ff')),
                     fx=[(16, 1, '1'), (1, 16, '1'), (17, 3, '2'), (3, 17, '2')])
@make('short', 130, 'C', '바람 단궁', '옥빛 도는 흰 나무 · 납작한 팔 — 둘레에 바람이 감긴다')
def s130(): return V('short', 'C', dict(a='#f0fff8', b='#b8f0d8', c='#5aa88a', k='#2a7a6a', K='#14483e', s='#e8fff4', **SP('#d8fff0', '#8ae0c0')),
                     fx=[(12, 4, '1'), (13, 4, '2'), (4, 12, '1'), (4, 13, '2'), (17, 9, '1')])
@make('short', 140, 'B', '용뿔 단궁', '붉은 나무 · 끝에 금빛 용 뿔 · 검붉은 손잡이')
def s140(): return V('short', 'B', dict(a='#e05a3a', b='#9a2a1a', c='#5a120a', k='#3a0c08', K='#1e0604', t='#ffd860', T='#c87018', s='#ffe8c0'))
@make('short', 150, 'D', '정령깃 단궁', '흰 나무 · 손잡이에 빛나는 정령 깃(물빛) — 둘레를 빛 방울이 돈다')
def s150(): return V('short', 'D', dict(a='#fffbf0', b='#e8dcc8', c='#a89878', k='#5aa8d8', K='#2a6a9a', e='#8af0ff', E='#ffffff', s='#ffffff', **SP('#ffffff', '#8af0ff')),
                     fx=[(10, 8, '1'), (7, 6, '2'), (16, 2, '2'), (2, 16, '1'), (12, 11, '2')])
# ════ 복합궁 (레인저, 2차 → Lv50 ~ 200) ════
@make('comp', 1, 'A', '검은 뿔 각궁', '검은 뿔 · 흰 힘줄 겹 · 끝이 크게 젖혀진다 · 붉은 손잡이')
def c01(): return V('comp', 'A')
@make('comp', 10, 'B', '덩굴 복합궁', '푸른 나무 · 덩굴 감은 손잡이')
def c10(): return V('comp', 'B')
@make('comp', 20, 'C', '짐승뼈 복합궁', '검은 나무 · 뼈 끝 · 뼈 손잡이 테')
def c20(): return V('comp', 'C')
@make('comp', 30, 'D', '붉은 칠 복합궁', '붉은 칠 · 금 고리 둘 · 금 끝')
def c30(): return V('comp', 'D')
@make('comp', 40, 'D', '청동 고리 복합궁', '남빛 칠 · 청동 고리 · 청동 끝')
def c40(): return V('comp', 'D', dict(a='#5a7ac8', b='#2a3a7a', c='#141e4a', h='#f0c080', G='#a8702a', t='#f0c080', T='#a8702a'))
@make('comp', 50, 'B', '이끼 복합궁', '이끼 낀 나무 · 덩굴 손잡이 — 반딧불이 앉았다')
def c50(): return V('comp', 'B', dict(a='#8aa860', b='#4e6a34', c='#2a3a1a', k='#6a8a3a', K='#3a4a1e', **SP('#f0ffb0', '#c8f070')), fx=[(9, 6, '1'), (13, 13, '2')])
@make('comp', 60, 'A', '흰 뿔 각궁', '흰 뿔 · 검은 힘줄 겹 · 검은 손잡이')
def c60(): return V('comp', 'A', dict(a='#3a3236', b='#f0e4c8', c='#b8a888', k='#2a2420', K='#141210', t='#3a3236', T='#1e1a1c'))
@make('comp', 70, 'C', '늑대뼈 복합궁', '잿빛 나무 · 늑대 뼈 끝 · 털 손잡이')
def c70(): return V('comp', 'C', dict(a='#8a8a94', b='#5a5a66', c='#34343e', k='#a8a098', K='#6a645c'))
@make('comp', 80, 'C', '해골 복합궁', '검은 나무 · 해골빛 뼈 끝 · 붉은 눈 보석 손잡이')
def c80(): return V('comp', 'C', dict(a='#4a3a3a', b='#2a1e1e', c='#140c0c', k='#e8e0d0', K='#ff3a2a'))
@make('comp', 90, 'A', '서리 각궁', '얼음빛 뿔 · 흰 힘줄 · 남빛 손잡이 — 끝에 서리')
def c90(): return V('comp', 'A', dict(a='#ffffff', b='#9ac8e8', c='#4a7aa8', k='#2a4a7a', K='#162a4a', t='#e8f8ff', T='#7ac4ec', **SP('#ffffff', '#bdeeff')),
                    fx=[(18, 3, '1'), (3, 18, '2'), (16, 0, '2')])
@make('comp', 100, 'D', '사막왕 복합궁', '모래빛 칠 · 금 고리 · 청록 보석 끝')
def c100(): return V('comp', 'D', dict(a='#f8d890', b='#d0a050', c='#8a6020', h='#ffe890', G='#c89020', t='#4ae0d0', T='#1a8a8a', k='#1a6a6a', K='#0c3a3a'))
@make('comp', 110, 'B', '숲의 왕 복합궁', '짙은 숲빛 나무 · 금 끝 · 금 덩굴 손잡이')
def c110(): return V('comp', 'B', dict(a='#5ac070', b='#2a7a3a', c='#144a20', k='#f0c040', K='#a87018', h='#ffe890', G='#c89020'), rings=(-9.0, 9.0), rch=('h', 'G'))
@make('comp', 120, 'B', '세계수 복합궁', '금빛 도는 세계수 나무 · 새잎 손잡이 — 잎이 돋아 흔들린다')
def c120(): return V('comp', 'B', dict(a='#f8e8a0', b='#c8a850', c='#7a6020', k='#7ae880', K='#2a9a48', **SP('#8ae070', '#3a9a48')),
                     fx=[(8, 5, '1'), (5, 8, '2'), (13, 2, '2'), (2, 13, '1')])
@make('comp', 130, 'D', '불사조 복합궁', '불꽃빛 칠(주홍 · 금) · 금 고리 · 불꽃 끝 — 불씨가 날린다')
def c130(): return V('comp', 'D', dict(a='#ffb040', b='#e0501a', c='#8a1e0a', h='#fff0a0', G='#e0a020', t='#ffd84a', T='#ff6a1a', **SP('#ffd84a', '#ff6a1a')),
                     fx=[(18, 2, '1'), (2, 18, '2'), (16, 0, '2'), (11, 10, '1')])
@make('comp', 140, 'C', '용뼈 복합궁', '검붉은 나무 · 상앗빛 용 뼈 끝 · 뼈 손잡이')
def c140(): return V('comp', 'C', dict(a='#8a2a22', b='#5a1410', c='#2a0806', k='#fff4e0', K='#c8b088', t='#fff4e0', T='#c8b088'))
@make('comp', 150, 'A', '천둥 각궁', '먹구름빛 뿔 · 노란 힘줄 · 노란 끝 — 끝에서 불똥이 튄다')
def c150(): return V('comp', 'A', dict(a='#fff36a', b='#3a3a4a', c='#1a1a24', k='#fff36a', K='#c0901a', t='#fff36a', T='#c0901a', s='#fffbd0', **SP('#ffffff', '#fff36a')),
                     fx=[(18, 3, '1'), (3, 18, '1'), (17, 1, '2'), (1, 17, '2'), (12, 10, '2')])
# ════ 장궁 (저격수 · 신궁, 2차 → Lv50 ~ 200) ════
@make('long', 1, 'A', '주목 장궁', '심재(주황) · 변재(흰) 두 빛 · 긴 활대')
def l01(): return V('long', 'A')
@make('long', 10, 'B', '쇠테 장궁', '짙은 나무 · 활대에 쇠 고리 넷')
def l10(): return V('long', 'B')
@make('long', 20, 'C', '백로깃 장궁', '흰 활대 · 손잡이에 흰 백로 깃')
def l20(): return V('long', 'C', dict(e='#ffffff', E='#c8ccd4', k='#3a3a44', K='#1e1e26'))
@make('long', 30, 'D', '저격수의 쇠 장궁', '검은 활대 · 길게 깎은 쇠 손잡이')
def l30(): return V('long', 'D')
@make('long', 40, 'B', '구리테 장궁', '붉은 밤나무 · 구리 고리 넷')
def l40(): return V('long', 'B', dict(a='#c87a5a', b='#8a4a32', c='#4a2418', h='#f0b080', G='#a85a2a', t='#f0b080', T='#a85a2a'))
@make('long', 50, 'D', '푸른 쇠 장궁', '남빛 활대 · 푸르게 담금질한 쇠 손잡이')
def l50(): return V('long', 'D', dict(a='#4a5a8a', b='#2a3460', c='#141a38', h='#c8e0ff', g='#6a8ac8', G='#2a3a7a', t='#c8e0ff', T='#6a8ac8'))
@make('long', 60, 'A', '물푸레 장궁', '흰 물푸레 · 옅은 심재 · 검은 손잡이')
def l60(): return V('long', 'A', dict(a='#fff8e8', b='#e0c8a0', c='#a8906a', k='#2a2420', K='#141210'))
@make('long', 70, 'C', '까마귀깃 장궁', '검은 활대 · 손잡이에 검은 까마귀 깃(푸른 윤기)')
def l70(): return V('long', 'C', dict(a='#5a5a66', b='#30303a', c='#16161c', e='#3a4a7a', E='#16161c', k='#3a3a44', K='#1e1e26'))
@make('long', 80, 'D', '은 손잡이 장궁', '흰 활대 · 은 손잡이 · 은 끝')
def l80(): return V('long', 'D', dict(a='#ffffff', b='#e0dcd0', c='#a8a090', h='#ffffff', g='#c8ccd4', G='#7a84a0'))
@make('long', 90, 'C', '공작깃 장궁', '청록 활대 · 손잡이에 공작 깃(금빛 눈)')
def l90(): return V('long', 'C', dict(a='#5ad0c0', b='#2a8a8a', c='#144a4a', e='#ffd84a', E='#2a8ad0', k='#14306a', K='#0c1a3a'))
@make('long', 100, 'A', '서리 주목 장궁', '얼음빛 주목 · 흰 변재 · 남빛 손잡이 — 서리가 반짝인다')
def l100(): return V('long', 'A', dict(a='#ffffff', b='#9ad0f0', c='#4a8ac0', k='#2a4a7a', K='#162a4a', s='#e8f8ff', **SP('#ffffff', '#bdeeff')),
                     fx=[(18, 1, '1'), (1, 18, '1'), (15, 0, '2'), (0, 15, '2')])
@make('long', 110, 'B', '금테 장궁', '검은 활대 · 금 고리 넷 · 금 끝')
def l110(): return V('long', 'B', dict(a='#4a4a56', b='#26262e', c='#121216', h='#ffe890', G='#c89020', t='#ffe890', T='#c89020'))
@make('long', 120, 'A', '별빛 장궁', '밤하늘빛 남색 활대 · 흰 손잡이 — 둘레에 별이 반짝인다')
def l120(): return V('long', 'A', dict(a='#8aa0f0', b='#2a3a8a', c='#141e4a', k='#e8eef6', K='#8a94b8', s='#e8f0ff', **SP('#ffffff', '#c8d8ff')),
                     fx=[(17, 0, '1'), (0, 17, '1'), (12, 2, '2'), (2, 12, '2'), (14, 13, '1')])
@make('long', 130, 'B', '용테 장궁', '붉은 활대 · 금빛 용 고리 넷 · 금 끝')
def l130(): return V('long', 'B', dict(a='#e05a3a', b='#9a2a1a', c='#5a120a', h='#ffd860', G='#c87018', t='#ffd860', T='#c87018'))
@make('long', 140, 'D', '신궁의 장궁', '흰 활대 · 금 손잡이 · 금 끝 — 신궁만 쓰는 활, 끝에 빛')
def l140(): return V('long', 'D', dict(a='#ffffff', b='#f0ead8', c='#c8b888', h='#fff8d0', g='#f0c040', G='#a87018', t='#fff8d0', T='#f0c040', s='#fffbe0', **SP('#ffffff', '#fff0a0')),
                     fx=[(18, 1, '1'), (1, 18, '1'), (16, 0, '2'), (0, 16, '2')])
@make('long', 150, 'C', '천사깃 장궁', '흰 활대 · 손잡이에 흰 깃과 금 깃 — 깃털 빛이 흩날린다')
def l150(): return V('long', 'C', dict(a='#ffffff', b='#f0ecf8', c='#b8b0d0', e='#ffffff', E='#f0c040', k='#f0c040', K='#a87018', s='#ffffff', **SP('#ffffff', '#fff0a0')),
                     fx=[(10, 7, '1'), (7, 5, '2'), (11, 5, '2'), (15, 14, '1')])
# ════ 대궁 (사냥꾼 · 괴수사냥꾼, 2차 → Lv50 ~ 200) ════
@make('great', 1, 'A', '통나무 대궁', '굵은 통나무 활대 · 굵은 손잡이')
def g01(): return V('great', 'A')
@make('great', 10, 'B', '쇠 덧댄 대궁', '팔마다 쇠판 · 쇠 끝')
def g10(): return V('great', 'B')
@make('great', 20, 'C', '들소뿔 대궁', '마디진 들소 뿔 · 털 손잡이')
def g20(): return V('great', 'C')
@make('great', 30, 'D', '고래뼈 대궁', '흰 고래 뼈 활대 · 끝에 가시 · 푸른 끈 손잡이')
def g30(): return V('great', 'D')
@make('great', 40, 'C', '산양뿔 대궁', '짙은 산양 뿔(굵은 마디) · 검은 털 손잡이')
def g40(): return V('great', 'C', dict(a='#c8b8a0', b='#8a7a62', c='#4a3e2e', k='#3a3430', K='#1e1a18'))
@make('great', 50, 'A', '떡갈나무 대궁', '짙은 떡갈나무 · 가죽 감은 굵은 손잡이')
def g50(): return V('great', 'A', dict(a='#8a6a4a', b='#5a4028', c='#34220e', k='#a8743e', K='#6a4422'))
@make('great', 60, 'D', '상어뼈 대궁', '잿빛 상어 뼈 · 가시 끝 · 붉은 끈 손잡이')
def g60(): return V('great', 'D', dict(a='#e0e4ea', b='#a8b0bc', c='#5a6270', k='#c8322a', K='#7a1a1a', t='#e8eef6', T='#7a84a0'))
@make('great', 70, 'B', '청동 덧댄 대궁', '붉은 나무 · 청동 판 · 청동 끝')
def g70(): return V('great', 'B', dict(a='#b86a4a', b='#7a3a24', c='#4a1e10', h='#f0c080', G='#a8702a', t='#f0c080', T='#a8702a'))
@make('great', 80, 'B', '흑철 덧댄 대궁', '검은 나무 · 검은 쇠판 · 검은 쇠 끝')
def g80(): return V('great', 'B', dict(a='#5a5060', b='#2e2830', c='#16121a', h='#8a8a96', G='#30303a', t='#8a8a96', T='#30303a', k='#3a2a2a', K='#1c1414'))
@make('great', 90, 'D', '빙룡뼈 대궁', '얼음빛 용 뼈 · 가시 끝 · 남빛 손잡이 — 서리 김이 오른다')
def g90(): return V('great', 'D', dict(a='#ffffff', b='#c8e8f8', c='#6aa8d0', k='#2a4a7a', K='#162a4a', t='#e8f8ff', T='#7ac4ec', s='#e8f8ff', **SP('#ffffff', '#bdeeff')),
                    fx=[(18, 0, '1'), (0, 18, '1'), (17, 3, '2'), (3, 17, '2')])
@make('great', 100, 'C', '맘모스 상아 대궁', '크림빛 상아(갈색 마디) · 짙은 털 손잡이')
def g100(): return V('great', 'C', dict(a='#fff8e8', b='#f0dcb0', c='#a8784a', k='#5a3a22', K='#3a2414'))
@make('great', 110, 'A', '거인의 통나무 대궁', '거인이 꺾은 고목 · 밧줄 감은 손잡이 · 쇠 고리 둘')
def g110(): return V('great', 'A', dict(a='#7a6a5a', b='#4e4034', c='#2a221a', k='#d8c090', K='#8a7448', h='#c8ccd4', G='#5a6270'), rings=(-8.0, 8.0))
@make('great', 120, 'D', '해룡뼈 대궁', '청록빛 해룡 뼈 · 진주 끝 · 청록 끈 손잡이')
def g120(): return V('great', 'D', dict(a='#e8fff8', b='#8ad8c8', c='#2a8a7a', k='#1a6a6a', K='#0c3a3a', t='#ffffff', T='#c8d8f0', s='#e8fff8'))
@make('great', 130, 'C', '괴수뿔 대궁', '검붉은 괴수 뿔(불빛 마디) · 검은 털 손잡이 — 마디에서 불씨')
def g130(): return V('great', 'C', dict(a='#6a2a22', b='#3a1410', c='#ff6a1a', k='#2a2020', K='#140e0e', **SP('#ffd84a', '#ff6a1a')),
                     fx=[(18, 1, '1'), (1, 18, '2'), (9, 4, '2')])
@make('great', 140, 'A', '세계수 뿌리 대궁', '금빛 도는 세계수 뿌리 · 이끼 손잡이 — 초록 빛이 돈다')
def g140(): return V('great', 'A', dict(a='#c8a060', b='#8a6430', c='#4a3410', k='#5ac070', K='#2a7a3a', **SP('#c8ff8a', '#5ac070')),
                     fx=[(17, 0, '1'), (0, 17, '1'), (12, 1, '2'), (1, 12, '2')])
@make('great', 150, 'B', '용철 덧댄 대궁', '검붉은 나무 · 금빛 용철 판 · 불꽃 끝 — 판 틈에서 불씨')
def g150(): return V('great', 'B', dict(a='#8a2a22', b='#4a1410', c='#24080a', h='#ffd860', G='#c87018', t='#ffb040', T='#e0501a', k='#2a1414', K='#140808', **SP('#ffd84a', '#ff6a1a')),
                     fx=[(18, 0, '1'), (0, 18, '1'), (16, 0, '2'), (0, 16, '2')])
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
from lvmap import from_job
for k in ('comp', 'long', 'great'): from_job(G[k], 2)     # 2차 직업부터 쓰는 활 → Lv50 · 60 … 200
if __name__ == '__main__':
    from zoomv import zoomsheet
    from bow import tsym, bbox
    for k in G:
        out = []
        for d in G[k]:
            s, ic = icon(d)
            bx = bbox(s)
            if bx[0] < 0 or bx[1] < 0 or bx[2] > 19 or bx[3] > 19: print(k, d['lv'], 'edge', bx)
            out.append((ic.render(), str(d['lv'])))
        zoomsheet(out[:8], 'b16_%s_1.png' % k, z=8); zoomsheet(out[8:], 'b16_%s_2.png' % k, z=8)
        print(k, len(G[k]))
