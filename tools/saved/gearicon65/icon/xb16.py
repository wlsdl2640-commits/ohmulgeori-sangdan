"""손목 석궁 · 볼트 · 볼트통 16씩 — 트래커 · 스토커 부장비 · 탄약 (11-10 23:59 사용자 「이 시안들로 무기 더 만들어 ㄱㄱ」).
원형 넷(xbow.py · bolt.py · bcase.py)을 네 레벨 묶음마다 한 번씩 · 2차 직업부터 쓰니 Lv50 · 60 … 200. 이름 · 재질 · 무늬 · 빛(효과 칸)이 모두 다르다."""
import xbow, bolt, bcase
def base(mod, key):
    d = next(f for f in mod.FR if f['key'] == key)
    s, pal = d['fn']()
    return s, dict(pal)
def V(mod, key, pal=None, fx=(), deco=()):
    s, p = base(mod, key)
    if pal: p.update(pal)
    if not hasattr(s, 'fx'): s.fx = {}
    s.fx = dict(s.fx)
    for (x, y, ch) in deco:
        if hasattr(s, 'part'): s.part[(x, y)] = ('grip', ch)
        else: s.body[(x, y)] = ch
    occ = s.part if hasattr(s, 'part') else s.body
    for (x, y, ch) in fx:
        if (x, y) not in occ: s.fx[(x, y)] = ch
    return s, p
G = {'xbow': [], 'bolt': [], 'bcase': []}
def make(kind, lv, st, name, desc):
    def deco(fn): G[kind].append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
SP = lambda a, b=None: {'1': a, '2': b or a}
# ════ 손목 석궁 ════
X = 'xbow'
@make(X, 1, 'A', '가죽 손목 석궁', '붉은 가죽 팔찌(끈 둘 · 금 버클) · 나무 개머리 · 쇠 활대 · 볼트를 메겼다')
def x01(): return V(xbow, 'A')
@make(X, 10, 'B', '쇠 손목 석궁', '마디진 쇠 팔찌 · 쇠 개머리 · 끝이 앞으로 젖혀진 쇠 활대')
def x10(): return V(xbow, 'B')
@make(X, 20, 'C', '연발 손목 석궁', '개머리 위 볼트 상자(세 발) · 짧고 굵은 활대')
def x20(): return V(xbow, 'C')
@make(X, 30, 'D', '갈고리 손목 석궁', '갈고리처럼 꺾인 검은 쇠 활대 · 금 끝 · 검은 가죽 팔찌')
def x30(): return V(xbow, 'D')
@make(X, 40, 'C', '사냥꾼의 연발 석궁', '풀빛 가죽 팔찌 · 짙은 나무 볼트 상자 · 볼트 셋')
def x40(): return V(xbow, 'C', dict(w='#6a7a3a', V='#4a5a2a', W='#22281a', e='#8a6a3a', E='#4a3418'))
@make(X, 50, 'A', '늑대가죽 손목 석궁', '잿빛 늑대 가죽 팔찌 · 검은 나무 개머리 · 은 버클')
def x50(): return V(xbow, 'A', dict(w='#a8a8b0', V='#6a6a74', W='#2a2a30', o='#e8eef6', a='#4a3a30', b='#2e241c', c='#18120e'))
@make(X, 60, 'D', '흑철 갈고리 석궁', '검은 쇠 · 붉은 갈고리 끝 · 붉은 볼트 머리')
def x60(): return V(xbow, 'D', dict(x='#ff5a4a', X='#a82a2a', h='#6a6a78', g='#34343e', G='#16161c'))
@make(X, 70, 'B', '청동 손목 석궁', '청동 마디 팔찌 · 청동 개머리 · 청동 활대')
def x70(): return V(xbow, 'B', dict(h='#f0c080', g='#b07a3a', G='#6a4418', f='#f0c080'))
@make(X, 80, 'B', '서리 손목 석궁', '얼음빛 쇠 · 서리 낀 활대 · 얼음 볼트 — 서리가 반짝인다')
def x80(): return V(xbow, 'B', dict(h='#f4fbff', g='#9ad0f0', G='#4a8ac0', f='#e8f8ff', x='#ffffff', X='#7ac4ec', s='#e8f8ff', **SP('#ffffff', '#bdeeff')),
                    fx=[(18, 1, '1'), (13, 1, '2'), (2, 10, '2')])
@make(X, 90, 'D', '독니 갈고리 석궁', '검푸른 쇠 · 독이 밴 초록 갈고리 끝 · 독 볼트 — 독 방울이 맺힌다')
def x90(): return V(xbow, 'D', dict(h='#5a7a6a', g='#2a4a3a', G='#16261e', x='#8aff5a', X='#3aa82a', **SP('#c8ff8a', '#5ac83a')), fx=[(18, 2, '1'), (16, 8, '2')])
@make(X, 100, 'A', '용가죽 손목 석궁', '붉은 용가죽 팔찌 · 금 버클 · 검붉은 개머리 · 금 활대 — 불씨가 튄다')
def x100(): return V(xbow, 'A', dict(w='#e0503a', V='#8a1e14', W='#3a0c08', o='#ffd860', a='#5a1a14', b='#3a0c08', c='#1e0604', h='#ffe890', g='#c89020', G='#7a5010',
                                     **SP('#ffd84a', '#ff6a1a')), fx=[(18, 1, '1'), (12, 2, '2')])
@make(X, 110, 'C', '그림자 연발 석궁', '검보라 팔찌 · 그림자 볼트 상자 · 보랏빛 볼트 — 어둠 빛이 떠돈다')
def x110(): return V(xbow, 'C', dict(w='#4a3a6a', V='#2a2040', W='#120e1c', e='#5a4a80', E='#2a2040', a='#3a2e52', b='#1e182e', c='#0c0816', f='#c89aff', x='#e0c8ff', X='#8a5ad8',
                                     s='#e0c8ff', **SP('#e0c8ff', '#8a5ad8')), fx=[(17, 1, '1'), (2, 11, '2'), (12, 1, '2')])
@make(X, 120, 'A', '천공 손목 석궁', '흰 · 금 팔찌 · 하늘빛 끈 · 흰 쇠 활대 · 금 볼트 — 둘레에 별')
def x120(): return V(xbow, 'A', dict(w='#ffffff', V='#c8d8f0', W='#5ab0f0', o='#ffe890', a='#e8eef6', b='#a8b8d0', c='#5a6a88', h='#ffffff', g='#c8d8f0', G='#7a8aa8',
                                     x='#ffe890', X='#c8901a', s='#ffe890', **SP('#ffffff', '#ffe890')), fx=[(18, 1, '1'), (13, 0, '2'), (1, 13, '1')])
@make(X, 130, 'C', '번개 연발 석궁', '먹빛 쇠 · 노란 볼트 상자 · 번개 볼트 — 불똥이 튄다')
def x130(): return V(xbow, 'C', dict(w='#3a3a48', V='#24242e', W='#121216', e='#fff36a', E='#c0901a', a='#3a3a48', b='#24242e', c='#121216', f='#fff36a', x='#ffffff', X='#fff36a',
                                     h='#fff36a', g='#c0901a', G='#6a4a0a', s='#fffbd0', **SP('#ffffff', '#fff36a')), fx=[(18, 1, '1'), (17, 6, '2'), (12, 2, '2'), (3, 9, '1')])
@make(X, 140, 'B', '심연 손목 석궁', '검은 쇠에 보랏빛 마디 · 빛나는 보라 활대')
def x140(): return V(xbow, 'B', dict(h='#b88aff', g='#5a3a9a', G='#1e1030', f='#e0c8ff', x='#ffffff', X='#b88aff', s='#e0c8ff', **SP('#e0c8ff', '#8a5ad8')),
                     fx=[(18, 1, '1'), (13, 1, '2'), (2, 12, '2')])
@make(X, 150, 'D', '포식자의 갈고리 석궁', '검붉은 쇠 · 뼈 갈고리 끝 · 뼈 볼트 · 검은 가죽 팔찌 — 큰 짐승을 사냥하는 덫')
def x150(): return V(xbow, 'D', dict(h='#8a3a3a', g='#4a1a1a', G='#240a0a', x='#fff4e0', X='#c8b088', o='#fff4e0', w='#3a2a2a', V='#241818', W='#120c0c'))
# ════ 볼트 ════
B = 'bolt'
@make(B, 1, 'A', '쇠 볼트', '뾰족한 쇠 머리 · 나무 대 · 흰 깃 · 가죽 끈으로 묶은 둘')
def b01(): return V(bolt, 'A')
@make(B, 10, 'B', '넓은 날 볼트', '넓은 세모 날 머리 · 붉은 깃 · 셋')
def b10(): return V(bolt, 'B')
@make(B, 20, 'C', '쇠 깃 볼트', '대 · 깃까지 모두 쇠 · 네모 끌 머리')
def b20(): return V(bolt, 'C')
@make(B, 30, 'D', '미늘 볼트', '미늘 달린 머리 · 검은 깃 · 붉은 끈 · 셋')
def b30(): return V(bolt, 'D')
@make(B, 40, 'B', '사냥 볼트', '넓은 날 · 갈색 매 깃 · 짙은 나무 대 · 셋')
def b40(): return V(bolt, 'B', dict(f='#c8a070', F='#7a5232', a='#a8784a', b='#6a4424'))
@make(B, 50, 'C', '흑철 볼트', '대 · 깃까지 검은 쇠 · 끌 머리')
def b50(): return V(bolt, 'C', dict(h='#8a8a98', g='#4a4a56', G='#202028'))
@make(B, 60, 'A', '청동 볼트', '청동 머리 · 흰 깃 · 붉은 끈')
def b60(): return V(bolt, 'A', dict(h='#f8d098', g='#c08a40', G='#7a4a18', r='#c8322a', R='#7a1a1a'))
@make(B, 70, 'D', '독 미늘 볼트', '초록 독이 밴 미늘 머리 · 검은 깃 · 셋 — 독 방울')
def b70(): return V(bolt, 'D', dict(h='#c8ff8a', g='#5ac83a', G='#2a6a1a', **SP('#c8ff8a', '#5ac83a')), fx=[(18, 1, '1'), (12, 1, '2')])
@make(B, 80, 'D', '불꽃 미늘 볼트', '불타는 미늘 머리 · 주황 깃 · 셋 — 불씨가 날린다')
def b80(): return V(bolt, 'D', dict(h='#fff0a0', g='#ff8a1a', G='#a83a0a', f='#ff8a3a', F='#a8401a', **SP('#ffd84a', '#ff6a1a')), fx=[(18, 1, '1'), (13, 0, '2'), (18, 6, '2')])
@make(B, 90, 'A', '서리 볼트', '얼음 머리 · 흰 깃 · 남빛 끈 — 서리가 반짝인다')
def b90(): return V(bolt, 'A', dict(h='#ffffff', g='#9ad0f0', G='#4a8ac0', r='#2a4a7a', R='#162a4a', **SP('#ffffff', '#bdeeff')), fx=[(18, 1, '1'), (13, 1, '2')])
@make(B, 100, 'B', '은 볼트', '은 넓은 날 · 흰 깃 · 은 끈 — 언데드를 꿰뚫는 은')
def b100(): return V(bolt, 'B', dict(h='#ffffff', g='#d8dee8', G='#8a94a8', f='#ffffff', F='#c8ccd4', r='#c8ccd4', R='#7a84a0'))
@make(B, 110, 'C', '번개 쇠 볼트', '노란 쇠 · 번개를 머금은 끌 머리 — 불똥이 튄다')
def b110(): return V(bolt, 'C', dict(h='#fffbd0', g='#fff36a', G='#a87a10', **SP('#ffffff', '#fff36a')), fx=[(18, 1, '1'), (17, 5, '2'), (13, 0, '2')])
@make(B, 120, 'C', '용철 볼트', '붉은 금빛 용철 · 끌 머리')
def b120(): return V(bolt, 'C', dict(h='#ffd860', g='#e05a3a', G='#7a1a10'))
@make(B, 130, 'B', '천공 볼트', '흰 금 넓은 날 · 하늘빛 깃 · 금 끈 — 둘레에 별')
def b130(): return V(bolt, 'B', dict(h='#ffffff', g='#ffe890', G='#c8901a', f='#8ad0ff', F='#2a6ab8', r='#ffe890', R='#c8901a', a='#ffffff', b='#c8d8f0',
                                     **SP('#ffffff', '#ffe890')), fx=[(18, 1, '1'), (13, 0, '2'), (2, 10, '1')])
@make(B, 140, 'D', '그림자 미늘 볼트', '보랏빛 미늘 머리 · 검보라 깃 · 셋 — 어둠 빛')
def b140(): return V(bolt, 'D', dict(h='#e0c8ff', g='#8a5ad8', G='#3a2060', f='#5a4a80', F='#2a2040', a='#4a3a6a', b='#2a2040', r='#b88aff', R='#5a3a9a',
                                     **SP('#e0c8ff', '#8a5ad8')), fx=[(18, 1, '1'), (12, 1, '2')])
@make(B, 150, 'A', '태양 볼트', '해처럼 빛나는 금 머리 · 흰 깃 · 붉은 끈 — 햇살이 뻗는다')
def b150(): return V(bolt, 'A', dict(h='#ffffff', g='#ffd860', G='#c8901a', r='#e0402a', R='#8a1a10', **SP('#ffffff', '#fff0a0')),
                     fx=[(18, 1, '1'), (13, 0, '2'), (18, 6, '2'), (15, 2, '1')])
# ════ 볼트통 ════
C = 'bcase'
@make(C, 1, 'A', '가죽 볼트통', '가죽 통 · 앞 실밥 · 볼트 셋(깃 끝만) · 허리띠')
def k01(): return V(bcase, 'A')
@make(C, 10, 'B', '천 볼트통', '국방색 천 통 · 끈 둘 · 금 버클 · 볼트 넷')
def k10(): return V(bcase, 'B')
@make(C, 20, 'C', '쇠테 볼트통', '검은 가죽 통 · 쇠 테두리 · 징 · 붉은 깃 볼트 셋')
def k20(): return V(bcase, 'C')
@make(C, 30, 'D', '털 볼트통', '털 두른 통 입구 · 짐승 가죽 · 검은 깃 볼트 셋')
def k30(): return V(bcase, 'D')
@make(C, 40, 'D', '늑대털 볼트통', '잿빛 늑대 털 입구 · 짙은 가죽 · 흰 깃 볼트')
def k40(): return V(bcase, 'D', dict(w='#c8c8d0', W='#7a7a84', a='#6a5040', b='#4a3428', c='#2a1e16', f='#f0f0f4', F='#a8a8b0'))
@make(C, 50, 'A', '사슴가죽 볼트통', '옅은 사슴 가죽 · 흰 실밥 · 갈색 깃 볼트')
def k50(): return V(bcase, 'A', dict(a='#e8c8a0', b='#c8a070', c='#8a6a40', d='#ffffff', f='#c8a070', F='#7a5232'))
@make(C, 60, 'C', '청동테 볼트통', '검붉은 가죽 · 청동 테두리 · 청동 징')
def k60(): return V(bcase, 'C', dict(a='#7a2a22', b='#4a1410', c='#2a0806', h='#f0c080', g='#a8702a', o='#f0c080'))
@make(C, 70, 'B', '위장 천 볼트통', '흙빛 · 풀빛 얼룩 천 · 검은 끈 · 쇠 버클')
def k70():
    s, p = V(bcase, 'B', dict(a='#8a7a4a', b='#5e5a34', c='#3a3a20', k='#22221a', K='#121210', o='#c8ccd4', O='#7a8290', y='#3a4a22', Y='#6a5030'))
    for (x, y), ch in list(s.body.items()):
        if ch == 'b' and (x * 3 + y * 5) % 7 == 0: s.body[(x, y)] = 'y'; s.body[(19 - x, y)] = 'y'
        elif ch == 'b' and (x * 5 + y * 3) % 9 == 0: s.body[(x, y)] = 'Y'; s.body[(19 - x, y)] = 'Y'
    return s, p
@make(C, 80, 'B', '눈밭 천 볼트통', '흰 · 잿빛 천 · 붉은 버클 · 흰 깃 볼트')
def k80(): return V(bcase, 'B', dict(a='#ffffff', b='#d8dee8', c='#8a94a8', k='#6a7484', K='#3a4250', o='#e8402a', O='#8a1a10', f='#ffffff', F='#c8ccd4', e='#a8b0bc'))
@make(C, 90, 'C', '흑철테 볼트통', '검은 가죽 · 검은 쇠 테두리 · 붉은 징 · 붉은 깃')
def k90(): return V(bcase, 'C', dict(h='#6a6a78', g='#34343e', o='#e8402a'))
@make(C, 100, 'D', '설표털 볼트통', '흰 설표 털(잿빛 점) 입구 · 흰 가죽 · 남빛 깃 볼트')
def k100():
    s, p = V(bcase, 'D', dict(w='#ffffff', W='#c8ccd4', a='#f0f0f4', b='#c8ccd4', c='#8a94a8', f='#5a7ac8', F='#2a3a7a', z='#5a6270'))
    for (x, y) in ((5, 12), (8, 15), (12, 13)): s.body[(x, y)] = 'z'; s.body[(19 - x, y)] = 'z'
    return s, p
@make(C, 110, 'A', '용가죽 볼트통', '붉은 용비늘 가죽 · 금 실밥 · 금빛 깃 볼트')
def k110():
    s, p = V(bcase, 'A', dict(a='#e05a3a', b='#9a2a1a', c='#5a120a', d='#ffd860', f='#ffd860', F='#c87018', y='#f07a5a'))
    for (x, y), ch in list(s.body.items()):
        if ch == 'b' and (x + 2 * y) % 4 == 0 and x <= 9: s.body[(x, y)] = 'y'; s.body[(19 - x, y)] = 'y'
    return s, p
@make(C, 120, 'A', '그림자 가죽 볼트통', '검보라 가죽 · 보랏빛 실밥 · 빛나는 보라 깃 — 어둠 빛이 떠돈다')
def k120(): return V(bcase, 'A', dict(a='#5a4a80', b='#3a2e52', c='#1e182e', d='#b88aff', f='#e0c8ff', F='#8a5ad8', e='#4a3a6a', **SP('#e0c8ff', '#8a5ad8')),
                     fx=[(2, 3, '1'), (17, 6, '2'), (15, 2, '2')])
@make(C, 130, 'D', '맹수털 볼트통', '범 무늬 털 입구(주황 · 검정) · 짙은 가죽 · 붉은 깃')
def k130(): return V(bcase, 'D', dict(w='#ffb04a', W='#1a1210', a='#7a4a2a', b='#4a2a16', c='#2a160a', f='#e8402a', F='#8a1a10'))
@make(C, 140, 'B', '천공 천 볼트통', '흰 · 금빛 천 · 하늘빛 끈 · 금 버클 · 하늘빛 깃 — 둘레에 별')
def k140(): return V(bcase, 'B', dict(a='#ffffff', b='#f0ead8', c='#c8b888', k='#5ab0f0', K='#2a6ab8', o='#ffe890', O='#c8901a', f='#8ad0ff', F='#2a6ab8', e='#e8eef6',
                                      **SP('#ffffff', '#ffe890')), fx=[(2, 3, '1'), (17, 2, '2'), (1, 14, '2')])
@make(C, 150, 'C', '금테 볼트통', '검은 가죽 · 금 테두리 · 붉은 보석 징 · 금빛 깃 볼트')
def k150(): return V(bcase, 'C', dict(h='#ffe890', g='#c89020', o='#ff4a4a', f='#ffd860', F='#c87018', a='#3a3040', b='#24202a', c='#141018'))
def icon(kind, d):
    s, pal = d['fn']()
    if kind == 'bcase': return s, s.icon(pal)
    return s, s.icon(pal, fx=dict(s.fx))
from lvmap import from_job
for k in G: from_job(G[k], 2)     # 2차 직업부터 → Lv50 · 60 … 200
if __name__ == '__main__':
    from zoomv import zoomsheet
    for k in G:
        out = [(icon(k, d)[1].render(), str(d['lv'])) for d in G[k]]
        zoomsheet(out[:8], 'x16_%s_1.png' % k, z=8); zoomsheet(out[8:], 'x16_%s_2.png' % k, z=8)
        print(k, len(G[k]))
