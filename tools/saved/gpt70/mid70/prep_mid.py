"""사이 값 시안 1단계: 전사 16장 판을 장으로 나누고 닻을 잡아(= ../hd70/extract_war16.py의 앞부분 그대로) 장마다 원본 크기 그대로 저장한다
   python3 prep_mid.py   → mid_prep/<동작>.npz (rgb · 덮임 · 닻 · 땅 줄 · 칼날) + mid_prep/ref.json (걷기 키 = 배율 기준)
   (닻 규칙을 한 곳에만 두려고 extract_war16.py의 「# ── 2.」 앞까지를 그대로 돌린다 — 그 파일의 닻을 고치면 여기도 따라간다)"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); HD = os.path.join(HERE, '..', 'hd70')
sys.path.insert(0, HD)
src = open(os.path.join(HD, 'extract_war16.py'), encoding='utf-8').read().split('# ── 2. 같은 크기 칸에')[0].replace("OUT = 'out_war16'; os.makedirs(OUT, exist_ok=True)", "OUT = None").replace("CHK = sys.argv[1] if len(sys.argv) > 1 else None", "CHK = None")
ns = {'__name__': 'x16'}; exec(compile(src, 'extract_war16_head', 'exec'), ns)
DATA, REF = ns['DATA'], ns['REF']
os.makedirs('mid_prep', exist_ok=True)
for name, (F, fit) in DATA.items():
    out = {}
    for i, f in enumerate(F):
        ys, xs = np.where(f['m']); ax = int(round(f['ax'])); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
        rgb = f['rgb'][y0:y1 + 1, x0:x1 + 1].astype(np.uint8); m = f['m'][y0:y1 + 1, x0:x1 + 1]
        out[f'rgb{i}'] = rgb; out[f'm{i}'] = m; out[f'o{i}'] = np.array([x0 - ax, y0 - f['base']])   # 그림 왼쪽 위의 자리 (닻 · 땅 줄에서, 판 픽셀)
        if 'bm' in f: out[f'b{i}'] = f['bm'][y0:y1 + 1, x0:x1 + 1]; out[f'e{i}'] = np.array([[P[0] - ax, P[1] - f['base']] for P in f['be']], float)
    np.savez_compressed(f'mid_prep/{name}.npz', n=len(F), **out); print(name, len(F))
json.dump({'helm': REF[0], 'h': REF[1]}, open('mid_prep/ref.json', 'w')); print('ref', REF)
