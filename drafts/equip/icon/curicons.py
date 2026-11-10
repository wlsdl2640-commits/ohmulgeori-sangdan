import re, json
from PIL import Image, ImageDraw
SRC='/home/claude/game62/src/'
A='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
def load(fn):
    t=open(SRC+fn,encoding='utf8').read()
    d={}
    for m in re.finditer(r'^\s+([a-z]+): \[(.*?)\],?$', t, re.M):
        d[m.group(1)]=json.loads('['+m.group(2)+']')
    return d
def cells(s):
    p,q=s.split('|'); pal=['#'+p[i:i+6] for i in range(0,len(p),6)]
    w=2 if len(pal)>64 else 1; out=[]
    for i in range(320):
        k=0
        for j in range(w): k=k*64+A.index(q[i*w+j])
        out.append(pal[k] if k<len(pal) else '#ff00ff')
    return out
G=load('data-gearicon.js'); O=load('data-officon.js')
keys=['sword','gladius','dagger','buckler','shield','kite','cross','tower']
S=6
img=Image.new('RGB',(len(keys)*(4*(20*S+6))+20, 0+20*S*1+40),(34,32,40))
x=10
for k in keys:
    arr=(G.get(k) or O.get(k))
    for look,s in enumerate(arr):
        c=cells(s)
        for i,col in enumerate(c):
            if col=='#ff00ff': continue
            cx=2+i%16; cy=i//16
            img.paste(Image.new('RGB',(S,S),col),(x+cx*S,20+cy*S))
        x+=20*S+6
    x+=0
img.save('cur_icons.png'); print(img.size)
