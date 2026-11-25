# 시안 넷(① 차분 a · ② 보통 · ③ 화려 c · ④ 최대 d)을 늪지 장면(전사 · 몬스터)에 멈춘 그림으로. python mk_var.py <출력 png 폴더>
import json, sys, os
from PIL import Image
import mk_fx3 as m
GY=m.GY; FX=m.FX
A={  # 놓는 법 · x · y · 앞뒤 · 동작 띠
 'slash':('c',205,GY-48,'f','slash'),'twocut':('c',215,GY-50,'f','twocut'),'downcut':('b',212,GY+3,'f','downcut'),
 'lowcut':('b',215,GY+4,'f','lowcut'),'sweep':('c',215,GY-30,'f','sweep'),'counter':('c',200,GY-48,'f','counter'),
 'bash':('c',190,GY-45,'f','bash'),'shove':('c',215,GY-45,'f','shove'),'block':('c',150,GY-48,'f','block'),
 'taunt':('b',FX,GY+4,'b','taunt'),'warcry':('bl',FX-40,GY+4,'b','warcry'),'resolve':('b',FX,GY+4,'b','resolve'),
 'brace':('b',FX,GY+4,'b','brace'),'steel':('c',FX,GY-50,'f','idle'),'earth':('bl',138,GY+3,'f','earth'),
 'leap':('b',FX,GY+4,'f','leap'),'shieldland':('b',FX,GY+4,'f','shieldland'),
}
def scene(k, eff):
    mode,ax,ay,z,sk=A[k]; b=eff.getbbox()
    if mode=='c': ox,oy=ax-(b[0]+b[2])//2, ay-(b[1]+b[3])//2
    elif mode=='b': ox,oy=ax-(b[0]+b[2])//2, ay-b[3]
    else: ox,oy=ax-b[0], ay-b[3]
    wf,h,cw=m.strip(sk); w=wf[min(h,len(wf)-1)]
    t=m.tile()
    if z=='b': t.alpha_composite(eff,(ox,oy))
    t.alpha_composite(w,(FX-(cw//2 if cw!=m.W else 76),GY-124))
    if z=='f': t.alpha_composite(eff,(ox,oy))
    return t.convert('RGB')
if __name__=='__main__':
    od=sys.argv[1]; os.makedirs(od,exist_ok=True)
    for k in A:
        row=Image.new('RGB',(360*4+30,224),(28,28,28))
        for i,s in enumerate(['_a','','_c','_d']):
            f=f'{k}{s}/00.png'
            if os.path.exists(f): row.paste(scene(k,Image.open(f).convert('RGBA')),(i*370,0))
        row.save(f'{od}/{k}.png')
