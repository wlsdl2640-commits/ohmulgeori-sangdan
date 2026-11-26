# 개미굴 · 늪지대 몬스터 51종 동작 판(정리한 clean/ — 서 있기 · 움직임 · 공격).  python mk_page.py <출력 앞부분>
import os, io, sys, base64
from PIL import Image
sys.path.insert(0, '.'); from mons import M
BG = (58, 62, 70, 255)
NAME = {'soldier': '병정개미', 'trapjaw': '덫턱개미', 'honeypot': '꿀단지개미', 'aphids': '진딧물 떼', 'pupa': '번데기', 'antlion': '개미귀신', 'fungusant': '포자 개미', 'mimicspider': '흉내 거미',
        'acidslime': '강산 슬라임', 'slime': '늪 슬라임', 'swampbrute0': '이끼털 괴물 0', 'swampbrute1': '이끼털 괴물 1', 'swampbrute2': '이끼털 괴물 2', 'queen': '여왕개미 (3층 보스)', 'gatekeeper': '문지기',
        'seedbeetle': '갈대씨벌레', 'earwig': '갈대 집게벌레', 'cattail': '부들줄기', 'reedhopper': '갈대 뛰개', 'coot': '갈대발 물닭', 'loach': '진흙 미꾸리', 'buffalo': '갈대관 늪물소', 'mantis': '갈대관 사마귀 (9층 보스)',
        'pebbleearwig': '자갈등 집게벌레', 'rootcrab': '뿌리납작게', 'barkmoth': '나무껍질 나방', 'vinecoil': '뿌리감개', 'kelpie': '검은발 켈피', 'goby': '진창 망둑', 'bigpebbleearwig': '큰 자갈등 집게벌레', 'rootkelpie': '뿌리멍에 켈피 (10층 보스)',
        'leech': '먹빛 턱거머리', 'watersnake': '밤눈 물뱀', 'witch': '수렁 주술사', 'lizardspear': '긴꼬리 창병', 'slinger': '검은물 투석병', 'vernola': '베르놀라 (11층 보스)',
        'leafbeetle': '잎등 물방개', 'trapleaf': '큰잎 덫꽃', 'dragonfly': '연잎 왕잠자리', 'suckerfrog': '큰잎 빨판개구리', 'lizardshield': '긴꼬리 방패병', 'dorbekan': '도르베칸 (12층 보스)',
        'mosquito': '안개막 모기', 'salamander': '독볏 도롱뇽', 'leafwitch': '삭은잎 주술사', 'poisonhopper': '독안개 뛰개', 'toad': '독주머니 두꺼비 (13층 보스)', 'leaflizard': '떠돌잎 물도마뱀', 'caiman': '진흙등 악어', 'snapturtle': '이끼등 늑대거북'}
def gif(d):
    fs = sorted(f for f in os.listdir(d) if f.endswith('.png')); fr = []
    for f in fs:
        im = Image.open(f'{d}/{f}').convert('RGBA'); c = Image.new('RGBA', im.size, BG); c.alpha_composite(im); fr.append(c.convert('RGB').quantize(64, dither=Image.NONE))
    b = io.BytesIO(); fr[0].save(b, 'GIF', save_all=True, append_images=fr[1:], duration=90, loop=0, disposal=1); return base64.b64encode(b.getvalue()).decode(), fr[0].width
CSS = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1300px;margin:0 auto;padding:16px}h3{margin:14px 0 4px;color:#f0c878}.row{display:flex;flex-wrap:wrap;gap:8px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px;text-align:center}img{image-rendering:pixelated}"
pages, cur, size = [], '', 0
for k, *_ in M:
    cards = ''
    for r, nm in [('idle', '서 있기'), ('walk', '움직임'), ('atk', '공격')]:
        d = f'clean/{k}/{r}' if os.path.isdir(f'clean/{k}/{r}') else f'{k}/{r}'
        if not os.path.isdir(d): continue
        g, w = gif(d); size += len(g)
        cards += f"<div class=card><img width={w * 2} src='data:image/gif;base64,{g}'><b>{nm}</b></div>"
    cur += f"<h3>{NAME.get(k, k)}</h3><div class=row>{cards}</div>"
    if size > 620000: pages.append(cur); cur, size = '', 0
if cur: pages.append(cur)
for i, p in enumerate(pages, 1):
    f = f'{sys.argv[1]}_{i}.html'
    open(f, 'w', encoding='utf-8').write(f"<!doctype html><meta charset=utf-8><title>몬스터 동작 {i}</title><style>{CSS}</style><main><h2>3층 개미굴 · 늪지대 9 ~ 14층 몬스터 동작 {i}/{len(pages)}</h2><p>서 있기 16장 · 움직임 16장 · 공격 24장(끝 장 안 정함). 피 · 섬광 · 번진 장은 지웠다. 모두 왼쪽(파티 쪽)을 본다. 다시 뽑을 동작을 말씀해 주세요.</p>{p}</main>")
    print(f, os.path.getsize(f) // 1024, 'KB')
