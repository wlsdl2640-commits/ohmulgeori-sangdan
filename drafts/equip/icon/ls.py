"""장검(기사 · 성기사) — 원형 시안 A~D + 16자루 (네 레벨 묶음마다 A · B · C · D 한 번씩).
축 x + y = 19 (g4d와 같음). 모든 부품이 축 위, 윤곽 축 대칭(sym_err).
틀
  날     u −1..17, 한 줄 3칸(|v| ≤ 1) — 글라디우스(5칸)보다 가늘고 길다. C는 밑동 5칸 → 3칸으로 좁아짐
  십자 코등이 u −3..−2 두 줄, |v| ≤ 5 (긴 막대) — B 끝이 칼끝 쪽으로 휨 · C 짧고 두꺼움 · D 끝이 뭉툭
  손잡이 u −10..−4 (한 손 반 길이), 한 줄 3칸
  자루 끝 3×3 (가운데 (3,16) = 축 위) + 꼭지 (1,18)
글자: 날 w b c B n f(홈) a(상감) · 코등이 h g G j J · 보석 z Z u · 손잡이 r q R k K · 자루 끝 p o x O Q y · 효과 1 2"""
import g4
g4.AX = 19
from g4 import Sw, UV
from g4d import region, edge_of
from wic import N
def P(s, part, u, v, ch):
    if (u + v) % 2 == 0: return
    s.put((u + v + 19) // 2, (v - u + 19) // 2, part, ch)
POM3 = ["hlm", "lmd", "mdD"]        # 3×3 자루 끝 (빛 왼쪽 위)
def pom3(s, cx, cy, roles, boss=None):
    for j, r in enumerate(POM3):
        for i, ch in enumerate(r): s.put(cx - 1 + i, cy - 1 + j, 'pommel', roles[ch])
    if boss: s.put(cx, cy, 'pommel', boss)
BALL = dict(h='p', l='o', m='x', d='O', D='Q')
def rbody(u, v): return 'r' if v < 0 else ('R' if v > 0 else 'q')
def gbody(u, v): return 'h' if v <= -3 else ('G' if v >= 3 else 'g')
STYLE = {'A': '기사 정석', 'B': '휜 날개 코등이', 'C': '실전 바스타드', 'D': '의장 금장'}

def frame(st, bmod=None, gem=False):
    s = Sw()
    W = lambda fn: (lambda u, v, h: bmod(u, v, h, fn(u, v, h))) if bmod else fn
    if st == 'A':
        hw = lambda u: 1 if u <= 15 else (1 if u == 16 else 0)          # 네모 모서리 끝(전통 작은 칼끝)
        def bl(u, v, h):
            if v == 0 and 0 <= u <= 12: return 'f'
            return 'w' if v < 0 else ('B' if v > 0 else 'c')
        region(s, 'blade', lambda u, v: -1 <= u <= 17 and abs(v) <= hw(u), lambda u, v: W(bl)(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-2, -3) and abs(v) <= 5,
               lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 5 or (u == -3 and abs(v) == 4) else gbody(u, v))
        region(s, 'grip', lambda u, v: -10 <= u <= -4 and abs(v) <= 1,
               lambda u, v: ('k' if v <= 0 else 'K') if (u - v) % 4 in (0, 1) else rbody(u, v))
        pom3(s, 3, 16, BALL, boss='y')
    elif st == 'B':
        hw = lambda u: 1 if u <= 14 else (0 if u in (15, 17) else -1)  # 뾰족한 끝
        def bl(u, v, h):
            if v == 0 and 0 <= u <= 12: return 'f'
            return 'w' if v < 0 else ('B' if v > 0 else 'c')
        region(s, 'blade', lambda u, v: -1 <= u <= 17 and abs(v) <= hw(u), lambda u, v: W(bl)(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-2, -3) and abs(v) <= 4, gbody)
        for (u, v, ch) in [(-2, -5, 'j'), (-1, -6, 'j'), (-2, 5, 'J'), (-1, 6, 'J')]: P(s, 'guard', u, v, ch)   # 칼끝 쪽으로 휜 끝
        region(s, 'grip', lambda u, v: -10 <= u <= -4 and abs(v) <= 1,
               lambda u, v: ('k' if v <= 0 else 'K') if u % 2 == 0 else rbody(u, v))   # 철사 감기 (가로 줄)
        pom3(s, 3, 16, BALL, boss='y')
    elif st == 'C':
        hw = lambda u: 2 if u <= 4 else (1 if u <= 15 else (1 if u == 16 else 0))
        def bl(u, v, h):
            e = edge_of(v, h)
            if v < 0: return 'w' if e else 'b'
            if v > 0: return 'n' if (e and h >= 2) else 'B'
            return 'c'
        region(s, 'blade', lambda u, v: -1 <= u <= 17 and abs(v) <= hw(u), lambda u, v: W(bl)(u, v, hw(u)))
        region(s, 'guard', lambda u, v: (u in (-2, -3) and abs(v) <= 4) or (u == -1 and abs(v) <= 1), gbody)
        region(s, 'grip', lambda u, v: -10 <= u <= -5 and abs(v) <= 1,
               lambda u, v: ('k' if v <= 0 else 'K') if (u + v) % 4 in (0, 1) else rbody(u, v))
        pom3(s, 3, 16, dict(h='p', l='o', m='x', d='O', D='Q'))
        for (x, y) in ((2, 15), (4, 17)): s.put(x, y, 'pommel', 'Q' if x == 4 else 'o')   # 모난 자루 끝 (모서리 각)
    elif st == 'D':
        hw = lambda u: 1 if u <= 15 else (1 if u == 16 else 0)
        def bl(u, v, h):
            if v == 0 and 0 <= u <= 12: return 'a'
            return 'w' if v < 0 else ('B' if v > 0 else 'c')
        region(s, 'blade', lambda u, v: -1 <= u <= 17 and abs(v) <= hw(u), lambda u, v: W(bl)(u, v, hw(u)))
        region(s, 'guard', lambda u, v: u in (-2, -3) and abs(v) <= 5, lambda u, v: ('j' if v < 0 else 'J') if abs(v) >= 4 else gbody(u, v))
        for (u, v, ch) in [(-1, -4, 'j'), (-4, -5, 'j'), (-1, 4, 'J'), (-4, 5, 'J')]: P(s, 'guard', u, v, ch)   # 뭉툭한 두 끝
        region(s, 'grip', lambda u, v: -10 <= u <= -4 and abs(v) <= 1,
               lambda u, v: ('k' if v <= 0 else 'K') if u in (-6, -8) else rbody(u, v))
        pom3(s, 3, 16, BALL, boss='z')
    if gem:
        for (x, y), ch in (((8, 10), 'z'), ((9, 10), 'Z'), ((8, 11), 'Z'), ((9, 11), 'u')): s.put(x, y, 'guard', ch)
    return s

FR = []
def frm(key, desc):
    def deco(fn): FR.append(dict(key=key, name=f'시안 {key} · {STYLE[key]}', desc=desc, fn=fn)); return fn
    return deco
STEEL = dict(w='#ffffff', b='#d8e2ee', c='#eef4fc', f='#8f9db8', B='#a8b4c8', n='#566282')
@frm('A', '가는 곧은 날 가운데 홈 · 네모 끝. 곧은 십자 코등이 · 가죽 감은 손잡이 · 바퀴 자루 끝')
def fA():
    return frame('A'), dict(STEEL, h='#c8d0dc', g='#8e98a8', G='#58606e', j='#e8eef6', J='#7a8494',
                            r='#a8683e', q='#7e4826', R='#522c16', k='#c88a54', K='#6a3a1c',
                            p='#e8eef6', o='#b8c2d0', x='#8e98a8', O='#58606e', Q='#363c48', y='#58606e'), {}
@frm('B', '뾰족한 끝 · 가운데 홈. 코등이 두 끝이 칼끝 쪽으로 휜다 · 철사 감은 손잡이 · 둥근 자루 끝')
def fB():
    return frame('B'), dict(STEEL, h='#fff2a0', g='#e0b040', G='#9a7018', j='#fff6c0', J='#c89028',
                            r='#5a7ad8', q='#3a56a8', R='#22346a', k='#e8eef6', K='#8e98a8',
                            p='#fff6c0', o='#f0c850', x='#d8a030', O='#9a7018', Q='#5e420c', y='#c89028'), {}
@frm('C', '밑동이 넓고 끝으로 좁아지는 날 · 등줄. 짧고 두꺼운 코등이 · 긴 손잡이(한 손 반) · 모난 자루 끝')
def fC():
    return frame('C'), dict(w='#ffffff', b='#c4cede', c='#e4eaf4', B='#7c889e', n='#4e5870',
                            h='#9aa4b4', g='#646e7e', G='#3a424e', r='#4a3a34', q='#30241e', R='#1c1410', k='#6a564a', K='#2a1e18',
                            p='#d8dee8', o='#9aa4b4', x='#646e7e', O='#3a424e', Q='#22282f', y='#646e7e'), {}
@frm('D', '가운데 금 상감 홈 · 네모 끝. 두 끝이 뭉툭한 금 코등이 + 가운데 보석 · 금 고리 손잡이 · 보석 박은 자루 끝')
def fD():
    s = frame('D', gem=True)
    return s, dict(STEEL, a='#ffd860', h='#fff2a0', g='#f0c040', G='#b08018', j='#fff6c0', J='#c89028',
                   z='#9ad8ff', Z='#2a7ae0', u='#123a8a',
                   r='#f4f0e6', q='#d8ceb8', R='#a89a7c', k='#ffd860', K='#c08a20',
                   p='#fff6c0', o='#ffd860', x='#e8b030', O='#a87018', Q='#6a4410', y='#c08a20'), {}

# ───────── 16자루 ─────────
G = []
def make(lv, st, name, desc):
    def deco(fn): G.append(dict(lv=lv, st=st, name=name, desc=desc, fn=fn)); return fn
    return deco
@make(1, 'A', '견습 기사검', '갓 서약한 견습 기사의 칼. 무쇠 날 · 쇠 십자 · 갈색 가죽')
def l01():
    return frame('A'), dict(w='#eef0f2', b='#c8ccd2', c='#dfe2e6', f='#868c98', B='#9aa0aa', n='#555a66',
                            h='#a8acb4', g='#787c86', G='#4a4e58', j='#c8ccd2', J='#5e626c',
                            r='#a0683e', q='#784826', R='#4a2c16', k='#b88050', K='#5a341a',
                            p='#d0d4da', o='#a8acb4', x='#787c86', O='#4a4e58', Q='#2e3038', y='#4a4e58'), {}
@make(10, 'C', '성문 수비검', '성문을 지키는 칼. 넓은 밑동 · 검은 쇠 코등이 · 긴 검은 가죽 손잡이')
def l10():
    return frame('C'), dict(w='#ffffff', b='#c4cede', c='#e4eaf4', B='#7c889e', n='#4e5870',
                            h='#7a808c', g='#4e5460', G='#2c3038', r='#4a4a52', q='#2e2e36', R='#18181e', k='#6a6a74', K='#222228',
                            p='#c8ccd4', o='#8a909c', x='#5e6470', O='#3a3e48', Q='#202228', y='#5e6470'), {}
@make(20, 'B', '은빛 맹세검', '은 코등이 두 끝이 칼끝 쪽으로 휜다. 푸른 철사 손잡이 · 은 자루 끝')
def l20():
    return frame('B'), dict(STEEL, h='#ffffff', g='#d0d8e6', G='#8a94aa', j='#ffffff', J='#a8b2c6',
                            r='#5a7ad8', q='#3a56a8', R='#22346a', k='#e8eef6', K='#8e98a8',
                            p='#ffffff', o='#e0e6f0', x='#b8c2d4', O='#7a849a', Q='#4a5266', y='#a8b2c6'), {}
@make(30, 'D', '떡갈잎 기사검', '청동 상감 홈 · 두 끝 뭉툭한 청동 코등이에 초록 보석 · 초록 칠 손잡이')
def l30():
    return frame('D', gem=True), dict(STEEL, a='#e0a850', h='#f8c878', g='#c88a3a', G='#7e5220', j='#ffd890', J='#a86a28',
                                      z='#b8f090', Z='#3aa040', u='#1a5a20',
                                      r='#4a9a3a', q='#2e7028', R='#1a4418', k='#e0a850', K='#a06a28',
                                      p='#ffe0a0', o='#e0a850', x='#c88a3a', O='#7e5220', Q='#4a3012', y='#a86a28'), {}
@make(40, 'C', '푸른 강철검', '파랗게 담금질한 강철 날. 은 코등이 · 남빛 가죽 긴 손잡이')
def l40():
    return frame('C'), dict(w='#e8f2ff', b='#8ab0e8', c='#b8d4f8', B='#4a72b8', n='#24407a',
                            h='#e0e6f0', g='#a8b2c6', G='#6a748a', r='#2e3e7a', q='#1e2a5a', R='#10183a', k='#4a5e9e', K='#141e44',
                            p='#ffffff', o='#c8d0e0', x='#a8b2c6', O='#6a748a', Q='#3e465a', y='#a8b2c6'), {}
@make(50, 'A', '붉은 매 기사검', '붉은 매 기사단의 칼. 금 십자 · 붉은 가죽 · 붉은 보석 바퀴')
def l50():
    return frame('A'), dict(STEEL, h='#fff2a0', g='#e0b040', G='#9a7018', j='#fff6c0', J='#c89028',
                            r='#d04a3a', q='#a02a24', R='#621618', k='#ff7a5a', K='#7a1a1a',
                            p='#fff6c0', o='#f0c850', x='#d8a030', O='#9a7018', Q='#5e420c', y='#e02a2a'), {}
@make(60, 'D', '서리 기사검', '서리 낀 옅은 하늘빛 날 · 은 코등이에 얼음빛 보석 · 흰 손잡이 은 고리')
def l60():
    return frame('D', gem=True), dict(w='#ffffff', b='#d8f4ff', c='#f0fbff', B='#9ccae8', n='#4e86b8', a='#ffffff',
                                      h='#ffffff', g='#c8d4e4', G='#8090ac', j='#ffffff', J='#a0aec6',
                                      z='#e8fcff', Z='#7ad4f8', u='#2a7ab8',
                                      r='#f8fbff', q='#d8e2ee', R='#a0aec4', k='#c8d4e4', K='#8090ac',
                                      p='#ffffff', o='#e0e8f2', x='#c8d4e4', O='#8090ac', Q='#4e5a74', y='#7ad4f8'), {}
@make(70, 'B', '황금 문장검', '기사 가문의 칼. 금 코등이 휜 끝 · 흰 가죽 철사 손잡이 · 금 자루 끝')
def l70():
    return frame('B'), dict(STEEL, h='#fffbd0', g='#ffd040', G='#b88a18', j='#fffbd0', J='#e0a020',
                            r='#f8f2e4', q='#d8ccb0', R='#a89878', k='#ffd040', K='#b88a18',
                            p='#fffbd0', o='#ffe070', x='#ffd040', O='#b88a18', Q='#6e5210', y='#e0a020'), {}
@make(80, 'C', '흑철 기사검', '검게 그을린 넓은 밑동 날에 밝은 날 끝. 검은 코등이 · 금 꼭지')
def l80():
    return frame('C'), dict(w='#ffffff', b='#5a5e6a', c='#7a7e8c', B='#34363e', n='#c8ccd6',
                            h='#5a5664', g='#383440', G='#201e26', r='#2e2a30', q='#1e1a20', R='#100e12', k='#4a4450', K='#141216',
                            p='#ffe890', o='#5a5664', x='#383440', O='#201e26', Q='#100e12', y='#ffd040'), {}
@make(90, 'D', '용비늘 장검', '초록빛 담금질 날 · 금 코등이에 에메랄드 · 비늘무늬 초록 손잡이')
def l90():
    return frame('D', gem=True), dict(w='#f4fff0', b='#c8ecc0', c='#e6f8e0', B='#84b880', n='#3e6e44', a='#ffd860',
                                      h='#fff2a0', g='#f0c040', G='#b08018', j='#fff6c0', J='#c89028',
                                      z='#c8ffb0', Z='#3ac04a', u='#126a22',
                                      r='#5ab848', q='#3a8a30', R='#1e5a1e', k='#a8f070', K='#2a6a24',
                                      p='#fff6c0', o='#ffd860', x='#e8b030', O='#a87018', Q='#6a4410', y='#3ac04a'), {}
@make(100, 'A', '왕실 근위검', '왕을 지키는 근위 기사의 칼. 금 십자 · 보라 가죽 · 금 바퀴')
def l100():
    return frame('A'), dict(STEEL, h='#fff2a0', g='#f0c040', G='#b08018', j='#fffbd0', J='#d8a020',
                            r='#8a4ac8', q='#64309a', R='#3e1a64', k='#c88af0', K='#4a2070',
                            p='#fffbd0', o='#ffd860', x='#f0c040', O='#b08018', Q='#6a4a10', y='#8a4ac8'), {}
@make(110, 'B', '폭풍 기사검', '먹구름빛 날에 청록 번개빛 홈 · 은 코등이 휜 끝 · 청록 철사 손잡이')
def l110():
    return frame('B'), dict(w='#e8f2f8', b='#9aa8b8', c='#c4d0dc', f='#5ae0d8', B='#6a7888', n='#3a4656',
                            h='#e0e6f0', g='#a8b2c6', G='#6a748a', j='#ffffff', J='#8a94aa',
                            r='#2a8a8a', q='#1a6262', R='#0e3a3e', k='#5ae0d8', K='#124444',
                            p='#ffffff', o='#c8d0e0', x='#a8b2c6', O='#6a748a', Q='#3e465a', y='#5ae0d8'), {}
@make(120, 'A', '노을 맹세검', '저녁놀빛 날 · 구리 십자 · 주황 가죽 · 구리 바퀴')
def l120():
    return frame('A'), dict(w='#fff4ec', b='#f4cdb8', c='#fbe4d6', f='#c88a76', B='#d8a690', n='#8a5244',
                            h='#ffc89a', g='#d88a54', G='#8e4e2a', j='#ffe0c0', J='#b0663a',
                            r='#f08a3a', q='#c05e1e', R='#7a3610', k='#ffc070', K='#8a3e12',
                            p='#ffe0c0', o='#f0a870', x='#d88a54', O='#8e4e2a', Q='#562c14', y='#b0663a'), {}
@make(130, 'B', '달빛 장검', '은보랏빛 날 · 은 코등이 휜 끝 · 짙은 보라 철사 손잡이 · 월장석 자루 끝')
def l130():
    return frame('B'), dict(w='#ffffff', b='#e4dcf8', c='#f4f0ff', f='#9a8cc8', B='#b4a8dc', n='#5e5290',
                            h='#ffffff', g='#d0d4e6', G='#8a8ea8', j='#ffffff', J='#a8acc4',
                            r='#5a3a9a', q='#3e2470', R='#241444', k='#c8b8f0', K='#6a5aa0',
                            p='#ffffff', o='#e8e4fa', x='#c8c0ec', O='#8a80b8', Q='#544a80', y='#a8acc4'), {}
@make(140, 'C', '극광 기사검', '밤하늘 오로라처럼 청록 · 보랏빛이 흐르는 날 · 은 코등이 · 청록 손잡이')
def l140():
    def aur(u, v, h, ch):
        if ch in 'bc': return 'b' if u < 6 else ('c' if u < 11 else 'b')
        return ch
    return frame('C', bmod=aur), dict(w='#e8fff8', b='#5ad8b8', c='#9a8af0', B='#3a5a9a', n='#b080f0',
                                      h='#e0e6f0', g='#a8b2c6', G='#6a748a', r='#2a8a7a', q='#1a6256', R='#0e3a34', k='#9a8af0', K='#2a2a6a',
                                      p='#ffffff', o='#c8d0e0', x='#a8b2c6', O='#6a748a', Q='#3e465a', y='#9a8af0'), {}
@make(150, 'D', '영원의 맹세', '성기사의 마지막 서약. 흰 강철 날 금 상감 · 흰 금 코등이에 사파이어 · 빛이 감돈다')
def l150():
    fx = {(3, 4): '1', (15, 14): '1', (12, 2): '2', (16, 10): '2', (5, 7): '2'}
    return frame('D', gem=True), dict(w='#ffffff', b='#f4f8ff', c='#ffffff', B='#c8d4ea', n='#7a88a8', a='#ffd860',
                                      h='#fffbe8', g='#ffe8a0', G='#d8b050', j='#ffffff', J='#e0c070',
                                      z='#c8ecff', Z='#2a7ae0', u='#123a8a',
                                      r='#fffaf0', q='#e8dcc4', R='#b8a888', k='#ffd860', K='#c08a20',
                                      p='#ffffff', o='#ffe8a0', x='#ffd860', O='#c08a20', Q='#7a5410', y='#ffd860',
                                      **{'1': '#ffffff', '2': '#fff0a0'}), dict(fx=fx)

def icon(d):
    s, pal, extra = d['fn']()
    return s, s.icon(pal, fx=extra.get('fx'))
if __name__ == '__main__':
    from zoomv import zoomsheet
    from collections import Counter
    out = []
    for d in FR + G:
        s, ic = icon(d)
        e = s.sym_err()
        if e: print(d.get('lv', d.get('key')), 'sym err', e)
        out.append((ic.render(), str(d.get('lv', d.get('key')))))
    zoomsheet(out[:4], 'ls_frames.png', z=12)
    zoomsheet(out[4:12], 'ls_z1.png', z=9)
    zoomsheet(out[12:], 'ls_z2.png', z=9)
    print(Counter(d['st'] for d in G))
