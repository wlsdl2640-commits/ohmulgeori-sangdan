# 늪지대 9 ~ 14층 몬스터 · 보스 시안 판(11-25 낮, 회의 c6 · c7 → 픽셀랩): python mk_page.py → page_plx75.html
import os, base64
H = os.path.dirname(os.path.abspath(__file__)); P74 = os.path.join(H, '..', 'plx74', 'pick')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
N = {'earwig': '갈대 집게벌레', 'pebbleearwig': '자갈등 집게벌레', 'reedhopper': '갈대 뛰개', 'kelpie': '검은발 켈피', 'witch': '수렁 마녀',
 'lizardspear': '긴꼬리 창병', 'suckerfrog': '큰잎 빨판개구리', 'poisonhopper': '독안개 뛰개', 'lizardshield': '긴꼬리 방패병', 'bigpebbleearwig': '큰 자갈등 집게벌레 (10-16 중간 우두머리)',
 'seedbeetle': '갈대씨벌레', 'cattail': '부들줄기', 'coot': '갈대발 물닭', 'loach': '진흙 미꾸리', 'rootcrab': '뿌리납작게', 'barkmoth': '나무껍질 나방', 'vinecoil': '뿌리감개',
 'goby': '진창 망둑', 'leech': '먹빛 턱거머리', 'watersnake': '밤눈 물뱀', 'slinger': '검은물 투석병 (창병 변종)', 'leafbeetle': '잎등 물방개', 'trapleaf': '큰잎 덫꽃',
 'dragonfly': '연잎 왕잠자리', 'mosquito': '안개막 모기', 'salamander': '노란목 도롱뇽', 'leafwitch': '삭은잎 마녀 (수렁 마녀 변종)', 'leaflizard': '떠돌잎 물도마뱀',
 'caiman': '진흙등 악어', 'snapturtle': '이끼등 늑대거북',
 'b9_reedbill': '9층 보스 · 갈대관 큰부리', 'b10_rootkelpie': '10층 보스 · 뿌리멍에 켈피', 'b11_witch': '11층 보스 · 검은물 마녀 베르놀라', 'b12_warden': '12층 보스 · 큰잎 수문장 도르베칸', 'b13_toad': '13층 보스 · 독주머니 두꺼비'}
FLOORS = [('9층 갈대 늪 · Lv63', ['seedbeetle', 'earwig', 'cattail', 'reedhopper', 'coot', 'loach'], 'b9_reedbill', '그 밖: 늪 슬라임 · 수렁 큰부리 · 갈대등 괴물(어제 고른 그림)'),
 ('10층 뿌리 늪 · Lv65', ['pebbleearwig', 'rootcrab', 'barkmoth', 'vinecoil', 'kelpie', 'goby', 'bigpebbleearwig'], 'b10_rootkelpie', '그 밖: 늪 슬라임 · 수렁 큰부리 · 뿌리팔 괴물'),
 ('11층 검은 물수렁 · Lv67 (말뚝 마을)', ['leech', 'watersnake', 'witch', 'lizardspear', 'slinger'], 'b11_witch', '그 밖: 늪 슬라임 · 수렁 큰부리 · 갈대등 괴물 · 검은발 켈피'),
 ('12층 큰잎 늪 · Lv69', ['leafbeetle', 'trapleaf', 'dragonfly', 'suckerfrog', 'lizardshield'], 'b12_warden', '그 밖: 늪 슬라임 · 뿌리팔 · 이끼털 괴물 · 긴꼬리 창병'),
 ('13층 독안개 수렁 · Lv71', ['mosquito', 'salamander', 'leafwitch', 'poisonhopper'], 'b13_toad', '그 밖: 늪 슬라임 · 이끼털 괴물 · 수렁 마녀 · 긴꼬리 창병 · 방패병 · 중간 우두머리 큰 이끼털 괴물(이끼털 괴물을 크게) · 갈래에 강산 슬라임'),
 ('14층 늪지 끝 · Lv73', ['leaflizard', 'caiman', 'snapturtle'], None, '그 밖: 늪 슬라임 · 이끼털 괴물 · 검은발 켈피 · 수렁 마녀 · 큰잎 빨판개구리 · 긴꼬리 방패병 · 던전에 강산 슬라임')]
css = """body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1180px;margin:0 auto;padding:24px 16px}
h1{font-size:28px;margin:0 0 6px}h2{font-size:22px;margin:34px 0 4px;border-top:1px solid #3a3f4a;padding-top:18px}h3{font-size:17px;margin:18px 0 6px;color:#f0c878}
p{margin:4px 0;opacity:.88}.row{display:flex;flex-wrap:wrap;gap:10px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:8px;display:grid;gap:6px}
img{image-rendering:pixelated;display:block}.mon img{width:192px;height:192px;background:#62805a;border-radius:6px}.big img{width:288px;height:288px;background:#62805a;border-radius:6px}
.huge img{width:384px;height:384px;background:#62805a;border-radius:6px}.note{font-size:14px;opacity:.75}"""
o = [f"<!doctype html><meta charset=utf-8><title>늪지대 몬스터 · 보스 시안</title><style>{css}</style><main><h1>늪지대 9 ~ 14층 몬스터 · 보스 시안</h1>",
 "<p>회의 c6 · c7 합의안대로 뽑았습니다(층마다 일반 9종 — 새로 그릴 것만 여기에, 이미 고른 늪지 괴물 · 슬라임 · 수렁 큰부리는 빼고). 몬스터마다 번호를 골라 주세요. 게임에는 아직 안 넣었습니다.</p>",
 "<p class=note>그림체 참고 = 고르신 늪지 괴물 00. 지시문마다 「효과 · 섬광 · 사람 없이, 몬스터만」 — 받은 그림을 모두 눈으로 보았고 엉뚱한 그림은 없었습니다. 일반 96칸(큰 것 128) · 보스 144칸 · 14층 보스 256칸(네 번).</p>"]
def mon(k, cls='mon'):
    d = os.path.join(H, k); o.append(f"<h3>{N.get(k, k)}</h3><div class=row>")
    for f in sorted(os.listdir(d)):
        if f.endswith('.png'): o.append(f"<div class='card {cls}'><img src='data:image/png;base64,{b64(os.path.join(d, f))}'><b>{f[:2]}</b></div>")
    o.append("</div>")
for name, ks, boss, etc in FLOORS:
    o.append(f"<h2>{name}</h2><p class=note>{etc}</p>")
    for k in ks:
        if os.path.isdir(os.path.join(H, k)): mon(k, 'big' if k.startswith('big') else 'mon')
    if boss and os.path.isdir(os.path.join(H, boss)): mon(boss, 'big')
o.append("<h3>14층 보스 · 떠돌섬 포식자 (늪지 대표 초대형)</h3><div class=row>")
for i in range(4):
    p = os.path.join(H, 'b14_island', f'i{i}', '00.png')
    if os.path.exists(p): o.append(f"<div class='card huge'><img src='data:image/png;base64,{b64(p)}'><b>i{i}</b></div>")
o.append("</div></main>")
open(os.path.join(H, 'page_plx75.html'), 'w', encoding='utf-8').write(''.join(o)); print('ok')
