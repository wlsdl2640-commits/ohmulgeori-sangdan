"""턴제식 배치도 시안 (11-22 18:38 사용자): 맨 앞 3자리(전사 · 도적) · 가운데 3자리(마법사 · 궁수) · 그 뒤 3자리(사제) · 맨 뒤 1자리(짐꾼 + 마차), 서로 안 겹치게.
   전투 창 480×240(논리 240×120) 그대로. 모험가는 픽셀랩 전사(40칸) 한 장을 자리마다 놓음. python3 mock.py <출력 폴더>"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
G='/home/claude/game62/tools/saved/gpt70/'; OUT=sys.argv[1]
W,H=480,240
def bg():
    im=Image.open(G+'plains_wide/plains_gpt_composite.png').convert('RGB'); a=np.array(im).astype(int)
    sky=(a[...,0]>200)&(a[...,1]<90)&(a[...,2]>200); a[sky]=(150,205,235); im=Image.fromarray(a.astype(np.uint8))
    s=im.resize((720,240),Image.LANCZOS); return s.crop((120,0,600,240))
def cut(path, th, flip=False):
    im=Image.open(path).convert('RGB'); a=np.array(im).astype(int); c=a[2,2]; fg=np.abs(a-c).sum(-1)>90
    cols=fg.any(0); xs=np.where(cols)[0]; x0=xs[0]; x1=x0
    while x1+1<len(cols) and cols[x1+1:x1+4].any(): x1+=1
    rows=fg[:,x0:x1+1].any(1); ys=np.where(rows)[0]; y0=ys[0]; y1=y0
    while y1+1<len(rows) and rows[y1+1:y1+12].any(): y1+=1
    crop=np.dstack([a[y0:y1+1,x0:x1+1],np.where(fg[y0:y1+1,x0:x1+1],255,0)]).astype(np.uint8); o=Image.fromarray(crop,'RGBA')
    o=o.resize((max(1,round(o.width*th/o.height)),th),Image.LANCZOS); al=np.array(o); al[...,3]=np.where(al[...,3]>110,255,0); o=Image.fromarray(al)
    return o.transpose(Image.FLIP_LEFT_RIGHT) if flip else o
WAR=Image.open(G+'pixellab72/war_v1/idle.png').crop((0,0,80,80)); bb=WAR.getbbox(); WAR=WAR.crop(bb)
# 자리: 줄(row) 0 위 · 1 가운데 · 2 아래 — 발 줄 y, 아래 줄일수록 왼쪽으로 조금(안 겹치게)
ROWY=[150,186,222]; SKEW=[14,0,-14]
COLX=[184,134,84]       # 앞(전사 · 도적) · 가운데(마법사 · 궁수) · 뒤(사제 · 짐꾼)
REARX,REARY=84,186      # 맨 뒤 한 자리 (짐꾼) + 마차는 그 뒤
FOEX=[330,380,430]         # 몬스터는 한 칸 더 뒤로
def slots(): return {(c,r):(COLX[c]+SKEW[r],ROWY[r]) for c in range(3) for r in range(3)}
def foes(): return {(c,r):(FOEX[c]-SKEW[r],ROWY[r]) for c in range(3) for r in range(3)}
def font(n):
    for p in ('/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf','/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc','/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc'):
        try: return ImageFont.truetype(p,n)
        except Exception: pass
    return ImageFont.load_default()
def ell(d,x,y,w,c,o): d.ellipse((x-w,y-5,x+w,y+4),fill=c,outline=o)
def wagon(im,x,y):
    d=ImageDraw.Draw(im); d.rectangle((x-22,y-26,x+14,y-8),fill='#8a5a2e',outline='#1c1622'); d.rectangle((x-22,y-34,x+14,y-26),fill='#e8dcc0',outline='#1c1622')
    for wx in (x-14,x+6): d.ellipse((wx-7,y-13,wx+7,y+1),fill='#5a3a22',outline='#1c1622'); d.ellipse((wx-2,y-8,wx+2,y-4),fill='#c8a060')
def put(im,sp,x,y): im.paste(sp,(round(x-sp.width/2),y-sp.height),sp)
def plan():
    im=bg(); d=ImageDraw.Draw(im,'RGBA'); f=font(9)
    C=[('#d23b30','앞'),('#3a6cc0','가운데'),('#3a9a50','뒤')]
    for (c,r),(x,y) in slots().items(): ell(d,x,y,15,C[c][0]+'aa','#ffffff')
    d.rectangle((6,REARY-30,44,REARY+4),outline='#ffffff',fill='#b07a2c66')
    for (c,r),(x,y) in foes().items(): ell(d,x,y,15,'#30303099','#ffffff')
    for c in range(3): d.text((COLX[c]+SKEW[0],ROWY[0]-22),C[c][1],font=f,fill='#ffffff',anchor='ms',stroke_width=2,stroke_fill='#1c1622')
    d.text((25,REARY-36),'마차',font=f,fill='#fff',anchor='ms',stroke_width=2,stroke_fill='#1c1622')
    d.text((FOEX[1],ROWY[0]-22),'몬스터',font=f,fill='#fff',anchor='ms',stroke_width=2,stroke_fill='#1c1622')
    return im
def scene(party, mons, tags=True):
    im=bg(); d=ImageDraw.Draw(im,'RGBA'); f=font(8); S=slots(); F=foes(); items=[]
    for (c,r),name in party.items():
        x,y=S[(c,r)]; items.append((y,x,WAR,name))
    for (c,r),(sp) in mons.items(): x,y=F[(c,r)]; items.append((y,x,sp,None))
    if '짐꾼' in party.values(): wagon(im,26,REARY+2)
    for y,x,sp,name in sorted(items,key=lambda t:t[0]):
        d.ellipse((x-12,y-4,x+12,y+3),fill=(30,40,20,90)); put(im,sp,x,y)
    if tags:
        for y,x,sp,name in items:
            if name: d.text((x,y-sp.height-2),name,font=f,fill='#fff',anchor='ms',stroke_width=2,stroke_fill='#1c1622')
    return im
if __name__=='__main__':
    gob=cut(G+'hd70/sheets/mon_goblin.webp',38); gob=gob.crop((0,0,gob.width//2,gob.height)); gob=gob.crop(gob.getbbox()).transpose(Image.FLIP_LEFT_RIGHT); wolf=rat=rab=gob      # 배치 시안이라 몬스터는 고블린 한 가지로
    plan().save(OUT+'/plan.png')
    scene({(0,0):'전사',(0,2):'도적',(1,0):'마법사',(1,2):'궁수',(2,0):'사제',(2,2):'짐꾼'}, {(0,0):gob,(0,2):gob,(1,1):gob,(2,0):gob}).save(OUT+'/party6.png')
    scene({(c,r):n for (c,r),n in zip([(c,r) for c in range(3) for r in range(3)],['전사','전사','도적','마법사','궁수','궁수','사제','사제','짐꾼'])}, {(c,r):gob for c in range(3) for r in range(3)}).save(OUT+'/full10.png')
    for n in ('plan','party6','full10'): Image.open(OUT+f'/{n}.png').resize((960,480),Image.NEAREST).save(OUT+f'/{n}_x2.png')
