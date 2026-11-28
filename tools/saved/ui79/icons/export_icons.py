"""빌드 79 UI 아이콘(픽셀랩 32칸 16개) → src/data-icons79.js — python export_icons.py <출력.js> (손으로 고치지 말 것)"""
import sys, os, base64, json
os.chdir(os.path.dirname(os.path.abspath(__file__)))
K = ['m_house', 'm_anvil', 'm_person', 'm_map', 'm_sword', 'm_box', 'm_scroll', 'c_money', 'c_dex', 'c_achv', 'c_log', 'c_set', 'menu', 'coin', 'star', 'arrow']
D = {k: 'data:image/png;base64,' + base64.b64encode(open(f'{k}.png', 'rb').read()).decode() for k in K}
open(sys.argv[1], 'w', encoding='utf-8').write('/* 빌드 79 UI 아이콘 — 메뉴판 · 바로 가기 · 메뉴 단추 · 위쪽 띠 · 장소 화살표 (픽셀랩, tools/saved/ui79/icons/export_icons.py) */\nconst ICONS79 = ' + json.dumps(D) + ';\n')
