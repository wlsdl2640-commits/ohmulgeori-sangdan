# 11-25 밤 판: 방패 두드리기(소리 울림) · 밀치기(에너지 방패가 나아가다 사라짐 — 움직임) · 막기(④ 꼴 에너지 막) · 돌격 함성 v5(버프 — 몸 빛 · 이속 · 동료에게)
#   python mk_fx7page.py <출력 html>  (1MB 넘으면 _2.html로 나눔)
import sys, os
from PIL import Image
_src = open('mk_fx4page.py', encoding='utf-8').read(); _ns = {}
exec(_src[:_src.index('H = []')] + chr(10) + [l for l in _src.split(chr(10)) if l.startswith('CSS = ')][0], _ns)
b64, gif, card, CSS = _ns['b64'], _ns['gif'], _ns['card'], _ns['CSS']
import mk_var as V
V.A['bash'] = ('c', 226, V.GY - 45, 'f', 'bash'); V.A['block'] = ('c', 186, V.GY - 48, 'f', 'block')
def fit(e, hmax, wmax=999):   # 전사 키에 맞춰 줄임(넘을 때만)
    e = e.crop(e.getbbox()); k = min(hmax / e.height, wmax / e.width)
    return e.resize((round(e.width * k), round(e.height * k)), Image.NEAREST) if k < 1 else e
REF = "1 · 2(· 5) = 늪지 괴물 그림체 참고, 3 · 4(· 6) = 충격파 그림체 참고"
P1 = ["<h3>방패 두드리기 — 소리가 울리는 꼴</h3><p>칼날 초승달 대신 징을 친 것처럼 울리는 물결. 1 ~ 4 = 맞은 자리에서 둥글게 번지는 물결(조금 위에서 본 꼴), 5 · 6 = 세로로 서서 앞으로 퍼지는 소리 물결. " + REF + "</p><div class=row>"]
for s in range(1, 7):
    f = f'bashQ{s}/00.png'
    if os.path.exists(f): P1.append(card('data:image/png;base64,' + b64(V.scene('bash', fit(Image.open(f).convert('RGBA'), 66, 120))), f'두드리기 {s}', 'class=s'))
PS = []; PS.append("<h3>방패 밀치기 — 에너지 방패가 나와 앞으로 나아가다 사라짐 (움직임)</h3><p>맞히는 장에 방패 자리에서 작고 옅게 생겨 → 제 크기로 커지며 빠르게 나갔다가 느려지고 → 잔상 둘을 남기며 천천히 옅어집니다. 3번은 좌우를 뒤집었습니다.</p><div class=row>")
for s in range(1, 5): PS.append(card('data:image/gif;base64,' + __import__('base64').b64encode(open(f'../fx5/shoveQ{s}_scene.gif', 'rb').read()).decode(), f'밀치기 {s}', 'class=s'))
PS.append("</div>"); P1.append("</div><h3>둥근 방패 막기 — ④ 꼴을 에너지 · 투명 보호막으로</h3><p>앞 시안 ④(둥근 쇠방패)를 그림 참고로 넣어 같은 꼴을 빛 · 유리 같은 막으로. " + REF + "</p><div class=row>")
for s in range(1, 5):
    f = f'blockQ{s}/00.png'
    if os.path.exists(f): P1.append(card('data:image/png;base64,' + b64(V.scene('block', fit(Image.open(f).convert('RGBA'), 80))), f'막기 {s}', 'class=s'))
P1.append("</div>")
P2 = ["<h3>돌격 함성 v5 — 버프 스킬로 (외침 + 이동 속도 + 몸 감싸는 빛 + 동료에게)</h3><p>전사가 칼을 들고 외치면 → 입에서 소리 물결이 앞뒤로 퍼지고 발밑에 금빛 고리 → 몸 테두리가 금빛으로 감싸여 빛남(도발 v4와 같은 길, 색만 금빛) → 물결이 동료(짐꾼)에게 닿으면 동료도 금빛으로 감싸임 → 둘 다 다리 쪽으로 바람 줄(이동 속도) · 위 화살표 · 반짝이 → 머리 위 함성 아이콘이 솟았다가 천천히 옅어짐. 효과 도구 저장: 전사 a37cfd89 · 동료 efc1ad79.</p><div class=row>"
      + card('data:image/gif;base64,' + gif('../fx5/warcry_v5_scene.gif'), '돌격 함성 v5 (늪지 장면)', 'class=s') + card('data:image/gif;base64,' + gif('../fx5/warcry-v5.gif'), '전사만 크게', 'class=g') + "</div>"]
out = sys.argv[1]; T = "<!doctype html><meta charset=utf-8><title>@T@</title><style>" + CSS + "</style><main><h2>@T@</h2>@B@</main>"
fmt = lambda t, b: T.replace("@T@", t).replace("@B@", b)
pages = [('', '전사 방패 두드리기 · 막기 다시 (11-25 밤)', P1), ('_2', '전사 방패 밀치기 다시 — 움직임 (11-25 밤)', PS), ('_3', '돌격 함성 v5 (11-25 밤)', P2)]
for suf, t, b in pages:
    o = out.replace('.html', suf + '.html'); open(o, 'w', encoding='utf-8').write(fmt(t, ''.join(b))); print(o, os.path.getsize(o))
