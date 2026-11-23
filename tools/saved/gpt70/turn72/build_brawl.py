"""뒤엉켜 싸우는 전투 시안 페이지: python3 build_brawl.py  (brawl.js + 그림 → page_brawl.html)"""
import base64, json, os
from PIL import Image
H=os.path.dirname(os.path.abspath(__file__)); P=H+'/../pixellab72/'
u=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
st=lambda d,k: dict(src=u(P+d+'/'+k+'.png'), n=Image.open(P+d+'/'+k+'.png').width//80)
AN={k:st('war_v1',k) for k in ('idle','walk','slash3','thrust','bash','upslash','fall','hurt')}
ARC={k:st('arc_v1',k) for k in ('idle','walk','shoot','hurt','fall','kick','homerun')}
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
    <ul class="list"><li><b>걷기</b>: 전사 · 도적 · 전사 · 궁수 · 궁수가 한 줄로 걷고 마차가 맨 뒤에 있습니다.</li><li><b>전사 = 전위 탱커</b>: 하나는 맨 앞, 하나는 뒷줄 앞에 자리를 잡습니다. 전사 옆을 지나 뒷줄로 가려던 몬스터는 붙잡히고(「막았다!」), 뒷줄이 맞기 시작하면 「우렁찬 외침」으로 그 몬스터들을 끌어옵니다.</li><li><b>도적 = 전위 딜러</b>: 자리를 지키지 않고, 체력이 적거나 전사가 붙잡은 적의 뒤로 돌아가 칩니다(「뒤치기!」 피해 1.7배). 맞으면 크게 밀려났다가 다시 들어갑니다.</li><li><b>궁수 = 후위 딜러</b>: 적이 붙으면 「활로 치기」(홈런 스윙, 멀리 날려 보냄 · 5초)를 먼저 쓰고, 쉬는 동안에는 「발차기」(밀어냄 · 3초)로 떼어 내고, 구석이 아니라 가까운 전사 뒤로 돌아 들어갑니다.</li><li><b>몬스터</b>: 고블린 8 ~ 12마리 가운데 다섯에 하나만 뒷줄을 노립니다.</li><li>「느리게 보기」로 천천히 볼 수 있고, 「바로 전투」로 걷기를 건너뜁니다.</li></ul>
  </section>
  <section class="sec"><div class="what item"><h2>임시인 것</h2></div>
    <ul class="list"><li>도적은 아직 그림이 없어 전사 그림으로 섰습니다(더 빠르고 자주 칩니다). 마법사 · 사제 · 짐꾼은 빠져 있습니다.</li><li>몬스터는 고블린 한 장뿐이라 움직임이 기울이기와 늘이기뿐입니다.</li><li>수치는 모두 임시입니다.</li></ul>
  </section>
</main>
<script>{JS}</script>"""
open(H+'/page_brawl.html','w',encoding='utf-8').write(body); print(len(body))
