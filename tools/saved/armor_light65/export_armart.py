"""전사 경갑 디자인 그림 그대로 → src/data-armart.js (ARMART)
사용자 11-12 10:50 「다시찍지말고 그대로 사용」 — 다시 그리지 않고, 사용자가 준 시안 판(경갑_상의 · 경갑_하의 Lv1-200.png)에서
단계마다 장비 그림만 오려(카드 바탕 · LV 글씨 · Lv200 월계관 빼기) 바탕을 투명하게 하고, 긴 쪽 SIZE px로 줄여 WebP data URL로 넣는다.
python3 export_armart.py <출력 data-armart.js> [미리보기.png]"""
import base64, io, os, sys
from collections import deque
import numpy as np
from PIL import Image
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
    lines = ['/* 전사 경갑 그림 (빌드 65) — 사용자가 준 디자인 그대로. 손으로 고치지 말고 tools/saved/armor_light65/export_armart.py로 다시 뽑는다.',
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
        sheet = Image.new('RGB', (cols * cw + 8, 2 * (SIZE + 8) + 8), (30, 34, 48))
        for k, t in enumerate(thumbs):
            x, y = 8 + (k % cols) * cw, 8 + (k // cols) * (SIZE + 8)
            sheet.paste(t, (x + (SIZE - t.width) // 2, y + (SIZE - t.height) // 2), t)
        sheet.save(prev)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
