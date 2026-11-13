"""사용자가 준 무기 판 20장(11-13 11:54 「우선 이장비들 적용시켜서」) → src/data-wart67.js (GEARART · 판에 적힌 이름)
python3 export_wart.py <출력 data-wart67.js> [미리보기.png]

- 다시 그리지 않고 판의 그림을 그대로 오린다(바탕 · 「LvN」 글씨 · 이름 · 떨어진 반짝이 빼기) → 긴 쪽 SIZE px WebP data URL.
- 판(이 폴더 *.webp, 받은 PNG를 무손실 WebP로 — 손목 석궁 판은 맨 위 제목 줄(제작자 이름)을 빼고 저장해서 y가 받은 판보다 148 작다).
- 그림 차례
  · 1차부터 쓰는 무기(장검 · 철퇴 · 몽둥이 · 단검 · 도끼 · 단궁 · 스태프 — FIRST): 판은 레벨 차례(Lv70 망령 단계가 Lv76 백작 단계 앞)라
    단계 번호 차례(GTIERS: 백작 = 8번 · 망령 = 9번)로 바꿔 넣는다. 16장 뒤의 그림은 단계가 늘면 쓰인다(Lv150 ~ 200).
  · 2차 직업 무기(창 · 류트 · 활 넷 · 완드 · 오브 · 네크로노미콘 · 카드 · 채찍 · 정글칼 · 손목 석궁): 판 차례 = 착용 레벨 사다리 차례(Lv50 · 55 · 60 … 95 · 100 · 110 …)
    — 판에 적힌 Lv 글씨와 상관없이(11-13 00:23 중갑 판 「LV.1 → 50 · LV.10 → 55 …」과 같은 규칙).
  · 손목 석궁 판은 22장 — 사다리 자리는 21개(Lv50 ~ 200)라 Lv150 글씨가 붙은 「성역의 손목 석궁」(16번)은 뺐다(Lv150 자리는 원래 16번째 그림).
- 이름: 판 글씨가 지금 게임 이름을 옮겨 적은 것(장검 · 단검 · 복합궁 · 대궁 · 완드 · 네크로노미콘 · 오브 · 채찍 · 정글칼 · 손목 석궁)은 게임 이름을 두고
  새로 더한 그림 이름만 붙인다(EXTRA). 새 종류(철퇴 · 몽둥이 · 도끼 · 창 · 류트)와 그림이 새로 바뀐 종류(카드 · 컴파운드 보우 · 장궁 · 단궁 · 스태프)는 판 이름(NAMES).
  고친 것: 류트 첫 그림(판 글씨가 도감의 「류트 Lv50」 그대로) → 「나그네의 류트」 · 채찍 「억속의 채찍」 → 「구속의 채찍」 · 오브 새 그림의 「마법구」 → 게임 이름처럼 「구슬」."""
import base64, io, os, sys
from collections import deque
import numpy as np, cv2
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SIZE = 96
N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))


def grid(rows, cols):
    return [(x0, y0, x1, y1) for (y0, y1) in rows for (x0, x1) in cols]


def dy(boxes, d):
    return [(a, b + d, c, e + d) for (a, b, c, e) in boxes]


# 종류 → (판, 꼴, 칸 상자 (x0, y0, x1, y1) 판 차례, 덧붙임). 꼴 'card' = 카드 아래쪽에 노란 「LvN」 글씨 + 이름 줄(그 둘레만 바탕으로, 글씨 옆으로 내려온 손잡이 끝은 남긴다)
SHEETS = {
    'mace': ('철퇴.webp', 'card', grid([(302, 512), (522, 730), (741, 946)], [(28, 252), (263, 481), (494, 710), (722, 938), (951, 1170)]) +
             grid([(962, 1202)], [(28, 217), (228, 406), (417, 594), (605, 782), (794, 973), (985, 1170)]), {}),
    'club': ('몽둥이.webp', 'card', grid([(382, 573), (585, 773), (785, 973)], [(27, 252), (263, 484), (495, 711), (722, 942), (955, 1176)]) +
             grid([(987, 1198)], [(27, 190), (201, 357), (367, 520), (530, 675), (685, 840), (850, 1005), (1015, 1173)]), {}),
    'dagger': ('단검.webp', 'card', grid([(380, 576), (587, 780), (791, 988)], [(24, 249), (260, 482), (493, 711), (721, 943), (955, 1176)]) + [(24, 998, 250, 1243)], {}),
    'lance': ('창.webp', 'card', grid([(330, 579), (594, 845), (860, 1111)], [(30, 248), (262, 480), (494, 705), (719, 936), (950, 1167)]), {}),
    'sword': ('장검.webp', 'card', grid([(306, 521), (536, 752), (767, 980)], [(35, 253), (266, 480), (493, 709), (722, 938), (953, 1166)]) +
              grid([(997, 1240)], [(34, 217), (231, 408), (420, 598), (610, 783), (796, 973), (987, 1166)]), {}),
    'axe': ('도끼.webp', 'card', grid([(376, 566), (578, 768), (780, 969)], [(28, 251), (263, 483), (494, 710), (721, 940), (954, 1173)]) + [(28, 983, 250, 1204)],
            {'lab': {15: (100, 1136, 180, 1162)}}),   # 마지막 칸 「Lv140」 글씨는 손으로 (빛 번짐에 묻혀 못 찾는다)
    'compound': ('컴파운드보우.webp', 'box', grid([(158, 376), (510, 736), (866, 1112)], [(20, 228), (262, 465), (498, 701), (735, 938), (972, 1177)]), {}),
    'longbow': ('장궁.webp', 'box', grid([(182, 366), (490, 680), (802, 994)], [(38, 212), (233, 407), (427, 600), (621, 795), (814, 988)]) +
                [(38, 1116, 258, 1350), (279, 1116, 502, 1350), (588, 1118, 952, 1342)],
                {'gc': {17: [(732, 1177), (710, 1328)]}}),   # 큰 카드(빛 원판 · 점선 고리 · 반짝이): GrabCut + 활에 붙은 파란 보석 둘
    'bow': ('단궁.webp', 'box', grid([(184, 334), (452, 602), (727, 871)], [(34, 242), (266, 471), (496, 703), (729, 933), (957, 1162)]) + [(38, 998, 312, 1250)], {}),
    'compbow': ('복합궁.webp', 'box', grid([(378, 503), (628, 753), (878, 1003)], [(37, 217), (238, 418), (439, 619), (639, 819), (839, 1019)]) + [(38, 1133, 232, 1272)], {}),
    'greatbow': ('대궁.webp', 'box', grid([(302, 452), (562, 712), (822, 973)], [(32, 220), (242, 428), (449, 636), (657, 844), (864, 1051)]) + [(33, 1085, 250, 1284)],
                 {'tm': {15: [(205, 1222, 252, 1284)]}}),   # tm = 바탕으로 칠할 판 좌표 (그림 옆 이름 글씨)
    'wand': ('완드.webp', 'box', grid([(318, 433), (538, 652), (755, 868)], [(30, 248), (267, 480), (499, 706), (725, 936), (955, 1169)]) + [(44, 990, 428, 1166)],
             {'tm': {15: [(200, 1102, 410, 1176)]}}),
    'staff': ('스태프.webp', 'box', grid([(155, 446)], [(24, 177), (192, 343), (358, 509), (524, 676), (691, 842), (856, 1008), (1023, 1176)]) +
              grid([(600, 928)], [(24, 142), (158, 272), (288, 402), (418, 531), (547, 661), (676, 789), (804, 912), (927, 1044), (1058, 1179)]), {}),
    'necro': ('네크로노미콘.webp', 'box', grid([(353, 476), (613, 736), (873, 990)], [(35, 220), (238, 422), (441, 625), (644, 828), (847, 1030)]) +
              grid([(1120, 1260)], [(35, 198), (214, 373), (378, 540), (545, 705), (710, 868), (873, 1033)]), {}),
    'orb': ('오브.webp', 'box', grid([(342, 458), (597, 713), (850, 965)], [(35, 220), (238, 424), (442, 628), (646, 831), (849, 1033)]) +
            grid([(1097, 1236)], [(34, 198), (202, 366), (370, 534), (538, 703), (707, 871), (875, 1034)]), {}),
    'card': ('트럼프카드.webp', 'box', grid([(333, 453), (593, 713), (847, 966)], [(34, 218), (238, 420), (440, 622), (642, 825), (844, 1027)]) +
             grid([(1097, 1224)], [(34, 196), (201, 364), (369, 531), (536, 697), (702, 864), (869, 1031)]), {}),
    'lute': ('류트.webp', 'box', grid([(335, 443), (576, 678), (804, 903)], [(37, 241), (260, 464), (484, 687), (706, 909), (929, 1133)]) +
             grid([(1030, 1127)], [(37, 220), (227, 403), (410, 588), (596, 770), (779, 953), (961, 1133)]), {}),
    'whip': ('채찍.webp', 'box', grid([(338, 448), (560, 657), (770, 866)], [(33, 216), (234, 416), (433, 614), (631, 814), (832, 1014)]) +
             grid([(979, 1073)], [(33, 221), (232, 420), (431, 618), (630, 818), (830, 1016)]) + [(33, 1147, 225, 1263)], {}),
    'machete': ('정글칼.webp', 'box', grid([(369, 490), (623, 739), (873, 981)], [(35, 218), (237, 419), (439, 621), (640, 822), (841, 1024)]) +
                grid([(1115, 1226)], [(35, 198), (203, 363), (368, 529), (534, 695), (700, 860), (865, 1026)]), {}),
    'wxbow': ('손목석궁.webp', 'box', dy(grid([(326, 414), (537, 625), (746, 831), (948, 1029)], [(92, 222), (302, 430), (511, 639), (719, 848), (928, 1057)]) +
                                       [(92, 1150, 222, 1263), (300, 1150, 446, 1263)], -148), {'drop': [16]}),
}
FIRST = {'sword', 'mace', 'club', 'dagger', 'axe', 'bow', 'staff'}
TIER_LV = [1, 8, 16, 25, 34, 43, 52, 64, 76, 70, 80, 90, 100, 120, 130, 140]   # GTIERS 단계 레벨 (빌드 67: 8번 백작 Lv76 · 9번 망령 Lv70)
LV_ORDER = sorted(range(len(TIER_LV)), key=lambda t: TIER_LV[t])                 # 판 차례 p = 단계 LV_ORDER[p]

# 판 이름(판 차례) — 새 종류 · 그림이 새로 바뀐 종류
NAMES = {
    'mace': ['견습 철퇴', '성문 철퇴', '은빛 철퇴', '떡갈나무 철퇴', '푸른 강철퇴', '붉은 매 철퇴', '서리 철퇴', '황금 문장퇴', '용비늘 철퇴', '흑철 철퇴', '왕실 근위퇴',
             '폭풍 철퇴', '노을 맹세퇴', '달빛 철퇴', '극광 철퇴', '영원의 맹세퇴', '심연의 철퇴', '그림자 제압퇴', '서리 성철퇴', '신성한 철퇴', '전설의 성철퇴'],
    'club': ['견습 몽둥이', '성문 몽둥이', '은빛 몽둥이', '떡갈나무 몽둥이', '푸른 강철몽둥이', '붉은 매 몽둥이', '서리 몽둥이', '황금 문장몽둥이', '용비늘 몽둥이', '흑철 몽둥이',
             '왕실 근위몽둥이', '폭풍 몽둥이', '노을 몽둥이', '달빛 몽둥이', '극광 몽둥이', '성자의 몽둥이', '영원의 몽둥이', '심연의 몽둥이', '그림자 제압봉', '서리 성몽둥이',
             '신성한 몽둥이', '전설의 몽둥이'],
    'axe': ['연습용 도끼', '수련 도끼', '강철 도끼', '전투 도끼', '바람 도끼', '서리 도끼', '황금 도끼', '수호 도끼', '맹세의 도끼', '용비늘 도끼', '화염 도끼', '폭풍 도끼',
            '거인의 도끼', '지옥 도끼', '혼돈의 도끼', '성자의 도끼'],
    'bow': ['견습 단궁', '숲지기 단궁', '강철 단궁', '폭풍 단궁', '서리 단궁', '사막왕 단궁', '늪지 단궁', '마족 단궁', '망령 단궁', '백작 단궁', '화염 단궁', '세계수 단궁',
            '천공 단궁', '천둥 단궁', '천계 단궁', '성좌 단궁'],
    'staff': ['버들가지 스태프', '이슬 스태프', '나선 뼈 스태프', '들꽃 스태프', '바람 뼈 스태프', '단풍 스태프', '불꽃 꽃 스태프', '설운 스태프', '번개 방울 스태프', '이끼 가지 스태프',
              '얼음 꽃 스태프', '유니콘 뿔 스태프', '세계수 새싹 스태프', '정령왕의 뿔 스태프', '대마도사의 성흔 스태프', '정령왕의 별 스태프'],
    'lance': ['수련용 창', '강철 창', '청동 장창', '미늘 창', '수호 창', '붉은 창', '화염창', '사자문 창', '빙결창', '번개창', '성기사의 창', '용혈창', '그림자 창', '광휘의 창', '천공의 창'],
    'lute': ['나그네의 류트', '버드의 류트', '학자의 류트', '축제의 류트', '요정의 류트', '월하의 류트', '바다의 류트', '순례자의 류트', '성가의 류트', '바람의 류트', '황금의 류트',
             '벚꽃의 류트', '용비의 류트', '천상의 류트', '영혼의 류트', '별무리의 류트', '서약의 류트', '환상의 류트', '고왕의 류트', '차원의 류트', '영원의 류트'],
    'card': ['낡은 카드 뭉치', '노름꾼의 덱', '하트 덱', '스페이드 덱', '다이아 덱', '토끼 놀이 카드', '고양이 카드', '조커 덱', '달빛 카드', '별빛 카드', '왕실 트럼프', '기사의 덱',
             '용의 카드', '천사의 카드', '신비의 카드', '운명의 카드', '화원의 카드', '카지노 덱', '환상의 카드', '광대의 카드', '시간의 카드'],
    'compound': ['훈련용 컴파운드 보우', '강화 컴파운드 보우', '사냥꾼의 컴파운드 보우', '정밀 컴파운드 보우', '수렵단 컴파운드 보우', '바람추적자 컴파운드 보우', '고대 숲 컴파운드 보우',
                 '황금 기계식 컴파운드 보우', '흑철 컴파운드 보우', '빙하 컴파운드 보우', '천공의 컴파운드 보우', '독룡의 컴파운드 보우', '화염룡 컴파운드 보우', '심연의 컴파운드 보우',
                 '세계수의 컴파운드 보우'],
    'longbow': ['연습용 장궁', '숲지기의 장궁', '사냥꾼의 장궁', '철제 장궁', '은빛 장궁', '붉은 사냥 장궁', '바람결 장궁', '황금림 장궁', '늑대뼈 장궁', '백작의 장궁', '흑요석 장궁',
                '세계수 가지 장궁', '천공의 장궁', '용린 장궁', '번개의 장궁', '심연의 장궁', '태양왕의 장궁', '천궁의 장궁'],
}
# 게임 이름을 두고 새로 더한 그림 이름만 (16장 뒤)
EXTRA = {
    'sword': ['심연의 장검', '그림자 제왕검', '서리 성검', '신성한 기사검', '전설의 장검'],
    'necro': ['손의 서', '기형의 서', '봉인의 서', '차원연결의 서', '인피의 서'],
    'orb': ['성좌의 구슬', '원소 융합 구슬', '무한의 구슬', '차원 편린 구슬', '신격의 구슬'],
    'whip': ['성광의 채찍', '구속의 채찍', '사령의 채찍', '차원의 채찍', '절대의 채찍'],
    'machete': ['원시의 정글칼', '잃어버린 도시의 칼', '신수의 쿠크리', '태고의 정글칼', '정글의 지배자'],
    'wxbow': ['고대 기술 손목 석궁', '월광 손목 석궁', '용연 손목 석궁', '차원의 손목 석궁', '신궁의 손목 석궁'],
}
KEEP16 = {'sword', 'dagger', 'compbow', 'greatbow', 'wand', 'necro', 'orb', 'whip', 'machete', 'wxbow'}   # 앞 16장은 게임 이름 그대로


def rgba_crop(sub, item):
    ys, xs = np.nonzero(item)
    a, b, c, d = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgb = sub[a:b, c:d].astype(np.uint8).copy(); m = item[a:b, c:d]
    rgb[~m] = (2, 1, 2)   # 줄일 때 가장자리가 테 색으로 섞이게
    return Image.fromarray(np.dstack([rgb, (m * 255).astype(np.uint8)]), 'RGBA')


def flood_bg(sub, seed, step, tabs, ref, hue):
    """가장자리(seed)에서 이웃 칸끼리 색 차이 step 이하 · 바탕 색(ref)과 차이 tabs 이하인 칸으로 퍼뜨린다"""
    H, W, _ = sub.shape
    near = (np.abs(sub - ref).sum(axis=2) <= tabs) & hue
    seen = seed & near; q = deque(zip(*np.nonzero(seen)))
    while q:
        y, x = q.popleft()
        for a, b in N4:
            ny, nx = y + a, x + b
            if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and near[ny, nx] and np.abs(sub[ny, nx] - sub[y, x]).sum() <= step:
                seen[ny, nx] = True; q.append((ny, nx))
    return seen


def flood_grad(sub, seed, tol=14, vmax=150, tmin=36):
    """바탕에서 이웃 칸끼리 색이 고르게 이어지는 빛 번짐을 따라 더 퍼뜨린다 — 검은 테(빛깔 합 tmin 아래) · 밝은 칸(vmax 넘음) · 색이 tol 넘게 뛰는 곳에서 멈춘다"""
    H, W, _ = sub.shape; seen = seed.copy(); tot = sub.sum(axis=2); mx = sub.max(axis=2)
    q = deque(zip(*np.nonzero(seed)))
    while q:
        y, x = q.popleft()
        for a, b in N4:
            ny, nx = y + a, x + b
            if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and tot[ny, nx] >= tmin and mx[ny, nx] <= vmax and np.abs(sub[ny, nx] - sub[y, x]).sum() <= tol:
                seen[ny, nx] = True; q.append((ny, nx))
    return seen


def cut(im, box, tm=(), inset=0, step=16, tabs=60, frac=0.05, hole=34):
    """① 칸 가장자리 바탕 색(ref)에서 고르게 이어지는 칸을 퍼뜨려 지운다 (푸른 바탕이면 어두운 무채색 — 검은 손잡이 · 흑철 날 — 은 바탕이 아니다)
    ② 빛 번짐(높은 단계 그림 둘레)을 따라 더 ③ 안에 갇힌 바탕 색 덩어리(활시위 안 · 고리 속)와 거기서 이어지는 어두운 번짐
    ④ 칸 위 · 아래 1/4 안의 가는 가로 줄(카드 칸 나눔 줄) 떼기 ⑤ 큰 덩어리만(가장 큰 것의 frac 넘음 — 떨어진 작은 반짝이는 버린다)"""
    x0, y0, x1, y1 = box; P = inset
    sub = im[y0 + P:y1 - P, x0 + P:x1 - P].astype(int); H, W, _ = sub.shape
    edge = np.zeros((H, W), bool); edge[0] = edge[-1] = True; edge[:, 0] = edge[:, -1] = True
    ref = np.median(np.concatenate([sub[0], sub[-1], sub[:, 0], sub[:, -1]]), axis=0)
    rb = ref[2] - ref[0]
    hue = ((sub[..., 2] - sub[..., 0]) >= rb - 14) if rb >= 15 else np.ones((H, W), bool)
    force = np.zeros((H, W), bool)
    for (a, b, c, d) in tm:
        force[max(0, b - y0 - P):max(0, d - y0 - P), max(0, a - x0 - P):max(0, c - x0 - P)] = True
    bg = flood_bg(sub, edge | force, step, tabs, ref, hue) | force
    bg = flood_grad(sub, bg)
    d0 = np.abs(sub - ref).sum(axis=2)
    n, lab, st, _ = cv2.connectedComponentsWithStats(((d0 <= hole) & ~bg & hue).astype(np.uint8), 4)
    seed = np.isin(lab, [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] >= 12])
    if seed.any():
        ok = ~bg & (d0 <= tabs) & (sub.max(axis=2) <= 90) & hue
        seen = seed.copy(); q = deque(zip(*np.nonzero(seed)))
        while q:
            y, x = q.popleft()
            for a, b in N4:
                ny, nx = y + a, x + b
                if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and ok[ny, nx] and np.abs(sub[ny, nx] - sub[y, x]).sum() <= 14:
                    seen[ny, nx] = True; q.append((ny, nx))
        bg |= seen
    item = ~bg
    hl = cv2.morphologyEx(item.astype(np.uint8), cv2.MORPH_OPEN, np.ones((1, 40), np.uint8)).astype(bool)
    thick = cv2.morphologyEx(item.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 1), np.uint8)).astype(bool)
    band = np.zeros((H, W), bool); band[:H // 4] = True; band[H * 3 // 4:] = True
    item &= ~(hl & ~thick & band)
    n, lab, st, _ = cv2.connectedComponentsWithStats(item.astype(np.uint8), 8)
    area = st[:, cv2.CC_STAT_AREA].astype(float); area[0] = 0
    return rgba_crop(sub, np.isin(lab, [k for k in range(1, n) if area[k] >= frac * area.max()]))


def cut_gc(im, box, keep_pts=()):
    """빛 원판 · 점선 고리 · 반짝이가 깔린 큰 카드(장궁 마지막 그림): 금빛 · 흰빛 칸을 앞으로 잡고 GrabCut → 가장 큰 덩어리 → 막힌 구멍 채움 →
    활에 붙은 파란 보석(빛 원판과 색이 같아 GrabCut이 바탕으로 본다)은 판 좌표 keep_pts에 있는 덩어리만 되살린다"""
    x0, y0, x1, y1 = box
    sub = im[y0:y1, x0:x1].copy(); H, W, _ = sub.shape
    hsv = cv2.cvtColor(sub, cv2.COLOR_RGB2HSV).astype(int); Hh, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
    mask[((Hh >= 10) & (Hh <= 32) & (S >= 90) & (V >= 120)) | ((S <= 50) & (V >= 175))] = cv2.GC_PR_FGD
    mask[:3] = mask[-3:] = cv2.GC_BGD; mask[:, :3] = mask[:, -3:] = cv2.GC_BGD
    bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    cv2.setRNGSeed(0)
    cv2.grabCut(cv2.cvtColor(sub, cv2.COLOR_RGB2BGR), mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
    item = (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)
    n, lab, st, _ = cv2.connectedComponentsWithStats(item.astype(np.uint8), 8)
    item = lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    n, lab, st, _ = cv2.connectedComponentsWithStats((~item).astype(np.uint8), 4)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])).tolist())
    for k in range(1, n):
        if k not in border and st[k, cv2.CC_STAT_AREA] < 2500: item |= lab == k
    crys = (Hh >= 90) & (Hh <= 125) & (V >= 150) & (S >= 70)
    n, lab, st, _ = cv2.connectedComponentsWithStats(crys.astype(np.uint8), 8)
    for (px, py) in keep_pts:
        k = lab[py - y0, px - x0]
        if k: item |= cv2.dilate((lab == k).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)   # 보석 둘레 테 한 칸까지
    return rgba_crop(sub.astype(int), item)


def lab_box(im, box):
    """카드 판: 칸 아래쪽의 노란 「LvN」 글씨 덩어리 (판 좌표) — 떨어진 숫자(「Lv7」 옆 「0」)도 같은 줄이면 묶는다"""
    x0, y0, x1, y1 = box; sub = im[y0:y1, x0:x1].astype(int); H, W, _ = sub.shape
    R, G, B = sub[..., 0], sub[..., 1], sub[..., 2]
    yel = (R > 190) & (G > 165) & (B < 130) & (R - B > 80)
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(yel.astype(np.uint8), np.ones((3, 9), np.uint8)), 8)
    best = None
    for k in range(1, n):
        x, y, w, h, a = st[k]
        if 30 <= w <= W * 0.8 and 14 <= h <= 40 and y > H * 0.45 and W * 0.2 < x + w / 2 < W * 0.8 and (best is None or y > best[1]): best = (x, y, w, h)
    if best is None: raise SystemExit(f'「Lv」 글씨를 못 찾음: {box}')
    bx0, by0, bx1, by1 = best[0], best[1], best[0] + best[2], best[1] + best[3]
    for k in range(1, n):
        x, y, w, h, a = st[k]
        if a >= 12 and min(by1, y + h) - max(by0, y) >= 0.5 * min(h, by1 - by0) and W * 0.1 < x + w / 2 < W * 0.9:
            bx0, by0, bx1, by1 = min(bx0, x), min(by0, y), max(bx1, x + w), max(by1, y + h)
    return (x0 + bx0, y0 + by0, x0 + bx1, y0 + by1)


def cards(key):
    fn, style, boxes, opt = SHEETS[key]
    im = np.asarray(Image.open(os.path.join(HERE, fn)).convert('RGB'))
    out = []
    for i, box in enumerate(boxes):
        if i in opt.get('gc', {}): out.append(cut_gc(im, box, opt['gc'][i])); continue
        tm = list(opt.get('tm', {}).get(i, ()))
        if style == 'card':   # 「LvN」 글씨 판(테 포함)과 그 아래 이름 줄은 바탕 — 카드 테 줄 안쪽(3칸)부터
            lb = opt.get('lab', {}).get(i) or lab_box(im, box)
            tm += [(lb[0] - 7, lb[1] - 6, lb[2] + 7, lb[3] + 5), (box[0], lb[3] + 3, box[2], box[3])]
        out.append(cut(im, box, tm, 3 if style == 'card' else 0))
    return [c for i, c in enumerate(out) if i not in opt.get('drop', [])]


def game_order(key, L):
    """판 차례 → 게임 그림 차례 (1차 무기: 단계 번호 차례 · 그 밖: 그대로)"""
    if key not in FIRST: return list(L)
    head = [None] * len(LV_ORDER)
    for p, t in enumerate(LV_ORDER): head[t] = L[p]
    return head + list(L[len(LV_ORDER):])


def shrink(img):
    w, h = img.size; s = SIZE / max(w, h)
    return img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)


def main(out_js, prev=None):
    art, names, thumbs = {}, {}, []
    for key in SHEETS:
        imgs = game_order(key, cards(key))
        urls = []
        for img in imgs:
            sm = shrink(img); buf = io.BytesIO(); sm.save(buf, 'WEBP', quality=90, method=6)
            urls.append('data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()); thumbs.append((key, len(urls) - 1, sm))
        art[key] = urls
        if key in NAMES:
            nm = game_order(key, NAMES[key]); assert len(nm) == len(urls), (key, len(nm), len(urls)); names[key] = nm
        else:
            assert key in KEEP16 and len(urls) == 16 + len(EXTRA.get(key, [])), (key, len(urls))
    q = lambda s: "'" + s + "'"
    lines = ['/* 사용자가 준 무기 판 20장 (빌드 67, 11-13 11:54 「우선 이장비들 적용시켜서」) — 그대로 오려 쓴다. 손으로 고치지 말고 tools/saved/weapart67/export_wart.py로 다시 뽑는다.',
             '   GEARART[종류][그림 차례] = WebP data URL (data-rpg.js가 GEARART = {}를 먼저 만든다 · data-weap67.js가 GTYPES[종류].art를 단다).',
             '   그림 차례: 1차부터 쓰는 무기는 단계 번호(GTIERS — 8번 백작 Lv76 · 9번 망령 Lv70, 16장 뒤는 단계가 늘면), 2차 직업 무기는 착용 레벨 사다리(ARM_LADDER Lv50 · 55 · 60 …).',
             '   이름: 새 종류 · 그림이 새로 바뀐 종류는 판 이름, 판 글씨가 게임 이름을 옮겨 적은 종류는 게임 이름에 새로 더한 그림 이름만 붙인다. */',
             'Object.assign(GEARART, {']
    for key, urls in art.items():
        lines.append(f'  {key}: [')
        lines += [f"    '{u}'," for u in urls]
        lines.append('  ],')
    lines.append('});')
    lines.append('Object.assign(WNAME, {')
    for key, nm in names.items(): lines.append(f'  {key}: [{", ".join(q(s) for s in nm)}],')
    lines.append('});')
    for key, ex in EXTRA.items(): lines.append(f'WNAME.{key} = WNAME.{key}.slice(0, 16).concat([{", ".join(q(s) for s in ex)}]);')
    open(out_js, 'w').write('\n'.join(lines) + '\n')
    total = sum(len(u) for v in art.values() for u in v)
    print('GEARART', {k: len(v) for k, v in art.items()}, f'{total / 1024:.0f}KB')
    if prev:
        cw = SIZE + 10; rows = list(art)
        sheet = Image.new('RGB', (22 * cw + 90, len(rows) * (cw + 14) + 8), (30, 34, 48)); d = ImageDraw.Draw(sheet)
        for (key, i, t) in thumbs:
            r = rows.index(key); x, y = 90 + i * cw, 8 + r * (cw + 14)
            if i == 0: d.text((6, y + 40), key, fill=(255, 220, 120))
            sheet.paste(t, (x + (SIZE - t.width) // 2, y + (SIZE - t.height) // 2), t)
            d.text((x + 2, y + SIZE + 2), str(i), fill=(200, 200, 200))
        sheet.save(prev)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
