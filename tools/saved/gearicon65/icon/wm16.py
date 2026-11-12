"""채찍 16 · 정글칼 16 (11-11 00:49 사용자 「채찍은 전부 넣고 쿠크리는 ABC로만」). 2차 직업부터 → Lv50 · 60 … 200.
채찍 = 원형 넷(whip2.py)을 네 레벨 묶음마다 한 번씩. 정글칼 = 원형 셋(machete.py A 정글칼 · B 쿠크리 · C 볼로) — 묶음마다 셋 + 남는 한 자리는 A → B → C → A 차례로.
자루마다 이름 · 재질 색 · 빛(효과 칸)이 다르다."""
import whip2, machete
from lvmap import from_job
def Wv(key, pal=None, fx=()):
    d = next(f for f in whip2.FR if f['key'] == key)
    ic = d['fn']()
    if pal: ic.pal.update(pal)
    for (x, y, ch) in fx:
        if (x, y) not in ic.body: ic.fx[(x, y)] = ch
    return ic
def Mv(key, pal=None, fx=()):
    d = next(f for f in machete.FR if f['key'] == key)
    s, p = d['fn']()
    if pal: p.update(pal)
    ic = s.icon(p, fx=dict(s.fx))
    for (x, y, ch) in fx:
        if (x, y) not in ic.body: ic.fx[(x, y)] = ch
    return ic
SP = lambda a, b=None: {'1': a, '2': b or a}
GW, GM = [], []
def mw(lv, st, name, desc):
    def deco(fn): GW.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
def mm(lv, st, name, desc):
    def deco(fn): GM.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
# ════ 채찍 ════
@mw(1, 'A', '가죽 채찍', '꼰 가죽 끈이 크게 굽이친다 · 짙은 가죽 손잡이 · 흰 술')
def w01(): return Wv('A')
@mw(10, 'B', '마부 채찍', '길고 곧은 나무 막대 · 갈고리처럼 말린 가는 끈 — 말을 모는 채찍')
def w10(): return Wv('B')
@mw(20, 'C', '쇠사슬 채찍', '쇠 고리를 이은 사슬 · 끝에 쇠 날')
def w20(): return Wv('C')
@mw(30, 'D', '가시 채찍', '검붉은 덩굴 끈 · 흰 가시 · 붉은 보석 자루 끝')
def w30(): return Wv('D')
@mw(40, 'B', '버들 마부 채찍', '흰 버들 막대 · 흰 끈 · 초록 손잡이')
def w40(): return Wv('B', dict(a='#f4ecd8', b='#d0c0a0', c='#9a8a6a', f='#ffffff', k='#4a7a3a', K='#2a4a1e'))
@mw(50, 'D', '독덩굴 채찍', '푸른 독덩굴 끈 · 보랏빛 가시 · 초록 독 방울이 맺힌다')
def w50(): return Wv('D', dict(a='#7ac040', b='#3a7a22', c='#1e4a12', t='#d8a8ff', T='#8a4ac8', o='#a8ff5a', O='#4a9a1a', f='#3a7a22', **SP('#c8ff8a', '#5ac83a')),
                      fx=[(18, 1, '1'), (13, 14, '2')])
@mw(60, 'A', '소가죽 채찍', '짙은 소가죽 끈 · 검은 손잡이 · 붉은 술')
def w60(): return Wv('A', dict(a='#a8744a', b='#6a4424', c='#3a2410', k='#2a2020', K='#141010', w='#e8402a', f='#c8a080'))
@mw(70, 'C', '청동 사슬 채찍', '청동 고리 사슬 · 청동 날 · 붉은 끈 손잡이')
def w70(): return Wv('C', dict(l='#f0c080', L='#a8702a', h='#ffe0a8', g='#d0904a', G='#8a5a20', k='#a8322a', K='#6a1a14'))
@mw(80, 'C', '서리 사슬 채찍', '얼음빛 사슬 · 얼음 날 — 서리가 반짝인다')
def w80(): return Wv('C', dict(l='#ffffff', L='#7ac4ec', h='#ffffff', g='#bdeeff', G='#5aa8d8', k='#2a4a7a', K='#162a4a', **SP('#ffffff', '#bdeeff')),
                      fx=[(18, 1, '1'), (12, 13, '2'), (4, 9, '2')])
@mw(90, 'A', '불꽃 채찍', '타오르는 주홍 끈 · 검붉은 손잡이 · 노란 불꽃 술 — 불씨가 튄다')
def w90(): return Wv('A', dict(a='#ffb040', b='#e0501a', c='#8a1e0a', k='#3a1410', K='#1e0a08', w='#fff36a', f='#ffd84a', **SP('#ffd84a', '#ff6a1a')),
                      fx=[(18, 1, '1'), (15, 14, '2'), (10, 6, '2')])
@mw(100, 'B', '흑단 마부 채찍', '검은 흑단 막대 · 금 자루 끝 · 붉은 끈')
def w100(): return Wv('B', dict(a='#5a5060', b='#2e2830', c='#16121a', k='#2a2020', K='#141010', o='#ffd860', O='#a87018', f='#e8402a', w='#ffd860'))
@mw(110, 'D', '흡혈 가시 채찍', '검붉은 핏빛 덩굴 · 뼈 가시 — 붉은 빛이 맺힌다')
def w110(): return Wv('D', dict(a='#a8202a', b='#5a0a14', c='#2a040a', t='#fff4e0', T='#c8b088', o='#ff4a4a', O='#8a0a1a', f='#8a1a22', **SP('#ff8a8a', '#c8202a')),
                       fx=[(18, 1, '1'), (13, 14, '2'), (9, 5, '2')])
@mw(120, 'D', '용가시 채찍', '검은 용비늘 덩굴 · 금빛 가시 · 불씨 자루 끝 — 불씨가 튄다')
def w120(): return Wv('D', dict(a='#5a2a2a', b='#2a1010', c='#140606', t='#ffd860', T='#c87018', o='#ffb040', O='#e0501a', f='#5a2a2a', **SP('#ffd84a', '#ff6a1a')),
                       fx=[(18, 1, '1'), (13, 14, '2'), (10, 5, '1')])
@mw(130, 'B', '천공 마부 채찍', '흰 · 금 막대 · 하늘빛 끈 · 금 자루 끝 — 둘레에 별')
def w130(): return Wv('B', dict(a='#ffffff', b='#e8eef6', c='#a8b8d0', k='#2a6ab8', K='#163a7a', o='#ffe890', O='#c8901a', f='#8ad0ff', w='#ffffff', **SP('#ffffff', '#ffe890')),
                       fx=[(18, 1, '1'), (11, 2, '2'), (3, 9, '1')])
@mw(140, 'A', '번개 채찍', '먹빛 끈에 노란 번개 무늬 · 번개 술 — 끝에서 불똥이 튄다')
def w140(): return Wv('A', dict(a='#fff36a', b='#3a3a4a', c='#1a1a24', k='#3a3a48', K='#1a1a22', w='#ffffff', f='#fff36a', **SP('#ffffff', '#fff36a')),
                       fx=[(18, 1, '1'), (17, 4, '2'), (15, 0, '2'), (12, 14, '1')])
@mw(150, 'C', '심연 사슬 채찍', '보랏빛 빛나는 사슬 · 어둠 날 — 어둠 빛이 떠돈다')
def w150(): return Wv('C', dict(l='#e0c8ff', L='#6a3ab8', h='#ffffff', g='#b88aff', G='#5a3a9a', k='#2a2040', K='#120e1c', o='#b88aff', O='#5a3a9a', **SP('#e0c8ff', '#8a5ad8')),
                       fx=[(18, 1, '1'), (12, 13, '2'), (4, 9, '2'), (17, 7, '1')])
# ════ 정글칼 ════
@mm(1, 'A', '정글칼', '곧은 등 · 끝 쪽으로 넓어지는 외날 · 나무 손잡이 · 놋쇠 징')
def m01(): return Mv('A')
@mm(10, 'B', '쿠크리', '앞으로 굽은 두꺼운 날 · 날 뿌리 홈 · 짐승 뿔 손잡이')
def m10(): return Mv('B')
@mm(20, 'C', '볼로', '끝으로 갈수록 배가 불룩한 무거운 날 · 짧은 손잡이')
def m20(): return Mv('C')
@mm(30, 'A', '강철 정글칼', '밝은 강철 날 · 검은 손잡이 · 쇠 징')
def m30(): return Mv('A', dict(b='#eef2f8', B='#c8ccd4', n='#6a7280', k='#2a2a30', K='#141418', o='#c8ccd4'))
@mm(40, 'B', '청동 쿠크리', '청동 날 · 검은 뿔 손잡이')
def m40(): return Mv('B', dict(w='#fff0d0', b='#e8b878', B='#b07a3a', n='#6a4418', k='#3a3430', K='#1e1a18'))
@mm(50, 'C', '흑철 볼로', '검은 쇠 날 · 붉은 손잡이 · 금 징')
def m50(): return Mv('C', dict(w='#c8ccd4', b='#5a5a66', B='#3a3a44', n='#1e1e26', k='#a8322a', K='#6a1a14', o='#ffd860'))
@mm(60, 'A', '덤불 정글칼', '푸른빛 도는 날 · 풀빛 끈 감은 손잡이 — 덤불을 베며 길을 낸다')
def m60(): return Mv('A', dict(b='#d8ecd0', B='#a8c4a0', n='#4a6a4a', k='#5a7a3a', K='#2e4a1e', o='#a8c870'))
@mm(70, 'B', '산양뿔 쿠크리', '흰 산양 뿔 손잡이 · 밝은 강철 날')
def m70(): return Mv('B', dict(b='#eef2f8', B='#c8ccd4', k='#fff8e8', K='#c8b898'))
@mm(80, 'C', '서리 볼로', '얼음 날 · 남빛 손잡이 — 서리가 반짝인다')
def m80(): return Mv('C', dict(w='#ffffff', b='#c8e8f8', B='#7ac4ec', n='#2a6aa8', k='#2a4a7a', K='#162a4a', o='#ffffff', **SP('#ffffff', '#bdeeff')),
                      fx=[(18, 1, '1'), (13, 1, '2'), (19, 6, '2')])
@mm(90, 'A', '불꽃 정글칼', '붉게 달아오른 날끝 · 검은 손잡이 — 불씨가 튄다')
def m90(): return Mv('A', dict(w='#fff36a', b='#ff8a3a', B='#c8401a', n='#5a1a0a', k='#2a1a14', K='#140a08', o='#ffb040', **SP('#ffd84a', '#ff6a1a')),
                      fx=[(18, 1, '1'), (19, 5, '2'), (14, 0, '2')])
@mm(100, 'B', '용비늘 쿠크리', '검붉은 용비늘 날 · 금 손잡이 · 금 받침')
def m100(): return Mv('B', dict(w='#ffd0a0', b='#c8402a', B='#7a1a10', n='#3a0806', k='#ffd860', K='#a87018', h='#ffe890', g='#c89020', G='#7a5010'))
@mm(110, 'C', '독 볼로', '초록 독이 밴 날 · 검은 손잡이 — 독 방울이 떨어진다')
def m110(): return Mv('C', dict(w='#c8ff8a', b='#7ac040', B='#3a7a22', n='#1e4a12', k='#2a2a24', K='#141410', **SP('#c8ff8a', '#5ac83a')),
                       fx=[(18, 8, '1'), (17, 10, '2'), (14, 0, '2')])
@mm(120, 'C', '천공 볼로', '흰 · 금 날 · 하늘빛 손잡이 — 둘레에 별')
def m120(): return Mv('C', dict(w='#ffffff', b='#f8f4e8', B='#e8d8a0', n='#c8901a', k='#2a6ab8', K='#163a7a', o='#ffe890', **SP('#ffffff', '#ffe890')),
                       fx=[(18, 1, '1'), (13, 0, '2'), (19, 7, '2')])
@mm(130, 'A', '세계수 정글칼', '금빛 도는 날 · 세계수 가지 손잡이 — 새잎이 흩날린다')
def m130(): return Mv('A', dict(w='#fffbd8', b='#f0e0a0', B='#c8a850', n='#7a6020', k='#7a9a3a', K='#3a5a1e', o='#8ae070', **SP('#8ae070', '#3a9a48')),
                       fx=[(18, 1, '1'), (14, 0, '2'), (19, 6, '2')])
@mm(140, 'B', '그림자 쿠크리', '검보라 날 · 보랏빛 날 줄 — 어둠 빛이 떠돈다')
def m140(): return Mv('B', dict(w='#e0c8ff', b='#4a3a6a', B='#2a2040', n='#120e1c', k='#3a2e52', K='#1e182e', o='#b88aff', **SP('#e0c8ff', '#8a5ad8')),
                       fx=[(18, 3, '1'), (19, 8, '2'), (13, 2, '2')])
@mm(150, 'A', '번개 정글칼', '먹빛 날 · 노란 번개 날 줄 · 노란 징 — 불똥이 튄다')
def m150(): return Mv('A', dict(w='#fff36a', b='#5a5a6a', B='#3a3a48', n='#1a1a22', k='#3a3a48', K='#1a1a22', o='#fff36a', **SP('#ffffff', '#fff36a')),
                       fx=[(18, 1, '1'), (19, 5, '2'), (14, 0, '2'), (16, 3, '1')])
from_job(GW, 2); from_job(GM, 2)
def icon(d): return d['fn']()
if __name__ == '__main__':
    from zoomv import zoomsheet
    zoomsheet([(icon(d).render(), str(d['lv'])) for d in GW[:8]], 'wm16_w1.png', z=8); zoomsheet([(icon(d).render(), str(d['lv'])) for d in GW[8:]], 'wm16_w2.png', z=8)
    zoomsheet([(icon(d).render(), str(d['lv'])) for d in GM[:8]], 'wm16_m1.png', z=8); zoomsheet([(icon(d).render(), str(d['lv'])) for d in GM[8:]], 'wm16_m2.png', z=8)
