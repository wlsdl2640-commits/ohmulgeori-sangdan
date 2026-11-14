"""해룡 몬스터 · 새끼 펫 시안 (빌드 69, 11-14 13:45 사용자 「해룡도 몬스터로 구상해서 알로 얻을 수 있게 · 펫을 30LV까지 키워서 해룡기수로」) — 게임에 아직 안 넣음.
- 몬스터: 탈것 해룡(seadragon.py)과 같은 몸에서 안장 · 가슴 끈을 뺀 야생 해룡. 모습 넷(A 산호 · B 해초 · C 심해 · D 진주) = 몬스터 모습(PXU_SKIN)으로 —
  알은 그 모습을 이어받는다(제안). 장: idle0 · idle1 · bite(물기) · swell(뿜기 준비) · spit(물 뿜기). 발 밑에 빈 줄을 두어 떠 있게.
- 새끼 펫: 머리가 큰 아기 해마 용 (큰 눈 · 작은 뿔 싹 · 짧은 몸 · 말린 꼬리 · 작은 지느러미). 장 idle0 · idle1.
python3 seadragon_mon.py <출력.json>  → {monA: {g, g2, gm: {bite, swell, spit}, pal, ax, sh, hip, label}, …, petA: {g, g2, pal, ax}, …}"""
import json, math, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ride65', 'g'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cv import Cv, ell, poly, path, thin, frames   # noqa: E402
from blunt import blunt                            # noqa: E402
import seadragon as SD                             # noqa: E402

PAD = 4   # 발 밑 빈 줄 (떠 있음)


def mon(key):
    S, pal, lab, desc = SD.LOOKS[key]
    W = dict(S, wild=1)
    fs = {fr: SD.seahorse(W, fr)[0] for fr in ('idle0', 'idle1', 'bite', 'swell', 'spit')}
    outs, top = frames(list(fs.values()), pad_bottom=PAD)
    o = dict(zip(fs, outs))
    # 입 자리(효과가 나가는 칸): 물기 장의 입 안(K) 가운데
    rows = [r for r in o['bite'].split('\n') if r]
    ks = [(x, y) for y, r in enumerate(rows) for x, ch in enumerate(r) if ch == 'K' and x > len(r) * 0.6]
    sh = [round(sum(p[0] for p in ks) / len(ks)), round(sum(p[1] for p in ks) / len(ks))] if ks else [40, 8]
    return {'g': o['idle0'], 'g2': o['idle1'], 'gm': {'bite': o['bite'], 'swell': o['swell'], 'spit': o['spit']},
            'pal': pal, 'ax': S.get('ax', 21), 'sh': sh, 'hip': 22, 'label': lab.replace('시안 ', '') + ' (야생)', 'desc': desc}


def baby(key, fr):
    S, pal, lab, desc = SD.LOOKS[key]; FIN, FIN2 = S.get('finch', ('F', 'f'))
    c = Cv(26, 26); b = 0.6 if fr == 'idle1' else 0.0; fin = 1 if fr == 'idle1' else 0
    T = lambda p: (p[0], p[1] - b)
    # 꼬리 (몸 밑에서 앞으로 한 바퀴)
    sp = [(11.4 + math.cos(math.radians(a)) * r, 20.0 + math.sin(math.radians(a)) * r) for a, r in ((180, 2.8), (230, 2.8), (280, 2.7), (330, 2.5), (380, 2.2), (430, 1.8), (480, 1.2))]
    c.fill(path([T((9.2, 15.6)), T((8.6, 18.4))], 1.6, 1.3), 'C'); c.fill(path([T(q) for q in sp], 1.2, 0.6), 'C')
    # 등 지느러미 (작은 부채) · 몸
    c.fill(poly([T((8.0, 10.8)), T((4.8 - fin * 0.4, 10.6)), T((4.6 - fin * 0.4, 13.6)), T((7.6, 14.6))]), FIN)
    c.fill(SD.rell(T((9.4, 13.2)), 3.0, 3.6, 0.3), 'C')
    # 머리 (크게) · 짧은 주둥이
    c.fill(ell(*T((12.6, 7.2)), 4.2, 3.6), 'C')
    c.fill(poly([T(p) for p in [(15.0, 6.0), (18.4, 6.8), (18.8, 8.4), (17.8, 9.6), (14.6, 9.8)]]), 'C')
    blunt(c.g, 'C', 'Q', 'c', bottom=1, side=1, top=1)
    # 배 마디
    for (x, y) in SD.rell(T((9.4, 13.2)), 3.0, 3.6, 0.3):
        xs = [q[0] for q in SD.rell(T((9.4, 13.2)), 3.0, 3.6, 0.3) if q[1] == y]
        if xs and x >= max(xs) - 1 and c.get(x, y) in 'CQc': c.set(x, y, 'A' if y % 2 == 0 else 'a')
    # 뿔 싹 · 뺨 지느러미
    for (a, bb, ch) in (((11.0, 3.8), (9.4, 2.0), 'Z'), ((12.8, 3.6), (12.0, 1.8), 'z')):
        c.fill(path([T(a), T(bb)], 0.7, 0.45), ch)
    for (x, y) in SD.leaf(T((10.2, 8.4)), T((7.2 - fin * 0.3, 9.8)), 1.0):
        if c.get(x, y) in '.CQc': c.set(x, y, FIN)
    # 큰 눈 (2×2 + 빛) · 콧구멍 · 입
    ex, ey = 13, round(6.2 - b)
    for (dx, dy) in ((0, 0), (1, 0), (0, 1), (1, 1)): c.set(ex + dx, ey + dy, 'K')
    c.set(ex, ey, 'w')
    c.set(17, round(7.2 - b), 'K'); c.set(16, round(9.0 - b), 'K'); c.set(17, round(9.0 - b), 'K')
    if S.get('post') is SD.pearl_post: c.set(11, round(4.2 - b), 'P')
    if S.get('post') is SD.glow_post:
        for (x, y) in ((8, 12), (10, 15), (12, 22)):
            if c.get(x, round(y - b)) in 'CQcAa': c.set(x, round(y - b), 'L')
    if S.get('hornfx') is SD.coral_horns: c.set(10, round(1.4 - b), 'z')
    return c


def pet(key):
    S, pal, lab, desc = SD.LOOKS[key]
    outs, top = frames([baby(key, 'idle0'), baby(key, 'idle1')], pad_bottom=1)
    return {'g': outs[0], 'g2': outs[1], 'pal': pal, 'ax': 10, 'label': '새끼 ' + lab.replace('시안 ', '')[2:]}


if __name__ == '__main__':
    out = {}
    for L in 'ABCD':
        out['mon' + L] = mon('sea' + L)
        out['pet' + L] = pet('sea' + L)
    json.dump(out, open(sys.argv[1], 'w'), ensure_ascii=False, indent=0)
    print(out['monA']['gm']['bite']); print(out['petA']['g']); print(out['monA']['sh'])
