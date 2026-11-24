# 픽셀랩 계층 시안 페이지(11-25 밤): 개미굴 · 늪지대 — 배경 2안 + 대표 몬스터 후보 + 배경 위에 올린 모습
# python mk_page.py → page_plx73.html (브라우저로 열기)
import os, base64, io
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__))
def b64(p):
    return base64.b64encode(open(os.path.join(H, p), 'rb').read()).decode()
def comp(bg, mons, out):   # 배경 2배 위에 몬스터(2배)를 땅 줄에 나란히 — 게임 화면 느낌 보기용
    B = Image.open(os.path.join(H, bg)).convert('RGBA'); B = B.resize((B.width * 2, B.height * 2), Image.NEAREST)
    x = B.width - 40
    for m in mons:
        M = Image.open(os.path.join(H, m)).convert('RGBA'); bb = M.getbbox(); M = M.crop(bb); M = M.resize((M.width * 2, M.height * 2), Image.NEAREST)
        x -= M.width + 30; B.alpha_composite(M, (x, B.height - 40 - M.height))
    B.save(os.path.join(H, out)); return out
FLOORS = [
  ('3층 개미굴', '일개미가 가꾸는 버섯 정원 — 흙굴 · 버섯 언덕 · 굴 입구 · 뿌리 천장 (첫 안전지대 「굴턱 마을」이 있는 층)',
   [('A 버섯 정원', 'bg_antnest/00.png'), ('B 여왕방 가까이(알방 벽)', 'bg_antnest2/00.png')],
   [('일개미 (일반)', 'workerant'), ('여왕개미 (층 보스)', 'queenant')], ('workerant/01.png', 'queenant/01.png')),
  ('늪지대', '갈대 늪 · 검은 물 · 독안개 · 산성 웅덩이 — 산성 슬라임(물리 면역 · 생각보다 강함)이 사는 곳',
   [('A 밤(인공 달)', 'bg_swamp/00.png'), ('B 낮(흐린 인공 태양 · 누런 안개)', 'bg_swamp2/00.png')],
   [('산성 슬라임 (일반 — 강함)', 'acidslime'), ('수렁 큰부리 (층 보스)', 'bogbeak')], ('acidslime/02.png', 'bogbeak/01.png')),
]
css = """body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:'IBM Plex Sans KR',system-ui,sans-serif}
main{max-width:1180px;margin:0 auto;padding:24px 16px}h1{font-size:28px;margin:0 0 6px}h2{font-size:22px;margin:34px 0 4px;border-top:1px solid #3a3f4a;padding-top:18px}
h3{font-size:16px;margin:18px 0 8px;color:#f0c878}p{margin:4px 0;opacity:.85}
.row{display:flex;flex-wrap:wrap;gap:12px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:8px;display:grid;gap:6px}
.card b{font-size:15px}img{image-rendering:pixelated;display:block;max-width:100%}
.bg img{width:528px;max-width:100%}.mon img{width:192px;height:192px;background:repeating-conic-gradient(#6e8a64 0 25%,#62805a 0 50%) 0 0/24px 24px;border-radius:6px}
.comp img{width:1056px;max-width:100%}.note{font-size:14px;opacity:.75}"""
out = [f"<!doctype html><meta charset=utf-8><title>계층 시안 — 개미굴 · 늪지대</title><style>{css}</style><main>",
       "<h1>계층 시안 — 개미굴 · 늪지대</h1><p>픽셀랩으로 뽑은 배경 2안과 대표 몬스터 후보입니다. 마음에 드는 배경 · 몬스터 번호를 골라 주세요(예: 개미굴 배경 B · 일개미 01 · 여왕개미 03). 게임에는 아직 넣지 않았습니다.</p>",
       "<p class=note>배경은 528×224를 2배로, 몬스터는 96×96을 2배로 보여 줍니다. 스타일 참고: 게임의 원시림 배경 · 철갑 풍뎅이 그림. 게임에 넣을 때는 배경을 먼 경치 · 가운데 · 땅 세 겹으로 나눠 다시 뽑고, 몬스터는 파티 쪽(왼쪽)을 보도록 좌우를 뒤집습니다. 일개미 · 산성 슬라임은 64칸으로 뽑을 때 픽셀랩이 두 번 「정책 위반」으로 거절해 96칸으로 뽑았습니다.</p>"]
for name, desc, bgs, mons, cm in FLOORS:
    out.append(f"<h2>{name}</h2><p>{desc}</p><h3>배경</h3><div class=row>")
    for lab, p in bgs: out.append(f"<div class='card bg'><img src='data:image/png;base64,{b64(p)}' alt='{name} 배경 {lab}'><b>{lab}</b></div>")
    out.append("</div>")
    for lab, d in mons:
        out.append(f"<h3>{lab}</h3><div class=row>")
        for f in sorted(os.listdir(os.path.join(H, d))):
            if f.endswith('.png') and f[:2].isdigit(): out.append(f"<div class='card mon'><img src='data:image/png;base64,{b64(d + '/' + f)}' alt='{lab} {f[:2]}'><b>{f[:2]}</b></div>")
        out.append("</div>")
    out.append("<h3>배경 위에 올려 본 모습(예시 조합)</h3>")
    for lab, p in bgs:
        c = comp(p, list(cm), f"comp_{os.path.dirname(p)}.png")
        out.append(f"<div class='card comp'><img src='data:image/png;base64,{b64(c)}' alt='{name} {lab} 위 몬스터'><b>{lab} + {' · '.join(os.path.dirname(m) + ' ' + os.path.basename(m)[:2] for m in cm)}</b></div>")
out.append("</main>")
open(os.path.join(H, 'page_plx73.html'), 'w', encoding='utf-8').write(''.join(out)); print('ok')
