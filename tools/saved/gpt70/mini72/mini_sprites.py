"""작은 굵은 도트 모험가 (11-22 05:32 사용자 「영상속 캐릭터들과 같은 방식으로 모험가를 디자인 해봐 움직임 모션도」)
   16×16 안팎 · 머리 큰 2등신 · 어두운 외곽선 · 색 5 ~ 7가지. 몸(머리 / 몸통 / 다리 따로) + 무기(따로 — 손을 축으로 돌린다).
   python3 mini_sprites.py → mini_sprites.json (page_mini.html이 읽는다) · mini_preview.png
   글자: . 빈칸 · K 외곽선 · 그 밖은 직업 팔레트"""
import json, sys
from PIL import Image
K = '#1c1622'
LEG_A = ["...KLLKKLLK.....", "...KLLK.KLLK....", "...KKK..KKK....."]          # 서 있기
LEG_B = ["...KLLKKLLK.....", "..KLLK...KLLK...", "..KKK....KKK...."]          # 벌린 걸음
LEG_C = ["....KLLLLK......", "....KLLLLK......", "....KKKKKK......"]          # 모은 걸음
ROBE_A = ["..KBBBBBBBBBK...", "..KbBBBBBBBbK...", "..KKKKKKKKKKK..."]
ROBE_B = ["..KBBBBBBBBBK...", ".KbBBBBBBBBBbK..", ".KKKKKKKKKKKKK.."]
ROBE_C = ["..KBBBBBBBBBK...", "...KbBBBBBbK....", "...KKKKKKKKK...."]
C = {
 'warrior': dict(pal={'H': '#b9c0c9', 'h': '#7f8894', 'W': '#f2f5f8', 'S': '#f0b98a', 's': '#c98a60', 'E': '#1c1622', 'A': '#c8372f', 'a': '#8f2320', 'B': '#8a5a34', 'b': '#5e3b22', 'L': '#6b4426'},
   head=["....KKKKKKK.....", "...KHHHHHHHK....", "..KHHWWHHHHHK...", "..KHHWHHHHHHK...", ".KhhhhhhhhhhhK..", "..KSSSSSSSSSK...", "..KSSSSESSEsK...", "..KSSSSESSEsK...", "..KsSSSSSSssK..."],
   body=[".KAAAAAAAAAK....", "KAaKBBBBBBBK....", ".KKKBBBBBBBSK...", "...KbBBBBBbK...."], legs=[LEG_A, LEG_B, LEG_C],
   wpn='sword', off='shield', hand=(12, 11), act='slash', pose=dict(rest=[2, 11, -8], wind=[2, 9, -50], hit=[14, 11, 115])),
 'rogue': dict(pal={'H': '#5a3f7a', 'h': '#3c2a55', 'S': '#f0b98a', 's': '#c98a60', 'E': '#1c1622', 'A': '#d0382e', 'a': '#93231f', 'M': '#33283f', 'B': '#4a3a5c', 'b': '#30253e', 'L': '#5a3e2a'},
   head=["....KKKKKKK.....", "...KHHHHHHHK....", "..KHHHHHHHHHK...", ".KAAAAAAAAAAK...", "KAaKAAAAAAAAK...", ".KKKSSSESSEsK...", "..KMMMMMMMMMK...", "..KMMMMMMMMMK...", "..KhMMMMMMMhK..."],
   body=["..KBBBBBBBBBK...", "..KBBBBBBBBBK...", "..KBBBbbBBBSK...", "...KbBBBBBbK...."], legs=[LEG_A, LEG_B, LEG_C],
   wpn='dagger', off=None, hand=(12, 11), act='stab', pose=dict(rest=[13, 11, 60], wind=[11, 11, 80], hit=[16, 11, 90])),
 'archer': dict(pal={'H': '#5f8a3a', 'h': '#3f6126', 'F': '#d0382e', 'R': '#7a4a26', 'S': '#f0b98a', 's': '#c98a60', 'E': '#1c1622', 'B': '#4f7a34', 'b': '#345424', 'Q': '#8a5a34', 'W': '#f2f5f8', 'L': '#6b4426'},
   head=["..KK............", ".KFFK.KKKKK.....", "..KFFKHHHHHK....", "...KKHHHHHHHK...", "..KhhhhhhhhhhK..", "..KRSSSSSSSSK...", "..KRSSSESSEsK...", "..KRSSSESSEsK...", "..KsSSSSSSssK..."],
   body=[".KWKBBBBBBBK....", "KQQKBBBBBBBK....", "KQQKBBBBBBBSK...", ".KKKbBBBBBbK...."], legs=[LEG_A, LEG_B, LEG_C],
   wpn='bow', off=None, hand=(12, 11), act='shoot', pose=dict(rest=[14, 10, 0], wind=[14, 10, 0], hit=[14, 10, 0])),
 'mage': dict(pal={'H': '#6a3f9a', 'h': '#472a6b', 'G': '#e0b040', 'S': '#f0b98a', 's': '#c98a60', 'E': '#1c1622', 'W': '#eef0f2', 'w': '#b8bcc4', 'B': '#6a3f9a', 'b': '#472a6b'},
   head=[".......KK.......", "......KHHK......", ".....KHHHHK.....", "....KHHHHHHK....", "...KGGGGGGGGK...", "KKKhhhhhhhhhhKKK", ".KKKSSSESSEsKKK.", "..KWSSSESSEWK...", "..KWWWWWWWWWK..."],
   body=["...KWWWWWWWK....", "..KBBKWWWKBBK...", "..KBBBKWKBBBSK..", "..KBBBBKBBBBK..."], legs=[ROBE_A, ROBE_B, ROBE_C],
   wpn='staff', off=None, hand=(13, 11), act='cast', pose=dict(rest=[14, 11, 4], wind=[14, 10, -12], hit=[14, 8, 14])),
 'cleric': dict(pal={'H': '#4f7fc0', 'h': '#335a94', 'R': '#7a4a26', 'G': '#e0b040', 'S': '#f0b98a', 's': '#c98a60', 'E': '#1c1622', 'B': '#4f7fc0', 'b': '#335a94'},
   head=["....KKKKKKK.....", "...KHHHHHHHK....", "..KHHHHHHHHHK...", "..KHHRRRRRRHK...", "..KHRSSSSSSHK...", "..KHSSSESSEHK...", "..KHSSSESSEHK...", "..KhsSSSSSshK...", "...KhhhGGhhK...."],
   body=["..KBBBBBBBBBK...", "..KBBBBBBBBBK...", "..KBBBBBBBBBSK..", "..KBBBBBBBBBK..."], legs=[ROBE_A, ROBE_B, ROBE_C],
   wpn='scepter', off=None, hand=(13, 11), act='heal', pose=dict(rest=[14, 11, 4], wind=[14, 10, -8], hit=[14, 8, 0])),
 'porter': dict(pal={'R': '#8a5a2e', 'r': '#5e3b1e', 'A': '#d0382e', 'S': '#f0b98a', 's': '#c98a60', 'E': '#1c1622', 'O': '#c8372f', 'o': '#8f2320', 'P': '#9a6a3c', 'p': '#6e4826', 'B': '#d8c090', 'b': '#a89060', 'L': '#6b4426'},
   head=["....K.K.K.K.....", "...KRKRKRKRK....", "..KRRRRRRRRRK...", "..KAAAAAAAAAK...", ".KKKSSSSSSSsK...", "KOOKSSSESSEsK...", "KOoKSSSESSEsK...", "KPPKsSSSSSssK...", "KPPPKKKKKKKK...."],
   body=["KPPPKBBBBBBK....", "KPPPKBBBBBBBK...", "KPPPKBBBBBBSK...", "KpPPKbBBBBbK...."], legs=[[".KKKKLLKKLLK....", "....KLLK.KLLK...", "....KKK..KKK...."], [".KKKKLLKKLLK....", "...KLLK...KLLK..", "...KKK....KKK..."], [".KKKK.KLLLLK....", ".....KLLLLK.....", ".....KKKKKK....."]],
   wpn='club', off='lantern', hand=(12, 11), act='carry', pose=dict(rest=[13, 11, 25], wind=[12, 9, -40], hit=[14, 12, 110])),
}
# 무기 · 든 것: 축(손잡이) 자리 = grip (x, y). 외곽선은 자동으로 두른다. 위를 향해 그린다(돌리기 전)
W = {
 'sword':   dict(pal={'W': '#eef2f6', 'w': '#aab4c0', 'G': '#e0b040', 'N': '#6b4426'}, px=[".W.", ".W.", ".W.", ".w.", ".w.", ".w.", ".w.", "GGG", ".N.", ".N."], grip=(1, 8)),
 'dagger':  dict(pal={'W': '#eef2f6', 'w': '#aab4c0', 'G': '#8a8f98', 'N': '#3c2a22'}, px=[".W.", ".w.", ".w.", "GGG", ".N."], grip=(1, 4)),
 'club':    dict(pal={'N': '#8a5a34', 'n': '#5e3b22'}, px=["NNN", "NNN", "NnN", ".N.", ".N.", ".n.", ".n."], grip=(1, 6)),
 'staff':   dict(pal={'O': '#5ab8ff', 'o': '#bfe6ff', 'N': '#8a5a34', 'n': '#5e3b22', 'G': '#e0b040'}, px=[".oO.", "OOOO", ".OO.", ".GG.", ".N..", ".N..", ".N..", ".n..", ".n..", ".n..", ".n..", ".n.."], grip=(1, 8)),
 'scepter': dict(pal={'G': '#e0b040', 'g': '#a87a20', 'W': '#fff3c0', 'N': '#c8a050'}, px=["G.G", "GWG", ".G.", ".g.", ".N.", ".N.", ".N.", ".N.", ".N.", ".N.", ".N."], grip=(1, 7)),
 'bow':     dict(pal={'N': '#9a6a3c', 'n': '#6e4826', 'T': '#e8e0c8'}, px=["TN..", "T.N.", "T..N", "T..N", "T..N", "T..N", "T..N", "T.N.", "TN.."], grip=(3, 4)),
 'shield':  dict(pal={'N': '#9a6a3c', 'n': '#6e4826', 'M': '#b9c0c9', 'm': '#7f8894'}, px=[".MMM.", "MNNNM", "MNmNM", "MNNnM", "MnnnM", ".MMM."], grip=(2, 3)),
 'lantern': dict(pal={'M': '#7f8894', 'Y': '#ffd060', 'y': '#ff9a30'}, px=[".M.", "MMM", "MYM", "MyM", "MMM"], grip=(1, 0)),
}
M = {
 'wolf': dict(pal={'G': '#8e8a96', 'g': '#5f5b68', 'W': '#e8e4dc', 'E': '#ffd040', 'N': '#2a2230'},
   body=["..............KK.KK.", ".............KGGKGGK", "KK...........KGGGGGK", "KGK.KKKKKKKKKGGEGGGK", "KGGKGGGGGGGGGGGGGWWK", ".KGGGGGGGGGGGGGGKNNK", "..KGGGgGGGGGGGGGKKK.", "..KGGgggggggGGGK...."],
   legs=[["..KGK.KGK..KGKGK....", "..KKK.KKK..KKKKK...."], [".KGK...KGK.KGK.KGK..", ".KKK...KKK.KKK.KKK.."]]),
 'rat': dict(pal={'G': '#9a7a5a', 'g': '#6e543c', 'P': '#e89aa0', 'E': '#1c1622'},
   body=["........KK.KK.", ".......KPGKPGK", "K...KKKKGGGGGK", "PK.KGGGGGGEGGK", ".PKGGGGGGGGGPK", "..KGGgggGGGKK."],
   legs=[["..KGK..KGGK...", "..KKK..KKKK..."], [".KGK....KGGK..", ".KKK....KKKK.."]]),
 'rabbit': dict(pal={'G': '#f0ece4', 'g': '#c8c0b4', 'P': '#e89aa0', 'E': '#c8372f', 'Y': '#e0b040'},
   body=["......KK.KK.", ".....KGKYGK.", ".....KGKKGK.", "....KGGGGGK.", ".KKKGGGGEGK.", "KGGGGGGGGPK.", "KGGGGgGGGK.."],
   legs=[["KGGKKKGGK...", ".KK...KKK..."], ["KGK..KGGGK..", "KK...KKKK..."]]),
}
def grid(rows, pal):
    return [[(K if c == 'K' else pal.get(c)) if c != '.' else None for c in r] for r in rows]
def outlined(rows, pal):
    g = grid(rows, pal); h, w = len(g), len(g[0]); o = [[None] * (w + 2) for _ in range(h + 2)]
    for y in range(h):
        for x in range(w):
            if g[y][x]:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    if o[y + 1 + dy][x + 1 + dx] is None: o[y + 1 + dy][x + 1 + dx] = K
    for y in range(h):
        for x in range(w):
            if g[y][x]: o[y + 1][x + 1] = g[y][x]
    return o
def out():
    d = {'cls': {}, 'wpn': {}}
    for k, c in C.items():
        for part in ('head', 'body'):
            assert all(len(r) == 16 for r in c[part]), (k, part, [len(r) for r in c[part]])
        for L in c['legs']: assert all(len(r) == 16 for r in L), (k, L)
        d['cls'][k] = dict(head=grid(c['head'], c['pal']), body=grid(c['body'], c['pal']), legs=[grid(L, c['pal']) for L in c['legs']], wpn=c['wpn'], off=c['off'], hand=c['hand'], act=c['act'], pose=c['pose'])
    d['mon'] = {}
    for k, m in M.items():
        w0 = len(m['body'][0]); assert all(len(r) == w0 for r in m['body'] + m['legs'][0] + m['legs'][1]), (k, [len(r) for r in m['body'] + m['legs'][0] + m['legs'][1]])
        d['mon'][k] = dict(body=grid(m['body'], m['pal']), legs=[grid(L, m['pal']) for L in m['legs']])
    for k, w in W.items():
        d['wpn'][k] = dict(px=outlined(w['px'], w['pal']), grip=[w['grip'][0] + 1, w['grip'][1] + 1])
    return d
if __name__ == '__main__':
    d = out(); json.dump(d, open('mini_sprites.json', 'w'), separators=(',', ':'))
    Z = 12; names = list(C); im = Image.new('RGB', (len(names) * 22 * Z, 24 * Z), (150, 170, 110))  # 위 왼쪽에 몬스터도
    def put(g, ox, oy):
        for y, r in enumerate(g):
            for x, c in enumerate(r):
                if c: im.paste(tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)), ((ox + x) * Z, (oy + y) * Z, (ox + x + 1) * Z, (oy + y + 1) * Z))
    for i, k in enumerate(names):
        c = d['cls'][k]; ox = i * 22 + 3; w = d['wpn'][c['wpn']]
        put(c['head'], ox, 4); put(c['body'], ox, 13); put(c['legs'][0], ox, 17)
        if c['off']: o = d['wpn'][c['off']]; put(o['px'], ox + (10 if c['off'] == 'shield' else 13) - o['grip'][0], 4 + (12 if c['off'] == 'shield' else 13) - o['grip'][1])
        put(w['px'], ox + c['pose']['rest'][0] - w['grip'][0], 4 + c['pose']['rest'][1] - w['grip'][1])
    x = 2
    for k, m in d['mon'].items(): put(m['body'], x, 0); put(m['legs'][0], x, len(m['body'])); x += 24
    im.save(sys.argv[1] if len(sys.argv) > 1 else 'mini_preview.png'); print(im.size)
