# 11-25 밤 판: 방패 셋 · 돌격 함성 다시 — 픽셀랩 create_image_pro(그림체 참고: 늪지 괴물 1·2 / 충격파 3·4), jobs_in7.json
#   python mk_fx6page.py <출력 html>
import sys, os, types
from PIL import Image
_src = open('mk_fx4page.py', encoding='utf-8').read(); _ns = {}
exec(_src[:_src.index('H = []')] + chr(10) + [l for l in _src.split(chr(10)) if l.startswith('CSS = ')][0], _ns)
b64, card, CSS = _ns['b64'], _ns['card'], _ns['CSS']
import mk_var as V
V.A['warcry'] = ('br', V.FX + 40, V.GY + 4, 'b', 'warcry'); V.A['bash'] = ('c', 222, V.GY - 45, 'f', 'bash'); V.A['block'] = ('c', 186, V.GY - 48, 'f', 'block')
_sc = V.scene
def scene(k, eff):
    if V.A[k][0] == 'br':
        b = eff.getbbox(); e2 = Image.new('RGBA', eff.size); e2.alpha_composite(eff)
        V.A[k] = ('bl', V.A[k][1] - (b[2] - b[0]), *V.A[k][2:]); r = _sc(k, e2); V.A[k] = ('br', V.A[k][1] + (b[2] - b[0]), *V.A[k][2:]); return r
    return _sc(k, eff)
H = []
for k, ko, tip in [('bash', '방패 두드리기', '맞은 자리 충격 별 · 두꺼운 물결 · 불꽃 · 작은 먼지'), ('shove', '방패 밀치기', '앞으로 미는 물결 셋 · 흙먼지 · 작은 기절 별'),
                   ('block', '둥근 방패 막기', '방패 앞 테 빛 · 막힌 자리 반짝 · 튀는 불꽃'), ('warcry', '돌격 함성', '소리 물결이 동료 쪽(왼쪽)으로 · 금빛 불씨 — 머리 위 아이콘은 고른 뒤 붙임')]:
    H.append(f"<h3>{ko} — 다시 ({tip})</h3><p>1 · 2 = 늪지 괴물 그림체 참고 · 3 · 4 = 충격파 효과 그림체 참고</p><div class=row>")
    for s in [1, 2, 3, 4]:
        f = f'{k}P{s}/00.png'
        if os.path.exists(f): H.append(card('data:image/png;base64,' + b64(scene(k, Image.open(f).convert('RGBA'))), f'{ko} {s}', 'class=s'))
    H.append("</div>")
open(sys.argv[1], 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>전사 효과 — 방패 셋 · 돌격 함성 다시</title><style>{CSS}</style><main><h2>전사 1차 효과 — 방패 셋 · 돌격 함성 다시 (픽셀랩, 11-25 밤)</h2>{''.join(H)}</main>")
print(os.path.getsize(sys.argv[1]))
