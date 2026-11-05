"""화살 스킬 배경에 들어갈 짐승·용·괴수·거신 손그림 (사용자: "짐승, 용, 철갑 등을 스킬 이름에 맞게 더 잘 그려서")"""
import math
from cell import W, H
# 멧돼지 (왼쪽을 봄): 갈기 · 귀 · 붉은 눈 · 분홍 주둥이 · 엄니
BOAR = (['.....d.d.d......', '...e.dddddd.....', '..eekkkkkkkdd...', '.kkkkkkkkkkkkkk.', 'kkrkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkt', 'ppkkkkkkkkkkkkK.', 'pwwkKKKKKKKKKK..', '...kkk.....kkk..', '...k.k.....k.k..'],
        {'k': ('#7a4c2a', 3), 'K': ('#5a3418', 3), 'd': ('#3a2414', 3), 'e': ('#5a3a22', 3), 'r': ('#ff3a2a', 1), 'p': ('#e0a090', 2), 'w': ('#fff8e8', 7), 't': ('#3a2414', 3)})
# 수사슴 (왼쪽을 봄): 갈래 뿔
STAG = (['.a.a.a........', '.aaaaa........', '..aaa.........', '...aa.........', '..tttt........', 'ttettt........', 'nttttt........', '...tttt.......', '....tttttttttw', '....TTtttttttw', '....tTTTTTTTt.', '....t.t...t.t.', '....t.t...t.t.', '....k.k...k.k.'],
        {'a': ('#e8d8b0', 7), 't': ('#c08a4a', 3), 'T': ('#8a5a2a', 3), 'e': ('#1a1414', 1), 'n': ('#2a1a10', 1), 'w': ('#fff8f0', 7), 'k': ('#2a1a10', 1)})
# 달리는 사슴 (왼쪽으로)
DEERRUN = (['.aa.a.........', '..aaa.........', '..ttt.........', 'tettt.........', 'nttttt........', '...tttttttttw.', '...tTtttttttw.', '....TTTTTTTT..', '...t.t....t.t.', '..t...t..t...t', '.k.....kk.....'],
           {'a': ('#e8d8b0', 7), 't': ('#c08a4a', 3), 'T': ('#8a5a2a', 3), 'e': ('#1a1414', 1), 'n': ('#2a1a10', 1), 'w': ('#fff8f0', 7), 'k': ('#2a1a10', 1)})
# 용 머리 (옆, 왼쪽을 봄): 뿔 · 노란 눈 · 벌린 입 · 이빨
DRAGONH = (['...........hh..', '.........hhh...', '.......rrrr.hh.', '.....rrrrrrrh..', '...rrrryrrrrr..', '.rrrrrrrrrrrrr.', 'rrrrrrrrrrrrrrr', 'w.w.w.rrrrrrrr.', '.......rrrrrrrr', '.wRwRwRRRRRRrr.', '...RRRRRRRRrrr.', '.........RRrrr.'],
           {'r': ('#d83a2a', 13), 'R': ('#8a1a14', 13), 'h': ('#f0e0c0', 7), 'y': ('#ffe040', 1), 'w': ('#ffffff', 7)})
# 나는 용 (날개 편 실루엣, 왼쪽으로)
DRAGONFLY = (['.........R......', '........RmR.....', '.......RmmmR....', '......RmmmmmR...', '.....RmmmmmmmR..', '....RmmRmmRmmmR.', 'hh..R.m..m..mR..', 'rrr...rrrrrr....', 'yrrrrrrrbbrrrr..', 'rr...rrbbbbrrrrr', '.....r.r.....rrr', '....r...r.....rr'],
             {'r': ('#d83a2a', 13), 'R': ('#6a1010', 13), 'm': ('#ff8a5a', 16), 'b': ('#ffb070', 14), 'h': ('#f0e0c0', 7), 'y': ('#ffe040', 1)})
# 괴수 (서 있는 공룡형, 등 가시는 밝게, 배는 연하게)
KAIJU3 = (['.....kkk......', '....kkkkkk....', '...kkykkkkkk..', '...kkkkk.www..', '.s.kkkk.kkk...', 'ss.kkkkk......', '.skkkkbkkk....', '.skkkkbk.kk...', 'skkkkbbk......', 'skkkkbbkk.....', '.kkkkkbkkk....', '..kkkk.kkk....', '..kkk...kk....', '.kkkk...kkk...'],
          {'k': ('#3a2e4a', 4), 'b': ('#6a5a7a', 4), 's': ('#8a7aa8', 4), 'y': ('#ffd040', 1), 'w': ('#ffffff', 7)})
# 돌 거신 (앞모습): 이글거리는 눈 · 금 간 돌 몸
TITAN = (['....ffff....', '...ffffff...', '...foffof...', '...ffffff...', '.FFffffffFF.', 'FfffffffffFF', 'Fff.ffff.fFF', 'Ff..fkkf..FF', 'Ff..ffff..FF', 'ff..ffff..ff', '....ff.ff...', '....ff.ff...', '...fff.fff..', '...FFF.FFF..'],
         {'f': ('#9a948a', 11), 'F': ('#5e5850', 11), 'o': ('#ff9a3a', 1), 'k': ('#2a2622', 1)})
# 외눈 거인 머리
CYCLOPS = (['....hhhhhh....', '..hhhhhhhhhh..', '.hssssssssssh.', 'hsssseeeessssh', 'ssseewwwweesss', 'sssewwkkwwesss', 'ssseewwwweesss', 'sssssseesssss.', '.ssssssssssss.', '.sssmmmmmmsss.', '..sssmwwmsss..', '...ssssssss...'],
           {'h': ('#5a3a22', 3), 's': ('#9ab07a', 2), 'e': ('#5a6a3a', 2), 'w': ('#ffffff', 7), 'k': ('#c8201a', 1), 'm': ('#3a2a1a', 1)})
def rot_rows(rows, ang, cx, cy, ox, oy, ss=3):
    """손그림을 (cx,cy) 둘레로 ang도 돌려 판 위 (ox,oy)에 놓기 → 칸 사전"""
    h = len(rows)
    at = lambda i, j: rows[j][i] if 0 <= j < h and 0 <= i < len(rows[j]) else '.'
    c, s = math.cos(math.radians(ang)), math.sin(math.radians(ang)); out = {}
    for y in range(H):
        for x in range(W):
            cnt = {}
            for jj in range(ss):
                for ii in range(ss):
                    px, py = x + (ii + .5) / ss - ox, y + (jj + .5) / ss - oy
                    u = c * px + s * py + cx; v = -s * px + c * py + cy
                    ch = at(int(math.floor(u)), int(math.floor(v)))
                    if ch != '.': cnt[ch] = cnt.get(ch, 0) + 1
            if sum(cnt.values()) >= ss * ss * 0.5: out[(x, y)] = max(cnt, key=cnt.get)
    return out
def mountain(peak_x=7.5, peak_y=4.0, slope=1.25, snow=3.0, base=20):
    """산: {(x,y): 'S'눈·'s'눈 그늘·'m'바위 밝은 쪽·'M'바위 어두운 쪽}"""
    out = {}
    for y in range(H):
        for x in range(W):
            u = x + 0.5 - peak_x
            if y + 0.5 >= peak_y + abs(u) * slope:
                d = y + 0.5 - peak_y
                if d < snow + (math.sin(x * 1.7) * 0.8): out[(x, y)] = 'S' if u < 0.5 else 's'
                else: out[(x, y)] = 'm' if u < 0 else 'M'
    return out
