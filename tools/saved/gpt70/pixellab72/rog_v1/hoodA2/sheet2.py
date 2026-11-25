from PIL import Image, ImageDraw, ImageFont
import sys
L=[('d1','주머니 ① 가죽 · 리본'),('d2','주머니 ② 천 · 붉은 끈'),('d3','주머니 ③ 가죽 · 술'),('c1','원통 다듬기 · 덮개'),('r1','둥근 다듬기 · 지갑'),('r2','둥근 다듬기 · 허벅지')]
font=ImageFont.truetype('C:/Windows/Fonts/malgun.ttf',20)
cw=330; out=Image.new('RGB',(3*cw,2*650),(40,38,46)); d=ImageDraw.Draw(out)
for i,(k,n) in enumerate(L):
    x=(i%3)*cw; y=(i//3)*650
    d.text((x+12,y+6),n,fill=(240,230,200),font=font)
    big=Image.open(f'hoodA_{k}.png').convert('RGBA').crop((300,140,980,1180)).resize((300,459))
    bg=Image.new('RGBA',big.size,(255,255,255,255)); bg.alpha_composite(big); out.paste(bg.convert('RGB'),(x+15,y+36))
    g=Image.open(f'hoodA_{k}_120.png').convert('RGBA')
    out.paste(g,(x+20,y+510),g)
    g3=g.resize((int(g.width*1.5),int(g.height*1.5)),Image.NEAREST)
    # put 1.5x beside, cropped to fit
    out.paste(g3.crop((0,30,g3.width,g3.height)),(x+130,y+490),g3.crop((0,30,g3.width,g3.height)))
out.save(sys.argv[1])
