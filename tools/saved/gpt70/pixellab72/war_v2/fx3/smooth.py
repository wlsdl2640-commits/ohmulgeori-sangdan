# 효과 장 다듬기: 생기는 장(거꾸로) + 사라지는 장 → 빈 앞뒤 자르기 · 큰 차이는 사이 장 섞기 · 사라짐 늘이기 · 처음/끝 투명도 천천히
import glob, numpy as np
from PIL import Image
def load(k):
    fi=[Image.open(f).convert('RGBA') for f in sorted(glob.glob(f'anim/{k}_in/*.png'))][::-1]
    fo=[Image.open(f).convert('RGBA') for f in sorted(glob.glob(f'anim/{k}_out/*.png'))]
    return fi, fo[1:]
def cov(im): return (np.array(im)[...,3]>0).sum()
def mix(a,b,t): return Image.blend(a,b,t)
def fade(im,t):
    a=np.array(im).copy(); a[...,3]=(a[...,3]*t).astype(np.uint8); return Image.fromarray(a)
def smooth(k, stretch_out=1, TH=900):
    fi,fo=load(k)
    seq=fi+fo
    c=[cov(x) for x in seq]
    nz=[i for i,v in enumerate(c) if v>15]
    seq=seq[nz[0]:nz[-1]+1]; peak=len(fi)-nz[0]
    out=[]; pk=0
    for i in range(len(seq)):
        a=seq[i]
        if i==peak: pk=len(out)
        out.append(a)
        if i+1<len(seq):
            b=seq[i+1]; d=np.abs(np.array(a)[...,3].astype(int)-np.array(b)[...,3].astype(int)).sum()/255
            n=int(d//TH)+ (stretch_out-1 if i>=peak else 0)
            for s in range(1,n+1): out.append(mix(a,b,s/(n+1)))
    first=out[0]; out=[fade(first,(s+1)/7) for s in range(6)]+out; pk+=6
    last=out[-1]; out+= [fade(last,1-(s+1)/9) for s in range(8)]
    return out, pk
