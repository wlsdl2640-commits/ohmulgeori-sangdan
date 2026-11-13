"""장비 종류마다 한 장: 입는 직업 그림이 맨 앞 · 그 뒤로 착용 레벨 순 그림 — python3 cards.py <catalog.json> <출력 폴더>"""
import json, sys, io, base64, re, os
from fontTools import subset
from fontTools.ttLib import TTFont
from playwright.sync_api import sync_playwright

cat = json.load(open(sys.argv[1], encoding='utf-8')); OUT = sys.argv[2]
import pathlib
FONTS = str(pathlib.Path(__file__).resolve().parents[2] / 'fonts') + '/'
slots = dict(cat['slots'])
wear = {b: [] for b in cat['types']}
for L in cat['lines']:
    for j in L['jobs']:
        for s, TL in cat['jobs'][j]['slots']:
            for b in TL:
                if j not in wear[b]: wear[b].append(j)
cat['wear'] = wear

CSS = r"""
:root { --bg: #12141c; --panel: #1b1f2b; --panel2: #232838; --line: #343b52; --fg: #ece5d3; --muted: #a5a1ae; --dim: #6c6a78;
  --gold: #e6b450; --ribbon: #a8322c; --drop: #6cc46f; --craft: #e8973a; --arena: #e0584f; --buy: #5ea6e6; --fut: #8b7fd0; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: #0b0c12; font-family: "Galmuri11", "Noto Sans KR", sans-serif; color: var(--fg); }
#card { width: 1080px; background: var(--bg); padding: 30px 32px 26px; display: grid; gap: 18px; }
.hd { display: grid; gap: 8px; }
.eyebrow { font-size: 17px; letter-spacing: 0.14em; color: var(--muted); }
.ttl { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; }
.ttl b { font-size: 40px; color: var(--gold); line-height: 1.15; }
.tag { font-size: 16px; padding: 2px 8px; border: 2px solid var(--line); color: var(--muted); }
.who { font-size: 18px; color: var(--fg); }
.who span { color: var(--muted); }
.jobs { display: flex; flex-wrap: wrap; gap: 12px 14px; align-items: end; background: var(--panel); border: 2px solid var(--line); padding: 14px 16px; }
.jb { display: grid; justify-items: center; gap: 6px; }
.jb .sp { display: grid; place-items: end center; }
.jb img { image-rendering: pixelated; display: block; }
.jb span { font-size: 16px; color: var(--fg); white-space: nowrap; }
.jb i { font-style: normal; font-size: 13px; color: var(--gold); }
.allj { font-size: 20px; color: var(--gold); align-self: center; padding-left: 6px; }
.grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.t { background: var(--panel); border: 2px solid var(--line); display: grid; grid-template-rows: auto auto; }
.t .ic { height: 128px; display: grid; place-items: center; background: var(--panel2); border-bottom: 2px solid var(--line); }
.t .ic img { width: 112px; height: 112px; object-fit: contain; }
.t .ic img.px { image-rendering: pixelated; }
.t .tx { padding: 8px 9px 9px; display: grid; gap: 4px; align-content: start; }
.t .nm { font-size: 17px; font-weight: 700; line-height: 1.25; }
.t .lv { font-size: 15px; color: var(--gold); }
.t .st { font-size: 13px; color: var(--muted); line-height: 1.35; }
.t .pp { display: flex; gap: 4px; margin-top: 2px; }
.t .pp i { width: 12px; height: 12px; display: block; }
.d { background: var(--drop); } .c { background: var(--craft); } .a { background: var(--arena); } .b { background: var(--buy); }
.t.fut { border-style: dashed; border-color: var(--fut); background: transparent; }
.t.fut .ic { background: transparent; border-bottom: 2px dashed var(--fut); }
.t.fut .ic img { opacity: 0.6; }
.t.fut .lv { color: var(--fut); }
.ft { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 15px; color: var(--muted); border-top: 2px solid var(--line); padding-top: 12px; align-items: center; }
.ft span { display: inline-flex; align-items: center; gap: 6px; }
.ft i { width: 12px; height: 12px; display: inline-block; }
.ft i.f { border: 2px dashed var(--fut); width: 14px; height: 14px; }
.note { font-size: 15px; color: var(--dim); }
"""

JS = r"""
const D = JSON.parse(document.getElementById('cat').textContent);
const URL_ = [];
const iu = i => { if (URL_[i]) return URL_[i]; const du = D.icons[i], c = du.indexOf(','), mime = du.slice(5, du.indexOf(';')), bin = atob(du.slice(c + 1)), u8 = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k); return (URL_[i] = URL.createObjectURL(new Blob([u8], { type: mime }))); };
const px = i => !D.icons[i].startsWith('data:image/webp');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const SLOTN = Object.fromEntries(D.slots), TIER = ['', '1차', '2차', '3차', '4차'];
const titleOf = b => { const T = D.types[b]; return (/^rs_|^sk_/.test(b) ? T.name + ' · ' + T.list[0].n.replace(/ Lv\d+$/, '') : T.name); };
window.render = (b, no) => {
  const T = D.types[b], W = D.wear[b], all = T.all;
  const tags = [T.two ? '두 손' : '', T.arena ? '투기장 상단 전용' : '', T.ammo ? '쓰는 만큼 줄어듦' : '', T.ladder ? '그림마다 착용 레벨' : ''].filter(Boolean).map(x => `<span class="tag">${x}</span>`).join('');
  const ids = all ? D.lines.map(L => L.jobs[0]) : W, sc = ids.length <= 8 ? 3 : 2;
  const jobs = ids.map(c => { const J = D.jobs[c]; return `<div class="jb"><div class="sp"><img src="${iu(J.img)}" width="${J.iw * sc}" height="${J.ih * sc}" alt=""></div><span>${esc(J.name)}</span>${all ? '' : `<i>${TIER[J.tier]} · Lv${J.lv}</i>`}</div>`; }).join('') + (all ? `<div class="allj">모든 직업 (${Object.keys(D.jobs).length}개)</div>` : '');
  const tiles = T.list.map(e => `<div class="t${e.on ? '' : ' fut'}"><div class="ic"><img class="${px(e.i) ? 'px' : ''}" src="${iu(e.i)}" alt=""></div><div class="tx"><div class="nm">${esc(e.n)}</div><div class="lv">${e.lv != null ? 'Lv' + e.lv + (e.tn ? ' · ' + esc(e.tn) : e.on ? '' : ' · 그림만') : '그림만 · 땅이 생기면'}</div>${e.st ? `<div class="st">${esc(e.st)}</div>` : ''}<div class="pp">${e.on ? [...e.s].map(s => `<i class="${s}"></i>`).join('') : ''}</div></div></div>`).join('');
  const note = T.ladder && T.n === 16 ? '<div class="note">Lv160 ~ 200 그림은 아직 없어요.</div>' : '';
  document.getElementById('card').innerHTML = `<div class="hd"><div class="eyebrow">${esc(SLOTN[T.slot])} · ${no}</div><div class="ttl"><b>${esc(titleOf(b))}</b>${tags}</div><div class="who"><span>입는 직업</span> ${esc(T.who)}</div></div>
    <div class="jobs">${jobs}</div><div class="grid">${tiles}</div>${note}
    <div class="ft"><span><i class="d"></i>몬스터가 떨어뜨림</span><span><i class="c"></i>대장간에서 만듦</span><span><i class="a"></i>투기장 상단</span><span><i class="b"></i>대장간에서 삼</span><span><i class="f"></i>그림만 있음(그 레벨 땅이 생기면)</span><span>능력치는 일반 등급 · 판타지상단키우기 빌드 67 작업판</span></div>`;
  return Promise.all([...document.images].map(im => im.decode().catch(() => 0)));
};
"""

text = json.dumps({k: v for k, v in cat.items() if k != 'icons'}, ensure_ascii=False) + CSS + JS + '모든 직업 개 입는 직업 다음 단계 그림만 몬스터가 떨어뜨림 대장간에서 만듦 투기장 상단 대장간에서 삼 그림만 있음(그 레벨 땅이 생기면) 능력치는 일반 등급 · 판타지상단키우기 빌드 67 작업판 1차 2차 3차 4차 Lv0123456789 두 손 투기장 상단 전용 쓰는 만큼 줄어듦 그림마다 착용 레벨 Lv160 ~ 200 그림은 아직 없어요.'
chars = set(text) | {chr(c) for c in range(0x20, 0x7F)}
def sub(path):
    f = TTFont(path); o = subset.Options(); o.flavor = 'woff2'; o.layout_features = ['*']
    s = subset.Subsetter(options=o); s.populate(text=''.join(sorted(chars))); s.subset(f)
    b = io.BytesIO(); f.flavor = 'woff2'; f.save(b); return base64.b64encode(b.getvalue()).decode()
faces = ''.join('@font-face{font-family:"Galmuri11";font-weight:%d;font-style:normal;src:url(data:font/woff2;base64,%s) format("woff2")}\n' % (w, sub(FONTS + f)) for f, w in [('Galmuri11.woff2', 400), ('Galmuri11-Bold.woff2', 700)])
data = json.dumps(cat, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = '<!doctype html><html><head><meta charset="utf-8"><style>' + faces + CSS + '</style></head><body><div id="card"></div><script type="application/json" id="cat">' + data + '</script><script>' + JS + '</script></body></html>'
os.makedirs(OUT, exist_ok=True)
page_path = os.path.join(OUT, '..', 'cards.html'); open(page_path, 'w', encoding='utf-8').write(html)

order = []
slot_order = [s for s, _ in cat['slots']]
type_order = list(cat['types'].keys())
# 직업 카드에 나온 차례(무기 · 부장비 …)를 따르고, 공용은 그 칸 끝에
seen = []
for s in slot_order:
    for j in [j for L in cat['lines'] for j in L['jobs']]:
        for s2, TL in cat['jobs'][j]['slots']:
            if s2 == s:
                for b in TL:
                    if b not in seen: seen.append(b)
    for s2, TL in cat['common']:
        if s2 == s:
            for b in TL:
                if b not in seen: seen.append(b)
missing = [b for b in type_order if b not in seen]
order = seen + missing
safe = lambda s: re.sub(r'[\\/:*?"<>| ·]+', '_', s).strip('_')
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={'width': 1080, 'height': 1200}, device_scale_factor=1)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + os.path.abspath(page_path)); pg.wait_for_timeout(800)
    pg.evaluate("document.fonts.ready.then(() => 1)")
    files = []
    for n, b in enumerate(order, 1):
        T = cat['types'][b]
        title = (T['name'] + '_' + re.sub(r' Lv\d+$', '', T['list'][0]['n'])) if (b.startswith('rs_') or b.startswith('sk_')) else T['name']
        pg.evaluate("([b, no]) => window.render(b, no)", [b, f'{n:02d}'])
        pg.wait_for_timeout(60)
        fn = os.path.join(OUT, f"{n:02d}_{safe(slots[T['slot']])}_{safe(title)}.png")
        pg.locator('#card').screenshot(path=fn)
        files.append(fn)
    print('errors', errs); br.close()
print(len(files), 'files'); open(os.path.join(OUT, '..', 'files.txt'), 'w', encoding='utf-8').write('\n'.join(files))
