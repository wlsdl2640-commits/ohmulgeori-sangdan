from xbow import *
def build(hw=1.0, back=1.6, span=7.0, uc=5.0, un=-3.0, bracer_on=True, prodc=('h', 'g', 'G')):
    s = Sw(); s.fx = {}
    if bracer_on:
        band(s, 'grip', -10, -4, 2.4, lambda u, v, h: 'w' if v < 0 else 'V')
        for a in (-10, -7, -4):
            band(s, 'grip', a, a, 3.2, lambda u, v, h: 'W')
    band(s, 'blade', -8, int(uc), 1, lambda u, v, h: 'a' if v < 0 else ('c' if v > 0 else 'b'))
    for u in range(int(un), int(uc) + 1): P(s, 'head', u, 0, 'f')
    for u in range(int(uc) + 1, int(uc) + 5):
        h = 1 if u < uc + 4 else 0
        for v in range(-h, h + 1): P(s, 'head', u, v, 'x' if v <= 0 else 'X')
    for x, y, (u, v) in s.each():
        if (u + v) % 2 == 0 or abs(v) > span + 0.5 or abs(v) < 1.5: continue
        t = min(1.0, abs(v) / span); c = uc - back * t * t
        if abs(u - c) <= hw + 1e-6: s.put(x, y, 'guard', prodc[0] if u > c else prodc[2])
    for v in (-1, 0, 1): P(s, 'guard', int(un), v, 'G')
    string(s, uc - back - 0.2, span - 0.3, un)
    return s
if __name__ == '__main__':
    from zoomv import zoomsheet
    out = []
    pal = dict(BASE, s='#ffffff', h='#c8ccd4', g='#7a8290', G='#4a505c')
    for nm, kw in (('가는 활대', {}), ('조금 굵게', dict(hw=1.4)), ('덜 휨 · 넓게', dict(back=1.0, span=8.0)), ('팔찌 없음', dict(bracer_on=False))):
        s = build(**kw); out.append((s.icon(pal, fx=dict(s.fx)).render(), nm))
    zoomsheet(out, 'xbow_try.png', z=12)
