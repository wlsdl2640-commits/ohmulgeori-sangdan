# 궁수 1차 스킬 이펙트 시안 1: 코드로 그리는 도트 효과를 arc_v2 동작 위에 겹쳐 돌려 본다(게임에는 안 넣음)
import os,base64,json
H=os.path.dirname(os.path.abspath(__file__))
b64=lambda f: base64.b64encode(open(os.path.join(H,f),'rb').read()).decode()
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]
data={k:b64(f'arc_v2/{k}.png') for k in ('shoot','buff','idle','dodge','quick','power','kick')}
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
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 궁수 1차 스킬</p><h1>궁수 스킬 이펙트</h1><p class="lede">궁수 1차 스킬 이펙트 시안 열셋입니다. 궁수 동작 위에 효과를 겹쳐 돌려 본 것이고 게임에는 넣지 않았습니다.</p></header>
  <section class="sec"><h2>시안</h2>
    <div class="bar"><button type="button" data-sp="1" aria-pressed="true">보통 빠르기</button><button type="button" data-sp="0.4" aria-pressed="false">느리게</button></div>
    <div id="list"></div>
    <p class="note" id="save-hint">보기만 하는 시안이라 저장 단추는 없습니다. 오른쪽의 허수아비는 맞는 쪽을 보여 주려고 세운 임시 그림입니다. 넉백 스윙은 동작만 쓰기로 해서 여기에 없습니다.</p>
  </section>
</main>
<script>
const D={json.dumps(data)},I={{}};for(const k in D){{I[k]=new Image();I[k].src='data:image/png;base64,'+D[k]}}
const W=320,Hh=180,GY=158,OX=18,OY=24;          // 캐릭터 한 장(156)을 (OX, OY)에 — 발 줄 132 + OY = 126
const px=(g,x,y,c,w=1,h=1)=>{{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)}};
function base(g){{g.fillStyle='#78966e';g.fillRect(0,0,W,Hh);g.fillStyle='#6a875f';g.fillRect(0,GY,W,Hh-GY)}}
function spr(g,k,f,dx=0,dy=0,c=156){{g.drawImage(I[k],f*c,0,c,156,OX+dx,OY+dy,c,156)}}
const AY=OY+76,BX=OX+112;          // 화살 줄 · 활 앞
function disc(g,cx,cy,r,c){{for(let y=-r;y<=r;y++){{const w=Math.floor(Math.sqrt(r*r-y*y));px(g,cx-w,cy+y,c,w*2+1,1)}}}}
function ring(g,cx,cy,r,c,n=0,ry=r){{const m=n||Math.max(8,Math.round(r*6.3));for(let i=0;i<m;i++){{const a=i/m*6.283;px(g,cx+Math.cos(a)*r,cy+Math.sin(a)*ry,c)}}}}
function dummy(g,x,sh=0){{const y=GY,d=Math.round(sh);px(g,x-1+d,y-34,'#6a4a2a',3,34);px(g,x-11+d,y-26,'#6a4a2a',23,3);disc(g,x+d,y-40,8,'#3a2a1a');disc(g,x+d,y-40,7,'#d8b860');px(g,x-3+d,y-42,'#3a2a1a',2,2);px(g,x+2+d,y-42,'#3a2a1a',2,2);px(g,x-2+d,y-37,'#3a2a1a',5,1);
  for(let i=-9;i<=9;i+=3)px(g,x+i+d,y-23,'#c8a850',2,9+((i*7)%4))}}
function arrow(g,x,y,a=0,col=null){{const c=Math.cos(a),s=Math.sin(a);          // (x, y) = 촉 끝 · 게임이 그리는 화살: 갈색 대 · 쇠 마름모 촉 · 뒤끝 흰 깃
  for(let i=6;i<22;i++)px(g,x-c*i,y-s*i,col||'#a86830');for(let i=18;i<23;i++){{px(g,x-c*i-s*1.5,y-s*i+c*1.5,col||'#f4f4ec');px(g,x-c*i+s*1.5,y-s*i-c*1.5,col||'#f4f4ec')}}
  for(let i=0;i<7;i++){{const w=i<3?i:6-i;for(let j=-w;j<=w;j++)px(g,x-c*i-s*j*0.9,y-s*i+c*j*0.9,col||(j<0?'#ffffff':i>3?'#848e9c':'#c8d0d8'))}}}}
function spark(g,x,y,t,c1='#ffffff',c2='#ffe98a'){{if(t<0||t>0.22)return;const r=3+t*60;for(let i=0;i<8;i++){{const a=i*0.785;px(g,x+Math.cos(a)*r,y+Math.sin(a)*r,i%2?c1:c2,2,2)}}if(t<0.1)disc(g,x,y,3,c1)}}
const HAWK=["....KKKKKKKKK....","..KKBBBBBBBBBKK..",".KBBBBBBBBBBBBBK.","KBBKKKKBBBKKKKBBK","KBWEEPKBBBKPEEWBK","KBWWEEKBYBKEEWWBK","KBBWWWKYYYKWWWBBK",".KBBWWWYYYWWWBBK.",".KBBBWWKYKWWBBBK.","..KBBBWWKWWBBBK..","...KKBBWWWBBKK...",".....KKBBBKK.....",".......KKK......."],HC={{K:'#3a2410',B:'#9a6a34',W:'#f4ead0',Y:'#f0b830',E:'#ffe040',P:'#101010'}};
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
    dust(g,OX+40+78,GY-1,t-tj);dust(g,OX+dx+78,GY-1,t-tl);spr(g,'dodge',f,dx)}}}},
 {{n:'연사',d:'빠른 한 발을 세 번 이어 쏩니다. 이펙트는 없고 화살만 세 발 날아갑니다.',len:3.3,draw(g,t){{base(g);const k=Math.min(2,Math.floor(t/1.0)),u=t-k*1.0,f=Math.min(14,1+Math.floor(u*15));spr(g,'quick',f);if(f>=10&&f<=12){{g.fillStyle='#78966e';g.fillRect(OX+121,OY+66,W,20)}}
    let hit=-1;for(let j=0;j<=k;j++){{const v=t-j*1.0-10/15;if(v>0){{const x=BX+v*360;if(x<252)arrow(g,x,AY-6+j*3);else hit=Math.max(hit,v-(252-BX)/360)}}}}
    dummy(g,262,hit>=0&&hit<0.12?2:0);if(hit>=0)spark(g,252,AY-3,hit)}}}},
 {{n:'목표추적',d:'대상 머리 위에 눈이 뜨이고, 눈동자가 과녁으로 바뀐 뒤 과녁이 한 바퀴 돕니다. 그 뒤 작은 표식으로 남습니다.',len:3.2,draw(g,t){{base(g);spr(g,'buff',Math.min(20,1+Math.floor(t*9)));dummy(g,250);const ex=250,ey=GY-66;
    if(t<0.25)return;const u=t-0.25,op=Math.min(1,u/0.35),sm=u>2.2?0.6:1;
    for(let x=-12;x<=12;x++){{const h=Math.round(op*7*sm*(1-(x/12)*(x/12)));if(h<1){{px(g,ex+x*sm,ey,'#ffffff');continue}}px(g,ex+x*sm,ey-h,'#fff',1,1);px(g,ex+x*sm,ey+h,'#fff',1,1);px(g,ex+x*sm,ey-h+1,'#18203a',1,h*2-1)}}
    if(u>0.35){{const k=Math.min(1,(u-0.35)/0.3),R=Math.round(5*sm);disc(g,ex,ey,R,k<1?'#3050a0':'#d83030');if(k>=1){{disc(g,ex,ey,Math.max(1,R-2),'#ffffff');disc(g,ex,ey,Math.max(0,R-4),'#d83030')}}else disc(g,ex,ey,2,'#101020')}}
    if(u>0.7){{const a=Math.min(1,(u-0.7)/0.9)*6.283;for(let i=0;i<4;i++){{const b=a+i*1.571;for(let r=7;r<11;r++)px(g,ex+Math.cos(b)*r*sm,ey+Math.sin(b)*r*sm,'#ffe040')}}}}}}}},
 {{n:'예리한사격',d:'머리 위에 화살이 물린 정령의 활이 잠시 나타났다 사라집니다.',len:2.6,draw(g,t){{base(g);spr(g,'buff',Math.min(20,1+Math.floor(t*9)));if(t<0.3||t>2.1)return;const u=t-0.3,al=u<0.3?u/0.3:u>1.5?(1.8-u)/0.3:1,cx=OX+76,cy=OY+4-Math.sin(u*4)*1.5;
    g.globalAlpha=Math.max(0,Math.min(1,al))*(0.75+0.25*Math.sin(t*30));const C='#c8f4ff',C2='#ffffff',pull=Math.min(1,u/0.6)*7;
    for(let i=-34;i<=34;i++){{const a=i/34*1.25;px(g,cx+6+Math.cos(a)*9,cy+Math.sin(a)*15,Math.abs(i)<8?C2:C,2,1)}}
    const tx=cx+6+Math.cos(1.25)*9,ty=Math.sin(1.25)*15;for(let i=0;i<=10;i++){{const k=i/10;px(g,tx+(cx-pull-tx)*k,cy-ty+ty*k,C);px(g,tx+(cx-pull-tx)*k,cy+ty-ty*k,C)}}
    arrow(g,cx+26-pull,cy,0,C2);for(let i=0;i<6;i++)px(g,cx-14+((i*13+Math.floor(t*20))%40),cy-16+((i*7)%32),C);g.globalAlpha=1}}}},
 {{n:'매의 눈',d:'매 얼굴이 머리 위에 잠시 나타났다 사라집니다.',len:2.4,draw(g,t){{base(g);spr(g,'idle',1+Math.floor(t*8)%16);if(t<0.3||t>1.9)return;const u=t-0.3,z=u<0.12?1:2,al=u>1.3?(1.6-u)/0.3:1,cx=OX+76,cy=OY-4;g.globalAlpha=Math.max(0,al);
    if(u<0.25)ring(g,cx,cy+10,8+u*70,'#ffe040');for(let r=0;r<HAWK.length;r++)for(let c=0;c<17;c++){{const ch=HAWK[r][c];if(ch!=='.')px(g,cx+(c-8.5)*z,cy+(r-3)*z,HC[ch],z,z)}}g.globalAlpha=1}}}},
 {{n:'화살비',d:'대상 발밑에 범위 장판이 깔리고, 그 위로 화살이 비처럼 쏟아집니다.',len:3.6,draw(g,t){{base(g);const zx=258,zy=GY+6;if(t>0.4){{const p=0.5+0.5*Math.sin(t*10);g.globalAlpha=0.35;for(let y=-7;y<=7;y++){{const w=Math.floor(46*Math.sqrt(1-y*y/49));px(g,zx-w,zy+y,'#e8b040',w*2,1)}}g.globalAlpha=1;ring(g,zx,zy,46,p>0.5?'#ffe98a':'#e8a030',72,7);ring(g,zx,zy,38,'#e8a030',30,5)}}
    spr(g,'shoot',Math.min(20,1+Math.floor(t*12)));let sh=0;const L=[];
    if(t>1.0)for(let i=0;i<16;i++){{const st=1.0+i*0.13,v=t-st;if(v<0)continue;const lx=zx-40+((i*53)%80),ly=zy-5+((i*5)%10),T=0.28;if(v<T){{const k=v/T;arrow(g,lx-(1-k)*42,ly-(1-k)*120,1.23)}}else if(v<T+0.5){{arrow(g,lx,ly,1.23);L.push([lx,ly,v-T]);if(v<T+0.1)sh=2}}}}
    dummy(g,246,sh);dummy(g,276,-sh);for(const [x,y,v] of L)spark(g,x,y,v)}}}},
 {{n:'관통 사격',d:'힘껏 당겨 쏜 화살이 긴 흰 꼬리를 남기며 적들을 꿰뚫고 지나갑니다.',len:3.2,draw(g,t){{base(g);const f=Math.min(24,1+Math.floor(t*10)),rel=2.05;spr(g,'power',f,0,0,200);if(f>=21&&f<=22){{g.fillStyle='#78966e';g.fillRect(OX+128,OY+60,W,26)}}
    const u=t-rel,y=OY+73,hx=BX+12+u*520;let s1=0,s2=0;if(u>0){{const h1=u-(236-BX)/520,h2=u-(278-BX)/520;if(h1>0&&h1<0.15)s1=3;if(h2>0&&h2<0.15)s2=3;dummy(g,246,s1);dummy(g,286,s2);
      for(let x=Math.max(BX,hx-120);x<Math.min(hx,W);x++){{const k=(hx-x)/120;if(k<0.5){{px(g,x,y-1,'#dff0ff');px(g,x,y+1,'#dff0ff')}}px(g,x,y,k<0.8?'#ffffff':'#dff0ff')}}arrow(g,hx,y);spark(g,238,y,h1,'#fff','#dff0ff');spark(g,280,y,h2,'#fff','#dff0ff')}}else{{dummy(g,246);dummy(g,286)}}}}}},
 {{n:'바람 산탄',d:'활 앞에 바람으로 된 활 모양이 맺혔다가, 화살 세 발이 세 방향으로 한꺼번에 터져 나갑니다.',len:2.8,draw(g,t){{base(g);const f=Math.min(20,1+Math.floor(t*12)),rel=14.5/12;spr(g,'shoot',f);if(f>=15&&f<=17){{g.fillStyle='#78966e';g.fillRect(OX+121,OY+66,W,20)}}const cx=BX+10,cy=AY-6;let sh=0;
    if(t>rel-0.7&&t<rel+0.12){{const k=Math.min(1,(t-(rel-0.7))/0.5),R=6+k*16;for(let i=-30;i<=30;i++){{const a=i/30*1.3;px(g,cx+Math.cos(a)*R*0.55,cy+Math.sin(a)*R,Math.abs(i)%3?'#c8f0a0':'#ffffff',2,1)}}for(let i=0;i<5;i++){{const a=t*12+i*1.26;px(g,cx+Math.cos(a)*(R+3)*0.6,cy+Math.sin(a)*(R+3),'#ffffff')}}}}
    if(t>=rel){{const u=t-rel;if(u<0.3){{ring(g,cx+u*40,cy,6+u*70,'#c8f0a0',40,10+u*90);ring(g,cx+u*40,cy,3+u*50,'#ffffff',24,6+u*60)}}
      for(const a of [-0.2,0,0.2]){{const d=u*340,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;if(x<246){{for(let i=8;i<40&&i<d;i++)px(g,x-Math.cos(a)*i,y-Math.sin(a)*i,i<22?'#ffffff':'#c8f0a0');arrow(g,x,y,a)}}else{{const h=u-(246-cx)/340;spark(g,246,cy+Math.sin(a)*130,h,'#fff','#c8f0a0');if(h<0.15)sh=3}}}}}}dummy(g,258,sh)}}}},
 {{n:'견제 사격',d:'다리를 맞히면 발밑에 흰 고리가 조여들며 대상이 잠시 느려집니다.',len:2.8,draw(g,t){{base(g);const f=Math.min(14,1+Math.floor(t*13)),rel=10/13;spr(g,'quick',f);if(f>=10&&f<=12){{g.fillStyle='#78966e';g.fillRect(OX+121,OY+66,W,20)}}const u=t-rel,tx=250,ty=GY-8,d=Math.hypot(tx-BX,ty-AY),a=Math.atan2(ty-AY,tx-BX),h=u-d/340;dummy(g,256,h>0&&h<0.12?2:0);
    if(u>0&&h<0)arrow(g,BX+Math.cos(a)*u*340,AY+Math.sin(a)*u*340,a);if(h>=0){{spark(g,tx,ty,h);if(h<1.3){{const k=Math.min(1,h/0.35),R=30-k*16;ring(g,256,GY+2,R,'#ffffff',36,R*0.22);if(k>=1){{ring(g,256,GY+2,14,h%0.3<0.15?'#ffffff':'#a8d8ff',24,3);for(let i=-1;i<=1;i++)px(g,256+i*8,GY-3-((h*20+i*3)%6),'#a8d8ff',1,2)}}}}}}}}}},
 {{n:'엄호 사격',d:'후위를 때리는 적의 머리 위에 느낌표가 뜨고, 그 적을 먼저 쏩니다.',len:2.8,draw(g,t){{base(g);const f=Math.min(20,1+Math.floor(t*12)),rel=14.5/12;spr(g,'shoot',f);if(f>=15&&f<=17){{g.fillStyle='#78966e';g.fillRect(OX+121,OY+66,W,20)}}const u=t-rel,h=u-(246-BX)/340;dummy(g,258,h>0&&h<0.12?3:0);
    if(t>0.15&&t<rel+0.4){{const b=t<0.35?Math.round((0.35-t)*30):0,x=257,y=GY-72-b;px(g,x-1,y-1,'#3a1010',5,13);px(g,x,y,'#ff4030',3,7);px(g,x,y+8,'#ff4030',3,3);px(g,x+1,y+1,'#ffb0a0',1,3)}}
    if(u>0&&h<0)arrow(g,BX+u*340,AY-4);spark(g,248,AY-4,h,'#fff','#ffb0a0');if(h>0&&h<0.4){{px(g,262,GY-58-h*30,'#fff',1,1);px(g,270,GY-52-h*24,'#ffb0a0',2,2)}}}}}},
 {{n:'발차기',d:'발이 닿는 순간 발끝에 짧은 타격 섬광이 터지고, 대상이 뒤로 밀립니다.',len:2.6,draw(g,t){{base(g);const f=Math.min(20,1+Math.floor(t*11)),hit=t-11/11;dummy(g,OX+146+(hit>0?Math.min(1,hit/0.25)*26:0),hit>0&&hit<0.12?3:0);spr(g,'kick',f);spark(g,OX+136,OY+98,hit);if(hit>0&&hit<0.3)for(let i=0;i<3;i++)px(g,OX+140+hit*90,OY+92+i*6,'#ffffff',6-hit*18,1)}}}}];
const list=document.getElementById('list'),cs=[];
for(const s of SK){{const c=document.createElement('figure');c.className='card';const cv=document.createElement('canvas');cv.width=W;cv.height=Hh;cv.setAttribute('role','img');cv.setAttribute('aria-label',s.n+' 스킬 이펙트가 궁수 위에 겹쳐 움직이는 모습');
  const b=document.createElement('b');b.textContent=s.n;const p=document.createElement('p');p.textContent=s.d;c.append(cv,b,p);list.append(c);cs.push([cv.getContext('2d'),s])}}
let sp=1,T=0,last=performance.now();
document.querySelectorAll('.bar button').forEach(x=>x.onclick=()=>{{sp=+x.dataset.sp;document.querySelectorAll('.bar button').forEach(y=>y.setAttribute('aria-pressed',y===x))}});
function loop(now){{T+=(now-last)/1000*sp;last=now;for(const [g,s] of cs){{g.imageSmoothingEnabled=false;s.draw(g,window.__fxT!=null?window.__fxT:T%(s.len+0.5))}}requestAnimationFrame(loop)}}
requestAnimationFrame(loop);
</script>"""
open(H+'/page_fx_archer.html','w',encoding='utf-8').write(page); print(len(page))
