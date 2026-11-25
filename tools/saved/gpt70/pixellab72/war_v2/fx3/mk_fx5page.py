# 11-25 밤 판: 자세 고정 B · 강철 피부 B + 머리 위 버프 아이콘 · 방패 셋 가벼운 새 시안(bashL · shoveL · blockL)
#   python mk_fx5page.py <출력 html>
import sys, os
from PIL import Image
import types
_src = open('mk_fx4page.py', encoding='utf-8').read(); M = types.SimpleNamespace()
_ns = {}; exec(_src[:_src.index('H = []')] + chr(10) + [l for l in _src.split(chr(10)) if l.startswith('CSS = ')][0], _ns)   # gif · b64 · card · CSS만 빌려 씀
M.gif, M.b64, M.card, M.CSS = _ns['gif'], _ns['b64'], _ns['card'], _ns['CSS']
import mk_var as V
H = ["<h3>자세 고정 B · 강철 피부 B — 머리 위 버프 아이콘</h3><p>아이콘 = 게임 스킬 리마스터 그림(자세 고정 = 철벽 성 방패 · 강철 피부 = 강철 갑옷). 시전할 때 머리 아래에서 솟아 잠깐 머물고 천천히 옅어집니다. 결의 · 돌격 함성(고르신 판)에도 넣었습니다 → pick4 · pick5.</p><div class=row>"]
for k, c in [('brace_B', '자세 고정 B + 아이콘'), ('steel_B', '강철 피부 B + 아이콘')]:
    H.append(M.card('data:image/gif;base64,' + M.gif(f'../fx4/{k}_hud.gif'), c, 'class=g'))
H.append("</div>")
for k, ko, tip in [('bash', '방패 두드리기', '맞은 자리에 얇은 물결 · 작은 불꽃'), ('shove', '방패 밀치기', '얇은 미는 물결 · 작은 흙먼지 · 작은 기절 별'), ('block', '둥근 방패 막기', '방패 면의 작은 물결 · 튀는 불꽃 몇 개')]:
    H.append(f"<h3>{ko} — 다시 (1차답게 가볍게: {tip})</h3><div class=row>")
    for s in [1, 2, 3]:
        f = f'{k}L{s}/00.png'
        if os.path.exists(f): H.append(M.card('data:image/png;base64,' + M.b64(V.scene(k, Image.open(f).convert('RGBA'))), f'{ko} 가벼운 {s}', 'class=s'))
    H.append("</div>")
open(sys.argv[1], 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>전사 효과 — 버프 아이콘 · 방패 가볍게</title><style>{M.CSS}</style><main><h2>전사 1차 효과 — 버프 아이콘 · 방패 셋 가볍게 (11-25 밤)</h2>{''.join(H)}</main>")
print(os.path.getsize(sys.argv[1]))
