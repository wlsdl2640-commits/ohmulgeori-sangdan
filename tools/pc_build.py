#!/usr/bin/env python3
"""PC 판(윈도우 10 · 11, 64비트) — 웹 판 dist/web을 일렉트론 창(desktop/main.js)에 담아 ZIP 하나로 싼다.

쓰는 법:  BUILD_NO=N python3 build.py        # 먼저 웹 판을 만든다
          python3 tools/pc_build.py           # → dist/pc/ohmulgeori-sangdan-pc-buildN.zip
고를 것(환경 변수):
  PC_WEB    웹 판 폴더(기본 dist/web)       PC_OUT   내놓을 폴더(기본 dist/pc)
  PC_TOOLS  @electron/packager가 깔린 폴더(기본 build/pctools — 없으면 npm으로 깐다)
  PC_ELECTRON  일렉트론 판(기본 아래 ELECTRON)
리눅스에서도 윈도우 exe를 만든다(packager가 resedit으로 아이콘 · 판 정보를 넣으므로 wine이 필요 없다).
판 정보에 사람 이름이나 메일은 넣지 않는다.
"""
import hashlib, json, os, re, shutil, subprocess, sys, unicodedata, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = Path(os.environ.get('PC_WEB') or ROOT / 'dist' / 'web')
OUT = Path(os.environ.get('PC_OUT') or ROOT / 'dist' / 'pc')
TOOLS = Path(os.environ.get('PC_TOOLS') or ROOT / 'build' / 'pctools')
ELECTRON = os.environ.get('PC_ELECTRON') or '44.9.3'
PACKAGER = '20.3.0'
NAME = '판타지상단키우기'
KEEP_LOCALES = {'ko.pak', 'en-US.pak'}   # 크로미움 UI 글(오른쪽 단추 메뉴 등) — 한국어와 기본 영어만 남긴다


def die(msg):
    sys.exit('PC 판: ' + msg)


def main():
    html = WEB / 'index.html'
    if not html.exists():
        die(f'{html}가 없다 — 먼저 BUILD_NO=N python3 build.py')
    m = re.search(r'const BUILD_NO = (\d+)', html.read_text(encoding='utf-8'))
    n = int(m.group(1)) if m else 0
    if not n:
        die('웹 판의 BUILD_NO가 0이다 — BUILD_NO=N python3 build.py로 다시 만든다')
    ver = re.search(r"VERSION = '([0-9.]+)'", (ROOT / 'build.py').read_text(encoding='utf-8')).group(1)
    app_ver = '.'.join(ver.split('.')[:2] + [str(n)])   # 안드로이드 versionName과 같은 0.7.N

    stage = OUT / 'stage'
    shutil.rmtree(stage, ignore_errors=True)
    app = stage / 'app'
    (app / 'game').mkdir(parents=True)
    shutil.copy2(ROOT / 'desktop' / 'main.js', app / 'main.js')
    (app / 'package.json').write_text(json.dumps({
        'name': 'ohmulgeori-sangdan-pc', 'productName': NAME, 'version': app_ver,
        'description': NAME, 'main': 'main.js', 'private': True}, ensure_ascii=False, indent=2), encoding='utf-8')
    for p in WEB.iterdir():   # 웹 설치 안내(설치 방법.txt) · 서비스 워커는 PC 판에서 쓰지 않는다
        if p.name in ('설치 방법.txt', 'sw.js'):
            continue
        (shutil.copytree if p.is_dir() else shutil.copy2)(p, app / 'game' / p.name)
    icon_png = WEB / 'icons' / 'icon-512.png'
    shutil.copy2(icon_png, app / 'icon.png')
    from PIL import Image
    Image.open(icon_png).convert('RGBA').save(stage / 'icon.ico', sizes=[(s, s) for s in (16, 20, 24, 32, 40, 48, 64, 128, 256)])

    if not (TOOLS / 'node_modules' / '@electron' / 'packager').exists():
        TOOLS.mkdir(parents=True, exist_ok=True)
        subprocess.run(['npm', 'i', '--no-audit', '--no-fund', '--prefix', str(TOOLS), f'@electron/packager@{PACKAGER}'], check=True)
    (TOOLS / 'pack.mjs').write_text(
        "import { packager } from '@electron/packager';\n"
        "const paths = await packager(JSON.parse(process.argv[2]));\n"
        "console.log(JSON.stringify(paths));\n", encoding='utf-8')
    opts = {
        'dir': str(app), 'out': str(stage / 'out'), 'overwrite': True, 'asar': True, 'prune': False,
        'platform': 'win32', 'arch': 'x64', 'electronVersion': ELECTRON,
        'name': NAME, 'executableName': NAME, 'appVersion': app_ver, 'buildVersion': app_ver,
        'icon': str(stage / 'icon.ico'), 'appCopyright': NAME,
        'win32metadata': {'CompanyName': NAME, 'FileDescription': NAME, 'ProductName': NAME,
                          'InternalName': 'ohmulgeori-sangdan-pc', 'OriginalFilename': NAME + '.exe'},
    }
    r = subprocess.run(['node', str(TOOLS / 'pack.mjs'), json.dumps(opts, ensure_ascii=False)],
                       cwd=TOOLS, capture_output=True, text=True)
    if r.returncode:
        die('packager 실패\n' + r.stdout + r.stderr)
    built = Path(json.loads(r.stdout.strip().splitlines()[-1])[0])

    # packager가 이름을 filenamify로 거르며 한글을 풀어쓴 자모(NFD)로 바꾼다 → 윈도우 탐색기에서 「ㅍㅏㄴ…」으로 보인다.
    # 모아쓴 글자(NFC)로 되돌린다. exe 이름이 바뀌어도 일렉트론은 같은 폴더의 resources를 그대로 읽는다.
    for p in sorted(built.rglob('*'), key=lambda q: -len(q.parts)):
        if not unicodedata.is_normalized('NFC', p.name):
            p.rename(p.with_name(unicodedata.normalize('NFC', p.name)))
    nfc = built.with_name(unicodedata.normalize('NFC', built.name))
    if nfc != built:
        shutil.rmtree(nfc, ignore_errors=True)
        built = built.rename(nfc)
    exe = built / f'{NAME}.exe'
    if not exe.exists():
        die(f'{exe.name}가 없다')
    for p in (built / 'locales').iterdir():
        if p.name not in KEEP_LOCALES:
            p.unlink()
    shutil.copy2(WEB / 'Galmuri-OFL.txt', built / 'Galmuri-OFL.txt')
    readme = (ROOT / 'desktop' / '실행 방법.txt').read_text(encoding='utf-8')
    readme = readme.replace('{VER}', app_ver).replace('{N}', str(n)).replace('{ELECTRON}', ELECTRON)
    (built / '실행 방법.txt').write_text(readme.replace('\n', '\r\n'), encoding='utf-8-sig')   # 메모장에서 바로 읽히게

    top = f'{NAME} PC (빌드 {n})'   # 압축 안의 맨 위 폴더 — 「여기에 풀기」로 풀어도 파일이 흩어지지 않게
    zpath = OUT / f'ohmulgeori-sangdan-pc-build{n}.zip'
    zpath.unlink(missing_ok=True)
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in sorted(built.rglob('*')):
            if p.is_file():
                z.write(p, unicodedata.normalize('NFC', f'{top}/{p.relative_to(built).as_posix()}'))
    h = hashlib.sha256(zpath.read_bytes()).hexdigest()
    raw = sum(p.stat().st_size for p in built.rglob('*') if p.is_file())
    print(json.dumps({'zip': str(zpath), 'mb': round(zpath.stat().st_size / 2**20, 1), 'raw_mb': round(raw / 2**20, 1),
                      'sha256': h, 'build': n, 'version': app_ver, 'electron': ELECTRON, 'dir': str(built)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
