"""전사 방어구 디자인 그림 그대로 → src/data-armart.js (ARMART)
사용자 11-12 10:50 「다시찍지말고 그대로 사용」 — 다시 그리지 않고, 사용자가 준 시안 판에서
단계마다 장비 그림만 오려(카드 바탕 · LV 글씨 · Lv200 월계관 빼기) 바탕을 투명하게 하고, 긴 쪽 SIZE px로 줄여 WebP data URL로 넣는다.
- 경갑 상의 · 하의(이 폴더, 어두운 카드 · 글씨 판 왼쪽 위) → larmor · lpants
- 중갑 상의 · 하의(../armor_heavy65, 흰 바둑판 바탕 · 글씨 판 그림 아래, 11-12 11:27) → hvarmor · hvpants
- 판금 상의 · 하의(../armor_plate65, 한 판에 둘 · 어두운 카드 · 글씨 판 카드 아래쪽, 11-12 12:04 새 판 — 11:28 판은 지움) → plate · ppants
- 천갑 상의 · 하의(../armor_cloth65, 판금과 같은 꼴의 판, 11-12 12:07) → cloth · cpants
- 신발 셋(../boots65, 판마다 3줄 × 7, 11-12 12:24) → pboots(판금신발 — 받은 판 이름은 철신발) · lboots(가죽신발) · cboots(천신발)
- 장갑 셋(../gloves65) · 벨트(../belt65) — 경갑 판과 같은 꼴(5 × 4 + Lv200), 11-12 12:54 → pgloves · lgloves · cgloves · belt
python3 export_armart.py <출력 data-armart.js> [미리보기.png]"""
import base64, io, os, sys
from collections import deque
import numpy as np
from PIL import Image
import cv2
HERE = os.path.dirname(os.path.abspath(__file__))
SIZE = 96
SHEETS = {'larmor': ('경갑_상의_Lv1-200.png', [13, 329, 634, 924, 1224], [315, 620, 910, 1210, 1523], [94, 271, 448, 626], [259, 435, 613, 792], (13, 805, 431, 995)),
          'lpants': ('경갑_하의_Lv1-200.png', [13, 327, 633, 925, 1224], [313, 619, 910, 1210, 1522], [93, 271, 445, 619], [260, 433, 608, 779], (13, 795, 434, 997))}
N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))


def flood(ok, H, W):
    """가장자리에서 ok인 칸을 퍼뜨린다"""
    seen = np.zeros((H, W), bool)
    q = deque([(y, x) for y in range(H) for x in (0, W - 1)] + [(y, x) for x in range(W) for y in (0, H - 1)])
    while q:
        y, x = q.popleft()
        if seen[y, x] or not ok[y, x]: continue
        seen[y, x] = True
        for dy, dx in N4:
            ny, nx = y + dy, x + dx
            if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and ok[ny, nx]: q.append((ny, nx))
    return seen


def comps(m):
    """연결된 덩어리 번호 (4방향)"""
    H, W = m.shape; lab = np.zeros((H, W), int); n = 0
    for y in range(H):
        for x in range(W):
            if m[y, x] and not lab[y, x]:
                n += 1; q = deque([(y, x)]); lab[y, x] = n
                while q:
                    a, b = q.popleft()
                    for dy, dx in N4:
                        na, nb = a + dy, b + dx
                        if 0 <= na < H and 0 <= nb < W and m[na, nb] and not lab[na, nb]: lab[na, nb] = n; q.append((na, nb))
    return lab, n


def cut(im, box, glow, ibox=None, lab=None):
    """ibox = 그림 둘레 상자(카드 안에서 LV 글씨 판을 빼고 찾은 것, find_box). 그 둘레에서 바탕을 지운다"""
    if glow:   # Lv200: 빛나는 바탕 · 반짝이 · 월계관 → GrabCut(OpenCV)으로 장비만 (상자 = 가운데, 월계관 밖)
        import cv2
        x, y, w, h = ibox; P = 6
        sub = im[y - P:y + h + P, x - P:x + w + P].copy(); H, W, _ = sub.shape
        mask = np.zeros((H, W), np.uint8); bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
        cv2.grabCut(cv2.cvtColor(sub, cv2.COLOR_RGB2BGR), mask, (P - 2, P - 2, w + 4, h + 4), bgd, fgd, 8, cv2.GC_INIT_WITH_RECT)
        item = (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)
        lab, n = comps(item); cnt = np.bincount(lab.reshape(-1), minlength=n + 1); cnt[0] = 0
        item = lab == int(cnt.argmax())
        item = ~flood(~item, H, W)   # 장비 안쪽 구멍(목 구멍 같은 어두운 칸)은 채운다
        sub = sub.astype(int)
    else:      # 카드 바탕(남빛 (20, 18, 25) 언저리)만 지운다 — 그림의 검은 테(거의 (2, 1, 2))는 남는다
        x, y, w, h = ibox; P = 4
        sub = im[y - P:y + h + P, x - P:x + w + P].astype(int); H, W, _ = sub.shape
        b0 = np.median(np.concatenate([sub[0], sub[-1], sub[:, 0], sub[:, -1]]), axis=0)
        bg = flood(np.abs(sub - b0).sum(axis=2) <= 22, H, W)
        if lab:   # 글씨 판과 그 둘레 옅은 그림자는 바탕으로
            lx0, ly0, lx1, ly1 = lab
            bg[max(0, ly0 - (y - P)):max(0, ly1 - (y - P)), max(0, lx0 - (x - P)):max(0, lx1 - (x - P))] = True
        lab, n = comps(~bg)
        cy0, cy1, cx0, cx1 = H // 4, H * 3 // 4, W // 3, W * 2 // 3
        mid = np.bincount(lab[cy0:cy1, cx0:cx1].reshape(-1), minlength=n + 1); mid[0] = 0
        item = lab == int(mid.argmax())
    ys, xs = np.nonzero(item)
    a, b, c, d = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgb = sub[a:b, c:d].astype(np.uint8); m = item[a:b, c:d]
    rgb[~m] = (2, 1, 2)   # 줄일 때 가장자리가 테 색으로 섞이게
    return Image.fromarray(np.dstack([rgb, (m * 255).astype(np.uint8)]), 'RGBA')


def label_rect(im, card):
    """카드 왼쪽 위 「LV.n」 글씨 판 자리(절대 좌표) — 판은 카드 테에서 x 2~118 · y 2~41(세 자리 수 판까지)"""
    x0, y0 = card[0], card[1]
    return (x0, y0, x0 + 119, y0 + 43)


def find_box(im, card, last):
    """카드 안 그림 둘레 상자: 바탕과 다른 칸(LV 글씨 판 자리는 빼고)이 몰린 범위"""
    x0, y0, x1, y1 = card; pad = 10
    sub = im[y0 + pad:y1 - pad, x0 + pad:x1 - pad].astype(int)
    flat = sub.reshape(-1, 3); vals, cnt = np.unique(flat // 4, axis=0, return_counts=True); bg = vals[cnt.argmax()] * 4 + 2
    m = np.abs(sub - bg).sum(axis=2) > 40
    lab_w, lab_h = (140, 50) if last else (130, 46)
    m[:lab_h, :lab_w] = False
    if last:
        cx = m.shape[1] // 2 + 30; m[:, :cx - 95] = False; m[:, cx + 95:] = False
    ys, xs = np.nonzero(m)
    def span(v, n):
        hh = np.bincount(v, minlength=n); ok = np.nonzero(hh > 2)[0]; return ok.min(), ok.max()
    ax0, ax1 = span(xs, m.shape[1]); ay0, ay1 = span(ys, m.shape[0])
    return (x0 + pad + ax0, y0 + pad + ay0, ax1 - ax0 + 1, ay1 - ay0 + 1)


def shrink(img):
    w, h = img.size; s = SIZE / max(w, h)
    return img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)


# 흰 바둑판 바탕(가짜 투명) 판 — 중갑. 「LV」 글씨 판이 그림 바로 아래라 줄마다 (그림 위 y, 글씨 판 위 y)까지만 본다. 칸 = 가운데 x ± HW
HVDIR = os.path.join(HERE, '..', 'armor_heavy65')
LIGHT = {'hvarmor': ('중갑_상의_Lv1-200.png', [132, 384, 636, 887, 1138, 1389, 1643], [(0, 233), (282, 508), (556, 792)], 125),
         'hvpants': ('중갑_하의_Lv1-200.png', [142, 396, 649, 902, 1157, 1411], [(0, 197), (246, 448), (497, 701), (750, 956)], 125)}
LIGHT_EXT = {('hvarmor', 20): (803, (1566, 791, 1721, 803))}   # Lv200 상의: 망토 자락이 글씨 판 양옆으로 더 내려온다 → (칸 아래 y, 바탕으로 칠 글씨 판 자리 x0 y0 x1 y1)
# 어두운 카드 판 — 판금(사용자 11-12 12:04 새 판 「판금 다 삭제, 첫 이미지로 판금 대체」) · 천갑(12:07 「두번째는 천갑 상, 하의야 추가해」).
# 한 판에 상의 · 하의, 맨 위 제목 줄(제작자 이름)은 저장할 때 뺐다. 종류 → (폴더, 판, 줄마다 (카드 안 위 y, 글씨 판 위 y, [카드 왼쪽 테 x], 카드 너비)).
# 카드 간격이 고르지 않아 테 자리를 판에서 재어 적었다(카드 위 테 줄이 끊기는 자리 · 세로 테). 칸 = 테 안쪽 4칸부터
PLDIR = os.path.join(HERE, '..', 'armor_plate65'); CLDIR = os.path.join(HERE, '..', 'armor_cloth65'); BTDIR = os.path.join(HERE, '..', 'boots65')
PL7 = [505, 650, 795, 940, 1085, 1229, 1373]; CL7 = [502, 649, 794, 938, 1083, 1227, 1373]
DARK = {'plate': (PLDIR, '판금_상의하의_Lv1-200.png', [(84, 178, PL7, 134), (225, 320, PL7, 134), (367, 465, PL7, 134)]),
        'ppants': (PLDIR, '판금_상의하의_Lv1-200.png', [(596, 694, [31, 167, 302, 436, 571, 705, 840, 975, 1109, 1243, 1378], 124),
                                                      (746, 852, [31, 175, 322, 468, 613, 758, 904, 1050, 1197, 1345], 132)]),
        'cloth': (CLDIR, '천갑_상의하의_Lv1-200.png', [(73, 160, CL7, 134), (207, 295, CL7, 134), (342, 440, CL7, 134)]),
        'cpants': (CLDIR, '천갑_상의하의_Lv1-200.png', [(577, 679, [30, 167, 303, 437, 573, 707, 842, 978, 1112, 1246, 1382], 124),
                                                      (732, 849, [31, 181, 329, 477, 621, 769, 915, 1062, 1209, 1355], 134)]),
        # 신발(사용자 11-12 12:24 — 한 판에 3줄 × 7, 카드마다 (왼쪽 테, 오른쪽 테)): 판금신발(받은 판 이름은 철신발) · 가죽신발 · 천신발
        'pboots': (BTDIR, '판금신발_Lv1-200.png', [(y, yb, [(396, 548), (557, 708), (718, 869), (878, 1029), (1039, 1190), (1199, 1351), (1361, 1513)], 0)
                                               for y, yb in [(110, 277), (355, 516), (599, 777)]]),
        'lboots': (BTDIR, '가죽신발_Lv1-200.png', [(y, yb, [(393, 546), (555, 707), (716, 867), (875, 1027), (1036, 1186), (1195, 1348), (1357, 1512)], 0)
                                               for y, yb in [(112, 276), (355, 517), (602, 779)]]),
        'cboots': (BTDIR, '천신발_Lv1-200.png', [(y, yb, [(398, 551), (560, 711), (721, 871), (880, 1031), (1040, 1191), (1200, 1352), (1362, 1515)], 0)
                                             for y, yb in [(110, 278), (356, 519), (601, 780)]])}


def mid_comp(lab, n, H, W):
    """가운데를 가장 많이 덮는 덩어리"""
    cy0, cy1, cx0, cx1 = H // 4, H * 3 // 4, W // 3, W * 2 // 3
    mid = np.bincount(lab[cy0:cy1, cx0:cx1].reshape(-1), minlength=n + 1); mid[0] = 0
    return lab == int(mid.argmax())


def rgba(sub, item, alpha=None):
    ys, xs = np.nonzero(item)
    a, b, c, d = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgb = sub[a:b, c:d].astype(np.uint8).copy(); m = item[a:b, c:d]
    al = (m * 255).astype(np.uint8) if alpha is None else alpha[a:b, c:d].astype(np.uint8)
    rgb[al == 0] = (2, 1, 2)   # 줄일 때 가장자리가 테 색으로 섞이게
    return Image.fromarray(np.dstack([rgb, al]), 'RGBA')


def close_edges(sub, item, n=2):
    """칸 가장자리에서 잘린 곳(글씨 판에 가린 아래 · 옆 칸에 닿은 옆)은 검은 테로 닫는다"""
    sub = sub.copy(); H, W = item.shape
    for sl in [(slice(0, n), slice(None)), (slice(H - n, H), slice(None)), (slice(None), slice(0, n)), (slice(None), slice(W - n, W))]:
        m = np.zeros_like(item); m[sl] = True; m &= item
        sub[m] = (2, 1, 2)
    return sub


def flood_grad(sub, seed, tol=10, vmin=0):
    """바탕에서 이웃 칸끼리 색이 고르게 이어지는 곳(옆 카드의 빛 번짐)을 따라 더 퍼뜨린다 — 검은 테(합 24 아래) · 밝은 칸(120 넘음)에서 멈춘다"""
    H, W, _ = sub.shape; seen = seed.copy(); tot = sub.sum(axis=2); mx = sub.max(axis=2)
    q = deque(zip(*np.nonzero(seed)))
    while q:
        y, x = q.popleft()
        for dy, dx in N4:
            ny, nx = y + dy, x + dx
            if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and tot[ny, nx] >= 25 and vmin <= mx[ny, nx] <= 120 and np.abs(sub[ny, nx] - sub[y, x]).sum() <= tol:
                seen[ny, nx] = True; q.append((ny, nx))
    return seen


def cut_light(im, x0, y0, x1, y1, blank=None):
    """흰 바둑판 바탕: 밝고 무채색인 칸을 가장자리에서 퍼뜨려 지운다(검은 테에서 멈춘다).
    테 바깥 두 칸(흰 바탕과 섞인 칸)은 검은 테 색 + 어두운 만큼만 보이게 — 어두운 칸 위에서 흰 테두리가 남지 않게"""
    sub = im[y0:y1, x0:x1].astype(int); H, W, _ = sub.shape
    mn, mx = sub.min(axis=2), sub.max(axis=2)
    ok = (mn >= 200) & (mx - mn <= 30)
    if blank:
        bx0, by0, bx1, by1 = blank; ok[max(0, by0 - y0):max(0, by1 - y0), max(0, bx0 - x0):max(0, bx1 - x0)] = True
    bg = flood(ok, H, W)
    lab, n = comps(~bg)
    item = mid_comp(lab, n, H, W)
    item = ~flood(~item, H, W)   # 안쪽 구멍(다른 덩어리)은 채운다
    d = cv2.distanceTransform(item.astype(np.uint8), cv2.DIST_L2, 3)
    edge = item & (d <= 2.2)
    L = sub.mean(axis=2)
    al = np.where(item, 255.0, 0.0)
    al[edge] = np.clip((246.0 - L[edge]) / 206.0, 0, 1) * 255
    sub = close_edges(sub, item); sub[edge] = (2, 1, 2)
    return rgba(sub, item, al)


def cut_dark(im, x0, y0, x1, y1, glow, spill=False):
    """어두운 카드 바탕: 카드 안 가장자리 색(거의 (10, 10, 14))에서 ±12인 칸을 퍼뜨려 지운다 — 검은 테(0~3)는 남는다.
    Lv200(빛나는 바탕 · 월계관)은 GrabCut으로 장비만"""
    sub = im[y0:y1, x0:x1].astype(int); H, W, _ = sub.shape
    if glow:   # Lv200: 빛나는 금빛 바탕 · 월계관 · 반짝이 (신발 판은 어두운 갈색 바탕도)
        # ① 금 · 주황 빛깔(채도 높고 어둡지 않음)만 지나가며 가장자리에서 퍼뜨려 바탕 빛 · 월계관을 지운다(검은 테 · 은빛 · 푸른 천에서 멈춘다)
        hsv = cv2.cvtColor(sub.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(int)   # H 0~179 · S · V 0~255
        Hh, Ss, Vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]
        warm = (Hh >= 8) & (Hh <= 30) & (Ss >= 120) & (Vv >= 40)
        bg = flood(warm | (np.abs(sub - np.median(np.concatenate([sub[0], sub[-1]]), axis=0)).sum(axis=2) <= 12), H, W)
        if glow == 2:   # ② 신발 판: 어두운 갈색 바탕은 테와 밝기로 못 가른다 → 밝은 칸(장비)에서 세 칸 넘게 떨어진 어두운 칸만 더 지운다(테는 장비 바로 옆이라 남는다)
            solid = (~bg & (Vv >= 50)).astype(np.uint8)
            far = cv2.distanceTransform(1 - solid, cv2.DIST_L2, 3) > 3.2
            bg = flood(bg | ((Vv < 50) & far), H, W)
        m = cv2.morphologyEx((~bg).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))   # 월계관 줄기 · 반짝이 같은 가는 부스러기 떼기
        lab, n = comps(m.astype(bool))
        item = mid_comp(lab, n, H, W)
        item = cv2.morphologyEx(item.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))).astype(bool)   # 금 장식이 바탕 빛과 붙어 파인 자리 메우기
        item = ~flood(~item, H, W)
        return rgba(close_edges(sub, item), item)
    b0 = np.median(np.concatenate([sub[0], sub[-1], sub[:, 0], sub[:, -1]]), axis=0)
    ok = np.abs(sub - b0).sum(axis=2) <= 12
    ok[:3] |= sub[:3].sum(axis=2) <= 36   # 카드 위 테 밑 그늘 줄
    bg = flood(ok, H, W)
    if spill: bg = flood_grad(sub, bg)   # Lv190: 옆 Lv200 카드의 빛 번짐
    lab, n = comps(~bg)
    item = mid_comp(lab, n, H, W)
    item = ~flood(~item, H, W)
    return rgba(close_edges(sub, item), item)


# 장갑 · 벨트 판(사용자 11-12 12:54 — 경갑 판과 같은 꼴: 어두운 카드 5 × 4 + Lv200 한 장, 「LV.n」 글씨 판이 카드 왼쪽 위 모서리). 장갑은 한 카드에 두 짝이라 덩어리를 여럿 남긴다
GLDIR = os.path.join(HERE, '..', 'gloves65'); BEDIR = os.path.join(HERE, '..', 'belt65')
GX0 = [12, 328, 634, 924, 1223]; GX1 = [315, 620, 910, 1210, 1523]
GRID = {'cgloves': (GLDIR, '천장갑_Lv1-200.png', [94, 271, 447, 624], [260, 436, 613, 791], (12, 804, 430, 996)),
        'pgloves': (GLDIR, '판금장갑_Lv1-200.png', [95, 272, 448, 626], [260, 436, 614, 792], (12, 805, 431, 997)),
        'lgloves': (GLDIR, '가죽장갑_Lv1-200.png', [93, 271, 447, 623], [260, 435, 611, 791], (13, 805, 434, 998)),
        'belt': (BEDIR, '벨트_Lv1-200.png', [94, 270, 435, 596], [259, 423, 584, 764], (12, 778, 482, 999))}
GRID_LAB = [(107, 44)] + [(113, 44)] * 9 + [(126, 44)] * 10 + [(149, 54)]   # 글씨 판 크기(카드 왼쪽 위에서, 한 자리 · 두 자리 · 세 자리 · Lv200) — 오른쪽 아래 모서리는 둥글다


def cut_grid(im, card, labwh, glow):
    """카드 안(테 안쪽 6칸)에서 바탕을 지우고, 글씨 판(둥근 판)을 빼고, 남은 덩어리 가운데 큰 것들(가장 큰 것의 6% 넘음)을 모두 남긴다"""
    x0, y0, x1, y1 = card; P = 6
    sub = im[y0 + P:y1 - P, x0 + P:x1 - P].astype(int); H, W, _ = sub.shape
    lw, lh = labwh[0] - P, labwh[1] - P; R = 18
    yy, xx = np.mgrid[0:H, 0:W]
    labm = (xx <= lw) & (yy <= lh) & ~((xx > lw - R) & (yy > lh - R) & ((xx - (lw - R)) ** 2 + (yy - (lh - R)) ** 2 > R * R))
    b0 = np.median(np.concatenate([sub[-1], sub[H // 2:, 0], sub[H // 2:, -1]]), axis=0)   # 글씨 판이 없는 아래 · 옆 가장자리 색
    near = np.abs(sub - b0).sum(axis=2) <= 12
    if glow:   # Lv200: 금빛 · 월계관 · 반짝이 — cut_dark의 신발 판 길과 같다
        hsv = cv2.cvtColor(sub.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(int)
        Hh, Ss, Vv = hsv[..., 0], hsv[..., 1], hsv[..., 2]
        warm = (Hh >= 8) & (Hh <= 30) & (Ss >= 120) & (Vv >= 40)
        bg = flood(warm | near | labm, H, W)
        solid = (~bg & (Vv >= 50)).astype(np.uint8)
        far = cv2.distanceTransform(1 - solid, cv2.DIST_L2, 3) > 3.2
        bg = flood(bg | ((Vv < 50) & far) | labm, H, W)
        bg = flood_grad(sub, bg, 10, 32)   # 두 짝 사이에 남는 흐린 갈색 빛(채도가 낮아 위에서 안 지워진 것)은 고르게 이어지는 색을 따라 지운다 — 밝기 32 아래(어두운 갈색 테 · 어두운 가죽)로는 안 들어간다
        m = cv2.morphologyEx((~bg).astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
    else:
        bg = flood(near | labm, H, W)
        m = ~bg
    m &= ~labm
    lab, n = comps(m)
    cnt = np.bincount(lab.reshape(-1), minlength=n + 1); cnt[0] = 0
    keep = [k for k in range(1, n + 1) if cnt[k] >= 0.06 * cnt.max()]
    item = np.isin(lab, keep)
    if glow: item = cv2.morphologyEx(item.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))).astype(bool) & ~labm
    item = ~flood(~item, H, W)
    return rgba(close_edges(sub, item), item)


def cards_grid(key):
    d, fn, Y0, Y1, last = GRID[key]
    im = np.asarray(Image.open(os.path.join(d, fn)).convert('RGB'))
    cards = [(GX0[c], Y0[r], GX1[c], Y1[r]) for r in range(4) for c in range(5)] + [last]
    return [cut_grid(im, box, GRID_LAB[i], i == 20) for i, box in enumerate(cards)]


def cards_light(key):
    fn, CX, ROWS, HW = LIGHT[key]
    im = np.asarray(Image.open(os.path.join(HVDIR, fn)).convert('RGB'))
    out = []
    for (ya, yb) in ROWS:
        for cx in CX:
            if len(out) >= 21: continue
            yb2, blank = LIGHT_EXT.get((key, len(out)), (yb - 2, None))
            out.append(cut_light(im, max(0, cx - HW), ya, min(im.shape[1], cx + HW), yb2, blank))
    return out


def cards_dark(key):
    d, fn, ROWS = DARK[key]
    im = np.asarray(Image.open(os.path.join(d, fn)).convert('RGB'))
    out = []
    for (ya, yb, LX, cw) in ROWS:
        for lx in LX:
            x0, x1 = lx if isinstance(lx, tuple) else (lx, lx + cw)
            glow = (2 if key.endswith('boots') else 1) if len(out) == 20 else 0   # Lv200 빛나는 카드(신발 판은 어두운 바탕도)
            out.append(cut_dark(im, x0 + 4, ya, x1 - 4, yb - 2, glow, len(out) == 19))   # Lv190은 옆 Lv200 카드의 빛 번짐
    return out


def main(out_js, prev=None):
    data, thumbs = {}, []
    for key, (fn, X0, X1, Y0, Y1, last) in SHEETS.items():
        im = np.asarray(Image.open(os.path.join(HERE, fn)).convert('RGB'))
        cards = [(X0[c], Y0[r], X1[c], Y1[r]) for r in range(4) for c in range(5)] + [last]
        urls = []
        for i, box in enumerate(cards):
            sm = shrink(cut(im, box, i == 20, find_box(im, box, i == 20), label_rect(im, box) if i < 20 else None))
            buf = io.BytesIO(); sm.save(buf, 'WEBP', quality=90, method=6)
            urls.append('data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode())
            thumbs.append(sm)
        data[key] = urls
    for key, cutter in [('hvarmor', cards_light), ('hvpants', cards_light), ('plate', cards_dark), ('ppants', cards_dark), ('cloth', cards_dark), ('cpants', cards_dark), ('pboots', cards_dark), ('lboots', cards_dark), ('cboots', cards_dark),
                        ('pgloves', cards_grid), ('lgloves', cards_grid), ('cgloves', cards_grid), ('belt', cards_grid)]:
        urls = []
        for img in cutter(key):
            sm = shrink(img)
            buf = io.BytesIO(); sm.save(buf, 'WEBP', quality=90, method=6)
            urls.append('data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode())
            thumbs.append(sm)
        data[key] = urls
    lines = ['/* 전사 방어구 그림 (빌드 65) — 사용자가 준 디자인 그대로(경갑 · 중갑 · 판금 · 천갑 상의 · 하의 · 신발 셋 · 장갑 셋 · 벨트). 손으로 고치지 말고 tools/saved/armor_light65/export_armart.py로 다시 뽑는다.',
             '   ARMART[종류][단계] = WebP data URL (디자인 Lv1 · 10 · … · 200 = 21개, 게임 단계 t와 같은 차례) */',
             'const ARMART = {']
    for key, urls in data.items():
        lines.append(f'  {key}: [')
        lines += [f"    '{u}'," for u in urls]
        lines.append('  ],')
    lines.append('};')
    open(out_js, 'w').write('\n'.join(lines) + '\n')
    total = sum(len(u) for v in data.values() for u in v)
    print('ARMART', {k: len(v) for k, v in data.items()}, f'{total / 1024:.0f}KB')
    if prev:
        cols = 21; cw = SIZE + 8
        rows = (len(thumbs) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * cw + 8, rows * (SIZE + 8) + 8), (30, 34, 48))
        for k, t in enumerate(thumbs):
            x, y = 8 + (k % cols) * cw, 8 + (k // cols) * (SIZE + 8)
            sheet.paste(t, (x + (SIZE - t.width) // 2, y + (SIZE - t.height) // 2), t)
        sheet.save(prev)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
