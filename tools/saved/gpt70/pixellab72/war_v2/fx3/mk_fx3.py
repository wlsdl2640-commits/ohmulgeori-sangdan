import os, sys
# 채택한 효과(fx3) 움직이는 판: 늪지 배경 · 전사 동작 · 몬스터 위에 — v2(효과 도구)와 나란히. python mk_fx3.py <출력 html> [키,…]
import json, base64, io, os, sys, math
from PIL import Image
from smooth import smooth
R='../'; BGF='../../../../plx73/bg_swamp/00.png'
bg=Image.open(BGF).convert('RGBA'); mon=Image.open('../../../../plx74/pick/swampbrute_00.png').convert('RGBA')
GY=206; FX=120; W,H=192,132
IDX=json.load(open(R+'strips/index.json',encoding='utf-8'))
#  키: (이름, 동작 띠, 놓는 법, x, y, 생기는 장 수, 앞서 시작)
P={
 'slash':('밀어 베기','slash','c',205,GY-48,4,1),
 'twocut':('두 번 베기','twocut','c',215,GY-50,4,1),
 'downcut':('내려 베기','downcut','b',212,GY+3,4,1),
 'earth':('대지 가르기','earth','bl',138,GY+3,8,0),
 'leap':('뛰어들기','leap','b',FX,GY+4,6,0),
 'shieldland':('방패 착지','shieldland','b',FX,GY+4,10,0),
 'brace':('자세 고정','brace','b',FX,GY+4,10,0),
 'resolve':('결의','resolve','b',FX,GY+4,12,0),
 # 11-25 저녁 대표님 고른 판
 'slash_c':('밀어 베기 ③','slash','c',205,GY-48,4,1),
 'lowcut_c':('발굽 끊기 ③','lowcut','b',215,GY+4,4,1),
 'sweep_a':('가로 휩쓸기 ①','sweep','c',215,GY-30,4,1),
 'counter':('되치기 ②','counter','c',200,GY-48,4,1),
 'taunt_a':('도발 ①','taunt','b',FX,GY+4,8,0),
 'warcry_a':('돌격 함성 ① (동료 쪽으로)','warcry','br',FX+34,GY+4,8,0),
 'resolve_a':('결의 ①','resolve','b',FX,GY+4,12,0),
}
Z={'brace':('back',1),'resolve':('back',1),'resolve_a':('front',0.6),'taunt_a':('back',1),'warcry_a':('back',1),'shieldland':('front',0.6),'leap':('both',1)}   # 효과 앞뒤 · 앞에 그릴 때 투명도
def tile(): t=bg.crop((0,0,360,224)).copy(); t.alpha_composite(mon,(360-mon.width-6,GY-mon.height+4)); return t
def strip(k):
    s=Image.open(R+f'strips/{k}.png').convert('RGBA'); n=IDX[k]['n']; w=IDX[k]['cell'][0]
    return [s.crop((i*w,0,(i+1)*w,H)) for i in range(n)], IDX[k]['hit'], w
def bbox(fr):
    b=None
    for f in fr:
        x=f.getbbox()
        if x: b=x if b is None else (min(b[0],x[0]),min(b[1],x[1]),max(b[2],x[2]),max(b[3],x[3]))
    return b
MIR={'warcry_a'}   # 동료 쪽(왼쪽)으로 퍼지게 뒤집음 — 파티 강화
def build(k):
    ko,sk,mode,ax,ay,tin,lead=P[k]
    eff,pk=smooth(k, stretch_out=2 if k in('slash','twocut','downcut','slash_c','lowcut_c','sweep_a','counter') else 1)
    pre=eff[:pk]; idx=[round(i*(len(pre)-1)/max(1,tin-1)) for i in range(tin)] if pre else []
    eff=[pre[i] for i in idx]+eff[pk:]
    if k in MIR: eff=[e.transpose(Image.FLIP_LEFT_RIGHT) for e in eff]
    b=bbox(eff)
    if mode=='br': ox,oy=ax-b[2], ay-b[3]
    elif mode=='c': ox,oy=ax-(b[0]+b[2])//2, ay-(b[1]+b[3])//2
    elif mode=='b': ox,oy=ax-(b[0]+b[2])//2, ay-b[3]
    else: ox,oy=ax-b[0], ay-b[3]
    wf,h,cw=strip(sk); idle,_,_=strip('idle')
    st=h-tin if lead else h
    T=max(len(wf), st+len(eff))
    out=[]
    for i in range(T):
        t=tile()
        e=eff[i-st] if 0<=i-st<len(eff) else None
        if i<len(wf): w=wf[i]
        else: w=idle[(i-len(wf))%len(idle)]
        dx=dy=0
        if k=='leap' and i<h:
            u=i/h; dx=-90*(1-u); dy=-38*math.sin(math.pi*u)
        cx=FX-(cw//2 if cw!=W else 76)
        z,al=Z.get(k,('front',1))
        if e is not None and z in('back','both'): t.alpha_composite(e,(ox,oy))
        t.alpha_composite(w,(int(cx+dx),int(GY-124+dy)))
        if e is not None and z in('front','both'):
            if z=='both':   # 발밑 아래쪽 띠만 앞에 — 몸은 먼지 뒤로 덜 가려지게
                ef=e.copy(); a=ef.getchannel('A'); cut=GY-28-oy
                a.paste(0,(0,0,a.width,max(0,cut))); ef.putalpha(a); e=ef
            if al<1:
                a=e.getchannel('A').point(lambda v:int(v*al)); e=e.copy(); e.putalpha(a)
            t.alpha_composite(e,(ox,oy))
        out.append(t.convert('RGB'))
        if i==st+4: hw=(int(cx+dx), int(GY-124+dy), w)
    if k in HUD:   # 버프 머리 위 아이콘(11-25 대표님) — ../fx4/buffhud.py
        cwd=os.getcwd(); os.chdir(R+'fx4'); sys.path.insert(0,'.'); import buffhud as BH
        x0,y0,ww=hw; bx,by=BH.head(ww); fr=[o.convert('RGBA') for o in out]
        out=[o.convert('RGB') for o in BH.over(fr,HUD[k],st,x0+bx,y0+by,fade=(st+18,st+25))]; os.chdir(cwd)
    return out
HUD={'resolve_a':'resolve','warcry_a':'warcry'}
def v2(k):
    try:
        js=json.load(open(R+f'vfx/out/{k}_v2.json',encoding='utf-8')); sh=Image.open(R+f'vfx/out/{k}_v2.png').convert('RGBA')
    except FileNotFoundError: return None
    fr=js['frames']; fr=list(fr.values()) if isinstance(fr,dict) else fr; a=js['meta']['anchor']; out=[]
    for f in fr:
        f=f['frame']; t=tile(); t.alpha_composite(sh.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])),(FX-a['x'],GY-a['y'])); out.append(t.convert('RGB'))
    return out
def g64(fr):
    pal=fr[len(fr)//3].quantize(200)
    q=[f.quantize(palette=pal,dither=0) for f in fr]
    b=io.BytesIO(); q[0].save(b,'GIF',save_all=True,append_images=q[1:],duration=70,loop=0); return base64.b64encode(b.getvalue()).decode()
if __name__=='__main__':
    ks=sys.argv[2].split(',') if len(sys.argv)>2 else list(P)
    css="body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1200px;margin:0 auto;padding:14px}h3{color:#f0c878;margin:16px 0 6px}.row{display:flex;gap:10px;flex-wrap:wrap}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px}img{image-rendering:pixelated;width:540px;height:336px;border-radius:6px}"
    o=[f"<!doctype html><meta charset=utf-8><title>전사 효과 새 판</title><style>{css}</style><main><h2>전사 1차 효과 — 채택한 새 판 (생기는 장 + 사라지는 장 · 사이 장 섞기)</h2><p>왼쪽 = 예전 v2(효과 도구) · 오른쪽 = 새 판. 동작이 끝나도 효과는 끝까지 사라진다.</p>"]
    for k in ks:
        n=build(k); v=v2(k)
        o.append(f"<h3>{P[k][0]}</h3><div class=row>"+(f"<div class=card><img src='data:image/gif;base64,{g64(v)}'><b>예전 v2</b></div>" if v else "")+f"<div class=card><img src='data:image/gif;base64,{g64(n)}'><b>새 판 · {len(n)}장</b></div></div>")
        print(k,len(n),flush=True)
    o.append("</main>"); open(sys.argv[1],'w',encoding='utf-8').write(''.join(o)); print(os.path.getsize(sys.argv[1])//1024,'KB')
