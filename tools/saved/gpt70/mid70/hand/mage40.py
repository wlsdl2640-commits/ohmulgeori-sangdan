"""40칸 크기로 처음부터 찍은 견본: 수습 마법사 (GPT 판 없이 — 사용자 11-20 「너도 40정도로 도트 찍는게 가능 하겠어?」에 그림으로 답하려고)
   전사(사이 값 40칸)와 같은 비율: 눈이 땅에서 27칸 · 턱이 23칸 위 · 오른쪽을 보는 반옆모습 · 검은 테 한 칸 · 재질마다 밝기 네댓 단계 · 빛은 앞(오른쪽) 위에서
   부위를 겹(지팡이 · 뒤 팔과 책 · 몸 · 앞 팔 · 머리 · 챙 · 고깔)으로 나눠 줄마다 손으로 찍었다. 숨쉬기 같은 동작은 겹을 한 칸씩 옮겨 만든다(장마다 새로 그리지 않는다)
   python3 mage40.py <출력 폴더>   → mage40_<i>.png(숨쉬기 4장) · mage40_x8.png(크게)"""
import sys, os
import numpy as np
from PIL import Image
PAL = {'K': '#060203', 'k': '#22110d',
       'a': '#2a2152', 'b': '#3b2f7c', 'c': '#5143a6', 'd': '#7263c9', 'e': '#a094e6',      # 남보라 (모자 · 로브)
       'g': '#8f5f1c', 'h': '#d1962b', 'i': '#f7d362',                                      # 금 (띠 · 단)
       't': '#1c6670', 'u': '#2ba3a6', 'v': '#74e3d8', 'w': '#dcfff7',                      # 청록 (수정 · 허리끈)
       'm': '#9c6a26', 'n': '#d8a23e', 'o': '#f6d57e',                                      # 밀빛 머리
       'p': '#ad865e', 'q': '#d7a77a', 'r': '#f9c290', 's': '#fdd3a3',                      # 살
       'x': '#49261c', 'y': '#6b3d2c', 'z': '#9a5a3a', 'Z': '#ca7f4e',                      # 나무 · 가죽
       'C': '#ba9d7e', 'D': '#ebd2ae', 'E': '#fcefcd', 'W': '#fcfbf8'}                      # 크림 단 · 흰 빛
W, H = 38, 48; GY = 46   # 땅 줄(장화 바닥 아래 테) = 46번째 줄

HAT = (10, 2, [   # 뒤로 꺾인 고깔 + 금 띠 (오른쪽이 밝다)
 "abc            ",
 " abcd          ",
 "  abccd        ",
 "  abbcde       ",
 "  abbccde      ",
 "  abbccccde    ",
 "  abbcccccde   ",
 "  abbbccccddde ",
 "  aabbbccccdde ",
 "  ghhhhhhhiWih ",
 "  gghhhhhhhiihg",
])
BRIM = (6, 13, [  # 넓은 챙: 윗면 밝게 · 밑면 그늘
 "  bbcccccdddddddddeeeed  ",
 "abbbbccccccccccccddddddcb",
 " kaaabbbbbbbbbbbbbbbccbk ",
])
HEAD = (11, 16, [  # 밀빛 머리 · 얼굴: 챙 그늘 → 눈(세로 세 칸 · 위에 흰 빛) → 입 → 턱
 " kmnonnnnnoqqqk",
 "kmnnonnmnorrsrq",
 "mnonnnnmrsWKsrq",
 "mnnnonnmrsKKsrr",
 "mmnnnnmqrrKKrrq",
 " mnnmnmqrrrrrpq",
 " kmmnm kqrrrqk ",
 "   kk   kkkkk  ",
])
BODY = (8, 23, [  # 어깨 망토(밝은 남보라 · 금 걸쇠 · 크림 단) → 로브 → 청록 허리끈 → 금 단
 "        kcdDiDdck       ",
 "       kcdddDEDddek     ",
 "      kbcdddddddddek    ",
 "     kbccddddddddddek   ",
 "     kbccdddddddeeedk   ",
 "     kCCDDDDDDDEEEEDk   ",
 "      kaabbbbbbcccdk    ",
 "      abbcbcccccddk     ",
 "      tuuuuuuuvvvvk     ",
 "      kttuuuuuvvuk      ",
 "     abccbccctuddd      ",
 "     abccbccctvcddk     ",
 "     abccbcccttcddd     ",
 "    aabccbccccbcddd     ",
 "    abcccbccccbcdddk    ",
 "    abcccbccccbccddd    ",
 "   aabccccbccccbcddd    ",
 "   aghhhhhhhhhhhhiiih   ",
 "   kgghhhhhhhhhhhhigk   ",
])
BOOTS = (8, 42, [  # 단 아래로 보이는 장화 둘
 "      kyzk   kyzZk      ",
 "      kyzzk  kyzZZk     ",
 "     kyyzzzk kyzzZZzk   ",
 "     kxyyyyk kxyyyzzk   ",
])
ARM_B = (5, 28, [  # 뒤 팔: 어깨 망토 밑에서 나와 옆구리의 책을 든 소매 (갈색 표지 · 금 장식 · 크림 책장)
 "      ab",
 "     abb",
 "    abbk",
 "   abbk ",
 "  kCDCk ",
 "kyzzzDk ",
 "kyzhzDk ",
 "kyzzzDk ",
 "kxyyyCk ",
 " kkkkk  ",
])
ARM_F = (22, 28, [  # 앞 팔: 종 모양 소매 · 크림 소맷단 · 지팡이를 쥔 손
 "kcdde       ",
 "kccddee     ",
 "kbccdddek   ",
 " kbccddDEk  ",
 "  kbbcDErrsk",
 "   kkkkqrrsk",
 "       kkkk ",
])
STAFF = (29, 0, [  # 지팡이 머리: 나무 고리가 청록 수정을 안고 있다
 "   yzzZ  ",
 "  yz   Z ",
 " yz uvw Z",
 " y tuvvwZ",
 " y ttuvvZ",
 " yz ttu z",
 "  yz   z ",
 "   yzzZ  ",
 "    yZ   ",
])
POLE = (33, 9)   # 자루 (두 칸 너비 · 땅까지)


def put(g, layer, dy=0, dx=0):
    x, y, rows = layer
    for j, r in enumerate(rows):
        for i, ch in enumerate(r):
            if ch != ' ' and 0 <= y + dy + j < H and 0 <= x + dx + i < W: g[y + dy + j, x + dx + i] = ch


def compose(bob=0, glow=0, sway=0):
    """bob: 머리 · 모자 · 팔을 내리는 칸 수(숨) · glow: 수정 빛(0 ~ 2) · sway: 옷자락 흔들림(0 · 1)"""
    g = np.full((H, W), '.', dtype='<U1')
    for y in range(POLE[1], GY): g[y, POLE[0]:POLE[0] + 2] = ['y', 'Z']
    put(g, STAFF)
    if glow: g[3, 34] = 'w'; g[4, 34] = 'w' if glow > 1 else 'v'; g[2, 33] = 'w' if glow > 1 else 'v'      # 수정이 밝아진다
    put(g, ARM_B, bob); put(g, BOOTS)
    x, y, rows = BODY
    if sway: rows = rows[:-3] + [' ' + r[:-1] for r in rows[-3:]]      # 단이 한 칸 뒤로
    put(g, (x, y, rows)); put(g, ARM_F, bob); put(g, HEAD, bob); put(g, BRIM, bob); put(g, HAT, bob)
    return g


def outline(g):
    """바깥 테 한 칸(검정)"""
    o = g.copy(); f = g != '.'; P = np.pad(f, 1)
    o[~f & (P[:-2, 1:-1] | P[2:, 1:-1] | P[1:-1, :-2] | P[1:-1, 2:])] = 'K'
    return o


def render(g, z=1):
    a = np.zeros((H, W, 4), np.uint8)
    for ch, hx in PAL.items(): a[g == ch] = [int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16), 255]
    im = Image.fromarray(a, 'RGBA'); return im.resize((W * z, H * z), Image.NEAREST) if z > 1 else im


FRAMES = [dict(bob=0, glow=0, sway=0), dict(bob=0, glow=1, sway=0), dict(bob=1, glow=2, sway=1), dict(bob=1, glow=1, sway=1)]
if __name__ == '__main__':
    OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
    ims = [render(outline(compose(**f))) for f in FRAMES]
    for i, im in enumerate(ims): im.save(f'{OUT}/mage40_{i}.png')
    S = Image.new('RGBA', (W * 8 * 2 + 24, H * 8 + 16), (104, 142, 74, 255)); S.alpha_composite(ims[0].resize((W * 8, H * 8), Image.NEAREST), (8, 8)); S.alpha_composite(ims[2].resize((W * 8, H * 8), Image.NEAREST), (W * 8 + 16, 8)); S.save(f'{OUT}/mage40_x8.png')
    print('ok', len(set(''.join(''.join(r) for r in outline(compose()))) - {'.'}), '색')
