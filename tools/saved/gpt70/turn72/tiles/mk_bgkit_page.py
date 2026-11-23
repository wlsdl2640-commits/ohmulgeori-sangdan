# 길가 소품 16개를 한 장(1024×1024, 4×4)에 담고, 저장 단추 + GPT 부탁 글이 있는 페이지를 만든다
from PIL import Image
import os,glob,base64,io,html,re
H=os.path.dirname(os.path.abspath(__file__))
ORDER=['small_farmhouse_with_red_tile','wooden_barn_with_hay_loft','round_stone_windmill_tower_wit','round_stone_well_with_bucket','leafy_oak_tree','small_round_apple_tree','green_bush','patch_of_tall_golden_wheat',
       'tall_golden_haystack','stack_of_three_square_hay_bale','bundle_of_harvested_wheat_shea','wooden_farm_cart_loaded_with_h','wooden_rail_fence_section','low_field_stone_wall_section','two_wooden_barrels','pile_of_grain_sacks']
sh=Image.new('RGBA',(1024,1024),(216,220,228,255))
for k,n in enumerate(ORDER):
    im=Image.open(H+'/props/'+n+'.png').convert('RGBA'); im=im.crop(im.getbbox()).resize((im.getbbox()[2]-im.getbbox()[0])*0+1 and (im.crop(im.getbbox()).width*3, im.crop(im.getbbox()).height*3),Image.NEAREST)
    cx,cy=(k%4)*256,(k//4)*256; sh.alpha_composite(im,(cx+(256-im.width)//2, cy+232-im.height))
sh=sh.convert('RGB'); sh.save(H+'/plains_props_sheet.png')
buf=io.BytesIO(); sh.save(buf,'PNG'); b64=base64.b64encode(buf.getvalue()).decode()
PROMPT="""Use the attached sheet as the art style reference. It shows 16 pixel art props from my own game (farmhouse, barn, windmill, well, oak tree, apple tree, bush, wheat patch, haystack, hay bales, wheat sheaves, hay cart, rail fence, stone wall, barrels, grain sacks).

Draw ONE wide game background in exactly the same pixel art style: same chunky pixels, same dark outlines, same warm colors and shading. Image size 1536x1024, landscape.

Scene: a fertile farmland plain (granary plains) on a sunny day.

Layout, top to bottom:
1. Top quarter of the image: sky, soft green rolling hills, golden wheat fields, and along the near edge of the fields a row of the props from the sheet - farmhouse, windmill, haystack, rail fence, stone wall, apple tree, hay cart, barrels, well. Keep the props small, like they are a little far away. Their feet stand on one straight horizontal line.
2. Everything below that line (the lower three quarters): flat open ground seen from slightly above. Short green meadow grass with one wide worn dirt road running straight across from the left edge to the right edge, with soft natural grass edges. A few tiny flowers and pebbles only. This area must stay completely empty and flat because game characters will stand on it: no props, no trees, no fences, no rocks, no tall plants, no shadows.

Rules:
- The left edge and the right edge must match so the image can repeat sideways (the road, the grass and the horizon are at the same height on both edges).
- Same pixel size everywhere. No blur, no gradients, no anti-aliasing.
- No characters, no animals, no text, no numbers, no frame.
- No cross or plus shaped objects."""
src=open(H+'/../../pixellab72/page_pixellab.html',encoding='utf-8').read()
css=src[src.index('<style>'):src.index('</style>')+8]
js=src[src.index('<script>'):src.index('</script>')+9]
page=f"""<title>평원 배경 준비물</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>
.sheet {{ background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 8px; }}
.sheet img {{ display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: 6px; }}
.btn {{ font: inherit; font-weight: 600; padding: 10px 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); cursor: pointer; }}
.btn.go {{ background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }}
.row {{ display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }}
pre.code {{ background: var(--code); border: 1px solid var(--line); border-radius: 10px; padding: 14px; font-family: var(--font-data); font-size: 13px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 1층 곡창지대 평원</p><h1>평원 배경 준비물</h1><p class="lede">픽셀랩에서 뽑은 길가 소품 16개를 한 장에 모았습니다. 이 그림을 GPT에 붙이고 아래 글을 넣으면 같은 그림체로 원정 배경을 그려 달라고 할 수 있습니다.</p></header>
  <section class="sec"><h2>1. 붙일 그림</h2>
    <figure class="sheet"><img alt="농가, 헛간, 풍차, 우물, 나무, 건초, 수레, 울타리, 돌담, 통, 자루 등 길가 소품 16개를 4 × 4로 놓은 그림" src="data:image/png;base64,{b64}"></figure>
    <div class="row"><button class="btn go" type="button" data-save="plains_props_sheet.png" data-b64="{b64}">그림 저장</button></div>
    <p class="note" id="save-hint">저장이 안 되면 그림을 길게 눌러 저장해 주세요. 1024 × 1024, 소품은 원래 크기의 3배입니다.</p>
  </section>
  <section class="sec"><h2>2. GPT에 넣을 글</h2>
    <pre class="code" id="p1">{html.escape(PROMPT)}</pre>
    <div class="row"><button class="btn" type="button" data-copy="p1">글 복사</button></div>
  </section>
  <section class="sec"><h2>3. 받은 뒤 볼 것</h2>
    <ul class="steps"><li>아래 4분의 3이 비어 있는 평평한 풀밭과 흙길인지 봅니다. 나무나 울타리가 내려와 있으면 다시 부탁합니다.</li><li>소품들이 위쪽 한 줄에 작게 서 있는지 봅니다.</li><li>왼쪽 끝과 오른쪽 끝의 길 높이가 같은지 봅니다.</li><li>받은 그림을 그대로 채팅에 올려 주세요. 크기 맞추기, 사선 격자, 이어 붙이기는 제가 합니다.</li></ul>
  </section>
</main>
{js}"""
open(H+'/page_bgkit.html','w',encoding='utf-8').write(page); print(len(page), sh.size)
