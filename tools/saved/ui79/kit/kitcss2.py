"""UI 키트 다섯(A 나무 · 금 / B 양피지 / C 돌 · 룬 / D 가죽 / E 쇠) → 창마다 고르는 CSS — python kitcss2.py <출력.css>
   창(.win)에 data-kit="A|B|C|D|E"를 붙이면 그 키트로 그린다(시안: 훅 페이지가 붙인다 · 게임에 넣을 때 ui.js showWin이 붙인다)."""
import sys, base64, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
u = lambda K, n: 'data:image/png;base64,' + base64.b64encode(open(f'kit{K}/{n}.png', 'rb').read()).decode()
def bi(K, n, s, w):
    return f"border-style: solid; border-color: transparent; border-width: {w}px; border-image: url('{u(K, n)}') {s} fill / {w}px stretch; image-rendering: pixelated; background: none; box-shadow: none;"
# 키트마다 글자색: 바탕 · 단추(보조 btn2) · 기본(btn3 또는 btn1) · 위험 · 탭
INK = {'A': dict(t='#f2dcb0', h='#3a1d0c', b2='#f6e0b0', b1='#2a1406', p='btn3', r='tab1', tn='#e8cfa0', to='#fff2c8'),
       'B': dict(t='#24120a', h='#5a1410', b2='#fff0d8', b1='#fff0e0', p='btn1', r='btn3', tn='#4a2a14', to='#24120a'),
       'C': dict(t='#e6e2d6', h='#2a1d08', b2='#e6e2d6', b1='#2a1d08', p='btn2', r='btn3', tn='#c8c4b8', to='#2a1d08'),
       'D': dict(t='#f4e6cc', h='#2a1408', b2='#f4e6cc', b1='#2a1408', p='btn1', r='btn3', tn='#e8d4b0', to='#2a1408'),
       'E': dict(t='#e8eef2', h='#e8eef2', b2='#e8eef2', b1='#14181c', p='btn1', r='btn3', tn='#c2ccd4', to='#14181c')}
css = ''
for K, I in INK.items():
    w = f'.win[data-kit="{K}"]'
    css += f"""
{w} {{ {bi(K, 'frame', 14, 12)} color: {I['t']}; }}
{w} .panel, {w} .panel-in, {w} .tabs {{ background: transparent; }}
{w} #win-title {{ {bi(K, 'title', 11, 6)} height: auto; line-height: 20px; padding: 1px 10px; color: {I['h']}; text-shadow: none; }}
{w} .win-btn {{ {bi(K, 'btn2', 9, 7)} color: {I['b2']}; }}
{w} .card, {w} .li {{ {bi(K, 'row', 10, 8)} color: {I['t']}; }}
{w} .btn {{ {bi(K, 'btn2', 9, 7)} color: {I['b2']}; }}
{w} .btn.gold {{ {bi(K, I['p'], 9, 7)} color: {I['b1']}; }}
{w} .btn.red {{ {bi(K, I['r'], 9, 7)} color: #fff0e0; }}
{w} .tab {{ {bi(K, 'tab2', 8, 6)} color: {I['tn']}; }}
{w} .tab.on {{ {bi(K, 'tab1', 8, 6)} color: {I['to']}; }}
"""
    if K == 'B': css += f"{w} *, {w} {{ text-shadow: none !important; }}\n{w} .sub, {w} .muted, {w} small {{ color: #5a3a20 !important; }}\n"
css += f"""
/* 첫 화면 · 알림 · 대화 */
.tbtn {{ {bi('A', 'btn2', 9, 8)} color: #f6e0b0 !important; }}
.tbtn.main {{ {bi('A', 'btn3', 9, 8)} color: #2a1406 !important; }}
.t-box {{ {bi('B', 'frame', 14, 12)} color: #24120a; }}
.t-box h2 {{ color: #5a1410 !important; }}
.t-box, .t-box * {{ text-shadow: none !important; }}
.t-box label, .t-box small, .t-box p, .t-box span {{ color: #3a2010 !important; }}
#m-box {{ {bi('B', 'frame', 14, 12)} color: #24120a; }}
#m-box h2 {{ color: #5a1410; }}
#m-box, #m-box * {{ text-shadow: none; }}
#m-box .btn {{ {bi('B', 'btn2', 9, 7)} color: #fff0d8; }}
#m-box .btn.gold {{ {bi('B', 'btn1', 9, 7)} color: #fff0e0; }}
"""
if sys.argv[1] != '--js': open(sys.argv[1], 'w', encoding='utf-8').write(css)
print(len(css))

# 게임에 넣는 꼴: python kitcss2.py --js <src/data-uikit79.js> — CSS 글을 JS 문자열로 (uikit79.js가 <style>로 붙인다 · 손으로 고치지 말 것)
if len(sys.argv) > 2 and sys.argv[1] == '--js':
    import json
    open(sys.argv[2], 'w', encoding='utf-8').write('/* 빌드 79: UI 키트 다섯(A 나무 · 금 / B 양피지 / C 돌 · 룬 / D 가죽 / E 쇠) 9조각 CSS — tools/saved/ui79/kit/kitcss2.py --js 로 뽑는다, 손으로 고치지 말 것 */\nconst UIKIT79_CSS = ' + json.dumps(css, ensure_ascii=False) + ';\n')
