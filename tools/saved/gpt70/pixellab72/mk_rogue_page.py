# 도적 준비물 페이지: 픽셀랩 전사 대기 첫 장(64×64) 저장 단추 + 이미지 생성 「프로」에 넣을 글
from PIL import Image
import os,base64,io,html
H=os.path.dirname(os.path.abspath(__file__))
fr=Image.open(H+'/war_v1/idle.png').convert('RGBA').crop((0,0,80,80)); bb=fr.getbbox(); c=fr.crop(bb)
ref=Image.new('RGBA',(64,64),(0,0,0,0)); ref.alpha_composite(c,((64-c.width)//2,60-c.height)); ref.save(H+'/warrior_pl_east_64.png')
def b64(im):
    b=io.BytesIO(); im.save(b,'PNG'); return base64.b64encode(b.getvalue()).decode()
big=Image.new('RGBA',(64,64),(200,204,214,255)); big.alpha_composite(ref); big=big.resize((384,384),Image.NEAREST)
P1="""A young rogue adventurer, full body, side view facing right, standing idle. Exactly the same pixel art style, proportions, body size, outline and shading as the character in reference image 1. He wears a dark indigo hood pulled over his head with his face visible, a short dark indigo cloak, a brown leather vest with belts and small pouches, dark grey trousers and soft brown leather boots, and a mustard yellow scarf around his neck. He holds one short steel dagger in his right hand in a reverse grip, low and ready. His left hand is empty. Light, agile build. No shield, no helmet, no bow. Feet on the ground."""
src=open(H+'/page_pixellab.html',encoding='utf-8').read(); css=src[src.index('<style>'):src.index('</style>')+8]; js=src[src.index('<script>'):src.index('</script>')+9]
page=f"""<title>도적 준비물</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
{css}
<style>
.sheet {{ background: var(--sheet); border: 1px solid var(--line); border-radius: 10px; padding: 8px; max-width: 260px; }}
.sheet img {{ display: block; width: 100%; height: auto; image-rendering: pixelated; border-radius: 6px; }}
.btn {{ font: inherit; font-weight: 600; padding: 10px 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); cursor: pointer; }}
.btn.go {{ background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }}
.row {{ display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }}
pre.code {{ background: var(--code); border: 1px solid var(--line); border-radius: 10px; padding: 14px; font-family: var(--font-data); font-size: 13px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }}
table.set {{ border-collapse: collapse; width: 100%; font-size: 14px; }} table.set th, table.set td {{ text-align: left; padding: 7px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }} table.set th {{ color: var(--muted); font-weight: 600; }}
</style>
<main class="wrap">
  <header class="top"><p class="eyebrow">미궁도시 라비린토스 · 도적 1차</p><h1>도적 준비물</h1><p class="lede">픽셀랩에서 뽑은 전사를 참고 그림으로 붙여, 같은 그림체의 도적 옆모습을 뽑습니다.</p></header>
  <section class="sec"><h2>1. 참고로 붙일 전사 그림</h2>
    <figure class="sheet"><img alt="오른쪽을 보고 선 전사. 투구, 붉은 망토, 둥근 방패, 검" src="data:image/png;base64,{b64(big)}"></figure>
    <div class="row"><button class="btn go" type="button" data-save="warrior_pl_east_64.png" data-b64="{b64(ref)}">전사 그림 저장</button></div>
    <p class="note" id="save-hint">저장이 안 되면 그림을 길게 눌러 저장해 주세요. 저장되는 파일은 64 × 64, 바탕이 투명합니다.</p>
  </section>
  <section class="sec"><h2>2. 픽셀랩 설정</h2>
    <p class="note">심플 크리에이터 → 이미지 생성 → 「프로」 칸</p>
    <table class="set"><tr><th>화면의 영어</th><th>뜻</th><th>할 일</th></tr>
    <tr><td>Mode</td><td>방식</td><td>Pro</td></tr><tr><td>Description</td><td>설명</td><td>아래 3번 글 넣기</td></tr><tr><td>Remove background</td><td>배경 제거</td><td>체크</td></tr><tr><td>Output size</td><td>출력 크기</td><td>64x64 (Custom size는 체크 안 함)</td></tr><tr><td>Reference images</td><td>참고 그림</td><td>위 전사 그림 한 장</td></tr><tr><td>Style image</td><td>그림체 그림</td><td>비워 둠</td></tr><tr><td>Color palette</td><td>색상표</td><td>그대로</td></tr></table>
  </section>
  <section class="sec"><h2>3. 설명 칸에 넣을 글 (옆모습)</h2>
    <pre class="code" id="p1">{html.escape(P1)}</pre>
    <div class="row"><button class="btn" type="button" data-copy="p1">글 복사</button></div>
    <p class="note">남색 두건과 짧은 망토, 갈색 가죽 조끼, 겨자색 목도리, 거꾸로 쥔 단검 한 자루입니다.</p>
  </section>
</main>
{js}"""
open(H+'/page_rogue.html','w',encoding='utf-8').write(page); print(len(page), c.size)
