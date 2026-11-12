"""45° 눕힌 카드 그림 (카드 좌표로 그려 칸에 찍음) — 무늬 · 큰 그림 · 띠 안 그림."""
import cdt3, cprim as P, rot45, cdk2
from tilt import tilt
import tsuit3
I1, I2 = cdt3.IN1, cdt3.IN2
def put(s, px, ch, keep):
    for p in px:
        if p in keep: s.put(p[0], p[1], ch)
# ── 무늬 (F1 · F2) ──
def heart(s, keep=I1):
    for p, ch in tilt(["11.11", "13111", "11111", ".111.", "..1.."], cu=0, keep=keep).items(): s.put(p[0], p[1], ch)
def diamond(s, keep=I1):
    for p, ch in tilt(["..1..", ".131.", ".111.", "11111", ".111.", ".111.", "..1.."], cu=0, keep=keep).items(): s.put(p[0], p[1], ch)
def spade(s, keep=I1):
    h = set(tilt(["11.11", "11111", "11111", ".111.", "..1.."], cu=0).keys())
    body = {(19 - x + 1, 17 - y - 1) for (x, y) in h}
    st = tsuit3.axis_px(-0.6, -3.6)
    e = min(st, key=lambda p: p[0])
    px = body | st | {(e[0] - 1, e[1]), (e[0], e[1] + 1), (e[0] - 1, e[1] + 1)}
    hi = max(body, key=lambda p: (p[0] - p[1]))
    put(s, px, '1', keep); put(s, {(hi[0] - 1, hi[1] + 1)}, '3', keep)
def club(s, keep=I1):
    px = set()
    for (t, w) in ((2.5, 0.0), (-0.6, -2.37), (-0.6, 2.37)): px |= tsuit3.disc(*tsuit3.at(t, w), 1.35)
    px |= tsuit3.disc(*tsuit3.at(0.0, 0.0), 1.0)
    st = tsuit3.axis_px(-0.5, -4.0)
    e = min(st, key=lambda p: p[0])
    px |= st | {(e[0] - 1, e[1]), (e[0], e[1] + 1), (e[0] - 1, e[1] + 1)}
    put(s, px, '1', keep)
def star(s, keep=I2):
    for p, ch in tilt(["..1..", "..1..", "11311", ".111.", "11.11"], cu=0, keep=keep).items(): s.put(p[0], p[1], ch)
SUIT = {'heart': heart, 'diamond': diamond, 'spade': spade, 'club': club, 'star': star}
# ── 큰 그림 (F3) · 띠 안 그림 (F4) ──
def rs(s, key, keep):
    ox, oy, g = cdk2.ART[key]
    for p, ch in rot45.rotsprite(g, 10.0, 9.0, keep=keep).items(): s.put(p[0], p[1], ch)
def moon(s, keep=I1):
    put(s, keep, '0', keep)
    put(s, P.cover(lambda t, w: P.disc(1.0, -0.6, 3.1)(t, w) and not P.disc(2.1, 0.5, 2.6)(t, w), keep=keep), '7', keep)
    put(s, P.cover(lambda t, w: P.disc(1.0, -0.6, 3.1)(t, w) and not P.disc(2.1, 0.5, 2.6)(t, w) and not P.disc(1.25, -0.35, 2.65)(t, w), keep=keep), '9', keep)
    put(s, P.cover(lambda t, w: t <= -4.2 + (0.8 if -1 < w < 2 else 0) + (0.5 if -3.5 < w < -2 else 0), keep=keep), '8', keep)
    put(s, {(13, 4), (8, 5), (14, 8), (6, 9), (12, 11)}, '3', keep)
def key(s, keep=I2):
    put(s, keep, '0', keep)
    put(s, P.cover(P.anyof(P.ring(2.6, 0.0, 0.75, 1.75), P.rect(-4.3, 1.1, -0.45, 0.45), P.rect(-4.3, -3.4, 0.0, 1.9), P.rect(-2.7, -2.0, 0.0, 1.5)), keep=keep), '7', keep)
def joker(s, keep=I1):
    hatL = P.cover(P.anyof(P.tri((3.9, -2.9), (1.2, -2.2), (1.9, 0.3)), P.rect(0.9, 1.9, -2.0, 0.0)), keep=keep)
    hatR = {(18 - y, 18 - x) for (x, y) in hatL}
    put(s, hatL, '1', keep); put(s, hatR, '2', keep)
    put(s, P.mirror(P.cover(P.disc(4.0, -3.0, 0.7), keep=keep)), '6', keep)
    put(s, P.cover(P.disc(-0.1, 0.0, 2.0), keep=keep), '4', keep)
    put(s, P.mirror(P.cover(P.disc(0.45, -0.95, 0.5), keep=keep)), '9', keep)
    put(s, P.cover(lambda t, w: -1.15 <= t - 0.22 * w * w <= -0.55 and abs(w) <= 1.35, keep=keep), '7', keep)
    ruff = P.cover(lambda t, w: -3.3 <= t <= -2.2 and abs(w) <= 3.0, keep=keep)
    put(s, {p for p in ruff if (p[0] + p[1]) % 2}, '3', keep); put(s, {p for p in ruff if not (p[0] + p[1]) % 2}, '1', keep)
def skull(s, keep=I1):
    put(s, P.cover(P.anyof(P.disc(0.9, 0.0, 2.9), P.rect(-2.4, 0.6, -1.75, 1.75)), keep=keep), '1', keep)
    put(s, P.mirror(P.cover(P.disc(0.55, -1.3, 0.85), keep=keep)), '9', keep)
    put(s, P.cover(P.disc(-0.75, 0.0, 0.45), keep=keep), '9', keep)
    put(s, P.mirror(P.cover(lambda t, w: -2.4 <= t <= -1.7 and 0.55 <= abs(w) <= 0.85, keep=keep)), '9', keep)
def crown(s, keep=I2):
    put(s, P.cover(P.rect(-3.4, -1.7, -2.7, 2.7), keep=keep), '6', keep)
    put(s, P.cover(P.anyof(P.rect(-1.7, -0.4, -2.5, 2.5), P.tri((2.5, 0.0), (-0.5, -1.0), (-0.5, 1.0)), P.tri((1.6, -2.1), (-0.5, -2.6), (-0.5, -1.3)), P.tri((1.6, 2.1), (-0.5, 1.3), (-0.5, 2.6))), keep=keep), '7', keep)
    put(s, P.mirror(P.cover(P.disc(-1.05, -1.6, 0.42), keep=keep)) | P.cover(P.disc(-1.05, 0.0, 0.42), keep=keep), '3', keep)
ART = {'jack': lambda s, keep=I1: rs(s, 'jack', keep), 'queen': lambda s, keep=I1: rs(s, 'queen', keep), 'king': lambda s, keep=I2: rs(s, 'king', keep),
       'sun': lambda s, keep=I1: rs(s, 'sun', keep), 'gem': lambda s, keep=I2: rs(s, 'gem', keep), 'coins': lambda s, keep=I1: rs(s, 'coins', keep),
       'moon': moon, 'key': key, 'joker': joker, 'skull': skull, 'crown': crown}
