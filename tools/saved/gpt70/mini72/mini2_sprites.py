"""작은 도트 모험가 2판 (11-22 05:38 사용자 「캐릭터에 디테일을 더 넣고, 동작구분으로 움직이게 설계해 봐」)
   키 24칸 · 몸을 조각(머리 / 몸통 / 앞팔 / 뒷팔 / 앞다리 / 뒷다리 또는 옷자락 / 등에 멘 것 / 무기 / 방패)으로 나누고, 동작은 자세(키 프레임)를 차례로 넘긴다.
   python3 mini2_sprites.py [미리보기.png] → mini2_sprites.json
   글자: . 빈칸 · K 외곽선 · 그 밖은 직업 팔레트. 머리 · 몸통은 가운데 맞춤(너비가 달라도 됨)."""
import json, sys
from PIL import Image
K = '#1c1622'
SKIN = {'S': '#f2bd90', 's': '#cf9068', 'E': '#1c1622', 'e': '#ffffff'}
ARM = ["KMK", "KmK", "KBK", "KBK", "KbK", "KSK", "KKK"]            # 어깨(1, 0)가 축 · 아래로 늘어뜨린 꼴
LEG = ["KPPK.", "KPPK.", "KpPK.", "KLLK.", "KLLKK", "KlLLK", "KKKKK"]   # 다리 (엉덩이 (1, 0)이 축)
LEGUP = ["KPPK.", "KpPK.", "KLLKK", "KlLLK", "KKKKK"]              # 든 다리 (짧게)
C = {
 'warrior': dict(name='전사', pal={'H': '#c3cad3', 'h': '#8a93a0', 'W': '#ffffff', 'N': '#5c6470', 'R': '#7a4a26', 'A': '#d23b30', 'a': '#962622', 'M': '#aab3bf', 'm': '#78818e', 'B': '#8f5f38', 'b': '#623f24', 'G': '#4a3020', 'Y': '#e8b840', 'P': '#6e5a48', 'p': '#4f4032', 'L': '#5a3a22', 'l': '#3c2616'},
   head=["...KKKKKKKK...", "..KHHHHHHHHK..", ".KHHWWHHHHHHK.", ".KHWHHHHHHHhK.", ".KHHHHHHHHhhK.", "KhhNhhhhhhNhhK", ".KRSSSSSSSSsK.", ".KRSSSSESSEsK.", ".KSSSSSESSEsK.", ".KsSSSSSSSSsK.", "..KsSSSSSSsK..", "...KKKKKKKK..."],
   torso=["KAAAAAAAAK", "KaAAaAAAaK", "KMMBBBBMMK", "KmBBbBBBmK", "KBBBbBBBBK", "KGGGYYGGGK", "KbBBBBBBbK", "KKKKKKKKKK"],
   back=dict(px=["..KK", ".KAK", "KAAK", "KAaK", "KaK.", "KK.."], at=(-1, 13), sway=1), legs=True,
   wpn='sword', off='shield', rest=dict(fa=20, wa=0), act='slash'),
 'rogue': dict(name='도적', pal={'H': '#62458a', 'h': '#402c5e', 'A': '#d23b30', 'a': '#962622', 'M': '#3a2e48', 'm': '#2a2036', 'B': '#4c3c60', 'b': '#33273f', 'G': '#2a2036', 'Y': '#b9c0c9', 'N': '#7a5a3a', 'P': '#3e3350', 'p': '#2c2338', 'L': '#5a3e2a', 'l': '#3c2616'},
   head=["...KKKKKKKK...", "..KHHHHHHHHK..", ".KHHHHHHHHHHK.", ".KHHHHHHHHHhK.", "KAAAAAAAAAAAK.", "KaAAAAAAAAAaK.", ".KhSSSSESSEsK.", ".KhSSSSESSEsK.", ".KMMMMMMMMMMK.", ".KMMMMMMMMMmK.", "..KmMMMMMMmK..", "...KKKKKKKK..."],
   torso=["KHHHHHHHHK", "KhHHHHHHhK", "KBBNBBBBBK", "KBBBNBBBBK", "KBBBBNBBBK", "KGGGYYGGGK", "KbBBBBBBbK", "KKKKKKKKKK"],
   back=dict(px=["KK..", "KAK.", ".KAK", ".KaK", "..KK"], at=(0, 6), sway=1), legs=True,
   wpn='dagger', off=None, rest=dict(fa=35, wa=75), act='stab'),
 'archer': dict(name='궁수', pal={'H': '#679640', 'h': '#44682a', 'F': '#d23b30', 'f': '#962622', 'R': '#8a5a2e', 'B': '#557f38', 'b': '#3a5a26', 'M': '#557f38', 'm': '#3a5a26', 'N': '#8f5f38', 'G': '#5a3a22', 'Y': '#e8b840', 'Q': '#8f5f38', 'q': '#623f24', 'W': '#f2f5f8', 'P': '#6e5a48', 'p': '#4f4032', 'L': '#5a3a22', 'l': '#3c2616'},
   head=["KK............", "KFK..KKKKKK...", ".KFKKHHHHHHK..", "..KfHHHHHHHHK.", "..KHHHHHHHHhK.", ".KhhhhhhhhhhhK", ".KRRSSSSSSSsK.", ".KRSSSSESSEsK.", ".KRSSSSESSEsK.", ".KsSSSSSSSSsK.", "..KsSSSSSSsK..", "...KKKKKKKK..."],
   torso=["KHHHHHHHHK", "KBBBBBBNBK", "KBBBBBNBBK", "KBBBBNBBBK", "KBbBNBBbBK", "KGGGYYGGGK", "KbBBBBBBbK", "KKKKKKKKKK"],
   back=dict(px=["W.W.", "KWKW", "KQQK", "KQqK", "KQqK", "KqqK", ".KK."], at=(0, 10), sway=0), legs=True,
   wpn='bow', off=None, rest=dict(fa=40, wa=0), act='shoot'),
 'mage': dict(name='마법사', pal={'H': '#7446a6', 'h': '#4e2e74', 'G': '#e8b840', 'g': '#a87a20', 'W': '#f2f2f4', 'w': '#bcc0c8', 'B': '#7446a6', 'b': '#4e2e74', 'M': '#7446a6', 'm': '#4e2e74', 'Y': '#e8b840', 'T': '#b02a4a'},
   head=[".........KK.....", "........KHHK....", ".......KHHHK....", "......KHHHHHK...", ".....KHHHHHhK...", "....KHHHHHHHhK..", "....KGGGGGGGgK..", ".KKKhhhhhhhhhKKK", "KhhhhhhhhhhhhhhK", ".KKKSSSSESSEsKK.", "...KsSSSESSEsK..", "...KWWSSSSSWWK..", "...KWWWWWWWWwK..", "....KWWWWWWwK...", ".....KWWWWwK....", "......KKKKK....."], hoy=3,
   torso=["KBBBBBBBBK", "KBGBBBBGBK", "KBBBBBBBBK", "KbBBTTBBbK", "KGGGYYGGGK", "KBBBBBBBBK", "KBBBBBBBBK", "KBBBBBBBBK"],
   back=None, legs=False, skirt=[[".KBBBBBBBBK.", ".KBBBbBBBBK.", "KBBBBbBBBBBK", "KbBBBbBBBBbK", "KGGGGGGGGGGK", "KKKKKKKKKKKK"], [".KBBBBBBBBK.", "KBBBBbBBBBK.", "KBBBBBbBBBBK", "KbBBBBbBBBBK", ".KGGGGGGGGGK", ".KKKKKKKKKKK"]],
   wpn='staff', off=None, rest=dict(fa=55, wa=5), act='cast'),
 'cleric': dict(name='사제', pal={'H': '#5a8ad0', 'h': '#3a62a0', 'R': '#8a5a2e', 'G': '#e8b840', 'g': '#a87a20', 'B': '#5a8ad0', 'b': '#3a62a0', 'M': '#5a8ad0', 'm': '#3a62a0', 'Y': '#fff3c0', 'W': '#dfe9f6'},
   head=["...KKKKKKKK...", "..KHHHHHHHHK..", ".KHHHHHHHHHHK.", ".KHHhRRRRRRHK.", ".KHhRSSSSSSHK.", ".KHhSSSSESSEK.", ".KHhSSSSESSEK.", ".KHhsSSSSSSsK.", ".KHHhsSSSSsHK.", "..KHHhhhhhHK..", "...KKGGGGKK...", "....KKKKKK...."],
   torso=["KBBBGGBBBK", "KBBBGGBBBK", "KBWBGGBWBK", "KBBBGGBBBK", "KGGGYYGGGK", "KBBBGGBBBK", "KBBBGGBBBK", "KBBBGGBBBK"],
   back=None, legs=False, skirt=[[".KBBBGGBBBK.", ".KBBBGGBBBK.", "KBBBBGGBBBBK", "KbBBBGGBBBbK", "KGGGGGGGGGGK", "KKKKKKKKKKKK"], [".KBBBGGBBBK.", "KBBBBGGBBBK.", "KBBBBBGGBBBK", "KbBBBBGGBBBK", ".KGGGGGGGGGK", ".KKKKKKKKKKK"]],
   wpn='scepter', off=None, rest=dict(fa=55, wa=5), act='heal'),
 'porter': dict(name='짐꾼', pal={'R': '#8a5a2e', 'r': '#5e3b1e', 'A': '#d23b30', 'a': '#962622', 'B': '#dcc594', 'b': '#ab9262', 'M': '#dcc594', 'm': '#ab9262', 'N': '#8f5f38', 'G': '#5a3a22', 'Y': '#e8b840', 'P': '#7a6248', 'p': '#584632', 'L': '#5a3a22', 'l': '#3c2616', 'O': '#d23b30', 'o': '#962622', 'Q': '#9a6a3c', 'q': '#6e4826', 'W': '#b9c0c9'},
   head=["..K.K.KK.K.K..", ".KRKRKRRKRKRK.", ".KRRRRRRRRRRK.", ".KRRRRRRRRRrK.", "KAAAAAAAAAAAK.", "KaAAAAAAAAAaK.", ".KRSSSSESSEsK.", ".KSSSSSESSEsK.", ".KsSSSSSSSSsK.", ".KsSSSSSSSssK.", "..KsSSSSSSsK..", "...KKKKKKKK..."],
   torso=["KBBBBBBBBK", "KBNBBBBNBK", "KBNBBBBNBK", "KBNBbBBNBK", "KBNBBBBNBK", "KGGGYYGGGK", "KbBBBBBBbK", "KKKKKKKKKK"],
   back=dict(px=[".KKKKK.", "KOOOOOK", "KOoOoOK", "KKKKKKK", "KQQQQQK", "KQqQQWK", "KQQQQQK", "KQqQQQK", "KQQQQqK", "KqqqqqK", ".KKKKK."], at=(-2, 7), sway=0), legs=True,
   wpn='club', off='lantern', rest=dict(fa=30, wa=20), act='club'),
}
W = {   # 위를 향해 그린다 (grip = 손잡이 자리) — 외곽선 자동
 'sword':   dict(pal={'W': '#f4f8fb', 'w': '#aeb8c4', 'G': '#e8b840', 'g': '#a87a20', 'N': '#6b4426'}, px=[".W.", "WWw", "WWw", "WWw", "WWw", "WWw", "WWw", "WWw", "WWw", "GGG", "gGg", ".N.", ".N."], grip=(1, 11)),
 'dagger':  dict(pal={'W': '#f4f8fb', 'w': '#aeb8c4', 'G': '#8a8f98', 'N': '#3c2a22'}, px=[".W.", "WWw", "WWw", "WWw", "GGG", ".N.", ".N."], grip=(1, 5)),
 'club':    dict(pal={'N': '#9a6a3c', 'n': '#6e4826', 'M': '#b9c0c9'}, px=[".NN.", "NNNN", "MNNM", "NNnN", "NNnN", ".Nn.", ".Nn.", ".Nn.", ".nn."], grip=(1, 7)),
 'staff':   dict(pal={'O': '#5ab8ff', 'o': '#d8f0ff', 'D': '#2a78c8', 'N': '#9a6a3c', 'n': '#6e4826', 'G': '#e8b840'}, px=[".GOG.", "GOoOG", "GOOOG", ".GDG.", "..N..", "..N..", "..N..", "..N..", "..n..", "..N..", "..N..", "..n..", "..n..", "..n..", "..n.."], grip=(2, 9)),
 'scepter': dict(pal={'G': '#e8b840', 'g': '#a87a20', 'W': '#fff8d8', 'N': '#d8b060', 'n': '#a88030'}, px=["G.G.G", "GGWGG", ".GWG.", "..G..", "..g..", "..N..", "..N..", "..N..", "..n..", "..N..", "..N..", "..n..", "..n.."], grip=(2, 8)),
 'bow':     dict(pal={'N': '#a8763e', 'n': '#6e4826', 'T': '#efe8d4', 'G': '#e8b840'}, px=["TN...", "T.N..", "T..N.", "T..N.", "T...N", "T...G", "T...G", "T...N", "T..N.", "T..N.", "T.N..", "TN..."], grip=(4, 6)),
 'shield':  dict(pal={'N': '#a8763e', 'n': '#6e4826', 'M': '#c3cad3', 'm': '#8a93a0', 'W': '#ffffff'}, px=["..MMMM..", ".MNNNNM.", "MNNNnNNM", "MNNWMnNM", "MNNMmnNM", "MNnnnNNM", ".MNNNNM.", "..MMMM.."], grip=(4, 4)),
 'lantern': dict(pal={'M': '#8a93a0', 'm': '#5c6470', 'Y': '#ffe070', 'y': '#ff9a30'}, px=[".M.", "MMM", "MYM", "MyM", "MYM", "mmm"], grip=(1, 0)),
}
M = {
 'wolf': dict(pal={'G': '#9a96a4', 'g': '#6a6674', 'D': '#4a4654', 'W': '#eeeae2', 'E': '#ffd040', 'N': '#2a2230', 'T': '#f2f2f2'},
   body=["..................KK..KK..", ".................KGGKKGGK.", "KKK..............KGgGGgGK.", "KGGK.KKKKKKKKKKKKGGGGGGGGK", "KgGGKGGGGGGGGGGGGGGGEKGGWK", ".KgGGGGGDGGGGDGGGGGGGGGWWK", "..KGGGGGGGGGGGGGGGGGGKKNNK", "..KGGGGggGGGGGGGGGGGKTKKK.", "..KGGGggggggggGGGGGGK.....", "..KGGGgKKKKKKKKgGGGGK....."],
   legs=[["..KGgK.KGgK...KGgKGgK.....", "..KGgK.KGgK...KGgKGgK.....", "..KKKK.KKKK...KKKKKKK....."], [".KGgK...KGgK.KGgK..KGgK...", "KGgK.....KGgKGgK....KGgK..", "KKKK.....KKKKKKK....KKKK.."]]),
 'rat': dict(pal={'G': '#a8866a', 'g': '#765a40', 'P': '#f0a0a8', 'p': '#c87880', 'E': '#1c1622', 'W': '#f2f2f2'},
   body=["..........KK..KK..", ".........KPpKKPpK.", "KK...KKKKKGGGGGGK.", "PPK.KGGGGGGGGEGGGK", ".PPKGGGGGGGGGGGGPK", "..KGGGGgGGGGGGGWK.", "..KGGgggggGGGGKK.."],
   legs=[["..KGK.KGK..KGKGK..", "..KKK.KKK..KKKKK.."], [".KGK...KGK.KGK.KGK", ".KKK...KKK.KKK.KKK"]]),
 'rabbit': dict(pal={'G': '#f4f0e8', 'g': '#ccc4b8', 'P': '#f0a0a8', 'E': '#d23b30', 'Y': '#e8b840'},
   body=[".......KK..KK.", "......KGPKKGPK", "......KGPKYGPK", "......KGGKKGGK", ".....KGGGGGGGK", ".KKKKGGGGGEGGK", "KGGGGGGGGGGGPK", "KGGGGGgGGGGGK.", "KGGGGggGGGGK.."],
   legs=[["KGGKKKKKGGK...", "KGGGK..KGGGK..", "KKKKK..KKKKK.."], ["KGK....KGGGK..", "KGGK..KGGGGK..", "KKKK..KKKKKK.."]]),
}
def grid(rows, pal):
    p = dict(SKIN); p.update(pal); w = len(rows[0]); assert all(len(r) == w for r in rows), [(i, len(r)) for i, r in enumerate(rows)]
    for r in rows:
        for c in r: assert c in '.K' or c in p, (c, r)
    return [[(K if c == 'K' else p[c]) if c != '.' else None for c in r] for r in rows]
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
    d = {'cls': {}, 'wpn': {}, 'mon': {}}
    for k, c in C.items():
        e = dict(name=c['name'], head=grid(c['head'], c['pal']), hoy=c.get('hoy', 0), torso=grid(c['torso'], c['pal']), arm=grid(ARM, c['pal']), wpn=c['wpn'], off=c['off'], rest=c['rest'], act=c['act'])
        if c['legs']: e['leg'] = grid(LEG, c['pal']); e['legup'] = grid(LEGUP, c['pal'])
        else: e['skirt'] = [grid(s, c['pal']) for s in c['skirt']]
        if c['back']: e['back'] = dict(px=grid(c['back']['px'], c['pal']), at=c['back']['at'], sway=c['back']['sway'])
        d['cls'][k] = e
    for k, w in W.items(): d['wpn'][k] = dict(px=outlined(w['px'], w['pal']), grip=[w['grip'][0] + 1, w['grip'][1] + 1])
    for k, m in M.items(): d['mon'][k] = dict(body=grid(m['body'] + m['legs'][0], m['pal'])[:len(m['body'])], legs=[grid(L, m['pal']) for L in m['legs']]); assert len(m['body'][0]) == len(m['legs'][0][0]) == len(m['legs'][1][0]), k
    return d
if __name__ == '__main__':
    d = out(); json.dump(d, open('mini2_sprites.json', 'w'), separators=(',', ':')); Z = 10; names = list(C)
    im = Image.new('RGB', (len(names) * 30 * Z, 46 * Z), (163, 173, 108))
    def put(g, ox, oy):
        for y, r in enumerate(g):
            for x, c in enumerate(r):
                if c: im.paste(tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)), ((ox + x) * Z, (oy + y) * Z, (ox + x + 1) * Z, (oy + y + 1) * Z))
    for i, k in enumerate(names):   # 조각을 선 자세로 맞춰 본다 (실제 그리기는 page_mini.html)
        c = d['cls'][k]; ox = i * 30 + 15; fy = 28; hw = len(c['head'][0]); hh = len(c['head'])
        if 'back' in c: put(c['back']['px'], ox - 5 + c['back']['at'][0], fy - 26 + c['back']['at'][1])
        put(c['arm'], ox - 4, fy - 13)
        if 'leg' in c: put(c['leg'], ox - 4, fy - 7); put(c['leg'], ox, fy - 7)
        else: put(c['skirt'][0], ox - 6, fy - 6)
        put(c['torso'], ox - 5, fy - 14); put(c['head'], ox - hw // 2, fy - 13 - hh + 1 + c['hoy'])
        w = d['wpn'][c['wpn']]; put(w['px'], ox + 5 - w['grip'][0], fy - 8 - w['grip'][1]); put(c['arm'], ox + 2, fy - 13)
        if c['off']: o = d['wpn'][c['off']]; put(o['px'], ox + (1 if c['off'] == 'shield' else -6) - o['grip'][0], fy - (9 if c['off'] == 'shield' else 7) - o['grip'][1])
    x = 4
    for k, m in d['mon'].items(): put(m['body'], x, 33); put(m['legs'][0], x, 33 + len(m['body'])); x += 34
    im.save(sys.argv[1] if len(sys.argv) > 1 else 'mini2_preview.png'); print(im.size)
