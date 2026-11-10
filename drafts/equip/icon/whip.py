"""채찍 — 마부 · 코네스토가 · 캐러밴마스터 무기 (11-11 00:34 사용자). 칼과 같은 축(x + y = 19): 손잡이가 왼쪽 아래, 끈이 오른쪽 위로.
손잡이(감은 가죽 · 자루 끝 혹) → 이음 쇠 → 끈(굵게 시작해 가늘어지며 S자로 굽이친다) → 끝끈 · 딱총 술(밝은 끝).
글자: 손잡이 k K · 자루 끝 o O · 쇠 h g G · 끈 a b c(빛 · 몸 · 그늘) · 끝끈 f · 술 w · 가시 t T · 사슬 l L · 효과 1 2"""
import math
from g4 import Sw
from bow import P
def handle(s, u0=-13, u1=-6, chs=('k', 'K'), knob=('o', 'O'), ferrule=('h', 'g', 'G'), diamond=True):
    """손잡이: 축 위 |v| ≤ 1 · 감은 무늬(마름모) · 끝에 혹 · 앞에 이음 쇠"""
    for u in range(u0 + 2, u1):
        for v in (-1, 0, 1):
            ch = chs[0] if (diamond and (u + v // 1) % 4 in (0, 1)) or (not diamond and v < 0) else chs[1]
            P(s, 'grip', u, v, ch)
    for u in (u0, u0 + 1):                                                    # 자루 끝 혹 (조금 넓게)
        for v in (-2, -1, 0, 1, 2):
            if abs(v) <= (2 if u == u0 + 1 else 1): P(s, 'pommel', u, v, knob[0] if v < 0 else knob[1])
    for v in (-1, 0, 1): P(s, 'guard', u1, v, ferrule[0] if v < 0 else (ferrule[2] if v > 0 else ferrule[1]))
def curve(u, amp=2.6, per=15.0, ph=0.0):
    """끈 가운데 줄 v(u): S자"""
    return amp * math.sin((u + ph) / per * 2 * math.pi)
def thong(s, u0=-5, u1=12, amp=2.6, per=15.0, ph=0.0, w0=1.3, w1=0.0, chs='abc', braid=True, thorns=None, links=None):
    """끈: u0 → u1, 굵기 w0 → w1, 가운데 줄 curve. braid면 두 칸마다 빛 · 그늘이 엇갈린다 (꼰 가죽)"""
    for x in range(20):
        for y in range(20):
            u, v = x - y, x + y - 19
            if not (u0 <= u <= u1): continue
            t = (u - u0) / float(u1 - u0); w = w0 + (w1 - w0) * t
            c = curve(u, amp, per, ph); off = v - c
            if abs(off) <= w + 0.55:
                if links:
                    ch = links[0] if (u // 2) % 2 else links[1]
                elif braid:
                    ch = chs[0] if off < -0.3 else (chs[2] if off > 0.3 else chs[1])
                    if (u + int(round(off))) % 3 == 0 and ch == chs[1]: ch = chs[2]
                else:
                    ch = chs[0] if off < -0.3 else (chs[2] if off > 0.3 else chs[1])
                s.put(x, y, 'blade', ch)
    if thorns:   # 가시: 끈 바깥으로 한 칸씩, 위아래 엇갈려
        for u in range(u0 + 2, u1 - 1, 3):
            c = curve(u, amp, per, ph); sg = 1 if (u // 3) % 2 else -1
            t = (u - u0) / float(u1 - u0); w = w0 + (w1 - w0) * t
            vv = int(round(c + sg * (w + 1.6)))
            for dv in (0, 1, -1):
                if (u + vv + dv) % 2: P(s, 'head', u, vv + dv, thorns[0] if sg < 0 else thorns[1]); break
def tip(s, u1, amp, per, ph, n=3, fall='f', tuft='w'):
    """끝끈(한 칸 줄) n칸 + 술 두 칸 (효과 층 — 테두리 없이 가늘게)"""
    pts = []
    for k in range(1, n + 1):
        u = u1 + k; v = int(round(curve(u, amp, per, ph)))
        for dv in (0, 1, -1):
            if (u + v + dv) % 2: pts.append((u, v + dv)); break
    for i, (u, v) in enumerate(pts):
        x, y = (u + v + 19) // 2, (v - u + 19) // 2
        if (x, y) not in s.part and 0 <= x < 20 and 0 <= y < 20: s.fx[(x, y)] = fall if i < len(pts) - 1 else tuft
    if pts:
        u, v = pts[-1]; x, y = (u + v + 19) // 2, (v - u + 19) // 2
        for (dx, dy) in ((1, 0), (0, -1)):
            q = (x + dx, y + dy)
            if q not in s.part and 0 <= q[0] < 20 and 0 <= q[1] < 20: s.fx[q] = tuft
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(k='#8a5a34', K='#5a3a1e', o='#a8743e', O='#6a4422', h='#e8eef6', g='#a8b0bc', G='#5a6270', a='#c8946a', b='#8a5a34', c='#5a3a1e',
            f='#e8d0a8', w='#ffffff', t='#e8e0d0', T='#a89c88', l='#c8ccd4', L='#6a7280', **{'1': '#ffffff', '2': '#ffd860'})
@frm('A', '가죽 채찍', '꼰 가죽 끈이 S자로 굽이친다 · 감은 가죽 손잡이 · 끝에 흰 술(딱 소리를 내는 끝)')
def wA():
    s = Sw(); s.fx = {}
    handle(s); thong(s, -5, 12, 2.4, 15.0); tip(s, 12, 2.4, 15.0, 0.0)
    return s, dict(BASE)
@frm('B', '마부 채찍', '길고 곧은 나무 막대 · 끝에 가는 끈이 갈고리처럼 말려 돌아온다 — 말을 모는 채찍')
def wB():
    s = Sw(); s.fx = {}
    handle(s, -13, -8)
    for u in range(-7, 8):                                                    # 막대: 축 위 한 줄 + 빛
        P(s, 'blade', u, 0, 'a' if u % 4 else 'b'); P(s, 'blade', u, -1, 'a') if False else None
    for u in range(-7, 8):
        for v in (-1, 0, 1):
            if (u + v) % 2 and abs(v) <= (1 if u < 0 else 0): P(s, 'blade', u, v, 'a' if v < 0 else ('c' if v > 0 else 'b'))
    # 끝끈: 막대 끝(u 8)에서 위로 더 갔다가 갈고리처럼 오른쪽 아래로 말려 돌아온다 (효과 한 칸 줄)
    path = [(9, 0), (10, -1), (11, 0), (12, 1), (12, 3), (11, 4), (10, 5), (9, 6), (8, 7)]
    for (u, v) in path:
        for dv in (0, 1, -1):
            if (u + v + dv) % 2:
                x, y = (u + v + dv + 19) // 2, (v + dv - u + 19) // 2
                if (x, y) not in s.part: s.fx[(x, y)] = 'f'
                break
    x, y = (8 + 7 + 19) // 2, (7 - 8 + 19) // 2; s.fx[(x, y)] = 'w'; s.fx[(x + 1, y)] = 'w'
    return s, dict(BASE, a='#d8b880', b='#a8844e', c='#6a5030', k='#3a2a1a', K='#1e140c')
@frm('C', '쇠사슬 채찍', '감은 손잡이 · 쇠 고리를 이은 사슬이 굽이친다 · 끝에 쇠 표창 날')
def wC():
    s = Sw(); s.fx = {}
    handle(s); thong(s, -5, 10, 2.2, 16.0, 0.0, 1.0, 0.6, links=('l', 'L'))
    c = curve(11, 2.2, 16.0)
    for k, hw in enumerate((1.0, 1.6, 1.0, 0.0)):                             # 끝 날: 마름모
        u = 11 + k
        for v in range(int(c - hw - 1), int(c + hw + 2)):
            if abs(v - c) <= hw + 0.4: P(s, 'head', u, v, 'h' if v < c else ('G' if v > c + 0.5 else 'g'))
    return s, dict(BASE, k='#3a3a44', K='#1e1e26', o='#a8b0bc', O='#5a6270')
@frm('D', '가시 채찍', '검붉은 덩굴 끈에 가시가 엇갈려 돋았다 · 검은 나무 손잡이 · 붉은 보석 자루 끝')
def wD():
    s = Sw(); s.fx = {}
    handle(s, knob=('o', 'O')); thong(s, -5, 12, 2.6, 14.0, 0.0, 1.2, 0.2, thorns=('t', 'T')); tip(s, 12, 2.6, 14.0, 0.0, 2, 'f', 'f')
    return s, dict(BASE, a='#a8323a', b='#6a1a22', c='#3a0c12', k='#2a1e1e', K='#140e0e', o='#ff5a5a', O='#a81a2a', t='#f0e0c8', T='#a89878', f='#a8323a')
def icon(d):
    s, pal = d['fn']()
    return s, s.icon(pal, fx=dict(s.fx))
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(icon(d)[1].render(), '채찍 ' + d['key']) for d in FR]
    zoomsheet(out, 'whip_z.png', z=12)
