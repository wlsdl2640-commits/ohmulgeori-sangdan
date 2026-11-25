from PIL import Image, ImageDraw, ImageFont
import sys
fs=[('../rogue_hood_A_120.png','지금 A'),('hoodA_p1_120.png','① 원통 통'),('hoodA_p2_120.png','② 둥근 꽂이'),('hoodA_p3_120.png','③ 상자 통')]
srcs=['../../rogue_hood_A.png','hoodA_p1.png','hoodA_p2.png','hoodA_p3.png']
try: font=ImageFont.truetype('C:/Windows/Fonts/malgun.ttf',22)
except: font=None
W=4*330; out=Image.new('RGB',(W,690),(40,38,46)); d=ImageDraw.Draw(out)
for i,(f,n) in enumerate(fs):
    x=i*330
    d.text((x+12,8),n,fill=(240,230,200),font=font)
    big=Image.open(srcs[i]).convert('RGBA').crop((300,140,980,1180)).resize((300,459))
    bg=Image.new('RGBA',big.size,(255,255,255,255)); bg.alpha_composite(big); out.paste(bg.convert('RGB'),(x+15,40))
    g=Image.open(f).convert('RGBA'); g2=g.resize((g.width*1,g.height*1),Image.NEAREST)
    g3=g.resize((g.width*1.5.__int__() if False else int(g.width*1.5),int(g.height*1.5)),Image.NEAREST)
    out.paste(g2,(x+20,510),g2); out.paste(g3,(x+150,505),g3)
out.save(sys.argv[1])
