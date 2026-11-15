"""potan.py <물약 판> <물약 없는 판(Lv80 아래)> <물약 없는 판(Lv80부터)> — 마나 물약을 들고 갔을 때 단계 · 파티마다 도달 · 직업 MP % · 막힘 % · 마신 물약 수 (11-16 「더 큰 물약 추가」 — 내 측정)
   예: python3 potan.py pt fin2 hh2   (pt = drive102b.sh: 단계마다 마나 물약 30병 — Lv12 ~ 45 고급 · Lv60 ~ 90 상급 · Lv100부터 최상급)"""
import json, glob, os, sys, statistics as st
D = os.path.dirname(os.path.abspath(__file__))
GZ = None if os.path.isdir(f'{D}/out') else json.load(__import__('gzip').open(f'{D}/results101.json.gz', 'rt', encoding='utf-8'))   # out/이 없으면 저장소에 둔 모음
def load(v):
    R = {}
    rows = GZ['reach'].get(v, []) if GZ is not None else [r for f in sorted(glob.glob(f'{D}/out/{v}/t*.json')) for r in json.load(open(f))]
    for r in rows: R[(r['tier'], r['comp'])] = r['runs']
    return R
DEF = ['pt', 'fin2', 'hh2']; ARGS = sys.argv[1:4]; PV, LO, HI = ARGS + DEF[len(ARGS):]
P, L, Hh = load(PV), load(LO), load(HI)
for k in sorted(P):
    runs = P[k]; base = L.get(k) if k[0] < 80 else (Hh.get(k) or L.get(k))
    reach = st.mean(x['flv'] for x in runs) - k[0]; rb = st.mean(x['flv'] for x in base) - k[0] if base else float('nan')
    ft = st.mean(x['fightT'] for x in runs)
    out = []
    for c in sorted({c for x in runs for c in x['mp']}):
        m = st.mean(x['mp'].get(c, 0) for x in runs); mb = st.mean(x.get('mpb', {}).get(c, 0) for x in runs)
        pots = st.mean(x.get('pots', {}).get(c, 0) for x in runs)
        m0 = st.mean(x['mp'].get(c, 0) for x in base) if base else float('nan')
        if m0 < 99.5 or pots > 0: out.append(f"{c[:5]} {m0:.0f}→{m:.0f}% 막힘{mb:.1f} 물약{pots:.1f}")
    print(f"{k[0]:>3} {k[1]:<5} 도달 {rb:+.1f}→{reach:+.1f} 싸움 {ft:.0f}초 | " + ' · '.join(out))
