# 효과 방식 비교 쪽: 효과 도구 부품(첫 판 · v2) vs 그림체 맞춘 생성 효과(gen/) — python mk_method.py
import json,base64,io,os
from PIL import Image
bg=Image.open('../../../../plx73/bg_swamp/00.png').convert('RGBA')
mon=Image.open('../../../../plx74/pick/swampbrute_00.png').convert('RGBA')
GY=206; FX=120
war=Image.open('../strips/quake.png').convert('RGBA'); W,H=192,132
eff=[Image.open(f'gen/quake_anim/{i:02d}.png').convert('RGBA') for i in range(17)]
b=eff[16].getbbox(); ex=(b[0]+b[2])//2; ey=b[3]-6
seq=[None]*5+[4,2,0,0,0,1,2,3,4,5,6,7,8,10,12,14]
def tile(): t=bg.crop((0,0,360,224)).copy(); t.alpha_composite(mon,(360-mon.width-6,GY-mon.height+4)); return t
def make_gen():
    out=[]
    for i in range(21):
        t=tile(); k=seq[i] if i<len(seq) else None
        if k is not None: t.alpha_composite(eff[k],(FX-ex,GY-ey))
        t.alpha_composite(war.crop((i*W,0,(i+1)*W,H)),(FX-76,GY-124))
        out.append(t.convert('RGB').quantize(160))
    return out
def vfx(k,suf):
    js=json.load(open(f'out/{k}_{suf}.json',encoding='utf-8')); sh=Image.open(f'out/{k}_{suf}.png').convert('RGBA')
    fr=js['frames']; fr=list(fr.values()) if isinstance(fr,dict) else fr; a=js['meta']['anchor']; out=[]
    for f in fr:
        f=f['frame']; t=tile(); t.alpha_composite(sh.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])),(FX-a['x'],GY-a['y'])); out.append(t.convert('RGB').quantize(160))
    return out
def g64(fr):
    b=io.BytesIO(); fr[0].save(b,'GIF',save_all=True,append_images=fr[1:],duration=70,loop=0,optimize=True); return base64.b64encode(b.getvalue()).decode()
css="body{margin:0;background:#1c1f26;color:#e8e6e0;font-family:system-ui,sans-serif}main{max-width:1700px;margin:0 auto;padding:16px}h3{color:#f0c878;margin:18px 0 6px}p{opacity:.88}.row{display:flex;gap:10px;flex-wrap:wrap}.card{background:#262a33;border:1px solid #3a3f4a;border-radius:10px;padding:6px;display:grid;gap:4px}img{image-rendering:pixelated;width:540px;height:336px;border-radius:6px}"
o=[f"<!doctype html><meta charset=utf-8><title>효과 방식 비교</title><style>{css}</style><main><h2>효과 방식 비교 — 충격파 · 뛰어들기</h2>",
"<p><b>충격파</b>: 왼쪽 = 효과 도구 부품(첫 판) · 가운데 = 부품 보강(v2) · 오른쪽 = <b>새 방식</b>: 늪지 괴물 그림체를 참고해 효과 그림을 직접 그리고(픽셀랩 이미지 생성) 그 그림을 움직이게 만듦(솟는 부분은 부서지는 장면을 거꾸로).</p>",
f"<h3>충격파</h3><div class=row><div class=card><img src='data:image/gif;base64,{g64(vfx('quake','effect'))}'><b>첫 판</b></div><div class=card><img src='data:image/gif;base64,{g64(vfx('quake','v2'))}'><b>v2 (부품 보강)</b></div><div class=card><img src='data:image/gif;base64,{g64(make_gen())}'><b>새 방식 (그림체 맞춰 생성)</b></div></div>",
f"<h3>뛰어들기 v3 — 전사가 포물선으로 날아와 착지 (그림 장 수 그대로 · 위치만 옮김 · 잔상)</h3><div class=row><div class=card><img src='data:image/gif;base64,{g64(vfx('leap','v3'))}'><b>뛰어들기 v3</b></div></div></main>"]
open('../page_vfx_method.html','w',encoding='utf-8').write(''.join(o)); print(os.path.getsize('../page_vfx_method.html')//1024)
