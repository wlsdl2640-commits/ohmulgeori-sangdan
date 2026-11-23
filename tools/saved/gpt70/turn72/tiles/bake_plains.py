# 픽셀랩 타일 시트(64×48: 윗면 + 옆면, 두께 50) → 시안용 사선 타일 묶음 plains_atlas.png
# 윗면 4장(36×20을 한 줄마다 기울여 42×20) + 옆면 4장(36×8)
from PIL import Image
import os
H=os.path.dirname(os.path.abspath(__file__)); im=Image.open(H+'/plains_sheet_t50.png').convert('RGBA')
def bake(PICK, name):
    CW=33; SK=11; TW=CW+SK; out=Image.new('RGBA',(TW*4,28),(0,0,0,0))
    for k,(cx,ry) in enumerate(PICK):
        t=im.crop((cx*65, 8+ry*65, cx*65+64, 8+ry*65+48))
        top=t.crop((2,2,62,33)).resize((CW,20),Image.NEAREST); side=t.crop((2,35,62,47)).resize((CW,8),Image.NEAREST)
        px=top.load()
        for x in range(CW):                      # 칸이 보이게 아래 · 오른쪽 한 줄을 조금 어둡게
            r,g,b,a=px[x,19]; px[x,19]=(int(r*.86),int(g*.86),int(b*.86),a)
        for y in range(20):
            r,g,b,a=px[CW-1,y]; px[CW-1,y]=(int(r*.86),int(g*.86),int(b*.86),a)
        for b in range(20): out.paste(top.crop((0,b,CW,b+1)),(k*TW+round((19-b)*SK/20),b))
        out.paste(side,(k*TW,20))
    out.save(H+'/'+name); print(name,out.size)
bake([(1,0),(3,1),(2,1),(1,1)],'plains_atlas.png')      # (열, 줄): 밝은 풀 · 꽃 조금 · 꽃 · 꽃 많이
bake([(3,2),(3,2),(3,2),(3,2)],'plains_dirt_atlas.png') # 사용자가 지도 편집기에서 칠한 흙바닥(24×6, 모두 이 타일)
