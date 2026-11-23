"""턴제 전투 시안 2 페이지 만들기: python3 build_battle2.py  (battle2.js + 그림 → page_battle.html)"""
import base64, json, os
from PIL import Image
H=os.path.dirname(os.path.abspath(__file__)); P=H+'/../pixellab72/'
u=lambda f:'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
st=lambda d,k: dict(src=u(P+d+'/'+k+'.png'), n=Image.open(P+d+'/'+k+'.png').width//80)
AN={k:st('war_v1',k) for k in ('idle','walk','slash3','thrust','bash','block','fall','upslash','hurt')}
ARC={k:st('arc_v1',k) for k in ('idle','walk','hurt','fall')}; ARC['thrust']=ARC['slash3']=ARC['bash']=st('arc_v1','shoot'); ARC['upslash']=ARC['block']=st('arc_v1','upshot')
src=open(H+'/../adv_hq/page_px_compare.html',encoding='utf-8').read(); css=src[src.index('<link rel="stylesheet"'):src.index('</style>')+8]
JS=open(H+'/battle2.js',encoding='utf-8').read().replace('__AN__',json.dumps(AN)).replace('__ARC__',json.dumps(ARC)).replace('__BG__',u(H+'/bg720.png')).replace('__GOB__',u(H+'/goblin.png')).replace('__TILES__',u(H+'/tiles/plains_atlas.png')).replace('__BGF__',u(H+'/tiles/plains_bgfloor.png'))
body=f"""<title>턴제 전투 시안</title>
{css}
<style>
  .stagebox {{ background: #1b2420; border-radius: 12px; padding: 8px; }}
  #stage {{ image-rendering: pixelated; width: 100%; height: auto; display: block; border-radius: 6px; touch-action: none; }}
  #acts {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }}
  #acts .btn.off {{ opacity: .45; }}
  #acts .btn.on {{ outline: 2px solid currentColor; outline-offset: -2px; }}
  #msg {{ min-height: 2.6em; margin: 10px 0 0; }}
  #info {{ min-height: 1.4em; margin: 6px 0 0; font-variant-numeric: tabular-nums; }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 전투 화면</p><h1>턴제 전투 시안</h1><p class="lede">격자를 12 × 8로 넓히고, 바닥 전체를 층의 생태계에 맞는 타일로 깐 시안입니다. 바닥 타일 한 장이 격자 한 칸이고, 타일은 살짝 사선으로 누워 있습니다. 정한 대형 그대로 걷고, 몬스터를 만나면 그 자리에서 바로 싸웁니다. 아직 게임에는 넣지 않았습니다.</p></header>
  <section class="sec">
    <div class="item"><div class="stagebox"><canvas id="stage" role="img" aria-label="바닥 전체에 가로 8칸 세로 6칸 격자가 깔린 전투 화면. 왼쪽에 모험가 여섯, 오른쪽에 고블린과 바위가 있다"></canvas></div>
      <p class="note" id="info" aria-live="polite"></p><p class="note" id="msg" aria-live="polite"></p><div id="acts"></div></div>
    <p class="note" id="save-hint">눌러 보는 시안이라 저장 단추는 없습니다.</p>
  </section>
  <section class="sec"><div class="what item"><h2>해 보는 법</h2></div>
    <ul class="list"><li>모험가를 끌어 푸른 칸(마차 앞 네 열) 안에서 자리를 정하고 「원정 출발」을 누릅니다.</li><li>정한 대형 그대로 걸어갑니다. 몬스터가 오른쪽에서 들어오면 그 자리에서 바로 싸움이 시작됩니다. 마차는 맨 뒤 가운데에 늘 있습니다.</li><li>기본은 자동입니다. 「수동으로 전환」을 누르면 모험가를 눌러 이동 · 기본 공격 · 스킬을 직접 고르고 「턴 종료」를 누릅니다. 언제든 다시 자동으로 돌릴 수 있습니다.</li><li>「평원」은 예전에 만든 평원 배경의 땅을 넓혀 바닥으로 쓰고 그 위에 사선 격자만 얹은 것입니다. 「평원 타일」은 픽셀랩 타일을 깐 것, 「버섯 숲」「모래 협곡」은 비교용 임시 도형입니다.</li></ul>
  </section>
  <section class="sec"><div class="what item"><h2>이 시안에 넣은 것</h2></div>
    <ul class="list"><li><b>포인트 셋</b>: 행동(AP) 턴마다 1 · 이동(GP) 턴마다 4 · 스킬(SP) 턴마다 +1, 최대 3. 머리 위 파란 원이 스킬 포인트입니다.</li><li><b>체력 10칸</b>: 머리 위 막대가 한 줄 10칸입니다. 한 칸이 체력 2, 체력 20마다 한 겹이고 겹마다 색이 다릅니다(초록 → 파랑 → 보라). 체력이 줄면 줄어든 칸에 아래 겹의 색이 보입니다. 넘치게 회복하면 막대 위에 하늘색 보호막 칸이 붙습니다.</li><li><b>전사</b>: 패링(다음 한 번을 막고 되받아침) · 방패 밀치기(2칸 밀기, 바위에 부딪히면 바위가 부서지고 뒤 칸이 연쇄 피해) · 우렁찬 외침</li><li><b>궁수</b>: 연격(기본 공격을 할 때마다 한 발씩 늘어 다음 턴에 여러 발, 최대 5) · 관통 화살(바위를 부숨) · 풍압 화살(밀치기)</li><li><b>마법사</b>: 화염구(십자 5칸, 아군도 맞음) · <b>사제</b>: 치유의 빛(넘친 만큼 보호막) · <b>도적</b>: 회피 30%, 급소 찌르기(출혈), 그림자 교대(자리 바꾸기)</li><li><b>짐꾼</b>: 석궁(멀리서 기본 공격) · 옮기기(옆의 아군이나 바위를 들어 2칸 안 빈 칸에 내려놓음) · 보급품 살포</li><li>수치는 모두 임시입니다. 그림은 전사와 궁수만 있어서 나머지 직업은 전사 그림이고, 몬스터는 고블린 한 가지입니다. 마법사의 영창(턴을 기다려 범위를 키우는 것)과 상태이상 대부분은 아직 넣지 않았습니다.</li></ul>
  </section>
</main>
<script>{JS}</script>"""
open(H+'/page_battle.html','w',encoding='utf-8').write(body); print(len(body))
