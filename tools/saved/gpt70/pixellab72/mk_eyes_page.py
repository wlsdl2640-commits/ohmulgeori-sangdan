# 눈 시안: 지금 궁수(arc_v1)의 눈(2칸 × 3칸 · 잿빛 갈색 + 짙은 갈색, 검정 · 흰 반짝이 없음)을 전사 · 도적에 입혀 본다 — 대기 한 장만
from PIL import Image, ImageDraw, ImageFont
import os, base64, io
H=os.path.dirname(os.path.abspath(__file__))
L,D,T=(0x79,0x67,0x55,255),(0x71,0x41,0x3b,255),(0x5b,0x31,0x38,255)      # 궁수 눈: 왼 줄 · 오른 줄 · 오른 줄 맨 위
def fr(d,f): return Image.open(f'{H}/{d}/idle.png').convert('RGBA').crop((f*80,0,f*80+80,80))
def eye(im,x,y,rows):
    im=im.copy(); p=im.load()
    for r in range(rows): p[x,y+r]=L; p[x+1,y+r]=T if r==0 else D
    return im
W,R,A=fr('war_v1',0),fr('rogue_v1',1),fr('arc_v1',0)
SK=(0xf4,0xd2,0x9c,255)
def b_fix(im,x,y):   # 2칸 높이 판: 셋째 줄은 살색으로 되돌림
    im=eye(im,x,y,2); return im
ROWS=[('전사',[('지금',W),('A · 궁수 눈 그대로',eye(W,40,38,3)),('B · 한 칸 낮춤',b_fix(W,40,38))],(26,24,34,30)),
      ('도적',[('지금',R),('A · 궁수 눈 그대로',eye(R,43,30,3)),('B · 한 칸 낮춤',b_fix(R,43,30))],(26,18,34,30))]
for nm,vs,_ in ROWS:
    for i,(t,im) in enumerate(vs): im.crop(im.getbbox()).save(f'{H}/eyes_{"war" if nm=="전사" else "rogue"}_{"nAB"[i]}.png')
BG=(120,150,110,255)
def panel(im,box,z):
    c=Image.new('RGBA',(box[2],box[3]),BG); c.alpha_composite(im.crop((box[0],box[1],box[0]+box[2],box[1]+box[3]))); return c.resize((box[2]*z,box[3]*z),Image.NEAREST)
def sheet(nm,vs,hb):
    cells=[]
    for t,im in vs:
        head=panel(im,hb,9); body=panel(im,(20,16,40,52),4)
        c=Image.new('RGBA',(head.width+body.width+6,max(head.height,body.height)),BG); c.alpha_composite(head,(0,0)); c.alpha_composite(body,(head.width+6,(c.height-body.height)//2)); cells.append(c)
    S=Image.new('RGBA',(sum(c.width for c in cells)+12*(len(cells)-1),cells[0].height),(40,48,40,255)); x=0
    for c in cells: S.alpha_composite(c,(x,0)); x+=c.width+12
    return S
def b64(im): b=io.BytesIO(); im.convert('RGB').save(b,'PNG'); return base64.b64encode(b.getvalue()).decode()
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]
secs=''
for nm,vs,hb in ROWS:
    figs=''
    for t,im in vs:
        one=sheet(nm,[(t,im)],hb); figs+=f'<figure class="wide one"><img alt="{nm} {t}: 키운 얼굴과 온몸" src="data:image/png;base64,{b64(one)}"><figcaption>{t}</figcaption></figure>'
    sheet(nm,vs,hb).save(f'{H}/eyes_sheet_{"war" if nm=="전사" else "rogue"}.png')
    secs+=f'<section class="sec"><h2>{nm}</h2>{figs}</section>'
ref=panel(A,(26,20,34,30),9)
page=f"""<title>눈 시안</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>.wide {{ border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }} .wide img {{ display: block; width: 100%; height: auto; image-rendering: pixelated; }} .ref img {{ max-width: 260px; }} .one {{ margin: 0 0 12px; }} .one figcaption {{ padding: 8px 10px; font-weight: 600; }}</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 캐릭터 얼굴</p><h1>눈 시안</h1><p class="lede">지금 궁수의 눈을 전사와 도적에게 입혀 본 시안입니다. 대기 한 장에만 해 본 것이고 게임에는 넣지 않았습니다.</p></header>
  <section class="sec"><h2>기준: 지금 궁수의 눈</h2><figure class="wide ref"><img alt="지금 궁수의 얼굴. 갈색 두 줄로 된 부드러운 눈" src="data:image/png;base64,{b64(ref)}"></figure><p class="note">검은 점과 흰 반짝이가 없고, 잿빛 갈색 한 줄과 짙은 갈색 한 줄이 나란히 선 눈입니다.</p></section>
  {secs}
  <p class="note" id="save-hint">보기만 하는 시안이라 저장 단추는 없습니다.</p>
</main>"""
open(H+'/page_eyes.html','w',encoding='utf-8').write(page); print(len(page))
