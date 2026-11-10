"""채찍 — 마부 · 코네스토가 · 캐러밴마스터 무기 (11-11 00:34 사용자) · 화면 좌표로 그린다(끈은 부드러운 곡선).
손잡이는 칼과 같은 축(왼쪽 아래 → 오른쪽 위) 위 · 끈은 손잡이 끝에서 곡선으로 굽이치며 가늘어지고 끝끈 · 술(효과 층, 테두리 없음)로 끝난다.
글자: 손잡이 k K · 자루 끝 o O · 쇠 h g G · 끈 a b c(빛 · 몸 · 그늘) · 끝끈 f · 술 w · 가시 t T · 사슬 l L · 보석 r R · 효과 1 2"""
import math
from wic import Ico, N
def cr(pts, n=24):
    """캣멀-롬: 점들을 지나는 부드러운 곡선 표본"""
    P = [pts[0]] + list(pts) + [pts[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(pts[-1]); return out
def stroke(ic, pts, w0, w1, role, layer='body', keep=False):
    """굵은 곡선: 표본마다 반지름 w(t). role(t, side) — side < 0 = 왼쪽 위(빛)"""
    S = cr(pts); L = getattr(ic, layer); n = len(S)
    for y in range(N):
        for x in range(N):
            px, py = x + .5, y + .5; best = (1e9, 0, 0)
            for i, (sx, sy) in enumerate(S):
                d = math.hypot(px - sx, py - sy)
                if d < best[0]: best = (d, i, (px - sx) + (py - sy))
            d, i, side = best; t = i / (n - 1); w = w0 + (w1 - w0) * t
            if d <= w + 1e-6 and (not keep or (x, y) not in L):
                ch = role(t, side, w)
                if ch: L[(x, y)] = ch
def line(ic, pts, ch, skip_body=True):
    """한 칸 곡선 (효과 층)"""
    S = cr(pts, 40); seen = set()
    for (sx, sy) in S:
        x, y = int(math.floor(sx)), int(math.floor(sy))
        if (x, y) in seen or not (0 <= x < N and 0 <= y < N): continue
        seen.add((x, y))
        if skip_body and (x, y) in ic.body: continue
        ic.fx[(x, y)] = ch
def shade(c):
    return lambda t, side, w: c[0] if side < -w * 0.25 else (c[2] if side > w * 0.35 else c[1])
def handle(ic, a=(2.6, 17.4), b=(7.0, 13.0), w=1.45, chs=('k', 'K'), knob=('o', 'O'), ferrule='hgG', wrap=True):
    """손잡이: 축 위 곧은 막대 · 감은 무늬 · 자루 끝 혹 · 이음 쇠"""
    def role(t, side, ww):
        k = int(t * 9)
        if t > 0.86: return ferrule[0] if side < -0.3 else (ferrule[2] if side > 0.4 else ferrule[1])
        if wrap and k % 2: return chs[1]
        return chs[0] if side < 0.4 else chs[1]
    stroke(ic, [a, b], w, w, role)
    ic.body[(int(a[0]) - 1, int(a[1]))] = knob[1]; ic.body[(int(a[0]), int(a[1]))] = knob[0]; ic.body[(int(a[0]) - 1, int(a[1]) - 1)] = knob[0]; ic.body[(int(a[0]), int(a[1]) + 1)] = knob[1]
FR = []
def frm(key, name, desc):
    def deco(fn): FR.append(dict(key=key, name=name, desc=desc, fn=fn)); return fn
    return deco
BASE = dict(k='#8a5a34', K='#4a2e18', o='#c8946a', O='#7a5232', h='#e8eef6', g='#a8b0bc', G='#5a6270', a='#d8a878', b='#9a6a40', c='#5a3a1e',
            f='#e8d0a8', w='#ffffff', t='#f0e8d8', T='#a89c88', l='#e8eef6', L='#7a8290', r='#ff5a5a', R='#a81a2a', **{'1': '#ffffff', '2': '#ffd860'})
# 끈 길: 손잡이 끝(7, 13)에서 시작 — 원형마다 다른 곡선
PATH_A = [(7.6, 12.4), (10.5, 10.6), (12.6, 12.6), (14.6, 13.0), (16.4, 10.2), (15.2, 6.6), (12.6, 5.2), (11.8, 3.0), (14.2, 1.8), (16.6, 2.6)]
@frm('A', '가죽 채찍', '꼰 가죽 끈이 손잡이 앞에서 크게 굽이쳐 돌아간다 · 감은 가죽 손잡이 · 끝에 흰 술(딱 소리를 내는 끝)')
def wA():
    ic = Ico(dict(BASE, k='#4a3020', K='#24160c'))
    handle(ic)
    stroke(ic, PATH_A[:8], 1.15, 0.5, shade('abc'))
    line(ic, PATH_A[7:], 'f')
    ic.fx[(16, 2)] = 'w'; ic.fx[(17, 3)] = 'w'
    return ic
@frm('B', '마부 채찍', '길고 곧은 나무 막대 · 끝에서 가는 끈이 갈고리처럼 말려 내려온다 — 말을 모는 채찍')
def wB():
    ic = Ico(dict(BASE, a='#e8c890', b='#b08a52', c='#6a5030', k='#3a2a1a', K='#1e140c'))
    handle(ic, (2.6, 17.4), (5.8, 14.2))
    stroke(ic, [(5.8, 14.2), (14.6, 5.4)], 0.9, 0.62, shade('abc'))
    line(ic, [(14.6, 5.4), (16.2, 3.0), (17.6, 2.6), (18.2, 4.2), (17.4, 6.8), (16.0, 9.0), (15.6, 11.4)], 'f')
    ic.fx[(15, 11)] = 'w'; ic.fx[(15, 12)] = 'w'
    return ic
@frm('C', '쇠사슬 채찍', '감은 손잡이 · 쇠 고리를 이은 사슬이 활꼴로 굽이친다 · 끝에 쇠 날')
def wC():
    ic = Ico(dict(BASE, k='#3a3a44', K='#1e1e26', o='#a8b0bc', O='#5a6270'))
    handle(ic)
    path = [(7.6, 12.4), (10.2, 9.8), (12.0, 10.6), (14.4, 10.2), (15.6, 7.4), (15.0, 4.6)]
    S = cr(path, 40); acc = 0.0; k = 0; last = S[0]
    for (sx, sy) in S:                                                          # 사슬 고리: 1.7픽셀마다 · 밝은 고리(두 칸) · 어두운 고리(한 칸) 번갈아
        acc += math.hypot(sx - last[0], sy - last[1]); last = (sx, sy)
        if acc < 1.7: continue
        acc = 0.0; k += 1; x, y = int(math.floor(sx)), int(math.floor(sy))
        if k % 2: ic.body[(x, y)] = 'l'; ic.body.setdefault((x, y + 1), 'L')
        else: ic.body[(x, y)] = 'L'
    for (x, y, ch) in ((15, 3, 'h'), (14, 2, 'h'), (16, 2, 'g'), (15, 1, 'h'), (15, 2, 'g'), (16, 3, 'G')): ic.body[(x, y)] = ch   # 끝 날
    return ic
@frm('D', '가시 채찍', '검붉은 덩굴 끈에 흰 가시가 엇갈려 돋았다 · 검은 나무 손잡이 · 붉은 보석 자루 끝')
def wD():
    ic = Ico(dict(BASE, a='#c8424a', b='#7a1a26', c='#3e0c14', k='#2a1e1e', K='#140e0e', o='#ff6a6a', O='#a81a2a', f='#a8323a'))
    handle(ic)
    path = [(7.6, 12.4), (11.0, 9.4), (13.6, 11.4), (16.2, 10.8), (16.4, 7.2), (14.4, 4.4), (16.0, 2.4)]
    stroke(ic, path, 0.85, 0.45, shade('abc'))
    S = cr(path, 24)
    for k, i in enumerate(range(8, len(S) - 4, 10)):                           # 가시: 끈 바깥으로 엇갈려
        (x0, y0), (x1, y1) = S[i], S[min(i + 2, len(S) - 1)]
        tx, ty = x1 - x0, y1 - y0; L = math.hypot(tx, ty) or 1; nx, ny = -ty / L, tx / L
        sg = 1 if k % 2 else -1
        x, y = int(math.floor(x0 + sg * nx * 1.6)), int(math.floor(y0 + sg * ny * 1.6))
        if (x, y) not in ic.body: ic.body[(x, y)] = 't' if sg < 0 else 'T'
    return ic
def icon(d): return d['fn']()
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = [(icon(d).render(), '채찍 ' + d['key']) for d in FR]
    zoomsheet(out, 'whip2_z.png', z=12)
