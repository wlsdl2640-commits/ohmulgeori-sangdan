# 도적 동작 미리보기: rogue_v1 띠(80×80, 발 줄 y 58)를 전사 대기(war_v1, 발 줄 y 65) 옆에서 돌려 본다
import os,base64,json
H=os.path.dirname(os.path.abspath(__file__))
b64=lambda f: base64.b64encode(open(os.path.join(H,f),'rb').read()).decode()
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]
idx=json.load(open(H+'/rogue_v1/index.json'))
# 이름, 띠, 쓰는 장(처음, 끝), 반복 여부
MOT=[('대기','idle',1,16,1),('걷기','walk',1,16,1),('달리기','run',1,16,1),('단검 베기','slash',0,19,0),('찌르기','thrust',1,20,0),('뒤치기','backstab',1,20,0),('연속 베기','double',1,20,0),('뒤로 물러나기','dodge',1,20,0),('맞음','hurt',1,16,0),('쓰러짐','fall',9,20,0),('앉기','sit',1,20,0),('잠자기','sleep',1,16,0)]
data={k:b64(f'rogue_v1/{k}.png') for _,k,*_ in MOT}; war=b64('war_v1/idle.png')
page=f"""<title>도적 동작</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }}
.card {{ background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 8px; display: grid; gap: 6px; }}
.card canvas {{ display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: 6px; }}
.card b {{ font-weight: 600; }} .card span {{ color: var(--muted, inherit); opacity: .75; font-size: 13px; }}
.row {{ display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }}
.bar {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }}
.bar button {{ font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--sheet); color: inherit; cursor: pointer; }}
.bar button[aria-pressed="true"] {{ background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 도적 1차</p><h1>도적 동작</h1><p class="lede">픽셀랩에서 뽑은 도적 동작 12개입니다. 칸마다 왼쪽은 전사(대기), 오른쪽이 도적입니다.</p></header>
  <section class="sec"><h2>동작 돌려 보기</h2>
    <div class="bar"><button type="button" data-fps="12" aria-pressed="true">보통 빠르기</button><button type="button" data-fps="5" aria-pressed="false">느리게</button></div>
    <div class="grid" id="grid"></div>
    <p class="note" id="save-hint">쓰러짐은 앞쪽 서 있는 장을 빼고 돌립니다. 반복 동작이 아닌 것은 끝에서 잠깐 멈췄다가 다시 시작합니다.</p>
  </section>
</main>
<script>
const MOT={json.dumps(MOT,ensure_ascii=False)},D={json.dumps(data)},WAR="{war}";
const img=s=>{{const i=new Image();i.src='data:image/png;base64,'+s;return i}};
const W=img(WAR),I={{}};for(const k in D)I[k]=img(D[k]);
const grid=document.getElementById('grid'),cs=[];
for(const [nm,k,a,b,loop] of MOT){{const c=document.createElement('div');c.className='card';const cv=document.createElement('canvas');cv.width=110;cv.height=64;cv.setAttribute('role','img');cv.setAttribute('aria-label',nm+' 동작을 하는 도적과 전사');
  const r=document.createElement('div');r.className='row';const t=document.createElement('b');t.textContent=nm;const n=document.createElement('span');n.textContent=(b-a+1)+'장';r.append(t,n);c.append(cv,r);grid.append(c);cs.push([cv.getContext('2d'),k,a,b,loop]);}}
let fps=12,t0=performance.now();
document.querySelectorAll('.bar button').forEach(x=>x.onclick=()=>{{fps=+x.dataset.fps;t0=performance.now();document.querySelectorAll('.bar button').forEach(y=>y.setAttribute('aria-pressed',y===x))}});
function draw(now){{const f=Math.floor((now-t0)/1000*fps);
  for(const [g,k,a,b,loop] of cs){{const n=b-a+1,p=loop?f%n:Math.min(f%(n+6),n-1);g.imageSmoothingEnabled=false;g.fillStyle='#78966e';g.fillRect(0,0,110,64);g.fillStyle='#6a875f';g.fillRect(0,52,110,12);
    g.drawImage(W,((f%16)+1)*80,0,80,80,-12,-13,80,80);g.drawImage(I[k],(a+p)*80,0,80,80,34,-6,80,80);}}
  requestAnimationFrame(draw);}}
requestAnimationFrame(draw);
</script>"""
open(H+'/page_rogue_v1.html','w',encoding='utf-8').write(page); print(len(page))
