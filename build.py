"""판타지상단키우기 빌드: 소스를 한 파일로 묶고, 설치형 웹앱(PWA) 패키지를 만든다."""
import base64, io, json, os, pathlib, shutil, zipfile
from fontTools import subset
from fontTools.ttLib import TTFont
from PIL import Image

ROOT = pathlib.Path(__file__).parent
SRC, FONTS, DIST = ROOT / 'src', ROOT / 'fonts', ROOT / 'dist'
JS = ['data.js', 'data-rpg.js', 'data-wicon.js', 'data-mast.js', 'data-off.js', 'data-officon.js', 'data-gearicon.js', 'data-biz.js', 'data-gear.js', 'data-world.js', 'data-skin.js', 'data-under.js', 'data-warr.js', 'data-armor65.js', 'data-wicon65.js', 'data-hdart65.js', 'data-gear65.js', 'data-trait.js', 'data-demon.js', 'data-herb.js', 'data-pet.js', 'data-books.js', 'data-sky.js', 'data-star.js', 'data-elem.js', 'data-life.js', 'data-salv.js', 'data-fight.js', 'data-job64.js', 'data-class65.js', 'data-mast65.js', 'data-store.js', 'data-itemart.js', 'data-armart.js', 'sprites.js', 'pxa.js', 'pxs.js', 'pxa-skin65.js', 'pxs-wpn65.js', 'pxmon.js', 'pxmon2.js', 'pxpet.js', 'pxmon3.js', 'pxmon4.js', 'pxraid.js', 'pxund.js', 'pxplains.js', 'pxforest.js', 'pxmountain.js', 'pxvalley.js', 'pxsnow.js', 'pxdesert.js', 'pxalley.js', 'pxsewer.js', 'pxswamp.js', 'pxbarren.js', 'pxcastle.js', 'pxvolcano.js', 'pxroots.js', 'pxsky.js', 'pxthunder.js', 'art.js', 'bg.js', 'arena.js', 'scene.js', 'woods.js', 'front.js', 'demon.js', 'sky.js', 'sky2.js', 'audio.js', 'core.js', 'econ.js', 'pet.js', 'hq.js', 'ui.js', 'view.js', 'skfx.js', 'skfx2.js', 'fmot.js', 'skillinfo.js', 'panels.js', 'data-skicon.js', 'data-masticon.js', 'hero.js', 'under.js', 'map.js', 'events.js', 'world30.js', 'weather.js', 'kitchen.js', 'trade.js', 'qol.js', 'salvage.js', 'dex.js', 'hall.js', 'achv.js', 'rarity.js', 'store.js', 'main.js']
NAME = '판타지상단키우기'   # 빌드 63 (11-11 사용자): 예전 「판타지세계 상단 키우기」
ICON_TITLE = '판타지 상단키우기'   # 앱 그림 제목은 두 줄 (띄어쓰기에서 나눈다)
VERSION = '0.7.0'

css = (SRC / 'style.css').read_text(encoding='utf-8')
markup = (SRC / 'markup.html').read_text(encoding='utf-8')
# 빌드 번호(CI에서 넣는다)와 저장소: 설치한 앱이 새 버전을 알아보는 데 쓴다
BUILD_NO = int(os.environ.get('BUILD_NO', '0') or 0)
REPO = os.environ.get('GITHUB_REPOSITORY', 'wlsdl2640-commits/ohmulgeori-sangdan')
js = f"const BUILD_NO = {BUILD_NO}, REPO = {json.dumps(REPO)};\n" + '\n'.join((SRC / f).read_text(encoding='utf-8') for f in JS)
script = "(() => {\n'use strict';\n" + js + "\n})();"

# ── 글꼴: 게임에 쓰인 글자 + 자주 쓰는 한글 2,350자만 남겨 크기를 줄인다 ──
chars = set(css + markup + js)
for cp in range(0xAC00, 0xD7A4):
    ch = chr(cp)
    try:
        ch.encode('euc-kr'); chars.add(ch)
    except UnicodeEncodeError:
        pass
chars |= {chr(c) for c in range(0x20, 0x7F)}
chars |= set('·…→←↑↓×★☆♥—–“”‘’「」『』〈〉《》%')

def subset_font(path):
    font = TTFont(path)
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    s = subset.Subsetter(options=opts)
    s.populate(text=''.join(sorted(chars)))
    s.subset(font)
    buf = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buf)
    return buf.getvalue()

faces = ''
for file, weight in [('Galmuri11.woff2', 400), ('Galmuri11-Bold.woff2', 700)]:
    data = subset_font(FONTS / file)
    print(f'{file}: {len(data) // 1024} KB')
    faces += ('@font-face{font-family:"Galmuri11";font-weight:%d;font-style:normal;font-display:swap;'
              'src:url(data:font/woff2;base64,%s) format("woff2")}\n' % (weight, base64.b64encode(data).decode()))

style = '<style>\n' + faces + css + '\n</style>'
body = markup + '\n<script>\n' + script + '\n</script>\n'

# ── 1) 바로 플레이용 (아티팩트): 문서 뼈대 없이 본문만 ──
DIST.mkdir(exist_ok=True)
(DIST / 'play.html').write_text(
    f'<title>{NAME}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n' + style + '\n' + body, encoding='utf-8')

# ── 2) 설치형 웹앱 ──
WEB = DIST / 'web'
if WEB.exists():
    shutil.rmtree(WEB)
(WEB / 'icons').mkdir(parents=True)
head = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<title>{NAME}</title>
<meta name="description" content="몬스터 부속품을 다루는 상단을 키우는 방치형 경영 게임">
<meta name="theme-color" content="#0e1118">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="{NAME}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
{style}
</head>
<body>
'''
(WEB / 'index.html').write_text(head + body + '</body>\n</html>\n', encoding='utf-8')

# 아이콘: 금화 주머니 도트
# 아이콘 (빌드 47): 밤의 상단 앞 · 모험가 다섯 · 왕국 마차 · 건물 위 게임 제목 — tools/appart.py
import sys as _sys
_sys.path.insert(0, str(ROOT / 'tools'))
import appart
_art = appart.art_square(ICON_TITLE)
appart.fit(_art, 192).save(WEB / 'icons' / 'icon-192.png')
appart.fit(_art, 512).save(WEB / 'icons' / 'icon-512.png')
appart.adaptive_fg(appart.art_square(ICON_TITLE, y0=46), 512, 0.8).save(WEB / 'icons' / 'maskable-512.png')   # 가려지는 가장자리를 빼고 가운데 80%에 · 제목은 조금 아래
appart.fit(_art, 180).save(WEB / 'icons' / 'apple-touch-icon.png')

manifest = {
    'name': NAME, 'short_name': NAME, 'lang': 'ko', 'version': VERSION,
    'description': '몬스터 부속품을 다루는 상단을 키우는 방치형 경영 게임',
    'start_url': './', 'scope': './', 'display': 'standalone', 'orientation': 'portrait',
    'background_color': '#0b0d12', 'theme_color': '#0e1118',
    'icons': [
        {'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
        {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
        {'src': 'icons/maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
    ],
}
(WEB / 'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

(WEB / 'sw.js').write_text(f'''// 오프라인 실행용 캐시
const CACHE = 'ohmul-{VERSION}';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); }});
self.addEventListener('fetch', e => {{
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {{
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }}).catch(() => caches.match('./index.html'))));
}});
''', encoding='utf-8')

shutil.copy(FONTS / 'Galmuri-OFL.txt', WEB / 'Galmuri-OFL.txt')
(WEB / '설치 방법.txt').write_text(f'''{NAME} {VERSION} — 설치 방법

이 폴더는 그대로 인터넷에 올리면 바로 플레이되고, 폰과 PC에 앱처럼 설치되는 웹 게임입니다.
설치와 오프라인 실행은 https 주소에서만 작동합니다.

1. 인터넷에 올리기 (무료, 둘 중 하나)
   - Netlify Drop: app.netlify.com/drop 에 이 폴더를 통째로 끌어다 놓으면 주소가 생깁니다.
   - GitHub Pages: 저장소를 만들어 이 폴더의 파일을 올리고, 설정 > Pages 에서 켭니다.

2. 기기에 설치하기
   - 아이폰: Safari로 주소 열기 > 공유 버튼 > 홈 화면에 추가
   - 안드로이드: Chrome으로 주소 열기 > 메뉴(⋮) > 앱 설치 (또는 홈 화면에 추가)
   - PC: Chrome이나 Edge로 주소 열기 > 주소창 오른쪽의 설치 버튼

3. 안드로이드 설치 파일(APK)이 필요하면
   - pwabuilder.com 에 1번에서 받은 주소를 넣고 Android 패키지를 받으면 됩니다.
   - 구글 플레이 출시용 파일(AAB)도 같은 곳에서 만들 수 있습니다. (플레이 개발자 계정 필요)

저장: 진행 상황은 기기 브라우저에 저장됩니다. 앱을 지우거나 사이트 데이터를 지우면 함께 사라집니다.
글꼴: 갈무리(Galmuri) — SIL Open Font License 1.1 (Galmuri-OFL.txt 참고)
''', encoding='utf-8')

zpath = DIST / 'ohmulgeori-sangdan-web.zip'
with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(WEB.rglob('*')):
        if f.is_file():
            z.write(f, pathlib.Path('ohmulgeori-sangdan') / f.relative_to(WEB))
print('play.html', (DIST / 'play.html').stat().st_size // 1024, 'KB')
print('web/index.html', (WEB / 'index.html').stat().st_size // 1024, 'KB')
print('zip', zpath.stat().st_size // 1024, 'KB')
