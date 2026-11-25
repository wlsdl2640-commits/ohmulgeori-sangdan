# 3층 개미굴 · 늪지대 시안 판(11-25 낮, 회의 c1 → 픽셀랩): python mk_page.py → page_plx74.html
import os, base64
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); P73 = os.path.join(H, '..', 'plx73')
def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()
def comp(bg, mons, out, k=2):
    B = Image.open(bg).convert('RGBA'); B = B.resize((B.width * 2, B.height * 2), Image.NEAREST); x = B.width - 30
    for m, s in mons:
        M = Image.open(m).convert('RGBA'); M = M.crop(M.getbbox()); M = M.resize((int(M.width * s), int(M.height * s)), Image.NEAREST)
        x -= M.width + 20; B.alpha_composite(M, (x, B.height - 30 - M.height))
    B.save(os.path.join(H, out)); return os.path.join(H, out)
ANT = [('soldier', '큰머리 병정개미', '페이돌레 · 군대개미 병정 — 머리를 내밀어 뒤쪽 아군 대신 맞음 · 3-4·5·9·12·14·17·18칸 · 1.2배'),
 ('trapjaw', '덫턱개미', '턱을 튕겨 들어가 앞줄 한 명 잠깐 기절 · 3-6·11·15·17칸'),
 ('honeypot', '꿀단지개미', '호박빛 배 → 가까운 개미에게 보호막 한 번 · 저장꿀 · 3-9·11칸'),
 ('aphids', '진딧물 무리', '단물로 다친 개미 한 번 회복 · 3-3·5칸'),
 ('pupa', '알방 번데기', '8초 살아 있으면 일개미로 깨어남 · 3-13·14·16·18칸'),
 ('antlion', '개미귀신', '3-10 모래 구덩이 함정 — 우회 / 돌파'),
 ('fungusant', '포자에 먹힌 개미', '동충하초 — 쓰러지면 포자로 가까운 길드원 한 번 피해 · 3-7·12·16칸'),
 ('mimicspider', '개미 흉내 거미', '개미처럼 서 있다가 뒷줄 기습 · 3-8칸 (개미처럼 보이는 게 맞는 모습)'),
 ('bluelarva', '부전나비 애벌레', '여왕 소리를 흉내 — 곁의 일개미가 대신 맞아 줌 · 서브 스토리 단서 · 3-15·16칸'),
]
SW = [('swampbrute', '늪지 괴물', '예전 산성 슬라임 시안을 튼 것 — 진흙 · 뿌리 앞팔로 앞줄을 휩쓺, 물리 정상'),
 ('slime', '늪 슬라임 (새 슬라임)', '둥글고 크고 귀여움 · 머리 방울 없음 · 본길에서 물리 피해 25% 감소부터 시험'),
 ('acidslime', '강산 슬라임', '보라 핵 · 물리 면역은 13층 갈래 · 14층 던전에서만 (입구에서 알림)')]
css = """body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1180px;margin:0 auto;padding:24px 16px}
h1{font-size:28px;margin:0 0 6px}h2{font-size:22px;margin:34px 0 4px;border-top:1px solid #3a3f4a;padding-top:18px}h3{font-size:17px;margin:20px 0 4px;color:#f0c878}
p{margin:4px 0;opacity:.88}.row{display:flex;flex-wrap:wrap;gap:12px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:8px;display:grid;gap:6px}
img{image-rendering:pixelated;display:block;max-width:100%}.mon img{width:192px;height:192px;background:#62805a;border-radius:6px}.queen img{width:384px;height:384px;background:#62805a;border-radius:6px}
.bg img{width:1056px}.note{font-size:14px;opacity:.75}"""
o = [f"<!doctype html><meta charset=utf-8><title>3층 개미굴 · 늪지대 시안</title><style>{css}</style><main><h1>3층 개미굴 완성 · 늪지대 시안</h1>",
 "<p>회의 c1 합의안대로 픽셀랩으로 뽑았습니다. 몬스터마다 마음에 드는 번호를 골라 주세요(예: 병정개미 01 · 여왕 q2). 게임에는 아직 넣지 않았습니다.</p>",
 "<p class=note>지시문마다 「효과 · 섬광 · 사람 없이, 몬스터만」을 넣었고, 받은 그림을 모두 눈으로 보았습니다 — 엉뚱한 그림은 없었습니다. 병정개미는 첫 판의 머리가 작아 「머리가 몸만큼 큰」 지시로 한 번 다시 뽑은 것만 올렸습니다. 정원 일개미 · 수렁 큰부리는 어제 시안 그대로 씁니다. 그림체 참고 = 어제 일개미 시안. 몬스터 96칸 · 문지기 144칸 · 여왕 256칸(2배로 보여 줌, 여왕은 그대로 1.5배).</p>",
 "<h2>3층 개미굴</h2><h3>굴의 여왕개미 (층 보스 · 초대형 예외)</h3><p>알로 부푼 배 · 검붉은 갑각 · 일개미를 8초마다 부름 · 체력 절반에서 천장 붕괴 · 페로몬 지휘. 256칸으로 네 번 뽑음.</p><div class=row>"]
for i in range(4): o.append(f"<div class='card queen'><img src='data:image/png;base64,{b64(os.path.join(H,'queen',f'q{i}','00.png'))}'><b>q{i}</b></div>")
o.append("</div>")
def mons(L):
    for k, n, d in L:
        o.append(f"<h3>{n}</h3><p>{d}</p><div class=row>")
        for f in sorted(os.listdir(os.path.join(H, k))): o.append(f"<div class='card mon'><img src='data:image/png;base64,{b64(os.path.join(H,k,f))}'><b>{f[:2]}</b></div>")
        o.append("</div>")
mons(ANT)
o.append("<h3>문지기 개미 (중간 우두머리 · 다시 뽑음)</h3><p>대표님 「머리 뚜껑이 굴만 해야」 → 원반 머리를 굴문만큼 크게, 256칸으로 네 번. 굴문을 막고 있다가 구멍에서 빠져나오며 전투 · 3-19칸. (첫 판 144칸 시안은 gatekeeper_old에 보관)</p><div class=row>")
for i in range(4): o.append(f"<div class='card queen'><img src='data:image/png;base64,{b64(os.path.join(H,'gate2',f'g{i}','00.png'))}'><b>g{i}</b></div>")
o.append("</div>")
o.append("<h3>배경 위에 올려 본 모습 (예시 조합 — 어제 배경 A · B)</h3>")
c1 = comp(os.path.join(P73, 'bg_antnest', '00.png'), [(os.path.join(H, 'soldier', '00.png'), 1), (os.path.join(P73, 'workerant', '01.png'), 1), (os.path.join(H, 'aphids', '01.png'), 1)], '_comp_a.png')
c2 = comp(os.path.join(P73, 'bg_antnest2', '00.png'), [(os.path.join(H, 'queen', 'q2', '00.png'), 1.3), (os.path.join(H, 'gate2', 'g1', '00.png'), 1.2)], '_comp_b.png')
for c, t in [(c1, 'A 버섯 정원 (1~12칸) + 병정개미 · 일개미 · 진딧물'), (c2, 'B 알방 · 여왕방 (13~20칸) + 여왕 q2 · 문지기')]: o.append(f"<div class='card bg'><img src='data:image/png;base64,{b64(c)}'><b>{t}</b></div>")
o.append("<h2>늪지대 (9~14층)</h2><h3>새 물길 배경 — 물이 찬 길목 · 이동 20% 느려짐</h3><div class=row>")
for t, n in [('day', '낮 (흐린 인공 태양 · 누런 안개)'), ('night', '밤 (인공 달)')]: o.append(f"<div class='card bg'><img src='data:image/png;base64,{b64(os.path.join(H,'bg_water',t,'00.png'))}' style='width:1056px'><b>{n}</b></div>")
o.append("</div>")
mons(SW)
o.append("</main>"); open(os.path.join(H, 'page_plx74.html'), 'w', encoding='utf-8').write(''.join(o)); print('ok')
