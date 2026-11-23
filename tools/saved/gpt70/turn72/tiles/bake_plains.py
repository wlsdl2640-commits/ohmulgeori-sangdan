# 픽셀랩 타일 시트(64×48: 윗면 + 옆면, 두께 50) → 시안용 사선 타일 묶음 plains_atlas.png
# 윗면 4장(36×20을 한 줄마다 기울여 42×20) + 옆면 4장(36×8)
from PIL import Image
import os
H=os.path.dirname(os.path.abspath(__file__)); im=Image.open(H+'/plains_sheet_t50.png').convert('RGBA')
PICK=[(1,0),(3,1),(2,1),(1,1)]          # (열, 줄): 밝은 풀 · 꽃 조금 · 꽃 · 꽃 많이
SK=6; out=Image.new('RGBA',(42*4,28),(0,0,0,0))
for k,(cx,ry) in enumerate(PICK):
    t=im.crop((cx*65, 8+ry*65, cx*65+64, 8+ry*65+48))
    top=t.crop((2,2,62,33)).resize((36,20),Image.NEAREST); side=t.crop((2,35,62,47)).resize((36,8),Image.NEAREST)
    px=top.load()
    for x in range(36):                      # 칸이 보이게 아래 · 오른쪽 한 줄을 조금 어둡게
        r,g,b,a=px[x,19]; px[x,19]=(int(r*.9),int(g*.9),int(b*.9),a)
    for y in range(20):
        r,g,b,a=px[35,y]; px[35,y]=(int(r*.9),int(g*.9),int(b*.9),a)
    for b in range(20): out.paste(top.crop((0,b,36,b+1)),(k*42+round((19-b)*SK/20),b))
    out.paste(side,(k*42,20))
out.save(H+'/plains_atlas.png'); print(out.size)
