# 새 궁수 동작 미리보기: arc_v2 띠(한 장 156 × 156 · 0번 장은 서 있는 기준 장이라 뺌)
import os,base64,json
H=os.path.dirname(os.path.abspath(__file__))
b64=lambda f: base64.b64encode(open(os.path.join(H,f),'rb').read()).decode()
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]
idx=json.load(open(H+'/arc_v2/index.json'))
MOT=[('대기','idle',1),('걷기','walk',1),('달리기','run',1),('활쏘기','shoot',0),('힘껏 당겨 쏘기','power',0),('세 발 동시에','triple',0),('하늘로 쏘기','sky',0),('버프 자세','buff',0),('마나 속사 몸동작','mana',0),('활로 치기','swing',0),('발차기','kick',0),('뒤로 물러나기','dodge',0),('앉기','sit',0),('잠자기','sleep',0)]
MOT=[(a,k,idx[k]['n']-1,l) for a,k,l in MOT]; data={k:b64(f'arc_v2/{k}.png') for _,k,_,_ in MOT}
page=f"""<title>궁수 동작</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }}
.card {{ background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 8px; display: grid; gap: 6px; }}
.card canvas {{ display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: 6px; }}
.card b {{ font-weight: 600; }} .card span {{ opacity: .75; font-size: 13px; }}
.row {{ display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }}
.bar {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }}
.bar button {{ font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--sheet); color: inherit; cursor: pointer; }}
.bar button[aria-pressed="true"] {{ background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 궁수 1차</p><h1>궁수 동작</h1><p class="lede">픽에서 뽑은 새 궁수 동작 {len(MOT)}개입니다. 활쏘기 · 힘껏 당겨 쏘기 · 세 발 동시에 · 하늘로 쏘기는 화살 앞끝을 모두 같은 쇠 마름모 화살촉으로 바꿔 그렸습니다.</p></header>
  <section class="sec"><h2>동작 돌려 보기</h2>
    <div class="bar"><button type="button" data-fps="12" aria-pressed="true">보통 빠르기</button><button type="button" data-fps="5" aria-pressed="false">느리게</button></div>
    <div class="grid" id="grid"></div>
    <p class="note" id="save-hint">맞음과 쓰러짐은 아직 받지 못했고, 빠른 한 발은 화살이 거꾸로 그려져 뺐습니다. 반복 동작이 아닌 것은 끝에서 잠깐 멈췄다가 다시 시작합니다.</p>
  </section>
</main>
<script>
const MOT={json.dumps(MOT,ensure_ascii=False)},D={json.dumps(data)};
const I={{}};for(const k in D){{I[k]=new Image();I[k].src='data:image/png;base64,'+D[k]}}
const grid=document.getElementById('grid'),cs=[];
for(const [nm,k,n,loop] of MOT){{const c=document.createElement('div');c.className='card';const cv=document.createElement('canvas');cv.width=150;cv.height=140;cv.setAttribute('role','img');cv.setAttribute('aria-label',nm+' 동작을 하는 궁수');
  const r=document.createElement('div');r.className='row';const t=document.createElement('b');t.textContent=nm;const s=document.createElement('span');s.textContent=n+'장';r.append(t,s);c.append(cv,r);grid.append(c);cs.push([cv.getContext('2d'),k,n,loop]);}}
let fps=12,t0=performance.now();
document.querySelectorAll('.bar button').forEach(x=>x.onclick=()=>{{fps=+x.dataset.fps;t0=performance.now();document.querySelectorAll('.bar button').forEach(y=>y.setAttribute('aria-pressed',y===x))}});
function draw(now){{const f=Math.floor((now-t0)/1000*fps);
  for(const [g,k,n,loop] of cs){{const p=loop?f%n:Math.min(f%(n+6),n-1);g.imageSmoothingEnabled=false;g.fillStyle='#78966e';g.fillRect(0,0,150,140);g.fillStyle='#6a875f';g.fillRect(0,128,150,12);g.drawImage(I[k],(1+p)*156,0,156,156,-3,-4,156,156);}}
  requestAnimationFrame(draw);}}
requestAnimationFrame(draw);
</script>"""
open(H+'/page_arc_v2.html','w',encoding='utf-8').write(page); print(len(page))
