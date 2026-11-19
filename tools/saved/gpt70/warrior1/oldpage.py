"""옛 전사(1차 · 빌드 70까지의 뭉툭 도트) 그림을 모아 보는 페이지 — 11-19 22:32 사용자 「옛 전사 이미지좀 뽑아줘」
   python3 oldpage.py <run96 결과 폴더(look.json)> <compose96 결과 폴더(warrior1_*.png)> <출력 폴더>
   저장소만으로 다시 만들기: python3 oldpage.py old old <출력 폴더>   (old/ = 11-18에 옛 그림으로 뽑아 둔 look.json · 낱장 · 「옛 그림」 제목의 생김새 · 동작 판,
   스킬 장면 · 스킬 그림 판은 이 폴더의 warrior1_3 ~ 5 그대로 — 그림 폴더에 없는 판은 이 폴더에서 찾는다)
   → <출력>/old-warrior.html + old_warrior_1_sprites.png … 6_skill_icons.png (페이지가 같은 폴더의 그림을 읽는다)
   아티팩트로 올릴 때: file_path = old-warrior.html · files = 그림 여섯 장(같은 이름으로) · capabilities {downloads: true}(「저장」 단추)
   사용자는 채팅에 보낸 파일을 못 본다 → 그림은 이 페이지로 보여 주고, 저장은 페이지의 단추로."""
import json, base64, io, os, shutil, sys
from PIL import Image
SRC, SHEETS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
look = json.load(open(os.path.join(SRC, 'look.json')))
CW, CH, AX, AY = 44, 38, 18, 35   # 낱장 칸(1배) · 닻 자리 — compose96.py의 낱장 판과 같은 배치
def cell(s):
    im = Image.open(io.BytesIO(base64.b64decode(s['u'].split(',')[1]))).convert('RGBA'); c = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); c.alpha_composite(im, (AX - s['ax'], AY - s['ay'])); return c
def uri(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
def strip(side, keys):
    S = Image.new('RGBA', (CW * len(keys), CH), (0, 0, 0, 0))
    for i, k in enumerate(keys): S.alpha_composite(cell(look[side][k]), (i * CW, 0))
    return uri(S)
POSES = [('idle0', '서 있기 1'), ('idle1', '서 있기 2'), ('walk0', '걷기 1'), ('walk1', '걷기 2'), ('walk2', '걷기 3'), ('walk3', '걷기 4'), ('sit0', '앉기'), ('sleep0', '자기'), ('down0', '쓰러짐')]
def cells(side, word):
    out = []
    for k, nm in POSES:
        if side == 'front' and k == 'down0': out.append('<li class="none"><span class="ph">앞모습 없음</span><span>쓰러짐</span></li>'); continue
        out.append(f'<li><img src="{uri(cell(look[side][k]))}" alt="{word} {nm}" width="{CW}" height="{CH}"><span>{nm}</span></li>')
    return '\n        '.join(out)
FILES = [   # 저장 이름 · 원본 · 제목 · 설명 · 크게 볼 때 너비
    ('old_warrior_1_sprites.png', 'warrior1_0_sprites.png', None, None, 0),
    ('old_warrior_2_look.png', 'warrior1_1_look.png', '생김새 판', '옆모습과 앞모습의 서 있기 2장 · 걷기 4장 · 앉기 · 자기 · 쓰러짐을 5배로 키운 판입니다. 아래에 게임 속 실제 크기가 있습니다.', 1150),
    ('old_warrior_3_motions.png', 'warrior1_2_motions.png', '동작 판', '장검 동작 13가지, 8장씩입니다. 흰색과 노란색 칸은 칼 자취, 금색 테는 맞히는 장, 숫자는 그 장을 보여 주는 초입니다(합 0.44초).', 1000),
    ('old_warrior_4_skills_attack.png', 'warrior1_3_skills_attack.png', '공격 스킬 장면', '강타 · 휩쓸기 · 대지 가르기 · 충격파 · 거인의 일격을 쓰는 실제 전투 화면입니다. 스킬마다 6장.', 1500),
    ('old_warrior_5_skills_buff.png', 'warrior1_4_skills_buff.png', '강화 · 도발 스킬 장면', '도발 · 철벽 · 광폭화 · 되치기 · 결의 · 전쟁의 함성을 쓰는 실제 전투 화면입니다. 스킬마다 6장.', 1500),
    ('old_warrior_6_skill_icons.png', 'warrior1_5_icons.png', '스킬 그림', '1차 스킬 13개의 옛 그림입니다. 왼쪽이 16×20칸 원본, 오른쪽이 게임에서 보이는 육각 틀.', 820),
]
SIZE = {}
for name, src, *_ in FILES:
    sp = os.path.join(SHEETS, src); shutil.copyfile(sp if os.path.exists(sp) else os.path.join(HERE, src), os.path.join(OUT, name)); SIZE[name] = Image.open(os.path.join(OUT, name)).size
def sheet(name, title, note, zw):
    w, h = SIZE[name]
    return f'''  <section class="sheet">
    <div class="head">
      <div class="what"><h2>{title}</h2><p class="note">{note} <span class="num">{w}×{h}</span></p></div>
      <div class="acts"><button type="button" class="btn zoom" aria-pressed="false">크게 보기</button><button type="button" class="btn save" data-file="{name}" hidden>저장</button><span class="msg" role="status"></span></div>
    </div>
    <div class="frame" tabindex="0" role="group" aria-label="{title} 그림"><img src="{name}" alt="옛 전사 {title}" width="{w}" height="{h}" style="--zw: {zw}px"></div>
  </section>'''
SW, SH = SIZE['old_warrior_1_sprites.png']
HTML = f'''<title>옛 전사 그림</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
<style>
/* 배치: 한 줄 흐름 — 머리(큰 도트 둘이 숨 쉰다) → 낱장 격자 → 판마다 그림 + 「크게 보기 · 저장」. 색은 옛 전사 도트에서: 투구 강철 · 깃 붉은색 · 띠 금색 */
:root {{
  --bg: #eceef3; --surface: #f8f9fb; --panel: #d5d9e3; --fg: #1a1d25; --muted: #565d6e; --line: #c2c8d5;
  --accent: #a82c2a; --accent-fg: #ffffff; --label: #7a5a0c; --sheet: #15171c;
  --font-display: "Do Hyeon", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif;
  --font-body: "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif;
  --font-data: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg: #15171c; --surface: #1d2028; --panel: #2c303a; --fg: #ece6dc; --muted: #a39f97; --line: #353a47; --accent: #c63d36; --accent-fg: #ffffff; --label: #f0c45a; --sheet: #15171c; color-scheme: dark }} }}
:root[data-theme="dark"] {{ --bg: #15171c; --surface: #1d2028; --panel: #2c303a; --fg: #ece6dc; --muted: #a39f97; --line: #353a47; --accent: #c63d36; --accent-fg: #ffffff; --label: #f0c45a; --sheet: #15171c; color-scheme: dark }}
*, *::before, *::after {{ box-sizing: border-box }}
body {{ background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: 15px; line-height: 1.6; word-break: keep-all; overflow-wrap: break-word; padding-block: 28px 56px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)) }}
.wrap {{ max-width: 960px; margin-inline: auto; display: grid; gap: 44px; grid-template-columns: minmax(0, 1fr) }}
h1, h2, h3, p, ul, figure {{ margin: 0 }}
ul {{ padding: 0; list-style: none }}
h1, h2 {{ font-family: var(--font-display); font-weight: 400; text-wrap: balance; line-height: 1.15 }}
h1 {{ font-size: clamp(30px, 7vw, 42px) }}
h2 {{ font-size: 24px }}
h3 {{ font-size: 15px; font-weight: 600 }}
h3 span {{ color: var(--muted); font-weight: 400; margin-left: 6px }}
.num {{ font-family: var(--font-data); font-size: 12.5px; font-variant-numeric: tabular-nums; color: var(--muted); white-space: nowrap }}

.top {{ display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); align-items: end }}
.top-text {{ display: grid; gap: 10px; min-width: 0 }}
.eyebrow {{ color: var(--label); font-size: 13px; font-weight: 600; letter-spacing: .04em }}
.lede {{ max-width: 34em }}
.facts {{ display: flex; flex-wrap: wrap; gap: 4px 18px; color: var(--muted); font-size: 13px }}
.facts b {{ color: var(--fg); font-family: var(--font-data); font-weight: 400; font-variant-numeric: tabular-nums }}
.hint {{ color: var(--muted); font-size: 13px; max-width: 34em }}
.duo {{ --z: 4; display: flex; gap: 12px }}
.duo figure {{ display: grid; gap: 6px; justify-items: start }}
.duo figcaption {{ color: var(--muted); font-size: 13px }}
.spr {{ --w: calc(44px * var(--z)); width: var(--w); height: calc(38px * var(--z)); background-color: var(--panel); background-repeat: no-repeat; background-size: calc(var(--w) * 2) 100%; border-radius: 8px; image-rendering: pixelated; animation: breathe 1.1s steps(2) infinite }}
@keyframes breathe {{ to {{ background-position: calc(var(--w) * -2) 0 }} }}
@media (prefers-reduced-motion: reduce) {{ .spr {{ animation: none }} }}
@media (min-width: 760px) {{ .top {{ grid-template-columns: minmax(0, 1fr) auto }} .duo {{ --z: 5 }} }}

.sheet {{ display: grid; gap: 14px; grid-template-columns: minmax(0, 1fr) }}
.head {{ display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: end; justify-content: space-between }}
.what {{ flex: 1 1 300px; min-width: 0; display: grid; gap: 4px }}
.note {{ color: var(--muted); font-size: 14px; max-width: 44em }}
.acts {{ display: flex; flex-wrap: wrap; gap: 8px; align-items: center }}
.msg {{ color: var(--muted); font-size: 13px }}
.msg:empty {{ display: none }}
.btn {{ font: 600 14px/1 var(--font-body); padding: 12px 16px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); cursor: pointer }}
.btn.save {{ background: var(--accent); border-color: var(--accent); color: var(--accent-fg) }}
.btn:disabled {{ opacity: .6; cursor: default }}
.btn:focus-visible, .frame:focus-visible {{ outline: 2px solid var(--fg); outline-offset: 2px }}
.cells {{ display: grid; gap: 8px; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) }}
@media (min-width: 1000px) {{ .cells {{ grid-template-columns: repeat(9, minmax(0, 1fr)) }} }}
.cells li {{ background: var(--panel); border-radius: 6px; padding: 6px 4px 7px; display: grid; gap: 2px; justify-items: center; align-content: end; font-size: 13px; color: var(--muted) }}
.cells img {{ width: 88px; height: 76px; max-width: none; image-rendering: pixelated }}
.cells .ph {{ height: 76px; display: grid; place-items: center; font-size: 12.5px }}
.frame {{ overflow-x: auto; background: var(--sheet); border: 1px solid var(--line); border-radius: 8px }}
.frame img {{ display: block; width: 100%; height: auto }}
.frame.zoomed img {{ width: max(100%, var(--zw)); max-width: none }}
</style>

<div class="wrap">
  <header class="top">
    <div class="top-text">
      <p class="eyebrow">미궁도시 · 빌드 70까지</p>
      <h1>옛 전사 그림</h1>
      <p class="lede">새 그림으로 바꾸기 전에 게임에 쓰던 전사(1차) 뭉툭 도트입니다. 판마다 「저장」을 누르면 원본 PNG를 받습니다.</p>
      <ul class="facts"><li>옆모습 <b>26×34</b> 픽셀</li><li>앞모습 <b>32×32</b> 픽셀</li><li>도트 한 칸 = 화면 <b>2×2</b> 픽셀</li><li>공격 동작 <b>8</b>장 · <b>0.44</b>초</li></ul>
      <p class="hint" id="nosave" hidden>이 화면에서는 저장 단추를 쓸 수 없습니다. 그림을 길게 눌러 저장해 보시고, 안 되면 채팅에 알려 주세요.</p>
    </div>
    <div class="duo">
      <figure><div class="spr" role="img" aria-label="옛 전사 옆모습, 서 있기" style="background-image: url({strip('side', ['idle0', 'idle1'])})"></div><figcaption>옆모습 · 전투와 원정</figcaption></figure>
      <figure><div class="spr" role="img" aria-label="옛 전사 앞모습, 서 있기" style="background-image: url({strip('front', ['idle0', 'idle1'])})"></div><figcaption>앞모습 · 길드 앞</figcaption></figure>
    </div>
  </header>

  <section class="sheet">
    <div class="head">
      <div class="what"><h2>낱장</h2><p class="note">옆모습 9장, 앞모습 8장입니다. 저장하면 글자 없는 투명 바탕 8배 판 한 장으로 받습니다. <span class="num">{SW}×{SH}</span></p></div>
      <div class="acts"><button type="button" class="btn save" data-file="old_warrior_1_sprites.png" hidden>저장</button><span class="msg" role="status"></span></div>
    </div>
    <h3>옆모습<span>오른쪽을 본다</span></h3>
    <ul class="cells">
        {cells('side', '옆모습')}
    </ul>
    <h3>앞모습<span>왼손에 라운드 실드</span></h3>
    <ul class="cells">
        {cells('front', '앞모습')}
    </ul>
  </section>

{chr(10).join(sheet(n, t, d, z) for n, _, t, d, z in FILES[1:])}
</div>

<script>
(() => {{
  const all = (s, r) => Array.from((r || document).querySelectorAll(s));
  all('.zoom').forEach(b => b.addEventListener('click', () => {{
    const fr = b.closest('.sheet').querySelector('.frame'), on = !fr.classList.contains('zoomed');
    fr.classList.toggle('zoomed', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? '화면에 맞추기' : '크게 보기';
    if (!on) fr.scrollLeft = 0;
  }}));
  const say = (b, t) => {{ const m = b.closest('.acts').querySelector('.msg'); if (m) m.textContent = t; }};
  const off = () => {{ all('.save').forEach(b => {{ b.hidden = true; }}); document.getElementById('nosave').hidden = false; }};
  (async () => {{
    let dl = null;
    try {{ if (window.claude && typeof window.claude.use === 'function') dl = await window.claude.use('downloads'); }} catch (_) {{ dl = null; }}
    if (!dl) {{ off(); return; }}
    all('.save').forEach(b => {{
      b.hidden = false;
      b.addEventListener('click', async () => {{
        if (b.disabled) return;
        b.disabled = true; say(b, '');
        let blob = null;
        try {{ const r = await fetch(b.dataset.file); if (r.ok) blob = await r.blob(); }} catch (_) {{ blob = null; }}
        if (!blob) {{ say(b, '그림 파일을 불러오지 못했습니다. 다시 눌러 주세요.'); b.disabled = false; return; }}
        try {{ await dl.save({{ filename: b.dataset.file, data: blob }}); say(b, '저장했습니다'); }}
        catch (e) {{
          const c = e && e.code;
          if (c === 'declined') say(b, '');
          else if (c === 'rate_limited') say(b, '저장 창이 이미 열려 있습니다. 닫고 다시 눌러 주세요.');
          else if (c === 'too_large') say(b, '파일이 커서 이 화면에서는 저장할 수 없습니다.');
          else off();
        }}
        b.disabled = false;
      }});
    }});
  }})();
}})();
</script>
'''
open(os.path.join(OUT, 'old-warrior.html'), 'w', encoding='utf-8').write(HTML)
print('page', len(HTML) // 1024, 'KB', {n: SIZE[n] for n in SIZE})
