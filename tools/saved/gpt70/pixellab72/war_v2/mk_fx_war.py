# 전사(1차) 스킬 효과 시안: 고른 동작 띠(strips/) 위에 코드로 그린 도트 효과를 얹어 움직인다 → page_fx_war{1,2}.html
#   python mk_fx_war.py      (효과 함수는 아래 JS — 게임에 넣을 때 skfx.js 꼴로 옮긴다)
import os, json, base64
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(H, 'strips')
idx = json.load(open(os.path.join(S, 'index.json'), encoding='utf-8'))
SK = [('slash', '밀어 베기', '앞의 적을 벤다 — 흰 초승달 베기 빛'),
      ('block', '둥근 방패 막기', '강타 1회 줄임 — 방패 앞 푸른 막'),
      ('taunt', '도발', '적을 끌어당김 — 머리 위 붉은 「!」 + 붉은 고리'),
      ('shove', '방패 밀치기', '피해 + 기절 — 충격 별 + 머리 위 도는 별'),
      ('lowcut', '발굽 끊기', '돌진 끊기 — 땅을 스치는 낮은 베기 + 흙먼지'),
      ('sweep', '가로 휩쓸기', '앞줄 여럿 — 넓은 가로 베기 빛'),
      ('steel', '강철 피부 (상시)', '받는 물리 피해 감소 — 몸에 쇠빛이 훑고 지나감'),
      ('bash', '방패 두드리기', '방패 든 적의 막기 약화 — 방패에 금 + 깨진 방패 표시'),
      ('counter', '되치기', '막은 직후 반격 — 방패 번쩍 → 빠른 베기'),
      ('brace', '자세 고정', '밀려나지 않음 — 발밑 쇠 말뚝 · 은빛 기둥'),
      ('resolve', '결의', '동료 막기 도움 — 칼끝 반짝 + 금빛 알갱이'),
      ('earth', '대지 가르기', '일렬 흙 피해 — 땅이 갈라지며 앞으로'),
      ('quake', '충격파', '주변 흙 피해 + 기절 — 땅 고리가 퍼짐'),
      ('twocut', '두 번 베기', '두 번 연격 — 엇갈린 두 베기'),
      ('downcut', '내려 베기', '1.5배 · 방어 무시 — 크고 붉은 사선 베기'),
      ('warcry', '돌격 함성', '앞줄 공격 +10% — 붉은 소리 물결 + 위 화살표'),
      ('leap', '뛰어들기', '뒷줄 지키기 — 착지 먼지 + 적에게 붉은 표적'),
      ('shieldland', '방패 착지', '앞줄 밀어내기 · 피해 감소 — 땅 충격 + 미는 화살표')]
def strip(k):
    return 'data:image/png;base64,' + base64.b64encode(open(os.path.join(S, k + '.png'), 'rb').read()).decode()
def hitpt(k):
    v = idx[k]; W, Hh = v['cell']; im = Image.open(os.path.join(S, k + '.png')).convert('RGBA')
    b = im.crop((v['hit'] * W, 0, (v['hit'] + 1) * W, Hh)).getbbox(); return [b[2], (b[1] + b[3]) // 2]
JS = r"""
const Z=2, LW=240, LH=136, FT=70;
const C={W:'#ffffff',Y:'#ffe680',O:'#ffa040',R:'#e04030',r:'#ff8070',B:'#bfe8ff',b:'#5ab0f0',G:'#d8d8e0',g:'#9098a8',D:'#a07850',d:'#6a4c30',K:'#202028',P:'#ffd84a'};
function px(g,x,y,c){g.fillStyle=C[c]||c;g.fillRect(Math.round(x)*Z,Math.round(y)*Z,Z,Z);}
function ln(g,x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0;for(let i=0;i<=n;i++)px(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c);}
function arc(g,cx,cy,rx,ry,a0,a1,c,th){th=th||1;for(let k=0;k<th;k++){const n=Math.ceil(Math.abs(a1-a0)*Math.max(rx,ry)/57*1.3)+2;for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*Math.PI/180;px(g,cx+Math.cos(a)*(rx-k),cy+Math.sin(a)*(ry-k*ry/rx),c);}}}
function star(g,x,y,r,c,c2){for(let i=-r;i<=r;i++){px(g,x+i,y,c);px(g,x,y+i,c);}const q=Math.max(1,r>>1);for(let i=-q;i<=q;i++){px(g,x+i,y+i,c2||c);px(g,x+i,y-i,c2||c);}px(g,x,y,'W');}
function star5(g,x,y,c){px(g,x,y-2,c);px(g,x-1,y-1,c);px(g,x,y-1,c);px(g,x+1,y-1,c);for(let i=-2;i<=2;i++)px(g,x+i,y,c);px(g,x-1,y+1,c);px(g,x+1,y+1,c);px(g,x-2,y+2,c);px(g,x+2,y+2,c);}
function rnd(s){s=Math.sin(s*127.1)*43758.5;return s-Math.floor(s);}
// 표적(허수아비 말뚝 + 둥근 과녁) — 사람 아님
const TX=200, TY=86;
function dummy(g,sh,dx){dx=dx||0;const x=TX+dx;for(let y=TY-6;y<124;y++){px(g,x-1,y,'d');px(g,x,y,'D');px(g,x+1,y,'d');}
 for(let y=-12;y<=12;y++)for(let x2=-12;x2<=12;x2++){const r=Math.hypot(x2,y);if(r<=12){const c=r>11?'K':r>8?'#d04030':r>5?'#f0e8d8':r>2?'#d04030':'#f0e8d8';px(g,x+x2+(sh||0),TY-18+y,c);}}
 for(let x2=-4;x2<=4;x2++)px(g,x+x2,124,'d');}
const FX={
slash(g,t,h){if(t>=0&&t<5){const a=1-t/5;arc(g,h[0]-18,h[1]-6,28,30,-70+t*6,50,t<2?'W':'Y',t<3?3:2);arc(g,h[0]-18,h[1]-6,24,26,-60,40,'Y',1);} if(t>=1&&t<5)star(g,TX-8,TY-18,5-t,'W','Y');},
block(g,t,h){if(t>=-2&&t<8){const c=t<4?'B':'b';arc(g,h[0]+3,h[1],10,26,-70,70,c,2);if(t<3)for(let i=0;i<5;i++){const a=(i*40-80)*Math.PI/180;px(g,h[0]+3+Math.cos(a)*(14+t*3),h[1]+Math.sin(a)*(30+t*3),'W');}}},
taunt(g,t,h){if(t>=0&&t<16){const y=14-(t<3?t*2:6);for(let i=0;i<6;i++){px(g,74,y+i,'R');px(g,75,y+i,'R');}px(g,74,y+8,'R');px(g,75,y+8,'R');}
 for(let k=0;k<3;k++){const tt=t-k*3;if(tt>=0&&tt<10)arc(g,80,70,12+tt*9,10+tt*7,-50,50,tt<5?'R':'r',1);}},
shove(g,t,h){if(t>=0&&t<4)star(g,TX-14,TY-16,7-t,'W','Y');if(t>=0&&t<3)for(let i=0;i<4;i++)ln(g,h[0]+2,h[1]-8+i*5,h[0]+8+t*3,h[1]-8+i*5,'G');
 if(t>=2&&t<26)for(let i=0;i<3;i++){const a=(t*20+i*120)*Math.PI/180;star5(g,TX+Math.cos(a)*12,TY-38+Math.sin(a)*3,'P');}},
lowcut(g,t,h){if(t>=0&&t<5)arc(g,h[0]-30,118,44,6,-25,25,t<2?'W':'Y',2);if(t>=1&&t<10)for(let i=0;i<7;i++){const s=rnd(i+1);px(g,TX-10+s*14+t*1.5,122-(t*(1+s))%9,t<6?'D':'d');px(g,TX-12+s*10,121-t*s,'D');}},
sweep(g,t,h){if(t>=0&&t<6){arc(g,h[0]-36,h[1]+2,56,9,-30+t*8,80,t<2?'W':'Y',t<3?3:2);arc(g,h[0]-36,h[1]+2,56,9,180,220,'Y',1);}if(t>=1&&t<4)star(g,TX-10,TY-14,4,'W','Y');},
steel(g,t,h,spr){},
bash(g,t,h){if(t>=0&&t<4)star(g,TX-14,TY-18,6-t,'W','G');
 if(t>=1&&t<22){const x=TX-4,y=TY-18;ln(g,x,y-9,x-3,y-2,'K');ln(g,x-3,y-2,x+2,y+3,'K');ln(g,x+2,y+3,x-1,y+9,'K');ln(g,x-3,y-2,x-8,y,'K');}
 if(t>=3&&t<24){const x=TX+14,y=TY-44;for(let yy=0;yy<9;yy++)for(let xx=0;xx<9;xx++){if(Math.hypot(xx-4,yy-3.5)<=4.5&&!(xx==4||xx==5&&yy>4))px(g,x+xx,y+yy,yy<1||xx<1?'K':'g');}ln(g,x+4,y,x+5,y+8,'R');
  for(let i=0;i<3;i++){px(g,x+12,y+2+i,'b');}px(g,x+11,y+4,'b');px(g,x+13,y+4,'b');}},
counter(g,t,h){if(t>=-4&&t<-1)arc(g,h[0]-10,h[1],12,24,-80,80,'B',2);if(t>=0&&t<4)arc(g,h[0]-16,h[1]-2,26,16,-40,60,t<2?'W':'Y',2);if(t>=1&&t<4)star(g,TX-10,TY-18,4,'W','Y');},
brace(g,t,h){if(t>=0&&t<20){for(const fx of[56,86]){for(let i=0;i<Math.min(6,t+1);i++){px(g,fx,124+i*0,'g');}ln(g,fx-3,125,fx+3,125,'g');ln(g,fx,122,fx,128,'K');}
 for(let k=0;k<4;k++){const x=50+k*12,hgt=(t*3+k*7)%30;if(t<16)for(let i=0;i<6;i++)px(g,x,120-hgt-i,i<2?'G':'g');}}},
resolve(g,t,h){if(t>=-2&&t<4)star(g,h[0]-14,14,4,'W','Y');if(t>=0&&t<24)for(let i=0;i<10;i++){const s=rnd(i+3),tt=(t+s*12)%18;px(g,50+s*56,120-tt*5,tt<9?'P':'Y');}},
earth(g,t,h){if(t>=0&&t<18){const L=Math.min(110,t*14);let y=124;for(let x=0;x<L;x+=2){const yy=124+((rnd(x)*3)|0)-1;px(g,h[0]-4+x,yy,'K');px(g,h[0]-4+x,yy+1,'d');if(rnd(x+7)>.8)px(g,h[0]-4+x,yy-1,'K');}
 for(let i=0;i<8;i++){const s=rnd(i+9),x=h[0]+s*L,tt=t-s*6;if(tt>0&&tt<8)px(g,x,124-tt*(4-tt/2)*1.2,'D');}}},
quake(g,t,h){for(let k=0;k<2;k++){const tt=t-k*3;if(tt>=0&&tt<10)arc(g,76,124,14+tt*10,3+tt*1.2,0,360,tt<5?'Y':'D',1);}if(t>=0&&t<10)for(let i=0;i<10;i++){const s=rnd(i+20),dir=i%2?1:-1,x=76+dir*(10+s*40+t*2);px(g,x,124-t*(5-t/2)*s,'D');}
 if(t>=3&&t<22)for(let i=0;i<3;i++){const a=(t*20+i*120)*Math.PI/180;star5(g,TX+Math.cos(a)*12,TY-38+Math.sin(a)*3,'P');}},
twocut(g,t,h){if(t>=-4&&t<0)arc(g,h[0]-20,h[1]+10,26,14,-10,70,'Y',2);if(t>=0&&t<5)arc(g,h[0]-18,h[1]-8,26,26,-60,30,t<2?'W':'Y',2);if(t>=0&&t<4)star(g,TX-10,TY-18,4,'W','Y');if(t>=-3&&t<-1)star(g,TX-8,TY-8,3,'W','Y');},
downcut(g,t,h){if(t>=0&&t<6){arc(g,h[0]-22,h[1]-14,36,40,-80+t*4,45,t<2?'W':'r',4);arc(g,h[0]-22,h[1]-14,30,34,-70,40,'R',1);}if(t>=1&&t<5)star(g,TX-8,TY-18,7-t,'W','R');},
warcry(g,t,h){for(let k=0;k<3;k++){const tt=t-k*2;if(tt>=0&&tt<10)arc(g,96,40,6+tt*7,6+tt*7,-45,45,tt<5?'R':'O',1);}
 if(t>=2&&t<20)for(let i=0;i<3;i++){const x=56+i*16,y=40-((t*2+i*5)%20);px(g,x,y,'O');px(g,x-1,y+1,'O');px(g,x+1,y+1,'O');px(g,x-2,y+2,'O');px(g,x+2,y+2,'O');for(let j=1;j<5;j++)px(g,x,y+j,'O');}},
leap(g,t,h){if(t>=0&&t<9)for(let i=0;i<8;i++){const s=rnd(i+30),dir=i%2?1:-1;px(g,76+dir*(8+t*3*s+4),124-((t*(3-t/3))*s|0),'D');px(g,76+dir*(10+t*2),125,'d');}
 if(t>=-6&&t<20){const r=12-Math.max(0,Math.min(6,t+6));arc(g,TX,TY-18,r+4,r+4,0,360,'R',1);ln(g,TX-r-8,TY-18,TX-r-3,TY-18,'R');ln(g,TX+r+3,TY-18,TX+r+8,TY-18,'R');ln(g,TX,TY-18-r-8,TX,TY-18-r-3,'R');ln(g,TX,TY-18+r+3,TX,TY-18+r+8,'R');}},
shieldland(g,t,h){if(t>=0&&t<6)arc(g,h[0]+2,124,10+t*6,4+t,-90,90,t<3?'W':'Y',2);if(t>=1&&t<14)for(let i=0;i<3;i++){const x=h[0]+18+((t*4+i*10)%40),y=96+i*10;ln(g,x,y,x+6,y,'B');px(g,x+5,y-1,'B');px(g,x+5,y+1,'B');px(g,x+4,y-2,'B');px(g,x+4,y+2,'B');}}
};
const SHAKE={downcut:[0,4],quake:[0,6],earth:[0,5],shove:[0,3],shieldland:[0,4]};
const PUSH={shove:[1,14,10],shieldland:[1,14,8],bash:[0,6,4],downcut:[0,5,3]};
function run(cv,spec){const g=cv.getContext('2d');g.imageSmoothingEnabled=false;const img=new Image();img.src=spec.src;const off=document.createElement('canvas');const og=off.getContext('2d');
 const N=spec.n,W=spec.cell[0],Hh=spec.cell[1],hit=spec.hit,HOLD=12;let f0=performance.now();
 function draw(now){const FZ=location.hash.match(/t=(-?[\d.]+)/);const fr=FZ?hit+parseFloat(FZ[1]):(now-f0)/FT,cyc=N+HOLD;let k=fr%cyc;const fi=Math.min(N-1,Math.floor(k)),t=k-hit;
  g.fillStyle='#62805a';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#55704e';g.fillRect(0,125*Z,cv.width,cv.height);
  let sx=0;const sh=SHAKE[spec.k];if(sh&&t>=sh[0]&&t<sh[1])sx=((Math.floor(k*3)%2)?1:-1)*2;
  let dx=0;const p=PUSH[spec.k];if(p&&t>=p[0]&&t<p[1])dx=Math.min(p[2],(t-p[0])*4)-Math.max(0,(t-p[1]+4))*p[2]/4;
  g.save();g.translate(sx*Z,0);dummy(g,(t>=0&&t<4&&!['block','taunt','brace','resolve','warcry','steel'].includes(spec.k))?((Math.floor(k*4)%2)?1:-1):0,Math.max(0,dx));
  if(img.complete){off.width=W;off.height=Hh;og.clearRect(0,0,W,Hh);og.drawImage(img,fi*W,0,W,Hh,0,0,W,Hh);
   if(spec.k==='steel'){const p2=(fr%24)/24*(W+60)-30;og.globalCompositeOperation='source-atop';for(let i=0;i<6;i++){og.fillStyle=i<2?'rgba(255,255,255,.85)':'rgba(220,230,245,.55)';og.fillRect(p2+i-20,0,1,Hh);}
    og.save();og.translate(0,0);og.globalCompositeOperation='source-atop';og.fillStyle='rgba(160,170,190,.18)';og.fillRect(0,0,W,Hh);og.restore();og.globalCompositeOperation='source-over';}
   g.drawImage(off,0,0,W,Hh,0,0,W*Z,Hh*Z);}
  FX[spec.k]&&FX[spec.k](g,t,spec.h);g.restore();requestAnimationFrame(draw);}
 requestAnimationFrame(draw);}
"""
css = "body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}p{opacity:.88}.row{display:flex;flex-wrap:wrap;gap:10px}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:8px;display:grid;gap:4px;width:480px}canvas{image-rendering:pixelated;border-radius:6px}.n{font-size:13px;opacity:.75}"
for part, rng in (('1', SK[:6]), ('2', SK[6:12]), ('3', SK[12:])):
    specs = []
    for k, ko, d in rng:
        sk = 'idle' if k == 'steel' else k; v = idx[sk]
        specs.append({'k': k, 'ko': ko, 'd': d, 'src': strip(sk), 'n': v['n'], 'cell': v['cell'], 'hit': (6 if k == 'steel' else v['hit']), 'h': hitpt(sk)})
    o = [f"<!doctype html><meta charset=utf-8><title>전사 스킬 효과 시안 {part}</title><style>{css}</style><main><h2>전사(1차) 스킬 효과 시안 ({part}/3)</h2>",
         "<p>고른 동작 위에 게임이 코드로 그리는 도트 효과를 얹었습니다(그림 파일 아님 — 색 · 크기 · 시간을 바로 고칠 수 있음). 오른쪽 말뚝 과녁은 효과 위치를 보려는 임시 표적입니다. 고칠 것이 있으면 스킬 이름과 함께 말씀해 주세요.</p><div class=row>"]
    for i, s in enumerate(specs):
        o.append(f"<div class=card><canvas id=c{i} width=480 height=272></canvas><b>{s['ko']}</b><span class=n>{s['d']}</span></div>")
    o.append("</div></main><script>" + JS + "const SPECS=" + json.dumps(specs, ensure_ascii=False) + ";SPECS.forEach((s,i)=>run(document.getElementById('c'+i),s));</script>")
    p = os.path.join(H, f'page_fx_war{part}.html'); open(p, 'w', encoding='utf-8').write(''.join(o)); print(p, os.path.getsize(p) // 1024, 'KB')
