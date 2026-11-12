"""공물 — 네크로맨서 · 리치의 부장비 (11-10 20:16 사용자: 각종 형태의 공물들). 앞모습 · 물건마다 꼴이 다르다.
틀(갈래 4): A 해골 공물 · B 그릇 공물(잔 · 병 · 접시) · C 불 공물(초 · 등불) · D 뼈 공물(뼈 · 이빨 · 손 · 발톱) — 네 레벨 묶음마다 한 갈래씩.
글자: 뼈 1(빛) 2(그늘) 9(구멍) · 이빨 t · 피 r R · 쇠 h g G · 밀랍 c C · 불 f F y · 유리 o O · 물 l L · 끈 k K · 눈 e i · 넋불 s S · 살 m M · 붕대 b B"""
from sh import Sh
def grid(s, rows, ox=None, oy=None):
    rows = [r.replace(' ', '') for r in rows]
    w = max(len(r) for r in rows); h = len(rows)
    ox = (20 - w) // 2 if ox is None else ox; oy = (20 - h) // 2 if oy is None else oy
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch != '.': s.put(ox + i, oy + j, ch)
ART = {
 'ratskull': ["....1111....", "..11111111..", ".1111111111.", ".1199119911.", ".1199119911.", "..11119111..", "...111111...", "....1tt1....", ".....tt.....", ".....tt....."],
 'chalice': ["hrrrrrrrrrh", "grRRRRRRRrg", "rgggggggggG", "rghhgggggGG", ".rhggggggG.", ".Rghgggg G.".replace(' ', 'g'), "..ggggggG..", "...gggGG...", "....gGG....", ".....g.....", ".....g.....", "....hgG....", "..hhggggG..", ".hgggggggG."],
 'candle': ["....y....", "...yfy...", "...fFf...", "....F....", "....k....", "..ccccC..", "..cccCC..", ".cccccCc.", "..ccccC..", "..ccccC..", "..ccccCc.", "..ccccC..", "..ccccC..", ".hgggggG.", "hgggggggG"],
 'bonebundle': [".11.11.11.", "1221122122", ".12.12.12.", "..2..2..2.", ".12.12.12.", "kKkKkKkKkK", "KkKkKkKkKk", ".12.12.12.", ".12.12.12.", ".12.12.12.", "1221122122", ".11.11.11."],
 'candles3': ["....y.......", "...yfy..y...", "...fFf.yfy..", "....k..fFf..", "y..cc...k...", "f..cC..ccC..", "k..cC..ccC..", "cC.cC..cccC.", "cC.cCc.ccC..", "cC.cC..ccC..", "cCccC..ccCc.", "hggggggggggG", ".hgggggggG.."],
 'raven': [".....1111......", "...11111111....", "..1111111111...", "..1199111111111", "..11991111222222", "..1111111222...", "...11111.......", "....2222.......", "......22......."],
 'fangs': ["k............k", "kk..........kk", ".kk........kk.", "..kkk....kkk..", "....kkkkkk....", "..t.t.tt.t.t..", "..t.t.tt.t.t..", "..t.t.tt.t.t..", "....t.tt.t....", ".......t......"],
 'eyejar': ["...KkkkK...", "..oooooooO.", ".oOllllllOO", ".olleilllLO", ".oleeelieLO", ".olleielllO", ".oleiellieO", ".olllleeiLO", ".olLLLLLLLO", "..oOOOOOOO."],
 'souljar': ["....KK....", "....kK....", "...oooO...", "..oSssSO..", ".oSsssssO.", ".osSwsSwsO", ".ossssssO.", ".oSsssssSO", ".oSSssSSO.", "..oOOOOO.."],
 'lantern': ["....hh....", "...h..G...", "..hgggggG.", "..g.sss.G.", "..gsswsG..", "..gsssssG.", "..g.sss.G.", "..gSsssSG.", "..hgggggG.", "...gGGGG..", "....gGG..."],
 'skullcandle': ["......y.....", ".....yfy....", ".....fFf....", "......k.....", "....cccc....", "..1ccCcc1...", ".11c111C11..", ".1cc9119C1..".replace('C1', 'C1'), ".1c99199c1..", ".11111911...", "..1111111...", "..1t1t1t1...", "...t.t.t...."],
 'hand': ["..b.b.b.....", "..b.b.b.b...", "..b.b.b.b...", "..bBbBbBb...", "..bbbbbbb.bb", "..bbBbbBbbb.", "..bbbbbbbb..", "...bBbbbB...", "...bbbbbb...", "...bBbbBb...", "....bbbb....", "....kkkk....", "....KKKK...."],
 'claw': ["..1.....1..", ".12.....21.", ".12..1..21.", ".12.12.21..", "..2.12.2...", "..MM12MM...", ".MmmmmmmM..", ".MmmmmmmM..", "..MmmmmM...", "...kkkk....", "..k....k...", ".k......k.."],
 'heart': ["....RR.RR...", "...RrrRrrR..", "..RrrrrrrrR.", "..RrrwrrrrR.", "..RrrrrrrrR.", "...RrrrrrR..", "....RrrrR...", ".....RrR....", "......R.....", "..hhggggggG.", ".hgggggggggG", "..gGGGGGGGG."],
 'bonecandle': ["....y....", "...yfy...", "...fFf...", "....k....", "...ccC...", "...ccC...", "..cccCc..", "..hggG...", "...11....", "..1221...", "...12....", "...12....", "..1221...", "...12....", ".111221..", "11112221."],
 'lichskull': ["...7.77.7...", "...777777...", "..11111111..", ".1111111111.", ".19s9119s91.", ".1999119991.", ".1111191111.", "..11111111..", "..1t1t1t1...", "...t.t.t...."],
}
def obj(key, fx=None):
    s = Sh(); grid(s, ART[key])
    if fx: s.fx.update(fx)
    return s
FRAMES = {'A': ('해골 공물', 'ratskull'), 'B': ('그릇 공물', 'chalice'), 'C': ('불 공물', 'candle'), 'D': ('뼈 공물', 'bonebundle')}
STYLE = {k: v[0] for k, v in FRAMES.items()}
BONE = {'1': '#e8e0d0', '2': '#a89c88', '9': '#1a1214', 't': '#f4ecd0'}
BLOOD = dict(r='#e0283a', R='#7a0a14')
IRON = dict(h='#d8dee8', g='#8a94a8', G='#4e5662')
WAX = dict(c='#3a3440', C='#1e1a24', f='#ffd84a', F='#ff7a1a', y='#fff6c8', k='#14121a')
GLASS = dict(o='#c8e0e8', O='#6a8a98')
DEF = dict(k='#6a4a2a', K='#3a2614', l='#4a8a40', L='#2a5a24', e='#f4ece0', i='#c8283a', s='#8ad8f4', S='#3a7ab8', w='#ffffff',
           m='#4a8a48', M='#2a5a2a', b='#d8ccb0', B='#a8987c', **{'7': '#f0c040', '1': '#e8e0d0', '2': '#a89c88', '9': '#1a1214', 't': '#f4ecd0'})
def M(*ds, **kw):
    r = dict(DEF)
    for d in ds: r.update(d)
    r.update(kw); return r
FR = []
for k, (nm, key) in FRAMES.items():
    FR.append(dict(key=k, desc={'A': '해골 — 짐승 · 새 · 사람 · 왕의 해골', 'B': '그릇 — 피 담긴 잔 · 눈알 병 · 넋 병 · 심장 접시',
                                'C': '불 — 검은 초 · 촛대 · 넋불 등불 · 뼈 촛대', 'D': '뼈 — 뼈 묶음 · 송곳니 목걸이 · 미라 손 · 용 발톱'}[k],
                   fn=(lambda key=key: (obj(key), M(BONE, BLOOD, IRON, WAX, GLASS, k='#c8283a', K='#6a0e18')))))
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '쥐 해골', '하수구에서 주운 쥐 해골 · 누런 앞니')
def f01(): return obj('ratskull'), M(BONE, t='#f0d070')
@make(10, 'B', '피 담긴 잔', '가장자리로 피가 넘쳐흐르는 쇠 잔')
def f10(): return obj('chalice'), M(BLOOD, IRON)
@make(20, 'C', '검은 초', '촛농이 흘러내리는 검은 초 · 쇠 받침')
def f20(): return obj('candle'), M(WAX, IRON)
@make(30, 'D', '뼈 묶음', '붉은 끈으로 묶은 뼈 세 개')
def f30(): return obj('bonebundle'), M(BONE, k='#c8283a', K='#6a0e18')
@make(40, 'C', '세 갈래 촛대', '높이가 다른 검은 초 셋 · 쇠 받침')
def f40(): return obj('candles3'), M(WAX, IRON)
@make(50, 'A', '까마귀 해골', '부리가 긴 까마귀 해골')
def f50(): return obj('raven'), M(BONE)
@make(60, 'D', '송곳니 목걸이', '짐승 송곳니를 꿴 가죽 끈')
def f60(): return obj('fangs'), M(BONE, k='#6a4a2a', K='#3a2614')
@make(70, 'B', '눈알 병', '초록 물에 잠긴 눈알들 · 코르크 마개')
def f70(): return obj('eyejar'), M(GLASS, l='#4a8a40', L='#2a5a24', e='#f4ece0', i='#c8283a', k='#a8784a', K='#6a4a2a')
@make(80, 'B', '넋 병', '병 속에 갇힌 넋이 웃는다')
def f80():
    s = obj('souljar'); s.fx.update({(9, 3): '*', (11, 4): '*'})
    return s, M(GLASS, s='#8ad8f4', S='#3a7ab8', w='#14121a', k='#a8784a', K='#6a4a2a', **{'*': '#c8f0ff'})
@make(90, 'C', '넋불 등불', '푸른 넋불이 타는 쇠 등불')
def f90(): return obj('lantern'), M(IRON, s='#8ad8f4', S='#3a7ab8', w='#ffffff')
@make(100, 'A', '촛불 해골', '머리에 녹은 초를 꽂은 해골')
def f100(): return obj('skullcandle'), M(BONE, WAX, c='#e8e0d0', C='#b8ac94')
@make(110, 'D', '미라 손', '붕대로 감은 마른 손 · 끈에 묶였다')
def f110(): return obj('hand'), M(b='#d8ccb0', B='#a8987c', k='#6a4a2a', K='#3a2614')
@make(120, 'D', '용의 발톱', '쓰러진 용에게서 뽑은 발톱 셋 · 비늘 붙은 살')
def f120(): return obj('claw'), M(BONE, m='#4a8a48', M='#2a5a2a', k='#6a4a2a')
@make(130, 'B', '뛰는 심장', '은 접시 위에서 아직 뛰는 심장')
def f130():
    s = obj('heart'); s.fx.update({(3, 4): '*', (16, 5): '*'})
    return s, M(BLOOD, IRON, w='#ff9a9a', **{'*': '#ff4a5a'})
@make(140, 'C', '뼈 촛대', '등뼈로 세운 촛대 · 붉은 초')
def f140(): return obj('bonecandle'), M(BONE, WAX, IRON, c='#c8283a', C='#7a0a14')
@make(150, 'A', '리치 왕의 해골', '왕관 쓴 해골 · 눈구멍에 푸른 넋불 — 리치가 바치는 마지막 공물')
def f150():
    s = obj('lichskull'); s.fx.update({(2, 3): '*', (17, 3): '*', (4, 15): '~', (15, 15): '~'})
    return s, M(BONE, s='#5ad8f4', **{'7': '#f0c040', '*': '#8ad8f4', '~': '#3a7ab8'})
def icon(d):
    s, pal = d['fn']()
    return s.icon(pal)
from lvmap import from_job; from_job(G, 2)   # 2차 직업부터 쓰는 장비 → Lv50 · 60 … 200 (11-10 21:31)
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = [(icon(d).render(), str(d.get('lv', d.get('key')))) for d in FR + G]
    zoomsheet(out[:4], 'ofr_frames.png', z=12)
    zoomsheet(out[4:12], 'ofr_z1.png', z=9); zoomsheet(out[12:], 'ofr_z2.png', z=9)
    print(Counter(d['st'] for d in G))
