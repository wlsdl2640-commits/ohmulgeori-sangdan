# 픽셀랩 길가 소품 16개(64px, 측면) → 720×80 길가 띠 plains_props.png (발이 맨 아래 줄)
from PIL import Image
import os
H=os.path.dirname(os.path.abspath(__file__)); P=H+'/props/'
def load(n,sc):
    im=Image.open(P+n+'.png').convert('RGBA'); im=im.crop(im.getbbox())
    return im if sc==1 else im.resize((max(1,round(im.width*sc)),max(1,round(im.height*sc))),Image.NEAREST)
# (이름, 배율, 왼쪽 x) — 뒤에 적은 것이 앞에 그려진다
LAY=[('patch_of_tall_golden_wheat',.6,0),('patch_of_tall_golden_wheat',.6,36),('leafy_oak_tree',1,58),('wooden_rail_fence_section',.6,112),('wooden_rail_fence_section',.6,148),
     ('small_farmhouse_with_red_tile',1,176),('two_wooden_barrels',.45,236),('pile_of_grain_sacks',.5,262),('wooden_rail_fence_section',.6,292),('tall_golden_haystack',.7,326),
     ('round_stone_windmill_tower_wit',1,372),('bundle_of_harvested_wheat_shea',.5,424),('green_bush',.55,448),('low_field_stone_wall_section',.6,480),('low_field_stone_wall_section',.6,516),
     ('small_round_apple_tree',.9,548),('wooden_farm_cart_loaded_with_h',.7,598),('stack_of_three_square_hay_bale',.6,646),('round_stone_well_with_bucket',.6,688)]
out=Image.new('RGBA',(720,80),(0,0,0,0))
for n,sc,x in LAY:
    im=load(n,sc); out.alpha_composite(im,(x,80-im.height))
    if x+im.width>720: out.alpha_composite(im.crop((720-x,0,im.width,im.height)),(0,80-im.height))     # 오른쪽 끝을 넘으면 왼쪽으로 이어 붙임
out.save(H+'/plains_props.png'); print(out.size)
