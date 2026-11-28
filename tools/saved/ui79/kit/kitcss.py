"""UI 키트 부품 → CSS(border-image 9조각, 부품 PNG는 data URL) — python kitcss.py <출력.css>
   지금은 시안용(훅 페이지에 끼워 찍는다). 게임에 넣을 때는 이 CSS를 style.css 끝에 붙이거나 파일로."""
import sys, base64, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
u = lambda K, n: 'data:image/png;base64,' + base64.b64encode(open(f'kit{K}/{n}.png', 'rb').read()).decode()
def bi(K, n, s, w=None, fill=True):
    w = w or s
    return f"border-style: solid; border-color: transparent; border-width: {w}px; border-image: url('{u(K, n)}') {s} {'fill' if fill else ''} / {w}px stretch; image-rendering: pixelated;"
css = f"""
/* ── UI 키트 시안 (A 나무 · 금 기본 / B 양피지 서류 / C 돌 · 룬 미궁) ── */
.win {{ {bi('A', 'frame', 14, 12)} background: none; }}
.win .panel, .win .panel-in {{ background: transparent; }}
.win-head, .win-top {{ background: transparent; }}
#win-title {{ {bi('A', 'title', 11, 9)} color: #3a1d0c; text-shadow: 0 1px 0 #f6d27a; background-color: transparent; }}
.win-btn {{ {bi('A', 'btn1', 9, 7)} background: none; color: #ffe8b0; }}
.card {{ {bi('A', 'row', 10, 8)} background: none; box-shadow: none; }}
.li {{ {bi('A', 'row', 10, 7)} background: none; }}
.btn {{ {bi('A', 'btn2', 9, 7)} background: none; color: #f6e0b0; box-shadow: none; }}
.btn.gold {{ {bi('A', 'btn3', 9, 7)} background: none; color: #2a1406; }}
.btn.red {{ {bi('B', 'btn1', 9, 7)} background: none; color: #fff0e0; }}
.tab {{ {bi('A', 'tab2', 8, 6)} background: none; box-shadow: none; color: #e8cfa0; }}
.tab.on {{ {bi('A', 'tab1', 8, 6)} background: none; color: #fff2c8; }}
.tabs {{ background: transparent; }}
/* 첫 화면 */
.tbtn {{ {bi('A', 'btn2', 9, 8)} background: none !important; color: #f6e0b0 !important; box-shadow: none !important; }}
.tbtn.main {{ {bi('A', 'btn3', 9, 8)} color: #2a1406 !important; }}
.t-box {{ {bi('B', 'frame', 14, 12)} background: none !important; box-shadow: none !important; color: #3a2414; }}
/* 알림 창 = 서류 */
#m-box {{ {bi('B', 'frame', 14, 12)} background: none; color: #3a2414; }}
#m-box .btn {{ {bi('B', 'btn2', 9, 7)} color: #fff0d8; }}
#m-box .btn.gold {{ {bi('B', 'btn1', 9, 7)} color: #fff0e0; }}
"""
open(sys.argv[1], 'w', encoding='utf-8').write(css); print(len(css))
