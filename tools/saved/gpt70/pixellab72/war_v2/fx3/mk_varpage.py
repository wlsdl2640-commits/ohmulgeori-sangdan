# 시안 넷 비교 쪽(멈춘 그림) — python mk_varpage.py  → ../page_fx3_var1~3.html
import base64, io, os
from PIL import Image
NAME={'slash':'밀어 베기','twocut':'두 번 베기','downcut':'내려 베기','lowcut':'발굽 끊기','sweep':'가로 휩쓸기','counter':'되치기','bash':'방패 두드리기','shove':'방패 밀치기','block':'둥근 방패 막기','taunt':'도발','warcry':'돌격 함성','resolve':'결의','brace':'자세 고정','steel':'강철 피부','earth':'대지 가르기','leap':'뛰어들기','shieldland':'방패 착지'}
J={  # 클팀장 판단(필요한가 · 보이는가 · 그림체) — ①②③④
'slash':'넷 다 칼 길이 또렷 · ③이 맞은 자리 불꽃까지 가장 잘 읽힘 · ④는 1차엔 과함',
'twocut':'①② X가 또렷 · ③은 X가 8자처럼 뭉개짐 · ④ 빛 기둥은 스킬과 상관없음',
'downcut':'①②③ 위→아래가 잘 읽힘 · ④ 기둥 · 마법진은 필요 없는 장식',
'lowcut':'①②③ 낮게 스치는 게 보임 · ③이 흙 튐까지 · ④ 불길은 스킬과 상관없음',
'sweep':'①②③ 넓게 휩쓰는 게 보임 · ④는 겹 고리가 화면을 덮음',
'counter':'①②③ 막기 불꽃 → 베기 두 박자가 읽힘 · ④는 자리가 몬스터를 덮음',
'bash':'①② 둔탁한 충격이 잘 읽힘 · ③ 가장 힘 있음 · ④ 빛 기둥은 상관없음',
'shove':'미는 힘은 보이나 넷 다 기절 별이 작음 → 고른 뒤 기절 별을 따로 더함',
'block':'①②③은 금화처럼 보임 · ④만 방패 벽으로 읽힘 → 다시 뽑기 추천',
'taunt':'①② 붉은 외침이 또렷 · ③ 불꽃이 많아도 그림체 맞음 · ④는 크다',
'warcry':'①③ 함성 고리가 앞으로 · ②는 짐승 실루엣(몸 뒤라 거의 안 보임) · ④ 크다',
'resolve':'② 빛 기둥이 「결의」로 읽힘 · ① 약함 · ③ 왕관 · ④ 큰 기둥은 1차엔 과함',
'brace':'①②③ 발밑 고정이 읽힘 · ④ 기둥은 상관없음',
'steel':'① 쇠사슬 고리가 「강철」로 가장 잘 읽힘(상시 효과라 작게) · ② 알 · ③④ 과함',
'earth':'①② 솟는 돌 · ③ 불길 갈라짐이 앞으로 뻗는 게 가장 잘 읽힘 · ④ 자리 넘침',
'leap':'①②③ 착지 흙먼지 좋음 · ④ 기둥은 상관없음',
'shieldland':'① 반투명 막이 가장 잘 읽힘(몸이 보임) · ② 불투명 · ③ 테두리 막 · ④ 큼',
}
ks=list(NAME)
css="body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1560px;margin:0 auto;padding:14px}h3{color:#f0c878;margin:14px 0 2px}p{margin:2px 0 6px;opacity:.9}img{image-rendering:pixelated;width:100%;max-width:1510px;border-radius:6px}.hd{display:grid;grid-template-columns:repeat(4,1fr);max-width:1510px;font-weight:700;color:#9fd}"
for pg in range(6):
    part=ks[pg*3:(pg+1)*3]; o=[f"<!doctype html><meta charset=utf-8><title>전사 효과 시안 넷 {pg+1}/6</title><style>{css}</style><main><h2>전사 1차 효과 — 시안 넷 ({pg+1}/6)</h2><div class=hd><span>① 1차 기준 (차분)</span><span>② 2차 기준 (보통)</span><span>③ 3차 기준 (화려)</span><span>④ 4차 기준 (최대)</span></div>"]
    for k in part:
        im=Image.open(f'var/{k}.png').quantize(96,dither=0); b=io.BytesIO(); im.save(b,'PNG',optimize=True)
        o.append(f"<h3>{NAME[k]}</h3><p>{J[k]}</p><img src='data:image/png;base64,{base64.b64encode(b.getvalue()).decode()}'>")
    o.append('</main>'); fn=f'../page_fx3_var{pg+1}.html'; open(fn,'w',encoding='utf-8').write(''.join(o)); print(fn,os.path.getsize(fn)//1024)
