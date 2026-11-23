# 도적 준비물 페이지: 전사 머리 크기에 맞춘 도적 기준 그림 둘(동쪽 · 남쪽, 64×64) 저장 단추 + 「참조에서 생성」 순서
from PIL import Image
import os,base64,io
H=os.path.dirname(os.path.abspath(__file__))
def b64f(f): return base64.b64encode(open(f,'rb').read()).decode()
def big(f):
    im=Image.open(f).convert('RGBA'); c=Image.new('RGBA',(64,64),(200,204,214,255)); c.alpha_composite(im); b=io.BytesIO(); c.resize((256,256),Image.NEAREST).save(b,'PNG'); return base64.b64encode(b.getvalue()).decode()
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]; js=src[src.index('<script>'):src.index('</script>')+9]
cmp=Image.open(H+'/rogue_ref_compare.png').convert('RGB'); b=io.BytesIO(); cmp.save(b,'PNG'); cmpb=base64.b64encode(b.getvalue()).decode()
page=f"""<title>도적 준비물</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>
.pair {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }}
.sheet {{ background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 8px; display: grid; gap: 8px; }}
.sheet img {{ display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: 6px; }}
.wide {{ border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }} .wide img {{ display: block; width: 100%; height: auto; image-rendering: pixelated; }}
.btn {{ font: inherit; font-weight: 600; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--accent); background: var(--accent); color: var(--accent-fg); cursor: pointer; width: 100%; }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 도적 1차</p><h1>도적 준비물</h1><p class="lede">처음 뽑은 도적의 옷차림은 그대로 두고, 머리를 전사 머리 크기로 줄인 기준 그림 두 장입니다. 궁수 때처럼 「참조에서 생성」에 넣습니다.</p></header>
  <section class="sec"><h2>1. 기준 그림 두 장 받기</h2>
    <div class="pair">
      <figure class="sheet"><img alt="오른쪽을 보는 도적. 남색 두건, 겨자색 목도리, 갈색 조끼, 단검" src="data:image/png;base64,{big(H+'/rogue_ref_east_64.png')}"><button class="btn" type="button" data-save="rogue_east_64.png" data-b64="{b64f(H+'/rogue_ref_east_64.png')}">동쪽(옆) 저장</button></figure>
      <figure class="sheet"><img alt="정면을 보는 도적" src="data:image/png;base64,{big(H+'/rogue_ref_south_64.png')}"><button class="btn" type="button" data-save="rogue_south_64.png" data-b64="{b64f(H+'/rogue_ref_south_64.png')}">남쪽(정면) 저장</button></figure>
    </div>
    <p class="note" id="save-hint">저장이 안 되면 그림을 길게 눌러 저장해 주세요. 파일은 64 × 64, 바탕이 투명합니다.</p>
  </section>
  <section class="sec"><h2>2. 전사와 나란히</h2>
    <figure class="wide"><img alt="평원 위에 전사, 도적 옆모습, 전사, 도적 정면이 같은 배율로 서 있다. 머리 크기가 같다" src="data:image/png;base64,{cmpb}"></figure>
    <p class="note">키 39, 머리 높이 17로 전사와 같습니다. 줄여 맞춘 그림이라 도트가 조금 거칠지만, 픽셀랩이 이것을 보고 깨끗하게 다시 그립니다.</p>
  </section>
  <section class="sec"><h2>3. 픽셀랩에서 할 일</h2>
    <ol class="steps"><li>캐릭터 만들기에서 맨 위 탭 「참조에서 생성」을 누릅니다.</li><li>동쪽 칸에 옆 그림, 남쪽 칸에 정면 그림을 올립니다. 궁수를 만들 때와 같습니다.</li><li>만들어지면 「Idle」 상태의 동쪽 모습을 확인합니다.</li><li>모든 방향이 같은 옷(남색 두건, 겨자색 목도리)인지 돌려 보며 확인합니다.</li></ol>
  </section>
  <section class="sec"><h2>4. GPT로 해 볼 때</h2>
    <div class="pair"><figure class="sheet"><img alt="오른쪽을 보는 전사, 흰 바탕에 크게" src="data:image/png;base64,{b64f(H+'/warrior_east_gpt_768.png')}"><button class="btn" type="button" data-save="warrior_east_768.png" data-b64="{b64f(H+'/warrior_east_gpt_768.png')}">전사 옆모습 저장 (GPT용)</button></figure></div>
    <p class="note">GPT에는 이 전사 그림 한 장만 붙이고, 채팅에 적어 드린 코드를 넣습니다. 나온 그림은 저에게 보내 주시면 64 × 64로 줄여 픽셀랩 기준 그림으로 만듭니다.</p>
  </section>
</main>
{js}"""
open(H+'/page_rogue.html','w',encoding='utf-8').write(page); print(len(page))
