# 궁수 1차 스킬 이펙트 시안 1: 코드로 그리는 도트 효과를 arc_v2 동작 위에 겹쳐 돌려 본다(게임에는 안 넣음)
import os,base64,json
H=os.path.dirname(os.path.abspath(__file__))
b64=lambda f: base64.b64encode(open(os.path.join(H,f),'rb').read()).decode()
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]
data={k:b64(f'arc_v2/{k}.png') for k in ('shoot','buff','idle','dodge')}
page=f"""<title>궁수 스킬 이펙트</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>
.card {{ background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 8px; display: grid; gap: 6px; margin: 0 0 12px; }}
.card canvas {{ display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: 6px; }}
.card b {{ font-weight: 600; }} .card p {{ margin: 0; font-size: 14px; opacity: .85; }}
.bar {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }}
.bar button {{ font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--sheet); color: inherit; cursor: pointer; }}
.bar button[aria-pressed="true"] {{ background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 궁수 1차 스킬</p><h1>궁수 스킬 이펙트</h1><p class="lede">스킬 이펙트 첫 시안 넷입니다. 궁수 동작 위에 효과를 겹쳐 돌려 본 것이고 게임에는 넣지 않았습니다.</p></header>
  <section class="sec"><h2>시안</h2>
    <div class="bar"><button type="button" data-sp="1" aria-pressed="true">보통 빠르기</button><button type="button" data-sp="0.4" aria-pressed="false">느리게</button></div>
    <div id="list"></div>
    <p class="note" id="save-hint">보기만 하는 시안이라 저장 단추는 없습니다. 나머지 스킬(목표추적 · 예리한사격 · 매의 눈 · 화살비 등)은 이 넷의 방향이 정해지면 이어서 만듭니다.</p>
  </section>
</main>
<script>
const D={json.dumps(data)},I={{}};for(const k in D){{I[k]=new Image();I[k].src='data:image/png;base64,'+D[k]}}
const W=240,Hh=150,GY=128,OX=18,OY=-6;          // 캐릭터 한 장(156)을 (OX, OY)에 — 발 줄 132 + OY = 126
const px=(g,x,y,c,w=1,h=1)=>{{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)}};
function base(g){{g.fillStyle='#78966e';g.fillRect(0,0,W,Hh);g.fillStyle='#6a875f';g.fillRect(0,GY,W,Hh-GY)}}
function spr(g,k,f,dx=0,dy=0){{g.drawImage(I[k],f*156,0,156,156,OX+dx,OY+dy,156,156)}}
// 바람이 몸을 휘감으며 올라감: 나선 여섯 줄기, 몸 뒤쪽 반 바퀴는 캐릭터보다 먼저 그림
function swirl(g,t,pal,front){{const cx=OX+76,by=GY-2;          // 나선 띠 넷이 몸을 감고 올라감(뒤 반 바퀴는 캐릭터보다 먼저 그림)
  for(let k=0;k<4;k++){{const rise=((t*52+k*26)%104),fade=rise>78?1-(rise-78)/26:Math.min(1,rise/10);
    for(let s=0;s<26;s++){{const a=t*8+k*1.57-s*0.13,z=Math.sin(a),y=by-rise+s*0.9,r=27-rise*0.07;
      if((z>0)!==front||y>by||s/26>fade)continue;const c=pal[s<5?0:s<14?1:2];px(g,cx+Math.cos(a)*r,y,c,s<10?3:2,s<5?2:1)}}}}
  if(front)for(let k=0;k<7;k++){{const r2=((t*70+k*19)%100);px(g,cx-26+((k*29)%52),by-r2,pal[k%2],1,2)}}}}
function dust(g,x,y,t){{if(t<0||t>0.55)return;const C=t<0.18?'#f0e6cc':t<0.36?'#d2c29a':'#b0a07c';          // 흙먼지: 덩이 여섯이 양옆으로 퍼지며 떠오르다 작아짐
  for(let i=0;i<6;i++){{const d=(i-2.5)/2.5,r=6+t*44,s=t<0.2?4:t<0.38?3:2;px(g,x+d*r-s/2,y-s-(1-d*d)*t*20,C,s,s);if(t<0.3)px(g,x+d*r*0.6,y-2,'#d2c29a',2,2)}}}}
const SK=[
 {{n:'크리티컬샷',d:'놓는 순간 화살 자리에서 빛줄기 한 줄이 같은 속도로 나갑니다. 화살은 가려집니다.',len:2.6,draw(g,t){{const f=Math.min(20,1+Math.floor(t*12)),rel=14.5/12;base(g);spr(g,'shoot',f);if(f>=15&&f<=17){{g.fillStyle='#78966e';g.fillRect(OX+121,OY+66,W,20)}}          // 그림에 든 날아가는 화살 조각은 가림
    const ay=OY+76,bx=OX+112;
    if(t>=rel-0.5&&t<rel){{const c=(t-(rel-0.5))/0.5;for(let i=0;i<6;i++){{const a=i*1.05+t*9,r=14*(1-c);px(g,bx+Math.cos(a)*r,ay+Math.sin(a)*r,i%2?'#fff':'#ffe98a')}}}}          // 모이는 빛
    if(t>=rel){{const u=t-rel,hx=bx+u*330,L=70;
      if(u<0.12){{for(let i=0;i<8;i++){{const a=i*0.785;px(g,bx+Math.cos(a)*(4+u*60),ay+Math.sin(a)*(4+u*60),'#fff',2,2)}}}}          // 놓는 순간 섬광
      for(let x=Math.max(bx,hx-L);x<hx;x++){{const k=(hx-x)/L;if(k<0.6){{px(g,x,ay-2,'#f0c060');px(g,x,ay+2,'#f0c060')}}px(g,x,ay-1,k<0.75?'#ffe98a':'#f0c060');px(g,x,ay,k<0.85?'#ffffff':'#ffe98a');px(g,x,ay+1,k<0.75?'#ffe98a':'#f0c060')}}
      if(hx<W+L){{px(g,hx,ay-3,'#fff',2,7);px(g,hx+2,ay-2,'#fff',2,5);px(g,hx+4,ay-1,'#fff',2,3);px(g,hx+6,ay,'#fff',2,1)}}}}}}}},
 {{n:'고속사격',d:'버프 자세를 취하면 연두빛 바람이 몸을 휘감으며 올라갑니다.',len:2.4,draw(g,t){{const f=Math.min(20,1+Math.floor(t*10)),P=['#ffffff','#c8f0a0','#78c860'];base(g);if(t>0.3&&t<2.1)swirl(g,t,P,false);spr(g,'buff',f);if(t>0.3&&t<2.1)swirl(g,t,P,true)}}}},
 {{n:'숨 고르기',d:'대기 자세로 숨을 고르는 동안 푸른빛 바람이 감깁니다. 고속사격과 같은 효과에 색만 다릅니다.',len:2.4,draw(g,t){{const f=1+Math.floor(t*8)%16,P=['#ffffff','#a8d8ff','#5898e0'];base(g);if(t>0.2&&t<2.1)swirl(g,t*0.7,P,false);spr(g,'idle',f);if(t>0.2&&t<2.1)swirl(g,t*0.7,P,true)}}}},
 {{n:'백스텝',d:'뒤로 뛸 때 발밑에서, 착지할 때 다시 한 번 흙먼지가 입니다. 물러나는 거리는 게임에서 옮깁니다.',len:2.4,draw(g,t){{const f=Math.min(20,1+Math.floor(t*11)),tj=6/11,tl=12/11;let dx=40;if(t>tj)dx=40-Math.min(1,(t-tj)/(tl-tj))*46;base(g);
    dust(g,OX+40+78,GY-1,t-tj);dust(g,OX+dx+78,GY-1,t-tl);spr(g,'dodge',f,dx)}}}}];
const list=document.getElementById('list'),cs=[];
for(const s of SK){{const c=document.createElement('figure');c.className='card';const cv=document.createElement('canvas');cv.width=W;cv.height=Hh;cv.setAttribute('role','img');cv.setAttribute('aria-label',s.n+' 스킬 이펙트가 궁수 위에 겹쳐 움직이는 모습');
  const b=document.createElement('b');b.textContent=s.n;const p=document.createElement('p');p.textContent=s.d;c.append(cv,b,p);list.append(c);cs.push([cv.getContext('2d'),s])}}
let sp=1,T=0,last=performance.now();
document.querySelectorAll('.bar button').forEach(x=>x.onclick=()=>{{sp=+x.dataset.sp;document.querySelectorAll('.bar button').forEach(y=>y.setAttribute('aria-pressed',y===x))}});
function loop(now){{T+=(now-last)/1000*sp;last=now;for(const [g,s] of cs){{g.imageSmoothingEnabled=false;s.draw(g,window.__fxT!=null?window.__fxT:T%(s.len+0.5))}}requestAnimationFrame(loop)}}
requestAnimationFrame(loop);
</script>"""
open(H+'/page_fx_archer.html','w',encoding='utf-8').write(page); print(len(page))
