"""band99.py [변형 …] — 도달을 레벨 묶음 · 파티 갈래로 평균 (기준 base와의 차)"""
import sys, os, statistics as st
sys.argv, V = sys.argv[:1], sys.argv[1:]
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'an99.py')).read().split("if __name__")[0])
HEALERS = {'힐러', '사제', '역병의사', '대주교', '명의', '힐러근접'}
BANDS = [('Lv12~45', [12, 20, 30, 45]), ('Lv60~90', [60, 80, 90]), ('Lv100~130', [100, 120, 130]), ('Lv146 30층', [146])]
A = {v: load(v) for v in ['base'] + V}
print('| 변형 | ' + ' | '.join(f'{b} 힐러 · 없음' for b, _ in BANDS) + ' | 기본 공격 몫 |')
for v in ['base'] + V:
    cells = []
    for bn, ts in BANDS:
        hk = [k for k in A['base'] if k[0] in ts and k[1] in HEALERS and k in A[v]]
        nk = [k for k in A['base'] if k[0] in ts and k[1] not in HEALERS and k in A[v]]
        if not hk: cells.append('—'); continue
        h = st.mean(A[v][k]['reach'] for k in hk); n = st.mean(A[v][k]['reach'] for k in nk)
        hb = st.mean(A['base'][k]['reach'] for k in hk); nb = st.mean(A['base'][k]['reach'] for k in nk)
        cells.append(f'{h:+.1f} · {n:+.1f}' if v == 'base' else f'{h - hb:+.1f} · {n - nb:+.1f}')
    bs = st.mean(A[v][k]['basic'] for k in A[v])
    print(f'| {v} | ' + ' | '.join(cells) + f' | {bs*100:.0f}% |')
