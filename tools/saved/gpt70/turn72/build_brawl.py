"""뒤엉켜 싸우는 전투 시안 페이지: python3 build_brawl.py  (brawl.js + 그림 → page_brawl.html)"""
import base64, json, os
from PIL import Image
H=os.path.dirname(os.path.abspath(__file__)); P=H+'/../pixellab72/'
u=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
st=lambda d,k: dict(src=u(P+d+'/'+k+'.png'), n=Image.open(P+d+'/'+k+'.png').width//80)
AN={k:st('war_v1',k) for k in ('idle','walk','slash3','thrust','bash','upslash','fall','hurt')}
ARC={k:st('arc_v1',k) for k in ('idle','walk','shoot','hurt','fall')}
src=open(H+'/../adv_hq/page_px_compare.html',encoding='utf-8').read(); css=src[src.index('<link rel="stylesheet"'):src.index('</style>')+8]
JS=open(H+'/brawl.js',encoding='utf-8').read().replace('__AN__',json.dumps(AN)).replace('__ARC__',json.dumps(ARC)).replace('__BG__',u(H+'/bg720.png')).replace('__GOB__',u(H+'/goblin.png'))
body=f"""<title>뒤엉키는 전투 시안</title>
{css}
<style>
  .stagebox {{ background: #1b2420; border-radius: 12px; padding: 8px; }}
  #stage {{ image-rendering: pixelated; width: 100%; height: auto; display: block; border-radius: 6px; }}
  #acts {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }}
  #acts .btn.on {{ outline: 2px solid currentColor; outline-offset: -2px; }}
  #msg {{ min-height: 1.6em; margin: 10px 0 0; }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 전투 화면</p><h1>뒤엉키는 전투 시안</h1><p class="lede">맵은 예전 옆모습 그대로입니다. 한 줄로 걷다가 몬스터를 만나면 전투 상태로 바뀌고, 근접 모험가들이 달려들어 적과 서로 겹쳐 싸웁니다. 칸은 없고 모두가 동시에 움직입니다. 아직 게임에는 넣지 않았습니다.</p></header>
  <section class="sec">
    <div class="item"><div class="stagebox"><canvas id="stage" role="img" aria-label="옆에서 본 평원. 왼쪽에서 모험가 다섯이 한 줄로 걷다가 오른쪽에서 온 고블린 무리와 가운데에서 뒤엉켜 싸운다"></canvas></div>
      <p class="note" id="msg" aria-live="polite"></p><div id="acts"></div></div>
    <p class="note" id="save-hint">보기만 하는 시안이라 저장 단추는 없습니다.</p>
  </section>
  <section class="sec"><div class="what item"><h2>볼 곳</h2></div>
    <ul class="list"><li><b>걷기</b>: 전사 · 도적 · 전사 · 궁수 · 궁수가 한 줄로 걷고 마차가 맨 뒤에 있습니다.</li><li><b>만남</b>: 고블린이 오른쪽에서 달려오면 걸음을 멈추고, 근접 셋이 먼지를 일으키며 뛰어듭니다.</li><li><b>뒤엉킴</b>: 근접은 목표 바로 앞에 붙습니다. 같은 적을 둘이 치면 위아래로 조금 어긋나 겹쳐 서고, 앞에 있는 쪽이 뒤를 가립니다. 맞으면 뒤로 밀리고, 방패 밀치기에 맞은 적은 멀리 튕겨 나갑니다.</li><li><b>뒤쪽</b>: 궁수는 앞줄과 거리를 두고 화살을 쏩니다.</li><li><b>끝</b>: 이기면 흩어진 모험가들이 걸어서 줄을 다시 맞추고 계속 갑니다.</li><li>「느리게 보기」로 겹치는 모습을 천천히 볼 수 있고, 「바로 전투」로 걷기를 건너뜁니다.</li></ul>
  </section>
  <section class="sec"><div class="what item"><h2>임시인 것</h2></div>
    <ul class="list"><li>도적은 아직 그림이 없어 전사 그림으로 섰습니다(더 빠르고 자주 칩니다). 마법사 · 사제 · 짐꾼은 빠져 있습니다.</li><li>몬스터는 고블린 한 장뿐이라 움직임이 기울이기와 늘이기뿐입니다.</li><li>실시간 자동 전투로 만들었습니다. 스킬 · 스킬 포인트 · 수치는 넣지 않았습니다.</li></ul>
  </section>
</main>
<script>{JS}</script>"""
open(H+'/page_brawl.html','w',encoding='utf-8').write(body); print(len(body))
