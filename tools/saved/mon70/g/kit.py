"""빌드 70 시안 공용 (천계의 유적 폐허 · 별의 정원 · 보물 던전 16마리): cv · blunt · puffs + 시안 모음 Batch
Batch.add(key, 이름, 설명, [서 있기0, 서 있기1?], 팔레트, sh, ax, hip, gm={몸 이름: Cv}, pad=떠 있는 빈 줄, **덧붙임)
→ ../t/<이름>.json = { defs: {key: PXU 항목 + act · mon · label · desc · field · area · show}, extra: 무기 JS }"""
import json, sys, math, pathlib
from cv import Cv, ell, poly, path, box, cap, blunt, frames, thin, thins, rbox, overlay, hem, wing, scallop, bone_cells
from cloud import puffs

T = pathlib.Path(__file__).resolve().parent.parent / 't'


class Batch:
    def __init__(s, name, base, act, field, area='field', show=None, **dflt):
        s.name, s.base, s.act, s.field, s.area, s.show, s.dflt, s.D, s.extra = name, base, act, field, area, show or [], dflt, {}, ''

    def add(s, key, lab, desc, fr, pal, sh, ax, hip=99, gm=None, pad=0, show=None, act=None, **extra):
        fr = fr if isinstance(fr, (list, tuple)) else [fr]
        gm = gm or {}
        outs, top = frames(list(fr) + list(gm.values()), 0, pad)
        e = dict(g=outs[0], pal=pal, sh=[int(round(sh[0])), int(round(sh[1] - top))], hip=int(round(hip - top)) if hip < 99 else 99, ax=int(round(ax)))
        if len(fr) > 1: e['g2'] = outs[1]
        if gm: e['gm'] = {k: outs[len(fr) + i] for i, k in enumerate(gm)}
        e.update(s.dflt); e.update(extra)
        e.update(act=act or s.act, mon={'base': s.base}, label=lab, desc=desc, field=s.field, area=s.area, show=show or s.show)
        s.D[key] = e
        return e

    def dump(s):
        out = T / (s.name + '.json')
        json.dump({'defs': s.D, 'extra': s.extra}, open(out, 'w'), ensure_ascii=False)
        print('ok', out.name, list(s.D))


def head_js(name, pic, note, L=6.0, shaft='G', below=2.5, fxw='staff'):
    """지팡이 · 창 머리 그림(작은 글자 그림, 위가 끝) → PXU_WPN 함수 (빌드 59 emperor1.py와 같은 길)"""
    rows = pic.strip('\n').split('\n'); H = len(rows); W = max(len(r) for r in rows); cx = (W - 1) / 2; cells = []
    for i, r in enumerate(rows):
        for j, ch in enumerate(r):
            if ch not in '. ': cells.append((round(L + 0.5 + (H - 1 - i), 2), round(j - cx, 2), ch))
    arr = ','.join(f"[{t},{s},'{ch}']" for t, s, ch in cells)
    return (f"// {note}\nPXU_WPN.{name} = (F, d) => {{ const [hx, hy] = pxsMHand(F), [dx, dy] = pxsDir(F.a || 0), px = -dy, py = dx, out = [], k = (d && d.ms) || 1, L = {L} * k, o = L - {L};\n"
            f"  const at = (t, s, ch) => out.push([hx + 0.5 + dx * t + px * s, hy + 0.5 + dy * t + py * s, ch]);\n"
            f"  for (let t = -{below}; t <= L; t += 0.5) at(t, 0, t < -{below} + 0.6 ? 'g' : '{shaft}');\n"
            f"  for (const [t, s, ch] of [{arr}]) for (const e of [-0.25, 0.25]) for (const f of [-0.25, 0.25]) at(t + o + e, s + f, ch);\n"
            f"  return out; }};\nPXU_FXW.{name} = '{fxw}';\n")


def eyes(c, pts, ch='E', w=2):
    """눈: 굵은 픽셀에서 읽히게 가로 w칸"""
    for (x, y) in pts: c.fill(box(x, y, x + w - 1, y), ch)
