"""사이 값 시안 4단계: 지금 게임 그림 자료(src/data-hd70.js)에서 전사 · 몬스터만 사이 값 그림으로 바꾼 시험용 자료를 만든다 — 게임 소스는 건드리지 않는다
   python3 export_mid.py <src/data-hd70.js> <키(칸)> <출력 js> [훅 페이지 <출력 페이지>]
   (out_mid<키>/ · out_midmon/ 이 있는 폴더에서. 엔진은 그림 자료의 hs만 본다: 전사 hs 1.5 → 그리는 배율 1.5와 만나 한 칸 = 논리 1픽셀 = 화면 2픽셀 · 몬스터 hs 1)
   훅 페이지(hd70/mkhook70.py가 만든 것)를 주면 그 안의 자료 줄을 바꾼 시험 페이지도 쓴다
   환경 BG=1: 넓은 평원 풍경 겹 · 풍차 날개 · 구름 · 달도 같은 굵기로 (풍경 겹은 hs 1로 다시 줄이고, 구름 · 달은 엔진이 크기를 정해 두어서 2×2칸을 한 색으로 뭉친다)"""
import json, base64, io, sys, os
import numpy as np
from PIL import Image
SRC, H, OUT = sys.argv[1], int(sys.argv[2]), sys.argv[3]
FLIP = {'boar', 'aboar'}   # ../hd70/export_hd70.py와 같다 (멧돼지 둘은 판에서 왼쪽을 본다)

def png_url(im):
    im = im.convert('RGBA'); a = np.array(im); al = a[..., 3] > 0; cols = np.unique(a[al][:, :3], axis=0)
    if len(cols) > 255: buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True); return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
    lut = {tuple(c): i + 1 for i, c in enumerate(cols)}; out = np.zeros(a.shape[:2], np.uint8)
    for j, i in zip(*np.where(al)): out[j, i] = lut[tuple(a[j, i, :3])]
    p = Image.fromarray(out, 'P'); pal = [0, 0, 0] + [int(v) for c in cols for v in c]; p.putpalette(pal + [0] * (768 - len(pal)))
    buf = io.BytesIO(); p.save(buf, 'PNG', optimize=True, transparency=0); return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

src = open(SRC, encoding='utf-8').read(); i = src.index('const HD70_DATA = ') + len('const HD70_DATA = '); D = json.loads(src[i:src.rindex(';')])
M = json.load(open('out_midmon/meta.json')); mon = {}
for mid, m in M.items():
    rows = list(m['rows'].keys()); W, Hh = m['w'], m['h']; sh = Image.new('RGBA', (W * max(m['rows'].values()), Hh * len(rows)), (0, 0, 0, 0))
    for r, rn in enumerate(rows):
        for k in range(m['rows'][rn]):
            f = Image.open(f'out_midmon/{mid}/{rn}_{k}.png').convert('RGBA'); sh.alpha_composite(f.transpose(Image.FLIP_LEFT_RIGHT) if mid in FLIP else f, (k * W, r * Hh))
    assert rows == D['mon'][mid]['rows'] and [m['rows'][r] for r in rows] == D['mon'][mid]['n'], mid
    mon[mid] = {'hs': m['hs'], 'w': W, 'h': Hh, 'ax': (W - m['ax']) if mid in FLIP else m['ax'], 'ay': m['ay'], 'rows': rows, 'n': [m['rows'][r] for r in rows], 'url': png_url(sh)}
W16 = json.load(open(f'out_mid{H}/meta.json')); war = {'hs': 1.5, 'rows': {}}
for rn, m in W16.items():
    sheet = lambda pre: (lambda sh: ([sh.alpha_composite(Image.open(f'out_mid{H}/{pre}{k}.png').convert('RGBA'), (k * m['w'], 0)) for k in range(m['n'])], sh)[1])(Image.new('RGBA', (m['w'] * m['n'], m['h']), (0, 0, 0, 0)))
    war['rows'][rn] = dict(m, url=png_url(sheet(rn + '_')))
    if 'bl' in m: war['rows'][rn]['blade'] = png_url(sheet(rn + '_b_'))
assert set(war['rows']) == set(D['war']['rows'])
old = {k: round(len(json.dumps(D[k])) / 1024) for k in ('war', 'mon')}; D['war'] = war; D['mon'] = mon
if os.environ.get('BG'):
    HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'hd70'))
    from seg import sheet_path
    from mid_core import Palette, flat_pixels, down, to_rgba
    def keyed(path):   # ../hd70/export_hd70.py와 같다 (마젠타 = 빈 곳)
        a = np.array(Image.open(path).convert('RGB')).astype(int); R, G, B = a[..., 0], a[..., 1], a[..., 2]
        return a.astype(np.uint8), ~(((R > 170) & (B > 170) & (G < 110) & (np.abs(R - B) < 90)) | ((R - G > 70) & (B - G > 70)))
    def coarse(rgb, m, c, cols, rows, groups=14):   # 다수결로 줄이기: 한 칸 = 판 c픽셀 → cols × rows칸
        samp = flat_pixels(rgb, m); rs = np.random.RandomState(1); P = Palette(samp[rs.choice(len(samp), min(len(samp), 150000), replace=False)], groups=groups, step=6)
        out, (ax, ay) = down(rgb, m, (0, 0), c, P, tb=0.45, rescue=None); return to_rgba(out[ay:ay + rows, ax:ax + cols], P.pal)
    K = 480 / 2172; MID0, CUT, GR0 = 134, 392, 380; Yl = lambda y: 200 - (724 - y) * K; B0 = D['bg']['plains']
    crgb, cm = keyed(sheet_path('38f56457')); lrgb, lm = keyed(sheet_path('4b92ccaf'))
    mid = coarse(crgb[MID0:CUT], cm[MID0:CUT], 1 / K, 480, round((CUT - MID0) * K)); gr = coarse(crgb[GR0:], np.ones_like(cm[GR0:]), 1 / K, 480, round((724 - GR0) * K))
    gr[..., 3] = 255
    for yy, keep in ((0, 1), (1, 2), (2, 3)):   # 땅 위 세 줄은 바둑 무늬로 엷게 (지금 그림의 여섯 줄 몫)
        for xx in range(gr.shape[1]):
            if (keep == 1 and (xx + yy) % 4) or (keep == 2 and (xx + yy) % 2) or (keep == 3 and (xx + yy) % 4 == 0): gr[yy, xx, 3] = 0
    back = coarse(lrgb[207:428, :1783], lm[207:428, :1783], 1 / K, round(1783 * K), round(221 * K), 8)
    bl = np.dstack([lrgb, lm * np.uint8(255)])[150:560, 1786:2172]; hub = (1979 - 1786, 357 - 150); bk = 104 / 369 / 2; bw = round(384 * bk); frames = []
    for k in range(12):
        big = Image.new('RGBA', (600, 600), (0, 0, 0, 0)); big.alpha_composite(Image.fromarray(bl, 'RGBA'), (300 - hub[0], 300 - hub[1]))
        rot = np.array(big.rotate(-k * 6, resample=Image.BICUBIC, center=(300, 300)).crop((300 - 192, 300 - 192, 300 + 192, 300 + 192))); frames.append(rot)
    allb = np.concatenate(frames, 1); bsh = coarse(allb[..., :3], allb[..., 3] > 127, 1 / bk, bw * 12, bw, 6)
    D['bg']['plains'] = dict(B0, hs=1, mid={'url': png_url(Image.fromarray(mid, 'RGBA')), 'y': round(Yl(MID0), 1)}, gr={'url': png_url(Image.fromarray(gr, 'RGBA')), 'y': round(Yl(GR0), 1)},
                             back={'url': png_url(Image.fromarray(back, 'RGBA')), 'y': round(95 - back.shape[0], 1)}, blades=dict(B0['blades'], url=png_url(Image.fromarray(bsh, 'RGBA')), w=bw))
    def block(url, to=None):   # 2×2칸을 가장 많은 색 하나로 (크기는 그대로)
        a = np.array(Image.open(io.BytesIO(base64.b64decode(url.split(',')[1]))).convert('RGBA')); h, w = a.shape[0] // 2 * 2, a.shape[1] // 2 * 2; o = a.copy()
        for y in range(0, h, 2):
            for x in range(0, w, 2):
                q = a[y:y + 2, x:x + 2].reshape(4, 4); op = q[q[:, 3] > 0]
                if len(op) < 2: o[y:y + 2, x:x + 2] = 0; continue
                u, n = np.unique(op, axis=0, return_counts=True); best = u[n == n.max()]; pick = best[np.argmin(np.abs(best[:, :3].astype(int) - op[:, :3].mean(0)).sum(1))]; o[y:y + 2, x:x + 2] = pick
        im = Image.fromarray(o, 'RGBA'); return png_url(im if not to else im.resize(to, Image.NEAREST))
    D['sky'] = dict(D['sky'], clouds=[block(u) for u in D['sky']['clouds']], moon=block(D['sky']['moon']))
    print('풍경', mid.shape, gr.shape, back.shape, bsh.shape)
js = src[:i] + json.dumps(D, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(OUT, 'w', encoding='utf-8').write(js); print('written', OUT, round(len(js) / 1024), 'KB', '전사', old['war'], '→', round(len(json.dumps(war)) / 1024), '몬스터', old['mon'], '→', round(len(json.dumps(mon)) / 1024))
if len(sys.argv) > 5:
    h = open(sys.argv[4], encoding='utf-8').read(); assert h.count(src) == 1; open(sys.argv[5], 'w', encoding='utf-8').write(h.replace(src, js)); print('page', sys.argv[5])
